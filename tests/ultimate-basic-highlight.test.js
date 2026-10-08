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
    "level.bin", "map view px, py", "map_tile(x, y)", "picture.kla", "box_hit(left1"
  ];
  const refStart = appJs.indexOf("const _UB_COMMAND_REFERENCE");
  const refEnd = appJs.indexOf("\n];", refStart);
  const reference = appJs.slice(refStart, refEnd).toLowerCase();
  required.forEach(item => assert.ok(reference.includes(item.toLowerCase()), `missing command reference: ${item}`));
});

test("QBasic-style DIM / FUNCTION / SUB syntax is highlighted (UB 1.6.3)", () => {
  const html = context.highlight('DIM kor AS INTEGER\nDIM x, y AS BYTE\nFUNCTION Negyzet (szam AS INTEGER) AS DOUBLE\nEXIT FUNCTION\nEND FUNCTION\nSUB Koszont (nev AS STRING)\nEND SUB\ndim t(2, 3) as single\n');
  assert.match(html, /class="ub-kw">DIM</);
  assert.match(html, /class="ub-kw">AS<\/span> <span class="ub-type">INTEGER</);
  assert.match(html, /class="ub-type">BYTE</);
  assert.match(html, /class="ub-kw">FUNCTION</);
  assert.match(html, /class="ub-type">DOUBLE</);
  assert.match(html, /class="ub-kw">AS<\/span> <span class="ub-type">STRING</);
  assert.match(html, /class="ub-kw">EXIT<\/span> <span class="ub-kw">FUNCTION</);
  assert.match(html, /class="ub-kw">END<\/span> <span class="ub-kw">SUB</);
  assert.match(html, /class="ub-kw">as<\/span> <span class="ub-type">single</);
});

test("AS and the BASIC type names stay plain identifiers outside a type position", () => {
  const html = context.highlight("var byte = 1\nvar single = 2\nas = byte + single\ninteger = as\nprint double, as\n");
  assert.doesNotMatch(html, /class="ub-(?:type|kw)">(?:byte|single|integer|double|as)</);
});

test("UltimateBasic formatter indents QBasic-style FUNCTION / SUB blocks", () => {
  const source = "function nagyobb(a as byte, b as byte) as byte\nnagyobb = a\nif b > a then\nnagyobb = b\nexit function\nend if\nend function\nsub koszont(nev as string)\nprint \"HELLO, \"; nev\nend sub";
  assert.equal(context.formatUb(source), [
    "function nagyobb(a as byte, b as byte) as byte",
    "  nagyobb = a",
    "  if b > a then",
    "    nagyobb = b",
    "    exit function",
    "  end if",
    "end function",
    "sub koszont(nev as string)",
    "  print \"HELLO, \"; nev",
    "end sub"
  ].join("\n"));
});

test("UltimateBasic command reference covers the 1.6.3 QBasic-style syntax", () => {
  const refStart = appJs.indexOf("const _UB_COMMAND_REFERENCE");
  const reference = appJs.slice(refStart, appJs.indexOf("\n];", refStart)).toLowerCase();
  ["dim name as type", "dim grid(2, 3) as integer", "function name(p as type", "end function", "exit sub\\nexit function", "print a; b; c", "end sub", "as byte | integer | single | double"]
    .forEach(item => assert.ok(reference.includes(item), `missing command reference: ${item}`));
  const en = appJs.slice(appJs.indexOf("const ubCommandDescriptionsEn"), appJs.indexOf("const ubCommandDescriptionsHu"));
  ["dim", "function", "exit sub"].forEach(key => assert.ok(en.includes(`\n  "${key}": "`), `missing description: ${key}`));
});

test("QBasic control flow, string functions and ' comments are highlighted (UB 1.6.3)", () => {
  const html = context.highlight("DO WHILE i < 10 ' count\nLOOP UNTIL i = 0\nWHILE k <> 5 : WEND\nELSEIF n = 0 THEN\nSELECT CASE n\nCASE IS > 1000\nPRINT LEFT$(s, 4); RIGHT$(s, 2); MID$(s, 7)\nprint \"it's\" ' note\n");
  assert.match(html, /class="ub-kw">DO<\/span> <span class="ub-kw">WHILE</);
  assert.match(html, /class="ub-comment">' count</);
  assert.match(html, /class="ub-kw">LOOP<\/span> <span class="ub-kw">UNTIL</);
  assert.match(html, /class="ub-kw">WEND</);
  assert.match(html, /class="ub-kw">ELSEIF</);
  assert.match(html, /class="ub-kw">CASE<\/span> <span class="ub-kw">IS</);
  assert.match(html, /class="ub-fn">LEFT\$</);
  assert.match(html, /class="ub-fn">RIGHT\$</);
  assert.match(html, /class="ub-fn">MID\$</);
  assert.match(html, /class="ub-string">"it's"<\/span> <span class="ub-comment">' note</);
});

test("Context keywords are only coloured after the keyword that gives them meaning", () => {
  const html = context.highlight("map view px, py\nwait key\nscroll x 7 narrow\nscroll row 12 left : x = 1\nview = key + is\nrow = left + wide\n");
  assert.match(html, /class="ub-kw">map<\/span> <span class="ub-kw">view</);
  assert.match(html, /class="ub-kw">wait<\/span> <span class="ub-kw">key</);
  assert.match(html, /class="ub-kw">scroll<\/span> <span class="ub-kw">x<\/span> <span class="ub-number">7<\/span> <span class="ub-kw">narrow</);
  assert.match(html, /class="ub-kw">row<\/span> <span class="ub-number">12<\/span> <span class="ub-kw">left<\/span> : x = /);
  assert.doesNotMatch(html, /\n(?:<span[^>]*>)?(?:view|row)</);
  assert.match(html, /\nview = key \+ is\nrow = left \+ wide\n/);
});

test("UltimateBasic formatter handles DO / LOOP, WHILE / WEND, ELSEIF and one-line loops", () => {
  const source = "do while i < 10 ' outer\nloop 3\nprint i\nend\ni = i + 1\nloop\ndo\ni = i - 1\nloop until i = 0\nwhile k <> 5\nk = k + 1\nwend\ndo while a < 3 : a = a + 1 : loop\nwhile b < 3 : b = b + 1 : wend\nfor c = 1 to 3 : print c : next\nif n < 0 then\nprint \"NEG\"\nelseif n = 0 then\nprint \"ZERO\"\nelse\nprint \"POS\"\nend if\nselect case n\ncase 1, 2, 3\nprint \"SMALL\"\ncase else\nprint \"OTHER\"\nend select\nprint \"DONE\"";
  assert.equal(context.formatUb(source), [
    "do while i < 10 ' outer",
    "  loop 3",
    "    print i",
    "  end",
    "  i = i + 1",
    "loop",
    "do",
    "  i = i - 1",
    "loop until i = 0",
    "while k <> 5",
    "  k = k + 1",
    "wend",
    "do while a < 3 : a = a + 1 : loop",
    "while b < 3 : b = b + 1 : wend",
    "for c = 1 to 3 : print c : next",
    "if n < 0 then",
    "  print \"NEG\"",
    "elseif n = 0 then",
    "  print \"ZERO\"",
    "else",
    "  print \"POS\"",
    "end if",
    "select case n",
    "case 1, 2, 3",
    "  print \"SMALL\"",
    "case else",
    "  print \"OTHER\"",
    "end select",
    "print \"DONE\""
  ].join("\n"));
});

test("Every UltimateBasic lexer-level 1.6.3 word has a command reference entry and description", () => {
  const refStart = appJs.indexOf("const _UB_COMMAND_REFERENCE");
  const reference = appJs.slice(refStart, appJs.indexOf("\n];", refStart)).toLowerCase();
  const en = appJs.slice(appJs.indexOf("const ubCommandDescriptionsEn"), appJs.indexOf("const ubCommandDescriptionsHu"));
  ["elseif", "wend", "do", "select case", "end", "left$", "right$", "mid$"].forEach(key => {
    assert.ok(reference.includes(`\n  ["${key}", "`), `missing command reference entry: ${key}`);
    assert.ok(en.includes(`\n  "${key}": "`), `missing description: ${key}`);
  });
  ["loop until i = 0", "case is > 1000", "exit do", "' comment", "mid$(string, start [, length])"]
    .forEach(item => assert.ok(reference.includes(item), `missing command reference: ${item}`));
});
