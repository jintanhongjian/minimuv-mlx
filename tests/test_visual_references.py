from __future__ import annotations

import json
import base64
import io
import tempfile
import unittest
import uuid
from pathlib import Path
from unittest.mock import Mock, patch

from PIL import Image

from webapp import local_models, server, visual_references, workflows
from test_workflows import make_payload


class VisualReferenceTests(unittest.TestCase):
    def test_scene_group_is_three_ordered_scene_references_and_survives_source_deletion(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            history = server.output_storage.history_directory(root, "image")
            history.mkdir(parents=True)
            image_id = str(uuid.uuid4())
            paths = []
            for index, color in enumerate(("red", "green", "blue"), 1):
                path = history / f"hidream-{image_id}{'' if index == 1 else f'-{index}'}.png"
                Image.new("RGB", (32, 32), color).save(path)
                paths.append(path)
            metadata = history / f"{image_id}.json"
            metadata.write_text(json.dumps({"generation": {"image_preset": "scene_views"}}))
            scene_id = str(uuid.uuid4())
            references = visual_references.library({
                "characters": [], "scenes": [{"id": scene_id, "name": "Courtyard",
                    "description": "Stone fountain", "image_id": image_id}],
                "default_scene": scene_id, "generate_frames": True,
            })
            prompt = visual_references.prompt("An empty courtyard", references,
                visual_references.selection(None, references), frame=True, image_counts={image_id: 3})
            data = json.loads(prompt.splitlines()[1])["visual_references"][0]
            self.assertEqual(data["reference_images"], [1, 2, 3])
            self.assertEqual(data["reference_views"], ["front_wide", "side_wide", "overhead_layout"])
            payload = make_payload()
            payload["visual_references"] = references
            manifest = workflows.create_workflow(root, payload)
            snapshots = manifest["reference_paths"][image_id]
            self.assertEqual([Path(path).read_bytes() for path in snapshots], [path.read_bytes() for path in paths])
            for path in [metadata, *paths]:
                path.unlink()
            self.assertEqual(workflows.read_reference_images(root, image_id, [Path(p) for p in snapshots]),
                             [Path(p).read_bytes() for p in snapshots])

    def prepare(self, root):
        directory = root / "first-frames"
        directory.mkdir()
        rows = []
        for name, color in (("Alice", "red"), ("Bob", "blue"), ("Garden", "green")):
            image_id = str(uuid.uuid4())
            Image.new("RGB", (32, 32), color).save(directory / f"{image_id}.png")
            rows.append({"id": str(uuid.uuid4()), "name": name,
                         "description": f"{name} appearance", "image_id": image_id})
        return {"characters": rows[:2], "scenes": rows[2:], "default_scene": rows[2]["id"],
                "generate_frames": True}

    def test_selection_is_strict_and_prompt_preserves_reference_order(self):
        with tempfile.TemporaryDirectory() as directory:
            references = visual_references.library(self.prepare(Path(directory)))
            selected = visual_references.selection(None, references)
            prompt = visual_references.prompt("花园里重逢", references, selected, frame=True)
            data = json.loads(prompt.splitlines()[1])
            self.assertEqual([row["reference_image"] for row in data["visual_references"]], [1, 2, 3])
            self.assertEqual([row["name"] for row in data["visual_references"]], ["Alice", "Bob", "Garden"])
            self.assertTrue(prompt.startswith("花园里重逢\n"))
            with self.assertRaisesRegex(ValueError, "visual_character_not_found"):
                visual_references.selection({"characters": [str(uuid.uuid4())]}, references)
            with self.assertRaisesRegex(ValueError, "visual_scene_not_found"):
                visual_references.selection({"scene": str(uuid.uuid4())}, references)
            with self.assertRaisesRegex(ValueError, "visual_prompt_too_long"):
                visual_references.prompt("x" * 4000, references, selected)

    def test_turnaround_images_are_one_ordered_character_reference(self):
        references = visual_references.library({
            "characters": [{
                "id": str(uuid.uuid4()), "name": "Alice", "description": "Red coat",
                "image_id": str(uuid.uuid4()),
            }],
            "scenes": [], "default_scene": "", "generate_frames": True,
        })
        selected = visual_references.selection(None, references)
        image_id = references["characters"][0]["image_id"]
        prompt = visual_references.prompt(
            "Alice walks into frame", references, selected, frame=True,
            image_counts={image_id: 3},
        )
        data = json.loads(prompt.splitlines()[1])["visual_references"][0]
        self.assertEqual(data["reference_images"], [1, 2, 3])
        self.assertEqual(data["reference_views"], ["front", "side", "back"])
        two = visual_references.library({
            "characters": [
                {"id": str(uuid.uuid4()), "name": name, "description": "", "image_id": str(uuid.uuid4())}
                for name in ("A", "B")
            ],
            "scenes": [], "default_scene": "", "generate_frames": True,
        })
        with self.assertRaisesRegex(ValueError, "too_many_visual_reference_images"):
            visual_references.prompt(
                "Shot", two, visual_references.selection(None, two), frame=True,
                image_counts={row["image_id"]: 3 for row in two["characters"]},
            )

    def test_turnaround_history_is_snapshotted_as_three_private_images(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            history = server.output_storage.history_directory(root, "image")
            history.mkdir(parents=True)
            image_id = str(uuid.uuid4())
            expected = []
            for index, color in enumerate(("red", "green", "blue"), 1):
                path = history / f"hidream-{image_id}{'' if index == 1 else f'-{index}'}.png"
                Image.new("RGB", (32, 32), color).save(path)
                expected.append(path.read_bytes())
            (history / f"{image_id}.json").write_text(json.dumps({
                "id": image_id, "kind": "image",
                "generation": {"image_preset": "character_turnaround"},
            }))
            self.assertEqual(workflows.read_reference_images(root, image_id), expected)
            payload = make_payload()
            payload["visual_references"] = {
                "characters": [{
                    "id": str(uuid.uuid4()), "name": "Alice",
                    "description": "Red coat", "image_id": image_id,
                }],
                "scenes": [], "default_scene": "", "generate_frames": True,
            }
            manifest = workflows.create_workflow(root, payload)
            snapshots = manifest["reference_paths"][image_id]
            self.assertEqual(len(snapshots), 3)
            self.assertEqual([Path(path).read_bytes() for path in snapshots], expected)

    def test_standalone_video_accepts_reference_composition_and_rejects_frame_conflict(self):
        image_id = str(uuid.uuid4())
        character_id = str(uuid.uuid4())
        references = {
            "characters": [{
                "id": character_id, "name": "Alice", "description": "Red coat", "image_id": image_id,
            }],
            "scenes": [], "default_scene": "", "generate_frames": True,
        }
        payload = {
            "prompt": "Alice walks into frame", "model": "ltx-2.3-dev-q4", "steps": 30,
            "visual_references": references,
            "visual": {"characters": [character_id], "scene": "", "frame_mode": "references"},
        }
        settings = server._validate_generation(payload)
        self.assertEqual(settings["visual"]["characters"], [character_id])
        with self.assertRaisesRegex(ValueError, "visual_reference_frame_conflict"):
            server._validate_generation({**payload, "first_frame_id": str(uuid.uuid4())})

    def test_standalone_video_composes_opening_frame_from_all_turnaround_views(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            encoded = []
            for color in ("red", "green", "blue"):
                buffer = io.BytesIO()
                Image.new("RGB", (32, 32), color).save(buffer, "PNG")
                encoded.append(base64.b64encode(buffer.getvalue()).decode("ascii"))
            job_id = str(uuid.uuid4())
            job = {
                "id": job_id, "status": "queued", "cancel_requested": False,
                "logs": [], "process": None,
            }
            commands = []

            def launch(command, _environment):
                commands.append(command)
                output = Path(command[command.index("--output") + 1])
                Image.new("RGB", (512, 320), "yellow").save(output)
                return Mock(
                    stdout=io.StringIO("generated\n"), wait=Mock(return_value=0),
                    poll=Mock(return_value=0),
                )

            settings = {
                "prompt": "Alice enters", "reference_frame_prompt": "Composed shot",
                "reference_image_data": encoded, "seed": 7, "width": 512, "height": 320,
            }
            with patch.object(server, "_jobs", {job_id: job}), \
                    patch.object(server, "_require_enabled_model"), \
                    patch.object(server, "_local_model_status", return_value={
                        "model_ready": True, "runtime_ready": True, "model_error": "", "runtime_error": "",
                    }), patch.object(server, "_local_model_path", return_value=root / "model"), \
                    patch.object(server, "LocalInferenceProcess", side_effect=launch), \
                    patch.object(server, "_stop_process"):
                result = server._compose_standalone_reference_frame(job_id, settings, root)
            self.assertEqual(commands[0].count("--reference-image"), 3)
            self.assertTrue(result["first_frame_image"])
            self.assertFalse(any(root.glob(".reference-*")))

    def test_reference_snapshots_restore_after_originals_are_removed(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            payload = make_payload()
            payload["visual_references"] = self.prepare(root)
            manifest = workflows.create_workflow(root, payload)
            self.assertEqual(len(manifest["reference_paths"]), 3)
            original_bytes = {key: Path(path).read_bytes() for key, path in manifest["reference_paths"].items()}
            for row in payload["visual_references"]["characters"] + payload["visual_references"]["scenes"]:
                (root / "first-frames" / f"{row['image_id']}.png").unlink()
            manifest["status"] = "failed"
            workflows._write_manifest(root, manifest)
            restored = workflows.restore_workflow(root, manifest["id"])
            self.assertEqual(restored["visual_references"], manifest["visual_references"])
            self.assertEqual({key: Path(path).read_bytes() for key, path in restored["reference_paths"].items()},
                             original_bytes)

    def test_multiple_reference_images_reach_the_frame_runner_and_video_condition(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            payload = make_payload()
            payload.update(model="ltx-2.3-dev-q4", visual_references=self.prepare(root))
            payload["shots"][0]["steps"] = 30
            manifest = workflows.create_workflow(root, payload)
            captured = []

            def run_image(job_id, settings, output):
                captured.append(settings)
                Image.new("RGB", (32, 32), "yellow").save(output)
                server._jobs[job_id].update(status="completed", image_path=str(output))
                server._active_job_id = None

            with patch.object(server, "OUTPUT_ROOT", root), patch.object(server, "_active_job_id", None), \
                    patch.dict(server._jobs, {}, clear=True), patch.object(server, "_run_local_job", run_image):
                frame = server._generate_reference_frame(
                    manifest, manifest["shots"][0], {"width": 512, "height": 320}, 0,
                )
            settings = captured[0]
            self.assertEqual(len(settings["reference_images"]), 3)
            command = local_models.command(settings, root / "frame.png")
            self.assertEqual(command.count("--reference-image"), 3)
            video_settings = server._validate_generation({
                "prompt": "花园里重逢", "model": "ltx-2.3-dev-q4", "steps": 30,
            })
            video = local_models.command(video_settings, root / "video.mp4", frame)
            self.assertEqual(video[video.index("--image") + 1], str(frame))
            self.assertTrue(frame.is_file())
            with self.assertRaisesRegex(ValueError, "image_reference_conditioning_unsupported"):
                local_models.command({**settings, "model": "z-image-turbo"}, root / "bad.png")
