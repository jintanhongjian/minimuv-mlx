import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/prompt-settings.js", import.meta.url), "utf8");
const config = JSON.parse(readFileSync(new URL("../webapp/system_prompts.json", import.meta.url), "utf8"));
const context = vm.createContext({});
vm.runInContext(source.slice(0, source.indexOf("(() => {")), context);

test("all thirty prompt editor labels exist in all fourteen languages", () => {
  const { keys, labels } = vm.runInContext("({keys:promptSettingKeys,labels:promptSettingTranslations})", context);
  assert.equal(Object.keys(labels).length, 14);
  assert.equal(keys.length, 30);
  for (const [language, values] of Object.entries(labels)) {
    assert.equal(values.length, keys.length, language);
    assert.ok(values.every(value => typeof value === "string" && value.trim()), language);
    assert.ok(values[keys.indexOf("count")].includes("{shot_count}"), language);
  }
});

test("all task types and runtime preview explanations are localized", () => {
  const { keys, labels } = vm.runInContext("({keys:promptTaskKeys,labels:promptTaskTranslations})", context);
  assert.equal(Object.keys(labels).length, 14);
  for (const [language, values] of Object.entries(labels)) {
    assert.equal(values.length, keys.length, language);
    assert.ok(values.every(value => typeof value === "string" && value.trim()), language);
  }
  assert.ok(keys.includes("mv"));
  assert.ok(keys.includes("mv_storyboard"));
  assert.ok(keys.includes("skill_conversion"));
});

test("AI assistant settings and help exist in all fourteen UI languages", () => {
  const { keys, labels } = vm.runInContext("({keys:promptAssistantKeys,labels:promptAssistantTranslations})", context);
  assert.equal(Object.keys(labels).length, 14);
  for (const [locale, values] of Object.entries(labels)) {
    assert.equal(values.length, keys.length, locale);
    assert.ok(values.every(value => typeof value === "string" && value.trim()), locale);
  }
});

test("assistant preview includes editable instructions and the current UI language", () => {
  context.config = structuredClone(config);
  context.config.profiles.assistant.role = "Custom assistant";
  context.previewContext = {assistant: {language_suffixes: {
    "zh-CN": "\n\nResponse language: Simplified Chinese (zh-CN)",
    ja: "\n\nResponse language: Japanese (ja)"
  }}};
  for (const locale of ["zh-CN", "ja"]) {
    const result = vm.runInContext(`compilePromptPreview(config, "assistant", previewContext, "${locale}")`, context);
    assert.ok(result.startsWith("Custom assistant"));
    assert.ok(result.includes(context.config.profiles.assistant.rules));
    assert.ok(result.endsWith(context.previewContext.assistant.language_suffixes[locale]));
    assert.ok(!result.includes("undefined"));
  }
});

test("preview preserves JSON braces and combines shared and mode-specific instructions", () => {
  context.config = config;
  for (const mode of ["video", "mv", "image", "music"]) {
    const preview = vm.runInContext(`compilePromptPreview(config, "${mode}")`, context);
    assert.ok(preview.startsWith(config.profiles.enhancement.role));
    assert.ok(preview.endsWith(config.profiles[mode].task));
    assert.ok(preview.includes('{"keywords":["..."],"optimized_prompt":"..."}'));
  }
  const storyboard = vm.runInContext('compilePromptPreview(config, "storyboard")', context);
  assert.ok(storyboard.includes("exactly 8 chronological shots"));
  assert.ok(storyboard.includes('{"shots":['));
  assert.ok(!storyboard.includes("{shot_count}"));
  assert.ok(vm.runInContext('compilePromptPreview(config, "mv_storyboard")', context)
    .includes("exactly 8 chronological shots"));
  const skill = vm.runInContext('compilePromptPreview(config, "skill_conversion", {skill_conversion: {prefix:"CONTRACT\\n", suffix:"\\nSCHEMA"}})', context);
  assert.ok(skill.startsWith("CONTRACT\n"));
  assert.ok(skill.endsWith("\nSCHEMA"));
  assert.ok(skill.includes(config.profiles.skill_conversion.rules));
});

function editorHarness() {
  const elements = new Map();
  function element() {
    return {
      value: "", textContent: "", children: [], dataset: {}, events: {},
      classList: { toggle() {} },
      setAttribute() {},
      addEventListener(name, callback) { this.events[name] = callback; },
      replaceChildren(...children) {
        this.children = children;
        this.value = children[0]?.value || "";
      },
      append(...children) { this.children.push(...children); },
      showModal() { this.open = true; },
      close() { this.open = false; }
    };
  }
  const node = selector => {
    if (!elements.has(selector)) elements.set(selector, element());
    return elements.get(selector);
  };
  node("#language").value = "en";
  const requests = [];
  vm.runInContext(source, vm.createContext({
    document: { querySelector: node, querySelectorAll: () => [], createElement: element },
    window: { confirm: () => true }, structuredClone,
    Option: function(text, value) { return { textContent: text, value, dataset: {} }; },
    fetch: () => new Promise((resolve, reject) => requests.push({ resolve, reject }))
  }));
  const reply = (index, role) => {
    const saved = structuredClone(config);
    saved.profiles.enhancement.role = role;
    requests[index].resolve({
      ok: true, json: async () => ({ config: saved, defaults: config, revision: role })
    });
  };
  return {
    node, requests, reply,
    open: () => node("#prompts-open").events.click(),
    close: () => node("#prompts-close").events.click()
  };
}

test("reopening ignores an older load response and preserves the current draft", async () => {
  const h = editorHarness();
  const first = h.open();
  h.close();
  const second = h.open();
  h.reply(1, "Current role");
  await second;
  h.reply(0, "Stale role");
  await first;
  assert.equal(h.node("#prompts-fields").children[2].value, "Current role");
  assert.equal(h.node("#prompts-controls").disabled, false);
});

test("a failed load from a closed dialog cannot overwrite the reopened status", async () => {
  const h = editorHarness();
  const first = h.open();
  h.close();
  const second = h.open();
  h.reply(1, "Current role");
  await second;
  h.requests[0].reject(new Error("Stale request failed"));
  await first;
  assert.equal(h.node("#prompts-status").textContent, "");
  assert.equal(h.node("#prompts-controls").disabled, false);
});

test("assistant fields can be edited and restored independently of other profiles", async () => {
  const h = editorHarness();
  const opening = h.open();
  h.reply(0, "Current role");
  await opening;
  assert.ok(h.node("#prompts-profile").children.some(option => option.value === "assistant"));
  h.node("#prompts-profile").value = "assistant";
  h.node("#prompts-profile").events.change();
  const input = h.node("#prompts-fields").children[2];
  input.value = "Custom assistant role";
  input.events.input();
  assert.ok(h.node("#prompts-preview").textContent.startsWith("Custom assistant role"));
  h.node("#prompts-reset").events.click();
  assert.equal(h.node("#prompts-fields").children[2].value, config.profiles.assistant.role);
  h.node("#prompts-profile").value = "enhancement";
  h.node("#prompts-profile").events.change();
  assert.equal(h.node("#prompts-fields").children[2].value, "Current role");
});
