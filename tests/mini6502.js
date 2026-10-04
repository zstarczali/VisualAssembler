// Test helper: a two-pass assembler for the subset of Visual Assembler syntax
// the generated players use, and a 6502 CPU (official opcodes) to run them.

const OPS = {
  ADC: { imm: 0x69, zp: 0x65, zpx: 0x75, abs: 0x6D, abx: 0x7D, aby: 0x79, izx: 0x61, izy: 0x71 },
  AND: { imm: 0x29, zp: 0x25, zpx: 0x35, abs: 0x2D, abx: 0x3D, aby: 0x39, izx: 0x21, izy: 0x31 },
  ASL: { acc: 0x0A, zp: 0x06, zpx: 0x16, abs: 0x0E, abx: 0x1E },
  BCC: { rel: 0x90 }, BCS: { rel: 0xB0 }, BEQ: { rel: 0xF0 }, BMI: { rel: 0x30 },
  BNE: { rel: 0xD0 }, BPL: { rel: 0x10 }, BVC: { rel: 0x50 }, BVS: { rel: 0x70 },
  BIT: { zp: 0x24, abs: 0x2C }, BRK: { imp: 0x00 },
  CLC: { imp: 0x18 }, CLD: { imp: 0xD8 }, CLI: { imp: 0x58 }, CLV: { imp: 0xB8 },
  CMP: { imm: 0xC9, zp: 0xC5, zpx: 0xD5, abs: 0xCD, abx: 0xDD, aby: 0xD9, izx: 0xC1, izy: 0xD1 },
  CPX: { imm: 0xE0, zp: 0xE4, abs: 0xEC }, CPY: { imm: 0xC0, zp: 0xC4, abs: 0xCC },
  DEC: { zp: 0xC6, zpx: 0xD6, abs: 0xCE, abx: 0xDE }, DEX: { imp: 0xCA }, DEY: { imp: 0x88 },
  EOR: { imm: 0x49, zp: 0x45, zpx: 0x55, abs: 0x4D, abx: 0x5D, aby: 0x59, izx: 0x41, izy: 0x51 },
  INC: { zp: 0xE6, zpx: 0xF6, abs: 0xEE, abx: 0xFE }, INX: { imp: 0xE8 }, INY: { imp: 0xC8 },
  JMP: { abs: 0x4C, ind: 0x6C }, JSR: { abs: 0x20 },
  LDA: { imm: 0xA9, zp: 0xA5, zpx: 0xB5, abs: 0xAD, abx: 0xBD, aby: 0xB9, izx: 0xA1, izy: 0xB1 },
  LDX: { imm: 0xA2, zp: 0xA6, zpy: 0xB6, abs: 0xAE, aby: 0xBE },
  LDY: { imm: 0xA0, zp: 0xA4, zpx: 0xB4, abs: 0xAC, abx: 0xBC },
  LSR: { acc: 0x4A, zp: 0x46, zpx: 0x56, abs: 0x4E, abx: 0x5E }, NOP: { imp: 0xEA },
  ORA: { imm: 0x09, zp: 0x05, zpx: 0x15, abs: 0x0D, abx: 0x1D, aby: 0x19, izx: 0x01, izy: 0x11 },
  PHA: { imp: 0x48 }, PHP: { imp: 0x08 }, PLA: { imp: 0x68 }, PLP: { imp: 0x28 },
  ROL: { acc: 0x2A, zp: 0x26, zpx: 0x36, abs: 0x2E, abx: 0x3E },
  ROR: { acc: 0x6A, zp: 0x66, zpx: 0x76, abs: 0x6E, abx: 0x7E },
  RTI: { imp: 0x40 }, RTS: { imp: 0x60 },
  SBC: { imm: 0xE9, zp: 0xE5, zpx: 0xF5, abs: 0xED, abx: 0xFD, aby: 0xF9, izx: 0xE1, izy: 0xF1 },
  SEC: { imp: 0x38 }, SED: { imp: 0xF8 }, SEI: { imp: 0x78 },
  STA: { zp: 0x85, zpx: 0x95, abs: 0x8D, abx: 0x9D, aby: 0x99, izx: 0x81, izy: 0x91 },
  STX: { zp: 0x86, zpy: 0x96, abs: 0x8E }, STY: { zp: 0x84, zpx: 0x94, abs: 0x8C },
  TAX: { imp: 0xAA }, TAY: { imp: 0xA8 }, TSX: { imp: 0xBA }, TXA: { imp: 0x8A }, TXS: { imp: 0x9A }, TYA: { imp: 0x98 },
};
const SIZE = { imp: 1, acc: 1, imm: 2, zp: 2, zpx: 2, zpy: 2, izx: 2, izy: 2, rel: 2, abs: 3, abx: 3, aby: 3, ind: 3 };

/* Assembles into a 64 KB image. Returns { mem, labels }. Throws on unknown
   labels, out-of-range branches and unsupported addressing modes. */
function assemble(src) {
  const lines = String(src).split("\n").map((l) => l.replace(/;.*$/, "").trim()).filter(Boolean);
  const value = (expr, labels, pass) => {
    let e = expr.trim(), part = null;
    if (e[0] === "<" || e[0] === ">") { part = e[0]; e = e.slice(1).trim(); }
    let v = 0;
    for (const term of e.split("+")) {
      const t = term.trim();
      if (/^\$[0-9A-Fa-f]+$/.test(t)) v += parseInt(t.slice(1), 16);
      else if (/^\d+$/.test(t)) v += parseInt(t, 10);
      else if (Object.prototype.hasOwnProperty.call(labels, t)) v += labels[t];
      else if (pass === 2) throw new Error("unknown label " + t);
    }
    v &= 0xFFFF;
    return part === "<" ? v & 0xFF : part === ">" ? v >> 8 : v;
  };
  const isZpLiteral = (e) => /^\$[0-9A-Fa-f]{1,2}$/.test(e.trim());
  const parse = (mn, op) => {
    if (!op) return { mode: OPS[mn].acc !== undefined ? "acc" : "imp" };
    if (op[0] === "#") return { mode: "imm", expr: op.slice(1) };
    let m = op.match(/^\((.+)\),\s*Y$/i);
    if (m) return { mode: "izy", expr: m[1] };
    m = op.match(/^\((.+),\s*X\)$/i);
    if (m) return { mode: "izx", expr: m[1] };
    m = op.match(/^\((.+)\)$/);
    if (m) return { mode: "ind", expr: m[1] };
    if (OPS[mn].rel !== undefined) return { mode: "rel", expr: op };
    m = op.match(/^(.+),\s*([XY])$/i);
    if (m) {
      const zp = isZpLiteral(m[1]);
      const idx = m[2].toUpperCase();
      return { mode: (zp ? "zp" : "ab") + (idx === "X" ? "x" : "y"), expr: m[1] };
    }
    return { mode: isZpLiteral(op) ? "zp" : "abs", expr: op };
  };
  const mem = new Uint8Array(65536);
  let labels = {};
  for (let pass = 1; pass <= 2; pass++) {
    let pc = 0;
    for (const line of lines) {
      let m = line.match(/^\*\s*=\s*(.+)$/);
      if (m) { pc = value(m[1], labels, pass); continue; }
      m = line.match(/^([A-Za-z_][A-Za-z0-9_]*):$/);
      if (m) { if (pass === 1) labels[m[1]] = pc; continue; }
      m = line.match(/^\.byte\s+(.+)$/i);
      if (m) {
        for (const b of m[1].split(",")) { if (pass === 2) mem[pc] = value(b, labels, pass) & 0xFF; pc++; }
        continue;
      }
      m = line.match(/^([A-Za-z]{3})(?:\s+(.+))?$/);
      if (!m || !OPS[m[1].toUpperCase()]) throw new Error("cannot assemble: " + line);
      const mn = m[1].toUpperCase();
      let { mode, expr } = parse(mn, m[2] ? m[2].trim() : "");
      if (mode === "zpy" && OPS[mn].zpy === undefined) mode = "aby";
      if (mode === "zpx" && OPS[mn].zpx === undefined) mode = "abx";
      if (mode === "zp" && OPS[mn].zp === undefined) mode = "abs";
      const opc = OPS[mn][mode];
      if (opc === undefined) throw new Error("mode " + mode + " not available: " + line);
      if (pass === 2) {
        mem[pc] = opc;
        if (mode === "rel") {
          const off = value(expr, labels, pass) - (pc + 2);
          if (off < -128 || off > 127) throw new Error("branch out of range: " + line);
          mem[pc + 1] = off & 0xFF;
        } else if (SIZE[mode] === 2) {
          mem[pc + 1] = value(expr, labels, pass) & 0xFF;
        } else if (SIZE[mode] === 3) {
          const v = value(expr, labels, pass);
          mem[pc + 1] = v & 0xFF; mem[pc + 2] = v >> 8;
        }
      }
      pc += SIZE[mode];
    }
  }
  return { mem, labels };
}

const MODE_OF = {};
for (const [mn, modes] of Object.entries(OPS)) for (const [mode, opc] of Object.entries(modes)) MODE_OF[opc] = [mn, mode];

function cpu(mem) {
  const c = { a: 0, x: 0, y: 0, sp: 0xFD, pc: 0, n: 0, v: 0, d: 0, i: 1, z: 0, cf: 0, mem };
  const rd = (ad) => mem[ad & 0xFFFF];
  const wr = (ad, v) => { mem[ad & 0xFFFF] = v & 0xFF; };
  const push = (v) => { wr(0x100 + c.sp, v); c.sp = (c.sp - 1) & 0xFF; };
  const pop = () => { c.sp = (c.sp + 1) & 0xFF; return rd(0x100 + c.sp); };
  const nz = (v) => { v &= 0xFF; c.n = v >> 7; c.z = v === 0 ? 1 : 0; return v; };
  const flags = () => (c.n << 7) | (c.v << 6) | 0x20 | (c.d << 3) | (c.i << 2) | (c.z << 1) | c.cf;
  const setFlags = (p) => { c.n = (p >> 7) & 1; c.v = (p >> 6) & 1; c.d = (p >> 3) & 1; c.i = (p >> 2) & 1; c.z = (p >> 1) & 1; c.cf = p & 1; };
  const adc = (v) => {
    const r = c.a + v + c.cf;
    c.v = (~(c.a ^ v) & (c.a ^ r) & 0x80) ? 1 : 0;
    c.cf = r > 0xFF ? 1 : 0;
    c.a = nz(r);
  };
  const cmp = (reg, v) => { c.cf = reg >= v ? 1 : 0; nz(reg - v); };
  c.step = () => {
    const opc = rd(c.pc);
    const info = MODE_OF[opc];
    if (!info) throw new Error("illegal opcode $" + opc.toString(16) + " at $" + c.pc.toString(16));
    const [mn, mode] = info;
    const pc0 = c.pc;
    c.pc = (c.pc + SIZE[mode]) & 0xFFFF;
    const b1 = rd(pc0 + 1), w = b1 | (rd(pc0 + 2) << 8);
    let ad = null;
    switch (mode) {
      case "zp": ad = b1; break;
      case "zpx": ad = (b1 + c.x) & 0xFF; break;
      case "zpy": ad = (b1 + c.y) & 0xFF; break;
      case "abs": ad = w; break;
      case "abx": ad = (w + c.x) & 0xFFFF; break;
      case "aby": ad = (w + c.y) & 0xFFFF; break;
      case "izx": { const p = (b1 + c.x) & 0xFF; ad = rd(p) | (rd((p + 1) & 0xFF) << 8); break; }
      case "izy": ad = ((rd(b1) | (rd((b1 + 1) & 0xFF) << 8)) + c.y) & 0xFFFF; break;
      case "ind": ad = rd(w) | (rd((w & 0xFF00) | ((w + 1) & 0xFF)) << 8); break;
    }
    const val = () => (mode === "imm" ? b1 : rd(ad));
    const rmw = (fn) => {
      if (mode === "acc") c.a = fn(c.a); else wr(ad, fn(rd(ad)));
    };
    const branch = (cond) => { if (cond) c.pc = (c.pc + ((b1 ^ 0x80) - 0x80)) & 0xFFFF; };
    switch (mn) {
      case "ADC": adc(val()); break;
      case "SBC": adc(val() ^ 0xFF); break;
      case "AND": c.a = nz(c.a & val()); break;
      case "ORA": c.a = nz(c.a | val()); break;
      case "EOR": c.a = nz(c.a ^ val()); break;
      case "ASL": rmw((v) => { c.cf = v >> 7; return nz(v << 1); }); break;
      case "LSR": rmw((v) => { c.cf = v & 1; return nz(v >> 1); }); break;
      case "ROL": rmw((v) => { const r = (v << 1) | c.cf; c.cf = v >> 7; return nz(r); }); break;
      case "ROR": rmw((v) => { const r = (v >> 1) | (c.cf << 7); c.cf = v & 1; return nz(r); }); break;
      case "BCC": branch(!c.cf); break; case "BCS": branch(c.cf); break;
      case "BEQ": branch(c.z); break; case "BNE": branch(!c.z); break;
      case "BMI": branch(c.n); break; case "BPL": branch(!c.n); break;
      case "BVC": branch(!c.v); break; case "BVS": branch(c.v); break;
      case "BIT": { const v = val(); c.z = (c.a & v) === 0 ? 1 : 0; c.n = v >> 7; c.v = (v >> 6) & 1; break; }
      case "BRK": throw new Error("BRK at $" + pc0.toString(16));
      case "CLC": c.cf = 0; break; case "CLD": c.d = 0; break; case "CLI": c.i = 0; break; case "CLV": c.v = 0; break;
      case "SEC": c.cf = 1; break; case "SED": c.d = 1; break; case "SEI": c.i = 1; break;
      case "CMP": cmp(c.a, val()); break; case "CPX": cmp(c.x, val()); break; case "CPY": cmp(c.y, val()); break;
      case "DEC": rmw((v) => nz(v - 1)); break; case "INC": rmw((v) => nz(v + 1)); break;
      case "DEX": c.x = nz(c.x - 1); break; case "DEY": c.y = nz(c.y - 1); break;
      case "INX": c.x = nz(c.x + 1); break; case "INY": c.y = nz(c.y + 1); break;
      case "JMP": c.pc = ad; break;
      case "JSR": { const r = (pc0 + 2) & 0xFFFF; push(r >> 8); push(r & 0xFF); c.pc = ad; break; }
      case "RTS": { const lo = pop(); c.pc = ((pop() << 8) | lo) + 1 & 0xFFFF; break; }
      case "RTI": { setFlags(pop()); const lo = pop(); c.pc = (pop() << 8) | lo; break; }
      case "LDA": c.a = nz(val()); break; case "LDX": c.x = nz(val()); break; case "LDY": c.y = nz(val()); break;
      case "STA": wr(ad, c.a); break; case "STX": wr(ad, c.x); break; case "STY": wr(ad, c.y); break;
      case "NOP": break;
      case "PHA": push(c.a); break; case "PHP": push(flags() | 0x10); break;
      case "PLA": c.a = nz(pop()); break; case "PLP": setFlags(pop()); break;
      case "TAX": c.x = nz(c.a); break; case "TAY": c.y = nz(c.a); break; case "TSX": c.x = nz(c.sp); break;
      case "TXA": c.a = nz(c.x); break; case "TXS": c.sp = c.x; break; case "TYA": c.a = nz(c.y); break;
    }
  };
  /* JSR addr and run until it returns (cycle-free: counts instructions). */
  c.call = (addr, maxSteps = 200000) => {
    const ret = 0xFFF0;
    push((ret - 1) >> 8); push((ret - 1) & 0xFF);
    c.pc = addr;
    for (let k = 0; k < maxSteps; k++) {
      if (c.pc === ret) return k;
      c.step();
    }
    throw new Error("routine did not return");
  };
  return c;
}

module.exports = { assemble, cpu };
