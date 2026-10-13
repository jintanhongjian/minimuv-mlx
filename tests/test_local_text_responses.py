"""Local text completion envelope errors must not hide behind a choices KeyError."""

from __future__ import annotations

import io
import json
import unittest
from unittest.mock import patch

from webapp import server


class LocalTextResponseTests(unittest.TestCase):
    settings = {"service_url": "http://127.0.0.1:8000", "api_params": {"max_tokens": 500}}

    def request(self, value: object, strict: bool) -> dict:
        transport = patch.object(server, "_skill_text_response", return_value=value) if strict else (
            patch.object(server, "urlopen", return_value=io.BytesIO(json.dumps(value).encode()))
        )
        with transport:
            return server._request_local_text_json(
                "test-model", "system", "source", strict=strict, text_snapshot=self.settings,
            )

    def test_service_error_envelope_preserves_message_without_choices_keyerror(self) -> None:
        for strict in (False, True):
            with self.subTest(strict=strict), self.assertRaisesRegex(
                RuntimeError, r"service reported an error.*Model requires 16GB"
            ):
                self.request({"error": {"message": "Model requires 16GB", "type": "resource_error"}}, strict)

    def test_string_service_error_is_not_replaced_with_choices(self) -> None:
        for strict in (False, True):
            with self.subTest(strict=strict), self.assertRaisesRegex(RuntimeError, "model_not_found"):
                self.request({"error": "model_not_found"}, strict)

    def test_missing_choices_reports_protocol_error(self) -> None:
        for strict in (False, True):
            for value in ({}, {"content": "{}"}, [], {"choices": []}, {"choices": "wrong"}):
                with self.subTest(strict=strict, value=value), self.assertRaisesRegex(
                    RuntimeError, "invalid completion envelope"
                ):
                    self.request(value, strict)

    def test_valid_completion_retains_both_paths(self) -> None:
        value = {"choices": [{"finish_reason": "stop", "message": {"content": '{"ok":true}'}}]}
        for strict in (False, True):
            self.assertEqual(self.request(value, strict), {"ok": True})
            self.assertEqual(self.request({**value, "error": None}, strict), {"ok": True})

    def test_service_error_has_bounded_detail(self) -> None:
        with self.assertRaises(RuntimeError) as caught:
            self.request({"error": {"message": "x" * 10000}}, True)
        self.assertLess(len(str(caught.exception)), 2200)
        self.assertIn("service reported an error", str(caught.exception))


if __name__ == "__main__":
    unittest.main()
