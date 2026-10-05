#!/usr/bin/env python3
"""Standalone post-process: take an existing HiDream PNG and smooth the
32-pixel patch grid seams. NO model load — just numpy + PIL.

Usage:
  postprocess.py <input.png> <output.png> [--radius N] [--strength F]

Strategy:
  For each seam line (x, y multiples of PATCH_SIZE), apply a 1D gaussian
  blur perpendicular to the seam, blended with the original by --strength.
  The blur kernel is symmetric, so flat regions get more smoothing than
  sharp edges (which the gaussian's centre weight preserves).

  --radius   blur radius in pixels (default 3)
  --strength blend weight 0-1 (default 0.7 = 70% blurred + 30% original)
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image

PATCH_SIZE = 32


def gaussian_kernel_1d(radius: int) -> np.ndarray:
    """Build a normalised 1D gaussian kernel with sigma=radius/2."""
    sigma = radius / 2.0
    x = np.arange(-radius, radius + 1, dtype=np.float32)
    k = np.exp(-0.5 * (x / sigma) ** 2)
    return k / k.sum()


def smooth_seams(rgb: np.ndarray, radius: int = 3, strength: float = 0.7) -> np.ndarray:
    """Smooth horizontal+vertical patch seams via local gaussian blur.

    The blur is applied to the SEAM rows/cols only, then alpha-blended back
    by `strength`. Non-seam pixels are untouched.
    """
    out = rgb.astype(np.float32).copy()
    H, W, C = rgb.shape
    kernel = gaussian_kernel_1d(radius)  # length 2*radius+1

    # --- Horizontal seams (rows at y in {patch, 2*patch, ...}) ---
    # We smooth the 2 rows on each side of each seam (4 rows total per seam).
    for y in range(PATCH_SIZE, H, PATCH_SIZE):
        for offset in (-2, -1, 0, 1):
            yy = y + offset
            if not (0 <= yy < H):
                continue
            lo = max(0, yy - radius)
            hi = min(H, yy + radius + 1)
            k_lo = radius - (yy - lo)
            k_hi = radius + (hi - yy)
            k = kernel[k_lo:k_hi]
            k = k / k.sum()
            band = out[lo:hi]                       # [n, W, C]
            blurred = (band * k[:, None, None]).sum(axis=0)
            out[yy] = (1 - strength) * out[yy] + strength * blurred

    # --- Vertical seams (cols at x in {patch, 2*patch, ...}) ---
    for x in range(PATCH_SIZE, W, PATCH_SIZE):
        for offset in (-2, -1, 0, 1):
            xx = x + offset
            if not (0 <= xx < W):
                continue
            lo = max(0, xx - radius)
            hi = min(W, xx + radius + 1)
            k_lo = radius - (xx - lo)
            k_hi = radius + (hi - xx)
            k = kernel[k_lo:k_hi]
            k = k / k.sum()
            band = out[:, lo:hi]                    # [H, n, C]
            blurred = (band * k[None, :, None]).sum(axis=1)
            out[:, xx] = (1 - strength) * out[:, xx] + strength * blurred

    return np.clip(out, 0, 255).astype(np.uint8)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("output")
    ap.add_argument("--radius", type=int, default=3)
    ap.add_argument("--strength", type=float, default=0.7)
    args = ap.parse_args()

    inp = Path(args.input)
    if not inp.exists():
        sys.exit(f"input not found: {inp}")

    rgb = np.array(Image.open(inp).convert("RGB"))
    H, W = rgb.shape[:2]
    print(f"{inp.name}: {W}x{H}, {(W // PATCH_SIZE) - 1} vertical + {(H // PATCH_SIZE) - 1} horizontal seams")
    print(f"smoothing with radius={args.radius}, strength={args.strength}...")

    out = smooth_seams(rgb, radius=args.radius, strength=args.strength)
    Image.fromarray(out).save(args.output)
    print(f"saved -> {args.output}")


if __name__ == "__main__":
    main()
