"""Bound H3 RGB responses while retaining one continuous output clip."""

from __future__ import annotations

import base64
import binascii
from dataclasses import dataclass

MAX_RGB_BYTES = 768 * 1024 * 1024


def windows(frames: int, width: int, height: int) -> list[tuple[int, int, int]]:
    """Return (requested frames, skipped boundary frames, retained frames)."""
    if any(type(value) is not int or value <= 0 for value in (frames, width, height)):
        raise ValueError("invalid_h3_transport_geometry")
    if frames % 17 != 5:
        raise ValueError("invalid_h3_transport_geometry")
    maximum = MAX_RGB_BYTES // (width * height * 3)
    maximum -= (maximum - 5) % 17
    if maximum < 5:
        raise ValueError("h3_canvas_exceeds_transport_limit")
    plan = []
    remaining = frames
    while remaining:
        skip = int(bool(plan))
        retained = min(remaining, maximum - skip)
        requested = retained + skip
        requested += (5 - requested) % 17
        plan.append((requested, skip, retained))
        remaining -= retained
    return plan


@dataclass
class Media:
    width: int
    height: int
    frames: int
    fps: int
    rgb: bytes
    audio: bytes | None
    sample_rate: int | None
    channels: int | None


def decode(event: dict) -> Media:
    if event.get("format") != "rgb8":
        raise RuntimeError(f"Unexpected video format from MLX-Serve: {event.get('format')!r}")
    try:
        width = int(event["width"])
        height = int(event["height"])
        frames = int(event["frames"])
        fps = int(event["fps"])
        rgb = base64.b64decode(event["data"], validate=True)
    except (KeyError, TypeError, ValueError, binascii.Error) as exc:
        raise RuntimeError("MLX-Serve returned malformed video frame data.") from exc
    expected = width * height * frames * 3
    if min(width, height, frames, fps) <= 0 or len(rgb) != expected:
        raise RuntimeError(f"MLX-Serve returned {len(rgb)} video bytes; expected {expected}.")
    audio = sample_rate = channels = None
    if event.get("audio_data") is not None:
        if event.get("audio_format") != "pcm_s16le":
            raise RuntimeError(f"Unexpected H3 audio format: {event.get('audio_format')!r}")
        try:
            audio = base64.b64decode(event["audio_data"], validate=True)
            sample_rate = int(event["audio_sample_rate"])
            channels = int(event["audio_channels"])
        except (KeyError, TypeError, ValueError, binascii.Error) as exc:
            raise RuntimeError("MLX-Serve returned malformed audio data.") from exc
        if sample_rate <= 0 or channels <= 0 or len(audio) % (2 * channels):
            raise RuntimeError("MLX-Serve returned invalid PCM audio dimensions.")
    return Media(width, height, frames, fps, rgb, audio, sample_rate, channels)
