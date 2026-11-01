//! The SID chip behind the SID Player and the SID Editor's previews: VA SID Core
//! or reSID (the resid-rs crate). Both are clocked cycle by cycle, because the
//! player's 6510 writes the registers between the cycles.

use std::collections::HashMap;
use std::sync::{Mutex, OnceLock};

use resid::{ChipModel, SamplingMethod, Sid};

use crate::sid_core::{SidCore, SidModel, PAL_CLOCK};

#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub enum SidEngine {
    #[default]
    VaCore,
    Resid,
}

impl SidEngine {
    pub fn parse(name: &str) -> Self {
        if name.eq_ignore_ascii_case("resid") {
            SidEngine::Resid
        } else {
            SidEngine::VaCore
        }
    }
}

/// Cycles the external filter needs to reach the chip's idle level (about 0.1 s).
const RESID_SETTLE_CYCLES: u32 = 100_000;
/// How long a value stays on the data bus: reSID's own figure.
const RESID_BUS_TTL: u32 = 0x2000;

#[derive(Clone)]
pub struct ResidChip {
    sid: Sid,
    sample: i16,
    bus_value: u8,
    bus_ttl: u32,
}

impl ResidChip {
    /// A note preview starts a new chip, so the expensive part (the resampler's
    /// FIR tables and the settled output stage) is built once per setup and cloned.
    fn new(model: SidModel, clock_hz: f64, sample_rate: u32) -> Self {
        type Key = (bool, u32, u32);
        static TEMPLATES: OnceLock<Mutex<HashMap<Key, Sid>>> = OnceLock::new();
        let clock = clock_hz.round() as u32;
        let key = (model == SidModel::Mos6581, clock, sample_rate);
        let templates = TEMPLATES.get_or_init(|| Mutex::new(HashMap::new()));
        let mut templates = templates.lock().unwrap_or_else(|poisoned| poisoned.into_inner());
        let sid = templates
            .entry(key)
            .or_insert_with(|| {
                let chip_model = match model {
                    SidModel::Mos6581 => ChipModel::Mos6581,
                    SidModel::Mos8580 => ChipModel::Mos8580,
                };
                let mut sid = Sid::new(chip_model);
                for _ in 0..RESID_SETTLE_CYCLES {
                    sid.clock();
                }
                // also clears the resampler's history
                sid.set_sampling_parameters(SamplingMethod::Resample, clock, sample_rate);
                sid
            })
            .clone();
        Self { sid, sample: 0, bus_value: 0, bus_ttl: 0 }
    }

    fn write(&mut self, register: u8, value: u8) {
        if register < 32 {
            self.bus_value = value;
            self.bus_ttl = RESID_BUS_TTL;
            self.sid.write(register, value);
        }
    }

    /// `Sid::sample` does not age resid-rs's own bus value, so it is kept here.
    fn read(&self, register: u8) -> u8 {
        match register & 0x1f {
            reg @ 0x19..=0x1c => self.sid.read(reg),
            _ => self.bus_value,
        }
    }

    #[inline]
    fn clock(&mut self) -> bool {
        if self.bus_ttl > 0 {
            self.bus_ttl -= 1;
            if self.bus_ttl == 0 {
                self.bus_value = 0;
            }
        }
        let mut buffer = [0i16; 1];
        let (samples, _) = self.sid.sample(1, &mut buffer, 1);
        if samples > 0 {
            self.sample = buffer[0];
        }
        samples > 0
    }
}

pub enum SidChip {
    VaCore(Box<SidCore>),
    Resid(Box<ResidChip>),
}

impl SidChip {
    pub fn new(engine: SidEngine, sample_rate: u32, model: SidModel) -> Self {
        Self::new_with_clock(engine, sample_rate, model, PAL_CLOCK)
    }

    pub fn new_with_clock(engine: SidEngine, sample_rate: u32, model: SidModel, clock_hz: f64) -> Self {
        match engine {
            SidEngine::VaCore => SidChip::VaCore(Box::new(SidCore::new_with_clock(sample_rate, model, clock_hz))),
            SidEngine::Resid => SidChip::Resid(Box::new(ResidChip::new(model, clock_hz, sample_rate.max(8_000)))),
        }
    }

    pub fn write(&mut self, register: u8, value: u8) {
        match self {
            SidChip::VaCore(core) => core.write(register, value),
            SidChip::Resid(chip) => chip.write(register, value),
        }
    }

    pub fn read(&mut self, register: u8) -> u8 {
        match self {
            SidChip::VaCore(core) => core.read(register),
            SidChip::Resid(chip) => chip.read(register),
        }
    }

    /// One SID clock cycle. True when a sample falls due: `output_sample` then
    /// has to be read before the next clock.
    #[inline]
    pub fn clock(&mut self) -> bool {
        match self {
            SidChip::VaCore(core) => core.clock(),
            SidChip::Resid(chip) => chip.clock(),
        }
    }

    #[inline]
    pub fn output_sample(&self) -> i16 {
        match self {
            SidChip::VaCore(core) => core.output_sample(),
            SidChip::Resid(chip) => chip.sample,
        }
    }

    /// Seeking: VA SID Core rests its filter and resampler. reSID keeps running,
    /// its output needs no restart.
    pub fn set_output_enabled(&mut self, enabled: bool) {
        if let SidChip::VaCore(core) = self {
            core.set_output_enabled(enabled);
        }
    }

    pub fn render(&mut self, output: &mut [i16]) {
        let mut filled = 0;
        while filled < output.len() {
            if self.clock() {
                output[filled] = self.output_sample();
                filled += 1;
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const ENGINES: [SidEngine; 2] = [SidEngine::VaCore, SidEngine::Resid];
    const MODELS: [SidModel; 2] = [SidModel::Mos6581, SidModel::Mos8580];

    /// A sawtooth on voice 1 with a fast attack and full volume.
    fn play_note(chip: &mut SidChip) {
        for (register, value) in [(0x18, 0x0f), (0x05, 0x00), (0x06, 0xf0), (0x00, 0x00), (0x01, 0x1d), (0x04, 0x21)] {
            chip.write(register, value);
        }
    }

    fn peak(samples: &[i16]) -> i32 {
        samples.iter().map(|sample| i32::from(*sample).abs()).max().unwrap_or(0)
    }

    #[test]
    fn engine_names() {
        assert_eq!(SidEngine::parse("resid"), SidEngine::Resid);
        assert_eq!(SidEngine::parse("va-core"), SidEngine::VaCore);
        assert_eq!(SidEngine::parse(""), SidEngine::VaCore, "older callers send no engine");
    }

    #[test]
    fn both_engines_play_a_note_on_both_models() {
        for engine in ENGINES {
            for model in MODELS {
                let mut chip = SidChip::new(engine, 44_100, model);
                play_note(&mut chip);
                let mut pcm = vec![0i16; 22_050];
                chip.render(&mut pcm);
                let level = peak(&pcm[4_410..]);
                assert!(level > 2_000, "{engine:?} {model:?}: peak {level}");
            }
        }
    }

    #[test]
    fn a_new_chip_opens_silent() {
        for engine in ENGINES {
            for model in MODELS {
                let mut chip = SidChip::new(engine, 44_100, model);
                let mut pcm = vec![0i16; 4_410];
                chip.render(&mut pcm);
                assert!(peak(&pcm) < 700, "{engine:?} {model:?}: thump of {}", peak(&pcm));
            }
        }
    }

    #[test]
    fn samples_fall_due_at_the_sample_rate() {
        for engine in ENGINES {
            let mut chip = SidChip::new(engine, 44_100, SidModel::Mos8580);
            let cycles = PAL_CLOCK as u32;
            let due = (0..cycles).filter(|_| chip.clock()).count() as i64;
            assert!((due - 44_100).abs() <= 2, "{engine:?}: {due} samples in a second");
        }
    }

    #[test]
    fn resid_reads_voice_3_and_the_bus() {
        let mut chip = SidChip::new(SidEngine::Resid, 44_100, SidModel::Mos8580);
        assert_eq!(chip.read(0x19), 0xff, "no paddles");
        chip.write(0x12, 0x21);
        chip.write(0x0f, 0x40);
        chip.write(0x13, 0x00);
        chip.write(0x14, 0xf0);
        assert_eq!(chip.read(0x00), 0xf0, "a write-only register reads the bus");
        let mut pcm = vec![0i16; 2_000];
        chip.render(&mut pcm);
        assert_ne!(chip.read(0x1b), 0, "OSC3 runs");
        assert_ne!(chip.read(0x1c), 0, "ENV3 rises");
        assert_eq!(chip.read(0x00), 0, "the bus value fades");
    }

    /// Manual: `cargo test --release --lib sid_chip::tests::engine_speed -- --ignored --nocapture`
    #[test]
    #[ignore]
    fn engine_speed() {
        use std::time::Instant;
        for engine in ENGINES {
            for model in MODELS {
                let first = Instant::now();
                let _ = SidChip::new(engine, 44_100, model);
                let first = first.elapsed();
                let created = Instant::now();
                let mut chip = SidChip::new(engine, 44_100, model);
                let created = created.elapsed();
                for voice in 0..3u8 {
                    let base = voice * 7;
                    for (offset, value) in [(5, 0x08), (6, 0xa8), (0, 0x37), (1, 0x12 + voice * 5), (2, 0), (3, 8), (4, 0x41)] {
                        chip.write(base + offset, value);
                    }
                }
                chip.write(0x17, 0xf7);
                chip.write(0x16, 0x60);
                chip.write(0x18, 0x1f);
                let mut pcm = vec![0i16; 44_100 * 20];
                let started = Instant::now();
                chip.render(&mut pcm);
                let seconds = started.elapsed().as_secs_f64();
                println!(
                    "{engine:?} {model:?}: {:.1}x realtime, first chip {:.2?}, next chip {:.2?}",
                    20.0 / seconds, first, created
                );
            }
        }
    }
}
