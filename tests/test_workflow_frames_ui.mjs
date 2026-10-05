import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");

test("boundary frame and restore labels cover all fourteen languages", () => {
  const code = source.slice(source.indexOf("const workflowFrameTranslations ="),
    source.indexOf("for (const [language, values] of Object.entries(workflowFrameTranslations))"));
  const context = vm.createContext({});
  vm.runInContext(code, context);
  const labels = vm.runInContext("workflowFrameTranslations", context);
  assert.equal(Object.keys(labels).length, 14);
  for (const values of Object.values(labels)) {
    assert.equal(values.length, 3);
    assert.ok(values.every(value => typeof value === "string" && value.length));
  }
});

test("terminal histories expose restoration and both saved boundary frames", () => {
  assert.match(html, /id="workflow-restore".*data-i18n="workflowRestore"/);
  assert.match(source, /workflowRestoreButton\.addEventListener\("click", \(\) => submitWorkflowAction\("restore"\)\)/);
  assert.match(source, /if \(action === "restore"\) setWorkflowForm\(data\.workflow\)/);
  assert.match(source, /\["generated_first_frame_url", "workflowFirstFrame"\]/);
  assert.match(source, /\["last_frame_url", "workflowLastFrame"\]/);
});
