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
| **Pálya** | `LEVEL`, `LEVEL_ROW` | `.level "f.bin"[, $2000]` = INCBIN-variáns (`incBinLevel`, `_levelInfo`/`_levelBuild`, `_incBinPayload`): Level Editor projektből csak az elhelyezett képernyők + pointer-táblák, `LEVEL_*` címkék/konstansok (`addLayoutLabels`); max 7×10 képernyő. Objektumréteg (Level Editor `_lvObjects`, `_LV_OBJ_TYPES`, meta `objects: [{t,x,y,p}]` görgetési sorrendben) → `LEVEL_OBJ_X_LO/HI`, `Y_LO/HI`, `TYPE`, `PARAM`, `LEVEL_OBJ_COUNT`, `LEVEL_OBJ_T_*` (`_LEVEL_OBJ_TYPES`, a sorrend egyezzen), `LEVEL_START_X/Y`. Karakter-attribútumok (`_lvAttr`, extras `attr`) → `LEVEL_ATTR` + `LEVEL_ATTR_*` (`_LEVEL_ATTR_BITS` = `_LV_ATTRS`); képernyőnkénti színek (`scr.colors`, meta `screenColors`, `borderColor`) → `LEVEL_SCR_BG/BORDER/MC1/MC2`, `LEVEL_BORDER`, `LEVEL_SCR_COLORS`. Level Editor még: él-ellenőrzés (`_lvEdgeIssues`), memóriamérleg + RLE (`_lvMemInfo`, `_lvRle`, `level_unrle`), Futtatás VICE-ban (`_lvRunInVice`, `_lvTestProgramAsm`). A `setupLevelEditor` a `let/const _lv*` deklarációk ELŐTT fut (TDZ): ott konstanst ne használj. `.level_row dst, col[, color]` (`isLevelRowMacro`, `_levelRowBytes`, 132 byte): X-beli pályasor → (dst), önmódosító. Minta: `samples/level-demo.asm`, teszt: `tests/level-macro.test.js`. UB-hez (UltimateBasic 1.6.1+): `map load "level.bin", $4000` közvetlenül olvassa a Level Editor projektet, `map view px, py` sima, tépésmentes görgetés (a UB fordító `compiler/map_view.rs`), minta: `F:\Development\UltimateBasic\examples\level_scroll_demo.ub`; a VA UB parancs-menüben `map view` bejegyzés |
| **Sprite/grafika** | `SPRITE_INIT`, `SPRITE_POS`, `WAIT_RASTER`, `SPRITE_COL` | Sprite cím **64-byte alignmenten** + sprite data **pontosan 64 byte** |
| **Bemenet** | `JOYSTICK`, `MOUSE` | CIA1 port olvasás + sprite mozgatás; `.joystick port, vx, vy[, fire]` változós mód (−1/0/+1, `joyVarX/Y/Fire`, `_joyVarBytes`), port 3 = mindkét port (`tests/joystick-macro.test.js`) |
| **REU/SuperCPU** | `REU_CHECK`, `REU_STASH/FETCH/SWAP`, `TURBO_SET`, `TURBO_ENABLE`, `SUPERCPU_DETECT` | DMA + turbo regiszterek |
| **Stack** | `PUSH`, `PULL` | A/X/Y regiszter mentés (PULL fordított sorrendben!) |
| **Org** | `ORG` | `* = $C000` — több ORG egy programban OK |
| **Assert** | `.assert` (`ASSERT`, `isAssertMacro`) | `.assert <expr>[, "üzenet"]`; 0 byte; fordítási időben `_evalAsmExpr`-rel, hamis → `assertFailed` hiba |
| **Long branch** | `LBNE`/`LBEQ`/`LBCC`/`LBCS`/`LBMI`/`LBPL`/`LBVC`/`LBVS` (`isLongBranchMacro`, `HosszuUgrasok`) | Invertált `Bxx *+3` + `JMP target` = fix 5 byte; target label / `*`-expr / szám |

### Paletta operandus mező — egységes szabály

`_paletteOperandKind` (app.js, `createBlockFromMnemonic` előtt): `"field"` = a paletta-ág maga olvassa a mezőt
(`_PALETTE_OPERAND_FLAGS`: TEXT, BYTE, LABEL, REGION, WORD … LBxx) vagy a címzési mód operandust kér; `"parse"` = minden más
paraméteres makró: a beírt szöveg a makró Expert-sorának argumentuma (`_paletteMacroSyntax` az alapblokk sorából, pl.
`.set_bg` + `$06`), `parseExpertText`-tel lesz blokk; a kitöltő szöveg az alap argumentum. Fájl-makrók (`_PALETTE_FILE_FLAGS`:
INCBIN/KOALA/LEVEL, INCLUDE, SID, TABLE) és a paraméter nélküliek tiltva. Új makrónál elég a `_blockToExpertLine` + `parseExpertText` ág.

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

### Hangszer-modell, motor, lejátszó (közös algoritmus)

- **Hangszer** (`_sidNewInst` / `_sidInstNorm`): hullámforma + `ring`/`sync`, ADSR, PW, szűrő (`filt` route, `lp/bp/hp`, `off3`,
  `cut` → `cutEnd` söprés `cutSpeed`/frame, `cutPing`), vibrato (`vibDelay/Speed/Depth`), PWM (`pwmSpeed/Min/Max`),
  `gateTimer` + `hr` (hard restart) + `firstWave`, wave/arpeggio tábla (`table: [{w, n, abs}]`, `tableLoop`, `tableSpeed`).
- **`_sidTuneData()`** → paraméterenkénti bájt-tömbök (`ictl, iad, … itsp`, tábla `tw/tn/ta`); ebből dolgozik a 6502 export,
  a JS motor és (szövegként) a UB export.
- **JS motor** (`_sidEngineNew`, `_sidEngFrame` = egy IRQ): a 6502 lejátszó frame-pontos modellje, `e.regs` = a SID-regiszterek.
  Minden előnézet (hangjegy, akkord, arpeggio, sor, pattern) a valódi SID-en (WebSid) szól: **regiszter-stream**
  (`_sidStreamPrg` kis PSID $1000-n, 64 frame-es ring $2000-n, rd/wr `$1F00/$1F01`; `_sidStreamEnsure`, `_sidStreamPump`,
  `_sidStreamNote`, `_sidStreamSilence`; teszt `tests/sid-stream.test.js`) — a JS motor frame-enként tölti a ringet.
  WebSid nélkül a `_sidSynthRender` kis szintetizátor a tartalék (`_sidRenderEngine`, `_sidWaSchedule`).
  A „Play: All” a valódi exportált lejátszót futtatja; a sorkiemelés a motor eseményeiből jön.
- **6502 lejátszó** (`_sidExportAsmPlayable`, `* = $C000`; ha kód (`_SID_PLAYER_CODE_MAX`) + adat + állapot elérné a `$D000`-t, az adat külön szegmensbe kerül, amely `$A000` alatt végződik, `_sidExportAsmPlayable.dataOrg`; a PSID export onnan vág): `sid_init`, `sid_irq` → `sid_frame` (sor-lépés `$2F` frame-enként,
  `sid_hr_check`, `sid_update`: tábla, hangmagasság, vibrato, PWM, szűrő-söprés), `sid_set_voice` (note on), effekt-rutinok
  `sid_vib_vN/sid_slideup_vN/sid_slidedown_vN`; állapot a `sid_state` területen. ZP: `$02-$1C`, `$2F`, `$FB-$FD`.
- **Teszt:** `tests/sid-player.test.js` a `tests/mini6502.js` assemblerrel + CPU-val frame-ről frame-re veti össze a lejátszó
  SID-írásait a JS motorral. A UB lejátszó (UltimateBasic `compiler/tune.rs`, 1.6.2) ugyanezt az algoritmust futtatja:
  `node scripts/sid-ub-fixture.js <UB>/tests/fixtures` generálja a `tests/tune_player.rs` fixture-jét.
- **`.bin` formátum:** `0xFD` (kiterjesztett hangszerek + név + sebesség); `0xFE` és a jelöletlen régi formátum is betölthető.

### Workflow

1. Megnyitod a SID szerkesztőt → zene
2. Files menü → **Export to blocks** → a player + adat blokkok a `program[]` végére kerülnek (`* = $C000` ORG-gal külön szegmens)
3. A fő kódodba **te raksz** egy `JSR sid_init` blokkot ahol indulnia kell (általában a programod elején)
4. Compile → PRG → VICE → szól

### Korlátok

- **Egyetlen pattern lista loop-pal** — sequence (pattern sorrend) tábla még nincs
- Max 256 pattern és 255 song-lépés; hosszú dalnál az adat `$C000` alá kerül (lásd fent), ez ütközhet a saját programoddal
- **ZP használat:** `$02-$1C`, `$2F`, `$FB-$FD`. Ha a fő programod is bántja, ütközik
- **Vol slider per-instrument látszik, de a SID-en globális** ($D418). Az utolsóként triggerelt voice-é "nyer"
- **Per-channel volume a SID-en nem létezik** — ADSR `S` (sustain) szint a legközelebbi
- Csak a WebSid nélküli tartalék szintetizátor nem 1:1 a valódi SID-del (ring/sync, filter karakterisztika eltér)

### SID Player — HVSC

A SID Player `#websid-play-hvsc` gombja a `#websid-hvsc` panelt nyitja (High Voltage SID Collection): katalógus =
`DOCUMENTS/Songlengths.md5` (útvonal + subtune-hosszak, `_hvscParseCatalog`, keresés `_hvscSearch`, min. 2 karakter),
dal-letöltés egyenként (`hvsc_fetch`, cache: app cache dir `hvsc/`), helyi kibontott mappa (`hvscPath` a configban,
`hvsc_choose_folder`), teljes gyűjtemény egyben (`hvsc_download_all`: hivatalos .7z a `hvsc.brona.dk`-ról, `sevenz-rust2`,
`hvsc-download-progress` esemény, `hvsc_cancel_download`). Backend: `src-tauri/src/hvsc.rs`; tükrök `HVSC_MIRRORS`.
A playlist elem `lengths` / `hvsc` mezője adja a seek bar hosszát és az auto-advance-t (`_sidPlayerTuneMs`).
Teszt: `tests/hvsc-catalog.test.js`, Rust `real_hvsc_archive_unpacks` (#[ignore], `HVSC_ARCHIVE` env).

### Idegen .sid / .bin fájlok

**.sid import** (Files → `#sid-import-sid` → `#sid-import-sid-dialog`: subtune + hossz mp-ben): a Rust `sid_register_dump`
(`SidFilePlayer::dump_registers`, frame-enként 25 SID-regiszter + gate-él bájt) lefuttatja a dalt, a `_sidDumpImport` ebből
patterneket csinál: hangjegy = gate-él (≤2 frame-en belüli újragate összevonva) vagy legato (tartott gate alatt új félhang
≥ 5 frame-ig); sorok = a hangkezdetekre illesztett L / L+1 frame-es sorok (funktempo, swing), a sorhossz-váltás `F` effekt
egy sorral előbb (elsőbbsége van a `C` előtt); hangmagasság = a fő hullámforma leggyakoribb félhangja; hangszer = ADSR +
fő hullámforma + PW/PWM + szűrő + wave tábla a teljes hangból (a következő hangig, a néma hard-restart frame előtt vágva;
lépésenként abszolút vagy relatív hangmagasság az azonos formájú hangok szavazata alapján, teszt-bites / néma frame = `$08` lépés hangmagasság nélkül; legrövidebb előtag + ismétlődő periódus, max 32 lépés; félhangnál kisebb szabályos kitérés → hangszer-vibrato `vibDelay/Speed/Depth`); gate: későbbi sorban `C`,
a következő hang előtt < sorhossz frame-mel gate timer (+ hr, ha az ADSR nullázva), egyébként S = 0, D = R. Max 128 hangszer,
a 255 lépéses tábla-keretet használat szerint osztja (azonos táblát a `_sidTuneData` egyszer tárol). Csak asztali appban (VA SID Core). Teszt: `tests/sid-dump-import.test.js`
(a szerkesztő motorjával is visszajátssza), Rust `register_dump_flags_gate_edges_*`, valódi dalra `SID_DUMP_IN/OUT` +
`dump_registers_to_file` (#[ignore]).

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

**Jelenlegi állapot:** javítva (VICE-ban ellenőrizve). Valódi ok: `sfx sys` után a user kód RTS-e
a BASIC-be tér vissza, de a szövegmutató az SFX saját (felülírt) SYS sorára mutat → `?SYNTAX ERROR`.
A `crunch_with_exomizer` (lib.rs) BASIC sorral kezdődő PRG-nél `sfx basic`-et használ (kicsomagolás
után RUN-nal a valódi `10 SYS…` sor fut, `basic_program_end`), stub nélküli PRG-nél `sfx $<betöltési cím>`-et.

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

### Saját leckék — Tutorial Editor

Tutorials ablak → `#tutorial-editor-btn` → `#tut-editor-dialog` (`setupTutorialEditor`, `openTutorialEditor`, `_te*`).
Formátum `va-tutorial` (`{id, difficulty, clearProgram, org, titleXx/descXx, items: [{kind: "text"|"instr", block, target}]}`),
fájlonként az app config `tutorials/` mappájában (`tutorials.rs`: `list/save/delete_user_tutorial`, `open_tutorials_folder`),
export/import `.vatut`. „Lépések a programból” (`_tutItemsFromBlocks`) → minden blokkból a beépített guided lecke mintája
(`_tutExpandItems`): mnemonik választás (csali mnemonikkal, `prepPalette`; a kategória a palettakönyvtárból, `_tutCategoryOf`)
→ operandus (`prepMode`; csak ha a paletta operandus-mezője engedélyezett: `_tutPaletteTakesOperand`, ugyanaz a szabály, mint
`updateOperandField`) → Add (`trackAdded`) → makróknál paraméter-lépés (`adjust`: a hozzáadott blokkra mutat, `_tutEnterAdjust`
pollozza, a sor egyezésekor továbblép; `autoParams` = automatikus kitöltés). Mappa: `data.category` (bármely tutorial-kategória,
ismeretlennél `custom`). Szöveg-fallback: `_tutText` (nyelv → En → Hu → bármely → `*Auto` generált). Teszt: `tests/tutorial-editor.test.js`;
a paletta mind a 160 eleme végigjátszva a previewban.
Online leckék: Tutorials → `#tutorial-online-btn` → `#tut-online-dialog` (`openOnlineLessons`, `_tutOnlineInstall`,
`_tutOnlineState`: new / update (`rev` nagyobb) / installed). A közzététel = `.vatut` feltöltése a
`va-product-site/lessons/` mappába; az `index.php` JSON-listát ad (`va-lesson-index`), Rust `list_online_tutorials` /
`download_online_tutorial` (`https://www.c64va.pro/lessons/`, fájlnév-ellenőrzés). A szerkesztő mentéskor növeli a `rev`-et.
Kezdő lecke: `lessons/va-first-colors.vatut`.

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

`2.6.3` — `package.json`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`, `index.html`
What's New dialógus, `README.md`, `README.txt`, `INSTALL-MAC.md`, `INSTALL-LINUX.md`, `Visual Assembler Manual.md`, `Visual Assembler Manual.hu.md`, `AGENTS.md`, és ez a fájl + copilot-instructions.md.

> **Kézikönyv-szinkron:** a `Visual Assembler Manual.md` (angol, forrás) mellett van egy
> `Visual Assembler Manual.hu.md` (magyar fordítás). Ha az egyiket szerkezetileg módosítod
> (új/átnevezett/áthelyezett szakasz, kódblokk), tükrözd a másikba is. A `tests/manual-sync.test.js`
> ellenőrzi a fejléc-szerkezet (H2/H3/H4 darabszám), a számozott szakaszok sorrendje, a
> code-fence-ek párossága és a verziószám egyezését — ha elcsúsznak, ez a teszt megbukik.
> Az app a bundelt `docs/Visual Assembler Manual.pdf`-et nyitja (az angol .md-ből generált),
> a .md-k a szerkesztési forrás.

> **Weblate:** a `va-product-site/ub-manual` és `va-product-site/va-manual` mappák tartalmát Weblate fordítja — verzióemeléskor és dokumentáció-frissítéskor **ne szerkeszd** őket.
Fő 2.6.3 változások: **.sid import a SID szerkesztőben** (Files → `#sid-import-sid` → `#sid-import-sid-dialog`, Rust `sid_register_dump` / `SidFilePlayer::dump_registers`, `_sidDumpImport`: gate-él + legato hangok, L / L+1 frame-es sorok `F` effekttel, wave tábla a teljes hangból, lépésenkénti abszolút / relatív szavazás azonos hangszerformánál, teszt-bites frame = `$08` lépés, vibrato → hangszer-vibrato, gate → `C` / gate timer / S=0,D=R, max 128 hangszer; `tests/sid-dump-import.test.js`). **Hosszú dal adata `$A000` alá** (`_SID_PLAYER_CODE_MAX`, `_sidExportAsmPlayable.dataOrg`, a PSID export onnan vág). **VA SID Core előnézet újragate** (26. bájt = újraindított voice-ok, `_sidVaCoreFrame`, Rust `write_preview_frame`: ADSR előbb, ctl utoljára). **Közös wave tábla tárolás** (`_sidTuneData`). SID szerkesztő: fejlécben az emuláció (`#sid-engine-name`, `_sidEditorEngineSync`), Speed − / + (`#sid-speed-down/up`, 1–255), BPM címke javítva. **UltimateBasic 1.6.6** (`Cargo.lock` → `17b7d7c`): PRINT USING, sztring-összehasonlítás, lebegőpontos rnd / mod, `option basic print` (`CompileOptions.basic_print`, a VA `false`-t ad, a program maga kapcsolhatja be), UB kiemelés `print using` / `option basic` (`_UB_CONTEXT_KEYWORDS`, `option` a `_UB_KEYWORDS`-ben). **Update szerver a Beállításokban** (`#update-server`, `loadUpdateServer` / `_saveUpdateServer`; Rust `get_update_server` / `set_update_server`, config `updateServer`, `normalize_update_server`: https, http csak localhostra, `/`-re végződik; az oldal- és letöltési URL-ek `<szerver>` + `downloads/VA/`, alapérték `UPDATE_SERVER_DEFAULT`). **Kiadás csak a támogatóknak vagy mindenkinek** (`register/release.php`: TO SUPPORTERS / TO EVERYONE / ROLL BACK; `VA_UPDATE_SUPPORTER_SETTING` = `update_supporter_version`, `vaUpdateApproved($db, $supporter)` sosem régebbi a mindenkiénél; `downloads/VA/index.php?sup=1`; az app `check_for_update` `?sup=1`-et küld, ha `is_supporter` — jelző, nem zár; a `download.php` mindig a mindenkinek kiadott verziót adja). Customer message `id` = `sid-import-263`.
Korábbi 2.6.2 változások: **HVSC a SID Playerben** (`#websid-play-hvsc` → `#websid-hvsc` panel; katalógus = HVSC `DOCUMENTS/Songlengths.md5`, `_hvscParseCatalog` / `_hvscSearch` (min. 2 karakter) / `_hvscRandom`; Rust `src-tauri/src/hvsc.rs`: `hvsc_status` / `hvsc_catalog` / `hvsc_fetch` (tükrök `HVSC_MIRRORS`, cache az app cache dir `hvsc/` mappájában), helyi mappa `hvscPath` (`hvsc_choose_folder` / `hvsc_clear_folder`), teljes gyűjtemény `hvsc_download_all` (hivatalos .7z, `sevenz-rust2` + `ppmd`, `hvsc-download-progress`, `hvsc_cancel_download`); a playlist elem `lengths` / `hvsc` mezője adja a seek bar hosszát és az auto-advance-t (`_sidPlayerTuneMs`); `tests/hvsc-catalog.test.js`). **Spektrum-analizátor** (`#websid-play-viz` → nem modális `#sid-viz-dialog`, `setupSidVisualizer`, `_sidVizDraw`; AnalyserNode a `_sidMasterGain`-en és a WebSID `_gainNode`-ján, 8/16/24/32 log sáv `_sidVizBandLevels`, a SID Playerrel együtt zárul / nyílik; `c64va-sid-viz`; `tests/sid-visualizer.test.js`). **Lecke-szerkesztő** (`#tut-editor-dialog`, `_te*`, formátum `va-tutorial` / `.vatut`, `_tutExpandItems`: mnemonik (csali) → operandus → Add → paraméter-lépés csak ha kell (`_paletteMacroLine`); Rust `tutorials.rs`; `tests/tutorial-editor.test.js`). **Online leckék** (`#tut-online-dialog`, `list_online_tutorials` / `download_online_tutorial`, oldal `va-product-site/lessons/` + `index.php`; feltöltés: szerkesztő Files → `#te-upload` → `#te-upload-dialog` (`_teUploadSend`, név / e-mail a Support kulcsaival), Rust `upload_tutorial` → `register/lesson.php` (IP-korlát `va_support_rate`, tábla `va_lesson_submissions` első használatkor, `vaLessonsTable`), dashboard `register/lessons.php` (PUBLISH → `lessons/<id>.vatut` + `author`, REJECT, UNPUBLISH; más szerző azonos id-jénél új id)). **Egységes paletta-operandus** (`_paletteOperandKind`: field / parse, `_paletteMacroSyntax`, minden paraméteres makró az Expert-sor argumentumaként kapja). **Aktív lebegő ablak kiemelése** (`_dlgMarkActive`, `.dlg-active`). **Frissítés-kiadás a dashboardról** (`register/release.php`: a `downloads/VA/index.php` és a `download.php` csak a kiadott verzióig kínál telepítőt, `VA_UPDATE_SETTING`, alapérték `VA_UPDATE_DEFAULT` = 2.6.1). Apróságok: Support ablak chat-elrendezés, tab-sáv görgővel vízszintesen, memóriasáv elválasztva, UB kódméret-gutter, undock tooltip. Customer message `id` = `lessons-262`.
Korábbi 2.6.1 változások: **Ciklus-gutter** az Expert szerkesztőben (`#expert-cycles-btn`, `_OP_CYCLES`, `_OP_PAGE_PENALTY`, `_cycleInfo` / `_cycleCollect` / `_cycleSum`; branch `2/3`, laphatáron `2/4` piros, indexelt olvasás `4+`; kijelölés-összeg a státuszsorban raszter sorral, PAL 63; `tests/cycle-count.test.js`). **Peephole-tippek** (`_lintAsm`: JSR+RTS, CMP/CPX/CPY #0, újratöltés, LDA/CLC/ADC #1/STA → INC/DEC, JMP / branch a következőre, PHA+PLA; `.expert-hint-line`, `#expert-lint-btn` + közös `#expert-lint-pop`; `tests/peephole-lint.test.js`). **Zero page foglaltság** a memóriatérképen (`_zpAccesses`, `_zpAnalyze`, `_zpCollect`, `_zpRenderPanel`; CPU / szabad / BASIC / KERNAL terület, írás / olvasás / pointer, SID-lejátszó ütközés a `sid_` címkéjű kóddal; `tests/zp-map.test.js`). **Táblagenerátor** (`#table-gen-btn` → `#table-gen-dialog`, `_TG_TYPES`, `_tgGenerate` / `_tgFormatAsm` / `_tgFormatUb` / `_tgToBin`: képernyő- és bitmap-sorcím, bitmap oszlop, pixelmaszk, ·k, negyed-négyzet, reciprok, /k, mod k, log2, exp2, bittükrözés, saját kifejezés; speedcode `_tgSpeedcode` (kitöltés / másolás, teljes unroll vagy X-ciklus); lo/hi vagy .word, `.align 256`, UB-export, .bin; `tests/table-generator.test.js` mini6502-vel). **Sprite multiplexer sablon** (`templates/sprite-multiplexer.asm`, 16 sprite, Y-rendezés + raszter IRQ-lánc; VICE-ban ellenőrizve). **SID → .sid (PSID)** (`#sid-export-psid`, a `_buildSidPreviewPrg` `$C000`-tól vágva). **VICE remote monitor** (`src-tauri/src/vice_monitor.rs`: binary monitor kliens, API 2, események átlépése, `Drop` → exit; `launch_vice` / Exomizer-futtatás `-binarymonitor`-ral, kapcsoló `uiSettings.viceRemoteMonitor` (#vice-remote-monitor), port `viceMonitorPort` = 6502; commandok `vice_mon_write` (RAM bank, újraindításnál SP=$FD + $A474 visszatérés) / `vice_mon_read` (cpu bank) / `vice_mon_sample` (PC + LIN); frontend `#vice-mon-btn` → nem modális `#vice-mon-dialog`: hot reload (`_vmBuildSegments` a foglalt tartományokból), auto reload (`markTabDirty`), élő watch (`_vmParseWatch`, `c64va-vice-watch`), profiler (`_vmAddressMap`, `_vmAggregate`, rutin + sor + raszter-tartomány); `tests/vice-monitor.test.js`, Rust `real_vice_*` #[ignore] teszt valódi VICE-szal). **Memóriapanel leválasztása** (`#memory-undock-btn` → nem modális `#memory-float-dialog` a SID Player mintájára, `_memSetDetached`, `c64va-memory-float`). **UB**: sor-hőtérkép (`#ub-heat-btn`, `_ubLineCost` a dbg listing-spanokból; `tests/ub-line-cost.test.js`), lint (`_ubLint`: sys $EA31/$EA81, wait key, nem használt var/dim/const, asm ZP-ütközés UB-változóval; `#ub-lint-btn`; `tests/ub-lint.test.js`), sprite szerkesztő → UB (`#se-export-ub`, `_spExportUb`: frame-enként sprdef, anim[] pointerek, raszter-szinkron léptetés; `tests/sprite-ub-export.test.js`). Ismert UB 1.6.4 hiba: `peek($07F8 + k)` byte k-val 8 bites összeadás — az export ezért kiírja a peek-eket. Nem modális ablakok sorrendje: `setupDialogStacking` / `_dlgRaise` (kattintás / megnyitás → z-index 9960 + sorszám). Profiler időkorláttal (`vice_mon_sample(duration_ms, interval_ms)`, `vice_mon_cancel`; egy minta ~22 ms a valódi VICE-ban). Customer message `id` = `tools-261`.
Korábbi 2.6.0 változások: **Ingyenes app** — a Freemium / Professional licencrendszer kikerült — nincs `license.rs`, `light_block`, `license_status` / `license_activate` / `license_deactivate` / `license_request` command, `ed25519-dalek` függőség, frontend `_vaLicense*` / `_VA_FULL_ONLY` / `_VA_FREE_LANGUAGES` / `_VA_FREE_THEMES`, `#license-dialog` / `#license-badge` / `#license-btn` / `#about-license` és `license*` i18n kulcs; minden szerkesztő, build, hardveres futtatás, nyelv és téma szabad. A bug dialógus közös osztályai `form-field` / `form-status`, kulcsai `bugClose` / `bugInvalidEmail` / `bugNetwork`; a `bug_report` payloadban nincs `licensed`. A `report_license_activation` helyett névtelen indulás-ping: `app_launch_ping(lang)` command (a frontend `_serverMessageStartup` hívja 8 mp-cel induláskor; config `launchPing: {id, day, count}`, `id` = véletlen 32 hex (`install_id` / `new_install_id`), `count` = indítások az előző sikeres ping óta, naponta max. egy küldés) → `register/ping.php` POST `{id, version, os, lang, launches}`. Ad-hoc szerverüzenet: `fetch_app_message(lang)` → `register/message.php` GET (`{id, title, body, url, level}` vagy null), a frontend `#server-message-dialog`-ban mutatja (sima szöveg, opcionális link-gomb, `level: warn` piros cím), a látott id-k a `localStorage` `c64va-server-message-seen` listában; i18n `serverMessageTitle` / `serverMessageOpen`. A szerveroldal (`va-product-site/register/`): `ping.php` (POST, IP nélkül; `va_installs` telepítésenként + `va_install_days` napi sor, `launches` összeg), `message.php` (GET `version`/`os`/`lang`/`id` → a legújabb aktív, időablakon belüli, OS-re és verziótartományra (`version_compare`) illő `va_messages` sor, `id` = `m<sorszám>`, magyar szöveg `lang=hu`-nál, különben angol; `va_message_views` = kinek ment ki), `messages.php` admin (létrehozás / szerkesztés / be-ki / törlés, EN + HU cím és szöveg, link, info/warn, OS, min/max verzió, kezdete/vége), `stats.php` USAGE rész (ma / 7 / 30 napos aktív telepítések, visszatérők, indítások, napi bontás, használati napok, verzió / OS / nyelv, 50 legaktívabb telepítés); a PayPal-vásárlás (`paypal.php`, `webhook.php`) törölve, a `buy.php` a főoldalra irányít (a 2.5.9-es app Buy gombja). A weboldalon nincs ár / BUY / Freemium-táblázat, a licenc GPLv3. Süti-hozzájárulás: `va-product-site/assets/consent.js` (az `index.html`, `docs.html`, `privacy.html` tölti be; `va_consent` süti `1.<prefs><stats>`, 180 nap; `vaConsent.get('prefs'|'stats')`, `[data-cookie-settings]` újranyitja, `va-consent` esemény); a `va_docs_*` sütik csak `prefs`-szel (`setPrefCookie` a `docs.html`-ben), a `visitor-counter.php` csak `?count=1`-re számol és állít sütit, `?forget=1` törli. Adatkezelési tájékoztató: `va-product-site/privacy.html` (EN + HU). A `register/lib.php` időzónája `Europe/Budapest`; a `message.php` az üzenet időablakát PHP-ban nézi. Admin dashboard: `details.box[data-keep]` becsukható doboz, állapota localStorage-ban (`VA_ADMIN_JS`). Az app a szerverüzenettel csak modális dialógusra vár (`dialog[open]:modal`), a nyitva hagyott Számrendszer-átváltó / SID Player nem tartja vissza. Szerverüzenet bővítés: felirat (`caption_en/hu`, a cím fölötti kis sor, `#server-message-caption`), HTML-szöveg (`_serverMessageSanitize`: csak P, BR, B, STRONG, I, EM, U, S, SMALL, CODE, PRE, BLOCKQUOTE, H3, H4, UL, OL, LI, HR, SPAN és A http(s)/mailto href-fel, a link `openExternal`-lel nyílik; tag nélküli szöveg sortörésekkel), kép (`va_messages.image` MEDIUMBLOB + `image_mime`, max 1 MB, PNG/JPEG/GIF/WebP; `message.php?image=<id>` csak aktív üzenethez; a Rust `fetch_app_message_image` data URL-ként adja, max 2 MB, mert a CSP csak `data:` képet enged; `#server-message-image`). Régi táblán a `vaMessagesMigrate` (lib.php) adja hozzá az oszlopokat. A `messages.php`-ban élő előnézet (sandboxolt iframe, ugyanaz a szűrés). Célzás és használati idő: az app `is_supporter` (lib.rs) igen/nem jelzőt küld, ha a configban még ott a 2.5.6–2.5.9-es `license` {email, serial}: a pingben `supporter`, a `message.php`-ban `sup=1`; az üzenet `audience` = '' / `supporters` / `others`. RESET SEEN a `messages.php`-ban: `rev` + 1, az app id-je `m<sorszám>-<rev>`, így mindenkinek újra megjelenik. Aktív használati idő: a frontend `_usageStart` percenként számol (ablak látható + bevitel az utolsó 5 percben, `_USAGE_IDLE_MS`), 5 percenként és elrejtéskor `app_usage_add(minutes)` → config `launchPing.minutes`, a ping `minutes` mezőben küldi (sikeres küldés után levonja); szerveren `va_installs.minutes` / `supporter`, `va_install_days.minutes` (`vaInstallsMigrate`); a `stats.php` USAGE: aktív órák, telepítésenkénti idősávok, napi H:MM, SUP jelölés. GeoIP és diagramok: `register/geoip.php` (admin, nav GEOIP) a db-ip.com IP to Country Lite CSV-t (CC BY 4.0, havonta új) lépésenként tölti be (download → unpack → import 12 mp-es darabokban → finish; `va_geoip_new` + RENAME, `register/geoip-data/` .htaccess-szel tiltva; FTP-vel feltöltött fájlhoz IMPORT UPLOADED FILE); `va_geoip` (BINARY(16) `ip_from`/`ip_to`, IPv4 ::ffff:-re képezve, `vaIpBin`), lekérdezés `vaCountryForIp` (UNHEX, nem nyers bájt), `va_settings` (`vaSetting`); a `ping.php` csak az országkódot menti (`va_installs.country`), az IP-t nem. A `message.php` minden indításkor frissíti a `va_installs.last_at`-ot. A `stats.php`-ban `vaColumnChart` (admin.php, SVG oszlopdiagram, `[data-tip]` tooltip a `VA_ADMIN_JS`-ben): napi aktív telepítés, használati idő, új telepítés, letöltés; COUNTRIES (`vaCountryName`, intl-lel név) és TOP 10 használat. Szerveroldali HTML-tisztítás: `vaCleanMessageHtml` (lib.php, DOMDocument, ugyanaz a whitelist, mint `_serverMessageSanitize`) mentéskor és a `message.php` kiadásakor. Támogatási csevegés: Menü → `#support-btn` → `#support-dialog` (`setupSupport`, `_supportOpen`, `_supportSend`, `_supportRender`, `_supportFillText` linkekkel, nyitva 15 mp-enként frissít; `_supportStartBackground` / `_supportCheck`: az első üzenet után (`localStorage` `c64va-support-active`) induláskor és 5 percenként `check`, új válasznál `.has-unread` pötty a Menü / Support gombon, és egyszer megnyitja az ablakot, ha nincs modális; e-mail `c64va-support-email`; i18n `support*` mind a 7 nyelven). Rust `support_api(lang, payload)` az install id-t, verziót, OS-t teszi hozzá → `register/support.php` (POST `send` / `thread` / `check`; `va_support_threads` install_id-nként, `va_support_messages`, `va_support_rate` IP-limit 1 napig; értesítés `support_notify` vagy `bug_notify`). Dashboard: `register/inbox.php` (nav SUPPORT olvasatlan-számmal `vaSupportUnread`, lista OPEN/CLOSED/ALL, beszélgetés, válasz opcionálisan e-mailben, CLOSE/REOPEN/DELETE, `?poll=1` élő frissítés), a STATS tetején figyelmeztetés olvasatlannál. Support csatolmányok és ablak: a `#support-dialog` nem modális (`show()`, `.support-hdr` húzható a `setupDraggableEditorDialogs`-ban, a `.support-card` `resize: both`, méret `c64va-support-size`, Esc / × zár); kötelező név (`#support-name`, `c64va-support-name`, a szerver `name` hibával utasítja el); csatolmány mindkét irányban: max 3 fájl / 4 MB (`_SUPPORT_FILE_EXT` = `VA_SUPPORT_FILE_EXT`: képek, asm/ub/txt…, prg/d64/sid/crt…, zip), `_supportAddFiles` (gomb, Ctrl+V, húzás), küldés `attachments: [{name, data base64}]`, megjelenítés `_supportRenderMsgFiles` (kép data URL-ként `support.php` `file` akcióval, `_supportFileCache`), mentés `_saveBinFile`; szerveren `va_support_files` (MEDIUMBLOB), `vaSupportCheckFiles` / `vaSupportStoreFiles` / `vaSupportSendFile` (kép inline nosniff + sandbox CSP, minden más letöltésként), `inbox.php?file=<id>[&inline=1]`, válasz csatolmánnyal (`files[]`), törléskor a fájlok is. Értesítés: az app percenként `check`, új fejlesztői üzenetnél `_supportBeep` (WebAudio négyszögjel, némítás `#support-sound`, `c64va-support-sound`), `_supportAttention` (`requestUserAttention`, capability `core:window:allow-request-user-attention`), kiemelés `.support-msg--new` (utolsó látott id `c64va-support-last-admin`); a dashboardon a `VA_ADMIN_JS` 15 mp-enként `inbox.php?poll=1` ({unread, msgs}) → `#nav-support` szám, fülcím „(N)”, `vaBeep` (első kattintás után, `va-admin-sound`, SOUND gomb az inboxban), `va-support-change` esemény (a lista újratölt). A STATS `#manage` doboza is `details[data-keep]`, a horgonyra mutató címnél mindig nyitva. Eszköztár-jelző `#support-notify` (a Menü mellett, `_supportSetUnread`): csak ha van beszélgetés (`c64va-support-active`, a `check` `thread` mezője állítja / törli; indításkor mindig egy `check`), csendes ikon; olvasatlannál `.support-notify--unread` piros, villog, darabszám, i18n `supportNewMessage`; kattintás → `_supportOpen`. GeoIP feltöltés: ha a tárhely nem tudja letölteni (Cloudflare / kimenő tiltás), a `geoip.php` UPLOAD FILE gombja a böngészőből 1 MB-os darabokban tölti fel a `.csv.gz`-t vagy `.csv`-t (`upload_start` / `upload_chunk` offset-ellenőrzéssel), utána unpack → import → finish; a letöltés böngészős UA-val, 45 mp-cel, gzip-ellenőrzéssel, a hibaüzenet HTTP-kóddal és cURL-hibával; a nem JSON választ (PHP-hiba, 504) a felület is kiírja. Törlés: a `support.php` `delete` (`message_id`, a saját beszélgetésben bármelyik fél üzenete) és `delete_all` (az egész beszélgetés, utána `thread: false`) akció, közös `vaSupportDeleteMessage` (olvasatlan-számlálók igazítása) / `vaSupportDeleteThread` (lib.php); az appban üzenetenként `.support-msg-del` ×, a fejlécben `#support-delete-all` kuka (`_supportDeleteMessage` / `_supportDeleteAll`, `_showConfirm`, i18n `supportDelete*`); az `inbox.php`-ban üzenetenként × (`delete_msg`), beszélgetésenként DELETE, a listán DELETE ALL CONVERSATIONS. Adomány: `register/donate.php` (EN/HU oldal, 3/5/10/20 € vagy egyéni 1–500, opcionális üzenet, PayPal Smart Buttons `label: donate`; POST `create` → `vaDonationCreate` / `capture` → `vaDonationCapture` a `register/paypal.php`-ban, Orders v2, összeg- és pénznem-ellenőrzés, `va_donations` tábla, értesítő e-mail; IP-limit a `va_support_rate`-tel); config `paypal` {mode, client_id / `VA_PAYPAL_CLIENT_ID`, secret / `VA_PAYPAL_SECRET` (gyökér .htaccess SetEnv), currency, brand} és `donate_fallback_url` (PayPal nélkül ezt mutatja); a weboldal SUPPORT DEVELOPMENT gombja és a letöltési felugró erre mutat; az appban Menu → View alatt `#donate-btn` (i18n `donate`) → `openExternal(donate.php?lang=…)`; a STATS-ban DONATIONS csempe és becsukható `#donations` doboz. Customer message `id` = `free-260` (mind a 7 nyelven, a What's New-ban csak ez: a licencelés megszűnt, mert a magyar adószabályok mellett nem érné meg pénzért adni). A `scripts/keygen.js` és a `register/index.php` serial-küldése a 2.5.9-es appok miatt marad.
Korábbi 2.5.9 változások: **Commodore Beige téma** (`data-theme="beige"`, világos): a Light téma szabályai (light-párú szelektorok) + saját változók, `--c64-badge` szivárványcsík (`body::after`, téma-ikon, splash), mustár `.primary`, C64 kék `.monitor-output`; a téma-kör vége … → starlight → beige → light. **Commodore Starlight téma** (`data-theme="starlight"`, világos): a Light téma szabályai (light-párú szelektorok) + saját változók és `--sl-rainbow`, áttetsző fehér panelek, pasztell RGB-fény a `body` hátterén és `body::after` szivárvány csík, gradiens `.primary`, füstös sötét `.monitor-output`, a téma-kör `toggleTheme`-ben (… → commodore77 → starlight → light), korai háttérszín az `index.html` fejléc-scriptjében. **Commodore 64 téma** (`data-theme="c64"`, sötét): a C64 bekapcsolási képernyője — `--bg` = világoskék keret (`#7869c4`), panelek / szerkesztők C64 kék (`#40318d`), szöveg világoskék, inverz `.primary`, C64-paletta szintaxisszínek, `.monitor-output` C64ProMono betűvel; a keret-háttéren álló szövegek (`.eyebrow`, `.hero-copy`, `.memory-strip-axis`) sötétkékek; a `style.css` végén, korai háttér `#7869c4`. A téma-kör (`toggleTheme`): light → dark → oled → commodore77 → starlight → beige → c64 → light. **Verziókezelés ablak**: mozgatható (`setupDraggableEditorDialogs` → `project-snapshot-dialog` / `.project-snapshot-hdr`), a mentett pozíciót a `showModal()` előtt és után is alkalmazza (`_applyPosition`), `_vcClampDialog` a képernyőn tartja, ha a napló / diff megnöveli; kívülre kattintás már nem zárja (csak Esc / cancel). Customer message `id` = `themes-259`.
Korábbi 2.5.8 változások: **Verziókezelés** (a projekt snapshotok helyett, `_vc*` az `app.js`-ben): a `<projekt>.snapshots.json` tár git-szerűen — commit üzenettel + rövid hash (`_vcHash`), HEAD = legutóbbi nem-autosave bejegyzés, autosave bejegyzések (`kind: "auto"`, max `_PROJECT_SNAPSHOT_MAX_AUTO` = 20, összesen max 100), diff (`_vcLineDiff` LCS + 3 sor kontextus; `_vcSmartDiff` / `_vcComparable`: ha nem mindkét oldalon van Expert forrás, mindkettő `_blockToExpertLine`-nal blokkokból generált sorokra), checkout a szerkesztőbe (`_vcApplyText`, lemezre csak mentéskor). UB fülön a payload `{ kind: "ub", ubText }` (`_vcIsUbTab`, `_vcUbFilePath`). **Git mód** (`_vcRenderGit`, `_vcGitCommit`, `_vcGitCheckout`, `_vcGitSimple`): Rust `git_exec` (engedélyezett alparancsok, `GIT_TERMINAL_PROMPT=0`, ssh BatchMode, CREATE_NO_WINDOW), `get_git_config` / `set_git_path` / `choose_git_executable`, `detect_git_executable` (PATH + szokásos mappák); status `--porcelain=v1 -b`, log `%x1f`-mezőkkel, diff értelmezve + **RAW** (`_vcRawDiff`), pull `--ff-only`, első push `-u origin <ág>`, `git init`; beállítás: Beállítások → Verziókezelés (`#git-path`, `#choose-git`, `#detect-git`, `#git-preferred` → `uiSettings.gitPreferred`). **Hibabejelentés** (`#bug-dialog`, `setupBugReport`, `_bug*`): max 4 kép (fájl / Ctrl+V / húzás, `_bugShrinkImage` 1920 px), rendszerinfó + `_vaErrorLog` (a script elején gyűjti a JS-hibákat), Rust `bug_report` → `va-product-site/register/bug.php`; dashboard `register/bugs.php` (státusz, megjegyzés, képek). **Licenc-szerver** (`va-product-site/register/`, PHP + MySQL, közös `lib.php` / `admin.php`): `index.php` serial kérése donoroknak (`va_donors`, címenként egyszer, `vaIssueSerial` sodium Ed25519 = `scripts/keygen.js`), `buy.php` + `paypal.php` + `webhook.php` PayPal Orders v2 fix áras vásárlás (5 €), `activate.php` aktiválás-jelzés (Rust `report_license_activation`), `stats.php` statisztika + kezelés, `download.php` letöltésszámlálás; titkok env-ből (`VA_SMTP_PASS`, `VA_SIGN_SEED`, `VA_DB_PASS`, `VA_PAYPAL_SECRET`, `VA_ADMIN_PASSWORD`); `keygen.js phpkey` / `donors-sql`; app: `license_request` (`#license-request`). **SID Player**: véletlen lejátszás (`_sidShuffle`, `_sidShuffleHistory`, `#websid-play-shuffle`) és kedvencek (`item.fav`, `.websid-play-item-fav`, a `.sidpl`-ben is). Product site: Freemium vs Professional táblázat (`#plans`), „JUST 5€” bélyeg. Customer message `id` = `version-control-258`.
Korábbi 2.5.7 változások: **VA SID Core 1.2 — C64 a VICE-ból Rustban** (`src-tauri/src/mos6510.rs`, `src-tauri/src/c64/`): ciklusra pontos 6510 (`mos6510.rs`, a VICE `6510dtvcore.c` / `mainc64cpu.c` / `c64cpusc.c` portja: buszciklusonkénti `read`/`write`/`read_dummy`/`write_dummy` + `tick(1)`, VICE interrupt-késleltetés `INTERRUPT_DELAY`=2, branch / CLI / SEI / PLP szabályok, IRQPEND 3 ciklus, NMI-eltérítés BRK alatt, BA-lopás `ba_low`, ANE `$EF` / LXA `$EE`; a régi `sid_file/cpu.rs` törölve), CIA 6526 / 6526A (`c64/cia.rs`: `ciacore.c` + `ciatimer.c`, ciklusonként: timer-állapotgép `ciat_next`, IFR-késleltetősor, timer B bug, PB6/PB7, SDR, TOD), VIC-II időzítés (`c64/vicii.rs`: `viciisc` ciklustábla PAL / NTSC / régi NTSC, raster IRQ, badline, sprite-DMA + crunch, BA; pixelrajzolás nélkül), CPU-port (`c64/pla.rs`: pull-up, 6./7. bit falloff); a SID-lejátszó gépe ezekre épül (`cpu.idle`, `cpu.poll`, `interrupt_ready`). GPL: a VICE GPLv2+, a projekt GPLv3. **Hi-Res: cellánkénti háttérszín** (`cellpaper` eszköz, `_hgSetCellBg`, `_hgErase`, multicolorban letiltva `_hgSyncModeTools`). **Pontos karakter-ROM** (`_c64RomDisplayChar`: C64 Pro Mono PUA `U+E000/E100` + reverz `U+E200/E300`, `_c64RomPetsciiCode`). **Sprite szerkesztő**: hires réteg (`_spOverlay`, `_spOv`, `_spLayer`), kitöltés, kijelölés / mozgatás (`_spSel`, `_spLift` / `_spStamp`), forgatás (`_spRotate`), tükrözött animáció (`_spMirrorAnim`), sprite sheet import (`#se-sheet-dialog`, `_spSheetConvert`), hitbox (`_spHit`, `_spHitboxAsm`), X/Y ×2 előnézet, zoom 40×-ig (`tests/sprite-tools.test.js`). **Pálya szerkesztő**: objektumréteg (`LEVEL_OBJ_*`), karakter-attribútumok (`LEVEL_ATTR`), él-ellenőrzés, képernyőnkénti színek (`LEVEL_SCR_*`, `LEVEL_BORDER`), memóriamérleg + RLE (`level_unrle`), Futtatás VICE-ban (`_lvRunInVice`). **Karakterszerkesztő** (`setupCharEditor`, `_ce*`): csempe 1×1 / 2×1 / 1×2 / 2×2 (`_ceTileW/H`, `_ceGetT`/`_ceSetT`, `_ceClampSel`), visszavonás (`_cePushUndo`, `_ceUndoOp`/`_ceRedoOp`, Ctrl+Z/Y), rajzeszközök (`_ceTool`: pencil/line/rect/fillrect/fill), forgatás (`_ceRotate`, csak négyzetes csempe), másolás / beillesztés (`_ceClip`, `_ceCopy`, `_cePasteAt`, jobb klikk a térképen), húzásos csere / Shift-másolás (`_ceMoveTile`), kisbetűs ROM (`_ceLoadRom(2)`, `#ce-load-rom2`, `#ce-rom-lower`), szöveges előnézet (`_ceTextToCodes`, `{nn}`/`{$nn}`), tartomány-export (`_ceRange`, `_ceRangeAsm`, `#ce-save-range`/`#ce-copy-range`) (`tests/char-editor.test.js`). **Charset Canvas zoom** 2×–24× (`_ccZoom`, `_ccSetZoom`, `#cc-zoom`, Ctrl+görgő, `c64va-cc-zoom`; 8×-tól pixelrács a Grid mellett); hires karakter multicolor módban (Color RAM 3. bit, `_ccCharMc`, `_ccSetCellMode`, `cellmode` eszköz, a koordináták mindig hires 128×128-ban; `tests/charset-canvas-cellmode.test.js`), BG hires módban is; ECM (`#cc-ecm`, `_ccEcm`, `_ccEcmBg`, `cellbg` eszköz, BG0–BG3 = `_ccBg`/`_ccMc1`/`_ccMc2`/`_ccBg3`, `_ccEcmGlyphs`: mentéskor ≤64 különböző karakter összevonva, kód = glyph | bg << 6); a vászon csak a látható rész, karakterenkénti puffer-frissítés (`_ccBuf`, `_ccDirty`, `_ccRenderFast`, `_ccBlit`); Hi-Res szerkesztő ugyanígy (`_hgViewport`, `_hgBlitSoon`, `#hg-canvas-sizer`); SID Player lista megtartja a görgetést és mutatja az aktuális számot (`_sidPlayerRevealCurrent`). Customer message `id` = `c64-core-257`.
Korábbi 2.5.6 változások: **SID Player** — `#sid-player-btn` → lebegő `#websid-play-dialog` (`_sidPlayerShow`, `_sidPlayerAddFiles`, lejátszási lista `_sidPlaylist`, `.sidpl` mentés/megnyitás, állapot `c64va-sid-player`); `_sidExtStartFile` → `_vaSidPlayFileBytes` (VA SID Core) vagy `_webSidPlayFileBytes`; tekerés csak VA SID Core-ral (`_vaSidSeek`); a lejátszó pufferei külön halmazban vannak (`_sidExtSources`), így az editor `_sidStop`-ja nem némítja el. **VA SID Core 1.1** — Rust SID-emuláció (`src-tauri/src/sid_core.rs`, `sid_file.rs`: 6581/8580, MOS 6581/8580-alapú 6581 szűrő, 6510 CPU, CIA/VIC időzítés, KERNAL `$EA7B` IRQ-farok), Tauri commandok `render_sid_preview` / `render_sid_file` / `sid_file_info` / `release_sid_*`; Beállítások → SID előnézet (`#sid-preview-engine`, `#sid-preview-model`). **SID szerkesztő** — tekerőgombok (`.sid-param-knob`), MIDI (`_sidMidiMessage`, `_sidMidiFlash`, `#sid-midi-led`), felvétel (`_sidRecordStart` / `_sidRecordTick`; a pattern végén `_sidRecordNextPattern` új patternt fűz a song-ba), metronóm + ütemlámpák (`_sidMetronomeBeat`, `#sid-beat`, `#sid-vkbd-beat`, `#sid-vkbd-metronome`, `#sid-vkbd-record`), pattern törlés (`_sidPatternDelete`, song átszámozás), GoatTracker .sng import (`_sidGoatImport` / `_sidApplyGoatImport`, `#sid-import-goat`, `tests/sid-goat-import.test.js`). **Freemium / Professional** — Ed25519 serial (`src-tauri/src/license.rs`, `LICENSE_PUBLIC_KEY`; `license_status` / `license_activate` / `license_deactivate`, `light_block` a Build PRG/D64/CRT, Exomizer, Ultimate és KFF2 commandokban), kulcsgenerátor `scripts/keygen.js` (privát kulcs a repón kívül: `~/.c64va/license-private.pem`; `csv` mód vásárlói listához); frontend `_vaLicense*`, `_VA_FULL_ONLY` (capture-fázisú kattintás-zár: szerkesztők, SID Player, Build, Exomizer, Ultimate/KFF2 futtatás), `_VA_FREE_LANGUAGES` (hu/en), `_VA_FREE_THEMES` (light/dark), `#license-dialog`, `#license-badge` (FREEMIUM / PROFESSIONAL az eyebrow mellett); Tauri nélkül (böngészős előnézet) teljes verziónak számít; `tests/license-keygen.test.js`. **Ultimate Basic 1.6.4.** Az About, customer message, update, Beállítások és What's New ablakban a szöveg nem jelölhető ki és a képek/linkek nem húzhatók (a szövegmezők kivételek). Customer message `id` = `sid-player-256`.
Korábbi 2.5.5 változások: **Hi-Res szerkesztő pixelrács** — bekapcsolt Grid mellett 4×-es nagyítástól (`_HG_PIXEL_GRID_MIN_ZOOM`, `_hgPixelGridOn`) minden pixel felső és bal éle rácsvonal, a karaktercella-határon erősebb; a vonalak a pufferbe kerülnek (`_hgDrawPixelBuf`), így a blit ára nem nő, a Grid kapcsoló ezért `_hgRenderAll`-t hív. A vonal színe a pixel színéből számolódik (`_hgGridShade`, `_HG_GRID_FINE` / `_HG_GRID_CELL`: világos színen sötétít, sötéten világosít), ezért mind a 16 C64 színen látszik. 4× alatt a cellarács az overlay-ben marad (`_hgOverlays`), szélessége `_hgCellW()` — multicolorban 4 logikai pixel (korábban hibásan 8, azaz 16 hires pixel) (`tests/hires-grid.test.js`). **Hi-Res nagyítás 16×-ig** (`#hg-zoom` max). **Jobb klikkes Copy / Paste menü** a Hi-Res, Map és Sprite szerkesztő vásznán (Sprite: a frame-csíkon is, `_spShowCtxMenu`) — közös `_edShowCtxMenu(e, host, items)` / `_edHideCtxMenu` (`#ed-ctx-menu`, a `block-ctx-menu` + `sid-ctx-menu` stílusával; az ikont a toolbar gombról klónozza (`iconFrom`), a menü a szerkesztő `<dialog>`-jába kerül, a `mousedown` `preventDefault`-ja a dialógusban tartja a fókuszt); a menüből indított beillesztés előnézete a kattintás helyén jelenik meg; új i18n kulcsok mind a 7 nyelven: `edCtxPasteTransparent`, `edCtxCopyFrame`, `edCtxPasteFrame`. `_ctxMenuPlaceAt(menu, x, y)`: a középre igazított szerkesztő dialógus `transform: translate(-50%, -50%)`-ja miatt a `position: fixed` menü a dialógushoz képest pozicionálódott — a helper kiméri és levonja az origót; a SID tracker menüje (`_sidShowCtxMenu`) is ezt használja. Javítva: a Hi-Res toolbar Paste gombja a click eseményt kapta `transparent` paraméterként, ezért mindig áttetszően illesztett be. **Number Converter kapcsoló gomb** — `_ncSyncButton`: a `#numconv-btn` `main-tb-btn--active` + `aria-pressed` állapota követi a dialógust (megnyitáskor és a `close` eseményre). **Customer message** — `CUSTOMER_MESSAGE.id` = `editors-255`, mind a 7 nyelven a 2.5.5 újdonságaival. Kézikönyv: a Hi-Res kijelölés / másolás / beillesztés dokumentálva.
Korábbi 2.5.4 változások: **Rejtett főablak javítás újraindításkor** — `tauri_plugin_window_state` (`lib.rs`, `run()`): a `StateFlags::VISIBLE` már sehol sem mentődik (macOS/Windows: `StateFlags::all() - VISIBLE`, Linux: csak `SIZE`) — a kilépéskor lekicsinyített / másik Space-en lévő ablak `visible=false`-ként mentődött, és többé nem jelent meg (macOS, Linux/Wayland). A főablakot a frontend mutatja meg (`applySavedTheme`, két `requestAnimationFrame` után `getCurrentWindow().show()`), tartalékként a `setup` 3 mp múlva `show()` + `set_focus()`-t hív, ha a `main` ablak még nem látható. `src-tauri/capabilities/default.json`: `core:window:allow-show`, `core:window:allow-set-focus`. **UltimateBasic 1.6.3** (`Cargo.lock` → `1dae579`) **a UB szerkesztőben** — QBasic-stílusú szintaxis (`dim … as …` skalárok és bármilyen típusú tömbök, `function` / `sub` `as` típusokkal, `elseif`, `do … loop [while|until]`, `while … wend`, `select case`, `exit do|for|while|sub|function`, egysoros `if`, `'` megjegyzés, `print a; b`, futásidejű stringek `left$` / `right$` / `mid$`, előjeles `integer`): `_UB_KEYWORDS` + `dim`, `function`, `do`, `wend`, `elseif` (a nem létező `restore` kikerült); `_UB_FUNCTIONS` + `left$`, `right$`, `mid$`; kontextusfüggő szavak, amelyeket a fordító sima névként olvas, ezért a `_ubHighlightSource` csak a helyükön színezi: `as` + `_UB_BASIC_TYPES` (`byte`, `integer`, `single`, `double`), `_UB_CONTEXT_KEYWORDS` (`case is`, `map view`, `wait key`, `scroll row|x|y`), `_UB_SCROLL_WORDS` (`left`, `right`, `narrow`, `wide` egy `scroll` utasításban); a `'` a `#`-hoz hasonlóan megjegyzést kezd (kiemelő, `_ubFormatText`, minimap; asm blokkban nem); `_ubAcUpdate`: BASIC típusok, a leírás-térképben a pontos nevű bejegyzés nyer (az `exit sub` nem írja felül az `exit`-et); `_ubFormatText` blokk-veremmel dolgozik: a `function` / `do` nyit, a `wend` és (közvetlenül DO-ban) a `loop` / `loop while|until` zár, az `elseif` az `else`-hez hasonlóan vált ágat, az egysoros `do … : loop` / `while … : wend` / `for … : next` nem húz be; minimap deklaráció-szín `dim` / `function`; `_ubRenderProjectSymbols` a `function`-t is függvényként listázza; `_UB_COMMAND_REFERENCE`: új `dim`, `function`, `elseif`, `wend`, `do`, `select case`, `end`, `exit sub`, `left$`, `right$`, `mid$`, bővített `print`, `sub`, `call`, `if`, `while`, `loop`, `for`, `break`, `input`, `comments`, `arrays`, `types`, `operators`, `string functions`, `string conversion`; 7 nyelvű leírás (`ubCommandDescriptions*`); `tests/ultimate-basic-highlight.test.js`.
Korábbi 2.5.3 változások: **Windows VICE-indítás javítás** — `windows_spawn_detached` (`lib.rs`): PowerShell teljes úton (`windows_powershell_path`; a régi `Command::new("powershell")` PATH nélkül „program not found”-ot adott), hibánál közvetlen spawn (`DETACHED_PROCESS`), `canonicalize` a linkelt exe-re (winget), munkakönyvtár + PATH = az exe mappája, `windows_ps_arg` idézőjelezi a szóközös útvonalat (`Start-Process -ArgumentList` nem teszi); VICE, RetroDebugger, D64 futtatás; a frissítő is teljes úton hívja a PowerShellt. A VICE útvonal a `bin\x64sc.exe` legyen (a DLL-ek mellett).
Korábbi 2.5.2 változások: **SID előnézetek a valódi SID-en** — WebSid regiszter-stream (`_sidStreamPrg`: kis PSID $1000-n, 64 frame-es ring $2000-n, rd/wr `$1F00/$1F01`, újraindított hangoknál előbb gate-off; `_sidStreamEnsure`, `_sidStreamPump`, `_sidStreamNote` (hang-kiosztás a 3 voice-ra), `_sidStreamSilence`, `_sidStreamPreload` megnyitáskor és Stop után; `_webSidLoadPsid` + `_webSidLoadSeq`): a hangszer-előnézet, virtuális billentyűzet, hangbeírás, akkord/arpeggio, sor- és egy patternes lejátszás is a WebSid-en szól, a `_sidSynthRender` csak tartalék (és „Play: All” alatt) (`tests/sid-stream.test.js`). Wave/arpeggio előbeállítás-lista megtartja a választást (`inst._tablePreset`, `_sidTableEdited`). Virtuális billentyűzet címe **VA-VK**, Play/Stop gomb (`#sid-vkbd-play/stop`), állapot `c64va-sid-vkbd` (hely, open, oktáv, insert; a `_sidInit` olvassa — TDZ), pozicionálás `_sidPlaceFixed`. Master hangerő mentve (`c64va-sid-master-vol`). Note-off: hang nélküli `C` effekt `===`-ként (`_sidIsNoteOff`, `_sidGridCellText`; billentyű 1 / ` / =, cellába `===`/`OFF`). Leválasztható tracker: `#sid-tracker-section` a `#sid-tracker-dock` és a lebegő `#sid-tracker-float` között (`_sidSetTrackerDetached`, `_sidPlaceTrackerFloat` — a dialógus transform miatt containing block; `c64va-sid-tracker-float`). Knowledge Base: C64 OS devenvironment + png2c64 link, kétoszlopos lista.
Korábbi 2.5.1 változások: **SID Editor hangszerek + új lejátszó** — hangszer-modell (`_sidNewInst`/`_sidInstNorm`): `ring`/`sync`, szűrő `filt`/`off3`/`cutEnd`/`cutSpeed`/`cutPing`, vibrato `vibDelay/Speed/Depth`, PWM `pwmSpeed/Min/Max`, `gateTimer`/`hr`/`firstWave`, wave/arpeggio tábla (`table`, `tableLoop`, `tableSpeed`, előbeállítások `_SID_TABLE_PRESETS`); `_sidTuneData` paraméter-tömbök; frame-alapú 6502 lejátszó (`_sidExportAsmPlayable`: `sid_frame`, `sid_hr_check`, `sid_update`, állapot `sid_state`, ZP `$02-$1C`/`$2F`/`$FB-$FD`); JS motor (`_sidEngineNew`/`_sidEngFrame`) + SID-szintetizátor (`_sidSynthRender`) az előnézethez (`_sidPlayNote`, `_sidWaStart`); `.bin` `0xFD` formátum (nevek, sebesség); `tests/sid-player.test.js` + `tests/mini6502.js` (lejátszó = motor frame-ről frame-re). **Virtuális billentyűzet** 2/3/4 oktáv (`c64va-sid-vkbd-octaves`), C64 szinti kinézet. **UltimateBasic 1.6.2**: `tune` `imod`/`ifilt`/`igate`/`itab` (UB `compiler/tune.rs`, ugyanaz az algoritmus; fixture: `node scripts/sid-ub-fixture.js <UB>/tests/fixtures`), VA UB-export és parancsreferencia. **Könyvjelzők + Ugrás sorra** (`_bm*`, `_gotoLine*`, `#goto-line-dialog`, Ctrl+F2/F2/Shift+F2/Ctrl+G, `c64va-bookmarks`). **Eval-mentes kifejezések** (`_evalJsExprSafe`, a release CSP tiltja az `eval`-t; `tests/safe-expr.test.js`). **D64 Editor** dialógusok az aktív munkamappában (`choose_d64_open/new` `directory`), **Build projekt** jelentés kimeneti mappával.
Korábbi 2.5.0 változások: **Pálya szerkesztő (Level Editor)** — toolbar gomb a Map Editor mellett, `#level-editor-dialog` (`setupLevelEditor`, `_lv*` állapot, `_lvComposeMap`): Map Editor képernyők függőleges / vízszintes / rács elrendezésben, sima görgetésű előnézet, mentés `.bin`-be VA meta trailerrel (`VA-BIN1!`, kind `lv-level`), teljes Screen / Screen+Color RAM, blokk/asm export (`tests/level-editor.test.js`). **LEVEL / LEVEL_ROW makró** — `.level "f.bin"[, $2000]` INCBIN-variáns (`incBinLevel`, `_levelInfo`/`_levelBuild`, `_incBinPayload`): csak az elhelyezett képernyők + pointer-táblák, `LEVEL_*` címkék/konstansok (`addLayoutLabels`), max 7×10; `.level_row dst, col[, color]` (`isLevelRowMacro`, `_levelRowBytes`, 132 byte, önmódosító) (`tests/level-macro.test.js`). **JOYSTICK változós mód** — `.joystick port, vx, vy[, fire]` (`_joyVarBytes`, −1/0/+1), port 3 = mindkét port (`tests/joystick-macro.test.js`). Minta: `samples/level-demo.asm` (2×5 pálya, dupla puffer, XSCROLL/YSCROLL, tépésmentes). **Számrendszer-átváltó** — `#numconv-btn` → nem modális `#numconv-dialog` (`setupNumberConverter`, `_ncParse`/`_ncFormat`, `dialog.show()`), pozíció a közös `_editorDialogPositions`-ben, érték/szélesség/nyitott állapot `localStorage` `c64va-numconv` (az állapotot `setTimeout`-ban tölti, TDZ miatt) (`tests/number-converter.test.js`). **Példák dialógus** — a `#load-sample` gomb („Példák…”) a modális `#sample-dialog`-ot nyitja (`_openSampleDialog`, `_SAMPLE_CATEGORIES`, keresés, ↑/↓, Enter/dupla klikk); a rejtett `#sample-select` marad az adatforrás. **UltimateBasic 1.6.1** (`Cargo.lock` → `5d97218`): `map load "level.bin"[, cím]`, `map view px, py`, 16 bites szorzat-összeg javítás; UB parancsreferencia `map view` bejegyzés, `map` leírás `.ubmap` nélkül, rangsorolt keresés (`_ubRenderCommandReference`).
Korábbi 2.4.9 változások: **Projekt sablonok** — `templates/*.asm` + `templates/*.ub` (Tauri resource, `list_templates` mindkét kiterjesztést listázza), Menu → File → Új projekt sablonból… és új `#new-project-btn` toolbar gomb (Menu és Tutorial között) → `_openTemplateDialog`; `#template-kinds` Assembler / UltimateBasic kapcsoló (`_templateKind`, UB módban UB-n nyílik); fejléc `; @name …` / `# @name …` (`_parseTemplateSource` → `kind`), `{{PROJECT}}` csere; `_templateCreateProject`: Assembler → `main.asm` + `.proj`, Expert mód; UB → `main.ub` + `.proj` `"app": "ultimate-basic"`, UB projektként (`_ubProjectData`, startup tab, projekt panel); 4 UB sablon (üres, játék, hires bitmap, raszter IRQ), `tests/project-template.test.js`. **Build projekt** — Menu → Build → `#build-project` (`buildProjectToFiles`): a projekt / nyitott fülek minden fordítható fájlja a forrás mellé `.prg`-be, debugger sidecarokkal, include-olt modulok kihagyva, jelentés a Build Info dialógusban. **Ctrl+görgő zoom** — `_bindCtrlWheelZoom` az Expert és UB szerkesztőn. **Munkaterület** — a `.vaws` az Expert/UB projekt-állapotot is menti (`tests/workspace-project.test.js`). **UltimateBasic** `Cargo.lock` → `f0ac8d6` (optimalizált kódgenerálás), UB memóriatérkép adatrégiókkal (`tests/ub-memory-usage.test.js`); fájl-dialógusok az aktív munkamappában.
Korábbi 2.4.8 változások: **UltimateBasic 1.5.9** (`Cargo.lock` → `fc0daa7`): új `chain` parancs (`_UB_KEYWORDS`, `_UB_COMMAND_REFERENCE` + 7 nyelvű leírás), `load` másodlagos cím javítás, D64 javítások; a referencia `sprite collision` bejegyzésében a `sprhit()`/`sprbghit()` rövid alak. **KOALA makró** — `.koala "f.koa"[, $2000]`: INCBIN-variáns (`isIncBinMacro` + `incBinKoala: true`, mnemonic `KOALA`, `_importMakeKoala`), így a fájlkezelés/újratöltés/projektmentés/deferred elhelyezés az INCBIN-é; saját: `_koalaData` (10003 → fejléc levágva), `_koalaError` (csak `$2000`/`$6000`, 10001/10003 bájt), `_koalaShowBytes` (86 bájtos rutin: screen/color RAM másolás 4×250, `$D021`, `$DD00` bank AND/ORA, `$D011=$3B`, `$D016=$18`, `$D018=$18`), `getInstructionSize` = `_KOALA_SHOW_SIZE`; ASM nézet/disasm/univerzális export/deferred szekciók KOALA-ágai, mnemonic-leírás panel (`macroAddrKoala*`, `paletteKoala`), `tests/koala-macro.test.js` (mini 6502 szimulátor). **Hires editor Koala** — `_hgExportKoala` / `_hgImportKoala`, Files menü `#hg-import-koala` / `#hg-export-koala`, `tests/hires-koala.test.js`. **Frissítés** — `#expert-update-status` (minden `[data-update-status]` elemet `_updateRenderStatusbar` frissít), `save_bin` a javasolt fájlnév kiterjesztését teszi első szűrőnek, `va-product-site/downloads/VA/index.php` + `.htaccess` listázza a telepítőket (a frissítő ezt olvassa, a `download.php`-s főoldalon nincs fájlnév), Linux helper `env_remove(LD_LIBRARY_PATH/LD_PRELOAD)`.
Korábbi 2.4.7 változások: **Önfrissítés** — `check_for_update` / `download_and_install_update` Tauri commandok (`lib.rs`, „Self-update” szekció): a legfrissebb verziót a termékoldal (`https://www.c64va.pro/`, fallback `downloads/VA/`) letöltési linkjeiből olvassa ki (`update_asset_pattern`: Win x64/arm64 `-setup.exe`, macOS x64/aarch64 `.dmg`, Linux AppImage/`.deb`/`.rpm`), a JS csak a verziót adja át, az URL-t a Rust építi. Telepítés: Windows `Start-Process` NSIS `/P /R`, macOS DMG → `.app` csere helper scripttel, Linux AppImage csere vagy `pkexec apt-get/dnf`; utána `app.exit(0)`. Frontend: `checkForAppUpdate({silent})` (Menu → Check for Update + induláskor 6 mp-cel, csendben), `#update-dialog` progress sávval (`update-download-progress` event), „Skip this version” (`localStorage` `c64va-update-skip-version`), `#ub-update-status` jelző az UB statusbarban (`_updateRenderStatusbar`). **Curve Editor → UB export** — `_cgExportUb` (`var név = array(N)`/`array_word(N)` + `data név: …`) és `_cgExportDemoUb` (sprdef labda + raszter-szinkron hurok, 8 bit → sprite Y, 16 bit → sprite X, Bresenham söprés), közös `_ubInsertOrCopy` (SID UB export is ezt használja). Ehhez **UltimateBasic 1.5.8** kell: új `data <tömb>: …` tömb-inicializálás (`Stmt::ArrayData`, `collect_array_inits`, `emit_array_init_copies`). **Layout** — `_fitWorkspaceHeight` a valós szabad magasságból számolja az `--editor-max-depth`-et (nincs app-shell scroll), output panel min. 440 px (`_WS_OUTPUT_MIN` + grid `minmax(440px, …)`), working folder halvány jelvény az ASM nézet fejlécében és az Expert/UB toolbarban; `.app-confirm-buttons` gombfelirat nem törik.
Korábbi 2.4.6 változások: **SID Editor → UltimateBasic export** — új `#sid-export-ub` Files menüpont (`_sidExportToUb`, `_sidExportUbBlock`): `tune ... end` blokkot (hangszerek `inst`, `order`, `pat` sorok `_sidCellText` cellákkal, max 8 pattern) + `music play`-t generál; UB módban a kurzorhoz szúrja be, egyébként vágólapra másol (`sidExportUb*` i18n kulcsok, `tests/sid-ub-export.test.js`). A lejátszót az UltimateBasic fordító építi (`src/compiler/tune.rs`, zero-page-mentes; `sid_init`/`sid_play` konstansok, a `music play/stop` változatlanul működik) — ehhez `tune`-t ismerő UltimateBasic kell (a `Cargo.lock` rev-jét frissíteni). Az UB inline assembler `label,X/Y` hibája is javítva ott. **UB nyelvi frissítés** — `sfx`, `org`, `tune` kulcsszó (`_UB_KEYWORDS`, a `tune` blokkon belüli `inst`/`order`/`pat`/`speed` külön kiemelve), `charset on/off` és `incbin` szeletelés a parancsreferenciában (`sfx`/`org` leírás mind a 7 nyelven, a `charset`/`incbin` bővítés HU/EN). **ASM nézet többes kijelölés** — `applyAsmHighlight(blockIds, scrollToId)` id-listát fogad, a sorszám és az elválasztó külön span (`asm-tok-lineno-sep`). **Assembler mód megőrzése UB váltásnál** — `lastAssemblerEditorMode` (localStorage), projekt/minta betöltése előtt kilépés az UB-ből. **KFF2** — `#kff2-detect-btn` (`detectKff2Port`), firmware v2.07+ a kézikönyvben.
Korábbi 2.4.5 változások: **Kung Fu Flash 2 futtatás** — új `kff2` run mód (`runOnKff2`, `getRunModeLabel`, `setRunMode`, `validRunModes` és a `run-kff2-mode` menüpont az `index.html`-ben): a PRG USB soros kapcsolaton közvetlenül valódi C64/C128-ra töltődik egy Kung Fu Flash 2 cartridge-en át, Block, Expert és UB módban egyaránt (`_ubRun` `usesKff2` ága). Hardware Settings-ben új `#kff2-port` mező (`setupKff2Settings`, `localStorage.kff2Port`), induláskor USB VID/PID (`0483:5740`) alapú automatikus portfelismerés (`detect_kff2_port`). Rust oldalon új `serialport` függőség és `run_on_kff2` command (`run_on_kff2_port`): PRG validálás (`kff2_validate_prg`), 1200 baudos „MENU touch”, újracsatlakozás, `EFSTART:PRG\0` handshake (`LOAD\0`/`WAIT\0`), méret-egyeztetés, PRG küldés és lezárás-ellenőrzés. i18n: `runOnKff2`, `kff2*`, `workProgressRunKff2`/`workProgressSuccessKff2` mind a 7 nyelven. **Átméretezhető Program/ASM panelek** — `.ws-resizer` elválasztó a `.program-panel` és `.output-panel` között (`_applyWorkspaceColumns`, `_initWorkspaceResizers`, `wsProgramShare` a `saveUiSettings`-ben; min. 260 px, nyilak ±16 px, dupla kattintás → 50/50; Expert/UB módban és 1100 px alatt rejtve). **ASM nézet** — a makrósorok `; ` nélkül jelennek meg (`renderAsmOutput` utólagos `.map`, `highlightAsmLine` új `.xxx` ága; a `COMMENT` blokkok érintetlenek). **Expert kiemelés** — `hl-macro` (név a `.macro`/`.invoke`/`.call` után és `:név`), `hl-macro-param` (`{param}` és `.macro` fejléc paraméterei) `_expertHighlightLine`-ban, témánkénti `--hl-macro`/`--hl-macro-param` változókkal. **About dialógus** kétoszlopos, átlátszó hátterű Ultimate Basic banner; **Web64** szekció a termékoldalon; `macro-with-parameter` minta `.macro setColor(color)` alakra frissítve.
Korábbi 2.4.3 változások: **SID Editor effekt-oszlop** — minden tracker cella hordozhat egy effektet a note mellett: vibrato (**V**), slide fel/le (**U**/**D**), note-cut (**C**), sebesség-váltás (**F**) (`_SID_FX_CODES`/`_SID_FX_NAMES`, `_sidApplyRowEffect`, `_sidVoiceState`), amik helyesen játszódnak vissza mind a Web Audio előnézetben, mind a fordított 6502 exportban (`_sidExportAsmPlayable` bővített zero-page táblával, `$02`–`$2F` + `$FB`–`$FE`). **SID Editor song/order list** — minták egy song/order list-en keresztül vannak elrendezve a nyers pattern bank felett, ismételhetők, a dal hosszabb lehet a tárolt minták számánál; a mentett formátum verziójelzőt hordoz, régi (effekt nélküli) `.bin` mentések továbbra is betölthetők. Új `tests/sid-effects.test.js` és `tests/sid-song.test.js`. **D64 Editor explicit Save workflow** — a szerkesztések (add/extract/rename/delete, Block Editor byte-szerkesztés) mostantól egy munkapéldányon landolnak (`_d64EdState.path` vs. `_d64EdState.origPath`, `_d64EdState.dirty`), és csak expliciten Save-elve (`_d64EdSave`/`_d64EdSaveAs`) íródnak vissza a valódi fájlba, automatikus biztonsági mentéssel (`_d64EdBackupDisk`) és mentetlen változás esetén megerősítési kéréssel (`_showConfirm(t("d64EditorUnsavedConfirm"))`); `_d64EdCleanupTemp` takarítja a munkapéldányt. **Block Editor hex grid** — a Block Editor mostantól új byte-onkénti hex griddel jeleníti meg a kiválasztott 256 byte-os blokkot, és a dialógusa már nem homályosítja el az app többi részét (`.dbe-dialog::backdrop`).
Korábbi 2.4.2 változások: **D64 Editor drag & drop** — bináris fájl (`.prg`/`.bin`, pl. a SID/sprite/char szerkesztők exportja) közvetlenül a lemezképre húzható (`_d64EdHandleDroppedFiles`, `de-body` `dragenter`/`dragover`/`drop`), ez megnyitja a Hozzáadás panelt előre kitöltve (`_d64EdPreparePanelForFile`, közös a natív fájlválasztóval); több fájl egyszerre húzva sorban egymás után jön fel (`dropQueue`, `_d64EdAdvanceDropQueue`). **Include fájl generálása** — új `#de-gen-include` toolbar gomb (`_d64EdGenerateInclude`), ami `.const NÉV = $CÍM` sort ír egy `.inc` fájlba minden lemezen lévő bejegyzéshez: a betöltési címet a session alatt megadott (vagy Exomizer crunch előtt rögzített — `declaredAddress` `_d64EdConfirmAdd`-ben) értékből, PRG-knél szükség esetén a fájl header első két byte-jából. **Blokk szerkesztő** — új `#de-blocks-toggle` toolbar-kapcsoló (`_d64EdToggleBlockMode`), ami a D64 Editort nyers track/sector szintre kapcsolja a directory absztrakció alá: kattintható blokktérkép (`_d64EdRenderBlockGrid`, a BAM szabad/foglalt bitmapje szerint színezve — `_d64ParseBam` —, a BAM és a directory lánc `_d64WalkDirectoryChain`-nel külön jelölve), hex nézet/szerkesztő a kiválasztott 256 byte-os blokkhoz (`_d64FormatHexBlock`/`_d64ParseHexBlock`, `_d64EdWriteBlock`), előző/következő szektor navigáció (`_d64EdStepBlock`). Új `write_bin_file` Tauri command a `lib.rs`-ben (a meglévő `read_bin_file` párja, ugyanaz a minta mint `save_text_file`) — a track/sector cím-aritmetika (`_d64BlockOffset`, `D64_TRACK_SECTORS`) és a BAM parse teljesen a JS oldalon van, `c1541`-t nem használ. Új `tests/d64-block-editor.test.js` a geometria/BAM/hex round-trip lefedésére.
Korábbi 2.4.1 változások: **Lengyel és olasz UI nyelv** — teljes felület-fordítás (`i18n.js`: `translations.pl`/`translations.it`, mind az 1186 kulccsal, nested `memorySegments`/`categoryNames` is; `mnemonicDescriptionsPl/It`, `ubCommandDescriptionsPl/It`) a meglévő HU/EN/ES/DE/NL mellé, a nyelvi whitelist tömbök és fallback-láncok bővítésével, plusz a nyelvválasztó két új opciója az `index.html`-ben. **Online Help toolbar gomb** — új `#online-help-btn` ikon a Debug után szeparátorral, a `https://www.c64va.pro/docs.html?doc`-ot nyitja `openExternal`-lel, `onlineHelp` fordítási kulccsal mind a 7 nyelven. **Mnemonik leírások kiszervezése az i18n.js-be** — a `mnemonicDescriptionsEn/Es/De/Nl/Pl/It` konstansok kikerültek az `app.js`-ből `translations.<nyelv>.mnemonicDescriptions` alá (a magyar változatlanul a `mnemonicLibrary`-ből jön), a `getItemDescription`/`renderBlock` fallback-lánc leegyszerűsödött; mellékesen javítva egy régi hiba, ahol az `en` blokk végén egy véletlen spanyol duplikáció felülírta a `PRINT`/`PRINT_HEX`/`CLEAR_SCREEN`/`WAIT_KEY`/`SET_BORDER`/`SET_BG`/`IRQ_SETUP`/`RAND` angol leírásait.
Korábbi 2.4.0 változások: **D64 Editor** — új toolbar-ikon (a Curve Editor mögött, szeparátorokkal) egy önálló D64 lemezkép-szerkesztő dialógushoz, a Sprite Editor stílusát követve (`#d64-editor-dialog`, Files ▾ menü: New/Open/Save As/Run in VICE). Meglévő `.d64` directory listázása, program hozzáadása/kimentése/átnevezése/törlése közvetlenül a lemezképen `c1541`-en keresztül (`d64_list`/`d64_add_file`/`d64_extract_file`/`d64_rename_file`/`d64_delete_file` Tauri commandok, `lib.rs`), nincs külön mentés lépés. Hozzáadásnál opcionális betöltési cím, kicsomagolási cím és Exomizer tömörítés (a Build D64 extra fájlok `mem`/`sfx` logikáját újrahasznosítva `_d64EdConfirmAdd`-ben), plusz PRG/SEQ/USR/REL típusválasztó (`c1541 -write name,type`) — `.prg`-nél ezek a mezők automatikusan rejtve maradnak. A directory lista a C64Pro fonttal, nagybetűsen jelenik meg (`.de-table`). Javítva: a rename inline input-jára kattintás a sor `click` handlere miatt azonnal törölte a szerkesztést — a handler most kihagyja az input-ra eső kattintásokat. Javítva: világos témában a `.editor-mode-indicator` badge sötétebb/olvashatóbb, a `.mode-indicator-shimmer` animáció ismét látszik.
Korábbi 2.3.9 változások: **`*` (program counter) minden operandus-kifejezésben** — `BNE *-5`, `JMP *+20`, `LDA #<*`, `LDA #>(*+63)`; érték után álló `*` továbbra is szorzás (`_substituteStarPc` / `_hasStarPcRef` / `_evalAsmExpr` az `app.js`-ben). **Lokális (pontos) labelek** — `.loop` a legközelebbi fölötte lévő globális label scope-jába tartozik (`getProgramLayout` klón-pass → kanonikus `Global.loop`), a `parseAsmText` már nem vágja le a pontot. **Long branch pseudo-opok** — `LBNE`/`LBEQ`/`LBCC`/`LBCS`/`LBMI`/`LBPL`/`LBVC`/`LBVS` (`HosszuUgrasok` kategória, `isLongBranchMacro`) → invertált `Bxx *+3` / `JMP` = fix 5 byte. **`.assert <expr>[, "üzenet"]`** — fordítási idejű ellenőrzés (`isAssertMacro`), hamis → beszédes assembly hiba az értékkel. **SMC operandus-label** — `LDA value:#$00` → `value` az operandus byte-jára mutat (`smcLabel`, `addLayoutLabels` → `addr+1`). **Barátságos branch-hiba** — tartományon kívüli branch a pontos túllépést és a megfelelő `LBxx`-et javasolja (`_branchOffsetFromTarget`, `branchOutOfRangeSuggest`).
Korábbi 2.3.8 változások: Munkaterület mentés/megnyitás (`.vaws`) — a nyitott, fájlhoz kötött fülek pontos halmaza, aktív fül és fül-módok mentése/visszatöltése, auto-save-lel és induláskori auto-restore-ral; globális memória panel toggle; UB parancsreferencia lokalizálva (HU/EN/ES/DE/NL, angol fallback); frissített UB grafikus parancs dokumentáció; javított KERNAL SETLFS/PLOT referencia; magas memóriahasználat javítva sok nyitott fülnél (per-tab undo/redo history korlátozva debounce-szal); felesleges Expert/UB breakpoint toolbar gombok eltávolítva; Expert toolbar magasság a UB-hez igazítva.
Korábbi 2.3.7 változások: Undo/Redo és többblokkos szerkesztés; Block/Expert/UB breakpointok külső RetroDebugger integrációval, source map/label sidecarokkal, SYS-aware indítással; opcionális BASIC stub a Disassembler/Monitor nézetekben; új UB Monitor panel; debugger/disassembler origin javítások; UB caret/üres sor/nyomva tartott kurzor/minimap és Expert sorszám-illesztési javítások.
Korábbi 2.3.6 változások: **Build CRT** (Magic Desk 64K, type 19) export block, Expert és UB módban; bank-0 loader RAM-ba másolja a payloadot; max 65 408 byte 8×8 KB bankon; Exomizer kihagyva CRT-nél. D64 export dialóg input mezők magasság fix. Kézikönyv új 12b. szekció kiemelt KERNAL `RESTOR` caveat-tel.
Korábbi 2.3.5 változások: CHARDEF és BOX_HIT makrók szintaxiskiemelése az Expert szerkesztőben; az Ultimate Basic szerkesztő Expert-egységes viselkedése (Format utáni kurzorfix, egységes Tab és select/focus kurzorkövetés); UB betűméret megőrzése munkamenetek között; a welcome dialogba bekerült egy Ultimate Basic manual gomb, ami ugyanazt a kézikönyvet nyitja, mint a szerkesztő manual gombja (`openUltimateBasicManual`).
Korábbi 2.3.4 változások: CHARDEF és BOX_HIT makrók; indítási welcome dialóg verziószámmal; videós splash intro; frissített light téma (színes, kiemelt blokkok); javított UltimateBasic editor UX (autocomplete, minimap, project dialógok).

Verziónöveléshez lásd a 3. szakasz végén lévő 7-lépéses checklistet.
