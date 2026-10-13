import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/skill-installed.js", import.meta.url), "utf8");
const pure = vm.createContext({});
vm.runInContext(source.slice(0, source.indexOf("(() => {")), pure);

test("installed lifecycle and human checks are localized in fourteen languages", () => {
  const {keys, labels} = vm.runInContext("({keys:installedSkillKeys,labels:installedSkillTranslations})", pure);
  assert.equal(Object.keys(labels).length, 14);
  for (const [language, values] of Object.entries(labels)) {
    assert.equal(values.length, keys.length, language);
    assert.ok(values.every(value => typeof value === "string" && value.trim()), language);
  }
  const categories = vm.runInContext("({keys:installedCategoryKeys,labels:installedCategoryTranslations})", pure);
  assert.equal(Object.keys(categories.labels).length, 14);
  for (const [language, values] of Object.entries(categories.labels)) {
    assert.equal(values.length, categories.keys.length);
    assert.ok(values.every(value => value.trim()));
    const hint = vm.runInContext(`installedSkillText("categoryHint", ${JSON.stringify(language)})`, pure);
    assert.ok(hint.endsWith(values.at(-1)), language);
    assert.ok(hint.length > values.at(-1).length, language);
  }
});

function harness() {
  const elements = new Map();
  function element() {
    return {
      children: [], events: {}, textContent: "", value: "", dataset: {},
      append(...children) { this.children.push(...children); },
      replaceChildren(...children) { this.children = children; },
      querySelectorAll(selector) {
        const descendants = this.children.flatMap(child => [child, ...child.querySelectorAll("*")]);
        if (selector === "*") return descendants;
        if (selector === "label") return descendants.filter(child => child.tag === "label");
        if (selector.includes(":checked")) return descendants.filter(child => child.type === "checkbox" && child.checked);
        return descendants.filter(child => child.type === "button" || (selector.includes("input") && child.type === "checkbox"));
      },
      querySelector(selector) { return this.children.find(child => child.tag === selector); },
      addEventListener(event, callback) { this.events[event] = callback; }
    };
  }
  const node = selector => {
    if (!elements.has(selector)) elements.set(selector, element());
    return elements.get(selector);
  };
  node("#language").value = "en";
  const bindings = ["video", "mv", "image", "music"].map(mode =>
    ({mode, task: "prompt-enhancement", target_models: ["*"]}));
  bindings.push({mode: "long-video", task: "storyboard", target_models: ["h3"]});
  let applyAvailable;
  let items = Array.from({length: 5}, (_, index) => ({
    id: String(index), revision: `rev-${index}`, name: `Skill ${index}`, version: "1.0.0",
    description: "<img onerror=attack()>", bindings, enabled: true, available: true,
    candidate_sha256: "hash", reviewer: "reviewer"
  }));
  const requests = [], alerts = [];
  const window = {alert(message) { alerts.push(message); }, confirm: () => true};
  const context = vm.createContext({
    document: {querySelector: node, querySelectorAll: () => [], createElement: tag => ({...element(), tag})},
    window, activeMode: "video", videoModelChoice: {value: "h3"},
    imageModelChoice: {value: "hidream"}, musicModelChoice: {value: "music3"},
    async fetch(path, options) {
      requests.push({path, payload: options?.body ? JSON.parse(options.body) : undefined});
      return {ok: true, json: async () => ({items, preset_apply_available:applyAvailable,
        storage_path: "/Users/test/Library/Application Support/MiniMuv/skills"})};
    }
  });
  vm.runInContext(source, context);
  const tick = () => new Promise(resolve => setImmediate(resolve));
  const check = (scope, index, checked = true) => {
    const checkbox = node(`#${scope}-skill-list`).children[index].children[0];
    checkbox.checked = checked;
    checkbox.events.change();
  };
  const selection = scope => JSON.parse(JSON.stringify(window.MiniMuvSkills.selection(scope)));
  return {context, node, window, tick, check, selection, alerts, requests,
    setAvailable: value => {applyAvailable = value;}, setItems: value => {items = value;}, items};
}

test("preset publishing requires explicit backend capability and preserves cached CAS identity", async () => {
  const h = harness();
  await h.tick();
  assert.equal(h.window.MiniMuvSkills.applyAvailable(), false);
  const item = {...h.items[0],draft_id:"draft-1",revision:"published-revision"};
  h.setItems([item]);
  h.setAvailable(true);
  await h.window.MiniMuvSkills.refresh();
  assert.equal(h.window.MiniMuvSkills.applyAvailable(), true);
  assert.equal(h.window.MiniMuvSkills.published("draft-1").revision, "published-revision");
  assert.equal(h.window.MiniMuvSkills.published("absent"), undefined);
});

test("preset manager names and application boundary cover fourteen languages", () => {
  const {keys,labels} = vm.runInContext("({keys:presetManagerKeys,labels:presetManagerTranslations})", pure);
  assert.equal(Object.keys(labels).length, 14);
  for (const values of Object.values(labels)) {
    assert.equal(values.length, keys.length);
    assert.ok(values.every(value => value.trim()));
  }
});

test("install categories initialize visibly but stay disabled until validation", async () => {
  const h = harness();
  const options = () => h.node("#skills-category-options").children[0].children;
  assert.deepEqual(options().map(label => label.children[0].value),
    ["video", "image", "music", "long-video", "mv"]);
  assert.ok(options().every(label => label.children[0].disabled && !label.children[0].checked));
  assert.deepEqual(JSON.parse(JSON.stringify(h.window.MiniMuvSkills.installCategories())), []);
  await h.tick();
  assert.equal(h.node("#skills-installed-storage").textContent,
    "/Users/test/Library/Application Support/MiniMuv/skills");
  h.window.MiniMuvSkills.renderInstallCategories([h.items[0].bindings[0]]);
  assert.equal(options()[0].children[0].disabled, false);
  assert.equal(options()[0].children[0].checked, true);
  options()[0].children[0].checked = false;
  h.window.MiniMuvSkills.renderInstallCategories([h.items[0].bindings[0]]);
  assert.deepEqual(JSON.parse(JSON.stringify(h.window.MiniMuvSkills.installCategories())), []);
  h.window.MiniMuvSkills.renderInstallCategories();
  h.node("#language").value = "zh-CN";
  h.node("#language").events.change();
  assert.deepEqual(options().map(label => label.children[1].textContent),
    ["视频", "图像", "音乐", "长视频", "MV生成"]);
  assert.ok(options().every(label => label.children[0].disabled && !label.children[0].checked));
});

test("explicit multi-selection preserves click order and caps at four", async () => {
  const h = harness();
  await h.tick();
  assert.deepEqual(h.selection("prompt"), {});
  h.check("prompt", 3);
  h.check("prompt", 1);
  h.check("prompt", 0);
  h.check("prompt", 2);
  assert.deepEqual(h.selection("prompt").skills.map(ref => ref.id), ["3", "1", "0", "2"]);
  h.check("prompt", 4);
  assert.equal(h.alerts.length, 1);
  assert.equal(h.selection("prompt").skills.length, 4);
  h.check("prompt", 1, false);
  h.check("prompt", 4);
  assert.deepEqual(h.selection("prompt").skills.map(ref => ref.id), ["3", "0", "2", "4"]);
});

test("filters MV prompt Skills by MV binding and keeps its selection separate", async () => {
  const h = harness();
  await h.tick();
  h.check("prompt", 1);
  h.context.activeMode = "mv";
  h.window.MiniMuvSkills.renderSelectors();
  assert.equal(h.node("#prompt-skill-list").children.filter(child => child.tag === "label").length, 0);
  assert.throws(() => h.selection("prompt"), /Snapshot changed/);
  assert.deepEqual(h.selection("mv-prompt"), {});
  h.check("mv-prompt", 2);
  assert.deepEqual(h.selection("mv-prompt").skills.map(ref => ref.id), ["2"]);
  assert.equal(h.selection("mv-prompt").target_model, "h3");
  h.context.activeMode = "video";
  h.window.MiniMuvSkills.renderSelectors();
  assert.deepEqual(h.selection("prompt").skills.map(ref => ref.id), ["1"]);
  assert.deepEqual(h.selection("mv-prompt").skills.map(ref => ref.id), ["2"]);
});

test("filters all modes and blocks stale selections without dropping them", async () => {
  const h = harness();
  await h.tick();
  h.check("prompt", 1);
  for (const mode of ["video", "image", "music"]) {
    h.context.activeMode = mode;
    h.window.MiniMuvSkills.renderSelectors();
    assert.equal(h.selection("prompt").skills.length, 1);
  }
  h.check("storyboard", 2);
  assert.equal(h.selection("storyboard").target_model, "h3");
  h.setItems(h.items.map(item => ({...item, enabled: false})));
  await h.window.MiniMuvSkills.refresh();
  assert.throws(() => h.selection("prompt"), /Snapshot changed/);
  assert.throws(() => h.selection("storyboard"), /Snapshot changed/);
  assert.equal(h.node("#prompt-skill-list").children.at(-1).textContent, "Disable");
});

test("manager actions send exact revision, never inject description as HTML", async () => {
  const h = harness();
  await h.tick();
  const card = h.node("#skills-installed-list").children[0];
  assert.match(card.children[1].textContent, /<img onerror/);
  assert.equal(card.children[1].innerHTML, undefined);
  await card.children[2].events.click();
  assert.deepEqual(h.requests.find(request => request.path.endsWith("/enabled")).payload,
    {revision: "rev-0", enabled: false});
});

test("categories restrict all calling panels without expanding bindings", async () => {
  const h = harness();
  h.setItems(h.items.map((item, index) => ({...item, categories: [["video", "image"], ["music"], ["long-video"], ["image"], ["mv"]][index]})));
  await h.tick();
  assert.equal(h.node("#prompt-skill-list").children.length, 1);
  h.check("prompt", 0);
  h.context.activeMode = "image";
  h.window.MiniMuvSkills.renderSelectors();
  assert.equal(h.selection("prompt").skills[0].id, "0");
  h.context.activeMode = "music";
  h.window.MiniMuvSkills.renderSelectors();
  assert.throws(() => h.selection("prompt"), /Snapshot changed/);
  h.context.activeMode = "mv";
  h.window.MiniMuvSkills.renderSelectors();
  assert.equal(h.node("#mv-prompt-skill-list").children.length, 1);
  h.check("mv-prompt", 0);
  assert.equal(h.selection("mv-prompt").skills[0].id, "4");
  assert.equal(h.node("#storyboard-skill-list").children.length, 1);
  h.check("storyboard", 0);
  assert.equal(h.selection("storyboard").skills[0].id, "2");
});

test("category editing and install multi-select retain exact revision and localization", async () => {
  const h = harness();
  await h.tick();
  h.window.MiniMuvSkills.renderInstallCategories([h.items[0].bindings[0], h.items[0].bindings[2]]);
  assert.deepEqual(JSON.parse(JSON.stringify(h.window.MiniMuvSkills.installCategories())), ["video", "image"]);
  const installOptions = h.node("#skills-category-options").children[0];
  assert.equal(installOptions.children[2].children[0].disabled, true);
  const card = h.node("#skills-installed-list").children[0];
  const fieldset = card.children.at(-1);
  const options = fieldset.children[2], save = fieldset.children[3];
  options.children[2].children[0].checked = false;
  options.children[2].children[0].events.change();
  assert.equal(save.disabled, false);
  await save.events.click();
  assert.deepEqual(h.requests.find(request => request.path.endsWith("/categories")).payload,
    {revision: "rev-0", categories: ["video", "image", "long-video", "mv"]});
  h.node("#language").value = "zh-CN";
  h.node("#language").events.change();
  assert.equal(installOptions.children[4].children[1].textContent, "MV生成");
});
