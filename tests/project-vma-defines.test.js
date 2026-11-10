// Project settings → VMA: the symbols (.define) and constants (.const) of a .proj come before the
// source the project builds (_projVmaPrelude), in the JS layout and in the Rust build input.
const test = require("node:test");
const { buildApp, vmaTest } = require("./helpers/vma-cli");
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");

// The IF / ELSE demo without its own .define line
const SOURCE = `* = $0801
.if RELEASE
    LDA #$00
    STA $D020
    STA $D021
    RTS
.else
    LDA #$06
    STA $D020
    STA $D021
    RTS
.endif
.if LEVEL == 2
    NOP
.endif
`;

function appWith(settings) {
  const app = loadApp();
  app.__src = SOURCE;
  app.__settings = settings;
  app.run(`(() => {
    _expertProjectData = { name: "demo", files: [{ type: "file", name: "main.asm", path: "main.asm" }], startupFile: "main.asm", ...__settings };
    program = parseExpertText(__src);
    parseUserMacros();
  })()`);
  return app;
}

// LDA #imm of the first branch and whether the NOP of LEVEL == 2 is in
async function build(app) {
  const r = await buildApp(app);
  assert.equal(r.ok, true, r.error);
  const bytes = Array.from(r.bytes);
  const lda = bytes.indexOf(0xA9);
  return { imm: bytes[lda + 1], nop: bytes.includes(0xEA) };
}

vmaTest("the project's .define and .const reach .if", async () => {
  assert.deepEqual(await build(appWith({ vmaConsts: { LEVEL: "1" } })), { imm: 0x06, nop: false });
  assert.deepEqual(await build(appWith({ vmaDefines: ["RELEASE"], vmaConsts: { LEVEL: "1" } })), { imm: 0x00, nop: false });
  // without the constant `.if LEVEL == 2` cannot be evaluated: an error, as in the source
  assert.equal((await buildApp(appWith({}))).ok, false);
  assert.deepEqual(await build(appWith({ vmaDefines: ["RELEASE"], vmaConsts: { LEVEL: "2" } })), { imm: 0x00, nop: true });
});

test("a Kick project or no project gets no VMA prelude", () => {
  assert.equal(appWith({ vmaDefines: ["RELEASE"], kick: true }).run("_projVmaPrelude()"), "");
  const app = appWith({ vmaDefines: ["RELEASE"] });
  app.run("_expertProjectData = null");
  assert.equal(app.run("_projVmaPrelude()"), "");
});

test("the Rust input gets the prelude, its lines mapped to no source line", () => {
  const app = appWith({ vmaDefines: ["RELEASE"], vmaConsts: { LEVEL: "2" } });
  app.__input = { text: "nop\nrts", editorLines: true };
  const input = JSON.parse(JSON.stringify(app.run("_vmaWithPrelude(__input)")));
  assert.equal(input.text, ".define RELEASE\n.const LEVEL = 2\nnop\nrts");
  assert.equal(input.prelude, 2);
  assert.deepEqual(input.lineMap, [-1, -1, 0, 1]);
  // an error on the source's 2nd line (text line 4) is the editor's line 1
  app.__e = { line: 4, message: "x", key: "", params: {}, address: null };
  const entry = app.run("_vmaErrorEntry(__e, _vmaWithPrelude(__input), _vmaWithPrelude(__input).text.split('\\n'))");
  assert.equal(entry.sourceLine, 1);
  assert.match(entry.text, /^\[R004\] rts — x$/);
});

test(".proj keeps the VMA settings", () => {
  const app = appWith({});
  const fields = JSON.parse(JSON.stringify(app.run(`_projKickFields({ vmaDefines: ["A", "1bad"], vmaConsts: { N: 3, "x-y": 1 } })`)));
  assert.deepEqual(fields, { vmaDefines: ["A"], vmaConsts: { N: "3" } });
});
