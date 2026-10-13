import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");

test("text model settings remove newline and semicolon separators and duplicates", () => {
  const expression = source.match(/model_ids: ([\s\S]*?),\n\s*api_params:/)[1];
  const context = vm.createContext({
    document: { querySelector: () => ({ value: " GLM;\nQwen；gemma;\r\nGLM; " }) }
  });
  assert.deepEqual(Array.from(vm.runInContext(expression, context)), ["GLM", "Qwen", "gemma"]);
});

test("prompt optimization and storyboarding use the same returned text model list", async () => {
  const selector = () => ({
    options: [], value: "", disabled: false,
    replaceChildren(...items) { this.options = items; this.value = items[0]?.value || ""; },
    append(item) { this.options.push(item); if (!this.value) this.value = item.value; }
  });
  const prompt = selector(), workflow = selector();
  const context = vm.createContext({
    promptEnhancerModel: prompt, workflowTextModel: workflow,
    textModelsAvailable: false, storyboardBusy: false, currentWorkflow: null,
    fetch: async () => ({ ok: true, json: async () => ({
      models: [{ id: "configured-one" }, { id: "configured-two" }]
    }) }),
    document: { createElement: () => ({
      value: "", textContent: "",
      cloneNode() { return { value: this.value, textContent: this.textContent }; }
    }) },
    setPromptEnhancerStatus() {}, syncMVPromptEnhancerModel() {}, updateGenerateAvailability() {}, t: key => key,
    window: { setTimeout() {} }
  });
  vm.runInContext(source.slice(source.indexOf("async function loadTextModels()"),
    source.indexOf("async function planWorkflowStory()")), context);
  await context.loadTextModels();
  assert.deepEqual(prompt.options.map(option => option.value), ["configured-one", "configured-two"]);
  assert.deepEqual(workflow.options.map(option => option.value), ["configured-one", "configured-two"]);
});

test("history remains shared across model changes and filters only by category", () => {
  const node = () => ({
    children: [], dataset: {},
    append(...children) { this.children.push(...children); },
    replaceChildren() { this.children = []; },
    setAttribute() {}, addEventListener() {}
  });
  const models = {
    video: ["h3", "ltx-2.3-distilled-q4", "ltx-2.3-distilled-q8"],
    image: ["hidream", "flux2-klein-4b", "z-image-turbo"],
    music: ["music3", "yue2-3b-8bit"]
  };
  const items = Object.entries(models).flatMap(([kind, names]) => names.map(model => ({
    id: model, kind, created_at: 123, generation: { model }, prompt: model,
    image_url: kind === "image" ? `/api/history/${model}/image` : ""
  })));
  const context = vm.createContext({
    window: {},
    workflowItems: [], currentWorkflow: null, mvProjects: [], currentMV: null, mvBusy: false,
    historyItems: items, historyFilter: "all", historyList: node(),
    historyCount: node(), historyStatus: node(), currentJob: null,
    historyDeleteBusy: false, languageSelect: { value: "en" },
    videoModelChoice: { value: "h3" }, imageModelChoice: { value: "hidream" },
    musicModelChoice: { value: "music3" }, document: { createElement: node, querySelector: node },
    t: key => key, formatGenerationMetrics: () => "",
    restoreHistoryItem() {}, deleteHistoryItem() {}
  });
  vm.runInContext(source.slice(source.indexOf("function renderHistory()"),
    source.indexOf("async function deleteHistoryItem(")), context);
  for (const [kind, names] of Object.entries(models)) {
    for (const model of names) {
      context[`${kind}ModelChoice`].value = model;
      context.historyFilter = "all";
      context.renderHistory();
      assert.equal(context.historyList.children.length, 8);
      context.historyFilter = kind;
      context.renderHistory();
      assert.equal(context.historyList.children.length, names.length);
    }
  }
});

function harness() {
  const selector = () => ({
    value: "", dataset: {}, options: [],
    replaceChildren() { this.options = []; this.value = ""; },
    add(option) { this.options.push(option); if (!this.value) this.value = option.value; }
  });
  const video = selector(), image = selector(), music = selector();
  const context = vm.createContext({
    videoModelChoice: video, imageModelChoice: image, musicModelChoice: music, updateLocalModelControls() {},
    Option: function(text, value) { this.text = text; this.value = value; this.dataset = {}; }
  });
  vm.runInContext(source.slice(source.indexOf("function populateModelSelectors("),
    source.indexOf("function renderModelInfo(")), context);
  return { video, image, populate: options => context.populateModelSelectors(options) };
}

test("generation selectors have no hardcoded HTML options", () => {
  for (const id of ["video-model-choice", "image-model-choice", "music-model-choice"]) {
    assert.match(html, new RegExp(`<select id="${id}"></select>`));
  }
  assert.ok(html.includes('id="settings-output-directory"'));
  assert.ok(html.includes('id="settings-model-options"'));
});

test("an archived history model remains selected but cannot be newly generated", () => {
  const h = harness();
  h.video.value = "archived";
  h.video.add({value: "archived", dataset: {historyOption: "true"}});
  h.populate({video: [{id: "current", name: "Current", enabled: true}]});
  assert.equal(h.video.value, "archived");
  assert.equal(h.video.options.find(option => option.value === "archived").disabled, true);
});

test("all generation selectors share an expandable card across generation modes", () => {
  assert.match(html, /<details id="generation-model-picker" class="generation-model-picker" open>[\s\S]*?<div id="video-model-section">[\s\S]*?<div id="image-model-section" hidden>[\s\S]*?<div id="music-model-section" hidden>[\s\S]*?<\/details>/);
  assert.equal((html.match(/id="video-model-section"/g) || []).length, 1);
  assert.equal((html.match(/id="image-model-section"/g) || []).length, 1);
  assert.equal((html.match(/id="music-model-section"/g) || []).length, 1);
  assert.match(source, /videoModelSection\.hidden = !isVideo && !isWorkflow && !isMV;/);
  assert.match(source, /imageModelSection\.hidden = !isImage;/);
  assert.match(source, /musicModelSection\.hidden = !isMusic && !isWorkflow;/);
  assert.match(source, /generationModelPicker\.hidden = !isVideo && !isImage && !isMusic && !isWorkflow && !isMV;/);
  assert.match(source, /function updateGenerationModelSummary\(\)/);
});

test("model selector card title is translated for all supported interface languages", () => {
  const context = vm.createContext({});
  const labelsSource = source.slice(source.indexOf("const modelPickerTranslations ="),
    source.indexOf("const fastH3Translations ="));
  const labels = vm.runInContext(`${labelsSource}\nmodelPickerTranslations`, context);
  assert.deepEqual(Object.keys(labels).sort(),
    ["zh-CN", "zh-TW", "en", "fr", "de", "ja", "ko", "es", "pt", "tr", "ar", "vi", "id", "ru"].sort());
  for (const [language, label] of Object.entries(labels)) {
    assert.ok(label, `${language} needs a translated model-picker title`);
  }
});

test("Music3 exposes a five-minute ceiling without forwarding it to YuE2", () => {
  const input = html.match(/<input id="music-duration"[^>]*>/)[0];
  assert.match(input, /type="number"/);
  assert.match(input, /min="1"/);
  assert.match(input, /max="300"/);
  assert.match(input, /step="1"/);
  assert.match(source, /duration: isYueMusicModel\(\) \? 30 : Number\(document\.querySelector\("#music-duration"\)\.value\)/);
});

test("model notice links follow all model selectors and language refreshes", () => {
  const nodes = new Map();
  const query = selector => {
    if (!nodes.has(selector)) nodes.set(selector, {
      textContent: "", href: "", hidden: false,
      removeAttribute(name) { delete this[name]; }
    });
    return nodes.get(selector);
  };
  const video = { value: "h3" }, image = { value: "hidream" }, music = { value: "music3" };
  const info = {
    model_path: "/h3",
    model_download_url: "https://huggingface.co/h3",
    model_options: {
      video: [{ id: "h3", name: "H3" }, { id: "ltx", name: "LTX Q8" }],
      image: [{ id: "hidream", name: "HiDream" }, { id: "flux", name: "FLUX" }],
      music: [{ id: "music3", name: "Music3" }, { id: "yue2", name: "YuE2" }]
    },
    hidream: { model_path: "/hidream", model_download_url: "https://huggingface.co/hidream" },
    music: { model_path: "/music3", model_download_url: "https://huggingface.co/music3" },
    video_models: { ltx: { model_path: "/ltx", model_download_url: "https://huggingface.co/ltx" } },
    image_models: { flux: { model_path: "/flux", model_download_url: "https://huggingface.co/flux" } },
    music_models: { yue2: { model_path: "/yue2", model_download_url: "https://huggingface.co/yue2" } }
  };
  const context = vm.createContext({
    document: { querySelector: query }, modelInfo: info,
    videoModelChoice: video, imageModelChoice: image, musicModelChoice: music,
    t: key => key
  });
  vm.runInContext(source.slice(source.indexOf("function updateSelectedModelLinks("),
    source.indexOf("function updateGenerateAvailability(")), context);
  context.updateSelectedModelLinks();
  assert.equal(query("#video-model-source").href, "https://huggingface.co/h3");
  assert.equal(query("#music-model-source").href, "https://huggingface.co/music3");
  for (let repeat = 0; repeat < 2; repeat++) {
    video.value = "ltx"; image.value = "flux"; music.value = "yue2";
    context.updateSelectedModelLinks();
    assert.equal(query("#music-model-source").href, "https://huggingface.co/yue2");
    assert.equal(query("#image-model-source").href, "https://huggingface.co/flux");
    assert.equal(query("#video-model-source").href, "https://huggingface.co/ltx");
    video.value = "h3"; image.value = "hidream"; music.value = "music3";
    context.updateSelectedModelLinks();
    assert.equal(query("#music-model-source").href, "https://huggingface.co/music3");
  }
  delete info.music.model_download_url;
  context.updateSelectedModelLinks();
  assert.equal(query("#music-model-source").hidden, true);
  assert.equal(query("#music-model-source").href, undefined);
  assert.match(source, /musicNote\.dataset\.i18n = yue \? "musicYueNote" : "musicComputeNote"/);
});

test("all generation model-card links live in model notices without standalone details", () => {
  for (const [mode, notice] of [["video", "model-notice"], ["image", "image-model-notice"],
    ["music", "music-model-notice"]]) {
    assert.match(html, new RegExp(
      `<div id="${notice}" class="model-notice"[^>]*>[\\s\\S]*?` +
      `<a id="${mode}-model-source"[^>]*target="_blank"[^>]*rel="noreferrer"[^>]*hidden></a>`
    ));
  }
  assert.doesNotMatch(html, /<details class="model-settings">/);
  assert.doesNotMatch(html, /workflow-(?:video|music)-model-source/);
  const renderers = source.slice(source.indexOf("function renderModelInfo("),
    source.indexOf("function formatGenerationMetrics("));
  assert.match(renderers, /addModelLink\(t\("runtimeDownload"\), info.runtime_download_url\)/);
  assert.match(renderers, /addImageModelLink\(t\("imageCodeLink"\), info.code_download_url\)/);
  assert.match(renderers, /updateSelectedModelLinks\(\)/);
  assert.match(source, /document\.querySelector\(`#\$\{mode\}-model-source`\)/);
});

test("registry populates labels, preserves choices, and reflects enabled changes", () => {
  const h = harness();
  const options = {
    video: [{id: "h3", name: "My H3", enabled: true},
      {id: "ltx", name: "Local LTX", enabled: true}],
    image: [{id: "hidream", name: "My image", enabled: true}]
  };
  h.populate(options);
  assert.equal(h.video.value, "ltx");
  assert.equal(h.video.options[1].text, "My H3");
  h.video.value = "ltx";
  h.populate(options);
  assert.equal(h.video.value, "ltx");
  options.video[1].enabled = false;
  options.video[1].name = "Renamed LTX";
  h.populate(options);
  assert.equal(h.video.value, "ltx");
  assert.equal(h.video.options[0].disabled, true);
  assert.equal(h.video.options[0].text, "Renamed LTX");
  assert.ok(source.includes("!ready || disabledModel"));
});

test("H3 is last without changing other priorities, registry data, or saved selections", () => {
  const h = harness();
  const options = {
    video: [
      {id: "h3", name: "MiniMax H3 8bit", enabled: true},
      {id: "q4", name: "LTX Q4", enabled: false},
      {id: "q8", name: "LTX Q8", enabled: true}
    ],
    image: [{id: "image", name: "Image", enabled: true}],
    music: [{id: "music", name: "Music", enabled: true}]
  };
  const original = JSON.stringify(options);
  h.populate(options);
  assert.deepEqual(h.video.options.map(option => option.value), ["q4", "q8", "h3"]);
  assert.equal(h.video.value, "q8");
  assert.equal(JSON.stringify(options), original);
  h.video.value = "h3";
  options.video[1].name = "Renamed Q4";
  h.populate(options);
  assert.equal(h.video.value, "h3");
  assert.equal(h.video.options.at(-1).text, "MiniMax H3 8bit");
  const fallback = harness();
  fallback.populate({video: [{id: "h3", name: "H3", enabled: true}]});
  assert.equal(fallback.video.value, "h3");
});

test("new settings labels cover all fourteen languages", () => {
  const context = vm.createContext({});
  vm.runInContext(source.slice(source.indexOf("const modelSettingsKeys ="),
    source.indexOf("const downloadStatusTranslations =")), context);
  const {keys, translations} = vm.runInContext(
    "({ keys: modelSettingsKeys, translations: modelSettingsTranslations })", context);
  assert.equal(Object.keys(translations).length, 14);
  for (const labels of Object.values(translations)) {
    assert.equal(labels.length, keys.length);
    assert.ok(labels.every(label => typeof label === "string" && label.length > 0));
  }
});

test("saving reads the registry instead of duplicate legacy path inputs", () => {
  const payload = source.slice(source.indexOf("function settingsFormPayload("),
    source.indexOf('settingsForm.addEventListener("submit"'));
  assert.match(payload, /models\.h3\.model_path/);
  assert.match(payload, /models\.hidream\.model_path/);
  assert.match(payload, /music: \{ model_path: models\.music3\.model_path \}/);
  assert.ok(!source.includes("#settings-music-path"));
  assert.ok(!html.includes('id="settings-music-path"'));
  assert.ok(!payload.includes("#settings-video-path"));
  const open = source.slice(source.indexOf("async function openSettings("),
    source.indexOf("function settingsFormPayload("));
  assert.match(open, /settingsSaveButton.disabled = true/);
  assert.match(open, /populateSettings\(data.settings, registry.model_options\);\s+settingsSaveButton.disabled = false/);
  assert.match(open, /if \(!registryResponse.ok\) throw new Error/);
});

test("model cards retain their service controls and notices across settings reloads", () => {
  const nodes = new Map();
  function node() {
    return {
      children: [], dataset: {}, value: "",
      append(...children) {
        for (const child of children) {
          if (child.parentElement) child.parentElement.children =
            child.parentElement.children.filter(item => item !== child);
          child.parentElement = this;
          this.children.push(child);
        }
      },
      replaceChildren(...children) {
        for (const child of this.children) child.parentElement = null;
        this.children = [];
        this.append(...children);
      },
      querySelectorAll(selector) {
        const matches = child => selector === "[data-model-category]" ? child.dataset.modelCategory :
          selector === "[data-model-id]" ? child.dataset.modelId :
          selector === "[data-model-field]" ? child.dataset.modelField :
          selector === ".model-category-count" ? child.className === "model-category-count" : false;
        return this.children.flatMap(child => [
          ...(matches(child) ? [child] : []), ...child.querySelectorAll(selector)
        ]);
      },
      querySelector(selector) { return this.querySelectorAll(selector)[0]; },
      events: {},
      setAttribute() {}, addEventListener(name, callback) { this.events[name] = callback; }
    };
  }
  const query = selector => {
    if (!nodes.has(selector)) nodes.set(selector, node());
    return nodes.get(selector);
  };
  const service = query("#settings-h3-service");
  const notice = query("#settings-hidream-notice");
  const musicNotice = query("#settings-music3-notice");
  const context = vm.createContext({
    document: { querySelector: query, createElement: tag => ({ ...node(), tag }) },
    t: key => key, modelInfo: { downloads: { "voice-model": { download_catalog: false } } }, renderModelDownload() {}
  });
  vm.runInContext(source.slice(source.indexOf("function populateSettings("),
    source.indexOf("async function controlModelDownload(")), context);
  const settings = {
    output_directory: "/output", gemma_path: "/gemma",
    models: {
      h3: { enabled: true, name: "H3", model_path: "/h3" },
      hidream: { enabled: true, name: "HiDream", model_path: "/hidream" },
      music3: { enabled: true, name: "Music3", model_path: "/music" },
      "voice-model": { enabled: true, name: "Voice", model_path: "/voice" },
      "ltx-2.3-distilled-q4": { enabled: true, name: "LTX", model_path: "/ltx" }
    },
    video: { service_url: "http://127.0.0.1:11234", model_id: "", api_params: {} },
    music: { model_path: "/music" },
    text: { service_url: "http://127.0.0.1:8000", model_ids: [], api_params: {} }
  };
  for (let reload = 0; reload < 2; reload++) {
    context.populateSettings(settings);
    context.populateSettings(settings, {
      video: [{ id: "h3" }, { id: "ltx-2.3-distilled-q4" }],
      image: [{ id: "hidream" }], music: [{ id: "music3" }], voice: [{ id: "voice-model" }]
    });
    const container = query("#settings-model-options");
    const [videoCategory, musicCategory, imageCategory, podcastCategory, encoderCategory, textCategory] = container.children;
    assert.deepEqual(container.children.map(group => group.dataset.modelCategory),
      ["video", "music", "image", "voice", "encoder", "text"]);
    const [h3, ltx] = videoCategory.children[1].children;
    const [hidream] = imageCategory.children[1].children;
    const [music3] = musicCategory.children[1].children;
    assert.equal(videoCategory.children[0].tag, "summary");
    assert.equal(videoCategory.querySelector(".model-category-count").textContent, "(2)");
    assert.equal(encoderCategory.children[1].children[0], query("#settings-encoders"));
    assert.equal(textCategory.children[1].children[0], query("#settings-text-service"));
    assert.equal(podcastCategory.children[1].children[0].dataset.modelId, "voice-model");
    const voiceCard = podcastCategory.children[1].children[0];
    const voiceActions = voiceCard.children[1].children.find(child => child.className === "model-download-actions");
    assert.equal(voiceActions.hidden, true, "models without a download catalog must not offer download controls");
    assert.equal(h3.tag, "details");
    assert.equal(ltx.tag, "details");
    assert.equal(h3.children[0].tag, "summary");
    assert.equal(ltx.open, true);
    assert.equal(h3.dataset.modelId, "h3");
    const h3Body = h3.children[1];
    assert.equal(h3.children[0].textContent, "h3");
    assert.equal(h3.open, true);
    assert.equal(h3Body.children.at(-1), service);
    assert.equal(h3Body.children.at(-2).id, "settings-download-h3");
    assert.ok(!ltx.children[1].children.includes(service));
    assert.equal(hidream.children[1].children.at(-1), notice);
    assert.equal(hidream.children[1].children.at(-2).id, "settings-download-hidream");
    assert.ok(!h3Body.children.includes(notice));
    assert.ok(!ltx.children[1].children.includes(notice));
    assert.equal(music3.children[1].children.at(-1), musicNotice);
    assert.equal(music3.children[1].children.at(-2).id, "settings-download-music3");
    assert.ok(!hidream.children[1].children.includes(musicNotice));
    h3.open = false;
    h3.events.invalid();
    assert.equal(h3.open, true, "invalid fields must become visible for correction");
    videoCategory.open = false;
    videoCategory.events.invalid();
    assert.equal(videoCategory.open, true, "invalid fields must reopen the outer category too");
    musicCategory.open = false;
    assert.equal(query("#settings-video-url").value, settings.video.service_url);
  }
  const extra = { enabled: true, name: "Not a video name", model_path: "/new" };
  settings.models.newVideo = extra;
  settings.models.unclassified = extra;
  context.populateSettings(settings, {
    video: [{ id: "h3" }, { id: "ltx-2.3-distilled-q4" }, { id: "newVideo" }],
    image: [{ id: "hidream" }], music: [{ id: "music3" }], voice: [{ id: "voice-model" }]
  });
  const container = query("#settings-model-options");
  const byCategory = new Map(container.children.map(group => [group.dataset.modelCategory, group]));
  assert.equal(byCategory.get("music").open, false, "refresh preserves collapsed category state");
  assert.equal(byCategory.get("video").children[1].children.at(-1).dataset.modelId, "newVideo");
  assert.equal(byCategory.get("other").children[1].children[0].dataset.modelId, "unclassified");
  const allModels = container.querySelectorAll("[data-model-id]");
  assert.equal(allModels.length, Object.keys(settings.models).length);
  for (const group of allModels) group.open = false;
  for (const group of container.children) group.open = false;
  allModels.find(group => group.dataset.modelId === "newVideo")
    .querySelectorAll("[data-model-field]").find(input => input.dataset.modelField === "name").value = "Edited";
  context.document.querySelectorAll = selector =>
    selector === "#settings-model-options [data-model-id]" ? allModels : [];
  vm.runInContext(source.slice(source.indexOf("function settingsFormPayload("),
    source.indexOf('settingsForm.addEventListener("submit"')), context);
  const payload = context.settingsFormPayload();
  assert.equal(Object.keys(payload.models).length, Object.keys(settings.models).length);
  assert.equal(payload.models.newVideo.name, "Edited");
  assert.equal(payload.models.unclassified.model_path, "/new");
  assert.equal(payload.gemma_path, "/gemma");
  assert.match(html, /id="settings-h3-service"/);
  assert.match(html, /id="settings-hidream-notice"/);
  assert.match(html, /id="settings-music3-notice"/);
});

test("model categories have fourteen localized labels and native disclosure controls", () => {
  const context = vm.createContext({});
  vm.runInContext(source.slice(source.indexOf("const modelCategoryKeys ="),
    source.indexOf("const modelSettingsKeys =")), context);
  const { keys, translations } = vm.runInContext(
    "({keys: modelCategoryKeys, translations: modelCategoryTranslations})", context);
  assert.equal(Object.keys(translations).length, 14);
  assert.equal(keys.length, 6);
  for (const values of Object.values(translations)) {
    assert.equal(values.length, keys.length);
    assert.ok(values.every(value => typeof value === "string" && value.length > 0));
  }
  const css = readFileSync(new URL("../webapp/static/app.css", import.meta.url), "utf8");
  assert.match(css, /width: min\(1180px, calc\(100vw - 28px\)\)/);
  assert.match(css, /\.model-settings-category\[open\] > summary::after \{ content: "-"; \}/);
  assert.match(css, /\.model-settings-category > summary:focus-visible/);
  assert.match(source, /modelCategoryKeys\.indexOf\(key\)/);
  assert.match(html, /id="settings-encoders"/);
  assert.match(html, /id="settings-text-service"/);
});
