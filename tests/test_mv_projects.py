from __future__ import annotations

import io
import json
import tempfile
import threading
import unittest
import uuid
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from webapp import mv_projects, server, workflows
from test_workflows import make_payload


class MVProjectTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.music_id = str(uuid.uuid4())
        self.payload = {"name": "MV draft", "music_source_id": self.music_id,
                        "prompt": "Ocean at dawn", "aspect": "16:9"}

    def resolve(self, item_id):
        return {"path": str(self.root / "source.wav")} if item_id == self.music_id else None

    def test_private_persistence_and_revision_updates(self):
        project = mv_projects.save_project(self.root, self.payload, self.resolve)
        self.assertEqual(project["kind"], "mv")
        self.assertEqual(project["status"], "draft")
        self.assertEqual(mv_projects.list_projects(self.root), [project])
        path = self.root / "mv" / f"{project['id']}.json"
        self.assertEqual(path.stat().st_mode & 0o777, 0o600)
        self.assertEqual(path.parent.stat().st_mode & 0o777, 0o700)
        saved = mv_projects.save_project(
            self.root, {**self.payload, "name": "Updated", "revision": project["revision"]},
            self.resolve, project["id"])
        self.assertEqual(saved["id"], project["id"])
        self.assertEqual(saved["created_at"], project["created_at"])
        self.assertNotEqual(saved["revision"], project["revision"])
        with self.assertRaisesRegex(ValueError, "mv_conflict"):
            mv_projects.save_project(
                self.root, {**self.payload, "revision": project["revision"]},
                self.resolve, project["id"])
        self.assertEqual(mv_projects.list_projects(self.root)[0]["name"], "Updated")
        self.assertFalse((self.root / "long-video").exists())

    def test_invalid_input_cannot_write_a_draft_or_accept_source_paths(self):
        for changes in (
            {"name": ""}, {"music_source_id": "../source.wav"},
            {"music_source_id": str(uuid.uuid4())}, {"aspect": []},
            {"prompt": "x" * 4001}, {"music_source_path": "/tmp/private.wav"},
            {"status": "running"}, {"shots": []},
        ):
            with self.subTest(changes=changes), self.assertRaises(ValueError):
                mv_projects.save_project(self.root, {**self.payload, **changes}, self.resolve)
        self.assertFalse((self.root / "mv").exists())

    def test_collection_limit_is_enforced(self):
        with patch.object(mv_projects, "MAX_PROJECTS", 1):
            mv_projects.save_project(self.root, self.payload, self.resolve)
            with self.assertRaisesRegex(ValueError, "mv_storage_full"):
                mv_projects.save_project(self.root, self.payload, self.resolve)

    def test_symlinks_and_corrupt_manifests_are_not_silently_ignored(self):
        project = mv_projects.save_project(self.root, self.payload, self.resolve)
        path = self.root / "mv" / f"{project['id']}.json"
        path.write_text("{broken", encoding="utf-8")
        with self.assertRaisesRegex(RuntimeError, "mv_storage_invalid"):
            mv_projects.list_projects(self.root)
        path.unlink()
        target = self.root / "external.json"
        target.write_text("{}", encoding="utf-8")
        path.symlink_to(target)
        with self.assertRaisesRegex(RuntimeError, "mv_storage_invalid"):
            mv_projects.list_projects(self.root)
        self.assertEqual(target.read_text(), "{}")

    def test_missing_source_does_not_delete_or_rewrite_existing_draft(self):
        project = mv_projects.save_project(self.root, self.payload, self.resolve)
        with self.assertRaisesRegex(ValueError, "music_source_not_found"):
            mv_projects.save_project(
                self.root, {**self.payload, "revision": project["revision"]},
                lambda _: None, project["id"])
        self.assertEqual(mv_projects.list_projects(self.root), [project])
        with patch.object(server, "_resolve_workflow_music_source", return_value=None):
            public = server._public_mv_project(project)
        self.assertFalse(public["music_available"])
        self.assertIsNone(public["audio_url"])
        self.assertFalse(public["generation_available"])
        self.assertNotIn("music_source_path", public)

    def test_long_video_requests_only_allow_new_score_without_subtitles(self):
        def parse(soundtrack):
            payload = make_payload()
            payload["soundtrack"] = {**payload["soundtrack"], **soundtrack}
            raw = json.dumps(payload).encode()
            handler = type("Handler", (), {
                "headers": {"Content-Length": str(len(raw))}, "rfile": io.BytesIO(raw)})()
            return server._read_long_video_payload(handler)
        self.assertFalse(parse({})["soundtrack"]["burn_lyrics"])
        for soundtrack in (
            {"music_source_id": self.music_id}, {"burn_lyrics": True},
            {"burn_lyrics": 0}, {"burn_lyrics": "false"},
        ):
            with self.subTest(soundtrack=soundtrack), self.assertRaises(ValueError):
                parse(soundtrack)

    def test_legacy_migration_keeps_bytes_id_revision_and_source_music(self):
        project = mv_projects.save_project(self.root, self.payload, self.resolve)
        before = (self.root / "mv" / f"{project['id']}.json").read_bytes()
        (self.root / "mv").rename(self.root / "mv-projects")
        music = self.root / "source.wav"
        music.write_bytes(b"source music")
        self.assertEqual(mv_projects.list_projects(self.root), [project])
        self.assertFalse((self.root / "mv-projects").exists())
        self.assertEqual((self.root / "mv" / f"{project['id']}.json").read_bytes(), before)
        with self.assertRaisesRegex(ValueError, "mv_conflict"):
            mv_projects.delete_project(self.root, project["id"], "stale")
        mv_projects.delete_project(self.root, project["id"], project["revision"])
        self.assertEqual(mv_projects.list_projects(self.root), [])
        self.assertEqual(music.read_bytes(), b"source music")
        with self.assertRaisesRegex(ValueError, "mv_not_found"):
            mv_projects.delete_project(self.root, project["id"], project["revision"])

    def test_legacy_migration_merges_without_overwriting_and_rolls_back_failures(self):
        old = [mv_projects.save_project(self.root, self.payload, self.resolve) for _ in range(2)]
        (self.root / "mv").rename(self.root / "mv-projects")
        (self.root / "mv").mkdir(mode=0o700)
        link = mv_projects.os.link
        calls = 0

        def fail_second_link(source, destination):
            nonlocal calls
            calls += 1
            if calls == 2:
                raise OSError("simulated move failure")
            return link(source, destination)

        with patch.object(mv_projects.os, "link", side_effect=fail_second_link):
            with self.assertRaisesRegex(OSError, "simulated"):
                mv_projects.list_projects(self.root)
        self.assertEqual(len(list((self.root / "mv-projects").glob("*.json"))), 2)
        self.assertEqual(list((self.root / "mv").iterdir()), [])
        self.assertEqual({item["id"] for item in mv_projects.list_projects(self.root)},
                         {item["id"] for item in old})
        self.assertFalse((self.root / "mv-projects").exists())

    def test_legacy_conflicts_corruption_and_symlinks_preserve_source(self):
        project = mv_projects.save_project(self.root, self.payload, self.resolve)
        path = self.root / "mv" / f"{project['id']}.json"
        before = path.read_bytes()
        legacy = self.root / "mv-projects"
        legacy.mkdir()
        old = legacy / path.name
        old.write_bytes(before)
        with self.assertRaisesRegex(RuntimeError, "mv_storage_conflict"):
            mv_projects.list_projects(self.root)
        self.assertEqual(old.read_bytes(), before)
        self.assertEqual(path.read_bytes(), before)
        old.write_text("{broken")
        with self.assertRaisesRegex(RuntimeError, "mv_storage_invalid"):
            mv_projects.list_projects(self.root)
        old.unlink()
        old.symlink_to(path)
        with self.assertRaisesRegex(RuntimeError, "mv_storage_invalid"):
            mv_projects.list_projects(self.root)
        self.assertEqual(path.read_bytes(), before)

    def test_http_create_list_update_conflict_and_origin_guard(self):
        with patch.object(server, "OUTPUT_ROOT", self.root), \
                patch.object(server, "_resolve_workflow_music_source", side_effect=self.resolve):
            httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
            thread = threading.Thread(target=httpd.serve_forever, daemon=True)
            thread.start()
            base = f"http://127.0.0.1:{httpd.server_port}/api/mv-projects"
            try:
                def post(url, payload, origin=None):
                    headers = {"Content-Type": "application/json"}
                    if origin:
                        headers["Origin"] = origin
                    return urlopen(Request(url, data=json.dumps(payload).encode(),
                                           headers=headers, method="POST"))
                with post(base, self.payload) as response:
                    self.assertEqual(response.status, 201)
                    project = json.loads(response.read())["project"]
                self.assertTrue(project["generation_available"])
                self.assertEqual(project["audio_url"], f"/api/history/{self.music_id}/audio")
                with urlopen(base) as response:
                    self.assertEqual(json.loads(response.read())["items"], [project])
                update_url = f"{base}/{project['id']}/update"
                payload = {**self.payload, "revision": project["revision"], "name": "Edited"}
                with post(update_url, payload) as response:
                    updated = json.loads(response.read())["project"]
                    self.assertEqual(updated["name"], "Edited")
                with self.assertRaises(HTTPError) as failure:
                    post(update_url, payload)
                self.assertEqual(failure.exception.code, 409)
                failure.exception.close()
                with self.assertRaises(HTTPError) as failure:
                    post(base, self.payload, "https://untrusted.invalid")
                self.assertEqual(failure.exception.code, 403)
                failure.exception.close()
                self.assertEqual(len(mv_projects.list_projects(self.root)), 1)
                def delete(revision, origin=None, **extra):
                    headers = {"Content-Type": "application/json"}
                    if origin:
                        headers["Origin"] = origin
                    return urlopen(Request(f"{base}/{project['id']}",
                                           data=json.dumps({"revision": revision, **extra}).encode(),
                                           headers=headers, method="DELETE"))
                for revision, origin, extra, expected in (
                    (project["revision"], None, {}, 409),
                    (updated["revision"], "https://untrusted.invalid", {}, 403),
                    (updated["revision"], None, {"delete_music": True}, 400),
                ):
                    with self.assertRaises(HTTPError) as failure:
                        delete(revision, origin, **extra)
                    self.assertEqual(failure.exception.code, expected)
                    failure.exception.close()
                with delete(updated["revision"]) as response:
                    self.assertEqual(json.loads(response.read())["deleted"], project["id"])
                self.assertEqual(mv_projects.list_projects(self.root), [])
                with self.assertRaises(HTTPError) as failure:
                    delete(updated["revision"])
                self.assertEqual(failure.exception.code, 404)
                failure.exception.close()
            finally:
                httpd.shutdown()
                httpd.server_close()
                thread.join()

    def test_long_video_http_create_and_update_clear_legacy_options(self):
        with patch.object(server, "OUTPUT_ROOT", self.root):
            httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
            thread = threading.Thread(target=httpd.serve_forever, daemon=True)
            thread.start()
            base = f"http://127.0.0.1:{httpd.server_port}/api/workflows"
            try:
                def post(url, payload):
                    return urlopen(Request(url, data=json.dumps(payload).encode(), method="POST"))
                with post(base, make_payload()) as response:
                    project = json.loads(response.read())["workflow"]
                self.assertFalse(project["soundtrack"]["burn_lyrics"])
                legacy = make_payload()
                legacy["soundtrack"]["burn_lyrics"] = True
                for url in (base, f"{base}/{project['id']}/update"):
                    with self.assertRaises(HTTPError) as failure:
                        post(url, legacy)
                    self.assertEqual(failure.exception.code, 400)
                    failure.exception.close()
                self.assertEqual(len(workflows.list_workflows(self.root)), 1)
            finally:
                httpd.shutdown()
                httpd.server_close()
                thread.join()


if __name__ == "__main__":
    unittest.main()
