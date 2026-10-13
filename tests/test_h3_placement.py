from __future__ import annotations

import fcntl
import hashlib
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from scripts import finalize_h3_downloads as placement


class PlacementTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.monitor = self.root / "monitor"
        self.state = self.root / "state"
        self.monitor.mkdir()
        self.state.mkdir()
        self.plan = {"jobs": ["first", "second"]}
        placement.save(self.monitor / "plan.json", self.plan)
        self.jobs = []
        for name in self.plan["jobs"]:
            source = self.root / "source" / name
            (source / ".cache").mkdir(parents=True)
            (source / "weights").write_bytes(b"abc")
            self.jobs.append({"name": name, "source": str(source),
                             "destination": str(self.root / "destination" / name),
                             "files": [{"name": "weights", "bytes": 3,
                                        "hash": hashlib.sha256(b"abc").hexdigest()}]})
        placement.save(self.state / "config.json", {
            "monitor": str(self.monitor), "monitor_plan": self.plan, "jobs": self.jobs})
        self.statuses("complete")

    def statuses(self, status):
        placement.save(self.monitor / "jobs.json", {
            name: {"status": status} for name in self.plan["jobs"]})

    def assert_sources_preserved(self):
        for job in self.jobs:
            self.assertTrue(Path(job["source"]).is_dir())
            self.assertFalse(Path(job["destination"]).exists())

    def test_waiting_downloads_are_not_moved(self):
        self.statuses("running")
        with patch.object(placement.time, "sleep", side_effect=StopIteration):
            with self.assertRaises(StopIteration):
                placement.run(self.state, 1)
        self.assert_sources_preserved()
        self.assertEqual(json.loads((self.state / "status.json").read_text())["status"], "waiting")

    def test_waiting_monitor_lock_is_not_bypassed(self):
        with (self.monitor / "monitor.lock").open("a") as handle:
            fcntl.flock(handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
            with patch.object(placement.time, "sleep", side_effect=StopIteration):
                with self.assertRaises(StopIteration):
                    placement.run(self.state, 1)
        self.assert_sources_preserved()

    def test_complete_snapshots_move_once_and_reopening_is_idempotent(self):
        placement.run(self.state, 1)
        inodes = []
        for job in self.jobs:
            self.assertFalse(Path(job["source"]).exists())
            target = Path(job["destination"]) / "weights"
            self.assertEqual(target.read_bytes(), b"abc")
            inodes.append(target.stat().st_ino)
        placement.run(self.state, 1)
        self.assertEqual([Path(job["destination"]).joinpath("weights").stat().st_ino
                          for job in self.jobs], inodes)
        self.assertTrue(json.loads((self.state / "receipt.json").read_text())["complete"])

    def test_checksum_failure_prevents_either_move(self):
        Path(self.jobs[1]["source"]).joinpath("weights").write_bytes(b"bad")
        with self.assertRaisesRegex(ValueError, "checksum"):
            placement.run(self.state, 1)
        self.assert_sources_preserved()

    def test_destination_conflict_does_not_overwrite_or_move_either_source(self):
        target = Path(self.jobs[1]["destination"])
        target.mkdir(parents=True)
        (target / "existing").write_bytes(b"keep")
        with self.assertRaisesRegex(ValueError, "Destination conflict"):
            placement.run(self.state, 1)
        self.assertTrue(Path(self.jobs[0]["source"]).exists())
        self.assertTrue(Path(self.jobs[1]["source"]).exists())
        self.assertEqual((target / "existing").read_bytes(), b"keep")
        self.assertFalse(Path(self.jobs[0]["destination"]).exists())

    def test_stopped_downloads_and_changed_plan_block(self):
        self.statuses("blocked")
        with self.assertRaisesRegex(ValueError, "require review"):
            placement.run(self.state, 1)
        self.statuses("complete")
        placement.save(self.monitor / "plan.json", {"changed": True})
        with self.assertRaisesRegex(ValueError, "plan changed"):
            placement.run(self.state, 1)
        self.assert_sources_preserved()

    def test_snapshot_symlinks_and_missing_files_block(self):
        source = Path(self.jobs[0]["source"])
        (source / "link").symlink_to(source / "weights")
        with self.assertRaisesRegex(ValueError, "symlinks"):
            placement.verify_snapshot(source, self.jobs[0]["files"])
        (source / "link").unlink()
        (source / "weights").unlink()
        with self.assertRaisesRegex(ValueError, "missing"):
            placement.verify_snapshot(source, self.jobs[0]["files"])

    def test_git_blob_hash_and_path_traversal(self):
        files = [{"name": "weights", "bytes": 3,
                  "hash": hashlib.sha1(b"blob 3\0abc").hexdigest()}]
        placement.verify_snapshot(Path(self.jobs[0]["source"]), files)
        files[0]["name"] = "../weights"
        with self.assertRaisesRegex(ValueError, "invalid"):
            placement.verify_snapshot(Path(self.jobs[0]["source"]), files)

    def test_exclusive_move_rejects_even_an_empty_existing_destination(self):
        source = Path(self.jobs[0]["source"])
        destination = self.root / "existing"
        destination.mkdir()
        with self.assertRaises(OSError):
            placement.exclusive_move(source, destination)
        self.assertTrue(source.exists())
        self.assertEqual(list(destination.iterdir()), [])


if __name__ == "__main__":
    unittest.main()
