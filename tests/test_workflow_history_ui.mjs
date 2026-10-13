import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
const render = source.slice(source.indexOf("function renderHistory()"),
  source.indexOf("async function deleteHistoryItem("));

function harness() {
  const node = () => ({
    children: [], attributes: {}, listeners: {},
    append(...items) {this.children.push(...items);},
    replaceChildren() {this.children = [];},
    setAttribute(key, value) {this.attributes[key] = value;},
    addEventListener(key, fn) {this.listeners[key] = fn;}
  });
  const actions = node();
  const calls = [];
  const context = vm.createContext({
    window: {},
    historyItems: [{id: "video", kind: "video", created_at: 1, prompt: "clip"}],
    workflowItems: [
      {id: "draft", name: "Draft", status: "draft", created_at: 3, total_duration: 5, shots: [{}]},
      {id: "running", name: "Running", status: "running", created_at: 2, total_duration: 10, shots: [{}, {}]}
    ],
    mvProjects: [], currentMV: null, mvBusy: false,
    historyFilter: "all", historyCount: node(), historyList: node(), historyStatus: node(),
    currentJob: null, currentWorkflow: {id: "draft"}, historyDeleteBusy: false,
    languageSelect: {value: "en"}, t: key => key, formatGenerationMetrics: () => "",
    document: {createElement: node, querySelector: () => actions},
    workflowModeButton: {click() {calls.push("workflow-mode");}},
    fetchWorkflow: id => calls.push(id),
    requestWorkflowDeletion: items => calls.push(items.map(item => item.id)),
    restoreHistoryItem: item => calls.push(item.id),
    deleteHistoryItem: item => calls.push(`delete:${item.id}`),
    openMVProject: item => {calls.push(`mv:${item.id}`); return true;},
    activeMode: "video", mvModeButton: {click() {context.activeMode = "mv"; calls.push("mv-mode");}}
  });
  vm.runInContext(render, context);
  return {context, actions, calls};
}

test("saved workflows join All history in time order and filter as long video", () => {
  const {context, actions} = harness();
  context.renderHistory();
  assert.equal(context.historyList.children.length, 3);
  assert.equal(actions.hidden, true);
  assert.match(context.historyList.children[0].children[0].className, /selected/);
  context.historyFilter = "workflow";
  context.renderHistory();
  assert.equal(context.historyList.children.length, 2);
  assert.equal(actions.hidden, false);
  const card = context.historyList.children[0].children[0];
  assert.equal(card.children[1].children[0].children[0].textContent, "modeWorkflow");
  assert.equal(card.children[1].children[0].children[1].textContent, "workflowStatusDraft");
  context.historyFilter = "video";
  context.renderHistory();
  assert.equal(context.historyList.children.length, 1);
});

test("podcast history opens the saved editor and stays separate from other categories", () => {
  const {context, calls} = harness();
  context.window.MiniMuvPodcast = {
    active: () => false,
    history: () => [{id: "episode", name: "Episode", created_at: 4, segments: [{}]}],
    preview: () => ({id: "episode"}), open: id => calls.push(`podcast:${id}`)
  };
  context.historyFilter = "podcast";
  context.renderHistory();
  const row = context.historyList.children[0];
  assert.equal(context.historyList.children.length, 1);
  assert.equal(row.children[0].attributes["aria-pressed"], "true");
  row.children[0].listeners.click();
  assert.deepEqual(calls, ["podcast:episode"]);
});

test("workflow cards open editor and keep workflow-specific media deletion confirmation", () => {
  const {context, calls} = harness();
  context.historyFilter = "workflow";
  context.renderHistory();
  const [open, remove] = context.historyList.children[0].children;
  open.listeners.click();
  remove.listeners.click();
  assert.deepEqual(calls.slice(0, 2), ["workflow-mode", "draft"]);
  assert.deepEqual(Array.from(calls[2]), ["draft"]);
  assert.equal(context.historyList.children[1].children[1].disabled, true);
});

test("history category reuses fourteen-language long-video label and removes old list", () => {
  assert.match(html, /data-history-filter="workflow"[^>]*data-i18n="modeWorkflow"/);
  assert.doesNotMatch(html, /id="workflow-list"/);
  assert.match(html, /id="workflow-history-actions"[^>]*hidden/);
  assert.match(source, /requestWorkflowDeletion\(workflowItems\)/);
  assert.ok(html.indexOf('id="workflow-delete-dialog"') > html.indexOf('id="history-list"'));
});

test("workflow polling updates card status without rebuilding history for log-only progress", () => {
  const manifest = {id: "one", status: "running", name: "One", total_duration: 5, shots: [{}]};
  let renders = 0;
  const context = vm.createContext({
    workflowItems: [manifest], currentWorkflow: manifest,
    renderHistory() {renders += 1;}
  });

  test("MV drafts join All and their own category, open safely and remain distinct from video", () => {
    const {context, calls, actions} = harness();
    context.mvProjects = [{id: "mv", name: "Music video", created_at: 4, status: "draft"}];
    context.currentMV = {id: "mv"};
    context.renderHistory();
    assert.equal(context.historyList.children.length, 4);
    const [open, remove] = context.historyList.children[0].children;
    assert.match(open.className, /selected/);
    assert.equal(open.children[0].textContent, "MV");
    assert.equal(open.children[1].children[0].children[0].textContent, "modeMV");
    assert.equal(open.children[1].children[0].children[1].textContent, "workflowStatusDraft");
    open.listeners.click();
    remove.listeners.click();
    assert.deepEqual(calls, ["mv:mv", "mv-mode", "delete:mv"]);
    assert.equal(context.activeMode, "mv");
    context.historyFilter = "mv";
    context.renderHistory();
    assert.equal(context.historyList.children.length, 1);
    assert.equal(actions.hidden, true);
    context.activeMode = "video";
    context.openMVProject = () => false;
    context.historyList.children[0].children[0].listeners.click();
    assert.equal(context.activeMode, "video");
    context.mvBusy = true;
    context.renderHistory();
    assert.equal(context.historyList.children[0].children[0].disabled, true);
    assert.equal(context.historyList.children[0].children[1].disabled, true);
    assert.match(html, /data-history-filter="mv"[^>]*data-i18n="modeMV"/);
  });
  const start = source.indexOf("function renderWorkflow(manifest)");
  const end = source.indexOf("  [...workflowShots.children]", start);
  vm.runInContext(`${source.slice(start, end)}}`, context);
  context.renderWorkflow({...manifest, logs: ["Denoising: 1/8"]});
  assert.equal(renders, 0);
  assert.equal(context.workflowItems[0].logs[0], "Denoising: 1/8");
  context.renderWorkflow({...manifest, status: "completed"});
  assert.equal(renders, 1);
  context.currentWorkflow = null;
  context.renderWorkflow({...manifest, status: "completed"});
  assert.equal(renders, 2);
});
