//! VMA source → blocks: the line rules of `parseExpertText` and `parseAsmText` (www/app.js),
//! in the same order. A directive of the JS compiler that is not ported yet becomes
//! `Kind::Unsupported`, which fails the build instead of assembling something else.

use crate::expr::char_literal_to_hex;
use crate::num::{import_parse_scalar, is_bin, is_dec, is_hex, js_hex_upper, js_parse_int, parse_number_by_base};
use regex::Regex;
use std::sync::OnceLock;

#[derive(Clone, Copy, PartialEq, Eq, Debug, Hash)]
pub enum Mode {
    Implied,
    Immediate,
    ZeroPage,
    ZeroPageX,
    ZeroPageY,
    Absolute,
    AbsoluteX,
    AbsoluteY,
    Indirect,
    IndirectX,
    IndirectY,
    Relative,
}

impl Mode {
    pub fn size(self) -> i64 {
        match self {
            Mode::Implied => 1,
            Mode::Immediate | Mode::ZeroPage | Mode::ZeroPageX | Mode::ZeroPageY | Mode::Relative | Mode::IndirectX | Mode::IndirectY => 2,
            _ => 3,
        }
    }
    pub fn one_byte_operand(self) -> bool {
        matches!(self, Mode::Immediate | Mode::ZeroPage | Mode::ZeroPageX | Mode::ZeroPageY | Mode::IndirectX | Mode::IndirectY)
    }
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum Base {
    Hex,
    Dec,
    Bin,
}

#[derive(Clone, Debug)]
pub enum Kind {
    Blank,
    /// A comment; `error` = an unknown directive or an ACME pseudo opcode.
    Comment { text: String, error: Option<String> },
    Org { address: String },
    Label { name: String, offset: i64, kick_scope: bool },
    AnonLabel,
    KickScopeEnd,
    Instr { mnem: String, mode: Mode, raw: String, base: Base, smc: Option<String> },
    LongBranch { mnem: String, cond: String, raw: String },
    Byte { raw: String, base: Base, error: Option<String> },
    Word { raw: String, base: Base },
    Fill { raw: String, base: Base },
    Align { raw: String, base: Base },
    Assert { expr: String, message: String },
    Const { name: String, raw: String, base: Base, value: Option<f64> },
    Define { symbols: String },
    If { condition: String },
    Else,
    EndIf,
    Region,
    EndRegion,
    /// A JS directive the Rust compiler does not assemble yet (its mnemonic).
    Unsupported { what: String },
}

#[derive(Clone, Debug)]
pub struct Block {
    pub kind: Kind,
    /// 0-based source line
    pub line: usize,
}

macro_rules! regex {
    ($p:expr) => {{
        static CELL: OnceLock<Regex> = OnceLock::new();
        CELL.get_or_init(|| Regex::new($p).unwrap())
    }};
}

/// `_splitAsmLineComment`: (code, comment text)
pub fn split_comment(raw: &str) -> (&str, &str) {
    let b = raw.as_bytes();
    let mut quote = 0u8;
    let mut escaped = false;
    let mut i = 0;
    while i < b.len() {
        let ch = b[i];
        if escaped {
            escaped = false;
        } else if quote != 0 {
            if ch == b'\\' {
                escaped = true;
            } else if ch == quote {
                quote = 0;
            }
        } else if ch == b'"' || ch == b'\'' {
            quote = ch;
        } else if ch == b';' {
            return (&raw[..i], raw[i + 1..].trim());
        } else if ch == b'/' && b.get(i + 1) == Some(&b'/') {
            return (&raw[..i], raw[i + 2..].trim());
        }
        i += 1;
    }
    (raw, "")
}

/// `_kickScopeRewrite`: labels defined inside `name: {` … `}` become `.label` locals.
fn kick_scope_rewrite(lines: &[&str]) -> Vec<String> {
    let mut out: Vec<String> = lines.iter().map(|s| s.to_string()).collect();
    let open_re = regex!(r"^\s*[A-Za-z_][A-Za-z0-9_]*\s*:\s*\{\s*$");
    let close_re = regex!(r"^\s*\}\s*$");
    let mut open = Vec::new();
    let mut scopes = Vec::new();
    for (i, raw) in lines.iter().enumerate() {
        let (code, _) = split_comment(raw);
        if open_re.is_match(code) {
            open.push(i);
        } else if close_re.is_match(code) {
            if let Some(start) = open.pop() {
                scopes.push((start, i));
            }
        }
    }
    let def_re = regex!(r"^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:");
    for (start, end) in scopes {
        let mut locals: Vec<String> = Vec::new();
        for line in &lines[start + 1..end] {
            let (code, _) = split_comment(line);
            if let Some(m) = def_re.captures(code) {
                // (?!\s*\{): a nested scope opener is not a local label
                let after = code[m.get(0).unwrap().end()..].trim_start();
                if !after.starts_with('{') && !locals.contains(&m[1].to_string()) {
                    locals.push(m[1].to_string());
                }
            }
        }
        if locals.is_empty() {
            continue;
        }
        for line in out.iter_mut().take(end).skip(start + 1) {
            let (code, _) = split_comment(line);
            let code_len = code.len();
            let rest = line[code_len..].to_string();
            let mut rewritten = String::new();
            for (k, part) in split_keep_quotes(&line[..code_len]).into_iter().enumerate() {
                if k % 2 == 1 {
                    rewritten.push_str(&part);
                } else {
                    rewritten.push_str(&prefix_locals(&part, &locals));
                }
            }
            *line = rewritten + &rest;
        }
    }
    out
}

/// `code.split(/("[^"]*")/)`: even parts outside quotes, odd parts the quoted strings.
fn split_keep_quotes(s: &str) -> Vec<String> {
    let re = regex!(r#""[^"]*""#);
    let mut parts = Vec::new();
    let mut last = 0;
    for m in re.find_iter(s) {
        parts.push(s[last..m.start()].to_string());
        parts.push(m.as_str().to_string());
        last = m.end();
    }
    parts.push(s[last..].to_string());
    parts
}

/// `(?<![\w.$])(names)(?![\w])` → `.$1`
fn prefix_locals(s: &str, locals: &[String]) -> String {
    let b = s.as_bytes();
    let word = |c: u8| c.is_ascii_alphanumeric() || c == b'_';
    let mut out = String::new();
    let mut i = 0;
    'outer: while i < b.len() {
        let prev_ok = i == 0 || !(word(b[i - 1]) || b[i - 1] == b'.' || b[i - 1] == b'$');
        if prev_ok {
            for name in locals {
                let end = i + name.len();
                if s[i..].starts_with(name.as_str()) && (end >= b.len() || !word(b[end])) {
                    out.push('.');
                    out.push_str(name);
                    i = end;
                    continue 'outer;
                }
            }
        }
        out.push(b[i] as char);
        i += 1;
    }
    out
}

/// `_kickTextBytes`: None for a character the encoding has no code for.
pub fn kick_text_bytes(operand: &str, encoding: &str) -> Vec<Option<u8>> {
    let enc = encoding.to_lowercase();
    let encode = |ch: char| -> Option<u8> {
        let c: u32 = match ch {
            '£' => 0x5C,
            '↑' => 0x5E,
            '←' => 0x5F,
            _ => ch as u32,
        };
        if c > 0x7F {
            return None;
        }
        let lower = (0x61..=0x7A).contains(&c);
        let upper = (0x41..=0x5A).contains(&c);
        let v = match enc.as_str() {
            "ascii" => Some(c),
            "petscii_upper" => Some(if lower { c - 0x20 } else { c }),
            "petscii_mixed" => Some(if lower { c - 0x20 } else if upper { c + 0x80 } else { c }),
            "screencode_upper" => {
                if (0x20..0x40).contains(&c) { Some(c) } else if (0x40..0x60).contains(&c) { Some(c - 0x40) } else if lower { Some(c - 0x60) } else { None }
            }
            "screencode_mixed" => {
                if (0x20..0x40).contains(&c) || upper { Some(c) } else if (0x40..0x60).contains(&c) { Some(c - 0x40) } else if lower { Some(c - 0x60) } else { None }
            }
            _ => None,
        };
        v.map(|v| v as u8)
    };
    let item = regex!(r#"@"((?:[^"\\]|\\.)*)"|"([^"]*)"|\$([0-9A-Fa-f]{1,2})|(\d{1,3})"#);
    let mut out = Vec::new();
    for m in item.captures_iter(operand) {
        if let Some(h) = m.get(3) {
            out.push(Some(js_parse_int(h.as_str(), 16) as u8));
        } else if let Some(d) = m.get(4) {
            let v = js_parse_int(d.as_str(), 10);
            out.push(if v <= 255.0 { Some(v as u8) } else { None });
        } else if let Some(s) = m.get(2) {
            out.extend(s.as_str().chars().map(encode));
        } else {
            let s: Vec<char> = m[1].chars().collect();
            let mut i = 0;
            while i < s.len() {
                if s[i] != '\\' {
                    out.push(encode(s[i]));
                    i += 1;
                    continue;
                }
                i += 1;
                let e = s.get(i).copied();
                let hex: String = s.iter().skip(i + 1).take(2).collect();
                if e == Some('$') && hex.len() == 2 && is_hex(&hex) {
                    out.push(Some(js_parse_int(&hex, 16) as u8));
                    i += 2;
                } else {
                    out.push(match e {
                        Some('n') => Some(0x0A),
                        Some('r') => Some(0x0D),
                        Some('t') => Some(0x09),
                        Some(c) => encode(c),
                        None => None,
                    });
                }
                i += 1;
            }
        }
    }
    out
}

/// `_importDetectListBase`: (base, normalized list)
pub fn detect_list_base(raw_list: &str) -> (Base, String) {
    let parts: Vec<String> = raw_list.split(',').map(|p| char_literal_to_hex(p.trim())).filter(|p| !p.is_empty()).collect();
    if parts.is_empty() {
        return (Base::Hex, raw_list.trim().to_string());
    }
    let lohi = regex!(r"^[<>][A-Za-z_.][A-Za-z0-9_.]*$");
    if parts.iter().any(|p| lohi.is_match(p)) {
        return (Base::Dec, parts.join(","));
    }
    let numeric = regex!(r"(?i)^(?:%[01]+|\$[0-9A-Fa-f]+|0x[0-9A-Fa-f]+|\d+)$");
    let has_name = regex!(r"[A-Za-z_(]");
    let strip_0x = regex!(r"(?i)^0x");
    if parts.iter().any(|p| !numeric.is_match(p) && has_name.is_match(&strip_0x.replace(p, ""))) {
        return (Base::Dec, parts.join(","));
    }
    let is_hex_part = |p: &str| (p.starts_with('$') && is_hex(&p[1..])) || (p.len() > 2 && p[..2].eq_ignore_ascii_case("0x") && is_hex(&p[2..]));
    let all_bin = parts.iter().all(|p| p.starts_with('%') && is_bin(&p[1..]));
    let all_hex = parts.iter().all(|p| is_hex_part(p));
    let all_dec = parts.iter().all(|p| is_dec(p));
    let stripped: Vec<String> = parts.iter().map(|p| strip_0x.replace(p.trim_start_matches(|c| c == '$' || c == '%'), "").into_owned()).collect();
    // JS strips one leading $ or %, then 0x
    let stripped: Vec<String> = parts
        .iter()
        .zip(stripped)
        .map(|(p, s)| {
            let one = if p.starts_with('$') || p.starts_with('%') { &p[1..] } else { p.as_str() };
            if one.len() >= 2 && one[..2].eq_ignore_ascii_case("0x") { one[2..].to_string() } else { let _ = s; one.to_string() }
        })
        .collect();
    if all_bin {
        return (Base::Bin, stripped.join(","));
    }
    if all_dec {
        return (Base::Dec, stripped.join(","));
    }
    if all_hex {
        return (Base::Hex, stripped.join(",").to_uppercase());
    }
    let hex_of = |p: &str| {
        let n = if let Some(b) = p.strip_prefix('%') {
            js_parse_int(b, 2)
        } else if let Some(h) = p.strip_prefix('$') {
            js_parse_int(h, 16)
        } else if p.len() >= 2 && p[..2].eq_ignore_ascii_case("0x") {
            js_parse_int(&p[2..], 16)
        } else {
            js_parse_int(p, 10)
        };
        let s = js_hex_upper(n);
        if s.len() < 2 { format!("{:0>2}", s) } else { s }
    };
    (Base::Hex, parts.iter().map(|p| hex_of(p)).collect::<Vec<_>>().join(","))
}

fn make_byte(raw: &str) -> Kind {
    let (base, normalized) = detect_list_base(raw.trim());
    Kind::Byte { raw: normalized, base, error: None }
}

fn make_word(raw: &str) -> Kind {
    let (base, normalized) = detect_list_base(raw);
    Kind::Word { raw: normalized, base: if base == Base::Bin { Base::Hex } else { base } }
}

fn make_fill(raw: &str) -> Kind {
    let mut parts = Vec::new();
    let mut current = String::new();
    let mut depth = 0i32;
    for ch in raw.chars() {
        if ch == '(' {
            depth += 1;
        }
        if ch == ')' {
            depth = (depth - 1).max(0);
        }
        if ch == ',' && depth == 0 {
            parts.push(current.trim().to_string());
            current.clear();
            continue;
        }
        current.push(ch);
    }
    if !current.trim().is_empty() {
        parts.push(current.trim().to_string());
    }
    let base = match parts.first().map(|p| import_parse_scalar(p).0) {
        Some(Base::Hex) => Base::Hex,
        _ => Base::Dec,
    };
    Kind::Fill { raw: raw.trim().to_string(), base }
}

fn make_align(raw: &str) -> Kind {
    let (base, value) = import_parse_scalar(raw);
    Kind::Align { raw: value, base: if base == Base::Bin { Base::Hex } else { base } }
}

fn make_const(name: &str, raw: &str) -> Kind {
    let (base, value) = import_parse_scalar(raw);
    let v = parse_number_by_base(&value, base);
    Kind::Const { name: name.to_string(), raw: value, base, value: v }
}

fn make_label(name: &str) -> Kind {
    Kind::Label { name: name.to_string(), offset: 0, kick_scope: false }
}

const LABEL_NAME: &str = r"(?:@?[A-Za-z_][A-Za-z0-9_]*|\.[A-Za-z][A-Za-z0-9_]*)";

fn is_branch(mnem: &str) -> bool {
    matches!(mnem, "BEQ" | "BNE" | "BCC" | "BCS" | "BMI" | "BPL" | "BVC" | "BVS" | "BRA")
}

/// `_importMakeInstruction`
pub fn make_instruction(mnemonic: &str, operand_raw: &str) -> Kind {
    let mnem = mnemonic.to_string();
    let mut operand = operand_raw.trim().to_string();
    if matches!(mnem.as_str(), "ASL" | "LSR" | "ROL" | "ROR") && operand.eq_ignore_ascii_case("A") {
        operand.clear();
    }
    if let Some(cond) = mnem.strip_prefix("LB") {
        if matches!(cond, "NE" | "EQ" | "CC" | "CS" | "MI" | "PL" | "VC" | "VS") {
            return Kind::LongBranch { mnem: mnem.clone(), cond: cond.to_string(), raw: operand.trim().to_string() };
        }
    }
    let mut forced = "";
    if let Some(c) = regex!(r"(?i)^\.(abs|a|zp|z)\s+(\S.*)$").captures(&operand) {
        forced = if c[1].to_lowercase().starts_with('a') { "abs" } else { "zp" };
        operand = c[2].trim().to_string();
    }
    let mut smc = None;
    if let Some(c) = regex!(r"^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.+)$").captures(&operand) {
        // (?!:) after the colon and spaces
        let colon = c.get(0).unwrap().as_str().find(':').unwrap();
        let after = c.get(0).unwrap().as_str()[colon + 1..].trim_start();
        if !after.starts_with(':') {
            smc = Some(c[1].to_string());
            operand = c[2].trim().to_string();
        }
    }

    let mut mode = Mode::Implied;
    let mut raw = String::new();
    let mut base = Base::Hex;
    if !operand.is_empty() {
        let mut op = operand.clone();
        op = regex!(r"\(\s+").replace_all(&op, "(").into_owned();
        op = regex!(r"\s+\)").replace_all(&op, ")").into_owned();
        op = regex!(r",\s*([XYxy])\s*$").replace_all(&op, ",$1").into_owned();
        op = regex!(r"\s*\+\s*([\$0-9])").replace_all(&op, "+$1").into_owned();
        op = regex!(r"\s*-\s*([\$0-9])").replace_all(&op, "-$1").into_owned();
        let branch = is_branch(&mnem);
        let wide_or = |hex: &str, wide: Mode, narrow: Mode| {
            if hex.len() > 2 || js_parse_int(hex, 16) > 255.0 { wide } else { narrow }
        };
        if let Some(val) = op.strip_prefix('#') {
            mode = Mode::Immediate;
            if let Some(b) = val.strip_prefix('%') {
                base = Base::Bin;
                raw = b.to_string();
            } else if let Some(h) = val.strip_prefix('$') {
                raw = h.to_uppercase();
            } else if is_dec(val) {
                base = Base::Dec;
                raw = val.to_string();
            } else {
                raw = val.to_string();
            }
        } else if let Some(c) = regex!(r"(?i)^\(\$([0-9A-Fa-f]+),X\)$").captures(&op) {
            mode = Mode::IndirectX;
            raw = c[1].to_uppercase();
        } else if let Some(c) = regex!(r"(?i)^\(\$([0-9A-Fa-f]+)\),Y$").captures(&op) {
            mode = Mode::IndirectY;
            raw = c[1].to_uppercase();
        } else if let Some(c) = regex!(r"(?i)^\(\$([0-9A-Fa-f]+)\)$").captures(&op) {
            mode = Mode::Indirect;
            raw = c[1].to_uppercase();
        } else if let Some(c) = regex!(r"(?i)^\$([0-9A-Fa-f]+),X$").captures(&op) {
            raw = c[1].to_uppercase();
            mode = wide_or(&raw, Mode::AbsoluteX, Mode::ZeroPageX);
        } else if let Some(c) = regex!(r"(?i)^(\d+),X$").captures(&op) {
            raw = c[1].to_string();
            base = Base::Dec;
            mode = if js_parse_int(&raw, 10) > 255.0 { Mode::AbsoluteX } else { Mode::ZeroPageX };
        } else if let Some(c) = regex!(r"(?i)^\$([0-9A-Fa-f]+),Y$").captures(&op) {
            raw = c[1].to_uppercase();
            mode = wide_or(&raw, Mode::AbsoluteY, Mode::ZeroPageY);
        } else if let Some(c) = regex!(r"(?i)^(\d+),Y$").captures(&op) {
            raw = c[1].to_string();
            base = Base::Dec;
            mode = if js_parse_int(&raw, 10) > 255.0 { Mode::AbsoluteY } else { Mode::ZeroPageY };
        } else if let Some(c) = regex!(r"^\$([0-9A-Fa-f]+)$").captures(&op) {
            raw = c[1].to_uppercase();
            mode = if branch { Mode::Relative } else { wide_or(&raw, Mode::Absolute, Mode::ZeroPage) };
        } else if let Some(c) = regex!(&format!(r"(?i)^\(({LABEL_NAME}),X\)$")).captures(&op) {
            raw = c[1].trim().to_string();
            mode = Mode::IndirectX;
        } else if let Some(c) = regex!(&format!(r"(?i)^\(({LABEL_NAME})\),Y$")).captures(&op) {
            raw = c[1].trim().to_string();
            mode = Mode::IndirectY;
        } else if regex!(&format!(r"(?i)^{LABEL_NAME}(?:\s*[+-]\s*(?:\$[0-9A-Fa-f]+|\d+))?,X$")).is_match(&op) {
            raw = op[..op.rfind(',').unwrap()].trim().to_string();
            mode = Mode::AbsoluteX;
        } else if regex!(&format!(r"(?i)^{LABEL_NAME}(?:\s*[+-]\s*(?:\$[0-9A-Fa-f]+|\d+))?,Y$")).is_match(&op) {
            raw = op[..op.rfind(',').unwrap()].trim().to_string();
            mode = Mode::AbsoluteY;
        } else if regex!(r"^\.[A-Za-z][A-Za-z0-9_]*$").is_match(&op) || regex!(r"^@?[A-Za-z_][A-Za-z0-9_]*$").is_match(&op) || op == "-" || op == "+" {
            raw = op.clone();
            mode = if branch { Mode::Relative } else { Mode::Absolute };
        } else if is_dec(&op) {
            raw = op.clone();
            base = Base::Dec;
            mode = if branch { Mode::Relative } else if js_parse_int(&op, 10) > 255.0 { Mode::Absolute } else { Mode::ZeroPage };
        } else {
            raw = op.clone();
            mode = if branch { Mode::Relative } else { Mode::Absolute };
        }
    }

    if forced == "abs" {
        let wide = match mode {
            Mode::ZeroPage => Some(Mode::Absolute),
            Mode::ZeroPageX => Some(Mode::AbsoluteX),
            Mode::ZeroPageY => Some(Mode::AbsoluteY),
            _ => None,
        };
        if let Some(w) = wide {
            mode = w;
            if base == Base::Dec {
                raw = js_hex_upper(js_parse_int(&raw, 10));
                base = Base::Hex;
            }
            raw = format!("{:0>4}", raw);
        }
    } else if forced == "zp" {
        let narrow = match mode {
            Mode::Absolute => Some(Mode::ZeroPage),
            Mode::AbsoluteX => Some(Mode::ZeroPageX),
            Mode::AbsoluteY => Some(Mode::ZeroPageY),
            _ => None,
        };
        if let Some(n) = narrow {
            mode = n;
            if base == Base::Hex && regex!(r"(?i)^0*[0-9A-F]{1,2}$").is_match(&raw) {
                raw = raw[raw.len().saturating_sub(2)..].to_uppercase();
            }
        }
    }
    Kind::Instr { mnem, mode, raw, base, smc }
}

/// The macro directives of the JS compiler that are not ported yet (by their JS regex start).
const UNPORTED: &[(&str, &str)] = &[
    (r"(?i)^\.string\s", "STRING"),
    (r"(?i)^\.rawtext\s", "RAWTEXT"),
    (r"(?i)^\.data\s", "DATA"),
    (r"(?i)^\.rawbytes\s", "RAWBYTES"),
    (r"(?i)^\.petscii\s", "PETSCII"),
    (r"(?i)^\.charset\s+(lower|upper)\s*$", "CHARSET"),
    (r"(?i)^\.chardef\s", "CHARDEF"),
    (r"(?i)^\.box_hit\s", "BOX_HIT"),
    (r"(?i)^\.table\s", "TABLE"),
    (r"(?i)^\.loadfile\s", "LOADFILE"),
    (r"(?i)^\.exodecrunch\b", "EXODECRUNCH"),
    (r"(?i)^\.(include|incbin|koala|level|sid)\b", "FILE"),
    (r"(?i)^\.level_row\b", "LEVEL_ROW"),
    (r"(?i)^\.(loop|for)\s+[XY]\s*,", "LOOP"),
    (r"(?i)^\.(next|endf)\s+[A-Za-z_]", "NEXT"),
    (r"(?i)^\.sprite_(init|pos|col|anim)\s", "SPRITE"),
    (r"(?i)^\.?(delay|wait)\s+", "DELAY"),
    (r"(?i)^\.wait_raster\s", "WAIT_RASTER"),
    (r"(?i)^\.(turbo_set|turbo_enable)\s", "TURBO"),
    (r"(?i)^\.supercpu_detect\s*$", "SUPERCPU_DETECT"),
    (r"(?i)^\.joystick\s", "JOYSTICK"),
    (r"(?i)^\.mouse\s", "MOUSE"),
    (r"(?i)^\.map_copy(16x16)?\s", "MAP_COPY"),
    (r"(?i)^\.score_bcd\s", "SCORE_BCD"),
    (r"(?i)^\.reu_(check|stash|fetch|swap)\b", "REU"),
    (r"(?i)^\.(push|pull)\s+[AXYaxy](?:\s*,?\s*[AXYaxy])*\s*$", "PUSH"),
    (r"(?i)^\.var\s+[A-Za-z_]", "VAR"),
    (r"(?i)^\.mem(cpy|set)\s", "MEMCPY"),
    (r"(?i)^\.print(_char|_hex)?\s", "PRINT"),
    (r"(?i)^\.(clear_screen|wait_key)\s*$", "SCREEN"),
    (r"(?i)^\.(set_border|set_bg)\s", "SET_COLOR"),
    (r"(?i)^\.sid_player\b", "SID_PLAYER"),
    (r"(?i)^\.irq_setup\s", "IRQ_SETUP"),
    (r"(?i)^\.rand\b", "RAND"),
    (r"(?i)^\.(while|until|if)(?:_[axy]|\s+[AXY])\s+(==|=|!=|<=|>=|<|>)\s+", "RUNTIME_IF"),
    (r"(?i)^\.(endw|repeat)\s*$", "RUNTIME_LOOP"),
    (r"(?i)^\.macro\s+[A-Za-z_]", "MACRO"),
    (r"(?i)^(?:\.endm|\})\s*$", "MACRO"),
    (r"(?i)^\.end\s*$", "END"),
    (r"(?i)^\.?:\s*[A-Za-z_]", "INVOKE"),
    (r"(?i)^\.(invoke|call)\s+[A-Za-z_]", "INVOKE"),
];

fn unported(line: &str) -> Option<&'static str> {
    static CELL: OnceLock<Vec<(Regex, &'static str)>> = OnceLock::new();
    let list = CELL.get_or_init(|| UNPORTED.iter().map(|(p, n)| (Regex::new(p).unwrap(), *n)).collect());
    list.iter().find(|(re, _)| re.is_match(line)).map(|(_, n)| *n)
}

fn is_mnemonic(name: &str) -> bool {
    let up = name.to_uppercase();
    crate::opcodes::OPCODES.iter().any(|(m, _, _)| *m == up) || up.starts_with("LB") && up.len() == 4
}

fn org_address(hex: Option<&str>, dec: Option<&str>) -> String {
    match hex {
        Some(h) => format!("{:0>4}", h.to_uppercase()),
        None => format!("{:0>4}", js_hex_upper(js_parse_int(dec.unwrap(), 10))),
    }
}

/// `parseExpertText` (VMA syntax)
pub fn parse_expert_text(text: &str) -> Vec<Block> {
    let source: Vec<&str> = text.split('\n').collect();
    let lines = kick_scope_rewrite(&source);
    let mut blocks = Vec::new();
    let mut encoding = "screencode_mixed".to_string();
    let mut scope_open = 0usize;
    for (n, raw_line) in lines.iter().enumerate() {
        let push = |blocks: &mut Vec<Block>, kind: Kind| blocks.push(Block { kind, line: n });
        let (code, comment) = split_comment(raw_line);
        let line = code.trim();
        if line.is_empty() {
            push(&mut blocks, if comment.is_empty() { Kind::Blank } else { Kind::Comment { text: comment.to_string(), error: None } });
            continue;
        }
        if let Some(c) = regex!(r#"^\*\s*=\s*(?:\$([0-9A-Fa-f]{1,4})|(\d{1,5}))(?:\s+"[^"]*")?\s*$"#).captures(line) {
            push(&mut blocks, Kind::Org { address: org_address(c.get(1).map(|m| m.as_str()), c.get(2).map(|m| m.as_str())) });
            continue;
        }
        if let Some(c) = regex!(r#"(?i)^\.pc\s*=\s*(?:\$([0-9A-Fa-f]{1,4})|(\d{1,5}))(?:\s+"[^"]*")?\s*$"#).captures(line) {
            push(&mut blocks, Kind::Org { address: org_address(c.get(1).map(|m| m.as_str()), c.get(2).map(|m| m.as_str())) });
            continue;
        }
        if regex!(r#"(?i)^\.text\s+([A-Za-z_][A-Za-z0-9_]*|\d+)\s*,\s*([A-Za-z_][A-Za-z0-9_]*|\d+)\s*,\s*"([^"]*)"(?:\s*,\s*(lower|[0-9A-Fa-f]{1,2}))?\s*$"#).is_match(line) {
            push(&mut blocks, Kind::Unsupported { what: "TEXT".into() });
            continue;
        }
        if let Some(c) = regex!(r"^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*\{$").captures(line) {
            scope_open += 1;
            push(&mut blocks, Kind::Label { name: c[1].to_string(), offset: 0, kick_scope: true });
            continue;
        }
        if line == "}" && scope_open > 0 {
            scope_open -= 1;
            push(&mut blocks, Kind::KickScopeEnd);
            continue;
        }
        if let Some(c) = regex!(r#"(?i)^\.encoding\s+"([A-Za-z_]+)"\s*$"#).captures(line) {
            encoding = c[1].to_lowercase();
            push(&mut blocks, Kind::Comment { text: line.to_string(), error: None });
            continue;
        }
        if let Some(c) = regex!(r#"(?i)^\.text\s+((?:@"(?:[^"\\]|\\.)*"|"[^"]*"|\$[0-9A-Fa-f]{1,2}|\d{1,3})(?:\s*[,+]\s*(?:@"(?:[^"\\]|\\.)*"|"[^"]*"|\$[0-9A-Fa-f]{1,2}|\d{1,3}))*)\s*$"#).captures(line) {
            let bytes = kick_text_bytes(&c[1], &encoding);
            let list: Vec<String> = bytes.iter().map(|b| format!("${:02X}", b.unwrap_or(0))).collect();
            let mut kind = make_byte(&list.join(","));
            if bytes.iter().any(|b| b.is_none()) {
                kind = Kind::Byte { raw: String::new(), base: Base::Hex, error: Some(format!("character not in encoding {encoding}")) };
            }
            push(&mut blocks, kind);
            continue;
        }
        if let Some(what) = unported(line) {
            push(&mut blocks, Kind::Unsupported { what: what.into() });
            continue;
        }
        if let Some(c) = regex!(r"(?i)^\.label\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\*\s*(?:([+-])\s*(\$[0-9A-Fa-f]{1,4}|\d{1,5}))?\s*$").captures(line) {
            let n = c.get(3).map(|m| {
                let s = m.as_str();
                if let Some(h) = s.strip_prefix('$') { js_parse_int(h, 16) } else { js_parse_int(s, 10) }
            });
            let offset = match (n, c.get(2).map(|m| m.as_str())) {
                (Some(n), Some("-")) => -(n as i64),
                (Some(n), _) => n as i64,
                _ => 0,
            };
            push(&mut blocks, Kind::Label { name: c[1].to_string(), offset, kick_scope: false });
            continue;
        }
        if let Some(c) = regex!(r"(?i)^\.(?:const|label)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)\s*$").captures(line) {
            push(&mut blocks, make_const(&c[1], c[2].trim()));
            continue;
        }
        if let Some(c) = regex!(r"(?i)^\.define\s+(.+)$").captures(line) {
            push(&mut blocks, Kind::Define { symbols: c[1].trim().to_string() });
            continue;
        }
        if let Some(c) = regex!(r"(?i)^\.if\s+(.+)$").captures(line) {
            push(&mut blocks, Kind::If { condition: c[1].trim().to_string() });
            continue;
        }
        if regex!(r"(?i)^\.else\s*$").is_match(line) {
            push(&mut blocks, Kind::Else);
            continue;
        }
        if regex!(r"(?i)^\.endif\s*$").is_match(line) {
            push(&mut blocks, Kind::EndIf);
            continue;
        }
        if regex!(r"(?i)^\.region\s+(.+)$").is_match(line) {
            push(&mut blocks, Kind::Region);
            continue;
        }
        if regex!(r"(?i)^\.endregion(?:\s+.+)?$").is_match(line) {
            push(&mut blocks, Kind::EndRegion);
            continue;
        }
        // a bare macro call "name(args)" (not "JMP ($0408)")
        if let Some(c) = regex!(r"^([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)\s*$").captures(line) {
            if !is_mnemonic(&c[1]) {
                push(&mut blocks, Kind::Unsupported { what: "INVOKE".into() });
                continue;
            }
        }
        if let Some(c) = regex!(r"^!([A-Za-z_][A-Za-z0-9_]*)").captures(line) {
            push(&mut blocks, Kind::Comment { text: line.to_string(), error: Some(format!("!{} is an ACME directive", &c[1])) });
            continue;
        }
        let delegated = parse_asm_line(line, comment, n);
        let unknown_dir = regex!(r"^\.([A-Za-z_][A-Za-z0-9_]*)").captures(line);
        if let Some(d) = unknown_dir {
            if delegated.len() == 1 && matches!(delegated[0].kind, Kind::Comment { .. }) {
                push(&mut blocks, Kind::Comment { text: line.to_string(), error: Some(format!("Unknown directive: .{}", &d[1])) });
                continue;
            }
        }
        blocks.extend(delegated);
    }
    blocks
}

/// One code line through the `parseAsmText` rules (the comment is already split off).
fn parse_asm_line(line: &str, comment: &str, n: usize) -> Vec<Block> {
    let b = |kind: Kind| Block { kind, line: n };
    if let Some(c) = regex!(&format!(r"(?i)^({LABEL_NAME}):\s*\.word\s+(.+)$")).captures(line) {
        return vec![b(make_label(&c[1])), b(make_word(c[2].trim()))];
    }
    if let Some(c) = regex!(&format!(r"(?i)^({LABEL_NAME}):\s*\.fill\s+(.+)$")).captures(line) {
        return vec![b(make_label(&c[1])), b(make_fill(c[2].trim()))];
    }
    if let Some(c) = regex!(r"(?i)^\.word\s+(.+)$").captures(line) {
        return vec![b(make_word(c[1].trim()))];
    }
    if let Some(c) = regex!(r"(?i)^\.fill\s+(.+)$").captures(line) {
        return vec![b(make_fill(c[1].trim()))];
    }
    if let Some(c) = regex!(r"(?i)^\.align\s+(.+)$").captures(line) {
        return vec![b(make_align(c[1].trim()))];
    }
    if let Some(c) = regex!(r"(?i)^\.assert\s+(.+)$").captures(line) {
        let mut expr = c[1].trim().to_string();
        let mut message = String::new();
        if let Some(m) = regex!(r#"^(.*?)\s*,\s*"([^"]*)"\s*$"#).captures(&expr.clone()) {
            expr = m[1].trim().to_string();
            message = m[2].to_string();
        }
        return vec![b(Kind::Assert { expr, message })];
    }
    if let Some(c) = regex!(r"(?i)^([A-Za-z_][A-Za-z0-9_]*)\s*(?:=|\.equ\b)\s*(\$[0-9A-Fa-f]+|0x[0-9A-Fa-f]+|%[01]+|\d+)\s*$").captures(line) {
        return vec![b(make_const(&c[1], &c[2]))];
    }
    if let Some(c) = regex!(&format!(r"(?i)^({LABEL_NAME}):\s*\.byte\s+(.+)$")).captures(line) {
        return vec![b(make_label(&c[1])), b(make_byte(c[2].trim()))];
    }
    if let Some(c) = regex!(&format!(r"^({LABEL_NAME}):\s*([A-Za-z]{{2,4}})\s*(.*)\s*$")).captures(line) {
        return vec![b(make_label(&c[1])), b(make_instruction(&c[2].to_uppercase(), c[3].trim()))];
    }
    if let Some(c) = regex!(r"(?i)^\.byte\s+(.+)$").captures(line) {
        return vec![b(make_byte(c[1].trim()))];
    }
    if let Some(c) = regex!(&format!(r"^({LABEL_NAME}):\s*$")).captures(line) {
        return vec![b(make_label(&c[1]))];
    }
    if line == "-" || line == "+" {
        return vec![b(Kind::AnonLabel)];
    }
    if let Some(c) = regex!(r"^([-+])\s+([A-Za-z]{2,4})\s*(.*)\s*$").captures(line) {
        return vec![b(Kind::AnonLabel), b(make_instruction(&c[2].to_uppercase(), c[3].trim()))];
    }
    if let Some(c) = regex!(r"^(\.[A-Za-z][A-Za-z0-9_]*)\s*$").captures(line) {
        return vec![b(make_label(&c[1]))];
    }
    if let Some(c) = regex!(r"^([A-Za-z]{2,4})\s*(.*)\s*$").captures(line) {
        return vec![b(make_instruction(&c[1].to_uppercase(), c[2].trim()))];
    }
    let text = if comment.is_empty() { line.to_string() } else { format!("{line} ; {comment}") };
    vec![b(Kind::Comment { text, error: None })]
}

#[cfg(test)]
mod tests {
    use super::*;

    fn instr(line: &str) -> (Mode, String, Base) {
        match &parse_expert_text(line)[0].kind {
            Kind::Instr { mode, raw, base, .. } => (*mode, raw.clone(), *base),
            k => panic!("{line}: {k:?}"),
        }
    }

    #[test]
    fn addressing_modes() {
        assert_eq!(instr("lda #$12").0, Mode::Immediate);
        assert_eq!(instr("lda $12").0, Mode::ZeroPage);
        assert_eq!(instr("lda $0012").0, Mode::Absolute);
        assert_eq!(instr("lda 300").0, Mode::Absolute);
        assert_eq!(instr("lda zp").0, Mode::Absolute);
        assert_eq!(instr("lda ($12),y").0, Mode::IndirectY);
        assert_eq!(instr("lda (ptr),y").0, Mode::IndirectY);
        assert_eq!(instr("bne loop").0, Mode::Relative);
        assert_eq!(instr("lsr a").0, Mode::Implied);
        assert_eq!(instr("lda.zp zp").0, Mode::ZeroPage);
        assert_eq!(instr("lda #10"), (Mode::Immediate, "10".into(), Base::Dec));
    }

    #[test]
    fn list_bases() {
        assert_eq!(detect_list_base("3, %11, 16, $10"), (Base::Hex, "03,03,10,10".into()));
        assert_eq!(detect_list_base("1, 2, 3"), (Base::Dec, "1,2,3".into()));
        assert_eq!(detect_list_base("$a9, $00"), (Base::Hex, "A9,00".into()));
        assert_eq!(detect_list_base("'A', 'z'"), (Base::Hex, "41,7A".into()));
        assert_eq!(detect_list_base("<label, >label"), (Base::Dec, "<label,>label".into()));
    }

    #[test]
    fn kick_text() {
        let b: Vec<u8> = kick_text_bytes("\"HELLO\"", "screencode_mixed").into_iter().map(|b| b.unwrap()).collect();
        assert_eq!(b, vec![0x48, 0x45, 0x4C, 0x4C, 0x4F]);
        assert_eq!(kick_text_bytes("\"a\", $0d", "screencode_mixed"), vec![Some(1), Some(0x0D)]);
    }
}
