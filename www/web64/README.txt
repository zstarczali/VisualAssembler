Built-in C64 of Visual Assembler: VICE 3.10 x64sc compiled to WebAssembly
==========================================================================

Source: the vice-3.10-web64 fork of VICE (https://vice-emu.sourceforge.io/), headless UI,
with the debugger exports used by Visual Assembler (stop before the instruction at a
breakpoint, step into / over / out, break, side-effect free memory peek).
Updated with: node scripts/update-web64.mjs <vice-3.10-web64>/build/web/out/build/src

VICE is free software under the GNU General Public License, version 2 or later.
The KERNAL, BASIC and character ROMs in x64sc.data are those shipped with VICE.

Files
  x64sc.js       121935 bytes  sha256 ae46604531b38025cf3837ac9c5a68d2db42181215b72b66454465e266c4d73e
  x64sc.wasm    4213351 bytes  sha256 376658d24d616a7963ce75ab6fcc9013fb3e57d4ed54fdea2fe93aaffc2af271
  x64sc.data     307289 bytes  sha256 f56644bb26c3f4c2c195ec5c30dc1f11a59deadd4c79ffb316d3d35c8bcd0929
