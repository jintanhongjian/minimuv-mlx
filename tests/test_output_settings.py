from __future__ import annotations

import copy
import json
import tempfile
import threading
import unittest
from http.server import ThreadingHTTPServer
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from webapp import local_models, output_storage, server, workflows


class OutputLayoutTests(unittest.TestCase):
    ITEM_ID = "a90aabe4-efb7-491e-8dc6-374cf3669103"

    def test_classified_history_save_media_reuse_and_delete(self):
        for kind, prefix, suffix in (
            ("video", "h3", "mp4"), ("image", "hidream", "png"),
            ("music", "music", "wav"), ("music", "music3", "wav"), ("music", "yue2", "wav"),
        ):
            with self.subTest(prefix=prefix), tempfile.TemporaryDirectory() as temporary:
                root = Path(temporary)
                directory = output_storage.history_directory(root, kind)
                directory.mkdir()
                media = directory / f"{prefix}-{self.ITEM_ID}.{suffix}"
                media.write_bytes(b"saved media")
                settings = {"prompt": "Saved project"}
                if kind == "music":
                    settings.update(model="yue2-3b-8bit" if prefix == "yue2" else "music3",
                                    duration=120, steps=30, seed=40, lyrics_mode="lyrics",
                                    lyrics="[verse]\nSaved lyrics")
                with patch.object(server, "OUTPUT_ROOT", root), patch.object(
                    server, "_active_job_id", None
                ), patch.object(server, "_active_workflow_id", None):
                    server._persist_history({
                        "id": self.ITEM_ID, "kind": kind, "prompt": "Saved project",
                        "created_at": 123,
                    }, [media], settings)
                    self.assertTrue((directory / f"{self.ITEM_ID}.json").is_file())
                    item = server._history_items()[0]
                    self.assertEqual(item["id"], self.ITEM_ID)
                    self.assertEqual(item["kind"], kind)
                    resolved, _ = server._history_media_path(
                        self.ITEM_ID, "audio" if kind == "music" else kind
                    )
                    self.assertEqual(resolved, media)
                    if kind == "music":
                        self.assertEqual(server._resolve_workflow_music_source(self.ITEM_ID)["path"], str(media))
                        self.assertEqual(item["generation"]["model"], settings["model"])
                    server._delete_history_item(self.ITEM_ID)
                    self.assertEqual(server._history_items(), [])
                    self.assertFalse(media.exists())

    def test_legacy_yue_and_workflow_migration_preserves_bytes_and_paths(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            audio = root / f"yue2-{self.ITEM_ID}.wav"
            audio.write_bytes(b"original audio")
            metadata = root / f"{self.ITEM_ID}.json"
            metadata.write_text(json.dumps({
                "id": self.ITEM_ID, "kind": "music", "prompt": "YuE song",
                "created_at": 123, "generation": {"model": "yue2-3b-8bit",
                "duration": 120, "steps": 30, "seed": 40, "lyrics_mode": "lyrics", "lyrics": "Song"},
            }))
            original = metadata.read_bytes()
            manifest = workflows.create_workflow(root, {
                "shots": [{"prompt": "Shot", "duration": 8}],
                "soundtrack": {"mode": "none"},
            })
            directory = workflows.workflow_directory(root, manifest["id"])
            frame = directory / "frame.png"
            frame.write_bytes(b"frame")
            manifest["shots"][0]["last_frame_path"] = str(frame)
            manifest["soundtrack"]["source_path"] = str(audio)
            workflows._write_manifest(root, manifest)
            (root / "long-video").rename(root / "workflows")
            old_frame = root / "workflows" / manifest["id"] / "frame.png"
            manifest["shots"][0]["last_frame_path"] = str(old_frame)
            workflows._write_manifest(root, manifest)
            unknown = root / "notes.txt"
            unknown.write_text("keep")
            with patch.object(server, "OUTPUT_ROOT", root):
                self.assertEqual(server._history_items()[0]["id"], self.ITEM_ID)
                output_storage.organize_legacy_outputs(root)
                output_storage.organize_legacy_outputs(root)
                self.assertEqual((root / "music" / audio.name).read_bytes(), b"original audio")
                self.assertEqual((root / "music" / metadata.name).read_bytes(), original)
                migrated = workflows.get_workflow(root, manifest["id"])
                self.assertEqual(migrated["soundtrack"]["source_path"], str(root / "music" / audio.name))
                self.assertEqual(Path(migrated["shots"][0]["last_frame_path"]).read_bytes(), b"frame")
                self.assertEqual(unknown.read_text(), "keep")
                self.assertEqual(server._history_items()[0]["generation"]["model"], "yue2-3b-8bit")
                with self.assertRaisesRegex(ValueError, "history_in_use"):
                    server._delete_history_item(self.ITEM_ID)

    def test_conflicts_and_symlink_directories_do_not_move_legacy_audio(self):
        for symlink in (False, True):
            with self.subTest(symlink=symlink), tempfile.TemporaryDirectory() as temporary:
                root = Path(temporary)
                audio = root / f"yue2-{self.ITEM_ID}.wav"
                audio.write_bytes(b"keep")
                if symlink:
                    (root / "outside").mkdir()
                    (root / "music").symlink_to(root / "outside", target_is_directory=True)
                else:
                    (root / "music").mkdir()
                    (root / "music" / audio.name).write_bytes(b"destination")
                with self.assertRaisesRegex(ValueError, "output_layout"):
                    output_storage.organize_legacy_outputs(root)
                self.assertEqual(audio.read_bytes(), b"keep")

    def test_failed_move_rolls_back_without_losing_audio(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            for prefix in ("music3", "yue2"):
                (root / f"{prefix}-{self.ITEM_ID}.wav").write_bytes(prefix.encode())
            rename = output_storage.os.rename
            attempts = 0

            def fail_once(source, destination):
                nonlocal attempts
                attempts += 1
                if attempts == 2:
                    raise OSError("disk failure")
                rename(source, destination)

            with patch.object(output_storage.os, "rename", side_effect=fail_once):
                with self.assertRaisesRegex(OSError, "disk failure"):
                    output_storage.organize_legacy_outputs(root)
            for prefix in ("music3", "yue2"):
                self.assertEqual((root / f"{prefix}-{self.ITEM_ID}.wav").read_bytes(), prefix.encode())


class OutputSettingsTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        self.source = self.root / "outputs"
        self.source.mkdir()
        self.destination = self.root / "new"
        self.settings = copy.deepcopy(server._DEFAULT_SETTINGS)
        self.settings["output_directory"] = str(self.source)
        for name, value in (
            ("_DEFAULT_SETTINGS", self.settings), ("OUTPUT_ROOT", self.source),
            ("SETTINGS_PATH", self.root / "settings.json"),
            ("_jobs", {}), ("_active_job_id", None), ("_active_workflow_id", None),
            ("_h3_reload_required", False),
        ):
            patcher = patch.object(server, name, value)
            patcher.start()
            self.addCleanup(patcher.stop)

    def test_registry_is_authoritative_and_legacy_paths_are_preserved(self):
        legacy = {key: self.settings[key] for key in ("video", "image", "music", "text")}
        legacy["video"]["model_path"] = "~/custom/h3"
        normalized = server._validate_app_settings(legacy)
        self.assertEqual(normalized["models"]["h3"]["model_path"], "~/custom/h3")
        settings = copy.deepcopy(self.settings)
        settings["models"]["h3"].update(name="My video", model_path="/models/custom", enabled=False)
        normalized = server._validate_app_settings(settings)
        self.assertEqual(normalized["video"]["model_path"], "/models/custom")
        with patch.object(server, "_settings_snapshot", return_value=normalized):
            self.assertEqual(server._model_options()["video"][0]["name"], "My video")
            with self.assertRaisesRegex(ValueError, "generation_model_disabled"):
                server._require_enabled_model("h3")

    def test_invalid_registry_and_storage_paths(self):
        for update in (
            {"output_directory": "relative"}, {"gemma_path": ""},
            {"models": {}}, {"models": {"unsupported": {}}},
        ):
            with self.subTest(update=update), self.assertRaises(ValueError):
                server._validate_app_settings({**self.settings, **update})
        settings = copy.deepcopy(self.settings)
        for model in ("h3", *local_models.VIDEO_MODELS):
            settings["models"][model]["enabled"] = False
        with self.assertRaisesRegex(ValueError, "at_least_one_model"):
            server._validate_app_settings(settings)

    def test_migrates_history_media_and_workflow_paths_retaining_originals(self):
        media = self.source / "image.png"
        media.write_bytes(b"image bytes")
        manifest = workflows.create_workflow(self.source, {
            "name": "Project", "model": "h3", "aspect": "16:9", "total_duration": 8,
            "shots": [{"title": "Shot", "prompt": "A scene", "duration": 8}],
            "soundtrack": {"mode": "none"},
        })
        manifest["output_path"] = str(media)
        manifest["shots"][0]["video_path"] = str(media)
        manifest["shots"][0]["prompt"] = str(media)
        workflows._write_manifest(self.source, manifest)
        (self.source / "history.json").write_text('{"prompt": "unchanged"}')
        server._jobs["saved"] = {"image_path": media}
        saved = server._save_app_settings({**self.settings, "output_directory": str(self.destination)})
        self.assertEqual(server.OUTPUT_ROOT, self.destination)
        self.assertEqual(saved, server._settings_snapshot())
        self.assertEqual((self.destination / "image.png").read_bytes(), media.read_bytes())
        copied = workflows.get_workflow(self.destination, manifest["id"])
        self.assertEqual(copied["output_path"], str(self.destination / "image.png"))
        self.assertEqual(copied["shots"][0]["video_path"], str(self.destination / "image.png"))
        self.assertEqual(copied["shots"][0]["prompt"], str(media))
        self.assertEqual(server._jobs["saved"]["image_path"], self.destination / "image.png")
        self.assertEqual(server.SETTINGS_PATH.stat().st_mode & 0o777, 0o600)
        self.assertEqual((self.destination / "long-video" / manifest["id"]).stat().st_mode & 0o777, 0o700)
        self.assertTrue(media.exists())

    def test_rejects_busy_nonempty_overlap_and_symlink_without_switch(self):
        with patch.object(server, "_active_job_id", "active"), self.assertRaises(ValueError):
            server._save_app_settings({**self.settings, "output_directory": str(self.destination)})
        for destination in (self.source / "nested", self.root):
            with self.subTest(destination=destination), self.assertRaises(ValueError):
                output_storage.prepare_migration(self.source, destination)
        self.destination.mkdir()
        (self.destination / "existing").write_text("keep")
        with self.assertRaises(ValueError):
            output_storage.prepare_migration(self.source, self.destination)
        (self.source / "link").symlink_to(self.destination)
        with self.assertRaises(ValueError):
            output_storage.prepare_migration(self.source, self.root / "another")
        self.assertEqual(server.OUTPUT_ROOT, self.source)
        self.assertFalse(list(self.root.glob(".minimuv-migration-*")))

    def test_failed_settings_publication_retains_old_root_and_verified_copy(self):
        (self.source / "music.wav").write_bytes(b"audio")
        replace = server.os.replace

        def fail_settings(source, destination):
            if Path(destination) == server.SETTINGS_PATH:
                raise OSError("settings unavailable")
            return replace(source, destination)

        with patch.object(server.os, "replace", side_effect=fail_settings):
            with self.assertRaisesRegex(RuntimeError, "Verified output copy retained"):
                server._save_app_settings({**self.settings, "output_directory": str(self.destination)})
        self.assertEqual(server.OUTPUT_ROOT, self.source)
        self.assertFalse(server.SETTINGS_PATH.exists())
        self.assertEqual((self.destination / "music.wav").read_bytes(), b"audio")
        self.assertTrue((self.source / "music.wav").exists())

    def test_configured_directories_used_for_status_and_commands(self):
        self.settings["models"]["flux2-klein-4b"]["model_path"] = "/configured/klein"
        self.settings["gemma_path"] = "/configured/gemma"
        with patch.object(local_models, "status", return_value={}) as status:
            server._local_model_status("flux2-klein-4b")
        status.assert_called_once_with("flux2-klein-4b", Path("/configured/klein"), Path("/configured/gemma"))
        command = local_models.command({
            "model": "ltx-2.3-distilled-q4", "model_path": "/configured/ltx",
            "gemma_path": "/configured/gemma", "prompt": "scene", "width": 768,
            "height": 512, "num_frames": 121, "seed": 42,
        }, self.root / "video.mp4")
        self.assertEqual(command[command.index("--model") + 1], "/configured/ltx")
        self.assertEqual(command[command.index("--gemma") + 1], "/configured/gemma")

    def test_failed_verification_cleans_staging_and_does_not_publish(self):
        (self.source / "result").write_bytes(b"result")
        with patch.object(output_storage, "_digest", side_effect=[b"source", b"bad copy"]):
            with self.assertRaisesRegex(RuntimeError, "verification failed"):
                server._save_app_settings({**self.settings, "output_directory": str(self.destination)})
        self.assertFalse(self.destination.exists())
        self.assertFalse(server.SETTINGS_PATH.exists())
        self.assertFalse(list(self.root.glob(".minimuv-migration-*")))

    def test_empty_source_and_existing_empty_destination(self):
        self.destination.mkdir()
        server._save_app_settings({**self.settings, "output_directory": str(self.destination)})
        self.assertEqual(server.OUTPUT_ROOT, self.destination)
        self.assertTrue(self.destination.is_dir())

    def test_h3_does_not_silently_use_a_different_scanned_directory(self):
        with patch.object(server, "_valid_h3_model", return_value=False), patch.object(
            server.os, "walk"
        ) as walk:
            self.assertEqual(server._find_models(), [])
        walk.assert_not_called()

    def test_migration_io_failure_is_reported_and_does_not_claim_a_verified_copy(self):
        with patch.object(output_storage, "prepare_migration", side_effect=OSError("permission denied")):
            with self.assertRaisesRegex(RuntimeError, "permission denied") as error:
                server._save_app_settings({**self.settings, "output_directory": str(self.destination)})
        self.assertNotIn("Verified output copy", str(error.exception))
        self.assertEqual(server.OUTPUT_ROOT, self.source)

    def test_unreadable_directories_are_not_silently_skipped(self):
        def unreadable(*args, **kwargs):
            kwargs["onerror"](PermissionError("cannot list output directory"))
            return iter(())

        with patch.object(output_storage.os, "walk", side_effect=unreadable):
            with self.assertRaisesRegex(RuntimeError, "cannot list output directory"):
                server._save_app_settings({**self.settings, "output_directory": str(self.destination)})
        self.assertFalse(self.destination.exists())
        self.assertFalse(list(self.root.glob(".minimuv-migration-*")))

    def test_http_settings_migration_and_disabled_generation(self):
        httpd = ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()
        base = f"http://127.0.0.1:{httpd.server_address[1]}"
        try:
            payload = copy.deepcopy(self.settings)
            payload["output_directory"] = str(self.destination)
            payload["models"]["flux2-klein-4b"].update(enabled=False, name="Disabled image")
            request = Request(
                base + "/api/settings", data=json.dumps(payload).encode(),
                headers={"Content-Type": "application/json"}, method="POST",
            )
            with urlopen(request, timeout=5) as response:
                self.assertEqual(response.status, 200)
                self.assertEqual(json.load(response)["settings"]["models"], payload["models"])
            with urlopen(base + "/api/settings", timeout=5) as response:
                self.assertEqual(json.load(response)["settings"]["output_directory"], str(self.destination))
            request = Request(
                base + "/api/image-jobs",
                data=json.dumps({"prompt": "A scene", "model": "flux2-klein-4b"}).encode(),
                headers={"Content-Type": "application/json"}, method="POST",
            )
            with self.assertRaises(HTTPError) as error:
                urlopen(request, timeout=5)
            with error.exception as response:
                self.assertEqual(response.code, 400)
                self.assertEqual(json.load(response)["error"], "generation_model_disabled")
            self.assertFalse(server._jobs)
        finally:
            httpd.shutdown()
            thread.join(timeout=5)
            httpd.server_close()


if __name__ == "__main__":
    unittest.main()
