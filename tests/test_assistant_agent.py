"""The assistant agent loop must gate write tools behind explicit confirmation."""

from __future__ import annotations

import unittest
from unittest.mock import patch

from webapp import assistant


def _completion(message: dict) -> dict:
    return {"choices": [{"message": message}]}


class AssistantAgentTests(unittest.TestCase):
    def setUp(self) -> None:
        self.calls: list[tuple[str, dict]] = []

    def executor(self, name: str, arguments: dict) -> object:
        self.calls.append((name, arguments))
        return {"tool": name, "ok": True}

    def run_with(self, messages: list[dict], replies: list[dict]) -> dict:
        queue = list(replies)
        with patch.object(assistant, "_chat_completion", side_effect=lambda *a, **k: queue.pop(0)):
            return assistant.run_agent("http://127.0.0.1:8000", "m", messages, self.executor)

    def test_direct_answer_returns_done(self) -> None:
        result = self.run_with([{"role": "user", "content": "hi"}], [_completion({"content": "hello"})])
        self.assertEqual(result["status"], "done")
        self.assertEqual(result["content"], "hello")
        self.assertEqual(self.calls, [])

    def test_read_tool_executes_inline_then_answers(self) -> None:
        replies = [
            _completion({"content": "", "tool_calls": [
                {"id": "1", "function": {"name": "get_settings", "arguments": "{}"}},
            ]}),
            _completion({"content": "read"}),
        ]
        result = self.run_with([{"role": "user", "content": "settings?"}], replies)
        self.assertEqual(result["status"], "done")
        self.assertEqual(self.calls, [("get_settings", {})])

    def test_write_tool_is_not_executed_until_confirmed(self) -> None:
        write_call = {"id": "2", "function": {
            "name": "update_prompts",
            "arguments": '{"profile": "video", "field": "task", "text": "x"}',
        }}
        result = self.run_with([{"role": "user", "content": "change it"}], [_completion({"content": "", "tool_calls": [write_call]})])
        self.assertEqual(result["status"], "needs_confirmation")
        self.assertEqual(self.calls, [], "write tool must not run before confirmation")
        self.assertEqual(result["tool_calls"][0]["name"], "update_prompts")

        with patch.object(assistant, "_chat_completion", return_value=_completion({"content": "done"})):
            confirmed = assistant.confirm(result["pending_id"], True, self.executor)
        self.assertEqual(confirmed["status"], "done")
        self.assertEqual(self.calls, [("update_prompts", {"profile": "video", "field": "task", "text": "x"})])

    def test_creation_write_confirmation_includes_the_plan_text(self) -> None:
        result = self.run_with(
            [{"role": "user", "content": "Create a video"}],
            [_completion({
                "content": "Plan: generate a 5-second video, 720p, 4 steps.",
                "tool_calls": [{
                    "id": "create-1",
                    "function": {
                        "name": "create_planned_content",
                        "arguments": '{"plan_id": "plan-1"}',
                    },
                }],
            })],
        )
        self.assertEqual(result["status"], "needs_confirmation")
        self.assertIn("5-second video", result["content"])
        self.assertEqual(self.calls, [])

    def test_mixed_preflight_and_write_runs_only_reads_before_reconsidering(self) -> None:
        result = self.run_with(
            [{"role": "user", "content": "Create a video"}],
            [
                _completion({"content": "", "tool_calls": [
                    {"id": "plan-1", "function": {
                        "name": "plan_creation",
                        "arguments": '{"kind":"video","payload":{"prompt":"forest"}}',
                    }},
                    {"id": "create-1", "function": {
                        "name": "create_planned_content",
                        "arguments": '{"plan_id":"plan-1"}',
                    }},
                ]}),
                _completion({"content": "Preflight complete; please review the plan."}),
            ],
        )
        self.assertEqual(result["status"], "done")
        self.assertEqual(self.calls, [("plan_creation", {
            "kind": "video", "payload": {"prompt": "forest"},
        })])

    def test_rejected_write_is_never_executed(self) -> None:
        write_call = {"id": "3", "function": {"name": "update_settings", "arguments": "{}"}}
        result = self.run_with([{"role": "user", "content": "x"}], [_completion({"content": "", "tool_calls": [write_call]})])
        rejected = assistant.confirm(result["pending_id"], False, self.executor)
        self.assertEqual(rejected["status"], "cancelled")
        self.assertEqual(self.calls, [])

    def test_unknown_pending_id_is_rejected(self) -> None:
        with self.assertRaises(ValueError):
            assistant.confirm("00000000-0000-0000-0000-000000000000", True, self.executor)

    def test_non_loopback_service_url_is_refused(self) -> None:
        with self.assertRaises(RuntimeError):
            assistant._chat_completion("http://example.com", "m", [], None)

    def test_tool_sets_partition_read_and_write(self) -> None:
        names = {tool["function"]["name"] for tool in assistant.TOOLS}
        self.assertEqual(names, assistant.READ_TOOLS | assistant.WRITE_TOOLS)
        self.assertFalse(assistant.READ_TOOLS & assistant.WRITE_TOOLS)


if __name__ == "__main__":
    unittest.main()
