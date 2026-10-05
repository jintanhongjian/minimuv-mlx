"""Run MiniMax Music3 generation and report the generated token count."""

from __future__ import annotations

import argparse
from pathlib import Path

import mlx.core as mx
from mlx_audio.audio_io import write as audio_write
from mlx_audio.music.utils import load_model


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", required=True)
    parser.add_argument("--caption", required=True)
    parser.add_argument("--lyrics-file", type=Path, required=True)
    parser.add_argument("--duration", type=float, default=None)
    parser.add_argument("--steps", type=int, default=30)
    parser.add_argument("--seed", type=int, default=0)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    model = load_model(args.model)
    kwargs = {
        "text": args.caption,
        "lyrics": args.lyrics_file.read_text(encoding="utf-8"),
        "steps": args.steps,
        "seed": args.seed,
    }
    if args.duration is not None:
        kwargs["duration"] = args.duration

    chunks = []
    sample_rate = None
    tokens = 0
    for result in model.generate(**kwargs):
        if sample_rate is None:
            sample_rate = result.sample_rate
        elif result.sample_rate != sample_rate:
            raise ValueError("Music generation returned inconsistent sample rates")
        chunks.append(result.audio)
        tokens += int(getattr(result, "token_count", 0) or 0)
    if not chunks or sample_rate is None:
        raise RuntimeError("Music generation produced no audio")

    audio = chunks[0] if len(chunks) == 1 else mx.concatenate(chunks, axis=0)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    audio_write(args.output, audio, sample_rate)
    print(f"Saved: {args.output}")
    print(f"TOKENS: {tokens}")


if __name__ == "__main__":
    main()
