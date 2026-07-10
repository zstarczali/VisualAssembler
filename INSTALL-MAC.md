# macOS Installation Guide
Version 2.2.0

2.2.0: the project panel now supports project folders with direct source-file opening, relative project file names are fixed, and the expert project icons use custom aria-label tooltips.

## Quick Install

1. **Download** the 2.2.0 DMG for your architecture from the releases page
2. **Mount** the DMG and drag the app to `/Applications`
3. **First launch**: Right-click the app → **"Open"** (macOS will block double-click)
4. Click **"Open"** in the security dialog

After first launch, the app will open normally.

## Run modes overview

Visual Assembler offers several ways to run the assembled program. Only the VICE-based modes need a local VICE installation:

| Run mode | Local install needed |
|---|---|
| **Run as PRG** / **Run via D64** | VICE (see below) |
| **Run in Browser** | Nothing extra — opens [VirtualC64Web](https://vc64web.github.io/) in your default browser |
| **D64 in Browser** | VICE (only for the `c1541` utility used to build the disk image) |
| **Run on hardware** | A 1541 Ultimate / Ultimate 64 on your local network |

The browser modes are the simplest way to try the app without installing VICE.

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

**Version:** 2.2.0 | **Support:** https://zstarczali.itch.io/visual-assembler-commodore-64
