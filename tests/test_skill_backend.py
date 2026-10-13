from __future__ import annotations

import copy
import io
import json
import tempfile
import threading
import unittest
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from webapp import prompt_settings, server, skill_conversion as skills

ROOT = Path(__file__).resolve().parents[1]


class SkillBackendTests(unittest.TestCase):
    def setUp(self) -> None:
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.registry = Path(self.directory.name) / "reviews.json"
        for binding in (
            patch.object(skills, "LICENSE_REVIEWS_PATH", self.registry),
            patch.object(skills, "STORE", skills.ConversionStore()),
        ):
            binding.start()
            self.addCleanup(binding.stop)
        example = json.loads((ROOT / "skill-spec/examples/request.json").read_text())
        self.payload = {
            "model": "local-text",
            "source": {
                "origin": "local:synthetic-notes", "revision": "original-v1",
                "files": [{"path": item["path"], "content": item["content"]}
                          for item in example["source_material"]["files"]],
            },
        }
        self.capabilities = {"allowed_bindings": example["trusted_context"]["allowed_bindings"]}
        self.text = {"service_url": "http://127.0.0.1:8000", "api_params": {"max_tokens": 500}, "model_ids": []}
        self.template = json.loads((ROOT / "skill-spec/examples/draft.json").read_text())

    def review(self, status: str = "verified") -> None:
        source = skills.normalize_source(self.payload["source"], skills.artifacts()[0])
        self.registry.write_text(json.dumps({"version": 1, "reviews": [{
            "source_sha256": skills.digest(source), "status": status,
            "obligations": ["Preserve original license and attribution."],
            "evidence": "Operator inspected the synthetic source license.",
            "reviewer": "test-operator", "reviewed_at": "2026-10-05",
        }]}))

    def prepare(self, verified: bool = True) -> dict:
        if verified:
            self.review()
        prepared = skills.prepare(self.payload, self.capabilities, self.text)
        return skills.current_record(
            prepared["request"]["trusted_context"]["request_id"], self.capabilities, self.text,
        )

    def candidate(self, record: dict) -> dict:
        result = copy.deepcopy(self.template)
        context = record["request"]["trusted_context"]
        for key in ("request_id", "capability_snapshot_id", "source_snapshot_id"):
            result[key] = context[key]
        for binding in result["package"]["bindings"]:
            for evidence in binding["evidence"]:
                evidence["file_id"] = "source-1"
        for removal in result["report"]["removed"]:
            removal["evidence"]["file_id"] = "source-1"
        return result

    def test_verified_draft_is_installable_without_human_review_and_hash_is_host_generated(self) -> None:
        record = self.prepare()
        result = self.candidate(record)
        validated = skills.validate_result(record, result, lambda *_: 100)
        self.assertTrue(validated["valid"])
        self.assertTrue(validated["installable"])
        self.assertFalse(validated["review_required"])
        self.assertEqual(validated["review_checks"], [])
        self.assertFalse(validated["semantic_safety_verified"])
        self.assertEqual(validated["candidate_sha256"], skills.digest(result["package"]))
        self.assertEqual(validated["license_obligations"], record["review"]["obligations"])

    def test_client_cannot_supply_host_context_license_or_file_ids(self) -> None:
        for change in (
            lambda p: p.update(trusted_context={"license_status": "verified"}),
            lambda p: p["source"].update(license_status="verified"),
            lambda p: p["source"]["files"][0].update(id="forged"),
        ):
            payload = copy.deepcopy(self.payload)
            change(payload)
            with self.subTest(payload=payload), self.assertRaises(skills.SkillError):
                skills.prepare(payload, self.capabilities, self.text)

    def test_memory_rejection_is_actionable_and_preserves_http_507(self) -> None:
        error = HTTPError("http://127.0.0.1:8000/v1/messages/count_tokens", 507, "memory", {},
                          io.BytesIO(b'{"error":{"message":"Model requires 16GB; only 4GB available"}}'))
        with patch.object(server, "build_opener") as opener:
            opener.return_value.open.side_effect = error
            with self.assertRaisesRegex(skills.SkillError, "skill_text_memory_unavailable") as raised:
                server._skill_text_response(Request(error.url), "http://127.0.0.1:8000")
        self.assertEqual(raised.exception.status, 507)
        self.assertIn("16GB", raised.exception.findings[0]["message"])

    def test_unknown_and_restricted_licenses_must_block(self) -> None:
        for status in ("unknown", "restricted"):
            self.review(status)
            record = self.prepare(verified=False)
            blocked = skills.blocked_result(record)
            validated = skills.validate_result(record, blocked, lambda *_: self.fail("No tokenizer needed"))
            self.assertTrue(validated["valid"])
            self.assertIsNone(validated["candidate_sha256"])
            self.assertEqual(blocked["report"]["blockers"][0]["code"], "license-" + status)
            result = skills.validate_result(record, self.candidate(record), lambda *_: 1)
            self.assertIn("H02", {f["code"] for f in result["findings"]})
            blocked["report"]["blockers"][0]["code"] = "not-portable"
            self.assertFalse(skills.validate_result(record, blocked, lambda *_: 1)["valid"])

    def test_missing_review_is_unknown_not_verified(self) -> None:
        record = self.prepare(False)
        self.assertEqual(record["review"]["status"], "unknown")

    def test_user_confirmation_of_detected_license_is_pinned_to_exact_source(self) -> None:
        source_value = copy.deepcopy(self.payload["source"])
        source_value["origin"] = "https://github.com/test/repo"
        source_value["revision"] = "a" * 40
        source_value["files"].append({
            "path": "LICENSE",
            "content": "MIT License\n\nPermission is hereby granted, free of charge, to any person obtaining a copy.",
        })
        source = skills.normalize_source(source_value, skills.artifacts()[0])
        detected = skills.detect_licenses(source)
        self.assertEqual(detected, [{"license_name": "MIT", "path": "LICENSE"}])
        review = skills.confirm_detected_license(source_value, "MIT", "LICENSE")
        self.assertEqual(review["status"], "verified")
        self.assertEqual(review["license_name"], "MIT")
        self.assertEqual(review["reviewer"], "local-ui-user-confirmation")

        payload = {**self.payload, "source": source_value}
        prepared = skills.prepare(payload, self.capabilities, self.text)
        self.assertEqual(prepared["license_review"]["status"], "verified")
        self.assertEqual(prepared["license_review"]["license_name"], "MIT")

        changed = copy.deepcopy(source)
        changed["files"][0]["content"] += "\nchanged"
        self.assertEqual(skills.license_review(changed)["status"], "unknown")

    def test_user_cannot_confirm_a_license_absent_from_pinned_source(self) -> None:
        with self.assertRaisesRegex(skills.SkillError, "license_not_detected"):
            skills.confirm_detected_license(self.payload["source"], "MIT", "LICENSE")
        self.assertFalse(self.registry.exists())

    def test_operator_can_declare_a_whitelisted_license_for_local_source(self) -> None:
        source_value = copy.deepcopy(self.payload["source"])
        review = skills.confirm_declared_license(source_value, "MIT")
        self.assertEqual(review["status"], "verified")
        self.assertEqual(review["license_name"], "MIT")
        self.assertEqual(review["reviewer"], "local-ui-user-declaration")

        prepared = skills.prepare({**self.payload, "source": source_value}, self.capabilities, self.text)
        self.assertEqual(prepared["license_review"]["status"], "verified")
        self.assertEqual(prepared["license_review"]["license_name"], "MIT")

    def test_declared_license_requires_whitelisted_spdx_identifier(self) -> None:
        for invalid in ("Proprietary", "custom-license", 123, None):
            with self.subTest(invalid=invalid), self.assertRaisesRegex(skills.SkillError, "invalid_declared_license"):
                skills.confirm_declared_license(self.payload["source"], invalid)
        self.assertFalse(self.registry.exists())

    def test_declared_license_types_endpoint_and_declare_pipeline(self) -> None:
        self.server_patches()
        httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()
        self.addCleanup(thread.join)
        self.addCleanup(httpd.server_close)
        self.addCleanup(httpd.shutdown)
        base = f"http://127.0.0.1:{httpd.server_port}"

        def post(route, data):
            return urlopen(Request(base + route, data=skills.encoded(data)), timeout=5)

        with urlopen(base + "/api/skills/license-types", timeout=5) as response:
            types = json.load(response)["license_types"]
        self.assertIn("MIT", types)
        self.assertIn("Apache-2.0", types)

        with post("/api/skills/license-declare", {
            "source": self.payload["source"], "license_name": "Apache-2.0",
        }) as response:
            self.assertEqual(response.status, 200)
            review = json.load(response)["license_review"]
        self.assertEqual(review["status"], "verified")
        self.assertEqual(review["license_name"], "Apache-2.0")
        with self.assertRaises(HTTPError) as error:
            post("/api/skills/license-declare", {
                "source": self.payload["source"], "license_name": "Proprietary",
            })
        self.assertEqual(error.exception.code, 422)
        error.exception.close()

    def test_review_is_bound_to_source_origin_revision_and_exact_content(self) -> None:
        self.review()
        for field in ("origin", "revision", "content"):
            payload = copy.deepcopy(self.payload)
            if field == "content":
                payload["source"]["files"][0][field] += "\n"
            else:
                payload["source"][field] += "-changed"
            self.assertEqual(
                skills.prepare(payload, self.capabilities, self.text)["license_review"]["status"], "unknown",
            )

    def test_corrupt_duplicate_and_linked_registry_fail_closed(self) -> None:
        self.registry.write_text("{bad")
        with self.assertRaisesRegex(skills.SkillError, "reviews_unavailable"):
            self.prepare(False)
        self.review()
        value = json.loads(self.registry.read_text())
        value["reviews"].append(value["reviews"][0])
        self.registry.write_text(json.dumps(value))
        with self.assertRaisesRegex(skills.SkillError, "reviews_unavailable"):
            self.prepare(False)
        target = self.registry.with_name("target.json")
        self.registry.rename(target)
        self.registry.symlink_to(target)
        with self.assertRaisesRegex(skills.SkillError, "reviews_unavailable"):
            self.prepare(False)

    def test_source_paths_duplicates_and_limits(self) -> None:
        for path in ("../SKILL.md", "/SKILL.md", "dir//SKILL.md", "dir/./SKILL.md",
                     "dir/../SKILL.md", "C:\\SKILL.md", "SKILL.md/"):
            payload = copy.deepcopy(self.payload)
            payload["source"]["files"][0]["path"] = path
            with self.subTest(path=path), self.assertRaises(skills.SkillError):
                skills.prepare(payload, self.capabilities, self.text)
        payload = copy.deepcopy(self.payload)
        payload["source"]["files"] *= 2
        with self.assertRaisesRegex(skills.SkillError, "source_path"):
            skills.prepare(payload, self.capabilities, self.text)
        for content in ("x" * 96001, "x\x00y", ""):
            payload = copy.deepcopy(self.payload)
            payload["source"]["files"][0]["content"] = content
            with self.assertRaises(skills.SkillError):
                skills.prepare(payload, self.capabilities, self.text)
        payload = copy.deepcopy(self.payload)
        payload["source"]["files"] = [{"path": f"{n}.md", "content": "文" * 96000} for n in range(2)]
        with self.assertRaisesRegex(skills.SkillError, "too_large"):
            skills.prepare(payload, self.capabilities, self.text)

    def test_json_duplicates_constants_nonobject_and_surrogates_are_rejected(self) -> None:
        for data in ('{"a":1,"a":2}', '{"a":NaN}', '[]', 'null', '{"a":"\\ud800"}'):
            with self.subTest(data=data), self.assertRaises(skills.SkillError):
                skills.encoded(skills.parse_json(data))

    def test_store_expiry_capacity_and_copy_isolation(self) -> None:
        record = self.prepare(False)
        key = record["request"]["trusted_context"]["request_id"]
        record["source"]["files"][0]["content"] = "changed"
        self.assertNotEqual(skills.STORE.get(key)["source"], record["source"])
        with patch.object(skills, "MAX_PENDING_REQUESTS", 1):
            with self.assertRaisesRegex(skills.SkillError, "capacity"):
                skills.prepare(self.payload, self.capabilities, self.text)
        with patch.object(skills.time, "monotonic", return_value=float("inf")):
            with self.assertRaisesRegex(skills.SkillError, "expired"):
                skills.STORE.get(key)

    def test_capability_license_text_and_contract_drift(self) -> None:
        record = self.prepare()
        key = record["request"]["trusted_context"]["request_id"]
        changed = copy.deepcopy(self.capabilities)
        changed["allowed_bindings"][0]["model_ids"] = []
        with self.assertRaisesRegex(skills.SkillError, "snapshot_changed"):
            skills.current_record(key, changed, self.text)
        with self.assertRaisesRegex(skills.SkillError, "snapshot_changed"):
            skills.current_record(key, self.capabilities, {**self.text, "model_ids": ["other"]})
        schema, system = skills.artifacts()
        with patch.object(skills, "artifacts", return_value=(schema, system + "changed")):
            with self.assertRaisesRegex(skills.SkillError, "snapshot_changed"):
                skills.current_record(key, self.capabilities, self.text)
        self.review("restricted")
        with self.assertRaisesRegex(skills.SkillError, "snapshot_changed"):
            skills.current_record(key, self.capabilities, self.text)

    def test_semantic_identity_models_duplicates_and_all_evidence(self) -> None:
        record = self.prepare()
        for code, change in (
            ("H01", lambda r: r.update(request_id="other")),
            ("H03", lambda r: r["package"]["bindings"][0].update(target_models=["unknown-model"])),
            ("H03", lambda r: r["package"]["bindings"][1].update(
                task="prompt-enhancement", mode="video", instructions="Different text, same task."
            )),
            ("H04", lambda r: r["package"]["bindings"][0]["evidence"][0].update(excerpt="invented")),
            ("H04", lambda r: r["report"]["removed"][0]["evidence"].update(file_id="missing")),
            ("schema", lambda r: r["package"].update(approved=True)),
            ("schema", lambda r: r["package"]["bindings"][0].update(tools=["execute"])),
        ):
            result = self.candidate(record)
            change(result)
            with self.subTest(code=code):
                checked = skills.validate_result(record, result, lambda *_: 1)
                self.assertFalse(checked["valid"])
                self.assertIn(code, {f["code"] for f in checked["findings"]})

    def test_allowed_task_and_generic_restrictions(self) -> None:
        record = self.prepare()
        context = record["request"]["trusted_context"]
        context["allowed_bindings"][0]["generic_allowed"] = False
        self.assertFalse(skills.validate_result(record, self.candidate(record), lambda *_: 1)["valid"])
        context["allowed_bindings"] = context["allowed_bindings"][1:]
        self.assertFalse(skills.validate_result(record, self.candidate(record), lambda *_: 1)["valid"])

    def test_capabilities_follow_enabled_registry_not_model_name_guesses(self) -> None:
        settings = copy.deepcopy(server._DEFAULT_SETTINGS)
        for model in ("h3", *server.local_models.LOCAL_VIDEO_MODELS):
            settings["models"][model]["enabled"] = False
        settings["models"]["music3"]["enabled"] = False
        with patch.object(server, "_settings_snapshot", return_value=settings):
            capabilities, text = server._skill_environment()
        allowed = {item["mode"]: item for item in capabilities["allowed_bindings"]}
        self.assertNotIn("video", allowed)
        self.assertNotIn("long-video", allowed)
        self.assertEqual(allowed["music"]["model_ids"], ["yue2-3b-8bit"])
        self.assertIn("no lyrics", allowed["music"]["constraints"][0])
        self.assertEqual(text, settings["text"])

    def test_mv_binding_tracks_enabled_video_models(self) -> None:
        settings = copy.deepcopy(server._DEFAULT_SETTINGS)
        with patch.object(server, "_settings_snapshot", return_value=settings):
            capabilities, _ = server._skill_environment()
        allowed = {item["mode"]: item for item in capabilities["allowed_bindings"]}
        self.assertEqual(allowed["mv"]["model_ids"], allowed["video"]["model_ids"])
        self.assertIn("MV visual prompt", allowed["mv"]["constraints"][0])

    def test_character_and_token_budgets_are_independent(self) -> None:
        record = self.prepare()
        record["request"]["trusted_context"]["max_instruction_chars"] = 10
        result = self.candidate(record)
        self.assertIn("H05", {f["code"] for f in skills.validate_result(record, result, lambda *_: 1)["findings"]})
        record["request"]["trusted_context"]["max_instruction_chars"] = 6000
        result["package"]["bindings"][0]["instructions"] = "x" * 6000
        self.assertTrue(skills.validate_result(record, result, lambda *_: 2048)["valid"])
        self.assertFalse(skills.validate_result(record, result, lambda *_: 2049)["valid"])
        counts = iter([1, 1, 1, 1, 8193])
        self.assertFalse(skills.validate_result(record, result, lambda *_: next(counts))["valid"])
        with patch.object(skills, "MAX_INSTRUCTION_BYTES", 5):
            self.assertFalse(skills.validate_result(record, result, lambda *_: 1)["valid"])

    def server_patches(self):
        for binding in (
            patch.object(server, "_skill_environment", return_value=(self.capabilities, self.text)),
            patch.object(server, "_local_text_models", return_value=[{"id": "local-text"}]),
            patch.object(server, "_skill_token_count", return_value=100),
        ):
            binding.start()
            self.addCleanup(binding.stop)

    def test_conversion_uses_schema_isolated_budget_and_validates_output(self) -> None:
        self.server_patches()
        record = self.prepare()
        result = self.candidate(record)
        key = record["request"]["trusted_context"]["request_id"]
        with patch.object(server, "_request_local_text_json", return_value=result) as call:
            response = server._convert_skill_request(key)
        self.assertTrue(response["validation"]["valid"])
        self.assertIn("JSON Schema:", call.call_args.args[1])
        self.assertEqual(skills.parse_json(call.call_args.args[2]), record["request"])
        self.assertEqual(call.call_args.kwargs["max_tokens"], 8192)
        self.assertTrue(call.call_args.kwargs["strict"])
        self.assertEqual(call.call_args.kwargs["text_snapshot"], self.text)
        result["request_id"] = "forged"
        with patch.object(server, "_request_local_text_json", return_value=result):
            invalid = server._convert_skill_request(key)
        self.assertFalse(invalid["validation"]["valid"])
        self.assertEqual(invalid["error"], "invalid_skill_conversion")
        self.assertEqual(invalid["result"], result)
        self.assertIn("H01", {item["code"] for item in invalid["validation"]["findings"]})

    def test_conversion_reserves_output_capacity_and_honors_configured_input_budget(self) -> None:
        self.text["skill_input_token_budget"] = 64000
        self.server_patches()
        record = self.prepare()
        key = record["request"]["trusted_context"]["request_id"]
        with (
            patch.object(server, "_local_text_models", return_value=[{"id":"local-text","max_model_len":32768}]),
            patch.object(server, "_skill_token_count", return_value=24577),
            patch.object(server, "_request_local_text_json") as generate,
            self.assertRaisesRegex(skills.SkillError, "model_context_budget_exceeded"),
        ):
            server._convert_skill_request(key)
        generate.assert_not_called()
        with (
            patch.object(server, "_local_text_models", return_value=[{"id":"local-text","max_model_len":262144}]),
            patch.object(server, "_skill_token_count", return_value=64001),
            patch.object(server, "_request_local_text_json") as generate,
            self.assertRaisesRegex(skills.SkillError, "input_token_budget_exceeded"),
        ):
            server._convert_skill_request(key)
        generate.assert_not_called()
        self.assertEqual(server._text_context_metadata("model", [{"id":"model","max_model_len":True}]), {})
        self.assertEqual(server._text_context_metadata("model", [{"id":"model","max_model_len":64000}]), {"max_model_len":64000})

    def test_evidence_only_failure_regenerates_once_with_original_sources(self) -> None:
        self.server_patches()
        record = self.prepare()
        valid = self.candidate(record)
        invalid = copy.deepcopy(valid)
        invalid["package"]["bindings"][0]["evidence"][0]["excerpt"] = "invented evidence"
        with patch.object(server, "_request_local_text_json", side_effect=[invalid, valid]) as call:
            response = server._convert_skill_request(record["request"]["trusted_context"]["request_id"])
        self.assertTrue(response["validation"]["valid"])
        self.assertEqual(call.call_count, 2)
        retry = skills.parse_json(call.call_args.args[2])
        self.assertEqual(retry["trusted_context"], record["request"]["trusted_context"])
        self.assertEqual(retry["source_material"], record["request"]["source_material"])
        self.assertTrue(all(item["code"] == "H04" for item in retry["validation_feedback"]["findings"]))
        self.assertEqual(invalid["package"]["bindings"][0]["evidence"][0]["excerpt"], "invented evidence")

    def test_repeated_bad_evidence_is_reported_and_mixed_failure_is_not_retried(self) -> None:
        self.server_patches()
        record = self.prepare()
        invalid = self.candidate(record)
        invalid["package"]["bindings"][0]["evidence"][0]["excerpt"] = "invented evidence"
        for mixed, expected_calls in ((False, 2), (True, 1)):
            if mixed:
                invalid["request_id"] = "forged"
            with patch.object(server, "_request_local_text_json", return_value=invalid) as call:
                response = server._convert_skill_request(record["request"]["trusted_context"]["request_id"])
            self.assertEqual(call.call_count, expected_calls)
            self.assertEqual(response["error"], "invalid_skill_conversion")
            self.assertFalse(response["validation"]["valid"])
            self.assertFalse(response["validation"]["installable"])
            self.assertEqual(response["result"], invalid)

    def test_retry_recounts_budget_and_rejects_source_drift(self) -> None:
        self.server_patches()
        record = self.prepare()
        invalid = self.candidate(record)
        invalid["package"]["bindings"][0]["evidence"][0]["excerpt"] = "invented evidence"
        with patch.object(server, "_request_local_text_json", return_value=invalid) as call, patch.object(
            server, "_skill_token_count", side_effect=[100, 64001]
        ), self.assertRaisesRegex(skills.SkillError, "input_token_budget_exceeded"):
            server._convert_skill_request(record["request"]["trusted_context"]["request_id"])

        self.assertEqual(call.call_count, 1)
        def retry(*args, **kwargs):
            if "validation_feedback" in skills.parse_json(args[2]):
                self.review("restricted")
            return invalid
        with patch.object(server, "_request_local_text_json", side_effect=retry), self.assertRaisesRegex(
            skills.SkillError, "snapshot_changed"
        ):
            server._convert_skill_request(record["request"]["trusted_context"]["request_id"])

    def test_editing_conversion_guidance_invalidates_prepared_contract(self) -> None:
        path = Path(self.directory.name) / "prompts.json"
        with patch.object(prompt_settings, "SETTINGS_PATH", path):
            record = self.prepare()
            current = prompt_settings.snapshot()
            current["config"]["profiles"]["skill_conversion"]["rules"] = "Copy exact source excerpts."
            prompt_settings.save(current["config"], current["revision"])
            with self.assertRaisesRegex(skills.SkillError, "snapshot_changed"):
                skills.current_record(record["request"]["trusted_context"]["request_id"],
                                      self.capabilities, self.text)

    def test_conversion_unknown_avoids_model_and_tokenizer(self) -> None:
        self.server_patches()
        record = self.prepare(False)
        with patch.object(server, "_request_local_text_json") as generate, patch.object(
            server, "_skill_token_count"
        ) as tokenize:
            response = server._convert_skill_request(record["request"]["trusted_context"]["request_id"])
        self.assertEqual(response["result"]["status"], "blocked")
        generate.assert_not_called()
        tokenize.assert_not_called()

    def test_tokenizer_failure_and_input_overflow_do_not_generate(self) -> None:
        self.server_patches()
        record = self.prepare()
        key = record["request"]["trusted_context"]["request_id"]
        for value in (64001, RuntimeError("tokenizer unavailable")):
            with patch.object(server, "_skill_token_count", **(
                {"side_effect": value} if isinstance(value, Exception) else {"return_value": value}
            )), patch.object(server, "_request_local_text_json") as generate:
                with self.assertRaises((skills.SkillError, RuntimeError)):
                    server._convert_skill_request(key)
                generate.assert_not_called()

    def test_drift_during_model_call_rejects_result(self) -> None:
        self.server_patches()
        record = self.prepare()
        def generated(*args, **kwargs):
            self.review("restricted")
            return self.candidate(record)
        with patch.object(server, "_request_local_text_json", side_effect=generated):
            with self.assertRaisesRegex(skills.SkillError, "snapshot_changed"):
                server._convert_skill_request(record["request"]["trusted_context"]["request_id"])

    def test_strict_completion_rejects_truncation_tools_and_non_json(self) -> None:
        for choice in (
            {"finish_reason": "length", "message": {"content": "{}"}},
            {"finish_reason": "stop", "message": {"content": "```json\n{}\n```"}},
            {"finish_reason": "stop", "message": {"content": 'prefix {}'}},
            {"finish_reason": "stop", "message": {"content": '{"a":1,"a":2}'}},
            {"finish_reason": "stop", "message": {"content": "{}", "tool_calls": [{}]}},
            {"finish_reason": "stop", "message": {"content": "{}", "refusal": "no"}},
            {"finish_reason": "stop", "message": {"content": None}},
        ):
            with self.subTest(choice=choice), patch.object(
                server, "_skill_text_response", return_value={"choices": [choice]}
            ), self.assertRaises(RuntimeError):
                server._request_local_text_json("local-text", "system", "source", 8192, strict=True, text_snapshot=self.text)
        with patch.object(server, "_skill_text_response", return_value={
            "choices": [{"finish_reason": "stop", "message": {"content": '{"ok":true}'}}],
        }):
            self.assertEqual(server._request_local_text_json(
                "local-text", "system", "source", 8192, strict=True, text_snapshot=self.text,
            ), {"ok": True})

    def test_native_text_transport_tokenizer_shapes_and_redirect_rejection(self) -> None:
        captured = []
        class TextAPI(BaseHTTPRequestHandler):
            def do_POST(handler):
                data = skills.parse_json(handler.rfile.read(int(handler.headers["Content-Length"])))
                captured.append((handler.path, data))
                if handler.path == "/v1/messages/count_tokens":
                    value = {"input_tokens": 123}
                else:
                    value = {"choices": [{"finish_reason": "stop", "message": {"content": '{"ok":true}'}}]}
                body = skills.encoded(value)
                handler.send_response(200)
                handler.send_header("Content-Length", str(len(body)))
                handler.end_headers()
                handler.wfile.write(body)

            def do_GET(handler):
                if handler.path == "/large":
                    body = b"x" * (256 * 1024 + 1)
                    handler.send_response(200)
                    handler.send_header("Content-Length", str(len(body)))
                    handler.end_headers()
                    handler.wfile.write(body)
                else:
                    handler.send_response(302)
                    handler.send_header("Location", "/must-not-follow")
                    handler.end_headers()

            def log_message(handler, *args):
                pass

        httpd = ThreadingHTTPServer(("127.0.0.1", 0), TextAPI)
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()
        self.addCleanup(thread.join)
        self.addCleanup(httpd.server_close)
        self.addCleanup(httpd.shutdown)
        text = {**self.text, "service_url": f"http://127.0.0.1:{httpd.server_port}"}
        record = {"text_settings": text, "model": "local-text"}
        self.assertEqual(server._skill_token_count(record, "system", "source"), 123)
        result = server._request_local_text_json(
            "local-text", "system", "source", 8192, strict=True, text_snapshot=text,
        )
        self.assertTrue(result["ok"])
        self.assertEqual(captured[0][1]["messages"], [{"role": "user", "content": "source"}])
        self.assertEqual(captured[0][1]["system"], "system")
        self.assertEqual(captured[1][1]["max_tokens"], 8192)
        self.assertFalse(captured[1][1]["enable_thinking"])
        self.assertEqual(captured[1][1]["response_format"]["type"], "json_schema")
        self.assertTrue(captured[1][1]["response_format"]["json_schema"]["strict"])
        self.assertEqual(captured[1][1]["response_format"]["json_schema"]["schema"], skills.artifacts()[0])
        for route in ("/redirect", "/large"):
            with self.subTest(route=route), self.assertRaises(RuntimeError):
                server._skill_text_response(Request(text["service_url"] + route), text["service_url"])
        with patch.object(server, "_settings_snapshot", return_value={"text": text}):
            with self.assertRaisesRegex(RuntimeError, "HTTP 302"):
                server._local_text_models(strict=True)
        for count in (True, -1, "123", None):
            with patch.object(server, "_skill_text_response", return_value={"input_tokens": count}):
                with self.assertRaisesRegex(RuntimeError, "invalid token count"):
                    server._skill_token_count(record, "system", "source")
        with self.assertRaisesRegex(RuntimeError, "local text service"):
            server._skill_text_response(Request("https://example.invalid"), "https://example.invalid")

    def test_http_interfaces_size_origin_and_validation_status(self) -> None:
        self.server_patches()
        self.review()
        httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()
        self.addCleanup(thread.join)
        self.addCleanup(httpd.server_close)
        self.addCleanup(httpd.shutdown)
        base = f"http://127.0.0.1:{httpd.server_port}"
        def post(route, data, headers=None):
            body = data if isinstance(data, bytes) else skills.encoded(data)
            return urlopen(Request(base + route, data=body, headers=headers or {}), timeout=5)
        with post("/api/skills/requests", self.payload) as response:
            self.assertEqual(response.status, 201)
            prepared = json.load(response)
        source = copy.deepcopy(self.payload["source"])
        source["origin"] = "https://github.com/test/repo"
        source["revision"] = "a" * 40
        source["files"].append({
            "path": "LICENSE",
            "content": "MIT License\n\nPermission is hereby granted, free of charge, to any person obtaining a copy.",
        })
        confirmation = {
            "source": source, "license_name": "MIT", "license_path": "LICENSE",
        }
        with post("/api/skills/license-review", confirmation) as response:
            self.assertEqual(response.status, 200)
            license_review = json.load(response)["license_review"]
        self.assertEqual(license_review["status"], "verified")
        self.assertEqual(license_review["license_name"], "MIT")
        self.assertEqual(len(json.loads(self.registry.read_text())["reviews"]), 2)
        for invalid in (
            {**confirmation, "license_name": "Apache-2.0"},
            {**confirmation, "source_sha256": "f" * 64},
            {**confirmation, "obligations": ["forged"]},
        ):
            with self.subTest(invalid=invalid), self.assertRaises(HTTPError) as error:
                post("/api/skills/license-review", invalid)
            self.assertEqual(error.exception.code, 422 if "source_sha256" not in invalid and "obligations" not in invalid else 400)
            error.exception.close()
        changed_source = copy.deepcopy(source)
        changed_source["files"][0]["content"] += "\nchanged"
        changed_prepared = server._prepare_skill_request({
            "model": "local-text", "source": changed_source,
        })
        self.assertEqual(changed_prepared["license_review"]["status"], "unknown")
        large = copy.deepcopy(self.payload)
        large["source"]["files"] = [{"path": f"{n}.md", "content": "a" * 24000} for n in range(3)]
        self.assertGreater(len(skills.encoded(large)), 64 * 1024)
        self.assertLessEqual(len(skills.encoded(large)), 128 * 1024)
        with post("/api/skills/requests", large) as response:
            self.assertEqual(response.status, 201)
            large_prepared = json.load(response)
        with post("/api/skills/convert", {
            "request_id": large_prepared["request"]["trusted_context"]["request_id"],
        }) as response:
            self.assertEqual(json.load(response)["result"]["status"], "blocked")
        key = prepared["request"]["trusted_context"]["request_id"]
        record = skills.STORE.get(key)
        candidate = self.candidate(record)
        with post("/api/skills/validate", {"request_id": key, "result": candidate}) as response:
            self.assertTrue(json.load(response)["valid"])
        with patch.object(server, "_request_local_text_json", return_value=candidate):
            with post("/api/skills/convert", {"request_id": key}) as response:
                self.assertEqual(json.load(response)["result"]["status"], "draft")
        candidate["request_id"] = "wrong"
        for route, data, headers, expected in (
            ("/api/skills/validate", {"request_id": key, "result": candidate}, {}, 422),
            ("/api/skills/convert", {"request_id": "missing"}, {}, 404),
            ("/api/skills/requests", self.payload, {"Origin": "https://evil.invalid"}, 403),
            ("/api/skills/requests", b"x", {"Content-Length": str(skills.MAX_REQUEST_BYTES + 1)}, 413),
            ("/api/skills/requests", b'{"model":"a","model":"b"}', {}, 400),
            ("/api/skills/requests", b"null", {}, 400),
            ("/api/skills/requests", b"{}", {"Content-Length": "invalid"}, 400),
            ("/api/skills/requests", b"{}", {"Transfer-Encoding": "chunked"}, 400),
            ("/api/skills/requests", {**self.payload, "trusted_context": {}}, {}, 400),
            ("/api/prompt-enhancements", b"x" * (64 * 1024 + 1), {}, 400),
        ):
            with self.subTest(route=route, expected=expected), self.assertRaises(HTTPError) as error:
                post(route, data, headers)
            self.assertEqual(error.exception.code, expected)
            error.exception.close()
        with server._skill_conversion_lock:
            with self.assertRaises(HTTPError) as error:
                post("/api/skills/convert", {"request_id": key})
            self.assertEqual(error.exception.code, 409)
            error.exception.close()


if __name__ == "__main__":
    unittest.main()
