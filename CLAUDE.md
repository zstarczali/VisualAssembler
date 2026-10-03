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
| `templates/*.asm` | Projekt sablonok (Menu → Új projekt sablonból…), lásd 8. szakasz vége |
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
- **Verziónövelés** 7 helyen: `package.json`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`, `index.html` What's New, `README.md`, ez a fájl, copilot-instructions.md (a teljes listát lásd a 16. szakaszban)
- **TILOS szerkeszteni:** `va-product-site/ub-manual/` és `va-product-site/va-manual/` — ezeket Weblate fordítja/kezeli; verzióemeléskor és dokumentáció-frissítéskor is kihagyandók

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
| **I/O** | `LOADFILE`, `INCBIN`, `KOALA`, `SID`, `INCLUDE` | Fájl byte-okat fűz a kódba; SID makró `.sid` parse + INCBIN; KOALA = INCBIN-variáns (`incBinKoala`) + 86 bájtos megjelenítő rutin |
| **Pálya** | `LEVEL`, `LEVEL_ROW` | `.level "f.bin"[, $2000]` = INCBIN-variáns (`incBinLevel`, `_levelInfo`/`_levelBuild`, `_incBinPayload`): Level Editor projektből csak az elhelyezett képernyők + pointer-táblák, `LEVEL_*` címkék/konstansok (`addLayoutLabels`); max 7×10 képernyő. `.level_row dst, col[, color]` (`isLevelRowMacro`, `_levelRowBytes`, 132 byte): X-beli pályasor → (dst), önmódosító. Minta: `samples/level-demo.asm`, teszt: `tests/level-macro.test.js`. UB-hez (UltimateBasic 1.6.1+): `map load "level.bin", $4000` közvetlenül olvassa a Level Editor projektet, `map view px, py` sima, tépésmentes görgetés (a UB fordító `compiler/map_view.rs`), minta: `F:\Development\UltimateBasic\examples\level_scroll_demo.ub`; a VA UB parancs-menüben `map view` bejegyzés |
| **Sprite/grafika** | `SPRITE_INIT`, `SPRITE_POS`, `WAIT_RASTER`, `SPRITE_COL` | Sprite cím **64-byte alignmenten** + sprite data **pontosan 64 byte** |
| **Bemenet** | `JOYSTICK`, `MOUSE` | CIA1 port olvasás + sprite mozgatás; `.joystick port, vx, vy[, fire]` változós mód (−1/0/+1, `joyVarX/Y/Fire`, `_joyVarBytes`), port 3 = mindkét port (`tests/joystick-macro.test.js`) |
| **REU/SuperCPU** | `REU_CHECK`, `REU_STASH/FETCH/SWAP`, `TURBO_SET`, `TURBO_ENABLE`, `SUPERCPU_DETECT` | DMA + turbo regiszterek |
| **Stack** | `PUSH`, `PULL` | A/X/Y regiszter mentés (PULL fordított sorrendben!) |
| **Org** | `ORG` | `* = $C000` — több ORG egy programban OK |
| **Assert** | `.assert` (`ASSERT`, `isAssertMacro`) | `.assert <expr>[, "üzenet"]`; 0 byte; fordítási időben `_evalAsmExpr`-rel, hamis → `assertFailed` hiba |
| **Long branch** | `LBNE`/`LBEQ`/`LBCC`/`LBCS`/`LBMI`/`LBPL`/`LBVC`/`LBVS` (`isLongBranchMacro`, `HosszuUgrasok`) | Invertált `Bxx *+3` + `JMP target` = fix 5 byte; target label / `*`-expr / szám |

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

### Projekt sablonok — `templates/`

**Menu → File → Új projekt sablonból…** (`#menu-new-from-template` → `_openTemplateDialog`, `#template-dialog`).
A toolbaron is: `#new-project-btn` (Menu és Tutorial között).
Egy sablon = egy `.asm` (Assembler) vagy `.ub` (UltimateBasic) fájl; nincs manifest, a mappába bedobott fájl magától megjelenik.
A dialógus tetején `#template-kinds` kapcsoló (Assembler / UltimateBasic, `_templateKind`, induláskor UB módban UB);
a `.ub` sablon fejléce `# @kulcs érték`, a projekt `main.ub` + `.proj` `"app": "ultimate-basic"`-kal, UB projektként nyílik meg.

- **Fejléc:** a fájl elején `; @kulcs érték` kommentsorok (`@name`, `@category`, `@desc`, `@order`),
  nyelvi változat `; @name.hu …`; fallback: aktuális nyelv → nyelv nélküli → `en`. Az első nem-fejléc
  sortól kezdve minden a projekt `main.asm`-jébe kerül (`_parseTemplateSource`).
- **`{{PROJECT}}`** a törzsben a projekt nevére cserélődik — csak kommentben használd, hogy a sablon
  önmagában is forduljon.
- **Források:** beépített `templates/` (Tauri resource, `list_templates`) + saját sablonok az app config
  mappa `templates/` almappájában (`open_templates_folder`); kategória nélküli saját sablon → „Saját sablonok”.
- **Létrehozás** (`_templateCreateProject`): `<hely>/<név>/<név>.proj` + `main.asm`, meglévő projektet nem ír
  felül, a nyitott fülekre rákérdez (`_confirmCloseAllTabs`), Expert módra vált és megnyitja a projektet.
- **Új beépített sablon:** `templates/xxx.asm` EN + HU fejléccel és `@order`-rel — a
  `tests/project-template.test.js` ezt ellenőrzi. `.text` makrók ne írjanak azonos képernyő-pozícióra
  (a memóriatérkép átfedésnek jelzi).

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
| `kff2` | PRG → Kung Fu Flash 2 USB soros kapcsolaton (`run_on_kff2`), valódi C64/C128-ra |

### Exomizer
`launch_exomizer` és `build_exomizer_prg` Tauri commands; tömörített SFX PRG.

---

## 11. Gyakori hibák és csapdák (bug-trap)

### `*` a kifejezésben: PC vs szorzás
`_substituteStarPc` csak akkor cseréli `*`-ot a blokk-címre, ha **érték-pozícióban** áll
(kifejezés-eleje, vagy `( + - / % & | ^ ~ < > , =` / whitespace után). Szám/`)`/azonosító
után álló `*` = szorzás, marad (`STRIDE*2`, `table*2`). A csere `compileLineBytes`-ban
történik `line.address`-szel; `resolveNumericOperand` és `resolveRelativeOperand` a
kicserélt `(49152)+20` formát kapja. Nincs méret-hatás → nem kell iteratív layout.

### `_evalAsmExpr` és a boolean összehasonlítások
`_evalAsmExpr` a `<`, `>=`, `==` stb. eredményét (JS boolean) **1/0-ra normalizálja**,
hogy a `.assert` numerikusan tudja kezelni. A régi inline `evalAsmExpression` másolatok
NEM teszik ezt — új helyen `_evalAsmExpr`-t használj. Identifier-regexe
`(?<![\w.])[A-Za-z_][A-Za-z0-9_.]*` (dot engedve a lokális labelekhez, de `0xA000`
`x`-ét nem eszi meg).

### UltimateBasic: `sys` = JSR, IRQ handlerből nem lehet vele kilépni
A UB `sys addr` **`JSR addr`**-t fordít. Egy `irq`-ként bekötött `sub` végén a `sys $EA31` / `sys $EA81`
a visszatérési címet a stacken hagyja → a KERNAL RTI-je szemétre ugrik (crash). Helyesen: `irq_exit`
(`JMP $EA81`, nincs billentyűzet-scan) vagy `asm { JMP $EA31 }` (KERNAL scan + RTI). Mivel az `irq` a CIA1
timer IRQ-t letiltja, `$EA81`-es kilépésnél a `getch()`/`inkey()` nem kap billentyűt; a `waitkey` mátrixot
olvas, ezért a RUN-hoz még lenyomott RETURN-t azonnal elfogadja. A `wait key` forma nem dokumentált —
sablonba/mintába ne tedd. UB sablont VICE-ban ellenőrizz (`x64sc -autostartprgmode 1 -limitcycles N -exitscreenshot`).

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

### Exomizer SFX: `?SYNTAX ERROR` második RUN-nál (intermittáló)

**Tünet:** Exomizer be van kapcsolva → VICE-ban az első `RUN` működik, a program lefut,
de egy újabb `RUN` `?SYNTAX ERROR`-t ad. Exomizer nélkül nem reprodukálható.
Nem mindig következik be, de kis programoknál (pl. `lowercase-text-demo`) jobban reprodukálható.

**Gyökérok-hipotézis:**
Az `exomizer sfx sys` mód a dekompresszió után `JMP $080D`-vel ugrik a user kódba (nem
`JSR`-rel). A BASIC a `SYS <addr>`-t `JSR`-rel hívja meg, tehát push-olja a visszatérési
címet a stack-re. Ha az exomizer belső dekompresszora nem pontosan egyensúlyban hagyja a
stack-et a `JMP` előtt (pl. az `-x1` border-flash extra kódja miatt), akkor a user kód
végi `RTS` rossz bájtra tér vissza → a BASIC belső állapota megsérül → következő `RUN`
`?SYNTAX ERROR`.

**Miért aggravált kis programoknál:**
- SFX overhead ~80–100 byte; ha a program kisebb, az SFX PRG **nagyobb** mint az eredeti
- Exomizer ilyenkor esetleg eltérő dekompresszor útvonalat vesz (nagyon rövid stream)
- Dekompresszió után az SFX-es crunched adat maradéka ott marad a kód vége fölött a RAM-ban

**Diagnosztika:**
Az `exomizerBorderFlash` settinget (lib.rs: `cfg["uiSettings"]["exomizerBorderFlash"]`)
kapcsold ki (`-n` flag → nincs border flash). Ha ezután eltűnik a hiba, az `-x1` extra
kódja okozza a stack-imbalance-t.

**Jelenlegi állapot:** nem javított, csak dokumentált.

**Lehetséges megoldási irányok (nem implementálva):**
1. Fallback: ha az SFX PRG ≥ az eredeti PRG mérete → ne tömörítsen, használja az eredetit
2. User-side workaround: program végén `JMP $A474` (BASIC MAIN warm start) `RTS` helyett — ez elkerüli a stack-problémát, mert nem tér vissza a BASIC `SYS` hívójához
3. Saját memória-módú dekompresszor (ld. `exo-decrunch-src.asm`): ZP $04/$05 pointer, tiszta stack

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
| `detect_kff2_port` / `run_on_kff2` | KFF2 soros port felismerés (VID `0483`, PID `5740`) / PRG feltöltés |
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

## 15. Editor dialog konvenciók — kötelező pattern

Minden editor / tool dialog (Sprite, SID, Hires, Char, Map, Charset Canvas, Curve
Generator) **ugyanazt a szerkezeti mintát** követi. Új dialogot ide igazíts, ne
találj ki új layout-ot.

### 15.1 DOM szerkezet

```html
<dialog id="xxx-editor-dialog" class="xxx-dialog">
  <div class="xxx-card">
    <!-- 1. HEADER: cím + Files ▾ menü + metadata + × -->
    <div class="xxx-hdr">
      <div class="ed-file">
        <button class="ed-file-btn">Files ▾</button>
        <div class="ed-file-menu" hidden>…</div>
      </div>
      <span class="xxx-title">EDITOR NAME</span>
      <span class="xxx-meta">Frame 1 / 1</span>          <!-- opcionális -->
      <button class="xxx-xbtn" aria-label="Close">×</button>
    </div>

    <!-- 2. TOOLBAR: külön sor a fejléc alatt, ikon-gomb csoportokkal -->
    <div class="xxx-toolbar">
      <div class="xxx-tool-group">
        <button class="xxx-tool" aria-label="Pencil"><svg…/></button>
        <button class="xxx-tool" aria-label="Line"><svg…/></button>
      </div>
      <div class="xxx-tool-group">…</div>
    </div>

    <!-- 3. BODY: a szerkesztő fő tartalma -->
    <div class="xxx-body">…</div>
  </div>
</dialog>
```

**FONTOS**: az action gombok (Copy, Insert, Export stb.) a **toolbar**-ba
kerülnek `.xxx-tool` osztályú icon-gomb-ként, **nem** a fejlécbe és **nem**
külön alsó gombsávba. A sprite editor `.se-toolbar` a referencia — bármit
csinálsz, azt utánozd.

### 15.2 Kötelező CSS pattern

Header:
```css
.xxx-hdr {
  display: flex; align-items: center; gap: 12px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--panel-border);
  background: var(--panel-strong);
}
.xxx-title { font-size: 0.74rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
.xxx-xbtn  { margin-left: auto; background: none; border: none; width: 28px; height: 28px; min-height: 0; }
```

Toolbar (a `.se-toolbar` mintája):
```css
.xxx-toolbar {
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  padding: 7px 12px;
  border-bottom: 1px solid var(--panel-border);
  background: var(--panel-bg);
}
.xxx-tool-group {
  display: flex; gap: 2px; align-items: center;
  background: var(--control-bg);
  border: 1px solid var(--panel-border); border-radius: 2px;
  padding: 2px;
}
.xxx-tool {
  width: 28px; height: 26px; min-height: 0; padding: 0;
  display: inline-flex; align-items: center; justify-content: center;
  border: none; border-radius: 2px; background: transparent;
  color: var(--secondary); cursor: pointer;
}
.xxx-tool svg { display: block; width: 15px; height: 15px; }
.xxx-tool:hover {
  background: color-mix(in srgb, var(--secondary) 18%, transparent);
  color: var(--text);
}
.xxx-tool--active {
  background: color-mix(in srgb, var(--primary) 22%, transparent);
  color: var(--primary);
}
```

### 15.3 Tooltip — csak custom, natív `title` **tilos**

Minden `.xxx-tool` és `.xxx-icon-btn` gomb **kizárólag** `aria-label`-ot
használ. A natív `title="..."` a Tauri WebView-ban esetleges (WebKitGTK-n
egyáltalán nem villan fel, WebView2-n késve).

A shared CSS tooltip block a [style.css:8511](www/style.css) körül van
(`Shared custom aria-label tooltip` szekció). **Új dialog toolbar osztályát
három listába kell hozzáadni**:

1. `position: relative` anchor lista
2. `[aria-label]::after` content + megjelenés lista
3. `:hover / :focus-visible` reveal lista

Példa curve-gen bekötésre:
```css
/* 1. anchor */ .cg-tool, #curve-gen-btn { position: relative; }
/* 2. content */ .cg-tool[aria-label]::after, #curve-gen-btn[aria-label]::after { content: attr(aria-label); … }
/* 3. reveal  */ .cg-tool:hover[aria-label]::after, #curve-gen-btn:hover[aria-label]::after { opacity: 1; }
```

### 15.4 Modal / popover szabályok

- **Editor dialog** = `<dialog>` + `showModal()` (top layer, backdrop dim)
- **Modal fölé** kell fölé jelenő UI: **második** `<dialog>.showModal()`
  (két modal stack-el, utolsó nyer clickeket — lásd websid-play-dialog)
- **Nem-blokkoló** overlay (tour, tooltip): `popover="manual"` + `showPopover()`
- **Non-modal dialog show()** és sima z-index nem elég — a top-layer ::backdrop
  eszi a clicket, még nagy z-index mellett is

### 15.5 Slider és input override

A globális `input { min-height: 46px; border: 1px; box-shadow: inset white; }`
**minden** `<input>`-re érvényes. Range slider-eken ez fehér vonalat és puffadt
hit-areát okoz. A [style.css:1517](www/style.css) körüli
`input[type="range"] { min-height: 0; border: none; box-shadow: none; padding: 0 }`
override megoldja. Új dialog számmezőknél is állítsd be explicit:
```css
.xxx-num-in { height: 26px; min-height: 0; padding: 3px 6px; }
.xxx-select { height: 28px; min-height: 0; padding: 3px 26px 3px 8px; }
```

---

## 16. Jelenlegi verzió

`2.4.9` — `package.json`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`, `index.html`
What's New dialógus, `README.md`, `README.txt`, `INSTALL-MAC.md`, `INSTALL-LINUX.md`, `Visual Assembler Manual.md`, `Visual Assembler Manual.hu.md`, `AGENTS.md`, és ez a fájl + copilot-instructions.md.

> **Kézikönyv-szinkron:** a `Visual Assembler Manual.md` (angol, forrás) mellett van egy
> `Visual Assembler Manual.hu.md` (magyar fordítás). Ha az egyiket szerkezetileg módosítod
> (új/átnevezett/áthelyezett szakasz, kódblokk), tükrözd a másikba is. A `tests/manual-sync.test.js`
> ellenőrzi a fejléc-szerkezet (H2/H3/H4 darabszám), a számozott szakaszok sorrendje, a
> code-fence-ek párossága és a verziószám egyezését — ha elcsúsznak, ez a teszt megbukik.
> Az app a bundelt `docs/Visual Assembler Manual.pdf`-et nyitja (az angol .md-ből generált),
> a .md-k a szerkesztési forrás.

> **Weblate:** a `va-product-site/ub-manual` és `va-product-site/va-manual` mappák tartalmát Weblate fordítja — verzióemeléskor és dokumentáció-frissítéskor **ne szerkeszd** őket.
Fő 2.4.9 változások: **Projekt sablonok** — `templates/*.asm` + `templates/*.ub` (Tauri resource, `list_templates` mindkét kiterjesztést listázza), Menu → File → Új projekt sablonból… és új `#new-project-btn` toolbar gomb (Menu és Tutorial között) → `_openTemplateDialog`; `#template-kinds` Assembler / UltimateBasic kapcsoló (`_templateKind`, UB módban UB-n nyílik); fejléc `; @name …` / `# @name …` (`_parseTemplateSource` → `kind`), `{{PROJECT}}` csere; `_templateCreateProject`: Assembler → `main.asm` + `.proj`, Expert mód; UB → `main.ub` + `.proj` `"app": "ultimate-basic"`, UB projektként (`_ubProjectData`, startup tab, projekt panel); 4 UB sablon (üres, játék, hires bitmap, raszter IRQ), `tests/project-template.test.js`. **Build projekt** — Menu → Build → `#build-project` (`buildProjectToFiles`): a projekt / nyitott fülek minden fordítható fájlja a forrás mellé `.prg`-be, debugger sidecarokkal, include-olt modulok kihagyva, jelentés a Build Info dialógusban. **Ctrl+görgő zoom** — `_bindCtrlWheelZoom` az Expert és UB szerkesztőn. **Munkaterület** — a `.vaws` az Expert/UB projekt-állapotot is menti (`tests/workspace-project.test.js`). **UltimateBasic** `Cargo.lock` → `f0ac8d6` (optimalizált kódgenerálás), UB memóriatérkép adatrégiókkal (`tests/ub-memory-usage.test.js`); fájl-dialógusok az aktív munkamappában.
Korábbi 2.4.8 változások: **UltimateBasic 1.5.9** (`Cargo.lock` → `fc0daa7`): új `chain` parancs (`_UB_KEYWORDS`, `_UB_COMMAND_REFERENCE` + 7 nyelvű leírás), `load` másodlagos cím javítás, D64 javítások; a referencia `sprite collision` bejegyzésében a `sprhit()`/`sprbghit()` rövid alak. **KOALA makró** — `.koala "f.koa"[, $2000]`: INCBIN-variáns (`isIncBinMacro` + `incBinKoala: true`, mnemonic `KOALA`, `_importMakeKoala`), így a fájlkezelés/újratöltés/projektmentés/deferred elhelyezés az INCBIN-é; saját: `_koalaData` (10003 → fejléc levágva), `_koalaError` (csak `$2000`/`$6000`, 10001/10003 bájt), `_koalaShowBytes` (86 bájtos rutin: screen/color RAM másolás 4×250, `$D021`, `$DD00` bank AND/ORA, `$D011=$3B`, `$D016=$18`, `$D018=$18`), `getInstructionSize` = `_KOALA_SHOW_SIZE`; ASM nézet/disasm/univerzális export/deferred szekciók KOALA-ágai, mnemonic-leírás panel (`macroAddrKoala*`, `paletteKoala`), `tests/koala-macro.test.js` (mini 6502 szimulátor). **Hires editor Koala** — `_hgExportKoala` / `_hgImportKoala`, Files menü `#hg-import-koala` / `#hg-export-koala`, `tests/hires-koala.test.js`. **Frissítés** — `#expert-update-status` (minden `[data-update-status]` elemet `_updateRenderStatusbar` frissít), `save_bin` a javasolt fájlnév kiterjesztését teszi első szűrőnek, `va-product-site/downloads/VA/index.php` + `.htaccess` listázza a telepítőket (a frissítő ezt olvassa, a `download.php`-s főoldalon nincs fájlnév), Linux helper `env_remove(LD_LIBRARY_PATH/LD_PRELOAD)`.
Korábbi 2.4.7 változások: **Önfrissítés** — `check_for_update` / `download_and_install_update` Tauri commandok (`lib.rs`, „Self-update” szekció): a legfrissebb verziót a termékoldal (`https://www.c64va.tech/`, fallback `downloads/VA/`) letöltési linkjeiből olvassa ki (`update_asset_pattern`: Win x64/arm64 `-setup.exe`, macOS x64/aarch64 `.dmg`, Linux AppImage/`.deb`/`.rpm`), a JS csak a verziót adja át, az URL-t a Rust építi. Telepítés: Windows `Start-Process` NSIS `/P /R`, macOS DMG → `.app` csere helper scripttel, Linux AppImage csere vagy `pkexec apt-get/dnf`; utána `app.exit(0)`. Frontend: `checkForAppUpdate({silent})` (Menu → Check for Update + induláskor 6 mp-cel, csendben), `#update-dialog` progress sávval (`update-download-progress` event), „Skip this version” (`localStorage` `c64va-update-skip-version`), `#ub-update-status` jelző az UB statusbarban (`_updateRenderStatusbar`). **Curve Editor → UB export** — `_cgExportUb` (`var név = array(N)`/`array_word(N)` + `data név: …`) és `_cgExportDemoUb` (sprdef labda + raszter-szinkron hurok, 8 bit → sprite Y, 16 bit → sprite X, Bresenham söprés), közös `_ubInsertOrCopy` (SID UB export is ezt használja). Ehhez **UltimateBasic 1.5.8** kell: új `data <tömb>: …` tömb-inicializálás (`Stmt::ArrayData`, `collect_array_inits`, `emit_array_init_copies`). **Layout** — `_fitWorkspaceHeight` a valós szabad magasságból számolja az `--editor-max-depth`-et (nincs app-shell scroll), output panel min. 440 px (`_WS_OUTPUT_MIN` + grid `minmax(440px, …)`), working folder halvány jelvény az ASM nézet fejlécében és az Expert/UB toolbarban; `.app-confirm-buttons` gombfelirat nem törik.
Korábbi 2.4.6 változások: **SID Editor → UltimateBasic export** — új `#sid-export-ub` Files menüpont (`_sidExportToUb`, `_sidExportUbBlock`): `tune ... end` blokkot (hangszerek `inst`, `order`, `pat` sorok `_sidCellText` cellákkal, max 8 pattern) + `music play`-t generál; UB módban a kurzorhoz szúrja be, egyébként vágólapra másol (`sidExportUb*` i18n kulcsok, `tests/sid-ub-export.test.js`). A lejátszót az UltimateBasic fordító építi (`src/compiler/tune.rs`, zero-page-mentes; `sid_init`/`sid_play` konstansok, a `music play/stop` változatlanul működik) — ehhez `tune`-t ismerő UltimateBasic kell (a `Cargo.lock` rev-jét frissíteni). Az UB inline assembler `label,X/Y` hibája is javítva ott. **UB nyelvi frissítés** — `sfx`, `org`, `tune` kulcsszó (`_UB_KEYWORDS`, a `tune` blokkon belüli `inst`/`order`/`pat`/`speed` külön kiemelve), `charset on/off` és `incbin` szeletelés a parancsreferenciában (`sfx`/`org` leírás mind a 7 nyelven, a `charset`/`incbin` bővítés HU/EN). **ASM nézet többes kijelölés** — `applyAsmHighlight(blockIds, scrollToId)` id-listát fogad, a sorszám és az elválasztó külön span (`asm-tok-lineno-sep`). **Assembler mód megőrzése UB váltásnál** — `lastAssemblerEditorMode` (localStorage), projekt/minta betöltése előtt kilépés az UB-ből. **KFF2** — `#kff2-detect-btn` (`detectKff2Port`), firmware v2.07+ a kézikönyvben.
Korábbi 2.4.5 változások: **Kung Fu Flash 2 futtatás** — új `kff2` run mód (`runOnKff2`, `getRunModeLabel`, `setRunMode`, `validRunModes` és a `run-kff2-mode` menüpont az `index.html`-ben): a PRG USB soros kapcsolaton közvetlenül valódi C64/C128-ra töltődik egy Kung Fu Flash 2 cartridge-en át, Block, Expert és UB módban egyaránt (`_ubRun` `usesKff2` ága). Hardware Settings-ben új `#kff2-port` mező (`setupKff2Settings`, `localStorage.kff2Port`), induláskor USB VID/PID (`0483:5740`) alapú automatikus portfelismerés (`detect_kff2_port`). Rust oldalon új `serialport` függőség és `run_on_kff2` command (`run_on_kff2_port`): PRG validálás (`kff2_validate_prg`), 1200 baudos „MENU touch”, újracsatlakozás, `EFSTART:PRG\0` handshake (`LOAD\0`/`WAIT\0`), méret-egyeztetés, PRG küldés és lezárás-ellenőrzés. i18n: `runOnKff2`, `kff2*`, `workProgressRunKff2`/`workProgressSuccessKff2` mind a 7 nyelven. **Átméretezhető Program/ASM panelek** — `.ws-resizer` elválasztó a `.program-panel` és `.output-panel` között (`_applyWorkspaceColumns`, `_initWorkspaceResizers`, `wsProgramShare` a `saveUiSettings`-ben; min. 260 px, nyilak ±16 px, dupla kattintás → 50/50; Expert/UB módban és 1100 px alatt rejtve). **ASM nézet** — a makrósorok `; ` nélkül jelennek meg (`renderAsmOutput` utólagos `.map`, `highlightAsmLine` új `.xxx` ága; a `COMMENT` blokkok érintetlenek). **Expert kiemelés** — `hl-macro` (név a `.macro`/`.invoke`/`.call` után és `:név`), `hl-macro-param` (`{param}` és `.macro` fejléc paraméterei) `_expertHighlightLine`-ban, témánkénti `--hl-macro`/`--hl-macro-param` változókkal. **About dialógus** kétoszlopos, átlátszó hátterű Ultimate Basic banner; **Web64** szekció a termékoldalon; `macro-with-parameter` minta `.macro setColor(color)` alakra frissítve.
Korábbi 2.4.3 változások: **SID Editor effekt-oszlop** — minden tracker cella hordozhat egy effektet a note mellett: vibrato (**V**), slide fel/le (**U**/**D**), note-cut (**C**), sebesség-váltás (**F**) (`_SID_FX_CODES`/`_SID_FX_NAMES`, `_sidApplyRowEffect`, `_sidVoiceState`), amik helyesen játszódnak vissza mind a Web Audio előnézetben, mind a fordított 6502 exportban (`_sidExportAsmPlayable` bővített zero-page táblával, `$02`–`$2F` + `$FB`–`$FE`). **SID Editor song/order list** — minták egy song/order list-en keresztül vannak elrendezve a nyers pattern bank felett, ismételhetők, a dal hosszabb lehet a tárolt minták számánál; a mentett formátum verziójelzőt hordoz, régi (effekt nélküli) `.bin` mentések továbbra is betölthetők. Új `tests/sid-effects.test.js` és `tests/sid-song.test.js`. **D64 Editor explicit Save workflow** — a szerkesztések (add/extract/rename/delete, Block Editor byte-szerkesztés) mostantól egy munkapéldányon landolnak (`_d64EdState.path` vs. `_d64EdState.origPath`, `_d64EdState.dirty`), és csak expliciten Save-elve (`_d64EdSave`/`_d64EdSaveAs`) íródnak vissza a valódi fájlba, automatikus biztonsági mentéssel (`_d64EdBackupDisk`) és mentetlen változás esetén megerősítési kéréssel (`_showConfirm(t("d64EditorUnsavedConfirm"))`); `_d64EdCleanupTemp` takarítja a munkapéldányt. **Block Editor hex grid** — a Block Editor mostantól új byte-onkénti hex griddel jeleníti meg a kiválasztott 256 byte-os blokkot, és a dialógusa már nem homályosítja el az app többi részét (`.dbe-dialog::backdrop`).
Korábbi 2.4.2 változások: **D64 Editor drag & drop** — bináris fájl (`.prg`/`.bin`, pl. a SID/sprite/char szerkesztők exportja) közvetlenül a lemezképre húzható (`_d64EdHandleDroppedFiles`, `de-body` `dragenter`/`dragover`/`drop`), ez megnyitja a Hozzáadás panelt előre kitöltve (`_d64EdPreparePanelForFile`, közös a natív fájlválasztóval); több fájl egyszerre húzva sorban egymás után jön fel (`dropQueue`, `_d64EdAdvanceDropQueue`). **Include fájl generálása** — új `#de-gen-include` toolbar gomb (`_d64EdGenerateInclude`), ami `.const NÉV = $CÍM` sort ír egy `.inc` fájlba minden lemezen lévő bejegyzéshez: a betöltési címet a session alatt megadott (vagy Exomizer crunch előtt rögzített — `declaredAddress` `_d64EdConfirmAdd`-ben) értékből, PRG-knél szükség esetén a fájl header első két byte-jából. **Blokk szerkesztő** — új `#de-blocks-toggle` toolbar-kapcsoló (`_d64EdToggleBlockMode`), ami a D64 Editort nyers track/sector szintre kapcsolja a directory absztrakció alá: kattintható blokktérkép (`_d64EdRenderBlockGrid`, a BAM szabad/foglalt bitmapje szerint színezve — `_d64ParseBam` —, a BAM és a directory lánc `_d64WalkDirectoryChain`-nel külön jelölve), hex nézet/szerkesztő a kiválasztott 256 byte-os blokkhoz (`_d64FormatHexBlock`/`_d64ParseHexBlock`, `_d64EdWriteBlock`), előző/következő szektor navigáció (`_d64EdStepBlock`). Új `write_bin_file` Tauri command a `lib.rs`-ben (a meglévő `read_bin_file` párja, ugyanaz a minta mint `save_text_file`) — a track/sector cím-aritmetika (`_d64BlockOffset`, `D64_TRACK_SECTORS`) és a BAM parse teljesen a JS oldalon van, `c1541`-t nem használ. Új `tests/d64-block-editor.test.js` a geometria/BAM/hex round-trip lefedésére.
Korábbi 2.4.1 változások: **Lengyel és olasz UI nyelv** — teljes felület-fordítás (`i18n.js`: `translations.pl`/`translations.it`, mind az 1186 kulccsal, nested `memorySegments`/`categoryNames` is; `mnemonicDescriptionsPl/It`, `ubCommandDescriptionsPl/It`) a meglévő HU/EN/ES/DE/NL mellé, a nyelvi whitelist tömbök és fallback-láncok bővítésével, plusz a nyelvválasztó két új opciója az `index.html`-ben. **Online Help toolbar gomb** — új `#online-help-btn` ikon a Debug után szeparátorral, a `https://www.c64va.tech/docs.html?doc`-ot nyitja `openExternal`-lel, `onlineHelp` fordítási kulccsal mind a 7 nyelven. **Mnemonik leírások kiszervezése az i18n.js-be** — a `mnemonicDescriptionsEn/Es/De/Nl/Pl/It` konstansok kikerültek az `app.js`-ből `translations.<nyelv>.mnemonicDescriptions` alá (a magyar változatlanul a `mnemonicLibrary`-ből jön), a `getItemDescription`/`renderBlock` fallback-lánc leegyszerűsödött; mellékesen javítva egy régi hiba, ahol az `en` blokk végén egy véletlen spanyol duplikáció felülírta a `PRINT`/`PRINT_HEX`/`CLEAR_SCREEN`/`WAIT_KEY`/`SET_BORDER`/`SET_BG`/`IRQ_SETUP`/`RAND` angol leírásait.
Korábbi 2.4.0 változások: **D64 Editor** — új toolbar-ikon (a Curve Editor mögött, szeparátorokkal) egy önálló D64 lemezkép-szerkesztő dialógushoz, a Sprite Editor stílusát követve (`#d64-editor-dialog`, Files ▾ menü: New/Open/Save As/Run in VICE). Meglévő `.d64` directory listázása, program hozzáadása/kimentése/átnevezése/törlése közvetlenül a lemezképen `c1541`-en keresztül (`d64_list`/`d64_add_file`/`d64_extract_file`/`d64_rename_file`/`d64_delete_file` Tauri commandok, `lib.rs`), nincs külön mentés lépés. Hozzáadásnál opcionális betöltési cím, kicsomagolási cím és Exomizer tömörítés (a Build D64 extra fájlok `mem`/`sfx` logikáját újrahasznosítva `_d64EdConfirmAdd`-ben), plusz PRG/SEQ/USR/REL típusválasztó (`c1541 -write name,type`) — `.prg`-nél ezek a mezők automatikusan rejtve maradnak. A directory lista a C64Pro fonttal, nagybetűsen jelenik meg (`.de-table`). Javítva: a rename inline input-jára kattintás a sor `click` handlere miatt azonnal törölte a szerkesztést — a handler most kihagyja az input-ra eső kattintásokat. Javítva: világos témában a `.editor-mode-indicator` badge sötétebb/olvashatóbb, a `.mode-indicator-shimmer` animáció ismét látszik.
Korábbi 2.3.9 változások: **`*` (program counter) minden operandus-kifejezésben** — `BNE *-5`, `JMP *+20`, `LDA #<*`, `LDA #>(*+63)`; érték után álló `*` továbbra is szorzás (`_substituteStarPc` / `_hasStarPcRef` / `_evalAsmExpr` az `app.js`-ben). **Lokális (pontos) labelek** — `.loop` a legközelebbi fölötte lévő globális label scope-jába tartozik (`getProgramLayout` klón-pass → kanonikus `Global.loop`), a `parseAsmText` már nem vágja le a pontot. **Long branch pseudo-opok** — `LBNE`/`LBEQ`/`LBCC`/`LBCS`/`LBMI`/`LBPL`/`LBVC`/`LBVS` (`HosszuUgrasok` kategória, `isLongBranchMacro`) → invertált `Bxx *+3` / `JMP` = fix 5 byte. **`.assert <expr>[, "üzenet"]`** — fordítási idejű ellenőrzés (`isAssertMacro`), hamis → beszédes assembly hiba az értékkel. **SMC operandus-label** — `LDA value:#$00` → `value` az operandus byte-jára mutat (`smcLabel`, `addLayoutLabels` → `addr+1`). **Barátságos branch-hiba** — tartományon kívüli branch a pontos túllépést és a megfelelő `LBxx`-et javasolja (`_branchOffsetFromTarget`, `branchOutOfRangeSuggest`).
Korábbi 2.3.8 változások: Munkaterület mentés/megnyitás (`.vaws`) — a nyitott, fájlhoz kötött fülek pontos halmaza, aktív fül és fül-módok mentése/visszatöltése, auto-save-lel és induláskori auto-restore-ral; globális memória panel toggle; UB parancsreferencia lokalizálva (HU/EN/ES/DE/NL, angol fallback); frissített UB grafikus parancs dokumentáció; javított KERNAL SETLFS/PLOT referencia; magas memóriahasználat javítva sok nyitott fülnél (per-tab undo/redo history korlátozva debounce-szal); felesleges Expert/UB breakpoint toolbar gombok eltávolítva; Expert toolbar magasság a UB-hez igazítva.
Korábbi 2.3.7 változások: Undo/Redo és többblokkos szerkesztés; Block/Expert/UB breakpointok külső RetroDebugger integrációval, source map/label sidecarokkal, SYS-aware indítással; opcionális BASIC stub a Disassembler/Monitor nézetekben; új UB Monitor panel; debugger/disassembler origin javítások; UB caret/üres sor/nyomva tartott kurzor/minimap és Expert sorszám-illesztési javítások.
Korábbi 2.3.6 változások: **Build CRT** (Magic Desk 64K, type 19) export block, Expert és UB módban; bank-0 loader RAM-ba másolja a payloadot; max 65 408 byte 8×8 KB bankon; Exomizer kihagyva CRT-nél. D64 export dialóg input mezők magasság fix. Kézikönyv új 12b. szekció kiemelt KERNAL `RESTOR` caveat-tel.
Korábbi 2.3.5 változások: CHARDEF és BOX_HIT makrók szintaxiskiemelése az Expert szerkesztőben; az Ultimate Basic szerkesztő Expert-egységes viselkedése (Format utáni kurzorfix, egységes Tab és select/focus kurzorkövetés); UB betűméret megőrzése munkamenetek között; a welcome dialogba bekerült egy Ultimate Basic manual gomb, ami ugyanazt a kézikönyvet nyitja, mint a szerkesztő manual gombja (`openUltimateBasicManual`).
Korábbi 2.3.4 változások: CHARDEF és BOX_HIT makrók; indítási welcome dialóg verziószámmal; videós splash intro; frissített light téma (színes, kiemelt blokkok); javított UltimateBasic editor UX (autocomplete, minimap, project dialógok).

Verziónöveléshez lásd a 3. szakasz végén lévő 7-lépéses checklistet.
