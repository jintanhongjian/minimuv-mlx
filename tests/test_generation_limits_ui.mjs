import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
const controlsSource = source.slice(source.indexOf("function applyParameterRange("),
  source.indexOf("function updateSelectedModelLinks("));

function harness() {
  const controls = new Map();
  for (const id of ["duration", "steps", "music-duration", "music-steps", "workflow-shot-duration",
    "workflow-total-duration", "video-duration-limit", "video-steps-limit", "music-duration-limit",
    "music-steps-limit", "storyboard-duration-limit"]) {
    controls.set(`#${id}`, {value: "7", disabled: false});
  }
  const fields = new Map(["duration", "duration-hint", "steps", "steps-hint", "steps-field", "turbo"]
    .map(key => [`[data-shot-${key}]`, {value: "7", checked: true}]));
  const context = vm.createContext({
    window: {},
    document: {querySelector: selector => controls.get(selector)},
    modelInfo: {
      duration_limits: {
        video: {"h3": {min: 5, max: 15}, "ltx-2.3-distilled-q4": {min: 1, max: 20}},
        music: {"music3": {min: 1, max: 300}, "yue2-3b-8bit": {automatic: true}}
      },
      sampling_limits: {
        video: {"h3": {turbo: {min: 4, max: 8}, standard: {min: 16, max: 50}},
          "ltx-2.3-distilled-q4": {min: 8, max: 8, fixed: true}},
        music: {"music3": {min: 1, max: 30}, "yue2-3b-8bit": {automatic: true}}
      }
    },
    videoModelChoice: {value: "h3"}, musicModelChoice: {value: "music3"}, turboToggle: {checked: true},
    workflowShots: {children: [{querySelector: selector => fields.get(selector)}]},
    activeMode: "video", currentWorkflow: null, currentJob: null, storyboardBusy: false,
    firstFrameBusy: false, promptEnhancementBusy: false, workflowStructureBusy: false,
    updateStoryboardTiming() {}, t: () => "Whole numbers {min}–{max}"
  });
  vm.runInContext(controlsSource, context);
  return {context, controls, fields, update: () => context.updateParameterControls()};
}

test("Turbo v4 label and guidance cover fourteen languages without a version selector", () => {
  const context = vm.createContext({});
  vm.runInContext(source.slice(source.indexOf("const turboV4Translations ="),
    source.indexOf("const modelCategoryKeys =")) + "\nglobalThis.labels = turboV4Translations;", context);
  assert.equal(Object.keys(context.labels).length, 14);
  for (const [label, note] of Object.values(context.labels)) {
    assert.match(label, /v4/);
    assert.match(label, /4–8/);
    assert.match(note, /v4-600 EMA/);
    assert.match(note, /6–8/);
    assert.match(note, /FastH3/);
  }
  assert.match(html, /id="settings-h3-turbo-status"/);
  assert.doesNotMatch(html, /<select[^>]+turbo-version/);
});

test("all six duration and sampling fields are integer number inputs, not presets", () => {
  for (const id of ["duration", "steps", "music-duration", "music-steps", "workflow-shot-duration"]) {
    assert.match(html, new RegExp(`<input[^>]*id="${id}"[^>]*type="number"[^>]*step="1"`));
    assert.doesNotMatch(html, new RegExp(`<select[^>]*id="${id}"`));
  }
  for (const selector of ["data-shot-duration", "data-shot-steps"]) {
    assert.match(html, new RegExp(`<input ${selector}[^>]*type="number"[^>]*step="1"`));
  }
});

test("model and Turbo switches update ranges without replacing any entered value", () => {
  const h = harness();
  h.update();
  assert.equal(h.controls.get("#duration").min, "5");
  assert.equal(h.controls.get("#steps").max, "8");
  assert.equal(h.controls.get("#steps").min, "4");
  assert.equal(h.fields.get("[data-shot-steps]").min, "4");
  assert.equal(h.controls.get("#music-steps").max, "30");
  assert.equal(h.controls.get("#music-duration").disabled, true);
  h.context.turboToggle.checked = false;
  h.fields.get("[data-shot-turbo]").checked = false;
  h.controls.get("#steps").value = "37";
  h.update();
  assert.equal(h.controls.get("#steps").min, "16");
  assert.equal(h.controls.get("#steps").max, "50");
  assert.equal(h.fields.get("[data-shot-steps]").min, "16");
  assert.equal(h.controls.get("#steps").value, "37");
  h.context.videoModelChoice.value = "ltx-2.3-distilled-q4";
  h.update();
  assert.equal(h.controls.get("#duration").min, "1");
  assert.equal(h.controls.get("#duration").max, "20");
  assert.equal(h.controls.get("#workflow-total-duration").max, "1800");
  assert.equal(h.fields.get("[data-shot-steps-field]").hidden, true);
  assert.equal(h.controls.get("#steps").disabled, true);
  assert.equal(h.controls.get("#steps").value, "37");
  h.context.videoModelChoice.value = "h3";
  h.update();
  assert.equal(h.controls.get("#workflow-total-duration").max, "1800");
  assert.equal(h.fields.get("[data-shot-steps-field]").hidden, false);
  assert.equal(h.controls.get("#steps").value, "37");
});

test("hidden music/video modes and automatic YuE controls cannot block another form", () => {
  const h = harness();
  h.context.activeMode = "music";
  h.update();
  assert.equal(h.controls.get("#duration").disabled, true);
  assert.equal(h.controls.get("#steps").disabled, true);
  assert.equal(h.controls.get("#music-duration").disabled, false);
  assert.equal(h.controls.get("#music-steps").disabled, false);
  h.context.musicModelChoice.value = "yue2-3b-8bit";
  h.update();
  assert.equal(h.controls.get("#music-duration").disabled, true);
  assert.equal(h.controls.get("#music-steps").disabled, true);
  h.context.storyboardBusy = true;
  h.update();
  assert.equal(h.controls.get("#workflow-shot-duration").disabled, true);
});

test("numeric range guidance has fourteen complete translations", () => {
  const translationSource = source.slice(source.indexOf("const parameterTranslations ="),
    source.indexOf("for (const [language, [range, timing, prompt]]"));
  const context = vm.createContext({});
  vm.runInContext(`${translationSource}\nthis.strings = parameterTranslations;`, context);
  assert.equal(Object.keys(context.strings).length, 14);
  for (const [range, timing, prompt] of Object.values(context.strings)) {
    assert.match(range, /\{min\}/);
    assert.match(range, /\{max\}/);
    assert.ok(timing && prompt);
  }
});
