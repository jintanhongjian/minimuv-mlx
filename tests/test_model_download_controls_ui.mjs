import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../webapp/static/app.css", import.meta.url), "utf8");

test("download buttons reuse settings button sizing, theme and disabled styles", () => {
  assert.match(css, /\.settings-actions button,\s*\.model-download-actions button \{[^}]*min-height: 36px;[^}]*border-radius: 6px;[^}]*font-size: 11px;/);
  assert.match(css, /\.settings-actions button:disabled,\s*\.model-download-actions button:disabled \{ opacity: \.55; cursor: wait; \}/);
});

test("settings typography inherits one body scale while JSON retains monospace", () => {
  assert.match(css, /\.settings-dialog \{[^}]*--settings-font-size: 11px;[^}]*font-size: var\(--settings-font-size\)/);
  assert.match(css, /\.settings-group label \{[^}]*font-size: inherit/);
  assert.match(css, /\.settings-group input:not\(\[type="checkbox"\]\), \.settings-group textarea \{[^}]*font: inherit/);
  assert.match(css, /\.settings-group textarea\.settings-json \{[^}]*font-family: ui-monospace/);
  assert.match(css, /\.settings-dialog \.model-download-info p \{[^}]*font-size: var\(--settings-font-size\)/);
});

test("download controls cover all fourteen languages", () => {
  const context = vm.createContext({});
  vm.runInContext(source.match(/const downloadControlKeys = \[[\s\S]*?\];/)[0] +
    source.match(/const downloadControlTranslations = \{[\s\S]*?\n\};/)[0], context);
  const {keys, labels} = vm.runInContext("({ keys: downloadControlKeys, labels: downloadControlTranslations })", context);
  assert.equal(Object.keys(labels).length, 14);
  for (const values of Object.values(labels)) {
    assert.equal(values.length, keys.length);
    assert.ok(values.every(value => value.length > 0));
  }
});

function harness(edited = false, external = false) {
  const calls = [], status = [], button = {disabled: false};
  const saved = {models: {h3: {model_path: "/models/h3"}}, gemma_path: "/models/gemma"};
  const context = vm.createContext({
    showSettingsStatus: (...args) => status.push(args),
    t: key => key,
    fetch: async (url, options) => {
      calls.push([url, options]);
      return url === "/api/settings" ? {ok: true, json: async () => ({settings: saved})} :
        {ok: !external, json: async () => external ? {error: "download_external_active"} : {}};
    },
    document: {querySelector: selector => selector === "#settings-gemma-path" ?
      {value: saved.gemma_path} : {querySelector: () => ({value: edited ? "/edited/path" : saved.models.h3.model_path})}},
    loadModels: async () => calls.push(["refresh"])
  });
  vm.runInContext(source.slice(source.indexOf("async function controlModelDownload("),
    source.indexOf("async function openSettings(")), context);
  return {calls, status, button, run: action => context.controlModelDownload("h3", action, button)};
}

test("unsaved paths cannot silently download to the old directory", async () => {
  const h = harness(true);
  await h.run("start");
  assert.equal(h.calls.length, 1);
  assert.match(h.status.at(-1)[0], /downloadSaveFirst/);
  assert.equal(h.status.at(-1)[1], true);
  assert.equal(h.button.disabled, false);
});

test("start and pause use scoped API and refresh without replacing the settings form", async () => {
  for (const action of ["start", "pause"]) {
    const h = harness();
    await h.run(action);
    assert.equal(h.calls[1][0], `/api/models/h3/download/${action}`);
    assert.equal(h.calls[1][1].method, "POST");
    assert.equal(h.calls.at(-1)[0], "refresh");
    assert.equal(h.button.disabled, false);
  }
  const render = source.slice(source.indexOf("function renderModelInfo("), source.indexOf("function renderImageModelInfo("));
  assert.ok(!render.includes("populateSettings"));
  assert.ok(render.includes("settings-download-${id}"));
});

test("external downloader conflict is localized and does not issue pause/kill fallback", async () => {
  const h = harness(false, true);
  await h.run("start");
  assert.match(h.status.at(-1)[0], /downloadExternal/);
  assert.equal(h.calls.length, 2);
});
