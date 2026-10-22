// Loads www/i18n.js + www/app.js into a node:vm context with a stub DOM, so a test
// can run whole pipelines (parse → layout → PRG) the way the app does.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..", "..", "www");

// Any property read, call or construction gives another stub.
function anyStub(name = "stub") {
  const fn = function () { return anyStub(name + "()"); };
  return new Proxy(fn, {
    get(target, key) {
      if (key === Symbol.toPrimitive) return () => "";
      if (key === Symbol.iterator) return function* () {};
      if (key === "then") return undefined;
      if (key === "length") return 0;
      if (["value", "textContent", "innerHTML", "className", "id"].includes(key)) return "";
      if (["checked", "hidden", "disabled", "open"].includes(key)) return false;
      if (key === "dataset") return {};
      if (key === "classList") return { add() {}, remove() {}, toggle() {}, contains() { return false; } };
      if (key in target) return target[key];
      return anyStub(name + "." + String(key));
    },
    set() { return true; },
    apply() { return anyStub(name + "()"); },
    construct() { return anyStub("new " + name); }
  });
}

module.exports = function loadApp() {
  const storage = {};
  const elements = {};
  // getElementById returns one stub per id, with a writable value (the palette
  // selects need a valid category / mnemonic while app.js starts).
  const element = (id) => {
    if (!elements[id]) {
      const base = anyStub("#" + id);
      const own = {
        value: id === "category-select" ? "Adatmozgatas" : id === "mnemonic-select" ? "LDA" : "",
        checked: false, hidden: false, disabled: false, textContent: "", innerHTML: ""
      };
      elements[id] = new Proxy(base, {
        get(target, key) { return key in own ? own[key] : base[key]; },
        set(target, key, value) { own[key] = value; return true; }
      });
    }
    return elements[id];
  };
  const doc = anyStub("document");
  const ctx = {
    console, queueMicrotask, structuredClone, URL, TextEncoder, TextDecoder,
    setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
    requestAnimationFrame: () => 0, cancelAnimationFrame() {},
    crypto: { randomUUID: () => Math.random().toString(16).slice(2) + Date.now().toString(16) },
    localStorage: { getItem: k => storage[k] ?? null, setItem: (k, v) => { storage[k] = String(v); }, removeItem: k => { delete storage[k]; } },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    navigator: { platform: "Win32", userAgent: "node", language: "en", clipboard: anyStub("clipboard") },
    document: new Proxy(doc, { get(target, key) { return key === "getElementById" ? element : doc[key]; } }),
    location: { search: "", href: "", hash: "" },
    matchMedia: () => ({ matches: false, addEventListener() {}, addListener() {} }),
    getComputedStyle: () => anyStub("style"), performance: { now: () => Date.now() },
    Event: class { constructor(type) { this.type = type; } },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options?.detail; } },
    ResizeObserver: class { observe() {} disconnect() {} },
    MutationObserver: class { observe() {} disconnect() {} },
    IntersectionObserver: class { observe() {} disconnect() {} },
    Image: class {}, Audio: class {}, Blob: class {}, FileReader: class {},
    fetch: async () => ({ ok: false }),
    atob: s => Buffer.from(s, "base64").toString("binary"),
    btoa: s => Buffer.from(s, "binary").toString("base64")
  };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  ctx.self = ctx;
  ctx.addEventListener = () => {};
  ctx.removeEventListener = () => {};
  ctx.dispatchEvent = () => {};
  vm.createContext(ctx);
  for (const file of ["i18n.js", "app.js"]) {
    vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), ctx, { filename: file });
  }
  ctx.run = (code) => vm.runInContext(code, ctx);
  return ctx;
};
