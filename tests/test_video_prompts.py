from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from webapp import generation_limits, local_models, server, workflows
from test_workflows import make_payload


class VideoPromptTests(unittest.TestCase):
    def test_native_negative_prompt_uses_dev_cfg_and_explicit_dev_weights(self):
        settings = server._validate_generation({
            "model": "ltx-2.3-dev-q4", "prompt": "A quiet river",
            "negative_prompt": "字幕、模糊、变形", "turbo": False,
        })
        self.assertEqual(settings["steps"], 30)
        args = local_models.command(settings, Path("output.mp4"))
        self.assertIn("--one-stage", args)
        self.assertNotIn("--distilled", args)
        self.assertEqual(args[args.index("--negative-prompt") + 1], "字幕、模糊、变形")
        self.assertEqual(args[args.index("--dev-transformer") + 1], "transformer-dev.safetensors")
        self.assertEqual(args[args.index("--cfg-scale") + 1], "3.0")
        self.assertEqual(settings["prompt"], "A quiet river")
        empty = local_models.command({**settings, "negative_prompt": ""}, Path("output.mp4"))
        self.assertEqual(empty[empty.index("--negative-prompt") + 1], "")

    def test_unsupported_models_reject_nonempty_native_negative_prompts(self):
        for model in generation_limits.VIDEO_DURATIONS:
            if model == "ltx-2.3-dev-q4":
                continue
            with self.subTest(model=model), self.assertRaisesRegex(ValueError, "negative_prompt_unsupported"):
                server._validate_generation({"model": model, "prompt": "River", "negative_prompt": "Blur"})
        for value in (None, 42, True, [], {}, "x" * 4001):
            with self.subTest(value=type(value).__name__), self.assertRaisesRegex(ValueError, "invalid_negative_prompt"):
                generation_limits.validate_negative_prompt(value)

    def test_workflow_negative_prompt_overrides_persist_and_invalidate_video(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            payload = make_payload()
            payload.update(model="ltx-2.3-dev-q4", negative_prompt="Blur")
            payload["shots"][0].update(steps=30, negative_prompt=None)
            manifest = workflows.create_workflow(root, payload)
            self.assertEqual(manifest["negative_prompt"], "Blur")
            self.assertIsNone(manifest["shots"][0]["negative_prompt"])
            manifest["shots"][0].update(status="completed", video_path="old.mp4")
            workflows._write_manifest(root, manifest)
            payload["shots"][0].update(id=manifest["shots"][0]["id"], negative_prompt="Text")
            changed = workflows.update_workflow(root, manifest["id"], payload)
            self.assertEqual(changed["shots"][0]["negative_prompt"], "Text")
            self.assertEqual(changed["shots"][0]["status"], "pending")
            self.assertIsNone(changed["shots"][0]["video_path"])
            changed["status"] = "failed"
            workflows._write_manifest(root, changed)
            restored = workflows.restore_workflow(root, changed["id"])
            self.assertEqual(restored["negative_prompt"], "Blur")
            self.assertEqual(restored["shots"][0]["negative_prompt"], "Text")
            history = server._history_generation("video", "River", {
                "model": "ltx-2.3-dev-q4", "negative_prompt": "Text", "steps": 30,
            })
            self.assertEqual(history["negative_prompt"], "Text")
