"""Verified output copying before switching the application's storage root."""

from __future__ import annotations

import hashlib
import json
import os
import re
import shutil
import tempfile
import uuid
from collections.abc import Iterator
from pathlib import Path

HISTORY_DIRECTORIES = {"video": "video", "image": "image", "music": "music"}
MEDIA_PATTERN = re.compile(
    r"^(h3|hidream|music|music3|yue2)-([0-9a-f-]{36})(-first-frame)?\.(mp4|wav|png)$"
)


def history_directory(root: Path, kind: str) -> Path:
    directory = root / HISTORY_DIRECTORIES[kind]
    if directory.is_symlink():
        raise ValueError(f"output_layout_symlink: {directory}")
    return directory


def history_file(root: Path, kind: str, name: str) -> Path:
    path = history_directory(root, kind) / name
    return path if path.exists() or path.is_symlink() else root / name


def history_music_file(root: Path, item_id: str) -> Path | None:
    for prefix in ("music", "music3", "yue2"):
        path = history_file(root, "music", f"{prefix}-{item_id}.wav")
        if path.is_file() or path.is_symlink():
            return path
    return None


def organize_legacy_outputs(root: Path) -> None:
    """Move recognized legacy assets without overwriting or dropping references."""
    if not root.exists():
        return
    moves: dict[Path, Path] = {}
    manifests: list[Path] = []
    for name in (*HISTORY_DIRECTORIES, "workflows", "long-video", "mv", "mv-projects"):
        folder = root / name
        if folder.is_symlink():
            raise ValueError(f"output_layout_symlink: {folder}")
    for path in root.iterdir():
        match = MEDIA_PATTERN.fullmatch(path.name)
        if match:
            allowed = (match[1] == "h3" and (
                (not match[3] and match[4] in {"mp4", "wav"}) or
                (match[3] and match[4] == "png")
            )) or (match[1] == "hidream" and not match[3] and match[4] == "png") or (
                match[1] in {"music", "music3", "yue2"} and not match[3] and match[4] == "wav"
            )
            if not allowed:
                continue
            if str(uuid.UUID(match[2])) != match[2]:
                continue
            kind = {"h3": "video", "hidream": "image",
                    "music": "music", "music3": "music", "yue2": "music"}[match[1]]
            moves[path] = history_directory(root, kind) / path.name
        elif re.fullmatch(r"[0-9a-f-]{36}\.json", path.name):
            if path.is_symlink() or not path.is_file():
                raise ValueError(f"output_layout_invalid_metadata: {path}")
            record = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(record, dict) and record.get("kind") in HISTORY_DIRECTORIES:
                if record.get("id") != path.stem or str(uuid.UUID(path.stem)) != path.stem:
                    raise ValueError(f"output_layout_invalid_metadata: {path}")
                moves[path] = history_directory(root, record["kind"]) / path.name
    legacy = root / "workflows"
    if legacy.exists():
        for path in legacy.iterdir():
            if path.is_symlink():
                raise ValueError(f"output_layout_symlink: {path}")
            if path.is_dir():
                moves[path] = root / "long-video" / path.name
    for folder in (legacy, root / "long-video"):
        if folder.exists():
            if any(path.is_symlink() or not (path.is_file() or path.is_dir())
                   for path in _objects(folder)):
                raise ValueError(f"output_layout_invalid_object: {folder}")
            manifests.extend(folder.glob("*/workflow.json"))
    for source, destination in moves.items():
        if source.is_symlink() or destination.exists() or destination.is_symlink() or destination.parent.is_symlink():
            raise ValueError(f"output_layout_conflict: {source} -> {destination}")
        objects = _objects(source) if source.is_dir() else [source]
        if any(path.is_symlink() or not (path.is_file() or path.is_dir()) for path in objects):
            raise ValueError(f"output_layout_invalid_object: {source}")
    if not moves:
        return

    def rewrite(value: object, key: str = "") -> object:
        if isinstance(value, dict):
            return {name: rewrite(item, name) for name, item in value.items()}
        if isinstance(value, list):
            return [rewrite(item, key) for item in value]
        if isinstance(value, str) and key.endswith("_path"):
            path = Path(value)
            for source, destination in moves.items():
                if path == source or path.is_relative_to(source):
                    return str(destination / path.relative_to(source))
        return value

    originals = {path: path.read_bytes() for path in manifests}
    rewritten = {
        path: (json.dumps(rewrite(json.loads(data)), ensure_ascii=False, indent=2) + "\n").encode()
        for path, data in originals.items()
    }
    moved: list[tuple[Path, Path]] = []
    written: list[Path] = []
    try:
        for path, data in rewritten.items():
            if data == originals[path]:
                continue
            _replace_bytes(path, data)
            written.append(path)
        for source, destination in moves.items():
            destination.parent.mkdir(parents=True, exist_ok=True)
            os.rename(source, destination)
            moved.append((source, destination))
    except Exception:
        for source, destination in reversed(moved):
            os.rename(destination, source)
        for path in written:
            _replace_bytes(path, originals[path])
        raise
    if legacy.exists() and not any(legacy.iterdir()):
        legacy.rmdir()


def _replace_bytes(path: Path, data: bytes) -> None:
    fd, temporary = tempfile.mkstemp(prefix=".layout-", dir=path.parent)
    try:
        with os.fdopen(fd, "wb") as stream:
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)
    finally:
        Path(temporary).unlink(missing_ok=True)


def _digest(path: Path) -> bytes:
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").digest()


def _raise_walk_error(error: OSError) -> None:
    raise error


def _objects(root: Path) -> Iterator[Path]:
    for current, directories, files in os.walk(root, followlinks=False, onerror=_raise_walk_error):
        for name in directories + files:
            yield Path(current) / name


def relocate_paths(value: object, source: Path, destination: Path, key: str = "") -> object:
    if isinstance(value, dict):
        return {name: relocate_paths(item, source, destination, name) for name, item in value.items()}
    if isinstance(value, list):
        return [relocate_paths(item, source, destination, key) for item in value]
    if isinstance(value, str) and key.endswith("_path") and value.startswith(f"{source}/"):
        return str(destination / Path(value).relative_to(source))
    return value


def prepare_migration(source: Path, destination: Path) -> Path | None:
    if source.is_symlink() or destination.is_symlink():
        raise ValueError("output_migration_symlinks_not_supported")
    source, destination = source.resolve(), destination.resolve()
    if source == destination:
        return None
    try:
        source.stat()
        source_exists = True
    except FileNotFoundError:
        source_exists = False
    if source_exists and not source.is_dir():
        raise ValueError("output_source_must_be_directory")
    if source in destination.parents or destination in source.parents:
        raise ValueError("output_directories_must_not_overlap")
    if destination.exists() and (not destination.is_dir() or any(destination.iterdir())):
        raise ValueError("output_destination_must_be_empty")
    destination.parent.mkdir(parents=True, exist_ok=True)
    staging = Path(tempfile.mkdtemp(prefix=".minimuv-migration-", dir=destination.parent))
    directories: list[tuple[Path, Path]] = []
    try:
        if source_exists:
            for path in _objects(source):
                if path.is_symlink():
                    raise ValueError("output_migration_symlinks_not_supported")
                relative = path.relative_to(source)
                target = staging / relative
                if path.is_dir():
                    target.mkdir(parents=True, exist_ok=True)
                    directories.append((path, target))
                elif path.is_file():
                    target.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(path, target)
                    if _digest(path) != _digest(target):
                        raise RuntimeError(f"Output copy verification failed: {relative}")
                    if path.name == "workflow.json" and relative.parts[0] in {"workflows", "long-video"}:
                        manifest = json.loads(target.read_text(encoding="utf-8"))
                        target.write_text(json.dumps(
                            relocate_paths(manifest, source, destination),
                            ensure_ascii=False, indent=2
                        ) + "\n", encoding="utf-8")
                else:
                    raise ValueError("output_migration_special_files_not_supported")
            for original, copied in reversed(directories):
                shutil.copystat(original, copied)
        return staging
    except Exception:
        shutil.rmtree(staging)
        raise


def publish_migration(staging: Path, destination: Path) -> None:
    if destination.exists():
        destination.rmdir()
    os.replace(staging, destination)
