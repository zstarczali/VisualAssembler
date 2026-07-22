# CLAUDE.md — C64 Visual Assembler

Ez a fájl a **Claude Code** (és a VS Code Claude extension) számára íródott. A projekttel
végzett munka előtt mindig olvasd át — ez az **elsődleges projekt-instrukció**.

Részletes, soronkénti referenciáért lásd: [.github/copilot-instructions.md](.github/copilot-instructions.md)
(~1600 sor; ez a fájl ennek a fókuszált kivonata + a friss változtatások).

---

## 1. Mi ez a projekt?

**C64 Visual Assembler** — Tauri 2-alapú asztali alkalmazás Commodore 64 6502 assembly
programok vizuális, drag-and-drop szerkesztéséhez. Nincs UI framework — Vanilla JS + HTML
+ CSS, build step nélkül a frontendre. Backend: Rust (Tauri).

- Nyelv: magyar **és** angol (négy nyelvű UI, `www/i18n.js)
- A kódkommentek és a copilot-instructions fő nyelve **magyar**
- A felhasználó értékeli a tömör, gyakorlatias válaszokat magyarul

---

## 2. Fájlszerkezet

| Fájl | Szerep |
|------|--------|
| `www/app.js` | Teljes renderer logika (~19 000 sor): mnemonik könyvtár, UI, ASM/monitor generálás, makró expanzió, editor dialógusok (SID, sprite, charset, hires, map) |
| `www/index.html` | Egyetlen HTML lap; összes UI elem + dialógusok + `<template>`-ek |
| `www/style.css` | Teljes stíluslap; CSS custom properties-alapú téma (light/dark/oled) |
| `www/tauri-bridge.js` | `window.electronAPI` shim — Tauri invoke hívások |
| `src-tauri/src/lib.rs` | Tauri backend: VICE/RetroDebugger indítás, fájl I/O, SID parse, config |
| `src-tauri/tauri.conf.json` | Tauri konfiguráció, verzió |
| `package.json` | Tauri CLI dev/build scriptek |
| `samples/*.json` | Beépített mintaprogramok |
| `samples/*.sid` `samples/*.bin` | SID zenék, sprite-ok, egyéb assetek |
| `.github/copilot-instructions.md` | Teljes referencia (1600 sor) |
| `.github/copilot-plugin/` | C64AssemblyExpert plugin (agents + skills) |

---

## 3. Kódolási konvenciók — ne szegd meg

- **Nyelv:** JavaScript (ES2022+), nincs TypeScript, nincs npm bundler a rendererhez
- **Szintaxis:** `const`/`let`, arrow function, template literal, `crypto.randomUUID()`
- **TILOS:** `class` kulcsszó, `import`/`export` (globális scope egyetlen script tag-ben)
- **Kommentek:** csak ott, ahol a logika nem egyértelmű; **ne** kommentáld a triviális sorokat
- **Fordítás:** minden új UI szöveghez `translations.hu` ÉS `translations.en` kulcs kötelező; `t(key)` / `tf(key, values)` segédfüggvények
- **Mnemonik leírások:** magyar → `mnemonicLibrary[category][i].description`; angol → `mnemonicDescriptionsEn[mnemonic]`
- **Verziónövelés** 7 helyen: `package.json`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`, `index.html` What's New, `README.md`, ez a fájl, copilot-instructions.md

### A felhasználó preferenciái

- **Tömör magyar válaszok**, lényegre törően, technikai szókinccsel
- Implementáció előtt vagy közben **röviden** mondd el mit csinálsz (egy mondat)
- A munka végén **egy-két mondat összefoglaló** + file:line hivatkozások markdown linkkel
- **Ne** narrálj minden lépést, **ne** dobálj sok emoji-t
- A felhasználó **assembly-szakértő**, nem kell magyaráznod alapvető 6502 fogalmakat

---

## 4. Program adatmodell

A `program[]` tömb minden eleme egy plain object. A teljes mezőlistát lásd
[copilot-instructions.md#program-adatmodell](.github/copilot-instructions.md), itt a legfontosabbak:

```js
{
  id: crypto.randomUUID(),
  category: "Ugrasok",          // mnemonicLibrary kulcs
  mnemonic: "RTS",
  operand: "",                  // megjelenített
  rawOperand: "",               // nyers user input
  description: "...",
  addressingMode: "implied",    // implied / immediate / zeroPage / absolute / absoluteX/Y / indirectX/Y / relative
  base: "hex",                  // hex | dec | text | bytes | string | comment
  validationError: "",
  collapsed: false,
  // opcionális is*Macro flag-ek és kapcsolódó mezők — lásd 6. szakasz
}
```

A blokkokat a teljes UI a `program[]`-ból renderelte: `renderProgram()` újrarakja a DOM-ot.
Optimalizációk: `renderBlockPreview(index)` egy blokkra; `_expertSyncFromProgram()` expert
mód editor szöveg újrarajzolásra.

---

## 5. Block mode vs Expert mode

Az alkalmazás kettős szerkesztési módot támogat **tab-onként**:

- **Block mode** (default): drag-and-drop blokk szerkesztő (`program[]`)
- **Expert mode**: direkt assembly szövegszerkesztő (`expertEditor.value`, `body.expert-mode` class)

Kulcs függvények:
- `parseExpertText(text)` — szövegből `program[]`-ot generál (használja a `parseAsmText` minden mintáját + saját extras-okat: `.const`, `.if`, `.macro`, `.region`, `.push`, `.mouse`, stb.)
- `_blockToExpertLine(block)` — egy blokkot expert sorrá konvertál (1 space mnemonic és operand között!)
- `_expertSyncFromProgram()` — `program[]` → expert editor szöveg
- `_expertBuildProgram()` — expert editor szöveg → `program[]` (megőrzi binary mezőket pl. `incBinBytes`)

### Univerzális blokk-export (új, [app.js:4688](www/app.js))

```js
exportAsmToBlocks(asmText)
```

A SID / sprite / char szerkesztők használják az "Export to blocks" funkcióhoz:
- `parseExpertText`-tel blokkokká alakítja a kapott asm szöveget
- A `program[]` végéhez fűzi
- `markTabDirty()`, `parseUserMacros()`, `renderProgram()`, expert módban `_expertSyncFromProgram()`
- Visszaadja a beszúrt blokkok számát (>0 → siker)

Új szerkesztőhöz: a saját asm exportod `_xExport("asm")` szöveggé fordítja → `exportAsmToBlocks(_xExport("asm"))` egysoros wiring.

---

## 6. Makrók — leggyakoribbak

Részletes per-makró leírást [copilot-instructions.md](.github/copilot-instructions.md)
tartalmaz. Itt a kategorikus áttekintés:

| Csoport | Makrók | Jellemző |
|---------|--------|---------|
| **Adat** | `BYTE`, `WORD`, `FILL`, `ALIGN`, `RAWBYTES`, `RAWTEXT`, `TEXT`, `STRING`, `DATA` | `.byte`/`.word` stb. dump; ALIGN-nál `base: "dec"` **kötelező** |
| **Struktúra** | `LABEL`, `COMMENT`, `REGION`/`ENDREGION`, `IF`/`ELSE`/`ENDIF`, `MACRO`/`ENDM`/`INVOKE`, `DEFINE`, `CONST`, `TABLE`, `BLANK` | REGION = vizuális csoport, 0 byte; CONST = label-tábla equate |
| **Vezérlés** | `LOOP`/`NEXT` (visszafelé számláló), `FOR`/`ENDF` (előrefelé) | Auto-label `loop1`/`for1`; LOOP count HEX/DEC toggle saját HTML-ben |
| **I/O** | `LOADFILE`, `INCBIN`, `SID`, `INCLUDE` | Fájl byte-okat fűz a kódba; SID makró `.sid` parse + INCBIN |
| **Sprite/grafika** | `SPRITE_INIT`, `SPRITE_POS`, `WAIT_RASTER`, `SPRITE_COL` | Sprite cím **64-byte alignmenten** + sprite data **pontosan 64 byte** |
| **Bemenet** | `JOYSTICK`, `MOUSE` | CIA1 port olvasás + sprite mozgatás |
| **REU/SuperCPU** | `REU_CHECK`, `REU_STASH/FETCH/SWAP`, `TURBO_SET`, `TURBO_ENABLE`, `SUPERCPU_DETECT` | DMA + turbo regiszterek |
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

---

## 7. SID szerkesztő — friss állapot

A SID szerkesztő egy 3-voice tracker Web Audio előnézettel. A 2026-06-16 frissítések után
**teljes, lejátszható C64 modult exportál**.

### UI elemek

- Toolbar a [index.html:1097](www/index.html) körül; `#sid-editor-dialog`
- Files menü: Save .bin… / Load .bin… / **Export to blocks** / **Export asm (→ clipboard)**
- Header: instrument selector, name input, **Preview** gomb (sima `.ce-tool-btn` SVG ikonnal)
- Waveform: TRI/SAW/PUL/NOI checkbox + PW slider
- ADSR + drag-elhető grafikon + Filter (LP/BP/HP + Cut/Res/Vol)
- Tracker: 3 voice × 32 sor, **Play / Stop** SVG tool button-ök, oktáv vezérlés, Speed input

### Export tartalma

Az "Export to blocks" és "Export asm" mindkettő ugyanazt a payload-ot generálja
(`_sidExportAsmPlayable()`, [app.js:18691](www/app.js)):

```
* = $C000

sid_init:     ; SEI, vol=0, SID regisztr törlés, IRQ vektor $0314/15 → sid_irq,
              ; raster IRQ enable $D01A bit 0, line $D012 = $80, CIA1/2 IRQ off
sid_stop:     ; restore CIA1 timer A IRQ, $0314/15 → $EA31, gate off mindhárom voice
sid_irq:      ; ack $D019, tick down → JSR sid_play_row, JMP $EA31
sid_play_row: ; minden voice: ha note ≠ 0 → JSR sid_set_voice
sid_set_voice:; gate off → set PW/AD/SR → (voice 0 only: filter cutoff/res/vol)
              ; → freq lookup → gate on
sid_instruments:  ; 9 byte/inst, contiguous (ctrl/AD/SR/PWlo/PWhi/cut_lo/cut_hi/resfilt/modevol)
sid_v0_notes / sid_v0_insts:  ; minden pattern egymás után fűzve (max 7 pattern = 224 row)
sid_v1_notes / sid_v1_insts:
sid_v2_notes / sid_v2_insts:
sid_freq_lo / sid_freq_hi:    ; PAL 96 note (C-0..B-7), B-6 fölött $FFFF clamp
```

### Workflow

1. Megnyitod a SID szerkesztőt → zene
2. Files menü → **Export to blocks** → a player + adat blokkok a `program[]` végére kerülnek (`* = $C000` ORG-gal külön szegmens)
3. A fő kódodba **te raksz** egy `JSR sid_init` blokkot ahol indulnia kell (általában a programod elején)
4. Compile → PRG → VICE → szól

### Korlátok

- **Egyetlen pattern lista loop-pal** — sequence (pattern sorrend) tábla még nincs
- **8-bites sor-számláló** → max 7 pattern (`Math.floor(255 / _SID_ROWS)` = 7). Több pattern → warning a kódba, csak az első 7 exportálódik
- **ZP használat:** `$FB` (tick), `$FC` (row), `$FD` (set_voice temp). Ha a fő programod is bántja, ütközik
- **Vol slider per-instrument látszik, de a SID-en globális** ($D418). Az utolsóként triggerelt voice-é "nyer"
- **Per-channel volume a SID-en nem létezik** — ADSR `S` (sustain) szint a legközelebbi
- Web Audio előnézet nem 1:1 a valódi SID-del (PWM modulation, ring/sync, filter karakterisztika eltér)

### Idegen .sid / .bin fájlok

Az editor saját formátuma nem kompatibilis külső SID file-okkal. C64-es `.bin` (pl. Ikari
Warriors zene `4C lo hi 4C lo hi 4C lo hi` jump table) **lefordított 6502 kód** — az
editor nem futtatja. Külső zene lejátszáshoz a beépített `sid-demo` / `sid-direct-demo`
mintaprogramok használhatók (INCBIN + IRQ-ből `JSR $1003`).

---

## 8. Mintaprogramok — `samples/`

Aktuális sorrend a `#sample-select`-ben (indexek a `applyTranslations`-ben kötöttek).
Teljes lista: [copilot-instructions.md#meglévő-mintaprogramok](.github/copilot-instructions.md).

| Index | Slug | Mit demonstrál |
|-------|------|----------------|
| 0–3 | `basic-colors`, `label-border`, `text-demo`, `macro-demo` | Alap |
| 4–6 | `sprite-demo`, `setpixel-demo`, `bitmap-demo` | Grafika |
| 8–9 | `loop-demo`, `hello-loop-demo` | LOOP/NEXT |
| 10–12 | `push-pull-demo`, `if-else`, `user-macro-demo` | Stack, feltételes asm, user macro |
| 13–15 | `incbin-demo`, `loadfile-demo`, `include-demo` | Fájl I/O |
| 16–17 | `sid-demo`, `sid-direct-demo` | SID lejátszó (külső .bin/.sid) |
| 18 | `sprite-macro-demo` | SPRITE_INIT/POS/WAIT_RASTER |
| 19 | `joystick-demo` | CIA1 port 2 input |

**Új sample hozzáadásakor:**

1. `samples/xxx.json` létrehozása
2. `loadXxxSampleProgram()` függvény `app.js`-ben
3. `loadSelectedSample()` switch ág
4. `index.html` `<option value="xxx">` sor
5. `translations.hu/en.sampleXxx` kulcs
6. `applyTranslations()`-ben `sampleOptions[N].textContent` index
7. **renderLanguage indexek átszámozása** ha valamit közben töröltek

> **FIGYELEM — KRITIKUS CSAPDA:**
> Megtaláltam! A sample-ök index alapján fordítódnak — az új option beillesztése **eltolta az összes utána következőt**. Ezért lett minden félre. Javítom.
>
> Az `applyTranslations()` függvény `sampleOptions[N]`-t pozíció szerint indexeli, **NEM value szerint**.
> Ha új `<option>`-t szúrsz be a közepébe, az összes utána lévő `sampleOptions[N]` sort manuálisan
> fel kell számozni +1-gyel. Ellenőrizd a teljes listát a [copilot-instructions.md](.github/copilot-instructions.md)
> „Sample program translációk" szekciójában.

---

## 9. Memóriatérkép referencia

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

---

## 10. PRG fordítás és futtatás

| Fázis | Kulcs függvények |
|-------|------------------|
| Layout | `getProgramLayout()` — címek soronként, label tábla |
| Compile | `compileBlock(block, addr, labels)` → byte tömb; `compileOperand` az operand resolve-ot |
| Assembly | `assembleProgramToPrg()` — inline + deferred chunks (RAWBYTES/RAWTEXT/INCBIN) flat bufferbe |
| BASIC SYS | `buildAutostartPrgForEmulator()` — `$0801` BASIC stub + `$080D` kód kezdet |
| Run | `launch_vice` Tauri command — temp PRG + VICE indítás |

### Run módok (split run gomb)

| Mód | Mit csinál |
|-----|-----------|
| `prg` | PRG → VICE direkt |
| `d64` | PRG + extras → D64 (c1541) → VICE |
| `ultimate` | PRG → C64 Ultimate REST API (D64 mount + run_prg) |

### Exomizer
`launch_exomizer` és `build_exomizer_prg` Tauri commands; tömörített SFX PRG.

---

## 11. Gyakori hibák és csapdák (bug-trap)

### `parseAddressValue("0900")` decimálisként értelmezi (= 900 = $0384)
**Mindig `$` prefix az address mezőkben:** `rawBytesAddress: "$0900"`. A `/^\d+$/` regex
az összes digit-string-re matchel.

### Sprite eltolódás
- Sprite **pontosan 64 byte** (nem 63, nem 65)
- Sprite cím **64-byte aligned** (`addr % 64 == 0`)
- `SPRITE_INIT.spriteDataPage` = `spriteAddr / 64` (pl. $2000 → $80, $0840 → $21)
- Inline BYTE blokkban tárolt sprite a BASIC kód folyamában gyakran elcsúszik — preferáld a `RAWBYTES` fix címmel

### ALIGN 64 nem 64-re igazít → 100-ra
`base: "dec"` kötelező az ALIGN blokkon. `base: "hex"` esetén 64 = 0x64 = 100 decimális.

### LOOP Y → NEXT generál DEX
`collapseLoadedProgram()` nem állítja be a `nextReg`-et betöltéskor. Fix: minden NEXT
blokknál keress a matching LOOP-ot és állítsd `block.nextReg = matching.loopReg`.

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
toolbar state-et akarsz visszaállítani, **a setExpertMode(true) hívás ELŐTT** menstd ki
local változókba.

---

## 12. Tauri IPC

Lásd `tauri-bridge.js` és `src-tauri/src/lib.rs`. Leggyakoribb commands:

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

---

## 13. Hivatkozások

- **Teljes referencia (1600 sor):** [.github/copilot-instructions.md](.github/copilot-instructions.md) — itt nem dokumentált makró/feature mindenképp ott van
- **C64 assembly tudásbázis:** `F:\Development\C64AssemblyExpert\knowledge\index-template.md` (globális CLAUDE.md referenciából)
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

## 14. Tutorial rendszer — hogyan tedd hozzá

A tutorial rendszer **interaktív tour-okból** (spotlight + card, lépésenként vezérel egy UI elemre) és **passzív lessonokból** (szöveg + sample loader gomb) áll.

### Fájlok

| Fájl | Mit tartalmaz |
|------|---------------|
| `www/tutorial-data.js` | `TUTORIAL_DATA` objektum: `categories`, `lessons` array. **MINDEN új tutorial ide kerül.** |
| `www/app.js` 15780-16630 | Renderelés, navigation, tour engine. `_tourStart`, `_tourShowStep`, `_runTutorialStepAction`, `_runTutorialAction`. |
| `www/index.html` 1330-1345 | Három `popover="manual"` div: `#tour-overlay`, `#tour-spotlight`, `#tour-card`. |
| `www/style.css` 5261-5318 | Tour CSS: overlay dim, spotlight outline+box-shadow cutout, card pozíció+z-index. |

### A `TUTORIAL_DATA` szerkezete

```js
{
  categories: [
    { id: "tour", labelHu: "Bemutatók", labelEn: "Tours", labelEs: "..." },
    { id: "basics", labelHu: "Alapok", labelEn: "Basics", ... },
    // ...
  ],
  lessons: [
    {
      id: "unique-id",
      category: "tour" | "basics" | "macros" | "advanced" | ...,
      type: "tour" | "lesson",
      difficulty: 0,        // 0 = TOUR badge, 1-3 = star difficulty
      titleHu/En/Es: "...",
      descHu/En/Es: "...",
      sample: "sample-id",  // opcionális — Load sample gombot mutat
      interactive: false,   // ha true → guided/build mód, eltérő flow
      steps: [...]          // tour és interactive lesson esetén
    },
  ]
}
```

### Step mezők (tour)

| Mező | Mit csinál |
|------|-----------|
| `target` | CSS selector — ide kerül a spotlight. `null` = nincs target, card centerre. |
| `titleHu/En/Es` | Card title nyelvenként |
| `descHu/En/Es` | Card description nyelvenként (több sor `\n`-nel) |
| `openMenu: true` | Tour kinyitja a fő `<details class="control-menu">`-t a step előtt (és tartja amíg a következő step `openMenu` nem true). |
| `onEnterActionId: "..."` | Step belépésekor `_runTutorialStepAction(actionId)` fut. Lásd alább a beépített action-öket. |
| `positionDelay: N` | ms várakozás `onEnterActionId` után, mielőtt a target-et megméri és pozícionálja. Default 0. Settings dialog-hoz pl. 300. |
| `advanceOnTargetClick: true` | A target click-jére automatikus advance (nem kell Next). |
| `advanceOnTargetChange: true` | A target `change` eseményére advance. |
| `advanceOnTargetInput: true` | A target `input` eseményére advance. |
| `targetValue: "..."` | Csak akkor advance, ha a target value match-el (string egyenlőség). |
| `caseInsensitiveTargetValue: true` | Value összehasonlítás case-insensitive. |
| `centerCard: true` | Card a képernyő közepén (null target esetén). |
| `loadSample: "id"` | "Load sample" gomb a card-on, betölti a sample-t click-re. |
| `actionId: "..."` | "Action" gomb a card-on, `_runTutorialAction(actionId)` hívja click-re. |
| `highlight: ".selector"` | Class hozzáadás egy elemhez vizuális kiemeléshez. |

### Beépített `onEnterActionId` action-ök (`_runTutorialStepAction`)

`app.js:15927`-től kezdődik a switch.

| ActionId | Mit csinál |
|----------|-----------|
| `prepare-name-input-demo` | Expert mode off, sample = `name-input-demo`, betölti |
| `prepare-guided-color-text` | Expert mode off, clear program, render |
| `prep-text-block`, `prep-lda-border`, `prep-sta-border`, `prep-lda-background` ... | Mnemonik palette előkészítés (kategória + mnemonik + addressing + operand auto-set) |
| `open-settings-dialog` | **Non-modal** `dialog.show()`-val nyitja a Hardware Settings dialogot. Lásd a Tutorial bug-ot lent. |
| `close-settings-dialog` | `dlg.close()` a Hardware Settings dialoghoz |

### Beépített `actionId`-k (`_runTutorialAction`)

`app.js:15884`-től. Jelenleg csak `build-color-text-program` — komplett szín+text program automatikus felépítése.

### Tour DOM és top-layer

Három popover (`popover="manual"`) van a top-layer-ben:

```
#tour-overlay      — full-screen transparent, click = exit tour (ha allowed)
#tour-spotlight    — pozíció+méret a target köré, body cutout box-shadow-val
#tour-card         — info card a target mellett, Next/Prev/Skip gombok
```

**Top-layer stacking**: a legutoljára `showPopover()`-elt elem van felül. Tour induláskor sorrend: overlay → spotlight → card.

### ⚠️ TUTORIAL BUG ÉS NON-MODAL DIALOG TRICK

**Probléma**: ha egy step `onEnterActionId`-t használ ami `<dialog>.showModal()`-t hív, a modal dialog **`::backdrop`** elemet generál ami a top-layer-be kerül. Ez bizonyos browser/timing path-okon megakadályozza hogy a `tour-card` popover gombjai (Next, Prev) megkapják a clicket — a click a backdropra megy.

**Megoldás**: a tour-ból **mindig `dialog.show()` (non-modal)** módban nyitjuk a dialogot:

```js
case "open-settings-dialog": {
  const dlg = document.getElementById("hardware-settings-dialog");
  if (dlg) {
    if (dlg.open) dlg.close();       // ha modal volt, zárjuk
    try { dlg.show(); }              // non-modal — nincs backdrop, nincs top-layer
    catch (_) { dlg.showModal(); }   // fallback régi WebView-ra
  }
  // re-elevation safety net (3× hide/show)
}
```

Non-modal show() **NEM kap backdropot** és **NEM kerül top-layerbe**. A tour-card popover (z-index: max int) garantáltan felül marad.

A non-modal dialog explicit central pozíciónt igényel (user-agent csak modalokat centerel):

```css
.hardware-settings-dialog[open] {
  position: fixed; inset: 0; margin: auto;
  height: fit-content; z-index: 9985;
}
```

### Új tutorial hozzáadása — checklist

#### A) Új tour (interaktív, spotlight-tal)

1. **`tutorial-data.js`** — `lessons` array végére új objektum:
   ```js
   {
     id: "my-new-tour",
     category: "tour" | "basics" | ...,
     type: "tour",
     difficulty: 0,
     titleHu/En/Es: "Tour neve",
     descHu/En/Es: "Mit mutat be",
     steps: [
       { target: null, titleHu/En/Es: "Intro", descHu/En/Es: "..." },
       { target: "#some-id", titleHu/En/Es: "...", descHu/En/Es: "..." },
       // ...
     ]
   }
   ```

2. **Ha új action kell** (pl. egy dialogot kell nyitni): `app.js:15927` `_runTutorialStepAction` switch-be új case.

3. **Ha dialog megnyitás van benne**: használj `dlg.show()`-t **nem** `showModal()`-t (lásd bug fent). A dialog CSS-nek explicit central pozíció kell `[open]` selector alatt.

4. **Translation kulcsok**: ha statikus szöveget használsz a step description-ben az inline `currentLanguage !== "hu" ?` ternary-vel, OK. Ha `t()`-vel akarsz, `i18n.js`-be új kulcsok mindhárom nyelvhez.

5. **Tesztelni**: indítsd el a tour-t (Tutorial dialog → válaszd ki), járd végig minden lépést, ellenőrizd hogy a Next/Prev/Skip működik mindenhol és a card NEM tűnik el random helyeken.

#### B) Új lesson (passzív, csak olvasás + sample link)

```js
{
  id: "my-new-lesson",
  category: "basics",
  type: "lesson",
  difficulty: 1,                     // 1-3 = stars
  titleHu/En/Es: "...",
  descHu/En/Es: "...",
  sample: "sample-id",                // opcionális — Load sample gomb
  steps: [                            // opcionális — több lépéses lesson
    { titleHu/En/Es: "...", descHu/En/Es: "...", loadSample: "id" },
  ]
}
```

#### C) Új interactive guided lesson (program építés step-by-step)

```js
{
  id: "guided-something",
  category: "basics",
  type: "tour",
  interactive: true,                  // <-- KULCS: a tour végén nem nyitja vissza a dialogot
  difficulty: 1,
  titleHu/En/Es: "...",
  steps: [
    {
      target: ".palette-categories",
      onEnterActionId: "prep-lda-border",  // előre beállítja a palette-et
      titleHu/En/Es: "Válaszd ki...",
      advanceOnTargetClick: true,           // user clicke advanceol
    },
    // ...
  ]
}
```

### Sample-loader pattern step actionre

Ha egy step betölt egy sample-t mielőtt megmutatja a UI-t:

1. Add `_runTutorialStepAction`-be új case: `case "prepare-my-sample": { ...; loadSelectedSample(); break; }`
2. A step-ben: `onEnterActionId: "prepare-my-sample"`
3. `_tourPreparedLessonId` guard kerüld el a duplikált betöltést (lásd példa a meglévő `prepare-name-input-demo`-nál).

---

## 15. Jelenlegi verzió

`2.2.2` — `package.json`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`, `index.html`
What's New dialógus, `README.md`, `Visual Assembler Manual.md`, `INSTALL-MAC.md`, `INSTALL-LINUX.md`, `README.txt`, és ez a fájl + copilot-instructions.md.
Fő 2.2.2 változás: **expert editor minimap** (canvas-alapú kód-áttekintő csík az expert editor jobb oldalán, toolbar gombbal kapcsolható, RAF-throttled rajzolás comment/label/directive/mnem színekkel, viewport indicator click/drag scrollolással, DPR-aware, UI settings-ben perzisztálva); **block panel minimap** (Program panel jobb szélén megjelenő toggleable minimap, blokk típus szerinti színezéssel, click/drag scrollolás, `blockMinimap` state); **disasm copy gombok custom tooltip** (mindkét disasm "Copy source" gomb `title` attribútuma eltávolítva, CSS `aria-label` tooltip rendszerbe illesztve).

Verziónöveléshez lásd a 3. szakasz végén lévő 7-lépéses checklistet.
