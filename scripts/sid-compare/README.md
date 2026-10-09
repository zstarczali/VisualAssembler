# SID comparison (diagnostic only)

`reference.cpp` renders twenty-one fixed register streams through the local VICE
reSID source. `compare.rs` renders the same streams through the application's
Rust `SidCore` and reports waveform correlation, gain, and RMS. It fails when
the four high-resonance 6581 cases fall below their correlation or RMS limits.
The C++ code is not linked into the application.

`envelope_reference.cpp` exercises the reSID envelope alone. Its gate-toggle
trace and rate-counter-wrap transition cycles are checked in Rust unit tests.

On Windows, compile `reference.cpp` together with VICE reSID's `sid.cc`,
`voice.cc`, `wave.cc`, `envelope.cc`, `filter.cc`, `dac.cc`, `extfilt.cc`, and
`pot.cc`. Add this directory and the VICE reSID directory as include paths.
Compile `compare.rs` with `rustc --edition 2021 -O`. Run `reference.exe`
with an output PCM path, then run `compare.exe` with the same path.

Current fixed-stream results (44.1 kHz, PAL, one second each): unfiltered
6581/8580 saw and 8580 pulse have correlation at least 0.9998; the 8580
low-pass saw is also at least 0.9998. In the tested 6581 saw cutoff sweep,
correlation is about 0.993. Fixed-cutoff 6581 low-pass, band-pass, and
high-pass cases at cutoff 1024 exceed 0.966; low-pass at cutoff 64 is about
0.995. The waveform and envelope DAC ladders are generated in Rust for each
chip model. High-resonance saw/pulse cases remain less accurate (about
0.93–0.99 correlation), but their RMS levels are now within 8% of reSID.
The 6581 filter is still a calibrated approximation, not a transistor-level port.

The Rust core also models the MOS 6581 combined-saw waveform pulling the
oscillator MSB low. A focused unit test covers this chip-specific feedback;
the fixed PCM scenarios above do not yet measure combined waveforms.
The TEST-bit falling edge also performs the combined-noise pre-writeback before
shifting the noise register, including the 6581/8580 waveform exceptions.

`bench.rs` measures one second of three-voice, filtered audio for each chip.
Build it without optimization to approximate `tauri dev` performance, or with
`rustc -O` to approximate a release build. Its PCM checksum catches accidental
audio changes while tuning performance.
