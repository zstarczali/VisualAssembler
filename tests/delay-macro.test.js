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
    if (ch === "{") {
      depth += 1;
      seenBrace = true;
    } else if (ch === "}") {
      depth -= 1;
      if (seenBrace && depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  assert.notStrictEqual(end, -1, `Could not parse function ${name}`);
  return appJs.slice(start, end);
}

function loadFunction(name, extraContext = {}) {
  const context = { ...extraContext };
  vm.createContext(context);
  vm.runInContext(`${extractFunctionSource(name)}; this.fn = ${name};`, context);
  return context.fn;
}

function loadFunctions(names, extraContext = {}) {
  const context = { ...extraContext };
  vm.createContext(context);
  for (const name of names) {
    vm.runInContext(`${extractFunctionSource(name)}; this["${name}"] = ${name};`, context);
  }
  return context;
}

test("DELAY helper preserves registers and returns with RTS", () => {
  const buildDelayHelperBytes = loadFunction("buildDelayHelperBytes");
  const bytes = Array.from(buildDelayHelperBytes(0x2000));

  assert.equal(bytes.length, 34);
  assert.deepEqual(
    bytes.slice(0, 10),
    [0x48, 0x8A, 0x48, 0x98, 0x48, 0x8E, 0x21, 0x20, 0xAD, 0x12]
  );
  assert.deepEqual(bytes.slice(23, 25), [0x21, 0x20]);
  assert.deepEqual(bytes.slice(28, 33), [0xA8, 0x68, 0xAA, 0x68, 0x60]);
  assert.equal(bytes[33], 0x00);
});

test("DELAY instruction size stays fixed because it calls the shared helper", () => {
  const getInstructionSize = loadFunction("getInstructionSize", {
    parseDelayFrameCount: () => 200
  });
  const size = getInstructionSize({ isDelayMacro: true, delayFrames: "200" });
  assert.equal(size, 5);
});

test("DELAY instruction size does not expand for invalid values either", () => {
  const getInstructionSize = loadFunction("getInstructionSize", {
    parseDelayFrameCount: () => null
  });
  const size = getInstructionSize({ isDelayMacro: true, delayFrames: "bad" });
  assert.equal(size, 5);
});

test("assembleProgramToPrg handles DELAY helper injection without ReferenceError", () => {
  const ctx = loadFunctions(
    ["assembleProgramToPrg"],
    {
      Map,
      Uint8Array,
      DELAY_HELPER_LABEL: "__delay_wait_frames",
      asmBlockRanges: {},
      getProgramLayout: () => ({
        origin: { value: 0x0801 },
        end: 0x0805,
        lines: [
          {
            address: 0x0801,
            block: {
              mnemonic: "DELAY",
              isDelayMacro: true,
              operand: "",
              id: "delay-1"
            }
          }
        ]
      }),
      addLayoutLabels: () => {},
      _collectAnonLabels: () => [],
      appendDelayHelperLabel: (labels) => labels.set("__delay_wait_frames", 0x0900),
      buildDelayHelperBytes: () => [0x48, 0x60],
      compileLineBytes: () => ({ ok: true, bytes: [0x20, 0x00, 0x09, 0xA2, 0x05] }),
      parseByteMacro: () => [],
      encodeTextMacro: () => [],
      encodePetsciiMacro: () => [],
      parseAddressValue: () => null
    }
  );

  const result = ctx.assembleProgramToPrg(0x0801);

  assert.equal(result.ok, true);
  assert.deepEqual(Array.from(result.bytes.slice(0, 2)), [0x01, 0x08]);
  assert.ok(Array.from(result.bytes).includes(0x48));
  assert.ok(Array.from(result.bytes).includes(0x60));
});
