import json
import io
import tempfile
import unittest
from collections import deque
from pathlib import Path
from unittest.mock import Mock, patch

from PIL import Image

from webapp import server


class ImageCanvasTests(unittest.TestCase):
    def test_scene_camera_override_is_explicit_and_follows_description(self):
        description = "Castle interior, looking upward at the ceiling."
        prompts = [server._scene_prompt(description, direction)
                   for _, direction in server.SCENE_VIEWS]
        for prompt, (_, direction) in zip(prompts, server.SCENE_VIEWS):
            self.assertIn(description, prompt)
            self.assertTrue(prompt.endswith(direction))
            self.assertIn("rather than to copy their camera position", prompt)
            self.assertIn("Plausibly infer surfaces and areas hidden", prompt)
        self.assertIn("Rotate the camera", prompts[1])
        self.assertIn("perpendicular to the entrance view", prompts[1])
        self.assertIn("vertically straight down at the floor", prompts[2])
        self.assertIn("remove the roof and ceiling", prompts[2])
        # Every view must enforce a minimum angular separation from the others.
        for prompt in prompts:
            self.assertIn("at least 30 degrees", prompt)
        self.assertIn("at least 90 degrees", prompts[1])
        self.assertIn("at least 90 degrees", prompts[2])

    def test_ordered_reference_ids_and_limits(self):
        ids = [str(server.uuid.uuid4()) for _ in range(6)]
        for model, limit in (("hidream", 3), ("flux2-klein-4b", 5)):
            settings = server._validate_hidream_generation({
                "prompt": "Portrait", "model": model, "reference_image_ids": ids[:limit],
            })
            self.assertEqual(settings["reference_image_ids"], ids[:limit])
            saved = server._history_generation("image", "Portrait", settings)
            self.assertEqual(saved["reference_image_ids"], ids[:limit])
            for invalid in (ids[:limit + 1], [ids[0], ids[0]], [""], ["../../image"], True, [1]):
                with self.subTest(model=model, invalid=invalid), self.assertRaises(ValueError):
                    server._validate_hidream_generation({
                        "prompt": "Portrait", "model": model, "reference_image_ids": invalid,
                    })
        with self.assertRaises(ValueError):
            server._validate_hidream_generation({
                "prompt": "Portrait", "model": "z-image-turbo", "reference_image_ids": ids[:1],
            })

    def test_scene_views_reuse_first_view_and_publish_ordered_history(self):
        for model in ("hidream", "flux2-klein-4b"):
            with self.subTest(model=model), tempfile.TemporaryDirectory() as temp:
                settings = server._validate_hidream_generation({
                    "prompt": "A stone courtyard with a fountain", "model": model,
                    "image_preset": "scene_views", "quality": "preview",
                })
                self.assertEqual(settings["candidate_count"], 3)
                key = str(server.uuid.uuid4())
                output = Path(temp) / "image" / f"hidream-{key}.png"
                job = {"id": key, "kind": "image", "prompt": settings["prompt"], "name": "", "created_at": 1,
                       "status": "queued", "cancel_requested": False, "logs": deque(maxlen=100), "process": None}
                commands = []
                def spawn(command, *_args, **_kwargs):
                    commands.append(command)
                    destination = Path(command[command.index("--output") + 1])
                    Image.new("RGB", (512, 512), ("red", "green", "blue")[len(commands) - 1]).save(destination)
                    return Mock(stdout=io.StringIO("done"), wait=Mock(return_value=0), poll=Mock(return_value=0))
                ready = {"model_ready": True, "runtime_ready": True}
                with (
                    patch.object(server, "OUTPUT_ROOT", Path(temp)),
                    patch.object(server, "_jobs", {key: job}), patch.object(server, "_active_job_id", key),
                    patch.object(server, "_settings_snapshot", return_value={"image": {"model_path": "fixture"}}),
                    patch.object(server, "_hidream_status", return_value=ready),
                    patch.object(server, "_local_model_status", return_value=ready),
                    patch.object(server, "_local_model_path", return_value=Path("fixture")),
                    patch.object(server, "_require_enabled_model"),
                    patch.object(server.subprocess, "Popen", side_effect=spawn),
                    patch.object(server, "LocalInferenceProcess", side_effect=spawn),
                ):
                    server._run_hidream_job(key, settings, output)
                    self.assertEqual(job["status"], "completed", job.get("error"))
                    saved = server._history_items()[0]
                    self.assertEqual(saved["generation"]["image_preset"], "scene_views")
                    self.assertEqual(saved["image_views"], ["scene_front", "scene_side", "scene_overview"])
                flag = "--ref-images" if model == "hidream" else "--reference-image"
                self.assertNotIn(flag, commands[0])
                for command in commands[1:]:
                    self.assertEqual(command[command.index(flag) + 1], str(output))
                for command, (_, direction) in zip(commands, server.SCENE_VIEWS):
                    self.assertIn(direction, command[command.index("--prompt") + 1])
                self.assertEqual(len(server.workflows.read_reference_images(Path(temp), key)), 3)
        with self.assertRaises(ValueError):
            server._validate_hidream_generation({
                "prompt": "Courtyard", "model": "z-image-turbo", "image_preset": "scene_views",
            })
        with self.assertRaises(ValueError):
            server._validate_hidream_generation({
                "prompt": "Courtyard", "image_preset": "scene_views",
                "reference_image_ids": [str(server.uuid.uuid4()) for _ in range(3)],
            })

    def test_reference_staging_forwarding_and_cleanup(self):
        for model in ("hidream", "flux2-klein-4b"):
            for outcome in ("completed", "failed", "cancelled"):
                with self.subTest(model=model, outcome=outcome), tempfile.TemporaryDirectory() as temp:
                    ids = [str(server.uuid.uuid4()) for _ in range(2)]
                    settings = server._validate_hidream_generation({
                        "prompt": "Portrait", "model": model, "quality": "preview",
                        "reference_image_ids": ids,
                    })
                    key = str(server.uuid.uuid4())
                    output = Path(temp) / "image" / f"hidream-{key}.png"
                    job = {"id": key, "kind": "image", "prompt": "Portrait", "name": "", "created_at": 1,
                           "status": "queued", "cancel_requested": outcome == "cancelled",
                           "logs": deque(maxlen=100), "process": None}
                    images = []
                    for color in ("red", "blue"):
                        buffer = io.BytesIO()
                        Image.new("RGB", (64, 64), color).save(buffer, format="PNG")
                        images.append(buffer.getvalue())
                    staged = []
                    def spawn(command, *_args, **_kwargs):
                        if model == "hidream":
                            paths = command[command.index("--ref-images") + 1:]
                        else:
                            paths = [command[i + 1] for i, arg in enumerate(command) if arg == "--reference-image"]
                        staged.extend(Path(path) for path in paths)
                        self.assertEqual([path.read_bytes() for path in staged], images)
                        self.assertTrue(all(path.stat().st_mode & 0o777 == 0o600 for path in staged))
                        Image.new("RGB", (512, 512)).save(output)
                        return Mock(stdout=io.StringIO("done"), wait=Mock(return_value=1 if outcome == "failed" else 0),
                                    poll=Mock(return_value=0))
                    ready = {"model_ready": True, "runtime_ready": True}
                    with (
                        patch.object(server, "OUTPUT_ROOT", Path(temp)),
                        patch.object(server, "_jobs", {key: job}), patch.object(server, "_active_job_id", key),
                        patch.object(server, "_settings_snapshot", return_value={"image": {"model_path": "fixture"}}),
                        patch.object(server, "_hidream_status", return_value=ready),
                        patch.object(server, "_local_model_status", return_value=ready),
                        patch.object(server, "_local_model_path", return_value=Path("fixture")),
                        patch.object(server, "_require_enabled_model"),
                        patch.object(server, "_stop_process"),
                        patch.object(server.workflows, "read_first_frame", side_effect=images) as read,
                        patch.object(server.subprocess, "Popen", side_effect=spawn),
                        patch.object(server, "LocalInferenceProcess", side_effect=spawn),
                    ):
                        server._run_hidream_job(key, settings, output)
                    self.assertEqual(job["status"], outcome, job.get("error"))
                    self.assertEqual([call.args[1] for call in read.call_args_list], ids)
                    self.assertTrue(staged)
                    self.assertTrue(all(not path.exists() for path in staged))
                    self.assertFalse(list(output.parent.glob("image-refs-*")))

    def test_explicit_canvas_must_match_selected_aspect(self):
        for model in ("hidream", *server.local_models.IMAGE_MODELS):
            expected = server._validate_hidream_generation({"prompt": "Film", "model": model,
                                                          "size": 1024, "aspect": "16:9"})
            valid = {"prompt": "Film", "model": model, "size": 1024, "aspect": "16:9",
                     "width": expected["width"], "height": expected["height"]}
            self.assertEqual(server._validate_hidream_generation(valid)["height"], 576)
            for bad in ({"width": 576}, {"height": 1024}, {"width": "1024"}, {"height": True}):
                with self.subTest(model=model, bad=bad), self.assertRaisesRegex(ValueError, "invalid_image_size"):
                    server._validate_hidream_generation({**valid, **bad})

    def test_hidream_worker_passes_non_square_canvas_and_checks_actual_png(self):
        for actual_size, expected_status in (((1024, 576), "completed"), ((1024, 1024), "failed")):
            with self.subTest(actual_size=actual_size), tempfile.TemporaryDirectory() as temp:
                settings = server._validate_hidream_generation({"prompt": "Film", "size": 1024, "aspect": "16:9"})
                key = str(server.uuid.uuid4())
                output = Path(temp) / "image" / f"hidream-{key}.png"
                job = {"id": key, "kind": "image", "prompt": "Film", "name": "", "created_at": 1,
                       "status": "queued", "cancel_requested": False, "logs": deque(maxlen=100), "process": None}
                commands = []
                def spawn(command, **_):
                    commands.append(command)
                    Image.new("RGB", actual_size).save(output)
                    return Mock(stdout=io.StringIO("generated\n"), wait=Mock(return_value=0), poll=Mock(return_value=0))
                with (
                    patch.object(server, "OUTPUT_ROOT", Path(temp)),
                    patch.object(server, "_jobs", {key: job}), patch.object(server, "_active_job_id", key),
                    patch.object(server, "_settings_snapshot", return_value={"image": {"model_path": "fixture"}}),
                    patch.object(server, "_hidream_status", return_value={"model_ready": True, "runtime_ready": True}),
                    patch.object(server.subprocess, "Popen", side_effect=spawn),
                ):
                    server._run_hidream_job(key, settings, output)
                    self.assertEqual(job["status"], expected_status)
                    command = commands[0]
                    self.assertEqual(command[command.index("--width") + 1], "1024")
                    self.assertEqual(command[command.index("--height") + 1], "576")
                    self.assertIn("--no-snap-resolution", command)
                    if expected_status == "completed":
                        with Image.open(output) as image:
                            self.assertEqual(image.size, (1024, 576))
                        saved = server._history_items()[0]["generation"]
                        self.assertEqual((saved["aspect"], saved["width"], saved["height"]), ("16:9", 1024, 576))
                    else:
                        self.assertIn("dimensions differ", job["error"])
                        self.assertFalse(output.exists())

    def test_all_models_sizes_and_video_aspects(self):
        for model in ("hidream", *server.local_models.IMAGE_MODELS):
            grid = 32 if model == "hidream" else 16
            for size in ((512, 768, 1024, 2048) if model == "hidream" else (512, 768, 1024)):
                for aspect in server.ASPECTS:
                    with self.subTest(model=model, size=size, aspect=aspect):
                        settings = server._validate_hidream_generation({
                            "prompt": "Film", "model": model, "size": size, "aspect": aspect,
                        })
                        self.assertEqual(max(settings["width"], settings["height"]), size)
                        self.assertEqual(settings["width"] % grid, 0)
                        self.assertEqual(settings["height"] % grid, 0)
                        if model in server.local_models.IMAGE_MODELS:
                            command = server.local_models.command(settings, Path("out.png"))
                            self.assertEqual(command[command.index("--width") + 1], str(settings["width"]))
                            self.assertEqual(command[command.index("--height") + 1], str(settings["height"]))

    def test_quality_presets_and_candidate_counts_are_model_aware(self):
        native = server._validate_hidream_generation({
            "prompt": "Film", "model": "hidream", "quality": "high",
            "size": 2048, "aspect": "16:9", "width": 2560, "height": 1440,
            "candidate_count": 4,
        })
        self.assertEqual((native["width"], native["height"]), (2560, 1440))
        self.assertTrue(native["native_resolution"])
        self.assertEqual(native["candidate_count"], 4)
        standard = server._validate_hidream_generation({
            "prompt": "Film", "model": "z-image-turbo", "quality": "standard",
            "size": 1024, "aspect": "9:16", "width": 576, "height": 1024,
            "candidate_count": 2,
        })
        self.assertEqual(standard["steps"], 9)
        self.assertEqual((standard["width"], standard["height"]), (576, 1024))
        for invalid in (0, 3, 5, True, "2"):
            with self.subTest(invalid=invalid), self.assertRaisesRegex(ValueError, "invalid_candidate_count"):
                server._validate_hidream_generation({
                    "prompt": "Film", "candidate_count": invalid,
                })

    def test_character_turnaround_requires_three_directional_images(self):
        settings = server._validate_hidream_generation({
            "prompt": "A woman in a red expedition coat",
            "model": "z-image-turbo",
            "quality": "standard",
            "size": 1024,
            "aspect": "1:1",
            "width": 1024,
            "height": 1024,
            "candidate_count": 3,
            "image_preset": "character_turnaround",
        })
        self.assertEqual(settings["candidate_count"], 3)
        self.assertEqual(settings["image_preset"], "character_turnaround")
        for invalid in (1, 2, 4):
            with self.subTest(invalid=invalid), self.assertRaisesRegex(ValueError, "invalid_candidate_count"):
                server._validate_hidream_generation({
                    "prompt": "Character", "candidate_count": invalid,
                    "image_preset": "character_turnaround",
                })
        prompts = [server._turnaround_prompt(settings["prompt"], view) for _, view in server.TURNAROUND_VIEWS]
        self.assertIn("facing straight toward the camera", prompts[0])
        self.assertIn("turned ninety degrees into a clean side profile", prompts[1])
        self.assertIn("back turned to the camera", prompts[2])
        self.assertTrue(all(
            prompt.startswith("One single person alone in the frame") and "same character identity" in prompt
            for prompt in prompts
        ))
        # These models run without classifier-free guidance, so any negated wording would be read
        # as a positive instruction and produce the collage the preset must avoid.
        for prompt in prompts:
            lowered = prompt.lower()
            for banned in ("collage", "contact sheet", "grid", "multiple views", "side-by-side",
                           "split panel", "no ", "not ", "avoid", "sheet", "reference photo"):
                self.assertNotIn(banned, lowered)
        for prompt, (view, _) in zip(prompts, server.TURNAROUND_VIEWS):
            others = [other for other, _ in server.TURNAROUND_VIEWS if other != view]
            directive = prompt.split("\n", 1)[0]
            with self.subTest(view=view):
                self.assertFalse(any(other in directive.lower() for other in others))

    def test_character_turnaround_removes_conflicting_multi_view_directives(self):
        cases = {
            "一位垂着面纱的年轻女侦探。分别生成人物三视图： 正脸，侧面，背后。": "一位垂着面纱的年轻女侦探。",
            "赛博朋克女战士，银色短发。生成正面、侧面和背面三张图。": "赛博朋克女战士，银色短发。",
            "A knight in gold armor. Show a turnaround sheet.": "A knight in gold armor.",
            "A woman in a red expedition coat": "A woman in a red expedition coat",
        }
        for description, expected in cases.items():
            with self.subTest(description=description):
                self.assertEqual(server._turnaround_character_description(description), expected)
        only_directive = server._turnaround_character_description("Create three views of a knight")
        self.assertIn("knight", only_directive)
        self.assertNotIn("three views", only_directive)
        for description in cases:
            prompt = server._turnaround_prompt(description, server.TURNAROUND_VIEWS[0][1])
            with self.subTest(prompt=description):
                self.assertNotIn("分别生成", prompt)
                self.assertNotIn("三视图", prompt)
                self.assertNotIn("turnaround sheet", prompt)

    def test_hidream_candidates_use_consecutive_seeds_and_persist_together(self):
        with tempfile.TemporaryDirectory() as temp:
            key = str(server.uuid.uuid4())
            output = Path(temp) / "image" / f"hidream-{key}.png"
            settings = server._validate_hidream_generation({
                "prompt": "Film", "quality": "high", "size": 2048,
                "aspect": "16:9", "width": 2560, "height": 1440,
                "seed": 2**32 - 1, "candidate_count": 2,
            })
            job = {"id": key, "kind": "image", "prompt": "Film", "name": "", "created_at": 1,
                   "status": "queued", "cancel_requested": False, "logs": deque(maxlen=100), "process": None}
            commands = []

            def spawn(command, **_):
                commands.append(command)
                candidate = Path(command[command.index("--output") + 1])
                Image.new("RGB", (2560, 1440)).save(candidate)
                return Mock(stdout=io.StringIO("generated\n"), wait=Mock(return_value=0), poll=Mock(return_value=0))

            with (
                patch.object(server, "OUTPUT_ROOT", Path(temp)),
                patch.object(server, "_jobs", {key: job}), patch.object(server, "_active_job_id", key),
                patch.object(server, "_settings_snapshot", return_value={"image": {"model_path": "fixture"}}),
                patch.object(server, "_hidream_status", return_value={"model_ready": True, "runtime_ready": True}),
                patch.object(server.subprocess, "Popen", side_effect=spawn),
            ):
                server._run_hidream_job(key, settings, output)
                history = server._history_items()[0]

            self.assertEqual([command[command.index("--seed") + 1] for command in commands],
                             [str(2**32 - 1), "0"])
            self.assertTrue(all("--no-snap-resolution" not in command for command in commands))
            self.assertEqual(len(job["image_paths"]), 2)
            self.assertEqual(len(history["image_urls"]), 2)
            self.assertEqual(history["generation"]["candidate_count"], 2)
            self.assertEqual(server._public_job(job)["image_urls"],
                             [f"/api/jobs/{key}/image/1", f"/api/jobs/{key}/image/2"])

    def test_history_preserves_hidream_non_square_size(self):
        with tempfile.TemporaryDirectory() as temp, patch.object(server, "OUTPUT_ROOT", Path(temp)):
            item_id = str(server.uuid.uuid4())
            image = Path(temp) / f"hidream-{item_id}.png"
            image.write_bytes(b"media")
            settings = server._validate_hidream_generation({
                "prompt": "Film", "size": 768, "aspect": "9:16",
            })
            server._persist_history({"id": item_id, "kind": "image", "created_at": 1,
                                     "prompt": "Film"}, [image], settings)
            restored = server._history_items()[0]["generation"]
            self.assertEqual(restored["size"], 768)
            self.assertEqual(restored["aspect"], "9:16")
            self.assertEqual(restored["width"], settings["width"])

    def test_defaults_and_invalid_inputs(self):
        self.assertEqual(server._validate_hidream_generation({"prompt": "Film"})["width"], 2048)
        for values in ({"size": True}, {"size": 2048, "model": "z-image-turbo"},
                       {"size": 800}, {"aspect": []}, {"aspect": "2:1"},
                       {"quality": "ultra"}, {"quality": True}):
            with self.subTest(values=values), self.assertRaises(ValueError):
                server._validate_hidream_generation({"prompt": "Film", **values})
