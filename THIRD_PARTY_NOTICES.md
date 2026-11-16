# Third-party licenses

The MIT license in [LICENSE](LICENSE) applies to original C64 Visual Assembler code
by Zsolt Tarczali. It does not relicense third-party code, derived code,
fonts, music, ROM images or other assets with their own license terms.

- `src-tauri/vendor/resid-rs`: reSID by Dag Lem, Rust port by Sebastian
  Jastrzebski; GPL-3.0-or-later. See its [license](src-tauri/vendor/resid-rs/LICENSE).
- `src-tauri/src/mos6510.rs` and `src-tauri/src/c64/`: include ports of VICE
  code, copyright the VICE Team, GPL-2.0-or-later. Their existing copyright
  and license notices remain in force.
- `src-tauri/src/sid_core.rs`: includes code derived from Dag Lem's
  `mos6581_8580` implementation, GPL-2.0-or-later, as identified in the source.

Distributions combining the MIT project code with these GPL components must
also comply with the applicable GPL terms; the complete application is not
available solely under MIT. Other bundled components retain their respective
licenses and attribution notices.

The bundled VICE WebAssembly emulator is GPL-2.0-or-later. The Ultimate
emulator integration credits UE2-C64U-Emulator under GPL-3.0.
