// The Christmas theme exists in December only.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const html = read("www/index.html");

function fnSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, name);
  const body = source.indexOf("{", source.indexOf(")", start));
  let depth = 0;
  for (let i = body; ; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}" && --depth === 0) return source.slice(start, i + 1);
  }
}

// Runs the page's first script on a given day.
function start(day, stored) {
  const script = html.match(/<script>(\(function\(\)\{var t=localStorage[\s\S]*?)<\/script>/)[1];
  const RealDate = Date;
  const documentElement = { dataset: {}, style: {} };
  const store = { ...stored };
  const context = {
    Date: class extends RealDate { constructor() { super(day); } },
    document: { documentElement },
    localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; } },
  };
  vm.createContext(context);
  vm.runInContext(script, context);
  return { theme: documentElement.dataset.theme, background: documentElement.style.background, store };
}

test("in December it stays, after it the previous theme comes back for good", () => {
  const saved = { "c64-block-theme": "christmas", "c64-block-theme-before-christmas": "beige" };
  for (const day of ["2026-12-01T00:00:00", "2026-12-25T12:00:00", "2026-12-31T23:59:00"]) {
    const on = start(day, saved);
    assert.equal(on.theme, "christmas", day);
    assert.equal(on.background, "#0b2a5b", "no flash of another colour");
  }
  for (const day of ["2026-11-30T23:59:00", "2027-01-01T00:00:00", "2026-07-01T12:00:00"]) {
    const off = start(day, saved);
    assert.equal(off.theme, "beige", day);
    assert.equal(off.store["c64-block-theme"], "beige", "next December it is not forced back");
  }
  assert.notEqual(start("2027-01-01T12:00:00", { "c64-block-theme": "christmas" }).theme, "christmas", "nothing remembered: the default");
  assert.equal(start("2026-07-01T12:00:00", { "c64-block-theme": "oled" }).theme, "oled", "other themes are left alone");
});

test("the picker offers it in December only", () => {
  assert.match(html, /data-theme-opt="christmas" type="button" hidden>/);
  const source = read("www/app.js");
  const option = { hidden: true };
  const RealDate = Date;
  let day = "2026-12-01T12:00:00";
  const context = {
    Date: class extends RealDate { constructor(...a) { super(...(a.length ? a : [day])); } },
    document: { querySelector: () => option },
  };
  vm.createContext(context);
  vm.runInContext(fnSource(source, "_isChristmasThemeDay") + "\n" + fnSource(source, "_christmasThemeSync") + "\nthis.sync = _christmasThemeSync;", context);
  context.sync();
  assert.equal(option.hidden, false);
  day = "2027-01-01T00:00:00";
  context.sync();
  assert.equal(option.hidden, true);
  assert.match(source, /addEventListener\("toggle", _christmasThemeSync\)/, "checked again when the picker opens");
});

test("choosing it remembers the theme it replaces, not itself", () => {
  const source = read("www/app.js");
  const body = fnSource(source, "setTheme");
  assert.match(body, /theme === "christmas" && previous && previous !== "christmas"/);
  assert.ok(body.indexOf("c64-block-theme-before-christmas") < body.indexOf("dataset.theme = theme"), "read before it changes");
});

test("the theme's style, the hidden option's style and the name in the seven languages", () => {
  const css = read("www/style.css");
  assert.match(css, /html\[data-theme="christmas"\] \{/);
  assert.match(css, /\.theme-option\[hidden\] \{ display: none; \}/);
  const context = {};
  vm.createContext(context);
  vm.runInContext(read("www/i18n.js") + "\n;this.__t = translations;", context);
  for (const lang of ["hu", "en", "es", "de", "nl", "pl", "it"]) assert.equal(typeof context.__t[lang].themeChristmas, "string", lang);
});
