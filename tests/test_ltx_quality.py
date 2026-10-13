from __future__ import annotations

import json
import shutil
import subprocess
import tempfile
import unittest
import uuid
from pathlib import Path
from unittest.mock import patch

from webapp import local_models, server, workflows
from test_workflows import make_payload


class LtxQualityTests(unittest.TestCase):
    def payload(self, quality="standard"):
        return {"prompt": "A quiet river", "model": "ltx-2.3-distilled-q4",
                "quality": quality, "steps": 8, "turbo": True}

    def test_all_models_qualities_aspects_and_runtime_arguments(self):
        for model in local_models.VIDEO_MODELS:
            for quality, edge in local_models.VIDEO_QUALITIES.items():
                for aspect in server.ASPECTS:
                    with self.subTest(model=model, quality=quality, aspect=aspect):
                        settings = server._validate_generation({
                            **self.payload(quality), "model": model, "aspect": aspect,
                        })
                        self.assertEqual(settings["quality"], quality)
                        self.assertEqual(max(settings["width"], settings["height"]), edge)
                        self.assertEqual(settings["width"] % 64, 0)
                        self.assertEqual(settings["height"] % 64, 0)
                        self.assertEqual(settings["num_frames"] % 8, 1)
                        args = local_models.command(settings, Path("output.mp4"), Path("frame.png"))
                        recipe = (("--steps", "8"), ("--cfg-scale", "3.0")) if model == "ltx-2.3-dev-q4" else (
                            ("--stage1-steps", "8"), ("--stage2-steps", "3"),
                        )
                        for key, expected in (("--width", str(settings["width"])),
                                              ("--height", str(settings["height"])),
                                              *recipe,
                                              ("--frame-rate", "24")):
                            self.assertEqual(args[args.index(key) + 1], expected)
                        self.assertIn("--one-stage" if model == "ltx-2.3-dev-q4" else "--distilled", args)
                        self.assertIn("--low-ram", args)
                        self.assertIn("--image", args)

    def test_default_and_invalid_quality_and_history(self):
        payload = self.payload()
        payload.pop("quality")
        self.assertEqual(server._validate_generation(payload)["quality"], "standard")
        for invalid in ("ultra", 1024, True, None, [], {}):
            with self.subTest(invalid=invalid), self.assertRaisesRegex(ValueError, "invalid_video_quality"):
                server._validate_generation(self.payload(invalid))
        for quality in local_models.VIDEO_QUALITIES:
            record = server._history_generation("video", "A quiet river", self.payload(quality))
            self.assertEqual(record["quality"], quality)
        self.assertEqual(server._validate_generation({"prompt": "A quiet river"})["quality"], "standard")

    def test_workflow_quality_persistence_update_restore_and_legacy(self):
        payload = make_payload()
        payload["model"] = "ltx-2.3-distilled-q8"
        payload["shots"][0]["steps"] = 8
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            manifest = workflows.create_workflow(root, payload)
            self.assertEqual(manifest["quality"], "standard")
            payload["quality"] = "high"
            manifest = workflows.update_workflow(root, manifest["id"], payload)
            self.assertEqual(workflows.get_workflow(root, manifest["id"])["quality"], "high")
            manifest["status"] = "failed"
            workflows._write_manifest(root, manifest)
            restored = workflows.restore_workflow(root, manifest["id"])
            self.assertEqual(restored["quality"], "high")
            manifest.pop("quality")
            workflows._write_manifest(root, manifest)
            legacy = workflows.restore_workflow(root, manifest["id"])
            self.assertEqual(legacy["quality"], "preview")
            payload["quality"] = "invalid"
            with self.assertRaisesRegex(ValueError, "invalid_video_quality"):
                workflows.update_workflow(root, restored["id"], payload)
            payload["model"] = "h3"
            payload["quality"] = "high"
            payload["shots"][0]["steps"] = 4
            changed = workflows.update_workflow(root, restored["id"], payload)
            self.assertEqual(changed["quality"], "high")

    def test_h3_model_adapted_canvas_and_validation(self):
        for quality, expected in (("preview", (896, 512)), ("standard", (1344, 768)),
                                  ("high", (1792, 1024))):
            settings = server._validate_generation({"prompt": "Film", "quality": quality})
            self.assertEqual((settings["width"], settings["height"]), expected)
            self.assertEqual(settings["num_frames"], 124)
            self.assertEqual(server._generation_request("h3", settings)["width"], expected[0])
        for invalid in (None, True, "ultra"):
            with self.assertRaisesRegex(ValueError, "invalid_video_quality"):
                server._validate_generation({"prompt": "Film", "quality": invalid})

    def test_legacy_disk_history_without_quality_remains_readable(self):
        with tempfile.TemporaryDirectory() as temp, patch.object(server, "OUTPUT_ROOT", Path(temp)):
            for model, expected in (("h3", "standard"), ("ltx-2.3-distilled-q4", "preview")):
                item_id = str(uuid.uuid4())
                path = Path(temp) / f"h3-{item_id}.mp4"
                path.write_bytes(b"media")
                settings = server._validate_generation({
                    "model": model, "prompt": "Film", "steps": 4 if model == "h3" else 8,
                })
                server._persist_history({"id": item_id, "kind": "video", "prompt": "Film",
                                         "created_at": 1}, [path], settings)
                metadata = Path(temp) / "video" / f"{item_id}.json"
                data = json.loads(metadata.read_text())
                data["generation"].pop("quality")
                metadata.write_text(json.dumps(data))
                restored = next(item for item in server._history_items() if item["id"] == item_id)
                self.assertEqual(restored["generation"]["quality"], expected)

    @unittest.skipUnless(shutil.which("ffmpeg") and shutil.which("ffprobe"), "FFmpeg required")
    def test_long_video_final_export_preserves_each_quality(self):
        ffmpeg, ffprobe = shutil.which("ffmpeg"), shutil.which("ffprobe")
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            source = root / "source.mp4"
            subprocess.run([ffmpeg, "-nostdin", "-y", "-loglevel", "error",
                            "-f", "lavfi", "-i", "color=c=blue:s=160x90:r=24:d=5",
                            "-c:v", "libx264", "-preset", "ultrafast", str(source)],
                           check=True, capture_output=True, timeout=30)
            for model, quality in [(model, quality) for model in ("h3", "ltx-2.3-distilled-q4")
                                   for quality in local_models.VIDEO_QUALITIES]:
                payload = make_payload()
                payload.update(model=model, quality=quality)
                payload["shots"][0]["steps"] = 4 if model == "h3" else 8
                manifest = workflows.create_workflow(root, payload)
                result = workflows.assemble_workflow(root, manifest, [source], [], ffmpeg, ffprobe)
                probe = subprocess.run([ffprobe, "-v", "error", "-select_streams", "v:0",
                                        "-show_entries", "stream=width,height", "-of", "json", str(result)],
                                       check=True, capture_output=True, text=True, timeout=30)
                stream = json.loads(probe.stdout)["streams"][0]
                self.assertEqual((stream["width"], stream["height"]),
                                 local_models.video_canvas((16, 9), quality, model))
