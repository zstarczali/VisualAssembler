//! Cycle-exact NMOS 6510 core, a Rust port of VICE's x64sc CPU emulation
//! (`6510dtvcore.c`, `mainc64cpu.c`, `c64/c64cpusc.c` and the interrupt timing
//! of `interrupt.h`, VICE 3.10). VICE is Copyright © the VICE Team, GPL v2 or
//! later; see https://vice-emu.sourceforge.io/ — this port is distributed with
//! Visual Assembler under the GPL v3.
//!
//! Every bus access is one cycle: `read` / `write` (or their dummy forms) and
//! then `Bus::tick(1)`, in the order of the real 6510 — including the dummy
//! reads of indexed addressing, the double write of read-modify-write
//! instructions and the stack peeks. Interrupts follow VICE: an IRQ / NMI is
//! taken at an instruction boundary once its line has been active for
//! `INTERRUPT_DELAY` (2) cycles, a taken branch without a page crossing adds
//! one cycle, CLI / PLP let one more instruction run, SEI / PLP setting I still
//! let a pending IRQ through, a released IRQ stays pending for 3 cycles, an
//! NMI during the IRQ / BRK sequence hijacks its vector, and BRK delays an NMI
//! by one instruction. While `Bus::ba_low` is true (VIC-II bad lines, sprite
//! DMA) reads wait; writes do not.

pub trait Bus {
    /// One bus read cycle (the CPU calls `tick(1)` afterwards).
    fn read(&mut self, address: u16) -> u8;
    /// One bus write cycle.
    fn write(&mut self, address: u16, value: u8);
    /// A read whose value the CPU ignores (still a real bus cycle on the 6510).
    fn read_dummy(&mut self, address: u16) -> u8 {
        self.read(address)
    }
    /// The first (unmodified) write of a read-modify-write instruction.
    fn write_dummy(&mut self, address: u16, value: u8) {
        self.write(address, value)
    }
    /// Advances every chip on the bus by `cycles` CPU cycles.
    fn tick(&mut self, cycles: u32);
    /// IRQ line level (active = true).
    fn irq(&self) -> bool;
    /// NMI line level (active = true); the CPU reacts to its rising edge.
    fn nmi(&self) -> bool;
    /// BA low: the VIC-II takes the bus, CPU reads have to wait.
    fn ba_low(&self) -> bool {
        false
    }
}

pub const C: u8 = 0x01;
pub const Z: u8 = 0x02;
pub const I: u8 = 0x04;
pub const D: u8 = 0x08;
pub const B: u8 = 0x10;
pub const U: u8 = 0x20;
pub const V: u8 = 0x40;
pub const N: u8 = 0x80;

/// Cycles between an interrupt request and the earliest instruction boundary
/// that may take it (VICE `INTERRUPT_DELAY`).
const INTERRUPT_DELAY: u64 = 2;
/// VICE ANE / LXA "magic" constants (and their forms on an RDY cycle).
const ANE_MAGIC: u8 = 0xef;
const ANE_RDY_MAGIC: u8 = 0xee & ANE_MAGIC;
const LXA_MAGIC: u8 = 0xee;
const LXA_RDY_MAGIC: u8 = 0xee;

/// Opcodes whose operand word (p2) is fetched with the opcode (VICE `fetch_tab`).
#[rustfmt::skip]
const FETCH_TAB: [bool; 256] = {
    let mut t = [false; 256];
    let mut op = 0;
    while op < 256 {
        let low = op & 0x1f;
        // absolute ($x C-F) and absolute,Y ($x9 / $xB in odd rows)
        t[op] = (low >= 0x0c && low <= 0x0f) || (low >= 0x1c) || low == 0x19 || low == 0x1b;
        op += 1;
    }
    t[0x20] = false; // JSR fetches its high byte itself, after the pushes
    t
};

/// What the last executed opcode means for interrupt timing (VICE OPINFO).
#[derive(Clone, Copy, Default)]
struct OpInfo {
    number: u8,
    /// A taken branch without a page crossing: interrupts wait one more cycle.
    delays: bool,
    /// SEI / PLP set I this instruction: a pending IRQ is still taken.
    disables: bool,
    /// CLI / PLP cleared I: the IRQ waits one instruction. Also VICE's signal
    /// that cycles were stolen inside ANE / LXA / SHA / SHX / SHY / SHS / CLI.
    enables: bool,
}

pub struct Cpu {
    pub a: u8,
    pub x: u8,
    pub y: u8,
    pub sp: u8,
    pub p: u8,
    pub pc: u16,
    pub jammed: bool,
    /// CPU clock (cycles since creation).
    pub clk: u64,
    op: OpInfo,
    /// Last sampled line levels.
    irq_line: bool,
    nmi_line: bool,
    /// VICE IK_IRQ, IK_IRQPEND, IK_NMI.
    irq_flag: bool,
    irq_pend: bool,
    nmi_flag: bool,
    irq_clk: u64,
    nmi_clk: u64,
    irq_delay: u64,
    nmi_delay: u64,
    irq_pending_clk: u64,
    /// Set during the BA-checked dummy read of SHA / SHX / SHY / SHS.
    check_ba_low: bool,
    /// Opcode that jammed the CPU.
    jam_opcode: u8,
}

impl Cpu {
    pub fn new(pc: u16) -> Self {
        Self {
            a: 0,
            x: 0,
            y: 0,
            sp: 0xfd,
            p: U | I,
            pc,
            jammed: false,
            clk: 0,
            op: OpInfo::default(),
            irq_line: false,
            nmi_line: false,
            irq_flag: false,
            irq_pend: false,
            nmi_flag: false,
            irq_clk: 0,
            nmi_clk: 0,
            irq_delay: 0,
            nmi_delay: 0,
            irq_pending_clk: u64::MAX,
            check_ba_low: false,
            jam_opcode: 0,
        }
    }

    /// RESET: I set, PC from $FFFC (VICE reads the vector without bus cycles).
    #[allow(dead_code)] // the SID player starts the CPU at a given address
    pub fn reset(&mut self, bus: &mut dyn Bus) {
        self.jammed = false;
        self.irq_flag = false;
        self.irq_pend = false;
        self.nmi_flag = false;
        self.irq_pending_clk = u64::MAX;
        self.p |= I;
        self.pc = u16::from_le_bytes([bus.read(0xfffc), bus.read(0xfffd)]);
    }

    pub fn set_interrupt_disable(&mut self, disabled: bool) {
        if disabled {
            self.p |= I;
        } else {
            self.p &= !I;
        }
    }

    /// Writes a byte to the stack without a bus cycle (for drivers that set up
    /// a call by hand).
    pub fn push(&mut self, bus: &mut dyn Bus, value: u8) {
        bus.write(0x0100 | u16::from(self.sp), value);
        self.sp = self.sp.wrapping_sub(1);
    }

    /// Samples the IRQ / NMI lines (VICE: the interrupt sources call
    /// `interrupt_set_irq` / `_nmi` at this clock).
    pub fn poll(&mut self, bus: &dyn Bus) {
        let irq = bus.irq();
        if irq && !self.irq_line {
            self.irq_flag = true;
            self.irq_pend = true;
            self.irq_pending_clk = u64::MAX;
            self.irq_delay = 0;
            self.irq_clk = self.clk;
        } else if !irq && self.irq_line {
            self.irq_flag = false;
            self.irq_pending_clk = self.clk + 3;
        }
        self.irq_line = irq;
        let nmi = bus.nmi();
        if nmi && !self.nmi_line && !self.nmi_flag {
            self.nmi_flag = true;
            self.nmi_delay = 0;
            self.nmi_clk = self.clk;
        }
        self.nmi_line = nmi;
    }

    /// One cycle in which the CPU does not use the bus (a driver idling the
    /// CPU); interrupt latency keeps counting.
    pub fn idle(&mut self, bus: &mut dyn Bus, cycles: u32) {
        for _ in 0..cycles {
            self.clk_inc(bus);
        }
    }

    /// True when the next `step` takes an interrupt (call `poll` first).
    pub fn interrupt_ready(&self) -> bool {
        if self.jammed {
            return false;
        }
        if self.nmi_flag && self.nmi_due() {
            return true;
        }
        (self.irq_flag || self.irq_pend) && (self.p & I == 0 || self.op.disables) && self.irq_due() && !self.op.enables
    }

    /// VICE `CLK_INC`: interrupt latency counters, then one machine cycle.
    fn clk_inc(&mut self, bus: &mut dyn Bus) {
        self.poll(bus);
        if self.irq_clk <= self.clk {
            self.irq_delay += 1;
        }
        if self.nmi_clk <= self.clk {
            self.nmi_delay += 1;
        }
        bus.tick(1);
        self.clk += 1;
    }

    /// VICE `check_ba` / `maincpu_steal_cycles`: wait while BA is low, then the
    /// per-opcode fixups VICE makes for cycles stolen inside an instruction.
    fn check_ba(&mut self, bus: &mut dyn Bus) {
        if !bus.ba_low() {
            return;
        }
        // VICE `vicii_steal_cycles`: the clock runs on, the interrupt latency
        // counters do not (they are fixed up below)
        while bus.ba_low() {
            self.poll(bus);
            bus.tick(1);
            self.clk += 1;
        }
        self.poll(bus);
        match self.op.number {
            0x93 | 0x9b | 0x9c | 0x9e | 0x9f => {
                if self.check_ba_low {
                    self.op.enables = true;
                }
            }
            0x8b | 0xab | 0x58 => self.op.enables = true,
            _ => {}
        }
        if self.op.number != 0x78 && self.irq_delay == 0 && self.irq_clk < self.clk {
            self.irq_delay += 1;
        }
        if self.nmi_delay == 0 && self.nmi_clk < self.clk {
            self.nmi_delay += 1;
        }
    }

    // ── bus cycles (VICE LOAD / LOAD_DUMMY / STORE / STORE_DUMMY + CLK_INC) ──

    fn load(&mut self, bus: &mut dyn Bus, address: u16) -> u8 {
        self.check_ba(bus);
        let value = bus.read(address);
        self.clk_inc(bus);
        value
    }

    fn load_dummy(&mut self, bus: &mut dyn Bus, address: u16) {
        self.check_ba(bus);
        bus.read_dummy(address);
        self.clk_inc(bus);
    }

    fn store(&mut self, bus: &mut dyn Bus, address: u16, value: u8) {
        bus.write(address, value);
        self.clk_inc(bus);
    }

    fn store_dummy(&mut self, bus: &mut dyn Bus, address: u16, value: u8) {
        bus.write_dummy(address, value);
        self.clk_inc(bus);
    }

    fn push_cycle(&mut self, bus: &mut dyn Bus, value: u8) {
        bus.write(0x0100 | u16::from(self.sp), value);
        self.sp = self.sp.wrapping_sub(1);
        self.clk_inc(bus);
    }

    fn pull_cycle(&mut self, bus: &mut dyn Bus) -> u8 {
        self.sp = self.sp.wrapping_add(1);
        self.load(bus, 0x0100 | u16::from(self.sp))
    }

    fn stack_peek(&mut self, bus: &mut dyn Bus) {
        self.load_dummy(bus, 0x0100 | u16::from(self.sp));
    }

    // ── interrupts (VICE DO_INTERRUPT / DO_IRQBRK) ──

    fn nmi_due(&self) -> bool {
        // BRK (and the interrupt sequence itself, which leaves opcode 0)
        // delays the NMI by one opcode
        if self.op.number == 0x00 {
            return false;
        }
        self.nmi_delay >= INTERRUPT_DELAY + u64::from(self.op.delays)
    }

    fn irq_due(&self) -> bool {
        self.irq_delay >= INTERRUPT_DELAY + u64::from(self.op.delays)
    }

    fn status(&self) -> u8 {
        self.p | U
    }

    /// The IRQ / BRK sequence after the two dummy reads (or BRK's fetches):
    /// push PC and P, then the vector — $FFFA instead of $FFFE if an NMI is
    /// due by now.
    fn irq_brk(&mut self, bus: &mut dyn Bus) {
        let mut vector = 0xfffe;
        self.push_cycle(bus, (self.pc >> 8) as u8);
        self.push_cycle(bus, self.pc as u8);
        let status = self.status();
        self.push_cycle(bus, status);
        self.poll(bus);
        if self.nmi_flag && self.clk >= self.nmi_clk + INTERRUPT_DELAY {
            vector = 0xfffa;
            self.nmi_flag = false;
        }
        self.p |= I;
        let low = self.load(bus, vector);
        let high = self.load(bus, vector + 1);
        self.pc = u16::from_le_bytes([low, high]);
    }

    /// Takes a due interrupt; false if none is due.
    fn do_interrupt(&mut self, bus: &mut dyn Bus) -> bool {
        if self.nmi_flag && self.nmi_due() {
            self.nmi_flag = false;
            self.load_dummy(bus, self.pc);
            self.load_dummy(bus, self.pc);
            self.p &= !B;
            self.push_cycle(bus, (self.pc >> 8) as u8);
            self.push_cycle(bus, self.pc as u8);
            let status = self.status();
            self.push_cycle(bus, status);
            let low = self.load(bus, 0xfffa);
            let high = self.load(bus, 0xfffb);
            self.p |= I;
            self.pc = u16::from_le_bytes([low, high]);
            self.op = OpInfo::default();
            return true;
        }
        if (self.irq_flag || self.irq_pend) && (self.p & I == 0 || self.op.disables) && self.irq_due() {
            if self.op.enables {
                // CLI / PLP just cleared I: one more instruction first
                self.irq_pend = true;
                return false;
            }
            self.irq_pend = false;
            self.irq_pending_clk = u64::MAX;
            self.load_dummy(bus, self.pc);
            self.load_dummy(bus, self.pc);
            self.p &= !B;
            self.irq_brk(bus);
            self.op = OpInfo::default();
            return true;
        }
        false
    }

    /// Takes a due interrupt or executes one instruction; returns the cycles used.
    pub fn step(&mut self, bus: &mut dyn Bus) -> u32 {
        let start = self.clk;
        self.poll(bus);
        if self.jammed {
            // a jammed 6510 serves no interrupts; only RESET recovers it
            self.irq_pend = false;
            self.irq_pending_clk = u64::MAX;
            self.irq_flag = false;
            self.nmi_flag = false;
            self.clk_inc(bus);
            return (self.clk - start) as u32;
        }
        if !self.irq_flag && self.irq_pend && self.irq_pending_clk <= self.clk {
            self.irq_pend = false;
            self.irq_pending_clk = u64::MAX;
        }
        if self.irq_flag || self.irq_pend || self.nmi_flag {
            let taken = self.do_interrupt(bus);
            if !self.irq_flag && self.irq_pend && taken {
                self.irq_pend = false;
            }
            if taken {
                return (self.clk - start) as u32;
            }
        }
        self.execute(bus);
        (self.clk - start) as u32
    }

    // ── flags and ALU (VICE macros) ──

    fn set_nz(&mut self, value: u8) {
        self.p = (self.p & !(N | Z)) | (value & N) | if value == 0 { Z } else { 0 };
    }

    fn flag(&mut self, flag: u8, on: bool) {
        if on {
            self.p |= flag;
        } else {
            self.p &= !flag;
        }
    }

    fn adc(&mut self, value: u8) {
        let a = u32::from(self.a);
        let v = u32::from(value);
        let carry = u32::from(self.p & C);
        let mut tmp;
        if self.p & D != 0 {
            tmp = (a & 0xf) + (v & 0xf) + carry;
            if tmp > 0x9 {
                tmp += 0x6;
            }
            tmp = if tmp <= 0x0f { (tmp & 0xf) + (a & 0xf0) + (v & 0xf0) } else { (tmp & 0xf) + (a & 0xf0) + (v & 0xf0) + 0x10 };
            self.flag(Z, (a + v + carry) & 0xff == 0);
            self.flag(N, tmp & 0x80 != 0);
            self.flag(V, ((a ^ tmp) & 0x80) != 0 && ((a ^ v) & 0x80) == 0);
            if (tmp & 0x1f0) > 0x90 {
                tmp += 0x60;
            }
            self.flag(C, (tmp & 0xff0) > 0xf0);
        } else {
            tmp = v + a + carry;
            self.set_nz(tmp as u8);
            self.flag(V, ((a ^ v) & 0x80) == 0 && ((a ^ tmp) & 0x80) != 0);
            self.flag(C, tmp > 0xff);
        }
        self.a = tmp as u8;
    }

    fn sbc(&mut self, value: u8) {
        let a = u32::from(self.a);
        let src = u32::from(value);
        let borrow = if self.p & C != 0 { 0 } else { 1 };
        let tmp = a.wrapping_sub(src).wrapping_sub(borrow) & 0xffff;
        if self.p & D != 0 {
            let mut tmp_a = (a & 0xf).wrapping_sub(src & 0xf).wrapping_sub(borrow);
            tmp_a = if tmp_a & 0x10 != 0 {
                (tmp_a.wrapping_sub(6) & 0xf) | (a & 0xf0).wrapping_sub(src & 0xf0).wrapping_sub(0x10)
            } else {
                (tmp_a & 0xf) | (a & 0xf0).wrapping_sub(src & 0xf0)
            };
            if tmp_a & 0x100 != 0 {
                tmp_a = tmp_a.wrapping_sub(0x60);
            }
            self.flag(C, tmp < 0x100);
            self.set_nz(tmp as u8);
            self.flag(V, ((a ^ tmp) & 0x80) != 0 && ((a ^ src) & 0x80) != 0);
            self.a = tmp_a as u8;
        } else {
            self.set_nz(tmp as u8);
            self.flag(C, tmp < 0x100);
            self.flag(V, ((a ^ tmp) & 0x80) != 0 && ((a ^ src) & 0x80) != 0);
            self.a = tmp as u8;
        }
    }

    fn compare(&mut self, register: u8, value: u8) {
        let tmp = u32::from(register).wrapping_sub(u32::from(value));
        self.flag(C, tmp < 0x100);
        self.set_nz(tmp as u8);
    }

    fn asl(&mut self, value: u8) -> u8 {
        self.flag(C, value & 0x80 != 0);
        let r = value << 1;
        self.set_nz(r);
        r
    }

    fn lsr(&mut self, value: u8) -> u8 {
        self.flag(C, value & 1 != 0);
        let r = value >> 1;
        self.set_nz(r);
        r
    }

    fn rol(&mut self, value: u8) -> u8 {
        let r = (value << 1) | (self.p & C);
        self.flag(C, value & 0x80 != 0);
        self.set_nz(r);
        r
    }

    fn ror(&mut self, value: u8) -> u8 {
        let r = (value >> 1) | ((self.p & C) << 7);
        self.flag(C, value & 1 != 0);
        self.set_nz(r);
        r
    }

    // ── addressing (VICE GET_* / SET_* / INT_*) ──

    fn zp(&mut self, bus: &mut dyn Bus, p1: u8) -> u8 {
        self.load(bus, u16::from(p1))
    }

    /// $nn,X / $nn,Y effective address after the dummy read of $nn.
    fn zp_i(&mut self, bus: &mut dyn Bus, p1: u8, index: u8) -> u16 {
        self.load_dummy(bus, u16::from(p1));
        u16::from(p1.wrapping_add(index))
    }

    /// $nnnn,X / ,Y effective address: the dummy read from the unfixed page
    /// happens on a page crossing (reads) or always (writes, RMW).
    fn abs_i(&mut self, bus: &mut dyn Bus, p2: u16, index: u8, always: bool) -> u16 {
        let crossed = (p2 & 0xff) + u16::from(index) > 0xff;
        if always || crossed {
            self.load_dummy(bus, (p2.wrapping_add(u16::from(index)) & 0xff) | (p2 & 0xff00));
        }
        p2.wrapping_add(u16::from(index))
    }

    /// ($nn,X) effective address.
    fn ind_x(&mut self, bus: &mut dyn Bus, p1: u8) -> u16 {
        self.load_dummy(bus, u16::from(p1));
        let pointer = p1.wrapping_add(self.x);
        let low = self.load(bus, u16::from(pointer));
        let high = self.load(bus, u16::from(pointer.wrapping_add(1)));
        u16::from_le_bytes([low, high])
    }

    /// ($nn),Y base address (the pointer), before indexing.
    fn ind_y_base(&mut self, bus: &mut dyn Bus, p1: u8) -> u16 {
        let low = self.load(bus, u16::from(p1));
        let high = self.load(bus, u16::from(p1.wrapping_add(1)));
        u16::from_le_bytes([low, high])
    }

    /// ($nn),Y effective address with the dummy read (page crossing / always).
    fn ind_y(&mut self, bus: &mut dyn Bus, p1: u8, always: bool) -> u16 {
        let base = self.ind_y_base(bus, p1);
        if always || (base & 0xff) + u16::from(self.y) > 0xff {
            self.load_dummy(bus, (base & 0xff00) | (base.wrapping_add(u16::from(self.y)) & 0xff));
        }
        base.wrapping_add(u16::from(self.y))
    }

    /// Read-modify-write on memory: dummy write of the old value, then the new one.
    fn rmw(&mut self, bus: &mut dyn Bus, address: u16, op: fn(&mut Self, u8) -> u8) -> u8 {
        let old = self.load(bus, address);
        let new = op(self, old);
        self.store_dummy(bus, address, old);
        self.store(bus, address, new);
        new
    }

    /// SHA / SHX / SHY / SHS store (VICE SET_ABS_SH_I): `value & (high + 1)`,
    /// unless cycles were stolen right before the write; on a page crossing the
    /// high byte of the address is replaced by the stored value.
    fn store_sh(&mut self, bus: &mut dyn Bus, base: u16, reg_and: u8, index: u8) {
        let tmp3 = reg_and & ((base >> 8) as u8).wrapping_add(1);
        let value = if self.op.enables {
            self.op.enables = false;
            reg_and
        } else {
            tmp3
        };
        let mut address = base.wrapping_add(u16::from(index));
        if (base & 0xff) + u16::from(index) > 0xff {
            address = (address & 0xff) | (u16::from(tmp3) << 8);
        }
        self.store(bus, address, value);
    }

    /// The SH* dummy read, during which a BA stall is remembered.
    fn load_check_ba_low_dummy(&mut self, bus: &mut dyn Bus, address: u16) {
        self.check_ba_low = true;
        self.load_dummy(bus, address);
        self.check_ba_low = false;
    }

    fn branch(&mut self, bus: &mut dyn Bus, p1: u8, taken: bool) {
        self.pc = self.pc.wrapping_add(2);
        if taken {
            let dest = self.pc.wrapping_add(p1 as i8 as u16);
            self.load_dummy(bus, self.pc);
            if (self.pc ^ dest) & 0xff00 != 0 {
                self.load_dummy(bus, (self.pc & 0xff00) | (dest & 0xff));
            } else {
                self.op.delays = true;
            }
            self.pc = dest;
        }
    }

    // ── one instruction (VICE FETCH_OPCODE + the opcode switch) ──

    fn execute(&mut self, bus: &mut dyn Bus) {
        // opcode, p1 and (for 3-byte opcodes) p2 are fetched first
        self.check_ba(bus);
        let mut opcode = bus.read(self.pc);
        self.op = OpInfo { number: opcode, ..OpInfo::default() };
        self.clk_inc(bus);
        let p1 = self.load(bus, self.pc.wrapping_add(1));
        let mut p2 = u16::from(p1);
        if FETCH_TAB[opcode as usize] {
            p2 |= u16::from(self.load(bus, self.pc.wrapping_add(2))) << 8;
        }
        if self.jammed {
            opcode = self.jam_opcode;
        }
        let pc = self.pc;
        // operand helpers in VICE's style: `pc_inc` is applied before writes
        macro_rules! inc {
            ($n:expr) => {
                self.pc = pc.wrapping_add($n)
            };
        }
        macro_rules! read_op {
            // value of a read instruction for every addressing mode
            (imm) => {{ inc!(2); p1 }};
            (zp) => {{ let v = self.zp(bus, p1); inc!(2); v }};
            (zpx) => {{ let ad = self.zp_i(bus, p1, self.x); let v = self.load(bus, ad); inc!(2); v }};
            (zpy) => {{ let ad = self.zp_i(bus, p1, self.y); let v = self.load(bus, ad); inc!(2); v }};
            (abs) => {{ let v = self.load(bus, p2); inc!(3); v }};
            (abx) => {{ let ad = self.abs_i(bus, p2, self.x, false); let v = self.load(bus, ad); inc!(3); v }};
            (aby) => {{ let ad = self.abs_i(bus, p2, self.y, false); let v = self.load(bus, ad); inc!(3); v }};
            (izx) => {{ let ad = self.ind_x(bus, p1); let v = self.load(bus, ad); inc!(2); v }};
            (izy) => {{ let ad = self.ind_y(bus, p1, false); let v = self.load(bus, ad); inc!(2); v }};
        }
        macro_rules! write_op {
            (zp, $v:expr) => {{ let v = $v; inc!(2); self.store(bus, u16::from(p1), v); }};
            (zpx, $v:expr) => {{ let v = $v; inc!(2); let ad = self.zp_i(bus, p1, self.x); self.store(bus, ad, v); }};
            (zpy, $v:expr) => {{ let v = $v; inc!(2); let ad = self.zp_i(bus, p1, self.y); self.store(bus, ad, v); }};
            (abs, $v:expr) => {{ let v = $v; inc!(3); self.store(bus, p2, v); }};
            (abx, $v:expr) => {{ let v = $v; inc!(3); let ad = self.abs_i(bus, p2, self.x, true); self.store(bus, ad, v); }};
            (aby, $v:expr) => {{ let v = $v; inc!(3); let ad = self.abs_i(bus, p2, self.y, true); self.store(bus, ad, v); }};
            (izx, $v:expr) => {{ let v = $v; inc!(2); let ad = self.ind_x(bus, p1); self.store(bus, ad, v); }};
            (izy, $v:expr) => {{ let v = $v; inc!(2); let ad = self.ind_y(bus, p1, true); self.store(bus, ad, v); }};
        }
        macro_rules! rmw_op {
            // effective address of a read-modify-write instruction, then the op
            (zp, $f:expr) => {{ inc!(2); self.rmw(bus, u16::from(p1), $f) }};
            (zpx, $f:expr) => {{ inc!(2); let ad = self.zp_i(bus, p1, self.x); self.rmw(bus, ad, $f) }};
            (abs, $f:expr) => {{ inc!(3); self.rmw(bus, p2, $f) }};
            (abx, $f:expr) => {{ inc!(3); let ad = self.abs_i(bus, p2, self.x, true); self.rmw(bus, ad, $f) }};
            (aby, $f:expr) => {{ inc!(3); let ad = self.abs_i(bus, p2, self.y, true); self.rmw(bus, ad, $f) }};
            (izx, $f:expr) => {{ inc!(2); let ad = self.ind_x(bus, p1); self.rmw(bus, ad, $f) }};
            (izy, $f:expr) => {{ inc!(2); let ad = self.ind_y(bus, p1, true); self.rmw(bus, ad, $f) }};
        }
        macro_rules! nop_read {
            // NOOPs read their operand like a load, but ignore it
            (zp) => {{ self.load_dummy(bus, u16::from(p1)); inc!(2); }};
            (zpx) => {{ let ad = self.zp_i(bus, p1, self.x); self.load_dummy(bus, ad); inc!(2); }};
            (abs) => {{ self.load_dummy(bus, p2); inc!(3); }};
            (abx) => {{ let ad = self.abs_i(bus, p2, self.x, false); self.load_dummy(bus, ad); inc!(3); }};
        }
        // undocumented RMW + ALU combinations
        let slo = |cpu: &mut Self, v: u8| { let r = cpu.asl(v); cpu.a |= r; cpu.set_nz(cpu.a); r };
        let rla = |cpu: &mut Self, v: u8| { let r = cpu.rol(v); cpu.a &= r; cpu.set_nz(cpu.a); r };
        let sre = |cpu: &mut Self, v: u8| { let r = cpu.lsr(v); cpu.a ^= r; cpu.set_nz(cpu.a); r };
        let rra = |cpu: &mut Self, v: u8| { let r = cpu.ror(v); cpu.adc(r); r };
        let dcp = |cpu: &mut Self, v: u8| { let r = v.wrapping_sub(1); cpu.compare(cpu.a, r); r };
        let isb = |cpu: &mut Self, v: u8| { let r = v.wrapping_add(1); cpu.sbc(r); r };
        let inc = |cpu: &mut Self, v: u8| { let r = v.wrapping_add(1); cpu.set_nz(r); r };
        let dec = |cpu: &mut Self, v: u8| { let r = v.wrapping_sub(1); cpu.set_nz(r); r };

        match opcode {
            // ── loads ──
            0xa9 => { self.a = read_op!(imm); self.set_nz(self.a); }
            0xa5 => { self.a = read_op!(zp); self.set_nz(self.a); }
            0xb5 => { self.a = read_op!(zpx); self.set_nz(self.a); }
            0xad => { self.a = read_op!(abs); self.set_nz(self.a); }
            0xbd => { self.a = read_op!(abx); self.set_nz(self.a); }
            0xb9 => { self.a = read_op!(aby); self.set_nz(self.a); }
            0xa1 => { self.a = read_op!(izx); self.set_nz(self.a); }
            0xb1 => { self.a = read_op!(izy); self.set_nz(self.a); }
            0xa2 => { self.x = read_op!(imm); self.set_nz(self.x); }
            0xa6 => { self.x = read_op!(zp); self.set_nz(self.x); }
            0xb6 => { self.x = read_op!(zpy); self.set_nz(self.x); }
            0xae => { self.x = read_op!(abs); self.set_nz(self.x); }
            0xbe => { self.x = read_op!(aby); self.set_nz(self.x); }
            0xa0 => { self.y = read_op!(imm); self.set_nz(self.y); }
            0xa4 => { self.y = read_op!(zp); self.set_nz(self.y); }
            0xb4 => { self.y = read_op!(zpx); self.set_nz(self.y); }
            0xac => { self.y = read_op!(abs); self.set_nz(self.y); }
            0xbc => { self.y = read_op!(abx); self.set_nz(self.y); }
            // LAX
            0xa7 => { let v = read_op!(zp); self.a = v; self.x = v; self.set_nz(v); }
            0xb7 => { let v = read_op!(zpy); self.a = v; self.x = v; self.set_nz(v); }
            0xaf => { let v = read_op!(abs); self.a = v; self.x = v; self.set_nz(v); }
            0xbf => { let v = read_op!(aby); self.a = v; self.x = v; self.set_nz(v); }
            0xa3 => { let v = read_op!(izx); self.a = v; self.x = v; self.set_nz(v); }
            0xb3 => { let v = read_op!(izy); self.a = v; self.x = v; self.set_nz(v); }
            // ── stores ──
            0x85 => write_op!(zp, self.a),
            0x95 => write_op!(zpx, self.a),
            0x8d => write_op!(abs, self.a),
            0x9d => write_op!(abx, self.a),
            0x99 => write_op!(aby, self.a),
            0x81 => write_op!(izx, self.a),
            0x91 => write_op!(izy, self.a),
            0x86 => write_op!(zp, self.x),
            0x96 => write_op!(zpy, self.x),
            0x8e => write_op!(abs, self.x),
            0x84 => write_op!(zp, self.y),
            0x94 => write_op!(zpx, self.y),
            0x8c => write_op!(abs, self.y),
            // SAX
            0x87 => write_op!(zp, self.a & self.x),
            0x97 => write_op!(zpy, self.a & self.x),
            0x8f => write_op!(abs, self.a & self.x),
            0x83 => write_op!(izx, self.a & self.x),
            // ── transfers ──
            0xaa => { inc!(1); self.x = self.a; self.set_nz(self.x); }
            0xa8 => { inc!(1); self.y = self.a; self.set_nz(self.y); }
            0x8a => { inc!(1); self.a = self.x; self.set_nz(self.a); }
            0x98 => { inc!(1); self.a = self.y; self.set_nz(self.a); }
            0xba => { inc!(1); self.x = self.sp; self.set_nz(self.x); }
            0x9a => { inc!(1); self.sp = self.x; }
            // ── stack ──
            0x48 => { let a = self.a; self.push_cycle(bus, a); inc!(1); }
            0x08 => { let s = self.status() | B; self.push_cycle(bus, s); inc!(1); }
            0x68 => {
                self.stack_peek(bus);
                self.a = self.pull_cycle(bus);
                self.set_nz(self.a);
                inc!(1);
            }
            0x28 => {
                self.stack_peek(bus);
                let s = self.pull_cycle(bus);
                if s & I == 0 && self.p & I != 0 {
                    self.op.enables = true;
                } else if s & I != 0 && self.p & I == 0 {
                    self.op.disables = true;
                }
                self.p = s;
                inc!(1);
            }
            // ── logic / arithmetic ──
            0x29 => { self.a &= read_op!(imm); self.set_nz(self.a); }
            0x25 => { self.a &= read_op!(zp); self.set_nz(self.a); }
            0x35 => { self.a &= read_op!(zpx); self.set_nz(self.a); }
            0x2d => { self.a &= read_op!(abs); self.set_nz(self.a); }
            0x3d => { self.a &= read_op!(abx); self.set_nz(self.a); }
            0x39 => { self.a &= read_op!(aby); self.set_nz(self.a); }
            0x21 => { self.a &= read_op!(izx); self.set_nz(self.a); }
            0x31 => { self.a &= read_op!(izy); self.set_nz(self.a); }
            0x09 => { self.a |= read_op!(imm); self.set_nz(self.a); }
            0x05 => { self.a |= read_op!(zp); self.set_nz(self.a); }
            0x15 => { self.a |= read_op!(zpx); self.set_nz(self.a); }
            0x0d => { self.a |= read_op!(abs); self.set_nz(self.a); }
            0x1d => { self.a |= read_op!(abx); self.set_nz(self.a); }
            0x19 => { self.a |= read_op!(aby); self.set_nz(self.a); }
            0x01 => { self.a |= read_op!(izx); self.set_nz(self.a); }
            0x11 => { self.a |= read_op!(izy); self.set_nz(self.a); }
            0x49 => { self.a ^= read_op!(imm); self.set_nz(self.a); }
            0x45 => { self.a ^= read_op!(zp); self.set_nz(self.a); }
            0x55 => { self.a ^= read_op!(zpx); self.set_nz(self.a); }
            0x4d => { self.a ^= read_op!(abs); self.set_nz(self.a); }
            0x5d => { self.a ^= read_op!(abx); self.set_nz(self.a); }
            0x59 => { self.a ^= read_op!(aby); self.set_nz(self.a); }
            0x41 => { self.a ^= read_op!(izx); self.set_nz(self.a); }
            0x51 => { self.a ^= read_op!(izy); self.set_nz(self.a); }
            0x69 => { let v = read_op!(imm); self.adc(v); }
            0x65 => { let v = read_op!(zp); self.adc(v); }
            0x75 => { let v = read_op!(zpx); self.adc(v); }
            0x6d => { let v = read_op!(abs); self.adc(v); }
            0x7d => { let v = read_op!(abx); self.adc(v); }
            0x79 => { let v = read_op!(aby); self.adc(v); }
            0x61 => { let v = read_op!(izx); self.adc(v); }
            0x71 => { let v = read_op!(izy); self.adc(v); }
            0xe9 | 0xeb => { let v = read_op!(imm); self.sbc(v); }
            0xe5 => { let v = read_op!(zp); self.sbc(v); }
            0xf5 => { let v = read_op!(zpx); self.sbc(v); }
            0xed => { let v = read_op!(abs); self.sbc(v); }
            0xfd => { let v = read_op!(abx); self.sbc(v); }
            0xf9 => { let v = read_op!(aby); self.sbc(v); }
            0xe1 => { let v = read_op!(izx); self.sbc(v); }
            0xf1 => { let v = read_op!(izy); self.sbc(v); }
            0xc9 => { let v = read_op!(imm); self.compare(self.a, v); }
            0xc5 => { let v = read_op!(zp); self.compare(self.a, v); }
            0xd5 => { let v = read_op!(zpx); self.compare(self.a, v); }
            0xcd => { let v = read_op!(abs); self.compare(self.a, v); }
            0xdd => { let v = read_op!(abx); self.compare(self.a, v); }
            0xd9 => { let v = read_op!(aby); self.compare(self.a, v); }
            0xc1 => { let v = read_op!(izx); self.compare(self.a, v); }
            0xd1 => { let v = read_op!(izy); self.compare(self.a, v); }
            0xe0 => { let v = read_op!(imm); self.compare(self.x, v); }
            0xe4 => { let v = read_op!(zp); self.compare(self.x, v); }
            0xec => { let v = read_op!(abs); self.compare(self.x, v); }
            0xc0 => { let v = read_op!(imm); self.compare(self.y, v); }
            0xc4 => { let v = read_op!(zp); self.compare(self.y, v); }
            0xcc => { let v = read_op!(abs); self.compare(self.y, v); }
            0x24 | 0x2c => {
                let v = if opcode == 0x24 { read_op!(zp) } else { read_op!(abs) };
                self.p = (self.p & !(N | V)) | (v & (N | V));
                self.flag(Z, v & self.a == 0);
            }
            // ── shifts and increments ──
            0x0a => { inc!(1); self.a = self.asl(self.a); }
            0x4a => { inc!(1); self.a = self.lsr(self.a); }
            0x2a => { inc!(1); self.a = self.rol(self.a); }
            0x6a => { inc!(1); self.a = self.ror(self.a); }
            0x06 => { rmw_op!(zp, Self::asl); }
            0x16 => { rmw_op!(zpx, Self::asl); }
            0x0e => { rmw_op!(abs, Self::asl); }
            0x1e => { rmw_op!(abx, Self::asl); }
            0x46 => { rmw_op!(zp, Self::lsr); }
            0x56 => { rmw_op!(zpx, Self::lsr); }
            0x4e => { rmw_op!(abs, Self::lsr); }
            0x5e => { rmw_op!(abx, Self::lsr); }
            0x26 => { rmw_op!(zp, Self::rol); }
            0x36 => { rmw_op!(zpx, Self::rol); }
            0x2e => { rmw_op!(abs, Self::rol); }
            0x3e => { rmw_op!(abx, Self::rol); }
            0x66 => { rmw_op!(zp, Self::ror); }
            0x76 => { rmw_op!(zpx, Self::ror); }
            0x6e => { rmw_op!(abs, Self::ror); }
            0x7e => { rmw_op!(abx, Self::ror); }
            0xe6 => { rmw_op!(zp, inc); }
            0xf6 => { rmw_op!(zpx, inc); }
            0xee => { rmw_op!(abs, inc); }
            0xfe => { rmw_op!(abx, inc); }
            0xc6 => { rmw_op!(zp, dec); }
            0xd6 => { rmw_op!(zpx, dec); }
            0xce => { rmw_op!(abs, dec); }
            0xde => { rmw_op!(abx, dec); }
            0xe8 => { inc!(1); self.x = self.x.wrapping_add(1); self.set_nz(self.x); }
            0xca => { inc!(1); self.x = self.x.wrapping_sub(1); self.set_nz(self.x); }
            0xc8 => { inc!(1); self.y = self.y.wrapping_add(1); self.set_nz(self.y); }
            0x88 => { inc!(1); self.y = self.y.wrapping_sub(1); self.set_nz(self.y); }
            // ── flow ──
            0x4c => self.pc = p2,
            0x6c => {
                let low = self.load(bus, p2);
                let high = self.load(bus, (p2 & 0xff00) | (p2.wrapping_add(1) & 0xff));
                self.pc = u16::from_le_bytes([low, high]);
            }
            0x20 => {
                self.stack_peek(bus);
                inc!(2);
                let ret = self.pc;
                self.push_cycle(bus, (ret >> 8) as u8);
                self.push_cycle(bus, ret as u8);
                let high = self.load(bus, ret);
                self.pc = u16::from_le_bytes([p1, high]);
            }
            0x60 => {
                self.stack_peek(bus);
                let low = self.pull_cycle(bus);
                let high = self.pull_cycle(bus);
                let ret = u16::from_le_bytes([low, high]);
                self.load_dummy(bus, ret);
                self.pc = ret.wrapping_add(1);
            }
            0x40 => {
                // RTI sets I three cycles before its end: no OPINFO delay
                self.stack_peek(bus);
                self.p = self.pull_cycle(bus);
                let low = self.pull_cycle(bus);
                let high = self.pull_cycle(bus);
                self.pc = u16::from_le_bytes([low, high]);
            }
            0x00 => {
                inc!(2);
                self.p |= B;
                self.irq_brk(bus);
            }
            0x10 => self.branch(bus, p1, self.p & N == 0),
            0x30 => self.branch(bus, p1, self.p & N != 0),
            0x50 => self.branch(bus, p1, self.p & V == 0),
            0x70 => self.branch(bus, p1, self.p & V != 0),
            0x90 => self.branch(bus, p1, self.p & C == 0),
            0xb0 => self.branch(bus, p1, self.p & C != 0),
            0xd0 => self.branch(bus, p1, self.p & Z == 0),
            0xf0 => self.branch(bus, p1, self.p & Z != 0),
            // ── flags ──
            0x18 => { inc!(1); self.p &= !C; }
            0x38 => { inc!(1); self.p |= C; }
            0xd8 => { inc!(1); self.p &= !D; }
            0xf8 => { inc!(1); self.p |= D; }
            0xb8 => { inc!(1); self.p &= !V; }
            0x58 => {
                inc!(1);
                if !self.op.enables {
                    if self.p & I != 0 {
                        self.op.enables = true;
                    }
                } else {
                    // cycles were stolen during CLI: no extra delay
                    self.op.enables = false;
                }
                self.p &= !I;
            }
            0x78 => {
                if self.p & I == 0 {
                    self.op.disables = true;
                }
                self.p |= I;
                inc!(1);
            }
            // ── NOPs ──
            0xea | 0x1a | 0x3a | 0x5a | 0x7a | 0xda | 0xfa => inc!(1),
            0x80 | 0x82 | 0x89 | 0xc2 | 0xe2 => inc!(2),
            0x04 | 0x44 | 0x64 => nop_read!(zp),
            0x14 | 0x34 | 0x54 | 0x74 | 0xd4 | 0xf4 => nop_read!(zpx),
            0x0c => nop_read!(abs),
            0x1c | 0x3c | 0x5c | 0x7c | 0xdc | 0xfc => nop_read!(abx),
            // ── undocumented RMW combinations ──
            0x07 => { rmw_op!(zp, slo); }
            0x17 => { rmw_op!(zpx, slo); }
            0x0f => { rmw_op!(abs, slo); }
            0x1f => { rmw_op!(abx, slo); }
            0x1b => { rmw_op!(aby, slo); }
            0x03 => { rmw_op!(izx, slo); }
            0x13 => { rmw_op!(izy, slo); }
            0x27 => { rmw_op!(zp, rla); }
            0x37 => { rmw_op!(zpx, rla); }
            0x2f => { rmw_op!(abs, rla); }
            0x3f => { rmw_op!(abx, rla); }
            0x3b => { rmw_op!(aby, rla); }
            0x23 => { rmw_op!(izx, rla); }
            0x33 => { rmw_op!(izy, rla); }
            0x47 => { rmw_op!(zp, sre); }
            0x57 => { rmw_op!(zpx, sre); }
            0x4f => { rmw_op!(abs, sre); }
            0x5f => { rmw_op!(abx, sre); }
            0x5b => { rmw_op!(aby, sre); }
            0x43 => { rmw_op!(izx, sre); }
            0x53 => { rmw_op!(izy, sre); }
            0x67 => { rmw_op!(zp, rra); }
            0x77 => { rmw_op!(zpx, rra); }
            0x6f => { rmw_op!(abs, rra); }
            0x7f => { rmw_op!(abx, rra); }
            0x7b => { rmw_op!(aby, rra); }
            0x63 => { rmw_op!(izx, rra); }
            0x73 => { rmw_op!(izy, rra); }
            0xc7 => { rmw_op!(zp, dcp); }
            0xd7 => { rmw_op!(zpx, dcp); }
            0xcf => { rmw_op!(abs, dcp); }
            0xdf => { rmw_op!(abx, dcp); }
            0xdb => { rmw_op!(aby, dcp); }
            0xc3 => { rmw_op!(izx, dcp); }
            0xd3 => { rmw_op!(izy, dcp); }
            0xe7 => { rmw_op!(zp, isb); }
            0xf7 => { rmw_op!(zpx, isb); }
            0xef => { rmw_op!(abs, isb); }
            0xff => { rmw_op!(abx, isb); }
            0xfb => { rmw_op!(aby, isb); }
            0xe3 => { rmw_op!(izx, isb); }
            0xf3 => { rmw_op!(izy, isb); }
            // ── undocumented immediates ──
            0x0b | 0x2b => {
                self.a &= p1;
                self.set_nz(self.a);
                self.flag(C, self.a & 0x80 != 0);
                inc!(2);
            }
            0x4b => {
                let v = self.a & p1;
                self.a = self.lsr(v);
                inc!(2);
            }
            0x6b => {
                let tmp = self.a & p1;
                if self.p & D != 0 {
                    let mut tmp2 = (u16::from(tmp) | (u16::from(self.p & C) << 8)) >> 1;
                    let carry = self.p & C != 0;
                    self.flag(N, carry);
                    self.flag(Z, tmp2 == 0);
                    self.flag(V, ((tmp2 as u8) ^ tmp) & 0x40 != 0);
                    if (tmp & 0xf) + (tmp & 0x1) > 0x5 {
                        tmp2 = (tmp2 & 0xf0) | ((tmp2 + 0x6) & 0xf);
                    }
                    if u16::from(tmp & 0xf0) + u16::from(tmp & 0x10) > 0x50 {
                        tmp2 = (tmp2 & 0x0f) | ((tmp2 + 0x60) & 0xf0);
                        self.p |= C;
                    } else {
                        self.p &= !C;
                    }
                    self.a = tmp2 as u8;
                } else {
                    let r = ((u16::from(tmp) | (u16::from(self.p & C) << 8)) >> 1) as u8;
                    self.set_nz(r);
                    self.flag(C, r & 0x40 != 0);
                    self.flag(V, ((r & 0x40) ^ ((r & 0x20) << 1)) != 0);
                    self.a = r;
                }
                inc!(2);
            }
            0x8b => {
                let magic = if self.op.enables { ANE_RDY_MAGIC } else { ANE_MAGIC };
                self.op.enables = false;
                self.a = (self.a | magic) & self.x & p1;
                self.set_nz(self.a);
                inc!(2);
                // behave like NOP #$nn for steals after the second fetch
                self.op.number = 0x80;
            }
            0xab => {
                let magic = if self.op.enables { LXA_RDY_MAGIC } else { LXA_MAGIC };
                self.op.enables = false;
                self.a = (self.a | magic) & p1;
                self.x = self.a;
                self.set_nz(self.a);
                inc!(2);
                self.op.number = 0x80;
            }
            0xcb => {
                inc!(2);
                let tmp = u16::from(self.a & self.x).wrapping_sub(u16::from(p1));
                self.flag(C, tmp < 0x100);
                self.x = tmp as u8;
                self.set_nz(self.x);
            }
            0xbb => {
                let v = read_op!(aby);
                let r = self.sp & v;
                self.a = r;
                self.x = r;
                self.sp = r;
                self.set_nz(r);
            }
            // ── unstable stores (VICE SH_ABS_I / SHA_IND_Y) ──
            0x93 => {
                let base = self.ind_y_base(bus, p1);
                self.load_check_ba_low_dummy(bus, (base & 0xff00) | (base.wrapping_add(u16::from(self.y)) & 0xff));
                let value = self.a & self.x;
                self.store_sh(bus, base, value, self.y);
                inc!(2);
            }
            0x9b | 0x9c | 0x9e | 0x9f => {
                let (reg_and, index) = match opcode {
                    0x9c => (self.y, self.x),
                    0x9e => (self.x, self.y),
                    _ => (self.a & self.x, self.y),
                };
                self.load_check_ba_low_dummy(bus, (p2.wrapping_add(u16::from(index)) & 0xff) | (p2 & 0xff00));
                self.store_sh(bus, p2, reg_and, index);
                inc!(3);
                if opcode == 0x9b {
                    self.sp = self.a & self.x;
                }
            }
            // ── JAM ──
            0x02 | 0x12 | 0x22 | 0x32 | 0x42 | 0x52 | 0x62 | 0x72 | 0x92 | 0xb2 | 0xd2 | 0xf2 => {
                self.jammed = true;
                self.jam_opcode = opcode;
                self.clk_inc(bus);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Flat RAM that logs every bus cycle as (kind, address, value).
    struct Ram {
        memory: Vec<u8>,
        cycles: u64,
        log: Vec<(char, u16, u8)>,
        irq_at: Option<u64>,
        irq_until: u64,
        nmi_at: Option<u64>,
        ba_low: std::collections::HashSet<u64>,
    }

    impl Ram {
        fn new(program: &[u8], at: u16) -> Self {
            let mut memory = vec![0; 65_536];
            memory[at as usize..at as usize + program.len()].copy_from_slice(program);
            Self { memory, cycles: 0, log: Vec::new(), irq_at: None, irq_until: u64::MAX, nmi_at: None, ba_low: Default::default() }
        }
    }

    impl Bus for Ram {
        fn read(&mut self, address: u16) -> u8 {
            let v = self.memory[address as usize];
            self.log.push(('R', address, v));
            v
        }
        fn read_dummy(&mut self, address: u16) -> u8 {
            let v = self.memory[address as usize];
            self.log.push(('r', address, v));
            v
        }
        fn write(&mut self, address: u16, value: u8) {
            self.memory[address as usize] = value;
            self.log.push(('W', address, value));
        }
        fn write_dummy(&mut self, address: u16, value: u8) {
            self.memory[address as usize] = value;
            self.log.push(('w', address, value));
        }
        fn tick(&mut self, cycles: u32) {
            self.cycles += u64::from(cycles);
        }
        fn irq(&self) -> bool {
            self.irq_at.map_or(false, |at| self.cycles >= at && self.cycles < self.irq_until)
        }
        fn nmi(&self) -> bool {
            self.nmi_at.map_or(false, |at| self.cycles >= at)
        }
        fn ba_low(&self) -> bool {
            self.ba_low.contains(&self.cycles)
        }
    }

    fn run(program: &[u8], steps: usize) -> (Cpu, Ram) {
        let mut ram = Ram::new(program, 0x1000);
        let mut cpu = Cpu::new(0x1000);
        for _ in 0..steps {
            cpu.step(&mut ram);
        }
        (cpu, ram)
    }

    /// Base cycle counts of the NMOS 6510 (no page crossing, branch not taken).
    #[rustfmt::skip]
    const CYCLES: [u8; 256] = [
        7,6,0,8,3,3,5,5,3,2,2,2,4,4,6,6, 2,5,0,8,4,4,6,6,2,4,2,7,4,4,7,7,
        6,6,0,8,3,3,5,5,4,2,2,2,4,4,6,6, 2,5,0,8,4,4,6,6,2,4,2,7,4,4,7,7,
        6,6,0,8,3,3,5,5,3,2,2,2,3,4,6,6, 2,5,0,8,4,4,6,6,2,4,2,7,4,4,7,7,
        6,6,0,8,3,3,5,5,4,2,2,2,5,4,6,6, 2,5,0,8,4,4,6,6,2,4,2,7,4,4,7,7,
        2,6,2,6,3,3,3,3,2,2,2,2,4,4,4,4, 2,6,0,6,4,4,4,4,2,5,2,5,5,5,5,5,
        2,6,2,6,3,3,3,3,2,2,2,2,4,4,4,4, 2,5,0,5,4,4,4,4,2,4,2,4,4,4,4,4,
        2,6,2,8,3,3,5,5,2,2,2,2,4,4,6,6, 2,5,0,8,4,4,6,6,2,4,2,7,4,4,7,7,
        2,6,2,8,3,3,5,5,2,2,2,2,4,4,6,6, 2,5,0,8,4,4,6,6,2,4,2,7,4,4,7,7,
    ];

    #[test]
    fn every_opcode_takes_its_base_cycles() {
        for op in 0..=255u8 {
            let base = CYCLES[op as usize];
            if base == 0 {
                continue; // JAM
            }
            // operands $10 $20: no page crossing with X = Y = 0; branches not
            // taken (flags chosen per branch); pointers in zero page point to $2010
            let mut ram = Ram::new(&[op, 0x10, 0x20], 0x1000);
            ram.memory[0x10] = 0x10;
            ram.memory[0x11] = 0x20;
            ram.memory[0xfffe] = 0x00;
            ram.memory[0xffff] = 0x30;
            let mut cpu = Cpu::new(0x1000);
            cpu.x = 0;
            cpu.y = 0;
            cpu.p = match op {
                0x10 => U | N,        // BPL not taken
                0x30 => U,            // BMI
                0x50 => U | V,        // BVC
                0x70 => U,            // BVS
                0x90 => U | C,        // BCC
                0xb0 => U,            // BCS
                0xd0 => U | Z,        // BNE
                0xf0 => U,            // BEQ
                _ => U | I,
            };
            let used = cpu.step(&mut ram);
            assert_eq!(used, u32::from(base), "opcode ${op:02x}");
            assert_eq!(ram.log.len() as u32, used, "one bus access per cycle, opcode ${op:02x}");
        }
    }

    #[test]
    fn indexed_reads_pay_for_a_page_crossing_with_a_dummy_read() {
        // LDX #$01; LDA $10ff,X → dummy read $1000, then $1100
        let (_, ram) = run(&[0xa2, 0x01, 0xbd, 0xff, 0x10], 2);
        assert_eq!(&ram.log[2..], &[('R', 0x1002, 0xbd), ('R', 0x1003, 0xff), ('R', 0x1004, 0x10), ('r', 0x1000, 0xa2), ('R', 0x1100, 0)]);
    }

    #[test]
    fn stores_and_rmw_do_the_real_dummy_accesses() {
        // STA $2000,X (X=0): dummy read $2000 then write; INC $30: read, dummy write old, write new
        let mut ram = Ram::new(&[0x9d, 0x00, 0x20, 0xe6, 0x30], 0x1000);
        ram.memory[0x30] = 0x41;
        let mut cpu = Cpu::new(0x1000);
        cpu.step(&mut ram);
        cpu.step(&mut ram);
        assert_eq!(&ram.log[3..5], &[('r', 0x2000, 0), ('W', 0x2000, 0)]);
        assert_eq!(&ram.log[7..], &[('R', 0x0030, 0x41), ('w', 0x0030, 0x41), ('W', 0x0030, 0x42)]);
    }

    #[test]
    fn branches_cost_one_or_two_extra_cycles() {
        // BEQ +0 taken (3 cycles), then BNE across a page (4 cycles)
        let mut ram = Ram::new(&[0xf0, 0x00], 0x10f0);
        ram.memory[0x10f2] = 0xd0;
        ram.memory[0x10f3] = 0x20;
        let mut cpu = Cpu::new(0x10f0);
        cpu.p |= Z;
        assert_eq!(cpu.step(&mut ram), 3);
        cpu.p &= !Z;
        assert_eq!(cpu.step(&mut ram), 4);
        assert_eq!(cpu.pc, 0x1114);
    }

    #[test]
    fn decimal_adc_and_sbc_follow_vice() {
        // SED; LDA #$45; CLC; ADC #$38 => $83; SEC; SBC #$19 => $64
        let (cpu, _) = run(&[0xf8, 0xa9, 0x45, 0x18, 0x69, 0x38], 4);
        assert_eq!(cpu.a, 0x83);
        let (cpu, _) = run(&[0xf8, 0xa9, 0x83, 0x38, 0xe9, 0x19], 4);
        assert_eq!(cpu.a, 0x64);
        assert_ne!(cpu.p & C, 0);
        // $99 + $01 = $00 with carry
        let (cpu, _) = run(&[0xf8, 0xa9, 0x99, 0x18, 0x69, 0x01], 4);
        assert_eq!(cpu.a, 0x00);
        assert_ne!(cpu.p & C, 0);
    }

    #[test]
    fn undocumented_lax_sax_dcp_ane_lxa() {
        // LDA #$f0; LDX #$3c; SAX $20 ($30); LAX $20; DCP $20 ($2f)
        let (cpu, ram) = run(&[0xa9, 0xf0, 0xa2, 0x3c, 0x87, 0x20, 0xa7, 0x20, 0xc7, 0x20], 5);
        assert_eq!(ram.memory[0x20], 0x2f);
        assert_eq!((cpu.a, cpu.x), (0x30, 0x30));
        assert_ne!(cpu.p & C, 0);
        // ANE #$ff with A = 0, X = $ff: (0 | $ef) & $ff & $ff
        let (cpu, _) = run(&[0xa9, 0x00, 0xa2, 0xff, 0x8b, 0xff], 3);
        assert_eq!(cpu.a, 0xef);
        // LXA #$ff with A = 0: (0 | $ee) & $ff
        let (cpu, _) = run(&[0xa9, 0x00, 0xab, 0xff], 2);
        assert_eq!((cpu.a, cpu.x), (0xee, 0xee));
    }

    #[test]
    fn jsr_and_rts_bus_order() {
        // JSR $2000: fetch op, low; stack peek; push PCH, PCL; fetch high
        let mut ram = Ram::new(&[0x20, 0x00, 0x20], 0x1000);
        ram.memory[0x2000] = 0x60;
        let mut cpu = Cpu::new(0x1000);
        assert_eq!(cpu.step(&mut ram), 6);
        assert_eq!(&ram.log, &[('R', 0x1000, 0x20), ('R', 0x1001, 0x00), ('r', 0x01fd, 0), ('W', 0x01fd, 0x10), ('W', 0x01fc, 0x02), ('R', 0x1002, 0x20)]);
        assert_eq!(cpu.step(&mut ram), 6);
        assert_eq!(cpu.pc, 0x1003);
    }

    #[test]
    fn irq_waits_two_cycles_and_for_the_instruction_end() {
        // NOPs; the IRQ line goes active at cycle 3 (during the second NOP)
        let mut ram = Ram::new(&[0xea, 0xea, 0xea, 0xea], 0x1000);
        ram.memory[0xfffe] = 0x00;
        ram.memory[0xffff] = 0x30;
        ram.irq_at = Some(3);
        let mut cpu = Cpu::new(0x1000);
        cpu.p &= !I;
        cpu.step(&mut ram); // cycles 0-1
        cpu.step(&mut ram); // cycles 2-3: line seen at 3, one cycle counted
        assert_eq!(cpu.pc, 0x1002);
        cpu.step(&mut ram); // cycles 4-5: delay reaches 2 → taken after this NOP
        assert_eq!(cpu.pc, 0x1003);
        assert_eq!(cpu.step(&mut ram), 7);
        assert_eq!(cpu.pc, 0x3000);
        assert_ne!(cpu.p & I, 0);
        assert_eq!(ram.memory[0x01fb] & B, 0, "IRQ pushes B clear");
    }

    #[test]
    fn cli_lets_one_more_instruction_run() {
        // SEI already; IRQ active from the start; CLI; NOP; → IRQ after the NOP
        let mut ram = Ram::new(&[0x58, 0xea, 0xea], 0x1000);
        ram.memory[0xfffe] = 0x00;
        ram.memory[0xffff] = 0x30;
        ram.irq_at = Some(0);
        let mut cpu = Cpu::new(0x1000);
        cpu.step(&mut ram); // CLI
        cpu.step(&mut ram); // still the NOP
        assert_eq!(cpu.pc, 0x1002);
        cpu.step(&mut ram);
        assert_eq!(cpu.pc, 0x3000);
    }

    #[test]
    fn sei_still_takes_a_due_irq() {
        let mut ram = Ram::new(&[0xea, 0x78, 0xea], 0x1000);
        ram.memory[0xfffe] = 0x00;
        ram.memory[0xffff] = 0x30;
        ram.irq_at = Some(0);
        let mut cpu = Cpu::new(0x1000);
        cpu.p &= !I;
        cpu.step(&mut ram); // NOP: IRQ becomes due
        // the IRQ is due before SEI → taken now
        cpu.step(&mut ram);
        assert_eq!(cpu.pc, 0x3000);
    }

    #[test]
    fn nmi_hijacks_brk() {
        // BRK; NMI edge at cycle 3 (during the pushes) → vector $FFFA
        let mut ram = Ram::new(&[0x00, 0x00], 0x1000);
        ram.memory[0xfffa] = 0x00;
        ram.memory[0xfffb] = 0x40;
        ram.memory[0xfffe] = 0x00;
        ram.memory[0xffff] = 0x30;
        ram.nmi_at = Some(2);
        let mut cpu = Cpu::new(0x1000);
        cpu.step(&mut ram);
        assert_eq!(cpu.pc, 0x4000);
        assert_ne!(ram.memory[0x01fb] & B, 0, "pushed as BRK");
    }

    #[test]
    fn ba_low_stalls_reads_but_not_writes() {
        // STA $2000 while BA is low in cycles 2-5: the write (cycle 3) is not
        // stalled; the next opcode fetch waits until cycle 6
        let mut ram = Ram::new(&[0x8d, 0x00, 0x20, 0xea], 0x1000);
        ram.ba_low = (3..6).collect();
        let mut cpu = Cpu::new(0x1000);
        assert_eq!(cpu.step(&mut ram), 4);
        assert_eq!(cpu.step(&mut ram), 2 + 2);
    }

    #[test]
    fn jam_halts_without_panicking() {
        let (cpu, _) = run(&[0x02], 5);
        assert!(cpu.jammed);
    }
}
