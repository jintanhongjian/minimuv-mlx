# Bundled HiDream-O1 MLX inference

MiniMuv vendors the unmodified inference sources published by
[Mrbizarro](https://huggingface.co/Mrbizarro) in
[mlx-community/HiDream-O1-Image-Dev-mlx-bf16](https://huggingface.co/mlx-community/HiDream-O1-Image-Dev-mlx-bf16/tree/33c7a00bce8e3410304f83ec408a15a1eb6782df/scripts/hidream_o1).
Pinned upstream revision: `33c7a00bce8e3410304f83ec408a15a1eb6782df`.
The upstream model card declares the MLX port MIT licensed; the original
[HiDream-O1-Image](https://github.com/HiDream-ai/HiDream-O1-Image) is also MIT
licensed. Attribution and license terms are retained in [LICENSE](LICENSE).
This directory remains MIT licensed, separately from MiniMuv's Apache-2.0 code.

Included runtime files:

- `scripts/hidream_o1/generate_hidream_o1_mlx.py`: inference CLI and shape test.
- `scripts/hidream_o1/hidream_model.py`: Qwen3-VL backbone and diffusion heads.
- `scripts/hidream_o1/pipeline_helpers.py`: token layouts, patches and attention.
- `scripts/hidream_o1/flow_match.py`: the 28-step Dev scheduler.
- `scripts/hidream_o1/postprocess.py`: optional standalone seam smoothing.

No weights, tokenizer assets, virtual environments, conversion tools, diagnostic
scripts, or sample outputs are bundled. The studio keeps its square Q6 / 28-step
generation recipe unchanged.

## Recreate the runtime

Run from the MiniMuv repository root on Apple Silicon:

```bash
uv venv --python 3.11 third_party/hidream_o1/.venv
uv pip install --python third_party/hidream_o1/.venv/bin/python \
  -r third_party/hidream_o1/requirements.txt
./third_party/hidream_o1/.venv/bin/python \
  third_party/hidream_o1/scripts/hidream_o1/generate_hidream_o1_mlx.py --shape-test
```

Direct dependencies are pinned to the versions used by the existing local runtime.
Use `requirements-music.txt` instead when also enabling Music3 in this environment.
See the main [deployment instructions](../../README.md#optional-image-generation)
for separate model downloads and migration details. Reference-image editing is
not exposed by the studio; the upstream edit CLI uses PyTorch processor tensors
and is outside this text-to-image deployment's dependency set.

## Source integrity

SHA-256 of the unmodified files, verified against the pinned upstream revision:

| File | SHA-256 |
|---|---|
| generate_hidream_o1_mlx.py | `7e09844cae5a37bc1bb8db83f45f85c6e8c09f2a7a199ee3b56d8cc9bd94af9a` |
| hidream_model.py | `b34be0219e132f709da1d54c651df9163226ac6d01ca105d5fe074c6748ad117` |
| pipeline_helpers.py | `8b93c766e0d85cd54f7d45d9a5f4c6acaa086fe6437fd96805470491fc8bfd81` |
| flow_match.py | `f081aa7f5b74af5a4636ad8fe4b7f4af80473b0dc48ab7f4ec4655af79cf0c3d` |
| postprocess.py | `e9c4b5ba765a93a2190c6b8cb3620040b43438c45974d413b4831af18f91682a` |
