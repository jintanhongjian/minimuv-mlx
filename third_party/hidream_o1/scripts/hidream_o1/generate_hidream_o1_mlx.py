#!/usr/bin/env python3
"""HiDream-O1-Image-Dev inference on MLX (T2I, Dev recipe only)."""
from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

import numpy as np

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE))

from pipeline_helpers import (
    PATCH_SIZE, NOISE_SCALE_DEFAULT, T_EPS,
    build_attention_mask, find_closest_resolution, patchify, unpatchify,
)


def shape_test():
    print("=== HiDream-O1 MLX lab — shape sanity test ===")

    H, W = 512, 512
    x = np.random.randn(3, H, W).astype(np.float32)
    p = patchify(x)
    expected_patches = (H // PATCH_SIZE) * (W // PATCH_SIZE)
    expected_dim = 3 * PATCH_SIZE * PATCH_SIZE
    assert p.shape == (expected_patches, expected_dim)
    x2 = unpatchify(p, H // PATCH_SIZE, W // PATCH_SIZE)
    assert np.allclose(x, x2)
    print(f"  [ok] patchify roundtrip: {x.shape} -> {p.shape} -> {x2.shape}")

    txt_seq_len = 12
    img_seq_len = expected_patches
    total = txt_seq_len + img_seq_len
    token_types = np.zeros((1, total), dtype=np.int64)
    token_types[0, txt_seq_len - 1: total] = 1
    DTYPE_MIN = -1e9
    mask = build_attention_mask(token_types, DTYPE_MIN)
    assert mask.shape == (1, 1, total, total)
    assert mask[0, 0, 0, 1] == DTYPE_MIN and mask[0, 0, 0, 0] == 0
    assert (mask[0, 0, txt_seq_len + 5] == 0).all()
    print(f"  [ok] mask: shape={mask.shape}, text rows causal, gen rows bidirectional")

    from flow_match import FlashFlowMatchScheduler, DEFAULT_TIMESTEPS
    sched = FlashFlowMatchScheduler(num_train_timesteps=1000, shift=1.0)
    sched.set_timesteps(28, custom_timesteps=DEFAULT_TIMESTEPS)
    assert sched.num_inference_steps == 28
    assert len(sched.sigmas_np) == 29
    diffs = np.diff(sched.sigmas_np)
    assert (diffs <= 1e-6).all()
    print(f"  [ok] scheduler: 28 steps, sigmas {sched.sigmas_np[0]:.4f} -> {sched.sigmas_np[-2]:.4f} -> 0")

    try:
        import mlx.core as mx
    except ImportError:
        print("  [skip] mlx not available")
    else:
        B, N, D = 1, expected_patches, expected_dim
        z = mx.random.normal((B, N, D))
        model_output = mx.random.normal((B, N, D))
        ts0 = float(sched.timesteps_np[0])
        z2 = sched.step(model_output, ts0, z, s_noise=7.5, noise_clip_std=2.5, seed=42)
        assert z2.shape == z.shape
        print(f"  [ok] mlx step: z {z.shape} -> z' {z2.shape}, dtype {z2.dtype}")

    snapped = find_closest_resolution(540, 960)
    assert snapped in [(1440, 2560), (1312, 3104)]
    print(f"  [ok] resolution snap 540x960 -> {snapped}")
    print("=== all shape tests passed ===")


def run_inference(args):
    import mlx.core as mx
    try:
        from mlx_vlm import load as mlx_vlm_load
    except ImportError:
        sys.exit("mlx-vlm not installed. uv pip install 'mlx-vlm>=0.3.3'")
    from PIL import Image
    import tqdm

    from pipeline_helpers import build_t2i_text_sample
    from flow_match import FlashFlowMatchScheduler, DEFAULT_TIMESTEPS
    from hidream_model import HiDreamConfig, build_model, forward_generation, precompute_text_embeds_with_vision

    print(f"loading model from {args.model_path} ...", flush=True)
    t0 = time.time()
    backbone, processor = mlx_vlm_load(args.model_path)
    print(f"  loaded in {time.time() - t0:.1f}s")

    cfg = HiDreamConfig()
    model = build_model(cfg, backbone)
    custom_path = Path(args.model_path) / "extras" / "custom_heads.safetensors"
    if not custom_path.exists():
        sys.exit(f"missing {custom_path}; rerun the converter")
    custom_weights = mx.load(str(custom_path))
    model.load_weights(list(custom_weights.items()), strict=False)
    print(f"  loaded {len(custom_weights)} custom-head tensors")

    width, height = args.width, args.height
    if not args.no_snap_resolution:
        sw, sh = find_closest_resolution(width, height)
        if (sw, sh) != (width, height):
            print(f"  resolution snapped {width}x{height} -> {sw}x{sh} (trained dim)")
            width, height = sw, sh
    # patch-align fallback (HiDream only operates on multiples of PATCH_SIZE)
    width = (width // PATCH_SIZE) * PATCH_SIZE
    height = (height // PATCH_SIZE) * PATCH_SIZE
    print(f"  using {width}x{height} ({(width//PATCH_SIZE)*(height//PATCH_SIZE)} patches)")

    h_patches = height // PATCH_SIZE
    w_patches = width // PATCH_SIZE

    tokenizer = processor.tokenizer if hasattr(processor, "tokenizer") else processor
    for n in ("boi", "bor", "eor", "bot", "tms"):
        if not hasattr(tokenizer, f"{n}_token"):
            setattr(tokenizer, f"{n}_token", f"<|{n}_token|>")

    refs = list(args.ref_images or [])
    if refs:
        from pipeline_helpers import build_edit_text_sample
        print(f"  edit mode: K={len(refs)} reference image(s)")
        sample = build_edit_text_sample(
            args.prompt, refs, height, width, tokenizer, processor, backbone.config,
        )
    else:
        sample = build_t2i_text_sample(args.prompt, height, width, tokenizer, processor, backbone.config)

    input_ids   = mx.array(sample["input_ids"])
    position_ids = mx.array(sample["position_ids"])
    token_types  = mx.array(sample["token_types"])
    vinput_mask  = sample["vinput_mask"]

    # Edit-mode extras (None for T2I)
    pixel_values_mx = mx.array(sample["pixel_values"]).astype(mx.bfloat16) if refs else None
    image_grid_thw_mx = mx.array(sample["image_grid_thw"]) if refs else None
    ref_patches_mx = mx.array(sample["ref_patches"]).astype(mx.bfloat16) if refs else None
    tgt_image_len = sample.get("tgt_image_len", (height // PATCH_SIZE) * (width // PATCH_SIZE))

    DTYPE_MIN = -1e4
    mask4d = mx.array(build_attention_mask(sample["token_types"], DTYPE_MIN)).astype(mx.bfloat16)

    rng_key = mx.random.key(args.seed + 1)
    noise = args.noise_scale_start * mx.random.normal((1, 3, height, width), key=rng_key)
    noise_np = np.asarray(noise)
    z = mx.array(patchify(noise_np[0])[None]).astype(mx.bfloat16)

    sched = FlashFlowMatchScheduler(num_train_timesteps=1000, shift=1.0)
    sched.set_timesteps(args.num_inference_steps, custom_timesteps=DEFAULT_TIMESTEPS)
    noise_scale_schedule = np.linspace(args.noise_scale_start, args.noise_scale_end,
                                       len(sched.timesteps_np))

    # Precompute MLX-native indices for the patch slice. Two index sets:
    # - vinput_idx: positions where the model gets vinputs (tgt + refs in edit mode, tgt only in T2I)
    # - tgt_idx: positions where the TARGET image patches live (subset of vinput_idx in edit mode)
    vinput_idx = mx.array(np.where(vinput_mask[0])[0].astype(np.int32))
    if refs:
        tgt_mask = sample["vinput_mask_tgt_only"]
        tgt_idx = mx.array(np.where(tgt_mask[0])[0].astype(np.int32))
    else:
        tgt_idx = vinput_idx

    # Precompute text+vision inputs_embeds — these are constant across denoising
    # steps (only the vinputs / timestep change), so we save 28x the vision work.
    inputs_embeds_pre = precompute_text_embeds_with_vision(
        model, cfg, input_ids,
        pixel_values=pixel_values_mx, image_grid_thw=image_grid_thw_mx,
    )
    mx.eval(inputs_embeds_pre)
    print(f"  precomputed inputs_embeds: {inputs_embeds_pre.shape}")

    t_start = time.time()
    for step_idx, step_t in enumerate(tqdm.tqdm(sched.timesteps_np, desc="generating")):
        # Native MLX scalar — no numpy roundtrip
        t_pixeldit = mx.full([1], 1.0 - float(step_t) / 1000.0, dtype=mx.float32)
        sigma = max(float(step_t) / 1000.0, T_EPS)

        # Edit mode: vinputs is the target z concatenated with the clean ref patches.
        # The forward_generation embeds + concatenates these to inputs_embeds; the
        # mask routes attention so refs are bidirectional too.
        if refs:
            vinputs = mx.concatenate([z, ref_patches_mx], axis=1)
        else:
            vinputs = z

        x_pred = forward_generation(
            model, cfg,
            inputs_embeds_with_vision=inputs_embeds_pre,
            position_ids=position_ids,
            vinputs=vinputs,
            timestep=t_pixeldit,
            input_ids=input_ids,
            token_types=token_types,
            attention_mask_4d=mask4d,
        )
        # Slice the target patches only (excludes refs in edit mode).
        gen_patches_mx = mx.take(x_pred, tgt_idx, axis=1).astype(mx.float32)

        # Optional: clamp x_pred to [q, 1-q] quantile per step. Upstream has this
        # commented out (pipeline.py line 327: `x_pred = clamp_tensor(x_pred, percentage=0.01)`).
        # The patch-grid artifact comes from per-patch outliers — clamping the per-step
        # x_pred range trims the worst extremes that show up as 32-pixel grid lines.
        if args.clamp_x_pred > 0:
            gp_np = np.asarray(gen_patches_mx)
            lo = float(np.quantile(gp_np, args.clamp_x_pred))
            hi = float(np.quantile(gp_np, 1.0 - args.clamp_x_pred))
            gen_patches_mx = mx.clip(gen_patches_mx, lo, hi)

        if args.diag and step_idx in (0, 1, 13, 27):
            zarr = np.asarray(z.astype(mx.float32))
            gp = np.asarray(gen_patches_mx)
            print(f"  [diag step {step_idx}] sigma={sigma:.4f} "
                  f"z(mean={zarr.mean():.3f},std={zarr.std():.3f}) "
                  f"x_pred(mean={gp.mean():.3f},std={gp.std():.3f},"
                  f"min={gp.min():.3f},max={gp.max():.3f})")

        v = (gen_patches_mx - z.astype(mx.float32)) / sigma
        model_output = -v
        z = sched.step(model_output, float(step_t), z,
                       s_noise=float(noise_scale_schedule[step_idx]),
                       noise_clip_std=args.noise_clip_std,
                       seed=args.seed)
        # Force eval per step so timing is honest (otherwise mlx's lazy eval
        # batches the entire loop into the final save, hiding per-step cost).
        mx.eval(z)

    elapsed = time.time() - t_start
    print(f"  generation: {elapsed:.1f}s  ({elapsed / args.num_inference_steps:.2f}s/step)")

    img = (z + 1) / 2
    img_np = np.asarray(img[0].astype(mx.float32))
    rgb = unpatchify(img_np, h_patches, w_patches)
    arr = np.clip(rgb.transpose(1, 2, 0) * 255, 0, 255).astype(np.uint8)
    if args.blend_seams > 0:
        arr = _blend_patch_seams(arr, PATCH_SIZE, radius=args.blend_seams)
    Image.fromarray(arr).save(args.output)
    print(f"saved -> {args.output}")


def _blend_patch_seams(rgb: np.ndarray, patch: int, radius: int = 1) -> np.ndarray:
    """Smooth the 32-pixel patch grid seams.

    HiDream's final_layer2 predicts each patch independently. In flat
    regions adjacent patches don't quite agree on color, so a regular grid
    of seams shows up. We replace each seam row/col with a weighted average
    of its (2*radius+1) neighbours using a triangular kernel — heavier
    smoothing than the previous box average, but still limited to a thin
    band around each seam so non-seam content is preserved.

    rgb: [H, W, 3] uint8
    radius: 0 = off, 1 = ±1 row blur (subtle), 2-3 = visible at HD/QHD,
            4+ = noticeable softening of seams
    """
    if radius <= 0:
        return rgb
    out = rgb.astype(np.float32).copy()
    H, W, _ = rgb.shape

    # Triangular kernel weights for (2*radius+1) rows
    weights = np.array([radius - abs(i - radius) + 1 for i in range(2 * radius + 1)], dtype=np.float32)
    weights = weights / weights.sum()

    # Horizontal seams (vary by y); rebuild the seam row(s) as a triangular
    # weighted average of (2*radius+1) neighbouring rows.
    for y in range(patch, H, patch):
        for offset in (-1, 0):  # blend the rows immediately above and at the seam
            yy = y + offset
            if 0 <= yy < H:
                lo = max(0, yy - radius)
                hi = min(H, yy + radius + 1)
                # Pad weights to match the actually-clipped band
                w_slice = weights[radius - (yy - lo): radius + (hi - yy)]
                w_slice = w_slice / w_slice.sum()
                band = out[lo:hi]                              # [n, W, 3]
                smoothed = (band * w_slice[:, None, None]).sum(axis=0)
                out[yy] = smoothed

    # Vertical seams
    for x in range(patch, W, patch):
        for offset in (-1, 0):
            xx = x + offset
            if 0 <= xx < W:
                lo = max(0, xx - radius)
                hi = min(W, xx + radius + 1)
                w_slice = weights[radius - (xx - lo): radius + (hi - xx)]
                w_slice = w_slice / w_slice.sum()
                band = out[:, lo:hi]                            # [H, n, 3]
                smoothed = (band * w_slice[None, :, None]).sum(axis=1)
                out[:, xx] = smoothed

    return np.clip(out, 0, 255).astype(np.uint8)


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--shape-test", action="store_true")
    ap.add_argument("--model-path", default="mlx_models/hidream-o1-dev-q4")
    ap.add_argument("--prompt", default="a small red mushroom on a bed of moss, soft daylight, macro photo")
    ap.add_argument("--output", default="sample_outputs/out.png")
    ap.add_argument("--width", type=int, default=512)
    ap.add_argument("--height", type=int, default=512)
    ap.add_argument("--num-inference-steps", type=int, default=28)
    ap.add_argument("--no-snap-resolution", action="store_true",
                    help="Disable snapping to trained PREDEFINED_RESOLUTIONS list (off-spec dims produce visible patch artifacts)")
    ap.add_argument("--diag", action="store_true",
                    help="Print stats of z and x_pred at a few key steps")
    ap.add_argument("--blend-seams", type=int, default=0,
                    help="Post-process: smooth patch-grid seams with this radius (0 = off, 1-2 typical)")
    ap.add_argument("--clamp-x-pred", type=float, default=0.0,
                    help="Per-step quantile clamp on x_pred (0 = off; 0.01 = upstream's commented-out value)")
    ap.add_argument("--ref-images", nargs="*", default=[],
                    help="Reference image paths for edit/multi-ref mode (1-3). Empty = pure T2I.")
    ap.add_argument("--noise-scale-start", type=float, default=NOISE_SCALE_DEFAULT)
    ap.add_argument("--noise-scale-end", type=float, default=NOISE_SCALE_DEFAULT)
    ap.add_argument("--noise-clip-std", type=float, default=2.5)
    ap.add_argument("--seed", type=int, default=32)
    args = ap.parse_args(argv)

    if args.shape_test:
        shape_test()
        return
    run_inference(args)


if __name__ == "__main__":
    main()
