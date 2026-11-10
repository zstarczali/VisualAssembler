// The memory view of the VMA compiler (CLI `memory` and `segments`) over every Expert-text case
// of the golden corpus: the segments are the PRG's bytes where it is loaded.
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");
const { allCases } = require("./vma-golden/cases");
const { compileText, vmaTest: test } = require("./helpers/vma-cli");

test("the segments are the bytes of the PRG", () => {
  const app = loadApp();
  let segmented = 0;
  const failures = [];
  for (const c of allCases(app).filter(c => c.kind === "text")) {
    for (const basicStub of [true, false]) {
      const r = compileText(c.text, { baseDir: c.baseDir, basicStub });
      if (!r.ok) continue;
      const id = `${c.id}${basicStub ? "" : "@nostub"}`;
      const prg = r.prg;
      const load = prg[0] | (prg[1] << 8);
      // the segments are the PRG's bytes where it is loaded as laid out (no relocating loader)
      const relocated = r.sysAddress === 0x080D && r.segments.some(([a]) => a < 0x0801);
      if (relocated) continue;
      segmented++;
      for (const [address, bytes] of r.segments) {
        const at = address - load + 2;
        if (at < 2 || at + bytes.length > prg.length || bytes.some((b, i) => b !== prg[at + i])) {
          failures.push(`${id}: segment $${address.toString(16)} (${bytes.length} bytes) is not the PRG's`);
          break;
        }
      }
      // the memory panel's code range starts at the code
      if (r.memory.code && r.memory.code[0] > r.memory.code[1] + 1) failures.push(`${id}: code range ${r.memory.code}`);
    }
  }
  assert.ok(segmented > 100, `only ${segmented} segment checks`);
  assert.deepEqual(failures.slice(0, 20), []);
});
