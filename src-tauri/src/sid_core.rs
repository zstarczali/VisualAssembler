//! VA SID Core: an original Rust SID register synthesizer.
//!
//! Local Rust adaptation of selected reSID envelope-generator and DAC behaviour
//! for private use with the user's VICE source tree. See VICE src/resid/dac.cc,
//! envelope.cc and envelope.h (Dag Lem, GPL-2.0-or-later).

use std::sync::OnceLock;

pub(crate) const PAL_CLOCK: f64 = 985_248.0;
pub(crate) const NTSC_CLOCK: f64 = 1_022_730.0;
const PHASE_MASK: u32 = 0x00ff_ffff;
const ENV_RATE_PERIOD: [u16; 16] = [
    8, 31, 62, 94, 148, 219, 266, 312, 391, 976, 1953, 3125, 3906, 11719, 19531, 31250,
];
const RESID_8580_INV_Q_X1024: [f32; 16] = [
    1448., 1328., 1218., 1117., 1024., 939., 861., 790., 724., 664., 609., 558., 512., 470., 431.,
    395.,
];
const WAVE_6581_PST: &[u8; 4096] = include_bytes!("../vendor/resid-wave-tables/wave6581_PST.dat");
const WAVE_6581_PS: &[u8; 4096] = include_bytes!("../vendor/resid-wave-tables/wave6581_PS_.dat");
const WAVE_6581_PT: &[u8; 4096] = include_bytes!("../vendor/resid-wave-tables/wave6581_P_T.dat");
const WAVE_6581_ST: &[u8; 4096] = include_bytes!("../vendor/resid-wave-tables/wave6581__ST.dat");
const WAVE_8580_PST: &[u8; 4096] = include_bytes!("../vendor/resid-wave-tables/wave8580_PST.dat");
const WAVE_8580_PS: &[u8; 4096] = include_bytes!("../vendor/resid-wave-tables/wave8580_PS_.dat");
const WAVE_8580_PT: &[u8; 4096] = include_bytes!("../vendor/resid-wave-tables/wave8580_P_T.dat");
const WAVE_8580_ST: &[u8; 4096] = include_bytes!("../vendor/resid-wave-tables/wave8580__ST.dat");
const OUTPUT_SCALE: f32 = i16::MAX as f32 / 8.0;

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum SidModel {
    Mos6581,
    Mos8580,
}

#[derive(Clone, Copy, Debug)]
struct Voice {
    phase: u32,
    noise: u32,
    shift_pipeline: u8,
    pulse_output: u16,
    waveform_output: u16,
    floating_ttl: u32,
    test_reset_cycles: u32,
    env: u8,
    gate: bool,
    env_state: EnvelopeState,
    next_env_state: EnvelopeState,
    state_pipeline: u8,
    envelope_pipeline: u8,
    exponential_pipeline: u8,
    reset_rate_counter: bool,
    rate_counter: u16,
    rate_period: u16,
    exponential_counter: u8,
    exponential_period: u8,
    hold_zero: bool,
    msb_rising: bool,
    test: bool,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
enum EnvelopeState {
    Attack,
    DecaySustain,
    Release,
}
impl Default for Voice {
    fn default() -> Self {
        Self {
            phase: 0x55_5555,
            noise: 0x7f_fffe,
            shift_pipeline: 0,
            pulse_output: 0x0fff,
            waveform_output: 0,
            floating_ttl: 0,
            test_reset_cycles: 0,
            env: 0xaa,
            gate: false,
            env_state: EnvelopeState::Release,
            next_env_state: EnvelopeState::Release,
            state_pipeline: 0,
            envelope_pipeline: 0,
            exponential_pipeline: 0,
            reset_rate_counter: false,
            rate_counter: 0,
            rate_period: ENV_RATE_PERIOD[0],
            exponential_counter: 0,
            exponential_period: 1,
            hold_zero: false,
            msb_rising: false,
            test: false,
        }
    }
}

/// A one-SID audio core. The 25 implemented SID registers occupy `$00..$18`;
/// the remaining internal slots are reserved and read as zero.
pub struct SidCore {
    regs: [u8; 32],
    voices: [Voice; 3],
    model: SidModel,
    waveform_dac: &'static [u16; 4096],
    envelope_dac: &'static [u16; 256],
    sample_rate: f64,
    clock_hz: f64,
    filter_w0: f32,
    filter_inv_q: f32,
    filter_mix_gain: f32,
    low: f32,
    band: f32,
    high: f32,
    mixed: f32,
    external_low: f32,
    external_high: f32,
    cycle_remainder: f64,
}

impl SidCore {
    // A 6581 létrájából hiányzik a lezáró ellenállás; a 8580-é lezárt.
    fn build_dac_table<const N: usize>(two_r: f64, terminated: bool) -> [u16; N] {
        let bits = N.trailing_zeros() as usize;
        debug_assert!(N.is_power_of_two() && bits <= 12);
        let mut bit_weights = [0.0f64; 12];
        for set_bit in 0..bits {
            let mut voltage = 1.0;
            let mut resistance = if terminated { two_r } else { f64::INFINITY };
            for _ in 0..set_bit {
                resistance = if resistance.is_infinite() {
                    1.0 + two_r
                } else {
                    1.0 + two_r * resistance / (two_r + resistance)
                };
            }
            if resistance.is_infinite() {
                resistance = two_r;
            } else {
                resistance = two_r * resistance / (two_r + resistance);
                voltage *= resistance / two_r;
            }
            for _ in set_bit + 1..bits {
                resistance += 1.0;
                let current = voltage / resistance;
                resistance = two_r * resistance / (two_r + resistance);
                voltage = resistance * current;
            }
            bit_weights[set_bit] = voltage;
        }
        let leakage = if terminated { 0.0035 } else { 0.0075 };
        let mut table = [0u16; N];
        for (code, output) in table.iter_mut().enumerate() {
            let mut voltage = 0.0;
            for (bit, weight) in bit_weights[..bits].iter().enumerate() {
                voltage += if code & (1 << bit) != 0 {
                    *weight
                } else {
                    leakage * weight
                };
            }
            *output = ((N - 1) as f64 * voltage + 0.5) as u16;
        }
        table
    }

    fn cutoff_dac_6581() -> &'static [u16; 2048] {
        static DAC: OnceLock<[u16; 2048]> = OnceLock::new();
        DAC.get_or_init(|| Self::build_dac_table(2.20, false))
    }

    fn waveform_dac(model: SidModel) -> &'static [u16; 4096] {
        static MOS6581: OnceLock<[u16; 4096]> = OnceLock::new();
        static MOS8580: OnceLock<[u16; 4096]> = OnceLock::new();
        match model {
            SidModel::Mos6581 => MOS6581.get_or_init(|| Self::build_dac_table(2.20, false)),
            SidModel::Mos8580 => MOS8580.get_or_init(|| Self::build_dac_table(2.00, true)),
        }
    }

    fn envelope_dac(model: SidModel) -> &'static [u16; 256] {
        static MOS6581: OnceLock<[u16; 256]> = OnceLock::new();
        static MOS8580: OnceLock<[u16; 256]> = OnceLock::new();
        match model {
            SidModel::Mos6581 => MOS6581.get_or_init(|| Self::build_dac_table(2.20, false)),
            SidModel::Mos8580 => MOS8580.get_or_init(|| Self::build_dac_table(2.00, true)),
        }
    }

    pub fn new(sample_rate: u32, model: SidModel) -> Self {
        Self::new_with_clock(sample_rate, model, PAL_CLOCK)
    }

    pub(crate) fn new_with_clock(sample_rate: u32, model: SidModel, clock_hz: f64) -> Self {
        let mut sid = Self {
            regs: [0; 32],
            voices: [Voice::default(); 3],
            model,
            waveform_dac: Self::waveform_dac(model),
            envelope_dac: Self::envelope_dac(model),
            sample_rate: sample_rate.max(8_000) as f64,
            clock_hz,
            filter_w0: 0.,
            filter_inv_q: 0.,
            filter_mix_gain: 1.,
            low: 0.,
            band: 0.,
            high: 0.,
            mixed: 0.,
            external_low: 0.,
            external_high: 0.,
            cycle_remainder: 0.,
        };
        sid.update_filter_coefficients();
        sid
    }
    pub fn write(&mut self, register: u8, value: u8) {
        if register >= 32 {
            return;
        }
        let r = register as usize;
        let previous = self.regs[r];
        self.regs[r] = value;
        if (0x15..=0x17).contains(&r) && previous != value {
            self.update_filter_coefficients();
        }
        if r < 21 && r % 7 == 4 {
            let voice = &mut self.voices[r / 7];
            if previous & 8 != 0 && value & 8 == 0 {
                let old_waveform = previous >> 4;
                let new_waveform = value >> 4;
                let pre_writeback = old_waveform > 8
                    && !(old_waveform == 0xc
                        && (self.model == SidModel::Mos6581
                            || (new_waveform != 0x9 && new_waveform != 0xe)))
                    && !(self.model == SidModel::Mos6581
                        && matches!((old_waveform & 3, new_waveform & 3), (1, 2) | (2, 1)));
                if pre_writeback {
                    Self::writeback_noise_bits(voice);
                }
            }
            if previous & 0xf0 != 0 && value & 0xf0 == 0 {
                voice.floating_ttl = match self.model {
                    SidModel::Mos6581 => 182_000,
                    SidModel::Mos8580 => 4_400_000,
                };
            }
            voice.test = value & 8 != 0;
            if value & 8 != 0 && previous & 8 == 0 {
                voice.phase = 0;
                voice.shift_pipeline = 0;
                voice.pulse_output = 0x0fff;
                voice.test_reset_cycles = match self.model {
                    SidModel::Mos6581 => 35_000,
                    SidModel::Mos8580 => 2_519_864,
                };
            } else if value & 8 == 0 && previous & 8 != 0 {
                voice.test_reset_cycles = 0;
                let feedback = (!(voice.noise >> 17)) & 1;
                voice.noise = ((voice.noise << 1) | feedback) & 0x7f_ffff;
            }
        }
        if r < 21 && (r % 7 == 2 || r % 7 == 3) {
            let base = (r / 7) * 7;
            let pw = u16::from(self.regs[base + 2]) | (u16::from(self.regs[base + 3] & 15) << 8);
            self.voices[r / 7].pulse_output = if self.voices[r / 7].phase >> 12 >= u32::from(pw) {
                0x0fff
            } else {
                0
            };
        }
        if r < 21 && r % 7 == 4 {
            let voice = &mut self.voices[r / 7];
            let gate = value & 1 != 0;
            if gate != voice.gate {
                voice.gate = gate;
                voice.next_env_state = if gate {
                    EnvelopeState::Attack
                } else {
                    EnvelopeState::Release
                };
                if gate {
                    voice.env_state = EnvelopeState::DecaySustain;
                    voice.rate_period = ENV_RATE_PERIOD[(self.regs[r + 1] & 15) as usize];
                    voice.state_pipeline = 2;
                    if voice.reset_rate_counter || voice.exponential_pipeline == 2 {
                        voice.envelope_pipeline =
                            if voice.exponential_period == 1 || voice.exponential_pipeline == 2 {
                                2
                            } else {
                                4
                            };
                    } else if voice.exponential_pipeline == 1 {
                        voice.state_pipeline = 3;
                    }
                } else {
                    voice.state_pipeline = if voice.envelope_pipeline > 0 { 3 } else { 2 };
                }
            }
        } else if r < 21 && r % 7 == 5 {
            let voice = &mut self.voices[r / 7];
            if voice.env_state == EnvelopeState::Attack {
                voice.rate_period = ENV_RATE_PERIOD[(value >> 4) as usize];
            } else if voice.env_state == EnvelopeState::DecaySustain {
                voice.rate_period = ENV_RATE_PERIOD[(value & 15) as usize];
            }
        } else if r < 21 && r % 7 == 6 {
            let voice = &mut self.voices[r / 7];
            if voice.env_state == EnvelopeState::Release {
                voice.rate_period = ENV_RATE_PERIOD[(value & 15) as usize];
            }
        }
    }

    /// Renders signed 16-bit mono samples from the current SID register state.
    pub fn render(&mut self, output: &mut [i16]) {
        let cycles_per_sample = self.clock_hz / self.sample_rate;
        let chip_gain = match self.model {
            SidModel::Mos6581 => 1.05,
            SidModel::Mos8580 => 0.98,
        };
        for sample in output {
            self.cycle_remainder += cycles_per_sample;
            let cycles = self.cycle_remainder as usize;
            self.cycle_remainder -= cycles as f64;
            for _ in 0..cycles {
                for (index, voice) in self.voices.iter_mut().enumerate() {
                    Self::clock_envelope(index, voice, &self.regs);
                }
                self.clock_oscillators();
                self.clock_filter();
            }
            *sample = (self.mixed * OUTPUT_SCALE * chip_gain)
                .clamp(i16::MIN as f32, i16::MAX as f32) as i16;
        }
    }

    fn clock_oscillators(&mut self) {
        let previous = [
            self.voices[0].phase,
            self.voices[1].phase,
            self.voices[2].phase,
        ];
        for index in 0..3 {
            let base = index * 7;
            let control = self.regs[base + 4];
            let voice = &mut self.voices[index];
            if control & 8 != 0 {
                voice.phase = 0;
                voice.msb_rising = false;
                if voice.test_reset_cycles > 0 {
                    voice.test_reset_cycles -= 1;
                    if voice.test_reset_cycles == 0 {
                        voice.noise |= 1;
                        voice.noise |= voice.noise << 1;
                        voice.noise &= 0x7f_ffff;
                        if voice.noise != 0x7f_ffff {
                            voice.test_reset_cycles = match self.model {
                                SidModel::Mos6581 => 1_000,
                                SidModel::Mos8580 => 315_000,
                            };
                        }
                    }
                }
                continue;
            }
            let frequency = u16::from_le_bytes([self.regs[base], self.regs[base + 1]]) as u32;
            let next = voice.phase.wrapping_add(frequency) & PHASE_MASK;
            voice.msb_rising = previous[index] & 0x800000 == 0 && next & 0x800000 != 0;
            let shift_due = if previous[index] & 0x080000 == 0 && next & 0x080000 != 0 {
                voice.shift_pipeline = 2;
                false
            } else if voice.shift_pipeline > 0 {
                voice.shift_pipeline -= 1;
                voice.shift_pipeline == 0
            } else {
                false
            };
            if shift_due {
                let feedback = ((voice.noise >> 22) ^ (voice.noise >> 17)) & 1;
                voice.noise = ((voice.noise << 1) | feedback) & 0x7f_ffff;
            }
            voice.phase = next;
        }
        // Oscillators are clocked in parallel; apply hard sync only after all
        // rising edges for this SID cycle have been determined.
        for source in 0..3 {
            let destination = (source + 1) % 3;
            let source_control = self.regs[source * 7 + 4];
            let destination_control = self.regs[destination * 7 + 4];
            let preceding = (source + 2) % 3;
            if self.voices[source].msb_rising
                && destination_control & 2 != 0
                && !(source_control & 2 != 0 && self.voices[preceding].msb_rising)
            {
                self.voices[destination].phase = 0;
            }
        }
    }

    fn clock_noise_writeback(&mut self, index: usize) {
        let control = self.regs[index * 7 + 4];
        let waveform = control >> 4;
        if waveform <= 8 || control & 8 != 0 || self.voices[index].shift_pipeline == 1 {
            return;
        }

        Self::writeback_noise_bits(&mut self.voices[index]);
    }

    fn writeback_noise_bits(voice: &mut Voice) {
        let value = voice.waveform_output;
        let mask =
            (1 << 20) | (1 << 18) | (1 << 14) | (1 << 11) | (1 << 9) | (1 << 5) | (1 << 2) | 1;
        let written = (u32::from(value & 0x800) << 9)
            | (u32::from(value & 0x400) << 8)
            | (u32::from(value & 0x200) << 5)
            | (u32::from(value & 0x100) << 3)
            | (u32::from(value & 0x080) << 2)
            | (u32::from(value & 0x040) >> 1)
            | (u32::from(value & 0x020) >> 3)
            | (u32::from(value & 0x010) >> 4);
        voice.noise = (voice.noise & !mask) | (voice.noise & mask & written);
    }

    fn clock_envelope(index: usize, voice: &mut Voice, regs: &[u8; 32]) {
        if voice.state_pipeline > 0 {
            voice.state_pipeline -= 1;
            match voice.next_env_state {
                EnvelopeState::Attack if voice.state_pipeline == 0 => {
                    voice.env_state = EnvelopeState::Attack;
                    voice.rate_period = ENV_RATE_PERIOD[(regs[index * 7 + 5] >> 4) as usize];
                    voice.hold_zero = false;
                }
                EnvelopeState::Release
                    if (voice.env_state == EnvelopeState::Attack && voice.state_pipeline == 0)
                        || (voice.env_state == EnvelopeState::DecaySustain
                            && voice.state_pipeline == 1) =>
                {
                    voice.env_state = EnvelopeState::Release;
                    voice.rate_period = ENV_RATE_PERIOD[(regs[index * 7 + 6] & 15) as usize];
                }
                _ => {}
            }
        }

        if voice.envelope_pipeline > 0 {
            voice.envelope_pipeline -= 1;
            if voice.envelope_pipeline == 0 && !voice.hold_zero {
                match voice.env_state {
                    EnvelopeState::Attack => {
                        voice.env = voice.env.wrapping_add(1);
                        if voice.env == 0xff {
                            voice.env_state = EnvelopeState::DecaySustain;
                            voice.rate_period =
                                ENV_RATE_PERIOD[(regs[index * 7 + 5] & 15) as usize];
                        }
                    }
                    EnvelopeState::DecaySustain | EnvelopeState::Release => {
                        voice.env = voice.env.wrapping_sub(1);
                    }
                }
                voice.exponential_period = match voice.env {
                    0xff => 1,
                    0x5d => 2,
                    0x36 => 4,
                    0x1a => 8,
                    0x0e => 16,
                    0x06 => 30,
                    0 => {
                        voice.hold_zero = true;
                        1
                    }
                    _ => voice.exponential_period,
                };
            }
        }

        let exponential_complete = if voice.exponential_pipeline > 0 {
            voice.exponential_pipeline -= 1;
            voice.exponential_pipeline == 0
        } else {
            false
        };
        if exponential_complete {
            voice.exponential_counter = 0;
            let sustain = (regs[index * 7 + 6] >> 4) * 0x11;
            if (voice.env_state == EnvelopeState::DecaySustain && voice.env != sustain)
                || voice.env_state == EnvelopeState::Release
            {
                voice.envelope_pipeline = 1;
            }
        } else if voice.reset_rate_counter {
            voice.rate_counter = 0;
            voice.reset_rate_counter = false;
            if voice.env_state == EnvelopeState::Attack {
                voice.exponential_counter = 0;
                voice.envelope_pipeline = 2;
            } else if !voice.hold_zero {
                voice.exponential_counter = voice.exponential_counter.wrapping_add(1);
                if voice.exponential_counter == voice.exponential_period {
                    voice.exponential_pipeline = if voice.exponential_period == 1 { 1 } else { 2 };
                }
            }
        }

        if voice.rate_counter != voice.rate_period {
            voice.rate_counter += 1;
            if voice.rate_counter & 0x8000 != 0 {
                voice.rate_counter = (voice.rate_counter + 1) & 0x7fff;
            }
        } else {
            voice.reset_rate_counter = true;
        }
    }

    fn render_voice(&mut self, index: usize) -> f32 {
        let base = index * 7;
        let control = self.regs[base + 4];
        let voice = &self.voices[index];
        let envelope = self.envelope_dac[voice.env as usize] as f32 / 255.0;
        let waveform = control >> 4;
        if waveform == 0 {
            let voice = &mut self.voices[index];
            if voice.floating_ttl > 0 {
                voice.floating_ttl -= 1;
                if voice.floating_ttl == 0 {
                    voice.waveform_output &= voice.waveform_output >> 1;
                    if voice.waveform_output != 0 {
                        voice.floating_ttl = match self.model {
                            SidModel::Mos6581 => 1_500,
                            SidModel::Mos8580 => 50_000,
                        };
                    }
                }
            }
            return ((self.waveform_dac[voice.waveform_output as usize] as f32 / 2047.5) - 1.)
                * envelope;
        }
        let mut phase = voice.phase;
        if control & 4 != 0 && control & 0x20 == 0 {
            let source = (index + 2) % 3;
            if self.voices[source].phase & 0x800000 == 0 {
                phase ^= 0x800000;
            }
        }
        let ix = ((phase >> 12) & 0x0fff) as usize;
        let mut wave = match waveform & 7 {
            0x1 => {
                (((phase ^ if phase & 0x800000 != 0 { PHASE_MASK } else { 0 }) >> 11) & 0x0ffe)
                    as u16
            }
            0x2 => (voice.phase >> 12) as u16,
            0x3 => Self::combined_wave_table(self.model, 0x3, ix),
            0x0 | 0x4 => 0x0fff,
            0x5 => Self::combined_wave_table(self.model, 0x5, ix),
            0x6 => Self::combined_wave_table(self.model, 0x6, ix),
            0x7 => Self::combined_wave_table(self.model, 0x7, ix),
            _ => 0,
        };
        if waveform & 4 != 0 {
            wave &= voice.pulse_output;
        }
        if waveform & 8 != 0 {
            let noise = (((voice.noise & 0x100000) >> 9)
                | ((voice.noise & 0x040000) >> 8)
                | ((voice.noise & 0x004000) >> 5)
                | ((voice.noise & 0x000800) >> 3)
                | ((voice.noise & 0x000200) >> 2)
                | ((voice.noise & 0x000020) << 1)
                | ((voice.noise & 0x000004) << 3)
                | ((voice.noise & 0x000001) << 4)) as u16;
            wave &= noise;
            if waveform & 0x0c == 0x0c {
                wave = Self::noise_pulse(self.model, wave);
            }
        }
        self.voices[index].waveform_output = wave;
        if self.model == SidModel::Mos6581 && waveform & 0x2 != 0 && waveform & 0xd != 0 {
            self.voices[index].phase &= (u32::from(wave) << 12) | 0x7f_ffff;
        }
        ((self.waveform_dac[wave as usize] as f32 / 2047.5) - 1.) * envelope
    }

    fn noise_pulse(model: SidModel, value: u16) -> u16 {
        match model {
            SidModel::Mos6581 if value < 0x0f00 => 0,
            SidModel::Mos6581 => value & (value << 1) & (value << 2),
            SidModel::Mos8580 if value < 0x0fc0 => value & (value << 1),
            SidModel::Mos8580 => 0x0fc0,
        }
    }

    fn combined_wave_table(model: SidModel, waveform: u8, index: usize) -> u16 {
        let table: &[u8; 4096] = match (model, waveform) {
            (SidModel::Mos6581, 0x3) => WAVE_6581_ST,
            (SidModel::Mos6581, 0x5) => WAVE_6581_PT,
            (SidModel::Mos6581, 0x6) => WAVE_6581_PS,
            (SidModel::Mos6581, 0x7) => WAVE_6581_PST,
            (SidModel::Mos8580, 0x3) => WAVE_8580_ST,
            (SidModel::Mos8580, 0x5) => WAVE_8580_PT,
            (SidModel::Mos8580, 0x6) => WAVE_8580_PS,
            (SidModel::Mos8580, 0x7) => WAVE_8580_PST,
            _ => return 0,
        };
        u16::from(table[index]) << 4
    }

    fn update_filter_coefficients(&mut self) {
        let cutoff = u16::from(self.regs[0x15] & 7) | (u16::from(self.regs[0x16]) << 3);
        let resonance = (self.regs[0x17] >> 4) as usize;
        self.filter_mix_gain = if self.model == SidModel::Mos6581 {
            1.0 + resonance.saturating_sub(7) as f32 * 0.016
        } else {
            1.0
        };
        (self.filter_w0, self.filter_inv_q) = match self.model {
            SidModel::Mos8580 => (
                (82_355u32 * (u32::from(cutoff) + 1) >> 11) as f32 / 1_048_576.0,
                RESID_8580_INV_Q_X1024[resonance] / 1024.0,
            ),
            // reSID's 6581 uses a nonlinear transistor/op-amp model and
            // measured cutoff DAC data. The DAC ladder is reproduced here;
            // the voltage-dependent transistor/op-amp response is still an
            // approximation.
            SidModel::Mos6581 => {
                let dac = Self::cutoff_dac_6581();
                let fraction = dac[cutoff as usize] as f32 / dac[2047] as f32;
                (
                    // A helyi reSID PCM-összehasonlításból illesztett, nem tranzisztorszintű görbe.
                    (fraction.powi(4) * 0.3).clamp(0.0017, 0.055),
                    (1.42 - resonance as f32 * 0.075).max(0.25),
                )
            }
        };
    }

    fn clock_filter(&mut self) {
        let mode_vol = self.regs[0x18];
        let routing = self.regs[0x17] & 0x0f;
        let mut routed = 0.0f32;
        let mut direct = 0.0f32;
        for index in 0..3 {
            let sample = self.render_voice(index);
            if routing & (1 << index) != 0 {
                routed += sample;
            } else if index != 2 || mode_vol & 0x80 == 0 {
                direct += sample;
            }
        }

        self.band -= self.filter_w0 * self.high;
        self.low -= self.filter_w0 * self.band;
        self.high = self.band * self.filter_inv_q - self.low - routed;

        let mode = mode_vol & 0x70;
        let mut filtered = 0.0;
        // A 6581 analóg keverőjének módonként eltérő erősítése, reSID-mintákhoz illesztve.
        let (low_gain, band_gain, high_gain) = match self.model {
            SidModel::Mos6581 => (0.81, 0.86, 0.48),
            SidModel::Mos8580 => (1.0, 1.0, 1.0),
        };
        if mode & 0x10 != 0 {
            filtered += self.low * low_gain;
        }
        if mode & 0x20 != 0 {
            filtered += self.band * band_gain;
        }
        if mode & 0x40 != 0 {
            filtered += self.high * high_gain;
        }
        filtered *= self.filter_mix_gain;
        let sid_output = (direct + filtered) * (mode_vol & 15) as f32 / 15.0;
        // reSID's external RC stage is clocked once per SID cycle: 10 kΩ / 1 nF
        // low-pass followed by 1 kΩ / 10 μF high-pass.
        self.external_low += (12.0 / 128.0) * (sid_output - self.external_low);
        self.external_high += (13.0 / 131_072.0) * (self.external_low - self.external_high);
        self.mixed = self.external_low - self.external_high;
        for index in 0..3 {
            self.clock_noise_writeback(index);
        }
        for index in 0..3 {
            let base = index * 7;
            let width = u16::from(self.regs[base + 2]) | (u16::from(self.regs[base + 3] & 15) << 8);
            self.voices[index].pulse_output =
                if self.voices[index].test || self.voices[index].phase >> 12 >= u32::from(width) {
                    0x0fff
                } else {
                    0
                };
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn creates_audible_saw_voice() {
        let mut sid = SidCore::new(44_100, SidModel::Mos8580);
        sid.write(0, 0);
        sid.write(1, 0x20);
        sid.write(5, 0);
        sid.write(6, 0xf0);
        sid.write(4, 0x21);
        sid.write(0x18, 15);
        let mut audio = [0i16; 512];
        sid.render(&mut audio);
        assert!(audio.iter().any(|sample| *sample != 0));
    }

    #[test]
    fn ntsc_clock_advances_oscillator_faster_than_pal() {
        let mut pal = SidCore::new_with_clock(44_100, SidModel::Mos8580, PAL_CLOCK);
        let mut ntsc = SidCore::new_with_clock(44_100, SidModel::Mos8580, NTSC_CLOCK);
        for sid in [&mut pal, &mut ntsc] {
            sid.write(0, 0xe8);
            sid.write(1, 0x03);
        }
        pal.render(&mut [0; 441]);
        ntsc.render(&mut [0; 441]);
        assert!(ntsc.voices[0].phase > pal.voices[0].phase);
    }

    #[test]
    fn reset_oscillator_state_matches_resid_startup() {
        let sid = SidCore::new(44_100, SidModel::Mos8580);
        for voice in sid.voices {
            assert_eq!(voice.phase, 0x55_5555);
            assert_eq!(voice.noise, 0x7f_fffe);
        }
    }

    #[test]
    fn mos6581_lowpass_cutoff_has_a_sharp_midrange_transition() {
        let rms = |cutoff: u16| {
            let mut sid = SidCore::new(44_100, SidModel::Mos6581);
            sid.write(0, 0);
            sid.write(1, 0x50);
            sid.write(4, 0x21);
            sid.write(5, 0x11);
            sid.write(6, 0x80);
            sid.write(0x15, (cutoff & 7) as u8);
            sid.write(0x16, (cutoff >> 3) as u8);
            sid.write(0x17, 0x61);
            sid.write(0x18, 0x1f);
            let mut pcm = [0i16; 8_820];
            sid.render(&mut pcm);
            let power: f64 = pcm[2_205..]
                .iter()
                .map(|&sample| f64::from(sample).powi(2))
                .sum();
            (power / (pcm.len() - 2_205) as f64).sqrt()
        };
        assert!(rms(64) > 10.0);
        assert!(rms(1_024) > rms(512) * 10.0);
    }

    #[test]
    fn mos6581_high_resonance_rms_stays_near_local_resid_reference() {
        // Fixed-stream cases 16 and 18-20 in scripts/sid-compare/reference.cpp.
        // Reference RMS values come from the local VICE reSID build at 44.1 kHz.
        for (scenario, reference_rms) in [(16, 1708.0), (18, 1431.0), (19, 2485.0), (20, 1337.0)] {
            let mut sid = SidCore::new(44_100, SidModel::Mos6581);
            let mut pcm = [0i16; 44_100];
            for frame in 0..50 {
                sid.write(0, 0);
                sid.write(1, 0x50);
                sid.write(2, 0);
                sid.write(3, 8);
                sid.write(4, match scenario { 18 => 0x11, 19 => 0x41, _ => 0x21 });
                sid.write(5, 0x11);
                sid.write(6, 0x80);
                let cutoff = if scenario == 20 { 1500u16 } else { 1024u16 };
                sid.write(0x15, (cutoff & 7) as u8);
                sid.write(0x16, (cutoff >> 3) as u8);
                sid.write(0x17, 0xf1);
                sid.write(0x18, 0x1f);
                sid.render(&mut pcm[frame * 882..(frame + 1) * 882]);
            }
            let window = &pcm[2_205..];
            let mean = window.iter().map(|&sample| f64::from(sample)).sum::<f64>() / window.len() as f64;
            let rms = (window.iter().map(|&sample| (f64::from(sample) - mean).powi(2)).sum::<f64>() / window.len() as f64).sqrt();
            assert!((rms / reference_rms - 1.0).abs() < 0.08, "scenario {scenario}: RMS {rms:.1}, reSID {reference_rms:.1}");
        }
    }

    #[test]
    fn filter_coefficients_follow_cutoff_and_resonance_writes() {
        let mut sid = SidCore::new(44_100, SidModel::Mos6581);
        let initial_cutoff = sid.filter_w0;
        let initial_resonance = sid.filter_inv_q;
        sid.write(0x16, 0x80);
        assert_ne!(sid.filter_w0, initial_cutoff);
        assert_eq!(sid.filter_inv_q, initial_resonance);
        sid.write(0x17, 0xf0);
        assert_ne!(sid.filter_inv_q, initial_resonance);
        let unchanged = (sid.filter_w0, sid.filter_inv_q);
        sid.write(0x18, 0x1f);
        assert_eq!((sid.filter_w0, sid.filter_inv_q), unchanged);
    }

    #[test]
    fn oscillator_sync_resets_destination_on_source_msb_rise() {
        let mut sid = SidCore::new(44_100, SidModel::Mos8580);
        sid.regs[4] = 0x02;
        sid.regs[14] = 0x20;
        sid.voices[0].phase = 0x012345;
        sid.voices[2].phase = 0x7f_fff0;
        sid.clock_oscillators();
        assert_eq!(sid.voices[0].phase, 0);
    }

    #[test]
    fn sync_source_edge_suppresses_chained_sync() {
        let mut sid = SidCore::new(44_100, SidModel::Mos8580);
        sid.regs[4] = 0x02;
        sid.regs[18] = 0x02;
        sid.regs[14] = 0x20;
        sid.regs[7] = 0x20;
        sid.voices[0].phase = 0x012345;
        sid.voices[1].phase = 0x7f_fff0;
        sid.voices[2].phase = 0x7f_fff0;
        sid.clock_oscillators();
        assert_ne!(sid.voices[0].phase, 0);
    }

    #[test]
    fn envelope_decays_to_sid_sustain_ladder_level() {
        let mut sid = SidCore::new(44_100, SidModel::Mos8580);
        sid.write(5, 0x00); // fastest attack and decay
        sid.write(6, 0x80); // sustain 8 maps to $88, not $80
        sid.write(4, 0x21); // gate + saw
        let mut audio = vec![0i16; 13_000];
        sid.render(&mut audio);
        assert_eq!(sid.voices[0].env, 0x88);
        assert_eq!(sid.voices[0].env_state, EnvelopeState::DecaySustain);
    }

    #[test]
    fn measured_combined_wave_luts_are_model_specific() {
        assert!((0..4096).any(|index| {
            SidCore::combined_wave_table(SidModel::Mos6581, 0x7, index)
                != SidCore::combined_wave_table(SidModel::Mos8580, 0x7, index)
        }));
    }

    #[test]
    fn mos6581_combined_saw_can_pull_accumulator_msb_low() {
        let index = (2048..4096)
            .find(|&index| SidCore::combined_wave_table(SidModel::Mos6581, 0x3, index) & 0x800 == 0)
            .expect("a measured 6581 table must contain an MSB-low sample");
        let phase = (index as u32) << 12;
        let mut sid = SidCore::new(44_100, SidModel::Mos6581);
        sid.regs[4] = 0x30; // triangle + saw
        sid.voices[0].phase = phase;
        sid.render_voice(0);
        assert_eq!(sid.voices[0].phase & 0x7f_ffff, phase & 0x7f_ffff);
        assert_eq!(sid.voices[0].phase & 0x80_0000, 0);

        let mut sid_8580 = SidCore::new(44_100, SidModel::Mos8580);
        sid_8580.regs[4] = 0x30;
        sid_8580.voices[0].phase = phase;
        sid_8580.render_voice(0);
        assert_eq!(sid_8580.voices[0].phase, phase);
    }

    #[test]
    fn mos6581_cutoff_dac_has_missing_termination_discontinuity() {
        let dac = SidCore::cutoff_dac_6581();
        assert!(dac[1].abs_diff(dac[2]) <= 1);
        assert!(dac[2047] > dac[1024]);
    }

    #[test]
    fn model_dacs_preserve_6581_leakage_and_ladder_discontinuity() {
        let wave_6581 = SidCore::waveform_dac(SidModel::Mos6581);
        let wave_8580 = SidCore::waveform_dac(SidModel::Mos8580);
        let envelope_6581 = SidCore::envelope_dac(SidModel::Mos6581);
        assert!(wave_6581[0] > wave_8580[0]);
        assert!(wave_6581[1].abs_diff(wave_6581[2]) <= 1);
        assert!(envelope_6581[0] > 0);
    }

    #[test]
    fn envelope_gate_transitions_match_resid_cycle_trace() {
        let mut sid = SidCore::new(44_100, SidModel::Mos8580);
        sid.write(5, 0x00);
        sid.write(6, 0x80);
        let reference = [
            (0, 170),
            (5, 170),
            (10, 170),
            (15, 171),
            (20, 171),
            (25, 172),
            (30, 173),
            (35, 173),
            (40, 174),
            (45, 174),
            (49, 175),
            (50, 175),
            (51, 175),
            (55, 175),
            (60, 174),
            (65, 174),
            (70, 173),
            (75, 172),
            (80, 172),
            (85, 171),
            (90, 171),
            (95, 170),
            (99, 170),
            (100, 170),
            (101, 170),
            (105, 169),
            (110, 169),
            (115, 170),
            (120, 171),
        ];
        for cycle in 0..=120 {
            if cycle == 0 || cycle == 100 {
                sid.write(4, 0x21);
            } else if cycle == 50 {
                sid.write(4, 0x20);
            }
            let observed = sid.voices[0].env;
            SidCore::clock_envelope(0, &mut sid.voices[0], &sid.regs);
            if let Some((_, expected)) = reference.iter().find(|(at, _)| *at == cycle) {
                assert_eq!(observed, *expected, "cycle {cycle}");
            }
        }
    }

    #[test]
    fn envelope_rate_change_waits_for_resid_counter_wrap() {
        let mut sid = SidCore::new(44_100, SidModel::Mos8580);
        sid.write(5, 0x90);
        sid.write(6, 0x80);
        sid.write(4, 0x21);
        let mut changes = Vec::new();
        let mut last = 0xaa;
        for cycle in 0..=32_800 {
            if cycle == 200 {
                sid.write(5, 0x00);
            }
            let observed = sid.voices[0].env;
            SidCore::clock_envelope(0, &mut sid.voices[0], &sid.regs);
            if observed != last {
                changes.push((cycle, observed));
                last = observed;
            }
        }
        assert_eq!(
            &changes[..3],
            &[(32_779, 171), (32_788, 172), (32_797, 173)]
        );
    }

    #[test]
    fn noise_combined_waveform_corrupts_shift_register_gradually() {
        let mut sid = SidCore::new(44_100, SidModel::Mos8580);
        sid.regs[4] = 0x91; // saw + noise
        sid.voices[0].phase = 0x40_0000;
        let initial = sid.voices[0].noise;
        sid.render_voice(0);
        assert_ne!(sid.voices[0].waveform_output, 0);
        sid.clock_noise_writeback(0);
        assert_ne!(sid.voices[0].noise, initial);
        assert_ne!(sid.voices[0].noise, 0);
    }

    #[test]
    fn test_bit_fall_writes_combined_waveform_back_before_noise_shift() {
        let mut sid = SidCore::new(44_100, SidModel::Mos8580);
        sid.write(4, 0x98); // noise + triangle, TEST high
        sid.voices[0].noise = 0x7f_ffff;
        sid.voices[0].waveform_output = 0;
        sid.write(4, 0x90);
        assert_eq!(sid.voices[0].noise, 0x57_6bb4);
    }

    #[test]
    fn mos6581_pulse_noise_skips_test_fall_pre_writeback() {
        let mut sid = SidCore::new(44_100, SidModel::Mos6581);
        sid.write(4, 0xc8); // pulse + noise, TEST high
        sid.voices[0].noise = 0x7f_ffff;
        sid.voices[0].waveform_output = 0;
        sid.write(4, 0xc0);
        assert_eq!(sid.voices[0].noise, 0x7f_fffe);
    }

    #[test]
    fn floating_dac_holds_then_fades_after_waveform_is_switched_off() {
        let mut sid = SidCore::new(44_100, SidModel::Mos6581);
        sid.voices[0].phase = 0xff_f000;
        sid.voices[0].env = 0xff;
        sid.write(4, 0x20);
        sid.render_voice(0);
        let held = sid.voices[0].waveform_output;
        assert_eq!(held, 0x0fff);
        sid.write(4, 0);
        sid.render_voice(0);
        assert_eq!(sid.voices[0].waveform_output, held);
        sid.voices[0].floating_ttl = 1;
        sid.render_voice(0);
        assert_eq!(sid.voices[0].waveform_output, held & (held >> 1));
    }

    #[test]
    fn noise_shift_waits_two_cycles_after_accumulator_edge() {
        let mut sid = SidCore::new(44_100, SidModel::Mos8580);
        sid.regs[0] = 2;
        sid.voices[0].phase = 0x07_ffff;
        let initial = sid.voices[0].noise;
        sid.clock_oscillators();
        assert_eq!(sid.voices[0].noise, initial);
        sid.clock_oscillators();
        assert_eq!(sid.voices[0].noise, initial);
        sid.clock_oscillators();
        assert_ne!(sid.voices[0].noise, initial);
    }

    #[test]
    fn raised_sustain_wraps_from_zero_like_sid_counter() {
        let mut sid = SidCore::new(44_100, SidModel::Mos8580);
        sid.voices[0].env = 0;
        sid.voices[0].env_state = EnvelopeState::DecaySustain;
        sid.voices[0].envelope_pipeline = 1;
        sid.regs[6] = 0x80;
        SidCore::clock_envelope(0, &mut sid.voices[0], &sid.regs);
        assert_eq!(sid.voices[0].env, 0xff);
    }

    #[test]
    fn pulse_comparator_reaches_output_one_cycle_later() {
        let mut sid = SidCore::new(44_100, SidModel::Mos8580);
        sid.voices[0].phase = 0x7f_fff0;
        sid.voices[0].env = 0xff;
        sid.write(2, 0);
        sid.write(3, 8);
        sid.write(0, 0x20);
        sid.write(4, 0x40);
        assert_eq!(sid.voices[0].pulse_output, 0);
        sid.clock_oscillators();
        assert!(sid.render_voice(0) < 0.);
        sid.clock_filter();
        assert!(sid.render_voice(0) > 0.);
    }

    #[test]
    fn split_render_keeps_phase_envelope_and_filter_state() {
        let mut continuous = SidCore::new(44_100, SidModel::Mos8580);
        continuous.write(0, 0x34);
        continuous.write(1, 0x12);
        continuous.write(4, 0x21);
        continuous.write(6, 0xa0);
        continuous.write(0x18, 0x0f);
        let mut split = SidCore::new(44_100, SidModel::Mos8580);
        for register in 0..25 {
            split.write(register, continuous.regs[register as usize]);
        }
        let mut one = [0i16; 1200];
        let mut first = [0i16; 400];
        let mut second = [0i16; 800];
        continuous.render(&mut one);
        split.render(&mut first);
        split.render(&mut second);
        assert_eq!(&one[..400], &first);
        assert_eq!(&one[400..], &second);
    }
}
