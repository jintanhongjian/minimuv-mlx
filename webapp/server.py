"""Serve a localhost UI backed by MLX-Serve's MiniMax-H3 video endpoint."""

from __future__ import annotations

import base64
import binascii
import json
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
from urllib.request import Request, urlopen

STATIC_ROOT = Path(__file__).resolve().parent / "static"
SETTINGS_PATH = Path(__file__).resolve().parents[1] / "settings.json"
MODELS_ROOT = Path.home() / ".omlx" / "models"
PIPENETWORK_ROOT = MODELS_ROOT / "pipenetwork"
DEFAULT_MODEL_PATH = PIPENETWORK_ROOT / "MiniMax-H3-FL2VA-MLX-Serve-4bit"
HIDREAM_MODEL_PATH = MODELS_ROOT / "mlx-community" / "HiDream-O1-Image-Dev-mlx-q6"
HIDREAM_CODE_ROOT = PIPENETWORK_ROOT / "hidream-o1-mlx-code"
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
DEFAULT_TEXT_API_BASE_URL = os.environ.get("OMLX_BASE_URL", "http://127.0.0.1:8000").rstrip("/")
DEFAULT_VIDEO_API_BASE_URL = os.environ.get("MLX_SERVE_URL", "http://127.0.0.1:11234").rstrip("/")
ASPECTS = {"16:9": (16, 9), "9:16": (9, 16), "1:1": (1, 1), "4:3": (4, 3), "3:4": (3, 4)}
MAX_REQUEST_BYTES = 64 * 1024

_DEFAULT_SETTINGS = {
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
_lock = threading.Lock()
_jobs: dict[str, dict] = {}
_active_job_id: str | None = None
_mlx_server_process: subprocess.Popen | None = None
_server_logs: deque[str] = deque(maxlen=30)


class GenerationCancelled(Exception):
    """Raised when the user cancels an active generation."""


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
    if not isinstance(payload, dict) or set(payload) != {"video", "image", "music", "text"}:
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
        "model_ids": list(dict.fromkeys(item.strip() for item in model_ids)),
        "api_params": text_params,
    }
    return normalized


def _save_app_settings(payload: object) -> dict:
    validated = _validate_app_settings(payload)
    serialized = json.dumps(validated, ensure_ascii=False, indent=2) + "\n"
    with _settings_lock:
        try:
            SETTINGS_PATH.parent.mkdir(parents=True, exist_ok=True)
            fd, temporary_path = tempfile.mkstemp(prefix=".settings-", suffix=".json", dir=SETTINGS_PATH.parent)
            try:
                os.fchmod(fd, 0o600)
                with os.fdopen(fd, "w", encoding="utf-8") as settings_file:
                    settings_file.write(serialized)
                    settings_file.flush()
                    os.fsync(settings_file.fileno())
                os.replace(temporary_path, SETTINGS_PATH)
            except Exception:
                Path(temporary_path).unlink(missing_ok=True)
                raise
        except OSError as exc:
            raise RuntimeError(f"Could not save settings.json: {exc}") from exc
    return validated


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
        "model_loaded": any(_is_h3_video_model(model) and model.get("state", "ready") == "ready"
                            for model in loaded_models),
        "server_models": [
            {"id": model.get("id", ""), "state": model.get("state", "")}
            for model in loaded_models if _is_h3_video_model(model)
        ],
        "model_download_url": MODEL_URL,
        "runtime_download_url": RUNTIME_URL,
        "transformer_download_url": TRANSFORMER_URL,
        "hidream": _hidream_status(),
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
        HIDREAM_CODE_ROOT / "scripts" / "hidream_o1" / "postprocess.py",
    )
    runtime_ready = all(path.is_file() for path in runtime_files) and (
        HIDREAM_PYTHON.is_file() and os.access(HIDREAM_PYTHON, os.X_OK)
    )
    model_ready = model_path.is_dir() and all(
        (model_path / name).is_file() for name in required_model_files
    )
    runtime_ready = HIDREAM_SCRIPT.is_file() and HIDREAM_PYTHON.is_file() and os.access(HIDREAM_PYTHON, os.X_OK)
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


def _local_text_models() -> list[dict]:
    settings = _settings_snapshot()["text"]
    base_url = settings["service_url"]
    if not _valid_local_text_api_url():
        raise RuntimeError("OMLX_BASE_URL must use local http://127.0.0.1, localhost, or ::1.")
    request = Request(
        f"{base_url}/v1/models",
        headers={"Accept": "application/json"},
    )
    try:
        with urlopen(request, timeout=3) as response:
            payload = json.loads(response.read())
    except HTTPError as exc:
        raise RuntimeError(f"Local OMLX model list returned HTTP {exc.code}.") from exc
    except (URLError, TimeoutError, OSError) as exc:
        raise RuntimeError(f"Cannot reach the local OMLX text-model API at {base_url}.") from exc
    except json.JSONDecodeError as exc:
        raise RuntimeError("Local OMLX model list returned invalid JSON.") from exc
    if not isinstance(payload, dict) or not isinstance(payload.get("data"), list):
        raise RuntimeError("Local OMLX model list has an unexpected response format.")
    models = []
    for item in payload["data"]:
        if not isinstance(item, dict):
            continue
        model_id = item.get("id")
        if isinstance(model_id, str) and model_id.strip() and _is_prompt_text_model(model_id):
            models.append({"id": model_id, "name": model_id})
    for model_id in settings["model_ids"]:
        if _is_prompt_text_model(model_id) and not any(item["id"] == model_id for item in models):
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


def _enhancement_instructions(mode: str) -> str:
    instructions = {
        "video": (
            "Optimize a text prompt for local text-to-video generation. Extract concrete keywords "
            "for subject, setting, action and temporal progression, composition, camera motion, "
            "lighting, color, and relevant sound when present in the source. Preserve the original "
            "intent and constraints; do not invent facts or add unwanted text overlays."
        ),
        "image": (
            "Optimize a text prompt for local text-to-image generation. Extract concrete keywords "
            "for subject, setting, composition, perspective, lighting, palette, visual style, and "
            "materials. Preserve the original intent and constraints; do not invent facts, motion, "
            "or text overlays unless requested."
        ),
        "music": (
            "Optimize a text prompt for local music generation. Extract concrete keywords for genre, "
            "mood, tempo, instruments, vocal character, arrangement, dynamics, and production where "
            "the source provides them. Preserve the original intent and constraints; do not invent "
            "lyrics or add vocals when the source requests instrumental music."
        ),
    }
    return instructions[mode]


def _enhance_prompt_with_local_model(settings: dict) -> dict:
    text_settings = _settings_snapshot()["text"]
    available_models = _local_text_models()
    if not any(model["id"] == settings["model"] for model in available_models):
        raise ValueError("text_model_unavailable")

    system_prompt = (
        "You are a faithful prompt editor. Extract 3 to 8 concise keywords directly supported by "
        "the source, then rewrite it clearly for the requested generator. Every detail in the rewrite "
        "must be traceable to the source: preserve its facts, intent, and constraints, and do not "
        "invent colors, objects, people, styles, camera choices, sounds, lyrics, or technical tags. "
        "Do not add generic claims such as 8k, cinematic, or photorealistic unless requested. "
        "If the source is brief, keep the rewrite brief rather than filling gaps. Return only a JSON "
        "object with exactly two fields: "
        '{"keywords":["..."],"optimized_prompt":"..."}. '
        "Write both fields in the same language as the source prompt. Do not explain your changes "
        "and do not use Markdown. "
        f"{_enhancement_instructions(settings['mode'])}"
    )
    body = json.dumps({
        "model": settings["model"],
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": settings["prompt"]},
        ],
        **text_settings["api_params"],
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
        with urlopen(request, timeout=240) as response:
            result = json.loads(response.read())
    except HTTPError as exc:
        raise RuntimeError(f"Local text-model request returned HTTP {exc.code}.") from exc
    except (URLError, TimeoutError, OSError) as exc:
        raise RuntimeError("Could not complete the local text-model request.") from exc
    except json.JSONDecodeError as exc:
        raise RuntimeError("Local text model returned invalid JSON.") from exc

    try:
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
    except (KeyError, IndexError, TypeError, ValueError, json.JSONDecodeError) as exc:
        raise RuntimeError("Local text model returned an invalid prompt-enhancement response.") from exc
    return {
        "keywords": [keyword.strip() for keyword in keywords[:30]],
        "optimized_prompt": optimized_prompt.strip(),
    }


def _is_h3_video_model(model: dict) -> bool:
    identifier = str(model.get("id", "")).lower()
    capabilities = model.get("capabilities", [])
    return "minimax-h3" in identifier or (
        isinstance(capabilities, list)
        and "video" in capabilities
        and ("minimax" in identifier or "h3" in identifier)
    )


def _validate_generation(payload: dict) -> dict:
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
        steps = int(payload.get("steps", 4))
    except (TypeError, ValueError) as exc:
        raise ValueError("invalid_steps") from exc
    if not 2 <= steps <= 50:
        raise ValueError("invalid_steps")
    turbo = payload.get("turbo", True)
    if not isinstance(turbo, bool) or (turbo and steps > 8) or (not turbo and steps < 16):
        raise ValueError("invalid_steps")

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
    return {
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


def _validate_hidream_generation(payload: dict) -> dict:
    prompt = payload.get("prompt")
    if not isinstance(prompt, str) or not prompt.strip() or len(prompt) > 4000:
        raise ValueError("invalid_prompt")
    try:
        seed = int(payload.get("seed", 42))
    except (TypeError, ValueError) as exc:
        raise ValueError("invalid_seed") from exc
    if not 0 <= seed <= 2**32 - 1:
        raise ValueError("invalid_seed")
    return {"prompt": prompt.strip(), "seed": seed, "width": 2048, "height": 2048}


def _validate_music_generation(payload: dict) -> dict:
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
    if not 5 <= duration <= 120:
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
    return {
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


def _public_job(job: dict) -> dict:
    return {
        "id": job["id"],
        "kind": job.get("kind", "video"),
        "status": job["status"],
        "created_at": job["created_at"],
        "prompt": job["prompt"],
        "logs": list(job["logs"]),
        "error": job.get("error", ""),
        "video_url": f"/api/jobs/{job['id']}/video" if job.get("video_path") else "",
        "audio_url": f"/api/jobs/{job['id']}/audio" if job.get("audio_path") else "",
        "image_url": f"/api/jobs/{job['id']}/image" if job.get("image_path") else "",
    }


def _persist_history(job: dict, media_paths: list[Path]) -> None:
    job_id = str(uuid.UUID(job["id"]))
    record = {
        "id": job_id,
        "kind": job["kind"],
        "created_at": job["created_at"],
        "prompt": job["prompt"],
    }
    serialized = json.dumps(record, ensure_ascii=False, allow_nan=False) + "\n"
    try:
        OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
        if not media_paths or any(not path.is_file() for path in media_paths):
            raise RuntimeError("completed_media_missing")
        fd, temporary_path = tempfile.mkstemp(
            prefix=".history-", suffix=".json", dir=OUTPUT_ROOT
        )
        try:
            os.fchmod(fd, 0o600)
            with os.fdopen(fd, "w", encoding="utf-8") as history_file:
                history_file.write(serialized)
                history_file.flush()
                os.fsync(history_file.fileno())
            os.replace(temporary_path, OUTPUT_ROOT / f"{job_id}.json")
        except Exception:
            Path(temporary_path).unlink(missing_ok=True)
            raise
    except OSError as exc:
        raise RuntimeError(f"Could not save generation history: {exc}") from exc


def _history_items() -> list[dict]:
    if not OUTPUT_ROOT.exists():
        return []
    grouped: dict[str, dict] = {}
    patterns = (
        (re.compile(r"^h3-([0-9a-f-]{36})\.mp4$"), "video", "video_path"),
        (re.compile(r"^h3-([0-9a-f-]{36})\.wav$"), "video", "video_audio_path"),
        (re.compile(r"^hidream-([0-9a-f-]{36})\.png$"), "image", "image_path"),
        (re.compile(r"^music3-([0-9a-f-]{36})\.wav$"), "music", "music_audio_path"),
    )
    try:
        for path in OUTPUT_ROOT.iterdir():
            if not path.is_file():
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
                    "id": item_id, "kind": kind, "prompt": "", "created_at": path.stat().st_mtime,
                    "video_url": "", "audio_url": "", "image_url": "",
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
            metadata_path = OUTPUT_ROOT / f"{item_id}.json"
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
            entry["created_at"] = metadata["created_at"]
    except OSError as exc:
        raise RuntimeError(f"Could not read generation history: {exc}") from exc
    return sorted(grouped.values(), key=lambda item: item["created_at"], reverse=True)


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
    }
    if media_kind == "audio":
        kind = next((item["kind"] for item in _history_items() if item["id"] == item_id), None)
        if kind == "video":
            filename = f"h3-{item_id}.wav"
        elif kind == "music":
            filename = f"music3-{item_id}.wav"
        else:
            return None, ""
        path, content_type = OUTPUT_ROOT / filename, "audio/wav"
    elif media_kind in files:
        filename, content_type = files[media_kind]
        path = OUTPUT_ROOT / filename
    else:
        return None, ""
    return (path, content_type) if path.is_file() else (None, "")


def _append_log(job_id: str, line: str) -> None:
    with _lock:
        job = _jobs.get(job_id)
        if job is not None:
            job["logs"].append(line.rstrip())


def _check_cancelled(job_id: str) -> None:
    with _lock:
        job = _jobs[job_id]
        if job["cancel_requested"]:
            raise GenerationCancelled("Generation cancelled.")


def _read_server_output(process: subprocess.Popen) -> None:
    if process.stdout is None:
        return
    for line in process.stdout:
        with _lock:
            _server_logs.append(line.rstrip())


def _start_mlx_server(job_id: str, model_path: Path) -> None:
    global _mlx_server_process
    executable = _local_mlx_serve()
    if executable is None:
        raise RuntimeError(
            f"MLX-Serve is not installed. Install the Apple Silicon runtime from {RUNTIME_URL}."
        )
    with _lock:
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
    preferred_id = _settings_snapshot()["video"]["model_id"]
    _start_mlx_server(job_id, model_path)
    _check_cancelled(job_id)
    models = _service_models()
    current = _find_h3_model_id(models, preferred_id)
    if current:
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
    global _active_job_id
    try:
        with _lock:
            _jobs[job_id]["status"] = "loading"
        model_id = _load_h3_model(job_id, model_path)
        _check_cancelled(job_id)
        with _lock:
            _jobs[job_id]["status"] = "running"
        video_path, audio_path = _generate(job_id, model_id, settings, output_path)
        with _lock:
            job = _jobs[job_id]
        _persist_history(job, [video_path, *([audio_path] if audio_path is not None else [])])
    except GenerationCancelled:
        output_path.unlink(missing_ok=True)
        output_path.with_suffix(".wav").unlink(missing_ok=True)
        with _lock:
            _jobs[job_id]["status"] = "cancelled"
    except Exception as exc:
        output_path.unlink(missing_ok=True)
        output_path.with_suffix(".wav").unlink(missing_ok=True)
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
            _active_job_id = None


def _run_hidream_job(job_id: str, settings: dict, output_path: Path) -> None:
    global _active_job_id
    process: subprocess.Popen | None = None
    try:
        model_path = Path(settings.get("model_path", _settings_snapshot()["image"]["model_path"])).expanduser()
        status = _hidream_status(model_path)
        if not status["model_ready"]:
            raise RuntimeError("hidream_model_missing")
        if not status["runtime_ready"]:
            raise RuntimeError("hidream_runtime_missing")
        OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
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
                job["process"] = process
        if cancelled:
            process.terminate()
            raise GenerationCancelled("Generation cancelled.")
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
        _persist_history(job, [output_path])
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
            _active_job_id = None


def _run_music_job(job_id: str, settings: dict, output_path: Path) -> None:
    global _active_job_id
    process: subprocess.Popen | None = None
    lyrics_path: Path | None = None
    try:
        model_path = Path(settings.get("model_path", _settings_snapshot()["music"]["model_path"])).expanduser()
        status = _music_status(model_path)
        if not status["model_ready"]:
            raise RuntimeError("music_model_missing")
        if not status["runtime_ready"]:
            raise RuntimeError("music_runtime_missing")
        OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            newline="\n",
            prefix=f"music-lyrics-{job_id}-",
            suffix=".txt",
            dir=OUTPUT_ROOT,
            delete=False,
        ) as lyrics_file:
            lyrics_file.write(settings["lyrics"])
            lyrics_path = Path(lyrics_file.name)

        command = [
            str(MUSIC_PYTHON),
            "-u",
            "-m",
            "mlx_audio.music.generate",
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
            "--verbose",
        ]
        _check_cancelled(job_id)
        _append_log(
            job_id,
            f"Loading MiniMax Music3 8-bit for up to {settings['duration']:g} seconds.",
        )
        process = subprocess.Popen(
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
                job["process"] = process
        if cancelled:
            process.terminate()
            raise GenerationCancelled("Generation cancelled.")
        if process.stdout is not None:
            for line in process.stdout:
                _check_cancelled(job_id)
                _append_log(job_id, line[:1000])
        return_code = process.wait()
        with _lock:
            _jobs[job_id]["process"] = None
        _check_cancelled(job_id)
        if return_code != 0:
            raise RuntimeError(f"MiniMax Music3 inference exited with status {return_code}.")
        if not output_path.is_file() or output_path.stat().st_size < 44:
            raise RuntimeError("MiniMax Music3 inference finished without producing a WAV file.")
        with output_path.open("rb") as audio_file:
            header = audio_file.read(12)
            if header[:4] != b"RIFF" or header[8:] != b"WAVE":
                raise RuntimeError("MiniMax Music3 output is not a valid WAV audio file.")
        with _lock:
            job = _jobs[job_id]
        _persist_history(job, [output_path])
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
        if parsed.path == "/api/settings":
            try:
                settings = _settings_snapshot()
            except (RuntimeError, ValueError) as exc:
                self._send_json({"error": "settings_unavailable", "detail": str(exc)}, 500)
                return
            self._send_json({"settings": settings})
            return
        if parsed.path == "/api/models":
            self._send_json(_scan_models())
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
            r"/api/history/([0-9a-f-]{36})/(video|audio|image)", parsed.path
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
        if parsed.path == "/api/jobs/current":
            with _lock:
                job = _jobs.get(_active_job_id) if _active_job_id else None
                latest = job or (max(_jobs.values(), key=lambda item: item["created_at"]) if _jobs else None)
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
        }
        item = static_files.get(parsed.path)
        if item is None:
            self._send_json({"error": "not_found"}, 404)
            return
        name, content_type = item
        self._send_file(STATIC_ROOT / name, content_type)

    def do_POST(self) -> None:
        global _active_job_id
        if not self._local_request_allowed():
            self._send_json({"error": "localhost_only"}, 403)
            return
        parsed = urlparse(self.path)
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
            if not _service_health() and _local_mlx_serve() is None:
                self._send_json({"error": "mlx_serve_missing"}, 409)
                return
            with _lock:
                if _active_job_id is not None:
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
                        _active_job_id = None

            threading.Thread(target=load_model, name=f"h3-model-load-{job_id[:8]}", daemon=True).start()
            with _lock:
                self._send_json({"job": _public_job(job)}, 202)
            return

        cancel_match = re.fullmatch(r"/api/jobs/([0-9a-f-]+)/cancel", parsed.path)
        if cancel_match:
            with _lock:
                job = _jobs.get(cancel_match.group(1))
                if job is None or job["status"] not in {"queued", "loading", "running"}:
                    self._send_json({"error": "job_not_active"}, 409)
                    return
                job["cancel_requested"] = True
                job["status"] = "cancelling"
                response = job.get("response")
                if response is not None:
                    response.close()
                process = job.get("process")
                if process is not None and process.poll() is None:
                    process.terminate()
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
                settings["model_path"] = _settings_snapshot()["image"]["model_path"]
            elif is_music_request:
                settings = _validate_music_generation(payload)
                settings["model_path"] = _settings_snapshot()["music"]["model_path"]
            else:
                settings = _validate_generation(payload)
                app_settings = _settings_snapshot()["video"]
                settings["api_params"] = app_settings["api_params"]
        except (json.JSONDecodeError, UnicodeDecodeError, ValueError) as exc:
            self._send_json({"error": str(exc) or "invalid_request"}, 400)
            return

        if is_hidream_request:
            status = _hidream_status()
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
                if _active_job_id is not None:
                    self._send_json({"error": "job_already_running"}, 409)
                    return
                job_id = str(uuid.uuid4())
                output_path = OUTPUT_ROOT / f"hidream-{job_id}.png"
                job = {
                    "id": job_id, "kind": "image", "status": "queued",
                    "created_at": time.time(), "prompt": settings["prompt"],
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
            status = _music_status()
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
                if _active_job_id is not None:
                    self._send_json({"error": "job_already_running"}, 409)
                    return
                job_id = str(uuid.uuid4())
                output_path = OUTPUT_ROOT / f"music3-{job_id}.wav"
                job = {
                    "id": job_id, "kind": "music", "status": "queued",
                    "created_at": time.time(), "prompt": settings["prompt"],
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
            if _active_job_id is not None:
                self._send_json({"error": "job_already_running"}, 409)
                return
            job_id = str(uuid.uuid4())
            output_path = OUTPUT_ROOT / f"h3-{job_id}.mp4"
            job = {
                "id": job_id, "kind": "video", "status": "queued", "created_at": time.time(),
                "prompt": settings["prompt"], "logs": deque(maxlen=100), "error": "",
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
