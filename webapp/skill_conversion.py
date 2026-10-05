"""Host-bound, knowledge-only Skill conversion; never installs or executes Skills."""

from __future__ import annotations

import copy
import hashlib
import json
import os
import stat
import threading
import time
import uuid
from collections.abc import Callable
from pathlib import Path

from jsonschema import Draft202012Validator
from jsonschema.exceptions import SchemaError

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ROOT / "skill-spec"
LICENSE_REVIEWS_PATH = ROOT / "skill_license_reviews.json"
MAX_REQUEST_BYTES = 128 * 1024
MAX_INPUT_TOKENS = 16000
MAX_OUTPUT_TOKENS = 8192
MAX_INSTRUCTION_TOKENS = 2048
MAX_INSTRUCTION_BYTES = 24000
REQUEST_TTL_SECONDS = 3600
MAX_PENDING_REQUESTS = 32
REVIEW_CHECKS = [
    "H06: review execution, networking, injection, fidelity and capability claims",
    "H07-H08: installation resources and exact-hash approval are not implemented",
    "H09: no installation, activation or modification of application data is authorized",
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


def artifacts() -> tuple[dict, str]:
    try:
        schema = parse_json((ARTIFACTS / "skill-conversion.schema.json").read_bytes())
        Draft202012Validator.check_schema(schema)
        instructions = (ARTIFACTS / "converter-system.txt").read_text(encoding="utf-8")
        if not instructions.strip():
            raise ValueError("empty_converter")
    except (OSError, ValueError, SkillError, SchemaError) as exc:
        raise SkillError("skill_contract_unavailable", 500) from exc
    return schema, instructions + "\n\nJSON Schema:\n" + encoded(schema).decode("utf-8")


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
    """Only a local operator-written file may establish a verified license."""
    unknown = {"status": "unknown", "obligations": [], "evidence": "", "reviewer": "", "reviewed_at": ""}
    if not LICENSE_REVIEWS_PATH.exists() and not LICENSE_REVIEWS_PATH.is_symlink():
        return unknown
    try:
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
        matched = None
        identities = set()
        for item in registry["reviews"]:
            if not isinstance(item, dict):
                raise ValueError("invalid_license_review")
            _keys(item, {"source_sha256", "status", "obligations", "evidence", "reviewer", "reviewed_at"})
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
            obligations = item["obligations"]
            if not isinstance(obligations, list) or len(obligations) > 16 or any(
                not isinstance(text, str) or not text.strip() or len(text) > 1024 or "\x00" in text
                for text in obligations
            ):
                raise ValueError("invalid_license_obligations")
            if sha == digest(source):
                matched = item
        return copy.deepcopy(matched or unknown)
    except (OSError, ValueError, TypeError, SkillError) as exc:
        raise SkillError("skill_license_reviews_unavailable", 500) from exc


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
            if len(self._requests) >= MAX_PENDING_REQUESTS:
                raise SkillError("skill_request_capacity_reached", 429)
            key = record["request"]["trusted_context"]["request_id"]
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
        "system": system, "schema": schema,
        "contract_sha256": digest({"schema": schema, "system": system}),
    }
    STORE.put(record)
    return {
        "request": request, "source_sha256": record["source_sha256"],
        "license_review": review, "model": model,
        "expires_in_seconds": REQUEST_TTL_SECONDS,
        "review_required": True, "installable": False,
    }


def current_record(key: object, capabilities: dict, text_settings: dict) -> dict:
    record = STORE.get(key)
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
    return record


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


def validate_result(record: dict, result: dict, count_tokens: Callable[[str, str], int]) -> dict:
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
        if not findings and result["status"] == "draft":
            for index, binding in enumerate(result["package"]["bindings"]):
                if count_tokens("", binding["instructions"]) > MAX_INSTRUCTION_TOKENS:
                    findings.append(_finding("H05", f"/package/bindings/{index}/instructions",
                                             "Instruction tokenizer budget exceeded."))
            if count_tokens("", encoded(result).decode("utf-8")) > MAX_OUTPUT_TOKENS:
                findings.append(_finding("H05", "/", "Result tokenizer budget exceeded."))
    if len(encoded(result)) > MAX_REQUEST_BYTES:
        findings.append(_finding("H05", "/", "Result byte budget exceeded."))
    return {
        "valid": not findings, "findings": findings[:32], "review_required": True,
        "installable": False, "semantic_safety_verified": False,
        "validation_scope": "schema-and-host-bindings", "review_checks": REVIEW_CHECKS,
        "candidate_sha256": digest(result["package"]) if not findings and result["status"] == "draft" else None,
        "license_obligations": context["license_obligations"],
    }
