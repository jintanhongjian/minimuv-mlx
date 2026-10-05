"""Run YuE2-3B (mlx-Yue) song generation and report the generated token count."""

from __future__ import annotations

import argparse
import time
from pathlib import Path

import soundfile as sf
from lyra import YuE2Pipeline


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", required=True)
    parser.add_argument("--vae", required=True)
    parser.add_argument("--style", required=True)
    parser.add_argument("--lyrics-file", type=Path, required=True)
    parser.add_argument("--seed", type=int, default=0)
    parser.add_argument("--precision", default="8bit", choices=("8bit", "bf16"))
    parser.add_argument("--mode", default="full", choices=("full", "melody", "off"))
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    lyrics = args.lyrics_file.read_text(encoding="utf-8").strip() or "[instrumental]"
    tokens = 0
    last_report = time.monotonic()

    def on_token(phase, _token):
        nonlocal tokens, last_report
        tokens += 1
        now = time.monotonic()
        if now - last_report >= 10:
            last_report = now
            print(f"Generated {tokens} tokens ({phase}).", flush=True)

    pipe = YuE2Pipeline.from_pretrained(
        args.model, vae=args.vae, precision=args.precision,
        local_files_only=True, progress=False,
    )
    try:
        print("YuE2 pipeline loaded.", flush=True)
        result = pipe(style=args.style, lyrics=lyrics, seed=args.seed, cot=args.mode, on_token=on_token)
    finally:
        pipe.close()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    sf.write(args.output, result.audio, result.sample_rate, subtype="PCM_16", format="WAV")
    seconds = len(result.audio) / result.sample_rate
    print(f"Song length: {seconds:.1f}s, total {result.timing.get('e2e_seconds', 0):.1f}s.")
    print(f"Saved: {args.output}")
    print(f"TOKENS: {tokens}")


if __name__ == "__main__":
    main()
