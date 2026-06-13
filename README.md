# C64 Visual Assembler

A Tauri 2-based desktop application for visually composing Commodore 64 6502 assembly programs using drag-and-drop blocks. Arrange mnemonics, macros, and labels in a program list and see the generated ASM and monitor output update in real time. Optionally run the program directly in VICE.

**Current version: v1.7.4**

---


<img title="a title" alt="Alt text" src="/assets//20260328_002258712_iOS.png" width="400">

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

## What's New in v1.6.9

- **FOR / ENDF forward-counting loops** — new loop macros: `FOR X, count, label` loads X/Y with zero, `ENDF label` emits `INX/INY + CPX/CPY #limit + BNE`. Loop body runs 0..limit−1. Supports nested loops, auto-labeling (`for1`, `for2`…), expert text import/export, full assembly/PRG/disassembly. ENDF is 5 bytes.
- **PETSCII null terminator option** — PETSCII blocks now support an optional trailing `$00` byte via a compact checkbox. Expert mode and parser accept/emit `, null` for `.petscii` lines.
- **Interactive tutorial system** — built-in tutorial system with categorized lessons, guided step-by-step tours, and sample links. Fully localised (HU/EN). Tour steps advance on user interactions; menu overlay state respects active tours. Tutorial data lives in `www/tutorial-data.js`.
- **Name-input demo and tutorial** — new sample `name-input-demo.json` demonstrating PETSCII text + CHROUT print loop + CHRIN keyboard input, with a guided interactive tutorial.
- **Lowercase sample text normalisation** — sample demo text operands normalised to lowercase across all samples. PETSCII encoder improved: newlines map to 13, characters uppercase for C64 charset, lowercase→uppercase fallback.
- **Palette sync and UI fixes** — palette item highlighting refactored; active palette items scroll into view. Table macros no longer show operand field. Hungarian translation fixes.
## What's New in v1.7.4

- **Exomizer integration** — optional Exomizer crunching for all run and build paths via a single checkbox in the Settings menu. Configure the Exomizer executable in Hardware Settings, then enable the checkbox to compress PRG and D64 output with `exomizer sfx sys`. Works with VICE launch, D64 export, and C64 Ultimate hardware runs. If the Exomizer path is not configured, a clear error toast is shown instead of launching.

## What's New in v1.7.3

- **UI overhaul — clean, professional look** — removed all gradients, replaced purple/indigo AI-colors with a professional slate-blue palette. Light, Dark and OLED themes all updated.
- **Output toolbar → tabs** — ASM / Monitor / Both / Disassembler selector is now a proper tab bar with bottom-border active indicator instead of radio-button pills.
- **Square, angular UI** — border-radius reduced throughout: buttons, inputs, panels, and controls now use crisp 2–3 px corners. Toggle-switch knobs are square. Blocks keep a comfortable 15 px radius.
- **Block category color wraps all sides** — each block's category-tone colour now appears as a full border plus a wider 6 px left accent bar. Selection no longer overrides the block's identity colour.
- **Light-theme outputs** — ASM, Monitor and Disassembler panels now use a light background in light mode. Monitor text is dark green. Dark/OLED themes keep the classic CRT look.
- **Fluid layout** — removed the 1400 px max-width; palette, program and output panels now scale proportionally with the window.
- **Removed current-file indicator** from the ASM tab heading.
- **`.call` alias for `.invoke`** — macro invocations can now use `.call macroName(arg1, arg2)` as a synonym for `.invoke`, matching familiar assembler syntax.
- **Macro argument parsing improvements** — quoted arguments with commas inside them are now handled correctly. Argument splitting and normalisation rewritten for robustness across expert mode, ASM import and block mode.
- **Auto buffer allocation for deferred macros** — macros like `.rawbytes`, `.rawtext`, `.petscii` that use address parameters now support automatic buffer address assignment via generated buffer labels and a `_autoBufferAddress` allocator.
- **Decimal `.org` syntax** — the ORG directive now accepts plain decimal numbers (e.g. `.org 2049`) in addition to hex (`.org $0801`).
- **Unified label/metadata collection** — `addLayoutLabels()` helper consolidates label map population across all layout functions, reducing duplication and fixing edge cases with symbol resolution.

## What's New in v1.7.2

- **INVOKE + INCLUDE fix** — macros defined in a fixed-address `.include` library (e.g. `$1500`) are now correctly found by `.invoke`. Previously only inline (no address) includes were scanned for macro definitions.
- **MACRO / LABEL block full-color styling** — MACRO/ENDM blocks render with a solid blue accent background; LABEL blocks render with a solid purple accent background, making them visually distinct from regular instruction blocks.
- **Guided tour bubble follows spotlight** — in the *Setting Up VICE & RetroDebugger* tour the card bubble now moves next to the highlighted element instead of staying centred.
- **Tour: menu-button step** — the *Setting Up VICE & RetroDebugger* tour now first spotlights the ☰ menu button, then the Settings entry inside the opened menu, matching the flow of the main app tour.
- **Compilation Errors dialog wider** — max-width increased from 460 px to 720 px; error message text (after the `—` separator) is now highlighted in red.
- **ASM export INVOKE fix** — INVOKE-expanded LOOP, NEXT, REGION/ENDREGION and regular instruction blocks now render with correct syntax instead of raw mnemonic names.
- **Symbol tree: inline macro labels** — `:labelName` suffixes on `.petscii`, `.rawbytes`, `.table` and similar lines now appear in the Expert mode symbol tree (Labels section) and are clickable.
- **Sample-programs highlight fix** — the sample-programs group in the menu is no longer highlighted for non-sample tour steps that use `openMenu`.

## What's New in v1.7.1

- **Label address support for deferred data macros** — `.rawbytes`, `.rawtext`, `.string`, `.data`, `.petscii` now accept a **label name** as the address parameter in Expert mode (e.g. `.rawbytes sprite_data, $00, $01`). The label is resolved at assembly time from the program's label map (CONST, TABLE, LABEL blocks, loop labels).
- **`:macroLabel` suffix in Expert mode** — deferred data macros can define a named label for their target address using `:labelName` at the end of the line (e.g. `.rawbytes $0C50, $00, $00 :nev`). This label is then usable in instructions like `STA nev,X`. The suffix round-trips correctly between block mode and Expert mode.
- **Expert mode validator recognises macroLabel** — the real-time error highlighter in Expert mode now includes `macroLabel` entries in its label map, so instructions referencing those labels no longer show false "cannot be resolved" errors.

- **Settings dialog** — program settings (BASIC SYS stub, block description sync, Expert mode toggle) and ASM output settings (macro source, region comments, memory overlays) moved from the menu into a dedicated Settings dialog. The menu button is now labeled *Settings…* / *Beállítások…*
- **Memory overlays toggle** — new checkbox in Settings → ASM output to show or hide the overlay/collision strips in the memory map view. State persists across restarts.
- **Tour system improvements** — tour card is now a `<dialog>` element rendered in the browser's top-layer, always visible above `showModal()` dialogs. Tour overlay and spotlight use the Popover API for the same guarantee. Spotlight position no longer drifts on macOS WebKit after menu open.
- **New interactive tour: Setting Up VICE & RetroDebugger** — step-by-step guided tour that opens the Settings dialog, highlights the VICE and RetroDebugger path fields, and closes the dialog on finish.
- **Ctrl+Shift+E shortcut** — toggles Expert mode on/off from anywhere in the app (Cmd+Shift+E on macOS).
- **RetroDebugger only** — removed references to C64 Debugger from the manual and UI; the app exclusively supports RetroDebugger as the external debugger.
- **Bug fixes** — settings toggle state now correctly persists across restarts; memory overlay visibility survives all re-renders; tour spotlight no longer misaligns horizontally on first menu open.

## What's New in v1.7.0

- **Macro parameters** — MACRO blocks now support optional parameter lists (`color`, `x, y`, …). Use `{paramName}` placeholders anywhere in the macro body. Invoke with arguments using parentheses: `.invoke setColor(#$07)`. Multiple parameters: `.invoke drawPixel($10, $20)`. Backwards-compatible: space-separated invokes without parens still work.
- **Expert mode blank line preservation** — empty lines in the Expert editor are no longer discarded on save or mode-switch. They survive block mode round-trips and appear as thin dashed spacers in the block list (0 bytes).
- **Spanish language (Español)** — full Spanish UI localisation: all menus, dialogs, tooltips, error messages, block labels, and memory map annotations. Spanish mnemonic descriptions for all 100+ opcodes and macros. Tutorial system fully translated to Spanish (all 5 categories, 15 lessons, 98 steps). Switch via Menu → Settings → Language.
- **Hungarian text encoding fixes** — all accented characters (á, é, í, ó, ö, ő, ú, ü, ű) restored across the entire Hungarian UI locale. Over 170 strings corrected: menus, sample names, field labels, error messages, memory map annotations, debugger strings, and tutorial hints.
- **Tutorial UI polish** — tutorial panel close button correctly sized (no longer elongated by the global button min-height rule).
### Previous: v1.6.8

- **Lowercase charset TEXT/STRING/RAWTEXT auto-detection** — TEXT, STRING, and RAWTEXT macros now automatically detect alphabetic input and encode it for the C64 lowercase charset (`$D018=$17`). `TEXT "Hello World"` produces mixed-case screen codes: lowercase `a`-`z` → scr 1–26, uppercase `A`-`Z` → scr 65–90. Pure numbers/symbols stay backward-compatible. No special flag needed — just switch to lowercase charset with `LDA #$17` / `STA $D018` and type normally.
- **New sample: Lowercase TEXT demo** — demonstrates lowercase charset mode with mixed-case TEXT output. Switches to lowercase charset, then prints three TEXT lines: `hello c64!`, `Visual Assembler`, and `HELLO WORLD` — all rendered correctly with proper case.
- **Load `.asm` opens a new tab** — the Load .asm button in Expert mode now opens the file in a **new tab** with the filename as the tab label, instead of replacing the current tab's content. The file is parsed into program blocks and marked clean on open.
- **Close Project menu item** — new **Close Project** button in Menu → File closes the currently open project and all its file tabs at once, with unsaved-change confirmation.
- **Run respects project startup file** — when a project has a startup file (★ in the tree), the Run button assembles that file's code regardless of which tab is active. Works in both block mode and Expert mode, and across all run targets (PRG, D64, Ultimate).
- **Project panel language fix** — the Expert project panel now correctly reflects the current UI language (no more hardcoded Hungarian text when English is selected).
- **New translations** — `menuCloseProject`, `projClosed`, `projNoOpen` added to both Hungarian and English.

### Previous: v1.6.6

- **Build Info dialog** — toolbar button (block mode and expert mode) opens a summary showing origin address, end address, total size, all labels with their resolved addresses, constants, macros used, and any compile errors.
- **Save / Load `.asm` files in Expert mode** — load a raw `.asm` source file directly into the Expert editor; save the editor content back to a `.asm` file. Works independently of `.c64asm` project files.
- **Expert mode error line highlighting** — lines that fail to compile are highlighted in red (background tint + left accent border) in real time, 350 ms after each keystroke.

### Previous: v1.6.5

- MOUSE macro (142 bytes — C64 1351 proportional mouse via SID POTX/POTY)
- REU_CHECK / REU_STASH / REU_FETCH / REU_SWAP macros (RAM Expansion Unit DMA)
- TURBO_SET / SUPERCPU_DETECT / TURBO_ENABLE macros (U64 + CMD SuperCPU)
- Region copy & paste buttons
- Track block selection in palette (Settings toggle)
| `REGION` / `ENDREGION` | Visual grouping block — collapsible named section; zero bytes; supports nesting |
| `LABEL` | Zero-byte named symbol; resolves in branch/jump operands |
| `COMMENT` | Zero-byte annotation; generates no machine code |
| `MOUSE` | C64 1351 proportional mouse via SID POTX/POTY and sprite movement (142 bytes) |

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
