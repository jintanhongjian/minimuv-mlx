from __future__ import annotations

import json
import os
import subprocess
import tempfile
import time
import unittest
import uuid
import wave
from collections import deque
from pathlib import Path
from unittest.mock import patch

from webapp import fast_h3, local_models, model_downloads, server, workflows
from test_workflows import make_payload


class FastH3Tests(unittest.TestCase):
    def test_registry_validation_geometry_history_and_recipe(self):
        self.assertNotIn(fast_h3.MODEL_ID, local_models.VIDEO_MODELS)
        self.assertIn(fast_h3.MODEL_ID, local_models.LOCAL_VIDEO_MODELS)
        self.assertIn(fast_h3.MODEL_ID, server._DEFAULT_SETTINGS["models"])
        for quality, edge in local_models.VIDEO_QUALITIES.items():
            for aspect in server.ASPECTS:
                with self.subTest(quality=quality, aspect=aspect):
                    settings = server._validate_generation({
                        "model": fast_h3.MODEL_ID, "prompt": "Film",
                        "quality": quality, "aspect": aspect,
                    })
                    self.assertEqual(settings["steps"], 4)
                    self.assertEqual(settings["num_frames"], 124)
                    self.assertEqual(max(settings["width"], settings["height"]), edge)
                    self.assertEqual(settings["width"] % 32, 0)
                    self.assertEqual(settings["height"] % 32, 0)
                    self.assertEqual(set(server._visual_token_stages("video", settings)), {"output"})
                    record = server._history_generation("video", "Film", settings)
                    self.assertEqual(record["model"], fast_h3.MODEL_ID)
                    self.assertEqual(record["steps"], 4)
                    settings["model_path"] = "/models/fast"
                    args = local_models.command(settings, Path("out.mp4"))
                    self.assertEqual(args[args.index("--steps") + 1], "5")
                    self.assertNotIn("--h3-frame", args)
                    self.assertIn("--progress-json", args)
                    self.assertNotIn("--gemma", args)
                    self.assertNotIn("--h3-window-frames", args)
                    with self.assertRaisesRegex(ValueError, "fasth3_conditioning_unsupported"):
                        local_models.command(settings, Path("out.mp4"), Path("first.png"))
        for steps, turbo in ((5, True), (8, True), (16, False)):
            with self.assertRaisesRegex(ValueError, "invalid_fasth3_steps"):
                server._validate_generation({"model": fast_h3.MODEL_ID, "prompt": "Film",
                                             "steps": steps, "turbo": turbo})

    def test_workflow_create_edit_restore_preserves_model_and_settings(self):
        payload = make_payload()
        payload.update(model=fast_h3.MODEL_ID, shot_mode="independent", quality="preview")
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            manifest = workflows.create_workflow(root, payload)
            payload["shots"][0]["prompt"] = "Revised opening"
            edited = workflows.update_workflow(root, manifest["id"], payload)
            edited["status"] = "failed"
            workflows._write_manifest(root, edited)
            restored = workflows.restore_workflow(root, edited["id"])
            self.assertEqual(restored["model"], fast_h3.MODEL_ID)
            self.assertEqual(restored["shots"][0]["steps"], 4)
            self.assertEqual(restored["quality"], "preview")
            payload["shots"][0]["steps"] = 8
            with self.assertRaisesRegex(ValueError, "invalid_fasth3_steps"):
                workflows.update_workflow(root, edited["id"], payload)

    def test_package_validation_does_not_require_gemma_or_accept_legacy_base(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            for name in fast_h3.FILES:
                (root / name).write_bytes(b"package file")
            config = {"model_type": "minimax_h3", "partition": "fl2va",
                      "quantization": {"bits": 8, "group_size": 64, "mode": "affine"}}
            recipe = {"id": "video-minimax-h3-fasth3-vsa-datafree-mlx",
                      "defaults": {"cfg": 1, "sigma_shift": 12, "steps": 5}}
            (root / "config.json").write_text(json.dumps(config))
            (root / "mererun_model.json").write_text(json.dumps(recipe))
            result = local_models.status(fast_h3.MODEL_ID, root, root / "missing-gemma")
            self.assertTrue(result["model_ready"])
            self.assertFalse(result["download_catalog"])
            config["quantization"]["bits"] = 4
            (root / "config.json").write_text(json.dumps(config))
            self.assertFalse(local_models.status(fast_h3.MODEL_ID, root)["model_ready"])
            (root / "config.json").write_text("[null, null, null]")
            self.assertIn("Not a supported", fast_h3.status(root)["model_error"])
            (root / fast_h3.ADAPTER).unlink()
            self.assertIn("missing or empty", fast_h3.status(root)["model_error"])

    def test_progress_matches_actual_runtime_events(self):
        progress = None
        for step in range(5):
            progress = server._local_video_progress(
                f'{{"event":"progress","stage":"denoising","step":{step},"total_steps":4}}',
                progress,
            )
            self.assertEqual(progress["step"], step)
            self.assertEqual(progress["total"], 4)
        decoding = server._local_video_progress(
            '{"event":"progress","stage":"decoding-video","step":4,"total_steps":4}', progress)
        self.assertIsNone(decoding["step"])
        with self.assertRaisesRegex(RuntimeError, "Invalid FastH3"):
            server._local_video_progress(
                '{"event":"progress","stage":"denoising","step":8,"total_steps":4}', None)

    def test_routes_to_owned_local_process_without_loading_mlx_serve(self):
        settings = server._validate_generation({"model": fast_h3.MODEL_ID, "prompt": "Film"})
        with patch.object(server, "_run_local_job") as run, patch.object(server, "_load_h3_model") as load:
            server._run_job("job", settings, Path("/models/fast"), Path("out.mp4"))
        run.assert_called_once_with("job", settings, Path("out.mp4"))
        load.assert_not_called()

    def test_environment_keeps_runtime_cache_project_local(self):
        env = local_models.environment(fast_h3.MODEL_ID)
        self.assertEqual(env["MERERUN_HUB_CACHE"], str(fast_h3.RUNTIME_ROOT / ".cache"))
        self.assertEqual(env["MERERUN_MODELS_DIR"], str(fast_h3.RUNTIME_ROOT / ".models"))

    def test_settings_and_download_api_handle_externally_managed_package(self):
        progress = model_downloads.progress(fast_h3.MODEL_ID, Path("/model"), Path("/missing-gemma"))
        self.assertEqual(progress["download_state"], "manual")
        self.assertFalse(progress["download_catalog"])
        for action in (model_downloads.start, model_downloads.pause):
            with self.assertRaisesRegex(ValueError, "externally managed"):
                action(fast_h3.MODEL_ID, Path("/model"), Path("/missing-gemma"))

    @unittest.skipUnless(os.environ.get("RUN_FASTH3_SMOKE") == "1", "Opt-in real FastH3 inference")
    def test_real_five_second_generation_and_history(self):
        settings = server._validate_generation({
            "model": fast_h3.MODEL_ID, "prompt": "Calm clouds move slowly across a blue sky, fixed camera",
            "quality": "preview", "seed": 42,
        })
        job_id = str(uuid.uuid4())
        job = {"id": job_id, "kind": "video", "status": "queued", "prompt": settings["prompt"],
               "created_at": time.time(), "logs": deque(maxlen=100), "cancel_requested": False}
        with tempfile.TemporaryDirectory() as temp, patch.object(
            server, "OUTPUT_ROOT", Path(temp)
        ), patch.dict(server._jobs, {job_id: job}, clear=True), patch.object(
            server, "_settings_snapshot", return_value=server._DEFAULT_SETTINGS
        ), patch.object(server, "_active_job_id", job_id):
            output = Path(temp) / "video" / f"h3-{job_id}.mp4"
            server._run_job(job_id, settings, local_models.model_path(fast_h3.MODEL_ID), output)
            self.assertEqual(job["status"], "completed", list(job["logs"]))
            self.assertTrue(output.is_file())
            with wave.open(str(output.with_suffix(".wav"))) as audio:
                self.assertEqual((audio.getframerate(), audio.getnchannels()), (32000, 2))
            history = server._history_items()
            self.assertEqual(len(history), 1)
            self.assertEqual(history[0]["generation"]["model"], fast_h3.MODEL_ID)
            self.assertEqual(history[0]["generation"]["duration"], 5)
            self.assertEqual(history[0]["generation"]["steps"], 4)
            probe = subprocess.run(
                ["ffprobe", "-v", "error", "-select_streams", "v:0",
                 "-show_entries", "stream=width,height,nb_frames,r_frame_rate",
                 "-of", "json", str(output)],
                capture_output=True, text=True, timeout=30, check=True,
            )
            self.assertEqual(json.loads(probe.stdout)["streams"][0], {
                "width": 512, "height": 288, "nb_frames": "124", "r_frame_rate": "24/1",
            })
            self.assertTrue(history[0]["audio_url"])
            self.assertFalse(history[0]["first_frame_url"])
            self.assertIn("Decoding audio", job["progress"]["stage"])

    def test_unsupported_conditioning_is_rejected_without_dropping_user_images(self):
        frame = str(uuid.uuid4())
        with self.assertRaisesRegex(ValueError, "fasth3_conditioning_unsupported"):
            server._validate_generation({"model": fast_h3.MODEL_ID, "prompt": "Film", "first_frame_id": frame})
        payload = make_payload()
        payload["model"] = fast_h3.MODEL_ID
        payload["shot_mode"] = "continuous"
        with self.assertRaisesRegex(ValueError, "fasth3_conditioning_unsupported"):
            workflows._validate_payload(payload)
        payload["shot_mode"] = "independent"
        payload["shots"][0]["first_frame_id"] = frame
        with self.assertRaisesRegex(ValueError, "fasth3_conditioning_unsupported"):
            workflows._validate_payload(payload)
        self.assertEqual(payload["shots"][0]["first_frame_id"], frame)


if __name__ == "__main__":
    unittest.main()
