// VMA golden corpus (scripts/vma-golden.js): the JS compiler output is pinned in
// tests/vma-golden/manifest.json, and the Rust VMA CLI must build the same PRG bytes.
// Rust CLI: VMA_BIN, or <VMA_DIR, default ../VMA>/target/{release,debug}/vma[.exe]; without it that
// test skips. A summary per case: node scripts/vma-rust-report.js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { buildCorpus, sha256, manifestPath } = require("../scripts/vma-golden");
const { repo } = require("./helpers/vma-reference");
const { findRustCli, runRustCli, firstDiff, compareCase } = require("./helpers/vma-rust");

const corpusPromise = buildCorpus();

test("the JS VMA compiler still matches the golden manifest", async () => {
  const corpus = await corpusPromise;
  const manifest = new Map(JSON.parse(fs.readFileSync(manifestPath, "utf8")).map(e => [e.id, e]));
  assert.equal(corpus.length, manifest.size, "case list changed: node scripts/vma-golden.js --update");
  for (const c of corpus) {
    const m = manifest.get(c.id);
    assert.ok(m, `${c.id} missing from manifest`);
    assert.equal(c.ok, m.ok, `${c.id}: ${c.error || "now builds"}`);
    if (c.ok) assert.equal(c.sha256, m.sha256, `${c.id}: PRG changed (${c.size} vs ${m.size} bytes)`);
  }
});

// Block mode will hand the Rust compiler Expert text, so Block → text must not lose anything.
test("block programs build the same PRG through their Expert text", async () => {
  const { createReference } = require("./helpers/vma-reference");
  const ref = createReference();
  const corpus = (await corpusPromise).filter(c => c.kind === "blocks" && c.ok);
  assert.ok(corpus.length > 40);
  for (const c of corpus) {
    const r = await ref.compile({ text: c.input, baseDir: path.join(repo, c.baseDir), basicStub: c.basicStub });
    assert.equal(r.ok, true, `${c.id}: ${r.error}`);
    assert.equal(sha256(r.bytes), c.sha256, `${c.id}: Expert text differs from blocks at byte ${firstDiff(r.bytes, c.bytes)}`);
  }
});

// While the port is in progress a directive it does not assemble yet is "unsupported" (an error
// that names it) and is only counted; everything else must be byte for byte the JS output.
test("the Rust VMA CLI builds every golden case it supports byte for byte", async (t) => {
  const cli = findRustCli();
  if (!cli) { t.skip("no Rust VMA CLI (VMA_BIN, or cargo build in ../VMA)"); return; }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vma-golden-"));
  const failures = [];
  let matched = 0, unsupported = 0;
  try {
    for (const c of await corpusPromise) {
      const r = compareCase(c, runRustCli(cli, c, tmp));
      if (r.status === "match" || r.status === "expected-error") matched++;
      else if (r.status === "unsupported") unsupported++;
      else failures.push(`${c.id}: ${r.status}${r.detail ? " — " + r.detail : ""}`);
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  t.diagnostic(`${matched} match, ${unsupported} not ported yet, ${failures.length} wrong`);
  assert.deepEqual(failures, []);
});
