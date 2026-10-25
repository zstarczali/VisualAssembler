// The debugger view of a Rust build (vma_build with a source path → _vmaDebuggerTargets and the
// sidecars) against runInDebugger's JS-layout branch, in Block mode (the blocks' _srcLine through
// the line map), over the text cases of the golden corpus, with the real Rust CLI.
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

// The JS names macro locals, auto buffers and runtime IF/WHILE labels with a random suffix,
// the Rust compiler with a counter.
const unsuffix = (s) => String(s)
  .replace(/__m[0-9a-f]{8}\b/g, "__m#")
  .replace(/__buf_[0-9a-f]{8}_/g, "__buf_#_")
  .replace(/\b_(if_else|if_end|while_start|while_end|repeat_start)_[0-9a-f]+\b/g, "_$1_#");
const symbolSet = (symbols) => symbols.map(s => `${unsuffix(s.name)}=${s.address & 0xFFFF}`).sort();
const sortedLines = (text) => unsuffix(text).split("\n").sort();

// vma_build through the CLI (--json, --source-path, --line-map)
function cliBuild(tmp, baseDir) {
  return async (source, _baseDir, basicStub, sourcePath, lineMap) => {
    const input = path.join(tmp, "in.asm");
    const json = path.join(tmp, "out.json");
    fs.writeFileSync(input, source);
    fs.rmSync(json, { force: true });
    const args = ["build", input, "-o", path.join(tmp, "out.prg"), "--json", json, "--base-dir", baseDir,
      "--search", path.join(repo, "samples"), "--search", repo, ...(basicStub ? [] : ["--no-basic-stub"])];
    if (sourcePath) args.push("--source-path", sourcePath);
    if (lineMap) {
      fs.writeFileSync(path.join(tmp, "map.json"), JSON.stringify(lineMap));
      args.push("--line-map", path.join(tmp, "map.json"));
    }
    const run = spawnSync(cli, args, { encoding: "utf8" });
    if (run.status !== 0) return { ok: false, error: run.stderr.trim(), line: 0 };
    return JSON.parse(fs.readFileSync(json, "utf8"));
  };
}

test("a Rust build gives the debugger the JS layout's symbols, breakpoints and files", { skip: !cli && "no Rust VMA CLI" }, async () => {
  const ref = createReference();
  const { app } = ref;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vma-targets-"));
  let compared = 0;
  const failures = [];
  try {
    for (const c of allCases(app).filter(c => c.kind === "text")) {
      for (const basicStub of [true, false]) {
        const js = await ref.compile({ text: c.text, baseDir: c.baseDir, basicStub });
        if (!js.ok) continue;
        app.electronAPI.vmaBuild = cliBuild(tmp, c.baseDir);
        // every 7th block a Block breakpoint, every 5th source line an Expert breakpoint line
        app.__lines = c.text.split("\n").map((_, i) => i).filter(i => i % 5 === 2);
        const expected = app.run(`(() => {
          program.forEach((b, i) => { b.isBreakpoint = i % 7 === 3; });
          const prg = _buildAutostartPrgCore();
          const layout = getProgramLayout(_getDebuggerCodeOrigin(prg));
          const { symbols, breakpoints } = _collectDebuggerSymbols(layout);
          return {
            symbols, breakpoints,
            expertBreakpoints: _breakpointAddressForSourceLines(layout, __lines),
            sidecars: _buildDebuggerSidecarPayload(prg, { force: true, layout })
          };
        })()`);
        const rust = await app.run(`(async () => {
          const prg = await _vmaRustBuild();
          if (!prg.ok) return { error: prg.error };
          return { ..._vmaDebuggerTargets(prg.vma, __lines), sidecars: _buildDebuggerSidecarPayload(prg, { force: true }) };
        })()`);
        const id = `${c.id}${basicStub ? "" : "@nostub"}`;
        if (rust.error) { failures.push(`${id}: ${rust.error}`); continue; }
        compared++;
        const check = (what, a, b) => {
          if (JSON.stringify(a) !== JSON.stringify(b)) {
            const at = Array.isArray(a) ? a.findIndex((v, i) => JSON.stringify(v) !== JSON.stringify(b[i])) : -1;
            failures.push(`${id} ${what}${at >= 0 ? ` [${at}]: rust ${JSON.stringify(a[at])} vs js ${JSON.stringify(b[at])}` : ""}`);
          }
        };
        check("symbols", symbolSet(rust.symbols), symbolSet(expected.symbols));
        check("breakpoints", rust.breakpoints, expected.breakpoints);
        check("expert breakpoints", rust.expertBreakpoints, expected.expertBreakpoints);
        for (const ext of ["sym", "vs", "dbg"]) check("." + ext, sortedLines(rust.sidecars[ext]), sortedLines(expected.sidecars[ext]));
      }
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  assert.ok(compared > 100, `only ${compared} cases compared`);
  assert.deepEqual(failures.slice(0, 25), []);
});
