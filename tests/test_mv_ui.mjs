import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
const mvSource = source.slice(source.indexOf("const mvTranslationKeys ="),
  source.indexOf("const downloadControlTranslations ="));
const languages = ["zh-CN", "zh-TW", "en", "fr", "de", "ja", "ko", "es", "pt", "tr", "ar", "vi", "id", "ru"];

function harness() {
  const elements = new Map();
  const calls = [];
  class Element {
    constructor() {
      this.value = ""; this.hidden = false; this.disabled = false;
      this.dataset = {}; this.children = []; this.style = {}; this.clientWidth = 600;
      this.classList = {toggle() {}};
    }
    replaceChildren(...items) {this.children = items;}
    append(item) {this.children.push(item);}
    pause() {calls.push("pause");}
    removeAttribute(key) {delete this[key];}
    setAttribute(key, value) {this[key] = value;}
    addEventListener(key, callback) {this[key] = callback;}
    getBoundingClientRect() {return {left: 0, width: 600};}
    getContext() {
      return {
        setTransform() {}, clearRect() {}, fillRect() {}, beginPath() {},
        moveTo() {}, lineTo() {}, stroke() {}, globalAlpha: 1
      };
    }
  }
  const controls = ["#mv-name", "#mv-music", "#mv-prompt", "#mv-aspect", "#mv-save",
    "#mv-upload", "#mv-music-file", "#mv-new", "#mv-analyze", "#mv-cancel-analysis"];
  controls.forEach(selector => elements.set(selector, new Element()));
  const translations = Object.fromEntries(languages.map(lang => [lang, {}]));
  const context = vm.createContext({
    translations,
    historyItems: [{id: "music", kind: "music", name: "<script>song</script>", audio_url: "/api/history/music/audio"}],
    t: key => key === "mvAnalysisSummary" ? translations.en[key] : key,
    renderHistory() {calls.push("history-render");},
    mvPromptInput: elements.get("#mv-prompt"),
    mvPromptEnhancerResult: new Element(),
    setPromptEnhancerStatus() {},
    Option: class {constructor(text, value) {this.text = text; this.value = value;}},
    document: {
      querySelector(selector) {
        if (!elements.has(selector)) elements.set(selector, new Element());
        return elements.get(selector);
      },
      querySelectorAll() {return controls.map(selector => elements.get(selector));},
      createElement() {return new Element();}
    },
    window: {confirm() {return false;}, devicePixelRatio: 1, setTimeout() {return 1;}, clearTimeout() {}},
    fetch: async (url, options) => {
      calls.push({url, options});
      return {ok: true, json: async () => ({items: []})};
    }
  });
  vm.runInContext(mvSource, context);
  return {context, elements, calls};
}

test("MV analysis controls have translations in all fourteen languages", () => {
  const {context} = harness();
  for (const language of languages) {
    assert.ok(context.translations[language].mvDeleteConfirm);
    for (const key of vm.runInContext("mvUploadKeys", context)) {
      assert.ok(context.translations[language][key], `${language}:${key}`);
    }
    for (const key of vm.runInContext("mvTranslationKeys", context)) {
      assert.ok(context.translations[language][key], `${language}:${key}`);
    }
    for (const key of vm.runInContext("mvAnalysisKeys", context)) {
      assert.ok(context.translations[language][key], `${language}:${key}`);
    }
  }
  assert.match(html, /id="mv-mode-button"/);
  assert.match(html, /id="mv-analyze"/);
  assert.match(html, /id="mv-timeline"/);
  assert.doesNotMatch(html, /disabled data-i18n="mvUnavailable"/);
  assert.doesNotMatch(html, /id="workflow-music-source"|id="workflow-burn-lyrics"/);
});

test("music source and its nested analysis are independently collapsible", () => {
  const sourceStart = html.indexOf('<details id="mv-music-source"');
  const analysisStart = html.indexOf('<details id="mv-analysis"', sourceStart);
  const sourceEnd = html.indexOf('</details>\n                </details>', analysisStart);
  const storyboardStart = html.indexOf('<details id="mv-storyboard-settings"');
  assert.ok(sourceStart >= 0 && analysisStart > sourceStart && sourceEnd > analysisStart);
  assert.ok(sourceEnd < storyboardStart);
  assert.match(html.slice(sourceStart, analysisStart), /<summary><span data-i18n="mvMusic">/);
  assert.match(html.slice(analysisStart, sourceEnd), /<summary><span data-i18n="mvAnalyze">/);
  for (const id of ["mv-music", "mv-upload", "mv-audio", "mv-analysis-status", "mv-timeline",
    "mv-analyze", "mv-cancel-analysis"]) {
    assert.ok(html.slice(sourceStart, sourceEnd).includes(`id="${id}"`));
  }
  assert.doesNotMatch(html.slice(storyboardStart), /id="mv-analysis"/);
});

test("MV save and new actions stay before storyboard settings without a duplicate draft list", () => {
  const sourceStart = html.indexOf('<details id="mv-music-source"');
  const saveStart = html.indexOf('<button id="mv-save"', sourceStart);
  const storyboard = html.indexOf('<details id="mv-storyboard-settings"', saveStart);
  assert.ok(sourceStart >= 0 && saveStart > sourceStart && storyboard > saveStart);
  const actionBlock = html.slice(saveStart, storyboard);
  assert.match(actionBlock, /id="mv-save"/);
  assert.match(actionBlock, /id="mv-new"/);
  assert.doesNotMatch(html, /id="mv-refresh"/);
  assert.doesNotMatch(html, /id="mv-drafts"/);
});

test("only existing music is offered and missing selected music disables save and preview", () => {
  const {context, elements} = harness();
  context.refreshMVMusicSources();
  const select = elements.get("#mv-music");
  assert.equal(select.children.length, 2);
  select.value = "music";
  context.updateMVMusicPreview();
  assert.equal(elements.get("#mv-audio").src, "/api/history/music/audio");
  assert.equal(elements.get("#mv-save").disabled, false);
  context.historyItems = [];
  context.refreshMVMusicSources();
  assert.equal(select.value, "music");
  assert.equal(select.children[1].disabled, true);
  assert.equal(elements.get("#mv-save").disabled, true);
  assert.equal(elements.get("#mv-audio").hidden, true);
});

test("draft reopening restores fields without dropping unsaved edits after cancellation", () => {
  const {context, elements} = harness();
  context.openMVProject({id: "mv", music_source_id: "music", name: "Test",
    prompt: "<img onerror=bad>", aspect: "9:16", music_available: true});
  assert.equal(elements.get("#mv-name").value, "Test");
  assert.equal(elements.get("#mv-prompt").value, "<img onerror=bad>");
  vm.runInContext("mvDirty = true", context);
  context.openMVProject();
  assert.equal(elements.get("#mv-name").value, "Test");
});

test("MV updates send revision and music ID, never a generation request", async () => {
  const {context, elements, calls} = harness();
  context.openMVProject({id: "mv", revision: "revision", music_source_id: "music",
    name: "Test", prompt: "Ocean", aspect: "16:9", music_available: true});
  context.fetch = async (url, options) => {
    calls.push({url, options});
    return {ok: true, json: async () => options?.method === "POST"
      ? {project: {id: "mv", revision: "new", music_source_id: "music"}}
      : {items: []}};
  };
  await context.saveMVProject({preventDefault() {}});
  const request = calls.find(call => call.url?.endsWith("/update"));
  assert.equal(request.url, "/api/mv-projects/mv/update");
  const payload = JSON.parse(request.options.body);
  assert.equal(payload.revision, "revision");
  assert.equal(payload.music_source_id, "music");
  assert.equal(elements.get("#mv-message").textContent, "mvSaved");
  assert.ok(calls.filter(call => call.url).every(call => call.url.startsWith("/api/mv-projects")));
});

test("save conflict reports failure and keeps editor contents", async () => {
  const {context, elements} = harness();
  context.openMVProject({id: "mv", revision: "stale", music_source_id: "music",
    name: "Keep me", music_available: true});
  context.fetch = async () => ({ok: false, json: async () => ({error: "mv_conflict"})});
  await context.saveMVProject({preventDefault() {}});
  assert.match(elements.get("#mv-message").textContent, /mv_conflict/);
  assert.equal(elements.get("#mv-name").value, "Keep me");
});

test("long video submits neither historical music nor subtitle embedding", () => {
  const payloadSource = source.slice(source.indexOf("function workflowPayload()"),
    source.indexOf("function setWorkflowForm("));
  assert.doesNotMatch(payloadSource, /music_source_id/);
  assert.match(payloadSource, /burn_lyrics: false/);
});

test("MV uses shared form and heading styles instead of browser defaults", () => {
  const css = readFileSync(new URL("../webapp/static/app.css", import.meta.url), "utf8");
  assert.match(html, /class="workflow-heading">\s*<h3 id="mv-title"/);
  assert.match(html, /id="mv-name" type="text"/);
  assert.match(html, /class="select-wrap">\s*<select id="mv-aspect"/);
  assert.doesNotMatch(html, /id="mv-drafts"/);
  assert.doesNotMatch(html, /id="mv-refresh"/);
  assert.match(css, /\.workflow-list-heading h4\s*\{ margin: 0; \}/);
  assert.match(css, /\.workflow-list-heading h4 \{[^}]*font-size: 11px/);
});

test("WAV upload selects persistent music and preserves draft fields without starting generation", async () => {
  const {context, elements, calls} = harness();
  context.openMVProject({id: "mv", name: "Keep this name", music_source_id: "music", music_available: true});
  const file = {name: "local song.wav", size: 8000};
  const input = {files: [file], value: "selected"};
  context.fetch = async (url, options) => {
    calls.push({url, options});
    return {ok: true, json: async () => ({item: {id: "uploaded", name: file.name,
      audio_url: "/api/mv-music/uploaded/audio"}})};
  };
  await context.uploadMVMusic({target: input});
  assert.equal(elements.get("#mv-name").value, "Keep this name");
  assert.equal(elements.get("#mv-music").value, "uploaded");
  assert.equal(elements.get("#mv-audio").src, "/api/mv-music/uploaded/audio");
  assert.equal(elements.get("#mv-save").disabled, false);
  assert.equal(input.value, "");
  const request = calls.find(call => call.url?.startsWith("/api/mv-music?"));
  assert.equal(request.url, "/api/mv-music?name=local%20song.wav");
  assert.equal(request.options.body, file);
  assert.equal(request.options.headers["Content-Type"], "audio/wav");
  assert.equal(vm.runInContext("mvDirty", context), true);
  assert.equal(vm.runInContext("currentMV.id", context), "mv");
  assert.match(html, /id="mv-music-file"[^>]*accept="\.wav,audio\/wav,audio\/x-wav"[^>]*hidden/);
});

test("upload errors retain music selection and oversize/invalid files never reach the server", async () => {
  const {context, elements} = harness();
  context.openMVProject({id: "mv", music_source_id: "music", music_available: true});
  let requests = 0;
  context.fetch = async () => {
    requests += 1;
    return {ok: false, json: async () => ({error: "invalid_mv_wav"})};
  };
  for (const file of [{name: "song.mp3", size: 10}, {name: "song.wav", size: 512 * 1024 * 1024 + 1}]) {
    await context.uploadMVMusic({target: {files: [file], value: "selected"}});
  }
  assert.equal(requests, 0);
  await context.uploadMVMusic({target: {files: [{name: "song.wav", size: 8000}], value: "selected"}});
  assert.equal(requests, 1);
  assert.equal(elements.get("#mv-music").value, "music");
  assert.equal(elements.get("#mv-audio").src, "/api/history/music/audio");
  assert.match(elements.get("#mv-message").textContent, /mvUploadInvalid/);
  assert.equal(vm.runInContext("mvBusy", context), false);
});

test("reloaded uploaded WAV sources restore draft selection and preview", async () => {
  const {context, elements} = harness();
  context.fetch = async () => ({ok: true, json: async () => ({
    items: [{id: "uploaded", name: "test.wav", audio_url: "/api/mv-music/uploaded/audio"}]
  })});
  await context.loadMVMusicSources();
  context.openMVProject({id: "mv", music_source_id: "uploaded", music_available: true});
  assert.equal(elements.get("#mv-music").value, "uploaded");
  assert.equal(elements.get("#mv-audio").src, "/api/mv-music/uploaded/audio");
  assert.equal(elements.get("#mv-save").disabled, false);
});

test("cached analysis renders waveform and beat marks; the timeline seeks audio", async () => {
  const {context, elements} = harness();
  context.fetch = async () => ({ok: true, json: async () => ({
    music_source_id: "music",
    result: {duration: 10, sample_rate: 44100, bin_seconds: 0.1,
      waveform: [0.2, 0.8], energy: [0.1, 0.4], beats: [1, 2, 3],
      downbeats: [1], bpm: 120, device: "cpu", dbn: false}
  })});
  context.openMVProject({id: "mv", revision: "revision", music_source_id: "music",
    name: "Test", music_available: true});
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(elements.get("#mv-timeline-wrap").hidden, false);
  assert.match(elements.get("#mv-analysis-summary").textContent, /120/);
  context.seekMVTimeline({currentTarget: elements.get("#mv-timeline"), clientX: 300});
  assert.equal(elements.get("#mv-audio").currentTime, 5);
  let prevented = false;
  context.handleMVTimelineKeydown({key: "ArrowRight", preventDefault() {prevented = true;}});
  assert.equal(prevented, true);
  assert.equal(elements.get("#mv-audio").currentTime, 6);
});

test("analysis starts only from a saved draft and exposes cancellation", async () => {
  const {context, elements, calls} = harness();
  const result = {duration: 10, sample_rate: 44100, bin_seconds: 0.1,
    waveform: [0.2, 0.8], energy: [0.1, 0.4], beats: [1, 2, 3],
    downbeats: [1], bpm: 120, device: "cpu", dbn: false};
  context.fetch = async (url, options = {}) => {
    calls.push({url, options});
    if (url.endsWith("/analysis")) return {ok: true, json: async () => ({
      music_source_id: "music", result: null
    })};
    if (url.endsWith("/cancel")) return {ok: true, json: async () => ({job: {
      id: "job", music_source_id: "music", status: "cancelling", stage: "beats"
    }})};
    if (url === "/api/mv-analysis/job") return {ok: true, json: async () => ({job: {
      id: "job", music_source_id: "music", status: "completed", stage: "complete", result
    }})};
    return {ok: true, json: async () => ({job: {
      id: "job", music_source_id: "music", status: "queued", stage: "queued"
    }})};
  };
  context.openMVProject({id: "mv", revision: "revision", music_source_id: "music",
    name: "Test", music_available: true});
  await new Promise(resolve => setImmediate(resolve));
  await context.startMVAnalysis();
  assert.equal(elements.get("#mv-cancel-analysis").hidden, false);
  const request = calls.find(call => call.url?.endsWith("/analyze"));
  assert.equal(request.options.method, "POST");
  assert.deepEqual(JSON.parse(request.options.body), {revision: "revision"});
  await context.cancelMVAnalysis();
  assert.equal(calls.at(-1).url, "/api/mv-analysis/job/cancel");
  assert.equal(elements.get("#mv-analysis-status").textContent, "mvAnalysisCancelling");
  await context.pollMVAnalysis("job");
  assert.equal(elements.get("#mv-analysis-status").textContent, "mvAnalysisComplete");
  assert.equal(elements.get("#mv-timeline-wrap").hidden, false);
});

test("pending music list cannot replace a newer upload and busy state retains disabled controls", async () => {
  const {context, elements} = harness();
  context.openMVProject({id: "mv", music_source_id: "music", music_available: true});
  let finishList;
  let finishUpload;
  context.fetch = url => new Promise(resolve => {
    if (url === "/api/mv-music") finishList = resolve;
    else finishUpload = resolve;
  });
  const listing = context.loadMVMusicSources();
  const uploading = context.uploadMVMusic({target: {
    files: [{name: "new.wav", size: 8000}], value: "selected"
  }});
  assert.equal(elements.get("#mv-music").disabled, true);
  assert.equal(elements.get("#mv-name").disabled, true);
  finishUpload({ok: true, json: async () => ({item: {
    id: "new", name: "new.wav", audio_url: "/api/mv-music/new/audio"
  }})});
  await uploading;
  finishList({ok: true, json: async () => ({items: []})});
  await listing;
  assert.equal(elements.get("#mv-music").value, "new");
  assert.equal(elements.get("#mv-audio").src, "/api/mv-music/new/audio");
  assert.equal(elements.get("#mv-name").disabled, false);
  assert.equal(elements.get("#mv-analyze").disabled, true);
});
