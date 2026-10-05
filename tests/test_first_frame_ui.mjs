import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const functions = source.slice(source.indexOf("async function uploadWorkflowFirstFrame("),
  source.indexOf("function showWorkflowMessage("));

function harness({ ok = true, file = { name: "local.png", size: 100 }, pending = false, video = false } = {}) {
  const id = "5821c2b5-6b94-558a-a3c8-7ce59487a121";
  const input = { files: [file], value: "local.png", disabled: false };
  const select = { value: "old", replaceChildren(...options) { this.options = options; } };
  const status = { hidden: true, classList: { add() {}, remove() {} } };
  const preview = { removeAttribute() {} };
  const controls = [input, { disabled: true }, { disabled: false }];
  const card = { id: video ? "video-first-frame" : "", dataset: { firstFrameId: "old" }, querySelector(selector) {
    return ({ "[data-shot-upload]": input, "[data-shot-frame]": select,
      "[data-shot-upload-status]": status, "[data-shot-frame-preview]": preview })[selector];
  } };
  const otherCard = { dataset: { firstFrameId: "" }, querySelector(selector) {
    return selector === "[data-shot-frame]" ? { value: "", replaceChildren() {} } : { removeAttribute() {} };
  } };
  let resolve;
  const context = vm.createContext({
    firstFrameBusy: false, storyboardBusy: false, currentWorkflow: null,
    historyItems: [{ kind: "image", id: "old", image_url: "/old.png", prompt: "Existing" }],
    workflowPanel: { querySelectorAll: () => controls },
    form: { querySelectorAll: () => controls },
    document: { querySelector: () => video ? card : otherCard, querySelectorAll: () => [] },
    updateGenerateAvailability() {},
    workflowShots: { querySelectorAll: () => video ? [otherCard] : [card] },
    Option: function(text, value) { return { text, value }; }, t: key => key,
    fetch: async () => {
      if (pending) await new Promise(done => { resolve = done; });
      return { ok, json: async () => ({ id, image_url: `/api/first-frames/${id}`, error: "invalid_first_frame" }) };
    }
  });
  vm.runInContext(functions, context);
  return { context, card, select, input, controls, status, preview, id,
    run: () => context.uploadWorkflowFirstFrame(card), release: () => resolve() };
}

test("upload selects the local image without removing history or text-only choices", async () => {
  const h = harness();
  await h.run();
  assert.equal(h.select.value, h.id);
  assert.deepEqual(Array.from(h.select.options, option => option.value), ["", h.id, "old"]);
  assert.equal(h.preview.src, `/api/first-frames/${h.id}`);
  h.select.value = "";
  h.context.updateWorkflowFirstFramePreview(h.card);
  assert.equal(h.preview.hidden, true);
  assert.equal(h.input.value, "");
  assert.deepEqual(h.controls.map(control => control.disabled), [false, true, false]);
});

test("failed upload keeps the prior image and reports an error", async () => {
  const h = harness({ ok: false });
  await h.run();
  assert.equal(h.card.dataset.firstFrameId, "old");
  assert.match(h.status.textContent, /firstFrameUploadFailed/);
  assert.equal(h.context.firstFrameBusy, false);
});

test("upload locks workflow controls until the request completes", async () => {
  const h = harness({ pending: true });
  const request = h.run();
  assert.equal(h.context.firstFrameBusy, true);
  assert.ok(h.controls.every(control => control.disabled));
  h.release();
  await request;
  assert.deepEqual(h.controls.map(control => control.disabled), [false, true, false]);
});

test("oversized input is rejected without altering selection", async () => {
  const h = harness({ file: { name: "huge.png", size: 20 * 1024 * 1024 + 1 } });
  await h.run();
  assert.equal(h.select.value, "old");
  assert.match(h.status.textContent, /firstFrameUploadFailed/);
});

test("standalone first frame uses the same upload and retains its own selection", async () => {
  const h = harness({ video: true });
  h.context.currentWorkflow = { status: "completed" };
  await h.run();
  assert.equal(h.select.value, h.id);
  assert.equal(h.preview.src, `/api/first-frames/${h.id}`);
  assert.equal(h.context.firstFrameBusy, false);
});

test("saved snapshot is preferred over upload cache when both are available", async () => {
  const h = harness();
  await h.run();
  h.card.dataset.savedFirstFrameId = h.id;
  h.card.dataset.firstFrameUrl = "/api/workflows/snapshot";
  h.context.updateWorkflowFirstFramePreview(h.card);
  assert.equal(h.preview.src, "/api/workflows/snapshot");
});

test("only video submissions contain a first-frame ID", async () => {
  const submitSource = source.slice(source.indexOf('form.addEventListener("submit"'),
    source.indexOf('cancelButton.addEventListener("click"'));
  for (const mode of ["video", "image", "music"]) {
    let submit;
    let request;
    const context = vm.createContext({
      activeMode: mode, promptEnhancementBusy: false, firstFrameBusy: false, storyboardBusy: false,
      promptInput: { value: "Opening" }, projectNameInput: { value: "" }, generateButton: {}, pollTimer: null,
      videoModelChoice: { value: "h3" }, imageModelChoice: { value: "hidream" }, musicModelChoice: { value: "music3" },
      form: { addEventListener(event, callback) { submit = callback; } },
      musicLyricsMode: { value: "instrumental" }, musicLyricsInput: { value: "[instrumental]" },
      videoFirstFrame: { querySelector: () => ({ value: "local-id" }) },
      document: { querySelector: selector => ({ value: selector === "#aspect" ? "16:9" : "5", checked: true }) },
      window: { clearTimeout() {}, setTimeout() {}, alert(message) { assert.fail(message); } },
      renderJob() {}, refreshCurrentJob() {}, updateGenerateAvailability() {},
      async fetch(url, options) {
        request = { url, payload: JSON.parse(options.body) };
        return { ok: true, json: async () => ({ job: {} }) };
      }
    });
    vm.runInContext(source.slice(source.indexOf("function isYueMusicModel()"),
      source.indexOf("function selectedMusicStatus(")), context);
    vm.runInContext(submitSource, context);
    await submit({ preventDefault() {} });
    assert.equal(request.url, mode === "image" ? "/api/image-jobs" : mode === "music" ? "/api/music-jobs" : "/api/jobs");
    if (mode === "video") assert.equal(request.payload.first_frame_id, "local-id");
    else assert.equal(Object.hasOwn(request.payload, "first_frame_id"), false);
  }
});

test("submission is blocked while a first-frame upload is in flight", async () => {
  let submit;
  const context = vm.createContext({
    promptEnhancementBusy: false, firstFrameBusy: true, storyboardBusy: false,
    form: { addEventListener(event, callback) { submit = callback; } },
    fetch() { assert.fail("Submission must not race the upload"); }
  });
  vm.runInContext(source.slice(source.indexOf('form.addEventListener("submit"'),
    source.indexOf('cancelButton.addEventListener("click"')), context);
  await submit({ preventDefault() {} });
});
