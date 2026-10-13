"""Adapter for the self-contained, premerged FastH3 VSA Q8 package."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
from functools import lru_cache
from pathlib import Path

MODEL_ID = "h3-fasth3-vsa-q8"
DIRECTORY = "MiniMax-H3-FastH3-VSA-DataFree-MLX-Q8"
RUNTIME_ROOT = Path(__file__).resolve().parents[1] / "third_party/mere_run"
VERSION = "0.62.1"
ADAPTER = "fastvideo_fasth3_4step_v1_vsa_datafree_rank64.safetensors"
FILES = (
    "config.json", "mererun_model.json", "transformer.safetensors",
    "text_encoder.safetensors", "video_vae.safetensors", "audio_vae.safetensors",
    "tokenizer.json", "tokenizer_config.json", ADAPTER,
    "fastvideo_fasth3_v1_vsa_datafree_adaln_cache.safetensors",
)


def environment() -> dict[str, str]:
    return {
        **os.environ,
        "MERERUN_MODELS_DIR": str(RUNTIME_ROOT / ".models"),
        "MERERUN_HUB_CACHE": str(RUNTIME_ROOT / ".cache"),
        "HF_HUB_OFFLINE": "1",
        "HF_HUB_DISABLE_IMPLICIT_TOKEN": "1",
    }


@lru_cache(maxsize=4)
def _runtime_error(binary: str, mtime: int) -> str:
    try:
        result = subprocess.run(
            [binary, "--version"], capture_output=True, text=True,
            timeout=15, env=environment(),
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        return str(exc)
    if result.returncode or result.stdout.strip() != VERSION:
        return f"Expected mere.run {VERSION}: {result.stdout.strip()} {result.stderr[-1000:]}"
    return ""


def status(directory: Path) -> dict:
    model_error = ""
    try:
        missing = [name for name in FILES if not (directory / name).is_file()
                   or (directory / name).stat().st_size <= 8]
        if missing:
            raise ValueError(f"FastH3 package files missing or empty: {', '.join(missing)}")
        config = json.loads((directory / "config.json").read_text())
        recipe = json.loads((directory / "mererun_model.json").read_text())
        if (not isinstance(config, dict) or not isinstance(recipe, dict)
                or config.get("model_type") != "minimax_h3"
                or config.get("partition") != "fl2va"
                or config.get("quantization") != {"bits": 8, "group_size": 64, "mode": "affine"}
                or recipe.get("id") != "video-minimax-h3-fasth3-vsa-datafree-mlx"
                or recipe.get("defaults") != {"cfg": 1, "sigma_shift": 12, "steps": 5}):
            raise ValueError("Not a supported premerged FastH3 VSA Q8 package.")
    except (OSError, ValueError, TypeError) as exc:
        model_error = str(exc)
    binary = RUNTIME_ROOT / "runtime/mere.run"
    required = ("runtime/Resources/default.metallib",
                "runtime/MereRun_MereRunCore.bundle/Contents/Info.plist")
    error = ""
    if (not binary.is_file() or not os.access(binary, os.X_OK)
            or not all((RUNTIME_ROOT / name).is_file() for name in required)
            or not shutil.which("ffmpeg") or not shutil.which("ffprobe")):
        error = "Project-local mere.run, packaged resources, FFmpeg or ffprobe is missing."
    else:
        error = _runtime_error(str(binary), binary.stat().st_mtime_ns)
    return {
        "id": MODEL_ID, "model_path": str(directory),
        "model_ready": not model_error, "model_error": model_error,
        "runtime_ready": not error, "runtime_error": error,
        "code_path": str(RUNTIME_ROOT / "runtime"),
        "download_catalog": False,
        "supports_first_frame": False, "supports_continuous": False,
        "model_download_url": f"https://huggingface.co/Sawfwair/{DIRECTORY}",
    }


def command(settings: dict, output: Path, first_frame: Path | None = None) -> list[str]:
    if first_frame is not None:
        raise ValueError("fasth3_conditioning_unsupported")
    path = Path(settings["model_path"])
    args = [
        str(RUNTIME_ROOT / "runtime/mere.run"), "video", "generate", settings["prompt"],
        "--model-root", str(path), "--h3-adapter", str(path / ADAPTER),
        "--steps", "5", "--h3-adapter-strength", "1",
        "--width", str(settings["width"]), "--height", str(settings["height"]),
        "--num-frames", str(settings["num_frames"]), "--fps", "24",
        "--seed", str(settings["seed"]), "--output", str(output), "--progress-json",
    ]
    return args
