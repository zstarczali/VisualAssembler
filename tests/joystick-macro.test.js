const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function loadJoy() {
  const start = appJs.indexOf("/* JOYSTICK: `.joystick port, sprite`");
  const end = appJs.indexOf("function _joystickSize(");
  const fnEnd = appJs.indexOf("\n}", end) + 2;
  assert.ok(start > 0 && end > start, "joystick helpers not found");
  const context = {
    resolveProgramNumericValue: (raw) => parseInt(String(raw), 10),
  };
  vm.createContext(context);
  vm.runInContext(appJs.slice(start, fnEnd) +
    "\nthis.j = { isVar: _joyIsVarMode, varBytes: _joyVarBytes, size: _joystickSize, read: _joyReadBytes };", context);
  return context.j;
}

// Just enough 6502 for the joystick code.
function run(code, dc00, dc01) {
  const mem = new Uint8Array(0x10000);
  mem[0xDC00] = dc00; mem[0xDC01] = dc01;
  mem.set(code, 0xC000);
  let pc = 0xC000, a = 0, c = 0;
  const rd16 = () => mem[pc] | (mem[pc + 1] << 8);
  while (pc !== 0xC000 + code.length) {
    const op = mem[pc++];
    switch (op) {
      case 0xA9: a = mem[pc++]; break;
      case 0xAD: a = mem[rd16()]; pc += 2; break;
      case 0x2D: a &= mem[rd16()]; pc += 2; break;
      case 0x8D: mem[rd16()] = a; pc += 2; break;
      case 0x4A: c = a & 1; a >>= 1; break;
      case 0xB0: { const rel = mem[pc++]; if (c) pc += rel; break; }
      case 0xCE: { const ad = rd16(); mem[ad] = (mem[ad] - 1) & 0xFF; pc += 2; break; }
      case 0xEE: { const ad = rd16(); mem[ad] = (mem[ad] + 1) & 0xFF; pc += 2; break; }
      case 0x29: a &= mem[pc++]; break;
      case 0x49: a ^= mem[pc++]; break;
      default: throw new Error("unexpected opcode $" + op.toString(16));
    }
  }
  return mem;
}

const VX = 0x0340, VY = 0x0341, FIRE = 0x0342;
// active-low bits: 0 up, 1 down, 2 left, 3 right, 4 fire
const joy = (bits) => 0xFF & ~bits;

test("variable mode writes -1/0/+1 per axis and the fire flag", () => {
  const j = loadJoy();
  const code = j.varBytes(2, VX, VY, FIRE);
  assert.equal(code.length, j.size({ joyPort: "2", joyVarX: "vx", joyVarY: "vy", joyVarFire: "fire" }));
  const cases = [
    [0, 0, 0, 0], [1, 0, 0xFF, 0], [2, 0, 1, 0], [4, 0xFF, 0, 0], [8, 1, 0, 0],
    [1 | 8, 1, 0xFF, 0], [16, 0, 0, 1], [2 | 4 | 16, 0xFF, 1, 1],
  ];
  for (const [bits, vx, vy, fire] of cases) {
    const mem = run(code, joy(bits), 0xFF);
    assert.deepEqual([mem[VX], mem[VY], mem[FIRE]], [vx, vy, fire], "bits " + bits);
  }
});

test("port 3 reads both ports, port 1 only $DC01", () => {
  const j = loadJoy();
  assert.equal(run(j.varBytes(3, VX, VY), 0xFF, joy(8))[VX], 1);
  assert.equal(run(j.varBytes(3, VX, VY), joy(4), 0xFF)[VX], 0xFF);
  assert.equal(run(j.varBytes(1, VX, VY), joy(4), 0xFF)[VX], 0);
  assert.equal(run(j.varBytes(1, VX, VY), 0xFF, joy(4))[VX], 0xFF);
});

test("sizes: sprite mode 27 (+3 for port 3), variable mode 35 / 42 with fire", () => {
  const j = loadJoy();
  assert.equal(j.size({ joyPort: "2", joySpriteNum: "0" }), 27);
  assert.equal(j.size({ joyPort: "3", joySpriteNum: "0" }), 30);
  assert.equal(j.size({ joyPort: "2", joyVarX: "vx", joyVarY: "vy" }), 35);
  assert.equal(j.size({ joyPort: "3", joyVarX: "vx", joyVarY: "vy", joyVarFire: "f" }), 45);
  assert.equal(j.isVar({ joyVarX: "", joyVarY: "" }), false);
});
