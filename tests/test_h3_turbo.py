import hashlib
import json
import tempfile
import threading
import unittest
from collections import deque
from pathlib import Path
from unittest.mock import patch
from urllib.request import Request, urlopen

from webapp import generation_limits, h3_turbo, server


class TurboV4Tests(unittest.TestCase):
    def setUp(self):
        h3_turbo._verified.cache_clear()
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        self.base = self.root / "base"
        self.base.mkdir()
        for name in (*h3_turbo.FILES, "turbo_lora.safetensors", "tokenizer_config.json"):
            (self.base / name).write_bytes(b"original")
        self.adapter = self.root / "v4.safetensors"
        self.adapter.write_bytes(b"new-adapter")
        self.hash = hashlib.sha256(b"new-adapter").hexdigest()
        self.size_patch = patch.object(h3_turbo, "SIZE", self.adapter.stat().st_size)
        self.hash_patch = patch.object(h3_turbo, "SHA256", self.hash)
        self.size_patch.start()
        self.hash_patch.start()
        self.addCleanup(self.size_patch.stop)
        self.addCleanup(self.hash_patch.stop)
        self.addCleanup(h3_turbo._verified.cache_clear)

    def test_view_preserves_base_and_uses_only_verified_v4(self):
        view = h3_turbo.prepare(self.base, self.adapter, self.root / "views")
        self.assertEqual((view / "turbo_lora.safetensors").resolve(), self.adapter)
        self.assertEqual((view / "transformer.safetensors").resolve(),
                         self.base / "transformer.safetensors")
        self.assertEqual((self.base / "turbo_lora.safetensors").read_bytes(), b"original")
        self.assertEqual(view, h3_turbo.prepare(self.base, self.adapter, self.root / "views"))
        self.assertTrue(view.name.startswith("MiniMax-H3-Turbo-v4-"))
        other = self.root / "other-base"
        other.mkdir()
        for name in h3_turbo.FILES:
            (other / name).write_bytes(b"original")
        self.assertNotEqual(view, h3_turbo.prepare(other, self.adapter, self.root / "views"))

    def test_bad_missing_adapter_and_changed_bytes_fail_without_fallback(self):
        self.assertFalse(h3_turbo.status(self.root / "missing")["model_ready"])
        self.assertTrue(h3_turbo.status(self.adapter)["model_ready"])
        self.adapter.write_bytes(b"bad-adapter")
        self.assertFalse(h3_turbo.status(self.adapter)["model_ready"])
        with self.assertRaisesRegex(RuntimeError, "v4 unavailable"):
            h3_turbo.prepare(self.base, self.adapter, self.root / "views")
        self.assertFalse((self.root / "views").exists())

    def test_runtime_conflict_does_not_overwrite_third_party_files(self):
        view = h3_turbo.prepare(self.base, self.adapter, self.root / "views")
        target = view / "turbo_lora.safetensors"
        target.unlink()
        target.write_bytes(b"third-party")
        with self.assertRaisesRegex(RuntimeError, "conflict"):
            h3_turbo.prepare(self.base, self.adapter, self.root / "views")
        self.assertEqual(target.read_bytes(), b"third-party")
        (self.base / "audio_vae.safetensors").unlink()
        with self.assertRaisesRegex(RuntimeError, "missing required"):
            h3_turbo.prepare(self.base, self.adapter, self.root / "views")

    def test_loading_rejects_loaded_v1_and_binds_v4_model_id(self):
        view = h3_turbo.prepare(self.base, self.adapter, self.root / "views")
        jobs = {"turbo-test": {"cancel_requested": False, "logs": deque(maxlen=100)}}
        old = {"id": "MiniMax-H3-FL2VA-MLX-Serve-4bit", "state": "ready"}
        new = {"id": view.name, "state": "ready"}
        with patch.object(server, "_jobs", jobs), patch.object(
            server, "_settings_snapshot", return_value={"video": {"model_id": ""}}
        ), patch.object(server.h3_turbo, "prepare", return_value=view), patch.object(
            server, "_start_mlx_server"
        ) as start, patch.object(server, "_service_models", side_effect=[[old], [old, new]]), patch.object(
            server, "_request_json"
        ) as request, patch.object(server, "_h3_reload_required", False):
            self.assertEqual(server._load_h3_model("turbo-test", self.base), view.name)
            start.assert_called_once_with("turbo-test", view)
            request.assert_called_once_with(
                "/v1/load-model", {"model": str(view), "default": True}, timeout=1800,
            )
        self.assertTrue(any("v4-600 EMA verified" in line for line in jobs["turbo-test"]["logs"]))

    def test_standard_does_not_require_v4_and_conflicting_id_is_explicit(self):
        jobs = {"turbo-test": {"cancel_requested": False, "logs": deque(maxlen=100)}}
        with patch.object(server, "_jobs", jobs), patch.object(
            server, "_settings_snapshot", return_value={"video": {"model_id": "old-id"}}
        ), patch.object(server.h3_turbo, "prepare", return_value=self.root / "MiniMax-H3-Turbo-v4-test") as prepare, patch.object(
            server, "_start_mlx_server"
        ), patch.object(server, "_service_models", return_value=[{"id": "old-id", "capabilities": ["video", "h3"]}]), patch.object(
            server, "_find_h3_model_id", return_value="old-id"
        ), patch.object(server, "_h3_reload_required", False):
            self.assertEqual(server._load_h3_model("turbo-test", self.base, turbo=False), "old-id")
            prepare.assert_not_called()
            with self.assertRaisesRegex(RuntimeError, "Clear the H3 model ID"):
                server._load_h3_model("turbo-test", self.base)

    def test_v4_range_and_transport_recipe(self):
        for steps in range(4, 9):
            self.assertEqual(generation_limits.validate_steps(steps, "h3"), steps)
        for steps in (2, 3, 9):
            with self.assertRaises(ValueError):
                generation_limits.validate_steps(steps, "h3")
        request = server._generation_request("v4", {
            "prompt": "test", "width": 512, "height": 288, "num_frames": 124,
            "steps": 6, "seed": 0, "turbo": True,
        })
        self.assertTrue(request["turbo"])
        self.assertNotIn("lora_paths", request, "v4 is the Turbo adapter, not an additional style LoRA")

    def test_h3_load_endpoint_uses_base_path_without_generation_settings(self):
        httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()
        done = threading.Event()

        def loaded(job_id, model_path):
            self.assertEqual(model_path, self.base)
            done.set()
            return "MiniMax-H3-Turbo-v4-test"

        try:
            with patch.object(server, "_jobs", {}), patch.object(
                server, "_active_job_id", None
            ), patch.object(server, "_active_workflow_id", None), patch.object(
                server, "_require_enabled_model"
            ), patch.object(server, "_service_health", return_value=True), patch.object(
                server, "_find_models", return_value=[self.base]
            ), patch.object(server, "_load_h3_model", side_effect=loaded) as load:
                request = Request(
                    f"http://127.0.0.1:{httpd.server_port}/api/models/load",
                    data=b"{}", headers={"Content-Type": "application/json"},
                )
                with urlopen(request, timeout=5) as response:
                    self.assertEqual(response.status, 202)
                    result = json.load(response)
                self.assertTrue(done.wait(2))
                self.assertIn("job", result)
                load.assert_called_once()
        finally:
            httpd.shutdown()
            httpd.server_close()
            thread.join(timeout=2)


if __name__ == "__main__":
    unittest.main()
