"""Download immutable optional-model snapshots, never the LTX development transformer."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


def main() -> None:
    manifest = json.loads((ROOT / "third_party/local_models.json").read_text())
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", choices=tuple(manifest["models"]), action="append")
    parser.add_argument("--root", type=Path, default=Path.home() / ".omlx/models/pipenetwork")
    args = parser.parse_args()
    selected = list(args.model or manifest["models"])
    if any(name.startswith("ltx-") for name in selected) and "gemma-3-12b-it-4bit" not in selected:
        selected.append("gemma-3-12b-it-4bit")
    if "yue2-3b-8bit" in selected and "yue2-vae" not in selected:
        selected.append("yue2-vae")
    from webapp.model_downloads import worker

    for name in selected:
        spec = manifest["models"][name]
        destination = args.root.expanduser() / spec["directory"]
        print(f"Downloading {name} at {spec['revision']} to {destination}", flush=True)
        worker(name, destination)
        print(f"Download complete: {name}", flush=True)


if __name__ == "__main__":
    main()
