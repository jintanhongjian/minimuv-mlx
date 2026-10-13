import base64
import hashlib
import unittest
import json
import threading
import ssl
import tempfile
from pathlib import Path
from unittest.mock import patch
from urllib.request import Request, urlopen
from urllib.error import HTTPError

from webapp import skill_sources as sources, skill_conversion as skills
from webapp import server


class SkillSourceTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        registry = patch.object(skills, "LICENSE_REVIEWS_PATH", Path(self.directory.name) / "reviews.json")
        registry.start()
        self.addCleanup(registry.stop)
        self.commit = "a" * 40
        self.content = b"# Original fixture\nPreserve the subject."
        self.sha = hashlib.sha1(f"blob {len(self.content)}\0".encode() + self.content).hexdigest()
        self.license_content = b"MIT License\n\nPermission is hereby granted, free of charge, to any person obtaining a copy."
        self.license_sha = hashlib.sha1(
            f"blob {len(self.license_content)}\0".encode() + self.license_content
        ).hexdigest()
        self.blobs = {self.sha: self.content, self.license_sha: self.license_content}
        self.tree = []
        for path in ("skills/example/SKILL.md", "skills/example/reference.md", "LICENSE", "elsewhere/SKILL.md"):
            content = self.license_content if path == "LICENSE" else self.content
            sha = self.license_sha if path == "LICENSE" else self.sha
            self.tree.append({
                "path": path, "type": "blob", "mode": "100644", "size": len(content), "sha": sha,
            })
        self.calls = []

    def api(self, path, *args):
        self.calls.append(path)
        if path.endswith("/repos/test/repo"):
            return {"default_branch": "main"}
        if "/commits/" in path:
            return {"sha": self.commit}
        if "/git/trees/" in path:
            return {"truncated": False, "tree": self.tree}
        if "/git/blobs/" in path:
            sha = path.rsplit("/", 1)[-1]
            return {"sha": sha, "encoding": "base64", "content": base64.b64encode(self.blobs[sha]).decode()}
        raise AssertionError(path)

    def test_repository_directory_and_file_discovery_pin_commit(self):
        with patch.object(sources, "_api", side_effect=self.api):
            for url in (
                "https://github.com/test/repo",
                "https://github.com/test/repo/tree/main/skills/example",
                "https://github.com/test/repo/blob/main/skills/example/SKILL.md",
            ):
                data = sources.discover({"url": url})
                self.assertEqual(data["revision"], self.commit)
                self.assertEqual(data["license_status"], "unknown")
                self.assertIn("LICENSE", [item["path"] for item in data["files"]])
                self.assertEqual(data["license_path"], "LICENSE")
                self.assertEqual(data["license_sources"][0]["source"]["files"][0]["content"], self.license_content.decode())
                self.assertEqual(data["license_sources"][0]["detected_licenses"], [{"license_name":"MIT","path":"LICENSE"}])
                self.assertTrue(next(item for item in data["files"] if item["path"] == "LICENSE")["license"])
            self.assertEqual(len(data["files"]), 2)
            self.assertEqual(data["selected_path"], "skills/example/SKILL.md")
        self.assertTrue(any(self.commit in path for path in self.calls))

    def test_fetch_is_exact_text_at_fixed_commit_and_does_not_verify_license(self):
        with patch.object(sources, "_api", side_effect=self.api):
            data = sources._fetch_files({
                "origin": "https://github.com/test/repo", "revision": self.commit,
                "paths": ["skills/example/SKILL.md", "LICENSE"],
            })
        self.assertEqual(data["source"]["files"][0]["content"], self.content.decode())
        self.assertEqual(data["source"]["revision"], self.commit)
        self.assertEqual(data["license_status"], "unknown")
        self.assertEqual(data["detected_licenses"], [{"license_name": "MIT", "path": "LICENSE"}])

    def fetch_payload(self, license_path="LICENSE"):
        return {
            "origin": "https://github.com/test/repo", "revision": self.commit,
            "paths": ["skills/example/SKILL.md"], "license_name": "MIT", "license_path": license_path,
        }

    def confirm_license(self, license_path="LICENSE"):
        evidence = sources._fetch_files({
            "origin": "https://github.com/test/repo", "revision": self.commit, "paths": [license_path],
        })
        source = evidence["source"]
        skills.confirm_detected_license({
            "origin": source["origin"], "revision": source["revision"],
            "files": [{"path": item["path"], "content": item["content"]} for item in source["files"]],
        }, "MIT", license_path)

    def test_public_fetch_requires_exact_confirmation_before_reading_documents(self):
        with patch.object(sources, "_api", side_effect=self.api):
            with self.assertRaisesRegex(skills.SkillError, "confirmation_required"):
                sources.fetch_files(self.fetch_payload())
            self.assertNotIn(f"/repos/test/repo/git/blobs/{self.sha}", self.calls)
            self.confirm_license()
            with self.assertRaisesRegex(skills.SkillError, "confirmation_required"):
                sources.fetch_files({**self.fetch_payload(), "license_name": "CC0-1.0"})
            data = sources.fetch_files(self.fetch_payload())
            self.assertEqual(data["license_status"], "verified")
            self.assertEqual(skills.license_review(data["source"])["status"], "verified")
            data["source"]["files"][0]["content"] += " edited"
            self.assertEqual(skills.license_review(data["source"])["status"], "unknown")
            with self.assertRaisesRegex(skills.SkillError, "confirmation_required"):
                sources.fetch_files({**self.fetch_payload(), "revision": "b" * 40})

    def test_discovery_includes_nearest_ancestor_license_and_rejects_wrong_scope(self):
        self.tree.append({**self.tree[2], "path": "skills/LICENSE.md"})
        with patch.object(sources, "_api", side_effect=self.api):
            data = sources.discover({"url": "https://github.com/test/repo/blob/main/skills/example/SKILL.md"})
            self.assertEqual(data["license_path"], "skills/LICENSE.md")
            self.confirm_license()
            with self.assertRaisesRegex(skills.SkillError, "scope_mismatch"):
                sources.fetch_files(self.fetch_payload())
            self.confirm_license("skills/LICENSE.md")
            self.assertEqual(sources.fetch_files(self.fetch_payload("skills/LICENSE.md"))["license_status"], "verified")
            with self.assertRaisesRegex(skills.SkillError, "scope_mismatch"):
                sources.fetch_files({**self.fetch_payload("skills/LICENSE.md"), "paths": ["elsewhere/SKILL.md"]})

    def test_changed_license_bytes_cannot_reuse_confirmation(self):
        with patch.object(sources, "_api", side_effect=self.api):
            self.confirm_license()
            content = self.license_content + b"\nNew notice"
            sha = hashlib.sha1(f"blob {len(content)}\0".encode() + content).hexdigest()
            self.blobs[sha] = content
            self.tree[2].update(size=len(content), sha=sha)
            with self.assertRaisesRegex(skills.SkillError, "confirmation_required"):
                sources.fetch_files(self.fetch_payload())

    def test_foreign_urls_traversal_credentials_and_invalid_selection_never_network(self):
        with patch.object(sources, "_api") as api:
            for url in (
                "http://github.com/test/repo", "https://127.0.0.1/repo",
                "https://github.com.evil/test/repo", "https://user:pass@github.com/test/repo",
                "https://github.com/test/repo/tree/main/../secrets",
                "https://github.com/test/repo?token=secret",
                "https://github.com/test/repo/blob/main/%2e%2e/a.md",
            ):
                with self.subTest(url=url), self.assertRaises(skills.SkillError):
                    sources.discover({"url": url})
            for paths in ([], ["../x.md"], ["a.md", "a.md"], ["a.md"] * 17):
                with self.assertRaises(skills.SkillError):
                    sources._fetch_files({"origin":"https://github.com/test/repo","revision":self.commit,"paths":paths})
            with self.assertRaises(skills.SkillError):
                sources._fetch_files({"origin":"https://github.com/test/repo","revision":"main","paths":["a.md"]})
            api.assert_not_called()

    def test_truncated_large_symlink_and_nontext_trees_fail_explicitly(self):
        with patch.object(sources, "_api", return_value={"truncated": True, "tree": self.tree}):
            with self.assertRaisesRegex(skills.SkillError, "tree_incomplete"):
                sources._tree("test/repo", self.commit)
        self.tree[0]["mode"] = "120000"
        with patch.object(sources, "_api", side_effect=self.api):
            with self.assertRaisesRegex(skills.SkillError, "selected_file_unavailable"):
                sources._fetch_files({"origin":"https://github.com/test/repo","revision":self.commit,
                                     "paths":["skills/example/SKILL.md"]})
            with patch.object(sources, "MAX_FILES", 1):
                with self.assertRaisesRegex(skills.SkillError, "too_many_documents"):
                    sources.discover({"url":"https://github.com/test/repo"})

    def test_invalid_blob_size_hash_and_utf8_are_rejected(self):
        valid_api = self.api
        def corrupt(path, *args):
            data = valid_api(path)
            if "/git/blobs/" in path:
                data["content"] = base64.b64encode(b"x" * len(self.content)).decode()
            return data
        with patch.object(sources, "_api", side_effect=corrupt):
            with self.assertRaisesRegex(skills.SkillError, "invalid_utf8_blob"):
                sources._fetch_files({"origin":"https://github.com/test/repo","revision":self.commit,
                                     "paths":["skills/example/SKILL.md"]})

    def test_network_transport_is_fixed_https_bounded_and_disables_proxy_redirect(self):
        response = unittest.mock.MagicMock()
        response.__enter__.return_value.read.return_value = b'{"ok":true}'
        opener = unittest.mock.MagicMock()
        opener.open.return_value = response
        with patch.object(sources, "build_opener", return_value=opener) as build:
            self.assertTrue(sources._api("/repos/test/repo")["ok"])
            self.assertEqual(build.call_args.args[0].proxies, {})
            request = opener.open.call_args.args[0]
            self.assertEqual(request.full_url, "https://api.github.com/repos/test/repo")
            self.assertIsNone(sources._NoRedirect().redirect_request(None,None,302,"",{},"http://127.0.0.1"))
            response.__enter__.return_value.read.return_value = b"x" * 11
            with self.assertRaisesRegex(skills.SkillError, "response_too_large"):
                sources._api("/repos/test/repo", 10)

    def test_rate_limit_and_forbidden_are_distinguished_with_reset_hint(self):
        def forbidden(*_args, **_kwargs):
            raise HTTPError("https://api.github.com/x", 403, "Forbidden", {}, None)
        with patch.object(sources, "build_opener", side_effect=forbidden):
            with self.assertRaises(skills.SkillError) as caught:
                sources._api("/repos/test/repo")
        self.assertEqual(str(caught.exception), "github_rate_limit_or_forbidden")
        self.assertTrue(caught.exception.findings)
        self.assertIn("forbidden", caught.exception.findings[0]["message"])

        def rate_limited(*_args, **_kwargs):
            headers = {"X-RateLimit-Reset": str(int(__import__("time").time()) + 3600)}
            raise HTTPError("https://api.github.com/x", 429, "Too Many Requests", headers, None)
        with patch.object(sources, "build_opener", side_effect=rate_limited):
            with self.assertRaises(skills.SkillError) as caught:
                sources._api("/repos/test/repo")
        self.assertEqual(str(caught.exception), "github_rate_limit_or_forbidden")
        self.assertIn("rate limit", caught.exception.findings[0]["message"])

    def test_github_token_is_attached_when_configured(self):
        with patch.object(sources, "_github_token", return_value="secret-token"):
            with patch.object(sources, "build_opener") as build:
                opener = unittest.mock.MagicMock()
                response = unittest.mock.MagicMock()
                response.__enter__.return_value.read.return_value = b'{"ok":true}'
                opener.open.return_value = response
                build.return_value = opener
                self.assertTrue(sources._api("/repos/test/repo")["ok"])
                request = opener.open.call_args.args[0]
                self.assertEqual(request.get_header("Authorization"), "Bearer secret-token")

    def test_github_tls_loads_certifi_roots_without_disabling_verification(self):
        context = sources._github_ssl_context()
        self.assertEqual(context.verify_mode, ssl.CERT_REQUIRED)
        self.assertTrue(context.check_hostname)
        self.assertGreater(len(context.get_ca_certs()), 0)
        with patch.object(sources.ssl, "create_default_context") as default_context:
            with patch.object(sources.certifi, "where", return_value="/test/ca.pem"):
                self.assertIs(sources._github_ssl_context(), default_context.return_value)
            default_context.assert_called_once_with()
            default_context.return_value.load_verify_locations.assert_called_once_with(cafile="/test/ca.pem")

    def test_http_acquisition_local_origin_and_closed_fields(self):
        httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()
        self.addCleanup(thread.join)
        self.addCleanup(httpd.server_close)
        self.addCleanup(httpd.shutdown)
        url = f"http://127.0.0.1:{httpd.server_port}/api/skills/github/discover"
        payload = skills.encoded({"url":"https://github.com/test/repo"})
        with patch.object(sources, "_api", side_effect=self.api):
            with urlopen(Request(url,data=payload), timeout=5) as response:
                self.assertEqual(json.load(response)["revision"], self.commit)
            for data, headers, status in (
                (payload, {"Origin":"https://evil.invalid"}, 403),
                (skills.encoded({"url":"https://github.com/test/repo","verified":True}), {}, 400),
            ):
                with self.assertRaises(HTTPError) as error:
                    urlopen(Request(url,data=data,headers=headers),timeout=5)
                self.assertEqual(error.exception.code, status)
                error.exception.close()

    def test_reference_targets_extract_links_backticks_and_bare_paths(self):
        content = (
            "铁律见 `references/camera-and-impact.md`；"
            "配方见 [scene-patterns](./references/scene-patterns.md)。"
            "范例见 ../examples/example-15s-duel.md 或 README.txt。"
            "忽略 https://example.com/LICENSE.md 与 #anchor 与 mailto:a@b.md。"
        )
        targets = sources.reference_targets(content)
        self.assertIn("references/camera-and-impact.md", targets)
        self.assertIn("./references/scene-patterns.md", targets)
        self.assertIn("../examples/example-15s-duel.md", targets)
        self.assertIn("README.txt", targets)
        for excluded in ("https://example.com/LICENSE.md", "#anchor", "mailto:a@b.md"):
            self.assertNotIn(excluded, targets)

    def test_resolve_reference_path_normalises_dot_segments(self):
        self.assertEqual(
            sources._resolve_reference_path("skills/example/SKILL.md", "references/a.md"),
            "skills/example/references/a.md",
        )
        self.assertEqual(
            sources._resolve_reference_path("skills/example/SKILL.md", "./references/a.md"),
            "skills/example/references/a.md",
        )
        self.assertEqual(
            sources._resolve_reference_path("skills/example/SKILL.md", "../shared/a.md"),
            "skills/shared/a.md",
        )
        self.assertIsNone(sources._resolve_reference_path("SKILL.md", "../../a.md"))
        self.assertIsNone(sources._resolve_reference_path("SKILL.md", "https://example.com/a.md"))

    def test_resolve_references_returns_tree_paths_without_licenses_or_self(self):
        tree = {
            "skills/example/references/a.md": {},
            "skills/example/references/b.md": {},
            "skills/example/SKILL.md": {},
            "LICENSE": {},
        }
        files = [
            {"path": "skills/example/SKILL.md",
             "content": "见 `references/a.md` 与 `references/b.md` 与 `references/missing.md`。"},
        ]
        self.assertEqual(
            sources.resolve_references(files, tree),
            ["skills/example/references/a.md", "skills/example/references/b.md"],
        )

    def test_fetch_files_pulls_in_referenced_documents_as_one_source(self):
        referenced_content = b"# Camera rules\nKeep close on impact."
        referenced_sha = hashlib.sha1(
            f"blob {len(referenced_content)}\0".encode() + referenced_content
        ).hexdigest()
        self.blobs[referenced_sha] = referenced_content
        skill_content = b"# Skill\nSee `references/camera.md`."
        skill_sha = hashlib.sha1(f"blob {len(skill_content)}\0".encode() + skill_content).hexdigest()
        self.blobs[skill_sha] = skill_content
        self.tree = [
            {"path": "skills/example/SKILL.md", "type": "blob", "mode": "100644",
             "size": len(skill_content), "sha": skill_sha},
            {"path": "skills/example/references/camera.md", "type": "blob", "mode": "100644",
             "size": len(referenced_content), "sha": referenced_sha},
            {"path": "LICENSE", "type": "blob", "mode": "100644",
             "size": len(self.license_content), "sha": self.license_sha},
        ]
        with patch.object(sources, "_api", side_effect=self.api):
            self.confirm_license()
            data = sources.fetch_files(self.fetch_payload())
        paths = [item["path"] for item in data["source"]["files"]]
        self.assertEqual(paths, [
            "skills/example/SKILL.md", "skills/example/references/camera.md", "LICENSE",
        ])
        self.assertEqual(data["source"]["files"][1]["content"], referenced_content.decode())
        self.assertEqual(data["license_status"], "verified")
        self.assertEqual(skills.license_review(data["source"])["status"], "verified")

    def test_fetch_files_rejects_references_beyond_file_budget(self):
        self.tree = [self.tree[0], self.tree[2]] + [{
            "path": f"skills/example/references/ref{i}.md", "type": "blob", "mode": "100644",
            "size": len(self.content), "sha": self.sha,
        } for i in range(15)]
        skill_content = b"# Skill\n" + b"".join(
            f"`references/ref{i}.md`\n".encode() for i in range(15)
        )
        skill_sha = hashlib.sha1(f"blob {len(skill_content)}\0".encode() + skill_content).hexdigest()
        self.blobs[skill_sha] = skill_content
        self.tree[0] = {"path": "skills/example/SKILL.md", "type": "blob", "mode": "100644",
                        "size": len(skill_content), "sha": skill_sha}
        with patch.object(sources, "_api", side_effect=self.api):
            self.confirm_license()
            with self.assertRaisesRegex(skills.SkillError, "reference_budget_exceeded"):
                sources.fetch_files(self.fetch_payload())
