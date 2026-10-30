// Copies the VICE web build (x64sc.js / .wasm / .data) into www/web64/ for the built-in C64.
//
// Usage: node scripts/update-web64.mjs [vice-web-build-dir]
// Default: ../vice-3.10-web64/build/web/out/build/src (or VICE_WEB64_DIR).
// The emulator needs the debugger exports of that fork (vice_web_monitor_break_active,
// _continue, _step, _break, _memory_peek); the script refuses an older build.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(process.argv[2] || process.env.VICE_WEB64_DIR || join(root, '..', 'vice-3.10-web64', 'build', 'web', 'out', 'build', 'src'));
const out = join(root, 'www', 'web64');
const need = ['vice_web_monitor_break_active', 'vice_web_monitor_continue', 'vice_web_monitor_step',
  'vice_web_monitor_break', 'vice_web_monitor_memory_peek', 'vice_web_run_program'];

const js = join(src, existsSync(join(src, 'x64sc.js')) ? 'x64sc.js' : 'x64sc');
for (const file of [js, join(src, 'x64sc.wasm'), join(src, 'x64sc.data')]) {
  if (!existsSync(file)) { console.error(`error: ${file} not found`); process.exit(1); }
}
const text = readFileSync(js, 'utf8');
const missing = need.filter((name) => !text.includes('_' + name));
if (missing.length) { console.error(`error: this build has no ${missing.join(', ')} — rebuild vice-3.10-web64`); process.exit(1); }

mkdirSync(out, { recursive: true });
copyFileSync(js, join(out, 'x64sc.js'));
copyFileSync(join(src, 'x64sc.wasm'), join(out, 'x64sc.wasm'));
copyFileSync(join(src, 'x64sc.data'), join(out, 'x64sc.data'));
const sums = ['x64sc.js', 'x64sc.wasm', 'x64sc.data'].map((name) => {
  const bytes = readFileSync(join(out, name));
  return `  ${name.padEnd(12)} ${String(bytes.length).padStart(8)} bytes  sha256 ${createHash('sha256').update(bytes).digest('hex')}`;
});
writeFileSync(join(out, 'README.txt'), `Built-in C64 of Visual Assembler: VICE 3.10 x64sc compiled to WebAssembly
==========================================================================

Source: the vice-3.10-web64 fork of VICE (https://vice-emu.sourceforge.io/), headless UI,
with the debugger exports used by Visual Assembler (stop before the instruction at a
breakpoint, step into / over / out, break, side-effect free memory peek).
Updated with: node scripts/update-web64.mjs <vice-3.10-web64>/build/web/out/build/src

VICE is free software under the GNU General Public License, version 2 or later.
The KERNAL, BASIC and character ROMs in x64sc.data are those shipped with VICE.

Files
${sums.join('\n')}
`);
console.log(`web64: copied from ${src}`);
console.log(sums.join('\n'));
