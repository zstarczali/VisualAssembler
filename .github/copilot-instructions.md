# Copilot Instructions — C64 Visual Assembler

## Mi ez a projekt?

Electron-alapú asztali alkalmazás, amely Commodore 64 6502 assembly programok vizuális,
drag-and-drop szerkesztését teszi lehetővé. Nincs UI-framework — csak Vanilla JS, HTML, CSS.

---

## Fájlszerkezet

| Fájl | Szerep |
|------|--------|
| `app.js` | Teljes renderer logika (~5 100 sor): mnemonik könyvtár, UI, ASM/monitor generálás, makró expanzió |
| `index.html` | Egyetlen HTML lap; összes UI elem és két `<template>` (block-template, palette-item-template) |
| `style.css` | Teljes stíluslap; CSS custom properties-alapú téma (dark/light) |
| `main.js` | Electron main process: ablak, fájlmentés/betöltés, VICE futtatás IPC |
| `preload.js` | `contextBridge` — csak a szükséges IPC API-k expozíciója a renderernek |
| `package.json` | `electron` + `electron-builder`; build target: Windows NSIS |

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
  isComment: true, commentText: "..."
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

A `TEXT` makró `buildAsmLines()` / `buildMonitorLines()` híváskor fejlődik ki:
- Koordináta beállítás (LDA + JSR KERNAL rutinokkal)
- Karakterenkénti `LDA #$xx` + `JSR $FFD2` (CHROUT) párok
- Az expandált kód a TEXT blokk utáni sorokban jelenik meg az ASM nézetben

A `STRING` makró: szöveg karakterenként C64 screen code-ban, megadott abszolút memóriacímre (`stringAddress`, pl. `"C000"`). Deferred `.byte` szekció az ASM nézetben + inline kód a memóriatérképen.

A `DATA` makró: nyers byte-ok (`$FF, 169, 0x1A` formátumban), megadott abszolút memóriacímre (`dataAddress`, pl. `"C000"`). Minden byte → `LDA #$xx` + `STA $addr+offset` pár az inline kódban; a raw byte-ok deferred szekciókban is megjelennek.

**Address input dispatch pattern:** A `.macro-address` inputon `data-address-field` attribútum mondja meg, melyik blokk-mező frissüljön (`"stringAddress"` vagy `"dataAddress"`). Egy event listener kezeli mindkét típust (`macroAddressInput.dataset.addressField`).

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

| `sampleSelect.value` | Függvény | Leírás |
|----------------------|----------|--------|
| `"label-border"` | `loadLabelSampleProgram()` | Keret szín ciklus, cimkék bemutatása |
| `"text-demo"` | `loadTextSampleProgram()` | KERNAL CHROUT TEXT makró demo |
| `"macro-demo"` | `loadMacroDemoProgram()` | STRING/DATA/BYTE makrók |
| `"sprite-demo"` | `loadSpriteSampleProgram()` | Sprite mozgatás |
| `"bitmap-demo"` | `loadBitmapLineSampleProgram()` | Hires bitmap, 8 vonal JS Bresenham-mal; $2000-re igazított BYTE makró (gap + 8192 byte bitmap) |
| `"loop-demo"` | `loadLoopSampleProgram()` | Nested LOOP X+Y delay, keret+háttér szín ciklus 0–15 |
| `"hello-loop-demo"` | `loadHelloLoopSampleProgram()` | LOOP Y $28 (40×), RAWBYTES `"HELLO WORLD "` ASCII nagybetűkkel `$0900`-ra, kiírja „HELLO WORLD 1"–„HELLO WORLD 40"; CHROUT-hoz PETSCII nagybetűk kellenek; ZP `$FB`/`$FC` digit számláló |

---

## Mintaprogramok hozzáadása

1. `loadXxxSampleProgram()` nevű függvényt adj hozzá `app.js`-ben
2. A `loadSelectedSample()` switch-ben adj hozzá egy `if` ágat az új `sampleSelect.value`-hoz
3. Az `index.html`-ben add hozzá a `<option value="...">` sort a `#sample-select`-be
4. A `translations.hu` és `translations.en` objektumokban add hozzá a `sampleXxx` kulcsot
5. A `applyTranslations()` függvényben frissítsd a `sampleOptions[N].textContent` sort

---

## Electron IPC

| Csatorna | Irány | Leírás |
|----------|-------|--------|
| `save-file` | renderer → main | JSON projekt mentése fájlba |
| `load-file` | renderer → main | JSON projekt betöltése |
| `choose-vice` | renderer → main | VICE exe fájl választó dialógus |
| `run-vice` | renderer → main | `.prg` temp fájl írása + VICE indítása |
| `shell:open-external` | renderer → main | URL megnyitása a rendszer böngészőjében |

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
npm start          # Electron dev futtatás
npm run dist       # Windows NSIS telepítő build
npm run dist:dir   # Telepítő nélküli mappa build
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

## Jelenlegi verzió

`1.1.0` — lásd `package.json` és a What's New dialóg (`index.html`).

Verzió növelésekor:
1. `package.json` → `"version"` mező
2. `index.html` → `#whats-new-dialog` cím + bejegyzések (HU és EN)
3. Mac + Windows build az aláírási procedúrával
