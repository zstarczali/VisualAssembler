#[derive(Debug, Clone, PartialEq)]
pub enum Token {
    // Literals
    Number(i16),
    StringLit(String),
    Ident(String),

    // Keywords
    Var,
    Sub,
    Fn,
    End,
    If,
    Then,
    Else,
    Loop,
    While,
    To,
    Step,
    Break,
    Print,
    Return,
    Call,
    Cls,
    Graphics,
    Display, // display on / display off — controls VIC DEN bit
    On,
    Off,
    Fast,
    Sys,
    Asm,
    StrToInt,
    NumStr,
    Color,
    Text,
    Border,
    Bg,
    Getch,
    Inkey,
    Waitkey, // waitkey() — CIA1 matrix scan, any key, works without CIA1 IRQ
    StrLen,  // len()
    Asc,     // asc()
    ReuDet,  // reudet() — inline REU detection, returns 0 or 1
    And,
    Or,
    Not,
    Bnot,  // bnot x — bitwise NOT: x XOR 255 (complement all bits)
    Clamp, // clamp(val, lo, hi) — clamp val to [lo, hi] range
    Xor,
    Shl,
    Shr,
    Wait,
    Delay,
    Raster,
    Sound,
    Sprite,      // sprite id, x, y [, data_addr] / sprite on/off/color/multi
    SpriteHit,   // sprhit()   — $D01E sprite-sprite collision
    SpriteBgHit, // sprbghit() — $D01F sprite-background collision
    SpriteX,     // sprite_x(id) — read sprite X position ($D000 + id*2)
    SpriteY,     // sprite_y(id) — read sprite Y position ($D001 + id*2)
    SpriteFrame, // sprite_frame id, addr — update sprite pointer $07F8+id = addr>>6
    Times,       // times N ... end — counted loop (N iterations), alias for loop N
    Sprdef,      // sprdef id ... end — align+embed sprite data, init $07F8+id
    Gosub,       // gosub label — JSR to a label (complement to 'return')
    Chardef,     // chardef id ... end — inline 8-byte charset definition (VIC char data)
    Charset,     // charset addr — set charset RAM base address (default $3800)
    Mplot,       // mplot x, y, color — multicolor bitmap pixel (2-bit color, 160×200)
    Music,       // music play/stop/pause/resume — SID music control via CIA1 timer IRQ
    Play,        // play — sub-keyword for music play [song]
    Stop,        // stop — sub-keyword for music stop
    Pause,       // pause — sub-keyword for music pause
    Resume,      // resume — sub-keyword for music resume
    OnErr,       // onerr goto label — install KERNAL IERROR handler ($0300/$0301)
    StrN,        // str$(n) — convert 8-bit integer to 3-digit decimal string pointer
    Int,
    Str,
    Float,
    FixedLit(u16), // Q8.8 fixed-point literal (e.g. 3.5 → 896 = 0x0380)
    Const,
    Label,
    Goto,
    Poke,
    Peek,
    Rnd,
    Abs,
    Min,
    Max,
    Sgn,
    Word,
    Array,
    ArrayWord,
    For,
    Next,
    Chr,
    Plot,
    Circle,
    Circle4, // circle4 x, y, r — midpoint circle in 80×50 block-pixel mode
    Gcls,
    Bye,
    Joy,
    MouseX,   // mouse_x()  — SID $D419 POT X (8-bit accumulated)
    MouseXHi, // mouse_x_hi() — MSB of 9-bit X position
    MouseY,   // mouse_y()  — SID $D41A POT Y
    MouseBtn, // mouse_btn() — CIA1 $DC00 fire+up bits, bit0=left, bit1=right
    Paint,    // paint x, y — 4-connected flood fill
    Line,
    Sin,
    Cos,
    Hex,
    Bin,
    Reu,
    Stash,
    Fetch,
    Multi,
    Flip,   // flip — swap double-buffer front/back
    Block,  // block pixel mode keyword
    Plot4,  // plot4 — 4×4 block pixel set/erase
    Sid,    // load sid "file.sid" — embed SID music; also: sid volume / sid stop
    Volume, // volume — used in sid volume N
    At,     // at — used in print at x, y, ...
    Incbin,
    Include,
    Data,
    Read,
    Load,
    Input,
    Fill,
    Memcopy,
    DrawMem,
    Irq,
    IrqExit, // irq_exit — emits JMP $EA81 (proper IRQ handler exit, replaces asm { JMP $EA81 })
    Save,
    Cursor,
    Repeat,
    Until,
    Erase,
    Expand,
    Priority,
    Mod,
    Peek16,                   // peek16(addr) — 16-bit memory read (lo at addr, hi at addr+1)
    Poke16,                   // poke16 addr, val — 16-bit memory write
    Open,                     // open channel, device, secondary [, "filename"]
    Close,                    // close channel — CLOSE ($FFC3)
    PrintHash,                // print# channel, ... — CHKOUT + CHROUT + CLRCHN
    AsmSource(String, usize), // asm { ... } — raw source + number of embedded newlines
    Inc,                      // inc var — INC zp
    Dec,                      // dec var — DEC zp
    Screen,                   // screen col, row, char [, color] — direct screen/color RAM poke
    Spc,                      // spc(n) — in print: print n spaces
    Semicolon, // ';' — statement separator (comments use # or rem; asm comments use ; inside asm blocks)
    Tab,       // tab(n) — in print: move cursor to column n
    Continue,  // continue — jump to next loop iteration
    Select,    // select expr / case val: / else: / end — multi-way branch
    Case,      // case val: — branch in select
    Val,       // val(s) — runtime string→int conversion (PETSCII decimal string)
    Nmi,       // nmi handler — NMI vector setup ($0318/$0319)
    NmiExit,   // nmi_exit — JMP $FE47 (proper NMI handler exit)
    CiaTimer,  // cia_timer period, handler — CIA1 timer A IRQ setup
    Scroll,    // scroll x n / scroll y n — fine scroll ($D016/$D011 bits 0-2)
    Speed,     // speed N / speed max / speed off — U64 CPU speed ($D031 bits 0-3)
    Badlines,  // badlines on / badlines off  — U64 badline timing ($D031 bit 7)
    Turbo,     // turbo() — 1 if U64 turbo is active (bits 0-3 of $D031 != 0), else 0
    Lowercase, // lowercase — switch VIC-II to lowercase/uppercase charset (CHR$(14))
    Uppercase, // uppercase — switch VIC-II to uppercase/graphics charset (CHR$(142))
    Rect,      // rect x1,y1,x2,y2 — draw a rectangle outline in bitmap mode

    // Operators
    Plus,
    Minus,
    Star,
    Slash,
    PlusEq,  // +=
    MinusEq, // -=
    MulEq,   // *=
    DivEq,   // /=
    Eq,
    NotEq,
    Lt,
    Gt,
    LtEq,
    GtEq,
    Assign,

    // Address / hex literal
    Addr(u16),

    // Punctuation
    Colon,
    LParen,
    RParen,
    LBracket,
    RBracket,
    Comma,
    LBrace,
    RBrace,
    Newline,
    Eof,
}

pub struct Lexer {
    input: Vec<char>,
    pos: usize,
    line: usize,
    errors: Vec<String>,
}

impl Lexer {
    pub fn new(src: &str) -> Self {
        Self {
            input: src.chars().collect(),
            pos: 0,
            line: 1,
            errors: vec![],
        }
    }

    pub fn errors(&self) -> &[String] {
        &self.errors
    }

    fn peek(&self) -> Option<char> {
        self.input.get(self.pos).copied()
    }

    fn advance(&mut self) -> Option<char> {
        let c = self.input.get(self.pos).copied();
        self.pos += 1;
        c
    }

    fn skip_spaces(&mut self) {
        while matches!(self.peek(), Some(' ') | Some('\t') | Some('\r')) {
            self.advance();
        }
    }

    pub fn tokenize(&mut self) -> Vec<Token> {
        let mut tokens = vec![];
        loop {
            self.skip_spaces();
            match self.peek() {
                None => {
                    tokens.push(Token::Eof);
                    break;
                }
                Some('\n') => {
                    self.advance();
                    tokens.push(Token::Newline);
                    self.line += 1;
                }
                Some('#') => {
                    while !matches!(self.peek(), None | Some('\n')) {
                        self.advance();
                    }
                }
                Some(';') => {
                    self.advance(); // consume ';'
                    tokens.push(Token::Semicolon); // always a statement separator (like ':')
                }
                Some('"') => tokens.push(self.read_string()),
                Some('$') => tokens.push(self.read_hex()),
                Some('{') => {
                    self.advance();
                    tokens.push(Token::LBrace);
                }
                Some('}') => {
                    self.advance();
                    tokens.push(Token::RBrace);
                }
                Some(c) if c.is_ascii_digit() => tokens.push(self.read_number()),
                Some(c) if c.is_alphabetic() || c == '_' => tokens.push(self.read_ident()),
                Some('+') => {
                    self.advance();
                    if self.peek() == Some('=') {
                        self.advance();
                        tokens.push(Token::PlusEq);
                    } else {
                        tokens.push(Token::Plus);
                    }
                }
                Some('-') => {
                    self.advance();
                    if self.peek() == Some('=') {
                        self.advance();
                        tokens.push(Token::MinusEq);
                    } else {
                        tokens.push(Token::Minus);
                    }
                }
                Some('*') => {
                    self.advance();
                    if self.peek() == Some('=') {
                        self.advance();
                        tokens.push(Token::MulEq);
                    } else {
                        tokens.push(Token::Star);
                    }
                }
                Some('/') => {
                    self.advance();
                    if self.peek() == Some('=') {
                        self.advance();
                        tokens.push(Token::DivEq);
                    } else {
                        tokens.push(Token::Slash);
                    }
                }
                Some('=') => {
                    self.advance();
                    if self.peek() == Some('=') {
                        self.advance();
                        tokens.push(Token::Eq);
                    } else {
                        tokens.push(Token::Assign);
                    }
                }
                Some('!') => {
                    self.advance();
                    if self.peek() == Some('=') {
                        self.advance();
                        tokens.push(Token::NotEq);
                    } else {
                        tokens.push(Token::Not);
                    }
                }
                Some('&') => {
                    self.advance();
                    if self.peek() == Some('&') {
                        self.advance();
                        tokens.push(Token::And);
                    }
                }
                Some('|') => {
                    self.advance();
                    if self.peek() == Some('|') {
                        self.advance();
                        tokens.push(Token::Or);
                    }
                }
                Some('<') => {
                    self.advance();
                    if self.peek() == Some('=') {
                        self.advance();
                        tokens.push(Token::LtEq);
                    } else {
                        tokens.push(Token::Lt);
                    }
                }
                Some('>') => {
                    self.advance();
                    if self.peek() == Some('=') {
                        self.advance();
                        tokens.push(Token::GtEq);
                    } else {
                        tokens.push(Token::Gt);
                    }
                }
                Some('[') => {
                    self.advance();
                    tokens.push(Token::LBracket);
                }
                Some(']') => {
                    self.advance();
                    tokens.push(Token::RBracket);
                }
                Some('(') => {
                    self.advance();
                    tokens.push(Token::LParen);
                }
                Some(')') => {
                    self.advance();
                    tokens.push(Token::RParen);
                }
                Some(',') => {
                    self.advance();
                    tokens.push(Token::Comma);
                }
                Some(':') => {
                    self.advance();
                    tokens.push(Token::Colon);
                }
                Some(c) => {
                    self.advance();
                    self.errors
                        .push(format!("line {}: unknown character '{c}'", self.line));
                }
            }
        }
        tokens
    }

    fn read_string(&mut self) -> Token {
        self.advance(); // skip "
        let mut s = String::new();
        while let Some(c) = self.peek() {
            if c == '"' {
                self.advance();
                break;
            }
            s.push(c);
            self.advance();
        }
        Token::StringLit(s)
    }

    fn read_number(&mut self) -> Token {
        let mut s = String::new();
        while matches!(self.peek(), Some(c) if c.is_ascii_digit()) {
            s.push(self.advance().unwrap());
        }
        // Check for fractional part → Q8.8 fixed-point literal (e.g. 3.5 → FixedLit(896))
        if self.peek() == Some('.') {
            if matches!(self.input.get(self.pos + 1), Some(c) if c.is_ascii_digit()) {
                self.advance(); // consume '.'
                let mut frac_s = String::new();
                while matches!(self.peek(), Some(c) if c.is_ascii_digit()) {
                    frac_s.push(self.advance().unwrap());
                }
                let int_part: u32 = s.parse().unwrap_or(0);
                // Compute fractional byte: parse up to 8 significant decimal digits
                // frac_byte = round(0.frac_digits × 256)
                let frac_val: f64 = format!("0.{}", frac_s).parse().unwrap_or(0.0);
                let frac_byte = (frac_val * 256.0).round() as u32;
                let q88 = ((int_part & 0xFF) << 8) | (frac_byte & 0xFF);
                return Token::FixedLit(q88 as u16);
            }
        }
        let val: u32 = s.parse().unwrap_or(0);
        if val > 0x7FFF {
            Token::Addr(val as u16)
        } else {
            Token::Number(val as i16)
        }
    }

    fn read_hex(&mut self) -> Token {
        self.advance(); // skip '$'
        let mut s = String::new();
        while matches!(self.peek(), Some(c) if c.is_ascii_hexdigit()) {
            s.push(self.advance().unwrap());
        }
        let val = u16::from_str_radix(&s, 16).unwrap_or(0);
        if val > 0x7FFF {
            Token::Addr(val)
        } else {
            Token::Number(val as i16)
        }
    }

    fn read_ident(&mut self) -> Token {
        let mut s = String::new();
        while matches!(self.peek(), Some(c) if c.is_alphanumeric() || c == '_') {
            s.push(self.advance().unwrap());
        }
        // Lowercase for case-insensitive keyword matching; also used for identifiers
        let sl = s.to_ascii_lowercase();
        // Special: "chr$" — BASIC-style char-by-code function
        if sl == "chr" && self.peek() == Some('$') {
            self.advance();
            return Token::Chr;
        }
        // Special: "str$" — integer to string conversion
        if sl == "str" && self.peek() == Some('$') {
            self.advance();
            return Token::StrN;
        }
        match sl.as_str() {
            "print" => {
                // print# (file print) — consume '#' immediately following with no space
                if self.peek() == Some('#') {
                    self.advance();
                    return Token::PrintHash;
                }
                Token::Print
            }
            "var" => Token::Var,
            "sub" => Token::Sub,
            "fn" => Token::Fn,
            "end" => Token::End,
            "if" => Token::If,
            "then" => Token::Then,
            "else" => Token::Else,
            "loop" => Token::Loop,
            "while" => Token::While,
            "to" => Token::To,
            "step" => Token::Step,
            "break" => Token::Break,
            "continue" => Token::Continue,
            "select" => Token::Select,
            "case" => Token::Case,
            "val" => Token::Val,
            "nmi" => Token::Nmi,
            "nmi_exit" => Token::NmiExit,
            "cia_timer" => Token::CiaTimer,
            "scroll" => Token::Scroll,
            "speed" => Token::Speed,
            "badlines" => Token::Badlines,
            "turbo" => Token::Turbo,
            "lowercase" => Token::Lowercase,
            "uppercase" => Token::Uppercase,
            "rect" => Token::Rect,
            // "print" is handled above in the match (before the string match block)
            "return" => Token::Return,
            "call" => Token::Call,
            "cls" => Token::Cls,
            "graphics" => Token::Graphics,
            "display" => Token::Display,
            "on" => Token::On,
            "off" => Token::Off,
            "fast" => Token::Fast,
            "sys" => Token::Sys,
            "asm" => {
                // asm { ... } — capture block source verbatim for the inline assembler
                while matches!(self.peek(), Some(' ') | Some('\t')) {
                    self.advance();
                }
                if self.peek() == Some('{') {
                    self.advance(); // consume '{'
                    let mut src = String::new();
                    loop {
                        match self.peek() {
                            None => break,
                            Some('}') => {
                                self.advance();
                                break;
                            }
                            Some(c) => {
                                src.push(c);
                                self.advance();
                            }
                        }
                    }
                    let nl_count = src.chars().filter(|&c| c == '\n').count();
                    self.line += nl_count; // keep lexer line counter accurate
                    Token::AsmSource(src, nl_count)
                } else {
                    Token::Asm // fall through: asm $EA, $EA raw-byte form
                }
            }
            "str_to_int" => Token::StrToInt,
            "numstr" => Token::NumStr,
            "color" => Token::Color,
            "text" => Token::Text,
            "border" => Token::Border,
            "bg" => Token::Bg,
            "getch" => Token::Getch,
            "inkey" => Token::Inkey,
            "waitkey" => Token::Waitkey,
            "len" => Token::StrLen,
            "asc" => Token::Asc,
            "reudet" => Token::ReuDet,
            "and" => Token::And,
            "or" => Token::Or,
            "not" => Token::Not,
            "bnot" => Token::Bnot,
            "clamp" => Token::Clamp,
            "xor" => Token::Xor,
            "shl" => Token::Shl,
            "shr" => Token::Shr,
            "wait" => Token::Wait,
            "delay" => Token::Delay,
            "raster" => Token::Raster,
            "sound" => Token::Sound,
            "int" => Token::Int,
            "string" => Token::Str,
            "float" => Token::Float,
            "const" => Token::Const,
            "label" => Token::Label,
            "goto" => Token::Goto,
            "poke" => Token::Poke,
            "peek" => Token::Peek,
            "rnd" => Token::Rnd,
            "abs" => Token::Abs,
            "min" => Token::Min,
            "max" => Token::Max,
            "sgn" => Token::Sgn,
            "word" => Token::Word,
            "array" => Token::Array,
            "array_word" => Token::ArrayWord,
            "for" => Token::For,
            "next" => Token::Next,
            "plot" => Token::Plot,
            "circle" => Token::Circle,
            "circle4" => Token::Circle4,
            "gcls" => Token::Gcls,
            "bye" => Token::Bye,
            "joy" => Token::Joy,
            "mouse_x" => Token::MouseX,
            "mouse_x_hi" => Token::MouseXHi,
            "mouse_y" => Token::MouseY,
            "mouse_btn" => Token::MouseBtn,
            "paint" => Token::Paint,
            "line" => Token::Line,
            "sin" => Token::Sin,
            "cos" => Token::Cos,
            "hex" => Token::Hex,
            "bin" => Token::Bin,
            "reu" => Token::Reu,
            "stash" => Token::Stash,
            "fetch" => Token::Fetch,
            "multi" => Token::Multi,
            "flip" => Token::Flip,
            "block" => Token::Block,
            "plot4" => Token::Plot4,
            "exit" => Token::Bye,
            "incbin" => Token::Incbin,
            "include" => Token::Include,
            "data" => Token::Data,
            "read" => Token::Read,
            "load" => Token::Load,
            "sid" => Token::Sid,
            "input" => Token::Input,
            "fill" => Token::Fill,
            "memcopy" => Token::Memcopy,
            "drawmem" => Token::DrawMem,
            "irq" => Token::Irq,
            "irq_exit" => Token::IrqExit,
            "save" => Token::Save,
            "volume" => Token::Volume,
            "at" => Token::At,
            "cursor" => Token::Cursor,
            "repeat" => Token::Repeat,
            "until" => Token::Until,
            "erase" => Token::Erase,
            "expand" => Token::Expand,
            "priority" => Token::Priority,
            "mod" => Token::Mod,
            "peek16" => Token::Peek16,
            "poke16" => Token::Poke16,
            "open" => Token::Open,
            "close" => Token::Close,
            "sprite" => Token::Sprite,
            "sprhit" => Token::SpriteHit,
            "sprbghit" => Token::SpriteBgHit,
            "sprite_x" => Token::SpriteX,
            "sprite_y" => Token::SpriteY,
            "sprite_frame" => Token::SpriteFrame,
            "times" => Token::Times,
            "sprdef" => Token::Sprdef,
            "gosub" => Token::Gosub,
            "chardef" => Token::Chardef,
            "charset" => Token::Charset,
            "mplot" => Token::Mplot,
            "music" => Token::Music,
            "play" => Token::Play,
            "stop" => Token::Stop,
            "pause" => Token::Pause,
            "resume" => Token::Resume,
            "onerr" => Token::OnErr,
            "inc" => Token::Inc,
            "dec" => Token::Dec,
            "screen" => Token::Screen,
            "spc" => Token::Spc,
            "tab" => Token::Tab,
            "rem" => {
                while !matches!(self.peek(), None | Some('\n')) {
                    self.advance();
                }
                if self.peek() == Some('\n') {
                    self.advance();
                    self.line += 1;
                }
                Token::Newline
            }
            _ => Token::Ident(sl),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn tokenize(src: &str) -> Vec<Token> {
        Lexer::new(src).tokenize()
    }

    // ── Operators ────────────────────────────────────────────────────────

    #[test]
    fn plus() {
        assert_eq!(tokenize("+"), vec![Token::Plus, Token::Eof]);
    }
    #[test]
    fn minus() {
        assert_eq!(tokenize("-"), vec![Token::Minus, Token::Eof]);
    }
    #[test]
    fn star() {
        assert_eq!(tokenize("*"), vec![Token::Star, Token::Eof]);
    }
    #[test]
    fn slash() {
        assert_eq!(tokenize("/"), vec![Token::Slash, Token::Eof]);
    }
    #[test]
    fn eq() {
        assert_eq!(tokenize("=="), vec![Token::Eq, Token::Eof]);
    }
    #[test]
    fn not_eq() {
        assert_eq!(tokenize("!="), vec![Token::NotEq, Token::Eof]);
    }
    #[test]
    fn lt() {
        assert_eq!(tokenize("<"), vec![Token::Lt, Token::Eof]);
    }
    #[test]
    fn gt() {
        assert_eq!(tokenize(">"), vec![Token::Gt, Token::Eof]);
    }
    #[test]
    fn lt_eq() {
        assert_eq!(tokenize("<="), vec![Token::LtEq, Token::Eof]);
    }
    #[test]
    fn gt_eq() {
        assert_eq!(tokenize(">="), vec![Token::GtEq, Token::Eof]);
    }
    #[test]
    fn assign() {
        assert_eq!(tokenize("="), vec![Token::Assign, Token::Eof]);
    }
    #[test]
    fn and_op() {
        assert_eq!(tokenize("&&"), vec![Token::And, Token::Eof]);
    }
    #[test]
    fn or_op() {
        assert_eq!(tokenize("||"), vec![Token::Or, Token::Eof]);
    }
    #[test]
    fn not_op() {
        assert_eq!(tokenize("!"), vec![Token::Not, Token::Eof]);
    }

    // ── Punctuation ──────────────────────────────────────────────────────

    #[test]
    fn colon() {
        assert_eq!(tokenize(":"), vec![Token::Colon, Token::Eof]);
    }
    #[test]
    fn lparen() {
        assert_eq!(tokenize("("), vec![Token::LParen, Token::Eof]);
    }
    #[test]
    fn rparen() {
        assert_eq!(tokenize(")"), vec![Token::RParen, Token::Eof]);
    }
    #[test]
    fn comma() {
        assert_eq!(tokenize(","), vec![Token::Comma, Token::Eof]);
    }
    #[test]
    fn lbrace() {
        assert_eq!(tokenize("{"), vec![Token::LBrace, Token::Eof]);
    }
    #[test]
    fn rbrace() {
        assert_eq!(tokenize("}"), vec![Token::RBrace, Token::Eof]);
    }

    // ── Keywords ─────────────────────────────────────────────────────────

    #[test]
    fn kw_var() {
        assert_eq!(tokenize("var")[0], Token::Var);
    }
    #[test]
    fn kw_sub() {
        assert_eq!(tokenize("sub")[0], Token::Sub);
    }
    #[test]
    fn kw_end() {
        assert_eq!(tokenize("end")[0], Token::End);
    }
    #[test]
    fn kw_if() {
        assert_eq!(tokenize("if")[0], Token::If);
    }
    #[test]
    fn kw_then() {
        assert_eq!(tokenize("then")[0], Token::Then);
    }
    #[test]
    fn kw_else() {
        assert_eq!(tokenize("else")[0], Token::Else);
    }
    #[test]
    fn kw_loop() {
        assert_eq!(tokenize("loop")[0], Token::Loop);
    }
    #[test]
    fn kw_while() {
        assert_eq!(tokenize("while")[0], Token::While);
    }
    #[test]
    fn kw_to() {
        assert_eq!(tokenize("to")[0], Token::To);
    }
    #[test]
    fn kw_step() {
        assert_eq!(tokenize("step")[0], Token::Step);
    }
    #[test]
    fn kw_break() {
        assert_eq!(tokenize("break")[0], Token::Break);
    }
    #[test]
    fn kw_print() {
        assert_eq!(tokenize("print")[0], Token::Print);
    }
    #[test]
    fn kw_return() {
        assert_eq!(tokenize("return")[0], Token::Return);
    }
    #[test]
    fn kw_call() {
        assert_eq!(tokenize("call")[0], Token::Call);
    }
    #[test]
    fn kw_cls() {
        assert_eq!(tokenize("cls")[0], Token::Cls);
    }
    #[test]
    fn kw_sys() {
        assert_eq!(tokenize("sys")[0], Token::Sys);
    }
    #[test]
    fn kw_asm() {
        assert_eq!(tokenize("asm")[0], Token::Asm);
    }
    #[test]
    fn kw_color() {
        assert_eq!(tokenize("color")[0], Token::Color);
    }
    #[test]
    fn kw_text() {
        assert_eq!(tokenize("text")[0], Token::Text);
    }
    #[test]
    fn kw_border() {
        assert_eq!(tokenize("border")[0], Token::Border);
    }
    #[test]
    fn kw_bg() {
        assert_eq!(tokenize("bg")[0], Token::Bg);
    }
    #[test]
    fn kw_getch() {
        assert_eq!(tokenize("getch")[0], Token::Getch);
    }
    #[test]
    fn kw_and() {
        assert_eq!(tokenize("and")[0], Token::And);
    }
    #[test]
    fn kw_or() {
        assert_eq!(tokenize("or")[0], Token::Or);
    }
    #[test]
    fn kw_not() {
        assert_eq!(tokenize("not")[0], Token::Not);
    }
    #[test]
    fn kw_int() {
        assert_eq!(tokenize("int")[0], Token::Int);
    }
    #[test]
    fn kw_string() {
        assert_eq!(tokenize("string")[0], Token::Str);
    }
    #[test]
    fn kw_float() {
        assert_eq!(tokenize("float")[0], Token::Float);
    }
    #[test]
    fn kw_speed() {
        assert_eq!(tokenize("speed")[0], Token::Speed);
    }
    #[test]
    fn kw_badlines() {
        assert_eq!(tokenize("badlines")[0], Token::Badlines);
    }
    #[test]
    fn kw_turbo() {
        assert_eq!(tokenize("turbo")[0], Token::Turbo);
    }
    #[test]
    fn kw_graphics() {
        assert_eq!(tokenize("graphics")[0], Token::Graphics);
    }
    #[test]
    fn kw_on() {
        assert_eq!(tokenize("on")[0], Token::On);
    }
    #[test]
    fn kw_off() {
        assert_eq!(tokenize("off")[0], Token::Off);
    }
    #[test]
    fn kw_fast() {
        assert_eq!(tokenize("fast")[0], Token::Fast);
    }
    #[test]
    fn kw_str_to_int() {
        assert_eq!(tokenize("str_to_int")[0], Token::StrToInt);
    }
    #[test]
    fn kw_numstr() {
        assert_eq!(tokenize("numstr")[0], Token::NumStr);
    }
    #[test]
    fn kw_const() {
        assert_eq!(tokenize("const")[0], Token::Const);
    }
    #[test]
    fn kw_label() {
        assert_eq!(tokenize("label")[0], Token::Label);
    }
    #[test]
    fn kw_goto() {
        assert_eq!(tokenize("goto")[0], Token::Goto);
    }
    #[test]
    fn kw_poke() {
        assert_eq!(tokenize("poke")[0], Token::Poke);
    }
    #[test]
    fn kw_peek() {
        assert_eq!(tokenize("peek")[0], Token::Peek);
    }
    #[test]
    fn kw_rnd() {
        assert_eq!(tokenize("rnd")[0], Token::Rnd);
    }
    #[test]
    fn kw_abs() {
        assert_eq!(tokenize("abs")[0], Token::Abs);
    }
    #[test]
    fn kw_min() {
        assert_eq!(tokenize("min")[0], Token::Min);
    }
    #[test]
    fn kw_max() {
        assert_eq!(tokenize("max")[0], Token::Max);
    }
    #[test]
    fn kw_sgn() {
        assert_eq!(tokenize("sgn")[0], Token::Sgn);
    }
    #[test]
    fn kw_word() {
        assert_eq!(tokenize("word")[0], Token::Word);
    }
    #[test]
    fn kw_array() {
        assert_eq!(tokenize("array")[0], Token::Array);
    }
    #[test]
    fn kw_for() {
        assert_eq!(tokenize("for")[0], Token::For);
    }
    #[test]
    fn kw_next() {
        assert_eq!(tokenize("next")[0], Token::Next);
    }
    #[test]
    fn kw_plot() {
        assert_eq!(tokenize("plot")[0], Token::Plot);
    }
    #[test]
    fn kw_circle() {
        assert_eq!(tokenize("circle")[0], Token::Circle);
    }
    #[test]
    fn kw_circle4() {
        assert_eq!(tokenize("circle4")[0], Token::Circle4);
    }
    #[test]
    fn kw_joy() {
        assert_eq!(tokenize("joy")[0], Token::Joy);
    }
    #[test]
    fn kw_line() {
        assert_eq!(tokenize("line")[0], Token::Line);
    }
    #[test]
    fn kw_sin() {
        assert_eq!(tokenize("sin")[0], Token::Sin);
    }
    #[test]
    fn kw_cos() {
        assert_eq!(tokenize("cos")[0], Token::Cos);
    }
    #[test]
    fn kw_hex() {
        assert_eq!(tokenize("hex")[0], Token::Hex);
    }
    #[test]
    fn kw_bin() {
        assert_eq!(tokenize("bin")[0], Token::Bin);
    }
    #[test]
    fn kw_reu() {
        assert_eq!(tokenize("reu")[0], Token::Reu);
    }
    #[test]
    fn kw_reudet() {
        assert_eq!(tokenize("reudet")[0], Token::ReuDet);
    }
    #[test]
    fn kw_gcls() {
        assert_eq!(tokenize("gcls")[0], Token::Gcls);
    }
    #[test]
    fn kw_bye() {
        assert_eq!(tokenize("bye")[0], Token::Bye);
    }
    #[test]
    fn kw_exit() {
        assert_eq!(tokenize("exit")[0], Token::Bye);
    }
    #[test]
    fn kw_incbin() {
        assert_eq!(tokenize("incbin")[0], Token::Incbin);
    }
    #[test]
    fn kw_include() {
        assert_eq!(tokenize("include")[0], Token::Include);
    }
    #[test]
    fn kw_data() {
        assert_eq!(tokenize("data")[0], Token::Data);
    }
    #[test]
    fn kw_read() {
        assert_eq!(tokenize("read")[0], Token::Read);
    }
    #[test]
    fn rem_skips_to_eol() {
        let toks = tokenize("rem ignored text\nvar x = 1");
        // rem consumes line and emits Newline; next tokens are var x = 1
        assert!(
            toks.iter().any(|t| t == &Token::Var),
            "var should follow rem line"
        );
    }
    #[test]
    fn semicolon_is_statement_separator() {
        let toks = tokenize("42 ; 99");
        assert_eq!(toks[0], Token::Number(42));
        assert_eq!(toks[1], Token::Semicolon);
        assert!(toks.iter().any(|t| t == &Token::Number(99)));
    }
    #[test]
    fn kw_chr_dollar() {
        assert_eq!(tokenize("chr$")[0], Token::Chr);
    }
    #[test]
    fn chr_dollar_no_ident_after() {
        // "chr$" followed by '(' should tokenize as Chr + LParen
        let toks = tokenize("chr$(65)");
        assert_eq!(toks[0], Token::Chr);
        assert_eq!(toks[1], Token::LParen);
    }
    #[test]
    fn lbracket() {
        assert_eq!(tokenize("["), vec![Token::LBracket, Token::Eof]);
    }
    #[test]
    fn rbracket() {
        assert_eq!(tokenize("]"), vec![Token::RBracket, Token::Eof]);
    }

    // ── Numbers ──────────────────────────────────────────────────────────

    #[test]
    fn number_simple() {
        assert_eq!(tokenize("42")[0], Token::Number(42));
    }
    #[test]
    fn number_zero() {
        assert_eq!(tokenize("0")[0], Token::Number(0));
    }
    #[test]
    fn number_negative() {
        // minus is a separate token
        assert_eq!(
            tokenize("-5"),
            vec![Token::Minus, Token::Number(5), Token::Eof]
        );
    }

    // ── Hex numbers ──────────────────────────────────────────────────────

    #[test]
    fn hex_small() {
        assert_eq!(tokenize("$FF")[0], Token::Number(0xFF));
    }
    #[test]
    fn hex_addr() {
        // Values > 0x7FFF produce Addr token
        // $D020 = 53280, which is > 0x7FFF.
        assert_eq!(tokenize("$D020")[0], Token::Addr(0xD020));
    }
    #[test]
    fn hex_border() {
        // $0286 = 646, small number
        assert_eq!(tokenize("$0286")[0], Token::Number(0x0286));
    }

    // ── Identifiers ──────────────────────────────────────────────────────

    #[test]
    fn ident_simple() {
        assert_eq!(tokenize("hello")[0], Token::Ident("hello".into()));
    }
    #[test]
    fn ident_with_underscore() {
        assert_eq!(tokenize("my_var")[0], Token::Ident("my_var".into()));
    }

    // ── String literals ─────────────────────────────────────────────────

    #[test]
    fn string_lit() {
        assert_eq!(
            tokenize("\"hello\""),
            vec![Token::StringLit("hello".into()), Token::Eof]
        );
    }
    #[test]
    fn empty_string() {
        assert_eq!(
            tokenize("\"\""),
            vec![Token::StringLit("".into()), Token::Eof]
        );
    }

    // ── Comments ─────────────────────────────────────────────────────────
    #[test]
    fn comment_ignored() {
        assert_eq!(
            tokenize("# comment\n42"),
            vec![Token::Newline, Token::Number(42), Token::Eof]
        );
    }
    #[test]
    fn comment_at_end() {
        assert_eq!(tokenize("42# comment"), vec![Token::Number(42), Token::Eof]);
    }
    // ── Multi-token ──────────────────────────────────────────────────────

    #[test]
    fn multi_token_statement() {
        let tokens = tokenize("var x = 5");
        assert_eq!(
            tokens,
            vec![
                Token::Var,
                Token::Ident("x".into()),
                Token::Assign,
                Token::Number(5),
                Token::Eof,
            ]
        );
    }

    #[test]
    fn print_with_args() {
        let tokens = tokenize("print \"Hi\", 42");
        assert_eq!(
            tokens,
            vec![
                Token::Print,
                Token::StringLit("Hi".into()),
                Token::Comma,
                Token::Number(42),
                Token::Eof,
            ]
        );
    }

    #[test]
    fn for_loop_tokens() {
        let tokens = tokenize("loop i = 1 to 5 step 2");
        assert_eq!(
            tokens,
            vec![
                Token::Loop,
                Token::Ident("i".into()),
                Token::Assign,
                Token::Number(1),
                Token::To,
                Token::Number(5),
                Token::Step,
                Token::Number(2),
                Token::Eof,
            ]
        );
    }

    #[test]
    fn color_border_tokens() {
        let tokens = tokenize("color border 2");
        assert_eq!(
            tokens,
            vec![Token::Color, Token::Border, Token::Number(2), Token::Eof,]
        );
    }

    #[test]
    fn typed_var_tokens() {
        let tokens = tokenize("var s: string = \"hi\"");
        assert_eq!(
            tokens,
            vec![
                Token::Var,
                Token::Ident("s".into()),
                Token::Colon,
                Token::Str,
                Token::Assign,
                Token::StringLit("hi".into()),
                Token::Eof,
            ]
        );
    }

    #[test]
    fn asm_block_tokens() {
        // asm { ... } is now captured as a single AsmSource token
        let tokens = tokenize("asm { $A9 $07 }");
        assert!(
            matches!(&tokens[0], Token::AsmSource(s, _) if s.contains("$A9")),
            "asm block should produce AsmSource token, got {:?}",
            tokens
        );
        assert_eq!(tokens[1], Token::Eof);
    }

    #[test]
    fn newline_separates() {
        let tokens = tokenize("var x = 1\nvar y = 2");
        assert_eq!(
            tokens,
            vec![
                Token::Var,
                Token::Ident("x".into()),
                Token::Assign,
                Token::Number(1),
                Token::Newline,
                Token::Var,
                Token::Ident("y".into()),
                Token::Assign,
                Token::Number(2),
                Token::Eof,
            ]
        );
    }
}
