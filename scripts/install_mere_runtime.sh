#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BASE="$ROOT/third_party/mere_run"
VERSION=0.62.1
SHA256=8ebc99202f819922eb4f5c0840ff8cfca2d8c0030a477a32e482e1ab2b47bc05
IMAGE="$BASE/.downloads/MereRun-$VERSION.dmg"

if [[ "$(uname -s)" != Darwin || "$(uname -m)" != arm64 ]]; then
  echo "mere.run requires an Apple Silicon Mac." >&2
  exit 1
fi
if [[ -e "$BASE/runtime" ]]; then
  echo "Runtime already exists. Refusing to overwrite; inspect it before upgrading." >&2
  exit 1
fi
mkdir -p "$BASE/.downloads"
curl --fail --location --show-error --continue-at - --output "$IMAGE" \
  "https://github.com/sawfwair/mere-run/releases/download/v$VERSION/MereRun-$VERSION.dmg"
printf '%s  %s\n' "$SHA256" "$IMAGE" | shasum -a 256 -c -
MOUNT="$(mktemp -d "$BASE/.downloads/mount.XXXXXX")"
cleanup() {
  hdiutil detach "$MOUNT" || return
  rmdir "$MOUNT"
}
trap cleanup EXIT
hdiutil attach -readonly -nobrowse -mountpoint "$MOUNT" "$IMAGE"
codesign --verify --deep --strict "$MOUNT/MereRun.app"
ditto "$MOUNT/MereRun.app/Contents/Helpers" "$BASE/runtime"
ditto "$MOUNT/MereRun.app/Contents/Resources/ThirdPartyLicenses" "$BASE/runtime/ThirdPartyLicenses"
test "$("$BASE/runtime/mere.run" --version)" = "$VERSION"
echo "Installed mere.run $VERSION in $BASE/runtime (no system installation or model downloads)."
