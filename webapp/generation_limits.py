"""Supported request ranges for the installed generation models and recipes."""

from __future__ import annotations

import math
from copy import deepcopy

MUSIC3_MAX_SECONDS = 300
VIDEO_DURATIONS = {
    "h3": (5, 15),
    "h3-fasth3-vsa-q8": (5, 15),
    "ltx-2.3-distilled-q4": (1, 20),
    "ltx-2.3-distilled-q8": (1, 20),
    "ltx-2.3-dev-q4": (1, 20),
}
MUSIC_DURATIONS = {"music3": (1, MUSIC3_MAX_SECONDS), "yue2-3b-8bit": (5, 120)}
SAMPLING_LIMITS = {
    "video": {
        "h3": {
            "turbo": {"min": 4, "max": 8, "default": 4},
            "standard": {"min": 16, "max": 50, "default": 16},
        },
        "h3-fasth3-vsa-q8": {"min": 4, "max": 4, "default": 4, "fixed": True},
        "ltx-2.3-distilled-q4": {"min": 8, "max": 8, "default": 8, "fixed": True},
        "ltx-2.3-distilled-q8": {"min": 8, "max": 8, "default": 8, "fixed": True},
        "ltx-2.3-dev-q4": {"min": 1, "max": 50, "default": 30},
    },
    "music": {
        "music3": {"min": 1, "max": 30, "default": 30},
        "yue2-3b-8bit": {"automatic": True},
    },
}


def duration_range(model: str, kind: str = "video") -> tuple[int, int]:
    ranges = VIDEO_DURATIONS if kind == "video" else MUSIC_DURATIONS
    if not isinstance(model, str) or model not in ranges:
        raise ValueError("invalid_generation_model")
    return ranges[model]


def validate_duration(value: object, model: str, kind: str = "video") -> float:
    minimum, maximum = duration_range(model, kind)
    if isinstance(value, bool):
        raise ValueError("invalid_duration")
    try:
        duration = float(value)
    except (TypeError, ValueError, OverflowError) as exc:
        raise ValueError("invalid_duration") from exc
    if not math.isfinite(duration) or not minimum <= duration <= maximum:
        raise ValueError("invalid_duration")
    return duration


def sampling_range(model: str, kind: str = "video", turbo: bool = True) -> dict:
    if not isinstance(model, str) or model not in SAMPLING_LIMITS[kind]:
        raise ValueError("invalid_generation_model")
    limits = SAMPLING_LIMITS[kind][model]
    return limits["turbo" if turbo else "standard"] if model == "h3" else limits


def validate_steps(value: object, model: str, kind: str = "video", turbo: bool = True) -> int:
    limits = sampling_range(model, kind, turbo)
    if isinstance(value, bool) or isinstance(value, float) and not value.is_integer():
        raise ValueError("invalid_steps")
    try:
        steps = int(value)
    except (TypeError, ValueError, OverflowError) as exc:
        raise ValueError("invalid_steps") from exc
    if limits.get("automatic"):
        limits = {"min": 1, "max": 30}
    if not limits["min"] <= steps <= limits["max"] or (
        kind == "video" and model not in {"h3", "ltx-2.3-dev-q4"} and not turbo
    ):
        error = "invalid_fasth3_steps" if model == "h3-fasth3-vsa-q8" else (
            "invalid_distilled_steps" if model.startswith("ltx-") else "invalid_steps"
        )
        raise ValueError(error)
    return steps


def validate_negative_prompt(value: object, model: str | None = None) -> str:
    if not isinstance(value, str) or len(value) > 4000:
        raise ValueError("invalid_negative_prompt")
    if value.strip() and model is not None and model != "ltx-2.3-dev-q4":
        raise ValueError("negative_prompt_unsupported")
    return value.strip()


def capabilities() -> dict:
    durations = {
        kind: {
            model: {"min": minimum, "max": maximum, "step": 1}
            for model, (minimum, maximum) in ranges.items()
        }
        for kind, ranges in (("video", VIDEO_DURATIONS), ("music", MUSIC_DURATIONS))
    }
    durations["music"]["yue2-3b-8bit"] = {"automatic": True}
    return {"duration_limits": durations, "sampling_limits": deepcopy(SAMPLING_LIMITS),
            "negative_prompt_models": ["ltx-2.3-dev-q4"]}
