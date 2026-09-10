const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function extractObjectLiteral(marker) {
  const start = appJs.indexOf(marker);
  assert.notStrictEqual(start, -1, `missing ${marker}`);
  const brace = appJs.indexOf("{", start);
  let depth = 0, end = -1;
  for (let i = brace; i < appJs.length; i++) {
    const ch = appJs[i];
    if (ch === "{") depth++;
    else if (ch === "}") { depth--; if (depth === 0) { end = i + 1; break; } }
  }
  // eslint-disable-next-line no-eval
  return eval("(" + appJs.slice(brace, end) + ")");
}

const mnemonicLibrary = extractObjectLiteral("const mnemonicLibrary = ");

test("every new v2.3.9 mnemonic is registered in mnemonicLibrary (so palette search finds it)", () => {
  const all = Object.values(mnemonicLibrary).flat();
  const byName = new Map(all.map((i) => [i.mnemonic, i]));

  // .assert
  const assert239 = byName.get("ASSERT");
  assert.ok(assert239, "ASSERT must be in mnemonicLibrary");
  assert.equal(assert239.isAssertMacro, true);

  // long branches
  const conds = { LBNE: "NE", LBEQ: "EQ", LBCC: "CC", LBCS: "CS", LBMI: "MI", LBPL: "PL", LBVC: "VC", LBVS: "VS" };
  for (const [mn, cond] of Object.entries(conds)) {
    const it = byName.get(mn);
    assert.ok(it, `${mn} must be in mnemonicLibrary`);
    assert.equal(it.isLongBranchMacro, true, `${mn}.isLongBranchMacro`);
    assert.equal(it.longBranchCond, cond, `${mn}.longBranchCond`);
    assert.deepEqual(it.modes, ["relative"], `${mn}.modes`);
  }

  // The long branches live in their own category.
  assert.ok(Array.isArray(mnemonicLibrary.HosszuUgrasok), "HosszuUgrasok category exists");
  assert.equal(mnemonicLibrary.HosszuUgrasok.length, 8);
});

test("createBlockFromMnemonic and updateProgramBlock carry the new macro flags", () => {
  // createBlockFromMnemonic has dedicated arms that copy the flags onto the block.
  assert.match(appJs, /if \(item\.isAssertMacro\) \{[\s\S]*?isAssertMacro: true/, "createBlockFromMnemonic ASSERT arm");
  assert.match(appJs, /if \(item\.isLongBranchMacro\) \{[\s\S]*?longBranchCond: item\.longBranchCond/, "createBlockFromMnemonic LBxx arm");
  assert.match(appJs, /else if \(block\.isAssertMacro\) \{[\s\S]*?block\.assertExpr = block\.rawOperand\.trim\(\)/, "updateProgramBlock ASSERT arm");
});
