import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { webcrypto } from "node:crypto";

const source = readFileSync(new URL("../webapp/static/skill-review.js", import.meta.url), "utf8");
const pure = vm.createContext({ TextEncoder });
vm.runInContext(source.slice(0, source.indexOf("(() => {")), pure);

test("Skill review labels and boundary are complete in fourteen languages", () => {
  const { keys, labels } = vm.runInContext("({keys:skillReviewKeys,labels:skillReviewTranslations})", pure);
  assert.equal(Object.keys(labels).length, 14);
  assert.equal(keys.length, 38);
  for (const [language, values] of Object.entries(labels)) {
    assert.equal(values.length, keys.length, language);
    assert.ok(values.every(value => typeof value === "string" && value.trim()), language);
    for (const key of ["boundary", "licenseHelp", "valid", "stale", "conflict"]) {
      assert.ok(values[keys.indexOf(key)].length > (key === "valid" ? 10 : 20), `${language}: ${key}`);
    }
  }
});

test("license review labels are complete in fourteen languages", () => {
  const { keys, labels } = vm.runInContext("({keys:skillLicenseKeys,labels:skillLicenseTranslations})", pure);
  assert.equal(Object.keys(labels).length, 14);
  for (const [language, values] of Object.entries(labels)) {
    assert.equal(values.length, keys.length, language);
    assert.ok(values.every(value => typeof value === "string" && value.trim()), language);
  }
});

test("GitHub source errors are localized in fourteen languages", () => {
  const { keys, labels, error } = vm.runInContext(
    "({keys:skillSourceErrorKeys,labels:skillSourceErrorTranslations,error:skillSourceError})", pure);
  assert.equal(Object.keys(labels).length, 14);
  for (const [language, values] of Object.entries(labels)) {
    assert.equal(values.length, keys.length, language);
    assert.ok(values.every(value => typeof value === "string" && value.trim()), language);
  }
  assert.match(error("github_rate_limit_or_forbidden", "zh-CN"), /限流/);
  assert.match(error("github_rate_limit_or_forbidden", "en"), /rate limit/i);
  assert.equal(error("unknown_code", "en"), "unknown_code");
});

test("flow and input budget labels are complete in fourteen languages and settings round-trip them", () => {
  const {keys, labels} = vm.runInContext("({keys:skillFlowKeys,labels:skillFlowTranslations})", pure);
  assert.equal(Object.keys(labels).length, 14);
  for (const values of Object.values(labels)) {
    assert.equal(values.length, keys.length);
    assert.ok(values.every(value => value.trim()));
  }
  const app = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
  const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
  assert.match(app, /querySelector\("#settings-skill-budget"\)\.value = settings\.text\.skill_input_token_budget/);
  assert.match(app, /skill_input_token_budget: Number\(document\.querySelector\("#settings-skill-budget"\)\.value\)/);
  assert.match(html, /id="settings-skill-budget"[^>]*min="16000"[^>]*max="128000"/);
});

test("installation flow stages are localized in fourteen languages with six ordered steps", () => {
  const { keys, labels, text } = vm.runInContext(
    "({keys:skillStageKeys,labels:skillStageTranslations,text:skillStageText})", pure);
  assert.deepEqual(Array.from(keys), ["source", "license", "prepare", "save", "edit", "apply"]);
  assert.equal(Object.keys(labels).length, 14);
  for (const [language, values] of Object.entries(labels)) {
    assert.equal(values.length, keys.length, language);
    assert.ok(values.every(value => typeof value === "string" && value.trim()), language);
  }
  assert.equal(text("source", "zh-CN"), "取源");
  assert.equal(text("apply", "en"), "Apply");
  assert.equal(text("apply", "xx"), "Apply");
  assert.equal(text("unknown", "en"), "unknown");
});

test("source import checks per-file Unicode characters, count and UTF-8 request budget", () => {
  const run = value => { pure.value = JSON.stringify(value); return vm.runInContext('skillSourcePayload("model","local:notes","v1",value)', pure); };
  assert.equal(run([{path:"SKILL.md",content:"😀".repeat(96000)}]).source.files.length, 1);
  assert.throws(() => run([{path:"SKILL.md",content:"😀".repeat(96001)}]), /invalid_skill_source_file/);
  assert.throws(() => run(Array.from({length:17}, (_, i) => ({path:`${i}.md`,content:"x"}))), /source_files/);
  assert.throws(() => run([{path:"a.md",content:"x",approved:true}]), /source_file/);
  assert.throws(() => run(Array.from({length:6}, (_, i) => ({path:`${i}.md`,content:"x".repeat(96000)}))), /request_size/);
});

test("Skill names prefer frontmatter then title then path without trusting YAML objects", () => {
  const name = (path, content) => {
    pure.files = [{path, content}];
    return vm.runInContext("skillSourceName(files)", pure);
  };
  assert.equal(name("skills/example/SKILL.md", "---\nname: Plain Name # note\n---\n# Title"), "Plain Name");
  assert.equal(name("SKILL.md", '---\nname: "Quoted name"\n---\n# Title'), "Quoted name");
  assert.equal(name("SKILL.md", "---\nname: 'Director''s notes'\n---\n# Title"), "Director's notes");
  assert.equal(name("SKILL.md", "---\nname: {unsupported: object}\n---\n# Title"), "Title");
  assert.equal(name("skills/example/SKILL.md", "No heading"), "example");
  assert.equal(name("notes.md", "No heading"), "notes");
});

test("reference extraction finds backticks, markdown links and bare relative paths", () => {
  const targets = () => vm.runInContext("[...skillReferenceTargets(content)]", pure);
  pure.content = "铁律见 `references/camera-and-impact.md`；配方见 [scene](./references/scene-patterns.md)。" +
    "范例见 ../examples/example-15s-duel.md 或 README.txt。忽略 https://example.com/LICENSE.md 与 #anchor。";
  const found = targets();
  assert.ok(found.includes("references/camera-and-impact.md"));
  assert.ok(found.includes("./references/scene-patterns.md"));
  assert.ok(found.includes("../examples/example-15s-duel.md"));
  assert.ok(found.includes("README.txt"));
  assert.ok(!found.includes("https://example.com/LICENSE.md"));
  assert.ok(!found.includes("#anchor"));
});

test("reference resolution normalises dot segments and rejects escapes", () => {
  const resolve = (base, ref) => {
    pure.base = base; pure.ref = ref;
    return vm.runInContext("skillResolveReference(base, ref)", pure);
  };
  assert.equal(resolve("skills/example/SKILL.md", "references/a.md"), "skills/example/references/a.md");
  assert.equal(resolve("skills/example/SKILL.md", "./references/a.md"), "skills/example/references/a.md");
  assert.equal(resolve("skills/example/SKILL.md", "../shared/a.md"), "skills/shared/a.md");
  assert.equal(resolve("SKILL.md", "../../a.md"), null);
  assert.equal(resolve("SKILL.md", "https://example.com/a.md"), null);
});

test("missing references are resolved against paths and basenames", () => {
  const missing = files => {
    pure.files = files;
    return JSON.parse(vm.runInContext("JSON.stringify(skillMissingReferences(files))", pure));
  };
  assert.deepEqual(missing([
    {path:"SKILL.md", content:"见 `references/camera.md`。"},
    {path:"references/camera.md", content:"x"},
  ]), []);
  // Basename fallback supports multi-file selection without folder paths.
  assert.deepEqual(missing([
    {path:"SKILL.md", content:"见 `references/camera.md`。"},
    {path:"camera.md", content:"x"},
  ]), []);
  assert.deepEqual(missing([
    {path:"SKILL.md", content:"见 `references/missing.md`。"},
  ]), ["references/missing.md"]);
});

function harness() {
  const elements = new Map();
  function element() {
    return {
      value: "", textContent: "", children: [], dataset: {}, events: {}, disabled: false,
      classList: { toggle() {} },
      setAttribute(key, value) { this[key] = value; },
      addEventListener(key, callback) { this.events[key] = callback; },
      replaceChildren(...children) { this.children = children; },
      append(...children) { this.children.push(...children); },
      querySelectorAll() { return this.children.flatMap(label => label.children.filter(child => child.type === "checkbox" && child.checked)); },
      get options() { return this.children; },
      showModal() { this.open = true; },
      close() { this.open = false; }
    };
  }
  const node = selector => {
    if (!elements.has(selector)) elements.set(selector, element());
    return elements.get(selector);
  };
  node("#language").value = "en";
  node("#skills-source").value = '[{"path":"SKILL.md","content":""}]';
  const requests = [];
  const confirmations = [];
  let confirm = true;
  const window = {
    confirm(message) { confirmations.push(message); return confirm; },
    addEventListener() {},
    MiniMuvSkills: {text: key => key, refresh: async () => {},
      applyAvailable: () => true,
      published: () => null, renderInstallCategories() {}, installCategories: () => ["video", "image"]}
  };
  vm.runInContext(source, vm.createContext({
    document: { querySelector: node, querySelectorAll: () => [], createElement: element },
    window, TextEncoder, TextDecoder, crypto: webcrypto,
    Option: function(textContent, value) { return { textContent, value }; },
    fetch: (path, options) => new Promise((resolve, reject) => requests.push({ path, options, resolve, reject }))
  }));
  const reply = (index, data, status = 200) => {
    requests[index].resolve({ ok: status < 400, status, json: async () => data });
  };
  const click = id => node(`#skills-${id}`).events.click();
  const input = (id, value) => { const el = node(`#skills-${id}`); el.value = value; el.events.input(); };
  return { node, requests, reply, click, input, confirmations, skills: window.MiniMuvSkills,
    setConfirm: value => { confirm = value; } };
}
const prepared = {
  source_sha256: "hash", license_review: { status: "verified", obligations: [] },
  request: { trusted_context: { request_id: "host-id" } }
};
const tick = () => new Promise(resolve => setImmediate(resolve));
async function importLocal(h, files, licenseTypes = ["MIT", "Apache-2.0", "BSD-3-Clause"]) {
  h.node("#skills-files").files = files;
  const pending = h.node("#skills-files").events.change();
  for (let i = 0; i < 40; i++) {
    await tick();
    const idx = h.requests.findIndex(r => r.path === "/api/skills/license-types");
    if (idx >= 0) { h.reply(idx, { license_types: licenseTypes }); break; }
  }
  await pending;
}
async function prepare(h) {
  h.input("name", "My notes");
  h.node("#skills-model").value = "model";
  h.input("origin", "local:notes");
  h.input("revision", "v1");
  h.input("source", '[{"path":"SKILL.md","content":"<script>never executed</script>"}]');
  const index = h.requests.length;
  const task = h.click("prepare");
  h.reply(index, prepared);
  await task;
}

test("draft refresh shows backend storage path even with an empty list", async () => {
  const h = harness();
  const task = h.click("refresh");
  const path = "/Users/test/Library/Application Support/MiniMuv/skill-drafts";
  h.reply(0, {items: [], storage_path: path});
  await task;
  assert.equal(h.node("#skills-draft-storage").textContent, path);
  assert.equal(h.node("#skills-draft-storage").innerHTML, undefined);
  const next = h.click("refresh");
  assert.equal(h.node("#skills-draft-storage").textContent, "");
  h.reply(1, {items: [], storage_path: path});
  await next;
  assert.equal(h.node("#skills-draft-storage").textContent, path);
});

test("editing invalidates validation and changing source disables old host bindings", async () => {
  const h = harness();
  h.node("#skills-dialog").showModal();
  await prepare(h);
  assert.equal(h.node("#skills-save").disabled, false);
  h.input("result", '{"status":"blocked"}');
  const index = h.requests.length;
  const task = h.click("validate");
  assert.equal(h.node("#skills-controls").disabled, true);
  h.reply(index, { valid: true, findings: [], installable: false });
  await task;
  assert.match(h.node("#skills-validation").textContent, /ready to apply/);
  h.input("result", '{"status":"blocked","edit":true}');
  assert.match(h.node("#skills-validation").textContent, /Unvalidated/);
  assert.equal(h.node("#skills-findings").children.length, 0);
  h.input("result", '{"unfinished":');
  assert.equal(h.node("#skills-preview").children.at(-1).textContent, "Validation failed");
  assert.equal(h.node("#skills-result").events.change, undefined);
  h.input("source", '[{"path":"SKILL.md","content":"changed"}]');
  assert.equal(h.node("#skills-convert").disabled, true);
  assert.equal(h.node("#skills-validate").disabled, true);
  assert.equal(h.node("#skills-save").disabled, true);
});

test("busy operations cannot close or switch drafts; close warns for unsaved edits", async () => {
  const h = harness();
  h.node("#skills-dialog").showModal();
  await prepare(h);
  const index = h.requests.length;
  const pending = h.click("convert");
  h.click("close");
  assert.equal(h.node("#skills-dialog").open, true);
  h.reply(index, { result: {status:"blocked"}, validation: {valid:true,findings:[]} });
  await pending;
  h.setConfirm(false);
  h.click("close");
  assert.equal(h.node("#skills-dialog").open, true);
  assert.ok(h.confirmations.length);
  h.setConfirm(true);
  h.click("close");
  assert.equal(h.node("#skills-dialog").open, false);
});

test("draft installation automatically validates saved content without human checks", async () => {
  const h = harness();
  h.node("#skills-dialog").showModal();
  await prepare(h);
  h.input("result", '{"status":"draft"}');
  let index = h.requests.length;
  let task = h.click("validate");
  h.reply(index, {valid: true, candidate_sha256: "host-package-hash", findings: []});
  await task;
  assert.equal(h.node("#skills-install").disabled, false);
  index = h.requests.length;
  task = h.click("install");
  assert.equal(h.requests[index].path, "/api/skills/drafts");
  h.reply(index, {draft: {id: "saved-id", revision: "saved-revision"}});
  await tick();
  const payload = JSON.parse(h.requests[index + 1].options.body);
  assert.equal(payload.draft_id, "saved-id");
  assert.equal(payload.revision, "saved-revision");
  assert.equal(payload.reviewer, undefined);
  assert.equal(payload.checks, undefined);
  h.reply(index + 1, {item: {enabled: false}});
  await task;
  assert.ok(!source.includes("reviewFields"));
});

test("file chooser cancellation preserves Skill review and edits; dialog Escape still confirms closing", async () => {
  const h = harness();
  const dialog = h.node("#skills-dialog");
  dialog.showModal();
  await prepare(h);
  h.input("result", "unfinished review");
  let prevented = false;
  dialog.events.cancel({target:h.node("#skills-files"), preventDefault() { prevented = true; }});
  assert.equal(dialog.open, true);
  assert.equal(prevented, false);
  assert.equal(h.node("#skills-result").value, "unfinished review");
  assert.equal(h.node("#skills-save").disabled, false);
  assert.equal(h.confirmations.length, 0);
  h.node("#skills-files").files = [];
  await h.node("#skills-files").events.change();
  assert.equal(dialog.open, true);
  assert.equal(h.node("#skills-result").value, "unfinished review");
  assert.equal(h.node("#skills-status").textContent, "");
  assert.equal(h.confirmations.length, 0);
  h.setConfirm(false);
  dialog.events.cancel({target:dialog, preventDefault() { prevented = true; }});
  assert.equal(prevented, true);
  assert.equal(dialog.open, true);
  h.setConfirm(true);
  dialog.events.cancel({target:dialog, preventDefault() {}});
  assert.equal(dialog.open, false);
});

test("failed prepare and conflicting save preserve edited candidate", async () => {
  const h = harness();
  h.node("#skills-dialog").showModal();
  await prepare(h);
  h.input("result", "unfinished JSON");
  let index = h.requests.length;
  let task = h.click("prepare");
  h.reply(index, {error:"local_text_runtime_unavailable"}, 503);
  await task;
  assert.equal(h.node("#skills-result").value, "unfinished JSON");
  index = h.requests.length;
  task = h.click("save");
  h.reply(index, {error:"skill_draft_changed"}, 409);
  await task;
  assert.equal(h.node("#skills-result").value, "unfinished JSON");
  assert.match(h.node("#skills-status").textContent, /edits are preserved/);
});

test("opening a stale saved draft preserves JSON, marks pending and permits private saving only", async () => {
  const h = harness();
  h.click("open");
  h.reply(0, {models:[{id:"model"}]});
  h.reply(1, {items:[{id:"saved-id",name:"<img src=x>",revision:"r1"}]});
  await tick();
  const open = h.node("#skills-list").children[0].children[1].events.click();
  h.reply(2, {
    snapshot_current: false, draft: {
      id:"saved-id", revision:"r1", name:"Saved", model:"model",
      source:{origin:"local:notes",revision:"v1",files:[{path:"SKILL.md",content:"original"}]},
      result_text:"unfinished JSON", ...prepared
    }
  });
  await open;
  await tick();
  assert.equal(h.node("#skills-result").value, "unfinished JSON");
  assert.match(h.node("#skills-validation").textContent, /Snapshot changed/);
  assert.equal(h.node("#skills-convert").disabled, true);
  assert.equal(h.node("#skills-validate").disabled, true);
  assert.equal(h.node("#skills-save").disabled, false);
  assert.ok(!source.includes("innerHTML"));
  assert.ok(!source.includes("eval("));
});

test("host validation receives raw JSON to reject duplicate keys rather than browser normalization", async () => {
  const h = harness();
  h.node("#skills-dialog").showModal();
  await prepare(h);
  h.input("result", '{"a":1,"a":2}');
  const index = h.requests.length;
  const task = h.click("validate");
  assert.equal(JSON.parse(h.requests[index].options.body).result_text, '{"a":1,"a":2}');
  h.reply(index, {error:"invalid_skill_json"}, 400);
  await task;
  assert.match(h.node("#skills-validation").textContent, /Unvalidated/);
  assert.match(h.node("#skills-status").textContent, /invalid_skill_json/);
});

test("failed UTF-8 import preserves the current source and host request", async () => {
  const h = harness();
  h.node("#skills-dialog").showModal();
  await prepare(h);
  const original = h.node("#skills-source").value;
  h.node("#skills-files").files = [{
    name: "invalid.md", size: 2, arrayBuffer: async () => new Uint8Array([0xff, 0xff]).buffer
  }];
  await h.node("#skills-files").events.change();
  assert.equal(h.node("#skills-source").value, original);
  assert.equal(h.node("#skills-save").disabled, false);
  assert.match(h.node("#skills-status").textContent, /Operation failed/);
});

test("Skill review entry, script registration and responsive layout are wired", () => {
  const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
  const css = readFileSync(new URL("../webapp/static/app.css", import.meta.url), "utf8");
  assert.match(html, /id="skills-open"[^>]*role="tab"[^>]*aria-controls="skills-dialog"/);
  assert.match(html, /id="skills-dialog" class="settings-pane skills-dialog" role="tabpanel" aria-labelledby="skills-open" hidden/);
  assert.match(html, /src="\/skill-review.js" defer/);
  assert.match(html, /id="skills-github"/);
  assert.match(html, /id="skills-files".*accept="[^"]*\.md/);
  assert.match(html, /id="skills-license-choice"/);
  assert.match(html, /id="skills-license-confirm"/);
  assert.match(html, /id="skills-one-click"/);
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*\.skills-layout, \.skills-source-fields/);
});

test("GitHub acquisition labels exist in all fourteen languages", () => {
  const {keys, labels} = vm.runInContext("({keys:skillSourceKeys,labels:skillSourceTranslations})", pure);
  assert.equal(Object.keys(labels).length, 14);
  for (const values of Object.values(labels)) {
    assert.equal(values.length, keys.length);
    assert.ok(values.every(value => value.trim()));
  }
});

test("one-click install label is localized in fourteen languages", () => {
  const {labels, text} = vm.runInContext(
    "({labels:skillOneClickTranslations,text:skillOneClickText})", pure);
  assert.equal(Object.keys(labels).length, 14);
  for (const value of Object.values(labels)) assert.ok(value.trim());
  assert.match(text("zh-CN"), /一键/);
  assert.match(text("en"), /Install all/);
  assert.equal(text("xx"), text("en"));
});

test("Markdown file import automatically supplies source and immutable local revision", async () => {
  const h = harness();
  h.node("#skills-dialog").showModal();
  h.node("#skills-model").value = "model";
  await importLocal(h, [{
    name:"SKILL.md",size:14,arrayBuffer:async () => new TextEncoder().encode("# My own notes").buffer
  }]);
  assert.equal(h.node("#skills-origin").value, "local:SKILL.md");
  assert.match(h.node("#skills-revision").value, /^[a-f0-9]{64}$/);
  assert.equal(JSON.parse(h.node("#skills-source").value)[0].content, "# My own notes");
  assert.equal(h.node("#skills-name").value, "My own notes");
  assert.equal(h.node("#skills-save").disabled, true);
});

test("local import lists imported files and offers declarable license types", async () => {
  const h = harness();
  h.node("#skills-dialog").showModal();
  h.node("#skills-model").value = "model";
  await importLocal(h, [
    {name:"SKILL.md",size:20,arrayBuffer:async () => new TextEncoder().encode("# Title\n见 `references/a.md`").buffer},
    {name:"references/a.md",size:2,arrayBuffer:async () => new TextEncoder().encode("x").buffer},
  ], ["MIT", "Apache-2.0"]);
  assert.equal(h.node("#skills-documents").children.length, 2);
  assert.match(h.node("#skills-documents").children[0].textContent, /SKILL\.md/);
  assert.match(h.node("#skills-documents").children[1].textContent, /references\/a\.md/);
  const options = h.node("#skills-license-choice").children.slice(1);
  const parsed = options.map(option => JSON.parse(option.value));
  assert.ok(parsed.some(item => item.license_name === "MIT" && item.declared === true));
  assert.ok(parsed.some(item => item.license_name === "Apache-2.0" && item.declared === true));
});

test("declared license confirmation posts to license-declare and then prepares", async () => {
  const h = harness();
  h.node("#skills-dialog").showModal();
  h.node("#skills-model").value = "model";
  await importLocal(h, [{
    name:"SKILL.md",size:2,arrayBuffer:async () => new TextEncoder().encode("x").buffer
  }], ["MIT"]);
  const task = h.click("license-confirm");
  const declareIdx = h.requests.length - 1;
  assert.equal(h.requests[declareIdx].path, "/api/skills/license-declare");
  assert.equal(JSON.parse(h.requests[declareIdx].options.body).license_name, "MIT");
  h.reply(declareIdx, { license_review: { status: "verified", license_name: "MIT" } });
  await tick();
  const requestIdx = h.requests.length - 1;
  assert.equal(h.requests[requestIdx].path, "/api/skills/requests");
  h.reply(requestIdx, prepared);
  await task;
  assert.match(h.node("#skills-snapshot").textContent, /verified/);
});

test("flow diagram highlights the current installation stage", async () => {
  const h = harness();
  h.node("#skills-dialog").showModal();
  const currentIndex = () => h.node("#skills-flow").children.findIndex(stage => stage["aria-current"] === "step");
  const labels = () => h.node("#skills-flow").children.map(stage => stage.children[1].textContent);
  assert.deepEqual(labels(), ["Source", "License", "Extract", "Save draft", "Edit & preview", "Apply"]);
  assert.equal(currentIndex(), 0);

  await importLocal(h, [{
    name:"SKILL.md",size:2,arrayBuffer:async () => new TextEncoder().encode("x").buffer
  }], ["MIT"]);
  assert.equal(currentIndex(), 1);

  const task = h.click("license-confirm");
  const declareIdx = h.requests.length - 1;
  h.reply(declareIdx, { license_review: { status: "verified", license_name: "MIT" } });
  await tick();
  const requestIdx = h.requests.length - 1;
  h.reply(requestIdx, prepared);
  await task;
  assert.equal(currentIndex(), 3);
});

test("automatic import names follow new sources, preserve manual names and reset for new drafts", async () => {
  const h = harness();
  h.node("#skills-dialog").showModal();
  const importTitle = async title => {
    await importLocal(h, [{
      name:"SKILL.md",size:title.length,arrayBuffer:async () => new TextEncoder().encode(`# ${title}`).buffer
    }]);
  };
  await importTitle("First");
  await importTitle("Second");
  assert.equal(h.node("#skills-name").value, "Second");
  h.input("name", "Manual title");
  await importTitle("Third");
  assert.equal(h.node("#skills-name").value, "Manual title");
  h.click("new");
  await importTitle("New draft");
  assert.equal(h.node("#skills-name").value, "New draft");
});

test("422 conversion preserves candidate and findings, permits saving but never installs", async () => {
  const h = harness();
  h.node("#skills-dialog").showModal();
  await prepare(h);
  const index = h.requests.length;
  const task = h.click("convert");
  const candidate = {status:"draft",package:{name:"Invalid candidate"}};
  h.reply(index, {error:"invalid_skill_conversion", result:candidate,
    validation:{valid:false,findings:[{code:"H04",path:"/package",message:"Evidence not found"}]}}, 422);
  await task;
  assert.deepEqual(JSON.parse(h.node("#skills-result").value), candidate);
  assert.match(h.node("#skills-status").textContent, /H04.*Evidence not found/);
  assert.equal(h.node("#skills-save").disabled, false);
  assert.equal(h.node("#skills-install").disabled, true);
});

test("saving a validated draft preserves exact candidate approval for category selection", async () => {
  const h = harness();
  h.node("#skills-dialog").showModal();
  await prepare(h);
  h.input("result", '{"status":"draft"}');
  let index = h.requests.length;
  const validate = h.click("validate");
  h.reply(index, {valid:true,candidate_sha256:"exact-hash",findings:[]});
  await validate;
  index = h.requests.length;
  const save = h.click("save");
  h.reply(index, {draft:{id:"saved-id",revision:"saved-revision"}});
  await tick();
  h.reply(index + 1, {items:[],storage_path:"private"});
  await save;
  h.node("#skills-category-options").events.change();
  assert.equal(h.node("#skills-install").disabled, false);
  const install = h.click("install");
  assert.equal(h.requests[index + 2].path, "/api/skills/drafts");
  h.reply(index + 2, {draft:{id:"saved-id",revision:"latest-revision"}});
  await tick();
  assert.equal(JSON.parse(h.requests[index + 3].options.body).revision, "latest-revision");
  h.reply(index + 3, {item:{enabled:false}});
  await install;
});

test("successful conversion auto-saves and HTTP 507 explains memory without losing source", async () => {
  const h = harness();
  h.node("#skills-dialog").showModal();
  await prepare(h);
  let index = h.requests.length;
  const convert = h.click("convert");
  const payload = JSON.parse(h.requests[index].options.body);
  assert.equal(payload.draft_id, null);
  assert.equal(payload.name, "My notes");
  h.reply(index, {result:{status:"draft",package:{name:"notes",bindings:[]}},
    validation:{valid:true,findings:[]}, draft:{id:"automatic",revision:"rev1"}});
  await tick();
  assert.equal(h.requests[index + 1].path, "/api/skills/drafts");
  h.reply(index + 1, {items:[],storage_path:"private"});
  await convert;
  assert.match(h.node("#skills-status").textContent, /Draft saved/);
  const sourceText = h.node("#skills-source").value;
  index = h.requests.length;
  const failed = h.click("convert");
  h.reply(index, {error:"skill_text_memory_unavailable",findings:[]}, 507);
  await failed;
  assert.match(h.node("#skills-status").textContent, /memory unavailable.*507/);
  assert.equal(h.node("#skills-source").value, sourceText);
  assert.equal(h.node("#skills-install").disabled, false);
});

test("GitHub discovery without a license cannot read documents or reuse old validation", async () => {
  const h = harness();
  h.node("#skills-dialog").showModal();
  await prepare(h);
  h.node("#skills-github").value = "https://github.com/test/repo/tree/main/skills/example";
  const index = h.requests.length;
  const discover = h.click("discover");
  h.reply(index, {origin:"https://github.com/test/repo",revision:"a".repeat(40),selected_path:"SKILL.md",
    files:[{path:"SKILL.md",size:10},{path:"reference.md",size:20}]});
  await discover;
  assert.equal(h.node("#skills-fetch").disabled, true);
  assert.equal(h.node("#skills-documents").children[0].children[0].checked, true);
  assert.equal(h.node("#skills-documents").children[1].children[0].checked, false);
  const count = h.requests.length;
  await h.click("fetch");
  assert.equal(h.requests.length, count);
  assert.equal(h.node("#skills-save").disabled, true);
  assert.equal(h.node("#skills-convert").disabled, true);
  h.node("#skills-github").events.input();
  assert.equal(h.node("#skills-fetch").disabled, true);
});

test("GitHub confirmation precedes reading; license evidence stays outside the source editor", async () => {
  const h = harness();
  h.node("#skills-dialog").showModal();
  h.node("#skills-model").value = "model";
  h.node("#skills-name").value = "Imported skill";
  h.node("#skills-origin").value = "local:placeholder";
  h.node("#skills-revision").value = "v1";
  h.node("#skills-github").value = "https://github.com/test/repo/tree/main/skills/example";
  const discoverIndex = h.requests.length;
  const discover = h.click("discover");
  h.reply(discoverIndex, {
    origin:"https://github.com/test/repo", revision:"a".repeat(40),
    selected_path:"skills/example/SKILL.md", license_path:"LICENSE",
    license_sources:[{
      source:{origin:"https://github.com/test/repo",revision:"a".repeat(40),
        files:[{id:"source-1",path:"LICENSE",content:"MIT License"}]},
      detected_licenses:[{license_name:"MIT",path:"LICENSE"}]
    }],
    files:[
      {path:"skills/example/SKILL.md",size:10,skill:true,license:false},
      {path:"LICENSE",size:20,skill:false,license:true}
    ]
  });
  await discover;
  assert.equal(h.node("#skills-fetch").disabled, true);
  assert.equal(h.node("#skills-documents").children.length, 1);
  assert.equal(h.node("#skills-license-confirm").disabled, false);
  assert.equal(h.node("#skills-license-choice").options[1].textContent, "MIT — LICENSE");

  const confirmIndex = h.requests.length;
  const confirm = h.click("license-confirm");
  const confirmation = JSON.parse(h.requests[confirmIndex].options.body);
  assert.equal(h.requests[confirmIndex].path, "/api/skills/license-review");
  assert.equal(confirmation.license_name, "MIT");
  assert.equal(confirmation.license_path, "LICENSE");
  assert.deepEqual(confirmation.source.files, [{path:"LICENSE",content:"MIT License"}]);
  h.reply(confirmIndex, {license_review:{status:"verified",license_name:"MIT"}});
  await confirm;
  assert.equal(h.requests.length, confirmIndex + 1);
  assert.equal(h.node("#skills-fetch").disabled, false);

  const fetchIndex = h.requests.length;
  const fetch = h.click("fetch");
  assert.deepEqual(JSON.parse(h.requests[fetchIndex].options.body).paths, [
    "skills/example/SKILL.md"
  ]);
  assert.equal(JSON.parse(h.requests[fetchIndex].options.body).license_path, "LICENSE");
  h.reply(fetchIndex, {
    source:{origin:"https://github.com/test/repo",revision:"a".repeat(40),files:[
      {id:"source-1",path:"skills/example/SKILL.md",content:"# Skill"},
      {id:"source-2",path:"LICENSE",content:"MIT License"}
    ]},
    detected_licenses:[{license_name:"MIT",path:"LICENSE"}]
  });
  await tick();
  assert.equal(h.requests[fetchIndex + 1].path, "/api/skills/requests");
  assert.deepEqual(JSON.parse(h.requests[fetchIndex + 1].options.body).source.files, [
    {path:"skills/example/SKILL.md",content:"# Skill"}, {path:"LICENSE",content:"MIT License"}
  ]);
  h.reply(fetchIndex + 1, {
    ...prepared, license_review:{status:"verified",license_name:"MIT",obligations:[]}
  });
  await fetch;
  assert.deepEqual(JSON.parse(h.node("#skills-source").value), [{path:"skills/example/SKILL.md",content:"# Skill"}]);
  assert.equal(h.node("#skills-license-evidence").children[0].children[1].textContent, "MIT License");
  assert.match(h.node("#skills-snapshot").textContent, /verified\nMIT/);
  assert.equal(h.node("#skills-convert").disabled, false);
});

test("sub-Skill grouping keeps sibling and nested directory sources independent", () => {
  pure.files = [
    {path:"SKILL.md",skill:true}, {path:"skills/a/SKILL.md",skill:true},
    {path:"skills/a/notes.md"}, {path:"skills/a/nested/SKILL.md",skill:true},
    {path:"skills/a/nested/ref.md"}, {path:"skills/ab/SKILL.md",skill:true}
  ];
  pure.paths = ["skills/a/SKILL.md","skills/a/notes.md","skills/a/nested/SKILL.md",
    "skills/a/nested/ref.md","skills/ab/SKILL.md"];
  const groups = JSON.parse(vm.runInContext("JSON.stringify(skillSourceGroups(files,paths))", pure));
  assert.equal(groups.length, 3);
  assert.deepEqual(groups.find(item => item.path === "skills/a/SKILL.md").paths,
    ["skills/a/SKILL.md","skills/a/notes.md"]);
  assert.deepEqual(groups.find(item => item.path === "skills/a/nested/SKILL.md").paths,
    ["skills/a/nested/SKILL.md","skills/a/nested/ref.md"]);
  pure.paths = ["skills/a/SKILL.md","skills/a/nested/ref.md"];
  assert.throws(() => vm.runInContext("skillSourceGroups(files,paths)", pure), /batchSelection/);
  pure.files = [{path:"SKILL.md",skill:true}, ...Array.from({length:15}, (_, i) => ({path:`ref${i}.md`}))];
  pure.paths = pure.files.map(file => file.path);
  assert.throws(() => vm.runInContext("skillSourceGroups(files,paths)", pure), /batchSelection/);
});

test("root Skills own only root references; group limits and ambiguous Skill directories are enforced", () => {
  pure.files = [{path:"SKILL.md",skill:true},{path:"README.md"},
    {path:"nested/SKILL.md",skill:true},{path:"nested/ref.md"}];
  pure.paths = pure.files.map(file => file.path);
  const groups = JSON.parse(vm.runInContext("JSON.stringify(skillSourceGroups(files,paths))", pure));
  assert.deepEqual(groups.find(group => group.path === "SKILL.md").paths, ["SKILL.md","README.md"]);
  pure.files = [{path:"SKILL.md",skill:true}, ...Array.from({length:14}, (_, i) => ({path:`ref${i}.md`}))];
  pure.paths = pure.files.map(file => file.path);
  assert.equal(vm.runInContext("skillSourceGroups(files,paths)[0].paths.length", pure), 15);
  pure.files = [{path:"SKILL.md",skill:true},{path:"skill.md",skill:true}];
  pure.paths = ["SKILL.md","skill.md"];
  assert.throws(() => vm.runInContext("skillSourceGroups(files,paths)", pure), /batchSelection/);
});

test("batch actions and memory guidance cover fourteen languages without manual review controls", () => {
  const result = vm.runInContext("({keys:skillBatchKeys,labels:skillBatchTranslations,simple:skillSimpleTranslations})", pure);
  assert.equal(Object.keys(result.labels).length, 14);
  for (const [language, values] of Object.entries(result.labels)) {
    assert.equal(values.length, result.keys.length);
    assert.ok(values.every(value => value.trim()), language);
    assert.match(result.simple[language][5], /507/, language);
  }
  const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
  assert.doesNotMatch(html, /id="skills-(?:reviewer|check-)/);
  assert.match(html, /id="skills-batch-convert"/);
  assert.match(html, /id="skills-batch-install"/);
});

async function discoverBatch(h) {
  h.node("#skills-dialog").showModal();
  h.node("#skills-model").value = "model";
  h.node("#skills-github").value = "https://github.com/test/repo";
  let index = h.requests.length;
  const discover = h.click("discover");
  h.reply(index, {origin:"https://github.com/test/repo",revision:"a".repeat(40),
    files:[{path:"a/SKILL.md",skill:true,size:10},{path:"b/SKILL.md",skill:true,size:10}],
    selected_path:"a/SKILL.md",license_path:"LICENSE",
    license_sources:[{source:{origin:"https://github.com/test/repo",revision:"a".repeat(40),
      files:[{path:"LICENSE",content:"MIT License"}]},
      detected_licenses:[{license_name:"MIT",path:"LICENSE"}]}]});
  await discover;
  h.node("#skills-license-choice").value = JSON.stringify({license_name:"MIT",path:"LICENSE"});
  index = h.requests.length;
  const confirm = h.click("license-confirm");
  h.reply(index, {license_review:{status:"verified"}});
  await confirm;
  for (const label of h.node("#skills-documents").children) label.children[0].checked = true;
}

async function replyBatchGroup(h, index, path, id) {
  assert.equal(h.requests[index].path, "/api/skills/github/fetch");
  assert.deepEqual(JSON.parse(h.requests[index].options.body).paths, [path]);
  h.reply(index, {source:{origin:"https://github.com/test/repo",revision:"a".repeat(40),
    files:[{id:"source-1",path,content:`# ${id}`},{id:"source-2",path:"LICENSE",content:"MIT License"}]}});
  await tick();
  assert.equal(h.requests[index + 1].path, "/api/skills/requests");
  assert.equal(JSON.parse(h.requests[index + 1].options.body).source.files[0].id, undefined);
  h.reply(index + 1, {...prepared,request:{trusted_context:{request_id:id}}});
  await tick();
  assert.equal(h.requests[index + 2].path, "/api/skills/convert");
  h.reply(index + 2, {result:{status:"draft",package:{name:id}},validation:{valid:true,findings:[]},
    draft:{id,name:id,revision:`rev-${id}`}});
  await tick();
}

test("one GitHub link converts independent drafts and installs exact revisions sequentially", async () => {
  const h = harness();
  await discoverBatch(h);
  const index = h.requests.length;
  const conversion = h.click("batch-convert");
  await replyBatchGroup(h, index, "a/SKILL.md", "alpha");
  await replyBatchGroup(h, index + 3, "b/SKILL.md", "beta");
  h.reply(index + 6, {items:[{id:"alpha",name:"alpha",revision:"rev-alpha"},
    {id:"beta",name:"beta",revision:"rev-beta"}],storage_path:"private"});
  await conversion;
  assert.match(h.node("#skills-status").textContent, /2\/2/);
  assert.equal(h.node("#skills-batch-install").disabled, false);
  const start = h.requests.length;
  const installation = h.click("batch-install");
  assert.equal(h.requests[start].path, "/api/skills/apply");
  assert.deepEqual(JSON.parse(h.requests[start].options.body), {draft_id:"alpha",revision:"rev-alpha",
    published_id:null,published_revision:null});
  h.reply(start, {item:{enabled:true}});
  await tick();
  assert.deepEqual(JSON.parse(h.requests[start + 1].options.body), {draft_id:"beta",revision:"rev-beta",
    published_id:null,published_revision:null});
  h.reply(start + 1, {item:{enabled:true}});
  await installation;
  assert.equal(h.node("#skills-batch-install").disabled, true);
});

test("batch memory failure preserves a saved child and retries only the unfinished child", async () => {
  const h = harness();
  await discoverBatch(h);
  const index = h.requests.length;
  const conversion = h.click("batch-convert");
  await replyBatchGroup(h, index, "a/SKILL.md", "alpha");
  h.reply(index + 3, {error:"skill_text_memory_unavailable"}, 507);
  await tick();
  h.reply(index + 4, {items:[{id:"alpha",name:"alpha",revision:"rev-alpha"}],storage_path:"private"});
  await conversion;
  assert.match(h.node("#skills-status").textContent, /1\/2/);
  assert.match(h.node("#skills-batch-status").children[1].textContent, /507/);
  const start = h.requests.length;
  const retry = h.click("batch-convert");
  await replyBatchGroup(h, start, "b/SKILL.md", "beta");
  h.reply(start + 3, {items:[{id:"alpha",name:"alpha",revision:"rev-alpha"},
    {id:"beta",name:"beta",revision:"rev-beta"}],storage_path:"private"});
  await retry;
  assert.match(h.node("#skills-status").textContent, /2\/2/);
});

test("batch installation keeps only failed drafts selected for retry and preserves current editing", async () => {
  const h = harness();
  const refresh = h.click("refresh");
  h.reply(0, {items:[{id:"a",name:"alpha",revision:"r1"},{id:"b",name:"beta",revision:"r2"}]});
  await refresh;
  h.node("#skills-dialog").showModal();
  for (const row of [...h.node("#skills-list").children]) {
    row.children[0].checked = true;
    row.children[0].events.change();
  }
  h.node("#skills-result").value = '{"unfinished":"editor text"}';
  h.node("#skills-source").value = "current source";
  const install = h.click("batch-install");
  h.reply(1, {item:{enabled:false}});
  await tick();
  h.reply(2, {error:"skill_snapshot_changed"}, 409);
  await install;
  assert.match(h.node("#skills-status").textContent, /1\/2/);
  assert.equal(h.node("#skills-result").value, '{"unfinished":"editor text"}');
  assert.equal(h.node("#skills-source").value, "current source");
  assert.equal(h.node("#skills-batch-install").disabled, false);
  const retry = h.click("batch-install");
  assert.deepEqual(JSON.parse(h.requests[3].options.body), {draft_id:"b",revision:"r2",
    published_id:null,published_revision:null});
  h.reply(3, {item:{enabled:false}});
  await retry;
  assert.equal(h.node("#skills-batch-install").disabled, true);
});

test("creative preset guidance editor synchronizes JSON and preview without changing evidence or losing focus", async () => {
  const h = harness();
  await prepare(h);
  const binding = {task:"prompt-enhancement",mode:"video",instructions:"Original method",
    evidence:[{file_id:"source-1",excerpt:"original source"}]};
  h.input("result", JSON.stringify({status:"draft",package:{bindings:[binding]}}));
  const editor = h.node("#skills-editor").children[1];
  assert.equal(editor.maxLength, 6000);
  assert.equal(editor.value, "Original method");
  editor.value = "User-edited method";
  editor.events.input();
  const next = JSON.parse(h.node("#skills-result").value).package.bindings[0];
  assert.equal(next.instructions, "User-edited method");
  assert.deepEqual(next.evidence, binding.evidence);
  assert.equal(h.node("#skills-editor").children[1], editor);
  assert.match(h.node("#skills-validation").textContent, /Unvalidated/);
  const preview = h.node("#skills-preview").children.flatMap(section => section.children);
  assert.ok(preview.some(node => node.textContent === "User-edited method"));
});

test("apply saves edits and uses the cached published revision, preserving draft after a conflict", async () => {
  const h = harness();
  h.node("#skills-dialog").showModal();
  await prepare(h);
  h.skills.published = () => ({id:"published-id",revision:"published-old"});
  h.input("result", JSON.stringify({status:"draft",package:{bindings:[
    {task:"prompt-enhancement",mode:"video",instructions:"Method",evidence:[]}
  ]}}));
  const index = h.requests.length;
  const apply = h.click("install");
  h.reply(index, {draft:{id:"draft-id",revision:"draft-new"}});
  await tick();
  assert.equal(h.requests[index + 1].path, "/api/skills/apply");
  assert.deepEqual(JSON.parse(h.requests[index + 1].options.body), {
    draft_id:"draft-id",revision:"draft-new",published_id:"published-id",
    published_revision:"published-old",categories:["video","image"]
  });
  h.reply(index + 1, {error:"installed_skill_changed"}, 409);
  await apply;
  assert.match(h.node("#skills-status").textContent, /installed_skill_changed/);
  assert.equal(JSON.parse(h.node("#skills-result").value).package.bindings[0].instructions, "Method");
});

test("preset flow and editing labels cover all fourteen languages", () => {
  const {keys,labels} = vm.runInContext("({keys:skillPresetKeys,labels:skillPresetTranslations})", pure);
  assert.equal(Object.keys(labels).length, 14);
  for (const [language, values] of Object.entries(labels)) {
    assert.equal(values.length, keys.length, language);
    assert.ok(values.every(value => value.trim()), language);
  }
  const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
  assert.match(html, /id="skills-editor"/);
  assert.match(html, /id="skills-install"[^>]*data-skill-i18n="apply"/);
});

test("an older live backend disables publishing but preserves editing and saving", async () => {
  const h = harness();
  await prepare(h);
  h.skills.applyAvailable = () => false;
  h.input("result", '{"status":"draft","package":{"bindings":[]}}');
  assert.equal(h.node("#skills-install").disabled, true);
  assert.equal(h.node("#skills-save").disabled, false);
  assert.match(h.node("#skills-availability").textContent, /updated backend/);
  const count = h.requests.length;
  await h.click("install");
  assert.equal(h.requests.length, count);
});

test("automatic draft storage failures preserve generated candidates without claiming they were saved", async () => {
  const h = harness();
  h.node("#skills-dialog").showModal();
  await prepare(h);
  const index = h.requests.length;
  const convert = h.click("convert");
  const result = {status:"draft",package:{name:"Unsaved notes",bindings:[]}};
  h.reply(index, {error:"skill_draft_capacity_reached",result,validation:{valid:true,findings:[]},findings:[]}, 409);
  await convert;
  assert.deepEqual(JSON.parse(h.node("#skills-result").value), result);
  assert.match(h.node("#skills-status").textContent, /skill_draft_capacity_reached/);
  assert.equal(h.node("#skills-save").disabled, false);
  assert.doesNotMatch(h.node("#skills-status").textContent, /Draft saved/);
});

test("batch delete removes selected drafts with exact revisions and user confirmation", async () => {
  const h = harness();
  const refresh = h.click("refresh");
  h.reply(0, {items:[{id:"d1",name:"draft1",revision:"r1"},{id:"d2",name:"draft2",revision:"r2"}]});
  await refresh;
  assert.equal(h.node("#skills-batch-delete").disabled, true);
  const row1 = h.node("#skills-list").children[0];
  row1.children[0].checked = true;
  row1.children[0].events.change();
  assert.equal(h.node("#skills-batch-delete").disabled, false);
  h.setConfirm(false);
  await h.click("batch-delete");
  assert.equal(h.requests.filter(r => r.path.includes("/delete")).length, 0);
  h.setConfirm(true);
  const task = h.click("batch-delete");
  assert.equal(h.requests[1].path, "/api/skills/drafts/d1/delete");
  assert.deepEqual(JSON.parse(h.requests[1].options.body), {revision:"r1"});
  h.reply(1, {ok:true});
  await tick();
  h.reply(2, {items:[{id:"d2",name:"draft2",revision:"r2"}]});
  await task;
  assert.match(h.node("#skills-status").textContent, /1\/1/);
});
