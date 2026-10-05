from __future__ import annotations

import json
import base64
import tempfile
import shutil
import subprocess
import unittest
import wave
import threading
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from pathlib import Path
from unittest.mock import patch

from webapp import server, workflows


def make_payload(soundtrack: str = "none") -> dict:
    return {
        "name": "Test short film",
        "aspect": "16:9",
        "shots": [{
            "title": "Opening",
            "prompt": "A paper boat floating down a quiet stream",
            "duration": 5,
            "steps": 4,
            "seed": 7,
            "turbo": True,
        }],
        "soundtrack": {
            "mode": soundtrack,
            "mix": "score",
            "prompt": "Soft piano and strings",
            "lyrics_mode": "instrumental",
            "lyrics": "[instrumental]",
        },
    }


def fake_boundary_frame(root, workflow_id, video, ffmpeg):
    from PIL import Image
    path = workflows.workflow_directory(root, workflow_id) / f"frame-{video.stem}.png"
    Image.new("RGB", (32, 32), "blue").save(path)
    return path


class WorkflowManifestTests(unittest.TestCase):
    def test_frame_media_and_restore_api_preserve_local_access_rules(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            manifest = workflows.create_workflow(root, make_payload())
            frame = fake_boundary_frame(root, manifest["id"], Path("frame.mp4"), "")
            shot = manifest["shots"][0]
            shot.update(generated_first_frame_path=str(frame), last_frame_path=str(frame))
            manifest["status"] = "completed"
            workflows.save_workflow(root, manifest)
            with patch.object(server, "OUTPUT_ROOT", root):
                httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
                thread = threading.Thread(target=httpd.serve_forever, daemon=True)
                thread.start()
                base = f"http://127.0.0.1:{httpd.server_port}"
                try:
                    public = server._public_workflow(manifest)["shots"][0]
                    for field in ("generated_first_frame_url", "last_frame_url"):
                        with urlopen(base + public[field]) as response:
                            self.assertEqual(response.headers["Content-Type"], "image/png")
                            self.assertEqual(response.read(), frame.read_bytes())
                    url = base + f"/api/workflows/{manifest['id']}/restore"
                    with self.assertRaises(HTTPError) as failure:
                        urlopen(Request(url, data=b"", method="POST",
                                        headers={"Origin": "https://evil.invalid"}))
                    self.assertEqual(failure.exception.code, 403)
                    failure.exception.close()
                    with urlopen(Request(url, data=b"", method="POST")) as response:
                        self.assertEqual(response.status, 201)
                        restored = json.loads(response.read())["workflow"]
                    self.assertEqual(restored["status"], "draft")
                    self.assertNotEqual(restored["id"], manifest["id"])
                    with urlopen(base + restored["shots"][0]["first_frame_url"]) as response:
                        self.assertEqual(response.read(), frame.read_bytes())
                finally:
                    httpd.shutdown()
                    httpd.server_close()
                    thread.join()

    def test_restore_copies_saved_frames_into_independent_editable_history(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            manifest = workflows.create_workflow(root, make_payload())
            shot = manifest["shots"][0]
            frame = fake_boundary_frame(root, manifest["id"], Path("original.mp4"), "")
            shot.update(generated_first_frame_path=str(frame), last_frame_path=str(frame),
                        status="completed")
            manifest["status"] = "completed"
            workflows.save_workflow(root, manifest)
            original = json.loads((workflows.workflow_directory(root, manifest["id"]) / "workflow.json").read_text())
            restored = workflows.restore_workflow(root, manifest["id"])
            self.assertNotEqual(restored["id"], manifest["id"])
            self.assertEqual(restored["source_workflow_id"], manifest["id"])
            self.assertEqual(restored["status"], "draft")
            saved = Path(restored["shots"][0]["first_frame_path"])
            self.assertEqual(saved.read_bytes(), frame.read_bytes())
            self.assertEqual(saved.parent, workflows.workflow_directory(root, restored["id"]))
            self.assertEqual(workflows.get_workflow(root, manifest["id"]), original)
            frame.unlink()
            payload = make_payload()
            payload["shots"][0].update(
                prompt="A corrected scene", first_frame_id=restored["shots"][0]["first_frame_id"])
            updated = workflows.update_workflow(root, restored["id"], payload)
            self.assertEqual(updated["shots"][0]["first_frame_path"], str(saved))
            self.assertEqual(updated["shots"][0]["status"], "pending")
            self.assertIsNone(updated["shots"][0]["last_frame_path"])
            self.assertEqual(updated["shots"][0]["prompt"], "A corrected scene")

    def test_restore_rejects_active_project_and_missing_saved_frame(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            manifest = workflows.create_workflow(root, make_payload())
            with self.assertRaisesRegex(ValueError, "workflow_not_restorable"):
                workflows.restore_workflow(root, manifest["id"])
            manifest["status"] = "completed"
            manifest["shots"][0]["generated_first_frame_path"] = str(root / "missing.png")
            workflows.save_workflow(root, manifest)
            with self.assertRaisesRegex(ValueError, "first_frame_not_found"):
                workflows.restore_workflow(root, manifest["id"])
            self.assertEqual(len(workflows.list_workflows(root)), 1)

    def test_failed_restore_does_not_publish_an_incomplete_draft(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            manifest = workflows.create_workflow(root, make_payload())
            frame = fake_boundary_frame(root, manifest["id"], Path("original.mp4"), "")
            manifest["shots"][0]["generated_first_frame_path"] = str(frame)
            manifest["status"] = "completed"
            workflows.save_workflow(root, manifest)
            with patch.object(Path, "write_bytes", side_effect=OSError("disk full")):
                with self.assertRaisesRegex(RuntimeError, "workflow_restore_failed.*disk full"):
                    workflows.restore_workflow(root, manifest["id"])
            self.assertEqual(len(workflows.list_workflows(root)), 1)
            self.assertTrue(frame.is_file())

    @unittest.skipUnless(shutil.which("ffmpeg"), "FFmpeg is required")
    def test_real_boundary_frames_are_saved_and_reused_after_reload(self):
        from PIL import Image
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            manifest = workflows.create_workflow(root, make_payload())
            directory = workflows.workflow_directory(root, manifest["id"])
            video = directory / "shot.mp4"
            ffmpeg = shutil.which("ffmpeg")
            subprocess.run([
                ffmpeg, "-nostdin", "-y", "-loglevel", "error",
                "-f", "lavfi", "-i", "color=red:s=32x32:r=10:d=1",
                "-f", "lavfi", "-i", "color=blue:s=32x32:r=10:d=1",
                "-filter_complex", "[0:v][1:v]concat=n=2:v=1:a=0",
                "-c:v", "libx264", str(video),
            ], check=True, capture_output=True)
            shot = manifest["shots"][0]
            shot.update(video_path=str(video), status="completed")
            workflows.save_shot_frames(root, manifest, shot, video, ffmpeg)
            restored = workflows.get_workflow(root, manifest["id"])
            first = Path(restored["shots"][0]["generated_first_frame_path"])
            last = Path(restored["shots"][0]["last_frame_path"])
            with Image.open(first) as image:
                red, _, blue = image.getpixel((0, 0))
                self.assertGreater(red, blue)
            with Image.open(last) as image:
                red, _, blue = image.getpixel((0, 0))
                self.assertGreater(blue, red)
            with patch.object(workflows, "extract_first_frame") as first_mock, patch.object(
                workflows, "extract_last_frame"
            ) as last_mock:
                workflows.save_shot_frames(root, restored, restored["shots"][0], video, ffmpeg)
                first_mock.assert_not_called()
                last_mock.assert_not_called()
            public = server._public_workflow(restored)["shots"][0]
            self.assertNotIn("last_frame_path", public)
            self.assertTrue(public["last_frame_url"].endswith("/last-frame"))
            self.assertTrue(public["generated_first_frame_url"].endswith("/first-frame"))

    def test_first_frame_snapshot_survives_history_removal_and_update(self):
        from PIL import Image
        image_id = "9374eb0a-e015-4621-8856-88eef9209d44"
        payload = make_payload()
        payload["shots"][0]["first_frame_id"] = image_id
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            source = root / f"hidream-{image_id}.png"
            Image.new("RGB", (32, 32), "red").save(source)
            manifest = workflows.create_workflow(root, payload)
            snapshot = Path(manifest["shots"][0]["first_frame_path"])
            self.assertEqual(snapshot.read_bytes(), source.read_bytes())
            self.assertEqual(snapshot.stat().st_mode & 0o777, 0o600)
            public = server._public_workflow(manifest)
            self.assertNotIn("first_frame_path", public["shots"][0])
            self.assertTrue(public["shots"][0]["first_frame_url"].endswith("/image"))
            encoded = base64.b64encode(snapshot.read_bytes()).decode("ascii")
            settings = server._validate_generation(payload["shots"][0])
            settings["first_frame_image"] = encoded
            self.assertEqual(server._generation_request("h3", settings)["first_frame_image"], encoded)
            source.unlink()
            updated = workflows.update_workflow(root, manifest["id"], payload)
            self.assertEqual(updated["shots"][0]["first_frame_path"], str(snapshot))
            payload["shots"][0]["first_frame_id"] = ""
            cleared = workflows.update_workflow(root, manifest["id"], payload)
            self.assertIsNone(cleared["shots"][0]["first_frame_path"])
            self.assertEqual(server._public_workflow(cleared)["shots"][0]["first_frame_url"], "")

    def test_first_frame_rejects_invalid_missing_and_non_image_inputs(self):
        payload = make_payload()
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            for image_id in ("../../private", None, "9374eb0a-e015-4621-8856-88eef9209d44"):
                payload["shots"][0]["first_frame_id"] = image_id
                with self.subTest(image_id=image_id), self.assertRaises(ValueError):
                    workflows.create_workflow(root, payload)
            source = root / "hidream-9374eb0a-e015-4621-8856-88eef9209d44.png"
            source.write_bytes(b"not an image")
            with self.assertRaisesRegex(ValueError, "invalid_first_frame"):
                workflows.create_workflow(root, payload)

    def test_create_manifest_is_private_and_validates_shot_settings(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            manifest = workflows.create_workflow(root, make_payload())
            manifest_path = workflows.workflow_directory(root, manifest["id"]) / "workflow.json"

            self.assertEqual(manifest["status"], "draft")
            self.assertEqual(manifest["total_duration"], 5)
            self.assertEqual(manifest["shots"][0]["status"], "pending")
            self.assertEqual(manifest["shots"][0]["music_prompt"], "Soft piano and strings")
            self.assertEqual(manifest["shots"][0]["music_status"], "pending")
            self.assertEqual(manifest_path.stat().st_mode & 0o777, 0o600)
            self.assertEqual(manifest_path.parent.stat().st_mode & 0o777, 0o700)
            for invalid in (
                {**make_payload(), "shots": []},
                {**make_payload(), "aspect": "2:1"},
                {**make_payload(), "shots": [{**make_payload()["shots"][0], "duration": 3}]},
                {**make_payload(), "shots": [{**make_payload()["shots"][0], "turbo": True, "steps": 16}]},
            ):
                with self.subTest(invalid=invalid), self.assertRaises(ValueError):
                    workflows.create_workflow(root, invalid)

    def test_global_soundtrack_prompt_creates_resumable_duration_limited_segments(self):
        payload = make_payload("music3")
        payload["soundtrack"]["strategy"] = "global"
        payload["soundtrack"]["prompt"] = "One cohesive orchestral journey"
        payload["shots"] = [
            {**payload["shots"][0], "duration": 15, "prompt": f"Shot {index}"}
            for index in range(21)
        ]
        with tempfile.TemporaryDirectory() as temp_dir:
            manifest = workflows.create_workflow(Path(temp_dir), payload)

        self.assertEqual(manifest["soundtrack"]["strategy"], "global")
        self.assertEqual(manifest["soundtrack"]["prompt"], "One cohesive orchestral journey")
        self.assertEqual(len(manifest["soundtrack_segments"]), 2)
        self.assertTrue(all(5 <= segment["duration"] <= 300 for segment in manifest["soundtrack_segments"]))
        self.assertAlmostEqual(
            sum(segment["duration"] for segment in manifest["soundtrack_segments"]),
            manifest["total_duration"],
        )
        payload["shots"] = payload["shots"][:20]
        with tempfile.TemporaryDirectory() as temp_dir:
            boundary = workflows.create_workflow(Path(temp_dir), payload)
        self.assertEqual(len(boundary["soundtrack_segments"]), 1)
        self.assertEqual(boundary["soundtrack_segments"][0]["duration"], 300)
        invalid_payload = {
            **payload,
            "soundtrack": {**payload["soundtrack"], "prompt": "  "},
        }
        with tempfile.TemporaryDirectory() as temp_dir, self.assertRaisesRegex(
            ValueError, "invalid_music_prompt"
        ):
            workflows.create_workflow(Path(temp_dir), invalid_payload)

    def test_public_workflow_does_not_expose_global_music_paths_or_job_ids(self):
        manifest = {
            "id": "9374eb0a-e015-4621-8856-88eef9209d44",
            "soundtrack_segments": [{
                "status": "completed",
                "duration": 5,
                "audio_path": "/private/music.wav",
                "job_id": "internal-job-id",
            }],
            "shots": [],
        }

        public = server._public_workflow(manifest)

        self.assertNotIn("audio_path", public["soundtrack_segments"][0])
        self.assertNotIn("job_id", public["soundtrack_segments"][0])

    def test_global_soundtrack_can_reuse_music_history_item_with_lyrics(self):
        source_id = "1b4e28ba-2fa1-41d2-883f-0016d3cca427"
        source = {
            "path": "/private/music3-source.wav",
            "lyrics": "[verse]\nFirst line\n\nSecond line",
            "prompt": "Warm folk",
            "duration": 8,
        }
        payload = make_payload("music3")
        payload["soundtrack"].update({
            "strategy": "global", "prompt": "", "music_source_id": source_id,
        })
        resolver = lambda item_id: source if item_id == source_id else None
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            manifest = workflows.create_workflow(root, payload, music_source_resolver=resolver)
            soundtrack = manifest["soundtrack"]
            self.assertEqual(soundtrack["music_source_id"], source_id)
            self.assertEqual(soundtrack["music_source_path"], source["path"])
            self.assertTrue(soundtrack["burn_lyrics"])
            cues = workflows.workflow_lyric_cues({**manifest, "total_duration": 10})
            self.assertEqual([cue[0] for cue in cues], ["First line", "Second line"])
            self.assertEqual(cues[0][1], 0)
            self.assertEqual(cues[-1][2], 8)
            self.assertNotIn("music_source_path", server._public_workflow(manifest)["soundtrack"])
            no_burn = {**payload, "soundtrack": {**payload["soundtrack"], "burn_lyrics": False}}
            manifest = workflows.create_workflow(root, no_burn, music_source_resolver=resolver)
            self.assertEqual(workflows.workflow_lyric_cues(manifest), [])

            cases = [
                ({"music_source_id": "not-a-uuid"}, "invalid_music_source"),
                ({"music_source_id": "2b4e28ba-2fa1-41d2-883f-0016d3cca427"}, "music_source_not_found"),
                ({"strategy": "per_shot"}, "invalid_music_source"),
                ({"burn_lyrics": "yes"}, "invalid_burn_lyrics"),
            ]
            for changes, error in cases:
                invalid = {**payload, "soundtrack": {**payload["soundtrack"], **changes}}
                with self.subTest(error=error), self.assertRaisesRegex(ValueError, error):
                    workflows.create_workflow(root, invalid, music_source_resolver=resolver)

    def test_resolve_music_source_reads_history_metadata(self):
        item_id = "3b4e28ba-2fa1-41d2-883f-0016d3cca427"
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            (root / f"music3-{item_id}.wav").write_bytes(b"RIFF")
            metadata = {
                "id": item_id, "kind": "music", "prompt": "Ballad",
                "generation": {"duration": 30, "lyrics_mode": "lyrics", "lyrics": "Hello"},
            }
            (root / f"{item_id}.json").write_text(json.dumps(metadata), encoding="utf-8")
            with patch.object(server, "OUTPUT_ROOT", root):
                resolved = server._resolve_workflow_music_source(item_id)
                self.assertEqual(resolved["lyrics"], "Hello")
                self.assertEqual(resolved["duration"], 30)
                self.assertIsNone(server._resolve_workflow_music_source("bad"))
                metadata["kind"] = "image"
                (root / f"{item_id}.json").write_text(json.dumps(metadata), encoding="utf-8")
                self.assertIsNone(server._resolve_workflow_music_source(item_id))

    def test_lyric_lines_and_render_lyric_image(self):
        self.assertEqual(workflows.lyric_lines("[chorus]\n  La la  \n\n"), ["La la"])
        self.assertEqual(workflows.lyric_lines(None), [])
        with tempfile.TemporaryDirectory() as temp_dir:
            path = workflows.render_lyric_image(
                "月光洒在河面 a very long english lyric line " * 3, 640, 360, Path(temp_dir) / "l.png"
            )
            from PIL import Image
            with Image.open(path) as image:
                self.assertEqual(image.width, 640)
                self.assertEqual(image.mode, "RGBA")

    def test_update_keeps_existing_shot_identity_and_rejects_running_workflow(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            manifest = workflows.create_workflow(root, make_payload())
            shot_id = manifest["shots"][0]["id"]
            updated = workflows.update_workflow(root, manifest["id"], {
                **make_payload(),
                "shots": [{**make_payload()["shots"][0], "title": "Revised opening"}],
            })
            self.assertEqual(updated["shots"][0]["id"], shot_id)
            self.assertEqual(updated["shots"][0]["title"], "Revised opening")
            updated["status"] = "running"
            workflows.save_workflow(root, updated)
            with self.assertRaisesRegex(ValueError, "workflow_not_editable"):
                workflows.update_workflow(root, manifest["id"], make_payload())

    def test_stale_running_manifest_is_recovered_but_live_manifest_is_not(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            stale = workflows.create_workflow(root, make_payload())
            stale["status"] = "running"
            stale["shots"][0]["status"] = "running"
            stale["shots"][0]["music_status"] = "running"
            workflows.save_workflow(root, stale)
            recovered = workflows.get_workflow(root, stale["id"])
            self.assertEqual(recovered["status"], "interrupted")
            self.assertEqual(recovered["shots"][0]["status"], "interrupted")
            self.assertEqual(recovered["shots"][0]["music_status"], "interrupted")

            live = workflows.create_workflow(root, make_payload())
            live["status"] = "running"
            workflows.save_workflow(root, live)
            workflows.mark_workflow_live(live["id"], True)
            try:
                self.assertEqual(workflows.get_workflow(root, live["id"])["status"], "running")
            finally:
                workflows.mark_workflow_live(live["id"], False)

    @unittest.skipUnless(shutil.which("ffmpeg") and shutil.which("ffprobe"), "FFmpeg tools are required")
    def test_ffmpeg_assembles_normalized_shots_with_independent_mixed_scores(self):
        ffmpeg = shutil.which("ffmpeg")
        ffprobe = shutil.which("ffprobe")
        self.assertIsNotNone(ffmpeg)
        self.assertIsNotNone(ffprobe)
        payload = make_payload("music3")
        payload["shots"] = [
            {**payload["shots"][0], "title": "Opening", "music_prompt": "Soft piano"},
            {
                **payload["shots"][0], "title": "Arrival", "prompt": "A red kite above the sea",
                "music_prompt": "Bright orchestral strings",
            },
        ]
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir) / "outputs"
            manifest = workflows.create_workflow(root, payload)
            directory = workflows.workflow_directory(root, manifest["id"])
            shot_paths = []
            for index, color in enumerate(("red", "blue")):
                path = directory / f"source-{index}.mp4"
                command = [
                    ffmpeg, "-nostdin", "-y", "-loglevel", "error",
                    "-f", "lavfi", "-i", f"color=c={color}:s=160x90:r=24:d=5",
                ]
                if index == 0:
                    command.extend([
                        "-f", "lavfi", "-i", "sine=frequency=440:sample_rate=48000:duration=5",
                    ])
                command.extend(["-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p"])
                if index == 0:
                    command.extend(["-c:a", "aac", "-shortest"])
                command.append(str(path))
                subprocess.run(command, check=True, capture_output=True, text=True, timeout=60)
                shot_paths.append(path)
            for shot, path in zip(manifest["shots"], shot_paths):
                shot.update({"status": "completed", "video_path": str(path)})
            soundtrack_paths = []
            for index in range(2):
                soundtrack_path = directory / f"music-{index}.wav"
                with wave.open(str(soundtrack_path), "wb") as audio:
                    audio.setnchannels(2)
                    audio.setsampwidth(2)
                    audio.setframerate(48000)
                    audio.writeframes(b"\x00\x00" * 2 * 48000 * 5)
                soundtrack_paths.append(soundtrack_path)
            media_results = []
            for mix in ("mix", "score"):
                manifest["soundtrack"]["mix"] = mix
                result = workflows.assemble_workflow(
                    root, manifest, shot_paths, soundtrack_paths, ffmpeg, ffprobe
                )
                probe = subprocess.run(
                    [ffprobe, "-v", "error", "-show_entries",
                     "format=duration:stream=codec_type", "-of", "json", str(result)],
                    check=True, capture_output=True, text=True, timeout=30,
                )
                media_results.append(json.loads(probe.stdout))

            global_payload = {
                **payload,
                "soundtrack": {
                    **payload["soundtrack"], "strategy": "global",
                },
            }
            global_manifest = workflows.create_workflow(root, global_payload)
            global_track = workflows.workflow_directory(root, global_manifest["id"]) / "global.wav"
            with wave.open(str(global_track), "wb") as audio:
                audio.setnchannels(2)
                audio.setsampwidth(2)
                audio.setframerate(48000)
                audio.writeframes(b"\x00\x00" * 2 * 48000 * 10)
            global_results = []
            for mix in ("score", "mix"):
                global_manifest["soundtrack"]["mix"] = mix
                result = workflows.assemble_workflow(
                    root, global_manifest, shot_paths, [global_track], ffmpeg, ffprobe
                )
                probe = subprocess.run(
                    [ffprobe, "-v", "error", "-show_entries",
                     "format=duration:stream=codec_type", "-of", "json", str(result)],
                    check=True, capture_output=True, text=True, timeout=30,
                )
                global_results.append(json.loads(probe.stdout))

            source_payload = {
                **global_payload,
                "soundtrack": {
                    **global_payload["soundtrack"],
                    "music_source_id": "4b4e28ba-2fa1-41d2-883f-0016d3cca427",
                },
            }
            source_manifest = workflows.create_workflow(
                root, source_payload,
                music_source_resolver=lambda _item: {
                    "path": str(global_track), "lyrics": "Line one\nLine two",
                    "prompt": "", "duration": 4,
                },
            )
            result = workflows.assemble_workflow(
                root, source_manifest, shot_paths, [global_track], ffmpeg, ffprobe
            )
            probe = subprocess.run(
                [ffprobe, "-v", "error", "-show_entries",
                 "format=duration:stream=codec_type", "-of", "json", str(result)],
                check=True, capture_output=True, text=True, timeout=30,
            )
            global_results.append(json.loads(probe.stdout))
            self.assertFalse(list(result.parent.glob(".lyric-*.png")))

        for media in media_results:
            self.assertTrue(any(item["codec_type"] == "video" for item in media["streams"]))
            self.assertTrue(any(item["codec_type"] == "audio" for item in media["streams"]))
            self.assertAlmostEqual(float(media["format"]["duration"]), 10, delta=1)
        for media in global_results:
            self.assertTrue(any(item["codec_type"] == "video" for item in media["streams"]))
            self.assertTrue(any(item["codec_type"] == "audio" for item in media["streams"]))
            self.assertAlmostEqual(float(media["format"]["duration"]), 10, delta=1)


class WorkflowRunnerTests(unittest.TestCase):
    def test_runner_generates_shots_serially_and_records_final_output(self):
        from PIL import Image
        with tempfile.TemporaryDirectory() as temp_dir:
            output_root = Path(temp_dir) / "outputs"
            output_root.mkdir()
            image_id = "9374eb0a-e015-4621-8856-88eef9209d44"
            source = output_root / f"hidream-{image_id}.png"
            Image.new("RGB", (32, 32), "green").save(source)
            image_bytes = source.read_bytes()
            payload = make_payload()
            payload["shots"][0]["first_frame_id"] = image_id
            manifest = workflows.create_workflow(output_root, payload)
            source.unlink()
            generated_requests = []

            def fake_generate(job_id, settings, model_path, output_path):
                generated_requests.append(server._generation_request("h3", settings))
                output_path.parent.mkdir(parents=True, exist_ok=True)
                output_path.write_bytes(b"video")
                with server._lock:
                    job = server._jobs[job_id]
                    job.update({"status": "completed", "video_path": output_path})
                    server._active_job_id = None

            def fake_assemble(root, current, shot_paths, soundtrack_paths, ffmpeg, ffprobe):
                output = workflows.workflow_directory(root, current["id"]) / "final.mp4"
                output.write_bytes(b"final video")
                return output

            old_active_job = server._active_job_id
            old_active_workflow = server._active_workflow_id
            server._active_job_id = None
            server._active_workflow_id = manifest["id"]
            try:
                with patch.object(server, "OUTPUT_ROOT", output_root), patch.object(
                    server, "_find_models", return_value=[Path(temp_dir) / "model"]
                ), patch.object(server, "_settings_snapshot", return_value={
                    "video": {"api_params": {}},
                }), patch.object(server, "_run_job", side_effect=fake_generate), patch.object(
                    server.shutil, "which", return_value="/usr/bin/ffmpeg"
                ), patch.object(workflows, "assemble_workflow", side_effect=fake_assemble), patch.object(
                    workflows, "extract_first_frame", side_effect=fake_boundary_frame
                ), patch.object(workflows, "extract_last_frame", side_effect=fake_boundary_frame):
                    server._run_workflow(manifest["id"])
                    completed = workflows.get_workflow(output_root, manifest["id"])
            finally:
                with server._lock:
                    for job_id in [
                        key for key, job in server._jobs.items()
                        if job.get("workflow_id") == manifest["id"]
                    ]:
                        server._jobs.pop(job_id, None)
                    server._active_job_id = old_active_job
                    server._active_workflow_id = old_active_workflow
                workflows.mark_workflow_live(manifest["id"], False)

            self.assertEqual(completed["status"], "completed", completed["error"])
            self.assertEqual(completed["shots"][0]["status"], "completed")
            self.assertTrue(Path(completed["output_path"]).is_file())
            self.assertEqual(
                base64.b64decode(generated_requests[0]["first_frame_image"]), image_bytes
            )

    def test_runner_generates_individual_music_with_each_shot_prompt(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            output_root = Path(temp_dir) / "outputs"
            payload = make_payload("music3")
            payload["shots"] = [
                {**payload["shots"][0], "music_prompt": "Soft piano"},
                {
                    **payload["shots"][0], "title": "Arrival",
                    "prompt": "A red kite above the sea",
                    "duration": 8,
                    "music_prompt": "Bright orchestral strings",
                },
            ]
            manifest = workflows.create_workflow(output_root, payload)
            generated_music_prompts = []
            generated_music_durations = []
            video_conditions = []
            assembled_music_paths = []
            assembled_music_files_exist = False

            def fake_video(job_id, settings, model_path, output_path):
                video_conditions.append(settings.get("first_frame_image"))
                output_path.parent.mkdir(parents=True, exist_ok=True)
                output_path.write_bytes(b"video")
                with server._lock:
                    server._jobs[job_id].update({"status": "completed", "video_path": output_path})
                    server._active_job_id = None

            def fake_music(job_id, settings, output_path):
                generated_music_prompts.append(settings["prompt"])
                generated_music_durations.append(settings["duration"])
                output_path.parent.mkdir(parents=True, exist_ok=True)
                with wave.open(str(output_path), "wb") as audio:
                    audio.setnchannels(2)
                    audio.setsampwidth(2)
                    audio.setframerate(48000)
                    audio.writeframes(b"\x00\x00" * 2 * 48000 * int(settings["duration"]))
                with server._lock:
                    server._jobs[job_id].update({"status": "completed", "audio_path": output_path})
                    server._active_job_id = None

            def fake_last_frame(root, workflow_id, video, ffmpeg):
                frame = workflows.workflow_directory(root, workflow_id) / "first-frame-test.png"
                frame.parent.mkdir(parents=True, exist_ok=True)
                frame.write_bytes(b"png")
                return frame

            def fake_assemble(root, current, shot_paths, soundtrack_paths, ffmpeg, ffprobe):
                nonlocal assembled_music_files_exist
                assembled_music_paths.extend(soundtrack_paths)
                assembled_music_files_exist = all(path.is_file() for path in soundtrack_paths)
                output = workflows.workflow_directory(root, current["id"]) / "final.mp4"
                output.write_bytes(b"final video")
                return output

            old_active_job = server._active_job_id
            old_active_workflow = server._active_workflow_id
            server._active_job_id = None
            server._active_workflow_id = manifest["id"]
            try:
                with patch.object(server, "OUTPUT_ROOT", output_root), patch.object(
                    server, "_find_models", return_value=[Path(temp_dir) / "model"]
                ), patch.object(server, "_music_status", return_value={
                    "model_ready": True, "runtime_ready": True,
                }), patch.object(server, "_settings_snapshot", return_value={
                    "video": {"api_params": {}}, "music": {"model_path": str(Path(temp_dir) / "music")},
                }), patch.object(server, "_run_job", side_effect=fake_video), patch.object(
                    server, "_run_music_job", side_effect=fake_music
                ), patch.object(server.shutil, "which", return_value="/usr/bin/ffmpeg"), patch.object(
                    workflows, "assemble_workflow", side_effect=fake_assemble
                ), patch.object(workflows, "extract_first_frame", side_effect=fake_boundary_frame), patch.object(
                    workflows, "extract_last_frame", side_effect=fake_boundary_frame
                ) as last_frame_mock:
                    server._run_workflow(manifest["id"])
                    completed = workflows.get_workflow(output_root, manifest["id"])
            finally:
                with server._lock:
                    for job_id in [
                        key for key, job in server._jobs.items()
                        if job.get("workflow_id") == manifest["id"]
                    ]:
                        server._jobs.pop(job_id, None)
                    server._active_job_id = old_active_job
                    server._active_workflow_id = old_active_workflow
                workflows.mark_workflow_live(manifest["id"], False)

        self.assertEqual(completed["status"], "completed", completed["error"])
        self.assertEqual(last_frame_mock.call_count, 2)
        self.assertEqual(completed["shots"][1]["first_frame_path"], completed["shots"][0]["last_frame_path"])
        self.assertIsNone(video_conditions[0])
        self.assertIsNotNone(video_conditions[1])
        self.assertTrue(all(shot["generated_first_frame_path"] and shot["last_frame_path"]
                            for shot in completed["shots"]))
        self.assertEqual(generated_music_prompts, ["Soft piano", "Bright orchestral strings"])
        self.assertEqual(generated_music_durations, [5, 8])
        self.assertEqual(len(assembled_music_paths), 2)
        self.assertTrue(assembled_music_files_exist)
        self.assertEqual([shot["music_status"] for shot in completed["shots"]], ["completed", "completed"])

    def test_runner_generates_one_overall_music_prompt_across_video(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            output_root = Path(temp_dir) / "outputs"
            payload = make_payload("music3")
            payload["soundtrack"]["strategy"] = "global"
            payload["soundtrack"]["prompt"] = "One continuous cinematic score"
            manifest = workflows.create_workflow(output_root, payload)
            generated_settings = []

            def fake_video(job_id, settings, model_path, output_path):
                output_path.parent.mkdir(parents=True, exist_ok=True)
                output_path.write_bytes(b"video")
                with server._lock:
                    server._jobs[job_id].update({
                        "status": "completed", "video_path": output_path,
                    })
                    server._active_job_id = None

            def fake_music(job_id, settings, output_path):
                generated_settings.append(settings)
                output_path.parent.mkdir(parents=True, exist_ok=True)
                output_path.write_bytes(b"audio")
                with server._lock:
                    server._jobs[job_id].update({
                        "status": "completed", "audio_path": output_path,
                    })
                    server._active_job_id = None

            def fake_assemble(root, current, shot_paths, soundtrack_paths, ffmpeg, ffprobe):
                self.assertEqual(len(soundtrack_paths), 1)
                self.assertEqual(soundtrack_paths[0].read_bytes(), b"audio")
                output = workflows.workflow_directory(root, current["id"]) / "final.mp4"
                output.write_bytes(b"final video")
                return output

            old_active_job = server._active_job_id
            old_active_workflow = server._active_workflow_id
            server._active_job_id = None
            server._active_workflow_id = manifest["id"]
            try:
                with patch.object(server, "OUTPUT_ROOT", output_root), patch.object(
                    server, "_find_models", return_value=[Path(temp_dir) / "model"]
                ), patch.object(server, "_music_status", return_value={
                    "model_ready": True, "runtime_ready": True,
                }), patch.object(server, "_settings_snapshot", return_value={
                    "video": {"api_params": {}}, "music": {"model_path": str(Path(temp_dir) / "music")},
                }), patch.object(server, "_run_job", side_effect=fake_video), patch.object(
                    server, "_run_music_job", side_effect=fake_music
                ), patch.object(server.shutil, "which", return_value="/usr/bin/ffmpeg"), patch.object(
                    workflows, "assemble_workflow", side_effect=fake_assemble
                ), patch.object(workflows, "extract_first_frame", side_effect=fake_boundary_frame), patch.object(
                    workflows, "extract_last_frame", side_effect=fake_boundary_frame
                ):
                    server._run_workflow(manifest["id"])
                    completed = workflows.get_workflow(output_root, manifest["id"])
            finally:
                with server._lock:
                    for job_id in [
                        key for key, job in server._jobs.items()
                        if job.get("workflow_id") == manifest["id"]
                    ]:
                        server._jobs.pop(job_id, None)
                    server._active_job_id = old_active_job
                    server._active_workflow_id = old_active_workflow
                workflows.mark_workflow_live(manifest["id"], False)

        self.assertEqual(completed["status"], "completed", completed["error"])
        self.assertEqual(len(generated_settings), 1)
        self.assertEqual(generated_settings[0]["prompt"], "One continuous cinematic score")
        self.assertEqual(generated_settings[0]["duration"], 5.0)
        self.assertEqual(completed["soundtrack_segments"][0]["status"], "completed")
