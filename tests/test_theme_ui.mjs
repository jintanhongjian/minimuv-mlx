import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const themeSource = source.slice(source.indexOf("const themeKeys ="), source.indexOf("function t(key)"));
const css = readFileSync(new URL("../webapp/static/app.css", import.meta.url), "utf8");
const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
const themes = ["amber", "ocean", "forest", "violet", "paper", "sky", "mint", "rose"];

function harness(saved = null, blocked = false) {
  const listeners = {};
  const writes = [];
  const warnings = [];
  const root = { dataset: {} };
  const picker = { value: "", addEventListener: (key, fn) => { listeners[key] = fn; } };
  const meta = {};
  const context = vm.createContext({
    document: {
      documentElement: root,
      querySelector: selector => selector === "#theme" ? picker : meta
    },
    window: { addEventListener: (key, fn) => { listeners[key] = fn; } },
    localStorage: {
      getItem: () => { if (blocked) throw new Error("Denied"); return saved; },
      setItem: (...args) => { if (blocked) throw new Error("Denied"); writes.push(args); }
    },
    console: { warn: (...args) => warnings.push(args) }
  });
  vm.runInContext(themeSource, context);
  vm.runInContext("initializeTheme()", context);
  return { context, root, picker, meta, listeners, writes, warnings };
}

test("restores valid palettes and safely defaults missing or invalid preferences", () => {
  for (const theme of themes) {
    const h = harness(theme);
    assert.equal(h.root.dataset.theme, theme);
    assert.equal(h.picker.value, theme);
    assert.equal(h.meta.content, vm.runInContext(`themeColors["${theme}"]`, h.context));
    assert.deepEqual(h.writes, []);
  }
  for (const value of [null, "unknown", "__proto__", "constructor"]) {
    assert.equal(harness(value).root.dataset.theme, "amber");
  }
});

test("switches immediately, persists selection, and synchronizes tabs without writing back", () => {
  const h = harness();
  h.listeners.change({ target: { value: "paper" } });
  assert.equal(h.root.dataset.theme, "paper");
  assert.deepEqual(h.writes, [["minimuv-theme", "paper"]]);
  h.listeners.storage({ key: "minimuv-theme", newValue: "ocean" });
  assert.equal(h.picker.value, "ocean");
  h.listeners.storage({ key: "h3-language", newValue: "forest" });
  assert.equal(h.picker.value, "ocean");
  h.listeners.storage({ key: null, newValue: null });
  assert.equal(h.picker.value, "amber");
  assert.equal(h.writes.length, 1);
});

test("blocked theme storage reports errors but still permits immediate palette changes", () => {
  const h = harness(null, true);
  h.listeners.change({ target: { value: "forest" } });
  assert.equal(h.root.dataset.theme, "forest");
  assert.equal(h.warnings.length, 2);
});

test("all fourteen languages and all palettes have complete UI wiring", () => {
  const rows = vm.runInContext("Object.values(themeTranslations)", harness().context);
  assert.equal(rows.length, 14);
  for (const row of rows) assert.equal(row.filter(Boolean).length, 9);
  for (const theme of themes) {
    assert.match(html, new RegExp(`option value="${theme}" data-i18n="theme`));
    if (theme !== "amber") assert.ok(css.includes(`:root[data-theme="${theme}"]`));
  }
  assert.match(css, /color-scheme: light/);
  const defined = new Set([...css.matchAll(/(--[\w-]+):/g)].map(match => match[1]));
  for (const match of css.matchAll(/var\((--[\w-]+)\)/g)) assert.ok(defined.has(match[1]), match[1]);
  assert.match(source, /querySelector\("#theme"\)\.setAttribute\("aria-label", t\("theme"\)\)/);
});
