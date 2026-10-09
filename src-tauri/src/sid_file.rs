//! PSID player driver: runs the tune's 6502 init/play routines and sends their
//! SID register writes to the Rust sound core. RSID needs full C64 emulation.

use crate::sid_core::{SidCore, SidModel, NTSC_CLOCK, PAL_CLOCK, VERSION as SID_CORE_VERSION};
use emulator_6502::{Interface6502, MOS6502};

const SID_REGISTER_COUNT: usize = 0x19;
const RETURN_PC: u16 = 0xfffe;
const MAX_INSTRUCTIONS_PER_CALL: usize = 100_000;
const MAX_SID_WRITES_PER_CALL: usize = 16_384;
const PAL_FRAME_CYCLES: f64 = 63.0 * 312.0;
const NTSC_FRAME_CYCLES: f64 = 65.0 * 263.0;

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
struct SidWrite {
    cycle: usize,
    register: u8,
    value: u8,
}

struct SidMemory {
    ram: Box<[u8; 65_536]>,
    sid_writes: Vec<SidWrite>,
    current_cycle: usize,
    too_many_writes: bool,
}

impl SidMemory {
    fn new() -> Self {
        let mut ram = Box::new([0; 65_536]);
        ram[0x01] = 0x37;
        Self {
            ram,
            sid_writes: Vec::new(),
            current_cycle: 0,
            too_many_writes: false,
        }
    }
}

impl Interface6502 for SidMemory {
    fn read(&mut self, address: u16) -> u8 {
        self.ram[address as usize]
    }

    fn write(&mut self, address: u16, value: u8) {
        self.ram[address as usize] = value;
        if (0xd400..=0xd7ff).contains(&address) {
            let register = ((address - 0xd400) & 0x1f) as usize;
            if register < SID_REGISTER_COUNT {
                if self.sid_writes.len() < MAX_SID_WRITES_PER_CALL {
                    self.sid_writes.push(SidWrite {
                        cycle: self.current_cycle,
                        register: register as u8,
                        value,
                    });
                } else {
                    self.too_many_writes = true;
                }
            }
        }
    }
}

fn be16(bytes: &[u8], offset: usize) -> u16 {
    u16::from_be_bytes([bytes[offset], bytes[offset + 1]])
}

pub struct SidFilePlayer {
    memory: SidMemory,
    core: SidCore,
    play_address: u16,
    sample_rate: usize,
    frame_rate: f64,
    clock_hz: f64,
    frame_number: usize,
}

impl SidFilePlayer {
    pub fn new(bytes: &[u8], sample_rate: u32, model: SidModel) -> Result<Self, String> {
        if bytes.len() < 0x76 || &bytes[..4] != b"PSID" {
            return Err(format!(
                "VA SID Core {SID_CORE_VERSION} currently supports PSID files; RSID needs full C64 emulation."
            ));
        }
        let version = be16(bytes, 4);
        let data_offset = be16(bytes, 6) as usize;
        if !(1..=4).contains(&version) || data_offset < 0x76 || bytes.len() < data_offset + 2 {
            return Err("Invalid PSID header or data offset.".into());
        }
        if version >= 2 && bytes.len() < 0x7c {
            return Err("Truncated PSID v2 header.".into());
        }
        if version >= 3 && (bytes[0x7a] != 0 || bytes[0x7b] != 0) {
            return Err("Multi-SID PSID files are not yet supported by VA SID Core.".into());
        }
        let header_load = be16(bytes, 8);
        let (load_address, data_start) = if header_load == 0 {
            (
                u16::from_le_bytes([bytes[data_offset], bytes[data_offset + 1]]),
                data_offset + 2,
            )
        } else {
            (header_load, data_offset)
        };
        let code = &bytes[data_start..];
        if code.is_empty() || load_address as usize + code.len() > 65_536 {
            return Err("PSID data does not fit C64 memory.".into());
        }
        let init_address = be16(bytes, 0x0a);
        let mut play_address = be16(bytes, 0x0c);
        if init_address == 0 {
            return Err("PSID init address is missing.".into());
        }
        let songs = be16(bytes, 0x0e);
        let start_song = be16(bytes, 0x10);
        if songs == 0 || start_song == 0 || start_song > songs {
            return Err("Invalid PSID song selection.".into());
        }
        let flags = if version >= 2 { be16(bytes, 0x76) } else { 0 };
        let ntsc = (flags >> 2) & 3 == 2;
        let clock_hz = if ntsc { NTSC_CLOCK } else { PAL_CLOCK };
        let speed = u32::from_be_bytes(bytes[0x12..0x16].try_into().unwrap());
        let speed_bit = (start_song - 1).min(31);
        let cia_timing = (speed >> speed_bit) & 1 != 0;
        let frame_rate = if cia_timing {
            60.0
        } else if ntsc {
            clock_hz / NTSC_FRAME_CYCLES
        } else {
            clock_hz / PAL_FRAME_CYCLES
        };
        let mut memory = SidMemory::new();
        memory.ram[load_address as usize..load_address as usize + code.len()].copy_from_slice(code);
        let mut core = SidCore::new_with_clock(sample_rate, model, clock_hz);
        Self::call(&mut memory, init_address, (start_song - 1) as u8)?;
        Self::apply_writes(&mut memory, &mut core);
        if play_address == 0 {
            play_address = u16::from_le_bytes([memory.ram[0x0314], memory.ram[0x0315]]);
            if play_address == 0 {
                return Err("IRQ-driven PSID without a play address is not yet supported.".into());
            }
        }
        Ok(Self {
            memory,
            core,
            play_address,
            sample_rate: sample_rate as usize,
            frame_rate,
            clock_hz,
            frame_number: 0,
        })
    }

    fn call(memory: &mut SidMemory, address: u16, accumulator: u8) -> Result<usize, String> {
        memory.ram[0x01fe] = 0xfd;
        memory.ram[0x01ff] = 0xff;
        memory.too_many_writes = false;
        let mut cpu = MOS6502::new_start(address);
        cpu.set_accumulator(accumulator);
        let mut elapsed = 0usize;
        for _ in 0..MAX_INSTRUCTIONS_PER_CALL {
            if cpu.get_program_counter() == RETURN_PC {
                return if memory.too_many_writes {
                    Err("PSID routine wrote too many SID registers.".into())
                } else {
                    Ok(elapsed)
                };
            }
            memory.current_cycle = elapsed;
            cpu.cycle(memory);
            elapsed += 1;
            while cpu.get_remaining_cycles() != 0 {
                cpu.cycle(memory);
                elapsed += 1;
            }
        }
        Err(format!("PSID routine at ${address:04X} did not return."))
    }

    fn apply_writes(memory: &mut SidMemory, core: &mut SidCore) {
        for write in memory.sid_writes.drain(..) {
            core.write(write.register, write.value);
        }
    }

    pub fn render_frames(&mut self, frames: usize) -> Result<Vec<i16>, String> {
        let mut pcm = Vec::with_capacity(
            (frames as f64 * self.sample_rate as f64 / self.frame_rate).ceil() as usize + 2,
        );
        for _ in 0..frames {
            Self::call(&mut self.memory, self.play_address, 0)?;
            let target = (((self.frame_number + 1) as f64 * self.sample_rate as f64)
                / self.frame_rate)
                .floor() as usize;
            let previous = ((self.frame_number as f64 * self.sample_rate as f64) / self.frame_rate)
                .floor() as usize;
            let count = target - previous;
            let mut chunk = vec![0i16; count];
            let mut rendered = 0usize;
            for write in self.memory.sid_writes.drain(..) {
                let at_sample = ((write.cycle as f64 * self.sample_rate as f64) / self.clock_hz)
                    .floor() as usize;
                let at_sample = at_sample.min(count);
                if at_sample > rendered {
                    self.core.render(&mut chunk[rendered..at_sample]);
                    rendered = at_sample;
                }
                self.core.write(write.register, write.value);
            }
            if rendered < count {
                self.core.render(&mut chunk[rendered..]);
            }
            pcm.extend(chunk);
            self.frame_number += 1;
        }
        Ok(pcm)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn bundled_psid_samples_run_through_va_core() {
        for bytes in [
            include_bytes!("../../samples/Ikari_Intro.sid").as_slice(),
            include_bytes!("../../samples/Mad_Ikari.sid").as_slice(),
        ] {
            let mut player = SidFilePlayer::new(bytes, 44_100, SidModel::Mos6581).unwrap();
            let pcm = player.render_frames(15).unwrap();
            assert_eq!(
                pcm.len(),
                (15.0 * 44_100.0 / player.frame_rate).floor() as usize
            );
            assert!(pcm.iter().any(|&sample| sample != 0));
        }
    }

    #[test]
    fn psid_header_selects_pal_ntsc_and_cia_timing() {
        let source = include_bytes!("../../samples/Ikari_Intro.sid");
        let pal = SidFilePlayer::new(source, 44_100, SidModel::Mos8580).unwrap();
        assert!((pal.frame_rate - PAL_CLOCK / PAL_FRAME_CYCLES).abs() < 0.001);

        let mut ntsc_bytes = source.to_vec();
        ntsc_bytes[0x76] = 0;
        ntsc_bytes[0x77] = 2 << 2;
        let ntsc = SidFilePlayer::new(&ntsc_bytes, 44_100, SidModel::Mos8580).unwrap();
        assert!((ntsc.frame_rate - NTSC_CLOCK / NTSC_FRAME_CYCLES).abs() < 0.001);

        ntsc_bytes[0x15] = 1;
        let mut cia = SidFilePlayer::new(&ntsc_bytes, 44_100, SidModel::Mos8580).unwrap();
        assert_eq!(cia.frame_rate, 60.0);
        assert_eq!(cia.render_frames(15).unwrap().len(), 11_025);
    }

    #[test]
    fn play_routine_sid_writes_take_effect_at_their_instruction_time() {
        let mut code = vec![
            0xa9, 0x00, 0x8d, 0x18, 0xd4, // init: volume off
            0xa9, 0x00, 0x8d, 0x00, 0xd4, 0xa9, 0x20, 0x8d, 0x01, 0xd4, 0xa9, 0x00, 0x8d, 0x05,
            0xd4, 0xa9, 0xf0, 0x8d, 0x06, 0xd4, 0xa9, 0x21, 0x8d, 0x04, 0xd4, 0x60,
        ];
        let play_address = 0x1000 + code.len() as u16;
        code.extend(std::iter::repeat_n(0xea, 200));
        code.extend_from_slice(&[0xa9, 0x0f, 0x8d, 0x18, 0xd4, 0x60]);
        let mut psid = vec![0u8; 0x7c];
        psid[..4].copy_from_slice(b"PSID");
        psid[5] = 2;
        psid[7] = 0x7c;
        psid[8] = 0x10;
        psid[0x0a] = 0x10;
        psid[0x0c..0x0e].copy_from_slice(&play_address.to_be_bytes());
        psid[0x0f] = 1;
        psid[0x11] = 1;
        psid.extend_from_slice(&code);
        let mut player = SidFilePlayer::new(&psid, 44_100, SidModel::Mos8580).unwrap();
        let pcm = player.render_frames(1).unwrap();
        assert!(pcm[..12].iter().all(|&sample| sample == 0));
        assert!(pcm[40..].iter().any(|&sample| sample != 0));
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
}
