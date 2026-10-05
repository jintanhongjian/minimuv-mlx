import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const renderSource = source.slice(source.indexOf("const modelDownloadSamples ="),
  source.indexOf("function renderModelInfo("));

function harness() {
  const create = () => ({
    children: [], hidden: false, attributes: {},
    append(...items) { this.children.push(...items); },
    replaceChildren() { this.children = []; },
    setAttribute(key, value) { this.attributes[key] = value; }
  });
  const container = create();
  const context = vm.createContext({
    document: { getElementById: () => container, createElement: create },
    t: key => key
  });
  vm.runInContext(renderSource, context);
  return { container, context, render: info => context.renderModelDownload(info, "model-download-info") };
}

test("download speeds use fresh byte deltas, not cached totals or rerenders", () => {
  const { context, container, render } = harness();
  const snapshot = (bytes, state = "downloading", path = "/model") => ({
    model_options: { video: [{ id: "ltx", model_path: path }] },
    downloads: { ltx: { download_state: state, downloaded_bytes: bytes, total_bytes: 10e9 } }
  });
  const sample = (info, time) => {
    context.sampleModelDownloadSpeeds(info, time);
    return info.downloads.ltx;
  };
  const first = sample(snapshot(5e9), 0);
  assert.equal(first.download_speed_bytes_per_second, null);
  render(first);
  assert.match(container.children[0].textContent, /downloadSpeed —/);
  const next = sample(snapshot(5e9 + 20e6), 10000);
  assert.equal(next.download_speed_bytes_per_second, 2e6);
  render(next);
  render(next);
  assert.match(container.children[0].textContent, /downloadSpeed 2.00 MB\/s/);
  assert.equal(sample(snapshot(5e9 + 20e6), 20000).download_speed_bytes_per_second, 0);
  assert.equal(sample(snapshot(4e9), 30000).download_speed_bytes_per_second, null);
  assert.equal(sample(snapshot(4e9 + 1e6, "downloading", "/new"), 40000).download_speed_bytes_per_second, null);
  const paused = sample(snapshot(4e9 + 1e6, "paused", "/new"), 50000);
  render(paused);
  assert.doesNotMatch(container.children[0].textContent, /downloadSpeed/);
  assert.equal(sample(snapshot(4e9 + 2e6, "downloading", "/new"), 60000).download_speed_bytes_per_second, null);
  assert.equal(sample(snapshot(4e9 + 3e6, "downloading", "/new"), 100000).download_speed_bytes_per_second, null);
  context.sampleModelDownloadSpeeds({ downloads: {} }, 110000);
  assert.equal(sample(snapshot(6e9), 120000).download_speed_bytes_per_second, null);
});

test("speed units and inactive states are rendered consistently", () => {
  const { context, container, render } = harness();
  for (const [rate, expected] of [[0, "0 B/s"], [500, "500 B/s"],
    [2500, "2.50 KB/s"], [2e6, "2.00 MB/s"], [3e9, "3.00 GB/s"],
    [NaN, "—"], [-1, "—"]]) {
    assert.equal(context.formatDownloadSpeed(rate), expected);
  }
  for (const state of ["paused", "completed", "error", "not_started"]) {
    render({ download_state: state, download_speed_bytes_per_second: 2e6 });
    assert.doesNotMatch(container.children[0].textContent, /downloadSpeed/);
  }
});

test("renders live percentage, byte totals, accessible bar and shared encoder", () => {
  const h = harness();
  h.render({ download_state: "downloading", download_percent: 2.5,
    downloaded_bytes: 250000000, total_bytes: 10000000000, download_catalog: true,
    download_components: [{ name: "Gemma", download_state: "paused", download_percent: 5 }] });
  assert.match(h.container.children[0].textContent, /downloadActive · 2.5% · 0.25 \/ 10.00 GB/);
  assert.equal(h.container.children[1].value, 2.5);
  assert.equal(h.container.children[1].attributes["aria-label"], "downloadActive");
  assert.match(h.container.children[2].textContent, /Gemma · downloadPaused · 5.0%/);
});

test("model changes clear old progress and completion reaches 100%", () => {
  const h = harness();
  h.render({ download_state: "completed", download_percent: 100 });
  assert.match(h.container.children[0].textContent, /100.0%/);
  h.render({});
  assert.equal(h.container.hidden, true);
  assert.equal(h.container.children.length, 0);
});

test("errors never render fake percentage", () => {
  const h = harness();
  h.render({ download_state: "error", download_percent: null, download_error: "catalog missing" });
  assert.match(h.container.children[0].textContent, /downloadError · catalog missing/);
  assert.equal(h.container.children.length, 1);
});

test("transfer errors remain visible when byte progress is known", () => {
  const h = harness();
  h.render({ download_state: "error", download_percent: 50,
    downloaded_bytes: 500, total_bytes: 1000, download_error: "Range refused; bytes retained" });
  assert.match(h.container.children[0].textContent, /Range refused; bytes retained/);
});

test("download labels cover all fourteen languages", () => {
  const context = vm.createContext({});
  vm.runInContext(source.slice(source.indexOf("const downloadStatusTranslations ="),
    source.indexOf("const downloadControlKeys =")), context);
  const translations = vm.runInContext("downloadStatusTranslations", context);
  assert.equal(Object.keys(translations).length, 14);
  for (const values of Object.values(translations)) {
    assert.equal(values.length, 7);
    assert.ok(values.every(value => value.length > 0));
  }
  const speeds = vm.runInContext("downloadSpeedTranslations", context);
  assert.equal(Object.keys(speeds).length, 14);
  for (const label of Object.values(speeds)) assert.ok(label.length > 0);
});

test("model status polls even when other models are ready and retries HTTP failures", async () => {
  const body = source.slice(source.indexOf("async function loadModels()"),
    source.indexOf("loadModelButton.addEventListener", source.indexOf("async function loadModels()")));
  const loadSource = body.slice(0, body.indexOf("\n}", body.indexOf("async function loadModels()")) + 2);
  const calls = [];
  const context = vm.createContext({
    modelPollTimer: null,
    fetch: async () => ({ ok: true, json: async () => ({ model_loaded: true }) }),
    renderModelInfo: info => calls.push(info),
    sampleModelDownloadSpeeds: () => calls.push("sample"),
    modelDownloadSamples: new Map(),
    window: { clearTimeout() {}, setTimeout: (_, delay) => { calls.push(delay); return 42; } },
    console: { warn: () => calls.push("warning") },
    document: { querySelector: () => null },
  });
  vm.runInContext(loadSource, context);
  await context.loadModels();
  assert.equal(calls.at(-1), 10000);
  assert.equal(context.modelPollTimer, 42);
  context.fetch = async () => ({ ok: false, status: 503 });
  await context.loadModels();
  assert.ok(calls.includes("warning"));
  assert.equal(calls.at(-1), 10000);
});
