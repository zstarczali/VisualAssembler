# C64 Visual Assembler — User Manual

**Version 2.9.2**

A visual, block-based 6502 assembler for the Commodore 64. Build programs by dragging and dropping instruction blocks, and see the generated assembly and machine code in real time.

---

## Table of Contents

- [Version 2.9.2 Highlights](#version-292-highlights)
- [Version 2.9.1 Highlights](#version-291-highlights)
- [Version 2.9.0 Highlights](#version-290-highlights)
- [Version 2.8.6 Highlights](#version-286-highlights)
- [Version 2.8.5 Highlights](#version-285-highlights)
- [Version 2.8.4 Highlights](#version-284-highlights)
- [Version 2.8.3 Highlights](#version-283-highlights)
- [Version 2.8.2 Highlights](#version-282-highlights)
- [Version 2.8.1 Highlights](#version-281-highlights)
- [Version 2.8.0 Highlights](#version-280-highlights)
- [Version 2.7.9 Highlights](#version-279-highlights)
- [Version 2.7.8 Highlights](#version-278-highlights)
- [Version 2.7.7 Highlights](#version-277-highlights)
- [Version 2.7.6 Highlights](#version-276-highlights)
- [Version 2.7.5 Highlights](#version-275-highlights)
- [Version 2.7.4 Highlights](#version-274-highlights)
- [Version 2.7.3 Highlights](#version-273-highlights)
- [Version 2.7.2 Highlights](#version-272-highlights)
- [Version 2.7.1 Highlights](#version-271-highlights)
- [Version 2.7.0 Highlights](#version-270-highlights)
- [Version 2.6.9 Highlights](#version-269-highlights)
- [Version 2.6.8 Highlights](#version-268-highlights)
- [Version 2.6.7 Highlights](#version-267-highlights)
- [Version 2.6.6 Highlights](#version-266-highlights)
- [Version 2.6.5 Highlights](#version-265-highlights)
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
- [1. Interface Overview](#1-interface-overview)
  - [Studio: one window for every language](#studio-one-window-for-every-language)
  - [Start window](#start-window)
  - [New, Tools and Versioning menus](#new-tools-and-versioning-menus)
- [2. Block Palette](#2-block-palette)
  - [Parameters in the operand field](#parameters-in-the-operand-field)
- [3. Program Area](#3-program-area)
  - [Block panel minimap](#block-panel-minimap)
  - [Operand input](#operand-input)
- [4. ASM View](#4-asm-view)
  - [Output modes](#output-modes)
  - [Toolkit tab](#toolkit-tab)
  - [Compile info and output settings](#compile-info-and-output-settings)
  - [Clicking an ASM line](#clicking-an-asm-line)
  - [ASM line numbers](#asm-line-numbers)
  - [Compile progress modal](#compile-progress-modal)
- [5. Settings & Toolbar](#5-settings--toolbar)
  - [Version control](#version-control)
    - [Project mode](#project-mode)
    - [Git](#git)
  - [In-app updates](#in-app-updates)
  - [Free and open source](#free-and-open-source)
  - [Reporting a bug](#reporting-a-bug)
  - [Support](#support)
  - [Project session (.proj.user)](#project-session-projuser)
  - [Memory window and zero page usage](#memory-window-and-zero-page-usage)
  - [Project templates](#project-templates)
  - [Tutorials and the Lesson Editor](#tutorials-and-the-lesson-editor)
    - [Online lessons](#online-lessons)
  - [Build project](#build-project)
  - [Example programs](#example-programs)
  - [Load .asm file (quick reference)](#load-asm-file-quick-reference)
    - [Import parsing notes and best practices](#import-parsing-notes-and-best-practices)
  - [Kick import (Kick Assembler)](#kick-import-kick-assembler)
    - [Kick projects (Import Kick project…)](#kick-projects-import-kick-project)
- [UltimateBasic Mode](#ultimatebasic-mode)
  - [Opening the UB editor](#opening-the-ub-editor)
  - [Editor tools](#editor-tools)
  - [Projects, tabs, and startup files](#projects-tabs-and-startup-files)
  - [Building and diagnostics](#building-and-diagnostics)
  - [Code size per line and hints](#code-size-per-line-and-hints)
  - [Running, D64, and Exomizer](#running-d64-and-exomizer)
  - [Debugger symbols and disassembly](#debugger-symbols-and-disassembly)
  - [Ultimate Basic manual and source](#ultimate-basic-manual-and-source)
- [C Mode (Oscar64)](#c-mode-oscar64)
  - [Opening and creating C files](#opening-and-creating-c-files)
  - [C editor tools](#c-editor-tools)
  - [C projects, build scripts and the startup file](#c-projects-build-scripts-and-the-startup-file)
  - [Building, running and views](#building-running-and-views)
- [6. Expert Mode](#6-expert-mode)
  - [Switching modes](#switching-modes)
  - [Editor layout](#editor-layout)
  - [Toolbar buttons](#toolbar-buttons)
  - [Expert editor minimap](#expert-editor-minimap)
  - [Cycle counts](#cycle-counts)
  - [Optimisation hints](#optimisation-hints)
  - [Error highlighting](#error-highlighting)
  - [Syntax highlight](#syntax-highlight)
  - [Source formatter](#source-formatter)
  - [Project panel & tabs](#project-panel--tabs)
  - [Tab bar](#tab-bar)
  - [ACME mode](#acme-mode)
- [7. Assembler Language and Macros](#7-assembler-language-and-macros)
  - [Macros in Block mode](#macros-in-block-mode)
- [8. Debugger Integration](#8-debugger-integration)
  - [RetroDebugger](#retrodebugger)
  - [Breakpoint Blocks](#breakpoint-blocks)
  - [Debugger flags](#debugger-flags)
  - [VICE Monitor (hot reload, live watch, profiler)](#vice-monitor-hot-reload-live-watch-profiler)
  - [Built-in C64 and debugger](#built-in-c64-and-debugger)
  - [Source-level debugging (C and UltimateBasic)](#source-level-debugging-c-and-ultimatebasic)
- [9. Knowledge Base Links](#9-knowledge-base-links)
- [10. D64 Export & Run](#10-d64-export--run)
  - [Split Run button](#split-run-button)
  - [Export to D64 dialog](#export-to-d64-dialog)
  - [D64 metadata in projects](#d64-metadata-in-projects)
  - [D64 Editor (browse & edit an existing disk image)](#d64-editor-browse--edit-an-existing-disk-image)
- [10b. CRT Export (Magic Desk 64K cartridge)](#10b-crt-export-magic-desk-64k-cartridge)
  - [What ships in the cart](#what-ships-in-the-cart)
  - [Load address and entry point](#load-address-and-entry-point)
  - [Size limit](#size-limit)
  - [Compatibility](#compatibility)
- [11. Settings](#11-settings)
  - [VMA compiler](#vma-compiler)
  - [Compilers (ACME, Oscar64)](#compilers-acme-oscar64)
  - [VICE Emulator](#vice-emulator)
  - [Exomizer](#exomizer)
  - [Retro Debugger](#retro-debugger)
  - [C64 Ultimate / 1541 Ultimate](#c64-ultimate--1541-ultimate)
  - [Installing the Ultimate emulator, step by step](#installing-the-ultimate-emulator-step-by-step)
  - [Kung Fu Flash 2](#kung-fu-flash-2)
  - [Version control (git)](#version-control-git)
- [12. Visual Editors (Toolkit)](#12-visual-editors-toolkit)
  - [Hi-Res / Multicolor Editor](#hi-res--multicolor-editor)
  - [Sprite Editor](#sprite-editor)
  - [C64 Character ROM Browser ("Char map")](#c64-character-rom-browser-char-map)
  - [Character Editor (Charset)](#character-editor-charset)
  - [Charset Canvas Editor](#charset-canvas-editor)
  - [Map Editor (Multilayer Tilemaps)](#map-editor-multilayer-tilemaps)
  - [Level Editor](#level-editor)
  - [SID Editor (3-Voice Tracker)](#sid-editor-3-voice-tracker)
  - [SID Player](#sid-player)
    - [HVSC (High Voltage SID Collection)](#hvsc-high-voltage-sid-collection)
    - [Spectrum analyzer](#spectrum-analyzer)
    - [Channel curves](#channel-curves)
  - [Curve Editor](#curve-editor)
  - [Table Generator](#table-generator)
  - [Number Converter](#number-converter)

---

## Version 2.9.2 Highlights

- **SID Player subtunes from the start** — A tune with several subtunes starts from its first subtune when you pick it again (in the playlist, with Next / Previous, or as an HVSC result), also when its subtunes had played on or the file names a later start song.
- **First / Last subtune** — **|‹** and **›|** buttons next to the subtune counter jump to the first and the last subtune of the file.
- **No click at the start with VA SID Core** — The note previews, Play in the SID Editor and the SID Player no longer click at the start of a tune when VA SID Core is the SID engine; with reSID on the 6581 the SID Player starts without its thump too. Switching to another tune fades the old one out in 40 ms instead of cutting it off mid-wave, which clicked on the 6581.
- **Subtune buttons while a tune starts** — A click in the first moments of a tune restarts it on the new subtune; before, only the number changed and the old subtune played on.
- **Splash screen** — The logo is 20% larger, the window keeps its size.

See [SID Player](#sid-player).

---

## Version 2.9.1 Highlights

- **MIDI controllers in the SID Editor** — the MIDI device is remembered and connected by itself the next time (also when it is plugged in later). Right-click a knob → **MIDI Learn** and turn a knob or fader on your controller; right-click **Play, Pause, Stop, Record, Undo or Redo** and press a button or pad. The mappings and the device are saved in the settings. See [SID Editor](#sid-editor-3-voice-tracker).
- **MIDI files** — **Files → Export MIDI (.mid)** writes the song (one track per SID voice, the song's tempo); **Import MIDI (.mid)** turns a MIDI file into a song: pick the tracks, the rows per beat and an instrument per track. The import can be undone.
- **ACME built in** like Oscar64 (**Use bundled** in Settings), and ACME switches in **Settings → Compilers**: verbose output (`-v2`), strict mode (`--strict`), type checks (`-Wtype-mismatch`), no label-indent warnings (`-Wno-label-indent`). The **VMA** section shows the built-in assembler's version (VMA 2.5.0) and has a **Verbose build report** switch: source lines, symbols, conditional assembly, segments and the PRG, listed in **Build info**.
- **Build info → Build** — the compiler and its version, the switches, the result, the PRG's size and load address, the BASIC stub, the debug files and Exomizer, plus the compiler's own output.
- **Clear recent** at the bottom of the Recent menu; the **Blocks** toolbar button is disabled in a project set to *Expert mode only*. **UltimateBasic 1.6.9**: `let` works like `var`.

---

## Version 2.9.0 Highlights

- **Visual Assembler Studio** — assembly (VMA, ACME, R65), blocks, UltimateBasic and C in one window. Every open file is a tab of one tab bar with a language badge; an assembly tab switches between **Blocks** and **Source**, and every file opens in the editor of its own language. See [Studio: one window for every language](#studio-one-window-for-every-language).
- **C with Oscar64** — a C editor with the Oscar64 compiler built in (ACME 0.97 is bundled too): highlighting, completion from the included headers, formatter, cycle counts, Disassembly / Monitor / Map views, project tree with a startup file, projects from build scripts. A C program runs in every Run mode. See [C Mode (Oscar64)](#c-mode-oscar64).
- **Source-level debugging in C and UltimateBasic** — breakpoints on source lines, stepping one C or Basic line at a time, a **Variables** panel and a **Call stack**. See [Source-level debugging](#source-level-debugging-c-and-ultimatebasic).
- **Start window, New / Tools / Versioning menus** — see [Start window](#start-window) and [New, Tools and Versioning menus](#new-tools-and-versioning-menus).
- **Projects** — one language per project, all source files open as tabs, the session in `<name>.proj.user` (it replaces workspaces), unsaved means different from the saved file, resizable project panel. See [Project session (.proj.user)](#project-session-projuser).
- **Memory map window** (Tools → Machine), new templates (Hello World for VMA and ACME, sprite multiplexers with 16 and 64 sprites in C, 64 sprites in UltimateBasic) and **UltimateBasic 1.6.8** (`sprite multicolor`, compile errors instead of a crash).

---

## Version 2.8.6 Highlights

- **Detailed wave table steps** — a step of the wave / arpeggio table can have its own length, pulse width and filter, under the **…** button of the step, and a table can have 64 steps; the exported 6502 player plays them. See [SID Editor](#sid-editor-3-voice-tracker).
- **Speech in .sid import** — speech and other sounds that step the waveform, pulse width and filter from frame to frame (GoatTracker tables) come in as such steps, and GoatTracker's hard restart (ADSR `0F 00`) is recognized.

---

## Version 2.8.5 Highlights

- **Shared SID emulation** — VA SID Core, reSID and the cycle-exact C64 behind the SID Player and the SID Editor come from one library, [va-sid](https://github.com/zstarczali/VA-SID), shared with VA SID Studio, so both apps play every tune the same way; the sound does not change. See [SID Player](#sid-player).
- **VA-SID version in About** — the About window shows the VA-SID version next to UltimateBasic, VMA and R65.

---

## Version 2.8.4 Highlights

- **Top 50 in the HVSC panel** — the star button lists the 50 most popular C64 tunes (the most remixed ones, from Remix64). See [HVSC](#hvsc-high-voltage-sid-collection).
- **Resizable Spectrum window on macOS** — the Spectrum window resizes with its own corner grip on every system. See [Spectrum analyzer](#spectrum-analyzer).

---

## Version 2.8.3 Highlights

- **Fade out at the end** — the SID Player fades a tune out over its last seconds, then moves on, and stops after the last tune (**Off / 5 / 10 / 15 s**). See [SID Player](#sid-player).
- **HVSC results without the playlist** — a click plays a result without adding it; when it ends the next result plays. See [HVSC](#hvsc-high-voltage-sid-collection).
- **Seamless switch between results** — the next result is downloaded ahead, so the previous tune no longer starts again for a moment; the result list keeps its scroll position.
- **`.vas` projects** — block-mode projects and the bundled samples use the new `.vas` extension; `.json` projects still open.
- **MIT license** — the original code is MIT-licensed; VICE-, reSID- and SID-derived parts keep their GPL terms.

---

## Version 2.8.2 Highlights

- **Examples folder** — the Examples dialog opens the bundled samples folder in the file manager. See [Example programs](#example-programs).
- **Level Editor window** — resizes with its corner grip and remembers its size. See [Level Editor](#level-editor).
- **GameMaker sample assets** — the charset, map, tiles and Level Editor project of the full-screen IRQ demo in `samples/gamemaker`.

---

## Version 2.8.1 Highlights

- **Five new themes** — **Ruby**, **Amethyst**, **Phosphor**, **Retro 80s** and **Retro 8-bit**. See [Settings & Toolbar](#5-settings--toolbar).
- **Tauri 2.12** — the app runs on Tauri 2.12 (wry 0.57, WebView2 bindings 0.39).
- **Manual** — the assembler language and macro reference (addressing modes, 6502 instructions, every directive and macro) now lives only in the [VMA manual](https://github.com/zstarczali/VMA/blob/main/docs/VMA-Manual.md); see [7. Assembler Language and Macros](#7-assembler-language-and-macros). Later sections are renumbered.
- **Fixes** — the **Channel curves** window opened from the SID Editor resizes again with its corner grip; the Hi-Res editor's **MIX** pattern list no longer stretches across the toolbar.

---

## Version 2.8.0 Highlights

- **SID Editor: L (legato) effect** — a note under the held gate without an envelope retrigger. See [SID Editor](#sid-editor-3-voice-tracker).
- **SID Editor: gate off in the wave table** — a table step can release the gate until the next note.
- **.sid import** — legato notes as L notes, a gate released inside a note as a gate-off table step, a silent intro on whole rows.
- **VA SID Core 1.3 and 8580 digi boost** — `$D418` digis are quiet on the 8580, as on the real chip; **Settings → General → SID preview → 8580 digi boost** makes them loud.
- **Kick import through R65** — **Kick import** and **Import Kick project…** build the source with R65 and write VMA that builds the same bytes. See [Kick import](#kick-import-kick-assembler).
- **Work window phases** — Run, Debug and Build show the phases of the work. See [Compile progress modal](#compile-progress-modal).
- **Project tree** — a Koala picture (`.koa`) opens in the Hi-Res editor, a charset in the Char editor, other files with their default app, show them in the file manager; an UltimateBasic project opens from Expert / Block mode in UltimateBasic mode.
- **Toolbars** — Expert and UltimateBasic toolbars in the same order with the same icons; the UltimateBasic **New** button is removed (Ctrl+N).
- **Fixes** — a label of hex letters (`BEQ bad`) stays a label through the blocks; Kick syntax highlighting of labels and calls.

---

## Version 2.7.9 Highlights

- **R65 assembler** — R65, a KickAssembler-compatible assembler, is built in: choose **R65 mode (KickAssembler)** in **Settings → General → Assembler mode** or in **Project settings**. See [ACME mode](#acme-mode).
- **Build summary window** — the Build button of the Expert and the UltimateBasic toolbar shows the small work window of Run, ending with the size and the address range of the PRG.
- **Kick import** — statements over several lines, `.errorif` with a condition known only at assembly time, labels inside `.pseudopc` and `<` / `>` of a number are imported correctly; a single file that uses script features is offered to open as a Kick project.
- **UltimateBasic toolbar** — separators around the Load / Save / Save as buttons.
- **ACME / R65** — Run no longer says *nothing to run* for a source without `* =` (for example with `BasicUpstart2`).

---

## Version 2.7.8 Highlights

- **Faster** — building, running and the live views while you type are quicker: the native Rust compiler builds the program once, and every view reads that one build.
- **One compiler** — every program is built by the Rust VMA compiler (VMA 2.3.0), and the disassembly, monitor, memory map, cycle gutter, hints and ASM view read the same build. The JavaScript compiler and the **VMA compiler** setting are removed; building needs the desktop app. See [VMA compiler](#vma-compiler).
- **Local labels as absolute operands** — a local label of another scope or with an offset, such as `JMP Second.lp` or `LDA .lp+1,X`, compiles; before, it was an invalid operand.

---

## Version 2.7.7 Highlights

- **Ultimate 64 palette macros** — `.u64_palette "file.vpl"`, `.u64_palette_color index, $RRGGBB` and `.u64_palette_reset` set the video palette of an Ultimate 64 / C64 Ultimate through its Command Interface. See [U64_PALETTE / U64_PALETTE_COLOR / U64_PALETTE_RESET](https://github.com/zstarczali/VMA/blob/main/docs/VMA-Manual.md#u64_palette--u64_palette_color--u64_palette_reset).
- **Ultimate 64 palette demo** — a new sample in the Hardware category: keys 1 and 2 load two palette files, 3 changes two colours, 0 restores the menu's palette. Run it on the hardware or in the Ultimate emulator run mode.
- **Hi-Res MIX** — a mix pen for multicolor pictures: 8 slots of 3 colours, 8 patterns locked to the picture. See [Hi-Res / Multicolor Editor](#hi-res--multicolor-editor).
- **Built-in C64** — Run no longer starts an empty program (only an ORG, comments or blank lines), like the other run modes.
- **Compiler setting** — the **Rust + JavaScript check** mode is removed from Settings → General → Program; JavaScript (default) and Rust remain.
- **Samples with files** — a sample's own `.incbin` / `.koala` / `.u64_palette` / `.sid` files are loaded with it.

---

## Version 2.7.6 Highlights

- **Star ratings** — every SID Player playlist row has 1 to 5 stars in place of the single favourite mark. **Keep only starred tunes** removes the rest after a confirmation. See [SID Player](#sid-player).
- **Remove duplicates** — a new SID Player toolbar button removes the tunes that are in the playlist more than once (the same HVSC path, or the same file). The first copy stays, with the most stars any copy had.
- **Normalize volume without distortion** — when a tune with a quiet start was raised and a louder part follows, the level now drops at once, before that part sounds, instead of gliding down over two seconds while the start of the loud part clipped.
- **HVSC downloads** — a tune that is still downloading shows a spinner in place of its **+** button, and clicking it again does not add it a second time.
- **Restore64 sources with their own BASIC line** — a disassembly that writes its `10 SYS 2061` line at `$0801` after the code, among the data blocks, builds byte for byte like the original again. Before, the line was moved over the first 12 bytes of the code, and the program did nothing. See [Kick import](#kick-import-kick-assembler).

---

## Version 2.7.5 Highlights

- **Channel curves** — a window shared by the SID Player and the SID Editor shows a scrolling level curve and a large note name for every voice. See [Channel curves](#channel-curves).
- **Spectrum by channel** — the Spectrum window's **View** list switches between the **Mix** of the output and a separate analyzer for every voice (**Channels**). See [Spectrum analyzer](#spectrum-analyzer).
- **Play subtunes in sequence** — the SID Player plays the remaining subtunes of a file before moving on, also with shuffle. A new toolbar toggle switches it, on by default.

---

## Version 2.7.4 Highlights

- **Selection in the horizontal tracker** — Shift+drag a frame or Ctrl+click notes to select them, then cut, copy, paste (at the mouse or the cursor) or delete them with the new header buttons or Ctrl+X / C / V and Del.
- **Quantize** — **Q** or the new button moves the selected notes to the nearest row of the grid (2, 4, 8 or 16 rows, in the tracker toolbar), keeping their lengths. With **On record** checked, a recording is quantized when it stops.
- **Undo / Redo in the horizontal tracker** — the two buttons of the tracker toolbar are in its header too.
- **Cleaner edits** — deleting a note keeps the end of the note before it, and a paste over a longer note leaves no stray note-off behind.
- **Deleting instruments** — **−** next to **+** deletes the current instrument, and Files → **Delete unused instruments** removes the ones no note plays.
- **Song volume** — **Vol**, a knob in the tracker toolbar, is the tune's volume (one per chip with two SIDs); instruments no longer set the chip's volume themselves.
- **PAL / NTSC** — the tune's timing: NTSC runs 60 frames a second on the NTSC clock, with its own note table and `.sid` header.

## Version 2.7.3 Highlights

- **Linux** — the SID Player and the SID Editor stayed silent where the GStreamer plugins were missing: the AppImage now carries them, and the `.deb` and `.rpm` packages depend on them.
- **Undo / Redo in the SID Editor** — two new buttons in the tracker toolbar, or Ctrl+Z and Ctrl+Y. They cover the notes, instruments, song, tempo and loading a tune, up to 100 steps. A whole recording is one step.
- **Tempo** — the tracker's tempo field is named for what it is, **Frames/row**: a higher number is slower. **BPM** next to it shows the resulting tempo.
- **Moving notes in the horizontal tracker** — drag a note's body to move it in time and pitch. It keeps its length, instrument and effect, and stops a row short of the voice's next note.
- **Note length in the horizontal tracker** — a note's right end is easy to catch now, even on a one-row note: the cursor turns into a double arrow and a bright bar marks the end. Drag it to stretch or shorten the note. It stops at the voice's next note, instead of deleting it.
- **Connect MIDI without a question** — on Windows the web view no longer asks for permission in a dialog of its own.
- **Loading a .bin** — the tracker opens on the selected first song step: a tune whose song does not start with pattern 0 showed pattern 0 instead.
- **SID Player Pause** — it pauses every time now: a chunk of the tune rendered at that moment, or a note from the SID Editor, could switch the sound back on while the player showed Paused. Pressing Pause again continues.
- **Stop in Play: All** — the tracker returns to the pattern that was open before playback, instead of staying on the last one played while the first song step stays selected.
- **Poly record from MIDI** — with **Poly record** on (next to the MIDI input), the keys you hold while recording go to voices of their own, from the selected voice on. A chord of three lands on three voices, and releasing a key writes a note-off.
- **No click on reSID** — notes played from the keyboard or VA-VK no longer click before they start, and neither does the first note of a tune that does not begin on the first row, with either the 6581 or the 8580.

## Version 2.7.2 Highlights

- **reSID in place of WebSID** — the SID Player and the SID Editor play on the backend, on [resid-rs](https://github.com/binaryfields/resid-rs) (a Rust port of reSID, the default) or on VA SID Core, both with the MOS 6581 or 8580. **Settings → General → SID preview** chooses. Seeking, stereo 2SID and 3SID tunes and the C64 core work with both. WebSID is gone.
- **SID Player buffer** — **Settings → General → SID preview → SID Player buffer** now states how far ahead the tune is rendered: 10, 15, 20 or 30 s.

## Version 2.7.1 Highlights

- **Debugger for VICE** — **Settings → General → Debugger** chooses the Debug button's debugger: **Visual Assembler** debugs on the machine of the run mode (VICE, Ultimate emulator, built-in C64), **RetroDebugger** opens the external program. In VICE the window works on your own VICE: breakpoints, step into / over / out, registers, disassembly and memory, with the editor following the CPU. See [Built-in C64 and debugger](#built-in-c64-and-debugger).
- **Ultimate emulator** — two new run modes, **Ultimate emulator** and **D64 on Ultimate emulator**, run the program on [UE2-C64U-Emulator](https://github.com/Jondalar/UE2-C64U-Emulator), the unmodified C64 Ultimate / Ultimate 64 firmware on your computer, through the same REST API as the real device. VA starts the emulator on the first run, installs a `.ue2` firmware into a flash image and closes the emulator with the app. **Debug** in these modes opens a debugger (breakpoints, step into / over / out, registers, disassembly, memory), and the **VICE Monitor** window connects to the emulator. Set it up in **Settings → Integrations → Ultimate emulator (UE2)**. New examples: **Ultimate turbo demo (64 sprites)** and **Ultimate turbo cube** (Examples → IRQ & hardware) change the CPU speed through `$D031` every 3 seconds, from 1 to 64 MHz, and run only on an Ultimate with the turbo registers on. See [C64 Ultimate / 1541 Ultimate](#c64-ultimate--1541-ultimate).
- **SID Editor: two SIDs** — **SID: 1 / 2** in the tracker toolbar gives a tune 6 voices, with a selectable address for the second SID (`$D420`–`$D7E0`, `$DE00`–`$DFE0`). Preview, `.bin` save, `.sid` and assembly export, and `.sid` import all handle both chips. See [SID Editor](#sid-editor-3-voice-tracker).
- **SID Player: 2SID and 3SID tunes** — VA SID Core plays them in stereo: SID 1 left, SID 2 right, a third SID in the centre. See [SID Player](#sid-player).
- **Channel spectrum** — a separate 16-band analyzer for every voice during tracker playback in the SID Editor.
- **SID Editor** — **Files → New tune**, the tune's title in the header, one button to detach and attach the tracker, and a tidier instrument list in the horizontal tracker.
- **Fixed** — **D64 on hardware** sends the image type with the mount request, which C64 Ultimate firmware 1.1.0 requires; stopping the editor no longer closes the SID Player.

---

## Version 2.7.0 Highlights

- **Built-in C64** — VICE 3.10 (x64sc, compiled to WebAssembly) now runs inside the app, nothing to install. Choose **Built-in C64** in the Run menu, or open it with its toolbar button. See [Built-in C64 and debugger](#built-in-c64-and-debugger).
- **Debugger** — it stops before the instruction at a breakpoint; **Continue**, **Break**, **Step into / over / out**; editable registers and flags, disassembly around PC, memory view and breakpoint list. Breakpoints come from the editor, from Block mode and from the disassembly, and the editor follows the CPU. The **Debug** button uses it in this mode, and in the real hardware modes when **Visual Assembler** is the chosen debugger.
- **Machine settings** — PAL or NTSC, SID 6581 or 8580, reSID or FastSID, REU up to 16 MB, joystick port, warp and sound.
- **Your own files** — the **Files** menu loads a PRG and attaches a D64 or a cartridge (`.crt`). The status bar shows the drive LED and track, and a blinking LED shows as a drive error, for example when a file cannot be found.
- **Display** — a CRT filter with scanlines, full screen and a resizable window. The window and its settings come back on the next start.
- **Hi-Res Editor** — multicolor cells are limited to the paper plus 3 colours, cells over the limit are marked in red, and drawing past the edge of the picture with the pixel grid on no longer raises errors. See [Hi-Res / Multicolor Editor](#hi-res--multicolor-editor).
- **Editor right-click menu** — in the Expert and Ultimate Basic editors: Cut, Copy, Paste, Select all, and UPPERCASE / lowercase for the selected text.

## Version 2.6.9 Highlights

- **Git branches** — the Version control window switches branches (the branch list), creates, renames and deletes them and merges one into the current branch. A merge conflict lists the files, marks them red, and **Abort merge** goes back to the state before the merge; the open tabs reload from disk after a switch, merge or stash. See [Git](#git).
- **File by file and stash** — every changed file has its own **Stage / Unstage / Discard** buttons (an untracked file can be deleted), and a click on its name opens its diff. **Stash** puts the changes aside; the stash list applies, pops or drops them. Without **Stage all changes** a project commit takes only the staged files.
- **A better diff** — a card per file with its status and +/− counts, old and new line numbers, assembly / Ultimate Basic syntax colours and the changed part of a line highlighted; **Split** shows the old and new text side by side and ⤢ gives the diff more room.
- **Discard changes really discards** — in Git mode it asks first, then resets the files on disk to HEAD (`git restore`) and reloads the tabs, so a branch switch works afterwards. Started from the menu, its result appears as a message.
- **Kick projects** — cycle counts, errors and hints also work in a file the startup file does not import: they come from the tree the file belongs to (for example `main.asm` next to a `boot.asm` startup file). A forward branch inside `.pseudopc` (`bne !+`) is relative to the logical address, and a char literal equals a one-character string (`s.charAt(i) == '1'`), as in KickAssembler.
- **Fixes and looks** — **Save project** saves an opened Expert project in place, with its unsaved file tabs, instead of asking for a file name; the Version control window stays within the screen and has icon tool buttons like the editors; shorter number fields in the Table Generator.

## Version 2.6.8 Highlights

- **Toolkit in Expert and UB mode** — the *Toolkit* toolbar button shows the C64 palette and the PETSCII codes next to the editor: in Expert mode as a side panel beside Disassembly / Monitor, in UB mode in the right-hand pane (it takes turns with Disassembly and Monitor).
- **Panels remembered** — the Monitor and Toolkit panels of Expert mode can be resized like the Disassembly; the panels you leave open (Palette, Disassembly, Monitor, Toolkit, Project) and their widths come back on the next start, whichever mode the app starts in — in UB mode too.
- **VMA language** — a `.const` or `.var` in the zero page makes `lda zp` a zero-page instruction (`A5 FB`, as KickAssembler does; `lda.abs zp` keeps absolute); `JMP (label)` / `JMP (table+2)`; expressions such as `lda $1234+1` and `sta $0400+40*2,x`; a macro may call another macro; labels in the bytes of `.data` / `.rawbytes` (pointer tables); a `:name` label may point at a label.
- **Includes** — an included file's own `.include`, `.incbin` and `.sid` lines are loaded (relative to its folder) and its macro calls are expanded; a missing include, or one that includes itself, is an error instead of an empty library.
- **Safer builds** — errors instead of silently wrong code: an unresolved TURBO_SET / SPRITE_ANIM value, a MEMCPY / MEMSET / JOYSTICK size taken from a label defined later; the automatic buffer of a `.data` / `.rawbytes` macro argument takes its bytes. Programs using zero-page constants get shorter.
- **Fixes** — a CRT larger than 8 KB (more than one bank) did not start: the loader now runs from RAM; an `.asm` name given in the Save dialog of a project saves the source text, not the VA JSON.

## Version 2.6.7 Highlights

- **Rust VMA compiler** — **Settings → General → Program → VMA compiler** chooses the engine: **JavaScript** (the default), **Rust**, or **Rust + JavaScript check**, which builds with both and logs any difference. The Rust compiler gives the same bytes, memory view, segments and translated error messages; Kick projects build through it too, with errors at `file:line`. See [VMA compiler](#vma-compiler).
- **VMA is open source** — the Visual Macro Assembler compiler lives in its own MIT-licensed repository, [github.com/zstarczali/VMA](https://github.com/zstarczali/VMA) (version 2.0.0), with an English and a Hungarian language manual and a command-line compiler. The About box shows the VMA version and banner next to Ultimate Basic.
- **Project symbols and constants** — **Project settings** sets VMA symbols (`.define`, for `.if` / `.ifdef`) and constants (`.const`) for the whole project, saved in the `.proj`; error lines stay correct. See [Project panel & tabs](#project-panel--tabs).
- **Compiling dialog** — a step line under the progress bar names the engine, the file and the PRG size.
- **Build info** — shows the file it describes; an ACME source gets its own view from the real ACME build (origin, end, size, segments, labels). Its **Build** section (VMA, ACME and R65) names the compiler and its version, the ACME switches, the result, the PRG (size, load address), the BASIC SYS stub, debug files and Exomizer; the compiler's own output (warnings, ACME's verbose steps) is listed under **Compiler output**. It no longer closes on an outside click.
- **Faster typing** — in ACME mode the Disassembly and Monitor panels are rebuilt once per build and dimmed while the source is newer; big Kick projects re-use their last preprocessing and render the disassembly in chunks.
- **Project tree** — **Move up** / **Move down** in the right-click menu of files and folders. Kick compatibility is switched in **Project settings**.
- **Fixes** — saving an `.asm` (Ctrl+S, Menu → Save, before a git commit) writes plain text again, not the VA JSON; version control snapshots keep source files as text; library macros inside a user macro (SET_BORDER, SPRITE_*, JOYSTICK, TEXT …) get their parameters, runtime IF / WHILE / REPEAT labels are unique per call and a `'A'` argument stays a character; draggable dialogs open at their saved place.
- **Look** — the compiling, build info, D64 export, compile error and question dialogs have the About box frame.

---

## Version 2.6.6 Highlights

- **SID player macro** — `.sid_player [subtune][, raster]` (**SID_PLAYER** in the palette) plays the tune of the `.sid` macro: it calls the init routine with the subtune, switches the CIA1 timer IRQ off, hooks a raster IRQ and calls the play routine every frame from its built-in handler. A program with music is now `.sid "music.sid"` + `.sid_player`. See [SID_PLAYER](https://github.com/zstarczali/VMA/blob/main/docs/VMA-Manual.md#sid_player).
- **SID labels** — the `.sid` macro defines `SID_LOAD`, `SID_INIT` and `SID_PLAY`, moved together with a custom load address, so your own IRQ handler can write `JSR SID_PLAY`. See [SID](https://github.com/zstarczali/VMA/blob/main/docs/VMA-Manual.md#sid).
- **Expert mode only** — **Project settings** has a switch that closes block mode for the project's files, whatever their size (saved in the `.proj`). See [Project panel & tabs](#project-panel--tabs).
- **SID Player buffer** — **Settings → General → SID preview → SID Player buffer** sets 2048–16384 samples; a larger buffer stops the crackle while the app is busy. WebSID uses it after a restart, VA SID Core renders 10 / 15 / 20 / 30 s ahead. See [SID Player](#sid-player).
- **Custom C64 palette** — **Settings → General → Editors → Edit custom palette…** sets your own RGB value for each of the 16 colours, starting from any built-in palette; import a Photoshop `.act`, VICE `.vpl`, GIMP `.gpl` palette or a list of hex colours, export `.act` / `.vpl`. See [12. Visual Editors (Toolkit)](#12-visual-editors-toolkit).
- **Look** — the C64 memory panel docks back collapsed; the What's New, update, Settings and Knowledge Base windows have the same frame as the About box; the Project settings checkboxes are VA switches.
- **Fixes** — the bug report accepts PNG and JPG screenshots in the release build; the blinking cursor after `READY.` on the splash screen is a solid C64 cell, without the lines macOS drew on it; macOS inline predictive text is off in the Expert and Ultimate Basic editors.

---

## Version 2.6.5 Highlights

- **KickAssembler projects** — **Menu → Program → Import Kick project…** takes a whole KickAssembler source tree (the main file with its `#import` modules and `.import binary` assets) and writes a `.proj` next to it; the sources stay where they are. Visual Assembler builds it with its own assembler, byte for byte like KickAssembler 5.25 — Run, Build PRG / D64 / CRT, Exomizer, Debug, the VICE Monitor and Build project all work, errors name the `file:line`, and the whole tree is checked while you type. The Dark Chambers C64 port and all eleven KickAssembler example programs with code build identically. See [Kick projects (Import Kick project…)](#kick-projects-import-kick-project).
- **Project settings** — the gear button in the Project panel (or **Menu → File → Project settings…**) shows and edits the name, startup file, assembler, KickAssembler compatibility, `#define` symbols and `cmdLineVars` of a project. See [Project panel & tabs](#project-panel--tabs).
- **Kick-compatible switch** — a switch (since 2.6.7 in **Project settings**) makes any VMA project KickAssembler compatible; the VA macros and directives keep working next to the KickAssembler script.
- **KickAssembler language** — `#import` / `#importonce` / `#importif`, `#define` / `#if`, `.const` / `.label` (zero page or absolute by value), `.for`, `.while`, `.if … else`, `.var` / `.eval`, `.function`, `.macro { }`, `.pseudocommand`, multi-labels, scopes and namespaces, `.pseudopc`, `.import binary`, `LoadBinary` (with templates such as `BF_KOALA`), `LoadSid`, `virtual` memory blocks, `cmdLineVars`, `BasicUpstart2`, `List` / `Hashtable` / `.struct` / strings, `.enum`, the math library, the colour and opcode constants, `*` as the program counter, `;` between statements, `.error` / `.errorif`.
- **Build Info in columns** — a wider window: origin, end, size and segment count on top, then the segments, errors and `.print` output, and the labels, constants and macros in columns. In a Kick project it shows the built tree, inner labels as `scope.label`.
- **C64 colour palette** — **Settings → General → Editors → C64 colour palette** sets the RGB values of the 16 C64 colours in every editor (sprite, character, Charset Canvas, Hi-Res, map, level, Toolkit swatches): **Colodore** by default (the closest to a real C64), or Pepto, VICE, Deekay, C64 Wiki / Godot. Only the display changes; the Hi-Res image import uses it too. See [12. Visual Editors (Toolkit)](#12-visual-editors-toolkit).
- **Colour picker** — the Hi-Res, Sprite, Character (multicolor) and Charset Canvas editors have a picker tool; **Alt+click** picks the colour with any tool. See [Hi-Res / Multicolor Editor](#hi-res--multicolor-editor).
- **Ctrl + wheel zoom** in the Hi-Res, Sprite, Map and Level editors, around the cursor. The Hi-Res Raster switch sits next to Grid.
- **ACME mode** — the memory map and the overlap warning follow the ACME build; an ACME project builds its startup file; the ACME templates appear only when a working ACME is set, and creating an ACME project switches Settings to ACME mode. See [ACME mode](#acme-mode).
- **New project** — **New project from template…** is under **New project** in the menu (the three separate entries are gone); the Visual Assembler sprite multiplexer template prints its title.
- **Fixes** — `.byte` / `.word` with label expressions (`<(label+1)`, `.word label` before the label) no longer assemble to 0; the illegal `NOP` forms that read an operand assemble (see [Illegal / Undocumented Instructions](https://github.com/zstarczali/VMA/blob/main/docs/VMA-Manual.md#illegal--undocumented-instructions)); the Ultimate Basic open button reads **Load .ub file** in every language.

---

## Version 2.6.4 Highlights

- **ACME assembler mode** — **Settings → General → Assembler mode** switches between *VMA mode* (the built-in Visual Assembler assembler) and *ACME mode*: the Expert source is built by ACME 0.97, and Run, Build, the Disassembly / Monitor panels, the debugger symbols, cycle counts, optimisation hints and the VICE Monitor all use the real ACME output. See [ACME mode](#acme-mode).
- **Better Kick Assembler import** — the Program menu entry is now **Kick import**. Plain `.text "…"` lines follow `.encoding`, `.label NAME = * + N` places a label inside an instruction, and the `.abs` / `.zp` mnemonic suffixes force the addressing mode. Restore64 disassemblies build byte for byte like KickAssembler. See [Kick import (Kick Assembler)](#kick-import-kick-assembler).
- **Run starts programs below the BASIC line** — a program that loads below or across the BASIC SYS line gets a small start loader; a lower ORG later in the source is no longer moved up to the start address. See the **BASIC SYS stub** row in [Settings & Toolbar](#5-settings--toolbar).
- **Exomizer** — a crunched program no longer gives `?SYNTAX ERROR` on the second RUN: a PRG with a BASIC line is packed with `sfx basic`, any other with `sfx $<load address>`.
- **SID Editor** — a playback LCD in the tracker toolbar (song position, pattern, row, time; green or red in **Settings → General → SID preview → LCD colour**), an instrument knob with an LCD on VA-VK, a progress bar for **Import .sid…**. See [SID Editor](#sid-editor-3-voice-tracker).
- **Settings in three tabs** — **General**, **Files and paths** and **Integrations**. See [Section 11](#11-settings).
- **Smaller improvements** — **Ctrl+N** opens a new tab; dialog text can no longer be selected by accident (text fields and copyable output, such as compile errors, still can); large Expert sources edit faster; `LSR A` and `JMP ($nnnn)` import correctly; the Knowledge Base links Restore64 (restore64.dev), which turns a C64 PRG into KickAssembler / ACME source for **Kick import** or ACME mode. An ACME source with a segment below `$0801` (a memory dump) is no longer shifted behind the BASIC SYS line: it builds at its own addresses and gets the start loader.

---

## Version 2.6.3 Highlights

- **.sid import in the SID Editor** — **Files → Import .sid…** turns any PSID / RSID tune into instruments, patterns and a song you can edit: note ons and legato notes, rows placed exactly on the notes (funktempo and swing through `F` speed changes), wave / arpeggio tables with fixed-pitch drum attacks, pulse and filter movement, gate timing and vibrato. See [SID Editor](#sid-editor-3-voice-tracker).
- **Long tunes play correctly** — when the tune data does not fit next to the player at `$C000`, it moves to its own segment below `$A000` instead of running into I/O; the `.sid` export follows.
- **VA SID Core preview retriggers notes** — a note restarted under a held gate gets a new attack, as on the real player.
- **SID Editor** — the header shows the active SID emulation (WebSID or VA SID Core with the chip model); the Speed field has − / + buttons and takes 1–255; the song can use up to 256 patterns.
- **Update server setting** — **Settings → General → Updates** sets the server the in-app update reads releases from (default `https://www.c64va.pro/`). See [In-app updates](#in-app-updates).
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
- **VA SID Core 1.1** — a built-in SID emulation (MOS 6581 / 8580, with a MOS 6581/8580-based 6581 filter) and a cycle-locked PSID / RSID player (6510 CPU, CIA / VIC timing). Choose it in **Settings → General → SID preview**; the SID Player shows which engine is playing.
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
- **Knowledge Base** — C64 OS development environment and png2c64 links, two-column list. See [Knowledge Base Links](#9-knowledge-base-links).

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
- **LEVEL / LEVEL_ROW macros** — `.level "level.bin"[, $addr]` places only the placed screens of a Level Editor project plus pointer tables and defines `LEVEL_*` labels and constants; `.level_row dst, col[, color]` copies one 40-character level row to a buffer. See [LEVEL / LEVEL_ROW](https://github.com/zstarczali/VMA/blob/main/docs/VMA-Manual.md#level--level_row).
- **JOYSTICK variable mode** — `.joystick port, vx, vy[, fire]` writes the direction into variables (−1 / 0 / +1) instead of moving a sprite; port `3` reads both joystick ports. See [JOYSTICK](https://github.com/zstarczali/VMA/blob/main/docs/VMA-Manual.md#joystick).
- **Level scroll demo** — `samples/level-demo.asm` scrolls a 2×5-screen level pixel by pixel in every direction with the joystick, tear-free, with room left for sprites and game code.
- **Number converter** — a non-modal DEC / HEX / BIN dialog on the toolbar. See [Number Converter](#number-converter).
- **Examples dialog** — **Menu → Examples…** opens a searchable, categorised list of the built-in example programs. See [Example programs](#example-programs).
- **Ultimate Basic 1.6.1 bundled** — `map load "level.bin"[, addr]` reads a Level Editor project directly, and the new `map view px, py` scrolls the map smoothly and tear-free at a pixel position (example: `level_scroll_demo.ub`). A byte product inside a 16-bit sum is no longer truncated to 8 bits. The UB command reference lists `map view`, and its search puts command-name matches first.

---

## Version 2.4.9 Highlights

- **Project templates** — **Menu → New project → New project from template…**, or the new toolbar button between **Menu** and **Tutorials**, creates a ready-to-build `.proj` project in its own folder. The dialog has an **Assembler** section (empty program, game skeleton, hires and multicolor bitmap) and an **UltimateBasic** section (empty program, game skeleton, hires bitmap, raster IRQ), with a syntax-highlighted preview. Your own `.asm` / `.ub` templates are picked up from the user templates folder. See [Project templates](#project-templates).
- **Build project** — **Menu → Build → Build project** compiles every buildable file of the open project (or of the open tabs) to a `.prg` next to its source, writes debugger symbol files where available, skips include-only modules and shows a per-file report. See [Build project](#build-project).
- **Ctrl + mouse wheel zoom** in the Expert and Ultimate Basic editors (`Cmd` + wheel on macOS; touchpad pinch works too).
- **Workspaces remember projects** — the Expert and Ultimate Basic project trees, the startup file and unsaved project changes are saved into the `.vaws` workspace and restored with it. Older workspaces still open.
- **Ultimate Basic** — the bundled compiler generates faster, smaller 6502 code; the memory map now tells real code and data apart from padding and long `org` gaps.
- **File dialogs start in the active working folder** — the Block/Expert or the Ultimate Basic one, depending on the current mode.

---

## Version 2.4.8 Highlights

- **New KOALA macro** — `.koala "picture.koa"` (optionally `, $2000`) loads a Koala Painter picture and shows it with an 86-byte display routine. See [KOALA](https://github.com/zstarczali/VMA/blob/main/docs/VMA-Manual.md#koala).
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

- **`*` in any expression** — the program-counter symbol now works inside operand expressions, not only on its own: `BNE *-5`, `JMP *+20`, `LDA #<*`, `LDA #>(*+63)`. A `*` that follows a value (`STRIDE*2`) is still multiplication. See [Addressing Modes → The `*` program counter in expressions](https://github.com/zstarczali/VMA/blob/main/docs/VMA-Manual.md#the--program-counter-in-expressions).
- **Local (dotted) labels** — a label such as `.loop` belongs to the scope of the nearest preceding *global* (non-dotted) label, so `DrawSprite` and `ClearScreen` can each define their own `.loop` without a clash. See [Local (dotted) labels](https://github.com/zstarczali/VMA/blob/main/docs/VMA-Manual.md#local-dotted-labels).
- **Long-branch pseudo-ops** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`, `LBMI`, `LBPL`, `LBVC`, `LBVS` assemble to an inverted branch over a `JMP` (always 5 bytes) so the target can be any distance away. New **Long branches** palette category. See [LBNE / LBEQ / … (Long branches)](https://github.com/zstarczali/VMA/blob/main/docs/VMA-Manual.md#lbne--lbeq---long-branches).
- **`.assert` directive** — `.assert end - start <= 256` or `.assert * < $A000, "message"` is evaluated at assembly time and fails the build (showing the actual value) when the expression is false. See [.ASSERT](https://github.com/zstarczali/VMA/blob/main/docs/VMA-Manual.md#assert).
- **Self-modifying-code operand labels** — `LDA value:#$00` defines the label `value` pointing at the instruction's operand byte, so `STA value` patches it directly. See [Self-modifying-code operand labels](https://github.com/zstarczali/VMA/blob/main/docs/VMA-Manual.md#self-modifying-code-operand-labels).
- **Friendlier out-of-range branch errors** — a branch that lands outside −128…+127 now reports exactly how far it overshoots and suggests the matching `LBxx` long branch.

---

## 1. Interface Overview

The app is split into three main panels:

| Panel | Description |
|---|---|
| **Left — Palette** | All available instruction and macro blocks. Search or browse by category. |
| **Center — Program** | Your program. Drag blocks here, reorder them, edit operands. |
| **Right — Output** | Live ASM view and/or memory monitor output. |

The mode badge at the far right of the header identifies the active **Block**, **Expert**, **Ultimate Basic** or **C** editor. It updates immediately when the active tab or its view changes.

In Block mode, a thin **vertical splitter** sits between the Program and Output panels. Drag it to give either panel more room (each keeps at least 260 px), use ← / → to nudge it in 16 px steps, or double-click it to reset the split to 50/50. The position is saved with the UI settings. The splitter is hidden in Expert and Ultimate Basic mode and when the window is narrow enough for the panels to stack.

### Studio: one window for every language

Assembly (VMA, ACME or R65), block programs, UltimateBasic and C (Oscar64) live in the same window:

- **One tab bar.** Every open file is a tab, whatever its language. A small badge on the tab shows the language: **BLK** (block program), **ASM** (assembly source), **UB** (UltimateBasic) or **C**. Clicking a tab brings up the editor of its language.
- **Blocks | Source.** For an assembly tab the switch in the top bar chooses the view: the block editor or the text editor (Expert mode). It is hidden on UltimateBasic and C tabs, and with ACME or R65 only **Source** is available.
- **A file opens in its own editor.** A `.ub` file opens in the UltimateBasic editor, a `.c` / `.h` in the C editor, an `.asm` in the assembly editor, also when you open it from the project tree of another language.
- **Projects have one language.** See [Project session (.proj.user)](#project-session-projuser).
- **The project panel** has the same width in every view: drag the grip at its right edge (200–560 px, double-click resets it). The width is remembered.
- **The hint bar** of Block mode shows once per launch at the bottom of the window and goes away after two minutes.

### Start window

At startup the **Start window** opens (also **Menu → Start window…**):

- **Open recent** — the projects you opened lately, with their language. Click one to open it; the × removes it from the list.
- **Create a new project** — the template dialog, see [Project templates](#project-templates).
- **Open a project** — a `.proj` of any language: VMA, ACME, R65, UltimateBasic or Oscar64.
- **Open a C folder** — an Oscar64 source folder, also one with a build script.
- **Continue without a project** — closes the window.

With **Show at startup** switched off the window does not open; the app reopens the project that was open when you closed it instead.

### New, Tools and Versioning menus

- **New** — **Assembly source**, **Block program**, **UltimateBasic program** or **C program (Oscar64)** opens a new tab in that language (with ACME or R65 an assembly source instead of a block program); **From template…** opens the template dialog.
- **Tools** — the editors and helpers in four groups: **Graphics** (C64 Character ROM, Character Set Editor, Charset Canvas Editor, Map Editor, Level Editor, Hi-Res Graphics Editor, Sprite Editor), **Sound** (SID Editor, SID Player), **Data and disk** (Curve Editor, Table Generator, D64 Editor, Number converter) and **Machine** (C64 memory map, VICE Monitor). The **Built-in C64** keeps its own toolbar button.
- **Versioning** (Git) — **Pull** and **Push** run at once; **Commit, changes, history…**, **New branch…**, **Merge…** and **Stash** open the Version control dialog in Git mode. See [Git](#git).
- **About** has its own toolbar button after Help.

---

## 2. Block Palette

The palette on the left lists all available blocks grouped by category:

- **Data movement** — LDA, LDX, STA, STX, …
- **Arithmetic** — ADC, SBC, INC, DEC, CMP, …
- **Logic** — AND, ORA, EOR, BIT
- **Jumps & Branches** — JMP, JSR, RTS, BNE, BEQ, …
- **Long branches** — LBNE, LBEQ, LBCC, LBCS, LBMI, LBPL, LBVC, LBVS (branch to any distance; see the [VMA manual](https://github.com/zstarczali/VMA/blob/main/docs/VMA-Manual.md#5-6502-instructions))
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
| **Disassembler** | Pure 6502 disassembly: address · hex bytes · mnemonics with resolved numeric operands. Macros are expanded to individual instructions (TEXT → LDA/STA pairs, LOOP → LDX, etc.). BYTE/WORD/FILL data shown as chunked hex dump. No macro names, comments, or annotations in output. |
| **Both** | ASM on top, monitor below |
| **Toolkit** | C64 reference panel: 16-colour palette swatch + PETSCII control-code and printable-character cheat sheet. Read-only — see the "Toolkit tab" subsection below for details. |

Macro blocks appear in the ASM and Both views as plain macro lines without a comment marker (`.print "HELLO"`, `.wait_raster $FF`, `.invoke setColor(blue)`) and are coloured as macros; only real COMMENT blocks, region markers and warnings keep their leading `;`.

### Toolkit tab

The **Toolkit** tab in the ASM view is a read-only quick-reference panel — it never modifies your program. Two sections:

| Section | Content |
|---|---|
| **C64 colour palette** | 16-swatch grid showing every C64 colour with its index (0–15 / `$00`–`$0F`) and name. Click a swatch to copy its hex index to the clipboard. Hover for the colour name (Light Blue, Brown, etc.). |
| **PETSCII control codes** | Common control codes for `CHROUT` ($FFD2): colour change codes (`$05` white, `$1C` red, `$1E` green, `$1F` blue, …), cursor movement (`$11`/`$1D`/`$91`/`$9D`), reverse on/off (`$12`/`$92`), `$93` clear screen, `$8E`/`$0E` charset switches. Also a printable-range cheat sheet (32-64 punctuation, 65-90 A-Z, 91-95 brackets, 96-127 graphics, 160-191 shifted graphics, 192-223 mirror). |

The Toolkit is the fastest way to look up a colour index or a PETSCII control byte without leaving the editor.

In **Expert mode** and **UltimateBasic mode** the same Toolkit opens from the **Toolkit** toolbar button: in Expert mode as a side panel next to Disassembly / Monitor (drag the divider on its left to resize it), in UB mode in the right-hand pane, where it takes turns with Disassembly and Monitor. Whether it is open and its width are remembered.

### Compile info and output settings

- **Compile info** (above the output) shows a summary of the compiled program: code start address, size and the BASIC SYS stub.
- The program's start address is set by an **ORG** block (`* = $C000`): the first ORG is the load address, further ORGs start more sections at other addresses.
- The output settings are in **Settings → General → ASM output**: **Macro source** (macro definitions MACRO…ENDM show their source in the ASM view), **Show region comments**, **Show memory overlays** and **Show memory panel**.
- The RetroDebugger flags (`-jmp`, `-unpause`, `-wait`) are in **Settings → General → RetroDebugger** — see [Debugger flags](#debugger-flags).

### Clicking an ASM line

Click any line in the ASM view to **highlight the corresponding block** in the program area. When several blocks are selected, the ASM lines of all of them are highlighted together.

### ASM line numbers

The ASM panel displays **line numbers** (`001 |`, `002 |`, …) to make troubleshooting easier when a compile error points to a specific line.

- The visual line numbers are for diagnostics only.
- **Export ASM** (Program menu) still copies the clean source text **without** line-number prefixes.

### Compile progress modal

During heavier actions, a centered progress modal appears with a progress bar:

- **Run** (VICE, D64, C64 Ultimate, Ultimate emulator, Kung Fu Flash 2) — building the PRG and starting it.
- **Debug** — building the PRG and launching RetroDebugger.
- **Build project**, **Build D64** and **Exomizer** packing.

Above the bar the phases of the work are listed — *Prepare*, *Compile*, *Analyze*, *Compress* (Exomizer), *Disk image* (D64), *Launch* — the running one highlighted and the finished ones checked; the window title follows the phase. The line under the bar names the step that is running, with the file — for example *Kick: preprocessing main.asm (14 files)…*, *VMA (Rust): compiling main.asm…*, *PRG ready: 2061 bytes from $0801*, *Exomizer: compressing …*, *VICE: starting …*. The modal closes automatically when the action completes or fails.

---

## 5. Settings & Toolbar

| Control | Description |
|---|---|
| **Number base (HEX / DEC / BIN)** | Sets the display/input format for operands throughout the UI. BIN mode displays values as binary with `%` prefix (e.g. `%11111000`). The ASM view always shows each block in its own format. |
| **Language** | Switch the user interface between English, Hungarian, Spanish, German, Dutch (Nederlands), Polish and Italian (**Menu → Settings**) |
| **Theme** | Light / Dark / OLED / Black / Commodore 77 / Commodore Starlight / Commodore Beige / Commodore 64 / Ruby / Amethyst / Phosphor / Retro 80s / Retro 8-bit — select from the theme picker in **Menu → View**. OLED uses a pure-black background for AMOLED displays. Commodore 77 is a neon-yellow-on-black theme; when it is the active theme the startup splash panel uses the theme's panel colour (matching the message card), shows a smaller dedicated Commodore 77 logo, and a yellow progress bar. Commodore Starlight is a light theme after the translucent C64 breadbin: frosted clear glass panels with the rainbow RGB glow shining through, a magenta accent, rainbow syntax colours and a smoky dark monitor view. Commodore Beige is the classic breadbin: a beige case, mustard function-key buttons, the rainbow badge stripes and a C64 blue screen for the monitor view. Ruby is a dark theme with a deep red accent, Amethyst a cool dark purple, and Phosphor a green phosphor monitor whose code views glow softly. Retro 80s is synthwave: a violet night, neon pink keys and cyan code, a sunset stripe on top and a neon grid rising from the bottom. Retro 8-bit is an 8-bit home computer on a CRT: blue-violet panels, yellow keys, one monospace font, square corners, hard pixel shadows, a rainbow stripe and scanlines. In December the picker also offers Christmas (night blue, pine green and white, every accent in an ornament's colour); after that the app goes back to the theme you had before. The chosen theme is applied before the first paint on the next launch. |
| **CRT retro mode** | Toggles a full-screen CRT filter: scanlines, phosphor vignette, flicker, and barrel distortion. State is saved between sessions. |
| **C64 memory map** (**Tools → Machine**) | Opens the full C64 memory map in its own window — see [Memory window and zero page usage](#memory-window-and-zero-page-usage) |
| **BASIC SYS stub** | (**Settings → General → Program**) Prepends a BASIC line that calls SYS to your program's origin (the first ORG). A segment placed lower than the first ORG stays at its own address. When the program loads below or across the BASIC line (`$0801`–`$080C`, for example an imported dump from `$071C`), Run and Build add a small start loader instead: `SYS 2061` copies a mover to the tape buffer (`$033C`), which puts the program in place and jumps to the first ORG. |
| **Examples…** | Open the example browser and load a built-in example program — see [Example programs](#example-programs) |
| **Zoom in / out** | Scale the block UI (affects all block elements) |
| **Save program** (`Menu → File`) | Save the current tab: a block program as a `.json` file, a source file (`.asm`, `.s`, `.inc` …) as plain text (Ctrl+S does the same) |
| **Save Program As** (`Menu → File`) | The same, with a new file dialog every time |
| **Load program** (`Menu → File`) | Load a previously saved program |
| **Start window…** (`Menu`) | Recent projects, new project, open a project or a C folder — see [Start window](#start-window) |
| **Set working folder** | Choose the default folder used by file pickers and save dialogs. The path is stored in the app config, and menu previews keep the end of the path visible. |
| **New project…** (`Menu → File`, **New → From template…** or the Start window) | Create a new `.proj` project from an UltimateBasic, C, Visual Assembler or ACME template in its own folder — see [Project templates](#project-templates) |
| **Open Project** (`Menu → File`) | Open a `.proj` project of any language and open all its source files as tabs |
| **Save Project** (`Menu → File`) | Save the current `.proj` project (project panel must be open) |
| **Close Project** (`Menu → File`) | Close the currently open project and all its file tabs. Prompts to save unsaved changes. The project panel resets to its empty state. |
| **Load .asm file** (Expert toolbar) | Opens a `.asm` file in Expert mode in a new tab |
| **Build PRG** (`Menu → Build`) | Export the compiled binary as a `.prg` file |
| **Build D64** (`Menu → Build`) | Package the program and extra files into a `.d64` disk image — see [Export to D64 dialog](#export-to-d64-dialog) |
| **Build CRT** | Export the program as a 64K Magic Desk (`.crt`, cartridge type 19) file. See [Section 10b](#10b-crt-export-magic-desk-64k-cartridge). |
| **Build project** (`Menu → Build`) | Compile every buildable file of the project (or of the open tabs) to a `.prg` next to its source — see [Build project](#build-project) |
| **Run (split button)** | The main **▶ Run** button runs the current mode; click the **▾** arrow to switch between: **Run as PRG (VICE)** (compile and launch VICE directly), **Run via D64 (VICE)** (package into a .d64 disk image and launch VICE), **Run on hardware** (send PRG to a C64 Ultimate / 1541 Ultimate device), **D64 on hardware** (send a D64 to the same device), or **Kung Fu Flash 2** (upload the PRG over USB to a real C64/C128 with a Kung Fu Flash 2 cartridge). See [Section 10](#10-d64-export--run) and [Section 11](#11-settings). **Built-in C64** runs the program on the C64 inside the app, see [Built-in C64 and debugger](#built-in-c64-and-debugger). |
| **Debug (RetroDebugger)** | Compile and launch in RetroDebugger with breakpoints, symbols, and autostart flags (see [Section 8](#8-debugger-integration)) |
| **Run with Exomizer** | Checkbox in **Settings → General → Program** — when enabled, all Run and Build operations crunch the PRG through `exomizer sfx` before launching or saving (`sfx basic` for a PRG that starts with a BASIC line, so RUN works again after the program returns; `sfx $<load address>` otherwise). Works with Run as PRG, Run via D64, Run on Hardware, Build PRG, and Build D64. Configure the Exomizer executable in **Settings → Files and paths** first. |
| **Automatic autosave entries** | Checkbox in **Settings → General → Version control**. When enabled, the app adds an autosave entry to the version history about 2.5 seconds after you stop editing a tab (for a tab of a project also to the project history). Turn it off if you only want your own commits. See [Version control](#version-control). |
| **Settings** (formerly Hardware Settings) | Open the settings dialog with four tabs: **General** (assembler mode, VMA compiler, BASIC SYS stub, Exomizer, ASM output, SID preview, debugger choice and parameters, version control), **Files and paths** (VICE, RetroDebugger, update server, Exomizer, git), **Compilers** (ACME, Oscar64, Oscar64 optimisation) and **Integrations** (C64 Ultimate, Ultimate emulator, Kung Fu Flash 2). See [Section 11](#11-settings). |
| **New program…** (`Menu → Program`) | Opens a confirmation dialog, then clears all blocks from the program area |
| **Export ASM** (`Menu → Program`) | Copies the generated assembly source |
| **Collapse All** | Collapse all blocks |
| **About** | Version info |
| **What's New** | Changelog |
| **Knowledge Base** | Reference links (6502 opcodes, C64 KERNAL, memory map, colors) |
| **Check for Update** | Check c64va.pro for a newer release and download / install it — see [In-app updates](#in-app-updates) |

### Version control

Every tab has its own version history, like a small git repository; a tab that belongs to an open `.proj` project can also be versioned as a whole project (see [Project mode](#project-mode)). **Git → Commit, changes, history…** in the toolbar opens the dialog (in Git mode; its **Built-in** switch shows the built-in history); **Discard changes (back to HEAD)** restores the last commit after a confirmation (in Git mode the files on disk too).

The usual workflow: write a **commit message** and press **Commit** (or Ctrl+Enter) → keep editing → press **Diff** to see what changed → commit again.

- **Commit** — saves the current state of the tab with your message. Every commit gets a short hash (for example `1bd55ba`); the newest one is **HEAD**. A commit with no changes since HEAD is not created.
- **Status line** — *Nothing to commit, working tree clean* or *Uncommitted changes since `<hash>`*.
- **Diff** — the changes since HEAD; the **Diff** button of a log entry compares that version with the editor. Added lines are green, removed lines red, and the header shows **+N / −M**. Block-mode programs are compared as assembly lines (one line per block), Expert sources line by line, Ultimate Basic tabs by their source, so a Block-mode project saved as JSON still shows readable changes. Every file is a collapsible card with its status (**M** / **A** / **D** / **R**) and counts, the lines carry their old and new numbers and the syntax colours of the editor, and in a changed line the part that differs is highlighted. **Split** shows the old and new version side by side (remembered), ⤢ gives the diff more room. A source file (`.asm`, `.s`, `.inc` …) is stored as its text, so a version stays a source file.
- **Checkout** — loads that version into the editor. The file on disk only changes when you save; **Discard changes** goes back to HEAD.
- **Autosave entries** — with **Settings → General → Version control → Automatic autosave entries in version control** the app adds an entry about 2.5 seconds after you stop editing. They are marked *autosave*; the last 20 are kept, next to up to 100 commits.
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

- **Settings → Files and paths → git** / **Settings → General → Version control:** **Choose git.exe…** or **Auto-detect** (searches the PATH and the usual install folders); the line below shows the git version. **Use Git when the project is in a repository** (on by default) switches the dialog to Git mode automatically for files inside a repository. The **Built-in / Git** switch in the dialog header changes the mode by hand.
- The header shows the branch with **↑** (commits to push) and **↓** (commits to pull). Below the status line a toolbar (icon buttons, the names show on hover) holds the **branch list**, the branch tools, **Stash**, and **Pull / Push / Refresh**.
- **Branches** — pick another branch in the list to switch to it (`git switch`); **New branch** creates one from HEAD and switches to it, **Rename** renames the current branch, **Delete branch** deletes another one (a branch that is not merged yet is deleted only after a second confirmation). Switching needs saved tabs: save or discard the editor changes first. After a switch the open tabs of the repository reload from disk.
- **Merge…** merges a chosen branch into the current one (`git merge --no-edit`). On a conflict the conflicting files are listed and shown red, and the status line says *Merge in progress*: resolve them in the editor, save, mark each one **Resolved** and commit — or press **Abort merge** (`git merge --abort`) to go back.
- **The change list** shows every changed file of the repository with its `git status` code. Click a name for its diff (HEAD against the file on disk); the buttons next to it **Stage** (`git add`), **Unstage** (`git restore --staged`) and **Discard** it (back to HEAD on disk, after a confirmation) — an untracked file can be **deleted** instead.
- **Stash** puts the uncommitted changes aside with an optional message (`git stash push`); the **stash list** below the changes **applies**, **pops** or **drops** an entry.
- **Discard changes** asks first, then resets the changed files on disk to HEAD (`git restore --staged --worktree`) and reloads their tabs — for a project the whole project folder, otherwise the file of the tab; untracked files are kept.
- **Commit** saves the file first, stages only this file (or every change with **Stage all changes (git add -A)**) and runs `git commit`. In a project **Stage all changes** is on by default; switched off, the commit takes only the files you staged in the change list.
- The log lists the commits of this file with their branches and tags. **Diff** on an entry compares the commit with its parent; the **Diff** button compares HEAD with the editor, unsaved changes included. Project files are compared the same way as in the built-in mode; **RAW** shows the plain `git diff`.
- **Checkout** loads the file of that commit into the editor (`git show`) without touching the disk.
- **Pull** (`--ff-only`), **Push** (the first push sets the upstream with `-u origin <branch>`) and **Create repository (git init)** when the folder is not a repository yet.
- git runs without a console window and never asks for a password: credentials must come from a credential manager or an SSH key, otherwise the error message is shown in the dialog.

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

**Update server:** **Settings → Files and paths → Updates → Update server** sets where releases are looked up (default `https://www.c64va.pro/`); the installers are read from `<server>downloads/VA/`. The address must use `https://` (plain `http://` only for `localhost`, for testing); **Default** goes back to c64va.pro.

### Free and open source

Visual Assembler is free: every feature — the visual editors (SID, Sprite, Char, Charset, Hi-Res, Map, Level, D64, Curve), the SID Player, **Build PRG**, **Build D64**, **Build CRT**, **Build project**, Exomizer packing, running on the C64 Ultimate and on the Kung Fu Flash 2, and every UI language and theme — works without a registration or a serial. Original project code is available under the MIT License (see **Menu → About** and [LICENSE](LICENSE)). VICE/reSID-derived code retains its GPL terms; distributing the combined application also requires GPL compliance (see [third-party licenses](THIRD_PARTY_NOTICES.md)). Up to version 2.5.9 the app had a Freemium / Professional split; since 2.6.0 a serial entered there is simply no longer needed.

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

### Project session (.proj.user)

A project has **one language**: assembly (VMA, ACME or R65, with blocks), UltimateBasic or C (Oscar64). Its sources are the files of that language — `.asm .s .a65 .inc .vas` for assembly, `.ub` for UltimateBasic, `.c .h` and assembly for C; anything else can be added as an asset (`incbin` data, pictures …). A source of another language cannot be added, and opening the project opens all its sources as tabs with the startup file active. Only one project is open at a time: opening another closes the open one first.

Next to `<name>.proj` the app keeps **`<name>.proj.user`**, the project's session: the open tabs (relative paths), the **Blocks / Source** view of each assembly tab, the breakpoints, the active tab and its cursor line. It holds no file contents — the tabs always read the files from disk. Opening the project restores this session; without the file every source opens as a tab. The file is written shortly after the tabs change and when the project closes; keep it out of version control (it is personal, like `.vs` or `.idea` folders).

A tab counts as **unsaved** only when its text (for a block program, its source lines) differs from what was last saved: undoing a change or typing the same text back clears the dot, and closing or switching projects asks only about real changes.

**Workspaces** (`.vaws`) are retired: their menu items are gone and the app no longer reopens the last workspace at startup. With the Start window switched off, the app reopens the project that was open when you closed it; **Close project** (`Menu → File`) closes the project of any language.

### Memory window and zero page usage

**Tools → Machine → C64 memory map** opens the full C64 memory map in a separate, non-modal window that you can drag and resize while you keep editing (the overlap badge goes with it); × or Esc closes it. The window remembers whether it was open and its size. It follows the active tab: the block program, the assembly source, the UltimateBasic program or the C program (from the Oscar64 map).

When the program touches the zero page, a **Zero page usage** section appears at the top of the memory map: a 16 × 16 grid of `$00–$FF`, coloured by area — CPU port (`$00–$01`), free (`$02`, `$FB–$FE`), BASIC (`$03–$8F`, `$FF`) and KERNAL (`$90–$FA`). Used cells are filled; a frame marks a **write**, a hatch a **pointer** (`(zp),Y` / `(zp,X)`). Click a used cell to see which lines access it (click a line to jump there) and a warning when you write into the BASIC or KERNAL area.

If the program contains the SID Editor's exported player (`sid_` labels), the player's zero page (`$02–$1C`, `$2F`, `$FB–$FD`, and `$50–$69` when the tune in the SID Editor has two SIDs) is marked too, and every address that your own code also uses is reported as a **conflict** (red frame, warning in the header).

### Project templates

**New → From template…**, **Menu → File → New project…** or **Create a new project** in the Start window opens the template dialog:

1. Pick a section at the top: **UltimateBasic**, **C (Oscar64)**, **Visual Assembler** or **ACME**, from the easiest to the hardest; the line below them says what each language is good for (the dialog opens on the section that matches the current editor). ACME is built into the app, so the **ACME** section is always there.
2. Choose a template from the list; the right side shows its description and a syntax-highlighted preview with your project name filled in.
3. Enter the **project name** and the **location** (**Browse…**). The line below the form shows the exact `.proj` path that will be created.
4. Click **Create project**.

| Section | Built-in templates |
|---|---|
| **UltimateBasic** | Empty program, Empty game (same state machine in UB), Hires bitmap (`line` / `rect` / `circle` with `color pen`), Raster IRQ (a `sub` called every frame from the raster interrupt), Sprite multiplexer (64 sprites: eight rows of eight multicolour balls on a turning cylinder, the raster interrupt is a UB `sub`) |
| **C (Oscar64)** | Hello C64, Raster bars, Sprite and joystick, Text screen, Sprite multiplexer (16 virtual sprites with the Oscar64 `vspr_*` library), Sprite multiplexer (64 sprites, one raster interrupt per row) |
| **Visual Assembler** | Empty program, Hello World (the `.print` macro and a CHROUT loop), Empty game (title / play / game over states, joystick, player sprite), Hires bitmap, Multicolor bitmap, Sprite multiplexer (16 sprites sorted by Y every frame, shown by a raster IRQ chain) |
| **ACME** | Empty ACME project, Hello World, Raster IRQ, Sprite multiplexer (16 sprites) |

The project is created in its own folder: `<location>/<name>/<name>.proj` plus `main.asm` (Visual Assembler or ACME), `main.ub` (UltimateBasic, the `.proj` is marked as an Ultimate Basic project) or `main.c` (C, the `.proj` is marked as an Oscar64 project). An ACME project's `.proj` records the ACME assembler, and creating it switches **Settings → General → Assembler mode** to ACME mode (a Visual Assembler project switches it back to VMA mode). An existing project is never overwritten — the dialog reports it instead. Open tabs are closed first (you are asked about unsaved changes), then the new project opens in its editor (assembly source, Ultimate Basic or C) with the project panel visible and the main file set as the startup file.

**Your own templates:** **My templates folder** (bottom left of the dialog) opens the user templates folder in the app config directory. Every `.asm`, `.ub` or `.c` file dropped there appears in the matching section (an `.asm` with a `; @assembler acme` header line goes to **ACME**) (under *My templates* unless it names a category). A template is an ordinary source file with an optional header of comment lines at the top — `;` in assembler, `#` in Ultimate Basic, `//` in C:

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
- **Examples folder** opens the bundled samples folder in the file manager (it sits in the install folder). Besides the examples in the list it holds their data files, e.g. `samples/gamemaker` with the charset, map, tiles and Level Editor project of the full-screen IRQ demo.

### Load .asm file (quick reference)

The Expert-mode `.asm` loader accepts common 6502 source patterns and converts them into blocks:

- `* = $1500` → ORG block
- `Label:` → LABEL block
- `Label: .byte 0` → LABEL + BYTE blocks
- `.byte ...` → BYTE block
- `; comment` (or inline `; ...`) → COMMENT block
- instructions (`lda`, `jsr`, `beq`, etc.) → instruction blocks with detected addressing mode

#### Import parsing notes and best practices

- Local labels like `.wait` keep their dot: they belong to the nearest global label above them (see [Local (dotted) labels](https://github.com/zstarczali/VMA/blob/main/docs/VMA-Manual.md#local-dotted-labels)).
- For `($zp),Y` / `($zp,X)` style addressing, use a concrete zero-page byte (`$FB`, `$FC`, etc.) for best compatibility.
- Avoid ambiguous short labels that look like hex (`cc1`, `dead`, `beef`) in branch contexts; prefer names like `loop_cc1`.
- If your program starts with data (`.byte`) before executable code, add an explicit entry jump (for example `JMP Start`) at the top.

### Kick import (Kick Assembler)

The **Kick import** button on the Program menu ingests raw Kick Assembler source into a new block-mode tab.

**Through R65 (desktop app):** the source is first built by the built-in R65 assembler, and its build is written as VMA: the source as it is when VMA builds the same bytes from it, otherwise R65's program, with labels for the `!+` / `!-` targets, the Kick constants that the operands name, Kick macros as VMA macros (`.invoke`; a call from a `.for` stays expanded) and `.pseudopc` code with its run addresses. The status bar says which way it went and whether the bytes match R65's. When R65 cannot build the source, the conversion below runs, and the status bar says so.

The conversion without R65: It is separate from the Expert-mode `Load .asm file` above — its custom tooltip flags that **only Kick Assembler code is supported** (other assemblers may parse partially but are not guaranteed to round-trip).

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

Disassemblies made by Restore64 (KickAssembler syntax) import and build byte for byte like KickAssembler. The entry point named in their header is the first `.pc`. When the source writes its own BASIC line (`10 SYS 2061`) at `$0801` after the code, among the data blocks, that line stays at `$0801` and the program starts from its `SYS`. A program for the Plus/4 / C16 (BASIC at `$1001`, TED registers at `$FFxx`) builds the same way, but it runs only in a Plus/4 emulator such as VICE `xplus4`, not with Run.

Known limitation:

- Constants that resolve to a zero-page address (for example `.const BYTEADDR = $FC` used as `STA BYTEADDR`) currently compile to absolute-mode instructions (3 bytes) instead of zero-page (2 bytes). The compiled code still writes to the correct memory location, just with a small size and cycle overhead compared to the same source built by Kick Assembler.

#### Kick projects (Import Kick project…)

**Through R65 (desktop app):** R65 builds the project from its main file, and VA writes the result as `<name>_vma.asm` with a VMA `.proj` (startup file: that source) next to the Kick sources, which stay as they are; an existing file is overwritten only after a question. Without R65, or when R65 cannot build it, the Kick project below is made.

**Import Kick project…** (Program menu, under **Kick import**) takes a whole KickAssembler source tree — a main file with `#import` modules and `.import binary` assets — and makes a VA project of it. Pick the main file (`main.asm`); VA follows every `#import` / `.import source` / `.import binary` (also inside `.if` branches that are not taken) and writes a `.proj` next to it, named after the folder (`src` / `source` / `asm` folders use the parent folder's name). The project lists every file in its folder tree; the sources stay where they are, so an existing KickAssembler build script keeps working. Files that cannot be found are listed in the error dialog.

**Kick-compatible switch:** any VA (VMA) project can be made Kick-compatible with the **KickAssembler compatible** switch in **Project settings** (it is on for imported Kick projects). The setting is saved in the `.proj` (`"kick": true`); off, the project is a plain VMA project and builds exactly as before.

In a Kick-compatible project the VA macros and directives keep working next to the KickAssembler script: `.text x, y, "…"`, `.set_border`, LOOP / NEXT, SPRITE_INIT, `.include`, `.incbin`, `.sid`, `.define` / `.if SYMBOL` / `.else` / `.endif`, VA macros (`.macro name(p)` … `.endm` with `{p}`) and the rest go to the VA assembler as they are, with the Kick constants as numbers. Directives that exist in both are told apart by their form:

| VA (VMA) | KickAssembler |
|---|---|
| `.for X, $0A, for1` … `.endf for1` | `.for (var i = 0; i < 10; i++) { … }` |
| `.if DEBUG` … `.else` … `.endif` | `.if (expression) { … } else { … }` |
| `.macro name(p)` … `.endm`, called with `.invoke` | `.macro Name(p) { … }`, called as `Name(arg)` |
| `.var name = value` (a runtime variable) | `.var name = value` (a script variable) — in a Kick-compatible project `.var` is always the KickAssembler one |

**Live check:** while you type, errors, the cycle gutter and the peephole hints come from the tree the open file belongs to — the startup file's tree, or, for a file it does not import (say `main.asm` next to a `boot.asm` startup file), the tree of the project source that imports it. Run and Build always build the startup file.

The project builds with the VA assembler, not with KickAssembler: every build (Run, Build PRG, D64, CRT, Exomizer, Debug, VICE Monitor, Build project, the Build button) first runs the startup file through a KickAssembler preprocessor, with the editor text of open tabs, saved or not. The result is the same PRG as KickAssembler's. Supported:

- `#import`, `.import source`, `#importonce`; `.import binary` / `c64` / `text` with optional offset and length
- `.const` / `.label` in any order, with expressions; zero page or absolute addressing follows the value like in KickAssembler (`.abs` / `.zp` still force it)
- `.for (var i = 0; i < n; i++) { … }` and the one-line form, `.var`, `.eval` (`=`, `+=`, `++` …), `.if (…) { … } else .if (…) { … } else { … }` and the one-line form
- `.function Name(params) { .return expr }` and `.macro Name(params) { … }` called as `Name(args)` or `:Name(args)`
- multi-labels `!:` / `!name:` with `!+`, `!-`, `!++`, `!name+`, `!name-`
- `.pseudopc address { … }`: labels inside get the logical address, the bytes stay where they are
- `BasicUpstart2(label)` / `BasicUpstart(label)`, `* = address "segment"`, `.fill n, expr` (with `i`) and `.fill n, [a, b]`, `.align`, `.byte`, `.word`, `.dword`, `.text`
- `.assert "description", expr, true`; `cmdLineVars.containsKey(…)` / `cmdLineVars.get(…)` and `#define` symbols come from **Project settings** (KickAssembler's `:name=value` and `-define NAME`)
- `LoadBinary("file"[, template])` with `get(i)` / `uget(i)` / `getSize()`, a template such as `"C64FILE, Bitmap=$0000, ScreenRam=$1f40"` (or `BF_KOALA`, `BF_FLI`, `BF_DOODLE`, `BF_BITMAP_SINGLECOLOR`, `BF_C64FILE`) giving `getBitmap(i)` / `getBitmapSize()` per block; `LoadSid("file.sid")` with `location`, `init`, `play`, `songs`, `startSong`, `size`, `name`, `author`, `copyright`, `getData(i)` …; `.fill` with script values is expanded right away
- `* = address "name" virtual`: a virtual memory block — its labels get addresses, but no bytes are written
- `.while (…) { … }`, `i++` / `--i` in expressions, `.var name` without a value
- `*` as the program counter (`jmp *`, `bne *-1`, also inside `.pseudopc`)
- `;` between statements (`lda #1; sta $d020`, `.var a = 1; .var b = 2`): a `;` right after code, without a space, followed by a statement. Any other `;` starts a comment, as in VA, so `lda #1 ; comment` keeps working
- the math library (`sin`, `cos`, `toRadians`, `toDegrees`, `round`, `floor`, `sqrt`, `pow`, `atan2`, `log10`, `random` …), the colour constants (`BLACK` … `LIGHT_GREY`), the opcode constants (`RTS`, `LDA_IMM`, `LDA_ZPX`, `JMP_IND`, `BNE_REL` …) and `asmCommandSize()`
- `BasicUpstart2(label)` with the label anywhere the sizes reach from a `* =` (for example `* = $4000` … `start:` gives SYS 16384)
- scopes like in KickAssembler: `{ }` blocks, `.if` branches, `.for` / `.while` turns and macro calls have their own labels and constants (a `loop:` inside does not collide with an outer one; `.pseudopc` is no scope). A label before the scope makes the inner labels reachable: `name: { … }` → `name.inner`, `lp: .for (…)` → `lp[2].inner`, `myIf: .if (…)` → `myIf.inner`, `c1: Macro()` → `c1.inner`, `.label base = $1000 { … }` → `base.inner`
- `.namespace name { … }` and `.filenamespace name` (to the end of the file): the labels are reachable as `name.label`; `@label:`, `.label @x = …`, `.function @f` / `.macro @m` put the symbol in the root, and `@name` refers to the root symbol. Functions and macros are visible everywhere, also the ones of a namespace without `@`
- `.pseudocommand name a : b { … }`: called like a mnemonic (`mov #10 : $1000`, `mov src,x : ($30),y`); the arguments keep their addressing mode (`getType()` = `AT_IMMEDIATE`, `AT_ABSOLUTE`, `AT_ABSOLUTEX` / `Y`, `AT_INDIRECT`, `AT_IZEROPAGEX` / `Y`, `AT_NONE` for a missing one; `getValue()`), `CmdArgument(type, value)` makes a new one. A pseudocommand named like a mnemonic needs the colon (`:adc …`); without it the mnemonic is assembled
- the preprocessor: `#define`, `#undef`, `#if` / `#elif` / `#else` / `#endif` (with `!`, `&&`, `||`), `#importif`
- `List()` (`add`, `get`, `set`, `size`, `remove`, `sort`, `reverse`, `shuffle`, `addAll`), `Hashtable()` (`put`, `get`, `containsKey`, `remove`, `keys`), `.struct Name {a, b}` (`Name(1, 2)`, `p.a`, `.eval p.a = 3`, `getFieldNames()` …), strings (`+`, `charAt`, `substring`, `size`, `toUpperCase`, `asNumber(radix)` …, `toIntString` / `toHexString` / `toBinaryString` with a minimum size), `.enum {A, B, C = 5}`, `.define name, … { … }`, `.eval list.add(…)`, a char in `.byte` and string expressions in `.text` (in the current `.encoding`)
- `.error "message"`, `.errorif condition, "message"`; `.print` / `.printnow` output is shown in the status line (the first message and the count) and in full in **Build Info**. An `.if` that only reports (`.error` …) is skipped when its condition needs label addresses
- `LoadPicture("file"[, List().add($rrggbb, …)])` for GIF, PNG and JPG: `width`, `height`, `getPixel(x, y)`, `getSinglecolorByte(x, y)`, `getMulticolorByte(x, y)`; without a colour table the colours are taken in the order they appear. A picture name passed in a variable (`LoadPicture(filename)`) works too
- segments: `.segmentdef Name [start, startAfter, align, min, max, fill, fillByte, segments, prgFiles, sidFiles, virtual, outPrg, outBin, modify="BasicUpstart", _start]`, `.segment Name [params] "block"`, `.segmentout [segments=…]`, `.file [name=…, segments=…, allowOverlap]`, `.disk [filename=…, name=…] { [name=…, type=…, segments=…], … }`, `.memblock`. A segment without `start` begins at $2000 like in KickAssembler. **Run** starts the Default segment; when that is empty, the first PRG output (the one at $0801 first). **Build project** writes every `.file` / `outPrg` / `outBin` next to the startup file and builds the `.disk` image with c1541
- `.fillword n, expr`, `.lohifill n, expr` (with a label: `name.lo` / `name.hi`); mnemonic suffixes `.im` / `.i`, `.z` / `.zp`, `.a` / `.abs`
- `.cpu _6502NoIllegals` / `_6502` (the default, with the illegal opcodes) / `dtv` (`bra`, `sac`, `sir`) / `_65c02` (`(zp)` mode, `bra`, `phx` / `phy` / `plx` / `ply`, `stz`, `trb`, `tsb`, `rmb0-7` / `smb0-7`, `bbr0-7` / `bbs0-7`, `stp`, `wai`, `inc` / `dec` A, `bit #`, `jmp (abs,x)`); every NMOS illegal opcode with all its modes and other names (`sha` / `ahx`, `shx`, `shy`, `tas` / `shs`, `las` / `lae`, `xaa` / `ane`, `lxa`, `anc2`, `sbc2` …) — the VA assembler knows them too
- `.break ["condition"]` and `.watch address[, end][, "store"]`: breakpoints and watches in the VICE symbol file (`break` / `watch` lines, as KickAssembler writes them) and in the RetroDebugger `.dbg`; `.break` lines are breakpoints of **Debug** too
- `Vector(x, y, z)` (`+`, `-`, `*` number / dot product, `/`, `X()` cross product, `get(n)`, `getX()` …) and 4×4 matrices: `Matrix()`, `RotationMatrix(ax, ay, az)`, `ScaleMatrix`, `MoveMatrix`, `PerspectiveMatrix(z)`, `get(n, m)`, `set(n, m, v)`, matrix × matrix, matrix × vector
- `getNamespace()`; `.asserterror "name", expression` and the code forms `.assert "name", { … }, { … }` / `.asserterror "name", { … }` (the results are `.print` messages, like KickAssembler's assert report); `* - label` in a constant (`.label size = * - start`)
- `.modify` / `.filemodify` need a KickAssembler Java plugin: the block is assembled without the modifier, with a message

While you type, the whole tree is checked: errors of the open file are marked in the editor, the status line shows the first one, and the compile-error dialog names `file:line` — a click opens that file at the line. The memory map shows the built program, and the cycle gutter shows the cycles of the open file (a line unrolled by `.for` or a macro as `4×8`: one turn, eight times; a selection adds up every turn). The peephole hints mark the lines of the open file; the Disassembly and Monitor panels show the built program. The editor highlights the KickAssembler syntax (`#import`, `.segment`, script functions, `!labels`, `;` inside `.for (…)`), and completion offers the Kick directives (`.`), the preprocessor (`#`) and the script functions. Preprocessor messages appear in the language of the app. **Debug** (RetroDebugger) gets a source map with the original files and lines, readable symbol names (`scope.label`), and the breakpoints of every open project file. Binary files in the project tree are not opened as text. The Dark Chambers C64 port (19 source files, 15 binary files) and all eleven KickAssembler examples with code build byte for byte like KickAssembler 5.25.

## UltimateBasic Mode

Visual Assembler includes a complete **Ultimate Basic IDE**. Ultimate Basic is a modern compiled BASIC language for creating C64 programs, games, and demos without writing every operation in low-level 6502 assembly. The compiler runs locally and generates native C64 PRG output.

### Opening the UB editor

Open a `.ub` file or an UltimateBasic `.proj`, or choose **New → UltimateBasic program**: the tab opens in the Ultimate Basic editor. A new source begins with:

```basic
color bg 0
color border 0

print "HELLO FROM ULTIMATE BASIC"
```

The UB mode works with `.ub` source files. **Open**, **Save**, and **Save As** operate on the active UB tab; **Ctrl+N** or **+** on the tab bar opens a new source tab. Opening a `.ub` file activates the matching editor tab automatically.

The toolbar shows the current UB working folder. This folder is stored separately from the Block/Expert working folder. While UB mode is active, **File → Set working folder** selects the UB folder; its tooltip identifies the active scope. UB Open/Save dialogs start there, and unsaved sources use it as the base for relative `include` and `incbin` paths.

### Editor tools

The UB toolbar follows the same visual language, custom tooltips and button order as Expert mode: project and side panels, files, format, build, the right-hand panels, editor view, find and bookmarks, zoom; the shared buttons have the same icons. It provides:

- syntax highlighting based on the current Ultimate Basic language reference;
- line numbers that remain synchronized with long files;
- a minimap and editor zoom controls (`Ctrl` + mouse wheel also zooms); click the minimap to jump or drag its viewport selection for continuous scrolling;
- Find (`Ctrl+F` / `Cmd+F`) using the Expert-style search bar;
- source formatting with structure-aware indentation;
- autocomplete for commands and built-in functions;
- a searchable **Commands** panel with syntax, description, and usage guidance — descriptions follow the current UI language (Hungarian, English, Spanish, German, Dutch, Polish, Italian), falling back to English for anything not yet translated;
- independently toggleable **Project** and **Commands** panels, displayed side by side when both are enabled;
- independently toggleable and resizable **Build Output** and **Disassembly** panels; **Disassembly**, **Monitor** and **Toolkit** share the right-hand pane (one at a time). Which one is open and the pane widths are remembered.

The Disassembly panel includes a **Copy** button that copies its complete displayed source to the clipboard. Command help follows the bundled compiler: for example, `sprite_frame id, data_address [, frame]` selects an animation image from consecutive 64-byte sprite frames.

The editor also understands the QBasic-style syntax of Ultimate Basic 1.6.3: `dim name as type`, `function … end function`, `sub … end sub`, `elseif`, `do … loop [while | until]`, `while … wend`, `select case`, `exit do` / `exit for` / `exit while` / `exit sub` / `exit function`, the string functions `left$` / `right$` / `mid$`, and comments starting with `'` as well as `#` or `rem`. Words that the compiler treats as keywords only in one position are coloured only there and stay usable as names: `as` with the BASIC type names (`byte`, `integer`, `single`, `double`), `case is`, `map view`, `wait key` and the `scroll` options (`row`, `x`, `y`, `left`, `right`, `narrow`, `wide`). **Format** indents `function`, `do … loop`, `while … wend` and `elseif` blocks and leaves one-line loops (`do while c : … : loop`) unindented, the Project panel lists `function` blocks under Functions, and the Commands panel has **DIM**, **FUNCTION**, **ELSEIF**, **DO**, **WEND**, **SELECT CASE**, **END**, **EXIT SUB**, **LEFT$**, **RIGHT$** and **MID$** entries.

The command list is intentionally height-limited so the command-detail card can fill the remaining panel height. The detail area scrolls independently for longer syntax descriptions.

### Projects, tabs, and startup files

Ultimate Basic projects use `.proj` files and can contain multiple `.ub` sources. The Project panel lists open files, marks unsaved tabs, and shows discovered labels, functions, and subroutines. Project actions let you create, open, save, and close a project or add another source file. The Version control dialog can commit, compare and restore all files of the project together — see [Project mode](#project-mode). A new project can also start from an UltimateBasic template — see [Project templates](#project-templates).

An UltimateBasic `.proj` opened from Expert or Block mode (**Menu → File → Open project**) switches to UB mode, shows the project panel and opens the startup file (or the first `.ub` file).

Click the star beside a project file to mark it as the **startup file**. Build, Run, D64, C64 Ultimate, and Debug commands compile that startup source even if a different tab is currently active. Without a startup selection, the active UB tab is used.

The project panel toolbar has two add buttons, and file dialogs default to the **UB working folder** (Menu → File → Set working folder, UB-specific):

- **Add file** — pick one or more files at once (any type — `.ub`, `.bin`, `.prg`, images, fonts, etc.). `.ub` sources are also opened as editor tabs; anything else is added as a reference only, for `incbin`/`loadfile` assets to travel with the project.
- **Add folder** — reference a whole folder (e.g. an `incbin` asset directory like `fonts/`) so it stays associated with the project.

Folders in the tree have a collapse/expand arrow, and **right-click a folder** to add one or more files nested under it (shown indented). Every entry has a delete (✕) button; non-`.ub` entries are reference-only and are not opened by clicking them.

The **Save project** button disables itself and shows a "Saved" state once the project has no pending changes, and re-enables automatically the moment you add, remove, or reorganize a file or folder.

### Building and diagnostics

The **Build** button opens the same centered progress experience used by the other Visual Assembler run workflows. Successful builds update Build Output, Build Info, and Disassembly. The **Build Info** button next to **Build** opens the Build Info dialog of the last build (variables, arrays, subroutines and the PRG size). Enable **Verbose** to include compiler memory-map details, internal zero-page allocations, and generated code data.

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

The global **Run with Exomizer** option (**Settings → General → Program**) also applies to UB builds and normal run targets; no separate UB toolbar toggle is needed. Debugger launches deliberately use the uncompressed PRG so compiler addresses and symbols continue to match the executed program.

Enable **Settings → General → Program → Generate UltimateBasic ASM source (.asm)** to save the compiler-generated assembly beside a PRG or D64 build using the same base filename. This is a build option, so the UB toolbar does not contain separate ASM export buttons. A `load "NAME", $address` statement also supplies the matching D64 extra file's PRG load address.

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

## C Mode (Oscar64)

Visual Assembler writes C programs too, with [Oscar64](https://github.com/drmortalwombat/oscar64), an optimising C compiler for the 6502 by Martin Lemke. The compiler comes with the app (see [Compilers](#compilers-acme-oscar64)); C files are tabs of the same tab bar, with the **C** badge.

### Opening and creating C files

- **New → C program (Oscar64)** opens an empty C tab; **New → From template…** → **C (Oscar64)** creates a project (`main.c` + `<name>.proj`).
- Opening a `.c` or `.h` file, an Oscar64 `.proj`, or a folder with **Open a C folder** (Start window) opens the C editor.
- A C project opens all its `.c` / `.h` files as tabs, and an `.asm`, `.ub` file of the tree opens in its own editor.

### C editor tools

- **Highlighting** of C, the preprocessor and `__asm { }` blocks (their 6502 mnemonics too); line numbers, zoom (Ctrl + wheel), minimap.
- **Completion** (Ctrl+Space, or switched on in the toolbar): keywords, types, and the functions (with their parameters), macros, types, enum constants and variables of the file and of the headers it includes, three levels deep — from the file's folder, the project's include folders and the Oscar64 `include` folder. Not inside comments and strings.
- **Format C source** indents by brace depth (4 spaces), `case` / `default` one level out, the body of `if` / `for` / `while` / `else` without braces one level in; comments and `#` lines stay as they are.
- **Cycle counts** next to every line that has code, from the debug information of the last build.
- **Find** (Ctrl+F), **Go to line** (Ctrl+G), **bookmarks** (Ctrl+F2 sets, F2 / Shift+F2 jumps), **Build info** (address, size, symbols), **Save** (Ctrl+S) and **Save as**.
- After you stop typing, the program is built quietly in the background, so errors, cycle counts and the views stay current.

### C projects, build scripts and the startup file

The project tree on the left shows the project folder. Its toolbar creates files and folders and opens a project folder; the right-click menu opens, renames and deletes, and **Set as startup file** marks the file (★) that **Build** and **Run** compile, whatever tab is active. A file outside the project builds itself. Below the tree a list shows the functions, types and macros of the open file; click one to jump to it.

**Project settings** (the gear button of the tree, or **Menu → Project settings…** while a C file is active) edits the project's `.proj`:

- **Name** and **Startup file** (any `.c` file of the project).
- **Optimization** — O0, O1, O2, O3 or Os for this project; **As in Settings** uses the level of **Settings → Compilers**. A build script program's own `-O` switch still takes precedence.
- **Defines (-d)** — one `NAME` or `NAME=value` per line, the same as `#define NAME value` at the top of every file.
- **Include folders (-i)** — one folder per line, relative to the project folder; `#include` and code completion search them. The project folder itself is always searched.
- **Build script** — how many programs came from the build script; their own switches come on top of these.

A folder with a `build.sh`, `make.bat` or `makefile` but no Oscar64 `.proj` becomes a project from that script (also **Load project from build script** in the tree): every `oscar64` call of the script — through `cd`, sub-scripts and makefile rules — becomes a program of the project, marked ◆ in the tree. Double-click one to make it the startup file; its own switches (`-O…`, `-n`, `-d…`, `-i=…`) are used, output switches (`-tf=`, `-d64=`, `-o=` …) are skipped and reported.

### Building, running and views

**Build** (Ctrl+B) compiles the startup file (or the open file) with Oscar64; errors and warnings show in **Output** with their file and line — click one to jump there. With Settings → Compilers → *Verbose compiler output* on, **Output** also lists the compiler's steps (Oscar64 runs with `-v`): the files compiled and included, the passes and the files written. The other views below the editor:

- **Disassembly** — the compiler's own listing, C lines with the 6502 code made of them.
- **Monitor** — the memory of the program as a hex dump.
- **Map** — the sections and symbols of the compiler's map file.

A C program runs in every Run mode — VICE, D64, built-in C64, C64 Ultimate, Ultimate emulator, Kung Fu Flash 2 — and shows in the memory map. **Debug** starts the source-level debugger, see [Source-level debugging](#source-level-debugging-c-and-ultimatebasic).

## 6. Expert Mode

Expert Mode is a full-featured direct-text 6502 assembly editor that lives alongside the block editor. Every assembly tab can be in either Block mode or Expert mode — you switch between them freely at any time using the **Blocks | Source** switch in the top bar.

### Switching modes

- **Block → Expert:** the current program is serialised to text (one instruction per line, labels, macros as directives). Edits in Expert mode are synced back to the block array whenever you switch back or trigger an action.
- **Expert → Block:** the text is parsed and the result replaces the block program. A compile-error dialog is shown if parsing fails.
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
| **Save .asm** | `#expert-save-asm-btn` | Save editor content to a `.asm` file (file dialog on first save). A source file always gets its text: Ctrl+S, **Menu → Save**, and a Save dialog given an `.asm`, `.s`, `.inc`, `.a`, `.a65` or `.lib` name never write the VA JSON into it |
| **Build Info** | `#expert-build-info-btn` | Open the Build Info dialog: origin, end, size and segment count on top, then the segments, errors (`file:line` in a Kick project) and `.print` output, and the labels, constants and macros in columns |
| **Autocomplete** | `#expert-autocomplete-btn` | Toggle expert autocomplete suggestions on/off. When disabled, no directive, mnemonic, or label popup appears in the expert editor. |
| **Region selection** | `#expert-region-selection-btn` | Toggle the automatic region highlight in Expert mode. The fold state stays stored, but when this is off the editor keeps the full source visible and does not auto-select the current region. |
| **Collapse / expand all regions** | `#expert-region-fold-all-btn` | Fold or unfold every `.region` block in one click. If any region is currently open, the button collapses them all; if every region is already collapsed, the next click expands them all. The button lights up when all regions are collapsed. |
| **Line numbers** | `#expert-line-numbers-btn` | Toggle the line number gutter on the left side of the editor. The gutter stays in sync with the scroll position and updates live as you type. |
| **Find** | `#expert-find-btn` | Open the floating Find bar (`Ctrl+F`). Type to search; matches are highlighted in the overlay. `Enter` / `Shift+Enter` navigate between matches. `Escape` closes the bar. |
| **Zoom out / in** | `#expert-zoom-out-btn` / `#expert-zoom-in-btn` | Decrease / increase the editor font size (8–28 px). `Ctrl` + mouse wheel (`Cmd` + wheel on macOS, or a touchpad pinch) over the editor does the same. The setting is persisted. |
| **Palette** | `#expert-palette-btn` | Show/hide the left mnemonic palette |
| **Disasm** | `#expert-disasm-btn` | Show/hide the disassembly panel (pure 6502, macros expanded) |
| **Monitor** | `#expert-monitor-btn` | Show/hide the monitor hex-dump panel; drag the divider on its left to resize it |
| **Toolkit** | `#expert-toolkit-btn` | Show/hide the [Toolkit](#toolkit-tab) side panel (C64 palette, PETSCII codes); resizable like the Monitor |
| **Minimap** | `#expert-minimap-btn` | Show/hide the code minimap strip on the right side of the editor |
| **Project panel** | `#expert-project-btn` | Show/hide the project panel (files, symbols, project settings) |
| **Cycle counts** | `#expert-cycles-btn` | Show/hide the cycle gutter — see [Cycle counts](#cycle-counts) |
| **Go to line / Bookmarks** | `#expert-goto-line-btn`, `#expert-bookmark-*` | Ctrl+G jumps to a line; Ctrl+F2 toggles a bookmark, F2 / Shift+F2 go to the next / previous one |
| **Build ACME** | `#expert-acme-build-btn` | In ACME mode: build the source with ACME — see [ACME mode](#acme-mode) |

The buttons are grouped from left to right: project panel · palette and palette sync · Load / Save / Save as · Format · Build ACME / Build Info · Disasm / Monitor / Toolkit · autocomplete, line numbers, cycle counts, minimap, regions · Find, Go to line, bookmarks · zoom. The UltimateBasic toolbar uses the same order and icons (its build group: Build, Build Info, Explicit, Verbose).

The panels you leave open (Palette, Disasm, Monitor, Toolkit, Project) and their widths are restored on the next start, whichever mode the app starts in.

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

The editor uses a transparent `<div>` overlay (`expert-hl`) that mirrors the textarea content with coloured `<span>` elements.

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
- Each file in the project opens as a separate **tab** in the tab bar at the top of the editor; the open tabs, views, breakpoints and the cursor come back from `<name>.proj.user` (see [Project session (.proj.user)](#project-session-projuser)).
- The project has one language: a `.ub` or `.c` file cannot be added, and one already in the folder opens in its own editor.
- **Close Project** (`Menu → File → Close project` / `#menu-close-project`) closes the current project and all its file tabs at once. Prompts to save any unsaved changes before closing. The project panel resets to its empty state.
- Each file can be marked as the **startup file** (★ star icon). When a startup file is set, the **Run** button (PRG, D64, Ultimate) always assembles and runs that file's code — regardless of which tab is currently active. This works in both block mode and Expert mode.
- The toolbar's **Add** button picks one or more files at once (any type, not just `.json`/`.asm`) and references them in the project without opening them — use it for binary assets like `incbin` data. Its dialog defaults to the VA working folder. The adjacent **Add folder** button references a whole folder (e.g. an asset directory) the same way. Reference-only entries show a delete (✕) button but are not opened by clicking them.
- **Project settings** (the gear button in the panel header, or **Menu → File → Project settings…**) shows and edits the project: name, `.proj` path, startup file, assembler (VMA or ACME), **KickAssembler compatible**, and for a Kick project the preprocessor symbols (`#define`, like KickAssembler's `-define`) and the command-line variables (`cmdLineVars`, one `name=value` per line, like `:name=value`), for a VMA project its symbols (`.define`) and constants (`.const`, one `NAME=value` per line) — they come before the source the project builds, so `.if NAME` / `.if NAME == 3` switch a build without editing the source — plus the number of source and other files, and **Expert mode only**: block mode is closed for the files of the project, whatever their size. Everything is saved in the `.proj`.
- Folders in the tree have a collapse/expand arrow, and **right-click a folder** to add one or more files nested under it (shown indented).
- A file that VA does not open itself (a picture, a PDF, a PRG …) opens with its default app on a double-click or with **Open with default app** in the right-click menu. A Koala picture (`.koa`, `.koala`) opens in the **Hi-Res editor** on a click instead, and a charset in the **Char editor**: a `.64c`, `.chr` or `.fnt` file, or a `.bin` of at most 2 KB whose name or folder says *font* or *char* (a load address in front of it is dropped). The right-click menu of files and folders also has **Show in Explorer** (Windows), **Show in Finder** (macOS) or **Show in file manager** (Linux).
- The **Save project** button disables itself and shows a "Saved" state once the project has no pending changes, and re-enables automatically the moment you add, remove, or reorganize a file or folder.
- The **symbols** section at the bottom of the project panel can be resized vertically with the divider between the file tree and the symbols list, so long symbol lists can take more space when needed.
- **Version control** works for the whole project: with the **Project** switch of the Version control dialog one commit records every project file, and Checkout restores them all into the tabs. See [Project mode](#project-mode).

### Tab bar

The tab bar appears above the editor when there is more than one tab open.

| Feature | Description |
|---------|-------------|
| **Dirty dot** | A small accent-coloured dot on the tab name indicates unsaved changes: the text differs from the saved file |
| **Scroll arrows** | Left/right scroll buttons appear when there are more tabs than fit the bar |
| **Close (×)** | Closes the tab; prompts to save if the tab is dirty |
| **File extension** | The full filename including extension (`.vas`, `.asm`, `.ub`, `.c` …) is shown |
| **Language badge** | **BLK**, **ASM**, **UB** or **C**: the editor the tab opens in |
| **Ctrl+N** | Opens a new, empty tab (not while a modal dialog is open) |
| **Right-click menu** | Right-click a tab (or empty tab-bar space) for: **New tab**, **Close tab**, **Close other tabs**, **Close tabs to the right**, **Close all tabs**. Batch-close operations prompt per dirty tab and stop if you cancel. **Close all** always keeps one empty tab. |

> **Tip:** Palette sync (`#expert-palette-sync-btn`) keeps the palette selection in sync with the mnemonic at the cursor. Disable it when you prefer not to have the palette jump around as you edit.

### ACME mode

**Settings → General → Assembler mode** selects the assembler of the Expert editor:

- **VMA mode** (default) — the built-in Visual Assembler assembler with its blocks, macros and `.` directives.
- **ACME mode** — the source is ACME 0.97 text and is built by ACME: the one built into the app, or your own set in **Settings → Compilers** (**Choose ACME**). `ACME-0.97-reference.pdf` describes the language.
- **R65 mode (KickAssembler)** — the source is KickAssembler text (script language, `#import`, `.pseudopc`, `BasicUpstart2` …) and is built by R65, the KickAssembler-compatible assembler built into the app; nothing needs to be installed. A project builds its startup file, and R65 reads the `#import` files itself. Everything below about ACME holds for R65 too, and R65 writes its own `.dbg` as well. About shows the R65 version.

The mode is saved with a `.proj` project, so every project opens with its own assembler. ACME mode is text editing only: the **Blocks** view is disabled, and the **Tutorials** button is hidden (the lessons build VMA programs from blocks).

What follows the ACME build:

- **Build** (the hammer button in the Expert toolbar, *Build ACME source*), **Run** (PRG, D64, C64 Ultimate, Ultimate emulator, Kung Fu Flash 2), **Build PRG**, **Build D64**, **Build CRT**, **Build project** and **Debug (RetroDebugger)** compile through ACME; ACME errors and warnings open in the normal compile-error dialog, with the source line.
- After a typing pause the source is rebuilt, so the **memory map** (memory strip, segment panel, overlap warning), the **Disassembly** and **Monitor** panels and the cycle gutter show the real ACME output; the panels use the ACME labels. An overlap is an address that two source lines write (the later one wins in the PRG).
- **Debug files** (*Generate debug files* in Settings → General) are made from the ACME label dump: `.sym` (KickAssembler style) and `.vs` (VICE labels) next to the PRG; there is no `.dbg` source map in ACME mode. **Debug (RetroDebugger)** gets the same labels, and the Expert breakpoints are placed by the ACME report (a breakpoint on a line without code stops at the next code line).
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

`samples/ACME/acme-crt-demo.asm` is a small ACME test program for Run, Build PRG / D64 and Build CRT: a message in the middle of the screen and raster colour bands in the border, without KERNAL calls, so it also runs from the cartridge.

---

## 7. Assembler Language and Macros

The language of Visual Assembler is **VMA** (Visual Macro Assembler): Block mode, Expert mode and the ASM view all hold VMA source, and the built-in Rust VMA compiler builds it. Its full reference is kept in one place, the **VMA manual**:

- [VMA Manual (English)](https://github.com/zstarczali/VMA/blob/main/docs/VMA-Manual.md) · [VMA kézikönyv (magyar)](https://github.com/zstarczali/VMA/blob/main/docs/VMA-Manual.hu.md)
- online at [c64va.pro/docs.html](https://www.c64va.pro/docs.html), under **VMA**

It covers:

- the source format, numbers and expressions, the PRG output, the BASIC stub and the entry point;
- the addressing modes, zero page constants, label expressions as operands, the `*` program counter, local (dotted) labels and self-modifying-code operand labels;
- the 6502 instructions, the illegal opcodes and the long branches (`LBNE`, `LBEQ` …);
- every directive and macro (`BYTE`, `TEXT`, `INCBIN`, `SID`, `LOOP`, `MACRO`, `IF`, `CONST`, `SPRITE_INIT`, `JOYSTICK`, `REU_STASH`, `U64_PALETTE` …) with its syntax and the code it generates;
- the KickAssembler-style syntax and the command-line compiler.

### Macros in Block mode

Every macro of the reference is also a block on the palette (see [2. Block Palette](#2-block-palette)). The block shows the macro's parameters as fields (numbers, addresses, text, checkboxes such as *Lowercase charset*), and the ASM view shows the code it generates. A block and its Expert-mode line are the same thing: switching modes converts one into the other, so the fields hold what the VMA manual describes as the macro's parameters. The description panel under the palette gives a short help for the selected block.

---

## 8. Debugger Integration

The app supports **RetroDebugger** as the external C64 debugger. It receives breakpoints, symbols, and autostart flags generated from the assembled program.

### RetroDebugger

[RetroDebugger](https://github.com/slajerek/RetroDebugger) is a cross-platform Commodore 64 debugger with breakpoint support, memory inspection, and label-aware disassembly.

**Setup:** in **Settings → Files and paths → Retro Debugger** point to the `RetroDebugger` binary.

**Launch:** Click **Debug (RetroDebugger)** in the toolbar. The app will:

1. Assemble the program to a `.prg` file in a temporary directory.
2. Write a **breakpoints file** — the address of every breakpoint block and Expert breakpoint line.
3. Write the **symbols** in VICE / RetroDebugger label format (`al C:addr .name`): labels, constants and variables.
4. Write the C64Debugger-style sidecars next to the PRG: `.dbg` (source map), `.sym` and `.vs`.
5. Start RetroDebugger with the PRG, the breakpoints, the symbols and the flags below.

### Breakpoint Blocks

Click the breakpoint icon (●) on any instruction block to toggle it as a breakpoint. Breakpointed blocks are highlighted in red. Their addresses are written to the breakpoints file on every debugger launch.

### Debugger flags

These are in **Settings → General → RetroDebugger**.

| Toggle | Flag | Effect |
|--------|------|--------|
| `-jmp` ON | `-jmp $ADDR` | Jump directly to the program start address after loading |
| `-unpause` ON | `-unpause` | Unpause the debugger immediately on load |
| `-wait` ON | `-wait <ms>` | Wait `<ms>` milliseconds before unpausing — 500 ms or 1000 ms |

> **Tip:** For most programs, enable `-jmp` and `-unpause` for instant autostart. Use `-wait 500` or `-wait 1000` when your program sets up IRQs or SID music that needs time to initialize before the first raster.

### VICE Monitor (hot reload, live watch, profiler)

The **VICE Monitor** toolbar button opens a non-modal window that talks to the running VICE through its binary monitor. **Run (VICE)** starts VICE with the monitor on port 6502 (**Settings → Files and paths → VICE Emulator → VICE remote monitor**, on by default). Close and restart a VICE that was started another way. The header shows the connection state; *Only available in the desktop app* appears in the browser preview.

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

## 9. Knowledge Base Links

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
| Restore64 Disassembler (C64 PRG → KickAssembler / ACME source) | https://restore64.dev/ |

---

### Built-in C64 and debugger

The app contains a complete C64: VICE 3.10 (x64sc) compiled to WebAssembly. It needs no installation and no settings, and it works without an external VICE.

**Starting a program:** choose **Built-in C64** in the split **Run** menu, then press **Run**. The program is built, the machine gets a hard reset and the program starts: `RUN` for a program with a BASIC line at `$0801`, otherwise `SYS` with its load address. The toolbar button opens the window without running anything; the first button of its toolbar builds and runs again.

**The keyboard** goes to the C64 while the screen has the focus (click it). **Tab** is CTRL, **Alt** is the Commodore key, and you can paste text with Ctrl+V. With a **Joystick** port selected the arrow keys and Space or right Ctrl are the joystick.

**The Files menu**

| Item | What it does |
|---|---|
| **Load PRG…** | Starts a `.prg` with autostart |
| **Attach D64…** | Attaches the image to drive 8, resets, then `LOAD"*",8,1` and `RUN` |
| **Attach cartridge…** | Attaches a `.crt` and resets |
| **Detach disk / Detach cartridge** | Removes the image; detaching a cartridge also resets |

The status bar shows what is attached and the LED of drive 8 with the track of the head. The LED stays lit during a load. A blinking LED means the drive reports an error, such as a file it cannot find or read: the LED turns red and the status bar says **Drive error** until the drive clears it. Attached files are not remembered. Running your own program from the editor removes an attached cartridge first, otherwise the cartridge would start instead.

**Machine settings** on the toolbar:

| Setting | Values | Note |
|---|---|---|
| **Video** | PAL, NTSC | Hard reset |
| **SID chip** | 6581, 8580 | Applies at once |
| **SID engine** | reSID, FastSID | Applies at once. The VA SID Core is not available here: this machine uses the SID engines of VICE |
| **REU** | Off, 128 KB – 16 MB | Hard reset |
| **Joystick** | —, Port 1, Port 2 | |

The toolbar also has **Reset**, **Pause**, **Warp**, **Sound**, **CRT filter** and **Full screen**. The CRT filter uses the CRT emulation of VICE, smooth scaling and scanlines; the scanlines appear once a C64 line is at least 3 pixels high. Full screen also starts with a double click on the screen, and Esc or another double click leaves it. The window can be moved by its header and resized at its bottom right corner. Its place, size, open state and settings come back on the next start.

**Debugging:** press **Debug** while the run mode is **Built-in C64**. The Debug button also uses this debugger in the real hardware modes when **Visual Assembler** is the chosen debugger. It works with VMA, Kick projects, ACME, Ultimate Basic and C (Oscar64) alike. The program stops at the first breakpoint it reaches, or at its first instruction if there are no breakpoints. Closing the window or hiding the debugger panel ends the session: the breakpoints go, and a stopped program runs on (in a closed window once it is opened again). The Ultimate emulator and VICE debugger windows do the same when closed.

**Choosing the debugger:** **Settings → General → Debugger → Debug button** is **Visual Assembler** or **RetroDebugger**. **RetroDebugger** can only be selected once its path is set in **Settings → Files and paths**; never chosen, it is RetroDebugger when one is configured, else Visual Assembler. **Visual Assembler** debugs on the machine of the run mode: in your own VICE (*Run as PRG*, *Run via D64*), on the Ultimate emulator, or on the built-in C64 (also for the real hardware modes, C64 Ultimate and Kung Fu Flash 2). **RetroDebugger** opens the external program for the VICE and hardware modes. The *Built-in C64* and *Ultimate emulator* run modes always use their own debugger.

**Debugging in VICE:** with **Visual Assembler** chosen, **Debug** in the *Run as PRG* and *Run via D64* modes opens the same debugger window for your own VICE installation: VA starts VICE with its binary monitor (the **VICE monitor port**, default 6502), or uses the one already running there, arms the breakpoints and autostarts the program, which stops at its first instruction if there are no breakpoints. Breakpoints, step into / over / out, registers, disassembly and memory work as in the built-in C64, and the editor follows the CPU. Closing the window lets the program run on in VICE. With **RetroDebugger** chosen, the VICE modes open RetroDebugger as before.

The CPU stops **before** the instruction at the breakpoint, so the registers and memory show the state just before it runs.

| Button | Key | What it does |
|---|---|---|
| **Continue** | F5 | Runs to the next breakpoint |
| **Break** | F5 while running | Stops a running program |
| **Step into** | F11 | Runs one instruction |
| **Step over** | F10 | Runs a JSR to its return |
| **Step out** | Shift+F11 | Runs to the instruction after the RTS / RTI of the routine |

The keys work while the focus is in the window but not on the C64 screen, because F5 is also a C64 key there.

The **Debugger panel** shows:

- **Registers:** PC, A, X, Y and SP are editable hex fields, and the flags are buttons. Changes take effect when the CPU goes on.
- **Disassembly** around PC, with the labels of your program. Click the dot at the start of a line to set or remove a breakpoint.
- **Memory:** type an address as `$hex`, a decimal number or a label. Reading has no side effects, so looking at `$DC0D` does not acknowledge an interrupt.
- **Breakpoints:** the address and the `file:line` of each one.
- **Call stack** and **Variables** — see [Source-level debugging](#source-level-debugging-c-and-ultimatebasic).

Breakpoints come from the line gutter of the editor (every open tab of the build), from Block-mode breakpoints and from the disassembly. A change in the editor counts at the next Continue or step. When the CPU stops, the editor opens the file and marks the line; in Block mode the block is selected.

The **VICE Monitor** window keeps working with an external VICE only; it does not connect to this machine.

### Source-level debugging (C and UltimateBasic)

The debugger of the built-in C64 and the VICE / Ultimate emulator debugger window follow the source of a C or UltimateBasic program, not only its 6502 code:

- **Breakpoints** are set in the line gutter of the C or UB editor; when the CPU stops, the editor opens the file and marks the line.
- **Stepping in C and UltimateBasic:** **Step into** and **Step over** run one whole source line (as many 6502 instructions as it takes); in library / runtime code without source they step out of it. A breakpoint stops the step. In assembly a step is one instruction.
- **Variables:** in C the program's own globals and, inside a function, its parameters and locals (only within the lines where they live), shown by their type: int, unsigned, float, pointer, array (a `char` array as text), struct. For this the **Debug** build is compiled without optimisation (`-O0`); a program that does not fit that way is debugged with the optimised build, and its locals are not shown. In UltimateBasic: bytes, words, signed integers, 5-byte floats and arrays. An array or a struct opens with a click (▸ / ▾): its elements or members follow one level in, each with its own value (an UltimateBasic array byte by byte). Click a variable to show its bytes in the memory view.
- **Call stack:** the stop, then every return address on the 6502 stack that follows a `JSR` of the program — named by C function, UltimateBasic `sub` or label, or assembly label. Click a line to open its source line. It works in assembly programs too.

The VICE / Ultimate emulator debugger window has the same panels in the same single column as the built-in C64's debugger, with the status of the session at the bottom.

## 10. D64 Export & Run

You can package your program (and additional data files) into a C64 D64 disk image and launch it in VICE — or export the disk image for use elsewhere.

### Split Run button

The toolbar **Run** button is a **split button**:

| Part | Action |
|---|---|
| **▶ Run** (main) | Executes the currently selected run mode |
| **▾** (arrow) | Opens the mode selector |

**Available run modes:**

| Mode | Description |
|---|---|
| **Run as PRG** | Assemble to a temporary `.prg` and launch VICE directly. Classic behaviour. |
| **Run via D64** | Assemble, build a `.d64` disk image (using c1541), add any configured extra files, then launch VICE from the disk. Use this whenever your program loads files at runtime (e.g. with the LOADFILE macro). |
| **Run on hardware** | Assemble to PRG and send it to a **1541 Ultimate / Ultimate 64** device over the local network. See [Section 11](#11-settings). |
| **D64 on hardware** | Build a `.d64` (like Run via D64) and send it to the **1541 Ultimate / Ultimate 64**, which mounts and runs it. |
| **Kung Fu Flash 2** | Assemble to PRG and upload it over USB serial to a real C64/C128 with a **Kung Fu Flash 2** cartridge. See [Kung Fu Flash 2](#kung-fu-flash-2). |

The menu lists only the modes whose tool is set: VICE for the first two, the device address in **Settings → Integrations** for C64 Ultimate, the port (detected at startup, or set there) for Kung Fu Flash 2, the program, firmware and ROM folder for the Ultimate emulator. The **Built-in C64** is always there.

The selected mode is saved between sessions. If its tool is missing, Run uses VICE or the built-in C64, and the saved mode comes back once the tool is set.

### Export to D64 dialog

Open it with **Menu → Build → Build D64** (Run via D64 opens it too). The dialog lets you:

1. Set the **disk name** (max 16 chars) and **program name** — these are the names that appear in the C64 disk directory.
2. **Add extra files** — click **+** to pick any binary file (`.prg`, `.bin`, `.sid`, etc.). For each extra:
   - **Name** — how it appears in the D64 directory (max 16 chars, auto-uppercase).
   - **Addr** (load address, optional) — if provided, a 2-byte PRG header is prepended. Leave empty to write raw bytes with no header.
   - **Dst** (decompression target, only with EXO) — where the depacker should land the data on the C64. When EXO is enabled, the extra is compressed with `exomizer mem -l <Addr> file@<Dst>` (a raw file at the Dst address) before being written to the D64.
   - **EXO** — checkbox that turns on backward `mem`-mode crunching for this entry. The on-disk size is typically 5-20% of the original.
3. Click **Export** to generate the `.d64` file using VICE's `c1541` tool.

**Pairing with EXODECRUNCH:** when you ship a file with EXO=on, the program reading it should LOAD it to the **Addr** address (sec=1, file's own PRG header), then call the **EXODECRUNCH** macro to unpack it backward into **Dst**. See the `exo-multicolor-demo` sample for the complete pattern.

### D64 metadata in projects

The disk name, program name, and extra file list are saved inside the project JSON (under the `d64` key). When you reload the project or a sample that includes D64 metadata, the extras are restored automatically — no need to re-add them each time.

The **loadfile-demo** sample comes pre-configured with `DEMO-COLORS.PRG` as an extra file. Select it, open **Run via D64**, and click **Run** to see the full load flow in action.

> **Requirement:** D64 export and Run via D64 both require VICE (`c1541`) to be configured in [Settings → Files and paths](#11-settings).

### D64 Editor (browse & edit an existing disk image)

The toolbar icon after the Table Generator opens the **D64 Editor** — a standalone tool for working with an existing `.d64` image directly, independent of the currently open program. Unlike the Export to D64 dialog above (which always builds a *new* disk from the compiled PRG), the D64 Editor edits a disk image in place via `c1541`, so it doubles as a lightweight disk manager.

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

> **Requirement:** like Export to D64, the D64 Editor requires VICE (`c1541`) configured in [Settings → Files and paths](#11-settings).

---

## 10b. CRT Export (Magic Desk 64K cartridge)

**Menu → Build → Build CRT** produces a Commodore 64 cartridge image (`.crt`, **cartridge type 19 — Magic Desk / Domark / HES Australia**) that runs on VICE, TheC64, real hardware via EasyFlash / Kung Fu Flash, and 1541 Ultimate II+ cartridge slots. It is available in **block mode**, **Expert mode** and **UltimateBasic mode**.

### What ships in the cart

- **8 × 8 KB banks** at `$8000`, bank-switched via `$DE00` (Magic Desk convention: low 3 bits = bank, bit 7 = disable cart).
- **Bank 0** contains a 128-byte header + boot loader:
  - `$8000/$8002` cold + warm start vectors point at `$8009`.
  - `$8004–$8008` = the `CBM80` signature required by the KERNAL reset code.
  - `$8009–$807F` = the loader: SEI / stack init / `JSR $FDA3` (IOINIT) / `JSR $FD50` (RAMTAS) / `JSR $FD15` (RESTOR) / `JSR $FF5B` (CINT), then it copies the 60-byte **copy routine** (`$8044–$807F`) to `$0100` and jumps there. Running from RAM, the routine streams the payload from cart ROM to its load address, switches banks through `$DE00` when `$FC` reaches `$A0`, disables the cart with `LDA #$80 : STA $DE00`, and `JMP`s to the entry point. (It must run from RAM: a bank switch replaces the ROM under `$8000`, the loader’s own code included.)
- **Payload** starts at `$8080` in bank 0 and spills into banks 1–7 as needed. Maximum payload = `8 * 8192 − 128 = 65 408 bytes`.

### Load address and entry point

Build CRT never uses Exomizer (the depacker cannot run from cart ROM). It compiles the current tab with the standard autostart pipeline and takes the load address from the PRG header and the entry point from the SYS target:

- **Block / Expert mode with BASIC SYS stub on:** load = `$0801`, entry = the SYS target (typically `$080D` or the user’s origin).
- **Block / Expert mode with BASIC SYS stub off:** load = user origin (with the classic `$0801 → $C000` fallback), entry = load address.
- **UltimateBasic mode:** load and entry both come from the UB compiler map (`build.map.loadAddress`). The UB autostart stub inside the payload is then executed exactly as it would be after `LOAD "...",8,1 : RUN` from disk.

The origin address you see in the ASM output is preserved; the loader simply copies the flat memory image from the PRG into RAM and jumps to the entry point once cart ROM is unmapped.

### Size limit

Because the payload is stored linearly — one flat image from the lowest to the highest address, with zero-filled gaps — a program with widely spaced ORG segments (e.g. `$0801` + `$C000` + `$E000`) counts every byte in between toward the 65 408-byte budget. If you exceed the limit the build aborts with an error — either compress the memory layout or split the data.

> **⚠️ Prominent caveat — read before shipping a CRT**
>
> The loader calls the KERNAL **`RESTOR` ($FD15)** as part of the standard reset sequence. This intentionally rewrites the standard I/O vectors at `$0314/$0315`, `$0316/$0317`, `$0318/$0319`, `$0328/$0329` and friends back to their ROM defaults. Consequences:
>
> - **Any IRQ / NMI / BRK hooks set before the CRT boots are wiped.** Your program must install them itself after entry — exactly like a fresh `LOAD "",8,1 : RUN` from tape/disk.
> - **UltimateBasic programs** that rely on non-default KERNAL vectors being live at entry may need an explicit `SYS` or init call in the autostart stub. The standard UB autostart works out of the box; extension libraries that hook vectors *before* `RUN` do not.
> - **CIA1 / CIA2** are re-initialised by `IOINIT`. Custom timer setups (raster IRQs, music player CIA-A) must be reprogrammed after entry.
> - The copy routine runs from **RAM at `$0100–$013B`**, so the bank switches and the final `STA $DE00` never pull the code from under the CPU. Do not rely on `$0100–$013B` on entry, and keep the payload out of that range and out of the zero page bytes `$02–$04` / `$FB–$FE` the loader uses.
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

## 11. Settings

Open via **Menu → Settings…** (formerly *Hardware Settings*). The dialog has four tabs: **General** (assembler mode, VMA compiler, BASIC SYS stub, Run with Exomizer, ASM output, SID preview, debugger choice and C64 Debugger parameters, snapshots / version control), **Files and paths** (VICE, RetroDebugger, update server, Exomizer, git), **Compilers** (ACME, Oscar64) and **Integrations** (C64 Ultimate, Ultimate emulator, Kung Fu Flash 2). The sections below describe the external tools and devices.

### VMA compiler

Every VMA (and Kick project) source is built by the open-source [VMA compiler](https://github.com/zstarczali/VMA), written in Rust and built into the app: Run, Build, D64, CRT, the debugger and every live view (disassembly, monitor, memory map, cycle gutter, hints, ASM view) use the same build. There is no compiler setting any more (until 2.7.7 the app also had a JavaScript compiler). Building needs the desktop app. The VMA version is shown in the About box.

The same compiler runs on the command line (VMA 2.1.0 and later): `vma build game.asm` writes `game.prg`, `--crt game.crt` a Magic Desk cartridge (the same bytes as **Build CRT**), and `--d64` a 1541 disk image with the program (`--add` puts further files on it) — no c1541 needed. See the manual in the [VMA repository](https://github.com/zstarczali/VMA).

### Compilers (ACME, Oscar64)

ACME 0.97 and Oscar64 (v1.32.273) come with the app, so ACME mode and C programs need no installation. On the **Compilers** tab **Choose ACME** / **Choose Oscar64** sets your own executable instead, and **Use bundled** switches back (a path that no longer exists falls back to the bundled one). **Optimization** (O0, O1, O2, O3, Os; O2 by default) is the level of every Oscar64 build; a build script's own `-O` switch takes precedence. The ACME switches apply to every ACME build: **Verbose assembler output** (`-v2`), **Treat warnings as errors** (`--strict`), **Type checking** (`-Wtype-mismatch`) and **No warnings about indented labels** (`-Wno-label-indent`); ACME's output and warnings appear in **Build info**. VMA is built into the app: what a VMA build makes is set on **General → Program** (BASIC SYS stub, debug files, Run with Exomizer); the **VMA** section shows its version, and **Verbose build report** adds VMA's report to **Build info → Compiler output** (the source's lines and included files, the number of symbols, constants, macros and defines, the lines skipped by conditional assembly, the BASIC stub, the entry, every segment and the PRG's size and load address; the same as `vma build -v`). The About box shows both versions; the licences are in `THIRD_PARTY_NOTICES.md`.

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
2. Configure the path in **Settings → Files and paths → Exomizer**.
3. Enable the **Run with Exomizer** checkbox in **Settings → General → Program**.
4. All **Run** actions (PRG, D64, hardware) and **Build** actions (Build PRG, Build D64) will now crunch the assembled program through `exomizer sfx` before launching or saving: `sfx basic` when the PRG starts with a BASIC line (after decrunching, RUN starts the original `SYS` line, so a second RUN works too), `sfx $<load address>` otherwise.

Exomizer works the same way on Windows and macOS — the CLI is invoked from the Tauri backend; nothing about the integration is platform-specific.

**Two compression modes are used internally:**

| Mode | Used by | Calling convention |
|------|---------|--------------------|
| `sfx basic` / `sfx $<addr>` | Build/Run with Exomizer toggle (main PRG path) | Self-extracting PRG with a built-in decruncher; the Border-flash setting controls `-x1` vs `-n` |
| `mem` (backward) | Run via D64 → per-file **EXO** checkbox | Compresses each extra file to a `mem`-mode stream; the program decompresses it at runtime via the **EXODECRUNCH** macro and a pre-built depacker (`samples/exo-decrunch.bin`) |

> **Tip:** If the Exomizer path is not configured but the checkbox is enabled, a clear error toast is shown instead of launching. Disable the checkbox to run without compression.


### Retro Debugger

| Setting | Description |
|---|---|
| **Select RetroDebugger** | Browse to the `RetroDebugger` binary |
| **Status** | Shows whether the path is valid |

See [Section 8](#8-debugger-integration) for full debugger documentation.

### C64 Ultimate / 1541 Ultimate

Run assembled PRGs directly on real hardware over the local network using the Ultimate REST API.

| Setting | Description |
|---|---|
| **Host (IP)** | IP address of the device (e.g. `192.168.1.100`) |
| **Password** | Optional — if the device requires authentication |

**Workflow:**
1. Connect the 1541 Ultimate / Ultimate 64 to your local network.
2. Enter its IP address (and password if set) in **Settings → Integrations → C64 Ultimate**.
3. Select **Run on hardware** from the split run menu.
4. Click **▶ Run** — the PRG is compiled and sent to the device via HTTP POST to `/v1/runners:run_prg`. The device loads and runs it on the C64 immediately.

**Without hardware:** select **Ultimate emulator** from the split run menu to run on [UE2-C64U-Emulator](https://github.com/Jondalar/UE2-C64U-Emulator), which runs the unmodified Ultimate firmware on your computer. Install it separately (see [Installing the Ultimate emulator, step by step](#installing-the-ultimate-emulator-step-by-step)), then set three things in **Settings → Integrations → Ultimate emulator (UE2)**: the `ue2emu` program, a firmware (`.ue2`, `.elf` or `.app`, not included) and the ROM folder (`roms/` of a [1541ultimate](https://github.com/GideonZ/1541ultimate) checkout). Only `chars.bin` (2048 bytes, the menu font) is required from that folder; the Commodore firmware boots on its own C64 ROMs. The first run installs a `.ue2` into a flash image kept per firmware in the app's config folder, and every start turns on the firmware's web service, which the Commodore firmware ships disabled. The emulator starts on the first run and stays open for the next ones; its REST API listens on `127.0.0.1` at the **REST port** (default 8064). It closes with the app or with **Stop emulator**. **D64 on Ultimate emulator** in the same menu packages a D64 (this needs VICE's `c1541`), mounts it on drive A and runs the first program. While one of these two run modes is selected, the **VICE Monitor** window (hot reload, live watch, profiler) connects to the emulator instead of VICE. **Debug** in these run modes opens the emulator debugger: registers, disassembly, memory and breakpoints in a window of their own, the picture in the emulator's window. The program stops at the first breakpoint it reaches, or at its first instruction if there are none; the editor line follows the CPU, and F5, F10, F11 and Shift+F11 work with the focus in the editor too. A timer IRQ can take a step into the KERNAL, as in VICE's monitor, when interrupts are on. VA also sets **Turbo Control** to the turbo registers in the emulator's flash, so a program can change the CPU speed through `$D031` (it reads `$00`, 1 MHz, after a reset).

Sample: **Ultimate turbo demo (64 sprites)** (`samples/ultimate-turbo-demo.asm`) — the speed changes every 3 seconds from 1 to 64 MHz; at 1 MHz balls go missing and the frame rate drops, from 4 MHz all 64 sprites run at 50 fps. It runs only on an Ultimate with the turbo registers on; anywhere else it says so. **Ultimate turbo cube** (`samples/ultimate-box-demo.asm`) does the same with the cube of the box sample: the faster the CPU, the faster the cube turns (5 frames a second at 1 MHz, 50 from 16 MHz). **Ultimate 64 palette demo** (`samples/u64-palette-demo.asm`) switches the video palette with the keys 1, 2, 3 and 0 (see [U64_PALETTE](https://github.com/zstarczali/VMA/blob/main/docs/VMA-Manual.md#u64_palette--u64_palette_color--u64_palette_reset)); it needs the Command Interface enabled in the menu.

> **Tip:** No USB cable or driver needed — the REST API is built into the Ultimate firmware. Your computer and the device must be on the same local network.

### Installing the Ultimate emulator, step by step

The **Ultimate emulator** and **D64 on Ultimate emulator** run modes need three things that do not come with Visual Assembler: the emulator itself, an Ultimate firmware and a ROM folder. Set them up once, as follows.

**1. Install the emulator** ([UE2-C64U-Emulator](https://github.com/Jondalar/UE2-C64U-Emulator)):

- **Windows:** download `ue2emu-<version>-windows-x86_64.zip` from the emulator's [Releases page](https://github.com/Jondalar/UE2-C64U-Emulator/releases) and unzip it into a folder you keep, for example `C:\Tools\ue2emu`. Keep the files together: `ue2emu.exe` needs the DLLs next to it.
- **macOS:** install it with Homebrew. Visual Assembler finds it there on its own:

  ```
  brew install jondalar/ue2emu/ue2emu
  ```

- **Linux:** there is no ready package yet; build it from source as the emulator's documentation describes (Rust and libslirp are needed).

**2. Get a firmware.** The emulator runs the firmware of a **C64 Ultimate** or an **Ultimate 64 Elite II** unmodified: the update file (`.ue2`) that you would install on the device, or an `ultimate.elf` of your own build. Neither Visual Assembler nor the emulator includes one. The C64 Ultimate firmware 1.1.0 is known to work.

**3. Get the ROM folder.** Download the [1541ultimate](https://github.com/GideonZ/1541ultimate) repository from GitHub (**Code → Download ZIP**, or `git clone`) and unpack it. What you need is its `roms` folder. Visual Assembler checks only `chars.bin` in it (2048 bytes, the menu font).

**4. Fill in the settings.** Open **Settings → Integrations → Ultimate emulator (UE2)**:

| Button | Choose |
|---|---|
| **Choose ue2emu** | `ue2emu.exe` from step 1. When the emulator is on the `PATH` or installed with Homebrew, the field is filled in already. |
| **Choose firmware** | The `.ue2` (or `.elf`) from step 2. |
| **Choose ROM folder** | The `roms` folder itself, not the repository folder above it. |
| **REST port** | Leave it at **8064** unless that port is taken. The emulator also uses the next two ports (control and VICE monitor). |

**5. Run.** Select **Ultimate emulator** in the split run menu (it appears once the settings are complete) and press **▶ Run**. The first run with a `.ue2` installs the firmware into a flash image of its own, which takes a little longer; then the emulator's window opens and your program starts. The status line under the settings shows **Running, REST: 127.0.0.1:8064**.

**6. Keep working.** Later runs reuse the open emulator. **Stop emulator** in the settings closes it, and so does quitting Visual Assembler; the flash image is saved on the way, so the firmware's own settings are kept.

**If something goes wrong:**

| Message | What to do |
|---|---|
| *Ultimate emulator: not set in Settings: …* | Step 4: the item named in the message is empty, or the file is no longer there. |
| *Ultimate emulator: missing from the ROM folder: chars.bin* | You chose the repository folder or an unpacked ZIP folder above it: choose the `roms` folder itself. |
| *The Ultimate emulator's REST API did not respond in time* | Another program uses the port: set a different **REST port**. |
| **D64 on Ultimate emulator** cannot build the disk image | That mode packs the D64 with VICE's `c1541`: set the VICE path in **Settings → Files and paths**. The **Ultimate emulator** mode itself does not need VICE. |

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
2. Open **Settings → Integrations** and check the **Kung Fu Flash 2** section — the port should already be filled in.
3. Select **Kung Fu Flash 2** from the split run menu (the choice is remembered, and is also stored in project files).
4. Click **▶ Run**. The program is compiled, the cartridge is restarted into its MENU loader (a short 1200-baud "touch" of the serial port), a small handshake follows and the PRG is uploaded. When the transfer completes, the program is running on the real machine.

Works from **Block**, **Expert** and **Ultimate Basic** mode alike; Ultimate Basic programs compile from the project's startup file.

> **Limits and checks:** the PRG must contain the two-byte load address plus at least one data byte, must fit into the C64's 64 KiB address space, and must not exceed the size the cartridge's loader accepts. Failures — port not configured, port cannot be opened, the cartridge not returning from MENU, or a rejected upload — are reported in a toast with the exact reason.

> **Tip:** if you prefer a cartridge image instead of a live upload, **Build CRT** (Magic Desk 64K) also runs on the Kung Fu Flash — see [Section 10b](#10b-crt-export-magic-desk-64k-cartridge).

### Version control (git)

**Settings → General → Version control** and **Settings → Files and paths → git**:

| Setting | Description |
|---|---|
| **Automatic autosave entries in version control** | Adds an autosave entry to the version history about 2.5 s after you stop editing (for project tabs to the project history as well) |
| **Choose git.exe…** | Browse to the `git` executable (`git.exe` on Windows) |
| **Auto-detect** | Clears the chosen path and searches the PATH and the usual install folders |
| **Use Git when the project is in a repository** | Opens the Version control dialog in Git mode for files inside a git repository |
| **Status** | Shows the git version, or that git was not found (the built-in version control still works) |

## 12. Visual Editors (Toolkit)

The visual editors open with their own toolbar buttons. Each has a **Files ▾** menu to load and save its data (mostly raw `.bin`) and to put it into the program (**Export to blocks**); a `.bin` goes into a program with `INCBIN`. The Hi-Res editor can also save straight to a D64 disk (**Save to D64…**).

**Colour palette:** **Settings → General → Editors → C64 colour palette** chooses the RGB values every editor draws the 16 C64 colours with (sprite, character, Charset Canvas, Hi-Res, map and level editor, Toolkit swatches). The default is **Colodore**, the closest to a real C64 on a composite / S-Video display; **Pepto** (the darker, less saturated palette of older versions), **VICE**, **Deekay** and **C64 Wiki / Godot** are also available. Only the display changes — the colour indexes in your data stay the same. The Hi-Res image import uses the editor palette too, unless you pick another one there.

**Custom palette:** if none of them matches your monitor or your real C64, choose **Custom** and click **Edit custom palette…**. Each of the 16 colours gets a colour picker and a hex field (`#RRGGBB`); **Start from** + **Copy** fills all 16 from a built-in palette. **Import…** reads a Photoshop `.act`, a VICE `.vpl`, a GIMP `.gpl` or any text with 16 `#RRGGBB` / `$RRGGBB` values (the first 16 colours are used); **Export .act** and **Export .vpl** write the palette for Photoshop or for VICE (*Settings → Video → Palette* in VICE), so you can compare the same colours in the emulator. **Save** stores it and switches to **Custom**.

Visual-editor dialogs can be dragged by their headers across the full Visual Assembler workspace. A dialog with no saved position opens centered; after it is moved, its last position is stored in UI settings and restored the next time it opens.

### Hi-Res / Multicolor Editor

Pixel-level bitmap editor with both 320×200 hi-res and 160×200 multicolor modes. Open it with the Hi-Res Editor toolbar button.

| Feature | Description |
|---|---|
| Mode toggle | **Multicolor** checkbox switches between hi-res (mono per cell) and multicolor (4 colors per cell). |
| Tools | Pencil, eraser, line, rectangle, filled rectangle, oval, filled oval, flood fill, colour picker, cell paper, select. |
| Colour picker | Click a pixel to make its visible colour the ink (in hi-res the cell's ink or paper, whichever the pixel shows); the editor then returns to the previous tool. **Alt+click** picks the colour with any tool. |
| Cell paper (hi-res) | Hi-res allows two colours in every 8×8 cell: the ink (set pixels, high nibble of the cell's screen RAM byte) and the paper (clear pixels, low nibble). The **Cell paper** tool sets the paper of each cell you click or drag over to the selected colour; **PAPER** still sets every cell at once. The eraser clears pixels, so the cell's own paper shows. Disabled in multicolor, where the background ($D021) is shared. |
| Spray tool | Airbrush-style painter that scatters pixels around the cursor while drawing. |
| Spray intensity | Dropdown next to the spray tool controls how dense each spray stroke is. |
| Color palette | Foreground (ink) + paper (background) pickers. In multicolor every 4×8 cell holds the paper plus 3 more colours: a 4th is refused with a message in the status bar. Changing the paper recolours all background pixels, as `$D021` does. Cells over the limit (for example from a raw 32000-byte file) get a red frame, and the export warns about them, because their extra colours would turn into the background. |
| MIX (multicolor) | The **MIX** row paints a blend of three colours in a repeating pattern instead of a single colour, for extra shades beyond the four colours of a cell. Turn it **On** and pick one of the 8 slots (a click on a slot also turns it on); each slot has three colours (a click on a colour swatch takes the selected palette colour) and a pattern: Lines, Stripes, Brick, Checker, Soft (4×4), Columns, Diagonal, Tint. It works with the pencil, spray, line, rectangle, oval and fill tools; the eraser and the colour picker are unaffected. The pattern is locked to the picture, not to the shape, so neighbouring shapes painted with the same mix meet without a seam. The cell limit still applies: a mix that contains the paper colour uses only two of the cell's three colours. The slots are kept between sessions. Disabled in hi-res. |
| Undo / Redo | Per-stroke history, ctrl-Z / ctrl-Y. |
| Select | The dashed-square tool: drag on the canvas to mark a rectangular region. **Esc** clears the selection. |
| Copy / Paste | **Copy** (`Ctrl/Cmd+C`) copies the selected region. **Paste** (`Ctrl/Cmd+V`) shows a preview that follows the cursor: click on the canvas to place it, **Esc** cancels. The copy is kept, so pressing `Ctrl/Cmd+V` and clicking again places it as many times as needed. In hi-res mode pasted pixels still follow the two-colours-per-cell limit, so line the region up with the cell grid to keep its colours. Copy, Paste and Transparent paste are also in the right-click menu of the canvas; a paste started there previews at the clicked spot. |
| Transparent paste | `Ctrl/Cmd+Shift+V` (or its toolbar button) skips the paper-coloured pixels of the copy, so the picture underneath shows through. |
| Grid + Raster | **Grid** shows the character-cell grid: 8×8 pixels in hi-res, 4×8 double-wide pixels in multicolor. From 4× zoom it also draws a fainter line around every single pixel, so each pixel can be placed exactly. **Raster** adds a raster row overlay. |
| Zoom | Slider from 1× to 16×, or Ctrl+wheel over the canvas (the point under the cursor stays in place). |
| Import image | PNG/JPEG/GIF dropped into the canvas auto-quantizes to the 16-color C64 palette. |
| Export blocks | Appends a loader to the program: it loads the file `HIRES` from disk to `$2000`, copies screen RAM to `$0400` (and in multicolor color RAM to `$D800`), then switches on the bitmap mode. The picture is not in the blocks: add it to the disk with **Save to D64**. |
| Export `.bin` | Saves the native multicolor format (10000 bytes: 8000 bitmap + 1000 screen + 1000 color) ready for LOADFILE to $2000. |

### Sprite Editor

24×21 pixel sprite editor with multi-frame animation. Open it with the Sprite Editor toolbar button.

| Feature | Description |
|---|---|
| Frames | Add / remove / reorder frames; frame strip shown at the bottom. **Copy** / **Paste** in the frame row copy the whole current frame; the same two entries are in the right-click menu of the canvas and of the frame strip. |
| Mode | Mono / multicolor toggle. |
| Tools | Pencil, fill, colour picker, line, rectangle, circle — plus flip horizontal, flip vertical, shift left/right/up/down (with optional wrap). Shape tools show a live preview while dragging; release to commit. |
| Colour picker | Click a pixel to select its colour slot (sprite colour, MC1, MC2, background or overlay colour, on the edited layer); the editor then returns to the previous tool. **Alt+click** picks with any tool. |
| Zoom | Slider from 3× to 40×, or Ctrl+wheel over the canvas. |
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

Read-only viewer of the C64 character ROM (the built-in PETSCII font). Open it with the **C64 chargen** toolbar button. Useful for finding the screen-code of a glyph before writing it with `RAWBYTES` or `TEXT`.

| Feature | Description |
|---|---|
| Two character sets | Tab 1: **Set 1 — Upper/Graphics** (default mode after power-on). Tab 2: **Set 2 — Lower/Upper** (after `$0E` switch). |
| Glyph grid | 16×16 grid of all 256 characters. Click a glyph to see its detail panel: zoomed 8×8 pixel view, screen code (decimal + hex), PETSCII codes (both default and shifted), and the raw 8-byte bitmap. |
| Detail panel | Shows the selected glyph's screen code, PETSCII codes, and the eight raw bytes — ready to paste into a `RAWBYTES` or BYTE block. |
| Read-only | No editing here — use the Character Editor (below) to modify glyphs. |

### Character Editor (Charset)

256-character 8×8 charset editor. Open it with the Character Editor toolbar button.

| Feature | Description |
|---|---|
| Load ROM | Loads the C64 character ROM — the exact 901225-01 glyphs, no file picker. The first button (and **Files → ROM: uppercase / graphics**) loads set 1, the second button (or Shift+click, or **Files → ROM: lowercase / uppercase**) loads set 2. |
| Load `.bin` | Imports an external 2048-byte charset binary. |
| Per-char preview | 16-wide grid of all 256 glyphs with the current cell highlighted. |
| Pixel editor | Edits the selected character, or a **tile** of 2×1, 1×2 or 2×2 neighbouring characters as one picture (Tile selector). |
| Drawing tools | Pencil, line, rectangle, filled rectangle, flood fill and colour picker. A click on a pixel that already has the ink erases it. The colour picker (multicolor only; **Alt+click** with any tool) makes the clicked pixel's colour — FG, BG, MC1 or MC2 — the ink. |
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

Full-canvas charset painter for building screens from a complete 256-character charset. Open it with the Charset Canvas toolbar button.

The canvas is 16×16 characters, 128×128 pixels. In multicolor character mode every character is either multicolor (wide pixels, 4 colours) or hi-res (8 narrow pixels, 2 colours), exactly like on the C64.

| Feature | Description |
|---|---|
| Mono / multicolor | Mono mode stores 1-bit 8×8 glyphs. Multicolor mode stores two-bit horizontal pixel pairs and marks multicolor cells with Color RAM bit 3. |
| Character mode tool | In multicolor mode, click or drag over characters to switch them between multicolor and hi-res (Color RAM bit 3). The shape is kept: a set pixel pair becomes the character's own colour. A hi-res character has the background and its own colour (0–7); MC1 / MC2 do not paint there. |
| Background | The BG dropdown is shown in mono mode too; MC1 / MC2 only in multicolor mode. |
| ECM | The **ECM** checkbox (extended colour mode, not together with multicolor): every character is hi-res with its own colour (0–15) and one of four backgrounds BG0–BG3 (`$D021`–`$D024`; BG1 / BG2 are the MC1 / MC2 registers). Pick a BG colour in the palette (tagged B0–B3), then click or drag over characters with the **Character background** tool. Only 64 different characters fit: the status line counts them, and saving merges equal characters — the charset is 64 characters (512 bytes) and the screen codes are `glyph | background << 6`. Turn ECM on with `$D011` bit 6. |
| C64 color model | Background uses `$D021`; shared multicolor 1 uses `$D022`; shared multicolor 2 uses `$D023`; each character's own color comes from Color RAM bits 0–2. |
| Drawing tools | Pencil, eraser, line, rectangle, oval, and flood fill work across character boundaries. |
| Colour picker | Click a pixel to select its visible colour (in a multicolor character also its BG / MC1 / MC2 / own-colour ink); the editor then returns to the previous tool. **Alt+click** picks with any tool. |
| Spray tool | Airbrush-style drawing that scatters pixels across neighboring cells/characters. |
| Spray intensity | Dropdown next to the spray tool sets the stroke density. |
| Grid toggle | The Grid checkbox shows or hides the 16×16 character grid. |
| Zoom | The zoom slider (2×–24×, whole device pixels per C64 pixel) or Ctrl+wheel over the canvas; the zoom is remembered. From 8× the Grid also draws a fine line on every pixel edge. |
| Save charset `.bin` | Saves the 2048-byte character bitmap data. |
| Save 16×16 map + Color RAM `.bin` | Saves 256 screen codes followed by 256 Color RAM values. Use this with `MAP_COPY16X16`. |
| Loading | Can load charset-canvas saves, plain charset data, and compatible Character Editor charset data including stored per-character colors when present. |

**Important C64 limitation:** in multicolor character mode the two shared colors are global for the whole screen (`$D022` / `$D023`). Only the character's own color is per cell, and it is limited to colors 0–7 because Color RAM bit 3 selects multicolor mode. So one character shows at most **4 colours** (background, MC1, MC2 and its own colour), and the whole screen at most 3 + 8. In the palette the shared colours are tagged BG / 1 / 2, and colours 8–15 that are not shared are dimmed. Picking such a colour puts it into MC2 or MC1 only while no pixel uses that register; otherwise change it in its dropdown (that recolours the whole screen). In hi-res (mono) mode a character has 2 colours: the background and its own colour (0–15).

### Map Editor (Multilayer Tilemaps)

Layered tilemap editor for static scenery, sprite spawn maps, collision data, and similar. Open it with the Map Editor toolbar button.

| Feature | Description |
|---|---|
| Layers | Multiple named layers, each with its own tileset and opacity. |
| Brushes | Single-tile, fill, line, rectangle, and circle modes. Shape tools show a live preview while dragging; release to commit. |
| Zoom | Slider, or Ctrl+wheel over the map. |
| Undo / redo | Full undo/redo stack per layer. Ctrl/Cmd+Z / Ctrl/Cmd+Y or the toolbar buttons. |
| Clear menu | Per-layer or whole-map clear with confirmation. |
| Image import | Drop a PNG of a tilemap; the editor auto-slices into tiles. |
| Copy / paste | Copy a selected tile region, then paste normally or use transparent paste to keep empty tiles transparent. The same entries are in the right-click menu of the canvas. |
| Multicolor-aware tile coloring | With compatible charset metadata, painting uses the tile's stored Color RAM defaults (including multicolor-related encoding) instead of a generic flat color. |
| Custom charset colors | When a charset carries `charColors` metadata, the Map Editor uses the selected tile's default Color RAM value while painting. |
| Export blocks | Emits RAWBYTES blocks for tileset graphics + map data. |
| Save Screen RAM (.bin)… | Saves only the screen codes for the current map layer (40×25 = 1000 bytes). |
| Save Screen RAM + Color RAM (.bin)… | Saves screen codes concatenated with Color RAM values as a single 2000-byte file (`screen[0..999]` followed by `color[0..999]`). Use this with the **MAP_COPY** macro (`auto` as the colour source) to restore both screen and color in one operation at runtime. |

### Level Editor

Arranges **Map Editor screens** into one level — a vertical shooter, a car game scrolling down, a side-scroller or a 2D map — and previews the whole level with smooth scrolling. Open it with the **Level Editor** toolbar button next to the Map Editor.

| Feature | Description |
|---|---|
| Window | Resize it with the corner grip; the size is remembered between sessions. |
| Layout | **Vertical**, **Horizontal** or **Grid** (rows × columns, with add / remove row and column buttons). |
| Screens | **New empty screen**, **Add from Map Editor** (the map currently open) or **Load map(s) (.bin)…** (several Map Editor exports at once). Drag a screen from the list onto a slot; drag slots onto each other to swap them. |
| Editing | **Edit in Map Editor** opens the selected screen in the Map Editor and brings the changes back; duplicate, move up/left or down/right, remove; undo / redo. |
| Preview | Drag the preview or use the arrow keys to scroll pixel by pixel; **Play** scrolls automatically (direction, speed 1–8, loop), Space = play / stop. *Borders* marks the screen boundaries. |
| Zoom | The overview zoom slider (25–400 %), or Ctrl+wheel over the overview. |
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

**Using the level:** in assembler, `.level "level.bin"` + `.level_row` (see [LEVEL / LEVEL_ROW](https://github.com/zstarczali/VMA/blob/main/docs/VMA-Manual.md#level--level_row) and `samples/level-demo.asm`); in Ultimate Basic 1.6.1+, `map load "level.bin", $4000` and `map view px, py` (example `level_scroll_demo.ub`).

### SID Editor (3-Voice Tracker)

Multi-instrument 3-voice tracker. Open it with the SID Editor toolbar button. Playback and every preview (**Play: All**, instrument Preview, virtual keyboard, note entry, chord / arpeggio, row and single-pattern playback) play on the emulated SID: a JS model of the exported 6502 player (frame for frame) sends its SID registers to the backend, which renders the sound. Outside the desktop app a small SID synthesizer plays instead.

**Preview engine:** **Settings → General → SID preview** selects **reSID (resid-rs)**, the default, or **VA SID Core (Rust)**, the app's own SID emulation, and the chip (MOS 6581 / 8580). The editor's header shows the engine in use (e.g. *· reSID (MOS 8580)*). **8580 digi boost** drives a DC level on the EXT IN input, as VICE does: without it `$D418` digis are quiet on the 8580 (VA SID Core 1.3 models the small DC level of the 8580 voices, so they are not silent either); with it they are loud. The 6581 ignores it; it applies to the SID Player too, also while a tune plays. The instrument parameters are set with knobs.

**Two SIDs:** **SID: 1 / 2** in the tracker toolbar switches the tune between 3 and 6 voices. With two SIDs, the list next to it sets the second SID's address: `$D420`–`$D7E0` or `$DE00`–`$DFE0`, in steps of `$20`. The columns are headed **S1 V1** … **S2 V3**. Each SID has its own filter and volume, and a voice controls only its own chip's. The two SIDs play in stereo (SID 1 left, SID 2 right). Note previews play on the first SID. Switching back to one SID deletes the second SID's voices, and asks first if they hold anything.

**Per-instrument controls:**
- Waveform checkboxes (TRI / SAW / PUL / NOI) — multiple waveforms are ANDed like on the SID — plus **RING** (ring modulation of the triangle by the previous voice: 1 ← 3, 2 ← 1, 3 ← 2) and **SYNC** (hard sync to the previous voice).
- ADSR (attack / decay / sustain / release) shown as a drag-graph above the four sliders.
- Pulse width slider (0-4095).
- **Filter:** *Route this voice through the filter*, LP / BP / HP and **3 OFF** (mute voice 3 when it is not routed), cutoff, resonance, volume. **End** + **Sweep** move the cutoff from Cut toward End by Sweep per frame; **Ping-pong** bounces between the two — this is what makes resonant filter sweeps. The voice that starts a filter-routed instrument owns the filter (cutoff, resonance, mode); every voice whose instrument is routed goes through it.
- **Vibrato:** after **Delay** frames a triangle LFO that turns every **Speed** frames, **Depth** 0-15 scaled to the note's semitone (independent of the `V` effect).
- **Pulse width modulation:** **Speed** added to the pulse width every frame, bouncing between **Min** and **Max**.
- **Gate:** **Gate timer** releases the gate that many frames before the next note on the voice (keep it below Speed); **Hard restart** also zeroes ADSR then, for a clean attack; **First frame** writes a waveform on the note's first frame (e.g. `$09` test + gate).
- **Wave / arpeggio table:** up to 64 steps of waveform (— = keep) and note (offset in semitones, or **abs** = absolute note), one step every **Speed** frames, **Loop** back to a step or stop on the last one. **gate off** on a step releases the gate from that step until the next note (the release phase runs; for example a one-frame drum hit). The **…** button opens the details of the step: **Frames** is its own length (empty: the table's speed), **PW** a pulse width (empty: unchanged), **Filter** sets cutoff, resonance, mode and the routed voices of the voice's SID; speech and other fast-changing sounds are made this way. The UltimateBasic export leaves the pulse width and the filter out, and files with such steps need version 2.8.6 or later. **Presets** (25, in groups; the list keeps the chosen preset until the table is edited by hand): arpeggios (major, minor, 7th chords, sus4, diminished, augmented, power chord, octave, trill), drums (kick, snare, tom, clap, closed / open hi-hat), lead and bass attacks, and sound effects (laser, pickup, explosion).

**Tracker grid:**
- 3 voices (6 with a second SID) × up to 256 patterns × 32 rows; the song / order list holds up to 255 steps.
- Per-row: note + instrument index, plus an optional effect (see **Effect column** below). Empty rows hold the previous note: like in other trackers (GoatTracker, SID-Wizard), a note keeps its gate on (sustain level) until the next note on that voice or a **note-off**.
- **Enter** (or a double-click) edits the selected cell as text (`C-4 01 V24`); **Enter** saves and moves to the next row, **Esc** cancels.
- **Note-off** (`===`): key **1** (or `` ` `` / `=`), or type `===` / `OFF` into a cell. It releases the gate, so the instrument's release runs — the same as the `C` effect without a note (saved and exported as `C00`).
- Select one cell normally, or hold **Shift** while clicking or using the arrow keys to extend a rectangular selection across rows and any of the voices. Right-clicking inside the selected area keeps the range intact.
- Copy, Cut, Paste, and Clear are available from the icon toolbar and the icon-based context menu. `Ctrl/Cmd+C` and `Ctrl/Cmd+V` operate on the same rectangular selection.
- Harmony helper: choose a root note, chord type, and octave, preview the chord with the current instrument, then insert the voicing directly into the tracker. Available types include Major, Minor, Diminished, Augmented, Sus2, Sus4, Dominant 7, Major 7, Minor 7, 6, Minor 6, 9, b9, #9, Dim7, and 7sus4.
- Arpeggio helper: preview or insert 4-, 8-, or 16-step note runs from the selected chord in up, down, or up/down directions.
- **Preview row** auditions the selected row across all voices without starting pattern playback.
- Cell-range paste now starts at the selected range start cell and stops cleanly at voice and row boundaries instead of wrapping into the next column or row.
- Deleting instruments: **−** next to **+** deletes the current instrument (the notes that play it switch to the one before it, after a question), and Files → **Delete unused instruments** removes every instrument no note plays. The numbers in the tracker follow; Undo brings them back.
- Song volume: **Vol**, a knob in the tracker toolbar (0–15), is the tune's volume: the SID's master volume for all three voices. A two-SID tune has a knob for each chip (**SID 1**, **SID 2**). An instrument has no volume of its own (use sustain for the level of one voice), and a tune saved earlier takes its first instrument's volume.
- PAL / NTSC: the switch next to BPM sets the machine the tune is for. NTSC plays 60 frames a second on the NTSC clock: the preview, the BPM, the exported player's note table and the `.sid` header follow it.
- **Quantize** (in the tracker toolbar): the grid is 2, 4, 8 or 16 rows. In the horizontal tracker, **Q** or its button moves the selected notes to the nearest grid row and keeps their lengths; with **On record** checked, the notes of a recording are quantized the same way when it stops.
- **Selection in the horizontal tracker:** Shift+drag a frame (Ctrl+Shift+drag adds to the selection), Ctrl+click a note, Ctrl+A for all, Esc to clear. Ctrl+X / C / V and Del, or the buttons in its header, cut, copy, paste and delete. A paste goes to the row under the mouse, or else to the tracker cursor, and writes over what is there. Deleting a note keeps the end of the note before it. The header has **Undo** and **Redo** as well.
- **Undo / Redo** (the buttons before the voice copy, or Ctrl+Z and Ctrl+Y) step through the changes of the notes, instruments, song and tempo and the loading of a tune, up to 100 steps. A knob's drag or a whole recording is one step, and the view jumps to the instrument and pattern that changed. Text fields keep their own Ctrl+Z.
- **Frames/row** (1–255, so a higher number is slower) is typed in or stepped with the − / + buttons next to it; the `F` effect changes it during playback. **BPM** next to it shows the resulting tempo: with 4 rows per beat on PAL, 6 frames/row = 125 BPM.

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
| `L` | Legato | with a note: under the held gate the note starts without retriggering the envelope (instrument, table, pulse width and vibrato start again, no first-frame waveform, no gate timer / hard restart before it); without a held gate a plain note |

Effects update once per row (matching the exported player's timing), run identically in the Web Audio preview and the compiled 6502 export, and are saved/loaded losslessly in the versioned `.bin` format.

**Playback and virtual keyboard:**
- The Play toolbar button changes to Pause during playback and to Resume while paused; Stop ends playback and resets the state.
- The **LCD** at the end of the tracker toolbar shows the song position (POS), pattern (PAT), row (ROW) and play time (TIME) during playback, and the edit position when stopped. **Settings → General → SID preview → LCD colour** makes it green or red.
- The **Channel spectrum** button in the tracker toolbar opens a window with a 16-band analyzer per voice (6 with two SIDs). It is calculated from the SID registers being played — frequency, waveform, pulse width, approximated ADSR, filter and volume — not from the audio, because the output is one mix. Ring modulation, sync and filter resonance do not show, and it moves during tracker playback only, not for note previews.
- The keyboard toolbar button opens **VA-VK**, a non-modal piano (2, 3 or 4 octaves; position, open state, octave and *Insert into tracker* are remembered) with its own **Play / Stop** buttons that remains usable while the SID editor is active. Drag its header to place it anywhere over the main application.
- The **Instrument** knob on VA-VK (drag, mouse wheel or arrow keys) selects the instrument, shown with its number and name on the LCD next to it; it follows the instrument list of the editor. The badge next to the VA-VK title shows the SID emulation in use (reSID or VA SID Core, with the chip model).
- Enable **Insert into tracker** to write each played note at the current tracker cursor and advance to the next row. Disable it to audition notes without editing.
- Chord and arpeggio previews illuminate the corresponding piano keys when the keyboard is open.

**Recording, metronome and MIDI:**
- **Record** (the red dot, in the tracker toolbar and on VA-VK) writes the notes you play — on VA-VK, the computer keyboard or a MIDI keyboard — in time into the selected voice, starting at the selected row, at the current tempo. When the pattern is full, a new empty pattern is added after the current song step and recording goes on there. Press Record again to stop.
- **Metronome** (tracker toolbar and VA-VK) clicks every 4 rows, accented on the first beat of each 4-beat bar. The beat lamps next to it flash on every beat during playback and recording, even with the click off.
- **MIDI:** choose the input in the **MIDI** list next to the instrument name and press **Connect MIDI**; notes play the current instrument (and are written into the tracker while recording or with *Insert into tracker*). The lamp next to the button flashes on every incoming MIDI message. With **Poly record** on, the keys held while recording go to voices of their own, from the selected voice on, and a release writes a note-off; when every voice is held, the oldest key gives up its voice. The connected input is remembered: the next time the SID Editor opens, it connects to it by itself (by its name if its id changed); if it is not plugged in, it is picked up when it appears. Choosing *none* in the list switches this off.
- **MIDI knobs:** right-click any knob (an instrument parameter, the tune's volume, the master volume, VA-VK's instrument knob) → **MIDI Learn**, then turn a knob or fader on your MIDI controller: from then on that controller turns this knob. A mapped knob shows its CC number; the same menu removes one mapping or all of them. The mappings are kept between sessions.
- **MIDI buttons:** right-click Play, Pause, Stop, Record, Undo or Redo (on the toolbar, in the piano roll or in VA-VK) → **MIDI Learn (hardware button)**, then press a button or pad on your MIDI controller: a transport button (Control Change) or a pad (a note, which then no longer plays) presses that button, once per press, while it is enabled. The mapping is saved with the knob mappings.
- **Pattern delete:** the **−** button next to **Pat +** deletes the current pattern (it asks first if the pattern has notes). The song steps that used it are removed and the others renumbered; at least one pattern always remains.
- The **master volume** knob is on VA-VK.

**Files menu exports:**
| Export | What it does |
|---|---|
| `Save .bin…` | Writes the editor's native serialized format (instruments with all modulation settings and names, speed, patterns, song). Older saves still load. |
| `New tune` | Starts an empty tune in place of the current one, after asking first. |
| `Export blocks (data only)` | Appends instrument table + pattern blocks to the program at `* = $C000`. |
| `Export blocks + miniplayer` | Adds the full player (sid_init / sid_irq / sid_frame / sid_play_row / sid_set_voice) plus PAL frequency tables. After export, place a `JSR sid_init` in your main code where the music should start; with your own IRQ call `JSR sid_frame` once per frame instead. |
| `Export asm (clipboard)` | Copies the full assembly source to the clipboard. |
| `Import GoatTracker .sng…` | Loads a GoatTracker 2 song in place of the current one — see **GoatTracker import** below. |
| `Import .sid…` | Converts a PSID / RSID tune into an editable song in place of the current one — see **.sid import** below. |
| `Import MIDI (.mid)…` | Builds a song from a Standard MIDI File in place of the current one — see **MIDI import / export** below. |
| `Export to UltimateBasic` | Writes a `tune ... end` block (instruments, order list, pattern rows as text) plus `music play` and inserts it at the cursor of the Ultimate Basic editor; outside UB mode it copies the text to the clipboard. The UltimateBasic compiler builds the player, so `music play` / `music stop` control it. Instrument modulation goes into `imod` / `ifilt` / `igate` / `itab` lines (Ultimate Basic 1.6.2+). |

**GoatTracker import:** **Files → Import GoatTracker .sng…** loads a GoatTracker 2 song (`.sng`, GTS3–GTS5) in place of the current one. The conversion is approximate, because the two trackers work differently:
- The per-voice order lists (with transpose and repeat) are flattened into one 3-voice song and cut into 32-row patterns; identical patterns are shared.
- Instruments: AD / SR, first wave, gate timer and hard restart are taken over; the wavetable becomes the wave / arpeggio table, the pulse table PWM, the filter table filter mode, resonance and cutoff sweep, and the speed table entry the instrument vibrato.
- Pattern commands: key off → note-off, portamento → `U` / `D` (at most 255 per row), tempo → `F`; toneporta becomes a plain note. Other commands are dropped, and a message lists what was approximated or skipped.
- A gate released by the wavetable becomes a note-off on the next free row. Only the first subtune is imported.

**.sid import:** **Files → Import .sid…** opens a PSID / RSID file (desktop app only, it uses VA SID Core). Choose the subtune and the length in seconds and press **Import**: the tune runs silently, its SID registers are recorded frame by frame and turned into a song in place of the current one. A progress bar follows the recording, then *Converting…* the conversion.
- **Notes:** a note on is a gate edge (a retrigger within 2 frames counts as one note); a pitch change under a held gate that stays at least 5 frames becomes a legato note with the `L` effect (when the row also needs an `F` speed change and no voice has a free effect cell, it becomes a retriggered note). Rows before the first note are whole rows of the tune's row length. The pitch is the most common semitone of the note's main waveform; NTSC tunes are retuned to the PAL note table.
- **Rows:** rows start exactly on the note ons. The base length is the longest that fits almost all of them; rows of that length or one frame longer (funktempo, swing, tempo changes) are set with `F` effects one row ahead.
- **Instruments:** AD / SR, the main waveform, pulse width and PWM, the filter (routing, mode, resonance, cutoff sweep) and the waveform and pitch of every frame of the note, up to the next one: the wave / arpeggio table (a prefix plus a repeating loop, up to 32 steps). Speech-like notes, which step the waveform, pulse width and filter by themselves, become tables of up to 64 steps with all of these. A fixed-pitch drum attack keeps absolute notes and an arpeggio relative ones, decided over all notes of the same sound; a regular sub-semitone wobble becomes the instrument vibrato. The gate becomes a note cut, a gate timer (with hard restart when ADSR is zeroed, or set to GoatTracker's `0F 00`) or, released inside the note, a **gate off** table step (a decay at the release rate beyond the table). Identical instruments are shared, up to 128.
- A message lists what was approximated, for example slides that become semitone steps or wave tables that had to be shortened. RSID tunes that start as a BASIC program are not supported.
- **Filter and pulse movement:** a filter sweep counts over the whole note, also after the waveform went silent, and it ends where another note restarts the filter. A filter table that falls fast counts by when it gets there, within the player's 127 per frame. A filter LFO bounces between its extremes. An instrument holds the pulse range of all its notes. Pulse and filter still restart at each routed note, so a sweep that runs freely across many notes is only approximated, and pitches that lie between semitones are rounded to the nearest one.
- **Several SIDs:** a 2SID tune becomes six voices and brings its second SID's address along. A 3SID tune imports its first two SIDs, and a message says so.

**MIDI import / export:** **Files → Export MIDI (.mid)…** saves the song (song order → patterns → rows) as a Standard MIDI File, format 1: a tempo track plus one track per voice (3, or 6 with two SIDs) on MIDI channels 1–6. MIDI note = SID note + 12, as with the MIDI input. Notes start and end the way the player plays them: a new note ends the previous one, a note-off (`C`) and the instrument's gate timer release the gate, `F` changes the row length. One MIDI tick is one player frame and the tempo comes from the speed and PAL / NTSC, so a beat is 4 rows (the BPM display). A track is named after the instrument of its first note (else *Voice N*), and instrument changes become program changes (instrument number = program). Gate-off steps of a wave table are not followed.

**Files → Import MIDI (.mid)…** reads a format 0 or 1 file (division in ticks per quarter note; SMPTE timing is refused). A dialog lists every track / channel with notes: tick up to 3 of them (6 with two SIDs, set in *SID chips*), one per voice in list order; the drum channel 10 is off by default. *Rows per beat* sets the quantize grid (default 4): note starts and ends are rounded to the nearest row, and every note lasts at least a row. Inside one track the highest note of a chord is kept and a higher note cuts a held one; with *Spread chords to free voices* the other notes go to voices that no chosen track uses. A note-off is written where a note ends without the next one starting. The speed comes from the first tempo, later tempo changes become `F` effects one row ahead. *Instruments*: one new instrument per track (pulse, saw, triangle in turn, named after the track) or the current instrument for every note. The result is cut into 32-row patterns (identical ones shared, at most 255 song steps). The import can be undone with **Undo**.

**Player ZP usage:** `$02`–`$1C` (pattern pointers, pattern offset, temp) and `$2F` (current speed), plus `$FB`–`$FD` (tick counter, row index, order-list position). Voice, modulation and filter state lives in `sid_state` after the player code. The ZP bytes conflict if your main code uses them — relocate via Expert mode if needed. With two SIDs the player also uses `$50`–`$67` (the pointers of voices 4–6) and `$68`/`$69` (the current voice's SID registers).

**Known limits:**
- The player and its state sit at `$C000`. When the tune data does not fit below `$D000` next to them, the data moves to its own segment ending below `$A000` (the exported asm has a second `* =` line); keep it clear of your own program.
- A tune with two SIDs needs twice the pattern data: its `.sid` and assembly exports hold at most 46 patterns, and the rest are left out with a note in the assembly source. The tune stays whole in the editor. **Export to UltimateBasic** writes the first three voices only, with a note.
- C64 `$D418` global volume is shared across voices — the per-instrument volume slider is informational; sustain level (`S` of ADSR) is the effective per-voice volume.
- A note preview is rendered on the backend before it sounds, so it starts a moment after the key press. Every preview note has its own chip, so notes do not take voices from each other.

---

**Export MIDI (.mid)…** (Files menu) saves the song as a Standard MIDI File — see **MIDI import / export** above.

**Export .sid (PSID)…** (Files menu) saves the tune with the playable `$C000` player as a standard PSID file — it plays in the SID Player, in VICE's `vsid` and in any other SID player. A tune with two SIDs is saved as PSID v3 with its second SID's address.

### SID Player

The **SID Player** toolbar button opens a floating window that plays `.sid` music files (PSID and RSID), for example tunes from the HVSC collection.

- **Playlist:** add tunes with **Add .sid files…** or by dropping them on the window, and click a tune to play it; **Remove** and **Clear playlist** tidy the list. **Save playlist…** / **Open playlist…** write and read a `.sidpl` file with the tunes embedded. The list, the current tune and whether the window is open are remembered.
- **Transport:** Play, Pause, Stop, **Previous** / **Next** tune, and a time counter. A file with several songs shows **|‹ ‹ 1 / 3 › ›|**: **‹** / **›** step to the previous / next subtune, **|‹** / **›|** jump to the first / last one; a playing tune restarts on the new subtune at once, also while it is still starting.
- **Subtunes from the start:** a tune you pick again (in the playlist, with **Previous** / **Next**, or as an HVSC result) starts from its first subtune, even when its subtunes had played on or the file names a later start song.
- **Seek:** the position bar and **Back / Forward 10 s**; the skipped part runs silently.
- **Volume:** the knob is shared with the SID Editor's master volume.
- **Buffer:** **Settings → General → SID preview → SID Player buffer** (10, 15, 20 or 30 s). A larger buffer stops the crackle while the app is busy: the tune is rendered that far ahead, from the next tune on.
- **Fade out at the end:** many tunes never end, they just loop. **Settings → General → SID preview → Fade out at the end** (Off, 5, 10 or 15 s; 10 s by default) fades a tune out over its last seconds, at its HVSC length or otherwise after three minutes, then the player moves on; after the last tune it stops. With **Off**, the tune ends without a fade and the last one keeps playing.
- **Engine:** the window shows which engine is playing (reSID or VA SID Core, with the SID chip); choose it in **Settings → General → SID preview**. Both run the tune on a native Rust C64 core with a cycle-exact 6510, precise interrupt timing, CIA 6526A, VIC-II timing with bad lines, sprite DMA and raster interrupts, and the 6510 I/O port — so raster-IRQ, CIA-timed and digi tunes play with the timing of a real machine. 2SID and 3SID tunes play (PSID v3 / v4) in stereo: SID 1 left, SID 2 right, a third SID in the centre.
- **Shuffle:** the shuffle button next to **Next** plays the playlist in random order — no tune repeats until every tune has played, and **Previous** steps back along the random order. The setting is remembered.
- **Play subtunes in sequence:** the toggle before **Back 10 s**, on by default, plays the file's remaining subtunes one after the other before moving to the next playlist entry, also with shuffle and for a single file. A subtune lasts its HVSC length when known, otherwise three minutes. With the toggle off, the playlist moves on after the current subtune. At the end of the playlist, with shuffle off, the player stops after the last subtune has faded out; with **Fade out at the end** off, the last subtune keeps playing until you stop it.
- **Normalize volume:** the button next to the spectrum analyzer plays every tune at about the same loudness: raised or lowered towards one level, by at most 12 dB, without clipping. A tune is measured on its first two seconds, then the level follows it slowly. If a tune with a quiet start was raised and a louder part follows, the level drops at once, before that part sounds, so it does not distort. The setting is remembered.
- **Stars:** each row has 1 to 5 stars; click a star to rate the tune, click the same star again to clear it. The rating is kept in the saved state and in `.sidpl` playlists (an older playlist's favourite becomes one star). **Keep only starred tunes** in the toolbar removes every tune without a star, after a confirmation.
- **Remove duplicates:** the toolbar button removes the tunes that are in the playlist more than once: the same HVSC path, or the same file bytes. The first copy stays, with the most stars any of its copies had.

#### HVSC (High Voltage SID Collection)

The **HVSC** button in the SID Player toolbar opens a search panel for the [High Voltage SID Collection](https://www.hvsc.c64.org/), about 61,000 C64 tunes.

- **Search:** type a title, composer or folder (`hubbard commando`, `games/s-z`); every word has to match. **Random tunes** lists 25 random ones.
- **Top 50:** the star button next to **Random tunes** lists the 50 most popular C64 tunes, most popular first. The list comes from Remix64 (remix64.com): the most remixed SID files and the originals most often in its C64 remix charts. The status line shows **top 50** with the number of tunes found in the catalog; typing a search or **Random tunes** leaves the list.
- **Composer:** the list next to the search field switches from **All** to **Composer**, which searches composer names only (`hubbard`, `rob hubbard`, `galway`) and lists the tunes by composer. The name comes from the tune's folder under `MUSICIANS`, so a composer is found by the folder's name, which may be a handle (`laxity`). About 4,600 tunes in `GAMES` and `DEMOS` have no composer folder: **All** finds them by title or folder.
- **Play / add / save:** click a tune (or press **Enter** for the first one) to play it; it is not added to the playlist, and when it ends the next result plays, in order (**Next** and **Previous** step through the results too). The next result is downloaded during the last 30 seconds, so the switch has no gap. Playing a playlist entry goes back to the playlist. **+** adds a tune to the playlist, the download button saves the `.sid` file. While a tune downloads, a spinner replaces its **+**, and a second click does not add it again. **Add all results** adds up to 100 found tunes.
- **Tune lengths:** HVSC knows the length of every subtune, so the seek bar shows it and the playlist moves on when the subtune ends.
- **Where tunes come from:** the catalog and single tunes are downloaded from an HVSC mirror on first use and kept in the app's cache, so a tune played once also plays offline. **Update catalog** fetches the newest list.
- **Whole collection:** **Download the whole collection…** downloads the official HVSC archive (about 85 MB) into a folder you pick and unpacks it there (about 380 MB); from then on the player uses that copy and works offline. **Use a local HVSC folder…** points it at a collection you already have.

#### Spectrum analyzer

The bar button in the SID Player toolbar opens the **Spectrum** window: LED-style bars from green through yellow to orange, cells that fade out slowly and a mirrored floor in perspective. It shows whatever the SID Player or the SID Editor plays, with either engine. **Bands** sets 8, 16, 24 or 32 bands. **View** chooses **Mix**, the analyzer of the output, or **Channels**, a separate analyzer for every voice (6 with two SIDs), calculated from the played registers rather than the sound. The window can be moved by its header and resized with the small grip in its lower right corner (on macOS too); its size is remembered. It closes and reopens together with the SID Player, and it draws only while it is open.

The SID Editor has its own per-voice **Channel spectrum** window: see [SID Editor](#sid-editor-3-voice-tracker).

#### Channel curves

The **Channel curves** button, next to the spectrum button in the SID Player and in the SID Editor's tracker toolbar, toggles a window shared by the two. It shows a scrolling level curve and a large note name for every voice (6 with two SIDs), following what is sounding at the moment, not the audio rendered ahead of it.

- **SID Player:** works with either engine, in the desktop app.
- **SID Editor:** works during tracker playback, not for note previews. The window stays usable beside the tracker, so Play and Stop remain at hand.
- **What it shows:** the level is calculated from the played registers with an approximate ADSR, so it is a level history, not an oscilloscope. A dash means the voice is silent. The curves stand still during a pause.
- **Window:** drag the header to move it and the small lower-right grip to resize it; its position and size are kept. It closes and reopens with the SID Player and the SID Editor. The button, the close button or Escape closes it for good.

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

A small **non-modal** DEC / HEX / BIN converter, opened with the toolbar button next to the SID Player (click again or press Esc to close). The button stays highlighted while the converter is shown. It stays open while you keep editing the program in any mode.

- Type into any of the **DEC**, **HEX** or **BIN** fields and the other two follow. Prefixes `$`, `0x`, `%`, `0b` and separators (space, `_`) are accepted; a negative decimal becomes two's complement in the current width; invalid input is marked red.
- **8 / 16 bit** width — a value above 255 switches to 16 bit automatically.
- **Bits row** — click a bit to toggle it.
- The info line shows the **signed** value and, in 16-bit mode, the **low** and **high** byte.
- **Copy** buttons copy the value with its prefix (`53280`, `$D020`, `%1101000000100000`).
- Drag it by the header; it remembers its value, width and position, and reopens after a restart if it was open when you quit.

---


*© 2026 Zsolt Tarczali — C64 Visual Assembler*
