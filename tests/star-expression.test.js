const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function extractFunctionSource(name) {
  const marker = `function ${name}(`;
  const start = appJs.indexOf(marker);
  assert.notStrictEqual(start, -1, `Missing function ${name}`);
  let depth = 0;
  let end = -1;
  let seenBrace = false;
  for (let i = start; i < appJs.length; i++) {
    const ch = appJs[i];
    if (ch === "{") { depth += 1; seenBrace = true; }
    else if (ch === "}") { depth -= 1; if (seenBrace && depth === 0) { end = i + 1; break; } }
  }
  assert.notStrictEqual(end, -1, `Could not parse function ${name}`);
  return appJs.slice(start, end);
}

function loadFunctions(names, extraContext = {}) {
  const context = { ...extraContext };
  vm.createContext(context);
  for (const name of names) {
    vm.runInContext(`${extractFunctionSource(name)}; this["${name}"] = ${name};`, context);
  }
  return context;
}

function makeContext(extra = {}) {
  return loadFunctions(
    [
      "parseNumberByBase",
      "lookupProgramConstValue",
      "resolveProgramConstValue",
      "_substituteStarPc",
      "_hasStarPcRef",
      "_evalAsmExpr",
      "_branchOffsetFromTarget",
      "resolveNumericOperand",
      "resolveRelativeOperand",
      "compileLineBytes",
      "getInstructionSize"
    ],
    {
      crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000000" },
      getLiveValidationError: () => "",
      formatAddress: (v) => `$${(v & 0xFFFF).toString(16).toUpperCase().padStart(4, "0")}`,
      t: (k) => k,
      tf: (k, v) => `${k}:${JSON.stringify(v || {})}`,
      program: [],
      userMacros: {},
      opcodeMap: {
        LDA: { immediate: 0xA9, zeroPage: 0xA5, absolute: 0xAD, absoluteX: 0xBD },
        JMP: { absolute: 0x4C },
        BNE: { relative: 0xD0 },
        BEQ: { relative: 0xF0 }
      },
      addressingModes: {
        implied: { needsOperand: false },
        immediate: { needsOperand: true },
        zeroPage: { needsOperand: true },
        absolute: { needsOperand: true },
        absoluteX: { needsOperand: true },
        relative: { needsOperand: true }
      },
      ...extra
    }
  );
}

function compile(ctx, block, address = 0xC000, labels = new Map()) {
  const r = ctx.compileLineBytes({ address, block }, labels);
  assert.ok(r.ok, r.error || "compile failed");
  return Array.from(r.bytes);
}

test("BNE * → infinite self-loop offset $FE", () => {
  const ctx = makeContext();
  assert.deepEqual(
    compile(ctx, { mnemonic: "BNE", addressingMode: "relative", rawOperand: "*", base: "hex" }, 0xC000),
    [0xD0, 0xFE]
  );
});

test("BNE *-2 and BNE *+4 resolve against the instruction address", () => {
  const ctx = makeContext();
  // target = 0xC010 + (-2) = 0xC00E; offset = 0xC00E - (0xC010 + 2) = -4 → 0xFC
  assert.deepEqual(
    compile(ctx, { mnemonic: "BNE", addressingMode: "relative", rawOperand: "*-2", base: "hex" }, 0xC010),
    [0xD0, 0xFC]
  );
  // target = 0xC010 + 4 = 0xC014; offset = 0xC014 - 0xC012 = 2
  assert.deepEqual(
    compile(ctx, { mnemonic: "BNE", addressingMode: "relative", rawOperand: "*+4", base: "hex" }, 0xC010),
    [0xD0, 0x02]
  );
});

test("JMP *+20 produces an absolute address relative to the current PC", () => {
  const ctx = makeContext();
  // 0xC000 + 20 = 0xC014
  assert.deepEqual(
    compile(ctx, { mnemonic: "JMP", addressingMode: "absolute", rawOperand: "*+20", base: "hex" }, 0xC000),
    [0x4C, 0x14, 0xC0]
  );
});

test("LDA #<* and LDA #>(*+256) take low/high byte of the PC expression", () => {
  const ctx = makeContext();
  assert.deepEqual(
    compile(ctx, { mnemonic: "LDA", addressingMode: "immediate", rawOperand: "#<*", operand: "#<*", base: "hex" }, 0xC012),
    [0xA9, 0x12]
  );
  assert.deepEqual(
    compile(ctx, { mnemonic: "LDA", addressingMode: "immediate", rawOperand: "#>(*+256)", operand: "#>(*+256)", base: "hex" }, 0xC012),
    [0xA9, 0xC1]
  );
});

test("`*` after an identifier stays multiplication, not the PC", () => {
  const ctx = makeContext({
    program: [{ isConstMacro: true, constName: "STRIDE", constValue: 40 }]
  });
  // STRIDE*2 = 80 = $50 — not a PC reference
  assert.deepEqual(
    compile(ctx, { mnemonic: "LDA", addressingMode: "absolute", rawOperand: "STRIDE*2", base: "hex" }, 0xC000),
    [0xAD, 0x50, 0x00]
  );
});

test("out-of-range branch reports overshoot and suggests LBxx", () => {
  const ctx = makeContext();
  const r = ctx.compileLineBytes(
    { address: 0xC000, block: { mnemonic: "BNE", addressingMode: "relative", rawOperand: "far", base: "hex" } },
    new Map([["far", 0xC0F0]])
  );
  assert.equal(r.ok, false);
  assert.match(r.error, /branchOutOfRangeSuggest/);
  assert.match(r.error, /LBNE/);
  // offset = 0xC0F0 - (0xC000 + 2) = 238; overshoot = 238 - 127 = 111
  assert.match(r.error, /\+111/);
});
