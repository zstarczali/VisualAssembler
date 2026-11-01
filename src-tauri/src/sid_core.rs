//! VA SID Core: an original Rust SID register synthesizer. Its output is
//! verified against mos6581_8580 as a measurement reference (scripts/sid-reference).
//!
//! Third-party parts (mos6581_8580 by Dag Lem, VICE src/mos6581_8580, GPL-2.0-or-later):
//! the measured combined-waveform tables in vendor/sid-wave-tables, the
//! 8580 resonance table FILTER_8580_INV_Q_X1024, the R-2R DAC ladder formula
//! (dac.cc) and the MOS 6581 filter / mixer / volume model (`Model6581`,
//! ported from filter.h, filter.cc and spline.h).
//! The chip runs one call of `clock()` per SID cycle, so a cycle-locked
//! machine (see `sid_file`) can read OSC3 / ENV3 at the right moment.

use std::sync::{Arc, Mutex, OnceLock};

pub(crate) const VERSION: &str = "1.2";
pub(crate) const PAL_CLOCK: f64 = 985_248.0;
pub(crate) const NTSC_CLOCK: f64 = 1_022_730.0;
const PHASE_MASK: u32 = 0x00ff_ffff;
const ENV_RATE_PERIOD: [u16; 16] = [
    8, 31, 62, 94, 148, 219, 266, 312, 391, 976, 1953, 3125, 3906, 11719, 19531, 31250,
];
const FILTER_8580_INV_Q_X1024: [f32; 16] = [
    1448., 1328., 1218., 1117., 1024., 939., 861., 790., 724., 664., 609., 558., 512., 470., 431.,
    395.,
];
const WAVE_6581_PST: &[u8; 4096] = include_bytes!("../vendor/sid-wave-tables/wave6581_PST.dat");
const WAVE_6581_PS: &[u8; 4096] = include_bytes!("../vendor/sid-wave-tables/wave6581_PS_.dat");
const WAVE_6581_PT: &[u8; 4096] = include_bytes!("../vendor/sid-wave-tables/wave6581_P_T.dat");
const WAVE_6581_ST: &[u8; 4096] = include_bytes!("../vendor/sid-wave-tables/wave6581__ST.dat");
const WAVE_8580_PST: &[u8; 4096] = include_bytes!("../vendor/sid-wave-tables/wave8580_PST.dat");
const WAVE_8580_PS: &[u8; 4096] = include_bytes!("../vendor/sid-wave-tables/wave8580_PS_.dat");
const WAVE_8580_PT: &[u8; 4096] = include_bytes!("../vendor/sid-wave-tables/wave8580_P_T.dat");
const WAVE_8580_ST: &[u8; 4096] = include_bytes!("../vendor/sid-wave-tables/wave8580__ST.dat");
const OUTPUT_SCALE: f32 = i16::MAX as f32 / 8.0;
const FIR_PHASES: usize = 128;
const FIR_ATTENUATION_DB: f64 = 80.0;

/// Kaiser-windowed sinc low-pass. Every phase holds `taps` coefficients in
/// chronological order (oldest input first), normalised to unity DC gain.
struct Fir {
    taps: usize,
    phases: usize,
    coefficients: Vec<f32>,
}

impl Fir {
    fn bessel_i0(x: f64) -> f64 {
        let half = x / 2.0;
        let (mut sum, mut term, mut k) = (1.0, 1.0, 1.0);
        loop {
            term *= (half / k) * (half / k);
            sum += term;
            if term < sum * 1e-12 {
                return sum;
            }
            k += 1.0;
        }
    }

    fn design(rate: f64, pass: f64, stop: f64, phases: usize) -> Fir {
        let dw = 2.0 * std::f64::consts::PI * (stop - pass) / rate;
        let beta = 0.1102 * (FIR_ATTENUATION_DB - 8.7);
        let estimate = ((FIR_ATTENUATION_DB - 7.95) / (2.285 * dw)).ceil() as usize;
        let taps = (estimate + 7) & !7;
        let center = taps as f64 / 2.0;
        let cutoff = (pass + stop) / 2.0 / rate;
        let i0_beta = Self::bessel_i0(beta);
        let mut coefficients = vec![0f32; phases * taps];
        for phase in 0..phases {
            let offset = phase as f64 / phases as f64;
            let mut values = vec![0f64; taps];
            for (k, value) in values.iter_mut().enumerate() {
                let x = (taps - 1 - k) as f64 + offset - center;
                let ratio = x / center;
                if ratio.abs() >= 1.0 {
                    continue;
                }
                let arg = std::f64::consts::PI * 2.0 * cutoff * x;
                let sinc = if arg.abs() < 1e-12 { 1.0 } else { arg.sin() / arg };
                *value = sinc * Self::bessel_i0(beta * (1.0 - ratio * ratio).sqrt()) / i0_beta;
            }
            let sum: f64 = values.iter().sum();
            for (out, value) in coefficients[phase * taps..(phase + 1) * taps].iter_mut().zip(values) {
                *out = (value / sum) as f32;
            }
        }
        Fir { taps, phases, coefficients }
    }

    fn phase(&self, fraction: f64) -> &[f32] {
        let phase = ((fraction * self.phases as f64 + 0.5) as usize).min(self.phases - 1);
        &self.coefficients[phase * self.taps..(phase + 1) * self.taps]
    }
}

/// Two-stage band limiting from the SID clock to the output rate, with the
/// band edges of mos6581_8580's SAMPLE_RESAMPLE (passband up to 20 kHz, or 0.9 * fs/2 at low
/// rates; stopband from fs - passband, so aliases only land above the
/// passband). Stage 1 decimates by an integer factor to roughly 2.5 * fs,
/// stage 2 interpolates the fractional output instants from 128 phases.
/// Splitting keeps the cost near 15 M multiply-adds per second at 44.1 kHz.
struct Resampler {
    decimation: usize,
    stage1: Fir,
    stage2: Fir,
}

impl Resampler {
    fn shared(clock_hz: f64, sample_rate: f64) -> Arc<Resampler> {
        static CACHE: OnceLock<Mutex<Vec<((u64, u64), Arc<Resampler>)>>> = OnceLock::new();
        let key = (clock_hz.to_bits(), sample_rate.to_bits());
        let mut cache = CACHE.get_or_init(|| Mutex::new(Vec::new())).lock().unwrap();
        if let Some((_, resampler)) = cache.iter().find(|(k, _)| *k == key) {
            return resampler.clone();
        }
        let pass = if 2.0 * 20_000.0 / sample_rate >= 0.9 { 0.45 * sample_rate } else { 20_000.0 };
        let stop = sample_rate - pass;
        let decimation = ((clock_hz / (2.5 * sample_rate)) as usize).max(1);
        let intermediate = clock_hz / decimation as f64;
        let resampler = Arc::new(Resampler {
            decimation,
            stage1: Fir::design(clock_hz, pass, intermediate - stop, 1),
            stage2: Fir::design(intermediate, pass, stop, FIR_PHASES),
        });
        cache.push((key, resampler.clone()));
        resampler
    }
}

/// Input history of one FIR stage, stored twice so every window is contiguous.
struct History {
    data: Box<[f32]>,
    size: usize,
    pos: usize,
}

impl History {
    fn new(taps: usize) -> Self {
        let size = taps.next_power_of_two();
        Self { data: vec![0f32; size * 2].into_boxed_slice(), size, pos: 0 }
    }

    fn push(&mut self, value: f32) {
        self.data[self.pos] = value;
        self.data[self.pos + self.size] = value;
        self.pos = (self.pos + 1) & (self.size - 1);
    }

    fn filter(&self, coefficients: &[f32]) -> f32 {
        let end = self.pos + self.size;
        dot(&self.data[end - coefficients.len()..end], coefficients)
    }
}

// Plain indexed loop: also fast in unoptimised (tauri dev) builds, and
// vectorised by the optimiser through the four independent accumulators.
fn dot(samples: &[f32], coefficients: &[f32]) -> f32 {
    let n = coefficients.len();
    let samples = &samples[..n];
    let (mut a0, mut a1, mut a2, mut a3) = (0f32, 0f32, 0f32, 0f32);
    let mut i = 0;
    while i < n {
        a0 += samples[i] * coefficients[i];
        a1 += samples[i + 1] * coefficients[i + 1];
        a2 += samples[i + 2] * coefficients[i + 2];
        a3 += samples[i + 3] * coefficients[i + 3];
        i += 4;
    }
    (a0 + a1) + (a2 + a3)
}

fn table_at(table: &[u16], index: i32) -> i32 {
    i32::from(table[(index.max(0) as usize).min(table.len() - 1)])
}

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

/// MOS 6581 filter and output stage, ported from mos6581_8580 1.0 (VICE
/// src/mos6581_8580/filter.h, filter.cc, spline.h; Dag Lem, GPL-2.0-or-later):
/// measured op-amp transfer curve, NMOS "resistor" gain / summer / mixer
/// stages solved with Newton-Raphson, and the cutoff VCR in the EKV
/// transistor model. Integer arithmetic follows mos6581_8580, including its
/// wrapping 32-bit intermediate products.
struct Model6581 {
    kvddt: i32,
    n_snake: i32,
    voice_scale_s14: i32,
    voice_dc: i32,
    opamp_rev: Vec<u16>,
    summer: Vec<u16>,
    gain: Vec<u16>,
    mixer: Vec<u16>,
    f0_dac: Vec<u16>,
    vcr_kvg: Vec<u16>,
    vcr_n_ids_term: Vec<u16>,
}

#[derive(Clone, Copy, Default)]
struct OpAmp {
    vx: u16,
    dvx: i16,
}

const OPAMP_VOLTAGE_6581: [(f64, f64); 35] = [
    (0.81, 10.31), (0.81, 10.31), (2.40, 10.31), (2.60, 10.30), (2.70, 10.29), (2.80, 10.26),
    (2.90, 10.17), (3.00, 10.04), (3.10, 9.83), (3.20, 9.58), (3.30, 9.32), (3.50, 8.69),
    (3.70, 8.00), (4.00, 6.89), (4.40, 5.21), (4.54, 4.54), (4.60, 4.19), (4.80, 3.00),
    (4.90, 2.30), (4.95, 2.03), (5.00, 1.88), (5.05, 1.77), (5.10, 1.69), (5.20, 1.58),
    (5.40, 1.44), (5.60, 1.33), (5.80, 1.26), (6.00, 1.21), (6.40, 1.12), (7.00, 1.02),
    (7.50, 0.97), (8.50, 0.89), (10.00, 0.81), (10.31, 0.81), (10.31, 0.81),
];
/// Start of the summer table for 0..=4 summed inputs (2 + n input "resistors").
const SUMMER_OFFSET: [usize; 5] = [0, 2 << 16, 5 << 16, 9 << 16, 14 << 16];
/// Start of the mixer table for 0..=7 mixed inputs.
const MIXER_OFFSET: [usize; 8] =
    [0, 1, 1 + (1 << 16), 1 + (3 << 16), 1 + (6 << 16), 1 + (10 << 16), 1 + (15 << 16), 1 + (21 << 16)];

impl Model6581 {
    fn get() -> &'static Model6581 {
        static MODEL: OnceLock<Model6581> = OnceLock::new();
        MODEL.get_or_init(Self::build)
    }

    /// mos6581_8580 spline.h: piecewise cubic through the points, plotted at integer x.
    fn interpolate(points: &[(f64, f64)], plot: &mut [u32]) {
        let mut put = |x: f64, y: f64| {
            let index = x as usize;
            if index < plot.len() {
                plot[index] = (if y < 0.0 { 0.0 } else { y } + 0.5) as u32;
            }
        };
        let last = points.len() - 1;
        let mut p0 = 0;
        while p0 + 2 != last {
            let (x0, y0) = points[p0];
            let (x1, y1) = points[p0 + 1];
            let (x2, y2) = points[p0 + 2];
            let (x3, y3) = points[p0 + 3];
            p0 += 1;
            if x1 == x2 {
                continue;
            }
            let (k1, k2);
            if x0 == x1 && x2 == x3 {
                k1 = (y2 - y1) / (x2 - x1);
                k2 = k1;
            } else if x0 == x1 {
                k2 = (y3 - y1) / (x3 - x1);
                k1 = (3.0 * (y2 - y1) / (x2 - x1) - k2) / 2.0;
            } else if x2 == x3 {
                k1 = (y2 - y0) / (x2 - x0);
                k2 = (3.0 * (y2 - y1) / (x2 - x1) - k1) / 2.0;
            } else {
                k1 = (y2 - y0) / (x2 - x0);
                k2 = (y3 - y1) / (x3 - x1);
            }
            let dx = x2 - x1;
            let dy = y2 - y1;
            let a = ((k1 + k2) - 2.0 * dy / dx) / (dx * dx);
            let b = ((k2 - k1) / dx - 3.0 * (x1 + x2) * a) / 2.0;
            let c = k1 - (3.0 * x1 * a + 2.0 * b) * x1;
            let d = y1 - ((x1 * a + b) * x1 + c) * x1;
            let res = 1.0;
            let mut y = ((a * x1 + b) * x1 + c) * x1 + d;
            let mut dy = (3.0 * a * (x1 + res) + 2.0 * b) * x1 * res + ((a * res + b) * res + c) * res;
            let mut d2y = (6.0 * a * (x1 + res) + 2.0 * b) * res * res;
            let d3y = 6.0 * a * res * res * res;
            let mut x = x1;
            while x <= x2 {
                put(x, y);
                y += dy;
                dy += d2y;
                d2y += d3y;
                x += res;
            }
        }
    }

    /// mos6581_8580 Filter::solve_gain: output of an inverting NMOS op-amp stage with
    /// gain n (scaled by 2^7) for input vi, starting from (and updating) x.
    fn solve_gain(opamp: &[OpAmp], n: i32, vi: i32, x: &mut i32, kvddt: i32, ak0: i32, bk0: i32) -> i32 {
        let (mut ak, mut bk) = (ak0, bk0);
        let a = n + (1 << 7);
        let b = kvddt;
        let b_vi = (b - vi).max(0) as u32;
        let c = n.wrapping_mul((b_vi.wrapping_mul(b_vi) >> 12) as i32);
        loop {
            let xk = *x;
            let entry = opamp[*x as usize];
            let vx = i32::from(entry.vx);
            let dvx = i32::from(entry.dvx);
            let vo = (vx + (*x << 1) - (1 << 16)).clamp(0, (1 << 16) - 1);
            let b_vx = (b - vx).max(0);
            let b_vo = (b - vo).max(0);
            let f = a
                .wrapping_mul(((b_vx as u32).wrapping_mul(b_vx as u32) >> 12) as i32)
                .wrapping_sub(c)
                .wrapping_sub(((b_vo as u32).wrapping_mul(b_vo as u32) >> 5) as i32);
            let df = ((b_vo.wrapping_mul(dvx + (1 << 11)) >> 1)
                .wrapping_sub(a.wrapping_mul(b_vx.wrapping_mul(dvx) >> 8)))
                >> 14;
            if df != 0 {
                *x -= f / df;
            }
            if *x == xk {
                return vo;
            }
            if f < 0 {
                ak = xk;
            } else {
                bk = xk;
            }
            if *x <= ak || *x >= bk {
                *x = (ak + bk) >> 1;
                if *x == ak {
                    return vo;
                }
            }
        }
    }

    fn build() -> Model6581 {
        let (vdd, vth, ut, k, ucox, wl_vcr, wl_snake, cap) =
            (12.18, 1.31, 26.0e-3, 1.0, 20e-6, 9.0, 1.0 / 115.0, 470e-12);
        let points = &OPAMP_VOLTAGE_6581;
        let vmin = points[0].0;
        let opamp_max = points[0].1;
        let kvddt_v = k * (vdd - vth);
        let vmax = if kvddt_v < opamp_max { opamp_max } else { kvddt_v };
        let denorm = vmax - vmin;
        let norm = 1.0 / denorm;
        let n16 = norm * f64::from((1u32 << 16) - 1);
        let n31 = norm * f64::from((1u32 << 31) - 1);
        let vo_n16 = n16 as i32;
        let n14 = norm * f64::from(1u32 << 14);
        let voice_scale_s14 = (n14 * 1.5) as i32;
        let voice_dc = (n16 * (5.0 - vmin)) as i32;
        let kvddt = (n16 * (kvddt_v - vmin) + 0.5) as i32;
        let n_snake =
            (denorm * f64::from(1 << 13) * (ucox / (2.0 * k) * wl_snake * 1.0e-6 / cap) + 0.5) as i32;

        let size = points.len();
        let mut scaled = vec![(0.0, 0.0); size];
        for (i, &(vi, vo)) in points.iter().enumerate() {
            scaled[size - 1 - i] = (
                f64::from(((n16 * (vo - vi) + f64::from(1 << 16)) / 2.0 + 0.5) as i32),
                n31 * (vi - vmin),
            );
        }
        if scaled[size - 1].0 >= f64::from(1 << 16) {
            scaled[size - 1].0 = f64::from((1 << 16) - 1);
            scaled[size - 2].0 = f64::from((1 << 16) - 1);
        }
        let mut voltages = vec![0u32; 1 << 16];
        Self::interpolate(&scaled, &mut voltages);
        let ak = scaled[0].0 as i32;
        let bk = scaled[size - 1].0 as i32;
        let mut opamp = vec![OpAmp::default(); 1 << 16];
        let mut f = voltages[ak as usize];
        for j in ak as usize..=bk as usize {
            let fp = f;
            f = voltages[j];
            let df = f.wrapping_sub(fp) as i32;
            opamp[j].vx = if f > (0xffff << 15) { 0xffff } else { (f >> 15) as u16 };
            opamp[j].dvx = (df >> (15 - 11)) as i16;
        }

        let mut gain = vec![0u16; 16 << 16];
        for n8 in 0..16usize {
            let mut x = ak;
            for vi in 0..1 << 16 {
                gain[(n8 << 16) + vi as usize] =
                    Self::solve_gain(&opamp, (n8 as i32) << 4, vi, &mut x, kvddt, ak, bk) as u16;
            }
        }
        let mut summer = vec![0u16; 20 << 16];
        let mut offset = 0usize;
        for inputs in 0..5 {
            let idiv = 2 + inputs;
            let mut x = ak;
            for vi in 0..(idiv << 16) {
                summer[offset + vi as usize] =
                    Self::solve_gain(&opamp, idiv << 7, vi / idiv, &mut x, kvddt, ak, bk) as u16;
            }
            offset += (idiv << 16) as usize;
        }
        let mut mixer = vec![0u16; 1 + (28 << 16)];
        let (mut offset, mut length) = (0usize, 1i32);
        for inputs in 0..8 {
            let n_idiv = (inputs << 7) * 8 / 6;
            let idiv = inputs.max(1);
            let mut x = ak;
            for vi in 0..length {
                mixer[offset + vi as usize] =
                    Self::solve_gain(&opamp, n_idiv, vi / idiv, &mut x, kvddt, ak, bk) as u16;
            }
            offset += length as usize;
            length = (inputs + 1) << 16;
        }
        let opamp_rev = opamp.iter().map(|entry| entry.vx).collect();

        let dac = SidCore::cutoff_dac_6581();
        let f0_dac = dac
            .iter()
            .map(|&value| (n16 * (6.65 + f64::from(value) * 2.63 / 2048.0 - vmin) + 0.5) as u16)
            .collect();

        let n16_vcr = f64::from(vo_n16);
        let vmin_vcr = n16_vcr * vmin;
        let kvddt_vcr = n16_vcr * (k * (vdd - vth));
        let vcr_kvg = (0..1u32 << 16)
            .map(|i| {
                let vg = kvddt_vcr - (f64::from(i) * f64::from(1u32 << 16)).sqrt();
                (k * vg - vmin_vcr + 0.5) as u16
            })
            .collect();
        let kvt = k * vth;
        let is = 2.0 * ucox * ut * ut / k * wl_vcr;
        let n_is = n16_vcr / 2.0 * 1.0e-6 / cap * is;
        let vcr_n_ids_term = (0..1u32 << 16)
            .map(|kvg_vx| {
                let log_term = ((f64::from(kvg_vx) / n16_vcr - kvt) / (2.0 * ut)).exp().ln_1p();
                (n_is * log_term * log_term) as u16
            })
            .collect();

        Model6581 {
            kvddt,
            n_snake,
            voice_scale_s14,
            voice_dc,
            opamp_rev,
            summer,
            gain,
            mixer,
            f0_dac,
            vcr_kvg,
            vcr_n_ids_term,
        }
    }

    /// mos6581_8580 Filter::solve_integrate_6581 for one cycle: integrator with the
    /// "snake" resistor and the cutoff VCR in parallel.
    fn integrate(&self, vddt_vw_2: u32, vi: i32, vx: &mut i32, vc: &mut i32) -> i32 {
        let vgst = (self.kvddt - *vx) as u32;
        let vgdt = (self.kvddt - vi) as u32;
        let vgdt_2 = vgdt.wrapping_mul(vgdt);
        let n_i_snake = self
            .n_snake
            .wrapping_mul((vgst.wrapping_mul(vgst).wrapping_sub(vgdt_2) as i32) >> 15);
        let kvg_index = (vddt_vw_2.wrapping_add(vgdt_2 >> 1) >> 16) as usize;
        let kvg = i32::from(self.vcr_kvg[kvg_index.min(0xffff)]);
        let vgs = (kvg - *vx).max(0) as usize;
        let vgd = (kvg - vi).max(0) as usize;
        let n_i_vcr = ((i32::from(self.vcr_n_ids_term[vgs.min(0xffff)])
            - i32::from(self.vcr_n_ids_term[vgd.min(0xffff)])) as u32)
            .wrapping_shl(15) as i32;
        *vc = vc.wrapping_sub(n_i_snake.wrapping_add(n_i_vcr));
        *vx = i32::from(self.opamp_rev[((*vc >> 15) + (1 << 15)).clamp(0, 0xffff) as usize]);
        *vx + (*vc >> 14)
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
    filter_w0: f32,
    filter_inv_q: f32,
    voice_samples: [f32; 3],
    model6581: Option<&'static Model6581>,
    vhp: i32,
    vbp: i32,
    vbp_x: i32,
    vbp_vc: i32,
    vlp: i32,
    vlp_x: i32,
    vlp_vc: i32,
    vddt_vw_2: u32,
    eight_div_q: usize,
    low: f32,
    band: f32,
    high: f32,
    mixed: f32,
    external_low: f32,
    external_high: f32,
    resampler: Arc<Resampler>,
    history1: History,
    history2: History,
    decimation_count: usize,
    output_enabled: bool,
    cycles_per_sample: f64,
    cycles_to_sample: u32,
    sample_fraction: f64,
    due_fraction: f64,
    due_age: usize,
    bus_value: u8,
    bus_ttl: u32,
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

    #[cfg(test)]
    pub fn new(sample_rate: u32, model: SidModel) -> Self {
        Self::new_with_clock(sample_rate, model, PAL_CLOCK)
    }

    pub(crate) fn new_with_clock(sample_rate: u32, model: SidModel, clock_hz: f64) -> Self {
        let sample_rate = sample_rate.max(8_000) as f64;
        let resampler = Resampler::shared(clock_hz, sample_rate);
        let cycles_per_sample = clock_hz / sample_rate;
        let mut sid = Self {
            regs: [0; 32],
            voices: [Voice::default(); 3],
            model,
            waveform_dac: Self::waveform_dac(model),
            envelope_dac: Self::envelope_dac(model),
            filter_w0: 0.,
            filter_inv_q: 0.,
            voice_samples: [0.; 3],
            model6581: (model == SidModel::Mos6581).then(Model6581::get),
            vhp: 0,
            vbp: 0,
            vbp_x: 0,
            vbp_vc: 0,
            vlp: 0,
            vlp_x: 0,
            vlp_vc: 0,
            vddt_vw_2: 0,
            eight_div_q: 0,
            low: 0.,
            band: 0.,
            high: 0.,
            mixed: 0.,
            external_low: 0.,
            external_high: 0.,
            history1: History::new(resampler.stage1.taps),
            history2: History::new(resampler.stage2.taps),
            resampler,
            decimation_count: 0,
            output_enabled: true,
            cycles_per_sample,
            cycles_to_sample: cycles_per_sample.floor() as u32 + 1,
            sample_fraction: cycles_per_sample.fract(),
            due_fraction: 0.,
            due_age: 0,
            bus_value: 0,
            bus_ttl: 0,
        };
        sid.update_filter_coefficients();
        sid.settle_output();
        sid
    }

    /// Starts the external filter at the chip's idle DC level, so a new core
    /// does not open with the power-on thump of the 6581 output stage.
    fn settle_output(&mut self) {
        let mut idle = 0.0;
        for _ in 0..20_000 {
            idle = self.mix_output();
        }
        self.external_low = idle;
        self.external_high = idle;
        self.mixed = 0.;
    }
    pub fn write(&mut self, register: u8, value: u8) {
        if register >= 32 {
            return;
        }
        let r = register as usize;
        self.touch_bus(value);
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

    #[cfg(test)]
    /// Renders signed 16-bit mono samples from the current SID register state.
    pub fn render(&mut self, output: &mut [i16]) {
        let mut filled = 0;
        while filled < output.len() {
            if self.clock() {
                output[filled] = self.output_sample();
                filled += 1;
            }
        }
    }

    /// Advances the chip by one SID clock cycle. Returns true when an output
    /// sample falls due; `output_sample` must then be read before the next clock.
    pub fn clock(&mut self) -> bool {
        for (index, voice) in self.voices.iter_mut().enumerate() {
            Self::clock_envelope(index, voice, &self.regs);
        }
        self.clock_oscillators();
        // Seeking (output off) skips the voice outputs, the filter and the mixer,
        // the bulk of a cycle: envelopes and oscillators keep the tune's state, and
        // the output restarts from silence anyway (set_output_enabled).
        if self.output_enabled {
            self.clock_filter();
        }
        if self.bus_ttl > 0 {
            self.bus_ttl -= 1;
            if self.bus_ttl == 0 {
                self.bus_value = 0;
            }
        }
        // the decimation phase keeps running while the output is off
        self.decimation_count += 1;
        let decimate = self.decimation_count == self.resampler.decimation;
        if decimate {
            self.decimation_count = 0;
        }
        if self.output_enabled {
            self.history1.push(self.mixed);
            if decimate {
                let decimated = self.history1.filter(&self.resampler.stage1.coefficients);
                self.history2.push(decimated);
            }
        }
        self.cycles_to_sample -= 1;
        if self.cycles_to_sample != 0 {
            return false;
        }
        self.due_fraction = self.sample_fraction;
        self.due_age = self.decimation_count;
        let next = self.sample_fraction + self.cycles_per_sample;
        self.cycles_to_sample = next.floor() as u32;
        self.sample_fraction = next.fract();
        true
    }

    /// Seeking: with the output off the envelopes and oscillators keep running,
    /// the voice outputs, filter and resampler rest; the output restarts from
    /// silence (a fade-in of the FIR length) when enabled.
    pub fn set_output_enabled(&mut self, enabled: bool) {
        if enabled && !self.output_enabled {
            self.history1 = History::new(self.resampler.stage1.taps);
            self.history2 = History::new(self.resampler.stage2.taps);
        }
        self.output_enabled = enabled;
    }

    /// The band-limited output at the instant reported by the last `clock()`.
    /// The FIR adds a fixed latency of half its length (about 27 samples at 44.1 kHz).
    pub fn output_sample(&self) -> i16 {
        // the 6581 output stage already delivers mos6581_8580's 16-bit output level
        let chip_gain = match self.model {
            SidModel::Mos6581 => 1.0,
            SidModel::Mos8580 => 0.98,
        };
        // Instant of the due sample after the newest stage-1 output, in stage-1 samples.
        let decimation = self.resampler.decimation as f64;
        let fraction = (self.due_age as f64 + self.due_fraction) / decimation;
        let value = self.history2.filter(self.resampler.stage2.phase(fraction));
        (value * OUTPUT_SCALE * chip_gain).clamp(i16::MIN as f32, i16::MAX as f32) as i16
    }

    /// CPU read of a SID register. $19/$1A (no paddles) read $FF, $1B is the top
    /// of voice 3's waveform, $1C its envelope; the write-only registers return
    /// the last value on the data bus until it fades (mos6581_8580's simplification).
    pub fn read(&mut self, register: u8) -> u8 {
        let value = match register & 0x1f {
            0x19 | 0x1a => 0xff,
            0x1b => (self.voices[2].waveform_output >> 4) as u8,
            0x1c => self.voices[2].env,
            _ => return self.bus_value,
        };
        self.touch_bus(value);
        value
    }

    fn touch_bus(&mut self, value: u8) {
        self.bus_value = value;
        self.bus_ttl = match self.model {
            SidModel::Mos6581 => 0x1d00,
            SidModel::Mos8580 => 0xa_2000,
        };
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
        if let Some(model) = self.model6581 {
            let vw = i32::from(model.f0_dac[cutoff as usize]);
            let span = (model.kvddt - vw) as u32;
            self.vddt_vw_2 = span.wrapping_mul(span) >> 1;
            self.eight_div_q = !resonance & 0x0f;
        } else {
            self.filter_w0 = (82_355u32 * (u32::from(cutoff) + 1) >> 11) as f32 / 1_048_576.0;
            self.filter_inv_q = FILTER_8580_INV_Q_X1024[resonance] / 1024.0;
        }
    }

    /// mos6581_8580's 6581 voice level: (waveform DAC - $380) * envelope DAC, scaled
    /// into the op-amp voltage range and raised to the voice DC level.
    fn voice_level_6581(&self, model: &Model6581, index: usize) -> i32 {
        let voice = &self.voices[index];
        let wave = i32::from(self.waveform_dac[voice.waveform_output as usize]) - 0x380;
        let level = wave * i32::from(self.envelope_dac[voice.env as usize]);
        (level.wrapping_mul(model.voice_scale_s14) >> 18) + model.voice_dc
    }

    /// One cycle of the filter and the audio mixer / volume stage, from the
    /// voice outputs already computed for this cycle. Returns the chip output
    /// before the C64's external RC filter.
    fn mix_output(&mut self) -> f32 {
        let mode_vol = self.regs[0x18];
        let routing = self.regs[0x17] & 0x0f;
        if let Some(model) = self.model6581 {
            let voices = [
                self.voice_level_6581(model, 0),
                self.voice_level_6581(model, 1),
                self.voice_level_6581(model, 2),
            ];
            let (mut summed, mut summed_count) = (0i32, 0usize);
            for (index, &voice) in voices.iter().enumerate() {
                if routing & (1 << index) != 0 {
                    summed += voice;
                    summed_count += 1;
                }
            }
            self.vlp = model.integrate(self.vddt_vw_2, self.vbp, &mut self.vlp_x, &mut self.vlp_vc);
            self.vbp = model.integrate(self.vddt_vw_2, self.vhp, &mut self.vbp_x, &mut self.vbp_vc);
            let feedback = table_at(&model.gain, ((self.eight_div_q as i32) << 16) + self.vbp.clamp(0, 0xffff));
            self.vhp = table_at(&model.summer, SUMMER_OFFSET[summed_count] as i32 + feedback + self.vlp + summed);
            // voice 3 off only mutes an unfiltered voice 3; EXT IN is not connected
            let mix = ((mode_vol & 0x70) | (!(routing | ((mode_vol & 0x80) >> 5)) & 0x0f)) & 0x77;
            let inputs = [voices[0], voices[1], voices[2], 0, self.vlp, self.vbp, self.vhp];
            let (mut mixed, mut mixed_count) = (0i32, 0usize);
            for (bit, &input) in inputs.iter().enumerate() {
                if mix & (1 << bit) != 0 {
                    mixed += input;
                    mixed_count += 1;
                }
            }
            let mixer = table_at(&model.mixer, MIXER_OFFSET[mixed_count] as i32 + mixed);
            let volume = i32::from(mode_vol & 0x0f) << 16;
            let output = table_at(&model.gain, volume + mixer.clamp(0, 0xffff)) - (1 << 15);
            return output as f32 / OUTPUT_SCALE;
        }
        let mut routed = 0.0f32;
        let mut direct = 0.0f32;
        for index in 0..3 {
            let sample = self.voice_samples[index];
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
        if mode & 0x10 != 0 {
            filtered += self.low;
        }
        if mode & 0x20 != 0 {
            filtered += self.band;
        }
        if mode & 0x40 != 0 {
            filtered += self.high;
        }
        (direct + filtered) * (mode_vol & 15) as f32 / 15.0
    }

    fn clock_filter(&mut self) {
        for index in 0..3 {
            self.voice_samples[index] = self.render_voice(index);
        }
        let sid_output = self.mix_output();
        // mos6581_8580's external RC stage is clocked once per SID cycle: 10 kΩ / 1 nF
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
    fn reset_oscillator_state_matches_mos6581_8580_startup() {
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
    fn mos6581_high_resonance_rms_stays_near_local_mos6581_8580_reference() {
        // Fixed-stream cases 16 and 18-20 in scripts/sid-reference/reference.cpp.
        // Reference RMS values come from the local VICE mos6581_8580 build at 44.1 kHz.
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
            assert!((rms / reference_rms - 1.0).abs() < 0.08, "scenario {scenario}: RMS {rms:.1}, mos6581_8580 {reference_rms:.1}");
        }
    }

    #[test]
    fn filter_coefficients_follow_cutoff_and_resonance_writes() {
        let mut sid = SidCore::new(44_100, SidModel::Mos6581);
        let initial = (sid.vddt_vw_2, sid.eight_div_q);
        sid.write(0x16, 0x80);
        assert_ne!(sid.vddt_vw_2, initial.0);
        assert_eq!(sid.eight_div_q, initial.1);
        sid.write(0x17, 0xf0);
        assert_eq!(sid.eight_div_q, 0);
        let unchanged = (sid.vddt_vw_2, sid.eight_div_q);
        sid.write(0x18, 0x1f);
        assert_eq!((sid.vddt_vw_2, sid.eight_div_q), unchanged);

        let mut sid = SidCore::new(44_100, SidModel::Mos8580);
        let initial = (sid.filter_w0, sid.filter_inv_q);
        sid.write(0x16, 0x80);
        assert_ne!(sid.filter_w0, initial.0);
        sid.write(0x17, 0xf0);
        assert_ne!(sid.filter_inv_q, initial.1);
    }

    #[test]
    fn mos6581_volume_register_digi_is_audible_through_the_dc_level() {
        // $D418 4-bit samples: silent voices, only the master volume toggles
        let mut sid = SidCore::new(44_100, SidModel::Mos6581);
        let mut pcm = vec![0i16; 4_410];
        for (index, chunk) in pcm.chunks_mut(10).enumerate() {
            sid.write(0x18, if index % 2 == 0 { 0x0f } else { 0x00 });
            sid.render(chunk);
        }
        let peak = pcm[1_000..].iter().map(|&sample| i32::from(sample).abs()).max().unwrap();
        assert!(peak > 2_000, "6581 volume digi peak {peak}");
    }

    #[test]
    fn resampler_suppresses_aliases_of_a_bright_sawtooth() {
        // Saw at 3849 Hz: harmonic 11 (42.3 kHz) would alias to 1765 Hz.
        let mut sid = SidCore::new(44_100, SidModel::Mos8580);
        sid.write(0, 0xff);
        sid.write(1, 0xff);
        sid.write(5, 0x00);
        sid.write(6, 0xf0);
        sid.write(4, 0x21);
        sid.write(0x18, 0x0f);
        let mut pcm = vec![0i16; 2_205 + 16_384];
        sid.render(&mut pcm);
        let window = &pcm[2_205..];
        let power = |frequency: f64| {
            let n = window.len() as f64;
            let (mut re, mut im) = (0.0, 0.0);
            for (index, &sample) in window.iter().enumerate() {
                let hann = 0.5 - 0.5 * (2.0 * std::f64::consts::PI * index as f64 / n).cos();
                let phase = 2.0 * std::f64::consts::PI * frequency * index as f64 / 44_100.0;
                re += f64::from(sample) * hann * phase.cos();
                im += f64::from(sample) * hann * phase.sin();
            }
            re * re + im * im
        };
        let fundamental = 65_535.0 * PAL_CLOCK / 16_777_216.0;
        let alias = 44_100.0 - 11.0 * fundamental;
        let ratio_db = 10.0 * (power(alias) / power(fundamental)).log10();
        assert!(ratio_db < -60.0, "alias at {alias:.0} Hz is {ratio_db:.1} dB");
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
    fn envelope_gate_transitions_match_mos6581_8580_cycle_trace() {
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
    fn envelope_rate_change_waits_for_mos6581_8580_counter_wrap() {
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
