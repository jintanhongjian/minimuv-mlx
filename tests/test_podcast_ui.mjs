import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/podcast.js", import.meta.url), "utf8");
const app = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
const supported = ["en", "zh-CN", "zh-TW", "fr", "de", "ja", "ko", "es", "pt", "tr", "ar", "vi", "id", "ru"];

function harness() {
  const nodes = new Map();
  const query = id => {
    if (!nodes.has(id)) nodes.set(id, {
      value: "", textContent: "", hidden: false, disabled: false, children: [], options: [],
      classList: {toggle() {}}, querySelectorAll: () => [],
      replaceChildren(...options) { this.options = options; },
      getAttribute(name) { return this[name] || ""; },
      removeAttribute(name) { delete this[name]; },
      pause() {},
    });
    return nodes.get(id);
  };
  query("#podcast-form").querySelectorAll = () => [query("#podcast-save")];
  query("#language").value = "en";
  const calls = [];
  let response = {ok: true, status: 200, json: async () => ({available: true,
    model: {model_ready: true, runtime_ready: true, ready: true}, items: []})};
  const context = vm.createContext({
    document: {querySelector: query, querySelectorAll: () => []},
    window: {}, Blob, Option: function(text, value) { this.text = text; this.value = value; },
    fetch: async (...args) => { calls.push(args); return response; }, setTimeout() {}, clearTimeout() {},
    updateGenerateAvailability() {},
  });
  const prefix = source.slice(source.indexOf('  "use strict";'), source.indexOf('  $("name").addEventListener'));
  vm.runInContext(prefix, context);
  return {context, query, calls, response: value => {response = value;},
    run: code => vm.runInContext(code, context)};
}

test("every podcast label and purpose is localized in fourteen languages", () => {
  const {run} = harness();
  const rows = run("messages"), keys = run("keys"), purposes = run("purposes");
  assert.deepEqual(Object.keys(rows).sort(), supported.sort());
  for (const language of supported) {
    assert.equal(rows[language].length, keys.length, language);
    assert.equal(purposes[language].length, 5, language);
    assert.ok(rows[language].every(value => typeof value === "string" && value.trim()));
  }
  for (const [, key] of html.matchAll(/data-podcast-i18n="([^"]+)"/g)) assert.ok(keys.includes(key), key);
});

test("save payload strips media, revisions and server metadata without mutating draft", () => {
  const {run, query} = harness();
  query("#podcast-name").value = "  Episode 1  ";
  query("#podcast-speed").value = "1.2";
  query("#podcast-temperature").value = "0.5";
  run(`project = {settings:{top_p:0.7}, revision:"old",
    characters:[{id:"a",name:"Narrator",reference_text:"reference",voice_description:"",consent:true,reference:{path:"private"}}],
    segments:[{id:"b",character_id:"a",text:"hello",purpose:"intro",gap_seconds:0.5,
      audio_url:"/api/private",status:"completed"}]};`);
  const payload = JSON.parse(JSON.stringify(run("payload()")));
  assert.deepEqual(payload, {
    name: "Episode 1", settings: {top_p: 0.7, model: "fish-s2-pro-8bit", speed: 1.2, temperature: 0.5},
    characters: [{id: "a", name: "Narrator", reference_text: "reference", voice_description: "", consent: true}],
    segments: [{id: "b", character_id: "a", text: "hello", purpose: "intro", gap_seconds: 0.5, source: "generated"}],
  });
  assert.equal(run("project.segments[0].status"), "completed");
});

test("HTTP errors remain errors, not successful podcast results", async () => {
  const {context, response, calls} = harness();
  response({ok: false, status: 409, json: async () => ({error: "podcast_revision_conflict"})});
  await assert.rejects(context.request("/api/podcasts/id/save", {revision: "stale"}), /podcast_revision_conflict/);
  assert.deepEqual(JSON.parse(calls[0][1].body), {revision: "stale"});
});

test("error codes are localized instead of leaking raw detail UUIDs", async () => {
  const {context, response, query} = harness();
  query("#language").value = "zh-CN";
  response({ok: false, status: 409, json: async () => ({
    error: "podcast_segment_audio_missing", detail: "a9fc6475-b7df-4c57-9ce2-a8bce54f8798"})});
  await assert.rejects(context.request("/api/podcasts/id/generate", {revision: "r"}),
    /有语音段还没有音频/);
  // Unknown codes fall back to the raw code, never the detail UUID.
  response({ok: false, status: 409, json: async () => ({error: "podcast_unknown", detail: "uuid"})});
  await assert.rejects(context.request("/api/podcasts/id/generate", {revision: "r"}), /podcast_unknown/);
});

test("old backend is explicitly gated without clearing unsaved project", async () => {
  const {context, run, response, query} = harness();
  run('project = {name:"keep me",segments:[],characters:[]}; dirty=true;');
  response({ok: false, status: 404});
  await context.refresh();
  assert.equal(run("available"), false);
  assert.equal(run("project.name"), "keep me");
  assert.equal(query("#podcast-save").disabled, true);
  assert.match(query("#podcast-availability").textContent, /New backend/);
});

test("subtitle-only composition remains available when Fish is missing", async () => {
  const {context, run, response, query} = harness();
  run('project = {segments:[{id:"a",audio_url:"local"}],characters:[]};');
  response({ok: true, json: async () => ({available: true, model: {}, items: []})});
  await context.refresh();
  assert.equal(query("#podcast-generate").disabled, true);
  assert.equal(query("#podcast-assemble").disabled, false);
});

test("refresh indexes reusable music history clips for imported segments", async () => {
  const {context, run, response} = harness();
  let call = 0;
  context.fetch = async (_url) => {
    call += 1;
    if (call === 1) {
      return {ok: true, status: 200, json: async () => ({available: true,
        model: {ready: true}, items: []})};
    }
    return {ok: true, status: 200, json: async () => ({items: [
      {id: "m1", kind: "music", audio_url: "/api/history/m1/audio", name: "Cue 1"},
      {id: "v1", kind: "video", audio_url: "/api/history/v1/audio", name: "Video audio"},
    ]})};
  };
  await context.refresh();
  assert.equal(run("musicLibrary.length"), 1);
  assert.equal(run("musicLibrary[0].id"), "m1");
});

test("music history failure is distinct from an empty library and preserves edits", async () => {
  const {context, run} = harness();
  run('project={name:"Unsaved",characters:[],segments:[]}; dirty=true;');
  context.fetch = async url => url === "/api/podcasts"
    ? {ok: true, json: async () => ({available:true, model:{ready:true}, items:[]})}
    : {ok: false, status:500, json:async () => ({error:"history_unavailable"})};
  await context.refresh();
  assert.equal(run("musicLibraryError"), "history_unavailable");
  assert.equal(run("dirty"), true);
  assert.equal(run("project.name"), "Unsaved");
  context.fetch = async () => ({ok:true, json:async () => ({available:true, model:{ready:true}, items:[]})});
  await context.refresh();
  assert.equal(run("musicLibraryError"), "");
});

test("empty music import remains disabled after generic control updates", () => {
  const {context, query, run} = harness();
  const importButton = {};
  query("#podcast-form").querySelectorAll = () => [importButton];
  query("#podcast-segments").querySelectorAll = selector =>
    selector === "[data-podcast-import-music]" ? [importButton] : [];
  run('available=true; project={segments:[],characters:[]};');
  context.updateControls();
  assert.equal(importButton.disabled, true);
  run('musicLibrary=[{id:"m1"}];');
  context.updateControls();
  assert.equal(importButton.disabled, false);
});

test("music choices refresh in place and retain valid selections", () => {
  const {context, query, run} = harness();
  const select = {dataset:{musicSelect:"s1"}, replaceChildren(...options) {this.options=options;}};
  const hint = {classList:{toggle() {}}};
  query("#podcast-segments").querySelectorAll = selector =>
    selector === "[data-music-select]" ? [select] : selector === "[data-music-state]" ? [hint] : [];
  run('musicSelections.set("s1","m2"); musicLibrary=[{id:"m1",label:"One"},{id:"m2",label:"Two"}];');
  context.updateMusicOptions();
  assert.equal(select.value, "m2");
  assert.equal(hint.hidden, true);
  run('musicLibrary=[];');
  context.updateMusicOptions();
  assert.equal(select.hidden, true);
  assert.equal(hint.hidden, false);
  assert.match(hint.textContent, /No saved music/);
});

test("editing completed generated audio still permits regeneration after saving", () => {
  const {context, run, query} = harness();
  run('available=true; dirty=true; speechModels=[{id:"fish-s2-pro-8bit",ready:true}]; project={settings:{model:"fish-s2-pro-8bit"},characters:[],segments:[{source:"generated",audio_url:"old"}]};');
  context.updateControls();
  assert.equal(query("#podcast-generate").disabled, false);
});

test("a disabled Fish model is not usable even when its files and runtime are ready", async () => {
  const {context, run, response, query} = harness();
  run('project = {segments:[],characters:[]};');
  response({ok: true, json: async () => ({available: true,
    model: {enabled: false, model_ready: true, runtime_ready: true, ready: false}, items: []})});
  await context.refresh();
  assert.equal(run("modelReady"), false);
  assert.equal(query("#podcast-generate").disabled, true);
});

test("voice design models can be selected and their descriptions are saved", () => {
  const {context, run, query} = harness();
  run(`available=true; speechModels=[
    {id:"fish-s2-pro-8bit",name:"Fish Audio",ready:true},
    {id:"voxcpm2-4bit",name:"VoxCPM2",ready:true}];
    project={name:"Episode",settings:{model:"voxcpm2-4bit"},characters:[
      {id:"a",name:"Host",reference_text:"",voice_description:"Warm low voice",consent:true}],segments:[]};`);
  run("updateSpeechModelOptions()");
  context.updateControls();
  assert.equal(query("#podcast-model").value, "voxcpm2-4bit");
  assert.equal(query("#podcast-model-summary").textContent, "VoxCPM2");
  const payload = JSON.parse(JSON.stringify(run("payload()")));
  assert.equal(payload.settings.model, "voxcpm2-4bit");
  assert.equal(payload.characters[0].voice_description, "Warm low voice");
  assert.equal(run("modelReady"), true);
  assert.match(source, /transcript\.previousElementSibling\.hidden = !fishModel/);
  assert.match(source, /voiceDescription\.previousElementSibling\.hidden = fishModel/);
  assert.match(source, /consent\.previousElementSibling\.hidden = !fishModel/);
  assert.match(source, /hint\.hidden = !fishModel/);
  assert.match(source, /preview\.hidden = !fishModel/);
  assert.match(html, /<details id="podcast-model-picker" class="generation-model-picker" open>/);
  assert.ok(html.indexOf('id="podcast-model-picker"') < html.indexOf('id="podcast-title"'));
  assert.equal([...html.matchAll(/id="podcast-availability"/g)].length, 1);
  assert.match(html, /<div class="select-wrap">\s*<select id="podcast-model"><\/select>/);
});

test("podcast model card exposes the same status details as other model cards", () => {
  for (const id of ["podcast-availability", "podcast-model-description",
    "podcast-model-download-info", "podcast-model-source"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  const {run, query} = harness();
  run(`speechModels=[{id:"voxcpm2-4bit",name:"VoxCPM2 · 4-bit",ready:true,
    model_ready:true,runtime_ready:true,model_path:"/models/VoxCPM2-4bit",
    model_download_url:"https://huggingface.co/mlx-community/VoxCPM2-4bit"}];
    project={settings:{model:"voxcpm2-4bit"},characters:[],segments:[]};
    updateSpeechModelOptions();`);
  assert.equal(query("#podcast-availability").textContent, "Local model is ready");
  assert.equal(query("#podcast-model-description").textContent, "/models/VoxCPM2-4bit");
  assert.equal(query("#podcast-model-source").textContent, "VoxCPM2 · 4-bit ↗");
  assert.equal(query("#podcast-model-source").href,
    "https://huggingface.co/mlx-community/VoxCPM2-4bit");
});

test("poll results expose actual completed counts, segment downloads and failures", () => {
  const {context, run, query} = harness();
  const status = {dataset: {}}, detail = {};
  const links = ["audio", "srt", "vtt"].map(kind => ({
    dataset: {download: kind}, removeAttribute(name) { delete this[name]; },
  }));
  query("#podcast-segments").children = [{
    dataset: {segmentId: "a"},
    querySelector: selector => selector === "[data-status]" ? status : detail,
    querySelectorAll: () => links,
  }];
  run(`available=true; project={status:"running",progress:{completed:1,total:2},
    segments:[{id:"a",status:"ready",audio_url:"/audio/a",srt_url:"/srt/a",vtt_url:"/vtt/a"}],
    characters:[]};`);
  context.updateResults();
  assert.equal(query("#podcast-state").textContent, "Generating · 1/2");
  assert.equal(status.textContent, "Completed");
  assert.deepEqual(links.map(link => link.href), ["/audio/a", "/srt/a", "/vtt/a"]);
  assert.equal(detail.hidden, true);
  run('project.segments[0]={id:"a",status:"failed",error:"fish_inference_failed"};');
  context.updateResults();
  assert.ok(links.every(link => link.hidden && !link.href));
  assert.equal(detail.textContent, "fish_inference_failed");
  assert.equal(detail.hidden, false);
});

test("preview changes only reload audio when the segment URL changes", () => {
  const {context} = harness();
  let src = "", assignments = 0, pauses = 0;
  const player = {getAttribute: () => src, removeAttribute: () => {src = "";}, pause: () => {pauses++;},
    set src(value) {src = value; assignments++;}};
  context.syncAudio(player, "/audio/1");
  context.syncAudio(player, "/audio/1");
  assert.equal(assignments, 1);
  context.syncAudio(player, "/audio/2");
  assert.equal(assignments, 2);
  context.syncAudio(player, "");
  assert.equal(player.hidden, true);
  assert.equal(pauses, 1);
});

test("busy project locks editing and exporting but permits cancellation", () => {
  const {context, run, query} = harness();
  run('available=true; modelReady=true; project={status:"running",segments:[{id:"a"}],characters:[]};');
  context.updateControls();
  assert.equal(query("#podcast-generate").disabled, true);
  assert.equal(query("#podcast-assemble").disabled, true);
  assert.equal(query("#podcast-project").disabled, true);
  assert.equal(query("#podcast-cancel").disabled, false);
});

test("draft and worker state labels never expose English protocol tokens in Chinese", () => {
  const {run, query} = harness();
  query("#language").value = "zh-CN";
  assert.equal(run('statusText("draft")'), "已保存");
  assert.equal(run('statusText("idle")'), "已保存");
  assert.equal(run('statusText("assembling")'), "生成中");
  assert.equal(run('statusText("loading")'), "排队中");
  assert.equal(run('statusText("completed")'), "已完成");
});

test("podcast is distinct from image, video, music, long-video and MV modes", () => {
  assert.match(html, /id="podcast-mode-button"/);
  assert.match(html, /id="podcast-panel"[^>]*hidden/);
  assert.match(html, /src="\/podcast.js" defer/);
  assert.match(html, /id="podcast-name"[^>]*maxlength="120"/);
  assert.match(app, /const isPodcast = activeMode === "podcast"/);
  assert.match(app, /form.hidden = isWorkflow \|\| isMV \|\| isPodcast/);
  assert.match(app, /const emptyTextKey = isPodcast \? "modePodcast"/);
  assert.match(app, /const emptyHintTextKey = isPodcast \? "podcastNote"/);
  assert.match(app, /Boolean\(window.MiniMuvPodcast\?\.active\(\)\)/);
});

test("podcast logs sit below preview in the result panel and follow podcast mode", () => {
  const resultPanel = html.indexOf('<section class="panel result-panel">');
  const preview = html.indexOf('id="preview"', resultPanel);
  const logs = html.indexOf('id="podcast-log-panel"', resultPanel);
  assert.ok(resultPanel > 0 && preview > resultPanel && logs > preview);
  assert.ok(logs < html.indexOf('<section class="history-panel"', resultPanel));
  assert.equal((html.match(/id="podcast-logs"/g) || []).length, 1);
  assert.match(app, /querySelector\("#podcast-log-panel"\)\.hidden = !isPodcast/);
  assert.match(html, /<div id="podcast-log-panel" class="log-panel" hidden>\s*<div class="log-heading">\s*<span data-i18n="generationLog">/);
  assert.doesNotMatch(html, /<details id="podcast-log-panel"/);
});

test("generic generation logs are visible only in their source mode", () => {
  const block = app.slice(app.indexOf('  document.querySelector("#podcast-log-panel").hidden = !isPodcast;'),
    app.indexOf('  const isVideo =', app.indexOf("function updateModeUI()")));
  for (const mode of ["video", "image", "music", "workflow", "mv", "podcast"]) {
    const logPanel = {dataset: {hasLogs: "true", mode: "video"}};
    const podcastPanel = {};
    vm.runInNewContext(block, {activeMode: mode, isPodcast: mode === "podcast", logPanel,
      document: {querySelector: () => podcastPanel}});
    assert.equal(logPanel.hidden, mode !== "video");
    assert.equal(podcastPanel.hidden, mode !== "podcast");
  }
});
