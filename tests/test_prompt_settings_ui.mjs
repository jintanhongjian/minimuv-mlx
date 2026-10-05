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

test("preview preserves JSON braces and combines shared and mode-specific instructions", () => {
  context.config = config;
  for (const mode of ["video", "image", "music"]) {
    const preview = vm.runInContext(`compilePromptPreview(config, "${mode}")`, context);
    assert.ok(preview.startsWith(config.profiles.enhancement.role));
    assert.ok(preview.endsWith(config.profiles[mode].task));
    assert.ok(preview.includes('{"keywords":["..."],"optimized_prompt":"..."}'));
  }
  const storyboard = vm.runInContext('compilePromptPreview(config, "storyboard")', context);
  assert.ok(storyboard.includes("exactly 8 chronological shots"));
  assert.ok(storyboard.includes('{"shots":['));
  assert.ok(!storyboard.includes("{shot_count}"));
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
