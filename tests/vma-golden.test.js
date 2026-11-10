// VMA golden corpus (scripts/vma-golden.js): the VMA compiler's PRG and debugger files of every
// case are pinned in tests/vma-golden/manifest.json. A deliberate change: node scripts/vma-golden.js --update
// The CLI: VMA_BIN, or <VMA_DIR, default ../VMA>/target/{release,debug}/vma[.exe]; without it the test skips.
const assert = require("node:assert/strict");
const { buildCorpus, checkCorpus, readManifest } = require("../scripts/vma-golden");
const { vmaCli, vmaTest: test } = require("./helpers/vma-cli");

test("the VMA compiler still builds the golden corpus as pinned in the manifest", (t) => {
  const corpus = buildCorpus();
  const manifest = readManifest();
  assert.equal(corpus.length, manifest.size, "case list changed: node scripts/vma-golden.js --update");
  const { entries, diffs } = checkCorpus(vmaCli(), corpus, manifest);
  t.diagnostic(`${entries.filter(e => e.ok).length} PRG, ${entries.filter(e => !e.ok).length} expected errors`);
  assert.deepEqual(diffs.map(d => `${d.id}: ${d.what}`), []);
});
