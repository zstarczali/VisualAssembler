// Debugger variables: C from the Oscar64 .dbj (globals + the locals of the function at PC), UltimateBasic
// from the compiler's memory map.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const loadApp = require("./helpers/load-app");

const app = loadApp();
const oscar = fs.readFileSync(path.join(__dirname, "..", "www", "oscar64.js"), "utf8");
for (const name of ["_oscParseDbjVars", "_oscFormatValue", "_oscDebugVarRows"]) {
  const start = oscar.indexOf(`function ${name}(`);
  let depth = 0, i = oscar.indexOf("{", start);
  for (; i < oscar.length; i++) { if (oscar[i] === "{") depth++; else if (oscar[i] === "}" && --depth === 0) break; }
  app.run(`globalThis.${name} = ${oscar.slice(start, i + 1)}`);
}

const dbj = JSON.stringify({
  types: [
    { typeid: 0, size: 2, type: "int" }, { typeid: 1, size: 1, type: "uint" },
    { typeid: 2, size: 8, type: "array", eid: 1 }, { typeid: 3, size: 3, type: "struct", members: [{ name: "x", offset: 0, typeid: 1 }, { name: "y", offset: 1, typeid: 0 }] },
    { typeid: 4, size: 4, type: "float" },
  ],
  variables: [
    { name: "counter", start: 0x1000, end: 0x1002, typeid: 0, references: [{ source: "C:/p/main.c" }] },
    { name: "name", start: 0x1002, end: 0x100A, typeid: 2, references: [{ source: "C:/p/main.c" }] },
    { name: "pos", start: 0x100A, end: 0x100D, typeid: 3, references: [{ source: "C:/p/main.c" }] },
    { name: "f", start: 0x1010, end: 0x1014, typeid: 4, references: [{ source: "C:/p/main.c" }] },
    { name: "spentry", start: 0x18F1, end: 0x18F2, typeid: 1, references: [{ source: "C:/tools/oscar64/include/crt.h" }] },
  ],
  functions: [
    { name: "main", start: 0x0880, end: 0x08C0, variables: [] },
    { name: "add", start: 0x0900, end: 0x0920, variables: [{ name: "a", start: 13, end: 15, typeid: 0 }, { name: "s", start: 0x9F00, end: 0x9F02, typeid: 0 }] },
  ],
});

const mem = new Uint8Array(0x10000);
mem.set([0xFE, 0xFF], 0x1000);                 // counter = -2
mem.set([0x61, 0x62, 0x63, 0], 0x1002);        // name = "abc"
mem.set([7, 0x34, 0x12], 0x100A);              // pos = { x: 7, y: 4660 }
mem.set([0, 0, 0x20, 0x40], 0x1010);           // f = 2.5
mem.set([5, 0], 13);                           // a = 5
mem.set([9, 0], 0x9F00);                       // s = 9
app.run(`globalThis.__mem = new Uint8Array(${JSON.stringify(Array.from(mem.slice(0, 0x10000)))}); globalThis.__peek = (a, n) => __mem.slice(a, a + n);`);

const rows = (pc) => app.run(`_oscDebugVarRows(_oscParseDbjVars(${JSON.stringify(dbj)}), ${pc}, __peek).map(r => \`\${r.scope}|\${r.name}=\${r.value}\`)`);

test("C: the program's globals with their values, not the library's", () => {
  assert.deepEqual([...rows(0x0890)], ["|counter=-2 ($FFFE)", '|name="abc"', "|pos={ x: 7, y: 4660 }", "|f=2.5"]);
});

test("C: inside a function its parameters and locals come first", () => {
  const r = [...rows(0x0905)];
  assert.deepEqual(r.slice(0, 2), ["add|a=5 ($0005)", "add|s=9 ($0009)"]);
  assert.equal(r.length, 6);
});

test("UltimateBasic: byte, signed integer, Commodore float, array", () => {
  app.run(`__mem.set([200], 0x02); __mem.set([0x0C, 0xFE], 0x03); __mem.set([0x82, 0xA0, 0, 0, 0], 0xC000); __mem.set([1, 2, 3], 0xC100);`);
  const fmt = (v) => app.run(`_ubFormatValue(${JSON.stringify(v)}, __peek)`);
  assert.equal(fmt({ name: "b", address: 2, type: "int" }), "200 ($C8)");
  assert.equal(fmt({ name: "i", address: 3, type: "integer" }), "-500 ($FE0C)");
  assert.equal(fmt({ name: "x", address: 0xC000, type: "single" }), "-2.5");
  assert.equal(fmt({ name: "z", address: 0xC100, type: "array", size: 3 }), "[01 02 03]");
});
