import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const restoreSource = source.slice(source.indexOf("function restoreHistoryControl("),
  source.indexOf("function renderHistory("));

function harness() {
  const controls = new Map();
  const selectIds = ["#aspect", "#video-quality", "#music-lyrics-mode", "#image-quality", "#image-candidate-count"];
  for (const id of [...selectIds, "#duration", "#steps", "#music-duration", "#music-steps", "#seed", "#image-seed", "#music-seed", "#music-lyrics",
    "#prompt-count", "#history-restore-status", "#image-size", "#image-aspect",
    "#image-quality", "#image-candidate-count"]) {
    const control = {
      tagName: selectIds.includes(id) ? "SELECT" : "INPUT", value: "current",
      options: [{ value: "current", dataset: {} }], dataset: {}, hidden: true,
      add(option) {
        option.remove = () => { this.options.splice(this.options.indexOf(option), 1); };
        this.options.push(option);
      },
      querySelectorAll() { return this.options.filter(option => option.dataset.historyOption); }
    };
    controls.set(id, control);
  }
  const frame = { dataset: { firstFrameId: "prior-image" } };
  controls.set("#video-first-frame", frame);
  const rendered = [];
  const alerts = [];
  const context = vm.createContext({
    historyDeleteBusy: false, firstFrameBusy: false, storyboardBusy: false, promptEnhancementBusy: false,
    currentJob: null, currentWorkflow: null, pollTimer: 123, activeMode: "workflow",
    videoModelChoice: { value: "ltx-2.3-distilled-q4" }, imageModelChoice: { value: "flux2-klein-4b" }, musicModelChoice: { value: "music3" },
    modelInfo: null, updateLocalModelControls() {}, syncMusicKeywords() {},
    promptInput: { value: "Old prompt" }, projectNameInput: { value: "Old name" }, turboToggle: { checked: true },
    promptEnhancerResult: { hidden: false },
    document: { querySelector: id => controls.get(id) },
    localStorage: { setItem() {} }, window: { clearTimeout() {}, alert: message => alerts.push(message) },
    Option: function(text, value) { return { text, value, dataset: {} }; },
    updateTurboSteps() { controls.get("#steps").value = "4"; },
    updateMusicLyricsMode() {}, refreshWorkflowFirstFrames() {},
    setPromptEnhancerStatus() {}, renderHistory() {}, renderJob: job => rendered.push(job),
    t: key => key,
  });
  vm.runInContext(restoreSource, context);
  return { context, controls, frame, rendered, alerts, restore: item => context.restoreHistoryItem(item) };
}

test("video restores all controls, non-preset steps and saved opening frame", () => {
  const h = harness();
  h.restore({ id: "video-id", kind: "video", name: "Scene one", prompt: "Portrait scene", first_frame_url: "/snapshot",
    generation: { duration: 10, aspect: "9:16", steps: 24, seed: 99, turbo: false, first_frame_id: "frame-id" } });
  assert.equal(h.context.activeMode, "video");
  assert.equal(h.context.promptInput.value, "Portrait scene");
  assert.equal(h.context.projectNameInput.value, "Scene one");
  assert.equal(h.controls.get("#prompt-count").textContent, "14 / 4000");
  assert.equal(h.controls.get("#steps").value, "24");
  assert.equal(h.controls.get("#steps").tagName, "INPUT");
  assert.equal(h.controls.get("#duration").value, "10");
  assert.equal(h.controls.get("#aspect").value, "9:16");
  assert.equal(h.controls.get("#seed").value, "99");
  assert.equal(h.context.turboToggle.checked, false);
  assert.equal(h.context.videoModelChoice.value, "h3");
  assert.equal(h.controls.get("#video-quality").value, "standard");
  assert.equal(h.frame.dataset.firstFrameId, "frame-id");
  assert.equal(h.frame.dataset.firstFrameUrl, "/snapshot");
  assert.equal(h.context.promptEnhancerResult.hidden, true);
  assert.equal(h.controls.get("#history-restore-status").textContent, "historyRestored");
  assert.equal(h.context.pollTimer, null);
});

test("text-only video clears an earlier first-frame selection", () => {
  const h = harness();
  h.restore({ kind: "video", prompt: "Text-only film", generation: {
    duration: 5, aspect: "16:9", steps: 4, seed: 0, turbo: true, first_frame_id: "" } });
  assert.equal(h.frame.dataset.firstFrameId, "");
  assert.equal(h.frame.dataset.firstFrameUrl, "");
});

test("image restores only its own seed; music restores lyrics and non-preset controls", () => {
  const h = harness();
  h.restore({ kind: "image", prompt: "Forest", generation: { seed: 777 } });
  assert.equal(h.context.activeMode, "image");
  assert.equal(h.context.imageModelChoice.value, "hidream");
  assert.equal(h.controls.get("#image-seed").value, "777");
  assert.equal(h.controls.get("#image-quality").value, "custom");
  assert.equal(h.controls.get("#image-candidate-count").value, "1");
  assert.equal(h.controls.get("#seed").value, "current");
  h.restore({ kind: "music", prompt: "Song", generation: {
    duration: 45, steps: 25, seed: 333, lyrics_mode: "lyrics", lyrics: "[verse]\nHome" } });
  assert.equal(h.context.activeMode, "music");
  assert.equal(h.controls.get("#music-duration").value, "45");
  assert.equal(h.controls.get("#music-duration").tagName, "INPUT");
  assert.equal(h.controls.get("#music-steps").value, "25");
  assert.equal(h.controls.get("#music-lyrics").value, "[verse]\nHome");
  assert.equal(h.controls.get("#music-lyrics-mode").value, "lyrics");
  assert.equal(h.controls.get("#image-seed").value, "777");
});

test("local history restores the selected model and image resolution", () => {
  const h = harness();
  h.restore({ kind: "image", prompt: "Forest", generation: {
    model: "z-image-turbo", seed: 42, width: 768, height: 768,
    quality: "custom", candidate_count: 4 } });
  assert.equal(h.context.imageModelChoice.value, "z-image-turbo");
  assert.equal(h.controls.get("#image-size").value, "768");
  assert.equal(h.controls.get("#image-candidate-count").value, "4");
  h.restore({ kind: "video", prompt: "Ocean", generation: {
    model: "ltx-2.3-distilled-q8", duration: 5, steps: 8, turbo: true } });
  assert.equal(h.context.videoModelChoice.value, "ltx-2.3-distilled-q8");
  assert.equal(h.controls.get("#video-quality").value, "preview");
  h.restore({kind:"video", prompt:"Ocean", generation:{model:"ltx-2.3-distilled-q8", quality:"high"}});
  assert.equal(h.controls.get("#video-quality").value, "high");
  assert.equal(h.controls.get("#steps").value, "8");
  h.restore({ kind: "video", generation: null });
  assert.equal(h.context.videoModelChoice.value, "h3");
});

test("legacy entries do not invent settings or erase existing text when prompt is absent", () => {
  const h = harness();
  h.restore({ kind: "video", prompt: "Legacy film", generation: null });
  assert.equal(h.context.promptInput.value, "Legacy film");
  assert.equal(h.context.projectNameInput.value, "");
  assert.equal(h.controls.get("#steps").value, "current");
  assert.equal(h.frame.dataset.firstFrameId, "prior-image");
  assert.equal(h.controls.get("#history-restore-status").textContent, "historyLegacy");
  h.restore({ kind: "image", prompt: "", generation: null });
  assert.equal(h.context.promptInput.value, "Legacy film");
  assert.equal(h.controls.get("#image-seed").value, "current");
});

test("active generation, workflows, uploads and text operations are not disrupted", () => {
  for (const busy of [{ firstFrameBusy: true }, { storyboardBusy: true },
    { promptEnhancementBusy: true }, { currentJob: { status: "running" } },
    { currentWorkflow: { status: "queued" } }]) {
    const h = harness();
    Object.assign(h.context, busy);
    h.restore({ kind: "video", prompt: "Do not restore", generation: {} });
    assert.equal(h.context.promptInput.value, "Old prompt");
    assert.equal(h.context.activeMode, "workflow");
    assert.deepEqual(h.alerts, ["errRunning"]);
    assert.equal(h.rendered.length, 0);
  }
});

test("arbitrary numeric settings restore directly without accumulating options", () => {
  const h = harness();
  h.context.restoreHistoryControl("#steps", 24);
  h.context.restoreHistoryControl("#steps", 32);
  assert.equal(h.controls.get("#steps").value, "32");
  assert.equal(h.controls.get("#steps").options.length, 1);
  h.context.restoreHistoryControl("#duration", 13);
  h.context.restoreHistoryControl("#music-duration", 299);
  assert.equal(h.controls.get("#duration").value, "13");
  assert.equal(h.controls.get("#music-duration").value, "299");
});
