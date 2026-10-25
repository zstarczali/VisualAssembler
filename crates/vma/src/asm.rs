//! Layout and code generation: `getProgramLayout`, `addLayoutLabels`, `compileLineBytes`
//! and the operand resolvers of www/app.js, for the blocks `parse` produces.

use crate::expr::{char_literal_to_hex, eval_asm, has_star_pc_ref, js_and, substitute_star_pc, IdentRule};
use crate::num::{is_hex, is_ident, js_parse_int, parse_address_value, parse_number_by_base, to_uint8};
use crate::opcodes::OPCODES;
use crate::parse::{Base, Block, Kind, MemOp, Mode};
use regex::Regex;
use std::collections::HashMap;
use std::sync::OnceLock;

macro_rules! regex {
    ($p:expr) => {{
        static CELL: OnceLock<Regex> = OnceLock::new();
        CELL.get_or_init(|| Regex::new($p).unwrap())
    }};
}

/// A JS `Map` of labels: insertion order kept, a later `set` updates in place.
#[derive(Default, Clone)]
pub struct Labels {
    order: Vec<String>,
    values: HashMap<String, f64>,
}

impl Labels {
    pub fn set(&mut self, name: &str, value: f64) {
        if !self.values.contains_key(name) {
            self.order.push(name.to_string());
        }
        self.values.insert(name.to_string(), value);
    }
    pub fn get(&self, name: &str) -> Option<f64> {
        self.values.get(name).copied()
    }
    pub fn has(&self, name: &str) -> bool {
        self.values.contains_key(name)
    }
    /// `get(name) ?? get(lower) ?? get(upper)`
    fn get3(&self, name: &str) -> Option<f64> {
        self.get(name).or_else(|| self.get(&name.to_lowercase())).or_else(|| self.get(&name.to_uppercase()))
    }
    /// The `resolved` object of the local evaluators: every label under its name, lower and
    /// upper case form, later entries winning.
    fn folded(&self, name: &str) -> Option<f64> {
        self.order.iter().rev().find(|k| *k == name || k.to_lowercase() == name || k.to_uppercase() == name).map(|k| self.values[k])
    }
    pub fn iter(&self) -> impl Iterator<Item = (&str, f64)> {
        self.order.iter().map(|k| (k.as_str(), self.values[k]))
    }
}

/// A `.const` of the top-level program, for `resolveProgramConstValue`.
#[derive(Clone)]
struct ConstEntry {
    name: String,
    raw: String,
    base: Base,
    value: Option<f64>,
}

pub struct Line {
    pub block: Block,
    pub address: i64,
    pub size: i64,
    pub skipped: bool,
    meta: Meta,
}

/// What getProgramLayout adds to a block while it expands the program.
#[derive(Clone, Default)]
struct Meta {
    /// the top-level const this block is (not a copy): its value is updated in place
    const_index: Option<usize>,
    /// `_fromMacro`: expanded from this macro
    from_macro: Option<String>,
    /// `_fromMacroDef`: the body of a parameter-less macro at its definition
    from_macro_def: bool,
    /// `_isMacroInvokeHeader`
    header: bool,
    /// `_ifError` / the validation error of a `.var`
    error: Option<String>,
    /// `_varAddress`
    var_address: Option<i64>,
    /// `_autoBufferLabel`: a macro's deferred-address parameter given no address of its own
    auto_buffer: Option<String>,
    /// `_autoBufferAddress`: after the end of the layout
    auto_buffer_address: Option<i64>,
}

/// A user macro of `parseUserMacros`.
#[derive(Clone)]
struct Macro {
    params: Vec<String>,
    body: Vec<Block>,
}

pub struct Assembler {
    consts: Vec<ConstEntry>,
    defines: Vec<String>,
    macros: HashMap<String, Macro>,
    pub labels: Labels,
    anon: Vec<i64>,
}

#[derive(Debug)]
pub struct CompileError {
    pub line: usize,
    pub message: String,
}

pub struct Image {
    pub load: i64,
    pub bytes: Vec<u8>,
}

impl Assembler {
    pub fn new(program: &[Block]) -> Self {
        let consts = program
            .iter()
            .filter_map(|b| match &b.kind {
                Kind::Const { name, raw, base, value } => Some(ConstEntry { name: name.clone(), raw: raw.clone(), base: *base, value: *value }),
                _ => None,
            })
            .collect();
        let defines = program
            .iter()
            .filter_map(|b| match &b.kind {
                Kind::Define { symbols } => Some(symbols.split(',').map(|s| s.trim().to_string()).filter(|s| !s.is_empty()).collect::<Vec<_>>()),
                _ => None,
            })
            .flatten()
            .collect();
        Assembler { consts, defines, macros: user_macros(program), labels: Labels::default(), anon: Vec::new() }
    }

    /// `resolveProgramConstValue`
    fn const_value(&self, name: &str) -> Option<f64> {
        let target = name.trim().trim_start_matches('#');
        if target.is_empty() {
            return None;
        }
        let lower = target.to_lowercase();
        for c in &self.consts {
            if c.name.to_lowercase() != lower {
                continue;
            }
            if let Some(v) = c.value {
                if !v.is_nan() {
                    return Some(v);
                }
            }
            let raw = c.raw.trim();
            if let Some(v) = parse_number_by_base(raw.strip_prefix('$').unwrap_or(raw), c.base) {
                return Some(v);
            }
        }
        None
    }

    /// `_evalAsmExpr`
    pub fn eval_asm_expr(&self, expr: &str, labels: Option<&Labels>) -> Option<f64> {
        let text = char_literal_to_hex(expr.trim());
        let names = |n: &str| labels.and_then(|l| l.get3(n)).or_else(|| self.const_value(n));
        eval_asm(&text, IdentRule::Dotted, &names, true)
    }

    /// The local evaluators of resolveNumericOperand / parseMacroNumber (exact, lower, upper).
    fn eval_word(&self, expr: &str, labels: Option<&Labels>, char_literals: bool) -> Option<f64> {
        let text = if char_literals { char_literal_to_hex(expr.trim()) } else { expr.trim().to_string() };
        let names = |n: &str| labels.and_then(|l| l.get3(n)).or_else(|| self.const_value(n));
        eval_asm(&text, IdentRule::Word, &names, false)
    }

    /// The `resolved`-object evaluators (addLayoutLabels, parseFillMacro, evaluateFillExpression).
    fn eval_folded(&self, expr: &str, labels: Option<&Labels>, vars: &[(&str, f64)]) -> Option<f64> {
        let names = |n: &str| {
            vars.iter()
                .rev()
                .find(|(k, _)| *k == n || k.to_lowercase() == n || k.to_uppercase() == n)
                .map(|(_, v)| *v)
                .or_else(|| labels.and_then(|l| l.folded(n)))
                .or_else(|| self.const_value(n))
        };
        eval_asm(expr, IdentRule::Word, &names, false)
    }

    /// `resolveProgramValueWithConst`
    fn value_with_const(&self, raw: &str, base: Base) -> Option<f64> {
        let text = raw.trim();
        if text.is_empty() {
            return None;
        }
        let mut normalized = text.trim_start_matches('#');
        if base == Base::Hex {
            normalized = normalized.strip_prefix('$').unwrap_or(normalized);
        }
        if let Some(v) = parse_number_by_base(normalized, base) {
            return Some(v);
        }
        if is_ident(normalized) {
            return self.const_value(normalized);
        }
        None
    }

    /// `parseMacroNumber`
    fn macro_number(&self, raw: &str, labels: &Labels, base: Base) -> Option<f64> {
        let text = raw.trim();
        if text.is_empty() {
            return None;
        }
        let normalized = text.trim_start_matches('#');
        let stripped = if base == Base::Hex { normalized.strip_prefix('$').unwrap_or(normalized) } else { normalized };
        if let Some(v) = parse_number_by_base(stripped, base) {
            return Some(v);
        }
        if is_ident(normalized) {
            return labels.get3(normalized).or_else(|| self.const_value(normalized));
        }
        self.eval_word(normalized, Some(labels), false)
    }

    /// `parseMacroCountOrSize` (`labels` None = the null label map of the size pass)
    fn count_or_size(&self, raw: &str, labels: Option<&Labels>, base: Base) -> Option<f64> {
        let empty = Labels::default();
        let map = labels.unwrap_or(&empty);
        let t = raw.trim();
        let text = t.strip_prefix('#').unwrap_or(t);
        if text.is_empty() {
            return None;
        }
        if text.starts_with('$') || (text.len() >= 2 && text[..2].eq_ignore_ascii_case("0x")) {
            return self.macro_number(raw, map, Base::Hex);
        }
        if text.chars().any(|c| matches!(c, 'A'..='F' | 'a'..='f')) && is_hex(text) {
            return self.macro_number(raw, map, Base::Hex);
        }
        if crate::num::is_dec(text) {
            return Some(js_parse_int(text, if base == Base::Hex { 16 } else { 10 }));
        }
        if let Some(v) = self.eval_folded(text, labels, &[]) {
            return Some(v);
        }
        self.macro_number(raw, map, if base == Base::Dec { Base::Dec } else { Base::Hex })
    }

    /// `parseDelayFrameCount`
    fn delay_frames(&self, raw: &str) -> Option<f64> {
        let text = raw.trim();
        if let Some(v) = self.macro_number(text, &self.labels, Base::Dec) {
            return (1.0..=255.0).contains(&v).then_some(v);
        }
        if is_ident(text) {
            return self.const_value(text).filter(|v| (1.0..=255.0).contains(v));
        }
        None
    }

    /// The MOUSE macro: 1351 delta decoding, its branches resolved inside the routine.
    fn mouse_bytes(&self, port: &str, num: &str, zpx: &str, zpy: &str, address: i64) -> Result<Vec<u8>, String> {
        let p = self.numeric_value(if port.is_empty() { "2" } else { port }, Some(&self.labels), Base::Dec);
        let select = match p {
            Some(v) if v == 1.0 => 0x40,
            Some(v) if v == 2.0 => 0x80,
            _ => return Err("MOUSE: the port must be 1 or 2".into()),
        };
        let n = self.numeric_value(if num.is_empty() { "0" } else { num }, Some(&self.labels), Base::Dec).unwrap_or(0.0);
        if n.is_nan() || !(0.0..=7.0).contains(&n) {
            return Err("MOUSE: the sprite number must be 0-7".into());
        }
        let zp = |v: &str, d: &str| {
            let v = if v.is_empty() { d } else { v };
            self.numeric_value(v.strip_prefix('$').unwrap_or(v), Some(&self.labels), Base::Hex).unwrap_or(0.0)
        };
        let (zx, zy) = (zp(zpx, "FD"), zp(zpy, "FE"));
        if zx.is_nan() || !(0.0..=255.0).contains(&zx) {
            return Err("MOUSE: the X zero page address must be a byte".into());
        }
        if zy.is_nan() || !(0.0..=255.0).contains(&zy) {
            return Err("MOUSE: the Y zero page address must be a byte".into());
        }
        let (zx, zy, n) = (zx as u8, zy as u8, n as i64);
        let (xa, ya, msb) = (0xD000 + n * 2, 0xD001 + n * 2, 1u8 << n);
        let (xl, xh, yl, yh) = (xa as u8, (xa >> 8) as u8, ya as u8, (ya >> 8) as u8);
        let mut b: Vec<u8> = Vec::new();
        let mut marks: Vec<(&str, usize)> = Vec::new();
        let mut fix: Vec<(bool, usize, &str)> = Vec::new();
        macro_rules! branch {
            ($op:expr, $l:expr) => {{
                b.extend([$op, 0]);
                fix.push((true, b.len() - 1, $l));
            }};
        }
        b.extend([0xAD, 0x00, 0xDC, 0x29, 0x3F, 0x09, select, 0x8D, 0x00, 0xDC, 0xA2, 0x67, 0xCA, 0xD0, 0xFD]);
        b.extend([0xAD, 0x19, 0xD4, 0xA8, 0x38, 0xE5, zx, 0x29, 0x7F, 0xA2, 0x00, 0xC9, 0x40]);
        branch!(0xB0, "xNeg");
        b.push(0x4A);
        branch!(0xF0, "xDone");
        b.extend([0x84, zx, 0x18, 0x6D, xl, xh, 0x8D, xl, xh, 0x8A, 0x69, 0x00, 0x29, 0x01]);
        branch!(0xF0, "xDone");
        b.extend([0xAD, 0x10, 0xD0, 0x49, msb, 0x8D, 0x10, 0xD0, 0x4C, 0, 0]);
        fix.push((false, b.len() - 2, "xDone"));
        marks.push(("xNeg", b.len()));
        b.extend([0x09, 0xC0, 0xC9, 0xFF]);
        branch!(0xF0, "xDone");
        b.extend([0x38, 0x6A, 0xCA, 0x84, zx, 0x18, 0x6D, xl, xh, 0x8D, xl, xh, 0x8A, 0x69, 0x00, 0x29, 0x01]);
        branch!(0xF0, "xDone");
        b.extend([0xAD, 0x10, 0xD0, 0x49, msb, 0x8D, 0x10, 0xD0]);
        marks.push(("xDone", b.len()));
        b.extend([0xAD, 0x1A, 0xD4, 0xAA, 0x38, 0xE5, zy, 0x29, 0x7F, 0xC9, 0x40]);
        branch!(0xB0, "yNeg");
        b.push(0x4A);
        branch!(0xF0, "yDone");
        b.extend([0x86, zy, 0x49, 0xFF, 0x38, 0x6D, yl, yh, 0x8D, yl, yh, 0x4C, 0, 0]);
        fix.push((false, b.len() - 2, "yDone"));
        marks.push(("yNeg", b.len()));
        b.extend([0x09, 0xC0, 0xC9, 0xFF]);
        branch!(0xF0, "yDone");
        b.extend([0x38, 0x6A, 0x86, zy, 0x49, 0xFF, 0x38, 0x6D, yl, yh, 0x8D, yl, yh]);
        marks.push(("yDone", b.len()));
        for (rel, at, label) in fix {
            let target = marks.iter().find(|(m, _)| *m == label).unwrap().1 as i64;
            if rel {
                b[at] = (target - (at as i64 + 1)) as u8;
            } else {
                let abs = address + target;
                b[at] = abs as u8;
                b[at + 1] = (abs >> 8) as u8;
            }
        }
        Ok(b)
    }

    /// `appendDelayHelperLabel`: after the layout end and every `getDeferredMemorySections` section.
    fn delay_helper_address(&self, lines: &[Line], origin: i64) -> i64 {
        let end = lines.last().map(|l| l.address + l.size - 1).unwrap_or(origin - 1);
        let mut high = end;
        for line in lines {
            let (start, len) = match &line.block.kind {
                Kind::Text { x, y, raw, .. } => {
                    let v = |s: &str| self.value_with_const(s, Base::Dec).filter(|v| !v.is_nan() && *v != 0.0).unwrap_or(0.0);
                    (0x0400 as f64 + v(y) * 40.0 + v(x), encode_text(raw, false).len())
                }
                Kind::Mem { op, addr, raw, .. } => {
                    let len = match op {
                        MemOp::String | MemOp::RawText => encode_text(raw, false).len(),
                        MemOp::Petscii => encode_petscii(raw, false).len(),
                        MemOp::Data | MemOp::RawBytes => self.byte_values(raw, Base::Hex, None).len(),
                    };
                    (Self::address_value(addr, Some(&self.labels)).unwrap_or(0xC000 as f64), len)
                }
                Kind::IncBin { addr, .. } => (parse_address_value(addr).unwrap_or(0xC000 as f64), incbin_payload(&line.block.kind).len()),
                _ => continue,
            };
            high = high.max(start as i64 + len as i64 - 1);
        }
        high + 1
    }

    /// `parseAddressValue(raw, labels)`: a label only by its exact name
    fn address_value(raw: &str, labels: Option<&Labels>) -> Option<f64> {
        if let Some(v) = parse_address_value(raw) {
            return Some(v);
        }
        let t = raw.trim();
        if is_ident(t) {
            return labels.and_then(|l| l.get(t));
        }
        None
    }

    /// `parseMacroAddress` (preferred base hex)
    fn macro_address(&self, raw: &str, labels: &Labels) -> Option<f64> {
        let text = raw.trim();
        if text.is_empty() {
            return None;
        }
        Self::address_value(text, Some(labels)).or_else(|| self.const_value(text))
    }

    /// `parsePetsciiCharValue` with the label map
    fn petscii_char_value(&self, raw: &str) -> Option<f64> {
        let text = char_literal_to_hex(raw.trim().strip_prefix('#').unwrap_or(raw.trim()));
        if text.is_empty() {
            return None;
        }
        if let Some(b) = text.strip_prefix('%') {
            return crate::num::is_bin(b).then(|| js_parse_int(b, 2));
        }
        if let Some(h) = text.strip_prefix('$') {
            return is_hex(h).then(|| js_parse_int(h, 16));
        }
        if text.len() > 2 && text[..2].eq_ignore_ascii_case("0x") && is_hex(&text[2..]) {
            return Some(js_parse_int(&text[2..], 16));
        }
        if crate::num::is_dec(&text) {
            return text.parse::<f64>().ok();
        }
        if is_ident(&text) {
            return self.labels.get3(&text);
        }
        None
    }

    /// `resolveProgramNumericValue`
    fn numeric_value(&self, raw: &str, labels: Option<&Labels>, base: Base) -> Option<f64> {
        if raw.trim().is_empty() {
            return None;
        }
        if let Some(l) = labels {
            if let Some(v) = self.macro_number(raw, l, base) {
                return Some(v);
            }
        }
        self.value_with_const(raw, base)
    }

    /// `parseByteMacro`
    fn byte_values(&self, raw: &str, base: Base, labels: Option<&Labels>) -> Vec<f64> {
        let radix = match base {
            Base::Bin => 2,
            Base::Hex => 16,
            Base::Dec => 10,
        };
        raw.split(',')
            .map(|p| p.trim())
            .filter(|p| !p.is_empty())
            .map(|p| {
                let part = char_literal_to_hex(p);
                let label_byte = |name: &str, high: bool| match labels {
                    Some(l) => {
                        let v = l.get(name).unwrap_or(0.0);
                        if high { ((js_and(v, -1) >> 8) & 0xFF) as f64 } else { js_and(v, 0xFF) as f64 }
                    }
                    None => 0.0,
                };
                if let Some(c) = regex!(r"^<([A-Za-z_.][A-Za-z0-9_.]*)$").captures(&part) {
                    return label_byte(&c[1], false);
                }
                if let Some(c) = regex!(r"^>([A-Za-z_.][A-Za-z0-9_.]*)$").captures(&part) {
                    return label_byte(&c[1], true);
                }
                if regex!(r"^[<>]\s*\(").is_match(&part) {
                    let v = labels.and_then(|l| self.eval_asm_expr(&part, Some(l)));
                    return v.map(|v| js_and(v, 0xFF) as f64).unwrap_or(0.0);
                }
                if let Some(v) = self.numeric_value(&part, labels, base) {
                    return v;
                }
                let literal = js_parse_int(&part, radix);
                if !literal.is_nan() || labels.is_none() {
                    return literal;
                }
                match self.eval_asm_expr(&part, labels) {
                    Some(v) => js_and(v, 0xFF) as f64,
                    None => literal,
                }
            })
            .collect()
    }

    /// `parseWordMacro`
    fn word_values(&self, raw: &str, base: Base, labels: Option<&Labels>) -> Vec<f64> {
        let radix = match base {
            Base::Bin => 2,
            Base::Hex => 16,
            Base::Dec => 10,
        };
        raw.split(',')
            .map(|p| p.trim())
            .filter(|p| !p.is_empty())
            .map(|part| {
                if let Some(h) = part.strip_prefix('$') {
                    if is_hex(h) {
                        return js_parse_int(h, 16);
                    }
                }
                if part.len() > 2 && part[..2].eq_ignore_ascii_case("0x") && is_hex(&part[2..]) {
                    return js_parse_int(&part[2..], 16);
                }
                let literal = js_parse_int(part, radix);
                if let Some(l) = labels {
                    if literal.is_nan() || !is_hex(part) {
                        if let Some(v) = self.eval_asm_expr(part, Some(l)) {
                            return js_and(v, 0xFFFF) as f64;
                        }
                    }
                }
                literal
            })
            .collect()
    }

    /// `parseFillMacro`: (count, value, count expr, value expr)
    fn fill_parse(&self, raw: &str, base: Base, labels: Option<&Labels>, vars: &[(&str, f64)]) -> Option<(f64, f64, String, String)> {
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
        if parts.len() != 2 {
            return None;
        }
        let radix = match base {
            Base::Bin => 2,
            Base::Hex => 16,
            Base::Dec => 10,
        };
        let value = |part: &str| {
            self.eval_folded(part, labels, vars)
                .or_else(|| self.numeric_value(part, labels, base))
                .unwrap_or_else(|| js_parse_int(part, radix))
        };
        Some((value(&parts[0]), value(&parts[1]), parts[0].clone(), parts[1].clone()))
    }

    /// `getInstructionSize`
    fn size(&self, block: &Block) -> i64 {
        match &block.kind {
            Kind::LongBranch { .. } => 5,
            Kind::Byte { raw, base, .. } => self.byte_values(raw, *base, None).len() as i64,
            Kind::Word { raw, base } => self.word_values(raw, *base, None).len() as i64 * 2,
            Kind::Fill { raw, base } => match self.fill_parse(raw, *base, None, &[]) {
                Some((count, ..)) if count.is_finite() => count as i64,
                Some(_) => i64::MIN,
                None => 0,
            },
            Kind::Loop { .. } | Kind::For { .. } => 2,
            Kind::Next { .. } => 3,
            Kind::Endf { .. } => 5,
            Kind::Push { regs } | Kind::Pull { regs } => regs.chars().map(|r| match r {
                'A' => 1,
                'X' | 'Y' => 2,
                _ => 0,
            }).sum(),
            Kind::EndMacro => 1,
            Kind::Fixed { bytes } => bytes.len() as i64,
            Kind::SetColor { .. } | Kind::PrintChar { .. } => 5,
            Kind::WaitRaster { .. } => 7,
            Kind::TurboSet { .. } => 5,
            Kind::ExoDecrunch { .. } => 19,
            Kind::PrintHex { reg } => if *reg == 'A' { 30 } else { 31 },
            Kind::Rand { .. } => 15,
            Kind::Text { raw, .. } => encode_text(raw, false).len() as i64 * 5,
            Kind::Mem { op: MemOp::String, raw, .. } => encode_text(raw, false).len() as i64 * 5,
            Kind::Mem { op: MemOp::Data, raw, .. } => self.byte_values(raw, Base::Hex, None).len() as i64 * 5,
            Kind::Print { raw, lower } => 17 + encode_petscii(raw, *lower).len() as i64,
            Kind::CharDef { .. } => 40,
            Kind::SpriteInit { .. } => 26,
            Kind::RtCmp { raw, op, .. } => (if raw.trim().starts_with('#') { 2 } else { 3 }) + if op == "<=" || op == ">" { 4 } else { 2 },
            Kind::RtElse { .. } | Kind::RtEndw { .. } => 3,
            Kind::MemCpy { size, .. } => match self.count_or_size(size, None, Base::Hex) {
                Some(n) if n != 0.0 && !n.is_nan() => (n / 256.0).floor() as i64 * 11 + if n % 256.0 > 0.0 { 13 } else { 0 },
                _ => 0,
            },
            Kind::MemSet { size, .. } => match self.count_or_size(size, None, Base::Hex) {
                Some(n) if n != 0.0 && !n.is_nan() => 2 + (n / 256.0).floor() as i64 * 8 + if n % 256.0 > 0.0 { 10 } else { 0 },
                _ => 0,
            },
            Kind::MapCopy { size, combined, color_src, .. } => {
                let n = map_copy_size(size);
                let sec = 2 + (n / 256) * 9 + if n % 256 > 0 { 11 } else { 0 };
                sec * if *combined || !color_src.is_empty() { 2 } else { 1 }
            }
            Kind::MapCopy16 { .. } => 16 * 19,
            Kind::Reu { .. } => 40,
            Kind::IrqSetup { .. } => 46,
            Kind::LoadFile { name, addr, .. } => {
                let len = loadfile_name(name).len().max(1) as i64;
                3 + len + 9 + 9 + if addr.trim().is_empty() { 0 } else { 4 } + 5 + 2
            }
            Kind::Delay { .. } => 5,
            Kind::IncBin { koala, .. } => if *koala { 86 } else { 0 },
            Kind::SidPlayer { .. } => 58,
            Kind::LevelRow { .. } => 132,
            Kind::SpritePos { .. } => 18,
            Kind::SpriteCol { .. } => 5,
            Kind::SpriteAnim { .. } => 19,
            Kind::BoxHit { .. } => 30,
            Kind::Mouse { .. } => 142,
            Kind::ScoreBcd { digits, .. } => {
                let b = *digits as i64 / 2;
                3 + b * 8 + b * 21
            }
            Kind::Joystick { port, vx, vy, fire, .. } => {
                // `_joyPortValue`: without labels
                let read = match self.numeric_value(if port.is_empty() { "2" } else { port }, None, Base::Dec) {
                    Some(v) if v == 3.0 => 6,
                    _ => 3,
                };
                if vx.trim().is_empty() && vy.trim().is_empty() {
                    read + 24
                } else {
                    8 + read + 24 + if fire.trim().is_empty() { 0 } else { 7 }
                }
            }
            // an INVOKE (or a bare macro name) left unexpanded: the size of the body
            Kind::Invoke { name, .. } => self.macros.get(name).map(|m| m.body.iter().map(|b| self.size(b)).sum()).unwrap_or(0),
            Kind::Instr { mnem, .. } if self.macros.contains_key(mnem) => self.macros[mnem].body.iter().map(|b| self.size(b)).sum(),
            Kind::Instr { mode, .. } => mode.size(),
            _ => 0,
        }
    }

    /// `_ifConditionActive`
    fn if_active(&self, condition: &str) -> Option<bool> {
        let cond = condition.trim();
        if is_ident(cond) {
            if self.defines.iter().any(|d| d == cond) {
                return Some(true);
            }
            return Some(matches!(self.const_value(cond), Some(v) if v != 0.0));
        }
        self.eval_asm_expr(cond, None).map(|v| v != 0.0)
    }

    /// The user-macro part of `getProgramLayout`: definitions out, INVOKEs expanded in place.
    fn expand(&self, program: &[Block]) -> Vec<(Block, Meta)> {
        let mut out: Vec<(Block, Meta)> = Vec::new();
        let mut const_index = 0usize;
        let mut inside: Option<(String, bool)> = None;
        let mut invocations = 0usize;
        for b in program {
            let ci = if matches!(b.kind, Kind::Const { .. }) {
                const_index += 1;
                Some(const_index - 1)
            } else {
                None
            };
            match &b.kind {
                Kind::MacroDefStart { name, params } => {
                    let has_params = !params.trim().is_empty();
                    // a parameter-less macro is also a subroutine at its definition (JSR name)
                    if !name.is_empty() && !has_params {
                        out.push((Block { kind: Kind::Label { name: name.clone(), offset: 0, kick_scope: false }, line: b.line }, Meta::default()));
                    }
                    inside = Some((name.clone(), has_params));
                    continue;
                }
                Kind::MacroDefEnd => {
                    inside = None;
                    continue;
                }
                _ => {}
            }
            if let Some((_, has_params)) = &inside {
                if !has_params {
                    out.push((b.clone(), Meta { from_macro_def: true, ..Meta::default() }));
                }
                continue;
            }
            if let Kind::Include { addr, blocks, .. } = &b.kind {
                out.push((b.clone(), Meta { header: true, ..Meta::default() }));
                if blocks.is_empty() {
                    continue;
                }
                let fixed = !addr.is_empty();
                let mk = |kind: Kind| (Block { kind, line: b.line }, Meta::default());
                if fixed {
                    out.push(mk(Kind::SaveAddress));
                    out.push(mk(Kind::Org { address: format!("{:0>4}", addr.to_uppercase()) }));
                }
                // the library's own ORGs mean nothing here; its parameter-less macros become
                // subroutines only at a fixed address
                let mut lib: Option<bool> = None;
                for sub in blocks {
                    match &sub.kind {
                        Kind::Org { .. } => continue,
                        Kind::MacroDefStart { name, params } => {
                            let has_params = !params.trim().is_empty();
                            if fixed && !has_params && !name.is_empty() {
                                out.push(mk(Kind::Label { name: name.clone(), offset: 0, kick_scope: false }));
                            }
                            lib = Some(has_params);
                            continue;
                        }
                        Kind::MacroDefEnd => {
                            lib = None;
                            continue;
                        }
                        _ => {}
                    }
                    if let Some(has_params) = lib {
                        if fixed && !has_params {
                            out.push((sub.clone(), Meta::default()));
                        }
                        continue;
                    }
                    out.push((sub.clone(), Meta::default()));
                }
                if fixed {
                    out.push(mk(Kind::RestoreAddress));
                }
                continue;
            }
            let (name, args) = match &b.kind {
                Kind::Invoke { name, args } => (name.clone(), args.clone()),
                Kind::Instr { mnem, .. } if self.macros.contains_key(mnem) => (mnem.clone(), String::new()),
                _ => {
                    out.push((b.clone(), Meta { const_index: ci, ..Meta::default() }));
                    continue;
                }
            };
            let Some(mac) = self.macros.get(&name) else {
                out.push((b.clone(), Meta { const_index: ci, ..Meta::default() }));
                continue;
            };
            invocations += 1;
            let suffix = format!("__m{:08x}", invocations);
            let mut locals: Vec<String> = Vec::new();
            for mb in &mac.body {
                if let Kind::Label { name, .. } = &mb.kind {
                    if !locals.contains(name) {
                        locals.push(name.clone());
                    }
                }
            }
            for mb in &mac.body {
                if let Kind::Loop { label, .. } = &mb.kind {
                    if !locals.contains(label) {
                        locals.push(label.clone());
                    }
                }
            }
            let arg_list: Vec<String> = split_macro_invoke_args(&args).iter().map(|a| normalize_macro_invoke_arg(a)).collect();
            let mut subst: Vec<(String, String)> = Vec::new();
            for (i, p) in mac.params.iter().enumerate() {
                let v = arg_list.get(i).cloned().unwrap_or_default();
                match subst.iter_mut().find(|(k, _)| k == p) {
                    Some(entry) => entry.1 = v,
                    None => subst.push((p.clone(), v)),
                }
            }
            // a parameter used as a STRING / RAWTEXT / DATA / RAWBYTES / PETSCII address is a buffer:
            // every bare use of it names the buffer label
            let mut buffers: Vec<(String, String)> = Vec::new();
            for mb in &mac.body {
                if let Kind::Mem { addr, .. } = &mb.kind {
                    let token = addr.trim();
                    if is_ident(token) && mac.params.iter().any(|p| p == token) && !buffers.iter().any(|(p, _)| p == token) {
                        buffers.push((token.to_string(), format!("__buf_{:08x}_{token}", invocations)));
                    }
                }
            }
            let apply = |raw: &str| -> String {
                if mac.params.is_empty() {
                    return raw.to_string();
                }
                let mut r = raw.to_string();
                for (p, v) in &subst {
                    r = js_replace_literal(&r, &format!("{{{p}}}"), v);
                    let bare = buffers.iter().find(|(b, _)| b == p).map(|(_, l)| l.clone()).unwrap_or_else(|| v.clone());
                    r = replace_word(&r, p, |_| bare.clone(), false);
                }
                r
            };
            let rewrite = |raw: &str| -> String {
                let mut r = apply(raw);
                for l in &locals {
                    r = replace_word(&r, l, |_| format!("{l}{suffix}"), true);
                }
                r
            };
            out.push((b.clone(), Meta { header: true, ..Meta::default() }));
            for mb in &mac.body {
                let mut e = mb.clone();
                let mut buffer = None;
                match &mut e.kind {
                    Kind::Label { name, .. } if locals.contains(name) => *name = format!("{name}{suffix}"),
                    Kind::Instr { mnem, mode, raw, base, display, .. } => {
                        if !raw.is_empty() {
                            let new_raw = rewrite(raw);
                            let new_display = rewrite(display);
                            if new_raw != *raw && OPCODES.iter().any(|(m, _, _)| m == mnem) {
                                let text = if *mode == Mode::Immediate {
                                    format!("#{new_raw}")
                                } else {
                                    rewrite(if display.is_empty() { raw } else { display })
                                };
                                if let Kind::Instr { mode: m2, raw: r2, base: b2, display: d2, .. } = crate::parse::make_instruction(mnem, &text) {
                                    *mode = m2;
                                    *raw = r2;
                                    *base = b2;
                                    *display = d2;
                                }
                            } else {
                                *raw = new_raw;
                                *display = new_display;
                            }
                        }
                    }
                    Kind::RtCmp { raw, .. } | Kind::LevelRow { raw, .. } | Kind::PrintChar { raw } | Kind::SetColor { raw, .. } | Kind::Text { raw, .. } | Kind::Print { raw, .. } | Kind::CharDef { raw, .. } => {
                        if !raw.is_empty() {
                            *raw = rewrite(raw);
                        }
                    }
                    Kind::Mem { raw, addr, .. } => {
                        if !raw.is_empty() {
                            *raw = rewrite(raw);
                        }
                        if !addr.is_empty() {
                            let token = addr.trim().to_string();
                            *addr = apply(addr);
                            if buffers.iter().any(|(p, _)| *p == token) {
                                buffer = Some(addr.clone());
                            }
                        }
                    }
                    Kind::LongBranch { raw, .. } | Kind::Byte { raw, .. } | Kind::Word { raw, .. } | Kind::Fill { raw, .. } | Kind::Align { raw, .. } | Kind::Const { raw, .. } => {
                        if !raw.is_empty() {
                            *raw = rewrite(raw);
                        }
                    }
                    Kind::Loop { label, .. } if locals.contains(label) => *label = format!("{label}{suffix}"),
                    Kind::Next { label, .. } if locals.contains(label) => *label = format!("{label}{suffix}"),
                    _ => {}
                }
                out.push((e, Meta { from_macro: Some(name.clone()), auto_buffer: buffer, ..Meta::default() }));
            }
        }
        out
    }

    /// `getProgramLayout` (origin = the first ORG, or the override of the autostart build).
    pub fn layout(&self, program: &[Block], origin: i64, override_origin: bool) -> Result<Vec<Line>, CompileError> {
        let mut expanded = self.expand(program);
        scope_local_labels(&mut expanded);

        // `.var`: zero page from $02, in the order of the expanded program
        let mut zp = 0x02i64;
        for (b, meta) in expanded.iter_mut() {
            if let Kind::Var { name, size } = &b.kind {
                if name.is_empty() {
                    continue;
                }
                match self.value_with_const(if size.is_empty() { "1" } else { size }, Base::Dec) {
                    Some(n) if (1.0..=255.0).contains(&n) => {
                        let n = n as i64;
                        if zp + n > 0xFF {
                            meta.error = Some("VAR: the zero page is full".into());
                        } else {
                            meta.var_address = Some(zp);
                            zp += n;
                        }
                    }
                    _ => meta.error = Some("VAR: the size must be 1–255".into()),
                }
            }
        }

        let mut cond: Vec<(bool, bool)> = Vec::new();
        let mut skipped = vec![false; expanded.len()];
        for (i, (b, meta)) in expanded.iter_mut().enumerate() {
            match &b.kind {
                Kind::If { condition } => {
                    let active = self.if_active(condition);
                    if active.is_none() {
                        meta.error = Some(format!("IF condition cannot be evaluated: {}", condition.trim()));
                    }
                    cond.push((active == Some(true), false));
                }
                Kind::Else => {
                    if let Some(top) = cond.last_mut() {
                        top.1 = true;
                    }
                }
                Kind::EndIf => {
                    cond.pop();
                }
                _ => {
                    if cond.iter().any(|(active, in_else)| if *in_else { *active } else { !*active }) {
                        skipped[i] = true;
                    }
                }
            }
        }

        let mut cursor = origin;
        let mut saved: Option<i64> = None;
        let mut lines = Vec::new();
        for (i, (block, meta)) in expanded.into_iter().enumerate() {
            let mut size = if meta.header { 0 } else { self.size(&block) };
            if size == i64::MIN {
                return Err(CompileError { line: block.line, message: "FILL: the count cannot be resolved while laying out".into() });
            }
            if skipped[i] {
                lines.push(Line { block, address: cursor, size: 0, skipped: true, meta });
                continue;
            }
            match &block.kind {
                Kind::SaveAddress => saved = Some(cursor),
                Kind::RestoreAddress => {
                    if let Some(s) = saved.take() {
                        cursor = s;
                    }
                }
                _ => {}
            }
            if let Kind::Table { addr, .. } = &block.kind {
                if let Some(a) = (!addr.is_empty()).then(|| parse_address_value(addr)).flatten() {
                    cursor = a as i64;
                }
            }
            if let Kind::Org { address } = &block.kind {
                if let Some(org) = parse_address_value(address) {
                    let org = org as i64;
                    let in_stub = override_origin && org < origin && org >= 0x0800 && origin <= 0x0811;
                    cursor = if in_stub { origin } else { org };
                }
            }
            if let Kind::Align { raw, base } = &block.kind {
                if let Some(boundary) = parse_number_by_base(raw.strip_prefix('$').unwrap_or(raw), *base) {
                    if boundary > 0.0 {
                        let rem = (cursor as f64) % boundary;
                        size = if rem == 0.0 { 0 } else { (boundary - rem) as i64 };
                    }
                }
            }
            let address = cursor;
            cursor += size;
            lines.push(Line { block, address, size, skipped: false, meta });
        }
        // the auto buffers follow the last line (conditionally skipped ones too)
        let mut buffer_cursor = lines.last().map(|l| l.address + l.size).unwrap_or(origin);
        for line in lines.iter_mut() {
            if line.meta.auto_buffer.is_none() {
                continue;
            }
            let Kind::Mem { op, addr, raw, offset, lower, null_term, .. } = &mut line.block.kind else { continue };
            let len = match op {
                MemOp::Petscii => encode_petscii(raw, *lower).len() + usize::from(*null_term),
                MemOp::String => encode_text(raw, false).len(),
                MemOp::RawText => encode_text(raw, *lower).len(),
                MemOp::Data | MemOp::RawBytes => 0,
            };
            let _ = offset;
            line.meta.auto_buffer_address = Some(buffer_cursor);
            *addr = format!("${:04X}", buffer_cursor);
            buffer_cursor += len as i64;
        }
        Ok(lines)
    }

    /// `addLayoutLabels`
    fn add_labels(&mut self, line: &Line) {
        if line.skipped {
            return;
        }
        match &line.block.kind {
            Kind::Label { name, offset, .. } => {
                self.labels.set(name, ((line.address + offset) & 0xFFFF) as f64);
            }
            Kind::Instr { smc: Some(name), .. } => {
                self.labels.set(name, ((line.address + 1) & 0xFFFF) as f64);
            }
            Kind::Loop { label, .. } | Kind::For { label, .. } => {
                self.labels.set(label, (line.address + 2) as f64);
            }
            Kind::RtCmp { start: Some(start), .. } => self.labels.set(start, line.address as f64),
            Kind::RtElse { else_label, .. } => self.labels.set(else_label, (line.address + 3) as f64),
            Kind::RtEndIf { else_label, end_label, has_else } => {
                self.labels.set(end_label, line.address as f64);
                if !has_else {
                    self.labels.set(else_label, line.address as f64);
                }
            }
            Kind::RtEndw { end, .. } => self.labels.set(end, (line.address + 3) as f64),
            Kind::RtRepeat { start } => self.labels.set(start, line.address as f64),
            Kind::Sid { custom, load, init, play, .. } if *load != 0 => {
                // the init / play addresses move with a custom load address
                let placed = if custom.is_empty() { Some(*load as f64) } else { Self::address_value(custom, Some(&self.labels)) };
                if let Some(placed) = placed.filter(|p| !p.is_nan()) {
                    let shift = placed as i64 - *load as i64;
                    let base_init = if *init != 0 { *init } else { *load } as i64;
                    self.labels.set("SID_LOAD", (placed as i64 & 0xFFFF) as f64);
                    self.labels.set("SID_INIT", ((base_init + shift) & 0xFFFF) as f64);
                    if *play != 0 {
                        self.labels.set("SID_PLAY", ((*play as i64 + shift) & 0xFFFF) as f64);
                    }
                }
            }
            Kind::IncBin { level: true, addr, bytes, .. } => {
                if let Ok(Some(info)) = crate::level::level_build(bytes, parse_address_value(addr).unwrap_or(0x2000 as f64) as i64) {
                    for (name, v) in info.labels {
                        self.labels.set(&name, v);
                    }
                }
            }
            Kind::Table { name, addr } => {
                let a = if addr.is_empty() { None } else { parse_address_value(addr) };
                self.labels.set(name, a.unwrap_or(line.address as f64));
            }
            Kind::Mem { addr, label, .. } if !label.trim().is_empty() => {
                self.labels.set(label.trim(), parse_address_value(addr).unwrap_or(0xC000 as f64));
            }
            Kind::Var { name, .. } if !name.is_empty() => {
                if let Some(a) = line.meta.var_address {
                    self.labels.set(name, a as f64);
                }
            }
            Kind::Const { name, raw, base, .. } => {
                let raw = raw.trim();
                let value = if let Some(c) = regex!(r"^\*\s*([+-])\s*(\d+)$").captures(raw) {
                    let off = js_parse_int(&c[2], 10) * if &c[1] == "+" { 1.0 } else { -1.0 };
                    Some(js_and(line.address as f64 + off, 0xFFFF) as f64)
                } else if let Some(n) = parse_number_by_base(raw.strip_prefix('$').unwrap_or(raw), *base) {
                    Some(n)
                } else {
                    let addr = line.address as f64;
                    self.eval_folded(raw, Some(&self.labels.clone()), &[("i", addr), ("I", addr)]).map(|v| js_and(v, 0xFFFF) as f64)
                };
                if let Some(v) = value {
                    if let Some(ci) = line.meta.const_index {
                        self.consts[ci].value = Some(v);
                    }
                    self.labels.set(name, v);
                }
            }
            _ => {}
        }
        // the auto buffer of a macro parameter (`_autoBufferLabel`)
        if let Some(label) = &line.meta.auto_buffer {
            self.labels.set(label, line.meta.auto_buffer_address.unwrap_or(line.address) as f64);
        }
    }

    /// `buildOperandPreview` → its error (the validation of `getLiveValidationError`).
    fn operand_error(mode: Mode, raw: &str, base: Base) -> bool {
        if mode == Mode::Implied {
            return false;
        }
        let value = if mode == Mode::Immediate { raw.trim().trim_start_matches('#') } else { raw.trim() };
        if value == "*" || value == "-" || value == "+" {
            return false;
        }
        if value.is_empty() {
            return true;
        }
        if mode == Mode::Relative && parse_number_by_base(value, base).is_none() {
            return false;
        }
        let converted = char_literal_to_hex(value);
        match parse_number_by_base(&converted, base) {
            Some(n) => {
                if n != n.trunc() {
                    return true;
                }
                match mode {
                    Mode::Immediate | Mode::ZeroPage | Mode::ZeroPageX | Mode::IndirectX | Mode::IndirectY | Mode::ZeroPageY => !(0.0..=255.0).contains(&n),
                    Mode::Absolute | Mode::AbsoluteX | Mode::AbsoluteY | Mode::Indirect => !(0.0..=65535.0).contains(&n),
                    Mode::Relative => !(-128.0..=65535.0).contains(&n),
                    Mode::Implied => false,
                }
            }
            None => {
                if mode == Mode::Immediate && regex!(r"^[A-Za-z0-9_.$%<>()+\-*/&|^~\s]+$").is_match(&converted) {
                    return false;
                }
                if mode == Mode::Immediate && (value.starts_with('<') || value.starts_with('>')) {
                    let name = value[1..].trim();
                    if is_ident(name) {
                        return false;
                    }
                    let stripped = name.strip_prefix('$').or_else(|| name.strip_prefix('%')).unwrap_or(name);
                    if matches!(parse_number_by_base(stripped, base), Some(n) if (0.0..=65535.0).contains(&n)) {
                        return false;
                    }
                }
                if is_ident(value) {
                    return false;
                }
                if regex!(r"^([A-Za-z_][A-Za-z0-9_]*)\s*([+-])\s*(\$[0-9A-Fa-f]+|\d+)$").is_match(value) {
                    return false;
                }
                if value.contains('*') && regex!(r"^[*A-Za-z0-9_.$%<>()+\-/&|^\s]+$").is_match(value) {
                    return false;
                }
                if regex!(r"^\.[A-Za-z_][A-Za-z0-9_]*$").is_match(value) {
                    return false;
                }
                true
            }
        }
    }

    /// `_branchOffsetFromTarget`
    fn branch_offset(target: f64, address: i64, mnem: &str) -> Result<u8, String> {
        let offset = target - (address + 2) as f64;
        if !(-128.0..=127.0).contains(&offset) {
            return Err(format!("{mnem}: branch target out of range ({offset})"));
        }
        Ok(js_and(offset, 0xFF) as u8)
    }

    /// `resolveRelativeOperand`
    fn relative(&self, raw: &str, base: Base, address: i64, mnem: &str) -> Result<u8, String> {
        let raw = raw.trim();
        if raw == "*" {
            return Ok(0xFE);
        }
        let invalid = || format!("{mnem}: the branch operand cannot be resolved");
        if has_star_pc_ref(raw) {
            let t = self.eval_asm_expr(&substitute_star_pc(raw, address), Some(&self.labels)).ok_or_else(invalid)?;
            return Self::branch_offset(js_and(t, 0xFFFF) as f64, address, mnem);
        }
        if let Some(v) = self.labels.get(raw) {
            return Self::branch_offset(v, address, mnem);
        }
        match parse_number_by_base(raw.strip_prefix('$').unwrap_or(raw), base) {
            None => {
                let t = self.eval_asm_expr(raw, Some(&self.labels)).ok_or_else(invalid)?;
                Self::branch_offset(js_and(t, 0xFFFF) as f64, address, mnem)
            }
            Some(p) if (-128.0..=127.0).contains(&p) => Ok(js_and(p, 0xFF) as u8),
            Some(p) => Self::branch_offset(p, address, mnem),
        }
    }

    /// `resolveNumericOperand`
    fn numeric_operand(&self, raw: &str, base: Base, mnem: &str) -> Result<f64, String> {
        let err = || format!("{mnem}: the operand cannot be resolved to an address or value");
        let labels = &self.labels;
        if let Some(v) = labels.get(raw) {
            return Ok(v);
        }
        if let Some(c) = regex!(r"^([A-Za-z_][A-Za-z0-9_]*)\s*([+-])\s*(\$[0-9A-Fa-f]+|\d+)$").captures(raw) {
            let base_addr = labels.get(&c[1]).ok_or_else(err)?;
            let off = &c[3];
            let off = if let Some(h) = off.strip_prefix('$') { js_parse_int(h, 16) } else { js_parse_int(off, 10) };
            let r = if &c[2] == "+" { base_addr + off } else { base_addr - off };
            return Ok(js_and(r, 0xFFFF) as f64);
        }
        let stripped = raw.strip_prefix('#').unwrap_or(raw);
        for (sigil, high) in [('<', false), ('>', true)] {
            if let Some(name) = stripped.strip_prefix(sigil) {
                let name = name.trim();
                let pick = |v: f64| if high { ((js_and(v, -1) >> 8) & 0xFF) as f64 } else { js_and(v, 0xFF) as f64 };
                if let Some(v) = labels.get(name) {
                    return Ok(pick(v));
                }
                let literal_base = if crate::num::is_dec(name) { Base::Dec } else { base };
                let no_prefix = name.strip_prefix('$').or_else(|| name.strip_prefix('%')).unwrap_or(name);
                if let Some(v) = parse_number_by_base(no_prefix, literal_base) {
                    return Ok(pick(v));
                }
                if let Some(v) = self.const_value(name) {
                    return Ok(pick(v));
                }
                if let Some(v) = self.eval_word(name, Some(labels), true) {
                    return Ok(pick(v));
                }
                return Err(err());
            }
        }
        let no_prefix = stripped.strip_prefix('$').or_else(|| stripped.strip_prefix('%')).unwrap_or(stripped);
        match parse_number_by_base(no_prefix, base) {
            Some(v) => Ok(v),
            None => {
                if let Some(v) = labels.get(stripped) {
                    return Ok(v);
                }
                self.eval_word(stripped, Some(labels), true).ok_or_else(err)
            }
        }
    }

    /// `compileLineBytes` (the ported blocks)
    fn compile_line(&self, line: &Line) -> Result<Vec<u8>, String> {
        if line.skipped {
            return Ok(Vec::new());
        }
        let address = line.address;
        if line.meta.header {
            return Ok(Vec::new());
        }
        if let Kind::Invoke { name, .. } = &line.block.kind {
            return Err(match &line.meta.from_macro {
                Some(outer) if self.macros.contains_key(name) => format!("calling macro {name} inside macro {outer} is not supported: macros expand one level deep"),
                _ => format!("unknown macro: {name}"),
            });
        }
        if line.meta.from_macro_def && regex!(r"\{[A-Za-z_][A-Za-z0-9_]*\}").is_match(raw_operand(&line.block.kind)) {
            return Ok(Vec::new());
        }
        let push_all = |vals: Vec<f64>| vals.into_iter().map(to_uint8).collect::<Vec<u8>>();
        let reg_x = |r: char, x: u8, y: u8| if r == 'Y' { y } else { x };
        match &line.block.kind {
            Kind::Blank | Kind::Comment { error: None, .. } | Kind::Label { .. } | Kind::AnonLabel | Kind::KickScopeEnd => Ok(Vec::new()),
            Kind::Comment { error: Some(e), .. } => Err(e.clone()),
            Kind::Unsupported { what } => Err(format!("{what} is not supported by the Rust VMA compiler yet")),
            Kind::If { .. } | Kind::Var { .. } if line.meta.error.is_some() => Err(line.meta.error.clone().unwrap()),
            Kind::Loop { reg, count, .. } => match parse_number_by_base(count.trim(), Base::Hex) {
                Some(n) if (0.0..=255.0).contains(&n) => Ok(vec![reg_x(*reg, 0xA2, 0xA0), n as u8]),
                _ => Err("LOOP: invalid count".into()),
            },
            Kind::For { reg, count, .. } => {
                let n = js_parse_int(count.trim(), 16);
                if n.is_nan() || !(0.0..=255.0).contains(&n) {
                    return Err("FOR: invalid count".into());
                }
                Ok(vec![reg_x(*reg, 0xA2, 0xA0), 0x00])
            }
            Kind::Next { label, reg } => {
                if label.is_empty() {
                    return Err("NEXT: no matching LOOP".into());
                }
                let target = self.labels.get(label).ok_or_else(|| format!("NEXT: unknown label {label}"))?;
                let offset = target - (address + 3) as f64;
                if !(-128.0..=127.0).contains(&offset) {
                    return Err(format!("NEXT: the loop is too long for BNE (offset {offset})"));
                }
                Ok(vec![reg_x(*reg, 0xCA, 0x88), 0xD0, js_and(offset, 0xFF) as u8])
            }
            Kind::Endf { label, reg, count } => {
                if label.is_empty() {
                    return Err("ENDF: no matching FOR".into());
                }
                let n = js_parse_int(count.trim(), 16);
                if n.is_nan() || !(0.0..=255.0).contains(&n) {
                    return Err("ENDF: invalid limit".into());
                }
                let target = self.labels.get(label).ok_or_else(|| format!("ENDF: unknown label {label}"))?;
                let offset = target - (address + 5) as f64;
                if !(-128.0..=127.0).contains(&offset) {
                    return Err(format!("ENDF: the loop is too long for BNE (offset {offset})"));
                }
                Ok(vec![reg_x(*reg, 0xE8, 0xC8), reg_x(*reg, 0xE0, 0xC0), n as u8, 0xD0, js_and(offset, 0xFF) as u8])
            }
            Kind::Push { regs } => {
                let mut out = Vec::new();
                for r in regs.chars() {
                    match r {
                        'A' => out.push(0x48),
                        'X' => out.extend([0x8A, 0x48]),
                        'Y' => out.extend([0x98, 0x48]),
                        _ => return Err(format!("PUSH: invalid register {r}")),
                    }
                }
                Ok(out)
            }
            Kind::Pull { regs } => {
                let mut out = Vec::new();
                for r in regs.chars().rev() {
                    match r {
                        'A' => out.push(0x68),
                        'X' => out.extend([0x68, 0xAA]),
                        'Y' => out.extend([0x68, 0xA8]),
                        _ => return Err(format!("PULL: invalid register {r}")),
                    }
                }
                Ok(out)
            }
            Kind::EndMacro => Ok(vec![0x60]),
            Kind::Fixed { bytes } => Ok(bytes.clone()),
            Kind::Text { x, y, raw, lower } => {
                let coord = |v: &str| self.numeric_value(v, Some(&self.labels), Base::Dec).filter(|v| !v.is_nan()).unwrap_or(0.0);
                let start = 0x0400 as f64 + coord(y) * 40.0 + coord(x);
                Ok(stores(start, &encode_text(raw, *lower)))
            }
            Kind::Mem { op: MemOp::String, addr, raw, offset, lower, .. } => {
                let off = self.numeric_value(if offset.is_empty() { "0" } else { offset }, Some(&self.labels), Base::Hex).filter(|v| !v.is_nan()).unwrap_or(0.0);
                let start = Self::address_value(addr, Some(&self.labels)).unwrap_or(0xC000 as f64);
                let chars: Vec<f64> = encode_text(raw, *lower).into_iter().map(|c| c + off).collect();
                Ok(stores(start, &chars))
            }
            Kind::Mem { op: MemOp::Data, addr, raw, .. } => {
                let start = Self::address_value(addr, Some(&self.labels)).unwrap_or(0xC000 as f64);
                Ok(stores(start, &self.byte_values(raw, Base::Hex, None)))
            }
            // deferred chunks: placed by `assemble`
            Kind::Mem { .. } | Kind::Table { .. } => Ok(Vec::new()),
            Kind::Print { raw, lower } => {
                let data = encode_petscii(raw, *lower);
                if data.len() > 255 {
                    return Err(format!("PRINT: text too long ({}, max 255)", data.len()));
                }
                let data_addr = address + 3;
                let code = data_addr + data.len() as i64 + 1;
                let mut out = vec![0x4C, code as u8, (code >> 8) as u8];
                out.extend(data.iter().map(|b| to_uint8(*b)));
                out.extend([0x00, 0xA2, 0x00, 0xBD, data_addr as u8, (data_addr >> 8) as u8, 0xF0, 0x06, 0x20, 0xD2, 0xFF, 0xE8, 0xD0, 0xF5]);
                Ok(out)
            }
            Kind::SpriteInit { num, color, page, mc } => {
                // null passes as 0 (sprite number, colour), NaN fails
                let n = self.macro_number(if num.is_empty() { "0" } else { num }, &self.labels, Base::Dec).unwrap_or(0.0);
                if n.is_nan() || !(0.0..=7.0).contains(&n) {
                    return Err("SPRITE_INIT: the sprite number must be 0-7".into());
                }
                let col = self.macro_number(if color.is_empty() { "7" } else { color }, &self.labels, Base::Dec).unwrap_or(0.0);
                if col.is_nan() || !(0.0..=15.0).contains(&col) {
                    return Err("SPRITE_INIT: the colour must be 0-15".into());
                }
                let pg = self.macro_number(if page.is_empty() { "21" } else { page }, &self.labels, Base::Hex).unwrap_or(f64::NAN);
                if pg.is_nan() || !(0.0..=255.0).contains(&pg) {
                    return Err("SPRITE_INIT: the data page must be a byte".into());
                }
                let n = n as i64;
                let (ptr, col_addr, bit) = (0x07F8 + n, 0xD027 + n, 1u8 << n);
                Ok(vec![
                    0xA9, to_uint8(pg), 0x8D, ptr as u8, (ptr >> 8) as u8,
                    0xAD, 0x15, 0xD0, 0x09, bit, 0x8D, 0x15, 0xD0,
                    0xAD, 0x1C, 0xD0, if *mc { 0x09 } else { 0x29 }, if *mc { bit } else { 0xFF ^ bit }, 0x8D, 0x1C, 0xD0,
                    0xA9, to_uint8(col), 0x8D, col_addr as u8, (col_addr >> 8) as u8,
                ])
            }
            Kind::SpritePos { num, x, y } => {
                let get = |v: &str, d: &str| self.macro_number(if v.is_empty() { d } else { v }, &self.labels, Base::Dec);
                let n = get(num, "0").filter(|n| !(*n < 0.0 || *n > 7.0)).ok_or("SPRITE_POS: the sprite number must be 0-7")?;
                let xv = get(x, "152").filter(|v| !(*v < 0.0 || *v > 319.0)).ok_or("SPRITE_POS: X must be 0-319")?;
                let yv = get(y, "100").filter(|v| !(*v < 0.0 || *v > 255.0)).ok_or("SPRITE_POS: Y must be 0-255")?;
                let n = crate::expr::to_int32(n) as i64;
                let (xa, ya) = (0xD000 + n * 2, 0xD001 + n * 2);
                let bit = (1i64 << (n & 31)) as i64;
                let (op, mask) = if xv > 255.0 { (0x09, bit & 0xFF) } else { (0x29, !bit & 0xFF) };
                Ok(vec![
                    0xA9, js_and(xv, 0xFF) as u8, 0x8D, xa as u8, (xa >> 8) as u8,
                    0xAD, 0x10, 0xD0, op, mask as u8, 0x8D, 0x10, 0xD0,
                    0xA9, to_uint8(yv), 0x8D, ya as u8, (ya >> 8) as u8,
                ])
            }
            Kind::SpriteCol { num, bg } => {
                let n = self.numeric_value(if num.is_empty() { "0" } else { num }, Some(&self.labels), Base::Dec).unwrap_or(0.0);
                if n.is_nan() || !(0.0..=7.0).contains(&n) {
                    return Err("SPRITE_COL: the sprite number must be 0-7".into());
                }
                Ok(vec![0xAD, if *bg { 0x1F } else { 0x1E }, 0xD0, 0x29, 1u8 << (n as u32)])
            }
            Kind::SpriteAnim { num, list, count, zp } => {
                let n = self.numeric_value(if num.is_empty() { "0" } else { num }, Some(&self.labels), Base::Dec).unwrap_or(0.0);
                if n.is_nan() || !(0.0..=7.0).contains(&n) {
                    return Err("SPRITE_ANIM: the sprite number must be 0-7".into());
                }
                // null < 1: an unresolved count fails
                let cnt = self.numeric_value(if count.is_empty() { "4" } else { count }, Some(&self.labels), Base::Dec).unwrap_or(0.0);
                if cnt.is_nan() || !(1.0..=255.0).contains(&cnt) {
                    return Err("SPRITE_ANIM: the frame count must be 1-255".into());
                }
                let z = self.numeric_value(if zp.is_empty() { "FB" } else { zp }, Some(&self.labels), Base::Hex).unwrap_or(0.0);
                if z.is_nan() || !(0.0..=255.0).contains(&z) {
                    return Err("SPRITE_ANIM: the zero page counter must be $00-$FF".into());
                }
                let l = js_parse_int(if list.is_empty() { "C100" } else { list }, 16);
                if l.is_nan() || !(0.0..=65535.0).contains(&l) {
                    return Err("SPRITE_ANIM: invalid frame list address".into());
                }
                let (z, l, ptr) = (to_uint8(z), l as i64, 0x07F8 + n as i64);
                Ok(vec![0xE6, z, 0xA5, z, 0xC9, to_uint8(cnt), 0x90, 0x04, 0xA9, 0x00, 0x85, z, 0xAA, 0xBD, l as u8, (l >> 8) as u8, 0x8D, ptr as u8, (ptr >> 8) as u8])
            }
            Kind::BoxHit { b1, b2 } => {
                let z1 = parse_address_value(b1).unwrap_or(0xFB as f64);
                let z2 = parse_address_value(b2).unwrap_or(0xF7 as f64);
                if !(0.0..=252.0).contains(&z1) || !(0.0..=252.0).contains(&z2) {
                    return Err("BOX_HIT zero-page addresses must be 0-$FC (need 4 bytes)".into());
                }
                let (a, b) = (z1 as u8, z2 as u8);
                let off = |pos: i32, target: i32| (target - (pos + 2)) as u8;
                Ok(vec![
                    0xA5, a + 2, 0xC5, b, 0x90, off(4, 28),
                    0xA5, b + 2, 0xC5, a, 0x90, off(10, 28),
                    0xA5, a + 3, 0xC5, b + 1, 0x90, off(16, 28),
                    0xA5, b + 3, 0xC5, a + 1, 0x90, off(22, 28),
                    0xA9, 0x01, 0xD0, off(26, 30), 0xA9, 0x00,
                ])
            }
            Kind::ScoreBcd { addr, digits, points, screen } => {
                let a = js_parse_int(if addr.is_empty() { "C200" } else { addr }, 16);
                if a.is_nan() || !(0.0..=65535.0).contains(&a) {
                    return Err("SCORE_BCD: invalid BCD storage address".into());
                }
                let scr = js_parse_int(if screen.is_empty() { "0400" } else { screen }, 16);
                if scr.is_nan() || !(0.0..=65535.0).contains(&scr) {
                    return Err("SCORE_BCD: invalid screen address".into());
                }
                let pts = js_parse_int(if points.is_empty() { "100" } else { points }, 10);
                let pts = if pts.is_nan() { 0.0 } else { pts };
                let bcd = |v: f64| ((v / 10.0).floor() % 10.0 * 16.0 + v % 10.0) as u8;
                let vals = [bcd(pts % 100.0), bcd((pts / 100.0).floor() % 100.0), bcd((pts / 10000.0).floor() % 100.0)];
                let (a, scr) = (a as i64, scr as i64);
                let n = *digits as i64 / 2;
                let mut out = vec![0xF8, 0x18];
                for i in 0..n {
                    let at = a + i;
                    out.extend([0xAD, at as u8, (at >> 8) as u8, 0x69, vals[i as usize], 0x8D, at as u8, (at >> 8) as u8]);
                }
                out.push(0xD8);
                for i in (0..n).rev() {
                    let at = a + i;
                    let pos = scr + (n - 1 - i) * 2;
                    let (s0, s1) = (pos & 0xFFFF, (pos + 1) & 0xFFFF);
                    out.extend([0xAD, at as u8, (at >> 8) as u8, 0x48, 0x4A, 0x4A, 0x4A, 0x4A, 0x09, 0x30, 0x8D, s0 as u8, (s0 >> 8) as u8, 0x68, 0x29, 0x0F, 0x09, 0x30, 0x8D, s1 as u8, (s1 >> 8) as u8]);
                }
                Ok(out)
            }
            Kind::Joystick { port, sprite, vx, vy, fire } => {
                let p = self.numeric_value(if port.is_empty() { "2" } else { port }, Some(&self.labels), Base::Dec);
                let p = match p {
                    Some(v) if v == 1.0 || v == 2.0 || v == 3.0 => v as u8,
                    _ => return Err("JOYSTICK: the port must be 1, 2 or 3".into()),
                };
                let read: Vec<u8> = match p {
                    3 => vec![0xAD, 0x00, 0xDC, 0x2D, 0x01, 0xDC],
                    1 => vec![0xAD, 0x01, 0xDC],
                    _ => vec![0xAD, 0x00, 0xDC],
                };
                let dirs = |out: &mut Vec<u8>, x: i64, y: i64| {
                    for (op, a) in [(0xCE, y), (0xEE, y), (0xCE, x), (0xEE, x)] {
                        out.extend([0x4A, 0xB0, 0x03, op, a as u8, (a >> 8) as u8]);
                    }
                };
                if vx.trim().is_empty() && vy.trim().is_empty() {
                    let n = self.numeric_value(if sprite.is_empty() { "0" } else { sprite }, Some(&self.labels), Base::Dec).unwrap_or(0.0);
                    if n.is_nan() || !(0.0..=7.0).contains(&n) {
                        return Err("JOYSTICK: the sprite number must be 0-7".into());
                    }
                    let n = n as i64;
                    let mut out = read;
                    dirs(&mut out, 0xD000 + n * 2, 0xD001 + n * 2);
                    return Ok(out);
                }
                let resolve = |e: &str| {
                    self.eval_asm_expr(&substitute_star_pc(e.trim(), address), Some(&self.labels)).filter(|v| !v.is_nan()).map(|v| js_and(v, 0xFFFF))
                };
                let (x, y) = (resolve(vx), resolve(vy));
                let f = if fire.trim().is_empty() { Some(None) } else { resolve(fire).map(Some) };
                let (Some(x), Some(y), Some(f)) = (x, y, f) else {
                    return Err("JOYSTICK: the variables cannot be resolved".into());
                };
                let mut out = vec![0xA9, 0x00, 0x8D, x as u8, (x >> 8) as u8, 0x8D, y as u8, (y >> 8) as u8];
                out.extend(read);
                dirs(&mut out, x, y);
                if let Some(f) = f {
                    out.extend([0x29, 0x01, 0x49, 0x01, 0x8D, f as u8, (f >> 8) as u8]);
                }
                Ok(out)
            }
            Kind::Mouse { port, num, zpx, zpy } => self.mouse_bytes(port, num, zpx, zpy, address),
            Kind::RtCmp { reg, op, raw, base, target, .. } => {
                let raw = raw.trim();
                let imm = raw.starts_with('#');
                let opcode = match (reg, imm) {
                    ('X', true) => 0xE0,
                    ('X', false) => 0xEC,
                    ('Y', true) => 0xC0,
                    ('Y', false) => 0xCC,
                    (_, true) => 0xC9,
                    (_, false) => 0xCD,
                };
                let v = if imm { parse_number_by_base(raw, *base) } else { Self::address_value(raw, Some(&self.labels)) };
                let v = v.filter(|v| !v.is_nan()).ok_or_else(|| format!("runtime condition: cannot resolve {raw}"))?;
                let mut out = vec![opcode, js_and(v, 0xFF) as u8];
                if !imm {
                    out.push(((js_and(v, -1) >> 8) & 0xFF) as u8);
                }
                let t = self.labels.get(target).ok_or("runtime condition: no matching end")?;
                let from = address + out.len() as i64;
                let rel = |o: f64| -> Result<u8, String> {
                    if !(-128.0..=127.0).contains(&o) {
                        return Err(format!("runtime condition: branch too far ({o})"));
                    }
                    Ok(js_and(o, 0xFF) as u8)
                };
                match op.as_str() {
                    "==" | "!=" | "<" | ">=" => {
                        let b = match op.as_str() {
                            "==" => 0xD0,
                            "!=" => 0xF0,
                            "<" => 0xB0,
                            _ => 0x90,
                        };
                        out.extend([b, rel(t - (from + 2) as f64)?]);
                    }
                    "<=" => out.extend([0xF0, 0x02, 0xB0, rel(t - (from + 4) as f64)?]),
                    _ => {
                        // `>`: both offsets checked before either is used
                        let (beq, bcc) = (t - (from + 2) as f64, t - (from + 4) as f64);
                        if !(-128.0..=127.0).contains(&beq) || !(-128.0..=127.0).contains(&bcc) {
                            return Err("runtime condition: branch too far".into());
                        }
                        out.extend([0xF0, js_and(beq, 0xFF) as u8, 0x90, js_and(bcc, 0xFF) as u8]);
                    }
                }
                Ok(out)
            }
            Kind::RtElse { end_label, .. } => {
                let t = self.labels.get(end_label).ok_or("ELSE: no matching ENDIF")?;
                let t = js_and(t, -1);
                Ok(vec![0x4C, t as u8, (t >> 8) as u8])
            }
            Kind::RtEndw { start, .. } => {
                let t = self.labels.get(start).ok_or("ENDW: no matching WHILE")?;
                let t = js_and(t, -1);
                Ok(vec![0x4C, t as u8, (t >> 8) as u8])
            }
            Kind::RtEndIf { .. } | Kind::RtRepeat { .. } => Ok(Vec::new()),
            Kind::MemCpy { src, dst, size } => {
                let n = self.count_or_size(if size.is_empty() { "0" } else { size }, Some(&self.labels), Base::Hex);
                let s = self.macro_address(if src.is_empty() { "C000" } else { src }, &self.labels);
                let d = self.macro_address(if dst.is_empty() { "0400" } else { dst }, &self.labels);
                let (Some(n), Some(s), Some(d)) = (n.filter(|n| *n != 0.0 && !n.is_nan()), s, d) else {
                    return Err("MEMCPY: invalid src/dst/size".into());
                };
                let (full, part) = ((n / 256.0).floor() as i64, n % 256.0);
                let mut out = Vec::new();
                for p in 0..=full {
                    if p == full && part <= 0.0 {
                        break;
                    }
                    let a = js_and(s + (p * 256) as f64, 0xFFFF);
                    let b = js_and(d + (p * 256) as f64, 0xFFFF);
                    out.extend([0xA2, 0x00, 0xBD, a as u8, (a >> 8) as u8, 0x9D, b as u8, (b >> 8) as u8, 0xE8]);
                    if p < full {
                        out.extend([0xD0, 0xF7]);
                    } else {
                        out.extend([0xE0, js_and(part, 0xFF) as u8, 0xD0, 0xF5]);
                    }
                }
                Ok(out)
            }
            Kind::MemSet { dst, value, size } => {
                let n = self.count_or_size(if size.is_empty() { "0" } else { size }, Some(&self.labels), Base::Hex);
                let v = self.count_or_size(if value.is_empty() { "0" } else { value }, Some(&self.labels), Base::Hex);
                let d = self.macro_address(if dst.is_empty() { "0400" } else { dst }, &self.labels);
                let (Some(n), Some(d)) = (n.filter(|n| *n != 0.0 && !n.is_nan()), d) else {
                    return Err("MEMSET: invalid dst/size".into());
                };
                let v = v.filter(|v| !(*v < 0.0 || *v > 255.0)).ok_or("MEMSET: invalid byte value")?;
                let (full, part) = ((n / 256.0).floor() as i64, n % 256.0);
                let mut out = vec![0xA9, js_and(v, 0xFF) as u8];
                for p in 0..=full {
                    if p == full && part <= 0.0 {
                        break;
                    }
                    let a = js_and(d + (p * 256) as f64, 0xFFFF);
                    out.extend([0xA2, 0x00, 0x9D, a as u8, (a >> 8) as u8, 0xE8]);
                    if p < full {
                        out.extend([0xD0, 0xFA]);
                    } else {
                        out.extend([0xE0, js_and(part, 0xFF) as u8, 0xD0, 0xF8]);
                    }
                }
                Ok(out)
            }
            Kind::MapCopy { src, dst, size, combined, color_src, color_dst } => {
                let hex = |v: &str, d: &str| js_parse_int(if v.is_empty() { d } else { v }.trim_start_matches('$'), 16);
                let (s, d) = (hex(src, "C000"), hex(dst, "0400"));
                if s.is_nan() || !(0.0..=65535.0).contains(&s) {
                    return Err("MAP_COPY: invalid source address".into());
                }
                if d.is_nan() || !(0.0..=65535.0).contains(&d) {
                    return Err("MAP_COPY: invalid destination address".into());
                }
                let n = map_copy_size(size);
                if !(1..=0x10000).contains(&n) {
                    return Err("MAP_COPY: the size must be 1-65536".into());
                }
                let section = |src: i64, dst: i64| {
                    let mut out = vec![0xA2, 0x00];
                    for i in 0..n / 256 {
                        let (ps, pd) = ((src + i * 256) & 0xFFFF, (dst + i * 256) & 0xFFFF);
                        out.extend([0xBD, ps as u8, (ps >> 8) as u8, 0x9D, pd as u8, (pd >> 8) as u8, 0xE8, 0xD0, 0xF7]);
                    }
                    if n % 256 > 0 {
                        let fp = n / 256;
                        let (ps, pd) = ((src + fp * 256) & 0xFFFF, (dst + fp * 256) & 0xFFFF);
                        out.extend([0xBD, ps as u8, (ps >> 8) as u8, 0x9D, pd as u8, (pd >> 8) as u8, 0xE8, 0xE0, (n % 256) as u8, 0xD0, 0xF5]);
                    }
                    out
                };
                let (s, d) = (s as i64, d as i64);
                let mut out = section(s, d);
                if *combined {
                    let cd = hex(color_dst, "D800");
                    if !cd.is_nan() {
                        out.extend(section((s + n) & 0xFFFF, cd as i64));
                    }
                } else if !color_src.is_empty() {
                    let (cs, cd) = (hex(color_src, "C3E8"), hex(color_dst, "D800"));
                    if !cs.is_nan() && !cd.is_nan() {
                        out.extend(section(cs as i64, cd as i64));
                    }
                }
                Ok(out)
            }
            Kind::MapCopy16 { src, col, row, screen, color_src, color_dst } => {
                let hex = |v: &str, d: &str| js_parse_int(if v.is_empty() { d } else { v }.trim_start_matches('$'), 16);
                let s = hex(src, "3000");
                let scr = hex(screen, "0400");
                // `(src + 0x100) & 0xFFFF` when no colour source is given
                let cs = if color_src.is_empty() { js_and(s + 256.0, 0xFFFF) as f64 } else { hex(color_src, "") };
                let cd = hex(color_dst, "D800");
                let (c, r) = (js_parse_int(col, 10), js_parse_int(row, 10));
                let bad = |v: f64| v.is_nan() || !(0.0..=65535.0).contains(&v);
                if bad(s) || bad(cs) {
                    return Err("MAP_COPY16X16: invalid source address".into());
                }
                if bad(scr) || bad(cd) {
                    return Err("MAP_COPY16X16: invalid destination address".into());
                }
                if c.is_nan() || !(0.0..=24.0).contains(&c) || r.is_nan() || !(0.0..=9.0).contains(&r) {
                    return Err("MAP_COPY16X16: the position is out of range".into());
                }
                let (s, scr, cs, cd, c, r) = (s as i64, scr as i64, cs as i64, cd as i64, c as i64, r as i64);
                let mut out = Vec::new();
                for i in 0..16 {
                    let a = (s + i * 16) & 0xFFFF;
                    let d = (scr + (r + i) * 40 + c) & 0xFFFF;
                    let ca = (cs + i * 16) & 0xFFFF;
                    let cda = (cd + (r + i) * 40 + c) & 0xFFFF;
                    out.extend([0xA2, 0x00, 0xBD, a as u8, (a >> 8) as u8, 0x9D, d as u8, (d >> 8) as u8, 0xBD, ca as u8, (ca >> 8) as u8, 0x9D, cda as u8, (cda >> 8) as u8, 0xE8, 0xE0, 0x10, 0xD0, 0xEF]);
                }
                Ok(out)
            }
            Kind::Reu { cmd, c64, reu, bank, len } => {
                let hex = |v: &str, d: &str| js_parse_int(if v.is_empty() { d } else { v }.trim_start_matches('$'), 16);
                let (c, e, l) = (hex(c64, "C000"), hex(reu, "0000"), hex(len, "0100"));
                let b = self.numeric_value(if bank.is_empty() { "0" } else { bank }, Some(&self.labels), Base::Dec).unwrap_or(0.0);
                if c.is_nan() || !(0.0..=65535.0).contains(&c) {
                    return Err("REU: invalid C64 address".into());
                }
                if e.is_nan() || !(0.0..=65535.0).contains(&e) {
                    return Err("REU: invalid REU address".into());
                }
                if b.is_nan() || !(0.0..=7.0).contains(&b) {
                    return Err("REU: the bank must be 0-7".into());
                }
                if l.is_nan() || !(1.0..=65535.0).contains(&l) {
                    return Err("REU: the length must be 1-65535".into());
                }
                let (c, e, l) = (c as i64, e as i64, l as i64);
                let mut out = Vec::new();
                for (v, reg) in [(c & 0xFF, 2), (c >> 8, 3), (e & 0xFF, 4), (e >> 8, 5), (js_and(b, 0xFF), 6), (l & 0xFF, 7), (l >> 8, 8), (*cmd as i64, 1)] {
                    out.extend([0xA9, v as u8, 0x8D, reg, 0xDF]);
                }
                Ok(out)
            }
            Kind::IrqSetup { handler, raster } => {
                let h = self.labels.get(handler).ok_or_else(|| format!("IRQ_SETUP: handler not found: {handler}"))?;
                let r = self.macro_number(if raster.is_empty() { "FA" } else { raster }, &self.labels, Base::Hex);
                let r = r.filter(|r| !(*r < 0.0 || *r > 255.0)).ok_or("IRQ_SETUP: the raster line must be a byte")?;
                let h = js_and(h, -1);
                Ok(vec![
                    0x78, 0xA9, h as u8, 0x8D, 0x14, 0x03, 0xA9, (h >> 8) as u8, 0x8D, 0x15, 0x03,
                    0xA9, js_and(r, 0xFF) as u8, 0x8D, 0x12, 0xD0,
                    0xAD, 0x11, 0xD0, 0x29, 0x7F, 0x8D, 0x11, 0xD0,
                    0xA9, 0x01, 0x8D, 0x19, 0xD0,
                    0xAD, 0x1A, 0xD0, 0x09, 0x01, 0x8D, 0x1A, 0xD0,
                    0xA9, 0x7F, 0x8D, 0x0D, 0xDC, 0xAD, 0x0D, 0xDC, 0x58,
                ])
            }
            Kind::LoadFile { name, device, addr, error_label } => {
                let file = loadfile_name(name);
                if file.is_empty() {
                    return Err("LOADFILE: empty file name".into());
                }
                // null < 8: an unresolved device fails
                let dev = self.numeric_value(if device.is_empty() { "8" } else { device }, Some(&self.labels), Base::Dec).unwrap_or(0.0);
                if dev.is_nan() || !(8.0..=30.0).contains(&dev) {
                    return Err("LOADFILE: the device must be 8-30".into());
                }
                let a = addr.trim().trim_start_matches('$');
                let over = if a.is_empty() {
                    None
                } else {
                    let v = js_parse_int(a, 16);
                    if v.is_nan() || !(0.0..=65535.0).contains(&v) {
                        return Err("LOADFILE: invalid load address".into());
                    }
                    Some(v as i64)
                };
                let name_at = address + 3;
                let skip = name_at + file.len() as i64;
                let mut out = vec![0x4C, skip as u8, (skip >> 8) as u8];
                out.extend(file.bytes());
                out.extend([0xA9, file.len() as u8, 0xA2, name_at as u8, 0xA0, (name_at >> 8) as u8, 0x20, 0xBD, 0xFF]);
                out.extend([0xA9, 0x01, 0xA2, js_and(dev, 0xFF) as u8, 0xA0, if over.is_some() { 0x00 } else { 0x01 }, 0x20, 0xBA, 0xFF]);
                if let Some(v) = over {
                    out.extend([0xA2, v as u8, 0xA0, (v >> 8) as u8]);
                }
                out.extend([0xA9, 0x00, 0x20, 0xD5, 0xFF]);
                let label = error_label.trim();
                if label.is_empty() {
                    out.extend([0xB0, 0xFE]);
                } else {
                    let t = self.labels.get(label).ok_or_else(|| format!("LOADFILE: unknown label {label}"))?;
                    let off = t - (address + out.len() as i64 + 2) as f64;
                    if !(-128.0..=127.0).contains(&off) {
                        return Err(format!("LOADFILE: the error label is too far ({off})"));
                    }
                    out.extend([0xB0, js_and(off, 0xFF) as u8]);
                }
                Ok(out)
            }
            Kind::IncBin { error: Some(e), .. } | Kind::Sid { error: Some(e), .. } => Err(e.clone()),
            Kind::Sid { .. } => Ok(Vec::new()),
            Kind::SidPlayer { song, raster } => {
                let init = self.labels.get("SID_INIT").ok_or("SID_PLAYER: no .sid block (SID_INIT)")?;
                let play = self.labels.get("SID_PLAY").ok_or("SID_PLAYER: the tune has no play address (SID_PLAY)")?;
                let s = self.macro_number(if song.is_empty() { "0" } else { song }, &self.labels, Base::Dec);
                let r = self.macro_number(if raster.is_empty() { "FA" } else { raster }, &self.labels, Base::Hex);
                let s = s.filter(|v| !(*v < 0.0 || *v > 255.0)).ok_or("SID_PLAYER: the song must be 0-255")?;
                let r = r.filter(|v| !(*v < 0.0 || *v > 255.0)).ok_or("SID_PLAYER: the raster line must be a byte")?;
                Ok(sid_player_bytes(address, js_and(init, -1), js_and(play, -1), js_and(s, 0xFF), js_and(r, 0xFF)))
            }
            Kind::LevelRow { syntax_ok: false, .. } => Err("LEVEL_ROW: syntax is .level_row dst, col[, color]".into()),
            Kind::LevelRow { raw, .. } => {
                let (dst, col, color) = crate::level::level_row_parse(raw).ok_or("LEVEL_ROW: syntax is .level_row dst, col[, color]")?;
                let mut tab = [0i64; 9];
                for (i, name) in crate::level::ROW_TABLES.iter().enumerate() {
                    tab[i] = self.labels.get(name).ok_or("LEVEL_ROW: needs a .level block")? as i64;
                }
                let eval = |e: &str| {
                    self.eval_asm_expr(&substitute_star_pc(e, address), Some(&self.labels)).filter(|v| !v.is_nan()).map(|v| js_and(v, 0xFFFF)).ok_or_else(|| format!("{e}: cannot be evaluated"))
                };
                let (d, c) = (eval(&dst)?, eval(&col)?);
                Ok(crate::level::level_row_bytes(address, d, c, color, &tab))
            }
            Kind::IncBin { level: true, addr, bytes, .. } => match crate::level::level_build(bytes, parse_address_value(addr).unwrap_or(0x2000 as f64) as i64) {
                Err(e) => Err(e),
                Ok(_) => Ok(Vec::new()),
            },
            Kind::IncBin { koala: false, .. } => Ok(Vec::new()),
            Kind::IncBin { addr, bytes, .. } => {
                let a = parse_address_value(addr).unwrap_or(0x6000 as f64) as i64;
                if a != 0x2000 && a != 0x6000 {
                    return Err("KOALA: the address must be $2000 or $6000".into());
                }
                if !bytes.is_empty() && bytes.len() != 10001 && bytes.len() != 10003 {
                    return Err(format!("KOALA: a Koala file is 10001 or 10003 bytes, not {}", bytes.len()));
                }
                Ok(koala_show_bytes(a))
            }
            Kind::Delay { frames } => {
                let n = self.delay_frames(if frames.is_empty() { "1" } else { frames }).ok_or("DELAY: value must be 1-255 or a defined const")?;
                let h = self.labels.get(DELAY_HELPER_LABEL).ok_or("DELAY: the helper routine has no address")? as i64;
                Ok(vec![0xA2, js_and(n, 0xFF) as u8, 0x20, h as u8, (h >> 8) as u8])
            }
            Kind::CharDef { base, index, raw } => {
                let b = parse_address_value(base).unwrap_or(0x3800 as f64);
                let idx = js_parse_int(if index.is_empty() { "0" } else { index }, 10);
                if idx.is_nan() || !(0.0..=255.0).contains(&idx) {
                    return Err("CHARDEF index must be 0-255".into());
                }
                let target = b + idx * 8.0;
                if !(0.0..=(0xFFFF - 7) as f64).contains(&target) {
                    return Err(format!("CHARDEF target address out of range: ${:x}", target as i64));
                }
                let parts: Vec<&str> = raw.split(',').map(|p| p.trim()).filter(|p| !p.is_empty()).collect();
                if parts.len() != 8 {
                    return Err(format!("CHARDEF needs exactly 8 bytes, got {}", parts.len()));
                }
                let mut out = Vec::new();
                for (i, part) in parts.iter().enumerate() {
                    // null (unresolved) passes as 0, NaN fails
                    let v = self.macro_number(part, &self.labels, Base::Hex).unwrap_or(0.0);
                    if v.is_nan() || !(0.0..=255.0).contains(&v) {
                        return Err(format!("CHARDEF byte {} invalid: {}", i + 1, part));
                    }
                    let a = target as i64 + i as i64;
                    out.extend([0xA9, js_and(v, 0xFF) as u8, 0x8D, a as u8, (a >> 8) as u8]);
                }
                Ok(out)
            }
            Kind::SetColor { border, value, .. } => {
                let mnem = if *border { "SET_BORDER" } else { "SET_BG" };
                let v = self.macro_number(if value.is_empty() { "0" } else { value }, &self.labels, Base::Hex);
                match v {
                    Some(v) if !(v < 0.0 || v > 15.0) => Ok(vec![0xA9, js_and(v, 0xFF) as u8, 0x8D, if *border { 0x20 } else { 0x21 }, 0xD0]),
                    _ => Err(format!("{mnem}: color must be 0-15")),
                }
            }
            Kind::WaitRaster { line: rl } => {
                let v = self.macro_number(if rl.is_empty() { "FF" } else { rl }, &self.labels, Base::Hex).unwrap_or(f64::NAN);
                if v.is_nan() || !(0.0..=255.0).contains(&v) {
                    return Err("WAIT_RASTER: the raster line must be a byte".into());
                }
                Ok(vec![0xAD, 0x12, 0xD0, 0xC9, to_uint8(v), 0xD0, 0xF9])
            }
            Kind::TurboSet { speed, badline } => {
                let spd = self.macro_number(if speed.is_empty() { "7" } else { speed }, &self.labels, Base::Dec).unwrap_or(0.0);
                if spd.is_nan() || !(0.0..=15.0).contains(&spd) {
                    return Err("TURBO_SET: the speed must be 0-15".into());
                }
                let bad = if self.macro_number(if badline.is_empty() { "0" } else { badline }, &self.labels, Base::Dec) == Some(1.0) { 0x80 } else { 0 };
                Ok(vec![0xA9, (js_and(spd, 0x0F) as u8) | bad, 0x8D, 0x31, 0xD0])
            }
            Kind::ExoDecrunch { depacker } => {
                let a = js_parse_int(depacker.strip_prefix('$').unwrap_or(depacker), 16);
                if a.is_nan() || !(0.0..=65535.0).contains(&a) {
                    return Err("EXODECRUNCH: invalid depacker address".into());
                }
                let a = a as u16;
                Ok(vec![0xA5, 0xAE, 0x85, 0x04, 0xA5, 0xAF, 0x85, 0x05, 0xA9, 0x36, 0x85, 0x01, 0x20, a as u8, (a >> 8) as u8, 0xA9, 0x37, 0x85, 0x01])
            }
            Kind::PrintChar { raw } => match self.petscii_char_value(raw) {
                Some(v) if (0.0..=255.0).contains(&v) => Ok(vec![0xA9, js_and(v, 0xFF) as u8, 0x20, 0xD2, 0xFF]),
                _ => Err(format!("PRINT_CHAR: cannot resolve value \"{raw}\"")),
            },
            Kind::PrintHex { reg } => {
                let mut out = match reg {
                    'X' => vec![0x8A],
                    'Y' => vec![0x98],
                    _ => Vec::new(),
                };
                let nibble = [0xC9, 0x0A, 0x90, 0x02, 0x69, 0x06, 0x69, 0x30, 0x20, 0xD2, 0xFF];
                out.extend([0x48, 0x4A, 0x4A, 0x4A, 0x4A]);
                out.extend(nibble);
                out.extend([0x68, 0x29, 0x0F]);
                out.extend(nibble);
                Ok(out)
            }
            Kind::Rand { seed } => match self.macro_address(if seed.is_empty() { "$FB" } else { seed }, &self.labels) {
                Some(a) if (0.0..=65535.0).contains(&a) => {
                    let (lo, hi) = (js_and(a, 0xFF) as u8, ((js_and(a, -1) >> 8) & 0xFF) as u8);
                    Ok(vec![0xAD, lo, hi, 0xD0, 0x02, 0xA9, 0xA5, 0x0A, 0x90, 0x02, 0x49, 0x1D, 0x8D, lo, hi])
                }
                _ => Err("RAND: invalid seed address".into()),
            },
            // a bare macro name left unexpanded inside a macro body: no bytes (as in JS)
            Kind::Instr { mnem, .. } if self.macros.contains_key(mnem) && !OPCODES.iter().any(|(m, _, _)| m == mnem) => Ok(Vec::new()),
            Kind::Byte { error: Some(e), .. } => Err(e.clone()),
            Kind::Byte { raw, base, .. } => Ok(push_all(self.byte_values(raw, *base, Some(&self.labels)))),
            Kind::Word { raw, base } => {
                let mut out = Vec::new();
                for w in self.word_values(raw, *base, Some(&self.labels)) {
                    out.push(to_uint8(js_and(w, 0xFF) as f64));
                    out.push(to_uint8(((crate::expr::to_int32(w) >> 8) & 0xFF) as f64));
                }
                Ok(out)
            }
            Kind::Fill { raw, base } => {
                let vars = [("i", address as f64), ("I", address as f64)];
                let (count, value, count_expr, value_expr) = self.fill_parse(raw, *base, Some(&self.labels), &vars).ok_or("FILL: invalid parameters")?;
                let count = if count.is_finite() { Some(count) } else { self.eval_folded(&count_expr, Some(&self.labels), &vars) };
                let count = match count {
                    Some(c) if (0.0..=65536.0).contains(&c) => crate::expr::to_int32(c).max(0),
                    _ => return Err("FILL: invalid parameters".into()),
                };
                let uses_i = regex!(r"\bi\b|\bI\b").is_match(&value_expr);
                let mut out = Vec::with_capacity(count as usize);
                for i in 0..count {
                    let v = if value.is_finite() && !uses_i {
                        Some(value)
                    } else {
                        self.eval_folded(&value_expr, Some(&self.labels), &[("i", i as f64), ("I", i as f64)])
                    };
                    match v {
                        Some(v) if !v.is_nan() => out.push(js_and(v, 0xFF) as u8),
                        _ => return Err("FILL: invalid parameters".into()),
                    }
                }
                Ok(out)
            }
            Kind::Align { raw, base } => {
                let boundary = parse_number_by_base(raw.strip_prefix('$').unwrap_or(raw), *base);
                match boundary {
                    Some(b) if b >= 1.0 => Ok(vec![0; line.size.max(0) as usize]),
                    _ => Err("ALIGN: invalid boundary".into()),
                }
            }
            Kind::LongBranch { mnem, cond, raw } => {
                let inv = match cond.as_str() {
                    "NE" => 0xF0,
                    "EQ" => 0xD0,
                    "CC" => 0xB0,
                    "CS" => 0x90,
                    "MI" => 0x10,
                    "PL" => 0x30,
                    "VC" => 0x70,
                    _ => 0x50,
                };
                let raw = raw.trim();
                let target = if let Some(v) = self.labels.get(raw) {
                    Some(v)
                } else if has_star_pc_ref(raw) {
                    self.eval_asm_expr(&substitute_star_pc(raw, address), Some(&self.labels))
                } else {
                    parse_number_by_base(raw.strip_prefix('$').unwrap_or(raw), Base::Hex).or_else(|| self.eval_asm_expr(raw, Some(&self.labels)))
                };
                let t = target.filter(|t| !t.is_nan()).ok_or_else(|| format!("{mnem}: the branch operand cannot be resolved"))?;
                let t = js_and(t, 0xFFFF);
                Ok(vec![inv, 0x03, 0x4C, (t & 0xFF) as u8, (t >> 8) as u8])
            }
            Kind::Assert { expr, message } => {
                let v = self.eval_asm_expr(&substitute_star_pc(expr.trim(), address), Some(&self.labels));
                match v {
                    None => Err(format!(".assert {expr}: cannot be evaluated")),
                    Some(v) if v == 0.0 || v.is_nan() => Err(format!(".assert {expr} failed (value {v}) {message}")),
                    Some(_) => Ok(Vec::new()),
                }
            }
            Kind::Instr { mnem, mode, raw, base, .. } => {
                let known = OPCODES.iter().any(|(m, _, _)| m == mnem);
                if known && Self::operand_error(*mode, raw, *base) {
                    return Err(format!("{mnem}: invalid operand"));
                }
                let opcode = OPCODES.iter().find(|(m, md, _)| m == mnem && md == mode).map(|(_, _, c)| *c);
                let opcode = opcode.ok_or_else(|| format!("{mnem} {mode:?} has no opcode"))?;
                let mut bytes = vec![opcode];
                if *mode == Mode::Implied {
                    return Ok(bytes);
                }
                let anon = |dir: &str| -> Option<i64> {
                    if dir == "-" {
                        self.anon.iter().copied().filter(|a| *a < address).max()
                    } else {
                        self.anon.iter().copied().filter(|a| *a > address).min()
                    }
                };
                let trimmed = raw.trim();
                if *mode == Mode::Relative {
                    let (r, b) = if trimmed == "-" || trimmed == "+" {
                        let a = anon(trimmed).ok_or("anonymous label not found")?;
                        (format!("{:04X}", a), Base::Hex)
                    } else {
                        (raw.clone(), *base)
                    };
                    bytes.push(self.relative(&r, b, address, mnem)?);
                    return Ok(bytes);
                }
                let (r, b) = if trimmed == "*" {
                    (format!("{:04X}", address & 0xFFFF), Base::Hex)
                } else if trimmed == "-" || trimmed == "+" {
                    let a = anon(trimmed).ok_or("anonymous label not found")?;
                    (format!("{:04X}", a), Base::Hex)
                } else if has_star_pc_ref(raw) {
                    (substitute_star_pc(raw, address), *base)
                } else {
                    (raw.clone(), *base)
                };
                let v = self.numeric_operand(&r, b, mnem)?;
                bytes.push(js_and(v, 0xFF) as u8);
                if !mode.one_byte_operand() {
                    bytes.push(((crate::expr::to_int32(v) >> 8) & 0xFF) as u8);
                }
                Ok(bytes)
            }
            _ => Ok(Vec::new()),
        }
    }

    /// `assembleProgramToPrg`: the image of the program, its first ORG at `origin`.
    pub fn assemble(&mut self, program: &[Block], origin: i64, override_origin: bool) -> Result<Image, CompileError> {
        // a directive that is not ported yet can define what the rest refers to: report it first
        if let Some(b) = program.iter().find(|b| matches!(b.kind, Kind::Unsupported { .. })) {
            if let Kind::Unsupported { what } = &b.kind {
                return Err(CompileError { line: b.line, message: format!("{what} is not supported by the Rust VMA compiler yet") });
            }
        }
        for b in program {
            match &b.kind {
                Kind::Comment { error: Some(e), .. } => return Err(CompileError { line: b.line, message: e.clone() }),
                Kind::Include { file, .. } if file.trim().is_empty() => {
                    return Err(CompileError { line: b.line, message: "INCLUDE: no file given".into() });
                }
                Kind::Sid { file, .. } if file.trim().is_empty() => {
                    return Err(CompileError { line: b.line, message: "SID: no file given".into() });
                }
                Kind::IncBin { file, koala, level, .. } if file.trim().is_empty() => {
                    let what = if *koala { "KOALA" } else if *level { "LEVEL" } else { "INCBIN" };
                    return Err(CompileError { line: b.line, message: format!("{what}: no file given") });
                }
                _ => {}
            }
        }
        let lines = self.layout(program, origin, override_origin)?;
        for line in &lines {
            self.add_labels(line);
        }
        let has_delay = lines.iter().any(|l| matches!(l.block.kind, Kind::Delay { .. }));
        let helper = if has_delay {
            let at = self.delay_helper_address(&lines, origin);
            self.labels.set(DELAY_HELPER_LABEL, at as f64);
            Some(at)
        } else {
            None
        };
        self.anon = lines.iter().filter(|l| matches!(l.block.kind, Kind::AnonLabel) && !l.skipped).map(|l| l.address).collect();
        self.anon.sort();

        let mut sections: Vec<(i64, Vec<u8>)> = vec![(origin, Vec::new())];
        for line in &lines {
            match line.block.kind {
                Kind::Label { .. } | Kind::Comment { error: None, .. } | Kind::Blank => continue,
                Kind::Org { .. } | Kind::RestoreAddress => {
                    sections.push((line.address, Vec::new()));
                    continue;
                }
                Kind::Include { .. } | Kind::SaveAddress => continue,
                _ => {}
            }
            let bytes = self.compile_line(line).map_err(|message| CompileError { line: line.block.line, message })?;
            sections.last_mut().unwrap().1.extend(bytes);
        }
        let mut deferred: Vec<(i64, Vec<u8>)> = Vec::new();
        for line in &lines {
            if let Kind::Sid { custom, load, bytes, .. } = &line.block.kind {
                let at = if custom.is_empty() { None } else { parse_address_value(custom) };
                let at = at.map(|a| a as i64).unwrap_or(*load as i64);
                if !bytes.is_empty() && at > 0 {
                    deferred.push((at, bytes.clone()));
                }
                continue;
            }
            if let Kind::IncBin { addr, .. } = &line.block.kind {
                let payload = incbin_payload(&line.block.kind);
                if !payload.is_empty() {
                    deferred.push((parse_address_value(addr).unwrap_or(0xC000 as f64) as i64, payload));
                }
                continue;
            }
            let Kind::Mem { op, addr, raw, offset, lower, null_term, .. } = &line.block.kind else { continue };
            let bytes: Vec<f64> = match op {
                MemOp::RawBytes => self.byte_values(raw, Base::Hex, None),
                MemOp::RawText => {
                    let off = self.numeric_value(if offset.is_empty() { "0" } else { offset }, Some(&self.labels), Base::Hex).filter(|v| !v.is_nan()).unwrap_or(0.0);
                    encode_text(raw, *lower).into_iter().map(|b| js_and(b + off, 0xFF) as f64).collect()
                }
                MemOp::Petscii => {
                    let mut b = encode_petscii(raw, *lower);
                    if *null_term {
                        b.push(0.0);
                    }
                    b
                }
                MemOp::String | MemOp::Data => continue,
            };
            let at = Self::address_value(addr, Some(&self.labels)).unwrap_or(0xC000 as f64) as i64;
            if !bytes.is_empty() {
                deferred.push((at, bytes.into_iter().map(to_uint8).collect()));
            }
        }
        if let Some(at) = helper {
            deferred.push((at, delay_helper_bytes(at)));
        }
        let chunks: Vec<&(i64, Vec<u8>)> = sections.iter().filter(|s| !s.1.is_empty()).chain(deferred.iter()).collect();
        if chunks.is_empty() {
            return Ok(Image { load: origin, bytes: Vec::new() });
        }
        let min = chunks.iter().map(|c| c.0).min().unwrap();
        let max = chunks.iter().map(|c| c.0 + c.1.len() as i64 - 1).max().unwrap();
        let mut buf = vec![0u8; (max - min + 1) as usize];
        for (addr, bytes) in chunks {
            let off = (addr - min) as usize;
            if off + bytes.len() <= buf.len() {
                buf[off..off + bytes.len()].copy_from_slice(bytes);
            }
        }
        Ok(Image { load: min, bytes: buf })
    }
}

/// `_scopeLocalLabels`: `.loop` belongs to the last global label above it.
fn scope_local_labels(program: &mut [(Block, Meta)]) {
    let mut last_global = String::new();
    let mut kick_scopes: Vec<String> = Vec::new();
    let rewrite = |s: &str, global: &str| -> String {
        if !s.contains('.') {
            return s.to_string();
        }
        regex!(r"(^|[^A-Za-z0-9_.])(\.[A-Za-z_][A-Za-z0-9_]*)").replace_all(s, |c: &regex::Captures| format!("{}{}{}", &c[1], global, &c[2])).into_owned()
    };
    for (b, meta) in program.iter_mut() {
        if let Kind::KickScopeEnd = b.kind {
            if let Some(prev) = kick_scopes.pop() {
                last_global = prev;
            }
            continue;
        }
        if let Kind::Label { name, kick_scope, .. } = &mut b.kind {
            if !name.starts_with('.') {
                if *kick_scope {
                    kick_scopes.push(last_global.clone());
                    last_global = name.clone();
                } else if kick_scopes.is_empty() {
                    last_global = name.clone();
                }
                continue;
            }
            if !last_global.is_empty() {
                *name = format!("{last_global}{name}");
            }
            continue;
        }
        if last_global.is_empty() {
            continue;
        }
        let g = last_global.clone();
        let mut changed = false;
        let mut fix = |s: &mut String| {
            let n = rewrite(s, &g);
            if n != *s {
                *s = n;
                changed = true;
            }
        };
        match &mut b.kind {
            Kind::Instr { raw, .. } | Kind::LongBranch { raw, .. } | Kind::Byte { raw, .. } | Kind::Word { raw, .. } | Kind::Fill { raw, .. } | Kind::Align { raw, .. } => fix(raw),
            Kind::Const { raw, .. } => fix(raw),
            Kind::Assert { expr, .. } => fix(expr),
            _ => {}
        }
        // a rewritten block is a copy in JS: the top-level const keeps its own value
        if changed {
            meta.const_index = None;
        }
    }
}

/// `parseUserMacros`: name → parameters + the blocks between `.macro` and `.endm`, over the
/// program with every include's blocks after it.
fn user_macros(top: &[Block]) -> HashMap<String, Macro> {
    let mut all: Vec<Block> = Vec::new();
    for b in top {
        all.push(b.clone());
        if let Kind::Include { blocks, .. } = &b.kind {
            all.extend(blocks.iter().cloned());
        }
    }
    let program = &all[..];
    let mut macros = HashMap::new();
    let mut start: Option<(usize, String, String)> = None;
    for (i, b) in program.iter().enumerate() {
        match &b.kind {
            Kind::MacroDefStart { name, params } => start = Some((i, name.clone(), params.clone())),
            Kind::MacroDefEnd => {
                if let Some((s, name, params)) = start.take() {
                    if !name.is_empty() {
                        let params = params.split(',').map(|p| p.trim().to_string()).filter(|p| !p.is_empty()).collect();
                        macros.insert(name, Macro { params, body: program[s + 1..i].to_vec() });
                    }
                }
            }
            _ => {}
        }
    }
    macros
}

/// `splitMacroInvokeArgs`: commas outside quotes, empty parts dropped.
fn split_macro_invoke_args(text: &str) -> Vec<String> {
    let mut out = Vec::new();
    let mut current = String::new();
    let mut quote: Option<char> = None;
    let mut escaped = false;
    for ch in text.chars() {
        if escaped {
            current.push(ch);
            escaped = false;
            continue;
        }
        if ch == '\\' {
            current.push(ch);
            escaped = true;
            continue;
        }
        if let Some(q) = quote {
            current.push(ch);
            if ch == q {
                quote = None;
            }
            continue;
        }
        if ch == '"' || ch == '\'' {
            quote = Some(ch);
            current.push(ch);
            continue;
        }
        if ch == ',' {
            out.push(current.trim().to_string());
            current.clear();
            continue;
        }
        current.push(ch);
    }
    if !current.trim().is_empty() || !out.is_empty() {
        out.push(current.trim().to_string());
    }
    out.into_iter().filter(|p| !p.is_empty()).collect()
}

/// `normalizeMacroInvokeArg`: one pair of surrounding quotes off.
fn normalize_macro_invoke_arg(arg: &str) -> String {
    let t = arg.trim();
    if t.len() >= 2 && ((t.starts_with('"') && t.ends_with('"')) || (t.starts_with('\'') && t.ends_with('\''))) {
        return t[1..t.len() - 1].to_string();
    }
    t.to_string()
}

/// The replacement string of JS `String.replace` (GetSubstitution without capture groups).
fn js_substitution(replacement: &str, matched: &str, before: &str, after: &str) -> String {
    let mut out = String::new();
    let mut chars = replacement.chars().peekable();
    while let Some(c) = chars.next() {
        if c != '$' {
            out.push(c);
            continue;
        }
        match chars.peek() {
            Some('$') => {
                chars.next();
                out.push('$');
            }
            Some('&') => {
                chars.next();
                out.push_str(matched);
            }
            Some('`') => {
                chars.next();
                out.push_str(before);
            }
            Some('\'') => {
                chars.next();
                out.push_str(after);
            }
            _ => out.push('$'),
        }
    }
    out
}

/// `s.replace(/<needle>/g, replacement)` for a needle without regex characters.
fn js_replace_literal(s: &str, needle: &str, replacement: &str) -> String {
    if needle.is_empty() || !s.contains(needle) {
        return s.to_string();
    }
    let mut out = String::new();
    let mut last = 0;
    for (i, _) in s.match_indices(needle) {
        out.push_str(&s[last..i]);
        out.push_str(&js_substitution(replacement, needle, &s[..i], &s[i + needle.len()..]));
        last = i + needle.len();
    }
    out.push_str(&s[last..]);
    out
}

/// `s.replace(/(?<![A-Za-z0-9_])<pattern>(?![A-Za-z0-9_])/g, replacement)`. A label pattern is
/// used as JS uses it, unescaped (its `.` matches any character); `f` gives the replacement text
/// for the matched text, which then goes through the JS `$` rules.
fn replace_word(s: &str, pattern: &str, f: impl Fn(&str) -> String, regex_pattern: bool) -> String {
    if pattern.is_empty() {
        return s.to_string();
    }
    let word = |c: u8| c.is_ascii_alphanumeric() || c == b'_';
    let re = if regex_pattern { Regex::new(&format!("^(?:{pattern})")).ok() } else { None };
    let b = s.as_bytes();
    let mut out = String::new();
    let mut last = 0;
    let mut i = 0;
    while i < b.len() {
        if !s.is_char_boundary(i) || (i > 0 && word(b[i - 1])) {
            i += 1;
            continue;
        }
        let len = match &re {
            Some(re) => re.find(&s[i..]).map(|m| m.end()),
            None => s[i..].starts_with(pattern).then_some(pattern.len()),
        };
        match len {
            Some(len) if len > 0 && (i + len >= b.len() || !word(b[i + len])) => {
                let matched = &s[i..i + len];
                out.push_str(&s[last..i]);
                out.push_str(&js_substitution(&f(matched), matched, &s[..i], &s[i + len..]));
                i += len;
                last = i;
            }
            _ => i += 1,
        }
    }
    out.push_str(&s[last..]);
    out
}

/// The `rawOperand` of a block (what a macro expansion and `_fromMacroDef` checks look at).
fn raw_operand(kind: &Kind) -> &str {
    match kind {
        Kind::Instr { raw, .. } | Kind::LongBranch { raw, .. } | Kind::Byte { raw, .. } | Kind::Word { raw, .. } | Kind::Fill { raw, .. } | Kind::Align { raw, .. } | Kind::Const { raw, .. } => raw,
        Kind::Assert { expr, .. } => expr,
        Kind::RtCmp { raw, .. } | Kind::LevelRow { raw, .. } | Kind::PrintChar { raw } | Kind::SetColor { raw, .. } | Kind::Text { raw, .. } | Kind::Mem { raw, .. } | Kind::Print { raw, .. } | Kind::CharDef { raw, .. } => raw,
        _ => "",
    }
}

const DELAY_HELPER_LABEL: &str = "__delay_wait_frames";

/// `_sidPlayerBytes`: SEI, init the tune, CIA1 IRQ off, raster IRQ → the handler after the
/// setup (ack, JSR SID_PLAY, JMP $EA31), CLI, jump over the handler.
fn sid_player_bytes(address: i64, init: i64, play: i64, song: i64, raster: i64) -> Vec<u8> {
    let irq = (address + 49) & 0xFFFF;
    let end = (address + 58) & 0xFFFF;
    vec![
        0x78, 0xA9, song as u8, 0x20, init as u8, (init >> 8) as u8,
        0xA9, 0x7F, 0x8D, 0x0D, 0xDC, 0xAD, 0x0D, 0xDC,
        0xA9, irq as u8, 0x8D, 0x14, 0x03, 0xA9, (irq >> 8) as u8, 0x8D, 0x15, 0x03,
        0xA9, raster as u8, 0x8D, 0x12, 0xD0,
        0xAD, 0x11, 0xD0, 0x29, 0x7F, 0x8D, 0x11, 0xD0,
        0xA9, 0x01, 0x8D, 0x1A, 0xD0, 0x8D, 0x19, 0xD0,
        0x58,
        0x4C, end as u8, (end >> 8) as u8,
        0x0E, 0x19, 0xD0, 0x20, play as u8, (play >> 8) as u8, 0x4C, 0x31, 0xEA,
    ]
}

/// `_incBinPayload`: what an INCBIN puts in memory (a Koala file without its load address, the
/// built level data)
fn incbin_payload(kind: &Kind) -> Vec<u8> {
    match kind {
        Kind::IncBin { level: true, addr, bytes, .. } => crate::level::level_build(bytes, parse_address_value(addr).unwrap_or(0x2000 as f64) as i64)
            .ok()
            .flatten()
            .map(|l| l.data)
            .unwrap_or_default(),
        Kind::IncBin { koala: true, bytes, .. } if bytes.len() == 10003 => bytes[2..].to_vec(),
        Kind::IncBin { bytes, .. } => bytes.clone(),
        _ => Vec::new(),
    }
}

/// `_koalaShowBytes`: copy screen and colour RAM, background, VIC bank and the multicolour bitmap mode.
fn koala_show_bytes(addr: i64) -> Vec<u8> {
    let screen = if addr == 0x2000 { 0x0000 } else { 0x4000 } + 0x0400;
    let mut out = vec![0xA2, 0x00];
    let mut copy = |src: i64, dst: i64| {
        for k in 0..4 {
            let (s, d) = ((src + k * 250) & 0xFFFF, (dst + k * 250) & 0xFFFF);
            out.extend([0xBD, s as u8, (s >> 8) as u8, 0x9D, d as u8, (d >> 8) as u8]);
        }
    };
    copy(addr + 8000, screen);
    copy(addr + 9000, 0xD800);
    let bg = (addr + 10000) & 0xFFFF;
    out.extend([0xE8, 0xE0, 0xFA, 0xD0, 0xCB]);
    out.extend([0xAD, bg as u8, (bg >> 8) as u8, 0x8D, 0x21, 0xD0]);
    out.extend([0xAD, 0x00, 0xDD, 0x29, 0xFC, 0x09, if addr == 0x2000 { 0x03 } else { 0x02 }, 0x8D, 0x00, 0xDD]);
    out.extend([0xA9, 0x3B, 0x8D, 0x11, 0xD0, 0xA9, 0x18, 0x8D, 0x16, 0xD0, 0xA9, 0x18, 0x8D, 0x18, 0xD0]);
    out
}

/// `buildDelayHelperBytes`: wait N frames (X), registers saved; its counter byte follows the code.
fn delay_helper_bytes(at: i64) -> Vec<u8> {
    let mut b = vec![
        0x48, 0x8A, 0x48, 0x98, 0x48, 0x8E, 0x00, 0x00, 0xAD, 0x12, 0xD0, 0xC9, 0xFF, 0xD0, 0xF9, 0xAD, 0x12, 0xD0, 0xC9, 0xFF, 0xF0, 0xF9,
        0xCE, 0x00, 0x00, 0xD0, 0xED, 0x68, 0xA8, 0x68, 0xAA, 0x68, 0x60,
    ];
    let counter = (at + b.len() as i64) & 0xFFFF;
    b[6] = counter as u8;
    b[7] = (counter >> 8) as u8;
    b[23] = counter as u8;
    b[24] = (counter >> 8) as u8;
    b.push(0x00);
    b
}

/// The LOADFILE file name: upper case, printable ASCII, at most 16 characters.
fn loadfile_name(name: &str) -> String {
    name.to_uppercase().chars().filter(|c| (' '..='~').contains(c)).take(16).collect()
}

/// `parseInt(mapCopySize, 10) || 1000`
fn map_copy_size(size: &str) -> i64 {
    let n = js_parse_int(size, 10);
    if n.is_nan() || n == 0.0 { 1000 } else { n as i64 }
}

/// LDA #c / STA start+i for every byte
fn stores(start: f64, bytes: &[f64]) -> Vec<u8> {
    let mut out = Vec::with_capacity(bytes.len() * 5);
    for (i, b) in bytes.iter().enumerate() {
        let a = js_and(start + i as f64, -1);
        out.extend([0xA9, js_and(*b, 0xFF) as u8, 0x8D, a as u8, (a >> 8) as u8]);
    }
    out
}

/// The UTF-16 code units the JS encoders see through `[...text]` and `charCodeAt(0)`.
fn js_chars(text: &str) -> impl Iterator<Item = u32> + '_ {
    text.chars().map(|c| {
        let mut buf = [0u16; 2];
        c.encode_utf16(&mut buf)[0] as u32
    })
}

/// `encodeTextMacro` (screen codes); an empty text is "HELLO C64"
fn encode_text(text: &str, lower: bool) -> Vec<f64> {
    let text = if text.is_empty() { "HELLO C64" } else { text };
    js_chars(text)
        .map(|c| match c {
            10 => 13,
            65..=90 => if lower { c } else { c - 64 },
            97..=122 => c - 96,
            32.. => c,
            _ => 32,
        } as f64)
        .collect()
}

/// `encodePetsciiMacro`; an empty text is "HELLO"
fn encode_petscii(text: &str, lower: bool) -> Vec<f64> {
    let text = if text.is_empty() { "HELLO" } else { text };
    js_chars(text)
        .map(|c| match c {
            10 => 13,
            65..=90 => if lower { c + 32 } else { c },
            97..=122 => if lower { c - 32 } else { c },
            32..=126 => c,
            _ => 32,
        } as f64)
        .collect()
}
