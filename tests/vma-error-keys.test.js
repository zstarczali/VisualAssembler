// Every translation key the Rust VMA compiler names in an error (the VMA repository: Msg::keyed and the
// runtime IF / WHILE key choice) exists in all seven languages of www/i18n.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { vmaDir } = require("./helpers/vma-rust");

const repo = path.join(__dirname, "..");

const dir = path.join(vmaDir(), "src");

test("the Rust compiler's error keys are translated", { skip: !fs.existsSync(dir) && "no VMA source (VMA_DIR, or ../VMA)" }, () => {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(repo, "www/i18n.js"), "utf8") + ";this.__t = translations;", ctx);
  const translations = ctx.__t;
  const keys = new Set();
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith(".rs"))) {
    const text = fs.readFileSync(path.join(dir, file), "utf8");
    for (const m of text.matchAll(/Msg::keyed\("([A-Za-z0-9]+)"/g)) keys.add(m[1]);
    for (const m of text.matchAll(/"(compile(?:If|Loop|While|Until)[A-Za-z0-9]+)"/g)) keys.add(m[1]);
  }
  assert.ok(keys.size > 50, `only ${keys.size} keys found`);
  const missing = [];
  for (const lang of ["hu", "en", "es", "de", "nl", "pl", "it"]) {
    for (const key of keys) if (typeof translations[lang]?.[key] !== "string") missing.push(`${lang}.${key}`);
  }
  assert.deepEqual(missing, []);
});
