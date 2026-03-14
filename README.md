# C64 Visual Assembler

An Electron-based desktop application for visually composing Commodore 64 6502 assembly programs using drag-and-drop blocks. Arrange mnemonics, macros, and labels in a program list and see the generated ASM and monitor output update in real time. Optionally run the program directly in VICE.

---

## Screenshot

> *Drag blocks from the left panel, arrange them in the center, and see live ASM output on the right.*

---

## Features

- **Drag-and-drop block editor** — build programs by dragging mnemonic blocks into a list
- **Real-time ASM + Monitor output** — auto-generated as you edit, with configurable start address (`*=`)
- **TEXT macro** — write text to the C64 screen at an X/Y coordinate using direct screen RAM writes
- **BYTE macro** — insert arbitrary raw byte arrays inline
- **STRING macro** — copy a string to a fixed memory address
- **LABEL & COMMENT blocks** — named jump targets and zero-byte annotations
- **Memory strip** — full 64 KB C64 memory map visualised as a colour-coded strip (RAM / ROM / I/O)
- **VICE integration** — assemble and launch directly in the VICE C64 emulator
- **Dark / light theme**, zoom, HEX / DEC operand mode
- **Hungarian and English UI**
- **Save / load projects** as `.c64asm` JSON files

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [VICE emulator](https://vice-emu.sourceforge.io/) (optional, for Run button)

### Install & run

```bash
npm install
npm start
```

### Build Windows installer

```bash
npm run dist        # produces NSIS installer in dist/
npm run dist:dir    # produces unpacked directory build in dist/
```

---

## Project Structure

```
VisualAssembler/
├── index.html        # Single-page UI (all panels, templates)
├── style.css         # Full stylesheet — CSS custom properties for theming
├── app.js            # All renderer logic (~3 500 lines)
├── main.js           # Electron main process (window, file dialogs, VICE IPC)
├── preload.js        # contextBridge — exposes safe IPC API to renderer
├── package.json      # electron + electron-builder config
└── build/
    └── commodore64.ico
```

---

## Architecture (`app.js`)

### Data layer

| Constant | Contents |
|----------|----------|
| `addressingModes` | Implied, Immediate, Zero Page, Absolute, Relative |
| `mnemonicLibrary` | All mnemonics grouped by category (10 categories) |
| `opcodeMap` | Mnemonic → addressing mode → opcode byte |
| `memorySegments` | Full C64 64 KB memory map definition |
| `translations` | `hu` / `en` string dictionaries |
| `program[]` | In-memory block list (the current program state) |

### Block data model

Each block in `program[]` is a plain object:

```js
{
  id: crypto.randomUUID(),
  category: "Ugrasok",
  mnemonic: "RTS",
  operand: "",           // displayed operand string
  rawOperand: "",        // raw user input
  description: "...",
  addressingMode: "implied",
  base: "hex",           // "hex" | "dec" | "text" | "bytes" | "comment"
  validationError: "",
  // optional macro fields:
  isTextMacro: true, textX: 0, textY: 0,
  isStringMacro: true, stringAddress: "0400",
  isByteMacro: true,
  isLabel: true, labelName: "loop",
  isComment: true
}
```

### Macros

| Macro | Expands to |
|-------|-----------|
| `TEXT` | `LDA #$xx` / `STA $04xx` pairs writing screen codes directly to screen RAM |
| `BYTE` | Raw bytes inserted inline |
| `STRING` | `LDA #$xx` / `STA $xxxx` pairs copying a string to a given address |
| `LABEL` | Zero-byte named symbol; resolves in branch/jump operands |
| `COMMENT` | Zero-byte annotation; generates no machine code |

### Output generation

| Function | Purpose |
|----------|---------|
| `getProgramLayout()` | Calculates address for each block |
| `assembleProgramToPrg()` | Assembles to a `.prg` byte array |
| `buildAutostartPrgForEmulator()` | Prepends a BASIC SYS stub at `$0801`, code at `$080D` |
| `buildAsmLines()` | Generates human-readable ASM text |
| `buildMonitorLines()` | Generates monitor-format hex output |

### Electron IPC

| Channel | Direction | Purpose |
|---------|-----------|---------|
| `save-file` | renderer → main | Save JSON project to disk |
| `load-file` | renderer → main | Load JSON project from disk |
| `choose-vice` | renderer → main | File picker for VICE executable |
| `run-vice` | renderer → main | Write `.prg` to temp dir and launch VICE |

---

## Sample Programs

| Option | Description |
|--------|-------------|
| `basic-colors` | Simple border colour loop |
| `label-border` | LABEL + BNE loop example |
| `text-demo` | Screen clear → TEXT macros → RTS |
| `macro-demo` | Colour cycling with delay subroutine, STRING/TEXT/BYTE macros |
| `sprite-demo` | Sprite data setup + left-to-right ball animation |

### Sprite demo notes

The autostart BASIC stub occupies `$0801–$080C`; code starts at `$080D`.  
Layout: `JMP main` (3 bytes) + 48-byte padding + 63-byte sprite data = sprite at **`$0840`** (pointer = `$0840 / 64 = 33 = $21`).

---

## C64 Quick Reference

| Area | Address | Notes |
|------|---------|-------|
| Zero Page | $0000–$00FF | Fast RAM |
| Stack | $0100–$01FF | Hardware stack |
| BASIC RAM | $0800–$9FFF | Default program area (`*=$0801`) |
| Screen RAM | $0400–$07E7 | 40×25 character display |
| Sprite pointers | $07F8–$07FF | One byte per sprite = data addr / 64 |
| BASIC ROM | $A000–$BFFF | |
| VIC-II | $D000–$D3FF | Video chip registers |
| SID | $D400–$D7FF | Sound chip |
| Color RAM | $D800–$DBFF | |
| KERNAL ROM | $E000–$FFFF | OS; CHROUT = $FFD2, CLRSCR = $E544 |

---

## License

MIT
