# AGENTS.md — C64 Visual Assembler

Ez a fájl AI kódoló agenteknek (Codex, Copilot, Kimi, stb.) készült. A projekttel
végzett munka előtt mindig olvasd át — ez az **elsődleges projekt-instrukció**.

Részletes, soronkénti referencia: [.github/copilot-instructions.md](.github/copilot-instructions.md)
(~1600 sor; ez a fájl annak fókuszált kivonata + a friss változtatások).

---

## 1. Mi ez a projekt?

**C64 Visual Assembler** — Tauri 2-alapú asztali alkalmazás Commodore 64 6502 assembly
programok vizuális, drag-and-drop szerkesztéséhez. A felhasználó mnemonik- és makró-blokkokat
rendezget egy programlistába, az app valós időben generálja az ASM / monitor / disassembler
kimenetet, és egy kattintással futtatható VICE-ben, C64 Ultimate-en vagy D64-en.

- Frontend: **Vanilla JS + HTML + CSS**, build step nélkül (nincs UI framework a rendererben)
- Backend: **Rust (Tauri 2)** — fájl I/O, VICE/RetroDebugger indítás, SID parse, config
- A UI négy nyelvű: magyar, angol, spanyol, német (`www/i18n.js`)
- A kódkommentek és a copilot-instructions fő nyelve **magyar**
- A felhasználó tömör, gyakorlatias magyar válaszokat vár; assembly-szakértő, az alap
  6502 fogalmakat nem kell magyarázni

---

## 2. Fájlszerkezet

| Fájl / könyvtár | Szerep |
|------|--------|
| `www/app.js` | Teljes renderer logika (~30 400 sor): mnemonik könyvtár, UI, ASM/monitor/disasm generálás, makró expanzió, editor dialógusok (SID, sprite, charset, hires, map) |
| `www/index.html` | Egyetlen HTML lap (~1900 sor); összes UI elem + dialógusok + `<template>`-ek |
| `www/style.css` | Teljes stíluslap (~8800 sor); CSS custom properties-alapú téma (light/dark/oled) |
| `www/i18n.js` | Fordítási táblák: `hu`, `en`, `es`, `de` |
| `www/tauri-bridge.js` | `window.electronAPI` shim — Tauri invoke hívások |
| `www/tutorial-data.js` | Beépített tutorial lépések |
| `www/lib/websid` | WebSID lejátszó (SID előnézet) |
| `src-tauri/src/lib.rs` | Tauri backend (~2600 sor): VICE/RetroDebugger indítás, fájl I/O, SID parse, D64 build, Ultimate REST, exomizer |
| `src-tauri/src/main.rs` | Vékony belépési pont, a lib-et hívja |
| `src-tauri/tauri.conf.json` | Tauri konfiguráció, verzió, CSP, bundle (resources: `samples/*`, `docs/*`) |
| `src-tauri/Cargo.toml` | Rust csomag; dev-dependency: `emulator_6502` (integrációs teszthez) |
| `package.json` | Tauri CLI dev/build/test scriptek |
| `tests/*.test.js` | Node `node:test` alapú JS unit tesztek |
| `src-tauri/tests/exomizer_integration.rs` | Exomizer tömörítés + depacker end-to-end Rust teszt |
| `samples/*.json` | Beépített mintaprogramok (~90 fájl a samples-ben, `.json`/`.sid`/`.bin`) |
| `docs/` | Felhasználói kézikönyv PDF (bundle resource) |
| `.github/copilot-instructions.md` | Teljes referencia (1600 sor) |
| `.github/copilot-plugin/` | C64AssemblyExpert plugin (agents + skills) |
| `.github/workflows/build.yml` | CI: tesztek + Windows/macOS/Linux build |
| `src-react/` | **Üres váz** (félbemaradt React-átírás kísérlet, csak üres könyvtárak + `.vite` cache) — ne építs rá, ne töröld |

---

## 3. Build, futtatás, teszt parancsok

| Parancs | Mit csinál |
|---------|-----------|
| `npm run dev` | `serve` a `www/` mappára (port 1430) + `tauri dev` párhuzamosan |
| `npm test` | `node --test tests/*.test.js` — JS unit tesztek |
| `npm run build` | `tauri build` — release bundle (ikonok + `samples/` + `docs/` resource-okkal) |
| `npm run build:win:x64` / `build:win:arm64` | Windows target-specifikus build |
| `cd src-tauri && cargo test --test exomizer_integration` | Exomizer/depacker integrációs teszt (exomizer bináris kell hozzá) |

A frontendnek nincs külön build lépése — a `tauri.conf.json` `frontendDist: "../www"`
direkt szervírozza a statikus fájlokat; dev módban `devUrl: http://localhost:1430`.

## 4. Tesztelési stratégia

- **JS unit tesztek** (`tests/*.test.js`): a `www/app.js`-t Node `vm` szandboxban töltik be
  stubolt DOM-mal, és a makró-expanzió / parser / export-import logikát tesztlik
  (`macro-core`, `delay-macro`, `fill-expression`, `export-import-regression`).
  Futtatás: `npm test`. Új makró vagy parser-változás után ide érdemes tesztet írni.
- **Rust integrációs teszt** (`src-tauri/tests/exomizer_integration.rs`): exomizer
  mem-mód tömörít → `$C000` PRG header ellenőrzés → a `samples/exo-decrunch.bin`
  depacker futtatása `emulator_6502` crate-tel 64K flat RAM-on → a 10000 byte-os
  bitmap visszaáll `$2000`-re.
- **CI** (`.github/workflows/build.yml`): minden `main` push/PR-re lefut a `test` job
  (`npm test` + `cargo test --test exomizer_integration`), utána matrix build
  Windows/macOS/Linux architektúrákra.
- Nincs browser-alapú UI teszt; a vizuális ellenőrzés manuális (VICE-ben futtatás).

## 5. Kódolási konvenciók — ne szegd meg

- **Nyelv:** JavaScript (ES2022+), nincs TypeScript, nincs npm bundler a rendererhez
- **Szintaxis:** `const`/`let`, arrow function, template literal, `crypto.randomUUID()`
- **TILOS:** `class` kulcsszó, `import`/`export` (globális scope egyetlen script tag-ben)
- **Kommentek:** csak ott, ahol a logika nem egyértelmű; **ne** kommentáld a triviális sorokat
- **Fordítás:** minden új UI szöveghez `translations.hu` ÉS `translations.en` kulcs kötelező
  (es/de is üdvös); `t(key)` / `tf(key, values)` segédfüggvények
- **Mnemonik leírások:** magyar → `mnemonicLibrary[category][i].description`; angol → `mnemonicDescriptionsEn[mnemonic]`
- **Verziónövelés** több helyen egyszerre: `package.json`, `src-tauri/tauri.conf.json`,
  `src-tauri/Cargo.toml`, `index.html` What's New, `README.md`, `Visual Assembler Manual.md`,
  `INSTALL-MAC.md`, `INSTALL-LINUX.md`, `README.txt`, `CLAUDE.md`, ez a fájl + copilot-instructions.md

### A felhasználó preferenciái

- **Tömör magyar válaszok**, lényegre törően, technikai szókinccsel
- Implementáció előtt vagy közben **röviden** mondd el mit csinálsz (egy mondat)
- A munka végén **egy-két mondat összefoglaló** + file:line hivatkozások markdown linkkel
- **Ne** narrálj minden lépést, **ne** dobálj sok emoji-t

## 6. Program adatmodell

A `program[]` tömb minden eleme egy plain object. A teljes mezőlista:
[copilot-instructions.md](.github/copilot-instructions.md). A legfontosabbak:

```js
{
  id: crypto.randomUUID(),
  category: "Ugrasok",          // mnemonicLibrary kulcs
  mnemonic: "RTS",
  operand: "",                  // megjelenített
  rawOperand: "",               // nyers user input
  description: "",
  addressingMode: "implied",    // implied / immediate / zeroPage / absolute / absoluteX/Y / indirectX/Y / relative
  base: "hex",                  // hex | dec | text | bytes | string | comment
  validationError: "",
  collapsed: false,
  // opcionális is*Macro flag-ek és kapcsolódó mezők — lásd 8. szakasz
}
```

A blokkokat a teljes UI a `program[]`-ból rendereli: `renderProgram()` újrarakja a DOM-ot.
Optimalizációk: `renderBlockPreview(index)` egy blokkra; `_expertSyncFromProgram()` expert
mód editor szöveg újrarajzolásra.

## 7. Block mode vs Expert mode

Kettős szerkesztési mód **tab-onként**:

- **Block mode** (default): drag-and-drop blokk szerkesztő (`program[]`)
- **Expert mode**: direkt assembly szövegszerkesztő (`expertEditor.value`, `body.expert-mode` class)

Kulcs függvények:
- `parseExpertText(text)` — szövegből `program[]`-ot generál (a `parseAsmText` mintái + saját extras: `.const`, `.if`, `.macro`, `.region`, `.push`, `.mouse`, stb.)
- `_blockToExpertLine(block)` — egy blokkot expert sorrá konvertál (1 space mnemonic és operand között!)
- `_expertSyncFromProgram()` — `program[]` → expert editor szöveg
- `_expertBuildProgram()` — expert editor szöveg → `program[]` (megőrzi binary mezőket, pl. `incBinBytes`)

**Fontos:** az **Export ASM** funkció **nem** az expert mód forrásának nyers visszaadása.
Az export célja egy **univerzális, önálló ASM kimenet**, amit más assembler is értelmez;
ezért az export-logika külön útvonal, nem azonos az `expertEditor` tartalmával.

### Univerzális blokk-export

```js
exportAsmToBlocks(asmText)   // www/app.js:7999
```

A SID / sprite / char szerkesztők használják az "Export to blocks" funkcióhoz:
- `parseExpertText`-tel blokkokká alakítja a kapott asm szöveget
- A `program[]` végéhez fűzi
- `markTabDirty()`, `parseUserMacros()`, `renderProgram()`, expert módban `_expertSyncFromProgram()`
- Visszaadja a beszúrt blokkok számát (>0 → siker)

Új szerkesztőhöz: a saját asm exportod `_xExport("asm")` szöveggé fordítja →
`exportAsmToBlocks(_xExport("asm"))` egysoros wiring.

## 8. Makrók — áttekintés

Részletes per-makró leírás: [copilot-instructions.md](.github/copilot-instructions.md).

| Csoport | Makrók | Jellemző |
|---------|--------|---------|
| **Adat** | `BYTE`, `WORD`, `FILL`, `ALIGN`, `RAWBYTES`, `RAWTEXT`, `TEXT`, `STRING`, `DATA` | `.byte`/`.word` dump; ALIGN-nál `base: "dec"` **kötelező** |
| **Struktúra** | `LABEL`, `COMMENT`, `REGION`/`ENDREGION`, `IF`/`ELSE`/`ENDIF`, `MACRO`/`ENDM`/`INVOKE`, `DEFINE`, `CONST`, `TABLE`, `BLANK` | REGION = vizuális csoport, 0 byte; CONST = label-tábla equate |
| **Vezérlés** | `LOOP`/`NEXT` (visszafelé számláló), `FOR`/`ENDF` (előrefelé) | Auto-label `loop1`/`for1`; LOOP count HEX/DEC toggle saját HTML-ben |
| **I/O** | `LOADFILE`, `INCBIN`, `SID`, `INCLUDE` | Fájl byte-okat fűz a kódba; SID makró `.sid` parse + INCBIN |
| **Sprite/grafika** | `SPRITE_INIT`, `SPRITE_POS`, `WAIT_RASTER`, `SPRITE_COL`, `MAP_COPY`, `MAP_COPY16X16` | Sprite cím **64-byte alignmenten** + sprite data **pontosan 64 byte** |
| **Bemenet** | `JOYSTICK`, `MOUSE` | CIA1 port olvasás + sprite mozgatás; MOUSE = 1351-es egér SID POTX/POTY-n |
| **REU/SuperCPU** | `REU_CHECK`, `REU_STASH/FETCH/SWAP`, `TURBO_SET`, `TURBO_ENABLE`, `SUPERCPU_DETECT` | DMA + turbo regiszterek |
| **KERNAL/képernyő** | `PRINT`, `PRINT_CHAR`, `PRINT_HEX`, `CHARSET`, `SET_BORDER`, `SET_BG`, `DELAY`/`WAIT` | CHROUT/PETSCII helper makrók, const-aware operandok |
| **Stack** | `PUSH`, `PULL` | A/X/Y regiszter mentés (PULL fordított sorrendben!) |
| **Org** | `ORG` | `* = $C000` — több ORG egy programban OK |

### Új makró hozzáadásakor checklist

1. `mnemonicLibrary` bővítés (magyar leírással) + `mnemonicDescriptionsEn[name]`
2. `parseExpertText` regex + `_importMakeXxx()` segéd
3. `_blockToExpertLine` ág a visszafelé konverzióhoz
4. `getInstructionSize` ág (méret byte-okban)
5. `compileBlock` (vagy `compileLineBytes`) ág — milyen byte-okat ad
6. `renderBlock` (vagy a `renderProgram` template) — UI mezők
7. Translation kulcsok (`translations.hu` + `translations.en`)
8. Saját `is*Macro: true` flag a blokkon
9. Ideális esetben JS unit teszt a `tests/` alá

## 9. SID szerkesztő — állapot

A SID szerkesztő egy 3-voice tracker Web Audio előnézettel, **teljes, lejátszható C64
modult exportál** (`_sidExportAsmPlayable()`, [app.js:29530](www/app.js)).

### UI elemek

- Toolbar az `index.html` ~1097. sora körül; `#sid-editor-dialog`
- Files menü: Save .bin… / Load .bin… / **Export to blocks** / **Export asm (→ clipboard)**
- Waveform: TRI/SAW/PUL/NOI checkbox + PW slider; ADSR + drag grafikon; Filter (LP/BP/HP + Cut/Res/Vol)
- Tracker: 3 voice × 32 sor, Play/Stop gombok, oktáv vezérlés, Speed input

### Export tartalma

```
* = $C000

sid_init:     ; SEI, vol=0, SID regisztr törlés, IRQ vektor $0314/15 → sid_irq,
              ; raster IRQ enable $D01A bit 0, line $D012 = $80, CIA1/2 IRQ off
sid_stop:     ; restore CIA1 timer A IRQ, $0314/15 → $EA31, gate off mindhárom voice
sid_irq:      ; ack $D019, tick down → JSR sid_play_row, JMP $EA31
sid_play_row: ; minden voice: ha note ≠ 0 → JSR sid_set_voice
sid_set_voice:; gate off → set PW/AD/SR → (voice 0 only: filter cutoff/res/vol)
              ; → freq lookup → gate on
sid_instruments:  ; 9 byte/inst, contiguous
sid_v0_notes / sid_v0_insts:  ; pattern-ek egymás után (max 7 pattern = 224 row)
sid_v1_notes / sid_v1_insts:
sid_v2_notes / sid_v2_insts:
sid_freq_lo / sid_freq_hi:    ; PAL 96 note (C-0..B-7), B-6 fölött $FFFF clamp
```

### Workflow és korlátok

1. Files menü → **Export to blocks** → a player + adat blokkok a `program[]` végére kerülnek (`* = $C000` ORG-gal külön szegmens)
2. A fő kódba **te raksz** egy `JSR sid_init` blokkot ahol indulnia kell
3. **Egyetlen pattern lista loop-pal** — sequence (pattern sorrend) tábla még nincs
4. **8-bites sor-számláló** → max 7 pattern (`Math.floor(255 / _SID_ROWS)`); több → warning, csak az első 7 exportálódik
5. **ZP használat:** `$FB` (tick), `$FC` (row), `$FD` (set_voice temp) — fő programmal ütközhet
6. **Vol per-instrument látszik, de a SID-en globális** ($D418); per-channel volume nem létezik — ADSR `S` szint a legközelebbi
7. Web Audio előnézet nem 1:1 a valódi SID-del

### Idegen .sid / .bin fájlok

Az editor formátuma nem kompatibilis külső SID file-okkal; külső zene lejátszásához a
beépített `sid-demo` / `sid-direct-demo` mintaprogramok használhatók (INCBIN + IRQ-ből `JSR $1003`).

## 10. Mintaprogramok — `samples/`

> **KRITIKUS CSAPDA:** az `applyTranslations()` függvény a `#sample-select` option-öket
> **pozíció szerint** indexeli (`sampleOptions[N]`), NEM value szerint. Ha új `<option>`-t
> szúrsz be a közepébe, az összes utána lévő `sampleOptions[N]` sort manuálisan fel kell
> számozni +1-gyel. Teljes lista: copilot-instructions.md „Sample program translációk" szekció.

**Új sample hozzáadásakor:**

1. `samples/xxx.json` létrehozása
2. `loadXxxSampleProgram()` függvény `app.js`-ben
3. `loadSelectedSample()` switch ág
4. `index.html` `<option value="xxx">` sor
5. `translations.hu/en.sampleXxx` kulcs
6. `applyTranslations()`-ben `sampleOptions[N].textContent` index
7. **Az összes utána következő index átszámozása**

## 11. Memóriatérkép referencia

| Terület | Cím | Megjegyzés |
|---------|-----|------------|
| Zero Page | $0000–$00FF | Gyors RAM; $FB-$FE general purpose |
| Stack | $0100–$01FF | 6502 HW stack |
| BASIC RAM | $0800–$9FFF | Default `*=$0801`, BASIC SYS stub bekapcsolva `$080D`-n indul |
| BASIC ROM | $A000–$BFFF | |
| Free RAM | $C000–$CFFF | **SID player default helye** |
| VIC-II | $D000–$D3FF | Sprite, raster, képmód |
| SID | $D400–$D41C | $D400-6 voice 1, $D407-D voice 2, $D40E-14 voice 3, $D415-18 globális |
| Color RAM | $D800–$DBFF | 4-bit per cella |
| CIA1 | $DC00–$DCFF | Joystick port 2 ($DC00), port 1 ($DC01), timer A IRQ |
| CIA2 | $DD00–$DDFF | VIC bank, timer |
| KERNAL ROM | $E000–$FFFF | CHROUT=$FFD2, SETNAM/SETLFS/LOAD=$FFBD/BA/D5, IRQ exit=$EA31 |
| IRQ vector | $0314/15 | RAM-ban, IRQ esetén ide ugrik |

### Kritikus címek

- `$D012` raster, `$D011` bit 7 = raster bit 8, `$D019` bit 0 = raster IRQ ack, `$D01A` bit 0 = raster IRQ enable
- `$DC0D` írás: bit 7 set/clear, bit 0 = timer A IRQ
- $D018 = $18 hires bitmap módban (screen at $0400, bitmap at $2000); **$08 hibás → random színek**
- $D011 = $3B hires bitmap on

## 12. PRG fordítás és futtatás

| Fázis | Kulcs függvények |
|-------|------------------|
| Layout | `getProgramLayout()` — címek soronként, label tábla |
| Compile | `compileBlock(block, addr, labels)` → byte tömb; `compileOperand` az operand resolve |
| Assembly | `assembleProgramToPrg()` — inline + deferred chunks (RAWBYTES/RAWTEXT/INCBIN) flat bufferbe |
| BASIC SYS | `buildAutostartPrgForEmulator()` — `$0801` BASIC stub + `$080D` kód kezdet (`SYS2061`) |
| Run | `launch_vice` Tauri command — temp PRG + VICE indítás |

### Run módok (split run gomb)

| Mód | Mit csinál |
|-----|-----------|
| `prg` | PRG → VICE direkt |
| `d64` | PRG + extras → D64 (c1541) → VICE |
| `ultimate` | PRG → C64 Ultimate REST API (D64 mount + run_prg) |

### Exomizer
`launch_exomizer` és `build_exomizer_prg` Tauri commands; tömörített SFX PRG
(`samples/exo-decrunch.bin` depackerrel; lefedve a Rust integrációs teszttel).

## 13. Gyakori hibák és csapdák (bug-trap)

### `parseAddressValue("0900")` decimálisként értelmezi (= 900 = $0384)
**Mindig `$` prefix az address mezőkben:** `rawBytesAddress: "$0900"`. A `/^\d+$/` regex
az összes digit-string-re matchel.

### Sprite eltolódás
- Sprite **pontosan 64 byte** (nem 63, nem 65)
- Sprite cím **64-byte aligned** (`addr % 64 == 0`)
- `SPRITE_INIT.spriteDataPage` = `spriteAddr / 64` (pl. $2000 → $80, $0840 → $21)
- Inline BYTE blokkban tárolt sprite a BASIC kód folyamában gyakran elcsúszik — preferáld a `RAWBYTES`-t fix címmel

### ALIGN 64 nem 64-re igazít → 100-ra
`base: "dec"` kötelező az ALIGN blokkon. `base: "hex"` esetén 64 = 0x64 = 100 decimális.

### LOOP Y → NEXT generál DEX
`collapseLoadedProgram()` nem állítja be a `nextReg`-et betöltéskor. Fix: minden NEXT
blokknál keresd a matching LOOP-ot és állítsd `block.nextReg = matching.loopReg`.

### CPX absolute mód immediate helyett
`CPX scrolltext_len` absolute addressing-gel `CPX $004E`-t generál (ZP olvasás), nem
összehasonlítást. Használj `addressingMode: "immediate"` + `operand: "#scrolltext_len"`.

### Hires bitmap random színek
$D018 = $08 → screen RAM a $0000-nál → szemét. Helyes: $D018 = $18.

### CHROUT és kisbetűk
$FFD2 (CHROUT) PETSCII-t vár. Kisbetűk ($61–$7A) C64 alapértelmezett karakterkészletben
**grafikus karakterek**, nem 'a'–'z'. RAWBYTES + CHROUT kombóhoz mindig nagybetű.

### Disassembler `undefined` mnemonic
`_REV_OP` tábla `mnem` property-t tárol, **nem** `mnemonic`-ot. `_disasmBytes`-ben
`info.mnem`-et olvass.

### Expert mode toolbar state elveszik
`setExpertMode(true)` `saveUiSettings()`-et hív → felülírja `savedUiSettings`-t. Ha
toolbar state-et akarsz visszaállítani, **a setExpertMode(true) hívás ELŐTT** mentsd ki
local változókba.

### Kompakt expert gombok min-height csapdája
Ha egy expert-editoros gomb saját méretet kap, a globális `button` `min-height` könnyen
felülírja. A saját osztályon állítsd `min-height: unset;`-re vagy `0`-ra.

## 14. Tauri IPC

Lásd `www/tauri-bridge.js` és `src-tauri/src/lib.rs`. Leggyakoribb commands:

| Command | Mit csinál |
|---------|-----------|
| `launch_vice` | Temp PRG + VICE |
| `launch_debugger` | PRG + breakpoints + symbols + RetroDebugger |
| `launch_vice_debugger` | PRG + moncommands + VICE monitor |
| `save_prg`, `save_project`, `load_project` | Fájl dialógusok |
| `load_sample` | Beépített sample betöltés |
| `save_d64`, `run_d64` | c1541 D64 build |
| `run_on_ultimate` | C64 Ultimate REST API |
| `build_exomizer_prg` | SFX tömörítés |
| `choose_incbin_file`, `choose_sid_file` | Fájl választó |

## 15. Biztonsági megfontolások

- A `tauri.conf.json` szigorú **CSP**-t állít (`default-src 'self'`, script csak self +
  `wasm-unsafe-eval`); új külső resource bevezetésekor a CSP-t tudatosan bővítsd.
- A Tauri capability fájlok (`src-tauri/capabilities/`) szabályozzák, mely commandok
  érhetők el a frontendről — új command hozzáadásakor a capability-t is bővíteni kell.
- A backend külső processzeket indít (VICE, c1541, exomizer) és HTTP-t hív a C64 Ultimate
  felé (`reqwest`); felhasználói inputból épített path-eket / argumentumokat validálj.
- Nincs telemetria, nincs titkos kulcs a repóban; ne commitolj credential-t.

## 16. Hivatkozások

- **Teljes referencia (1600 sor):** [.github/copilot-instructions.md](.github/copilot-instructions.md) — az itt nem dokumentált makró/feature mindenképp ott van
- **C64 assembly tudásbázis:** `F:\Development\C64AssemblyExpert\knowledge\index-template.md`
- **C64AssemblyExpert plugin:** `.github/copilot-plugin/agents/c64-assembly-expert.agent.md`
- **Codebase64 offline mirror:** `F:\Development\C64AssemblyExpert\knowledge\sources\codebase64\pages\` (660+ asm rutin)

### Speciális témakörök a knowledge base-ben

- Stable raster IRQ: `interrupts__making_stable_raster_routines.txt`
- SID programming: `base__sid_programming.txt`
- Undocumented opcodes: `base__6510_8502_undocumented_commands.txt`
- 1351 mouse: `base__c_1351_*.txt`, `base__neos_mouse_routine.txt`
- Joystick: `base__joystick_*.txt`
- Keyboard: `base__*keyboard*.txt`

---

## 17. Jelenlegi verzió

`2.3.1` — `package.json`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`, `index.html`
What's New dialógus, `README.md`, `Visual Assembler Manual.md`, `INSTALL-MAC.md`,
`INSTALL-LINUX.md`, `README.txt`, `CLAUDE.md`, ez a fájl + copilot-instructions.md.

Fő 2.3.1 változások: kibővített SID tracker többhangos kijelöléssel, copy/cut/paste/clear műveletekkel, virtuális billentyűzettel, új akkordokkal és előhallgatásokkal; egyesített Play/Pause; mozgatható, mentett pozíciójú szerkesztőablakok; módjelző; húzható Ultimate Basic minimap.

Verziónöveléshez lásd az 5. szakasz végén lévő checklistet.
