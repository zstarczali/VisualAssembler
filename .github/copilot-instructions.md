# Copilot Instructions — C64 Visual Assembler

## Mi ez a projekt?

Tauri 2-alapú asztali alkalmazás, amely Commodore 64 6502 assembly programok vizuális,
drag-and-drop szerkesztését teszi lehetővé. Nincs UI-framework — csak Vanilla JS, HTML, CSS.
Backend: Rust (Tauri 2), frontend: Vanilla JS/HTML/CSS.

## Plugin integráció (C64AssemblyExpert)

Ez a repo beemelve tartalmazza a C64AssemblyExpert Copilot plugint.

- Agent fájl: `.github/copilot-plugin/agents/c64-assembly-expert.agent.md`
- Skill fájl: `.github/copilot-plugin/skills/c64-assembly-expert/SKILL.md`
- Plugin meta: `.github/copilot-plugin/plugin.json`

Ha a kérdés C64 assembly szakmai tudást igényel (VIC-II, SID, CIA, KERNAL, timing),
akkor ezeket a beemelt plugin fájlokat is vedd figyelembe válaszadás előtt.

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
  // Makró paraméterek és invokálás:
  macroParams: "color, count",      // MACRO blokkon: vesszős paraméternévlista
  invokeArgs: "#$07, $0A",          // INVOKE blokkon: vesszős argumentumlista
  isBlankLine: true,                // Expert módban gépelt üres sor — 0 byte, dashed spacer block módban
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

A `MOUSE` makró (`isMouseMacro: true`): C64 1351 arányos egér olvasása SID POTX/POTY (`$D419`/`$D41A`) keresztül, sprite mozgatás. Mezők: `mousePort` (`"1"` = CIA `$DC00` bits `7:6` = `%01`, `"2"` = CIA `$DC00` bits `7:6` = `%10`), `mouseSpriteNum` (0–7), `mousePotXZP` (ZP hex byte, prev POTX tárolója, pl. `"FD"`), `mousePotYZP` (ZP hex byte, prev POTY tárolója, pl. `"FE"`). Generált kód: CIA port select a felső két bit megőrzött-maszkolt állításával → kb. 512 ciklusos SID settle wait → standard 1351-féle 7 bites delta dekódolás mindkét tengelyen → X oldalon `$D010` MSB karbantartás, Y oldalon invertált mozgás. Méret: **142 byte**. Expert sor: `.mouse port, spriteNum, zpX, zpY` (pl. `.mouse 2, 0, FD, FE`). **Fontos:** az első hívás előtt inicializáld a ZP értékeket az aktuális POTX/POTY-ra.

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

A `REU_CHECK` makró (`isReuCheckMacro: true`): nincs saját mező. Generál: kétlépcsős `$DF04` write/read próbát `$55` és `$AA` mintával (34 byte). A végén a flag-ek normalizáltak: Z=0 → REU jelen van (BNE), Z=1 → nincs REU (BEQ). Nincs operandus, nincs addressing mode select.

A `REU_STASH` / `REU_FETCH` / `REU_SWAP` makrók (`isReuStashMacro`, `isReuFetchMacro`, `isReuSwapMacro: true`): 40 byte-os DMA transfer blokkok.
- **Mezők:** `reuC64Address` (hex, 16-bit, pl. `"C000"`), `reuAddress` (hex, 16-bit, pl. `"0000"`), `reuBank` (0–7, decimal), `reuLength` (hex, 16-bit, pl. `"1000"`).
- **DMA parancs:** STASH=`$90` (C64→REU), FETCH=`$91` (REU→C64), SWAP=`$92` (C64↔REU). Bit 7 = execute, bit 4 = 1 (FF00 decode tiltva, azonnali DMA), bits 1-0 = op. **A korábbi `$80/$81/$82` HIBÁS volt** — FF00-triggeres módot hagyott aktívan, ezért azonnali `$DF01` írásra a DMA nem indult el.
- **Generált kód layout:** 10× `LDA #val; STA $DF02+offset` pár, utolsó: `STA $DF01` (DMA trigger). Méret: 40 byte.
- **Expert:** `.reu_stash C000,0000,0,1000` formátum.

A `TURBO_SET` makró (`isTurboSetMacro: true`): U64 CPU turbo sebesség beállítása `$D031` regiszteren keresztül.
- **Mezők:** `turboSpeed` (0–15, dropdown, 0=1MHz … 7≈10MHz … 15≈48MHz), `turboBadline` (`"0"` = engedélyezett C64 kompatibilis / `"1"` = tiltott turbo).
- **Byte:** `(turboSpeed & 0x0F) | (turboBadline === "1" ? 0x80 : 0x00)`.
- **Generált kód:** `LDA #byte` + `STA $D031` = 5 byte.
- **Expert:** `.turbo_set 7,0` (speed, badline); import regex: `/^\.turbo_set\s+(\d{1,2})\s*,\s*([01])\s*$/i`.
- **ASM output:** `; .TURBO_SET speed=7 badline=on`.

A `SUPERCPU_DETECT` makró (`isSuperCpuDetectMacro: true`): CMD SuperCPU jelenlét ellenőrzés a verziójáról szóló regiszter (`$D0B8`) olvasásával.
- **Nincs saját mező.** Generál: `LDA $D0B8; CMP #$FF` = 5 byte.
- Z=0 → SuperCPU jelen van (BNE), Z=1 → nincs (BEQ).
- **Expert:** `.supercpu_detect`; import: `/^\.supercpu_detect\s*$/i`.

A `TURBO_ENABLE` makró (`isTurboEnableMacro: true`): CMD SuperCPU turbo be/ki kapcsolása.
- **Mező:** `turboEnableMode` (`"on"` = `$D07A`, `"off"` = `$D07B`).
- ON bytes: `[0xA9, 0x00, 0x8D, 0x7A, 0xD0]`; OFF bytes: `[0xA9, 0x00, 0x8D, 0x7B, 0xD0]`. Méret: 5 byte.
- **Expert:** `.turbo_enable on` / `.turbo_enable off`; import: `/^\.turbo_enable\s+(on|off)\s*$/i`.

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
- **REGION blokk gombjai — mind a `.block-topline`-ban vannak** (`collapseToggle.insertAdjacentHTML("beforebegin", ...)`) → **mindig láthatóak**, akkor is, ha a REGION blokk össze van csukva (`data-collapsed="true"`)
  - **↕ Expand all** (`region-expand-all-btn`): kinyitja a régiót (ha zárva), majd minden gyermekblokk `collapsed = false` → `renderProgram()`
  - **⦵ Select in ASM** (`region-select-asm-btn`): megkeresi a párosított ENDREGION-t (depth-aware előre keresés `program[]`-ban), összerakja a `{ firstLine: asmBlockRanges[block.id].firstLine, lastLine: asmBlockRanges[endRegionBlock.id].lastLine }` tartományt, ASM tab-ra vált ha szükséges, majd ideiglenes `"__group_range__"` kulcson keresztül hívja `applyAsmHighlight()`-ot a teljes régió kiemelésére
  - **⧉ Copy** (`region-copy-btn`): depth-aware scan → `program.slice(index, endIndex+1)` → `_clipboardRegion = slice.map(b => ({...b, id: uuid()}))` ; ✓ flash visszajelzés; paste gomb opacity törlése
  - **⎘ Paste** (`region-paste-btn`): `_clipboardRegion` ellenőrzés → depth-aware ENDREGION keresés → `insertAt = endIndex + 1` → `program.splice(insertAt, 0, ...toInsert)` → beillesztett REGION mindig `collapsed: false, regionCollapsed: false` (visible after paste) → `renderProgram()` → `scrollIntoView` az új blokkra; gomb `opacity:0.4` ha clipboard üres

A `LOOP` makró (két blokk rendszer):
- **LOOP blokk** (`isLoopMacro: true`): mezők: `loopReg` (`"X"` vagy `"Y"`), `loopCount` (hex byte pl. `"0A"`), `loopLabel` (string). Generál: `LDX/LDY #count` (2 byte), majd a label a `address+2`-re mutat (a body elejére). Az auto-label `loop1`, `loop2`… ha `loopLabel` üres.
- **NEXT blokk** (`isNextMacro: true`): mezők: `nextLabel` (párosított LOOP label neve), `nextReg` (auto-derive: a legközelebbi matching LOOP-ból). Generál: `DEX/DEY` (1 byte) + `BNE label` (2 byte). BNE offset = `target − (address+3)`, -128..127 range check.
- `getInstructionSize`: LOOP=2, NEXT=3
- Inserteléskor (`insertBlock`): LOOP-hoz auto-label, NEXT-hez auto-kitöltés a felette lévő LOOP alapján.
- HEX/DEC toggle és addressing mode select el van rejtve LOOP/NEXT blokkoknál.

A `FOR` makró (előre számoló, két blokk rendszer):
- **FOR blokk** (`isForMacro: true`): mezők: `loopReg` (`"X"` vagy `"Y"`), `loopCount` (hex byte limit pl. `"0A"`), `loopLabel` (string). Generál: `LDX/LDY #$00` (2 byte), majd a label a `address+2`-re mutat (a body elejére). Az auto-label `for1`, `for2`… ha `loopLabel` üres.
- **ENDF blokk** (`isEndfMacro: true`): mezők: `nextLabel` (párosított FOR label neve), `nextReg` (auto-derive), `nextCount` (auto-derive a pár FOR-ból). Generál: `INX/INY` (1 byte) + `CPX/CPY #limit` (2 byte) + `BNE label` (2 byte) = 5 byte. BNE offset = `target − (address+5)`, -128..127 range check.
- `getInstructionSize`: FOR=2, ENDF=5
- Inserteléskor (`insertBlock`): FOR-hoz auto-label, ENDF-hez auto-kitöltés a felette lévő FOR alapján.
- HEX/DEC toggle és addressing mode select el van rejtve FOR/ENDF blokkoknál.
- Import regex: `/^\.for\s+([XY])\s*,\s*(\$?[0-9A-Fa-f]+|\d+)\s*,\s*([A-Za-z_][A-Za-z0-9_]*)\s*$/i` és `/^\.endf\s+([A-Za-z_][A-Za-z0-9_]*)\s*$/i`
- Expert sor: `.for REG, count, label` / `.endf label`

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

Hardver beallitasok (külön dialóg, #hardware-settings-btn)
  ├── C64 Ultimate host + password
  └── Kapcsolat teszt gomb

Nezet
  ├── Téma picker (Light / Dark / OLED) — #theme-picker <details> elem
  └── Zoom vezérlők

[Check for Update gomb] → shell.openExternal → https://zstarczali.itch.io/visual-assembler-commodore-64
```

### Futtatási módok (split run gomb)

| Mód | Leírás |
|-----|--------|
| `prg` | PRG fájl → VICE közvetlenül |
| `d64` | PRG + extra fájlok → D64 (c1541) → VICE |
| `ultimate` | PRG → C64 Ultimate REST API (kétlépéses: D64 mount + PRG run) |

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
| 14 | `"map-copy-demo"` | MAP_COPY makró demo — `map-color.bin` betöltése és screen + Color RAM másolás |
| 15 | `"loadfile-demo"` | LOADFILE makró — futásidőben tölt fájlt D64-ről, hibakezeléssel |
| 16 | `"include-demo"` | INCLUDE makró demo |
| 17 | `"sid-demo"` | SID lejátszó — Ikari Warriors, IRQ-alapú, INCBIN |
| 18 | `"sid-direct-demo"` | SID lejátszó — SID makróval, INCBIN nélkül |
| 19 | `"sprite-macro-demo"` | SPRITE_INIT + SPRITE_POS + WAIT_RASTER demo; spritemate sprite balra-jobbra |
| 20 | `"joystick-demo"` | JOYSTICK makró demo; sprite #0 joystick port 2-vel mozog |

> **Megjegyzés:** A `collision-demo`, `10-print`, `irq-demo`, `overlapping-raster-demo` sample-ok szintén szerepelnek a `#sample-select`-ben 21–24 indexen (lásd `index.html` aktuális sorrendjét).

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
| `save_d64` | D64 lemezképet ment c1541-gyel (VICE) |
| `run_d64` | Temp D64 + VICE indítása D64-ről |
| `read_bin_file` | Nyers bináris fájl beolvasása (extras lazy load) |
| `build_exomizer_prg` | PRG tömörítése Exomizerrel (sfx sys), crunched bytes visszaadása |
| `launch_exomizer` | PRG tömörítése + VICE indítása a tömörített kimenettel |
| `run_on_ultimate` | PRG küldés + futtatás C64 Ultimate REST API-on |
| `test_ultimate_connection` | C64 Ultimate kapcsolat teszt |
| `open_manual` | PDF kézikönyv megnyitása |

---

## D64 export és futtatás

### D64 export dialóg

`saveD64ToFile()` → `openD64ExportDialog(prgBytes)` → `confirmD64Export()` → `save_d64` Tauri command.

A dialóg megjeleníti a `d64ExportState` tartalmát:
- `diskName` / `progName`: lemez- és programnév (max 16 char, c1541 lowercase)
- `extras[]`: extra bináris fájlok a lemezre; minden entry: `{ name, sourcePath, bytes, loadAddress }`

Ha `loadAddress` üres → fájl raw bytes (nincs 2-byte header); ha kitöltve → PRG header prepend.

### Extras lazy vs. eager loading

Amikor egy sample betöltődik (`loadSampleFromFile`), a kód először eager-load-dal próbálja feloldani az `extras`-t az `_sampleD64BaseDir` alapján. Ha sikerül, `d64ExportState.extras` feltöltődik. Ha nem (pl. production build eltérő útvonal), `_pendingExtras` + `_pendingExtrasBaseDir` megőrzi a lazy fallback-hez.

A dialóg megnyitásakor (export vagy run D64): ha `extras` üres és `_pendingExtras` nem null → `d64LoadSavedExtras()` hívás, majd `_pendingExtras = null`.

### C64 Ultimate integrációk

- **`run_on_ultimate(host, password, prgBytes)`** → kétlépéses folyamat (v1 API):
  1. `POST http://{host}/v1/drives/a:mount` — D64 bytes mint `application/octet-stream` (ha D64 mód)
  2. `POST http://{host}/v1/runners:run_prg` — PRG bytes (2-byte load address prefix + kód)
  - Mindkét kérés `X-Password` headert kap, ha jelszó be van állítva
- **`test_ultimate_connection(host, password)`** → kapcsolat teszt (`/v1/runners/info`)
- **Beállítások:** `#hardware-settings-dialog` — host + password; elmentve a config-ba
- **Run mód:** `"ultimate"` — a split run gomb ultimateMode-ban a `runViaUltimate()` függvényt hívja

> **FIGYELEM:** A helyes endpoint `/v1/drives/a:mount` + `/v1/runners:run_prg`.
> **NE** használd a `/v3/runners/prg` vagy `/v3/runners:mount_disk` végpontokat — ezek nem léteznek!

### D64 state a project JSON-ben

A `d64` szekció a projektfájlban:
```json
"d64": {
  "diskName": "LEMEZNAME",
  "progName": "PROGRAMNAME",
  "extras": [
    { "name": "DATAFILE", "sourcePath": "relative/path/file.prg", "loadAddress": "" }
  ]
}
```
A `sourcePath` relatív a projektfájlhoz képest. Sample esetén a `samples/` mappához képest relatív.

### D64 Editor (`#d64-editor-dialog`)

Önálló dialógus (nem a fenti export dialóg) meglévő `.d64` lemezképek közvetlen szerkesztésére. Sprite Editor stílusú DOM (`.de-hdr` Files▾ + title + close, `.de-toolbar` icon gombok, `.de-body` táblázat) — lásd CLAUDE.md 15. szakasz konvenció.

**Rust oldal (`lib.rs`, `run_c1541_cmd` + `-attach <path>` minden hívásnál, tehát a meglévő lemezképet módosítja helyben, nincs "-format"):**

| Command | Mit csinál |
|---------|-----------|
| `choose_d64_open` / `choose_d64_new` | Natív fájlválasztó (open / save-as) `.d64` szűrővel |
| `d64_format(path, diskName)` | Új, üres formázott lemezkép létrehozása `-format` |
| `d64_list(path)` | `-list` kimenetének parszolása (`parse_c1541_listing`) → `{diskName, entries, blocksFree}` |
| `d64_add_file(path, bytes, name, loadAddress?, fileType?)` | `-write`; `fileType` (`prg`\|`seq`\|`usr`\|`rel`) a `c1541 -write ... name,<typecode>` szintaxissal kerül a directory-be |
| `d64_delete_file(path, name)` / `d64_rename_file(path, old, new)` | `-delete` / `-rename` |
| `d64_extract_file(path, name)` | `-read` egy temp fájlba, majd visszaolvasva bájtokként adja vissza |
| `d64_copy_as(source, dest)` | `fs::copy` — "Save As" |
| `d64_run(path)` | VICE indítása közvetlenül a megadott `.d64`-re (nem épít új temp image-et, ellentétben `run_d64`-gyel) |

`parse_c1541_listing` heurisztikusan dolgozza fel a `c1541 -list` szöveges kimenetét — a `c1541` maga konvertálja a nem-nyomtatható/grafikus PETSCII karaktereket olvasható ASCII helyettesítőkre (pl. `.`/`-`), ez az információvesztés a mi kódunk előtt történik, nem javítható a parseren belül (csak egy saját BAM/directory bináris parserrel, ami nincs implementálva).

**JS oldal (`app.js`):** `_d64EdState` (path/diskName/freeBlocks/entries/selected/pendingAddBytes/pendingIsPrg) + `setupD64Editor()`. `_d64EdConfirmAdd()` a Build D64 extra-fájl Exomizer logikáját (`confirmD64Export`) hasznosítja újra: `loadAddress === 0x0801` → `buildExomizerPrg` (sfx sys mód), egyébként `buildExomizerRaw` (mem mód, `targetAddress`/`decompressAddress`-szel). `.prg` kiterjesztésű forrásfájlnál (`pendingIsPrg`) a load/decompress/Exomizer mezők (`#de-add-extra-fields`, `display:contents` trükkel elrejtve) és a hozzájuk tartozó validáció ki van kapcsolva, mivel a `.prg` már tartalmazza a saját fejlécét.

> **Csapda — rename input elvész kattintásra:** a directory-tábla sorainak `click` handlere korábban feltétel nélkül újrarajzolta a sort (`_d64EdRenderEntries()`), ami az aktív rename `<input>`-et is eltávolította, ha a felhasználó bele akart kattintani. Fix: a handler kihagyja az eseményt, ha `e.target.closest(".de-rename-input")`.

**Drag & drop (`#de-body` `dragenter`/`dragover`/`dragleave`/`drop`):** egy `.prg`/`.bin` fájl közvetlenül a szerkesztő testére húzható. `_d64EdHandleDroppedFiles(fileList)` a natív `chooseIncBinFile` fájlválasztó helyett `File.arrayBuffer()`-t olvas (`_d64EdLoadDroppedFile`), és ugyanazt a `_d64EdPreparePanelForFile(bytes, fileName)` helper-t hívja, amit a natív picker is használ — a Hozzáadás panel innentől megkülönböztethetetlen. Több egyszerre dobott fájl a `_d64EdState.dropQueue`-ba kerül, és `_d64EdConfirmAdd()` sikeres hozzáadás után `_d64EdAdvanceDropQueue()`-val folytatja a következővel.

**Include fájl generálása (`#de-gen-include`, `_d64EdGenerateInclude`):** minden directory bejegyzéshez megpróbál egy betöltési címet feloldani — előbb a `_d64EdState.addresses` session-memóriából (amit `_d64EdConfirmAdd` tölt fel a crunch előtti `declaredAddress`-szel, ha a felhasználó explicit címet adott meg egy nyers fájlnál), aztán PRG típusnál a fájl első két byte-jából (`d64ExtractFile` + kis-endian olvasás) — és `.const NÉV = $CÍM` sorokat ír egy `.inc` szöveges fájlba (`_saveBinFile`). SEQ/USR/REL bejegyzés cím nélkül kimarad (nincs header, amiből kiolvasható lenne).

**Blokk szerkesztő (`#de-blocks-toggle`, `#de-block-panel`):** a directory-absztrakció alatti nyers track/sector hozzáférés — nincs `c1541` a képben, csak a lemezkép bájtjai. `_d64EdLoadBlockImage()` a teljes image-et `readBinFile`-lal olvassa be, `_d64ParseBam(bytes)` a track 18 sector 0 BAM-jából (4 byte/track: 1 free-count + 3 byte bitmap 24 sectorig) szedi ki a szabad blokkokat, `_d64WalkDirectoryChain(bytes)` a directory lánc blokkjait (track 18 sector 1-től, a lánc-byte-okon `nt===0`-ig). `_d64EdRenderBlockGrid()` egy kattintható rácsot rajzol (`D64_TRACK_SECTORS` geometria: 1-17. sáv 21, 18-24. sáv 19, 25-30. sáv 18, 31-40. sáv 17 szektor; `_d64BlockOffset(track, sector)` a byte-offset), zöld=szabad/szürke=foglalt/piros=BAM-vagy-directory színezéssel. Kiválasztás (`_d64EdSelectBlock`) a 256 byte-ot hexdumpolja (`_d64FormatHexBlock`, 16×16 sor, cím-prefix és ASCII oszlop nélkül a robusztus round-trip kedvéért), `_d64EdWriteBlock()` visszaparse-olja (`_d64ParseHexBlock` — pontosan 256 hex token kell, különben hibaüzenet) és `writeBinFile`-lal írja a teljes image-et. Új Rust command: `write_bin_file(path, bytes)` a `lib.rs`-ben, `read_bin_file` párja, ugyanaz a minta mint `save_text_file` (nincs dialógus, explicit path). `_d64EdReload()` blokk módban is frissíti a cache-t, hogy egy directory-szintű módosítás után ne maradjon elavult adat.

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
  -ov -format UDZO "C64-Visual-Assembler-2.1.1-signed.dmg"
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

### `*` (current PC) operandus támogatás

- Bármely operandus mező elfogadja a `*` karaktert mint az utasítás saját címét (aktuális program counter)
- `compileOperand()` először ellenőrzi a `rawOperand === "*"` feltételt → az adott blokk assemblélési címét használja
- **Relatív branches esetén** (pl. `BNE *`): offset = `address − (address+2)` = `−2` = `0xFE` → végtelen önhurok
- **Display (block preview):** `"*"` helyett mode-függő szöveg jelenik meg:
  - relative → `"* (self)"`
  - absolute → `"*(=addr)"`
- Import (`_importMakeInstruction`): `"*"` operandussal érkező sor `rawOperand: "*"` ként kerül be

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

`2.7.4` — lásd `package.json`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`, `index.html` (What's New + cache busterek), `README.md`, `Visual Assembler Manual.md`, `Visual Assembler Manual.hu.md`, `INSTALL-MAC.md`, `INSTALL-LINUX.md`, `README.txt`, `AGENTS.md`, `CLAUDE.md`.
Fő 2.7.4 változások: **Kijelölés, vágólap, kvantálás a vízszintes trackerben**: `_sidRollView.sel` (kulcs `v:start`, `_sidRollKey`), Shift+húzás = keret (`view.band`), Ctrl+kattintás, Ctrl+A, Esc; `_sidRollCopySelected` / `_sidRollCutSelected` / `_sidRollDeleteSelected` / `_sidRollPasteAt` (`_sidRollPasteRow`: az egér alatti sor, különben a kurzor) a közös `_sidRollPlace`-szel (felülír, a levágott hang régi note-offját törli) és a `_sidRollDelete`-tel (az előző hang megtartja a végét); fejléc-gombok `#sid-roll-undo/redo/cut/copy/paste/delete/quantize` (`_sidRollSyncTools`, a Visszavonás állapota a `_sidHistRender`-ben); kvantálás: rács `#sid-quantize` (`_sidQuant`, `c64va-sid-quantize`, 2 / 4 / 8 / 16 sor, alapból 4), Q a kijelöltre (`_sidRollQuantizeNotes`: legközelebbi rácssor, hossz marad), felvételnél csak `#sid-quantize-rec` mellett (`_sidQuantRec`, `c64va-sid-quantize-rec`; `_sidRecordQuantize`, `rec.taken`, `rec.songPos0`); `tests/sid-roll-select.test.js`. Customer message `id` = `sid-tracker-274`.
Korábbi 2.7.3 változások: **Linux hang**: a WebKitGTK a Web Audiót GStreamerrel játssza, ezért `bundle.linux.appimage.bundleMediaFramework` + `deb` / `rpm` `depends`, a CI telepíti és ellenőrzi a plugineket (`libgstapp.so`, `libgstautodetect.so`); `tests/linux-sound.test.js`. **Visszavonás a SID szerkesztőben**: `#sid-undo` / `#sid-redo`, Ctrl+Z / Ctrl+Y (`_sidUndo`, `_sidRedo`, `_sidHist`, max `_SID_HIST_MAX` = 100); a módosítási pontok helyett `_sidHistSchedule` (a `window` `pointerup` / `keyup` / `change` / `input` / `wheel` eseményei, MIDI, betöltés, felvétel vége; 300 ms) → `_sidHistCheck` összeveti a teljes dalt (`_sidHistSnap`, változatlan pattern közös stringgel), felvétel alatt nem ment; `_sidHistApply` a megváltozott hangszerre és patternre ugrik; `tests/sid-undo.test.js`. **reSID első hang**: a motor hangereje az első hangig 0, ez a lejátszás első hangján adott kattanást (6581-en 15 700 körüli csúcs), ezért a `_sidWaOpeningMixer` száraz futással megkeresi az első hang `$D415-$D418` értékeit, és a `_sidWaOpenFrame` az addigi frame-ekbe írja (csak reSID-nél); `tests/sid-first-note.test.js`. **Tempó**: a `sidSpeed` felirat „Frame/sor” (a `_sidSpeed` és a formátumok nem változtak), a `#sid-bpm` csak kijelző, mert a tempó csak egész frame/sor lehet; `tests/sid-tempo.test.js`. **Hangok mozgatása a vízszintes trackerben**: a törzs húzása `kind: "move"` (`_sidRollMoveStart`: a sáv érintett sorainak mentése, `_sidRollMoveTo`: minden lépés ebből indul, így amin áthalad, visszajön), egy sorral a következő hang előtt megáll, az előzőbe belevághat; a kurzor `move`. **Hanghossz a vízszintes trackerben**: `_sidRollGrab` (a hang vége, rövid hangnál a fele, kifelé legfeljebb 4 px; különben a törzs = hangmagasság), `_sidRollNoteLimit` (a sáv következő hangjáig), `_sidRollDragEnd`, `ew-resize` / `ns-resize` kurzor, `view.edge` fogantyú, a `_sidRollSetEnd` rövidítéskor törli a régi note-offot; `tests/sid-roll-resize.test.js`. **MIDI engedély kérdés nélkül**: `src-tauri/src/midi_permission.rs` (`allow_without_prompt`, a `.setup`-ból; Windows: WebView2 `PermissionRequested`, csak a 11-es MIDI típust engedi; a `webview2-com` verziója a `wry`-éval mozog, Tauri-frissítéskor együtt kell emelni; a Tauri 2.12 saját permission handlert ad). **.bin betöltése**: a `_sidDeserialize` és a `_sidApplyImportedTune` a `_sidSong[0]` patternjét nyitja meg, nem a 0.-at (a `_sidSongPos` = 0 ezzel egyezik). **SID Player Pause**: a lejátszónak saját `AudioContext`-je van (`_sidPlayerAudio`, `_sidExtAudio`, `_sidExtGain`, spektrum `_sidVizExt`), mert a közöset a `_sidPlayBuffer` → `_sidEnsureAudio` minden renderelt darabbal és szerkesztő-hanggal felébresztette; a `_sidPlayBuffer` `output` paramétere nem ébreszt; a Pause másodszorra folytat; `tests/sid-player-pause.test.js`. **Stop a „Play: All” után**: `_sidPlayReturn` (`{ pat, songPos }`, a `_sidPlay` menti), a `_sidStop` visszaáll rá, lejátszás közben választott song-lépésnél arra; `tests/sid-stop-view.test.js`. **Polifon felvétel MIDI-ről**: `#sid-midi-poly` (`_sidMidiPoly`, `c64va-sid-midi-poly`, alapból ki), `_sidRecordPolyNote`: minden tartott billentyű saját hang a `rec.voice`-tól (`_sidRecordPolyVoice`, `rec.held`; ha mind foglalt, a legrégebbi adja át), 40 ms-on belüli akkord egy sorra (`rec.chord`), felengedés = note-off (`_sidRecordPolyRelease`, ugyanazon a soron a következőre várva: `rec.pendingOff`); csak a MIDI, a VA-VK és a billentyűzet marad egyhangú; `tests/sid-midi-poly.test.js`. **reSID-es hang-előnézet kattanás nélkül**: minden hang új chipet indít, a `$D418` első írása DC-ugrást adott (10 ms-os lecsengés a külső szűrőn; 6581-en kb. 15 700, 8580-on kb. 600); a chip az első frame előtt beáll a `$D415-$D418`-ra (`settle_on_mixer`, 100 000 ciklus, a session is), az integer felüláteresztő maradék szintjét (6581-en 905) a `dc_trim` levonja, az egyszeri puffer vége 5 ms-os lecsengés (`fade_buffer_end`); teszt `a_note_preview_on_resid_opens_and_ends_without_a_click`. Customer message `id` = `sid-tools-273`.
Korábbi 2.7.2 változások: **SID motor**: `src-tauri/src/sid_chip.rs` (`SidEngine`, `SidChip`: VA SID Core vagy `resid-rs` (a javított másolat a `src-tauri/vendor/resid-rs`-ben: a `Resample` FIR-interpolációja 32 biten túlcsordult, lásd `VENDORED.md`), mindkettő ciklusonként órajelezve, a C64 mag közös; a reSID sablonja `ResidChip::new`, klónozva, mert minden hang-előnézet új chip); beállítás `_sidPreviewEngine` = `resid` (alapérték) | `va-core`, a mentett `websid` az alapértékre vált, a payload `engine` mezője viszi a Rustnak; a WebSID és a regiszter-stream kikerült (`www/lib/websid`, `_webSid*`, `_sidStream*`, licence CC BY-NC-SA volt), a `Play: All` is a JS motor regisztereit rendereli; `tests/sid-engine.test.js`, Rust `sid_chip::tests`, mérés `engine_speed` (#[ignore]). A SID Player puffer felirata másodperc (10 / 15 / 20 / 30 s). Customer message `id` = `resid-272`.
Korábbi 2.7.1 változások: **Két SID a SID szerkesztőben**: a dal szélessége a patternek oszlopszáma (`_sidVoiceCount`, 3 vagy 6), a második SID címe `_sidSid2Addr`, `.bin` `0xFC`, 6 hangos lejátszó `$50-$69` ZP-vel (`sid_vptr`), 2 SID-es dump és import, sztereó VA SID Core; **csatorna-spektrum** (`#sid-ana`, `_sidAna*`, a regiszterekből számol); `_webSidLoadPsid` javítás (nem létező `song`). **Ultimate emulátor** (UE2-C64U-Emulator, `src-tauri/src/ue2emu.rs`): `ue2` / `ue2-d64` futtatási mód, igény szerinti indítás + `.ue2` install, Debug `_udDebug` / `ue2_dbg_*`, VICE Monitor ablak a P+2 porton; a részletek és a 0.6.0 sajátosságai a Run módok táblázatában. **D64 on hardware**: a mount `?type=d64&mode=readwrite` (a C64U 1.1.0 nélküle 400-at ad). Minták `ultimate-turbo-demo` (`sampleOptions[37]`, 64 sprite) és `ultimate-box-demo` (`sampleOptions[38]`, a box kockája, a `macros.json` + `data.asm` include-dal, TOD-időzítés, állapotsor a bitmapben), IRQ és hardver kategória; `$D031` 3 mp-enként 1–64 MHz, csak Ultimate-en; `tests/ultimate-turbo-sample.test.js`; a VA az emulátorban a Turbo Control-t a turbó-regiszterekre állítja (`turbo_registers_line` az `ue2emu settings` kimenetéből). **VICE debugger**: `src-tauri/src/debugger.rs` = a közös munkamenet (`DebugSession`, `Halt::ControlPort` (ue2emu: `c64 halt`) / `Halt::Monitor` (VICE: bármely parancs megállít), `dbg_*` commandok); `vice_dbg_start` (lib.rs, `vice_debug_monitor`: a monitor-porton futó VICE vagy új `spawn_vice` fájl nélkül, checkpointok, monitor `AUTOSTART`); VICE-ban a step over / out checkpoint a visszatérési címre (`step_to_return`), mert a VICE `EXECUTE_UNTIL_RETURN`-je visszatérés nélkül élesítve marad és a következő RTS-nél (a következő munkamenetben is) megáll; frontend `_udDebug("vice")`, beállítás Beállítások → Általános → Debugger `#debugger-choice` (`c64va-debugger` = `va` | `retro`, `_debuggerChoice`; `debuggerPath` nélkül mindig `va`, a `retro` opció tiltva (`_debuggerChoiceSync`); választás nélkül `retro`, ha van `debuggerPath`; a régi `c64va-debug-target` = `vice` → `va`; a `web64` és `ue2` mód mindig a saját debuggerét használja, `va`-nál a hardveres módok a beépített C64-et), teszt `real_vice_debug_session` (#[ignore], `VICE_EXE`). A frissítési szerver (`#update-server`, `#update-settings-label`) a Beállítások Fájlok és útvonalak fülén, a RetroDebugger alatt. **Futtatás menü**: csak a beállított eszközű módok látszanak (`_runModeAvailable`, `_runModeApply`, `_RUN_MODE_ITEMS`; VICE útvonal, `ultimateHost`, `kff2Port`, `_ue2Ready`), a `runMode` a ténylegesen futtatható mód (tartalék: `prg`, majd `web64`), a `_runModeWanted` a kért, ez mentődik a `localStorage`-ba és a projektbe. Customer message `id` = `ue2-vice-271`.
Korábbi 2.7.0 változások: **Beépített C64** (`www/web64/` = VICE 3.10 x64sc WebAssembly a `vice-3.10-web64` forkból, frissítés: `node scripts/update-web64.mjs`; `runMode` `web64`, `#run-web64-mode`, `#web64-btn`, `#web64-dialog`, `setupWeb64`, `_w64*`; állapot `_w64S()`, megjegyzés `c64va-web64` = `_w64Prefs` / `_w64SavePref`: open, warp, sound, debug, joy, crt, reu, video, sidModel, sidEngine, size). **Debugger** (fork: a `monitor_startup` helyben vár az utasítás előtt, `vice_web_monitor_break_active` / `_continue` / `_step(mode, count)` / `_break` / `_memory_peek`; `_w64Debug`, `_w64DebugBuild`, a közös `_debuggerTargets(prg)` a RetroDebuggerrel; `runInDebugger`: `web64` módban vagy RetroDebugger nélkül ez indul; forrástérkép `_w64ParseDbg` a `.dbg`-ből, ACME-nél a report; töréspontok `_w64BreakpointAddresses` / `_w64ApplyBreakpoints`, léptetéskor nem villan: `_w64OnResume` 200 ms-mal késleltet, `hit_pending` jelzi az új megállást; `_w64DebugLine` → `.expert-dbg-line`; `tests/web64.test.js` + `tests/helpers/web64-debug-check.mjs`, külön folyamatban, mert az emulátor időzítői nem engednék kilépni). **Gép**: `_w64SetVideo` (modell 0 / 3, a modell a SID-et is állítja), `_w64ApplySid` (a motor előbb: a web-build `SidEngine`-nél 8580-ra áll), `_w64SetReu`; a konfigurálás CPU-csapdán fut (`vice_web_queue_resource`, megállított CPU-nál a folytatáskor), `_w64Unhalt`. **Fájlok**: `_w64OpenFile` (PRG autostart, D64 + `LOAD"*",8,1`, CRT), a Run leveszi a cartridge-et; meghajtó LED + track a státuszsorban, a villogás = DOS-hiba, `_w64LedStep`. **Kép**: CRT `_w64ToggleCrt` + `_w64LayoutCrt` (`#w64-crt-layer`, a scanline-periódus egész eszközképpont, 3 alatt nincs), teljes képernyő `.w64-dialog--full` (CSS, nem Fullscreen API; Tauri `setFullscreen`, capability `core:window:allow-set-fullscreen`), méretezés `_w64SetupResize` (a dialógus `transform`-ját előbb rögzíti). A VA SID Core itt nem elérhető (natív Rust a backendben). **UltimateBasic** `Cargo.lock` → `903c133` (a `.dbg` sorszámai jók, ha a `sub` a főprogram előtt áll; a PRG nem változik). **Indítófájl**: a csillag a `startupFile`-ban él, tab-azonosító nélkül; UB `_ubBuildTarget` / `_ubCompileTarget` (nyitott fül vagy lemez), Expert `_projFindEntry` (mappákban is), `_projEnsureStartupTab` (bezárt indítófájl), nem aktív Expert fül a szövegéből (`_expertBuildProgramFromText`); hiba `projStartupMissing`. Állapot: `WEB64-INTEGRATION.md`. **Hi-Res multicolor korlát**: cellánként papír + 3 szín (`_hgMcCanPlace`, a `_hgSet` elutasítja, státusz `hgMcCellFull`; `_hgMcPaint` = kitöltés / alakzat / beillesztés egyben, a felülírt terület nem foglal színt), a papír cseréje átszínezi a háttérpixeleket, túllépés piros kerettel (`_hgMcOverCells`, `_hgOverlays`) + export-figyelmeztetés (`_hgWarnOverCells`, `hgMcOverExport`); a kép szélén túli húzás pixelrácsnál nem dob hibát (`_hgDrawPixelBuf`); `tests/hires-mc-limit.test.js`. A `#vice-toast` `popover="manual"`, így modális dialógus fölött is látszik. **Szerkesztő jobb klikk**: Expert + UB közös menü (`_editorCtxItems`, `_edShowCtxMenu`; Kivágás, Másolás, Beillesztés, `edCtxSelectAll`, `edCtxUpper` / `edCtxLower`), vágólap: `_editorReadClipboard` → Rust `tauri-plugin-clipboard-manager` (a `navigator.clipboard.readText` jogosultságot kér a WebView2-ben); a szerkesztés `_editorEdit`: egy `beforeinput` + egy `input`, mint a Ctrl+V (az `execCommand` magában nem küld `beforeinput`-ot, és soronként küld `input`-ot, ami összecsukott régiónál elrontja az Expert forrást), a köztes eseményeket elnyeli; `tests/editor-context-menu.test.js`. A beépített C64 debugger panelje alapból nyitva (`_w64Prefs().debug !== false`). **Paraméter nélküli makró szubrutinként** (JS + Rust VMA): a saját programban `JMP __ml_skip_N` + címke + törzs + `RTS` + `__ml_skip_N:` (`_macroSubroutineBlock`, a folyás nem fut bele), fix című könyvtárban a törzs után `RTS`; `tests/macro-subroutine.test.js`. **Futásidejű IF minta**: `samples/runtime-if-demo.asm` + `.json` (a menü a `.json`-t tölti, a szöveg azonos: `tests/runtime-if-sample.test.js`), `sampleOptions[36]`. Customer message `id` = `web64-270`.
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
Korábbi 2.5.9 újdonságok: **Commodore Beige téma** (`data-theme="beige"`, világos): a Light téma szabályai (light-párú szelektorok) + saját változók, `--c64-badge` szivárványcsík (`body::after`, téma-ikon, splash), mustár `.primary`, C64 kék `.monitor-output`; a téma-kör vége … → starlight → beige → light. **Commodore Starlight téma** (`data-theme="starlight"`, világos): a Light téma szabályai (light-párú szelektorok) + saját változók és `--sl-rainbow`, áttetsző fehér panelek, pasztell RGB-fény a `body` hátterén és `body::after` szivárvány csík, gradiens `.primary`, füstös sötét `.monitor-output`, a téma-kör `toggleTheme`-ben (… → commodore77 → starlight → light), korai háttérszín az `index.html` fejléc-scriptjében. **Commodore 64 téma** (`data-theme="c64"`, sötét): a C64 bekapcsolási képernyője — `--bg` = világoskék keret (`#7869c4`), panelek / szerkesztők C64 kék (`#40318d`), szöveg világoskék, inverz `.primary`, C64-paletta szintaxisszínek, `.monitor-output` C64ProMono betűvel; a keret-háttéren álló szövegek (`.eyebrow`, `.hero-copy`, `.memory-strip-axis`) sötétkékek; a `style.css` végén, korai háttér `#7869c4`. A téma-kör (`toggleTheme`): light → dark → oled → commodore77 → starlight → beige → c64 → light. **Verziókezelés ablak**: mozgatható (`setupDraggableEditorDialogs` → `project-snapshot-dialog` / `.project-snapshot-hdr`), a mentett pozíciót a `showModal()` előtt és után is alkalmazza (`_applyPosition`), `_vcClampDialog` a képernyőn tartja, ha a napló / diff megnöveli; kívülre kattintás már nem zárja (csak Esc / cancel). Customer message `id` = `themes-259`.
Korábbi 2.5.8 újdonságok: **Verziókezelés** (a projekt snapshotok helyett, `_vc*` az `app.js`-ben): a `<projekt>.snapshots.json` tár git-szerűen — commit üzenettel + rövid hash (`_vcHash`), HEAD = legutóbbi nem-autosave bejegyzés, autosave bejegyzések (`kind: "auto"`, max `_PROJECT_SNAPSHOT_MAX_AUTO` = 20, összesen max 100), diff (`_vcLineDiff` LCS + 3 sor kontextus; `_vcSmartDiff` / `_vcComparable`: ha nem mindkét oldalon van Expert forrás, mindkettő `_blockToExpertLine`-nal blokkokból generált sorokra), checkout a szerkesztőbe (`_vcApplyText`, lemezre csak mentéskor). UB fülön a payload `{ kind: "ub", ubText }` (`_vcIsUbTab`, `_vcUbFilePath`). **Git mód** (`_vcRenderGit`, `_vcGitCommit`, `_vcGitCheckout`, `_vcGitSimple`): Rust `git_exec` (engedélyezett alparancsok, `GIT_TERMINAL_PROMPT=0`, ssh BatchMode, CREATE_NO_WINDOW), `get_git_config` / `set_git_path` / `choose_git_executable`, `detect_git_executable` (PATH + szokásos mappák); status `--porcelain=v1 -b`, log `%x1f`-mezőkkel, diff értelmezve + **RAW** (`_vcRawDiff`), pull `--ff-only`, első push `-u origin <ág>`, `git init`; beállítás: Beállítások → Verziókezelés (`#git-path`, `#choose-git`, `#detect-git`, `#git-preferred` → `uiSettings.gitPreferred`). **Hibabejelentés** (`#bug-dialog`, `setupBugReport`, `_bug*`): max 4 kép (fájl / Ctrl+V / húzás, `_bugShrinkImage` 1920 px), rendszerinfó + `_vaErrorLog` (a script elején gyűjti a JS-hibákat), Rust `bug_report` → `va-product-site/register/bug.php`; dashboard `register/bugs.php` (státusz, megjegyzés, képek). **Licenc-szerver** (`va-product-site/register/`, PHP + MySQL, közös `lib.php` / `admin.php`): `index.php` serial kérése donoroknak (`va_donors`, címenként egyszer, `vaIssueSerial` sodium Ed25519 = `scripts/keygen.js`), `buy.php` + `paypal.php` + `webhook.php` PayPal Orders v2 fix áras vásárlás (5 €), `activate.php` aktiválás-jelzés (Rust `report_license_activation`), `stats.php` statisztika + kezelés, `download.php` letöltésszámlálás; titkok env-ből (`VA_SMTP_PASS`, `VA_SIGN_SEED`, `VA_DB_PASS`, `VA_PAYPAL_SECRET`, `VA_ADMIN_PASSWORD`); `keygen.js phpkey` / `donors-sql`; app: `license_request` (`#license-request`). **SID Player**: véletlen lejátszás (`_sidShuffle`, `_sidShuffleHistory`, `#websid-play-shuffle`) és kedvencek (`item.fav`, `.websid-play-item-fav`, a `.sidpl`-ben is). Product site: Freemium vs Professional táblázat (`#plans`), „JUST 5€” bélyeg. Customer message `id` = `version-control-258`.
Korábbi 2.5.7 újdonságok: **VA SID Core 1.2 — C64 a VICE-ból Rustban** (`src-tauri/src/mos6510.rs`, `src-tauri/src/c64/`): ciklusra pontos 6510 (`mos6510.rs`, a VICE `6510dtvcore.c` / `mainc64cpu.c` / `c64cpusc.c` portja: buszciklusonkénti `read`/`write`/`read_dummy`/`write_dummy` + `tick(1)`, VICE interrupt-késleltetés `INTERRUPT_DELAY`=2, branch / CLI / SEI / PLP szabályok, IRQPEND 3 ciklus, NMI-eltérítés BRK alatt, BA-lopás `ba_low`, ANE `$EF` / LXA `$EE`; a régi `sid_file/cpu.rs` törölve), CIA 6526 / 6526A (`c64/cia.rs`: `ciacore.c` + `ciatimer.c`, ciklusonként: timer-állapotgép `ciat_next`, IFR-késleltetősor, timer B bug, PB6/PB7, SDR, TOD), VIC-II időzítés (`c64/vicii.rs`: `viciisc` ciklustábla PAL / NTSC / régi NTSC, raster IRQ, badline, sprite-DMA + crunch, BA; pixelrajzolás nélkül), CPU-port (`c64/pla.rs`: pull-up, 6./7. bit falloff); a SID-lejátszó gépe ezekre épül (`cpu.idle`, `cpu.poll`, `interrupt_ready`). GPL: a VICE GPLv2+, a projekt GPLv3. **Hi-Res: cellánkénti háttérszín** (`cellpaper` eszköz, `_hgSetCellBg`, `_hgErase`, multicolorban letiltva `_hgSyncModeTools`). **Pontos karakter-ROM** (`_c64RomDisplayChar`: C64 Pro Mono PUA `U+E000/E100` + reverz `U+E200/E300`, `_c64RomPetsciiCode`). **Sprite szerkesztő**: hires réteg (`_spOverlay`, `_spOv`, `_spLayer`), kitöltés, kijelölés / mozgatás (`_spSel`, `_spLift` / `_spStamp`), forgatás (`_spRotate`), tükrözött animáció (`_spMirrorAnim`), sprite sheet import (`#se-sheet-dialog`, `_spSheetConvert`), hitbox (`_spHit`, `_spHitboxAsm`), X/Y ×2 előnézet, zoom 40×-ig (`tests/sprite-tools.test.js`). **Pálya szerkesztő**: objektumréteg (`LEVEL_OBJ_*`), karakter-attribútumok (`LEVEL_ATTR`), él-ellenőrzés, képernyőnkénti színek (`LEVEL_SCR_*`, `LEVEL_BORDER`), memóriamérleg + RLE (`level_unrle`), Futtatás VICE-ban (`_lvRunInVice`). **Karakterszerkesztő** (`setupCharEditor`, `_ce*`): csempe 1×1 / 2×1 / 1×2 / 2×2 (`_ceTileW/H`, `_ceGetT`/`_ceSetT`, `_ceClampSel`), visszavonás (`_cePushUndo`, `_ceUndoOp`/`_ceRedoOp`, Ctrl+Z/Y), rajzeszközök (`_ceTool`: pencil/line/rect/fillrect/fill), forgatás (`_ceRotate`, csak négyzetes csempe), másolás / beillesztés (`_ceClip`, `_ceCopy`, `_cePasteAt`, jobb klikk a térképen), húzásos csere / Shift-másolás (`_ceMoveTile`), kisbetűs ROM (`_ceLoadRom(2)`, `#ce-load-rom2`, `#ce-rom-lower`), szöveges előnézet (`_ceTextToCodes`, `{nn}`/`{$nn}`), tartomány-export (`_ceRange`, `_ceRangeAsm`, `#ce-save-range`/`#ce-copy-range`) (`tests/char-editor.test.js`). **Charset Canvas zoom** 2×–24× (`_ccZoom`, `_ccSetZoom`, `#cc-zoom`, Ctrl+görgő, `c64va-cc-zoom`; 8×-tól pixelrács a Grid mellett); hires karakter multicolor módban (Color RAM 3. bit, `_ccCharMc`, `_ccSetCellMode`, `cellmode` eszköz, a koordináták mindig hires 128×128-ban; `tests/charset-canvas-cellmode.test.js`), BG hires módban is; ECM (`#cc-ecm`, `_ccEcm`, `_ccEcmBg`, `cellbg` eszköz, BG0–BG3 = `_ccBg`/`_ccMc1`/`_ccMc2`/`_ccBg3`, `_ccEcmGlyphs`: mentéskor ≤64 különböző karakter összevonva, kód = glyph | bg << 6); a vászon csak a látható rész, karakterenkénti puffer-frissítés (`_ccBuf`, `_ccDirty`, `_ccRenderFast`, `_ccBlit`); Hi-Res szerkesztő ugyanígy (`_hgViewport`, `_hgBlitSoon`, `#hg-canvas-sizer`); SID Player lista megtartja a görgetést és mutatja az aktuális számot (`_sidPlayerRevealCurrent`). Customer message `id` = `c64-core-257`.
Korábbi 2.5.6 újdonságok: **SID Player** — `#sid-player-btn` → lebegő `#websid-play-dialog` (`_sidPlayerShow`, `_sidPlayerAddFiles`, lejátszási lista `_sidPlaylist`, `.sidpl` mentés/megnyitás, állapot `c64va-sid-player`); `_sidExtStartFile` → `_vaSidPlayFileBytes` (VA SID Core) vagy `_webSidPlayFileBytes`; tekerés csak VA SID Core-ral (`_vaSidSeek`); a lejátszó pufferei külön halmazban vannak (`_sidExtSources`), így az editor `_sidStop`-ja nem némítja el. **VA SID Core 1.1** — Rust SID-emuláció (`src-tauri/src/sid_core.rs`, `sid_file.rs`: 6581/8580, MOS 6581/8580-alapú 6581 szűrő, 6510 CPU, CIA/VIC időzítés, KERNAL `$EA7B` IRQ-farok), Tauri commandok `render_sid_preview` / `render_sid_file` / `sid_file_info` / `release_sid_*`; Beállítások → SID előnézet (`#sid-preview-engine`, `#sid-preview-model`). **SID szerkesztő** — tekerőgombok (`.sid-param-knob`), MIDI (`_sidMidiMessage`, `_sidMidiFlash`, `#sid-midi-led`), felvétel (`_sidRecordStart` / `_sidRecordTick`; a pattern végén `_sidRecordNextPattern` új patternt fűz a song-ba), metronóm + ütemlámpák (`_sidMetronomeBeat`, `#sid-beat`, `#sid-vkbd-beat`, `#sid-vkbd-metronome`, `#sid-vkbd-record`), pattern törlés (`_sidPatternDelete`, song átszámozás), GoatTracker .sng import (`_sidGoatImport` / `_sidApplyGoatImport`, `#sid-import-goat`, `tests/sid-goat-import.test.js`). **Freemium / Professional** — Ed25519 serial (`src-tauri/src/license.rs`, `LICENSE_PUBLIC_KEY`; `license_status` / `license_activate` / `license_deactivate`, `light_block` a Build PRG/D64/CRT, Exomizer, Ultimate és KFF2 commandokban), kulcsgenerátor `scripts/keygen.js` (privát kulcs a repón kívül: `~/.c64va/license-private.pem`; `csv` mód vásárlói listához); frontend `_vaLicense*`, `_VA_FULL_ONLY` (capture-fázisú kattintás-zár: szerkesztők, SID Player, Build, Exomizer, Ultimate/KFF2 futtatás), `_VA_FREE_LANGUAGES` (hu/en), `_VA_FREE_THEMES` (light/dark), `#license-dialog`, `#license-badge` (FREEMIUM / PROFESSIONAL az eyebrow mellett); Tauri nélkül (böngészős előnézet) teljes verziónak számít; `tests/license-keygen.test.js`. **Ultimate Basic 1.6.4.** Az About, customer message, update, Beállítások és What's New ablakban a szöveg nem jelölhető ki és a képek/linkek nem húzhatók (a szövegmezők kivételek). Customer message `id` = `sid-player-256`.
Korábbi 2.5.5 újdonságok: **Hi-Res szerkesztő pixelrács** — bekapcsolt Grid mellett 4×-es nagyítástól (`_HG_PIXEL_GRID_MIN_ZOOM`, `_hgPixelGridOn`) minden pixel felső és bal éle rácsvonal, a karaktercella-határon erősebb; a vonalak a pufferbe kerülnek (`_hgDrawPixelBuf`), így a blit ára nem nő, a Grid kapcsoló ezért `_hgRenderAll`-t hív. A vonal színe a pixel színéből számolódik (`_hgGridShade`, `_HG_GRID_FINE` / `_HG_GRID_CELL`: világos színen sötétít, sötéten világosít), ezért mind a 16 C64 színen látszik. 4× alatt a cellarács az overlay-ben marad (`_hgOverlays`), szélessége `_hgCellW()` — multicolorban 4 logikai pixel (korábban hibásan 8, azaz 16 hires pixel) (`tests/hires-grid.test.js`). **Hi-Res nagyítás 16×-ig** (`#hg-zoom` max). **Jobb klikkes Copy / Paste menü** a Hi-Res, Map és Sprite szerkesztő vásznán (Sprite: a frame-csíkon is, `_spShowCtxMenu`) — közös `_edShowCtxMenu(e, host, items)` / `_edHideCtxMenu` (`#ed-ctx-menu`, a `block-ctx-menu` + `sid-ctx-menu` stílusával; az ikont a toolbar gombról klónozza (`iconFrom`), a menü a szerkesztő `<dialog>`-jába kerül, a `mousedown` `preventDefault`-ja a dialógusban tartja a fókuszt); a menüből indított beillesztés előnézete a kattintás helyén jelenik meg; új i18n kulcsok mind a 7 nyelven: `edCtxPasteTransparent`, `edCtxCopyFrame`, `edCtxPasteFrame`. `_ctxMenuPlaceAt(menu, x, y)`: a középre igazított szerkesztő dialógus `transform: translate(-50%, -50%)`-ja miatt a `position: fixed` menü a dialógushoz képest pozicionálódott — a helper kiméri és levonja az origót; a SID tracker menüje (`_sidShowCtxMenu`) is ezt használja. Javítva: a Hi-Res toolbar Paste gombja a click eseményt kapta `transparent` paraméterként, ezért mindig áttetszően illesztett be. **Number Converter kapcsoló gomb** — `_ncSyncButton`: a `#numconv-btn` `main-tb-btn--active` + `aria-pressed` állapota követi a dialógust (megnyitáskor és a `close` eseményre). **Customer message** — `CUSTOMER_MESSAGE.id` = `editors-255`, mind a 7 nyelven a 2.5.5 újdonságaival. Kézikönyv: a Hi-Res kijelölés / másolás / beillesztés dokumentálva.
Korábbi 2.5.4 újdonságok: **Rejtett főablak javítás újraindításkor** — `tauri_plugin_window_state` (`lib.rs`, `run()`): a `StateFlags::VISIBLE` már sehol sem mentődik (macOS/Windows: `StateFlags::all() - VISIBLE`, Linux: csak `SIZE`) — a kilépéskor lekicsinyített / másik Space-en lévő ablak `visible=false`-ként mentődött, és többé nem jelent meg (macOS, Linux/Wayland). A főablakot a frontend mutatja meg (`applySavedTheme`, két `requestAnimationFrame` után `getCurrentWindow().show()`), tartalékként a `setup` 3 mp múlva `show()` + `set_focus()`-t hív, ha a `main` ablak még nem látható. `src-tauri/capabilities/default.json`: `core:window:allow-show`, `core:window:allow-set-focus`. **UltimateBasic 1.6.3** (`Cargo.lock` → `1dae579`) **a UB szerkesztőben** — QBasic-stílusú szintaxis (`dim … as …` skalárok és bármilyen típusú tömbök, `function` / `sub` `as` típusokkal, `elseif`, `do … loop [while|until]`, `while … wend`, `select case`, `exit do|for|while|sub|function`, egysoros `if`, `'` megjegyzés, `print a; b`, futásidejű stringek `left$` / `right$` / `mid$`, előjeles `integer`): `_UB_KEYWORDS` + `dim`, `function`, `do`, `wend`, `elseif` (a nem létező `restore` kikerült); `_UB_FUNCTIONS` + `left$`, `right$`, `mid$`; kontextusfüggő szavak, amelyeket a fordító sima névként olvas, ezért a `_ubHighlightSource` csak a helyükön színezi: `as` + `_UB_BASIC_TYPES` (`byte`, `integer`, `single`, `double`), `_UB_CONTEXT_KEYWORDS` (`case is`, `map view`, `wait key`, `scroll row|x|y`), `_UB_SCROLL_WORDS` (`left`, `right`, `narrow`, `wide` egy `scroll` utasításban); a `'` a `#`-hoz hasonlóan megjegyzést kezd (kiemelő, `_ubFormatText`, minimap; asm blokkban nem); `_ubAcUpdate`: BASIC típusok, a leírás-térképben a pontos nevű bejegyzés nyer (az `exit sub` nem írja felül az `exit`-et); `_ubFormatText` blokk-veremmel dolgozik: a `function` / `do` nyit, a `wend` és (közvetlenül DO-ban) a `loop` / `loop while|until` zár, az `elseif` az `else`-hez hasonlóan vált ágat, az egysoros `do … : loop` / `while … : wend` / `for … : next` nem húz be; minimap deklaráció-szín `dim` / `function`; `_ubRenderProjectSymbols` a `function`-t is függvényként listázza; `_UB_COMMAND_REFERENCE`: új `dim`, `function`, `elseif`, `wend`, `do`, `select case`, `end`, `exit sub`, `left$`, `right$`, `mid$`, bővített `print`, `sub`, `call`, `if`, `while`, `loop`, `for`, `break`, `input`, `comments`, `arrays`, `types`, `operators`, `string functions`, `string conversion`; 7 nyelvű leírás (`ubCommandDescriptions*`); `tests/ultimate-basic-highlight.test.js`.
Korábbi 2.5.3 újdonságok: **Windows VICE-indítás javítás** — `windows_spawn_detached` (`lib.rs`): PowerShell teljes úton (`windows_powershell_path`; a régi `Command::new("powershell")` PATH nélkül „program not found”-ot adott), hibánál közvetlen spawn (`DETACHED_PROCESS`), `canonicalize` a linkelt exe-re (winget), munkakönyvtár + PATH = az exe mappája, `windows_ps_arg` idézőjelezi a szóközös útvonalat (`Start-Process -ArgumentList` nem teszi); VICE, RetroDebugger, D64 futtatás; a frissítő is teljes úton hívja a PowerShellt. A VICE útvonal a `bin\x64sc.exe` legyen (a DLL-ek mellett).
Korábbi 2.5.2 újdonságok: **SID előnézetek a valódi SID-en** — WebSid regiszter-stream (`_sidStreamPrg`: kis PSID $1000-n, 64 frame-es ring $2000-n, rd/wr `$1F00/$1F01`, újraindított hangoknál előbb gate-off; `_sidStreamEnsure`, `_sidStreamPump`, `_sidStreamNote` (hang-kiosztás a 3 voice-ra), `_sidStreamSilence`, `_sidStreamPreload` megnyitáskor és Stop után; `_webSidLoadPsid` + `_webSidLoadSeq`): a hangszer-előnézet, virtuális billentyűzet, hangbeírás, akkord/arpeggio, sor- és egy patternes lejátszás is a WebSid-en szól, a `_sidSynthRender` csak tartalék (és „Play: All” alatt) (`tests/sid-stream.test.js`). Wave/arpeggio előbeállítás-lista megtartja a választást (`inst._tablePreset`, `_sidTableEdited`). Virtuális billentyűzet címe **VA-VK**, Play/Stop gomb (`#sid-vkbd-play/stop`), állapot `c64va-sid-vkbd` (hely, open, oktáv, insert; a `_sidInit` olvassa — TDZ), pozicionálás `_sidPlaceFixed`. Master hangerő mentve (`c64va-sid-master-vol`). Note-off: hang nélküli `C` effekt `===`-ként (`_sidIsNoteOff`, `_sidGridCellText`; billentyű 1 / ` / =, cellába `===`/`OFF`). Leválasztható tracker: `#sid-tracker-section` a `#sid-tracker-dock` és a lebegő `#sid-tracker-float` között (`_sidSetTrackerDetached`, `_sidPlaceTrackerFloat` — a dialógus transform miatt containing block; `c64va-sid-tracker-float`). Knowledge Base: C64 OS devenvironment + png2c64 link, kétoszlopos lista.
Korábbi 2.5.1 újdonságok: **SID Editor hangszerek + új lejátszó** — hangszer-modell (`_sidNewInst`/`_sidInstNorm`): `ring`/`sync`, szűrő `filt`/`off3`/`cutEnd`/`cutSpeed`/`cutPing`, vibrato `vibDelay/Speed/Depth`, PWM `pwmSpeed/Min/Max`, `gateTimer`/`hr`/`firstWave`, wave/arpeggio tábla (`table`, `tableLoop`, `tableSpeed`, előbeállítások `_SID_TABLE_PRESETS`); `_sidTuneData` paraméter-tömbök; frame-alapú 6502 lejátszó (`_sidExportAsmPlayable`: `sid_frame`, `sid_hr_check`, `sid_update`, állapot `sid_state`, ZP `$02-$1C`/`$2F`/`$FB-$FD`); JS motor (`_sidEngineNew`/`_sidEngFrame`) + SID-szintetizátor (`_sidSynthRender`) az előnézethez (`_sidPlayNote`, `_sidWaStart`); `.bin` `0xFD` formátum (nevek, sebesség); `tests/sid-player.test.js` + `tests/mini6502.js` (lejátszó = motor frame-ről frame-re). **Virtuális billentyűzet** 2/3/4 oktáv (`c64va-sid-vkbd-octaves`), C64 szinti kinézet. **UltimateBasic 1.6.2**: `tune` `imod`/`ifilt`/`igate`/`itab` (UB `compiler/tune.rs`, ugyanaz az algoritmus; fixture: `node scripts/sid-ub-fixture.js <UB>/tests/fixtures`), VA UB-export és parancsreferencia. **Könyvjelzők + Ugrás sorra** (`_bm*`, `_gotoLine*`, `#goto-line-dialog`, Ctrl+F2/F2/Shift+F2/Ctrl+G, `c64va-bookmarks`). **Eval-mentes kifejezések** (`_evalJsExprSafe`, a release CSP tiltja az `eval`-t; `tests/safe-expr.test.js`). **D64 Editor** dialógusok az aktív munkamappában (`choose_d64_open/new` `directory`), **Build projekt** jelentés kimeneti mappával.
Korábbi 2.5.0 újdonságok: **Pálya szerkesztő (Level Editor)** — toolbar gomb a Map Editor mellett, `#level-editor-dialog` (`setupLevelEditor`, `_lv*` állapot, `_lvComposeMap`): Map Editor képernyők függőleges / vízszintes / rács elrendezésben, sima görgetésű előnézet, mentés `.bin`-be VA meta trailerrel (`VA-BIN1!`, kind `lv-level`), teljes Screen / Screen+Color RAM, blokk/asm export (`tests/level-editor.test.js`). **LEVEL / LEVEL_ROW makró** — `.level "f.bin"[, $2000]` INCBIN-variáns (`incBinLevel`, `_levelInfo`/`_levelBuild`, `_incBinPayload`): csak az elhelyezett képernyők + pointer-táblák, `LEVEL_*` címkék/konstansok (`addLayoutLabels`), max 7×10; `.level_row dst, col[, color]` (`isLevelRowMacro`, `_levelRowBytes`, 132 byte, önmódosító) (`tests/level-macro.test.js`). **JOYSTICK változós mód** — `.joystick port, vx, vy[, fire]` (`_joyVarBytes`, −1/0/+1), port 3 = mindkét port (`tests/joystick-macro.test.js`). Minta: `samples/level-demo.asm` (2×5 pálya, dupla puffer, XSCROLL/YSCROLL, tépésmentes). **Számrendszer-átváltó** — `#numconv-btn` → nem modális `#numconv-dialog` (`setupNumberConverter`, `_ncParse`/`_ncFormat`, `dialog.show()`), pozíció a közös `_editorDialogPositions`-ben, érték/szélesség/nyitott állapot `localStorage` `c64va-numconv` (az állapotot `setTimeout`-ban tölti, TDZ miatt) (`tests/number-converter.test.js`). **Példák dialógus** — a `#load-sample` gomb („Példák…”) a modális `#sample-dialog`-ot nyitja (`_openSampleDialog`, `_SAMPLE_CATEGORIES`, keresés, ↑/↓, Enter/dupla klikk); a rejtett `#sample-select` marad az adatforrás. **UltimateBasic 1.6.1** (`Cargo.lock` → `5d97218`): `map load "level.bin"[, cím]`, `map view px, py`, 16 bites szorzat-összeg javítás; UB parancsreferencia `map view` bejegyzés, `map` leírás `.ubmap` nélkül, rangsorolt keresés (`_ubRenderCommandReference`).
Korábbi 2.4.9 újdonságok: **Projekt sablonok** — `templates/*.asm` + `templates/*.ub` (Tauri resource, `list_templates` mindkét kiterjesztést listázza), Menu → File → Új projekt sablonból… és új `#new-project-btn` toolbar gomb (Menu és Tutorial között) → `_openTemplateDialog`; `#template-kinds` Assembler / UltimateBasic kapcsoló (`_templateKind`, UB módban UB-n nyílik); fejléc `; @name …` / `# @name …` (`_parseTemplateSource` → `kind`), `{{PROJECT}}` csere; `_templateCreateProject`: Assembler → `main.asm` + `.proj`, Expert mód; UB → `main.ub` + `.proj` `"app": "ultimate-basic"`, UB projektként (`_ubProjectData`, startup tab, projekt panel); 4 UB sablon (üres, játék, hires bitmap, raszter IRQ), `tests/project-template.test.js`. **Build projekt** — Menu → Build → `#build-project` (`buildProjectToFiles`): a projekt / nyitott fülek minden fordítható fájlja a forrás mellé `.prg`-be, debugger sidecarokkal, include-olt modulok kihagyva, jelentés a Build Info dialógusban. **Ctrl+görgő zoom** — `_bindCtrlWheelZoom` az Expert és UB szerkesztőn. **Munkaterület** — a `.vaws` az Expert/UB projekt-állapotot is menti (`tests/workspace-project.test.js`). **UltimateBasic** `Cargo.lock` → `f0ac8d6` (optimalizált kódgenerálás), UB memóriatérkép adatrégiókkal (`tests/ub-memory-usage.test.js`); fájl-dialógusok az aktív munkamappában.
Korábbi 2.4.8 újdonságok: **UltimateBasic 1.5.9** (`Cargo.lock` → `fc0daa7`): új `chain` parancs (`_UB_KEYWORDS`, `_UB_COMMAND_REFERENCE` + 7 nyelvű leírás), `load` másodlagos cím javítás, D64 javítások; a referencia `sprite collision` bejegyzésében a `sprhit()`/`sprbghit()` rövid alak. **KOALA makró** — `.koala "f.koa"[, $2000]`: INCBIN-variáns (`isIncBinMacro` + `incBinKoala: true`, mnemonic `KOALA`, `_importMakeKoala`), így a fájlkezelés/újratöltés/projektmentés/deferred elhelyezés az INCBIN-é; saját: `_koalaData` (10003 → fejléc levágva), `_koalaError` (csak `$2000`/`$6000`, 10001/10003 bájt), `_koalaShowBytes` (86 bájtos rutin: screen/color RAM másolás 4×250, `$D021`, `$DD00` bank AND/ORA, `$D011=$3B`, `$D016=$18`, `$D018=$18`), `getInstructionSize` = `_KOALA_SHOW_SIZE`; ASM nézet/disasm/univerzális export/deferred szekciók KOALA-ágai, mnemonic-leírás panel (`macroAddrKoala*`, `paletteKoala`), `tests/koala-macro.test.js` (mini 6502 szimulátor). **Hires editor Koala** — `_hgExportKoala` / `_hgImportKoala`, Files menü `#hg-import-koala` / `#hg-export-koala`, `tests/hires-koala.test.js`. **Frissítés** — `#expert-update-status` (minden `[data-update-status]` elemet `_updateRenderStatusbar` frissít), `save_bin` a javasolt fájlnév kiterjesztését teszi első szűrőnek, `va-product-site/downloads/VA/index.php` + `.htaccess` listázza a telepítőket (a frissítő ezt olvassa, a `download.php`-s főoldalon nincs fájlnév), Linux helper `env_remove(LD_LIBRARY_PATH/LD_PRELOAD)`.
Korábbi 2.4.7 újdonságok: **Önfrissítés** — `check_for_update` / `download_and_install_update` Tauri commandok (`lib.rs`, „Self-update” szekció): a legfrissebb verziót a termékoldal (`https://www.c64va.pro/`, fallback `downloads/VA/`) letöltési linkjeiből olvassa ki (`update_asset_pattern`: Win x64/arm64 `-setup.exe`, macOS x64/aarch64 `.dmg`, Linux AppImage/`.deb`/`.rpm`), a JS csak a verziót adja át, az URL-t a Rust építi. Telepítés: Windows `Start-Process` NSIS `/P /R`, macOS DMG → `.app` csere helper scripttel, Linux AppImage csere vagy `pkexec apt-get/dnf`; utána `app.exit(0)`. Frontend: `checkForAppUpdate({silent})` (Menu → Check for Update + induláskor 6 mp-cel, csendben), `#update-dialog` progress sávval (`update-download-progress` event), „Skip this version” (`localStorage` `c64va-update-skip-version`), `#ub-update-status` jelző az UB statusbarban (`_updateRenderStatusbar`). **Curve Editor → UB export** — `_cgExportUb` (`var név = array(N)`/`array_word(N)` + `data név: …`) és `_cgExportDemoUb` (sprdef labda + raszter-szinkron hurok, 8 bit → sprite Y, 16 bit → sprite X, Bresenham söprés), közös `_ubInsertOrCopy` (SID UB export is ezt használja). Ehhez **UltimateBasic 1.5.8** kell: új `data <tömb>: …` tömb-inicializálás (`Stmt::ArrayData`, `collect_array_inits`, `emit_array_init_copies`). **Layout** — `_fitWorkspaceHeight` a valós szabad magasságból számolja az `--editor-max-depth`-et (nincs app-shell scroll), output panel min. 440 px (`_WS_OUTPUT_MIN` + grid `minmax(440px, …)`), working folder halvány jelvény az ASM nézet fejlécében és az Expert/UB toolbarban; `.app-confirm-buttons` gombfelirat nem törik.
Korábbi 2.4.6 újdonságok: **SID Editor → UltimateBasic export** — új `#sid-export-ub` Files menüpont (`_sidExportToUb`, `_sidExportUbBlock`): `tune ... end` blokkot (hangszerek `inst`, `order`, `pat` sorok `_sidCellText` cellákkal, max 8 pattern) + `music play`-t generál; UB módban a kurzorhoz szúrja be, egyébként vágólapra másol (`sidExportUb*` i18n kulcsok, `tests/sid-ub-export.test.js`). A lejátszót az UltimateBasic fordító építi (`src/compiler/tune.rs`, zero-page-mentes; `sid_init`/`sid_play` konstansok, a `music play/stop` változatlanul működik) — ehhez `tune`-t ismerő UltimateBasic kell (a `Cargo.lock` rev-jét frissíteni). Az UB inline assembler `label,X/Y` hibája is javítva ott. **UB nyelvi frissítés** — `sfx`, `org`, `tune` kulcsszó (`_UB_KEYWORDS`, a `tune` blokkon belüli `inst`/`order`/`pat`/`speed` külön kiemelve), `charset on/off` és `incbin` szeletelés a parancsreferenciában (`sfx`/`org` leírás mind a 7 nyelven, a `charset`/`incbin` bővítés HU/EN). **ASM nézet többes kijelölés** — `applyAsmHighlight(blockIds, scrollToId)` id-listát fogad, a sorszám és az elválasztó külön span (`asm-tok-lineno-sep`). **Assembler mód megőrzése UB váltásnál** — `lastAssemblerEditorMode` (localStorage), projekt/minta betöltése előtt kilépés az UB-ből. **KFF2** — `#kff2-detect-btn` (`detectKff2Port`), firmware v2.07+ a kézikönyvben.
Korábbi 2.4.5 újdonságok: **Kung Fu Flash 2 futtatás** — új `kff2` run mód (`runOnKff2`, `getRunModeLabel`, `setRunMode`, `validRunModes` és a `run-kff2-mode` menüpont az `index.html`-ben): a PRG USB soros kapcsolaton közvetlenül valódi C64/C128-ra töltődik egy Kung Fu Flash 2 cartridge-en át, Block, Expert és UB módban egyaránt (`_ubRun` `usesKff2` ága). Hardware Settings-ben új `#kff2-port` mező (`setupKff2Settings`, `localStorage.kff2Port`), induláskor USB VID/PID (`0483:5740`) alapú automatikus portfelismerés (`detect_kff2_port`). Rust oldalon új `serialport` függőség és `run_on_kff2` command (`run_on_kff2_port`): PRG validálás (`kff2_validate_prg`), 1200 baudos „MENU touch”, újracsatlakozás, `EFSTART:PRG\0` handshake (`LOAD\0`/`WAIT\0`), méret-egyeztetés, PRG küldés és lezárás-ellenőrzés. i18n: `runOnKff2`, `kff2*`, `workProgressRunKff2`/`workProgressSuccessKff2` mind a 7 nyelven. **Átméretezhető Program/ASM panelek** — `.ws-resizer` elválasztó a `.program-panel` és `.output-panel` között (`_applyWorkspaceColumns`, `_initWorkspaceResizers`, `wsProgramShare` a `saveUiSettings`-ben; min. 260 px, nyilak ±16 px, dupla kattintás → 50/50; Expert/UB módban és 1100 px alatt rejtve). **ASM nézet** — a makrósorok `; ` nélkül jelennek meg (`renderAsmOutput` utólagos `.map`, `highlightAsmLine` új `.xxx` ága; a `COMMENT` blokkok érintetlenek). **Expert kiemelés** — `hl-macro` (név a `.macro`/`.invoke`/`.call` után és `:név`), `hl-macro-param` (`{param}` és `.macro` fejléc paraméterei) `_expertHighlightLine`-ban, témánkénti `--hl-macro`/`--hl-macro-param` változókkal. **About dialógus** kétoszlopos, átlátszó hátterű Ultimate Basic banner; **Web64** szekció a termékoldalon; `macro-with-parameter` minta `.macro setColor(color)` alakra frissítve.
Korábbi 2.4.3 újdonságok: **SID Editor effekt-oszlop** — minden tracker cella hordozhat egy effektet a note mellett: vibrato (**V**), slide fel/le (**U**/**D**), note-cut (**C**), sebesség-váltás (**F**) (`_SID_FX_CODES`/`_SID_FX_NAMES`, `_sidApplyRowEffect`, `_sidVoiceState`), amik helyesen játszódnak vissza mind a Web Audio előnézetben, mind a fordított 6502 exportban (`_sidExportAsmPlayable` bővített zero-page táblával, `$02`–`$2F` + `$FB`–`$FE`). **SID Editor song/order list** — minták egy song/order list-en keresztül vannak elrendezve a nyers pattern bank felett, ismételhetők, a dal hosszabb lehet a tárolt minták számánál; a mentett formátum verziójelzőt hordoz, régi (effekt nélküli) `.bin` mentések továbbra is betölthetők. Új `tests/sid-effects.test.js` és `tests/sid-song.test.js`. **D64 Editor explicit Save workflow** — a szerkesztések (add/extract/rename/delete, Block Editor byte-szerkesztés) mostantól egy munkapéldányon landolnak (`_d64EdState.path` vs. `_d64EdState.origPath`, `_d64EdState.dirty`), és csak expliciten Save-elve (`_d64EdSave`/`_d64EdSaveAs`) íródnak vissza a valódi fájlba, automatikus biztonsági mentéssel (`_d64EdBackupDisk`) és mentetlen változás esetén megerősítési kéréssel (`_showConfirm(t("d64EditorUnsavedConfirm"))`); `_d64EdCleanupTemp` takarítja a munkapéldányt. **Block Editor hex grid** — a Block Editor mostantól új byte-onkénti hex griddel jeleníti meg a kiválasztott 256 byte-os blokkot, és a dialógusa már nem homályosítja el az app többi részét (`.dbe-dialog::backdrop`).

Korábbi 2.4.2 újdonságok: **D64 Editor drag & drop, include-generálás és blokk szerkesztő** — lásd fent a "D64 Editor" szakasz kiegészítéseit; új Rust `write_bin_file` command és `tests/d64-block-editor.test.js`.

Korábbi 2.4.1 újdonságok: **lengyel és olasz UI nyelv** — teljes felület-fordítás az `i18n.js`-ben (`translations.pl`/`translations.it`, `mnemonicDescriptionsPl/It`, `ubCommandDescriptionsPl/It`) a meglévő HU/EN/ES/DE/NL mellé; **Online Help toolbar gomb** — `#online-help-btn` a Debug után, a c64va.pro/docs.html-t nyitja; **mnemonik leírások kiszervezése** — a `mnemonicDescriptions*` táblák az `app.js`-ből `translations.<nyelv>.mnemonicDescriptions` alá kerültek az `i18n.js`-be, mellékesen javítva egy régi hibát, ahol egy spanyol duplikáció felülírta pár angol mnemonik leírást (PRINT, PRINT_HEX, CLEAR_SCREEN, WAIT_KEY, SET_BORDER, SET_BG, IRQ_SETUP, RAND).

Korábbi 2.4.0 újdonságok: **D64 Editor** — új toolbar-ikon (Curve Editor mögött) egy önálló lemezkép-szerkesztő dialógushoz (`#d64-editor-dialog`, Sprite Editor stílus, Files ▾ menü New/Open/Save As/Run in VICE); meglévő `.d64` directory listázása/program hozzáadás/kimentés/átnevezés/törlés közvetlenül a lemezképen `c1541`-en keresztül (`d64_list`/`d64_add_file`/`d64_extract_file`/`d64_rename_file`/`d64_delete_file` Tauri commandok); hozzáadásnál opcionális betöltési cím, kicsomagolási cím, Exomizer tömörítés (a Build D64 extra fájlok logikáját újrahasznosítva) és PRG/SEQ/USR/REL típusválasztó; directory lista C64Pro fonttal, nagybetűsen; javított rename-input click bug; sötétebb/láthatóbb `.editor-mode-indicator` világos témában.

Korábbi 2.3.9 újdonságok: `*` (program counter) minden operandus-kifejezésben (`BNE *-5`, `JMP *+20`, `LDA #<*`; érték után álló `*` marad szorzás — `_substituteStarPc`/`_hasStarPcRef`/`_evalAsmExpr`); lokális (pontos) labelek scope-olva a legközelebbi globális labelre (`getProgramLayout` klón-pass, `parseAsmText` már nem strippeli a pontot); long branch pseudo-opok `LBNE…LBVS` (`isLongBranchMacro`, `HosszuUgrasok`) → invertált `Bxx *+3` / `JMP` = 5 byte; `.assert <expr>[, "üzenet"]` (`isAssertMacro`) fordítási idejű ellenőrzés; SMC operandus-label `LDA value:#$00` (`smcLabel` → `addr+1`); barátságos out-of-range branch hiba `LBxx` javaslattal.

Korábbi 2.3.8 újdonságok: Munkaterület mentés/megnyitás (`.vaws`) — a nyitott, fájlhoz kötött fülek pontos halmaza, aktív fül és fül-módok mentése/visszatöltése, auto-save-lel és induláskori auto-restore-ral; globális memória panel toggle; UB parancsreferencia lokalizálva (HU/EN/ES/DE/NL, angol fallback); frissített UB grafikus parancs dokumentáció; javított KERNAL SETLFS/PLOT referencia; magas memóriahasználat javítva sok nyitott fülnél (per-tab undo/redo history korlátozva debounce-szal); felesleges Expert/UB breakpoint toolbar gombok eltávolítva; Expert toolbar magasság a UB-hez igazítva.

Korábbi 2.3.7 változások: Undo/Redo és többblokkos szerkesztés; Block/Expert/Ultimate Basic breakpointok külső RetroDebugger integrációval, source map/label sidecarokkal, `-pass`, SYS-aware `-autojmp` és plain PRG `-jmp` indítással; opcionális BASIC stub megjelenítés mindhárom mód Disassembler/Monitor nézetében; új UB Monitor panel; PRG load-address, startup-file debugger kontextus és disassembly origin javítások; UB caret/üres sor/nyomva tartott kurzor/minimap, valamint UB és Expert sorszám-illesztési javítások.

Korábbi 2.3.6 változások: **Build CRT** (Magic Desk 64K cartridge, type 19) export block; `buildMagicDeskCrt(payload, loadAddr, entryAddr)` 8×8 KB bankba csomagolja a payloadot, bank-0-ban CBM80 header + 128 byte-os loader RAM-ba másolja a byte-okat és `JMP` az entry-re a cart disable után; max payload 65 408 byte. D64 export dialóg input mezők magasság fix, kézikönyv KERNAL `RESTOR` caveat-tel.

Verzió növelésekor:
1. `package.json` → `"version"` mező
2. `src-tauri/tauri.conf.json` → `"version"` mező
3. `src-tauri/Cargo.toml` → `version` mező
4. `index.html` → `#whats-new-dialog` verzió + bejegyzések (mindig angolul!)
5. `README.md` → `Current version` sor + új What's New szekció
6. `.github/copilot-instructions.md` → verzió sor frissítése
7. Mac + Windows build az aláírási procedúrával

---

## ASM import — `_importMakeInstruction` operandus parsing

Az `parseAsmText()` → `_importMakeInstruction()` függvény 6502 assembly szöveget alakít program blokkká.

**Támogatott `label,X` / `label,Y` minták** (regex alapján azonosítva a catch-all előtt):

| Minta | Addressing mode | rawOperand |
|-------|-----------------|------------|
| `(label,X)` | `indirectX` | `label` |
| `(label),Y` | `indirectY` | `label` |
| `label,X` vagy `label+offset,X` | `absoluteX` | `label` vagy `label+offset` |
| `label,Y` vagy `label+offset,Y` | `absoluteY` | `label` vagy `label+offset` |

**Regex minták:**
```js
/^\([A-Za-z_][A-Za-z0-9_]*,X\)$/i           // (label,X)
/^\([A-Za-z_][A-Za-z0-9_]*\),Y$/i           // (label),Y
/^[A-Za-z_][A-Za-z0-9_]*(?:\s*[+-]\s*(?:\$[0-9A-Fa-f]+|\d+))?,X$/i  // label,X
/^[A-Za-z_][A-Za-z0-9_]*(?:\s*[+-]\s*(?:\$[0-9A-Fa-f]+|\d+))?,Y$/i  // label,Y
```

**Tipikus hiba:** ha ezek az ágak hiányoznak, `"ras1start,X"` teljes stringként kerül `rawOperand`-ba `"absolute"` mode-dal → 7 validációs hiba importáláskor.

---

## Fordítási rendszer — tooltip konvenció

**Minden gombnak legyen `title` és `aria-label` attribútuma** — ezeket az `applyTranslations()` állítja be a `t(key)` segédfüggvénnyel.

Minta:
```js
myButton?.setAttribute("title", t("myKey"));
myButton?.setAttribute("aria-label", t("myKey"));
```

**Új translation key hozzáadásakor** mindig frissítsd mindkét objektumot:
- `translations.hu.myKey = "Magyar szöveg"`
- `translations.en.myKey = "English text"`

**Meglévő gombok tooltip kulcsai** (`applyTranslations()`-ban beállítva):

| Elem | Translation key |
|------|-----------------|
| `#hardware-settings-btn` | `hardwareSettings` |
| `#crt-toggle` | `crtToggle` |
| `#zoom-in` / `#zoom-out` | `zoomIn` / `zoomOut` |
| `#help-manual-btn` | `helpManual` |
| `#about-btn` | `about` |
| `#whats-new-btn` | `whatsNew` |
| `#knowledge-base-btn` | `knowledgeBase` |
| `#check-update-btn` | `checkForUpdate` |
| `#report-bug-btn` | `reportBug` |
| `copyAsmButton` | `copyAsm` |
| `clearProgramButton` | `clearProgram` |
| `runEmulatorButton` | `runInEmulator` |
| `runDebuggerButton` | `runInDebuggerTitle` |
| `collapseAllButton` / `expandAllButton` | `collapseAll` / `expandAll` |

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
// 18: sprite-macro-demo
// 19: joystick-demo

// applyTranslations()-ban:
if (sampleOptions[18]) sampleOptions[18].textContent = t("sampleSpriteMacroDemo");
if (sampleOptions[19]) sampleOptions[19].textContent = t("sampleJoystickDemo");
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
- Felhasználói makrók definiálása paraméterekkel
- `MACRO name [param1, param2, ...]` ... `ENDM` blokkokban; `block.macroParams` (string, vesszővel elválasztva, pl. `"color"` vagy `"color, count"`)
- A makró törzsében `{paramNév}` helyőrzők cserélődnek az INVOKE argumentumaira expanzió során
- `parseUserMacros()` → `userMacros[name] = { params: string[], body: blockArray }` struktúra
- Expanzió: `getProgramLayout()` során inline, `applyParams(raw)` végzi a `{param}` → arg cserét
- Expert szintaxis: `.macro setColor color` / `.invoke setColor(#$07)` (zárójelek); több param: `.invoke drawPixel($10, $20)`; visszafelé kompatibilis szóközes forma is elfogadott
- `block.invokeArgs` (string): a hívási argumentumok vesszővel elválasztva (pl. `"#$07, $20"`)
- Blank lines (üres sorok) az expert módban `isBlankLine: true` blokkként tárolódnak; 0 byte, block módban vékony szaggatott vonal, ASM outputban üres sor

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

### "CONST label-lel CPX absolute módban nem wrap-el a loop"
→ `CPX scrolltext_len` absolute addressing mód `CPX $004E`-t generál (ZP címről olvas), nem `CPX #$4E`-t (immediate összehasonlítás). Használj `addressingMode: "immediate"` és `operand: "#scrolltext_len"` formátumot.
→ **scroll-text-demo javítva:** `scrolltext_len` 78→79 (a szöveg 79 karakter), `CPX scrolltext_len` absolute→immediate

### "Disassembler nézetben undefined mnemonik"
→ `_REV_OP` tábla `mnem` property-t tárol, nem `mnemonic`-t. `_disasmBytes`-ben `info.mnem`-et kell olvasni.

### "Disassembler nézetben makró nevek jelennek meg (LOOP, NEXT, WAIT_RASTER)"
→ Kis makrók (≤8 byte) korábban a short path-en mentek és a blokk mnemonikját mutatták. Most `opcodeMap[mnem]` check: ha nincs benne → makró → `_disasmBytes` hívás.

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

---

## Tutorial / Guided Tour rendszer

### Fájlok

| Fájl | Szerep |
|------|--------|
| `www/tutorial-data.js` | `window.TUTORIAL_DATA` — összes kategória, lecke és lépés adata |
| `www/app.js` (~15074–15900) | Tour engine: state, renderelés, lépés-logika, spotlight/kártya pozicionálás |

---

### Adatstruktúra (`tutorial-data.js`)

```js
window.TUTORIAL_DATA = {
  categories: [
    { id: "featured",     labelHu: "Kiemelt",   labelEn: "Featured" },
    { id: "tour",         labelHu: "Bemutató",  labelEn: "Tour" },
    { id: "basics",       labelHu: "Kezdőknek", labelEn: "Beginners" },
    { id: "fundamentals", labelHu: "Alapok",    labelEn: "Fundamentals" },
    { id: "advanced",     labelHu: "Haladó",    labelEn: "Advanced" }
  ],
  lessons: [ /* ld. alább */ ]
}
```

#### Lecke (lesson) objektum

```js
{
  id: "guided-first-text",       // egyedi string azonosító
  category: "basics",            // kategória id
  type: "lesson" | "tour",       // "tour" = bemutató, "lesson" = oktatás
  interactive: true,             // ha true → Start Tour gomb megjelenik
  difficulty: 0,                 // 0 = tour (csillag helyett "TOUR"), 1-3 = nehézség
  titleHu: "...", titleEn: "...", titleEs: "...",
  descHu:  "...", descEn:  "...", descEs:  "...",
  sample: "basic-colors",        // opcionális: sample betöltése a leckéhez
  steps: [ /* ld. alább */ ]
}
```

#### Lépés (step) objektum — minden mező opcionális

```js
{
  // --- Spotolás ---
  target: "#mnemonic-select",       // CSS selector; null = nincs spotlight, kártya középre
  centerCard: true,                 // ha true → kártya mindig középen (NE add target-es lépésnél!)

  // --- Tartalom ---
  titleHu: "1/27 — ...", titleEn: "...", titleEs: "...",
  descHu:  "...",         descEn:  "...", descEs:  "...",

  // --- Automatikus UI előkészítés ---
  onEnterActionId: "prep-sei",      // meghívja _runTutorialStepAction() az adott id-vel

  // --- Automatikus továbblépés ---
  advanceOnTargetClick: true,       // továbblép ha a target-et kattintják
  advanceOnTargetChange: true,      // továbblép ha a target értéke megváltozik ÉS egyezik targetValue-val
  advanceOnTargetInput: true,       // továbblép input eseménynél ha értéke egyezik targetValue-val
  targetValue: "SEI",               // elvárt érték (case-insensitive hex #operand-input-nál)
  caseInsensitiveTargetValue: true, // kisbetű/nagybetű ignorálás

  // --- Menü kezelés ---
  openMenu: true,                   // megnyitja a .control-menu-t a spotolás előtt
  positionDelay: 300,               // ms várakozás pozicionálás előtt (pl. dialóg animáció)

  // --- Egyéb ---
  loadSample: "basic-colors",       // megjelenít egy "Load sample" gombot a lépésben
  actionId: "...",                  // megjelenít egy akció gombot (actionLabelHu/En/Es kell)
  highlight: ".program-panel",      // opcionális extra kiemelés
}
```

---

### Tour engine state változók (`app.js`)

```js
let _tourActive          = false;   // fut-e tour
let _tourCurrentStep     = 0;       // aktuális lépésszám
let _tourSteps           = [];      // a futó tour lépéstömbje
let _tourLessonId        = null;    // futó lecke id
let _tourMenuOpened      = false;   // megnyitotta-e a tour a menüt
let _tourAllowOverlayClose = true;  // overlay-kattintással bezárható-e
let _tourInteractiveMode = false;   // interactive=true leckéknél aktív
let _tourPreparedLessonId = null;   // onEnterActionId prepare guard
let _tourRepositionRaf   = 0;       // rAF handle reposition-höz
```

---

### Kulcs-függvények (`app.js`)

| Függvény | Leírás |
|----------|--------|
| `openTutorialDialog()` | Megnyitja a tutorial dialógot |
| `_tutRenderDialog()` | Felépíti a kategória/lecke listát |
| `_tutShowLesson(lessonId)` | Megjeleníti egy lecke tartalmát |
| `_tourStart(lesson)` | Elindítja a tour-t (beállítja `_tourSteps`, `_tourActive`) |
| `_tourShowStep(stepIndex)` | Megjeleníti az adott lépést: kártya tartalma + spotlight pozíció |
| `_runTutorialStepAction(actionId)` | Végrehajtja az `onEnterActionId` akciót |
| `_tourBindTargetAdvance(step)` | Felköti az auto-advance eseményfigyelőket |
| `_tourTargetValueMatches(step, val)` | Ellenőrzi a target érték egyezést |
| `_positionSpotlightAndCard(sp, card, rect, step)` | Spotlight + kártya pozicionálás |
| `_tourPositionCard(card, targetRect)` | Kártya elhelyezés a spotlight mellé (jobb/bal/alá/fölé) |
| `_tourCenterCard(card)` | Kártya középre (`50%/50%`) |
| `_tourRefreshCurrentStepPosition()` | Újrapozicionál (resize/scroll után) |
| `_tourEnd()` | Tour leállítása, cleanup |
| `_tutorialSetPaletteSelection({...})` | Paletta állapot beállítása (category/mnemonic/addressing/operand) |

---

### `onEnterActionId` értékek (jelenleg implementáltak)

| actionId | Mit csinál |
|----------|-----------|
| `"prepare-guided-color-text"` | Törli a programot, block módra vált (egyszer fut le / lecke) |
| `"prepare-name-input-demo"` | Betölti a `name-input-demo` sample-t (egyszer fut le / lecke) |
| `"prep-sei"` | Paletta → Rendszer / CLC implied (a user ezután kiválasztja a SEI-t) |
| `"prep-lda-black"` | Paletta → Adatmozgas / LDX immediate |
| `"prep-lda-border"` | Paletta → Adatmozgas / LDA immediate |
| `"prep-sta-border"` | Paletta → Adatmozgas / LDA absolute |
| `"prep-lda-background"` | Paletta → Adatmozgas / LDA immediate |
| `"prep-sta-background"` | Paletta → Adatmozgas / LDA absolute |
| `"prep-rts-block"` | Paletta → Ugrasok / JMP implied |
| `"prep-jsr-clearscreen"` | Paletta → Ugrasok / JMP absolute |
| `"prep-jsr-chrin"` | Paletta → Ugrasok / JSR absolute, operand=FFCF |
| `"prep-text-block"` | Paletta → Makrok / TEXT, operand="hello c64!" |
| `"prep-text-hello-c64"` | Paletta → Makrok / BYTE (user ezután TEXT-re vált) |
| `"prep-text-visual-assembler"` | Paletta → Makrok / BYTE (user ezután TEXT-re vált) |
| `"prep-text-greeting"` | Paletta → Makrok / TEXT, operand="hello " |
| `"prep-text-whatsyourname"` | Paletta → Makrok / TEXT, operand="what's your name?" |
| `"open-settings-dialog"` | Megnyitja a `#hardware-settings-dialog`-ot; tour elemeket a dialóg fölé hozza |
| `"close-settings-dialog"` | Bezárja a `#hardware-settings-dialog`-ot |

> **Fontos:** `prepare-*` akciók `_tourPreparedLessonId` guard-dal csak egyszer futnak le / lecke (nehogy újrainduláskor töröljék a user munkáját).

---

### `openMenu: true` lépések szabályai

- Megnyitja a `.control-menu`-t animációval (`tour-menu-open` class)
- **`sampleProgramsGroup` kiemelés CSAK akkor** ha `step.target === "#sample-programs-group"`
- A következő lépésnél (ha `openMenu` nincs) automatikusan becsukja a menüt
- Overlay kattintásra NEM zárja be a tour-t (`_tourAllowOverlayClose = false`)

---

### Tour létrehozásának lépései

1. **`tutorial-data.js`-ben** adj hozzá egy objektumot a `lessons` tömbhöz
   - `id` — egyedi, kebab-case string
   - `category` — valamelyik meglévő kategória id
   - `type: "tour"` (spotlight-os bemutató) vagy `"lesson"` + `interactive: true` (interaktív)
   - `difficulty: 0` ha tour (TOUR badge), `1-3` ha lecke
   - 3 nyelvű `title` + `desc`
   - `steps[]` tömb (ld. step objektum feljebb)

2. **Ha új `onEnterActionId` kell**, add hozzá a `_runTutorialStepAction()` switch-be (`app.js`)

3. **Ha a lépés dialógot nyit** (pl. settings):
   - `onEnterActionId: "open-settings-dialog"` + `positionDelay: 300`
   - **Ne** adj `centerCard: true`-t — a kártya automatikusan a spotlight mellé megy

4. **Auto-advance** interaktív lépéseknél:
   - `advanceOnTargetClick: true` — gomb megnyomásakor
   - `advanceOnTargetChange: true` + `targetValue` — select/input értékre
   - `advanceOnTargetInput: true` + `targetValue` — szabad gépelésre (pl. operandus mező)

---

### "Build: Your First Text Program" tour — teljes lépéssor

`id: "guided-first-text"` | `interactive: true` | `difficulty: 0`

| # | target | onEnterActionId | advanceOn | targetValue | Leírás |
|---|--------|-----------------|-----------|-------------|--------|
| 0 | null | `prepare-guided-color-text` | — | — | Intro: üres program, felsorolja a célprogramot |
| 1 | `#mnemonic-select` | `prep-sei` | Change | `"SEI"` | Válaszd ki a SEI-t |
| 2 | `#add-selected` | — | Click | — | Add hozzá a SEI blokkot |
| 3 | `#mnemonic-select` | `prep-lda-black` | Change | `"LDA"` | Válaszd ki az LDA-t |
| 4 | `#operand-input` | — | Input | `"00"` | Írd be: 00 (fekete szín) |
| 5 | `#add-selected` | — | Click | — | Add hozzá az LDA #$00-t |
| 6 | `#mnemonic-select` | `prep-sta-border` | Change | `"STA"` | STA a border-hez |
| 7 | `#operand-input` | — | Input | `"D020"` | Írd be: D020 |
| 8 | `#add-selected` | — | Click | — | Add STA $D020-t |
| 9 | `#mnemonic-select` | `prep-sta-background` | Change | `"STA"` | STA a háttérhez |
| 10 | `#operand-input` | — | Input | `"D021"` | Írd be: D021 |
| 11 | `#add-selected` | — | Click | — | Add STA $D021-t |
| 12 | `#mnemonic-select` | `prep-jsr-clearscreen` | Change | `"JSR"` | JSR a clear-screenhez |
| 13 | `#operand-input` | — | Input | `"E544"` | Írd be: E544 |
| 14 | `#add-selected` | — | Click | — | Add JSR $E544-t |
| 15 | `#mnemonic-select` | `prep-text-hello-c64` | Change | `"TEXT"` | Válaszd ki a TEXT makrót |
| 16 | `#operand-input` | — | Input | `"hello c64"` | Írd be: hello c64 |
| 17 | `#add-selected` | — | Click | — | Add TEXT blokkot (X=12, Y=8 majd) |
| 18 | `#mnemonic-select` | `prep-text-visual-assembler` | Change | `"TEXT"` | TEXT újra |
| 19 | `#operand-input` | — | Input | `"visual assembler"` | Írd be: visual assembler |
| 20 | `#add-selected` | — | Click | — | Add TEXT blokkot (X=8, Y=10 majd) |
| 21 | `#mnemonic-select` | `prep-rts-block` | Change | `"RTS"` | Válaszd ki az RTS-t |
| 22 | `#add-selected` | — | Click | — | Add RTS-t |
| 23 | `[data-index="6"] .collapse-toggle` | — | Click | — | Nyisd ki az első TEXT blokkot |
| 24 | `[data-index="6"] .macro-grid` | — | — | — | Állítsd X=12, Y=8 (Next gomb) |
| 25 | `[data-index="7"] .collapse-toggle` | — | Click | — | Nyisd ki a második TEXT blokkot |
| 26 | `[data-index="7"] .macro-grid` | — | — | — | Állítsd X=8, Y=10 (Next gomb) |
| 27 | `#run-emulator` | — | — | — | Kész! Futtasd le! |

**Célprogram:**
```
SEI
LDA #$00
STA $D020
STA $D021
JSR $E544
.text 12, 8, "hello c64"
.text 8, 10, "visual assembler"
RTS
```

> **Megjegyzés:** A `prep-sei` akció CLC-re állítja a palettát (nem SEI-re) — a user dolga a helyes mnemonic kiválasztása. Ugyanígy `prep-lda-black` LDX-re állít, `prep-sta-border`/background LDA-ra, `prep-rts-block` JMP-re, `prep-text-hello-c64`/visual BYTE-ra. Ez szándékos: az interaktív tourban a user választja ki a helyeset.

---

### "Setting Up VICE & RetroDebugger" tour — lépéssor

`id: "setup-emulators-tour"` | `type: "tour"` | `difficulty: 0`

| # | target | openMenu | onEnterActionId | Leírás |
|---|--------|----------|-----------------|--------|
| 0 | null | — | — | Intro: miért kell beállítani |
| 1 | `.control-menu-trigger` | — | — | Spotlight a menü gombra (☰) |
| 2 | `#hardware-settings-btn` | true | — | Spotlight a Settings gombra a megnyílt menüben |
| 3 | `#choose-vice` | — | `open-settings-dialog` | VICE exe választó gomb, dialóg megnyílik |
| 4 | `#vice-path` | — | — | VICE elérési út mező |
| 5 | `#choose-debugger` | — | — | RetroDebugger exe választó gomb |
| 6 | `#debugger-path` | — | — | RetroDebugger elérési út mező |
| 7 | null | — | `close-settings-dialog` | Kész! Dialóg bezárul |


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

### Disasm output mód (block nézet) — v1.6.8 átdolgozva

A `"disasm"` output mód tiszta 6502 disassembly listát mutat — **csak gépi kód**, nincs makró, nincs komment, nincs annotáció.

- **Állapot:** `outputMode` state változó = `"disasm"`
- **Renderelő:** `_buildDisasmHTML()` — három ágon renderel:
  1. **Valódi 6502 utasítás** (`opcodeMap`-ben szereplő mnemonik, ≤8 byte): eredeti mnemonik + **numerikus operandus** (CONST label-ek feloldva `$XXXX` formában)
  2. **Adatblokk** (BYTE/WORD/FILL): 8 byte-os chunk-olt hex dump, BYTE mnemonikkal
  3. **Minden más (makrók):** `_disasmBytes()` hívás — utasításonkénti 6502 disassembly a reverse opcode táblán keresztül
- **Reverse opcode tábla:** `_REV_OP` — IIFE, `opcodeMap`-ből épített `opcode → { mnem, mode, size }` lookup, mind a 256 opcode lefedve (ismeretlen = `.BYTE`)
- **`_disasmBytes(bytes, baseAddr)`:** byte-tömböt jár végig, `_REV_OP` alapján utasításokra bont, operandust formáz (immediate `#$xx`, absolute `$xxxx`, relative célcím, indirectX/Y, stb.)
- **Label-ek:** csak inline jelennek meg az utasítás előtt (`addrToLabel` map), standalone label sorok kihagyva
- **Kihagyott blokkok:** komment, ORG, REGION/ENDREGION, INCLUDE, RAWBYTES/RAWTEXT/PETSCII/INCBIN/SID (nincs inline byte-juk), feltételesen kihagyott blokkok, macro source block-ok
- **DOM:** `#disasm-output` (block mód), `#expert-disasm-output` (expert mód) — mindkettő `_buildDisasmHTML()`-t hív
- **CSS osztályok:** `.dsm-addr` (cím), `.dsm-bytes` (hex byte-ok), `.asm-tok-mnemonic` (mnemonik), `.asm-tok-operand` (operandus), `.asm-tok-label` (címke)

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
| `isForMacro` | ❌ | ❌ | reg, count (HEX/DEC toggle!), label |
| `isEndfMacro` | ❌ | ❌ | loop label |
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
| `isMouseMacro` | ❌ | ❌ | mousePort, mouseSpriteNum, mousePotXZP, mousePotYZP |
| `isSpriteColMacro` | ❌ | ❌ | spriteNum, colType |
| `isLoadFileMacro` | ❌ | ❌ | loadFileName, loadFileDevice, loadFileAddress, loadFileErrorLabel |
| `isReuCheckMacro` | ❌ | ❌ | — |
| `isReuStashMacro` | ❌ | ❌ | reuC64Address, reuAddress, reuBank, reuLength |
| `isReuFetchMacro` | ❌ | ❌ | reuC64Address, reuAddress, reuBank, reuLength |
| `isReuSwapMacro` | ❌ | ❌ | reuC64Address, reuAddress, reuBank, reuLength |
| `isTurboSetMacro` | ❌ | ❌ | turboSpeed (0–15), turboBadline ("0"/"1") |
| `isSuperCpuDetectMacro` | ❌ | ❌ | — |
| `isTurboEnableMacro` | ❌ | ❌ | turboEnableMode ("on"/"off") |

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

---

## Expert Mode — rendszer áttekintés

Az alkalmazás kétféle szerkesztési módot támogat, amelyek között tab-onként lehet váltani:
- **Block mode** (alapértelmezett): drag-and-drop blokk szerkesztő
- **Expert mode**: direkt assembly szövegszerkesztő (`body.expert-mode` CSS class)

### Fontos state változók

```javascript
let expertMode = false;              // aktuális mód
let _expertHlEnabled = true;         // syntax highlight be/ki
let _expertPaletteSyncEnabled = true;// paletta szinkronizáció
let _expertPaletteVisible = false;   // bal panel látható
let _expertDisasmVisible = false;    // disasm panel látható
let _expertDisasmWidth   = 340;      // disasm panel szélessége
let _expertMonitorVisible = false;   // monitor panel látható
```

### Expert mode régió háttér (`#expert-region-bg`)

Folytonos háttér div az expert editor aktív REGION blokk kiemeléshez — nem per-sor span, hanem egyetlen abszolút pozicionált div.

- **DOM elem:** `<div id="expert-region-bg">` — a highlight `<pre>` belső első gyermeke
- **Frissítő függvény:** `_updateExpertRegionBg(firstLine, lastLine)` — szélesség, `top` és `height` `style` attribútumokat állít a számított line-height és padding alapján
- **Scroll szinkron:** az editor `scroll` eventjén `transform: translateY(-scrollTop)` — ez tartja a divet a szöveggel egy vonalban
- **Paletta szinkron:** `_syncPaletteToBlock(mnemonic)` — blokk kattintáskor frissíti az aktív palet elem kiemelést és a paletta kategóriát; letiltható ha keresés aktív vagy expert módban
- **Ha nincs aktív régió** a cursorban, a div `display: none`
- **Per-sor span megközelítés el van hagyva** (performance problémák miatt); CSS osztály: `.expert-region-bg`, `.palette-item--active`

### `saveUiSettings()` felülírja `savedUiSettings`-t — BUG TRAP

**KRITIKUS:** `setExpertMode(true)` végén `saveUiSettings()` hívódik, ami **felülírja `savedUiSettings`-t** a jelenlegi (default) változóértékekkel.

**Ha `_applyUiSettingsToDOM()`-ban toolbar állapotokat kell visszaállítani, a `setExpertMode(true)` hívás ELŐTT kell kimenteni őket local változókba!**

```javascript
// HELYES:
const _savedHlEnabled    = savedUiSettings.expertHlEnabled;
const _savedMonitorVis   = savedUiSettings.expertMonitorVisible;
// ... stb.
setExpertMode(true);   // ← ez felülírja savedUiSettings-t!
// Visszaállítás a kimentett értékekből:
if (_savedHlEnabled === false) { _expertHlEnabled = false; ... }
if (_savedMonitorVis) { _expertMonitorVisible = true; ... }

// HIBÁS:
setExpertMode(true);
if (savedUiSettings.expertHlEnabled === false) { ... }  // ← már default értéket olvas!
```

### Expert toolbar gombok

| Gomb ID | Funkció | State változó | CSS osztály (be) |
|---------|---------|---------------|------------------|
| `#expert-palette-btn` | Bal paletta panel | `_expertPaletteVisible` | `expert-hl-toggle--on` |
| `#expert-palette-sync-btn` | Paletta szinkron | `_expertPaletteSyncEnabled` | `expert-hl-toggle--on` |
| `#expert-disasm-btn` | Disasm panel | `_expertDisasmVisible` | `expert-hl-toggle--on` |
| `#expert-monitor-btn` | Monitor panel | `_expertMonitorVisible` | `expert-hl-toggle--on` |
| `#expert-format-btn` | Forráskód formázás | — (nem toggle) | — |

Minden gombnak van `aria-pressed` attribútuma a state visszatükrözéséhez.

### `_expertFormatSource()` — formázás

A format gomb (`#expert-format-btn`) hívja. Funkciók:
- Soronként megőrzi az eredeti leading whitespace-t (`origIndent`)
- Label definíciók (`name:`) mindig col 0-ra kerülnek
- Mnemonikokat nagybetűre konvertálja (`_EXPERT_MNEM_SET` alapján)
- Mnemonic + operandus között **pontosan 1 space** (sem több, sem kevesebb)
- Ha a tartalom nem változott: `"Already formatted"` / `"Már formázott"` status
- Ha változott: `markTabDirty()` + `"Formatted"` / `"Formázva"` status

**1-space konvenció a `_blockToExpertLine()`-ban is:**
```javascript
// Helyes — 1 space mnemonic és operandus között:
const op = block.operand ? `    ${mnem} ${block.operand}` : `    ${mnem}`;
// Hibás volt — 2 space:
// const op = block.operand ? `    ${mnem}  ${block.operand}` : ...
```

### Dirty tab indicator

Mentetlen változtatásokat jelöl a tab fejlécén egy kis accent-színű pont (`.tab-dirty-dot`).

```javascript
function markTabDirty() { ... }   // felhívandó minden módosításkor
function markTabClean() { ... }   // felhívandó mentéskor/betöltéskor
```

**Hívási helyek:**
- `markTabDirty()`: `insertBlock()`, `deleteBlock()`, `updateProgramBlock()`, expert editor `input` event, `_expertFormatSource()` (ha változott)
- `markTabClean()`: `saveProjectToFile()`, `loadProjectFromFile()`, `loadSampleFromFile()`, `doClearProgram()`

### `applySavedUiSettings()` — kétlépéses inicializálás

```javascript
function applySavedUiSettings() {
  savedUiSettings = readUiSettings();   // localStorage
  _applyUiSettingsToDOM();              // azonnal alkalmaz

  // Tauri config felülbírálja a localStorage-t (async)
  if (window.electronAPI?.getUiSettings) {
    window.electronAPI.getUiSettings().then(globalSettings => {
      if (globalSettings && Object.keys(globalSettings).length > 0) {
        savedUiSettings = globalSettings;
        localStorage.setItem("c64-ui-settings", JSON.stringify(savedUiSettings));
        _applyUiSettingsToDOM();
      }
    }).catch(() => {});
  }
}
```

### CSS — expert editor háttér

`--expert-editor-bg` CSS custom property per-theme (nem `--bg`, külön változó):
- `:root` (light): `#edf0ff`
- `html[data-theme="dark"]`: `#1e1a5e`
- `html[data-theme="oled"]`: `#03020c`

### Compile error dialog — méret

`.compile-error-dialog`: `max-width: 460px`, `border-radius: 12px`
`.compile-error-card`: `padding: 18px 20px 16px`
Lista sorok: `font-size: 0.75rem`, `max-height: 220px`
OK gomb: `.compile-error-card .primary` → `padding: 7px 20px`, `font-size: 0.85rem`
