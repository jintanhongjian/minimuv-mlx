"""Assistant Skill installation requires an explicit detected license selection."""

from __future__ import annotations

import unittest
from unittest.mock import patch

from webapp import assistant, server


class AssistantSkillInstallTests(unittest.TestCase):
    def setUp(self) -> None:
        self.revision = "a" * 40
        self.discovered = {
            "origin": "https://github.com/example/skill",
            "revision": self.revision,
            "files": [
                {"path": "skills/example.md", "license": False},
                {"path": "LICENSE", "license": True},
            ],
            "license_sources": [{
                "source": {
                    "origin": "https://github.com/example/skill",
                    "revision": self.revision,
                    "files": [{
                        "id": "source-1",
                        "path": "LICENSE",
                        "content": "MIT License",
                    }],
                },
                "detected_licenses": [{"license_name": "MIT", "path": "LICENSE"}],
            }],
        }

    def test_install_requires_and_binds_exact_detected_license(self) -> None:
        converted = {
            "validation": {"valid": True},
            "result": {"package": {"name": "example-skill", "version": "1.0.0"}},
        }
        with (
            patch.object(server, "_local_text_models", return_value=[{"id": "local-model"}]),
            patch.object(server.skill_sources, "discover", return_value=self.discovered),
            patch.object(server.skill_conversion, "confirm_detected_license") as confirm_license,
            patch.object(server.skill_sources, "fetch_files", return_value={"source": {"files": []}}) as fetch_files,
            patch.object(server, "_prepare_skill_request", return_value={
                "request": {"trusted_context": {"request_id": "request-id"}},
            }) as prepare,
            patch.object(server, "_convert_skill_request", return_value=converted),
            patch.object(server.skill_drafts, "save", return_value={"id": "draft-id", "revision": 3}),
            patch.object(server, "_skill_record", return_value={"record": True}),
            patch.object(server, "_skill_environment", return_value=({}, {})),
            patch.object(server.skill_installations, "apply_draft", return_value={"id": "installed-id"}),
        ):
            result = server._skill_install_from_url(
                "https://github.com/example/skill",
                "local-model",
                "MIT",
                "LICENSE",
            )

        confirm_license.assert_called_once_with({
            "origin": "https://github.com/example/skill",
            "revision": self.revision,
            "files": [{"path": "LICENSE", "content": "MIT License"}],
        }, "MIT", "LICENSE")
        fetch_files.assert_called_once_with({
            "origin": "https://github.com/example/skill",
            "revision": self.revision,
            "paths": ["skills/example.md"],
            "license_name": "MIT",
            "license_path": "LICENSE",
        })
        prepare.assert_called_once_with({"model": "local-model", "source": {"files": []}})
        self.assertEqual(result["license"], "MIT")
        self.assertEqual(result["license_path"], "LICENSE")
        self.assertEqual(result["revision"], self.revision)

    def test_undetected_license_is_rejected_before_review_or_fetch(self) -> None:
        with (
            patch.object(server, "_local_text_models", return_value=[{"id": "local-model"}]),
            patch.object(server.skill_sources, "discover", return_value=self.discovered),
            patch.object(server.skill_conversion, "confirm_detected_license") as confirm_license,
            patch.object(server.skill_sources, "fetch_files") as fetch_files,
        ):
            with self.assertRaisesRegex(ValueError, "skill_license_not_detected"):
                server._skill_install_from_url(
                    "https://github.com/example/skill",
                    "local-model",
                    "Apache-2.0",
                    "LICENSE",
                )

        confirm_license.assert_not_called()
        fetch_files.assert_not_called()

    def test_tool_schema_requires_license_and_is_confirmation_gated(self) -> None:
        tool = next(
            item["function"] for item in assistant.TOOLS
            if item["function"]["name"] == "install_skill_from_url"
        )
        self.assertEqual(
            set(tool["parameters"]["required"]),
            {"url", "model", "license_name", "license_path"},
        )
        self.assertIn("install_skill_from_url", assistant.WRITE_TOOLS)


if __name__ == "__main__":
    unittest.main()
