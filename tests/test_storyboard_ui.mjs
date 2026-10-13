import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const planner = source.slice(
  source.indexOf("function updateStoryboardTiming()"),
  source.indexOf("async function enhancePrompt()")
);
const generated = {
  title: "Home", prompt: "A traveller returns home", duration: 8,
  music_prompt: "Warm instrumental strings"
};

function makeHarness({ shots = [], count = 2, total = count * 8, duration = 8, model = "h3",
  response = { shots: [generated, generated] }, ok = true } = {}) {
  const children = [];
  function makeShot(shot) {
    const fields = {
      "[data-shot-title]": {value: shot.title},
      "[data-shot-prompt]": {value: shot.prompt},
      "[data-shot-music-prompt]": {value: shot.music_prompt},
      "[data-shot-duration]": {value: String(shot.duration)},
      "[data-shot-frame]": {value: shot.first_frame_id || ""}
    };
    const card = {
      dataset: {firstFrameId: shot.first_frame_id || "", firstFrameUrl: "saved.png"},
      querySelector(selector) {
        return fields[selector];
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
  const timingControls = {
    "#workflow-story-progress": {hidden: true},
    "#workflow-story": {value: "A traveller returns home."},
    "#workflow-total-duration": {value: String(total), setCustomValidity(value) { this.error = value; }},
    "#workflow-shot-duration": {value: String(duration), min: model === "h3" ? "5" : "1", max: model === "h3" ? "15" : "20"},
    "#workflow-shot-count": {value: String(count)}
  };
  const context = vm.createContext({
    window: {setInterval() {return 1;}, clearInterval() {}},
    storyboardBusy: false,
    workflowPlanStory: { disabled: false, textContent: "" },
    workflowStoryStatus: status,
    workflowTextModel: { value: "local-model" },
    videoModelChoice: { value: model },
    workflowShots: { children },
    workflowPanel: { querySelectorAll: () => [disabledControl, enabledControl] },
    document: { querySelector: selector => timingControls[selector] },
    t: key => key,
    updateGenerateAvailability() {},
    updateWorkflowMusicPromptVisibility() {},
    updateWorkflowShotNumbers() {},
    addWorkflowShot(shot) { children.push(makeShot(shot)); },
    async fetch(url, options) {
      requests.push({ url, payload: JSON.parse(options.body) });
      return { ok, json: async () => response };
    }
  });
  vm.runInContext(planner, context);
  return {
    context, children, status, requests, disabledControl, enabledControl, timingControls,
    run: () => vm.runInContext("planWorkflowStory()", context)
  };
}

test("replaces all shots but retains first opening-frame settings and restores controls", async () => {
  const existing = { title: "Existing", prompt: "Keep this scene", first_frame_id: "image-id" };
  const harness = makeHarness({ shots: [existing, { title: "", prompt: "" }] });
  const first = harness.children[0];
  await harness.run();
  assert.equal(harness.children.length, 2);
  assert.equal(harness.children[0], first);
  assert.equal(first.querySelector("[data-shot-title]").value, generated.title);
  assert.equal(first.querySelector("[data-shot-frame]").value, "image-id");
  assert.equal(first.dataset.firstFrameUrl, "saved.png");
  assert.equal(harness.timingControls["#workflow-story-progress"].hidden, true);
  assert.equal(harness.requests[0].url, "/api/storyboards");
  assert.equal(harness.requests[0].payload.model, "local-model");
  assert.equal(harness.requests[0].payload.target_model, "h3");
  assert.equal(harness.requests[0].payload.total_duration, 16);
  assert.equal(harness.requests[0].payload.shot_duration, 8);
  assert.equal(harness.status.textContent, "storyboardAdded");
  assert.equal(harness.disabledControl.disabled, true);
  assert.equal(harness.enabledControl.disabled, false);
  assert.equal(harness.context.storyboardBusy, false);
});

test("calculates counts and refuses non-divisible or excessive timing", async () => {
  for (const duration of [5, 7, 8, 11, 13, 15]) {
    const harness = makeHarness({duration, total: duration * 48});
    vm.runInContext("updateStoryboardTiming()", harness.context);
    assert.equal(harness.timingControls["#workflow-shot-count"].value, "48");
  }
  for (const total of [0, 65, 8.5, 1808, 721]) {
    const harness = makeHarness({total});
    await harness.run();
    assert.equal(harness.requests.length, 0);
    assert.equal(harness.status.textContent, "storyboardTimingInvalid");
  }
});

test("thirty-minute boundary supports 1800 one-second LTX shots and rejects overflow", async () => {
  const harness = makeHarness({model: "ltx-2.3-distilled-q4", duration: 1, total: 1800});
  vm.runInContext("updateStoryboardTiming()", harness.context);
  assert.equal(harness.timingControls["#workflow-shot-count"].value, "1800");
  const overflow = makeHarness({model: "ltx-2.3-distilled-q4", duration: 1, total: 1801});
  await overflow.run();
  assert.equal(overflow.requests.length, 0);
  const oldBoundary = makeHarness({duration: 8, total: 392});
  vm.runInContext("updateStoryboardTiming()", oldBoundary.context);
  assert.equal(oldBoundary.timingControls["#workflow-shot-count"].value, "49");
  const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
  assert.match(html, /id="workflow-total-duration"[^>]*max="1800"/);
  assert.match(html, /id="workflow-shot-count"[^>]*max="1800"/);
});

test("LTX planning accepts every supported whole second and passes the video target without Skills", async () => {
  for (const duration of [1, 4, 16, 19, 20]) {
    const harness = makeHarness({model: "ltx-2.3-distilled-q4", duration,
      total: duration * 2, response: {shots: [{...generated, duration}, {...generated, duration}]}});
    await harness.run();
    assert.equal(harness.requests[0].payload.target_model, "ltx-2.3-distilled-q4");
    assert.equal(harness.requests[0].payload.shot_duration, duration);
  }
  for (const duration of [0, 20.1, 21, 7.5]) {
    const harness = makeHarness({model: "ltx-2.3-distilled-q4", duration, total: 40});
    await harness.run();
    assert.equal(harness.requests.length, 0);
  }
});

test("invalid or failed responses never change existing shots", async () => {
  for (const options of [
    { response: { shots: [generated] } },
    { response: { shots: [generated, { ...generated, music_prompt: "" }] } },
    { response: { shots: [generated, { ...generated, duration: 5 }] } },
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

test("timing controls are read-only computed and localized for every supported language", () => {
  const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
  assert.match(html, /id="workflow-shot-count"[^>]*readonly/);
  const context = vm.createContext({});
  vm.runInContext(source.slice(source.indexOf("const storyboardTimingKeys ="),
    source.indexOf("const storyboardTranslations =")) +
    "\nthis.timingTranslations = storyboardTimingTranslations;", context);
  assert.equal(Object.keys(context.timingTranslations).length, 14);
  for (const strings of Object.values(context.timingTranslations)) {
    assert.equal(strings.length, 4);
    assert.ok(strings.every(value => typeof value === "string" && value.length > 0));
  }
});

test("story planner is a default-open native disclosure with the existing localized title", () => {
  const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
  const panel = html.match(/<details id="workflow-storyboard-settings"[^>]*>[\s\S]*?<\/details>/)?.[0];
  assert.ok(panel);
  assert.match(panel, /^<details[^>]*\bopen>/);
  assert.match(panel, /<summary><span data-i18n="storyboardTitle">/);
  assert.match(panel, /class="music-fold-icon" aria-hidden="true"/);
  assert.match(panel, /id="workflow-story"/);
  assert.match(panel, /id="workflow-story-status"/);
});

test("long-form and MV storyboard settings contain their generation parameters", () => {
  const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
  const workflow = html.match(/<details id="workflow-storyboard-settings"[^>]*>[\s\S]*?<\/details>/)?.[0];
  const mvStart = html.indexOf('<details id="mv-storyboard-settings"');
  const mvEnd = html.indexOf('</details>\n              <section class="mv-storyboard-results">', mvStart);
  const mv = html.slice(mvStart, mvEnd);
  assert.ok(workflow);
  assert.ok(mvStart >= 0 && mvEnd > mvStart);
  for (const id of ["workflow-aspect", "workflow-video-quality", "workflow-shot-mode"]) {
    assert.match(workflow, new RegExp(`id="${id}"`));
    assert.doesNotMatch(html.slice(html.indexOf("</details>", html.indexOf(`id="${id}"`)) + 10), new RegExp(`id="${id}"`));
  }
  for (const id of ["mv-aspect", "mv-video-quality", "mv-start", "mv-end", "mv-shot-seconds"]) {
    assert.match(mv, new RegExp(`id="${id}"`));
  }
  for (const id of ["mv-workflow-list", "mv-shots"]) assert.doesNotMatch(mv, new RegExp(`id="${id}"`));
  const mvIds = [...html.matchAll(/\bid="(mv-[^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(mvIds).size, mvIds.length);
  assert.ok(html.indexOf('id="workflow-name"') > html.indexOf('id="workflow-title"'));
});

test("workflow extras follow the story and start collapsed", () => {
  const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
  const story = html.indexOf('id="workflow-story"');
  const negativeSlot = html.indexOf('id="workflow-negative-prompt-slot"');
  const visualSlot = html.indexOf('id="workflow-visual-references-slot"');
  assert.ok(story < negativeSlot);
  assert.ok(negativeSlot < visualSlot);
  assert.doesNotMatch(html.slice(negativeSlot, visualSlot), /\bopen\b/);
  const prompts = readFileSync(new URL("../webapp/static/video-prompts.js", import.meta.url), "utf8");
  const references = readFileSync(new URL("../webapp/static/visual-references.js", import.meta.url), "utf8");
  assert.match(prompts, /box\.open = false/);
  assert.match(references, /container\.open = false/);
});

test("video negative prompt follows the visual description and starts collapsed", () => {
  const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
  const css = readFileSync(new URL("../webapp/static/app.css", import.meta.url), "utf8");
  const prompt = html.indexOf('id="prompt"');
  const negativeSlot = html.indexOf('id="video-negative-prompt-slot"');
  const enhancer = html.indexOf('class="prompt-enhancer"');
  assert.ok(prompt < negativeSlot);
  assert.ok(negativeSlot < enhancer);
  assert.match(css, /\.workflow-collapsible, \.native-negative-field\[data-scope\] \{[^}]*margin-bottom: 16px;/);
  const prompts = readFileSync(new URL("../webapp/static/video-prompts.js", import.meta.url), "utf8");
  assert.match(prompts, /box\.open = false/);
  assert.match(prompts, /`\#\$\{scope\}-negative-prompt-slot`/);
  assert.match(prompts, /box\.hidden = mode !== "video"/);
  const app = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
  assert.match(app, /MiniMuvVideoPrompts\?\.setMode\(activeMode\)/);
});

test("MV extras follow the creative direction and start collapsed", () => {
  const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
  const direction = html.indexOf('id="mv-prompt"');
  const negativeSlot = html.indexOf('id="mv-negative-prompt-slot"');
  const visualSlot = html.indexOf('id="mv-visual-references-slot"');
  const enhancer = html.indexOf('class="prompt-enhancer mv-prompt-enhancer"');
  assert.ok(direction < negativeSlot);
  assert.ok(negativeSlot < visualSlot);
  assert.ok(visualSlot < enhancer);
  const prompts = readFileSync(new URL("../webapp/static/video-prompts.js", import.meta.url), "utf8");
  const references = readFileSync(new URL("../webapp/static/visual-references.js", import.meta.url), "utf8");
  assert.match(prompts, /box\.open = false/);
  assert.match(references, /scope === "workflow" \|\| scope === "mv"/);
  assert.match(references, /container\.open = false/);
});

test("replacement count ignores existing shot count", async () => {
  const harness = makeHarness({
    shots: Array.from({ length: 47 }, () => ({ title: "Existing", prompt: "Scene" })),
    count: 2
  });
  await harness.run();
  assert.equal(harness.requests.length, 1);
  assert.equal(harness.children.length, 2);
});

test("invalid model output recommends switching models without changing existing shots", async () => {
  const harness = makeHarness({shots: [{title: "Keep", prompt: "Scene"}],
    response: {shots: []}});
  await harness.run();
  assert.match(harness.status.textContent, /storyboardModelLimited/);
  assert.equal(harness.children[0].querySelector("[data-shot-title]").value, "Keep");
  assert.equal(harness.timingControls["#workflow-story-progress"].hidden, true);
});

test("waiting exposes indeterminate progress and elapsed status, then clears it", async () => {
  const harness = makeHarness();
  let tick;
  let cleared = false;
  harness.context.window.setInterval = callback => {tick = callback; return 12;};
  harness.context.window.clearInterval = id => {cleared = id === 12;};
  let complete;
  harness.context.fetch = () => new Promise(resolve => {complete = resolve;});
  const pending = harness.run();
  assert.equal(harness.timingControls["#workflow-story-progress"].hidden, false);
  tick();
  assert.match(harness.status.textContent, /workflowElapsed/);
  complete({ok: true, json: async () => ({shots: [generated, generated]})});
  await pending;
  assert.equal(cleared, true);
  assert.equal(harness.timingControls["#workflow-story-progress"].hidden, true);
});

test("replacement hints override the storyboard translation table in fourteen languages", () => {
  const table = Object.fromEntries(["zh-CN", "zh-TW", "en", "fr", "de", "ja", "ko",
    "es", "pt", "tr", "ar", "vi", "id", "ru"].map(lang => [lang, {}]));
  const context = vm.createContext({storyboardTranslations: table});
  vm.runInContext(source.slice(source.indexOf("const storyboardReplacementTranslations ="),
    source.indexOf("const workflowLiveKeys =")), context);
  for (const labels of Object.values(table)) {
    assert.equal(Object.keys(labels).length, 5);
    assert.ok(labels.storyboardModelLimited.length > 0);
  }
  assert.match(table["zh-CN"].storyboardGenerate, /替换/);
});
