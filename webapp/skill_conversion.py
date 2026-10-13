"""Host-bound, knowledge-only Skill conversion; never installs or executes Skills."""

from __future__ import annotations

import copy
import hashlib
import json
import os
import re
import stat
import tempfile
import threading
import time
import uuid
from collections.abc import Callable
from datetime import datetime, timezone
from pathlib import Path

from jsonschema import Draft202012Validator
from jsonschema.exceptions import SchemaError
from . import prompt_settings

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ROOT / "skill-spec"
LICENSE_REVIEWS_PATH = ROOT / "skill_license_reviews.json"
MAX_REQUEST_BYTES = 512 * 1024
MAX_INPUT_TOKENS = 64000
MAX_CONFIGURED_INPUT_TOKENS = 128000
MAX_SOURCE_CHARS = 96000
MAX_SOURCE_FILE_BYTES = 384000
MAX_OUTPUT_TOKENS = 8192
MAX_INSTRUCTION_TOKENS = 2048
MAX_INSTRUCTION_BYTES = 24000
REQUEST_TTL_SECONDS = 3600
MAX_PENDING_REQUESTS = 32
_license_review_lock = threading.RLock()
REVIEW_CHECKS = [
    "H06: review execution, networking, injection, fidelity and capability claims",
    "H07-H08: installation requires explicit human checks and exact-hash approval",
    "H09: validation alone never authorizes installation, activation or application changes",
]
# SPDX identifiers the operator may declare for a locally-imported source that
# carries no recognizable LICENSE file. Declaration is still an explicit local
# human action bound to the exact source hash, never an automatic approval.
DECLARABLE_LICENSES = [
    "MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC",
    "MPL-2.0", "GPL-2.0", "GPL-3.0", "LGPL-2.1", "LGPL-3.0",
    "AGPL-3.0", "CC0-1.0", "CC-BY-4.0", "CC-BY-SA-4.0", "Unlicense",
]


class SkillError(Exception):
    def __init__(self, code: str, status: int = 400, findings: list[dict] | None = None) -> None:
        super().__init__(code)
        self.status = status
        self.findings = findings or []


def _unique_object(pairs: list[tuple[str, object]]) -> dict:
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("duplicate_json_key")
        result[key] = value
    return result


def _reject_constant(value: str) -> None:
    raise ValueError(f"invalid_json_constant:{value}")


def parse_json(data: bytes | str) -> dict:
    try:
        result = json.loads(data, object_pairs_hook=_unique_object, parse_constant=_reject_constant)
        if not isinstance(result, dict):
            raise ValueError("expected_object")
        encoded(result)
        return result
    except (ValueError, TypeError, UnicodeError, RecursionError) as exc:
        raise SkillError("invalid_skill_json") from exc


def encoded(value: dict) -> bytes:
    try:
        return json.dumps(
            value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False,
        ).encode("utf-8")
    except (ValueError, UnicodeError, RecursionError) as exc:
        raise SkillError("invalid_skill_json") from exc


def digest(value: dict) -> str:
    return hashlib.sha256(encoded(value)).hexdigest()


def _keys(value: dict, required: set[str]) -> None:
    if set(value) != required:
        raise SkillError("invalid_skill_fields")


def _finding(code: str, path: str, message: str) -> dict:
    return {"code": code, "path": path, "message": message}


def conversion_contract() -> tuple[dict, str]:
    try:
        schema = parse_json((ARTIFACTS / "skill-conversion.schema.json").read_bytes())
        Draft202012Validator.check_schema(schema)
        instructions = (ARTIFACTS / "converter-system.txt").read_text(encoding="utf-8")
        if not instructions.strip():
            raise ValueError("empty_converter")
    except (OSError, ValueError, SkillError, SchemaError) as exc:
        raise SkillError("skill_contract_unavailable", 500) from exc
    return schema, instructions


def artifacts() -> tuple[dict, str]:
    schema, instructions = conversion_contract()
    return schema, instructions + "\n\nConfigured conversion guidance:\n" + prompt_settings.skill_conversion() + (
        "\n\nJSON Schema:\n" + encoded(schema).decode("utf-8")
    )


def _schema_findings(value: dict, schema: dict, definition: str | None = None) -> list[dict]:
    target = schema if definition is None else {
        "$schema": schema["$schema"], "$ref": f"#/$defs/{definition}", "$defs": schema["$defs"],
    }
    return [
        _finding("schema", "/" + "/".join(map(str, error.absolute_path)), error.message)
        for error in Draft202012Validator(target).iter_errors(value)
    ][:32]


def normalize_source(value: object, schema: dict) -> dict:
    if not isinstance(value, dict):
        raise SkillError("invalid_skill_source")
    _keys(value, {"origin", "revision", "files"})
    for field in ("origin", "revision"):
        text = value[field]
        if not isinstance(text, str) or not text.strip() or len(text) > 1024 or "\x00" in text:
            raise SkillError("invalid_skill_source")
    files = value["files"]
    if not isinstance(files, list) or not 1 <= len(files) <= 16:
        raise SkillError("invalid_skill_source")
    normalized = []
    paths = set()
    file_schema = schema["$defs"]["request"]["properties"]["source_material"]["properties"]["files"]["items"]
    for index, item in enumerate(files):
        if not isinstance(item, dict):
            raise SkillError("invalid_skill_source")
        _keys(item, {"path", "content"})
        entry = {"id": f"source-{index + 1}", **item}
        if not Draft202012Validator({"$defs": schema["$defs"], **file_schema}).is_valid(entry):
            raise SkillError("invalid_skill_source")
        path = entry["path"]
        if path in paths or any(part in {"", ".", ".."} for part in path.split("/")):
            raise SkillError("invalid_skill_source_path")
        paths.add(path)
        normalized.append(entry)
    source = {"origin": value["origin"], "revision": value["revision"], "files": normalized}
    if len(encoded(source)) > MAX_REQUEST_BYTES:
        raise SkillError("skill_source_too_large", 413)
    return source


def license_review(source: dict) -> dict:
    """Only an explicit local confirmation may establish a source-bound review."""
    unknown = {
        "status": "unknown", "license_name": "", "obligations": [],
        "evidence": "", "reviewer": "", "reviewed_at": "",
    }
    try:
        with _license_review_lock:
            reviews = _read_license_reviews()
            matched = next((item for item in reviews if item["source_sha256"] == digest(source)), None)
        if matched is None:
            return unknown
        return {**copy.deepcopy(matched), "license_name": matched.get("license_name", "")}
    except (OSError, ValueError, TypeError, SkillError) as exc:
        raise SkillError("skill_license_reviews_unavailable", 500) from exc


def detect_licenses(source: dict) -> list[dict]:
    license_names = {
        "license", "license.md", "license.txt", "licence", "licence.md", "licence.txt",
        "copying", "copying.md", "copying.txt",
    }
    detected = []
    for item in source["files"]:
        if item["path"].rsplit("/", 1)[-1].lower() not in license_names:
            continue
        content = item["content"]
        names = set()
        for line in content.splitlines():
            match = re.match(r"\s*SPDX-License-Identifier:\s*(.+?)\s*$", line, re.IGNORECASE)
            if match:
                names.update(
                    token for token in re.findall(r"[A-Za-z0-9][A-Za-z0-9.+-]*", match.group(1))
                    if token.upper() not in {"AND", "OR", "WITH"}
                )
        upper = content.upper()
        if "MIT LICENSE" in upper or "PERMISSION IS HEREBY GRANTED, FREE OF CHARGE" in upper:
            names.add("MIT")
        if "APACHE LICENSE" in upper and "VERSION 2.0" in upper:
            names.add("Apache-2.0")
        if "MOZILLA PUBLIC LICENSE" in upper and "2.0" in upper:
            names.add("MPL-2.0")
        if "ISC LICENSE" in upper:
            names.add("ISC")
        if "BSD 3-CLAUSE" in upper or "BSD 3-CLAUSE LICENSE" in upper:
            names.add("BSD-3-Clause")
        if "BSD 2-CLAUSE" in upper or "BSD 2-CLAUSE LICENSE" in upper:
            names.add("BSD-2-Clause")
        if "GNU GENERAL PUBLIC LICENSE" in upper:
            version = re.search(r"VERSION\s+(\d+(?:\.\d+)?)", upper)
            if version:
                names.add(f"GPL-{version.group(1)}")
        for name in sorted(names):
            detected.append({"license_name": name, "path": item["path"]})
    return detected


def _read_license_reviews() -> list[dict]:
    if not LICENSE_REVIEWS_PATH.exists() and not LICENSE_REVIEWS_PATH.is_symlink():
        return []
    if LICENSE_REVIEWS_PATH.is_symlink() or not LICENSE_REVIEWS_PATH.is_file():
        raise ValueError("unsafe_license_registry")
    descriptor = os.open(LICENSE_REVIEWS_PATH, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    with os.fdopen(descriptor, "rb") as handle:
        if not stat.S_ISREG(os.fstat(handle.fileno()).st_mode):
            raise ValueError("unsafe_license_registry")
        data = handle.read(MAX_REQUEST_BYTES + 1)
    if len(data) > MAX_REQUEST_BYTES:
        raise ValueError("license_registry_too_large")
    registry = parse_json(data)
    _keys(registry, {"version", "reviews"})
    if type(registry["version"]) is not int or registry["version"] != 1 or not isinstance(registry["reviews"], list):
        raise ValueError("invalid_license_registry")
    identities = set()
    for item in registry["reviews"]:
        if not isinstance(item, dict):
            raise ValueError("invalid_license_review")
        fields = {"source_sha256", "status", "obligations", "evidence", "reviewer", "reviewed_at"}
        if frozenset(item) not in {frozenset(fields), frozenset(fields | {"license_name"})}:
            raise ValueError("invalid_license_review")
        sha = item["source_sha256"]
        if not isinstance(sha, str) or len(sha) != 64 or any(c not in "0123456789abcdef" for c in sha):
            raise ValueError("invalid_license_hash")
        if sha in identities:
            raise ValueError("duplicate_license_review")
        identities.add(sha)
        if item["status"] not in {"verified", "unknown", "restricted"}:
            raise ValueError("invalid_license_status")
        for field in ("evidence", "reviewer", "reviewed_at"):
            if not isinstance(item[field], str) or not item[field].strip() or len(item[field]) > 1024 or "\x00" in item[field]:
                raise ValueError("invalid_license_evidence")
        if "license_name" in item and (
            not isinstance(item["license_name"], str) or len(item["license_name"]) > 128 or "\x00" in item["license_name"]
        ):
            raise ValueError("invalid_license_name")
        obligations = item["obligations"]
        if not isinstance(obligations, list) or len(obligations) > 16 or any(
            not isinstance(text, str) or not text.strip() or len(text) > 1024 or "\x00" in text
            for text in obligations
        ):
            raise ValueError("invalid_license_obligations")
    return registry["reviews"]


def confirm_detected_license(source_value: object, license_name: object, license_path: object) -> dict:
    schema, _ = artifacts()
    source = normalize_source(source_value, schema)
    if not isinstance(license_name, str) or not isinstance(license_path, str):
        raise SkillError("invalid_license_selection")
    if not any(
        item["license_name"] == license_name and item["path"] == license_path
        for item in detect_licenses(source)
    ):
        raise SkillError("license_not_detected_in_source", 422)
    source_hash = digest(source)
    review = {
        "source_sha256": source_hash, "status": "verified", "license_name": license_name,
        "obligations": [],
        "evidence": f"User confirmed detected {license_name} in {license_path} from the pinned source.",
        "reviewer": "local-ui-user-confirmation",
        "reviewed_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }
    _save_license_review(review)
    return {key: value for key, value in review.items() if key != "source_sha256"}


def confirm_declared_license(source_value: object, license_name: object) -> dict:
    """Record an explicit operator declaration for a source with no license file.

    Only a whitelisted SPDX identifier is accepted; the review is still bound to
    the exact source hash and treated the same as a detected confirmation.
    """
    schema, _ = artifacts()
    source = normalize_source(source_value, schema)
    if not isinstance(license_name, str) or license_name not in DECLARABLE_LICENSES:
        raise SkillError("invalid_declared_license", 422)
    source_hash = digest(source)
    review = {
        "source_sha256": source_hash, "status": "verified", "license_name": license_name,
        "obligations": [],
        "evidence": f"Operator declared {license_name} for this local source without a license file.",
        "reviewer": "local-ui-user-declaration",
        "reviewed_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }
    _save_license_review(review)
    return {key: value for key, value in review.items() if key != "source_sha256"}


def bind_confirmed_license(source_value: object, confirmed_review: dict) -> None:
    source = normalize_source(source_value, artifacts()[0])
    _save_license_review({**confirmed_review, "source_sha256": digest(source)})


def _save_license_review(review: dict) -> None:
    source_hash = review["source_sha256"]
    temporary = None
    try:
        with _license_review_lock:
            reviews = _read_license_reviews()
            updated = [item for item in reviews if item["source_sha256"] != source_hash]
            updated.append(review)
            data = encoded({"version": 1, "reviews": updated})
            if len(data) > MAX_REQUEST_BYTES:
                raise SkillError("license_registry_too_large", 413)
            if LICENSE_REVIEWS_PATH.is_symlink() or (
                LICENSE_REVIEWS_PATH.exists() and not LICENSE_REVIEWS_PATH.is_file()
            ):
                raise SkillError("unsafe_license_registry", 500)
            descriptor, temporary = tempfile.mkstemp(
                prefix=".skill-license-reviews-", dir=LICENSE_REVIEWS_PATH.parent,
            )
            with os.fdopen(descriptor, "wb") as handle:
                os.fchmod(handle.fileno(), 0o600)
                handle.write(data)
                handle.flush()
                os.fsync(handle.fileno())
            os.replace(temporary, LICENSE_REVIEWS_PATH)
            temporary = None
            directory = os.open(LICENSE_REVIEWS_PATH.parent, os.O_RDONLY)
            try:
                os.fsync(directory)
            finally:
                os.close(directory)
    except SkillError:
        raise
    except (OSError, ValueError, TypeError) as exc:
        raise SkillError("skill_license_reviews_unavailable", 500) from exc
    finally:
        if temporary is not None:
            try:
                os.unlink(temporary)
            except FileNotFoundError:
                pass


class ConversionStore:
    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._requests: dict[str, tuple[float, dict]] = {}

    def _expire(self) -> None:
        now = time.monotonic()
        for key, (created, _) in list(self._requests.items()):
            if now - created >= REQUEST_TTL_SECONDS:
                del self._requests[key]

    def put(self, record: dict) -> None:
        with self._lock:
            self._expire()
            key = record["request"]["trusted_context"]["request_id"]
            if key not in self._requests and len(self._requests) >= MAX_PENDING_REQUESTS:
                raise SkillError("skill_request_capacity_reached", 429)
            self._requests[key] = (time.monotonic(), copy.deepcopy(record))

    def get(self, key: object) -> dict:
        if not isinstance(key, str):
            raise SkillError("invalid_skill_request_id")
        with self._lock:
            self._expire()
            if key not in self._requests:
                raise SkillError("skill_request_not_found_or_expired", 404)
            return copy.deepcopy(self._requests[key][1])


STORE = ConversionStore()


def prepare(payload: dict, capabilities: dict, text_settings: dict) -> dict:
    _keys(payload, {"model", "source"})
    model = payload["model"]
    if not isinstance(model, str) or not model.strip() or len(model) > 200 or "\x00" in model:
        raise SkillError("invalid_text_model")
    schema, system = artifacts()
    source = normalize_source(payload["source"], schema)
    review = license_review(source)
    context = {
        "request_id": str(uuid.uuid4()),
        "capability_snapshot_id": digest(capabilities),
        "source_snapshot_id": digest({"source": source, "review": review}),
        "license_status": review["status"],
        "license_obligations": review["obligations"],
        "allowed_bindings": capabilities["allowed_bindings"],
        "max_instruction_chars": 6000,
    }
    request = {
        "schema_version": "minimuv-skill-request/v1", "trusted_context": context,
        "source_material": {"files": source["files"]},
    }
    findings = _schema_findings(request, schema, "request")
    if findings:
        raise SkillError("invalid_skill_request", 400, findings)
    if len(encoded(request)) > MAX_REQUEST_BYTES:
        raise SkillError("skill_request_too_large", 413)
    record = {
        "request": request, "source": source, "source_sha256": digest(source),
        "review": review, "model": model, "text_settings": text_settings,
        "capabilities": capabilities,
        "system": system, "schema": schema,
        "contract_sha256": digest({"schema": schema, "system": system}),
    }
    STORE.put(record)
    return {
        "request": request, "source_sha256": record["source_sha256"],
        "license_review": review, "model": model,
        "expires_in_seconds": REQUEST_TTL_SECONDS,
        "review_required": False, "installable": False,
    }


def current_record(key: object, capabilities: dict, text_settings: dict) -> dict:
    record = STORE.get(key)
    check_record_current(record, capabilities, text_settings)
    return record


def check_record_current(record: dict, capabilities: dict, text_settings: dict) -> None:
    schema, system = artifacts()
    context = record["request"]["trusted_context"]
    if (
        digest(capabilities) != context["capability_snapshot_id"]
        or digest({"source": record["source"], "review": license_review(record["source"])})
        != context["source_snapshot_id"]
        or digest({"schema": schema, "system": system}) != record["contract_sha256"]
        or text_settings != record["text_settings"]
    ):
        raise SkillError("skill_snapshot_changed", 409)


def blocked_result(record: dict) -> dict:
    context = record["request"]["trusted_context"]
    return {
        "schema_version": "minimuv-skill-conversion/v1",
        **{key: context[key] for key in ("request_id", "capability_snapshot_id", "source_snapshot_id")},
        "status": "blocked", "package": None,
        "report": {
            "summary": "License review is required before producing a draft.",
            "removed": [], "warnings": [],
            "blockers": [{"code": f"license-{context['license_status']}",
                          "reason": "The host has not verified permission for this exact source."}],
        },
    }


def validate_result(record: dict, result: dict, count_tokens: Callable[[str, str], int] | None) -> dict:
    findings = _schema_findings(result, record["schema"])
    context = record["request"]["trusted_context"]
    if not findings:
        for field in ("request_id", "capability_snapshot_id", "source_snapshot_id"):
            if result[field] != context[field]:
                findings.append(_finding("H01", "/" + field, "Snapshot identity mismatch."))
        if context["license_status"] != "verified":
            blockers = {item["code"] for item in result["report"]["blockers"]}
            if result["status"] != "blocked" or f"license-{context['license_status']}" not in blockers:
                findings.append(_finding("H02", "/status", "Unverified or restricted permission must block."))
        files = {item["id"]: item["content"] for item in record["source"]["files"]}
        evidence = [(f"/report/removed/{index}/evidence", item["evidence"])
                    for index, item in enumerate(result["report"]["removed"])]
        if result["status"] == "draft":
            allowed = {(item["task"], item["mode"]): item for item in context["allowed_bindings"]}
            seen = set()
            for index, binding in enumerate(result["package"]["bindings"]):
                path = f"/package/bindings/{index}"
                key = (binding["task"], binding["mode"])
                target = allowed.get(key)
                if key in seen or target is None:
                    findings.append(_finding("H03", path, "Duplicate or disallowed task/mode."))
                elif binding["target_models"] == ["*"]:
                    if not target["generic_allowed"]:
                        findings.append(_finding("H03", path, "Generic binding is not allowed."))
                elif not set(binding["target_models"]) <= set(target["model_ids"]):
                    findings.append(_finding("H03", path, "Target model is not in the host snapshot."))
                seen.add(key)
                text = binding["instructions"]
                if len(text) > context["max_instruction_chars"] or len(text.encode("utf-8")) > MAX_INSTRUCTION_BYTES:
                    findings.append(_finding("H05", path + "/instructions", "Instruction budget exceeded."))
                evidence.extend((f"{path}/evidence/{n}", item) for n, item in enumerate(binding["evidence"]))
        for path, item in evidence:
            if item["file_id"] not in files or item["excerpt"] not in files[item["file_id"]]:
                findings.append(_finding("H04", path, "Evidence must be an exact excerpt of a supplied file."))
        if not findings and result["status"] == "draft" and count_tokens is not None:
            for index, binding in enumerate(result["package"]["bindings"]):
                if count_tokens("", binding["instructions"]) > MAX_INSTRUCTION_TOKENS:
                    findings.append(_finding("H05", f"/package/bindings/{index}/instructions",
                                             "Instruction tokenizer budget exceeded."))
            if count_tokens("", encoded(result).decode("utf-8")) > MAX_OUTPUT_TOKENS:
                findings.append(_finding("H05", "/", "Result tokenizer budget exceeded."))
    if len(encoded(result)) > MAX_REQUEST_BYTES:
        findings.append(_finding("H05", "/", "Result byte budget exceeded."))
    return {
        "valid": not findings, "findings": findings[:32], "review_required": False,
        "installable": not findings and result.get("status") == "draft", "semantic_safety_verified": False,
        "validation_scope": "schema-and-host-bindings", "review_checks": [],
        "candidate_sha256": digest(result["package"]) if not findings and result["status"] == "draft" else None,
        "license_obligations": context["license_obligations"],
    }
