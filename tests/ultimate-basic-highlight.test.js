const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");
const start = appJs.indexOf("const _UB_KEYWORDS");
const end = appJs.indexOf("function _ubRefreshEditor", start);
const context = {};
vm.createContext(context);
vm.runInContext(`${appJs.slice(start, end)}; this.highlight = _ubHighlightSource; this.formatUb = _ubFormatText;`, context);

test("UltimateBasic manual keywords and built-in functions are highlighted", () => {
  const html = context.highlight("times 4\n  delay 2\nend\nprint chr$(65), clamp(x, 0, 10)\n");
  assert.match(html, /class="ub-kw">times</);
  assert.match(html, /class="ub-kw">delay</);
  assert.match(html, /class="ub-fn">chr\$</);
  assert.match(html, /class="ub-fn">clamp</);
});

test("PRINT# is highlighted as code and does not start a comment", () => {
  const html = context.highlight('print# 1, "HELLO" # comment\n');
  assert.match(html, /class="ub-kw">print#</);
  assert.match(html, /class="ub-string">"HELLO"</);
  assert.match(html, /class="ub-comment"># comment</);
});

test("REM comments and inline 6502 assembly are highlighted", () => {
  const html = context.highlight("REM whole line\nasm {\n  lda #$01 ; immediate\n  sta $d020\n}\n");
  assert.match(html, /class="ub-comment">REM whole line</);
  assert.match(html, /class="ub-kw">lda</);
  assert.match(html, /class="ub-kw">sta</);
  assert.match(html, /class="ub-comment">; immediate</);
});

test("UltimateBasic formatter indents blocks, branches, and inline assembly", () => {
  const source = "sub demo()\nif x then # branch\nprint chr$(65)\nelse\nasm {\nlda #$01\nsta $d020 ; border\n}\nend\nend";
  assert.equal(context.formatUb(source), [
    "sub demo()",
    "  if x then # branch",
    "    print chr$(65)",
    "  else",
    "    asm {",
    "      lda #$01",
    "      sta $d020 ; border",
    "    }",
    "  end",
    "end"
  ].join("\n"));
});
