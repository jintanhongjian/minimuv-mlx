"""Verify the MV runtime's code locality and CPU inference readiness."""

from __future__ import annotations

import argparse
import hashlib
import importlib
import json
import os
import sys
import tempfile
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "third_party" / "mv_analysis"


def audit_loaded_code() -> int:
    count = 0
    for name, module in tuple(sys.modules.items()):
        origin = getattr(module, "__file__", None)
        if origin and Path(origin).is_file():
            if not Path(origin).resolve().is_relative_to(ROOT):
                raise ValueError(f"Imported code outside the project: {name}: {origin}")
            count += 1
    return count


def check(smoke: bool) -> dict:
    if not Path(sys.base_prefix).resolve().is_relative_to(RUNTIME):
        raise ValueError("Run this check with third_party/mv_analysis/.venv/bin/python")
    if not Path(sys.prefix).resolve().is_relative_to(RUNTIME):
        raise ValueError("The active environment is outside the project")
    os.environ["TORCH_HOME"] = str(RUNTIME / ".torch")
    temporary = RUNTIME / ".cache" / "tmp"
    if temporary.is_symlink() or not temporary.resolve().is_relative_to(RUNTIME):
        raise ValueError("MV temporary code directory resolves outside the project")
    temporary.mkdir(parents=True, exist_ok=True)
    os.environ["TMPDIR"] = str(temporary)
    tempfile.tempdir = str(temporary)
    modules = {}
    for name in ("torch", "torchaudio", "numpy", "soxr", "soundfile", "einops",
                 "rotary_embedding_torch", "beat_this.inference"):
        module = importlib.import_module(name)
        path = Path(module.__file__).resolve()
        if not path.is_relative_to(ROOT):
            raise ValueError(f"Non-project dependency: {name}: {path}")
        modules[name] = str(path.relative_to(ROOT))
    import torch
    from beat_this.inference import Audio2Beats

    loaded_code_files = audit_loaded_code()
    spec = json.loads((RUNTIME / "runtime.json").read_text())
    checkpoint = RUNTIME / "checkpoints" / f"{spec['checkpoint']['name']}.ckpt"
    result = {
        "python": sys.version.split()[0], "base_prefix": str(sys.base_prefix),
        "device": "cpu", "dbn": False, "modules": modules,
        "checkpoint_present": checkpoint.is_file(),
        "torch": torch.__version__, "large_models_downloaded": False,
        "loaded_code_files_checked": loaded_code_files,
        "all_loaded_code_in_project": True,
    }
    if smoke:
        if not checkpoint.is_file():
            raise ValueError("Checkpoint missing; install with --with-checkpoint first")
        if checkpoint.is_symlink() or checkpoint.stat().st_size != spec["checkpoint"]["bytes"]:
            raise ValueError("Checkpoint size/type does not match the deployment manifest")
        with checkpoint.open("rb") as stream:
            if hashlib.file_digest(stream, "sha1").hexdigest() != spec["checkpoint"]["sha1"]:
                raise ValueError("Checkpoint checksum does not match the deployment manifest")
        import numpy as np
        torch.set_num_threads(4)
        sample_rate = 22050
        audio = np.zeros(sample_rate * 12, dtype=np.float32)
        pulse = np.exp(-np.arange(1000) / 120).astype(np.float32)
        for offset in range(0, len(audio) - len(pulse), sample_rate // 2):
            audio[offset:offset + len(pulse)] = pulse
        started = time.monotonic()
        beats, downbeats = Audio2Beats(
            checkpoint_path=str(checkpoint), device="cpu", dbn=False
        )(audio, sample_rate)
        if not np.isfinite(beats).all() or not np.isfinite(downbeats).all():
            raise ValueError("Inference returned non-finite timestamps")
        result["smoke"] = {
            "duration_seconds": 12, "elapsed_seconds": round(time.monotonic() - started, 3),
            "beat_count": len(beats), "downbeat_count": len(downbeats),
            "quality_validation": False,
        }
        result["loaded_code_files_checked"] = audit_loaded_code()
        result["post_inference_code_audited"] = True
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--smoke", action="store_true")
    args = parser.parse_args()
    try:
        print(json.dumps(check(args.smoke), indent=2))
    except (OSError, ValueError, ImportError, RuntimeError) as error:
        print(f"MV runtime check failed: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
