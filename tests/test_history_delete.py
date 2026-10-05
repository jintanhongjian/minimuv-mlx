from __future__ import annotations

import json
import tempfile
import threading
import unittest
import uuid
from http.server import ThreadingHTTPServer
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from webapp import server, workflows


class HistoryDeleteTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        self.item_id = str(uuid.uuid4())
        for key, value in (("OUTPUT_ROOT", self.root), ("_jobs", {}),
                           ("_active_job_id", None), ("_active_workflow_id", None)):
            patcher = patch.object(server, key, value)
            patcher.start()
            self.addCleanup(patcher.stop)

    def create(self, kind):
        names = {
            "video": [f"h3-{self.item_id}.mp4", f"h3-{self.item_id}.wav",
                      f"h3-{self.item_id}-first-frame.png"],
            "image": [f"hidream-{self.item_id}.png"],
            "music": [f"music3-{self.item_id}.wav"],
        }[kind]
        for name in names:
            (self.root / name).write_bytes(b"media")
        names.append(f"{self.item_id}.json")
        (self.root / names[-1]).write_text(json.dumps({
            "id": self.item_id, "kind": kind, "prompt": "Test", "created_at": 100,
        }))
        return names

    def test_all_kinds_delete_exact_owned_files_and_job(self):
        for kind in ("video", "image", "music"):
            with self.subTest(kind=kind):
                names = self.create(kind)
                server._jobs[self.item_id] = {"status": "completed"}
                unrelated = self.root / "unrelated.png"
                unrelated.write_bytes(b"keep")
                deleted = server._delete_history_item(self.item_id)
                self.assertEqual(set(deleted), set(names))
                self.assertTrue(all(not (self.root / name).exists() for name in names))
                self.assertTrue(unrelated.exists())
                self.assertNotIn(self.item_id, server._jobs)
                self.assertFalse(server._history_items())

    def test_legacy_item_without_metadata(self):
        (self.root / f"hidream-{self.item_id}.png").write_bytes(b"legacy")
        self.assertEqual(server._delete_history_item(self.item_id), [f"hidream-{self.item_id}.png"])

    def test_invalid_missing_busy_and_symlink_rejected_without_deletion(self):
        names = self.create("music")
        with self.assertRaises(ValueError):
            server._delete_history_item("../outside")
        with self.assertRaises(FileNotFoundError):
            server._delete_history_item(str(uuid.uuid4()))
        for field in ("_active_job_id", "_active_workflow_id"):
            with patch.object(server, field, "busy"), self.assertRaisesRegex(ValueError, "job_already_running"):
                server._delete_history_item(self.item_id)
        external = self.root / "external"
        external.write_bytes(b"keep")
        (self.root / f"h3-{self.item_id}.wav").symlink_to(external)
        with self.assertRaisesRegex(ValueError, "history_file_unsafe"):
            server._delete_history_item(self.item_id)
        self.assertTrue(all((self.root / name).exists() for name in names))
        self.assertEqual(external.read_bytes(), b"keep")

    def test_workflow_reference_blocks_deletion_but_private_copy_does_not(self):
        names = self.create("video")
        manifest = workflows.create_workflow(self.root, {
            "name": "Project", "model": "h3", "aspect": "16:9", "total_duration": 8,
            "shots": [{"title": "Shot", "prompt": "Scene", "duration": 8}],
            "soundtrack": {"mode": "none"},
        })
        manifest["shots"][0]["video_path"] = str(self.root / names[0])
        workflows._write_manifest(self.root, manifest)
        with self.assertRaisesRegex(ValueError, "history_in_use"):
            server._delete_history_item(self.item_id)
        self.assertTrue(all((self.root / name).exists() for name in names))
        private = workflows.workflow_directory(self.root, manifest["id"]) / "copy.png"
        private.write_bytes(b"private copy")
        manifest["shots"][0]["video_path"] = None
        manifest["shots"][0]["first_frame_path"] = str(private)
        workflows._write_manifest(self.root, manifest)
        server._delete_history_item(self.item_id)
        self.assertTrue(private.exists())

    def test_partial_failure_is_explicit(self):
        self.create("video")
        unlink = Path.unlink

        def fail(path, *args, **kwargs):
            if path.name.endswith(".wav"):
                raise PermissionError("locked file")
            return unlink(path, *args, **kwargs)

        with patch.object(Path, "unlink", fail), self.assertRaisesRegex(RuntimeError, "after removing 1 files"):
            server._delete_history_item(self.item_id)
        self.assertTrue((self.root / f"h3-{self.item_id}.wav").exists())

    def test_metadata_only_remnant_can_be_deleted_on_retry(self):
        names = self.create("image")
        (self.root / names[0]).unlink()
        self.assertEqual(server._delete_history_item(self.item_id), [names[-1]])

    def test_http_delete_and_origin_guard(self):
        names = self.create("image")
        httpd = ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()
        url = f"http://127.0.0.1:{httpd.server_address[1]}/api/history/{self.item_id}"
        try:
            with self.assertRaises(HTTPError) as error:
                urlopen(Request(url, method="DELETE", headers={"Origin": "https://example.com"}), timeout=5)
            with error.exception as response:
                self.assertEqual(response.code, 403)
            self.assertTrue(all((self.root / name).exists() for name in names))
            with urlopen(Request(url, method="DELETE"), timeout=5) as response:
                result = json.load(response)
                self.assertEqual(result["deleted"], self.item_id)
                self.assertEqual(set(result["files"]), set(names))
            with self.assertRaises(HTTPError) as error:
                urlopen(Request(url, method="DELETE"), timeout=5)
            with error.exception as response:
                self.assertEqual(response.code, 404)
        finally:
            httpd.shutdown()
            thread.join(timeout=5)
            httpd.server_close()


if __name__ == "__main__":
    unittest.main()
