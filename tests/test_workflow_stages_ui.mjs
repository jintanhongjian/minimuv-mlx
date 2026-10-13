import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../webapp/static/app.css", import.meta.url), "utf8");
const stageSource = source.slice(source.indexOf("let workflowStageBusy = false"),
  source.indexOf("async function refreshCurrentJob()"));

function harness(save = true) {
  const calls = [];
  const card = {};
  const messages = [];
  const context = vm.createContext({
    currentWorkflow: {id: "workflow", status: "draft", shots: [{id: "saved-shot"}]},
    workflowShots: {children: [card]}, storyboardBusy: false, firstFrameBusy: false,
    workflowStructureBusy: false, workflowDeletion: null,
    async submitWorkflowAction(action) {calls.push(action); return save;},
    async fetch(url, options) {
      calls.push({url, method: options.method});
      return {ok: true, json: async () => ({workflow: {id: "workflow", status: "queued"}})};
    },
    renderWorkflow(manifest) {context.currentWorkflow = manifest;},
    scheduleWorkflowPoll(id) {calls.push(`poll:${id}`);},
    async loadWorkflows() {}, showWorkflowMessage(...message) {messages.push(message);},
    t: key => key
  });
  vm.runInContext(stageSource, context);
  return {context, calls, card, messages};
}

test("single shot saves first then generates the bound shot only", async () => {
  const {context, calls, card} = harness();
  await context.runWorkflowStage("shot", card);
  assert.equal(calls[0], "save");
  assert.deepEqual(calls[1], {url: "/api/workflows/workflow/shots/saved-shot/generate", method: "POST"});
  assert.equal(calls[2], "poll:workflow");
});

test("absolute video positioning is scoped to the result player, not shot previews", () => {
  assert.match(css, /#video-result\s*\{[^}]*position:\s*absolute/);
  assert.doesNotMatch(css, /(?:^|\n)video\s*\{/);
  assert.match(css, /\[data-shot-preview\]\s*\{[^}]*height:\s*auto/);
});

test("batch videos, assembly and soundtrack use separate endpoints", async () => {
  for (const operation of ["videos", "assemble", "soundtrack"]) {
    const {context, calls} = harness();
    await context.runWorkflowStage(operation);
    assert.equal(calls[1].url, `/api/workflows/workflow/${operation}`);
  }
});

test("save failure and active workflows cannot start a staged run", async () => {
  const h = harness(false);
  await h.context.runWorkflowStage("videos");
  assert.deepEqual(h.calls, ["save"]);
  h.context.currentWorkflow.status = "running";
  await h.context.runWorkflowStage("videos");
  assert.deepEqual(h.calls, ["save"]);
});

test("missing assembly and clips show actionable errors", async () => {
  for (const [error, key] of [
    ["workflow_assembly_required", "workflowNeedAssembly"],
    ["workflow_shot_media_missing", "workflowNeedShots"],
    ["workflow_global_soundtrack_required", "workflowNeedGlobal"]
  ]) {
    const h = harness();
    h.context.fetch = async () => ({ok: false, json: async () => ({error})});
    await h.context.runWorkflowStage("soundtrack");
    assert.equal(h.messages[0][0], key);
  }
});

test("new stage labels cover all fourteen languages without overwriting soundtrack legend", () => {
  const langs = ["en", "zh-CN", "zh-TW", "fr", "de", "ja", "ko", "es", "pt", "tr", "ar", "vi", "id", "ru"];
  const context = vm.createContext({workflowTranslations: Object.fromEntries(langs.map(lang => [lang, {}]))});
  vm.runInContext(source.slice(source.indexOf("const workflowStageKeys ="),
    source.indexOf("const workflowModeKeys =")), context);
  for (const lang of langs) {
    for (const key of ["workflowVideos", "workflowAssemble", "workflowPostScore",
      "workflowGenerateShot", "workflowRegenerateShot", "workflowStagesHint", "workflowAuto"]) {
      assert.equal(typeof context.workflowTranslations[lang][key], "string", `${lang}:${key}`);
    }
  }
  assert.match(html, /data-shot-preview controls preload="none"/);
  assert.match(html, /id="workflow-start"[^>]*data-i18n="workflowAuto"/);
  assert.match(html, /id="workflow-soundtrack"[^>]*data-i18n="workflowPostScore"/);
});
