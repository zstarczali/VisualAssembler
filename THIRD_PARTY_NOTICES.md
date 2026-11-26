# Third-party licenses

The MIT license in [LICENSE](LICENSE) applies to original C64 Visual Assembler code
by Zsolt Tarczali. It does not relicense third-party code, derived code,
fonts, music, ROM images or other assets with their own license terms.

- The SID emulation is the [va-sid](https://github.com/zstarczali/VA-SID) crate
  (MIT, with GPL parts), a Cargo dependency. It contains reSID by Dag Lem, Rust port by
  Sebastian Jastrzebski (`vendor/resid-rs`, GPL-3.0-or-later); ports of VICE code
  in `src/mos6510.rs` and `src/c64/` (copyright the VICE Team, GPL-2.0-or-later);
  and in `src/sid_core.rs` code derived from Dag Lem's `mos6581_8580`
  implementation (GPL-2.0-or-later), as identified in the source. Their existing
  copyright and license notices remain in force.

Distributions combining the MIT project code with these GPL components must
also comply with the applicable GPL terms; the complete application is not
available solely under MIT. Other bundled components retain their respective
licenses and attribution notices.

The bundled VICE WebAssembly emulator is GPL-2.0-or-later. The Ultimate
emulator integration credits UE2-C64U-Emulator under GPL-3.0.

## Bundled command line tools

The installers ship two compilers as separate programs in the `tools/` resource
folder. The app only runs them (mere aggregation); they are not linked into it.
Each folder carries the tool's license text and a `VERSION` file naming its exact
source. A compiler chosen in Settings replaces the bundled one.

- **Oscar64** by Martin Lemke (drmortalwombat), GPL-3.0:
  https://github.com/drmortalwombat/oscar64, tag `v1.32.273`. Windows: the official
  release build (`oscar64.zip`), unmodified; macOS / Linux: built unmodified from the
  same tag by `scripts/build-tools.mjs`. The `include/` runtime library is copied
  from the same release. Programs built with Oscar64 contain parts of this runtime;
  see the Oscar64 license for the terms that apply to them.
- **ACME** cross assembler 0.97 by Marco Baye, GPL-2.0-or-later:
  https://sourceforge.net/projects/acme-crossass, SVN `trunk` revision 517, built
  unmodified from source by `scripts/build-tools.mjs`.

## Fonts

- **Pacifico**, Copyright 2018 The Pacifico Project Authors, SIL Open Font License 1.1:
  https://github.com/googlefonts/Pacifico. File `www/assets/Pacifico-Regular.ttf`,
  unmodified; license text in `www/assets/Pacifico-OFL.txt`. Used for the
  "Studio" word in the title.
