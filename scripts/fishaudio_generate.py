"""Generate a local Fish Audio S2 speech track as a WAV file."""

from __future__ import annotations

import argparse
from pathlib import Path

import mlx.core as mx
from mlx_audio.audio_io import write as audio_write
from mlx_audio.tts.utils import load_model


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", type=Path, required=True)
    parser.add_argument("--text-file", type=Path, required=True)
    parser.add_argument("--reference-audio", type=Path, required=True)
    parser.add_argument("--reference-text", required=True)
    parser.add_argument("--speed", type=float, required=True)
    parser.add_argument("--temperature", type=float, required=True)
    parser.add_argument("--top-p", type=float, required=True)
    parser.add_argument("--top-k", type=int, required=True)
    parser.add_argument("--max-tokens", type=int, required=True)
    parser.add_argument("--chunk-length", type=int, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    model = load_model(str(args.model))
    generated = model.generate(
        text=args.text_file.read_text(encoding="utf-8"),
        ref_audio=str(args.reference_audio),
        ref_text=args.reference_text,
        speed=args.speed,
        temperature=args.temperature,
        top_p=args.top_p,
        top_k=args.top_k,
        max_tokens=args.max_tokens,
        chunk_length=args.chunk_length,
        stream=False,
    )
    chunks = [generated] if hasattr(generated, "audio") else list(generated)
    if not chunks:
        raise RuntimeError("Fish Audio returned no speech audio.")
    sample_rate = chunks[0].sample_rate
    if type(sample_rate) is not int or not 8000 <= sample_rate <= 192000:
        raise RuntimeError("Fish Audio returned an invalid sample rate.")
    audio = []
    for chunk in chunks:
        if chunk.sample_rate != sample_rate or chunk.audio is None:
            raise RuntimeError("Fish Audio returned inconsistent speech chunks.")
        if getattr(chunk, "text", None) is not None:
            print(f"Generated text chunk: {chunk.text}")
        audio.append(chunk.audio)
    result = audio[0] if len(audio) == 1 else mx.concatenate(audio, axis=0)
    if result.size == 0:
        raise RuntimeError("Fish Audio returned an empty speech track.")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    audio_write(args.output, result, sample_rate)
    if not args.output.is_file() or args.output.stat().st_size <= 44:
        raise RuntimeError("Fish Audio did not write a valid WAV output.")
    print(f"Saved: {args.output}")


if __name__ == "__main__":
    main()
