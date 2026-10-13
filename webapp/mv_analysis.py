"""Bounded CPU music-analysis jobs and immutable, content-bound result caching."""

from __future__ import annotations

import copy
import hashlib
import json
import math
import os
import subprocess
import tempfile
import threading
import time
import uuid
from pathlib import Path

from . import mv_music, mv_projects

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "third_party" / "mv_analysis"
SCRIPT = ROOT / "scripts" / "analyze_mv_timeline.py"
MAX_RESULT_BYTES = 2 * 1024 * 1024
TIMEOUT_SECONDS = 600
_LOCK = threading.RLock()
_jobs: dict[str, dict] = {}
_active: str | None = None


def active() -> bool:
    with _LOCK:
        return _active is not None


def _source(path: Path) -> str:
    if path.is_symlink() or not path.is_file() or not 0 < path.stat().st_size <= mv_music.MAX_UPLOAD_BYTES:
        raise ValueError("mv_analysis_source_invalid")
    mv_music.inspect_wav(path)
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def _binding(path: Path) -> dict:
    digest = hashlib.sha256()
    for asset in (SCRIPT, RUNTIME / "runtime.json", ROOT / "scripts" / "check_mv_runtime.py"):
        digest.update(asset.read_bytes())
    return {"audio_sha256": _source(path), "analyzer_sha256": digest.hexdigest(), "version": 1}


def _key(binding: dict) -> str:
    return hashlib.sha256(json.dumps(binding, sort_keys=True).encode()).hexdigest()


def _directory(output_root: Path) -> Path:
    with mv_projects.storage_directory(output_root) as root:
        music = root / "music"
        if music.is_symlink() or (music.exists() and not music.is_dir()):
            raise RuntimeError("mv_analysis_storage_invalid")
        directory = root / "music" / "analysis"
        if directory.is_symlink() or (directory.exists() and not directory.is_dir()):
            raise RuntimeError("mv_analysis_storage_invalid")
        return directory


def validate_result(data: object) -> dict:
    fields = {"duration", "sample_rate", "bin_seconds", "waveform", "energy",
              "beats", "downbeats", "bpm", "device", "dbn"}
    if not isinstance(data, dict) or set(data) != fields:
        raise ValueError("mv_analysis_result_invalid")
    def number(value: object) -> bool:
        return type(value) in (int, float) and math.isfinite(value)
    duration, bin_seconds = data["duration"], data["bin_seconds"]
    if (not number(duration) or not 0 < duration <= 720
            or not number(bin_seconds) or not 0.099 <= bin_seconds <= 0.101
            or type(data["sample_rate"]) is not int or not 8000 <= data["sample_rate"] <= 192000
            or data["device"] != "cpu" or data["dbn"] is not False):
        raise ValueError("mv_analysis_result_invalid")
    expected = math.ceil(duration / bin_seconds - 1e-8)
    for key in ("waveform", "energy"):
        values = data[key]
        if (not isinstance(values, list) or len(values) != expected or len(values) > 7201
                or any(not number(value) or value < 0 for value in values)):
            raise ValueError("mv_analysis_result_invalid")
    for key in ("beats", "downbeats"):
        values = data[key]
        if (not isinstance(values, list) or len(values) > 36000
                or any(not number(value) or not 0 <= value < duration for value in values)
                or any(a >= b for a, b in zip(values, values[1:]))):
            raise ValueError("mv_analysis_result_invalid")
    if not set(data["downbeats"]).issubset(data["beats"]):
        raise ValueError("mv_analysis_result_invalid")
    if data["bpm"] is not None and (not number(data["bpm"]) or data["bpm"] <= 0):
        raise ValueError("mv_analysis_result_invalid")
    return data


def _read(path: Path, binding: dict) -> dict | None:
    if not path.exists() and not path.is_symlink():
        return None
    if path.is_symlink() or not path.is_file() or path.stat().st_size > MAX_RESULT_BYTES:
        raise RuntimeError("mv_analysis_storage_invalid")
    try:
        record = json.loads(path.read_text(encoding="utf-8"))
        if (not isinstance(record, dict) or set(record) != {"binding", "result"}
                or record["binding"] != binding):
            raise ValueError("invalid_binding")
        return validate_result(record["result"])
    except (ValueError, TypeError, UnicodeDecodeError) as exc:
        raise RuntimeError("mv_analysis_storage_invalid") from exc


def cached(output_root: Path, source: Path) -> dict | None:
    binding = _binding(source)
    return _read(_directory(output_root) / f"{_key(binding)}.json", binding)


def _public(job: dict) -> dict:
    return copy.deepcopy({key: job[key] for key in
                          ("id", "music_source_id", "status", "stage", "logs", "error", "result", "cached")})


def get(job_id: str) -> dict:
    with _LOCK:
        if job_id not in _jobs:
            raise ValueError("mv_analysis_not_found")
        return _public(_jobs[job_id])


def cancel(job_id: str) -> dict:
    with _LOCK:
        if job_id not in _jobs:
            raise ValueError("mv_analysis_not_found")
        job = _jobs[job_id]
        if job["status"] not in {"queued", "running", "cancelling"}:
            raise ValueError("mv_analysis_not_active")
        job["cancel"].set()
        job["status"] = "cancelling"
        return _public(job)


def start(output_root: Path, music_id: str, source: Path) -> dict:
    global _active
    with _LOCK:
        if _active is not None:
            raise ValueError("mv_analysis_already_running")
        python = RUNTIME / ".venv" / "bin" / "python"
        if not python.is_file() or not python.resolve().is_relative_to(RUNTIME):
            raise ValueError("mv_analysis_runtime_missing")
        binding = _binding(source)
        directory = _directory(output_root)
        result = _read(directory / f"{_key(binding)}.json", binding)
        if result is None and directory.exists() and len(list(directory.iterdir())) >= 100:
            raise ValueError("mv_analysis_storage_full")
        for key in list(_jobs):
            if len(_jobs) < 32:
                break
            if _jobs[key]["status"] in {"completed", "failed", "cancelled"}:
                del _jobs[key]
        job_id = str(uuid.uuid4())
        job = {"id": job_id, "music_source_id": music_id, "status": "completed" if result else "queued",
               "stage": "complete" if result else "queued", "logs": [], "error": "",
               "result": result, "cached": result is not None, "cancel": threading.Event()}
        _jobs[job_id] = job
        if result is None:
            _active = job_id
            try:
                threading.Thread(target=_run, args=(job_id, source, directory, binding), daemon=True).start()
            except RuntimeError:
                del _jobs[job_id]
                _active = None
                raise
        return _public(job)


def _run(job_id: str, source: Path, directory: Path, binding: dict) -> None:
    global _active
    process = None
    job = _jobs[job_id]
    try:
        temporary_root = RUNTIME / ".cache" / "tmp"
        if not temporary_root.resolve().is_relative_to(RUNTIME):
            raise RuntimeError("mv_analysis_temp_invalid")
        temporary_root.mkdir(parents=True, exist_ok=True)
        with tempfile.TemporaryDirectory(prefix="timeline-", dir=temporary_root) as temporary:
            output = Path(temporary) / "result.json"
            log = Path(temporary) / "worker.log"
            env = os.environ.copy()
            for key in ("PYTHONPATH", "PYTHONHOME"):
                env.pop(key, None)
            env.update(TMPDIR=str(temporary), TORCH_HOME=str(RUNTIME / ".torch"),
                       PYTHONNOUSERSITE="1", OMP_NUM_THREADS="4", MKL_NUM_THREADS="4")
            with log.open("wb") as stream:
                process = subprocess.Popen(
                    [str(RUNTIME / ".venv" / "bin" / "python"), "-I", str(SCRIPT),
                     str(source), "--output", str(output)], stdout=stream, stderr=stream, env=env,
                )
                began = time.monotonic()
                with _LOCK:
                    if not job["cancel"].is_set():
                        job["status"] = "running"
                while True:
                    with log.open("rb") as reader:
                        reader.seek(max(0, log.stat().st_size - 4096))
                        lines = reader.read().decode("utf-8", errors="replace").splitlines()
                    with _LOCK:
                        job["logs"] = lines[-20:]
                        for line in lines:
                            if line in {"signal", "beats", "complete"}:
                                job["stage"] = line
                    if job["cancel"].is_set():
                        raise InterruptedError("mv_analysis_cancelled")
                    if time.monotonic() - began > TIMEOUT_SECONDS:
                        raise TimeoutError("mv_analysis_timeout")
                    if process.poll() is not None:
                        break
                    job["cancel"].wait(0.2)
            if process.returncode:
                raise RuntimeError(f"mv_analysis_worker_failed ({process.returncode}): " + "\n".join(job["logs"]))
            if not output.is_file() or output.stat().st_size > MAX_RESULT_BYTES:
                raise RuntimeError("mv_analysis_result_missing")
            result = validate_result(json.loads(output.read_text(encoding="utf-8")))
            if _binding(source) != binding:
                raise ValueError("mv_analysis_source_changed")
            with _LOCK:
                if job["cancel"].is_set():
                    raise InterruptedError("mv_analysis_cancelled")
                if (any(path.is_symlink() for path in (directory, directory.parent, directory.parents[1]))
                        or not directory.resolve().is_relative_to(directory.parents[2].resolve())):
                    raise RuntimeError("mv_analysis_storage_invalid")
                directory.mkdir(parents=True, exist_ok=True, mode=0o700)
                os.chmod(directory, 0o700)
                encoded = json.dumps({"binding": binding, "result": result}, allow_nan=False).encode()
                if len(encoded) > MAX_RESULT_BYTES:
                    raise ValueError("mv_analysis_result_invalid")
                temporary_path = None
                try:
                    with tempfile.NamedTemporaryFile(dir=directory, delete=False) as file:
                        temporary_path = Path(file.name)
                        file.write(encoded)
                        file.flush()
                        os.fsync(file.fileno())
                    target = directory / f"{_key(binding)}.json"
                    os.link(temporary_path, target)
                finally:
                    if temporary_path is not None:
                        temporary_path.unlink(missing_ok=True)
                job.update(status="completed", stage="complete", result=result)
    except InterruptedError:
        with _LOCK:
            job.update(status="cancelled", stage="cancelled")
    except (OSError, ValueError, RuntimeError) as exc:
        with _LOCK:
            job.update(status="failed", error=str(exc))
    finally:
        if process is not None and process.poll() is None:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait()
        with _LOCK:
            _active = None
