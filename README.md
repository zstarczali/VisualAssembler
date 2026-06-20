# C64 Visual Assembler

A Tauri 2-based desktop application for visually composing Commodore 64 6502 assembly programs using drag-and-drop blocks. Arrange mnemonics, macros, and labels in a program list and see the generated ASM and monitor output update in real time. Optionally run the program directly in VICE.

**Current version: v2.0.2**

---


<img title="a title" alt="Alt text" src="/assets/logo.png" width="400">

> *Drag blocks from the left panel, arrange them in the center, and see live ASM output on the right.*

---

## Features

- **Drag-and-drop block editor** — build programs by dragging mnemonic blocks into a list
- **Real-time ASM + Monitor output** — auto-generated as you edit, with configurable start address (`*=`)
- **Block collapsing** — collapse individual blocks or all at once to reduce visual noise
- **Mnemonic search** — filter the palette by name or description
- **TEXT macro** — write text to the C64 screen at an X/Y coordinate; auto-detects case for lowercase charset output
- **BYTE macro** — insert arbitrary raw byte arrays inline
- **WORD macro** — insert 16-bit values as LO/HI byte pairs
- **STRING macro** — copy a string (as screen codes) to a fixed memory address; same case auto-detection as TEXT
- **DATA macro** — write raw bytes to a fixed memory address via `LDA/STA` pairs
- **RAWBYTES macro** — place raw bytes at a given address without generating runtime code
- **RAWTEXT macro** — place text as screen codes at a given address without generating runtime code; same case auto-detection
- **FILL macro** — generate repeated bytes with a specified count
- **ALIGN macro** — jump to the next memory boundary (e.g. 64 for sprites, `$2000` for bitmap)
- **TABLE macro** — define a named lookup table at a given address
- **LOOP / NEXT macro** — visual counter loop pair; LOOP loads X or Y with a count, NEXT emits `DEX/DEY + BNE`; nested loops supported
- **FOR / ENDF macro** — forward counting loop pair; FOR loads X or Y with 0, ENDF emits `INX/INY + CPX/CPY #limit + BNE`; X/Y = 0..limit-1
- **PUSH / PULL macro** — save and restore A, X, Y register combinations to/from the stack
- **IF / ELSE / ENDIF macro** — conditional assembly blocks driven by `DEFINE` symbols
- **DEFINE macro** — activate named symbols for conditional assembly
- **CONST macro** — declare named constants; appear in label picker and generate zero bytes
- **MACRO / ENDM / INVOKE** — define reusable named macros with optional parameters; use `{paramName}` placeholders in the body; invoke with arguments using `.invoke setColor(#$07)` parentheses syntax; multiple parameters supported (e.g. `.invoke drawPixel($10, $20)`)
- **Expert mode blank line preservation** — empty lines typed in the Expert editor survive round-trips through block mode; shown as thin dashed spacers in the block list
- **REGION / ENDREGION blocks** — group blocks into a named, collapsible section; supports nesting; zero bytes generated
- **INCBIN macro** — include an external binary file at a given memory address
- **INCLUDE macro** — embed another `.c64asm` project file inline (read-only)
- **SID macro** — load a SID music file directly into memory; header stripped, load/init/play addresses extracted automatically
- **SPRITE_INIT macro** — initialise a VIC-II sprite: sets data pointer (`$07F8+N`), enable bit (`$D015`), and colour (`$D027+N`); parameters: sprite number, colour, data page
- **SPRITE_POS macro** — set a sprite's static X/Y position; handles `$D010` MSB for X > 255; parameters: sprite number, X (0–319), Y (0–255)
- **WAIT_RASTER macro** — inline VIC-II raster line busy-wait (`LDA $D012 / CMP #line / BNE −7`); no JSR or label needed; 7 bytes
- **JOYSTICK macro** — reads a CIA joystick port (1 = `$DC01`, 2 = `$DC00`) and moves a sprite via INC/DEC; 27 bytes inline
- **MOUSE macro** — reads a C64 1351 proportional mouse via SID POTX/POTY and moves a sprite; CIA `$DC00` bits 7:6 select the control port, one SID conversion settle wait, standard 1351-style 7-bit delta decode, sprite X `$D010` MSB maintenance, Y-axis inverted for VICE, sprite X/Y update; 142 bytes inline
- **SPRITE_COL macro** — read VIC-II collision register (`$D01E` sprite–sprite, `$D01F` sprite–background); result in A register; 5 bytes
- **LOADFILE macro** — load a named file from a D64 at runtime using KERNAL `SETNAM`/`SETLFS`/`LOAD`; optional address override and `BCS` error label; variable size
- **REU_CHECK macro** — detect RAM Expansion Unit presence with a `$DF04` write/read probe (`$55`, `$AA`); result in Z flag; 34 bytes
- **REU_STASH / REU_FETCH / REU_SWAP macros** — 40-byte inline DMA transfer macros for C64↔REU memory transfers using the REU DMA registers (`$DF01`–`$DF0A`)
- **TURBO_SET macro** — set U64 CPU speed via `$D031`; speed index 0–15 + badline control; 5 bytes
- **SUPERCPU_DETECT macro** — detect CMD SuperCPU (`LDA $D0B8 / CMP #$FF`); result in Z flag; 5 bytes
- **TURBO_ENABLE macro** — CMD SuperCPU turbo on (`STA $D07A`) / off (`STA $D07B`); 5 bytes
- **Disassembler view** — real-time pure 6502 disassembly: shows address, hex bytes, and resolved numeric operands for every instruction; macros are expanded to individual instructions (TEXT → LDA/STA pairs, LOOP → LDX, MOUSE → full 142-byte decode); BYTE/WORD/FILL data shown as chunked hex dump; no macros, comments, or annotations in output
- **Exomizer compression** — optional Exomizer sfx sys crunching via a Settings checkbox; compresses PRGs before launching VICE, saving to file, or running on C64 Ultimate hardware; works with all run modes and Build PRG / Build D64
- **`*` (current PC) operand** — operand fields accept `*` as a shorthand for the current instruction address; branches with `*` generate an infinite self-loop (`BNE *` → offset `$FE`)
- **LABEL & COMMENT blocks** — named jump targets and zero-byte annotations
- **Memory strip** — full 64 KB C64 memory map visualised as a colour-coded strip (RAM / ROM / I/O)
- **Monitor view** — hex + ASCII character dump, 8 bytes per row
- **VICE integration** — assemble and launch directly in the VICE C64 emulator
- **Build Info dialog** — one-click summary of origin, end address, size, labels, constants, and macros used
- **Expert mode .asm file save/load** — load and save raw `.asm` source files in Expert mode
- **Expert mode error highlighting** — lines that fail to compile are highlighted in red in real time
- **Dark / light theme**, zoom, HEX / DEC operand mode
- **Hungarian and English and Spanish UI**
- **Save / load projects** as `.c64asm` JSON files

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://rustup.rs/) (stable)
- [VICE emulator](https://vice-emu.sourceforge.io/) (optional, for Run button)

### Install & run

```bash
npm install
npm run dev
```

### Build installer

```bash
npm run build             # produces NSIS installer (Windows) or .dmg (macOS) in src-tauri/target/
```

---

## Project Structure

```
VisualAssembler/
├── www/
│   ├── index.html        # Single-page UI (all panels, templates)
│   ├── style.css         # Full stylesheet — CSS custom properties for theming
│   ├── app.js            # All renderer logic (~7 700 lines)
│   └── tauri-bridge.js   # Maps window.electronAPI calls to Tauri invoke commands
├── src-tauri/
│   ├── src/lib.rs        # Tauri backend — file dialogs, VICE launch, IPC commands
│   ├── tauri.conf.json   # App config — window, bundle, icons
│   ├── capabilities/     # Tauri permission system
│   └── icons/            # App icons (all sizes)
├── package.json          # Scripts + Tauri CLI dev dependency
└── samples/              # Example .c64asm project files + binary assets
```

---

## Architecture (`app.js`)

### Data layer

| Constant | Contents |
|----------|----------|
| `addressingModes` | Implied, Immediate, Zero Page, Absolute, Relative, AbsoluteX, … |
| `mnemonicLibrary` | All mnemonics grouped by category (10 categories) |
| `mnemonicDescriptionsEn` | English description strings keyed by mnemonic |
| `opcodeMap` | Mnemonic → addressing mode → opcode byte |
| `memorySegments` | Full C64 64 KB memory map definition |
| `translations` | `hu` / `en` / `es` string dictionaries (in `www/i18n.js`) |
| `program[]` | In-memory block list (the current program state) |

### Block data model

Each block in `program[]` is a plain object:

```js
{
  id: crypto.randomUUID(),
  category: "Ugrasok",       // internal category key (Hungarian, translated for display)
  mnemonic: "RTS",
  operand: "",               // displayed operand string
  rawOperand: "",            // raw user input
  description: "...",
  addressingMode: "implied",
  base: "hex",               // "hex" | "dec" | "text" | "bytes" | "comment"
  validationError: "",
  collapsed: false,
  // optional macro fields (only present when relevant):
  isTextMacro: true, textX: 0, textY: 0,
  isStringMacro: true, stringAddress: "C000",
  isDataMacro: true, dataAddress: "C000",
  isByteMacro: true,
  isWordMacro: true,
  isRawBytesMacro: true, rawBytesAddress: "C000",
  isRawTextMacro: true, rawTextAddress: "C000",
  isFillMacro: true,
  isAlignMacro: true,
  isTableMacro: true, tableName: "mytable", tableAddress: "C000",
  isLoopMacro: true, loopReg: "X", loopCount: "0A", loopLabel: "loop1",
  isNextMacro: true, nextLabel: "loop1", nextReg: "X",
  isPushMacro: true, pushRegs: "AXY",
  isPullMacro: true, pullRegs: "AXY",
  isMacroDefStart: true, macroName: "mymacro", macroParams: "color, count",
  isMacroDefEnd: true,
  isMacroInvoke: true, invokeMacroName: "mymacro", invokeArgs: "#$07, $20",
  isBlankLine: true,   // empty line in expert mode — 0 bytes
  isIfMacro: true, ifCondition: "DEBUG",
  isElseMacro: true,
  isEndIfMacro: true,
  isDefineMacro: true, defineSymbol: "DEBUG",
  isConstMacro: true, constName: "SCREEN", constValue: 1024,
  isIncBinMacro: true, incBinAddress: "C000", incBinFileName: "data.bin",
  isIncludeMacro: true, includeFileName: "lib.c64asm",
  isSidMacro: true,
  isLabel: true, labelName: "loop",
  isComment: true,
  isRegionMacro: true, regionName: "init", regionCollapsed: false,
  isEndRegionMacro: true,
}
```

### Macros

| Macro | Expands to |
|-------|-----------|
| `TEXT` | Cursor positioning via KERNAL + `LDA #$xx` / `JSR $FFD2` pairs |
| `BYTE` | Raw bytes inserted inline at the current address |
| `WORD` | 16-bit values as LO/HI byte pairs |
| `STRING` | `LDA #$xx` / `STA $xxxx` pairs — string as C64 screen codes to a fixed address |
| `DATA` | `LDA #$xx` / `STA $addr+n` pairs — raw bytes to a fixed address |
| `RAWBYTES` | Raw bytes placed at a given address, no runtime code |
| `RAWTEXT` | PETSCII text placed at a given address, no runtime code |
| `FILL` | Repeated byte pattern for a given count |
| `ALIGN` | Emits padding bytes to reach the next N-byte boundary |
| `TABLE` | Named lookup table at a given address |
| `LOOP` | `LDX/LDY #count` (2 bytes) + body label at `address+2` |
| `NEXT` | `DEX/DEY` + `BNE label` (3 bytes); label resolves to the matching LOOP body |
| `PUSH` | `PHA` / `TXA PHA` / `TYA PHA` combinations |
| `PULL` | `PLA` / `PLA TAX` / `PLA TAY` combinations |
| `MACRO` / `ENDM` | Define a reusable named macro block; optional comma-separated parameter names (`macroParams` field) |
| `INVOKE` | Call a user-defined macro by name; optional arguments (`invokeArgs` field) — `{paramName}` placeholders in the body are replaced with the supplied values |
| `DEFINE` | Activate one or more named symbols for conditional assembly |
| `IF` / `ELSE` / `ENDIF` | Conditional assembly — blocks are included or skipped based on active `DEFINE` symbols |
| `CONST` | Declare a named constant (0 bytes); appears in label picker for instruction operands |
| `INCBIN` | Embeds an external binary file at a given address |
| `INCLUDE` | Inlines another `.c64asm` project at the current position |
| `SID` | Loads a SID file into memory; strips the header, extracts load/init/play addresses |
| `SPRITE_INIT` | Initialise a sprite: data pointer, enable bit, colour (18 bytes) |
| `SPRITE_POS` | Set static sprite X/Y position; handles $D010 MSB for X > 255 (18 bytes) |
| `WAIT_RASTER` | Inline raster-line busy-wait; no JSR or label needed (7 bytes) |
| `JOYSTICK` | Read CIA joystick port and move a sprite via INC/DEC (27 bytes) |
| `SPRITE_COL` | Read VIC-II collision register and AND with sprite bit; result in A (5 bytes) |
| `LOADFILE` | Load a named file from D64 at runtime using KERNAL `SETNAM`/`SETLFS`/`LOAD`; variable size |
| `REU_CHECK` | Probe `$DF04` with `$55/$AA`; Z=0 → REU present (34 bytes) |
| `REU_STASH` | C64 RAM → REU DMA transfer (`$DF01` = `$90`); 40 bytes |
| `REU_FETCH` | REU → C64 RAM DMA transfer (`$DF01` = `$91`); 40 bytes |
| `REU_SWAP` | Swap C64 RAM ↔ REU DMA (`$DF01` = `$92`); 40 bytes |
| `TURBO_SET` | Set U64 CPU speed via `$D031`; speed index 0–15 + badline control (5 bytes) |
| `SUPERCPU_DETECT` | Compare `$D0B8` to `$FF`; Z=0 → SuperCPU present (5 bytes) |
| `TURBO_ENABLE` | SuperCPU turbo on (`STA $D07A`) / off (`STA $D07B`) (5 bytes) |

---

## Visual Editors

The **Toolkit tab** provides access to built-in visual editors, all with *Export to blocks* support:

- **SID editor** — 3-voice tracker with waveform, ADSR drag-graph, filter, Web Audio preview, and full C64-runnable IRQ player export (`sid_init` / `sid_irq` / `sid_play_row`)
- **Sprite editor** — frame-by-frame sprite design, flip/shift tools, multi-frame animation, `.bin` load/save
- **Hires / multicolor bitmap editor** — pixel editor with native multicolor `.bin` export (10 000 bytes: bitmap + screen + color RAM)
- **Charset editor** — custom character set design
- **Tilemap editor** — multi-layer map with brush tools and image import for tilesets

## Interactive Tutorials

The built-in **tutorial system** offers guided step-by-step tours (spotlight + card, advancing on user interactions) and passive lessons with sample links. Fully localised in Hungarian, English, and Spanish.

### Output generation

| Function | Purpose |
|----------|---------|
| `getProgramLayout()` | Calculates address for each block |
| `assembleProgramToPrg()` | Assembles to a `.prg` byte array |
| `buildAutostartPrgForEmulator()` | Prepends a BASIC SYS stub at `$0801`, code at `$080D` |
| `buildAsmLines()` | Generates human-readable ASM text |
| `buildMonitorLines()` | Generates monitor-format hex + ASCII output |

### Electron IPC

| Channel | Direction | Purpose |
|---------|-----------|---------|
| `save-file` | renderer → main | Save JSON project to disk |
| `load-file` | renderer → main | Load JSON project from disk |
| `choose-vice` | renderer → main | File picker for VICE executable |
| `run-vice` | renderer → main | Write `.prg` to temp dir and launch VICE |
| `shell:open-external` | renderer → main | Open URL in system browser |

---

## Sample Programs

| Sample | Description |
|--------|-------------|
| `basic-colors` | Simple border colour loop |
| `label-border` | LABEL + BNE loop example |
| `text-demo` | Screen clear → TEXT macros → RTS |
| `lowercase-text-demo` | Lowercase charset ($D018=$17) + mixed-case TEXT output |
| `macro-demo` | C64 text scroller — fine-scroll + character shift, FILL/BYTE/RAWBYTES macros |
| `loop-demo` | Nested LOOP X + LOOP Y delay, cycles border + background through all 16 C64 colours |
| `hello-loop-demo` | LOOP X `$28` (40×) prints "Hello World 1"–"Hello World 40"; digit counter on ZP `$FB`/`$FC` |
| `push-pull-demo` | Rainbow color animation + counter display using PUSH/PULL register protection |
| `user-macro-demo` | User MACRO / ENDM / INVOKE example |
| `sprite-demo` | Sprite data setup + left-to-right ball animation |
| `sprite-macro-demo` | SPRITE_INIT + SPRITE_POS + WAIT_RASTER demo — spritemate-exported sprite bounces left/right |
| `joystick-demo` | JOYSTICK macro demo — sprite #0 follows joystick port 2 (VICE: Numpad / Joy2) |
| `bitmap-demo` | Hires bitmap mode, 8 coloured lines drawn with Bresenham; gap-aligned BYTE macro to `$2000` |
| `setpixel-demo` | SETPIXEL subroutine drawing horizontal lines in bitmap mode |
| `incbin-demo` | INCBIN macro loading `demo-colors.bin` at `$C000`; colour cycling loop reads bytes by index |
| `include-demo` | INCLUDE macro embedding `include-library.json` (set_border / set_bg routines) |
| `include-library` | Reusable library: `set_border` and `set_bg` subroutines |
| `if-else` | DEFINE / IF / ELSE / ENDIF conditional assembly demo |
| `sid-demo` | SID music player — Ikari Warriors theme, IRQ-driven via VIC raster |
| `sid-direct-demo` | SID loaded directly using the SID macro (no `.bin` conversion needed) |

### Sprite demo notes

The autostart BASIC stub occupies `$0801–$080C`; code starts at `$080D`.
Layout: `JMP main` (3 bytes) + 48-byte padding + 63-byte sprite data = sprite at **`$0840`** (pointer = `$0840 / 64 = 33 = $21`).

### Bitmap demo notes

VIC-II setup: `$D011=$3B` (bitmap mode), `$D016=$C8` (hires), `$D018=$18` (screen `$0400`, bitmap `$2000`).
A gap BYTE macro aligns the code to `$2000` (size computed dynamically based on BASIC SYS ON/OFF setting).

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
| Free RAM | $C000–$CFFF | Useful for data/strings |
| VIC-II | $D000–$D3FF | Video chip registers |
| SID | $D400–$D7FF | Sound chip |
| Color RAM | $D800–$DBFF | |
| KERNAL ROM | $E000–$FFFF | OS; CHROUT = $FFD2, CLRSCR = $E544 |

---

## License

MIT
