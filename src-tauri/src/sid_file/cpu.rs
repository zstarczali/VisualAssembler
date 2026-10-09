//! NMOS 6510 core for the SID file player: every documented and undocumented
//! opcode, NMOS decimal mode, level-triggered IRQ and edge-triggered NMI.
//!
//! An instruction executes as a whole, but the machine is clocked around its
//! data access: `cycles - 1` cycles before the read / write and one after, so
//! SID, CIA and VIC accesses happen on (or one cycle from) their real bus cycle.

pub(super) trait Bus {
    fn read(&mut self, address: u16) -> u8;
    fn write(&mut self, address: u16, value: u8);
    /// Advances every chip on the bus by `cycles` CPU cycles.
    fn tick(&mut self, cycles: u32);
    fn irq(&self) -> bool;
    fn nmi(&self) -> bool;
}

const C: u8 = 0x01;
const Z: u8 = 0x02;
const I: u8 = 0x04;
const D: u8 = 0x08;
const B: u8 = 0x10;
const U: u8 = 0x20;
const V: u8 = 0x40;
const N: u8 = 0x80;

#[rustfmt::skip]
const CYCLES: [u8; 256] = [
    7,6,2,8,3,3,5,5,3,2,2,2,4,4,6,6, 2,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,
    6,6,2,8,3,3,5,5,4,2,2,2,4,4,6,6, 2,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,
    6,6,2,8,3,3,5,5,3,2,2,2,3,4,6,6, 2,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,
    6,6,2,8,3,3,5,5,4,2,2,2,5,4,6,6, 2,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,
    2,6,2,6,3,3,3,3,2,2,2,2,4,4,4,4, 2,6,2,6,4,4,4,4,2,5,2,5,5,5,5,5,
    2,6,2,6,3,3,3,3,2,2,2,2,4,4,4,4, 2,5,2,5,4,4,4,4,2,4,2,4,4,4,4,4,
    2,6,2,8,3,3,5,5,2,2,2,2,4,4,6,6, 2,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,
    2,6,2,8,3,3,5,5,2,2,2,2,4,4,6,6, 2,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,
];

#[derive(Clone, Copy, PartialEq, Eq)]
enum Mode {
    Imp,
    Imm,
    Zp,
    Zpx,
    Zpy,
    Abs,
    Abx,
    Aby,
    Ind,
    Izx,
    Izy,
    Rel,
}

fn mode(opcode: u8) -> Mode {
    use Mode::*;
    let low = opcode & 0x1f;
    match opcode {
        0x20 => Abs,
        0x6c => Ind,
        0x96 | 0x97 | 0xb6 | 0xb7 => Zpy,
        0x9e | 0x9f | 0xbe | 0xbf => Aby,
        _ => match low {
            0x00 if opcode >= 0x80 => Imm,
            0x00 => Imp,
            0x02 if opcode >= 0x80 => Imm,
            0x01 | 0x03 => Izx,
            0x04..=0x07 => Zp,
            0x09 | 0x0b => Imm,
            0x0c..=0x0f => Abs,
            0x10 => Rel,
            0x11 | 0x13 => Izy,
            0x14..=0x17 => Zpx,
            0x19 | 0x1b => Aby,
            0x1c..=0x1f => Abx,
            _ => Imp,
        },
    }
}

pub(super) struct Cpu {
    pub a: u8,
    pub x: u8,
    pub y: u8,
    pub sp: u8,
    pub p: u8,
    pub pc: u16,
    pub jammed: bool,
    nmi_line: bool,
    cycles: u32,
    ticked: u32,
}

impl Cpu {
    pub fn new(pc: u16) -> Self {
        Self { a: 0, x: 0, y: 0, sp: 0xfd, p: U | I, pc, jammed: false, nmi_line: false, cycles: 0, ticked: 0 }
    }

    /// True when the next `step` would enter an interrupt instead of an instruction.
    pub fn interrupt_pending(&self, bus: &dyn Bus) -> bool {
        (bus.nmi() && !self.nmi_line) || (bus.irq() && self.p & I == 0)
    }

    /// Lets the NMI edge detector see the line while the driver idles the CPU.
    pub fn observe_nmi(&mut self, bus: &dyn Bus) {
        self.nmi_line = bus.nmi();
    }

    pub fn interrupt_disabled(&self) -> bool {
        self.p & I != 0
    }

    pub fn set_interrupt_disable(&mut self, disabled: bool) {
        if disabled {
            self.p |= I;
        } else {
            self.p &= !I;
        }
    }

    pub fn push(&mut self, bus: &mut dyn Bus, value: u8) {
        bus.write(0x0100 | u16::from(self.sp), value);
        self.sp = self.sp.wrapping_sub(1);
    }

    fn pull(&mut self, bus: &mut dyn Bus) -> u8 {
        self.sp = self.sp.wrapping_add(1);
        bus.read(0x0100 | u16::from(self.sp))
    }

    /// Takes a pending interrupt or executes one instruction; returns the cycles used.
    pub fn step(&mut self, bus: &mut dyn Bus) -> u32 {
        if self.jammed {
            bus.tick(1);
            return 1;
        }
        let nmi = bus.nmi();
        let nmi_edge = nmi && !self.nmi_line;
        self.nmi_line = nmi;
        if nmi_edge || (bus.irq() && self.p & I == 0) {
            self.interrupt(bus, if nmi_edge { 0xfffa } else { 0xfffe }, false);
            bus.tick(7);
            return 7;
        }
        let opcode = self.fetch(bus);
        self.cycles = u32::from(CYCLES[opcode as usize]);
        self.ticked = 0;
        self.execute(bus, opcode);
        let rest = self.cycles - self.ticked;
        bus.tick(rest);
        self.cycles
    }

    fn interrupt(&mut self, bus: &mut dyn Bus, vector: u16, brk: bool) {
        let pc = self.pc;
        self.push(bus, (pc >> 8) as u8);
        self.push(bus, pc as u8);
        let status = (self.p | U) & !B | if brk { B } else { 0 };
        self.push(bus, status);
        self.p |= I;
        self.pc = u16::from_le_bytes([bus.read(vector), bus.read(vector.wrapping_add(1))]);
    }

    fn fetch(&mut self, bus: &mut dyn Bus) -> u8 {
        let value = bus.read(self.pc);
        self.pc = self.pc.wrapping_add(1);
        value
    }

    fn fetch16(&mut self, bus: &mut dyn Bus) -> u16 {
        let low = self.fetch(bus);
        u16::from_le_bytes([low, self.fetch(bus)])
    }

    /// Clocks the machine up to the instruction's data-access cycle.
    fn sync(&mut self, bus: &mut dyn Bus) {
        let target = self.cycles - 1;
        if self.ticked < target {
            bus.tick(target - self.ticked);
            self.ticked = target;
        }
    }

    fn read_at(&mut self, bus: &mut dyn Bus, address: u16) -> u8 {
        self.sync(bus);
        bus.read(address)
    }

    fn write_at(&mut self, bus: &mut dyn Bus, address: u16, value: u8) {
        self.sync(bus);
        bus.write(address, value);
    }

    /// Effective address; read instructions pay one cycle on a page crossing.
    fn address(&mut self, bus: &mut dyn Bus, mode: Mode, page_penalty: bool) -> u16 {
        let crossed = |base: u16, address: u16| base & 0xff00 != address & 0xff00;
        match mode {
            Mode::Zp => u16::from(self.fetch(bus)),
            Mode::Zpx => u16::from(self.fetch(bus).wrapping_add(self.x)),
            Mode::Zpy => u16::from(self.fetch(bus).wrapping_add(self.y)),
            Mode::Abs => self.fetch16(bus),
            Mode::Abx | Mode::Aby => {
                let base = self.fetch16(bus);
                let index = if mode == Mode::Abx { self.x } else { self.y };
                let address = base.wrapping_add(u16::from(index));
                if page_penalty && crossed(base, address) {
                    self.cycles += 1;
                }
                address
            }
            Mode::Izx => {
                let pointer = self.fetch(bus).wrapping_add(self.x);
                u16::from_le_bytes([bus.read(u16::from(pointer)), bus.read(u16::from(pointer.wrapping_add(1)))])
            }
            Mode::Izy => {
                let pointer = self.fetch(bus);
                let base = u16::from_le_bytes([
                    bus.read(u16::from(pointer)),
                    bus.read(u16::from(pointer.wrapping_add(1))),
                ]);
                let address = base.wrapping_add(u16::from(self.y));
                if page_penalty && crossed(base, address) {
                    self.cycles += 1;
                }
                address
            }
            Mode::Ind => {
                let pointer = self.fetch16(bus);
                // NMOS bug: the high byte comes from the same page
                let high = (pointer & 0xff00) | (pointer.wrapping_add(1) & 0x00ff);
                u16::from_le_bytes([bus.read(pointer), bus.read(high)])
            }
            Mode::Imm | Mode::Imp | Mode::Rel => 0,
        }
    }

    fn operand(&mut self, bus: &mut dyn Bus, mode: Mode) -> u8 {
        if mode == Mode::Imm {
            return self.fetch(bus);
        }
        let address = self.address(bus, mode, true);
        self.read_at(bus, address)
    }

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
        let carry = u16::from(self.p & C);
        let a = u16::from(self.a);
        let v = u16::from(value);
        if self.p & D != 0 {
            let mut low = (a & 0x0f) + (v & 0x0f) + carry;
            let mut high = (a >> 4) + (v >> 4);
            if low > 9 {
                low += 6;
            }
            if low > 0x0f {
                high += 1;
            }
            self.flag(Z, (a + v + carry) & 0xff == 0);
            self.flag(N, high & 0x08 != 0);
            self.flag(V, ((high << 4) ^ a) & 0x80 != 0 && (a ^ v) & 0x80 == 0);
            if high > 9 {
                high += 6;
            }
            self.flag(C, high > 0x0f);
            self.a = ((high << 4) | (low & 0x0f)) as u8;
        } else {
            let sum = a + v + carry;
            self.flag(C, sum > 0xff);
            self.flag(V, (!(a ^ v) & (a ^ sum)) & 0x80 != 0);
            self.a = sum as u8;
            self.set_nz(self.a);
        }
    }

    fn sbc(&mut self, value: u8) {
        let borrow = i16::from(1 - (self.p & C));
        let a = i16::from(self.a);
        let v = i16::from(value);
        let difference = a - v - borrow;
        self.flag(C, difference >= 0);
        self.flag(V, ((a ^ v) & (a ^ difference)) & 0x80 != 0);
        self.set_nz(difference as u8);
        if self.p & D != 0 {
            let mut low = (a & 0x0f) - (v & 0x0f) - borrow;
            let mut high = (a >> 4) - (v >> 4);
            if low & 0x10 != 0 {
                low -= 6;
                high -= 1;
            }
            if high & 0x10 != 0 {
                high -= 6;
            }
            self.a = (((high << 4) | (low & 0x0f)) & 0xff) as u8;
        } else {
            self.a = difference as u8;
        }
    }

    fn compare(&mut self, register: u8, value: u8) {
        self.flag(C, register >= value);
        self.set_nz(register.wrapping_sub(value));
    }

    fn asl(&mut self, value: u8) -> u8 {
        self.flag(C, value & 0x80 != 0);
        let result = value << 1;
        self.set_nz(result);
        result
    }

    fn lsr(&mut self, value: u8) -> u8 {
        self.flag(C, value & 1 != 0);
        let result = value >> 1;
        self.set_nz(result);
        result
    }

    fn rol(&mut self, value: u8) -> u8 {
        let result = (value << 1) | (self.p & C);
        self.flag(C, value & 0x80 != 0);
        self.set_nz(result);
        result
    }

    fn ror(&mut self, value: u8) -> u8 {
        let result = (value >> 1) | ((self.p & C) << 7);
        self.flag(C, value & 1 != 0);
        self.set_nz(result);
        result
    }

    fn branch(&mut self, bus: &mut dyn Bus, taken: bool) {
        let offset = self.fetch(bus) as i8;
        if taken {
            let target = self.pc.wrapping_add(offset as u16);
            self.cycles += if target & 0xff00 != self.pc & 0xff00 { 2 } else { 1 };
            self.pc = target;
        }
    }

    /// Read-modify-write on memory (or the accumulator for the implied forms).
    fn modify(&mut self, bus: &mut dyn Bus, mode: Mode, op: fn(&mut Self, u8) -> u8) -> u8 {
        if mode == Mode::Imp {
            let result = op(self, self.a);
            self.a = result;
            return result;
        }
        let address = self.address(bus, mode, false);
        let value = self.read_at(bus, address);
        bus.write(address, value);
        let result = op(self, value);
        bus.write(address, result);
        result
    }

    /// SHA / SHX / SHY / TAS store `value & (high byte of the base + 1)`.
    fn store_high_and(&mut self, bus: &mut dyn Bus, mode: Mode, value: u8) {
        let address = self.address(bus, mode, false);
        let index = if mode == Mode::Abx { self.x } else { self.y };
        let base_high = (address.wrapping_sub(u16::from(index)) >> 8) as u8;
        let stored = value & base_high.wrapping_add(1);
        let address = if address.wrapping_sub(u16::from(index)) & 0xff00 != address & 0xff00 {
            (u16::from(stored) << 8) | (address & 0xff)
        } else {
            address
        };
        self.write_at(bus, address, stored);
    }

    fn execute(&mut self, bus: &mut dyn Bus, opcode: u8) {
        let mode = mode(opcode);
        match opcode {
            // loads, stores, transfers
            0xa9 | 0xa5 | 0xb5 | 0xad | 0xbd | 0xb9 | 0xa1 | 0xb1 => {
                self.a = self.operand(bus, mode);
                self.set_nz(self.a);
            }
            0xa2 | 0xa6 | 0xb6 | 0xae | 0xbe => {
                self.x = self.operand(bus, mode);
                self.set_nz(self.x);
            }
            0xa0 | 0xa4 | 0xb4 | 0xac | 0xbc => {
                self.y = self.operand(bus, mode);
                self.set_nz(self.y);
            }
            0x85 | 0x95 | 0x8d | 0x9d | 0x99 | 0x81 | 0x91 => {
                let address = self.address(bus, mode, false);
                self.write_at(bus, address, self.a);
            }
            0x86 | 0x96 | 0x8e => {
                let address = self.address(bus, mode, false);
                self.write_at(bus, address, self.x);
            }
            0x84 | 0x94 | 0x8c => {
                let address = self.address(bus, mode, false);
                self.write_at(bus, address, self.y);
            }
            0xaa => {
                self.x = self.a;
                self.set_nz(self.x);
            }
            0xa8 => {
                self.y = self.a;
                self.set_nz(self.y);
            }
            0x8a => {
                self.a = self.x;
                self.set_nz(self.a);
            }
            0x98 => {
                self.a = self.y;
                self.set_nz(self.a);
            }
            0xba => {
                self.x = self.sp;
                self.set_nz(self.x);
            }
            0x9a => self.sp = self.x,
            // stack
            0x48 => self.push(bus, self.a),
            0x08 => self.push(bus, self.p | B | U),
            0x68 => {
                self.a = self.pull(bus);
                self.set_nz(self.a);
            }
            0x28 => self.p = (self.pull(bus) & !B) | U,
            // logic and arithmetic
            0x29 | 0x25 | 0x35 | 0x2d | 0x3d | 0x39 | 0x21 | 0x31 => {
                self.a &= self.operand(bus, mode);
                self.set_nz(self.a);
            }
            0x09 | 0x05 | 0x15 | 0x0d | 0x1d | 0x19 | 0x01 | 0x11 => {
                self.a |= self.operand(bus, mode);
                self.set_nz(self.a);
            }
            0x49 | 0x45 | 0x55 | 0x4d | 0x5d | 0x59 | 0x41 | 0x51 => {
                self.a ^= self.operand(bus, mode);
                self.set_nz(self.a);
            }
            0x69 | 0x65 | 0x75 | 0x6d | 0x7d | 0x79 | 0x61 | 0x71 => {
                let value = self.operand(bus, mode);
                self.adc(value);
            }
            0xe9 | 0xeb | 0xe5 | 0xf5 | 0xed | 0xfd | 0xf9 | 0xe1 | 0xf1 => {
                let value = self.operand(bus, mode);
                self.sbc(value);
            }
            0xc9 | 0xc5 | 0xd5 | 0xcd | 0xdd | 0xd9 | 0xc1 | 0xd1 => {
                let value = self.operand(bus, mode);
                self.compare(self.a, value);
            }
            0xe0 | 0xe4 | 0xec => {
                let value = self.operand(bus, mode);
                self.compare(self.x, value);
            }
            0xc0 | 0xc4 | 0xcc => {
                let value = self.operand(bus, mode);
                self.compare(self.y, value);
            }
            0x24 | 0x2c => {
                let value = self.operand(bus, mode);
                self.flag(Z, self.a & value == 0);
                self.p = (self.p & !(N | V)) | (value & (N | V));
            }
            // shifts, increments
            0x0a | 0x06 | 0x16 | 0x0e | 0x1e => {
                self.modify(bus, mode, Self::asl);
            }
            0x4a | 0x46 | 0x56 | 0x4e | 0x5e => {
                self.modify(bus, mode, Self::lsr);
            }
            0x2a | 0x26 | 0x36 | 0x2e | 0x3e => {
                self.modify(bus, mode, Self::rol);
            }
            0x6a | 0x66 | 0x76 | 0x6e | 0x7e => {
                self.modify(bus, mode, Self::ror);
            }
            0xe6 | 0xf6 | 0xee | 0xfe => {
                self.modify(bus, mode, |cpu, value| {
                    let result = value.wrapping_add(1);
                    cpu.set_nz(result);
                    result
                });
            }
            0xc6 | 0xd6 | 0xce | 0xde => {
                self.modify(bus, mode, |cpu, value| {
                    let result = value.wrapping_sub(1);
                    cpu.set_nz(result);
                    result
                });
            }
            0xe8 => {
                self.x = self.x.wrapping_add(1);
                self.set_nz(self.x);
            }
            0xca => {
                self.x = self.x.wrapping_sub(1);
                self.set_nz(self.x);
            }
            0xc8 => {
                self.y = self.y.wrapping_add(1);
                self.set_nz(self.y);
            }
            0x88 => {
                self.y = self.y.wrapping_sub(1);
                self.set_nz(self.y);
            }
            // flow
            0x4c | 0x6c => self.pc = self.address(bus, mode, false),
            0x20 => {
                let target = self.fetch16(bus);
                let ret = self.pc.wrapping_sub(1);
                self.push(bus, (ret >> 8) as u8);
                self.push(bus, ret as u8);
                self.pc = target;
            }
            0x60 => {
                let low = self.pull(bus);
                let high = self.pull(bus);
                self.pc = u16::from_le_bytes([low, high]).wrapping_add(1);
            }
            0x40 => {
                self.p = (self.pull(bus) & !B) | U;
                let low = self.pull(bus);
                let high = self.pull(bus);
                self.pc = u16::from_le_bytes([low, high]);
            }
            0x00 => {
                self.pc = self.pc.wrapping_add(1);
                self.interrupt(bus, 0xfffe, true);
            }
            0x10 => self.branch(bus, self.p & N == 0),
            0x30 => self.branch(bus, self.p & N != 0),
            0x50 => self.branch(bus, self.p & V == 0),
            0x70 => self.branch(bus, self.p & V != 0),
            0x90 => self.branch(bus, self.p & C == 0),
            0xb0 => self.branch(bus, self.p & C != 0),
            0xd0 => self.branch(bus, self.p & Z == 0),
            0xf0 => self.branch(bus, self.p & Z != 0),
            // flags
            0x18 => self.p &= !C,
            0x38 => self.p |= C,
            0x58 => self.p &= !I,
            0x78 => self.p |= I,
            0xb8 => self.p &= !V,
            0xd8 => self.p &= !D,
            0xf8 => self.p |= D,
            0xea => {}
            // undocumented
            0x07 | 0x17 | 0x0f | 0x1f | 0x1b | 0x03 | 0x13 => {
                let value = self.modify(bus, mode, Self::asl);
                self.a |= value;
                self.set_nz(self.a);
            }
            0x27 | 0x37 | 0x2f | 0x3f | 0x3b | 0x23 | 0x33 => {
                let value = self.modify(bus, mode, Self::rol);
                self.a &= value;
                self.set_nz(self.a);
            }
            0x47 | 0x57 | 0x4f | 0x5f | 0x5b | 0x43 | 0x53 => {
                let value = self.modify(bus, mode, Self::lsr);
                self.a ^= value;
                self.set_nz(self.a);
            }
            0x67 | 0x77 | 0x6f | 0x7f | 0x7b | 0x63 | 0x73 => {
                let value = self.modify(bus, mode, Self::ror);
                self.adc(value);
            }
            0xc7 | 0xd7 | 0xcf | 0xdf | 0xdb | 0xc3 | 0xd3 => {
                let value = self.modify(bus, mode, |_, value| value.wrapping_sub(1));
                self.compare(self.a, value);
            }
            0xe7 | 0xf7 | 0xef | 0xff | 0xfb | 0xe3 | 0xf3 => {
                let value = self.modify(bus, mode, |_, value| value.wrapping_add(1));
                self.sbc(value);
            }
            0x87 | 0x97 | 0x8f | 0x83 => {
                let address = self.address(bus, mode, false);
                self.write_at(bus, address, self.a & self.x);
            }
            0xa7 | 0xb7 | 0xaf | 0xbf | 0xa3 | 0xb3 => {
                let value = self.operand(bus, mode);
                self.a = value;
                self.x = value;
                self.set_nz(value);
            }
            0x0b | 0x2b => {
                self.a &= self.fetch(bus);
                self.set_nz(self.a);
                self.flag(C, self.a & 0x80 != 0);
            }
            0x4b => {
                let value = self.a & self.fetch(bus);
                self.a = self.lsr(value);
            }
            0x6b => {
                let value = self.a & self.fetch(bus);
                if self.p & D != 0 {
                    let carry = self.p & C;
                    let mut result = (value >> 1) | (carry << 7);
                    self.flag(N, carry != 0);
                    self.flag(Z, result == 0);
                    self.flag(V, (value ^ result) & 0x40 != 0);
                    if (value & 0x0f) + (value & 0x01) > 5 {
                        result = (result & 0xf0) | (result.wrapping_add(6) & 0x0f);
                    }
                    let high_fix = u16::from(value & 0xf0) + u16::from(value & 0x10) > 0x50;
                    self.flag(C, high_fix);
                    if high_fix {
                        result = result.wrapping_add(0x60);
                    }
                    self.a = result;
                } else {
                    self.a = (value >> 1) | ((self.p & C) << 7);
                    self.set_nz(self.a);
                    self.flag(C, self.a & 0x40 != 0);
                    self.flag(V, ((self.a >> 6) ^ (self.a >> 5)) & 1 != 0);
                }
            }
            0x8b => {
                // ANE: unstable, the common $EE "magic" constant
                self.a = (self.a | 0xee) & self.x & self.fetch(bus);
                self.set_nz(self.a);
            }
            0xab => {
                self.a = (self.a | 0xee) & self.fetch(bus);
                self.x = self.a;
                self.set_nz(self.a);
            }
            0xcb => {
                let value = self.fetch(bus);
                let ax = self.a & self.x;
                self.flag(C, ax >= value);
                self.x = ax.wrapping_sub(value);
                self.set_nz(self.x);
            }
            0xbb => {
                let value = self.operand(bus, mode) & self.sp;
                self.a = value;
                self.x = value;
                self.sp = value;
                self.set_nz(value);
            }
            0x93 | 0x9f => {
                let value = self.a & self.x;
                self.store_high_and(bus, mode, value);
            }
            0x9b => {
                self.sp = self.a & self.x;
                let value = self.sp;
                self.store_high_and(bus, mode, value);
            }
            0x9c => {
                let value = self.y;
                self.store_high_and(bus, mode, value);
            }
            0x9e => {
                let value = self.x;
                self.store_high_and(bus, mode, value);
            }
            0x02 | 0x12 | 0x22 | 0x32 | 0x42 | 0x52 | 0x62 | 0x72 | 0x92 | 0xb2 | 0xd2 | 0xf2 => {
                self.pc = self.pc.wrapping_sub(1);
                self.jammed = true;
            }
            // remaining NOPs (implied, immediate, zero page, absolute, indexed)
            _ => match mode {
                Mode::Imp => {}
                Mode::Imm => {
                    self.fetch(bus);
                }
                _ => {
                    self.operand(bus, mode);
                }
            },
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    struct Ram {
        memory: Vec<u8>,
        cycles: u32,
    }

    impl Bus for Ram {
        fn read(&mut self, address: u16) -> u8 {
            self.memory[address as usize]
        }
        fn write(&mut self, address: u16, value: u8) {
            self.memory[address as usize] = value;
        }
        fn tick(&mut self, cycles: u32) {
            self.cycles += cycles;
        }
        fn irq(&self) -> bool {
            false
        }
        fn nmi(&self) -> bool {
            false
        }
    }

    fn run(program: &[u8], steps: usize) -> (Cpu, Ram) {
        let mut ram = Ram { memory: vec![0; 65_536], cycles: 0 };
        ram.memory[0x1000..0x1000 + program.len()].copy_from_slice(program);
        let mut cpu = Cpu::new(0x1000);
        for _ in 0..steps {
            cpu.step(&mut ram);
        }
        (cpu, ram)
    }

    #[test]
    fn decimal_adc_and_sbc_follow_nmos_rules() {
        // SED; LDA #$45; CLC; ADC #$38 => $83; SEC; SBC #$19 => $64
        let (cpu, _) = run(&[0xf8, 0xa9, 0x45, 0x18, 0x69, 0x38], 4);
        assert_eq!(cpu.a, 0x83);
        let (cpu, _) = run(&[0xf8, 0xa9, 0x83, 0x38, 0xe9, 0x19], 4);
        assert_eq!(cpu.a, 0x64);
        assert_ne!(cpu.p & C, 0);
    }

    #[test]
    fn undocumented_lax_sax_dcp_work() {
        // LDA #$f0; LDX #$3c; SAX $20 ($30); LAX $20; DCP $20 ($2f); CMP sets carry
        let (cpu, ram) = run(&[0xa9, 0xf0, 0xa2, 0x3c, 0x87, 0x20, 0xa7, 0x20, 0xc7, 0x20], 5);
        assert_eq!(ram.memory[0x20], 0x2f);
        assert_eq!(cpu.a, 0x30);
        assert_eq!(cpu.x, 0x30);
        assert_ne!(cpu.p & C, 0);
    }

    #[test]
    fn page_crossing_and_branches_cost_extra_cycles() {
        // LDX #$01; LDA $10ff,X (crosses: 5 cycles, loads 0); BEQ +0 taken (3 cycles)
        let (_, ram) = run(&[0xa2, 0x01, 0xbd, 0xff, 0x10, 0xf0, 0x00], 3);
        assert_eq!(ram.cycles, 2 + 5 + 3);
    }

    #[test]
    fn jam_halts_without_panicking() {
        let (cpu, _) = run(&[0x02], 5);
        assert!(cpu.jammed);
        assert_eq!(cpu.pc, 0x1000);
    }
}
