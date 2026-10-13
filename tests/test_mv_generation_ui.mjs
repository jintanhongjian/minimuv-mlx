import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

const script = readFileSync(new URL("../webapp/static/mv-generation.js", import.meta.url), "utf8");
const main = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
const tick = () => new Promise(resolve => setImmediate(resolve));
const fixture = () => ({
  id: "workflow", name: "Fixture", mv_revision: "revision", model: "ltx-2.3-distilled-q4",
  created_at: 1, status: "draft", quality: "preview", logs: [], progress: {completed: 0, total: 2},
  mv_timeline: {start_frame: 0, end_frame: 150,
    clips: [{start_frame: 0, end_frame: 72}, {start_frame: 72, end_frame: 150}]},
  shots: ["one", "two"].map(id => ({id, title: id, prompt: `Original ${id}`, duration: 4,
    status: "pending", first_frame_id: ""})),
});

async function harness(initial = fixture()) {
  class Element {
    constructor(tag = "div") {
      this.tagName = tag; this.children = []; this.dataset = {}; this.events = {};
      this.attributes = {}; this.value = ""; this.disabled = false; this.hidden = false;
      this.classList = {toggle() {}};
    }
    append(...items) {this.children.push(...items);}
    prepend(...items) {this.children.unshift(...items);}
    replaceChildren(...items) {this.children = items;}
    addEventListener(name, callback) {this.events[name] = callback;}
    setAttribute(key, value) {this.attributes[key] = value;}
    getAttribute(key) {return this.attributes[key] ?? null;}
    removeAttribute(key) {delete this.attributes[key];}
    pause() {this.pauseCalls = (this.pauseCalls || 0) + 1;}
    load() {this.loadCalls = (this.loadCalls || 0) + 1;}
    get options() {return this.children;}
    querySelector(selector) {return this.querySelectorAll(selector)[0] || null;}
    querySelectorAll(selector) {
      const matches = element => selector.split(",").some(part => {
        const attribute = part.match(/^\[data-([a-z-]+)(?:=([a-z]+))?\]$/);
        if (!attribute) return element.tagName === part;
        const key = attribute[1].replace(/-([a-z])/g, (_, value) => value.toUpperCase());
        return key in element.dataset && (!attribute[2] || element.dataset[key] === attribute[2]);
      });
      const result = [];
      function visit(element) {
        for (const child of element.children) {
          if (matches(child)) result.push(child);
          visit(child);
        }
      }
      visit(this);
      return result;
    }
  }
  const elements = new Map();
  const element = id => {
    if (!elements.has(id)) elements.set(id, new Element());
    return elements.get(id);
  };
  const state = {project: {id: "project", revision: "project-rev", music_source_id: "song"},
    model: "ltx-2.3-distilled-q4", quality: "preview", textModel: "text",
    language: "en", analysis: {music_source_id: "song", result: {duration: 12,
      beats: [0, 2, 4, 6, 8, 10], downbeats: [0, 4, 8]}},
    dirty: false, busy: false, externalBusy: false, analysisBusy: false, images: []};
  for (const [id, value] of [["mv-start", "0"], ["mv-end", "60"], ["mv-shot-seconds", "3"]]) {
    element(id).value = value;
  }
  element("mv-form").append(new Element("input"), new Element("button"));
  const labels = ["heading", "note", "start", "end", "shotSeconds", "plan", "versions", "export", "run"].map(key => {
    const label = new Element();
    label.dataset.mvGenerationI18n = key;
    return label;
  });
  const beatLabels = ["full", "hint"].map(key => {
    const label = new Element(); label.dataset.mvBeatI18n = key; return label;
  });
  let current = structuredClone(initial), fail = "", confirm = false, holdBeats = false;
  const pendingBeats = [];
  const calls = [], timers = [], listeners = {};
  const window = {
    MiniMuvMVHost: {state: () => state, text: key => `${state.language}:${key}`,
      restoreGeneration(workflow) {state.model = workflow.model; state.quality = workflow.quality;},
      updateAvailability() {window.MiniMuvMVGeneration?.updateControls(false);}},
    confirm: () => confirm, addEventListener: (name, callback) => {listeners[name] = callback;},
    setTimeout(callback, delay) {
      if (delay === 250) {setImmediate(callback); return -1;}
      timers.push(callback); return timers.length;
    }, clearTimeout() {},
  };
  const context = vm.createContext({
    window,
    Option: class extends Element {
      constructor(label, value) {super("option"); this.textContent = label; this.value = value;}
    },
    document: {querySelector: selector => element(selector.slice(1)),
      querySelectorAll: selector => selector === "[data-mv-delete-i18n]" ? [] :
        selector === "[data-mv-beat-i18n]" ? beatLabels : labels,
      createElement: tag => new Element(tag)},
    fetch: async (url, options) => {
      const payload = options.body ? JSON.parse(options.body) : null;
      calls.push({url, payload, method: options.method || "GET"});
      if (fail && url.endsWith(fail)) return {ok: false, json: async () => ({error: "fixture_error"})};
      if (options.method === "DELETE") {
        current = null;
        return {ok: true, json: async () => ({deleted: ["workflow"], delete_media: false})};
      }
      if (url.endsWith("/beat-plan")) {
        const response = {ok: true, json: async () => ({plan: {
        total_duration: payload.end - payload.start, shot_count: 2,
        clips: [{start_frame: payload.start * 24, end_frame: 72, duration: 3},
          {start_frame: 72, end_frame: payload.end * 24, duration: 9}],
        }})};
        if (holdBeats) return new Promise(resolve => pendingBeats.push(() => resolve(response)));
        return response;
      }
      if (url.endsWith("/workflows")) return {ok: true, json: async () => ({items: current ? [current] : []})};
      if (url.endsWith("/storyboard")) current = fixture();
      if (url.endsWith("/mv-update")) {
        assert.equal(payload.revision, current.mv_revision);
        current.shots = current.shots.map((shot, index) => ({...shot, ...payload.shots[index]}));
        current.mv_revision = "updated";
      }
      if (url.endsWith("/videos") || url.endsWith("/mv-run") || url.endsWith("/generate") || url.endsWith("/assemble")) {
        current.status = "queued";
      }
      if (url.endsWith("/cancel")) current.status = "cancelled";
      return {ok: true, json: async () => ({workflow: structuredClone(current)})};
    },
  });
  vm.runInContext(script, context);
  await tick();
  return {window, state, calls, element, timers, labels, beatLabels, listeners,
    holdBeats: () => {holdBeats = true;}, pendingBeats,
    fail: value => {fail = value;}, confirm: value => {confirm = value;},
    current: value => {current = value;}};
}

test("host is available before deferred controller starts, without clicking MV", () => {
  assert.match(main, /loadMVMusicSources\(\);\s*\}\);\s*window\.MiniMuvMVHost =/);
  assert.ok(html.indexOf('src="/app.js"') < html.indexOf('src="/mv-generation.js"'));
});

test("the whole MV storyboard uses one disclosure without replacing its editing controls", () => {
  assert.equal((html.match(/data-mv-generation-i18n="heading"/g) || []).length, 1);
  assert.match(html, /<details id="mv-storyboard-settings" class="workflow-soundtrack storyboard-settings" open>/);
  assert.match(html, /<div id="mv-generation" class="mv-analysis mv-generation-content">/);
  assert.match(html, /<section id="mv-beat-settings" class="mv-storyboard-group">/);
  assert.doesNotMatch(html, /<details id="mv-generation"|<details id="mv-beat-settings"/);
  const start = html.indexOf('id="mv-storyboard-settings"');
  const end = html.indexOf('</details>\n              <section class="mv-storyboard-results">', start);
  const section = html.slice(start, end);
  for (const id of ["mv-beat-settings", "mv-start", "mv-end", "mv-shot-seconds", "mv-plan"]) {
    assert.ok(section.includes(`id="${id}"`));
  }
  for (const id of ["mv-workflow-list", "mv-shots", "mv-generation-cancel"]) {
    assert.ok(!section.includes(`id="${id}"`));
  }
  assert.ok(!section.includes('id="mv-generation-logs"'));
  assert.ok(!script.includes('node("mv-generation").open'));
});

test("saved versions, generation actions and shot results follow the settings disclosure", () => {
  const start = html.indexOf('<section class="mv-storyboard-results">');
  const end = html.indexOf("</section>\n              </form>", start);
  const results = html.slice(start, end);
  for (const id of ["mv-generation-status", "mv-workflow-list", "mv-shots-save", "mv-shots-delete",
    "mv-videos", "mv-export", "mv-run", "mv-generation-cancel", "mv-shot-list", "mv-shots"]) {
    assert.ok(results.includes(`id="${id}"`));
  }
});

test("all MV shot cards belong to a separately collapsible list", () => {
  assert.match(html, /<details id="mv-shot-list" class="workflow-soundtrack storyboard-settings" open>\s*<summary>[\s\S]*?data-i18n="workflowShots"[\s\S]*?<\/summary>\s*<div id="mv-shots" class="workflow-shots"><\/div>\s*<\/details>/);
  assert.ok(!script.includes('node("mv-shot-list").open'));
});

test("polling updates individual shot states and previews before the entire MV ends", async () => {
  const current = fixture();
  current.status = "running";
  current.shots[0].status = "running";
  current.active_job = {status: "loading", progress: null};
  const h = await harness(current);
  const cards = [...h.element("mv-shots").children];
  const firstStatus = cards[0].querySelector("[data-shot-status]");
  assert.equal(firstStatus.textContent, "en:workflowStatusRunning");
  assert.equal(cards[1].querySelector("[data-shot-status]").textContent, "en:workflowStatusQueued");
  assert.equal(cards[0].querySelector("[data-shot-progress]").hidden, false);
  assert.equal(cards[0].querySelector("[data-shot-video-preview]").hidden, true);
  const prompt = cards[0].querySelector("[data-field=prompt]");
  current.active_job = {status: "running", progress: {step: 2, total: 8}, segment: {current: 1, total: 2}};
  h.current(structuredClone(current));
  await h.timers.shift()();
  assert.equal(cards[0].querySelector("[data-shot-progress]").value, 2);
  assert.equal(cards[0].querySelector("[data-shot-progress]").max, 8);
  assert.match(cards[0].querySelector("[data-shot-progress-details]").textContent, /2\/8/);
  current.shots[0] = {...current.shots[0], status: "completed",
    video_url: "/clip-one.mp4?v=one", last_frame_url: "/tail-one.png"};
  current.shots[1] = {...current.shots[1], status: "running", first_frame_source: "previous"};
  cards[1].querySelector("[data-field=frame]").value = "__previous__";
  h.current(structuredClone(current));
  await h.timers.shift()();
  const video = cards[0].querySelector("[data-shot-video-preview]");
  assert.equal(video.hidden, false);
  assert.equal(video.getAttribute("src"), "/clip-one.mp4?v=one");
  assert.equal(video.loadCalls, 1);
  assert.equal(firstStatus.textContent, "en:workflowStatusCompleted");
  assert.equal(cards[1].querySelector("[data-shot-status]").textContent, "en:workflowStatusRunning");
  assert.equal(cards[1].querySelector("[data-shot-frame-preview]").getAttribute("src"), "/tail-one.png");
  assert.equal(h.element("mv-shots").children[0], cards[0]);
  assert.equal(cards[0].querySelector("[data-field=prompt]"), prompt);
  await h.timers.shift()();
  assert.equal(video.loadCalls, 1);
  assert.equal(video.pauseCalls, 1);
  current.status = "completed";
  current.shots[1] = {...current.shots[1], status: "completed", video_url: "/clip-two.mp4?v=two"};
  h.current(current);
  await h.timers.shift()();
  assert.equal(h.element("mv-shots").children[0], cards[0]);
  assert.equal(video.loadCalls, 1);
  assert.equal(cards[1].querySelector("[data-shot-video-preview]").getAttribute("src"), "/clip-two.mp4?v=two");
  assert.equal(cards[1].querySelector("[data-shot-progress]").hidden, true);
});

test("regeneration hides stale preview and failed polling retains error on the same card", async () => {
  const current = fixture();
  current.status = "running";
  current.shots[0] = {...current.shots[0], status: "completed", video_url: "/old.mp4?v=old"};
  const h = await harness(current);
  const card = h.element("mv-shots").children[0];
  const video = card.querySelector("[data-shot-video-preview]");
  current.shots[0] = {...current.shots[0], status: "running", video_url: ""};
  h.current(structuredClone(current));
  await h.timers.shift()();
  assert.equal(video.hidden, true);
  assert.equal(video.getAttribute("src"), null);
  current.shots[0] = {...current.shots[0], status: "completed", video_url: "/new.mp4?v=new"};
  h.current(structuredClone(current));
  await h.timers.shift()();
  assert.equal(video.getAttribute("src"), "/new.mp4?v=new");
  current.status = "failed";
  current.shots[1] = {...current.shots[1], status: "failed", error: "model failure"};
  h.current(current);
  await h.timers.shift()();
  const failed = h.element("mv-shots").children[1];
  assert.equal(failed.querySelector("[data-shot-status]").textContent, "en:workflowStatusFailed");
  assert.equal(failed.querySelector("[data-shot-error]").textContent, "model failure");
  assert.equal(failed.querySelector("[data-shot-error]").hidden, false);
  assert.equal(failed.querySelector("[data-shot-progress]").hidden, true);
  assert.equal(h.element("mv-shots").children[0], card);
  assert.equal(video.hidden, false);
});

test("deleting the selected storyboard keeps media and allows planning and saving again", async () => {
  const h = await harness();
  h.element("mv-shots-delete").events.click();
  assert.equal(h.calls.some(call => call.method === "DELETE"), false);
  h.confirm(true);
  await h.element("mv-shots-delete").events.click();
  const deletion = h.calls.find(call => call.method === "DELETE");
  assert.equal(deletion.url, "/api/workflows/workflow");
  assert.equal(deletion.payload.delete_media, false);
  assert.equal(h.element("mv-shots").children.length, 0);
  assert.equal(h.element("mv-shots-delete").disabled, true);
  assert.equal(h.element("mv-shots-save").disabled, true);
  assert.equal(h.element("mv-plan").disabled, false);
  await h.element("mv-plan").events.click();
  assert.equal(h.element("mv-shots").children.length, 2);
  const prompt = h.element("mv-shots").children[0].querySelector("[data-field=prompt]");
  prompt.value = "New storyboard edit";
  prompt.events.input();
  await h.element("mv-shots-save").events.click();
  assert.equal(h.calls.find(call => call.url.endsWith("/mv-update")).payload.shots[0].prompt, "New storyboard edit");
});

test("delete failures retain edited shots and active workflows cannot be deleted", async () => {
  const h = await harness();
  const prompt = h.element("mv-shots").children[0].querySelector("[data-field=prompt]");
  prompt.value = "Keep this edit";
  prompt.events.input();
  h.confirm(true);
  h.fail("/workflow");
  await h.element("mv-shots-delete").events.click();
  assert.equal(prompt.value, "Keep this edit");
  assert.equal(h.element("mv-shots").children.length, 2);
  assert.match(h.element("mv-generation-status").textContent, /fixture_error/);
  const active = fixture(); active.status = "running";
  const running = await harness(active);
  running.confirm(true);
  assert.equal(running.element("mv-shots-delete").disabled, true);
  await running.element("mv-shots-delete").events.click();
  assert.equal(running.calls.some(call => call.method === "DELETE"), false);
});

test("MV logs follow the right preview canvas and use the shared log panel", async () => {
  assert.ok(html.indexOf('id="mv-log-panel"') > html.indexOf('id="preview"'));
  assert.ok(html.indexOf('id="mv-log-panel"') < html.indexOf('id="log-panel"'));
  assert.match(html, /id="mv-log-panel" class="log-panel"/);
  assert.equal((html.match(/id="mv-generation-logs"/g) || []).length, 1);
  const h = await harness();
  assert.equal(h.element("mv-log-panel").hidden, false);
  assert.match(h.element("mv-generation-logs").textContent, /ltx-2.3-distilled-q4/);
  assert.equal(h.element("mv-log-live").hidden, true);
  h.element("mv-panel").hidden = true;
  h.window.MiniMuvMVGeneration.updateControls();
  assert.equal(h.element("mv-log-panel").hidden, true);
  h.element("mv-panel").hidden = false;
  await h.element("mv-videos").events.click();
  assert.equal(h.element("mv-log-panel").hidden, false);
  assert.equal(h.element("mv-log-live").hidden, false);
});

test("fourteen languages localize controls while retaining edited shot values", async () => {
  const h = await harness();
  const title = h.element("mv-shots").children[0].querySelector("[data-field=title]");
  title.value = "Unsaved title";
  title.events.input();
  assert.equal(h.window.MiniMuvMVGeneration.canLeave(), false);
  for (const language of ["en", "zh-CN", "zh-TW", "fr", "de", "ja", "ko", "es", "pt", "tr", "ar", "vi", "id", "ru"]) {
    h.state.language = language;
    h.window.MiniMuvMVGeneration.localize();
    assert.ok(h.labels.every(label => label.textContent));
    assert.ok(h.beatLabels.every(label => label.textContent));
    assert.equal(title.value, "Unsaved title");
    assert.equal(title.attributes["aria-label"], `${language}:workflowShotTitle`);
    assert.equal(h.element("mv-generation-logs").attributes["aria-label"], `${language}:generationLog`);
  }
});

test("analysis arrival enables planning, clamps only invalid end and preserves valid inputs", async () => {
  const h = await harness(null);
  h.state.analysis = null;
  h.window.MiniMuvMVGeneration.updateControls();
  assert.equal(h.element("mv-plan").disabled, true);
  h.state.analysis = {music_source_id: "song", result: {duration: 7.39}};
  h.element("mv-end").value = "60";
  h.window.MiniMuvMVGeneration.updateControls();
  assert.equal(h.element("mv-end").value, 177 / 24);
  assert.equal(h.element("mv-plan").disabled, true);
  await tick();
  assert.equal(h.element("mv-plan").disabled, false);
  h.element("mv-end").value = "5";
  h.window.MiniMuvMVGeneration.updateControls();
  assert.equal(h.element("mv-end").value, "5");
  h.state.analysisBusy = true;
  h.window.MiniMuvMVGeneration.updateControls();
  assert.equal(h.element("mv-plan").disabled, true);
});

test("planning sends source revision and fixed model timing settings", async () => {
  const h = await harness(null);
  await h.element("mv-plan").events.click();
  const call = h.calls.find(item => item.url.endsWith("/storyboard"));
  assert.deepEqual(call.payload, {revision: "project-rev", text_model: "text",
    model: "ltx-2.3-distilled-q4", quality: "preview", start: 0, end: 12, shot_seconds: 3});
  assert.equal(h.element("mv-shots").children.length, 2);
});

test("audio duration defaults to the entire source, independent of beat preview success", async () => {
  const h = await harness(null);
  h.holdBeats(true);
  h.state.analysis.result.duration = 183.39;
  h.window.MiniMuvMVGeneration.updateControls();
  assert.equal(h.element("mv-start").value, 0);
  assert.equal(h.element("mv-end").value, 4401 / 24);
  assert.equal(h.element("mv-planned-duration").value, "183.375");
  assert.equal(h.element("mv-planned-count").value, "");
  assert.equal(h.element("mv-plan").disabled, true);
  h.element("mv-start").value = "10";
  h.element("mv-end").value = "90";
  h.element("mv-end").events.input();
  assert.equal(h.element("mv-planned-duration").value, "80.000");
  await h.window.MiniMuvMVGeneration.refresh();
  assert.equal(h.element("mv-end").value, "90");
  h.holdBeats(false);
  h.fail("beat-plan");
  h.element("mv-beat-refresh").events.click();
  await tick();
  assert.equal(h.element("mv-planned-duration").value, "80.000");
  assert.equal(h.element("mv-plan").disabled, true);
  h.state.project = {...h.state.project, id: "next", music_source_id: "other"};
  h.window.MiniMuvMVGeneration.updateControls();
  assert.equal(h.element("mv-planned-duration").value, "");
  assert.equal(h.element("mv-end").value, "");
  h.state.analysis = {music_source_id: "other", result: {duration: 75}};
  h.window.MiniMuvMVGeneration.updateControls();
  assert.equal(h.element("mv-start").value, 0);
  assert.equal(h.element("mv-end").value, 75);
  assert.equal(h.element("mv-planned-duration").value, "75.000");
});

test("exact beat preview updates count and duration, full audio and failures gate planning", async () => {
  const h = await harness(null);
  assert.equal(h.element("mv-planned-count").value, 2);
  assert.equal(h.element("mv-planned-duration").value, "12.000");
  assert.equal(h.element("mv-beat-preview").children.length, 2);
  assert.equal(h.calls.filter(call => call.url.endsWith("/storyboard")).length, 0);
  h.element("mv-start").value = "2";
  h.element("mv-start").events.input();
  assert.equal(h.element("mv-plan").disabled, true);
  assert.equal(h.element("mv-planned-count").value, "");
  await tick();
  assert.equal(h.element("mv-planned-duration").value, "10.000");
  h.element("mv-full-song").events.click();
  await tick();
  assert.equal(h.element("mv-start").value, 0);
  assert.equal(h.element("mv-end").value, 12);
  h.fail("beat-plan");
  h.element("mv-beat-refresh").events.click();
  await tick();
  assert.equal(h.element("mv-plan").disabled, true);
  assert.match(h.element("mv-beat-status").textContent, /fixture_error/);
  h.fail("");
  h.element("mv-beat-refresh").events.click();
  await tick();
  assert.equal(h.element("mv-plan").disabled, false);
  h.state.dirty = true;
  h.window.MiniMuvMVGeneration.updateControls();
  assert.equal(h.element("mv-planned-count").value, "");
  assert.equal(h.element("mv-plan").disabled, true);
});

test("older beat previews cannot overwrite new settings or a changed source", async () => {
  const h = await harness(null);
  h.holdBeats();
  h.element("mv-end").value = "9";
  h.element("mv-end").events.input();
  await tick();
  h.element("mv-end").value = "7";
  h.element("mv-end").events.input();
  await tick();
  h.pendingBeats[1]();
  await tick();
  assert.equal(h.element("mv-planned-duration").value, "7.000");
  h.pendingBeats[0]();
  await tick();
  assert.equal(h.element("mv-planned-duration").value, "7.000");
  h.element("mv-end").value = "6";
  h.element("mv-end").events.input();
  await tick();
  h.state.analysis.music_source_id = "different";
  h.window.MiniMuvMVGeneration.updateControls();
  h.pendingBeats[2]();
  await tick();
  assert.equal(h.element("mv-planned-count").value, "");
  assert.equal(h.element("mv-plan").disabled, true);
});

test("save failures keep edited prompts and version; subsequent render saves first", async () => {
  const h = await harness();
  const prompt = h.element("mv-shots").children[0].querySelector("[data-field=prompt]");
  prompt.value = "Edited ocean";
  prompt.events.input();
  h.fail("mv-update");
  await h.element("mv-shots-save").events.click();
  assert.equal(prompt.value, "Edited ocean");
  assert.match(h.element("mv-generation-status").textContent, /fixture_error/);
  assert.equal(h.window.MiniMuvMVGeneration.canLeave(), false);
  h.fail("");
  await h.element("mv-videos").events.click();
  const posts = h.calls.filter(item => item.payload);
  assert.equal(posts.at(-2).url, "/api/workflows/workflow/mv-update");
  assert.deepEqual(posts.at(-2).payload.shots[0], {id: "one", title: "one", prompt: "Edited ocean",
    first_frame_id: "", first_frame_source: "none"});
  assert.equal(posts.at(-1).url, "/api/workflows/workflow/videos");
  assert.equal(h.window.MiniMuvMVGeneration.active(), true);
  assert.equal(h.element("mv-form").children[0].disabled, true);
  assert.equal(h.element("mv-generation-cancel").disabled, false);
});

test("MV planning includes the selected MV visual Skill bindings", async () => {
  const h = await harness(null);
  const refs = {skills: [{id: "skill", revision: "exact"}], target_model: h.state.model};
  h.window.MiniMuvSkills = {selection(scope) {assert.equal(scope, "mv-prompt"); return refs;}};
  await h.element("mv-plan").events.click();
  assert.deepEqual(h.calls.find(call => call.url.endsWith("/storyboard")).payload.skills, refs.skills);
});

test("opening images preview immediately and subsequent shots can chain the previous tail", async () => {
  const current = fixture();
  current.shots[0].last_frame_url = "/tail.png";
  current.shots[1].first_frame_source = "previous";
  const h = await harness(current);
  h.state.images = [{id: "image", image_url: "/chosen.png", name: "Selected"}];
  await h.window.MiniMuvMVGeneration.refresh();
  const cards = h.element("mv-shots").children;
  const first = cards[0].querySelector("[data-field=frame]");
  assert.ok(!first.options.some(option => option.value === "__previous__"));
  first.value = "image";
  first.events.change();
  assert.equal(cards[0].querySelector("[data-shot-frame-preview]").src, "/chosen.png");
  assert.equal(cards[0].querySelector("[data-shot-frame-preview]").hidden, false);
  const second = cards[1].querySelector("[data-field=frame]");
  assert.equal(second.value, "__previous__");
  assert.equal(cards[1].querySelector("[data-shot-frame-preview]").src, "/tail.png");
  await h.element("mv-shots-save").events.click();
  const payload = h.calls.find(call => call.url.endsWith("/mv-update")).payload;
  assert.equal(payload.shots[0].first_frame_source, "image");
  assert.equal(payload.shots[1].first_frame_source, "previous");
  assert.equal(payload.shots[1].first_frame_id, "");
});

test("cancellation retains completed materials and restores source controls", async () => {
  const current = fixture();
  current.status = "running";
  current.shots[0].status = "completed";
  current.shots[0].video_url = "/clip.mp4";
  const h = await harness(current);
  assert.equal(h.window.MiniMuvMVGeneration.canLeave(), false);
  await h.element("mv-generation-cancel").events.click();
  assert.equal(h.window.MiniMuvMVGeneration.active(), false);
  assert.equal(h.element("mv-form").children[0].disabled, false);
  assert.equal(h.element("mv-shots").children[0].querySelector("video").getAttribute("src"), "/clip.mp4");
});

test("completion polling publishes final video; failures are visible and retried", async () => {
  const current = fixture();
  current.status = "running";
  const h = await harness(current);
  h.fail("workflow");
  await h.timers.shift()();
  assert.match(h.element("mv-generation-status").textContent, /workflowPollRetry/);
  h.fail("");
  current.status = "completed";
  current.output_url = "/final.mp4?v=revision";
  current.shots.forEach(shot => {shot.status = "completed";});
  h.current(current);
  await h.timers.shift()();
  assert.equal(h.window.MiniMuvMVGeneration.preview().video_url, current.output_url);
  assert.equal(h.element("mv-download").href, current.output_url);
  assert.equal(h.element("mv-export").disabled, false);
});
