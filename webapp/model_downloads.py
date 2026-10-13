"""Project-owned, hash-verified HTTP model downloads and resumable supervision."""
from __future__ import annotations

import base64
import atexit
import fcntl
import fnmatch
import hashlib
import json
import logging
import os
import re
import ssl
import subprocess
import sys
import threading
import time
import uuid
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

import certifi

from . import local_models

ROOT = Path(__file__).resolve().parents[1]
STATE_ROOT = Path.home() / ".cache/minimuv/model-downloads"
LEGACY_REPOS = {
    "h3": "ddalcu/MiniMax-H3-FL2VA-MLX-Serve-4bit",
    "hidream": "mlx-community/HiDream-O1-Image-Dev-mlx-q6",
    "music3": "mlx-community/MiniMax-Music3-8bit",
    "voxcpm2-4bit": "openbmb/VoxCPM2",
    "qwen3-tts-voicedesign-8bit": "Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
}
logger = logging.getLogger(__name__)
_lock = threading.RLock()
_jobs: dict[str, dict] = {}


class ResumeError(RuntimeError):
    """Unsafe transfers must not be retried or reset automatically."""


def _write(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.{uuid.uuid4().hex}.tmp")
    try:
        temporary.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
        os.chmod(temporary, 0o600)
        os.replace(temporary, path)
    finally:
        temporary.unlink(missing_ok=True)


def _spec(model: str) -> dict:
    manifest = json.loads((ROOT / "third_party/local_models.json").read_text())["models"]
    if model in manifest:
        return manifest[model]
    if model in LEGACY_REPOS:
        return {"repository": LEGACY_REPOS[model], "revision": None, "exclude": [],
                "download_supported": False}
    raise ValueError("invalid_generation_model")


def _identity(model: str, directory: Path) -> str:
    return hashlib.sha256(f"{model}:{directory.resolve()}".encode()).hexdigest()


def _safe_path(directory: Path, relative: str) -> Path:
    path = Path(relative)
    if path.is_absolute() or ".." in path.parts or not path.parts:
        raise ResumeError("Invalid snapshot file path")
    target = directory / path
    if target.is_symlink() or any(p.is_symlink() for p in target.parents):
        raise ResumeError("Symbolic link in download destination")
    return target


def _verify(path: Path, size: int, etag: str) -> None:
    if not re.fullmatch(r"(?:[0-9a-f]{40}|[0-9a-f]{64})", etag):
        raise ResumeError("Unknown checksum format; bytes retained")
    if path.stat().st_size != size:
        raise ResumeError(f"Size mismatch: {path.name}; bytes retained")
    digest = hashlib.sha256() if len(etag) == 64 else hashlib.sha1(f"blob {size}\0".encode())
    with path.open("rb") as stream:
        while chunk := stream.read(8 * 1024 * 1024):
            digest.update(chunk)
    if digest.hexdigest() != etag:
        raise ResumeError(f"Checksum mismatch: {path.name}; bytes retained")


def _partial(directory: Path, relative: str, etag: str, size: int) -> Path:
    target = _safe_path(directory, relative)
    digest = base64.urlsafe_b64encode(hashlib.sha1(f"{target.name}.metadata".encode()).digest()).decode()
    cache = _safe_path(directory, f".cache/huggingface/download/{Path(relative).parent}")
    cache.mkdir(parents=True, exist_ok=True)
    canonical = cache / f"{digest}.{etag}.incomplete"
    candidates = [canonical] if canonical.exists() else []
    candidates += [p for p in cache.glob(f"{digest}.{etag}.*.incomplete")
                   if re.fullmatch(r"[0-9a-f]{8}", p.name.split(".")[-2])]
    if any(p.is_symlink() for p in candidates):
        raise ResumeError("Symbolic link in partial cache")
    if candidates:
        best = max(candidates, key=lambda p: p.stat().st_size)
        if best.stat().st_size > size:
            raise ResumeError(f"Oversized partial: {relative}; bytes retained")
        if best != canonical:
            if canonical.exists():
                canonical.rename(cache / f"{digest}.{etag}.{uuid.uuid4().hex[:8]}.incomplete")
            best.rename(canonical)
    return canonical


def _download_ssl_context() -> ssl.SSLContext:
    context = ssl.create_default_context()
    # Python.org macOS installations may have no default CA bundle.
    context.load_verify_locations(cafile=certifi.where())
    return context


def transfer(url: str, partial: Path, target: Path, size: int, etag: str) -> None:
    """Append only an accepted Range; never truncate or silently restart."""
    offset = partial.stat().st_size if partial.exists() else 0
    if offset > size:
        raise ResumeError("Partial exceeds expected size")
    print(f"RESUME OFFSET: {target.name} = {offset} bytes", flush=True)
    if size == 0:
        partial.touch(exist_ok=True)
    if offset < size:
        headers = {"Accept-Encoding": "identity"}
        if offset:
            headers["Range"] = f"bytes={offset}-"
        with urlopen(Request(url, headers=headers), timeout=60,
                     context=_download_ssl_context()) as response:
            content_range = re.fullmatch(r"bytes (\d+)-(\d+)/(\d+)",
                                         response.headers.get("Content-Range", ""))
            if (offset and response.status != 206) or (response.status == 206 and (not content_range
                           or int(content_range[1]) != offset
                           or int(content_range[3]) != size
                           or int(content_range[2]) != size - 1)):
                raise ResumeError("Server refused exact Range; existing bytes retained")
            if response.status not in (200, 206) or response.headers.get("Content-Encoding", "identity") != "identity":
                raise ResumeError("Unexpected HTTP transfer response")
            if offset:
                print(f"RESUME ACCEPTED: HTTP 206, {content_range[0]}", flush=True)
            with partial.open("ab") as output:
                written = offset
                while chunk := response.read(1024 * 1024):
                    if written + len(chunk) > size:
                        raise ResumeError("Response exceeds expected file size")
                    output.write(chunk)
                    output.flush()
                    written += len(chunk)
    if partial.stat().st_size < size:
        raise ConnectionError("Transfer interrupted; partial retained for retry")
    _verify(partial, size, etag)
    target.parent.mkdir(parents=True, exist_ok=True)
    os.replace(partial, target)
    print(f"VERIFIED: {target.name}", flush=True)


def _plan(model: str, directory: Path, state: Path) -> dict:
    from huggingface_hub import HfApi, get_hf_file_metadata, hf_hub_url
    spec = _spec(model)
    if spec.get("download_supported") is False:
        raise ValueError("This model is externally managed; configure its verified local package path.")
    path = state / "plan.json"
    if path.exists():
        plan = json.loads(path.read_text())
        if plan["repository"] != spec["repository"] or (spec["revision"] and plan["revision"] != spec["revision"]):
            raise ResumeError("Saved snapshot identity changed")
        return plan
    info = HfApi().model_info(spec["repository"], revision=spec["revision"], token=False)
    if not info.sha or not re.fullmatch(r"[0-9a-f]{40}", info.sha):
        raise ResumeError("Hub did not resolve an immutable snapshot")
    files = []
    for sibling in info.siblings or []:
        relative = sibling.rfilename
        if any(fnmatch.fnmatch(relative, pattern) for pattern in spec["exclude"]):
            continue
        _safe_path(directory, relative)
        metadata = get_hf_file_metadata(hf_hub_url(spec["repository"], relative, revision=info.sha), token=False)
        etag = metadata.etag
        if not isinstance(metadata.size, int) or metadata.size < 0 or not etag or not re.fullmatch(r"(?:[0-9a-f]{40}|[0-9a-f]{64})", etag):
            raise ResumeError(f"Unknown size/hash for {relative}")
        files.append({"path": relative, "size": metadata.size, "etag": etag})
    if not files:
        raise ResumeError("Empty model snapshot")
    plan = {"repository": spec["repository"], "revision": info.sha, "files": files,
            "strict_tree": bool(spec.get("strict_tree"))}
    _write(path, plan)
    return plan


def worker(model: str, directory: Path) -> None:
    from huggingface_hub import get_hf_file_metadata, hf_hub_url
    directory = directory.expanduser().absolute()
    _safe_path(directory, "config.json")
    state = STATE_ROOT / _identity(model, directory)
    state.mkdir(parents=True, exist_ok=True)
    target_lock = STATE_ROOT / (hashlib.sha256(str(directory.resolve()).encode()).hexdigest() + ".lock")
    with target_lock.open("a") as guard:
        try:
            fcntl.flock(guard, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as exc:
            raise ResumeError("Another downloader owns this destination") from exc
        plan = _plan(model, directory, state)
        for item in plan["files"]:
            target = _safe_path(directory, item["path"])
            # Honor the same per-file advisory lock as HF local-dir downloads.
            cache = _safe_path(directory, f".cache/huggingface/download/{Path(item['path']).parent}")
            cache.mkdir(parents=True, exist_ok=True)
            with (cache / (target.name + ".lock")).open("a") as file_guard:
                try:
                    fcntl.flock(file_guard, fcntl.LOCK_EX | fcntl.LOCK_NB)
                except BlockingIOError as exc:
                    raise ResumeError(f"Another downloader owns {item['path']}") from exc
                if target.exists():
                    _verify(target, item["size"], item["etag"])
                    continue
                partial = _partial(directory, item["path"], item["etag"], item["size"])
                metadata = get_hf_file_metadata(
                    hf_hub_url(plan["repository"], item["path"], revision=plan["revision"]), token=False)
                if metadata.etag != item["etag"] or metadata.size != item["size"]:
                    raise ResumeError("Remote object changed since saved plan")
                transfer(metadata.location, partial, target, item["size"], item["etag"])
                (cache / (target.name + ".metadata")).write_text(
                    f"{plan['revision']}\n{item['etag']}\n{time.time()}\n")
        if plan["strict_tree"]:
            # Strict runtimes reject cache files; archive instead of discarding fragments.
            cache_source = directory / ".cache/huggingface"
            archive = state / f"retained-hf-cache-{uuid.uuid4().hex}"
            cache_source.rename(archive)
            cache = directory / ".cache"
            if not any(cache.iterdir()):
                cache.rmdir()
            attributes = directory / ".gitattributes"
            if attributes.exists():
                attributes.rename(state / f"retained-gitattributes-{uuid.uuid4().hex}")
        _write(state / "result.json", {"status": "completed", "error": "", "revision": plan["revision"]})


def components(model: str, directory: Path, gemma: Path) -> list[tuple[str, Path]]:
    _spec(model)
    result = [(model, directory.expanduser().absolute())]
    if model in local_models.VIDEO_MODELS:
        result.append(("gemma-3-12b-it-4bit", gemma.expanduser().absolute()))
    elif model in local_models.MUSIC_MODELS:
        result.append(("yue2-vae", local_models.YUE_VAE_PATH))
    return result


def _external(directory: Path) -> bool:
    processes = subprocess.check_output(["ps", "-axo", "command="], text=True)
    return any(str(directory) in line and ("hf download " in line or "hf-resume.py download " in line
                                          or "-m webapp.model_downloads " in line)
               for line in processes.splitlines())


def _supervise(key: str, model: str, directory: Path, event: threading.Event) -> None:
    state = STATE_ROOT / key
    state.mkdir(parents=True, exist_ok=True)
    try:
        for attempt in range(1, 13):
            if event.is_set():
                break
            (state / "result.json").unlink(missing_ok=True)
            with (state / "download.log").open("a") as log:
                process = subprocess.Popen(
                    [sys.executable, "-u", "-m", "webapp.model_downloads", model, str(directory)],
                    cwd=ROOT, stdout=log, stderr=subprocess.STDOUT,
                )
                with _lock:
                    _jobs[key].update(process=process, state="downloading", attempt=attempt, error="")
                while process.poll() is None:
                    if event.wait(1):
                        process.terminate()
                        try:
                            process.wait(timeout=10)
                        except subprocess.TimeoutExpired:
                            process.kill()
                            process.wait()
                        break
                code = process.wait()
            if event.is_set():
                break
            if code == 0:
                with _lock:
                    _jobs[key].update(state="completed", process=None)
                return
            result_path = state / "result.json"
            detail = json.loads(result_path.read_text()).get("error", "") if result_path.exists() else f"Downloader exited with status {code}; see {state / 'download.log'}"
            with _lock:
                _jobs[key].update(state="error", error=detail, process=None)
            logger.warning("Model download %s attempt %s failed: %s", model, attempt, detail)
            if code == 42 or attempt == 12:
                return
            if event.wait(300):
                break
        with _lock:
            _jobs[key].update(state="paused", process=None)
    except (OSError, ValueError) as exc:
        logger.exception("Model download supervisor failed")
        with _lock:
            _jobs[key].update(state="error", error=str(exc))
    finally:
        with _lock:
            _jobs[key]["thread"] = None
            _write(state / "status.json", {
                "state": _jobs[key]["state"], "error": _jobs[key]["error"],
            })


def start(model: str, directory: Path, gemma: Path) -> None:
    if _spec(model).get("download_supported") is False:
        raise ValueError("This model is externally managed; configure its verified local package path.")
    targets = components(model, directory, gemma)
    with _lock:
        for name, path in targets:
            if _jobs.get(_identity(name, path), {}).get("thread"):
                continue
            if _external(path):
                raise RuntimeError("download_external_active")
            _safe_path(path, "config.json")
        for name, path in targets:
            key = _identity(name, path)
            existing = _jobs.get(key)
            if existing and existing.get("thread"):
                continue
            event = threading.Event()
            thread = threading.Thread(target=_supervise, args=(key, name, path, event), daemon=True)
            _jobs[key] = {"event": event, "thread": thread, "state": "downloading", "error": "", "process": None}
            thread.start()


def pause(model: str, directory: Path, gemma: Path) -> None:
    if _spec(model).get("download_supported") is False:
        raise ValueError("This model is externally managed; there is no project download to pause.")
    targets = components(model, directory, gemma)
    with _lock:
        if any(not _jobs.get(_identity(name, path), {}).get("thread") and _external(path)
               for name, path in targets):
            raise RuntimeError("download_external_active")
        for name, path in targets:
            job = _jobs.get(_identity(name, path))
            if job and job.get("thread"):
                job["event"].set()


def assert_paths_idle(previous: dict, updated: dict) -> None:
    """Prevent losing the pause/resume controls for a live destination."""
    with _lock:
        for model, entry in previous["models"].items():
            targets = components(model, Path(entry["model_path"]), Path(previous["gemma_path"]))
            if targets == components(model, Path(updated["models"][model]["model_path"]), Path(updated["gemma_path"])):
                continue
            if any(_jobs.get(_identity(name, path), {}).get("thread") for name, path in targets):
                raise ValueError("Pause active downloads before changing model or Gemma paths.")


def progress(model: str, directory: Path, gemma: Path) -> dict:
    if _spec(model).get("download_supported") is False:
        return {"download_state": "manual", "download_catalog": False,
                "download_percent": None, "download_in_progress": False, "download_error": ""}
    parts = []
    for name, path in components(model, directory, gemma):
        key = _identity(name, path)
        plan_path = STATE_ROOT / key / "plan.json"
        if plan_path.exists():
            plan = json.loads(plan_path.read_text())
            result_path = STATE_ROOT / key / "result.json"
            receipt = json.loads(result_path.read_text()) if result_path.exists() else {}
            verified = receipt.get("status") == "completed" and receipt.get("revision") == plan.get("revision")
            total = sum(item["size"] for item in plan["files"])
            downloaded = 0
            active = False
            for item in plan["files"]:
                target = path / item["path"]
                if target.is_file() and target.stat().st_size == item["size"]:
                    downloaded += item["size"]
                    continue
                digest = base64.urlsafe_b64encode(hashlib.sha1(f"{target.name}.metadata".encode()).digest()).decode()
                cache = path / ".cache/huggingface/download" / Path(item["path"]).parent
                sizes = []
                for p in cache.glob(f"{digest}.{item['etag']}*.incomplete"):
                    try:
                        stat = p.stat()
                    except FileNotFoundError:
                        continue
                    sizes.append(stat.st_size)
                    active |= time.time() - stat.st_mtime < 300
                downloaded += min(max(sizes, default=0), item["size"])
            status = "completed" if downloaded == total and verified else "downloading" if active else "paused" if downloaded else "not_started"
            part = dict(download_state=status, downloaded_bytes=downloaded, total_bytes=total,
                        download_percent=100 if status == "completed" else round(min(99.9, downloaded / total * 100), 1),
                        download_error="", download_in_progress=active)
        elif name in LEGACY_REPOS:
            part = dict(download_state="not_started", download_percent=None,
                        download_error="", download_in_progress=False)
        else:
            part = local_models.download_progress(name, path)
        with _lock:
            job = _jobs.get(key)
            if job:
                state = job["state"]
                if state == "completed" and part["download_state"] != "completed":
                    state = "paused"
                part.update(download_state=state, download_error=job["error"],
                            download_in_progress=job["state"] == "downloading")
                if state != "completed" and isinstance(part.get("download_percent"), (int, float)):
                    part["download_percent"] = min(99.9, part["download_percent"])
            else:
                saved_status = STATE_ROOT / key / "status.json"
                if saved_status.exists():
                    saved = json.loads(saved_status.read_text())
                    if saved["state"] == "error" and part["download_state"] != "completed":
                        part.update(download_state="error", download_error=saved["error"],
                                    download_in_progress=False)
        parts.append(dict(part, name="model" if name == model else "Gemma" if name.startswith("gemma-") else "VAE"))
    result = dict(parts[0])
    if len(parts) > 1:
        known = all("total_bytes" in part for part in parts)
        if known:
            total = sum(part["total_bytes"] for part in parts)
            downloaded = sum(part["downloaded_bytes"] for part in parts)
            complete = all(part["download_state"] == "completed" for part in parts)
            result.update(total_bytes=total, downloaded_bytes=downloaded,
                          download_percent=100 if complete else round(min(99.9, downloaded / total * 100), 1))
        result["download_components"] = parts
        if any(part["download_state"] == "error" for part in parts):
            result.update(download_state="error", download_error="; ".join(p["download_error"] for p in parts if p["download_error"]))
        elif any(part["download_in_progress"] for part in parts):
            result.update(download_state="downloading", download_in_progress=True)
        elif all(part["download_state"] == "completed" for part in parts):
            result.update(download_state="completed", download_in_progress=False)
        else:
            result.update(download_state="paused" if result.get("downloaded_bytes", 0) else "not_started",
                          download_in_progress=False)
    result["download_catalog"] = True
    return result


def shutdown() -> None:
    with _lock:
        jobs = list(_jobs.values())
        for job in jobs:
            job["event"].set()
    for job in jobs:
        if job.get("thread"):
            job["thread"].join(timeout=15)


atexit.register(shutdown)


if __name__ == "__main__":
    from huggingface_hub.utils import HfHubHTTPError
    model, destination = sys.argv[1:]
    state = STATE_ROOT / _identity(model, Path(destination))
    try:
        worker(model, Path(destination))
    except (ResumeError, HTTPError, HfHubHTTPError) as error:
        _write(state / "result.json", {"status": "error", "error": str(error)})
        logger.exception("Download blocked")
        status = error.code if isinstance(error, HTTPError) else (
            error.response.status_code if isinstance(error, HfHubHTTPError) and error.response is not None else None
        )
        sys.exit(42 if isinstance(error, ResumeError) or status in (401, 403, 404) else 1)
    except (OSError, URLError, ValueError, ConnectionError) as error:
        _write(state / "result.json", {"status": "error", "error": str(error)})
        logger.exception("Download failed; partial retained")
        sys.exit(1)
