"""Durable storyboard workflow manifests and FFmpeg assembly helpers."""

from __future__ import annotations

import json
import hashlib
import io
import math
import os
import shutil
import subprocess
import tempfile
import threading
import time
import uuid
from pathlib import Path
from webapp import generation_limits, local_models, output_storage, skill_installations

ASPECTS = {"16:9": (16, 9), "9:16": (9, 16), "1:1": (1, 1), "4:3": (4, 3), "3:4": (3, 4)}
MAX_SHOTS = 1800
MAX_WORKFLOW_SECONDS = 1800
STORYBOARD_BATCH_SHOTS = 12
ASSEMBLY_BATCH_SHOTS = 16
MUSIC3_MAX_SECONDS = generation_limits.MUSIC3_MAX_SECONDS
ACTIVE_STATUSES = {"queued", "running"}
TERMINAL_STATUSES = {"completed", "failed", "cancelled", "interrupted"}
_LIVE_WORKFLOWS: set[str] = set()
_LIVE_LOCK = threading.Lock()


def workflow_root(output_root: Path) -> Path:
    return output_root / "long-video"


def workflow_directory(output_root: Path, workflow_id: str) -> Path:
    try:
        normalized_id = str(uuid.UUID(workflow_id))
    except (TypeError, ValueError, AttributeError) as exc:
        raise ValueError("invalid_workflow_id") from exc
    directory = workflow_root(output_root) / normalized_id
    legacy = output_root / "workflows" / normalized_id
    return legacy if not directory.exists() and legacy.exists() else directory


def _manifest_path(output_root: Path, workflow_id: str) -> Path:
    return workflow_directory(output_root, workflow_id) / "workflow.json"


def _write_manifest(output_root: Path, manifest: dict) -> None:
    directory = workflow_directory(output_root, manifest["id"])
    directory.mkdir(parents=True, exist_ok=True)
    os.chmod(directory, 0o700)
    data = json.dumps(manifest, ensure_ascii=False, allow_nan=False, indent=2) + "\n"
    fd, temporary_path = tempfile.mkstemp(prefix=".workflow-", suffix=".json", dir=directory)
    try:
        os.fchmod(fd, 0o600)
        with os.fdopen(fd, "w", encoding="utf-8") as manifest_file:
            manifest_file.write(data)
            manifest_file.flush()
            os.fsync(manifest_file.fileno())
        os.replace(temporary_path, directory / "workflow.json")
    except Exception:
        Path(temporary_path).unlink(missing_ok=True)
        raise


def _source_duration(music_source: dict | None) -> float:
    if music_source is None:
        return 0.0
    try:
        value = float(music_source.get("duration") or 0)
    except (TypeError, ValueError):
        return 0.0
    return value if math.isfinite(value) and value > 0 else 0.0


def _validate_payload(payload: object, music_source_resolver=None) -> dict:
    if not isinstance(payload, dict):
        raise ValueError("invalid_request")
    model = payload.get("model", "h3")
    if not isinstance(model, str) or model not in {"h3", *local_models.LOCAL_VIDEO_MODELS}:
        raise ValueError("invalid_generation_model")
    quality = local_models.video_quality(payload.get("quality", "standard"))
    shot_mode = payload.get("shot_mode", "independent" if model == local_models.fast_h3.MODEL_ID else "continuous")
    if not isinstance(shot_mode, str) or shot_mode not in {"independent", "continuous"}:
        raise ValueError("invalid_shot_mode")
    if model == local_models.fast_h3.MODEL_ID and shot_mode != "independent":
        raise ValueError("fasth3_conditioning_unsupported")
    name = payload.get("name", "Untitled video")
    if not isinstance(name, str) or not name.strip() or len(name.strip()) > 120:
        raise ValueError("invalid_workflow_name")
    aspect = payload.get("aspect", "16:9")
    if not isinstance(aspect, str) or aspect not in ASPECTS:
        raise ValueError("invalid_aspect")
    raw_soundtrack = payload.get("soundtrack", {})
    if not isinstance(raw_soundtrack, dict):
        raise ValueError("invalid_soundtrack")
    mode = raw_soundtrack.get("mode", "music3")
    if not isinstance(mode, str) or mode not in {"music3", "none"}:
        raise ValueError("invalid_soundtrack_mode")
    strategy = raw_soundtrack.get(
        "strategy", "per_shot" if mode == "music3" else "none"
    )
    if not isinstance(strategy, str) or strategy not in {"per_shot", "global", "none"}:
        raise ValueError("invalid_soundtrack_strategy")
    if mode == "none" and strategy != "none":
        raise ValueError("invalid_soundtrack_strategy")
    if mode == "music3" and strategy == "none":
        raise ValueError("invalid_soundtrack_strategy")
    music_source_id = raw_soundtrack.get("music_source_id", "") or ""
    if not isinstance(music_source_id, str):
        raise ValueError("invalid_music_source")
    music_source = None
    if music_source_id:
        if mode != "music3" or strategy != "global":
            raise ValueError("invalid_music_source")
        try:
            music_source_id = str(uuid.UUID(music_source_id))
        except ValueError as exc:
            raise ValueError("invalid_music_source") from exc
        if music_source_resolver is None:
            raise ValueError("invalid_music_source")
        music_source = music_source_resolver(music_source_id)
        if not isinstance(music_source, dict) or not music_source.get("path"):
            raise ValueError("music_source_not_found")
    burn_lyrics = raw_soundtrack.get("burn_lyrics", True)
    if not isinstance(burn_lyrics, bool):
        raise ValueError("invalid_burn_lyrics")
    default_music_prompt = raw_soundtrack.get("prompt", "Cinematic instrumental score")
    if (
        not isinstance(default_music_prompt, str)
        or len(default_music_prompt.strip()) > 4000
        or (
            mode == "music3"
            and strategy == "global"
            and music_source is None
            and not default_music_prompt.strip()
        )
    ):
        raise ValueError("invalid_music_prompt")
    lyrics_mode = raw_soundtrack.get("lyrics_mode", "instrumental")
    lyrics = raw_soundtrack.get("lyrics", "")
    if not isinstance(lyrics_mode, str) or lyrics_mode not in {"instrumental", "lyrics"}:
        raise ValueError("invalid_music_mode")
    if mode == "music3" and music_source is None:
        if lyrics_mode == "lyrics" and (
            not isinstance(lyrics, str) or not lyrics.strip() or len(lyrics.strip()) > 4000
        ):
            raise ValueError("invalid_lyrics")
    elif not isinstance(lyrics, str):
        lyrics = ""
    if music_source is not None:
        lyrics_mode = "instrumental"
        lyrics = ""

    raw_shots = payload.get("shots")
    if not isinstance(raw_shots, list) or not 1 <= len(raw_shots) <= MAX_SHOTS:
        raise ValueError("invalid_shots")
    shots = []
    total_duration = 0.0
    from . import visual_references
    references = _visual_settings(payload, model)
    negative_prompt = generation_limits.validate_negative_prompt(payload.get("negative_prompt", ""), model)
    for raw_shot in raw_shots:
        if not isinstance(raw_shot, dict):
            raise ValueError("invalid_shot")
        title = raw_shot.get("title", "")
        prompt = raw_shot.get("prompt")
        music_prompt = raw_shot.get("music_prompt", default_music_prompt)
        first_frame_id = validate_first_frame_id(raw_shot.get("first_frame_id", ""))
        if model == local_models.fast_h3.MODEL_ID and first_frame_id:
            raise ValueError("fasth3_conditioning_unsupported")
        visual = visual_references.selection(raw_shot.get("visual"), references)
        negative = raw_shot.get("negative_prompt")
        if negative is not None:
            negative = generation_limits.validate_negative_prompt(negative, model)
        if model == local_models.fast_h3.MODEL_ID and visual["frame_mode"] == "references":
            raise ValueError("fasth3_conditioning_unsupported")
        try:
            seed = int(raw_shot.get("seed", 0))
        except (TypeError, ValueError) as exc:
            raise ValueError("invalid_shot_settings") from exc
        turbo = raw_shot.get("turbo", True)
        if not isinstance(title, str) or len(title.strip()) > 120:
            raise ValueError("invalid_shot_title")
        if not isinstance(prompt, str) or not prompt.strip() or len(prompt.strip()) > 4000:
            raise ValueError("invalid_prompt")
        visual_references.prompt(prompt.strip(), references, visual)
        if visual["frame_mode"] == "references":
            visual_references.prompt(prompt.strip(), references, visual, frame=True)
        if (
            not isinstance(music_prompt, str)
            or len(music_prompt.strip()) > 4000
            or (mode == "music3" and strategy == "per_shot" and not music_prompt.strip())
        ):
            raise ValueError("invalid_music_prompt")
        duration = generation_limits.validate_duration(raw_shot.get("duration", 5), model)
        if not isinstance(turbo, bool):
            raise ValueError("invalid_steps")
        steps = generation_limits.validate_steps(raw_shot.get("steps", 4), model, turbo=turbo)
        if isinstance(raw_shot.get("seed", 0), bool) or not 0 <= seed <= 2**32 - 1:
            raise ValueError("invalid_seed")
        total_duration += duration
        shots.append({
            "id": str(uuid.uuid4()),
            "title": title.strip() or f"Shot {len(shots) + 1}",
            "prompt": prompt.strip(),
            "visual": visual,
            "negative_prompt": negative,
            "music_prompt": music_prompt.strip(),
            **({"skill_usage": skill_installations.validate_usage(raw_shot["skill_usage"])}
               if "skill_usage" in raw_shot else {}),
            "first_frame_id": first_frame_id,
            "first_frame_path": None,
            "generated_first_frame_path": None,
            "last_frame_path": None,
            "duration": duration,
            "steps": steps,
            "seed": seed,
            "turbo": turbo,
            "status": "pending",
            "job_id": None,
            "video_path": None,
            "audio_path": None,
            "error": "",
            "music_seed": int(uuid.uuid4().hex[:8], 16),
            "music_status": "pending",
            "music_job_id": None,
            "music_path": None,
            "music_error": "",
        })
    if total_duration > MAX_WORKFLOW_SECONDS:
        raise ValueError("workflow_too_long")

    mix = raw_soundtrack.get("mix", "score")
    if not isinstance(mix, str) or mix not in {"score", "mix"}:
        raise ValueError("invalid_soundtrack_mix")
    return {
        "name": name.strip(),
        "model": model,
        "quality": quality,
        "shot_mode": shot_mode,
        "aspect": aspect,
        "shots": shots,
        "visual_references": references,
        "negative_prompt": negative_prompt,
        "total_duration": total_duration,
        "soundtrack": {
            "mode": mode,
            "strategy": strategy,
            "mix": mix,
            "prompt": default_music_prompt.strip(),
            "lyrics_mode": lyrics_mode,
            "lyrics": "[instrumental]" if lyrics_mode == "instrumental" else lyrics.strip(),
            "music_source_id": music_source_id if music_source is not None else "",
            "music_source_path": str(music_source["path"]) if music_source is not None else None,
            "source_lyrics": (
                str(music_source.get("lyrics") or "")[:4000] if music_source is not None else ""
            ),
            "source_prompt": (
                str(music_source.get("prompt") or "")[:400] if music_source is not None else ""
            ),
            "source_duration": _source_duration(music_source),
            "burn_lyrics": burn_lyrics,
        },
        "soundtrack_segments": [
            {
                "duration": total_duration / math.ceil(total_duration / MUSIC3_MAX_SECONDS),
                "status": "pending",
                "music_seed": int(uuid.uuid4().hex[:8], 16),
                "job_id": None,
                "audio_path": None,
                "error": "",
            }
            for _ in range(math.ceil(total_duration / MUSIC3_MAX_SECONDS))
        ] if mode == "music3" and strategy == "global" and music_source is None else [],
    }


def validate_first_frame_id(value: object) -> str:
    if not isinstance(value, str):
        raise ValueError("invalid_first_frame")
    if value:
        try:
            if str(uuid.UUID(value)) != value:
                raise ValueError("invalid_first_frame")
        except ValueError as exc:
            raise ValueError("invalid_first_frame") from exc
    return value


def _visual_settings(payload: dict, model: str) -> dict:
    from . import visual_references
    references = visual_references.library(payload.get("visual_references"))
    if references["generate_frames"] and model == local_models.fast_h3.MODEL_ID:
        raise ValueError("fasth3_conditioning_unsupported")
    return references


def _snapshot_references(output_root: Path, manifest: dict, previous: dict | None = None) -> None:
    from . import visual_references
    references = visual_references.library(manifest.get("visual_references"))
    prepared = {}
    for row in references["characters"] + references["scenes"]:
        image_id = row["image_id"]
        if not image_id or image_id in prepared:
            continue
        previous_paths = previous.get("reference_paths", {}).get(image_id, []) if previous else []
        if isinstance(previous_paths, str):
            previous_paths = [previous_paths]
        fallbacks = [
            path for path in (
                safe_workflow_file(output_root, previous["id"], item) for item in previous_paths
            ) if path is not None
        ] if previous else []
        prepared[image_id] = read_reference_images(output_root, image_id, fallbacks)
    paths = {}
    for image_id, images in prepared.items():
        directory = workflow_directory(output_root, manifest["id"])
        directory.mkdir(parents=True, exist_ok=True)
        os.chmod(directory, 0o700)
        destinations = []
        for data in images:
            destination = directory / f"reference-{hashlib.sha256(data).hexdigest()}.png"
            if destination.is_symlink():
                raise ValueError("invalid_visual_reference")
            if not destination.exists():
                with destination.open("xb") as stream:
                    os.chmod(destination, 0o600)
                    stream.write(data)
            elif destination.read_bytes() != data:
                raise ValueError("visual_reference_conflict")
            destinations.append(str(destination))
        paths[image_id] = destinations if len(destinations) > 1 else destinations[0]
    manifest["reference_paths"] = paths


def read_first_frame(output_root: Path, image_id: str, fallback: Path | None = None) -> bytes:
    if not validate_first_frame_id(image_id):
        raise ValueError("invalid_first_frame")
    try:
        from PIL import Image
    except ImportError as exc:
        raise RuntimeError("First-frame image validation requires Pillow; install requirements.txt.") from exc
    source = output_storage.history_file(output_root, "image", f"hidream-{image_id}.png")
    if not source.exists() and not source.is_symlink():
        directory = output_root / "first-frames"
        if directory.is_symlink():
            raise ValueError("invalid_first_frame")
        source = directory / f"{image_id}.png"
    if not source.exists() and not source.is_symlink():
        source = output_storage.history_file(output_root, "video", f"h3-{image_id}-first-frame.png")
    if not source.is_file() and not source.is_symlink() and fallback is not None:
        source = fallback
    if not source.is_file() or source.is_symlink():
        raise ValueError("first_frame_not_found")
    if source.stat().st_size > 20 * 1024 * 1024:
        raise ValueError("first_frame_too_large")
    data = source.read_bytes()
    if len(data) > 20 * 1024 * 1024:
        raise ValueError("first_frame_too_large")
    try:
        with Image.open(io.BytesIO(data)) as image:
            if image.format != "PNG":
                raise ValueError("invalid_first_frame")
            image.verify()
    except (OSError, SyntaxError, Image.DecompressionBombError) as exc:
        raise ValueError("invalid_first_frame") from exc
    return data


def read_reference_images(
    output_root: Path, image_id: str, fallbacks: list[Path] | None = None,
) -> list[bytes]:
    primary = read_first_frame(output_root, image_id, (fallbacks or [None])[0])
    metadata_path = output_storage.history_file(output_root, "image", f"{image_id}.json")
    try:
        metadata = json.loads(metadata_path.read_text(encoding="utf-8")) if metadata_path.is_file() else {}
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError("invalid_visual_reference") from exc
    generation = metadata.get("generation") if isinstance(metadata, dict) else None
    multi_view = isinstance(generation, dict) and generation.get("image_preset") in {"character_turnaround", "scene_views"}
    if not multi_view and not (not metadata and len(fallbacks or []) == 3):
        return [primary]
    images = [primary]
    for index in (2, 3):
        path = output_storage.history_file(output_root, "image", f"hidream-{image_id}-{index}.png")
        fallback = (fallbacks or [])[index - 1] if len(fallbacks or []) >= index else None
        images.append(read_first_frame(output_root, str(uuid.uuid4()), path if path.is_file() else fallback))
    return images


def extract_first_frame(output_root: Path, workflow_id: str, video: Path, ffmpeg: str) -> Path:
    return _extract_frame(output_root, workflow_id, video, ffmpeg, last=False)


def extract_last_frame(output_root: Path, workflow_id: str, video: Path, ffmpeg: str) -> Path:
    return _extract_frame(output_root, workflow_id, video, ffmpeg, last=True)


def _extract_frame(output_root: Path, workflow_id: str, video: Path, ffmpeg: str, *, last: bool) -> Path:
    """Atomically retain a decoded boundary frame inside the workflow directory."""
    directory = workflow_directory(output_root, workflow_id)
    directory.mkdir(parents=True, exist_ok=True)
    os.chmod(directory, 0o700)
    fd, temporary_path = tempfile.mkstemp(prefix=".last-frame-", suffix=".png", dir=directory)
    os.close(fd)
    temporary = Path(temporary_path)
    try:
        # Seek near the end and keep overwriting the image so the last decoded frame wins.
        seek = ["-sseof", "-1"] if last else []
        frames = ["-update", "1"] if last else ["-frames:v", "1"]
        result = subprocess.run([
            ffmpeg, "-nostdin", "-y", "-loglevel", "error", *seek, "-i", str(video),
            "-an", *frames, "-f", "image2", "-c:v", "png", str(temporary),
        ], capture_output=True, text=True, timeout=120, check=False)
        if result.returncode != 0 or temporary.stat().st_size == 0:
            raise RuntimeError(f"ffmpeg failed to extract the {'last' if last else 'first'} frame: {result.stderr[-2000:]}")
        data = temporary.read_bytes()
        path = directory / f"first-frame-{hashlib.sha256(data).hexdigest()}.png"
        os.replace(temporary, path)
        os.chmod(path, 0o600)
        return path
    finally:
        temporary.unlink(missing_ok=True)


def save_shot_frames(output_root: Path, manifest: dict, shot: dict, video: Path, ffmpeg: str) -> None:
    first = safe_workflow_file(output_root, manifest["id"], shot.get("generated_first_frame_path"))
    last = safe_workflow_file(output_root, manifest["id"], shot.get("last_frame_path"))
    if first is not None and last is not None:
        return
    if first is None:
        first = extract_first_frame(output_root, manifest["id"], video, ffmpeg)
    if last is None:
        last = extract_last_frame(output_root, manifest["id"], video, ffmpeg)
    shot["generated_first_frame_path"] = str(first)
    shot["last_frame_path"] = str(last)
    save_workflow(output_root, manifest)


def restore_workflow(output_root: Path, workflow_id: str) -> dict:
    """Create an editable history revision without modifying the source project."""
    source = get_workflow(output_root, workflow_id)
    if source is None:
        raise FileNotFoundError("workflow_not_found")
    if source.get("mv_timeline"):
        raise ValueError("mv_replan_required")
    if source["status"] in {"draft", "queued", "running"}:
        raise ValueError("workflow_not_restorable")
    frames = []
    for shot in source["shots"]:
        video = safe_workflow_file(output_root, workflow_id, shot.get("video_path"))
        if video is not None:
            ffmpeg = shutil.which("ffmpeg")
            if ffmpeg is None:
                raise RuntimeError("ffmpeg_and_ffprobe_required")
            save_shot_frames(output_root, source, shot, video, ffmpeg)
        path = safe_workflow_file(output_root, workflow_id, shot.get("first_frame_path"))
        if path is None:
            path = safe_workflow_file(output_root, workflow_id, shot.get("generated_first_frame_path"))
        if path is None and (shot.get("first_frame_path") or shot.get("generated_first_frame_path")):
            raise ValueError("first_frame_not_found")
        frames.append(read_first_frame(output_root, str(uuid.uuid4()), path) if path else None)
    payload = {
        "name": source["name"], "model": source.get("model", "h3"), "aspect": source["aspect"],
        "quality": source.get("quality", "standard" if source.get("model", "h3") == "h3" else "preview"),
        "shot_mode": source.get("shot_mode", "continuous"),
        "visual_references": source.get("visual_references"),
        "negative_prompt": source.get("negative_prompt", ""),
        "shots": [{**shot, "first_frame_id": ""} for shot in source["shots"]],
        "soundtrack": source["soundtrack"],
    }
    # Preserve the validated history soundtrack without resolving it as a new user request.
    def resolver(item_id: str) -> dict:
        soundtrack = source["soundtrack"]
        return {
            "path": soundtrack.get("music_source_path"),
            "duration": soundtrack.get("source_duration"),
            "lyrics": soundtrack.get("source_lyrics"),
            "prompt": soundtrack.get("source_prompt"),
        }
    restored = _new_workflow_manifest(_validate_payload(payload, resolver))
    restored["source_workflow_id"] = workflow_id
    directory = workflow_directory(output_root, restored["id"])
    try:
        directory.mkdir(parents=True, exist_ok=False)
        os.chmod(directory, 0o700)
        for shot, data in zip(restored["shots"], frames):
            if data is not None:
                image_id = str(uuid.uuid4())
                destination = directory / f"first-frame-{hashlib.sha256(data).hexdigest()}.png"
                destination.write_bytes(data)
                os.chmod(destination, 0o600)
                shot.update(first_frame_id=image_id, first_frame_path=str(destination))
        _snapshot_references(output_root, restored, source)
        save_workflow(output_root, restored)
    except OSError as exc:
        raise RuntimeError(f"workflow_restore_failed: {exc}") from exc
    return restored


def _snapshot_first_frames(output_root: Path, manifest: dict, previous: dict | None = None) -> None:
    prepared = []
    for shot in manifest["shots"]:
        image_id = shot.get("first_frame_id")
        if not image_id:
            continue
        fallback = None
        if previous:
            old = next((item for item in previous["shots"]
                        if item.get("first_frame_id") == image_id), None)
            fallback = safe_workflow_file(
                output_root, manifest["id"], old.get("first_frame_path") if old else None
            )
        prepared.append((shot, read_first_frame(output_root, image_id, fallback)))
    for shot, data in prepared:
        directory = workflow_directory(output_root, manifest["id"])
        directory.mkdir(parents=True, exist_ok=True)
        os.chmod(directory, 0o700)
        path = directory / f"first-frame-{hashlib.sha256(data).hexdigest()}.png"
        path.write_bytes(data)
        os.chmod(path, 0o600)
        shot["first_frame_path"] = str(path)


def _new_workflow_manifest(settings: dict) -> dict:
    now = time.time()
    return {
        "version": 1,
        "id": str(uuid.uuid4()),
        "name": settings["name"],
        "model": settings["model"],
        "shot_mode": settings["shot_mode"],
        **({"quality": settings["quality"]} if "quality" in settings else {}),
        "aspect": settings["aspect"],
        "total_duration": settings["total_duration"],
        "status": "draft",
        "created_at": now,
        "updated_at": now,
        "shots": settings["shots"],
        "visual_references": settings.get("visual_references"),
        "negative_prompt": settings.get("negative_prompt", ""),
        "soundtrack": settings["soundtrack"],
        "soundtrack_segments": settings["soundtrack_segments"],
        "output_path": None,
        "error": "",
    }


def create_workflow(output_root: Path, payload: object, music_source_resolver=None) -> dict:
    settings = _validate_payload(payload, music_source_resolver)
    manifest = _new_workflow_manifest(settings)
    _snapshot_first_frames(output_root, manifest)
    _snapshot_references(output_root, manifest)
    _write_manifest(output_root, manifest)
    return manifest


def create_mv_workflow(output_root: Path, payload: dict, timeline: dict, resolver) -> dict:
    from . import mv_storyboard
    manifest = _new_workflow_manifest(_validate_payload(payload, resolver))
    manifest["mv_timeline"] = {
        **timeline, "clips": [
            {"shot_id": shot["id"], "start_frame": clip["start_frame"], "end_frame": clip["end_frame"]}
            for shot, clip in zip(manifest["shots"], timeline["clips"])
        ],
    }
    manifest["total_duration"] = (timeline["end_frame"] - timeline["start_frame"]) / mv_storyboard.FPS
    for index, shot in enumerate(manifest["shots"]):
        shot["first_frame_source"] = (
            "previous" if index and manifest["model"] != local_models.fast_h3.MODEL_ID else "none"
        )
    mv_storyboard.check_source(manifest)
    _snapshot_references(output_root, manifest)
    _write_manifest(output_root, manifest)
    return manifest


def mv_revision(manifest: dict) -> str:
    return hashlib.sha256(json.dumps(manifest, sort_keys=True, ensure_ascii=False,
                                    allow_nan=False).encode("utf-8")).hexdigest()


def mv_frame_source(shot: dict) -> str:
    return shot.get("first_frame_source", "image" if shot.get("first_frame_id") else "none")


def invalidate_mv_following(manifest: dict, index: int) -> None:
    for shot in manifest["shots"][index + 1:]:
        if mv_frame_source(shot) != "previous":
            break
        shot.update(status="pending", job_id=None, video_path=None, audio_path=None,
                    generated_first_frame_path=None, last_frame_path=None,
                    first_frame_path=None, chained_frame_path=None, error="")


def edit_mv_workflow(output_root: Path, workflow_id: str, payload: dict) -> dict:
    manifest = get_workflow(output_root, workflow_id)
    if manifest is None:
        raise ValueError("workflow_not_found")
    if not manifest.get("mv_timeline") or manifest["status"] in ACTIVE_STATUSES:
        raise ValueError("workflow_not_editable")
    if set(payload) - {"visual_references", "negative_prompt"} != {"revision", "shots"} or payload["revision"] != mv_revision(manifest):
        raise ValueError("mv_conflict")
    from . import visual_references
    references = _visual_settings(
        {"visual_references": payload.get("visual_references", manifest.get("visual_references"))}, manifest["model"],
    )
    previous_references = visual_references.library(manifest.get("visual_references"))
    library_changed = references != previous_references
    negative_prompt = generation_limits.validate_negative_prompt(
        payload.get("negative_prompt", manifest.get("negative_prompt", "")), manifest["model"],
    )
    library_changed = library_changed or negative_prompt != manifest.get("negative_prompt", "")
    shots = payload["shots"]
    if not isinstance(shots, list) or len(shots) != len(manifest["shots"]):
        raise ValueError("invalid_shots")
    for index, (raw, shot) in enumerate(zip(shots, manifest["shots"])):
        if (not isinstance(raw, dict) or set(raw) - {"first_frame_source", "visual", "negative_prompt"} != {"id", "title", "prompt", "first_frame_id"}
                or raw["id"] != shot["id"] or not isinstance(raw["title"], str)
                or not 1 <= len(raw["title"].strip()) <= 120
                or not isinstance(raw["prompt"], str) or not 1 <= len(raw["prompt"].strip()) <= 4000):
            raise ValueError("invalid_shot")
        frame_id = validate_first_frame_id(raw["first_frame_id"])
        source = raw.get("first_frame_source", mv_frame_source(shot)
                         if frame_id == shot.get("first_frame_id", "") else ("image" if frame_id else "none"))
        if (source not in {"none", "image", "previous"} or (source == "image") != bool(frame_id)
                or (source == "previous" and index == 0)):
            raise ValueError("invalid_first_frame")
        if manifest["model"] == local_models.fast_h3.MODEL_ID and source != "none":
            raise ValueError("fasth3_conditioning_unsupported")
        visual = visual_references.selection(raw.get("visual", shot.get("visual")), references)
        negative = raw.get("negative_prompt", shot.get("negative_prompt"))
        if negative is not None:
            negative = generation_limits.validate_negative_prompt(negative, manifest["model"])
        if manifest["model"] == local_models.fast_h3.MODEL_ID and visual["frame_mode"] == "references":
            raise ValueError("fasth3_conditioning_unsupported")
        visual_references.prompt(raw["prompt"].strip(), references, visual,
                                 frame=visual["frame_mode"] == "references")
        shots[index] = {**raw, "first_frame_source": source, "visual": visual, "negative_prompt": negative}
    prepared = {"id": workflow_id, "shots": [
        {**shot, "first_frame_id": raw["first_frame_id"], "first_frame_path": None}
        for raw, shot in zip(shots, manifest["shots"])
    ]}
    _snapshot_first_frames(output_root, prepared, manifest)
    prepared["visual_references"] = references
    _snapshot_references(output_root, prepared, manifest)
    for index, (raw, frame, shot) in enumerate(zip(shots, prepared["shots"], manifest["shots"])):
        if (library_changed or raw["visual"] != visual_references.selection(shot.get("visual"), previous_references)
                or raw["negative_prompt"] != shot.get("negative_prompt")
                or raw["prompt"].strip() != shot["prompt"] or raw["first_frame_id"] != shot.get("first_frame_id", "")
                or mv_frame_source(raw) != mv_frame_source(shot)):
            shot.update(status="pending", job_id=None, video_path=None, audio_path=None,
                        generated_first_frame_path=None, last_frame_path=None, chained_frame_path=None, error="")
            invalidate_mv_following(manifest, index)
        shot.update(title=raw["title"].strip(), prompt=raw["prompt"].strip(),
                    first_frame_source=mv_frame_source(raw),
                    first_frame_id=frame["first_frame_id"], first_frame_path=frame["first_frame_path"],
                    visual=raw["visual"], negative_prompt=raw["negative_prompt"])
    manifest.update(visual_references=references, reference_paths=prepared["reference_paths"],
                    negative_prompt=negative_prompt)
    manifest.update(status="draft", phase="review", output_path=None, error="")
    _write_manifest(output_root, manifest)
    return manifest


def get_workflow(output_root: Path, workflow_id: str) -> dict | None:
    path = _manifest_path(output_root, workflow_id)
    try:
        manifest = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return None
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"Could not read workflow manifest: {exc}") from exc
    if (
        not isinstance(manifest, dict)
        or manifest.get("version") != 1
        or manifest.get("id") != str(uuid.UUID(workflow_id))
        or manifest.get("status") not in {"draft", "queued", "running", "completed", "failed", "cancelled", "interrupted"}
        or not isinstance(manifest.get("shots"), list)
        or not isinstance(manifest.get("soundtrack_segments"), list)
    ):
        raise RuntimeError("Workflow manifest identity is invalid.")
    if (
        not isinstance(manifest.get("soundtrack"), dict)
        or not isinstance(manifest.get("name"), str)
        or any(
            not isinstance(shot, dict)
            or not isinstance(shot.get("id"), str)
            or not isinstance(shot.get("prompt"), str)
            or shot.get("status") not in {
                "pending", "running", "completed", "failed", "cancelled", "interrupted",
            }
            for shot in manifest["shots"]
        )
        or any(not isinstance(segment, dict) for segment in manifest["soundtrack_segments"])
    ):
        raise RuntimeError("Workflow manifest schema is invalid.")
    if "mv_timeline" in manifest:
        from . import mv_storyboard
        mv_storyboard.validate_timeline(manifest)
    with _LIVE_LOCK:
        live = manifest.get("id") in _LIVE_WORKFLOWS
    if manifest.get("status") in {"queued", "running"} and not live:
        manifest["status"] = "interrupted"
        manifest["error"] = "Server restarted while this workflow was running."
        for shot in manifest.get("shots", []):
            if shot.get("status") == "running":
                shot["status"] = "interrupted"
                shot["error"] = "Server restarted during this shot."
            if shot.get("music_status") == "running":
                shot["music_status"] = "interrupted"
                shot["music_error"] = "Server restarted during this shot's music generation."
        for segment in manifest.get("soundtrack_segments", []):
            if segment.get("status") == "running":
                segment["status"] = "interrupted"
                segment["error"] = "Server restarted during soundtrack generation."
        manifest["updated_at"] = time.time()
        _write_manifest(output_root, manifest)
    return manifest


def mark_workflow_live(workflow_id: str, live: bool) -> None:
    with _LIVE_LOCK:
        if live:
            _LIVE_WORKFLOWS.add(workflow_id)
        else:
            _LIVE_WORKFLOWS.discard(workflow_id)


def update_workflow(
    output_root: Path, workflow_id: str, payload: object, music_source_resolver=None,
) -> dict:
    current = get_workflow(output_root, workflow_id)
    if current is None:
        raise FileNotFoundError("workflow_not_found")
    if current.get("status") in ACTIVE_STATUSES:
        raise ValueError("workflow_not_editable")
    if current.get("mv_timeline"):
        raise ValueError("mv_dedicated_editor_required")
    settings = _validate_payload(payload, music_source_resolver)
    previous_ids = [shot["id"] for shot in current["shots"]]
    raw_shots = payload["shots"]
    explicit_ids = any("id" in shot for shot in raw_shots)
    seen_ids = set()
    for index, shot in enumerate(settings["shots"]):
        if explicit_ids:
            shot_id = raw_shots[index].get("id", "")
            if not isinstance(shot_id, str) or (
                shot_id and (shot_id not in previous_ids or shot_id in seen_ids)
            ):
                raise ValueError("invalid_shot_id")
            if shot_id:
                shot["id"] = shot_id
                seen_ids.add(shot_id)
        elif index < len(previous_ids):
            shot["id"] = previous_ids[index]
    _snapshot_first_frames(output_root, {"id": workflow_id, "shots": settings["shots"]}, current)
    prepared_references = {"id": workflow_id, "visual_references": settings["visual_references"]}
    _snapshot_references(output_root, prepared_references, current)
    video_keys = ("prompt", "duration", "steps", "seed", "turbo", "first_frame_id", "visual", "negative_prompt")
    same_canvas = all(
        current.get(key, "continuous" if key == "shot_mode" else None) == settings.get(key)
        for key in ("model", "aspect", "quality", "shot_mode")
    )
    from . import visual_references
    same_canvas = same_canvas and visual_references.library(current.get("visual_references")) == settings["visual_references"]
    same_canvas = same_canvas and current.get("negative_prompt", "") == settings["negative_prompt"]
    previous_by_id = {shot["id"]: shot for shot in current["shots"]}
    music_keys = ("mode", "strategy", "prompt", "lyrics_mode", "lyrics",
                  "music_source_id", "music_source_path")
    same_score = all(current["soundtrack"].get(key) == settings["soundtrack"].get(key) for key in music_keys)
    chain_valid = True
    for index, shot in enumerate(settings["shots"]):
        old = previous_by_id.get(shot["id"])
        if old:
            shot["music_seed"] = old.get("music_seed", shot["music_seed"])
        unchanged = bool(old and same_canvas and all(old.get(key) == shot.get(key) for key in video_keys))
        if settings["shot_mode"] == "continuous":
            chain_valid = chain_valid and unchanged and index < len(previous_ids) and previous_ids[index] == shot["id"]
            unchanged = chain_valid
        if unchanged:
            for key in (
                "status", "job_id", "video_path", "audio_path", "generated_first_frame_path",
                "last_frame_path", "tokens", "visual_tokens", "visual_token_stages", "elapsed_seconds",
            ):
                if key in old:
                    shot[key] = old[key]
            if not shot.get("first_frame_id"):
                shot["first_frame_path"] = old.get("first_frame_path")
        if old and same_score and all(
            old.get(key) == shot.get(key) for key in ("duration", "music_prompt", "music_seed")
        ):
            for key in ("music_status", "music_job_id", "music_path", "music_error"):
                if key in old:
                    shot[key] = old[key]
    same_music = same_score and current["total_duration"] == settings["total_duration"]
    same_timeline = same_canvas and [
        (shot["id"], *(shot.get(key) for key in video_keys)) for shot in current["shots"]
    ] == [(shot["id"], *(shot.get(key) for key in video_keys)) for shot in settings["shots"]]
    if not same_timeline:
        current.update(output_path=None, assembly_path=None)
    elif current["soundtrack"] != settings["soundtrack"]:
        current["output_path"] = current.get("assembly_path")
    current.update({
        "name": settings["name"],
        "model": settings["model"],
        "shot_mode": settings["shot_mode"],
        "aspect": settings["aspect"],
        "total_duration": settings["total_duration"],
        "shots": settings["shots"],
        "visual_references": settings["visual_references"],
        "reference_paths": prepared_references["reference_paths"],
        "negative_prompt": settings["negative_prompt"],
        "soundtrack": settings["soundtrack"],
        "soundtrack_segments": current["soundtrack_segments"] if same_music else settings["soundtrack_segments"],
        "status": "draft", "phase": "draft", "failure": None, "operation": None,
        "error": "",
    })
    if "quality" in settings:
        current["quality"] = settings["quality"]
    else:
        current.pop("quality", None)
    _write_manifest(output_root, current)
    return current


def list_workflows(output_root: Path) -> list[dict]:
    manifests = []
    roots = [workflow_root(output_root), output_root / "workflows"]
    directories = [directory for root in roots if root.exists() for directory in root.iterdir()]
    seen = set()
    for directory in directories:
        if not directory.is_dir():
            continue
        try:
            workflow_id = str(uuid.UUID(directory.name))
        except ValueError:
            continue
        if workflow_id in seen:
            continue
        seen.add(workflow_id)
        manifest = get_workflow(output_root, workflow_id)
        if manifest is not None:
            manifests.append(manifest)
    return sorted(manifests, key=lambda item: item["updated_at"], reverse=True)


def save_workflow(output_root: Path, manifest: dict) -> None:
    manifest["updated_at"] = time.time()
    _write_manifest(output_root, manifest)


def deletion_files(output_root: Path, manifest: dict) -> list[Path]:
    directory = workflow_directory(output_root, manifest["id"])
    if directory.is_symlink() or directory.parent.is_symlink():
        raise ValueError("workflow_delete_unsafe")
    files = []
    for path in directory.iterdir():
        if path.is_symlink() or not path.is_file():
            raise ValueError("workflow_delete_unsafe")
        if path.name != "workflow.json":
            files.append(path)
    return files


def clear_workflow_shots(output_root: Path, workflow_id: str, *, delete_media: bool) -> dict:
    if type(delete_media) is not bool:
        raise ValueError("invalid_workflow_delete")
    manifest = get_workflow(output_root, workflow_id)
    if manifest is None:
        raise FileNotFoundError("workflow_not_found")
    if manifest.get("mv_timeline"):
        raise ValueError("mv_replan_required")
    with _LIVE_LOCK:
        live = workflow_id in _LIVE_WORKFLOWS
    if live or manifest["status"] in ACTIVE_STATUSES:
        raise ValueError("workflow_delete_active")
    files = deletion_files(output_root, manifest)
    manifest.update(
        shots=[], soundtrack_segments=[], total_duration=0, status="draft",
        phase="draft", operation=None, target_shot_id=None, output_path=None,
        assembly_path=None, failure=None, error="", logs=[], started_at=None,
        finished_at=None, current_unit=None, retained_media=bool(files) and not delete_media,
    )
    save_workflow(output_root, manifest)
    if delete_media:
        for path in files:
            path.unlink()
    return manifest


def delete_workflows(output_root: Path, ids: list[str], *, delete_media: bool) -> list[str]:
    plans = []
    for workflow_id in ids:
        manifest = get_workflow(output_root, workflow_id)
        if manifest is None:
            raise FileNotFoundError("workflow_not_found")
        with _LIVE_LOCK:
            live = workflow_id in _LIVE_WORKFLOWS
        if live or manifest["status"] in ACTIVE_STATUSES:
            raise ValueError("workflow_delete_active")
        plans.append((workflow_id, deletion_files(output_root, manifest)))
    deleted = []
    for workflow_id, files in plans:
        try:
            if delete_media:
                for path in files:
                    path.unlink()
            _manifest_path(output_root, workflow_id).unlink()
            directory = workflow_directory(output_root, workflow_id)
            if not any(directory.iterdir()):
                directory.rmdir()
            deleted.append(workflow_id)
        except OSError as exc:
            raise RuntimeError(
                f"workflow_delete_failed: {workflow_id}; deleted={deleted}; {exc}"
            ) from exc
    return deleted


def safe_workflow_file(output_root: Path, workflow_id: str, value: object) -> Path | None:
    if not isinstance(value, str) or not value:
        return None
    root = output_root.resolve()
    directory = workflow_directory(output_root, workflow_id).resolve()
    path = Path(value).resolve()
    if not path.is_relative_to(root) or path.parent not in {
        root, directory, root / "video", root / "image", root / "music",
    } or not path.is_file():
        return None
    return path


def assemble_workflow(
    output_root: Path, manifest: dict, shot_paths: list[Path],
    soundtrack_paths: list[Path], ffmpeg: str, ffprobe: str,
) -> Path:
    if manifest.get("mv_timeline") or len(shot_paths) <= ASSEMBLY_BATCH_SHOTS:
        return _assemble_workflow_batch(output_root, manifest, shot_paths, soundtrack_paths, ffmpeg, ffprobe)
    if len(shot_paths) != len(manifest["shots"]):
        raise RuntimeError("workflow_shot_media_missing")
    directory = workflow_directory(output_root, manifest["id"])
    directory.mkdir(parents=True, exist_ok=True)
    soundtrack = manifest["soundtrack"]
    per_shot = soundtrack["mode"] == "music3" and soundtrack.get("strategy", "per_shot") == "per_shot"
    if per_shot and len(soundtrack_paths) != len(shot_paths):
        raise RuntimeError("Each storyboard shot must have its own soundtrack.")
    cues = workflow_lyric_cues(manifest)
    offset = 0.0
    with tempfile.TemporaryDirectory(prefix=".assembly-", dir=directory) as temporary:
        root = Path(temporary)
        parts = []
        for start in range(0, len(shot_paths), ASSEMBLY_BATCH_SHOTS):
            shots = manifest["shots"][start:start + ASSEMBLY_BATCH_SHOTS]
            duration = sum(float(shot["duration"]) for shot in shots)
            batch = {**manifest, "shots": shots, "total_duration": duration}
            batch_cues = [
                (text, max(0, begin - offset), min(duration, end - offset))
                for text, begin, end in cues if begin < offset + duration and end > offset
            ]
            part = _assemble_workflow_batch(
                root, batch, shot_paths[start:start + ASSEMBLY_BATCH_SHOTS],
                soundtrack_paths[start:start + ASSEMBLY_BATCH_SHOTS] if per_shot else soundtrack_paths,
                ffmpeg, ffprobe, audio_offset=offset, lyric_cues=batch_cues, lossless_audio=True,
            )
            target = part.with_name(f"part-{len(parts):04d}.mov")
            os.replace(part, target)
            parts.append(target)
            offset += duration
        playlist = root / "parts.txt"
        playlist.write_text(
            "".join(f"file '{part.relative_to(root).as_posix()}'\n" for part in parts), encoding="utf-8",
        )
        output = root / "final.mp4"
        result = subprocess.run([
            ffmpeg, "-nostdin", "-y", "-loglevel", "error", "-f", "concat", "-safe", "1",
            "-i", str(playlist), "-map", "0:v:0", "-map", "0:a:0",
            "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
            "-t", str(manifest["total_duration"]), "-movflags", "+faststart", str(output),
        ], capture_output=True, text=True, timeout=7200)
        if result.returncode:
            raise RuntimeError(f"ffmpeg failed to concatenate workflow parts: {result.stderr[-2000:]}")
        probe = subprocess.run([
            ffprobe, "-v", "error", "-count_frames", "-show_entries",
            "format=duration:stream=codec_type,nb_read_frames", "-of", "json", str(output),
        ], capture_output=True, text=True, timeout=120)
        if probe.returncode:
            raise RuntimeError(f"ffprobe failed to validate workflow parts: {probe.stderr[-1000:]}")
        try:
            data = json.loads(probe.stdout)
            streams = data["streams"]
            frames = int(next(stream["nb_read_frames"] for stream in streams if stream["codec_type"] == "video"))
            duration = float(data["format"]["duration"])
        except (KeyError, ValueError, TypeError, StopIteration) as exc:
            raise RuntimeError("workflow_segmented_output_invalid") from exc
        expected = math.ceil(float(manifest["total_duration"]) * 24)
        if (not any(stream["codec_type"] == "audio" for stream in streams)
                or abs(frames - expected) > 1 or abs(duration - float(manifest["total_duration"])) > 0.1):
            raise RuntimeError("workflow_segmented_output_invalid")
        os.chmod(output, 0o600)
        final = directory / "final.mp4"
        os.replace(output, final)
        return final


def _assemble_workflow_batch(
    output_root: Path,
    manifest: dict,
    shot_paths: list[Path],
    soundtrack_paths: list[Path],
    ffmpeg: str,
    ffprobe: str,
    *, audio_offset: float = 0.0,
    lyric_cues: list[tuple[str, float, float]] | None = None,
    lossless_audio: bool = False,
) -> Path:
    if manifest.get("mv_timeline"):
        from . import mv_storyboard
        directory = workflow_directory(output_root, manifest["id"])
        directory.mkdir(parents=True, exist_ok=True)
        return mv_storyboard.assemble(
            manifest, shot_paths, directory,
            local_models.video_canvas(ASPECTS[manifest["aspect"]], manifest["quality"], manifest["model"]),
            ffmpeg, ffprobe,
        )
    soundtrack = manifest["soundtrack"]
    strategy = soundtrack.get(
        "strategy", "per_shot" if soundtrack["mode"] == "music3" else "none"
    )
    if (
        soundtrack["mode"] == "music3"
        and strategy == "per_shot"
        and len(soundtrack_paths) != len(shot_paths)
    ):
        raise RuntimeError("Each storyboard shot must have its own soundtrack.")
    use_music_source = bool(
        soundtrack["mode"] == "music3" and strategy == "global"
        and soundtrack.get("music_source_id")
    )
    if use_music_source and len(soundtrack_paths) != 1:
        raise RuntimeError("The selected history soundtrack is missing.")
    if (
        soundtrack["mode"] == "music3"
        and strategy == "global"
        and not use_music_source
        and len(soundtrack_paths) != len(manifest["soundtrack_segments"])
    ):
        raise RuntimeError("The global soundtrack is missing one or more generated segments.")
    if soundtrack["mode"] == "none" and soundtrack_paths:
        raise RuntimeError("Soundtrack files were provided while Music3 is disabled.")
    directory = workflow_directory(output_root, manifest["id"])
    directory.mkdir(parents=True, exist_ok=True)
    model = manifest.get("model", "h3")
    width, height = local_models.video_canvas(
        ASPECTS[manifest["aspect"]], manifest.get("quality", "standard" if model == "h3" else "preview"), model
    )
    total_duration = float(manifest["total_duration"])
    inputs: list[str] = []
    for path in shot_paths:
        inputs.extend(["-i", str(path)])

    probe_audio = []
    for path in shot_paths:
        result = subprocess.run(
            [ffprobe, "-v", "error", "-select_streams", "a:0", "-show_entries",
             "stream=codec_type", "-of", "json", str(path)],
            capture_output=True, text=True, timeout=30,
        )
        if result.returncode != 0:
            raise RuntimeError(f"ffprobe could not inspect a workflow shot: {result.stderr[-1000:]}")
        try:
            probe_audio.append(bool(json.loads(result.stdout).get("streams")))
        except json.JSONDecodeError as exc:
            raise RuntimeError("ffprobe returned malformed workflow media metadata.") from exc

    audio_input_indexes = []
    for index, (shot, has_audio) in enumerate(zip(manifest["shots"], probe_audio)):
        if has_audio:
            audio_input_indexes.append(index)
        else:
            audio_input_indexes.append(len(shot_paths) + sum(
                not item for item in probe_audio[:index]
            ))
            inputs.extend([
                "-f", "lavfi", "-t", str(shot["duration"]),
                "-i", "anullsrc=channel_layout=stereo:sample_rate=48000",
            ])
    soundtrack_start = len(shot_paths) + sum(not item for item in probe_audio)
    for path in soundtrack_paths:
        if use_music_source:
            inputs.extend(["-stream_loop", "-1"])
        inputs.extend(["-i", str(path)])

    filters = []
    concat_labels = []
    if use_music_source:
        filters.append(
            f"[{soundtrack_start}:a:0]aresample=48000,"
            f"aformat=sample_fmts=fltp:channel_layouts=stereo,"
            f"atrim=duration={audio_offset + total_duration},"
            f"asetpts=PTS-STARTPTS[global_score]"
        )
        filters.append(
            f"[global_score]asplit={len(shot_paths)}" +
            "".join(f"[global_source{index}]" for index in range(len(shot_paths)))
        )
    elif soundtrack["mode"] == "music3" and strategy == "global":
        global_chunk_labels = []
        for index, segment in enumerate(manifest["soundtrack_segments"]):
            music_index = soundtrack_start + index
            filters.append(
                f"[{music_index}:a:0]aresample=48000,"
                f"aformat=sample_fmts=fltp:channel_layouts=stereo,apad,"
                f"atrim=duration={segment['duration']},asetpts=PTS-STARTPTS"
                f"[globalchunk{index}]"
            )
            global_chunk_labels.append(f"[globalchunk{index}]")
        filters.append(
            "".join(global_chunk_labels) +
            f"concat=n={len(global_chunk_labels)}:v=0:a=1[global_score]"
        )
        filters.append(
            f"[global_score]asplit={len(shot_paths)}" +
            "".join(f"[global_source{index}]" for index in range(len(shot_paths)))
        )
    timeline_offset = audio_offset
    for index, (shot, audio_index) in enumerate(zip(manifest["shots"], audio_input_indexes)):
        duration = float(shot["duration"])
        filters.append(
            f"[{index}:v:0]scale={width}:{height}:force_original_aspect_ratio=decrease,"
            f"pad={width}:{height}:(ow-iw)/2:(oh-ih)/2,fps=24,setsar=1,"
            f"format=yuv420p,trim=duration={duration},setpts=PTS-STARTPTS[v{index}]"
        )
        audio_stream = f"[{index}:a:0]" if probe_audio[index] else f"[{audio_index}:a:0]"
        if soundtrack["mode"] == "music3" and strategy == "per_shot":
            music_index = soundtrack_start + index
            filters.append(
                f"[{music_index}:a:0]aresample=48000,"
                f"aformat=sample_fmts=fltp:channel_layouts=stereo,apad,"
                f"atrim=duration={duration},asetpts=PTS-STARTPTS[score{index}]"
            )
        elif soundtrack["mode"] == "music3" and strategy == "global":
            filters.append(
                f"[global_source{index}]atrim=start={timeline_offset}:duration={duration},"
                f"asetpts=PTS-STARTPTS,apad,atrim=duration={duration}[score{index}]"
            )
            timeline_offset += duration
        if soundtrack["mode"] == "music3":
            if soundtrack["mix"] == "mix":
                filters.append(
                    f"{audio_stream}aresample=48000,"
                    f"aformat=sample_fmts=fltp:channel_layouts=stereo,"
                    f"apad,atrim=duration={duration},asetpts=PTS-STARTPTS[ambience{index}]"
                )
                filters.append(
                    f"[ambience{index}][score{index}]amix=inputs=2:duration=first:"
                    f"weights='0.25 1':normalize=0,alimiter=limit=0.95[a{index}]"
                )
                audio_label = f"[a{index}]"
            else:
                audio_label = f"[score{index}]"
        else:
            filters.append(
                f"{audio_stream}aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,"
                f"apad,atrim=duration={duration},asetpts=PTS-STARTPTS[ambience{index}]"
            )
            audio_label = f"[ambience{index}]"
        concat_labels.extend([f"[v{index}]", audio_label])
    filters.append(
        "".join(concat_labels) +
        f"concat=n={len(shot_paths)}:v=1:a=1[vbase][ambience]"
    )

    if lyric_cues is None:
        lyric_cues = workflow_lyric_cues(manifest)
    lyric_images: list[Path] = []
    video_label = "[vbase]"
    next_input = soundtrack_start + len(soundtrack_paths)
    for cue_index, (text, start, end) in enumerate(lyric_cues):
        image_path = directory / f".lyric-{uuid.uuid4().hex}.png"
        render_lyric_image(text, width, height, image_path)
        lyric_images.append(image_path)
        inputs.extend(["-loop", "1", "-t", str(total_duration), "-i", str(image_path)])
        output_label = f"[vlyric{cue_index}]"
        filters.append(
            f"{video_label}[{next_input}:v:0]overlay=x=(W-w)/2:y=H-h-{max(12, height // 18)}:"
            f"enable='between(t,{start:.3f},{end:.3f})'{output_label}"
        )
        video_label = output_label
        next_input += 1
    filters.append(f"{video_label}format=yuv420p[vout]")

    suffix = ".mov" if lossless_audio else ".mp4"
    temporary_output = directory / f".final-{uuid.uuid4()}{suffix}"
    output_path = directory / f"final{suffix}"
    command = [
        ffmpeg, "-nostdin", "-y", "-loglevel", "error",
        *inputs, "-filter_complex", ";".join(filters),
        "-map", "[vout]", "-map", "[ambience]",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
        "-pix_fmt", "yuv420p", "-c:a", "pcm_s16le" if lossless_audio else "aac",
        *([] if lossless_audio else ["-b:a", "192k"]),
        "-t", str(total_duration), "-movflags", "+faststart", str(temporary_output),
    ]
    try:
        result = subprocess.run(command, capture_output=True, text=True, timeout=7200)
        if result.returncode != 0:
            raise RuntimeError(f"ffmpeg failed to assemble workflow: {result.stderr[-2000:]}")
        if not temporary_output.is_file() or temporary_output.stat().st_size <= 0:
            raise RuntimeError("ffmpeg completed without producing a workflow video.")
        probe = subprocess.run(
            [ffprobe, "-v", "error", "-show_entries", "format=duration",
             "-show_entries", "stream=codec_type", "-of", "json", str(temporary_output)],
            capture_output=True, text=True, timeout=30,
        )
        if probe.returncode != 0:
            raise RuntimeError(f"ffprobe could not validate workflow output: {probe.stderr[-1000:]}")
        try:
            result_data = json.loads(probe.stdout)
            streams = result_data.get("streams", [])
            duration = float(result_data.get("format", {}).get("duration", 0))
        except (json.JSONDecodeError, TypeError, ValueError) as exc:
            raise RuntimeError("ffprobe returned malformed workflow output metadata.") from exc
        if not any(stream.get("codec_type") == "video" for stream in streams):
            raise RuntimeError("Workflow output is missing its video stream.")
        if not any(stream.get("codec_type") == "audio" for stream in streams):
            raise RuntimeError("Workflow output is missing its audio stream.")
        if duration <= 0 or abs(duration - total_duration) > max(2.0, total_duration * 0.05):
            raise RuntimeError(
                f"Workflow output duration {duration:.2f}s does not match "
                f"the planned {total_duration:.2f}s."
            )
        os.replace(temporary_output, output_path)
        return output_path
    finally:
        temporary_output.unlink(missing_ok=True)
        for image_path in lyric_images:
            image_path.unlink(missing_ok=True)


MAX_LYRIC_CUES = 60
LYRIC_FONT_CANDIDATES = (
    "/System/Library/Fonts/Hiragino Sans GB.ttc",
    "/System/Library/Fonts/STHeiti Medium.ttc",
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    "/System/Library/Fonts/Songti.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
)


def apply_global_soundtrack(
    output_root: Path, manifest: dict, soundtrack_paths: list[Path], ffmpeg: str, ffprobe: str,
) -> Path:
    """Score the clean assembly, never an already mixed or captioned final."""
    directory = workflow_directory(output_root, manifest["id"])
    base = safe_workflow_file(output_root, manifest["id"], manifest.get("assembly_path"))
    if base is None:
        raise ValueError("workflow_assembly_required")
    if not soundtrack_paths:
        raise ValueError("workflow_soundtrack_missing")
    total = float(manifest["total_duration"])
    inputs = ["-i", str(base)]
    filters = []
    labels = []
    source = bool(manifest["soundtrack"].get("music_source_id"))
    for index, path in enumerate(soundtrack_paths):
        if source:
            inputs.extend(["-stream_loop", "-1"])
        inputs.extend(["-i", str(path)])
        duration = total if source else manifest["soundtrack_segments"][index]["duration"]
        filters.append(
            f"[{index + 1}:a:0]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,"
            f"apad,atrim=duration={duration},asetpts=PTS-STARTPTS[score{index}]"
        )
        labels.append(f"[score{index}]")
    filters.append("".join(labels) + f"concat=n={len(labels)}:v=0:a=1[score]")
    if manifest["soundtrack"]["mix"] == "mix":
        filters.append(
            "[0:a:0]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo[original];"
            "[original][score]amix=inputs=2:duration=first:weights='0.25 1':normalize=0,"
            "alimiter=limit=0.95[aout]"
        )
    else:
        filters.append("[score]anull[aout]")
    model = manifest.get("model", "h3")
    width, height = local_models.video_canvas(
        ASPECTS[manifest["aspect"]], manifest.get("quality", "standard" if model == "h3" else "preview"), model
    )
    lyric_images = []
    video_label = "0:v:0"
    temporary = directory / f".score-{uuid.uuid4()}.mp4"
    output = directory / "final.mp4"
    try:
        for index, (text, start, end) in enumerate(workflow_lyric_cues(manifest)):
            image = directory / f".lyric-{uuid.uuid4()}.png"
            lyric_images.append(image)
            render_lyric_image(text, width, height, image)
            inputs.extend(["-loop", "1", "-i", str(image)])
            next_label = f"caption{index}"
            filters.append(
                f"[{video_label}][{1 + len(soundtrack_paths) + index}:v:0]"
                f"overlay=x=(W-w)/2:y=H-h-{max(12, height // 18)}:"
                f"enable='between(t,{start:.3f},{end:.3f})'[{next_label}]"
            )
            video_label = next_label
        command = [
            ffmpeg, "-nostdin", "-y", "-loglevel", "error", *inputs,
            "-filter_complex", ";".join(filters),
            "-map", f"[{video_label}]" if lyric_images else video_label, "-map", "[aout]",
            "-c:v", "libx264" if lyric_images else "copy",
            *(["-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p"] if lyric_images else []),
            "-c:a", "aac", "-b:a", "192k", "-t", str(total), "-movflags", "+faststart", str(temporary),
        ]
        result = subprocess.run(command, capture_output=True, text=True, timeout=7200)
        if result.returncode:
            raise RuntimeError(f"ffmpeg soundtrack failed: {result.stderr[-2000:]}")
        probe = subprocess.run(
            [ffprobe, "-v", "error", "-show_entries", "format=duration",
             "-show_entries", "stream=codec_type", "-of", "json", str(temporary)],
            capture_output=True, text=True, timeout=30,
        )
        if probe.returncode:
            raise RuntimeError(f"ffprobe soundtrack failed: {probe.stderr[-1000:]}")
        data = json.loads(probe.stdout)
        kinds = {stream.get("codec_type") for stream in data.get("streams", [])}
        duration = float(data.get("format", {}).get("duration", 0))
        if not {"video", "audio"} <= kinds or abs(duration - total) > max(2, total * 0.05):
            raise RuntimeError("workflow_soundtrack_output_invalid")
        os.replace(temporary, output)
        return output
    finally:
        temporary.unlink(missing_ok=True)
        for image in lyric_images:
            image.unlink(missing_ok=True)


def lyric_lines(text: object) -> list[str]:
    if not isinstance(text, str):
        return []
    lines = []
    for raw in text.splitlines():
        line = raw.strip()
        if not line or (line.startswith("[") and line.endswith("]")):
            continue
        lines.append(line[:120])
    return lines


def workflow_lyric_cues(manifest: dict) -> list[tuple[str, float, float]]:
    soundtrack = manifest.get("soundtrack") or {}
    if soundtrack.get("mode") != "music3" or soundtrack.get("strategy") != "global":
        return []
    if not soundtrack.get("burn_lyrics", True):
        return []
    if soundtrack.get("music_source_id"):
        text = soundtrack.get("source_lyrics", "")
        span = float(soundtrack.get("source_duration") or 0)
    elif soundtrack.get("lyrics_mode") == "lyrics":
        text = soundtrack.get("lyrics", "")
        span = 0.0
    else:
        return []
    lines = lyric_lines(text)[:MAX_LYRIC_CUES]
    if not lines:
        return []
    total = float(manifest["total_duration"])
    span = min(total, span) if span > 0 else total
    step = span / len(lines)
    return [
        (line, round(index * step, 3), round(min(span, (index + 1) * step), 3))
        for index, line in enumerate(lines)
    ]


def _lyric_font(size: int):
    from PIL import ImageFont

    for candidate in LYRIC_FONT_CANDIDATES:
        if os.path.isfile(candidate):
            try:
                return ImageFont.truetype(candidate, size)
            except OSError:
                continue
    try:
        return ImageFont.load_default(size=size)
    except TypeError:
        return ImageFont.load_default()


def render_lyric_image(text: str, width: int, height: int, path: Path) -> Path:
    from PIL import Image, ImageDraw

    font_size = max(16, round(height * 0.05))
    stroke = max(2, font_size // 12)
    font = _lyric_font(font_size)
    max_width = int(width * 0.9)
    probe = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    rows: list[str] = []
    current = ""
    for char in text:
        candidate = current + char
        if current and probe.textlength(candidate, font=font) > max_width:
            split_at = current.rfind(" ")
            if split_at > 0 and char != " ":
                rows.append(current[:split_at])
                current = current[split_at + 1:] + char
            else:
                rows.append(current.rstrip())
                current = char.lstrip()
        else:
            current = candidate
    if current.strip():
        rows.append(current.strip())
    rows = rows[:3] or [" "]
    line_height = round(font_size * 1.3)
    canvas_height = line_height * len(rows) + stroke * 4
    image = Image.new("RGBA", (width, canvas_height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    for row_index, row in enumerate(rows):
        row_width = draw.textlength(row, font=font)
        draw.text(
            ((width - row_width) / 2, stroke * 2 + row_index * line_height), row,
            font=font, fill=(255, 255, 255, 255),
            stroke_width=stroke, stroke_fill=(0, 0, 0, 230),
        )
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, format="PNG")
    return path


def _canvas_dimensions(aspect: tuple[int, int]) -> tuple[int, int]:
    return local_models.video_canvas(aspect, "standard", "h3")
