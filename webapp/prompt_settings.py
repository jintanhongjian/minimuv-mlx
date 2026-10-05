"""Validated, live-loaded system prompt configuration for local text requests."""

from __future__ import annotations

import hashlib
import json
import os
import tempfile
import threading
from pathlib import Path

DEFAULTS_PATH = Path(__file__).with_name("system_prompts.json")
SETTINGS_PATH = Path(__file__).resolve().parents[1] / "system_prompts.json"
MAX_BYTES = 48 * 1024
MAX_FIELD_LENGTH = 6000
PROFILE_FIELDS = {
    "enhancement": ("role", "task", "rules", "output"),
    "video": ("task",),
    "image": ("task",),
    "music": ("task",),
    "storyboard": ("role", "task", "rules", "output"),
}
_lock = threading.RLock()


class PromptConflict(RuntimeError):
    pass


def validate(payload: object) -> dict:
    if not isinstance(payload, dict) or set(payload) != {"version", "profiles"}:
        raise ValueError("invalid_prompt_config")
    if type(payload["version"]) is not int or payload["version"] != 1:
        raise ValueError("invalid_prompt_version")
    profiles = payload["profiles"]
    if not isinstance(profiles, dict) or set(profiles) != set(PROFILE_FIELDS):
        raise ValueError("invalid_prompt_profiles")
    result = {"version": 1, "profiles": {}}
    for name, fields in PROFILE_FIELDS.items():
        profile = profiles[name]
        if not isinstance(profile, dict) or set(profile) != set(fields):
            raise ValueError(f"invalid_prompt_fields: {name}")
        result["profiles"][name] = {}
        for field in fields:
            value = profile[field]
            if not isinstance(value, str) or not value.strip() or len(value) > MAX_FIELD_LENGTH:
                raise ValueError(f"invalid_prompt_text: {name}.{field}")
            if "\x00" in value:
                raise ValueError(f"invalid_prompt_text: {name}.{field}")
            if "{shot_count}" in value and (name, field) != ("storyboard", "task"):
                raise ValueError("shot_count_only_in_storyboard_task")
            result["profiles"][name][field] = value.strip()
    if result["profiles"]["storyboard"]["task"].count("{shot_count}") != 1:
        raise ValueError("storyboard_task_requires_shot_count")
    if len(_encode(result)) > MAX_BYTES:
        raise ValueError("prompt_config_too_large")
    return result


def _encode(config: dict) -> bytes:
    return (json.dumps(config, ensure_ascii=False, indent=2) + "\n").encode("utf-8")


def _read(path: Path) -> tuple[dict, bytes]:
    try:
        with path.open("rb") as stream:
            data = stream.read(MAX_BYTES + 1)
        if len(data) > MAX_BYTES:
            raise ValueError("prompt_config_too_large")
        return validate(json.loads(data)), data
    except (OSError, UnicodeError, ValueError) as exc:
        raise RuntimeError(f"prompt_settings_unavailable: {path.name}: {exc}") from exc


def snapshot() -> dict:
    with _lock:
        defaults, default_bytes = _read(DEFAULTS_PATH)
        if SETTINGS_PATH.exists():
            config, data = _read(SETTINGS_PATH)
            revision = hashlib.sha256(data).hexdigest()
        else:
            config = defaults
            revision = "defaults:" + hashlib.sha256(default_bytes).hexdigest()
        return {"config": config, "defaults": defaults, "revision": revision}


def save(config: object, revision: str) -> dict:
    validated = validate(config)
    with _lock:
        current = snapshot()
        if revision != current["revision"]:
            raise PromptConflict("prompt_settings_changed")
        temporary = None
        try:
            fd, name = tempfile.mkstemp(prefix=".system-prompts-", suffix=".json", dir=SETTINGS_PATH.parent)
            temporary = Path(name)
            with os.fdopen(fd, "wb") as stream:
                stream.write(_encode(validated))
                stream.flush()
                os.fsync(stream.fileno())
            os.replace(temporary, SETTINGS_PATH)
        except OSError as exc:
            raise RuntimeError(f"prompt_settings_save_failed: {exc}") from exc
        finally:
            if temporary is not None:
                temporary.unlink(missing_ok=True)
        return snapshot()


def enhancement(mode: str) -> str:
    profiles = snapshot()["config"]["profiles"]
    if mode not in {"video", "image", "music"}:
        raise ValueError("invalid_generation_mode")
    return " ".join([*profiles["enhancement"].values(), profiles[mode]["task"]])


def storyboard(shot_count: int) -> str:
    if type(shot_count) is not int or not 1 <= shot_count <= 48:
        raise ValueError("invalid_shot_count")
    profile = snapshot()["config"]["profiles"]["storyboard"]
    return " ".join(profile[field].replace("{shot_count}", str(shot_count))
                    for field in PROFILE_FIELDS["storyboard"])
