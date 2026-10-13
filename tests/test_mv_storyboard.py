from __future__ import annotations

import array
import base64
import copy
import json
import math
import shutil
import subprocess
import tempfile
import threading
import unittest
import uuid
import wave
from pathlib import Path
from unittest.mock import patch
from PIL import Image
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from webapp import mv_analysis, mv_projects, mv_storyboard, prompt_settings, server, skill_conversion, workflows
from test_workflows import fake_boundary_frame


class MVStoryboardTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name)
        self.path = self.root / "song.wav"
        samples = array.array("h", (
            int(8000 * math.sin(2 * math.pi * (220 if n < 48000 else 440) * n / 8000))
            for n in range(96000)
        ))
        with wave.open(str(self.path), "wb") as audio:
            audio.setnchannels(1)
            audio.setsampwidth(2)
            audio.setframerate(8000)
            audio.writeframes(samples.tobytes())
        self.music_id = str(uuid.uuid4())
        self.resolver = lambda _: {"path": str(self.path), "duration": 12}
        self.project = mv_projects.save_project(self.root, {
            "name": "Original fixture", "prompt": "Ocean at dawn", "aspect": "16:9",
            "music_source_id": self.music_id,
        }, self.resolver)
        self.analysis = mv_analysis.validate_result({
            "duration": 12, "sample_rate": 8000, "bin_seconds": .1,
            "waveform": [1] * 120, "energy": [1] * 120,
            "beats": [n / 2 for n in range(24)], "downbeats": [0, 2, 4, 6, 8, 10],
            "bpm": 120, "device": "cpu", "dbn": False,
        })
        self.payload = {"revision": self.project["revision"], "text_model": "fixture",
                        "model": "ltx-2.3-distilled-q4", "quality": "preview",
                        "start": 1.125, "end": 7.375, "shot_seconds": 3.5}

    def plan(self, generated=None):
        generated = generated or {"shots": [{"title": "Opening", "prompt": "Ocean"},
                                          {"title": "Closing", "prompt": "Sunrise"}]}
        with patch.object(server, "OUTPUT_ROOT", self.root), \
                patch.object(server, "_resolve_mv_music_source", side_effect=self.resolver), \
                patch.object(server, "_require_enabled_model"), \
                patch.object(server, "_local_text_models", return_value=[{"id": "fixture"}]), \
                patch.object(mv_analysis, "cached", return_value=self.analysis), \
                patch.object(server, "_request_local_text_json", return_value=generated):
            return server._plan_mv_workflow(self.project["id"], self.payload)

    def edit(self, manifest):
        return {"revision": workflows.mv_revision(manifest),
                "shots": [{key: shot[key] for key in ("id", "title", "prompt", "first_frame_id", "first_frame_source")}
                          for shot in manifest["shots"]]}

    def test_plan_has_exact_cumulative_frames_and_independent_generation_lengths(self):
        manifest = self.plan()
        timeline = mv_storyboard.validate_timeline(manifest)
        self.assertEqual(timeline["start_frame"], 27)
        self.assertEqual(timeline["end_frame"], 177)
        self.assertEqual(timeline["clips"][0]["end_frame"], 96)
        self.assertEqual(timeline["clips"][1]["start_frame"], 96)
        self.assertEqual(manifest["total_duration"], 6.25)
        self.assertEqual([shot["duration"] for shot in manifest["shots"]], [3, 4])
        self.assertEqual(manifest["shot_mode"], "independent")
        self.assertEqual([shot["first_frame_source"] for shot in manifest["shots"]], ["none", "previous"])
        self.assertEqual(workflows.get_workflow(self.root, manifest["id"]), manifest)
        self.assertNotIn("music_source_path", server._public_workflow(manifest)["soundtrack"])
        self.assertTrue(server._public_workflow(manifest)["mv_revision"])

    def test_delete_selected_version_keeps_project_music_media_and_can_replan(self):
        manifest = self.plan()
        other = self.plan()
        video = workflows.workflow_directory(self.root, manifest["id"]) / "preview.mp4"
        video.write_bytes(b"original fixture")
        workflows.delete_workflows(self.root, [manifest["id"]], delete_media=False)
        self.assertIsNone(workflows.get_workflow(self.root, manifest["id"]))
        self.assertIsNotNone(workflows.get_workflow(self.root, other["id"]))
        self.assertEqual(video.read_bytes(), b"original fixture")
        self.assertTrue(self.path.exists())
        self.assertEqual(
            mv_projects.list_projects(self.root)[0]["revision"], self.project["revision"]
        )
        replacement = self.plan()
        self.assertNotEqual(replacement["id"], manifest["id"])
        self.assertEqual(len(replacement["shots"]), 2)
        self.assertEqual(workflows.get_workflow(self.root, replacement["id"]), replacement)

    def test_beat_preview_matches_created_timeline_without_inference_or_writes(self):
        timing = {key: self.payload[key] for key in ("revision", "model", "start", "end", "shot_seconds")}
        with patch.object(server, "OUTPUT_ROOT", self.root), \
                patch.object(server, "_resolve_mv_music_source", side_effect=self.resolver), \
                patch.object(server, "_require_enabled_model"), \
                patch.object(mv_analysis, "cached", return_value=self.analysis), \
                patch.object(server, "_request_local_text_json", side_effect=AssertionError("No inference")):
            preview = server._preview_mv_timing(self.project["id"], timing)
            self.assertEqual(workflows.list_workflows(self.root), [])
            self.assertEqual(preview["shot_count"], 2)
            self.assertEqual(preview["total_duration"], 6.25)
            self.assertEqual(preview["fps"], 24)
            with self.assertRaisesRegex(ValueError, "invalid_mv_fields"):
                server._preview_mv_timing(self.project["id"], self.payload)
            with self.assertRaisesRegex(ValueError, "mv_conflict"):
                server._preview_mv_timing(self.project["id"], {**timing, "revision": "stale"})
        manifest = self.plan()
        self.assertEqual([(clip["start_frame"], clip["end_frame"]) for clip in preview["clips"]],
                         [(clip["start_frame"], clip["end_frame"]) for clip in manifest["mv_timeline"]["clips"]])

    def test_invalid_timing_missing_beats_and_long_plans_do_not_guess(self):
        for start, end, seconds in [(True, 5, 3), (0, float("nan"), 3), (0, 13, 3), (2, 1, 3), (0, 5, 21)]:
            with self.subTest(start=start, end=end), self.assertRaisesRegex(ValueError, "invalid_mv_timing"):
                mv_storyboard.plan(self.analysis, self.payload["model"], start, end, seconds)
        with self.assertRaisesRegex(ValueError, "mv_beats_required"):
            mv_storyboard.plan({**self.analysis, "beats": []}, self.payload["model"], 0, 5, 3)
        long_analysis = {**self.analysis, "duration": 720, "beats": list(range(720)), "downbeats": []}
        with self.assertRaisesRegex(ValueError, "mv_too_many_shots"):
            mv_storyboard.plan(long_analysis, self.payload["model"], 0, 720, 3)

    def test_closed_model_output_and_revision_failure_preserve_project(self):
        before = mv_projects.list_projects(self.root)
        for generated in ({"shots": []}, {"shots": [{"title": "One", "prompt": "x", "duration": 5}] * 2}):
            with self.assertRaisesRegex(RuntimeError, "mv_storyboard_output_invalid"):
                self.plan(generated)
        self.assertEqual(workflows.list_workflows(self.root), [])
        self.assertEqual(mv_projects.list_projects(self.root), before)
        self.payload["revision"] = "stale"
        with self.assertRaisesRegex(ValueError, "mv_conflict"):
            self.plan()

    def test_mv_uses_its_own_exact_count_schema_with_and_without_skills(self):
        for usage in ([], [{"id": "fixture", "revision": "a" * 64}]):
            with self.subTest(usage=usage), patch.object(
                server, "_skill_creative_input",
                side_effect=lambda settings, instructions, source, mode: (instructions, source, usage),
            ), patch.object(server, "_request_local_text_json", wraps=server._request_local_text_json) as request, \
                    patch.object(server, "_skill_text_response", return_value={
                        "choices": [{"finish_reason": "stop", "message": {"content": json.dumps({
                            "shots": [{"title": "晨光", "prompt": "蓝色海岸"}] * 2,
                        })}}],
                    }) as transport, \
                    patch.object(server, "OUTPUT_ROOT", self.root), \
                    patch.object(server, "_resolve_mv_music_source", side_effect=self.resolver), \
                    patch.object(server, "_require_enabled_model"), \
                    patch.object(server, "_local_text_models", return_value=[{"id": "fixture"}]), \
                    patch.object(mv_analysis, "cached", return_value=self.analysis):
                manifest = server._plan_mv_workflow(self.project["id"], self.payload)
                self.assertEqual(len(manifest["shots"]), 2)
                self.assertTrue(request.call_args.kwargs["strict"])
                body = json.loads(transport.call_args.args[0].data)
                schema = body["response_format"]["json_schema"]["schema"]
                self.assertEqual(schema["required"], ["shots"])
                self.assertFalse(schema["additionalProperties"])
                shots = schema["properties"]["shots"]
                self.assertEqual((shots["minItems"], shots["maxItems"]), (2, 2))
                self.assertEqual(shots["items"]["required"], ["title", "prompt"])
                self.assertFalse(shots["items"]["additionalProperties"])
                self.assertEqual(body["temperature"], .2)

    def test_extra_model_shot_is_not_silently_trimmed_and_reports_counts(self):
        with self.assertRaisesRegex(RuntimeError, "expected only shots with 2 items; received 3"):
            self.plan({"shots": [{"title": "海岸", "prompt": "晨光"}] * 3})
        self.assertEqual(workflows.list_workflows(self.root), [])

    def test_music_storyboard_uses_live_profile_and_preserves_fixed_intervals(self):
        path = self.root / "prompts.json"
        with patch.object(prompt_settings, "SETTINGS_PATH", path):
            current = prompt_settings.snapshot()
            current["config"]["profiles"]["mv_storyboard"]["rules"] = "Preserve the blue coast."
            prompt_settings.save(current["config"], current["revision"])
            def creative(settings, instructions, source, mode):
                self.assertIn("Preserve the blue coast.", instructions)
                self.assertIn("exactly 2 chronological shots", instructions)
                self.assertEqual(mode, "mv")
                self.assertEqual(len(json.loads(source)["shots"]), 2)
                return instructions, source, []
            with patch.object(server, "_skill_creative_input", side_effect=creative) as call:
                manifest = self.plan()
        self.assertEqual(call.call_count, 1)
        timeline = mv_storyboard.validate_timeline(manifest)
        self.assertEqual(timeline["start_frame"], 27)
        self.assertEqual(timeline["end_frame"], 177)

    def test_visual_brief_language_and_selected_skills_reach_the_text_model(self):
        self.project = mv_projects.save_project(self.root, {
            "revision": self.project["revision"],
            "name": "中文分镜", "prompt": "保持同一位少女和蓝色海岸，晨光逐渐变亮", "aspect": "16:9",
            "music_source_id": self.music_id,
        }, self.resolver, self.project["id"])
        self.payload["revision"] = self.project["revision"]
        self.payload["skills"] = [{"id": str(uuid.uuid4()), "revision": "a" * 64}]
        self.payload["target_model"] = self.payload["model"]
        usage = [{"id": self.payload["skills"][0]["id"], "revision": "a" * 64}]
        def creative(settings, instructions, source, mode):
            self.assertEqual(mode, "mv")
            self.assertEqual(settings["skills"], self.payload["skills"])
            self.assertEqual(settings["target_model"], self.payload["model"])
            self.assertIn("same language", instructions)
            self.assertEqual(json.loads(source)["visual_brief"], self.project["prompt"])
            return instructions, source + "\nApproved visual knowledge", usage
        with patch.object(server, "_skill_creative_input", side_effect=creative) as creative_input:
            manifest = self.plan({"shots": [
                {"title": "晨光", "prompt": "同一位少女站在蓝色海岸，晨光渐亮"},
                {"title": "海风", "prompt": "同一位少女沿着蓝色海岸前行，风吹裙摆"},
            ]})
        self.assertEqual(creative_input.call_count, 1)
        self.assertEqual(manifest["skill_usage"], usage)
        self.assertEqual(manifest["shots"][0]["prompt"], "同一位少女站在蓝色海岸，晨光渐亮")
        self.payload["target_model"] = "h3"
        with self.assertRaisesRegex(skill_conversion.SkillError, "skill_binding_mismatch"):
            self.plan()

    def test_chained_edits_invalidate_dependent_media_and_reject_invalid_sources(self):
        manifest = self.plan()
        directory = workflows.workflow_directory(self.root, manifest["id"])
        for index, shot in enumerate(manifest["shots"]):
            path = directory / f"ready-{index}.mp4"
            path.write_bytes(b"fixture")
            shot.update(status="completed", video_path=str(path))
        workflows.save_workflow(self.root, manifest)
        payload = self.edit(manifest)
        payload["shots"][0]["prompt"] = "Revised same subject"
        saved = workflows.edit_mv_workflow(self.root, manifest["id"], payload)
        self.assertEqual([shot["status"] for shot in saved["shots"]], ["pending", "pending"])
        self.assertTrue(all(shot["video_path"] is None for shot in saved["shots"]))
        bad = self.edit(saved)
        bad["shots"][0]["first_frame_source"] = "previous"
        with self.assertRaisesRegex(ValueError, "invalid_first_frame"):
            workflows.edit_mv_workflow(self.root, manifest["id"], bad)
        saved["model"] = "h3-fasth3-vsa-q8"
        saved["shots"][0]["duration"] = saved["shots"][1]["duration"] = 5
        with self.assertRaisesRegex(ValueError, "invalid_first_frame"):
            mv_storyboard.validate_timeline(saved)

    def test_single_chained_shot_requires_previous_completed_media_before_queue(self):
        manifest = self.plan()
        with patch.object(server, "OUTPUT_ROOT", self.root):
            with self.assertRaisesRegex(ValueError, "mv_previous_shot_required"):
                server._queue_workflow(manifest, operation="shot", shot_id=manifest["shots"][1]["id"])
        self.assertEqual(workflows.get_workflow(self.root, manifest["id"])["status"], "draft")

    def test_prompt_edits_reuse_other_media_and_keep_music_timeline(self):
        manifest = self.plan()
        directory = workflows.workflow_directory(self.root, manifest["id"])
        for index, shot in enumerate(manifest["shots"]):
            path = directory / f"shot-{index}.mp4"
            path.write_bytes(b"fixture")
            shot.update(status="completed", video_path=str(path))
            shot["first_frame_source"] = "none"
        workflows.save_workflow(self.root, manifest)
        payload = self.edit(manifest)
        payload["shots"][0]["prompt"] = "Changed ocean"
        saved = workflows.edit_mv_workflow(self.root, manifest["id"], payload)
        self.assertEqual(saved["shots"][0]["status"], "pending")
        self.assertEqual(saved["shots"][1]["video_path"], manifest["shots"][1]["video_path"])
        self.assertEqual(saved["mv_timeline"], manifest["mv_timeline"])
        with self.assertRaisesRegex(ValueError, "mv_conflict"):
            workflows.edit_mv_workflow(self.root, manifest["id"], payload)
        with self.assertRaisesRegex(ValueError, "mv_replan_required"):
            workflows.clear_workflow_shots(self.root, manifest["id"], delete_media=True)

    def test_tampered_timeline_and_changed_source_fail_closed(self):
        manifest = self.plan()
        for transform in (lambda value: value["mv_timeline"]["clips"][0].update(end_frame=10000),
                          lambda value: value.update(total_duration=9),
                          lambda value: value.update(total_duration=float("nan")),
                          lambda value: value["mv_timeline"].update(version=True),
                          lambda value: value["soundtrack"].update(mix="mix")):
            bad = copy.deepcopy(manifest)
            transform(bad)
            with self.assertRaises(ValueError):
                mv_storyboard.validate_timeline(bad)
        with self.path.open("r+b") as stream:
            stream.seek(80)
            stream.write(b"\0\0")
        with self.assertRaisesRegex(ValueError, "mv_music_source_changed"):
            mv_storyboard.check_source(manifest)

    def test_analysis_source_race_and_post_planning_revision_drift_are_rejected(self):
        with patch.object(mv_storyboard, "source_digest", side_effect=["0" * 64, "1" * 64]):
            with self.assertRaisesRegex(ValueError, "mv_music_source_changed"):
                self.plan()
        original = self.project
        with patch.object(mv_projects, "list_projects", side_effect=[
            [original], [{**original, "revision": "changed"}],
        ]), self.assertRaisesRegex(ValueError, "mv_conflict"):
            self.plan()
        self.assertEqual(workflows.list_workflows(self.root), [])

    def test_first_frame_snapshots_invalidate_only_changed_shot(self):
        manifest = self.plan()
        image_id = str(uuid.uuid4())
        frame_directory = self.root / "first-frames"
        frame_directory.mkdir()
        original = frame_directory / f"{image_id}.png"
        Image.new("RGB", (32, 32), "blue").save(original)
        payload = self.edit(manifest)
        payload["shots"][0]["first_frame_id"] = image_id
        payload["shots"][0]["first_frame_source"] = "image"
        saved = workflows.edit_mv_workflow(self.root, manifest["id"], payload)
        snapshot = Path(saved["shots"][0]["first_frame_path"])
        self.assertEqual(snapshot.read_bytes(), original.read_bytes())
        original.unlink()
        saved = workflows.edit_mv_workflow(self.root, manifest["id"], self.edit(saved))
        self.assertEqual(saved["shots"][0]["first_frame_path"], str(snapshot))
        payload = self.edit(saved)
        payload["shots"][0]["first_frame_id"] = "../../external.png"
        with self.assertRaisesRegex(ValueError, "invalid_first_frame"):
            workflows.edit_mv_workflow(self.root, manifest["id"], payload)
        self.assertEqual(workflows.get_workflow(self.root, manifest["id"]), saved)

    def test_model_ranges_short_tail_and_unavailable_beats(self):
        clips = mv_storyboard.plan(self.analysis, "h3", 0, 5.041666666666667, 5)
        self.assertEqual(clips[-1]["end_frame"], 121)
        self.assertTrue(all(5 <= clip["duration"] <= 15 for clip in clips))
        self.assertEqual(clips[0]["start_frame"], 0)
        for model in ("h3", "h3-fasth3-vsa-q8"):
            with self.assertRaisesRegex(ValueError, "invalid_mv_timing"):
                mv_storyboard.plan(self.analysis, model, 0, 10, 3)
        with self.assertRaisesRegex(ValueError, "mv_beat_gap_too_long"):
            mv_storyboard.plan({**self.analysis, "beats": [0], "downbeats": []},
                               "ltx-2.3-distilled-q4", 0, 10, 3)

    def test_runner_reuses_original_audio_and_no_music_inference(self):
        manifest = self.plan()
        directory = workflows.workflow_directory(self.root, manifest["id"])
        generated = []
        def generate(current, shot, kind, settings, model_path, **kwargs):
            self.assertEqual(kind, "video")
            self.assertEqual("first_frame_image" in settings, len(generated) > 0)
            if len(generated) > 0:
                previous = current["shots"][0]
                self.assertEqual(base64.b64decode(settings["first_frame_image"]),
                                 Path(previous["last_frame_path"]).read_bytes())
            video = directory / f"{shot['id']}.mp4"
            video.write_bytes(b"video")
            generated.append(shot["id"])
            return {"status": "completed", "video_path": video, "created_at": 0, "finished_at": 1}
        final = directory / "final.mp4"
        final.write_bytes(b"final")
        with patch.object(server, "OUTPUT_ROOT", self.root), \
                patch.object(server, "_local_model_path", return_value=self.root), \
                patch.object(server, "_run_workflow_step", side_effect=generate), \
                patch.object(mv_storyboard, "prepare_shot", side_effect=lambda m, i, video, *args: video) as prepare, \
                patch.object(workflows, "extract_first_frame", side_effect=fake_boundary_frame), \
                patch.object(workflows, "extract_last_frame", side_effect=fake_boundary_frame), \
                patch.object(workflows, "assemble_workflow", return_value=final) as assemble, \
                patch.object(server, "_music_status", side_effect=AssertionError("No music inference")):
            server._run_workflow(manifest["id"])
            saved = workflows.get_workflow(self.root, manifest["id"])
            self.assertEqual(saved["status"], "completed", saved["error"])
            self.assertEqual(assemble.call_args.args[3], [self.path])
            self.assertEqual(prepare.call_count, 2)
            self.assertTrue(all(shot["audio_path"] is None for shot in saved["shots"]))
            server._run_workflow(manifest["id"])
            self.assertEqual(len(generated), 2)
            saved = workflows.get_workflow(self.root, manifest["id"])
            saved.update(operation="shot", target_shot_id=saved["shots"][1]["id"])
            saved["shots"][1].update(status="pending", video_path=None)
            workflows.save_workflow(self.root, saved)
            server._run_workflow(manifest["id"])
            saved = workflows.get_workflow(self.root, manifest["id"])
            self.assertEqual(saved["status"], "draft", saved["error"])
            self.assertEqual(saved["shots"][1]["status"], "completed")
            self.assertEqual(len(generated), 3)
            self.assertEqual(prepare.call_count, 3)

    @unittest.skipUnless(shutil.which("ffmpeg") and shutil.which("ffprobe"), "FFmpeg required")
    def test_real_export_exact_frames_and_original_song_interval(self):
        manifest = self.plan()
        directory = workflows.workflow_directory(self.root, manifest["id"])
        paths = []
        ffmpeg, ffprobe = shutil.which("ffmpeg"), shutil.which("ffprobe")
        for index, shot in enumerate(manifest["shots"]):
            path = directory / f"shot-{index}.mp4"
            subprocess.run([ffmpeg, "-v", "error", "-y", "-f", "lavfi", "-i",
                            f"color=c={'red' if index == 0 else 'blue'}:s=128x64:r=24:d={shot['duration']}",
                            "-f", "lavfi", "-i", f"sine=frequency=1000:duration={shot['duration']}",
                            "-c:v", "libx264", "-c:a", "aac", "-pix_fmt", "yuv420p", str(path)],
                           check=True, capture_output=True, timeout=30)
            paths.append(path)
        previews = [
            mv_storyboard.prepare_shot(manifest, index, path, directory, (128, 64), ffmpeg, ffprobe)
            for index, path in enumerate(paths)
        ]
        for preview, clip in zip(previews, manifest["mv_timeline"]["clips"]):
            data = mv_storyboard._probe(preview, ffprobe, count_frames=True)
            self.assertEqual(int(next(s for s in data["streams"] if s["codec_type"] == "video")["nb_read_frames"]),
                             clip["end_frame"] - clip["start_frame"])
        with patch.object(workflows.local_models, "video_canvas", return_value=(128, 64)):
            output = workflows.assemble_workflow(self.root, manifest, paths, [], ffmpeg, ffprobe)
        data = mv_storyboard._probe(output, ffprobe, count_frames=True)
        self.assertEqual(int(next(s for s in data["streams"] if s["codec_type"] == "video")["nb_read_frames"]), 150)
        def pcm(path, filter_text):
            raw = subprocess.run([ffmpeg, "-v", "error", "-i", str(path), "-vn", "-af", filter_text,
                                  "-ac", "1", "-ar", "48000", "-f", "s16le", "-"],
                                 check=True, capture_output=True, timeout=30).stdout
            result = array.array("h")
            result.frombytes(raw)
            return result
        expected = pcm(self.path, "aresample=48000,atrim=start_sample=54000:end_sample=354000,asetpts=PTS-STARTPTS")
        actual = pcm(output, "anull")
        count = min(len(expected), len(actual))
        error = sum((expected[n] - actual[n]) ** 2 for n in range(4800, count - 4800))
        signal = sum(expected[n] ** 2 for n in range(4800, count - 4800))
        self.assertLess(error / signal, .05)
        for preview, clip in zip(previews, manifest["mv_timeline"]["clips"]):
            expected = pcm(self.path, f"aresample=48000,atrim=start_sample={clip['start_frame'] * 2000}:"
                           f"end_sample={clip['end_frame'] * 2000},asetpts=PTS-STARTPTS")
            actual = pcm(preview, "anull")
            count = min(len(expected), len(actual))
            error = sum((expected[n] - actual[n]) ** 2 for n in range(4800, count - 4800))
            signal = sum(expected[n] ** 2 for n in range(4800, count - 4800))
            self.assertLess(error / signal, .05)
        before = output.read_bytes()
        with patch.object(mv_storyboard, "_probe", return_value={"streams": [
            {"codec_type": "video", "duration": "0.1"},
        ]}), self.assertRaisesRegex(RuntimeError, "mv_shot_media_too_short"):
            mv_storyboard.assemble(manifest, paths, directory, (128, 64), ffmpeg, ffprobe)
        self.assertEqual(output.read_bytes(), before)
        self.assertEqual(list(directory.glob(".mv-*.mp4")), [])
        with patch.object(mv_storyboard, "subprocess") as process:
            process.run.return_value = subprocess.CompletedProcess([], 1, "", "encoder failed")
            with patch.object(mv_storyboard, "_probe", return_value={"streams": [
                {"codec_type": "video", "duration": "10"},
            ]}), self.assertRaisesRegex(RuntimeError, "mv_assembly_failed"):
                mv_storyboard.assemble(manifest, paths, directory, (128, 64), ffmpeg, ffprobe)
        self.assertEqual(output.read_bytes(), before)

    def test_http_planning_editing_and_collection_isolation(self):
        http = server.ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
        thread = threading.Thread(target=http.serve_forever, daemon=True)
        thread.start()
        self.addCleanup(http.server_close)
        self.addCleanup(http.shutdown)
        base = f"http://127.0.0.1:{http.server_port}"
        def request(path, payload=None):
            req = Request(base + path, data=json.dumps(payload).encode() if payload is not None else None,
                          headers={"Content-Type": "application/json"})
            with urlopen(req, timeout=10) as response:
                return json.load(response)
        with patch.object(server, "OUTPUT_ROOT", self.root), \
                patch.object(server, "_resolve_mv_music_source", side_effect=self.resolver), \
                patch.object(server, "_require_enabled_model"), \
                patch.object(server, "_local_text_models", return_value=[{"id": "fixture"}]), \
                patch.object(mv_analysis, "cached", return_value=self.analysis), \
                patch.object(server, "_request_local_text_json", return_value={
                    "shots": [{"title": "One", "prompt": "Ocean"}, {"title": "Two", "prompt": "Sky"}]}):
            timing = {key: self.payload[key] for key in ("revision", "model", "start", "end", "shot_seconds")}
            preview = request(f"/api/mv-projects/{self.project['id']}/beat-plan", timing)["plan"]
            self.assertEqual(preview["shot_count"], 2)
            self.assertEqual(workflows.list_workflows(self.root), [])
            workflow = request(f"/api/mv-projects/{self.project['id']}/storyboard", self.payload)["workflow"]
            self.assertEqual(len(request(f"/api/mv-projects/{self.project['id']}/workflows")["items"]), 1)
            self.assertEqual(request("/api/workflows")["items"], [])
            edit = {"revision": workflow["mv_revision"],
                    "shots": [{key: shot[key] for key in ("id", "title", "prompt", "first_frame_id")}
                              for shot in workflow["shots"]]}
            edit["shots"][0]["prompt"] = "New prompt"
            updated = request(f"/api/workflows/{workflow['id']}/mv-update", edit)["workflow"]
            self.assertEqual(updated["shots"][0]["prompt"], "New prompt")
            with self.assertRaises(HTTPError) as caught:
                request(f"/api/workflows/{workflow['id']}/mv-update", edit)
            self.assertEqual(caught.exception.code, 409)
            caught.exception.close()
