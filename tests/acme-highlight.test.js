const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

// The highlighter contains "{" literals, so cut up to the next function.
function extractFunctionSource(name, nextName) {
  const start = appJs.indexOf(`function ${name}(`);
  const end = appJs.indexOf(`function ${nextName}(`, start);
  assert.ok(start >= 0 && end > start, `Missing function ${name}`);
  return appJs.slice(start, end);
}

const context = vm.createContext({ _EXPERT_MNEM_SET: new Set(["LDA", "STA", "BNE", "DEX"]) });
vm.runInContext(`${extractFunctionSource("_expertHighlightAcmeLine", "_expertHighlightLine")}; this.hl = _expertHighlightAcmeLine;`, context);
const spans = (line, cls) => [...context.hl(line).matchAll(new RegExp(`<span class="${cls}">([^<]*)</span>`, "g"))].map(m => m[1]);

test("ACME highlight marks !directives, +macro calls and colonless labels", () => {
  assert.deepEqual(spans("!region Setup", "hl-directive"), ["!region"]);
  assert.deepEqual(spans("start   lda #%00001111", "hl-label"), ["start"]);
  assert.deepEqual(spans("start   lda #%00001111", "hl-number"), ["#%00001111"]);
  assert.deepEqual(spans("        +set_border 6", "hl-macro"), ["+set_border"]);
  assert.deepEqual(spans(".loop   bne .loop", "hl-label"), [".loop", ".loop"]);
  assert.deepEqual(spans("-       dex", "hl-label"), ["-"]);
});

test("ACME highlight handles macro headers, strings and ; comments only", () => {
  assert.deepEqual(spans("!macro set_border .col {", "hl-macro"), ["set_border"]);
  assert.deepEqual(spans("!macro set_border .col {", "hl-macro-param"), [".col"]);
  assert.deepEqual(spans("table !byte \"a;b\", 'c' ; data", "hl-string"), ["\"a;b\"", "'c'"]);
  assert.deepEqual(spans("table !byte \"a;b\", 'c' ; data", "hl-comment"), ["; data"]);
});

test("VA and ACME directives stay apart: each mode only knows its own prefix", () => {
  const start = appJs.indexOf("function _expertDirRe(");
  const source = appJs.slice(start, appJs.indexOf("const _AC_DIRECTIVE_DESC", start));
  for (const [syntax, own, other] of [["kick", ".region Main", "!region Main"], ["acme", "!region Main", ".region Main"]]) {
    const ctx = vm.createContext({ assemblerSyntax: syntax });
    vm.runInContext(`${source}; this.re = _expertDirRe;`, ctx);
    const region = ctx.re(String.raw`^\s*{D}region\s+(.+)$`);
    assert.equal(region.test(own), true, `${syntax} ${own}`);
    assert.equal(region.test(other), false, `${syntax} ${other}`);
  }
  const acmeList = appJs.slice(appJs.indexOf("const _AC_ACME_DIRECTIVES"), appJs.indexOf("function _expertDirRe("));
  for (const directive of ["!byte", "!word", "!source", "!binary", "!macro", "!pseudopc", "!zone"]) {
    assert.ok(acmeList.includes(`"${directive}"`), directive);
  }
});
