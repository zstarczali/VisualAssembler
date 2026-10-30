// Verziókezelés diff nézete: értelmezés, sorszámok, soron belüli kiemelés, egyesített / kétoldali táblázat.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");
const start = appJs.indexOf("let _vcDiffSplit = ");
const end = appJs.indexOf("let _vcRawDiff", start);
const section = appJs.slice(start, end).replace(/^let (_vcDiffSplit|_vcDiffLast)\b/gm, "var $1");

const plain = (v) => JSON.parse(JSON.stringify(v));

function load() {
  const context = {
    localStorage: { getItem: () => null },
    t: (key) => key,
    _vcEsc: (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"),
    _expertHighlightLine: (line) => line.replace(/^(\s*)(lda|sta|rts)\b/i, '$1<span class="hl-mnem">$2</span>'),
    document: { getElementById: () => null },
  };
  vm.createContext(context);
  vm.runInContext(section, context);
  return context;
}

const smart = ["@@ -3 +3 @@", " lda #$00", "-sta $d020", "+sta $d021", " rts"].join("\n");
const gitDiff = [
  "diff --git a/main.asm b/main.asm",
  "index 1111111..2222222 100644",
  "--- a/main.asm",
  "+++ b/main.asm",
  "@@ -10,3 +10,4 @@ start:",
  " lda #$01",
  "-sta $d020",
  "+sta $d021",
  "+sta $d020",
  " rts",
  "\\ No newline at end of file",
  "diff --git a/gfx.bin b/gfx.bin",
  "new file mode 100644",
  "Binary files /dev/null and b/gfx.bin differ",
].join("\n");

test("smart diff without headers is one file with line numbers from the hunk", () => {
  const { files, preamble } = load()._vcParseDiff(smart);
  assert.equal(preamble.length, 0);
  assert.equal(files.length, 1);
  assert.equal(files[0].hunks[0].oldStart, 3);
  assert.deepEqual(plain(files[0].hunks[0].lines.map(l => l.type)), ["ctx", "del", "add", "ctx"]);
});

test("git diff: files, statuses, binary note and no-newline marker", () => {
  const { files } = load()._vcParseDiff(gitDiff);
  assert.deepEqual(plain(files.map(f => [f.path, f.status, f.binary])), [["main.asm", "M", false], ["gfx.bin", "A", true]]);
  assert.equal(files[0].hunks[0].header, "start:");
  assert.equal(files[0].hunks[0].lines.at(-1).type, "note");
});

test("commit header goes to the preamble", () => {
  const { preamble, files } = load()._vcParseDiff("commit abc\nAuthor: X <x@y>\n\n    message\n\n" + gitDiff);
  assert.equal(preamble[0], "commit abc");
  assert.equal(files.length, 2);
});

test("rows number old and new lines and pair changed lines", () => {
  const ctx = load();
  const rows = ctx._vcDiffRows(ctx._vcParseDiff(gitDiff).files[0].hunks[0], (s) => s);
  assert.deepEqual(rows[0].ctx && [rows[0].ctx.oldNo, rows[0].ctx.newNo], [10, 10]);
  assert.deepEqual(plain(rows[1].dels.map(d => d.no)), [11]);
  assert.deepEqual(plain(rows[1].adds.map(a => a.no)), [11, 12]);
  assert.deepEqual([rows[2].ctx.oldNo, rows[2].ctx.newNo], [12, 13]);
  assert.equal(rows[1].dels[0].html, 'sta $d02<mark class="vcd-word">0</mark>');
  assert.equal(rows[1].adds[0].html, 'sta $d02<mark class="vcd-word">1</mark>');
});

test("word ranges only when most of the line is shared", () => {
  const ctx = load();
  assert.deepEqual(JSON.parse(JSON.stringify(ctx._vcWordRanges("sta $d020", "sta $d021"))), [[8, 9], [8, 9]]);
  assert.equal(ctx._vcWordRanges("lda #$00", "jmp loop"), null);
});

test("marks stay well nested across highlight tags and entities", () => {
  const ctx = load();
  const html = '<span class="hl-mnem">lda</span> #&lt;table';
  const out = ctx._vcMarkRange(html, 1, 6);
  assert.equal(out, '<span class="hl-mnem">l<mark class="vcd-word">da</mark></span><mark class="vcd-word"> #&lt;</mark>table');
});

test("unified and split tables", () => {
  const ctx = load();
  const unified = ctx._vcDiffHtml(gitDiff, false, "");
  assert.match(unified, /vcd-badge--M/);
  assert.match(unified, /vcd-badge--A/);
  assert.match(unified, /<span class="hl-mnem">lda<\/span>/);
  assert.equal((unified.match(/<tr class="vcd-del">/g) || []).length, 1);
  assert.equal((unified.match(/<tr class="vcd-add">/g) || []).length, 2);
  const split = ctx._vcDiffHtml(gitDiff, true, "");
  assert.match(split, /vcd-table--split/);
  assert.equal((split.match(/vcd-code vcd-empty/g) || []).length, 1);
});

test("empty diff shows the no-changes message", () => {
  assert.match(load()._vcDiffHtml("", false), /vcDiffNone/);
});
