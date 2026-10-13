"""Install the isolated, project-local Beat This CPU runtime."""

from __future__ import annotations

import argparse
import contextlib
import fcntl
import hashlib
import json
import os
import platform
import re
import shutil
import ssl
import subprocess
import sys
import tarfile
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "third_party" / "mv_analysis"
SOURCE = ROOT / "third_party" / "beat_this"


def fingerprint(path: Path, algorithm: str) -> str:
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, algorithm).hexdigest()


def verify_file(path: Path, size: int, algorithm: str, expected: str) -> None:
    if path.is_symlink() or not path.is_file():
        raise ValueError(f"Not a regular file: {path}")
    if path.stat().st_size != size or fingerprint(path, algorithm) != expected:
        raise ValueError(f"Size/checksum mismatch; preserved for inspection: {path}")


def download(
    url: str, target: Path, size: int, algorithm: str, expected: str,
    *, etag: str | None = None,
) -> None:
    if target.exists() or target.is_symlink():
        verify_file(target, size, algorithm, expected)
        print(f"Verified existing file: {target.name}", flush=True)
        return
    partial = target.with_name(target.name + ".part")
    if partial.is_symlink() or (partial.exists() and not partial.is_file()):
        raise ValueError(f"Unsafe partial file: {partial}")
    target.parent.mkdir(parents=True, exist_ok=True)
    context = ssl.create_default_context()
    with contextlib.suppress(ImportError):
        import certifi
        context.load_verify_locations(certifi.where())
    for attempt in range(1, 6):
        offset = partial.stat().st_size if partial.exists() else 0
        if offset > size:
            raise ValueError(f"Oversized partial preserved: {partial}")
        if offset == size:
            break
        headers = {"Accept-Encoding": "identity", "User-Agent": "MiniMuv-MV-deploy/1"}
        if etag:
            headers["If-Match"] = etag
        if offset:
            headers["Range"] = f"bytes={offset}-"
        print(f"{target.name}: {'RESUME OFFSET' if offset else 'START FROM ZERO'} "
              f"{offset}/{size} bytes; attempt {attempt}/5", flush=True)
        try:
            request = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(request, timeout=60, context=context) as response:
                if offset:
                    match = re.fullmatch(
                        r"bytes (\d+)-(\d+)/(\d+)", response.headers.get("Content-Range", "")
                    )
                    if (response.status != 206 or not match
                            or int(match[1]) != offset or int(match[3]) != size
                            or int(match[2]) != size - 1):
                        raise ValueError("Resume rejected: expected exact HTTP 206 Content-Range")
                    print(f"RESUME ACCEPTED: {offset}", flush=True)
                elif response.status != 200:
                    raise ValueError(f"Unexpected download status: {response.status}")
                if etag and response.headers.get("ETag") != etag:
                    raise ValueError("Remote ETag changed; download blocked")
                total, last_report = offset, time.monotonic()
                with partial.open("ab") as stream:
                    while block := response.read(1024 * 1024):
                        if total + len(block) > size:
                            raise ValueError("Download exceeded bound size; partial preserved")
                        stream.write(block)
                        total += len(block)
                        if time.monotonic() - last_report >= 5:
                            print(f"{target.name}: {total}/{size} bytes", flush=True)
                            last_report = time.monotonic()
                    stream.flush()
                    os.fsync(stream.fileno())
                if total != size:
                    raise urllib.error.URLError(f"Incomplete response: {total}/{size} bytes")
            break
        except urllib.error.HTTPError as error:
            if error.code not in {408, 429, 500, 502, 503, 504} or attempt == 5:
                raise
            print(f"HTTP {error.code}; preserving partial and retrying", flush=True)
            time.sleep(5)
        except (urllib.error.URLError, TimeoutError, ConnectionError) as error:
            if attempt == 5:
                raise
            print(f"{error}; preserving partial and retrying", flush=True)
            time.sleep(5)
    verify_file(partial, size, algorithm, expected)
    partial.replace(target)
    print(f"Checksum verified: {target.name} ({size} bytes)", flush=True)


def vendor_source(archive: Path, commit: str) -> None:
    if SOURCE.is_symlink():
        raise ValueError(f"Source directory cannot be a symlink: {SOURCE}")
    with tarfile.open(archive) as bundle:
        members = bundle.getmembers()
        prefix = f"beat_this-{commit}"
        for member in members:
            parts = Path(member.name).parts
            if (not parts or parts[0] != prefix or ".." in parts
                    or not (member.isfile() or member.isdir())):
                raise ValueError(f"Unsafe archive member: {member.name}")
        if SOURCE.exists():
            for member in members:
                if not member.isfile():
                    continue
                path = SOURCE.joinpath(*Path(member.name).parts[1:])
                payload = bundle.extractfile(member)
                if payload is None:
                    raise ValueError(f"Missing archive payload: {member.name}")
                with payload:
                    if path.is_symlink() or not path.is_file() or path.read_bytes() != payload.read():
                        raise ValueError(f"Vendored source differs; refusing overwrite: {path}")
            print("Existing Beat This source matches the pinned archive", flush=True)
        else:
            bundle.extractall(SOURCE.parent, filter="data")
            SOURCE.parent.joinpath(prefix).rename(SOURCE)
            print(f"Vendored Beat This at {commit}", flush=True)


def install(with_checkpoint: bool) -> None:
    if sys.version_info < (3, 11):
        raise ValueError("The deployment script requires Python 3.11 or newer")
    if platform.system() != "Darwin" or platform.machine() != "arm64":
        raise ValueError("This lock is validated for Apple Silicon macOS only")
    uv = shutil.which("uv")
    if uv is None:
        raise ValueError("uv is required; install it before deploying the MV runtime")
    for path in (RUNTIME, SOURCE, RUNTIME / ".cache", RUNTIME / ".python", RUNTIME / ".venv"):
        if path.is_symlink() or not path.resolve().is_relative_to(ROOT):
            raise ValueError(f"Deployment path must stay inside the project: {path}")
    spec = json.loads((RUNTIME / "runtime.json").read_text())
    env = os.environ.copy()
    for key in ("PYTHONPATH", "PYTHONHOME"):
        env.pop(key, None)
    env.update(
        UV_CACHE_DIR=str(RUNTIME / ".cache" / "uv"),
        UV_PYTHON_INSTALL_DIR=str(RUNTIME / ".python"),
        UV_LINK_MODE="copy",
        PYTHONNOUSERSITE="1",
        TORCH_HOME=str(RUNTIME / ".torch"),
        TMPDIR=str(RUNTIME / ".cache" / "tmp"),
    )
    cache = RUNTIME / ".cache"
    cache.mkdir(parents=True, exist_ok=True)
    (cache / "tmp").mkdir(parents=True, exist_ok=True)
    with (cache / "install.lock").open("a") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as error:
            raise ValueError("Another MV installer is active") from error
        source = spec["source"]
        archive = cache / f"beat_this-{source['commit']}.tar.gz"
        download(source["url"], archive, source["bytes"], "sha256", source["sha256"])
        vendor_source(archive, source["commit"])
        subprocess.run(
            [uv, "python", "install", spec["python"], "--no-bin"], env=env, check=True
        )
        interpreters = list((RUNTIME / ".python").glob(
            f"cpython-{spec['python']}-macos-aarch64-*/bin/python3.11"
        ))
        if len(interpreters) != 1:
            raise ValueError("Expected exactly one project-local Python installation")
        interpreter = interpreters[0].resolve()
        if not interpreter.is_relative_to(RUNTIME):
            raise ValueError("Python interpreter resolves outside the project")
        python = RUNTIME / ".venv" / "bin" / "python"
        if not python.exists():
            subprocess.run(
                [uv, "venv", "--python", str(interpreter), str(RUNTIME / ".venv")],
                env=env, check=True,
            )
        if python.resolve() != interpreter:
            raise ValueError("Existing MV environment does not use the pinned local interpreter")
        subprocess.run(
            [uv, "pip", "sync", "--python", str(python), "--require-hashes",
             "--only-binary", ":all:", str(RUNTIME / "requirements-runtime.txt")],
            env=env, check=True,
        )
        subprocess.run(
            [uv, "pip", "install", "--python", str(python), "--no-deps",
             "--no-build-isolation", "-e", str(SOURCE)], env=env, check=True,
        )
        if with_checkpoint:
            checkpoint = spec["checkpoint"]
            download(
                checkpoint["url"], RUNTIME / "checkpoints" / f"{checkpoint['name']}.ckpt",
                checkpoint["bytes"], "sha1", checkpoint["sha1"], etag=checkpoint["etag"],
            )
        check_command = [str(python), "-I", str(ROOT / "scripts" / "check_mv_runtime.py")]
        if with_checkpoint:
            check_command.append("--smoke")
        subprocess.run(
            check_command,
            env=env, check=True,
        )
        print("Project-local MV CPU runtime is ready; no large video models downloaded.", flush=True)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--with-checkpoint", action="store_true",
                        help="Also download the 81 MB Beat This final0 checkpoint")
    args = parser.parse_args()
    try:
        install(args.with_checkpoint)
    except (OSError, ValueError, urllib.error.URLError, subprocess.CalledProcessError,
            tarfile.TarError) as error:
        print(f"MV runtime deployment failed: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
