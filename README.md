# C64 Visual Assembler

A Tauri 2-based desktop application for visually composing Commodore 64 6502 assembly programs using drag-and-drop blocks. Arrange mnemonics, macros, and labels in a program list and see the generated ASM and monitor output update in real time. Optionally run the program directly in VICE.

**Current version: v1.6.5**

---

## What's New

### v1.6.5
- **MOUSE macro** — read C64 1351 proportional mouse via SID POTX/POTY (`$D419`/`$D41A`) and move a sprite; fields: port (1/2), sprite number, two zero-page bytes for previous POTX/POTY; generates a 42-byte inline routine (`$DC00` masked port select → X delta → Y delta inverted for VICE → sprite register update)
- **Region copy & paste** — each REGION block header now has a ⧉ copy button and a ⎘ paste button; copy captures the entire region (REGION + all child blocks + ENDREGION) into a clipboard; paste inserts the copy as a new region immediately after the current region's ENDREGION and scrolls to it; buttons are always visible regardless of collapse state
- **Track block selection in palette** — clicking any block syncs the palette category, highlights the mnemonic, and updates the description panel; can be disabled to keep the palette pinned while editing
- **Expert mode region highlight** — a continuous background div (`#expert-region-bg`) visually marks the active REGION in the expert text editor; updates on scroll and line-height changes
- **Disassembler view** — new **Disasm** output mode shows a real-time disassembly listing (address · hex bytes · mnemonic) alongside the ASM and Monitor views
- **`*` (current PC) operand** — any operand field accepts `*` as a shorthand for the instruction's own address; branch instructions treat `*` as a self-branch (offset `$FE`, infinite loop)
- **TURBO_SET macro** — set U64 CPU turbo speed via `$D031`; speed index 0–15 (up to ~48 MHz) and badline enable/disable; 5 bytes
- **SUPERCPU_DETECT macro** — detect CMD SuperCPU presence by comparing `$D0B8` to `$FF`; result in Z flag (`BNE` = present, `BEQ` = not found); 5 bytes
- **TURBO_ENABLE macro** — enable or disable CMD SuperCPU turbo mode; writes `LDA #$00` + `STA $D07A` (enable) or `STA $D07B` (disable); 5 bytes
- **Bug fixes** — Expert mode Disassembler/Monitor panels now always use a dark background so syntax highlight colors are readable in all themes; block description panel correctly updates on block selection

### v1.6.0
- **REU_CHECK macro** — detect Commodore RAM Expansion Unit presence via writable-register probe on `$DF04` with `$55/$AA`; result in Z flag (`BNE` = REU present, `BEQ` = not found); 34 bytes
- **REU_STASH macro** — transfer a block from C64 RAM to REU via DMA (`$DF01` command `$90`); fields: C64 address, REU address, REU bank, length; 40 bytes inline
- **REU_FETCH macro** — transfer a block from REU to C64 RAM via DMA (`$DF01` command `$91`); 40 bytes inline
- **REU_SWAP macro** — swap a block between C64 RAM and REU via DMA (`$DF01` command `$92`); 40 bytes inline
- **SPRITE_COL macro** — read VIC-II collision register (`$D01E` sprite–sprite, `$D01F` sprite–background) and AND with the sprite bit; result in A register; 5 bytes
- **LOADFILE macro** — load a named file from a D64 at runtime using KERNAL routines `SETNAM`/`SETLFS`/`LOAD`; optional load-address override and `BCS` error label; variable size

### v1.4.7
- **Import dialog inline errors** — failed ASM imports now keep the dialog open and display the error list directly at the bottom of the import dialog
- **Import source recovery** — if import fails, the pasted source text is restored automatically so you can fix and retry immediately
- **Import line numbers** — the Import ASM editor now has synchronized line numbers for easier troubleshooting
- **INCLUDE stability fixes** — sample include reload now resolves relative paths more reliably and avoids disappearing include content on transient reload errors

### v1.4.6
- **BIN (binary) mode** — every instruction block now has a third format option alongside HEX and DEC; operands are entered and displayed as binary values prefixed with `%` (e.g. `AND #%11111000`)
- **Per-block ASM output format** — the global "Numbers in ASM output" HEX / DEC toggle has been removed; the ASM view always renders each block's operands in that block's own format (HEX, DEC, or BIN)
- **ORG block** — BIN option removed from the ORG block's format toggle; only HEX / DEC available
- **Binary operand parsing fix** — operands beginning with `#` in binary mode (e.g. `AND #%11111000`) no longer produce a false WARNING
- **Zero page,X addressing mode** — added to LDA, STA, ADC, SBC, INC, DEC, CMP, AND, ORA, EOR, LDY, STY and shift/rotate instructions (ASL, LSR, ROL, ROR); also added Absolute,X to ASL/LSR/ROL/ROR
- **NEXT block label picker** — the *Next label* field now shows a floating dropdown listing all LOOP labels in the program
- **Stale validation fix** — blocks loaded from a project file now recompute their validation error; stale errors no longer cause false compile failures

### v1.4.5
- **Label + offset addressing** — operand fields now accept `label+$FF` / `label-$FF` / `label+decimal` expressions resolved at compile time (e.g. `STA screen_ram+$0100,X`)
- **Clear screen sample** — new demo program using zero-page pointers and indirect-Y addressing for fast screen clearing
- **REGION nesting** — regions can be nested inside each other (syntax sugar); ASM output is unchanged
- **Dev-mode resource fix** — `resolve_resource_file` helper: samples and PDF manual now load correctly under `tauri dev` by falling back to the workspace source folder in debug builds

### v1.4.4
- **C64 Debugger integration** — launch the assembled PRG in C64 Debugger alongside RetroDebugger; both debuggers share the same breakpoints, symbols, and autostart flags
- **SID macro block** — embed a SID file directly into memory at a configurable address; init/play addresses are auto-detected from the SID header and adjusted for relocation
- **ORG block replaces start address field** — the program's origin is now an explicit ORG block; multiple ORG blocks compile each section to its own address range; ORG address now has a HEX / DEC toggle
- **Options tab** — the output-mode "Program" tab is renamed to "Options"; `-wait` field is now a 500 ms / 1000 ms dropdown

### v1.4.3
- **ORG macro block** — new `*= $ADDR` block in the Macros category; supports multiple origin directives in one program, each section compiled to its own address range and merged into a single flat PRG buffer
- **RetroDebugger integration** — launch the assembled PRG directly in RetroDebugger with breakpoints, code labels, and configurable `-jmp`, `-wait`, `-unpause` flags
- **Breakpoint blocks** — toggle any instruction block as a breakpoint; highlighted in red, automatically included in the RetroDebugger breakpoints file on launch
- **BASIC SYS stub uses configured origin** — the `SYS` target address is now derived from the user's start address setting instead of being hardcoded to `$080D`
- **Program settings panel redesign** — origin input and HEX/DEC toggle moved into the Program settings section; RetroDebugger launch parameters added as inline toggles

### v1.4.2
- **ASM syntax highlighting** — color coding for mnemonics, operands, numbers, labels, directives, comments, region markers
- **ASM panel fills the window** — output panels stretch to bottom; Both mode shares space equally
- **Region comment format** — uses `; region name` / `; endregion name`
- **Copy ASM header** — copied ASM starts with a *Generated by* comment line
- **Duplicate address comment fix** — deferred data sections no longer print start address twice

### v1.4.1
- **REGION / ENDREGION blocks** — group blocks into a named, collapsible section; ENDREGION shows the matching region name; supports nested regions; *Expand all* and *Select in ASM* buttons included; zero bytes generated
- **Block mode caption cleanup** — MACRO, INVOKE, and REGION badges no longer repeat the name when the block is expanded (already visible in the input field)
- **Drag-and-drop fix** — drop indicator now correctly targets blocks inside region wrappers

### v1.4.0
- **GROUP / ENDGROUP blocks** (renamed to REGION / ENDREGION in v1.4.1)
- `#<label` / `#>label` lo/hi byte operator support in immediate mode
- Report Bug menu item — opens mail client with version and OS pre-filled
- 10 PRINT sample program
- Stability fixes: VICE error toast, sample selector, label picker position, startup flash

---

## Screenshot

> *Drag blocks from the left panel, arrange them in the center, and see live ASM output on the right.*

---

## Features

- **Drag-and-drop block editor** — build programs by dragging mnemonic blocks into a list
- **Real-time ASM + Monitor output** — auto-generated as you edit, with configurable start address (`*=`)
- **Block collapsing** — collapse individual blocks or all at once to reduce visual noise
- **Mnemonic search** — filter the palette by name or description
- **TEXT macro** — write text to the C64 screen at an X/Y coordinate using KERNAL CHROUT
- **BYTE macro** — insert arbitrary raw byte arrays inline
- **WORD macro** — insert 16-bit values as LO/HI byte pairs
- **STRING macro** — copy a string (as screen codes) to a fixed memory address
- **DATA macro** — write raw bytes to a fixed memory address via `LDA/STA` pairs
- **RAWBYTES macro** — place raw bytes at a given address without generating runtime code
- **RAWTEXT macro** — place PETSCII text at a given address without generating runtime code
- **FILL macro** — generate repeated bytes with a specified count
- **ALIGN macro** — jump to the next memory boundary (e.g. 64 for sprites, `$2000` for bitmap)
- **TABLE macro** — define a named lookup table at a given address
- **LOOP / NEXT macro** — visual counter loop pair; LOOP loads X or Y with a count, NEXT emits `DEX/DEY + BNE`; nested loops supported
- **PUSH / PULL macro** — save and restore A, X, Y register combinations to/from the stack
- **IF / ELSE / ENDIF macro** — conditional assembly blocks driven by `DEFINE` symbols
- **DEFINE macro** — activate named symbols for conditional assembly
- **CONST macro** — declare named constants; appear in label picker and generate zero bytes
- **MACRO / ENDM / INVOKE** — define and invoke reusable user macros
- **REGION / ENDREGION blocks** — group blocks into a named, collapsible section; supports nesting; zero bytes generated
- **INCBIN macro** — include an external binary file at a given memory address
- **INCLUDE macro** — embed another `.c64asm` project file inline (read-only)
- **SID macro** — load a SID music file directly into memory; header stripped, load/init/play addresses extracted automatically
- **SPRITE_INIT macro** — initialise a VIC-II sprite: sets data pointer (`$07F8+N`), enable bit (`$D015`), and colour (`$D027+N`); parameters: sprite number, colour, data page
- **SPRITE_POS macro** — set a sprite's static X/Y position; handles `$D010` MSB for X > 255; parameters: sprite number, X (0–319), Y (0–255)
- **WAIT_RASTER macro** — inline VIC-II raster line busy-wait (`LDA $D012 / CMP #line / BNE −7`); no JSR or label needed; 7 bytes
- **JOYSTICK macro** — reads a CIA joystick port (1 = `$DC01`, 2 = `$DC00`) and moves a sprite via INC/DEC; 27 bytes inline
- **MOUSE macro** — reads C64 1351 proportional mouse via SID POTX/POTY and moves a sprite; masked CIA `$DC00` port select, delta computation, Y-axis inverted (VICE), sprite X/Y update; 42 bytes inline
- **SPRITE_COL macro** — read VIC-II collision register (`$D01E` sprite–sprite, `$D01F` sprite–background); result in A register; 5 bytes
- **LOADFILE macro** — load a named file from a D64 at runtime using KERNAL `SETNAM`/`SETLFS`/`LOAD`; optional address override and `BCS` error label; variable size
- **REU_CHECK macro** — detect RAM Expansion Unit presence with a `$DF04` write/read probe (`$55`, `$AA`); result in Z flag; 34 bytes
- **REU_STASH / REU_FETCH / REU_SWAP macros** — 40-byte inline DMA transfer macros for C64↔REU memory transfers using the REU DMA registers (`$DF01`–`$DF0A`)
- **TURBO_SET macro** — set U64 CPU speed via `$D031`; speed index 0–15 + badline control; 5 bytes
- **SUPERCPU_DETECT macro** — detect CMD SuperCPU (`LDA $D0B8 / CMP #$FF`); result in Z flag; 5 bytes
- **TURBO_ENABLE macro** — CMD SuperCPU turbo on (`STA $D07A`) / off (`STA $D07B`); 5 bytes
- **Disassembler view** — real-time **Disasm** output mode showing address, raw bytes, and mnemonic for every compiled instruction
- **`*` (current PC) operand** — operand fields accept `*` as a shorthand for the current instruction address; branches with `*` generate an infinite self-loop (`BNE *` → offset `$FE`)
- **LABEL & COMMENT blocks** — named jump targets and zero-byte annotations
- **Memory strip** — full 64 KB C64 memory map visualised as a colour-coded strip (RAM / ROM / I/O)
- **Monitor view** — hex + ASCII character dump, 8 bytes per row
- **VICE integration** — assemble and launch directly in the VICE C64 emulator
- **Dark / light theme**, zoom, HEX / DEC operand mode
- **Hungarian and English UI**
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
| `translations` | `hu` / `en` string dictionaries |
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
  isMacroDefStart: true, macroName: "mymacro",
  isMacroDefEnd: true,
  isMacroInvoke: true, invokeMacroName: "mymacro",
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
| `MACRO` / `ENDM` | Define a reusable named macro block |
| `INVOKE` | Call a user-defined macro by name |
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
| `REGION` / `ENDREGION` | Visual grouping block — collapsible named section; zero bytes; supports nesting |
| `LABEL` | Zero-byte named symbol; resolves in branch/jump operands |
| `COMMENT` | Zero-byte annotation; generates no machine code |

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
