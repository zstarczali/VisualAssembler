//! VIC-II timing, a Rust port of VICE's cycle-exact `viciisc` (vicii-cycle.c,
//! vicii-chip-model.c, vicii-irq.c, vicii-mem.c, vicii-fetch.c; VICE 3.10,
//! © the VICE Team, GPL v2 or later).
//!
//! Everything that decides when the CPU runs is emulated per cycle: raster
//! counter and line / frame wrap, the raster interrupt (and the IRQ register
//! semantics), bad lines (DEN, YSCROLL, the DMA line window) and sprite DMA
//! (enable, Y match, Y expansion flip-flop, MC / MCBASE, sprite crunch), which
//! together give the BA line that stalls the CPU. Pixels are not drawn, so
//! the collision registers read 0 and the light pen does not trigger.

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ViciiModel {
    /// PAL 6569 / 8565: 63 cycles × 312 lines.
    Pal,
    /// NTSC 6567R8 / 8562: 65 cycles × 263 lines.
    Ntsc,
    /// Old NTSC 6567R56A: 64 cycles × 262 lines (PSID files cannot ask for it).
    #[allow(dead_code)]
    NtscOld,
}

const FIRST_DMA_LINE: u16 = 0x30;
const LAST_DMA_LINE: u16 = 0xf7;

// per-cycle flags (from VICE's cycle tables)
const BA_FETCH: u32 = 0x100; // bad line matrix fetch window (BA low)
const PHI1_SPR_PTR: u32 = 0x200; // sprite pointer (phi1) + DMA0 (phi2)
const PHI1_SPR_DMA1: u32 = 0x400; // sprite DMA1 (phi1) + DMA2 (phi2)
const CHECK_SPR_DMA: u32 = 0x800;
const CHECK_SPR_EXP: u32 = 0x1000;
const CHECK_SPR_DISP: u32 = 0x2000;
const UPDATE_MCBASE: u32 = 0x4000;
const CHECK_SPR_CRUNCH: u32 = 0x8000;
const SPR_NUM_SHIFT: u32 = 16; // sprite number of the phi1 sprite fetch
// bits 0-7: sprites whose DMA pulls BA low in this cycle

/// Cycle table (index = cycle - 1) derived from VICE's tables.
fn cycle_table(model: ViciiModel) -> Vec<u32> {
    let (cycles, spr0_ptr, chk_dma, chk_disp) = match model {
        ViciiModel::Pal => (63u32, 58u32, [55u32, 56u32], 58u32),
        ViciiModel::Ntsc => (65, 59, [56, 57], 59),
        ViciiModel::NtscOld => (64, 59, [56, 57], 58),
    };
    let wrap = |c: u32| (c - 1) % cycles + 1;
    let mut t = vec![0u32; cycles as usize];
    for s in 0..8u32 {
        let ptr = wrap(spr0_ptr + 2 * s);
        let dma1 = wrap(ptr + 1);
        t[(ptr - 1) as usize] |= PHI1_SPR_PTR | (s << SPR_NUM_SHIFT);
        t[(dma1 - 1) as usize] |= PHI1_SPR_DMA1 | (s << SPR_NUM_SHIFT);
        // BA from three cycles before the pointer fetch up to DMA1
        for k in 0..5 {
            let c = wrap(ptr + cycles - 3 + k);
            t[(c - 1) as usize] |= 1 << s;
        }
    }
    for c in 12..=54 {
        t[c - 1] |= BA_FETCH;
    }
    t[15 - 1] |= CHECK_SPR_CRUNCH;
    t[16 - 1] |= UPDATE_MCBASE;
    for c in chk_dma {
        t[(c - 1) as usize] |= CHECK_SPR_DMA;
    }
    t[56 - 1] |= CHECK_SPR_EXP;
    t[(chk_disp - 1) as usize] |= CHECK_SPR_DISP;
    t
}

#[derive(Clone, Copy, Default)]
struct Sprite {
    mc: u8,
    mcbase: u8,
    exp_flop: bool,
}

pub struct Vicii {
    regs: [u8; 0x40],
    table: Vec<u32>,
    cycles_per_line: u16,
    lines: u16,
    /// 0-based cycle within the line (VICE raster_cycle).
    pub raster_cycle: u16,
    pub raster_line: u16,
    start_of_frame: bool,
    raster_irq_line: u16,
    raster_irq_triggered: bool,
    irq_status: u8,
    allow_bad_lines: bool,
    bad_line: bool,
    ysmooth: u8,
    sprite: [Sprite; 8],
    sprite_dma: u8,
    sprite_display: u8,
    flags: u32,
    ba_low: bool,
}

impl Vicii {
    pub fn new(model: ViciiModel) -> Self {
        let table = cycle_table(model);
        let (cycles_per_line, lines) = match model {
            ViciiModel::Pal => (63, 312),
            ViciiModel::Ntsc => (65, 263),
            ViciiModel::NtscOld => (64, 262),
        };
        // start in the last cycle of the frame: the first cycles begin raster line 0
        let flags = table[cycles_per_line as usize - 1];
        Self {
            regs: [0; 0x40],
            table,
            cycles_per_line,
            lines,
            raster_cycle: cycles_per_line - 1,
            raster_line: lines - 1,
            start_of_frame: false,
            raster_irq_line: 0,
            raster_irq_triggered: false,
            irq_status: 0,
            allow_bad_lines: false,
            bad_line: false,
            ysmooth: 0,
            sprite: [Sprite::default(); 8],
            sprite_dma: 0,
            sprite_display: 0,
            flags,
            ba_low: false,
        }
    }

    pub fn cycles_per_line(&self) -> u16 {
        self.cycles_per_line
    }

    pub fn lines(&self) -> u16 {
        self.lines
    }

    /// IRQ output (raster, collision and light pen sources masked by $D01A).
    pub fn irq(&self) -> bool {
        self.irq_status & 0x80 != 0
    }

    /// BA low after the last `tick`: CPU reads of the coming cycle must wait.
    pub fn ba_low(&self) -> bool {
        self.ba_low
    }

    fn set_irq_line(&mut self) {
        if self.irq_status & self.regs[0x1a] & 0x0f != 0 {
            self.irq_status |= 0x80;
        } else {
            self.irq_status &= 0x7f;
        }
    }

    fn update_raster_line(&mut self) {
        self.raster_irq_line = u16::from(self.regs[0x12]) | (u16::from(self.regs[0x11] & 0x80) << 1);
    }

    /// One VIC-II cycle (VICE `vicii_cycle`), after the CPU access of the
    /// current cycle: phi2 sprite DMA, then the next cycle's phi1 and logic.
    pub fn tick(&mut self) {
        // phi2 sprite fetches of the current cycle (DMA0 / DMA2)
        if self.flags & (PHI1_SPR_PTR | PHI1_SPR_DMA1) != 0 {
            let s = ((self.flags >> SPR_NUM_SHIFT) & 7) as usize;
            if self.sprite_dma & (1 << s) != 0 {
                self.sprite[s].mc = (self.sprite[s].mc + 1) & 0x3f;
            }
        }

        // next cycle
        self.raster_cycle += 1;
        if self.raster_cycle == self.cycles_per_line {
            self.raster_cycle = 0;
        }
        self.flags = self.table[self.raster_cycle as usize];

        // phi1 sprite DMA1
        if self.flags & PHI1_SPR_DMA1 != 0 {
            let s = ((self.flags >> SPR_NUM_SHIFT) & 7) as usize;
            if self.sprite_dma & (1 << s) != 0 {
                self.sprite[s].mc = (self.sprite[s].mc + 1) & 0x3f;
            }
        }

        // end of line / start of line (cycle 1)
        if self.raster_cycle == 0 {
            if self.raster_line == self.lines - 1 {
                self.start_of_frame = true;
            }
            if self.raster_line == FIRST_DMA_LINE && !self.allow_bad_lines && self.regs[0x11] & 0x10 != 0 {
                self.allow_bad_lines = true;
            }
            if self.raster_line == LAST_DMA_LINE {
                self.allow_bad_lines = false;
            }
            self.bad_line = false;
        }
        if self.start_of_frame {
            if self.raster_cycle == 1 {
                // line 0 starts in cycle 2
                self.start_of_frame = false;
                self.raster_line = 0;
                self.allow_bad_lines = false;
            }
        } else if self.raster_cycle == 0 {
            self.raster_line += 1;
        }

        // raster interrupt on the non-match → match transition
        if self.raster_line == self.raster_irq_line {
            if !self.raster_irq_triggered {
                if self.irq_status & 1 == 0 {
                    self.irq_status |= 1;
                    self.set_irq_line();
                }
                self.raster_irq_triggered = true;
            }
        } else {
            self.raster_irq_triggered = false;
        }

        // sprite logic
        if self.flags & UPDATE_MCBASE != 0 {
            for (i, s) in self.sprite.iter_mut().enumerate() {
                if s.exp_flop {
                    s.mcbase = s.mc;
                    if s.mcbase == 63 {
                        self.sprite_dma &= !(1 << i);
                    }
                }
            }
        }
        if self.flags & CHECK_SPR_DMA != 0 {
            for i in 0..8 {
                let b = 1u8 << i;
                if self.regs[0x15] & b != 0 && u16::from(self.regs[i * 2 + 1]) == self.raster_line & 0xff && self.sprite_dma & b == 0 {
                    self.sprite_dma |= b;
                    self.sprite[i].mcbase = 0;
                    self.sprite[i].exp_flop = true;
                }
            }
        }
        if self.flags & CHECK_SPR_EXP != 0 {
            for i in 0..8 {
                let b = 1u8 << i;
                if self.sprite_dma & b != 0 && self.regs[0x17] & b != 0 {
                    self.sprite[i].exp_flop ^= true;
                }
            }
        }
        if self.flags & CHECK_SPR_DISP != 0 {
            for i in 0..8 {
                let b = 1u8 << i;
                self.sprite[i].mc = self.sprite[i].mcbase;
                if self.sprite_dma & b != 0 {
                    if self.regs[0x15] & b != 0 && u16::from(self.regs[i * 2 + 1]) == self.raster_line & 0xff {
                        self.sprite_display |= b;
                    }
                } else {
                    self.sprite_display &= !b;
                }
            }
        }

        // bad lines
        if self.raster_line == FIRST_DMA_LINE && !self.allow_bad_lines {
            self.allow_bad_lines = self.regs[0x11] & 0x10 != 0;
        }
        if self.allow_bad_lines {
            self.bad_line = (self.raster_line & 7) as u8 == self.ysmooth;
        }

        // BA: matrix fetch on a bad line, sprite DMA
        self.ba_low = (self.bad_line && self.flags & BA_FETCH != 0) || self.sprite_dma & (self.flags & 0xff) as u8 != 0;
    }

    /// CPU read of $D000-$D03F.
    pub fn read(&mut self, address: u16) -> u8 {
        let r = (address & 0x3f) as usize;
        match r {
            0x11 => (self.regs[0x11] & 0x7f) | ((self.raster_line & 0x100) >> 1) as u8,
            0x12 => self.raster_line as u8,
            0x13 | 0x14 => 0, // light pen
            0x16 => self.regs[r] | 0xc0,
            0x18 => self.regs[r] | 0x01,
            0x19 => self.irq_status | 0x70,
            0x1a => self.regs[r] | 0xf0,
            0x1e | 0x1f => 0, // collisions need the drawn picture
            0x20..=0x2e => self.regs[r] | 0xf0,
            0x2f..=0x3f => 0xff,
            _ => self.regs[r],
        }
    }

    /// CPU write of $D000-$D03F.
    pub fn write(&mut self, address: u16, value: u8) {
        let r = (address & 0x3f) as usize;
        match r {
            0x11 => {
                self.ysmooth = value & 7;
                self.regs[0x11] = value;
                self.update_raster_line();
            }
            0x12 => {
                self.regs[0x12] = value;
                self.update_raster_line();
            }
            0x13 | 0x14 | 0x1e | 0x1f | 0x2f..=0x3f => {}
            0x17 => {
                for i in 0..8 {
                    let b = 1u8 << i;
                    if value & b == 0 && !self.sprite[i].exp_flop {
                        // sprite crunch
                        if self.flags & CHECK_SPR_CRUNCH != 0 {
                            let mc = self.sprite[i].mc;
                            let mcbase = self.sprite[i].mcbase;
                            self.sprite[i].mc = (0x2a & (mcbase & mc)) | (0x15 & (mcbase | mc));
                        }
                        self.sprite[i].exp_flop = true;
                    }
                }
                self.regs[0x17] = value;
            }
            0x19 => {
                self.irq_status &= !((value & 0x0f) | 0x80);
                self.set_irq_line();
            }
            0x1a => {
                self.regs[0x1a] = value & 0x0f;
                self.set_irq_line();
            }
            0x20..=0x2e => self.regs[r] = value & 0x0f,
            _ => self.regs[r] = value,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn run_to(v: &mut Vicii, line: u16, cycle: u16) {
        while !(v.raster_line == line && v.raster_cycle == cycle) {
            v.tick();
        }
    }

    #[test]
    fn a_frame_is_lines_times_cycles() {
        for (model, cycles) in [(ViciiModel::Pal, 63 * 312), (ViciiModel::Ntsc, 65 * 263), (ViciiModel::NtscOld, 64 * 262)] {
            let mut v = Vicii::new(model);
            run_to(&mut v, 0, 1);
            let mut n = 0;
            loop {
                v.tick();
                n += 1;
                if v.raster_line == 0 && v.raster_cycle == 1 {
                    break;
                }
            }
            assert_eq!(n, cycles, "{model:?}");
        }
    }

    #[test]
    fn raster_irq_fires_once_per_frame_and_is_acknowledged() {
        let mut v = Vicii::new(ViciiModel::Pal);
        v.write(0xd012, 100);
        v.write(0xd011, 0x1b);
        v.write(0xd01a, 0x01);
        run_to(&mut v, 99, 10);
        assert!(!v.irq());
        run_to(&mut v, 100, 0);
        assert!(v.irq());
        assert_eq!(v.read(0xd019) & 0x81, 0x81);
        v.write(0xd019, 0x01);
        assert!(!v.irq());
        run_to(&mut v, 100, 30);
        assert!(!v.irq(), "no second trigger in the same line");
    }

    #[test]
    fn bad_lines_pull_ba_low_for_40_plus_3_cycles() {
        let mut v = Vicii::new(ViciiModel::Pal);
        v.write(0xd011, 0x1b); // DEN, YSCROLL 3
        // line $33 is a bad line ($33 & 7 == 3)
        run_to(&mut v, 0x33, 0);
        let mut low = 0;
        for _ in 0..63 {
            v.tick();
            if v.ba_low() {
                low += 1;
            }
        }
        assert_eq!(low, 43);
        // the next line is not
        let mut low = 0;
        for _ in 0..63 {
            v.tick();
            if v.ba_low() {
                low += 1;
            }
        }
        assert_eq!(low, 0);
    }

    #[test]
    fn no_bad_lines_with_the_display_off() {
        let mut v = Vicii::new(ViciiModel::Pal);
        v.write(0xd011, 0x0b);
        run_to(&mut v, 0x40, 0);
        let mut low = 0;
        for _ in 0..63 * 50 {
            v.tick();
            low += u32::from(v.ba_low());
        }
        assert_eq!(low, 0);
    }

    #[test]
    fn a_sprite_steals_its_cycles_for_21_lines() {
        let mut v = Vicii::new(ViciiModel::Pal);
        v.write(0xd011, 0x0b); // no bad lines
        v.write(0xd001, 100);
        v.write(0xd015, 0x01);
        run_to(&mut v, 99, 0);
        let mut lines_with_ba = 0;
        for _ in 0..30 {
            let mut low = 0;
            for _ in 0..63 {
                v.tick();
                low += u32::from(v.ba_low());
            }
            if low > 0 {
                assert_eq!(low, 5, "sprite 0 takes 5 BA cycles per line");
                lines_with_ba += 1;
            }
        }
        assert_eq!(lines_with_ba, 21);
    }
}
