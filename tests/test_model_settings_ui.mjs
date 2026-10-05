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
    setPromptEnhancerStatus() {}, updateGenerateAvailability() {}, t: key => key,
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
    historyItems: items, historyFilter: "all", historyList: node(),
    historyCount: node(), historyStatus: node(), currentJob: null,
    historyDeleteBusy: false, languageSelect: { value: "en" },
    videoModelChoice: { value: "h3" }, imageModelChoice: { value: "hidream" },
    musicModelChoice: { value: "music3" }, document: { createElement: node },
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
    Option: function(text, value) { this.text = text; this.value = value; }
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

test("Music3 exposes a five-minute ceiling without forwarding it to YuE2", () => {
  const options = html.match(/<select id="music-duration">([\s\S]*?)<\/select>/)[1];
  const values = [...options.matchAll(/value="(\d+)"/g)].map(match => Number(match[1]));
  assert.equal(Math.max(...values), 300);
  assert.ok(values.includes(180));
  assert.ok(values.includes(240));
  assert.match(source, /duration: isYueMusicModel\(\) \? 30 : Number\(document\.querySelector\("#music-duration"\)\.value\)/);
});

test("composer cards follow all model selectors and language refreshes", () => {
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
  let heading = "Local model";
  const context = vm.createContext({
    document: { querySelector: query }, modelInfo: info,
    videoModelChoice: video, imageModelChoice: image, musicModelChoice: music,
    t: key => key === "modelSettings" ? heading : "Path: "
  });
  vm.runInContext(source.slice(source.indexOf("function updateSelectedModelCards("),
    source.indexOf("function updateGenerateAvailability(")), context);
  context.updateSelectedModelCards();
  assert.equal(query("#video-model-source").href, "https://huggingface.co/h3");
  assert.equal(query("#workflow-video-model-source").href, "https://huggingface.co/h3");
  assert.equal(query("#workflow-music-model-source").href, "https://huggingface.co/music3");
  assert.equal(query("#music-model-summary").textContent, "Local model · Music3");
  for (let repeat = 0; repeat < 2; repeat++) {
    video.value = "ltx"; image.value = "flux"; music.value = "yue2";
    context.updateSelectedModelCards();
    assert.equal(query("#video-model-summary").textContent, `${heading} · LTX Q8`);
    assert.equal(query("#image-model-summary").textContent, `${heading} · FLUX`);
    assert.equal(query("#music-model-summary").textContent, `${heading} · YuE2`);
    assert.equal(query("#music-model-source").href, "https://huggingface.co/yue2");
    assert.equal(query("#image-model-source").href, "https://huggingface.co/flux");
    assert.equal(query("#video-model-source").href, "https://huggingface.co/ltx");
    assert.equal(query("#workflow-video-model-summary").textContent, `${heading} · LTX Q8`);
    assert.equal(query("#workflow-video-model-source").href, "https://huggingface.co/ltx");
    assert.equal(query("#workflow-music-model-source").href, "https://huggingface.co/yue2");
    assert.equal(query("#music-model-path").textContent, "Path: /yue2");
    video.value = "h3"; image.value = "hidream"; music.value = "music3";
    context.updateSelectedModelCards();
    assert.equal(query("#music-model-source").href, "https://huggingface.co/music3");
    heading = "本地模型";
  }
  delete info.music.model_download_url;
  context.updateSelectedModelCards();
  assert.equal(query("#music-model-source").hidden, true);
  assert.equal(query("#music-model-source").href, undefined);
  assert.match(source, /musicNote\.dataset\.i18n = yue \? "musicYueNote" : "musicComputeNote"/);
  for (const mode of ["video", "image", "music"]) {
    assert.ok(html.includes(`id="${mode}-model-summary"`));
  }
  assert.equal(query("#workflow-music-model-source").hidden, true);
  assert.equal(query("#workflow-music-model-source").href, undefined);
});

test("all generation model-card links live in model settings, never download notices", () => {
  for (const id of ["video", "image", "music", "workflow-video", "workflow-music"]) {
    assert.match(html, new RegExp(
      `<details class="model-settings">\\s*<summary id="${id}-model-summary">[\\s\\S]*?` +
      `<a id="${id}-model-source"[^>]*target="_blank"[^>]*rel="noreferrer"[^>]*hidden></a>\\s*(?:<div[^>]*></div>\\s*)?</details>`
    ));
  }
  for (const id of ["model-notice", "image-model-notice", "music-model-notice"]) {
    const notice = html.slice(html.indexOf(`id="${id}"`), html.indexOf("</div>\n", html.indexOf(`id="${id}"`)));
    assert.doesNotMatch(notice, /model-source-link|image-model-links|music-model-links/);
  }
  const renderers = source.slice(source.indexOf("function renderModelInfo("),
    source.indexOf("function formatGenerationMetrics("));
  assert.doesNotMatch(renderers, /add(?:Image|Music)?ModelLink\([^;\n]*model_download_url/);
  assert.match(renderers, /addModelLink\(t\("runtimeDownload"\), info.runtime_download_url\)/);
  assert.match(renderers, /addImageModelLink\(t\("imageCodeLink"\), info.code_download_url\)/);
  assert.match(source, /cards = mode === "image" \? \[mode\] : \[mode, `workflow-\$\{mode\}`\]/);
});

test("registry populates labels, preserves choices, and reflects enabled changes", () => {
  const h = harness();
  const options = {
    video: [{id: "h3", name: "My H3", enabled: true},
      {id: "ltx", name: "Local LTX", enabled: true}],
    image: [{id: "hidream", name: "My image", enabled: true}]
  };
  h.populate(options);
  assert.equal(h.video.value, "h3");
  assert.equal(h.video.options[0].text, "My H3");
  h.video.value = "ltx";
  h.populate(options);
  assert.equal(h.video.value, "ltx");
  options.video[1].enabled = false;
  options.video[1].name = "Renamed LTX";
  h.populate(options);
  assert.equal(h.video.value, "ltx");
  assert.equal(h.video.options[1].disabled, true);
  assert.equal(h.video.options[1].text, "Renamed LTX");
  assert.ok(source.includes("!ready || disabledModel"));
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
  assert.match(open, /populateSettings\(data.settings\);\s+settingsSaveButton.disabled = false/);
});

test("model cards retain their service controls and notices across settings reloads", () => {
  const nodes = new Map();
  function node() {
    return {
      children: [], dataset: {}, value: "",
      append(...children) { this.children.push(...children); },
      replaceChildren(...children) { this.children = children; },
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
    t: key => key, modelInfo: null, renderModelDownload() {}
  });
  vm.runInContext(source.slice(source.indexOf("function populateSettings("),
    source.indexOf("async function controlModelDownload(")), context);
  const settings = {
    output_directory: "/output", gemma_path: "/gemma",
    models: {
      h3: { enabled: true, name: "H3", model_path: "/h3" },
      hidream: { enabled: true, name: "HiDream", model_path: "/hidream" },
      music3: { enabled: true, name: "Music3", model_path: "/music" },
      "ltx-2.3-distilled-q4": { enabled: true, name: "LTX", model_path: "/ltx" }
    },
    video: { service_url: "http://127.0.0.1:11234", model_id: "", api_params: {} },
    music: { model_path: "/music" },
    text: { service_url: "http://127.0.0.1:8000", model_ids: [], api_params: {} }
  };
  for (let reload = 0; reload < 2; reload++) {
    context.populateSettings(settings);
    const [h3, hidream, music3, ltx] = query("#settings-model-options").children;
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
    assert.equal(query("#settings-video-url").value, settings.video.service_url);
  }
  assert.match(html, /id="settings-h3-service"/);
  assert.match(html, /id="settings-hidream-notice"/);
  assert.match(html, /id="settings-music3-notice"/);
});
