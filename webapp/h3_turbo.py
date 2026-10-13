"""Verified v4 Turbo adapter and a non-destructive MLX-Serve model-pack view."""

from __future__ import annotations

import hashlib
import os
import threading
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "third_party/h3_turbo/.models"
ADAPTER = Path.home() / ".omlx/models/pipenetwork/MiniMax-H3-Turbo-Lora/minimax_h3_turbo_v4_step600_ema.safetensors"
SHA256 = "5f3a626cd72c93a8b9318d6760c510bc5092d2ab13aaba1f932c5bab07a416d3"
SIZE = 779849816
FILES = (
    "config.json", "transformer.safetensors", "text_encoder.safetensors",
    "video_vae.safetensors", "audio_vae.safetensors", "tokenizer.json",
)
_lock = threading.Lock()


@lru_cache(maxsize=8)
def _verified(path: str, size: int, mtime: int, ctime: int) -> bool:
    if size != SIZE:
        return False
    with open(path, "rb") as source:
        return hashlib.file_digest(source, "sha256").hexdigest() == SHA256


def status(adapter: Path = ADAPTER) -> dict:
    error = ""
    try:
        stat = adapter.stat()
        if not adapter.is_file() or not _verified(
            str(adapter), stat.st_size, stat.st_mtime_ns, stat.st_ctime_ns,
        ):
            raise ValueError("H3 Turbo v4-600 EMA adapter size or SHA256 mismatch.")
    except (OSError, ValueError) as exc:
        error = str(exc)
    return {
        "version": "v4-600 EMA", "model_path": str(adapter),
        "model_ready": not error, "model_error": error,
        "sha256": SHA256, "steps": {"min": 4, "max": 8},
        "model_download_url": "https://huggingface.co/larryvrh/MiniMax-H3-Turbo-Lora",
    }


def prepare(base: Path, adapter: Path = ADAPTER, root: Path = ROOT) -> Path:
    info = status(adapter)
    if not info["model_ready"]:
        raise RuntimeError(f"H3 Turbo v4 unavailable: {info['model_error']}")
    base = base.expanduser().resolve(strict=True)
    adapter = adapter.resolve(strict=True)
    if not base.is_dir() or any(not (base / name).is_file() for name in FILES):
        raise RuntimeError("H3 base pack is missing required model files.")
    fingerprint = hashlib.sha256(f"{base}\n{adapter}\n{SHA256}".encode()).hexdigest()[:16]
    view = root / f"MiniMax-H3-Turbo-v4-{fingerprint}"
    with _lock:
        root.mkdir(parents=True, exist_ok=True)
        if view.is_symlink():
            raise RuntimeError(f"H3 Turbo runtime view must not be a directory symlink: {view}")
        view.mkdir(exist_ok=True)
        sources = {item.name: item for item in base.iterdir()
                   if item.is_file() and item.name != "turbo_lora.safetensors"}
        sources["turbo_lora.safetensors"] = adapter
        for name, source in sources.items():
            target = view / name
            if os.path.lexists(target):
                if not target.is_symlink() or target.resolve() != source.resolve():
                    raise RuntimeError(f"H3 Turbo runtime view conflict: {target}")
            else:
                target.symlink_to(source)
        unexpected = set(item.name for item in view.iterdir()) - set(sources)
        if unexpected:
            raise RuntimeError(f"H3 Turbo runtime view has unexpected files: {sorted(unexpected)}")
    return view
