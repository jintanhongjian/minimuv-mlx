"""Private, bounded WAV sources shared by music-driven MV drafts."""

from __future__ import annotations

import hashlib
import json
import math
import os
import struct
import tempfile
import time
import uuid
from pathlib import Path
from typing import BinaryIO

from . import mv_projects

MAX_UPLOAD_BYTES = 512 * 1024 * 1024
MAX_DURATION = 720
MAX_TRACKS = 100
MAX_STORAGE_BYTES = 10 * 1024 * 1024 * 1024
_FIELDS = {"version", "kind", "id", "name", "bytes", "duration", "sample_rate",
           "channels", "sha256", "created_at"}


def _directory(root: Path) -> Path:
    directory = root / "music"
    if directory.is_symlink() or (directory.exists() and not directory.is_dir()):
        raise RuntimeError("mv_music_storage_invalid")
    return directory


def inspect_wav(path: Path) -> dict:
    size = path.stat().st_size
    with path.open("rb") as stream:
        header = stream.read(12)
        if (len(header) != 12 or header[:4] != b"RIFF" or header[8:] != b"WAVE"
                or struct.unpack("<I", header[4:8])[0] + 8 != size):
            raise ValueError("invalid_mv_wav")
        position, chunks = 12, 0
        format_data, format_length, data_size = None, 0, None
        while position < size:
            stream.seek(position)
            chunk = stream.read(8)
            if len(chunk) != 8:
                raise ValueError("invalid_mv_wav")
            length = struct.unpack("<I", chunk[4:])[0]
            end = position + 8 + length
            # Some WAV writers omit padding only on the final chunk.
            if end < size:
                end += length % 2
            chunks += 1
            if end > size or chunks > 65536:
                raise ValueError("invalid_mv_wav")
            if chunk[:4] == b"fmt ":
                if format_data is not None or not 16 <= length <= 65536:
                    raise ValueError("invalid_mv_wav")
                format_data = stream.read(min(length, 40))
                format_length = length
            elif chunk[:4] == b"data":
                if data_size is not None:
                    raise ValueError("invalid_mv_wav")
                data_size = length
            position = end
        if format_data is None or not data_size:
            raise ValueError("invalid_mv_wav")
        codec, channels, sample_rate, byte_rate, block_align, bits = struct.unpack(
            "<HHIIHH", format_data[:16]
        )
        if codec == 0xFFFE:
            if (len(format_data) < 40 or struct.unpack("<H", format_data[16:18])[0] < 22
                    or struct.unpack("<H", format_data[16:18])[0] > format_length - 18
                    or not 0 < struct.unpack("<H", format_data[18:20])[0] <= bits
                    or format_data[28:40] != b"\0\0\x10\0\x80\0\0\xaa\0\x38\x9b\x71"):
                raise ValueError("invalid_mv_wav")
            codec = struct.unpack("<I", format_data[24:28])[0]
        if (channels not in (1, 2) or not 8000 <= sample_rate <= 192000
                or not ((codec == 1 and bits in (8, 16, 24, 32))
                        or (codec == 3 and bits in (32, 64)))
                or block_align != channels * (bits // 8)
                or byte_rate != sample_rate * block_align
                or data_size % block_align):
            raise ValueError("invalid_mv_wav")
        duration = data_size / byte_rate
        if not 0 < duration <= MAX_DURATION:
            raise ValueError("mv_wav_limit")
        return {"duration": duration, "channels": channels, "sample_rate": sample_rate}


def _read(path: Path) -> dict:
    try:
        if path.is_symlink() or not path.is_file() or path.stat().st_size > 4096:
            raise ValueError("invalid_manifest")
        data = json.loads(path.read_text(encoding="utf-8"))
        if (not isinstance(data, dict) or set(data) != _FIELDS
                or data["version"] != 1 or data["kind"] != "mv-music"
                or str(uuid.UUID(data["id"])) != path.stem
                or not isinstance(data["name"], str) or not 1 <= len(data["name"]) <= 160
                or type(data["bytes"]) is not int or not 0 < data["bytes"] <= MAX_UPLOAD_BYTES
                or type(data["duration"]) not in (int, float) or not 0 < data["duration"] <= MAX_DURATION
                or type(data["channels"]) is not int or data["channels"] not in (1, 2)
                or type(data["sample_rate"]) is not int or not 8000 <= data["sample_rate"] <= 192000
                or type(data["created_at"]) not in (int, float)
                or not math.isfinite(data["created_at"]) or data["created_at"] <= 0
                or not isinstance(data["sha256"], str) or len(data["sha256"]) != 64
                or any(char not in "0123456789abcdef" for char in data["sha256"])):
            raise ValueError("invalid_manifest")
        audio = path.with_suffix(".wav")
        if audio.is_symlink() or not audio.is_file() or audio.stat().st_size != data["bytes"]:
            raise ValueError("missing_audio")
    except (ValueError, TypeError, KeyError, AttributeError) as exc:
        raise RuntimeError("mv_music_storage_invalid") from exc
    return {**data, "audio_url": f"/api/mv-music/{data['id']}/audio"}


def _list(directory: Path) -> list[dict]:
    if not directory.exists():
        return []
    paths = list(directory.glob("*.json"))
    if len(paths) > MAX_TRACKS:
        raise RuntimeError("mv_music_storage_invalid")
    return sorted((_read(path) for path in paths), key=lambda item: item["created_at"], reverse=True)


def list_music(output_root: Path) -> list[dict]:
    with mv_projects.storage_directory(output_root) as root:
        return _list(_directory(root))


def resolve(output_root: Path, music_id: str) -> dict | None:
    if str(uuid.UUID(music_id)) != music_id:
        raise ValueError("invalid_mv_music_id")
    with mv_projects.storage_directory(output_root) as root:
        path = _directory(root) / f"{music_id}.json"
        if not path.exists() and not path.is_symlink():
            return None
        item = _read(path)
        return {**item, "path": str(path.with_suffix(".wav"))}


def save_upload(output_root: Path, stream: BinaryIO, length: int, name: str) -> dict:
    if type(length) is not int or not 0 < length <= MAX_UPLOAD_BYTES:
        raise ValueError("mv_wav_limit")
    if (not isinstance(name, str) or not 1 <= len(name) <= 160 or not name.lower().endswith(".wav")
            or "/" in name or "\\" in name or any(ord(char) < 32 for char in name)):
        raise ValueError("invalid_mv_wav")
    with mv_projects.storage_directory(output_root) as root:
        directory = _directory(root)
        items = _list(directory)
        if len(items) >= MAX_TRACKS or sum(item["bytes"] for item in items) + length > MAX_STORAGE_BYTES:
            raise ValueError("mv_music_storage_full")
        directory.mkdir(parents=True, exist_ok=True, mode=0o700)
        os.chmod(directory, 0o700)
        temporary, metadata_temporary, published = None, None, None
        try:
            digest = hashlib.sha256()
            with tempfile.NamedTemporaryFile(dir=directory, suffix=".part", delete=False) as file:
                temporary = Path(file.name)
                remaining = length
                while remaining:
                    block = stream.read(min(1024 * 1024, remaining))
                    if not block or len(block) > remaining:
                        raise ValueError("invalid_mv_wav")
                    file.write(block)
                    digest.update(block)
                    remaining -= len(block)
                file.flush()
                os.fsync(file.fileno())
            details = inspect_wav(temporary)
            music_id = str(uuid.uuid4())
            data = {"version": 1, "kind": "mv-music", "id": music_id, "name": name,
                    "bytes": length, "created_at": time.time(), "sha256": digest.hexdigest(), **details}
            path = directory / f"{music_id}.wav"
            os.link(temporary, path)
            published = path
            with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=directory,
                                             suffix=".part", delete=False) as file:
                metadata_temporary = Path(file.name)
                json.dump(data, file, ensure_ascii=False, allow_nan=False)
                file.flush()
                os.fsync(file.fileno())
            os.link(metadata_temporary, path.with_suffix(".json"))
            published = None
            return {**data, "audio_url": f"/api/mv-music/{music_id}/audio"}
        finally:
            if temporary is not None:
                temporary.unlink(missing_ok=True)
            if metadata_temporary is not None:
                metadata_temporary.unlink(missing_ok=True)
            if published is not None:
                published.unlink()
