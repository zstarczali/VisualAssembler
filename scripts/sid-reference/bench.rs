#[path = "../../src-tauri/src/sid_core.rs"]
mod sid_core;

use sid_core::{SidCore, SidModel};
use std::time::Instant;

fn main() {
    for model in [SidModel::Mos6581, SidModel::Mos8580] {
        let mut sid = SidCore::new(44_100, model);
        for voice in 0..3 {
            let base = voice * 7;
            sid.write(base, 0);
            sid.write(base + 1, 0x30 + voice * 0x10);
            sid.write(base + 4, 0x21);
            sid.write(base + 5, 0x11);
            sid.write(base + 6, 0x80);
        }
        sid.write(0x15, 0);
        sid.write(0x16, 128);
        sid.write(0x17, 0x61);
        sid.write(0x18, 0x1f);
        let mut pcm = [0i16; 44_100];
        sid.render(&mut pcm[..4_410]);
        let start = Instant::now();
        sid.render(&mut pcm);
        let checksum: i64 = pcm.iter().map(|&sample| i64::from(sample)).sum();
        println!(
            "{model:?}: {:.3}s to render 1s, checksum {checksum}",
            start.elapsed().as_secs_f64()
        );
    }
}
