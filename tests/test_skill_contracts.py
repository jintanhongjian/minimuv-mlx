"""Validate proposed Skill artifacts, not the unimplemented installer."""

from __future__ import annotations

import copy
import json
import unittest
from pathlib import Path

from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ROOT / "skill-spec"


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


class SkillContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.schema = read_json(ARTIFACTS / "skill-conversion.schema.json")
        cls.request = read_json(ARTIFACTS / "examples" / "request.json")
        cls.draft = read_json(ARTIFACTS / "examples" / "draft.json")
        cls.blocked = read_json(ARTIFACTS / "examples" / "blocked.json")
        cls.validator = Draft202012Validator(cls.schema)

    def definition(self, name: str) -> Draft202012Validator:
        return Draft202012Validator({
            "$schema": self.schema["$schema"],
            "$ref": f"#/$defs/{name}",
            "$defs": self.schema["$defs"],
        })

    def assert_invalid(self, payload: dict) -> None:
        self.assertFalse(self.validator.is_valid(payload))

    def assert_example_links(self, request: dict, result: dict) -> None:
        """Fixture assertions for host checks H01-H05, not a public validator."""
        context = request["trusted_context"]
        for field in ("request_id", "capability_snapshot_id", "source_snapshot_id"):
            self.assertEqual(result[field], context[field])
        if result["status"] == "blocked":
            self.assertIsNone(result["package"])
            if context["license_status"] != "verified":
                self.assertIn(
                    f"license-{context['license_status']}",
                    [item["code"] for item in result["report"]["blockers"]],
                )
            return
        self.assertEqual(context["license_status"], "verified")
        allowed = {(item["task"], item["mode"]): item for item in context["allowed_bindings"]}
        files = {item["id"]: item["content"] for item in request["source_material"]["files"]}
        self.assertEqual(len(files), len(request["source_material"]["files"]))
        seen = set()
        evidence = [item["evidence"] for item in result["report"]["removed"]]
        for binding in result["package"]["bindings"]:
            key = (binding["task"], binding["mode"])
            self.assertNotIn(key, seen)
            seen.add(key)
            self.assertIn(key, allowed)
            if binding["target_models"] == ["*"]:
                self.assertTrue(allowed[key]["generic_allowed"])
            else:
                self.assertTrue(set(binding["target_models"]) <= set(allowed[key]["model_ids"]))
            self.assertLessEqual(len(binding["instructions"]), context["max_instruction_chars"])
            evidence.extend(binding["evidence"])
        for item in evidence:
            self.assertIn(item["file_id"], files)
            self.assertIn(item["excerpt"], files[item["file_id"]])

    def test_schema_and_all_definitions_are_valid(self) -> None:
        Draft202012Validator.check_schema(self.schema)
        for name in self.schema["$defs"]:
            Draft202012Validator.check_schema(self.definition(name).schema)

    def test_examples_validate(self) -> None:
        self.definition("request").validate(self.request)
        self.validator.validate(self.draft)
        self.validator.validate(self.blocked)
        self.assert_example_links(self.request, self.draft)
        variant = copy.deepcopy(self.request)
        variant["trusted_context"]["request_id"] = "example-license-unknown"
        variant["trusted_context"]["license_status"] = "unknown"
        self.definition("request").validate(variant)
        self.assert_example_links(variant, self.blocked)
        self.assertEqual(
            {"video", "image", "music", "long-video"},
            {item["mode"] for item in self.draft["package"]["bindings"]},
        )

    def test_blocked_requires_null_package_and_reason(self) -> None:
        for field, value in (("package", self.draft["package"]), ("blockers", [])):
            with self.subTest(field=field):
                result = copy.deepcopy(self.blocked)
                if field == "package":
                    result[field] = value
                else:
                    result["report"][field] = value
                self.assert_invalid(result)

    def test_draft_requires_package_without_blockers(self) -> None:
        result = copy.deepcopy(self.draft)
        result["package"] = None
        self.assert_invalid(result)
        result = copy.deepcopy(self.draft)
        result["report"]["blockers"] = self.blocked["report"]["blockers"]
        self.assert_invalid(result)

    def test_model_cannot_approve_or_add_execution_fields(self) -> None:
        for status in ("approved", "installed", "enabled"):
            with self.subTest(status=status):
                result = copy.deepcopy(self.draft)
                result["status"] = status
                self.assert_invalid(result)
        for field in ("tools", "scripts", "enabled", "approval", "source_sha256"):
            with self.subTest(field=field):
                result = copy.deepcopy(self.draft)
                result["package"][field] = []
                self.assert_invalid(result)

    def test_task_mode_behavior_and_contract_matrix(self) -> None:
        for field, value in (
            ("task", "lyrics"), ("mode", "long-video"),
            ("behavior", "creative"), ("behavior", "story-adaptation"),
            ("output_contract", "storyboard-json/v1"),
        ):
            with self.subTest(field=field, value=value):
                result = copy.deepcopy(self.draft)
                result["package"]["bindings"][0][field] = value
                self.assert_invalid(result)
        result = copy.deepcopy(self.draft)
        result["package"]["bindings"][3]["mode"] = "video"
        self.assert_invalid(result)

    def test_names_and_versions_are_safe(self) -> None:
        for name in ("../escape", "BadName", "-bad", "bad-", "two--hyphens", "bad\n", "a" * 65):
            with self.subTest(name=name):
                result = copy.deepcopy(self.draft)
                result["package"]["name"] = name
                self.assert_invalid(result)
        result = copy.deepcopy(self.draft)
        result["package"]["version"] = "01.0.0"
        self.assert_invalid(result)

    def test_instruction_boundaries_and_nonblank_text(self) -> None:
        for value, valid in (("a" * 6000, True), ("a" * 6001, False), (" ", False), ("\x00", False)):
            with self.subTest(length=len(value), valid=valid):
                result = copy.deepcopy(self.draft)
                result["package"]["bindings"][0]["instructions"] = value
                self.assertEqual(self.validator.is_valid(result), valid)

    def test_wildcard_must_be_standalone(self) -> None:
        result = copy.deepcopy(self.draft)
        result["package"]["bindings"][0]["target_models"] = ["*", "h3"]
        self.assert_invalid(result)

    def test_host_rejects_identity_license_and_budget_mismatch(self) -> None:
        for field in ("request_id", "capability_snapshot_id", "source_snapshot_id"):
            with self.subTest(field=field):
                result = copy.deepcopy(self.draft)
                result[field] = "different"
                self.validator.validate(result)
                with self.assertRaises(AssertionError):
                    self.assert_example_links(self.request, result)
        for status in ("unknown", "restricted"):
            with self.subTest(status=status):
                request = copy.deepcopy(self.request)
                request["trusted_context"]["license_status"] = status
                with self.assertRaises(AssertionError):
                    self.assert_example_links(request, self.draft)
        request = copy.deepcopy(self.request)
        request["trusted_context"]["max_instruction_chars"] = 1
        with self.assertRaises(AssertionError):
            self.assert_example_links(request, self.draft)

    def test_host_rejects_fabricated_evidence_and_duplicate_bindings(self) -> None:
        for field, value in (("file_id", "missing"), ("excerpt", "fabricated quote")):
            with self.subTest(field=field):
                result = copy.deepcopy(self.draft)
                result["package"]["bindings"][0]["evidence"][0][field] = value
                self.validator.validate(result)
                with self.assertRaises(AssertionError):
                    self.assert_example_links(self.request, result)
        result = copy.deepcopy(self.draft)
        result["package"]["bindings"][1] = copy.deepcopy(result["package"]["bindings"][0])
        result["package"]["bindings"][1]["instructions"] += "补充文字"
        self.validator.validate(result)
        with self.assertRaises(AssertionError):
            self.assert_example_links(self.request, result)

    def test_host_rejects_unknown_models_and_disabled_generic_binding(self) -> None:
        result = copy.deepcopy(self.draft)
        result["package"]["bindings"][0]["target_models"] = ["unknown-model"]
        self.validator.validate(result)
        with self.assertRaises(AssertionError):
            self.assert_example_links(self.request, result)
        request = copy.deepcopy(self.request)
        request["trusted_context"]["allowed_bindings"][0]["generic_allowed"] = False
        with self.assertRaises(AssertionError):
            self.assert_example_links(request, self.draft)

    def test_source_path_traversal_is_rejected(self) -> None:
        for path in ("../SKILL.md", "/tmp/SKILL.md", "x/../../SKILL.md", "C:\\SKILL.md"):
            with self.subTest(path=path):
                request = copy.deepcopy(self.request)
                request["source_material"]["files"][0]["path"] = path
                self.assertFalse(self.definition("request").is_valid(request))

    def test_enhancement_result_contract(self) -> None:
        validator = self.definition("enhancementResult")
        result = {"keywords": ["主体", "动作", "场景"], "optimized_prompt": "用户原文"}
        validator.validate(result)
        for keywords in (["主体"], ["主体"] * 9, ["主体", "动作", " "]):
            with self.subTest(keywords=keywords):
                self.assertFalse(validator.is_valid({**result, "keywords": keywords}))
        self.assertFalse(validator.is_valid({**result, "optimized_prompt": "a" * 4001}))
        self.assertFalse(validator.is_valid({**result, "lyrics": "不允许"}))

    def test_storyboard_result_contract(self) -> None:
        validator = self.definition("storyboardResult")
        shot = {"title": "开场", "prompt": "故事场景", "music_prompt": "器乐配乐", "duration": 5}
        validator.validate({"shots": [shot] * 48})
        for shots in ([], [shot] * 49):
            with self.subTest(count=len(shots)):
                self.assertFalse(validator.is_valid({"shots": shots}))
        for duration in (True, 4, 16, 5.5):
            with self.subTest(duration=duration):
                self.assertFalse(validator.is_valid({"shots": [{**shot, "duration": duration}]}))
        self.assertFalse(validator.is_valid({"shots": [{**shot, "tools": []}]}))


if __name__ == "__main__":
    unittest.main()
