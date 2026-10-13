"""Persist music-driven video drafts without launching generation."""

from __future__ import annotations

import hashlib
import json
import os
import tempfile
import threading
import time
import uuid
from contextlib import contextmanager
from pathlib import Path
from collections.abc import Callable, Iterator

from .workflows import ASPECTS

_LOCK = threading.RLock()
MAX_PROJECTS = 100
MAX_BYTES = 64 * 1024


def _root(output_root: Path) -> Path:
    directory = output_root / "mv"
    if directory.is_symlink() or (directory.exists() and not directory.is_dir()):
        raise RuntimeError("mv_storage_invalid")
    music = directory / "music"
    if music.is_symlink() or (music.exists() and not music.is_dir()):
        raise RuntimeError("mv_storage_invalid")
    legacy = output_root / "mv-projects"
    if legacy.is_symlink() or (legacy.exists() and not legacy.is_dir()):
        raise RuntimeError("mv_storage_invalid")
    if legacy.exists():
        paths = sorted(legacy.iterdir())
        existing = [path for path in directory.iterdir() if path.name != "music"] if directory.exists() else []
        if len(paths) + len(existing) > MAX_PROJECTS:
            raise RuntimeError("mv_storage_invalid")
        for path in existing:
            if path.suffix != ".json":
                raise RuntimeError("mv_storage_invalid")
            _read(path)
        for path in paths:
            if path.suffix != ".json":
                raise RuntimeError("mv_storage_invalid")
            _read(path)
            target = directory / path.name
            if target.exists() or target.is_symlink():
                raise RuntimeError("mv_storage_conflict")
        if not directory.exists():
            legacy.rename(directory)
        else:
            moved = []
            try:
                for path in paths:
                    target = directory / path.name
                    os.link(path, target)
                    try:
                        path.unlink()
                    except OSError:
                        target.unlink()
                        raise
                    moved.append((path, target))
                legacy.rmdir()
            except OSError:
                for source, target in reversed(moved):
                    os.link(target, source)
                    target.unlink()
                raise
    return directory


@contextmanager
def storage_directory(output_root: Path) -> Iterator[Path]:
    with _LOCK:
        yield _root(output_root)


def _id(value: object) -> str:
    if not isinstance(value, str):
        raise ValueError("invalid_mv_id")
    try:
        canonical = str(uuid.UUID(value))
    except ValueError as exc:
        raise ValueError("invalid_mv_id") from exc
    if canonical != value:
        raise ValueError("invalid_mv_id")
    return canonical


def _path(output_root: Path, project_id: object) -> Path:
    return _root(output_root) / f"{_id(project_id)}.json"


def _revision(data: dict) -> str:
    encoded = json.dumps(data, sort_keys=True, ensure_ascii=False, allow_nan=False).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def _read(path: Path) -> dict:
    if path.is_symlink() or not path.is_file() or path.stat().st_size > MAX_BYTES:
        raise RuntimeError("mv_storage_invalid")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        if (
            not isinstance(data, dict) or data.get("version") != 1
            or set(data) - {"visual_references", "negative_prompt"} != {"version", "kind", "id", "status", "name", "prompt",
                             "aspect", "music_source_id", "created_at", "updated_at"}
            or data.get("kind") != "mv" or data.get("status") != "draft"
            or _id(data.get("id")) != path.stem
            or _id(data.get("music_source_id")) != data["music_source_id"]
            or not isinstance(data.get("name"), str) or not 1 <= len(data["name"]) <= 120
            or not isinstance(data.get("prompt"), str) or len(data["prompt"]) > 4000
            or data.get("aspect") not in ASPECTS
            or any(type(data.get(key)) not in (int, float) or
                   not 0 < data[key] < float("inf") for key in ("created_at", "updated_at"))
        ):
            raise ValueError("invalid_mv_manifest")
        if "visual_references" in data:
            from . import visual_references
            visual_references.library(data["visual_references"])
        if "negative_prompt" in data:
            from . import generation_limits
            generation_limits.validate_negative_prompt(data["negative_prompt"])
    except (ValueError, TypeError, UnicodeDecodeError) as exc:
        raise RuntimeError("mv_storage_invalid") from exc
    return {**data, "revision": _revision(data)}


def list_projects(output_root: Path) -> list[dict]:
    with _LOCK:
        directory = _root(output_root)
        if not directory.exists():
            return []
        paths = list(directory.glob("*.json"))
        if len(paths) > MAX_PROJECTS:
            raise RuntimeError("mv_storage_full")
        return sorted((_read(path) for path in paths),
                      key=lambda item: item["updated_at"], reverse=True)


def delete_project(output_root: Path, project_id: str, revision: object) -> str:
    with _LOCK:
        path = _path(output_root, project_id)
        if not path.exists() and not path.is_symlink():
            raise ValueError("mv_not_found")
        current = _read(path)
        if revision != current["revision"]:
            raise ValueError("mv_conflict")
        path.unlink()
        return current["id"]


def save_project(
    output_root: Path, payload: object, resolver: Callable[[str], dict | None],
    project_id: str | None = None,
) -> dict:
    if not isinstance(payload, dict):
        raise ValueError("invalid_request")
    allowed = {"name", "prompt", "aspect", "music_source_id", "revision", "visual_references", "negative_prompt"}
    if set(payload) - allowed:
        raise ValueError("invalid_mv_fields")
    name = payload.get("name")
    prompt = payload.get("prompt", "")
    aspect = payload.get("aspect", "16:9")
    if not isinstance(name, str) or not 1 <= len(name.strip()) <= 120:
        raise ValueError("invalid_mv_name")
    if not isinstance(prompt, str) or len(prompt) > 4000:
        raise ValueError("invalid_prompt")
    if not isinstance(aspect, str) or aspect not in ASPECTS:
        raise ValueError("invalid_aspect")
    music_id = _id(payload.get("music_source_id"))
    from . import visual_references
    references = visual_references.library(payload.get("visual_references"))
    from . import generation_limits
    negative = generation_limits.validate_negative_prompt(payload.get("negative_prompt", ""))
    for row in references["characters"] + references["scenes"]:
        if row["image_id"]:
            from .workflows import read_reference_images
            read_reference_images(output_root, row["image_id"])
    if resolver(music_id) is None:
        raise ValueError("music_source_not_found")
    with _LOCK:
        directory = _root(output_root)
        current = None
        if project_id is not None:
            path = _path(output_root, project_id)
            if not path.exists() and not path.is_symlink():
                raise ValueError("mv_not_found")
            current = _read(path)
            if payload.get("revision") != current["revision"]:
                raise ValueError("mv_conflict")
        else:
            if len(list_projects(output_root)) >= MAX_PROJECTS:
                raise ValueError("mv_storage_full")
            project_id = str(uuid.uuid4())
            path = _path(output_root, project_id)
        now = time.time()
        data = {
            "version": 1, "kind": "mv", "id": project_id, "status": "draft",
            "name": name.strip(), "prompt": prompt.strip(), "aspect": aspect,
            "music_source_id": music_id,
            "created_at": current["created_at"] if current else now, "updated_at": now,
        }
        if "visual_references" in payload or (current and "visual_references" in current):
            data["visual_references"] = references if "visual_references" in payload else current["visual_references"]
        if "negative_prompt" in payload or (current and "negative_prompt" in current):
            data["negative_prompt"] = negative if "negative_prompt" in payload else current["negative_prompt"]
        encoded = (json.dumps(data, ensure_ascii=False, allow_nan=False, indent=2) + "\n").encode("utf-8")
        if len(encoded) > MAX_BYTES:
            raise ValueError("invalid_request_size")
        directory.mkdir(parents=True, exist_ok=True)
        os.chmod(directory, 0o700)
        fd, temporary = tempfile.mkstemp(prefix=".mv-", dir=directory)
        try:
            os.fchmod(fd, 0o600)
            with os.fdopen(fd, "wb") as stream:
                stream.write(encoded)
                stream.flush()
                os.fsync(stream.fileno())
            os.replace(temporary, path)
        finally:
            Path(temporary).unlink(missing_ok=True)
        return {**data, "revision": _revision(data)}
