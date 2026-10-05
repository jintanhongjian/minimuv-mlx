from __future__ import annotations

import json
import tempfile
import time
import unittest
import uuid
from pathlib import Path
from unittest.mock import patch

from webapp import server


class ProjectNameTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        patcher = patch.object(server, "OUTPUT_ROOT", self.root)
        patcher.start()
        self.addCleanup(patcher.stop)

    def test_validate_project_name(self):
        self.assertEqual(server._validate_project_name({}), "")
        self.assertEqual(server._validate_project_name({"name": None}), "")
        self.assertEqual(server._validate_project_name({"name": "  Opening \n shot "}), "Opening shot")
        self.assertEqual(server._validate_project_name({"name": "x" * 80}), "x" * 80)
        for bad in (5, ["a"], "x" * 81):
            with self.subTest(bad=bad), self.assertRaisesRegex(ValueError, "invalid_project_name"):
                server._validate_project_name({"name": bad})

    def test_history_name_is_lenient(self):
        self.assertEqual(server._history_name(None), "")
        self.assertEqual(server._history_name(3), "")
        self.assertEqual(server._history_name(" a  b "), "a b")
        self.assertEqual(len(server._history_name("y" * 200)), 80)

    def test_name_persisted_and_listed_and_used_by_music_source(self):
        item_id = str(uuid.uuid4())
        audio = self.root / f"music3-{item_id}.wav"
        audio.write_bytes(b"audio")
        job = {"id": item_id, "kind": "music", "created_at": time.time(), "prompt": "Calm piano",
               "name": "Theme song", "started_at": time.time()}
        server._persist_history(job, [audio])
        record = json.loads((self.root / f"{item_id}.json").read_text())
        self.assertEqual(record["name"], "Theme song")
        items = server._history_items()
        self.assertEqual(items[0]["name"], "Theme song")
        self.assertEqual(server._resolve_workflow_music_source(item_id)["name"], "Theme song")

    def test_legacy_record_without_name(self):
        item_id = str(uuid.uuid4())
        (self.root / f"hidream-{item_id}.png").write_bytes(b"img")
        (self.root / f"{item_id}.json").write_text(json.dumps(
            {"id": item_id, "kind": "image", "prompt": "Cat", "created_at": 1}))
        self.assertEqual(server._history_items()[0]["name"], "")


if __name__ == "__main__":
    unittest.main()
