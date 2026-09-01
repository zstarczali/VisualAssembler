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
  const html = context.highlight("times 4\n  delay 2\nend\nmap draw 0, 0\nkoala show\nprint chr$(65), clamp(x, 0, 10), map_tile(1, 2)\n");
  assert.match(html, /class="ub-kw">times</);
  assert.match(html, /class="ub-kw">delay</);
  assert.match(html, /class="ub-fn">chr\$</);
  assert.match(html, /class="ub-fn">clamp</);
  assert.match(html, /class="ub-kw">map</);
  assert.match(html, /class="ub-kw">koala</);
  assert.match(html, /class="ub-fn">map_tile</);
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

test("UltimateBasic highlighting preserves empty-line caret offsets", () => {
  const source = "color bg 0\ncolor border 0\n\nprint value";
  const text = context.highlight(source).replace(/<[^>]+>/g, "");
  assert.equal(text, `${source}\n`);
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

test("UltimateBasic command reference contains current manual features", () => {
  const required = [
    "color text value", "irq handler [, raster_line]", "reu stash|fetch|swap c64_address, bank, reu_address, length",
    "drawmem source, destination, width, height, stride", "sprite_hit()", "reu_present()",
    "numstr value, destination_address", "dec(value, width)", "scroll row row_number left",
    "file.ubmap", "map_tile(x, y)", "picture.kla", "box_hit(left1"
  ];
  const refStart = appJs.indexOf("const _UB_COMMAND_REFERENCE");
  const refEnd = appJs.indexOf("\n];", refStart);
  const reference = appJs.slice(refStart, refEnd).toLowerCase();
  required.forEach(item => assert.ok(reference.includes(item.toLowerCase()), `missing command reference: ${item}`));
});
