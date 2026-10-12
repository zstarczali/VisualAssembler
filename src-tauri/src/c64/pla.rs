//! The 6510 I/O port at $00 / $01 and the memory configuration it selects,
//! a Rust port of VICE's `c64/c64pla.c` and the CPU port part of
//! `c64/c64mem.c` (VICE 3.10, © the VICE Team, GPL v2 or later).
//!
//! Input bits read the pull-ups (LORAM / HIRAM / CHAREN, cassette sense);
//! bits 6 and 7 have no pull-up and keep the last value written while they
//! were outputs for about 350 000 cycles ("the capacitor"), then read 0.

/// Cycles until a floating bit 6 / 7 discharges (VICE `C64_CPU6510_DATA_PORT_FALL_OFF_CYCLES`).
const FALL_OFF_CYCLES: u64 = 350_000;
/// Pull-ups on the C64 board: LORAM, HIRAM, CHAREN and cassette sense.
const PULLUP: u8 = 0x17;

pub struct CpuPort {
    dir: u8,
    data: u8,
    data_out: u8,
    data_read: u8,
    set_bit6: u8,
    set_bit7: u8,
    falloff6: Option<u64>,
    falloff7: Option<u64>,
    rng: u32,
}

impl CpuPort {
    /// Power-on: DDR and data 0, so the pull-ups select KERNAL, BASIC and I/O.
    pub fn new() -> Self {
        let mut port = Self { dir: 0, data: 0, data_out: 0, data_read: 0, set_bit6: 0, set_bit7: 0, falloff6: None, falloff7: None, rng: 0x2545_f491 };
        port.config_changed();
        port
    }

    /// VICE `c64pla_config_changed` with no datasette (no key pressed, motor off).
    fn config_changed(&mut self) {
        self.data_out = (self.data_out & !self.dir) | (self.data & self.dir);
        self.data_read = (self.data | !self.dir) & (self.data_out | PULLUP);
        if self.dir & 0x20 == 0 {
            self.data_read &= 0xdf;
        }
    }

    /// LORAM / HIRAM / CHAREN as the PLA sees them (bit 0, 1, 2).
    pub fn banks(&self) -> u8 {
        (!self.dir | self.data) & 7
    }

    fn falloff_at(&mut self, clk: u64) -> u64 {
        self.rng = self.rng.wrapping_mul(1_103_515_245).wrapping_add(12_345);
        clk + FALL_OFF_CYCLES + u64::from(self.rng >> 8) % (FALL_OFF_CYCLES / 5 + 1)
    }

    /// Read of $00 / $01 at CPU clock `clk`.
    pub fn read(&mut self, address: u16, clk: u64) -> u8 {
        if address == 0 {
            return self.dir;
        }
        let mut value = self.data_read;
        if self.falloff6.is_some_and(|at| at < clk) {
            self.falloff6 = None;
            self.set_bit6 = 0;
        }
        if self.falloff7.is_some_and(|at| at < clk) {
            self.falloff7 = None;
            self.set_bit7 = 0;
        }
        if self.dir & 0x40 == 0 {
            value = (value & !0x40) | self.set_bit6;
        }
        if self.dir & 0x80 == 0 {
            value = (value & !0x80) | self.set_bit7;
        }
        value
    }

    /// Write of $00 / $01 at CPU clock `clk`.
    pub fn write(&mut self, address: u16, value: u8, clk: u64) {
        if address == 0 {
            // an output bit switched to input keeps its charge for a while
            if self.dir & 0x40 != 0 && (self.dir ^ value) & 0x40 != 0 {
                self.set_bit6 = self.data & 0x40;
                self.falloff6 = Some(self.falloff_at(clk));
            }
            if self.dir & 0x80 != 0 && (self.dir ^ value) & 0x80 != 0 {
                self.set_bit7 = self.data & 0x80;
                self.falloff7 = Some(self.falloff_at(clk));
            }
            self.dir = value;
        } else {
            if self.dir & 0x80 != 0 {
                self.set_bit7 = value & 0x80;
                self.falloff7 = Some(self.falloff_at(clk));
            }
            if self.dir & 0x40 != 0 {
                self.set_bit6 = value & 0x40;
                self.falloff6 = Some(self.falloff_at(clk));
            }
            self.data = value;
        }
        self.config_changed();
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn pullups_bank_in_the_roms_after_power_on() {
        let mut p = CpuPort::new();
        assert_eq!(p.banks(), 7);
        assert_eq!(p.read(1, 0) & 0x17, 0x17);
        p.write(0, 0x2f, 0);
        p.write(1, 0x35, 0);
        assert_eq!(p.banks(), 5);
        assert_eq!(p.read(1, 0) & 0x3f, 0x35);
    }

    #[test]
    fn floating_bit7_holds_its_charge_then_falls_off() {
        let mut p = CpuPort::new();
        p.write(0, 0xef, 0);
        p.write(1, 0x80, 0);
        p.write(0, 0x2f, 10); // bit 7 becomes an input
        assert_eq!(p.read(1, 1_000) & 0x80, 0x80);
        assert_eq!(p.read(1, 1_000_000) & 0x80, 0x00);
    }
}
