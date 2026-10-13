"""Local AI assistant: tool-calling agent over the configured text model.

The assistant reuses the project's existing local text-model service and wraps
the already-validated settings, prompt and Skill backends behind a small set of
tools. Write tools are never executed inline: the agent loop stops and returns
a pending confirmation that the frontend must approve before the tool runs.
"""

from __future__ import annotations

import json
import threading
import uuid
from collections.abc import Callable
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import ProxyHandler, Request, build_opener, urlopen

MAX_AGENT_TURNS = 8
MAX_MESSAGES = 64
MAX_USER_BYTES = 64 * 1024
MAX_TOOL_RESULT_CHARS = 12000

# Tool executor: (name, arguments) -> JSON-serializable result. Raises on error.
ToolExecutor = Callable[[str, dict], object]

_pending_lock = threading.RLock()
_pending: dict[str, dict] = {}


def _function(name: str, description: str, parameters: dict) -> dict:
    return {"type": "function", "function": {"name": name, "description": description, "parameters": parameters}}


def _string_property(description: str) -> dict:
    return {"type": "string", "description": description}


# Read-only tools execute inline; write tools require confirmation.
READ_TOOLS = {
    "list_text_models",
    "get_settings",
    "get_prompts",
    "list_installed_skills",
    "discover_skill",
    "plan_creation",
}
WRITE_TOOLS = {
    "update_settings",
    "update_prompts",
    "set_skill_enabled",
    "set_skill_categories",
    "install_skill_from_url",
    "create_planned_content",
}

TOOLS: list[dict] = [
    _function("list_text_models", "List the local text models available for the assistant and prompt optimization.", {
        "type": "object", "properties": {}, "additionalProperties": False,
    }),
    _function("get_settings", "Read the current application settings (models, service URLs, output directory).", {
        "type": "object", "properties": {}, "additionalProperties": False,
    }),
    _function("get_prompts", "Read the current system prompt profiles used for prompt optimization and storyboards.", {
        "type": "object", "properties": {}, "additionalProperties": False,
    }),
    _function("list_installed_skills", "List installed creative presets (Skills) and their enabled/category state.", {
        "type": "object", "properties": {}, "additionalProperties": False,
    }),
    _function("discover_skill", "Inspect a GitHub URL for a creative preset (Skill) without installing it. Returns discovered files and license status.", {
        "type": "object",
        "properties": {"url": _string_property("The https://github.com URL of the Skill repository, file or directory.")},
        "required": ["url"], "additionalProperties": False,
    }),
    _function("plan_creation", "Read-only creation planning and preflight. Validate the proposed payload with the existing backend and inspect current workflow/model readiness. Call before create_planned_content; never proceed when blockers are returned.", {
        "type": "object",
        "properties": {
            "kind": {
                "type": "string",
                "enum": ["video", "image", "music", "long_video"],
                "description": "Existing creation interface to use.",
            },
            "payload": {
                "type": "object",
                "description": "Complete proposed request body for that existing creation interface.",
                "additionalProperties": True,
            },
        },
        "required": ["kind", "payload"], "additionalProperties": False,
    }),
    _function("update_settings", "Update application settings. Only the provided fields are changed; the rest are preserved.", {
        "type": "object",
        "properties": {
            "text_service_url": _string_property("Optional local text-model service URL, e.g. http://127.0.0.1:8000."),
            "text_model_ids": {"type": "array", "items": {"type": "string"}, "description": "Optional list of text model IDs."},
            "output_directory": _string_property("Optional absolute output directory."),
        },
        "additionalProperties": False,
    }),
    _function("update_prompts", "Update one system prompt profile field. The profile and field must already exist.", {
        "type": "object",
        "properties": {
            "profile": _string_property("Profile name: assistant, enhancement, video, mv, image, music, storyboard, mv_storyboard or skill_conversion."),
            "field": _string_property("Field name within the profile, e.g. role, task, rules or output."),
            "text": _string_property("The new prompt text."),
        },
        "required": ["profile", "field", "text"], "additionalProperties": False,
    }),
    _function("set_skill_enabled", "Enable or disable an installed creative preset by its id.", {
        "type": "object",
        "properties": {
            "id": _string_property("The installed Skill id (UUID)."),
            "enabled": {"type": "boolean", "description": "True to enable, false to disable."},
        },
        "required": ["id", "enabled"], "additionalProperties": False,
    }),
    _function("set_skill_categories", "Set the categories of an installed creative preset.", {
        "type": "object",
        "properties": {
            "id": _string_property("The installed Skill id (UUID)."),
            "categories": {"type": "array", "items": {"type": "string"}, "description": "The new category list."},
        },
        "required": ["id", "categories"], "additionalProperties": False,
    }),
    _function("install_skill_from_url", "Install a creative preset (Skill) from GitHub. Always call discover_skill first, then use one exact detected license name and path from its result. This performs license confirmation, conversion and installation, so it is a write action and requires user confirmation.", {
        "type": "object",
        "properties": {
            "url": _string_property("The https://github.com URL of the Skill repository, file or directory."),
            "model": _string_property("The local text model id used to convert the Skill. Use list_text_models to choose one."),
            "license_name": _string_property("The exact detected SPDX-style license name returned by discover_skill."),
            "license_path": _string_property("The exact license file path returned by discover_skill."),
        },
        "required": ["url", "model", "license_name", "license_path"], "additionalProperties": False,
    }),
    _function("create_planned_content", "Submit a successfully preflighted video, image, music or long-video plan to the existing creation API. This is a write action and requires explicit user confirmation. Use the exact plan_id returned by plan_creation.", {
        "type": "object",
        "properties": {"plan_id": _string_property("The unmodified plan_id from a blocker-free plan_creation result.")},
        "required": ["plan_id"], "additionalProperties": False,
    }),
]

def _valid_loopback(base_url: str) -> bool:
    try:
        parsed = urlparse(base_url)
        return (
            parsed.scheme == "http"
            and parsed.hostname in {"127.0.0.1", "localhost", "::1"}
            and parsed.username is None
            and parsed.password is None
            and parsed.path in {"", "/"}
            and not parsed.query
            and not parsed.fragment
            and parsed.port is not None
        )
    except ValueError:
        return False


def _chat_completion(service_url: str, model: str, messages: list[dict], tools: list[dict] | None) -> dict:
    if not _valid_loopback(service_url):
        raise RuntimeError("assistant_text_service_must_be_local")
    body = {
        "model": model,
        "messages": messages,
        "stream": False,
        "enable_thinking": False,
    }
    if tools:
        body["tools"] = tools
        body["tool_choice"] = "auto"
    request = Request(
        f"{service_url}/v1/chat/completions",
        data=json.dumps(body).encode("utf-8"),
        headers={"Accept": "application/json", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with build_opener(ProxyHandler({})).open(request, timeout=240) as response:
            raw = response.read(1024 * 1024 + 1)
    except HTTPError as exc:
        detail = exc.read(16 * 1024).decode("utf-8", errors="replace")
        exc.close()
        raise RuntimeError(f"assistant_text_http_{exc.code}") from exc
    except (URLError, TimeoutError, OSError) as exc:
        raise RuntimeError("assistant_text_unreachable") from exc
    if len(raw) > 1024 * 1024:
        raise RuntimeError("assistant_text_response_too_large")
    try:
        result = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise RuntimeError("assistant_text_invalid_json") from exc
    if not isinstance(result, dict) or not isinstance(result.get("choices"), list) or not result["choices"]:
        raise RuntimeError("assistant_text_invalid_envelope")
    return result


def _extract_message(result: dict) -> dict:
    choice = result["choices"][0]
    message = choice.get("message")
    if not isinstance(message, dict):
        raise RuntimeError("assistant_text_invalid_message")
    return message


def _tool_calls(message: dict) -> list[dict]:
    calls = message.get("tool_calls")
    if not isinstance(calls, list):
        return []
    return [call for call in calls if isinstance(call, dict)]


def _parse_arguments(call: dict) -> dict:
    function = call.get("function")
    if not isinstance(function, dict):
        raise RuntimeError("assistant_tool_invalid_call")
    name = function.get("name")
    if not isinstance(name, str) or name not in {tool["function"]["name"] for tool in TOOLS}:
        raise RuntimeError("assistant_tool_unknown")
    raw = function.get("arguments")
    if isinstance(raw, str):
        try:
            args = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise RuntimeError("assistant_tool_invalid_arguments") from exc
    else:
        args = raw
    if not isinstance(args, dict):
        raise RuntimeError("assistant_tool_invalid_arguments")
    return name, args


def _truncate(value: object) -> object:
    text = json.dumps(value, ensure_ascii=False, default=str)
    if len(text) > MAX_TOOL_RESULT_CHARS:
        return text[:MAX_TOOL_RESULT_CHARS] + "…(truncated)"
    return value


def _run_turn(service_url: str, model: str, messages: list[dict], executor: ToolExecutor) -> dict:
    """Run one agent turn. Returns a dict describing the outcome."""
    result = _chat_completion(service_url, model, messages, TOOLS)
    message = _extract_message(result)
    calls = _tool_calls(message)
    if not calls:
        content = message.get("content")
        if not isinstance(content, str):
            content = ""
        return {"status": "done", "content": content, "message": message}

    # Partition into read (inline) and write (needs confirmation) tools.
    parsed = []
    for call in calls:
        name, args = _parse_arguments(call)
        parsed.append({"id": call.get("id"), "name": name, "arguments": args})
    write = [item for item in parsed if item["name"] in WRITE_TOOLS]
    read = [item for item in parsed if item["name"] in READ_TOOLS]

    if read and write:
        # The model may request preflight and a write together. Run only reads and
        # make it reconsider the write after seeing their results.
        tool_messages = []
        for item in read:
            try:
                value = executor(item["name"], item["arguments"])
                content = json.dumps(_truncate(value), ensure_ascii=False, default=str)
            except Exception as exc:  # noqa: BLE001 - surface tool errors to the model
                content = json.dumps({"error": str(exc)}, ensure_ascii=False)
            tool_messages.append({
                "role": "tool",
                "tool_call_id": item["id"],
                "name": item["name"],
                "content": content,
            })
        for item in write:
            tool_messages.append({
                "role": "tool",
                "tool_call_id": item["id"],
                "name": item["name"],
                "content": json.dumps({
                    "error": "preflight_tools_must_finish_before_write",
                    "write_not_executed": True,
                }),
            })
        messages.append(message)
        messages.extend(tool_messages)
        return {"status": "continue", "messages": messages}

    if write:
        # Stop and ask the frontend to confirm before executing any write tool.
        content = message.get("content")
        return {
            "status": "needs_confirmation", "tool_calls": write, "message": message,
            "content": content if isinstance(content, str) else "",
        }

    # Execute read tools inline and continue the loop.
    tool_messages = []
    for item in read:
        try:
            value = executor(item["name"], item["arguments"])
            content = json.dumps(_truncate(value), ensure_ascii=False, default=str)
        except Exception as exc:  # noqa: BLE001 - surface tool errors to the model
            content = json.dumps({"error": str(exc)}, ensure_ascii=False)
        tool_messages.append({
            "role": "tool",
            "tool_call_id": item["id"],
            "name": item["name"],
            "content": content,
        })
    messages.append(message)
    messages.extend(tool_messages)
    return {"status": "continue", "messages": messages}


def run_agent(service_url: str, model: str, messages: list[dict], executor: ToolExecutor) -> dict:
    """Run the tool-calling loop until the model answers or a write tool needs confirmation."""
    if not isinstance(messages, list) or not messages or len(messages) > MAX_MESSAGES:
        raise ValueError("invalid_assistant_messages")
    for turn in range(MAX_AGENT_TURNS):
        outcome = _run_turn(service_url, model, messages, executor)
        if outcome["status"] == "done":
            return {"status": "done", "content": outcome["content"], "messages": messages}
        if outcome["status"] == "needs_confirmation":
            pending_id = str(uuid.uuid4())
            with _pending_lock:
                _pending[pending_id] = {
                    "service_url": service_url,
                    "model": model,
                    "messages": messages,
                    "assistant_message": outcome["message"],
                    "tool_calls": outcome["tool_calls"],
                }
            return {
                "status": "needs_confirmation",
                "pending_id": pending_id,
                "tool_calls": outcome["tool_calls"],
                "content": outcome.get("content", ""),
            }
        messages = outcome["messages"]
    raise RuntimeError("assistant_tool_loop_exceeded")


def confirm(pending_id: str, approved: bool, executor: ToolExecutor) -> dict:
    """Execute (or discard) a pending write-tool confirmation and continue the loop."""
    with _pending_lock:
        state = _pending.pop(pending_id, None)
    if state is None:
        raise ValueError("assistant_pending_not_found")
    if not approved:
        return {"status": "cancelled"}

    messages = list(state["messages"])
    assistant_message = state["assistant_message"]
    tool_messages = []
    for item in state["tool_calls"]:
        try:
            value = executor(item["name"], item["arguments"])
            content = json.dumps(_truncate(value), ensure_ascii=False, default=str)
        except Exception as exc:  # noqa: BLE001
            content = json.dumps({"error": str(exc)}, ensure_ascii=False)
        tool_messages.append({
            "role": "tool",
            "tool_call_id": item["id"],
            "name": item["name"],
            "content": content,
        })
    messages.append(assistant_message)
    messages.extend(tool_messages)
    return run_agent(state["service_url"], state["model"], messages, executor)
