from __future__ import annotations

import copy
import json
import tempfile
import threading
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from webapp import prompt_settings, server


class PromptSettingsTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.path = Path(self.temporary.name) / "system_prompts.json"
        self.binding = patch.object(prompt_settings, "SETTINGS_PATH", self.path)
        self.binding.start()
        self.addCleanup(self.temporary.cleanup)
        self.addCleanup(self.binding.stop)

    def test_defaults_do_not_write_and_keep_existing_instruction_contracts(self):
        current = prompt_settings.snapshot()
        self.assertFalse(self.path.exists())
        self.assertEqual(set(current["config"]["profiles"]), set(prompt_settings.PROFILE_FIELDS))
        for mode, phrase in (("video", "text-to-video"), ("image", "text-to-image"),
                             ("music", "music generation")):
            text = prompt_settings.enhancement(mode)
            self.assertTrue(text.startswith("You are a faithful prompt editor."))
            self.assertIn(phrase, text)
            self.assertIn('{"keywords":["..."],"optimized_prompt":"..."}', text)
            self.assertIn("same language", text)
        text = prompt_settings.storyboard(48)
        self.assertIn("exactly 48 chronological shots", text)
        self.assertIn('"music_prompt":"..."', text)
        self.assertIn("5, 8, 10, 15 seconds", text)

    def test_saved_settings_persist_and_are_read_by_next_backend_requests(self):
        current = prompt_settings.snapshot()
        config = current["config"]
        config["profiles"]["enhancement"]["role"] = "你是忠实的编辑。"
        config["profiles"]["storyboard"]["rules"] = "Keep the original ending."
        saved = prompt_settings.save(config, current["revision"])
        self.assertNotEqual(saved["revision"], current["revision"])
        self.assertEqual(self.path.stat().st_mode & 0o777, 0o600)
        self.assertEqual(json.loads(self.path.read_text()), saved["config"])
        self.assertNotEqual(saved["config"], saved["defaults"])
        with patch.object(server, "_local_text_models", return_value=[{"id": "local"}]), patch.object(
            server, "_request_local_text_json", return_value={
                "keywords": ["boat"], "optimized_prompt": "A boat",
            }
        ) as request:
            server._enhance_prompt_with_local_model({"model": "local", "mode": "video", "prompt": "boat"})
        self.assertTrue(request.call_args.args[1].startswith("你是忠实的编辑。"))
        with patch.object(server, "_local_text_models", return_value=[{"id": "local"}]), patch.object(
            server, "_request_local_text_json", return_value={
                "shots": [{"title": "Boat", "prompt": "A boat", "duration": 5, "music_prompt": "Piano"}],
            }
        ) as request:
            server._storyboard_with_local_model({"model": "local", "story": "boat", "shot_count": 1})
        self.assertIn("Keep the original ending.", request.call_args.args[1])
        self.assertIn("exactly 1 chronological shots", request.call_args.args[1])

    def test_invalid_configs_never_overwrite_saved_settings(self):
        current = prompt_settings.snapshot()
        prompt_settings.save(current["config"], current["revision"])
        original = self.path.read_bytes()
        for change in (
            lambda c: c.update(version=True),
            lambda c: c.update(extra="field"),
            lambda c: c["profiles"].pop("video"),
            lambda c: c["profiles"]["video"].update(task=" "),
            lambda c: c["profiles"]["video"].update(task="a" * 6001),
            lambda c: c["profiles"]["video"].update(task=None),
            lambda c: c["profiles"]["video"].update(task="a\x00b"),
            lambda c: c["profiles"]["video"].update(task="{shot_count}"),
            lambda c: c["profiles"]["storyboard"].update(task="No count"),
            lambda c: c["profiles"]["storyboard"].update(task="{shot_count} {shot_count}"),
            lambda c: c["profiles"]["video"].update(extra="unknown"),
        ):
            with self.subTest(change=change):
                config = copy.deepcopy(current["config"])
                change(config)
                with self.assertRaises(ValueError):
                    prompt_settings.save(config, prompt_settings.snapshot()["revision"])
                self.assertEqual(self.path.read_bytes(), original)

    def test_unicode_byte_budget_and_invalid_shot_counts(self):
        config = prompt_settings.snapshot()["config"]
        for profile in config["profiles"].values():
            for field in profile:
                profile[field] = "文" * 5000
        config["profiles"]["storyboard"]["task"] = "{shot_count}"
        with self.assertRaisesRegex(ValueError, "prompt_config_too_large"):
            prompt_settings.validate(config)
        for count in (True, 0, 49, "8", 1.5):
            with self.subTest(count=count), self.assertRaises(ValueError):
                prompt_settings.storyboard(count)

    def test_stale_revision_and_external_edit_are_not_overwritten(self):
        current = prompt_settings.snapshot()
        saved = prompt_settings.save(current["config"], current["revision"])
        with self.assertRaises(prompt_settings.PromptConflict):
            prompt_settings.save(current["config"], current["revision"])
        self.path.write_text(json.dumps(saved["config"]) + "\n ")
        data = self.path.read_bytes()
        with self.assertRaises(prompt_settings.PromptConflict):
            prompt_settings.save(saved["config"], saved["revision"])
        self.assertEqual(self.path.read_bytes(), data)

    def test_corrupt_override_is_reported_not_replaced_by_defaults(self):
        self.path.write_text("{bad")
        with self.assertRaisesRegex(RuntimeError, "prompt_settings_unavailable"):
            prompt_settings.enhancement("video")
        self.assertEqual(self.path.read_text(), "{bad")

    def test_failed_atomic_write_preserves_previous_config_and_cleans_temp(self):
        current = prompt_settings.snapshot()
        saved = prompt_settings.save(current["config"], current["revision"])
        original = self.path.read_bytes()
        with patch.object(prompt_settings.os, "replace", side_effect=OSError("disk full")):
            with self.assertRaisesRegex(RuntimeError, "prompt_settings_save_failed"):
                prompt_settings.save(saved["config"], saved["revision"])
        self.assertEqual(self.path.read_bytes(), original)
        self.assertEqual(list(self.path.parent.iterdir()), [self.path])

    def test_api_save_conflict_validation_origin_and_corrupt_read(self):
        httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()
        base = f"http://127.0.0.1:{httpd.server_port}/api/system-prompts"
        try:
            with urlopen(base) as response:
                current = json.load(response)
            body = json.dumps({"config": current["config"], "revision": current["revision"]}).encode()
            with urlopen(Request(base, data=body, headers={"Content-Type": "application/json"})) as response:
                self.assertEqual(response.status, 200)
                saved = json.load(response)
            for data, headers, code in (
                (body, {}, 409),
                (body, {"Origin": "https://evil.invalid"}, 403),
                (b"{}", {}, 400),
                (b"null", {}, 400),
                (b"{bad", {}, 400),
                (b"x" * (server.MAX_REQUEST_BYTES + 1), {}, 400),
            ):
                with self.subTest(code=code, data=data[:20]), self.assertRaises(HTTPError) as error:
                    urlopen(Request(base, data=data, headers=headers))
                self.assertEqual(error.exception.code, code)
                error.exception.close()
            self.assertEqual(prompt_settings.snapshot()["revision"], saved["revision"])
            self.path.write_text("{bad")
            with self.assertRaises(HTTPError) as error:
                urlopen(base)
            self.assertEqual(error.exception.code, 500)
            error.exception.close()
        finally:
            httpd.shutdown()
            httpd.server_close()
            thread.join()


if __name__ == "__main__":
    unittest.main()
