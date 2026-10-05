#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
command -v uv >/dev/null || { echo "Install uv before rebuilding the local runtimes." >&2; exit 1; }
command -v ffmpeg >/dev/null || { echo "Install FFmpeg before using LTX video inference." >&2; exit 1; }
uv venv --python 3.14 third_party/mflux/.venv
uv venv --python 3.14 third_party/ltx_2_mlx/.venv
uv pip install --python third_party/mflux/.venv/bin/python \
  -r third_party/mflux/requirements-runtime.txt
uv pip install --python third_party/mflux/.venv/bin/python --no-deps -e third_party/mflux
uv pip install --python third_party/ltx_2_mlx/.venv/bin/python \
  -r third_party/ltx_2_mlx/requirements-runtime.txt
uv pip install --python third_party/ltx_2_mlx/.venv/bin/python --no-deps \
  -e third_party/ltx_2_mlx/packages/ltx-core-mlx \
  -e third_party/ltx_2_mlx/packages/ltx-pipelines-mlx
third_party/mflux/.venv/bin/python -c \
  'from mflux.models.flux2.variants import Flux2Klein; from mflux.models.z_image.variants.z_image import ZImage'
third_party/ltx_2_mlx/.venv/bin/python -c 'import ltx_pipelines_mlx.cli'
echo "Bundled image and distilled-video runtimes are ready."
