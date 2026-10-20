const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

// Source of a top-level "function name(" or "const name =" declaration (strings skipped).
function extract(name) {
  let start = appJs.indexOf(`\nfunction ${name}(`);
  const isConst = start === -1;
  if (isConst) start = appJs.indexOf(`\nconst ${name} =`);
  assert.notStrictEqual(start, -1, `Missing ${name}`);
  start += 1;
  if (!isConst) {
    // A function ends at the "}" that balances its first "{" (like the other tests).
    let depth = 0;
    for (let i = appJs.indexOf("{", start); i < appJs.length; i++) {
      if (appJs[i] === "{") depth++;
      else if (appJs[i] === "}" && --depth === 0) return appJs.slice(start, i + 1);
    }
  }
  let depth = 0;
  let quote = "";
  for (let i = start; i < appJs.length; i++) {
    const ch = appJs[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = "";
      continue;
    }
    if (ch === "\"" || ch === "'" || ch === "`") quote = ch;
    else if ("{[(".includes(ch)) depth++;
    else if ("}])".includes(ch)) depth--;
    else if (ch === ";" && depth === 0) return appJs.slice(start, i + 1);
  }
  throw new Error(`Could not parse ${name}`);
}

function load(names, context = {}) {
  vm.createContext(context);
  const src = names.map(extract).join("\n") + "\n" + names.map(n => `this.${n} = ${n};`).join("\n");
  vm.runInContext(src, context);
  return context;
}

const TABLES = ["opcodeMap", "_REV_OP", "_OP_CYCLES", "_OP_PAGE_PENALTY"];
const ANALYSIS = ["_acmeReportRows", "_acmeLineStatements", "_acmeRowInstructions", "_acmeCycleMap", "_acmeLintSeq",
  "_acmeOccupiedRanges", "_acmeTruncatedRowLength", "_acmeAddressMap", "_acmeParseLabels", "_cycleInfo"];

// Report of a real ACME 0.97 build of the source below, with VA's two stub lines first.
const REPORT = [
  "",
  "; ******** Source: C:\\Temp\\c64-visual-assembler-1-2.a",
  "     1                          * = $0801",
  "     2  0801 0b080a009e3230...      !byte $0b, $08, $0a, $00, $9e, $32, $30, $36, $31, $00, $00, $00",
  "     3                          * = $c000",
  "     4  c000 a906               start:  lda #$06",
  "     5  c002 8d20d0                     sta $d020",
  "     6  c005 bd11c0                     lda table,x",
  "     7  c008 ca                 loop    dex",
  "     8  c009 d0fd                       bne loop",
  "     9  c00b 200ec0                     jsr sub2",
  "    10                                  !source \"inc.a\"",
  "",
  "; ******** Source: inc.a",
  "     1  c00e a203               sub2    ldx #3",
  "     2  c010 60                         rts",
  "",
  "; ******** Source: C:\\Temp\\c64-visual-assembler-1-2.a",
  "    11  c011 010203             table   !byte 1,2,3",
  "    12  c014 0000000000000000...        !fill 12, 0",
  "    13  c020 a9018d20d0                 lda #1 : sta $d020",
  "    14  c025 ea                         +mac",
  "    15  c026 a900               -       lda #0",
  "    16  c028 c900                       cmp #0"
].join("\r\n");

test("ACME report rows map the built source back to editor lines", () => {
  const ctx = load([...TABLES, ...ANALYSIS]);
  const rows = ctx._acmeReportRows(REPORT, 2);
  const start = rows.find(r => r.address === 0xC000);
  assert.equal(start.srcLine, 1);
  assert.deepEqual(Array.from(start.bytes), [0xA9, 0x06]);
  const sub = rows.find(r => r.address === 0xC00E);
  assert.equal(sub.own, false);
  assert.equal(sub.srcLine, null);
  const fill = rows.find(r => r.address === 0xC014);
  assert.equal(fill.truncated, true);
  // Without a known offset (block source) no row maps to an editor line.
  assert.ok(ctx._acmeReportRows(REPORT, null).every(r => r.srcLine === null));
});

test("ACME cycle gutter counts instruction lines only", () => {
  const ctx = load([...TABLES, ...ANALYSIS]);
  const map = ctx._acmeCycleMap(ctx._acmeReportRows(REPORT, 2));
  assert.equal(map.get(1).text, "2");          // start: lda #$06
  assert.equal(map.get(2).text, "4");          // sta $d020
  assert.equal(map.get(3).text, "4+");         // lda table,x
  assert.equal(map.get(5).text, "2/3");        // bne loop
  assert.equal(map.get(10).text, "2,4");       // lda #1 : sta $d020
  assert.ok(!map.has(8));                      // !byte
  assert.ok(!map.has(9));                      // !fill
  assert.ok(!map.has(11));                     // +mac (macro call)
  assert.equal(map.get(12).text, "2");         // anonymous label "-"
});

test("ACME peephole input keeps runs, labels and barriers", () => {
  const ctx = load([...TABLES, ...ANALYSIS]);
  const seq = ctx._acmeLintSeq(ctx._acmeReportRows(REPORT, 2));
  const code = seq.filter(s => !s.barrier);
  assert.equal(code[0].mnem, "LDA");
  assert.equal(code[0].labelled, true);        // start:
  assert.equal(code[1].labelled, false);
  assert.equal(code.find(s => s.address === 0xC008).labelled, true);   // loop
  assert.equal(code.find(s => s.address === 0xC026).labelled, true);   // "-"
  // The include, !byte, !fill and the macro call break the run.
  const jsr = seq.findIndex(s => s.address === 0xC00B);
  assert.equal(seq[jsr + 1].barrier, true);
  // lda #0 / cmp #0 reach the CMP #0 hint.
  const lint = load([...TABLES, ...ANALYSIS, "_LINT_MEM_MODES", "_LINT_SETS_A", "_LINT_SETS_X", "_LINT_SETS_Y", "_lintSameOperand", "_lintAsm"]);
  const hints = lint._lintAsm(lint._acmeLintSeq(lint._acmeReportRows(REPORT, 2)));
  assert.ok(hints.some(h => h.srcLine === 13));
});

test("ACME hot reload writes the built ranges, not the gaps between segments", () => {
  const ctx = load([...TABLES, ...ANALYSIS]);
  const rows = ctx._acmeReportRows(REPORT, 2);
  const memory = { origin: 0x0801, payload: new Array(0xC02A - 0x0801).fill(0) };
  const ranges = ctx._acmeOccupiedRanges(rows, memory);
  assert.deepEqual(JSON.parse(JSON.stringify(ranges.map(r => [r.start, r.end]))), [[0x0801, 0x080C], [0xC000, 0xC029]]);
});

test("ACME profiler map: nearest global label and include file lines", () => {
  const ctx = load([...TABLES, ...ANALYSIS]);
  const rows = ctx._acmeReportRows(REPORT, 2);
  const map = ctx._acmeAddressMap(rows, "\tsub2\t= $c00e\t; ?\n\tloop\t= $c008\n\ttable\t= $c011\n\tstart\t= $c000\t; unused\n");
  assert.equal(map.get(0xC002).routine, "start");
  assert.equal(map.get(0xC002).srcLine, 2);
  assert.equal(map.get(0xC009).routine, "loop");
  assert.equal(map.get(0xC00F).routine, "sub2");
  assert.equal(map.get(0xC00F).fileLine, "inc.a:1");
});

test("editor exports turn into ACME source", () => {
  const ctx = load(["_acmeFromVaAsm", "_splitAsmLineComment"]);
  const out = ctx._acmeFromVaAsm([
    "; Table   ; with comment",
    "    .byte $00, $28      ; lo",
    "table: .word start",
    "    .fill 4, $FF",
    "    .align 256",
    "    .align 100",
    ".const LEVEL_W = 2",
    "    lda #<table"
  ].join("\n"));
  assert.equal(out, [
    "; Table   ; with comment",
    "    !byte $00, $28      ; lo",
    "table: .word start",
    "    !fill 4, $FF",
    "    !align 255, 0",
    "    .align 100",
    "LEVEL_W = 2",
    "    lda #<table"
  ].join("\n"));
});
