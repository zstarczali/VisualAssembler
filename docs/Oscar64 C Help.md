# Oscar64 C — Help

A practical reference for writing Commodore 64 programs in C with **Oscar64** inside Visual Assembler Studio.

Oscar64 is a C / C++ cross compiler for the 6502 family by Dr. Mortal Wombat
(<https://github.com/drmortalwombat/oscar64>, GPL-3.0). Visual Assembler ships with
**Oscar64 v1.32.273** built in (`tools/oscar64`), so no separate install is needed.
The full upstream manual is `oscar64.md` in the Oscar64 repository; this page is a condensed,
C64-focused version of it plus how Visual Assembler uses the compiler.

---

## 1. Oscar64 in Visual Assembler

| What | Where |
|------|-------|
| New C file | **New** menu → C, or a C template (**New** → From template… → C tab) |
| Open a C folder / project | Start window → *Open C folder*, or a `.proj` with `"app": "oscar64"` |
| Build / Run | the usual Build and Run buttons; every Run mode works (VICE, built-in C64, Ultimate, KFF2, D64…) |
| Compiler output | errors and warnings in the **Output** view; Settings → Compilers → *Verbose compiler output* adds the compiler steps (`-v`) |
| Generated code | **Disassembly** (the compiler's `.asm` listing), **Monitor**, **Map** views |
| Cycle counts | the cycle gutter next to each C line (from the `.dbj` debug file) |
| Optimization | Settings → Compilers → Oscar64 optimization, or Project settings → Optimization |
| Own compiler | Settings → Compilers → Oscar64 path (otherwise the bundled one is used) |

**Project settings for C** (the project panel's settings button): name, startup file, optimization
level, defines (`-d`), include folders (`-i`). The project always builds its startup file (★);
a file outside the project builds itself.

**Projects from build scripts.** If a folder has a `build.sh`, `make.bat` or `makefile` that calls
`oscar64`, Visual Assembler reads it and creates the targets (◆ in the project tree). The
switches of the target are used for its file; output-only switches (`-o=`, `-tf=`, `-d64=`, `-fz=`,
`-e`, `-g`) are left out.

**Debugging.** The Debug build is compiled with `-O0 -g`, so local variables are visible. Step into /
over moves one C line, the **Variables** panel shows globals and the locals of the current function
(arrays and structs unfold with ▸), the **Call stack** shows the callers. Breakpoints are set in the
C line gutter.

**Editor helpers.** Ctrl+Space code completion (keywords, types, declarations of the included headers),
Format, Find (Ctrl+F), Go to line (Ctrl+G), bookmarks (Ctrl+F2 / F2 / Shift+F2), minimap.

---

## 2. Your first program

```c
#include <stdio.h>

int main(void)
{
    printf("HELLO WORLD\n");
    return 0;
}
```

The result is a `.prg` with a BASIC `SYS` line at `$0801`; `RUN` starts it, and returning from
`main` goes back to BASIC.

Direct hardware access through the C64 headers:

```c
#include <c64/vic.h>

int main(void)
{
    vic.color_border = VCOL_BLACK;
    vic.color_back   = VCOL_BLUE;

    for (;;)
    {
        vic_waitFrame();
        vic.color_border++;
    }
    return 0;
}
```

> There is no linker step and no library list: a header adds its own implementation to the
> build (`#pragma compile("vic.c")` inside the header), and only reachable code ends up in the PRG.

---

## 3. Types and arithmetic on the 6502

| Type | Size | Note |
|------|------|------|
| `char`, `unsigned char`, `byte` | 1 | `char` is **unsigned**; `byte` / `sbyte` come from `<c64/types.h>` |
| `signed char`, `sbyte` | 1 | |
| `int`, `short`, `unsigned`, `word` | 2 | |
| `long`, `unsigned long` | 4 | |
| `float` | 4 | software float, slow; no NaN |
| pointers | 2 | |

Rules of thumb for fast code:

- **Stay in 8 bits** whenever the value fits — every 16-bit operation costs several instructions.
- **Prefer unsigned** — signed shifts, compares and multiplies are more expensive.
- **Mark constant tables `const`** — the compiler then knows their value range.
  `char * const Screen = (char *)0x0400;` lets it use absolute addressing.
- **Prefer `enum` over `#define`** for small sets of values (limited range → byte code).
  C23 `enum Name : char { … }` is accepted.
- **Avoid recursion and function pointers** — they force a software stack instead of the static
  call-graph allocation; a `switch` is usually faster than a function pointer.
- **Arrays ≤ 256 elements** can be indexed with X / Y directly.

---

## 4. Compiler options

The command line form (Visual Assembler builds it for you):

```
oscar64 {-i=path} [-o=out.prg] [-tf=format] [-tm=machine] [-n] [-O2] [-dSYMBOL[=value]] source.c
```

### Optimization

| Option | Meaning |
|--------|---------|
| `-O0` | no optimization (best for debugging) |
| `-O1` / `-O` | default optimizations |
| `-O2` | speed, auto-inline of small functions, inline-asm optimizer (Visual Assembler default) |
| `-O3` | aggressive speed, also auto zero page placement of globals |
| `-Os` | optimize for size |
| `-Oi` | auto inline of small functions |
| `-Oa` | optimize inline assembler |
| `-Oz` | auto place globals in zero page |
| `-Op` | fold constant parameters into called functions |
| `-Oo` | outliner: extract repeated code into functions (smaller) |
| `-Ox` | keep short arrays from crossing page boundaries |
| `-OM` | allow self-modifying code |
| `-Ofp` | optimize function pointers |

### Other useful options

| Option | Meaning |
|--------|---------|
| `-n` | native 6502 code for all functions (default) |
| `-bc` | byte code (interpreted, smaller, slower) |
| `-g` | source level debug info (`.dbj`) and source lines in the `.asm` listing |
| `-gp` | as `-g`, plus a per-line code size file (`.csz`) |
| `-v`, `-v2` | verbose compiler output |
| `-dNAME[=value]` / `-D NAME=value` | define a symbol |
| `-i=path` | add an include folder |
| `-psci` | all unprefixed strings are PETSCII |
| `-xz` | more zero page, but no return to BASIC |
| `-pp` | C++ mode (also for `.cpp` files) |
| `-strict` | strict ANSI C |
| `-tf=` `prg` / `bin` / `crt` / `crt8` / `crt16` | output format (CRT = EasyFlash; `crt8` / `crt16` = generic 8K / 16K cartridge) |
| `-tm=` `c64` / `c128` / `plus4` / `vic20` … | target machine (default `c64`, `$0800–$A000`) |
| `-d64=disk.d64`, `-f=file`, `-fz=file` | build a disk image, add (compressed) files |

### Runtime library defines

| Define | Effect |
|--------|--------|
| `-dNOFLOAT` | no float support in `printf` (much smaller) |
| `-dNOLONG` | no long support in `printf` |
| `-dHEAPCHECK` | check `malloc` / `free`, jam on error |
| `-dNOBSSCLEAR` | do not clear BSS at startup |
| `-dNOZPCLEAR` | do not clear zero page BSS at startup |

---

## 5. Files the compiler writes

| File | Content |
|------|---------|
| `.prg` / `.crt` / `.bin` | the program |
| `.asm` | listing of the generated code (with C lines when `-g`) — Visual Assembler's Disassembly view |
| `.map` | regions, sections and objects with addresses and sizes — the Map view |
| `.lbl` | VICE monitor labels (`al 0801 .startup` …), load with `ll` or `-moncommands` |
| `.dbj` | JSON debug info: memory, variables, functions (lines, locals), types — used by the debugger and the cycle gutter |
| `.int` | intermediate code listing |
| `.csz` | code bytes per source line (`-gp`) |

---

## 6. C64 library

All headers are in `tools/oscar64/include`. The most used ones:

### Text and console — `<stdio.h>`, `<conio.h>`

```c
#include <conio.h>

iocharmap(IOCHM_PETSCII_2);   // lower/upper case font, translate strings
clrscr();
gotoxy(10, 5);
textcolor(COLOR_YELLOW);
printf("Score: %d\n", score);
char c = getch();             // wait for a key
if (kbhit()) { … }            // key waiting?
```

Also: `bgcolor`, `bordercolor`, `revers`, `wherex` / `wherey`, `textcursor`, `putch`, `getche`.

String literal prefixes: `p"…"` = PETSCII, `s"…"` = screen codes. `#pragma charmap(char, code[, count])`
remaps characters for a custom font.

### VIC-II — `<c64/vic.h>`

`vic` is the chip at `$D000` as a struct:

| Member | Register |
|--------|----------|
| `vic.spr_pos[i].x / .y`, `vic.spr_msbx` | sprite positions |
| `vic.ctrl1`, `vic.ctrl2` | `$D011`, `$D016` (`VIC_CTRL1_*`, `VIC_CTRL2_*`) |
| `vic.raster` | `$D012` |
| `vic.memptr` | `$D018` |
| `vic.intr_ctrl`, `vic.intr_enable` | `$D019`, `$D01A` (`VIC_INTR_RST` …) |
| `vic.spr_enable`, `spr_multi`, `spr_expand_x/y`, `spr_priority` | sprite control |
| `vic.spr_sprcol`, `vic.spr_backcol` | collisions |
| `vic.color_border`, `color_back`, `color_back1..3` | colors |
| `vic.spr_mcolor0/1`, `vic.spr_color[8]` | sprite colors |

Functions: `vic_setmode(VICM_TEXT | VICM_TEXT_MC | VICM_TEXT_ECM | VICM_HIRES | VICM_HIRES_MC, screen, font)`,
`vic_setbank(bank)`, `vic_waitFrame()`, `vic_waitFrames(n)`, `vic_waitLine(line)`, `vic_waitBottom()`,
`vic_waitTop()`, `vic_sprxy(s, x, y)`. Colors: `VCOL_BLACK … VCOL_LT_GREY`.

### Sprites — `<c64/sprites.h>`

```c
spr_init(Screen);                                    // sprite pointers live after this screen
spr_set(0, true, 160, 100, 0x0380 / 64, VCOL_WHITE, false, false, false);
spr_move(0, x, y);
spr_image(0, frame);  spr_color(0, VCOL_RED);  spr_show(0, false);
```

**Virtual sprites (multiplexer):** `vspr_init(Screen)`, `vspr_set(n, x, y, image, color)`,
`vspr_move`, `vspr_hide`, then every frame `vspr_sort()` and `vspr_update()` — up to 16 / 32 / 64
sprites with the raster IRQ library (see the C templates and the Oscar64 samples
`multiplexer.c`, `sprmux32.c`, `sprmux64.c`).

### Raster interrupts — `<c64/rasterirq.h>`

A table-driven IRQ chain that writes registers at given raster lines:

```c
RIRQCode top, bottom;

rirq_init(true);                        // true: keep the KERNAL IRQ
rirq_build(&top, 1);
rirq_write(&top, 0, &vic.color_back, VCOL_BLUE);
rirq_set(0, 50, &top);
rirq_build(&bottom, 1);
rirq_write(&bottom, 0, &vic.color_back, VCOL_BLACK);
rirq_set(1, 150, &bottom);
rirq_sort();
rirq_start();
```

Also `rirq_call` (call a function), `rirq_delay`, `rirq_move`, `rirq_clear`, `rirq_wait`.

### Input — `<c64/joystick.h>`, `<c64/keyboard.h>`, `<c64/mouse.h>`

```c
joy_poll(0);              // 0 = control port 2 ($DC00), 1 = control port 1 ($DC01)
if (joyx[0] < 0) x--;     // joyx / joyy: -1, 0, +1
if (joyb[0]) fire();
```

Keyboard: `keyb_poll()`, then `key_pressed(KSCAN_SPACE)`, `key_shift()`.

### Memory banking — `<c64/memmap.h>`

```c
mmap_set(MMAP_NO_BASIC);   // $36: BASIC ROM off, RAM up to $D000
mmap_set(MMAP_NO_ROM);     // $35: BASIC + KERNAL off, I/O on
mmap_set(MMAP_RAM);        // $30: all RAM
```

`MMAP_ROM` ($37), `MMAP_CHAR_ROM` ($31), `MMAP_ALL_ROM` ($33). `mmap_trampoline()` installs an IRQ /
NMI trampoline so interrupts still work with the KERNAL off.

### SID — `<c64/sid.h>`, `<audio/sidfx.h>`

`sid.voices[0..2].freq / pwm / ctrl / attdec / susrel`, `sid.ffreq`, `sid.resfilt`, `sid.fmodevol`,
`sid.random`, `sid.env3`; constants `SID_ATK_*`, `SID_DKY_*`, `SID_CTRL_GATE` …
Sound effects: `sidfx_init()`, `sidfx_play(channel, fx, count)`, `sidfx_loop()` each frame.

### CIA — `<c64/cia.h>`

`cia1`, `cia2` (`$DC00`, `$DD00`); `cia_init()` stops the CIA interrupts.

### Disk — `<c64/kernalio.h>`

```c
krnio_setnam(p"HISCORE");
if (krnio_open(2, 8, 2))
{
    krnio_write(2, data, size);
    krnio_close(2);
}
```

Also `krnio_load`, `krnio_save`, `krnio_read`, `krnio_read_lzo`, `krnio_gets`, `krnio_status`.
Fast loader: `<c64/flossiec.h>`.

### Graphics — `<gfx/bitmap.h>`, `<gfx/mcbitmap.h>`

```c
Bitmap Screen;
ClipRect cr = {0, 0, 320, 200};
bm_init(&Screen, (char *)0xe000, 40, 25);
bm_fill(&Screen, 0);
bm_line(&Screen, &cr, 0, 0, 319, 199, 0xff, LINOP_SET);
bm_circle_fill(&Screen, &cr, 160, 100, 40, NineShadesOfGrey[8]);
```

Also polygon / triangle fills, bit blit, `bm_set` / `bm_clr` / `bm_get`, text. `mcbitmap.h` is the
multicolor version; `vector3d.h` has 3D vector / matrix math, `<fixmath.h>` fixed point.

### Others

`<c64/reu.h>` (REU DMA), `<c64/easyflash.h>`, `<c64/charwin.h>` (text windows), `<c64/asm6502.h>`
(build machine code at run time), `<string.h>`, `<stdlib.h>` (`malloc`, `rand`, `itoa` …),
`<math.h>`, `<ctype.h>`, `<setjmp.h>`, `<time.h>`.
`<oscar.h>`: `oscar_expand_lzo(dst, src)`, `oscar_expand_rle`, `breakpoint()`.

---

## 7. Language extensions

### Storage specifiers and qualifiers

| Keyword | Meaning |
|---------|---------|
| `__zeropage` | global in zero page (`$80–$FF`); not initialized; only when the KERNAL is not used |
| `__striped` | array of structs / words stored column by column (`LLLL…HHHH…`) for `abs,X` access |
| `__native` | compile this function to 6502 code (also `#pragma native(fn)`) |
| `__noinline` / `__forceinline` | control inlining |
| `__export` | keep a function / variable even if unreferenced (also `#pragma reference(name)`) |
| `__interrupt` | saves the zero page registers the function uses |
| `__hwinterrupt` | also saves A / X / Y and returns with `RTI` — a hardware IRQ handler |
| `volatile` | hardware registers, variables shared with an interrupt |
| `__memmap` | an access that changes the memory layout (`$01`); nothing is reordered around it |
| `__assume(cond)` | optimizer hint: `__assume(false)` = unreachable, `__assume(x < 10)` = value range |

### Embedding binary data

```c
const char charset[] = {
    #embed "charset.bin"
};
const char part[]    = { #embed 4096 126 "data.bin" };     // size, offset
const char packed[]  = { #embed 2048 0 lzo "charset.bin" }; // compressed, expand with oscar_expand_lzo
const unsigned idx[] = { #embed 2048 0 word "index.bin" };  // 16-bit words
```

CharPad / SpritePad files: `ctm_chars`, `ctm_tiles8`, `ctm_tiles16`, `ctm_map8`, `ctm_map16`,
`ctm_attr1/2` (`.ctm` v8), `spd_sprites`, `spd_tiles` (`.spd` v5).

### Pragmas

```c
#pragma warning(disable: 2000)          // also default / error, push / pop
#pragma message("size: ", sizeof(M))
#pragma optimize(push, speed, maxinline) … #pragma optimize(pop)
#pragma unroll(full)                    // next loop fully unrolled; also a number or (page)
#pragma callinline()                    // inline the next call
#pragma compile("module.c")             // add a source file to the build
#pragma align(table, 256)
#pragma stacksize(1024)
#pragma heapsize(0)
```

`#pragma unroll(page)` turns `for (int i = 0; i < 1000; i++) Screen[i] = ' ';` into four
`STA $0400,Y`-style stores 250 bytes apart with an 8-bit index.

### Preprocessor loops

```c
char * const ScreenRows[] = {
#for(i, 25) Screen + 40 * i,
};

#assign ry 0
#repeat
    Color[40 * ry + cx] = color;
#assign ry ry + 1
#until ry == 25
#undef ry
```

---

## 8. Memory layout and placement

Default C64 PRG layout:

| Region | Range | Content |
|--------|-------|---------|
| `startup` | `$0801–$0900` | BASIC line + startup code |
| `bytecode` | `$0900–$0A00` | interpreter table (only with byte code) |
| `main` | `$0A00–$A000` | `code`, `data`, `bss`, `heap` (1K min), `stack` (4K) |

Use RAM up to `$D000`:

```c
#include <c64/memmap.h>
#pragma region(main, 0x0a00, 0xd000, , , {code, data, bss, heap, stack})

int main(void)
{
    mmap_set(MMAP_NO_BASIC);
    …
}
```

Put data at a fixed address (e.g. a charset at `$2000`, no copying at run time):

```c
#pragma region(lower, 0x0a00, 0x2000, , , {code, data})
#pragma section(charset, 0)
#pragma region(charset, 0x2000, 0x2800, , , {charset})
#pragma region(main, 0x2800, 0xa000, , , {code, data, bss, heap, stack})

#pragma data(charset)
char Charset[2048] = {
    #embed "charset.bin"
};
#pragma data(data)
```

`#pragma region(name, start, end, flags, bank, {sections}[, runaddr])`; `#pragma code(…)`,
`#pragma data(…)`, `#pragma bss(…)` select the section for what follows. Extra uninitialized BSS:
`#pragma section(mybss, 0, , , bss)`. Cartridge banks (up to 64), overlays (`#pragma overlay(ovl1, 1)`,
saved as separate files on a disk image) and inlays (compressed sections) are also supported.

---

## 9. Inline assembler

```c
void putchar(char c)
{
    __asm {
        lda c
        bne .w1
        lda #13
    .w1:
        jsr 0xffd2
    }
}

char getchar(void)
{
    return __asm {
        jsr 0xffcf
        sta accu
        lda #0
        sta accu + 1
    };
}
```

- Parameters and locals are **read** through their zero page registers; they cannot be changed from asm.
- Globals use absolute addressing; struct offsets with `Type::member` (`ldy #P::ns`).
- Return a value in `accu` (`accu`… `accu + 3`).
- `label:` is global, `.label:` is local to the `__asm` block.
- Hex is written `0xffd2` (C style).
- At `-O2` and up the assembler is optimized too; `__asm volatile { }` or
  `#pragma optimize(noasm)` keeps it exactly as written.

### A hardware raster IRQ

```c
#include <c64/memmap.h>
#include <c64/cia.h>
#include <c64/vic.h>

__hwinterrupt void irq(void)
{
    vic.color_border++;
    // …
    vic.color_border--;
    vic.intr_ctrl <<= 1;            // acknowledge
}

int main(void)
{
    __asm { sei }
    mmap_set(MMAP_NO_ROM);          // KERNAL off: the vector at $FFFE is used
    cia_init();
    *(void **)0xfffe = irq;
    vic.intr_enable = VIC_INTR_RST;
    vic.ctrl1 &= ~VIC_CTRL1_RST8;
    vic.raster = 100;
    __asm { cli }

    for (;;) { }
    return 0;
}
```

For most programs `<c64/rasterirq.h>` (section 6) is simpler and keeps the KERNAL.

---

## 10. C++ mode

`.cpp` files or `-pp`: namespaces, references, classes with single inheritance, constructors /
destructors, operator overloading, virtual functions, `new` / `delete`, templates, lambdas, `auto`,
range-`for`, `constexpr`, parameter packs, and `string`, `iostream`, `vector`, `array`, `list`
from `<opp/…>`.

---

## 11. Troubleshooting

| Problem | What to check |
|---------|---------------|
| Program too large / linker error | the **Map** view (objects by size); `-dNOFLOAT`, `-Os`, `-Oo`; `#pragma heapsize(0)`; move `main` up to `$D000` (section 8) |
| Slow code | 8-bit unsigned types, `const` tables, no recursion / function pointers, `-O2` / `-O3`, `#pragma unroll`, look at the cycle gutter and the Disassembly |
| Locals missing in the debugger | the Debug build uses `-O0`; a variable is shown only in its line range |
| Wrong characters on screen | `iocharmap(...)`, `p"…"` / `s"…"` prefixes, `-psci` |
| Crash after switching the KERNAL off | use `__hwinterrupt` and the `$FFFE` vector, or `mmap_trampoline()` |
| Hardware register access optimized away | declare it `volatile` (the library structs already are) |
| Inline asm changed by the optimizer | `__asm volatile { }` |

---

## 12. Samples

The Oscar64 repository has a large `samples/` folder, grouped by topic: `stdio`, `kernalio`
(disk), `memmap` (charsets, EasyFlash, overlays), `hires`, `hiresmc`, `particles`, `fractals`,
`rasterirq` (color bars, open borders, text crawler), `scrolling`, `sprites` (joystick, 16 / 32 / 64
sprite multiplexers, credit roll) and `games` (snake, lander, breakout, maze3d, connect four,
missile command, horizontal shooter). Open the folder in Visual Assembler (Start window → Open C
folder): its `make.bat` / `build.sh` becomes the project's targets.

---

*Oscar64 © Dr. Mortal Wombat, GPL-3.0. This page summarizes the official `oscar64.md`.*
