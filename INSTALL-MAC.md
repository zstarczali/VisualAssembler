# macOS Installation Guide
Version 2.3.7

2.3.7: Undo/Redo and multi-block editing in block mode. Breakpoints in Block, Expert and Ultimate Basic modes with external RetroDebugger source maps, labels and corrected SYS/PRG startup. Optional BASIC stub display in Disassembler and Monitor views, plus a new Ultimate Basic Monitor panel. Corrected PRG load-address handling for debugger/disassembly output. Ultimate Basic caret, blank-line navigation, held cursor keys and minimap bounds fixed; UB and Expert line-number alignment improved.

2.3.6: Build CRT (Magic Desk 64K cartridge) export in block, Expert and Ultimate Basic modes. Menu -> Build -> Build CRT produces a .crt (cartridge type 19) with a bank-0 loader that copies the payload from cart ROM into RAM and jumps to the entry point. Runs on VICE, TheC64, EasyFlash, Kung Fu Flash and 1541 Ultimate II+ / Ultimate 64. Max payload 65 408 bytes across 8 x 8 KB banks. New: '//' line comments in the Expert editor (in addition to ';'). New: Ultimate Basic "Explicit type declarations" toggle (type/endtype record blocks, highlighter + formatter + compiler support, localized). New: Map Editor 'Load color map (.bin)' import (1000-byte Color RAM overlay). D64 export dialog input height fixed. Manual updated with CRT caveat (KERNAL RESTOR re-inits I/O vectors and CIAs).

2.3.5: CHARDEF and BOX_HIT are now syntax-highlighted in the Expert editor; the Ultimate Basic editor matches the Expert editor (Format cursor fix, consistent Tab and cursor tracking); UB font size is remembered across sessions; the startup welcome dialog gains an Ultimate Basic manual button that opens the same manual as the editor's manual button.

## Quick Install

1. **Download** the 2.3.7 DMG for your architecture from the releases page
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

**Version:** 2.3.7 | **Support:** https://zstarczali.itch.io/visual-assembler-commodore-64
