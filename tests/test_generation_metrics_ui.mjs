import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");
const formatter = source.slice(source.indexOf("function formatGenerationMetrics("),
  source.indexOf("function renderJob("));

function format(item) {
  const context = vm.createContext({Intl, Number, Math, languageSelect: {value: "en"},
    t: key => ({metricElapsed: "Elapsed", metricTokens: "Tokens"})[key]});
  vm.runInContext(formatter, context);
  return context.formatGenerationMetrics(item);
}

test("generation metrics show elapsed seconds and token count", () => {
  assert.equal(format({elapsed_seconds: 25.24, tokens: 1234}), "Elapsed 25.2s · Tokens 1,234");
});

test("missing metrics render as dashes instead of zero", () => {
  assert.equal(format({elapsed_seconds: null, tokens: null}), "Elapsed — · Tokens —");
  assert.equal(format({}), "Elapsed — · Tokens —");
});

test("job log and history rows include metric elements", () => {
  assert.match(html, /id="job-metrics"/);
  assert.match(source, /history-metrics/);
  for (const key of ["metricElapsed", "metricTokens"]) {
    assert.equal(source.match(new RegExp(`${key}: "`, "g")).length, 14);
  }
});
