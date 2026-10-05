import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const planner = source.slice(
  source.indexOf("async function planWorkflowStory()"),
  source.indexOf("async function enhancePrompt()")
);
const generated = {
  title: "Home", prompt: "A traveller returns home", duration: 8,
  music_prompt: "Warm instrumental strings"
};

function makeHarness({ shots = [], count = 2, response = { shots: [generated, generated] }, ok = true } = {}) {
  const children = [];
  function makeShot(shot) {
    const card = {
      querySelector(selector) {
        return { value: selector === "[data-shot-title]" ? shot.title : shot.prompt };
      },
      remove() { children.splice(children.indexOf(card), 1); },
      data: shot
    };
    return card;
  }
  shots.forEach(shot => children.push(makeShot(shot)));
  const disabledControl = { disabled: true };
  const enabledControl = { disabled: false };
  const status = { hidden: true, textContent: "", classList: {
    add() {}, remove() {}
  } };
  const requests = [];
  const context = vm.createContext({
    storyboardBusy: false,
    workflowPlanStory: { disabled: false, textContent: "" },
    workflowStoryStatus: status,
    workflowTextModel: { value: "local-model" },
    workflowShots: { children },
    workflowPanel: { querySelectorAll: () => [disabledControl, enabledControl] },
    document: { querySelector: selector => ({
      value: selector === "#workflow-story" ? "A traveller returns home." : String(count)
    }) },
    t: key => key,
    updateGenerateAvailability() {},
    updateWorkflowShotNumbers() {},
    addWorkflowShot(shot) { children.push(makeShot(shot)); },
    async fetch(url, options) {
      requests.push({ url, payload: JSON.parse(options.body) });
      return { ok, json: async () => response };
    }
  });
  vm.runInContext(planner, context);
  return {
    context, children, status, requests, disabledControl, enabledControl,
    run: () => vm.runInContext("planWorkflowStory()", context)
  };
}

test("appends generated shots, removes only blank placeholders and restores controls", async () => {
  const existing = { title: "Existing", prompt: "Keep this scene" };
  const harness = makeHarness({ shots: [existing, { title: "", prompt: "" }] });
  await harness.run();
  assert.deepEqual(harness.children.map(card => card.data), [existing, generated, generated]);
  assert.equal(harness.requests[0].url, "/api/storyboards");
  assert.equal(harness.requests[0].payload.model, "local-model");
  assert.equal(harness.status.textContent, "storyboardAdded");
  assert.equal(harness.disabledControl.disabled, true);
  assert.equal(harness.enabledControl.disabled, false);
  assert.equal(harness.context.storyboardBusy, false);
});

test("invalid or failed responses never change existing shots", async () => {
  for (const options of [
    { response: { shots: [generated] } },
    { response: { shots: [generated, { ...generated, music_prompt: "" }] } },
    { response: { error: "offline" }, ok: false }
  ]) {
    const existing = { title: "Existing", prompt: "Keep this scene" };
    const harness = makeHarness({ shots: [existing], ...options });
    await harness.run();
    assert.deepEqual(harness.children.map(card => card.data), [existing]);
    assert.equal(harness.context.storyboardBusy, false);
    assert.equal(harness.enabledControl.disabled, false);
    assert.match(harness.status.textContent, /enhanceFailed/);
  }
});

test("refuses requests that would exceed the storyboard shot limit", async () => {
  const harness = makeHarness({
    shots: Array.from({ length: 47 }, () => ({ title: "Existing", prompt: "Scene" })),
    count: 2
  });
  await harness.run();
  assert.equal(harness.requests.length, 0);
  assert.equal(harness.children.length, 47);
  assert.equal(harness.status.textContent, "storyboardInvalid");
});
