// Debugger semantics of the bundled built-in C64 (www/vice/vice.*). Run as its own process:
// the emulator keeps running timers, so the process exits explicitly (0 = all checks passed).
import { pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "www", "vice");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fail = (msg) => { console.error("FAIL " + msg); process.exit(1); };
const check = (ok, msg) => { if (!ok) fail(msg); };

const create = (await import(pathToFileURL(join(dir, "vice.js")).href)).default;
const v = await create({ noInitialRun: true, locateFile: (n) => join(dir, n.replace(/^x64sc\./, "vice.")), print() {}, printErr() {} });
v._vice_web_boot();
const t0 = Date.now();
while (v._vice_web_frame_number() < 120 && Date.now() - t0 < 60000) await sleep(50);
check(v._vice_web_frame_number() >= 120, "boot");
const R = (i) => v._vice_web_monitor_register_get(i);
const waitBreak = async () => { const t = Date.now(); while (!v._vice_web_monitor_break_active() && Date.now() - t < 3000) await sleep(2); return !!v._vice_web_monitor_break_active(); };

// $C000 LDX #0 / $C002 JSR $C010 / $C005 INX / $C006 JMP $C002 / $C010 INY / $C011 RTS
const prog = new Uint8Array(0x12);
prog.set([0xA2, 0x00, 0x20, 0x10, 0xC0, 0xE8, 0x4C, 0x02, 0xC0], 0);
prog.set([0xC8, 0x60], 0x10);
const p = v._malloc(prog.length);
v.HEAPU8.set(prog, p);
check(v._vice_web_run_program(0xC000, 0xC000, p, prog.length) === 0, "run_program");
while (v._vice_web_run_program_pending()) await sleep(10);

v._vice_web_monitor_breakpoint_set(0xC005, 1);
check(await waitBreak(), "breakpoint stops");
check(R(0) === 0xC005, "stopped before INX, PC=" + R(0).toString(16));
const x = R(2);
v._vice_web_monitor_step(0, 1); await waitBreak();
check(R(0) === 0xC006 && R(2) === ((x + 1) & 0xFF), "step into runs one instruction");
v._vice_web_monitor_step(0, 1); await waitBreak();
check(R(0) === 0xC002, "JMP");
const y = R(3);
v._vice_web_monitor_step(1, 1); await waitBreak();
check(R(0) === 0xC005 && R(3) === ((y + 1) & 0xFF), "step over runs the subroutine");
// a step that ends on the breakpoint stops once: the next step moves on
v._vice_web_monitor_step(0, 1); await waitBreak();
check(R(0) === 0xC006, "step after a step onto the breakpoint, PC=" + R(0).toString(16));
v._vice_web_monitor_step(0, 1); await waitBreak();
v._vice_web_monitor_step(0, 1); await waitBreak();
check(R(0) === 0xC010, "step into JSR");
v._vice_web_monitor_step(2, 1); await waitBreak();
check(R(0) === 0xC005, "step out");
v._vice_web_monitor_register_set(2, 0x40);
v._vice_web_monitor_step(0, 1); await waitBreak();
check(R(2) === 0x41, "register write takes effect");

v._vice_web_monitor_breakpoint_clear(0xC005);
v._vice_web_monitor_continue();
await sleep(200);
check(!v._vice_web_monitor_break_active(), "runs after continue");
v._vice_web_monitor_break();
check(await waitBreak(), "break stops a running program");
check(R(0) >= 0xC002 && R(0) <= 0xC011, "break lands in the program");
const pk = v._vice_web_monitor_memory_peek(0xC000, 2);
check(v.HEAPU8[pk] === 0xA2 && v.HEAPU8[pk + 1] === 0x00, "peek");
console.log("vice debugger: ok");
process.exit(0);
