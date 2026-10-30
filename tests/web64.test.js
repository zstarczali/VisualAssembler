// Built-in C64 (www/web64, VICE x64sc in WebAssembly): source map parsing, the SYS address of a
// PRG, and the debugger semantics of the bundled module (stop before the instruction, step
// into / over / out, continue, break, side-effect free peek).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");
function slice(startMarker, endMarker) {
  const start = appJs.indexOf(startMarker);
  const end = appJs.indexOf(endMarker, start);
  assert.ok(start > 0 && end > start, `section not found: ${startMarker}`);
  return appJs.slice(start, end);
}
const context = vm.createContext({});
vm.runInContext(slice("function _w64SourceAt(", "// Breakpoint lines of the open tabs")
  + slice("function _w64LedStep(", "function _w64RenderDrive(")
  + slice("function _w64SysAddress(", "function _w64ScreenHasReady(")
  + slice("function _w64ParseDbg(", "// The build and its source map"), context);
const plain = (v) => JSON.parse(JSON.stringify(v));

test("the .dbg source map: files and address ranges with 1-based lines", () => {
  const dbg = [
    '<C64debugger version="1.0">',
    '   <Sources values="INDEX,FILE">',
    "      0,F:/p/main.asm",
    "      1,F:/p/lib &amp; more.asm",
    "   </Sources>",
    '   <Segment name="Default" dest="" values="START,END,FILE_IDX,LINE1,COL1,LINE2,COL2">',
    '      <Block name="Main">',
    "         $c000,$c001,0,3,1,3,1",
    "         $c002,$c004,1,10,1,10,1",
    "      </Block>",
    "   </Segment>",
    "</C64debugger>",
  ].join("\n");
  assert.deepEqual(plain(context._w64ParseDbg(dbg)), [
    { start: 0xC000, end: 0xC001, file: "F:/p/main.asm", line: 3 },
    { start: 0xC002, end: 0xC004, file: "F:/p/lib & more.asm", line: 10 },
  ]);
  assert.deepEqual(plain(context._w64ParseDbg("")), []);
});

test("nested source ranges: the innermost one names the line, in any order", () => {
  const entries = [
    { start: 0x0834, end: 0x0838, line: 4 },
    { start: 0x0834, end: 0x083E, line: 3 },
    { start: 0x0839, end: 0x083D, line: 5 },
  ];
  context._w64S = () => ({ session: { entries } });
  const lineAt = (pc) => context._w64SourceAt(pc)?.line;
  assert.equal(lineAt(0x0834), 4);
  assert.equal(lineAt(0x0836), 4);
  assert.equal(lineAt(0x083A), 5);
  assert.equal(lineAt(0x083E), 3, "the sub's own RTS");
  assert.equal(lineAt(0x0840), undefined);
  entries.reverse();
  assert.equal(lineAt(0x0834), 4);
  assert.equal(lineAt(0x083A), 5);
});

test("drive LED: regular blinking is an error, a steady or slow LED is not", () => {
  const run = (steps) => {
    const led = { lit: false, edge: 0, edges: 0, error: false };
    let now = 1000;
    const seen = [];
    for (const [lit, ms] of steps) { now += ms; context._w64LedStep(led, lit, now); seen.push(led.error); }
    return seen;
  };
  const blink = (n) => Array.from({ length: n }, (_, i) => [i % 2 === 0, 140]);
  assert.equal(run(blink(8)).at(-1), true, "the 1541's error blink");
  assert.equal(run(blink(3)).at(-1), false, "too few edges");
  assert.equal(run([[true, 100], [true, 3000], [false, 800], [true, 900], [false, 2000]]).at(-1), false, "a load: long steady phases");
  assert.equal(run([...blink(8), [false, 700]]).at(-1), false, "the error ends when the LED stays off");
  assert.equal(run([...blink(8), [true, 100], [true, 700]]).at(-1), false, "or stays lit");
});

test("SYS address of a BASIC stub, otherwise the load address", () => {
  const stub = [0x01, 0x08, 0x0B, 0x08, 0x0A, 0x00, 0x9E, 0x32, 0x30, 0x36, 0x31, 0x00, 0x00, 0x00, 0x60];
  assert.equal(context._w64SysAddress(stub), 2061);
  const spaced = [0x01, 0x08, 0x0C, 0x08, 0x0A, 0x00, 0x9E, 0x20, 0x34, 0x39, 0x31, 0x35, 0x32, 0x00, 0x00, 0x00];
  assert.equal(context._w64SysAddress(spaced), 49152);
  assert.equal(context._w64SysAddress([0x00, 0xC0, 0x60]), 0xC000);
});

const { spawnSync } = require("node:child_process");
const dir = path.join(__dirname, "..", "www", "web64");
const hasModule = ["x64sc.js", "x64sc.wasm", "x64sc.data"].every((f) => fs.existsSync(path.join(dir, f)));

// the emulator keeps running after the checks: they run in their own process, which exits
test("the bundled emulator stops before the instruction and steps like the VICE monitor", { skip: !hasModule }, () => {
  const r = spawnSync(process.execPath, [path.join(__dirname, "helpers", "web64-debug-check.mjs")], { encoding: "utf8", timeout: 120000 });
  assert.equal(r.status, 0, (r.stdout || "") + (r.stderr || ""));
  assert.match(r.stdout, /web64 debugger: ok/);
});
