#[path = "../../src-tauri/src/sid_core.rs"]
mod sid_core;

use sid_core::{SidCore, SidModel};
use std::{env, fs};

/// Both sides are band-limited by windowed-sinc filters of different length,
/// so the outputs are compared at the lag that aligns them best.
const MAX_LAG: isize = 64;

fn write_frame(sid: &mut SidCore, frame: usize, scenario: usize) {
    let frequency = if scenario == 0 || scenario == 3 { 0x1200 } else { 0x5000 };
    sid.write(0, (frequency & 0xff) as u8);
    sid.write(1, (frequency >> 8) as u8);
    sid.write(2, 0);
    sid.write(3, 8);
    sid.write(4, if scenario == 13 || scenario == 14 { 0x20 } else if scenario == 4 || scenario == 10 || scenario == 19 { 0x41 } else if scenario == 9 || scenario == 18 { 0x11 } else { 0x21 });
    sid.write(5, 0x11);
    sid.write(6, 0x80);
    let cutoff = if scenario == 13 { 64 } else if scenario == 14 { 512 } else if scenario == 17 || scenario == 20 { 1500 } else if scenario >= 9 { 1024 } else if scenario >= 5 { [64, 512, 1024, 1800][scenario - 5] } else { 32 + (frame * 35) % 1900 };
    sid.write(0x15, (cutoff & 7) as u8);
    sid.write(0x16, (cutoff >> 3) as u8);
    let filtered = scenario == 1 || scenario == 2 || scenario >= 5;
    sid.write(0x17, if !filtered { 0 } else if scenario == 15 { 0x01 } else if scenario == 16 || scenario >= 18 { 0xf1 } else { 0x61 });
    sid.write(0x18, if !filtered { 0x0f } else if scenario == 11 { 0x4f } else if scenario == 12 { 0x2f } else { 0x1f });
}

fn main() {
    let reference = fs::read(env::args().nth(1).expect("reference PCM path")).expect("read PCM");
    assert_eq!(reference.len(), 21 * 44100 * 2);
    for scenario in 0..21 {
        let model = if scenario == 2 || scenario == 3 || scenario >= 5 { SidModel::Mos6581 } else { SidModel::Mos8580 };
        let mut sid = SidCore::new(44100, model);
        let mut rendered = Vec::with_capacity(44100);
        for frame in 0..50 {
            write_frame(&mut sid, frame, scenario);
            let mut chunk = [0i16; 882];
            sid.render(&mut chunk);
            rendered.extend_from_slice(&chunk);
        }
        let offset = scenario * 44100 * 2;
        // VICE amplifies resampled reSID output by scaleFactor / 2 (3 for the 6581,
        // 5 for the 8580); reSID's resampling FIR itself has a gain of 0.97.
        let vice_gain = if model == SidModel::Mos6581 { 1.5 } else { 2.5 } * 0.97;
        let reference: Vec<f64> = reference[offset..offset + 88200]
            .chunks_exact(2)
            .map(|bytes| i16::from_le_bytes([bytes[0], bytes[1]]) as f64 / vice_gain)
            .collect();
        let ours: Vec<f64> = rendered.iter().map(|v| *v as f64).collect();
        let start = 2205;
        let mean_ref = reference[start..].iter().sum::<f64>() / (44100 - start) as f64;
        let mean_ours = ours[start..].iter().sum::<f64>() / (44100 - start) as f64;
        let mut rr = 0.0;
        let mut oo = 0.0;
        let mut ro = 0.0;
        for index in start..44100 {
            let r = reference[index] - mean_ref;
            let o = ours[index] - mean_ours;
            rr += r * r;
            oo += o * o;
            ro += r * o;
        }
        let correlation = if rr > 0.0 && oo > 0.0 { ro / (rr * oo).sqrt() } else { 0.0 };
        let gain = if oo > 0.0 { ro / oo } else { 0.0 };
        let mut best = (correlation, 0isize);
        if rr > 0.0 && oo > 0.0 {
            for lag in -MAX_LAG..=MAX_LAG {
                let mut shifted = 0.0;
                for index in start + MAX_LAG as usize..44100 - MAX_LAG as usize {
                    shifted += (reference[index] - mean_ref) * (ours[index.wrapping_add_signed(lag)] - mean_ours);
                }
                let shifted = shifted / (rr * oo).sqrt();
                if shifted > best.0 { best = (shifted, lag); }
            }
        }
        let ref_peak = reference[start..].iter().fold(0.0f64, |peak, value| peak.max(value.abs()));
        let rust_peak = ours[start..].iter().fold(0.0f64, |peak, value| peak.max(value.abs()));
        println!("scenario {scenario}: correlation {correlation:.4}, best lag {} ({:.4}), gain {gain:.3}, reference RMS {:.0}, Rust RMS {:.0}, peaks {:.0}/{:.0}", best.1, best.0, (rr / (44100 - start) as f64).sqrt(), (oo / (44100 - start) as f64).sqrt(), ref_peak, rust_peak);
        // Scenarios 13 and 14 (gate off) are near-silent release tails; every
        // audible stream must match reSID in shape and level.
        let reference_rms = (rr / (44100 - start) as f64).sqrt();
        let rust_rms = (oo / (44100 - start) as f64).sqrt();
        if reference_rms > 20.0 {
            let minimum = if reference_rms > 100.0 { 0.99 } else { 0.98 };
            assert!(best.0 >= minimum, "scenario {scenario}: correlation {:.4} < {minimum:.4}", best.0);
            assert!((rust_rms / reference_rms - 1.0).abs() < 0.03,
                "scenario {scenario}: RMS {rust_rms:.1} differs from reSID {reference_rms:.1}");
        }
    }
}
