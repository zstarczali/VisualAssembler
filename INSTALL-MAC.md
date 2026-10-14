# macOS Installation Guide
Version 2.5.9

2.5.9: New Professional themes: Commodore 64 (the blue power-on screen with a light blue border), Commodore Beige (the classic breadbin, C64 blue monitor) and Commodore Starlight (frosted clear glass with a rainbow glow). The Version control dialog can be moved and remembers its position.

2.5.8: Version control: git-like commits, log, diff and checkout on every tab, with optional Git integration (choose git.exe in Settings). Report Bug form with screenshots. Professional serial by email (supporters, or PayPal purchase on c64va.pro). SID Player: shuffle and favourites.

2.5.7: VA SID Core 1.2: the SID Player runs tunes on a native Rust C64 core (cycle-exact 6510, CIA 6526A, VIC-II timing with bad lines and sprite DMA, 6510 I/O port). Hi-Res Editor: two colours in every 8x8 cell with the new Cell paper tool. Exact C64 character ROM in the ROM viewer and the Character / Map / Level editors. Sprite Editor: hi-res overlay layer, flood fill, select / move, rotate 90 degrees, Mirror all, sprite sheet import, hitbox per frame, X / Y x2 preview, zoom up to 40x. Level Editor: objects layer, character attributes, edge check, colours per screen, memory meter with RLE export, Run in VICE.

2.5.6: New SID Player: a floating player for .sid (PSID / RSID) tunes with a playlist (drag and drop, save / open), subtunes, seek and volume. VA SID Core 1.1: a built-in SID emulation (MOS 6581 / 8580) with a cycle-locked PSID / RSID player, selectable in Settings -> SID preview. SID Editor: knobs, MIDI input, recording into the tracker, metronome, pattern delete and Import GoatTracker .sng. Freemium and Professional versions: register in Menu -> Register... with the email address and serial from your purchase. Ultimate Basic 1.6.4 bundled.

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

## Quick Install

1. **Download** the 2.5.9 DMG for your architecture from the releases page
2. **Mount** the DMG and drag the app to `/Applications`
3. **First launch**: Right-click the app → **"Open"** (macOS will block double-click)
4. Click **"Open"** in the security dialog

After first launch, the app will open normally.

## Run modes overview

Visual Assembler offers several ways to run the assembled program. Only the VICE-based modes need a local VICE installation:

| Run mode | Local install needed |
|---|---|
| **Run as PRG** / **Run via D64** | VICE (see below) |
| **Run on hardware** | A 1541 Ultimate / Ultimate 64 on your local network |

## VICE Emulator (for VICE-based run modes)

1. Download VICE for Mac: https://vice-emu.sourceforge.io/ (GTK3 ARM64 version)
2. Install VICE to `/Applications`
3. In Visual Assembler: Menu → Settings → **"Choose VICE"** → select `x64sc.app`

## Troubleshooting

**"App is damaged" error:**
1. Go to **System Settings** → **Privacy & Security**
2. Scroll down and click **"Open Anyway"** next to the blocked app message
3. OR run in Terminal:
```bash
xattr -cr "/Applications/C64 Visual Assembler.app"
```

**Requirements:** macOS 11.0+, Apple Silicon (M1/M2/M3)

## Exomizer (Optional)

Compress PRG files with Exomizer for smaller binaries and faster loading:

1. Install Exomizer:
   - **Homebrew (recommended):** `brew install exomizer` — installs Magnus Lind's official 3.1.2 build to `/opt/homebrew/bin/exomizer` (Apple Silicon) or `/usr/local/bin/exomizer` (Intel).
   - **From source:** clone https://bitbucket.org/magli143/exomizer/ and `make` in the `src/` folder.
2. In Visual Assembler: Menu → Settings → **"Settings..."** → Exomizer section → **"Choose Exomizer"** and pick the binary.
3. Enable via the **"Run with Exomizer"** checkbox in Menu → Settings.

Both `sfx sys` (Run/Build with Exomizer toggle) and `mem` mode (per-file EXO in the Run via D64 dialog) work the same way on macOS as on Windows.

---

**Version:** 2.5.9 | **Support:** https://zstarczali.itch.io/visual-assembler-commodore-64
