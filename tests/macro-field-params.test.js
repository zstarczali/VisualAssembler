// A macro parameter in a library macro's own fields (.set_border c, .sprite_pos n, x, y …) is filled
// in by parsing the body line again (_macroLine) — only while the block is as it was parsed.
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");
const { buildApp, vmaTest: test } = require("./helpers/vma-cli");

const SOURCE = ".macro col(c)\n    .set_border c\n.endm\n* = $1000\n    :col(5)\n    rts\n";

async function build(app) {
  const r = await buildApp(app);
  assert.equal(r.ok, true, r.error);
  return Array.from(r.bytes).slice(-6);
}

test("the parameter reaches the field", async () => {
  const app = loadApp();
  app.__src = SOURCE;
  app.run("program = parseExpertText(__src)");
  assert.deepEqual(await build(app), [0xA9, 0x05, 0x8D, 0x20, 0xD0, 0x60]);
  // the blocks written back as text keep the parameter (the Rust build's input in block mode)
  assert.match(app.run("program.map(_blockToExpertSourceLine).join('\\n')"), /\.set_border c\b/);
});

test("an edited block no longer uses its parsed line", async () => {
  const app = loadApp();
  app.__src = SOURCE;
  app.run(`(() => {
    program = parseExpertText(__src);
    const b = program.find(x => x.isSetBorderMacro);
    b.colorValue = "02";
    b.rawOperand = "02";
    b.operand = "02";
  })()`);
  assert.equal(app.run("_macroLineFor(program.find(x => x.isSetBorderMacro))"), "");
  assert.deepEqual(await build(app), [0xA9, 0x02, 0x8D, 0x20, 0xD0, 0x60]);
});
