from __future__ import annotations

import http.client
import io
import json
import math
import struct
import sys
import tempfile
import threading
import time
import unittest
import uuid
import wave
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from webapp import local_models, podcasts, server

FAKE_FISH = r"""
import math, pathlib, sys, time, wave
args = sys.argv[1:]
text = pathlib.Path(args[args.index("--text-file") + 1]).read_text()
if "FAIL" in text:
    print("fake fish failure", flush=True)
    sys.exit(3)
if "SLOW" in text:
    print("slow start", flush=True)
    time.sleep(60)
out = args[args.index("--output") + 1]
with wave.open(out, "wb") as stream:
    stream.setnchannels(1); stream.setsampwidth(2); stream.setframerate(24000)
    stream.writeframes(b"".join(int(8000 * math.sin(i / 10)).to_bytes(2, "little", signed=True)
                                for i in range(12000)))
print("done", flush=True)
"""


def wav_bytes(seconds=0.5, rate=44100, channels=2):
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as stream:
        stream.setnchannels(channels)
        stream.setsampwidth(2)
        stream.setframerate(rate)
        frames = int(seconds * rate)
        stream.writeframes(b"".join(
            struct.pack("<h", int(6000 * math.sin(i / 7))) * channels for i in range(frames)))
    return buffer.getvalue()


def fake_command(settings, model_path, reference_path, reference_text, text_path, output_path):
    return [sys.executable, "-c", FAKE_FISH, "--text-file", str(text_path), "--output", str(output_path)]


class PodcastModuleTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        podcasts._RUNNING.clear()
        self.addCleanup(podcasts._RUNNING.clear)
        self.cid, self.sid = str(uuid.uuid4()), str(uuid.uuid4())

    def create(self, **extra):
        payload = {"name": "Show", "characters": [
            {"id": self.cid, "name": "Host", "reference_text": "hello there", "consent": True}],
            "segments": [{"id": self.sid, "character_id": self.cid, "text": "Welcome", "purpose": "intro",
                          "gap_seconds": 0.5}]}
        payload.update(extra)
        return podcasts.create(self.root, payload)

    def test_private_manifest_and_cas(self):
        project = self.create()
        path = self.root / "podcasts" / project["id"] / "project.json"
        self.assertEqual(path.stat().st_mode & 0o777, 0o600)
        self.assertEqual(path.parent.stat().st_mode & 0o777, 0o700)
        self.assertEqual(project["characters"][0]["reference"], None)
        self.assertEqual(project["segments"][0]["status"], "pending")
        saved = podcasts.save(self.root, project["id"], {"revision": project["revision"], "name": "Renamed"})
        self.assertEqual(saved["name"], "Renamed")
        with self.assertRaises(podcasts.PodcastError) as caught:
            podcasts.save(self.root, project["id"], {"revision": project["revision"], "name": "Again"})
        self.assertEqual(caught.exception.code, "podcast_conflict")
        self.assertEqual(podcasts.list_projects(self.root)[0]["id"], project["id"])

    def test_validation_limits(self):
        cases = [
            ({"characters": [{"name": "X", "reference_text": "", "consent": False}]}, "podcast_consent_required"),
            ({"segments": [{"text": "a", "purpose": "song", "gap_seconds": 0}]}, "invalid_podcast_segment"),
            ({"segments": [{"text": "a", "purpose": "intro", "gap_seconds": 31}]}, "invalid_podcast_segment"),
            ({"segments": [{"character_id": str(uuid.uuid4()), "text": "a"}]}, "podcast_character_not_found"),
            ({"characters": [{"name": f"C{i}", "consent": True} for i in range(13)]}, "invalid_podcast_character"),
            ({"segments": [{"text": ""} for _ in range(101)]}, "invalid_podcast_segment"),
            ({"name": ""}, "invalid_podcast_name"),
            ({"segments": [{"id": "../../etc", "text": "x"}]}, "invalid_podcast_segment"),
        ]
        for extra, code in cases:
            with self.subTest(code=code, extra=str(extra)[:60]):
                payload = {"name": "Show", **extra}
                with self.assertRaises(podcasts.PodcastError) as caught:
                    podcasts.create(self.root, payload)
                self.assertEqual(caught.exception.code, code)
        project = podcasts.create(self.root, {"name": "Ok", "segments": [
            {"character_id": None, "text": "", "purpose": "story", "gap_seconds": 30}]})
        self.assertIsNone(project["segments"][0]["character_id"])
        with self.assertRaises(podcasts.PodcastError):
            podcasts.get(self.root, "../x")

    def test_speech_models_are_in_settings_registry(self):
        voice_options = server._model_options()["voice"]
        registered = {model["id"]: model for model in voice_options}
        self.assertEqual(set(registered), {
            "fish-s2-pro-8bit", "voxcpm2-4bit", "qwen3-tts-voicedesign-8bit",
        })
        for model_id, entry in registered.items():
            self.assertEqual(entry, server._DEFAULT_SETTINGS["models"][model_id] | {"id": model_id})

    def test_speech_model_index_without_weight_shards_is_not_ready(self):
        model = self.root / "qwen"
        model.mkdir()
        (model / "config.json").write_text("{}")
        (model / "model.safetensors.index.json").write_text(json.dumps({
            "weight_map": {"decoder.weight": "model-00001-of-00002.safetensors"},
        }))
        with patch.object(local_models.subprocess, "run",
                          return_value=SimpleNamespace(returncode=0, stderr="")):
            status = local_models.status("qwen3-tts-voicedesign-8bit", model)
        self.assertFalse(status["model_ready"])
        self.assertEqual(status["download_state"], "not_started")

    def test_voice_design_project_needs_description_not_reference_audio(self):
        project = self.create(
            settings={"model": "qwen3-tts-voicedesign-8bit"},
            characters=[{"id": self.cid, "name": "Host", "reference_text": "", "voice_description":
                         "Warm, calm mid-range voice with a slight coastal accent.", "consent": True}],
        )
        plan = podcasts.begin_job(self.root, project["id"], project["revision"], str(uuid.uuid4()), "generate")
        self.assertEqual(plan["settings"]["model"], "qwen3-tts-voicedesign-8bit")
        self.assertIsNone(plan["segments"][0]["reference_path"])
        self.assertIn("coastal accent", plan["segments"][0]["voice_description"])
        podcasts.finish_job(self.root, project["id"], plan["project"]["job_id"], "failed", "test")
        finished = podcasts.get(self.root, project["id"])
        incomplete = podcasts.save(self.root, project["id"], {
            "revision": finished["revision"], "characters": [
                {"id": self.cid, "name": "Host", "reference_text": "", "voice_description": "", "consent": True}],
        })
        with self.assertRaises(podcasts.PodcastError) as caught:
            podcasts.begin_job(self.root, incomplete["id"], incomplete["revision"], str(uuid.uuid4()), "generate")
        self.assertEqual(caught.exception.code, "podcast_voice_description_required")

    def test_voice_design_saves_without_cloning_consent(self):
        project = self.create(
            settings={"model": "voxcpm2-4bit"},
            characters=[{"id": self.cid, "name": "Host", "reference_text": "", "voice_description":
                         "Bright, clear voice with measured pacing.", "consent": False}],
        )
        self.assertFalse(project["characters"][0]["consent"])
        saved = podcasts.save(self.root, project["id"], {
            "revision": project["revision"], "characters": [
                {"id": self.cid, "name": "Host", "reference_text": "", "voice_description":
                 "Bright, clear voice with measured pacing.", "consent": False}],
        })
        self.assertFalse(saved["characters"][0]["consent"])
        # Reopening the manifest keeps the unconsented described voice valid.
        self.assertFalse(podcasts.get(self.root, project["id"])["characters"][0]["consent"])

    def test_cloning_model_still_requires_consent(self):
        for character in ({"name": "Host", "reference_text": "hi", "consent": False},
                          {"name": "Host", "reference_text": "hi"}):
            with self.subTest(character=character):
                with self.assertRaises(podcasts.PodcastError) as caught:
                    podcasts.create(self.root, {"name": "Show", "settings": {"model": "fish-s2-pro-8bit"},
                                                "characters": [character]})
                self.assertEqual(caught.exception.code, "podcast_consent_required")

    def test_switching_to_cloning_model_requires_consent_and_keeps_manifest_readable(self):
        project = self.create(
            settings={"model": "voxcpm2-4bit"},
            characters=[{"id": self.cid, "name": "Host", "reference_text": "", "voice_description":
                         "Warm low voice", "consent": False}],
        )
        with self.assertRaises(podcasts.PodcastError) as caught:
            podcasts.save(self.root, project["id"], {"revision": project["revision"],
                                                     "settings": {"model": "fish-s2-pro-8bit"}})
        self.assertEqual(caught.exception.code, "podcast_consent_required")
        # The rejected switch must not corrupt the stored manifest.
        reopened = podcasts.get(self.root, project["id"])
        self.assertEqual(reopened["settings"]["model"], "voxcpm2-4bit")
        saved = podcasts.save(self.root, project["id"], {
            "revision": reopened["revision"], "settings": {"model": "fish-s2-pro-8bit"}, "characters": [
                {"id": self.cid, "name": "Host", "reference_text": "hi", "voice_description":
                 "Warm low voice", "consent": True}],
        })
        self.assertEqual(saved["settings"]["model"], "fish-s2-pro-8bit")
        self.assertTrue(podcasts.get(self.root, project["id"])["characters"][0]["consent"])

    def test_reference_import_and_assemble_math(self):
        project = self.create()
        data = wav_bytes(1.0)
        project = podcasts.store_reference(self.root, project["id"], self.cid, project["revision"],
                                           io.BytesIO(data), len(data))
        reference = project["characters"][0]["reference"]
        self.assertAlmostEqual(reference["duration"], 1.0, places=3)
        self.assertTrue(reference["url"].endswith(f"/references/{self.cid}"))
        imported = str(uuid.uuid4())
        project = podcasts.save(self.root, project["id"], {"revision": project["revision"], "segments": [
            project["segments"][0], {"id": imported, "character_id": None, "text": "", "purpose": "story",
                                     "gap_seconds": 0}]})
        for sid, seconds in ((self.sid, 0.25), (imported, 0.5)):
            clip = wav_bytes(seconds, rate=22050, channels=1)
            project = podcasts.import_audio(self.root, project["id"], sid, project["revision"],
                                            io.BytesIO(clip), len(clip))
        self.assertEqual([item["source"] for item in project["segments"]], ["imported", "imported"])
        self.assertEqual(project["segments"][1]["media"]["sample_rate"], 48000)
        self.assertEqual(podcasts.segment_subtitles(self.root, project["id"], imported, "srt"), "")
        self.assertIn("Welcome", podcasts.segment_subtitles(self.root, project["id"], self.sid, "vtt"))
        job = str(uuid.uuid4())
        plan = podcasts.begin_job(self.root, project["id"], project["revision"], job, "assemble")
        self.assertEqual(plan["segments"], [])
        with self.assertRaises(podcasts.PodcastError) as caught:
            podcasts.save(self.root, project["id"], {"revision": plan["project"]["revision"], "name": "x"})
        self.assertEqual(caught.exception.code, "podcast_busy")
        podcasts.compose(self.root, project["id"], job)
        podcasts.finish_job(self.root, project["id"], job, "completed")
        project = podcasts.get(self.root, project["id"])
        self.assertEqual(project["status"], "completed")
        samples = [item["media"]["samples"] for item in project["segments"]]
        self.assertEqual(project["export"]["samples"], samples[0] + 24000 + samples[1])
        self.assertEqual(project["export"]["timeline"][1]["start"], round((samples[0] + 24000) / 48000, 6))
        with wave.open(str(podcasts.media_file(self.root, project["id"], "export"))) as stream:
            self.assertEqual((stream.getframerate(), stream.getnchannels(), stream.getnframes()),
                             (48000, 1, project["export"]["samples"]))
        srt = podcasts.export_subtitles(self.root, project["id"], "srt")
        self.assertEqual(srt.count("-->"), 1)
        self.assertTrue(srt.startswith("1\n00:00:00,000 --> 00:00:00,250\nWelcome"))
        # Editing imported text keeps audio but invalidates the merged export.
        edited = podcasts.save(self.root, project["id"], {"revision": project["revision"], "segments": [
            {**project["segments"][0], "text": "Changed"}, project["segments"][1]]})
        self.assertIsNotNone(edited["segments"][0]["media"])
        self.assertIsNone(edited["export"])
        self.assertEqual(edited["status"], "idle")

    def test_reference_limit_and_bad_import(self):
        project = self.create()
        long_reference = wav_bytes(61, rate=8000, channels=1)
        with self.assertRaises(ValueError) as caught:
            podcasts.store_reference(self.root, project["id"], self.cid, project["revision"],
                                     io.BytesIO(long_reference), len(long_reference))
        self.assertEqual(str(caught.exception), "speech_reference_limit")
        with self.assertRaises(podcasts.PodcastError) as caught:
            podcasts.import_audio(self.root, project["id"], self.sid, project["revision"],
                                  io.BytesIO(b"not a wav file at all"), 21)
        self.assertEqual(caught.exception.code, "invalid_podcast_import")
        self.assertEqual(list((self.root / "podcasts" / project["id"] / "staging").iterdir()), [])
        with self.assertRaises(podcasts.PodcastError) as caught:
            podcasts.begin_job(self.root, project["id"], project["revision"], str(uuid.uuid4()), "generate")
        self.assertEqual(caught.exception.code, "podcast_reference_required")

    def test_interrupted_job_reads_failed(self):
        project = self.create()
        podcasts.save(self.root, project["id"], {"revision": project["revision"], "segments": [
            {"id": self.sid, "character_id": None, "text": "x", "source": "imported"}]})
        project = podcasts.get(self.root, project["id"])
        clip = wav_bytes(0.2)
        project = podcasts.import_audio(self.root, project["id"], self.sid, project["revision"], io.BytesIO(clip), len(clip))
        podcasts.begin_job(self.root, project["id"], project["revision"], str(uuid.uuid4()), "assemble")
        podcasts._RUNNING.clear()
        project = podcasts.get(self.root, project["id"])
        self.assertEqual((project["status"], project["error"]), ("failed", "podcast_interrupted"))
        podcasts.save(self.root, project["id"], {"revision": project["revision"], "name": "recovered"})


    def _files(self, project_id):
        directory = self.root / "podcasts" / project_id
        return {str(path.relative_to(directory)): path.read_bytes()
                for path in sorted(directory.rglob("*")) if path.is_file() and "staging" not in path.parts}

    def _completed_project(self):
        project = self.create()
        reference = wav_bytes(1.0)
        project = podcasts.store_reference(self.root, project["id"], self.cid, project["revision"],
                                           io.BytesIO(reference), len(reference))
        clip = wav_bytes(0.3, rate=22050, channels=1)
        project = podcasts.import_audio(self.root, project["id"], self.sid, project["revision"],
                                        io.BytesIO(clip), len(clip))
        job = str(uuid.uuid4())
        plan = podcasts.begin_job(self.root, project["id"], project["revision"], job, "assemble")
        podcasts.compose(self.root, project["id"], job)
        podcasts.finish_job(self.root, project["id"], job, "completed")
        project = podcasts.get(self.root, project["id"])
        self.assertIsNotNone(project["export"])
        return project

    def test_write_failure_preserves_manifest_and_media(self):
        project = self._completed_project()
        pid, revision = project["id"], project["revision"]
        before = self._files(pid)
        self.assertEqual(sorted(before), ["characters/%s/voice-reference.wav" % self.cid, "export/podcast.wav",
                                          "project.json", "segments/%s.wav" % self.sid])
        new_reference, new_clip = wav_bytes(2.0), wav_bytes(0.7, rate=16000, channels=1)
        attempts = [
            lambda: podcasts.save(self.root, pid, {"revision": revision, "segments": [
                {**project["segments"][0], "text": "Changed"}]}),
            lambda: podcasts.save(self.root, pid, {"revision": revision, "characters": [], "segments": [
                {**project["segments"][0], "character_id": None}]}),
            lambda: podcasts.save(self.root, pid, {"revision": revision, "segments": []}),
            lambda: podcasts.store_reference(self.root, pid, self.cid, revision,
                                             io.BytesIO(new_reference), len(new_reference)),
            lambda: podcasts.import_audio(self.root, pid, self.sid, revision,
                                          io.BytesIO(new_clip), len(new_clip)),
        ]
        with patch.object(podcasts, "_write", side_effect=OSError("disk full")):
            for attempt in attempts:
                with self.assertRaises(OSError):
                    attempt()
                self.assertEqual(self._files(pid), before)
        self.assertEqual(list((self.root / "podcasts" / pid / "staging").iterdir()), [])
        self.assertEqual(podcasts.get(self.root, pid), project)
        # A committed edit still collects garbage after the manifest is durable.
        edited = podcasts.save(self.root, pid, {"revision": revision, "segments": []})
        self.assertIsNone(edited["export"])
        self.assertEqual(sorted(self._files(pid)), ["characters/%s/voice-reference.wav" % self.cid, "project.json"])

    def test_job_write_failure_preserves_published_media(self):
        project = self._completed_project()
        pid = project["id"]
        generated = str(uuid.uuid4())
        project = podcasts.save(self.root, pid, {"revision": project["revision"], "segments": [
            project["segments"][0], {"id": generated, "character_id": self.cid, "text": "Two",
                                     "purpose": "outro", "gap_seconds": 0}]})
        job = str(uuid.uuid4())
        plan = podcasts.begin_job(self.root, pid, project["revision"], job, "generate")
        source = self.root / "fish.wav"
        source.write_bytes(wav_bytes(0.4, rate=24000, channels=1))
        fingerprint = plan["segments"][0]["fingerprint"]
        podcasts.store_generated(self.root, pid, job, generated, source, fingerprint)
        podcasts.compose(self.root, pid, job)
        before, manifest = self._files(pid), podcasts.get(self.root, pid)
        source.write_bytes(wav_bytes(0.9, rate=24000, channels=1))
        real_write = podcasts._write
        with patch.object(podcasts, "_write", side_effect=OSError("disk full")):
            with self.assertRaises(OSError):
                podcasts.store_generated(self.root, pid, job, generated, source, fingerprint)
        self.assertEqual(self._files(pid), before)
        calls = []

        def fail_finish(output_root, data):
            calls.append(1)
            if len(calls) > 1:
                raise OSError("disk full")
            return real_write(output_root, data)
        with patch.object(podcasts, "_write", side_effect=fail_finish):
            with self.assertRaises(OSError):
                podcasts.compose(self.root, pid, job)
        after = self._files(pid)
        self.assertEqual({key: value for key, value in after.items() if key != "project.json"},
                         {key: value for key, value in before.items() if key != "project.json"})
        self.assertEqual(podcasts.get(self.root, pid)["export"], manifest["export"])
        self.assertEqual(list((self.root / "podcasts" / pid / "staging").iterdir()), [])
        podcasts.finish_job(self.root, pid, job, "failed", "disk full")

    def test_symlinked_media_ancestors_rejected(self):
        project = self._completed_project()
        directory = self.root / "podcasts" / project["id"]
        outside = self.root / "outside"
        for relative, kind, item in (("segments", "segment", self.sid), ("export", "export", None),
                                     (f"characters/{self.cid}", "reference", self.cid),
                                     ("characters", "reference", self.cid)):
            original = directory / relative
            original.rename(outside)
            original.symlink_to(outside, target_is_directory=True)
            try:
                with self.assertRaises(podcasts.PodcastError) as caught:
                    podcasts.media_file(self.root, project["id"], kind, item)
                self.assertEqual(caught.exception.code, "podcast_media_not_found")
            finally:
                original.unlink()
                outside.rename(original)
            self.assertTrue(podcasts.media_file(self.root, project["id"], kind, item).is_file())
        segments = directory / "segments"
        segments.rename(outside)
        segments.symlink_to(outside, target_is_directory=True)
        job = str(uuid.uuid4())
        podcasts.begin_job(self.root, project["id"], project["revision"], job, "assemble")
        with self.assertRaises(RuntimeError) as caught:
            podcasts.compose(self.root, project["id"], job)
        self.assertEqual(str(caught.exception), "podcast_storage_invalid")
        podcasts.finish_job(self.root, project["id"], job, "failed", "podcast_storage_invalid")

    def test_post_commit_cleanup_failure_logs_without_undoing_commit(self):
        project = self._completed_project()
        pid = project["id"]
        segment_file = self.root / "podcasts" / pid / "segments" / f"{self.sid}.wav"
        real_unlink = Path.unlink

        def failing_unlink(path, *args, **kwargs):
            if path == segment_file:
                raise PermissionError("locked")
            return real_unlink(path, *args, **kwargs)
        with patch.object(Path, "unlink", failing_unlink), \
                self.assertLogs("webapp.podcasts", level="WARNING") as logs:
            edited = podcasts.save(self.root, pid, {"revision": project["revision"], "segments": []})
        self.assertEqual(edited["segments"], [])
        self.assertEqual(podcasts.get(self.root, pid)["revision"], edited["revision"])
        self.assertTrue(any("garbage collection failed" in line and "locked" in line for line in logs.output))
        self.assertTrue(segment_file.exists())
        with patch.object(podcasts.shutil, "rmtree", side_effect=PermissionError("busy")), \
                self.assertLogs("webapp.podcasts", level="WARNING") as logs:
            podcasts._discard_tree(self.root / "missing-ok", "unit")
        self.assertIn("Podcast cleanup failed (unit)", logs.output[0])
        later = podcasts.save(self.root, pid, {"revision": edited["revision"], "name": "Retry"})
        self.assertFalse(segment_file.exists())
        self.assertEqual(later["name"], "Retry")

    def test_pcm_info_rejects_truncated_chunks(self):
        path = self.root / "bad.wav"
        cases = [
            b"RIFF" + struct.pack("<I", 24) + b"WAVE" + b"fmt " + struct.pack("<I", 4) + b"\x01\x00\x01\x00"
            + b"data" + struct.pack("<I", 2) + b"\x00\x00",
            b"RIFF" + struct.pack("<I", 20) + b"WAVE" + b"fmt " + struct.pack("<I", 16) + b"\x01\x00",
            b"RIFF" + struct.pack("<I", 8) + b"WAVE" + b"fmt ",
            b"RIFF" + struct.pack("<I", 4) + b"WAVX",
        ]
        for payload in cases:
            path.write_bytes(payload)
            with self.assertRaises(RuntimeError) as caught:
                podcasts.pcm_info(path)
            self.assertEqual(str(caught.exception), "podcast_media_invalid")


class PodcastHTTPTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        podcasts._RUNNING.clear()
        self.addCleanup(podcasts._RUNNING.clear)
        ready = {"model_ready": True, "runtime_ready": True, "runtime_error": ""}
        for target, value in (("OUTPUT_ROOT", self.root), ("_active_job_id", None), ("_active_workflow_id", None),
                              ("_jobs", {}),
                              ("_local_model_status", lambda model: ready),
                              ("_require_enabled_model", lambda model: None),
                              ("_local_model_path", lambda model: self.root / "model")):
            patcher = patch.object(server, target, value)
            patcher.start()
            self.addCleanup(patcher.stop)
            patcher = patch.object(server.speech, "voice_design_command", side_effect=lambda model, settings, model_path,
                                   description, text_path, output_path:
                                   fake_command(settings, model_path, Path(), "", text_path, output_path))
            patcher.start()
            self.addCleanup(patcher.stop)
        patcher = patch.object(server.speech, "command", fake_command)
        patcher.start()
        self.addCleanup(patcher.stop)
        self.httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
        thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)
        thread.start()
        self.addCleanup(self.httpd.server_close)
        self.addCleanup(self.httpd.shutdown)
        self.base = f"http://127.0.0.1:{self.httpd.server_address[1]}"
        self.cid, self.sid, self.sid2 = (str(uuid.uuid4()) for _ in range(3))

    def call(self, path, payload=None, data=None, headers=None, method=None):
        body = data if data is not None else (None if payload is None else json.dumps(payload).encode())
        request = Request(self.base + path, data=body, method=method or ("GET" if body is None else "POST"),
                          headers={"Content-Type": "application/json", **(headers or {})})
        try:
            with urlopen(request, timeout=30) as response:
                raw = response.read()
                kind = response.headers.get("Content-Type", "")
                return response.status, (json.loads(raw) if "json" in kind else raw), response.headers
        except HTTPError as exc:
            with exc:
                return exc.code, json.loads(exc.read()), exc.headers

    def create(self, texts=("Welcome", "Goodbye")):
        status, body, _ = self.call("/api/podcasts", {"name": "Show", "settings": {}, "characters": [
            {"id": self.cid, "name": "Host", "reference_text": "hello there", "consent": True}],
            "segments": [{"id": sid, "character_id": self.cid, "text": text, "purpose": "monologue",
                          "gap_seconds": 0.25} for sid, text in zip((self.sid, self.sid2), texts)]})
        self.assertEqual(status, 201, body)
        project = body["project"]
        data = wav_bytes(1.0)
        status, body, _ = self.call(f"/api/podcasts/{project['id']}/references/{self.cid}", data=data,
                                    headers={"Content-Type": "audio/wav", "X-Podcast-Revision": project["revision"]})
        self.assertEqual(status, 200, body)
        return body["project"]

    def raw_upload(self, path, length, revision):
        connection = http.client.HTTPConnection("127.0.0.1", self.httpd.server_address[1], timeout=30)
        try:
            connection.putrequest("POST", path)
            for name, value in (("Content-Type", "audio/wav"), ("Content-Length", str(length)),
                                ("X-Podcast-Revision", revision)):
                connection.putheader(name, value)
            connection.endheaders()  # No body is sent: the server must decide from Content-Length alone.
            response = connection.getresponse()
            return response.status, json.loads(response.read())
        finally:
            connection.close()

    def test_upload_size_boundaries_dispatch_before_reading_body(self):
        project = self.create()
        pid = project["id"]
        manifest = self.root / "podcasts" / pid / "project.json"
        before = manifest.read_bytes()
        cases = (("references", self.cid, server.speech.MAX_REFERENCE_BYTES, "store_reference", "speech_reference_limit"),
                 ("imports", self.sid, podcasts.MAX_IMPORT_BYTES, "import_audio", "podcast_import_limit"))
        for kind, item, limit, function, code in cases:
            with self.subTest(kind=kind):
                path = f"/api/podcasts/{pid}/{kind}/{item}"
                with patch.object(podcasts, function) as handler:
                    status, body = self.raw_upload(path, limit + 1, project["revision"])
                self.assertEqual((status, body["error"]), (413, code))
                handler.assert_not_called()
                self.assertEqual(manifest.read_bytes(), before)
                # Exactly MAX is accepted for dispatch; the stubbed handler reads nothing.
                with patch.object(podcasts, function, return_value=podcasts.get(self.root, pid)) as handler:
                    status, body = self.raw_upload(path, limit, project["revision"])
                self.assertEqual(status, 200, body)
                self.assertEqual(handler.call_args.args[-1], limit)
                self.assertEqual(handler.call_args.args[3], project["revision"])
                self.assertEqual(manifest.read_bytes(), before)

    def wait(self, project_id, done=("completed", "failed", "cancelled")):
        deadline = time.time() + 30
        while time.time() < deadline:
            _, body, _ = self.call(f"/api/podcasts/{project_id}")
            if body["project"]["status"] in done and server._active_job_id is None:
                return body
            time.sleep(0.1)
        self.fail("podcast job timed out")

    def test_list_static_and_path_safety(self):
        status, body, _ = self.call("/api/podcasts")
        self.assertEqual((status, body["items"], body["available"], body["model"]["model_ready"]), (200, [], True, True))
        self.assertEqual(body["model"]["id"], podcasts.MODEL)
        self.assertEqual(body["model"]["ready"], body["model"]["enabled"])
        with patch.object(server, "_settings_snapshot", lambda: {"models": {podcasts.MODEL: {"enabled": False}}}):
            model = self.call("/api/podcasts")[1]["model"]
        self.assertEqual((model["enabled"], model["ready"], model["model_ready"]), (False, False, True))
        status, script, headers = self.call("/podcast.js")
        self.assertEqual(status, 200)
        self.assertIn("javascript", headers["Content-Type"])
        project = self.create()
        for path in (f"/api/podcasts/{project['id']}/media/{self.sid}", "/api/podcasts/..%2f/media/x",
                     f"/api/podcasts/{project['id']}/export/audio", f"/api/podcasts/{uuid.uuid4()}"):
            status, body, _ = self.call(path)
            self.assertEqual(status, 404, path)
        character = project["characters"][0]
        self.assertEqual(character["reference_url"], character["reference"]["audio_url"])
        status, data, headers = self.call(character["reference_url"])
        self.assertEqual((status, headers["Content-Type"]), (200, "audio/wav"))
        stripped = {**project, "characters": [{key: character[key] for key in ("id", "name", "reference_text", "consent")}]}
        status, body, _ = self.call(f"/api/podcasts/{project['id']}/save", stripped)
        self.assertEqual(status, 200, body)
        self.assertEqual(body["project"]["characters"][0]["reference"], character["reference"])
        project = body["project"]
        status, body, _ = self.call(f"/api/podcasts/{project['id']}/save", {"revision": "stale", "name": "x"})
        self.assertEqual((status, body["error"]), (409, "podcast_conflict"))
        status, body, _ = self.call(f"/api/podcasts/{project['id']}/references/{self.cid}", data=b"RIFF",
                                    headers={"X-Podcast-Revision": "stale"})
        self.assertEqual((status, body["error"]), (409, "podcast_conflict"))

    def test_voice_design_generation_dispatches_selected_model(self):
        status, body, _ = self.call("/api/podcasts", {
            "name": "Voice Design", "settings": {"model": "voxcpm2-4bit"},
            "characters": [{"id": self.cid, "name": "Host", "reference_text": "",
                            "voice_description": "Bright, clear voice with measured pacing.", "consent": True}],
            "segments": [{"id": self.sid, "character_id": self.cid, "text": "Welcome.",
                          "purpose": "intro", "gap_seconds": 0}],
        })
        self.assertEqual(status, 201, body)
        project = body["project"]
        status, body, _ = self.call(f"/api/podcasts/{project['id']}/generate", {"revision": project["revision"]})
        self.assertEqual(status, 202, body)
        result = self.wait(project["id"])["project"]
        self.assertEqual(result["status"], "completed", result)
        self.assertEqual(result["segments"][0]["status"], "ready")
        server.speech.voice_design_command.assert_called_once()
        self.assertEqual(server.speech.voice_design_command.call_args.args[0], "voxcpm2-4bit")
        self.assertEqual(server.speech.voice_design_command.call_args.args[3],
                         "Bright, clear voice with measured pacing.")

    def test_generate_then_exports(self):
        project = self.create()
        status, body, _ = self.call(f"/api/podcasts/{project['id']}/generate", {"revision": project["revision"]})
        self.assertEqual(status, 202, body)
        self.assertEqual(body["job"]["kind"], "podcast")
        status, busy, _ = self.call(f"/api/podcasts/{project['id']}/assemble", {"revision": body["project"]["revision"]})
        self.assertEqual(status, 409)
        body = self.wait(project["id"])
        project = body["project"]
        self.assertEqual(project["status"], "completed", project)
        self.assertEqual([item["status"] for item in project["segments"]], ["ready", "ready"])
        self.assertEqual(project["segments"][0]["media"]["samples"], 24000)
        self.assertEqual(project["export"]["samples"], 24000 * 2 + 12000)
        self.assertEqual(project["exports"]["audio_url"], project["export"]["audio_url"])
        self.assertEqual(project["segments"][0]["audio_url"], project["segments"][0]["media"]["url"])
        self.assertIn("Podcast job complete.", project["logs"])
        resaved = self.call(f"/api/podcasts/{project['id']}/save", {**project, "name": "Echo"})
        self.assertEqual(resaved[0], 200, resaved[1])
        project = resaved[1]["project"]
        self.assertEqual(project["progress"], {"completed": 2, "total": 2, "current_segment_id": None, "stage": "done"})
        status, audio, headers = self.call(project["export"]["audio_url"])
        self.assertEqual((status, headers["Content-Type"], len(audio)), (200, "audio/wav", 44 + 60000 * 2))
        status, vtt, headers = self.call(project["export"]["vtt_url"])
        self.assertTrue(vtt.decode().startswith("WEBVTT\n\n00:00:00.000 --> 00:00:00.500\nWelcome"))
        self.assertIn("00:00:00.750 --> 00:00:01.250\nGoodbye", vtt.decode())
        status, srt, _ = self.call(project["segments"][1]["media"]["srt_url"])
        self.assertEqual(srt.decode(), "1\n00:00:00,000 --> 00:00:00,500\nGoodbye\n")
        status, segment, _ = self.call(project["segments"][0]["media"]["url"])
        self.assertEqual(status, 200)
        # Re-assemble from existing audio only, without Fish.
        with patch.object(server.speech, "command", side_effect=AssertionError("no fish")):
            status, body, _ = self.call(f"/api/podcasts/{project['id']}/assemble", {"revision": project["revision"]})
            self.assertEqual(status, 202, body)
            self.assertEqual(self.wait(project["id"])["project"]["status"], "completed")

    def test_failure_preserves_completed_segments(self):
        project = self.create(("Welcome", "FAIL here"))
        status, body, _ = self.call(f"/api/podcasts/{project['id']}/generate", {"revision": project["revision"]})
        self.assertEqual(status, 202, body)
        body = self.wait(project["id"])
        project = body["project"]
        self.assertEqual(project["status"], "failed")
        self.assertIn("fish_inference_failed", project["error"])
        self.assertEqual([item["status"] for item in project["segments"]], ["ready", "failed"])
        self.assertIsNotNone(project["segments"][0]["media"])
        self.assertIsNone(project["export"])
        self.assertEqual(body["job"]["status"], "failed")
        status, body, _ = self.call(f"/api/podcasts/{project['id']}/assemble", {"revision": project["revision"]})
        self.assertEqual((status, body["error"]), (409, "podcast_segment_audio_missing"))

    def test_cancel_running_generation(self):
        project = self.create(("SLOW one", "Two"))
        status, body, _ = self.call(f"/api/podcasts/{project['id']}/generate", {"revision": project["revision"]})
        self.assertEqual(status, 202, body)
        deadline = time.time() + 10
        while time.time() < deadline and not any("slow start" in line for line in server._jobs[body["job"]["id"]]["logs"]):
            time.sleep(0.05)
        status, body, _ = self.call(f"/api/podcasts/{project['id']}/cancel", {})
        self.assertEqual(status, 200, body)
        project = self.wait(project["id"])["project"]
        self.assertEqual(project["status"], "cancelled")
        self.assertEqual([item["status"] for item in project["segments"]], ["pending", "pending"])
        status, body, _ = self.call(f"/api/podcasts/{project['id']}/cancel", {})
        self.assertEqual((status, body["error"]), (409, "podcast_not_running"))

    def test_shared_busy_lock_and_model_gate(self):
        project = self.create()
        with patch.object(server, "_active_job_id", "other"):
            status, body, _ = self.call(f"/api/podcasts/{project['id']}/generate", {"revision": project["revision"]})
        self.assertEqual((status, body["error"]), (409, "job_already_running"))
        with patch.object(server, "_local_model_status",
                          lambda model: {"model_ready": False, "runtime_ready": True, "runtime_error": ""}):
            status, body, _ = self.call(f"/api/podcasts/{project['id']}/generate", {"revision": project["revision"]})
        self.assertEqual((status, body["error"]), (409, "local_model_not_ready"))
        def disabled(model):
            raise ValueError("generation_model_disabled")
        with patch.object(server, "_require_enabled_model", disabled):
            status, body, _ = self.call(f"/api/podcasts/{project['id']}/generate", {"revision": project["revision"]})
        self.assertEqual((status, body["error"]), (409, "generation_model_disabled"))
        self.assertEqual(self.call(f"/api/podcasts/{project['id']}")[1]["project"]["status"], "idle")

    def test_import_route_without_text(self):
        status, body, _ = self.call("/api/podcasts", {"name": "Imports", "characters": [], "segments": [
            {"id": self.sid, "character_id": None, "text": "", "purpose": "story", "gap_seconds": 0}]})
        project = body["project"]
        clip = wav_bytes(0.3)
        status, body, _ = self.call(f"/api/podcasts/{project['id']}/imports/{self.sid}", data=clip,
                                    headers={"X-Podcast-Revision": project["revision"]})
        self.assertEqual(status, 200, body)
        project = body["project"]
        self.assertEqual(project["segments"][0]["source"], "imported")
        status, body, _ = self.call(f"/api/podcasts/{project['id']}/generate", {"revision": project["revision"]})
        self.assertEqual(status, 202, body)
        project = self.wait(project["id"])["project"]
        self.assertEqual(project["status"], "completed")
        status, srt, _ = self.call(project["export"]["srt_url"])
        self.assertEqual((status, srt), (200, b""))


if __name__ == "__main__":
    unittest.main()
