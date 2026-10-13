import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../webapp/static/app.css", import.meta.url), "utf8");
const deletion = source.slice(source.indexOf("async function deleteHistoryItem("),
  source.indexOf("async function loadHistory("));

function harness({confirmed = true, ok = true, error = "", selected = true} = {}) {
  const calls = [];
  const frame = {dataset: {firstFrameId: "item", savedFirstFrameId: "item", firstFrameUrl: "/snapshot"}};
  const status = {hidden: true, textContent: ""};
  const media = {dataset: {url: "/media"}, pause() {calls.push("pause");},
    removeAttribute() {calls.push("clear");}, load() {}};
  const context = vm.createContext({
    historyDeleteBusy: false, firstFrameBusy: false, currentWorkflow: null,
    mvBusy: false, currentMV: null, mvProjects: [],
    loadMVProjects: async () => {calls.push("mv-reload"); return true;},
    openMVProject() {context.currentMV = null; calls.push("mv-reset");},
    currentJob: selected ? {id: "item", status: "completed"} : null,
    window: {confirm: () => {calls.push("confirm"); return confirmed;}, alert: message => calls.push(message)},
    t: key => key, historyStatus: status,
    renderHistory() {calls.push("render");},
    renderJob() {calls.push("reset-preview");},
    loadHistory: async () => {calls.push("reload");},
    historyList: {querySelectorAll: () => []},
    document: {querySelector: selector => selector === "#video-first-frame" ? frame :
      selector === "#history-restore-status" ? {} : media},
    fetch: async (url, options) => {calls.push([url, options.method]); return {
      ok, json: async () => ok ? {deleted: "item"} : {error}
    };},
  });
  vm.runInContext(deletion, context);
  return {context, calls, frame, status, remove: () => context.deleteHistoryItem({id:"item", kind:"video"})};
}

test("confirmation cancellation does not call the deletion endpoint", async () => {
  const h = harness({confirmed:false});
  await h.remove();
  assert.deepEqual(h.calls, ["confirm"]);
});

test("delete uses DELETE and clears selected preview and first-frame reference", async () => {
  const h = harness();
  await h.remove();
  assert.ok(h.calls.some(call => Array.isArray(call) && call[0] === "/api/history/item" && call[1] === "DELETE"));
  assert.ok(h.calls.includes("pause"));
  assert.ok(h.calls.includes("reset-preview"));
  assert.ok(h.calls.includes("reload"));
  assert.equal(h.context.currentJob, null);
  assert.equal(h.frame.dataset.firstFrameId, "");
  assert.equal(h.status.textContent, "historyDeleted");
  assert.equal(h.context.historyDeleteBusy, false);
});

test("in-use errors retain selection and report failure rather than success", async () => {
  const h = harness({ok:false, error:"history_in_use"});
  await h.remove();
  assert.equal(h.context.currentJob.id, "item");
  assert.equal(h.frame.dataset.firstFrameId, "item");
  assert.match(h.status.textContent, /historyDeleteError.*historyInUse/);
  assert.ok(h.calls.includes("reload"));
  assert.equal(h.context.historyDeleteBusy, false);
});

test("busy generation blocks deletion before confirmation", async () => {
  const h = harness();
  h.context.currentJob.status = "running";
  await h.remove();
  assert.deepEqual(h.calls, ["errRunning"]);
});

test("delete buttons are siblings of restore buttons and translated in fourteen languages", () => {
  const render = source.slice(source.indexOf("function renderHistory("),
    source.indexOf("async function deleteHistoryItem("));
  assert.ok(render.includes("row.append(button, deleteButton)"));
  const context = vm.createContext({});
  vm.runInContext(source.slice(source.indexOf("const historyDeleteKeys ="),
    source.indexOf("const disabledModelTranslations =")), context);
  const translations = vm.runInContext("historyDeleteTranslations", context);
  assert.equal(Object.keys(translations).length, 14);
  for (const labels of Object.values(translations)) {
    assert.equal(labels.length, 6);
    assert.ok(labels.every(label => label.length > 0));
  }
});

test("delete is an accessible cross inside the history card without a separate button border", () => {
  const render = source.slice(source.indexOf("function renderHistory("),
    source.indexOf("async function deleteHistoryItem("));
  function element() {
    return {children: [], attributes: {}, append(...children) {this.children.push(...children);},
      setAttribute(key, value) {this.attributes[key] = value;}, addEventListener() {}};
  }
  const list = element();
  list.replaceChildren = () => {list.children = [];};
  const context = vm.createContext({
    workflowItems: [], currentWorkflow: null, mvProjects: [], currentMV: null, mvBusy: false,
    historyItems: [{id: "item", kind: "music", prompt: "Ballad", created_at: 1}],
    historyFilter: "all", historyCount: {}, historyList: list, historyStatus: {},
    currentJob: null, historyDeleteBusy: false, languageSelect: {value: "en"},
    t: key => key, document: {createElement: element, querySelector: () => ({})}, formatGenerationMetrics: () => "",
  });
  vm.runInContext(render, context);
  context.renderHistory();
  const [restore, remove] = list.children[0].children;
  assert.equal(restore.className, "history-item");
  assert.equal(remove.textContent, "❌");
  assert.equal(remove.title, "historyDelete");
  assert.equal(remove.attributes["aria-label"], "historyDelete · Ballad");
  assert.match(styles, /\.history-row \{ position: relative;/);
  assert.match(styles, /\.history-row \.history-item \{ height: 100%; padding-inline-end: 42px;/);
  assert.match(styles, /\.history-delete \{[^}]*position: absolute;[^}]*inset-inline-end: 6px;[^}]*border: 0;/);
});

test("history list reserves ten complete cards and nine gaps before scrolling", () => {
  assert.match(styles, /\.history-list \{[^}]*--history-card-height: 88px;[^}]*grid-auto-rows: var\(--history-card-height\);[^}]*align-content: start;[^}]*gap: 7px;[^}]*height: calc\(10 \* var\(--history-card-height\) \+ 9 \* 7px\);[^}]*overflow: auto;/);
});

test("history content stays inside cards and truncates long metadata", () => {
  assert.match(styles, /\.history-item \{[^}]*min-height: 0;[^}]*overflow: hidden;/);
  assert.match(styles, /\.history-details \{[^}]*min-height: 0;[^}]*max-height: 100%;[^}]*overflow: hidden;/);
  assert.match(styles, /\.history-date \{[^}]*min-width: 0;[^}]*max-width: 60%;[^}]*overflow: hidden;[^}]*text-overflow: ellipsis;/);
  assert.match(styles, /\.history-prompt \{[^}]*overflow: hidden;[^}]*overflow-wrap: anywhere;[^}]*-webkit-line-clamp: 2;/);
});

test("MV deletion uses its revision endpoint and never clears the source song", async () => {
  const h = harness();
  const project = {id: "mv", kind: "mv", revision: "rev", music_source_id: "item"};
  h.context.mvProjects = [project];
  h.context.currentMV = project;
  h.context.fetch = async (url, options) => {
    h.calls.push([url, options.method, JSON.parse(options.body)]);
    return {ok: true, json: async () => ({deleted: "mv"})};
  };
  await h.context.deleteHistoryItem(project);
  assert.ok(h.calls.some(call => Array.isArray(call) && call[0] === "/api/mv-projects/mv"
    && call[2].revision === "rev"));
  assert.equal(h.context.currentMV, null);
  assert.equal(h.context.currentJob.id, "item");
  assert.equal(h.frame.dataset.firstFrameId, "item");
  assert.ok(h.calls.includes("mv-reload"));
  assert.ok(!h.calls.includes("pause"));
});

test("MV conflict retains the editor and busy save blocks deletion", async () => {
  const h = harness({ok: false, error: "mv_conflict"});
  const project = {id: "mv", kind: "mv", revision: "stale"};
  h.context.currentMV = project;
  await h.context.deleteHistoryItem(project);
  assert.equal(h.context.currentMV, project);
  assert.match(h.status.textContent, /mv_conflict/);
  h.calls.length = 0;
  h.context.mvBusy = true;
  await h.context.deleteHistoryItem(project);
  assert.equal(h.calls.length, 0);
});
