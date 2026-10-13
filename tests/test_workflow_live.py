from __future__ import annotations

import http.client
import json
import tempfile
import threading
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from webapp import server, workflows
from test_workflows import make_payload, fake_boundary_frame


class WorkflowLiveTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.manifest = workflows.create_workflow(self.root, make_payload())
        self.old_job = server._active_job_id
        self.old_workflow = server._active_workflow_id
        server._active_job_id = None
        server._active_workflow_id = None
        self.addCleanup(self.cleanup_jobs)
        self.root_patch = patch.object(server, "OUTPUT_ROOT", self.root)
        self.root_patch.start()
        self.addCleanup(self.root_patch.stop)

    def cleanup_jobs(self):
        for job_id in list(server._jobs):
            if server._jobs[job_id].get("workflow_id") == self.manifest["id"]:
                del server._jobs[job_id]
        server._active_job_id = self.old_job
        server._active_workflow_id = self.old_workflow
        server._workflow_cancel_events.pop(self.manifest["id"], None)
        workflows.mark_workflow_live(self.manifest["id"], False)

    def run_step(self, outcomes, *, music=False, kind="video"):
        calls = []

        def generate(job_id, *args):
            calls.append(job_id)
            server._append_log(job_id, f"model progress {len(calls)}")
            server._jobs[job_id].update(outcomes[len(calls) - 1])
            server._active_job_id = None

        with patch.object(server, "_run_music_job" if music else "_run_job", side_effect=generate), \
                patch.object(server.time, "sleep") as wait:
            result = server._run_workflow_step(
                self.manifest, self.manifest["shots"][0], kind,
                {"prompt": "scene"}, Path("model"), music=music, index=0,
            )
        return calls, result, wait

    def test_transport_failure_classification_is_conservative(self):
        for code in (408, 429, 502, 503, 504):
            self.assertTrue(server._retryable_generation_error(HTTPError("", code, "", {}, None)))
        for code in (400, 401, 403, 404, 500):
            self.assertFalse(server._retryable_generation_error(HTTPError("", code, "", {}, None)))
        for error in (TimeoutError(), URLError(ConnectionRefusedError()),
                      http.client.IncompleteRead(b""), server.TransientGenerationError()):
            self.assertTrue(server._retryable_generation_error(error))
        for error in (RuntimeError("out of memory"), ValueError("invalid duration"),
                      PermissionError("denied"), URLError("certificate failure")):
            self.assertFalse(server._retryable_generation_error(error))
        try:
            raise TimeoutError("stream stalled")
        except TimeoutError as cause:
            error = server.UnconfirmedH3Termination("remote inference may remain active")
            error.__cause__ = cause
            self.assertFalse(server._retryable_generation_error(error))

    def test_retries_once_and_persists_logs_without_changing_parameters(self):
        calls, result, wait = self.run_step([
            {"status": "failed", "error": "connection reset", "retryable": True},
            {"status": "completed", "video_path": "video.mp4"},
        ])
        self.assertEqual(len(set(calls)), 2)
        self.assertEqual(result["status"], "completed")
        wait.assert_called_once_with(5)
        saved = workflows.get_workflow(self.root, self.manifest["id"])
        self.assertEqual(saved["shots"][0]["attempts"], 2)
        self.assertTrue(any("retrying" in line for line in saved["logs"]))
        self.assertTrue(any("model progress" in line for line in saved["logs"]))
        self.assertIsNone(self.manifest["failure"])

    def test_unconfirmed_h3_stream_failure_closes_response_without_retry(self):
        class Response:
            def __init__(self, failure):
                self.failure = failure
                self.closed = False

            def __iter__(self):
                if self.failure is not None:
                    raise self.failure
                return iter(())

            def close(self):
                self.closed = True

        job_id = "stream-failure-test"
        self.addCleanup(lambda: server._jobs.pop(job_id, None))
        for failure in (None, TimeoutError("stalled"), http.client.IncompleteRead(b"")):
            with self.subTest(failure=failure):
                response = Response(failure)
                server._jobs[job_id] = {"cancel_requested": False}
                with patch.object(server, "_generation_request", return_value={}), \
                        patch.object(server, "urlopen", return_value=response) as request:
                    with self.assertRaises(server.UnconfirmedH3Termination) as raised:
                        server._request_h3_generation(job_id, "model", {})
                self.assertFalse(server._retryable_generation_error(raised.exception))
                request.assert_called_once()
                self.assertTrue(response.closed)
                self.assertIsNone(server._jobs[job_id]["response"])

    def test_retry_exhaustion_and_permanent_errors_stop(self):
        for retryable, expected in ((True, 3), (False, 1)):
            calls = []

            def generate(job_id, *args):
                calls.append(job_id)
                server._jobs[job_id].update(status="failed", error="failure", retryable=retryable)
                server._active_job_id = None

            with patch.object(server, "_run_job", side_effect=generate), \
                    patch.object(server.time, "sleep") as wait:
                with self.assertRaisesRegex(RuntimeError, "video 1: failure"):
                    server._run_workflow_step(self.manifest, self.manifest["shots"][0],
                                              "video", {"prompt": "p"}, Path("m"), index=0)
            self.assertEqual(len(calls), expected)
            self.assertEqual(wait.call_count, expected - 1)
            self.assertEqual(self.manifest["failure"]["attempts"], expected)

    def test_cancel_during_retry_wait_does_not_start_another_job(self):
        event = threading.Event()
        server._workflow_cancel_events[self.manifest["id"]] = event

        def generate(job_id, *args):
            server._jobs[job_id].update(status="failed", error="timeout", retryable=True)
            server._active_job_id = None

        with patch.object(server, "_run_job", side_effect=generate) as runner, \
                patch.object(event, "wait", side_effect=lambda seconds: event.set()):
            with self.assertRaises(server.GenerationCancelled):
                server._run_workflow_step(self.manifest, self.manifest["shots"][0],
                                          "video", {"prompt": "p"}, Path("m"), index=0)
        self.assertEqual(runner.call_count, 1)

    def test_music_and_soundtrack_share_retry_policy(self):
        for kind, key in (("music", "music_job_id"), ("soundtrack", "job_id")):
            calls, _, _ = self.run_step([
                {"status": "failed", "error": "temporary", "retryable": True},
                {"status": "completed", "audio_path": "audio.wav"},
            ], music=True, kind=kind)
            self.assertEqual(self.manifest["shots"][0][key], calls[-1])

    def test_public_api_exposes_live_logs_and_real_steps(self):
        job_id = server._start_workflow_job(self.manifest["id"], "video", "p")
        server._jobs[job_id].update(status="running", progress={"stage": "denoise", "step": 2, "total": 8})
        server._append_log(job_id, "denoise: step 2/8")
        self.manifest.update(status="running", started_at=server.time.time() - 4,
                             phase="video", current_unit=1)
        public = server._public_workflow(self.manifest)
        self.assertEqual(public["active_job"]["progress"]["step"], 2)
        self.assertIn("denoise: step 2/8", public["logs"])
        self.assertEqual(public["progress"], {"completed": 0, "total": 2, "percent": 0.0})
        self.assertGreaterEqual(public["elapsed_seconds"], 4)
        self.assertIsNotNone(public["active_job"]["last_log_at"])

    def test_local_video_progress_tracks_actual_stages_and_clears_steps_for_decode(self):
        job_id = server._start_workflow_job(self.manifest["id"], "video", "p")
        job = server._jobs[job_id]
        job.update(status="running", local_video_progress=True)
        for line, stage, step, total in (
            ("[Loading text encoder (Gemma)] ...", "Loading text encoder (Gemma)", None, None),
            ("[Encoding prompt] ...", "Encoding prompt", None, None),
            ("[estimate] denoising: 8 steps x 1 passes over 512 video + 126 audio tokens = 8 forwards",
             "Denoising 1", 0, 8),
            ("Denoising:  50%|#####     | 4/8 [00:15<00:14, 3.74s/it]", "Denoising 1", 4, 8),
            ("Denoising: 100%|##########| 8/8 [00:30<00:00, 3.86s/it]", "Denoising 1", 8, 8),
            ("[estimate] denoising: 3 steps x 1 passes over 2048 video + 126 audio tokens = 3 forwards",
             "Denoising 2", 0, 3),
            ("Denoising:  33%|###       | 1/3 [00:13<00:26, 13.31s/it]", "Denoising 2", 1, 3),
            ("[Loading decoders (VAE + audio + vocoder)] ...",
             "Loading decoders (VAE + audio + vocoder)", None, None),
            ("[Decoding video + audio + muxing] ...", "Decoding video + audio + muxing", None, None),
        ):
            server._append_log(job_id, line)
            progress = server._public_workflow(self.manifest)["active_job"]["progress"]
            self.assertEqual((progress["stage"], progress["step"], progress["total"]),
                             (stage, step, total))
        self.assertEqual(job["progress"]["stage_index"], 2)
        self.assertNotEqual(server._public_workflow(self.manifest)["progress"]["percent"], 100)

    def test_local_progress_ignores_other_models_and_invalid_or_regressing_steps(self):
        job_id = server._start_workflow_job(self.manifest["id"], "video", "p")
        job = server._jobs[job_id]
        estimate = "[estimate] denoising: 8 steps x 1 passes over 512 video"
        server._append_log(job_id, estimate)
        self.assertNotIn("progress", job)
        job["local_video_progress"] = True
        server._append_log(job_id, estimate)
        server._append_log(job_id, "Denoising: 50%|#####| 4/8 [00:15]")
        expected = job["progress"].copy()
        for line in ("Denoising: 50%|#####| 9/8 [00:15]",
                     "Denoising: 50%|#####| 2/8 [00:15]",
                     "Denoising: 50%|#####| 4/3 [00:15]",
                     "[estimate] denoising: ~22 s remaining (refined)",
                     "[estimate] denoising: 0 steps x 1 passes",
                     "TOKENS: 42"):
            server._append_log(job_id, line)
            self.assertEqual(job["progress"], expected)
        self.assertEqual(job["tokens"], 42)
        self.assertIn("TOKENS: 42", job["logs"])

    def test_runner_retries_then_advances_to_next_shot_and_assembly(self):
        payload = make_payload()
        payload["shots"].append({**payload["shots"][0], "title": "Second"})
        self.manifest = workflows.create_workflow(self.root, payload)
        requests = []

        def generate(job_id, settings, model, output):
            requests.append(settings.copy())
            job = server._jobs[job_id]
            if len(requests) == 1:
                job.update(status="failed", error="reset", retryable=True)
            else:
                output.write_bytes(b"video")
                job.update(status="completed", video_path=output)
            server._active_job_id = None

        def assemble(root, manifest, *args):
            path = workflows.workflow_directory(root, manifest["id"]) / "final.mp4"
            path.write_bytes(b"video")
            return path

        with patch.object(server, "_find_models", return_value=[Path("model")]), \
                patch.object(server, "_settings_snapshot", return_value={"video": {"api_params": {}}}), \
                patch.object(server, "_run_job", side_effect=generate), \
                patch.object(server.time, "sleep"), \
                patch.object(server.shutil, "which", return_value="ffmpeg"), \
                patch.object(workflows, "extract_first_frame", side_effect=fake_boundary_frame), \
                patch.object(workflows, "extract_last_frame", side_effect=fake_boundary_frame), \
                patch.object(workflows, "assemble_workflow", side_effect=assemble):
            server._run_workflow(self.manifest["id"])
        saved = workflows.get_workflow(self.root, self.manifest["id"])
        assert saved is not None
        self.assertEqual(saved["status"], "completed", saved["error"])
        self.assertEqual(len(requests), 3)
        self.assertEqual(requests[0], requests[1])
        self.assertIsNotNone(requests[2].get("first_frame_image"))
        self.assertEqual(server._public_workflow(saved)["progress"]["percent"], 100)
        self.assertTrue(any("Workflow completed" in line for line in saved["logs"]))


class WorkflowDeletionTests(unittest.TestCase):
    def test_clear_http_is_single_project_and_requires_explicit_media_choice(self):
        with tempfile.TemporaryDirectory() as temporary, patch.object(server, "OUTPUT_ROOT", Path(temporary)):
            root = Path(temporary)
            manifest = workflows.create_workflow(root, make_payload())
            other = workflows.create_workflow(root, make_payload())
            httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
            thread = threading.Thread(target=httpd.serve_forever, daemon=True)
            thread.start()
            url = f"http://127.0.0.1:{httpd.server_port}/api/workflows/{manifest['id']}/clear-shots"
            try:
                for payload, headers, code in (
                    ({}, {}, 400), ({"delete_media": False}, {"Origin": "https://evil.invalid"}, 403),
                ):
                    with self.assertRaises(HTTPError) as failure:
                        urlopen(Request(url, method="POST", headers=headers,
                                        data=json.dumps(payload).encode()))
                    self.assertEqual(failure.exception.code, code)
                    failure.exception.close()
                with urlopen(Request(url, method="POST", data=b'{"delete_media":false}')) as response:
                    saved = json.loads(response.read())["workflow"]
                self.assertEqual(saved["id"], manifest["id"])
                self.assertEqual(saved["shots"], [])
                self.assertEqual(len(workflows.get_workflow(root, other["id"])["shots"]), 1)
                self.assertEqual(len(workflows.list_workflows(root)), 2)
            finally:
                httpd.shutdown()
                httpd.server_close()
                thread.join()

    def test_keep_media_removes_manifest_but_not_generated_or_shared_files(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            manifest = workflows.create_workflow(root, make_payload())
            directory = workflows.workflow_directory(root, manifest["id"])
            video = directory / "final.mp4"
            video.write_bytes(b"video")
            shared = root / "shared.wav"
            shared.write_bytes(b"shared")
            workflows.delete_workflows(root, [manifest["id"]], delete_media=False)
            self.assertIsNone(workflows.get_workflow(root, manifest["id"]))
            self.assertTrue(video.exists())
            self.assertTrue(shared.exists())
            self.assertEqual(workflows.list_workflows(root), [])

    def test_delete_media_only_removes_project_directory_files(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            manifest = workflows.create_workflow(root, make_payload())
            directory = workflows.workflow_directory(root, manifest["id"])
            (directory / "final.mp4").write_bytes(b"video")
            shared = root / "shared.wav"
            shared.write_bytes(b"shared")
            manifest["soundtrack"]["music_source_path"] = str(shared)
            workflows.save_workflow(root, manifest)
            workflows.delete_workflows(root, [manifest["id"]], delete_media=True)
            self.assertFalse(directory.exists())
            self.assertTrue(shared.exists())

    def test_batch_preflight_blocks_active_and_symlink_without_partial_deletion(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            first = workflows.create_workflow(root, make_payload())
            second = workflows.create_workflow(root, make_payload())
            workflows.mark_workflow_live(second["id"], True)
            try:
                with self.assertRaisesRegex(ValueError, "workflow_delete_active"):
                    workflows.delete_workflows(root, [first["id"], second["id"]], delete_media=True)
            finally:
                workflows.mark_workflow_live(second["id"], False)
            self.assertIsNotNone(workflows.get_workflow(root, first["id"]))
            directory = workflows.workflow_directory(root, second["id"])
            shared = root / "shared.mp4"
            shared.write_bytes(b"keep")
            (directory / "unsafe.mp4").symlink_to(shared)
            with self.assertRaisesRegex(ValueError, "workflow_delete_unsafe"):
                workflows.delete_workflows(root, [first["id"], second["id"]], delete_media=True)
            self.assertTrue(shared.exists())
            self.assertIsNotNone(workflows.get_workflow(root, first["id"]))

    def test_delete_http_requires_local_origin_and_explicit_media_choice(self):
        with tempfile.TemporaryDirectory() as temporary, patch.object(server, "OUTPUT_ROOT", Path(temporary)):
            manifest = workflows.create_workflow(Path(temporary), make_payload())
            httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
            thread = threading.Thread(target=httpd.serve_forever, daemon=True)
            thread.start()
            url = f"http://127.0.0.1:{httpd.server_port}/api/workflows/{manifest['id']}"
            try:
                for payload, headers, code in (
                    ({}, {}, 409), ({"delete_media": False}, {"Origin": "https://evil.invalid"}, 403),
                ):
                    with self.assertRaises(HTTPError) as failure:
                        urlopen(Request(url, method="DELETE", headers=headers,
                                        data=json.dumps(payload).encode()))
                    self.assertEqual(failure.exception.code, code)
                    failure.exception.close()
                with urlopen(Request(url, method="DELETE", data=b'{"delete_media":false}')) as response:
                    self.assertEqual(json.loads(response.read())["deleted"], [manifest["id"]])
            finally:
                httpd.shutdown()
                httpd.server_close()
                thread.join()
