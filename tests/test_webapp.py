from __future__ import annotations

import json
import base64
import io
import shutil
import tempfile
import threading
import unittest
from collections import deque
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from unittest.mock import patch

from webapp import server


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
            self.assertEqual((Path(temp_dir) / f"{item_id}.json").stat().st_mode & 0o777, 0o600)

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
            ({"prompt": "A song", "lyrics_mode": "instrumental", "duration": 121}, "invalid_duration"),
            ({"prompt": "A song", "lyrics_mode": "instrumental", "steps": 31}, "invalid_steps"),
            ({"prompt": "A song", "lyrics_mode": "instrumental", "seed": -1}, "invalid_seed"),
        ):
            with self.subTest(payload=payload), self.assertRaisesRegex(ValueError, error):
                server._validate_music_generation(payload)

    def test_runs_music_inference_and_publishes_valid_wav(self):
        class FakeProcess:
            def __init__(self):
                self.stdout = io.StringIO("loaded Music3\nmusic generation complete\n")

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
                self.assertEqual(command[:5], [
                    str(root / "python"), "-u", "-m", "mlx_audio.music.generate", "--model",
                ][:5])
                self.assertEqual(command[5], str(root / "model"))
                lyrics_path = Path(command[command.index("--lyrics-file") + 1])
                observed_lyrics_path = lyrics_path
                self.assertEqual(lyrics_path.read_text(encoding="utf-8"), "[verse] Hello")
                self.assertEqual(command[command.index("--caption") + 1], "Gentle piano")
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
                        "duration": 15, "steps": 20, "seed": 7,
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
            self.assertEqual(server._public_job(job)["audio_url"], f"/api/jobs/{job_id}/audio")


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

    def test_merges_configured_text_model_ids_with_service_inventory(self):
        class FakeResponse:
            def __enter__(self):
                return self

            def __exit__(self, *args):
                return False

            def read(self):
                return json.dumps({"data": [{"id": "live-model"}]}).encode()

        settings = json.loads(json.dumps(server._DEFAULT_SETTINGS))
        settings["text"]["model_ids"] = ["configured-model"]
        with patch.object(server, "_settings_snapshot", return_value=settings), patch.object(
            server, "urlopen", return_value=FakeResponse()
        ):
            models = server._local_text_models()
        self.assertEqual({model["id"] for model in models}, {"configured-model", "live-model"})


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

        with patch.object(server, "urlopen", return_value=FakeResponse()):
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
                "--output", str(output),
            ]

            def start_process(actual_command, **kwargs):
                self.assertEqual(actual_command, command)
                output.parent.mkdir(parents=True, exist_ok=True)
                output.write_bytes(b"\x89PNG\r\n\x1a\nimage")
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
            self.assertIn("Image generation complete.", job["logs"])
            self.assertEqual(server._public_job(job)["image_url"], f"/api/jobs/{job_id}/image")


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
