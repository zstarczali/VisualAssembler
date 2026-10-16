# SID comparison (diagnostic only)

`reference.cpp` renders twenty-one fixed register streams through the local VICE
mos6581_8580 source with `SAMPLE_RESAMPLE` (windowed-sinc resampling, like the Rust
core). `compare.rs` renders the same streams through the application's Rust
`SidCore` and reports waveform correlation, gain, and RMS. Both sides are
band-limited by FIRs of different length, so the outputs are compared at the
best lag within ±64 samples. VICE amplifies resampled mos6581_8580 output by
`scaleFactor / 2` (3/2 for the 6581, 5/2 for the 8580) and mos6581_8580's FIR has a
gain of 0.97; `compare.rs` divides both out. It fails when an audible stream
(reference RMS above 20) falls below 0.99 correlation (0.98 for the quiet
low-cutoff cases) or differs by 3 % or more in RMS. The C++ code is not linked
into the application.

`envelope_reference.cpp` exercises the mos6581_8580 envelope alone. Its gate-toggle
trace and rate-counter-wrap transition cycles are checked in Rust unit tests.

On Windows, compile `reference.cpp` together with VICE mos6581_8580's `sid.cc`,
`voice.cc`, `wave.cc`, `envelope.cc`, `filter.cc`, `dac.cc`, `extfilt.cc`,
`pot.cc`, and `version.cc`. Add this directory and the VICE mos6581_8580 directory as
include paths, e.g. from a Visual Studio x64 developer prompt:

    cl /O2 /EHsc /std:c++17 /I. /I<vice>\src\mos6581_8580 reference.cpp <the .cc files>

Compile `compare.rs` with `rustc --edition 2021 -O`. Run `reference.exe` with
an output PCM path, then run `compare.exe` with the same path.

Current fixed-stream results (VA SID Core 1.1, 44.1 kHz, PAL, one second each):
every audible stream matches mos6581_8580 with best-lag correlation 0.994–0.998 at a
constant lag of 4 samples, and RMS within 1 %. This includes the 6581 cutoff
sweep, the low-, band- and high-pass cases and the high-resonance saw / pulse /
triangle cases (previously 0.93–0.99), because the 6581 filter, audio mixer and
volume stage are now a port of mos6581_8580 1.0's op-amp / VCR model (`Model6581` in
`sid_core.rs`). The quiet 6581 low-pass streams at cutoff 64 and 512 (RMS about
37) reach 0.988. Scenarios 13 and 14 are near-silent release tails (RMS 3) and
are not checked. The 8580 filter is unchanged (mos6581_8580 1.0's linear 8580 model).

The Rust core also models the MOS 6581 combined-saw waveform pulling the
oscillator MSB low. A focused unit test covers this chip-specific feedback;
the fixed PCM scenarios above do not yet measure combined waveforms.
The TEST-bit falling edge also performs the combined-noise pre-writeback before
shifting the noise register, including the 6581/8580 waveform exceptions.

`bench.rs` measures one second of three-voice, filtered audio for each chip.
Build it without optimization to approximate `tauri dev` performance, or with
`rustc -O` to approximate a release build. Its PCM checksum catches accidental
audio changes while tuning performance. Reference numbers on the development
machine: 6581 0.48 s / 8580 0.33 s unoptimised, 0.055 s / 0.036 s with `-O`.
