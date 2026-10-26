// A big Kick project made every click in the project tree slow: the disassembly is written in
// chunks the browser can skip (_setDisasmLines), and an unchanged source tree reuses the last
// preprocess result (_kickSameTree).
const test = require("node:test");
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");

const app = loadApp();

test("a long disassembly goes in chunks with the same text", () => {
  app.__lines = Array.from({ length: 1001 }, (_, i) => `<span class="dsm-addr">$${i.toString(16)}</span>  NOP`);
  const html = app.run(`(() => { const el = { innerHTML: "" }; _setDisasmLines(el, __lines); return el.innerHTML; })()`);
  const chunks = html.match(/<div class="dsm-chunk"[^>]*>/g) || [];
  assert.equal(chunks.length, Math.ceil(1001 / app.run("_DISASM_CHUNK_LINES")));
  const text = (h) => h.replace(/<[^>]+>/g, "");
  assert.equal(text(html), text(app.__lines.join("\n")));
  // a short one stays one block of lines
  app.__short = app.__lines.slice(0, 10);
  assert.equal(app.run(`(() => { const el = { innerHTML: "" }; _setDisasmLines(el, __short); return el.innerHTML; })()`), app.__short.join("\n"));
});

test("the source tree comparison of the Kick preprocess cache", () => {
  assert.equal(app.run(`_kickSameTree(new Map([["a", "x"], ["b", null]]), new Map([["a", "x"], ["b", null]]))`), true);
  assert.equal(app.run(`_kickSameTree(new Map([["a", "x"]]), new Map([["a", "y"]]))`), false);
  assert.equal(app.run(`_kickSameTree(new Map([["a", "x"]]), new Map([["a", "x"], ["b", "x"]]))`), false);
  assert.equal(app.run(`_kickSameTree(new Map([["f", new Uint8Array([1, 2])]]), new Map([["f", new Uint8Array([1, 2])]]))`), true);
  assert.equal(app.run(`_kickSameTree(new Map([["f", new Uint8Array([1, 2])]]), new Map([["f", new Uint8Array([1, 3])]]))`), false);
  assert.equal(app.run(`_kickSameTree(null, new Map())`), false);
});

test("moving a project-panel entry up / down in its folder", () => {
  const r = app.run(`(() => {
    const files = [{ name: "a" }, { name: "b" }, { name: "c" }];
    const names = () => files.map(f => f.name).join("");
    const out = [];
    out.push(_projMoveEntry(files, files[1], -1), names());   // b up
    out.push(_projMoveEntry(files, files[0], -1), names());   // b at the top: no
    out.push(_projMoveEntry(files, files[0], 1), names());    // b down
    out.push(_projMoveEntry(files, files[2], 1), names());    // c at the bottom: no
    out.push(_projMoveEntry(files, { name: "x" }, 1), names());
    out.push(_projMoveEntry(files, files[0], files.length - 1), names());   // a to the bottom (the menu's step)
    out.push(_projMoveEntry(files, files[2], -2), names());                 // a back to the top
    return JSON.stringify(out);
  })()`);
  assert.deepEqual(JSON.parse(r), [true, "bac", false, "bac", true, "abc", false, "abc", false, "abc", true, "bca", true, "abc"]);
});
