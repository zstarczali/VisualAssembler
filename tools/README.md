# Bundled tools

`node scripts/build-tools.mjs [--target <rust triple>] [--only oscar64|acme]` fills this folder with the command line tools the app ships with:

- `oscar64/bin/oscar64[.exe]` + `oscar64/include/` — Oscar64 C compiler v1.32.273 (GPL-3.0, github.com/drmortalwombat/oscar64). Windows: the official release zip; elsewhere built from the same tag with `c++`.
- `acme/bin/acme[.exe]` — ACME cross assembler 0.97, SVN r517 (GPL-2.0-or-later, sourceforge.net/projects/acme-crossass), built from source (Windows: MSVC `cl`).

Each tool folder has its license and a `VERSION` file (first line = the version the About box shows).
The Release workflow runs the script before `tauri build`; the folder is bundled as the `tools/` resource.
A path set in Settings overrides the bundled tool. Everything here except this README is gitignored.
