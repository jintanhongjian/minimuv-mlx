import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../webapp/static/index.html", import.meta.url), "utf8");

test("project copy is model-neutral in all fourteen languages", () => {
  const context = vm.createContext({});
  vm.runInContext(source.slice(0, source.indexOf("const languageSelect =")) +
    "\nthis.copy = {translations, workflowTranslations, storyboardTranslations};", context);
  const languages = ["en", "zh-CN", "zh-TW", "fr", "de", "ja", "ko",
    "es", "pt", "tr", "ar", "vi", "id", "ru"];
  for (const lang of languages) {
    for (const text of [
      context.copy.translations[lang].introCopy,
      context.copy.workflowTranslations[lang].computeNote,
      context.copy.storyboardTranslations[lang].workflowNote
    ]) {
      assert.ok(text?.length > 0, lang);
      assert.doesNotMatch(text, /MiniMax|\bH3\b/i, lang);
    }
  }
  assert.doesNotMatch(html, /Powered by MiniMax H3/);
  assert.match(html, /<span>MiniMuv<\/span>/);
  assert.doesNotMatch(html.match(/<p class="intro-copy"[^>]*>(.*?)<\/p>/s)[1], /MiniMax|\bH3\b/i);
});

test("model-specific configuration retains the model identity", () => {
  assert.match(html, /data-i18n="settingsVideo">视频生成 · MiniMax H3/);
  assert.match(source, /H3：预览／标准／高质量/);
  assert.match(source, /const videoModelChoice = document\.querySelector/);
});
