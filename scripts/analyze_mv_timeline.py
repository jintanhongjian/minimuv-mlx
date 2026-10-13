"""Analyze a WAV offline using the isolated project-local CPU runtime."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import runpy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "third_party" / "mv_analysis"


def analyze(source: Path) -> dict:
    import numpy as np
    import soundfile as sf
    import soxr
    import torch
    from beat_this.inference import Audio2Beats

    spec = json.loads((RUNTIME / "runtime.json").read_text())
    checkpoint = RUNTIME / "checkpoints" / f"{spec['checkpoint']['name']}.ckpt"
    if checkpoint.is_symlink() or not checkpoint.is_file():
        raise ValueError("mv_checkpoint_missing")
    with checkpoint.open("rb") as stream:
        if (checkpoint.stat().st_size != spec["checkpoint"]["bytes"]
                or hashlib.file_digest(stream, "sha1").hexdigest() != spec["checkpoint"]["sha1"]):
            raise ValueError("mv_checkpoint_checksum_mismatch")
    torch.set_num_threads(4)
    print("signal", flush=True)
    waveform, energy, chunks = [], [], []
    with sf.SoundFile(source) as audio:
        duration = len(audio) / audio.samplerate
        if not 0 < duration <= 720 or audio.channels not in (1, 2):
            raise ValueError("mv_audio_limit")
        rate = audio.samplerate
        resampler = soxr.ResampleStream(rate, 22050, 1, dtype="float32")
        position = 0
        for block in audio.blocks(blocksize=max(1, round(rate / 10)), dtype="float32", always_2d=True):
            if not np.isfinite(block).all():
                raise ValueError("mv_audio_nonfinite")
            waveform.append(round(float(np.abs(block).max()), 6))
            energy.append(round(float(np.sqrt(np.mean(block.astype(np.float64) ** 2))), 6))
            position += len(block)
            chunks.append(resampler.resample_chunk(block.mean(axis=1), last=position == len(audio)))
    print("beats", flush=True)
    beats, downbeats = Audio2Beats(
        checkpoint_path=str(checkpoint), device="cpu", dbn=False
    )(np.concatenate(chunks), 22050)
    beats = [round(float(value), 6) for value in beats if 0 <= value < duration]
    downbeats = [round(float(value), 6) for value in downbeats if 0 <= value < duration]
    intervals = np.diff(beats)
    bpm = round(60 / float(np.median(intervals)), 3) if len(intervals) else None
    if bpm is not None and not math.isfinite(bpm):
        raise ValueError("mv_invalid_beats")
    audit = runpy.run_path(str(ROOT / "scripts" / "check_mv_runtime.py"))
    audit["audit_loaded_code"]()
    print("complete", flush=True)
    return {"duration": duration, "sample_rate": rate, "bin_seconds": round(rate / 10) / rate,
            "waveform": waveform, "energy": energy, "beats": beats, "downbeats": downbeats,
            "bpm": bpm, "device": "cpu", "dbn": False}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    import sys
    if not Path(sys.prefix).resolve().is_relative_to(RUNTIME):
        raise ValueError("mv_runtime_not_isolated")
    if args.input.resolve() == args.output.resolve():
        raise ValueError("mv_output_is_source")
    result = analyze(args.input)
    args.output.write_text(json.dumps(result, allow_nan=False), encoding="utf-8")


if __name__ == "__main__":
    main()
