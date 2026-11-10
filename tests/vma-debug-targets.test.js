// The debugger view of a VMA build (_vmaRustBuild → _vmaDebuggerTargets and the sidecars) in Block
// mode, over the text cases of the golden corpus, with the real CLI: the symbols the debugger gets
// are the .sym file's, a Block breakpoint is the address of its block's first line, an Expert
// breakpoint line the next line that emits code. (The sidecars themselves: the golden manifest.)
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");
const { allCases } = require("./vma-golden/cases");
const { useVmaCli, vmaTest: test } = require("./helpers/vma-cli");

test("the debugger gets the symbols of the .sym file and the addresses of its breakpoints", async () => {
  const app = useVmaCli(loadApp());
  let compared = 0;
  const failures = [];
  for (const c of allCases(app).filter(c => c.kind === "text").slice(0, 60)) {
    app.__src = c.text;
    app.__dir = c.baseDir;
    const r = await app.run(`(async () => {
      program = parseExpertText(__src);
      _addSrcLineToBlocks(__src, program);
      program.forEach((b, i) => { b.isBreakpoint = i % 7 === 3; });
      workingFolder = __dir;
      const prg = await _vmaRustBuild();
      if (!prg.ok || !prg.vma) return { error: prg.error || "no debugger view" };
      const lines = __src.split("\\n").map((_, i) => i).filter(i => i % 5 === 2);
      const targets = _vmaDebuggerTargets(prg.vma, lines);
      // the address of the first laid-out line of each marked block
      const marked = [];
      let previous = -1;
      for (const l of prg.analysis.lines) {
        if (l.blockIndex >= 0 && l.blockIndex !== previous && l.block?.isBreakpoint) marked.push(l.address & 0xFFFF);
        if (l.blockIndex >= 0) previous = l.blockIndex;
      }
      const code = prg.analysis.lines.filter(l => l.size > 0 && !l.skipped);
      return { targets, marked, sym: prg.vma.sidecars.sym, codeAddresses: code.map(l => l.address & 0xFFFF) };
    })()`);
    if (r.error) continue;
    compared++;
    const id = c.id;
    const fromSym = new Set([...r.sym.matchAll(/^\.label\s+(\S+)\s*=\s*\$([0-9A-Fa-f]+)/gm)].map(m => `${m[1]}=${parseInt(m[2], 16)}`));
    const fromTargets = new Set(r.targets.symbols.map(s => `${s.name}=${s.address & 0xFFFF}`));
    const missing = [...fromTargets].filter(s => !fromSym.has(s));
    if (missing.length) failures.push(`${id}: not in the .sym: ${missing.slice(0, 3).join(", ")}`);
    if (JSON.stringify(r.targets.breakpoints) !== JSON.stringify(r.marked)) failures.push(`${id}: breakpoints ${r.targets.breakpoints} vs ${r.marked}`);
    const code = new Set(r.codeAddresses);
    const off = r.targets.expertBreakpoints.filter(a => !code.has(a));
    if (off.length) failures.push(`${id}: Expert breakpoint off the code: ${off.slice(0, 3)}`);
  }
  assert.ok(compared > 30, `only ${compared} cases compared`);
  assert.deepEqual(failures.slice(0, 20), []);
});
