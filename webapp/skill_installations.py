"""Atomic, private knowledge packages. No third-party paths or code are executed."""

from __future__ import annotations

import contextlib
import copy
import fcntl
import hashlib
import os
import re
import stat
import tempfile
import threading
import time
import uuid
from collections.abc import Callable
from pathlib import Path

from . import skill_conversion as skills, skill_drafts

INSTALL_ROOT = Path.home() / "Library" / "Application Support" / "MiniMuv" / "skills"
MAX_PACKAGES = 100
MAX_PACKAGE_BYTES = 2 * 1024 * 1024
MAX_TOTAL_BYTES = 64 * 1024 * 1024
MAX_SELECTED = 4
CATEGORIES = ("video", "image", "music", "long-video", "mv")
REVIEW_FIELDS = {"execution", "capabilities", "fidelity", "contracts", "licensing"}
_lock = threading.RLock()


def _supported_categories(package: dict) -> list[str]:
    modes = {binding["mode"] for binding in package["bindings"]}
    return [category for category in CATEGORIES if category in modes]


def _validate_categories(value: object, package: dict) -> list[str]:
    if (
        not isinstance(value, list) or not 1 <= len(value) <= len(CATEGORIES)
        or any(not isinstance(category, str) or category not in _supported_categories(package) for category in value)
        or len(set(value)) != len(value)
    ):
        raise skills.SkillError("invalid_skill_categories")
    return [category for category in CATEGORIES if category in value]


def _categories(item: dict) -> list[str]:
    package = item["result"]["package"]
    return _validate_categories(item["categories"], package) if "categories" in item else _supported_categories(package)


def identity(value: object) -> str:
    if not isinstance(value, str):
        raise skills.SkillError("invalid_installed_skill_id")
    try:
        if str(uuid.UUID(value)) != value:
            raise ValueError
    except ValueError as exc:
        raise skills.SkillError("invalid_installed_skill_id") from exc
    return value


def selection(value: object) -> list[dict]:
    if not isinstance(value, list) or len(value) > MAX_SELECTED:
        raise skills.SkillError("invalid_skill_selection")
    seen = set()
    for item in value:
        if not isinstance(item, dict) or set(item) != {"id", "revision"}:
            raise skills.SkillError("invalid_skill_selection")
        key = identity(item["id"])
        revision = item["revision"]
        if key in seen or not isinstance(revision, str) or len(revision) != 64 or any(
            char not in "0123456789abcdef" for char in revision
        ):
            raise skills.SkillError("invalid_skill_selection")
        seen.add(key)
    return copy.deepcopy(value)


def validate_usage(value: object) -> list[dict]:
    """Historical attribution only; never grants approval, enablement or injection."""
    if not isinstance(value, list) or len(value) > MAX_SELECTED:
        raise ValueError("invalid_skill_usage")
    seen = set()
    for item in value:
        if not isinstance(item, dict) or set(item) != {"id", "name", "version", "candidate_sha256"}:
            raise ValueError("invalid_skill_usage")
        try:
            key = identity(item["id"])
        except skills.SkillError as exc:
            raise ValueError("invalid_skill_usage") from exc
        patterns = {"name": r"[a-z0-9]+(?:-[a-z0-9]+)*",
                    "version": r"(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)",
                    "candidate_sha256": r"[0-9a-f]{64}"}
        if key in seen or any(not isinstance(item[k], str) or len(item[k]) > (32 if k == "version" else 64) or
                              re.fullmatch(pattern, item[k]) is None for k, pattern in patterns.items()):
            raise ValueError("invalid_skill_usage")
        seen.add(key)
    return copy.deepcopy(value)


@contextlib.contextmanager
def _transaction():
    with _lock:
        descriptor = None
        try:
            for path in (INSTALL_ROOT, *INSTALL_ROOT.parents):
                if path.is_symlink():
                    raise skills.SkillError("unsafe_skill_install_directory", 500)
            INSTALL_ROOT.mkdir(parents=True, exist_ok=True, mode=0o700)
            INSTALL_ROOT.chmod(0o700)
            descriptor = os.open(
                INSTALL_ROOT / ".lock", os.O_CREAT | os.O_RDWR | os.O_NOFOLLOW | os.O_NONBLOCK, 0o600,
            )
            if not stat.S_ISREG(os.fstat(descriptor).st_mode):
                raise skills.SkillError("unsafe_skill_install_lock", 500)
            try:
                fcntl.flock(descriptor, fcntl.LOCK_EX | fcntl.LOCK_NB)
            except BlockingIOError as exc:
                raise skills.SkillError("skill_install_storage_busy", 409) from exc
            yield
        except OSError as exc:
            raise skills.SkillError("skill_install_storage_failed", 500) from exc
        finally:
            if descriptor is not None:
                os.close(descriptor)


def _paths() -> list[Path]:
    paths = []
    for path in INSTALL_ROOT.iterdir():
        if path.name == ".lock" or path.name.startswith(".install-"):
            continue
        if path.suffix != ".json":
            raise skills.SkillError("unexpected_skill_install_file", 500)
        identity(path.stem)
        paths.append(path)
        if len(paths) > MAX_PACKAGES:
            raise skills.SkillError("skill_install_capacity_reached", 409)
    return paths


def _read(key: str) -> tuple[dict, str, int]:
    try:
        descriptor = os.open(INSTALL_ROOT / f"{key}.json", os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    except FileNotFoundError as exc:
        raise skills.SkillError("installed_skill_not_found", 404) from exc
    with os.fdopen(descriptor, "rb") as handle:
        if not stat.S_ISREG(os.fstat(handle.fileno()).st_mode):
            raise skills.SkillError("unsafe_skill_install_file", 500)
        data = handle.read(MAX_PACKAGE_BYTES + 1)
    if len(data) > MAX_PACKAGE_BYTES:
        raise skills.SkillError("skill_install_too_large", 500)
    try:
        item = skills.parse_json(data)
        skills._keys(item, {"format", "id", "record", "result", "approval", "enabled", "updated_at"} |
                     ({"categories"} if "categories" in item else set()) |
                     ({"draft_id"} if "draft_id" in item else set()))
        if item["format"] != "minimuv-installed-skill/v1" or item["id"] != key or type(item["enabled"]) is not bool:
            raise ValueError("invalid_install_identity")
        if "draft_id" in item and item["draft_id"] is not None:
            skill_drafts._identity(item["draft_id"])
        skill_drafts._verify_record(item["record"])
        approval = item["approval"]
        automatic = approval.get("method") == "automatic-validation"
        skills._keys(approval, {"reviewer", "reviewed_at", "record_sha256", "result_sha256", "candidate_sha256"} |
                     ({"method"} if automatic else {"checks"}))
        if automatic:
            if approval["reviewer"] != "automatic-validation":
                raise ValueError("invalid_validation_method")
        else:
            _review(approval["reviewer"], approval["checks"])
        if (
            approval["record_sha256"] != skills.digest(item["record"])
            or approval["result_sha256"] != skills.digest(item["result"])
            or approval["candidate_sha256"] != skills.digest(item["result"]["package"])
            or item["result"]["status"] != "draft"
        ):
            raise ValueError("approval_hash_mismatch")
        validation = skills.validate_result(item["record"], item["result"], None)
        if not validation["valid"]:
            raise ValueError("invalid_installed_candidate")
        _categories(item)
        for value in (approval["reviewed_at"], item["updated_at"]):
            if type(value) not in {int, float} or not 0 < value < 1e12:
                raise ValueError("invalid_install_time")
    except (skills.SkillError, KeyError, ValueError, TypeError) as exc:
        raise skills.SkillError("installed_skill_corrupt", 500) from exc
    return item, hashlib.sha256(data).hexdigest(), len(data)


def _review(reviewer: object, checks: object) -> None:
    if not isinstance(reviewer, str) or not reviewer.strip() or len(reviewer) > 120 or "\x00" in reviewer:
        raise skills.SkillError("invalid_skill_reviewer")
    if not isinstance(checks, dict) or set(checks) != REVIEW_FIELDS or any(v is not True for v in checks.values()):
        raise skills.SkillError("skill_human_review_required", 409)


def _sync() -> None:
    descriptor = os.open(INSTALL_ROOT, os.O_RDONLY | os.O_NOFOLLOW)
    try:
        os.fsync(descriptor)
    finally:
        os.close(descriptor)


def _write(item: dict) -> str:
    data = skills.encoded(item)
    sizes = {p.stem: _read(p.stem)[2] for p in _paths()}
    if len(data) > MAX_PACKAGE_BYTES or sum(sizes.values()) - sizes.get(item["id"], 0) + len(data) > MAX_TOTAL_BYTES:
        raise skills.SkillError("skill_install_budget_exceeded", 413)
    temporary = None
    try:
        descriptor, filename = tempfile.mkstemp(prefix=".install-", suffix=".tmp", dir=INSTALL_ROOT)
        temporary = Path(filename)
        with os.fdopen(descriptor, "wb") as handle:
            handle.write(data)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, INSTALL_ROOT / f"{item['id']}.json")
        _sync()
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)
    return hashlib.sha256(data).hexdigest()


def _public(item: dict, revision: str, capabilities: dict, text: dict) -> dict:
    reason = ""
    try:
        skills.check_record_current(item["record"], capabilities, text)
    except skills.SkillError as exc:
        if str(exc) != "skill_snapshot_changed":
            raise
        reason = str(exc)
    package = item["result"]["package"]
    return {
        "id": item["id"], "revision": revision, "name": package["name"], "version": package["version"],
        "description": package["description"], "enabled": item["enabled"], "available": not reason,
        "unavailable_reason": reason, "candidate_sha256": item["approval"]["candidate_sha256"],
        "reviewer": item["approval"]["reviewer"], "reviewed_at": item["approval"]["reviewed_at"],
        "bindings": [{k: b[k] for k in ("task", "mode", "target_models")} for b in package["bindings"]],
        "categories": _categories(item), "supported_categories": _supported_categories(package),
        "draft_id": item.get("draft_id"),
    }


def list_installed(capabilities: dict, text: dict) -> list[dict]:
    with _transaction():
        return [_public(item, revision, capabilities, text) for item, revision, _ in
                (_read(p.stem) for p in sorted(_paths()))]


def install(record: dict, result: dict, payload: dict, capabilities: dict, text: dict,
            count_tokens: Callable[[str, str], int]) -> dict:
    legacy_review = "reviewer" in payload or "checks" in payload
    if legacy_review:
        _review(payload.get("reviewer"), payload.get("checks"))
    skill_drafts._verify_record(record)
    validation = skills.validate_result(record, result, count_tokens)
    if not validation["valid"] or result.get("status") != "draft":
        raise skills.SkillError("skill_candidate_invalid", 422, validation["findings"])
    if payload["candidate_sha256"] != validation["candidate_sha256"]:
        raise skills.SkillError("skill_candidate_changed", 409)
    with _transaction():
        skills.check_record_current(record, capabilities, text)
        existing = [_read(p.stem)[0] for p in _paths()]
        package = result["package"]
        categories = _validate_categories(payload.get("categories", _supported_categories(package)), package)
        if any((i["result"]["package"]["name"], i["result"]["package"]["version"]) ==
               (package["name"], package["version"]) for i in existing):
            raise skills.SkillError("skill_version_already_installed", 409)
        if len(existing) >= MAX_PACKAGES:
            raise skills.SkillError("skill_install_capacity_reached", 409)
        now = time.time()
        item = {
            "format": "minimuv-installed-skill/v1", "id": str(uuid.uuid4()),
            "record": copy.deepcopy(record), "result": copy.deepcopy(result),
            "approval": {
                "reviewer": payload["reviewer"].strip() if legacy_review else "automatic-validation",
                "reviewed_at": now,
                **({"checks": payload["checks"]} if legacy_review else {"method": "automatic-validation"}),
                "record_sha256": skills.digest(record), "result_sha256": skills.digest(result),
                "candidate_sha256": skills.digest(package),
            },
            "enabled": False, "updated_at": now, "categories": categories,
        }
        public = _public(item, "", capabilities, text)
        public["revision"] = _write(item)
        return public


def apply_draft(draft_id: object, record: dict, result: dict, payload: dict, capabilities: dict, text: dict,
                count_tokens: Callable[[str, str], int]) -> dict:
    """Publish or CAS-update one installed preset owned by a saved draft."""
    draft_key = skill_drafts._identity(draft_id)
    published_id = payload.get("published_id")
    published_revision = payload.get("published_revision")
    if (published_id is None) != (published_revision is None):
        raise skills.SkillError("invalid_skill_fields")
    if published_id is not None:
        published_id = identity(published_id)
        if not isinstance(published_revision, str) or re.fullmatch(r"[0-9a-f]{64}", published_revision) is None:
            raise skills.SkillError("invalid_skill_fields")

    skill_drafts._verify_record(record)
    validation = skills.validate_result(record, result, count_tokens)
    if not validation["valid"] or result.get("status") != "draft":
        raise skills.SkillError("skill_candidate_invalid", 422, validation["findings"])

    with _transaction():
        skills.check_record_current(record, capabilities, text)
        current_items = [_read(path.stem) for path in sorted(_paths())]
        by_id = {item["id"]: (item, revision) for item, revision, _ in current_items}
        owned = [(item, revision) for item, revision, _ in current_items if item.get("draft_id") == draft_key]
        if published_id is None:
            if owned:
                raise skills.SkillError("skill_preset_changed", 409)
            previous = None
        else:
            previous = by_id.get(published_id)
            if (
                previous is None or previous[1] != published_revision
                or previous[0].get("draft_id") != draft_key
                or len(owned) != 1 or owned[0][0]["id"] != published_id
            ):
                raise skills.SkillError("skill_preset_changed", 409)

        package = result["package"]
        if any(
            item["id"] != (previous[0]["id"] if previous else None)
            and (item["result"]["package"]["name"], item["result"]["package"]["version"])
            == (package["name"], package["version"])
            for item, _, _ in current_items
        ):
            raise skills.SkillError("skill_version_already_installed", 409)
        if previous is None and len(current_items) >= MAX_PACKAGES:
            raise skills.SkillError("skill_install_capacity_reached", 409)

        if "categories" in payload:
            categories = _validate_categories(payload["categories"], package)
        elif previous is not None:
            try:
                categories = _validate_categories(previous[0].get("categories", _supported_categories(
                    previous[0]["result"]["package"],
                )), package)
            except skills.SkillError:
                categories = _supported_categories(package)
        else:
            categories = _supported_categories(package)

        now = time.time()
        item = {
            "format": "minimuv-installed-skill/v1",
            "id": previous[0]["id"] if previous else str(uuid.uuid4()),
            "record": copy.deepcopy(record),
            "result": copy.deepcopy(result),
            "approval": {
                "reviewer": "automatic-validation", "reviewed_at": now, "method": "automatic-validation",
                "record_sha256": skills.digest(record), "result_sha256": skills.digest(result),
                "candidate_sha256": skills.digest(package),
            },
            "enabled": True, "updated_at": now, "categories": categories, "draft_id": draft_key,
        }
        public = _public(item, "", capabilities, text)
        public["revision"] = _write(item)
        return public


def load(key: object, revision: object) -> dict:
    with _transaction():
        item, current, _ = _read(identity(key))
        if revision != current:
            raise skills.SkillError("installed_skill_changed", 409)
        return item


def set_enabled(key: object, revision: object, enabled: object, capabilities: dict, text: dict) -> dict:
    if type(enabled) is not bool:
        raise skills.SkillError("invalid_skill_enabled")
    with _transaction():
        item, current, _ = _read(identity(key))
        if revision != current:
            raise skills.SkillError("installed_skill_changed", 409)
        if enabled:
            skills.check_record_current(item["record"], capabilities, text)
        item["enabled"] = enabled
        item["updated_at"] = time.time()
        public = _public(item, "", capabilities, text)
        public["revision"] = _write(item)
        return public


def delete(key: object, revision: object) -> None:
    with _transaction():
        item, current, _ = _read(identity(key))
        if revision != current:
            raise skills.SkillError("installed_skill_changed", 409)
        if item["enabled"]:
            raise skills.SkillError("disable_skill_before_deleting", 409)
        (INSTALL_ROOT / f"{item['id']}.json").unlink()
        _sync()


def set_categories(key: object, revision: object, categories: object, capabilities: dict, text: dict) -> dict:
    with _transaction():
        item, current, _ = _read(identity(key))
        if revision != current:
            raise skills.SkillError("installed_skill_changed", 409)
        item["categories"] = _validate_categories(categories, item["result"]["package"])
        item["updated_at"] = time.time()
        public = _public(item, "", capabilities, text)
        public["revision"] = _write(item)
        return public


def resolve(refs: object, task: str, mode: str, target: str, capabilities: dict, text: dict) -> tuple[list[str], list[dict]]:
    instructions, usage = [], []
    with _transaction():
        for ref in selection(refs):
            item, revision, _ = _read(ref["id"])
            if revision != ref["revision"]:
                raise skills.SkillError("installed_skill_changed", 409)
            if not item["enabled"]:
                raise skills.SkillError("skill_not_enabled", 409)
            if mode not in _categories(item):
                raise skills.SkillError("skill_category_mismatch", 409)
            skills.check_record_current(item["record"], capabilities, text)
            package = item["result"]["package"]
            binding = next((b for b in package["bindings"] if b["task"] == task and b["mode"] == mode and
                            (b["target_models"] == ["*"] or target in b["target_models"])), None)
            if binding is None:
                raise skills.SkillError("skill_binding_mismatch", 409)
            instructions.append(binding["instructions"])
            usage.append({"id": item["id"], "name": package["name"], "version": package["version"],
                          "candidate_sha256": item["approval"]["candidate_sha256"]})
    return instructions, usage
