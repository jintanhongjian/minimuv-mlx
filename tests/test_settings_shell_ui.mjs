import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../webapp/static/app.css", import.meta.url), "utf8");

test("the top bar exposes a single settings entry", () => {
  const topbar = html.slice(html.indexOf('<div class="topbar-right">'), html.indexOf("</header>"));
  assert.match(topbar, /id="settings-open"/);
  assert.doesNotMatch(topbar, /id="prompts-open"/);
  assert.doesNotMatch(topbar, /id="skills-open"/);
});

test("the settings dialog hosts a sidebar with the three section entries", () => {
  const dialog = html.slice(html.indexOf('<dialog id="settings-dialog"'), html.indexOf("<main class=\"workspace\">"));
  const nav = dialog.slice(dialog.indexOf('<nav class="settings-nav"'), dialog.indexOf("</nav>"));
  assert.match(nav, /id="settings-nav-models"[^>]*aria-controls="settings-pane-models"[^>]*data-i18n="settingsTitle"/);
  assert.match(nav, /id="prompts-open"[^>]*aria-controls="prompts-dialog"[^>]*data-prompt-i18n="title"/);
  assert.match(nav, /id="skills-open"[^>]*aria-controls="skills-dialog"[^>]*data-skill-i18n="title"/);
  assert.equal((dialog.match(/class="settings-pane["\s]/g) || []).length, 3);
  assert.match(dialog, /id="prompts-dialog"[^>]*hidden/);
  assert.match(dialog, /id="skills-dialog"[^>]*hidden/);
  assert.equal(html.match(/<dialog id="settings-dialog"/g).length, 1);
  assert.doesNotMatch(html, /<dialog id="prompts-dialog"/);
  assert.doesNotMatch(html, /<dialog id="skills-dialog"/);
  assert.match(css, /\.settings-dialog \{[^}]*height: min\(88vh, 900px\)/);
  assert.match(css, /\.settings-dialog \{[^}]*resize: both/);
  assert.match(css, /\.settings-shell \{[^}]*grid-template-columns: 190px/);
  assert.match(css, /\.settings-shell \{[^}]*grid-template-rows: minmax\(0, 1fr\)/);
  assert.match(css, /\.settings-panes \{[^}]*min-height: 0;[^}]*overflow-y: scroll/);
  assert.match(css, /\.settings-panes \{[^}]*scrollbar-gutter: stable/);
  assert.match(css, /\.settings-pane > form > \.settings-heading \{[^}]*position: sticky;[^}]*top: 0/);
  assert.match(css, /\.skills-sticky-header \{[^}]*position: sticky;[^}]*top: 0/);
});

function shell() {
  const nodes = new Map();
  const element = id => ({
    id, hidden: false, attributes: {}, events: {},
    setAttribute(key, value) { this.attributes[key] = value; },
    addEventListener(key, callback) { this.events[key] = callback; },
    dispatchEvent() { return true; }
  });
  const node = selector => {
    if (!nodes.has(selector)) nodes.set(selector, element(selector));
    return nodes.get(selector);
  };
  const dialog = node("#settings-dialog");
  dialog.open = false;
  dialog.showModal = () => { dialog.open = true; };
  dialog.close = () => { dialog.open = false; dialog.events.close(); };
  const start = source.indexOf('const settingsDialog = document.querySelector("#settings-dialog");');
  const end = source.indexOf('const settingsForm = document.querySelector("#settings-form");');
  vm.runInContext(source.slice(start, end), vm.createContext({ document: { querySelector: node }, Event }));
  return { node, dialog };
}

test("sidebar buttons switch panes inside the one open dialog", () => {
  const { node, dialog } = shell();
  node("#settings-nav-models").events.click();
  assert.equal(dialog.open, true);
  assert.equal(node("#settings-pane-models").hidden, false);
  assert.equal(node("#prompts-dialog").hidden, true);

  node("#skills-open").events.click();
  assert.equal(dialog.open, true);
  assert.equal(node("#settings-pane-models").hidden, true);
  assert.equal(node("#skills-dialog").hidden, false);
  assert.equal(node("#skills-dialog").open, true);
  assert.equal(node("#prompts-dialog").open, false);
  assert.equal(node("#skills-open").attributes["aria-selected"], "true");
  assert.equal(node("#prompts-open").attributes["aria-selected"], "false");
});

test("merged panels keep showModal and close semantics and reset on dialog close", () => {
  const { node, dialog } = shell();
  node("#prompts-dialog").showModal();
  assert.equal(dialog.open, true);
  assert.equal(node("#prompts-dialog").hidden, false);
  assert.equal(node("#prompts-dialog").open, true);

  node("#prompts-dialog").close();
  assert.equal(dialog.open, false);
  assert.equal(node("#prompts-dialog").open, false);
  assert.equal(node("#settings-pane-models").hidden, false);
  assert.equal(node("#settings-nav-models").attributes["aria-selected"], "true");
});

test("escaping a merged panel forwards the cancel so unsaved work can be guarded", () => {
  const { node, dialog } = shell();
  node("#skills-dialog").showModal();
  let forwarded = null;
  node("#skills-dialog").dispatchEvent = event => { forwarded = event; return false; };
  let prevented = false;
  dialog.events.cancel({ preventDefault: () => { prevented = true; } });
  assert.equal(forwarded.type, "cancel");
  assert.equal(prevented, true);
});
