import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/visual-references.js", import.meta.url), "utf8");

function harness(language = "en") {
  const roots = new Map();
  class Node {
    constructor(tag) {
      this.tag = tag; this.children = []; this.dataset = {}; this.events = {};
      this.value = ""; this.hidden = false;
      this.className = "";
      this.classList = {add() {}, remove() {}, contains: name => this.className.split(" ").includes(name)};
    }
    append(...children) { children.forEach(child => {
      child.parent = this; child.parentElement = this; this.children.push(child);
    }); }
    insertBefore(child, target) {
      const index = this.children.indexOf(target);
      child.parent = this; child.parentElement = this;
      this.children.splice(index < 0 ? this.children.length : index, 0, child);
    }
    replaceChildren(...children) { this.children = []; this.append(...children); }
    remove() { this.parent.children = this.parent.children.filter(child => child !== this); }
    removeAttribute(key) { delete this[key]; }
    setAttribute(key, value) { this[key] = value; }
    addEventListener(key, callback) { this.events[key] = callback; }
    dispatchEvent() {}
    setCustomValidity() {}
    get options() { return this.children; }
    get selectedOptions() { return this.children.filter(child => child.selected); }
    matches(selector) {
      const match = selector.match(/^\[data-([\w-]+)(?:="?([^"\]]+)"?)?\]$/);
      if (!match) return selector === this.tag;
      const key = match[1].replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      return key in this.dataset && (match[2] === undefined || this.dataset[key] === match[2]);
    }
    querySelectorAll(selector) {
      return this.children.flatMap(child => [
        ...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)
      ]);
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0]; }
  }
  const root = id => {
    if (!roots.has(id)) roots.set(id, new Node("div"));
    return roots.get(id);
  };
  const images = [{id: "history", name: "Generated character", image_url: "/api/history/history/image"}];
  const window = {MiniMuvMVHost: {state: () => ({language, images}), updateAvailability() {}}};
  const context = vm.createContext({
    window, document: {createElement: tag => new Node(tag), querySelector: root,
      querySelectorAll: selector => [...roots.values()].flatMap(node => node.querySelectorAll(selector))},
    Option: function(text, value, defaultSelected, selected) {
      const option = new Node("option"); option.textContent = text;
      option.value = value; option.selected = selected; return option;
    },
    Event: function() {}, crypto: {randomUUID: () => "new-id"}
  });
  vm.runInContext(source, context);
  const load = (imageId, urls = {}) => {
    window.MiniMuvVisualReferences.load("workflow", {
      characters: [{id: "character", name: "Character", description: "", image_id: imageId}],
      scenes: [], default_scene: "", generate_frames: false
    }, urls);
    return root("#workflow-storyboard-settings").querySelector(".unused") ||
      root("#workflow-storyboard-settings").querySelector("[data-visual-list=characters]").children[0];
  };
  return {window, root, Node, load};
}

test("history URLs, persisted snapshots and uploads resolve consistently in library and shot previews", () => {
  const h = harness();
  for (const [id, urls, expected] of [
    ["history", {}, "/api/history/history/image"],
    ["history", {history: "/api/workflows/snapshot/reference"}, "/api/workflows/snapshot/reference"],
    ["uploaded", {}, "/api/first-frames/uploaded"]
  ]) {
    const row = h.load(id, urls);
    assert.equal(row.querySelector("img").src, expected);
    assert.equal(row.querySelector("[data-visual-name]").type, "text");
    const card = new h.Node("article");
    h.window.MiniMuvVisualReferences.attachShot(card, "workflow", {
      characters: ["character"], scene: "", frame_mode: "references"
    });
    assert.equal(card.querySelector("img").src, expected);
    const label = row.querySelector("label");
    assert.equal(label.htmlFor, label.querySelector("input").id);
  }
});

test("changing selection updates preview without changing reference identity or other fields", () => {
  const h = harness(), row = h.load("uploaded");
  const select = row.querySelector("select");
  select.value = "history"; select.events.change();
  assert.equal(row.querySelector("img").src, "/api/history/history/image");
  assert.equal(h.window.MiniMuvVisualReferences.payload("workflow").characters[0].image_id, "history");
  select.value = ""; select.events.change();
  assert.equal(row.querySelector("img").hidden, true);
  assert.equal(row.querySelector("img").src, undefined);
  assert.equal(row.querySelector("[data-visual-name]").value, "Character");
});

test("failed images have explicit localized status and recover on successful load", () => {
  for (const language of ["en", "zh-CN", "zh-TW", "fr", "de", "ja", "ko", "es", "pt", "tr", "ar", "vi", "id", "ru"]) {
    const h = harness(language), row = h.load("history");
    const image = row.querySelector("img"), status = image.parent.children[1];
    image.events.error();
    assert.equal(image.hidden, true);
    assert.equal(status.hidden, false);
    assert.ok(status.textContent.trim());
    assert.equal(status["aria-live"], "polite");
    image.events.load();
    assert.equal(image.hidden, false);
    assert.equal(status.hidden, true);
  }
});

test("storyboard visual settings collapse above generation and frame mode precedes the frame image", () => {
  for (const scope of ["workflow", "mv"]) {
    const h = harness();
    const card = new h.Node("article");
    card.className = "workflow-shot";
    const frameField = new h.Node("label");
    if (scope === "workflow") frameField.dataset.shotFrameWrapper = "";
    const frame = new h.Node("select");
    if (scope === "mv") frame.dataset.field = "frame";
    frameField.append(frame);
    const actions = new h.Node("div");
    actions.className = "workflow-actions";
    const generate = new h.Node("button");
    generate.dataset.shotGenerate = "";
    actions.append(generate);
    card.append(frameField, actions);

    h.window.MiniMuvVisualReferences.attachShot(card, scope, {
      characters: [], scene: "", frame_mode: "references"
    });

    const modeField = card.querySelector("[data-visual-mode-field]");
    const details = card.querySelector("details");
    assert.ok(modeField);
    assert.equal(modeField.querySelector("[data-visual-mode]").value, "references");
    assert.ok(card.children.indexOf(modeField) < card.children.indexOf(frameField));
    assert.ok(details);
    assert.equal(details.open, false);
    assert.equal(details.querySelector("[data-visual-mode]"), undefined);
    assert.ok(card.children.indexOf(details) < card.children.indexOf(actions));
  }
});
