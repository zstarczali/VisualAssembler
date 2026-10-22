const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8").replace(/\r\n/g, "\n");

function load() {
  const opStart = appJs.indexOf("const opcodeMap = {");
  const opEnd = appJs.indexOf("\n};\n", opStart) + 4;
  const revStart = appJs.indexOf("const _REV_OP = (");
  const revEnd = appJs.indexOf("function _disasmBytes(");
  const context = {};
  vm.createContext(context);
  vm.runInContext(appJs.slice(opStart, opEnd) + appJs.slice(revStart, revEnd) +
    "\nthis.lintJson = (seq) => JSON.stringify(_lintAsm(seq)); this.rev = _REV_OP;", context);
  context.lint = (seq) => JSON.parse(context.lintJson(seq));
  return context;
}

// Mini "assembler": [[bytes], labelled?] → lint sequence
function seq(ctx, items, org = 0x1000) {
  let addr = org;
  return items.map((it, i) => {
    if (it === "|") return { barrier: true };
    const [bytes, labelled] = Array.isArray(it[0]) ? it : [it, false];
    const info = ctx.rev[bytes[0]];
    const e = { mnem: info.mnem, mode: info.mode, bytes, address: addr, srcLine: i, labelled: !!labelled };
    addr += bytes.length;
    return e;
  });
}

const keys = (hints) => hints.map((h) => h.key + "@" + h.srcLine);

test("tail call, but not when RTS is a jump target", () => {
  const c = load();
  assert.deepEqual(keys(c.lint(seq(c, [[0x20, 0x00, 0x20], [0x60]]))), ["lintTailCall@0"]);
  assert.equal(c.lint(seq(c, [[0x20, 0x00, 0x20], [0x60]]))[0].values.op, "$2000");
  assert.deepEqual(keys(c.lint(seq(c, [[0x20, 0x00, 0x20], [[0x60], true]]))), []);
  assert.deepEqual(keys(c.lint(seq(c, [[0x20, 0x00, 0x20], "|", [0x60]]))), []);
});

test("redundant compares against zero", () => {
  const c = load();
  assert.deepEqual(keys(c.lint(seq(c, [[0xA5, 0x02], [0xC9, 0x00]]))), ["lintZeroCompare@1"]);  // LDA zp / CMP #0
  assert.deepEqual(keys(c.lint(seq(c, [[0xCA], [0xE0, 0x00]]))), ["lintZeroCompare@1"]);        // DEX / CPX #0
  assert.deepEqual(keys(c.lint(seq(c, [[0xCA], [0xC9, 0x00]]))), []);                         // DEX / CMP #0
  assert.deepEqual(keys(c.lint(seq(c, [[0xA5, 0x02], [0xC9, 0x01]]))), []);
});

test("reloads", () => {
  const c = load();
  assert.deepEqual(keys(c.lint(seq(c, [[0x85, 0xFB], [0xA5, 0xFB]]))), ["lintReload@1"]);      // STA $FB / LDA $FB
  assert.deepEqual(keys(c.lint(seq(c, [[0xA9, 0x05], [0xA9, 0x05]]))), ["lintDuplicateLoad@1"]);
  assert.deepEqual(keys(c.lint(seq(c, [[0x8D, 0x12, 0xD0], [0xAD, 0x12, 0xD0]]))), []);     // STA $D012 / LDA $D012: I/O
  assert.deepEqual(keys(c.lint(seq(c, [[0x85, 0xFB], [0xA5, 0xFC]]))), []);
  assert.deepEqual(keys(c.lint(seq(c, [[0x85, 0xFB], [0xA6, 0xFB]]))), []);                   // STA / LDX
});

test("INC / DEC idiom", () => {
  const c = load();
  const inc = c.lint(seq(c, [[0xAD, 0x20, 0xD0], [0x18], [0x69, 0x01], [0x8D, 0x20, 0xD0]]));
  assert.deepEqual(keys(inc), ["lintIncIdiom@0"]);
  assert.equal(inc[0].values.op, "INC $D020");
  const dec = c.lint(seq(c, [[0xA5, 0x10], [0x38], [0xE9, 0x01], [0x85, 0x10]]));
  assert.equal(dec[0].values.op, "DEC $10");
  assert.deepEqual(keys(c.lint(seq(c, [[0xA5, 0x10], [0x18], [0x69, 0x02], [0x85, 0x10]]))), []);
  assert.deepEqual(keys(c.lint(seq(c, [[0xA5, 0x10], [0x18], [0x69, 0x01], [0x85, 0x11]]))), []);
});

test("jump / branch to next, push-pull", () => {
  const c = load();
  assert.deepEqual(keys(c.lint(seq(c, [[0x4C, 0x03, 0x10], [0xEA]]))), ["lintJmpNext@0"]);
  assert.deepEqual(keys(c.lint(seq(c, [[0xD0, 0x00]]))), ["lintBranchNext@0"]);
  assert.deepEqual(keys(c.lint(seq(c, [[0x48], [0x68]]))), ["lintPushPull@0"]);
});
