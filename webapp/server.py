"""Serve a localhost UI backed by MLX-Serve's MiniMax-H3 video endpoint."""

from __future__ import annotations

import base64
import binascii
import hashlib
import io
import json
import math
import os
import re
import shutil
import signal
import subprocess
import tempfile
import threading
import time
import uuid
import wave
from collections import deque
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import HTTPRedirectHandler, ProxyHandler, Request, build_opener, urlopen

from . import local_models, model_downloads, output_storage, prompt_settings, skill_conversion, workflows

PROJECT_ROOT = Path(__file__).resolve().parents[1]
MUSIC_GENERATE_SCRIPT = PROJECT_ROOT / "scripts" / "music3_generate.py"
STATIC_ROOT = PROJECT_ROOT / "webapp" / "static"
SETTINGS_PATH = PROJECT_ROOT / "settings.json"
MODELS_ROOT = Path.home() / ".omlx" / "models"
PIPENETWORK_ROOT = MODELS_ROOT / "pipenetwork"
DEFAULT_MODEL_PATH = PIPENETWORK_ROOT / "MiniMax-H3-FL2VA-MLX-Serve-4bit"
HIDREAM_MODEL_PATH = MODELS_ROOT / "mlx-community" / "HiDream-O1-Image-Dev-mlx-q6"
HIDREAM_CODE_ROOT = PROJECT_ROOT / "third_party" / "hidream_o1"
HIDREAM_SCRIPT = HIDREAM_CODE_ROOT / "scripts" / "hidream_o1" / "generate_hidream_o1_mlx.py"
HIDREAM_PYTHON = HIDREAM_CODE_ROOT / ".venv" / "bin" / "python"
OUTPUT_ROOT = Path.home() / ".cache" / "minimax-h3-mlx" / "outputs"
MODEL_URL = "https://huggingface.co/ddalcu/MiniMax-H3-FL2VA-MLX-Serve-4bit"
MODEL_SIZE_BYTES = 41_876_368_203
RUNTIME_URL = "https://github.com/ddalcu/mlx-serve/releases/latest"
TRANSFORMER_URL = "https://huggingface.co/pipenetwork/MiniMax-H3-MLX-8bit"
HIDREAM_MODEL_URL = "https://huggingface.co/mlx-community/HiDream-O1-Image-Dev-mlx-q6"
HIDREAM_CODE_URL = "https://huggingface.co/mlx-community/HiDream-O1-Image-Dev-mlx-bf16"
MUSIC_MODEL_PATH = MODELS_ROOT / "mlx-community" / "MiniMax-Music3-8bit"
MUSIC_MODEL_URL = "https://huggingface.co/mlx-community/MiniMax-Music3-8bit"
MUSIC_PYTHON = HIDREAM_PYTHON
YUE2_GENERATE_SCRIPT = PROJECT_ROOT / "scripts" / "yue2_generate.py"
DEFAULT_TEXT_API_BASE_URL = os.environ.get("OMLX_BASE_URL", "http://127.0.0.1:8000").rstrip("/")
DEFAULT_VIDEO_API_BASE_URL = os.environ.get("MLX_SERVE_URL", "http://127.0.0.1:11234").rstrip("/")
ASPECTS = {"16:9": (16, 9), "9:16": (9, 16), "1:1": (1, 1), "4:3": (4, 3), "3:4": (3, 4)}
MAX_REQUEST_BYTES = 64 * 1024

_DEFAULT_SETTINGS = {
    "output_directory": str(OUTPUT_ROOT),
    "models": {
        "h3": {"enabled": True, "name": "MiniMax H3 · 4-bit", "model_path": str(Path(os.environ.get("MINIMAX_H3_MODEL_DIR", DEFAULT_MODEL_PATH)).expanduser())},
        "hidream": {"enabled": True, "name": "HiDream-O1 · Q6", "model_path": str(HIDREAM_MODEL_PATH)},
        "flux2-klein-4b": {"enabled": True, "name": "FLUX.2 Klein 4B", "model_path": str(PIPENETWORK_ROOT / "FLUX.2-klein-4B")},
        "z-image-turbo": {"enabled": True, "name": "Z-Image-Turbo", "model_path": str(PIPENETWORK_ROOT / "Z-Image-Turbo")},
        "ltx-2.3-distilled-q4": {"enabled": True, "name": "LTX 2.3 Distilled 1.1 · Q4", "model_path": str(PIPENETWORK_ROOT / "ltx-2.3-mlx-q4")},
        "ltx-2.3-distilled-q8": {"enabled": True, "name": "LTX 2.3 Distilled 1.1 · Q8", "model_path": str(PIPENETWORK_ROOT / "ltx-2.3-mlx-q8")},
        "music3": {"enabled": True, "name": "MiniMax Music 3 · 8-bit", "model_path": str(MUSIC_MODEL_PATH)},
        "yue2-3b-8bit": {"enabled": True, "name": "YuE2 3B · 8-bit", "model_path": str(PIPENETWORK_ROOT / "mlx-Yue2-3B")},
    },
    "gemma_path": str(local_models.GEMMA_PATH),
    "video": {
        "model_path": str(
            Path(os.environ.get("MINIMAX_H3_MODEL_DIR", DEFAULT_MODEL_PATH)).expanduser()
        ),
        "service_url": DEFAULT_VIDEO_API_BASE_URL,
        "model_id": "",
        "api_params": {},
    },
    "image": {"model_path": str(HIDREAM_MODEL_PATH)},
    "music": {"model_path": str(MUSIC_MODEL_PATH)},
    "text": {
        "service_url": DEFAULT_TEXT_API_BASE_URL,
        "model_ids": [],
        "api_params": {"temperature": 0.2, "max_tokens": 500},
    },
}
_settings_lock = threading.RLock()
_storage_lock = threading.RLock()
_lock = threading.Lock()
_jobs: dict[str, dict] = {}
_active_job_id: str | None = None
_active_workflow_id: str | None = None
_workflow_cancel_events: dict[str, threading.Event] = {}
_mlx_server_process: subprocess.Popen | None = None
_h3_reload_required = False
_server_logs: deque[str] = deque(maxlen=30)
_skill_conversion_lock = threading.Lock()


class GenerationCancelled(Exception):
    """Raised when the user cancels an active generation."""


class LocalInferenceProcess(subprocess.Popen[str]):
    def __init__(self, command: list[str], environment: dict[str, str]) -> None:
        super().__init__(
            command, cwd=PROJECT_ROOT, env=environment, start_new_session=True,
            stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
            text=True, bufsize=1,
        )
        self.stop_lock = threading.Lock()
        self.group_stopped = False

    def stop_group(self) -> None:
        with self.stop_lock:
            if self.group_stopped:
                return
            try:
                os.killpg(self.pid, signal.SIGTERM)
            except ProcessLookupError:
                self.wait(timeout=5)
                self.group_stopped = True
                return
            try:
                self.wait(timeout=5)
            except subprocess.TimeoutExpired:
                pass
            # The parent may have exited while an encoder child remains alive.
            try:
                os.killpg(self.pid, signal.SIGKILL)
            except ProcessLookupError:
                pass
            self.wait(timeout=5)
            self.group_stopped = True


def _settings_snapshot() -> dict:
    with _settings_lock:
        try:
            payload = json.loads(SETTINGS_PATH.read_text(encoding="utf-8"))
        except FileNotFoundError:
            return json.loads(json.dumps(_DEFAULT_SETTINGS))
        except (OSError, json.JSONDecodeError) as exc:
            raise RuntimeError(f"Could not read settings.json: {exc}") from exc
    return _validate_app_settings(payload)


def _local_http_url(value: object, name: str) -> str:
    if not isinstance(value, str) or len(value) > 512:
        raise ValueError(f"invalid_{name}")
    value = value.strip().rstrip("/")
    parsed = urlparse(value)
    if (
        parsed.scheme != "http"
        or parsed.hostname not in {"127.0.0.1", "localhost", "::1"}
        or parsed.username is not None
        or parsed.password is not None
        or parsed.path not in {"", "/"}
        or parsed.query
        or parsed.fragment
        or parsed.port is None
        or not 1 <= parsed.port <= 65535
    ):
        raise ValueError(f"invalid_{name}")
    return value


def _contains_credential_field(value: object) -> bool:
    if isinstance(value, dict):
        blocked_names = {"apikey", "authorization", "accesstoken", "token", "secret", "password"}
        return any(
            key.casefold().replace("_", "").replace("-", "") in blocked_names
            or _contains_credential_field(item)
            for key, item in value.items()
            if isinstance(key, str)
        )
    if isinstance(value, list):
        return any(_contains_credential_field(item) for item in value)
    return False


def _validate_app_settings(payload: object) -> dict:
    if not isinstance(payload, dict) or not {"video", "image", "music", "text"} <= set(payload) or set(payload) - {
        "video", "image", "music", "text", "models", "output_directory", "gemma_path"
    }:
        raise ValueError("invalid_settings")
    normalized = {}
    path_fields = {
        "video": {"model_path", "service_url", "model_id", "api_params"},
        "image": {"model_path"},
        "music": {"model_path"},
        "text": {"service_url", "model_ids", "api_params"},
    }
    for section, expected in path_fields.items():
        value = payload.get(section)
        if not isinstance(value, dict) or set(value) != expected:
            raise ValueError("invalid_settings")
        model_path = value.get("model_path")
        if section != "text":
            if not isinstance(model_path, str) or not model_path.strip() or len(model_path) > 2048:
                raise ValueError(f"invalid_{section}_model_path")
            normalized[section] = {"model_path": model_path.strip()}

    video = payload["video"]
    model_id = video["model_id"]
    video_params = video["api_params"]
    if not isinstance(model_id, str) or len(model_id) > 200:
        raise ValueError("invalid_video_model_id")
    if not isinstance(video_params, dict) or len(video_params) > 32:
        raise ValueError("invalid_video_api_params")
    if _contains_credential_field(video_params):
        raise ValueError("api_credentials_not_supported")
    reserved_video_params = {"model", "prompt", "width", "height", "num_frames", "steps", "seed", "turbo", "stream"}
    if reserved_video_params.intersection(video_params):
        raise ValueError("reserved_video_api_param")
    try:
        if len(json.dumps(video_params, ensure_ascii=False, allow_nan=False)) > 16_384:
            raise ValueError("invalid_video_api_params")
    except (TypeError, ValueError, RecursionError) as exc:
        raise ValueError("invalid_video_api_params") from exc
    normalized["video"].update({
        "service_url": _local_http_url(video["service_url"], "video_service_url"),
        "model_id": model_id.strip(),
        "api_params": video_params,
    })

    text = payload["text"]
    model_ids = text["model_ids"]
    text_params = text["api_params"]
    if (
        not isinstance(model_ids, list)
        or len(model_ids) > 100
        or not all(isinstance(item, str) and item.strip() and len(item) <= 200 for item in model_ids)
    ):
        raise ValueError("invalid_text_model_ids")
    if not isinstance(text_params, dict) or set(text_params) - {"temperature", "top_p", "max_tokens"}:
        raise ValueError("invalid_text_api_params")
    if (
        "temperature" in text_params
        and (not isinstance(text_params["temperature"], (int, float)) or not 0 <= text_params["temperature"] <= 2)
    ):
        raise ValueError("invalid_text_api_params")
    if (
        "top_p" in text_params
        and (not isinstance(text_params["top_p"], (int, float)) or not 0 < text_params["top_p"] <= 1)
    ):
        raise ValueError("invalid_text_api_params")
    if (
        "max_tokens" in text_params
        and (not isinstance(text_params["max_tokens"], int) or not 1 <= text_params["max_tokens"] <= 8192)
    ):
        raise ValueError("invalid_text_api_params")
    normalized["text"] = {
        "service_url": _local_http_url(text["service_url"], "text_service_url"),
        "model_ids": _normalize_text_model_ids(model_ids),
        "api_params": text_params,
    }
    for field in ("output_directory", "gemma_path"):
        value = payload.get(field, _DEFAULT_SETTINGS[field])
        if not isinstance(value, str) or not value.strip() or len(value) > 2048 or "\0" in value:
            raise ValueError(f"invalid_{field}")
        directory = Path(value.strip()).expanduser()
        if not directory.is_absolute():
            raise ValueError(f"invalid_{field}")
        normalized[field] = str(directory)
    models = payload.get("models", _DEFAULT_SETTINGS["models"])
    if not isinstance(models, dict) or not models or set(models) - set(_DEFAULT_SETTINGS["models"]):
        raise ValueError("invalid_model_settings")
    # Settings saved before a model was registered gain its default entry.
    models = {**json.loads(json.dumps(_DEFAULT_SETTINGS["models"])), **models}
    if "music3" not in payload.get("models", {}):
        models["music3"]["model_path"] = normalized["music"]["model_path"]
    normalized["models"] = {}
    for model, entry in models.items():
        if not isinstance(entry, dict) or set(entry) != {"enabled", "name", "model_path"}:
            raise ValueError("invalid_model_settings")
        if not isinstance(entry["enabled"], bool) or not isinstance(entry["name"], str) or not 1 <= len(entry["name"].strip()) <= 120:
            raise ValueError("invalid_model_settings")
        path = entry["model_path"]
        if not isinstance(path, str) or not path.strip() or len(path) > 2048 or "\0" in path or not Path(path.strip()).expanduser().is_absolute():
            raise ValueError("invalid_model_path")
        normalized["models"][model] = {
            "enabled": entry["enabled"], "name": entry["name"].strip(), "model_path": path.strip()
        }
    # Existing installations keep their original H3/HiDream paths.
    if "models" not in payload:
        for model, section in (("h3", "video"), ("hidream", "image")):
            normalized["models"][model]["model_path"] = normalized[section]["model_path"]
    else:
        for model, section in (("h3", "video"), ("hidream", "image")):
            normalized[section]["model_path"] = normalized["models"][model]["model_path"]
    normalized["music"]["model_path"] = normalized["models"]["music3"]["model_path"]
    for group in ({"h3", *local_models.VIDEO_MODELS}, {"hidream", *local_models.IMAGE_MODELS},
                  {"music3", *local_models.MUSIC_MODELS}):
        if not any(normalized["models"][model]["enabled"] for model in group):
            raise ValueError("at_least_one_model_per_mode_required")
    return normalized


def _save_app_settings(payload: object) -> dict:
    global OUTPUT_ROOT, _h3_reload_required
    validated = _validate_app_settings(payload)
    serialized = json.dumps(validated, ensure_ascii=False, indent=2) + "\n"
    with _storage_lock, _lock, _settings_lock:
        if _active_job_id is not None or _active_workflow_id is not None:
            raise ValueError("job_already_running")
        previous = _settings_snapshot()
        model_downloads.assert_paths_idle(previous, validated)
        destination = Path(validated["output_directory"])
        staging = None
        published = False
        try:
            if validated["output_directory"] != previous["output_directory"]:
                staging = output_storage.prepare_migration(OUTPUT_ROOT, destination)
            destination = destination.resolve()
            SETTINGS_PATH.parent.mkdir(parents=True, exist_ok=True)
            fd, temporary_path = tempfile.mkstemp(prefix=".settings-", suffix=".json", dir=SETTINGS_PATH.parent)
            try:
                os.fchmod(fd, 0o600)
                with os.fdopen(fd, "w", encoding="utf-8") as settings_file:
                    settings_file.write(serialized)
                    settings_file.flush()
                    os.fsync(settings_file.fileno())
                if staging is not None:
                    output_storage.publish_migration(staging, destination)
                    staging = None
                    published = True
                os.replace(temporary_path, SETTINGS_PATH)
            except Exception:
                Path(temporary_path).unlink(missing_ok=True)
                raise
        except OSError as exc:
            copied = f" Verified output copy retained at {destination}; original settings and files remain active." if published else ""
            raise RuntimeError(f"Could not save settings.json: {exc}.{copied}") from exc
        finally:
            if staging is not None:
                shutil.rmtree(staging)
        if any(validated["video"][key] != previous["video"][key]
               for key in ("model_path", "model_id", "service_url")):
            _h3_reload_required = True
        if validated["output_directory"] != previous["output_directory"]:
            old_root = OUTPUT_ROOT.resolve()
            OUTPUT_ROOT = destination
            for job in _jobs.values():
                for key in ("video_path", "image_path", "audio_path"):
                    path = job.get(key)
                    if isinstance(path, Path) and old_root in path.resolve().parents:
                        job[key] = destination / path.resolve().relative_to(old_root)
    return validated


def _local_model_path(model: str) -> Path:
    return Path(_settings_snapshot()["models"][model]["model_path"]).expanduser()


def _local_model_status(model: str) -> dict:
    settings = _settings_snapshot()
    companion = None if model in local_models.MUSIC_MODELS else Path(settings["gemma_path"]).expanduser()
    return local_models.status(model, Path(settings["models"][model]["model_path"]).expanduser(), companion)


def _require_enabled_model(model: str) -> None:
    if not _settings_snapshot()["models"].get(model, {}).get("enabled", False):
        raise ValueError("generation_model_disabled")


def _model_options() -> dict:
    configured = _settings_snapshot()["models"]
    return {
        mode: [dict(id=model, **configured[model]) for model in ids]
        for mode, ids in (
            ("video", ("h3", *local_models.VIDEO_MODELS)),
            ("image", ("hidream", *local_models.IMAGE_MODELS)),
            ("music", ("music3", *local_models.MUSIC_MODELS)),
        )
    }


def _expected_model_files(path: Path) -> tuple[str, ...]:
    return (
        "config.json",
        "text_encoder.safetensors",
        "transformer.safetensors",
        "video_vae.safetensors",
        "audio_vae.safetensors",
        "turbo_lora.safetensors",
        "tokenizer.json",
    )


def _valid_h3_model(path: Path) -> bool:
    return path.is_dir() and all((path / name).is_file() for name in _expected_model_files(path))


def _find_models(models_root: Path = MODELS_ROOT, model_override: str | None = None) -> list[Path]:
    found: list[Path] = []
    if model_override is not None or models_root == MODELS_ROOT:
        preferred = Path(model_override or _settings_snapshot()["video"]["model_path"]).expanduser()
        if _valid_h3_model(preferred):
            found.append(preferred.resolve())
        if models_root == MODELS_ROOT:
            return found

    if models_root.is_dir():
        for current, directories, files in os.walk(models_root, followlinks=False):
            current_path = Path(current)
            try:
                depth = len(current_path.relative_to(models_root).parts)
            except ValueError:
                directories[:] = []
                continue
            directories[:] = [
                name for name in directories
                if name not in {".cache", "blobs", "refs", "snapshots", "trees"} and not name.startswith(".")
            ] if depth < 6 else []
            if all(name in files for name in _expected_model_files(current_path)):
                resolved = current_path.resolve()
                if resolved not in found:
                    found.append(resolved)
    return found


def _model_download_progress(path: Path) -> dict:
    downloaded = 0
    if path.is_dir():
        for item in path.iterdir():
            if item.is_file():
                try:
                    downloaded += item.stat().st_size
                except OSError:
                    continue
    partial_dir = path / ".cache" / "huggingface" / "download"
    partials = list(partial_dir.glob("*.incomplete")) if partial_dir.is_dir() else []
    recently_updated = False
    for item in partials:
        try:
            stat = item.stat()
        except OSError:
            continue
        downloaded += stat.st_size
        recently_updated |= time.time() - stat.st_mtime < 300
    return {
        "download_in_progress": recently_updated,
        "downloaded_bytes": min(downloaded, MODEL_SIZE_BYTES),
        "total_bytes": MODEL_SIZE_BYTES,
    }


def _local_mlx_serve() -> Path | None:
    candidates = [
        shutil.which("mlx-serve"),
        str(Path.home() / ".local" / "bin" / "mlx-serve"),
        "/Applications/MLX Core.app/Contents/MacOS/mlx-serve",
        "/Applications/MLX-Serve.app/Contents/MacOS/mlx-serve",
    ]
    for candidate in candidates:
        if candidate and Path(candidate).is_file() and os.access(candidate, os.X_OK):
            return Path(candidate).resolve()
    return None


def _valid_local_service_url() -> bool:
    return _valid_loopback_url(_settings_snapshot()["video"]["service_url"])


def _valid_loopback_url(base_url: str) -> bool:
    try:
        _local_http_url(base_url, "service_url")
        return True
    except ValueError:
        return False


def _request_json(
    route: str,
    payload: dict | None = None,
    timeout: float = 15,
) -> dict:
    base_url = _settings_snapshot()["video"]["service_url"]
    if not _valid_local_service_url():
        raise RuntimeError("MLX_SERVE_URL must use local http://127.0.0.1, localhost, or ::1.")
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    headers = {"Accept": "application/json"}
    if data is not None:
        headers["Content-Type"] = "application/json"
    request = Request(f"{base_url}{route}", data=data, headers=headers)
    try:
        with urlopen(request, timeout=timeout) as response:
            decoded = json.loads(response.read())
    except HTTPError as exc:
        detail = exc.read(16_384).decode("utf-8", errors="replace")
        try:
            error = json.loads(detail).get("error", {})
            if isinstance(error, dict):
                detail = error.get("message", detail)
        except json.JSONDecodeError:
            pass
        raise RuntimeError(f"MLX-Serve returned HTTP {exc.code}: {detail}") from exc
    except (URLError, TimeoutError, OSError) as exc:
        raise RuntimeError(f"Cannot reach MLX-Serve at {base_url}: {exc}") from exc
    except json.JSONDecodeError as exc:
        raise RuntimeError("MLX-Serve returned invalid JSON.") from exc
    if not isinstance(decoded, dict):
        raise RuntimeError("MLX-Serve returned an unexpected JSON response.")
    return decoded


def _service_health() -> bool:
    base_url = _settings_snapshot()["video"]["service_url"]
    if not _valid_loopback_url(base_url):
        return False
    try:
        request = Request(f"{base_url}/health", headers={"Accept": "application/json"})
        with urlopen(request, timeout=2) as response:
            return 200 <= response.status < 300
    except (HTTPError, URLError, TimeoutError, OSError):
        return False


def _service_models() -> list[dict]:
    response = _request_json("/v1/models", timeout=15)
    models = response.get("data", [])
    return [model for model in models if isinstance(model, dict)] if isinstance(models, list) else []


def _scan_models(models_root: Path = MODELS_ROOT, model_override: str | None = None) -> dict:
    models = _find_models(models_root, model_override)
    preferred = Path(model_override or _settings_snapshot()["video"]["model_path"]).expanduser()
    download_progress = _model_download_progress(models[0] if models else preferred)
    runtime = _local_mlx_serve()
    healthy = _service_health()
    loaded_models: list[dict] = []
    if healthy:
        try:
            loaded_models = _service_models()
        except RuntimeError:
            healthy = False
    return {
        "model_path": str(models[0]) if models else str(
            Path(model_override or _settings_snapshot()["video"]["model_path"]).expanduser()
        ),
        "model_ready": bool(models),
        **download_progress,
        "models": [str(path) for path in models],
        "runtime_ready": runtime is not None,
        "runtime_path": str(runtime) if runtime else "",
        "server_ready": healthy,
        "model_loaded": not _h3_reload_required and any(_is_h3_video_model(model) and model.get("state", "ready") == "ready"
                            for model in loaded_models),
        "server_models": [
            {"id": model.get("id", ""), "state": model.get("state", "")}
            for model in loaded_models if _is_h3_video_model(model)
        ],
        "model_download_url": MODEL_URL,
        "runtime_download_url": RUNTIME_URL,
        "transformer_download_url": TRANSFORMER_URL,
        "hidream": _hidream_status(),
        "model_options": _model_options(),
        "image_models": {model: _local_model_status(model) for model in local_models.IMAGE_MODELS},
        "video_models": {model: _local_model_status(model) for model in local_models.VIDEO_MODELS},
        "music_models": {model: _local_model_status(model) for model in local_models.MUSIC_MODELS},
        "music": _music_status(),
    }


def _hidream_status(model_path: Path | None = None) -> dict:
    model_path = (model_path or Path(_settings_snapshot()["image"]["model_path"])).expanduser()
    required_model_files = (
        "config.json",
        "model.safetensors",
        "extras/custom_heads.safetensors",
        "tokenizer.json",
        "preprocessor_config.json",
    )
    runtime_files = (
        HIDREAM_SCRIPT,
        HIDREAM_CODE_ROOT / "scripts" / "hidream_o1" / "hidream_model.py",
        HIDREAM_CODE_ROOT / "scripts" / "hidream_o1" / "pipeline_helpers.py",
        HIDREAM_CODE_ROOT / "scripts" / "hidream_o1" / "flow_match.py",
        HIDREAM_CODE_ROOT / "scripts" / "hidream_o1" / "postprocess.py",
    )
    runtime_ready = all(path.is_file() for path in runtime_files) and (
        HIDREAM_PYTHON.is_file() and os.access(HIDREAM_PYTHON, os.X_OK)
    )
    model_ready = model_path.is_dir() and all(
        (model_path / name).is_file() for name in required_model_files
    )
    return {
        "model_path": str(model_path),
        "model_ready": model_ready,
        "runtime_ready": runtime_ready,
        "code_path": str(HIDREAM_CODE_ROOT),
        "model_download_url": HIDREAM_MODEL_URL,
        "code_download_url": HIDREAM_CODE_URL,
    }


def _music_status(model_path: Path | None = None) -> dict:
    model_path = (model_path or Path(_settings_snapshot()["music"]["model_path"])).expanduser()
    required_model_files = (
        "config.json",
        "model.safetensors.index.json",
        "model-00001-of-00003.safetensors",
        "model-00002-of-00003.safetensors",
        "model-00003-of-00003.safetensors",
        "tokenizer/tokenizer.json",
    )
    runtime_files = list(
        (MUSIC_PYTHON.parent.parent / "lib").glob("python*/site-packages/mlx_audio/music/generate.py")
    ) if MUSIC_PYTHON.parent.parent.is_dir() else []
    return {
        "model_path": str(model_path),
        "model_ready": model_path.is_dir() and all(
            (model_path / name).is_file() for name in required_model_files
        ),
        "runtime_ready": (
            MUSIC_PYTHON.is_file()
            and os.access(MUSIC_PYTHON, os.X_OK)
            and bool(runtime_files)
        ),
        "model_download_url": MUSIC_MODEL_URL,
    }


def _valid_local_text_api_url() -> bool:
    return _valid_loopback_url(_settings_snapshot()["text"]["service_url"])


def _is_prompt_text_model(model_id: str) -> bool:
    identifier = model_id.lower()
    non_text_markers = (
        "hidream",
        "music3",
        "minimax-h3",
        "glm-ocr",
        "qwen-image",
        "image-layered",
    )
    return not any(marker in identifier for marker in non_text_markers)


def _normalize_text_model_ids(model_ids: list[str]) -> list[str]:
    normalized = []
    for item in model_ids:
        for value in re.split(r"[\r\n;；]+", item):
            model_id = value.strip()
            if model_id and model_id not in normalized:
                normalized.append(model_id)
    if len(normalized) > 100:
        raise ValueError("invalid_text_model_ids")
    return normalized


def _local_text_models(*, strict: bool = False) -> list[dict]:
    settings = _settings_snapshot()["text"]
    base_url = settings["service_url"]
    if not (_valid_loopback_url(base_url) if strict else _valid_local_text_api_url()):
        raise RuntimeError("OMLX_BASE_URL must use local http://127.0.0.1, localhost, or ::1.")
    request = Request(
        f"{base_url}/v1/models",
        headers={"Accept": "application/json"},
    )
    try:
        opener = build_opener(ProxyHandler({}), _NoTextRedirect()).open if strict else urlopen
        with opener(request, timeout=3) as response:
            raw = response.read(256 * 1024 + 1) if strict else response.read()
            if strict and len(raw) > 256 * 1024:
                raise RuntimeError("Local text model list exceeded the response budget.")
            payload = skill_conversion.parse_json(raw) if strict else json.loads(raw)
    except HTTPError as exc:
        exc.close()
        raise RuntimeError(f"Local OMLX model list returned HTTP {exc.code}.") from exc
    except (URLError, TimeoutError, OSError) as exc:
        raise RuntimeError(f"Cannot reach the local OMLX text-model API at {base_url}.") from exc
    except json.JSONDecodeError as exc:
        raise RuntimeError("Local OMLX model list returned invalid JSON.") from exc
    except skill_conversion.SkillError as exc:
        raise RuntimeError("Local OMLX model list returned invalid JSON.") from exc
    if not isinstance(payload, dict) or not isinstance(payload.get("data"), list):
        raise RuntimeError("Local OMLX model list has an unexpected response format.")
    configured = _normalize_text_model_ids(settings["model_ids"])
    if configured:
        return [{"id": model_id, "name": model_id} for model_id in configured
                if _is_prompt_text_model(model_id)]
    models = []
    for item in payload["data"]:
        if not isinstance(item, dict):
            continue
        model_id = item.get("id")
        if isinstance(model_id, str) and model_id.strip() and _is_prompt_text_model(model_id):
            if not any(model["id"] == model_id for model in models):
                models.append({"id": model_id, "name": model_id})
    return sorted(models, key=lambda item: item["id"].casefold())


def _validate_prompt_enhancement(payload: dict) -> dict:
    prompt = payload.get("prompt")
    if not isinstance(prompt, str) or not prompt.strip() or len(prompt) > 4000:
        raise ValueError("invalid_prompt")
    mode = payload.get("mode")
    if not isinstance(mode, str) or mode not in {"video", "image", "music"}:
        raise ValueError("invalid_generation_mode")
    model_id = payload.get("model")
    if not isinstance(model_id, str) or not model_id.strip() or len(model_id) > 200:
        raise ValueError("invalid_text_model")
    return {"prompt": prompt.strip(), "mode": mode, "model": model_id.strip()}


def _enhance_prompt_with_local_model(settings: dict) -> dict:
    available_models = _local_text_models()
    if not any(model["id"] == settings["model"] for model in available_models):
        raise ValueError("text_model_unavailable")

    system_prompt = prompt_settings.enhancement(settings["mode"])
    generated = _request_local_text_json(settings["model"], system_prompt, settings["prompt"])
    try:
        keywords = generated["keywords"]
        optimized_prompt = generated["optimized_prompt"]
        if (
            not isinstance(keywords, list)
            or not all(isinstance(keyword, str) and keyword.strip() for keyword in keywords)
            or not isinstance(optimized_prompt, str)
            or not optimized_prompt.strip()
            or len(optimized_prompt) > 4000
        ):
            raise ValueError
    except (KeyError, TypeError, ValueError) as exc:
        raise RuntimeError("Local text model returned an invalid prompt-enhancement response.") from exc
    return {
        "keywords": [keyword.strip() for keyword in keywords[:30]],
        "optimized_prompt": optimized_prompt.strip(),
    }


def _request_local_text_json(
    model: str, instructions: str, source: str, max_tokens: int | None = None,
    *, strict: bool = False, text_snapshot: dict | None = None,
) -> dict:
    text_settings = text_snapshot if text_snapshot is not None else _settings_snapshot()["text"]
    params = {"temperature": 0.2} if strict else dict(text_settings["api_params"])
    if max_tokens is not None:
        params["max_tokens"] = max_tokens
    body = json.dumps({
        **params,
        "model": model,
        "messages": [
            {"role": "system", "content": instructions},
            {"role": "user", "content": source},
        ],
        "stream": False,
        "response_format": {"type": "json_object"},
        "enable_thinking": False,
    }).encode("utf-8")
    request = Request(
        f"{text_settings['service_url']}/v1/chat/completions",
        data=body,
        headers={"Accept": "application/json", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        if strict:
            result = _skill_text_response(request, text_settings["service_url"])
        else:
            with urlopen(request, timeout=240) as response:
                result = json.loads(response.read())
    except HTTPError as exc:
        raise RuntimeError(f"Local text-model request returned HTTP {exc.code}.") from exc
    except (URLError, TimeoutError, OSError) as exc:
        raise RuntimeError("Could not complete the local text-model request.") from exc
    except json.JSONDecodeError as exc:
        raise RuntimeError("Local text model returned invalid JSON.") from exc

    try:
        if strict:
            choices = result["choices"]
            if not isinstance(choices, list) or len(choices) != 1:
                raise ValueError("invalid_choices")
            choice = choices[0]
            if not isinstance(choice, dict) or not isinstance(choice.get("message"), dict):
                raise ValueError("invalid_choice")
            if choice.get("finish_reason") != "stop":
                raise ValueError("incomplete_conversion")
            if choice["message"].get("tool_calls") or choice["message"].get("refusal"):
                raise ValueError("unexpected_tool_or_refusal")
            try:
                return skill_conversion.parse_json(choice["message"]["content"])
            except skill_conversion.SkillError as exc:
                raise ValueError("invalid_conversion_json") from exc
        content = result["choices"][0]["message"]["content"]
        if not isinstance(content, str):
            raise TypeError
        content = re.sub(r"<think>.*?</think>", "", content, flags=re.IGNORECASE | re.DOTALL).strip()
        if content.startswith("```"):
            content = re.sub(r"^```(?:json)?\s*|\s*```$", "", content.strip(), flags=re.IGNORECASE)
        if not content.startswith("{"):
            content = content[content.find("{"):]
        if not content.endswith("}"):
            content = content[:content.rfind("}") + 1]
        generated = json.loads(content)
        if not isinstance(generated, dict):
            raise TypeError
    except (KeyError, IndexError, TypeError, ValueError, json.JSONDecodeError) as exc:
        raise RuntimeError("Local text model returned an invalid JSON response.") from exc
    return generated


class _NoTextRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise HTTPError(req.full_url, code, "Local text API redirects are not allowed.", headers, fp)


def _skill_text_response(request: Request, base_url: str) -> dict:
    if not _valid_loopback_url(base_url):
        raise RuntimeError("Skill conversion requires a local text service.")
    try:
        with build_opener(ProxyHandler({}), _NoTextRedirect()).open(request, timeout=240) as response:
            data = response.read(256 * 1024 + 1)
        if len(data) > 256 * 1024:
            raise RuntimeError("Local text response exceeded the Skill budget.")
        return skill_conversion.parse_json(data)
    except HTTPError as exc:
        exc.close()
        raise RuntimeError(f"Local Skill text API returned HTTP {exc.code}.") from exc
    except (URLError, TimeoutError, OSError, skill_conversion.SkillError) as exc:
        raise RuntimeError("Local Skill text API failed or returned invalid JSON.") from exc


def _skill_token_count(record: dict, system: str, source: str) -> int:
    text = record["text_settings"]
    request = Request(
        f"{text['service_url']}/v1/messages/count_tokens",
        data=skill_conversion.encoded({
            "model": record["model"], "system": system,
            "messages": [{"role": "user", "content": source}],
        }),
        headers={"Accept": "application/json", "Content-Type": "application/json"},
        method="POST",
    )
    count = _skill_text_response(request, text["service_url"]).get("input_tokens")
    if type(count) is not int or count < 0:
        raise RuntimeError("Local tokenizer returned an invalid token count.")
    return count


def _skill_environment() -> tuple[dict, dict]:
    with _settings_lock:
        text = _settings_snapshot()["text"]
        options = _model_options()
    restrictions = {
        "video": "Text-only faithful editing; no generation parameters, reference analysis or continuity guarantees.",
        "image": "Text-only faithful editing; no image analysis, editing or generation.",
        "music": "Style text only; no lyrics, audio analysis, continuation or generation.",
        "long-video": (
            f"Story planning only; 1-{workflows.MAX_SHOTS} shots, each 5/8/10/15 seconds; "
            "instrumental music descriptions; no continuity guarantee."
        ),
    }
    allowed = []
    for mode in ("video", "image", "music", "long-video"):
        models = [item["id"] for item in options["video" if mode == "long-video" else mode] if item["enabled"]]
        if not models:
            continue
        allowed.append({
            "task": "storyboard" if mode == "long-video" else "prompt-enhancement",
            "mode": mode, "model_ids": models, "generic_allowed": True,
            "constraints": [restrictions[mode], "Enabled model identity does not prove runtime readiness or new capabilities."],
        })
    return {
        "allowed_bindings": allowed, "prompt_revision": prompt_settings.snapshot()["revision"],
        "input_tokens": skill_conversion.MAX_INPUT_TOKENS,
        "output_tokens": skill_conversion.MAX_OUTPUT_TOKENS,
        "instruction_tokens": skill_conversion.MAX_INSTRUCTION_TOKENS,
        "instruction_bytes": skill_conversion.MAX_INSTRUCTION_BYTES,
    }, text


def _prepare_skill_request(payload: dict) -> dict:
    if set(payload) != {"model", "source"}:
        raise skill_conversion.SkillError("invalid_skill_fields")
    capabilities, text = _skill_environment()
    model = payload.get("model")
    if not isinstance(model, str) or not model.strip() or len(model) > 200 or "\x00" in model:
        raise skill_conversion.SkillError("invalid_text_model")
    if not any(item["id"] == model for item in _local_text_models(strict=True)):
        raise skill_conversion.SkillError("text_model_unavailable", 409)
    return skill_conversion.prepare(payload, capabilities, text)


def _skill_record(request_id: object) -> dict:
    capabilities, text = _skill_environment()
    return skill_conversion.current_record(request_id, capabilities, text)


def _validate_skill_candidate(record: dict, result: dict) -> dict:
    validation = skill_conversion.validate_result(
        record, result, lambda system, source: _skill_token_count(record, system, source),
    )
    _skill_record(record["request"]["trusted_context"]["request_id"])
    return validation


def _convert_skill_request(request_id: object) -> dict:
    record = _skill_record(request_id)
    if record["request"]["trusted_context"]["license_status"] != "verified":
        result = skill_conversion.blocked_result(record)
    else:
        if not any(item["id"] == record["model"] for item in _local_text_models(strict=True)):
            raise skill_conversion.SkillError("text_model_unavailable", 409)
        source = skill_conversion.encoded(record["request"]).decode("utf-8")
        if _skill_token_count(record, record["system"], source) > skill_conversion.MAX_INPUT_TOKENS:
            raise skill_conversion.SkillError("skill_input_token_budget_exceeded", 413)
        _skill_record(request_id)
        result = _request_local_text_json(
            record["model"], record["system"], source, max_tokens=skill_conversion.MAX_OUTPUT_TOKENS,
            strict=True, text_snapshot=record["text_settings"],
        )
    validation = _validate_skill_candidate(record, result)
    if not validation["valid"]:
        raise skill_conversion.SkillError("invalid_skill_conversion", 502, validation["findings"])
    return {"result": result, "validation": validation}


def _validate_storyboard_request(payload: dict) -> dict:
    story = payload.get("story")
    if not isinstance(story, str) or not story.strip() or len(story) > 30000:
        raise ValueError("invalid_story")
    model = payload.get("model")
    if not isinstance(model, str) or not model.strip() or len(model) > 200:
        raise ValueError("invalid_text_model")
    count = payload.get("shot_count", 8)
    if isinstance(count, bool) or not isinstance(count, int) or not 1 <= count <= workflows.MAX_SHOTS:
        raise ValueError("invalid_shot_count")
    return {"story": story.strip(), "model": model.strip(), "shot_count": count}


def _storyboard_with_local_model(settings: dict) -> dict:
    if not any(model["id"] == settings["model"] for model in _local_text_models()):
        raise ValueError("text_model_unavailable")
    count = settings["shot_count"]
    instructions = prompt_settings.storyboard(count)
    generated = _request_local_text_json(
        settings["model"], instructions, settings["story"], max_tokens=min(20000, count * 400 + 512)
    )
    shots = generated.get("shots")
    if not isinstance(shots, list) or len(shots) != count:
        raise RuntimeError("Local text model returned an invalid storyboard shot count.")
    validated = []
    for shot in shots:
        if not isinstance(shot, dict):
            raise RuntimeError("Local text model returned an invalid storyboard shot.")
        for key, limit in (("title", 120), ("prompt", 4000), ("music_prompt", 4000)):
            value = shot.get(key)
            if not isinstance(value, str) or not value.strip() or len(value) > limit:
                raise RuntimeError(f"Local text model returned an invalid storyboard {key}.")
        duration = shot.get("duration")
        if isinstance(duration, bool) or not isinstance(duration, (int, float)) or duration not in {5, 8, 10, 15}:
            raise RuntimeError("Local text model returned an invalid storyboard duration.")
        validated.append({
            "title": shot["title"].strip(), "prompt": shot["prompt"].strip(),
            "music_prompt": shot["music_prompt"].strip(), "duration": duration,
        })
    return {"shots": validated}


def _is_h3_video_model(model: dict) -> bool:
    identifier = str(model.get("id", "")).lower()
    capabilities = model.get("capabilities", [])
    return "minimax-h3" in identifier or (
        isinstance(capabilities, list)
        and "video" in capabilities
        and ("minimax" in identifier or "h3" in identifier)
    )


def _validate_generation(payload: dict) -> dict:
    model = payload.get("model", "h3")
    if not isinstance(model, str) or model not in {"h3", *local_models.VIDEO_MODELS}:
        raise ValueError("invalid_generation_model")
    prompt = payload.get("prompt")
    if not isinstance(prompt, str) or not prompt.strip() or len(prompt) > 4000:
        raise ValueError("invalid_prompt")

    try:
        duration = float(payload.get("duration", 5))
    except (TypeError, ValueError) as exc:
        raise ValueError("invalid_duration") from exc
    if not 5 <= duration <= 15:
        raise ValueError("invalid_duration")

    try:
        steps = int(payload.get("steps", 4 if model == "h3" else 8))
    except (TypeError, ValueError) as exc:
        raise ValueError("invalid_steps") from exc
    if not 2 <= steps <= 50:
        raise ValueError("invalid_steps")
    turbo = payload.get("turbo", True)
    if not isinstance(turbo, bool) or (turbo and steps > 8) or (not turbo and steps < 16):
        raise ValueError("invalid_steps")
    if model != "h3" and (steps != 8 or not turbo):
        raise ValueError("invalid_distilled_steps")

    try:
        seed = int(payload.get("seed", 0))
    except (TypeError, ValueError) as exc:
        raise ValueError("invalid_seed") from exc
    if not 0 <= seed <= 2**32 - 1:
        raise ValueError("invalid_seed")

    aspect = payload.get("aspect", "16:9")
    if aspect not in ASPECTS:
        raise ValueError("invalid_aspect")
    width, height = _canvas_dimensions(*ASPECTS[aspect])
    frames = _align_frames(round(duration * 24))
    if model != "h3":
        ratio = ASPECTS[aspect][0] / ASPECTS[aspect][1]
        width, height = (
            (512, max(256, round(512 / ratio / 64) * 64)) if ratio >= 1
            else (max(256, round(512 * ratio / 64) * 64), 512)
        )
        frames = math.ceil((round(duration * 24) - 1) / 8) * 8 + 1
    settings = {
        "prompt": prompt.strip(),
        "duration": duration,
        "steps": steps,
        "seed": seed,
        "aspect": aspect,
        "width": width,
        "height": height,
        "num_frames": frames,
        "turbo": turbo,
    }
    if model != "h3":
        settings["model"] = model
    first_frame_id = workflows.validate_first_frame_id(payload.get("first_frame_id", ""))
    if first_frame_id:
        settings["first_frame_id"] = first_frame_id
    return settings


def _validate_hidream_generation(payload: dict) -> dict:
    model = payload.get("model", "hidream")
    if not isinstance(model, str) or model not in {"hidream", *local_models.IMAGE_MODELS}:
        raise ValueError("invalid_generation_model")
    prompt = payload.get("prompt")
    if not isinstance(prompt, str) or not prompt.strip() or len(prompt) > 4000:
        raise ValueError("invalid_prompt")
    try:
        seed = int(payload.get("seed", 42))
    except (TypeError, ValueError) as exc:
        raise ValueError("invalid_seed") from exc
    if not 0 <= seed <= 2**32 - 1:
        raise ValueError("invalid_seed")
    settings = {"prompt": prompt.strip(), "seed": seed, "width": 2048, "height": 2048}
    if model != "hidream":
        size = payload.get("width", 1024)
        height = payload.get("height", size)
        if any(isinstance(value, bool) or not isinstance(value, int) or value not in {512, 768, 1024}
               for value in (size, height)):
            raise ValueError("invalid_image_size")
        steps = 4 if model == "flux2-klein-4b" else 9
        if payload.get("steps", steps) != steps:
            raise ValueError("invalid_steps")
        settings.update({"model": model, "width": size, "height": height, "steps": steps})
    return settings


def _validate_music_generation(payload: dict) -> dict:
    model = payload.get("model", "music3")
    if model not in {"music3", *local_models.MUSIC_MODELS}:
        raise ValueError("invalid_model")
    prompt = payload.get("prompt")
    if not isinstance(prompt, str) or not prompt.strip() or len(prompt) > 4000:
        raise ValueError("invalid_prompt")

    lyrics_mode = payload.get("lyrics_mode", "lyrics")
    if lyrics_mode not in {"lyrics", "instrumental"}:
        raise ValueError("invalid_music_mode")
    lyrics = payload.get("lyrics", "")
    if lyrics_mode == "instrumental":
        lyrics = "[instrumental]"
    elif not isinstance(lyrics, str) or not lyrics.strip() or len(lyrics) > 4000:
        raise ValueError("invalid_lyrics")

    try:
        duration = float(payload.get("duration", 30))
    except (TypeError, ValueError) as exc:
        raise ValueError("invalid_duration") from exc
    maximum_duration = workflows.MUSIC3_MAX_SECONDS if model == "music3" else 120
    if not 5 <= duration <= maximum_duration:
        raise ValueError("invalid_duration")

    try:
        steps = int(payload.get("steps", 30))
    except (TypeError, ValueError) as exc:
        raise ValueError("invalid_steps") from exc
    if not 1 <= steps <= 30:
        raise ValueError("invalid_steps")

    try:
        seed = int(payload.get("seed", 0))
    except (TypeError, ValueError) as exc:
        raise ValueError("invalid_seed") from exc
    if not 0 <= seed <= 2**32 - 1:
        raise ValueError("invalid_seed")

    return {
        "model": model,
        "prompt": prompt.strip(),
        "lyrics": lyrics.strip(),
        "lyrics_mode": lyrics_mode,
        "duration": duration,
        "steps": steps,
        "seed": seed,
    }


def _canvas_dimensions(aspect_width: int, aspect_height: int) -> tuple[int, int]:
    ratio = aspect_width / aspect_height
    if not 0.25 <= ratio <= 4:
        raise ValueError("invalid_aspect")
    if ratio >= 1:
        width, height = 768 * ratio, 768.0
    else:
        width, height = 768.0, 768 / ratio
    area = width * height
    if area > 768 * 1344:
        scale = (768 * 1344 / area) ** 0.5
        width, height = width * scale, height * scale
    width = max(32, round(width / 32) * 32)
    height = max(32, round(height / 32) * 32)
    return width, height


def _align_frames(frame_count: int) -> int:
    while frame_count % 17 != 5:
        frame_count += 1
    return frame_count


def _generation_request(model_id: str, settings: dict) -> dict:
    request = {
        **settings.get("api_params", {}),
        "model": model_id,
        "prompt": settings["prompt"],
        "width": settings["width"],
        "height": settings["height"],
        "num_frames": settings["num_frames"],
        "steps": settings["steps"],
        "seed": settings["seed"],
        "turbo": settings["turbo"],
        "stream": True,
    }
    if settings.get("first_frame_image"):
        request["first_frame_image"] = settings["first_frame_image"]
    return request


MAX_PROJECT_NAME_LENGTH = 80


def _validate_project_name(payload: dict) -> str:
    name = payload.get("name", "")
    if name is None:
        return ""
    if not isinstance(name, str):
        raise ValueError("invalid_project_name")
    name = " ".join(name.split())
    if len(name) > MAX_PROJECT_NAME_LENGTH:
        raise ValueError("invalid_project_name")
    return name


def _history_name(value: object) -> str:
    if not isinstance(value, str):
        return ""
    return " ".join(value.split())[:MAX_PROJECT_NAME_LENGTH]


def _public_job(job: dict) -> dict:
    return {
        "id": job["id"],
        "kind": job.get("kind", "video"),
        "status": job["status"],
        "created_at": job["created_at"],
        "prompt": job["prompt"],
        "name": job.get("name", ""),
        "logs": list(job["logs"]),
        "error": job.get("error", ""),
        "video_url": f"/api/jobs/{job['id']}/video" if job.get("video_path") else "",
        "audio_url": f"/api/jobs/{job['id']}/audio" if job.get("audio_path") else "",
        "image_url": f"/api/jobs/{job['id']}/image" if job.get("image_path") else "",
        "elapsed_seconds": _job_elapsed_seconds(job),
        "tokens": job.get("tokens"),
    }


def _job_elapsed_seconds(job: dict) -> float:
    start = job.get("started_at") or job["created_at"]
    end = job.get("finished_at")
    if end is None:
        end = time.time()
        if job.get("status") in {"completed", "failed", "cancelled"}:
            job["finished_at"] = end
    return round(max(0.0, end - start), 1)


def _finish_job(job: dict) -> None:
    job.setdefault("finished_at", time.time())


def _resolve_workflow_music_source(item_id: str) -> dict | None:
    try:
        item_id = str(uuid.UUID(str(item_id)))
    except ValueError:
        return None
    audio_path = output_storage.history_music_file(OUTPUT_ROOT, item_id)
    metadata_path = output_storage.history_file(OUTPUT_ROOT, "music", f"{item_id}.json")
    if (audio_path is None or audio_path.is_symlink() or
            not metadata_path.is_file() or metadata_path.is_symlink()):
        return None
    try:
        metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    if not isinstance(metadata, dict) or metadata.get("id") != item_id or metadata.get("kind") != "music":
        return None
    generation = metadata.get("generation") if isinstance(metadata.get("generation"), dict) else {}
    lyrics = ""
    if generation.get("lyrics_mode") == "lyrics" and isinstance(generation.get("lyrics"), str):
        lyrics = generation["lyrics"]
    duration = generation.get("duration")
    if not isinstance(duration, (int, float)) or isinstance(duration, bool):
        duration = 0
    return {
        "path": str(audio_path),
        "lyrics": lyrics,
        "prompt": metadata.get("prompt") if isinstance(metadata.get("prompt"), str) else "",
        "name": _history_name(metadata.get("name")),
        "duration": duration,
    }


def _public_workflow(manifest: dict) -> dict:
    workflow_id = manifest["id"]
    result = {key: value for key, value in manifest.items() if key not in {"output_path", "shots"}}
    if isinstance(result.get("soundtrack"), dict):
        result["soundtrack"] = {
            key: value for key, value in result["soundtrack"].items() if key != "music_source_path"
        }
    result["soundtrack_segments"] = [
        {
            key: value for key, value in segment.items()
            if key not in {"audio_path", "job_id"}
        }
        for segment in manifest["soundtrack_segments"]
    ]
    result["shots"] = []
    for shot in manifest["shots"]:
        public_shot = {
            key: value for key, value in shot.items()
            if key not in {"video_path", "audio_path", "music_path", "first_frame_path", "chained_frame_path",
                           "generated_first_frame_path", "last_frame_path"}
        }
        public_shot["first_frame_url"] = (
            f"/api/workflows/{workflow_id}/shots/{shot['id']}/image"
            if shot.get("first_frame_path") else ""
        )
        public_shot["video_url"] = (
            f"/api/workflows/{workflow_id}/shots/{shot['id']}/video"
            if shot.get("video_path") else ""
        )
        public_shot["generated_first_frame_url"] = (
            f"/api/workflows/{workflow_id}/shots/{shot['id']}/first-frame"
            if shot.get("generated_first_frame_path") else ""
        )
        public_shot["last_frame_url"] = (
            f"/api/workflows/{workflow_id}/shots/{shot['id']}/last-frame"
            if shot.get("last_frame_path") else ""
        )
        public_shot["audio_url"] = (
            f"/api/workflows/{workflow_id}/shots/{shot['id']}/audio"
            if shot.get("audio_path") else ""
        )
        public_shot["music_url"] = (
            f"/api/workflows/{workflow_id}/shots/{shot['id']}/music"
            if shot.get("music_path") else ""
        )
        result["shots"].append(public_shot)
    result["output_url"] = (
        f"/api/workflows/{workflow_id}/final"
        if manifest.get("output_path") else ""
    )
    return result


def _read_workflow_payload(handler: BaseHTTPRequestHandler) -> dict:
    content_length = int(handler.headers.get("Content-Length", "0"))
    if content_length <= 0 or content_length > MAX_REQUEST_BYTES:
        raise ValueError("invalid_request_size")
    payload = json.loads(handler.rfile.read(content_length))
    if not isinstance(payload, dict):
        raise ValueError("invalid_request")
    return payload


def _start_workflow_job(workflow_id: str, kind: str, prompt: str) -> str:
    global _active_job_id
    job_id = str(uuid.uuid4())
    job = {
        "id": job_id, "kind": kind, "status": "queued", "created_at": time.time(),
        "prompt": prompt, "logs": deque(maxlen=100), "error": "",
        "workflow_id": workflow_id,
        "video_path": None, "audio_path": None, "image_path": None,
        "process": None, "response": None, "cancel_requested": False,
    }
    with _lock:
        event = _workflow_cancel_events.get(workflow_id)
        if event is not None and event.is_set():
            raise GenerationCancelled("Workflow cancelled.")
        if _active_job_id is not None:
            raise RuntimeError("job_already_running")
        _jobs[job_id] = job
        _active_job_id = job_id
    return job_id


def _check_workflow_cancelled(workflow_id: str) -> None:
    with _lock:
        event = _workflow_cancel_events.get(workflow_id)
    if event is not None and event.is_set():
        raise GenerationCancelled("Workflow cancelled.")


def _run_workflow(workflow_id: str) -> None:
    global _active_workflow_id
    manifest: dict | None = None
    workflows.mark_workflow_live(workflow_id, True)
    try:
        manifest = workflows.get_workflow(OUTPUT_ROOT, workflow_id)
        if manifest is None:
            raise RuntimeError("workflow_not_found")
        _check_workflow_cancelled(workflow_id)
        manifest.update({"status": "running", "error": ""})
        workflows.save_workflow(OUTPUT_ROOT, manifest)
        selected_model = manifest.get("model", "h3")
        model_path = Path(_find_models()[0]) if selected_model == "h3" else _local_model_path(selected_model)
        video_settings = _settings_snapshot()["video"]

        previous_video: Path | None = None
        previous_last_frame: Path | None = None
        for shot in manifest["shots"]:
            _check_workflow_cancelled(workflow_id)
            existing_video = workflows.safe_workflow_file(OUTPUT_ROOT, workflow_id, shot.get("video_path"))
            if shot["status"] == "completed" and existing_video is not None:
                ffmpeg = shutil.which("ffmpeg")
                if ffmpeg is None:
                    raise RuntimeError("ffmpeg_and_ffprobe_required")
                workflows.save_shot_frames(OUTPUT_ROOT, manifest, shot, existing_video, ffmpeg)
                previous_video = existing_video
                previous_last_frame = Path(shot["last_frame_path"])
                continue
            shot.update({"status": "running", "error": "", "video_path": None, "audio_path": None})
            settings = _validate_generation({
                "prompt": shot["prompt"], "duration": shot["duration"],
                "steps": shot["steps"], "seed": shot["seed"],
                "aspect": manifest["aspect"], "turbo": shot["turbo"],
                "model": selected_model,
            })
            settings["api_params"] = video_settings["api_params"]
            if shot.get("first_frame_id"):
                image_path = workflows.safe_workflow_file(
                    OUTPUT_ROOT, workflow_id, shot.get("first_frame_path")
                )
                if image_path is None:
                    raise RuntimeError("first_frame_not_found")
                settings["first_frame_image"] = base64.b64encode(image_path.read_bytes()).decode("ascii")
            elif previous_video is not None:
                ffmpeg = shutil.which("ffmpeg")
                if ffmpeg is None:
                    raise RuntimeError("ffmpeg_and_ffprobe_required")
                chained_frame = previous_last_frame or workflows.extract_last_frame(
                    OUTPUT_ROOT, workflow_id, previous_video, ffmpeg
                )
                shot["chained_frame_path"] = str(chained_frame)
                shot["first_frame_path"] = str(chained_frame)
                settings["first_frame_image"] = base64.b64encode(chained_frame.read_bytes()).decode("ascii")
            job_id = _start_workflow_job(workflow_id, "video", shot["prompt"])
            shot["job_id"] = job_id
            workflows.save_workflow(OUTPUT_ROOT, manifest)
            if settings.get("first_frame_image") and not shot.get("first_frame_id"):
                _append_log(job_id, "Using the previous shot's last frame as this shot's first frame.")
            _run_job(job_id, settings, model_path,
                     workflows.workflow_directory(OUTPUT_ROOT, workflow_id) / f"h3-{job_id}.mp4")
            with _lock:
                completed_job = _jobs[job_id]
            _check_workflow_cancelled(workflow_id)
            if completed_job["status"] == "cancelled" or manifest.get("cancel_requested"):
                raise GenerationCancelled("Workflow cancelled.")
            if completed_job["status"] != "completed":
                raise RuntimeError(completed_job.get("error") or "workflow_shot_failed")
            shot.update({
                "status": "completed",
                "video_path": str(completed_job["video_path"]),
                "audio_path": str(completed_job["audio_path"]) if completed_job.get("audio_path") else None,
                "error": "",
            })
            previous_video = Path(completed_job["video_path"])
            shot.update(generated_first_frame_path=None, last_frame_path=None)
            ffmpeg = shutil.which("ffmpeg")
            if ffmpeg is None:
                raise RuntimeError("ffmpeg_and_ffprobe_required")
            workflows.save_shot_frames(OUTPUT_ROOT, manifest, shot, previous_video, ffmpeg)
            previous_last_frame = Path(shot["last_frame_path"])
            workflows.save_workflow(OUTPUT_ROOT, manifest)

        soundtrack_paths: list[Path] = []
        music_source_path = manifest["soundtrack"].get("music_source_path")
        if manifest["soundtrack"]["mode"] == "music3" and music_source_path:
            source_file = Path(music_source_path)
            if not source_file.is_file():
                raise RuntimeError("music_source_missing")
            soundtrack_paths.append(source_file)
        elif manifest["soundtrack"]["mode"] == "music3":
            soundtrack_strategy = manifest["soundtrack"].get("strategy", "per_shot")
            music_status = _music_status()
            if not music_status["model_ready"]:
                raise RuntimeError("music_model_missing")
            if not music_status["runtime_ready"]:
                raise RuntimeError("music_runtime_missing")
            music_model_path = _settings_snapshot()["music"]["model_path"]
            if soundtrack_strategy == "global":
                for segment in manifest["soundtrack_segments"]:
                    _check_workflow_cancelled(workflow_id)
                    existing_audio = workflows.safe_workflow_file(
                        OUTPUT_ROOT, workflow_id, segment.get("audio_path")
                    )
                    if segment.get("status") == "completed" and existing_audio is not None:
                        soundtrack_paths.append(existing_audio)
                        continue
                    segment.update({"status": "running", "error": "", "audio_path": None})
                    music_prompt = manifest["soundtrack"]["prompt"]
                    music_settings = _validate_music_generation({
                        "prompt": music_prompt,
                        "lyrics_mode": manifest["soundtrack"]["lyrics_mode"],
                        "lyrics": manifest["soundtrack"]["lyrics"],
                        "duration": segment["duration"], "steps": 30,
                        "seed": segment["music_seed"],
                    })
                    music_settings["model_path"] = music_model_path
                    job_id = _start_workflow_job(workflow_id, "music", music_prompt)
                    segment["job_id"] = job_id
                    workflows.save_workflow(OUTPUT_ROOT, manifest)
                    _run_music_job(
                        job_id, music_settings,
                        workflows.workflow_directory(OUTPUT_ROOT, workflow_id) / f"music3-{job_id}.wav"
                    )
                    with _lock:
                        completed_job = _jobs[job_id]
                    _check_workflow_cancelled(workflow_id)
                    if completed_job["status"] == "cancelled" or manifest.get("cancel_requested"):
                        raise GenerationCancelled("Workflow cancelled.")
                    if completed_job["status"] != "completed":
                        raise RuntimeError(
                            completed_job.get("error") or "workflow_soundtrack_failed"
                        )
                    segment.update({
                        "status": "completed",
                        "audio_path": str(completed_job["audio_path"]),
                        "error": "",
                    })
                    soundtrack_paths.append(completed_job["audio_path"])
                    workflows.save_workflow(OUTPUT_ROOT, manifest)
            else:
                for shot in manifest["shots"]:
                    _check_workflow_cancelled(workflow_id)
                    existing_audio = workflows.safe_workflow_file(
                        OUTPUT_ROOT, workflow_id, shot.get("music_path")
                    )
                    if shot.get("music_status") == "completed" and existing_audio is not None:
                        soundtrack_paths.append(existing_audio)
                        continue
                    shot.update({
                        "music_status": "running", "music_error": "", "music_path": None,
                    })
                    music_prompt = shot.get("music_prompt") or manifest["soundtrack"]["prompt"]
                    music_settings = _validate_music_generation({
                        "prompt": music_prompt,
                        "lyrics_mode": manifest["soundtrack"]["lyrics_mode"],
                        "lyrics": manifest["soundtrack"]["lyrics"],
                        "duration": math.ceil(float(shot["duration"])), "steps": 30,
                        "seed": shot.get("music_seed", 0),
                    })
                    music_settings["model_path"] = music_model_path
                    job_id = _start_workflow_job(workflow_id, "music", music_prompt)
                    shot["music_job_id"] = job_id
                    workflows.save_workflow(OUTPUT_ROOT, manifest)
                    _run_music_job(
                        job_id, music_settings,
                        workflows.workflow_directory(OUTPUT_ROOT, workflow_id) / f"music3-{job_id}.wav"
                    )
                    with _lock:
                        completed_job = _jobs[job_id]
                    _check_workflow_cancelled(workflow_id)
                    if completed_job["status"] == "cancelled" or manifest.get("cancel_requested"):
                        raise GenerationCancelled("Workflow cancelled.")
                    if completed_job["status"] != "completed":
                        raise RuntimeError(
                            completed_job.get("error") or "workflow_soundtrack_failed"
                        )
                    shot.update({
                        "music_status": "completed",
                        "music_path": str(completed_job["audio_path"]),
                        "music_error": "",
                    })
                    soundtrack_paths.append(completed_job["audio_path"])
                    workflows.save_workflow(OUTPUT_ROOT, manifest)

        shot_paths = [
            workflows.safe_workflow_file(OUTPUT_ROOT, workflow_id, shot.get("video_path"))
            for shot in manifest["shots"]
        ]
        if any(path is None for path in shot_paths):
            raise RuntimeError("workflow_shot_media_missing")
        ffmpeg = shutil.which("ffmpeg")
        ffprobe = shutil.which("ffprobe")
        if ffmpeg is None or ffprobe is None:
            raise RuntimeError("ffmpeg_and_ffprobe_required")
        _check_workflow_cancelled(workflow_id)
        output_path = workflows.assemble_workflow(
            OUTPUT_ROOT, manifest, shot_paths, soundtrack_paths, ffmpeg, ffprobe
        )
        _check_workflow_cancelled(workflow_id)
        manifest.update({
            "status": "completed", "output_path": str(output_path),
            "error": "", "cancel_requested": False,
        })
        workflows.save_workflow(OUTPUT_ROOT, manifest)
    except GenerationCancelled:
        if manifest is not None:
            manifest.update({"status": "cancelled", "error": "", "cancel_requested": False})
            workflows.save_workflow(OUTPUT_ROOT, manifest)
    except Exception as exc:
        if manifest is not None:
            manifest.update({"status": "failed", "error": str(exc), "cancel_requested": False})
            for item in manifest["shots"]:
                if item["status"] == "running":
                    item.update({"status": "failed", "error": str(exc)})
                if item.get("music_status") == "running":
                    item.update({"music_status": "failed", "music_error": str(exc)})
            for segment in manifest["soundtrack_segments"]:
                if segment.get("status") == "running":
                    segment.update({"status": "failed", "error": str(exc)})
            workflows.save_workflow(OUTPUT_ROOT, manifest)
    finally:
        workflows.mark_workflow_live(workflow_id, False)
        with _lock:
            _active_workflow_id = None
            _workflow_cancel_events.pop(workflow_id, None)


def _queue_workflow(manifest: dict, resume: bool = False) -> None:
    global _active_workflow_id
    workflow_id = manifest["id"]
    model = manifest.get("model", "h3")
    _require_enabled_model(model)
    if model == "h3":
        if not _find_models():
            raise RuntimeError("h3_model_missing")
    else:
        status = _local_model_status(model)
        if not status["model_ready"] or not status["runtime_ready"]:
            raise RuntimeError("local_model_not_ready")
    music_source_path = manifest["soundtrack"].get("music_source_path")
    if manifest["soundtrack"]["mode"] == "music3" and music_source_path:
        if not Path(music_source_path).is_file():
            raise RuntimeError("music_source_missing")
    elif manifest["soundtrack"]["mode"] == "music3":
        music_status = _music_status()
        if not music_status["model_ready"]:
            raise RuntimeError("music_model_missing")
        if not music_status["runtime_ready"]:
            raise RuntimeError("music_runtime_missing")
    if resume:
        for shot in manifest["shots"]:
            valid_video = workflows.safe_workflow_file(
                OUTPUT_ROOT, workflow_id, shot.get("video_path")
            )
            if shot["status"] != "completed" or valid_video is None:
                shot.update({
                    "status": "pending", "job_id": None,
                    "video_path": None, "audio_path": None, "error": "",
                })
            if manifest["soundtrack"]["mode"] == "music3":
                if manifest["soundtrack"].get("strategy", "per_shot") == "per_shot":
                    valid_music = workflows.safe_workflow_file(
                        OUTPUT_ROOT, workflow_id, shot.get("music_path")
                    )
                    if shot.get("music_status") != "completed" or valid_music is None:
                        shot.update({
                            "music_status": "pending", "music_job_id": None,
                            "music_path": None, "music_error": "",
                        })
        if (
            manifest["soundtrack"]["mode"] == "music3"
            and manifest["soundtrack"].get("strategy") == "global"
        ):
            for segment in manifest["soundtrack_segments"]:
                valid_audio = workflows.safe_workflow_file(
                    OUTPUT_ROOT, workflow_id, segment.get("audio_path")
                )
                if segment.get("status") != "completed" or valid_audio is None:
                    segment.update({
                        "status": "pending", "job_id": None,
                        "audio_path": None, "error": "",
                    })
        manifest["output_path"] = None
    manifest.update({
        "status": "queued", "error": "", "cancel_requested": False,
    })
    with _lock:
        if _active_job_id is not None or _active_workflow_id is not None:
            raise RuntimeError("job_already_running")
        _active_workflow_id = workflow_id
        _workflow_cancel_events[workflow_id] = threading.Event()
        workflows.save_workflow(OUTPUT_ROOT, manifest)
        workflows.mark_workflow_live(workflow_id, True)
        try:
            threading.Thread(
                target=_run_workflow,
                args=(workflow_id,),
                name=f"video-workflow-{workflow_id[:8]}",
                daemon=True,
            ).start()
        except RuntimeError:
            _active_workflow_id = None
            _workflow_cancel_events.pop(workflow_id, None)
            workflows.mark_workflow_live(workflow_id, False)
            raise


HISTORY_GENERATION_FIELDS = {
    "video": ("duration", "aspect", "steps", "seed", "turbo", "first_frame_id"),
    "image": ("seed",),
    "music": ("duration", "steps", "seed", "lyrics_mode", "lyrics"),
}


def _history_generation(kind: str, prompt: str, settings: dict) -> dict:
    validators = {
        "video": _validate_generation,
        "image": _validate_hidream_generation,
        "music": _validate_music_generation,
    }
    normalized = validators[kind]({**settings, "prompt": prompt})
    result = {key: normalized.get(key, "") for key in HISTORY_GENERATION_FIELDS[kind]}
    if "model" in normalized:
        result["model"] = normalized["model"]
        if kind == "image":
            result.update({key: normalized[key] for key in ("width", "height", "steps")})
    return result


def _persist_history(job: dict, media_paths: list[Path], settings: dict | None = None) -> None:
    job_id = str(uuid.UUID(job["id"]))
    directory = (workflows.workflow_directory(OUTPUT_ROOT, job["workflow_id"])
                 if job.get("workflow_id") else
                 output_storage.history_directory(OUTPUT_ROOT, job["kind"]))
    record = {
        "id": job_id,
        "kind": job["kind"],
        "created_at": job["created_at"],
        "prompt": job["prompt"],
        "name": _history_name(job.get("name", "")),
    }
    job["finished_at"] = time.time()
    record["elapsed_seconds"] = _job_elapsed_seconds(job)
    tokens = job.get("tokens")
    record["tokens"] = tokens if isinstance(tokens, int) else None
    job.setdefault("logs", []).append(
        f"Elapsed {record['elapsed_seconds']:.1f}s · tokens {tokens if isinstance(tokens, int) else '—'}"
    )
    if settings is not None:
        record["generation"] = _history_generation(job["kind"], job["prompt"], settings)
    frame_data = None
    if settings is not None and job["kind"] == "video" and settings.get("first_frame_image"):
        try:
            frame_data = base64.b64decode(settings["first_frame_image"], validate=True)
        except (ValueError, binascii.Error) as exc:
            raise RuntimeError("invalid_first_frame") from exc
        record["generation"]["first_frame_id"] = job_id
    serialized = json.dumps(record, ensure_ascii=False, allow_nan=False) + "\n"
    frame_path = directory / f"h3-{job_id}-first-frame.png"
    frame_written = False
    saved = False
    try:
        directory.mkdir(parents=True, exist_ok=True)
        if not media_paths or any(not path.is_file() for path in media_paths):
            raise RuntimeError("completed_media_missing")
        if frame_data is not None:
            with tempfile.NamedTemporaryFile(prefix=".history-frame-", dir=directory, delete=False) as frame_file:
                frame_temporary = Path(frame_file.name)
                try:
                    frame_file.write(frame_data)
                    frame_file.flush()
                    os.fsync(frame_file.fileno())
                except OSError:
                    frame_temporary.unlink(missing_ok=True)
                    raise
            try:
                os.replace(frame_temporary, frame_path)
                frame_written = True
            finally:
                frame_temporary.unlink(missing_ok=True)
        fd, temporary_path = tempfile.mkstemp(
            prefix=".history-", suffix=".json", dir=directory
        )
        try:
            os.fchmod(fd, 0o600)
            with os.fdopen(fd, "w", encoding="utf-8") as history_file:
                history_file.write(serialized)
                history_file.flush()
                os.fsync(history_file.fileno())
            os.replace(temporary_path, directory / f"{job_id}.json")
            saved = True
        except Exception:
            Path(temporary_path).unlink(missing_ok=True)
            raise
    except OSError as exc:
        raise RuntimeError(f"Could not save generation history: {exc}") from exc
    finally:
        if frame_written and not saved:
            frame_path.unlink(missing_ok=True)


def _history_items() -> list[dict]:
    if not OUTPUT_ROOT.exists():
        return []
    grouped: dict[str, dict] = {}
    patterns = (
        (re.compile(r"^h3-([0-9a-f-]{36})\.mp4$"), "video", "video_path"),
        (re.compile(r"^h3-([0-9a-f-]{36})\.wav$"), "video", "video_audio_path"),
        (re.compile(r"^hidream-([0-9a-f-]{36})\.png$"), "image", "image_path"),
        (re.compile(r"^music3-([0-9a-f-]{36})\.wav$"), "music", "music_audio_path"),
        (re.compile(r"^yue2-([0-9a-f-]{36})\.wav$"), "music", "music_audio_path"),
        (re.compile(r"^music-([0-9a-f-]{36})\.wav$"), "music", "music_audio_path"),
    )
    try:
        roots = [OUTPUT_ROOT, *(output_storage.history_directory(OUTPUT_ROOT, kind)
                               for kind in output_storage.HISTORY_DIRECTORIES)]
        for path in (path for root in roots if root.exists() for path in root.iterdir()):
            if not path.is_file() or path.is_symlink():
                continue
            for pattern, kind, field in patterns:
                match = pattern.fullmatch(path.name)
                if match is None:
                    continue
                try:
                    item_id = str(uuid.UUID(match.group(1)))
                except ValueError:
                    continue
                entry = grouped.setdefault(item_id, {
                    "id": item_id, "kind": kind, "prompt": "", "name": "", "created_at": path.stat().st_mtime,
                    "video_url": "", "audio_url": "", "image_url": "",
                    "generation": None, "first_frame_url": "",
                    "elapsed_seconds": None, "tokens": None,
                })
                if entry["kind"] != kind:
                    raise RuntimeError(f"Conflicting media types for history item {item_id}.")
                if field == "video_path":
                    entry["video_url"] = f"/api/history/{item_id}/video"
                elif field == "video_audio_path":
                    entry["audio_url"] = f"/api/history/{item_id}/audio"
                elif field == "image_path":
                    entry["image_url"] = f"/api/history/{item_id}/image"
                else:
                    entry["audio_url"] = f"/api/history/{item_id}/audio"
                entry["created_at"] = max(entry["created_at"], path.stat().st_mtime)
                break
        for item_id, entry in grouped.items():
            metadata_path = output_storage.history_file(OUTPUT_ROOT, entry["kind"], f"{item_id}.json")
            if not metadata_path.exists():
                continue
            try:
                metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError) as exc:
                raise RuntimeError(f"Could not read history metadata for {item_id}: {exc}") from exc
            if (
                not isinstance(metadata, dict)
                or metadata.get("id") != item_id
                or metadata.get("kind") != entry["kind"]
                or not isinstance(metadata.get("prompt"), str)
                or not isinstance(metadata.get("created_at"), (int, float))
            ):
                raise RuntimeError(f"Invalid history metadata for {item_id}.")
            entry["prompt"] = metadata["prompt"]
            entry["name"] = _history_name(metadata.get("name"))
            entry["created_at"] = metadata["created_at"]
            elapsed = metadata.get("elapsed_seconds")
            if isinstance(elapsed, (int, float)) and not isinstance(elapsed, bool) and elapsed >= 0:
                entry["elapsed_seconds"] = elapsed
            tokens = metadata.get("tokens")
            if isinstance(tokens, int) and not isinstance(tokens, bool) and tokens >= 0:
                entry["tokens"] = tokens
            if "generation" in metadata:
                generation = metadata["generation"]
                if not isinstance(generation, dict) or not all(
                    field in generation for field in HISTORY_GENERATION_FIELDS[entry["kind"]]
                ):
                    raise RuntimeError(f"Invalid generation settings for history item {item_id}.")
                try:
                    entry["generation"] = _history_generation(entry["kind"], entry["prompt"], generation)
                except (TypeError, ValueError) as exc:
                    raise RuntimeError(f"Invalid generation settings for history item {item_id}: {exc}") from exc
                if entry["kind"] == "video" and entry["generation"].get("first_frame_id"):
                    entry["first_frame_url"] = f"/api/history/{item_id}/first-frame"
    except OSError as exc:
        raise RuntimeError(f"Could not read generation history: {exc}") from exc
    return sorted(grouped.values(), key=lambda item: item["created_at"], reverse=True)


def _delete_history_item(item_id: str) -> list[str]:
    try:
        if str(uuid.UUID(item_id)) != item_id:
            raise ValueError("invalid_history_id")
    except ValueError as exc:
        raise ValueError("invalid_history_id") from exc
    with _storage_lock, _lock:
        if _active_job_id is not None or _active_workflow_id is not None:
            raise ValueError("job_already_running")
        names = (
            f"h3-{item_id}.mp4", f"h3-{item_id}.wav", f"hidream-{item_id}.png",
            f"music-{item_id}.wav", f"music3-{item_id}.wav", f"yue2-{item_id}.wav",
            f"h3-{item_id}-first-frame.png", f"{item_id}.json",
        )
        roots = [OUTPUT_ROOT, *(output_storage.history_directory(OUTPUT_ROOT, kind)
                               for kind in output_storage.HISTORY_DIRECTORIES)]
        paths = [root / name for root in roots for name in names]
        for path in paths:
            if path.is_symlink() or (path.exists() and not path.is_file()):
                raise ValueError("history_file_unsafe")
        if not any(item["id"] == item_id for item in _history_items()):
            metadata_path = next((path for path in paths
                                  if path.name == f"{item_id}.json" and path.is_file()), None)
            if metadata_path is None:
                raise FileNotFoundError("history_not_found")
            try:
                metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError) as exc:
                raise RuntimeError(f"Could not read history metadata for {item_id}: {exc}") from exc
            if not isinstance(metadata, dict) or metadata.get("id") != item_id or metadata.get("kind") not in {
                "video", "image", "music",
            }:
                raise ValueError("invalid_history_metadata")
        targets = {str(path.resolve()) for path in paths}

        def references_target(value: object, key: str = "") -> bool:
            if isinstance(value, dict):
                return any(references_target(item, name) for name, item in value.items())
            if isinstance(value, list):
                return any(references_target(item, key) for item in value)
            return isinstance(value, str) and key.endswith("_path") and str(Path(value).resolve()) in targets

        if any(references_target(manifest) for manifest in workflows.list_workflows(OUTPUT_ROOT)):
            raise ValueError("history_in_use")
        deleted = []
        try:
            for path in paths:
                if path.exists():
                    path.unlink()
                    deleted.append(path.name)
        except OSError as exc:
            raise RuntimeError(
                f"History deletion failed after removing {len(deleted)} files: {exc}"
            ) from exc
        _jobs.pop(item_id, None)
        return deleted


def _history_media_path(item_id: str, media_kind: str) -> tuple[Path | None, str]:
    try:
        normalized_id = str(uuid.UUID(item_id))
    except ValueError:
        return None, ""
    if normalized_id != item_id:
        return None, ""
    files = {
        "video": (f"h3-{item_id}.mp4", "video/mp4"),
        "image": (f"hidream-{item_id}.png", "image/png"),
        "first-frame": (f"h3-{item_id}-first-frame.png", "image/png"),
    }
    if media_kind == "audio":
        kind = next((item["kind"] for item in _history_items() if item["id"] == item_id), None)
        if kind == "video":
            filename = f"h3-{item_id}.wav"
        elif kind == "music":
            path = output_storage.history_music_file(OUTPUT_ROOT, item_id)
            return (path, "audio/wav") if path is not None and not path.is_symlink() else (None, "")
        else:
            return None, ""
        path = output_storage.history_file(OUTPUT_ROOT, kind, filename)
        content_type = "audio/wav"
    elif media_kind in files:
        filename, content_type = files[media_kind]
        kind = "image" if media_kind == "image" else "video"
        path = output_storage.history_file(OUTPUT_ROOT, kind, filename)
    else:
        return None, ""
    return (path, content_type) if path.is_file() and not path.is_symlink() else (None, "")


TOKENS_LOG_PATTERN = re.compile(r"^TOKENS:\s*(\d+)$")


def _append_log(job_id: str, line: str) -> None:
    with _lock:
        job = _jobs.get(job_id)
        if job is not None:
            job["logs"].append(line.rstrip())
            token_match = TOKENS_LOG_PATTERN.match(line.strip())
            if token_match:
                job["tokens"] = int(token_match.group(1))


def _check_cancelled(job_id: str) -> None:
    with _lock:
        job = _jobs[job_id]
        cancelled = job["cancel_requested"]
        stopped = job.get("cancel_stopped")
    if cancelled:
        if stopped is not None:
            stopped.wait()
        with _lock:
            if _jobs[job_id]["cancel_requested"]:
                raise GenerationCancelled("Generation cancelled.")


def _stop_process(process: subprocess.Popen) -> None:
    if isinstance(process, LocalInferenceProcess):
        process.stop_group()
        return
    if process.poll() is not None:
        return
    process.terminate()
    try:
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait(timeout=5)


def _cancel_job(job_id: str) -> dict:
    global _mlx_server_process
    with _lock:
        job = _jobs.get(job_id)
        if job is None or job["status"] not in {"queued", "loading", "running"}:
            raise ValueError("job_not_active")
        local_process = job.get("local_inference", False)
        process = job.get("process") if local_process or job.get("kind", "video") != "video" else job.get("h3_process")
        if not local_process and job.get("kind", "video") == "video" and job["status"] == "running" and process is None:
            raise RuntimeError("Cannot stop an externally managed H3 service; stop it in its owning application.")
        stopped = threading.Event()
        previous_status = job["status"]
        job["cancel_stopped"] = stopped
        job["cancel_requested"] = True
        job["status"] = "cancelling"
    try:
        # Closing a stream from another thread can block on its reader's buffer lock.
        # Stop the owned producer first; the generation thread closes its own stream.
        if process is not None:
            _stop_process(process)
            with _lock:
                if process is _mlx_server_process:
                    _mlx_server_process = None
        _append_log(job_id, (
            "Cancellation requested; backend computation stopped."
            if process is not None else "Cancellation requested before inference startup."
        ))
    except (OSError, subprocess.TimeoutExpired) as exc:
        with _lock:
            job["cancel_requested"] = False
            job["status"] = previous_status
            job["error"] = f"Could not stop generation process: {exc}"
            job["logs"].append(job["error"])
        raise RuntimeError(job["error"]) from exc
    finally:
        stopped.set()
    return job


def _read_server_output(process: subprocess.Popen) -> None:
    if process.stdout is None:
        return
    for line in process.stdout:
        with _lock:
            _server_logs.append(line.rstrip())


def _start_mlx_server(job_id: str, model_path: Path) -> None:
    global _mlx_server_process
    _check_cancelled(job_id)
    with _lock:
        owned_process = _mlx_server_process
    if (owned_process is None or owned_process.poll() is not None) and _service_health():
        with _lock:
            if _jobs[job_id]["cancel_requested"]:
                raise GenerationCancelled("Generation cancelled.")
            _jobs[job_id]["h3_process"] = None
        return
    executable = _local_mlx_serve()
    if executable is None:
        raise RuntimeError(
            f"MLX-Serve is not installed. Install the Apple Silicon runtime from {RUNTIME_URL}."
        )
    with _lock:
        if _jobs[job_id]["cancel_requested"]:
            raise GenerationCancelled("Generation cancelled.")
        process = _mlx_server_process
        if process is not None and process.poll() is not None:
            _mlx_server_process = None
            process = None
        if process is None:
            _server_logs.clear()
            parsed_url = urlparse(_settings_snapshot()["video"]["service_url"])
            try:
                _mlx_server_process = subprocess.Popen(
                    [
                        str(executable), "--model", str(model_path), "--serve",
                        "--host", parsed_url.hostname or "127.0.0.1",
                        "--port", str(parsed_url.port or 11234),
                    ],
                    stdin=subprocess.DEVNULL,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    bufsize=1,
                )
            except OSError as exc:
                raise RuntimeError(f"Could not start MLX-Serve: {exc}") from exc
            process = _mlx_server_process
            threading.Thread(
                target=_read_server_output,
                args=(process,),
                name="mlx-serve-log-reader",
                daemon=True,
            ).start()
        _jobs[job_id]["h3_process"] = process
    deadline = time.monotonic() + 90
    while time.monotonic() < deadline:
        _check_cancelled(job_id)
        if _service_health():
            return
        if process is not None and process.poll() is not None:
            with _lock:
                logs = "\n".join(_server_logs)
            raise RuntimeError(f"MLX-Serve exited during startup. {logs}".strip())
        time.sleep(0.5)
    raise RuntimeError(
        f"MLX-Serve did not become ready at {_settings_snapshot()['video']['service_url']} within 90 seconds."
    )


def _find_h3_model_id(models: list[dict], preferred_id: str = "") -> str | None:
    ready = [
        model for model in models
        if _is_h3_video_model(model) and model.get("state", "ready") == "ready"
    ]
    if preferred_id:
        return preferred_id if any(model.get("id") == preferred_id for model in ready) else None
    if ready:
        return str(ready[0].get("id", "")) or None
    return None


def _load_h3_model(job_id: str, model_path: Path) -> str:
    global _h3_reload_required
    preferred_id = _settings_snapshot()["video"]["model_id"]
    _start_mlx_server(job_id, model_path)
    _check_cancelled(job_id)
    models = _service_models()
    current = _find_h3_model_id(models, preferred_id)
    if current and not _h3_reload_required:
        _append_log(job_id, f"Using loaded H3 model: {current}")
        return current

    _append_log(job_id, f"Loading local 4-bit H3 model from {model_path}")
    _request_json("/v1/load-model", {"model": str(model_path), "default": True}, timeout=1800)
    deadline = time.monotonic() + 1800
    while time.monotonic() < deadline:
        _check_cancelled(job_id)
        models = _service_models()
        model_id = _find_h3_model_id(models, preferred_id)
        if model_id:
            _h3_reload_required = False
            _append_log(job_id, f"Loaded H3 model: {model_id}")
            return model_id
        time.sleep(2)
    raise RuntimeError("MLX-Serve did not report a ready MiniMax-H3 video model after loading.")


def _decode_model_media(job_id: str, event: dict, output_path: Path) -> tuple[Path, Path | None]:
    try:
        output_path.parent.mkdir(parents=True, exist_ok=True)
    except OSError as exc:
        raise RuntimeError(f"Output directory is unavailable: {exc}") from exc
    if event.get("format") != "rgb8":
        raise RuntimeError(f"Unexpected video format from MLX-Serve: {event.get('format')!r}")
    try:
        width = int(event["width"])
        height = int(event["height"])
        frame_count = int(event["frames"])
        fps = int(event["fps"])
        video_data = base64.b64decode(event["data"], validate=True)
    except (KeyError, TypeError, ValueError, binascii.Error) as exc:
        raise RuntimeError("MLX-Serve returned malformed video frame data.") from exc
    expected_video_size = width * height * frame_count * 3
    if width <= 0 or height <= 0 or frame_count <= 0 or fps <= 0 or len(video_data) != expected_video_size:
        raise RuntimeError(
            f"MLX-Serve returned {len(video_data)} video bytes; expected {expected_video_size}."
        )
    audio_path: Path | None = None
    audio_data = event.get("audio_data")
    if audio_data is not None:
        if event.get("audio_format") != "pcm_s16le":
            raise RuntimeError(f"Unexpected H3 audio format: {event.get('audio_format')!r}")
        try:
            audio_bytes = base64.b64decode(audio_data, validate=True)
            sample_rate = int(event["audio_sample_rate"])
            channels = int(event["audio_channels"])
        except (KeyError, TypeError, ValueError, binascii.Error) as exc:
            raise RuntimeError("MLX-Serve returned malformed audio data.") from exc
        if sample_rate <= 0 or channels <= 0 or len(audio_bytes) % (2 * channels) != 0:
            raise RuntimeError("MLX-Serve returned invalid PCM audio dimensions.")
        audio_path = output_path.with_suffix(".wav")
        with wave.open(str(audio_path), "wb") as wav_file:
            wav_file.setnchannels(channels)
            wav_file.setsampwidth(2)
            wav_file.setframerate(sample_rate)
            wav_file.writeframes(audio_bytes)

    ffmpeg = shutil.which("ffmpeg")
    if ffmpeg is None:
        raise RuntimeError("ffmpeg is required to mux MLX-Serve rgb8 frames into MP4; install ffmpeg and retry.")
    raw_video_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            prefix=f"h3-{job_id}-", suffix=".rgb", dir=output_path.parent, delete=False
        ) as raw_video:
            raw_video_path = Path(raw_video.name)
            raw_video.write(video_data)
        video_data = b""
        command = [
            ffmpeg, "-nostdin", "-y", "-loglevel", "error",
            "-f", "rawvideo", "-pix_fmt", "rgb24",
            "-s", f"{width}x{height}", "-r", str(fps), "-i", str(raw_video_path),
        ]
        if audio_path is not None:
            command += ["-i", str(audio_path), "-c:a", "aac", "-b:a", "192k", "-shortest"]
        command += ["-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p",
                    str(output_path)]
        try:
            result = subprocess.run(command, capture_output=True, text=True, timeout=1800)
        except (OSError, subprocess.TimeoutExpired) as exc:
            raise RuntimeError(f"Could not mux generated video: {exc}") from exc
        if result.returncode != 0:
            raise RuntimeError(f"ffmpeg failed to encode H3 output: {result.stderr[-2000:]}")
    finally:
        if raw_video_path is not None:
            raw_video_path.unlink(missing_ok=True)
    return output_path, audio_path


def _generate(job_id: str, model_id: str, settings: dict, output_path: Path) -> tuple[Path, Path | None]:
    request_body = json.dumps(_generation_request(model_id, settings)).encode("utf-8")
    base_url = _settings_snapshot()["video"]["service_url"]
    request = Request(
        f"{base_url}/v1/video/generations",
        data=request_body,
        headers={"Content-Type": "application/json", "Accept": "text/event-stream"},
    )
    try:
        response = urlopen(request, timeout=1800)
    except HTTPError as exc:
        detail = exc.read(16_384).decode("utf-8", errors="replace")
        try:
            detail = json.loads(detail).get("error", {}).get("message", detail)
        except (json.JSONDecodeError, AttributeError):
            pass
        raise RuntimeError(f"MLX-Serve video API returned HTTP {exc.code}: {detail}") from exc
    except (URLError, TimeoutError, OSError) as exc:
        _check_cancelled(job_id)
        raise RuntimeError(f"Could not reach the MLX-Serve video API: {exc}") from exc

    with _lock:
        _jobs[job_id]["response"] = response
    complete_event = None
    try:
        for raw_line in response:
            _check_cancelled(job_id)
            line = raw_line.decode("utf-8", errors="replace").strip()
            if not line.startswith("data:"):
                continue
            try:
                event = json.loads(line[5:].strip())
            except json.JSONDecodeError as exc:
                raise RuntimeError("MLX-Serve sent a malformed generation progress event.") from exc
            event_type = event.get("type")
            if event_type == "progress":
                stage = str(event.get("stage", "generation"))
                step, total = event.get("step"), event.get("total")
                message = f"{stage}: step {step}/{total}" if step is not None else stage
                _append_log(job_id, message)
            elif event_type == "error":
                raise RuntimeError(str(event.get("message") or "MLX-Serve video generation failed."))
            elif event_type == "complete":
                complete_event = event
                break
        if complete_event is None:
            raise RuntimeError("MLX-Serve stream ended without a complete video result.")
    except Exception:
        _check_cancelled(job_id)
        raise
    finally:
        response.close()
        with _lock:
            _jobs[job_id]["response"] = None
    _append_log(job_id, f"Encoding {complete_event.get('frames', '?')} frames to MP4")
    _check_cancelled(job_id)
    try:
        result = _decode_model_media(job_id, complete_event, output_path)
        _check_cancelled(job_id)
        return result
    except GenerationCancelled:
        output_path.unlink(missing_ok=True)
        output_path.with_suffix(".wav").unlink(missing_ok=True)
        raise


def _run_job(job_id: str, settings: dict, model_path: Path, output_path: Path) -> None:
    if settings.get("model") in local_models.VIDEO_MODELS:
        _run_local_job(job_id, settings, output_path)
        return
    global _active_job_id
    try:
        with _lock:
            _jobs[job_id]["status"] = "loading"
        model_id = _load_h3_model(job_id, model_path)
        _check_cancelled(job_id)
        with _lock:
            _jobs[job_id]["status"] = "running"
            _jobs[job_id].setdefault("started_at", time.time())
        video_path, audio_path = _generate(job_id, model_id, settings, output_path)
        with _lock:
            job = _jobs[job_id]
        _persist_history(job, [video_path, *([audio_path] if audio_path is not None else [])], settings)
    except GenerationCancelled:
        output_path.unlink(missing_ok=True)
        output_path.with_suffix(".wav").unlink(missing_ok=True)
        with _lock:
            _jobs[job_id]["status"] = "cancelled"
    except Exception as exc:
        output_path.unlink(missing_ok=True)
        output_path.with_suffix(".wav").unlink(missing_ok=True)
        try:
            _check_cancelled(job_id)
        except GenerationCancelled:
            with _lock:
                _jobs[job_id]["status"] = "cancelled"
        else:
            with _lock:
                job = _jobs[job_id]
                job["status"] = "failed"
                job["error"] = str(exc)
                job["logs"].append(f"Generation failed: {exc}")
    else:
        with _lock:
            job = _jobs[job_id]
            job["status"] = "completed"
            job["video_path"] = video_path
            job["audio_path"] = audio_path
            job["logs"].append("Video generation complete.")
    finally:
        with _lock:
            job = _jobs[job_id]
            job["response"] = None
            _finish_job(_jobs[job_id])
            _active_job_id = None


def _run_hidream_job(job_id: str, settings: dict, output_path: Path) -> None:
    if settings.get("model") in local_models.IMAGE_MODELS:
        _run_local_job(job_id, settings, output_path)
        return
    global _active_job_id
    process: subprocess.Popen | None = None
    try:
        model_path = Path(settings.get("model_path", _settings_snapshot()["image"]["model_path"])).expanduser()
        status = _hidream_status(model_path)
        if not status["model_ready"]:
            raise RuntimeError("hidream_model_missing")
        if not status["runtime_ready"]:
            raise RuntimeError("hidream_runtime_missing")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        command = [
            str(HIDREAM_PYTHON),
            "-u",
            str(HIDREAM_SCRIPT),
            "--model-path",
            str(model_path),
            "--prompt",
            settings["prompt"],
            "--width",
            str(settings["width"]),
            "--height",
            str(settings["height"]),
            "--seed",
            str(settings["seed"]),
            "--num-inference-steps",
            "28",
            "--output",
            str(output_path),
        ]
        _check_cancelled(job_id)
        _append_log(job_id, f"Loading HiDream Q6 at {settings['width']}x{settings['height']}")
        process = subprocess.Popen(
            command,
            cwd=HIDREAM_CODE_ROOT,
            stdin=subprocess.DEVNULL,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
        )
        with _lock:
            job = _jobs[job_id]
            cancelled = job["cancel_requested"]
            if not cancelled:
                job["status"] = "running"
                job.setdefault("started_at", time.time())
                job["process"] = process
        if cancelled:
            _stop_process(process)
            _check_cancelled(job_id)
        if process.stdout is not None:
            for line in process.stdout:
                _check_cancelled(job_id)
                _append_log(job_id, line[:1000])
        return_code = process.wait()
        with _lock:
            _jobs[job_id]["process"] = None
        _check_cancelled(job_id)
        if return_code != 0:
            raise RuntimeError(f"HiDream inference exited with status {return_code}.")
        if not output_path.is_file() or output_path.stat().st_size < 8:
            raise RuntimeError("HiDream inference finished without producing an image.")
        with output_path.open("rb") as image_file:
            if image_file.read(8) != b"\x89PNG\r\n\x1a\n":
                raise RuntimeError("HiDream inference output is not a valid PNG image.")
        with _lock:
            job = _jobs[job_id]
        _persist_history(job, [output_path], settings)
    except GenerationCancelled:
        output_path.unlink(missing_ok=True)
        with _lock:
            _jobs[job_id]["status"] = "cancelled"
    except Exception as exc:
        output_path.unlink(missing_ok=True)
        with _lock:
            job = _jobs[job_id]
            job["status"] = "failed"
            job["error"] = str(exc)
            job["logs"].append(f"Image generation failed: {exc}")
    else:
        with _lock:
            job = _jobs[job_id]
            job["status"] = "completed"
            job["image_path"] = output_path
            job["logs"].append("Image generation complete.")
    finally:
        if process is not None:
            if process.poll() is None:
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait()
            if process.stdout is not None:
                process.stdout.close()
        with _lock:
            job = _jobs[job_id]
            job["process"] = None
            _finish_job(_jobs[job_id])
            _active_job_id = None


def _run_local_job(job_id: str, settings: dict, output_path: Path) -> None:
    global _active_job_id
    process: subprocess.Popen | None = None
    frame_path: Path | None = None
    try:
        model = settings["model"]
        _require_enabled_model(model)
        status = _local_model_status(model)
        settings = {**settings, "model_path": str(_local_model_path(model)),
                    "gemma_path": _settings_snapshot()["gemma_path"]}
        if not status["model_ready"] or not status["runtime_ready"]:
            raise RuntimeError("local_model_not_ready")
        _check_cancelled(job_id)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        if settings.get("first_frame_image"):
            with tempfile.NamedTemporaryFile(prefix=f"ltx-frame-{job_id}-", suffix=".png",
                                             dir=output_path.parent, delete=False) as file:
                frame_path = Path(file.name)
                file.write(base64.b64decode(settings["first_frame_image"], validate=True))
        with _lock:
            _jobs[job_id]["local_inference"] = True
        _append_log(job_id, f"Loading {model} from {status['model_path']}")
        _check_cancelled(job_id)
        process = LocalInferenceProcess(
            local_models.command(settings, output_path, frame_path),
            local_models.environment(model),
        )
        with _lock:
            job = _jobs[job_id]
            cancelled = job["cancel_requested"]
            if not cancelled:
                job["process"] = process
                job["status"] = "running"
                job.setdefault("started_at", time.time())
        if cancelled:
            _stop_process(process)
            _check_cancelled(job_id)
        if process.stdout is not None:
            for line in process.stdout:
                _check_cancelled(job_id)
                _append_log(job_id, line[:1000])
        return_code = process.wait()
        _check_cancelled(job_id)
        if return_code != 0:
            raise RuntimeError(f"{model} inference exited with status {return_code}.")
        if not output_path.is_file() or output_path.stat().st_size < 8:
            raise RuntimeError(f"{model} produced no output.")
        if model in local_models.IMAGE_MODELS:
            from PIL import Image
            with Image.open(output_path) as image:
                if image.format != "PNG" or image.size != (settings["width"], settings["height"]):
                    raise RuntimeError("Local image output format or dimensions are invalid.")
                image.verify()
        else:
            probe = subprocess.run(
                ["ffprobe", "-v", "error", "-select_streams", "v:0",
                 "-show_entries", "stream=width,height", "-of", "json", str(output_path)],
                capture_output=True, text=True, timeout=30, check=True,
            )
            if not json.loads(probe.stdout).get("streams"):
                raise RuntimeError("Local video output contains no video stream.")
        with _lock:
            job = _jobs[job_id]
        _persist_history(job, [output_path], settings)
        with _lock:
            job["status"] = "completed"
            job["image_path" if model in local_models.IMAGE_MODELS else "video_path"] = output_path
            job["logs"].append(f"{model} generation complete.")
    except GenerationCancelled:
        output_path.unlink(missing_ok=True)
        with _lock:
            _jobs[job_id]["status"] = "cancelled"
    except Exception as exc:
        output_path.unlink(missing_ok=True)
        try:
            _check_cancelled(job_id)
        except GenerationCancelled:
            with _lock:
                _jobs[job_id]["status"] = "cancelled"
        else:
            with _lock:
                job = _jobs[job_id]
                job.update({"status": "failed", "error": str(exc)})
                job["logs"].append(f"Local inference failed: {exc}")
    finally:
        if process is not None:
            _stop_process(process)
            if process.stdout is not None:
                process.stdout.close()
        if frame_path is not None:
            frame_path.unlink(missing_ok=True)
        with _lock:
            _jobs[job_id]["process"] = None
            _finish_job(_jobs[job_id])
            _active_job_id = None


def _run_music_job(job_id: str, settings: dict, output_path: Path) -> None:
    global _active_job_id
    process: subprocess.Popen | None = None
    lyrics_path: Path | None = None
    try:
        model = settings.get("model", "music3")
        model_path = Path(settings.get("model_path", _settings_snapshot()["music"]["model_path"])).expanduser()
        is_yue = model in local_models.MUSIC_MODELS
        status = _local_model_status(model) if is_yue else _music_status(model_path)
        if not status["model_ready"]:
            raise RuntimeError("music_model_missing")
        if not status["runtime_ready"]:
            raise RuntimeError("music_runtime_missing")
        label = "YuE2 3B" if is_yue else "MiniMax Music3"
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            newline="\n",
            prefix=f"music-lyrics-{job_id}-",
            suffix=".txt",
            dir=output_path.parent,
            delete=False,
        ) as lyrics_file:
            lyrics_file.write(settings["lyrics"])
            lyrics_path = Path(lyrics_file.name)

        if is_yue:
            command = [
                str(local_models.runtime_root(model) / ".venv" / "bin" / "python"), "-u", str(YUE2_GENERATE_SCRIPT),
                "--model", str(model_path), "--vae", str(local_models.YUE_VAE_PATH),
                "--style", settings["prompt"], "--lyrics-file", str(lyrics_path),
                "--seed", str(settings["seed"]), "--output", str(output_path),
            ]
            environment = local_models.environment(model)
            _append_log(job_id, "Loading YuE2 3B 8-bit; song length follows the lyrics structure.")
        else:
            command = [
                str(MUSIC_PYTHON),
                "-u",
                str(MUSIC_GENERATE_SCRIPT),
                "--model",
                str(model_path),
                "--caption",
                settings["prompt"],
                "--lyrics-file",
                str(lyrics_path),
                "--duration",
                str(settings["duration"]),
                "--steps",
                str(settings["steps"]),
                "--seed",
                str(settings["seed"]),
                "--output",
                str(output_path),
            ]
            environment = None
            _append_log(
                job_id,
                f"Loading MiniMax Music3 8-bit for up to {settings['duration']:g} seconds.",
            )
        _check_cancelled(job_id)
        process = LocalInferenceProcess(command, environment) if is_yue else subprocess.Popen(
            command,
            cwd=model_path,
            stdin=subprocess.DEVNULL,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
        )
        with _lock:
            job = _jobs[job_id]
            cancelled = job["cancel_requested"]
            if not cancelled:
                job["status"] = "running"
                job.setdefault("started_at", time.time())
                job["process"] = process
        if cancelled:
            _stop_process(process)
            _check_cancelled(job_id)
        if process.stdout is not None:
            for line in process.stdout:
                _check_cancelled(job_id)
                _append_log(job_id, line[:1000])
        return_code = process.wait()
        with _lock:
            _jobs[job_id]["process"] = None
        _check_cancelled(job_id)
        if return_code != 0:
            raise RuntimeError(f"{label} inference exited with status {return_code}.")
        if not output_path.is_file() or output_path.stat().st_size < 44:
            raise RuntimeError(f"{label} inference finished without producing a WAV file.")
        with output_path.open("rb") as audio_file:
            header = audio_file.read(12)
            if header[:4] != b"RIFF" or header[8:] != b"WAVE":
                raise RuntimeError(f"{label} output is not a valid WAV audio file.")
        with _lock:
            job = _jobs[job_id]
        _persist_history(job, [output_path], settings)
    except GenerationCancelled:
        output_path.unlink(missing_ok=True)
        with _lock:
            _jobs[job_id]["status"] = "cancelled"
    except Exception as exc:
        output_path.unlink(missing_ok=True)
        with _lock:
            job = _jobs[job_id]
            job["status"] = "failed"
            job["error"] = str(exc)
            job["logs"].append(f"Music generation failed: {exc}")
    else:
        with _lock:
            job = _jobs[job_id]
            job["status"] = "completed"
            job["audio_path"] = output_path
            job["logs"].append("Music generation complete.")
    finally:
        if lyrics_path is not None:
            lyrics_path.unlink(missing_ok=True)
        if process is not None:
            if process.poll() is None:
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait()
            if process.stdout is not None:
                process.stdout.close()
        with _lock:
            job = _jobs[job_id]
            job["process"] = None
            _finish_job(_jobs[job_id])
            _active_job_id = None


class WebHandler(BaseHTTPRequestHandler):
    server_version = "MiniMaxH3Web/1.0"

    def _local_request_allowed(self) -> bool:
        host = self.headers.get("Host", "").split(":", 1)[0].strip("[]").lower()
        origin = self.headers.get("Origin")
        if host not in {"127.0.0.1", "localhost"}:
            return False
        if origin and urlparse(origin).hostname not in {"127.0.0.1", "localhost"}:
            return False
        return True

    def _send_json(self, value: dict, status: int = 200) -> None:
        data = json.dumps(value, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def _send_file(self, path: Path, content_type: str) -> None:
        size = path.stat().st_size
        start, end = 0, size - 1
        range_header = self.headers.get("Range")
        if range_header:
            match = re.fullmatch(r"bytes=(\d*)-(\d*)", range_header.strip())
            if not match or (not match.group(1) and not match.group(2)):
                self.send_error(416, "Invalid byte range")
                return
            if match.group(1):
                start = int(match.group(1))
                end = int(match.group(2)) if match.group(2) else size - 1
            else:
                start = max(0, size - int(match.group(2)))
            if start >= size or end < start:
                self.send_error(416, "Range not satisfiable")
                return
            end = min(end, size - 1)
            self.send_response(206)
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        else:
            self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        with path.open("rb") as media:
            media.seek(start)
            remaining = end - start + 1
            while remaining:
                chunk = media.read(min(64 * 1024, remaining))
                if not chunk:
                    break
                self.wfile.write(chunk)
                remaining -= len(chunk)

    def do_GET(self) -> None:
        if not self._local_request_allowed():
            self._send_json({"error": "localhost_only"}, 403)
            return
        parsed = urlparse(self.path)
        if parsed.path == "/api/system-prompts":
            try:
                self._send_json(prompt_settings.snapshot())
            except RuntimeError as exc:
                self._send_json({"error": "prompt_settings_unavailable", "detail": str(exc)}, 500)
            return
        frame_match = re.fullmatch(
            r"/api/first-frames/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})",
            parsed.path,
        )
        if frame_match:
            image_id = frame_match.group(1)
            if str(uuid.UUID(image_id)) != image_id:
                self._send_json({"error": "invalid_first_frame"}, 400)
                return
            path = OUTPUT_ROOT / "first-frames" / f"{image_id}.png"
            if not path.is_file() or path.is_symlink():
                self._send_json({"error": "first_frame_not_found"}, 404)
                return
            self._send_file(path, "image/png")
            return
        if parsed.path == "/api/settings":
            try:
                settings = _settings_snapshot()
            except (RuntimeError, ValueError) as exc:
                self._send_json({"error": "settings_unavailable", "detail": str(exc)}, 500)
                return
            self._send_json({"settings": settings})
            return
        if parsed.path == "/api/models":
            info = _scan_models()
            settings = _settings_snapshot()
            try:
                info["downloads"] = {
                    model: model_downloads.progress(
                        model, Path(entry["model_path"]).expanduser(),
                        Path(settings["gemma_path"]).expanduser(),
                    ) for model, entry in settings["models"].items()
                }
                for model, status in (("h3", info), ("hidream", info["hidream"]), ("music3", info["music"])):
                    progress = info["downloads"][model]
                    if progress["download_state"] == "not_started" and status["model_ready"]:
                        progress.update(download_state="completed", download_percent=100)
            except (OSError, ValueError, KeyError, TypeError) as exc:
                self._send_json({"error": "download_status_failed", "detail": str(exc)}, 500)
                return
            self._send_json(info)
            return
        if parsed.path == "/api/text-models":
            try:
                models = _local_text_models()
            except RuntimeError as exc:
                self._send_json({"error": "local_text_runtime_unavailable", "detail": str(exc)}, 503)
                return
            self._send_json({"models": models})
            return
        if parsed.path == "/api/history":
            try:
                items = _history_items()
            except RuntimeError as exc:
                self._send_json({"error": "history_unavailable", "detail": str(exc)}, 500)
                return
            self._send_json({"items": items})
            return
        history_media_match = re.fullmatch(
            r"/api/history/([0-9a-f-]{36})/(video|audio|image|first-frame)", parsed.path
        )
        if history_media_match:
            try:
                media_path, content_type = _history_media_path(*history_media_match.groups())
            except RuntimeError as exc:
                self._send_json({"error": "history_unavailable", "detail": str(exc)}, 500)
                return
            if media_path is None:
                self._send_json({"error": "media_not_found"}, 404)
                return
            self._send_file(media_path, content_type)
            return
        if parsed.path == "/api/workflows":
            try:
                items = workflows.list_workflows(OUTPUT_ROOT)
            except (RuntimeError, OSError) as exc:
                self._send_json({"error": "workflow_unavailable", "detail": str(exc)}, 500)
                return
            self._send_json({"items": [_public_workflow(item) for item in items]})
            return
        workflow_media_match = re.fullmatch(
            r"/api/workflows/([0-9a-f-]{36})/(final|shots/([0-9a-f-]{36})/(video|audio|music|image|first-frame|last-frame))",
            parsed.path,
        )
        if workflow_media_match:
            workflow_id, media_kind, shot_id, shot_kind = workflow_media_match.groups()
            try:
                manifest = workflows.get_workflow(OUTPUT_ROOT, workflow_id)
            except (RuntimeError, ValueError, OSError) as exc:
                self._send_json({"error": "workflow_unavailable", "detail": str(exc)}, 500)
                return
            if manifest is None:
                self._send_json({"error": "workflow_not_found"}, 404)
                return
            if media_kind == "final":
                media_path = workflows.safe_workflow_file(
                    OUTPUT_ROOT, workflow_id, manifest.get("output_path")
                )
                content_type = "video/mp4"
            else:
                shot = next((item for item in manifest["shots"] if item["id"] == shot_id), None)
                path_key = {
                    "video": "video_path",
                    "audio": "audio_path",
                    "music": "music_path",
                    "image": "first_frame_path",
                    "first-frame": "generated_first_frame_path",
                    "last-frame": "last_frame_path",
                }[shot_kind]
                media_path = workflows.safe_workflow_file(
                    OUTPUT_ROOT, workflow_id, shot.get(path_key) if shot else None
                )
                content_type = (
                    "image/png" if shot_kind in {"image", "first-frame", "last-frame"} else
                    "video/mp4" if shot_kind == "video" else "audio/wav"
                )
            if media_path is None:
                self._send_json({"error": "media_not_found"}, 404)
                return
            self._send_file(media_path, content_type)
            return
        workflow_match = re.fullmatch(r"/api/workflows/([0-9a-f-]{36})", parsed.path)
        if workflow_match:
            try:
                manifest = workflows.get_workflow(OUTPUT_ROOT, workflow_match.group(1))
            except (RuntimeError, ValueError, OSError) as exc:
                self._send_json({"error": "workflow_unavailable", "detail": str(exc)}, 500)
                return
            if manifest is None:
                self._send_json({"error": "workflow_not_found"}, 404)
                return
            self._send_json({"workflow": _public_workflow(manifest)})
            return
        if parsed.path == "/api/jobs/current":
            with _lock:
                standalone_jobs = [
                    item for item in _jobs.values() if not item.get("workflow_id")
                ]
                job = _jobs.get(_active_job_id) if _active_job_id else None
                latest = (
                    job if job is not None and not job.get("workflow_id")
                    else max(standalone_jobs, key=lambda item: item["created_at"])
                    if standalone_jobs else None
                )
                self._send_json({"job": _public_job(latest) if latest else None})
            return
        media_match = re.fullmatch(r"/api/jobs/([0-9a-f-]+)/(?P<kind>video|audio|image)", parsed.path)
        if media_match:
            with _lock:
                job = _jobs.get(media_match.group(1))
                media_path = job.get(f"{media_match.group('kind')}_path") if job else None
            if media_path is None or not media_path.is_file():
                self._send_json({"error": "media_not_found"}, 404)
                return
            media_type = {
                "video": "video/mp4",
                "audio": "audio/wav",
                "image": "image/png",
            }[media_match.group("kind")]
            self._send_file(media_path, media_type)
            return
        static_files = {
            "/": ("index.html", "text/html; charset=utf-8"),
            "/app.css": ("app.css", "text/css; charset=utf-8"),
            "/app.js": ("app.js", "text/javascript; charset=utf-8"),
            "/prompt-settings.js": ("prompt-settings.js", "text/javascript; charset=utf-8"),
        }
        item = static_files.get(parsed.path)
        if item is None:
            self._send_json({"error": "not_found"}, 404)
            return
        name, content_type = item
        self._send_file(STATIC_ROOT / name, content_type)

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        if path in {
            "/api/settings", "/api/first-frames", "/api/jobs", "/api/image-jobs",
            "/api/music-jobs", "/api/models/load",
        } or path.startswith("/api/workflows") or re.fullmatch(
            r"/api/models/([a-z0-9.-]+)/download/(start|pause)", path
        ):
            with _storage_lock:
                self._do_POST()
        else:
            self._do_POST()

    def do_DELETE(self) -> None:
        if not self._local_request_allowed():
            self._send_json({"error": "localhost_only"}, 403)
            return
        match = re.fullmatch(r"/api/history/([0-9a-f-]{36})", urlparse(self.path).path)
        if match is None:
            self._send_json({"error": "not_found"}, 404)
            return
        try:
            deleted = _delete_history_item(match.group(1))
        except FileNotFoundError:
            self._send_json({"error": "history_not_found"}, 404)
            return
        except ValueError as exc:
            self._send_json({"error": str(exc)}, 409)
            return
        except (OSError, RuntimeError) as exc:
            self._send_json({"error": "history_delete_failed", "detail": str(exc)}, 500)
            return
        self._send_json({"deleted": match.group(1), "files": deleted})

    def _do_POST(self) -> None:
        global _active_job_id
        if not self._local_request_allowed():
            self._send_json({"error": "localhost_only"}, 403)
            return
        parsed = urlparse(self.path)
        if parsed.path in {"/api/skills/requests", "/api/skills/convert", "/api/skills/validate"}:
            acquired = False
            try:
                if self.headers.get("Transfer-Encoding"):
                    raise skill_conversion.SkillError("unsupported_skill_transfer_encoding")
                length = int(self.headers.get("Content-Length", "0"))
                if not 0 < length <= skill_conversion.MAX_REQUEST_BYTES:
                    raise skill_conversion.SkillError("invalid_skill_request_size", 413)
                body = self.rfile.read(length)
                if len(body) != length:
                    raise skill_conversion.SkillError("incomplete_skill_request")
                payload = skill_conversion.parse_json(body)
                if parsed.path == "/api/skills/requests":
                    result = _prepare_skill_request(payload)
                elif parsed.path == "/api/skills/convert":
                    if set(payload) != {"request_id"}:
                        raise skill_conversion.SkillError("invalid_skill_fields")
                    acquired = _skill_conversion_lock.acquire(blocking=False)
                    if not acquired:
                        raise skill_conversion.SkillError("skill_conversion_busy", 409)
                    result = _convert_skill_request(payload["request_id"])
                else:
                    if set(payload) != {"request_id", "result"} or not isinstance(payload["result"], dict):
                        raise skill_conversion.SkillError("invalid_skill_fields")
                    record = _skill_record(payload["request_id"])
                    result = _validate_skill_candidate(record, payload["result"])
                    self._send_json(result, 200 if result["valid"] else 422)
                    return
                self._send_json(result, 201 if parsed.path == "/api/skills/requests" else 200)
            except skill_conversion.SkillError as exc:
                self._send_json({"error": str(exc), "findings": exc.findings}, exc.status)
            except (ValueError, UnicodeError) as exc:
                self._send_json({"error": "invalid_skill_request", "detail": str(exc)}, 400)
            except RuntimeError as exc:
                self._send_json({"error": "skill_backend_failed", "detail": str(exc)}, 502)
            finally:
                if acquired:
                    _skill_conversion_lock.release()
            return
        if parsed.path == "/api/system-prompts":
            try:
                length = int(self.headers.get("Content-Length", "0"))
                if not 0 < length <= MAX_REQUEST_BYTES:
                    raise ValueError("invalid_request_size")
                body = self.rfile.read(length)
                if len(body) != length:
                    raise ValueError("invalid_request_size")
                payload = json.loads(body)
                if (not isinstance(payload, dict) or set(payload) != {"config", "revision"}
                        or not isinstance(payload["revision"], str)):
                    raise ValueError("invalid_prompt_request")
                result = prompt_settings.save(payload["config"], payload["revision"])
            except prompt_settings.PromptConflict as exc:
                self._send_json({"error": str(exc)}, 409)
                return
            except (ValueError, UnicodeError) as exc:
                self._send_json({"error": str(exc) or "invalid_prompt_request"}, 400)
                return
            except RuntimeError as exc:
                self._send_json({"error": "prompt_settings_save_failed", "detail": str(exc)}, 500)
                return
            self._send_json(result)
            return
        download_match = re.fullmatch(r"/api/models/([a-z0-9.-]+)/download/(start|pause)", parsed.path)
        if download_match:
            if self.headers.get("Content-Length", "0") != "0":
                self._send_json({"error": "download_request_must_be_empty"}, 400)
                return
            model, action = download_match.groups()
            settings = _settings_snapshot()
            if model not in settings["models"]:
                self._send_json({"error": "invalid_generation_model"}, 400)
                return
            try:
                directory = Path(settings["models"][model]["model_path"]).expanduser()
                gemma = Path(settings["gemma_path"]).expanduser()
                if action == "start":
                    model_downloads.start(model, directory, gemma)
                else:
                    model_downloads.pause(model, directory, gemma)
            except (ValueError, RuntimeError) as exc:
                self._send_json({"error": str(exc)}, 409)
                return
            except OSError as exc:
                self._send_json({"error": "model_download_failed", "detail": str(exc)}, 500)
                return
            self._send_json({"model": model, "action": action}, 202)
            return
        if parsed.path == "/api/first-frames":
            try:
                from PIL import Image, ImageOps, UnidentifiedImageError
            except ImportError:
                self._send_json({"error": "image_runtime_missing"}, 503)
                return
            try:
                length = int(self.headers.get("Content-Length", "0"))
                if length <= 0 or length > 20 * 1024 * 1024:
                    self._send_json({"error": "first_frame_too_large"}, 413)
                    return
                data = self.rfile.read(length)
                if len(data) != length:
                    raise ValueError("invalid_first_frame")
                with Image.open(io.BytesIO(data)) as image:
                    if image.format not in {"PNG", "JPEG", "WEBP"} or image.width * image.height > 16_000_000:
                        raise ValueError("invalid_first_frame")
                    image.load()
                    normalized = ImageOps.exif_transpose(image).convert("RGB")
                    buffer = io.BytesIO()
                    normalized.save(buffer, format="PNG")
                content = buffer.getvalue()
                if len(content) > 20 * 1024 * 1024:
                    self._send_json({"error": "first_frame_too_large"}, 413)
                    return
            except (ValueError, UnidentifiedImageError, OSError, SyntaxError, Image.DecompressionBombError) as exc:
                self._send_json({"error": "invalid_first_frame", "detail": str(exc)}, 400)
                return
            try:
                directory = OUTPUT_ROOT / "first-frames"
                if directory.is_symlink():
                    raise OSError("Invalid first-frame storage")
                directory.mkdir(parents=True, exist_ok=True)
                os.chmod(directory, 0o700)
                image_id = str(uuid.uuid5(uuid.NAMESPACE_URL, hashlib.sha256(content).hexdigest()))
                path = directory / f"{image_id}.png"
                with _lock:
                    if path.is_symlink():
                        raise OSError("Invalid first-frame storage")
                    if not path.exists():
                        files = list(directory.glob("*.png"))
                        if len(files) >= 100 or sum(item.stat().st_size for item in files) + len(content) > 200 * 1024 * 1024:
                            self._send_json({"error": "first_frame_storage_full"}, 409)
                            return
                        temporary = None
                        try:
                            with tempfile.NamedTemporaryFile(dir=directory, delete=False) as file:
                                temporary = Path(file.name)
                                file.write(content)
                            os.replace(temporary, path)
                        finally:
                            if temporary is not None:
                                temporary.unlink(missing_ok=True)
            except OSError as exc:
                self._send_json({"error": "first_frame_save_failed", "detail": str(exc)}, 500)
                return
            self._send_json({"id": image_id, "image_url": f"/api/first-frames/{image_id}"}, 201)
            return
        if parsed.path == "/api/workflows":
            try:
                manifest = workflows.create_workflow(
                    OUTPUT_ROOT, _read_workflow_payload(self),
                    music_source_resolver=_resolve_workflow_music_source,
                )
            except (json.JSONDecodeError, UnicodeDecodeError, ValueError) as exc:
                self._send_json({"error": str(exc) or "invalid_request"}, 400)
                return
            except OSError as exc:
                self._send_json({"error": "workflow_save_failed", "detail": str(exc)}, 500)
                return
            except RuntimeError as exc:
                self._send_json({"error": "workflow_save_failed", "detail": str(exc)}, 500)
                return
            self._send_json({"workflow": _public_workflow(manifest)}, 201)
            return

        workflow_action = re.fullmatch(
            r"/api/workflows/([0-9a-f-]{36})/(update|start|resume|cancel|restore)", parsed.path
        )
        if workflow_action:
            workflow_id, action = workflow_action.groups()
            try:
                manifest = workflows.get_workflow(OUTPUT_ROOT, workflow_id)
                if manifest is None:
                    self._send_json({"error": "workflow_not_found"}, 404)
                    return
                if action == "update":
                    manifest = workflows.update_workflow(
                        OUTPUT_ROOT, workflow_id, _read_workflow_payload(self),
                        music_source_resolver=_resolve_workflow_music_source,
                    )
                    self._send_json({"workflow": _public_workflow(manifest)})
                    return
                if action == "restore":
                    manifest = workflows.restore_workflow(OUTPUT_ROOT, workflow_id)
                    self._send_json({"workflow": _public_workflow(manifest)}, 201)
                    return
                if action in {"start", "resume"}:
                    if action == "start" and manifest["status"] != "draft":
                        self._send_json({"error": "workflow_not_draft"}, 409)
                        return
                    if action == "resume" and manifest["status"] not in {
                        "failed", "cancelled", "interrupted",
                    }:
                        self._send_json({"error": "workflow_not_resumable"}, 409)
                        return
                    _queue_workflow(manifest, resume=action == "resume")
                    self._send_json({"workflow": _public_workflow(manifest)}, 202)
                    return
                if manifest["status"] not in {"queued", "running"}:
                    self._send_json({"error": "workflow_not_active"}, 409)
                    return
                with _lock:
                    event = _workflow_cancel_events.get(workflow_id)
                    if event is None:
                        raise RuntimeError("workflow_not_active")
                    event.set()
                    active_job = (
                        _jobs.get(_active_job_id)
                        if _active_workflow_id == workflow_id and _active_job_id else None
                    )
                    active_job_id = (
                        active_job["id"] if active_job is not None and active_job["status"] in {
                            "queued", "loading", "running",
                        } else None
                    )
                if active_job_id is not None:
                    try:
                        _cancel_job(active_job_id)
                    except ValueError:
                        pass  # The active shot finished after the cancellation flag was set.
                    except RuntimeError:
                        event.clear()
                        raise
                self._send_json({"workflow": _public_workflow(manifest)}, 202)
                return
            except (json.JSONDecodeError, UnicodeDecodeError, ValueError) as exc:
                self._send_json({"error": str(exc) or "invalid_request"}, 400)
                return
            except FileNotFoundError:
                self._send_json({"error": "workflow_not_found"}, 404)
                return
            except RuntimeError as exc:
                status = 409 if str(exc) in {
                    "job_already_running", "h3_model_missing",
                    "music_model_missing", "music_runtime_missing",
                } else 500
                self._send_json({"error": str(exc)}, status)
                return

        if parsed.path == "/api/settings":
            try:
                content_length = int(self.headers.get("Content-Length", "0"))
                if content_length <= 0 or content_length > MAX_REQUEST_BYTES:
                    raise ValueError("invalid_request_size")
                payload = json.loads(self.rfile.read(content_length))
                settings = _save_app_settings(payload)
            except (json.JSONDecodeError, UnicodeDecodeError, ValueError) as exc:
                self._send_json({"error": str(exc) or "invalid_settings"}, 400)
                return
            except RuntimeError as exc:
                self._send_json({"error": "settings_save_failed", "detail": str(exc)}, 500)
                return
            self._send_json({"settings": settings})
            return
        if parsed.path == "/api/storyboards":
            try:
                payload = _read_workflow_payload(self)
                settings = _validate_storyboard_request(payload)
            except (json.JSONDecodeError, UnicodeDecodeError, ValueError) as exc:
                self._send_json({"error": str(exc) or "invalid_request"}, 400)
                return
            with _lock:
                if _active_job_id is not None or _active_workflow_id is not None:
                    self._send_json({"error": "job_already_running"}, 409)
                    return
            try:
                result = _storyboard_with_local_model(settings)
            except ValueError as exc:
                self._send_json({"error": str(exc)}, 409)
                return
            except RuntimeError as exc:
                self._send_json({
                    "error": "local_text_generation_failed", "detail": str(exc),
                }, 502)
                return
            self._send_json(result)
            return
        if parsed.path == "/api/prompt-enhancements":
            try:
                content_length = int(self.headers.get("Content-Length", "0"))
                if content_length <= 0 or content_length > MAX_REQUEST_BYTES:
                    raise ValueError("invalid_request_size")
                payload = json.loads(self.rfile.read(content_length))
                if not isinstance(payload, dict):
                    raise ValueError("invalid_request")
                settings = _validate_prompt_enhancement(payload)
            except (json.JSONDecodeError, UnicodeDecodeError, ValueError) as exc:
                self._send_json({"error": str(exc) or "invalid_request"}, 400)
                return
            try:
                result = _enhance_prompt_with_local_model(settings)
            except ValueError as exc:
                self._send_json({"error": str(exc)}, 409)
                return
            except RuntimeError as exc:
                self._send_json({
                    "error": "local_text_generation_failed",
                    "detail": str(exc),
                }, 502)
                return
            self._send_json(result)
            return
        if parsed.path == "/api/models/load":
            try:
                _require_enabled_model("h3")
            except ValueError as exc:
                self._send_json({"error": str(exc)}, 409)
                return
            if not _service_health() and _local_mlx_serve() is None:
                self._send_json({"error": "mlx_serve_missing"}, 409)
                return
            with _lock:
                if _active_job_id is not None or _active_workflow_id is not None:
                    self._send_json({"error": "job_already_running"}, 409)
                    return
                try:
                    model_path = Path(_find_models()[0])
                except IndexError:
                    self._send_json({"error": "h3_model_missing"}, 409)
                    return
                job_id = str(uuid.uuid4())
                job = {
                    "id": job_id, "kind": "video", "status": "loading", "created_at": time.time(),
                    "prompt": "", "logs": deque(maxlen=100), "error": "",
                    "video_path": None, "audio_path": None, "process": None,
                    "response": None, "cancel_requested": False,
                }
                _jobs[job_id] = job
                _active_job_id = job_id

            def load_model() -> None:
                global _active_job_id
                try:
                    model_id = _load_h3_model(job_id, model_path)
                except Exception as exc:
                    with _lock:
                        _jobs[job_id]["status"] = "failed"
                        _jobs[job_id]["error"] = str(exc)
                        _jobs[job_id]["logs"].append(f"Model loading failed: {exc}")
                else:
                    with _lock:
                        _jobs[job_id]["status"] = "completed"
                        _jobs[job_id]["logs"].append(f"Ready: {model_id}")
                finally:
                    with _lock:
                        _finish_job(_jobs[job_id])
                        _active_job_id = None

            threading.Thread(target=load_model, name=f"h3-model-load-{job_id[:8]}", daemon=True).start()
            with _lock:
                self._send_json({"job": _public_job(job)}, 202)
            return

        cancel_match = re.fullmatch(r"/api/jobs/([0-9a-f-]+)/cancel", parsed.path)
        if cancel_match:
            try:
                job = _cancel_job(cancel_match.group(1))
            except ValueError as exc:
                self._send_json({"error": str(exc)}, 409)
                return
            except RuntimeError as exc:
                self._send_json({"error": str(exc)}, 500)
                return
            with _lock:
                self._send_json({"job": _public_job(job)})
            return

        is_hidream_request = parsed.path == "/api/image-jobs"
        is_music_request = parsed.path == "/api/music-jobs"
        if parsed.path not in {"/api/jobs", "/api/image-jobs", "/api/music-jobs"}:
            self._send_json({"error": "not_found"}, 404)
            return
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            if content_length <= 0 or content_length > MAX_REQUEST_BYTES:
                raise ValueError("invalid_request_size")
            payload = json.loads(self.rfile.read(content_length))
            if not isinstance(payload, dict):
                raise ValueError("invalid_request")
            if is_hidream_request:
                settings = _validate_hidream_generation(payload)
                if "model" not in settings:
                    settings["model_path"] = _settings_snapshot()["image"]["model_path"]
            elif is_music_request:
                settings = _validate_music_generation(payload)
                settings["model_path"] = _settings_snapshot()["models"][settings["model"]]["model_path"]
            else:
                settings = _validate_generation(payload)
                if settings.get("first_frame_id"):
                    image = workflows.read_first_frame(OUTPUT_ROOT, settings["first_frame_id"])
                    settings["first_frame_image"] = base64.b64encode(image).decode("ascii")
                app_settings = _settings_snapshot()["video"]
                settings["api_params"] = app_settings["api_params"]
            settings["name"] = _validate_project_name(payload)
            _require_enabled_model(settings.get("model", "hidream" if is_hidream_request else "h3"))
        except (json.JSONDecodeError, UnicodeDecodeError, ValueError) as exc:
            self._send_json({"error": str(exc) or "invalid_request"}, 400)
            return
        except (OSError, RuntimeError) as exc:
            self._send_json({"error": "first_frame_read_failed", "detail": str(exc)}, 500)
            return

        if is_hidream_request:
            status = _local_model_status(settings["model"]) if "model" in settings else _hidream_status()
            if "model" in settings and not (status["model_ready"] and status["runtime_ready"]):
                self._send_json({"error": "local_model_not_ready", "detail": status["runtime_error"]}, 409)
                return
            if not status["model_ready"]:
                self._send_json({"error": "hidream_model_missing"}, 409)
                return
            if not status["runtime_ready"]:
                self._send_json({"error": "hidream_runtime_missing"}, 409)
                return
            try:
                OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
            except OSError as exc:
                self._send_json({"error": f"output_directory_unavailable: {exc}"}, 500)
                return
            with _lock:
                if _active_job_id is not None or _active_workflow_id is not None:
                    self._send_json({"error": "job_already_running"}, 409)
                    return
                job_id = str(uuid.uuid4())
                output_path = output_storage.history_directory(OUTPUT_ROOT, "image") / f"hidream-{job_id}.png"
                job = {
                    "id": job_id, "kind": "image", "status": "queued",
                    "created_at": time.time(), "prompt": settings["prompt"], "name": settings["name"],
                    "logs": deque(maxlen=100), "error": "", "image_path": None,
                    "process": None, "response": None, "cancel_requested": False,
                }
                _jobs[job_id] = job
                _active_job_id = job_id
                threading.Thread(
                    target=_run_hidream_job,
                    args=(job_id, settings, output_path),
                    name=f"hidream-generation-{job_id[:8]}",
                    daemon=True,
                ).start()
                self._send_json({"job": _public_job(job)}, 202)
            return

        if is_music_request:
            if settings["model"] in local_models.MUSIC_MODELS:
                status = _local_model_status(settings["model"])
                if not (status["model_ready"] and status["runtime_ready"]):
                    self._send_json({"error": "local_model_not_ready", "detail": status["runtime_error"]}, 409)
                    return
            else:
                status = _music_status(Path(settings["model_path"]))
            if not status["model_ready"]:
                self._send_json({"error": "music_model_missing"}, 409)
                return
            if not status["runtime_ready"]:
                self._send_json({"error": "music_runtime_missing"}, 409)
                return
            try:
                OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
            except OSError as exc:
                self._send_json({"error": f"output_directory_unavailable: {exc}"}, 500)
                return
            with _lock:
                if _active_job_id is not None or _active_workflow_id is not None:
                    self._send_json({"error": "job_already_running"}, 409)
                    return
                job_id = str(uuid.uuid4())
                output_path = output_storage.history_directory(OUTPUT_ROOT, "music") / f"music-{job_id}.wav"
                job = {
                    "id": job_id, "kind": "music", "status": "queued",
                    "created_at": time.time(), "prompt": settings["prompt"], "name": settings["name"],
                    "logs": deque(maxlen=100), "error": "", "audio_path": None,
                    "process": None, "response": None, "cancel_requested": False,
                }
                _jobs[job_id] = job
                _active_job_id = job_id
                threading.Thread(
                    target=_run_music_job,
                    args=(job_id, settings, output_path),
                    name=f"music3-generation-{job_id[:8]}",
                    daemon=True,
                ).start()
                self._send_json({"job": _public_job(job)}, 202)
            return

        try:
            model_path = Path(_find_models()[0])
        except IndexError:
            self._send_json({"error": "h3_model_missing"}, 409)
            return
        try:
            OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
        except OSError as exc:
            self._send_json({"error": f"output_directory_unavailable: {exc}"}, 500)
            return

        with _lock:
            if _active_job_id is not None or _active_workflow_id is not None:
                self._send_json({"error": "job_already_running"}, 409)
                return
            job_id = str(uuid.uuid4())
            output_path = output_storage.history_directory(OUTPUT_ROOT, "video") / f"h3-{job_id}.mp4"
            job = {
                "id": job_id, "kind": "video", "status": "queued", "created_at": time.time(),
                "prompt": settings["prompt"], "name": settings["name"], "logs": deque(maxlen=100), "error": "",
                "video_path": None, "audio_path": None, "response": None,
                "cancel_requested": False,
            }
            _jobs[job_id] = job
            _active_job_id = job_id
            threading.Thread(
                target=_run_job,
                args=(job_id, settings, model_path, output_path),
                name=f"h3-generation-{job_id[:8]}",
                daemon=True,
            ).start()
            self._send_json({"job": _public_job(job)}, 202)

    def log_message(self, format: str, *args) -> None:
        print(f"[web] {self.address_string()} {format % args}")


def main() -> None:
    global OUTPUT_ROOT, _h3_reload_required
    settings = _settings_snapshot()
    OUTPUT_ROOT = Path(settings["output_directory"]).expanduser().resolve()
    output_storage.organize_legacy_outputs(OUTPUT_ROOT)
    for directory in (*output_storage.HISTORY_DIRECTORIES, "long-video"):
        (OUTPUT_ROOT / directory).mkdir(mode=0o700, parents=True, exist_ok=True)
    _h3_reload_required = Path(settings["video"]["model_path"]).expanduser().resolve() != DEFAULT_MODEL_PATH.resolve()
    server = ThreadingHTTPServer(("127.0.0.1", 8765), WebHandler)
    print("MiniMax-H3 Studio: http://127.0.0.1:8765")
    print(f"Models directory: {MODELS_ROOT}")
    print(f"MLX-Serve API: {_settings_snapshot()['video']['service_url']}")

    def handle_shutdown(signum: int, frame: object) -> None:
        threading.Thread(target=server.shutdown, name="web-server-shutdown", daemon=True).start()

    signal.signal(signal.SIGTERM, handle_shutdown)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping MiniMax-H3 Studio.")
    finally:
        server.server_close()
        model_downloads.shutdown()
        with _lock:
            process = _mlx_server_process
        if process is not None and process.poll() is None:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait()


if __name__ == "__main__":
    main()
