# Linux Installation Guide (Ubuntu / Debian)
Version 2.8.3

2.8.3: the SID Player fades tunes out at the end of their length (Settings, Fade out at the end: Off / 5 / 10 / 15 s) and stops after the last one; HVSC results play without going into the playlist, the next result is downloaded ahead so the switch is seamless, and the result list keeps its scroll position; sample projects use the new .vas extension; the original code is now MIT-licensed

2.8.2: an Examples folder button in the Examples dialog opens the bundled samples in the file manager; the Level Editor resizes with its corner grip and remembers its size; the GameMaker full-screen IRQ sample comes with its charset, map, tiles and Level Editor project

2.8.1: five new themes (Ruby, Amethyst, Phosphor, Retro 80s, Retro 8-bit); Tauri 2.12 runtime; the Channel curves window resizes inside the SID Editor again; the Hi-Res MIX pattern list no longer stretches across the toolbar

2.8.0: SID Editor L (legato) effect and gate-off table steps, a closer .sid import; VA SID Core 1.3 with the 8580 digi boost option; Kick import and Import Kick project build through R65 and write VMA that builds the same bytes; build phases in the work window; project files open with their default app or show in the file manager; UltimateBasic projects open from Expert / Block mode; Expert and UltimateBasic toolbars in the same order with the same icons

2.7.9: R65, a KickAssembler-compatible assembler, built in: choose it in Settings next to VMA and ACME (projects too, its version in About); Build shows a small window with the size and address range; Kick import fixes (statements over several lines, .errorif, labels in .pseudopc, < / > of numbers) and a single file using script features opens as a Kick project; separators around the UB file buttons.

2.7.8: faster building, running and live views; one compiler: the Rust VMA compiler (VMA 2.3.0) builds every program and feeds every live view, the JavaScript compiler and the VMA compiler setting are removed; local labels such as JMP Second.lp or LDA .lp+1,X compile as absolute operands.

2.7.7: Ultimate 64 palette macros (.u64_palette from a palette file, .u64_palette_color, .u64_palette_reset) with a demo sample, the Hi-Res editor's MIX pen for multicolor pictures, and the built-in C64 no longer runs an empty program.

2.7.6: 1–5 star ratings in the SID Player playlist, Remove duplicates and Keep only starred tunes, Normalize volume no longer distorts a loud part after a boosted quiet start, a spinner on HVSC tunes while they download, and Restore64 disassemblies that write their own BASIC line after the code build and run again.

2.7.5: channel curves (a scrolling level curve and a large note name per voice, in the SID Player and the SID Editor), and the SID Player plays the remaining subtunes of a file in sequence (a new toolbar toggle).

2.7.4: selection with cut / copy / paste / delete in the horizontal tracker, quantize (Q for the selected notes, and recordings with On record), Undo / Redo in the horizontal tracker's header, deleting instruments (one by one or every unused one), the tune's own volume, PAL / NTSC timing.

2.7.3: undo and redo in the SID Editor (Ctrl+Z / Ctrl+Y), poly record from MIDI (held keys go to voices of their own), notes moved and stretched by dragging in the horizontal tracker, no more click on reSID before live notes or on a tune's first note, SID Player Pause works every time, tempo field named Frames/row, MIDI on Windows without a permission question, Linux: sound in the AppImage and packages built on Ubuntu 22.04, step-by-step Ultimate emulator setup in the manual.

2.7.2: reSID (resid-rs) replaces WebSID in the SID Player and the SID Editor, VA SID Core stays selectable (Settings -> General -> SID preview), SID Player buffer in seconds.

2.7.1: debugger choice (Settings -> General -> Debugger: Visual Assembler on VICE / Ultimate emulator / built-in C64, or RetroDebugger), Ultimate emulator run modes (UE2-C64U-Emulator: PRG and D64, debugger, VICE Monitor window), Ultimate turbo demos (64 sprites and a rotating cube, 1-64 MHz through $D031), D64 on hardware mount fix; two SIDs in the SID Editor (3 or 6 voices, selectable second SID address, .sid import and export), 2SID and 3SID tunes in stereo, per-voice channel spectrum, New tune, WebSID preview fix.

2.7.0: Built-in C64: VICE 3.10 (x64sc in WebAssembly) inside the app, nothing to install (Run menu -> Built-in C64, or its toolbar button); debugger that stops before the instruction at a breakpoint, with Continue, Break, Step into / over / out, editable registers and flags, disassembly, memory view and breakpoint list, breakpoints from the editor, Block mode and the disassembly, the editor following the CPU (the Debug button uses it in this mode and whenever no RetroDebugger is set); PAL / NTSC, SID 6581 / 8580, reSID / FastSID, REU up to 16 MB, joystick port, warp, sound; load a PRG, attach a D64 or a cartridge; CRT filter with scanlines, full screen, resizable window, window and settings remembered.

2.6.9: Git branches in the Version control window (switch, new, rename, delete, merge with a conflict list and Abort merge), stage / unstage / discard / diff per file, stash (push, apply, pop, drop), a commit of only the staged files; a new diff view (a card per file, old and new line numbers, syntax colours, the changed part of a line highlighted, side-by-side view); Discard changes asks first and resets the files on disk to HEAD too (git restore), so a branch switch works afterwards; Kick projects: cycle counts, errors and hints in files the startup file does not import, a forward branch inside .pseudopc relative to the logical address, charAt(i) == '1' as in KickAssembler; fixed: Save project saves an opened project in place instead of asking for a name; the Version control window stays within the screen, with icon tool buttons; shorter fields in the Table Generator.

2.6.8: Toolkit in Expert and UB mode (palette + PETSCII codes beside the editor), resizable Monitor / Toolkit panels and every panel's open state and width remembered across restarts; VMA language: zero-page .const / .var make lda zp a zero-page instruction (lda.abs zp keeps absolute), JMP (label), expressions like lda $1234+1, a macro calling a macro, labels in .data / .rawbytes bytes, an included file's own .include / .incbin / .sid loaded and its macros expanded; errors instead of wrong code (missing or self-including include, unresolved TURBO_SET / SPRITE_ANIM, a MEMCPY / MEMSET / JOYSTICK size from a later label); fixed: a CRT over 8 KB did not start (the loader runs from RAM), an .asm name in a project's Save dialog saves text.

2.6.7: Rust VMA compiler selectable in Settings -> General -> Program -> VMA compiler (JavaScript default, Rust, Rust + JavaScript check; same bytes, memory view, segments and translated errors; Kick projects too), VMA is open source (github.com/zstarczali/VMA, 2.0.0, English and Hungarian language manuals; version and banner in the About box), project VMA symbols (.define) and constants (.const) in Project settings, a step line in the compiling dialog, Build info with the file path and a real ACME view, faster typing in ACME mode and big Kick projects, Move up / down in the project tree (the Kick toggle button moved into Project settings), the About box frame on more dialogs; fixed: saving an .asm writes text, not JSON; version control snapshots keep source files as text; library macro parameters inside user macros, unique runtime IF / WHILE / REPEAT labels per call, 'A' arguments; draggable dialogs open at their saved place.

2.6.6: SID player macro (.sid_player [subtune][, raster] inits the .sid tune and plays it from a raster IRQ; .sid defines SID_LOAD / SID_INIT / SID_PLAY), per-project Expert mode only (Project settings), SID Player buffer setting (WebSID 2048-16384 samples, VA SID Core renders 10-30 s ahead), custom C64 palette editor (16 RGB colours; Photoshop .act / VICE .vpl / GIMP .gpl import, .act / .vpl export), the memory panel docks back collapsed, framed What's New / update / Settings / Knowledge Base windows, VA switches in Project settings; fixed: bug report screenshots (PNG / JPG) in the release build, the splash READY. cursor on macOS, macOS inline predictive text in the code editors.

2.6.5: KickAssembler projects (Import Kick project… builds a whole KickAssembler source tree with #import, .for, .if, .function, .macro, .pseudocommand, scopes and namespaces byte for byte like KickAssembler 5.25), LoadBinary / LoadSid / virtual blocks, Project settings with cmdLineVars and #define, Kick-compatible switch for VMA projects, Build Info in columns, C64 colour palette setting (Colodore by default), colour picker and Ctrl + wheel zoom in the editors, ACME memory map from the ACME build, .byte / .word label expression fix.

2.6.4: ACME assembler mode (ACME 0.97 builds the Expert source; Disassembly, Monitor, cycle counts, hints and the VICE Monitor follow the ACME build), better Kick Assembler import (.text with .encoding, .label x = * + 1, .abs / .zp; Restore64 sources build byte for byte like KickAssembler), Run starts programs that load below the BASIC line, Exomizer second-RUN ?SYNTAX ERROR fixed, SID Editor playback LCD and VA-VK instrument knob, Settings in three tabs, Ctrl+N opens a new tab.

2.6.3: .sid import in the SID Editor (any PSID / RSID tune becomes editable instruments, patterns and a song), long tunes no longer run into I/O in the exported player, VA SID Core preview retriggers restarted notes, the SID Editor header shows the active SID emulation, Speed field with - / + buttons; Ultimate Basic 1.6.6 (PRINT USING, string comparison, floating-point RND and MOD, option basic print, smaller programs).

2.6.2: High Voltage SID Collection in the SID Player (search about 61,000 tunes, play, save, download the whole collection for offline use, real tune lengths), spectrum analyzer window for the SID Player, Lesson Editor for step-by-step guided lessons made from your own program, online lessons from www.c64va.pro, every macro takes its parameters in the palette's operand field, the active floating window is highlighted, Support window in chat style.

2.6.1: VICE Monitor (hot reload, live watch, profiler), Table Generator with speedcode, cycle counts and optimisation hints in Expert mode, zero page usage map, detachable memory window, Ultimate Basic code size per line and hints, Sprite Editor to Ultimate Basic export, .sid (PSID) export, sprite multiplexer template.

2.6.0: Visual Assembler is now completely free: the Freemium / Professional licensing has been removed, so every editor, build and hardware run option, all 7 languages and every theme work without registration or a serial. Under Hungarian tax rules, selling it would leave too little after taxes and paperwork to be worth it. Serials you already have are simply no longer needed.

2.5.9: New themes: Commodore 64 (the blue power-on screen with a light blue border), Commodore Beige (the classic breadbin, C64 blue monitor) and Commodore Starlight (frosted clear glass with a rainbow glow). The Version control dialog can be moved and remembers its position.

2.5.8: Version control: git-like commits, log, diff and checkout on every tab, with optional Git integration (choose git.exe in Settings). Report Bug form with screenshots. SID Player: shuffle and favourites.

2.5.7: VA SID Core 1.2: the SID Player runs tunes on a native Rust C64 core (cycle-exact 6510, CIA 6526A, VIC-II timing with bad lines and sprite DMA, 6510 I/O port). Hi-Res Editor: two colours in every 8x8 cell with the new Cell paper tool. Exact C64 character ROM in the ROM viewer and the Character / Map / Level editors. Sprite Editor: hi-res overlay layer, flood fill, select / move, rotate 90 degrees, Mirror all, sprite sheet import, hitbox per frame, X / Y x2 preview, zoom up to 40x. Level Editor: objects layer, character attributes, edge check, colours per screen, memory meter with RLE export, Run in VICE.

2.5.6: New SID Player: a floating player for .sid (PSID / RSID) tunes with a playlist (drag and drop, save / open), subtunes, seek and volume. VA SID Core 1.1: a built-in SID emulation (MOS 6581 / 8580) with a cycle-locked PSID / RSID player, selectable in Settings -> SID preview. SID Editor: knobs, MIDI input, recording into the tracker, metronome, pattern delete and Import GoatTracker .sng. Ultimate Basic 1.6.4 bundled.

2.5.5: Hi-Res Editor: with Grid on, from 4× zoom every pixel gets its own grid line, stronger on the character-cell borders and shaded to stay visible on all 16 colours; the zoom now goes up to 16×. New right-click menu on the canvas of the Hi-Res and Map editors (Copy, Paste, Transparent paste) and of the Sprite Editor (Copy frame, Paste frame, also on the frame strip); a paste started from the menu previews where you clicked. The Number Converter toolbar button stays highlighted while the converter is shown. Fixed: the multicolor cell grid of the Hi-Res Editor was drawn twice as wide as a character cell; the Hi-Res toolbar Paste button always pasted transparently; the SID Editor right-click menu opened away from the cursor while the dialog was centred. The manual now documents selection, copy and paste in the Hi-Res Editor.

2.5.4: Fixed the main window not appearing on relaunch: when the app was quit with its window minimized or hidden (mostly macOS, also Linux / Wayland), the saved window state brought it back hidden and the next start showed no window. The visible state is no longer saved (the window size still is), and the window is always shown at startup. Ultimate Basic 1.6.3 bundled: QBasic-style syntax — DIM name AS type for variables and arrays of every type, FUNCTION / SUB with AS types, ELSEIF, DO ... LOOP, WHILE ... WEND, SELECT CASE, EXIT DO / EXIT SUB, single-line IF, ' comments and PRINT a; b; c; runtime strings (LEFT$ / RIGHT$ / MID$) and signed 16-bit INTEGER — with highlighting, autocomplete, formatting and command help in the UB editor.

2.5.3: Fixed running in VICE / RetroDebugger on Windows: it failed with "program not found" when PowerShell was missing from PATH. PowerShell is now called by its full path, the program is started directly if that fails, VICE starts from its own folder, and paths with spaces are quoted.

2.5.2: every SID Editor preview now plays on the real SID (WebSid) — instrument Preview, virtual keyboard, note entry, chord, arpeggio, row and single-pattern playback — through a register stream fed frame by frame by the same engine as the exported player (the small synthesizer remains only as a fallback without WebSid); the stream player is preloaded so notes sound at once. The wave / arpeggio preset list keeps the chosen preset until the table is edited by hand. Tracker: a note-off (===, key 1 or typing === / OFF) releases the gate so the instrument's release runs — a note otherwise sustains until the next note, as in other trackers; Enter edits the selected cell; the tracker can be detached into a floating, resizable panel and docked back. The virtual keyboard is now called VA-VK, has Play / Stop buttons and remembers its position and settings, and the SID editor remembers its master volume. Knowledge Base: new links (C64 OS development environment, png2c64 image converter) in a two-column list.

2.5.1: SID Editor instruments like a real tracker — filter routing per voice, 3 OFF and a cutoff sweep (start, end, speed per frame, ping-pong) for resonant filter sweeps; instrument vibrato (delay, speed, depth); pulse width modulation (speed, min, max); gate timer, hard restart and first-frame waveform; a wave / arpeggio table with 25 presets (arpeggios, drums, lead / bass attacks, sound effects); RING and SYNC. The exported 6502 player was rewritten to run these every frame (JSR sid_frame from your own IRQ, less zero page), and the preview renders the same player through a small SID synthesizer, so edits are heard while playing and the row highlight follows speed changes; .bin saves keep instrument names and speed. The virtual keyboard can show 2, 3 or 4 octaves in a Commodore 64 synth look. Bundled Ultimate Basic 1.6.2: the tune block gains imod / ifilt / igate / itab lines, and the SID editor exports them. Also: bookmarks (Ctrl+F2 / F2 / Shift+F2) and Go to line (Ctrl+G) in the Expert and Ultimate Basic editors; label expressions (.assert, LEVEL_MULTICOLOR*16 ...) work in the installed app again (no eval under the release CSP); the D64 Editor file dialogs open in the active working folder; the Build project report names the output folder.

2.4.8: New KOALA macro — .koala "picture.koa" [, $2000] loads a Koala Painter picture and shows it: the data goes to $6000 (or $2000) and the block compiles to an 86-byte display routine (screen/color RAM copy, background colour, VIC bank, multicolor bitmap mode). The Hires editor can import and export Koala pictures (Files → Import Koala / Export Koala, standard 10003-byte .koa; hi-res pictures are converted to multicolor on export). Bundled Ultimate Basic 1.5.9 adds chain "FILE" [, device] (load another program over the running one and RUN it) and fixes load's secondary address and D64 writing. The update status now also shows in the Expert status bar, save dialogs offer the file's own type (e.g. .koa), and the update check reads the installer list from c64va.pro/downloads/VA/ so it keeps working with the new download page.

2.4.7: In-app updates — Menu → Check for Update checks c64va.pro for a newer release and, on confirmation, downloads the installer for your platform with a progress bar and installs it (Windows: passive installer + restart; macOS: app bundle replaced from the DMG; Linux: AppImage swapped or .deb/.rpm installed via pkexec). The check also runs quietly at every start, and the Ultimate Basic status bar shows "Up to date" or a clickable "Update available". Curve Editor → UltimateBasic export: the table as an initialised UB array (data name: …) plus a ready-to-run UB sprite demo. Bundled Ultimate Basic 1.5.8 with the new data <array>: initialiser. The editor panels now fit the window height (no page scrollbar), the ASM output panel keeps a 440 px minimum width, and the working-folder path uses a subtle badge.

2.4.6: SID Editor → UltimateBasic export — Files → Export to UltimateBasic writes the tune as a tune ... end block (instruments, order list and pattern rows as text) followed by music play, and inserts it at the cursor of the Ultimate Basic editor (outside UB mode it is copied to the clipboard). The UltimateBasic compiler builds a zero-page-free player from it at compile time, so music play / music stop control the tune and nothing collides with UB variables. Vibrato, slide, note-cut and speed effects are supported; up to 8 patterns, any order-list length. Requires an UltimateBasic compiler with tune support. Ultimate Basic language update — syntax highlighting and the command reference now cover sfx (non-blocking SID effect: sfx channel, freq, frames [, wave]), org (continue sub/fn code at an address, leaving a zero-filled gap that can hold incbin data), charset on / charset off (switch the VIC-II to the RAM character set and back) and incbin slicing (incbin "font.prg", $3C00, 2 skips the first bytes, an optional fourth argument limits the length). Multi-block highlight in the ASM view — selecting several blocks highlights all of their ASM lines at once, the scroll position stays stable while you select, and the line numbers are softer with a subtle vertical separator rule. Assembler mode preserved across Ultimate Basic switches — opening a project or a built-in sample while Ultimate Basic is active now leaves UB first and returns to your last Block/Expert mode, so the UB buffer can no longer overwrite the new tab's mode or title. New tabs are created in the correct mode. Kung Fu Flash 2 settings — a Detect USB button in Hardware Settings re-scans for the cartridge's serial port, and the KFF2 prerequisites now state the required Kung Fu Flash firmware (v2.07+).

2.4.5: Kung Fu Flash 2 support — a new "Kung Fu Flash 2" entry in the split Run menu compiles the program and uploads it over USB straight into a real, powered-on Commodore 64/128 fitted with a Kung Fu Flash 2 cartridge (no disk image, SD card or emulator needed). The cartridge's serial port is auto-detected in Hardware Settings (or can be typed in by hand) and the mode works from Block, Expert and Ultimate Basic mode. Resizable Program / ASM panels via a draggable vertical splitter (remembered between sessions). Cleaner ASM view: macro lines are shown without the leading comment marker and coloured as macros. Expert editor now highlights custom macro names, parameters and {param} substitutions. Refreshed About dialog with a transparent Ultimate Basic banner. New Web64 section on the product site.

2.4.3: SID Editor effect column — every tracker cell can carry an effect alongside its note: vibrato (V), slide up/down (U/D), note-cut (C), and speed-change (F), played back correctly both in the Web Audio preview and the compiled 6502 export. New SID Editor song/order list arranges and repeats patterns into a full song instead of a single loop; older saves keep loading correctly. D64 Editor edits (add/extract/rename/delete, and Block Editor byte edits) now happen on a private working copy with an explicit Save step (automatic backup included) and unsaved-change prompts. Block Editor's raw byte view is now a per-byte hex grid, and its dialog no longer dims the rest of the app.

2.4.2: D64 Editor drag & drop — drop a compiled .prg/.bin file straight onto the disk image to add it (multiple files queue one after another). New "Generate include file" toolbar button writes a .inc file with a .const NAME = $ADDR line per disk entry. New block editor toolbar toggle: raw track/sector access below the directory, with a clickable BAM-colored block map, a hex view/editor for the selected 256-byte block, and Prev/Next sector navigation, independent of c1541.

2.4.1: New D64 Editor toolbar tool — open an existing .d64, create a blank one, or launch it in VICE from a Files menu, then add/extract/rename/delete directory entries directly on the disk image via c1541 (no separate save step). Adding a headerless file supports an optional load address, an Exomizer decompress target and mem/sfx compression (same modes as Export to D64), plus a PRG/SEQ/USR/REL type selector. The directory listing renders in the bundled C64 Pro font, uppercase, like a real LOAD"$",8. Fixed the D64 Editor rename field losing the edit on click. Light theme's mode-indicator badge is darker/more legible with a visible shimmer again. Toolbar separators added around Tutorials and the new D64 Editor icon.

2.3.9: `*` program counter usable in any operand expression (BNE *-5, JMP *+20, LDA #<*, LDA #>(*+63)); multiplication is unaffected. Local (dotted) labels scoped to the nearest preceding global label, so repeated .loop / .skip names no longer collide. Long-branch pseudo-ops LBNE/LBEQ/LBCC/LBCS/LBMI/LBPL/LBVC/LBVS assemble to an inverted branch over a JMP (5 bytes, unlimited range). New .assert <expr> [, "message"] directive checked at assembly time. Self-modifying-code operand labels: LDA value:#$00 makes 'value' point at the operand byte. Out-of-range branch errors now show the exact overshoot and suggest the matching LBxx.

2.3.8: Workspace save/open (.vaws) persists the exact set of open file-backed tabs, the active tab and each tab's editor mode, with auto-save and last-workspace auto-restore on launch. New global memory panel toggle. Ultimate Basic command reference (autocomplete + Commands panel) is now localized in HU/EN/ES/DE/NL with English fallback. Refreshed Ultimate Basic graphics command help text (COLOR PEN, plot/line/rect/circle, multicolor). Corrected SETLFS and PLOT entries in the KERNAL reference table. Fixed high memory usage with many tabs open: per-tab undo/redo history is now capped with a debounce. Removed redundant Expert/UB breakpoint toolbar buttons (still set via the line-number gutter) and aligned the Expert toolbar height with the Ultimate Basic toolbar.

2.3.7: Undo/Redo and multi-block editing in block mode. Breakpoints in Block, Expert and Ultimate Basic modes with external RetroDebugger source maps, labels and corrected SYS/PRG startup. Optional BASIC stub display in Disassembler and Monitor views, plus a new Ultimate Basic Monitor panel. Corrected PRG load-address handling for debugger/disassembly output. Ultimate Basic caret, blank-line navigation, held cursor keys and minimap bounds fixed; UB and Expert line-number alignment improved.

2.3.6: Build CRT (Magic Desk 64K cartridge) export in block, Expert and Ultimate Basic modes. Menu -> Build -> Build CRT produces a .crt (cartridge type 19) with a bank-0 loader that copies the payload from cart ROM into RAM and jumps to the entry point. Runs on VICE, TheC64, EasyFlash, Kung Fu Flash and 1541 Ultimate II+ / Ultimate 64. Max payload 65 408 bytes across 8 x 8 KB banks. New: '//' line comments in the Expert editor (in addition to ';'). New: Ultimate Basic "Explicit type declarations" toggle (type/endtype record blocks, highlighter + formatter + compiler support, localized). New: Map Editor 'Load color map (.bin)' import (1000-byte Color RAM overlay). D64 export dialog input height fixed. Manual updated with CRT caveat (KERNAL RESTOR re-inits I/O vectors and CIAs).

2.3.5: CHARDEF and BOX_HIT are now syntax-highlighted in the Expert editor; the Ultimate Basic editor matches the Expert editor (Format cursor fix, consistent Tab and cursor tracking); UB font size is remembered across sessions; the startup welcome dialog gains an Ultimate Basic manual button that opens the same manual as the editor's manual button.

Built on Ubuntu 22.04, so it runs there and on newer distributions; tested on Ubuntu 22.04 and 24.04.

---

## 1. C64 Visual Assembler

Download the `.deb` package from the releases page and install:

```bash
  sudo dpkg -i "c64-visual-assembler_2.8.3_amd64.deb"
sudo apt-get install -f   # fix any missing dependencies
```

Launch from the Applications menu or:

```bash
c64-visual-assembler
```

---

## 2. Run modes overview

Visual Assembler can run the assembled program in several ways. Only the VICE-based modes need a local VICE installation:

| Run mode | Local install needed |
|---|---|
| **Run as PRG** / **Run via D64** | VICE (sections 2–3 below) |
| **Run on hardware** | A 1541 Ultimate / Ultimate 64 on your local network |

---

## 3. VICE Emulator

### Install via apt

```bash
sudo apt install vice
```

The emulator binary is `x64sc` (cycle-exact C64). After installing, configure the path in Visual Assembler:

**Menu → Settings → "Choose VICE"** → select `/usr/bin/x64sc`

### Important: ROMs

The `vice` apt package **does not include C64 ROMs** (copyright). Without them, VICE shows an error and refuses to start — except in PRG inject mode (see below).

The following ROM files are required, placed in `~/.local/share/vice/C64/`:

| File | Description |
|------|-------------|
| `kernal` | C64 KERNAL ROM (8 KB) |
| `basic` | C64 BASIC 2.0 ROM (8 KB) |
| `chargen` | Character generator ROM (4 KB) |

For **Run via D64** mode (disk image), VICE also needs a drive ROM:

| File | Description |
|------|-------------|
| `dos1541` | 1541 original drive ROM |
| `d1541-II` | 1541-II drive ROM (preferred) |

Copy them:

```bash
mkdir -p ~/.local/share/vice/C64
cp kernal basic chargen dos1541 d1541-II ~/.local/share/vice/C64/
```

> ROMs can be extracted from a real Commodore 64 and 1541-II drive, or sourced from an existing licensed VICE installation on another platform.

### PRG mode works without drive ROMs

The app uses `-autostartprgmode 1` (direct inject) when launching PRG files on Linux, so **Run as PRG** works even without drive ROMs. Drive ROMs are only needed for **Run via D64**.

### Verify VICE finds the ROMs

```bash
x64sc -config /dev/null 2>&1 | grep -i "rom\|error" | head -20
```

If ROMs are missing, VICE prints lines like `Cannot open kernal ROM`.

---

## 4. Exomizer (Optional)

Exomizer is not in the Ubuntu apt repository — compile from source.

### Build and install (one-liner)

```bash
sudo apt update && sudo apt install -y build-essential wget unzip && \
wget https://bitbucket.org/magli143/exomizer/wiki/downloads/exomizer-3.1.2.zip && \
unzip exomizer-3.1.2.zip -d exomizer_source && \
cd exomizer_source/src && make && \
sudo cp exomizer /usr/local/bin/ && \
echo "Exomizer installed successfully."
```

### Configure in Visual Assembler

**Menu → Settings → Exomizer section → "Choose Exomizer"** → select `/usr/local/bin/exomizer`

Enable compression with the **"Run with Exomizer"** checkbox.

Both `sfx sys` (Run/Build toggle) and `mem` mode (per-file EXO in the Run via D64 dialog) are supported.

---

## 5. Wayland / Display issues

If VICE fails to launch from the app, it may be a display session variable issue. Run the app from a terminal first to check for error output:

```bash
c64-visual-assembler
```

The app propagates `DISPLAY`, `WAYLAND_DISPLAY`, `XDG_RUNTIME_DIR`, `DBUS_SESSION_BUS_ADDRESS`, and `GDK_BACKEND` to the VICE process automatically.

---

## Troubleshooting

- **Blank window, with `Failed to create GBM buffer` in the terminal:** start the application with `WEBKIT_DMABUF_RENDERER_DISABLE_GBM=1`, and if that does not help, with `WEBKIT_DISABLE_DMABUF_RENDERER=1` in front of its command.
- **No sound, with `GStreamer element ... not found` in the terminal:** the SID Player seems to run, but stays silent. Install the plugins: `sudo apt install gstreamer1.0-plugins-base gstreamer1.0-plugins-good gstreamer1.0-alsa gstreamer1.0-pulseaudio`.

**Version:** 2.8.3 | **Support:** https://zstarczali.itch.io/visual-assembler-commodore-64
