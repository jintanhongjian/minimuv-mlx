"""Private review drafts, not installed or approved Skill packages."""

from __future__ import annotations

import contextlib
import fcntl
import hashlib
import os
import stat
import tempfile
import threading
import time
import uuid
from pathlib import Path

from . import skill_conversion as skills

DRAFT_ROOT = Path.home() / "Library" / "Application Support" / "MiniMuv" / "skill-drafts"
MAX_DRAFTS = 100
MAX_DRAFT_BYTES = 2 * 1024 * 1024
MAX_TOTAL_BYTES = 64 * 1024 * 1024
_lock = threading.RLock()


def _identity(value: object) -> str:
    if not isinstance(value, str):
        raise skills.SkillError("invalid_skill_draft_id")
    try:
        if str(uuid.UUID(value)) != value:
            raise ValueError
    except ValueError as exc:
        raise skills.SkillError("invalid_skill_draft_id") from exc
    return value


def _directory() -> None:
    for path in reversed((DRAFT_ROOT, *DRAFT_ROOT.parents)):
        if path.is_symlink():
            raise skills.SkillError("unsafe_skill_draft_directory", 500)
    DRAFT_ROOT.mkdir(parents=True, exist_ok=True, mode=0o700)
    if not DRAFT_ROOT.is_dir():
        raise skills.SkillError("unsafe_skill_draft_directory", 500)
    DRAFT_ROOT.chmod(0o700)


@contextlib.contextmanager
def _transaction():
    with _lock:
        descriptor = None
        try:
            _directory()
            descriptor = os.open(
                DRAFT_ROOT / ".lock", os.O_CREAT | os.O_RDWR | os.O_NOFOLLOW | os.O_NONBLOCK, 0o600,
            )
            if not stat.S_ISREG(os.fstat(descriptor).st_mode):
                raise skills.SkillError("unsafe_skill_draft_lock", 500)
            try:
                fcntl.flock(descriptor, fcntl.LOCK_EX | fcntl.LOCK_NB)
            except BlockingIOError as exc:
                raise skills.SkillError("skill_draft_storage_busy", 409) from exc
            yield
        except OSError as exc:
            raise skills.SkillError("skill_draft_storage_failed", 500) from exc
        finally:
            if descriptor is not None:
                os.close(descriptor)


def _paths() -> list[Path]:
    paths = []
    for path in DRAFT_ROOT.iterdir():
        if path.name in {".lock"} or path.name.startswith(".draft-"):
            continue
        if path.suffix != ".json":
            raise skills.SkillError("unexpected_skill_draft_file", 500)
        _identity(path.stem)
        paths.append(path)
    return paths


def _read(path: Path) -> tuple[dict, str, int]:
    try:
        descriptor = os.open(path, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    except FileNotFoundError as exc:
        raise skills.SkillError("skill_draft_not_found", 404) from exc
    with os.fdopen(descriptor, "rb") as handle:
        if not stat.S_ISREG(os.fstat(handle.fileno()).st_mode):
            raise skills.SkillError("unsafe_skill_draft_file", 500)
        data = handle.read(MAX_DRAFT_BYTES + 1)
    if len(data) > MAX_DRAFT_BYTES:
        raise skills.SkillError("skill_draft_too_large", 500)
    try:
        draft = skills.parse_json(data)
        skills._keys(draft, {"version", "id", "name", "created_at", "updated_at", "record", "record_sha256", "result_text"})
        if type(draft["version"]) is not int or draft["version"] != 1 or draft["id"] != path.stem:
            raise ValueError("invalid_draft_identity")
        _name(draft["name"])
        _result_text(draft["result_text"])
        for field in ("created_at", "updated_at"):
            if type(draft[field]) not in {float, int} or not 0 < draft[field] < 1e12:
                raise ValueError("invalid_draft_time")
        if skills.digest(draft["record"]) != draft["record_sha256"]:
            raise ValueError("record_hash_mismatch")
        _verify_record(draft["record"])
    except (skills.SkillError, ValueError, KeyError, TypeError) as exc:
        raise skills.SkillError("skill_draft_corrupt", 500) from exc
    return draft, hashlib.sha256(data).hexdigest(), len(data)


def _verify_record(record: dict) -> None:
    if not isinstance(record, dict):
        raise ValueError("invalid_record")
    skills._keys(record, {
        "request", "source", "source_sha256", "review", "model", "text_settings",
        "capabilities", "system", "schema", "contract_sha256",
    })
    source = record["source"]
    normalized = skills.normalize_source({
        "origin": source["origin"], "revision": source["revision"],
        "files": [{k: item[k] for k in ("path", "content")} for item in source["files"]],
    }, record["schema"])
    if source != normalized or skills.digest(source) != record["source_sha256"]:
        raise ValueError("source_mismatch")
    if skills._schema_findings(record["request"], record["schema"], "request"):
        raise ValueError("request_mismatch")
    context = record["request"]["trusted_context"]
    if (
        context["source_snapshot_id"] != skills.digest({"source": source, "review": record["review"]})
        or context["capability_snapshot_id"] != skills.digest(record["capabilities"])
        or context["allowed_bindings"] != record["capabilities"]["allowed_bindings"]
        or context["license_status"] != record["review"]["status"]
        or context["license_obligations"] != record["review"]["obligations"]
        or record["request"]["source_material"]["files"] != source["files"]
        or skills.digest({"schema": record["schema"], "system": record["system"]}) != record["contract_sha256"]
    ):
        raise ValueError("snapshot_mismatch")
    if not isinstance(record["model"], str) or not record["model"].strip() or len(record["model"]) > 200:
        raise ValueError("invalid_model")
    if not isinstance(record["text_settings"], dict):
        raise ValueError("invalid_text_settings")


def _name(value: object) -> str:
    if not isinstance(value, str) or not value.strip() or len(value) > 120 or "\x00" in value:
        raise skills.SkillError("invalid_skill_draft_name")
    return value.strip()


def _result_text(value: object) -> str:
    if not isinstance(value, str) or "\x00" in value:
        raise skills.SkillError("invalid_skill_draft_result")
    try:
        if len(value.encode("utf-8")) > skills.MAX_REQUEST_BYTES:
            raise skills.SkillError("skill_draft_result_too_large", 413)
    except UnicodeError as exc:
        raise skills.SkillError("invalid_skill_draft_result") from exc
    return value


def _public(draft: dict, revision: str, *, full: bool = True) -> dict:
    result = {
        "id": draft["id"], "name": draft["name"], "created_at": draft["created_at"],
        "updated_at": draft["updated_at"], "revision": revision,
        "model": draft["record"]["model"], "source_sha256": draft["record"]["source_sha256"],
        "validation_state": "pending", "review_required": False, "installable": False,
    }
    if full:
        result.update(
            source=draft["record"]["source"], result_text=draft["result_text"],
            request=draft["record"]["request"], license_review=draft["record"]["review"],
        )
    return result


def list_drafts() -> list[dict]:
    with _transaction():
        items = [_public(draft, revision, full=False) for draft, revision, _ in
                 (_read(path) for path in _paths())]
    return sorted(items, key=lambda item: item["updated_at"], reverse=True)


def load(draft_id: object) -> tuple[dict, dict]:
    key = _identity(draft_id)
    with _transaction():
        draft, revision, _ = _read(DRAFT_ROOT / f"{key}.json")
    return _public(draft, revision), draft["record"]


def save(payload: dict) -> dict:
    skills._keys(payload, {"id", "revision", "name", "request_id", "result_text"})
    record = skills.STORE.get(payload["request_id"])
    _verify_record(record)
    name = _name(payload["name"])
    result_text = _result_text(payload["result_text"])
    key = str(uuid.uuid4()) if payload["id"] is None else _identity(payload["id"])
    with _transaction():
        paths = _paths()
        sizes = [_read(path)[2] for path in paths]
        now = time.time()
        previous_size = 0
        created = now
        if payload["id"] is None:
            if payload["revision"] is not None:
                raise skills.SkillError("invalid_skill_draft_revision")
            if len(paths) >= MAX_DRAFTS:
                raise skills.SkillError("skill_draft_capacity_reached", 409)
        else:
            previous, revision, previous_size = _read(DRAFT_ROOT / f"{key}.json")
            if payload["revision"] != revision:
                raise skills.SkillError("skill_draft_changed", 409)
            created = previous["created_at"]
        draft = {
            "version": 1, "id": key, "name": name, "created_at": created, "updated_at": now,
            "record": record, "result_text": result_text,
            "record_sha256": skills.digest(record),
        }
        data = skills.encoded(draft)
        if len(data) > MAX_DRAFT_BYTES or sum(sizes) - previous_size + len(data) > MAX_TOTAL_BYTES:
            raise skills.SkillError("skill_draft_storage_budget_exceeded", 413)
        temporary = None
        try:
            descriptor, filename = tempfile.mkstemp(prefix=".draft-", suffix=".tmp", dir=DRAFT_ROOT)
            temporary = Path(filename)
            with os.fdopen(descriptor, "wb") as handle:
                handle.write(data)
                handle.flush()
                os.fsync(handle.fileno())
            os.replace(temporary, DRAFT_ROOT / f"{key}.json")
            directory = os.open(DRAFT_ROOT, os.O_RDONLY)
            try:
                os.fsync(directory)
            finally:
                os.close(directory)
        finally:
            if temporary is not None:
                temporary.unlink(missing_ok=True)
    return _public(draft, hashlib.sha256(data).hexdigest())


def delete(draft_id: object, revision: object) -> None:
    key = _identity(draft_id)
    with _transaction():
        _, current, _ = _read(DRAFT_ROOT / f"{key}.json")
        if revision != current:
            raise skills.SkillError("skill_draft_changed", 409)
        (DRAFT_ROOT / f"{key}.json").unlink()
        directory = os.open(DRAFT_ROOT, os.O_RDONLY)
        try:
            os.fsync(directory)
        finally:
            os.close(directory)
