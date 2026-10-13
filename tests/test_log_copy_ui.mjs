import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
function harness(writeText) {
  const button = {disabled: false, setAttribute(key, value) {this[key] = value;}};
  const status = {};
  const copied = [];
  const errors = [];
  const context = vm.createContext({
    languageSelect: {value: "zh-CN"}, jobLogs: {textContent: "First\n<raw> & last\n"},
    document: {querySelector: selector => selector === "#copy-logs" ? button : status},
    navigator: {clipboard: {async writeText(text) {copied.push(text); await writeText?.();}}},
    console: {error: (...args) => errors.push(args)}
  });
  vm.runInContext(source.slice(source.indexOf("const logCopyTranslations ="),
    source.indexOf("const historyList =")), context);
  return {context, button, status, copied, errors};
}
test("copies complete raw logs with an icon-only accessible button", async () => {
  const h = harness();
  await h.context.copyJobLogs();
  assert.deepEqual(h.copied, ["First\n<raw> & last\n"]);
  assert.equal(h.status.textContent, "日志已复制");
  assert.equal(h.button.disabled, false);
  assert.match(html, /id="copy-logs"[^>]*aria-label=[^>]*>\s*<svg/);
  assert.match(source, /addEventListener\("click", copyJobLogs\)/);
});
test("clipboard rejection reports failure and allows retry", async () => {
  const h = harness(() => {throw new Error("permission denied");});
  await h.context.copyJobLogs();
  assert.match(h.status.textContent, /复制失败/);
  assert.equal(h.errors.length, 1);
  assert.equal(h.button.disabled, false);
});
test("empty logs leave the clipboard untouched", async () => {
  const h = harness();
  h.context.jobLogs.textContent = "";
  await h.context.copyJobLogs();
  assert.equal(h.copied.length, 0);
  assert.equal(h.status.textContent, "暂无日志可复制。");
});
test("labels and feedback support all fourteen languages", async () => {
  const h = harness();
  for (const lang of ["en", "zh-CN", "zh-TW", "fr", "de", "ja", "ko", "es", "pt", "tr", "ar", "vi", "id", "ru"]) {
    h.context.languageSelect.value = lang;
    await h.context.copyJobLogs();
    assert.ok(h.button["aria-label"]);
    assert.ok(h.status.textContent);
    assert.equal(h.status.hidden, false);
  }
});