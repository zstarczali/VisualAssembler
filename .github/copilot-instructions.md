# Copilot Instructions — C64 Visual Assembler

## Mi ez a projekt?

Tauri 2-alapú asztali alkalmazás, amely Commodore 64 6502 assembly programok vizuális,
drag-and-drop szerkesztését teszi lehetővé. Nincs UI-framework — csak Vanilla JS, HTML, CSS.
Backend: Rust (Tauri 2), frontend: Vanilla JS/HTML/CSS.

---

## Fájlszerkezet

| Fájl | Szerep |
|------|--------|
| `app.js` | Teljes renderer logika (~8 500 sor): mnemonik könyvtár, UI, ASM/monitor generálás, makró expanzió |
| `index.html` | Egyetlen HTML lap; összes UI elem és két `<template>` (block-template, palette-item-template) |
| `style.css` | Teljes stíluslap; CSS custom properties-alapú téma (dark/light) |
| `tauri-bridge.js` | `window.electronAPI` shim — Tauri invoke hívásokat térképez az app.js felé |
| `src-tauri/src/lib.rs` | Tauri backend: VICE/RetroDebugger indítás, fájlmentés/betöltés, SID parse, config |
| `src-tauri/tauri.conf.json` | Tauri konfiguráció, verzió, build targets |
| `package.json` | dev/build scriptek; Tauri CLI |

---

## Kódolási konvenciók

- **Nyelv:** JavaScript (ES2022+, nincs TypeScript, nincs build step a rendererhez)
- **Szintaxis:** `const`/`let`, arrow functionök, template literals, `crypto.randomUUID()`
- **Nincs:** class keyword, import/export (mindent globálisan kezel egy script tag), npm bundler
- **Kommentek:** csak ahol a logika nem egyértelmű; ne kommentáld a triviális sorokat
- **Fordítás:** `translations.hu` és `translations.en` objektumokban; `t(key)` / `tf(key, values)` segédfüggvényekkel; mindig add hozzá az új szövegeket mindkét nyelvhez
- **Mnemonik leírások:** magyar → `mnemonicLibrary[category][i].description`, angol → `mnemonicDescriptionsEn[mnemonic]`

---

## Program adatmodell

Minden blokk (`program[]` tömb eleme) egy plain object:

```js
{
  id: crypto.randomUUID(),       // egyedi azonosító
  category: "Ugrasok",           // mnemonikLibrary kulcs
  mnemonic: "RTS",               // nagybetűs mnemonik string
  operand: "",                   // megjelenített operandus (pl. "#$FF")
  rawOperand: "",                // nyers felhasználói input
  description: "...",            // aktuális nyelven megjelenített leírás
  addressingMode: "implied",     // kulcs az addressingModes-ból
  base: "hex",                   // "hex" | "dec" | "text" | "bytes" | "string"
  validationError: "",           // ha nem üres, a blokk hibás
  // opcionális mezők makrókhoz:
  isTextMacro: true, textX: 0, textY: 0,
  isStringMacro: true, stringAddress: "C000",
  isDataMacro: true, dataAddress: "C000",
  isByteMacro: true,
  isLoopMacro: true, loopReg: "X",  loopCount: "0A", loopLabel: "loop1",
  isNextMacro: true, nextLabel: "loop1", nextReg: "X",
  isLabel: true, labelName: "loop",
  isComment: true, commentText: "...",
  isConstMacro: true, constName: "SCREEN", constValue: 1024,
  // rawOperand tárolja az értéket a blokk aktuális base-ében (pl. "0400" hex-ben)
  // constValue numerikus érték (mindig decimálisan), constName az identifier
  // CONST blokkok felkerülnek a label-táblába assemblelésnél → hivatkozható operandusként
}
```

---

## Mintaprogram sorrend — TEXT példa

A `loadTextSampleProgram()` helyes sorrendje:
1. `SEI` — megszakítások tiltása
2. `TEXT` blokk(ok) — szöveg kiírása KERNAL CHROUT-on keresztül
3. `RTS` — **mindig az utolsó blokk**; szubrutin visszatérés

> **Fontos:** Az RTS-t soha ne tedd a TEXT makrók elé — azok utána kerülnek a kódba.

---

## Makró expanzió

A `TEXT` makró `compileLineBytes()` híváskor fejlődik ki:
- Direkt screen RAM írás: karakterenkénti `LDA #$screenCode` + `STA $0400+offset` párok
- Koordináta: `textX`, `textY` mezőkből számított `$0400 + (textY * 40) + textX` kezdőcím
- `encodeTextMacro()` → screen code-okba konvertál (nem PETSCII, nem KERNAL CHROUT!)
- Az ASM nézetben deferred `.byte` szekció jelenik meg a kód alján (csak vizuális)

A `STRING` makró: szöveg karakterenként C64 screen code-ban, megadott abszolút memóriacímre (`stringAddress`, pl. `"C000"`). Deferred `.byte` szekció az ASM nézetben + inline kód a memóriatérképen.

A `DATA` makró: nyers byte-ok (`$FF, 169, 0x1A` formátumban), megadott abszolút memóriacímre (`dataAddress`, pl. `"C000"`). Minden byte → `LDA #$xx` + `STA $addr+offset` pár az inline kódban; a raw byte-ok deferred szekciókban is megjelennek.

**Address input dispatch pattern:** A `.macro-address` inputon `data-address-field` attribútum mondja meg, melyik blokk-mező frissüljön (`"stringAddress"` vagy `"dataAddress"`). Egy event listener kezeli mindkét típust (`macroAddressInput.dataset.addressField`).

A `SPRITE_INIT` makró (`isSpriteInitMacro: true`): mezők: `spriteNum` (0–7), `spriteColor` (0–15 dec), `spriteDataPage` (hex byte, pl. `"21"` = $0840). Generál: `LDA #page; STA $07F8+N` (pointer), `LDA $D015; ORA #bitN; STA $D015` (engedélyezés), `LDA #color; STA $D027+N` (szín). Méret: 18 byte.

A `SPRITE_POS` makró (`isSpritePosMacro: true`): mezők: `spriteNum` (0–7), `spriteX` (0–319 dec), `spriteY` (0–255 dec). Generál: `LDA #xLow; STA $D000+N*2`, `LDA $D010; [ORA|AND] #mask; STA $D010` ($D010 bit kezelés X>255 esetén), `LDA #y; STA $D001+N*2`. Méret: 18 byte. **Statikus pozicionálás** — animációhoz INC/DEC $D000 kell, mert az LDA #imm fordítási időben sül bele a kódba.

A `WAIT_RASTER` makró (`isWaitRasterMacro: true`): mező: `rasterLine` (hex byte, pl. `"FF"`). Inline busy-wait: `LDA $D012; CMP #rasterLine; BNE $F9` (= -7, visszaugrik saját LDA-jára). Nincs JSR, nincs label. Méret: 7 byte. `getInstructionSize` = 7.

A `JOYSTICK` makró (`isJoystickMacro: true`): mezők: `joyPort` (`"1"` = $DC01, `"2"` = $DC00), `joySpriteNum` (0–7). Generál: `LDA port`, majd 4× irányonként (UP/DOWN/LEFT/RIGHT): `LSR; BCS +3; DEC/INC $D001/D000` (3 byte-os DEC/INC abs). BCS +3 ugorja át a DEC/INC-et ha az iránygomb NEM lenyomott (active-LOW: bit=0 → lenyomott). Méret: 27 byte. CIA regiszterek: Port 2 = $DC00, Port 1 = $DC01. Bitek: 0=Up, 1=Down, 2=Left, 3=Right, 4=Fire.

A `SPRITE_COL` makró (`isSpriteColMacro: true`): mezők: `spriteNum` (0–7), `colType` (`"sprite"` = $D01E sprite-sprite, `"background"` = $D01F sprite-háttér). Generál: `LDA $D01E/$D01F; AND #(1<<N)`. Eredmény A-ban: nem nulla = ütközés. **Regiszter olvasása automatikusan törli!** Utána `BEQ`/`BNE`-vel ugrás. Méret: 5 byte.

A `LOADFILE` makró (`isLoadFileMacro: true`): fájl betöltése D64-ről KERNAL rutinokkal (SETNAM/SETLFS/LOAD). Inline kód, deferred section nélkül.
- **Mezők:** `loadFileName` (string, max 16 ASCII karakter, automatikus uppercase, `, " / \ : * ? < > |` szűrve), `loadFileDevice` (8–30, default `"8"`), `loadFileAddress` (opcionális hex pl. `"C000"`, üres = a fájl saját load címe sec=1-gyel; kitöltve = override sec=0-val), `loadFileErrorLabel` (opcionális label név; ha kitöltve `BCS errorLabel` a JSR LOAD után).
- **Generált kód layout:**
  ```
  base+0:  4C lo hi      ; JMP skip_filename (3 byte)
  base+3:  filename bytes (PETSCII, A-Z = $41-$5A = ASCII)
  skip:    A9 L          ; LDA #length
           A2 lo / A0 hi ; LDX/LDY = fname pointer
           20 BD FF      ; JSR $FFBD (SETNAM)
           A9 01         ; LDA #1 (logical file)
           A2 dev / A0 sec
           20 BA FF      ; JSR $FFBA (SETLFS)
  ; if override (sec=0): A2 lo / A0 hi (LDX/LDY override addr)
           A9 00         ; LDA #0 (LOAD, not VERIFY)
           20 D5 FF      ; JSR $FFD5 (LOAD)
  ; if errorLabel: B0 off (BCS errorLabel; offset = label - (here+2))
  ```
- **Méret:** `3 + fnLen + 9 (SETNAM) + 9 (SETLFS) + (override ? 4 : 0) + 5 (LDA#0+JSR LOAD) + (errorLabel ? 2 : 0)` — minimum 27 byte (1-char fájlnév, opciók nélkül).
- **PETSCII match:** A `c1541 -write … name` által írt fájl neve uppercase PETSCII-ben kerül a D64-re ($41-$5A); a SETNAM is azt vár → match. Egyéb karakterek (filename-tiltottak) szűrve.
- **BCS hatótáv:** ±127 byte. Ha messzebb, fordítási hiba: `LOADFILE: a hiba cimke tul messze van`.
- **UI:** HEX/DEC toggle és addressing mode select **el van rejtve**. Kétsoros macro-grid: filename + device | address + errorLabel.

A `REGION` / `ENDREGION` blokk (`isRegionMacro: true` / `isEndRegionMacro: true`): vizuális csoportosító, **0 byte**, a program logikájára nincs hatása.
- **Mezők (REGION):** `regionName` (string, szabad szöveg, pl. `"init"`)
- **`regionCollapsed`** (bool): ha true, a REGION és ENDREGION közötti blokkok rejtve vannak a program listában, a REGION saját body-ja is becsukódik (`collapsed = regionCollapsed`)
- **DOM struktúra:** REGION blokk → `div.region-wrapper` (ha nem collapsed) → gyermek blokkok → ENDREGION blokk. A wrapper `border-left` adja a vizuális vonalat.
- **`toggleRegionCollapsed(index)`:** ha a wrapper már létezik a DOM-ban (összecsukás), direkt DOM manipulációval frissíti (nincs teljes `renderProgram()`); ha kiterjesztés és nincs wrapper, `renderProgram()` fut.
- **`updateProgramBlock` `regionName` ágban** early return van (`renderBlockPreview` + `renderAsmOutput`), hogy ne hívódjon `renderProgram()` és ne vesződjön el a fókusz szerkesztés közben.
- **ASM output:** `; ===[ regionName ]===` … `; ===[/regionName]===` (az ENDREGION visszakeresi a szülő REGION nevét `layout.lines`-ban visszafelé keresve)
- **`getInstructionSize`:** 0 — kötelező explicit kezelni, mert különben a `addressingMode === "implied"` ág 1-et adna vissza
- **Fészkelhetők** (syntax sugar): második REGION az első ENDREGION előtt egymásba ágyazott régiót alkot; minden ENDREGION a legközelebbi lezáratlan REGION-t zárja le; az assembly outputra nincs hatás
- **ENDREGION blokk:** megjeleníti a párosított REGION nevét read-only mezőként (visszafelé keres `program[]`-ban)
- **REGION blokk gombjai (renderProgram-ban):**
  - **⊡ Expand all** (`region-expand-all-btn`): kinyitja a régiót (ha zárva), majd minden gyermekblokk `collapsed = false` → `renderProgram()`
  - **⦵ Select in ASM** (`region-select-asm-btn`): megkeresi a párosított ENDREGION-t (depth-aware előre keresés `program[]`-ban), összerakja a `{ firstLine: asmBlockRanges[block.id].firstLine, lastLine: asmBlockRanges[endRegionBlock.id].lastLine }` tartományt, ASM tab-ra vált ha szükséges, majd ideiglenes `"__group_range__"` kulcson keresztül hívja `applyAsmHighlight()`-ot a teljes régió kiemelésére

A `LOOP` makró (két blokk rendszer):
- **LOOP blokk** (`isLoopMacro: true`): mezők: `loopReg` (`"X"` vagy `"Y"`), `loopCount` (hex byte pl. `"0A"`), `loopLabel` (string). Generál: `LDX/LDY #count` (2 byte), majd a label a `address+2`-re mutat (a body elejére). Az auto-label `loop1`, `loop2`… ha `loopLabel` üres.
- **NEXT blokk** (`isNextMacro: true`): mezők: `nextLabel` (párosított LOOP label neve), `nextReg` (auto-derive: a legközelebbi matching LOOP-ból). Generál: `DEX/DEY` (1 byte) + `BNE label` (2 byte). BNE offset = `target − (address+3)`, -128..127 range check.
- `getInstructionSize`: LOOP=2, NEXT=3
- Inserteléskor (`insertBlock`): LOOP-hoz auto-label, NEXT-hez auto-kitöltés a felette lévő LOOP alapján.
- HEX/DEC toggle és addressing mode select el van rejtve LOOP/NEXT blokkoknál.

---

## RAWBYTES / RAWTEXT makrók és PRG assembly

### Makró kódolási összefoglaló

| Makró | Kódolás | Runtime kód | Adat elhelyezés |
|-------|---------|-------------|-----------------|
| `TEXT` | screen code → LDA/STA screen RAM | ✅ inline | screen RAM $0400+ |
| `STRING` | screen code → LDA/STA fix cím | ✅ inline | megadott cím |
| `DATA` | raw byte → LDA/STA fix cím | ✅ inline | megadott cím |
| `BYTE` | raw byte | ✅ inline (a kódba ágyazva) | inline |
| `RAWBYTES` | raw byte, **nincs runtime kód** | ❌ deferred | megadott cím |
| `RAWTEXT` | screen code, **nincs runtime kód** | ❌ deferred | megadott cím |

### RAWBYTES / RAWTEXT a PRG fájlban

`assembleProgramToPrg()` két fázisban dolgozik:
1. **Inline bytes**: az összes nem-deferred blokk sorban összerakva
2. **Deferred chunks**: RAWBYTES/RAWTEXT blokkok adatai → flat buffer-be töltve a megfelelő offset-en

Ha van deferred chunk, a függvény flat `Uint8Array` buffert épít az `origin`-tól a `maxAddr`-ig (gap = nullák), majd a result tartalmazza a teljes tartományt. A `buildAutostartPrgForEmulator` ezt a flat buffert fűzi a BASIC SYS stub után.

### KRITIKUS SPRITE SZABALY (NAGY SULLY)

**SPRITE adatot ne tarts BASIC kod inline BYTE blokkban, ha stabil pointert akarsz.**

Miért:
- BASIC SYS ON modban a futasi cim `$080D`, de a layout/ALIGN kontextus konnyen felreertheto (`*=$0801` miatt)
- ha egyetlen extra byte becsuszik (64 helyett 65), a kovetkezo sprite 1 byte-tal eltolodik
- sprite pointer (`$07F8+$N`) mindig `spriteAddress / 64` alapjan mukodik, azaz 64-byte hatar kotelezo

**KOTELEZO CHECKLIST sprite sample-hoz:**
1. Minden sprite pontosan **64 byte** (nem 63, nem 65)
2. Sprite cimek **64-byte alignmenten** legyenek (`addr % 64 == 0`)
3. `SPRITE_INIT.spriteDataPage` pontosan egyezzen a cimmel (`$2000 -> $80`, `$2040 -> $81`, `$0840 -> $21`)
4. Ha barmi eltolodas van, elso gyanusitott: elozo sprite byte-szama

**Erosen ajanlott minta:**
- `RAWBYTES` fix cimre (pl. `$2000`, `$2040`) a sprite adatoknak
- `SPRITE_INIT` page ugyanezhez igazitva (`80`, `81`)
- ne fuggjon a sprite adat pozicioja az inline kodhossztol vagy ALIGN paddingtol

**Collision/demo tipusu mintaknal ez legyen az alapertelmezett strategia.**

### FONTOS: `parseAddressValue` és a `rawBytesAddress` mező

**BUG-TRAP:** `parseAddressValue("0900")` → decimálisként értelmezi (= 900 = `$0384`), mert a `/^\d+$/` regex illeszkedik az összes digit-karakterre!

**Mindig `$` prefixet használj** az address mezőkben:
```js
rawBytesAddress: "$0900"   // ✅ helyes — parseAddressValue → 0x0900
rawBytesAddress: "0900"    // ❌ HIBÁS — parseAddressValue → 900 (decimal!)
```

### PETSCII vs ASCII CHROUT-nál

C64 KERNAL CHROUT (`$FFD2`) PETSCII karakterkódokat vár:
- **Nagybetűk** ($41–$5A): azonosak az ASCII-vel → `'H'=$48`, `'E'=$45` stb. ✅
- **Kisbetűk** ($61–$7A): C64 alapértelmezett módban grafikus karakterek, **NEM** `a`–`z`! ❌

**RAWBYTES/CHROUT kombóhoz mindig nagybetűs szöveget tárolj:**
```js
// "HELLO WORLD " = H=$48 E=$45 L=$4C L=$4C O=$4F ' '=$20 W=$57 O=$4F R=$52 L=$4C D=$44 ' '=$20
rawOperand: "48,45,4C,4C,4F,20,57,4F,52,4C,44,20"
```

RAWTEXT screen RAM-ba ír (`$0400+`), ott screen code-ok kellenek (nem PETSCII) — arra helyes a `toPetsciiCharCode`.

---



- `#basic-sys-toggle` checkbox a "Beallitasok" menüben
- **BE (alapértelmezett):** BASIC stub `$0801`-re kerül, kód `$080D`-n indul; `buildAutostartPrgForEmulator()` hívja a stub generátort
- **KI:** `assembleProgramToPrg()` — plain kód, stub nélkül; az origin érték (pl. `$0801`) megmarad
- `renderOriginPreview()` jelzi, ha BASIC SYS ON módban az origin figyelmen kívül marad
- `saveUiSettings()` / `applySavedSettings()`: `basicSys` mező mentése/visszatöltése

---

## Menü struktúra

```
Beallitasok
  ├── VICE exe + Edit gomb
  ├── Nyelv (combobox) + label
  └── BASIC SYS stub checkbox

Nezet
  ├── Téma toggle gomb
  └── Zoom vezérlők

[Check for Update gomb] → shell.openExternal → https://zstarczali.itch.io/visual-assembler-commodore-64
```

---

## Meglévő mintaprogramok

Aktuális sorrend az `index.html` `#sample-select` elemben (0-indexelt):

| Index | `sampleSelect.value` | Leírás |
|-------|----------------------|--------|
| 0 | `"basic-colors"` | Egyszerű border szín ciklus |
| 1 | `"label-border"` | Keret szín ciklus, cimkék bemutatása |
| 2 | `"text-demo"` | KERNAL CHROUT TEXT makró demo |
| 3 | `"macro-demo"` | STRING/DATA/BYTE/FILL/RAWBYTES makrók — fine scroll demo |
| 4 | `"sprite-demo"` | Sprite mozgatás (INC/DEC $D000, BASIC struktúra) |
| 5 | `"setpixel-demo"` | SETPIXEL szubrutin, vízszintes vonalak bitmap módban |
| 6 | `"bitmap-demo"` | Hires bitmap, 8 vonal JS Bresenham-mal; $2000-re igazított BYTE makró |
| 7 | `"macro-test"` | Új makrók tesztje |
| 8 | `"loop-demo"` | Nested LOOP X+Y delay, keret+háttér szín ciklus 0–15 |
| 9 | `"hello-loop-demo"` | LOOP Y $28 (40×), „HELLO WORLD 1"–„40"; ZP `$FB`/`$FC` digit számláló |
| 10 | `"push-pull-demo"` | PUSH/PULL regiszter védelem demo |
| 11 | `"if-else"` | DEFINE / IF / ELSE / ENDIF feltételes assembly demo |
| 12 | `"user-macro-demo"` | User MACRO / ENDM / INVOKE példa |
| 13 | `"incbin-demo"` | INCBIN makró demo |
| 14 | `"include-demo"` | INCLUDE makró demo |
| 15 | `"sid-demo"` | SID lejátszó — Ikari Warriors, IRQ-alapú, INCBIN |
| 16 | `"sid-direct-demo"` | SID lejátszó — SID makróval, INCBIN nélkül |
| 17 | `"sprite-macro-demo"` | SPRITE_INIT + SPRITE_POS + WAIT_RASTER demo; spritemate sprite balra-jobbra |
| 18 | `"joystick-demo"` | JOYSTICK makró demo; sprite #0 joystick port 2-vel mozog |

---

## Mintaprogramok hozzáadása

1. `loadXxxSampleProgram()` nevű függvényt adj hozzá `app.js`-ben
2. A `loadSelectedSample()` switch-ben adj hozzá egy `if` ágat az új `sampleSelect.value`-hoz
3. Az `index.html`-ben add hozzá a `<option value="...">` sort a `#sample-select`-be
4. A `translations.hu` és `translations.en` objektumokban add hozzá a `sampleXxx` kulcsot
5. A `applyTranslations()` függvényben frissítsd a `sampleOptions[N].textContent` sort

---

## Tauri IPC (tauri-bridge.js → lib.rs)

| Tauri command | Leírás |
|---------------|--------|
| `get_app_version` | Alkalmazás verzió lekérése |
| `set_title` | Ablakcím beállítása |
| `get_vice_config` / `choose_vice_executable` | VICE útvonal config |
| `launch_vice` | PRG temp fájl + VICE indítása |
| `get_debugger_config` / `choose_debugger_executable` | RetroDebugger útvonal config |
| `launch_debugger` | PRG + breakpoints + symbols fájl + RetroDebugger indítása |
| `launch_vice_debugger` | PRG + moncommands fájl + VICE monitor indítása |
| `save_prg` / `save_project` / `load_project` | Fájl I/O dialógusok |
| `load_sample` | Beépített minta projekt betöltése |
| `choose_incbin_file` / `choose_sid_file` | Bináris/SID fájl választó |
| `open_manual` | PDF kézikönyv megnyitása |

---

## Memóriatérkép referencia

| Terület | Cím | Megjegyzés |
|---------|-----|-----------|
| Zero Page | $0000–$00FF | Gyors RAM |
| Stack | $0100–$01FF | 6502 hardware stack |
| BASIC RAM | $0800–$9FFF | Program terület (alapértelmezett `*=$0801`) |
| BASIC ROM | $A000–$BFFF | BASIC interpreter |
| Free RAM | $C000–$CFFF | |
| VIC-II | $D000–$D3FF | Videó chip regiszterek |
| SID | $D400–$D7FF | Hangchip |
| Color RAM | $D800–$DBFF | |
| CIA1/2 | $DC00–$DDFF | Billentyűzet, joystick, timer |
| KERNAL ROM | $E000–$FFFF | OS rutinok; CHROUT = $FFD2 |

---

## Tipikus fejlesztési munkamenet

```bash
npm run dev        # Tauri dev futtatás (serve + tauri dev)
npm run build      # Tauri release build
```

### Mac DMG build ad-hoc aláírással

macOS Gatekeeper miatt az app-ot ad-hoc aláírással kell ellátni, különben "damaged" hibát dob telepítéskor:

```bash
# 1. Build alapértelmezett módon (identity: null)
rm -rf dist
CSC_IDENTITY_AUTO_DISCOVERY=false npx electron-builder --mac dmg --win nsis

# 2. Extended attributes törlése + ad-hoc aláírás
xattr -cr "dist/mac-arm64/C64 Visual Assembler.app"
codesign --force --deep --sign - "dist/mac-arm64/C64 Visual Assembler.app"

# 3. Új DMG létrehozása az aláírt app-pal
cd dist
hdiutil create -volname "C64 Visual Assembler" \
  -srcfolder "mac-arm64/C64 Visual Assembler.app" \
  -ov -format UDZO "C64-Visual-Assembler-1.1.0-signed.dmg"
```

Az `identity: null` a `package.json` `mac` szekciójában azért kell, hogy ne akadjon el a codesign verify phase-ben (OneDrive metadata problémák miatt).

Nincs hot-reload — változtatás után `npm start` újraindítás szükséges.

---

## C64 Bitmap Mode Referencia

### Hires Bitmap Mode Setup

```js
$D011 bit 5 = 1  → Bitmap Mode ON (BMM)
$D011 = $3B      → Standard érték (BMM on, display on, Y-scroll=3)
$D018 = $18      → Screen RAM at $0400, Bitmap at $2000
```

**KRITIKUS:** `$D018` bitjei:
- Bits 7-4: Screen RAM location / $0400
  - `$18` → %0001 → screen at $0400 ✅
  - `$08` → %0000 → screen at $0000 ❌ **ROSSZ - random színek!**
- Bits 3-1: Bitmap location / $2000
  - %100 → bitmap at $2000

### Memory Layout

**Bitmap:** $2000-$3F3F (8000 bytes)
- 320×200 pixels = 40×25 cellák (8×8 pixel/cella)
- Minden cella = **8 byte** (1 byte/sor)
- Cella tárolás: **ROW-MAJOR** (balról-jobbra, majd lefelé)

**Cella cím számítás:**
```
cellRow = Y / 8
cellCol = X / 8
cellIndex = cellRow * 40 + cellCol
cellAddress = $2000 + (cellIndex * 8) + (Y % 8)

EGYSZERŰSÍTVE:
cellAddress = $2000 + (Y/8)*320 + (X/8)*8 + (Y%8)
              ↑       ↑           ↑         ↑
              base    sor offset  oszlop    byte a cellán belül
```

**KRITIKUS HIBA:** row×**40** helyett row×**320** kell!
- Egy sor = 40 cella × 8 byte/cella = **320 byte**!

**Screen RAM:** $0400-$07E7 (1000 byte, 40×25 cella)
- Minden byte = színinformáció egy 8×8 cellához
- Bits 7-4: szín amikor bitmap bit = 1
- Bits 3-0: szín amikor bitmap bit = 0
- `$10` = foreground=1 (fehér), background=0 (fekete)

**Color RAM:** $D800-$DBE7 (1000 byte)
- **CSAK multicolor bitmap módban használt**
- **Hires bitmap módban IGNORÁLT!**

### Tipikus hibák

1. **Screen RAM nincs törölve a bitmap mode beállítása előtt**
   - Tünet: Random színek mindenütt
   - Fix: Fill screen RAM $10-zel (vagy $01-gyel) BITMAP MODE SETUP ELŐTT

2. **$D018 = $08 (rossz screen RAM cím)**
   - Tünet: Színek nem megfelelőek, mert $0000 környéki memóriát használ
   - Fix: $D018 = $18 (screen at $0400)

3. **row×40 lookup tábla (kellene row×320)**
   - Tünet: Képzavar, ferde rajzolás
   - Fix: Lookup tábla minden sorhoz row*320 értéket tároljon

### Setpixel algoritmus példa

```assembly
; Input: X=$FB (0-255), Y=$FC (0-199)
setpixel:
    TXA              ; Megőrzi a hívó X regiszterét
    PHA
    
    ; 1. Row offset: (Y/8) * 320 lookup táblából
    LDA $FC
    LSR : LSR : LSR  ; Y/8
    TAX
    LDA row320lo,X
    STA $FD
    LDA row320hi,X
    STA $FE
    
    ; 2. Column offset: (X/8) * 8
    LDA $FB
    LSR : LSR : LSR  ; X/8
    ASL : ASL : ASL  ; *8
    CLC
    ADC $FD
    STA $FD
    BCC +
    INC $FE
+   
    ; 3. Add bitmap base $2000
    LDA $FE
    CLC
    ADC #$20
    STA $FE
    
    ; 4. Add byte offset (Y%8)
    LDA $FC
    AND #$07
    CLC
    ADC $FD
    STA $FD
    BCC +
    INC $FE
+   
    ; 5. Get bit mask and plot
    LDA $FB
    AND #$07
    TAX
    LDA bitmask,X
    LDY #$00
    ORA ($FD),Y      ; indirectY addressing
    STA ($FD),Y
    
    PLA              ; Visszaállítja X-et
    TAX
    RTS

row320lo: .byte $00,$40,$80,$C0,$00,$40,$80,$C0,... (25 byte)
row320hi: .byte $00,$01,$02,$03,$05,$06,$07,$08,... (25 byte)
bitmask:  .byte $80,$40,$20,$10,$08,$04,$02,$01
```

---

## 6502 Addressing Mode-ok Teljes Listája

Az `addressingModes` objektumban ezek MIND támogatottak:

| Mode | Példa | Operand méret | needsOperand |
|------|-------|---------------|--------------|
| `implied` | `TAX` | 0 byte | false |
| `immediate` | `LDA #$10` | 1 byte | true |
| `zeroPage` | `LDA $FB` | 1 byte | true |
| `absolute` | `LDA $D011` | 2 byte | true |
| `absoluteX` | `LDA $0400,X` | 2 byte | true |
| `absoluteY` | `LDA $0400,Y` | 2 byte | true |
| `indirectX` | `LDA ($FB,X)` | 1 byte | true |
| `indirectY` | `LDA ($FB),Y` | 1 byte | true |
| `relative` | `BNE loop` | 1 byte (offset) | true |

**KRITIKUS:** `indirectX` és `indirectY` **ZERO PAGE** címzések, tehát operand = **1 byte**!

### opcodeMap kiegészítések indirectY támogatáshoz

```js
LDA: { immediate: 0xA9, zeroPage: 0xA5, absolute: 0xAD, absoluteX: 0xBD, 
       absoluteY: 0xB9, indirectX: 0xA1, indirectY: 0xB1 },
STA: { zeroPage: 0x85, absolute: 0x8D, absoluteX: 0x9D, 
       absoluteY: 0x99, indirectX: 0x81, indirectY: 0x91 },
ORA: { immediate: 0x09, zeroPage: 0x05, absolute: 0x0D, absoluteX: 0x1D,
       absoluteY: 0x19, indirectX: 0x01, indirectY: 0x11 },
// + ADC, SBC, CMP, AND, EOR ugyanezzel a mintával
```

### getInstructionSize, validateRange, formatOperand frissítések

```js
// getInstructionSize - indirectX/Y is 2 byte (opcode + ZP address)
if (block.addressingMode === "immediate" || block.addressingMode === "zeroPage" || 
    block.addressingMode === "relative" || block.addressingMode === "indirectX" || 
    block.addressingMode === "indirectY") {
  return 2;
}

// validateRange - indirectX/Y 0-255 range
if (modeKey === "immediate" || modeKey === "zeroPage" || 
    modeKey === "indirectX" || modeKey === "indirectY") {
  return value < 0 || value > 255 ? error : "";
}

// formatOperand - speciális formázás
if (modeKey === "indirectX") return `(${formatter(value, 2)},X)`;
if (modeKey === "indirectY") return `(${formatter(value, 2)}),Y`;
```

---

## Jelenlegi verzió

`1.4.7` — lásd `package.json`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml` és a What's New dialóg (`index.html`).

Verzió növelésekor:
1. `package.json` → `"version"` mező
2. `src-tauri/tauri.conf.json` → `"version"` mező
3. `src-tauri/Cargo.toml` → `version` mező
4. `index.html` → `#whats-new-dialog` verzió + bejegyzések (mindig angolul!)
5. `README.md` → `Current version` sor + új What's New szekció
6. `.github/copilot-instructions.md` → verzió sor frissítése
7. Mac + Windows build az aláírási procedúrával

---

## Kritikus tudás - Sprite rendszer

### KRITIKUS - COLLISION/SPRITE MINTAK ALAPSZABALYA

**Ne inline BYTE blokkban tarold a sprite adatot a BASIC kod folyamaban, ha stabil sprite pointer kell.**

Kotelezo szabalyok:
1. Minden sprite adat **pontosan 64 byte** legyen.
2. Sprite cimek **64-byte alignmenten** legyenek (`addr % 64 == 0`).
3. `SPRITE_INIT.spriteDataPage` a tenyleges cim / 64 legyen (`$2000 -> $80`, `$2040 -> $81`, `$0840 -> $21`).
4. Ha a 2. sprite elcsuszik: **elso gyanusitott a megelőző sprite byte-darabja** (gyakori 65 byte hiba).

Ajánlott minta:
- Sprite adatok `RAWBYTES` blokkal fix cimre (`$2000`, `$2040`, ...)
- `SPRITE_INIT` page ugyanehhez igazítva (`80`, `81`, ...)
- Ne fuggjon a sprite adat helye az inline kod hosszától vagy ALIGN paddingtol

### C64 Sprite alapok

**Sprite méret és formátum:**
- **24×21 pixel** = 3 byte/sor × 21 sor = 63 byte + 1 padding = **pontosan 64 byte**
- Padding byte MINDIG `$00` legyen (különben extra pixelek jelennek meg)
- Sprite-ok **64-byte határra kell igazítani** memóriában (ALIGN 64)

**Sprite pointer számítás:**
```
Sprite pointer ($07F8-$07FF) = sprite_address / 64
Példa: sprite at $0840 → pointer = $0840/64 = $21
```

**VIC-II sprite regiszterek:**
- `$D015`: Sprite enable (bit 0-7 = sprite 0-7)
- `$D000-$D00F`: X/Y pozíciók (sprite 0-7, páronként)
- `$D010`: X koordináta 9. bit (255+ pozíciók)
- `$D027-$D02E`: Sprite színek (sprite 0-7)

### ALIGN makró bug (JAVÍTVA v1.1.5-ben)

**Probléma:** Az ALIGN makró `block.base` értéket használta → ha `base: "hex"`, akkor `ALIGN 64` → 0x64 = **100 decimális** határra igazított!

**Fix:** Az ALIGN blokkok mindig `base: "dec"` értéket használjanak:
```json
{
  "mnemonic": "ALIGN",
  "rawOperand": "64",
  "base": "dec",    // ← KRITIKUS!
  "isAlignMacro": true
}
```

### BASIC SYS stub és sprite címek

**Ha BASIC SYS stub BE van kapcsolva:**
- Origin: `$0801` (BASIC program start)
- BASIC SYS stub: 12 byte (0x0C)
- **Tényleges kód start: `$080D`** (nem $0801!)

**Sprite pointer számítás BASIC SYS-szel:**
```
$080D: JMP main (3 byte)
$0810: ALIGN 64 start
       remainder = $0810 % 64 = 16
       padding = 64 - 16 = 48 byte
$0840: Sprite 0 → pointer $21 ✓
$0880: Sprite 1 → pointer $22 ✓
```

**Gyakori hiba:** sprite pointer `$20` használata → `$0800` címre mutat, ahol még BASIC stub van!

### LOOP/NEXT makró register bug (JAVÍTVA v1.1.5-ben)

**Probléma:** `collapseLoadedProgram()` nem állította be a `nextReg` mezőt betöltéskor.

**Fix:**
```javascript
function collapseLoadedProgram(blocks) {
  const result = blocks.map((block) => ({
    ...block,
    collapsed: true
  }));

  // Initialize nextReg for NEXT blocks
  result.forEach((block, index) => {
    if (block.isNextMacro && block.nextLabel) {
      const matching = result.find(b =>
        b.isLoopMacro && b.loopLabel === block.nextLabel
      );
      if (matching) {
        block.nextReg = matching.loopReg || "X";
      }
    }
  });

  return result;
}
```

**Tünet:** LOOP Y használata esetén NEXT generált `DEX` helyett `DEY`-t.

### Sprite villogás (flicker) megelőzése

**Ok:** VIC-II közepén módosítjuk a sprite regisztereket → tearing/flicker.

**Megoldás 1: Delay loop**
```assembly
delay:
    LDX #$08         ; 8 outer loops
delay_outer:
    LDY #$FF         ; 255 inner loops
delay_inner:
    DEY
    BNE delay_inner
    DEX
    BNE delay_outer
    RTS
```

**Megoldás 2: VBlank wait (ritkán szükséges)**
```assembly
wait_vblank:
    LDA $D012        ; Raster line
    CMP #$FA         ; Wait for line 250 (bottom)
    BNE wait_vblank
```

**Best practice:** JSR delay minden frame után, **PUSH/PULL nem szükséges** (delay nem módosít regisztereket).

### Sample program translációk

**Fontos:** `renderLanguage()` függvény **index alapján** állítja be a menü szövegeket!

**Ha sample-t törölsz:**
1. JSON fájl törlése
2. `loadXxxDemo()` függvény törlése
3. `loadSelectedSample()` if blokk törlése
4. `index.html` `<option>` sor törlése
5. **translations objektum frissítése** (hu + en)
6. **renderLanguage() indexek átszámozása!**

**Példa:**
```javascript
// index.html aktuális sorrendje (lásd a "Meglévő mintaprogramok" táblát feljebb):
// 17: sprite-macro-demo
// 18: joystick-demo

// applyTranslations()-ban:
if (sampleOptions[17]) sampleOptions[17].textContent = t("sampleSpriteMacroDemo");
if (sampleOptions[18]) sampleOptions[18].textContent = t("sampleJoystickDemo");
```

---

## Új makrók (v1.1.3+)

### WORD makró
- **16-bit értékek** tárolása little-endian formátumban
- Formátum: `WORD $1234,$ABCD` → `$34,$12,$CD,$AB`
```javascript
if (block.isWordMacro) {
  const words = parseWordMacro(block.rawOperand, block.base);
  const bytes = [];
  words.forEach(word => {
    bytes.push(word & 0xFF, (word >> 8) & 0xFF);  // LO, HI
  });
}
```

### FILL makró
- **Ismételt byte-ok** generálása
- Formátum: `FILL count,value` pl. `FILL 100,$00`
```javascript
if (block.isFillMacro) {
  const parsed = parseFillMacro(block.rawOperand, block.base);
  const bytes = new Array(parsed.count).fill(parsed.value & 0xFF);
}
```

### TABLE makró
- **Lookup táblák** címkézése
- **Nincs byte generálás**, csak label létrehozás
- Használat: `TABLE sintable $C000` majd `BYTE` sorok utána

### PUSH/PULL makrók
- **Stack kezelés** (A/X/Y regiszterek mentése/visszaállítása)
- `PUSH A`, `PUSH XY`, `PUSH AXY` stb.
- **KRITIKUS:** PULL **fordított sorrendben** történik!
```javascript
// PUSH AXY → PHA, TXA+PHA, TYA+PHA
// PULL AXY → PLA+TAY, PLA+TAX, PLA (reverse!)
for (let i = regs.length - 1; i >= 0; i--) { ... }
```

### IF/ELSE/ENDIF makrók
- **Feltételes assembly** — teljesen implementálva a `DEFINE` blokkal együtt
- A `DEFINE` blokk aktivál egy vagy több szimbólumot (pl. `DEBUG`, `PAL`)
- `IF condition` blokk: ha a feltétel szimbólum aktív → a közte lévő blokkok lefordulnak; ha nem → kihagyódnak (`; [IF skipped] …` comment, 0 byte)
- `ELSE` blokk: a fordított ága
- `ENDIF` blokk: lezárja a feltételes részt
- Nested IF-ek támogatottak (belső feltétel önállóan értékelődik; külső skip esetén belső is skip)
- Az `isDefineMacro`, `isIfMacro`, `isElseMacro`, `isEndIfMacro` mezők azonosítják a blokkokat

### MACRO/ENDM - User defined macros
- Felhasználói makrók definiálása
- `MACRO name` ... `ENDM` blokkokban
- `parseUserMacros()` függvény építi fel a `userMacros` objektumot
- Expanzió: `getProgramLayout()` során inline behelyettesítés

---

## Teszt sorrend sample betöltéskor

Ha új sample programot adsz hozzá:
1. **JSON struktúra validáció** - minden blokk tartalmazza a szükséges mezőket
2. **Sprite data byte count** - pontosan 64 byte per sprite
3. **ALIGN base** - `base: "dec"` ne `"hex"`
4. **Sprite pointers** - BASIC SYS stub offsettel számolva ($080D start)
5. **LOOP/NEXT párosítás** - minden NEXT-hez van matching LOOP
6. **Label hivatkozások** - minden JMP/BNE/JSR target létezik
7. **Memory overlap** - sprite data nem írja felül a kódot

---

## Gyakori hibák és megoldások

### "Sprites rosszul néznek ki / eltolódtak"
→ Sprite pointer nem 64-byte határra mutat, vagy sprite data nem 64 byte

### "NEXT generál DEX amikor DEY kellene"
→ `collapseLoadedProgram()` bug - javítva v1.1.5-ben

### "Sprite-ok villognak mozgáskor"
→ JSR delay hiányzik vagy túl rövid (használj LDX #$08, LDY #$FF nested loop-ot)

### "Menu-ben nem jó sample töltődik be"
→ `renderLanguage()` indexek nem egyeznek a HTML option sorrenddel

### "ALIGN 64 nem oda igazít, ahová kellene"
→ `base: "hex"` helyett `base: "dec"` kell

---

## Debugging eszközök

**Memory layout vizualizáció:**
```javascript
const layout = getProgramLayout();
layout.lines.forEach(line => {
  console.log(`$${line.address.toString(16).toUpperCase().padStart(4,'0')}: ${line.block.mnemonic} (${line.size} bytes)`);
});
```

**Sprite pointer ellenőrzés:**
```javascript
// Sprite at $0840 → $0840/64 = $21 (33 decimal)
const spriteAddr = 0x0840;
const expectedPtr = spriteAddr / 64;
console.log(`Sprite pointer should be $${expectedPtr.toString(16).toUpperCase()}`);
```

**LOOP/NEXT validáció:**
```javascript
program.forEach((block, i) => {
  if (block.isNextMacro) {
    const loop = program.find(b => b.isLoopMacro && b.loopLabel === block.nextLabel);
    console.log(`NEXT at ${i}: ${block.nextLabel} → reg=${block.nextReg}, loop reg=${loop?.loopReg}`);
  }
});
```

---

## UI rendszer — v1.3.5 újítások

### CONST blokk fejléc kinyitott állapotban (v1.3.5)

Kinyitott állapotban a CONST blokk **nem mutatja** a bold `.block-mnemonic` ("CONST") feliratot — csak a `.block-category` chip látszik (`"Makro | Const"` / `"Macro | Const"`). Becsukott állapotban minden változatlan.

Implementáció:
- `renderProgram`-ban: `if (block.isConstMacro) node.dataset.macroKind = "const";`
- CSS: `.asm-block[data-macro-kind="const"]:not([data-collapsed="true"]) .block-mnemonic { display: none; }`
- `getBlockModeCaption`: CONST esetén csak `"Makro | Const"` (névtől független)

---

## UI rendszer — v1.3.2 újítások

### Label picker (operandus mező)

Agak és ugró utasítások operandus mezőjénél (`relative`, `absolute`, `absoluteX`, `absoluteY` módok) megjelenik egy custom dropdown a programban lévő label-ekkel:

```javascript
// renderProgram() - else ágban (sima utasítások)
if (mode.needsOperand && (block.addressingMode === "relative" || ...)) {
  const programLabels = program.filter(b => b.isLabel && b.labelName).map(b => b.labelName);
  if (programLabels.length > 0) {
    operandField.classList.add("has-label-picker");
    // wrapper div + .label-picker-dropdown felépítése
  }
}
```

**CSS osztályok:**
- `.label-picker-wrap` — `position: relative` wrapper
- `.label-picker-dropdown` — dropdown panel (megegyezik az `.operand-dropdown` stílusával)
- `.label-picker-item` — egy sor a dropdownban
- `.has-label-picker` — az inputon, ha van dropdown; custom SVG nyíl, `cursor: pointer` (focus előtt)

**Validáció fix:** `buildOperandPreview()` elfogadja a label neveket operandusként:
```javascript
if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
  return { operand: value, text: value, error: "" };
}
```

### Dropdown stílus — mindkét dropdown egységes

A natív `<datalist>` le van cserélve custom dropdownra. Az `operand-dropdown` (paletta) és a `label-picker-dropdown` (blokk) ugyanolyan stílusú: `var(--panel-strong)` háttér, `14px` border-radius, `var(--secondary)` hover.

**TILOS** fekete (`#0d0d16`) hardcoded hátteret használni a dropdownoknál — mindig CSS változókat használj!

### ASM blokk kiemelés

Blokk kattintáskor az ASM nézetben a megfelelő sorok kiemelődnek. **Natív `window.getSelection()` helyett** DOM span-alapú kiemelés:

```javascript
function applyAsmHighlight(blockId) {
  const { firstLine, lastLine } = asmBlockRanges[blockId];
  // Rebuild <pre> content with <span class="asm-line-highlight"> on matching lines
}
```

**`asmBlockRanges`** sorindex-alapú (`{ firstLine, lastLine }`) — **nem karakter-pozíció alapú**! DEC módban a `$D020 → 53280` konverzió megváltoztatja a szöveg hosszát, ezért a char-pos megközelítés rossz sorokat jelölt ki.

A `renderAsmOutput()` végén re-apply:
```javascript
if (selectedBlockId && asmBlockRanges[selectedBlockId]) {
  applyAsmHighlight(selectedBlockId);
}
```

CSS:
```css
.asm-output .asm-line-highlight {
  display: block;  /* ← egész sor legyen kiemelve */
  background: color-mix(in srgb, var(--accent) 32%, transparent);
  border-left: 2px solid var(--accent);
  border-radius: 3px;
  color: #ffffff;
}
```

**Fontos:** `display: block` span + `\n` belülre kerül a spanba (ne utána!) — különben üres sor jelenik meg a kiemelés után.

### ASM view HEX/DEC toggle

A `macro-source-row`-ban egy `mini-toggle` váltja az ASM output számformátumát:
- `asmOutputBase` state változó (`"hex"` | `"dec"`)
- `renderAsmOutput()` végén: `.replace(/\$([0-9A-Fa-f]+)/g, ...)` ha DEC mód
- Az origin input is konvertálódik váltáskor
- Label sorok kommentje: `loop:  ; $080D`

### CSS `[hidden]` override bug

Ha egy elemnek `display: flex` vagy `display: grid` CSS-ben van definiálva, a böngésző `[hidden]` alapértelmezés (`display: none`) NEM érvényesül!

**Fix — minden érintett osztályra explicit:**
```css
.inline-field[hidden] { display: none; }
.mini-field[hidden]   { display: none; }
```

### Két HEX/DEC rendszer

Az appban **két független** HEX/DEC toggle él:
1. **Globális operandus format** (`originBase`, `globalBase` state): a Program tabban lévő blokkok operandus inputjának formátuma. Megváltozásakor `renderProgram()` fut.
2. **ASM output format** (`asmOutputBase` state): az ASM nézet kimeneti formátuma (`$FF` vs `255`). Csak `renderAsmOutput()` fut. A per-blokk `block.base` NEM befolyásolja az ASM kimenetet — a BYTE és CONST makrónál mindig `asmOutputBase`-t kell használni.

**Renderelési pattern** — `field === "rawOperand"` vagy `field === "base"` változásakor NE hívj `renderProgram()`-ot (teljes DOM újraépítés), csak:
```javascript
if (field === "rawOperand" || field === "base") {
  renderBlockPreview(index);
  renderAsmOutput();
  return;
}
```

### Makró blokkok — melyiken látszik mi

| Makró típus | Operandus | Cím.mód | Saját mezők |
|-------------|-----------|---------|-------------|
| `isLabel` | ✅ (label név) | ❌ | — |
| `isComment` | ✅ (szöveg) | ❌ | — |
| `isConstMacro` | ❌ | ❌ | constName, constValue (HEX/DEC toggle) |
| `isTextMacro` | ✅ | ❌ | X, Y koordináta |
| `isByteMacro` | ✅ | ❌ | — |
| `isStringMacro` | ✅ | ❌ | cím |
| `isDataMacro` | ✅ | ❌ | cím |
| `isRawBytesMacro` | ✅ | ❌ | cím |
| `isRawTextMacro` | ✅ | ❌ | cím |
| `isIncBinMacro` | ❌ | ❌ | fájl, cím |
| `isSidMacro` | ❌ | ❌ | fájl |
| `isIncludeMacro` | ❌ | ❌ | fájl |
| `isLoopMacro` | ❌ | ❌ | reg, count (HEX/DEC toggle!), label |
| `isNextMacro` | ❌ | ❌ | loop label |
| `isPushMacro` | ❌ | ❌ | regiszterek |
| `isPullMacro` | ❌ | ❌ | regiszterek |
| `isWordMacro` | ✅ | ❌ | — |
| `isFillMacro` | ✅ | ❌ | — |
| `isAlignMacro` | ✅ | ❌ | — |
| `isTableMacro` | ❌ | ❌ | — |
| `isIfMacro` | ✅ (feltétel) | ❌ | — |
| `isElseMacro` | ❌ | ❌ | — |
| `isEndIfMacro` | ❌ | ❌ | — |
| `isMacroDefStart` | ✅ (makró név) | ❌ | — |
| `isMacroDefEnd` | ❌ | ❌ | — |
| `isMacroInvoke` | ❌ | ❌ | makró select |
| `isDefineMacro` | ✅ (szimbólumok) | ❌ | — |
| `isSpriteInitMacro` | ❌ | ❌ | spriteNum, spriteColor, spriteDataPage |
| `isSpritePosMacro` | ❌ | ❌ | spriteNum, spriteX, spriteY |
| `isWaitRasterMacro` | ❌ | ❌ | rasterLine (hex) |
| `isJoystickMacro` | ❌ | ❌ | joyPort, joySpriteNum |

A HEX/DEC format toggle feltétele (a nagy `insertAdjacentHTML` templateban):
```javascript
(mode.needsOperand && !block.isLabel && ... && !block.isLoopMacro && ...) ||
block.isByteMacro || block.isDataMacro || block.isRawBytesMacro ||
block.isWordMacro || block.isFillMacro || block.isAlignMacro
// LOOP-hoz NEM kell itt, mert saját HTML-jébe van beépítve!
```

### LOOP blokk HEX/DEC toggle

A LOOP `loopCount` mezőjénél a toggle a saját HTML-ben van, a címke mező FELETT:
- A `block-base` change event LOOP blokknál konvertálja a `loopCount` értékét is:
```javascript
const rawCount = countInput.value.trim();
const oldBase = newBase === "hex" ? "dec" : "hex";
const parsed = oldBase === "dec" ? parseInt(rawCount, 10) : parseInt(rawCount, 16);
const converted = newBase === "hex"
  ? parsed.toString(16).toUpperCase().padStart(2, "0")
  : String(parsed);
```

**LOOP count parse logika** (hex/dec auto-detect):
```javascript
const rawCount = (block.loopCount || "0A").trim();
const count = /^\d+$/.test(rawCount) ? parseInt(rawCount, 10) : parseInt(rawCount, 16);
// "0A" → hex → 10, "10" → dec → 10, "FF" → hex → 255, "255" → dec → 255
```
});
```
