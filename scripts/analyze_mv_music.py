"""Run offline CPU beat/downbeat analysis with project-local code and temporary files."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "third_party" / "mv_analysis"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("--output", "-o", required=True, type=Path)
    args = parser.parse_args()
    try:
        source, destination = args.input.resolve(), args.output.resolve()
        if not source.is_file() or source == destination:
            raise ValueError("Input must be an audio file distinct from the output")
        python = RUNTIME / ".venv" / "bin" / "python"
        if not python.is_file() or not python.resolve().is_relative_to(RUNTIME):
            raise ValueError("Install the project-local MV runtime first")
        spec = json.loads((RUNTIME / "runtime.json").read_text())
        checkpoint = RUNTIME / "checkpoints" / f"{spec['checkpoint']['name']}.ckpt"
        if checkpoint.is_symlink() or not checkpoint.is_file():
            raise ValueError("Install the local checkpoint with --with-checkpoint")
        with checkpoint.open("rb") as stream:
            if (checkpoint.stat().st_size != spec["checkpoint"]["bytes"]
                    or hashlib.file_digest(stream, "sha1").hexdigest() != spec["checkpoint"]["sha1"]):
                raise ValueError("Local checkpoint size/checksum mismatch")
        temporary = RUNTIME / ".cache" / "tmp"
        if not temporary.resolve().is_relative_to(RUNTIME):
            raise ValueError("Temporary directory must stay inside the project")
        temporary.mkdir(parents=True, exist_ok=True)
        env = os.environ.copy()
        for key in ("PYTHONPATH", "PYTHONHOME"):
            env.pop(key, None)
        env.update(TMPDIR=str(temporary), TORCH_HOME=str(RUNTIME / ".torch"),
                   PYTHONNOUSERSITE="1", OMP_NUM_THREADS="4", MKL_NUM_THREADS="4")
        return subprocess.run(
            [str(python), "-I", "-m", "beat_this.cli", "--gpu=-1", "--no-dbn",
             "--model", str(checkpoint), str(source), "--output", str(destination)],
            env=env, check=True,
        ).returncode
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        print(f"MV music analysis failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
