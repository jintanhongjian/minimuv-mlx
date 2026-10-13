"""Bounded public GitHub text acquisition; source material is never executed."""

from __future__ import annotations

import base64
import hashlib
import os
import re
import ssl
import time
from urllib.error import HTTPError, URLError
from urllib.parse import quote, unquote, urlsplit
from urllib.request import HTTPRedirectHandler, HTTPSHandler, ProxyHandler, Request, build_opener

import certifi
from . import skill_conversion as skills

MAX_TREE_BYTES = 2 * 1024 * 1024
MAX_FILES = 200


def _github_token() -> str | None:
    """Optional personal access token; raises the unauthenticated 60/hour limit to 5000/hour."""
    token = os.environ.get("GITHUB_TOKEN", "").strip()
    return token or None


class _NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def _github_ssl_context() -> ssl.SSLContext:
    context = ssl.create_default_context()
    context.load_verify_locations(cafile=certifi.where())
    return context


def _api(path: str, limit: int = MAX_TREE_BYTES) -> dict:
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "MiniMuv-Skill-Review"}
    token = _github_token()
    if token:
        headers["Authorization"] = f"Bearer {token}"
    request = Request("https://api.github.com" + path, headers=headers)
    try:
        with build_opener(
            ProxyHandler({}), _NoRedirect(), HTTPSHandler(context=_github_ssl_context())
        ).open(request, timeout=20) as response:
            data = response.read(limit + 1)
        if len(data) > limit:
            raise skills.SkillError("github_response_too_large", 413)
        return skills.parse_json(data)
    except HTTPError as exc:
        status = exc.code
        exc.close()
        if status == 404:
            raise skills.SkillError("github_not_found_or_private", 502) from exc
        if status in {403, 429}:
            reset = _rate_limit_reset(exc)
            raise skills.SkillError("github_rate_limit_or_forbidden", 502, [{
                "code": "github_rate_limit_or_forbidden",
                "message": _rate_limit_message(status, reset),
            }]) from exc
        raise skills.SkillError("github_http_failed", 502) from exc
    except (URLError, OSError) as exc:
        raise skills.SkillError("github_connection_failed", 502) from exc


def _rate_limit_reset(error: HTTPError) -> int | None:
    value = error.headers.get("X-RateLimit-Reset") if error.headers else None
    if value is None:
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _rate_limit_message(status: int, reset: int | None) -> str:
    if status == 429 or (reset is not None and reset > time.time()):
        if reset is not None:
            minutes = max(1, round((reset - time.time()) / 60))
            return f"GitHub API rate limit reached; retry in about {minutes} minutes."
        return "GitHub API rate limit reached; retry later."
    return "GitHub API access was forbidden (403). A personal access token may be required."


def _url(value: object) -> tuple[str, str | None, str, str]:
    if not isinstance(value, str) or len(value) > 2048:
        raise skills.SkillError("invalid_github_url")
    parsed = urlsplit(value)
    if (parsed.scheme != "https" or parsed.netloc != "github.com" or
            parsed.query or parsed.fragment or "%" in parsed.netloc):
        raise skills.SkillError("invalid_github_url")
    parts = unquote(parsed.path).strip("/").split("/")
    if len(parts) < 2 or not re.fullmatch(r"[A-Za-z0-9_.-]+", parts[0]):
        raise skills.SkillError("invalid_github_url")
    parts[1] = parts[1].removesuffix(".git")
    if not re.fullmatch(r"[A-Za-z0-9_.-]+", parts[1]) or parts[0] in {".", ".."} or parts[1] in {".", ".."}:
        raise skills.SkillError("invalid_github_url")
    repo = "/".join(parts[:2])
    if len(parts) == 2:
        return repo, None, "", "tree"
    if len(parts) < 4 or parts[2] not in {"blob", "tree"}:
        raise skills.SkillError("invalid_github_url")
    ref = parts[3]
    path = "/".join(parts[4:])
    if not ref or (path and not _safe_path(path)):
        raise skills.SkillError("invalid_github_path")
    if parts[2] == "blob" and not path:
        raise skills.SkillError("invalid_github_path")
    return repo, ref, path, parts[2]


def _safe_path(path: str) -> bool:
    return bool(re.fullmatch(r"[A-Za-z0-9_./-]{1,240}", path)) and all(
        part not in {"", ".", ".."} for part in path.split("/")
    )


def _text_path(path: str) -> bool:
    name = path.rsplit("/", 1)[-1].lower()
    return path.lower().endswith((".md", ".markdown", ".txt")) or name in {
        "license", "licence", "copying", "notice",
    }


_TEXT_EXTENSIONS = (".md", ".markdown", ".txt")
_REFERENCE_FILE_RE = re.compile(
    r"(?<![\w/:])((?:\.{0,2}/)?[A-Za-z0-9_.-]+(?:/[A-Za-z0-9_.-]+)*\.(?:md|markdown|txt))(?![\w])",
    re.IGNORECASE,
)


def _is_reference_target(target: str) -> bool:
    value = target.strip()
    if not value or len(value) > 240 or value.startswith(("/", "#", "<")):
        return False
    if value.lower().startswith(("http://", "https://", "mailto:", "ftp://", "file://")):
        return False
    if any(char in value for char in "?#&<>\"'\t\n\r "):
        return False
    return value.lower().endswith(_TEXT_EXTENSIONS)


def reference_targets(content: str) -> set[str]:
    """Extract relative document references from a text file.

    Recognises the common SKILL.md conventions: markdown links, backtick code
    spans and bare inline paths such as `` `references/camera-and-impact.md` ``.
    Returns the raw reference strings without resolving them against a base.
    """
    found: set[str] = set()
    for match in re.finditer(r"\]\(([^)\n]+)\)", content):
        target = match.group(1).strip()
        if _is_reference_target(target):
            found.add(target)
    for match in re.finditer(r"`([^`\n]+)`", content):
        target = match.group(1).strip()
        if _is_reference_target(target):
            found.add(target)
    for match in _REFERENCE_FILE_RE.finditer(content):
        target = match.group(1).strip()
        if _is_reference_target(target):
            found.add(target)
    return found


def _resolve_reference_path(origin_path: str, reference: str) -> str | None:
    """Resolve a reference against the directory of the file that mentions it."""
    reference = reference.strip()
    if not reference or reference.startswith(("/", "#", "<")) or "%" in reference:
        return None
    if reference.lower().startswith(("http://", "https://", "mailto:", "ftp://", "file://")):
        return None
    if any(char in reference for char in "?#&<>\"'\t\n\r ") or not re.fullmatch(
        r"[A-Za-z0-9_./-]{1,240}", reference
    ):
        return None
    base = origin_path.rsplit("/", 1)[0] if "/" in origin_path else ""
    stack = [part for part in base.split("/") if part] if base else []
    for part in reference.split("/"):
        if part in {"", "."}:
            continue
        if part == "..":
            if not stack:
                return None
            stack.pop()
        else:
            stack.append(part)
    if not stack:
        return None
    result = "/".join(stack)
    return result if _safe_path(result) else None


def resolve_references(source_files: list[dict], tree: dict[str, dict]) -> list[str]:
    """Return additional tree paths referenced by already-selected documents.

    Only relative references that point at an existing text blob (excluding
    licenses) are returned, deduplicated and sorted for determinism. The caller
    is responsible for enforcing scope and the per-Skill file budget.
    """
    present = {item["path"] for item in source_files}
    referenced: list[str] = []
    seen = set(present)
    for item in source_files:
        path = item["path"]
        if not path.lower().endswith(_TEXT_EXTENSIONS) or is_license_path(path):
            continue
        for reference in reference_targets(item["content"]):
            resolved = _resolve_reference_path(path, reference)
            if resolved is None or resolved in seen or is_license_path(resolved):
                continue
            seen.add(resolved)
            if resolved in tree:
                referenced.append(resolved)
    return sorted(set(referenced))


def _license_scope_ok(path: str, license_path: str, tree: dict[str, dict]) -> bool:
    applicable = [key for key in tree if is_license_path(key) and (
        "/" not in key or path.startswith(key.rsplit("/", 1)[0] + "/")
    )]
    closest_depth = max((key.count("/") for key in applicable), default=-1)
    return license_path in applicable and license_path.count("/") == closest_depth


def _tree(repo: str, revision: str) -> dict[str, dict]:
    data = _api(f"/repos/{repo}/git/trees/{revision}?recursive=1")
    if data.get("truncated") is not False or not isinstance(data.get("tree"), list):
        raise skills.SkillError("github_tree_incomplete", 422)
    return {
        item["path"]: item for item in data["tree"]
        if isinstance(item, dict) and isinstance(item.get("path"), str)
        and item.get("type") == "blob" and item.get("mode") == "100644"
        and _safe_path(item["path"]) and _text_path(item["path"])
        and type(item.get("size")) is int and 0 < item["size"] <= skills.MAX_SOURCE_FILE_BYTES
        and isinstance(item.get("sha"), str) and re.fullmatch(r"[0-9a-f]{40}", item["sha"])
    }


def discover(payload: dict) -> dict:
    skills._keys(payload, {"url"})
    repo, ref, path, kind = _url(payload["url"])
    if ref is None:
        repository = _api(f"/repos/{repo}")
        ref = repository.get("default_branch")
        if not isinstance(ref, str) or not ref:
            raise skills.SkillError("github_default_branch_unavailable", 502)
    commit = _api(f"/repos/{repo}/commits/{quote(ref, safe='')}")
    revision = commit.get("sha")
    if not isinstance(revision, str) or not re.fullmatch(r"[0-9a-f]{40}", revision):
        raise skills.SkillError("github_invalid_commit", 502)
    tree = _tree(repo, revision)
    prefix = path + "/" if path else ""
    files = [item for key, item in tree.items() if key == path or (kind == "tree" and key.startswith(prefix))]
    # Include ancestor licenses even when selecting one Skill file or directory.
    directory = path.rsplit("/", 1)[0] if kind == "blob" and "/" in path else path
    files.extend(item for key, item in tree.items()
                 if ((is_license_path(key) and (
                     "/" not in key or directory == key.rsplit("/", 1)[0]
                     or directory.startswith(key.rsplit("/", 1)[0] + "/")
                 )) or key.lower() == "notice")
                 and item not in files)
    if not files or (kind == "blob" and path not in tree):
        raise skills.SkillError("github_no_supported_text_files", 422)
    if len(files) > MAX_FILES:
        raise skills.SkillError("github_too_many_documents_use_skill_directory", 413)
    ordered = sorted(files, key=lambda item: (
        item["path"].rsplit("/", 1)[-1].lower() != "skill.md", item["path"],
    ))
    license_files = [item for item in ordered if is_license_path(item["path"])]
    if len(license_files) > 16:
        raise skills.SkillError("github_too_many_licenses_use_skill_directory", 413)
    applicable = [item for item in license_files if "/" not in item["path"]
                  or directory == item["path"].rsplit("/", 1)[0]
                  or directory.startswith(item["path"].rsplit("/", 1)[0] + "/")]
    selected_license = max(applicable, key=lambda item: item["path"].count("/"), default=None)
    license_sources = [_fetch_files({
        "origin": f"https://github.com/{repo}", "revision": revision, "paths": [item["path"]],
    }) for item in license_files]
    return {
        "origin": f"https://github.com/{repo}", "revision": revision,
        "files": [{"path": item["path"], "size": item["size"],
                   "skill": item["path"].rsplit("/", 1)[-1].lower() == "skill.md",
                   "license": item in license_files} for item in ordered],
        "selected_path": path if kind == "blob" else next(
            (item["path"] for item in ordered if item["path"].rsplit("/", 1)[-1].lower() == "skill.md"), None,
        ),
        "license_path": selected_license["path"] if selected_license else None,
        "license_status": "unknown",
        "license_sources": license_sources,
    }


def is_license_path(path: str) -> bool:
    return path.rsplit("/", 1)[-1].lower() in {
        "license", "license.md", "license.txt", "licence", "licence.md", "licence.txt",
        "copying", "copying.md", "copying.txt",
    }


def fetch_files(payload: dict) -> dict:
    skills._keys(payload, {"origin", "revision", "paths", "license_name", "license_path"})
    license_path = payload["license_path"]
    if not isinstance(license_path, str) or not is_license_path(license_path):
        raise skills.SkillError("invalid_license_selection")
    evidence = _fetch_files({
        "origin": payload["origin"], "revision": payload["revision"], "paths": [license_path],
    })
    review = skills.license_review(evidence["source"])
    if review["status"] != "verified" or review["license_name"] != payload["license_name"]:
        raise skills.SkillError("skill_license_confirmation_required", 409)
    paths = payload["paths"]
    if not isinstance(paths, list) or not 1 <= len(paths) <= 15 or any(
        not isinstance(path, str) or not _safe_path(path) or is_license_path(path) for path in paths
    ) or len(set(paths)) != len(paths):
        raise skills.SkillError("invalid_github_file_selection")
    repo, _, _, _ = _url(payload["origin"])
    tree = _tree(repo, payload["revision"])
    for path in paths:
        if not _license_scope_ok(path, license_path, tree):
            raise skills.SkillError("skill_license_scope_mismatch", 422)
    data = _fetch_files({
        "origin": payload["origin"], "revision": payload["revision"],
        "paths": [*paths, license_path],
    })
    source = data["source"]
    if source["files"][-1]["content"] != evidence["source"]["files"][0]["content"]:
        raise skills.SkillError("skill_license_evidence_changed", 409)
    # Include sibling documents referenced from the selected text (for example
    # `` `references/camera-and-impact.md` `` inside SKILL.md), so a Skill with
    # split reference files converts as one complete preset.
    selected_files = [{"path": item["path"], "content": item["content"]}
                      for item in source["files"] if not is_license_path(item["path"])]
    referenced = resolve_references(selected_files, tree)
    if len(referenced) > 15 - len(selected_files):
        raise skills.SkillError("skill_reference_budget_exceeded", 413)
    for path in referenced:
        if not _license_scope_ok(path, license_path, tree):
            raise skills.SkillError("skill_license_scope_mismatch", 422)
    if referenced:
        extra = _fetch_files({
            "origin": payload["origin"], "revision": payload["revision"], "paths": referenced,
        })
        license_item = source["files"][-1]
        source = skills.normalize_source({
            "origin": source["origin"], "revision": source["revision"],
            "files": [*selected_files,
                      *[{"path": item["path"], "content": item["content"]} for item in extra["source"]["files"]],
                      {"path": license_item["path"], "content": license_item["content"]}],
        }, skills.artifacts()[0])
        data["source"] = source
    skills.bind_confirmed_license({
        "origin": source["origin"], "revision": source["revision"],
        "files": [{"path": item["path"], "content": item["content"]} for item in source["files"]],
    }, review)
    data["license_status"] = "verified"
    return data


def _fetch_files(payload: dict) -> dict:
    skills._keys(payload, {"origin", "revision", "paths"})
    repo, ref, path, _ = _url(payload["origin"])
    revision = payload["revision"]
    if ref is not None or path or not isinstance(revision, str) or not re.fullmatch(r"[0-9a-f]{40}", revision):
        raise skills.SkillError("invalid_github_snapshot")
    paths = payload["paths"]
    if (not isinstance(paths, list) or not 1 <= len(paths) <= 16 or
            any(not isinstance(p, str) or not _safe_path(p) for p in paths) or len(set(paths)) != len(paths)):
        raise skills.SkillError("invalid_github_file_selection")
    tree = _tree(repo, revision)
    files = []
    for path in paths:
        if path not in tree:
            raise skills.SkillError("github_selected_file_unavailable", 422)
        item = tree[path]
        blob = _api(f"/repos/{repo}/git/blobs/{item['sha']}", 520000)
        try:
            if blob.get("encoding") != "base64" or blob.get("sha") != item["sha"]:
                raise ValueError("invalid_blob")
            data = base64.b64decode("".join(blob["content"].split()), validate=True)
            if len(data) != item["size"] or len(data) > skills.MAX_SOURCE_FILE_BYTES:
                raise ValueError("invalid_blob_size")
            if hashlib.sha1(f"blob {len(data)}\0".encode() + data).hexdigest() != item["sha"]:
                raise ValueError("invalid_blob_hash")
            content = data.decode("utf-8")
        except (ValueError, KeyError, TypeError, UnicodeError) as exc:
            raise skills.SkillError("github_invalid_utf8_blob", 422) from exc
        files.append({"path": path, "content": content})
        if len(skills.encoded({"files": files})) > skills.MAX_REQUEST_BYTES:
            raise skills.SkillError("skill_source_too_large", 413)
    source = {"origin": f"https://github.com/{repo}", "revision": revision, "files": files}
    source = skills.normalize_source(source, skills.artifacts()[0])
    return {
        "source": source,
        "detected_licenses": skills.detect_licenses(source),
        "license_status": "unknown",
    }
