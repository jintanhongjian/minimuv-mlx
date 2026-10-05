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
    historyItems: [{id: "item", kind: "music", prompt: "Ballad", created_at: 1}],
    historyFilter: "all", historyCount: {}, historyList: list, historyStatus: {},
    currentJob: null, historyDeleteBusy: false, languageSelect: {value: "en"},
    t: key => key, document: {createElement: element}, formatGenerationMetrics: () => "",
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
  assert.match(styles, /\.history-list \{[^}]*grid-auto-rows: 66px;[^}]*align-content: start;[^}]*gap: 7px;[^}]*height: calc\(10 \* 66px \+ 9 \* 7px\);[^}]*overflow: auto;/);
});
