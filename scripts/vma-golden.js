#!/usr/bin/env node
// VMA golden corpus: compiles tests/vma-golden/cases.js with the JS reference compiler and
// writes tests/vma-golden/manifest.json (size + sha256 of every PRG, or the expected error).
//   node scripts/vma-golden.js            check the manifest against the current JS compiler
//   node scripts/vma-golden.js --update   rewrite the manifest (after a deliberate change)
//   node scripts/vma-golden.js --inputs D write each case's VMA source to D/<id>.asm (for the Rust CLI)
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { createReference, repo } = require("../tests/helpers/vma-reference");
const { allCases } = require("../tests/vma-golden/cases");

const manifestPath = path.join(repo, "tests", "vma-golden", "manifest.json");
const sha256 = (bytes) => crypto.createHash("sha256").update(Buffer.from(bytes)).digest("hex");

// Every case in both PRG forms the app makes: with the BASIC SYS stub (Run) and without.
async function buildCorpus() {
  const ref = createReference();
  const out = [];
  for (const c of allCases(ref.app)) {
    const input = c.kind === "blocks" ? ref.blocksToText(c.blocks) : c.text;
    for (const basicStub of [true, false]) {
      const src = c.kind === "blocks" ? { blocks: c.blocks } : { text: c.text };
      const r = await ref.compile({ ...src, baseDir: c.baseDir, basicStub });
      out.push({
        id: c.id + (basicStub ? "" : "@nostub"), caseId: c.id, kind: c.kind, file: c.file || null,
        baseDir: path.relative(repo, c.baseDir).split(path.sep).join("/"), basicStub, input,
        ok: r.ok, size: r.ok ? r.bytes.length : 0, sha256: r.ok ? sha256(r.bytes) : null,
        error: r.ok ? null : r.error.replace(/\s+/g, " ").trim(), bytes: r.bytes
      });
    }
  }
  return out;
}

const toManifest = (corpus) => corpus.map(({ input, bytes, ...entry }) => entry);

async function main() {
  const args = process.argv.slice(2);
  const corpus = await buildCorpus();
  const inputsAt = args.indexOf("--inputs");
  if (inputsAt >= 0) {
    const dir = path.resolve(args[inputsAt + 1] || "vma-golden-inputs");
    fs.mkdirSync(dir, { recursive: true });
    for (const c of corpus.filter(e => e.basicStub)) fs.writeFileSync(path.join(dir, c.caseId + ".asm"), c.input);
    console.log(`${corpus.length / 2} inputs → ${dir}`);
  }
  if (args.includes("--update")) {
    fs.writeFileSync(manifestPath, JSON.stringify(toManifest(corpus), null, 1) + "\n");
    console.log(`manifest: ${corpus.length} entries, ${corpus.filter(e => e.ok).length} PRG`);
    return;
  }
  const old = new Map(JSON.parse(fs.readFileSync(manifestPath, "utf8")).map(e => [e.id, e]));
  const diffs = toManifest(corpus).filter(e => JSON.stringify(e) !== JSON.stringify(old.get(e.id)));
  for (const d of diffs) console.log("changed:", d.id, d.ok ? `${d.size} ${d.sha256.slice(0, 12)}` : d.error);
  console.log(diffs.length ? `${diffs.length} changed (run with --update if intended)` : "manifest up to date");
  process.exitCode = diffs.length ? 1 : 0;
}

module.exports = { buildCorpus, sha256, manifestPath };
if (require.main === module) main();
