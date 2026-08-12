#[derive(Debug, Clone)]
pub enum Expr {
    Number(i16),
    StringLit(String),
    Var(String),
    BinOp(Box<Expr>, BinOp, Box<Expr>),
    Not(Box<Expr>),
    Getch,
    Inkey,                        // inkey() — non-blocking $FFE4; 0 = no key, else PETSCII code
    Waitkey, // waitkey() — CIA1 matrix direct scan; blocks until any key; works without CIA1 timer IRQ
    ReuPresent, // reu_present() — 1 if REU detected, 0 otherwise
    Turbo,   // turbo() — 1 if U64 turbo active (bits 0-3 of $D031 != 0), else 0
    Joy(u8), // joy(1) or joy(2) — read joystick port, returns inverted bits 0-4
    MouseX,    // mouse_x()  — SID $D419 POT X register (0-255, accumulated)
    MouseXHi,  // mouse_x_hi() — MSB of 9-bit X position
    MouseY,    // mouse_y()  — SID $D41A POT Y register (0-255)
    MouseBtn, // mouse_btn() — CIA1 $DC00 bits: bit0=left(fire), bit1=right(up direction)
    Sin(Box<Expr>), // sin(angle) — 8-bit angle 0-255, returns 0-255 (center=128)
    Cos(Box<Expr>), // cos(angle) — same as sin with +64 offset
    HexFmt(Box<Expr>), // hex(n) — in print: shows value as 2-digit uppercase hex
    BinFmt(Box<Expr>), // bin(n) — in print: shows value as 8-bit binary string
    DecFmt(Box<Expr>, Box<Expr>), // dec(n, width) — in print: right-justified decimal
    Peek(Box<Expr>),
    Rnd,
    RndN(Box<Expr>), // rnd(n) — random 0..n-1 (rnd() mod n)
    Abs(Box<Expr>),
    Min(Box<Expr>, Box<Expr>),
    Max(Box<Expr>, Box<Expr>),
    Clamp(Box<Expr>, Box<Expr>, Box<Expr>), // clamp(val, lo, hi) — clamp val to [lo, hi] range (8-bit unsigned)
    Sgn(Box<Expr>),
    ArrayGet(String, Box<Expr>), // arr[idx]
    ChrStr(Box<Expr>),           // chr$(n) — character with PETSCII code n
    StrN(Box<Expr>),             // str$(n) — 8-bit integer → 3-digit null-terminated decimal string
    SpriteHit,   // sprhit()    — read $D01E (sprite–sprite collision, cleared on read)
    SpriteBgHit, // sprbghit() — read $D01F (sprite–background collision, cleared on read)
    SpriteX(Box<Expr>), // sprite_x(id) — read sprite X position from $D000 + id*2
    SpriteY(Box<Expr>), // sprite_y(id) — read sprite Y position from $D001 + id*2
    StrLen(Box<Expr>), // len(s)  — length of null-terminated string var, 0–255
    Asc(Box<Expr>), // asc(s)  — PETSCII code of first character (0 if empty)
    Peek16(Box<Expr>), // peek16(addr) — read 16-bit word: lo at addr, hi at addr+1
    Spc(Box<Expr>), // spc(n) — in print: print n spaces
    Tab(Box<Expr>), // tab(n) — in print: move cursor to column n
    Val(Box<Expr>), // val(s) — runtime PETSCII decimal string → 8-bit int
    FixedLit(u16), // Q8.8 fixed-point literal (e.g. 3.5 → hi=3, lo=128)
    FixedToInt(Box<Expr>), // int(f) — extract integer part (hi byte) of a float variable
    FnCall(String, Vec<Expr>), // fn_name(args) — call a function, result in A
}

#[derive(Debug, Clone)]
pub enum BinOp {
    Add,
    Sub,
    Mul,
    Div,
    Mod,
    Eq,
    NotEq,
    Lt,
    Gt,
    LtEq,
    GtEq,
    And,
    Or,
    Xor,
    Shl,
    Shr,
}

#[derive(Debug, Clone)]
pub enum ColorTarget {
    Text,
    Border,
    Bg,
}

/// Variable type annotation.
/// `Word`  = 16-bit unsigned  (`var x: word = $0400`)
/// `Str`   = string pointer   (`var s = "text"` – inferred)
/// `Array` = byte array       (`var arr = array(10)`)
/// `Int`   = 8-bit (default)
#[derive(Debug, Clone, PartialEq)]
pub enum VarType {
    Int,
    Str,
    Float,
    Word,
    Array,
    WordArray,
}

/// REU (RAM Expansion Unit) transfer type.
#[derive(Debug, Clone)]
pub enum ReuOp {
    Stash,
    Fetch,
    Swap,
}

#[derive(Debug, Clone)]
pub enum Stmt {
    VarDecl {
        name: String,
        vtype: Option<VarType>,
        expr: Expr,
    },
    Assign(String, Expr),
    ArraySet(String, Expr, Expr), // arr[idx] = val
    Print {
        args: Vec<Expr>,
        no_newline: bool,
    },
    /// `print at col, row, expr...` — cursor position then print (shorthand for cursor+print).
    PrintAt {
        col: Expr,
        row: Expr,
        args: Vec<Expr>,
    },
    If(Expr, Vec<Stmt>, Option<Vec<Stmt>>),
    Loop(u8, Vec<Stmt>),
    ForLoop {
        var: String,
        from: Expr,
        to: Expr,
        step: Option<Expr>,
        body: Vec<Stmt>,
    },
    WhileLoop(Expr, Vec<Stmt>),
    Break,
    Continue,
    /// `select expr / case val: / ... / else: / end`
    Select {
        expr: Expr,
        cases: Vec<(Expr, Vec<Stmt>)>,
        else_body: Option<Vec<Stmt>>,
    },
    Cls {
        fast: bool,
    },
    Graphics {
        on: bool,
        multi: bool,
        block: bool,
        dbuf: bool,
    }, // multi=true → multicolor bitmap; block=true → 4×4 text block mode; dbuf=true → double-buffered hires
    Flip, // flip — swap double-buffer front/back (show drawn buffer, draw into the other)
    Display {
        on: bool,
    }, // display on/off — controls VIC DEN bit ($D011 bit4)
    Sys {
        addr: u16,
        arg: Option<Expr>,
    }, // sys addr [, val] — optional LDA #val before JSR
    WaitKey,   // waitkey() standalone statement — CIA1 matrix scan until any key
    WaitGetch, // wait key — blocking KERNAL getch ($FFE4 loop until keypress)
    IrqExit,   // irq_exit — JMP $EA81 (proper IRQ handler exit)
    /// `sid volume N` — write N to $D418 (master volume + filter mode, bits 0-3 = vol 0-15).
    SidVolume(Expr),
    /// `sid stop` — zero all 25 SID registers ($D400–$D418), silencing all voices.
    SidStop,
    AsmBytes(Vec<u8>),
    IntToStr {
        var: String,
        addr: u16,
    },
    Color {
        target: ColorTarget,
        expr: Expr,
    },
    SubDef(String, Vec<(String, Option<VarType>)>, Vec<Stmt>), // name, params, body
    FnDef(String, Vec<(String, Option<VarType>)>, Option<VarType>, Vec<Stmt>), // name, params, return_type, body
    Call(String, Vec<Expr>, usize),         // name, args, line
    Return(Option<Expr>),
    Const(String, Expr),
    Label(String),
    Goto(String, usize), // label name, line
    Poke(Expr, Expr),
    Plot(Expr, Expr),       // plot x, y — set pixel in bitmap mode
    Plot4(Expr, Expr),      // plot4 x, y — set 4×4 block pixel
    Plot4Erase(Expr, Expr), // plot4 erase x, y — clear 4×4 block pixel
    Circle {
        x: Expr,
        y: Expr,
        radius: Expr,
    }, // circle x,y,r — midpoint circle using bitmap plot helper
    Circle4 {
        x: Expr,
        y: Expr,
        radius: Expr,
    }, // circle4 x,y,r — midpoint circle using plot4 helper
    Line {
        x1: Expr,
        y1: Expr,
        x2: Expr,
        y2: Expr,
    }, // line x1,y1,x2,y2 — Bresenham line (set pixels)
    LineErase {
        x1: Expr,
        y1: Expr,
        x2: Expr,
        y2: Expr,
    }, // line erase x1,y1,x2,y2 — Bresenham line (clear pixels, AND ~mask)
    LineXor {
        x1: Expr,
        y1: Expr,
        x2: Expr,
        y2: Expr,
    }, // line xor x1,y1,x2,y2 — Bresenham line (toggle pixels, EOR mask)
    Gcls,                   // gcls — clear bitmap screen
    Bye,                    // bye/exit — cls then RTS back to BASIC
    Incbin(String),         // incbin "file" — embed raw binary file bytes inline
    /// `load sid "file.sid"` — embed SID music data at its native load address.
    /// Header is parsed at compile time; `sid_init` and `sid_play` become constants.
    LoadSid {
        load_addr: u16, // where the music data loads in C64 RAM
        init_addr: u16, // JSR to initialise (A = song number 0-based)
        play_addr: u16, // JSR each frame to advance playback
        data: Vec<u8>,  // raw music bytes (SID header stripped)
    },
    Data(Vec<Expr>), // data 1,2,3 — constant byte table (read with 'read')
    Read(String),    // read varname — load next data byte into variable
    Load {
        filename: String,
        addr: Option<Expr>,
    }, // load "file" [, addr] — KERNAL LOAD from device 8
    Input {
        prompt: Option<String>,
        var: String,
    }, // input ["prompt",] var — BASIN line input
    Fill {
        addr: Expr,
        len: Expr,
        val: Expr,
    }, // fill addr, len, val — memory block fill
    Memcopy {
        src: Expr,
        dst: Expr,
        len: Expr,
    }, // memcopy src, dst, len — memory block copy
    DrawMem {
        src: Expr,
        dst: Expr,
        width: Expr,
        height: Expr,
        stride: Expr,
    }, // drawmem src, dst, width, height, stride — 2-D rectangular blit
    Irq {
        handler: Expr,
        line: Option<Expr>,
    }, // irq handler [, raster_line] — raster IRQ setup
    Save {
        filename: String,
        addr: Option<Expr>,
        len: Option<Expr>,
    }, // save "file" [, addr, len] — KERNAL SAVE
    Cursor {
        x: Expr,
        y: Expr,
    }, // cursor x, y — KERNAL PLOT set cursor position
    RepeatLoop(Vec<Stmt>, Expr), // repeat ... until cond — do-while loop
    PlotErase(Expr, Expr), // plot erase x, y — clear pixel in bitmap
    PlotXor(Expr, Expr), // plot xor x, y — XOR pixel in bitmap
    Paint(Expr, Expr), // paint x, y — 4-connected flood fill from (x,y)
    Rect(Expr, Expr, Expr, Expr),      // rect x1,y1,x2,y2 — draw rectangle outline (set)
    RectErase(Expr, Expr, Expr, Expr), // rect erase x1,y1,x2,y2 — erase rectangle outline
    RectXor(Expr, Expr, Expr, Expr),   // rect xor x1,y1,x2,y2 — XOR rectangle outline
    SpriteExpandX {
        id: Expr,
        on: bool,
    }, // sprite expand x id, on/off — $D01D
    SpriteExpandY {
        id: Expr,
        on: bool,
    }, // sprite expand y id, on/off — $D017
    SpritePriority {
        id: Expr,
        on: bool,
    }, // sprite priority id, on/off — $D01B
    Reu {
        op: ReuOp,
        c64_addr: Expr,
        reu_bank: Expr,
        reu_addr: Expr,
        length: Expr,
    },
    // reu stash/fetch/swap c64_addr, bank, reu_addr, length — DMA transfer to/from REU
    Wait {
        raster_target: bool,
        value: Expr,
    }, // wait N (raster lines) / wait raster N (specific line)
    Delay(Expr), // delay N — busy-wait N PAL frames (1 frame = 1/50 sec)
    Sound {
        channel: Expr,
        freq: Expr,
        duration: Expr,
    }, // SID: sound ch, freq(16-bit), frames
    Sprite {
        id: Expr,
        x: Expr,
        y: Expr,
        data_addr: Option<Expr>,
    },
    // sprite id, x, y [, data_addr] — VIC-II hardware sprite position + optional data pointer
    // id/x/y: 0-7; x supports word vars for 9-bit range; data_addr = 64-byte-aligned address
    SpriteOn {
        id: Expr,
    }, // sprite_on id  — set bit in $D015 (sprite enable)
    SpriteOff {
        id: Expr,
    }, // sprite_off id — clear bit in $D015
    SpriteColor {
        id: Expr,
        color: Expr,
    }, // sprite_color id, color — write $D027+id
    SpriteMulticolor {
        id: Expr,
        on: bool,
    }, // sprite_multicolor id, on/off — bit in $D01C
    /// Align to 64-byte boundary, embed 63 sprite bytes, emit `LDA #page; STA $07F8+id`.
    SpriteDef {
        id: u8,
        bytes: Vec<u8>,
    },
    /// poke16 addr, val — write 16-bit little-endian value to two consecutive bytes.
    Poke16(Expr, Expr),
    /// inc var — INC zp (or 16-bit for word vars)
    Inc(String),
    /// dec var — DEC zp (or 16-bit for word vars)
    Dec(String),
    /// screen col, row, char [, color] — direct POKE to screen and optional color RAM
    Screen {
        col: Expr,
        row: Expr,
        char_expr: Expr,
        color_expr: Option<Expr>,
    },
    /// `color screen col, row, c` — write color byte to color RAM ($D800 + row*40 + col)
    ColorScreen {
        col: Expr,
        row: Expr,
        color: Expr,
    },
    /// open channel, device, secondary [, "filename"] — KERNAL OPEN (SETNAM+SETLFS+OPEN)
    Open {
        channel: Expr,
        device: Expr,
        secondary: Expr,
        filename: Option<String>,
    },
    /// close channel — KERNAL CLOSE ($FFC3) with A = channel number
    Close(Expr),
    /// print# channel, ... — CHKOUT ($FFC9) then CHROUT per char then CLRCHN ($FFCC)
    PrintHash {
        channel: Expr,
        args: Vec<Expr>,
    },
    /// asm { ... } — raw 6502 assembly source assembled inline at the current code position
    AsmSource(String),
    /// `nmi handler` — set NMI vector at $0318/$0319 (handler must end with nmi_exit / JMP $FE47)
    Nmi {
        handler: Expr,
    },
    /// `nmi_exit` — JMP $FE47 (KERNAL NMI exit: restores A/X/Y + RTI)
    NmiExit,
    /// `cia_timer period, handler` — CIA1 timer A IRQ every `period` cycles; handler at $0314/$0315
    CiaTimer {
        period: Expr,
        handler: Expr,
    },
    /// `scroll x n` — set $D016 bits 0-2 for horizontal fine scroll (0-7 pixels)
    ScrollX(Expr),
    /// `scroll x n narrow/wide` — set horizontal fine scroll and force 38/40-column mode
    ScrollXMode {
        value: Expr,
        wide: bool,
    },
    /// `scroll y n` — set $D011 bits 0-2 for vertical fine scroll (0-7 pixels)
    ScrollY(Expr),
    /// `scroll row n left` — shift one screen RAM row left by one character
    ScrollRowLeft(Expr),
    /// `speed N` — set U64 CPU speed; N in MHz for constants, raw index (0-15) for variables
    /// Writes bits 0-3 of $D031 (U64 Turbo Control register), preserving bit 7 (badlines).
    Speed(Expr),
    /// `badlines on/off` — enable/disable badline timing via bit 7 of $D031
    Badlines(bool),
    /// `fill screen val` — fill screen RAM ($0400–$07FF, 4 pages) with val (fast shorthand)
    FillScreen(Expr),
    /// `fill color val` — fill color RAM ($D800–$DBFF, 4 pages) with val (fast shorthand)
    FillColor(Expr),
    /// `gosub label` — JSR to a label; complement to the existing `return` (RTS)
    Gosub(String, usize),
    /// `sprite_frame id, addr` — update sprite data pointer $07F8+id = addr>>6
    /// id: 0-7 const or var; addr: 64-byte-aligned address (const, word var, or 8-bit expr)
    SpriteFrame {
        id: Expr,
        addr: Expr,
    },
    /// `chardef id ... end` — inline 8-byte char definition; copies to charset_base+id*8 at runtime
    Chardef {
        id: u8,
        bytes: Vec<u8>,
    },
    /// `charset addr` — set charset RAM base address (compile-time directive, default $3800)
    CharsetBase(u16),
    /// `mplot x, y, color` — set a 2-bit color pixel in multicolor bitmap mode (160×200)
    Mplot {
        x: Expr,
        y: Expr,
        color: Expr,
    },
    /// `music play [N]` — initialise SID with song N (default 0) and start CIA1 50 Hz IRQ
    MusicPlay(Expr),
    /// `music stop` — disable CIA1 timer IRQ and zero all SID registers
    MusicStop,
    /// `music pause` — disable CIA1 timer IRQ without resetting SID
    MusicPause,
    /// `music resume` — re-enable CIA1 timer A IRQ after pause
    MusicResume,
    /// `onerr goto label` — install KERNAL IERROR handler ($0300/$0301 → label address)
    OnErrGoto(String, usize),
    /// `lowercase` — switch to lowercase/uppercase charset via CHR$(14) → CHROUT ($FFD2)
    Lowercase,
    /// `uppercase` — switch to uppercase/graphics charset via CHR$(142) → CHROUT ($FFD2)
    Uppercase,
}
