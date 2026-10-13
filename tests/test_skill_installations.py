from __future__ import annotations

import copy
import json
import os
import stat
import threading
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from test_skill_backend import SkillBackendTests
from webapp import server, skill_conversion as skills, skill_drafts, skill_installations as installed, workflows


class SkillInstallationTests(unittest.TestCase):
    def setUp(self) -> None:
        self.fixture = SkillBackendTests()
        self.fixture.setUp()
        self.addCleanup(self.fixture.doCleanups)
        self.root = Path(self.fixture.directory.name).resolve() / "installed"
        binding = patch.object(installed, "INSTALL_ROOT", self.root)
        binding.start()
        self.addCleanup(binding.stop)
        self.record = self.fixture.prepare()
        self.result = self.fixture.candidate(self.record)
        self.approval = {
            "reviewer": "human-operator", "checks": dict.fromkeys(installed.REVIEW_FIELDS, True),
            "candidate_sha256": skills.digest(self.result["package"]),
        }

    def install(self, result: dict | None = None) -> dict:
        result = result or self.result
        return installed.install(
            self.record, result, {**self.approval, "candidate_sha256": skills.digest(result["package"])},
            self.fixture.capabilities, self.fixture.text, lambda *_: 100,
        )

    def enable(self, item: dict) -> dict:
        return installed.set_enabled(
            item["id"], item["revision"], True, self.fixture.capabilities, self.fixture.text,
        )

    def ref(self, item: dict) -> list[dict]:
        return [{"id": item["id"], "revision": item["revision"]}]

    def test_large_converted_source_survives_installation_without_expanding_bindings(self) -> None:
        self.fixture.payload["source"]["files"].extend(
            {"path": f"reference-{index}.md", "content": "x" * 96000} for index in range(5)
        )
        self.record = self.fixture.prepare()
        self.result = self.fixture.candidate(self.record)
        item = self.install()
        saved = installed.load(item["id"], item["revision"])
        self.assertEqual(saved["record"]["source"], self.record["source"])
        self.assertFalse(item["enabled"])
        self.assertNotIn("mv", item["categories"])

    def test_install_disabled_persistent_permissions_exact_approval_and_provenance(self) -> None:
        item = self.install()
        self.assertFalse(item["enabled"])
        self.assertTrue(item["available"])
        self.assertEqual(stat.S_IMODE(self.root.stat().st_mode), 0o700)
        path = self.root / f"{item['id']}.json"
        self.assertEqual(stat.S_IMODE(path.stat().st_mode), 0o600)
        saved = installed.load(item["id"], item["revision"])
        self.assertEqual(saved["approval"]["record_sha256"], skills.digest(self.record))
        self.assertEqual(saved["approval"]["result_sha256"], skills.digest(self.result))
        self.assertEqual(saved["record"]["source"], self.record["source"])
        self.assertEqual(saved["record"]["review"], self.record["review"])
        self.assertEqual(installed.list_installed(self.fixture.capabilities, self.fixture.text)[0], item)

    def test_human_checks_hash_license_and_token_budget_block_install(self) -> None:
        cases = [
            ({**self.approval, "checks": {}}, "human_review"),
            ({**self.approval, "reviewer": ""}, "reviewer"),
            ({**self.approval, "candidate_sha256": "0" * 64}, "candidate_changed"),
        ]
        for approval, error in cases:
            with self.subTest(error=error), self.assertRaisesRegex(skills.SkillError, error):
                installed.install(self.record, self.result, approval, self.fixture.capabilities,
                                  self.fixture.text, lambda *_: 100)
        with self.assertRaisesRegex(skills.SkillError, "candidate_invalid"):
            installed.install(self.record, self.result, self.approval, self.fixture.capabilities,
                              self.fixture.text, lambda *_: 9000)
        self.fixture.review("restricted")
        with self.assertRaisesRegex(skills.SkillError, "snapshot_changed"):
            self.install()
        self.assertEqual(list(self.root.glob("*.json")), [])

    def test_missing_package_and_malformed_output_fail_explicitly(self) -> None:
        for result in ({}, {"status": "draft"}, {**self.result, "package": None}):
            with self.subTest(result=result), self.assertRaisesRegex(skills.SkillError, "candidate_invalid"):
                installed.install(self.record, result, self.approval, self.fixture.capabilities,
                                  self.fixture.text, lambda *_: 100)

    def test_automatic_install_records_validation_not_fabricated_human_checks(self) -> None:
        item = installed.install(
            self.record, self.result, {"candidate_sha256": skills.digest(self.result["package"])},
            self.fixture.capabilities, self.fixture.text, lambda *_: 100,
        )
        saved = installed.load(item["id"], item["revision"])
        self.assertFalse(item["enabled"])
        self.assertEqual(saved["approval"]["method"], "automatic-validation")
        self.assertNotIn("checks", saved["approval"])
        enabled = self.enable(item)
        instructions, usage = installed.resolve(self.ref(enabled), "prompt-enhancement", "video", "h3",
                                                self.fixture.capabilities, self.fixture.text)
        self.assertTrue(instructions)
        self.assertEqual(usage[0]["id"], item["id"])

    def test_host_snapshot_changes_during_install_tokenization_block_publication(self) -> None:
        state = {"text": self.fixture.text}
        def count(*_):
            state["text"] = {**self.fixture.text, "model_ids": ["changed"]}
            return 100
        with (
            patch.object(server, "_skill_environment", side_effect=lambda: (self.fixture.capabilities, state["text"])),
            patch.object(server, "_skill_token_count", side_effect=count),
            self.assertRaisesRegex(skills.SkillError, "snapshot_changed"),
        ):
            installed.install(
                self.record, self.result, self.approval, self.fixture.capabilities, self.fixture.text,
                lambda system, source: server._checked_skill_token_count(self.record, system, source),
            )
        self.assertFalse(self.root.exists())

    def test_same_version_never_overwrites_and_new_version_stays_disabled(self) -> None:
        first = self.enable(self.install())
        with self.assertRaisesRegex(skills.SkillError, "already_installed"):
            self.install()
        changed = copy.deepcopy(self.result)
        changed["package"]["description"] += " changed"
        with self.assertRaisesRegex(skills.SkillError, "already_installed"):
            self.install(changed)
        changed["package"]["version"] = "1.0.1"
        second = self.install(changed)
        self.assertFalse(second["enabled"])
        self.assertTrue(installed.load(first["id"], first["revision"])["enabled"])

    def test_categories_multiselect_persistence_cas_and_resolve_filter(self) -> None:
        item = installed.install(self.record, self.result, {**self.approval, "categories": ["music", "video"]},
                                 self.fixture.capabilities, self.fixture.text, lambda *_: 100)
        self.assertEqual(item["categories"], ["video", "music"])
        self.assertEqual(installed.load(item["id"], item["revision"])["categories"], ["video", "music"])
        item = self.enable(item)
        with self.assertRaisesRegex(skills.SkillError, "category_mismatch"):
            installed.resolve(self.ref(item), "prompt-enhancement", "image", "hidream",
                              self.fixture.capabilities, self.fixture.text)
        changed = installed.set_categories(item["id"], item["revision"], ["image", "long-video"],
                                           self.fixture.capabilities, self.fixture.text)
        self.assertEqual(changed["categories"], ["image", "long-video"])
        self.assertTrue(changed["enabled"])
        self.assertEqual(changed["candidate_sha256"], item["candidate_sha256"])
        with self.assertRaisesRegex(skills.SkillError, "changed"):
            installed.set_categories(item["id"], item["revision"], ["video"],
                                     self.fixture.capabilities, self.fixture.text)
        self.assertTrue(installed.resolve(self.ref(changed), "storyboard", "long-video", "h3",
                                         self.fixture.capabilities, self.fixture.text)[0])

    def test_categories_validate_and_legacy_install_infers_only_supported_bindings(self) -> None:
        item = self.install()
        for value in ([], ["unknown"], ["video", "video"], "video", [False], [{}]):
            with self.subTest(value=value), self.assertRaisesRegex(skills.SkillError, "invalid_skill_categories"):
                installed.set_categories(item["id"], item["revision"], value,
                                         self.fixture.capabilities, self.fixture.text)
        path = self.root / f"{item['id']}.json"
        legacy = installed.load(item["id"], item["revision"])
        del legacy["categories"]
        path.write_bytes(skills.encoded(legacy))
        self.assertEqual(installed.list_installed(self.fixture.capabilities, self.fixture.text)[0]["categories"],
                         ["video", "image", "music", "long-video"])
        result = copy.deepcopy(self.result)
        result["package"]["bindings"] = result["package"]["bindings"][:1]
        result["package"]["name"] = "video-only"
        with self.assertRaisesRegex(skills.SkillError, "invalid_skill_categories"):
            installed.install(self.record, result, {**self.approval, "candidate_sha256": skills.digest(result["package"]),
                                                    "categories": ["image"]},
                              self.fixture.capabilities, self.fixture.text, lambda *_: 100)

    def test_cas_enable_disable_delete_and_history_independence(self) -> None:
        item = self.install()
        enabled = self.enable(item)
        with self.assertRaisesRegex(skills.SkillError, "changed"):
            self.enable(item)
        with self.assertRaisesRegex(skills.SkillError, "disable_skill"):
            installed.delete(enabled["id"], enabled["revision"])
        disabled = installed.set_enabled(
            enabled["id"], enabled["revision"], False, self.fixture.capabilities, self.fixture.text,
        )
        usage = [{"id": item["id"], "name": item["name"], "version": item["version"],
                  "candidate_sha256": item["candidate_sha256"]}]
        installed.delete(disabled["id"], disabled["revision"])
        self.assertEqual(installed.validate_usage(usage), usage)
        self.assertEqual(installed.list_installed(self.fixture.capabilities, self.fixture.text), [])

    def test_stale_capabilities_license_and_settings_block_loading_but_allow_disable(self) -> None:
        item = self.enable(self.install())
        for capabilities, text in (
            ({**self.fixture.capabilities, "changed": True}, self.fixture.text),
            (self.fixture.capabilities, {**self.fixture.text, "model_ids": ["new-model"]}),
        ):
            listed = installed.list_installed(capabilities, text)[0]
            self.assertFalse(listed["available"])
            with self.assertRaisesRegex(skills.SkillError, "snapshot_changed"):
                installed.resolve(self.ref(item), "prompt-enhancement", "video", "h3", capabilities, text)
        self.fixture.review("restricted")
        with self.assertRaisesRegex(skills.SkillError, "snapshot_changed"):
            installed.resolve(self.ref(item), "prompt-enhancement", "video", "h3",
                              self.fixture.capabilities, self.fixture.text)
        disabled = installed.set_enabled(item["id"], item["revision"], False,
                                         self.fixture.capabilities, self.fixture.text)
        self.assertFalse(disabled["enabled"])

    def test_tampered_candidate_and_record_break_exact_approval(self) -> None:
        item = self.install()
        path = self.root / f"{item['id']}.json"
        original = path.read_bytes()
        for target in ("result", "record", "approval"):
            data = skills.parse_json(original)
            if target == "result":
                data["result"]["package"]["bindings"][0]["instructions"] += " tampered"
            elif target == "record":
                data["record"]["source"]["files"][0]["content"] += " tampered"
            else:
                data["approval"]["checks"]["execution"] = False
            path.write_bytes(skills.encoded(data))
            with self.subTest(target=target), self.assertRaisesRegex(skills.SkillError, "corrupt"):
                installed.list_installed(self.fixture.capabilities, self.fixture.text)

    def test_links_special_files_and_traversal_are_rejected(self) -> None:
        for key in ("../x", "/x", "not-a-uuid", None):
            with self.assertRaises(skills.SkillError):
                installed.load(key, "0" * 64)
        item = self.install()
        path = self.root / f"{item['id']}.json"
        destination = path.with_suffix(".saved")
        path.rename(destination)
        path.symlink_to(destination)
        with self.assertRaises(skills.SkillError):
            installed.load(item["id"], item["revision"])
        path.unlink()
        os.mkfifo(path)
        with self.assertRaisesRegex(skills.SkillError, "unsafe"):
            installed.load(item["id"], item["revision"])

    def test_disabled_scope_duplicate_selection_and_maximum(self) -> None:
        item = self.install()
        with self.assertRaisesRegex(skills.SkillError, "not_enabled"):
            installed.resolve(self.ref(item), "prompt-enhancement", "video", "h3",
                              self.fixture.capabilities, self.fixture.text)
        item = self.enable(item)
        with self.assertRaisesRegex(skills.SkillError, "binding_mismatch"):
            installed.resolve(self.ref(item), "storyboard", "image", "h3",
                              self.fixture.capabilities, self.fixture.text)
        for refs in (self.ref(item) * 2, self.ref(item) * 5, ["bad"], [{"id": item["id"]}]):
            with self.assertRaises(skills.SkillError):
                installed.selection(refs)

    def test_multiple_skills_order_and_instructions_only(self) -> None:
        first = self.enable(self.install())
        result = copy.deepcopy(self.result)
        result["package"]["name"] = "second-skill"
        second = self.enable(self.install(result))
        refs = self.ref(second) + self.ref(first)
        knowledge, usage = installed.resolve(
            refs, "prompt-enhancement", "image", "flux2-klein-4b", self.fixture.capabilities, self.fixture.text,
        )
        self.assertEqual([u["name"] for u in usage], ["second-skill", first["name"]])
        settings = {"model": "local-text", "skills": refs, "target_model": "flux2-klein-4b"}
        with patch.object(server, "_skill_environment", return_value=(self.fixture.capabilities, self.fixture.text)), (
            patch.object(server, "_skill_token_count", return_value=100)
        ):
            system, source, used = server._skill_creative_input(settings, "host-contract", "user request", "image")
        self.assertIn("take precedence", system)
        self.assertEqual(skills.parse_json(source), {"user_request": "user request", "approved_knowledge": knowledge})
        self.assertEqual(used, usage)
        self.assertNotIn("report", skills.parse_json(source))

    def test_combined_and_full_input_token_budgets_block_before_generation(self) -> None:
        item = self.enable(self.install())
        settings = {"model": "local-text", "mode": "video", "prompt": "Original",
                    "skills": self.ref(item), "target_model": "h3"}
        for counts in ([2049], [100, 16001]):
            with (
                patch.object(server, "_local_text_models", return_value=[{"id": "local-text"}]),
                patch.object(server, "_skill_environment", return_value=(self.fixture.capabilities, self.fixture.text)),
                patch.object(server, "_skill_token_count", side_effect=counts),
                patch.object(server, "_request_local_text_json") as generate,
                self.assertRaisesRegex(skills.SkillError, "budget_exceeded"),
            ):
                server._enhance_prompt_with_local_model(settings)
            generate.assert_not_called()

    def test_combined_and_full_input_utf8_budgets_are_independent_of_tokens(self) -> None:
        result = copy.deepcopy(self.result)
        for binding in result["package"]["bindings"]:
            binding["instructions"] = "海" * 6000
        first = self.enable(self.install(result))
        result["package"]["name"] = "second-unicode"
        second = self.enable(self.install(result))
        with (
            patch.object(server, "_skill_environment", return_value=(self.fixture.capabilities, self.fixture.text)),
            patch.object(server, "_skill_token_count", return_value=100) as tokenize,
        ):
            settings = {"model": "local-text", "skills": self.ref(first) + self.ref(second), "target_model": "h3"}
            with self.assertRaisesRegex(skills.SkillError, "combined_budget"):
                server._skill_creative_input(settings, "host", "source", "video")
            tokenize.assert_not_called()
            settings["skills"] = self.ref(first)
            with self.assertRaisesRegex(skills.SkillError, "creative_input_budget"):
                server._skill_creative_input(settings, "host", "😀" * 30000, "video")

    def test_selected_contract_validation_and_no_skill_backward_compatibility(self) -> None:
        item = self.enable(self.install())
        settings = {"model": "local-text", "mode": "video", "prompt": "Original",
                    "skills": self.ref(item), "target_model": "h3"}
        with (
            patch.object(server, "_local_text_models", return_value=[{"id": "local-text"}]),
            patch.object(server, "_skill_environment", return_value=(self.fixture.capabilities, self.fixture.text)),
            patch.object(server, "_skill_token_count", return_value=100),
            patch.object(server, "_request_local_text_json",
                         return_value={"optimized_prompt": "Edited", "keywords": ["Original", "Subject", "Action"]}) as generate,
        ):
            output = server._enhance_prompt_with_local_model(settings)
            self.assertEqual(output["skill_usage"][0]["candidate_sha256"], item["candidate_sha256"])
            self.assertTrue(generate.call_args.kwargs["strict"])
        with patch.object(server, "_skill_environment") as environment:
            self.assertEqual(server._skill_creative_input({}, "system", "source", "video"), ("system", "source", []))
            environment.assert_not_called()

    def test_storyboard_selected_knowledge_preserves_timing_and_rejects_extra_fields(self) -> None:
        item = self.enable(self.install())
        settings = {"model": "local-text", "story": "A traveller returns home", "shot_count": 1,
                    "total_duration": 8, "shot_duration": 8, "skills": self.ref(item), "target_model": "h3"}
        shot = {"title": "Home", "prompt": "A traveller returns home", "music_prompt": "Warm strings", "duration": 8}
        with (
            patch.object(server, "_local_text_models", return_value=[{"id": "local-text"}]),
            patch.object(server, "_skill_environment", return_value=(self.fixture.capabilities, self.fixture.text)),
            patch.object(server, "_skill_token_count", return_value=100),
            patch.object(server, "_request_local_text_json", return_value={"shots": [shot]}) as generate,
        ):
            output = server._storyboard_with_local_model(settings)
            self.assertEqual(output["shots"][0]["duration"], 8)
            self.assertEqual(output["skill_usage"][0]["id"], item["id"])
            self.assertIn("exactly 8 seconds", generate.call_args.args[1])
            self.assertTrue(generate.call_args.kwargs["strict"])
            generate.return_value = {"shots": [{**shot, "duration": 5}]}
            with self.assertRaisesRegex(RuntimeError, "differs"):
                server._storyboard_with_local_model(settings)
            generate.return_value = {"shots": [shot], "approved": True}
            with self.assertRaisesRegex(RuntimeError, "shot count"):
                server._storyboard_with_local_model(settings)

    def test_generation_target_mismatch_and_disable_during_count_fail_before_call(self) -> None:
        item = self.enable(self.install())
        settings = {"model": "local-text", "skills": self.ref(item), "target_model": "unknown"}
        with patch.object(server, "_skill_environment", return_value=(self.fixture.capabilities, self.fixture.text)):
            with self.assertRaisesRegex(skills.SkillError, "binding_mismatch"):
                server._skill_creative_input(settings, "system", "source", "video")
            settings["target_model"] = "h3"
            calls = 0
            def count(*_):
                nonlocal calls
                calls += 1
                if calls == 1:
                    installed.set_enabled(item["id"], item["revision"], False,
                                          self.fixture.capabilities, self.fixture.text)
                return 100
            with patch.object(server, "_skill_token_count", side_effect=count):
                with self.assertRaisesRegex(skills.SkillError, "changed"):
                    server._skill_creative_input(settings, "system", "source", "video")

    def test_byte_budgets_and_capacity_leave_existing_install_unchanged(self) -> None:
        first = self.install()
        changed = copy.deepcopy(self.result)
        changed["package"]["name"] = "another-skill"
        for field in ("MAX_PACKAGE_BYTES", "MAX_TOTAL_BYTES", "MAX_PACKAGES"):
            with patch.object(installed, field, 1), self.assertRaises(skills.SkillError):
                self.install(changed)
        self.assertEqual(installed.load(first["id"], first["revision"])["result"], self.result)

    def test_skill_usage_saved_in_all_media_history_without_reloading_deleted_skill(self) -> None:
        item = self.install()
        usage = [{"id": item["id"], "name": item["name"], "version": item["version"],
                  "candidate_sha256": item["candidate_sha256"]}]
        installed.delete(item["id"], item["revision"])
        for kind, payload in (
            ("video", {"prompt": "p", "duration": 5}),
            ("image", {"prompt": "p"}),
            ("music", {"prompt": "p", "lyrics_mode": "instrumental"}),
        ):
            generation = server._history_generation(kind, "p", {**payload, "skill_usage": usage})
            self.assertEqual(generation["skill_usage"], usage)
        manifest = workflows._validate_payload({
            "name": "Story", "aspect": "16:9", "shots": [{"prompt": "p", "skill_usage": usage}],
            "soundtrack": {"mode": "none"},
        })
        self.assertEqual(manifest["shots"][0]["skill_usage"], usage)

    def test_http_install_enable_selection_and_localhost_boundary(self) -> None:
        httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()
        self.addCleanup(thread.join)
        self.addCleanup(httpd.server_close)
        self.addCleanup(httpd.shutdown)
        url = f"http://127.0.0.1:{httpd.server_port}"

        def request(path: str, payload: dict | None = None, origin: str | None = None):
            headers = {"Content-Type": "application/json"}
            if origin:
                headers["Origin"] = origin
            req = Request(url + path, data=skills.encoded(payload) if payload is not None else None, headers=headers)
            try:
                with urlopen(req) as response:
                    return response.status, json.loads(response.read())
            except HTTPError as exc:
                with exc:
                    return exc.code, json.loads(exc.read())

        payload = {**self.approval, "request_id": self.result["request_id"],
                   "result_text": skills.encoded(self.result).decode()}
        with patch.object(server, "_skill_environment", return_value=(self.fixture.capabilities, self.fixture.text)), (
            patch.object(server, "_skill_token_count", return_value=100)
        ):
            status, data = request("/api/skills/install", payload, "https://not-local.example")
            self.assertEqual(status, 403)
            with (
                patch.object(skill_drafts, "DRAFT_ROOT", self.root.parent / "drafts"),
                patch.object(server, "_local_text_models", return_value=[{"id": "local-text"}]),
                patch.object(server, "_request_local_text_json", return_value=self.result),
            ):
                status, converted = request("/api/skills/convert", {
                    "request_id": self.result["request_id"], "draft_id": None, "draft_revision": None,
                    "name": "Converted notes",
                })
                self.assertEqual(status, 200, converted)
                draft = converted["draft"]
                self.assertEqual(skill_drafts.load(draft["id"])[0]["result_text"],
                                 json.dumps(self.result, ensure_ascii=False, indent=2))
                with patch.object(skill_drafts, "save", side_effect=skills.SkillError(
                    "skill_draft_capacity_reached", 409,
                )):
                    status, failed_save = request("/api/skills/convert", {
                        "request_id": self.result["request_id"], "draft_id": None,
                        "draft_revision": None, "name": "Unsaved notes",
                    })
                    self.assertEqual(status, 409)
                    self.assertEqual(failed_save["error"], "skill_draft_capacity_reached")
                    self.assertEqual(failed_save["result"], self.result)
                    self.assertTrue(failed_save["validation"]["valid"])
                    self.assertNotIn("draft", failed_save)
                status, data = request("/api/skills/install", {"draft_id": draft["id"], "revision": "0" * 64})
                self.assertEqual(status, 409)
                self.assertEqual(data["error"], "skill_draft_changed")
                status, data = request("/api/skills/install", {
                    "draft_id": draft["id"], "revision": draft["revision"], "categories": ["video"],
                })
                self.assertEqual(status, 200, data)
                automatic = data["item"]
                self.assertFalse(automatic["enabled"])
                self.assertEqual(automatic["reviewer"], "automatic-validation")
                installed.delete(automatic["id"], automatic["revision"])
            status, data = request("/api/skills/install", payload)
            self.assertEqual(status, 200, data)
            item = data["item"]
            self.assertFalse(item["enabled"])
            status, data = request(f"/api/skills/installed/{item['id']}/enabled",
                                   {"enabled": True, "revision": item["revision"]})
            self.assertEqual(status, 200, data)
            self.assertTrue(data["item"]["enabled"])
            enabled = data["item"]
            status, data = request(f"/api/skills/installed/{item['id']}/categories",
                                   {"categories": ["video", "image"], "revision": enabled["revision"]})
            self.assertEqual(status, 200, data)
            self.assertEqual(data["item"]["categories"], ["video", "image"])
            status, data = request(f"/api/skills/installed/{item['id']}/categories",
                                   {"categories": ["music"], "revision": enabled["revision"]})
            self.assertEqual(status, 409)
            status, data = request("/api/skills/installed")
            self.assertEqual(status, 200)
            self.assertEqual(data["storage_path"], str(installed.INSTALL_ROOT))
            self.assertIs(data["preset_apply_available"], True)
            status, data = request("/api/prompt-enhancements", {
                "prompt": "p", "model": "local-text", "mode": "video", "skills": self.ref(item) * 5,
                "target_model": "h3",
            })
            self.assertEqual(status, 400)
            self.assertEqual(data["error"], "invalid_skill_selection")

    def test_http_apply_publishes_and_updates_same_draft_preset_with_cas(self) -> None:
        self.fixture.server_patches()
        draft_root = self.root.parent / "drafts"
        with patch.object(skill_drafts, "DRAFT_ROOT", draft_root):
            legacy_result = copy.deepcopy(self.result)
            legacy_result["package"]["name"] = "legacy-installed"
            legacy = self.install(legacy_result)
            legacy_path = self.root / f'{legacy["id"]}.json'
            legacy_bytes = legacy_path.read_bytes()

            draft = skill_drafts.save({
                "id": None, "revision": None, "name": "Creative preset",
                "request_id": self.record["request"]["trusted_context"]["request_id"],
                "result_text": skills.encoded(self.result).decode(),
            })
            httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
            thread = threading.Thread(target=httpd.serve_forever, daemon=True)
            thread.start()
            self.addCleanup(thread.join)
            self.addCleanup(httpd.server_close)
            self.addCleanup(httpd.shutdown)
            url = f"http://127.0.0.1:{httpd.server_port}"

            def request(path: str, payload: dict | None = None):
                req = Request(url + path, data=skills.encoded(payload) if payload is not None else None)
                try:
                    with urlopen(req) as response:
                        return response.status, json.loads(response.read())
                except HTTPError as exc:
                    with exc:
                        return exc.code, json.loads(exc.read())

            with patch.object(server, "_skill_environment", return_value=(self.fixture.capabilities, self.fixture.text)), (
                patch.object(server, "_skill_token_count", return_value=100)
            ):
                status, response = request("/api/skills/apply", {
                    "draft_id": draft["id"], "revision": draft["revision"],
                    "published_id": None, "published_revision": None, "categories": ["video"],
                })
                self.assertEqual(status, 200, response)
                first = response["item"]
                self.assertTrue(first["enabled"])
                self.assertEqual(first["draft_id"], draft["id"])
                self.assertEqual(first["categories"], ["video"])
                self.assertEqual(installed.load(first["id"], first["revision"])["draft_id"], draft["id"])

                status, conflict = request("/api/skills/apply", {
                    "draft_id": draft["id"], "revision": draft["revision"],
                })
                self.assertEqual(status, 409)
                self.assertEqual(conflict["error"], "skill_preset_changed")
                status, conflict = request("/api/skills/apply", {
                    "draft_id": draft["id"], "revision": draft["revision"],
                    "published_id": first["id"], "published_revision": "0" * 64,
                })
                self.assertEqual(status, 409)

                changed = copy.deepcopy(self.result)
                changed["package"]["bindings"][0]["instructions"] = "Use only the user's supplied scene details."
                edited = skill_drafts.save({
                    "id": draft["id"], "revision": draft["revision"], "name": draft["name"],
                    "request_id": self.record["request"]["trusted_context"]["request_id"],
                    "result_text": skills.encoded(changed).decode(),
                })
                status, response = request("/api/skills/apply", {
                    "draft_id": edited["id"], "revision": edited["revision"],
                    "published_id": first["id"], "published_revision": first["revision"],
                })
                self.assertEqual(status, 200, response)
                updated = response["item"]
                self.assertEqual(updated["id"], first["id"])
                self.assertNotEqual(updated["revision"], first["revision"])
                self.assertEqual(updated["draft_id"], draft["id"])
                self.assertTrue(updated["enabled"])
                self.assertEqual(updated["categories"], ["video"])
                stored = installed.load(updated["id"], updated["revision"])
                self.assertEqual(stored["result"]["package"]["bindings"][0]["instructions"],
                                 changed["package"]["bindings"][0]["instructions"])
                status, conflict = request("/api/skills/apply", {
                    "draft_id": edited["id"], "revision": edited["revision"],
                    "published_id": first["id"], "published_revision": first["revision"],
                })
                self.assertEqual(status, 409)
                self.assertEqual(conflict["error"], "skill_preset_changed")

                status, listing = request("/api/skills/installed")
                self.assertEqual(status, 200)
                public_legacy = next(item for item in listing["items"] if item["id"] == legacy["id"])
                self.assertIsNone(public_legacy["draft_id"])
                self.assertEqual(legacy_path.read_bytes(), legacy_bytes)

    def test_http_apply_first_publish_race_returns_one_conflict_not_a_duplicate(self) -> None:
        self.fixture.server_patches()
        with patch.object(skill_drafts, "DRAFT_ROOT", self.root.parent / "drafts"):
            draft = skill_drafts.save({
                "id": None, "revision": None, "name": "Concurrent preset",
                "request_id": self.record["request"]["trusted_context"]["request_id"],
                "result_text": skills.encoded(self.result).decode(),
            })
            httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
            thread = threading.Thread(target=httpd.serve_forever, daemon=True)
            thread.start()
            self.addCleanup(thread.join)
            self.addCleanup(httpd.server_close)
            self.addCleanup(httpd.shutdown)
            url = f"http://127.0.0.1:{httpd.server_port}"

            def apply():
                barrier.wait(timeout=5)
                req = Request(url + "/api/skills/apply", data=skills.encoded({
                    "draft_id": draft["id"], "revision": draft["revision"],
                    "published_id": None, "published_revision": None,
                }))
                try:
                    with urlopen(req) as response:
                        return response.status
                except HTTPError as exc:
                    with exc:
                        return exc.code

            barrier = threading.Barrier(2)
            with patch.object(server, "_skill_environment", return_value=(self.fixture.capabilities, self.fixture.text)), (
                patch.object(server, "_skill_token_count", return_value=100)
            ):
                workers = [threading.Thread(target=lambda: outcomes.append(apply())) for _ in range(2)]
                outcomes = []
                for worker in workers:
                    worker.start()
                for worker in workers:
                    worker.join(timeout=10)
                    self.assertFalse(worker.is_alive())
            self.assertCountEqual(outcomes, [200, 409])
            saved = [installed._read(path.stem)[0] for path in installed._paths()]
            published = [item for item in saved if item.get("draft_id") == draft["id"]]
            self.assertEqual(len(published), 1)
            public = installed.list_installed(self.fixture.capabilities, self.fixture.text)[0]
            self.assertEqual(public["categories"], public["supported_categories"])

    def test_http_apply_rejects_unverified_license_and_excess_token_budget(self) -> None:
        self.fixture.server_patches()
        with patch.object(skill_drafts, "DRAFT_ROOT", self.root.parent / "drafts"):
            httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
            thread = threading.Thread(target=httpd.serve_forever, daemon=True)
            thread.start()
            self.addCleanup(thread.join)
            self.addCleanup(httpd.server_close)
            self.addCleanup(httpd.shutdown)
            url = f"http://127.0.0.1:{httpd.server_port}"

            def apply(draft: dict):
                req = Request(url + "/api/skills/apply", data=skills.encoded({
                    "draft_id": draft["id"], "revision": draft["revision"],
                }))
                try:
                    with urlopen(req) as response:
                        return response.status, json.loads(response.read())
                except HTTPError as exc:
                    with exc:
                        return exc.code, json.loads(exc.read())

            with patch.object(server, "_skill_environment", return_value=(self.fixture.capabilities, self.fixture.text)):
                self.fixture.review("restricted")
                unknown_record = self.fixture.prepare(verified=False)
                unknown_result = self.fixture.candidate(unknown_record)
                unknown = skill_drafts.save({
                    "id": None, "revision": None, "name": "Unknown-license preset",
                    "request_id": unknown_record["request"]["trusted_context"]["request_id"],
                    "result_text": skills.encoded(unknown_result).decode(),
                })
                with patch.object(server, "_skill_token_count", return_value=100):
                    status, response = apply(unknown)
                self.assertEqual(status, 422)
                self.assertEqual(response["error"], "skill_candidate_invalid")
                self.assertEqual(list(self.root.glob("*.json")), [])

                self.fixture.review("verified")
                valid = skill_drafts.save({
                    "id": None, "revision": None, "name": "Over-budget preset",
                    "request_id": self.record["request"]["trusted_context"]["request_id"],
                    "result_text": skills.encoded(self.result).decode(),
                })
                with patch.object(server, "_skill_token_count", return_value=9000):
                    status, response = apply(valid)
                self.assertEqual(status, 422)
                self.assertEqual(response["error"], "skill_candidate_invalid")
                self.assertEqual(list(self.root.glob("*.json")), [])
