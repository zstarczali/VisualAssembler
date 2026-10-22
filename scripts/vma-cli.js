#!/usr/bin/env node
// The VMA CLI contract on the JS reference compiler; the Rust `vma` binary implements the same:
//   vma build <input.asm> -o <out.prg> [--base-dir DIR] [--search DIR]... [--no-basic-stub]
// Exit 0 + PRG on success, exit 1 + errors on stderr otherwise.
// tests/vma-golden.test.js runs it with VMA_BIN=scripts/vma-cli.js to check the harness itself.
const fs = require("node:fs");
const path = require("node:path");
const { createReference } = require("../tests/helpers/vma-reference");

async function main(argv) {
  const [cmd, input, ...rest] = argv;
  if (cmd !== "build" || !input) {
    console.error("usage: vma build <input.asm> -o <out.prg> [--base-dir DIR] [--search DIR]... [--no-basic-stub]");
    return 2;
  }
  let output = null;
  let baseDir = path.dirname(path.resolve(input));
  let basicStub = true;
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === "-o") output = rest[++i];
    else if (rest[i] === "--base-dir") baseDir = rest[++i];
    else if (rest[i] === "--search") i++; // the reference resolver already looks in samples/ and the repo root
    else if (rest[i] === "--no-basic-stub") basicStub = false;
  }
  const r = await createReference().compile({ text: fs.readFileSync(input, "utf8"), baseDir, basicStub });
  if (!r.ok) { console.error(r.error); return 1; }
  fs.writeFileSync(output || input.replace(/\.[^.]*$/, "") + ".prg", Buffer.from(r.bytes));
  return 0;
}

main(process.argv.slice(2)).then(code => { process.exitCode = code; });
