import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../webapp/static/app.css", import.meta.url), "utf8");
const js = readFileSync(new URL("../webapp/static/assistant.js", import.meta.url), "utf8");
const app = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");

const pure = vm.createContext({});
vm.runInContext(js.slice(js.indexOf("const keys ="), js.indexOf("  const language =")), pure);

test("the top bar exposes an AI assistant entry next to settings", () => {
  const topbar = html.slice(html.indexOf('<div class="topbar-right">'), html.indexOf("</header>"));
  assert.match(topbar, /id="assistant-open"/);
  assert.match(topbar, /id="settings-open"/);
});

test("the assistant dialog hosts a model picker, transcript and confirm card", () => {
  const dialog = html.slice(html.indexOf('<dialog id="assistant-dialog"'), html.indexOf('<dialog id="settings-dialog"'));
  assert.match(dialog, /id="assistant-model"/);
  assert.match(dialog, /id="assistant-messages"/);
  assert.match(dialog, /<aside id="assistant-run-log" class="assistant-run-log"/);
  assert.match(dialog, /id="assistant-run-log-list"[^>]*role="log"/);
  assert.match(dialog, /id="assistant-log-resizer"[^>]*role="separator"[^>]*tabindex="0"/);
  assert.match(dialog, /id="assistant-log-toggle"[^>]*aria-controls="assistant-run-log"/);
  assert.match(dialog, /id="assistant-confirm"[^>]*hidden/);
  assert.match(dialog, /id="assistant-confirm-approve"/);
  assert.match(dialog, /id="assistant-confirm-cancel"/);
  assert.match(dialog, /id="assistant-input"/);
  assert.match(dialog, /id="assistant-send"/);
});

test("the assistant script is served and wired to the dialog", () => {
  assert.match(html, /<script src="\/assistant\.js" defer><\/script>/);
  assert.match(js, /\/api\/assistant\/chat/);
  assert.match(js, /\/api\/assistant\/confirm/);
  assert.match(js, /\/api\/assistant\/models/);
  assert.match(js, /post\("\/api\/assistant\/chat", \{ model, messages: history, locale: language\(\) \}\)/);
});

test("write tools are gated behind the confirm card, not executed on chat", () => {
  assert.match(js, /status === "needs_confirmation"/);
  assert.match(js, /approved: true/);
  assert.match(js, /approved: false/);
  assert.match(js, /confirmation_details/);
  assert.match(js, /data\.content/);
  assert.match(js, /Creation plan:/);
});

test("the assistant drawer has dedicated styling", () => {
  assert.match(css, /\.assistant-dialog\s*\{/);
  assert.match(css, /\.assistant-workspace\s*\{[^}]*--assistant-log-width/s);
  assert.match(css, /\.assistant-workspace\.log-hidden\s*\{/);
  assert.match(css, /\.assistant-log-resizer::after/);
  assert.match(css, /\.assistant-run-log-list:empty::before/);
  assert.match(css, /\.assistant-confirm\s*\{/);
  assert.match(css, /\.assistant-messages\s*\{/);
});

test("the assistant run log can be resized and hidden with mouse or keyboard", () => {
  assert.match(js, /minimuv-assistant-log-width/);
  assert.match(js, /minimuv-assistant-log-hidden/);
  assert.match(js, /addEventListener\("pointerdown"/);
  assert.match(js, /event\.key === "ArrowLeft"/);
  assert.match(js, /event\.key === "ArrowRight"/);
  assert.match(js, /event\.key === "Home"/);
  assert.match(js, /event\.key === "End"/);
  assert.match(js, /aria-expanded/);
});

test("assistant run log records lifecycle and tool names without storing prompt text", () => {
  assert.match(js, /function recordRunEvent\(key, detail = "", kind = ""\)/);
  assert.match(js, /runLogList\.children\.length > 100/);
  assert.match(js, /recordRunEvent\("logSubmitted"\)/);
  assert.match(js, /recordRunEvent\("logAwaitingConfirmation"\)/);
  assert.match(js, /recordRunEvent\("logApproved"\)/);
  assert.match(js, /recordRunEvent\("logCompleted"\)/);
  assert.match(js, /recordRunEvent\("logFailed"/);
  assert.match(js, /recordRunEvent\("logToolCall", call\.name/);
});

test("the assistant is localized in fourteen languages with aligned tables", () => {
  const {keys, messages} = vm.runInContext("({keys, messages})", pure);
  assert.equal(Object.keys(messages).length, 14);
  assert.deepEqual(Object.keys(messages).sort(), [
    "ar", "de", "en", "es", "fr", "id", "ja", "ko", "pt", "ru", "tr", "vi", "zh-CN", "zh-TW",
  ]);
  for (const [language, values] of Object.entries(messages)) {
    assert.equal(values.length, keys.length, language);
    assert.ok(values.every((value) => typeof value === "string" && value.trim()), language);
  }
});

test("assistant markup uses its own localization hooks, not the shared app keys", () => {
  const dialog = html.slice(html.indexOf('<dialog id="assistant-dialog"'), html.indexOf('<dialog id="settings-dialog"'));
  assert.match(dialog, /data-assistant-label="title"/);
  assert.match(dialog, /data-assistant-label="send"/);
  assert.match(dialog, /data-assistant-placeholder="placeholder"/);
  assert.doesNotMatch(dialog, /data-i18n="assistant/);
});

test("app.js refreshes the assistant when the language changes", () => {
  assert.match(app, /window\.MiniMuvAssistant\?\.localize\(\)/);
});
