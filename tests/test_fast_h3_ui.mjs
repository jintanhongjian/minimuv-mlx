import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");

test("FastH3 model notes cover fourteen languages and the released recipe", () => {
  const context = vm.createContext({});
  vm.runInContext(source.slice(source.indexOf("const fastH3Translations ="),
    source.indexOf("for (const [language, note]")), context);
  const translations = vm.runInContext("fastH3Translations", context);
  const limits = vm.runInContext("fastH3LimitTranslations", context);
  assert.equal(Object.keys(translations).length, 14);
  assert.deepEqual(Object.keys(limits), Object.keys(translations));
  for (const note of Object.values(translations)) {
    for (const number of ["4", "5", "24", "512/768/1024", "32", "64"]) {
      assert.ok(note.includes(number));
    }
    assert.ok(note.includes("Turbo LoRA") || note.includes("Turbo-LoRA"));
  }
  assert.ok(Object.values(limits).every(note => note.length > 30));
});

test("workflow payload uses four evaluations, preserving first-frame choice", () => {
  const values = {"#workflow-name": "Film", "#workflow-aspect": "16:9",
    "#workflow-video-quality": "preview"};
  const shot = {dataset: {steps: "8"}, querySelector: selector => ({
    value: selector === "[data-shot-frame]" ? "frame-uuid" :
      selector === "[data-shot-duration]" ? "5" :
      selector === "[data-shot-seed]" ? "42" : "Film"
  })};
  const context = vm.createContext({
    document: {querySelector: selector => ({value: values[selector] || "", checked: false})},
    videoModelChoice: {value: "h3-fasth3-vsa-q8"}, workflowShots: {children: [shot]},
    currentWorkflow: null, workflowGlobalMusicPrompt: {value: "Piano"}
  });
  vm.runInContext(source.slice(source.indexOf("function workflowPayload()"),
    source.indexOf("function setWorkflowForm(")), context);
  const result = context.workflowPayload();
  assert.equal(result.model, "h3-fasth3-vsa-q8");
  assert.equal(result.shots[0].steps, 4);
  assert.equal(result.shots[0].turbo, true);
  assert.equal(result.shots[0].first_frame_id, "frame-uuid");
});

test("FastH3 hides unsupported sampling and download actions, exposes readiness errors", () => {
  assert.match(source, /stepsSelect\.closest\("\.field"\)\.hidden = ltx \|\| fastH3/);
  assert.match(source, /actions\.hidden = id === "h3-fasth3-vsa-q8"/);
  assert.match(source, /videoModelChoice\.value === "h3-fasth3-vsa-q8" \? 4 : 8/g);
  assert.match(source, /\[selected\.model_path, selected\.model_error, selected\.runtime_error\]/);
  assert.match(source, /continuousOption\.disabled = fastH3/);
  assert.match(source, /fasth3_conditioning_unsupported: "fastH3Limit"/);
  assert.match(source, /info\.download_catalog === false/);
});
