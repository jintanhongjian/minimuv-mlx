"""Verify completed H3 snapshots and move them without disturbing active downloads."""

from __future__ import annotations

import argparse
import ctypes
import errno
import fcntl
import fnmatch
import hashlib
import json
import os
import re
import sys
import time
from contextlib import ExitStack
from pathlib import Path


def save(path: Path, data: dict) -> None:
    temporary = path.with_suffix(".tmp")
    with temporary.open("w", encoding="utf-8") as stream:
        json.dump(data, stream, indent=2)
        stream.write("\n")
        stream.flush()
        os.fsync(stream.fileno())
    temporary.replace(path)
    fsync_directory(path.parent)


def fsync_directory(path: Path) -> None:
    descriptor = os.open(path, os.O_RDONLY | os.O_DIRECTORY)
    try:
        os.fsync(descriptor)
    finally:
        os.close(descriptor)


def exclusive_move(source: Path, target: Path) -> None:
    libc = ctypes.CDLL(None, use_errno=True)
    if sys.platform == "darwin":
        move = libc.renamex_np
        move.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_uint]
        result = move(os.fsencode(source), os.fsencode(target), 4)  # RENAME_EXCL
    elif sys.platform == "linux":
        move = libc.renameat2
        move.argtypes = [ctypes.c_int, ctypes.c_char_p, ctypes.c_int, ctypes.c_char_p, ctypes.c_uint]
        result = move(-100, os.fsencode(source), -100, os.fsencode(target), 1)  # RENAME_NOREPLACE
    else:
        raise OSError(errno.ENOTSUP, "Exclusive directory rename unsupported")
    if result:
        code = ctypes.get_errno()
        raise OSError(code, os.strerror(code), str(target))
    fsync_directory(target.parent)
    fsync_directory(source.parent)


def prepare(monitor: Path, destination: Path, state: Path) -> None:
    from huggingface_hub import HfApi

    plan = json.loads((monitor / "plan.json").read_text())
    jobs = []
    for job in plan["jobs"]:
        if not re.fullmatch(r"[\w.-]+/[\w.-]+", job["repo_id"]):
            raise ValueError("Invalid repository identity")
        if not re.fullmatch(r"[0-9a-f]{40}", job["revision"]):
            raise ValueError("Download revision must be immutable")
        info = HfApi(token=False).model_info(
            job["repo_id"], revision=job["revision"], files_metadata=True
        )
        if info.sha != job["revision"]:
            raise ValueError("Remote snapshot identity changed")
        files = []
        for item in info.siblings or []:
            name = item.rfilename
            if job.get("include") and not any(fnmatch.fnmatchcase(name, pattern)
                                               for pattern in job["include"]):
                continue
            if any(fnmatch.fnmatchcase(name, pattern) for pattern in job.get("exclude", [])):
                continue
            if Path(name).is_absolute() or ".." in Path(name).parts:
                raise ValueError("Unsafe snapshot filename")
            digest = item.lfs.sha256 if item.lfs else item.blob_id
            if (type(item.size) is not int or item.size < 0 or not isinstance(digest, str)
                    or not re.fullmatch(r"[0-9a-f]{40}|[0-9a-f]{64}", digest)):
                raise ValueError(f"Missing authoritative file size/hash: {name}")
            files.append({"name": name, "bytes": item.size, "hash": digest})
        if not files:
            raise ValueError("Empty snapshot selection")
        target = destination / job["repo_id"].split("/")[1]
        if target.exists() or target.is_symlink():
            raise ValueError(f"Destination already exists; no overwrite allowed: {target}")
        jobs.append({"name": job["name"], "source": job["local_dir"],
                     "destination": str(target), "files": files})
    state.mkdir(parents=True, exist_ok=True)
    if (state / "config.json").exists():
        raise ValueError("Placement config already exists; reuse it or choose a new state")
    save(state / "config.json", {"monitor": str(monitor), "monitor_plan": plan, "jobs": jobs})
    print(json.dumps({job["name"]: {"destination": job["destination"],
                                    "expected_bytes": sum(item["bytes"] for item in job["files"])}
                      for job in jobs}, indent=2), flush=True)


def verify_snapshot(root: Path, files: list[dict]) -> None:
    if root.is_symlink() or not root.is_dir():
        raise ValueError(f"Unsafe snapshot directory: {root}")
    if any(path.is_symlink() for path in root.rglob("*")):
        raise ValueError(f"Snapshot contains symlinks: {root}")
    for item in files:
        path = root / item["name"]
        if (Path(item["name"]).is_absolute() or ".." in Path(item["name"]).parts
                or not path.is_file() or path.stat().st_size != item["bytes"]):
            raise ValueError(f"Snapshot missing/invalid file: {path}")
        digest = (hashlib.sha256() if len(item["hash"]) == 64
                  else hashlib.sha1(f"blob {item['bytes']}\0".encode()))
        with path.open("rb") as stream:
            while chunk := stream.read(8 * 1024 * 1024):
                digest.update(chunk)
        if digest.hexdigest() != item["hash"]:
            raise ValueError(f"Snapshot checksum mismatch; nothing deleted: {path}")
        print(f"VERIFIED: {path.name} ({item['bytes']} bytes)", flush=True)


def run(state: Path, interval: int) -> None:
    config = json.loads((state / "config.json").read_text())
    monitor = Path(config["monitor"])
    with (state / "placement.lock").open("a") as own_lock:
        fcntl.flock(own_lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        while True:
            if json.loads((monitor / "plan.json").read_text()) != config["monitor_plan"]:
                raise ValueError("Monitor plan changed; placement blocked")
            records = json.loads((monitor / "jobs.json").read_text())
            statuses = {job["name"]: records.get(job["name"], {}).get("status", "pending")
                        for job in config["jobs"]}
            if any(value in {"blocked", "exhausted", "stopped"} for value in statuses.values()):
                raise ValueError(f"Downloads require review: {statuses}")
            report = {"status": "waiting", "downloads": statuses, "updated_at": time.time()}
            save(state / "status.json", report)
            print(json.dumps(report), flush=True)
            if all(value == "complete" for value in statuses.values()):
                with (monitor / "monitor.lock").open("a") as monitor_lock:
                    try:
                        fcntl.flock(monitor_lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
                    except BlockingIOError:
                        print("Waiting for downloader to release its locks", flush=True)
                    else:
                        if json.loads((monitor / "plan.json").read_text()) != config["monitor_plan"]:
                            raise ValueError("Monitor plan changed before placement")
                        with ExitStack() as locks:
                            for job in config["jobs"]:
                                source, target = Path(job["source"]), Path(job["destination"])
                                if source.exists():
                                    handle = locks.enter_context(
                                        (source / ".cache" / "download-monitor.lock").open("a")
                                    )
                                    fcntl.flock(handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
                                elif not target.exists():
                                    raise ValueError(f"Snapshot disappeared: {source}")
                            save(state / "status.json", {"status": "verifying", "downloads": statuses,
                                                       "updated_at": time.time()})
                            for job in config["jobs"]:
                                source, target = Path(job["source"]), Path(job["destination"])
                                if source.exists() and (target.exists() or target.is_symlink()):
                                    raise ValueError(f"Destination conflict: {target}")
                                verify_snapshot(source if source.exists() else target, job["files"])
                            moved = []
                            for job in config["jobs"]:
                                source, target = Path(job["source"]), Path(job["destination"])
                                if source.exists():
                                    if target.exists() or target.is_symlink():
                                        raise ValueError(f"Destination conflict: {target}")
                                    target.parent.mkdir(parents=True, exist_ok=True)
                                    if source.stat().st_dev != target.parent.stat().st_dev:
                                        raise ValueError("Placement requires a same-filesystem atomic move")
                                    exclusive_move(source, target)
                                moved.append({"name": job["name"], "destination": str(target),
                                              "checksum_verified": True})
                                save(state / "receipt.json", {"jobs": moved, "complete": False})
                            save(state / "receipt.json", {"jobs": moved, "complete": True})
                            save(state / "status.json", {"status": "complete", "jobs": moved,
                                                       "updated_at": time.time()})
                            print("PLACEMENT COMPLETE: all snapshots verified and moved", flush=True)
                            return
            time.sleep(interval)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--state", required=True, type=Path)
    parser.add_argument("--prepare", action="store_true")
    parser.add_argument("--monitor-state", type=Path)
    parser.add_argument("--destination", type=Path)
    parser.add_argument("--interval", type=int, default=60)
    args = parser.parse_args()
    try:
        if args.interval < 1:
            raise ValueError("Interval must be positive")
        if args.prepare:
            if args.monitor_state is None or args.destination is None:
                raise ValueError("Preparation requires monitor-state and destination")
            prepare(args.monitor_state.resolve(), args.destination.expanduser().resolve(),
                    args.state.resolve())
        else:
            run(args.state.resolve(), args.interval)
    except (OSError, ValueError, KeyError, TypeError, AttributeError) as error:
        if args.state.is_dir():
            save(args.state / "status.json", {"status": "blocked", "error": str(error)})
        print(f"H3 placement failed: {error}", file=sys.stderr, flush=True)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
