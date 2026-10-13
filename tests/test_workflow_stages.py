from __future__ import annotations

import copy
import json
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from webapp import server, workflows
from test_workflows import make_payload, fake_boundary_frame


class WorkflowStageTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name)
        self.payload = make_payload()
        self.payload.update(shot_mode="independent")
        self.payload["shots"] *= 2
        self.manifest = workflows.create_workflow(self.root, self.payload)
        self.directory = workflows.workflow_directory(self.root, self.manifest["id"])
        for index, shot in enumerate(self.manifest["shots"]):
            video = self.directory / f"shot-{index}.mp4"
            video.write_bytes(b"video")
            shot.update(status="completed", video_path=str(video))
        self.manifest.update(status="completed", output_path=str(self.directory / "final.mp4"))
        workflows.save_workflow(self.root, self.manifest)

    def edit_payload(self):
        return {
            **self.payload,
            "shots": [{**shot} for shot in self.manifest["shots"]],
        }

    def test_clear_shots_retains_current_project_and_other_history(self):
        other = workflows.create_workflow(self.root, self.payload)
        original = copy.deepcopy(workflows.get_workflow(self.root, other["id"]))
        cleared = workflows.clear_workflow_shots(self.root, self.manifest["id"], delete_media=False)
        self.assertEqual(cleared["id"], self.manifest["id"])
        self.assertEqual(cleared["shots"], [])
        self.assertEqual(cleared["total_duration"], 0)
        self.assertIsNone(cleared["output_path"])
        self.assertTrue((self.directory / "shot-0.mp4").exists())
        self.assertTrue(server._public_workflow(cleared)["has_media"])
        self.assertEqual(server._public_workflow(cleared)["progress"]["total"], 0)
        self.assertEqual(workflows.get_workflow(self.root, other["id"]), original)
        self.assertEqual(len(workflows.list_workflows(self.root)), 2)
        with self.assertRaisesRegex(ValueError, "invalid_shots"):
            server._queue_workflow(cleared)
        rebuilt = workflows.update_workflow(self.root, cleared["id"], self.payload)
        self.assertTrue(rebuilt["shots"])
        self.assertTrue(all(shot["status"] == "pending" for shot in rebuilt["shots"]))

    def test_clear_media_is_scoped_to_current_project(self):
        other = workflows.create_workflow(self.root, self.payload)
        other_media = workflows.workflow_directory(self.root, other["id"]) / "other.mp4"
        other_media.write_bytes(b"other video")
        external = self.root / "shared.wav"
        external.write_bytes(b"shared audio")
        self.manifest["soundtrack"]["music_source_path"] = str(external)
        workflows.save_workflow(self.root, self.manifest)
        cleared = workflows.clear_workflow_shots(self.root, self.manifest["id"], delete_media=True)
        self.assertEqual(cleared["shots"], [])
        self.assertFalse((self.directory / "shot-0.mp4").exists())
        self.assertTrue((self.directory / "workflow.json").exists())
        self.assertTrue(other_media.exists())
        self.assertTrue(external.exists())

    def test_clear_rejects_live_project_and_unsafe_media_without_changes(self):
        workflows.mark_workflow_live(self.manifest["id"], True)
        try:
            with self.assertRaisesRegex(ValueError, "workflow_delete_active"):
                workflows.clear_workflow_shots(self.root, self.manifest["id"], delete_media=True)
        finally:
            workflows.mark_workflow_live(self.manifest["id"], False)
        (self.directory / "link").symlink_to(self.directory / "shot-0.mp4")
        with self.assertRaisesRegex(ValueError, "workflow_delete_unsafe"):
            workflows.clear_workflow_shots(self.root, self.manifest["id"], delete_media=True)
        self.assertEqual(len(workflows.get_workflow(self.root, self.manifest["id"])["shots"]), 2)

    def test_edit_invalidate_only_changed_shot_and_reorder_reuses_media(self):
        payload = self.edit_payload()
        payload["shots"][0]["prompt"] = "A different opening"
        saved = workflows.update_workflow(self.root, self.manifest["id"], payload)
        self.assertEqual(saved["status"], "draft")
        self.assertEqual(saved["shots"][0]["status"], "pending")
        self.assertEqual(saved["shots"][1]["video_path"], self.manifest["shots"][1]["video_path"])
        self.assertIsNone(saved["output_path"])
        payload["shots"].reverse()
        payload["shots"].append({**payload["shots"][0], "id": "", "title": "Inserted"})
        saved = workflows.update_workflow(self.root, saved["id"], payload)
        self.assertEqual(saved["shots"][0]["video_path"], self.manifest["shots"][1]["video_path"])
        self.assertNotIn(saved["shots"][2]["id"], [s["id"] for s in self.manifest["shots"]])
        self.assertEqual(saved["shots"][2]["status"], "pending")

    def test_global_music_edit_retains_clean_assembly_and_videos(self):
        base = self.directory / "assembly.mp4"
        base.write_bytes(b"assembly")
        self.manifest["assembly_path"] = str(base)
        workflows.save_workflow(self.root, self.manifest)
        payload = self.edit_payload()
        payload["soundtrack"] = {**payload["soundtrack"], "mode": "music3", "strategy": "global"}
        saved = workflows.update_workflow(self.root, self.manifest["id"], payload)
        self.assertEqual(saved["assembly_path"], str(base))
        self.assertEqual(saved["output_path"], str(base))
        self.assertTrue(all(s["status"] == "completed" for s in saved["shots"]))

    def test_continuous_edit_invalidates_downstream_conditioned_shots(self):
        self.manifest["shot_mode"] = "continuous"
        workflows.save_workflow(self.root, self.manifest)
        payload = self.edit_payload()
        payload["shot_mode"] = "continuous"
        payload["shots"][0]["prompt"] = "Changed"
        saved = workflows.update_workflow(self.root, self.manifest["id"], payload)
        self.assertTrue(all(s["status"] == "pending" for s in saved["shots"]))

    def test_music_cache_survives_save_and_mix_changes(self):
        payload = self.edit_payload()
        payload["soundtrack"].update(mode="music3", strategy="global")
        manifest = workflows.update_workflow(self.root, self.manifest["id"], payload)
        audio = self.directory / "music.wav"
        audio.write_bytes(b"music")
        manifest["soundtrack_segments"][0].update(status="completed", audio_path=str(audio))
        workflows.save_workflow(self.root, manifest)
        saved = workflows.update_workflow(self.root, manifest["id"], payload)
        self.assertEqual(saved["soundtrack_segments"][0]["audio_path"], str(audio))
        payload["soundtrack"]["mix"] = "mix"
        saved = workflows.update_workflow(self.root, manifest["id"], payload)
        self.assertEqual(saved["soundtrack_segments"][0]["status"], "completed")
        payload["soundtrack"]["prompt"] = "Different music"
        saved = workflows.update_workflow(self.root, manifest["id"], payload)
        self.assertEqual(saved["soundtrack_segments"][0]["status"], "pending")

    def run_operation(self, operation, target=None):
        manifest = copy.deepcopy(self.manifest)
        manifest.update(operation=operation, target_shot_id=target, status="draft", output_path=None)
        for shot in manifest["shots"]:
            if operation != "shot" or shot["id"] == target:
                shot.update(status="pending", video_path=None)
        workflows.save_workflow(self.root, manifest)
        generated = []

        def generate(manifest, shot, kind, settings, model_path, **kwargs):
            self.assertEqual(kind, "video")
            self.assertNotIn("first_frame_image", settings)
            path = self.directory / f"generated-{shot['id']}.mp4"
            path.write_bytes(b"new video")
            generated.append(shot["id"])
            return {"status": "completed", "video_path": path, "created_at": 0, "finished_at": 1}

        with patch.object(server, "OUTPUT_ROOT", self.root), \
                patch.object(server, "_find_models", return_value=["model"]), \
                patch.object(server, "_run_workflow_step", side_effect=generate), \
                patch.object(workflows, "extract_first_frame", side_effect=fake_boundary_frame), \
                patch.object(workflows, "extract_last_frame", side_effect=fake_boundary_frame), \
                patch.object(workflows, "assemble_workflow") as assembly, \
                patch.object(server, "_music_status", side_effect=AssertionError("No music inference")):
            server._run_workflow(manifest["id"])
        saved = workflows.get_workflow(self.root, manifest["id"])
        self.assertEqual(saved["status"], "draft", saved.get("error"))
        self.assertEqual(saved["phase"], "review")
        assembly.assert_not_called()
        return generated, saved

    def test_single_shot_runs_only_target_and_stops_for_review(self):
        target = self.manifest["shots"][1]["id"]
        generated, saved = self.run_operation("shot", target)
        self.assertEqual(generated, [target])
        self.assertEqual(saved["shots"][0]["status"], "completed")
        self.assertEqual(saved["shots"][0]["video_path"], self.manifest["shots"][0]["video_path"])
        self.assertEqual(saved["shots"][1]["status"], "completed")

    def test_video_batch_is_independent_even_for_legacy_continuous_workflows(self):
        self.manifest["shot_mode"] = "continuous"
        generated, saved = self.run_operation("videos")
        self.assertEqual(len(generated), 2)
        self.assertTrue(all(s["status"] == "completed" for s in saved["shots"]))

    def test_postproduction_preconditions_and_no_model_checks_for_assembly(self):
        with patch.object(server, "OUTPUT_ROOT", self.root), \
                patch.object(server, "_require_enabled_model", side_effect=AssertionError("No video model")), \
                patch.object(server, "_music_status", side_effect=AssertionError("No music model")):
            with self.assertRaisesRegex(ValueError, "invalid_shot_id"):
                server._queue_workflow(copy.deepcopy(self.manifest), operation="shot", shot_id="unknown")
            with self.assertRaisesRegex(ValueError, "workflow_global_soundtrack_required"):
                server._queue_workflow(copy.deepcopy(self.manifest), operation="soundtrack")
            with patch.object(server.threading, "Thread") as thread:
                try:
                    server._queue_workflow(copy.deepcopy(self.manifest), operation="assemble")
                    thread.return_value.start.assert_called_once()
                finally:
                    server._active_workflow_id = None
                    server._workflow_cancel_events.pop(self.manifest["id"], None)
                    workflows.mark_workflow_live(self.manifest["id"], False)

    @unittest.skipUnless(shutil.which("ffmpeg") and shutil.which("ffprobe"), "FFmpeg required")
    def test_real_assembly_and_global_score_preserve_video_packets(self):
        ffmpeg, ffprobe = shutil.which("ffmpeg"), shutil.which("ffprobe")
        manifest = self.manifest
        paths = []
        for index, shot in enumerate(manifest["shots"]):
            path = Path(shot["video_path"])
            subprocess.run([
                ffmpeg, "-nostdin", "-y", "-v", "error", "-f", "lavfi",
                "-i", f"color=c={'red' if index == 0 else 'blue'}:s=512x256:r=24:d=5",
                "-c:v", "libx264", "-pix_fmt", "yuv420p", str(path),
            ], check=True, capture_output=True, timeout=30)
            paths.append(path)
        base = workflows.assemble_workflow(self.root, manifest, paths, [], ffmpeg, ffprobe)
        assembly = base.with_name("assembly.mp4")
        base.rename(assembly)
        music = self.directory / "score.wav"
        subprocess.run([
            ffmpeg, "-nostdin", "-y", "-v", "error", "-f", "lavfi", "-i",
            "sine=frequency=440:duration=1", str(music),
        ], check=True, capture_output=True, timeout=30)
        manifest.update(assembly_path=str(assembly))
        manifest["soundtrack"].update(mode="music3", strategy="global", music_source_id="source")
        final = workflows.apply_global_soundtrack(self.root, manifest, [music], ffmpeg, ffprobe)
        self.assertNotEqual(final, assembly)
        def video_hash(path):
            return subprocess.run([
                ffmpeg, "-v", "error", "-i", str(path), "-map", "0:v:0", "-c", "copy",
                "-f", "hash", "-hash", "sha256", "-",
            ], check=True, capture_output=True, text=True, timeout=30).stdout
        self.assertEqual(video_hash(assembly), video_hash(final))
        metadata = json.loads(subprocess.run([
            ffprobe, "-v", "error", "-show_entries", "format=duration", "-of", "json", str(final),
        ], check=True, capture_output=True, text=True).stdout)
        self.assertAlmostEqual(float(metadata["format"]["duration"]), 10, delta=0.1)
        for mix in ("mix", "score"):
            manifest["soundtrack"]["mix"] = mix
            scored = workflows.apply_global_soundtrack(self.root, manifest, [music], ffmpeg, ffprobe)
            self.assertEqual(video_hash(assembly), video_hash(scored))


if __name__ == "__main__":
    unittest.main()
