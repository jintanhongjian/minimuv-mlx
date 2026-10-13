import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const helper = source.slice(source.indexOf("function imageCanvasSettings("), source.indexOf("function updateLocalModelControls("));
const submit = source.slice(source.indexOf('form.addEventListener("submit"'), source.indexOf('cancelButton.addEventListener("click"'));

test("all image models submit the selected canvas and never reuse square dimensions", async () => {
  for (const model of ["hidream", "flux2-klein-4b", "z-image-turbo"]) {
    const controls = new Map([["#image-size", {value: model === "hidream" ? "2048" : "1024"}],
      ["#image-aspect", {value: "16:9"}], ["#image-seed", {value: "42"}],
      ["#image-quality", {value: "custom"}], ["#image-candidate-count", {value: "2"}]]);
    let send, handler;
    const context = vm.createContext({
      imageModelChoice: {value: model}, document: {querySelector: id => controls.get(id)},
      form: {addEventListener: (_, fn) => {handler = fn;}},
      promptInput: {value: "Film", dataset: {}}, projectNameInput: {value: ""},
      activeMode: "image", promptEnhancementBusy: false, firstFrameBusy: false, storyboardBusy: false,
      generateButton: {}, pollTimer: null, refreshCurrentJob() {}, renderJob() {},
      window: {setTimeout() {}},
      async fetch(path, options) {send = {path, body: JSON.parse(options.body)}; return {ok: true, json: async () => ({job: {}})};}
    });
    vm.runInContext(helper + submit, context);
    for (const aspect of ["16:9", "9:16", "1:1", "4:3", "3:4"]) {
      controls.get("#image-aspect").value = aspect;
      await handler({preventDefault() {}});
      assert.equal(send.path, "/api/image-jobs");
      assert.equal(send.body.aspect, aspect);
      const size = Number(controls.get("#image-size").value);
      const [a, b] = aspect.split(":").map(Number);
      const grid = model === "hidream" ? 32 : 16;
      assert.equal(send.body.width, a >= b ? size : Math.round(size * a / b / grid) * grid);
      assert.equal(send.body.height, a >= b ? Math.round(size * b / a / grid) * grid : size);
      assert.equal(send.body.model, model);
      assert.equal(send.body.quality, "custom");
      assert.equal(send.body.candidate_count, 2);
    }
  }
  assert.match(source.slice(source.indexOf("function updateLocalModelControls("), source.indexOf("function updateSelectedModelLinks(")),
    /const \{width, height, candidate_count: candidateCount\} = imageCanvasSettings\(\)/);
});

test("HiDream high quality uses trained resolutions while distilled models keep native steps", () => {
  const controls = new Map([
    ["#image-size", {value: "2048"}], ["#image-aspect", {value: "16:9"}],
    ["#image-quality", {value: "high"}], ["#image-candidate-count", {value: "4"}],
  ]);
  const context = vm.createContext({
    imageModelChoice: {value: "hidream"},
    document: {querySelector: id => controls.get(id)},
  });

  vm.runInContext(helper, context);
  assert.deepEqual(
    JSON.parse(JSON.stringify(context.imageCanvasSettings())),
    {model: "hidream", quality: "high", candidate_count: 4, size: 2048,
      aspect: "16:9", width: 2560, height: 1440},
  );
  context.imageModelChoice.value = "z-image-turbo";
  assert.equal(context.imageCanvasSettings().width, 1024);
  assert.equal(context.imageCanvasSettings().height, 576);
});

test("scene preset emits one ordered three-view group only for reference-capable models", () => {
    const controls = new Map([
      ["#image-size", {value: "1024"}], ["#image-aspect", {value: "1:1"}],
      ["#image-quality", {value: "standard"}], ["#image-candidate-count", {value: "4"}],
      ["#image-scene-views", {checked: true}], ["#image-turnaround", {checked: false}],
    ]);
    const context = vm.createContext({imageModelChoice: {value: "flux2-klein-4b"},
      document: {querySelector: id => controls.get(id)}});
    vm.runInContext(helper, context);
    assert.equal(context.imageCanvasSettings().image_preset, "scene_views");
    assert.equal(context.imageCanvasSettings().candidate_count, 3);
    context.imageModelChoice.value = "hidream";
    assert.equal(context.imageCanvasSettings().image_preset, "scene_views");
    context.imageModelChoice.value = "z-image-turbo";
    assert.equal(context.imageCanvasSettings().image_preset, undefined);
    assert.equal(context.imageCanvasSettings().candidate_count, 4);
  });

test("character turnaround forces one ordered three-image preset", () => {
  const controls = new Map([
    ["#image-size", {value: "1024"}], ["#image-aspect", {value: "1:1"}],
    ["#image-quality", {value: "standard"}], ["#image-candidate-count", {value: "4"}],
    ["#image-turnaround", {checked: true}],
  ]);
  const context = vm.createContext({
    imageModelChoice: {value: "flux2-klein-4b"},
    document: {querySelector: id => controls.get(id)},
  });

  vm.runInContext(helper, context);
  assert.deepEqual(JSON.parse(JSON.stringify(context.imageCanvasSettings())), {
    model: "flux2-klein-4b", quality: "standard", candidate_count: 3,
    size: 1024, aspect: "1:1", width: 1024, height: 1024,
    image_preset: "character_turnaround",
  });
});

test("image submission includes ordered references and reports invalid limits before fetching", async () => {
    let handler, send, failure;
    const controls = new Map([
      ["#image-size", {value: "1024"}], ["#image-aspect", {value: "1:1"}],
      ["#image-quality", {value: "standard"}], ["#image-candidate-count", {value: "1"}],
      ["#image-seed", {value: "42"}],
    ]);
    const references = {busy: () => false, payload: () => ({reference_image_ids: ["b", "a"]})};
    const context = vm.createContext({
      imageModelChoice: {value: "flux2-klein-4b"}, document: {querySelector: id => controls.get(id)},
      form: {addEventListener: (_, fn) => {handler = fn;}},
      promptInput: {value: "Portrait", dataset: {}}, projectNameInput: {value: ""},
      activeMode: "image", promptEnhancementBusy: false, firstFrameBusy: false, storyboardBusy: false,
      generateButton: {}, pollTimer: null, refreshCurrentJob() {}, renderJob(value) {failure = value;},
      window: {MiniMuvImageReferences: references, setTimeout() {}},
      async fetch(path, options) {send = JSON.parse(options.body); return {ok: true, json: async () => ({job: {}})};},
    });
    vm.runInContext(helper + submit, context);
    await handler({preventDefault() {}});
    assert.deepEqual(send.reference_image_ids, ["b", "a"]);
    send = null;
    references.payload = () => {throw new Error("too many references");};
    await handler({preventDefault() {}});
    assert.equal(send, null);
    assert.equal(failure.error, "too many references");
  });
