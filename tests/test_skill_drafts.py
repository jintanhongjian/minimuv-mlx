from __future__ import annotations

import json
import fcntl
import os
import stat
import threading
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from webapp import server, skill_conversion as skills, skill_drafts as drafts
import test_skill_backend


class SkillDraftTests(unittest.TestCase):
    def setUp(self) -> None:
        self.backend = test_skill_backend.SkillBackendTests()
        self.backend.setUp()
        self.addCleanup(self.backend.doCleanups)
        self.root = Path(self.backend.directory.name).resolve() / "drafts"
        binding = patch.object(drafts, "DRAFT_ROOT", self.root)
        binding.start()
        self.addCleanup(binding.stop)
        self.record = self.backend.prepare(False)
        self.key = self.record["request"]["trusted_context"]["request_id"]
        self.payload = {
            "id": None, "revision": None, "name": "Review notes",
            "request_id": self.key, "result_text": "",
        }

    def save(self, **changes) -> dict:
        return drafts.save({**self.payload, **changes})

    def http(self):
        self.backend.server_patches()
        httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()
        self.addCleanup(thread.join)
        self.addCleanup(httpd.server_close)
        self.addCleanup(httpd.shutdown)
        base = f"http://127.0.0.1:{httpd.server_port}"

        def call(path, payload=None, origin=None):
            request = Request(base + path, data=skills.encoded(payload) if payload is not None else None,
                              headers={"Origin": origin} if origin else {})
            with urlopen(request, timeout=5) as response:
                return json.load(response)
        return call

    def test_large_source_and_candidate_survive_persistent_storage(self) -> None:
        self.backend.payload["source"]["files"].extend(
            {"path": f"reference-{index}.md", "content": "x" * 96000} for index in range(5)
        )
        record = self.backend.prepare(False)
        saved = self.save(
            request_id=record["request"]["trusted_context"]["request_id"], result_text="x" * 100000,
        )
        self.assertGreater((self.root / f"{saved['id']}.json").stat().st_size, 1024 * 1024)
        loaded, restored = drafts.load(saved["id"])
        self.assertEqual(restored["source"], record["source"])
        self.assertEqual(loaded["result_text"], "x" * 100000)

    def test_restart_restores_exact_source_and_invalid_json_without_approval(self) -> None:
        saved = self.save(result_text='{"unfinished":')
        skills.STORE = skills.ConversionStore()
        public, record = drafts.load(saved["id"])
        self.assertEqual(public["result_text"], '{"unfinished":')
        self.assertEqual(record, self.record)
        self.assertEqual(public["validation_state"], "pending")
        self.assertFalse(public["installable"])
        self.assertNotIn("approved", public)
        self.assertEqual(drafts.list_drafts()[0]["revision"], saved["revision"])
        self.assertEqual(stat.S_IMODE(self.root.stat().st_mode), 0o700)
        self.assertEqual(stat.S_IMODE((self.root / f'{saved["id"]}.json').stat().st_mode), 0o600)

    def test_update_and_delete_compare_revision_without_losing_edits(self) -> None:
        saved = self.save()
        update = {"id": saved["id"], "revision": saved["revision"]}
        edited = self.save(**update, result_text="not JSON yet")
        self.assertNotEqual(saved["revision"], edited["revision"])
        for operation in (
            lambda: self.save(**update, name="Stale overwrite"),
            lambda: drafts.delete(saved["id"], saved["revision"]),
        ):
            with self.assertRaisesRegex(skills.SkillError, "skill_draft_changed") as error:
                operation()
            self.assertEqual(error.exception.status, 409)
        self.assertEqual(drafts.load(saved["id"])[0]["result_text"], "not JSON yet")
        drafts.delete(saved["id"], edited["revision"])
        self.assertEqual(drafts.list_drafts(), [])

    def test_paths_symlinks_special_files_and_corruption_fail_closed(self) -> None:
        saved = self.save()
        path = self.root / f'{saved["id"]}.json'
        original = path.read_bytes()
        for key in ("../escape", saved["id"].upper(), "not-a-uuid"):
            with self.assertRaises(skills.SkillError):
                drafts.load(key)
        path.unlink()
        target = Path(self.backend.directory.name) / "outside.json"
        target.write_bytes(original)
        path.symlink_to(target)
        with self.assertRaisesRegex(skills.SkillError, "storage_failed"):
            drafts.load(saved["id"])
        self.assertEqual(target.read_bytes(), original)
        path.unlink()
        os.mkfifo(path)
        with self.assertRaisesRegex(skills.SkillError, "unsafe_skill_draft_file"):
            drafts.load(saved["id"])
        path.unlink()
        path.write_text('{"version":1,"version":1}')
        with self.assertRaisesRegex(skills.SkillError, "skill_draft_corrupt"):
            drafts.list_drafts()
        value = json.loads(original)
        value["record"]["source"]["files"][0]["content"] = "tampered"
        path.write_bytes(skills.encoded(value))
        with self.assertRaisesRegex(skills.SkillError, "skill_draft_corrupt"):
            drafts.load(saved["id"])

    def test_directory_and_lock_symlinks_are_rejected(self) -> None:
        outside = Path(self.backend.directory.name) / "outside"
        outside.mkdir()
        self.root.symlink_to(outside, target_is_directory=True)
        with self.assertRaisesRegex(skills.SkillError, "unsafe_skill_draft_directory"):
            self.save()
        self.root.unlink()
        self.root.mkdir()
        (self.root / ".lock").symlink_to(outside / "foreign")
        with self.assertRaisesRegex(skills.SkillError, "storage_failed"):
            self.save()
        self.assertFalse((outside / "foreign").exists())

    def test_limits_and_unknown_request_are_explicit(self) -> None:
        self.save()
        with patch.object(drafts, "MAX_DRAFTS", 1):
            with self.assertRaisesRegex(skills.SkillError, "capacity_reached"):
                self.save()
        with patch.object(drafts, "MAX_TOTAL_BYTES", 1):
            with self.assertRaisesRegex(skills.SkillError, "storage_budget"):
                self.save()
        with self.assertRaisesRegex(skills.SkillError, "result_too_large"):
            self.save(result_text="x" * (skills.MAX_REQUEST_BYTES + 1))
        with self.assertRaisesRegex(skills.SkillError, "request_not_found_or_expired"):
            self.save(request_id="missing")
        with self.assertRaisesRegex(skills.SkillError, "invalid_skill_fields"):
            drafts.save({**self.payload, "approved": True})

    def test_failed_atomic_replace_keeps_original_and_cleans_temporary(self) -> None:
        saved = self.save(result_text="before")
        with patch.object(drafts.os, "replace", side_effect=OSError("disk failure")):
            with self.assertRaisesRegex(skills.SkillError, "storage_failed"):
                self.save(id=saved["id"], revision=saved["revision"], result_text="after")
        self.assertEqual(drafts.load(saved["id"])[0]["result_text"], "before")
        self.assertEqual(list(self.root.glob(".draft-*")), [])

    def test_external_process_lock_fails_explicitly_without_hanging(self) -> None:
        self.save()
        descriptor = os.open(self.root / ".lock", os.O_RDWR)
        try:
            fcntl.flock(descriptor, fcntl.LOCK_EX | fcntl.LOCK_NB)
            with self.assertRaisesRegex(skills.SkillError, "skill_draft_storage_busy") as error:
                drafts.list_drafts()
            self.assertEqual(error.exception.status, 409)
        finally:
            os.close(descriptor)

    def test_http_save_restart_open_revalidate_edit_delete_and_local_origin(self) -> None:
        call = self.http()
        listing = call("/api/skills/drafts")
        self.assertEqual(listing["storage_path"], str(self.root))
        self.assertEqual(listing["items"], [])
        saved = call("/api/skills/drafts", self.payload)["draft"]
        self.assertFalse(saved["installable"])
        skills.STORE = skills.ConversionStore()
        opened = call(f'/api/skills/drafts/{saved["id"]}/open', {})
        self.assertTrue(opened["snapshot_current"])
        converted = call("/api/skills/convert", {"request_id": self.key})
        self.assertEqual(converted["result"]["status"], "blocked")
        check = call("/api/skills/validate", {
            "request_id": self.key, "result_text": json.dumps(converted["result"]),
        })
        self.assertTrue(check["valid"])
        self.assertFalse(check["installable"])
        self.assertFalse(check["semantic_safety_verified"])
        updated = call("/api/skills/drafts", {
            **self.payload, "id": saved["id"], "revision": saved["revision"], "result_text": "unfinished",
        })["draft"]
        self.assertEqual(updated["validation_state"], "pending")
        self.assertEqual(call("/api/skills/drafts")["items"][0]["id"], saved["id"])
        with self.assertRaises(HTTPError) as error:
            call("/api/skills/validate", {"request_id": self.key, "result_text": '{"a":1,"a":2}'})
        self.assertEqual(error.exception.code, 400)
        error.exception.close()
        for path, payload in (
            ("/api/skills/drafts", None),
            ("/api/skills/drafts", self.payload),
            (f'/api/skills/drafts/{saved["id"]}/open', {}),
            (f'/api/skills/drafts/{saved["id"]}/delete', {"revision": updated["revision"]}),
        ):
            with self.assertRaises(HTTPError) as error:
                call(path, payload, "https://foreign.invalid")
            self.assertEqual(error.exception.code, 403)
            error.exception.close()
        call(f'/api/skills/drafts/{saved["id"]}/delete', {"revision": updated["revision"]})
        self.assertEqual(call("/api/skills/drafts")["items"], [])

    def test_http_changed_capabilities_license_contract_are_stale_and_not_rebound(self) -> None:
        call = self.http()
        saved = self.save(result_text="unfinished")
        for change in (
            patch.object(server, "_skill_environment", return_value=(
                {"allowed_bindings": []}, self.backend.text,
            )),
            patch.object(skills, "artifacts", return_value=(self.record["schema"], "changed")),
        ):
            with change:
                opened = call(f'/api/skills/drafts/{saved["id"]}/open', {})
                self.assertFalse(opened["snapshot_current"])
                self.assertEqual(opened["draft"]["result_text"], "unfinished")
                with self.assertRaises(HTTPError) as error:
                    call("/api/skills/convert", {"request_id": self.key})
                self.assertEqual(error.exception.code, 409)
                error.exception.close()
        self.backend.review("restricted")
        self.assertFalse(call(f'/api/skills/drafts/{saved["id"]}/open', {})["snapshot_current"])

    def test_reopening_same_request_does_not_exhaust_capacity(self) -> None:
        call = self.http()
        saved = self.save()
        with patch.object(skills, "MAX_PENDING_REQUESTS", 1):
            for _ in range(3):
                self.assertTrue(call(f'/api/skills/drafts/{saved["id"]}/open', {})["snapshot_current"])

    def test_verified_candidate_requires_fresh_host_validation_after_restart_and_edit(self) -> None:
        self.record = self.backend.prepare(True)
        self.key = self.record["request"]["trusted_context"]["request_id"]
        self.payload["request_id"] = self.key
        candidate = self.backend.candidate(self.record)
        saved = self.save(result_text=json.dumps(candidate))
        call = self.http()
        skills.STORE = skills.ConversionStore()
        opened = call(f'/api/skills/drafts/{saved["id"]}/open', {})
        self.assertEqual(opened["draft"]["validation_state"], "pending")
        checked = call("/api/skills/validate", {"request_id": self.key, "result_text": saved["result_text"]})
        self.assertTrue(checked["valid"])
        original_hash = checked["candidate_sha256"]
        candidate["package"]["bindings"][0]["instructions"] = "Use only supplied subject details."
        updated = self.save(
            id=saved["id"], revision=saved["revision"], result_text=json.dumps(candidate),
        )
        checked = call("/api/skills/validate", {"request_id": self.key, "result_text": updated["result_text"]})
        self.assertTrue(checked["valid"])
        self.assertNotEqual(checked["candidate_sha256"], original_hash)
        self.assertTrue(checked["installable"])
        self.assertEqual(updated["validation_state"], "pending")

    def test_parallel_updates_allow_only_one_revision_writer(self) -> None:
        saved = self.save()
        failures = []
        successes = []
        barrier = threading.Barrier(2)

        def update(name):
            barrier.wait(timeout=5)
            try:
                successes.append(self.save(id=saved["id"], revision=saved["revision"], name=name))
            except skills.SkillError as exc:
                failures.append(str(exc))

        threads = [threading.Thread(target=update, args=(name,)) for name in ("A", "B")]
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join(timeout=5)
            self.assertFalse(thread.is_alive())
        self.assertEqual(len(successes), 1)
        self.assertEqual(failures, ["skill_draft_changed"])
