"""Validation and local inference helpers for Fish Audio speech tracks."""

from __future__ import annotations

import os
import tempfile
from pathlib import Path
from typing import BinaryIO

from . import local_models, mv_music

MAX_REFERENCE_BYTES = 100 * 1024 * 1024
MAX_REFERENCE_SECONDS = 60
MAX_TEXT_CHARS = 8000
DEFAULT_SETTINGS = {
    "model": "fish-s2-pro-8bit",
    "speed": 1.0,
    "temperature": 0.7,
    "top_p": 0.7,
    "top_k": 30,
    "max_tokens": 2048,
    "chunk_length": 300,
}
VOICE_DESIGN_MODELS = {"voxcpm2-4bit", "qwen3-tts-voicedesign-8bit"}


def validate_settings(payload: object) -> dict:
    if not isinstance(payload, dict) or set(payload) - set(DEFAULT_SETTINGS):
        raise ValueError("invalid_speech_settings")
    settings = {**DEFAULT_SETTINGS, **payload}
    if (not isinstance(settings["model"], str)
            or settings["model"] not in {"fish-s2-pro-8bit", *VOICE_DESIGN_MODELS}
            or type(settings["speed"]) not in (int, float) or not 0.5 <= settings["speed"] <= 2
            or type(settings["temperature"]) not in (int, float)
            or not 0 <= settings["temperature"] <= 2
            or type(settings["top_p"]) not in (int, float) or not 0 < settings["top_p"] <= 1
            or type(settings["top_k"]) is not int or not 1 <= settings["top_k"] <= 100
            or type(settings["max_tokens"]) is not int or not 1 <= settings["max_tokens"] <= 8192
            or type(settings["chunk_length"]) is not int or not 50 <= settings["chunk_length"] <= 1000):
        raise ValueError("invalid_speech_settings")
    return settings


def validate_text(value: object, *, allow_empty: bool = False) -> str:
    if not isinstance(value, str) or len(value) > MAX_TEXT_CHARS:
        raise ValueError("invalid_speech_text")
    text = value.strip()
    if not allow_empty and not text:
        raise ValueError("invalid_speech_text")
    return text


def store_reference(directory: Path, stream: BinaryIO, length: int) -> Path:
    if type(length) is not int or not 0 < length <= MAX_REFERENCE_BYTES:
        raise ValueError("speech_reference_limit")
    if directory.is_symlink() or (directory.exists() and not directory.is_dir()):
        raise RuntimeError("speech_storage_invalid")
    directory.mkdir(parents=True, exist_ok=True, mode=0o700)
    os.chmod(directory, 0o700)
    temporary = None
    target = directory / "voice-reference.wav"
    try:
        with tempfile.NamedTemporaryFile(dir=directory, suffix=".part", delete=False) as output:
            temporary = Path(output.name)
            remaining = length
            while remaining:
                block = stream.read(min(1024 * 1024, remaining))
                if not block or len(block) > remaining:
                    raise ValueError("invalid_speech_reference")
                output.write(block)
                remaining -= len(block)
            output.flush()
            os.fsync(output.fileno())
        if mv_music.inspect_wav(temporary)["duration"] > MAX_REFERENCE_SECONDS:
            raise ValueError("speech_reference_limit")
        if target.is_symlink():
            raise RuntimeError("speech_storage_invalid")
        os.chmod(temporary, 0o600)
        os.replace(temporary, target)
        return target
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


def command(settings: dict, model_path: Path, reference_path: Path, reference_text: str,
            text_path: Path, output_path: Path) -> list[str]:
    runtime = local_models.runtime_root("fish-s2-pro-8bit")
    return [
        str(runtime / ".venv" / "bin" / "python"), "-u",
        str(local_models.PROJECT_ROOT / "scripts" / "fishaudio_generate.py"),
        "--model", str(model_path), "--text-file", str(text_path),
        "--reference-audio", str(reference_path), "--reference-text", reference_text,
        "--speed", str(settings["speed"]), "--temperature", str(settings["temperature"]),
        "--top-p", str(settings["top_p"]), "--top-k", str(settings["top_k"]),
        "--max-tokens", str(settings["max_tokens"]),
        "--chunk-length", str(settings["chunk_length"]), "--output", str(output_path),
    ]


def voice_design_command(model: str, settings: dict, model_path: Path, voice_description: str,
                         text_path: Path, output_path: Path) -> list[str]:
    if model not in VOICE_DESIGN_MODELS:
        raise ValueError("invalid_speech_model")
    runtime = local_models.runtime_root(model)
    return [
        str(runtime / ".venv" / "bin" / "python"), "-u",
        str(local_models.PROJECT_ROOT / "scripts" / "podcast_voice_design.py"),
        "--model-id", model, "--model", str(model_path),
        "--text-file", str(text_path), "--voice-description", voice_description,
        *(["--temperature", str(settings["temperature"])] if model == "qwen3-tts-voicedesign-8bit" else []),
        "--output", str(output_path),
    ]
