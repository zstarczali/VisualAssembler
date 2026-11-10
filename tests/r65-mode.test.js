// R65 mode: the R65 build result in the ACME preview form (report, label dump, errors).
const test = require("node:test");
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");

const app = loadApp();

// lda #1 / sta $d020 / rts at $0810, in main.asm (file 0) and lib.asm (file 1)
const prg = [0x10, 0x08, 0xA9, 0x01, 0x8D, 0x20, 0xD0, 0x60];
const result = {
  files: ["F:/proj/main.asm", "F:/proj/lib.asm"],
  spans: [
    [0x0812, 3, 0, 5, 5, "sta $d020"],
    [0x0810, 2, 0, 4, 5, "lda #1"],
    [0x0815, 1, 1, 2, 1, "rts"]
  ],
  labels: [["start", 0x0810, 0, 3, "Default"], ["@exit", 0x0815, 1, 2, "Default"]]
};

test("assembler syntax normalizes to kick / acme / r65", () => {
  assert.equal(app.run('_assemblerNormalize("r65")'), "r65");
  assert.equal(app.run('_assemblerNormalize("acme")'), "acme");
  assert.equal(app.run('_assemblerNormalize("other")'), "kick");
  assert.equal(app.run('_assemblerNormalize(undefined)'), "kick");
});

test("R65 mode is a text-only assembler with its own texts", () => {
  app.run('assemblerSyntax = "r65"');
  assert.equal(app.run("_r65Mode()"), true);
  assert.equal(app.run("_textOnlyAssembler()"), true);
  assert.equal(app.run('_textKey("acmeBuildSuccess")'), "r65BuildSuccess");
  app.run('assemblerSyntax = "acme"');
  assert.equal(app.run("_r65Mode()"), false);
  assert.equal(app.run("_textOnlyAssembler()"), true);
  assert.equal(app.run('_textKey("acmeBuildSuccess")'), "acmeBuildSuccess");
  app.run('assemblerSyntax = "kick"');
  assert.equal(app.run("_textOnlyAssembler()"), false);
});

test("the R65 report reads back as ACME report rows", () => {
  app.r65Result = result;
  app.r65Prg = Uint8Array.from(prg);
  const report = app.run('_r65Report(r65Result, r65Prg, "F:\\\\proj\\\\main.asm")');
  const rows = app.run(`_acmeReportRows(${JSON.stringify(report)}, 0)`);
  assert.equal(rows.length, 3);
  // the editor's file: sorted by line, its rows carry the editor line
  assert.deepEqual([rows[0].line, rows[0].address, rows[0].srcLine, rows[0].source], [4, 0x0810, 3, "lda #1"]);
  assert.deepEqual([...rows[0].bytes], [0xA9, 0x01]);
  assert.deepEqual([...rows[1].bytes], [0x8D, 0x20, 0xD0]);
  assert.equal(rows[0].own, true);
  // another file: no editor line
  assert.equal(rows[2].own, false);
  assert.equal(rows[2].srcLine, null);
  assert.deepEqual([...rows[2].bytes], [0x60]);
});

test("the R65 labels give an ACME label dump", () => {
  app.r65Result = result;
  assert.equal(app.run("_r65LabelDump(r65Result)"), "start = $0810\nexit = $0815");
});

test("an R65 error in the editor's file names the editor line", () => {
  app.run("expertMode = true");
  const entry = app.run(`_r65ErrorEntry({ file: "F:/proj/main.asm", line: 2, message: "Unknown symbol" },
    { text: "start:\\n  lda foo\\n", path: "F:\\\\proj\\\\main.asm" })`);
  assert.equal(entry.sourceLine, 1);
  assert.equal(entry.text, "[R002] lda foo — Unknown symbol");
  const plain = app.run('_r65ErrorEntry({ file: "", line: 0, message: "No output" }, { text: "", path: "" })');
  assert.equal(plain.text, "No output");
});

test("Kick highlighting: a label right before its colon, the directive after it, calls of own functions", () => {
  app.run('assemblerSyntax = "r65"');
  const hl = (line) => app.run(`_expertHighlightLine(${JSON.stringify(line)})`);
  assert.equal(hl("rowLo:  .fill 256, <rowAddr(i)"),
    '<span class="hl-label">rowLo</span>:  <span class="hl-directive">.fill</span> <span class="hl-number">256</span>, &lt;<span class="hl-macro">rowAddr</span>(i)');
  assert.match(hl("loop:   lda (zp),y"), /<span class="hl-mnem">lda<\/span> \(zp\),y/);
  app.run('assemblerSyntax = "kick"');
});
