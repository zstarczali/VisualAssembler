# C64 Visual Assembler — Projekt térkép

## Áttekintés

Electron-alapú asztali alkalmazás Commodore 64 assembly programok vizuális szerkesztéséhez.
A felhasználó drag-and-drop blokkok segítségével rakhatja össze a programot; az alkalmazás
valós időben generálja az ASM- és monitor-nézetet, és képes VICE emulátorba exportálni.

---

## Fájlszerkezet

```
VisualAssembler/
├── index.html        # Az alkalmazás egyetlen HTML-lapja (UI struktúra)
├── style.css         # Teljes stíluslap (Space Grotesk + IBM Plex Mono betűkkel)
├── app.js            # Fő alkalmazáslogika (~3 500 sor)
├── main.js           # Electron main process (ablakkezelés, fájldialógus, VICE IPC)
├── preload.js        # Electron preload — exposes safe IPC API to renderer
├── package.json      # Electron + electron-builder konfiguráció
├── build/
│   └── commodore64.ico   # Telepítő ikon
└── dist/             # electron-builder kimenet (NSIS telepítő / dir)
```

---

## Fő komponensek (`app.js`)

### 1. Adatréteg

| Konstans / változó | Tartalom |
|--------------------|----------|
| `addressingModes` | Implied, Immediate, Zero Page, Absolute, Relative — leírás és placeholder |
| `mnemonicLibrary` | Kategóriánként (Adatmozgas, Aritmetika, Logika, Ugrasok, Regiszterek, ShiftEsRotate, Stack, Rendszer, Makrok, Szerkezet) felsorolt mnemonikák |
| `opcodeMap` | Mnemonik → cím. mód → opcode byte hex értékek |
| `memorySegments` | C64 64 KB-os memóriatérkép (Zero Page, Stack, BASIC RAM, KERNAL ROM, VIC, SID, CIA1/2 stb.) |
| `translations` | `hu` / `en` szótárak (UI szövegek, kategórianevek, memóriaszegmens feliratok) |
| `mnemonicDescriptionsEn` | Angol mnemonik leírások |
| `program` (tömb) | Az aktuálisan szerkesztett blokkok listája (in-memory állapot) |

### 2. Makrók

| Makró | Viselkedés |
|-------|-----------|
| `TEXT` | KERNAL CHROUT rutinon keresztüli szövegkiírás; X/Y képernyőkoordinátával; expandál LDA/JSR/$FFD2/RTS assembly sorokká |
| `BYTE` | Nyers byte tömb beillesztése vesszővel elválasztva |
| `STRING` | Karakterlánc megadott memóriacímre |
| `LABEL` | Ugrási cél névvel; a generált kódban szimbolikus cimke lesz |
| `COMMENT` | Megjegyzés, nem generál byte-ot |

### 3. UI réteg

- **Bal panel** (`palette-panel`): kategória + mnemonik + operandus + cím. mód választó → `addSelectedBlock()`
- **Középső panel** (`program-panel`): drag-and-drop blokklista; fel/le/töröl gombok
- **Jobb panel** (`output-panel`): ASM / Monitor / Mindkettő nézet; `*=` kezdőcím; memória-előnézet csík
- **Lenyíló menü** (`control-menu`): fájl mentés/betöltés, mintaprogramok, VICE, téma, zoom, nyelv
- **Globális memória panel**: teljes C64 64 KB csík vizuálisan

### 4. Mintaprogramok

| Érték | Betöltő függvény | Tartalom |
|-------|-----------------|----------|
| `basic-colors` | `loadSampleProgram()` | SEI + border/háttérszín loop |
| `label-border` | `loadLabelSampleProgram()` | LABEL + BNE ciklus példa |
| `text-demo` | `loadTextSampleProgram()` | SEI → TEXT × 2 → **RTS** |
| `macro-demo` | `loadMacroDemoProgram()` | LABEL + LDA/STA + STRING + TEXT + BYTE + scroller |

### 5. Kimenet generálás

- `buildAsmLines()` — blokkok → ASM szöveg sorok (label-aware, TEXT expanzió)
- `buildMonitorLines()` — assembly → monitor-format (`.A xxxx` hex opcode + operand sorok)
- `renderOutputMode()` — ASM / Monitor / Mindkettő tab váltás
- `renderMemoryStrip()` — top + global memória csík frissítése

### 6. Electron integráció (`main.js` + `preload.js`)

- `ipcMain` kezelők: `save-file`, `load-file`, `choose-vice`, `run-vice`
- `preload.js` `contextBridge` exposes: `saveFile`, `loadFile`, `chooseVice`, `runVice`, `onViceResult`
- VICE elérési út `localStorage`-ben tárolódik; futtatáskor `.prg`-t generál a temp mappába

### 7. Állapotkezelés

- `program` tömb — in-memory blokklista
- `localStorage`:
  - `c64-program` — elmentett program (JSON)
  - `c64-ui-settings` — UI beállítások (kategória, base, zoom, téma, nyelv, stb.)
- Fájl mentés/betöltés: JSON projekt fájl (`.c64asm`)

---

## Technológia stack

| Réteg | Technológia |
|-------|------------|
| Runtime | Electron (Chromium + Node.js) |
| UI | Vanilla HTML/CSS/JS (nincs framework) |
| Betűtípusok | Space Grotesk (UI), IBM Plex Mono (kód) |
| Build | electron-builder → NSIS Windows telepítő |
| Célplatform | Windows |

---

## Fontos 6502 referenciák

- **TEXT makró expand** sorrendje: LDA koordináta → JSR CHROUT ($FFD2) ismétlés karakterenként
- **RTS** (`$60`) — minden szubrutin végén kötelező; a TEXT példában a blokklista **utolsó** eleme
- **Kezdőcím** alapértelmezés: `$0801` (BASIC program terület kezdete C64-en)
