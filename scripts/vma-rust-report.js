#!/usr/bin/env node
// The Rust VMA port against the golden corpus, case by case.
//   node scripts/vma-rust-report.js [filter]     (filter: a substring of the case id)
// Statuses: match, diff, error, unsupported (a directive not ported yet), expected-error, missed-error.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { buildCorpus } = require("./vma-golden");
const { findRustCli, runRustCli, compareCase } = require("../tests/helpers/vma-rust");

async function main() {
  const cli = findRustCli();
  if (!cli) {
    console.error("no Rust VMA CLI: cargo build in crates/vma, or set VMA_BIN");
    process.exitCode = 2;
    return;
  }
  const filter = process.argv[2] || "";
  const corpus = (await buildCorpus()).filter(c => c.id.includes(filter));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vma-report-"));
  const counts = {};
  const missing = {};
  try {
    for (const c of corpus) {
      const r = compareCase(c, runRustCli(cli, c, tmp));
      counts[r.status] = (counts[r.status] || 0) + 1;
      if (r.status === "unsupported") {
        const what = (r.detail.match(/: (\S+) is not supported/) || [])[1] || "?";
        missing[what] = (missing[what] || 0) + 1;
      } else if (r.status !== "match" && r.status !== "expected-error") {
        console.log(`${r.status.padEnd(12)} ${c.id}${r.detail ? "  " + r.detail : ""}`);
      }
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  console.log(`\n${corpus.length} cases (${cli})`);
  for (const [k, v] of Object.entries(counts).sort()) console.log(`  ${k.padEnd(15)} ${v}`);
  const top = Object.entries(missing).sort((a, b) => b[1] - a[1]);
  if (top.length) console.log(`  not ported yet: ${top.map(([k, v]) => `${k} ${v}`).join(", ")}`);
  process.exitCode = (counts.diff || 0) + (counts.error || 0) + (counts["missed-error"] || 0) ? 1 : 0;
}

main();
