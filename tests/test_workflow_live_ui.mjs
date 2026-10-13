import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const operations = source.slice(source.indexOf("function workflowProgressText("),
  source.indexOf("async function submitWorkflowAction("));

function harness() {
  const elements = new Map();
  const element = selector => {
    if (!elements.has(selector)) elements.set(selector, {
      textContent: "", checked: false, disabled: false, returnValue: "cancel",
      showModal() {this.open = true;}
    });
    return elements.get(selector);
  };
  const timers = [];
  const requests = [];
  const messages = [];
  let rebuilt = 0;
  let rendered = 0;
  let cleared = 0;
  const context = vm.createContext({
    currentWorkflow: {id: "one", status: "running"},
    workflowFetchVersion: 0, workflowPollTimer: null,
    workflowDeletion: null, storyboardBusy: false, firstFrameBusy: false,
    workflowDeleteLastShot: null, workflowStructureBusy: false, workflowStageBusy: false,
    workflowShots: {children: [{}, {}], replaceChildren() {this.children = [];}},
    document: {querySelector: element},
    window: {confirm: () => true, clearTimeout() {},
      setTimeout(fn) {timers.push(fn); return timers.length;}},
    t: key => key,
    showWorkflowMessage: (...args) => messages.push(args),
    setWorkflowForm() {rebuilt++;},
    renderWorkflow() {rendered++;},
    updateWorkflowShotNumbers() {}, updateGenerateAvailability() {},
    newWorkflow() {cleared++; context.currentWorkflow = null;},
    logPanel: {}, jobLogs: {}, video: {dataset: {}, pause() {}, removeAttribute() {}},
    resultFooter: {}, loadingState: {}, emptyState: {},
    loadWorkflows: async () => {}, loadHistory: async () => {},
    fetch: async (url, options) => {
      requests.push({url, options});
      return {ok: true, json: async () => ({workflow: {id: "one", status: "running"}})};
    }
  });
  vm.runInContext(operations, context);
  return {context, element, timers, requests, messages,
    rebuilt: () => rebuilt, rendered: () => rendered, cleared: () => cleared};
}

test("poll displays live state without reconstructing shot editors", async () => {
  const h = harness();
  await h.context.fetchWorkflow("one", true);
  assert.equal(h.rebuilt(), 0);
  assert.equal(h.rendered(), 1);
  assert.equal(h.timers.length, 1);
  await h.context.fetchWorkflow("one", false);
  assert.equal(h.rebuilt(), 1);
});

test("poll failures reconnect and never restart generation", async () => {
  const h = harness();
  h.context.fetch = async () => {throw new Error("offline");};
  await h.context.fetchWorkflow("one", true);
  assert.match(h.messages[0][0], /workflowPollRetry/);
  assert.equal(h.timers.length, 1);
});

test("a stale workflow response cannot replace a newer selection", async () => {
  const h = harness();
  let resolve;
  h.context.fetch = () => new Promise(done => {resolve = done;});
  const pending = h.context.fetchWorkflow("one", true);
  h.context.workflowFetchVersion++;
  h.context.currentWorkflow = {id: "two", status: "draft"};
  resolve({ok: true, json: async () => ({workflow: {id: "one", status: "completed"}})});
  await pending;
  assert.equal(h.context.currentWorkflow.id, "two");
  assert.equal(h.rendered(), 0);
});

test("progress distinguishes completed tasks, true sampler steps and retry waiting", () => {
  const h = harness();
  const text = h.context.workflowProgressText({
    status: "running", phase: "video", current_unit: 2, elapsed_seconds: 21.5,
    progress: {completed: 1, total: 3, percent: 33.3}, observed_at: 100, retry_at: 105,
    active_job: {status: "running", segment: {current: 2, total: 3},
      progress: {stage: "denoise", step: 3, total: 8}}
  });
  assert.match(text, /1\/3 \(33.3%\)/);
  assert.match(text, /denoise: 3\/8/);
  assert.match(text, /workflowSegment: 2\/3/);
  assert.match(text, /workflowRetrying: 5s/);
  assert.match(text, /workflowElapsed: 21s/);
});

test("clearing saved shots requires deletion confirmation; cancellation preserves shots", async () => {
  const h = harness();
  h.context.clearWorkflowShots();
  assert.equal(h.context.workflowShots.children.length, 2);
  h.context.currentWorkflow.status = "draft";
  h.context.window.confirm = () => {throw new Error("Saved projects use the media-choice dialog only");};
  h.context.clearWorkflowShots();
  assert.equal(h.context.workflowShots.children.length, 2);
  assert.equal(h.element("#workflow-delete-dialog").open, true);
  await h.context.finishWorkflowDeletion();
  assert.equal(h.context.workflowShots.children.length, 2);
  h.context.currentWorkflow = null;
  h.context.window.confirm = () => true;
  h.context.clearWorkflowShots();
  assert.equal(h.context.workflowShots.children.length, 0);
  assert.equal(h.requests.length, 0);
});

test("deletion defaults to keeping media; cancellation performs no request", async () => {
  const h = harness();
  h.context.requestWorkflowDeletion([{id: "one", name: "<script>", status: "failed", has_media: true}]);
  assert.equal(h.element("#workflow-delete-media").checked, false);
  assert.equal(h.element("#workflow-delete-media").disabled, false);
  assert.match(h.element("#workflow-delete-description").textContent, /<script>/);
  await h.context.finishWorkflowDeletion();
  assert.equal(h.requests.length, 0);
  assert.equal(h.context.workflowDeletion, null);
});

test("batch deletion sends exact selected IDs and explicit media choice", async () => {
  const h = harness();
  h.context.currentWorkflow = {id: "other", status: "draft"};
  h.context.fetch = async (url, options) => {
    h.requests.push({url, options});
    return {ok: true, json: async () => ({deleted: ["one", "two"]})};
  };
  h.context.requestWorkflowDeletion([
    {id: "one", name: "one", status: "failed", has_media: true},
    {id: "two", name: "two", status: "draft", has_media: false}
  ]);
  h.element("#workflow-delete-media").checked = true;
  h.element("#workflow-delete-dialog").returnValue = "delete";
  await h.context.finishWorkflowDeletion();
  assert.equal(h.requests[0].url, "/api/workflows");
  assert.equal(h.requests[0].options.method, "DELETE");
  assert.deepEqual(JSON.parse(h.requests[0].options.body), {ids: ["one", "two"], delete_media: true});
  assert.equal(h.cleared(), 0);
});

test("running workflows block deletion before opening dialog", () => {
  const h = harness();
  h.context.requestWorkflowDeletion([{id: "one", status: "running"}]);
  assert.equal(h.context.workflowDeletion, null);
  assert.match(h.messages[0][0], /workflowDeleteActive/);
  assert.equal(h.element("#workflow-delete-dialog").open, undefined);
});

test("deleting the selected workflow detaches it while preserving the editable storyboard", async () => {
  const h = harness();
  h.context.currentWorkflow = {id: "one", status: "draft"};
  let options;
  h.context.newWorkflow = value => {
    options = value;
    h.context.currentWorkflow = null;
  };
  h.context.fetch = async () => ({ok: true, json: async () => ({deleted: ["one"]})});
  h.context.requestWorkflowDeletion([{id: "one", name: "Film", status: "draft", has_media: true}]);
  h.element("#workflow-delete-dialog").returnValue = "delete";
  await h.context.finishWorkflowDeletion();
  assert.equal(options.preserveShots, true);
  assert.equal(h.context.workflowShots.children.length, 2);
  assert.equal(h.context.currentWorkflow, null);
});

test("shot moves preserve cards, renumber them and automatically save idle workflows", async () => {
  const cards = ["A", "B", "C"].map(id => {
    const fields = new Map();
    return {id, querySelector(selector) {
      if (!fields.has(selector)) fields.set(selector, {
        getAttribute: () => "true", setAttribute() {}
      });
      return fields.get(selector);
    }};
  });
  const container = {
    children: cards,
    insertBefore(card, target) {
      cards.splice(cards.indexOf(card), 1);
      cards.splice(cards.indexOf(target), 0, card);
    }
  };
  for (const card of cards) {
    Object.defineProperties(card, {
      previousElementSibling: {get: () => cards[cards.indexOf(card) - 1]},
      nextElementSibling: {get: () => cards[cards.indexOf(card) + 1]}
    });
  }
  const mode = {value: "continuous"};
  const context = vm.createContext({
    workflowShots: container, currentWorkflow: {status: "draft"},
    document: {querySelector: () => mode},
    storyboardBusy: false, firstFrameBusy: false, t: key => key,
    workflowStructureBusy: false, workflowStageBusy: false, workflowDeletion: null,
    workflowPanel: {querySelectorAll: () => []},
    async submitWorkflowAction() { saved++; }
  });

  test("clearing targets one project and retains its identity after confirmation", async () => {
    const h = harness();
    h.context.currentWorkflow = {id: "one", status: "draft"};
    h.context.clearWorkflowShots();
    assert.equal(h.requests.length, 0);
    h.element("#workflow-delete-dialog").returnValue = "delete";
    h.context.fetch = async (url, options) => {
      h.requests.push({url, options});
      return {ok: true, json: async () => ({workflow: {id: "one", status: "draft", shots: []}})};
    };
    h.context.renderWorkflow = manifest => {h.context.currentWorkflow = manifest;};
    await h.context.finishWorkflowDeletion();
    assert.equal(h.context.workflowShots.children.length, 0);
    assert.equal(h.context.currentWorkflow.id, "one");
    assert.equal(h.requests[0].url, "/api/workflows/one/clear-shots");
    assert.equal(h.requests[0].options.method, "POST");
    assert.deepEqual(JSON.parse(h.requests[0].options.body), {ids: ["one"], delete_media: false});
  });

  test("workflow list toggle preserves collapsed state when called again", () => {
    const attrs = new Map([["aria-expanded", "false"]]);
    const button = {
      getAttribute: key => attrs.get(key),
      setAttribute: (key, value) => attrs.set(key, value)
    };
    const progress = {};
    const context = vm.createContext({
      document: {querySelector: selector => selector === "#workflow-progress-toggle" ? button : progress},
      t: key => key
    });
    vm.runInContext(source.slice(source.indexOf("function updateWorkflowProgressToggle()"),
      source.indexOf("function updateWorkflowProgressToggle()") +
      source.slice(source.indexOf("function updateWorkflowProgressToggle()")).indexOf("\n}")) + "\n}", context);
    context.updateWorkflowProgressToggle();
    assert.equal(progress.hidden, true);
    assert.equal(button.textContent, "+");
    context.updateWorkflowProgressToggle();
    assert.equal(progress.hidden, true);
    attrs.set("aria-expanded", "true");
    context.updateWorkflowProgressToggle();
    assert.equal(progress.hidden, false);
    assert.equal(button.textContent, "−");
    assert.equal(attrs.get("aria-label"), "workflowCollapseSteps");
  });
  let saved = 0;
  vm.runInContext(source.slice(source.indexOf("function updateWorkflowShotNumbers()"),
    source.indexOf("function addWorkflowShot(")), context);
  const c = cards[2];
  await context.moveWorkflowShot(c, "up");
  assert.equal(saved, 1);
  assert.deepEqual(cards.map(card => card.id), ["A", "C", "B"]);
  assert.equal(c.querySelector("[data-shot-frame] option[value='']").textContent, "firstFrameChained");
  mode.value = "independent";
  context.updateWorkflowShotNumbers();
  assert.equal(c.querySelector("[data-shot-frame] option[value='']").textContent, "firstFrameNone");
  assert.equal(c.querySelector("[data-shot-number]").textContent, "workflowShot 2");
  await context.moveWorkflowShot(c, "up");
  assert.equal(c.querySelector('[data-shot-move="up"]').disabled, true);
  await context.moveWorkflowShot(c, "down");
  assert.deepEqual(cards.map(card => card.id), ["A", "C", "B"]);
  context.currentWorkflow.status = "running";
  await context.moveWorkflowShot(c, "down");
  assert.deepEqual(cards.map(card => card.id), ["A", "C", "B"]);
  context.updateWorkflowShotNumbers();
  assert.equal(c.querySelector(".workflow-remove-shot").disabled, true);
});

test("progress and deletion controls are localized in all fourteen languages", () => {
  const context = vm.createContext({workflowTranslations: Object.fromEntries(
    ["zh-CN", "zh-TW", "en", "fr", "de", "ja", "ko", "es", "pt", "tr", "ar", "vi", "id", "ru"].map(l => [l, {}])
  )});
  vm.runInContext(source.slice(source.indexOf("const workflowLiveKeys ="),
    source.indexOf("const imageTranslations =")) +
    "\nthis.live = workflowLiveTranslations; this.deletion = workflowDeleteTranslations;", context);
  assert.equal(Object.keys(context.live).length, 14);
  assert.equal(Object.keys(context.deletion).length, 14);
  for (const values of Object.values(context.live)) assert.equal(values.length, 13);
  for (const values of Object.values(context.deletion)) assert.equal(values.length, 10);
  for (const strings of Object.values(context.workflowTranslations)) {
    assert.ok(Object.values(strings).every(value => typeof value === "string" && value.length > 0));
  }
});
