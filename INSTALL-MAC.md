# macOS Installation Guide

## Quick Install

1. **Download**: `C64 Visual Assembler-1.1.0-arm64-final.dmg`
2. **Mount** the DMG and drag the app to `/Applications`
3. **First launch**: Right-click the app → **"Open"** (macOS will block double-click)
4. Click **"Open"** in the security dialog

After first launch, the app will open normally.

## VICE Emulator (Required)

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

---

**Version:** 1.6.6 | **Support:** https://zstarczali.itch.io/visual-assembler-commodore-64

