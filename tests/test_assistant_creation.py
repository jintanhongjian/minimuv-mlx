from __future__ import annotations

import unittest
from unittest.mock import patch

from webapp import server


def _ready_status(model: str) -> dict:
    return {
        "id": model,
        "enabled": True,
        "model_ready": True,
        "runtime_ready": True,
        "server_ready": True,
    }


class AssistantCreationTests(unittest.TestCase):
    def setUp(self) -> None:
        with server._assistant_creation_plans_lock:
            server._assistant_creation_plans.clear()

    def preflight_patches(self):
        return (
            patch.object(server, "_assistant_workflow_snapshot", return_value=[]),
            patch.object(server, "_assistant_creation_model_status", side_effect=_ready_status),
            patch.object(server, "_active_job_id", None),
            patch.object(server, "_active_workflow_id", None),
            patch.object(server.mv_analysis, "active", return_value=False),
        )

    def test_video_preflight_uses_backend_validation_and_binds_plan(self) -> None:
        with self.preflight_patches()[0], self.preflight_patches()[1], \
                self.preflight_patches()[2], self.preflight_patches()[3], self.preflight_patches()[4]:
            result = server._assistant_plan_creation("video", {"prompt": "A quiet forest"})

        self.assertTrue(result["plan_id"])
        self.assertEqual(result["validated_parameters"]["model"], "h3")
        self.assertGreater(result["validated_parameters"]["frames"], 0)
        self.assertEqual(result["blockers"], [])

    def test_invalid_payload_returns_actionable_blocker_without_plan(self) -> None:
        with patch.object(server, "_assistant_workflow_snapshot", return_value=[]):
            result = server._assistant_plan_creation("image", {"prompt": " "})

        self.assertIsNone(result["plan_id"])
        self.assertIn("invalid_prompt", result["blockers"])
        self.assertIn("prompt", result["required_parameters"])

    def test_unready_model_blocks_creation(self) -> None:
        with patch.object(server, "_assistant_workflow_snapshot", return_value=[]), \
                patch.object(server, "_assistant_creation_model_status", return_value={
                    "id": "h3", "enabled": True, "model_ready": False, "runtime_ready": True,
                    "server_ready": True,
                }), patch.object(server, "_active_job_id", None), \
                patch.object(server, "_active_workflow_id", None), \
                patch.object(server.mv_analysis, "active", return_value=False):
            result = server._assistant_plan_creation("video", {"prompt": "A quiet forest"})

        self.assertIsNone(result["plan_id"])
        self.assertIn("h3:model_not_ready", result["blockers"])

    def test_model_state_is_rechecked_after_confirmation_and_before_dispatch(self) -> None:
        plan_context = self.preflight_patches()
        with plan_context[0], plan_context[1], plan_context[2], plan_context[3], plan_context[4]:
            plan = server._assistant_plan_creation("video", {"prompt": "A quiet forest"})

        post = patch.object(server, "_assistant_post_creation")
        confirm_context = self.preflight_patches()
        with confirm_context[0], \
                patch.object(server, "_assistant_creation_model_status", return_value={
                    "id": "h3", "enabled": True, "model_ready": False,
                    "runtime_ready": True, "server_ready": True,
                }), confirm_context[2], confirm_context[3], confirm_context[4], post as post_mock:
            with self.assertRaisesRegex(ValueError, "h3:model_not_ready"):
                server._assistant_create_planned_content(plan["plan_id"], 43210)

        post_mock.assert_not_called()

    def test_confirmed_plan_posts_to_existing_generation_api_once(self) -> None:
        plan_context = self.preflight_patches()
        with plan_context[0], plan_context[1], plan_context[2], plan_context[3], plan_context[4]:
            plan = server._assistant_plan_creation("video", {"prompt": "A quiet forest"})
        calls = []
        with self.preflight_patches()[0], self.preflight_patches()[1], \
                self.preflight_patches()[2], self.preflight_patches()[3], self.preflight_patches()[4], \
                patch.object(server, "_assistant_post_creation",
                             side_effect=lambda port, path, payload: calls.append((port, path, payload)) or {
                                 "job": {"id": "job-1", "status": "queued"},
                             }):
            result = server._assistant_create_planned_content(plan["plan_id"], 43210)

        self.assertEqual(result["kind"], "video")
        self.assertEqual(calls[0][0:2], (43210, "/api/jobs"))
        self.assertEqual(calls[0][2]["prompt"], "A quiet forest")
        with self.assertRaisesRegex(ValueError, "plan_expired"):
            server._assistant_create_planned_content(plan["plan_id"], 43210)

    def test_long_video_plan_reports_shots_and_starts_existing_workflow_api(self) -> None:
        payload = {
            "name": "Forest",
            "model": "ltx-2.3-distilled-q4",
            "shots": [{"title": "Dawn", "prompt": "Sunlight through trees", "duration": 5, "steps": 8}],
            "soundtrack": {"mode": "none", "strategy": "none"},
        }
        plan_context = self.preflight_patches()
        with plan_context[0], plan_context[1], plan_context[2], plan_context[3], plan_context[4]:
            plan = server._assistant_plan_creation("long_video", payload)
        self.assertEqual(plan["validated_parameters"]["shot_count"], 1)
        self.assertIn("Start the workflow", plan["steps"][2])

        posts = []
        responses = iter([
            {"workflow": {"id": "b93e8c07-17a0-4efb-a619-c1f19795e1cf", "status": "draft"}},
            {"workflow": {"id": "b93e8c07-17a0-4efb-a619-c1f19795e1cf", "status": "queued"}},
        ])
        confirm_context = self.preflight_patches()
        with confirm_context[0], confirm_context[1], confirm_context[2], confirm_context[3], confirm_context[4], \
                patch.object(server, "_assistant_post_creation",
                             side_effect=lambda port, path, body: posts.append(path) or next(responses)):
            result = server._assistant_create_planned_content(plan["plan_id"], 43210)

        self.assertTrue(result["started"])
        self.assertEqual(posts, [
            "/api/workflows",
            "/api/workflows/b93e8c07-17a0-4efb-a619-c1f19795e1cf/start",
        ])


if __name__ == "__main__":
    unittest.main()
