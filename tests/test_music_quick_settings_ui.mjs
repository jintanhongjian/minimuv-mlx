import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../webapp/static/app.js", import.meta.url), "utf8");
const context = vm.createContext({});
vm.runInContext(source.slice(source.indexOf("const musicQuickKeys ="),
  source.indexOf("const localModelTranslations =")), context);
const toggle = (prompt, keyword, limit = 4000) =>
  context.toggleMusicKeyword(prompt, keyword, limit);

test("lyrics placeholders explain five unchanged section tags in all fourteen languages", () => {
  const lyricsContext = vm.createContext({});
  vm.runInContext(source.slice(source.indexOf("const musicTranslations ="),
    source.indexOf("const storyboardTranslations =")), lyricsContext);
  const translations = vm.runInContext("musicTranslations", lyricsContext);
  assert.equal(Object.keys(translations).length, 14);
  for (const labels of Object.values(translations)) {
    const lines = labels.musicLyricsPlaceholder.split("\n");
    assert.equal(lines.length, 5);
    for (const [index, tag] of ["intro", "verse", "chorus", "bridge", "outro"].entries()) {
      assert.ok(lines[index].startsWith(`[${tag}]`));
      assert.ok(lines[index].length > `[${tag}]: `.length);
    }
  }
  assert.equal(translations["zh-CN"].musicLyricsPlaceholder,
    "[intro]：前奏，营造氛围。\n[verse]：主歌，讲故事、铺陈细节。\n[chorus]：副歌，情绪高潮、最抓耳部分。\n[bridge]：桥段，承上启下，加入变化。\n[outro]：尾奏，渐弱收尾。");
});

test("keywords toggle without overwriting prose or duplicating existing tokens", () => {
  assert.equal(toggle("A quiet evening", "Piano"), "A quiet evening, Piano");
  assert.equal(toggle("A quiet evening, Piano", "Piano"), "A quiet evening");
  assert.equal(toggle("", "R&B"), "R&B");
  assert.equal(toggle("r&b", "R&B"), "");
  assert.equal(toggle("Pop, Piano; Warm", "Piano"), "Pop; Warm");
  assert.equal(toggle("Pop, Piano", "Pop"), "Piano");
  assert.equal(toggle("Pop music for a walk", "Pop"), "Pop music for a walk, Pop");
  assert.equal(toggle("Synth-pop, Alternative rock", "Pop"), "Synth-pop, Alternative rock, Pop");
  assert.equal(toggle("My song\nPiano\nWarm", "Piano"), "My song\nWarm");
});

test("limit violations leave the original prompt untouched and removal still works", () => {
  assert.throws(() => toggle("12345", "Piano", 10), /music_keyword_prompt_too_long/);
  assert.equal(toggle("12345", "Pop", 10), "12345, Pop");
  assert.equal(toggle("12345, Pop", "Pop", 5), "12345");
});

test("every category and subgroup heading has translations in all fourteen languages", () => {
  const data = vm.runInContext("({ keys: musicQuickKeys, translations: musicQuickTranslations, categories: musicKeywordCategories })", context);
  const headings = data.categories.flatMap(([category, groups]) =>
    [category, ...groups.map(([key]) => key)]);
  assert.ok(headings.includes("musicQuickVocalTone"));
  assert.equal(Object.keys(data.translations).length, 14);
  for (const labels of Object.values(data.translations)) {
    assert.equal(labels.length, data.keys.length);
    for (const key of headings) {
      const index = data.keys.indexOf(key);
      assert.ok(index >= 0, `Missing heading key: ${key}`);
      assert.ok(typeof labels[index] === "string" && labels[index].length > 0);
      assert.notEqual(labels[index], key);
    }
  }
});

test("all requested categories and all fourteen languages are complete", () => {
  const data = vm.runInContext("({ keys: musicQuickKeys, translations: musicQuickTranslations, categories: musicKeywordCategories })", context);
  assert.equal(Object.keys(data.translations).length, 14);
  for (const labels of Object.values(data.translations)) {
    assert.equal(labels.length, data.keys.length);
    assert.ok(labels.every(label => typeof label === "string" && label.length > 0));
  }
  assert.equal(data.categories.length, 4);
  const keywords = data.categories.flatMap(([, groups]) => groups.flatMap(([, words]) => words));
  assert.equal(keywords.length, 61);
  assert.equal(new Set(keywords).size, keywords.length);
  for (const word of ["Gu-feng", "A cappella", "808 bass", "90 BPM", "Female vocals", "Lo-fi hip hop",
    "Rural", "Blues wailing", "Ballad", "Soprano", "Alto", "Tenor", "Baritone / Bass",
    "Gravelly / Raspy", "Soulful", "Huskier", "Operatic"]) {
    assert.ok(keywords.includes(word));
  }
});
