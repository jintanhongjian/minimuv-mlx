from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from webapp import server


SOURCE_HASHES = {
    "generate_hidream_o1_mlx.py": "7e09844cae5a37bc1bb8db83f45f85c6e8c09f2a7a199ee3b56d8cc9bd94af9a",
    "hidream_model.py": "b34be0219e132f709da1d54c651df9163226ac6d01ca105d5fe074c6748ad117",
    "pipeline_helpers.py": "8b93c766e0d85cd54f7d45d9a5f4c6acaa086fe6437fd96805470491fc8bfd81",
    "flow_match.py": "f081aa7f5b74af5a4636ad8fe4b7f4af80473b0dc48ab7f4ec4655af79cf0c3d",
    "postprocess.py": "e9c4b5ba765a93a2190c6b8cb3620040b43438c45974d413b4831af18f91682a",
}


class HiDreamRuntimeTests(unittest.TestCase):
    def test_bundled_sources_match_pinned_upstream_snapshot(self):
        for name, expected in SOURCE_HASHES.items():
            with self.subTest(name=name):
                source = server.HIDREAM_SCRIPT.parent / name
                self.assertEqual(hashlib.sha256(source.read_bytes()).hexdigest(), expected)

    def test_runtime_requires_every_helper_and_executable(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            code = root / "third_party" / "hidream_o1"
            scripts = code / "scripts" / "hidream_o1"
            scripts.mkdir(parents=True)
            python = code / ".venv" / "bin" / "python"
            python.parent.mkdir(parents=True)
            python.touch()
            python.chmod(0o700)
            for name in SOURCE_HASHES:
                (scripts / name).touch()
            with patch.object(server, "HIDREAM_CODE_ROOT", code), patch.object(
                server, "HIDREAM_SCRIPT", scripts / "generate_hidream_o1_mlx.py"
            ), patch.object(server, "HIDREAM_PYTHON", python):
                self.assertTrue(server._hidream_status(root / "weights")["runtime_ready"])
                for name in SOURCE_HASHES:
                    with self.subTest(name=name):
                        (scripts / name).unlink()
                        self.assertFalse(server._hidream_status(root / "weights")["runtime_ready"])
                        (scripts / name).touch()
                python.chmod(0o600)
                self.assertFalse(server._hidream_status(root / "weights")["runtime_ready"])
                python.unlink()
                self.assertFalse(server._hidream_status(root / "weights")["runtime_ready"])

    def test_runtime_paths_follow_relocated_repository(self):
        with tempfile.TemporaryDirectory(prefix="minimuv migration ") as temp_dir:
            root = Path(temp_dir).resolve() / "studio"
            shutil.copytree(
                server.PROJECT_ROOT / "webapp", root / "webapp",
                ignore=shutil.ignore_patterns("__pycache__"),
            )
            shutil.copytree(
                server.HIDREAM_CODE_ROOT, root / "third_party" / "hidream_o1",
                ignore=shutil.ignore_patterns(".venv", "__pycache__"),
            )
            code = (
                "import json, sys; from pathlib import Path; "
                "sys.path.insert(0, sys.argv[1]); from webapp import server; "
                "print(json.dumps([str(server.PROJECT_ROOT), str(server.HIDREAM_CODE_ROOT), "
                "str(server.HIDREAM_SCRIPT), str(server.HIDREAM_PYTHON), "
                "str(server.MUSIC_PYTHON)]))"
            )
            result = subprocess.run(
                [sys.executable, "-I", "-c", code, str(root)],
                cwd=temp_dir, capture_output=True, text=True, check=True, timeout=30,
            )
            paths = json.loads(result.stdout)
            self.assertEqual(paths[0], str(root.resolve()))
            self.assertEqual(paths[1], str(root / "third_party" / "hidream_o1"))
            self.assertEqual(paths[2], str(
                root / "third_party" / "hidream_o1" / "scripts" / "hidream_o1"
                / "generate_hidream_o1_mlx.py"
            ))
            self.assertEqual(paths[3:], [
                str(root / "third_party" / "hidream_o1" / ".venv" / "bin" / "python")
            ] * 2)
            help_result = subprocess.run(
                [sys.executable, paths[2], "--help"], cwd=temp_dir,
                capture_output=True, text=True, check=True, timeout=30,
            )
            self.assertIn("--model-path", help_result.stdout)
            self.assertIn("--num-inference-steps", help_result.stdout)


if __name__ == "__main__":
    unittest.main()
