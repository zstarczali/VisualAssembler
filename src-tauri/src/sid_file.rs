//! PSID / RSID player: a cycle-locked C64 (6510, CIA 1/2, VIC-II raster
//! interrupt, $01 banking) drives the Rust SID core. No ROM images are
//! bundled: a few KERNAL entry points are replaced by small stubs, and the
//! PSID driver follows VICE's psiddrv (raster IRQ for VBI tunes, CIA 1 timer A
//! for CIA tunes, so multispeed timer values written by the tune take effect).

use crate::c64::cia::{Cia, CiaModel};
use crate::c64::pla::CpuPort;
use crate::c64::vicii::{Vicii, ViciiModel};
use crate::mos6510::{Bus, Cpu};
use crate::sid_chip::{SidChip, SidEngine};
use crate::sid_core::{SidModel, NTSC_CLOCK, PAL_CLOCK, VERSION as SID_CORE_VERSION};

/// Driver addresses never executed by real code ($00/$01 are the CPU port):
/// a JSR from the driver returns to CALL_RETURN, the IRQ vector of PSID tunes
/// points to DRIVER_IRQ, and the main loop after init idles at IDLE.
const CALL_RETURN: u16 = 0x0000;
const DRIVER_IRQ: u16 = 0x0001;
const IDLE: u16 = 0x0002;
const KERNAL_IRQ_EXIT: u16 = 0xea81;

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
enum Call {
    Init,
    Play,
}

/// Replacement KERNAL: every byte is RTS except the interrupt paths a tune
/// relies on ($EA31 jiffy + CIA ack, $EA81 / $FEBC register restore + RTI,
/// $FF48 IRQ entry through $0314 / $0316, $FE43 NMI entry through $0318).
fn kernal_stub() -> Box<[u8; 8192]> {
    let mut rom = Box::new([0x60u8; 8192]);
    let mut put = |address: u16, bytes: &[u8]| {
        let start = (address - 0xe000) as usize;
        rom[start..start + bytes.len()].copy_from_slice(bytes);
    };
    put(0xea31, &[0xe6, 0xa2, 0xd0, 0x06, 0xe6, 0xa1, 0xd0, 0x02, 0xe6, 0xa0, 0xad, 0x0d, 0xdc, 0x4c, 0x81, 0xea]);
    // $EA7B: the KERNAL IRQ tail (JSR SCNKEY, LDA $DC0D) that many IRQ handlers
    // jump to; the keyboard scan is a no-op here. It runs on into $EA81.
    put(0xea7b, &[0xea, 0xea, 0xea, 0xad, 0x0d, 0xdc]);
    put(0xea81, &[0x68, 0xa8, 0x68, 0xaa, 0x68, 0x40]);
    put(0xfe43, &[0x78, 0x6c, 0x18, 0x03]);
    put(0xfe47, &[0x48, 0x8a, 0x48, 0x98, 0x48, 0xad, 0x0d, 0xdd, 0x4c, 0xbc, 0xfe]);
    put(0xfe66, &[0x4c, 0x81, 0xea]);
    put(0xfe72, &[0x2c, 0x0d, 0xdd, 0x40]);
    put(0xfebc, &[0x68, 0xa8, 0x68, 0xaa, 0x68, 0x40]);
    put(0xfce2, &[0x4c, 0xe2, 0xfc]);
    put(
        0xff48,
        &[0x48, 0x8a, 0x48, 0x98, 0x48, 0xba, 0xbd, 0x04, 0x01, 0x29, 0x10, 0xf0, 0x03, 0x6c, 0x16, 0x03, 0x6c, 0x14, 0x03],
    );
    put(0xfffa, &[0x43, 0xfe, 0xe2, 0xfc, 0x48, 0xff]);
    rom
}

/// A second or third chip of a PSID v3 / v4 tune, 32 registers at `base`.
struct ExtraSid {
    base: u16,
    core: SidChip,
    regs: [u8; 32],
    gate_on: u8,
}

struct Machine {
    ram: Box<[u8; 65_536]>,
    kernal: Box<[u8; 8192]>,
    color: Box<[u8; 1024]>,
    port: CpuPort,
    /// Machine cycles since power-on (for the CPU port's floating bits).
    clk: u64,
    sid: SidChip,
    extra_sids: Vec<ExtraSid>,
    cia1: Cia,
    cia2: Cia,
    vic: Vicii,
    /// Mono, or interleaved stereo when the tune has extra SIDs.
    output: Vec<i16>,
    /// Sample frames to drop instead of adding them to the output.
    discard: usize,
    /// Last value written to each register of the first SID (the chip is write-only).
    sid_regs: [u8; 32],
    /// Voices of the first SID whose gate bit went 0 → 1 since the last register dump frame.
    gate_on: u8,
}

/// Keeps a SID write for the register dump: the value and any gate-on edge.
fn track_sid_write(regs: &mut [u8; 32], gate_on: &mut u8, reg: usize, value: u8) {
    if matches!(reg, 4 | 11 | 18) && regs[reg] & 1 == 0 && value & 1 != 0 {
        *gate_on |= 1 << (reg / 7);
    }
    regs[reg] = value;
}

impl Machine {
    fn banks(&self) -> u8 {
        self.port.banks()
    }

    fn io_visible(&self) -> bool {
        let banks = self.banks();
        banks & 3 != 0 && banks & 4 != 0
    }

    fn extra_sid(&mut self, address: u16) -> Option<&mut ExtraSid> {
        self.extra_sids.iter_mut().find(|sid| address & 0xffe0 == sid.base)
    }

    fn channels(&self) -> usize {
        if self.extra_sids.is_empty() {
            1
        } else {
            2
        }
    }

    /// SID 1 left, SID 2 right, as on a stereo C64; a third chip goes to the centre.
    fn push_output(&mut self) {
        let first = self.sid.output_sample();
        match self.extra_sids.as_slice() {
            [] => self.output.push(first),
            [second] => {
                let right = second.core.output_sample();
                self.output.extend_from_slice(&[first, right]);
            }
            [second, third, ..] => {
                let (left, right) = (i32::from(first), i32::from(second.core.output_sample()));
                let centre = i32::from(third.core.output_sample());
                self.output.push(((2 * left + centre) / 3) as i16);
                self.output.push(((2 * right + centre) / 3) as i16);
            }
        }
    }

    fn set_output_enabled(&mut self, enabled: bool) {
        self.sid.set_output_enabled(enabled);
        for sid in &mut self.extra_sids {
            sid.core.set_output_enabled(enabled);
        }
    }

    fn io_read(&mut self, address: u16) -> u8 {
        if let Some(sid) = self.extra_sid(address) {
            return sid.core.read((address & 0x1f) as u8);
        }
        match address {
            0xd000..=0xd3ff => self.vic.read(address),
            0xd400..=0xd7ff => self.sid.read((address & 0x1f) as u8),
            0xd800..=0xdbff => self.color[(address & 0x3ff) as usize] | 0xf0,
            0xdc00..=0xdcff => self.cia1.read(address as u8),
            0xdd00..=0xddff => self.cia2.read(address as u8),
            _ => 0xff,
        }
    }

    fn io_write(&mut self, address: u16, value: u8) {
        if let Some(sid) = self.extra_sid(address) {
            let reg = (address & 0x1f) as usize;
            track_sid_write(&mut sid.regs, &mut sid.gate_on, reg, value);
            sid.core.write(reg as u8, value);
            return;
        }
        match address {
            0xd000..=0xd3ff => self.vic.write(address, value),
            0xd400..=0xd7ff => {
                let reg = (address & 0x1f) as usize;
                track_sid_write(&mut self.sid_regs, &mut self.gate_on, reg, value);
                self.sid.write(reg as u8, value);
            }
            0xd800..=0xdbff => self.color[(address & 0x3ff) as usize] = value & 0x0f,
            0xdc00..=0xdcff => self.cia1.write(address as u8, value),
            0xdd00..=0xddff => self.cia2.write(address as u8, value),
            _ => {}
        }
    }
}

impl Bus for Machine {
    fn read(&mut self, address: u16) -> u8 {
        let banks = self.banks();
        match address {
            0x0000 | 0x0001 => self.port.read(address, self.clk),
            0xa000..=0xbfff if banks & 3 == 3 => 0x60,
            0xd000..=0xdfff if banks & 3 != 0 => {
                if banks & 4 != 0 {
                    self.io_read(address)
                } else {
                    0 // character ROM is not bundled
                }
            }
            0xe000..=0xffff if banks & 2 != 0 => self.kernal[(address - 0xe000) as usize],
            _ => self.ram[address as usize],
        }
    }

    fn write(&mut self, address: u16, value: u8) {
        match address {
            0x0000 | 0x0001 => self.port.write(address, value, self.clk),
            0xd000..=0xdfff if self.io_visible() => self.io_write(address, value),
            _ => self.ram[address as usize] = value,
        }
    }

    fn tick(&mut self, cycles: u32) {
        for _ in 0..cycles {
            self.clk += 1;
            self.vic.tick();
            self.cia1.tick();
            self.cia2.tick();
            // same clock and sample rate: the samples of all chips fall due together
            let due = self.sid.clock();
            for sid in &mut self.extra_sids {
                sid.core.clock();
            }
            if due {
                if self.discard > 0 {
                    self.discard -= 1;
                } else {
                    self.push_output();
                }
            }
        }
    }

    fn irq(&self) -> bool {
        self.cia1.irq() || self.vic.irq()
    }

    fn nmi(&self) -> bool {
        self.cia2.irq()
    }

    fn ba_low(&self) -> bool {
        self.vic.ba_low()
    }
}

fn be16(bytes: &[u8], offset: usize) -> u16 {
    u16::from_be_bytes([bytes[offset], bytes[offset + 1]])
}

/// psiddrv's $01 rule: $35 for code in $E000-$FFFF, $34 in $D000-$DFFF,
/// $36 when the image reaches $A000, otherwise $37.
fn bank_for(code_high: u8, end_high: u8) -> u8 {
    if code_high >= 0xe0 {
        0x35
    } else if code_high >= 0xd0 {
        0x34
    } else if end_high >= 0xa0 {
        0x36
    } else {
        0x37
    }
}

/// A PSID v3 / v4 extra SID address byte: even $42-$7E ($D420-$D7E0) or
/// $E0-$FE ($DE00-$DFE0). Any other value means there is no such chip.
fn extra_sid_base(byte: u8) -> Option<u16> {
    (byte & 1 == 0 && matches!(byte, 0x42..=0x7e | 0xe0..=0xfe)).then(|| 0xd000 + u16::from(byte) * 16)
}

/// The chosen model drives every chip, unless the header asks for a model
/// other than the first SID's: such a tune is written for a mixed pair.
fn extra_sid_model(flags: u16, shift: u32, model: SidModel) -> SidModel {
    let declared = (flags >> shift) & 3;
    if declared == (flags >> 4) & 3 {
        return model;
    }
    match declared {
        1 => SidModel::Mos6581,
        2 => SidModel::Mos8580,
        _ => model,
    }
}

pub struct SidFilePlayer {
    machine: Machine,
    cpu: Cpu,
    calls: Vec<Call>,
    idle: bool,
    driver_irq: bool,
    play_address: u16,
    play_bank: u8,
    play_calls: u64,
    songs: u16,
    song: u16,
    sample_rate: usize,
    frame_rate: f64,
    frame_number: usize,
}

impl SidFilePlayer {
    #[cfg(test)]
    pub fn new(bytes: &[u8], sample_rate: u32, model: SidModel) -> Result<Self, String> {
        Self::with_song(bytes, sample_rate, model, 0)
    }

    /// `song` is 1-based; 0 selects the header's start song.
    pub fn with_song(bytes: &[u8], sample_rate: u32, model: SidModel, song: u16) -> Result<Self, String> {
        Self::with_engine(bytes, sample_rate, model, song, SidEngine::VaCore)
    }

    pub fn with_engine(bytes: &[u8], sample_rate: u32, model: SidModel, song: u16, engine: SidEngine) -> Result<Self, String> {
        let rsid = bytes.len() >= 4 && &bytes[..4] == b"RSID";
        if bytes.len() < 0x76 || !(rsid || &bytes[..4] == b"PSID") {
            return Err(format!("VA SID Core {SID_CORE_VERSION}: not a PSID / RSID file."));
        }
        let version = be16(bytes, 4);
        let data_offset = be16(bytes, 6) as usize;
        if !(1..=4).contains(&version) || data_offset < 0x76 || bytes.len() < data_offset + 2 {
            return Err("Invalid SID header or data offset.".into());
        }
        if version >= 2 && bytes.len() < 0x7c {
            return Err("Truncated SID v2 header.".into());
        }
        let flags = if version >= 2 { be16(bytes, 0x76) } else { 0 };
        let second_sid = if version >= 3 { extra_sid_base(bytes[0x7a]) } else { None };
        let third_sid = if version >= 4 { extra_sid_base(bytes[0x7b]) } else { None }.filter(|&base| Some(base) != second_sid);
        if rsid && flags & 0x02 != 0 {
            return Err("RSID tunes that start as a BASIC program are not supported (no BASIC ROM).".into());
        }
        let header_load = be16(bytes, 8);
        let (load_address, data_start) = if header_load == 0 {
            (u16::from_le_bytes([bytes[data_offset], bytes[data_offset + 1]]), data_offset + 2)
        } else {
            (header_load, data_offset)
        };
        let code = &bytes[data_start..];
        if code.is_empty() || load_address as usize + code.len() > 65_536 {
            return Err("SID data does not fit C64 memory.".into());
        }
        let load_end = load_address as usize + code.len() - 1;
        let mut init_address = be16(bytes, 0x0a);
        let play_address = be16(bytes, 0x0c);
        if init_address == 0 {
            if !rsid {
                return Err("PSID init address is missing.".into());
            }
            init_address = load_address;
        }
        if rsid && play_address != 0 {
            return Err("Invalid RSID header: the play address must be 0.".into());
        }
        let songs = be16(bytes, 0x0e);
        let song = if song == 0 { be16(bytes, 0x10) } else { song };
        if songs == 0 || song == 0 || song > songs {
            return Err("Invalid song selection.".into());
        }
        let ntsc = (flags >> 2) & 3 == 2;
        let clock_hz = if ntsc { NTSC_CLOCK } else { PAL_CLOCK };
        let speed = u32::from_be_bytes(bytes[0x12..0x16].try_into().unwrap());
        let cia_speed = !rsid && (speed >> (song - 1).min(31)) & 1 != 0;
        let extra_sids = [(second_sid, 6), (third_sid, 8)]
            .into_iter()
            .filter_map(|(base, model_shift)| {
                let core = SidChip::new_with_clock(engine, sample_rate, extra_sid_model(flags, model_shift, model), clock_hz);
                base.map(|base| ExtraSid { base, core, regs: [0; 32], gate_on: 0 })
            })
            .collect();

        let mut machine = Machine {
            ram: Box::new([0; 65_536]),
            kernal: kernal_stub(),
            color: Box::new([0; 1024]),
            port: CpuPort::new(),
            clk: 0,
            sid: SidChip::new_with_clock(engine, sample_rate, model, clock_hz),
            extra_sids,
            cia1: Cia::new(CiaModel::Mos6526A, clock_hz as u32, if ntsc { 60 } else { 50 }),
            cia2: Cia::new(CiaModel::Mos6526A, clock_hz as u32, if ntsc { 60 } else { 50 }),
            vic: Vicii::new(if ntsc { ViciiModel::Ntsc } else { ViciiModel::Pal }),
            output: Vec::new(),
            discard: 0,
            sid_regs: [0; 32],
            gate_on: 0,
        };
        machine.ram[load_address as usize..=load_end].copy_from_slice(code);

        // psiddrv cold start: interrupt vectors (unless the image covers them),
        // raster line 0, CIA 1 timer A at 60 Hz, full volume.
        let vectors_free = load_address >= 0x031a || load_end < 0x0314;
        if vectors_free {
            let (irq, brk, nmi) = if rsid {
                (0xea31u16, 0xfe66u16, 0xfe47u16)
            } else {
                (DRIVER_IRQ, KERNAL_IRQ_EXIT, 0xfe72)
            };
            for (offset, vector) in [irq, brk, nmi].into_iter().enumerate() {
                machine.ram[0x0314 + offset * 2..0x0316 + offset * 2].copy_from_slice(&vector.to_le_bytes());
            }
        }
        machine.vic.write(0xd011, 0x1b);
        machine.vic.write(0xd012, 0x00);
        machine.vic.write(0xd019, 0x0f);
        let timer: u16 = if ntsc { 0x4295 } else { 0x4025 };
        machine.cia1.write(0x04, timer as u8);
        machine.cia1.write(0x05, (timer >> 8) as u8);
        machine.cia1.write(0x0e, 0x01);
        machine.sid.write(0x18, 0x0f);
        machine.sid_regs[0x18] = 0x0f;
        for sid in &mut machine.extra_sids {
            sid.core.write(0x18, 0x0f);
            sid.regs[0x18] = 0x0f;
        }
        let raster_play = !rsid && play_address != 0 && !cia_speed;
        if raster_play {
            machine.vic.write(0xd01a, 0x01);
        } else {
            machine.cia1.write(0x0d, 0x81);
        }
        // the KERNAL's port setup, then the driver's banking for init
        machine.port.write(0, 0x2f, 0);
        machine.port.write(1, bank_for((init_address >> 8) as u8, (load_end >> 8) as u8), 0);

        let frame_rate = clock_hz / f64::from(machine.vic.lines() * machine.vic.cycles_per_line());
        let mut player = Self {
            machine,
            cpu: Cpu::new(init_address),
            calls: Vec::new(),
            idle: false,
            driver_irq: !rsid && vectors_free,
            play_address,
            play_bank: bank_for((play_address >> 8) as u8, (play_address >> 8) as u8),
            play_calls: 0,
            songs,
            song,
            sample_rate: sample_rate.max(8_000) as usize,
            frame_rate,
            frame_number: 0,
        };
        let index = (song - 1) as u8;
        player.cpu.a = index;
        player.cpu.x = index;
        player.cpu.y = index;
        player.cpu.sp = 0xff;
        player.call(init_address, Call::Init);
        Ok(player)
    }

    pub fn songs(&self) -> u16 {
        self.songs
    }

    pub fn song(&self) -> u16 {
        self.song
    }

    /// 1 (mono), or 2 (interleaved stereo) for a tune with extra SIDs.
    pub fn channels(&self) -> usize {
        self.machine.channels()
    }

    pub fn sid_count(&self) -> usize {
        1 + self.machine.extra_sids.len()
    }

    /// The address of the second SID, if the tune has one.
    pub fn second_sid(&self) -> Option<u16> {
        self.machine.extra_sids.first().map(|sid| sid.base)
    }

    /// The bytes of one `dump_registers` frame.
    pub fn dump_frame_bytes(&self) -> usize {
        DUMP_FRAME_BYTES * self.sid_count().min(DUMP_MAX_SIDS)
    }

    /// Calls `address` like JSR, returning to the driver at CALL_RETURN.
    fn call(&mut self, address: u16, kind: Call) {
        let ret = CALL_RETURN.wrapping_sub(1);
        self.cpu.push(&mut self.machine, (ret >> 8) as u8);
        self.cpu.push(&mut self.machine, ret as u8);
        self.cpu.pc = address;
        self.calls.push(kind);
    }

    /// psiddrv's IRQ epilogue: acknowledge VIC and CIA 1, restore registers.
    fn leave_driver_irq(&mut self) {
        let latch = self.machine.read(0xd019);
        self.machine.write(0xd019, latch);
        self.machine.read(0xdc0d);
        self.cpu.pc = KERNAL_IRQ_EXIT;
    }

    fn step(&mut self) {
        self.cpu.poll(&self.machine);
        let interrupt_ready = self.cpu.interrupt_ready();
        match self.cpu.pc {
            CALL_RETURN if !self.calls.is_empty() => {
                match self.calls.pop() {
                    Some(Call::Init) => {
                        if self.play_address != 0 {
                            self.machine.write(0x0001, 0x36);
                        }
                        self.cpu.set_interrupt_disable(false);
                        self.cpu.pc = IDLE;
                        self.idle = true;
                    }
                    _ => {
                        self.machine.write(0x0001, 0x36);
                        self.leave_driver_irq();
                    }
                }
                self.cpu.idle(&mut self.machine, 6);
            }
            DRIVER_IRQ if self.driver_irq => {
                if self.play_address != 0 {
                    self.machine.write(0x0001, self.play_bank);
                    self.play_calls += 1;
                    self.call(self.play_address, Call::Play);
                } else {
                    self.leave_driver_irq();
                }
                self.cpu.idle(&mut self.machine, 6);
            }
            IDLE if self.idle && !interrupt_ready => {
                // the CPU waits in the driver: run the machine cycle by cycle
                // until an interrupt is due (bounded, so rendering stops close
                // to the requested sample count)
                for _ in 0..64 {
                    self.cpu.idle(&mut self.machine, 1);
                    if self.cpu.interrupt_ready() {
                        break;
                    }
                }
            }
            _ => {
                self.cpu.step(&mut self.machine);
            }
        }
    }

    fn run_until(&mut self, done: impl Fn(&Machine) -> bool) {
        while !done(&self.machine) {
            self.step();
        }
    }

    fn frame_samples(&self, frames: usize) -> usize {
        let at = |frame: usize| (frame as f64 * self.sample_rate as f64 / self.frame_rate).floor() as usize;
        at(self.frame_number + frames) - at(self.frame_number)
    }

    /// Renders `frames` video frames of audio (50.12 Hz PAL, 59.83 Hz NTSC),
    /// `channels()` interleaved values per sample.
    pub fn render_frames(&mut self, frames: usize) -> Result<Vec<i16>, String> {
        let count = self.frame_samples(frames) * self.channels();
        self.run_until(|machine| machine.output.len() >= count);
        self.frame_number += frames;
        Ok(self.machine.output.drain(..count).collect())
    }

    /// Runs `frames` video frames without computing the output (seeking).
    /// Returns the number of samples per channel skipped.
    pub fn skip_frames(&mut self, frames: usize) -> Result<usize, String> {
        let count = self.frame_samples(frames);
        let channels = self.channels();
        let buffered = count.min(self.machine.output.len() / channels);
        self.machine.output.drain(..buffered * channels);
        self.machine.discard = count - buffered;
        self.machine.set_output_enabled(false);
        self.run_until(|machine| machine.discard == 0);
        self.machine.set_output_enabled(true);
        self.frame_number += frames;
        Ok(count)
    }

    pub fn frame_rate(&self) -> f64 {
        self.frame_rate
    }

    /// Runs `frames` video frames silently and returns, per frame and SID (the
    /// SID Editor's two at most), the registers $00-$18 as last written (25 bytes)
    /// plus one byte whose bits 0-2 flag the voices whose gate went on during that frame.
    /// `progress` gets the number of frames done after every frame.
    pub fn dump_registers(&mut self, frames: usize, mut progress: impl FnMut(usize)) -> Vec<u8> {
        let frame_cycles = u64::from(self.machine.vic.lines()) * u64::from(self.machine.vic.cycles_per_line());
        let frame_bytes = self.dump_frame_bytes();
        let mut out = Vec::with_capacity(frames * frame_bytes);
        self.machine.output.clear();
        self.machine.discard = usize::MAX;
        self.machine.set_output_enabled(false);
        let mut target = self.machine.clk;
        for _ in 0..frames {
            target += frame_cycles;
            self.run_until(|machine| machine.clk >= target);
            out.extend_from_slice(&self.machine.sid_regs[..25]);
            out.push(self.machine.gate_on);
            self.machine.gate_on = 0;
            for sid in self.machine.extra_sids.iter_mut().take(DUMP_MAX_SIDS - 1) {
                out.extend_from_slice(&sid.regs[..25]);
                out.push(sid.gate_on);
                sid.gate_on = 0;
            }
            progress(out.len() / frame_bytes);
        }
        self.machine.discard = 0;
        self.machine.set_output_enabled(true);
        out
    }
}

/// The bytes of one SID in a `dump_registers` frame.
pub const DUMP_FRAME_BYTES: usize = 26;
const DUMP_MAX_SIDS: usize = 2;

/// Name and author fields of a PSID / RSID header (Latin-1, zero padded).
pub fn header_strings(bytes: &[u8]) -> (String, String) {
    let field = |offset: usize| -> String {
        bytes
            .get(offset..offset + 32)
            .unwrap_or(&[])
            .iter()
            .take_while(|&&b| b != 0)
            .map(|&b| b as char)
            .collect::<String>()
            .trim()
            .to_string()
    };
    (field(0x16), field(0x36))
}

#[cfg(test)]
mod tests {
    use super::*;

    const PAL_LINES: u16 = 312;
    const PAL_LINE_CYCLES: u16 = 63;
    const NTSC_LINES: u16 = 263;
    const NTSC_LINE_CYCLES: u16 = 65;

    fn psid(load: u16, init: u16, play: u16, speed: u32, code: &[u8]) -> Vec<u8> {
        let mut file = vec![0u8; 0x7c];
        file[..4].copy_from_slice(b"PSID");
        file[5] = 2;
        file[7] = 0x7c;
        file[8..10].copy_from_slice(&load.to_be_bytes());
        file[0x0a..0x0c].copy_from_slice(&init.to_be_bytes());
        file[0x0c..0x0e].copy_from_slice(&play.to_be_bytes());
        file[0x0f] = 1;
        file[0x11] = 1;
        file[0x12..0x16].copy_from_slice(&speed.to_be_bytes());
        file.extend_from_slice(code);
        file
    }

    fn rsid(load: u16, init: u16, code: &[u8]) -> Vec<u8> {
        let mut file = psid(load, init, 0, 0, code);
        file[..4].copy_from_slice(b"RSID");
        file
    }

    #[test]
    fn a_real_tune_plays_on_both_engines_at_the_same_pace() {
        let bytes = include_bytes!("../../samples/Ikari_Intro.sid");
        let pcm: Vec<Vec<i16>> = [SidEngine::VaCore, SidEngine::Resid]
            .iter()
            .map(|engine| {
                let mut player = SidFilePlayer::with_engine(bytes, 44_100, SidModel::Mos6581, 0, *engine).unwrap();
                player.render_frames(100).unwrap()
            })
            .collect();
        assert!((pcm[0].len() as i64 - pcm[1].len() as i64).abs() <= 2, "{} / {}", pcm[0].len(), pcm[1].len());
        let peak = |samples: &[i16]| samples.iter().map(|s| i32::from(*s).abs()).max().unwrap_or(0);
        assert!(peak(&pcm[1]) > 2_000, "reSID sounds: peak {}", peak(&pcm[1]));
    }

    #[test]
    fn register_dump_flags_gate_edges_and_keeps_written_values() {
        // init: nothing; play: alternately gate voice 1 on (freq $1234) and off
        let code = [
            0x60, // $1000 init: RTS
            0xad, 0x20, 0x10, // $1001 play: LDA flag
            0x49, 0x01, // EOR #1
            0x8d, 0x20, 0x10, // STA flag
            0x09, 0x40, // ORA #$40 (pulse)
            0xa2, 0x34, 0x8e, 0x00, 0xd4, // LDX #$34 / STX $D400
            0xa2, 0x12, 0x8e, 0x01, 0xd4, // LDX #$12 / STX $D401
            0x8d, 0x04, 0xd4, // STA $D404
            0x60, // RTS
        ];
        let mut image = code.to_vec();
        image.resize(0x21, 0);
        let mut player = SidFilePlayer::new(&psid(0x1000, 0x1000, 0x1001, 0, &image), 44_100, SidModel::Mos8580).unwrap();
        let dump = player.dump_registers(6, |_| {});
        assert_eq!(dump.len(), 6 * DUMP_FRAME_BYTES);
        let frames: Vec<&[u8]> = dump.chunks(DUMP_FRAME_BYTES).collect();
        let gated: Vec<bool> = frames.iter().map(|f| f[4] & 1 != 0).collect();
        assert!(gated.windows(2).all(|w| w[0] != w[1]), "{gated:?}");
        for f in &frames {
            assert_eq!((f[0], f[1], f[4] & 0xf0), (0x34, 0x12, 0x40));
            assert_eq!(f[25] & 1 != 0, f[4] & 1 != 0);
            assert_eq!(f[0x18], 0x0f);
        }
    }

    /// A PSID v3 / v4 header around `code`, which starts with init at $1000.
    fn multi_sid(version: u8, second: u8, third: u8, flags: u16, play: u16, code: &[u8]) -> Vec<u8> {
        let mut file = psid(0x1000, 0x1000, play, 0, code);
        file[5] = version;
        file[0x76..0x78].copy_from_slice(&flags.to_be_bytes());
        file[0x7a] = second;
        file[0x7b] = third;
        file
    }

    /// LDA #value / STA address, for each of `writes`, followed by RTS.
    fn write_code(writes: &[(u16, u8)]) -> Vec<u8> {
        let mut code = Vec::new();
        for &(address, value) in writes {
            code.extend_from_slice(&[0xa9, value, 0x8d, address as u8, (address >> 8) as u8]);
        }
        code.push(0x60);
        code
    }

    /// A held sawtooth note on voice 1 of the SID at `base`.
    fn note(base: u16) -> Vec<(u16, u8)> {
        vec![(base + 1, 0x20), (base + 5, 0x00), (base + 6, 0xf0), (base + 0x18, 0x0f), (base + 4, 0x21)]
    }

    fn peaks(pcm: &[i16]) -> (i32, i32) {
        let peak = |channel: usize| pcm.chunks(2).map(|pair| i32::from(pair[channel]).abs()).max().unwrap();
        (peak(0), peak(1))
    }

    #[test]
    fn header_address_bytes_select_the_extra_sids() {
        assert_eq!(extra_sid_base(0x42), Some(0xd420));
        assert_eq!(extra_sid_base(0x50), Some(0xd500));
        assert_eq!(extra_sid_base(0xe0), Some(0xde00));
        for invalid in [0x00, 0x40, 0x43, 0x80, 0xd0, 0xe1] {
            assert_eq!(extra_sid_base(invalid), None, "{invalid:#x}");
        }
        let code = [0x60, 0x60];
        let count = |version, second, third| {
            SidFilePlayer::new(&multi_sid(version, second, third, 0, 0x1000, &code), 44_100, SidModel::Mos8580)
                .unwrap()
                .sid_count()
        };
        assert_eq!(count(2, 0x42, 0x44), 1, "v2 has no extra SID fields");
        assert_eq!(count(3, 0x00, 0x00), 1);
        assert_eq!(count(3, 0x42, 0x44), 2, "v3 has no third SID");
        assert_eq!(count(4, 0x42, 0x44), 3);
        assert_eq!(count(4, 0x42, 0x42), 2, "the third SID cannot share the second's address");
    }

    #[test]
    fn extra_sid_model_follows_the_chosen_model_unless_the_tune_is_mixed() {
        let (first_6581, second_6581, second_8580) = (1 << 4, 1 << 6, 2 << 6);
        assert_eq!(extra_sid_model(0, 6, SidModel::Mos8580), SidModel::Mos8580);
        assert_eq!(extra_sid_model(first_6581 | second_6581, 6, SidModel::Mos8580), SidModel::Mos8580);
        assert_eq!(extra_sid_model(first_6581 | second_8580, 6, SidModel::Mos6581), SidModel::Mos8580);
        assert_eq!(extra_sid_model(first_6581, 6, SidModel::Mos8580), SidModel::Mos8580, "unknown: same as the first");
    }

    #[test]
    fn stereo_output_keeps_each_sid_on_its_own_channel() {
        for (byte, base) in [(0x42, 0xd420), (0xe0, 0xde00)] {
            let code = write_code(&note(base));
            let bytes = multi_sid(3, byte, 0, 0, 0x1000, &code);
            let mut only_second = SidFilePlayer::new(&bytes, 44_100, SidModel::Mos8580).unwrap();
            assert_eq!(only_second.channels(), 2);
            let pcm = only_second.render_frames(10).unwrap();
            let expected = (10.0 * 44_100.0 / only_second.frame_rate).floor() as usize * 2;
            assert_eq!(pcm.len(), expected);
            let (left, right) = peaks(&pcm[expected / 2..]);
            assert!(right > 1_000 && left * 20 < right, "{base:#x}: left {left}, right {right}");
        }
        let code = write_code(&note(0xd400));
        let mut only_first = SidFilePlayer::new(&multi_sid(3, 0x42, 0, 0, 0x1000, &code), 44_100, SidModel::Mos8580).unwrap();
        let pcm = only_first.render_frames(10).unwrap();
        let (left, right) = peaks(&pcm[pcm.len() / 2..]);
        assert!(left > 1_000 && right * 20 < left, "left {left}, right {right}");
    }

    #[test]
    fn third_sid_is_heard_on_both_channels() {
        let code = write_code(&note(0xd440));
        let mut player = SidFilePlayer::new(&multi_sid(4, 0x42, 0x44, 0, 0x1000, &code), 44_100, SidModel::Mos8580).unwrap();
        assert_eq!(player.channels(), 2);
        let pcm = player.render_frames(10).unwrap();
        let (left, right) = peaks(&pcm[pcm.len() / 2..]);
        assert!(left > 1_000 && left == right, "left {left}, right {right}");
    }

    #[test]
    fn single_sid_tune_keeps_the_mirrors_and_mono_output() {
        // no second SID: $D420 is a mirror of $D400
        let code = write_code(&note(0xd420));
        let mut player = SidFilePlayer::new(&multi_sid(3, 0x00, 0, 0, 0x1000, &code), 44_100, SidModel::Mos8580).unwrap();
        assert_eq!(player.channels(), 1);
        let pcm = player.render_frames(10).unwrap();
        assert_eq!(pcm.len(), (10.0 * 44_100.0 / player.frame_rate).floor() as usize);
        assert!(pcm.iter().any(|&sample| i32::from(sample).abs() > 1_000));
    }

    #[test]
    fn extra_sid_registers_read_back_from_their_own_chip() {
        // voice 3 of the second SID runs at full frequency; its oscillator shows at $D43B
        let code = write_code(&[(0xd42f, 0xff), (0xd432, 0x20)]);
        let bytes = multi_sid(3, 0x42, 0, 0, 0x1000, &code);
        let mut player = SidFilePlayer::new(&bytes, 44_100, SidModel::Mos8580).unwrap();
        player.render_frames(2).unwrap();
        let second: Vec<u8> = (0..16)
            .map(|_| {
                player.machine.tick(37);
                player.machine.io_read(0xd43b)
            })
            .collect();
        assert!(second.windows(2).any(|w| w[0] != w[1]), "{second:?}");
        assert_eq!(player.machine.io_read(0xd41b), 0, "the first SID's voice 3 is silent");
    }

    #[test]
    fn stereo_seek_lands_on_the_same_audio_as_rendering() {
        let code = write_code(&[note(0xd400), note(0xd420)].concat());
        let bytes = multi_sid(3, 0x42, 0, 0, 0x1000, &code);
        let mut played = SidFilePlayer::new(&bytes, 44_100, SidModel::Mos8580).unwrap();
        let mut skipped = SidFilePlayer::new(&bytes, 44_100, SidModel::Mos8580).unwrap();
        let whole = played.render_frames(30).unwrap();
        let dropped = skipped.skip_frames(10).unwrap();
        let resumed = skipped.render_frames(20).unwrap();
        assert_eq!(resumed.len(), whole.len() - dropped * 2);
        let settle = 4_410 * 2;
        let peak_of = |part: &[i16]| part.iter().map(|&sample| i32::from(sample).abs()).max().unwrap();
        assert!((peak_of(&resumed[settle..]) - peak_of(&whole[dropped * 2 + settle..])).abs() < 200);
    }

    #[test]
    fn register_dump_holds_two_sids_each_with_its_own_gate_edges() {
        let code = write_code(&[(0xd400, 0x11), (0xd500, 0x22), (0xd404, 0x21), (0xd50b, 0x41)]);
        let mut player = SidFilePlayer::new(&multi_sid(3, 0x50, 0, 0, 0x1000, &code), 44_100, SidModel::Mos8580).unwrap();
        assert_eq!(player.second_sid(), Some(0xd500));
        let frame = player.dump_frame_bytes();
        assert_eq!(frame, 2 * DUMP_FRAME_BYTES);
        let mut seen = 0;
        let dump = player.dump_registers(2, |done| seen = done);
        assert_eq!((dump.len(), seen), (2 * frame, 2));
        assert_eq!((dump[0], dump[4], dump[25]), (0x11, 0x21, 1), "first SID");
        let second = &dump[DUMP_FRAME_BYTES..frame];
        assert_eq!((second[0], second[11], second[0x18], second[25]), (0x22, 0x41, 0x0f, 2), "second SID");
        assert_eq!((dump[frame + 25], dump[frame + DUMP_FRAME_BYTES + 25]), (0, 0), "the edges are reported once");
    }

    #[test]
    fn register_dump_of_three_sids_keeps_the_first_two() {
        let code = write_code(&[(0xd400, 0x11), (0xd420, 0x22), (0xd440, 0x33)]);
        let mut player = SidFilePlayer::new(&multi_sid(4, 0x42, 0x44, 0, 0x1000, &code), 44_100, SidModel::Mos8580).unwrap();
        assert_eq!(player.dump_frame_bytes(), 2 * DUMP_FRAME_BYTES);
        let dump = player.dump_registers(1, |_| {});
        assert_eq!((dump.len(), dump[0], dump[DUMP_FRAME_BYTES]), (2 * DUMP_FRAME_BYTES, 0x11, 0x22));
    }

    #[test]
    fn register_dump_of_a_one_sid_tune_keeps_its_layout() {
        let code = write_code(&[(0xd400, 0x11)]);
        let mut player = SidFilePlayer::new(&multi_sid(3, 0, 0, 0, 0x1000, &code), 44_100, SidModel::Mos8580).unwrap();
        assert_eq!(player.second_sid(), None);
        assert_eq!(player.dump_registers(3, |_| {}).len(), 3 * DUMP_FRAME_BYTES);
    }

    #[test]
    fn bundled_psid_samples_run_through_va_core() {
        for bytes in [
            include_bytes!("../../samples/Ikari_Intro.sid").as_slice(),
            include_bytes!("../../samples/Mad_Ikari.sid").as_slice(),
        ] {
            let mut player = SidFilePlayer::new(bytes, 44_100, SidModel::Mos6581).unwrap();
            let pcm = player.render_frames(15).unwrap();
            assert_eq!(pcm.len(), (15.0 * 44_100.0 / player.frame_rate).floor() as usize);
            assert!(pcm.iter().any(|&sample| sample != 0));
            assert!(player.play_calls >= 14);
        }
    }

    #[test]
    fn psid_header_selects_pal_ntsc_and_cia_timing() {
        let source = include_bytes!("../../samples/Ikari_Intro.sid");
        let pal = SidFilePlayer::new(source, 44_100, SidModel::Mos8580).unwrap();
        assert!((pal.frame_rate - PAL_CLOCK / f64::from(PAL_LINES * PAL_LINE_CYCLES)).abs() < 0.001);

        let mut ntsc_bytes = source.to_vec();
        ntsc_bytes[0x76] = 0;
        ntsc_bytes[0x77] = 2 << 2;
        let ntsc = SidFilePlayer::new(&ntsc_bytes, 44_100, SidModel::Mos8580).unwrap();
        assert!((ntsc.frame_rate - NTSC_CLOCK / f64::from(NTSC_LINES * NTSC_LINE_CYCLES)).abs() < 0.001);

        // CIA speed: CIA 1 timer A at the KERNAL's $4295 (NTSC) calls play ~60 times a second
        ntsc_bytes[0x15] = 1;
        let mut cia = SidFilePlayer::new(&ntsc_bytes, 44_100, SidModel::Mos8580).unwrap();
        assert_eq!(cia.render_frames(15).unwrap().len(), 11_057);
        let before = cia.play_calls;
        cia.render_frames(60).unwrap();
        let rate = (cia.play_calls - before) as f64 * ntsc.frame_rate / 60.0;
        assert!((rate - 60.0).abs() < 1.5, "CIA play rate {rate}");
    }

    #[test]
    fn multispeed_timer_written_by_init_sets_the_play_rate() {
        // init: CIA 1 timer A latch = $2012 (2x speed on PAL); play: INC $0400
        let code = [0xa9, 0x12, 0x8d, 0x04, 0xdc, 0xa9, 0x20, 0x8d, 0x05, 0xdc, 0x60, 0xee, 0x00, 0x04, 0x60];
        let bytes = psid(0x1000, 0x1000, 0x100b, 1, &code);
        let mut player = SidFilePlayer::new(&bytes, 44_100, SidModel::Mos8580).unwrap();
        player.render_frames(50).unwrap();
        let expected = 50.0 / player.frame_rate * PAL_CLOCK / f64::from(0x2012 + 1);
        assert!((player.play_calls as f64 - expected).abs() < 2.0, "{} play calls", player.play_calls);
        assert_eq!(u64::from(player.machine.ram[0x0400]), player.play_calls % 256);
    }

    #[test]
    fn play_routine_sid_writes_take_effect_at_their_instruction_time() {
        let mut code = vec![
            0xa9, 0x00, 0x8d, 0x18, 0xd4, // init: volume off
            0x60, //
            0xa9, 0x00, 0x8d, 0x00, 0xd4, 0xa9, 0x20, 0x8d, 0x01, 0xd4, 0xa9, 0x00, 0x8d, 0x05, 0xd4, 0xa9,
            0xf0, 0x8d, 0x06, 0xd4, 0xa9, 0x21, 0x8d, 0x04, 0xd4,
        ];
        code.extend(std::iter::repeat_n(0xea, 200));
        code.extend_from_slice(&[0xa9, 0x0f, 0x8d, 0x18, 0xd4, 0x60]);
        let bytes = psid(0x1000, 0x1000, 0x1006, 0, &code);
        let mut player = SidFilePlayer::new(&bytes, 44_100, SidModel::Mos8580).unwrap();
        let pcm = player.render_frames(1).unwrap();
        // only the driver's brief full-volume click precedes the note
        let peak = |part: &[i16]| part.iter().map(|&sample| i32::from(sample).abs()).max().unwrap();
        assert!(peak(&pcm[..12]) * 10 < peak(&pcm[60..]), "{} vs {}", peak(&pcm[..12]), peak(&pcm[60..]));
    }

    #[test]
    fn chunked_psid_render_matches_continuous_playback() {
        let bytes = include_bytes!("../../samples/Ikari_Intro.sid");
        let mut continuous = SidFilePlayer::new(bytes, 44_100, SidModel::Mos6581).unwrap();
        let mut chunked = SidFilePlayer::new(bytes, 44_100, SidModel::Mos6581).unwrap();
        let whole = continuous.render_frames(30).unwrap();
        let mut pieces = chunked.render_frames(10).unwrap();
        pieces.extend(chunked.render_frames(20).unwrap());
        assert_eq!(whole, pieces);
    }

    #[test]
    fn skip_frames_lands_on_the_same_audio_as_rendering() {
        let bytes = include_bytes!("../../samples/Mad_Ikari.sid");
        let mut played = SidFilePlayer::new(bytes, 44_100, SidModel::Mos8580).unwrap();
        let mut skipped = SidFilePlayer::new(bytes, 44_100, SidModel::Mos8580).unwrap();
        let whole = played.render_frames(30).unwrap();
        let dropped = skipped.skip_frames(10).unwrap();
        let resumed = skipped.render_frames(20).unwrap();
        assert_eq!(resumed.len(), whole.len() - dropped);
        // Seeking rests the filter and the resampler, so the output restarts from
        // silence and their state settles within a few ms; after 100 ms the two
        // are the same audio.
        let settle = 4_410;
        let (a, b) = (&resumed[settle..], &whole[dropped + settle..]);
        let dot = |x: &[i16], y: &[i16]| x.iter().zip(y).map(|(&p, &q)| f64::from(p) * f64::from(q)).sum::<f64>();
        let correlation = dot(a, b) / (dot(a, a) * dot(b, b)).sqrt();
        assert!(correlation > 0.99, "correlation {correlation:.4}");
    }

    #[test]
    fn osc3_and_env3_read_back_from_the_running_sid() {
        // init: voice 3 saw, fastest attack, gate on; play: copy $D41B / $D41C
        let code = [
            0xa9, 0x00, 0x8d, 0x13, 0xd4, 0xa9, 0xf0, 0x8d, 0x14, 0xd4, 0xa9, 0x40, 0x8d, 0x0f, 0xd4, 0xa9,
            0x21, 0x8d, 0x12, 0xd4, 0x60, // init
            0xad, 0x1b, 0xd4, 0x8d, 0x00, 0x04, 0xad, 0x1c, 0xd4, 0x8d, 0x01, 0x04, 0x60, // play
        ];
        let bytes = psid(0x1000, 0x1000, 0x1015, 0, &code);
        let mut player = SidFilePlayer::new(&bytes, 44_100, SidModel::Mos8580).unwrap();
        let mut oscillator = std::collections::HashSet::new();
        for _ in 0..10 {
            player.render_frames(1).unwrap();
            oscillator.insert(player.machine.ram[0x0400]);
        }
        assert!(oscillator.len() > 3, "OSC3 should follow the saw: {oscillator:?}");
        assert_eq!(player.machine.ram[0x0401], 0xff, "ENV3 after a fast attack");
    }

    #[test]
    fn port_01_banks_io_and_kernal_over_ram() {
        // $01=$34: STA $D418 hits RAM; $01=$35: STA $D418 hits the SID;
        // $01=$35 reads RAM at $FFF0, $01=$37 reads the KERNAL stub there.
        let code = [
            0xa9, 0x34, 0x85, 0x01, 0xa9, 0x05, 0x8d, 0x18, 0xd4, // RAM under I/O
            0xa9, 0x35, 0x85, 0x01, 0xa9, 0x0a, 0x8d, 0x18, 0xd4, // SID
            0xad, 0xf0, 0xff, 0x8d, 0x00, 0x04, // RAM under KERNAL
            0xa9, 0x37, 0x85, 0x01, 0xad, 0xf0, 0xff, 0x8d, 0x01, 0x04, 0x60, // KERNAL stub
        ];
        let bytes = psid(0x1000, 0x1000, 0, 0, &code);
        let mut player = SidFilePlayer::new(&bytes, 44_100, SidModel::Mos8580).unwrap();
        player.machine.ram[0xfff0] = 0x42;
        player.render_frames(1).unwrap();
        assert_eq!(player.machine.ram[0xd418], 0x05);
        assert_eq!(player.machine.sid.read(0x18), 0x0a);
        assert_eq!(player.machine.ram[0x0400], 0x42);
        assert_eq!(player.machine.ram[0x0401], 0x60);
    }

    #[test]
    fn rsid_raster_irq_tune_runs_its_own_interrupts() {
        // init: SEI; vector $0314 -> handler; raster IRQ at line $80; CIA 1 off; CLI; JMP *
        // handler: INC $D019 (ack); INC $0400; JMP $EA81
        let mut full = vec![
            0x78, 0xa9, 0x30, 0x8d, 0x14, 0x03, 0xa9, 0x10, 0x8d, 0x15, 0x03, 0xa9, 0x7f, 0x8d, 0x0d, 0xdc,
            0xad, 0x0d, 0xdc, 0xa9, 0x80, 0x8d, 0x12, 0xd0, 0xa9, 0x1b, 0x8d, 0x11, 0xd0, 0xa9, 0x01, 0x8d,
            0x1a, 0xd0, 0x58, 0x4c, 0x23, 0x10,
        ];
        full.resize(0x30, 0xea);
        full.extend_from_slice(&[0xee, 0x19, 0xd0, 0xee, 0x00, 0x04, 0x4c, 0x81, 0xea]);
        let bytes = rsid(0x1000, 0x1000, &full);
        let mut player = SidFilePlayer::new(&bytes, 44_100, SidModel::Mos8580).unwrap();
        player.render_frames(50).unwrap();
        let count = player.machine.ram[0x0400];
        assert!((49..=51).contains(&count), "{count} raster interrupts in 50 frames");
    }

    #[test]
    fn irq_handler_ending_in_kernal_ea7b_keeps_running() {
        // Like the raster test, but the handler leaves through $EA7B (the KERNAL
        // IRQ tail: JSR SCNKEY, LDA $DC0D, $EA81), as many digi players do.
        let mut full = vec![
            0x78, 0xa9, 0x30, 0x8d, 0x14, 0x03, 0xa9, 0x10, 0x8d, 0x15, 0x03, 0xa9, 0x7f, 0x8d, 0x0d, 0xdc,
            0xad, 0x0d, 0xdc, 0xa9, 0x80, 0x8d, 0x12, 0xd0, 0xa9, 0x1b, 0x8d, 0x11, 0xd0, 0xa9, 0x01, 0x8d,
            0x1a, 0xd0, 0x58, 0x4c, 0x23, 0x10,
        ];
        full.resize(0x30, 0xea);
        full.extend_from_slice(&[0xee, 0x19, 0xd0, 0xee, 0x00, 0x04, 0x4c, 0x7b, 0xea]);
        let bytes = rsid(0x1000, 0x1000, &full);
        let mut player = SidFilePlayer::new(&bytes, 44_100, SidModel::Mos8580).unwrap();
        player.render_frames(50).unwrap();
        assert!(!player.cpu.jammed);
        let count = player.machine.ram[0x0400];
        assert!((49..=51).contains(&count), "{count} raster interrupts in 50 frames");
    }

    #[test]
    fn rsid_with_basic_flag_is_rejected_clearly() {
        let mut bytes = rsid(0x0801, 0, &[0x60, 0x60]);
        bytes[0x77] = 0x02;
        let error = SidFilePlayer::new(&bytes, 44_100, SidModel::Mos8580).err().unwrap();
        assert!(error.contains("BASIC"));
    }

    #[test]
    fn subtune_selection_reaches_init_in_the_accumulator() {
        // init: STA $0400
        let mut bytes = psid(0x1000, 0x1000, 0, 0, &[0x8d, 0x00, 0x04, 0x60]);
        bytes[0x0f] = 3;
        let mut player = SidFilePlayer::with_song(&bytes, 44_100, SidModel::Mos8580, 3).unwrap();
        player.render_frames(1).unwrap();
        assert_eq!(player.song(), 3);
        assert_eq!(player.songs(), 3);
        assert_eq!(player.machine.ram[0x0400], 2);
    }
}

/// Manual check: `SID_SMOKE_DIR=<dir with .sid> SID_SMOKE_OUT=<dir> cargo test --release --lib smoke -- --ignored --nocapture`
/// renders 20 s of every tune to WAV and prints level and render speed.
#[cfg(test)]
mod smoke {
    use super::*;

    #[test]
    #[ignore]
    fn smoke_render_directory() {
        let Ok(dir) = std::env::var("SID_SMOKE_DIR") else { return };
        let out = std::env::var("SID_SMOKE_OUT").ok();
        let mut paths: Vec<_> = std::fs::read_dir(dir).unwrap().flatten().map(|entry| entry.path()).collect();
        paths.sort();
        for path in paths.into_iter().filter(|path| path.extension().is_some_and(|ext| ext.eq_ignore_ascii_case("sid"))) {
            let bytes = std::fs::read(&path).unwrap();
            let name = path.file_stem().unwrap().to_string_lossy().to_string();
            let started = std::time::Instant::now();
            let mut player = match SidFilePlayer::new(&bytes, 44_100, SidModel::Mos6581) {
                Ok(player) => player,
                Err(error) => {
                    println!("{name}: {error}");
                    continue;
                }
            };
            let frames = (20.0 * player.frame_rate) as usize;
            let pcm = player.render_frames(frames).unwrap();
            let elapsed = started.elapsed().as_secs_f64();
            let rms = (pcm.iter().map(|&s| f64::from(s).powi(2)).sum::<f64>() / pcm.len() as f64).sqrt();
            let peak = pcm.iter().map(|&s| i32::from(s).abs()).max().unwrap();
            println!(
                "{name}: {} | rms {rms:.0} peak {peak} | play calls {} | {elapsed:.2}s for 20s",
                &bytes[..4].iter().map(|&b| b as char).collect::<String>(),
                player.play_calls
            );
            if let Some(out) = &out {
                let mut wav = Vec::with_capacity(44 + pcm.len() * 2);
                let data = (pcm.len() * 2) as u32;
                wav.extend_from_slice(b"RIFF");
                wav.extend_from_slice(&(36 + data).to_le_bytes());
                wav.extend_from_slice(b"WAVEfmt ");
                let channels = player.channels() as u8;
                wav.extend_from_slice(&[16, 0, 0, 0, 1, 0, channels, 0]);
                wav.extend_from_slice(&44_100u32.to_le_bytes());
                wav.extend_from_slice(&(88_200 * u32::from(channels)).to_le_bytes());
                wav.extend_from_slice(&[2 * channels, 0, 16, 0]);
                wav.extend_from_slice(b"data");
                wav.extend_from_slice(&data.to_le_bytes());
                pcm.iter().for_each(|sample| wav.extend_from_slice(&sample.to_le_bytes()));
                std::fs::write(std::path::Path::new(out).join(format!("{name}.wav")), wav).unwrap();
            }
        }
    }

    /// Writes a register dump (`dump_registers`) of SID_DUMP_IN to SID_DUMP_OUT,
    /// to check the SID Editor's .sid import on real tunes.
    #[test]
    #[ignore]
    fn dump_registers_to_file() {
        let (Ok(input), Ok(output)) = (std::env::var("SID_DUMP_IN"), std::env::var("SID_DUMP_OUT")) else { return };
        let seconds: f64 = std::env::var("SID_DUMP_SECONDS").ok().and_then(|s| s.parse().ok()).unwrap_or(60.0);
        let bytes = std::fs::read(input).unwrap();
        let mut player = SidFilePlayer::new(&bytes, 44_100, SidModel::Mos8580).unwrap();
        let frames = (seconds * player.frame_rate) as usize;
        std::fs::write(output, player.dump_registers(frames, |_| {})).unwrap();
    }
}
