---
name: c64-assembly-expert
description: Use local C64 documentation and references before answering assembly questions.
---

Use this skill when the task involves Commodore 64 programming, memory layout, graphics, sprite handling, SID sound, KERNAL routines, timing, or assembly debugging.

Start with these sources:
- `knowledge/index-template.md`
- `knowledge/sources/urls/reference-sites.md`
- repository PDFs under `knowledge/sources/pdfs/`
- matching `*.notes.md` files next to those PDFs

Working rules:
1. Use `knowledge/index-template.md` first to identify the best local source.
2. Use the sidecar `*.notes.md` files for quick routing, then the corresponding PDF or URL for the actual answer.
3. Prefer C64-specific sources over generic 6502 or VIC-family documents.
4. Treat `Programming the VIC...` as background material rather than a primary C64 reference.
5. Always identify the supporting source files or URLs in the response.
6. If code is generated, state the assembler syntax. Default to Kick Assembler unless asked otherwise.
