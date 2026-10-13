import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

const app = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
const render = app.slice(app.indexOf("function renderImageCandidates("), app.indexOf("function renderJob("));

function harness() {
  const node = () => ({dataset: {}, hidden: true, textContent: "", loads: 0, pauses: 0,
    children: [], removeAttribute(key) {delete this[key];}, pause() {this.pauses++;}, load() {this.loads++;},
    replaceChildren(...children) {this.children = children;},
    querySelectorAll() {return this.children;}});
  const links = {"#download-video": node(), "#download-audio": node()};
  const imageCandidates = node();
  const context = vm.createContext({
    activeMode: "video", currentJob: null, currentWorkflow: null,
    video: node(), image: node(), audio: node(), imageDownloadLink: node(),
    imageCandidates,
    emptyState: node(), loadingState: node(), resultFooter: node(),
    statusChip: node(), loadingTitle: node(), cancelButton: node(),
    languageSelect: {value: "en"},
    window: {}, document: {
      querySelector: id => links[id],
      createElement: tag => {
        const element = node();
        element.tagName = tag.toUpperCase();
        element.setAttribute = function(key, value) {this[key] = value;};
        element.append = function(child) {this.children.push(child);};
        element.addEventListener = function(_, handler) {this.click = handler;};
        return element;
      },
    }, t: key => key
  });

  vm.runInContext(render, context);
  return {context, links, render: () => context.refreshResultPreview()};
}

test("image candidates render as selectable downloads", () => {
  const h = harness(), c = h.context;
  c.activeMode = "image";
  c.currentJob = {id: "job", kind: "image", status: "completed", image_url: "/one.png",
    image_urls: ["/one.png", "/two.png", "/three.png"]};
  h.render();
  assert.equal(c.imageCandidates.hidden, false);
  assert.equal(c.imageCandidates.children.length, 3);
  c.imageCandidates.children[1].click();
  assert.equal(c.image.src, "/two.png");
  assert.equal(c.imageDownloadLink.href, "/two.png");
  assert.equal(c.imageCandidates.children[1]["aria-pressed"], "true");
});

test("all six modes preview completed final media in the shared canvas", () => {
  for (const mode of ["video", "image", "music", "workflow", "mv", "podcast"]) {
    const h = harness(), c = h.context;
    c.activeMode = mode;
    const result = {kind: mode, status: "completed", video_url: "/final.mp4",
      image_url: "/final.png", audio_url: "/final.wav"};
    const media = mode === "image" ? "image" : ["music", "podcast"].includes(mode) ? "audio" : "video";
    for (const key of ["video", "image", "audio"]) if (key !== media) delete result[`${key}_url`];
    if (mode === "mv") c.window.MiniMuvMVGeneration = {preview: () => result};
    else if (mode === "podcast") c.window.MiniMuvPodcast = {preview: () => result};
    else if (mode === "workflow") c.currentWorkflow = {...result, output_url: result.video_url};
    else c.currentJob = result;
    h.render();
    assert.equal(c[media].hidden, false, mode);
    assert.equal(c[media].src, result[`${media}_url`], mode);
    assert.equal(c.emptyState.hidden, true);
    assert.equal(c.loadingState.hidden, true);
    assert.equal(c.resultFooter.hidden, false);
    const pauses = c[media].pauses;
    h.render();
    assert.equal(c[media].pauses, pauses, "same result does not reload playback");
  }
});

test("mode switches pause and clear unrelated media; late jobs cannot replace MV", () => {
  const h = harness(), c = h.context;
  c.currentJob = {kind: "video", status: "completed", video_url: "/old.mp4"};
  h.render();
  c.activeMode = "mv";
  c.window.MiniMuvMVGeneration = {preview: () => ({status: "completed", video_url: "/mv.mp4"})};
  h.render();
  c.currentJob = {kind: "video", status: "completed", video_url: "/late.mp4"};
  h.render();
  assert.equal(c.video.src, "/mv.mp4");
  c.activeMode = "podcast";
  h.render();
  assert.equal(c.video.hidden, true);
  assert.equal(c.video.src, undefined);
  assert.equal(c.emptyState.hidden, false);
  assert.equal(h.links["#download-video"].href, undefined);
});

test("completed-without-media and failed jobs show no phantom result", () => {
  const h = harness(), c = h.context;
  for (const status of ["completed", "failed", "running"]) {
    c.currentJob = {kind: "video", status};
    h.render();
    assert.equal(c.video.hidden, true);
    assert.equal(c.resultFooter.hidden, true);
    assert.equal(c.loadingState.hidden, status !== "running");
    assert.equal(c.emptyState.hidden, status === "running");
  }
  assert.doesNotMatch(html, /id="mv-final"|id="podcast-audio"/);
  assert.match(html, /data-history-filter="podcast"/);
});

test("podcast history filter has a localized label in every supported language", () => {
  const languages = ["zh-CN", "en", "zh-TW", "fr", "de", "ja", "ko", "es", "pt", "tr", "ar", "vi", "id", "ru"];
  const historyTranslations = Object.fromEntries(languages.map(language => [language, {}]));
  const context = vm.createContext({historyTranslations, Object});
  vm.runInContext(app.slice(app.indexOf("const historyModeTranslations"), app.indexOf("const settingsDialog")), context);
  for (const language of languages) {
    assert.equal(typeof historyTranslations[language].modePodcast, "string");
    assert.notEqual(historyTranslations[language].modePodcast, "modePodcast");
  }
});
