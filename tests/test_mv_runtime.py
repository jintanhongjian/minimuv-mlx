from __future__ import annotations

import hashlib
import importlib.util
import io
import tarfile
import tempfile
import threading
import unittest
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location(
    "install_mv_runtime", Path(__file__).resolve().parents[1] / "scripts" / "install_mv_runtime.py"
)
assert SPEC is not None and SPEC.loader is not None
installer = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(installer)


class DownloadTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.target = Path(self.temp.name) / "model.ckpt"
        self.payload = b"0123456789"
        self.digest = hashlib.sha256(self.payload).hexdigest()
        self.requests = []
        self.mode = "valid"
        case = self

        class Handler(BaseHTTPRequestHandler):
            def do_GET(self):
                case.requests.append(self.headers.get("Range"))
                offset = int(self.headers.get("Range", "bytes=0-").split("=")[1].split("-")[0])
                status = 206 if offset else 200
                if case.mode == "no-range":
                    offset, status = 0, 200
                self.send_response(status)
                self.send_header("ETag", '"wrong"' if case.mode == "etag" else '"fixed"')
                if status == 206:
                    start = offset + 1 if case.mode == "offset" else offset
                    self.send_header("Content-Range", f"bytes {start}-9/10")
                self.send_header("Content-Length", str(len(case.payload) - offset))
                self.end_headers()
                self.wfile.write(case.payload[offset:])

            def log_message(self, *args):
                pass

        self.server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        thread.start()
        self.addCleanup(self.server.server_close)
        self.addCleanup(self.server.shutdown)
        self.url = f"http://127.0.0.1:{self.server.server_port}/model"

    def download(self, digest=None):
        installer.download(self.url, self.target, 10, "sha256", digest or self.digest,
                           etag='"fixed"')

    def test_fresh_download_is_verified_and_published(self):
        self.download()
        self.assertEqual(self.target.read_bytes(), self.payload)
        self.assertFalse(self.target.with_suffix(".ckpt.part").exists())

    def test_resume_uses_exact_range_without_resetting_partial(self):
        self.target.with_suffix(".ckpt.part").write_bytes(self.payload[:4])
        self.download()
        self.assertEqual(self.requests, ["bytes=4-"])
        self.assertEqual(self.target.read_bytes(), self.payload)

    def test_range_rejection_preserves_partial(self):
        self.mode = "no-range"
        partial = self.target.with_suffix(".ckpt.part")
        partial.write_bytes(self.payload[:4])
        with self.assertRaisesRegex(ValueError, "Resume rejected"):
            self.download()
        self.assertEqual(partial.read_bytes(), self.payload[:4])
        self.assertFalse(self.target.exists())

    def test_wrong_offset_preserves_partial(self):
        self.mode = "offset"
        partial = self.target.with_suffix(".ckpt.part")
        partial.write_bytes(self.payload[:4])
        with self.assertRaisesRegex(ValueError, "Resume rejected"):
            self.download()
        self.assertEqual(partial.read_bytes(), self.payload[:4])

    def test_etag_change_is_blocked(self):
        self.mode = "etag"
        with self.assertRaisesRegex(ValueError, "ETag changed"):
            self.download()
        self.assertFalse(self.target.exists())

    def test_corrupt_download_is_not_published_or_deleted(self):
        with self.assertRaisesRegex(ValueError, "checksum mismatch"):
            self.download("0" * 64)
        self.assertEqual(self.target.with_suffix(".ckpt.part").read_bytes(), self.payload)
        self.assertFalse(self.target.exists())

    def test_verified_existing_file_does_not_use_network(self):
        self.target.write_bytes(self.payload)
        self.download()
        self.assertEqual(self.requests, [])

    def test_invalid_existing_file_is_not_overwritten(self):
        self.target.write_bytes(b"invalid")
        with self.assertRaisesRegex(ValueError, "checksum mismatch"):
            self.download()
        self.assertEqual(self.target.read_bytes(), b"invalid")
        self.assertEqual(self.requests, [])

    def test_symlink_target_is_rejected(self):
        original = self.target.with_name("original")
        original.write_bytes(self.payload)
        self.target.symlink_to(original)
        with self.assertRaisesRegex(ValueError, "Not a regular file"):
            self.download()
        self.assertEqual(self.requests, [])

    def test_oversized_partial_is_preserved(self):
        partial = self.target.with_suffix(".ckpt.part")
        partial.write_bytes(self.payload * 2)
        with self.assertRaisesRegex(ValueError, "Oversized partial"):
            self.download()
        self.assertEqual(partial.stat().st_size, 20)
        self.assertEqual(self.requests, [])


class VendorTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.archive = self.root / "source.tar.gz"
        self.source = self.root / "beat_this"

    def archive_file(self, name: str):
        payload = b"MIT source\n"
        with tarfile.open(self.archive, "w:gz") as bundle:
            member = tarfile.TarInfo(name)
            member.size = len(payload)
            bundle.addfile(member, io.BytesIO(payload))

    def test_pinned_source_can_be_reused_but_edits_are_not_overwritten(self):
        self.archive_file("beat_this-abc/LICENSE")
        with patch.object(installer, "SOURCE", self.source):
            installer.vendor_source(self.archive, "abc")
            installer.vendor_source(self.archive, "abc")
            (self.source / "LICENSE").write_text("local change")
            with self.assertRaisesRegex(ValueError, "refusing overwrite"):
                installer.vendor_source(self.archive, "abc")
        self.assertEqual((self.source / "LICENSE").read_text(), "local change")

    def test_archive_path_traversal_is_blocked(self):
        self.archive_file("beat_this-abc/../escape.py")
        with patch.object(installer, "SOURCE", self.source):
            with self.assertRaisesRegex(ValueError, "Unsafe archive member"):
                installer.vendor_source(self.archive, "abc")
        self.assertFalse((self.root / "escape.py").exists())

    def test_wrong_source_commit_is_blocked(self):
        self.archive_file("beat_this-other/LICENSE")
        with patch.object(installer, "SOURCE", self.source):
            with self.assertRaisesRegex(ValueError, "Unsafe archive member"):
                installer.vendor_source(self.archive, "abc")


if __name__ == "__main__":
    unittest.main()
