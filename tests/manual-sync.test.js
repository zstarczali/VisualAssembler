const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

// Keeps the English manual and its Hungarian translation structurally in sync.
// The bodies are prose (and free to diverge in wording), but the section
// skeleton — heading levels, ordering, and code fences — must match. If this
// test fails after editing one manual, mirror the same structural change into
// the other file (see the "translated from" note at the top of the .hu.md).

const EN = fs.readFileSync(path.join(__dirname, "..", "Visual Assembler Manual.md"), "utf8").replace(/\r/g, "");
const HU = fs.readFileSync(path.join(__dirname, "..", "Visual Assembler Manual.hu.md"), "utf8").replace(/\r/g, "");

function headings(md, level) {
  const marker = "#".repeat(level) + " ";
  return md.split("\n").filter((l) => l.startsWith(marker) && !l.startsWith(marker + "#")).length;
}

// The numbered "## N." / "## Nb." top-level sections, in order.
function numberedSections(md) {
  return md.split("\n")
    .filter((l) => /^## \d+b?\. /.test(l))
    .map((l) => l.replace(/^## (\d+b?)\..*/, "$1"));
}

test("EN and HU manuals have matching heading structure", () => {
  for (const level of [2, 3, 4]) {
    assert.equal(headings(HU, level), headings(EN, level), `level-${level} heading count`);
  }
});

test("EN and HU manuals have the same numbered sections in the same order", () => {
  assert.deepEqual(numberedSections(HU), numberedSections(EN));
});

test("EN and HU manuals have balanced, matching code fences", () => {
  const enFences = (EN.match(/^```/gm) || []).length;
  const huFences = (HU.match(/^```/gm) || []).length;
  assert.equal(enFences % 2, 0, "EN code fences unbalanced");
  assert.equal(huFences % 2, 0, "HU code fences unbalanced");
  assert.equal(huFences, enFences, "EN/HU code-fence count");
});

test("both manuals declare the same version", () => {
  const enVer = EN.match(/\*\*Version ([0-9.]+)\*\*/);
  const huVer = HU.match(/\*\*Verzió: ([0-9.]+)\*\*/);
  assert.ok(enVer, "EN version line");
  assert.ok(huVer, "HU version line");
  assert.equal(huVer[1], enVer[1]);
});
