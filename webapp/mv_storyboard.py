"""Music-bound frame planning and original-audio MV assembly."""

from __future__ import annotations

import hashlib
import json
import math
import os
import subprocess
import tempfile
import uuid
from pathlib import Path

from . import generation_limits, mv_music

FPS = 24
MAX_SHOTS = 48


def source_digest(path: Path) -> str:
    if path.is_symlink() or not path.is_file():
        raise ValueError("mv_music_source_invalid")
    mv_music.inspect_wav(path)
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def plan(analysis: dict, model: str, start: object, end: object, shot_seconds: object) -> list[dict]:
    minimum, maximum = generation_limits.duration_range(model)
    if any(type(value) not in (int, float) or not math.isfinite(value)
           for value in (start, end, shot_seconds)):
        raise ValueError("invalid_mv_timing")
    if not 0 <= start < end <= analysis["duration"] or not minimum <= shot_seconds <= maximum:
        raise ValueError("invalid_mv_timing")
    first, last = round(start * FPS), round(end * FPS)
    if last <= first or last > math.floor(analysis["duration"] * FPS):
        raise ValueError("invalid_mv_timing")
    if not analysis["beats"]:
        raise ValueError("mv_beats_required")
    beats = sorted({round(value * FPS) for value in analysis["beats"]})
    downbeats = sorted({round(value * FPS) for value in analysis["downbeats"]})
    target = round(shot_seconds * FPS)
    intervals = []
    cursor = first
    while cursor < last:
        limit = min(last, cursor + maximum * FPS)
        if last - cursor <= target:
            boundary = last
        else:
            desired = min(cursor + target, limit)
            lower = cursor + max(1, target // 2)
            upper = min(limit, desired + target // 3)
            candidates = [frame for frame in downbeats if lower <= frame <= upper]
            if not candidates:
                candidates = [frame for frame in beats if lower <= frame <= upper]
            if not candidates:
                raise ValueError("mv_beat_gap_too_long")
            boundary = min(candidates, key=lambda frame: (abs(frame - desired), frame))
        length = boundary - cursor
        intervals.append({"start_frame": cursor, "end_frame": boundary,
                          "duration": max(minimum, math.ceil(length / FPS))})
        if len(intervals) > MAX_SHOTS:
            raise ValueError("mv_too_many_shots")
        cursor = boundary
    return intervals


def validate_timeline(manifest: dict) -> dict:
    timeline = manifest.get("mv_timeline")
    if not isinstance(timeline, dict) or set(timeline) != {
        "version", "fps", "project_id", "project_revision", "audio_sha256",
        "analysis_sha256", "start_frame", "end_frame", "clips",
    }:
        raise ValueError("invalid_mv_timeline")
    if (type(timeline["version"]) is not int or timeline["version"] != 1
            or type(timeline["fps"]) is not int or timeline["fps"] != FPS):
        raise ValueError("invalid_mv_timeline")
    try:
        if str(uuid.UUID(timeline["project_id"])) != timeline["project_id"]:
            raise ValueError("invalid_mv_timeline")
    except (TypeError, AttributeError, ValueError) as exc:
        raise ValueError("invalid_mv_timeline") from exc
    for key in ("project_revision", "audio_sha256", "analysis_sha256"):
        value = timeline[key]
        if not isinstance(value, str) or len(value) != 64 or any(c not in "0123456789abcdef" for c in value):
            raise ValueError("invalid_mv_timeline")
    first, last = timeline["start_frame"], timeline["end_frame"]
    if type(first) is not int or type(last) is not int or not 0 <= first < last <= 720 * FPS:
        raise ValueError("invalid_mv_timeline")
    clips, shots = timeline["clips"], manifest["shots"]
    if not isinstance(clips, list) or not 1 <= len(clips) == len(shots) <= MAX_SHOTS:
        raise ValueError("invalid_mv_timeline")
    cursor = first
    for index, (clip, shot) in enumerate(zip(clips, shots)):
        source = shot.get("first_frame_source", "image" if shot.get("first_frame_id") else "none")
        if (source not in {"none", "image", "previous"}
                or (source == "image") != bool(shot.get("first_frame_id"))
                or (source == "previous" and index == 0)
                or (source != "none" and manifest["model"] == "h3-fasth3-vsa-q8")):
            raise ValueError("invalid_first_frame")
        if (not isinstance(clip, dict) or set(clip) != {"shot_id", "start_frame", "end_frame"}
                or clip["shot_id"] != shot["id"] or type(clip["start_frame"]) is not int
                or type(clip["end_frame"]) is not int or clip["start_frame"] != cursor
                or not cursor < clip["end_frame"] <= last):
            raise ValueError("invalid_mv_timeline")
        duration = generation_limits.validate_duration(shot["duration"], manifest["model"])
        if clip["end_frame"] - cursor > round(duration * FPS):
            raise ValueError("mv_shot_too_short")
        cursor = clip["end_frame"]
    soundtrack = manifest["soundtrack"]
    total = manifest.get("total_duration")
    if (type(total) not in (int, float) or not math.isfinite(total)
            or cursor != last or manifest.get("shot_mode") != "independent"
            or soundtrack.get("mode") != "music3" or soundtrack.get("strategy") != "global"
            or not soundtrack.get("music_source_id") or soundtrack.get("mix") != "score"
            or soundtrack.get("burn_lyrics") is not False
            or abs(total - (last - first) / FPS) > 1e-8):
        raise ValueError("invalid_mv_timeline")
    return timeline


def check_source(manifest: dict) -> Path:
    timeline = validate_timeline(manifest)
    value = manifest["soundtrack"].get("music_source_path")
    if not isinstance(value, str) or not value:
        raise ValueError("mv_music_source_invalid")
    path = Path(value)
    if source_digest(path) != timeline["audio_sha256"]:
        raise ValueError("mv_music_source_changed")
    return path


def prepare_shot(
    manifest: dict, index: int, video: Path, directory: Path,
    canvas: tuple[int, int], ffmpeg: str | None, ffprobe: str | None,
) -> Path:
    """Publish an exact-duration shot preview with only its original song interval."""
    if not ffmpeg or not ffprobe:
        raise RuntimeError("ffmpeg_and_ffprobe_required")
    timeline = validate_timeline(manifest)
    clip = timeline["clips"][index]
    preview = {
        **manifest, "shots": [{**manifest["shots"][index], "first_frame_source": "none", "first_frame_id": ""}],
        "mv_timeline": {**timeline, "clips": [clip],
                        "start_frame": clip["start_frame"], "end_frame": clip["end_frame"]},
        "total_duration": (clip["end_frame"] - clip["start_frame"]) / FPS,
    }
    with tempfile.TemporaryDirectory(prefix=".mv-shot-", dir=directory) as temporary:
        result = assemble(preview, [video], Path(temporary), canvas, ffmpeg, ffprobe)
        destination = directory / f"mv-shot-{uuid.uuid4()}.mp4"
        os.replace(result, destination)
        os.chmod(destination, 0o600)
        return destination


def _probe(path: Path, ffprobe: str, *, count_frames: bool = False) -> dict:
    command = [ffprobe, "-v", "error"]
    if count_frames:
        command.append("-count_frames")
    command += ["-show_entries", "stream=codec_type,duration,nb_read_frames:format=duration",
                "-of", "json", str(path)]
    result = subprocess.run(command, capture_output=True, text=True, timeout=120)
    if result.returncode:
        raise RuntimeError(f"mv_media_probe_failed: {result.stderr[-1000:]}")
    try:
        data = json.loads(result.stdout)
        if not isinstance(data.get("streams"), list):
            raise ValueError("missing_streams")
        return data
    except (ValueError, TypeError, AttributeError) as exc:
        raise RuntimeError("mv_media_probe_invalid") from exc


def assemble(
    manifest: dict, paths: list[Path], directory: Path, canvas: tuple[int, int],
    ffmpeg: str, ffprobe: str,
) -> Path:
    timeline = validate_timeline(manifest)
    source = check_source(manifest)
    if len(paths) != len(timeline["clips"]):
        raise ValueError("workflow_shot_media_missing")
    width, height = canvas
    inputs, filters, labels = [], [], []
    for index, (path, clip) in enumerate(zip(paths, timeline["clips"])):
        if path.is_symlink() or not path.is_file():
            raise ValueError("workflow_shot_media_missing")
        frames = clip["end_frame"] - clip["start_frame"]
        probe = _probe(path, ffprobe)
        videos = [stream for stream in probe["streams"] if stream.get("codec_type") == "video"]
        try:
            duration = float(videos[0].get("duration", probe.get("format", {}).get("duration", 0)))
        except (IndexError, TypeError, ValueError) as exc:
            raise RuntimeError("mv_shot_media_invalid") from exc
        if not math.isfinite(duration) or duration + 1 / FPS < frames / FPS:
            raise RuntimeError("mv_shot_media_too_short")
        inputs += ["-i", str(path)]
        filters.append(
            f"[{index}:v:0]scale={width}:{height}:force_original_aspect_ratio=decrease,"
            f"pad={width}:{height}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps={FPS},"
            f"trim=end_frame={frames},setpts=N/({FPS}*TB),format=yuv420p[v{index}]"
        )
        labels.append(f"[v{index}]")
    filters.append("".join(labels) + f"concat=n={len(paths)}:v=1:a=0[vout]")
    inputs += ["-i", str(source)]
    # 48 kHz is exactly 2000 samples per timeline frame; cut the song only once.
    first, last = timeline["start_frame"] * 2000, timeline["end_frame"] * 2000
    filters.append(f"[{len(paths)}:a:0]aresample=48000,atrim=start_sample={first}:"
                   f"end_sample={last},asetpts=PTS-STARTPTS[aout]")
    temporary = directory / f".mv-{uuid.uuid4()}.mp4"
    output = directory / "final.mp4"
    expected = timeline["end_frame"] - timeline["start_frame"]
    try:
        result = subprocess.run(
            [ffmpeg, "-nostdin", "-y", "-loglevel", "error", *inputs,
             "-filter_complex", ";".join(filters), "-map", "[vout]", "-map", "[aout]",
             "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p",
             "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(temporary)],
            capture_output=True, text=True, timeout=7200,
        )
        if result.returncode:
            raise RuntimeError(f"mv_assembly_failed: {result.stderr[-2000:]}")
        result_data = _probe(temporary, ffprobe, count_frames=True)
        video = [stream for stream in result_data["streams"] if stream.get("codec_type") == "video"]
        audio = [stream for stream in result_data["streams"] if stream.get("codec_type") == "audio"]
        try:
            valid = (len(video) == len(audio) == 1
                     and int(video[0]["nb_read_frames"]) == expected
                     and abs(float(audio[0]["duration"]) - expected / FPS) <= 1 / FPS)
        except (KeyError, TypeError, ValueError) as exc:
            raise RuntimeError("mv_output_invalid") from exc
        if not valid:
            raise RuntimeError("mv_output_timing_mismatch")
        check_source(manifest)
        os.replace(temporary, output)
        return output
    finally:
        temporary.unlink(missing_ok=True)
