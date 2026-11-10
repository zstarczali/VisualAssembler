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
| `F:\Development\VMA` (külön repó) | A VMA fordító Rustban (lib + `vma` CLI), git-függőség — lásd 10. szakasz |
| `www/vice/` | Beépített C64: VICE x64sc WebAssembly, `vice.js` / `.wasm` / `.data` (`scripts/update-vice.mjs`; a loader `x64sc.*` kéréseit a `_w64Load` `locateFile`-ja képezi `vice.*`-ra) |
| `VMA-RUST-PLAN.md` | A Rust VMA port terve, állapota, a JS-furcsaságok listája |

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
| **I/O** | `LOADFILE`, `INCBIN`, `KOALA`, `SID`, `INCLUDE` | Fájl byte-okat fűz a kódba; SID makró `.sid` parse + INCBIN, címkék `SID_LOAD` / `SID_INIT` / `SID_PLAY` (egyedi címnél eltolva, `addLayoutLabels`); `.sid_player [song][, raster]` (`SID_PLAYER`, `isSidPlayerMacro`, `_sidPlayerBytes`, 58 byte): JSR SID_INIT, CIA1 IRQ ki, raszter IRQ, beépített handler JSR SID_PLAY + JMP $EA31 (`tests/sid-player-macro.test.js`); KOALA = INCBIN-variáns (`incBinKoala`) + 86 bájtos megjelenítő rutin |
| **Pálya** | `LEVEL`, `LEVEL_ROW` | `.level "f.bin"[, $2000]` = INCBIN-variáns (`incBinLevel`, `_levelInfo`/`_levelBuild`, `_incBinPayload`): Level Editor projektből csak az elhelyezett képernyők + pointer-táblák, `LEVEL_*` címkék/konstansok (`addLayoutLabels`); max 7×10 képernyő. Objektumréteg (Level Editor `_lvObjects`, `_LV_OBJ_TYPES`, meta `objects: [{t,x,y,p}]` görgetési sorrendben) → `LEVEL_OBJ_X_LO/HI`, `Y_LO/HI`, `TYPE`, `PARAM`, `LEVEL_OBJ_COUNT`, `LEVEL_OBJ_T_*` (`_LEVEL_OBJ_TYPES`, a sorrend egyezzen), `LEVEL_START_X/Y`. Karakter-attribútumok (`_lvAttr`, extras `attr`) → `LEVEL_ATTR` + `LEVEL_ATTR_*` (`_LEVEL_ATTR_BITS` = `_LV_ATTRS`); képernyőnkénti színek (`scr.colors`, meta `screenColors`, `borderColor`) → `LEVEL_SCR_BG/BORDER/MC1/MC2`, `LEVEL_BORDER`, `LEVEL_SCR_COLORS`. Level Editor még: él-ellenőrzés (`_lvEdgeIssues`), memóriamérleg + RLE (`_lvMemInfo`, `_lvRle`, `level_unrle`), Futtatás VICE-ban (`_lvRunInVice`, `_lvTestProgramAsm`). A `setupLevelEditor` a `let/const _lv*` deklarációk ELŐTT fut (TDZ): ott konstanst ne használj. `.level_row dst, col[, color]` (`isLevelRowMacro`, `_levelRowBytes`, 132 byte): X-beli pályasor → (dst), önmódosító. Minta: `samples/level-demo.asm`, teszt: `tests/level-macro.test.js`. UB-hez (UltimateBasic 1.6.1+): `map load "level.bin", $4000` közvetlenül olvassa a Level Editor projektet, `map view px, py` sima, tépésmentes görgetés (a UB fordító `compiler/map_view.rs`), minta: `F:\Development\UltimateBasic\examples\level_scroll_demo.ub`; a VA UB parancs-menüben `map view` bejegyzés |
| **Sprite/grafika** | `SPRITE_INIT`, `SPRITE_POS`, `WAIT_RASTER`, `SPRITE_COL` | Sprite cím **64-byte alignmenten** + sprite data **pontosan 64 byte** |
| **Bemenet** | `JOYSTICK`, `MOUSE` | CIA1 port olvasás + sprite mozgatás; `.joystick port, vx, vy[, fire]` változós mód (−1/0/+1, `joyVarX/Y/Fire`, `_joyVarBytes`), port 3 = mindkét port (`tests/joystick-macro.test.js`) |
| **Ultimate 64** | `U64_PALETTE`, `U64_PALETTE_COLOR`, `U64_PALETTE_RESET` | Ultimate Command Interface (`$DF1C-$DF1F`, firmware 3.15+): paletta fájlból (INCBIN-variáns `incBinU64Pal`), egy szín, reset; `_u64UciBytes`, nincs interfész → átugorja magát; Rust `src/u64pal.rs` |
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
4. A méret és a bájtok a **Rust VMA**-ban (`F:\Development\VMA`, `src/asm.rs` / `src/prg.rs`): az app nem fordít
5. Golden eset (`tests/vma-golden/cases.js`) + `node scripts/vma-golden.js --update`, majd a VMA `rev` cseréje
6. `renderBlock` (vagy a `renderProgram` template) — UI mezők
7. Translation kulcsok (`translations.hu` + `translations.en`)
8. Saját `is*Macro: true` flag a blokkon

---

## 7. SID szerkesztő — friss állapot

A SID szerkesztő egy 3 vagy 6 hangos (két SID) tracker Web Audio előnézettel. A 2026-06-16 frissítések után
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
  Minden előnézet és a „Play: All” is a backenden szól (`render_sid_preview`, `_sidRenderNative`, `_sidWaSchedule`, motor: `SidChip`, reSID vagy VA SID Core): a JS motor regisztereit rendereli,
  a sorkiemelés a motor eseményeiből jön. Az asztali appon kívül a `_sidSynthRender` kis szintetizátor a tartalék (`_sidRenderEngine`).
- **6502 lejátszó** (`_sidExportAsmPlayable`, `* = $C000`; ha kód (`_SID_PLAYER_CODE_MAX`) + adat + állapot elérné a `$D000`-t, az adat külön szegmensbe kerül, amely `$A000` alatt végződik, `_sidExportAsmPlayable.dataOrg`; a PSID export onnan vág): `sid_init`, `sid_irq` → `sid_frame` (sor-lépés `$2F` frame-enként,
  `sid_hr_check`, `sid_update`: tábla, hangmagasság, vibrato, PWM, szűrő-söprés), `sid_set_voice` (note on), effekt-rutinok
  `sid_vib_vN/sid_slideup_vN/sid_slidedown_vN`; állapot a `sid_state` területen. ZP: `$02-$1C`, `$2F`, `$FB-$FD`; két SID-nél `$50-$69` is (`_ZP_SID_PLAYER_2SID`).
- **Teszt:** `tests/sid-player.test.js` a `tests/mini6502.js` assemblerrel + CPU-val frame-ről frame-re veti össze a lejátszó
- **Két SID:** a patternek oszlopszáma adja a hangok számát (`_sidVoiceCount`, 3 vagy 6), a chip címe `_sidSid2Addr` (`$D420-$D7E0`, `$DE00-$DFE0`). Motor: `e.regs` 25 bájt chipenként, `e.base`, `e.fs[chip]`, `e.vols[chip]`. Lejátszó: a hangregiszterek `sid_vptr` mutatón át (`$68/$69`), a szűrőállapot `2` utótaggal. `.bin` `0xFC` (a sebesség után a PSID-cím bájt), stream második ring `$3000`-n, `_sidDumpImport` 52 bájtos frame-mel, `render_sid_preview` 51 bájtos frame-mel. Export legfeljebb 46 pattern.
- **Csatorna-spektrum** (`#sid-ana`, `_sidAna*`): az `e.snap` frame-ekből számol, a sor-események adják az időzítést; nem a hangból.
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
- **Hangerő chipenként** ($D418): a dal hangereje (`#sid-song-vol` tekerő); hangszer-hangerő a felületen nincs, csak importált dal hangszere (`songVol: false`) írja felül
- **Per-channel volume a SID-en nem létezik** — ADSR `S` (sustain) szint a legközelebbi
- Csak az asztali appon kívüli tartalék szintetizátor nem 1:1 a valódi SID-del (ring/sync, filter karakterisztika eltér)

### SID Player — HVSC

A SID Player `#websid-play-hvsc` gombja a `#websid-hvsc` panelt nyitja (High Voltage SID Collection): katalógus =
`DOCUMENTS/Songlengths.md5` (útvonal + subtune-hosszak, `_hvscParseCatalog`, keresés `_hvscSearch`, min. 2 karakter; `#websid-hvsc-field` = `all` | `composer`, `_hvscComposerMatches`: a név a `MUSICIANS` alatti mappa, a `GAMES` / `DEMOS` daloknak nincs szerzőjük),
dal-letöltés egyenként (`hvsc_fetch`, cache: app cache dir `hvsc/`), helyi kibontott mappa (`hvscPath` a configban,
`hvsc_choose_folder`), teljes gyűjtemény egyben (`hvsc_download_all`: hivatalos .7z a `hvsc.brona.dk`-ról, `sevenz-rust2`,
`hvsc-download-progress` esemény, `hvsc_cancel_download`). Backend: `src-tauri/src/hvsc.rs`; tükrök `HVSC_MIRRORS`.
A playlist elem `lengths` / `hvsc` mezője adja a seek bar hosszát és az auto-advance-t (`_sidPlayerTuneMs`).
Teszt: `tests/hvsc-catalog.test.js`, Rust `real_hvsc_archive_unpacks` (#[ignore], `HVSC_ARCHIVE` env).
Playlist: letöltés alatti második kattintás nem ad hozzá újra (`_hvscAdding`, a Studióban `_modlandAdding` is; `var`, mert a render előbb futhat — TDZ); letöltés közben a találat `.websid-hvsc-item--loading` + `_sidSpinner()` a + gomb helyén (Studióban a cache-ből töltődő Modland playlist-elem is: `item.loading`, `.websid-play-item--loading`); `#websid-play-dedupe` → `_sidPlayerRemoveDuplicates` (azonos HVSC / Modland útvonal vagy bájtok, `_sidPlayerKeys`; az első példány marad a legtöbb csillaggal); `#websid-play-keep-starred` → `_sidPlayerKeepStarred` (`_showConfirm` után); csillagok 0–5 (`item.fav` szám, `_sidStars`, `_SID_STARS_MAX`; `.sidpl`: `fav: true` + `stars`, a régi `fav: true` = 1). Teszt: `tests/sid-file-playback.test.js`. Ugyanez a VA SID Studióban.

### Idegen .sid / .bin fájlok

**.sid import** (Files → `#sid-import-sid` → `#sid-import-sid-dialog`: subtune + hossz mp-ben): a Rust `sid_register_dump`
(`SidFilePlayer::dump_registers`, frame-enként 25 SID-regiszter + gate-él bájt) lefuttatja a dalt, a `_sidDumpImport` ebből
patterneket csinál: hangjegy = gate-él (≤2 frame-en belüli újragate összevonva) vagy legato (tartott gate alatt új félhang
≥ 5 frame-ig); sorok = a hangkezdetekre illesztett L / L+1 frame-es sorok (funktempo, swing), a sorhossz-váltás `F` effekt
egy sorral előbb (elsőbbsége van a `C` előtt); hangmagasság = a fő hullámforma leggyakoribb félhangja; hangszer = ADSR +
fő hullámforma + PW/PWM + szűrő + wave tábla a teljes hangból (a következő hangig, a néma hard-restart frame előtt vágva;
lépésenként abszolút vagy relatív hangmagasság az azonos formájú hangok szavazata alapján, teszt-bites / néma frame = `$08` lépés hangmagasság nélkül; legrövidebb előtag + ismétlődő periódus, max 32 lépés; félhangnál kisebb szabályos kitérés → hangszer-vibrato `vibDelay/Speed/Depth`); gate: későbbi sorban `C`,
a következő hang előtt < sorhossz frame-mel gate timer (+ hr, ha az ADSR nullázva), egyébként S = 0, D = R. Max 128 hangszer,
a 255 lépéses tábla-keretet használat szerint osztja (azonos táblát a `_sidTuneData` egyszer tárol). Szűrő: `moveEnd` / `sweepEnd` (a teljes hang, amíg egy másik hang újra nem indítja), fix sebesség-korlát 127 / frame (`reach`, közelebbi kezdet), LFO a szélsőértékek között; pulzus: `movement` (frame-enként), a hangszer a hangjainak teljes tartományát tartja; tábla: `tableSpeed` a futamhosszak lnko-jából, a periódust a következő hangot előkészítő utolsó frame-ek nem törik meg (`maxTrim`); hard restart csak ha az ADSR a gate-tel együtt nullázódik. Csak asztali appban (VA SID Core). Teszt: `tests/sid-dump-import.test.js`
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
A dialógus tetején `#template-kinds` kapcsoló (Visual Assembler / ACME / UltimateBasic, `_templateKind` = `asm` | `acme` | `ub`, induláskor az aktuális mód szerint);
a menüben a Versioning blokk alatt („New project” fejléc, `#new-project-section-label`) a `#menu-new-from-template`; az ACME fül (`#template-kind-acme`) csak beállított ACME mellett látszik (`_acmeAvailabilitySync`).
ACME sablon = `.asm` `; @assembler acme` fejléccel (`templates/acme-*.asm`); a projekt `.proj`-ja `_projAssemblerFields("acme")`-t kap és ACME módra vált;
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
| Forrás | `_vmaBuildInput` / `_vmaEditorInput` — Expert szöveg, vagy a blokkok `_blockToExpertSourceLine` szövege (`_vmaBlocksSource`: `blockOfLine`, `lineMap`) |
| Fordítás | `_vmaAnalyze` → `vma_analyze` Tauri command (Rust VMA): PRG, listing, címkék, szegmensek, memória, sidecarok; `_vmaNormalize` |
| Build | `_kickOrVaPrg` → `_vaBuildPrg` → `_vmaRustBuild` → `_vmaBuildResult` (BASIC SYS stub: a Rust, a `basic-sys-toggle` szerint) |
| Élő nézetek | `_vmaLiveFor` / `_vmaLiveNow` (gyorsítótár) + `_vmaLayout` (a régi layout-alak a disasm / monitor / memória / ciklus / lint nézeteknek) |
| Run | `launch_vice` Tauri command — temp PRG + VICE indítás |

### Run módok (split run gomb)

| Mód | Mit csinál |
|-----|-----------|
| `prg` | PRG → VICE direkt |
| `d64` | PRG + extras → D64 (c1541) → VICE |
| `ultimate` | PRG → C64 Ultimate REST API (D64 mount + run_prg) |
| `vice` | Beépített C64 (VICE WebAssembly, `_w64Run`; a korábbi `web64` mód, beállítás és ablakpozíció átvétele: `_VICE_LEGACY`, `_runModeNormalize`), debuggerrel |
| `kff2` | PRG → Kung Fu Flash 2 USB soros kapcsolaton (`run_on_kff2`), valódi C64/C128-ra |
| `ue2-d64` | D64 (c1541) → `ue2_ensure` + a meglévő `run_d64_on_ultimate` a `127.0.0.1:<port>` hostra (`runUltimateD64("ue2")`) |
| `ue2` | PRG → UE2-C64U-Emulator REST (`src-tauri/src/ue2emu.rs`, `ue2_run_prg`, `runOnUe2`): igény szerint indítja (`ue2emu run --net user --web-port P --control P+1`), `.ue2`-nél előbb `install` a firmware-enkénti flash-képbe (config `ue2emu/`), kilépéskor `quit` a flash mentéséhez; a Commodore firmware-ben alapból ki van kapcsolva a webszerver, ezért `--settings` (`NETWORK_SETTINGS`) minden induláskor bekapcsolja; a ROM-mappából csak a 2048 bájtos `chars.bin` kötelező; beállítás a config `ue2emu` kulcsa, Beállítások → Integrációk; a VICE Monitor ablak UE2 módban a `--vice-monitor` portra (P+2) csatlakozik (`ue2emu::monitor_port`, `ue2_set_monitor_target` a `setRunMode`-ból); Debug: `_udDebug` (`#ue2-debug-dialog`, `setupUe2Debugger`, közös panelek `_w64RegsHtml` / `_w64DisasmWindow` / `_w64MemHtml` / `_w64BpsHtml`), backend `ue2_dbg_start` + a közös `debugger.rs` (`dbg_*`) tartós monitor-kapcsolattal; ugyanez az ablak a VICE-os debuggeré. A 0.6.0 sajátosságai, kimérve: a monitor-parancsok nem állítják meg a CPU-t (Break = vezérlőport `monitor c64 halt`), a `run_prg` resetje elviszi a checkpointot (`load_prg`, `expect-c64 READY.`, élesítés, majd `RUN` a keyboard feeddel), a `dbg_exec_table` a tábla címével azonosít, és csak szabad futásban frissít (lépésben nem), ezért két checkpoint-változás szabad futás nélkül a régi táblán hagyhatja a gépet: a `sync_checkpoints` csak közvetlenül az `EXIT` előtt fut, egy írásban (`update_checkpoints`), a lépések nem nyúlnak a listához; a PC-n álló checkpoint az `EXIT`-et azonnal megállítja (`continue_cpu` előbb lép), a step over / out a gép saját `EXECUTE_UNTIL_RETURN`-jét használja; **nyitott hiba:** soha vissza nem térő kódból indított step out után a C64 órája áll a célcímen (a `monitor status` szerint fut), a `sync_checkpoints` újraépítése (`rearm`, `PLACEHOLDER_CHECKPOINT`) ezen nem segít, az ok ismeretlen; a CPU állása alatt a CIA / VIC fut, így a lépésnél szinte mindig vár egy IRQ (`step_instruction`: az I flag a lépés idejére be, a `SEI` / `CLI` / `PLP` / `RTI` kivétel, a `PHP` bájtja javítva; `step_over`: JSR-en maszkolt belépés, majd `until_return` élő IRQ-val); valódi teszt `real_ue2emu_*` (#[ignore], `UE2_EXE` / `UE2_FW` / `UE2_ROMS`) |

### Kiadás FTP-re — `.github/workflows/publish.yml`

Actions → **Publish** → Run workflow, bemenet egy sikeres **kézi** Build Tauri futás ID-ja (push / PR futásnak nincs telepítője). A `scripts/publish-artifacts.py` ellenőrzi a futást, a kicsomagolt telepítőket (egy verzió) és a build commitjából a `docs/Visual Assembler Manual.pdf`, `.hu.pdf`, `README.txt`, `install.txt` fájlokat, valamint a `samples/` mappából csomagolt `va-samples.zip`-et (`build_samples_zip`, a zipben `samples/…` útvonalak) FTPS-en a `/www/downloads/VA/` mappába tölti, a dokumentumokat és a zipet utoljára. Secret: `FTP_PASSWORD`. **Régi telepítőt nem töröl** (a SID Studióval ellentétben): a `downloads/VA/index.php` csak a dashboardon kiadott verzióig kínál telepítőt, az új feltöltés ott vár, a kiadottnak addig is elérhetőnek kell maradnia. A dokumentumok és a zip viszont azonnal felülíródnak. Teszt: `tests/publish-artifacts.test.js`, `tests/publish_artifacts_test.py`.

### R65 fordító (KickAssembler-kompatibilis) — külön repó

**`F:\Development\R65`** (https://github.com/zstarczali/R65), git-függőség `default-features = false`-szal (a `gui` feature
nélkül, eframe / rfd nincs). Könyvtár-API: `r65::build(source, path, &BuildOptions)` → `Build` (PRG, hibák, `extra`:
címkék, forrás-spanok, `.print`, `.vs` / `.sym` / `.dbg`). Tauri: `r65_build` / `get_r65_version` (lib.rs).
Mód: `assemblerSyntax` = `"r65"` (Beállítások `#assembler-syntax`, Projekt beállítások `#ps-assembler`, `.proj`
`"assembler": "r65"`); az ACME-hez hasonlóan csak szöveges: `_textOnlyAssembler()`, és az ACME előnézet-gépezetét
használja (`_textBuild` → `_buildR65Prg`, az eredmény ACME-alakban: `_r65Report`, `_r65LabelDump`, `_r65ErrorEntry`;
szövegek `_textKey("acme…")` → `r65…`). A projekt indítófájlját fordítja (`_r65Source`, az `#import`-okat az R65 olvassa).
Teszt: `tests/r65-mode.test.js`. Ismert hiány: a Hires / Curve demó-generátorok R65-ben VA makrókat írnak.

### Exomizer
`launch_exomizer` és `build_exomizer_prg` Tauri commands; tömörített SFX PRG.

### VMA fordító Rustban — külön repó

A VMA fordító Rust portja **külön repóban** van: **https://github.com/zstarczali/VMA** (publikus, GPLv3), helyben
**`F:\Development\VMA`** (a VA mellett). A `crates/vma` már nincs a VA-ban. Részletes állapot és napló:
[VMA-RUST-PLAN.md](VMA-RUST-PLAN.md).

- **Függőség:** `src-tauri/Cargo.toml` → `vma = { git = "https://github.com/zstarczali/VMA.git", rev = "<sha>" }`
  (commit SHA-ra kötve; jelenleg VMA 2.3.0 = `7a7d7ff`, a `development` ág commitja). VMA-módosítás után ott commit + push a
  main-be, majd a VA-ban a `rev` cseréje + `cargo update -p vma`. Egyszerre fejlesztéshez ideiglenesen
  `[patch."https://github.com/zstarczali/VMA.git"] vma = { path = "../../VMA" }` (ezt ne commitold).
- **Egyetlen fordító: a Rust VMA.** A JS fordító (layout, `compileBlock`, `assembleProgramToPrg`, motorválasztó
  `#vma-engine`) kikerült. Belépő: `_kickOrVaPrg` → `_kickBuildPrg` / `_vaBuildPrg` → `_vmaRustBuild` (`vma_analyze`;
  Kick projektnél a `kick.text`, extra kimenetek és a SID-export `vma_build` `raw`-val). Tauri nélkül (böngésző) nincs
  fordítás: `vmaNeedsDesktop` hiba (`_vmaAvailable`). A JS-ben csak a forrás-oldal maradt (parser, `_blockToExpertLine`,
  Kick előfeldolgozó, `_levelBuild`, `_buildRelocatingLoader` az ACME-hez, `_evalAsmExpr` a Kick debug-jelölőkhöz).
- **Viselkedésváltozás:** a VMA repóban, utána a golden-frissítés (`node scripts/vma-golden.js --update`, csak a
  szándékolt esetek változhatnak; ellenőrzés: `node scripts/vma-golden.js [szűrő]`).
- **Tesztek:** a golden korpusz a VA-ban (`tests/vma-golden/`: `cases.js` = bemenetek, `manifest.json` = a Rust
  PRG + `.sym` / `.vs` / `.dbg` hash-ei). A CLI-t a `VMA_BIN` vagy `VMA_DIR` (alapból `../VMA`)
  `target/{release,debug}/vma.exe` adja → előbb `cargo build --release` a `F:\Development\VMA`-ban; nélküle a fordítós
  tesztek kimaradnak. Segéd: `tests/helpers/vma-cli.js` (`compileText`, `codeOf`, `labelOf`, `useVmaCli(app)`,
  `buildApp`, `analyzeApp`, `vmaTest`); a CLI `--analyze FILE` = a `vma::analyze` JSON. A VMA saját tesztje:
  `cargo test --offline` ott. Opkód-tábla generálás: `node scripts/vma-gen-opcodes.js` (a VMA repóba ír).
- **Hibák:** a Rust `Msg { key, params }`-t ad a JS fordítókulcsaival (`_vmaErrorMessage` / `_vmaErrorEntry` fordítja);
  új Rust-hibakulcs mind a 7 nyelven kell (`tests/vma-error-keys.test.js`).

---

## 11. Gyakori hibák és csapdák (bug-trap)

### `*` a kifejezésben: PC vs szorzás
A VMA (Rust) csak **érték-pozícióban** olvassa `*`-ot PC-nek (kifejezés-eleje, vagy
`( + - / % & | ^ ~ < > , =` / whitespace után); szám/`)`/azonosító után szorzás (`STRIDE*2`).
Teszt: `tests/star-expression.test.js`.

### `_evalAsmExpr` és a boolean összehasonlítások
`_evalAsmExpr` (JS, a Kick `.watch` / `.break` címeihez) a `<`, `>=`, `==` stb. eredményét
(JS boolean) **1/0-ra normalizálja**. A régi inline `evalAsmExpression` másolatok
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
- **Mozgatható dialógus megnyitása:** ha a dialógus a `setupDraggableEditorDialogs` listájában van,
  a megnyitó függvény a `showModal()` / `show()` **előtt** hívja a `dlg._applyPosition?.()`-t.
  Enélkül újraindítás után először középen jelenik meg, és csak a `toggle` utáni két
  `requestAnimationFrame` után ugrik a mentett helyére (`_editorDialogPositions`).
  (Így javítva: `openProjectSettings`, `openTutorialEditor`.)

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

### 15.5b Hi-Res MIX (keverék-toll)

Csak multicolorban: `#hg-mix-bar` (Be `#hg-mix-on`, 8 hely `#hg-mix-slots`, 3 szín `.hg-mix-col`, minta `#hg-mix-pattern`), állapot
`_hgMixOn` / `_hgMixSlot` / `_hgMixes` (`var`, TDZ), mentés `c64va-hg-mix` (`_hgMixLoad` / `_hgMixSave` / `_hgMixNormalize`); minták
`_HG_MIX_PATTERNS` → `_hgMixIndex(p, x, y)` (0..2, a kép koordinátáiból, így az alakzatok varrat nélkül illeszkednek). A toll
`_hgInk()` (szám vagy `(x, y)` → szín függvény, `_hgInkAt`), ezt kapja a ceruza, spray, alakzatok és a `_hgFloodFill`; a cellakorlát
a `_hgMcPaint` / `_hgSet` útján marad. A `setupHiresEditor` a `_HG_MIX_*` konstansok előtt fut: a betöltés és a UI-építés az első
megnyitáskor (`_hgMixReady`). Teszt: `tests/hires-mix.test.js`.

### 15.6 Színpaletta

Minden szerkesztő (sprite, char, Charset Canvas, Hi-Res, map, level, Toolkit színminták) a `_CE_COLORS` hex-tömbbel rajzol;
saját színtáblát ne vegyél fel. A paletták numerikusan a `_C64_PALETTES`-ben (colodore / pepto / vice / deekay / c64wiki,
nevek `_C64_PALETTE_NAMES`), a választás Beállítások → Általános → Szerkesztők `#editor-palette` (`c64va-editor-palette`,
alapérték Colodore). `_setEditorPalette` helyben tölti újra a `_CE_COLORS`-t, nullázza a `_lvRgbCache` / `_hgPalRGB` /
`_spPalRGB` cache-t, frissíti a swatch-okat és a nyitott szerkesztőt, és a `--c64-blue` / `--c64-light-blue` CSS
változót (karakter-ROM nézetek). A PNG import `palette` alapértéke `"editor"` (`_hgPngPalette`). Új szerkesztőnél új
swatch-konténert vegyél fel a `_setEditorPalette` listájába, RGB-cache-t ott nullázz. Egyéni paletta: `_C64_PALETTES.custom`
(`c64va-custom-palette`, szerkesztő `#palette-editor-dialog`, `.act` / `.vpl` / `.gpl` import, `.act` / `.vpl` export).

## 16. Jelenlegi verzió

`2.7.9` — `package.json`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`, `index.html`
What's New dialógus, `README.md`, `README.txt`, `install.txt` (verziósor + telepítő-fájlnevek), `INSTALL-MAC.md`, `INSTALL-LINUX.md`, `Visual Assembler Manual.md`, `Visual Assembler Manual.hu.md`, `AGENTS.md`, és ez a fájl + copilot-instructions.md.

> **Kézikönyv-szinkron:** a `Visual Assembler Manual.md` (angol, forrás) mellett van egy
> `Visual Assembler Manual.hu.md` (magyar fordítás). Ha az egyiket szerkezetileg módosítod
> (új/átnevezett/áthelyezett szakasz, kódblokk), tükrözd a másikba is. A `tests/manual-sync.test.js`
> ellenőrzi a fejléc-szerkezet (H2/H3/H4 darabszám), a számozott szakaszok sorrendje, a
> code-fence-ek párossága és a verziószám egyezését — ha elcsúsznak, ez a teszt megbukik.
> Az app a bundelt `docs/Visual Assembler Manual.pdf`-et nyitja (az angol .md-ből generált),
> a .md-k a szerkesztési forrás.

> **Weblate:** a `va-product-site/ub-manual` és `va-product-site/va-manual` mappák tartalmát Weblate fordítja — verzióemeléskor és dokumentáció-frissítéskor **ne szerkeszd** őket.
Fő 2.7.9 változások: **R65 beépítve** (a `F:\Development\R65` KickAssembler-kompatibilis assembler git-függőségként, `default-features = false`, `r65::build`; Tauri `r65_build` / `get_r65_version`): `assemblerSyntax` = `"r65"` a Beállításokban (`#assembler-syntax`) és a Projekt beállításokban (`#ps-assembler`, `.proj` `"assembler": "r65"`), szöveges mód mint az ACME (`_textOnlyAssembler`, `_textBuild` → `_buildR65Prg`, az eredmény ACME-előnézet alakban: `_r65Report`, `_r65LabelDump`, `_r65ErrorEntry`; szövegek `_textKey`), debugger-fájlok `_r65DebuggerSidecars`, About `#about-r65-version`; `isProgramEmpty` szöveges assemblernél a forrás szövegéből dönt; teszt `tests/r65-mode.test.js`. **Build összesítő**: az Expert / UB Build gomb a munkaablakot mutatja (`showWorkProgress("workProgressBuild")`, `completeWorkProgress(…, 2200, _workBuildSummary(prg))`: méret + címtartomány). **Kick import**: több soros utasítás (`_kickSourceLines`), halasztott `.errorif` (`.assert`), `.pseudopc` címkék és `<` / `>` szám-literál a `fold`-ban (`foldLiteral`), script-elemes fájlnál Kick projekt ajánlat (`_kickUsesScript`, `kickImportUseProject`). UB eszköztár: elválasztók a Load / Save gombok körül. Customer message `id` = `r65-279`.
Korábbi 2.7.8 változások: **Egyetlen fordító: a Rust VMA** (VMA 2.3.0), gyorsabb build és élő nézetek (egy fordítás, minden nézet abból). Customer message `id` = `rust-vma-278`. A JS fordító (layout, `compileBlock`, `assembleProgramToPrg`, `buildAutostartPrgForEmulator`) és a `#vma-engine` motorválasztó kikerült; minden build és élő nézet a `vma_analyze` eredményéből (`_vmaAnalyze`, `_vmaLiveFor` / `_vmaLiveNow`, `_vmaLayout`); Tauri nélkül `vmaNeedsDesktop` (mind a 7 nyelven). VMA 2.3.0: CLI `--analyze FILE`, pontos lokális címke abszolút operandusban (`JMP Second.lp`, `LDA .lp+1,X`). Golden = Rust snapshot (`manifest.json`: PRG + `.sym` / `.vs` / `.dbg` hash), tesztek a `tests/helpers/vma-cli.js`-en át; törölve a `vma-reference.js`, `vma-rust.js`, `scripts/vma-cli.js`, `vma-shadow-scan.js`, `vma-rust-report.js`, `tests/vma-engine.test.js` (→ `tests/vma-build.test.js`).
Korábbi 2.7.7 változások: **Ultimate 64 paletta makrók** (JS + Rust VMA 2.2.0): `.u64_palette "f.vpl"` = INCBIN-variáns (`incBinU64Pal`, cím nélkül, `_incBinPayload` üres, a színek a kódban; `_u64PalColors` = `_palParseText` / `_palParseAct`, `_incBinBlockError`), `.u64_palette_color idx, $RRGGBB` (`isUciPaletteColorMacro`, kifejezések, `_u64PalColorParse`), `.u64_palette_reset` (`isUciPaletteResetMacro`); közös UCI rutin `_u64UciBytes` (59 byte + adat: `$DF1D` = `$C9` ellenőrzés, idle-várás leftover DATA_ACC-kal, parancs a `$DF1D`-be, PUSH_CMD, busy-várás, DATA_ACC; target `$04`, `$52` / `$53` / `$54`; méret 109 / 65 / 61, `_U64_PAL_*_SIZE`); a flagnevekben nincs számjegy (a golden `macroCases` regexe `is[A-Za-z]*Macro`); Rust `src/u64pal.rs`; hibák `u64Palette*` mind a 7 nyelven; teszt `tests/u64-palette-macro.test.js` (mini6502 + UCI-modell), golden `var-u64-palette`, `macro-U64_PALETTE*` (`tests/vma-golden/files/u64-palette-sunset.vpl`). Minta `u64-palette-demo` (`sampleOptions[39]`, Hardver kategória, `samples/u64-palette-sunset.vpl` / `-green.vpl`); a `loadSampleFromFile` a minta INCBIN- és SID-fájljait is betölti. **Hi-Res MIX** (15.5b). **Beépített C64**: `vice` futtatási mód (régi `web64`: `_VICE_LEGACY`), `www/vice/vice.*`, üres programot nem indít (`isProgramEmpty`, `_isNoCodeBlock`). A „Rust + JavaScript check” (`shadow`) motor kikerült. VMAExtension 0.1.4: a három makró kiemelése + snippetje. Customer message `id` = `u64-palette-277`.
Korábbi 2.7.6 változások: **SID Player csillagok és duplikátumok**: csillagok 0–5 (`item.fav` szám, `_sidStars`, `_SID_STARS_MAX`; `.sidpl`: `fav: true` + `stars`, a régi `fav: true` = 1; ugyanarra a csillagra kattintás törli), `#websid-play-keep-starred` → `_sidPlayerKeepStarred` (`_showConfirm`, `sidPlayerKeepStarredConfirm`), `#websid-play-dedupe` → `_sidPlayerRemoveDuplicates` (`_sidPlayerKeys`: HVSC / Modland útvonal vagy bájtok; az első példány marad a legtöbb csillaggal); `tests/sid-file-playback.test.js`. **Hangerő-kiegyenlítés gyors leszabályozása** (a SID Studio `289f5a9` portja): `_playerNormGlide(param, from, to, peak, at, now)` a `follow`-ban; ha az új csúcs (`0.9 / peak`) már nem engedi a korábbi erősítést, a gain az új hang előtt 10 ms-mal, 3 ms-os időállandóval esik le, minden más változás 2 s-os csúszás; `tests/sid-player-normalize.test.js`. **HVSC letöltés jelzése**: a letöltés alatti második kattintás nem ad hozzá újra (`_hvscAdding`, `var` a TDZ miatt), a találat `.websid-hvsc-item--loading` + `_sidSpinner()` a + gomb helyén. **Restore64 forrás saját BASIC stubbal a kód után** (`.pc = $080d` …, majd az adatblokkok közt `.pc = $0801` + címke + `.byte`/`.text` stub): a `_getEmbeddedBasicSysAddress` a LABEL blokkot (és a `$`-os `orgAddress`-t) átlépi, a `_buildAutostartPrgCore` beágyazott stubnál `assembleProgramToPrg(0x0801)`-et hív, így a `getProgramLayout` stub-ORG emelése (`inStub`) nem viszi a `$0801`-es szegmenst a `$080D`-re (eddig a stub a kód első 12 bájtját írta felül, a program nem indult); ugyanez a Rust VMA 2.1.1-ben (`embedded_sys_address`, `build_prg_full` a `prg.rs`-ben); golden eset `var-embedded-stub-after-code`. **CI**: a Publish workflow a `samples/` mappát `va-samples.zip`-ként tölti fel a dokumentumokkal (`build_samples_zip`). Customer message `id` = `sid-stars-276`.
Korábbi 2.7.5 változások: **Csatornagörbék** (a SID Studio `www/channel-monitor.js` portja, MOD-ág nélkül): `#channel-monitor`, gombok `#websid-play-curves` / `#sid-curves-btn`, `setupChannelMonitor`, `_channelMonitorQueue` / `_channelMonitorFrame` (a `render_sid_file` `monitor` + `frameRate` mezőiből, Rust `channel_registers`, az audio órájához igazítva, a `monitorEnv` burkolókkal), `_channelMonitorVoices`, `_channelMonitorDraw`, tracker-lejátszásnál `_sidAna.last` (`_sidAnaAttach` a nyitott ablakra is); saját méretező `_sidSetupResizeHandle` (`c64va-channel-monitor-size`). A Studióval ellentétben a VA SID Editora modális, ezért az ablak a tulajdonosába költözik (`_channelMonitorOwner` / `_channelMonitorSync`: modális SID Player, SID Editor, különben `body`; a tulajdonosok `close` eseményére is), így nem inert, és a szerkesztő kezelhető mellette; a tulajdonos transzformja nem maradhat (`_channelMonitorFreezeOwner`, a szerkesztő nyitásakor is), a kívánt állapot `c64va-channel-monitor-open`, a tulajdonossal együtt zárul és nyílik; `tests/channel-monitor.test.js`. **Spektrum nézet**: `#sid-viz-mode` (Mix / Channels, `_sidVizState().mode`), `_sidVizDrawChannels` a `_channelMonitorFrame` / `_sidAna.last` regisztereiből + `_sidAnaVoiceLevels`, a `_sidAnaAttach` erre is figyel. **Belső zeneszámok egymás után**: `#websid-play-subtunes`, `_sidPlaySubtunes`, `_sidPlayerSetSubtunes`, `_sidPlayerAutoAdvance` (a fájl hátralévő subtune-jai a következő elem előtt, shuffle-lel is), `playSubtunes` a `c64va-sid-player` állapotban. Customer message `id` = `channel-curves-275`.
Korábbi 2.7.4 változások: **Kijelölés, vágólap, kvantálás a vízszintes trackerben**: `_sidRollView.sel` (kulcs `v:start`, `_sidRollKey`), Shift+húzás = keret (`view.band`), Ctrl+kattintás, Ctrl+A, Esc; `_sidRollCopySelected` / `_sidRollCutSelected` / `_sidRollDeleteSelected` / `_sidRollPasteAt` (`_sidRollPasteRow(atMouse)`: Ctrl+V-nél az egér alatti sor, a gombnál a sárga jelölő `view.mark` = az utolsó bal kattintás sora vagy a vonalzó, beillesztés után a beillesztett hangok mögé lép; különben a kurzor; a billentyűk a teljes `#sid-roll` ablakon) a közös `_sidRollPlace`-szel (felülír, a levágott hang régi note-offját törli) és a `_sidRollDelete`-tel (az előző hang megtartja a végét); fejléc-gombok `#sid-roll-undo/redo/cut/copy/paste/delete/quantize` (`_sidRollSyncTools`, a Visszavonás állapota a `_sidHistRender`-ben); kvantálás: rács `#sid-quantize` (`_sidQuant`, `c64va-sid-quantize`, 2 / 4 / 8 / 16 sor, alapból 4), Q a kijelöltre (`_sidRollQuantizeNotes`: legközelebbi rácssor, hossz marad), felvételnél csak `#sid-quantize-rec` mellett (`_sidQuantRec`, `c64va-sid-quantize-rec`; `_sidRecordQuantize`, `rec.taken`, `rec.songPos0`); `tests/sid-roll-select.test.js`. Customer message `id` = `sid-tracker-274`. **SID Player hangerő-kiegyenlítés**: `#websid-play-normalize` (`_playerSetNormalize`, `c64va-sid-normalize`, cél −18 dB, max. ±12 dB: `_playerNormGain`; `_normMeter*` a renderelt hangból, bekapcsolva az első 2 mp-et visszatartja, `state.warm`, `state.held`; `_playerNormNode` a `_sidExtGain` előtt), ugyanaz a Studióban; `tests/sid-player-normalize.test.js`. **Karácsonyi téma** (`data-theme="christmas"`, a `style.css` végén, ugyanaz a VA SID Studióban): csak decemberben (`_isChristmasThemeDay`, `_christmasThemeSync`: az opció `hidden`, a picker `toggle`-jére újraellenőriz); a `setTheme` menti a lecserélt témát (`c64-block-theme-before-christmas`), az `index.html` fej-scriptje utána arra vált; `tests/christmas-theme.test.js`. **Hangszer törlése, dal hangereje, PAL / NTSC**: `#sid-inst-del` → `_sidInstDeleteCurrent` (használt hangszernél `_showConfirm`, `sidDeleteInstrumentUsed`), Files `#sid-inst-unused` → `_sidInstRemoveUnused`, közös `_sidInstRemove` (a törölt hangjai az előtte maradt hangszerre, a későbbiek eggyel lejjebb, egy mindig marad), `_sidInstUse`; dal hangereje `#sid-song-vol` tekerő (`_sidMakeParamKnob`, `_sidSongVol`, `_sidVol()`, `_sidSetSongVol`), két SID-nél a második chipé `#sid-song-vol2` (`#sid-song-vol2-group`, `_sidSongVolSync`, `_sidSongVol2`, `_sidVol2()`, `td.vol2`, `sid_vol2`); a hangszer Vol-ja kikerült a felületről, a `songVol` belső (új hangszeren `true`, a `.sid` import `false`-szal hagyja a hangerőváltásokat; `.bin` ext flag `0x40`; trailer nélküli vagy `$A5` mentésnél mind `true`, a dal hangereje az első hangszeré), `ivol` = `$10` → a chip hangereje marad (motor `_sidEngNoteOn`, lejátszó `CMP #$10`), a `sid_init` a `sid_vol`/`sid_vol2`-t a dal hangerejére állítja; PAL / NTSC `#sid-video` (`_sidNtsc`, `_sidIsNtsc()`, `_sidFps()`, `_sidClockHz()` = 985248 / 1022730, `_sidFreqTables` órajelenként cache-el, PSID flag `0x18`, Rust `SidPreviewPayload.ntsc` → `new_with_clock` + 60 frame/s); `.bin` trailer a song lista után: `$A6`, hangerő, flagek (bit 0 = NTSC), a második SID hangereje; a `_sidSongVol` / `_sidNtsc` `var` inicializáló nélkül (TDZ), a segédfüggvények nem deklarált változón is működnek (tesztek egyenként töltik be); `tests/sid-inst-delete.test.js`.
Korábbi 2.7.3 változások: **Linux hang**: a WebKitGTK a Web Audiót GStreamerrel játssza, ezért `bundle.linux.appimage.bundleMediaFramework` + `deb` / `rpm` `depends`, a CI telepíti és ellenőrzi a plugineket (`libgstapp.so`, `libgstautodetect.so`); `tests/linux-sound.test.js`. **Visszavonás a SID szerkesztőben**: `#sid-undo` / `#sid-redo`, Ctrl+Z / Ctrl+Y (`_sidUndo`, `_sidRedo`, `_sidHist`, max `_SID_HIST_MAX` = 100); a módosítási pontok helyett `_sidHistSchedule` (a `window` `pointerup` / `keyup` / `change` / `input` / `wheel` eseményei, MIDI, betöltés, felvétel vége; 300 ms) → `_sidHistCheck` összeveti a teljes dalt (`_sidHistSnap`, változatlan pattern közös stringgel), felvétel alatt nem ment; `_sidHistApply` a megváltozott hangszerre és patternre ugrik; `tests/sid-undo.test.js`. **reSID első hang**: a motor hangereje az első hangig 0, ez a lejátszás első hangján adott kattanást (6581-en 15 700 körüli csúcs), ezért a `_sidWaOpeningMixer` száraz futással megkeresi az első hang `$D415-$D418` értékeit, és a `_sidWaOpenFrame` az addigi frame-ekbe írja (csak reSID-nél); `tests/sid-first-note.test.js`. **Tempó**: a `sidSpeed` felirat „Frame/sor” (a `_sidSpeed` és a formátumok nem változtak), a `#sid-bpm` csak kijelző, mert a tempó csak egész frame/sor lehet; `tests/sid-tempo.test.js`. **Hangok mozgatása a vízszintes trackerben**: a törzs húzása `kind: "move"` (`_sidRollMoveStart`: a sáv érintett sorainak mentése, `_sidRollMoveTo`: minden lépés ebből indul, így amin áthalad, visszajön), egy sorral a következő hang előtt megáll, az előzőbe belevághat; a kurzor `move`. **Hanghossz a vízszintes trackerben**: `_sidRollGrab` (a hang vége, rövid hangnál a fele, kifelé legfeljebb 4 px; különben a törzs = hangmagasság), `_sidRollNoteLimit` (a sáv következő hangjáig), `_sidRollDragEnd`, `ew-resize` / `ns-resize` kurzor, `view.edge` fogantyú, a `_sidRollSetEnd` rövidítéskor törli a régi note-offot; `tests/sid-roll-resize.test.js`. **MIDI engedély kérdés nélkül**: `src-tauri/src/midi_permission.rs` (`allow_without_prompt`, a `.setup`-ból; Windows: WebView2 `PermissionRequested`, csak a 11-es MIDI típust engedi; a `webview2-com` verziója a `wry`-éval mozog, Tauri-frissítéskor együtt kell emelni; a Tauri 2.12 saját permission handlert ad). **.bin betöltése**: a `_sidDeserialize` és a `_sidApplyImportedTune` a `_sidSong[0]` patternjét nyitja meg, nem a 0.-at (a `_sidSongPos` = 0 ezzel egyezik). **SID Player Pause**: a lejátszónak saját `AudioContext`-je van (`_sidPlayerAudio`, `_sidExtAudio`, `_sidExtGain`, spektrum `_sidVizExt`), mert a közöset a `_sidPlayBuffer` → `_sidEnsureAudio` minden renderelt darabbal és szerkesztő-hanggal felébresztette; a `_sidPlayBuffer` `output` paramétere nem ébreszt; a Pause másodszorra folytat; `tests/sid-player-pause.test.js`. **Stop a „Play: All” után**: `_sidPlayReturn` (`{ pat, songPos }`, a `_sidPlay` menti), a `_sidStop` visszaáll rá, lejátszás közben választott song-lépésnél arra; `tests/sid-stop-view.test.js`. **Polifon felvétel MIDI-ről**: `#sid-midi-poly` (`_sidMidiPoly`, `c64va-sid-midi-poly`, alapból ki), `_sidRecordPolyNote`: minden tartott billentyű saját hang a `rec.voice`-tól (`_sidRecordPolyVoice`, `rec.held`; ha mind foglalt, a legrégebbi adja át), 40 ms-on belüli akkord egy sorra (`rec.chord`), felengedés = note-off (`_sidRecordPolyRelease`, ugyanazon a soron a következőre várva: `rec.pendingOff`); csak a MIDI, a VA-VK és a billentyűzet marad egyhangú; `tests/sid-midi-poly.test.js`. **reSID-es hang-előnézet kattanás nélkül**: minden hang új chipet indít, a `$D418` első írása DC-ugrást adott (10 ms-os lecsengés a külső szűrőn; 6581-en kb. 15 700, 8580-on kb. 600); a chip az első frame előtt beáll a `$D415-$D418`-ra (`settle_on_mixer`, 100 000 ciklus, a session is), az integer felüláteresztő maradék szintjét (6581-en 905) a `dc_trim` levonja, az egyszeri puffer vége 5 ms-os lecsengés (`fade_buffer_end`); teszt `a_note_preview_on_resid_opens_and_ends_without_a_click`. Customer message `id` = `sid-tools-273`.
Korábbi 2.7.2 változások: **SID motor**: `src-tauri/src/sid_chip.rs` (`SidEngine`, `SidChip`: VA SID Core vagy `resid-rs` (a javított másolat a `src-tauri/vendor/resid-rs`-ben: a `Resample` FIR-interpolációja 32 biten túlcsordult, lásd `VENDORED.md`), mindkettő ciklusonként órajelezve, a C64 mag közös; a reSID sablonja `ResidChip::new`, klónozva, mert minden hang-előnézet új chip); beállítás `_sidPreviewEngine` = `resid` (alapérték) | `va-core`, a mentett `websid` az alapértékre vált, a payload `engine` mezője viszi a Rustnak; a WebSID és a regiszter-stream kikerült (`www/lib/websid`, `_webSid*`, `_sidStream*`, licence CC BY-NC-SA volt), a `Play: All` is a JS motor regisztereit rendereli; `tests/sid-engine.test.js`, Rust `sid_chip::tests`, mérés `engine_speed` (#[ignore]). A SID Player puffer felirata másodperc (10 / 15 / 20 / 30 s). Aktív ablak a modális SID Editorban: `_dlgRaisePanel`, `_DLG_PANELS`, `_dlgMarkTop` (`.dlg-active` a dialóguson vagy a paneljén, z-index 30 + sorszám a `_dlgPanelStack`-ben, amelyben a `.sid-card` is benne van: aktívan a szerkesztő is a panelek fölé kerül; `_dlgPanelWindow`, `_dlgEditorOpened`). Customer message `id` = `resid-272`.
Korábbi 2.7.1 változások: **Két SID a SID szerkesztőben**: a dal szélessége a patternek oszlopszáma (`_sidVoiceCount`, 3 vagy 6), a második SID címe `_sidSid2Addr`, `.bin` `0xFC`, 6 hangos lejátszó `$50-$69` ZP-vel (`sid_vptr`), 2 SID-es dump és import, sztereó VA SID Core; **csatorna-spektrum** (`#sid-ana`, `_sidAna*`, a regiszterekből számol); `_webSidLoadPsid` javítás (nem létező `song`). **Ultimate emulátor** (UE2-C64U-Emulator, `src-tauri/src/ue2emu.rs`): `ue2` / `ue2-d64` futtatási mód, igény szerinti indítás + `.ue2` install, Debug `_udDebug` / `ue2_dbg_*`, VICE Monitor ablak a P+2 porton; a részletek és a 0.6.0 sajátosságai a Run módok táblázatában. **D64 on hardware**: a mount `?type=d64&mode=readwrite` (a C64U 1.1.0 nélküle 400-at ad). Minták `ultimate-turbo-demo` (`sampleOptions[37]`, 64 sprite) és `ultimate-box-demo` (`sampleOptions[38]`, a box kockája, a `macros.json` + `data.asm` include-dal, TOD-időzítés, állapotsor a bitmapben), IRQ és hardver kategória; `$D031` 3 mp-enként 1–64 MHz, csak Ultimate-en; `tests/ultimate-turbo-sample.test.js`; a VA az emulátorban a Turbo Control-t a turbó-regiszterekre állítja (`turbo_registers_line` az `ue2emu settings` kimenetéből). **VICE debugger**: `src-tauri/src/debugger.rs` = a közös munkamenet (`DebugSession`, `Halt::ControlPort` (ue2emu: `c64 halt`) / `Halt::Monitor` (VICE: bármely parancs megállít), `dbg_*` commandok); `vice_dbg_start` (lib.rs, `vice_debug_monitor`: a monitor-porton futó VICE vagy új `spawn_vice` fájl nélkül, checkpointok, monitor `AUTOSTART`); VICE-ban a step over / out checkpoint a visszatérési címre (`step_to_return`), mert a VICE `EXECUTE_UNTIL_RETURN`-je visszatérés nélkül élesítve marad és a következő RTS-nél (a következő munkamenetben is) megáll; frontend `_udDebug("vice")`, beállítás Beállítások → Általános → Debugger `#debugger-choice` (`c64va-debugger` = `va` | `retro`, `_debuggerChoice`; `debuggerPath` nélkül mindig `va`, a `retro` opció tiltva (`_debuggerChoiceSync`); választás nélkül `retro`, ha van `debuggerPath`; a régi `c64va-debug-target` = `vice` → `va`; a `vice` és `ue2` mód mindig a saját debuggerét használja, `va`-nál a hardveres módok a beépített C64-et), teszt `real_vice_debug_session` (#[ignore], `VICE_EXE`). A frissítési szerver (`#update-server`, `#update-settings-label`) a Beállítások Fájlok és útvonalak fülén, a RetroDebugger alatt. **Futtatás menü**: csak a beállított eszközű módok látszanak (`_runModeAvailable`, `_runModeApply`, `_RUN_MODE_ITEMS`; VICE útvonal, `ultimateHost`, `kff2Port`, `_ue2Ready`), a `runMode` a ténylegesen futtatható mód (tartalék: `prg`, majd `vice`), a `_runModeWanted` a kért, ez mentődik a `localStorage`-ba és a projektbe. Customer message `id` = `ue2-vice-271`.
Korábbi 2.7.0 változások: **Beépített C64** (`www/vice/` = VICE 3.10 x64sc WebAssembly a `vice-3.10-web64` forkból, frissítés: `node scripts/update-vice.mjs`; `runMode` `vice`, `#run-vice-mode`, `#vice-btn`, `#vice-dialog`, `setupVice`, `_w64*`; állapot `_w64S()`, megjegyzés `c64va-vice` = `_w64Prefs` / `_w64SavePref`: open, warp, sound, debug, joy, crt, reu, video, sidModel, sidEngine, size). **Debugger** (fork: a `monitor_startup` helyben vár az utasítás előtt, `vice_web_monitor_break_active` / `_continue` / `_step(mode, count)` / `_break` / `_memory_peek`; `_w64Debug`, `_w64DebugBuild`, a közös `_debuggerTargets(prg)` a RetroDebuggerrel; `runInDebugger`: `vice` módban vagy RetroDebugger nélkül ez indul; forrástérkép `_w64ParseDbg` a `.dbg`-ből, ACME-nél a report; töréspontok `_w64BreakpointAddresses` / `_w64ApplyBreakpoints`, léptetéskor nem villan: `_w64OnResume` 200 ms-mal késleltet, `hit_pending` jelzi az új megállást; `_w64DebugLine` → `.expert-dbg-line`; `tests/vice.test.js` + `tests/helpers/vice-debug-check.mjs`, külön folyamatban, mert az emulátor időzítői nem engednék kilépni). **Gép**: `_w64SetVideo` (modell 0 / 3, a modell a SID-et is állítja), `_w64ApplySid` (a motor előbb: a web-build `SidEngine`-nél 8580-ra áll), `_w64SetReu`; a konfigurálás CPU-csapdán fut (`vice_web_queue_resource`, megállított CPU-nál a folytatáskor), `_w64Unhalt`. **Fájlok**: `_w64OpenFile` (PRG autostart, D64 + `LOAD"*",8,1`, CRT), a Run leveszi a cartridge-et; meghajtó LED + track a státuszsorban, a villogás = DOS-hiba, `_w64LedStep`. **Kép**: CRT `_w64ToggleCrt` + `_w64LayoutCrt` (`#w64-crt-layer`, a scanline-periódus egész eszközképpont, 3 alatt nincs), teljes képernyő `.w64-dialog--full` (CSS, nem Fullscreen API; Tauri `setFullscreen`, capability `core:window:allow-set-fullscreen`), méretezés `_w64SetupResize` (a dialógus `transform`-ját előbb rögzíti). A VA SID Core itt nem elérhető (natív Rust a backendben). **UltimateBasic** `Cargo.lock` → `903c133` (a `.dbg` sorszámai jók, ha a `sub` a főprogram előtt áll; a PRG nem változik). **Indítófájl**: a csillag a `startupFile`-ban él, tab-azonosító nélkül; UB `_ubBuildTarget` / `_ubCompileTarget` (nyitott fül vagy lemez), Expert `_projFindEntry` (mappákban is), `_projEnsureStartupTab` (bezárt indítófájl), nem aktív Expert fül a szövegéből (`_expertBuildProgramFromText`); hiba `projStartupMissing`. **Hi-Res multicolor korlát**: cellánként papír + 3 szín (`_hgMcCanPlace`, a `_hgSet` elutasítja, státusz `hgMcCellFull`; `_hgMcPaint` = kitöltés / alakzat / beillesztés egyben, a felülírt terület nem foglal színt), a papír cseréje átszínezi a háttérpixeleket, túllépés piros kerettel (`_hgMcOverCells`, `_hgOverlays`) + export-figyelmeztetés (`_hgWarnOverCells`, `hgMcOverExport`); a kép szélén túli húzás pixelrácsnál nem dob hibát (`_hgDrawPixelBuf`); `tests/hires-mc-limit.test.js`. A `#vice-toast` `popover="manual"`, így modális dialógus fölött is látszik. **Szerkesztő jobb klikk**: Expert + UB közös menü (`_editorCtxItems`, `_edShowCtxMenu`; Kivágás, Másolás, Beillesztés, `edCtxSelectAll`, `edCtxUpper` / `edCtxLower`), vágólap: `_editorReadClipboard` → Rust `tauri-plugin-clipboard-manager` (a `navigator.clipboard.readText` jogosultságot kér a WebView2-ben); a szerkesztés `_editorEdit`: egy `beforeinput` + egy `input`, mint a Ctrl+V (az `execCommand` magában nem küld `beforeinput`-ot, és soronként küld `input`-ot, ami összecsukott régiónál elrontja az Expert forrást), a köztes eseményeket elnyeli; `tests/editor-context-menu.test.js`. A beépített C64 debugger panelje alapból nyitva (`_w64Prefs().debug !== false`). **Paraméter nélküli makró szubrutinként** (JS + Rust VMA): a saját programban `JMP __ml_skip_N` + címke + törzs + `RTS` + `__ml_skip_N:` (`_macroSubroutineBlock`, a folyás nem fut bele), fix című könyvtárban a törzs után `RTS`; `tests/macro-subroutine.test.js`. **Futásidejű IF minta**: `samples/runtime-if-demo.asm` + `.json` (a menü a `.json`-t tölti, a szöveg azonos: `tests/runtime-if-sample.test.js`), `sampleOptions[36]`. Customer message `id` = `web64-270`.
Korábbi 2.6.9 változások: **Git ágak és munka a Verziókezelés ablakban** (`git_exec` engedélyezett alparancsai + `switch`, `restore`, `merge`, `stash`, `clean`; ikonos eszköztár `#vc-git-bar.vc-toolbar` (`.vc-tool-group`, `.vc-tool`, `.vc-row-tool`, `_VC_ICONS`, felirat csak `aria-label`), ágválasztó `#vc-branch-select` (`_vcRenderBranches`, `_vcGitSwitch`: mentetlen fülnél `vcGitSwitchUnsaved`), `_vcBranchNew` / `_vcBranchRename` / `_vcBranchDelete` (be nem olvasztottnál második megerősítés, `-D`) / `_vcBranchMerge` (`merge --no-edit`, ütközés `_vcGitConflicts` = `diff --diff-filter=U`, `_VC_CONFLICT_CODES`, `#vc-merge-abort` → `_vcMergeAbort`, `MERGE_HEAD` a státuszban), fájlonként `_vcFileAction` (diff HEAD ↔ lemez, `add`, `restore --staged`, elvetés `restore --staged --worktree --source=HEAD`, untracked `clean -f`, pathspec `:(literal)`), stash `_vcStashSave` / `_vcStashAction` / `_vcRenderStashes` (`#vc-stash`), közös `_vcGitFinish` (fülek újratöltése `_vcReloadTabsFromDisk`, ütközések, kimenet), kérdező sor `#vc-ask` (`_vcAsk` / `_vcAskClose`, szöveg vagy lista); commit: „Stage all” nélkül projektben csak a stage-elt fájlok (`_vcGitCommit`, a pipa projektnél alapból be); a menüből indított művelet visszajelzése toast (`_vcSetOutput` → `showViceToast(…, plain)`); `tests/version-control-git.test.js` valódi git-tel). **Változások elvetése Git módban** (`_vcGitDiscard`: megerősítés, `git restore` a lemezen, a fülek tisztán újratöltve; nincs változásnál `vcGitNothingToDiscard`). **Új diff nézet** (`_vcParseDiff` → fájlok / hunkok, `_vcDiffHtml`, `_vcDiffRows` (változás-blokkok, szó-kiemelés `_vcWordRanges` + `_vcMarkRange`, helyes egymásba ágyazással), `_vcDiffHighlighter` (`_expertHighlightLine` / `_ubHighlightSource`), egyesített / kétoldali `#vc-diff-split` (`c64va-vc-diff-split`), `#vc-diff-expand`, `.vcd-*` stílusok; `tests/vc-diff-view.test.js`). A Verziókezelés ablak magassága `min(84vh, 780px)`, a napló és a diff saját görgetéssel. **Kick projektek**: az élő ellenőrzés gyökere a nyitott fájl fája (`_kickCheckEntry`, `_kickTreeSources`, `_kickCheckEntryCache`; `_kickPrepare(entryPath)`; Futtatás / Build továbbra is az indítófájl) — ciklus-gutter, hibák, tippek a nem importált fájlokban is; `.pseudopc`-beli előre mutató ág relatív (`_KICK_BRANCHES` ág: `{ label: "$hhhh" }` szimbólum is), char == egykarakteres sztring (`_kickEval` `==` / `!=`). **Save project** (menü) Expert módban a megnyitott projektet a helyére menti a mentetlen projekt-fülekkel (`_expertSaveProjectTabs`). Táblagenerátor: szám-paraméterek egy sorban (`.tg-num-field`, `.tg-num-in`). Customer message `id` = `git-269`.
Korábbi 2.6.8 változások: **Toolkit Expert és UB módban** (`#expert-toolkit-btn` / `#ub-toolkit-btn`, `#expert-toolkit-panel` / `#ub-toolkit-panel`; egyetlen `#toolkit-output`, a `_toolkitPlace` teszi a látható panelbe; UB-ben a Disassembly / Monitor / Toolkit egyszerre egy, `_ubApplyMachineView`; i18n `expertToolkit`). **Panelek méretezése és mentése** (Expert Monitor / Toolkit resizer `_expertSidePanelSync`, `expertMonitorWidth` / `expertToolkitWidth`; a panelállapot a módváltás előtt áll vissza: `_applyUiSettingsToDOM` a betöltött `s`-ből olvas, `_expertApplyPanels`; `ubDisasmVisible` / `ubMonitorVisible` / `ubToolkitVisible`). **VMA nyelv** (JS + Rust VMA 2.1): zero page konstans (`_narrowConstZeroPage`, `.const` / `.var` ≤ $FF → zp mód, `forceAbsolute` = `lda.abs`; szigorú `_evalAsmExpr(…, true)`), `JMP (címke)` (`_parenWrapsAll`), bármely kifejezés operandusként (`buildOperandPreview`, `kifejezés,X/Y` parser-ág), rekurzív kibontás (`expandBlock`: makró a makróban, include az include-ban, `INCLUDE_MAX_DEPTH` = 16, `compileMacroTooDeep`), include rekurzív betöltése (`reloadIncludeBlocks(path, blocks, depth, seen)`, `includeNotFound` / `includeRecursive`, `_includeLoadError`, `_includeOwner` a debugger-fájlokhoz), címkék a DATA / RAWBYTES bájtjaiban, `:név` címke halasztott feloldása (`addAllLayoutLabels`), DATA / RAWBYTES puffer-méret, `macroSizeNotConstant` (JOYSTICK / MEMCPY / MEMSET), feloldatlan TURBO_SET / SPRITE_ANIM hiba. **CRT javítás**: a Magic Desk loader másoló rutinja `$0100`-on fut (`buildMagicDeskLoaderBank0`), a több bankos CRT eddig nem indult. Customer message `id` = `toolkit-268`.
Korábbi 2.6.7 változások: **Rust VMA fordító választható** (Beállítások → Általános → Program `#vma-engine`, `c64va-vma-engine` = `js` (alapértelmezett) / `rust` / `shadow`; `_vaBuildPrg` → `_vmaRustBuild` / `_vmaBuildInput`, Tauri `vma_build`; a Rust ugyanazt a PRG-t, memórianézetet (`_memoryUsageOf`), szegmenseket és kulcsos, `tf`-fel fordított hibákat adja; a Kick projektek is a VMA-n át fordulnak, extra kimenetek `raw` módban). **A VMA külön repóban**: `github.com/zstarczali/VMA` (GPLv3, 2.0.0, angol + magyar nyelvi kézikönyv, CLI), a `src-tauri` git függőségként húzza; tesztek `VMA_DIR` / `VMA_BIN`; About: VMA verzió (`get_vma_version`, `build.rs` a `Cargo.lock`-ból) és logó (`assets/vma-banner.png`, `.about-compilers`), „Ultimate Basic compiler version” címke. **Projekt VMA szimbólumok / konstansok** (Projekt beállítások `.define` / `.const` → `.proj`, a forrás elé kerülnek sor-térképpel). **Fordítás ablak lépéssor** (`setWorkStep`, `.work-progress-step`, `step*` i18n). **Build info**: fájl útvonal (`buildInfoFile`), ACME nézet a valódi ACME buildből, mellékattintásra nem zárul, nem jelölhető. **ACME lazy panelek** (Disassembly / Monitor buildenként egyszer, `.is-stale`). **Nagy Kick projektek gyorsítása** (`_kickPrepare` gyorsítótár, darabolt disassembly), projektfa Fel / Le (`_projMoveEntry`), a `{K}` gomb megszűnt (Projekt beállítások). Javítások: forrásfájl mentése szövegként (nem JSON), verziókezelési snapshot `kind: "source"`, makró-paraméterek (könyvtári makró mezői, hívásonként egyedi IF / WHILE / REPEAT címkék, `'A'` argumentum), mozgatható dialógus mentett pozíciója nyitás előtt. Customer message `id` = `vma-267`.
Korábbi 2.6.6 változások: **SID_PLAYER makró** (`.sid_player [song][, raster]`, `isSidPlayerMacro`, `_sidPlayerBytes` / `_SID_PLAYER_SIZE` = 58 byte; SEI, `JSR SID_INIT` a subtune-nal, CIA1 IRQ ki, `$0314/15` → beépített handler, `$D012`, `$D01A`, CLI, átugrás; handler `ASL $D019`, `JSR SID_PLAY`, `JMP $EA31`; Blokk módban Song / Raster mező, Expert kiemelés + kiegészítés, paletta; hibák `compileSidPlayerNoSid` / `NoPlay` / `Song` mind a 7 nyelven; `tests/sid-player-macro.test.js` mini6502-vel, golden eset `macro-SID_PLAYER`). **SID címkék**: a `.sid` blokk `SID_LOAD` / `SID_INIT` / `SID_PLAY` címkét ad (`addLayoutLabels`, egyedi címnél eltolva; play cím nélkül nincs `SID_PLAY`). **Csak Expert mód** projektenként (`#ps-no-blocks` → `.proj` `noBlockMode: true`, `_projBlockModeOff`, `_projHasFile`, `_blockModeBlocked`: a projekt fájljain a blokk mód zárva, méretre való tekintet nélkül; i18n `psNoBlockMode` / `projBlockModeOff`). **SID Player puffer** (Beállítások → SID előnézet `#sid-player-buffer`, `c64va-sid-player-buffer`, `_sidPlayerBufferSize` / `_sidPlayerAheadSeconds` — függvény, nem const tábla, mert a Beállítások dialógus a deklaráció előtt olvassa (TDZ); WebSID `setProcessorBufSize` 2048–16384 a `_webSidInit`-ben, újraindítás után; VA SID Core előretöltés 10 / 15 / 20 / 30 s; i18n `sidPlayerBuffer*`). **Egyéni C64 paletta** (`#editor-palette` `custom` + `#editor-palette-edit` → `#palette-editor-dialog`, `openPaletteEditor` / `setupPaletteEditor`, `_C64_PALETTES.custom` a `c64va-custom-palette`-ből (16 RGB, `_palIsValid`), import `_palParseText` (GIMP .gpl, VICE .vpl, hex lista) / `_palParseAct` (Photoshop .act), export `_palToAct` / `_palToVpl`; a Hi-Res PNG-import is választhatja; i18n `editorPaletteCustom` / `editorPaletteEdit` / `palEd*`; `tests/custom-palette.test.js`). Megjelenés: a memóriapanel összecsukva dokkol vissza (`_memSetDetached`); a What's New / update / Beállítások / Knowledge Base ablak az About-box keretét kapta (világos témákon erősebb); a Projekt beállítások checkboxai `.menu-checkbox-label` kapcsolók. Javítások: hibabejelentő képek data URL-lel (`_bugShrinkImage`; a release CSP `img-src`-jében nincs `blob:`), a splash `READY.` kurzor CSS doboz (`.splash-cursor`, 0,875 em; a `█` glif vonalakat mutatott macOS-en), `writingsuggestions="false"` az Expert / UB szerkesztőn és a kód-mezőkön (macOS inline prediktív szöveg). Customer message `id` = `sid-player-266`.
Korábbi 2.6.5 változások: **Kick projekt import** (Program menü `#import-kick-project` → `importKickProject`): KickAssembler forrásfa (`#import`, `.import binary`) → `.proj` a fő fájl mellett (`kick: true`, a források helyben); minden build előtt `_kickPrepare` → `_kickPreprocess` (`_kickFlatten`, `_kickParseTree`, `_kickEval`, `_kickEmit`: `.for` / `.var` / `.eval` / `.if` / `.function` / `.macro {}`, `!` többszörös címkék, `.pseudopc`, `BasicUpstart2`, `cmdLineVars`; a konstansok számmá hajtva, zp/abs érték szerint) → VMA forrás → `parseExpertText`; belépő `_kickOrVaPrg`, hibák `fájl:sor` (`_kickMapResult`, `_kickGotoError`), szerkesztés közben `_kickScheduleCheck`; a Dark Chambers C64 port bájtra azonos a KickAss 5.25-tel; teszt `tests/kick-project.test.js` (fixture `tests/fixtures/kick-project/`, app-betöltő `tests/helpers/load-app.js`). Kapcsoló: projektpanel `#expert-project-kick-btn` (`_kickToggleProject`, `_kickSyncProjectButton`, VMA módban; i18n `projKick*`) bármely VMA projektet Kick-kompatibilissé tesz; a VA makrók / direktívák (`.macro név(p)` … `.endm` törzse nyersen, `{p}` helyőrző nem blokk, ismeretlen direktíva `passFold`-dal) a VMA-hoz mennek, a `.include` / `.incbin` / `.sid` a `reload*Blocks`-szal töltődik. Scope-ok: `_kickNewLabelScope` / `_kickResolveLabel` / `_kickMarkLabelScopes` (a `{ }`, `.if`, `.for` köre, makróhívás, `.namespace` saját scope; a gyökér címkéi változatlan nevűek, a belsők `__név__címke` VA-címkék; `.filenamespace` → `.namespace … { }` a `_kickFlatten`-ben). Pszeudo-utasítások (`.pseudocommand`, `_kickCmd` / `_kickCmdText`, `_KICK_ARG_TYPES`), `#define` / `#if` (`_kickPreprocessorTrue`), List / Hashtable / struct / string (`_kickMethod`), `.enum`, `.define név { }`, `.error` / `.errorif`, `.print` → `messages`; a VA `opcodeMap.NOP` megkapta az illegális immediate / zp / abs módokat. Mellékjavítás: `.byte` / `.word` címke-kifejezés (`<(címke+1)`) nem nagybetűsödik / nem lesz 0 (`_importDetectListBase`, `parseByteMacro`, `parseWordMacro(…, labels)`). **Projekt beállítások** (`#project-settings-dialog`, `openProjectSettings` / `_projSettingsSave` / `_projSettingsSync`; gomb `#expert-project-settings-btn`, menü `#menu-project-settings`; i18n `projectSettings`, `ps*`): név, indítófájl, assembler, Kick-kompatibilitás, `kickDefines` / `kickVars` a `.proj`-ban (`_projKickFields`, `_projParseKickVars`) → `_kickPreprocess(…, { defines, vars })`. Kick `LoadBinary` (`_kickLoadBinary`, template-ek, `BF_*`), `LoadSid` (`_kickLoadSid`), a `.fill` kibontáskor értékelődik ki, `* = cím "név" virtual` (az emitben `virtualBlock`); a forrásfa-olvasó a `Load*` fájlokat is előre beolvassa; a KickAss mind a 11 kódot tartalmazó példája bájtra azonos. Teljes Kick-nyelv (a 2.6.5-ön belül később): `LoadPicture` (GIF saját dekóderrel `_kickDecodeGif`, PNG / JPG a WebView `createImageBitmap`-jével `_kickDecodePicture`; `_kickLoadPicture`, `getPixel` / `getSinglecolorByte` / `getMulticolorByte`, alapértelmezett színtábla a megjelenés sorrendjében; a forrásfa-olvasó minden képkiterjesztésű sztringet előre dekódol, `options.readPicture`); szegmensek (`.segmentdef` / `.segment` / `.segmentout` / `.file` / `.disk` / `.memblock`: a kiterjesztés jelölőket ad, az `_kickEmit` kimenetenként (`plans`: Default + `.file` / `outPrg` / `outBin` / `.disk`) újrarendez; a kimenet szegmensei valódi blokkok, a többi virtuális (`segVirtual`); `start` / `startAfter` + `align` / `min` / `max` / `fill` / `fillByte` / `prgFiles` / `sidFiles` / `modify="BasicUpstart"` + `_start`; start nélkül $2000; `pre.outputs`, `pre.mainOutput` (üres Default-nál az első PRG, előbb a $0801-es); `_kickBuildOutput` (nyers PRG / BIN), `_kickWriteOutputs` a Build projectben (D64: `d64Format` + `d64AddFile`)); forrás-sorrend szerinti címkeszélesség (`pseudoOrder` / `pseudoValue`: később definiált címke 16 bites, `{ sym, label: "$hhhh" }`); `* - címke` konstansban rejtett `__pc_N` címkével (`_KICK_PC_IN_EXPR`); `.fillword`, `.lohifill` (`lohiLabel` → `név.lo` / `név.hi`); `.im` / `.i` utótag; `.cpu` (`_KICK_CPU_OPS`: 65c02 / DTV / ANC2 / SBC2, `cpuInstruction` → `.byte`, ágak rejtett `__rel_N` címkével; `_KICK_ILLEGAL`); `.break` / `.watch` (rejtett `__brk_N`, `pre.breaks` / `pre.watches` → .vs `break` / `watch` sorok és `.dbg` Breakpoints / Watchpoints, `_kickDebugMarks`; a Debug töréspontjai is); `Vector` / `Matrix` (`_kickVector`, `_kickMatrix`, `_kickMatMul`, `_kickMatVec` (w-vel oszt), `_kickRotation` = Rz·Ry·Rx, `_kickValueText`); `getNamespace()` (`nsName`, gyökér `<RootNS>`); `.asserterror` (kifejezés) és kód-assert (`assertcode` csomópont, al-`_kickEmit`; eredmény `.print`-üzenet); boolean aritmetika hiba; `.modify` / `.filemodify` csak üzenet. App: debug-forrástérkép (`_kickBuiltProject`, `_kickDisplayLabel` (rejti a `__ml_` / `__pc_` / `__brk_` / `__rel_` címkéket), `_buildDebuggerSidecarTexts(…, kick)`, `_kickBreakpointAddresses`: minden nyitott projektfájl töréspontja fájl:sor → cím); Disassembly / Monitor a `_kickLast.program`-ból (`kickBuildFirst`), peephole `_kickLintHints`; kiemelés `_expertHighlightKickLine` (`_kickHighlightActive` gyorsítótárral, `;` zárójelen belül nem megjegyzés), kiegészítés `_KICK_DIRECTIVES` / `_KICK_PREPROCESSOR` / `_kickFunctionNames`; üzenetfordítás `_KICK_MESSAGE_KEYS` / `_kickMessageText` a `_kickErrorEntry`-ben (`kickMsg*` mind a 7 nyelven), `.print` az állapotsorban (`kickBuildOkPrint`). VA: minden NMOS illegális opkód minden módja + `SHA` / `SHX` / `SHY` / `TAS` / `LAS` / `XAA` (paletta + 7 nyelvű leírás), aliasok `_OPCODE_ALIASES` (a `_REV_OP` kihagyja őket); a csupasz makróhívás-felismerés nem nyeli el a `DCP ($12,X)` alakot; a peephole „újratöltés” I/O-regiszterre ($D000–$DFFF) nem jelez. Tesztek: `tests/kick-project.test.js` (szegmens / kép / cpu / vektor / kiemelés / debug), fixture-ök `tests/fixtures/kick-features/` (`*.kickass.prg` referenciák), `tests/peephole-lint.test.js`; a `gen-opcode-matrix` golden eset frissítve. **Build Info** (`showBuildInfoDialog`, async): Kick projektben a `_kickPrepare` fáját fordítja (hibák `fájl:sor`, konstansok a `kick.constants`-ből, `.print` = `kick.messages`, belső címkék `scope.címke` alakban); elrendezés: csempék (`.build-info-stats`), szegmensek, hibák / `.print` lista (`.build-info-list`), címkék / konstansok / makrók rácsban (`.build-info-grid`, `makeGrid`); i18n `buildInfoSegments` / `buildInfoPrint`. **C64 színpaletta** (Beállítások → Általános → Szerkesztők `#editor-palette`, `_C64_PALETTES` / `_C64_PALETTE_NAMES`, `_setEditorPalette` a `_CE_COLORS`-t helyben tölti újra, `c64va-editor-palette`; alapértelmezés Colodore, még Pepto / VICE / Deekay / C64 Wiki; a Hi-Res PNG-import `_hgPngPalette`). **Színválasztó** (`picker` eszköz, Alt+kattintás): Hi-Res (`_hgSelectColor`, `_hgPrevTool`), Sprite (`_spPrevTool`, színhely), Karakter (csak multicolor, `_cePrevTool`), Charset Canvas (`_ccPrevTool`, `_ccPickColor`); i18n `hgToolPicker`. **Ctrl+görgő zoom** a csúszkás szerkesztőkben: `_bindCtrlWheelRange(wrap, range)` (Hi-Res, Sprite, Map, Level; a kurzor alatti pont marad; `tests/editor-zoom-wheel.test.js`). **ACME memóriapanel** az ACME listából (`_acmeMemoryUsage`, `_acmeRowSpan`, `_acmeRowLabel`; átfedés = két forrássor írja ugyanazt a címet; ACME-ben mindig van automatikus fordítás). ACME projekt az indítófájl forrását fordítja (`_expertGetStartupSource`). ACME sablon-fül csak beállított ACME mellett (`_acmeAvailabilitySync`); ACME projekt létrehozása menti az ACME módot. Menü: a „New … project” gombok megszűntek, a `#menu-new-from-template` a „New project” fejléc alá került. Hi-Res: `#hg-raster` a Grid mellett, `#hg-zoom-val` megszűnt. `ubOpenSource` = „.ub fájl betöltése” mind a 7 nyelven. A VA `opcodeMap.NOP` megkapta az illegális immediate / zp / zp,X / abs / abs,X módokat. Customer message `id` = `kick-265`.
Korábbi 2.6.4 változások: **ACME assembler mód** (`assemblerSyntax` = `kick` (VMA) | `acme`; Beállítások → Általános `#assembler-syntax`, ACME útvonal `#acme-path` / `#choose-acme` (Rust `choose_acme_executable`, `build_acme_prg`); csak szöveges (Expert) mód: a Blokk/Expert kapcsoló zárolt, a Tutorial gomb (és az utána álló elválasztó) rejtett (`_acmeBuildButtonSync`, `acmeNoBlockMode`; `openTutorialDialog` → `acmeNoTutorial`); `#expert-acme-build-btn`, `_buildAcmePrg` (Run / Save PRG / D64 a `buildRunPrgForCurrentMode`-on át), `_acmeBuildPreview` / `_acmeScheduleAutoBuild` (Disassembly / Monitor panel vagy ciklus-gutter mellett), `_acmeParseErrors` → fordítási hiba dialógus; ACME report (`-r`) → ciklus-gutter + peephole tippek (`_acmeReportKinds` …), VICE Monitor `_vmAcmeBuild` (hot reload csak a ténylegesen írt tartományokra, watch / profiler ACME címkékkel); szerkesztő-exportok ACME forrásként (`_acmeFromVaAsm`, `_acmeInsertExport`, `; >>> tag` / `; <<< tag`); kiemelés `_expertHighlightAcmeLine`, kiegészítés `_AC_ACME_DIRECTIVES`; VMA direktíva ACME-ben / `!` direktíva VMA-ban hiba (`_acmeVaSyntaxErrors`, `vmaAcmeDirective`); debug fájlok ACME-ben `.sym` + `.vs` az ACME címkelistájából (`_acmeDebuggerSidecars`, `.dbg` nincs), a Debug (RetroDebugger) és a Build project is ACME-vel fordít (`_acmeDebuggerTargets`: címkék + Expert breakpoint-sorok a report alapján; `_buildProjectAsmTarget` ACME-ága); `.proj` `assemblerSyntax` (`_projAssemblerSyntax`); Beállítások három fülön (`#hw-settings-tab-general` / `-files` / `-integrations`); `tests/acme-analysis.test.js`, `tests/acme-highlight.test.js`; referencia `ACME-0.97-reference.md/pdf`). **Kick import** (`#import-asm`, `importAsm` = „Kick import”): `.text "…"` → BYTE (`_kickTextBytes`, `kickEncoding` állapot a `parseExpertText`-ben, `.encoding` sor → COMMENT, az eredeti sor `inlineComment`, hiba `kickTextBadChar`), `.label NÉV = * ± N` → LABEL `labelOffset` (`addLayoutLabels`, debugger szimbólum, `_blockToExpertLine`, ASM nézet), `.abs` / `.zp` mnemonik-utótag (`_importMakeInstruction` `forcedMode`, `forceZeroPage`); Restore64 forrásokon bájtra azonos a KickAssemblerrel. **Autostart a BASIC stub alatt** (`_buildAutostartPrgCore` a kép valódi betöltési címét használja; `_buildRelocatingLoader`: kis kép eltolva + lemásolva, nagy kép a helyére töltve, a stub + indító + másoló alá eső fej egy nullás futamban utazik; másoló `$033C` / `$0120`; hiba `autostartImageOverlapsStub`; a `getProgramLayout` override csak a `$0800`–`$0810` stub-ORG-ot emeli fel). **Exomizer** `sfx basic` (BASIC sorral kezdődő PRG) / `sfx $<cím>` (`crunch_with_exomizer`): nincs `?SYNTAX ERROR` a második RUN-nál. **SID szerkesztő**: lejátszási LCD a tracker eszköztár végén (POS / PAT / ROW / TIME, `sidLcd*`, szín: Beállítások → SID előnézet → `#sid-lcd-color`, `c64va-sid-lcd-color`, `_sidLcdApplyColor`), VA-VK hangszer-gomb LCD-vel (`sidVkbdInstrument*`), `.sid` import folyamatjelző (`sid-dump-progress` esemény). **Ctrl+N** új fül (`_tabNew`, modális dialógus alatt nem). **Dialógus-szöveg nem jelölhető ki** (`dialog { user-select: none }` a `style.css`-ben; kivétel a mezők és a másolható kimenetek: `.compile-error-list`, `#build-info-content`, `.vc-output`, `.vc-diff-body`, `.template-preview`, `#bug-sysinfo-preview`, `.support-msg-text`, `.tg-preview`, `.ce-asm-out`, `.vm-prof-out`). ACME dump-forrás (`_acmeLowestOrigin` < `$0801`): nincs stub és `$0801 → $080D` eltolás, a kép a saját címein fordul, a Futtatás `_buildRelocatingLoader`-t tesz elé (`imageBytes` = nyers kép; preview / VICE Monitor a nyerset kapja: `_buildAcmePrg(…, { preview: true })`); VMA-ban ugyanígy, ha van `$0801` alatti ORG (`hasLowerOrg` a `_buildAutostartPrgCore`-ban). A forrás hibáit (pl. Restore64 `!ct screencode`) a VA nem javítja. Tudásbázis: Restore64 link (`kbRestore64`). Customer message `id` = `acme-264`.
Korábbi 2.6.3 változások: **.sid import a SID szerkesztőben** (Files → `#sid-import-sid` → `#sid-import-sid-dialog`, Rust `sid_register_dump` / `SidFilePlayer::dump_registers`, `_sidDumpImport`: gate-él + legato hangok, L / L+1 frame-es sorok `F` effekttel, wave tábla a teljes hangból, lépésenkénti abszolút / relatív szavazás azonos hangszerformánál, teszt-bites frame = `$08` lépés, vibrato → hangszer-vibrato, gate → `C` / gate timer / S=0,D=R, max 128 hangszer; `tests/sid-dump-import.test.js`). **Hosszú dal adata `$A000` alá** (`_SID_PLAYER_CODE_MAX`, `_sidExportAsmPlayable.dataOrg`, a PSID export onnan vág). **VA SID Core előnézet újragate** (26. bájt = újraindított voice-ok, `_sidVaCoreFrame`, Rust `write_preview_frame`: ADSR előbb, ctl utoljára). **Közös wave tábla tárolás** (`_sidTuneData`). SID szerkesztő: fejlécben az emuláció (`#sid-engine-name`, `_sidEditorEngineSync`), Speed − / + (`#sid-speed-down/up`, 1–255), BPM címke javítva. **UltimateBasic 1.6.6** (`Cargo.lock` → `17b7d7c`): PRINT USING, sztring-összehasonlítás, lebegőpontos rnd / mod, `option basic print` (`CompileOptions.basic_print`, a VA `false`-t ad, a program maga kapcsolhatja be), UB kiemelés `print using` / `option basic` (`_UB_CONTEXT_KEYWORDS`, `option` a `_UB_KEYWORDS`-ben). **Update szerver a Beállításokban** (`#update-server`, `loadUpdateServer` / `_saveUpdateServer`; Rust `get_update_server` / `set_update_server`, config `updateServer`, `normalize_update_server`: https, http csak localhostra, `/`-re végződik; az oldal- és letöltési URL-ek `<szerver>` + `downloads/VA/`, alapérték `UPDATE_SERVER_DEFAULT`). **Kiadás csak a támogatóknak vagy mindenkinek** (`register/release.php`: TO SUPPORTERS / TO EVERYONE / ROLL BACK; `VA_UPDATE_SUPPORTER_SETTING` = `update_supporter_version`, `vaUpdateApproved($db, $supporter)` sosem régebbi a mindenkiénél; `downloads/VA/index.php?sup=1`; az app `check_for_update` `?sup=1`-et küld, ha `is_supporter` — jelző, nem zár; a `download.php` mindig a mindenkinek kiadott verziót adja). Customer message `id` = `sid-import-263`.
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
