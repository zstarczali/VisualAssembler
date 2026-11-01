# resid-rs 1.1.1, vendored for Visual Assembler

From crates.io, with one fix. In `SamplingMethod::Resample` the interpolation between
two FIR tables multiplied in 32 bits (`src/sampler.rs`, `fir_offset_rmd * (v2 - v1)`).
The product does not fit: a debug build panics, a release build wraps. On real tunes
the wrapped result differs in about 40% of the samples, by up to 1200 LSB. The product
is now calculated in 64 bits. Nothing else is changed; `benches` and `tests` are left out.
