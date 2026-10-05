from __future__ import annotations

import hashlib
import json
import ssl
import subprocess
import sys
import tempfile
import threading
import unittest
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from unittest.mock import Mock, patch
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from types import SimpleNamespace

from webapp import model_downloads as downloads
from webapp import server


class TransferTests(unittest.TestCase):
    def test_download_tls_loads_public_roots_and_keeps_verification_enabled(self):
        context = downloads._download_ssl_context()
        self.assertEqual(context.verify_mode, ssl.CERT_REQUIRED)
        self.assertTrue(context.check_hostname)
        self.assertGreater(len(context.get_ca_certs()), 0)
        with patch.object(downloads.ssl, "create_default_context") as default_context:
            with patch.object(downloads.certifi, "where", return_value="/test/ca.pem"):
                self.assertIs(downloads._download_ssl_context(), default_context.return_value)
            default_context.assert_called_once_with()
            default_context.return_value.load_verify_locations.assert_called_once_with(cafile="/test/ca.pem")

    def test_tls_failure_preserves_existing_partial_and_passes_verified_context(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary).resolve()
            partial = root / "weights.incomplete"
            partial.write_bytes(b"retained-prefix")
            context = downloads._download_ssl_context()
            with patch.object(downloads, "_download_ssl_context", return_value=context), patch.object(
                downloads, "urlopen", side_effect=ssl.SSLCertVerificationError("untrusted certificate")
            ) as request:
                with self.assertRaises(ssl.SSLCertVerificationError):
                    downloads.transfer("https://example.com/weights", partial, root / "weights",
                                       100, "a" * 64)
            self.assertIs(request.call_args.kwargs["context"], context)
            self.assertEqual(request.call_args.args[0].get_header("Range"), "bytes=15-")
            self.assertEqual(partial.read_bytes(), b"retained-prefix")
            self.assertFalse((root / "weights").exists())

    @classmethod
    def setUpClass(cls):
        cls.content = b"resumable-model-weight" * 1000
        cls.ranges = []
        owner = cls

        class Handler(BaseHTTPRequestHandler):
            def do_GET(self):
                offset = int(self.headers.get("Range", "bytes=0-")[6:-1])
                owner.ranges.append(offset)
                refuse = self.path == "/refuse"
                wrong = self.path == "/wrong"
                body = owner.content[0 if refuse else offset:]
                if self.path == "/short":
                    body = body[:len(body) // 2]
                self.send_response(200 if refuse or not offset else 206)
                if not refuse and offset:
                    self.send_header("Content-Range",
                                     f"bytes {offset + int(wrong)}-{len(owner.content)-1}/{len(owner.content)}")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)

            def log_message(self, *args):
                pass

        cls.httpd = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()
        cls.url = f"http://127.0.0.1:{cls.httpd.server_port}"

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()
        cls.thread.join()

    def test_real_range_resumes_existing_bytes_and_verifies_hash(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary).resolve()
            partial = root / "weights.incomplete"
            target = root / "weights.safetensors"
            partial.write_bytes(self.content[:7000])
            downloads.transfer(self.url, partial, target, len(self.content),
                               hashlib.sha256(self.content).hexdigest())
            self.assertEqual(self.ranges[-1], 7000)
            self.assertEqual(target.read_bytes(), self.content)
            self.assertFalse(partial.exists())

    def test_range_rejection_and_wrong_range_preserve_prefix(self):
        for path in ("/refuse", "/wrong"):
            with self.subTest(path=path), tempfile.TemporaryDirectory() as temporary:
                root = Path(temporary).resolve()
                partial = root / "weights.incomplete"
                partial.write_bytes(self.content[:600])
                with self.assertRaises(downloads.ResumeError):
                    downloads.transfer(self.url + path, partial, root / "weights",
                                       len(self.content), hashlib.sha256(self.content).hexdigest())
                self.assertEqual(partial.read_bytes(), self.content[:600])
                self.assertFalse((root / "weights").exists())

    def test_bad_hash_retains_full_partial_without_publishing(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary).resolve()
            partial = root / "weights.incomplete"
            with self.assertRaises(downloads.ResumeError):
                downloads.transfer(self.url, partial, root / "weights", len(self.content), "0" * 64)
            self.assertEqual(partial.read_bytes(), self.content)
            self.assertFalse((root / "weights").exists())

    def test_interrupted_response_keeps_appended_data_for_next_attempt(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary).resolve()
            partial = root / "weights.incomplete"
            partial.write_bytes(self.content[:600])
            checksum = hashlib.sha256(self.content).hexdigest()
            with self.assertRaises(ConnectionError):
                downloads.transfer(self.url + "/short", partial, root / "weights", len(self.content), checksum)
            resumed_size = partial.stat().st_size
            self.assertGreater(resumed_size, 600)
            downloads.transfer(self.url, partial, root / "weights", len(self.content), checksum)
            self.assertEqual(self.ranges[-1], resumed_size)
            self.assertEqual((root / "weights").read_bytes(), self.content)

    def test_git_blob_sha1_and_existing_complete_partial(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary).resolve()
            partial = root / "metadata.incomplete"
            partial.write_bytes(self.content)
            digest = hashlib.sha1(f"blob {len(self.content)}\0".encode() + self.content).hexdigest()
            downloads.transfer(self.url, partial, root / "metadata", len(self.content), digest)
            self.assertEqual((root / "metadata").read_bytes(), self.content)

    def test_empty_file_and_unknown_checksum(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary).resolve()
            partial = root / "empty.incomplete"
            downloads.transfer(self.url, partial, root / "empty", 0, hashlib.sha1(b"blob 0\0").hexdigest())
            self.assertEqual((root / "empty").stat().st_size, 0)
            partial.write_bytes(b"retained")
            with self.assertRaises(downloads.ResumeError):
                downloads._verify(partial, 8, "unknown")
            self.assertEqual(partial.read_bytes(), b"retained")

    def test_worker_uses_pinned_metadata_existing_prefix_and_preserves_strict_cache(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary).resolve()
            directory = root / "model"
            state = root / "state"
            etag = hashlib.sha256(self.content).hexdigest()
            partial = downloads._partial(directory, "weights", etag, len(self.content))
            partial.write_bytes(self.content[:500])
            metadata = SimpleNamespace(etag=etag, size=len(self.content), location=self.url)
            spec = {"repository": "public/test", "revision": "a" * 40, "exclude": [], "strict_tree": True}
            info = SimpleNamespace(sha="a" * 40, siblings=[SimpleNamespace(rfilename="weights")])
            with patch.object(downloads, "STATE_ROOT", state), patch.object(downloads, "_spec", return_value=spec), patch(
                "huggingface_hub.HfApi"
            ) as api, patch("huggingface_hub.get_hf_file_metadata", return_value=metadata):
                api.return_value.model_info.return_value = info
                downloads.worker("h3", directory)
                self.assertEqual(self.ranges[-1], 500)
                self.assertEqual((directory / "weights").read_bytes(), self.content)
                self.assertFalse((directory / ".cache").exists())
                identity = state / downloads._identity("h3", directory)
                self.assertTrue(list(identity.glob("retained-hf-cache-*")))
                self.assertEqual(json.loads((identity / "result.json").read_text())["status"], "completed")
                plan = json.loads((identity / "plan.json").read_text())
                self.assertEqual(plan["revision"], "a" * 40)
                api.return_value.model_info.assert_called_once_with("public/test", revision="a" * 40, token=False)

    def test_largest_same_etag_fragment_selected_and_duplicates_retained(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary).resolve()
            canonical = downloads._partial(root, "nested/weights", "a" * 64, 100)
            canonical.write_bytes(b"a" * 10)
            old = canonical.with_name(canonical.name.replace(".incomplete", ".1234abcd.incomplete"))
            old.write_bytes(b"a" * 70)
            other = canonical.with_name(canonical.name.replace("a" * 64, "b" * 64))
            other.write_bytes(b"b" * 80)
            selected = downloads._partial(root, "nested/weights", "a" * 64, 100)
            self.assertEqual(selected.read_bytes(), b"a" * 70)
            self.assertEqual(other.stat().st_size, 80)
            self.assertEqual(sum(p.stat().st_size for p in canonical.parent.glob("*.incomplete")), 160)

    def test_oversized_and_symlink_destinations_fail_closed(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary).resolve()
            partial = downloads._partial(root, "weights", "a" * 64, 100)
            partial.write_bytes(b"x" * 101)
            with self.assertRaises(downloads.ResumeError):
                downloads._partial(root, "weights", "a" * 64, 100)
            self.assertEqual(partial.stat().st_size, 101)
            with self.assertRaises(downloads.ResumeError):
                downloads._safe_path(root, "../outside")
            (root / "link").symlink_to(root)
            with self.assertRaises(downloads.ResumeError):
                downloads._safe_path(root, "link/weights")


class ManagerTests(unittest.TestCase):
    def test_cli_uses_project_worker_and_adds_shared_dependencies(self):
        from scripts import download_local_models
        for model, companion in (("ltx-2.3-distilled-q4", "gemma-3-12b-it-4bit"),
                                 ("yue2-3b-8bit", "yue2-vae")):
            with self.subTest(model=model), patch.object(sys, "argv", [
                "download_local_models", "--model", model, "--root", "/tmp/cli-models"
            ]), patch.object(downloads, "worker") as worker:
                download_local_models.main()
                self.assertEqual([call.args[0] for call in worker.call_args_list], [model, companion])

    def test_real_owned_child_stops_on_pause_without_blocking_caller(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary).resolve()
            original_popen = subprocess.Popen
            children = []
            ready = threading.Event()

            def spawn(*args, **kwargs):
                child = original_popen([sys.executable, "-c", "import time; time.sleep(60)"],
                                       stdout=kwargs["stdout"], stderr=kwargs["stderr"])
                children.append(child)
                ready.set()
                return child

            with patch.object(downloads, "STATE_ROOT", root / "state"), patch.dict(
                downloads._jobs, {}, clear=True
            ), patch.object(downloads, "_external", return_value=False), patch.object(
                downloads.subprocess, "Popen", side_effect=spawn
            ):
                try:
                    downloads.start("h3", root / "model", root / "gemma")
                    job = downloads._jobs[downloads._identity("h3", root / "model")]
                    thread = job["thread"]
                    self.assertTrue(ready.wait(5))
                    self.assertIsNone(children[0].poll())
                    downloads.pause("h3", root / "model", root / "gemma")
                    thread.join(timeout=15)
                    self.assertIsNone(job["thread"])
                    self.assertEqual(job["state"], "paused")
                    self.assertTrue(all(child.poll() is not None for child in children))
                finally:
                    downloads.shutdown()

    def test_all_settings_models_and_dependencies_are_registered(self):
        for model in server._DEFAULT_SETTINGS["models"]:
            targets = downloads.components(model, Path("/tmp/model"), Path("/tmp/gemma"))
            self.assertEqual(targets[0][0], model)
            self.assertTrue(downloads._spec(model)["repository"])
        self.assertEqual(downloads.components("ltx-2.3-distilled-q4", Path("/tmp/ltx"), Path("/tmp/gemma"))[1][0],
                         "gemma-3-12b-it-4bit")
        self.assertEqual(downloads.components("yue2-3b-8bit", Path("/tmp/yue"), Path("/tmp/gemma"))[1][0],
                         "yue2-vae")

    def test_external_transfer_is_not_started_or_paused(self):
        with patch.object(downloads, "_external", return_value=True), patch.object(downloads, "threading") as threads:
            for control in (downloads.start, downloads.pause):
                with self.assertRaisesRegex(RuntimeError, "download_external_active"):
                    control("h3", Path("/tmp/test-model"), Path("/tmp/gemma"))
            threads.Thread.assert_not_called()

    def test_duplicate_start_and_pause_scope(self):
        with tempfile.TemporaryDirectory() as temporary:
            target = Path(temporary).resolve()
            key = downloads._identity("h3", target)
            event = threading.Event()
            unrelated = threading.Event()
            with patch.dict(downloads._jobs, {
                key: {"thread": Mock(), "event": event},
                "other": {"thread": Mock(), "event": unrelated},
            }, clear=True), patch.object(downloads, "_external", return_value=False), patch.object(
                downloads.threading, "Thread"
            ) as thread:
                downloads.start("h3", target, target)
                thread.assert_not_called()
                downloads.pause("h3", target, target)
                self.assertTrue(event.is_set())
                self.assertFalse(unrelated.is_set())

    def test_live_destinations_cannot_be_changed_but_names_can(self):
        previous = json.loads(json.dumps(server._DEFAULT_SETTINGS))
        updated = json.loads(json.dumps(previous))
        path = Path(previous["models"]["h3"]["model_path"]).expanduser()
        key = downloads._identity("h3", path)
        with patch.dict(downloads._jobs, {key: {"thread": Mock()}}, clear=True):
            updated["models"]["h3"]["name"] = "Renamed"
            downloads.assert_paths_idle(previous, updated)
            updated["models"]["h3"]["model_path"] = "/tmp/different-model"
            with self.assertRaisesRegex(ValueError, "Pause active downloads"):
                downloads.assert_paths_idle(previous, updated)

    def test_supervisor_success_blocked_retry_and_pause(self):
        for code in (0, 42, 1):
            with self.subTest(code=code), tempfile.TemporaryDirectory() as temporary:
                state_root = Path(temporary).resolve()
                event = Mock()
                event.is_set.return_value = False
                event.wait.return_value = False
                process = Mock()
                process.poll.return_value = code
                process.wait.return_value = code
                with patch.object(downloads, "STATE_ROOT", state_root), patch.dict(
                    downloads._jobs, {"test": {"thread": Mock(), "state": "downloading", "error": ""}}, clear=True
                ), patch.object(downloads.subprocess, "Popen", return_value=process) as spawn:
                    downloads._supervise("test", "h3", state_root / "model", event)
                    self.assertEqual(spawn.call_count, 12 if code == 1 else 1)
                    status = json.loads((state_root / "test/status.json").read_text())
                    self.assertEqual(status["state"], "completed" if code == 0 else "error")
                    if code == 1:
                        self.assertEqual(event.wait.call_count, 11)
                        event.wait.assert_called_with(300)

    def test_pause_terminates_owned_process_and_persists_state(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary).resolve()
            event = Mock()
            event.is_set.side_effect = [False, True]
            event.wait.return_value = True
            process = Mock()
            process.poll.return_value = None
            process.wait.return_value = -15
            with patch.object(downloads, "STATE_ROOT", root), patch.dict(
                downloads._jobs, {"test": {"thread": Mock(), "state": "downloading", "error": ""}}, clear=True
            ), patch.object(downloads.subprocess, "Popen", return_value=process):
                downloads._supervise("test", "h3", root / "model", event)
                process.terminate.assert_called_once()
                process.kill.assert_not_called()
                self.assertEqual(json.loads((root / "test/status.json").read_text())["state"], "paused")

    def test_progress_counts_maximum_matching_prefix_once_and_survives_restart(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary).resolve()
            target = root / "model"
            key = downloads._identity("h3", target)
            with patch.object(downloads, "STATE_ROOT", root / "state"), patch.dict(downloads._jobs, {}, clear=True):
                downloads._write(downloads.STATE_ROOT / key / "plan.json", {
                    "files": [{"path": "weights", "size": 100, "etag": "a" * 64}],
                })
                partial = downloads._partial(target, "weights", "a" * 64, 100)
                partial.write_bytes(b"a" * 60)
                duplicate = partial.with_name(partial.name.replace(".incomplete", ".1234abcd.incomplete"))
                duplicate.write_bytes(b"a" * 30)
                downloads._write(downloads.STATE_ROOT / key / "status.json", {"state": "error", "error": "Range refused"})
                result = downloads.progress("h3", target, root)
                self.assertEqual(result["downloaded_bytes"], 60)
                self.assertEqual(result["download_percent"], 60)
                self.assertEqual(result["download_error"], "Range refused")
                self.assertEqual(result["download_state"], "error")


class DownloadApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()
        cls.url = f"http://127.0.0.1:{cls.httpd.server_port}"

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()
        cls.thread.join()

    def test_controls_use_only_registered_saved_destinations(self):
        settings = server._DEFAULT_SETTINGS
        with patch.object(server, "_settings_snapshot", return_value=settings):
            for model in settings["models"]:
                for action in ("start", "pause"):
                    with self.subTest(model=model, action=action), patch.object(
                        downloads, action
                    ) as control, patch.object(server, "_storage_lock") as storage_lock:
                        with urlopen(Request(self.url + f"/api/models/{model}/download/{action}", data=b"", method="POST")) as response:
                            self.assertEqual(response.status, 202)
                        storage_lock.__enter__.assert_called_once()
                        control.assert_called_once_with(
                            model, Path(settings["models"][model]["model_path"]).expanduser(),
                            Path(settings["gemma_path"]).expanduser())
            for model, headers, data, expected in (
                ("unknown", {}, b"", 400), ("h3", {"Origin": "https://evil.invalid"}, b"", 403),
                ("h3", {}, b"arbitrary-path", 400),
                ("ltx-2.3-unknown", {}, b"", 400),
                ("ltx-2.3-distilled-q4", {"Origin": "https://evil.invalid"}, b"", 403),
                ("ltx-2.3-distilled-q8", {}, b"arbitrary-path", 400),
            ):
                with self.assertRaises(HTTPError) as failure:
                    urlopen(Request(self.url + f"/api/models/{model}/download/start", headers=headers, data=data, method="POST"))
                self.assertEqual(failure.exception.code, expected)
                failure.exception.close()

    def test_conflicts_are_visible_and_models_endpoint_contains_all_progress(self):
        with patch.object(server, "_settings_snapshot", return_value=server._DEFAULT_SETTINGS), patch.object(
            downloads, "start", side_effect=RuntimeError("download_external_active")
        ):
            with self.assertRaises(HTTPError) as failure:
                urlopen(Request(self.url + "/api/models/h3/download/start", data=b"", method="POST"))
            self.assertEqual(failure.exception.code, 409)
            self.assertEqual(json.loads(failure.exception.read())["error"], "download_external_active")
            failure.exception.close()
        with urlopen(self.url + "/api/models") as response:
            payload = json.loads(response.read())
        self.assertEqual(set(payload["downloads"]), set(server._DEFAULT_SETTINGS["models"]))


if __name__ == "__main__":
    unittest.main()
