# C64 Visual Assembler — User Manual

**Version 2.6.4**

A visual, block-based 6502 assembler for the Commodore 64. Build programs by dragging and dropping instruction blocks, and see the generated assembly and machine code in real time.

---

## Table of Contents

- [C64 Visual Assembler — User Manual](#c64-visual-assembler--user-manual)
    - [Version 2.6.4 Highlights](#version-264-highlights)
    - [Version 2.6.3 Highlights](#version-263-highlights)
    - [Version 2.6.2 Highlights](#version-262-highlights)
    - [Version 2.6.1 Highlights](#version-261-highlights)
    - [Version 2.6.0 Highlights](#version-260-highlights)
    - [Version 2.5.9 Highlights](#version-259-highlights)
    - [Version 2.5.8 Highlights](#version-258-highlights)
    - [Version 2.5.7 Highlights](#version-257-highlights)
    - [Version 2.5.6 Highlights](#version-256-highlights)
    - [Version 2.5.5 Highlights](#version-255-highlights)
    - [Version 2.5.4 Highlights](#version-254-highlights)
    - [Version 2.5.3 Highlights](#version-253-highlights)
    - [Version 2.5.2 Highlights](#version-252-highlights)
    - [Version 2.5.1 Highlights](#version-251-highlights)
    - [Version 2.5.0 Highlights](#version-250-highlights)
    - [Version 2.4.9 Highlights](#version-249-highlights)
    - [Version 2.4.8 Highlights](#version-248-highlights)
    - [Version 2.4.7 Highlights](#version-247-highlights)
    - [Version 2.4.6 Highlights](#version-246-highlights)
    - [Version 2.4.5 Highlights](#version-245-highlights)
    - [Version 2.4.3 Highlights](#version-243-highlights)
    - [Version 2.4.2 Highlights](#version-242-highlights)
    - [Version 2.4.1 Highlights](#version-241-highlights)
    - [Version 2.4.0 Highlights](#version-240-highlights)
    - [Version 2.3.9 Highlights](#version-239-highlights)
  - [Table of Contents](#table-of-contents)
  - [1. Interface Overview](#1-interface-overview)
  - [2. Block Palette](#2-block-palette)
  - [3. Program Area](#3-program-area)
    - [Operand input](#operand-input)
  - [4. ASM View](#4-asm-view)
    - [Output modes](#output-modes)
    - [Toolkit tab](#toolkit-tab)
    - [Options tab](#options-tab)
    - [Clicking an ASM line](#clicking-an-asm-line)
    - [ASM line numbers](#asm-line-numbers)
    - [Compile progress modal](#compile-progress-modal)
  - [5. Settings \& Toolbar](#5-settings--toolbar)
    - [Version control](#version-control)
    - [Free and open source](#free-and-open-source)
    - [Reporting a bug](#reporting-a-bug)
    - [Memory window and zero page usage](#memory-window-and-zero-page-usage)
    - [Project templates](#project-templates)
    - [Build project](#build-project)
    - [Example programs](#example-programs)
    - [Load .asm file (quick reference)](#load-asm-file-quick-reference)
      - [Import parsing notes and best practices](#import-parsing-notes-and-best-practices)
  - [UltimateBasic Mode](#ultimatebasic-mode)
    - [Opening the UB editor](#opening-the-ub-editor)
    - [Editor tools](#editor-tools)
    - [Projects, tabs, and startup files](#projects-tabs-and-startup-files)
    - [Building and diagnostics](#building-and-diagnostics)
    - [Code size per line and hints](#code-size-per-line-and-hints)
    - [Running, D64, and Exomizer](#running-d64-and-exomizer)
    - [Debugger symbols and disassembly](#debugger-symbols-and-disassembly)
    - [Ultimate Basic manual and source](#ultimate-basic-manual-and-source)
  - [6. Expert Mode](#6-expert-mode)
    - [Switching modes](#switching-modes)
    - [Editor layout](#editor-layout)
    - [Toolbar buttons](#toolbar-buttons)
    - [Cycle counts](#cycle-counts)
    - [Optimisation hints](#optimisation-hints)
    - [Error highlighting](#error-highlighting)
    - [Syntax highlight](#syntax-highlight)
    - [Source formatter](#source-formatter)
    - [Project panel \& tabs](#project-panel--tabs)
    - [Tab bar](#tab-bar)
    - [ACME mode](#acme-mode)
  - [7. Addressing Modes](#7-addressing-modes)
    - [Label expressions as operands](#label-expressions-as-operands)
    - [The `*` program counter in expressions](#the--program-counter-in-expressions)
    - [Local (dotted) labels](#local-dotted-labels)
    - [Self-modifying-code operand labels](#self-modifying-code-operand-labels)
  - [8. Standard 6502 Instructions](#8-standard-6502-instructions)
    - [Data Movement](#data-movement)
    - [Arithmetic](#arithmetic)
    - [Logic](#logic)
    - [Jumps \& Branches](#jumps--branches)
    - [LBNE / LBEQ / … (Long branches)](#lbne--lbeq---long-branches)
    - [Register Operations](#register-operations)
    - [Shift \& Rotate](#shift--rotate)
    - [Stack](#stack)
    - [System / Flags](#system--flags)
    - [Illegal / Undocumented Instructions](#illegal--undocumented-instructions)
  - [9. Macro Blocks — Reference](#9-macro-blocks--reference)
    - [LABEL](#label)
    - [COMMENT](#comment)
    - [BYTE](#byte)
    - [WORD](#word)
    - [FILL](#fill)
    - [ALIGN](#align)
    - [TEXT](#text)
    - [STRING](#string)
    - [DATA](#data)
    - [RAWBYTES](#rawbytes)
    - [RAWTEXT](#rawtext)
    - [PETSCII](#petscii)
    - [CHARSET](#charset)
    - [CHARDEF](#chardef)
    - [BOX_HIT](#box_hit)
    - [INCBIN](#incbin)
    - [KOALA](#koala)
    - [LEVEL / LEVEL\_ROW](#level--level_row)
      - [LEVEL](#level)
      - [LEVEL\_ROW](#level_row)
    - [SID](#sid)
    - [INCLUDE](#include)
    - [TABLE](#table)
    - [ORG](#org)
    - [LOOP / NEXT](#loop--next)
      - [LOOP](#loop)
      - [NEXT](#next)
    - [FOR / ENDF](#for--endf)
      - [FOR](#for)
      - [ENDF](#endf)
    - [PUSH / PULL](#push--pull)
      - [PUSH](#push)
      - [PULL](#pull)
    - [END / RTS alias](#end--rts-alias)
    - [MACRO / ENDM / INVOKE](#macro--endm--invoke)
      - [MACRO (definition start)](#macro-definition-start)
      - [ENDM (definition end)](#endm-definition-end)
      - [INVOKE](#invoke)
    - [REGION / ENDREGION](#region--endregion)
    - [DEFINE / IF / ELSE / ENDIF](#define--if--else--endif)
    - [.ASSERT](#assert)
      - [DEFINE](#define)
      - [IF](#if)
      - [ELSE](#else)
    - [ENDIF](#endif)
    - [CONST](#const)
    - [VAR](#var)
    - [Runtime IF / ELSE / ENDIF](#runtime-if--else--endif)
    - [WHILE / ENDW](#while--endw)
    - [REPEAT / UNTIL](#repeat--until)
    - [MEMCPY / MEMSET](#memcpy--memset)
    - [PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY / SET_BORDER / SET_BG](#print--print_char--print_hex--clear_screen--wait_key--delay--set_border--set_bg)
    - [IRQ_SETUP](#irq_setup)
    - [RAND](#rand)
    - [SPRITE\_INIT](#sprite_init)
    - [SPRITE\_POS](#sprite_pos)
    - [WAIT\_RASTER](#wait_raster)
    - [JOYSTICK](#joystick)
    - [MOUSE](#mouse)
    - [SPRITE\_COL](#sprite_col)
    - [LOADFILE](#loadfile)
    - [EXODECRUNCH](#exodecrunch)
    - [REU\_CHECK](#reu_check)
    - [REU\_STASH / REU\_FETCH / REU\_SWAP](#reu_stash--reu_fetch--reu_swap)
    - [TURBO\_SET](#turbo_set)
    - [SUPERCPU\_DETECT](#supercpu_detect)
    - [TURBO\_ENABLE](#turbo_enable)
    - [MAP\_COPY](#map_copy)
    - [MAP\_COPY16X16](#map_copy16x16)
    - [SPRITE\_ANIM](#sprite_anim)
    - [SCORE\_BCD](#score_bcd)
  - [10. Debugger Integration](#10-debugger-integration)
    - [RetroDebugger](#retrodebugger)
    - [Breakpoint Blocks](#breakpoint-blocks)
    - [Debugger Flags (Options Tab)](#debugger-flags-options-tab)
    - [VICE Monitor (hot reload, live watch, profiler)](#vice-monitor-hot-reload-live-watch-profiler)
  - [11. Knowledge Base Links](#11-knowledge-base-links)
  - [12. D64 Export \& Run](#12-d64-export--run)
    - [Split Run button](#split-run-button)
    - [Export to D64 dialog](#export-to-d64-dialog)
    - [D64 metadata in projects](#d64-metadata-in-projects)
  - [12b. CRT Export (Magic Desk 64K cartridge)](#12b-crt-export-magic-desk-64k-cartridge)
  - [13. Hardware Settings](#13-hardware-settings)
    - [VICE Emulator](#vice-emulator)
    - [Exomizer](#exomizer)
    - [Retro Debugger](#retro-debugger)
    - [C64 Ultimate / 1541 Ultimate](#c64-ultimate--1541-ultimate)
    - [Kung Fu Flash 2](#kung-fu-flash-2)
  - [14. Visual Editors (Toolkit)](#14-visual-editors-toolkit)
    - [Hi-Res / Multicolor Editor](#hi-res--multicolor-editor)
    - [Sprite Editor](#sprite-editor)
    - [C64 Character ROM Browser ("Char map")](#c64-character-rom-browser-char-map)
    - [Character Editor (Charset)](#character-editor-charset)
    - [Charset Canvas Editor](#charset-canvas-editor)
    - [Map Editor (Multilayer Tilemaps)](#map-editor-multilayer-tilemaps)
    - [Level Editor](#level-editor)
    - [SID Editor (3-Voice Tracker)](#sid-editor-3-voice-tracker)
    - [SID Player](#sid-player)
    - [Curve Editor](#curve-editor)
    - [Table Generator](#table-generator)
    - [Number Converter](#number-converter)

---

## Version 2.6.4 Highlights

- **ACME assembler mode** — **Settings → General → Assembler mode** switches between *VMA mode* (the built-in Visual Assembler assembler) and *ACME mode*: the Expert source is built by ACME 0.97, and Run, Build, the Disassembly / Monitor panels, the debugger symbols, cycle counts, optimisation hints and the VICE Monitor all use the real ACME output. See [ACME mode](#acme-mode).
- **Better Kick Assembler import** — the Program menu entry is now **Kick import**. Plain `.text "…"` lines follow `.encoding`, `.label NAME = * + N` places a label inside an instruction, and the `.abs` / `.zp` mnemonic suffixes force the addressing mode. Restore64 disassemblies build byte for byte like KickAssembler. See [Kick import (Kick Assembler)](#kick-import-kick-assembler).
- **Run starts programs below the BASIC line** — a program that loads below or across the BASIC SYS line gets a small start loader; a lower ORG later in the source is no longer moved up to the start address. See the **BASIC SYS stub** row in [Settings & Toolbar](#5-settings--toolbar).
- **Exomizer** — a crunched program no longer gives `?SYNTAX ERROR` on the second RUN: a PRG with a BASIC line is packed with `sfx basic`, any other with `sfx $<load address>`.
- **SID Editor** — a playback LCD in the tracker toolbar (song position, pattern, row, time; green or red in **Settings → SID preview → LCD colour**), an instrument knob with an LCD on VA-VK, a progress bar for **Import .sid…**. See [SID Editor](#sid-editor-3-voice-tracker).
- **Settings in three tabs** — **General**, **Files and paths** and **Integrations**. See [Section 13](#13-hardware-settings).
- **Smaller improvements** — **Ctrl+N** opens a new tab; dialog text can no longer be selected by accident (text fields and copyable output, such as compile errors, still can); large Expert sources edit faster; `LSR A` and `JMP ($nnnn)` import correctly.

---

## Version 2.6.3 Highlights

- **.sid import in the SID Editor** — **Files → Import .sid…** turns any PSID / RSID tune into instruments, patterns and a song you can edit: note ons and legato notes, rows placed exactly on the notes (funktempo and swing through `F` speed changes), wave / arpeggio tables with fixed-pitch drum attacks, pulse and filter movement, gate timing and vibrato. See [SID Editor](#sid-editor-3-voice-tracker).
- **Long tunes play correctly** — when the tune data does not fit next to the player at `$C000`, it moves to its own segment below `$A000` instead of running into I/O; the `.sid` export follows.
- **VA SID Core preview retriggers notes** — a note restarted under a held gate gets a new attack, as on the real player.
- **SID Editor** — the header shows the active SID emulation (WebSID or VA SID Core with the chip model); the Speed field has − / + buttons and takes 1–255; the song can use up to 256 patterns.
- **Update server setting** — **Settings → Updates** sets the server the in-app update reads releases from (default `https://www.c64va.pro/`). See [In-app updates](#in-app-updates).
- **Ultimate Basic 1.6.6** — `PRINT USING "format"; values`, string comparison in PETSCII order, floating-point `rnd` and `mod`, floating point in IRQ / NMI handlers, `option basic print` for C64 BASIC PRINT spacing, smaller programs (only the floating-point routines in use) and 16-bit address expressions (1.6.5). The Ultimate Basic editor highlights `print using` and `option basic print`.

---

## Version 2.6.2 Highlights

- **HVSC in the SID Player** — search the High Voltage SID Collection (about 61,000 tunes) by title, composer or folder, play, add to the playlist or save any tune; download the whole collection in one go for offline use, or point the player at an unpacked HVSC folder. Tunes from HVSC get their real length on the seek bar, and the playlist moves on when a subtune ends. See [HVSC (High Voltage SID Collection)](#hvsc-high-voltage-sid-collection).
- **Spectrum analyzer** — a floating LED-bar visualizer for the SID Player with 8 to 32 bands, fading cells and a mirrored floor. See [Spectrum analyzer](#spectrum-analyzer).
- **Lesson Editor** — turn your own program into a step-by-step guided lesson like the built-in "Build: Your First Text Program": add explanations, pick the folder, try it, save it, export / import `.vatut` files. See [Tutorials and the Lesson Editor](#tutorials-and-the-lesson-editor).
- **Online lessons** — download lessons published on www.c64va.pro straight into the Tutorials list, with updates, and upload your own from the Lesson Editor for review. See [Online lessons](#online-lessons).
- **Every macro takes its parameters in the operand field** — `SET_BG $06`, `REGION Main`, `ORG $C000`, `SPRITE_POS 1, 200, 50` …: the text is read as the macro's Expert line, and the field shows the expected form. See [Parameters in the operand field](#parameters-in-the-operand-field).
- **Smaller improvements** — the active floating window is highlighted, the Support window looks like a chat, the mouse wheel scrolls the tab bar sideways, and the Ultimate Basic code size column no longer covers the line numbers.

---

## Version 2.6.1 Highlights

- **Cycle counts in Expert mode** — a gutter shows the cycles of every instruction, the selection total and how many raster lines it takes. See [Cycle counts](#cycle-counts).
- **Optimisation hints** — the Expert editor marks lines that can be shorter or faster (tail call, redundant `CMP #0`, reloads, `INC` / `DEC` idioms…). See [Optimisation hints](#optimisation-hints).
- **Table Generator** — screen / bitmap row addresses, pixel masks, multiply / divide tables, quarter squares, log / exp, bit reverse, custom expressions and unrolled fill / copy speedcode. See [Table Generator](#table-generator).
- **VICE Monitor** — hot reload into the running VICE, live watch of labels and addresses, and a PC-sampling profiler. See [VICE Monitor](#vice-monitor-hot-reload-live-watch-profiler).
- **Zero page usage map** and a **detachable memory window**. See [Memory window and zero page usage](#memory-window-and-zero-page-usage).
- **Ultimate Basic** — code size per line, hints, and Sprite Editor → Ultimate Basic export with animation.
- **SID Editor → .sid (PSID) export** and a **sprite multiplexer** project template (16 sprites).
- Several floating windows can be open at once; the one you click comes to the front.

---

## Version 2.6.0 Highlights

- **Visual Assembler is now completely free** — the Freemium / Professional licensing has been removed. Every editor, build and hardware run option, all 7 UI languages and every theme work for everyone, without registration or a serial. The reason is simple: under Hungarian tax rules, selling the program would leave too little after taxes and paperwork to be worth it. Serials you already have are simply no longer needed. See [Free and open source](#free-and-open-source).

---

## Version 2.5.9 Highlights

- **Commodore 64 theme** — the C64 power-on screen: a light blue border around blue panels, light blue text, reverse-video buttons, syntax colours from the C64 palette and the C64 font in the monitor view.
- **Commodore Beige theme** — the classic breadbin: beige case, mustard function-key buttons, the rainbow badge stripes and a C64 blue monitor view. Pick it in the theme picker or cycle to it with the theme button. See [Settings & Toolbar](#5-settings--toolbar).
- **Commodore Starlight theme** — a light theme after the translucent C64 breadbin: frosted clear glass with the rainbow RGB glow shining through, a magenta accent, rainbow syntax colours and a smoky dark monitor view.
- **Version control dialog** — the dialog can be dragged by its header and reopens where you left it; it stays on screen when the log or a diff makes it taller, and a click outside no longer closes it (Esc does). See [Version control](#version-control).
- **Project-level version control** — for a tab of an open `.proj` project, a **File / Project** switch commits every source file of the project (project tree + included files) in one entry. The log lists the changed files of each commit, Diff works file by file, Checkout restores all files into the editor tabs, and autosave entries are made per project too. In Git mode the log and diff cover the whole repository. See [Project mode](#project-mode).

---

## Version 2.5.8 Highlights

- **Version control** — the project snapshots became a git-like version control: commits with a message and a short hash, a log with **HEAD**, a **Diff** against the working copy, **Checkout** into the editor and separate autosave entries. Block-mode (JSON) programs are compared as assembly lines, so the diff shows real changes. Works on Block, Expert and Ultimate Basic tabs. See [Version control](#version-control).
- **Git integration** — choose `git.exe` in **Settings → Version control** (or let the app find it). When the project is inside a git repository, the dialog shows the branch, the changed files, commit (saves first), log, diff with a **RAW** view, checkout, **Pull** / **Push** and **git init**.
- **Report Bug** — a built-in report form with up to 4 screenshots (file, Ctrl+V or drag and drop), optional email, system info and the recent app errors. See [Reporting a bug](#reporting-a-bug).
- **SID Player** — **Shuffle** and **favourites** (★) per tune. See [SID Player](#sid-player).

---

## Version 2.5.7 Highlights

- **VA SID Core 1.2** — the SID Player now uses a native Rust C64 core: a cycle-exact 6510 with precise interrupt timing, the CIA 6526A, VIC-II timing with bad lines, sprite DMA and raster interrupts, and the 6510 I/O port. See [SID Player](#sid-player).
- **Hi-Res Editor** — two colours in every 8×8 cell: the new **Cell paper** tool. See [Hi-Res / Multicolor Editor](#hi-res--multicolor-editor).
- **Exact character ROM** in the ROM viewer, the Character Editor's **Load ROM** and the Map / Level editors.
- **Sprite Editor** — hi-res overlay, flood fill, select / move, rotate, Mirror all, sprite sheet import, hitbox, X / Y ×2 preview. See [Sprite Editor](#sprite-editor).
- **Level Editor** — objects, character attributes, edge check, colours per screen, memory meter with RLE, Run in VICE. See [Level Editor](#level-editor).
- **Character Editor** — undo / redo, drawing tools, rotate 90°, copy / paste and drag-to-swap on the map, 2×2 tiles, the lowercase ROM set, a text preview and range export. See [Character Editor](#character-editor-charset).
- **Charset Canvas** — zoom 2×–24× (slider or Ctrl+wheel) with a pixel grid, background colour in hi-res mode, hi-res characters inside multicolor mode, and **ECM** (a background per character). See [Charset Canvas Editor](#charset-canvas-editor).

---

## Version 2.5.6 Highlights

- **SID Player** — a new toolbar button opens a floating player for `.sid` (PSID / RSID) tunes: a playlist with drag and drop, previous / next tune, subtunes, seek and ±10 s, volume, and playlist save / open (`.sidpl`); the list and the window state are remembered. See [SID Player](#sid-player).
- **VA SID Core 1.1** — a built-in SID emulation (MOS 6581 / 8580, with a MOS 6581/8580-based 6581 filter) and a cycle-locked PSID / RSID player (6510 CPU, CIA / VIC timing). Choose it in **Settings → SID preview**; the SID Player shows which engine is playing.
- **SID Editor** — knobs for the instrument parameters, a wider ADSR graph, **MIDI input**, **recording** into the tracker (a new pattern is added when the current one is full), a **metronome** with beat lamps, **pattern delete**, the master volume on VA-VK, and **Import GoatTracker .sng**. See [SID Editor](#sid-editor-3-voice-tracker).
- **Ultimate Basic 1.6.4** bundled.

---

## Version 2.5.5 Highlights

- **Hi-Res Editor: pixel grid and 16× zoom** — with **Grid** on, from 4× zoom every pixel gets its own grid line, stronger on the character-cell borders and shaded to stay visible on all 16 colours. The zoom slider now goes up to 16×. See [Hi-Res / Multicolor Editor](#hi-res--multicolor-editor).
- **Right-click Copy / Paste menu** — on the canvas of the Hi-Res and Map editors (Copy, Paste, Transparent paste) and in the Sprite Editor (Copy frame, Paste frame, also on the frame strip). A paste started from the menu previews where you clicked.
- **Number Converter** — its toolbar button stays highlighted while the converter is shown.
- **Fixed** — the multicolor cell grid of the Hi-Res Editor was twice as wide as a character cell; the Hi-Res toolbar **Paste** button always pasted transparently; the SID Editor right-click menu opened away from the cursor while the dialog was centred.
- **This manual** — selection, copy / paste and transparent paste of the Hi-Res Editor are now described.

---

## Version 2.5.4 Highlights

- **Fixed: window not appearing on relaunch** — if the app was quit with its window minimized or hidden (mostly on macOS, also on Linux / Wayland), the next start could come up without a window. The visible state is no longer saved (the window size still is), and the window is always shown at startup.
- **Ultimate Basic 1.6.3 bundled** — QBasic-style syntax: `dim name as type` for variables and for arrays of every type, `function` / `sub` with `as` types, `elseif`, `do … loop`, `while … wend`, `select case`, `exit do` / `exit sub`, single-line `if`, `'` comments and `print a; b; c`; runtime strings (`+`, `left$` / `right$` / `mid$`) and signed 16-bit `integer`. Highlighted, completed and formatted in the UB editor, with new **DIM**, **FUNCTION**, **ELSEIF**, **DO**, **WEND**, **SELECT CASE**, **END**, **EXIT SUB** and **LEFT$** / **RIGHT$** / **MID$** entries in the Commands panel. See [UltimateBasic Mode](#ultimatebasic-mode).

---

## Version 2.5.3 Highlights

- **Fixed: running in VICE / RetroDebugger on Windows** no longer fails with *program not found* when PowerShell is missing from PATH; VICE starts from its own folder (a linked `x64sc.exe` is resolved to the real one), and paths with spaces are quoted. Point the VICE path to `x64sc.exe` in VICE's `bin` folder, next to its DLLs.

---

## Version 2.5.2 Highlights

- **SID Editor previews on the real SID** — instrument Preview, virtual keyboard, note entry, chord / arpeggio, row and single-pattern playback play through WebSid; the synthesizer remains only as a fallback. See [SID Editor](#sid-editor-3-voice-tracker).
- **Note-off** — key **1** writes `===` into the tracker: the gate is released and the instrument's release runs, like a key-off in other trackers; **Enter** edits the selected cell.
- **Detachable tracker** — the tracker (song, tracker and harmony rows, grid) can float in its own resizable panel and dock back.
- **Wave / arpeggio presets** — the preset list keeps the chosen preset until the table is edited by hand.
- **VA-VK** — the new name of the virtual keyboard, with Play / Stop buttons; it remembers its position, open state, octave and *Insert into tracker*; the SID editor's **master volume** is remembered.
- **Knowledge Base** — C64 OS development environment and png2c64 links, two-column list. See [Knowledge Base Links](#11-knowledge-base-links).

---

## Version 2.5.1 Highlights

- **SID Editor instruments** — filter routing per voice, **3 OFF** and a resonant cutoff **sweep** (start, end, speed, ping-pong); instrument **vibrato** (delay, speed, depth); **pulse width modulation**; **gate timer**, **hard restart** and first-frame waveform; a **wave / arpeggio table** with presets; **RING** and **SYNC**. See [SID Editor](#sid-editor-3-voice-tracker).
- **New SID player** — the exported player runs the instrument modulation every frame (`JSR sid_frame` for your own IRQ); the preview renders the same player through a small SID synthesizer. `.bin` saves keep instrument names and speed.
- **Virtual keyboard** — 2, 3 or 4 octaves in a Commodore 64 synth look.
- **Ultimate Basic 1.6.2 bundled** — `tune` gains `imod`, `ifilt`, `igate` and `itab`; **Export to UltimateBasic** writes them.
- **Bookmarks and Go to line** in the Expert and Ultimate Basic editors — Ctrl+F2 / F2 / Shift+F2, Ctrl+G.
- **Fixed:** label expressions (`.assert`, `LEVEL_MULTICOLOR*16`, `*`) work in the installed app again (no `eval` under the release CSP).
- **D64 Editor** dialogs open in the active working folder; the **Build project** report names the output folder.

---

## Version 2.5.0 Highlights

- **Level Editor** — a new toolbar editor arranges Map Editor screens vertically, horizontally or in a 2D grid and previews the whole level with smooth scrolling. See [Level Editor](#level-editor).
- **LEVEL / LEVEL_ROW macros** — `.level "level.bin"[, $addr]` places only the placed screens of a Level Editor project plus pointer tables and defines `LEVEL_*` labels and constants; `.level_row dst, col[, color]` copies one 40-character level row to a buffer. See [LEVEL / LEVEL_ROW](#level--level_row).
- **JOYSTICK variable mode** — `.joystick port, vx, vy[, fire]` writes the direction into variables (−1 / 0 / +1) instead of moving a sprite; port `3` reads both joystick ports. See [JOYSTICK](#joystick).
- **Level scroll demo** — `samples/level-demo.asm` scrolls a 2×5-screen level pixel by pixel in every direction with the joystick, tear-free, with room left for sprites and game code.
- **Number converter** — a non-modal DEC / HEX / BIN dialog on the toolbar. See [Number Converter](#number-converter).
- **Examples dialog** — **Menu → Examples…** opens a searchable, categorised list of the built-in example programs. See [Example programs](#example-programs).
- **Ultimate Basic 1.6.1 bundled** — `map load "level.bin"[, addr]` reads a Level Editor project directly, and the new `map view px, py` scrolls the map smoothly and tear-free at a pixel position (example: `level_scroll_demo.ub`). A byte product inside a 16-bit sum is no longer truncated to 8 bits. The UB command reference lists `map view`, and its search puts command-name matches first.

---

## Version 2.4.9 Highlights

- **Project templates** — **Menu → File → New project from template…**, or the new toolbar button between **Menu** and **Tutorials**, creates a ready-to-build `.proj` project in its own folder. The dialog has an **Assembler** section (empty program, game skeleton, hires and multicolor bitmap) and an **UltimateBasic** section (empty program, game skeleton, hires bitmap, raster IRQ), with a syntax-highlighted preview. Your own `.asm` / `.ub` templates are picked up from the user templates folder. See [Project templates](#project-templates).
- **Build project** — **Menu → Build → Build project** compiles every buildable file of the open project (or of the open tabs) to a `.prg` next to its source, writes debugger symbol files where available, skips include-only modules and shows a per-file report. See [Build project](#build-project).
- **Ctrl + mouse wheel zoom** in the Expert and Ultimate Basic editors (`Cmd` + wheel on macOS; touchpad pinch works too).
- **Workspaces remember projects** — the Expert and Ultimate Basic project trees, the startup file and unsaved project changes are saved into the `.vaws` workspace and restored with it. Older workspaces still open.
- **Ultimate Basic** — the bundled compiler generates faster, smaller 6502 code; the memory map now tells real code and data apart from padding and long `org` gaps.
- **File dialogs start in the active working folder** — the Block/Expert or the Ultimate Basic one, depending on the current mode.

---

## Version 2.4.8 Highlights

- **New KOALA macro** — `.koala "picture.koa"` (optionally `, $2000`) loads a Koala Painter picture and shows it with an 86-byte display routine. See [KOALA](#koala).
- **Koala import/export in the Hires editor** — **Files → Import Koala (.koa)…** / **Export Koala (.koa)…** (standard 10003-byte file; hi-res pictures are reduced to multicolor on export). `.koa` / `.kla` are also recognised by **Import image / .bin**.
- **Ultimate Basic 1.5.9 bundled** — new `chain "FILE" [, device]` (load another program over the running one and RUN it); `load "FILE"` loads to the file's own address, `load "FILE", addr` to `addr`; D64 fixes. `chain` is highlighted and listed in the command reference.
- **Update status in the Expert status bar** — the same *Up to date* / clickable *Update available* indicator as in Ultimate Basic mode.
- **Save dialogs** offer the file's own type (e.g. *KOA*) instead of *Binary (\*.bin)*.
- **More robust update check** — the installer list is published at c64va.pro/downloads/VA/, so the check works with the new download page; the Linux update helper no longer inherits the AppImage library paths.

---

## Version 2.4.7 Highlights

- **In-app updates** — **Menu → Check for Update** checks c64va.pro for a newer release and, on confirmation, downloads the installer for your platform with a progress bar and installs it. See [In-app updates](#in-app-updates). The check also runs quietly at every start.
- **Update status in the Ultimate Basic status bar** — shows **Up to date (vX)**, or a highlighted **Update available: vY** that opens the update dialog when clicked.
- **Curve Editor → UltimateBasic export** — **Files → Export to UltimateBasic** writes the table as an initialised UB array; **Files → Export UltimateBasic demo** produces a ready-to-run UB sprite demo. See [Curve Editor](#curve-editor).
- **Ultimate Basic 1.5.8 bundled** — the new **`data <array>: v, …`** form fills a declared `array` / `array_word` at program start (further lines continue where the previous one stopped, word arrays take 16-bit values) without touching the `read` stream.
- **Layout fits the window** — the editor panels take exactly the remaining window height, so the app no longer shows a page-level vertical scrollbar; the ASM output panel keeps a 440 px minimum width; the working-folder path sits in a subtle badge above the ASM view title and uses the same badge in the Expert and Ultimate Basic toolbars. Dialog button labels no longer wrap.
- **Ultimate Basic command reference** — `tune` and `music` show full, commented examples (cell format, effects, player notes, `music play N`); `inst`, `order`, `pat` and the tune `speed` have their own entries; `data` shows the new array form; the `load sid` syntax is corrected (`load sid "tune.sid", $2000`).

---

## Version 2.4.6 Highlights

- **SID Editor → UltimateBasic export** — **Files → Export to UltimateBasic** writes the tune as a `tune ... end` block (instruments, order list and pattern rows as text) followed by `music play`, and inserts it at the cursor of the Ultimate Basic editor (outside UB mode it is copied to the clipboard). The UltimateBasic compiler builds a zero-page-free player from it at compile time, so `music play` / `music stop` control the tune and nothing collides with UB variables. Vibrato, slide, note-cut and speed effects are supported; up to 8 patterns, any order-list length. Requires an UltimateBasic compiler with `tune` support.
- **Ultimate Basic language update** — syntax highlighting and the command reference now cover **`sfx`** (non-blocking SID effect: `sfx channel, freq, frames [, wave]`), **`org`** (continue sub/fn code at an address, leaving a zero-filled gap that can hold `incbin` data), **`charset on` / `charset off`** (switch the VIC-II to the RAM character set and back) and **`incbin` slicing** (`incbin "font.prg", $3C00, 2` skips the first bytes, an optional fourth argument limits the length).
- **Multi-block highlight in the ASM view** — selecting several blocks highlights all of their ASM lines at once, the scroll position stays stable while you select, and the line numbers are softer with a subtle vertical separator rule.
- **Assembler mode preserved across Ultimate Basic switches** — opening a project or a built-in sample while Ultimate Basic is active now leaves UB first and returns to your last Block/Expert mode, so the UB buffer can no longer overwrite the new tab's mode or title. New tabs are created in the correct mode.
- **Kung Fu Flash 2 settings** — a **Detect USB** button in Hardware Settings re-scans for the cartridge's serial port, and the KFF2 prerequisites now state the required Kung Fu Flash firmware (v2.07+).

---

## Version 2.4.5 Highlights

- **Kung Fu Flash 2 support — run your programs on a real Commodore 64/128.** A new **Kung Fu Flash 2** entry in the split **Run** menu compiles the program and uploads it over USB straight into a real, powered-on C64 (or C128) fitted with a Kung Fu Flash 2 cartridge — no disk image, no SD-card copying, no emulator. It works in Block, Expert and Ultimate Basic mode. The cartridge's USB serial port is detected automatically (and can be typed in by hand); see [Kung Fu Flash 2](#kung-fu-flash-2) for the setup and the exact workflow.
- **Resizable Program / ASM panels** — a thin vertical splitter between the Program panel and the ASM/Output panel lets you drag the boundary left or right (minimum 260 px per panel). Arrow keys nudge it, double-click resets it to a 50/50 split, and the position is remembered between sessions. The splitter is hidden in Expert and Ultimate Basic mode and in the narrow stacked layout.
- **Cleaner macro lines in the ASM view** — macro blocks are now listed without the leading comment marker (`.print "HELLO"`, `.if A == 1`, `.sprite_init …` instead of `; .print …`), and the ASM syntax highlighter colours them as macros. Ordinary COMMENT blocks and region markers still start with `;`.
- **Custom macro highlighting in the Expert editor** — the macro name after `.macro`, `.invoke` and `.call` (and Kick-style `:name(...)` calls) has its own colour, and so do the `{param}` substitutions inside the macro body and the parameter names in the `.macro` header, in every theme.
- **Refreshed About dialog** — a wider two-column layout with grouped project, license and credit links, and the Ultimate Basic banner now has a transparent background so it blends into every theme.
- **Web64 on the product site** — a new Web64 IDE section on [c64va.pro](https://www.c64va.pro).
- **Sample update** — the `macro-with-parameter` sample now uses the parenthesised `.macro setColor(color)` form.

---

## Version 2.4.3 Highlights

- **SID Editor: Song/order list** — patterns are now arranged through a proper song/order list layered on top of the raw pattern bank, so a pattern can repeat and the song can be longer than the number of stored patterns. Add, remove, and reorder steps directly from the SID Editor; playback and the exported player both walk this list instead of the raw pattern order.
- **SID Editor: Effect column** — every tracker cell can now carry an effect alongside its note: **V**ibrato, slide **U**p / **D**own, note-**C**ut, and speed-change (**F**). Type it straight into a cell, e.g. `C-4 01 V24` (note + instrument + vibrato) or `F06` (speed change only). Effects run once per row, matching the exported player, and now play back correctly both in the in-app Web Audio preview and in the compiled 6502 export — a real, playable effect engine, not just export scaffolding.
- **Backward-compatible SID save format** — SID saves now carry a version marker, so older `.bin` saves made before the effect column existed keep loading exactly as before, with effects simply absent.
- **D64 Editor: explicit Save workflow** — every edit (add/extract/rename/delete, and now Block Editor byte edits) happens on a private working copy; nothing touches your real `.d64` file until you click **Save**, which also writes an automatic backup first. Closing the editor or opening another disk with unsaved changes now asks for confirmation instead of discarding them silently.
- **D64 Editor: Block Editor hex grid** — the raw byte view for the selected 256-byte block is now a proper per-byte hex grid instead of a plain text box, and its dialog no longer dims the rest of the app behind it while open.

---

## Version 2.4.2 Highlights

- **Drag & drop onto the D64 Editor** — drop a compiled `.prg`/`.bin` file (from the SID/sprite/char editors' exports, or anywhere else) straight onto the disk image; the Add panel opens pre-filled. Dropping several files at once queues them one after another.
- **Generate include file** — a new toolbar button writes a `.inc` file listing `.const NAME = $ADDR` for every entry on the disk, so the main program can reference where each one landed without retyping addresses by hand.
- **Block editor (new)** — a toolbar toggle switches the D64 Editor to raw track/sector access below the directory: a clickable block map (colored by the BAM's free/used bitmap, with the BAM and directory chain marked separately), a hex view/editor for the selected 256-byte block, and Prev/Next sector navigation. Reads and writes the disk image directly (`read_bin_file`/`write_bin_file`), independent of `c1541`.

---

## Version 2.4.1 Highlights

- **Polish and Italian UI languages** — full interface translation (menus, dialogs, mnemonic descriptions, Ultimate Basic command reference) alongside the existing Hungarian, English, Spanish, German and Dutch.
- **Online Help toolbar button** — a new icon button after Debug opens the multi-language documentation site ([c64va.pro/docs.html](https://www.c64va.pro/docs.html)) directly from the app.
- **Centralized mnemonic descriptions:** per-language mnemonic descriptions moved into the shared translation file alongside the rest of the UI strings. Also fixes a longstanding bug where the English descriptions for `PRINT`, `PRINT_HEX`, `CLEAR_SCREEN`, `WAIT_KEY`, `SET_BORDER`, `SET_BG`, `IRQ_SETUP` and `RAND` were silently overwritten by leftover Spanish text.

---

## Version 2.4.0 Highlights

- **D64 Editor** — a full disk-image browser on the toolbar (after the Curve Editor). Open an existing `.d64`, create a new blank one, or launch the current disk straight into VICE, all from a Files ▾ menu matching the other visual editors. See [D64 Editor (browse & edit an existing disk image)](#d64-editor-browse--edit-an-existing-disk-image).
- **Add / extract / rename / delete on the D64 Editor** — add a local file to the disk directory, extract a selected entry back to a `.prg`, rename an entry inline in the table, or delete it — every action is applied straight to the `.d64` file via `c1541`, with no separate save step.
- **Load address, decompress address & Exomizer in the D64 Editor** — adding a headerless raw file lets you set an optional load address, an Exomizer decompress target, and compress it on the way in, using the same `mem`/`sfx` crunch modes as the Export to D64 dialog's extra files. A `.prg` that already carries its own header skips these fields entirely.
- **Disk entry type selector** — choose PRG / SEQ / USR / REL for a newly added file instead of always writing it as PRG.
- **Authentic directory listing** — the D64 Editor's file list renders in the bundled C64 Pro font, uppercase, for the classic `LOAD"$",8` look.
- **Fixed:** renaming an entry in the D64 Editor no longer discards the edit when you click into the text field.
- **Improved:** the light theme's mode-indicator toolbar badge (BLOCK MODE / EXPERT MODE / …) is darker and more legible, and its shimmer animation is visible again.

---

## Version 2.3.9 Highlights

Five assembler quality-of-life features, all usable in Expert mode text and (where it makes sense) as blocks. Each has its own reference section further down:

- **`*` in any expression** — the program-counter symbol now works inside operand expressions, not only on its own: `BNE *-5`, `JMP *+20`, `LDA #<*`, `LDA #>(*+63)`. A `*` that follows a value (`STRIDE*2`) is still multiplication. See [Addressing Modes → The `*` program counter in expressions](#the--program-counter-in-expressions).
- **Local (dotted) labels** — a label such as `.loop` belongs to the scope of the nearest preceding *global* (non-dotted) label, so `DrawSprite` and `ClearScreen` can each define their own `.loop` without a clash. See [Local (dotted) labels](#local-dotted-labels).
- **Long-branch pseudo-ops** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`, `LBMI`, `LBPL`, `LBVC`, `LBVS` assemble to an inverted branch over a `JMP` (always 5 bytes) so the target can be any distance away. New **Long branches** palette category. See [LBNE / LBEQ / … (Long branches)](#lbne--lbeq---long-branches).
- **`.assert` directive** — `.assert end - start <= 256` or `.assert * < $A000, "message"` is evaluated at assembly time and fails the build (showing the actual value) when the expression is false. See [.ASSERT](#assert).
- **Self-modifying-code operand labels** — `LDA value:#$00` defines the label `value` pointing at the instruction's operand byte, so `STA value` patches it directly. See [Self-modifying-code operand labels](#self-modifying-code-operand-labels).
- **Friendlier out-of-range branch errors** — a branch that lands outside −128…+127 now reports exactly how far it overshoots and suggests the matching `LBxx` long branch.

---

## 1. Interface Overview

The app is split into three main panels:

| Panel | Description |
|---|---|
| **Left — Palette** | All available instruction and macro blocks. Search or browse by category. |
| **Center — Program** | Your program. Drag blocks here, reorder them, edit operands. |
| **Right — Output** | Live ASM view and/or memory monitor output. |

The mode badge at the far right of the header identifies the active **Block**, **Expert**, or **Ultimate Basic** editor. It updates immediately when the editing mode changes.

In Block mode, a thin **vertical splitter** sits between the Program and Output panels. Drag it to give either panel more room (each keeps at least 260 px), use ← / → to nudge it in 16 px steps, or double-click it to reset the split to 50/50. The position is saved with the UI settings. The splitter is hidden in Expert and Ultimate Basic mode and when the window is narrow enough for the panels to stack.

---

## 2. Block Palette

The palette on the left lists all available blocks grouped by category:

- **Data movement** — LDA, LDX, STA, STX, …
- **Arithmetic** — ADC, SBC, INC, DEC, CMP, …
- **Logic** — AND, ORA, EOR, BIT
- **Jumps & Branches** — JMP, JSR, RTS, BNE, BEQ, …
- **Long branches** — LBNE, LBEQ, LBCC, LBCS, LBMI, LBPL, LBVC, LBVS (branch to any distance; see §8)
- **Register operations** — TAX, TAY, INX, DEX, …
- **Shift & Rotate** — ASL, LSR, ROL, ROR
- **Stack** — PHA, PHP, PLA, PLP
- **System** — CLC, SEC, NOP, BRK, …
- **Illegal instructions** — LAX, SAX, DCP, …
- **Structure** — LABEL, COMMENT, REGION, ENDREGION
- **Macros** — LOOP, NEXT, FOR, ENDF, PUSH, PULL, END, TEXT, BYTE, WORD, FILL, ALIGN, ASSERT, STRING, DATA, RAWBYTES, RAWTEXT, PETSCII, CHARSET, INCBIN, SID, INCLUDE, TABLE, ORG, MACRO, ENDM, INVOKE, IF, ELSE, ENDIF, VAR, WHILE, ENDW, REPEAT, UNTIL, MEMCPY, MEMSET, PRINT, PRINT_CHAR, PRINT_HEX, CLEAR_SCREEN, WAIT_KEY, DELAY, SET_BORDER, SET_BG, IRQ_SETUP, RAND, SPRITE_INIT, SPRITE_POS, WAIT_RASTER, JOYSTICK, MOUSE, SPRITE_COL, LOADFILE, REU_CHECK, REU_STASH, REU_FETCH, REU_SWAP, TURBO_SET, SUPERCPU_DETECT, TURBO_ENABLE, MAP_COPY, MAP_COPY16X16, SPRITE_ANIM, SCORE_BCD

Use the **search box** at the top of the palette to filter by name. Click the **Add selected block** button or drag a block into the program area.

### Parameters in the operand field

Every block with parameters takes them in the **operand field** before **Add**. For an instruction it is the operand (`06` for `LDA #$06`); for TEXT, BYTE, LABEL, REGION and the other text or list macros it is their text or value; for every other macro it is what follows its keyword in Expert mode:

| Block | Operand field | Becomes |
|-------|---------------|---------|
| SET_BG | `$06` | `.set_bg $06` |
| REGION | `Main` | `.region Main` |
| ORG | `$C000` | `* = $C000` |
| SPRITE_POS | `1, 200, 50` | `.sprite_pos 1, 200, 50` |
| LOOP | `Y, $05, myloop` | `.loop Y, $05, myloop` |

The field shows the macro's default parameters as a hint. Blocks without parameters (ENDREGION, ELSE …) and the file macros (INCBIN, KOALA, LEVEL, SID, INCLUDE — they pick their file in the block) keep the field disabled.

---

## 3. Program Area

- **Drag & drop** blocks from the palette, or **reorder** existing blocks by dragging their handle (≡).
- Each block shows its **mnemonic**, **operand field**, and **addressing mode selector** (where applicable).
- Click the **▸ / ▾** toggle to collapse or expand a block.
- Use the **× (delete)** button on a block to remove it.
- **Collapse All** button folds all blocks at once.

### Block panel minimap

The Program panel has a toggleable **minimap** button in its heading. When enabled, a narrow `56 px` canvas strip appears on the right edge of the panel, showing all blocks as colour-coded horizontal bars:

| Bar colour | Block type |
|------------|-----------|
| Cyan | Labels |
| Blue/purple | Macros and directives |
| Yellow | Instructions |
| Green | Comments and blank lines |
| Red | Blocks with a validation error |

Collapsed blocks are rendered at reduced opacity. Click or drag anywhere on the minimap to scroll the program list to that position. The viewport indicator (accent-coloured rectangle) tracks the visible portion of the list. State is persisted in UI settings (`blockMinimap` key).

### Operand input

- For branch/jump instructions (`BNE`, `JMP`, `JSR`, etc.) a **label picker** dropdown appears — click a defined label to insert it.
- Number format follows the **HEX / DEC** toggle in the toolbar (see section 5).

---

## 4. ASM View

The right panel shows the generated output in real time.

### Output modes

| Mode | Description |
|---|---|
| **ASM** | 6502 assembly source with addresses and labels |
| **Monitor** | Hex / byte dump (C64 monitor style) |
| **Disasm** | Pure 6502 disassembly: address · hex bytes · mnemonics with resolved numeric operands. Macros are expanded to individual instructions (TEXT → LDA/STA pairs, LOOP → LDX, etc.). BYTE/WORD/FILL data shown as chunked hex dump. No macro names, comments, or annotations in output. |
| **Both** | ASM on top, monitor below |
| **Disassembler** | Same as Disasm — dedicated tab for the disassembly view |
| **Toolkit** | C64 reference panel: 16-colour palette swatch + PETSCII control-code and printable-character cheat sheet. Read-only — see the "Toolkit tab" subsection below for details. |
| **Options** | Program settings panel — number format, macro source toggle, debugger params |

Macro blocks appear in the ASM and Both views as plain macro lines without a comment marker (`.print "HELLO"`, `.wait_raster $FF`, `.invoke setColor(blue)`) and are coloured as macros; only real COMMENT blocks, region markers and warnings keep their leading `;`.

### Toolkit tab

The **Toolkit** tab in the ASM view is a read-only quick-reference panel — it never modifies your program. Two sections:

| Section | Content |
|---|---|
| **C64 colour palette** | 16-swatch grid showing every C64 colour with its index (0–15 / `$00`–`$0F`) and name. Click a swatch to copy its hex index to the clipboard. Hover for the colour name (Light Blue, Brown, etc.). |
| **PETSCII control codes** | Common control codes for `CHROUT` ($FFD2): colour change codes (`$05` white, `$1C` red, `$1E` green, `$1F` blue, …), cursor movement (`$11`/`$1D`/`$91`/`$9D`), reverse on/off (`$12`/`$92`), `$93` clear screen, `$8E`/`$0E` charset switches. Also a printable-range cheat sheet (32-64 punctuation, 65-90 A-Z, 91-95 brackets, 96-127 graphics, 160-191 shifted graphics, 192-223 mirror). |

The Toolkit is the fastest way to look up a colour index or a PETSCII control byte without leaving the editor.

### Options tab

The **Options** tab contains the settings that affect code generation and output display:

- **Macro source** — when ON, macro definition blocks (MACRO…ENDM) show their source code inline in the ASM view.
- **Program start address** — now set via an **ORG block** in the program area rather than a separate input field. The first ORG block defines the program's load address; subsequent ORG blocks start additional sections at different addresses.
- **Debugger params** — three inline toggles controlling which flags are passed to the external debugger on launch:
  - **`-jmp` ON/OFF** — jump directly to the program's start address after loading.
  - **`-unpause` ON/OFF** — unpause the debugger immediately on load.
  - **`-wait` ms ON/OFF** — adds a `-wait <ms>` delay before unpausing; select 500 ms or 1000 ms from the dropdown.
- **Compile info** — shows a summary of the compiled program (code start address, size, BASIC SYS stub status).

### Clicking an ASM line

Click any line in the ASM view to **highlight the corresponding block** in the program area. When several blocks are selected, the ASM lines of all of them are highlighted together.

### ASM line numbers

The ASM panel displays **line numbers** (`001 |`, `002 |`, …) to make troubleshooting easier when a compile error points to a specific line.

- The visual line numbers are for diagnostics only.
- **Copy ASM** still copies the clean source text **without** line-number prefixes.

### Compile progress modal

During heavier actions, a centered progress modal appears with a progress bar:

- **Run in VICE** — compiling/building PRG and launching emulator.
- **Debug** — compiling/building PRG and launching debugger.
- **Load .asm file** — open an `.asm` file in Expert mode and materialize blocks from the source.

The modal closes automatically when the action completes or fails.

---

## 5. Settings & Toolbar

| Control | Description |
|---|---|
| **Number base (HEX / DEC / BIN)** | Sets the display/input format for operands throughout the UI. BIN mode displays values as binary with `%` prefix (e.g. `%11111000`). The ASM view always shows each block in its own format. |
| **Language** | Switch the user interface between English, Hungarian, Spanish, German, and Dutch (Nederlands) |
| **Theme** | Light / Dark / OLED / Commodore 77 / Commodore Starlight / Commodore Beige / Commodore 64 — select from the theme picker in the Settings menu. OLED uses a pure-black background for AMOLED displays. Commodore 77 is a neon-yellow-on-black theme; when it is the active theme the startup splash panel uses the theme's panel colour (matching the message card), shows a smaller dedicated Commodore 77 logo, and a yellow progress bar. Commodore Starlight is a light theme after the translucent C64 breadbin: frosted clear glass panels with the rainbow RGB glow shining through, a magenta accent, rainbow syntax colours and a smoky dark monitor view. Commodore Beige is the classic breadbin: a beige case, mustard function-key buttons, the rainbow badge stripes and a C64 blue screen for the monitor view. The chosen theme is applied before the first paint on the next launch. |
| **CRT retro mode** | Toggles a full-screen CRT filter: scanlines, phosphor vignette, flicker, and barrel distortion. State is saved between sessions. |
| **Show memory panel** | Global toggle that shows or hides the full C64 memory panel |
| **BASIC SYS stub** | Prepends a BASIC line that calls SYS to your program's origin (the first ORG). A segment placed lower than the first ORG stays at its own address. When the program loads below or across the BASIC line (`$0801`–`$080C`, for example an imported dump from `$071C`), Run and Build add a small start loader instead: `SYS 2061` copies a mover to the tape buffer (`$033C`), which puts the program in place and jumps to the first ORG. |
| **Examples…** | Open the example browser and load a built-in example program — see [Example programs](#example-programs) |
| **Zoom in / out** | Scale the block UI (affects all block elements) |
| **Save Project** | Save the current program as a `.json` project file |
| **Save Program As** | Save the current program as a `.json` project file using a new file dialog every time |
| **Load Project** | Load a previously saved project |
| **Save Workspace** | Save the exact set of currently open, file-backed tabs — including the active tab and each tab's editor mode (Block/Expert/Ultimate Basic) — to a `.vaws` workspace file |
| **Save Workspace As** | Save the current workspace using a new file dialog every time |
| **Open Workspace** | Close all open tabs and reopen the set of files stored in a `.vaws` workspace file |
| **Set working folder** | Choose the default folder used by file pickers and save dialogs. The path is stored in the app config, and menu previews keep the end of the path visible. |
| **New project from template…** (`Menu → File`, or the toolbar button next to **Menu**) | Create a new `.proj` project from an Assembler or UltimateBasic template in its own folder — see [Project templates](#project-templates) |
| **Open Project** (`Menu → File`) | Open a multi-file `.proj` project and open all source files as tabs |
| **Save Project** (`Menu → File`) | Save the current `.proj` project (project panel must be open) |
| **Close Project** (`Menu → File`) | Close the currently open project and all its file tabs. Prompts to save unsaved changes. The project panel resets to its empty state. |
| **Load .asm file** | Opens a `.asm` file in Expert mode and imports textual 6502 ASM into the current tab |
| **Save PRG** | Export the compiled binary as a `.prg` file |
| **Build CRT** | Export the program as a 64K Magic Desk (`.crt`, cartridge type 19) file. See [Section 12b](#12b-crt-export-magic-desk-64k-cartridge). |
| **Build project** (`Menu → Build`) | Compile every buildable file of the project (or of the open tabs) to a `.prg` next to its source — see [Build project](#build-project) |
| **Run (split button)** | The main **▶ Run** button runs the current mode; click the **▾** arrow to switch between: **Run as PRG** (compile and launch VICE directly), **Run via D64** (package into a .d64 disk image and launch VICE), **Run on hardware** (send PRG to a C64 Ultimate / 1541 Ultimate device), or **Kung Fu Flash 2** (upload the PRG over USB to a real C64/C128 with a Kung Fu Flash 2 cartridge). See [Section 12](#12-d64-export--run) and [Section 13](#13-hardware-settings). |
| **Debug (RetroDebugger)** | Compile and launch in RetroDebugger with breakpoints, symbols, and autostart flags (see [Section 9](#9-debugger-integration)) |
| **Run with Exomizer** | Checkbox in the Settings menu — when enabled, all Run and Build operations crunch the PRG through `exomizer sfx` before launching or saving (`sfx basic` for a PRG that starts with a BASIC line, so RUN works again after the program returns; `sfx $<load address>` otherwise). Works with Run as PRG, Run via D64, Run on Hardware, Build PRG, and Build D64. Configure the Exomizer executable in **Hardware Settings** first. |
| **Automatic autosave entries** | Checkbox in **Hardware Settings → Version control**. When enabled, the app adds an autosave entry to the version history about 2.5 seconds after you stop editing a tab (for a tab of a project also to the project history). Turn it off if you only want your own commits. See [Version control](#version-control). |
| **Settings** (formerly Hardware Settings) | Open the settings dialog with three tabs: **General** (assembler mode, BASIC SYS stub, Exomizer, updates, ASM output, SID preview, debugger parameters, version control), **Files and paths** (VICE, RetroDebugger, ACME, Exomizer, git) and **Integrations** (C64 Ultimate, Kung Fu Flash 2). See [Section 13](#13-hardware-settings). |
| **New program…** | Opens a confirmation dialog, then clears all blocks from the program area |
| **Collapse All** | Collapse all blocks |
| **About** | Version info |
| **What's New** | Changelog |

### Version control

Every tab has its own version history, like a small git repository; a tab that belongs to an open `.proj` project can also be versioned as a whole project (see [Project mode](#project-mode)). **Menu → Build → Version control…** (or **Commit…**) opens the dialog; **Discard changes (back to HEAD)** restores the last commit directly.

The usual workflow: write a **commit message** and press **Commit** (or Ctrl+Enter) → keep editing → press **Diff** to see what changed → commit again.

- **Commit** — saves the current state of the tab with your message. Every commit gets a short hash (for example `1bd55ba`); the newest one is **HEAD**. A commit with no changes since HEAD is not created.
- **Status line** — *Nothing to commit, working tree clean* or *Uncommitted changes since `<hash>`*.
- **Diff** — the changes since HEAD; the **Diff** button of a log entry compares that version with the editor. Added lines are green, removed lines red, and the header shows **+N / −M**. Block-mode programs are compared as assembly lines (one line per block), Expert sources line by line, Ultimate Basic tabs by their source, so a Block-mode project saved as JSON still shows readable changes.
- **Checkout** — loads that version into the editor. The file on disk only changes when you save; **Discard changes** goes back to HEAD.
- **Autosave entries** — with **Settings → Version control → Automatic autosave entries in version control** the app adds an entry about 2.5 seconds after you stop editing. They are marked *autosave*; the last 20 are kept, next to up to 100 commits.
- The dialog can be moved by its header; it reopens at the same place and closes with **Esc** or its close button (a click outside does not close it).
- The history is stored next to the project file as `<project>.snapshots.json` (in the app config folder until the project is saved), so it survives restarts. Snapshots made by earlier versions appear as commits.

#### Project mode

When the tab belongs to an open `.proj` project (Expert or Ultimate Basic project panel), the dialog header shows a **File / Project** switch; **Project** is selected by default. Tabs outside a project keep the per-file history described above.

- **Commit** records every source file of the project in one entry: the files of the project tree plus the text files they include (`.include`, `include`, `#import`, `!source`, Block-mode INCLUDE blocks). Open tabs count with their current, even unsaved, content; the other files are read from disk. Binary files of the project tree (fonts, `.koa`, `.bin`, `.sid` …, up to 1 MB each) are recorded too; their diff shows the size change, and **Checkout** writes them straight back to disk.
- The log shows the commit message, the short hash and the **changed files** of each entry (**A** added, **M** modified, **D** removed).
- **Diff** works file by file: every changed file gets its own header and hunks.
- **Discard changes** goes back to the last project commit (HEAD) the same way.
- **Checkout** (after a confirmation) loads every file of that version into the editor: open tabs are updated, missing files are opened as new tabs. Nothing is written to disk until you save; files added to the project since that version stay as they are.
- Autosave entries are made at project level too.
- The project history is stored next to the project file as `<project>.proj.history.json`.
- In **Git** mode the log shows the whole repository with the changed files of each commit (`git log --name-status`); **Diff** on an entry shows the commit file by file, the **Diff** button compares HEAD with the project files in the editor (**RAW** is `git diff HEAD` of the repository). **Commit** saves every unsaved project tab and stages all changes (`git add -A`); **Checkout** loads the project files of that commit into the editor.

#### Git

If `git` is installed, the same dialog can work with a real git repository.

- **Settings → Version control:** **Choose git.exe…** or **Auto-detect** (searches the PATH and the usual install folders); the line below shows the git version. **Use Git when the project is in a repository** (on by default) switches the dialog to Git mode automatically for files inside a repository. The **Built-in / Git** switch in the dialog header changes the mode by hand.
- The header shows the branch with **↑** (commits to push) and **↓** (commits to pull), followed by the changed files of the repository.
- **Commit** saves the file first, stages only this file (or every change with **Stage all changes (git add -A)**) and runs `git commit`.
- The log lists the commits of this file with their branches and tags. **Diff** on an entry compares the commit with its parent; the **Diff** button compares HEAD with the editor, unsaved changes included. Project files are compared the same way as in the built-in mode; **RAW** shows the plain `git diff`.
- **Checkout** loads the file of that commit into the editor (`git show`) without touching the disk.
- **Pull** (`--ff-only`), **Push** (the first push sets the upstream with `-u origin <branch>`) and **Create repository (git init)** when the folder is not a repository yet.
- git runs without a console window and never asks for a password: credentials must come from a credential manager or an SSH key, otherwise the error message is shown in the dialog.
| **Knowledge Base** | Reference links (6502 opcodes, C64 KERNAL, memory map, colors) |
| **Check for Update** | Check c64va.pro for a newer release and download / install it — see [In-app updates](#in-app-updates) |

### In-app updates

**Menu → Check for Update** looks up the newest release on c64va.pro (it reads the download links for your platform) and compares it with the running version:

- **Up to date** — the dialog says so.
- **Update available** — choose **Update now** to download the installer (a progress bar shows the download), **Later** to close the dialog, or **Skip this version** to stop the automatic check from offering that release again.

After the download the app installs the update and restarts:

| Platform | What happens |
|---|---|
| **Windows** | The setup runs in passive mode (progress only) and starts the new version when it finishes. A per-machine install asks for administrator rights (UAC). |
| **macOS** | The DMG is mounted and the app bundle is replaced in place, then the new version starts. If the app folder is not writable, the DMG is simply opened so you can drag the app over. |
| **Linux** | An AppImage is swapped for the new one. A `.deb` / `.rpm` installation is updated with `pkexec` (you are asked for your password); without `pkexec` the package is opened in your software installer. |

If there are unsaved tabs, the app asks before closing. The same check runs quietly a few seconds after every start: nothing is shown unless a newer version exists. The result also appears in the Ultimate Basic status bar — **Up to date (vX)**, or a highlighted **Update available: vY** that opens the update dialog.

**Update server:** **Settings → Updates → Update server** sets where releases are looked up (default `https://www.c64va.pro/`); the installers are read from `<server>downloads/VA/`. The address must use `https://` (plain `http://` only for `localhost`, for testing); **Default** goes back to c64va.pro.

### Free and open source

Visual Assembler is free: every feature — the visual editors (SID, Sprite, Char, Charset, Hi-Res, Map, Level, D64, Curve), the SID Player, **Build PRG**, **Build D64**, **Build CRT**, **Build project**, Exomizer packing, running on the C64 Ultimate and on the Kung Fu Flash 2, and every UI language and theme — works without a registration or a serial. The source code is available under the GNU General Public License v3.0 (see **Menu → About**). Up to version 2.5.9 the app had a Freemium / Professional split; since 2.6.0 a serial entered there is simply no longer needed.

If you like the program, you can support its development with a donation: **Menu → Donation** (under View) opens the donation page on c64va.pro, where you can give any amount through PayPal.

**Usage statistics.** At most once a day, at startup, the app sends an anonymous ping to c64va.pro with the app version, the operating system, the UI language, the number of launches and the active minutes since the last ping (a minute counts while the window is visible and you used the mouse or keyboard in the last 5 minutes), whether a serial from 2.5.6–2.5.9 is still stored (yes / no only) and a random install ID (kept in the app's `config.json` as `launchPing`). No email address, serial, project or source code is sent; offline nothing happens. The app also asks c64va.pro for an occasional short message (for example about a new version, sometimes only for supporters); each message is shown once.

### Reporting a bug

**Menu → Report Bug** opens a form that sends the report straight to the developer.

- **Summary** and **What happened?** are required — describe what you did, what you expected and what happened instead. **Email** is optional; give it if you want a reply.
- **Screenshots:** up to 4 images with **Add image…**, by pasting with **Ctrl+V** (for example after Win+Shift+S) or by dropping them on the form. Large images are scaled down to 1920 pixels.
- **Include system info and recent errors** (on by default) adds the app version, the operating system, the language, the theme, the editor and run mode, the screen size, the number of blocks and the last app errors. **What is sent?** shows the data. Your source code is not sent.
- **Send report** confirms with the report number. **Send by email** opens your mail program instead.

### Support

**Menu → Support** opens a chat with the developer: write a question, an idea or a problem and press **Send** (or **Ctrl+Enter**). You can attach up to 3 files (4 MB in total): images, source files (`.asm`, `.ub`, `.txt` …), C64 files (`.prg`, `.d64`, `.sid`, `.crt` …) or a `.zip` — with **Attach file…**, by pasting (**Ctrl+V**) or by dragging them onto the window. The reply appears in the same window, also with files: images show as previews, a click saves a file. The window is not modal: drag it by its header, resize it from its lower right corner, and keep working while it is open. The app checks for replies at startup and every minute; a new reply plays a short beep (the speaker button in the window's header mutes it), flashes the taskbar icon when the app is in the background, shows a red dot on the **Menu** button and opens the window once. Once you have a conversation, an envelope icon next to the **Menu** button opens it; it turns red and blinks with the number of unread replies. The **×** next to a message deletes that message, the bin button in the window's header deletes the whole conversation with its attachments (also for the developer; both ask first). An email address is optional: if you give one, the reply also arrives by email. The conversation is tied to the app's random install ID, so there is no account and no password.

### Workspaces

A **workspace** (`.vaws` file) remembers which real, on-disk files were open across every tab — including each tab's editor mode and which tab was active — so you can reopen that exact set later. It is separate from a `.proj` project: a workspace can span any mix of Block/Expert `.json` project files, standalone `.asm` files, and Ultimate Basic `.ub`/`.proj` sources across multiple tabs.

- Workspaces **auto-save** a few hundred milliseconds after you make a change once one has been saved or opened.
- The app **auto-restores your last workspace** on launch, so your open tabs pick up where you left off.
- Only tabs backed by a real file on disk are saved into the workspace; a tab holding an unsaved sample or an in-memory-only program has nothing to persist and is skipped (with a notice if none of the open tabs qualify).
- Opening a workspace closes all currently open tabs first — you are asked to confirm before it proceeds.
- If a workspace references a file that has since been moved or deleted, that entry is skipped and reported by name after loading.
- The open Expert and Ultimate Basic **projects** are stored too: the project tree (including unsaved additions and removals), the startup file and the `.proj` save target come back with the workspace. Workspaces saved by older versions open without them.

### Memory window and zero page usage

The **Full C64 memory** panel can float: the **undock** button in its header moves it into a separate, non-modal window that you can drag and resize while you keep editing (the overlap badge goes with it). **Dock** (or × / Esc) puts it back. The window remembers whether it was detached and its size.

When the program touches the zero page, a **Zero page usage** section appears at the top of the memory map: a 16 × 16 grid of `$00–$FF`, coloured by area — CPU port (`$00–$01`), free (`$02`, `$FB–$FE`), BASIC (`$03–$8F`, `$FF`) and KERNAL (`$90–$FA`). Used cells are filled; a frame marks a **write**, a hatch a **pointer** (`(zp),Y` / `(zp,X)`). Click a used cell to see which lines access it (click a line to jump there) and a warning when you write into the BASIC or KERNAL area.

If the program contains the SID Editor's exported player (`sid_` labels), the player's zero page (`$02–$1C`, `$2F`, `$FB–$FD`) is marked too, and every address that your own code also uses is reported as a **conflict** (red frame, warning in the header).

### Project templates

**Menu → File → New project from template…** — or the toolbar button between **Menu** and **Tutorials** — opens the template dialog:

1. Pick a section at the top: **Assembler** or **UltimateBasic** (the dialog opens on the section that matches the current editor mode).
2. Choose a template from the list; the right side shows its description and a syntax-highlighted preview with your project name filled in.
3. Enter the **project name** and the **location** (**Browse…**). The line below the form shows the exact `.proj` path that will be created.
4. Click **Create project**.

| Section | Built-in templates |
|---|---|
| **Assembler** | Empty program, Empty game (title / play / game over states, joystick, player sprite), Hires bitmap, Multicolor bitmap, Sprite multiplexer (16 sprites sorted by Y every frame, shown by a raster IRQ chain) |
| **UltimateBasic** | Empty program, Empty game (same state machine in UB), Hires bitmap (`line` / `rect` / `circle` with `color pen`), Raster IRQ (a `sub` called every frame from the raster interrupt) |

The project is created in its own folder: `<location>/<name>/<name>.proj` plus `main.asm` (Assembler) or `main.ub` (UltimateBasic, the `.proj` is marked as an Ultimate Basic project). An existing project is never overwritten — the dialog reports it instead. Open tabs are closed first (you are asked about unsaved changes), then the new project opens in Expert mode or Ultimate Basic mode with the project panel visible and the main file set as the startup file.

**Your own templates:** **My templates folder** (bottom left of the dialog) opens the user templates folder in the app config directory. Every `.asm` or `.ub` file dropped there appears in the matching section (under *My templates* unless it names a category). A template is an ordinary source file with an optional header of comment lines at the top — `;` in assembler, `#` in Ultimate Basic:

```asm
; @name Raster bars
; @name.hu Raszter csíkok
; @category Effects
; @desc Two raster bars in the border.
; @order 50
```

`@name`, `@category` and `@desc` may have per-language variants (`@name.hu`, `@desc.de`, …); `@order` sorts the list. Everything after the header becomes the new main file, and `{{PROJECT}}` is replaced with the project name (use it in a comment so the template itself still compiles).

### Tutorials and the Lesson Editor

The **Tutorials** window lists tours and lessons by folder. The **Lesson editor…** button at the bottom of the list (and **Edit lesson** on your own lessons) opens the **Lesson Editor**, which makes a step-by-step lesson like "Build: Your First Text Program" from your own code:

1. Write the program in the Block or Expert editor.
2. In the Lesson Editor press **Steps from the current program**. Every line becomes the student's steps: pick the mnemonic (a wrong one is preselected), type the operand, press **Add**. Where the palette cannot set everything (a TEXT position, for example), a **Set the parameters** step points at the new block and moves on when it matches.
3. Give the lesson a title, description, difficulty and **folder** (any Tutorials category). Add **text steps** for explanations, optionally pointing at a part of the window (palette, program panel, ASM view, Run button, memory map). Leave a step's title or explanation empty for the generated text.
4. **Try the lesson** (it clears the current program), then **Save lesson** (Ctrl+S).

Texts are saved in the current UI language; a student using another language sees them, or the generated text where you wrote none. **Fill in macro parameters automatically** skips the parameter steps for the student. **Files ▾** creates, deletes, exports and imports lessons as `.vatut` files, and opens the lessons folder.

#### Online lessons

**Online lessons…** in the Tutorials window lists the lessons published on www.c64va.pro with their folder, difficulty and number of steps. **Download** puts a lesson into its folder in the Tutorials list; **Update** appears when the site has a newer version (the Lesson Editor raises a lesson's revision on every save). To share your own lesson, use **Files ▾ → Upload to c64va.pro…** in the Lesson Editor: give your name (shown as the author) and optionally an email and a note. The lesson is reviewed first; once approved it appears in everyone's Online lessons list. Your email is never published.

### Build project

**Menu → Build → Build project** compiles a whole project in one step. The files of the open `.proj` project are built — or, without a project, the open file tabs:

- every buildable source (`.asm`, block `.json`, `.ub`) is compiled to a `.prg` **next to its source** with the same name; with **Run with Exomizer** enabled the output is crunched;
- debugger sidecar files (symbols / source map) are written alongside the PRG where available;
- modules that another file pulls in with `.include` / `include` (and `.inc` files) are skipped, as are tabs that were never saved;
- a report lists every file with its size, *skipped* reason or compiler error, and the status bar shows *N / M files built*.

### Example programs

**Menu → Examples…** opens the example browser: the built-in example programs grouped by topic (Basics, Macros & control flow, Graphics, Sprites & input, Files & loading, Music, IRQ & hardware) in two columns.

- Type into the search box to filter by name or category; the footer shows how many examples match.
- Click an example to select it, **↑ / ↓** move the selection; **double-click**, **Enter** or **Load** loads it.
- The dialog opens on the example you loaded last.

### Load .asm file (quick reference)

The Expert-mode `.asm` loader accepts common 6502 source patterns and converts them into blocks:

- `* = $1500` → ORG block
- `Label:` → LABEL block
- `Label: .byte 0` → LABEL + BYTE blocks
- `.byte ...` → BYTE block
- `; comment` (or inline `; ...`) → COMMENT block
- instructions (`lda`, `jsr`, `beq`, etc.) → instruction blocks with detected addressing mode

#### Import parsing notes and best practices

- Local labels like `.wait` are imported as standard labels (dot removed), and references are normalized accordingly.
- For `($zp),Y` / `($zp,X)` style addressing, use a concrete zero-page byte (`$FB`, `$FC`, etc.) for best compatibility.
- Avoid ambiguous short labels that look like hex (`cc1`, `dead`, `beef`) in branch contexts; prefer names like `loop_cc1`.
- If your program starts with data (`.byte`) before executable code, add an explicit entry jump (for example `JMP Start`) at the top.

### Kick import (Kick Assembler)

The **Kick import** button on the Program menu ingests raw Kick Assembler source into a new block-mode tab. It is separate from the Expert-mode `Load .asm file` above — its custom tooltip flags that **only Kick Assembler code is supported** (other assemblers may parse partially but are not guaranteed to round-trip).

Supported patterns:

- `.pc = $XXXX` origin directive → ORG block
- `.const NAME = value`, `.label NAME = value` → CONST equate
- `.macro NAME(p1, p2, ...) { ... }` with `{`/`}` brace body or `.endm` → user macro definition
- Macro invocation `NAME(args)`, Kick colon prefix `:NAME(args)`, and `.invoke NAME(args)` — all round-trip via the Kick colon form
- `@local` labels (`@loop:`, `BEQ @loop`) preserve the `@` prefix as-is
- Operand `label + N` / `label - N` (e.g. `STA mod1+2`, `LDA xp+1`)
- Line comments `// ...` and `;` — both accepted, `/* ... */` blocks are treated as a single comment line
- `.text "…"` without screen coordinates → BYTE block with the encoded bytes (the original line is kept as the block's comment). Several items are allowed: `"…"`, `@"…"` with the escapes `\n` `\r` `\t` `\$NN`, and `$NN` / decimal bytes, joined with `,` or `+`
- `.encoding "name"` sets the encoding of the following `.text` lines: `screencode_mixed` (the Kick default), `screencode_upper`, `petscii_mixed`, `petscii_upper`, `ascii`. A character the encoding has no code for is reported on the block
- `.label NAME = *`, `.label NAME = * + N`, `.label NAME = * - N` → a label at the program counter, shifted by N (for example a jump into the operand of a `BIT`: `.label loc_c474 = * + 1`)
- Mnemonic suffixes `.abs` / `.a` and `.zp` / `.z` (`sta.abs $00fc,x`, `ldx.zp ptr,y`) force absolute or zero-page addressing
- `*=$XXXX "name"` and `.pc = $XXXX "name"` segments in any order: a segment lower than the first one stays at its address
- BASIC autostart passthrough: when the program starts at `$0801` with the standard `SYS 2061` byte stub (`.byte $0B,$08,$0A,$00,$9E,$32,$30,$36,$31,$00,$00,$00`), the compiler emits the PRG verbatim instead of wrapping a second BASIC SYS around it

Disassemblies made by Restore64 (KickAssembler syntax) import and build byte for byte like KickAssembler. The entry point named in their header is the first `.pc`. A program for the Plus/4 / C16 (BASIC at `$1001`, TED registers at `$FFxx`) builds the same way, but it runs only in a Plus/4 emulator such as VICE `xplus4`, not with Run.

Known limitation:

- Constants that resolve to a zero-page address (for example `.const BYTEADDR = $FC` used as `STA BYTEADDR`) currently compile to absolute-mode instructions (3 bytes) instead of zero-page (2 bytes). The compiled code still writes to the correct memory location, just with a small size and cycle overhead compared to the same source built by Kick Assembler.

## UltimateBasic Mode

Visual Assembler includes a complete **Ultimate Basic IDE**. Ultimate Basic is a modern compiled BASIC language for creating C64 programs, games, and demos without writing every operation in low-level 6502 assembly. The compiler runs locally and generates native C64 PRG output.

### Opening the UB editor

Select the **UB** icon in the main toolbar to switch to Ultimate Basic mode. The selected editor mode is remembered across application restarts. A new source begins with:

```basic
color bg 0
color border 0

print "HELLO FROM ULTIMATE BASIC"
```

The UB mode works with `.ub` source files. **New**, **Open**, **Save**, and **Save As** operate on the active UB tab. Opening a `.ub` file activates the matching editor tab automatically.

The toolbar shows the current UB working folder. This folder is stored separately from the Block/Expert working folder. While UB mode is active, **File → Set working folder** selects the UB folder; its tooltip identifies the active scope. UB Open/Save dialogs start there, and unsaved sources use it as the base for relative `include` and `incbin` paths.

### Editor tools

The UB toolbar follows the same visual language and custom tooltips as Expert mode. It provides:

- syntax highlighting based on the current Ultimate Basic language reference;
- line numbers that remain synchronized with long files;
- a minimap and editor zoom controls (`Ctrl` + mouse wheel also zooms); click the minimap to jump or drag its viewport selection for continuous scrolling;
- Find (`Ctrl+F` / `Cmd+F`) using the Expert-style search bar;
- source formatting with structure-aware indentation;
- autocomplete for commands and built-in functions;
- a searchable **Commands** panel with syntax, description, and usage guidance — descriptions follow the current UI language (Hungarian, English, Spanish, German, Dutch), falling back to English for anything not yet translated;
- independently toggleable **Project** and **Commands** panels, displayed side by side when both are enabled;
- independently toggleable and resizable **Build Output** and **Disassembly** panels.

The Disassembly panel includes a **Copy** button that copies its complete displayed source to the clipboard. Command help follows the bundled compiler: for example, `sprite_frame id, data_address [, frame]` selects an animation image from consecutive 64-byte sprite frames.

The editor also understands the QBasic-style syntax of Ultimate Basic 1.6.3: `dim name as type`, `function … end function`, `sub … end sub`, `elseif`, `do … loop [while | until]`, `while … wend`, `select case`, `exit do` / `exit for` / `exit while` / `exit sub` / `exit function`, the string functions `left$` / `right$` / `mid$`, and comments starting with `'` as well as `#` or `rem`. Words that the compiler treats as keywords only in one position are coloured only there and stay usable as names: `as` with the BASIC type names (`byte`, `integer`, `single`, `double`), `case is`, `map view`, `wait key` and the `scroll` options (`row`, `x`, `y`, `left`, `right`, `narrow`, `wide`). **Format** indents `function`, `do … loop`, `while … wend` and `elseif` blocks and leaves one-line loops (`do while c : … : loop`) unindented, the Project panel lists `function` blocks under Functions, and the Commands panel has **DIM**, **FUNCTION**, **ELSEIF**, **DO**, **WEND**, **SELECT CASE**, **END**, **EXIT SUB**, **LEFT$**, **RIGHT$** and **MID$** entries.

The command list is intentionally height-limited so the command-detail card can fill the remaining panel height. The detail area scrolls independently for longer syntax descriptions.

### Projects, tabs, and startup files

Ultimate Basic projects use `.proj` files and can contain multiple `.ub` sources. The Project panel lists open files, marks unsaved tabs, and shows discovered labels, functions, and subroutines. Project actions let you create, open, save, and close a project or add another source file. The Version control dialog can commit, compare and restore all files of the project together — see [Project mode](#project-mode). A new project can also start from an UltimateBasic template — see [Project templates](#project-templates).

Click the star beside a project file to mark it as the **startup file**. Build, Run, D64, C64 Ultimate, and Debug commands compile that startup source even if a different tab is currently active. Without a startup selection, the active UB tab is used.

The project panel toolbar has two add buttons, and file dialogs default to the **UB working folder** (Menu → File → Set working folder, UB-specific):

- **Add file** — pick one or more files at once (any type — `.ub`, `.bin`, `.prg`, images, fonts, etc.). `.ub` sources are also opened as editor tabs; anything else is added as a reference only, for `incbin`/`loadfile` assets to travel with the project.
- **Add folder** — reference a whole folder (e.g. an `incbin` asset directory like `fonts/`) so it stays associated with the project.

Folders in the tree have a collapse/expand arrow, and **right-click a folder** to add one or more files nested under it (shown indented). Every entry has a delete (✕) button; non-`.ub` entries are reference-only and are not opened by clicking them.

The **Save project** button disables itself and shows a "Saved" state once the project has no pending changes, and re-enables automatically the moment you add, remove, or reorganize a file or folder.

### Building and diagnostics

The **Build** button opens the same centered progress experience used by the other Visual Assembler run workflows. Successful builds update Build Output, Build Info, and Disassembly. Enable **Verbose** to include compiler memory-map details, internal zero-page allocations, and generated code data.

When compilation fails:

- Build Output is made visible automatically;
- compiler errors are rendered in red;
- the centered compile dialog displays the failure;
- errors containing a source line select that line in the active UB editor.

Build Info reports load/end addresses, code and PRG sizes, Exomizer status, variables, arrays, functions/subroutines, and labels.

### Code size per line and hints

The **code size** toolbar button (flame icon) shows, after a build, how many bytes each source line compiled to — the number sits in the line-number gutter and an orange bar shows its weight against the most expensive line. The status bar adds the bytes and an estimated cycle count (straight-line, loops not counted) of the line under the cursor.

While you type, a **hints** button appears in the status bar when something looks wrong; click it for the list and click a hint to jump to the line:

- `sys $EA31` / `sys $EA81` — `sys` compiles to `JSR`, so the KERNAL's `RTI` returns to garbage; from an IRQ use `irq_exit` or `asm { JMP $EA31 }`;
- `wait key` — not a documented form, use `waitkey`;
- a `var` / `dim` / `const` that is never used;
- after a build: an `asm` block instruction on a zero page address that holds an Ultimate Basic variable or the runtime's own zero page.

### Running, D64, and Exomizer

The main split **Run** button supports Ultimate Basic in every normal destination:

| Run mode | Ultimate Basic behavior |
|---|---|
| **Run as PRG** | Compile and launch the PRG directly in VICE. |
| **Run via D64** | Compile, open the standard D64 packaging dialog, then launch the disk in VICE. |
| **Run on Ultimate** | Upload and run the PRG through the configured C64 Ultimate REST connection. |
| **Run D64 on hardware** | Package a D64 and send it to the configured C64 Ultimate. |
| **Kung Fu Flash 2** | Compile the UB startup source and upload the PRG over USB to a real C64/C128 with a Kung Fu Flash 2 cartridge. See [Kung Fu Flash 2](#kung-fu-flash-2). |

The global **Settings → Exomizer** option also applies to UB builds and normal run targets; no separate UB toolbar toggle is needed. Debugger launches deliberately use the uncompressed PRG so compiler addresses and symbols continue to match the executed program.

Enable **Settings → Program Settings → Generate UltimateBasic ASM source (.asm)** to save the compiler-generated assembly beside a PRG or D64 build using the same base filename. This is a build option, so the UB toolbar does not contain separate ASM export buttons. A `load "NAME", $address` statement also supplies the matching D64 extra file's PRG load address.

### Debugger symbols and disassembly

Builds request Ultimate Basic debug information and produce three compatible sidecars:

- `.sym` for KickAssembler-style symbols;
- `.dbg` for C64Debugger/RetroDebugger source and segment information;
- `.vs` for VICE monitor labels.

The colorized UB Disassembly panel resolves known labels and presents addresses, bytes, mnemonics, and operands. The **Debug** button launches RetroDebugger with the raw UB PRG, debug sidecars, and the compiler's labels, functions, subroutines, variables, and arrays. Debug wait and unpause settings are shared with the normal Visual Assembler debugger configuration.

### Ultimate Basic manual and source

The book icon in the UB toolbar opens the matching Ultimate Basic `MANUAL.pdf` offline; the manual button in the startup welcome dialog opens the same manual. Visual Assembler takes both the compiler and PDF from the pinned upstream Git/Cargo dependency, so the IDE does not maintain a second copy of the Ultimate Basic implementation. The About dialog and splash screen display the actual dependency version.

Ultimate Basic is also available as a standalone open-source project:

<https://github.com/zstarczali/UltimateBasic>

The compiler is bundled into Visual Assembler, so no separate `ub` executable is required at runtime.

## 6. Expert Mode

Expert Mode is a full-featured direct-text 6502 assembly editor that lives alongside the block editor. Every tab can be in either Block mode or Expert mode — you switch between them freely at any time using the **Block / Expert** toggle in the top bar.

### Switching modes

- **Block → Expert:** the current program is serialised to text (one instruction per line, labels, macros as directives). Edits in Expert mode are synced back to the block array whenever you switch back or trigger an action.
- **Expert → Block:** the text is parsed with `parseAsmText()` and the result replaces the block program. A compile-error dialog is shown if parsing fails.
- **Blank lines** are preserved through round-trips: empty lines in the Expert editor appear as thin dashed spacers in Block mode and are restored as empty lines when switching back to Expert.

### Editor layout

```
┌──────────────────────────────────────────────────────┐
│ [toolbar]  Block │ Expert < tab toggle               │
├────────────┬────────────────────────────┬────────────┤
│  Palette   │   ASM text editor          │  Disasm    │
│  (opt.)    │   (monospace, editable)    │  panel     │
│            │                            │  (opt.)    │
└────────────┴────────────────────────────┴────────────┘
```

| Panel | Toggle | Description |
|-------|--------|-------------|
| **Palette** | `#expert-palette-btn` | The left block palette — drag blocks into the editor or click to insert at cursor |
| **ASM editor** | always visible | Full monospace textarea with live syntax highlight overlay |
| **Disasm panel** | `#expert-disasm-btn` | Pure 6502 disassembly: each instruction shows address, hex bytes, and numeric operands; macros fully expanded |

### Toolbar buttons

| Button | ID | Function |
|--------|----|----------|
| **Format** | `#expert-format-btn` | Auto-format source (labels to col 0, 4-space indent, 1-space mnemonic/operand) |
| **Load .asm** | `#expert-load-asm-btn` | Open a `.asm` file — the content is loaded into a **new tab** with the filename as the tab label. Each loaded file becomes an independent tab with its own program blocks and editor state. |
| **Save .asm** | `#expert-save-asm-btn` | Save editor content to a `.asm` file (file dialog on first save) |
| **Build Info** | `#expert-build-info-btn` | Open the Build Info dialog (origin, size, labels, errors) |
| **HL** | `#expert-hl-btn` | Toggle syntax highlighting (disable for very large files) |
| **Autocomplete** | `#expert-autocomplete-btn` | Toggle expert autocomplete suggestions on/off. When disabled, no directive, mnemonic, or label popup appears in the expert editor. |
| **Region selection** | `#expert-region-selection-btn` | Toggle the automatic region highlight in Expert mode. The fold state stays stored, but when this is off the editor keeps the full source visible and does not auto-select the current region. |
| **Collapse / expand all regions** | `#expert-region-fold-all-btn` | Fold or unfold every `.region` block in one click. If any region is currently open, the button collapses them all; if every region is already collapsed, the next click expands them all. The button lights up when all regions are collapsed. |
| **Line numbers** | `#expert-line-numbers-btn` | Toggle the line number gutter on the left side of the editor. The gutter stays in sync with the scroll position and updates live as you type. |
| **Find** | `#expert-find-btn` | Open the floating Find bar (`Ctrl+F`). Type to search; matches are highlighted in the overlay. `Enter` / `Shift+Enter` navigate between matches. `Escape` closes the bar. |
| **Zoom out / in** | `#expert-zoom-out-btn` / `#expert-zoom-in-btn` | Decrease / increase the editor font size (8–28 px). `Ctrl` + mouse wheel (`Cmd` + wheel on macOS, or a touchpad pinch) over the editor does the same. The setting is persisted. |
| **Palette** | `#expert-palette-btn` | Show/hide the left mnemonic palette |
| **Disasm** | `#expert-disasm-btn` | Show/hide the disassembly panel (pure 6502, macros expanded) |
| **Monitor** | `#expert-monitor-btn` | Show/hide the monitor hex-dump panel |
| **Minimap** | `#expert-minimap-btn` | Show/hide the code minimap strip on the right side of the editor |

Editor shortcuts: `Ctrl+/` (`Cmd+/` on macOS) comments the current line or every selected line; adding `Shift` removes the leading comment marker from those lines.
Inline comments (for example `LDA $12 ; explanation`) remain on the instruction line when switching between Expert and Block mode. Block mode shows them as a green italic `; comment` marker in the block header; hovering the marker reveals the full text when it is truncated.

### Expert editor minimap

The Expert editor minimap is a narrow canvas strip (`88 px`) on the far right of the editor area. It renders a scaled-down representation of every source line:

| Bar colour | Token type |
|------------|-----------|
| Comment colour | Lines starting with `;` |
| Label colour | Lines with a `label:` definition |
| Directive colour | `.byte`, `.macro`, `.region`, and all other directives |
| Mnemonic colour | Everything else (instructions) |

A **semi-transparent viewport indicator** (accent-coloured rectangle) shows which part of the source is currently visible. Click anywhere on the minimap to jump to that position; drag to scroll continuously. The minimap scrolls independently to keep the viewport indicator centred. The state is persisted in UI settings (`expertMinimap` key).

### Cycle counts

The **cycle counts** toolbar button (clock icon) adds a gutter that shows the 6510 cycles of every instruction line:

| Shown | Meaning |
|---|---|
| `4` | fixed cost |
| `4+` | indexed read (`abs,X`, `abs,Y`, `(zp),Y`): +1 when the index crosses a page; a page-aligned base (`$xx00`) shows the exact value |
| `2/3` | branch: not taken / taken |
| `2/4` (red) | taken branch that crosses a page — worth knowing in timed code |

Select several lines and the status bar shows the sum: number of instructions, min–max cycles and how many PAL raster lines (63 cycles) that is. Macros and data lines are not counted. The setting is remembered.

### Optimisation hints

The Expert editor checks the assembled code for common peephole patterns. Lines with a hint get an amber stripe, and an **N hints** button appears in the status bar; click it for the list and click a hint to jump to the line. Hints never change your code:

- `JSR x` followed by `RTS` → `JMP x` (1 byte shorter, 9 cycles faster);
- `CMP #0` / `CPX #0` / `CPY #0` right after an instruction that already set N/Z for that register (note: the compare also sets C);
- the same load twice, or a load of the value just stored (`STA x` / `LDA x`);
- `LDA m` / `CLC` / `ADC #1` / `STA m` → `INC m`, and the `SEC` / `SBC #1` form → `DEC m`;
- a `JMP` or branch to the very next instruction, and `PHA` immediately followed by `PLA`.

A label between two instructions (a possible jump target) suppresses the hints that would merge them.

### Error highlighting

Lines that fail to compile are highlighted in **red** (tinted background + left accent border) in real time, 350 ms after each keystroke. The first error message is also shown in the status bar. Fix the line and the highlight disappears automatically.

### Syntax highlight

The editor uses a transparent `<div>` overlay (`expert-hl`) that mirrors the textarea content with coloured `<span>` elements. Highlight can be toggled off with the **HL** button for performance on very large programs.

| Colour | Token |
|--------|-------|
| Yellow-green | Mnemonics (`LDA`, `STA`, `JMP`, …) and long-branch pseudo-ops (`LBNE`, `LBEQ`, …) |
| Blue | Directives (`.byte`, `.word`, `.fill`, `.assert`, `*=`, …) |
| Orange | Numbers (`$FF`, `%1010`, `255`) |
| Cyan | Labels — lines ending in `:`, including local labels (`.loop:`) and self-modifying-code operand labels (`value:` in `LDA value:#$00`) |
| Teal | String literals |
| Violet | Custom macro names — the name after `.macro`, `.invoke` and `.call`, and Kick-style `:name(...)` calls |
| Aqua | Macro parameters — the parameter names in the `.macro` header and the `{param}` substitutions in the macro body |
| Dark green | Comments (`; …`) |

`REGION` / `ENDREGION` directives are highlighted like the other assembler directives. Collapsed regions keep only the region header visible in the editor until you reopen them. The new **Region selection** toolbar toggle only controls the automatic current-region highlight in Expert mode; turning it off keeps the source visible without changing the fold state.

### Source formatter

Click the **Format** button (`#expert-format-btn`) to auto-format the current source:

- Label definitions are moved to column 0.
- Instructions are indented with 4 spaces.
- Mnemonics are uppercased.
- Exactly one space between mnemonic and operand (extra whitespace is normalised).
- If the source is already formatted, a `"Already formatted"` status is shown.

### Project panel & tabs

Expert mode supports a **project panel** (`#expert-project-panel`) for multi-file `.proj` projects:

- A `.proj` file is a JSON manifest that lists source files and their metadata.
- Open a project with **Menu → File → Open project** or drag a `.proj` file onto the window.
- Each file in the project opens as a separate **tab** in the tab bar at the top of the editor.
- **Close Project** (`Menu → File → Close project` / `#menu-close-project`) closes the current project and all its file tabs at once. Prompts to save any unsaved changes before closing. The project panel resets to its empty state and `_expertProjectData` is cleared.
- Each file can be marked as the **startup file** (★ star icon). When a startup file is set, the **Run** button (PRG, D64, Ultimate) always assembles and runs that file's code — regardless of which tab is currently active. This works in both block mode and Expert mode.
- The toolbar's **Add** button picks one or more files at once (any type, not just `.json`/`.asm`) and references them in the project without opening them — use it for binary assets like `incbin` data. Its dialog defaults to the VA working folder. The adjacent **Add folder** button references a whole folder (e.g. an asset directory) the same way. Reference-only entries show a delete (✕) button but are not opened by clicking them.
- Folders in the tree have a collapse/expand arrow, and **right-click a folder** to add one or more files nested under it (shown indented).
- The **Save project** button disables itself and shows a "Saved" state once the project has no pending changes, and re-enables automatically the moment you add, remove, or reorganize a file or folder.
- The **symbols** section at the bottom of the project panel can be resized vertically with the divider between the file tree and the symbols list, so long symbol lists can take more space when needed.
- **Version control** works for the whole project: with the **Project** switch of the Version control dialog one commit records every project file, and Checkout restores them all into the tabs. See [Project mode](#project-mode).

### Tab bar

The tab bar appears above the editor when there is more than one tab open.

| Feature | Description |
|---------|-------------|
| **Dirty dot** | A small accent-coloured dot on the tab name indicates unsaved changes |
| **Scroll arrows** | Left/right scroll buttons appear when there are more tabs than fit the bar |
| **Close (×)** | Closes the tab; prompts to save if the tab is dirty |
| **File extension** | The full filename including extension (`.c64va`, `.json`) is shown |
| **Ctrl+N** | Opens a new, empty tab (not while a modal dialog is open) |
| **Right-click menu** | Right-click a tab (or empty tab-bar space) for: **New tab**, **Close tab**, **Close other tabs**, **Close tabs to the right**, **Close all tabs**. Batch-close operations prompt per dirty tab and stop if you cancel. **Close all** always keeps one empty tab. |

> **Tip:** Palette sync (`#expert-palette-sync-btn`) keeps the palette selection in sync with the mnemonic at the cursor. Disable it when you prefer not to have the palette jump around as you edit.

### ACME mode

**Settings → General → Assembler mode** selects the assembler of the Expert editor:

- **VMA mode** (default) — the built-in Visual Assembler assembler with its blocks, macros and `.` directives.
- **ACME mode** — the source is ACME 0.97 text and is built by the ACME executable set in **Settings → Files and paths → ACME** (**Choose ACME**). `ACME-0.97-reference.pdf` describes the language.

The mode is saved with a `.proj` project, so every project opens with its own assembler. ACME mode is text editing only: the Block / Expert switch is locked, and **Tutorials** are off (they build VMA programs from blocks).

What follows the ACME build:

- **Build** (the hammer button in the Expert toolbar, *Build ACME source*), **Run** (PRG, D64, C64 Ultimate, Kung Fu Flash 2), **Save PRG** and **Build D64** compile through ACME; ACME errors and warnings open in the normal compile-error dialog, with the source line.
- With the **Disassembly** or **Monitor** panel or the cycle gutter on, the source is rebuilt after a typing pause, so the panels show the real ACME bytes; the panels and the debugger symbol files (`.sym`, `.vs`, `.dbg`) use the ACME labels.
- **Cycle counts** and **optimisation hints** come from the ACME report (`-r`) of the last build.
- The **VICE Monitor** hot reload writes only the address ranges ACME really built; the live watch and the profiler use the ACME labels and source lines.
- **Export to blocks** of the SID, Hi-Res, Level, Curve and Table editors inserts ACME source at the end of the file (`!byte`, `!word`, `!fill`, `NAME = value`; VA macros are written out as instructions).

Highlighting and autocomplete know the ACME syntax: `!` pseudo opcodes, `+name` macro calls, labels without a colon, anonymous `-` / `+` labels and `;` comments. A VMA directive (`.byte`, `.macro` …) in ACME source and an ACME `!` directive in VMA source are reported as errors.

```asm
        * = $c000
start   ldx #0
-       lda text,x
        beq +
        sta $0400,x
        inx
        bne -
+       rts
text    !scr "hello acme", 0
```

---

## 7. Addressing Modes

Each 6502 instruction supports one or more addressing modes. The mode selector appears on each block.

| Mode | Label | Example | Description |
|---|---|---|---|
| **implied** | Implied | `NOP` | No operand; the instruction is self-contained |
| **immediate** | Immediate | `LDA #$FF` | Inline constant; the assembler adds `#` automatically |
| **zeroPage** | Zero page | `LDA $10` | Single byte address in page zero (0–255) |
| **zeroPageX** | Zero page,X | `LDA $10,X` | Zero page address + X register offset (result wraps in page 0) |
| **zeroPageY** | Zero page,Y | `LDX $FB,Y` | Zero page address + Y register offset |
| **absolute** | Absolute | `LDA $0400` | Full 16-bit memory address |
| **absoluteX** | Absolute,X | `LDA $0400,X` | 16-bit address + X register offset |
| **absoluteY** | Absolute,Y | `LDA $0400,Y` | 16-bit address + Y register offset |
| **relative** | Relative/Label | `BNE loop` | For branch instructions; enter a label name or target address |
| **indirectX** | Indirect,X | `LDA ($FB,X)` | Zero page indexed indirect (operand = zero page address, 1 byte) |
| **indirectY** | Indirect,Y | `LDA ($FB),Y` | Zero page indirect indexed (operand = zero page address, 1 byte) |
| **indirect** | Indirect | `JMP ($0100)` | Indirect; only usable with JMP |

### Label expressions as operands

Any operand field that accepts an address or immediate value also accepts a **constant name** (from a `CONST` block or a `LABEL`) directly. Additionally, you can use **label+offset** or **label−offset** expressions to reference an address relative to a named constant:

| Syntax | Example | Description |
|--------|---------|-------------|
| `label` | `STA screen_ram,X` | Resolves to the label/constant value |
| `label+$hex` | `STA screen_ram+$0100,X` | Label address plus a hex offset |
| `label+decimal` | `STA screen_ram+256,X` | Label address plus a decimal offset |
| `label-$hex` | `LDA table-$10` | Label address minus a hex offset |
| `#<label` | `LDA #<screen_ram` | Low byte of the label address |
| `#>label` | `LDA #>screen_ram` | High byte of the label address |
| `*` | `BNE *` | Current program counter (the instruction's own address); branches with `*` generate an infinite self-loop (offset `$FE`) |

**Example — clear two screen pages using a CONST:**
```
; .CONST screen_ram = $0400
    LDX #$00
clear:
    STA screen_ram,X
    STA screen_ram+$0100,X
    DEX
    BNE clear
```

### The `*` program counter in expressions

*(New in 2.3.9.)* `*` is no longer limited to being the whole operand — it can appear
**anywhere inside an operand expression**, and stands for the address of the instruction
it is written on. It is resolved at assembly time against that instruction's real address,
so no label is needed for short relative jumps or PC-relative data reads.

| Syntax | Example | Meaning |
|--------|---------|---------|
| `*` | `BNE *` | Branch to self (infinite loop, offset `$FE`) |
| `*-n` / `*+n` | `BNE *-5`, `BEQ *+4` | Branch relative to the current PC by *n* bytes |
| `JMP *+n` | `JMP *+20` | Absolute jump computed from the current PC |
| `#<*` / `#>*` | `LDA #<*`, `LDA #>*` | Low / high byte of the current PC |
| `#>(*+n)` | `LDA #>(*+63)` | Low / high byte of a PC-relative address |

**PC vs. multiplication.** `*` is treated as the program counter only when it sits in
*value position* — at the start of the expression, or right after an operator, `(`, `,`,
`<`, `>` or whitespace. A `*` that follows a number, `)` or an identifier is ordinary
multiplication, so `LDA table*2` and `CONST_A*4` are unchanged.

**Where it works.** Any operand that already accepts an expression: branch targets,
`JMP` / `JSR`, `LDA`/`STA`/… absolute and indexed, immediate low/high-byte operators, and
the `.assert` expression. `*` never changes an instruction's size, so it is safe in every
addressing mode.

### Local (dotted) labels

*(New in 2.3.9.)* A label whose name starts with a dot — `.loop`, `.skip`, `.done` — is a
**local label**. It belongs to the scope of the nearest preceding **global** (non-dotted)
label, and internally becomes `<global>.<name>`. Two local labels with the same short name
under different global labels do **not** collide.

```
DrawSprite:
    LDX #0
.loop:                 ; == DrawSprite.loop
    LDA SpriteData,X
    STA $2000,X
    INX
    CPX #63
    BNE .loop          ; resolves within DrawSprite
    RTS

ClearScreen:
    LDX #0
.loop:                 ; == ClearScreen.loop — no clash
    STA $0400,X
    INX
    BNE .loop
    RTS
```

- Inside a scope, reference a local label as `.name`.
- From another scope, reference it explicitly as `Global.name` (e.g. `JMP ClearScreen.loop`).
- A `.name` written before any global label stays a plain top-level `.name`.
- Local labels round-trip through Block ⇄ Expert mode unchanged; the `<global>.` prefix is
  a layout-time detail and is never stored in the block program.

### Self-modifying-code operand labels

*(New in 2.3.9.)* Prefix an instruction's operand with `label:` to place a label on the
**operand byte** rather than the opcode. The instruction assembles from whatever follows
the colon.

```
setup:
    LDA value:#$00     ; 'value' -> address of the #$00 operand byte
    ...
patch:
    LDA #new
    STA value          ; writes the operand byte directly — classic SMC
```

`value` points at `<instruction address> + 1` (the first operand byte), for every
addressing mode. This replaces the older `STA instruction+1` / `instruction: LDA #$00`
pattern. It round-trips through Block ⇄ Expert mode (the operand field keeps the
`label:` prefix).

---

## 8. Standard 6502 Instructions

### Data Movement

| Mnemonic | Description | Modes |
|---|---|---|
| `LDA` | Load Accumulator | immediate, zeroPage, absolute, absoluteX, absoluteY, indirectX, indirectY |
| `LDX` | Load X register | immediate, zeroPage, zeroPageY, absolute, absoluteY |
| `LDY` | Load Y register | immediate, zeroPage, absolute, absoluteX |
| `STA` | Store Accumulator | zeroPage, absolute, absoluteX, absoluteY, indirectX, indirectY |
| `STX` | Store X register | zeroPage, zeroPageY, absolute |
| `STY` | Store Y register | zeroPage, absolute |

### Arithmetic

| Mnemonic | Description | Notes |
|---|---|---|
| `ADC` | Add with carry | Set carry with `SEC` before use in most cases |
| `SBC` | Subtract with carry | Set carry with `SEC` before subtraction |
| `INC` | Increment memory | — |
| `DEC` | Decrement memory | — |
| `CMP` | Compare with A | Sets flags; does not modify A |
| `CPX` | Compare with X | — |
| `CPY` | Compare with Y | — |

### Logic

| Mnemonic | Description |
|---|---|
| `AND` | Logical AND with Accumulator |
| `ORA` | Logical OR with Accumulator |
| `EOR` | Exclusive OR with Accumulator |
| `BIT` | Test bits in memory against A (sets N, V, Z flags) |

### Jumps & Branches

| Mnemonic | Description |
|---|---|
| `JMP` | Unconditional jump (absolute or indirect) |
| `JSR` | Jump to subroutine (saves return address on stack) |
| `RTS` | Return from subroutine |
| `RTI` | Return from interrupt |
| `BNE` | Branch if Not Equal (Z=0) |
| `BEQ` | Branch if Equal (Z=1) |
| `BCC` | Branch if Carry Clear (C=0) |
| `BCS` | Branch if Carry Set (C=1) |
| `BMI` | Branch if Minus (N=1) |
| `BPL` | Branch if Plus (N=0) |
| `BVC` | Branch if Overflow Clear (V=0) |
| `BVS` | Branch if Overflow Set (V=1) |

#### LBNE / LBEQ / … (Long branches)

*(New in 2.3.9.)* The **Long branches** palette category holds eight pseudo-ops that behave
like conditional branches but reach **any address**, not just −128…+127. Each one assembles
to an inverted branch that skips a 3-byte `JMP` — always **5 bytes**:

```
LBEQ done      ; assembles to:   BNE *+3   ($D0 $03)
               ;                 JMP done  ($4C lo hi)
```

| Long op | Condition | Emitted as |
|---|---|---|
| `LBNE` | not equal (Z=0)      | `BEQ *+3 / JMP target` |
| `LBEQ` | equal (Z=1)          | `BNE *+3 / JMP target` |
| `LBCC` | carry clear (C=0)    | `BCS *+3 / JMP target` |
| `LBCS` | carry set (C=1)      | `BCC *+3 / JMP target` |
| `LBMI` | minus (N=1)          | `BPL *+3 / JMP target` |
| `LBPL` | plus (N=0)           | `BMI *+3 / JMP target` |
| `LBVC` | overflow clear (V=0) | `BVS *+3 / JMP target` |
| `LBVS` | overflow set (V=1)   | `BVC *+3 / JMP target` |

- Operand: a label, a `*`-expression, or a literal address — same as a normal branch target.
- Cost: 5 bytes and 1 extra cycle on the taken path vs. a short branch. There is no
  automatic promotion of a short branch — you choose `LBxx` explicitly.
- When a plain branch (`BNE`, `BEQ`, …) is out of range, the compiler error now names the
  exact overshoot and suggests the matching `LBxx`.

### Register Operations

| Mnemonic | Description |
|---|---|
| `TAX` | Transfer A → X |
| `TAY` | Transfer A → Y |
| `TXA` | Transfer X → A |
| `TYA` | Transfer Y → A |
| `TSX` | Transfer Stack pointer → X |
| `TXS` | Transfer X → Stack pointer |
| `INX` | Increment X |
| `DEX` | Decrement X |
| `INY` | Increment Y |
| `DEY` | Decrement Y |

### Shift & Rotate

| Mnemonic | Description |
|---|---|
| `ASL` | Arithmetic Shift Left |
| `LSR` | Logical Shift Right |
| `ROL` | Rotate Left through Carry |
| `ROR` | Rotate Right through Carry |

### Stack

| Mnemonic | Description |
|---|---|
| `PHA` | Push Accumulator onto stack |
| `PHP` | Push Processor status onto stack |
| `PLA` | Pull Accumulator from stack |
| `PLP` | Pull Processor status from stack |

### System / Flags

| Mnemonic | Description |
|---|---|
| `CLC` | Clear Carry flag |
| `CLD` | Clear Decimal mode |
| `CLI` | Clear Interrupt disable |
| `CLV` | Clear Overflow flag |
| `SEC` | Set Carry flag |
| `SED` | Set Decimal mode |
| `SEI` | Set Interrupt disable |
| `NOP` | No operation |
| `BRK` | Force break / software interrupt |

### Illegal / Undocumented Instructions

These are supported for advanced use. Use with care — behavior may differ between chips.

`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`, `AXS`

---

## 9. Macro Blocks — Reference

Macro blocks let you do common tasks in one step — instead of writing 10–20 instructions by hand, you drop one block and the assembler generates the code for you. Think of them as built-in subroutines.

---

### LABEL

Like a **line number in BASIC** — but with a name instead of a number. Jump targets for `JMP`, `JSR`, `BNE`, etc.

| Field | Description |
|---|---|
| Label name | Identifier used in `JMP`, `JSR`, `BNE`, etc. |

**Expert syntax:**
```
loop:
```

**Generated ASM:**
```
loop:  ; $0820
```

The current address is shown as a comment. Labels have **0 byte size**.

---

### COMMENT

Like **REM in BASIC** — a note for yourself that the assembler ignores completely.

**Expert syntax:**
```
; Your comment text here
```

**Generated ASM:**
```
; Your comment text here
```

---

### BYTE

Like **DATA in BASIC** — stores a list of raw byte values inline in the program.

| Field | Description |
|---|---|
| Operand | Comma-separated byte values (e.g. `$01, $02, $FF` or `1, 2, 255`) |

**Expert syntax:**
```
.byte $01, $02, $FF
```

**Generated ASM:**
```
    .byte $01, $02, $FF
```

**Lo/hi byte label references:** BYTE accepts KickAssembler / ca65 style `<label` (low byte) and `>label` (high byte) tokens alongside numeric values. The assembler resolves the label address at compile time and inserts the appropriate byte. Example:

```
    .byte <frame_0, >frame_0, <frame_1, >frame_1
```

This stores the low byte of `frame_0`'s address, then the high byte, then the same for `frame_1`. Useful for building jump tables and address lists.

**Size:** Number of bytes in the list.

---

### WORD

Like **DATA in BASIC but for 16-bit numbers**. Each value is stored as two bytes (low byte first, then high byte — 6502 little-endian order).

| Field | Description |
|---|---|
| Operand | Comma-separated 16-bit values (e.g. `$0400, $C000`) |

**Expert syntax:**
```
.word $0400, $C000
```

**Generated ASM:**
```
    .word $0400, $C000
```

**Size:** 2 bytes per word.

---

### FILL

Like `FOR I=1 TO N : POKE addr+I, val : NEXT` — fills a block of memory with the same byte, but in a single block. Great for clearing areas or pre-filling tables.

| Field | Description |
|---|---|
| Operand | `count,value` — e.g. `256,0` fills 256 bytes with zero |

**Expert syntax:**
```
.fill 256, $00
```

**Generated ASM:**
```
    .fill 256, $00
```

**Expression syntax:** Both `count` and `value` accept arithmetic expressions. You can reference CONST names, use hex/binary literals, and call built-in math functions:

| Expression | Meaning |
|---|---|
| `TILE_COUNT, $00` | count from a CONST, value hex literal |
| `40*25, 0` | inline multiplication |
| `round(sin(PI/4)*255), $80` | trigonometry |

**Built-in functions:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`, `abs()`, constant `PI`

Operators: `+  -  *  /`  Literals: `$FF` (hex), `%10110000` (binary)  Low/high byte: `lo(expr)`, `hi(expr)`

**Size:** The count value in bytes.

---

### ALIGN

Slides the current address forward to the next clean boundary by inserting zero-padding bytes. The C64 requires sprite data to start on a 64-byte boundary — `ALIGN 64` handles that automatically.

| Field | Description |
|---|---|
| Boundary | Alignment value — e.g. `64` (sprite boundary), `256` (page), `$2000` (bitmap) |

**Expert syntax:**
```
.align 64
.align $2000
```

**Generated ASM:**
```
    ; ALIGN 64 → $0840 (12 bytes padding)
```

**Size:** Dynamic — depends on the current program counter position.

> **Tip:** Use `ALIGN 64` before sprite data, `ALIGN 256` to ensure page-aligned tables.

---

### TEXT

Like **PRINT AT** — writes text directly to the C64 screen at a given column and row, without using the KERNAL. It generates one LDA/STA pair per character, targeting screen RAM at `$0400`.

| Field | Description |
|---|---|
| Text | The string to display |
| X | Column (0–39) |
| Y | Row (0–24) |
| Label (optional) | Assigns a label pointing to the computed screen address |
| Lowercase charset | Checkbox — see below |

**Charset modes:**

The C64 has two character sets selectable at runtime:

| Mode | $D018 bit 1 | Uppercase input | Lowercase input |
|---|---|---|---|
| **Uppercase/graphics** (default) | 0 | `A`–`Z` → screen codes $01–$1A ✓ | treated as uppercase too |
| **Lowercase/uppercase** (after CHARSET lower) | 1 | `A`–`Z` → $01–$1A (uppercase) | `a`–`z` → $41–$5A (lowercase) ✓ |

- **Uppercase charset (default, checkbox unchecked):** Type what you want to see in uppercase. `"HELLO"` displays as `HELLO`. Lowercase input is mapped to uppercase screen codes.
- **Lowercase charset (checkbox checked):** Type the exact case you want to see. `"hello"` → lowercase display, `"HELLO"` → uppercase display. Requires a runtime charset switch before the screen is written (use the **CHARSET lower** macro).

**Generated ASM (uppercase mode, `"HELLO"`):**
```
    LDA #$08      ; 'H' screen code $08
    STA $0400
    LDA #$05      ; 'E' screen code $05
    STA $0401
    ...
```

**Expert syntax:**
```
.text 0, 2, "HELLO"           ; uppercase charset (default)
.text 0, 2, "hello", lower    ; lowercase charset
```

Characters are encoded as **screen codes** (not PETSCII). **Size:** `text.length × 5` bytes (LDA + STA per character).

---

### STRING

Like **POKEing a string** into any memory address at runtime. Generates LDA/STA pairs that copy each character's screen code to consecutive addresses.

| Field | Description |
|---|---|
| Text | The string to write |
| Address | Target memory address — `$C000` hex or a **label name** |
| Label (optional) | Assigns a label pointing to the target address |
| Shift | Hex value (00–FF) added to each screen code byte (e.g. `$80` = reverse video) |
| Lowercase charset | Checkbox — same semantics as TEXT (see TEXT section) |

**Expert syntax:**
```
.string $C000, "HELLO"                  ; uppercase charset (default)
.string $C000, "hello", lower           ; lowercase charset
.string $C000, "HELLO", 80             ; with shift (reverse video)
.string $C000, "hello", 80, lower      ; shift + lowercase
.string $C000, "HELLO" :my_string      ; with macroLabel
```

**Generated ASM:**
```
    LDA #$08      ; 'H' screen code
    STA $C000
    LDA #$05      ; 'E' screen code
    STA $C001
    ...
```

Characters are encoded as **screen codes** (not PETSCII). The optional **Shift** value is added to every byte, e.g. `$80` for reverse video. **Size:** `text.length × 5` bytes (one LDA + one STA per character).

---

### DATA

Like a **POKE loop** — writes a list of raw bytes to a memory address at runtime, one LDA/STA pair per byte.

| Field | Description |
|---|---|
| Bytes | Comma-separated byte values |
| Address | Target memory address — `$C000` hex or a **label name** |
| Label (optional) | Assigns a label pointing to the target address |

**Expert syntax:**
```
.data $C000, $01, $02, $03          ; hex address
.data my_buf, $01, $02, $03         ; label address
.data $C000, $01, $02, $03 :mydata  ; with macroLabel
```

**Generated ASM:**
```
    LDA #$01
    STA $C000
    LDA #$02
    STA $C001
    ...
```

**Size:** `byte_count × 5` bytes (one LDA + one STA per byte).

---

### RAWBYTES

Like **DATA that loads directly into memory** — no runtime code at all. The bytes are present from the moment the PRG loads, before your code even starts. Use this for sprite data, level maps, lookup tables, anything that just needs to be at a specific address.

| Field | Description |
|---|---|
| Bytes | Comma-separated byte values |
| Address | Target memory address — `$C000` hex or a **label name** |
| Label (optional) | Assigns a label pointing to the target address |

**Expert syntax:**
```
.rawbytes $C000, $00, $00, $00      ; hex address
.rawbytes sprite_data, $00, $00     ; label address
.rawbytes $0C50, $00, $00 :nev      ; with macroLabel — other code can use LDA nev,X
```

**Size in code:** 0 bytes. The data is placed at the given address in the output.

> **DATA vs RAWBYTES:** DATA generates LDA/STA code that copies bytes at runtime (slower, but works if the data needs to be dynamic). RAWBYTES just places the bytes directly — no code, instant, zero cost.

---

### RAWTEXT

Like RAWBYTES but for text — encodes the string as screen codes and places the bytes at a fixed address with **no runtime code**. The text is ready in memory the instant the PRG loads.

| Field | Description |
|---|---|
| Text | String to encode |
| Address | Target memory address — `$C000` hex or a **label name** |
| Label (optional) | Assigns a label pointing to the target address |
| Shift | Hex value (00–FF) added to each screen code byte (e.g. `$80` = reverse video) |
| Lowercase charset | Checkbox — same semantics as TEXT (see TEXT section) |

**Expert syntax:**
```
.rawtext $C000, "HELLO"                 ; uppercase charset (default)
.rawtext $C000, "hello", lower          ; lowercase charset
.rawtext $C000, "HELLO", 80            ; with shift (reverse video)
.rawtext $C000, "hello", 80, lower     ; shift + lowercase
.rawtext $0400, "HELLO" :my_text       ; with macroLabel
```

**Generated ASM:**
```
; .rawtext "HELLO" -> $C000
; $C000
    .byte $08, $05, $0C, $0C, $0F   ; H E L L O (uppercase screen codes)

; .rawtext "hello", lower -> $C000
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; h e l l o (lowercase screen codes $41–$5A range)
```

**Size in code:** 0 bytes. The data is placed at the given address in the output.

> **STRING vs RAWTEXT:** STRING generates LDA/STA code that copies the text at runtime. RAWTEXT bakes the bytes into the PRG at load time — no code, no waiting.

---

### PETSCII

Like **RAWBYTES but for KERNAL output** — encodes the string as PETSCII bytes (compatible with CHROUT at `$FFD2`) and places them at a fixed address with no runtime code. Use this when you want to print characters via `JSR $FFD2` in a loop, and note that the new `PRINT` macro uses the same encoder and lowercase checkbox behavior.

> **PETSCII vs screen codes:** PETSCII and screen codes are two different encodings. Screen code `$01` = letter A; PETSCII `$41` = letter A (via CHROUT). Use PETSCII only when printing through the KERNAL; use TEXT/STRING/RAWTEXT for writing directly to screen RAM.

| Field | Description |
|---|---|
| Text | String to encode as PETSCII bytes |
| Address | Target memory address — `$C000` hex or a **label name** |
| Label (optional) | Assigns a label pointing to the target address |
| Lowercase PETSCII | Checkbox — see below |

**Charset modes:**

| Mode | Uppercase input (`A`–`Z`) | Lowercase input (`a`–`z`) |
|---|---|---|
| **Uppercase (default, unchecked)** | `$41`–`$5A` (PETSCII uppercase via CHROUT) | also mapped to `$41`–`$5A` |
| **Lowercase (checked)** | Alphabetic letters are remapped so the visible case stays consistent on the lowercase/uppercase charset | Same rule |

**Expert syntax:**
```
.petscii $C000, "HELLO"              ; uppercase PETSCII (default)
.petscii $C000, "hello", lower       ; lowercase PETSCII ($61–$7A)
.petscii $C000, "HELLO", null        ; with null terminator
.petscii $C000, "hello", lower, null ; lowercase + null terminator
.petscii $C000, "HELLO" :my_msg      ; with macroLabel
```

**Generated bytes (uppercase, `"HELLO"`):**
```
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; H E L L O (PETSCII $41–$5A range)
```

**Size in code:** 0 bytes. The data is placed at the target address as a deferred data section (like RAWBYTES).

**Null terminator:** Check the *"Append `$00` (null terminator)"* checkbox to automatically add a `$00` byte after the text. Ideal for null-terminated loops:

```
    LDX #$00
loop:
    LDA msg,X
    BEQ done        ; $00 stops the loop
    JSR $FFD2
    INX
    BNE loop
done:
    RTS
```

**Encoding rules:**

| Input | Uppercase mode | Lowercase mode |
|---|---|---|
| `A`–`Z` | `$41`–`$5A` | `$61`–`$7A` |
| `a`–`z` | `$41`–`$5A` (forced uppercase) | `$41`–`$5A` |
| Space, digits, punctuation (32–126) | as-is | as-is |
| Newline | `$0D` (RETURN) | `$0D` |
| Other | `$20` (space) | `$20` |

> **Tip:** Use PETSCII for data that will be output via CHROUT (`$FFD2`). For writing directly to screen RAM, use STRING or RAWTEXT instead.

---

### CHARSET

Switches the VIC-II character ROM between uppercase/graphics mode (C64 default) and lowercase/uppercase mode, by modifying bit 1 of `$D018` at runtime.

| Field | Description |
|---|---|
| Mode | **Lowercase** — enables the lowercase/uppercase charset; **Uppercase** — restores the default uppercase/graphics charset |

**Expert syntax:**
```
.charset lower    ; switch to lowercase charset
.charset upper    ; switch back to uppercase/graphics charset
```

**Generated ASM:**

Lowercase mode:
```
    LDA $D018
    ORA #$02      ; set bit 1 → lowercase/uppercase ROM at $1800
    STA $D018
```

Uppercase mode:
```
    LDA $D018
    AND #$FD      ; clear bit 1 → uppercase/graphics ROM at $1000
    STA $D018
```

**Size:** 8 bytes (LDA abs + ORA/AND imm + STA abs).

**Why ORA/AND instead of a direct write?** `$D018` also controls screen RAM location (bits 7–4). Toggling only bit 1 preserves the rest of the register.

**Typical workflow:**

```
    CHARSET lower             ; switch to lowercase charset
    TEXT 0, 0, "hello world"  ; [checkbox: Lowercase charset]
    ...
    CHARSET upper             ; restore default when done
```

Or in expert mode:
```
.charset lower
.text 0, 0, "hello world", lower
.charset upper
```

In Expert mode the `.charset` block now round-trips through the mode dropdown too, so the block preview and exported source stay aligned.

> **Note:** The CHARSET macro only changes the VIC character ROM pointer. It does not call `$E544` (KERNAL charset init). For most cases this is sufficient; call `JSR $E544` first only if you need the KERNAL's own print routines to respect the change.

---

### CHARDEF

Defines a single 8×8 custom character in a RAM-based character set. Emits inline runtime code that copies 8 bytes into `base + index * 8` at execution time — no need for a preceding label or `ORG`.

| Field | Description |
|---|---|
| Charset base | Base address of the RAM charset (default `$3800`). Must be aligned so the VIC-II can see it (see below). |
| Character index | Which character slot to redefine, 0–255. `65` = 'A' in the default screen code layout. |
| 8 bytes | Comma-separated bitmap rows, top-to-bottom. Each byte's bit 7 = leftmost pixel. |

**Expert syntax:**
```
.chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00
```

**Generated ASM (8 × `LDA #b` / `STA target+n`, 40 bytes total):**
```
    LDA #$18
    STA $3A08
    LDA #$3C
    STA $3A09
    LDA #$66
    STA $3A0A
    LDA #$7E
    STA $3A0B
    LDA #$66
    STA $3A0C
    LDA #$66
    STA $3A0D
    LDA #$66
    STA $3A0E
    LDA #$00
    STA $3A0F
```

**Target address:** `$3800 + 65 * 8 = $3A08`. Computed at compile time and hard-coded into the STA operands.

**Size:** 40 bytes per character (8 × 5).

**Typical workflow:**
```
    ; Point VIC-II at RAM charset at $3800
    LDA $D018
    AND #$F1
    ORA #$0E       ; bits 3-1 = %111 → charset at bank+$3800
    STA $D018

    CHARDEF $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00   ; redefine 'A'
    CHARDEF $3800, 66, $7C,$66,$66,$7C,$66,$66,$7C,$00   ; redefine 'B'
    ; ... more CHARDEF calls for each custom char
```

**When to use CHARDEF vs alternatives:**

| Approach | Use when |
|----------|----------|
| **CHARDEF** | You need a few custom characters (say 1–20). Runtime cost is 40 bytes each. |
| **RAWBYTES @ $3800** | You have a full custom charset (256 chars). Total 2 KB of data, no runtime copy. |
| **INCBIN "charset.bin" @ $3800** | External charset file (built by the Character Editor). Cleanest option. |
| **Charset Canvas + INCBIN** | Full 256-character bitmap painted as one 128×128 image. |

> **Alignment reminder:** VIC-II expects the charset base at a multiple of `$0800`. Valid banks: `$0000`, `$0800`, `$1000`, ... , `$3800` (within the current 16 KB VIC bank). RAM charsets typically live at `$2000`, `$2800`, `$3000` or `$3800`.

---

### BOX_HIT

Axis-aligned bounding-box (AABB) collision test between two rectangles described by 4-byte zero-page structures. Returns the result in the accumulator: **A = 1** on overlap, **A = 0** otherwise. Pure inline assembly, no subroutine call.

| Field | Description |
|---|---|
| Box1 ZP address | Zero-page base of the first box's 4-byte struct (default `$FB`). |
| Box2 ZP address | Zero-page base of the second box's 4-byte struct (default `$F7`). |

**Struct layout** (4 bytes per box, unsigned 8-bit coordinates):

| Offset | Field |
|--------|-------|
| `+0`   | Left   |
| `+1`   | Top    |
| `+2`   | Right  |
| `+3`   | Bottom |

**Expert syntax:**
```
.box_hit $FB, $F7
```

**Generated ASM (30 bytes, fully PC-relative — no subroutine, no absolute jumps):**
```
    LDA $FD        ; b1 right
    CMP $F7        ; b2 left
    BCC no         ; R1 < L2 → miss
    LDA $F9        ; b2 right
    CMP $FB        ; b1 left
    BCC no
    LDA $FE        ; b1 bottom
    CMP $F8        ; b2 top
    BCC no
    LDA $FA        ; b2 bottom
    CMP $FC        ; b1 top
    BCC no
    LDA #$01       ; hit
    BNE done       ; unconditional (A ≠ 0)
no: LDA #$00
done:
```

**Size:** 30 bytes.

**Typical workflow:**

```
    ; Player sprite box at $FB..$FE
    LDA sprite_x            ; L
    STA $FB
    LDA sprite_y            ; T
    STA $FC
    CLC
    ADC #23                 ; +23 → B (24-pixel tall sprite)
    STA $FE
    LDA $FB
    CLC
    ADC #23                 ; R
    STA $FD

    ; Enemy box at $F7..$FA (populated similarly)
    ; ...

    BOX_HIT $FB, $F7        ; test player vs enemy → A = 0 or 1

    CMP #$01
    BNE no_collision
    JSR handle_hit
no_collision:
```

**Constraints:**
- Both zero-page addresses must be `≤ $FC` (each box needs 4 consecutive bytes: `zp`, `zp+1`, `zp+2`, `zp+3`).
- Coordinates are treated as **unsigned 8-bit** (0–255). For signed sprite coordinates outside this range, normalize before storing.
- The two boxes may overlap in ZP space if desired, but usually you want 8 distinct bytes.

**Why not a subroutine?** Inline generation avoids the JSR/RTS overhead (14+ cycles) and keeps the test hot in cache for tight game loops. If you need to test many pairs, put your own `JSR box_hit_sub` around a single BOX_HIT block manually.

**Comparison with UB's `box_hit()` function:** Ultimate Basic wraps the same 6502 logic as a runtime function returning to a variable. In VA, you place BOX_HIT inline where you need the test; the result is in `A`.

---

### INCBIN

Like **BLOAD in BASIC** — picks up an external binary file (`.bin`, `.prg`, `.sid`, `.raw`) and embeds it directly into the assembled PRG at the address you specify.

| Field | Description |
|---|---|
| File | Browse to select a `.bin`, `.prg`, `.sid`, or `.raw` file |
| Address | Target load address (e.g. `$C000`) |

**Expert syntax:**
```
.incbin "music.bin", $C000
```

**Generated ASM comment:**
```
    ; INCBIN "music.bin" @ $C000 (2048 bytes)
    .byte $01, $02, ...
```

**Size in code:** 0 bytes (deferred data section). The binary is embedded at the given address.

---

### KOALA

Loads a **Koala Painter** picture (`.koa` / `.kla`, 160×200 multicolor) and shows it. The picture data is embedded at a fixed address like `INCBIN` (the file's 2-byte `$6000` load address is stripped), and the block itself compiles to an 86-byte display routine that runs where the block sits.

| Field | Description |
|---|---|
| File | Browse to select a `.koa` / `.kla` file (10003 bytes, or 10001 without load address) |
| Address | Bitmap address: `$6000` (default, Koala native, VIC bank 1, screen RAM `$4400`) or `$2000` (VIC bank 0, screen RAM `$0400`) |

The display routine copies the screen RAM part to the screen and the color RAM part to `$D800`, writes the background byte to `$D021`, selects the VIC bank in `$DD00` (keeping the other port bits) and switches on multicolor bitmap mode (`$D011 = $3B`, `$D016 = $18`, `$D018 = $18`). Other addresses are rejected: the remaining 8K slots are under the BASIC/KERNAL ROM (the copy loop would read ROM) or overlap the character-ROM shadow.

**Expert syntax:**
```
.koala "picture.koa"
.koala "picture.koa", $2000
```

**Example — show a picture and wait:**
```
* = $0801
.koala "picture.koa"
wait:
    JMP wait
```

**Size in code:** 86 bytes (display routine); the 10001 bytes of picture data go to the given address. The Hires editor's **Files → Export Koala (.koa)…** produces a compatible file.

---

### LEVEL / LEVEL_ROW

Puts a **Level Editor** project into your program and copies level rows to a screen buffer — the building blocks of a scrolling game. See `samples/level-demo.asm` for a complete joystick-scrolled level.

#### LEVEL

An INCBIN-style block that emits **0 bytes of code**. Only the **placed** screens of the Level Editor project (the `.bin` saved with **Files → Save level**) go into memory from the given address (default `$2000`), in slot order, 2000 bytes per screen (1000 screen codes + 1000 colors). Identical screens are stored once, and all empty slots share one blank screen. The pointer tables follow the screens. A level can be up to 7 × 10 screens.

**Expert syntax:**
```
.level "level.bin"
.level "level.bin", $4000
```

| Defined | Meaning |
|---|---|
| `LEVEL_SLOT_LO` / `LEVEL_SLOT_HI` | Address of the screen in each slot (row-major, `LEVEL_W` slots per row) |
| `LEVEL_ROW_SLOT` | Level character row → first slot of its screen row |
| `LEVEL_ROW_LO/HI`, `LEVEL_CROW_LO/HI` | Level character row → offset of its screen-code row / color row inside a screen |
| `LEVEL_COL_SLOT`, `LEVEL_COL_OFS` | View start column → screen column and column inside the screen |
| `LEVEL_W`, `LEVEL_H` | Level size in screens |
| `LEVEL_COLS`, `LEVEL_ROWS` | Level size in characters |
| `LEVEL_MAX_X`, `LEVEL_MAX_Y` | Largest pixel scroll position of a 40×25 view |
| `LEVEL_BG`, `LEVEL_MC1`, `LEVEL_MC2`, `LEVEL_MULTICOLOR` | Background / multicolor colors and mode of the level |
| `LEVEL_DATA`, `LEVEL_SIZE`, `LEVEL_END` | Start, size and first free address after the level data |
| `LEVEL_OBJ_X_LO/HI`, `LEVEL_OBJ_Y_LO/HI`, `LEVEL_OBJ_TYPE`, `LEVEL_OBJ_PARAM` | Object table (Level Editor object layer): position in level pixels, type and parameter byte, in scroll order — `LEVEL_OBJ_COUNT` entries (max 255) |
| `LEVEL_OBJ_T_START` … `LEVEL_OBJ_T_TRIGGER` | Object type numbers: START 0, ENEMY 1, ITEM 2, DOOR 3, EXIT 4, TRIGGER 5 |
| `LEVEL_START_X`, `LEVEL_START_Y` | Position of the first Start object (only defined when the level has one) |
| `LEVEL_ATTR`, `LEVEL_ATTR_SOLID` … `LEVEL_ATTR_COLLECT` | Character attribute table (one flag byte per screen code; only when the level has attributes) and its bits: 1, 2, 4, 8 |
| `LEVEL_BORDER`, `LEVEL_SCR_COLORS`, `LEVEL_SCR_BG/BORDER/MC1/MC2` | Level border; per-slot colour tables (row-major like `LEVEL_SLOT_*`) when a screen has its own colours (`LEVEL_SCR_COLORS` = 1) |

Typical guard: `.assert LEVEL_END <= $9200, "level data runs into the code"`.

#### LEVEL_ROW

Copies one 40-character row of the level to a buffer: the level row in **X**, starting at the level column held in the `col` variable, to the address held in the `dst` pointer (`dst` / `dst+1`, lo/hi). With the third argument `color` it copies the colors instead of the screen codes (for color RAM). A 40-character window that spans two screens is handled with a self-modifying copy loop (~14 cycles per byte). X is kept, A and Y are destroyed. Needs a `.level` block in the program.

**Expert syntax:**
```
.level_row dst_lo, view_x
.level_row dst_lo, view_x, color
```

**Size in code:** 132 bytes — use `LBEQ` / `LBNE` when a branch has to jump over it.

---

### SID

Like **BLOAD for music** — loads a `.sid` file into your PRG and automatically reads its Init and Play addresses from the header. Call Init once at startup, then call Play from your IRQ handler every frame.

| Field | Description |
|---|---|
| File | Browse to select a `.sid` file |
| Custom address (optional) | Override the SID's native load address (e.g. `$1000`). Leave empty to use the address from the SID header. |

The block displays:
- **Title / Author** from the SID header
- **Load address** — where the data is placed in memory (effective address after any override)
- **Init address** — call this with JSR to initialize the music (adjusted for relocation if a custom address is used)
- **Play address** — call this with JSR on every frame in an IRQ handler (adjusted for relocation)
- A **(relocated)** badge appears when a custom address shifts the data from its original position

**Expert syntax:**
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", $1000
```

**Generated ASM comment:**
```
    ; SID "Ikari_Warriors.sid" @ $1000  Init:$1000  Play:$1006  (4096 bytes)
```

**Size in code:** 0 bytes inline. The SID binary is placed at the specified address as a deferred chunk in the PRG.

> **Important:** Most SID files contain hardcoded internal absolute addresses. They can only be relocated if the entire binary is shifted by the same offset. If a SID has internal jumps to `$10xx`, it must remain at `$1000` — moving it to a different address will break those internal references.

> **Typical usage:** Place an ORG block before the SID block to set its address. Call Init once at startup, then call Play every frame from a raster IRQ handler.

---

### INCLUDE

Like **MERGE in BASIC** — pulls in another file and expands its blocks inline at this position. Perfect for reusable subroutine libraries. The included blocks are read-only in the current project.

Two file kinds are supported:
- **Visual Assembler project** (`.json`) — the project's blocks are inserted as-is.
- **Plain assembly source** (`.inc`, `.asm`, `.s`) — the file is read as text and parsed the same way as expert mode. Every time you compile, the file is re-read from disk (source of truth = the file), so you can edit it externally with any editor.

| Field | Description |
|---|---|
| File | Browse to select a `.json` project or a `.inc`/`.asm`/`.s` assembly source |
| Load address (optional) | If set (hex, e.g. `C000`), the included blocks are placed at that address — a synthetic `ORG` is injected before them, overriding any ORG block inside the included file. Leave empty to let the included file's own ORG blocks control placement. |

**Expert-mode syntax:**
```
.include "library.json"
.include "macros.inc", $1500
.include "sprites.asm"
```

- The **file extension is required in expert mode** — a bare name like `.include "macros"` is treated as `.include "macros.json"`.
- Path resolution: first tries next to the project file (relative), then falls back to the app's bundled `samples/` directory.

**Generated ASM (no address override):**
```
    ; .include "library.json" — 12 block(s)
    ... (expanded blocks follow)
```

**Generated ASM (with load address `C000`):**
```
    ; .include "library.json" @ $C000 — 12 block(s)
    *=$C000
    ... (expanded blocks follow)
```

> **Tip:** Use INCLUDE to build reusable subroutine libraries that you can share across projects. `.inc`/`.asm`/`.s` files are best when you want to edit the library in a plain text editor or share it with other 6502 assemblers; `.json` when the library is authored in Visual Assembler itself. Set a load address when the library has no ORG of its own, or when you want to override its default placement.

---

### TABLE

Like **DIM at a specific address** — names a lookup table and sets where it lives in memory. Place BYTE, WORD, or FILL blocks after it to define the table's contents.

| Field | Description |
|---|---|
| Name | Label identifier for the table (e.g. `color_table`) |
| Address | Fixed address where the table starts (e.g. `$C000`) |

**Expert syntax:**
```
.table color_table, $C000
```

**Generated ASM:**
```
color_table:
```

The program counter jumps to the specified address. Place BYTE/WORD/FILL blocks after TABLE to fill the content.

**Size:** 0 bytes.

---

### ORG

Sets where in memory the program (or a section of it) is placed — like choosing a start address before typing in machine code. Every program needs at least one ORG. The standard C64 BASIC-loadable start is `$0801`.

| Field | Description |
|---|---|
| Address | The new origin address (e.g. `0801` in HEX, or `2049` in DEC) |
| HEX / DEC | Toggle the address input between hexadecimal and decimal display |

**Expert syntax:**
```
* = $C000
```

**Generated ASM:**
```
* = $C000
```

**Size:** 0 bytes. The ORG block itself generates no machine code.

Each ORG block starts a new section. Blocks that follow are assembled starting at that address. When you export the PRG, all sections are merged into one file — gaps between sections are filled with zeros.

**Example — code at `$0801`, data table at `$C000`:**
```
* = $0801
    LDX #$00
loop:
    LDA $C000,X
    STA $D800,X
    INX
    BNE loop
    RTS

* = $C000
    .byte $01, $02, $03, ...
```

> **Tip:** Every program must start with an ORG block. The typical starting address for a C64 BASIC-loadable program is `$0801` (2049 decimal). When **BASIC SYS stub** is enabled, the assembler adds a short BASIC line at `$0801` and your code starts at `$080D`.

---

### LOOP / NEXT

Like **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** in BASIC — counts down from N to 1 using the X or Y register. Drop a LOOP block, put your instructions between it and NEXT, and it loops the right number of times automatically.

#### LOOP

| Field | Description |
|---|---|
| Register | `X` or `Y` — the counter register |
| Count | Loop iteration count (hex or decimal, e.g. `0A` = 10) |
| Label | Auto-generated loop label (e.g. `loop0`) |

**Expert syntax:**
```
.loop X, 10, loop0
```

**Generated ASM:**
```
    LDX #$0A
loop0:
```

**Size:** 2 bytes (LD_ opcode + immediate operand).

#### NEXT

| Field | Description |
|---|---|
| Register | Automatically matched to the LOOP register |
| Label | Automatically linked to the LOOP label |

**Expert syntax:**
```
.next loop0
```

**Generated ASM:**
```
    DEX
    BNE loop0
```

**Size:** 3 bytes (DEX + BNE + branch offset).

**Example — clear 10 screen cells:**
```
    LDX #$0A
loop0:
    LDA #$20        ; space character
    STA $0400,X
    DEX
    BNE loop0
```

---

### FOR / ENDF

Like **`FOR X=0 TO N-1 : ... : NEXT X`** in BASIC — counts *up* from 0. Ideal when you need a forward index, e.g. stepping through a string or an array.

#### FOR

| Field | Description |
|---|---|
| Register | `X` or `Y` — the counter register |
| Count | Loop limit (hex or decimal, e.g. `$12` = 18). X/Y runs from 0 up to limit-1. |
| Label | Auto-generated loop label (e.g. `for0`) |

**Expert syntax:**
```
.for X, $12, for0
```

**Generated ASM:**
```
    LDX #$00
for0:
```

**Size:** 2 bytes (LD_ opcode + `#$00`).

#### ENDF

| Field | Description |
|---|---|
| Register | Automatically matched to the FOR register |
| Label | Automatically linked to the FOR label |
| Count | Automatically copied from the paired FOR |

**Expert syntax:**
```
.endf for0
```

**Generated ASM:**
```
    INX
    CPX #$12
    BNE for0
```

**Size:** 5 bytes (IN_ + CP_ #imm + BNE offset).

**Example — print a null-terminated string:**
```
    LDX #$00
for0:
    LDA msg,X       ; msg = PETSCII string at fixed address
    BEQ done        ; null terminator → exit
    JSR $FFD2       ; CHROUT
    INX
    CPX #$12        ; 18 characters max
    BNE for0
done:
    RTS
```

> **LOOP vs FOR:** LOOP counts down (N→1) — good for delays, fills, pixel loops. FOR counts up (0→N) — good for string/array access. Both can use X or Y.

---

### PUSH / PULL

Like **saving variables before a GOSUB and restoring them after** — but uses the 6502 hardware stack. If a subroutine uses A, X, or Y, wrap it with PUSH and PULL so the calling code's registers are preserved.

#### PUSH

Pushes one or more registers onto the stack. The order is always A → X → Y (innermost first).

| Field | Description |
|---|---|
| Registers | Any combination: `A`, `X`, `Y`, `AX`, `AY`, `XY`, `AXY` |

**Expert syntax:**
```
.push AXY
```

**Generated ASM (example: `AX`):**
```
    PHA
    TXA
    PHA
```

**Size:** 1 byte for A (`PHA`), 2 bytes for X or Y (transfer + push).

#### PULL

Restores registers from the stack in **reverse order** (Y → X → A).

| Field | Description |
|---|---|
| Registers | Same as PUSH — must match the corresponding PUSH block |

**Expert syntax:**
```
.pull AXY
```

**Generated ASM (example: `AX`):**
```
    PLA
    TAX
    PLA
```

> **Rule:** PUSH and PULL must always use the **same register set**. `PUSH AX` → `PULL AX` (internally restores in reverse: X first, then A).

---

### END / RTS alias

Like **RTS with a friendlier macro name** — `.end` emits a single `RTS` byte and behaves as a short subroutine terminator in expert mode.

**Expert syntax:**
```
.end
```

**Generated ASM:**
```
    RTS
```

**Size:** 1 byte.

Use this when you want an end-of-subroutine marker that reads a little more like a macro than a raw instruction.

---

### MACRO / ENDM / INVOKE

Like **a named GOSUB with parameters** — define a reusable chunk of code once (MACRO…ENDM), then call it anywhere with INVOKE. Pass different argument values each time instead of copy-pasting blocks.

#### MACRO (definition start)

| Field | Description |
|---|---|
| Name | Identifier for the macro (e.g. `setColor`) |
| Params | Optional comma-separated parameter names (e.g. `color` or `color, count`) |

Marks the start of a macro definition. Blocks between MACRO and ENDM are the macro's body — they **don’t generate any code** where the definition sits. Use `{paramName}` as a placeholder for arguments.

**Generated ASM:**
```
; .MACRO setColor (color)
    ... (body blocks)
; .ENDM
```

**Expert mode syntax:**
```
.macro setColor color
    LDA {color}
    STA $D020
.endm
```

#### ENDM (definition end)

Closes the current macro definition. No fields.

#### INVOKE

Calls a defined macro at this position and substitutes the supplied argument values for `{paramName}` placeholders in the body.

| Field | Description |
|---|---|
| Macro name | Select from the dropdown of defined macros |
| Arguments | Comma-separated argument values matching the macro's parameter list (e.g. `#$07`) |

**Generated ASM:**
```
; .invoke setColor(#$07)
    LDA #$07
    STA $D020
```

**Expert mode syntax:**
```
; single argument:
.invoke setColor(#$07)

; multiple arguments:
.invoke drawPixel($10, $20)

; no arguments:
.invoke clearScreen

; text / string arguments (quoted):
.invoke printText("Hello, World!")

; .call alias (synonym for .invoke):
.call setColor(#$07)
```

The macro body is expanded inline with `{paramName}` replaced by the actual arguments. The space-separated form (`.invoke setColor #$07`) is also accepted.

**Argument types:**
- **Numeric**: `#$07`, `$10`, `255` — hex or decimal values
- **Text strings**: `"Hello, World!"` — quoted strings; commas inside quotes are treated as part of the text, not as argument separators
- **Mixed**: `#$07, "hello", $20` — any combination

> **Tip:** Define macros at the top (or bottom) of your program, then INVOKE them wherever needed. Macros can be invoked multiple times with different arguments.

---

### REGION / ENDREGION

Purely visual grouping — **zero bytes**, zero effect on the assembled code. Like folding a section of a BASIC program into a named block so you can collapse it and focus on something else.

| Field | Description |
|---|---|
| Region name | Free-text label for the section (e.g. `init`, `game_loop`, `sprite_setup`) |

**Expert syntax:**
```
.region init
    ; blocks...
.endregion
```

**Controls on the REGION block header (always visible):**
- **▸ / ▾ toggle** — collapses or expands the entire region. When collapsed, all blocks between REGION and ENDREGION are hidden.
- **↕ Expand all** — un-collapses every individually collapsed block inside the region and expands the region itself if needed.
- **⦵ Select in ASM** — highlights the entire region's code range in the ASM view (from `; ===[ name ]===` to `; ===[/name]===`) and scrolls to it. Switches to the ASM tab automatically if it is not currently visible.
- **⧉ Copy region** — copies the REGION block, all child blocks, and the matching ENDREGION into a clipboard. A ✓ flash confirms the copy.
- **⎘ Paste region** — inserts the copied region as a new region immediately after the current region's ENDREGION and scrolls to it. The button is dimmed until a region has been copied.

**Generated ASM:**
```
; region init
    SEI
    LDA #$00
    STA $D020
; endregion init
```

**Size:** 0 bytes for both REGION and ENDREGION.

**Example workflow:**
1. Add a `REGION` block, set region name to `init`.
2. Add your initialization instructions below it.
3. Add an `ENDREGION` block to close the section.
4. Click ▸ on the REGION to collapse the whole section into one line while working on other parts of the program.

> **Note:** Regions can be **nested** inside each other. Each ENDREGION closes the nearest open REGION. No effect on the assembled output.

---

### DEFINE / IF / ELSE / ENDIF

Like **a switch the assembler reads** — `DEFINE DEBUG` turns on a symbol, then any `IF DEBUG` block is included and its `ELSE` branch is skipped. Remove the DEFINE block and the IF block disappears from the output. No need to delete code for release builds.

#### DEFINE

| Field | Description |
|---|---|
| Symbol | One or more comma-separated identifiers to activate (e.g. `DEBUG` or `DEBUG, PAL`) |

**Expert syntax:**
```
.define DEBUG, PAL
```

**Generated ASM:**
```
; .DEFINE DEBUG
; .DEFINE DEBUG, PAL
```

A `DEFINE` block can activate multiple symbols at once (comma-separated). Place DEFINE blocks at the top of your program. Removing the block deactivates all its symbols instantly.

#### IF

| Field | Description |
|---|---|
| Condition | Identifier to test (must match a `DEFINE` symbol to be active) |

**Expert syntax:**
```
.if DEBUG
```

**Generated ASM:**
```
; .IF DEBUG
```

Blocks between `IF` and `ENDIF` (or `ELSE`) are included or skipped based on whether the condition symbol has a matching `DEFINE` in the program. Skipped blocks appear as `; [IF skipped] …` comments and generate **zero bytes**.

#### ELSE

No fields. Marks the alternative branch — assembled when the `IF` condition is *not* active.

**Expert syntax:**
```
.else
```

**Generated ASM:**
```
; .ELSE
```

#### ENDIF

No fields. Closes the conditional block.

**Expert syntax:**
```
.endif
```

**Generated ASM:**
```
; .ENDIF
```

**Size:** 0 bytes for all four blocks. Only the content *between* them counts.

**Example — debug border flash, release build skips it:**
```
; .DEFINE DEBUG

; .IF DEBUG
    LDA #$02        ; red border
    STA $D020
; .ELSE
    LDA #$00        ; black (release)
    STA $D020
; .ENDIF
```

**Example — multiple symbols in one DEFINE block:**
```
; .DEFINE DEBUG, PAL

; .IF PAL
    LDA #$xx        ; PAL timing constant
; .ELSE
    LDA #$xx        ; NTSC timing constant
; .ENDIF
```

Nested `IF` blocks are supported. If an outer block is skipped, inner blocks are skipped too.

> **Note:** This is compile-time condition handling. For runtime compare/branch sugar, see **Runtime IF / ELSE / ENDIF** below.

### .ASSERT

*(New in 2.3.9.)* A **compile-time sanity check**. `.assert` evaluates an expression while
assembling; if it is false (`0`), the build stops with a clear error that includes the
actual value. If it is true (non-zero), it emits nothing.

| Field | Description |
|---|---|
| Expression | Any assembler expression: labels, `CONST`s, `*` (program counter), arithmetic, and comparisons (`<`, `<=`, `>`, `>=`, `==`, `!=`) |
| Message | Optional text appended to the failure error |

**Expert syntax:**
```
.assert spriteData < $C000
.assert * < $A000
.assert end - start <= 256, "sprite table overflowed one page"
```

**Behaviour:**

- **Size:** 0 bytes.
- A false assertion aborts assembly:
  `` `.assert end - start <= 256` is false (value: 0). sprite table overflowed one page``
- An assertion that cannot be evaluated (undefined label, etc.) also fails, with
  *"cannot be evaluated at assembly time"*.
- Comparisons yield `1` / `0`; place `.assert` anywhere in the program flow — it is checked
  at the address it sits on, so `.assert * < $D000` tests the current output position.

**Example — guard a sprite block against a page crossing:**
```
* = $3000
sprite_data:
    .byte $00, $00, $00        ; … 63 bytes …
sprite_data_end:
    .assert sprite_data_end - sprite_data == 63, "sprite must be exactly 63 bytes"
    .assert (sprite_data % 64) == 0, "sprite must be 64-byte aligned"
```

---

### CONST

Like **a named variable that never changes** — `SCREEN = $0400`. Use the name instead of typing raw addresses everywhere, making the code easier to read and change later.

| Field | Description |
|---|---|
| Name | Identifier for the constant (e.g. `SCREEN`) |
| Value | Numeric value in the selected base (e.g. `0400` in HEX = address $0400), or a PC-relative expression (see below) |
| Format | HEX or DEC — controls how the value is entered and displayed |

**Expert syntax:**
```
.const SCREEN = $0400
.const FRAMES_1S = 60
```

**Generated ASM:**
```
; .CONST SCREEN = $0400
```

The constant name appears in the **label picker** dropdown on instruction blocks — just click it to insert.

**PC-relative expressions (`*+N` / `*-N`):**

The value field also accepts `*+N` or `*-N`, where `*` is the compile address of the CONST block itself. This is used to create a named alias for a byte inside a nearby instruction — the classic self-modifying code pattern:

```
CONST op = *+1      ; op → address of the immediate operand of the next LDA
LDA #$00            ; $00 will be patched at runtime
...
STA op              ; overwrites the #$00 byte → LDA reads the new value next time
```

The CONST emits 0 bytes; the label resolves at compile time to `current_address + 1`.

**Arithmetic expressions:**

The value field accepts general arithmetic, including references to previously defined CONST names, hex/binary literals, and built-in math functions:

```
.const SCREEN      = $0400
.const SCREEN_END  = SCREEN + 40*25   ; 1000 bytes later
.const COLOR_RAM   = $D800
.const MID_X       = 160
.const SIN_TABLE   = round(sin(PI/8) * 127)   ; pre-computed sine value
```

**Built-in functions:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`, `abs()`, constant `PI`

Operators: `+  -  *  /`  Literals: `$FF` (hex), `%10110000` (binary)  Low/high byte: `lo(expr)`, `hi(expr)`

**Size:** 0 bytes.

---

### VAR

Like **CONST, but auto-allocated** — `VAR` reserves zero-page storage for a label without you having to type the address. Use it for counters, pointers, and short-lived state that belongs in ZP.

| Field | Description |
|---|---|
| Name | Variable name / label |
| Size (optional) | Number of bytes to reserve. Omit for a single byte. |

**Expert syntax:**
```
.var counter
.var timer, 2
.var lives
```

**Practical example:**
```
.region Vars
.var counter
.var timer, 2
.endregion

LDA #$00
STA counter
```

**Generated ASM:**
```
; .var counter
```

**Size:** 1 byte by default, or `N` bytes when size is specified.

The allocator walks a configurable zero-page cursor (`$02` to `$FE`) and assigns the next free slot. If the requested region overlaps an already-used label, the compiler emits a warning.

---

### Runtime IF / ELSE / ENDIF

Like **a real branch template** — this version works at runtime, not compile time. It compares `A`, `X`, or `Y` against an immediate value and emits the correct `CMP` / `CPX` / `CPY` + branch sequence for you.

| Field | Description |
|---|---|
| Register | `A`, `X`, or `Y` |
| Operator | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Value | Immediate value in HEX or DEC format |

**Expert syntax:**
```
.if A == #$10
    LDA #$07
.else
    LDA #$0F
.endif
```

**Size:** Depends on the chosen branches and compare form.

The comparison is unsigned by default. For `<=` and `>` the macro expands to the shortest equivalent branch chain for the selected register.

---

### WHILE / ENDW

Like **a runtime loop with a test at the top** — the body runs while the condition stays true.

| Field | Description |
|---|---|
| Register | `A`, `X`, or `Y` |
| Operator | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Value | Immediate value in HEX or DEC format |

**Expert syntax:**
```
.while A != #$00
    JSR getchar
.endw
```

**Size:** Depends on the loop body and compare form.

Use `WHILE` when the loop may end before the first iteration finishes. It is the runtime counterpart of the count-based `LOOP / NEXT` helper.

---

### REPEAT / UNTIL

Like **a runtime loop with a test at the bottom** — the body always runs at least once, then the condition decides whether to stop.

| Field | Description |
|---|---|
| Register | `A`, `X`, or `Y` |
| Operator | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Value | Immediate value in HEX or DEC format |

**Expert syntax:**
```
.repeat
    JSR getchar
.until A == #$00
```

**Size:** Depends on the loop body and compare form.

Use `REPEAT / UNTIL` when you want the body to execute at least once before the exit check.

---

### MEMCPY / MEMSET

Like **small memory routines you reach for constantly** — `MEMCPY` copies a contiguous block, `MEMSET` fills a range with one byte.

| Macro | Fields |
|---|---|
| `MEMCPY` | `src`, `dst`, `size` |
| `MEMSET` | `addr`, `value`, `size` |

**Expert syntax:**
```
.memcpy src=$C000, dst=$D000, size=$0100
.memset addr=$0400, value=#$20, size=$03E8
```

**Generated ASM:** inline copy/fill loops, chosen to match the requested size.

Sizes up to 256 bytes use a short 8-bit loop. Larger sizes switch to a 16-bit counter automatically.

---

### PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY / SET_BORDER / SET_BG

#### PRINT

Like **PETSCII output without the boilerplate** — prints a string through `CHROUT` with the same uppercase/lowercase handling as the PETSCII block. The lowercase checkbox is shared with the PETSCII encoder, so the text path stays consistent.

**Expert syntax:**
```
.print "HELLO"
.print "hello", lower
```

#### PRINT_CHAR

Prints one PETSCII byte by numeric code and sends it through `CHROUT`. The value can also be a named const or label that resolves to a byte at assemble time, in both Block mode and Expert mode.

**Expert syntax:**
```
.print_char 65
.print_char $41
.print_char color
```

#### PRINT_HEX

Prints an 8-bit value as hexadecimal text through the normal KERNAL output path.

**Expert syntax:**
```
.print_hex A
```

#### CLEAR_SCREEN

Shortcut for the standard C64 clear-screen control code.

**Expert syntax:**
```
.clear_screen
```

#### WAIT_KEY

Waits until a key is pressed, so you do not have to hand-roll the `GETIN` loop every time.

**Expert syntax:**
```
.wait_key
```

#### DELAY

Waits the requested number of frames through a shared helper routine. Use this for short pauses and timing gaps when a full custom loop would be overkill. The frame count can be a raw number or a named const, and `.wait` is just an alias of `.delay`.

**Expert syntax:**
```
.delay 29
.wait 29
.delay frames=FRAMES_1S
```

In Block mode the delay field uses a compact const picker when a symbolic value is available, so you do not have to type the name manually every time.

#### SET_BORDER / SET_BG

Convenience wrappers for the VIC-II color registers. The color value can be a raw number or a named const that resolves to 0–15. Both Block mode and Expert mode accept symbolic const names here.

**Expert syntax:**
```
.set_border 6
.set_bg 0
.set_border color
.set_bg color
```

**Size:** Each helper expands to a tiny register write sequence or a short KERNAL call.

In Block mode these fields also use the const picker, so the symbolic value stays visible instead of being replaced by a raw number.

---

### IRQ_SETUP

Sets up a raster IRQ handler in one step. The macro writes the IRQ vector, enables raster IRQs, sets the line, disables the common CIA IRQ sources, and returns to normal execution with `CLI`.

| Field | Description |
|---|---|
| Handler | IRQ routine label (e.g. `my_irq`) |
| Raster | Raster line in hex or decimal (e.g. `$FA`) |

**Expert syntax:**
```
.irq_setup handler=my_irq, raster=$FA
```

**Size:** A small setup sequence; exact length depends on the selected raster line.

Use this when you want the common "SEI / install handler / enable IRQ / CLI" boilerplate without scattering it through the program.

---

### RAND

Like **a tiny built-in PRNG** — returns an 8-bit pseudo-random value from a compact zero-page seed.

| Field | Description |
|---|---|
| Seed | Optional zero-page seed byte or label (default `$FB`) |

**Expert syntax:**
```
.rand
```

**Size:** A handful of bytes, depending on the chosen implementation path.

The generator is meant for gameplay, effect variation, and quick test data. It is deliberately small rather than cryptographically fancy.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Sets up a VIC-II sprite in one block — instead of writing ~6 POKE statements in BASIC, just fill in the fields. Sets the sprite's data pointer, turns it on, optionally enables multicolor mode, and sets its colour.

| Field | Description |
|---|---|
| Sprite # | Sprite number 0–7 |
| Colour | Colour index 0–15 (C64 palette) |
| Data page | Sprite data address / 64 (e.g. `$21` if data is at `$0840`) |
| Multicolor | Toggles the sprite's multicolor bit (`$D01C`) |

**Expert syntax:**
```
.sprite_init 0, 7, $21
.sprite_init 0, 7, $21, multicolor
.sprite_init 0, 7, $21, mono
```

**Generated ASM:**
```
    LDA #$21
    STA $07F8       ; sprite pointer register ($07F8 + N)
    LDA $D015
    ORA #$01        ; set enable bit for sprite 0
    STA $D015
    LDA $D01C
    AND #$FE        ; clear multicolor bit for sprite 0
    STA $D01C
    LDA #$07
    STA $D027       ; sprite 0 colour register
```

**Size:** 26 bytes.

> **Sprite data page:** `data_address ÷ 64`. With the default BASIC SYS stub, `ALIGN 64` after `JMP main` places sprite data at `$0840` → page = `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Like **`POKE 53248, x : POKE 53249, y`** in BASIC — sets a sprite's starting position. The coordinates are baked in at assemble time, and the fields accept consts in Block mode; for animation use `INC`/`DEC` on the sprite register directly.

| Field | Description |
|---|---|
| Sprite # | Sprite number 0–7 |
| X | Horizontal position 0–319 |
| Y | Vertical position 0–255 |

**Expert syntax:**
```
.sprite_pos 0, 152, 100
```

**Generated ASM (example: sprite 0, X=152, Y=100):**
```
    LDA #$98        ; X low byte
    STA $D000       ; sprite 0 X register
    LDA $D010
    AND #$FE        ; clear X MSB for sprite 0 (X ≤ 255)
    STA $D010
    LDA #$64        ; Y = 100
    STA $D001       ; sprite 0 Y register
```

For X > 255 the macro sets the corresponding bit in `$D010` instead of clearing it.

**Size:** 18 bytes.

> **Note:** `SPRITE_POS` bakes the X/Y into the code (`LDA #$xx`). To animate a sprite at runtime use `INC $D000` / `DEC $D000` — see the `sprite-macro-demo` sample.

---

<a id="wait_raster"></a>
### WAIT_RASTER

Waits for the VIC-II electron beam to reach a specific scan line — like syncing to a TV frame. Put this at the top of your game loop to prevent sprite tearing. No JSR, no label needed.

| Field | Description |
|---|---|
| Raster line | Target raster line in hex (e.g. `FF` = line 255) |

**Expert syntax:**
```
.wait_raster $FF
```

**Generated ASM:**
```
wait:
    LDA $D012       ; current raster line
    CMP #$FF        ; target line
    BNE wait        ; loop back (-7 bytes)
```

**Size:** 7 bytes (the `BNE` offset `$F9` = −7 always points back to the `LDA`).

> **Tip:** Place `WAIT_RASTER` at the top of your game loop to synchronise with the display and prevent sprite tearing.

---

### JOYSTICK

Like reading **`PEEK($DC00)`** and then POKEing the sprite position — but in one block. Reads one CIA joystick port and adjusts a sprite's X/Y registers accordingly. Entirely inline, no JSR needed.

| Field | Description |
|---|---|
| Port | `1` = port 1 (`$DC01`) or `2` = port 2 (`$DC00`) |
| Sprite # | Sprite number 0–7 (controls which X/Y register pair is updated) |

**Expert syntax:**
```
.joystick 2, 0
```

**Generated ASM (port 2, sprite 0):**
```
    LDA $DC00       ; read CIA port 2
    LSR             ; bit 0 → carry (Up)
    BCS skip_up     ; carry set = NOT pressed
    DEC $D001       ; Y−1 (move up)
skip_up:
    LSR             ; bit 1 → carry (Down)
    BCS skip_down
    INC $D001       ; Y+1 (move down)
skip_down:
    LSR             ; bit 2 → carry (Left)
    BCS skip_left
    DEC $D000       ; X−1 (move left)
skip_left:
    LSR             ; bit 3 → carry (Right)
    BCS skip_right
    INC $D000       ; X+1 (move right)
skip_right:
```

**Joystick bit map (active-LOW — bit = 0 means pressed):**

| Bit | Direction | CIA register |
|-----|-----------|-------------|
| 0 | Up | $DC00 (port 2) / $DC01 (port 1) |
| 1 | Down | |
| 2 | Left | |
| 3 | Right | |
| 4 | Fire | (not handled by this macro) |

**Size:** 27 bytes. The `BCS` offset is always `+3` (skips the following 3-byte `DEC`/`INC abs` instruction).

**Variable mode — `.joystick port, vx, vy[, fire]`:** instead of moving a sprite, the direction is written into variables: `vx` / `vy` = `-1` / `0` / `+1` (`$FF` / `$00` / `$01`), and the optional `fire` = `1` while the button is pressed, `0` otherwise. Use it for a scrolling camera, a player with its own physics, or menus. Port `3` reads both joystick ports at once (`LDA $DC00` / `AND $DC01`), so either port works.

```
.joystick 2, vx, vy          ; 35 bytes
.joystick 3, vx, vy, fire    ; both ports + fire: 45 bytes
```

> **Typical usage:** Place inside a `gameloop` label with `WAIT_RASTER` first:
> ```
> gameloop:
>     WAIT_RASTER ($FF)
>     JOYSTICK (port=2, sprite=0)
>     JMP gameloop
> ```

---

<a id="mouse"></a>
### MOUSE

Reads a Commodore 1351 proportional mouse and moves a sprite. Entirely **inline** — no JSR or label needed. The macro selects the CIA port, waits for the SID paddle inputs to settle, then decodes the delta movement using the standard 1351 driver pattern and applies it to the sprite registers.

| Field | Description |
|---|---|
| Port | `1` = CIA `$DC00` bits `7:6` = `%01`; `2` = `%10` |
| Sprite # | Sprite number 0–7 |
| ZP byte X | Zero-page address (hex) to hold the previous POTX sample (e.g. `FD`) |
| ZP byte Y | Zero-page address (hex) to hold the previous POTY sample (e.g. `FE`) |

**Generated ASM shape (port 1, sprite 0, ZP `$FD`/`$FE`):**

```
    ; CIA port select + settle
    LDA $DC00
    AND #$3F
    ORA #$40
    STA $DC00
    LDX #$67
wait:
    DEX
    BNE wait

    ; X axis — standard 1351-style 7-bit delta decode
    LDA $D419
    TAY
    SEC
    SBC $FD
    AND #$7F
    LDX #$00
    CMP #$40
    BCS xneg
    LSR A
    BEQ xdone
    STY $FD
    CLC
    ADC $D000
    STA $D000
    TXA
    ADC #$00
    AND #$01
    BEQ xdone
    LDA $D010
    EOR #$01
    STA $D010
    JMP xdone
xneg:
    ORA #$C0
    CMP #$FF
    BEQ xdone
    SEC
    ROR
    DEX
    STY $FD
    CLC
    ADC $D000
    STA $D000
    TXA
    ADC #$00
    AND #$01
    BEQ xdone
    LDA $D010
    EOR #$01
    STA $D010
xdone:

    ; Y axis — same decode, then inverted before apply
    LDA $D41A
    TAX
    SEC
    SBC $FE
    AND #$7F
    CMP #$40
    BCS yneg
    LSR A
    BEQ ydone
    STX $FE
    EOR #$FF
    SEC
    ADC $D001
    STA $D001
    JMP ydone
yneg:
    ORA #$C0
    CMP #$FF
    BEQ ydone
    SEC
    ROR
    STX $FE
    EOR #$FF
    SEC
    ADC $D001
    STA $D001
ydone:
```

**Size:** 142 bytes.

**Expert mode syntax:**
```
.mouse port, spriteNum, zpX, zpY
; example:
.mouse 2, 0, FD, FE
```

> **Important:** Before the first call, initialise the zero-page bytes with the current POTX/POTY values to avoid a jump on the first frame:
> ```
>     ; port 1: LDA $DC00 : AND #$3F : ORA #$40 : STA $DC00
>     ; port 2: LDA $DC00 : AND #$3F : ORA #$80 : STA $DC00
>     LDA $D419 : LSR A : AND #$3F : STA $FD
>     LDA $D41A : LSR A : AND #$3F : STA $FE
> ```

> **Tip:** Poll the mouse once per frame — place `WAIT_RASTER` in the game loop before `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Like **`PEEK($D01E)`** in BASIC — checks the VIC-II hardware collision registers and tells you whether a sprite hit another sprite or the background. Entirely inline, no JSR needed.

| Field | Description |
|---|---|
| Sprite # | Sprite number 0–7 (which sprite's bit to check) |
| Collision type | `Sprite-Sprite ($D01E)` — collision with another sprite; `Sprite-Background ($D01F)` — collision with background graphics |

**Expert syntax:**
```
.sprite_col 0, sprite
.sprite_col 0, background
```

**Generated ASM (sprite 0, sprite–sprite):**
```
    LDA $D01E       ; read sprite-sprite collision register (clears it!)
    AND #$01        ; isolate bit 0 (sprite 0)
                    ; A ≠ 0 → collision occurred
```

**Size:** 5 bytes.

> **Important:** Reading `$D01E`/`$D01F` **clears the register**. Read it once per frame and act on the result immediately with `BEQ`/`BNE`.

**Typical usage:**
```
gameloop:
    WAIT_RASTER ($FF)
    JOYSTICK (port=2, sprite=0)
    SPRITE_COL (sprite=0, type=sprite-sprite)
    BEQ no_hit          ; A = 0 → no collision
    LDA #$02
    STA $D020           ; red border = hit!
    JMP gameloop
no_hit:
    LDA #$0E
    STA $D020           ; light blue border = clear
    JMP gameloop
```

> **See also:** `collision-demo` sample — green ball (sprite #0) vs. red cross (sprite #1).

---

### LOADFILE

Like **`LOAD "file",8`** in BASIC — loads a file from a D64 disk at runtime using the KERNAL LOAD routine. Use this to load data, music, or extra code from disk while your program is running.

| Field | Description |
|---|---|
| Filename | File name on the disk (max 16 chars, auto-uppercase; characters `,`, `"`, `/`, `\`, `:`, `*`, `?`, `<`, `>`, `\|` are filtered) |
| Device | Device number 8–30 (default `8`) |
| Override address (optional) | Hex load address (e.g. `C000`). If set, the file is loaded to this address (`sec=0`, ignoring the PRG header). Leave empty to use the file's own 2-byte PRG header (`sec=1`). |
| Error label (optional) | If set, a `BCS` instruction is generated after JSR LOAD. If the KERNAL returns with carry set (error), execution jumps to this label. |

**Expert syntax:**
```
.loadfile "DEMO-COLORS", 8
.loadfile "DEMO-COLORS", 8, $C000
.loadfile "DEMO-COLORS", 8, $C000, error_label
```

**Generated code structure:**
```
    JMP skip_filename      ; jump over the inline filename
    .byte "DEMO-COLORS"    ; filename bytes (PETSCII, 11 chars)
skip_filename:
    LDA #11                ; filename length
    LDX #<fname            ; pointer lo
    LDY #>fname            ; pointer hi
    JSR $FFBD              ; SETNAM
    LDA #1                 ; logical file #1
    LDX #8                 ; device 8
    LDY #0                 ; sec=0 (override addr) or #1 (file's own addr)
    JSR $FFBA              ; SETLFS
    LDA #0                 ; LOAD command (not VERIFY)
    JSR $FFD5              ; LOAD
    BCS fail               ; (only if error label set)
```

**Size:** `3 + filename_length + 9 (SETNAM) + 9 (SETLFS) + (4 if override) + 5 (LOAD) + (2 if error label)` bytes. Minimum 27 bytes.

> **Important:** The filename is stored inline in the machine code right after a `JMP skip_filename`. The file name on the disk must be uppercase PETSCII — which matches plain ASCII uppercase letters (`A`–`Z`). The macro enforces this automatically.

> **Always use an error label** for production programs — if the file isn't found, KERNAL sets the carry flag and execution falls through to whatever is next.

> **See also:** `loadfile-demo` sample — demonstrates loading `DEMO-COLORS.PRG` from a D64 with a BCS error branch and a visual error screen.

---

### EXODECRUNCH

In-program **Exomizer decompression**. Use this macro right after a `LOADFILE` that loaded an Exomizer `mem`-mode compressed stream — EXODECRUNCH unpacks it backward into the address embedded in the stream.

| Field | Description |
|---|---|
| Depacker address | Where the depacker code lives in memory (default `B000`). Must be a 16-bit hex address. |

**Expert syntax:**
```
.exodecrunch
.exodecrunch depacker=$B000
```

**Generated code (19 bytes):**
```
    LDA $AE           ; KERNAL load-end lo (set by previous LOAD)
    STA $04           ; depacker src-end pointer lo
    LDA $AF           ; KERNAL load-end hi
    STA $05           ; depacker src-end pointer hi
    LDA #$36          ; BASIC ROM off ($A000-$BFFF becomes RAM)
    STA $01
    JSR depacker      ; depacker reads back-to-front via $04/$05
    LDA #$37          ; restore default mapping (BASIC + KERNAL + I/O)
    STA $01
```

**How it works:**

1. KERNAL `LOAD` ($FFD5) updates ZP `$AE/$AF` to point one past the last loaded byte. EXODECRUNCH copies this to ZP `$04/$05`, which is the official Exomizer backward source-end convention.
2. The depacker is typically placed at `$B000` (within the BASIC ROM mapped region). The macro toggles `$01 = $36` so the CPU sees RAM there during the JSR, then restores `$01 = $37` afterward.
3. The decompression target address is **encoded into the compressed stream itself** when you compress with `exomizer mem -l <load> file,<target>` — the depacker reads it from the stream's first bytes.

**Depacker binary:** the pre-built backward depacker is `samples/exo-decrunch.bin` (477 bytes, ORG $B000). It's a Kick Assembler wrap of the official `exodecrunch.asm` with `INC $D020` added to every read for a visible border-flash effect during decompression. Place it into your program with an `INCBIN` block at the depacker address.

**Safety offset compensation:** Exomizer's default mem mode applies a 2-byte safety offset — data lands 2 bytes earlier than the requested target. The Run via D64 dialog **automatically adds 2 to the Dst field** before calling exomizer, so the visible behaviour matches the address you typed.

> **See also:** the `exo-multicolor-demo` sample — full end-to-end example: LOADFILE a compressed multicolor bitmap to $C000, EXODECRUNCH unpacks it to $2000, then copy screen → $0400 and color → $D800, and switch VIC-II to multicolor bitmap mode.

> **Integration test:** `cargo test --test exomizer_integration` (in `src-tauri/`) verifies the full compression + decompression roundtrip on a 6502 emulator with the real depacker binary. Pass criteria: 10000 bytes byte-equal to the source `multi-color.bin`.

---

### REU_CHECK

Detects whether a Commodore RAM Expansion Unit (REU) is plugged in — like checking `PEEK($D010)` to see if hardware is present. Tests by writing and reading back two patterns to REU register `$DF04`.

| Field | Description |
|---|---|
| None | No operands |

**Generated code (34 bytes):**
```
LDA #$55
STA $DF04
LDA $DF04
CMP #$55
BNE fail
LDA #$AA
STA $DF04
LDA $DF04
CMP #$AA
BNE fail
LDA #$00
CMP #$FF   ; Z=0 => REU present
BNE done
fail:
LDA #$FF
CMP #$FF   ; Z=1 => no REU
done:
```
> The macro normalizes the result so the following branch stays simple: `BNE` means REU present, `BEQ` means REU missing.

**Expert syntax:**
```
.reu_check
```

**Result in flags:**
- **Z = 0** (result ≠ 0) → REU present → use `BNE`
- **Z = 1** (result = 0) → no REU → use `BEQ`

**No configurable fields** — the macro generates the same code every time.

**Typical usage:**
```assembly
REU_CHECK
BEQ no_reu        ; skip if REU not present
; ... REU code here ...
no_reu:
```

---

### REU_STASH / REU_FETCH / REU_SWAP

DMA block transfer between C64 RAM and REU expansion memory — like a very fast POKE loop, but the CPU doesn't do any work (the REU chip copies the data while the CPU is halted). A `$1000`-byte transfer is effectively instant.

| Macro | Direction | `$DF01` command |
|-------|-----------|-----------------|
| `REU_STASH` | C64 RAM → REU | `$90` |
| `REU_FETCH` | REU → C64 RAM | `$91` |
| `REU_SWAP`  | C64 RAM ↔ REU | `$92` |

**Fields:**

| Field | Description | Example |
|-------|-------------|---------|
| C64 address | Source/dest in C64 RAM (hex) | `C000` |
| REU address | Source/dest in REU (hex, 16-bit) | `0000` |
| REU bank | REU memory bank (0–7) | `0` |
| Length | Number of bytes to transfer (hex, 16-bit) | `1000` |

**Expert syntax:**
```
.reu_stash $C000, $0000, 0, $1000
.reu_fetch $C000, $0000, 0, $1000
.reu_swap $C000, $0000, 0, $1000
```

**Generated code (40 bytes):**
```
LDA #c64lo    STA $DF02    ; C64 address LO
LDA #c64hi    STA $DF03    ; C64 address HI
LDA #reuLo    STA $DF04    ; REU address LO
LDA #reuHi    STA $DF05    ; REU address HI
LDA #bank     STA $DF06    ; REU bank
LDA #lenLo    STA $DF07    ; length LO
LDA #lenHi    STA $DF08    ; length HI
LDA #$00      STA $DF09    ; address control (fixed)
LDA #$00      STA $DF0A    ; interrupt mask (fixed)
LDA #cmd      STA $DF01    ; execute DMA ($90/$91/$92 = stash/fetch/swap, immediate)
```

> **Note:** Commands use `$90/$91/$92` (bit 4 set = immediate DMA mode). Writing to `$DF01` starts the transfer; the CPU resumes when it finishes.

---

### TURBO_SET

Sets the **Ultimate-64 (U64) CPU speed** via register `$D031`. No effect on a real C64 or other emulators.

**Fields:**

| Field | Description | Range |
|-------|-------------|-------|
| Speed | CPU speed index | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz |
| Badline | Badline emulation | Enabled (C64 compatible) / Disabled (turbo) |

The speed byte is calculated as: `(speedIndex & 0x0F) | (badline_disabled ? 0x80 : 0x00)`.

**Generated code (5 bytes):**
```
A9 xx   LDA #speed_byte
8D 31 D0   STA $D031
```

**Expert mode syntax:**
```
.turbo_set 7,0    ; speed=7 (~10 MHz), badline enabled
.turbo_set 15,1   ; speed=15 (~48 MHz), badline disabled
```

> **Note:** This macro affects U64 hardware only. On a real C64 or other emulators this writes to `$D031` which may affect the CIA or be ignored.

---

### SUPERCPU_DETECT

Checks whether a **CMD SuperCPU** accelerator is installed — like `PEEK($D0B8)` to see if it returns something other than `$FF`.

**Generated code (5 bytes):**
```
AD B8 D0   LDA $D0B8
C9 FF      CMP #$FF
```

**Result in flags:**
- **Z = 0** → SuperCPU present → use `BNE`
- **Z = 1** → SuperCPU not found → use `BEQ`

**No configurable fields.**

**Expert syntax:**
```
.supercpu_detect
```

**Typical usage:**
```assembly
SUPERCPU_DETECT
BEQ no_scpu       ; skip if SuperCPU not present
; ... SuperCPU turbo code here ...
no_scpu:
```

---

### TURBO_ENABLE

Turns **CMD SuperCPU turbo mode** on or off. Call `SUPERCPU_DETECT` first and skip this if the SuperCPU isn't present.

| Mode | Register | Effect |
|------|----------|--------|
| Enable | `$D07A` | Engage turbo (up to 20 MHz with SuperCPU) |
| Disable | `$D07B` | Return to 1 MHz compatibility mode |

**Generated code (5 bytes):**
```
A9 00         LDA #$00
8D 7A D0      STA $D07A    ; (or $D07B for disable)
```

**Expert mode syntax:**
```
.turbo_enable on
.turbo_enable off
```

> **Note:** Call `SUPERCPU_DETECT` first and branch around this macro if the SuperCPU is not present.

---

<a id="map_copy"></a>
### MAP_COPY

Copies a tilemap from a source address to screen RAM (and optionally color RAM) using a series of `LDA abs,X` / `STA abs,X` loops. One 256-byte page is copied per loop iteration; a partial page at the end uses `CPX #rem / BNE` to stop. No JSR needed — all code is generated inline.

| Field | Description |
|---|---|
| Source addr (screen) | Hex address where the map data lives after loading (e.g. `C000`) |
| Screen RAM dest | Where to copy screen codes (e.g. `0400`) |
| Size (bytes) | Total bytes to copy — typically `$03E8` = 1000 (40×25 chars) |
| Combined .bin | When checked, expects screen codes immediately followed by color data at `source + size`; copies color data to **Color RAM dest** in a second pass |
| Color RAM dest | Destination for color data — default `D800` (C64 color RAM) |

**Generated ASM (1000-byte map, screen only):**
```
    LDX #$00
    LDA $C000,X   ; page 0
    STA $0400,X
    INX
    BNE *-9       ; loops until X wraps to 0 (256 iters)
    LDA $C100,X   ; page 1
    STA $0500,X
    INX
    BNE *-9
    LDA $C200,X   ; page 2
    STA $0600,X
    INX
    BNE *-9
    LDA $C300,X   ; remainder — 232 bytes
    STA $0700,X
    INX
    CPX #$E8
    BNE *-11
```

**Size:** `2 (LDX) + fullPages×9 + (rem > 0 ? 11 : 0)` bytes per section. Combined mode doubles it (screen section + identical color section).

**Pairing with the Map Editor:**

The Map Editor's **Files → Save map + color RAM (.bin)** exports a single binary where the first `size` bytes are screen codes and the next `size` bytes are color RAM values. Use MAP_COPY with **Combined .bin** checked and point **Source addr** at where this file is loaded (e.g. via INCBIN at `$C000`):

```
* = $C000
    INCBIN "map-color.bin" @ $C000   ; screen codes $C000–$C3E7, color $C3E8–$C7CF
* = $0801
    ; ...
    MAP_COPY src=$C000 dst=$0400 size=1000 combined color_dst=$D800
```

**Expert mode syntax:**
```
.map_copy $C000, $0400, 1000               ; screen only
.map_copy $C000, $0400, 1000, auto, $D800  ; combined (color at src+size)
.map_copy $C000, $0400, 1000, $C3E8, $D800 ; explicit color source address
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Copies a 16×16 character area from a compact 256-byte screen-code block plus a matching 256-byte Color RAM block. It is intended for Charset Canvas exports and small tile/picture chunks, where writing sixteen separate MAP_COPY rows would be noisy.

**Default layout:**

| Data | Default address |
|---|---|
| 16×16 screen codes | Source address (`src`) |
| 16×16 color values | `src + 256` |
| Screen RAM destination | `$0400 + row×40 + col` |
| Color RAM destination | `$D800 + row×40 + col` |

**Expert mode syntax:**
```
.map_copy16x16 $3000, 12, 4
.map_copy16x16 $3000, 12, 4, $0400, $3100, $D800
```

The short form copies screen bytes from `$3000`, color bytes from `$3100`, and places the 16×16 block at column 12, row 4. Valid top-left positions are `col = 0..24` and `row = 0..9`, so the full 16×16 area remains on the 40×25 C64 text screen.

**Generated behavior:**

- Generates sixteen inline row copies.
- Each row copies 16 screen bytes and 16 color bytes.
- No JSR is needed; the code is emitted directly at the macro position.
- Works with normal character mode and multicolor character mode; the Color RAM bytes carry each cell's character color / multicolor enable bit.

Typical pairing with Charset Canvas:

```
* = $0801
    SEI
    LDA #$00
    STA $D021
    LDA #$05
    STA $D022
    LDA #$0D
    STA $D023
    .map_copy16x16 $3000, 12, 4
loop:
    JMP loop

.incbin "16x16+ram+color.bin", $3000
.incbin "16x16+charset.bin", $2000
```

---

<a id="sprite_anim"></a>
### SPRITE_ANIM

Advances a sprite's animation frame each call and updates the VIC-II sprite data pointer. Store one byte per frame in a table (the sprite data page number = `data_address / 64`), point SPRITE_ANIM at it, and call it once per game frame — no JSR needed.

| Field | Description |
|---|---|
| Sprite # | Sprite number 0–7 |
| Frame list address | Hex address of the frame table — one byte per frame, each byte = sprite page (`data_addr / 64`) |
| Frame count | Total number of frames (1–255) |
| Frame ZP | Zero-page byte used as the frame counter (e.g. `FB`) |

**Generated ASM (sprite 0, 4 frames, ZP `$FB`, list at `$C100`):**
```
    INC $FB         ; advance frame counter
    LDA $FB
    CMP #$04        ; frame count
    BCC *+6         ; if counter < count, skip reset
    LDA #$00
    STA $FB
    TAX             ; X = current frame index
    LDA $C100,X     ; load sprite data page for this frame
    STA $07F8       ; update sprite 0 pointer ($07F8 + sprite#)
```

**Size:** 19 bytes.

**Typical usage:**
```
frameTable:
    .byte $21, $22, $23, $24   ; 4 frames at $0840, $0880, $08C0, $0900

gameloop:
    WAIT_RASTER ($FF)
    SPRITE_ANIM (sprite=0, list=$C100, count=4, zp=$FB)
    JMP gameloop
```

**Expert mode syntax:**
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; example:
.sprite_anim 0, C100, 4, FB
```

> **Tip:** Place the frame table as a RAWBYTES block at a fixed address. The counter ZP byte (`$FB`) must be initialized to `$00` before the first call. If your code uses `$FB` for something else, pick a free ZP location.

---

<a id="score_bcd"></a>
### SCORE_BCD

Adds a fixed point value to a multi-byte BCD score stored in memory, then renders each digit to screen RAM as a screen-code character. Uses the 6502 decimal mode (`SED`/`CLD`) for carry-safe BCD arithmetic — no manual carry juggling needed.

| Field | Description |
|---|---|
| Score address | Hex address of the BCD score bytes (e.g. `C200`). Low byte first. |
| Digits | Number of BCD bytes (each byte holds two digits: `$99` = "99"). `4` bytes = up to 99999999. |
| Add points | Decimal value to add per call (e.g. `100`). |
| Screen address | Where to write the digit screen codes (e.g. `0400`). One byte per digit (high nibble first). |

**Expert syntax:**
```
.score_bcd $C200, 4, 100, $0400
```

**Generated ASM (4 bytes, +100 pts, score at `$C200`, screen at `$0400`):**
```
    SED              ; enable BCD / decimal mode
    CLC
    LDA $C200        ; byte 0 (digits 1–2)
    ADC #$00         ; low byte of 100 in BCD = $00
    STA $C200
    LDA $C201        ; byte 1 (digits 3–4)
    ADC #$01         ; mid byte of 100 in BCD = $01 (carry propagates)
    STA $C201
    LDA $C202
    ADC #$00
    STA $C202
    LDA $C203
    ADC #$00
    STA $C203
    CLD              ; back to binary mode

    ; render digits
    LDX #$00
digit_loop:
    LDA $C200,X
    PHA
    LSR : LSR : LSR : LSR  ; high nibble → low nibble
    ORA #$30         ; + '0' screen code
    STA $0406,X      ; right-justified: screen_addr + (digits*2 - 2) - X*2
    PLA
    AND #$0F         ; low nibble
    ORA #$30
    STA $0407,X
    INX
    CPX #$04
    BNE digit_loop
```

**Size:** `3 + digits×8` bytes (SED + CLC + CLD overhead + 8 bytes per BCD byte for ADC + display loop).

**Expert mode syntax:**
```
.score_bcd $C200, 4, 100, $0400
```

> **Tip:** Initialize the score bytes to `$00` at startup. The score address should be in zero page or absolute RAM — not ROM. The screen address should point to the leftmost digit cell; digits are written left-to-right (most-significant byte first).

> **BCD range:** `digits=4` bytes → 8 decimal digits → max score 99,999,999. Each byte encodes two BCD digits: `$00`–`$99`.

---

## 10. Debugger Integration

The app supports **RetroDebugger** as the external C64 debugger. It receives breakpoints, symbols, and autostart flags generated from the assembled program.

### RetroDebugger

[RetroDebugger](https://github.com/slajerek/RetroDebugger) is a cross-platform Commodore 64 debugger with breakpoint support, memory inspection, and label-aware disassembly.

**Setup:** Open **Settings → Configure RetroDebugger executable** and point it to the `RetroDebugger` binary.

**Launch:** Click **Debug (RetroDebugger)** in the toolbar. The app will:

1. Assemble the program to a `.prg` file in a temporary directory.
2. Write a **breakpoints file** (`breakpoints.txt`) — one `break $ADDR` per flagged block.
3. Write a **symbols file** (`symbols.txt`) in Vice/RetroDebugger label format (`al C:addr .name`). All LABEL and CONST blocks are included.
4. Also write C64Debugger-style sidecars next to the compiled PRG: `.dbg`, `.sym`, and `.vs`.
5. Launch RetroDebugger with:
   ```
   RetroDebugger -prg <file.prg> -breakpoints <breakpoints.txt> -symbols <symbols.txt> [flags]
   ```

### Breakpoint Blocks

Click the breakpoint icon (●) on any instruction block to toggle it as a breakpoint. Breakpointed blocks are highlighted in red. Their addresses are written to the breakpoints file on every debugger launch.

### Debugger Flags (Options Tab)

| Toggle | Flag | Effect |
|--------|------|--------|
| `-jmp` ON | `-jmp $ADDR` | Jump directly to the program start address after loading |
| `-unpause` ON | `-unpause` | Unpause the debugger immediately on load |
| `-wait` ON | `-wait <ms>` | Wait `<ms>` milliseconds before unpausing — 500 ms or 1000 ms |

> **Tip:** For most programs, enable `-jmp` and `-unpause` for instant autostart. Use `-wait 500` or `-wait 1000` when your program sets up IRQs or SID music that needs time to initialize before the first raster.

### VICE Monitor (hot reload, live watch, profiler)

The **VICE Monitor** toolbar button opens a non-modal window that talks to the running VICE through its binary monitor. **Run (VICE)** starts VICE with the monitor on port 6502 (**Settings → VICE remote monitor**, on by default). Close and restart a VICE that was started another way. The header shows the connection state; *Only available in the desktop app* appears in the browser preview.

| Button | What it does |
|---|---|
| **Hot reload** | Writes the assembled program into the running VICE's RAM (only the occupied ranges — the gaps are left alone). Use it for data: sprites, tables, text. |
| **Hot reload + restart** | Same, then restarts at the SYS address (stack reset; the final `RTS` returns to `READY.`). |
| **Auto hot reload after edits** | Reloads and restarts about a second after each edit, if the program assembles. |
| **Live watch** | Refreshes the watch list every 0.4 s; a changed value flashes. |
| **Profile** | Samples the program counter for about 5 seconds (click again to stop early). |

**Watch list:** type a label or an address — `score`, `$D020`, `53280`, or with a byte count `table, 8` — and press **+** or Enter. Each row shows the address, the bytes in hex and, for 1 or 2 bytes, the decimal value. In Ultimate Basic mode the names come from the last UB build (variables, labels, subs, arrays).

**Profiler result:** two tables. *Routine* groups the samples by the nearest label (in Ultimate Basic: by `sub`), with the share in % and the raster lines it ran on — time spent in the KERNAL or BASIC ROM is listed separately. *Line* lists the most expensive source lines; click one to jump to it. Each sample briefly pauses the emulator, so the profile is a statistical picture, not an exact cycle count.

---

## 11. Knowledge Base Links

Quick reference links available in the app under **Knowledge Base**:

| Resource | URL |
|---|---|
| 6502 Opcodes Reference | http://www.6502.org/tutorials/6502opcodes.html |
| C64 KERNAL Functions | https://sta.c64.org/cbm64krnfunc.html |
| C64 Memory Map | https://sta.c64.org/cbm64mem.html |
| C64 Color Codes | https://sta.c64.org/cbm64col.html |
| VIC-II Article | https://www.cebix.net/VIC-Article.txt |
| C64 Codebase | https://codebase.c64.org/ |
| The Turbo Assembler | https://turbo.style64.org/ |
| RetroDebugger | https://github.com/slajerek/RetroDebugger/ |
| C64 OS Development Environment | https://www.c64os.com/c64os/programmersguide/?s=devenvironment |
| png2c64 Image Converter | https://png2c64.app/ |

---

## 12. D64 Export & Run

Version 1.5.1 adds the ability to package your program (and additional data files) into a C64 D64 disk image and launch it in VICE — or export the disk image for use elsewhere.

### Split Run button

The toolbar **Run** button has been replaced by a **split button**:

| Part | Action |
|---|---|
| **▶ Run** (main) | Executes the currently selected run mode |
| **▾** (arrow) | Opens the mode selector |

**Available run modes:**

| Mode | Description |
|---|---|
| **Run as PRG** | Assemble to a temporary `.prg` and launch VICE directly. Classic behaviour. |
| **Run via D64** | Assemble, build a `.d64` disk image (using c1541), add any configured extra files, then launch VICE from the disk. Use this whenever your program loads files at runtime (e.g. with the LOADFILE macro). |
| **Run on hardware** | Assemble to PRG and send it to a **1541 Ultimate / Ultimate 64** device over the local network. See [Section 13](#13-hardware-settings). |
| **Kung Fu Flash 2** | Assemble to PRG and upload it over USB serial to a real C64/C128 with a **Kung Fu Flash 2** cartridge. See [Kung Fu Flash 2](#kung-fu-flash-2). |

The selected mode is saved between sessions.

### Export to D64 dialog

Open via the **Save PRG ▾** dropdown → **Export to D64**. The dialog lets you:

1. Set the **disk name** (max 16 chars) and **program name** — these are the names that appear in the C64 disk directory.
2. **Add extra files** — click **+** to pick any binary file (`.prg`, `.bin`, `.sid`, etc.). For each extra:
   - **Name** — how it appears in the D64 directory (max 16 chars, auto-uppercase).
   - **Addr** (load address, optional) — if provided, a 2-byte PRG header is prepended. Leave empty to write raw bytes with no header.
   - **Dst** (decompression target, only with EXO) — where the depacker should land the data on the C64. When EXO is enabled, the extra is compressed with `exomizer mem -l <Addr> file,<Dst>` before being written to the D64. The +2 safety-offset compensation is applied automatically.
   - **EXO** — checkbox that turns on backward `mem`-mode crunching for this entry. The on-disk size is typically 5-20% of the original.
3. Click **Export** to generate the `.d64` file using VICE's `c1541` tool.

**Pairing with EXODECRUNCH:** when you ship a file with EXO=on, the program reading it should LOAD it to the **Addr** address (sec=1, file's own PRG header), then call the **EXODECRUNCH** macro to unpack it backward into **Dst**. See the `exo-multicolor-demo` sample for the complete pattern.

### D64 metadata in projects

The disk name, program name, and extra file list are saved inside the project JSON (under the `d64` key). When you reload the project or a sample that includes D64 metadata, the extras are restored automatically — no need to re-add them each time.

The **loadfile-demo** sample comes pre-configured with `DEMO-COLORS.PRG` as an extra file. Select it, open **Run via D64**, and click **Run** to see the full load flow in action.

> **Requirement:** D64 export and Run via D64 both require VICE (`c1541`) to be configured in [Hardware Settings](#13-hardware-settings).

### D64 Editor (browse & edit an existing disk image)

The toolbar icon after the Curve Editor opens the **D64 Editor** — a standalone tool for working with an existing `.d64` image directly, independent of the currently open program. Unlike the Export to D64 dialog above (which always builds a *new* disk from the compiled PRG), the D64 Editor edits a disk image in place via `c1541`, so it doubles as a lightweight disk manager.

**Files ▾ menu:**

| Item | Action |
|---|---|
| **New D64…** | Pick a destination path and create a freshly formatted, empty disk image there. |
| **Open D64…** | Pick an existing `.d64` file and load its directory. |
| **Save As…** | Copy the currently open disk image to a new path and continue editing the copy. |
| **Run in VICE** | Launch the currently open disk image directly in VICE (`-drive8type 1541`). |

**Toolbar:**

| Icon | Action |
|---|---|
| **Add program** | Pick a local file and write it into the disk directory. |
| **Extract selected** | Save the selected entry's bytes to a local `.prg` file. |
| **Rename selected** | Edit the entry name inline in the table — Enter confirms, Escape cancels. |
| **Delete selected** | Remove the selected entry from the disk. |
| **Refresh** | Re-read the directory, e.g. after editing the disk from another tool. |
| **Save** | Write the working copy's edits back to the real `.d64` file, making an automatic backup first. Enabled only while there are unsaved changes. |

**Adding a program:** picking a file that already ends in `.prg` only asks for a **Name** and a disk **Type** (PRG/SEQ/USR/REL) — a `.prg` already carries its own load-address header, so it is written unchanged. Picking any other file (e.g. a raw `.bin`) additionally shows:

- **Load address** (hex, optional) — prepend a 2-byte PRG header at this address; leave empty to write the bytes raw.
- **Decompress address** (hex, optional) — only used together with Exomizer; the target address the depacker should unpack the data to.
- **Exomizer** checkbox — compress the file before writing, using the same `mem`/`sfx` crunch modes as the extra files in the Export to D64 dialog above.

The directory listing renders filenames in the same font and uppercase style as a real C64 `LOAD"$",8` listing.

**Save workflow:** every edit — add, extract, rename, delete, and Block Editor byte edits — is applied to a private working copy of the disk image, not your real file. The **Save** toolbar button (enabled once there are unsaved changes) writes the working copy back over the real `.d64`, making an automatic backup first; the header shows a **•** marker while changes are unsaved, and closing the editor or opening another disk with unsaved changes asks for confirmation instead of discarding them. **Save As…** (Files ▾ menu) writes the working copy to a new path and continues editing there.

**Block editor:** the toolbar's grid icon switches to a raw track/sector view below the directory — a clickable block map colored by the BAM's free/used bitmap (with the BAM and directory chain marked separately), a per-byte hex grid for the selected 256-byte block, and Prev/Next sector navigation. Block edits go through the same working-copy/Save workflow as the directory actions above.

> **Requirement:** like Export to D64, the D64 Editor requires VICE (`c1541`) configured in [Hardware Settings](#13-hardware-settings).

---

## 12b. CRT Export (Magic Desk 64K cartridge)

**Menu → Build → Build CRT** produces a Commodore 64 cartridge image (`.crt`, **cartridge type 19 — Magic Desk / Domark / HES Australia**) that runs on VICE, TheC64, real hardware via EasyFlash / Kung Fu Flash, and 1541 Ultimate II+ cartridge slots. It is available in both **block mode** and **Expert mode**, and — as of the current build — in **UltimateBasic mode** as well.

### What ships in the cart

- **8 × 8 KB banks** at `$8000`, bank-switched via `$DE00` (Magic Desk convention: low 3 bits = bank, bit 7 = disable cart).
- **Bank 0** contains a 128-byte header + boot loader:
  - `$8000/$8002` cold + warm start vectors point at `$8009`.
  - `$8004–$8008` = the `CBM80` signature required by the KERNAL reset code.
  - `$8009–$807F` = the loader: SEI / stack init / `JSR $FDA3` (IOINIT) / `JSR $FD50` (RAMTAS) / `JSR $FD15` (RESTOR) / `JSR $FF5B` (CINT), then a byte-copy loop that streams the payload from cart ROM into RAM and switches banks when `$FC` reaches `$A0`. At the end it copies a tiny **exit stub** to `$0100`, disables the cart with `LDA #$80 : STA $DE00`, and `JMP`s to the entry point.
- **Payload** starts at `$8080` in bank 0 and spills into banks 1–7 as needed. Maximum payload = `8 * 8192 − 128 = 65 408 bytes`.

### Load address and entry point

Build CRT never uses Exomizer (the depacker cannot run from cart ROM). It compiles the current tab with the standard autostart pipeline and takes the load address from the PRG header and the entry point from the SYS target:

- **Block / Expert mode with BASIC SYS stub on:** load = `$0801`, entry = the SYS target (typically `$080D` or the user’s origin).
- **Block / Expert mode with BASIC SYS stub off:** load = user origin (with the classic `$0801 → $C000` fallback), entry = load address.
- **UltimateBasic mode:** load and entry both come from the UB compiler map (`build.map.loadAddress`). The UB autostart stub inside the payload is then executed exactly as it would be after `LOAD "...",8,1 : RUN` from disk.

The origin address you see in the ASM output is preserved; the loader simply copies the flat memory image from the PRG into RAM and jumps to the entry point once cart ROM is unmapped.

### Size limit

Because the payload is stored linearly and `assembleProgramToPrg()` returns a flat `minAddr..maxAddr` buffer with zero-filled gaps, a program with widely spaced ORG segments (e.g. `$0801` + `$C000` + `$E000`) counts every byte in between toward the 65 408-byte budget. If you exceed the limit the build aborts with a `saveCrtTooLarge` error — either compress the memory layout or split the data.

> **⚠️ Prominent caveat — read before shipping a CRT**
>
> The loader calls the KERNAL **`RESTOR` ($FD15)** as part of the standard reset sequence. This intentionally rewrites the standard I/O vectors at `$0314/$0315`, `$0316/$0317`, `$0318/$0319`, `$0328/$0329` and friends back to their ROM defaults. Consequences:
>
> - **Any IRQ / NMI / BRK hooks set before the CRT boots are wiped.** Your program must install them itself after entry — exactly like a fresh `LOAD "",8,1 : RUN` from tape/disk.
> - **UltimateBasic programs** that rely on non-default KERNAL vectors being live at entry may need an explicit `SYS` or init call in the autostart stub. The standard UB autostart works out of the box; extension libraries that hook vectors *before* `RUN` do not.
> - **CIA1 / CIA2** are re-initialised by `IOINIT`. Custom timer setups (raster IRQs, music player CIA-A) must be reprogrammed after entry.
> - The cart is disabled from an 8-byte stub in **RAM at `$0100`** so that the `STA $DE00` cannot be interrupted by a bad ROM fetch. Do not rely on `$0100–$0107` containing the stack top image on entry — the first RAM push overwrites the stub.
>
> If a CRT runs in VICE but fails on real hardware, the first thing to check is whether the program assumes a specific KERNAL vector or CIA timer state at entry. Install the state explicitly in your init routine and it will behave the same on both.

### Compatibility

| Platform | Status |
|----------|--------|
| VICE (`x64sc`, `x64`) | Works via **File → Attach cartridge image**. |
| TheC64 / TheC64 Mini | Works via the built-in cartridge loader. |
| Kung Fu Flash | Works — native Magic Desk mode. |
| EasyFlash cartridge | Works when programmed as Magic Desk. |
| 1541 Ultimate II+ / Ultimate 64 | Works via **Cartridge → Load cart image**. |
| Chameleon / Turbo Chameleon | Works. |

---

## 13. Hardware Settings

Open via **Menu → Settings…** (formerly *Hardware Settings*). The dialog has three tabs: **General** (assembler mode, BASIC SYS stub, Run with Exomizer, updates, ASM output, SID preview, C64 Debugger parameters, snapshots / version control), **Files and paths** (VICE, RetroDebugger, ACME, Exomizer, git) and **Integrations** (C64 Ultimate, Kung Fu Flash 2). The sections below describe the external tools and devices.

### VICE Emulator

| Setting | Description |
|---|---|
| **Select VICE** | Browse to the `x64sc` (or `x64`) VICE executable |
| **Status** | Shows whether the executable path is valid and accessible |
| **VICE remote monitor** | Starts VICE with the binary monitor on port 6502, needed by the [VICE Monitor](#vice-monitor-hot-reload-live-watch-profiler) |

VICE is required for **Run as PRG**, **Run via D64**, and **Export to D64**.

### Exomizer

| Setting | Description |
|---|---|
| **Select Exomizer** | Browse to the `exomizer` executable |
| **Border flash during decompression** | When enabled, SFX-compressed PRGs use exomizer's built-in `-x1` fast border-flash effect; when disabled, `-n` is passed for silent decompression |
| **Status** | Shows whether the executable path is valid and accessible |

**Workflow:**
1. Install the Exomizer binary:
   - **Windows:** download the pre-built `win32/exomizer.exe` from https://bitbucket.org/magli143/exomizer/wiki/Home or https://csdb.dk/release/?id=244342.
   - **macOS:** `brew install exomizer` (installs Magnus Lind's official 3.1.2 build).
2. Configure the path in **Hardware Settings → Exomizer section**.
3. Enable the **Run with Exomizer** checkbox in the **Settings menu**.
4. All **Run** actions (PRG, D64, hardware) and **Build** actions (Build PRG, Build D64) will now crunch the assembled program through `exomizer sfx` before launching or saving: `sfx basic` when the PRG starts with a BASIC line (after decrunching, RUN starts the original `SYS` line, so a second RUN works too), `sfx $<load address>` otherwise.

Exomizer works the same way on Windows and macOS — the CLI is invoked from the Tauri backend; nothing about the integration is platform-specific.

**Two compression modes are used internally:**

| Mode | Used by | Calling convention |
|------|---------|--------------------|
| `sfx basic` / `sfx $<addr>` | Build/Run with Exomizer toggle (main PRG path) | Self-extracting PRG with a built-in decruncher; the Border-flash setting controls `-x1` vs `-n` |
| `mem` (backward) | Run via D64 → per-file **EXO** checkbox | Compresses each extra file to a `mem`-mode stream; the program decompresses it at runtime via the **EXODECRUNCH** macro and a pre-built depacker (`samples/exo-decrunch.bin`) |

> **Tip:** If the Exomizer path is not configured but the checkbox is enabled, a clear error toast is shown instead of launching. Disable the checkbox to run without compression.

> **Integration test:** `cargo test --test exomizer_integration` (in `src-tauri/`) verifies the full mem-mode compression + decompression roundtrip on a 6502 emulator.

### Retro Debugger

| Setting | Description |
|---|---|
| **Select RetroDebugger** | Browse to the `RetroDebugger` binary |
| **Status** | Shows whether the path is valid |

See [Section 9](#9-debugger-integration) for full debugger documentation.

### C64 Ultimate / 1541 Ultimate

Run assembled PRGs directly on real hardware over the local network using the Ultimate REST API.

| Setting | Description |
|---|---|
| **Host (IP)** | IP address of the device (e.g. `192.168.1.100`) |
| **Password** | Optional — if the device requires authentication |
| **Test connection** | Sends a test request to `/v3/runners/info`; shows OK or error |

**Workflow:**
1. Connect the 1541 Ultimate / Ultimate 64 to your local network.
2. Enter its IP address (and password if set) in Hardware Settings.
3. Select **Run on hardware** from the split run menu.
4. Click **▶ Run** — the PRG is compiled and sent to the device via HTTP POST to `/v3/runners/prg`. The device loads and runs it on the C64 immediately.

> **Tip:** No USB cable or driver needed — the REST API is built into the Ultimate firmware. Your computer and the device must be on the same local network.

### Kung Fu Flash 2

Run assembled programs on a **real Commodore 64 or C128** — no disk drive, disk image, SD-card copying or emulator involved. Visual Assembler talks to the cartridge's USB serial port, restarts it into its MENU loader and uploads the PRG, which then starts on the machine.

**What you need:**
- a Commodore 64 / C128 with a **Kung Fu Flash 2** cartridge fitted, powered on;
- **Kung Fu Flash firmware v2.07 or newer** on the cartridge — earlier firmware versions do not support the upload protocol used by Visual Assembler. Firmware releases: <https://codeberg.org/KimJorgensen/KungFuFlash2/releases/>;
- a **USB cable** connecting the cartridge to the computer running Visual Assembler (it shows up as a virtual serial port).

| Setting | Description |
|---|---|
| **Serial port** | The cartridge's USB serial port, e.g. `COM4` (Windows), `/dev/cu.usbmodem…` (macOS) or `/dev/ttyACM0` (Linux). Found automatically by its USB ID (`0483:5740`) when the app starts; the status line under the field shows `KFF2: <port>` or asks you to type the port manually if none was found. The value is saved between sessions. |

**Workflow:**
1. Fit the Kung Fu Flash 2 into the C64's cartridge port, power the computer on and plug the USB cable into your PC/Mac.
2. Open **Hardware Settings** and check the **Kung Fu Flash 2** section — the port should already be filled in.
3. Select **Kung Fu Flash 2** from the split run menu (the choice is remembered, and is also stored in project files).
4. Click **▶ Run**. The program is compiled, the cartridge is restarted into its MENU loader (a short 1200-baud "touch" of the serial port), a small handshake follows and the PRG is uploaded. When the transfer completes, the program is running on the real machine.

Works from **Block**, **Expert** and **Ultimate Basic** mode alike; Ultimate Basic programs compile from the project's startup file.

> **Limits and checks:** the PRG must contain the two-byte load address plus at least one data byte, must fit into the C64's 64 KiB address space, and must not exceed the size the cartridge's loader accepts. Failures — port not configured, port cannot be opened, the cartridge not returning from MENU, or a rejected upload — are reported in a toast with the exact reason.

> **Tip:** if you prefer a cartridge image instead of a live upload, **Build CRT** (Magic Desk 64K) also runs on the Kung Fu Flash — see [Section 12b](#12b-crt-export-magic-desk-64k-cartridge).

---

---

### Version control (git)

| Setting | Description |
|---|---|
| **Automatic autosave entries in version control** | Adds an autosave entry to the version history about 2.5 s after you stop editing (for project tabs to the project history as well) |
| **Choose git.exe…** | Browse to the `git` executable (`git.exe` on Windows) |
| **Auto-detect** | Clears the chosen path and searches the PATH and the usual install folders |
| **Use Git when the project is in a repository** | Opens the Version control dialog in Git mode for files inside a git repository |
| **Status** | Shows the git version, or that git was not found (the built-in version control still works) |

## 14. Visual Editors (Toolkit)

The toolbar **Toolkit** menu groups the visual data editors that all share a common Files menu (`Files ▾`) for Load BIN / Save BIN / Export to blocks / Save to D64. Each editor produces raw `.bin` data that can be placed in a program with `INCBIN`, or directly added to a D64 disk via the **Save to D64** entry.

Visual-editor dialogs can be dragged by their headers across the full Visual Assembler workspace. A dialog with no saved position opens centered; after it is moved, its last position is stored in UI settings and restored the next time it opens.

### Hi-Res / Multicolor Editor

Pixel-level bitmap editor with both 320×200 hi-res and 160×200 multicolor modes. Open via Toolkit → Hi-Res Editor.

| Feature | Description |
|---|---|
| Mode toggle | **Multicolor** checkbox switches between hi-res (mono per cell) and multicolor (4 colors per cell). |
| Tools | Pencil, eraser, line, rectangle, filled rectangle, oval, filled oval, flood fill, cell paper, select. |
| Cell paper (hi-res) | Hi-res allows two colours in every 8×8 cell: the ink (set pixels, high nibble of the cell's screen RAM byte) and the paper (clear pixels, low nibble). The **Cell paper** tool sets the paper of each cell you click or drag over to the selected colour; **PAPER** still sets every cell at once. The eraser clears pixels, so the cell's own paper shows. Disabled in multicolor, where the background ($D021) is shared. |
| Spray tool | Airbrush-style painter that scatters pixels around the cursor while drawing. |
| Spray intensity | Dropdown next to the spray tool controls how dense each spray stroke is. |
| Color palette | Foreground (ink) + paper (background) pickers. Multicolor mode tracks 3 per-cell extras automatically. |
| Undo / Redo | Per-stroke history, ctrl-Z / ctrl-Y. |
| Select | The dashed-square tool: drag on the canvas to mark a rectangular region. **Esc** clears the selection. |
| Copy / Paste | **Copy** (`Ctrl/Cmd+C`) copies the selected region. **Paste** (`Ctrl/Cmd+V`) shows a preview that follows the cursor: click on the canvas to place it, **Esc** cancels. The copy is kept, so pressing `Ctrl/Cmd+V` and clicking again places it as many times as needed. In hi-res mode pasted pixels still follow the two-colours-per-cell limit, so line the region up with the cell grid to keep its colours. Copy, Paste and Transparent paste are also in the right-click menu of the canvas; a paste started there previews at the clicked spot. |
| Transparent paste | `Ctrl/Cmd+Shift+V` (or its toolbar button) skips the paper-coloured pixels of the copy, so the picture underneath shows through. |
| Grid + Raster | **Grid** shows the character-cell grid: 8×8 pixels in hi-res, 4×8 double-wide pixels in multicolor. From 4× zoom it also draws a fainter line around every single pixel, so each pixel can be placed exactly. **Raster** adds a raster row overlay. |
| Zoom | Slider from 1× to 16×. |
| Import image | PNG/JPEG/GIF dropped into the canvas auto-quantizes to the 16-color C64 palette. |
| Export blocks | Appends BYTE/RAWBYTES blocks to the program with the encoded bitmap, screen, and color data. |
| Export `.bin` | Saves the native multicolor format (10000 bytes: 8000 bitmap + 1000 screen + 1000 color) ready for LOADFILE to $2000. |

### Sprite Editor

24×21 pixel sprite editor with multi-frame animation. Open via Toolkit → Sprite Editor.

| Feature | Description |
|---|---|
| Frames | Add / remove / reorder frames; frame strip shown at the bottom. **Copy** / **Paste** in the frame row copy the whole current frame; the same two entries are in the right-click menu of the canvas and of the frame strip. |
| Mode | Mono / multicolor toggle. |
| Tools | Pencil, fill, line, rectangle, circle — plus flip horizontal, flip vertical, shift left/right/up/down (with optional wrap). Shape tools show a live preview while dragging; release to commit. |
| Undo / redo | Full undo/redo stack per frame. Ctrl/Cmd+Z / Ctrl/Cmd+Y or the toolbar buttons. |
| Image import | Import a PNG or JPEG via Files → Import image. The importer maps each pixel to the nearest C64 palette colour and writes it into the current frame. |
| Animation preview | Play / Stop with configurable speed. |
| Export blocks | Inserts a RAWBYTES block at a 64-byte-aligned address for every frame, plus a sprite pointer setup. |
| Save `.bin` | Writes 64 bytes per frame (raw sprite data without padding). |
| Selection | **Select / move**: drag a rectangle, then drag inside it to move the pixels (empty pixels are transparent); arrow keys move it by one pixel (two in multicolor), Delete clears it, Esc drops it. **Rotate 90°** (both directions) turns the selection, or the whole frame. The selection, flip, shift and rotate act on body and overlay together. |
| Hi-res overlay | **Hi-res overlay** adds a second, single-colour hi-res sprite over every frame — the classic outline over a multicolor body. The **Layer** list picks the edited layer; the overlay is dimmed while the body is edited. On the C64 it is a separate sprite: give it a lower sprite number than the body. `.bin` and **Copy bytes** write the overlay sprites after the body's (`sprite_f1_ov_1`). |
| Mirror all | Appends a horizontally mirrored copy of every frame (and its hitbox) — a walk cycle the other way in one click. |
| Sprite sheet import | Files → **Import sprite sheet…**: cell width / height, offset, gap and frame count cut the picture into frames of the current size (multicolor cells are scaled to 12 pixels per sprite). Colours come from the picture or stay the sprite's own; OKLab matching with no dither, ordered (Bayer) or Floyd–Steinberg dithering. Replaces the frames or appends to them. |
| Hitbox | The **Hitbox** tool drags a rectangle per frame (dashed cyan); **Fit**, **Fit every frame**, **Copy to every frame** and **Remove** in the side panel. Files → **Copy hitbox table** gives `sprite_hit_x / _y / _w / _h` (one byte per frame, screen pixels from the top left); a frame without a hitbox uses its pixel bounds. |
| X / Y ×2 | Shows the preview as with `$D01D` / `$D017` sprite expansion. |

**Export to UltimateBasic** (Files menu) writes every frame (up to 8) as a `sprdef`, sets up sprite 0 (colour, multicolour, expand) and, for an animation, adds a raster-synced loop that steps the frames at the editor's FPS. In Ultimate Basic mode it is inserted at the cursor, otherwise copied to the clipboard.

### C64 Character ROM Browser ("Char map")

Read-only viewer of the C64 character ROM (the built-in PETSCII font). Open via the **C64 chargen** entry in the Toolkit menu. Useful for finding the screen-code of a glyph before writing it with `RAWBYTES` or `TEXT`.

| Feature | Description |
|---|---|
| Two character sets | Tab 1: **Set 1 — Upper/Graphics** (default mode after power-on). Tab 2: **Set 2 — Lower/Upper** (after `$0E` switch). |
| Glyph grid | 16×16 grid of all 256 characters. Click a glyph to see its detail panel: zoomed 8×8 pixel view, screen code (decimal + hex), PETSCII codes (both default and shifted), and the raw 8-byte bitmap. |
| Detail panel | Shows the selected glyph's screen code, PETSCII codes, and the eight raw bytes — ready to paste into a `RAWBYTES` or BYTE block. |
| Read-only | No editing here — use the Character Editor (below) to modify glyphs. |

### Character Editor (Charset)

256-character 8×8 charset editor. Open via Toolkit → Character Editor.

| Feature | Description |
|---|---|
| Load ROM | Loads the C64 character ROM — the exact 901225-01 glyphs, no file picker. The first button (and **Files → ROM: uppercase / graphics**) loads set 1, the second button (or Shift+click, or **Files → ROM: lowercase / uppercase**) loads set 2. |
| Load `.bin` | Imports an external 2048-byte charset binary. |
| Per-char preview | 16-wide grid of all 256 glyphs with the current cell highlighted. |
| Pixel editor | Edits the selected character, or a **tile** of 2×1, 1×2 or 2×2 neighbouring characters as one picture (Tile selector). |
| Drawing tools | Pencil, line, rectangle, filled rectangle and flood fill. A click on a pixel that already has the ink erases it. |
| Transforms | Clear, invert, flip horizontal / vertical, shift with wrap-around, rotate 90° clockwise / counter-clockwise (square tiles only) — on the whole tile. |
| Undo / Redo | Toolbar buttons, Ctrl+Z and Ctrl+Y (Ctrl+Shift+Z). |
| Copy / Paste | Toolbar buttons, Ctrl+C / Ctrl+V, or right-click on the map; copies the whole tile with its colours. |
| Map drag | Drag a character onto another on the map to swap them; Shift+drag copies. |
| Text preview | Type text to see it in the current charset. Choose the uppercase or lowercase set mapping; `{65}` or `{$41}` inserts a screen code. |
| Range export | Set the From / To characters, then **Files → Save range (.bin)** (raw bytes) or **Copy range ASM** (`.byte` lines). |
| Per-character color | Stores a default Color RAM value for each glyph. In multicolor character mode this also preserves the per-cell multicolor enable bit and the character's own lower-3-bit color. |
| Metadata round-trip | When loading compatible data from Charset Canvas / Map workflows, per-character color metadata is preserved so edits can continue without losing color intent. |
| Export blocks | Appends RAWBYTES at $0800 (block 2) or $3800 (block 7) with the encoded charset. |

### Charset Canvas Editor

Full-canvas charset painter for building screens from a complete 256-character charset. Open via Toolkit → Charset Canvas.

The canvas is 16×16 characters, 128×128 pixels. In multicolor character mode every character is either multicolor (wide pixels, 4 colours) or hi-res (8 narrow pixels, 2 colours), exactly like on the C64.

| Feature | Description |
|---|---|
| Mono / multicolor | Mono mode stores 1-bit 8×8 glyphs. Multicolor mode stores two-bit horizontal pixel pairs and marks multicolor cells with Color RAM bit 3. |
| Character mode tool | In multicolor mode, click or drag over characters to switch them between multicolor and hi-res (Color RAM bit 3). The shape is kept: a set pixel pair becomes the character's own colour. A hi-res character has the background and its own colour (0–7); MC1 / MC2 do not paint there. |
| Background | The BG dropdown is shown in mono mode too; MC1 / MC2 only in multicolor mode. |
| ECM | The **ECM** checkbox (extended colour mode, not together with multicolor): every character is hi-res with its own colour (0–15) and one of four backgrounds BG0–BG3 (`$D021`–`$D024`; BG1 / BG2 are the MC1 / MC2 registers). Pick a BG colour in the palette (tagged B0–B3), then click or drag over characters with the **Character background** tool. Only 64 different characters fit: the status line counts them, and saving merges equal characters — the charset is 64 characters (512 bytes) and the screen codes are `glyph | background << 6`. Turn ECM on with `$D011` bit 6. |
| C64 color model | Background uses `$D021`; shared multicolor 1 uses `$D022`; shared multicolor 2 uses `$D023`; each character's own color comes from Color RAM bits 0–2. |
| Drawing tools | Pencil, eraser, line, rectangle, oval, and flood fill work across character boundaries. |
| Spray tool | Airbrush-style drawing that scatters pixels across neighboring cells/characters. |
| Spray intensity | Dropdown next to the spray tool sets the stroke density. |
| Grid toggle | The Grid checkbox shows or hides the 16×16 character grid. |
| Zoom | The zoom slider (2×–24×, whole device pixels per C64 pixel) or Ctrl+wheel over the canvas; the zoom is remembered. From 8× the Grid also draws a fine line on every pixel edge. |
| Save charset `.bin` | Saves the 2048-byte character bitmap data. |
| Save 16×16 map + Color RAM `.bin` | Saves 256 screen codes followed by 256 Color RAM values. Use this with `MAP_COPY16X16`. |
| Loading | Can load charset-canvas saves, plain charset data, and compatible Character Editor charset data including stored per-character colors when present. |

**Important C64 limitation:** in multicolor character mode the two shared colors are global for the whole screen (`$D022` / `$D023`). Only the character's own color is per cell, and it is limited to colors 0–7 because Color RAM bit 3 selects multicolor mode. So one character shows at most **4 colours** (background, MC1, MC2 and its own colour), and the whole screen at most 3 + 8. In the palette the shared colours are tagged BG / 1 / 2, and colours 8–15 that are not shared are dimmed. Picking such a colour puts it into MC2 or MC1 only while no pixel uses that register; otherwise change it in its dropdown (that recolours the whole screen). In hi-res (mono) mode a character has 2 colours: the background and its own colour (0–15).

### Map Editor (Multilayer Tilemaps)

Layered tilemap editor for static scenery, sprite spawn maps, collision data, and similar. Open via Toolkit → Map Editor.

| Feature | Description |
|---|---|
| Layers | Multiple named layers, each with its own tileset and opacity. |
| Brushes | Single-tile, fill, line, rectangle, and circle modes. Shape tools show a live preview while dragging; release to commit. |
| Undo / redo | Full undo/redo stack per layer. Ctrl/Cmd+Z / Ctrl/Cmd+Y or the toolbar buttons. |
| Clear menu | Per-layer or whole-map clear with confirmation. |
| Image import | Drop a PNG of a tilemap; the editor auto-slices into tiles. |
| Copy / paste | Copy a selected tile region, then paste normally or use transparent paste to keep empty tiles transparent. The same entries are in the right-click menu of the canvas. |
| Multicolor-aware tile coloring | With compatible charset metadata, painting uses the tile's stored Color RAM defaults (including multicolor-related encoding) instead of a generic flat color. |
| Custom charset colors | When a charset carries `charColors` metadata, the Map Editor uses the selected tile's default Color RAM value while painting. |
| Export blocks | Emits RAWBYTES blocks for tileset graphics + map data. |
| Save Screen RAM (.bin)… | Saves only the screen codes for the current map layer (40×25 = 1000 bytes). |
| Save Screen RAM + Color RAM (.bin)… | Saves screen codes concatenated with Color RAM values as a single 2000-byte file (`screen[0..999]` followed by `color[0..999]`). Use this with the **MAP_COPY** macro (Combined .bin mode) to restore both screen and color in one operation at runtime. |

### Level Editor

Arranges **Map Editor screens** into one level — a vertical shooter, a car game scrolling down, a side-scroller or a 2D map — and previews the whole level with smooth scrolling. Open it with the **Level Editor** toolbar button next to the Map Editor.

| Feature | Description |
|---|---|
| Layout | **Vertical**, **Horizontal** or **Grid** (rows × columns, with add / remove row and column buttons). |
| Screens | **New empty screen**, **Add from Map Editor** (the map currently open) or **Load map(s) (.bin)…** (several Map Editor exports at once). Drag a screen from the list onto a slot; drag slots onto each other to swap them. |
| Editing | **Edit in Map Editor** opens the selected screen in the Map Editor and brings the changes back; duplicate, move up/left or down/right, remove; undo / redo. |
| Preview | Drag the preview or use the arrow keys to scroll pixel by pixel; **Play** scrolls automatically (direction, speed 1–8, loop), Space = play / stop. *Borders* marks the screen boundaries. |
| Checks | Charset info, and a warning when screens use a different charset or colors (the level uses the first screen's settings). |
| Character attributes | The **Character attributes** button switches the overview to attribute painting: pick **Solid**, **Ladder**, **Hazard** or **Collectible**, click a character and every cell with that screen code gets (or loses) it; drag for more codes. The attributes show as a coloured layer and become the 256-byte `LEVEL_ATTR` table (`LEVEL_ATTR_SOLID` = 1, `_LADDER` = 2, `_HAZARD` = 4, `_COLLECT` = 8). |
| Edge check | Marks in red where neighbouring screens do not continue: one side of the border empty (space) and the other not, or solid on one side only. The side panel counts the edges and cells. |
| Colors | **Level border**, and **Own colors for this screen** (background, border, multicolor 1 / 2) for the selected screen; the preview frame shows the border. Exported per slot as `LEVEL_SCR_BG / _BORDER / _MC1 / _MC2` (with `LEVEL_SCR_COLORS` = 1) when a placed screen has its own colours. |
| Memory | The `.level` data size at a chosen address (computed exactly as the macro builds it), with warnings for the BASIC / KERNAL ROM, the I/O area and memory below `$0800`, and the RLE size of the level. **Export RLE to blocks / Copy RLE asm** gives the level RLE packed with the `level_unrle` unpacker (`($FB)` → `($FD)`). |
| Run in VICE | Builds a joystick-scrolled test program from the level (the `level-demo` scroller, code at `$C000`, level data from `$2000`, custom charset at `$2000`) and starts it in VICE — screen colours switch with the screen at the top left of the view, the camera starts at the first Start object. |
| Objects | The **Objects layer** button switches the overview to object editing: pick a type (Start, Enemy, Item, Door, Exit, Trigger) and a **Param** byte (enemy kind, item id, door target …), click to place, drag to move (snapped to 8 px, Shift = free), click an object to select it and change its type / param, arrow keys move it, Delete removes it. Objects belong to the level position, not to a screen. They are listed in the sidebar, shown in the preview, saved with the level and exported in scroll order (vertical by Y, horizontal by X, grid row by row) as `LEVEL_OBJ_*` tables — by **Copy asm / Export to blocks** and by the `.level` macro. |

**Files menu:**
| Action | What it does |
|---|---|
| **New level** / **Open level (.bin)…** / **Save level (.bin)…** | The level project: all screens plus the layout. This is the file the `.level` macro and Ultimate Basic's `map load` read. |
| **Save level Screen RAM (.bin)…** | The whole level as one character map (screen codes only). |
| **Save level Screen + Color RAM (.bin)…** | The whole level's screen codes followed by its colors. |
| **Export to blocks** / **Copy asm** | The level data as blocks or as asm text (clipboard). |

**Using the level:** in assembler, `.level "level.bin"` + `.level_row` (see [LEVEL / LEVEL_ROW](#level--level_row) and `samples/level-demo.asm`); in Ultimate Basic 1.6.1+, `map load "level.bin", $4000` and `map view px, py` (example `level_scroll_demo.ub`).

### SID Editor (3-Voice Tracker)

Multi-instrument 3-voice tracker. Open via Toolkit → SID Editor. **Play: All** runs the exported 6502 player in the WebSid emulator; every other preview (instrument Preview, virtual keyboard, note entry, chord / arpeggio, row and single-pattern playback) also plays on the emulated SID: a JS model of the same player (frame for frame) streams its SID registers to WebSid every frame, and up to three preview notes share the three voices. The stream player is loaded when the editor opens and again after Stop, so notes sound at once; without WebSid a small SID synthesizer plays instead.

**Preview engine:** **Settings → SID preview** selects **WebSID** or **VA SID Core (Rust)**, the app's own SID emulation; with VA SID Core you also choose the chip (MOS 6581 / 8580). The editor's header shows the engine in use (e.g. *· VA SID Core v1.2 (MOS 8580)*). The instrument parameters are set with knobs.

**Per-instrument controls:**
- Waveform checkboxes (TRI / SAW / PUL / NOI) — multiple waveforms are ANDed like on the SID — plus **RING** (ring modulation of the triangle by the previous voice: 1 ← 3, 2 ← 1, 3 ← 2) and **SYNC** (hard sync to the previous voice).
- ADSR (attack / decay / sustain / release) shown as a drag-graph above the four sliders.
- Pulse width slider (0-4095).
- **Filter:** *Route this voice through the filter*, LP / BP / HP and **3 OFF** (mute voice 3 when it is not routed), cutoff, resonance, volume. **End** + **Sweep** move the cutoff from Cut toward End by Sweep per frame; **Ping-pong** bounces between the two — this is what makes resonant filter sweeps. The voice that starts a filter-routed instrument owns the filter (cutoff, resonance, mode); every voice whose instrument is routed goes through it.
- **Vibrato:** after **Delay** frames a triangle LFO that turns every **Speed** frames, **Depth** 0-15 scaled to the note's semitone (independent of the `V` effect).
- **Pulse width modulation:** **Speed** added to the pulse width every frame, bouncing between **Min** and **Max**.
- **Gate:** **Gate timer** releases the gate that many frames before the next note on the voice (keep it below Speed); **Hard restart** also zeroes ADSR then, for a clean attack; **First frame** writes a waveform on the note's first frame (e.g. `$09` test + gate).
- **Wave / arpeggio table:** up to 32 steps of waveform (— = keep) and note (offset in semitones, or **abs** = absolute note), one step every **Speed** frames, **Loop** back to a step or stop on the last one. **Presets** (25, in groups; the list keeps the chosen preset until the table is edited by hand): arpeggios (major, minor, 7th chords, sus4, diminished, augmented, power chord, octave, trill), drums (kick, snare, tom, clap, closed / open hi-hat), lead and bass attacks, and sound effects (laser, pickup, explosion).

**Tracker grid:**
- 3 voices × up to 256 patterns × 32 rows; the song / order list holds up to 255 steps.
- Per-row: note + instrument index, plus an optional effect (see **Effect column** below). Empty rows hold the previous note: like in other trackers (GoatTracker, SID-Wizard), a note keeps its gate on (sustain level) until the next note on that voice or a **note-off**.
- **Enter** (or a double-click) edits the selected cell as text (`C-4 01 V24`); **Enter** saves and moves to the next row, **Esc** cancels.
- **Note-off** (`===`): key **1** (or `` ` `` / `=`), or type `===` / `OFF` into a cell. It releases the gate, so the instrument's release runs — the same as the `C` effect without a note (saved and exported as `C00`).
- Select one cell normally, or hold **Shift** while clicking or using the arrow keys to extend a rectangular selection across rows and any of the three voices. Right-clicking inside the selected area keeps the range intact.
- Copy, Cut, Paste, and Clear are available from the icon toolbar and the icon-based context menu. `Ctrl/Cmd+C` and `Ctrl/Cmd+V` operate on the same rectangular selection.
- Harmony helper: choose a root note, chord type, and octave, preview the chord with the current instrument, then insert the voicing directly into the tracker. Available types include Major, Minor, Diminished, Augmented, Sus2, Sus4, Dominant 7, Major 7, Minor 7, 6, Minor 6, 9, b9, #9, Dim7, and 7sus4.
- Arpeggio helper: preview or insert 4-, 8-, or 16-step note runs from the selected chord in up, down, or up/down directions.
- **Preview row** auditions the selected row across all three voices without starting pattern playback.
- Cell-range paste now starts at the selected range start cell and stops cleanly at voice and row boundaries instead of wrapping into the next column or row.
- **Speed** (frames between rows, 1–255) is typed in or stepped with the − / + buttons next to it; the `F` effect changes it during playback.

**Song / order list:**
- Patterns are arranged through a song/order list layered on top of the raw pattern bank — the same pattern can repeat, and the song can be longer than the number of stored patterns.
- Add, remove, and reorder steps from the song list panel; the current step highlights during playback.
- Both the in-app playback and every export walk this list, not the raw pattern order — exports made before the order list existed still load correctly as a plain 0..N-1 song.

**Effect column:**
Each cell can carry one effect alongside its note and instrument, entered as a short code right after the note (e.g. `C-4 01 V24`) or on its own for a note-less effect row (e.g. `F06`):

| Code | Effect | Value |
|---|---|---|
| `V` | Vibrato | low nibble = depth, high nibble = hold length |
| `U` | Slide up (portamento) | amount added to the frequency each row |
| `D` | Slide down (portamento) | amount subtracted from the frequency each row |
| `C` | Note cut | silences the voice without retriggering; value unused |
| `F` | Speed change | new frames-per-row value, takes effect immediately |

Effects update once per row (matching the exported player's timing), run identically in the Web Audio preview and the compiled 6502 export, and are saved/loaded losslessly in the versioned `.bin` format.

**Playback and virtual keyboard:**
- The Play toolbar button changes to Pause during playback and to Resume while paused; Stop ends playback and resets the state.
- The **LCD** at the end of the tracker toolbar shows the song position (POS), pattern (PAT), row (ROW) and play time (TIME) during playback, and the edit position when stopped. **Settings → SID preview → LCD colour** makes it green or red.
- The keyboard toolbar button opens **VA-VK**, a non-modal piano (2, 3 or 4 octaves; position, open state, octave and *Insert into tracker* are remembered) with its own **Play / Stop** buttons that remains usable while the SID editor is active. Drag its header to place it anywhere over the main application.
- The **Instrument** knob on VA-VK (drag, mouse wheel or arrow keys) selects the instrument, shown with its number and name on the LCD next to it; it follows the instrument list of the editor. The badge next to the VA-VK title shows the SID emulation in use (WebSID, or VA SID Core with the chip model).
- Enable **Insert into tracker** to write each played note at the current tracker cursor and advance to the next row. Disable it to audition notes without editing.
- Chord and arpeggio previews illuminate the corresponding piano keys when the keyboard is open.

**Recording, metronome and MIDI:**
- **Record** (the red dot, in the tracker toolbar and on VA-VK) writes the notes you play — on VA-VK, the computer keyboard or a MIDI keyboard — in time into the selected voice, starting at the selected row, at the current Speed. When the pattern is full, a new empty pattern is added after the current song step and recording goes on there. Press Record again to stop.
- **Metronome** (tracker toolbar and VA-VK) clicks every 4 rows, accented on the first beat of each 4-beat bar. The beat lamps next to it flash on every beat during playback and recording, even with the click off.
- **MIDI:** choose the input in the **MIDI** list next to the instrument name and press **Connect MIDI**; notes play the current instrument (and are written into the tracker while recording or with *Insert into tracker*). The lamp next to the button flashes on every incoming MIDI message.
- **Pattern delete:** the **−** button next to **Pat +** deletes the current pattern (it asks first if the pattern has notes). The song steps that used it are removed and the others renumbered; at least one pattern always remains.
- The **master volume** knob is on VA-VK.

**Files menu exports:**
| Export | What it does |
|---|---|
| `Save .bin…` | Writes the editor's native serialized format (instruments with all modulation settings and names, speed, patterns, song). Older saves still load. |
| `Export blocks (data only)` | Appends instrument table + pattern blocks to the program at `* = $C000`. |
| `Export blocks + miniplayer` | Adds the full player (sid_init / sid_irq / sid_frame / sid_play_row / sid_set_voice) plus PAL frequency tables. After export, place a `JSR sid_init` in your main code where the music should start; with your own IRQ call `JSR sid_frame` once per frame instead. |
| `Export asm (clipboard)` | Copies the full assembly source to the clipboard. |
| `Import GoatTracker .sng…` | Loads a GoatTracker 2 song in place of the current one — see **GoatTracker import** below. |
| `Import .sid…` | Converts a PSID / RSID tune into an editable song in place of the current one — see **.sid import** below. |
| `Export to UltimateBasic` | Writes a `tune ... end` block (instruments, order list, pattern rows as text) plus `music play` and inserts it at the cursor of the Ultimate Basic editor; outside UB mode it copies the text to the clipboard. The UltimateBasic compiler builds the player, so `music play` / `music stop` control it. Instrument modulation goes into `imod` / `ifilt` / `igate` / `itab` lines (Ultimate Basic 1.6.2+). |

**GoatTracker import:** **Files → Import GoatTracker .sng…** loads a GoatTracker 2 song (`.sng`, GTS3–GTS5) in place of the current one. The conversion is approximate, because the two trackers work differently:
- The per-voice order lists (with transpose and repeat) are flattened into one 3-voice song and cut into 32-row patterns; identical patterns are shared.
- Instruments: AD / SR, first wave, gate timer and hard restart are taken over; the wavetable becomes the wave / arpeggio table, the pulse table PWM, the filter table filter mode, resonance and cutoff sweep, and the speed table entry the instrument vibrato.
- Pattern commands: key off → note-off, portamento → `U` / `D` (at most 255 per row), tempo → `F`; toneporta becomes a plain note. Other commands are dropped, and a message lists what was approximated or skipped.
- A gate released by the wavetable becomes a note-off on the next free row. Only the first subtune is imported.

**.sid import:** **Files → Import .sid…** opens a PSID / RSID file (desktop app only, it uses VA SID Core). Choose the subtune and the length in seconds and press **Import**: the tune runs silently, its SID registers are recorded frame by frame and turned into a song in place of the current one. A progress bar follows the recording, then *Converting…* the conversion.
- **Notes:** a note on is a gate edge (a retrigger within 2 frames counts as one note); a pitch change under a held gate that stays at least 5 frames becomes a new, retriggered (legato) note. The pitch is the most common semitone of the note's main waveform; NTSC tunes are retuned to the PAL note table.
- **Rows:** rows start exactly on the note ons. The base length is the longest that fits almost all of them; rows of that length or one frame longer (funktempo, swing, tempo changes) are set with `F` effects one row ahead.
- **Instruments:** AD / SR, the main waveform, pulse width and PWM, the filter (routing, mode, resonance, cutoff sweep) and the waveform and pitch of every frame of the note, up to the next one: the wave / arpeggio table (a prefix plus a repeating loop, up to 32 steps). A fixed-pitch drum attack keeps absolute notes and an arpeggio relative ones, decided over all notes of the same sound; a regular sub-semitone wobble becomes the instrument vibrato. The gate becomes a note cut, a gate timer (with hard restart when ADSR is zeroed) or a decay at the release rate. Identical instruments are shared, up to 128.
- A message lists what was approximated, for example slides that become semitone steps or tables longer than 32 steps. Multi-SID tunes and RSID tunes that start as a BASIC program are not supported.

**Player ZP usage:** `$02`–`$1C` (pattern pointers, pattern offset, temp) and `$2F` (current speed), plus `$FB`–`$FD` (tick counter, row index, order-list position). Voice, modulation and filter state lives in `sid_state` after the player code. The ZP bytes conflict if your main code uses them — relocate via Expert mode if needed.

**Known limits:**
- The player and its state sit at `$C000`. When the tune data does not fit below `$D000` next to them, the data moves to its own segment ending below `$A000` (the exported asm has a second `* =` line); keep it clear of your own program.
- C64 `$D418` global volume is shared across voices — the per-instrument volume slider is informational; sustain level (`S` of ADSR) is the effective per-voice volume.
- While **Play: All** has the real tune loaded (also when paused), note previews fall back to the small synthesizer, which only approximates the SID chip. Previews reach WebSid about 0.1 s ahead of the sound.

---

**Export .sid (PSID)…** (Files menu) saves the tune with the playable `$C000` player as a standard PSID file — it plays in the SID Player, in VICE's `vsid` and in any other SID player.

### SID Player

The **SID Player** toolbar button opens a floating window that plays `.sid` music files (PSID and RSID), for example tunes from the HVSC collection.

- **Playlist:** add tunes with **Add .sid files…** or by dropping them on the window, and click a tune to play it; **Remove** and **Clear playlist** tidy the list. **Save playlist…** / **Open playlist…** write and read a `.sidpl` file with the tunes embedded. The list, the current tune and whether the window is open are remembered.
- **Transport:** Play, Pause, Stop, **Previous** / **Next** tune, **Previous / Next subtune** for files with several songs, and a time counter.
- **Seek:** the position bar and **Back / Forward 10 s** work with the VA SID Core engine. WebSID cannot seek, so these controls are disabled with it.
- **Volume:** the knob is shared with the SID Editor's master volume.
- **Engine:** the window shows which engine is playing (WebSID, or VA SID Core with its version and SID chip); choose it in **Settings → SID preview**. VA SID Core runs the tune on a native Rust C64 core with a cycle-exact 6510, precise interrupt timing, CIA 6526A, VIC-II timing with bad lines, sprite DMA and raster interrupts, and the 6510 I/O port — so raster-IRQ, CIA-timed and digi tunes play with the timing of a real machine.
- **Shuffle:** the shuffle button next to **Next** plays the playlist in random order — no tune repeats until every tune has played, and **Previous** steps back along the random order. The setting is remembered.
- **Favourites:** the ☆ / ★ in each row marks a tune; it is kept in the saved state and in `.sidpl` playlists.

#### HVSC (High Voltage SID Collection)

The **HVSC** button in the SID Player toolbar opens a search panel for the [High Voltage SID Collection](https://www.hvsc.c64.org/), about 61,000 C64 tunes.

- **Search:** type a title, composer or folder (`hubbard commando`, `games/s-z`); every word has to match. **Random tunes** lists 25 random ones.
- **Play / add / save:** click a tune to play it, **+** adds it to the playlist, the download button saves the `.sid` file. **Add all results** adds up to 100 found tunes.
- **Tune lengths:** HVSC knows the length of every subtune, so the seek bar shows it and the playlist moves on when the subtune ends.
- **Where tunes come from:** the catalog and single tunes are downloaded from an HVSC mirror on first use and kept in the app's cache, so a tune played once also plays offline. **Update catalog** fetches the newest list.
- **Whole collection:** **Download the whole collection…** downloads the official HVSC archive (about 85 MB) into a folder you pick and unpacks it there (about 380 MB); from then on the player uses that copy and works offline. **Use a local HVSC folder…** points it at a collection you already have.

#### Spectrum analyzer

The bar button in the SID Player toolbar opens the **Spectrum** window: LED-style bars from green through yellow to orange, cells that fade out slowly and a mirrored floor in perspective. It shows whatever the SID Player or the SID Editor plays, with either engine. **Bands** sets 8, 16, 24 or 32 bands. The window can be moved and resized, it closes and reopens together with the SID Player, and it draws only while it is open.

---

### Curve Editor

Generates ready-to-use `.byte` lookup tables from mathematical curves — sine, easings, triangle/sawtooth/square, and bounce. Ideal for sprite movement, raster effects, colour cycling, or any animation driven by a precomputed table. Open via the **Curve Editor** icon in the top toolbar (next to the SID Editor button).

**Curves:**
Sine, Cosine, Linear, Ease In/Out/InOut (Quad and Cubic), Ease In/Out (Circ), Triangle, Sawtooth, Square, and Ease In/Out/InOut Bounce.

**Controls:**
| Control | Purpose |
|---|---|
| **Start / End value** | Output range. 0..255 in 8-bit mode, 0..320 in 16-bit mode. |
| **Number of values** | Table length, 4–512 entries. |
| **Cycles** | How many oscillations across the table (sine/cosine/triangle/sawtooth/square only). Accepts fractions (e.g. `3.625`). |
| **Phase** | Phase offset in degrees (sine/cosine only). |
| **Combine second curve** | Blend a second curve with **Mix / Add / Multiply / Min / Max / Subtract**, its own cycles/phase, and a mix amount. Both source curves are drawn as dashed guides on the graph. |
| **Label** | Table label (auto-suggested from the curve name). |
| **Number format** | `$XX` hex or decimal. |
| **Values per line** | 8 / 16 / 32 bytes per `.byte` line. |

**Output modes:**
| Mode | Emits |
|---|---|
| **8-bit** | A single `.byte` table (values 0..255). Read with `LDX #index / LDA table,X`. Optionally emits a **sprite-Y reader routine** (`<label>_set_y`) — `LDA <label>,X` / `STA $D001+2N` — for a selectable sprite number 0-7. |
| **16-bit** | Two parallel byte tables — `<label>_lo` (low 8 bits) and `<label>_hi` (9th bit, 0/1) — indexed by the **same** X (2 bytes per entry). Needed for sprite X across the full screen (0..320 > one byte). Optionally emits a **sprite-X reader routine** (`<label>_set_x`) that writes the low byte to `$D000+2N` and sets/clears the sprite's MSB in `$D010`, for a selectable sprite number 0-7. |

Every Copy / Insert output starts with a header comment documenting the curve, actual min/max range, entry count, and exact usage (which register each table feeds).

**Preview:**
- **Graph** — the curve plotted with value 0 at the **top** and max at the **bottom**, matching the C64 sprite-Y / raster convention (so what you see is what the table drives on hardware). A meta line under the graph shows the byte count, the actual Min / Max of the generated values, and the curve name(s).
- **Bouncing ball** — animates a marker through the table at the **Tempo** (5–240 values/sec). At tempo 50 this equals one value per frame on PAL (50 Hz), i.e. one `.wait_raster` step per index. Play/Pause and Restart buttons, a fading trail of the last ~24 positions, and a live `Index · Value` readout.

**Copy / Insert:** the toolbar's two icons — **Copy** puts the table on the clipboard; **Insert into editor** appends the table (and reader, if enabled) as blocks to the current program. Re-inserting **replaces** the previous Curve Editor insert instead of stacking duplicates (works in Block and Expert mode).

**Files menu:**
| Action | What it does |
|---|---|
| **Save curve (.bin)…** | Saves the raw table bytes exactly as the C64 would read them via `INCBIN`. 16-bit: N lo bytes followed by N hi bytes. |
| **Load curve (.bin)…** | Loads raw table bytes back into the editor, interpreted per the current bit depth (16-bit: first half lo, second half hi). The loaded table is shown as-is until any curve control regenerates a fresh curve. |
| **Export demo to blocks** | Appends a complete, runnable sprite demo: sprite init, raster-synced main loop, the embedded table, and ball sprite data. X sweeps 0..320 in 8.8 fixed point with the `$D010` MSB while the table drives sprite Y — exactly matching the editor preview. Re-export replaces the previous Curve Editor insert. |
| **Export to UltimateBasic** | Writes the table as an initialised Ultimate Basic array — `var name = array(N)` (or `array_word(N)` for 16-bit) followed by `data name: …` lines — and inserts it at the UB editor cursor (outside UB mode it is copied to the clipboard). The label becomes a valid, lower-case UB name; index the table as `name[i]`. Needs Ultimate Basic 1.5.8+ (bundled). |
| **Export UltimateBasic demo** | Produces a complete, ready-to-run UB program: a ball sprite (`sprdef 0`), the table, and a raster-synced loop that plays one table entry per frame. 8-bit tables drive sprite **Y** while X sweeps 0..320; 16-bit (0..320) tables drive sprite **X** while Y sweeps 0..200. Tables longer than 256 entries play their first 256. |

**Matching the preview on the C64:** the preview reads the table **linearly, looping 0 → N-1 → 0, one value per frame**. To reproduce it exactly, drive the table the same way (increment the index once per frame, wrap at the table length). A ping-pong or partial-range playback will move differently even though the byte values are identical. See `samples/curve-new-demo.asm` for a working 16-bit sprite-X example.

---

### Table Generator

The **Table Generator** toolbar button (grid icon, next to the Curve Editor) builds lookup tables and speedcode. Pick a table type, set its parameters and watch the preview; the meta line shows the entry count, size and value range (for code: bytes and estimated cycles / raster lines).

| Type | Values |
|---|---|
| Screen row addresses | base + 40 · row (any base and row length) |
| Bitmap row addresses | pixel Y → byte address in column 0 (8 × 8 cell layout) |
| Bitmap column offsets | pixel X → byte offset within the line (hires or multicolour) |
| Pixel bit mask | X → bit mask (hires / multicolour, optionally inverted for `AND`) |
| Multiply / divide / remainder by a constant | x · k, ⌊x / k⌋, x mod k |
| Quarter squares | ⌊(x − offset)² / 4⌋, 512 entries — a · b = sqr(a + b) − sqr(a − b) |
| Reciprocal | ⌊N / x⌋ |
| Logarithm / exponential | round(log2 x · s), round(2^(x / s)) |
| Bit reverse | flips a byte (or bit pairs in multicolour) to mirror sprites and characters |
| Custom expression | any formula of `i` (`k` = 0-based index, `n` = count); `sin`, `cos`, `abs`, `min`, `max`, `round`, `floor`, `PI`, `$hex`, `%bin` |
| Speedcode: fill / copy memory | a subroutine; *stores per iteration* 0 = fully unrolled, N = an X loop with N stores per pass |

Values above 255 become a **lo / hi table pair** (`label_lo`, `label_hi`) or a `.word` table; negative values are two's complement. Options: label, hex / decimal, values per line, **Align to page** (`.align 256`, avoids the page-cross cycle). **Copy** puts the assembly on the clipboard; **Insert** adds it to the program (re-inserting the same label replaces the previous copy) — in Ultimate Basic mode it inserts an `array` with `data` lines. The Files menu also saves the table as `.bin` (lo bytes, then hi bytes) and exports it to Ultimate Basic.

### Number Converter

A small **non-modal** DEC / HEX / BIN converter, opened with the toolbar button next to the D64 Editor (click again or press Esc to close). The button stays highlighted while the converter is shown. It stays open while you keep editing the program in any mode.

- Type into any of the **DEC**, **HEX** or **BIN** fields and the other two follow. Prefixes `$`, `0x`, `%`, `0b` and separators (space, `_`) are accepted; a negative decimal becomes two's complement in the current width; invalid input is marked red.
- **8 / 16 bit** width — a value above 255 switches to 16 bit automatically.
- **Bits row** — click a bit to toggle it.
- The info line shows the **signed** value and, in 16-bit mode, the **low** and **high** byte.
- **Copy** buttons copy the value with its prefix (`53280`, `$D020`, `%1101000000100000`).
- Drag it by the header; it remembers its value, width and position, and reopens after a restart if it was open when you quit.

---


*© 2026 Zsolt Tarczali — C64 Visual Assembler*
