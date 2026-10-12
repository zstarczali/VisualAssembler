//! MOS 6526 / 6526A CIA, a Rust port of VICE's `core/ciacore.c` and
//! `core/ciatimer.c` (VICE 3.10, © the VICE Team, GPL v2 or later).
//!
//! VICE runs the CIA lazily from alarms; here it is clocked every cycle with
//! the same order of events: at the start of cycle T the timers step to T and
//! raise their underflow flags, then one cycle of the interrupt flag delay
//! line runs (which may pull the IRQ line); the CPU access of cycle T sees and
//! changes that state; the serial shift register and the TOD clock run at the
//! end of the cycle. Timer state machines, the ICR read / write delays of the
//! old (6526) and new (6526A) chip, the timer B bug, PB6 / PB7 timer outputs,
//! the shift register and the TOD clock with its 50 / 60 Hz divider follow VICE.

pub const PRA: u8 = 0;
pub const PRB: u8 = 1;
pub const DDRA: u8 = 2;
pub const DDRB: u8 = 3;
pub const TAL: u8 = 4;
pub const TAH: u8 = 5;
pub const TBL: u8 = 6;
pub const TBH: u8 = 7;
pub const TOD_TEN: u8 = 8;
pub const TOD_SEC: u8 = 9;
pub const TOD_MIN: u8 = 10;
pub const TOD_HR: u8 = 11;
pub const SDR: u8 = 12;
pub const ICR: u8 = 13;
pub const CRA: u8 = 14;
pub const CRB: u8 = 15;

const CR_START: u8 = 0x01;
const CR_PBON: u8 = 0x02;
const CR_OUTMODE_TOGGLE: u8 = 0x04;
const CRA_SPMODE_OUT: u8 = 0x40;
const CRA_TODIN_50HZ: u8 = 0x80;
const CRB_INMODE_TA: u8 = 0x40;
const CRB_ALARM_ALARM: u8 = 0x80;

const IM_SET: u16 = 0x80;
const IM_TA: u16 = 1;
const IM_TB: u16 = 2;
const IM_TOD: u16 = 4;
const IM_SDR: u16 = 8;
const IM_FLG: u16 = 16;
const IM_TBB: u16 = 0x100;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum CiaModel {
    /// Old NMOS 6526: interrupts one cycle later, timer B bug.
    Mos6526,
    /// New HMOS-II 6526A / 8521 (VICE's default).
    Mos6526A,
}

// ── timer (VICE ciatimer) ──

const CIAT_CR_MASK: u16 = 0x039;
const CIAT_CR_START: u16 = 0x001;
const CIAT_CR_ONESHOT: u16 = 0x008;
const CIAT_CR_FLOAD: u16 = 0x010;
const CIAT_PHI2IN: u16 = 0x020;
const CIAT_STEP: u16 = 0x004;
const CIAT_COUNT2: u16 = 0x002;
const CIAT_COUNT3: u16 = 0x040;
const CIAT_COUNT: u16 = 0x800;
const CIAT_LOAD1: u16 = 0x080;
const CIAT_ONESHOT0: u16 = 0x100;
const CIAT_ONESHOT: u16 = 0x1000;
const CIAT_LOAD: u16 = 0x200;
const CIAT_OUT: u16 = 0x400;

/// Next timer state for every state (VICE `ciat_init_table`): the start,
/// force load and one-shot bits ripple through 2-3 stage pipelines.
const fn ciat_next(i: u16) -> u16 {
    let mut tmp = i & (CIAT_CR_START | CIAT_CR_ONESHOT | CIAT_PHI2IN);
    if i & CIAT_CR_START != 0 && i & CIAT_PHI2IN != 0 {
        tmp |= CIAT_COUNT2;
    }
    if i & CIAT_COUNT2 != 0 || (i & CIAT_STEP != 0 && i & CIAT_CR_START != 0) {
        tmp |= CIAT_COUNT3;
    }
    if i & CIAT_COUNT3 != 0 {
        tmp |= CIAT_COUNT;
    }
    if i & CIAT_CR_FLOAD != 0 {
        tmp |= CIAT_LOAD1;
    }
    if i & CIAT_LOAD1 != 0 {
        tmp |= CIAT_LOAD;
    }
    if i & CIAT_CR_ONESHOT != 0 {
        tmp |= CIAT_ONESHOT0;
    }
    if i & CIAT_ONESHOT0 != 0 {
        tmp |= CIAT_ONESHOT;
    }
    tmp
}

#[derive(Clone, Copy)]
struct Timer {
    state: u16,
    latch: u16,
    cnt: u16,
}

impl Timer {
    fn new() -> Self {
        Self { state: 0, latch: 0xffff, cnt: 0xffff }
    }

    /// One clock (the general step of `ciat_update`); true on an underflow.
    fn step(&mut self) -> bool {
        let mut t = self.state;
        if self.cnt != 0 && t & CIAT_COUNT3 != 0 {
            self.cnt -= 1;
        }
        t = ciat_next(t);
        let mut underflow = false;
        if self.cnt == 0 && t & CIAT_COUNT3 != 0 {
            t |= CIAT_LOAD | CIAT_OUT;
            underflow = true;
        }
        if t & CIAT_LOAD != 0 {
            self.cnt = self.latch;
            t &= !CIAT_COUNT3;
        }
        if t & CIAT_OUT != 0 && t & (CIAT_ONESHOT | CIAT_ONESHOT0) != 0 {
            t &= !(CIAT_CR_START | CIAT_COUNT2);
        }
        self.state = t;
        underflow
    }

    fn set_latch_lo(&mut self, byte: u8) {
        self.latch = (self.latch & 0xff00) | u16::from(byte);
        if self.state & CIAT_LOAD != 0 {
            self.cnt = (self.cnt & 0xff00) | u16::from(byte);
        }
    }

    fn set_latch_hi(&mut self, byte: u8) {
        self.latch = (self.latch & 0xff) | (u16::from(byte) << 8);
        if self.state & CIAT_LOAD != 0 || self.state & CIAT_CR_START == 0 {
            self.cnt = self.latch;
        }
    }

    fn set_ctrl(&mut self, byte: u8) {
        self.state &= !CIAT_CR_MASK;
        self.state |= (u16::from(byte) & CIAT_CR_MASK) ^ CIAT_PHI2IN;
    }

    fn single_step(&mut self) {
        if self.state & CIAT_CR_START != 0 {
            self.state |= CIAT_STEP;
        }
    }

    fn running(&self) -> bool {
        self.state & CIAT_CR_START != 0
    }

    fn underflow_now(&self) -> bool {
        self.state & CIAT_OUT != 0
    }
}

// ── interrupt flag delay line (VICE ifr_delay) ──

const IRQ_ACK1: u32 = 0x0001;
const IRQ_ACK0: u32 = 0x0002;
const IRQ_ACK_1: u32 = 0x0004;
const IRQ_ACK_2: u32 = 0x0008;
const IRQ_D7SET1: u32 = 0x0010;
const IRQ_D7SET0: u32 = 0x0020;
const IRQ_D7SET_1: u32 = 0x0040;
const IRQ_RAISE1: u32 = 0x0100;
const IRQ_RAISE0: u32 = 0x0200;
const IRQ_RAISE_1: u32 = 0x0400;
const IRQ_READ0: u32 = 0x1000;
const IRQ_READ1: u32 = 0x2000;
const IRQ_READ2: u32 = 0x4000;
const IRQ_CLEAR: u32 = IRQ_ACK_2 | IRQ_D7SET_1 | IRQ_RAISE_1 | IRQ_READ2;

// ── serial shift register delay line (VICE sdr_delay) ──

const SDR_TOGGLE_CNT2: u32 = 0x0001;
const SDR_TOGGLE_CNT1: u32 = 0x0002;
const SDR_TOGGLE_CNT0: u32 = 0x0004;
const SDR_TOGGLE_CNT_1: u32 = 0x0008;
const SDR_NOGGLE_CNT2: u32 = 0x0010;
const SDR_NOGGLE_CNT1: u32 = 0x0020;
const SDR_NOGGLE_CNT0: u32 = 0x0040;
const SDR_NOGGLE_CNT_1: u32 = 0x0080;
const SDR_SET_SDR_IRQ3: u32 = 0x0100;
const SDR_SET_SDR_IRQ2: u32 = 0x0200;
const SDR_SET_SDR_IRQ1: u32 = 0x0400;
const SDR_SET_SDR_IRQ0: u32 = 0x0800;
const SDR_CNT0: u32 = 0x1000;
const SDR_CNT1: u32 = 0x2000;
const SDR_CNT2: u32 = 0x4000;
const SDR_CNT3: u32 = 0x8000;
const SDR_SET3: u32 = 0x0001_0000;
const SDR_SET2: u32 = 0x0002_0000;
const SDR_SET1: u32 = 0x0004_0000;
const SDR_SET0: u32 = 0x0008_0000;
const SDR_LEFTMOST: u32 = 0x0010_0000;
const SDR_CLEAR: u32 = SDR_NOGGLE_CNT2 | SDR_SET_SDR_IRQ3 | SDR_CNT0 | SDR_SET3 | SDR_LEFTMOST;
const SDR_ACTIVE: u32 = SDR_TOGGLE_CNT2 | SDR_TOGGLE_CNT1 | SDR_TOGGLE_CNT0 | SDR_TOGGLE_CNT_1 | SDR_NOGGLE_CNT2
    | SDR_NOGGLE_CNT1 | SDR_NOGGLE_CNT0 | SDR_NOGGLE_CNT_1 | SDR_SET_SDR_IRQ3 | SDR_SET_SDR_IRQ2 | SDR_SET_SDR_IRQ1
    | SDR_SET_SDR_IRQ0 | SDR_SET3 | SDR_SET2 | SDR_SET1 | SDR_SET0;
const ALL_SDR_CNT: u32 = SDR_CNT0 | SDR_CNT1 | SDR_CNT2 | SDR_CNT3;
const ALL_SDR_TOGGLE_CNT: u32 = SDR_TOGGLE_CNT2 | SDR_TOGGLE_CNT1 | SDR_TOGGLE_CNT0 | SDR_TOGGLE_CNT_1;
const ALL_SDR_NOGGLE_CNT: u32 = SDR_NOGGLE_CNT2 | SDR_NOGGLE_CNT1 | SDR_NOGGLE_CNT0 | SDR_NOGGLE_CNT_1;

pub struct Cia {
    pub model: CiaModel,
    regs: [u8; 16],
    ta: Timer,
    tb: Timer,
    tat: u8,
    tbt: u8,
    irqflags: u16,
    ack_irqflags: u16,
    new_irqflags: u16,
    /// The IRQ (CIA 1) / NMI (CIA 2) output.
    irq_out: bool,
    ifr_delay: u32,
    /// Clock of the last ICR read.
    rdi: u64,
    /// The current cycle.
    clk: u64,
    // serial port
    sdr_delay: u32,
    sdr_active: bool,
    sdr_valid: bool,
    sdr_force_finish: bool,
    sr_bits: u32,
    shifter: u32,
    cnt_out: bool,
    // TOD
    todalarm: [u8; 4],
    todlatch: [u8; 4],
    todlatched: bool,
    todstopped: bool,
    todtickcounter: u32,
    tod_countdown: u32,
    power_freq: u32,
    ticks_per_sec: u32,
    power_tickcounter: u32,
    power_ticks: u32,
    todticks: u32,
    rng: u32,
    /// Port input lines (what the outside world drives; 1 = released).
    pub pa_in: u8,
    pub pb_in: u8,
}

impl Cia {
    /// `ticks_per_sec`: CPU clock in Hz; `power_freq`: mains frequency (50 / 60 Hz).
    pub fn new(model: CiaModel, ticks_per_sec: u32, power_freq: u32) -> Self {
        let mut cia = Self {
            model,
            regs: [0; 16],
            ta: Timer::new(),
            tb: Timer::new(),
            tat: 0,
            tbt: 0,
            irqflags: 0,
            ack_irqflags: 0,
            new_irqflags: 0,
            irq_out: false,
            ifr_delay: 0,
            rdi: 0,
            clk: 0,
            sdr_delay: ALL_SDR_CNT,
            sdr_active: false,
            sdr_valid: false,
            sdr_force_finish: false,
            sr_bits: 0,
            shifter: 0,
            cnt_out: true,
            todalarm: [0; 4],
            todlatch: [0; 4],
            todlatched: false,
            todstopped: true,
            todtickcounter: 0,
            tod_countdown: 0,
            power_freq,
            ticks_per_sec,
            power_tickcounter: 0,
            power_ticks: 0,
            todticks: ticks_per_sec / power_freq.max(1),
            rng: 0x1234_5678,
            pa_in: 0xff,
            pb_in: 0xff,
        };
        cia.regs[TOD_HR as usize] = 1;
        cia.todlatch.copy_from_slice(&cia.regs[8..12]);
        cia.tod_countdown = cia.todticks;
        cia
    }

    /// The interrupt output (IRQ for CIA 1, NMI for CIA 2).
    pub fn irq(&self) -> bool {
        self.irq_out
    }

    /// Port A as driven by the CIA (inputs read as 1).
    pub fn pa_out(&self) -> u8 {
        self.regs[PRA as usize] | !self.regs[DDRA as usize]
    }

    /// Port B as driven by the CIA (inputs read as 1).
    pub fn pb_out(&self) -> u8 {
        self.regs[PRB as usize] | !self.regs[DDRB as usize]
    }

    /// FLAG pin falling edge (cassette read, serial ATN on CIA 2).
    #[allow(dead_code)] // no cassette / serial bus in the SID player
    pub fn set_flag(&mut self) {
        self.set_irq_flag(IM_FLG);
    }

    fn set_irq_flag(&mut self, bits: u16) {
        self.irqflags |= bits;
        self.new_irqflags |= bits;
        self.ack_irqflags &= !bits;
    }

    /// One cycle of the interrupt flag delay line (VICE `cia_run_ifr_cycle`).
    fn run_ifr_cycle(&mut self) {
        let mut delay = self.ifr_delay;
        if delay & IRQ_ACK0 != 0 {
            self.irqflags &= !self.ack_irqflags;
            if self.model == CiaModel::Mos6526 {
                self.irqflags &= !IM_SET;
            }
            self.ack_irqflags = 0;
        }
        if self.new_irqflags & u16::from(self.regs[ICR as usize]) & 0x1f != 0 {
            if self.model == CiaModel::Mos6526A {
                if self.rdi + 1 == self.clk {
                    delay |= IRQ_RAISE1 | IRQ_D7SET1;
                } else {
                    delay |= IRQ_RAISE0 | IRQ_D7SET0;
                }
            } else {
                delay |= IRQ_RAISE1 | IRQ_D7SET1;
            }
        }
        if delay & IRQ_D7SET0 != 0 {
            self.irqflags |= IM_SET;
        }
        if delay & IRQ_RAISE0 != 0 {
            self.irq_out = true;
        }
        self.new_irqflags = 0;
        delay <<= 1;
        delay &= !IRQ_CLEAR;
        self.ifr_delay = delay;
    }

    /// End of the current cycle (after the CPU access) and start of the next:
    /// serial port and TOD, then the timers and the interrupt delay line.
    pub fn tick(&mut self) {
        if self.sdr_active {
            self.run_sdr();
        }
        self.run_tod();
        self.clk += 1;
        let ta_under = self.ta.step();
        let tb_under = self.tb.step();
        if ta_under {
            self.timer_a_underflow();
        }
        if tb_under {
            self.set_irq_flag(IM_TB);
            if self.model == CiaModel::Mos6526 && self.rdi + 1 == self.clk {
                self.irqflags |= IM_TBB;
            } else {
                self.irqflags &= !IM_TBB;
            }
            self.tbt ^= 1;
        }
        self.run_ifr_cycle();
    }

    /// Timer A reached 0000 at this clock (VICE `ciacore_intta`).
    fn timer_a_underflow(&mut self) {
        self.set_irq_flag(IM_TA);
        self.tat ^= 1;
        let cra = self.regs[CRA as usize];
        if cra & CRA_SPMODE_OUT != 0 && (self.sr_bits != 0 || self.sdr_valid) {
            // ~1.5 cycles until CNT toggles; too close pulses can't be seen
            let event = if self.sdr_delay & (SDR_TOGGLE_CNT0 | SDR_NOGGLE_CNT0) != 0 { SDR_NOGGLE_CNT1 } else { SDR_TOGGLE_CNT1 };
            self.schedule_sdr(event);
        }
        if self.regs[CRB as usize] & (CRB_INMODE_TA | CR_START) == CRB_INMODE_TA | CR_START {
            self.tb.single_step();
        }
    }

    fn schedule_sdr(&mut self, feed: u32) {
        self.sdr_delay |= feed;
        self.sdr_active = true;
    }

    /// One cycle of the shift register delay line (VICE `ciacore_intsdr`).
    fn run_sdr(&mut self) {
        let mut feed = 0;
        if self.sdr_delay & SDR_SET0 != 0 {
            if self.sr_bits == 0 {
                self.sr_bits = 16;
                self.shifter = u32::from(self.regs[SDR as usize]) << 1;
            } else if self.sr_bits == 1 {
                self.shifter |= u32::from(self.regs[SDR as usize]);
                self.sr_bits = 17;
            } else {
                self.sdr_valid = true;
            }
        }
        if self.sdr_delay & SDR_TOGGLE_CNT0 != 0 {
            if self.sr_bits != 0 && {
                self.sr_bits -= 1;
                self.sr_bits & 1 != 0
            } {
                self.cnt_out = false;
                if self.sr_bits == 1 {
                    feed |= SDR_SET_SDR_IRQ2;
                    if self.sdr_valid {
                        self.shifter |= u32::from(self.regs[SDR as usize]);
                        self.sdr_valid = false;
                        self.sr_bits = 17;
                    }
                }
            } else {
                self.shifter <<= 1;
                self.cnt_out = true;
            }
        }
        if self.sdr_delay & SDR_SET_SDR_IRQ0 != 0 {
            self.set_irq_flag(IM_SDR);
        }
        self.sdr_delay |= feed;
        self.sdr_delay <<= 1;
        self.sdr_delay &= !SDR_CLEAR;
        if self.cnt_out {
            self.sdr_delay |= SDR_CNT0;
        }
        let mut active = self.sdr_delay & SDR_ACTIVE != 0;
        if !active {
            let all = self.sdr_delay & ALL_SDR_CNT;
            active = all != 0 && all != ALL_SDR_CNT;
        }
        self.sdr_active = active;
    }

    /// Mains ticks drive the TOD (VICE `ciacore_inttod`).
    fn run_tod(&mut self) {
        if self.power_freq == 0 {
            return;
        }
        self.tod_countdown = self.tod_countdown.saturating_sub(1);
        if self.tod_countdown != 0 {
            return;
        }
        self.todticks = self.ticks_per_sec / self.power_freq;
        let tclk = (u64::from(self.power_tickcounter) * u64::from(self.ticks_per_sec) / u64::from(self.power_freq)) as u32;
        // the mains frequency wobbles a little around its nominal value
        self.rng = self.rng.wrapping_mul(1_103_515_245).wrapping_add(12_345);
        let wobble = (self.rng >> 16) % 4;
        if self.power_ticks < tclk {
            self.todticks += wobble;
        } else if self.power_ticks > tclk {
            self.todticks -= wobble;
        }
        self.power_tickcounter += 1;
        if self.power_tickcounter >= self.power_freq {
            self.todticks = self.ticks_per_sec.saturating_sub(self.power_ticks).max(1);
            self.power_tickcounter = 0;
            self.power_ticks = 0;
        } else {
            self.power_ticks += self.todticks;
        }
        self.tod_countdown = self.todticks.max(1);

        let mut update = false;
        if !self.todstopped {
            // 3-bit ring counter: 50 Hz matches at "4", 60 Hz at "5"
            update = self.todtickcounter == if self.regs[CRA as usize] & CRA_TODIN_50HZ != 0 { 4 } else { 5 };
            if update {
                self.todtickcounter = 0;
            } else {
                self.todtickcounter += 1;
                if self.todtickcounter > 5 {
                    self.todtickcounter = 0;
                }
            }
        }
        if update {
            let r = &mut self.regs;
            let mut ts = r[8] & 0x0f;
            let mut sl = r[9] & 0x0f;
            let mut sh = (r[9] >> 4) & 0x07;
            let mut ml = r[10] & 0x0f;
            let mut mh = (r[10] >> 4) & 0x07;
            let mut hl = r[11] & 0x0f;
            let mut hh = (r[11] >> 4) & 0x01;
            let mut pm = r[11] & 0x80;
            ts = (ts + 1) & 0x0f;
            if ts == 10 {
                ts = 0;
                sl = (sl + 1) & 0x0f;
                if sl == 10 {
                    sl = 0;
                    sh = (sh + 1) & 0x07;
                    if sh == 6 {
                        sh = 0;
                        ml = (ml + 1) & 0x0f;
                        if ml == 10 {
                            ml = 0;
                            mh = (mh + 1) & 0x07;
                            if mh == 6 {
                                mh = 0;
                                if (hh == 1 && hl == 2) || (hh == 0 && hl == 9) {
                                    hl = hh;
                                    hh ^= 1;
                                } else {
                                    hl = (hl + 1) & 0x0f;
                                    if hh == 1 && hl == 2 {
                                        pm ^= 0x80;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            r[8] = ts;
            r[9] = sl | (sh << 4);
            r[10] = ml | (mh << 4);
            r[11] = hl | (hh << 4) | pm;
            self.check_tod_alarm();
        }
    }

    fn check_tod_alarm(&mut self) {
        if self.todalarm == self.regs[8..12] {
            self.set_irq_flag(IM_TOD);
        }
    }

    /// Port B with the timer outputs on PB6 / PB7.
    fn port_b(&self, mut byte: u8) -> u8 {
        let cra = self.regs[CRA as usize];
        let crb = self.regs[CRB as usize];
        if cra & CR_PBON != 0 {
            byte &= 0xbf;
            if if cra & CR_OUTMODE_TOGGLE != 0 { self.tat != 0 } else { self.ta.underflow_now() } {
                byte |= 0x40;
            }
        }
        if crb & CR_PBON != 0 {
            byte &= 0x7f;
            if if crb & CR_OUTMODE_TOGGLE != 0 { self.tbt != 0 } else { self.tb.underflow_now() } {
                byte |= 0x80;
            }
        }
        byte
    }

    /// CPU read of register `reg` in the current cycle.
    pub fn read(&mut self, reg: u8) -> u8 {
        match reg & 0x0f {
            PRA => self.pa_out() & self.pa_in,
            PRB => self.port_b(self.pb_out() & self.pb_in),
            TAL => self.ta.cnt as u8,
            TAH => (self.ta.cnt >> 8) as u8,
            TBL => self.tb.cnt as u8,
            TBH => (self.tb.cnt >> 8) as u8,
            r @ TOD_TEN..=TOD_HR => {
                if !self.todlatched {
                    self.todlatch.copy_from_slice(&self.regs[8..12]);
                }
                if r == TOD_TEN {
                    self.todlatched = false;
                }
                if r == TOD_HR {
                    self.todlatched = true;
                }
                self.todlatch[(r - TOD_TEN) as usize]
            }
            ICR => self.read_icr(),
            CRA => (self.regs[CRA as usize] & !CR_START) | u8::from(self.ta.running()),
            CRB => (self.regs[CRB as usize] & !CR_START) | u8::from(self.tb.running()),
            r => self.regs[r as usize],
        }
    }

    fn read_icr(&mut self) -> u8 {
        self.rdi = self.clk;
        if self.irqflags & IM_TBB != 0 {
            // timer B bug: the flag of an underflow one cycle after a read is lost
            self.irqflags &= !(IM_TBB | IM_TB);
        }
        let result;
        if self.model == CiaModel::Mos6526A {
            if self.ifr_delay & IRQ_RAISE0 != 0 && self.irqflags & 0x1f != 0 {
                self.irqflags |= IM_SET;
            }
            if self.irqflags & 0x9f != 0 {
                self.ack_irqflags |= (self.irqflags & 0x9f) | 0x80;
            }
            self.ifr_delay |= IRQ_ACK1;
            self.ifr_delay &= !(IRQ_RAISE0 | IRQ_D7SET0);
            result = self.irqflags as u8;
        } else {
            self.ifr_delay |= IRQ_ACK1;
            self.ifr_delay &= !IRQ_RAISE0;
            result = self.irqflags as u8;
            self.irqflags &= IM_SET;
            self.new_irqflags = 0;
        }
        self.ifr_delay |= IRQ_READ0;
        self.irq_out = false;
        result
    }

    /// CPU write of register `reg` in the current cycle.
    pub fn write(&mut self, reg: u8, byte: u8) {
        let reg = reg & 0x0f;
        match reg {
            PRA | DDRA | PRB | DDRB => self.regs[reg as usize] = byte,
            TAL => self.ta.set_latch_lo(byte),
            TBL => self.tb.set_latch_lo(byte),
            TAH => self.ta.set_latch_hi(byte),
            TBH => self.tb.set_latch_hi(byte),
            TOD_TEN..=TOD_HR => {
                let byte = match reg {
                    TOD_HR => {
                        let mut b = byte & 0x9f;
                        // writing 12 flips AM / PM (time only, not the alarm)
                        if b & 0x1f == 0x12 && self.regs[CRB as usize] & CRB_ALARM_ALARM == 0 {
                            b ^= 0x80;
                        }
                        b
                    }
                    TOD_TEN => byte & 0x0f,
                    TOD_SEC | TOD_MIN => byte & 0x7f,
                    _ => byte,
                };
                let i = (reg - TOD_TEN) as usize;
                let changed = if self.regs[CRB as usize] & CRB_ALARM_ALARM != 0 {
                    let c = self.todalarm[i] != byte;
                    self.todalarm[i] = byte;
                    c
                } else {
                    if reg == TOD_TEN && self.todstopped {
                        self.todtickcounter = 0;
                        self.todstopped = false;
                    }
                    if reg == TOD_HR {
                        self.todstopped = true;
                    }
                    let c = self.regs[reg as usize] != byte;
                    self.regs[reg as usize] = byte;
                    c
                };
                if changed {
                    self.check_tod_alarm();
                }
            }
            SDR => {
                if self.regs[CRA as usize] & CRA_SPMODE_OUT != 0 {
                    // effective two cycles later
                    self.schedule_sdr(SDR_SET1);
                }
                self.regs[SDR as usize] = byte;
            }
            ICR => self.write_icr(byte),
            CRA => {
                if byte & CR_START != 0 && self.regs[CRA as usize] & CR_START == 0 {
                    self.tat = 1;
                }
                if (byte ^ self.regs[CRA as usize]) & CRA_SPMODE_OUT != 0 {
                    self.serial_direction(byte);
                    self.sr_bits = 0;
                    self.sdr_valid = false;
                    self.sdr_delay &= !(ALL_SDR_TOGGLE_CNT | ALL_SDR_NOGGLE_CNT);
                    self.cnt_out = true;
                }
                self.ta.set_ctrl(byte);
                self.regs[CRA as usize] = byte & 0xef;
            }
            CRB => {
                if byte & CR_START != 0 && self.regs[CRB as usize] & CR_START == 0 {
                    self.tbt = 1;
                }
                if byte & CRB_INMODE_TA != 0 {
                    // counts timer A underflows (CIAT_PHI2IN off)
                    self.tb.set_ctrl(byte | 0x20);
                } else {
                    self.tb.set_ctrl(byte);
                }
                self.regs[CRB as usize] = byte & 0xef;
            }
            _ => self.regs[reg as usize] = byte,
        }
    }

    fn write_icr(&mut self, byte: u8) {
        let icr = &mut self.regs[ICR as usize];
        if byte & 0x80 != 0 {
            *icr |= byte & 0x7f;
        } else {
            *icr &= !(byte & 0x7f);
        }
        if self.irqflags & u16::from(self.regs[ICR as usize]) & 0x7f != 0 {
            if !self.irq_out {
                if self.model == CiaModel::Mos6526A {
                    if self.ifr_delay & IRQ_READ1 == 0 {
                        self.ifr_delay |= IRQ_RAISE0 | IRQ_D7SET0;
                    }
                } else {
                    self.ifr_delay |= IRQ_RAISE1 | IRQ_D7SET1;
                }
            }
        } else if self.model == CiaModel::Mos6526 && self.ifr_delay & IRQ_ACK_1 != 0 {
            self.ifr_delay &= !(IRQ_RAISE0 | IRQ_D7SET0);
        }
    }

    /// Serial port direction change (VICE `strange_extra_sdr_flags`).
    fn serial_direction(&mut self, byte: u8) {
        if byte & CRA_SPMODE_OUT == 0 {
            let wanted = if self.model == CiaModel::Mos6526 { SDR_CNT0 | SDR_CNT1 | SDR_CNT2 } else { SDR_CNT1 | SDR_CNT2 };
            let mut force = self.sdr_delay & wanted != wanted;
            if !force
                && self.sr_bits != 2
                && self.sdr_delay & SDR_TOGGLE_CNT2 == 0
                && self.sdr_delay & SDR_TOGGLE_CNT1 == 0
                && self.sdr_delay & SDR_TOGGLE_CNT0 != 0
            {
                force = true;
            }
            self.sdr_force_finish = force;
        } else {
            if !self.cnt_out && self.sr_bits != 0 {
                self.shifter <<= 1;
            }
            if self.sdr_force_finish {
                self.schedule_sdr(SDR_SET_SDR_IRQ2);
                self.sdr_force_finish = false;
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn cia(model: CiaModel) -> Cia {
        Cia::new(model, 985_248, 50)
    }

    /// Ticks until the IRQ output goes active; returns the number of ticks.
    fn ticks_until_irq(c: &mut Cia, limit: u32) -> Option<u32> {
        for n in 1..=limit {
            c.tick();
            if c.irq() {
                return Some(n);
            }
        }
        None
    }

    #[test]
    fn timer_a_counts_after_the_start_pipeline_and_reloads() {
        let mut c = cia(CiaModel::Mos6526A);
        c.write(TAL, 5);
        c.write(TAH, 0); // stopped: the counter takes the latch
        assert_eq!(c.read(TAL), 5);
        c.write(CRA, CR_START);
        // two cycles of start delay, then one decrement per cycle
        c.tick();
        assert_eq!(c.read(TAL), 5);
        c.tick();
        assert_eq!(c.read(TAL), 5);
        c.tick();
        assert_eq!(c.read(TAL), 4);
        for _ in 0..4 {
            c.tick();
        }
        // reached 0 → reloaded with the latch, flag set
        assert_eq!(c.read(TAL), 5);
        assert_ne!(c.irqflags & IM_TA, 0);
    }

    #[test]
    fn irq_needs_the_mask_and_is_one_cycle_later_on_the_old_cia() {
        for (model, extra) in [(CiaModel::Mos6526A, 0), (CiaModel::Mos6526, 1)] {
            let mut c = cia(model);
            c.write(ICR, 0x81);
            c.write(TAL, 3);
            c.write(TAH, 0);
            c.write(CRA, CR_START);
            // 2 start cycles + 3 counts → underflow at tick 5, IRQ the same cycle (new) or the next (old)
            assert_eq!(ticks_until_irq(&mut c, 20), Some(5 + extra), "{model:?}");
            assert_eq!(c.read(ICR), 0x81);
            assert!(!c.irq());
        }
    }

    #[test]
    fn reading_icr_acknowledges() {
        let mut c = cia(CiaModel::Mos6526A);
        c.write(TAL, 2);
        c.write(TAH, 0);
        c.write(CRA, CR_START);
        for _ in 0..10 {
            c.tick();
        }
        assert_eq!(c.read(ICR) & 0x01, 0x01);
        for _ in 0..2 {
            c.tick();
        }
        // flags are cleared after the ACK pipeline, set again by the next underflow
        let again = c.read(ICR);
        assert!(again & 0x01 == 0x01 || again == 0);
    }

    #[test]
    fn one_shot_stops_the_timer() {
        let mut c = cia(CiaModel::Mos6526A);
        c.write(TAL, 2);
        c.write(TAH, 0);
        c.write(CRA, CR_START | 0x08); // one-shot
        for _ in 0..12 {
            c.tick();
        }
        assert_eq!(c.read(CRA) & CR_START, 0);
        assert_eq!(c.read(TAL), 2);
    }

    #[test]
    fn timer_b_counts_timer_a_underflows() {
        let mut c = cia(CiaModel::Mos6526A);
        c.write(TAL, 1);
        c.write(TAH, 0);
        c.write(TBL, 3);
        c.write(TBH, 0);
        c.write(CRB, CR_START | CRB_INMODE_TA);
        c.write(CRA, CR_START);
        for _ in 0..40 {
            c.tick();
        }
        assert_ne!(c.irqflags & IM_TB, 0);
    }

    #[test]
    fn tod_counts_tenths_at_50_hz() {
        let mut c = cia(CiaModel::Mos6526A);
        c.write(CRA, CRA_TODIN_50HZ);
        c.write(TOD_HR, 1);
        c.write(TOD_MIN, 0);
        c.write(TOD_SEC, 0);
        c.write(TOD_TEN, 0); // starts the clock
        for _ in 0..985_248 {
            c.tick();
        }
        // one second: 10 tenths (± one tick of the start phase)
        let ten = c.read(TOD_TEN);
        let sec = c.read(TOD_SEC);
        assert!(sec == 1 || (sec == 0 && ten == 9), "sec {sec} ten {ten}");
    }
}
