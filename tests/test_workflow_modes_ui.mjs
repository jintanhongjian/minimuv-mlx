import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");

test("mode buttons use content-aware rows rather than a fixed column count", () => {
  const css = readFileSync(new URL("../webapp/static/app.css", import.meta.url), "utf8");
  const group = css.match(/\.mode-switch\s*\{([^}]+)\}/)[1];
  const button = css.match(/\.mode-button\s*\{([^}]+)\}/)[1];
  assert.match(group, /display:\s*flex/);
  assert.match(group, /flex-wrap:\s*wrap/);
  assert.doesNotMatch(group, /grid-template-columns/);
  assert.match(button, /flex:\s*1 1 auto/);
  assert.match(button, /white-space:\s*nowrap/);
});

test("new drafts preserve the selected model, quality, timing, mode and soundtrack", () => {
  const fields = new Map();
  const field = key => {
    if (!fields.has(key)) fields.set(key, {value: ""});
    return fields.get(key);
  };
  const context = vm.createContext({
    currentWorkflow: null, storyboardBusy: false, workflowFetchVersion: 0, workflowPollTimer: null,
    videoModelChoice: {value: "h3"}, workflowMusic: {checked: true}, modelInfo: null,
    window: {},
    document: {querySelector: field},
    workflowShots: {replaceChildren() {}, children: [], querySelectorAll() {return [];}},
    workflowPanel: {querySelectorAll() {return [];}},
    workflowGlobalMusicPrompt: {}, DEFAULT_WORKFLOW_MUSIC_PROMPT: "Music",
    workflowStatus: {}, workflowSaveButton: {}, workflowStartButton: {}, workflowResumeButton: {},
    workflowRestoreButton: {}, workflowCancelButton: {},
    t: key => key, addWorkflowShot() {}, showWorkflowMessage() {},
    updateStoryboardTiming() {}, updateWorkflowMusicPromptVisibility() {},
    updateLocalModelControls() {}, updateGenerateAvailability() {}, updateWorkflowShotNumbers() {},
    refreshResultPreview() {}
  });
  field("#workflow-shot-mode").value = "continuous";
  field("#workflow-video-quality").value = "high";
  field("#workflow-shot-duration").value = "7";
  field("#workflow-total-duration").value = "70";
  field("#workflow-progress").replaceChildren = () => {};
  vm.runInContext(source.slice(source.indexOf("function newWorkflow("),
    source.indexOf("function renderWorkflow(")), context);
  context.newWorkflow();
  assert.equal(context.videoModelChoice.value, "h3");
  assert.equal(field("#workflow-shot-mode").value, "continuous");
  assert.equal(field("#workflow-video-quality").value, "high");
  assert.equal(field("#workflow-shot-duration").value, "7");
  assert.equal(field("#workflow-total-duration").value, "70");
  assert.equal(context.workflowMusic.checked, true);
  assert.match(source, /shot_mode: document\.querySelector\("#workflow-shot-mode"\)\.value/);
  assert.match(source, /manifest\.shot_mode \|\| "continuous"/);
});

test("manual shot mode labels are translated into fourteen languages", () => {
  const languages = ["zh-CN", "zh-TW", "en", "fr", "de", "ja", "ko",
    "es", "pt", "tr", "ar", "vi", "id", "ru"];
  const context = vm.createContext({workflowTranslations: Object.fromEntries(languages.map(l => [l, {}]))});
  vm.runInContext(source.slice(source.indexOf("const workflowModeKeys ="),
    source.indexOf("const storyboardReplacementTranslations =")), context);
  for (const lang of languages) {
    assert.equal(Object.keys(context.workflowTranslations[lang]).length, 4);
    assert.ok(Object.values(context.workflowTranslations[lang]).every(value => value.length > 0));
  }
});

test("efficiency shortcut and automatic preset hooks are removed", () => {
  const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
  assert.doesNotMatch(html, /workflow-efficient|workflowEfficient/);
  assert.doesNotMatch(source, /applyWorkflowEfficiency|initializeWorkflowDraft|workflowDraftInitialized|workflow-efficient/);
});

test("model descriptions follow H3, FastH3, both Distilled variants and Dev without changing settings", () => {
  const notes = new Map();
  const context = vm.createContext({
    window: {MiniMuvVideoPrompts: {note() {return "Dev CFG 3.0, 30 steps";}}},
    videoModelChoice: {value: "h3", selectedOptions: [{textContent: "H3"}]},
    document: {querySelector(selector) {
      if (!notes.has(selector)) notes.set(selector, {textContent: "", removeAttribute() {}});
      return notes.get(selector);
    }},
    t: key => ({h3QualityNote: "H3 quality", fastH3Note: "FastH3 VSA, no first frame",
      distilledNote: "Distilled 8+3 steps"})[key]
  });
  vm.runInContext(source.slice(source.indexOf("function updateVideoModelNotes()"),
    source.indexOf("function updateLocalModelControls()")), context);
  for (const [model, expected] of [
    ["h3", "H3 quality"], ["h3-fasth3-vsa-q8", "FastH3 VSA, no first frame"],
    ["ltx-2.3-distilled-q4", "Distilled 8+3 steps"], ["ltx-2.3-distilled-q8", "Distilled 8+3 steps"],
    ["ltx-2.3-dev-q4", "Dev CFG 3.0, 30 steps"], ["h3", "H3 quality"]
  ]) {
    context.videoModelChoice.value = model;
    context.videoModelChoice.selectedOptions[0].textContent = model;
    context.updateVideoModelNotes();
    assert.equal(context.videoModelChoice.value, model);
    for (const note of notes.values()) assert.equal(note.textContent, `${model}: ${expected}`);
  }
  context.t = () => "新的中文说明";
  context.updateVideoModelNotes();
  assert.equal(notes.get("#workflow-quality-note").textContent, "h3: 新的中文说明");
});
