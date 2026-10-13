"""Generate one local podcast segment with a voice-design model."""

from __future__ import annotations

import argparse
from pathlib import Path

import mlx.core as mx
from mlx_audio.audio_io import write as audio_write
from mlx_audio.tts.utils import load_model


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model-id", choices=("voxcpm2-4bit", "qwen3-tts-voicedesign-8bit"), required=True)
    parser.add_argument("--model", type=Path, required=True)
    parser.add_argument("--text-file", type=Path, required=True)
    parser.add_argument("--voice-description", required=True)
    parser.add_argument("--temperature", type=float, default=0.9)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    model = load_model(str(args.model))
    text = args.text_file.read_text(encoding="utf-8")
    if args.model_id == "qwen3-tts-voicedesign-8bit":
        generated = model.generate(text=text, instruct=args.voice_description,
                                    temperature=args.temperature, stream=False)
    else:
        generated = model.generate(text=text, instruct=args.voice_description)
    chunks = [generated] if hasattr(generated, "audio") else list(generated)
    if not chunks:
        raise RuntimeError("Voice-design model returned no speech audio.")
    sample_rate = chunks[0].sample_rate
    if type(sample_rate) is not int or not 8000 <= sample_rate <= 192000:
        raise RuntimeError("Voice-design model returned an invalid sample rate.")
    audio = []
    for chunk in chunks:
        if chunk.sample_rate != sample_rate or chunk.audio is None:
            raise RuntimeError("Voice-design model returned inconsistent speech chunks.")
        audio.append(chunk.audio)
    result = audio[0] if len(audio) == 1 else mx.concatenate(audio, axis=0)
    if result.size == 0:
        raise RuntimeError("Voice-design model returned an empty speech track.")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    audio_write(args.output, result, sample_rate)
    if not args.output.is_file() or args.output.stat().st_size <= 44:
        raise RuntimeError("Voice-design model did not write a valid WAV output.")
    print(f"Saved: {args.output}")


if __name__ == "__main__":
    main()
