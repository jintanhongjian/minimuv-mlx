"""Private podcast projects: CAS manifests, per-segment voice media and merged exports."""
from __future__ import annotations

import hashlib
import json
import logging
import os
import shutil
import struct
import subprocess
import tempfile
import threading
import time
import uuid
from pathlib import Path
from typing import BinaryIO, Callable

from . import mv_music, speech

logger = logging.getLogger(__name__)

MODEL = "fish-s2-pro-8bit"
SAMPLE_RATE = 48000
MAX_PROJECTS = 100
MAX_CHARACTERS = 12
MAX_SEGMENTS = 100
MAX_NAME_CHARS = 120
MAX_GAP_SECONDS = 30.0
MAX_MANIFEST_BYTES = 4 * 1024 * 1024
MAX_IMPORT_BYTES = 100 * 1024 * 1024
MAX_EXPORT_BYTES = 0xFFFFFFFF - 44
PURPOSES = ("intro", "monologue", "outro", "story", "dialogue")
SOURCES = ("generated", "imported")
STATUSES = ("idle", "queued", "running", "completed", "failed", "cancelled")
SEGMENT_STATUSES = ("pending", "running", "ready", "failed")
MODES = ("generate", "assemble")
_COPY_BLOCK = 1024 * 1024

_LOCK = threading.RLock()
_RUNNING: dict[str, str] = {}


class PodcastError(ValueError):
    def __init__(self, code: str, detail: str = "") -> None:
        super().__init__(code)
        self.code = code
        self.detail = detail


# ---------------------------------------------------------------- storage

def _uuid(value: object, code: str = "invalid_podcast_id") -> str:
    if not isinstance(value, str) or len(value) != 36:
        raise PodcastError(code)
    try:
        canonical = str(uuid.UUID(value))
    except ValueError as exc:
        raise PodcastError(code) from exc
    if canonical != value:
        raise PodcastError(code)
    return canonical


def _private_dir(path: Path) -> Path:
    if path.is_symlink() or (path.exists() and not path.is_dir()):
        raise RuntimeError("podcast_storage_invalid")
    path.mkdir(parents=True, exist_ok=True, mode=0o700)
    os.chmod(path, 0o700)
    return path


def _root(output_root: Path, create: bool = False) -> Path:
    output_root = Path(output_root)
    directory = output_root / "podcasts"
    if directory.is_symlink() or (directory.exists() and not directory.is_dir()):
        raise RuntimeError("podcast_storage_invalid")
    if create:
        output_root.mkdir(parents=True, exist_ok=True)
        _private_dir(directory)
    return directory


def _project_dir(output_root: Path, project_id: object, create: bool = False) -> Path:
    directory = _root(output_root, create) / _uuid(project_id)
    if directory.is_symlink() or (directory.exists() and not directory.is_dir()):
        raise RuntimeError("podcast_storage_invalid")
    if create:
        _private_dir(directory)
    return directory


def _safe_file(path: Path) -> Path | None:
    if path.is_symlink() or not path.is_file():
        return None
    return path


def _guarded(directory: Path, *parts: str) -> Path:
    """Join private media parts, rejecting symlinked or non-directory intermediate components."""
    current = directory
    for part in parts[:-1]:
        current = current / part
        if current.is_symlink() or (current.exists() and not current.is_dir()):
            raise RuntimeError("podcast_storage_invalid")
    return current / parts[-1]


def reference_path(output_root: Path, project_id: str, character_id: str) -> Path:
    return _guarded(_project_dir(output_root, project_id), "characters",
                    _uuid(character_id, "invalid_podcast_character"), "voice-reference.wav")


def segment_path(output_root: Path, project_id: str, segment_id: str) -> Path:
    return _guarded(_project_dir(output_root, project_id), "segments",
                    f"{_uuid(segment_id, 'invalid_podcast_segment')}.wav")


def export_path(output_root: Path, project_id: str) -> Path:
    return _guarded(_project_dir(output_root, project_id), "export", "podcast.wav")


class _Publication:
    """Media replacements that stay reversible until the manifest that references them commits."""

    def __init__(self, output_root: Path, project_id: str):
        self._backups = _staging(output_root, project_id)
        self._items: list[tuple[Path, Path | None]] = []

    def replace(self, source: Path, target: Path) -> None:
        if target.is_symlink() or (target.exists() and not target.is_file()):
            raise RuntimeError("podcast_storage_invalid")
        backup = None
        if target.exists():
            backup = self._backups / f"preimage-{len(self._items)}"
            os.replace(target, backup)
        try:
            os.replace(source, target)
        except BaseException:
            if backup is not None:
                os.replace(backup, target)
            raise
        self._items.append((target, backup))

    def rollback(self) -> None:
        restored = True
        for target, backup in reversed(self._items):
            try:
                if backup is not None:
                    os.replace(backup, target)
                else:
                    target.unlink(missing_ok=True)
            except OSError:
                restored = False
                logger.exception("Podcast media rollback failed for %s; preimage retained in %s",
                                 target, self._backups)
        self._items.clear()
        if restored:
            _discard_tree(self._backups, "rollback staging")

    def commit(self) -> None:
        self._items.clear()
        _discard_tree(self._backups, "committed preimages")

    def apply(self, action: Callable[[], object]) -> object:
        try:
            result = action()
        except BaseException:
            self.rollback()
            raise
        self.commit()
        return result


def _canonical(data: dict) -> bytes:
    return json.dumps(data, sort_keys=True, ensure_ascii=False, allow_nan=False).encode("utf-8")


def _revision(data: dict) -> str:
    return hashlib.sha256(_canonical(data)).hexdigest()



def _discard_file(path: Path | str, purpose: str) -> None:
    """Best-effort removal that never undoes a committed manifest but always reports failures."""
    try:
        Path(path).unlink(missing_ok=True)
    except OSError as exc:
        logger.warning("Podcast cleanup failed (%s) for %s: %s", purpose, path, exc)


def _discard_tree(path: Path, purpose: str) -> None:
    try:
        shutil.rmtree(path)
    except FileNotFoundError:
        pass
    except OSError as exc:
        logger.warning("Podcast cleanup failed (%s) for %s: %s", purpose, path, exc)

def _write(output_root: Path, data: dict) -> dict:
    data = {key: value for key, value in data.items() if key != "revision"}
    encoded = _canonical(data)
    if len(encoded) > MAX_MANIFEST_BYTES:
        raise PodcastError("podcast_manifest_too_large")
    directory = _project_dir(output_root, data["id"], create=True)
    target = directory / "project.json"
    if target.is_symlink():
        raise RuntimeError("podcast_storage_invalid")
    descriptor, temporary = tempfile.mkstemp(prefix=".project-", suffix=".json", dir=directory)
    try:
        with os.fdopen(descriptor, "wb") as stream:
            stream.write(encoded)
            stream.flush()
            os.fsync(stream.fileno())
        os.chmod(temporary, 0o600)
        os.replace(temporary, target)
    finally:
        _discard_file(temporary, "manifest temporary")
    return {**data, "revision": _revision(data)}


def _read(output_root: Path, project_id: object) -> dict:
    path = _project_dir(output_root, project_id) / "project.json"
    if not path.exists():
        raise PodcastError("podcast_not_found")
    if path.is_symlink() or not path.is_file() or path.stat().st_size > MAX_MANIFEST_BYTES:
        raise RuntimeError("podcast_storage_invalid")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(data, dict):
            raise ValueError("invalid_manifest")
        if "settings" not in data:
            data["settings"] = {}
        if isinstance(data["settings"], dict):
            data["settings"].setdefault("model", MODEL)
        characters = data.get("characters", [])
        if isinstance(characters, list):
            for character in characters:
                if isinstance(character, dict):
                    character.setdefault("voice_description", "")
        _validate_manifest(data, path.parent.name)
    except (ValueError, TypeError, KeyError, UnicodeDecodeError) as exc:
        raise RuntimeError("podcast_storage_invalid") from exc
    # A job owned by a previous server process can no longer make progress.
    if data["status"] in {"queued", "running"} and _RUNNING.get(data["id"]) != data["job_id"]:
        data["status"] = "failed"
        data["error"] = "podcast_interrupted"
        data["progress"]["current_segment_id"] = None
        for segment in data["segments"]:
            if segment["status"] == "running":
                segment["status"] = "pending"
    return {**data, "revision": _revision(data)}


def _number(value: object) -> bool:
    return type(value) in (int, float) and value == value and abs(value) != float("inf")


def _validate_media(media: object) -> None:
    if media is None:
        return
    if (not isinstance(media, dict) or set(media) != {"duration", "samples", "sample_rate", "fingerprint"}
            or type(media["samples"]) is not int or media["samples"] <= 0
            or media["sample_rate"] != SAMPLE_RATE or not _number(media["duration"])
            or not isinstance(media["fingerprint"], str) or len(media["fingerprint"]) != 64):
        raise ValueError("invalid_media")


def _validate_manifest(data: object, directory_name: str) -> None:
    if (not isinstance(data, dict) or data.get("version") != 1 or data.get("kind") != "podcast"
            or set(data) != {"version", "kind", "id", "name", "created_at", "updated_at", "characters",
                             "segments", "settings", "status", "mode", "error", "job_id", "progress", "export"}
            or _uuid(data["id"]) != directory_name):
        raise ValueError("invalid_manifest")
    _name(data["name"])
    speech.validate_settings(data["settings"])
    if data["status"] not in STATUSES or data["mode"] not in (None, *MODES):
        raise ValueError("invalid_manifest")
    if data["error"] is not None and not isinstance(data["error"], str):
        raise ValueError("invalid_manifest")
    if data["job_id"] is not None:
        _uuid(data["job_id"])
    progress = data["progress"]
    if (not isinstance(progress, dict) or set(progress) != {"completed", "total", "current_segment_id", "stage"}
            or type(progress["completed"]) is not int or type(progress["total"]) is not int
            or progress["stage"] not in ("idle", "generating", "assembling", "done")):
        raise ValueError("invalid_manifest")
    characters = data["characters"]
    if not isinstance(characters, list) or len(characters) > MAX_CHARACTERS:
        raise ValueError("invalid_manifest")
    for character in characters:
        if not isinstance(character, dict):
            raise ValueError("invalid_manifest")
        character.setdefault("voice_description", "")
        # Consent is stored as a bool; the cloning model re-checks it when a project is created or saved.
        if (set(character) != {"id", "name", "reference_text", "voice_description", "consent", "reference"}
                or type(character["consent"]) is not bool):
            raise ValueError("invalid_manifest")
        _uuid(character["id"])
        _name(character["name"], "invalid_podcast_character")
        speech.validate_text(character["reference_text"], allow_empty=True)
        speech.validate_text(character["voice_description"], allow_empty=True)
        reference = character["reference"]
        if reference is not None and (
                not isinstance(reference, dict) or set(reference) != {"duration", "sha256", "uploaded_at"}
                or not _number(reference["duration"]) or not _number(reference["uploaded_at"])
                or not isinstance(reference["sha256"], str) or len(reference["sha256"]) != 64):
            raise ValueError("invalid_manifest")
    character_ids = {character["id"] for character in characters}
    if len(character_ids) != len(characters):
        raise ValueError("invalid_manifest")
    segments = data["segments"]
    if not isinstance(segments, list) or len(segments) > MAX_SEGMENTS:
        raise ValueError("invalid_manifest")
    for segment in segments:
        if (not isinstance(segment, dict) or set(segment) != {
                "id", "character_id", "text", "purpose", "gap_seconds", "source", "status", "error", "media"}
                or segment["source"] not in SOURCES or segment["status"] not in SEGMENT_STATUSES
                or segment["purpose"] not in PURPOSES
                or (segment["character_id"] is not None and segment["character_id"] not in character_ids)
                or (segment["error"] is not None and not isinstance(segment["error"], str))):
            raise ValueError("invalid_manifest")
        _uuid(segment["id"])
        _gap(segment["gap_seconds"])
        speech.validate_text(segment["text"], allow_empty=True)
        _validate_media(segment["media"])
    if len({segment["id"] for segment in segments}) != len(segments):
        raise ValueError("invalid_manifest")
    export = data["export"]
    if export is not None and (
            not isinstance(export, dict)
            or set(export) != {"duration", "samples", "sample_rate", "fingerprint", "created_at", "timeline"}
            or type(export["samples"]) is not int or export["sample_rate"] != SAMPLE_RATE
            or not isinstance(export["timeline"], list)):
        raise ValueError("invalid_manifest")


# ---------------------------------------------------------------- validation

def _name(value: object, code: str = "invalid_podcast_name") -> str:
    if not isinstance(value, str):
        raise PodcastError(code)
    name = " ".join(value.split())
    if not 1 <= len(name) <= MAX_NAME_CHARS:
        raise PodcastError(code)
    return name


def _gap(value: object) -> float:
    if not _number(value) or type(value) is bool or not 0 <= value <= MAX_GAP_SECONDS:
        raise PodcastError("invalid_podcast_segment", "gap_seconds")
    return float(value)


def _client_id(value: object, code: str, seen: set[str]) -> str:
    identifier = str(uuid.uuid4()) if value is None else _uuid(value, code)
    if identifier in seen:
        raise PodcastError(code, "duplicate_id")
    seen.add(identifier)
    return identifier


def _settings(value: object) -> dict:
    try:
        return speech.validate_settings({} if value is None else value)
    except ValueError as exc:
        raise PodcastError("invalid_podcast_settings") from exc


def _text(value: object, code: str) -> str:
    try:
        return speech.validate_text("" if value is None else value, allow_empty=True)
    except ValueError as exc:
        raise PodcastError(code, "text") from exc


def _characters(payload: object, existing: list[dict], model: str = MODEL) -> list[dict]:
    if payload is None:
        payload = []
    if not isinstance(payload, list) or len(payload) > MAX_CHARACTERS:
        raise PodcastError("invalid_podcast_character", "characters")
    previous = {character["id"]: character for character in existing}
    seen: set[str] = set()
    result = []
    for item in payload:
        if not isinstance(item, dict) or set(item) - {"id", "name", "reference_text", "voice_description",
                                                      "consent", "reference", "reference_url"}:
            raise PodcastError("invalid_podcast_character")
        consent = item.get("consent")
        # Cloning an authorized reference voice needs consent; a described voice is synthesized.
        if model == MODEL and consent is not True:
            raise PodcastError("podcast_consent_required")
        if consent is not None and type(consent) is not bool:
            raise PodcastError("invalid_podcast_character")
        identifier = _client_id(item.get("id"), "invalid_podcast_character", seen)
        result.append({
            "id": identifier,
            "name": _name(item.get("name"), "invalid_podcast_character"),
            "reference_text": _text(item.get("reference_text"), "invalid_podcast_character"),
            "voice_description": _text(item.get("voice_description"), "invalid_podcast_character"),
            "consent": consent is True,
            # Reference metadata is server-owned; only uploads may change it.
            "reference": previous.get(identifier, {}).get("reference"),
        })
    return result


def _require_cloning_consent(data: dict) -> None:
    """A project that clones reference voices must have consent for every character."""
    if data["settings"]["model"] == MODEL and any(not item["consent"] for item in data["characters"]):
        raise PodcastError("podcast_consent_required")


def _segments(payload: object, existing: list[dict], character_ids: set[str]) -> list[dict]:
    if payload is None:
        payload = []
    if not isinstance(payload, list) or len(payload) > MAX_SEGMENTS:
        raise PodcastError("invalid_podcast_segment", "segments")
    previous = {segment["id"]: segment for segment in existing}
    seen: set[str] = set()
    result = []
    allowed = {"id", "character_id", "text", "purpose", "gap_seconds",
               "source", "status", "error", "media", "media_url", "audio_url", "srt_url", "vtt_url"}
    for item in payload:
        if not isinstance(item, dict) or set(item) - allowed:
            raise PodcastError("invalid_podcast_segment")
        identifier = _client_id(item.get("id"), "invalid_podcast_segment", seen)
        character_id = item.get("character_id")
        if character_id is not None and character_id not in character_ids:
            raise PodcastError("podcast_character_not_found", str(character_id)[:64])
        purpose = item.get("purpose", "monologue")
        if purpose not in PURPOSES:
            raise PodcastError("invalid_podcast_segment", "purpose")
        old = previous.get(identifier)
        source = item.get("source", old["source"] if old else "generated")
        if source not in SOURCES:
            raise PodcastError("invalid_podcast_segment", "source")
        media = old["media"] if old and old["source"] == source else None
        result.append({
            "id": identifier, "character_id": character_id,
            "text": _text(item.get("text"), "invalid_podcast_segment"),
            "purpose": purpose, "gap_seconds": _gap(item.get("gap_seconds", 0)),
            "source": source, "status": "ready" if media else "pending",
            "error": None, "media": media,
        })
    return result


def _generation_fingerprint(data: dict, segment: dict) -> str | None:
    character = next((item for item in data["characters"] if item["id"] == segment["character_id"]), None)
    if character is None:
        return None
    model = data["settings"]["model"]
    reference = character["reference"]
    if model == MODEL and reference is None:
        return None
    if model in speech.VOICE_DESIGN_MODELS and not character["voice_description"]:
        return None
    fingerprint_payload = {
        "text": segment["text"], "character_id": character["id"],
        "reference": reference["sha256"] if reference and model == MODEL else None,
        "reference_text": character["reference_text"] if model == MODEL else "",
        "settings": {key: value for key, value in data["settings"].items() if key != "model"},
        "model": model,
    }
    if model in speech.VOICE_DESIGN_MODELS:
        fingerprint_payload["voice_description"] = character["voice_description"]
    return hashlib.sha256(_canonical(fingerprint_payload)).hexdigest()


def _compose_fingerprint(data: dict) -> str | None:
    if not data["segments"] or any(segment["media"] is None for segment in data["segments"]):
        return None
    return hashlib.sha256(_canonical([
        [segment["id"], segment["media"]["fingerprint"], segment["media"]["samples"],
         segment["gap_seconds"], segment["text"]] for segment in data["segments"]
    ])).hexdigest()


def _reconcile(data: dict) -> None:
    """Drop stale generated media and export metadata; files are removed only after commit."""
    for segment in data["segments"]:
        if segment["source"] == "generated" and segment["media"] is not None:
            if segment["media"]["fingerprint"] != _generation_fingerprint(data, segment):
                segment["media"] = None
        if segment["media"] is None and segment["status"] == "ready":
            segment["status"] = "pending"
    if data["export"] is not None and data["export"]["fingerprint"] != _compose_fingerprint(data):
        data["export"] = None


def _collect_garbage(output_root: Path, data: dict) -> None:
    """Remove private files no longer referenced by the committed manifest (best effort)."""
    try:
        _remove_unreferenced(output_root, data)
    except (OSError, RuntimeError) as exc:
        # The manifest already committed; unreferenced files are retried on the next committed edit.
        logger.warning("Podcast garbage collection failed for project %s: %s", data["id"], exc)


def _remove_unreferenced(output_root: Path, data: dict) -> None:
    directory = _project_dir(output_root, data["id"])
    keep_segments = {f"{segment['id']}.wav" for segment in data["segments"] if segment["media"]}
    segments_dir = directory / "segments"
    if segments_dir.is_dir() and not segments_dir.is_symlink():
        for path in segments_dir.iterdir():
            if path.name not in keep_segments and (path.is_file() or path.is_symlink()):
                path.unlink(missing_ok=True)
    keep_characters = {character["id"] for character in data["characters"]}
    characters_dir = directory / "characters"
    if characters_dir.is_dir() and not characters_dir.is_symlink():
        for path in characters_dir.iterdir():
            if path.name not in keep_characters:
                if path.is_dir() and not path.is_symlink():
                    shutil.rmtree(path)
                else:
                    path.unlink(missing_ok=True)
    if data["export"] is None:
        export_dir = directory / "export"
        if export_dir.is_dir() and not export_dir.is_symlink():
            (export_dir / "podcast.wav").unlink(missing_ok=True)


def _ensure_mutable(data: dict, revision: object) -> None:
    if not isinstance(revision, str) or revision != data["revision"]:
        raise PodcastError("podcast_conflict")
    if data["id"] in _RUNNING:
        raise PodcastError("podcast_busy")


def _idle_progress(data: dict) -> dict:
    return {"completed": sum(1 for segment in data["segments"] if segment["media"]),
            "total": len(data["segments"]), "current_segment_id": None, "stage": "idle"}


def _after_edit(output_root: Path, data: dict, publication: _Publication | None = None) -> dict:
    _reconcile(data)
    if data["status"] in {"completed", "failed", "cancelled"} and data["export"] is None:
        data["status"] = "idle"
    if data["status"] == "idle":
        data["error"] = None
    data["progress"] = {**_idle_progress(data), "stage": "done" if data["export"] else "idle"}
    data["updated_at"] = time.time()
    if publication is None:
        written = _write(output_root, data)
    else:
        written = publication.apply(lambda: _write(output_root, data))
    _collect_garbage(output_root, written)
    return written


# ---------------------------------------------------------------- public API

def public(data: dict) -> dict:
    base = f"/api/podcasts/{data['id']}"
    return {
        "id": data["id"], "name": data["name"], "revision": data["revision"],
        "created_at": data["created_at"], "updated_at": data["updated_at"],
        "status": data["status"], "mode": data["mode"], "error": data["error"],
        "job_id": data["job_id"], "progress": dict(data["progress"]),
        "settings": dict(data["settings"]),
        "characters": [{
            **{key: character[key] for key in ("id", "name", "reference_text", "voice_description", "consent")},
            "reference": None if character["reference"] is None else {
                **character["reference"], "url": f"{base}/references/{character['id']}",
                "audio_url": f"{base}/references/{character['id']}",
            },
            "reference_url": None if character["reference"] is None else f"{base}/references/{character['id']}",
        } for character in data["characters"]],
        "segments": [{
            **{key: segment[key] for key in (
                "id", "character_id", "text", "purpose", "gap_seconds", "source", "status", "error")},
            "media": None if segment["media"] is None else {
                **segment["media"], "url": f"{base}/media/{segment['id']}",
                "srt_url": f"{base}/subtitles/{segment['id']}/srt",
                "vtt_url": f"{base}/subtitles/{segment['id']}/vtt",
            },
            "audio_url": None if segment["media"] is None else f"{base}/media/{segment['id']}",
            "srt_url": None if segment["media"] is None else f"{base}/subtitles/{segment['id']}/srt",
            "vtt_url": None if segment["media"] is None else f"{base}/subtitles/{segment['id']}/vtt",
        } for segment in data["segments"]],
        "export": None if data["export"] is None else {
            **{key: data["export"][key] for key in ("duration", "samples", "sample_rate", "created_at", "timeline")},
            "audio_url": f"{base}/export/audio", "srt_url": f"{base}/export/srt",
            "vtt_url": f"{base}/export/vtt",
        },
        "exports": None if data["export"] is None else {
            "audio_url": f"{base}/export/audio", "srt_url": f"{base}/export/srt", "vtt_url": f"{base}/export/vtt",
        },
        "logs": [],
    }


def list_projects(output_root: Path) -> list[dict]:
    with _LOCK:
        directory = _root(output_root)
        if not directory.exists():
            return []
        paths = [path for path in directory.iterdir() if (path / "project.json").is_file()]
        if len(paths) > MAX_PROJECTS:
            raise RuntimeError("podcast_storage_full")
        items = [public(_read(output_root, path.name)) for path in paths]
    return sorted(items, key=lambda item: item["updated_at"], reverse=True)


def get(output_root: Path, project_id: object) -> dict:
    with _LOCK:
        return public(_read(output_root, project_id))


def create(output_root: Path, payload: object) -> dict:
    if not isinstance(payload, dict) or set(payload) - {"name", "characters", "segments", "settings"}:
        raise PodcastError("invalid_podcast_payload")
    with _LOCK:
        directory = _root(output_root)
        if directory.exists() and sum(1 for path in directory.iterdir() if path.is_dir()) >= MAX_PROJECTS:
            raise PodcastError("podcast_limit")
        settings = _settings(payload.get("settings"))
        characters = _characters(payload.get("characters"), [], settings["model"])
        now = time.time()
        data = {
            "version": 1, "kind": "podcast", "id": str(uuid.uuid4()),
            "name": _name(payload.get("name")), "created_at": now, "updated_at": now,
            "characters": characters,
            "segments": _segments(payload.get("segments"), [], {item["id"] for item in characters}),
            "settings": settings, "status": "idle", "mode": None,
            "error": None, "job_id": None, "progress": {}, "export": None,
        }
        data["progress"] = _idle_progress(data)
        for name in ("characters", "segments", "export", "staging", "work"):
            _private_dir(_project_dir(output_root, data["id"], create=True) / name)
        return public(_write(output_root, data))


_ECHOED_PROJECT_KEYS = {"id", "created_at", "updated_at", "status", "mode", "error", "job_id", "progress",
                        "export", "exports", "logs"}


def save(output_root: Path, project_id: object, payload: object) -> dict:
    if (not isinstance(payload, dict)
            or set(payload) - {"revision", "name", "characters", "segments", "settings"} - _ECHOED_PROJECT_KEYS
            or "revision" not in payload):
        raise PodcastError("invalid_podcast_payload")
    with _LOCK:
        data = _read(output_root, project_id)
        _ensure_mutable(data, payload["revision"])
        if "name" in payload:
            data["name"] = _name(payload["name"])
        if "settings" in payload:
            data["settings"] = _settings(payload["settings"])
        if "characters" in payload:
            data["characters"] = _characters(payload["characters"], data["characters"],
                                             data["settings"]["model"])
        _require_cloning_consent(data)
        character_ids = {character["id"] for character in data["characters"]}
        data["segments"] = _segments(
            payload["segments"] if "segments" in payload else data["segments"],
            data["segments"], character_ids,
        )
        return public(_after_edit(output_root, data))


def delete(output_root: Path, project_id: object, revision: object) -> None:
    with _LOCK:
        data = _read(output_root, project_id)
        _ensure_mutable(data, revision)
        shutil.rmtree(_project_dir(output_root, data["id"]))


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        while block := stream.read(_COPY_BLOCK):
            digest.update(block)
    return digest.hexdigest()


def _staging(output_root: Path, project_id: str) -> Path:
    staging = _private_dir(_project_dir(output_root, project_id) / "staging")
    return Path(tempfile.mkdtemp(dir=staging))


def store_reference(output_root: Path, project_id: object, character_id: object, revision: object,
                    stream: BinaryIO, length: int) -> dict:
    with _LOCK:
        data = _read(output_root, project_id)
        character_id = _uuid(character_id, "invalid_podcast_character")
        if not any(item["id"] == character_id for item in data["characters"]):
            raise PodcastError("podcast_character_not_found")
        _ensure_mutable(data, revision)
        staging = _staging(output_root, data["id"])
    try:
        staged = speech.store_reference(staging, stream, length)
        duration = mv_music.inspect_wav(staged)["duration"]
        digest = _sha256(staged)
        with _LOCK:
            data = _read(output_root, data["id"])
            _ensure_mutable(data, revision)
            character = next((item for item in data["characters"] if item["id"] == character_id), None)
            if character is None:
                raise PodcastError("podcast_character_not_found")
            target = reference_path(output_root, data["id"], character_id)
            _private_dir(target.parent.parent)
            _private_dir(target.parent)
            publication = _Publication(output_root, data["id"])
            try:
                publication.replace(staged, target)
                character["reference"] = {"duration": round(duration, 6), "sha256": digest,
                                          "uploaded_at": time.time()}
            except BaseException:
                publication.rollback()
                raise
            return public(_after_edit(output_root, data, publication))
    finally:
        _discard_tree(staging, "upload staging")


def find_ffmpeg() -> str:
    for candidate in (shutil.which("ffmpeg"), "/opt/homebrew/bin/ffmpeg", "/usr/local/bin/ffmpeg"):
        if candidate and os.access(candidate, os.X_OK):
            return candidate
    raise RuntimeError("ffmpeg_required")


def pcm_info(path: Path) -> tuple[int, int]:
    """Return (data offset, data bytes) for a 48 kHz mono PCM16 WAV."""
    size = path.stat().st_size
    with path.open("rb") as stream:
        header = stream.read(12)
        if len(header) != 12 or header[:4] != b"RIFF" or header[8:] != b"WAVE":
            raise RuntimeError("podcast_media_invalid")
        position, format_ok = 12, False
        for _ in range(4096):
            if position + 8 > size:
                break
            stream.seek(position)
            chunk = stream.read(8)
            if len(chunk) != 8:
                raise RuntimeError("podcast_media_invalid")
            length = struct.unpack("<I", chunk[4:])[0]
            if position + 8 + length > size:
                raise RuntimeError("podcast_media_invalid")
            if chunk[:4] == b"fmt ":
                fmt = stream.read(16) if length >= 16 else b""
                if len(fmt) != 16:
                    raise RuntimeError("podcast_media_invalid")
                codec, channels, rate, _, align, bits = struct.unpack("<HHIIHH", fmt)
                format_ok = (codec == 1 and channels == 1 and rate == SAMPLE_RATE
                             and align == 2 and bits == 16)
            elif chunk[:4] == b"data":
                if not format_ok or position + 8 + length > size or length < 2 or length % 2:
                    raise RuntimeError("podcast_media_invalid")
                return position + 8, length
            position += 8 + length + length % 2
    raise RuntimeError("podcast_media_invalid")


def normalize(source: Path, target: Path, ffmpeg: str | None = None) -> dict:
    ffmpeg = ffmpeg or find_ffmpeg()
    result = subprocess.run(
        [ffmpeg, "-nostdin", "-y", "-v", "error", "-i", str(source), "-map_metadata", "-1", "-vn",
         "-ac", "1", "-ar", str(SAMPLE_RATE), "-c:a", "pcm_s16le", "-fflags", "+bitexact",
         "-flags:a", "+bitexact", "-f", "wav", str(target)],
        stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
        text=True, timeout=900, check=False,
    )
    if result.returncode != 0:
        raise RuntimeError(f"podcast_normalize_failed: {result.stdout.strip()[-500:]}")
    os.chmod(target, 0o600)
    _, data_bytes = pcm_info(target)
    samples = data_bytes // 2
    return {"duration": round(samples / SAMPLE_RATE, 6), "samples": samples, "sample_rate": SAMPLE_RATE}


def import_audio(output_root: Path, project_id: object, segment_id: object, revision: object,
                 stream: BinaryIO, length: int, ffmpeg: str | None = None) -> dict:
    if type(length) is not int or not 0 < length <= MAX_IMPORT_BYTES:
        raise PodcastError("podcast_import_limit")
    with _LOCK:
        data = _read(output_root, project_id)
        segment_id = _uuid(segment_id, "invalid_podcast_segment")
        if not any(item["id"] == segment_id for item in data["segments"]):
            raise PodcastError("podcast_segment_not_found")
        _ensure_mutable(data, revision)
        staging = _staging(output_root, data["id"])
    try:
        upload = staging / "upload.wav"
        with upload.open("wb") as output:
            remaining = length
            while remaining:
                block = stream.read(min(_COPY_BLOCK, remaining))
                if not block:
                    raise PodcastError("invalid_podcast_import")
                output.write(block)
                remaining -= len(block)
            output.flush()
            os.fsync(output.fileno())
        try:
            mv_music.inspect_wav(upload)
        except ValueError as exc:
            raise PodcastError("podcast_import_limit" if str(exc) == "mv_wav_limit" else "invalid_podcast_import") from exc
        normalized = staging / "normalized.wav"
        media = normalize(upload, normalized, ffmpeg)
        media["fingerprint"] = _sha256(normalized)
        with _LOCK:
            data = _read(output_root, data["id"])
            _ensure_mutable(data, revision)
            segment = next((item for item in data["segments"] if item["id"] == segment_id), None)
            if segment is None:
                raise PodcastError("podcast_segment_not_found")
            target = segment_path(output_root, data["id"], segment_id)
            _private_dir(target.parent)
            publication = _Publication(output_root, data["id"])
            try:
                publication.replace(normalized, target)
                segment.update(source="imported", media=media, status="ready", error=None)
            except BaseException:
                publication.rollback()
                raise
            return public(_after_edit(output_root, data, publication))
    finally:
        _discard_tree(staging, "upload staging")


# ---------------------------------------------------------------- background jobs

def begin_job(output_root: Path, project_id: object, revision: object, job_id: str, mode: str) -> dict:
    """Validate and lock a project for one generation/assembly job; returns its work plan."""
    if mode not in MODES:
        raise PodcastError("invalid_podcast_payload")
    with _LOCK:
        data = _read(output_root, project_id)
        _ensure_mutable(data, revision)
        if not data["segments"]:
            raise PodcastError("podcast_segments_required")
        plan = []
        for segment in data["segments"]:
            if segment["media"] is not None:
                continue
            if mode == "assemble" or segment["source"] == "imported":
                raise PodcastError("podcast_segment_audio_missing", segment["id"])
            character = next((item for item in data["characters"] if item["id"] == segment["character_id"]), None)
            if character is None:
                raise PodcastError("podcast_segment_character_required", segment["id"])
            model = data["settings"]["model"]
            if model == MODEL and character["reference"] is None:
                raise PodcastError("podcast_reference_required", character["id"])
            if model == MODEL and not character["reference_text"]:
                raise PodcastError("podcast_reference_text_required", character["id"])
            if model in speech.VOICE_DESIGN_MODELS and not character["voice_description"]:
                raise PodcastError("podcast_voice_description_required", character["id"])
            if not segment["text"]:
                raise PodcastError("podcast_segment_text_required", segment["id"])
            reference = (_safe_file(reference_path(output_root, data["id"], character["id"]))
                         if model == MODEL else None)
            if model == MODEL and reference is None:
                raise RuntimeError("podcast_reference_missing")
            plan.append({
                "segment_id": segment["id"], "text": segment["text"],
                "reference_path": str(reference) if reference else None,
                "reference_text": character["reference_text"],
                "voice_description": character["voice_description"],
                "fingerprint": _generation_fingerprint(data, segment),
            })
        data.update(status="queued", mode=mode, error=None, job_id=_uuid(job_id))
        data["progress"] = {**_idle_progress(data), "stage": "generating" if plan else "assembling"}
        for segment in data["segments"]:
            segment["error"] = None
            if segment["status"] == "failed":
                segment["status"] = "pending"
        _RUNNING[data["id"]] = job_id
        try:
            data = _write(output_root, data)
        except Exception:
            _RUNNING.pop(data["id"], None)
            raise
        return {"project": public(data), "settings": dict(data["settings"]), "segments": plan,
                "work_directory": str(_private_dir(_project_dir(output_root, data["id"]) / "work"))}


def _job_update(output_root: Path, project_id: str, job_id: str, change: Callable[[dict], None]) -> dict:
    with _LOCK:
        if _RUNNING.get(project_id) != job_id:
            raise RuntimeError("podcast_job_not_active")
        data = _read(output_root, project_id)
        change(data)
        data["updated_at"] = time.time()
        return _write(output_root, data)


def segment_started(output_root: Path, project_id: str, job_id: str, segment_id: str) -> None:
    def change(data: dict) -> None:
        data["status"] = "running"
        for segment in data["segments"]:
            if segment["id"] == segment_id:
                segment.update(status="running", error=None)
        data["progress"].update(stage="generating", current_segment_id=segment_id)
    _job_update(output_root, project_id, job_id, change)


def store_generated(output_root: Path, project_id: str, job_id: str, segment_id: str,
                    source: Path, fingerprint: str, ffmpeg: str | None = None) -> None:
    source = Path(source)
    if _safe_file(source) is None or source.stat().st_size < 44:
        raise RuntimeError("fish_output_missing")
    target = segment_path(output_root, project_id, segment_id)
    _private_dir(target.parent)
    temporary = target.with_name(f".{segment_id}.part.wav")
    try:
        media = normalize(source, temporary, ffmpeg)
        media["fingerprint"] = fingerprint

        def change(data: dict) -> None:
            segment = next((item for item in data["segments"] if item["id"] == segment_id), None)
            if segment is None or _generation_fingerprint(data, segment) != fingerprint:
                raise RuntimeError("podcast_segment_changed")
            publication.replace(temporary, target)
            segment.update(media=media, status="ready", error=None)
            data["progress"].update(
                completed=sum(1 for item in data["segments"] if item["media"]), current_segment_id=None,
            )
        with _LOCK:
            publication = _Publication(output_root, project_id)
            publication.apply(lambda: _job_update(output_root, project_id, job_id, change))
    finally:
        _discard_file(temporary, "job temporary")


def _write_wav_header(stream: BinaryIO, data_bytes: int) -> None:
    stream.write(b"RIFF" + struct.pack("<I", 36 + data_bytes) + b"WAVE")
    stream.write(b"fmt " + struct.pack("<IHHIIHH", 16, 1, 1, SAMPLE_RATE, SAMPLE_RATE * 2, 2, 16))
    stream.write(b"data" + struct.pack("<I", data_bytes))


def compose(output_root: Path, project_id: str, job_id: str, check: Callable[[], None] | None = None) -> None:
    """Stream normalized segment PCM plus explicit silence gaps into one WAV."""
    check = check or (lambda: None)

    def started(data: dict) -> None:
        data["status"] = "running"
        data["progress"].update(stage="assembling", current_segment_id=None)
    data = _job_update(output_root, project_id, job_id, started)
    sources = []
    for segment in data["segments"]:
        path = _safe_file(segment_path(output_root, project_id, segment["id"]))
        if segment["media"] is None or path is None:
            raise PodcastError("podcast_segment_audio_missing", segment["id"])
        offset, size = pcm_info(path)
        if size // 2 != segment["media"]["samples"]:
            raise RuntimeError("podcast_media_invalid")
        sources.append((segment, path, offset, size))
    timeline, cursor = [], 0
    for index, (segment, _, _, size) in enumerate(sources):
        samples = size // 2
        timeline.append({"segment_id": segment["id"], "start": round(cursor / SAMPLE_RATE, 6),
                         "end": round((cursor + samples) / SAMPLE_RATE, 6)})
        cursor += samples
        if index < len(sources) - 1:
            cursor += round(segment["gap_seconds"] * SAMPLE_RATE)
    if cursor * 2 > MAX_EXPORT_BYTES:
        raise PodcastError("podcast_export_too_large")
    target = export_path(output_root, project_id)
    _private_dir(target.parent)
    temporary = target.with_name(".podcast.part.wav")
    try:
        with temporary.open("wb") as output:
            _write_wav_header(output, cursor * 2)
            for index, (segment, path, offset, size) in enumerate(sources):
                with path.open("rb") as stream:
                    stream.seek(offset)
                    remaining = size
                    while remaining:
                        check()
                        block = stream.read(min(_COPY_BLOCK, remaining))
                        if not block:
                            raise RuntimeError("podcast_media_invalid")
                        output.write(block)
                        remaining -= len(block)
                if index < len(sources) - 1:
                    silence = round(segment["gap_seconds"] * SAMPLE_RATE) * 2
                    while silence:
                        block = min(_COPY_BLOCK, silence)
                        output.write(bytes(block))
                        silence -= block
            output.flush()
            os.fsync(output.fileno())
        os.chmod(temporary, 0o600)
        check()

        def finished(data: dict) -> None:
            fingerprint = _compose_fingerprint(data)
            if fingerprint is None or [item["segment_id"] for item in timeline] != [
                    segment["id"] for segment in data["segments"]]:
                raise RuntimeError("podcast_segment_changed")
            publication.replace(temporary, target)
            data["export"] = {
                "duration": round(cursor / SAMPLE_RATE, 6), "samples": cursor,
                "sample_rate": SAMPLE_RATE, "fingerprint": fingerprint,
                "created_at": time.time(), "timeline": timeline,
            }
        with _LOCK:
            publication = _Publication(output_root, project_id)
            publication.apply(lambda: _job_update(output_root, project_id, job_id, finished))
    finally:
        _discard_file(temporary, "job temporary")


def finish_job(output_root: Path, project_id: str, job_id: str, outcome: str, error: str | None = None) -> None:
    if outcome not in {"completed", "failed", "cancelled"}:
        raise ValueError("invalid_podcast_outcome")
    with _LOCK:
        if _RUNNING.get(project_id) != job_id:
            return
        try:
            data = _read(output_root, project_id)
            current = data["progress"].get("current_segment_id")
            for segment in data["segments"]:
                if segment["status"] == "running":
                    if outcome == "failed" and segment["id"] == current:
                        segment.update(status="failed", error=error)
                    else:
                        segment["status"] = "pending"
            data.update(status=outcome, error=error if outcome == "failed" else None)
            data["progress"] = {**_idle_progress(data), "current_segment_id": current if outcome == "failed" else None,
                                "stage": "done" if outcome == "completed" else "idle"}
            data["updated_at"] = time.time()
            _write(output_root, data)
        finally:
            _RUNNING.pop(project_id, None)


def active_job(output_root: Path, project_id: object) -> str | None:
    with _LOCK:
        data = _read(output_root, project_id)
        return _RUNNING.get(data["id"])


# ---------------------------------------------------------------- subtitles

def _timestamp(seconds: float, separator: str) -> str:
    milliseconds = max(0, round(seconds * 1000))
    hours, milliseconds = divmod(milliseconds, 3_600_000)
    minutes, milliseconds = divmod(milliseconds, 60_000)
    secs, milliseconds = divmod(milliseconds, 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}{separator}{milliseconds:03d}"


def _render(cues: list[tuple[float, float, str]], fmt: str) -> str:
    if fmt not in ("srt", "vtt"):
        raise PodcastError("invalid_podcast_subtitle_format")
    lines = ["WEBVTT", ""] if fmt == "vtt" else []
    separator = "." if fmt == "vtt" else ","
    for index, (start, end, text) in enumerate(cues, 1):
        text = "\n".join(line for line in text.replace("\r", "").replace("-->", "->").split("\n") if line.strip())
        if fmt == "srt":
            lines.append(str(index))
        lines += [f"{_timestamp(start, separator)} --> {_timestamp(end, separator)}", text, ""]
    return "\n".join(lines)


def segment_subtitles(output_root: Path, project_id: object, segment_id: object, fmt: str) -> str:
    with _LOCK:
        data = _read(output_root, project_id)
    segment = next((item for item in data["segments"] if item["id"] == segment_id), None)
    if segment is None or segment["media"] is None:
        raise PodcastError("podcast_media_not_found")
    # Imported audio without user text intentionally has no cue; no transcript is invented.
    cues = [(0.0, segment["media"]["duration"], segment["text"])] if segment["text"] else []
    return _render(cues, fmt)


def export_subtitles(output_root: Path, project_id: object, fmt: str) -> str:
    with _LOCK:
        data = _read(output_root, project_id)
    if data["export"] is None:
        raise PodcastError("podcast_export_not_found")
    texts = {segment["id"]: segment["text"] for segment in data["segments"]}
    return _render([(item["start"], item["end"], texts.get(item["segment_id"], ""))
                    for item in data["export"]["timeline"] if texts.get(item["segment_id"])], fmt)


def media_file(output_root: Path, project_id: object, kind: str, item_id: object = None) -> Path:
    try:
        return _media_file(output_root, project_id, kind, item_id)
    except RuntimeError as exc:
        if str(exc) == "podcast_storage_invalid":
            raise PodcastError("podcast_media_not_found") from exc
        raise


def _media_file(output_root: Path, project_id: object, kind: str, item_id: object) -> Path:
    with _LOCK:
        data = _read(output_root, project_id)
        if kind == "segment":
            segment = next((item for item in data["segments"] if item["id"] == item_id), None)
            path = segment_path(output_root, data["id"], segment["id"]) if segment and segment["media"] else None
        elif kind == "reference":
            character = next((item for item in data["characters"] if item["id"] == item_id), None)
            path = (reference_path(output_root, data["id"], character["id"])
                    if character and character["reference"] else None)
        elif kind == "export":
            path = export_path(output_root, data["id"]) if data["export"] else None
        else:
            raise PodcastError("podcast_media_not_found")
        if path is None or _safe_file(path) is None:
            raise PodcastError("podcast_media_not_found")
        return path
