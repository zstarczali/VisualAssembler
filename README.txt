C64 Visual Assembler - Installation Guide
Version 2.2.1
Support: https://zstarczali.itch.io/visual-assembler-commodore-64
==========================================================================

2.2.1: new Kick Assembler ASM import button on the Program menu (with a custom tooltip flagging Kick-only source), embedded BASIC autostart is preserved when re-emitting the PRG, macro invocations with the Kick :NAME(args) syntax round-trip correctly, and #<N / #>N low/high-byte immediates stay decimal in macro expansions.


==========================================================================
LINUX (Ubuntu / Debian)
Tested on Ubuntu 22.04 and 24.04.
==========================================================================

1. C64 Visual Assembler
-----------------------
Download the .deb package from the releases page and install:

  sudo dpkg -i "c64-visual-assembler_2.2.1_amd64.deb"
  sudo apt-get install -f   # fix any missing dependencies

Launch from the Applications menu or:

  c64-visual-assembler


2. VICE Emulator
----------------
Install via apt:

  sudo apt install vice

The emulator binary is x64sc (cycle-exact C64). After installing, configure
the path in Visual Assembler:

  Menu -> Settings -> "Choose VICE" -> select /usr/bin/x64sc

IMPORTANT: ROMs
The vice apt package does NOT include C64 ROMs (copyright). Without them,
VICE shows an error and refuses to start - except in PRG inject mode.

Required ROM files, placed in ~/.local/share/vice/C64/:

  kernal     - C64 KERNAL ROM (8 KB)
  basic      - C64 BASIC 2.0 ROM (8 KB)
  chargen    - Character generator ROM (4 KB)

For "Run via D64" mode (disk image), VICE also needs drive ROMs:

  dos1541    - 1541 original drive ROM
  d1541-II   - 1541-II drive ROM (preferred)

Copy them:

  mkdir -p ~/.local/share/vice/C64
  cp kernal basic chargen dos1541 d1541-II ~/.local/share/vice/C64/

ROMs can be extracted from a real Commodore 64 and 1541-II drive, or sourced
from an existing licensed VICE installation on another platform.

NOTE: The app uses -autostartprgmode 1 (direct inject) when launching PRG
files on Linux, so "Run as PRG" works even without drive ROMs. Drive ROMs
are only needed for "Run via D64".

Verify VICE finds the ROMs:

  x64sc -config /dev/null 2>&1 | grep -i "rom\|error" | head -20

If ROMs are missing, VICE prints lines like "Cannot open kernal ROM".


3. Exomizer (Optional)
-----------------------
Exomizer is not in the Ubuntu apt repository - compile from source.

Build and install (one-liner):

  sudo apt update && sudo apt install -y build-essential wget unzip && \
  wget https://bitbucket.org/magli143/exomizer/wiki/downloads/exomizer-3.1.2.zip && \
  unzip exomizer-3.1.2.zip -d exomizer_source && \
  cd exomizer_source/src && make && \
  sudo cp exomizer /usr/local/bin/ && \
  echo "Exomizer installed successfully."

Configure in Visual Assembler:

  Menu -> Settings -> Exomizer section -> "Choose Exomizer"
  -> select /usr/local/bin/exomizer

Enable compression with the "Run with Exomizer" checkbox.
Both sfx sys and mem modes are supported.


4. Wayland / Display issues
----------------------------
If VICE fails to launch from the app, it may be a display session variable
issue. Run the app from a terminal first to check for error output:

  c64-visual-assembler

The app propagates DISPLAY, WAYLAND_DISPLAY, XDG_RUNTIME_DIR,
DBUS_SESSION_BUS_ADDRESS, and GDK_BACKEND to the VICE process automatically.


==========================================================================
macOS
Requirements: macOS 11.0+, Apple Silicon (M1/M2/M3)
==========================================================================

1. C64 Visual Assembler
-----------------------
1. Download the 2.2.1 DMG for your architecture from the releases page
2. Mount the DMG and drag the app to /Applications
3. First launch: Right-click the app -> "Open" (macOS will block double-click)
4. Click "Open" in the security dialog

After first launch, the app will open normally.


2. VICE Emulator (Required)
----------------------------
1. Download VICE for Mac: https://vice-emu.sourceforge.io/
   (GTK3 ARM64 version)
2. Install VICE to /Applications
3. In Visual Assembler: Menu -> Settings -> "Choose VICE" -> select x64sc.app


3. Troubleshooting
-------------------
"App is damaged" error:
  Option A:
    Go to System Settings -> Privacy & Security
    Scroll down and click "Open Anyway" next to the blocked app message

  Option B (Terminal):
    xattr -cr "/Applications/C64 Visual Assembler.app"


4. Exomizer (Optional)
-----------------------
Compress PRG files with Exomizer for smaller binaries and faster loading.

Install via Homebrew (recommended):

  brew install exomizer

This installs Magnus Lind's official 3.1.2 build to:
  /opt/homebrew/bin/exomizer  (Apple Silicon)
  /usr/local/bin/exomizer     (Intel)

Or build from source:
  Clone https://bitbucket.org/magli143/exomizer/ and run make in src/.

Configure in Visual Assembler:

  Menu -> Settings -> "Settings..." -> Exomizer section
  -> "Choose Exomizer" -> pick the binary

Enable via the "Run with Exomizer" checkbox in Menu -> Settings.
Both sfx sys and mem modes work the same way as on Windows.
