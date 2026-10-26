// The memory view of the Rust VMA CLI (--json `memory` and `segments`) against the JS
// getMemoryUsage, over every Expert-text case of the golden corpus.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { createReference, repo } = require("./helpers/vma-reference");
const { allCases } = require("./vma-golden/cases");
const { findRustCli } = require("./helpers/vma-rust");

const cli = findRustCli();

// Auto buffer labels carry a random suffix in the JS (see vma-debug-files.test.js).
const normalize = (memory) => JSON.parse(JSON.stringify(memory).replace(/__buf_[0-9a-f]{8}_/g, "__buf_#_"));

test("the Rust CLI gives the memory panel's view the app computes", { skip: !cli && "no Rust VMA CLI" }, async () => {
  const ref = createReference();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vma-memory-"));
  let compared = 0;
  let segmented = 0;
  const failures = [];
  try {
    for (const c of allCases(ref.app).filter(c => c.kind === "text")) {
      for (const basicStub of [true, false]) {
        const js = await ref.compile({ text: c.text, baseDir: c.baseDir, basicStub, memory: true });
        if (!js.ok) continue;
        const input = path.join(tmp, c.id + ".asm");
        fs.writeFileSync(input, c.text);
        const json = path.join(tmp, "out.json");
        const run = spawnSync(cli, ["build", input, "-o", path.join(tmp, "out.prg"), "--json", json, "--base-dir", c.baseDir,
          "--search", path.join(repo, "samples"), "--search", repo, ...(basicStub ? [] : ["--no-basic-stub"])], { encoding: "utf8" });
        const id = `${c.id}${basicStub ? "" : "@nostub"}`;
        if (run.status !== 0) {
          failures.push(`${id}: ${run.stderr.trim()}`);
          continue;
        }
        const rust = JSON.parse(fs.readFileSync(json, "utf8"));
        compared++;
        try {
          assert.deepEqual(normalize(rust.memory), normalize(js.memory));
        } catch (e) {
          failures.push(`${id}: memory ${e.message.split("\n").slice(0, 12).join(" ")}`);
        }
        // the segments are the PRG's bytes where it is loaded as laid out (no relocating loader)
        const prg = rust.prg;
        const load = prg[0] | (prg[1] << 8);
        const relocated = rust.sysAddress === 0x080D && rust.segments.some(([a]) => a < 0x0801);
        if (relocated) continue;
        segmented++;
        for (const [address, bytes] of rust.segments) {
          const at = address - load + 2;
          if (at < 2 || at + bytes.length > prg.length || bytes.some((b, i) => b !== prg[at + i])) {
            failures.push(`${id}: segment $${address.toString(16)} (${bytes.length} bytes) is not the PRG's`);
            break;
          }
        }
      }
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  assert.ok(compared > 100, `only ${compared} cases compared`);
  assert.ok(segmented > 100, `only ${segmented} segment checks`);
  assert.deepEqual(failures.slice(0, 20), []);
});
