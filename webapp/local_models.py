"""Portable, offline inference commands for the optional local models."""

from __future__ import annotations

import json
import base64
import hashlib
import logging
import os
import re
import shutil
import subprocess
import time
from functools import lru_cache
from pathlib import Path

from safetensors import SafetensorError, safe_open

PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODEL_ROOT = Path.home() / ".omlx" / "models" / "pipenetwork"
GEMMA_PATH = MODEL_ROOT / "gemma-3-12b-it-4bit"
IMAGE_MODELS = {
    "flux2-klein-4b": "FLUX.2-klein-4B",
    "z-image-turbo": "Z-Image-Turbo",
}
VIDEO_MODELS = {
    "ltx-2.3-distilled-q4": "ltx-2.3-mlx-q4",
    "ltx-2.3-distilled-q8": "ltx-2.3-mlx-q8",
}
MUSIC_MODELS = {
    "yue2-3b-8bit": "mlx-Yue2-3B",
}
YUE_VAE_PATH = MODEL_ROOT / "YuE2-Vae"
YUE_FILES = ("config.json", "conversion.json", "qwen.tiktoken", "ar-bf16.safetensors", "ar-8bit.safetensors", "nar-bf16.safetensors")
LTX_FILES = (
    "config.json", "embedded_config.json", "quantize_config.json",
    "transformer-distilled-1.1.safetensors", "connector.safetensors",
    "audio_vae.safetensors", "vae_decoder.safetensors", "vae_encoder.safetensors",
    "vocoder.safetensors", "spatial_upscaler_x2_v1_1.safetensors",
    "spatial_upscaler_x2_v1_1_config.json",
)
logger = logging.getLogger(__name__)


def download_progress(model: str, directory: Path) -> dict:
    """Count each snapshot file once, including only its newest partial attempt."""
    try:
        catalog = json.loads((PROJECT_ROOT / "third_party/local_model_downloads.json").read_text())
        manifest = json.loads((PROJECT_ROOT / "third_party/local_models.json").read_text())
        spec = catalog[model]
        if spec["revision"] != manifest["models"][model]["revision"]:
            raise ValueError("Download catalog revision does not match the model manifest.")
        downloaded = 0
        total = 0
        completed = True
        active = False
        now = time.time()
        for relative, expected in spec["files"].items():
            total += expected
            target = directory / relative
            if target.is_file() and target.stat().st_size == expected:
                downloaded += expected
                continue
            completed = False
            # Hub hashes the metadata basename; newer versions add random attempt suffixes.
            digest = base64.urlsafe_b64encode(
                hashlib.sha1(f"{target.name}.metadata".encode()).digest()
            ).decode()
            cache = directory / ".cache/huggingface/download" / Path(relative).parent
            partials = []
            for item in cache.glob(f"{digest}.*.incomplete"):
                try:
                    partials.append(item.stat())
                except FileNotFoundError:
                    continue  # Download may atomically move a completed file.
            if partials:
                latest = max(partials, key=lambda stat: stat.st_mtime_ns)
                downloaded += min(latest.st_size, expected)
                active |= now - latest.st_mtime < 300
        percent = 100.0 if completed else min(99.9, downloaded / total * 100)
        return {
            "download_state": "completed" if completed else "downloading" if active else
                "paused" if downloaded else "not_started",
            "downloaded_bytes": downloaded, "total_bytes": total,
            "download_percent": round(percent, 1), "download_in_progress": active and not completed,
            "download_error": "",
        }
    except (OSError, ValueError, KeyError, TypeError) as exc:
        logger.warning("Cannot inspect download progress for %s: %s", model, exc)
        return {"download_state": "error", "download_error": str(exc),
                "download_percent": None, "download_in_progress": False}


def model_download_progress(model: str, directory: Path | None = None, gemma_path: Path | None = None) -> dict:
    progress = download_progress(model, directory or model_path(model))
    if model in VIDEO_MODELS:
        gemma = download_progress("gemma-3-12b-it-4bit", gemma_path or GEMMA_PATH)
        components = [dict(progress, name="model"), dict(gemma, name="Gemma")]
    elif model in MUSIC_MODELS:
        gemma = download_progress("yue2-vae", gemma_path or YUE_VAE_PATH)
        components = [dict(progress, name="model"), dict(gemma, name="VAE")]
    else:
        return progress
    if any(part["download_state"] == "error" for part in components):
        return {"download_state": "error", "download_percent": None,
                "download_in_progress": False, "download_error":
                "; ".join(part["download_error"] for part in components if part["download_error"]),
                "download_components": components}
    downloaded = progress["downloaded_bytes"] + gemma["downloaded_bytes"]
    total = progress["total_bytes"] + gemma["total_bytes"]
    complete = all(part["download_state"] == "completed" for part in components)
    active = any(part["download_in_progress"] for part in components)
    return {
        "download_state": "completed" if complete else "downloading" if active else
            "paused" if downloaded else "not_started",
        "download_percent": 100.0 if complete else round(min(99.9, downloaded / total * 100), 1),
        "downloaded_bytes": downloaded, "total_bytes": total,
        "download_in_progress": active, "download_error": "", "download_components": components,
    }


def model_path(model: str) -> Path:
    names = {**IMAGE_MODELS, **VIDEO_MODELS, **MUSIC_MODELS}
    if model not in names:
        raise ValueError("invalid_generation_model")
    return MODEL_ROOT / names[model]


def runtime_root(model: str) -> Path:
    if model in MUSIC_MODELS:
        return PROJECT_ROOT / "third_party" / "mlx_yue"
    return PROJECT_ROOT / "third_party" / ("mflux" if model in IMAGE_MODELS else "ltx_2_mlx")


def _weights_ready(directory: Path, single: str, index: str) -> bool:
    if (directory / single).is_file():
        return (directory / single).stat().st_size > 8
    index_path = directory / index
    if not index_path.is_file():
        return False
    try:
        payload = json.loads(index_path.read_text())
        mapping = payload["weight_map"]
        if not isinstance(mapping, dict) or not mapping:
            return False
        return all(
            isinstance(name, str) and Path(name).name == name
            and (directory / name).is_file() and (directory / name).stat().st_size > 8
            for name in mapping.values()
        )
    except (OSError, ValueError, KeyError, TypeError):
        return False


def _mlx_weights_ready(directory: Path) -> bool:
    """Match mlx-lm's file discovery without trusting stale shard filenames."""
    try:
        files = sorted(directory.glob("model*.safetensors"))
        if not files:
            return False
        numbered = [re.fullmatch(r"model-(\d+)-of-(\d+)\.safetensors", path.name)
                    for path in files]
        if any(numbered):
            if not all(numbered):
                raise ValueError("Mixed single-file and numbered MLX weights.")
            shards = [(int(match[1]), int(match[2])) for match in numbered if match]
            total = shards[0][1]
            if total < 1 or any(count != total for _, count in shards) or (
                sorted(number for number, _ in shards) != list(range(1, total + 1))
            ):
                raise ValueError("Incomplete or inconsistent MLX shard sequence.")
        keys = set()
        for path in files:
            with safe_open(path, framework="numpy") as weights:
                shard_keys = set(weights.keys())
            if not shard_keys or keys.intersection(shard_keys):
                raise ValueError("Empty MLX weights or duplicate tensor names.")
            keys.update(shard_keys)
        index = directory / "model.safetensors.index.json"
        if index.exists():
            mapping = json.loads(index.read_text())["weight_map"]
            if not isinstance(mapping, dict) or not mapping or not all(
                isinstance(name, str) and isinstance(shard, str)
                and Path(shard).name == shard for name, shard in mapping.items()
            ):
                raise ValueError("Invalid MLX tensor index.")
            if not set(mapping).issubset(keys):
                raise ValueError("MLX weights are missing indexed tensors.")
        return True
    except (OSError, ValueError, KeyError, TypeError, SafetensorError) as exc:
        logger.warning("Cannot validate MLX weights in %s: %s", directory, exc)
        return False


@lru_cache(maxsize=8)
def _runtime_error(model: str, python_mtime: int, site_mtime: int) -> str:
    root = runtime_root(model)
    imports = (
        "from mflux.models.flux2.variants import Flux2Klein; "
        "from mflux.models.z_image.variants.z_image import ZImage"
        if model in IMAGE_MODELS else "import soundfile; from lyra import YuE2Pipeline"
        if model in MUSIC_MODELS else "import ltx_pipelines_mlx.cli"
    )
    try:
        result = subprocess.run(
            [str(root / ".venv/bin/python"), "-c", imports],
            env=environment(model), capture_output=True, text=True, timeout=30,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        return str(exc)
    return result.stderr[-2000:] if result.returncode else ""


def status(model: str, directory: Path | None = None, gemma_path: Path | None = None) -> dict:
    path = directory or model_path(model)
    gemma_path = gemma_path or (YUE_VAE_PATH if model in MUSIC_MODELS else GEMMA_PATH)
    root = runtime_root(model)
    python = root / ".venv" / "bin" / "python"
    if model in IMAGE_MODELS:
        ready = all((path / name).is_file() for name in (
            "model_index.json", "tokenizer/tokenizer.json", "text_encoder/config.json",
            "transformer/config.json", "vae/config.json", "vae/diffusion_pytorch_model.safetensors",
        )) and _weights_ready(
            path / "text_encoder", "model.safetensors", "model.safetensors.index.json"
        ) and _weights_ready(
            path / "transformer", "diffusion_pytorch_model.safetensors",
            "diffusion_pytorch_model.safetensors.index.json",
        )
        code_ready = (root / "src/mflux/__init__.py").is_file()
        source = "black-forest-labs/FLUX.2-klein-4B" if model == "flux2-klein-4b" else "Tongyi-MAI/Z-Image-Turbo"
    elif model in MUSIC_MODELS:
        ready = all((path / name).is_file() and (path / name).stat().st_size > 0 for name in YUE_FILES)
        ready = ready and (gemma_path / "config.json").is_file() and _weights_ready(
            gemma_path, "model.safetensors", "model.safetensors.index.json"
        )
        code_ready = (root / "src/lyra/__init__.py").is_file() and shutil.which("ffmpeg") is not None
        source = "vanch007/mlx-Yue2-3B"
    else:
        ready = all((path / name).is_file() and (path / name).stat().st_size > 0 for name in LTX_FILES)
        ready = ready and all((gemma_path / name).is_file() for name in (
            "config.json", "tokenizer.json", "tokenizer_config.json",
        )) and _mlx_weights_ready(gemma_path)
        code_ready = all((root / name).is_file() for name in (
            "packages/ltx-pipelines-mlx/src/ltx_pipelines_mlx/cli.py",
            "packages/ltx-core-mlx/src/ltx_core_mlx/__init__.py",
        )) and shutil.which("ffmpeg") is not None
        source = f"dgrauet/{VIDEO_MODELS[model]}"
    runtime_ready = code_ready and python.is_file() and os.access(python, os.X_OK)
    runtime_error = ""
    if runtime_ready:
        sites = list((root / ".venv/lib").glob("python*/site-packages"))
        runtime_error = _runtime_error(
            model, python.stat().st_mtime_ns,
            max((site.stat().st_mtime_ns for site in sites), default=0),
        )
        runtime_ready = not runtime_error
    else:
        runtime_error = "Bundled source, executable environment, or FFmpeg is missing."
    return {
        "id": model, "model_path": str(path), "model_ready": ready,
        "runtime_ready": runtime_ready, "runtime_error": runtime_error,
        "model_download_url": f"https://huggingface.co/{source}",
        "code_path": str(root),
        "download_catalog": True,
        **model_download_progress(model, path, gemma_path),
    }


def environment(model: str) -> dict[str, str]:
    root = runtime_root(model)
    sources = [root / "src"] if model in IMAGE_MODELS or model in MUSIC_MODELS else [
        root / "packages/ltx-core-mlx/src", root / "packages/ltx-pipelines-mlx/src",
    ]
    base = {key: value for key, value in os.environ.items() if not (
        model in MUSIC_MODELS and key in {"PYTORCH_ENABLE_MPS_FALLBACK", "PYTORCH_MPS_FAST_MATH"}
    )}
    return {
        **base, "PYTHONPATH": os.pathsep.join(map(str, sources)),
        "HF_HUB_OFFLINE": "1", "TRANSFORMERS_OFFLINE": "1",
        "HF_HUB_DISABLE_IMPLICIT_TOKEN": "1", "PYTHONUNBUFFERED": "1",
    }


def command(settings: dict, output: Path, first_frame: Path | None = None) -> list[str]:
    model = settings["model"]
    root = runtime_root(model)
    python = str(root / ".venv/bin/python")
    common = [
        "--prompt", settings["prompt"], "--seed", str(settings["seed"]),
        "--width", str(settings["width"]), "--height", str(settings["height"]),
        "--output", str(output),
    ]
    if model in IMAGE_MODELS:
        return [
            python, "-u", str(PROJECT_ROOT / "scripts/generate_local_image.py"),
            "--model", model, "--model-path", str(settings.get("model_path", model_path(model))),
            "--steps", str(settings["steps"]), *common,
        ]
    args = [
        python, "-u", "-m", "ltx_pipelines_mlx.cli", "generate",
        "--model", str(settings.get("model_path", model_path(model))),
        "--gemma", str(settings.get("gemma_path", GEMMA_PATH)),
        "--distilled", "--low-ram", "--stage1-steps", "8", "--stage2-steps", "3",
        "--frames", str(settings["num_frames"]), "--frame-rate", "24", *common,
    ]
    if first_frame is not None:
        args += ["--image", str(first_frame), "0", "1.0"]
    return args
