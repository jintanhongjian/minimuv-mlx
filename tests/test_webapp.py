from __future__ import annotations

import json
import base64
import io
import shutil
import subprocess
import sys
import tempfile
import threading
import unittest
from collections import deque
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from unittest.mock import MagicMock, Mock, patch

from webapp import server, workflows


class ModelDiscoveryTests(unittest.TestCase):
    def make_model(self, root: Path, name: str = "MiniMax-H3-FL2VA-MLX-Serve-4bit") -> Path:
        model = root / name
        model.mkdir(parents=True)
        for filename in server._expected_model_files(model):
            (model / filename).touch()
        return model

    def test_finds_complete_self_contained_model_pack(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            model = self.make_model(root / "pipenetwork")

            found = server._find_models(root)

            self.assertEqual(found, [model.resolve()])
            self.assertTrue(server._valid_h3_model(model))

    def test_does_not_treat_transformer_only_directory_as_full_model(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            transformer = root / "pipenetwork" / "MiniMax-H3-MLX-8bit"
            transformer.mkdir(parents=True)
            (transformer / "quant_config.json").touch()
            (transformer / "model.safetensors").touch()

            self.assertEqual(server._find_models(root), [])

    def test_ignores_incomplete_model_pack(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            model = Path(temp_dir) / "partial"
            model.mkdir()
            (model / "config.json").touch()

            self.assertEqual(server._find_models(Path(temp_dir)), [])

    def test_reports_recent_huggingface_download_progress(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            model = Path(temp_dir) / "model"
            partials = model / ".cache" / "huggingface" / "download"
            partials.mkdir(parents=True)
            (model / "config.json").write_bytes(b"{}")
            (partials / "weights.incomplete").write_bytes(b"123456")

            progress = server._model_download_progress(model)

            self.assertTrue(progress["download_in_progress"])
            self.assertEqual(progress["downloaded_bytes"], 8)
            self.assertEqual(progress["total_bytes"], server.MODEL_SIZE_BYTES)


class GenerationHistoryTests(unittest.TestCase):
    def test_persists_and_restores_generation_controls_without_private_runtime_settings(self):
        cases = [
            ("video", "h3", ".mp4", {
                "prompt": "Portrait film", "duration": 10, "aspect": "9:16",
                "steps": 24, "turbo": False, "seed": 123, "first_frame_id": "",
            }),
            ("image", "hidream", ".png", {"prompt": "Forest painting", "seed": 777}),
            ("music", "music3", ".wav", {
                "prompt": "Piano song", "duration": 45, "steps": 25, "seed": 333,
                "lyrics_mode": "lyrics", "lyrics": "[verse]\nA song of home", "model": "music3",
            }),
        ]
        with tempfile.TemporaryDirectory() as temp_dir, patch.object(
            server, "OUTPUT_ROOT", Path(temp_dir)
        ):
            for kind, prefix, suffix, settings in cases:
                with self.subTest(kind=kind):
                    item_id = str(server.uuid.uuid4())
                    path = Path(temp_dir) / f"{prefix}-{item_id}{suffix}"
                    path.write_bytes(b"media")
                    job = {"id": item_id, "kind": kind, "created_at": 123, "prompt": settings["prompt"]}
                    server._persist_history(job, [path], {
                        **settings, "model_path": "/private/model",
                        "api_params": {"private_setting": True},
                        "service_url": "http://127.0.0.1:11234",
                    })
                    record = json.loads((Path(temp_dir) / kind / f"{item_id}.json").read_text())
                    expected = {key: value for key, value in settings.items() if key != "prompt"}
                    if kind == "video":
                        expected["quality"] = "standard"
                    elif kind == "image":
                        expected.update(quality="custom", candidate_count=1)
                    self.assertEqual(record["generation"], expected)
                    restored = next(item for item in server._history_items() if item["id"] == item_id)
                    self.assertEqual(restored["generation"], expected)
                    self.assertEqual(restored["prompt"], settings["prompt"])
                    self.assertNotIn("/private/model", json.dumps(restored))

    def test_history_preserves_first_frame_after_source_deletion(self):
        from PIL import Image
        with tempfile.TemporaryDirectory() as temp_dir, patch.object(
            server, "OUTPUT_ROOT", Path(temp_dir)
        ):
            item_id = str(server.uuid.uuid4())
            image_id = str(server.uuid.uuid4())
            source = Path(temp_dir) / f"hidream-{image_id}.png"
            Image.new("RGB", (32, 24), "green").save(source)
            content = source.read_bytes()
            media = Path(temp_dir) / f"h3-{item_id}.mp4"
            media.write_bytes(b"video")
            settings = {"prompt": "Green film", "first_frame_id": image_id,
                        "first_frame_image": base64.b64encode(content).decode("ascii")}
            server._persist_history(
                {"id": item_id, "kind": "video", "created_at": 123, "prompt": settings["prompt"]},
                [media], settings,
            )
            source.unlink()
            item = server._history_items()[0]
            self.assertEqual(item["generation"]["first_frame_id"], item_id)
            self.assertEqual(item["first_frame_url"], f"/api/history/{item_id}/first-frame")
            self.assertEqual(server.workflows.read_first_frame(Path(temp_dir), item_id), content)
            path, content_type = server._history_media_path(item_id, "first-frame")
            self.assertEqual(path.read_bytes(), content)
            self.assertEqual(content_type, "image/png")
            self.assertEqual(path.stat().st_mode & 0o777, 0o600)
            self.assertNotIn("first_frame_image", json.dumps(item))
            workflow = server.workflows.create_workflow(Path(temp_dir), {
                "shots": [{"prompt": "New shot", "first_frame_id": item_id}],
                "soundtrack": {"mode": "none"},
            })
            self.assertEqual(Path(workflow["shots"][0]["first_frame_path"]).read_bytes(), content)

    def test_history_records_elapsed_time_and_tokens(self):
        with tempfile.TemporaryDirectory() as temp_dir, patch.object(
            server, "OUTPUT_ROOT", Path(temp_dir)
        ):
            item_id = str(server.uuid.uuid4())
            media = Path(temp_dir) / f"music3-{item_id}.wav"
            media.write_bytes(b"audio")
            job = {"id": item_id, "kind": "music", "created_at": 100.0, "started_at": 110.0,
                   "prompt": "Song", "logs": [], "tokens": 1234}
            with patch.object(server.time, "time", return_value=135.25):
                server._persist_history(job, [media])
            self.assertEqual(job["logs"][-1], "Elapsed 25.2s · tokens 1234")
            item = server._history_items()[0]
            self.assertEqual(item["elapsed_seconds"], 25.2)
            self.assertEqual(item["tokens"], 1234)

            legacy_id = str(server.uuid.uuid4())
            (Path(temp_dir) / f"h3-{legacy_id}.mp4").write_bytes(b"video")
            (Path(temp_dir) / f"{legacy_id}.json").write_text(json.dumps(
                {"id": legacy_id, "kind": "video", "created_at": 1, "prompt": "Old"}
            ))
            legacy = next(item for item in server._history_items() if item["id"] == legacy_id)
            self.assertIsNone(legacy["elapsed_seconds"])
            self.assertIsNone(legacy["tokens"])

    def test_public_job_reports_running_elapsed_time(self):
        job = {"id": "x", "kind": "image", "status": "running", "created_at": 10.0,
               "started_at": 12.0, "prompt": "p", "logs": []}
        with patch.object(server.time, "time", return_value=20.0):
            public = server._public_job(job)
        self.assertEqual(public["elapsed_seconds"], 8.0)
        self.assertIsNone(public["tokens"])
        self.assertNotIn("finished_at", job)

    def test_history_rejects_corrupt_generation_settings(self):
        with tempfile.TemporaryDirectory() as temp_dir, patch.object(
            server, "OUTPUT_ROOT", Path(temp_dir)
        ):
            item_id = str(server.uuid.uuid4())
            path = Path(temp_dir) / f"h3-{item_id}.mp4"
            path.write_bytes(b"video")
            record = {"id": item_id, "kind": "video", "created_at": 1, "prompt": "Film",
                      "generation": {"duration": 5}}
            metadata = Path(temp_dir) / f"{item_id}.json"
            metadata.write_text(json.dumps(record))
            with self.assertRaisesRegex(RuntimeError, "Invalid generation settings"):
                server._history_items()
            record["generation"] = {"duration": 5, "aspect": "16:9", "steps": 100,
                                    "seed": 0, "turbo": True, "first_frame_id": ""}
            metadata.write_text(json.dumps(record))
            with self.assertRaisesRegex(RuntimeError, "Invalid generation settings"):
                server._history_items()

    def test_persists_private_history_and_discovers_generated_media(self):
        with tempfile.TemporaryDirectory() as temp_dir, patch.object(
            server, "OUTPUT_ROOT", Path(temp_dir)
        ):
            item_id = "9374eb0a-e015-4621-8856-88eef9209d44"
            image_path = Path(temp_dir) / f"hidream-{item_id}.png"
            image_path.write_bytes(b"\x89PNG\r\n\x1a\nimage")
            server._persist_history({
                "id": item_id,
                "kind": "image",
                "created_at": 1234.5,
                "prompt": "A quiet forest at dawn",
            }, [image_path])

            items = server._history_items()

            self.assertEqual(len(items), 1)
            self.assertEqual(items[0]["kind"], "image")
            self.assertEqual(items[0]["prompt"], "A quiet forest at dawn")
            self.assertEqual(items[0]["image_url"], f"/api/history/{item_id}/image")
            self.assertIsNone(items[0]["generation"])
            self.assertEqual((Path(temp_dir) / "image" / f"{item_id}.json").stat().st_mode & 0o777, 0o600)

    def test_lists_existing_media_without_metadata(self):
        with tempfile.TemporaryDirectory() as temp_dir, patch.object(
            server, "OUTPUT_ROOT", Path(temp_dir)
        ):
            item_id = "9374eb0a-e015-4621-8856-88eef9209d44"
            (Path(temp_dir) / f"music3-{item_id}.wav").write_bytes(b"RIFF")

            items = server._history_items()

            self.assertEqual(len(items), 1)
            self.assertEqual(items[0]["kind"], "music")
            self.assertEqual(items[0]["audio_url"], f"/api/history/{item_id}/audio")
            self.assertEqual(items[0]["prompt"], "")
            self.assertIsNone(items[0]["generation"])


class GenerationSettingsTests(unittest.TestCase):
    def test_normalizes_generation_settings_for_mlx_serve(self):
        settings = server._validate_generation({
            "prompt": "  A red fox in the snow  ",
            "duration": 5,
            "steps": 4,
            "aspect": "16:9",
            "seed": 12,
            "turbo": True,
        })

        self.assertEqual(settings["prompt"], "A red fox in the snow")
        self.assertEqual((settings["width"], settings["height"]), (1344, 768))
        self.assertEqual(settings["num_frames"], 124)
        self.assertEqual(settings["steps"], 4)
        self.assertTrue(settings["turbo"])
        request = server._generation_request("ddalcu/MiniMax-H3", settings)
        self.assertEqual(request["model"], "ddalcu/MiniMax-H3")
        self.assertEqual(request["num_frames"], 124)
        self.assertTrue(request["stream"])

    def test_uses_square_resolution_and_frame_alignment(self):
        settings = server._validate_generation({
            "prompt": "A paper boat", "duration": 8, "steps": 6, "aspect": "1:1",
        })

        self.assertEqual((settings["width"], settings["height"]), (768, 768))
        self.assertEqual(settings["num_frames"] % 17, 5)
        self.assertTrue(settings["turbo"])

    def test_accepts_standard_non_turbo_generation(self):
        settings = server._validate_generation({
            "prompt": "A paper boat", "steps": 16, "turbo": False,
        })
        self.assertFalse(settings["turbo"])
        self.assertEqual(settings["steps"], 16)

    def test_rejects_invalid_prompt_and_generation_bounds(self):
        invalid_payloads = [
            {"prompt": "  "},
            {"prompt": "A film", "duration": 4},
            {"prompt": "A film", "steps": 1},
            {"prompt": "A film", "seed": -1},
            {"prompt": "A film", "aspect": "2:1"},
            {"prompt": "A film", "steps": 4, "turbo": False},
            {"prompt": "A film", "steps": 16, "turbo": True},
            {"prompt": "A film", "first_frame_id": "../image.png"},
            {"prompt": "A film", "first_frame_id": None},
            {"prompt": "A film", "first_frame_id": "9374EB0A-E015-4621-8856-88EEF9209D44"},
        ]
        for payload in invalid_payloads:
            with self.subTest(payload=payload), self.assertRaises(ValueError):
                server._validate_generation(payload)

    def test_selects_only_h3_video_models(self):
        models = [
            {"id": "org/other-video-model", "capabilities": ["video"], "state": "ready"},
            {"id": "ddalcu/MiniMax-H3-FL2VA-MLX-Serve-4bit", "state": "ready"},
        ]

        self.assertEqual(server._find_h3_model_id(models), models[1]["id"])

    @unittest.skipUnless(shutil.which("ffmpeg"), "ffmpeg is required for media muxing")
    def test_muxes_decoded_rgb_frames_and_pcm_audio(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            output = Path(temp_dir) / "clip.mp4"
            pcm = b"\x00\x00" * 4_000 * 2
            event = {
                "format": "rgb8",
                "width": 2,
                "height": 2,
                "frames": 2,
                "fps": 24,
                "data": base64.b64encode(bytes(2 * 2 * 2 * 3)).decode("ascii"),
                "audio_format": "pcm_s16le",
                "audio_sample_rate": 48_000,
                "audio_channels": 2,
                "audio_data": base64.b64encode(pcm).decode("ascii"),
            }

            video_path, audio_path = server._decode_model_media("test", event, output)

            self.assertTrue(video_path.is_file())
            self.assertGreater(video_path.stat().st_size, 0)
            self.assertIsNotNone(audio_path)
            self.assertTrue(audio_path.is_file())


    def test_validates_music_generation_and_instrumental_condition(self):
        lyrics_settings = server._validate_music_generation({
            "prompt": " Warm acoustic pop ",
            "lyrics_mode": "lyrics",
            "lyrics": " [verse] Hello ",
            "duration": 30,
            "steps": 20,
            "seed": 7,
        })
        self.assertEqual(lyrics_settings["prompt"], "Warm acoustic pop")
        self.assertEqual(lyrics_settings["lyrics"], "[verse] Hello")
        self.assertEqual(lyrics_settings["lyrics_mode"], "lyrics")

        instrumental_settings = server._validate_music_generation({
            "prompt": "Gentle piano",
            "lyrics_mode": "instrumental",
            "lyrics": "",
        })
        self.assertEqual(instrumental_settings["lyrics"], "[instrumental]")

        for payload, error in (
            ({"prompt": " "}, "invalid_prompt"),
            ({"prompt": "A song", "lyrics": " "}, "invalid_lyrics"),
            ({"prompt": "A song", "lyrics_mode": "unknown", "lyrics": "words"}, "invalid_music_mode"),
            ({"prompt": "A song", "lyrics_mode": "instrumental", "duration": 301}, "invalid_duration"),
            ({"prompt": "A song", "lyrics_mode": "instrumental", "steps": 31}, "invalid_steps"),
            ({"prompt": "A song", "lyrics_mode": "instrumental", "seed": -1}, "invalid_seed"),
        ):
            with self.subTest(payload=payload), self.assertRaisesRegex(ValueError, error):
                server._validate_music_generation(payload)

    def test_music3_five_minute_duration_boundaries(self):
        for mode in ("lyrics", "instrumental"):
            for duration in (1, 5, 37, 119, 120, 121, 180, 240, 299, 300):
                with self.subTest(mode=mode, duration=duration):
                    settings = server._validate_music_generation({
                        "model": "music3", "prompt": "A song", "lyrics_mode": mode,
                        "lyrics": "[verse] Hello", "duration": duration,
                    })
                    self.assertEqual(settings["duration"], duration)
            for duration in (True, 0.99, 300.01, float("nan"), float("inf")):
                with self.subTest(mode=mode, duration=duration):
                    with self.assertRaisesRegex(ValueError, "invalid_duration"):
                        server._validate_music_generation({
                            "model": "music3", "prompt": "A song", "lyrics_mode": mode,
                            "lyrics": "[verse] Hello", "duration": duration,
                        })
        with self.assertRaisesRegex(ValueError, "invalid_duration"):
            server._validate_music_generation({
                "model": "yue2-3b-8bit", "prompt": "A song",
                "lyrics_mode": "instrumental", "duration": 121,
            })

    def test_runs_music_inference_and_publishes_valid_wav(self):
        class FakeProcess:
            def __init__(self):
                self.stdout = io.StringIO("loaded Music3\nSaved: music.wav\nTOKENS: 42\n")

            def poll(self):
                return 0

            def wait(self, timeout=None):
                return 0

            def terminate(self):
                pass

            def kill(self):
                pass

        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            output_root = root / "outputs"
            output = output_root / "music.wav"
            job_id = "9374eb0a-e015-4621-8856-88eef9209d44"
            job = {
                "id": job_id, "kind": "music", "status": "queued",
                "created_at": 1.0, "prompt": "Gentle piano",
                "logs": deque(maxlen=100), "error": "", "audio_path": None,
                "process": None, "cancel_requested": False,
            }
            observed_lyrics_path = None

            def start_process(command, **kwargs):
                nonlocal observed_lyrics_path
                self.assertEqual(command[:4], [
                    str(root / "python"), "-u", str(server.MUSIC_GENERATE_SCRIPT), "--model",
                ])
                self.assertEqual(command[4], str(root / "model"))
                lyrics_path = Path(command[command.index("--lyrics-file") + 1])
                observed_lyrics_path = lyrics_path
                self.assertEqual(lyrics_path.read_text(encoding="utf-8"), "[verse] Hello")
                self.assertEqual(command[command.index("--caption") + 1], "Gentle piano")
                self.assertEqual(command[command.index("--duration") + 1], "300")
                output_path = Path(command[command.index("--output") + 1])
                output_path.write_bytes(b"RIFF" + bytes(4) + b"WAVE" + bytes(36))
                return FakeProcess()

            previous_active_job = server._active_job_id
            with patch.object(server, "_music_status", return_value={
                "model_ready": True, "runtime_ready": True,
            }), patch.object(server, "MUSIC_PYTHON", root / "python"), patch.object(
                server, "MUSIC_MODEL_PATH", root / "model"
            ), patch.object(server, "OUTPUT_ROOT", output_root), patch.object(
                server.subprocess, "Popen", side_effect=start_process
            ):
                with server._lock:
                    server._jobs[job_id] = job
                    server._active_job_id = job_id
                try:
                    server._run_music_job(job_id, {
                        "prompt": "Gentle piano", "lyrics": "[verse] Hello",
                        "duration": 300, "steps": 20, "seed": 7,
                        "model_path": str(root / "model"),
                    }, output)
                finally:
                    with server._lock:
                        server._jobs.pop(job_id, None)
                        server._active_job_id = previous_active_job

            self.assertEqual(job["status"], "completed")
            self.assertEqual(job["audio_path"], output)
            self.assertTrue(output.is_file())
            self.assertIsNotNone(observed_lyrics_path)
            self.assertFalse(observed_lyrics_path.exists())
            public = server._public_job(job)
            self.assertEqual(public["audio_url"], f"/api/jobs/{job_id}/audio")
            self.assertEqual(public["tokens"], 42)
            self.assertIsInstance(public["elapsed_seconds"], float)
            self.assertGreaterEqual(public["elapsed_seconds"], 0)


class AppSettingsTests(unittest.TestCase):
    def test_validates_and_persists_all_model_configuration(self):
        settings = json.loads(json.dumps(server._DEFAULT_SETTINGS))
        settings["video"]["model_path"] = "~/models/h3"
        settings["video"]["service_url"] = "http://localhost:11234"
        settings["video"]["api_params"] = {"guidance_scale": 1.5}
        settings["image"]["model_path"] = "~/models/image"
        settings["music"]["model_path"] = "~/models/music"
        settings["text"]["model_ids"] = ["GLM-local", "Qwen-local"]
        settings["text"]["api_params"] = {"temperature": 0.3, "top_p": 0.9, "max_tokens": 700}
        with tempfile.TemporaryDirectory() as temp_dir, patch.object(
            server, "SETTINGS_PATH", Path(temp_dir) / "settings.json"
        ):
            saved = server._save_app_settings(settings)
            self.assertEqual(server._settings_snapshot(), saved)
            self.assertEqual(json.loads(server.SETTINGS_PATH.read_text()), saved)
            self.assertEqual(server.SETTINGS_PATH.stat().st_mode & 0o777, 0o600)

    def test_rejects_remote_services_reserved_video_fields_and_invalid_text_parameters(self):
        invalid_settings = []
        settings = json.loads(json.dumps(server._DEFAULT_SETTINGS))
        settings["text"]["service_url"] = "https://example.com"
        invalid_settings.append(settings)
        settings = json.loads(json.dumps(server._DEFAULT_SETTINGS))
        settings["video"]["api_params"] = {"prompt": "override"}
        invalid_settings.append(settings)
        settings = json.loads(json.dumps(server._DEFAULT_SETTINGS))
        settings["text"]["api_params"] = {"api_key": "not-allowed"}
        invalid_settings.append(settings)
        settings = json.loads(json.dumps(server._DEFAULT_SETTINGS))
        settings["video"]["api_params"] = {"headers": {"Authorization": "Bearer token"}}
        invalid_settings.append(settings)
        for payload in invalid_settings:
            with self.subTest(payload=payload), self.assertRaises(ValueError):
                server._validate_app_settings(payload)

    def test_configured_text_models_replace_service_inventory_and_strip_separators(self):
        class FakeResponse:
            def __enter__(self):
                return self

            def __exit__(self, *args):
                return False

            def read(self):
                return json.dumps({"data": [{"id": "live-model"}, {"id": "configured-model"}]}).encode()

        settings = json.loads(json.dumps(server._DEFAULT_SETTINGS))
        settings["text"]["model_ids"] = [" configured-model; ", "second-model；", "configured-model"]
        with patch.object(server, "_settings_snapshot", return_value=settings), patch.object(
            server, "urlopen", return_value=FakeResponse()
        ):
            models = server._local_text_models()
        self.assertEqual([model["id"] for model in models], ["configured-model", "second-model"])

    def test_empty_text_model_list_discovers_service_models_without_duplicates(self):
        response = MagicMock()
        response.__enter__.return_value.read.return_value = json.dumps({
            "data": [{"id": "Z-text"}, {"id": "A-text"}, {"id": "Z-text"}, {"id": "hidream"}]
        }).encode()
        settings = json.loads(json.dumps(server._DEFAULT_SETTINGS))
        settings["text"]["model_ids"] = []
        with patch.object(server, "_settings_snapshot", return_value=settings), patch.object(
            server, "urlopen", return_value=response
        ):
            self.assertEqual([model["id"] for model in server._local_text_models()], ["A-text", "Z-text"])

    def test_text_model_settings_normalize_separators_and_reject_excess_ids(self):
        settings = json.loads(json.dumps(server._DEFAULT_SETTINGS))
        settings["text"]["model_ids"] = [" GLM-local;\nQwen-local；", "GLM-local", "；"]
        self.assertEqual(server._validate_app_settings(settings)["text"]["model_ids"],
                         ["GLM-local", "Qwen-local"])
        settings["text"]["model_ids"] = [";".join(f"model-{index}" for index in range(101))]
        with self.assertRaisesRegex(ValueError, "invalid_text_model_ids"):
            server._validate_app_settings(settings)


class StoryboardPlanningTests(unittest.TestCase):
    def test_timing_derives_count_and_requires_exact_division(self):
        for duration in (5, 8, 10, 15):
            settings = server._validate_storyboard_request({
                "story": "Film", "model": "local", "total_duration": duration * 48, "shot_duration": duration,
            })
            self.assertEqual(settings["shot_count"], 48)
        for timing in (
            {"total_duration": 65, "shot_duration": 8},
            {"total_duration": 1808, "shot_duration": 8},
            {"total_duration": True, "shot_duration": 5},
            {"total_duration": 64, "shot_duration": 8, "shot_count": 2},
            {"total_duration": 64}, {"shot_duration": 8},
            {"total_duration": 64.0, "shot_duration": 8},
        ):
            with self.subTest(timing=timing), self.assertRaises(ValueError):
                server._validate_storyboard_request({"story": "Film", "model": "local", **timing})

    def test_timing_is_instructed_and_enforced_on_model_output(self):
        settings = server._validate_storyboard_request({
            "story": "Film", "model": "local", "total_duration": 10, "shot_duration": 5,
        })
        shot = {"title": "Scene", "prompt": "Film", "music_prompt": "Piano", "duration": 5}
        with patch.object(server, "_local_text_models", return_value=[{"id": "local"}]), \
                patch.object(server, "_request_local_text_json", return_value={"shots": [shot, shot]}) as request:
            self.assertEqual(sum(s["duration"] for s in server._storyboard_with_local_model(settings)["shots"]), 10)
            self.assertIn("duration exactly 5 seconds", request.call_args.args[1])
            request.return_value = {"shots": [shot, {**shot, "duration": 8}]}
            with self.assertRaises(RuntimeError):
                server._storyboard_with_local_model(settings)

    def test_truncated_text_output_is_rejected_even_when_json_is_complete(self):
        from unittest.mock import MagicMock
        response = MagicMock()
        response.__enter__.return_value.read.return_value = json.dumps({
            "choices": [{"finish_reason": "length", "message": {"content": '{"shots":[]}'}}]
        }).encode()
        with patch.object(server, "urlopen", return_value=response):
            with self.assertRaisesRegex(RuntimeError, "invalid JSON response"):
                server._request_local_text_json(
                    "local", "Instructions", "Story",
                    text_snapshot={"service_url": "http://127.0.0.1:9000", "api_params": {}},
                )

    def test_validates_long_story_and_requested_count(self):
        story = "A traveller returns home. " * 300
        settings = server._validate_storyboard_request({
            "story": story, "model": "local-model", "shot_count": 8,
        })
        self.assertEqual(settings["story"], story.strip())
        for changed in (
            {"story": ""}, {"story": "x" * 30001},
            {"shot_count": True}, {"shot_count": 0}, {"shot_count": 1801},
            {"shot_count": 2.5}, {"model": ""},
        ):
            with self.subTest(changed=changed), self.assertRaises(ValueError):
                server._validate_storyboard_request({
                    "story": story, "model": "local-model", "shot_count": 8, **changed,
                })

    def test_returns_validated_shots_and_instructs_selected_model(self):
        shot = {
            "title": "Homecoming", "prompt": "A traveller enters the village at sunset",
            "duration": 8, "music_prompt": "Warm instrumental strings",
        }
        with patch.object(server, "_local_text_models", return_value=[
            {"id": "local-model"},
        ]), patch.object(server, "_request_local_text_json", return_value={
            "shots": [shot, shot],
        }) as request:
            result = server._storyboard_with_local_model({
                "story": "A traveller returns home.", "model": "local-model", "shot_count": 2,
            })
        self.assertEqual(result["shots"], [shot, shot])
        self.assertEqual(request.call_args.args[0], "local-model")
        self.assertIn("exactly 2", request.call_args.args[1])
        self.assertEqual(request.call_args.args[2], "A traveller returns home.")
        self.assertGreater(request.call_args.kwargs["max_tokens"], 1000)

    def test_thirty_minute_boundary_includes_one_second_ltx_shots(self):
        for model, duration, count in (
            ("h3", 5, 360), ("h3", 15, 120),
            ("ltx-2.3-distilled-q4", 1, 1800),
        ):
            with self.subTest(model=model, duration=duration):
                settings = server._validate_storyboard_request({
                    "story": "Film", "model": "local", "target_model": model,
                    "total_duration": 1800, "shot_duration": duration,
                })
                self.assertEqual(settings["shot_count"], count)
        with self.assertRaisesRegex(ValueError, "invalid_storyboard_timing"):
            server._validate_storyboard_request({
                "story": "Film", "model": "local", "target_model": "ltx-2.3-distilled-q4",
                "total_duration": 1801, "shot_duration": 1,
            })

    def test_plans_bounded_batches_with_continuity_and_exact_schemas(self):
        calls = []

        def generate(model, instructions, source, **kwargs):
            batch = kwargs["output_schema"]["properties"]["shots"]
            count = batch["minItems"]
            self.assertEqual(count, batch["maxItems"])
            self.assertLessEqual(count, workflows.STORYBOARD_BATCH_SHOTS)
            self.assertTrue(kwargs["strict"])
            self.assertLessEqual(kwargs["max_tokens"], 8192)
            context = json.loads(source)
            self.assertEqual(context["total_shots"], 25)
            self.assertIn("Plan only shots", instructions)
            if calls:
                self.assertEqual(context["previous_shots"][-1]["title"], str(len(calls) * 12))
            calls.append(context)
            return {"shots": [
                {"title": str(context["first_shot"] + index), "prompt": "同一角色的故事",
                 "music_prompt": "Piano", "duration": 5} for index in range(count)
            ]}

        settings = server._validate_storyboard_request({
            "story": "同一角色的故事", "model": "local", "total_duration": 125, "shot_duration": 5,
        })
        with patch.object(server, "_local_text_models", return_value=[{"id": "local"}]), \
                patch.object(server, "_request_local_text_json", side_effect=generate):
            result = server._storyboard_with_local_model(settings)
        self.assertEqual([shot["title"] for shot in result["shots"]], [str(i) for i in range(1, 26)])
        self.assertEqual([call["first_shot"] for call in calls], [1, 13, 25])

    def test_later_batch_failure_does_not_return_partial_storyboard(self):
        shot = {"title": "Scene", "prompt": "Film", "music_prompt": "Piano", "duration": 5}
        settings = server._validate_storyboard_request({
            "story": "Film", "model": "local", "total_duration": 65, "shot_duration": 5,
        })
        with patch.object(server, "_local_text_models", return_value=[{"id": "local"}]), \
                patch.object(server, "_request_local_text_json",
                             side_effect=[{"shots": [shot] * 12}, {"shots": []}]) as request, \
                self.assertRaisesRegex(RuntimeError, "batch starting at 13"):
            server._storyboard_with_local_model(settings)
        self.assertEqual(request.call_count, 2)

    def test_skill_authorization_is_rechecked_before_each_batch(self):
        shot = {"title": "Scene", "prompt": "Film", "music_prompt": "Piano", "duration": 5}
        settings = server._validate_storyboard_request({
            "story": "Film", "model": "local", "total_duration": 65, "shot_duration": 5,
        })
        with patch.object(server, "_local_text_models", return_value=[{"id": "local"}]), \
                patch.object(server, "_skill_creative_input",
                             side_effect=[("Instructions", "Story", []), RuntimeError("approval changed")]) as resolve, \
                patch.object(server, "_request_local_text_json", return_value={"shots": [shot] * 12}) as request, \
                self.assertRaisesRegex(RuntimeError, "approval changed"):
            server._storyboard_with_local_model(settings)
        self.assertEqual(resolve.call_count, 2)
        self.assertEqual(request.call_count, 1)

    def test_large_storyboard_save_has_its_own_bounded_request_budget(self):
        data = json.dumps({
            "shots": [{"title": "Scene", "prompt": "x" * 4000, "duration": 5}] * 50,
            "soundtrack": {"mode": "none"},
        }).encode()
        self.assertGreater(len(data), server.MAX_REQUEST_BYTES)
        handler = Mock(headers={"Content-Length": str(len(data))}, rfile=io.BytesIO(data))
        self.assertEqual(len(server._read_long_video_payload(handler)["shots"]), 50)
        with self.assertRaisesRegex(ValueError, "invalid_request_size"):
            server._read_workflow_payload(handler)
        handler.headers["Content-Length"] = str(64 * 1024 * 1024 + 1)
        with self.assertRaisesRegex(ValueError, "invalid_request_size"):
            server._read_long_video_payload(handler)

    def test_rejects_partial_or_malformed_storyboards_without_returning_shots(self):
        shot = {
            "title": "Opening", "prompt": "A quiet village", "duration": 5,
            "music_prompt": "Soft instrumental piano",
        }
        for generated in (
            {"shots": []}, {"shots": [None]},
            {"shots": [{**shot, "duration": True}]},
            {"shots": [{**shot, "duration": 30}]},
            {"shots": [{**shot, "prompt": ""}]},
            {"shots": [{**shot, "music_prompt": " "}]},
            {"shots": [{**shot, "title": "x" * 121}]},
        ):
            with self.subTest(generated=generated), patch.object(
                server, "_local_text_models", return_value=[{"id": "local-model"}]
            ), patch.object(server, "_request_local_text_json", return_value=generated):
                with self.assertRaises(RuntimeError):
                    server._storyboard_with_local_model({
                        "story": "A story", "model": "local-model", "shot_count": 1,
                    })

    def test_rejects_unavailable_model_before_generation(self):
        with patch.object(server, "_local_text_models", return_value=[]), patch.object(
            server, "_request_local_text_json"
        ) as request, self.assertRaisesRegex(ValueError, "text_model_unavailable"):
            server._storyboard_with_local_model({
                "story": "A story", "model": "missing-model", "shot_count": 1,
            })
        request.assert_not_called()


class PromptEnhancementTests(unittest.TestCase):
    def test_validates_mode_prompt_and_model(self):
        settings = server._validate_prompt_enhancement({
            "prompt": "  Rainy street at night  ",
            "mode": "video",
            "model": "GLM-4.7-Flash-4bit",
        })
        self.assertEqual(settings, {
            "prompt": "Rainy street at night",
            "mode": "video",
            "model": "GLM-4.7-Flash-4bit",
        })
        mv_settings = server._validate_prompt_enhancement({
            "prompt": "  Ocean at sunrise  ",
            "mode": "mv",
            "model": "GLM-4.7-Flash-4bit",
        })
        self.assertEqual(mv_settings, {
            "prompt": "Ocean at sunrise",
            "mode": "mv",
            "model": "GLM-4.7-Flash-4bit",
        })

        for payload in (
            {"prompt": " ", "mode": "video", "model": "local-model"},
            {"prompt": "A scene", "mode": "audio", "model": "local-model"},
            {"prompt": "A scene", "mode": "image", "model": ""},
        ):
            with self.subTest(payload=payload), self.assertRaises(ValueError):
                server._validate_prompt_enhancement(payload)

    def test_filters_non_text_models_from_local_omlx_inventory(self):
        class FakeResponse:
            def __enter__(self):
                return self

            def __exit__(self, *args):
                return False

            def read(self):
                return json.dumps({"data": [
                    {"id": "Qwen3.8-27B-Uncensored-OptiQ-4bit"},
                    {"id": "GLM-4.7-Flash-4bit"},
                    {"id": "gemma-4-12B-it-MLX-8bit"},
                    {"id": "HiDream-O1-Image-Dev-mlx-q6"},
                    {"id": "MiniMax-Music3-8bit"},
                    {"id": "glm-ocr-8bit"},
                ]}).encode()

        settings = json.loads(json.dumps(server._DEFAULT_SETTINGS))
        settings["text"]["model_ids"] = []
        with patch.object(server, "_settings_snapshot", return_value=settings), patch.object(
            server, "urlopen", return_value=FakeResponse()
        ):
            models = server._local_text_models()
        self.assertEqual([model["id"] for model in models], [
            "gemma-4-12B-it-MLX-8bit",
            "GLM-4.7-Flash-4bit",
            "Qwen3.8-27B-Uncensored-OptiQ-4bit",
        ])

    def test_uses_selected_local_model_and_returns_keywords_and_prompt(self):
        class FakeResponse:
            def __enter__(self):
                return self

            def __exit__(self, *args):
                return False

            def read(self):
                return json.dumps({"choices": [{
                    "message": {"content": json.dumps({
                        "keywords": ["rainy street", "slow camera pan"],
                        "optimized_prompt": "A rainy street at night, with a slow cinematic camera pan.",
                    })}
                }]}).encode()

        def respond(request, timeout):
            self.assertEqual(request.full_url, "http://127.0.0.1:8000/v1/chat/completions")
            self.assertEqual(timeout, 240)
            request_body = json.loads(request.data)
            self.assertEqual(request_body["model"], "GLM-4.7-Flash-4bit")
            self.assertEqual(request_body["response_format"], {"type": "json_object"})
            self.assertFalse(request_body["enable_thinking"])
            self.assertIn("text-to-video", request_body["messages"][0]["content"])
            self.assertEqual(request_body["messages"][1]["content"], "Rainy street at night")
            return FakeResponse()

        with patch.object(server, "_local_text_models", return_value=[
            {"id": "GLM-4.7-Flash-4bit", "name": "GLM-4.7-Flash-4bit"},
        ]), patch.object(server, "urlopen", side_effect=respond):
            result = server._enhance_prompt_with_local_model({
                "prompt": "Rainy street at night",
                "mode": "video",
                "model": "GLM-4.7-Flash-4bit",
            })
        self.assertEqual(result["keywords"], ["rainy street", "slow camera pan"])
        self.assertEqual(result["optimized_prompt"], "A rainy street at night, with a slow cinematic camera pan.")

    def test_rejects_model_not_present_in_local_inventory(self):
        with patch.object(server, "_local_text_models", return_value=[
            {"id": "GLM-4.7-Flash-4bit"},
        ]):
            with self.assertRaisesRegex(ValueError, "text_model_unavailable"):
                server._enhance_prompt_with_local_model({
                    "prompt": "A scene",
                    "mode": "image",
                    "model": "https://example.com/model",
                })

    def test_rejects_non_loopback_text_api_configuration(self):
        settings = json.loads(json.dumps(server._DEFAULT_SETTINGS))
        settings["text"]["service_url"] = "https://example.com"
        with self.assertRaisesRegex(ValueError, "invalid_text_service_url"):
            server._validate_app_settings(settings)


class HiDreamGenerationTests(unittest.TestCase):
    def test_validates_prompt_and_seed_for_square_q6_output(self):
        settings = server._validate_hidream_generation({
            "prompt": "  A red fox under a paper lantern  ",
            "seed": 12,
        })
        self.assertEqual(settings, {
            "prompt": "A red fox under a paper lantern",
            "seed": 12,
            "width": 2048,
            "height": 2048,
            "quality": "custom",
            "candidate_count": 1,
        })

        for payload in (
            {"prompt": "  "},
            {"prompt": "A fox", "seed": -1},
            {"prompt": "A fox", "seed": 2**32},
        ):
            with self.subTest(payload=payload), self.assertRaises(ValueError):
                server._validate_hidream_generation(payload)

    def test_runs_q6_inference_and_publishes_generated_png(self):
        class FakeProcess:
            def __init__(self):
                self.stdout = io.StringIO("loaded model\ngeneration complete\n")

            def poll(self):
                return 0

            def wait(self, timeout=None):
                return 0

            def terminate(self):
                pass

            def kill(self):
                pass

        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            output = root / "outputs" / "result.png"
            job_id = "00fc3b40-0c74-4db0-9df3-eaf281bc08da"
            job = {
                "id": job_id, "kind": "image", "status": "queued",
                "created_at": 1.0, "prompt": "A red fox",
                "logs": deque(maxlen=100), "error": "",
                "image_path": None, "process": None, "cancel_requested": False,
            }
            command = [
                str(root / "python"), "-u", str(root / "generate.py"),
                "--model-path", str(root / "model"),
                "--prompt", "A red fox", "--width", "2048", "--height", "2048",
                "--seed", "7", "--num-inference-steps", "28",
                "--no-snap-resolution",
                "--output", str(output),
            ]

            def start_process(actual_command, **kwargs):
                self.assertEqual(actual_command, command)
                output.parent.mkdir(parents=True, exist_ok=True)
                from PIL import Image
                Image.new("RGB", (2048, 2048)).save(output)
                return FakeProcess()

            previous_active_job = server._active_job_id
            with patch.object(server, "_hidream_status", return_value={
                "model_ready": True, "runtime_ready": True,
            }), patch.object(server, "HIDREAM_PYTHON", Path(command[0])), patch.object(
                server, "HIDREAM_SCRIPT", Path(command[2])
            ), patch.object(server, "HIDREAM_MODEL_PATH", Path(command[4])), patch.object(
                server, "HIDREAM_CODE_ROOT", root
            ), patch.object(server, "OUTPUT_ROOT", root / "outputs"), patch.object(
                server.subprocess, "Popen", side_effect=start_process
            ):
                with server._lock:
                    server._jobs[job_id] = job
                    server._active_job_id = job_id
                try:
                    server._run_hidream_job(
                        job_id,
                        {
                            "prompt": "A red fox", "seed": 7, "width": 2048, "height": 2048,
                            "model_path": str(root / "model"),
                        },
                        output,
                    )
                finally:
                    with server._lock:
                        server._jobs.pop(job_id, None)
                        server._active_job_id = previous_active_job

            self.assertEqual(job["status"], "completed")
            self.assertEqual(job["image_path"], output)
            self.assertIn("Image generation complete: 1 candidate(s).", job["logs"])
            self.assertEqual(server._public_job(job)["image_url"], f"/api/jobs/{job_id}/image")


class CancellationTests(unittest.TestCase):
    def make_job(self, kind="video"):
        return {
            "id": "cancel-test", "kind": kind, "status": "running",
            "created_at": 0, "prompt": "Test cancellation", "logs": deque(),
            "error": "", "cancel_requested": False, "response": Mock(),
            "process": None,
        }

    def test_video_cancel_stops_owned_backend_without_closing_reader_or_holding_lock(self):
        job = self.make_job()
        process = Mock()
        process.poll.return_value = None
        job["h3_process"] = process

        def terminate():
            self.assertTrue(server._lock.acquire(blocking=False))
            server._lock.release()
            self.assertEqual(job["status"], "cancelling")
            self.assertFalse(job["cancel_stopped"].is_set())

        process.terminate.side_effect = terminate
        with patch.dict(server._jobs, {job["id"]: job}, clear=True), patch.object(
            server, "_mlx_server_process", process
        ):
            server._cancel_job(job["id"])
            self.assertIsNone(server._mlx_server_process)
            with self.assertRaises(server.GenerationCancelled):
                server._check_cancelled(job["id"])
        process.terminate.assert_called_once()
        process.wait.assert_called_once_with(timeout=5)
        job["response"].close.assert_not_called()
        self.assertTrue(job["cancel_stopped"].is_set())

    def test_image_and_music_cancel_escalate_when_terminate_is_ignored(self):
        for kind in ("image", "music"):
            with self.subTest(kind=kind):
                job = self.make_job(kind)
                process = Mock()
                process.poll.return_value = None
                process.wait.side_effect = [subprocess.TimeoutExpired("inference", 5), 0]
                job["process"] = process
                with patch.dict(server._jobs, {job["id"]: job}, clear=True):
                    server._cancel_job(job["id"])
                process.kill.assert_called_once()
                self.assertEqual(process.wait.call_count, 2)

    def test_cancel_reaps_real_process_that_ignores_sigterm(self):
        process = subprocess.Popen(
            [sys.executable, "-u", "-c",
             "import signal,time; signal.signal(signal.SIGTERM, signal.SIG_IGN); "
             "print('ready', flush=True); time.sleep(60)"],
            stdout=subprocess.PIPE, text=True,
        )
        try:
            self.assertEqual(process.stdout.readline().strip(), "ready")
            server._stop_process(process)
            self.assertIsNotNone(process.poll())
            self.assertLess(process.returncode, 0)
        finally:
            if process.poll() is None:
                process.kill()
                process.wait(timeout=5)
            process.stdout.close()

    def test_external_h3_cancel_fails_without_claiming_cancellation(self):
        job = self.make_job()
        with patch.dict(server._jobs, {job["id"]: job}, clear=True):
            with self.assertRaisesRegex(RuntimeError, "externally managed"):
                server._cancel_job(job["id"])
        self.assertFalse(job["cancel_requested"])
        self.assertEqual(job["status"], "running")

    def test_existing_external_service_is_not_misidentified_as_owned(self):
        job = self.make_job()
        with patch.dict(server._jobs, {job["id"]: job}, clear=True), patch.object(
            server, "_mlx_server_process", None
        ), patch.object(server, "_service_health", return_value=True), patch.object(
            server.subprocess, "Popen"
        ) as spawn:
            server._start_mlx_server(job["id"], Path("/model"))
            self.assertIsNone(job["h3_process"])
            spawn.assert_not_called()
            with self.assertRaisesRegex(RuntimeError, "externally managed"):
                server._cancel_job(job["id"])

    def test_stop_failure_is_reported_and_keeps_job_active(self):
        job = self.make_job()
        job["h3_process"] = Mock()
        with patch.dict(server._jobs, {job["id"]: job}, clear=True), patch.object(
            server, "_stop_process", side_effect=OSError("permission denied")
        ):
            with self.assertRaisesRegex(RuntimeError, "permission denied"):
                server._cancel_job(job["id"])
            server._check_cancelled(job["id"])
        self.assertEqual(job["status"], "running")
        self.assertFalse(job["cancel_requested"])
        self.assertIn("permission denied", job["error"])

    def test_queued_cancel_prevents_backend_start(self):
        job = self.make_job()
        job["status"] = "queued"
        with patch.dict(server._jobs, {job["id"]: job}, clear=True), patch.object(
            server, "_local_mlx_serve", return_value=Path("/fake/mlx-serve")
        ), patch.object(server.subprocess, "Popen") as spawn:
            server._cancel_job(job["id"])
            with self.assertRaises(server.GenerationCancelled):
                server._start_mlx_server(job["id"], Path("/model"))
            spawn.assert_not_called()

    def test_cancel_unblocks_stream_worker_and_releases_slot_only_after_backend_exit(self):
        job = self.make_job()
        entered = threading.Event()
        exited = threading.Event()
        stopped = threading.Event()
        process = Mock()
        process.poll.return_value = None
        job["h3_process"] = process
        stream = Mock()

        def lines():
            entered.set()
            if not stopped.wait(2):
                raise TimeoutError("backend was not stopped")
            yield from ()

        stream.__iter__ = Mock(side_effect=lines)

        def wait(timeout):
            self.assertEqual(server._active_job_id, job["id"])
            self.assertEqual(job["status"], "cancelling")
            stopped.set()
            return 0

        process.wait.side_effect = wait
        with tempfile.TemporaryDirectory() as temp_dir, patch.dict(
            server._jobs, {job["id"]: job}, clear=True
        ), patch.object(server, "_active_job_id", job["id"]), patch.object(
            server, "_mlx_server_process", process
        ), patch.object(server, "_load_h3_model", return_value="h3"), patch.object(
            server, "_generation_request", return_value={}
        ), patch.object(server, "urlopen", return_value=stream):
            output = Path(temp_dir) / "cancelled.mp4"

            def run():
                try:
                    server._run_job(job["id"], {
                        "turbo": True, "num_frames": 22, "width": 128, "height": 128,
                    }, Path(temp_dir), output)
                finally:
                    exited.set()

            worker = threading.Thread(target=run, daemon=True)
            worker.start()
            try:
                self.assertTrue(entered.wait(2))
                server._cancel_job(job["id"])
                self.assertTrue(exited.wait(2))
                worker.join(timeout=2)
                self.assertEqual(job["status"], "cancelled")
                self.assertIsNone(server._active_job_id)
                self.assertIsNone(server._mlx_server_process)
                self.assertFalse(output.exists())
                self.assertEqual(job["error"], "")
                stream.close.assert_called_once()
            finally:
                stopped.set()
                worker.join(timeout=2)

    def test_workflow_cancel_prevents_next_shot_even_without_an_active_job(self):
        event = threading.Event()
        event.set()
        with patch.dict(server._workflow_cancel_events, {"workflow": event}, clear=True):
            with self.assertRaises(server.GenerationCancelled):
                server._start_workflow_job("workflow", "video", "Next shot")
            with self.assertRaises(server.GenerationCancelled):
                server._check_workflow_cancelled("workflow")

    def test_cancel_during_model_load_is_not_reported_as_failure(self):
        job = self.make_job()
        job["cancel_requested"] = True
        with tempfile.TemporaryDirectory() as temp_dir, patch.dict(
            server._jobs, {job["id"]: job}, clear=True
        ), patch.object(server, "_active_job_id", job["id"]), patch.object(
            server, "_load_h3_model", side_effect=RuntimeError("backend exited")
        ):
            server._run_job(job["id"], {"turbo": True}, Path(temp_dir), Path(temp_dir) / "video.mp4")
            self.assertEqual(job["status"], "cancelled")
            self.assertEqual(job["error"], "")
            self.assertIsNone(server._active_job_id)


class LocalWebHandlerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()
        cls.base_url = f"http://127.0.0.1:{cls.httpd.server_port}"

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()
        cls.thread.join(timeout=2)

    def test_every_model_publishes_history_independent_of_selected_model(self):
        cases = [
            *(("video", model, "/api/jobs", "h3", "mp4")
              for model in ("h3", *server.local_models.VIDEO_MODELS)),
            *(("image", model, "/api/image-jobs", "hidream", "png")
              for model in ("hidream", *server.local_models.IMAGE_MODELS)),
            *(("music", model, "/api/music-jobs", "music", "wav")
              for model in ("music3", *server.local_models.MUSIC_MODELS)),
        ]
        finished = threading.Event()
        produced = {}
        generated_settings = {}

        def publish(job_id, settings, output_path):
            try:
                output_path.parent.mkdir(parents=True, exist_ok=True)
                output_path.write_bytes(b"test generated media")
                with server._lock:
                    job = server._jobs[job_id]
                    server._persist_history(job, [output_path], settings)
                    job["status"] = "completed"
                    produced[job_id] = output_path
                    generated_settings[job_id] = dict(settings)
                    server._active_job_id = None
            finally:
                finished.set()

        def publish_video(job_id, settings, model_path, output_path):
            publish(job_id, settings, output_path)

        ready = {"model_ready": True, "runtime_ready": True, "runtime_error": ""}
        with tempfile.TemporaryDirectory() as temporary, patch.object(
            server, "OUTPUT_ROOT", Path(temporary)
        ), patch.dict(server._jobs, {}, clear=True), patch.object(
            server, "_active_job_id", None
        ), patch.object(server, "_active_workflow_id", None), patch.object(
            server, "_settings_snapshot", return_value=server._DEFAULT_SETTINGS
        ), patch.object(server, "_require_enabled_model"), patch.object(
            server, "_find_models", return_value=["test-model"]
        ), patch.object(server, "_hidream_status", return_value=ready), patch.object(
            server, "_local_model_status", return_value=ready
        ), patch.object(server, "_music_status", return_value=ready), patch.object(
            server, "_run_job", side_effect=publish_video
        ), patch.object(server, "_run_hidream_job", side_effect=publish), patch.object(
            server, "_run_music_job", side_effect=publish
        ):
            expected = {}
            for kind, model, endpoint, prefix, suffix in cases:
                with self.subTest(model=model):
                    finished.clear()
                    request = Request(
                        self.base_url + endpoint,
                        data=json.dumps({"prompt": "Saved model project", "model": model,
                                         "lyrics_mode": "instrumental",
                                         **({"size": 1024, "aspect": "9:16", "width": 576, "height": 1024}
                                            if kind == "image" else {})}).encode(),
                        headers={"Content-Type": "application/json"}, method="POST",
                    )
                    with urlopen(request, timeout=2) as response:
                        self.assertEqual(response.status, 202)
                        item_id = json.load(response)["job"]["id"]
                    self.assertTrue(finished.wait(2))
                    if kind == "image":
                        self.assertEqual((generated_settings[item_id]["width"], generated_settings[item_id]["height"]),
                                         (576, 1024))
                    self.assertEqual(produced[item_id], Path(temporary) / kind / f"{prefix}-{item_id}.{suffix}")
                    expected[item_id] = (kind, model)
            with urlopen(self.base_url + "/api/history", timeout=2) as response:
                items = json.load(response)["items"]
            self.assertEqual({item["id"] for item in items}, set(expected))
            for item in items:
                kind, model = expected[item["id"]]
                default_model = {"video": "h3", "image": "hidream", "music": "music3"}[kind]
                self.assertEqual(item["generation"].get("model", default_model), model)
                if kind == "image":
                    self.assertEqual((item["generation"]["aspect"], item["generation"]["width"], item["generation"]["height"]),
                                     ("9:16", 576, 1024))
                url = item["audio_url"] if kind == "music" else item[f"{kind}_url"]
                with urlopen(self.base_url + url, timeout=2) as response:
                    self.assertEqual(response.read(), b"test generated media")

    def test_cancel_endpoint_stops_backend_and_current_job_remains_responsive(self):
        job = CancellationTests().make_job()
        job["id"] = "4c9a5bf1-daad-47c2-8c58-b3e9c27b05e0"
        process = Mock()
        process.poll.return_value = None
        job["h3_process"] = process
        with patch.dict(server._jobs, {job["id"]: job}, clear=True), patch.object(
            server, "_active_job_id", job["id"]
        ), patch.object(server, "_mlx_server_process", process):
            request = Request(self.base_url + f"/api/jobs/{job['id']}/cancel", data=b"", method="POST")
            with urlopen(request, timeout=2) as response:
                self.assertEqual(json.loads(response.read())["job"]["status"], "cancelling")
            with urlopen(self.base_url + "/api/jobs/current", timeout=2) as response:
                self.assertEqual(response.status, 200)
        process.terminate.assert_called_once()
        job["response"].close.assert_not_called()

    def test_workflow_cancel_endpoint_stops_active_video_backend(self):
        workflow_id = "9374eb0a-e015-4621-8856-88eef9209d44"
        event = threading.Event()
        job = CancellationTests().make_job()
        process = Mock()
        process.poll.return_value = None
        job["h3_process"] = process
        manifest = {"id": workflow_id, "status": "running"}
        with patch.dict(server._jobs, {job["id"]: job}, clear=True), patch.object(
            server, "_active_job_id", job["id"]
        ), patch.object(server, "_active_workflow_id", workflow_id), patch.dict(
            server._workflow_cancel_events, {workflow_id: event}, clear=True
        ), patch.object(server, "_mlx_server_process", process), patch.object(
            server.workflows, "get_workflow", return_value=manifest
        ), patch.object(server, "_public_workflow", side_effect=lambda value: value):
            request = Request(
                self.base_url + f"/api/workflows/{workflow_id}/cancel", data=b"", method="POST"
            )
            with urlopen(request, timeout=2) as response:
                self.assertEqual(response.status, 202)
            self.assertTrue(event.is_set())
        process.terminate.assert_called_once()
        job["response"].close.assert_not_called()

    def test_serves_ui_and_rejects_nonlocal_host(self):
        with urlopen(self.base_url) as response:
            self.assertEqual(response.status, 200)
            html = response.read().decode("utf-8")
            self.assertIn("<title>MiniMuv</title>", html)
            self.assertIn("输入提示词，开始生成", html)

        request = Request(self.base_url, headers={"Host": "example.com"})
        with self.assertRaises(HTTPError) as context:
            urlopen(request)
        self.assertEqual(context.exception.code, 403)
        context.exception.close()

    def test_reads_and_saves_settings_over_local_api(self):
        settings = json.loads(json.dumps(server._DEFAULT_SETTINGS))
        settings["video"]["model_id"] = "local-h3"
        settings["text"]["model_ids"] = ["local-text-model"]
        with tempfile.TemporaryDirectory() as temp_dir, patch.object(
            server, "SETTINGS_PATH", Path(temp_dir) / "settings.json"
        ):
            request = Request(
                f"{self.base_url}/api/settings",
                data=json.dumps(settings).encode(),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urlopen(request) as response:
                saved = json.loads(response.read())["settings"]
            with urlopen(f"{self.base_url}/api/settings") as response:
                loaded = json.loads(response.read())["settings"]
        self.assertEqual(saved["video"]["model_id"], "local-h3")
        self.assertEqual(loaded, saved)

    def test_returns_local_model_status_contract(self):
        with urlopen(f"{self.base_url}/api/models") as response:
            data = json.loads(response.read())

        self.assertIn("model_ready", data)
        self.assertIn("runtime_ready", data)
        self.assertIn("server_ready", data)
        self.assertEqual(data["model_download_url"], server.MODEL_URL)
        self.assertIn("hidream", data)
        self.assertEqual(data["hidream"]["model_download_url"], server.HIDREAM_MODEL_URL)
        self.assertIn("music", data)
        self.assertEqual(data["music"]["model_download_url"], server.MUSIC_MODEL_URL)

    def test_lists_history_and_serves_history_media(self):
        with tempfile.TemporaryDirectory() as temp_dir, patch.object(
            server, "OUTPUT_ROOT", Path(temp_dir)
        ):
            item_id = "9374eb0a-e015-4621-8856-88eef9209d44"
            image_path = Path(temp_dir) / f"hidream-{item_id}.png"
            image_path.write_bytes(b"\x89PNG\r\n\x1a\nimage")
            server._persist_history({
                "id": item_id, "kind": "image", "created_at": 1234.5, "prompt": "A quiet forest",
            }, [image_path])

            with urlopen(f"{self.base_url}/api/history") as response:
                history = json.loads(response.read())["items"]
            with urlopen(f"{self.base_url}/api/history/{item_id}/image") as response:
                media = response.read()
                content_type = response.headers["Content-Type"]

        self.assertEqual(history[0]["prompt"], "A quiet forest")
        self.assertEqual(media, b"\x89PNG\r\n\x1a\nimage")
        self.assertEqual(content_type, "image/png")

    def test_local_first_frame_upload_formats_and_snapshot(self):
        import io
        from PIL import Image
        with tempfile.TemporaryDirectory() as temp_dir, patch.object(
            server, "OUTPUT_ROOT", Path(temp_dir)
        ):
            for image_format in ("PNG", "JPEG", "WEBP"):
                with self.subTest(image_format=image_format):
                    buffer = io.BytesIO()
                    Image.new("RGB", (32, 24), "blue").save(buffer, format=image_format)
                    request = Request(
                        self.base_url + "/api/first-frames", data=buffer.getvalue(),
                        headers={"Content-Type": "application/octet-stream"}, method="POST",
                    )
                    with urlopen(request) as response:
                        self.assertEqual(response.status, 201)
                        uploaded = json.loads(response.read())
                    with urlopen(request) as response:
                        self.assertEqual(json.loads(response.read())["id"], uploaded["id"])
                    with urlopen(self.base_url + uploaded["image_url"]) as response:
                        data = response.read()
                        with Image.open(io.BytesIO(data)) as image:
                            self.assertEqual(image.format, "PNG")
                            self.assertEqual(image.size, (32, 24))
                    workflow = server.workflows.create_workflow(Path(temp_dir), {
                        "shots": [{"prompt": "A local opening", "duration": 5,
                                   "first_frame_id": uploaded["id"]}],
                        "soundtrack": {"mode": "none"},
                    })
                    path = Path(temp_dir) / "first-frames" / f"{uploaded['id']}.png"
                    self.assertEqual(path.stat().st_mode & 0o777, 0o600)
                    path.unlink()
                    snapshot = Path(workflow["shots"][0]["first_frame_path"])
                    self.assertEqual(snapshot.read_bytes(), data)
                    updated = server.workflows.update_workflow(
                        Path(temp_dir), workflow["id"], {
                            "shots": [{"prompt": "Edited", "duration": 5,
                                       "first_frame_id": uploaded["id"]}],
                            "soundtrack": {"mode": "none"},
                        },
                    )
                    self.assertEqual(Path(updated["shots"][0]["first_frame_path"]).read_bytes(), data)

    def test_local_first_frame_upload_rejects_invalid_and_oversized_inputs(self):
        import io
        from PIL import Image
        buffer = io.BytesIO()
        Image.new("RGB", (4001, 4000)).save(buffer, format="PNG")
        with tempfile.TemporaryDirectory() as temp_dir, patch.object(
            server, "OUTPUT_ROOT", Path(temp_dir)
        ):
            for data, expected in ((b"not an image", 400), (buffer.getvalue(), 400),
                                   (b"", 413)):
                request = Request(self.base_url + "/api/first-frames", data=data, method="POST")
                with self.assertRaises(HTTPError) as caught:
                    urlopen(request)
                self.assertEqual(caught.exception.code, expected)
                caught.exception.close()
            request = Request(
                self.base_url + "/api/first-frames", data=b"x", method="POST",
                headers={"Content-Length": str(20 * 1024 * 1024 + 1)},
            )
            with self.assertRaises(HTTPError) as caught:
                urlopen(request)
            self.assertEqual(caught.exception.code, 413)
            caught.exception.close()
            self.assertFalse((Path(temp_dir) / "first-frames").exists())
            request = Request(
                self.base_url + "/api/first-frames", data=b"x", method="POST",
                headers={"Origin": "https://example.com"},
            )
            with self.assertRaises(HTTPError) as caught:
                urlopen(request)
            self.assertEqual(caught.exception.code, 403)
            caught.exception.close()

    def test_local_first_frame_upload_cache_limit_and_symlink_boundary(self):
        import io
        from PIL import Image
        buffer = io.BytesIO()
        Image.new("RGB", (4, 4), "red").save(buffer, format="PNG")
        with tempfile.TemporaryDirectory() as temp_dir, patch.object(
            server, "OUTPUT_ROOT", Path(temp_dir)
        ):
            directory = Path(temp_dir) / "first-frames"
            directory.mkdir()
            for number in range(100):
                (directory / f"{number}.png").write_bytes(b"x")
            request = Request(
                self.base_url + "/api/first-frames", data=buffer.getvalue(), method="POST",
            )
            with self.assertRaises(HTTPError) as caught:
                urlopen(request)
            self.assertEqual(caught.exception.code, 409)
            caught.exception.close()
            self.assertEqual(len(list(directory.iterdir())), 100)
            image_id = "9374eb0a-e015-4621-8856-88eef9209d44"
            (directory / f"{image_id}.png").symlink_to(directory / "0.png")
            with self.assertRaises(HTTPError) as caught:
                urlopen(self.base_url + f"/api/first-frames/{image_id}")
            self.assertEqual(caught.exception.code, 404)
            caught.exception.close()

    def test_creates_updates_and_lists_storyboard_workflow_drafts(self):
        from PIL import Image
        with tempfile.TemporaryDirectory() as temp_dir, patch.object(
            server, "OUTPUT_ROOT", Path(temp_dir)
        ):
            image_id = "9374eb0a-e015-4621-8856-88eef9209d44"
            source = Path(temp_dir) / f"hidream-{image_id}.png"
            Image.new("RGB", (32, 32), "blue").save(source)
            original_image = source.read_bytes()
            payload = {
                "name": "Rainy evening",
                "aspect": "16:9",
                "shots": [{
                    "title": "Opening", "prompt": "A quiet rainy street",
                    "music_prompt": "Soft piano under rain",
                    "first_frame_id": image_id,
                    "duration": 5, "steps": 4, "seed": 1, "turbo": True,
                }],
                "soundtrack": {
                    "mode": "none", "mix": "score", "prompt": "Gentle piano",
                    "lyrics_mode": "instrumental", "lyrics": "[instrumental]",
                },
            }
            request = Request(
                f"{self.base_url}/api/workflows",
                data=json.dumps(payload).encode(),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urlopen(request) as response:
                self.assertEqual(response.status, 201)
                created = json.loads(response.read())["workflow"]
            self.assertNotIn("first_frame_path", created["shots"][0])
            source.unlink()
            with urlopen(self.base_url + created["shots"][0]["first_frame_url"]) as response:
                self.assertEqual(response.headers.get_content_type(), "image/png")
                self.assertEqual(response.read(), original_image)

            updated_payload = {
                **payload,
                "name": "Rainy evening, revised",
                "shots": [{**payload["shots"][0], "title": "New opening"}],
            }
            request = Request(
                f"{self.base_url}/api/workflows/{created['id']}/update",
                data=json.dumps(updated_payload).encode(),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urlopen(request) as response:
                updated = json.loads(response.read())["workflow"]
            with urlopen(f"{self.base_url}/api/workflows") as response:
                items = json.loads(response.read())["items"]

        self.assertEqual(updated["name"], "Rainy evening, revised")
        self.assertEqual(updated["shots"][0]["title"], "New opening")
        self.assertEqual(updated["shots"][0]["music_prompt"], "Soft piano under rain")
        self.assertEqual(len(items), 1)
        self.assertNotIn("output_path", updated)
        self.assertNotIn("video_path", updated["shots"][0])
        self.assertNotIn("music_path", updated["shots"][0])
        self.assertEqual(updated["shots"][0]["first_frame_id"], image_id)

    def test_standalone_video_passes_validated_first_frame_to_runner(self):
        from PIL import Image
        for source_kind in ("history", "upload", "none"):
            with self.subTest(source_kind=source_kind), tempfile.TemporaryDirectory() as temp_dir, patch.object(
                server, "OUTPUT_ROOT", Path(temp_dir)
            ), patch.object(server, "_find_models", return_value=[Path(temp_dir) / "model"]), patch.object(
                server, "_active_job_id", None
            ), patch.object(server, "_active_workflow_id", None), patch.dict(server._jobs, clear=True):
                image_id = "9374eb0a-e015-4621-8856-88eef9209d44"
                path = Path(temp_dir) / f"hidream-{image_id}.png"
                if source_kind == "upload":
                    path = Path(temp_dir) / "first-frames" / f"{image_id}.png"
                    path.parent.mkdir()
                if source_kind != "none":
                    Image.new("RGB", (32, 24), "blue").save(path)
                payload = {"prompt": "Opening frame", "first_frame_id": image_id if source_kind != "none" else ""}
                captured = {}
                ready = threading.Event()

                def capture(job_id, settings, model_path, output_path):
                    captured.update(settings)
                    ready.set()

                with patch.object(server, "_run_job", side_effect=capture):
                    request = Request(
                        self.base_url + "/api/jobs", data=json.dumps(payload).encode(),
                        headers={"Content-Type": "application/json"}, method="POST",
                    )
                    with urlopen(request) as response:
                        self.assertEqual(response.status, 202)
                        job = json.loads(response.read())["job"]
                    self.assertTrue(ready.wait(2))
                api_request = server._generation_request("h3", captured)
                self.assertNotIn("first_frame_image", job)
                self.assertNotIn("first_frame_id", api_request)
                if source_kind == "none":
                    self.assertNotIn("first_frame_image", api_request)
                else:
                    image_bytes = path.read_bytes()
                    path.unlink()
                    self.assertEqual(base64.b64decode(api_request["first_frame_image"]), image_bytes)

    def test_standalone_video_rejects_missing_invalid_or_symlink_first_frame(self):
        image_id = "9374eb0a-e015-4621-8856-88eef9209d44"
        with tempfile.TemporaryDirectory() as temp_dir, patch.object(
            server, "OUTPUT_ROOT", Path(temp_dir)
        ), patch.object(server, "_run_job") as runner:
            path = Path(temp_dir) / f"hidream-{image_id}.png"
            for state in ("missing", "invalid", "symlink"):
                if state == "invalid":
                    path.write_bytes(b"not an image")
                elif state == "symlink":
                    path.unlink()
                    path.symlink_to(Path(temp_dir) / "missing.png")
                request = Request(
                    self.base_url + "/api/jobs",
                    data=json.dumps({"prompt": "Film", "first_frame_id": image_id}).encode(),
                    headers={"Content-Type": "application/json"}, method="POST",
                )
                with self.assertRaises(HTTPError) as caught:
                    urlopen(request)
                self.assertEqual(caught.exception.code, 400)
                self.assertIn(json.loads(caught.exception.read())["error"],
                              {"first_frame_not_found", "invalid_first_frame"})
                caught.exception.close()
            runner.assert_not_called()

    def test_workflow_reservation_blocks_standalone_jobs_without_exposing_subjobs(self):
        with tempfile.TemporaryDirectory() as temp_dir, patch.object(
            server, "OUTPUT_ROOT", Path(temp_dir)
        ), patch.object(server, "_find_models", return_value=[Path(temp_dir) / "model"]):
            workflow_id = "9374eb0a-e015-4621-8856-88eef9209d44"
            job_id = "0374eb0a-e015-4621-8856-88eef9209d44"
            previous_active_workflow = server._active_workflow_id
            previous_active_job = server._active_job_id
            with server._lock:
                server._active_workflow_id = workflow_id
                server._active_job_id = job_id
                server._jobs[job_id] = {
                    "id": job_id, "kind": "video", "status": "running",
                    "created_at": 1, "prompt": "Workflow shot", "logs": deque(),
                    "workflow_id": workflow_id, "video_path": None,
                    "audio_path": None, "image_path": None, "error": "",
                }
            try:
                current = json.loads(urlopen(
                    f"{self.base_url}/api/jobs/current"
                ).read())["job"]
                request = Request(
                    f"{self.base_url}/api/jobs",
                    data=json.dumps({"prompt": "Standalone generation"}).encode(),
                    headers={"Content-Type": "application/json"},
                    method="POST",
                )
                with self.assertRaises(HTTPError) as context:
                    urlopen(request)
                response_body = json.loads(context.exception.read())
                context.exception.close()
            finally:
                with server._lock:
                    server._jobs.pop(job_id, None)
                    server._active_job_id = previous_active_job
                    server._active_workflow_id = previous_active_workflow

        self.assertIsNone(current)
        self.assertEqual(context.exception.code, 409)
        self.assertEqual(response_body["error"], "job_already_running")

    def test_storyboard_api_returns_shots_without_saving_or_starting_workflow(self):
        payload = {"story": "A traveller returns home.", "model": "local-model", "shot_count": 1}
        shot = {
            "title": "Home", "prompt": "A traveller enters the village", "duration": 5,
            "music_prompt": "Warm instrumental strings",
        }
        with patch.object(server, "_storyboard_with_local_model", return_value={
            "shots": [shot],
        }) as planner, patch.object(server.workflows, "create_workflow") as create:
            request = Request(
                f"{self.base_url}/api/storyboards", data=json.dumps(payload).encode(),
                headers={"Content-Type": "application/json"}, method="POST",
            )
            with urlopen(request) as response:
                self.assertEqual(response.status, 200)
                self.assertEqual(json.loads(response.read()), {"shots": [shot]})
        planner.assert_called_once_with({**payload, "video_model": "h3"})
        create.assert_not_called()

    def test_storyboard_api_reports_invalid_story_and_generation_failure(self):
        for payload, status, error in (
            ({"story": "", "model": "local-model", "shot_count": 1}, 400, "invalid_story"),
            ({"story": "A story", "model": "local-model", "total_duration": 65, "shot_duration": 8},
             400, "invalid_storyboard_timing"),
            ({"story": "A story", "model": "local-model", "shot_count": 1}, 502, "local_text_generation_failed"),
        ):
            with self.subTest(status=status), patch.object(
                server, "_storyboard_with_local_model", side_effect=RuntimeError("Malformed model output")
            ):
                request = Request(
                    f"{self.base_url}/api/storyboards", data=json.dumps(payload).encode(),
                    headers={"Content-Type": "application/json"}, method="POST",
                )
                with self.assertRaises(HTTPError) as caught:
                    urlopen(request)
                self.assertEqual(caught.exception.code, status)
                self.assertEqual(json.loads(caught.exception.read())["error"], error)

    def test_storyboard_api_derives_count_from_timing(self):
        payload = {"story": "Film", "model": "local-model", "total_duration": 80, "shot_duration": 10}
        with patch.object(server, "_storyboard_with_local_model", return_value={"shots": []}) as planner:
            request = Request(f"{self.base_url}/api/storyboards", data=json.dumps(payload).encode(),
                              headers={"Content-Type": "application/json"}, method="POST")
            with urlopen(request) as response:
                self.assertEqual(response.status, 200)
            planner.assert_called_once_with({**payload, "shot_count": 8, "video_model": "h3"})

    def test_lists_local_text_models_and_enhances_prompt(self):
        with patch.object(server, "_local_text_models", return_value=[
            {"id": "GLM-4.7-Flash-4bit", "name": "GLM-4.7-Flash-4bit"},
            {"id": "gemma-4-12B-it-MLX-8bit", "name": "gemma-4-12B-it-MLX-8bit"},
        ]):
            with urlopen(f"{self.base_url}/api/text-models") as response:
                models = json.loads(response.read())
        self.assertEqual(len(models["models"]), 2)

        with patch.object(server, "_enhance_prompt_with_local_model", return_value={
            "keywords": ["soft light", "wide composition"],
            "optimized_prompt": "A quiet room with soft light and a wide composition.",
        }) as enhance:
            request = Request(
                f"{self.base_url}/api/prompt-enhancements",
                data=json.dumps({
                    "prompt": "A quiet room",
                    "mode": "image",
                    "model": "GLM-4.7-Flash-4bit",
                }).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urlopen(request) as response:
                result = json.loads(response.read())
        self.assertEqual(result["keywords"], ["soft light", "wide composition"])
        self.assertEqual(enhance.call_args.args[0]["mode"], "image")

    def test_text_model_api_failure_is_explicit(self):
        with patch.object(server, "_local_text_models", side_effect=RuntimeError("offline")):
            with self.assertRaises(HTTPError) as context:
                urlopen(f"{self.base_url}/api/text-models")
        self.assertEqual(context.exception.code, 503)
        self.assertEqual(
            json.loads(context.exception.read())["error"],
            "local_text_runtime_unavailable",
        )
        context.exception.close()

    def test_image_endpoint_reports_missing_inference_runtime(self):
        with patch.object(server, "_hidream_status", return_value={
            "model_ready": True, "runtime_ready": False,
        }):
            request = Request(
                f"{self.base_url}/api/image-jobs",
                data=json.dumps({"prompt": "A glasshouse at dawn", "seed": 3}).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with self.assertRaises(HTTPError) as context:
                urlopen(request)
        self.assertEqual(context.exception.code, 409)
        self.assertEqual(json.loads(context.exception.read())["error"], "hidream_runtime_missing")
        context.exception.close()

    def test_music_endpoint_reports_missing_model_before_queuing(self):
        with patch.object(server, "_music_status", return_value={
            "model_ready": False, "runtime_ready": True,
        }):
            request = Request(
                f"{self.base_url}/api/music-jobs",
                data=json.dumps({
                    "prompt": "Gentle piano",
                    "lyrics_mode": "instrumental",
                    "duration": 15,
                    "steps": 20,
                    "seed": 42,
                }).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with self.assertRaises(HTTPError) as context:
                urlopen(request)
        self.assertEqual(context.exception.code, 409)
        self.assertEqual(json.loads(context.exception.read())["error"], "music_model_missing")
        context.exception.close()


if __name__ == "__main__":
    unittest.main()


@unittest.skipUnless(shutil.which("ffmpeg"), "ffmpeg required")
class ChainedFirstFrameTests(unittest.TestCase):
    def test_extract_last_frame_returns_final_frame(self) -> None:
        from webapp import workflows
        ffmpeg = shutil.which("ffmpeg")
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            video = root / "clip.mp4"
            subprocess.run([
                ffmpeg, "-nostdin", "-y", "-loglevel", "error",
                "-f", "lavfi", "-i", "color=c=red:s=64x64:d=1:r=10",
                "-f", "lavfi", "-i", "color=c=blue:s=64x64:d=1:r=10",
                "-filter_complex", "[0][1]concat=n=2:v=1[v]", "-map", "[v]",
                "-pix_fmt", "yuv420p", str(video),
            ], check=True)
            path = workflows.extract_last_frame(root, "a" * 32, video, ffmpeg)
            self.assertTrue(path.name.startswith("first-frame-"))
            raw = subprocess.run([
                ffmpeg, "-nostdin", "-loglevel", "error", "-i", str(path),
                "-f", "rawvideo", "-pix_fmt", "rgb24", "-",
            ], check=True, capture_output=True).stdout
            r, g, b = raw[0], raw[1], raw[2]
            self.assertGreater(b, 200)
            self.assertLess(r, 60)
            self.assertEqual([p for p in path.parent.iterdir() if p.name.startswith(".last-frame-")], [])
