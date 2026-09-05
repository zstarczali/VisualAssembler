const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

test("i18n: all languages have complete key parity without missing translations", () => {
  const i18nCode = fs.readFileSync(path.join(__dirname, "..", "www", "i18n.js"), "utf8");
  const tr = vm.runInNewContext(i18nCode + "; translations;");

  const languages = ["hu", "en", "es", "de", "nl"];
  assert.deepStrictEqual(Object.keys(tr).sort(), languages.sort());

  const enKeys = new Set(Object.keys(tr.en));
  assert.ok(enKeys.size >= 1100, `Expected at least 1100 keys, got ${enKeys.size}`);

  for (const lang of languages) {
    const langKeys = new Set(Object.keys(tr[lang]));
    const missing = [...enKeys].filter(k => !langKeys.has(k));
    assert.strictEqual(missing.length, 0, `Language ${lang} is missing keys: ${missing.join(", ")}`);
    assert.strictEqual(langKeys.size, enKeys.size, `Key count mismatch for ${lang}: ${langKeys.size} vs ${enKeys.size}`);

    // Check nested objects
    assert.ok(tr[lang].categoryNames, `Missing categoryNames in ${lang}`);
    assert.ok(tr[lang].memorySegments, `Missing memorySegments in ${lang}`);
    assert.deepStrictEqual(
      Object.keys(tr[lang].categoryNames).sort(),
      Object.keys(tr.en.categoryNames).sort(),
      `categoryNames mismatch in ${lang}`
    );
    assert.deepStrictEqual(
      Object.keys(tr[lang].memorySegments).sort(),
      Object.keys(tr.en.memorySegments).sort(),
      `memorySegments mismatch in ${lang}`
    );
  }
});

test("i18n: mnemonicDescriptions parity in app.js", () => {
  const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

  function extractObj(name) {
    const marker = "const " + name + " = ";
    const start = appJs.indexOf(marker);
    assert.notStrictEqual(start, -1, `Missing object ${name}`);
    const brace = appJs.indexOf("{", start);
    let depth = 0, end = -1;
    for (let i = brace; i < appJs.length; i++) {
      if (appJs[i] === "{") depth++;
      else if (appJs[i] === "}") {
        depth--;
        if (depth === 0) { end = i + 1; break; }
      }
    }
    return eval("(" + appJs.slice(brace, end) + ")");
  }

  const en = extractObj("mnemonicDescriptionsEn");
  const es = extractObj("mnemonicDescriptionsEs");
  const de = extractObj("mnemonicDescriptionsDe");
  const nl = extractObj("mnemonicDescriptionsNl");

  const enKeys = Object.keys(en);
  for (const [lang, obj] of [["es", es], ["de", de], ["nl", nl]]) {
    const missing = enKeys.filter(k => !obj[k]);
    assert.strictEqual(missing.length, 0, `mnemonicDescriptions${lang.toUpperCase()} missing: ${missing.join(", ")}`);
  }
});

test("i18n: language select options include Nederlands in index.html", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
  assert.ok(html.includes('<option value="nl">Nederlands</option>'));
});

test("i18n: ubCommandDescriptions parity in app.js", () => {
  const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

  function extractObj(name) {
    const marker = "const " + name + " = ";
    const start = appJs.indexOf(marker);
    assert.notStrictEqual(start, -1, `Missing object ${name}`);
    const brace = appJs.indexOf("{", start);
    let depth = 0, end = -1;
    for (let i = brace; i < appJs.length; i++) {
      if (appJs[i] === "{") depth++;
      else if (appJs[i] === "}") {
        depth--;
        if (depth === 0) { end = i + 1; break; }
      }
    }
    return eval("(" + appJs.slice(brace, end) + ")");
  }

  const en = extractObj("ubCommandDescriptionsEn");
  const hu = extractObj("ubCommandDescriptionsHu");
  const es = extractObj("ubCommandDescriptionsEs");
  const de = extractObj("ubCommandDescriptionsDe");
  const nl = extractObj("ubCommandDescriptionsNl");

  const enKeys = Object.keys(en);
  assert.ok(enKeys.length >= 100, `Expected at least 100 UB command descriptions, got ${enKeys.length}`);
  for (const [lang, obj] of [["hu", hu], ["es", es], ["de", de], ["nl", nl]]) {
    const missing = enKeys.filter(k => !obj[k]);
    assert.strictEqual(missing.length, 0, `ubCommandDescriptions${lang.toUpperCase()} missing: ${missing.join(", ")}`);
    assert.strictEqual(Object.keys(obj).length, enKeys.length, `ubCommandDescriptions${lang.toUpperCase()} count mismatch`);
  }
});

