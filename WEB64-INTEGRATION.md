# Beépített C64 (VICE web) + debugger — állapot

Cél: a `F:\Development\vice-3.10-web64` WebAssembly VICE (x64sc) beépítése a Visual Assemblerbe,
működő debuggerrel (töréspontok, léptetés, regiszterek, memória, forrássor-követés).

Állapot: **működik, a 2.7.0-ba kerül**; a Tauri appban még nincs végigpróbálva. A vice-3.10-web64 repóban a C-módosítás nincs commitolva.
Utolsó frissítés: 2026-10-30.

---

## 1. VICE web fork (`F:\Development\vice-3.10-web64`)

### Miért kellett hozzányúlni

Az eredeti buildben a töréspont csak jelzett, és szünet-csapdát (`ui_pause_enable`) indított, ami
a **következő** utasításhatáron állt meg. Találatkor a töréspont utasítása már lefutott
(mérve: bp `$C002`-n → PC = `$C003`, X már növelve). Léptetés (single step) export nem volt.

### Módosítások (csak hozzáadás)

| Fájl | Változás |
|------|----------|
| `src/monitor/monitor.c` | `monitor_startup` web-ága: helyben vár (`inside_monitor = true`), a pause-csapda helyett |
| `src/arch/headless/main.c` | `vice_web_monitor_breakpoint_hit`: `emscripten_sleep` ciklusban vár, amíg a JS nem folytatja; ugyanazon PC + `maincpu_clk` kétszeri megállás kiszűrve (lépés töréspont-címre) |
| | új exportok: `vice_web_monitor_break_active`, `_continue`, `_step(mode, count)` (0 = into, 1 = over, 2 = out — a natív `z` / `n` / `ret`), `_break` (futás közben megáll), `_memory_peek` (mellékhatás nélkül, `mem_bank_peek`) |

A megállás így az utasítás **előtt** történik, a regiszter- / memóriaírás a folytatáskor érvényes.

### Fordítás

A teljes `build/web/build-web.ps1` itt nem fut (a `C:\msys64`-ben nincs `iconv`, és az MSYS a `/vice`
prefixet átírja). Inkrementálisan fordítok, MSYS bash-sal, a meglévő `build/web/out/build` Makefile-okkal:

```sh
# emsdk: C:\emsdk ; a szkript a scratchpadben volt (vice-incr.sh), lényege:
emmake make -C src/arch/headless
emmake make -C src/monitor
rm -f src/x64sc src/x64sc.js src/x64sc.wasm src/x64sc.data
emmake make -C src x64sc LDFLAGS=" -O3 -sUSE_ZLIB=1 <VICE_WEB_EMCC_MODULE_SETTINGS> --preload-file=../runtime-data/c64-shared@/vice/share/vice"
cp src/x64sc src/x64sc.js
```

Az új build kisebb (JS 122 KB, wasm 4,2 MB a régi 240 KB / 4,7 MB helyett — újabb emsdk, minifikált JS).
A repó saját smoke-tesztje átmegy: `node build/web/smoke-test.mjs build/web/out/build/src/x64sc.js --boot-ms=4000 --memory-write`.

**Teendő:** a vice-3.10-web64 repóban commitolni a két C-fájlt (ott más, tőlem független nem commitolt
módosítások is vannak — paletták, `.gitignore`, `build-web.sh` —, azokat ne vigye vele), és a
`build-web.sh` `EXPORTED_FUNCTIONS` listáját nem kell bővíteni (az `EMSCRIPTEN_KEEPALIVE` exportál).

---

## 2. Visual Assembler

### Fájlok

| Hol | Mi |
|-----|-----|
| `www/web64/x64sc.js` / `.wasm` / `.data` + `README.txt` | a build (≈4,6 MB), GPLv2+ megjegyzéssel |
| `scripts/update-web64.mjs` | átmásolja a buildet a vice repóból, és ellenőrzi a debugger-exportokat (régi buildet nem fogad el) |
| `www/index.html` | `#web64-btn` (eszköztár, a VICE Monitor előtt), `#run-web64-mode` (Run menü: „Built-in C64”), `#web64-dialog` |
| `www/app.js` | `_w64*` modul (a `_vmOpen` előtt), `setupWeb64()`; `_debuggerTargets(prg)` kiemelve a `runInDebugger`-ből |
| `www/style.css` | `.w64-*`, `.expert-dbg-line` |
| `www/i18n.js` | `runInWeb64`, `w64*` (29 kulcs, 7 nyelv) |
| `tests/web64.test.js` + `tests/helpers/web64-debug-check.mjs` | `.dbg` értelmező, SYS-cím; a csomagolt wasm debugger-szemantikája Node-ban, külön folyamatban (az emulátor időzítői miatt az kilép a végén) |

### Működés

- **Run** (`runMode === "web64"`) → `_w64Run`: `buildRunPrgForCurrentMode()` (Block / Expert / Kick / ACME / UB),
  hard reset + warp a `READY.`-ig, a PRG a memóriába (`$0801`-nél a BASIC-mutatók is), majd `RUN` / `SYS` a
  billentyűpufferen át.
- **Debug** — `runInDebugger`: ha a mód „Built-in C64”, **vagy nincs RetroDebugger beállítva**, a beépített
  debugger indul (`_w64Debug`). Build és forrástérkép: `_w64DebugBuild` — VA / Kick / Rust VMA: a `.dbg`
  sidecar (`_debuggerTargets`), ACME: a report sorai, UB: `build.debug.dbg`. Töréspont nélkül az első
  utasításnál (SYS-cím) áll meg.
- **Töréspontok**: a szerkesztő gutteréből (minden nyitott fül, a `.dbg` fájl:sor → cím), Block módban a
  BREAKPOINT blokkok, plusz a disassembly pontjai; folytatás / lépés előtt újraszinkronizál
  (`_w64ApplyBreakpoints`), így a futás közbeni be-/kikapcsolás is számít.
- **Megállás**: a képkocka-ciklus a `break_active` + `hit_pending` jelzőt figyeli; a szerkesztő a fájlra ugrik,
  a sort narancssárgán jelöli (`_w64DebugLine` → `.expert-dbg-line`), Block módban a blokkot jelöli ki,
  UB-ben a sort jelöli ki.
- **Panel**: regiszterek (szerkeszthető hex, flag-gombok), disassembly a PC körül (a forrástérkép ismert
  utasításkezdeteiből indul), memória ($hex / decimális / címke, 16 × 8 bájt, peek), töréspontlista.
- **Gombok**: Fordítás és futtatás, Reset, Szünet | Folytatás (F5), Megállítás, Lépés be (F11), át (F10),
  ki (Shift+F11) | Warp, Hang, Debugger panel | Joystick port. A billentyűk a C64-é, ha a képernyőn a fókusz
  (az F5 is C64-billentyű); a debugger-billentyűk a többi részen működnek.
- Az ablak nem modális, mozgatható, a jobb alsó sarkánál méretezhető (`_w64SetupResize`); a státusz alul van, a
  tartalom nem méretezi át, a képernyő `object-fit: contain`-nel illeszkedik. Bezáráskor az emuláció szünetel, a hang leáll.
- **Meghajtó LED** (`_w64RenderDrive`, `_w64LedStep`): `vice_web_drive_led` / `_track`; a 140 ms-os villogás = DOS-hiba, `w64DriveError`. A szektort a web-build nem adja (−1).
- **Files menü** (`_w64OpenFile`): PRG, D64, CRT. **Beállítások**: Videó, SID chip, SID motor, REU, Joystick, Warp, Hang, CRT szűrő + scanline, teljes képernyő; megjegyzés `c64va-web64`.
- **VA SID Core nincs bekötve:** a Rust mag natívan fut a backendben. Bekötéséhez `wasm32-unknown-emscripten`-re kellene fordítani, és új `sid_engine_t`-ként a VICE-ba tenni.

### Ellenőrizve

- `tests/web64.test.js` és a teljes csomag (`npm test`).
- Böngészőben (headless Edge + CDP, a `www` egy helyi szerverről):
  - Expert: megállás `loop: inc $d020`-nál (`$C005`, „Stopped at $C005 · Untitled 1.asm:5”);
  - step into `$C008` → `$C00A` (X = 5), a jelölt sor követi;
  - continue → újra `$C005`; a töréspont levétele után szabadon fut;
  - Break → `$C00A`, a `dex` sor jelölve.
  - Block mód: a BREAKPOINT-os `LDX` blokknál (`$C008`) áll meg, a blokk kijelölve.
  - Ablak: a méret állandó (panel ki / be, fut / áll), a húzás pontos.
- **Nincs ellenőrizve**: a Tauri appban (WebView2) — UB és ACME debug csak ott fordul (Rust backend);
  a hang és a billentyűzet valódi használata.

### Nyitott pontok / ötletek

1. Tauri appban kipróbálni (CSP: `script-src 'self' 'wasm-unsafe-eval'` már engedi; dinamikus `import()`).
2. VA SID Core mint harmadik SID-motor (lásd fent).
3. Watch-kifejezések, call stack (a `$0100` + SP-ből), lépésszám (step N), feltételes töréspont.
4. A futás közbeni memória-panel 2×/s frissül; nagyobb nézet / szerkeszthető memória.
5. Húzd-és-ejtsd a képernyőre; csatolt fájlok megjegyzése.
6. A vice-3.10-web64 build-szkriptjének (`build-web.ps1`) javítása a mostani gépre (iconv, prefix).
