# Linux Installation Guide (Ubuntu / Debian)
Version 2.1.6

2.1.6: custom CSS tooltips wired to all remaining buttons; auto-snapshot toggle in Hardware Settings; dark-mode scrollbar fix for macOS; rotcube sample addressing-mode glitch fixed.

Tested on Ubuntu 22.04 and 24.04.

---

## 1. C64 Visual Assembler

Download the `.deb` package from the releases page and install:

```bash
  sudo dpkg -i "c64-visual-assembler_2.1.6_amd64.deb"
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
| **Run in Browser** | Nothing extra — opens [VirtualC64Web](https://vc64web.github.io/) in your default browser |
| **D64 in Browser** | VICE (only for the `c1541` utility used to build the disk image) |
| **Run on hardware** | A 1541 Ultimate / Ultimate 64 on your local network |

The browser modes are the simplest way to try the app on Linux without dealing with VICE ROMs at all.

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

**Version:** 2.1.6 | **Support:** https://zstarczali.itch.io/visual-assembler-commodore-64
