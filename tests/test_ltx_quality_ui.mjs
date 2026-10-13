import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");

test("LTX quality labels and resource warning cover all fourteen languages", () => {
  const context = vm.createContext({});
  vm.runInContext(source.slice(source.indexOf("const ltxQualityTranslations ="),
    source.indexOf("for (const [language, values] of Object.entries(ltxQualityTranslations))")), context);
  const labels = vm.runInContext("ltxQualityTranslations", context);
  assert.equal(Object.keys(labels).length, 14);
  for (const values of Object.values(labels)) {
    assert.equal(values.length, 5);
    assert.ok(values.every(value => typeof value === "string" && value.trim()));
    for (const edge of [512, 768, 1024]) assert.ok(values[4].includes(String(edge)));
  }
  for (const id of ["video-quality", "workflow-video-quality"]) {
    const select = html.slice(html.indexOf(`<select id="${id}"`)).split("</select>")[0];
    assert.match(select, /value="standard".*selected/);
    for (const quality of ["preview", "standard", "high"]) assert.ok(select.includes(`value="${quality}"`));
  }
});

test("workflow request carries selected quality for both LTX and H3", () => {
  const nodes = new Map();
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, {value:"", checked:true});
    return nodes.get(id);
  };
  node("#workflow-name").value = "Film";
  node("#workflow-aspect").value = "16:9";
  node("#workflow-video-quality").value = "high";
  const context = vm.createContext({
    window: {},
    document: {querySelector:node}, videoModelChoice:{value:"ltx-2.3-distilled-q8"},
    workflowShots:{children:[]}, currentWorkflow:null, workflowGlobalMusicPrompt:{value:"Piano"},
    workflowMusicSource:{value:""}, workflowBurnLyrics:{checked:false}
  });
  vm.runInContext(source.slice(source.indexOf("function workflowPayload()"),
    source.indexOf("function setWorkflowForm(")), context);
  assert.equal(vm.runInContext("workflowPayload().quality", context), "high");
  vm.runInContext("videoModelChoice.value='h3'", context);
  assert.equal(vm.runInContext("workflowPayload().quality", context), "high");
});

test("quality is wired into video submission, history, workflow restoration and model visibility", () => {
  assert.match(source, /quality: document\.querySelector\("#video-quality"\)\.value/);
  assert.match(source, /restoreHistoryControl\("#video-quality", settings\.quality \|\| \(videoModelChoice\.value === "h3" \? "standard" : "preview"\)\)/);
  assert.match(source, /"#workflow-video-quality"\)\.value = manifest\.quality \|\| \(videoModelChoice\.value === "h3"/);
  assert.doesNotMatch(source, /"#workflow-video-quality"\)\.value = "preview"/);
  for (const field of ["video-quality-field", "workflow-video-quality-field"]) {
    assert.ok(source.includes(`document.querySelector("#${field}").hidden = false`));
  }
});
