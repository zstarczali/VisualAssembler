const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function extractFunctionSource(name) {
  const start = appJs.indexOf(`function ${name}(`);
  assert.notStrictEqual(start, -1, `Missing function ${name}`);
  let depth = 0, seen = false;
  for (let i = start; i < appJs.length; i++) {
    if (appJs[i] === "{") { depth++; seen = true; }
    else if (appJs[i] === "}" && seen && --depth === 0) return appJs.slice(start, i + 1);
  }
  throw new Error(`Could not parse ${name}`);
}

function run(code) {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`
    ${extractFunctionSource("_normFilePath")}
    ${extractFunctionSource("_resolveIncludePath")}
    ${extractFunctionSource("_collectIncludedPaths")}
    ${code}
  `, ctx);
  return JSON.parse(JSON.stringify(ctx.out));
}

test("includes resolve against the including file's folder", () => {
  const out = run(`this.out = [
    _resolveIncludePath("D:/Proj/main.asm", "lib/common.asm"),
    _resolveIncludePath("D:\\\\Proj\\\\src\\\\main.asm", "..\\\\lib\\\\Common.asm"),
    _resolveIncludePath("D:/Proj/src/main.asm", "./x/../util.asm"),
    _resolveIncludePath("/home/u/p/main.ub", "../shared/io.ub"),
    _resolveIncludePath("D:/Proj/main.asm", "E:/other/abs.asm"),
    _resolveIncludePath("", "lib/common.asm"),
    _resolveIncludePath("", "D:\\\\Proj\\\\tools\\\\common.asm")
  ];`);
  assert.deepEqual(out, [
    "d:/proj/lib/common.asm",
    "d:/proj/lib/common.asm",
    "d:/proj/src/util.asm",
    "/home/u/shared/io.ub",
    "e:/other/abs.asm",
    "",
    "d:/proj/tools/common.asm"
  ]);
});

test("a same-named file in another folder is not treated as included", () => {
  const out = run(`
    const included = _collectIncludedPaths("D:/Proj/main.asm", '.include "lib/common.asm"\\n', [
      { isIncludeMacro: true, includeFile: "macros/defs.asm" }
    ]);
    this.out = {
      lib: included.has(_resolveIncludePath("", "D:/Proj/lib/common.asm")),
      tools: included.has(_resolveIncludePath("", "D:/Proj/tools/common.asm")),
      block: included.has(_resolveIncludePath("", "D:/Proj/macros/defs.asm"))
    };
  `);
  assert.deepEqual(out, { lib: true, tools: false, block: true });
});
