// Version control snapshots of a source file keep its text (kind "source"), not the VA JSON payload;
// the Build info of ACME source shows the ACME build and every Build info names its file.
const test = require("node:test");
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");

const SRC = "* = $1000\n    lda #$01\n    rts\n";

function appWith(filePath, expert) {
  const app = loadApp();
  app.__src = SRC;
  app.__path = filePath;
  app.run(`(() => {
    tabs = [{ id: "t1", name: "x", filePath: __path, dirty: true }];
    activeTabId = "t1";
    program = parseExpertText(__src);
    _expertSourceText = __src;
    _expertGetSourceText = () => __src;
    expertMode = ${expert};
  })()`);
  return app;
}

test("an .asm tab's snapshot is its source text", () => {
  const app = appWith("C:/game/main.asm", true);
  const payload = JSON.parse(JSON.stringify(app.run("_getCurrentProjectSnapshotPayload()")));
  assert.deepEqual(payload, { version: 1, app: "c64-visual-assembler", kind: "source", sourceText: SRC });
});

test("in block mode the snapshot is the blocks written as source", () => {
  const app = appWith("C:/game/hero.inc", false);
  const payload = app.run("_getCurrentProjectSnapshotPayload()");
  assert.equal(payload.kind, "source");
  assert.doesNotMatch(payload.sourceText, /"program"|expertText/);
  assert.match(payload.sourceText, /LDA #\$01/i);
});

test("a .json tab keeps the project payload", () => {
  const app = appWith("C:/game/demo.json", false);
  assert.ok(Array.isArray(app.run("_getCurrentProjectSnapshotPayload().program")));
});

test("a source snapshot diffs against an older JSON one as text", () => {
  const app = appWith("C:/game/main.asm", true);
  app.__old = { version: 1, app: "c64-visual-assembler", expertText: "* = $1000\n    lda #$02\n    rts\n", program: [] };
  app.__new = { version: 1, app: "c64-visual-assembler", kind: "source", sourceText: SRC };
  const [a, b] = app.run("_vcComparable(__old, __new)");
  assert.equal(a, app.__old.expertText);
  assert.equal(b, SRC);
});

test("ACME Build info shows the ACME build and the file", async () => {
  const app = appWith("C:/game/demo.asm", true);
  const content = app.document.getElementById("build-info-content");
  app.run(`(() => {
    assemblerSyntax = "acme";
    _expertGetStartupSource = () => null;
    _kickPrepare = async () => null;
    _buildAcmePrg = async () => ({ ok: true, bytes: Uint8Array.from([0x00, 0x10, 0xA9, 0x01, 0x60]),
      labels: "start = $1000\\n", report: "", sysAddress: 0x1000, stubGenerated: false, sourceLineOffset: null });
  })()`);
  await app.run("showBuildInfoDialog()");
  const html = content.innerHTML;
  assert.match(html, /C:\/game\/demo\.asm/);
  assert.match(html, /\$1000/);
  assert.match(html, /3 bytes/);
  assert.doesNotMatch(html, /not wired to the compiler/);
});
