// The debugger files of the Rust VMA CLI (--sym / --vs / --dbg) against the JS
// _buildDebuggerSidecarPayload, over every Expert-text case of the golden corpus.
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

// The JS names macro locals, auto buffers and runtime IF/WHILE labels with a random suffix
// (crypto.randomUUID), the Rust compiler with a counter: compare them without the suffix, and the
// label lines as a set (the suffix decides the order of names at one address).
function normalize(text, ext) {
  const t = text
    .replace(/__m[0-9a-f]{8}\b/g, "__m#")
    .replace(/__buf_[0-9a-f]{8}_/g, "__buf_#_")
    .replace(/\b_(if_else|if_end|while_start|while_end|repeat_start)_[0-9a-f]+\b/g, "_$1_#");
  if (ext !== "dbg") return t.split("\n").sort().join("\n");
  const lines = t.split("\n");
  const from = lines.findIndex(l => l.includes("<Labels")) + 1;
  const to = lines.findIndex(l => l.includes("</Labels>"));
  return [...lines.slice(0, from), ...lines.slice(from, to).sort(), ...lines.slice(to)].join("\n");
}

test("the Rust CLI writes the debugger files the app writes", { skip: !cli && "no Rust VMA CLI" }, async () => {
  const ref = createReference();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vma-debug-"));
  let compared = 0;
  const failures = [];
  try {
    for (const c of allCases(ref.app).filter(c => c.kind === "text")) {
      for (const basicStub of [true, false]) {
        const input = path.join(tmp, c.id + ".asm");
        fs.writeFileSync(input, c.text);
        const js = await ref.compile({ text: c.text, baseDir: c.baseDir, basicStub, debugSource: input });
        if (!js.ok || !js.debug) continue;
        const out = path.join(tmp, "out");
        const run = spawnSync(cli, ["build", input, "-o", out + ".prg", "--debug", "--base-dir", c.baseDir,
          "--search", path.join(repo, "samples"), "--search", repo, ...(basicStub ? [] : ["--no-basic-stub"])], { encoding: "utf8" });
        if (run.status !== 0) {
          failures.push(`${c.id}: ${run.stderr.trim()}`);
          continue;
        }
        compared++;
        for (const ext of ["sym", "vs", "dbg"]) {
          const rust = normalize(fs.readFileSync(`${out}.${ext}`, "utf8"), ext);
          const expected = normalize(js.debug[ext], ext);
          if (rust !== expected) {
            const a = rust.split("\n"), b = expected.split("\n");
            const at = a.findIndex((l, i) => l !== b[i]);
            failures.push(`${c.id}${basicStub ? "" : "@nostub"} .${ext} line ${at + 1}: rust ${JSON.stringify(a[at])} vs js ${JSON.stringify(b[at])}`);
          }
        }
      }
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  assert.ok(compared > 100, `only ${compared} cases compared`);
  assert.deepEqual(failures.slice(0, 20), []);
});
