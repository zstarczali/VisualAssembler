//! Expressions, the way the JS compiler evaluates them: the operand text is rewritten
//! (`$hex` → `0x`, `<label` → `lo(label)`, names → values) and the result goes through
//! `_evalJsExprSafe` with JavaScript number semantics (f64, ToInt32 for bit operators).

use regex::Regex;
use std::sync::OnceLock;

#[derive(Clone, Copy, Debug, PartialEq)]
pub enum Value {
    Num(f64),
    Bool(bool),
}

impl Value {
    pub fn num(self) -> f64 {
        match self {
            Value::Num(n) => n,
            Value::Bool(b) => b as i32 as f64,
        }
    }
    fn truthy(self) -> bool {
        match self {
            Value::Num(n) => n != 0.0 && !n.is_nan(),
            Value::Bool(b) => b,
        }
    }
}

/// JavaScript ToInt32.
pub fn to_int32(v: f64) -> i32 {
    if !v.is_finite() {
        return 0;
    }
    let t = v.trunc();
    let m = t.rem_euclid(4294967296.0);
    let u = m as u32;
    u as i32
}

fn to_uint32(v: f64) -> u32 {
    to_int32(v) as u32
}

/// `value & mask` in JavaScript.
pub fn js_and(v: f64, mask: i32) -> i64 {
    (to_int32(v) & mask) as i64
}

/// `String(n)` for the numbers the compiler substitutes (labels, constants, loop counters).
pub fn js_num_string(n: f64) -> String {
    if n.is_nan() {
        return "NaN".into();
    }
    if n.is_infinite() {
        return if n > 0.0 { "Infinity".into() } else { "-Infinity".into() };
    }
    if n == n.trunc() && n.abs() < 1e21 {
        return format!("{}", n as i64);
    }
    let s = format!("{}", n);
    s
}

#[derive(Clone, Debug, PartialEq)]
enum Tok {
    Num(f64),
    Id(String),
    Op(&'static str),
}

// Longest first, like the alternation of the JS tokenizer.
const OPS: [&str; 29] = [
    ">>>", "===", "!==", "**", "<<", ">>", "<=", ">=", "==", "!=", "&&", "||", "-", "+", "*", "/",
    "%", "<", ">", "&", "|", "^", "~", "!", "?", ":", "(", ")", ",",
];

fn tokenize(src: &str) -> Option<Vec<Tok>> {
    let b = src.as_bytes();
    let mut i = 0;
    let mut out = Vec::new();
    while i < b.len() {
        let c = b[i];
        if c.is_ascii_whitespace() {
            i += 1;
            continue;
        }
        // numbers: 0x.., 0b.., 0o.., decimal with optional fraction / exponent
        if c.is_ascii_digit() || (c == b'.' && i + 1 < b.len() && b[i + 1].is_ascii_digit()) {
            if c == b'0' && i + 1 < b.len() && matches!(b[i + 1], b'x' | b'X' | b'b' | b'B' | b'o' | b'O') {
                let radix = match b[i + 1] {
                    b'x' | b'X' => 16,
                    b'b' | b'B' => 2,
                    _ => 8,
                };
                let start = i + 2;
                let mut j = start;
                while j < b.len() && (b[j] as char).is_digit(radix) {
                    j += 1;
                }
                if j > start {
                    out.push(Tok::Num(u64::from_str_radix(&src[start..j], radix).ok()? as f64));
                    i = j;
                    continue;
                }
            }
            let start = i;
            let mut j = i;
            while j < b.len() && b[j].is_ascii_digit() {
                j += 1;
            }
            if j < b.len() && b[j] == b'.' {
                j += 1;
                while j < b.len() && b[j].is_ascii_digit() {
                    j += 1;
                }
            }
            if j < b.len() && (b[j] == b'e' || b[j] == b'E') {
                let mut k = j + 1;
                if k < b.len() && (b[k] == b'+' || b[k] == b'-') {
                    k += 1;
                }
                if k < b.len() && b[k].is_ascii_digit() {
                    while k < b.len() && b[k].is_ascii_digit() {
                        k += 1;
                    }
                    j = k;
                }
            }
            out.push(Tok::Num(src[start..j].parse::<f64>().ok()?));
            i = j;
            continue;
        }
        if c.is_ascii_alphabetic() || c == b'_' {
            let start = i;
            let mut j = i;
            while j < b.len() && (b[j].is_ascii_alphanumeric() || b[j] == b'_') {
                j += 1;
            }
            // one optional ".name" part (Math.round)
            if j + 1 < b.len() && b[j] == b'.' && (b[j + 1].is_ascii_alphabetic() || b[j + 1] == b'_') {
                j += 1;
                while j < b.len() && (b[j].is_ascii_alphanumeric() || b[j] == b'_') {
                    j += 1;
                }
            }
            out.push(Tok::Id(src[start..j].to_string()));
            i = j;
            continue;
        }
        let rest = &src[i..];
        let op = OPS.iter().find(|op| rest.starts_with(**op))?;
        out.push(Tok::Op(op));
        i += op.len();
    }
    Some(out)
}

struct Parser {
    toks: Vec<Tok>,
    i: usize,
}

const LEVELS: [&[&str]; 10] = [
    &["||"],
    &["&&"],
    &["|"],
    &["^"],
    &["&"],
    &["==", "!=", "===", "!=="],
    &["<", "<=", ">", ">="],
    &["<<", ">>", ">>>"],
    &["+", "-"],
    &["*", "/", "%"],
];

impl Parser {
    fn peek_op(&self) -> Option<&'static str> {
        match self.toks.get(self.i) {
            Some(Tok::Op(o)) => Some(o),
            _ => None,
        }
    }
    fn eat(&mut self, op: &str) -> Option<()> {
        if self.peek_op() == Some(op) {
            self.i += 1;
            Some(())
        } else {
            None
        }
    }
    fn ternary(&mut self) -> Option<Value> {
        let cond = self.binary(0)?;
        if self.peek_op() != Some("?") {
            return Some(cond);
        }
        self.i += 1;
        let a = self.ternary()?;
        self.eat(":")?;
        let b = self.ternary()?;
        Some(if cond.truthy() { a } else { b })
    }
    fn binary(&mut self, level: usize) -> Option<Value> {
        if level == LEVELS.len() {
            return self.power();
        }
        let mut left = self.binary(level + 1)?;
        while let Some(op) = self.peek_op() {
            if !LEVELS[level].contains(&op) {
                break;
            }
            self.i += 1;
            let right = self.binary(level + 1)?;
            left = apply(op, left, right)?;
        }
        Some(left)
    }
    fn power(&mut self) -> Option<Value> {
        let base = self.unary()?;
        if self.peek_op() != Some("**") {
            return Some(base);
        }
        self.i += 1;
        let exp = self.power()?;
        Some(Value::Num(base.num().powf(exp.num())))
    }
    fn unary(&mut self) -> Option<Value> {
        if let Some(op) = self.peek_op() {
            if matches!(op, "-" | "+" | "!" | "~") {
                self.i += 1;
                let v = self.unary()?;
                return Some(match op {
                    "-" => Value::Num(-v.num()),
                    "+" => Value::Num(v.num()),
                    "!" => Value::Bool(!v.truthy()),
                    _ => Value::Num(!to_int32(v.num()) as f64),
                });
            }
        }
        self.primary()
    }
    fn primary(&mut self) -> Option<Value> {
        let t = self.toks.get(self.i)?.clone();
        self.i += 1;
        match t {
            Tok::Num(n) => Some(Value::Num(n)),
            Tok::Op("(") => {
                let v = self.ternary()?;
                self.eat(")")?;
                Some(v)
            }
            Tok::Id(name) if name == "Math.PI" => Some(Value::Num(std::f64::consts::PI)),
            Tok::Id(name) => {
                let known = matches!(
                    name.as_str(),
                    "lo" | "hi" | "Math.round" | "Math.sin" | "Math.cos" | "Math.max" | "Math.min" | "Math.abs" | "Math.floor" | "Math.ceil"
                );
                if !known {
                    return None;
                }
                self.eat("(")?;
                let mut args = Vec::new();
                if self.peek_op() != Some(")") {
                    args.push(self.ternary()?.num());
                    while self.peek_op() == Some(",") {
                        self.i += 1;
                        args.push(self.ternary()?.num());
                    }
                }
                self.eat(")")?;
                let a0 = args.first().copied().unwrap_or(f64::NAN);
                Some(Value::Num(match name.as_str() {
                    "lo" => (to_int32(a0) & 0xFF) as f64,
                    "hi" => ((to_int32(a0) >> 8) & 0xFF) as f64,
                    "Math.round" => (a0 + 0.5).floor(),
                    "Math.sin" => a0.sin(),
                    "Math.cos" => a0.cos(),
                    "Math.max" => args.iter().copied().fold(f64::NEG_INFINITY, js_max),
                    "Math.min" => args.iter().copied().fold(f64::INFINITY, js_min),
                    "Math.abs" => a0.abs(),
                    "Math.floor" => a0.floor(),
                    _ => a0.ceil(),
                }))
            }
            _ => None,
        }
    }
}

fn js_max(a: f64, b: f64) -> f64 {
    if a.is_nan() || b.is_nan() { f64::NAN } else { a.max(b) }
}
fn js_min(a: f64, b: f64) -> f64 {
    if a.is_nan() || b.is_nan() { f64::NAN } else { a.min(b) }
}

fn loose_eq(a: Value, b: Value) -> bool {
    a.num() == b.num()
}

fn strict_eq(a: Value, b: Value) -> bool {
    match (a, b) {
        (Value::Num(x), Value::Num(y)) => x == y,
        (Value::Bool(x), Value::Bool(y)) => x == y,
        _ => false,
    }
}

fn apply(op: &str, a: Value, b: Value) -> Option<Value> {
    let (x, y) = (a.num(), b.num());
    Some(match op {
        "||" => if a.truthy() { a } else { b },
        "&&" => if a.truthy() { b } else { a },
        "|" => Value::Num((to_int32(x) | to_int32(y)) as f64),
        "^" => Value::Num((to_int32(x) ^ to_int32(y)) as f64),
        "&" => Value::Num((to_int32(x) & to_int32(y)) as f64),
        "==" => Value::Bool(loose_eq(a, b)),
        "!=" => Value::Bool(!loose_eq(a, b)),
        "===" => Value::Bool(strict_eq(a, b)),
        "!==" => Value::Bool(!strict_eq(a, b)),
        "<" => Value::Bool(x < y),
        "<=" => Value::Bool(x <= y),
        ">" => Value::Bool(x > y),
        ">=" => Value::Bool(x >= y),
        "<<" => Value::Num(to_int32(x).wrapping_shl(to_uint32(y) & 31) as f64),
        ">>" => Value::Num(to_int32(x).wrapping_shr(to_uint32(y) & 31) as f64),
        ">>>" => Value::Num(to_uint32(x).wrapping_shr(to_uint32(y) & 31) as f64),
        "+" => Value::Num(x + y),
        "-" => Value::Num(x - y),
        "*" => Value::Num(x * y),
        "/" => Value::Num(x / y),
        "%" => Value::Num(x % y),
        _ => return None,
    })
}

/// `_evalJsExprSafe`: None where the JS version throws.
pub fn eval_js(src: &str) -> Option<Value> {
    let toks = tokenize(src)?;
    let mut p = Parser { toks, i: 0 };
    let v = p.ternary()?;
    if p.i != p.toks.len() {
        return None;
    }
    Some(v)
}

/// How names are looked up while the expression text is rewritten.
pub trait Names {
    fn lookup(&self, name: &str) -> Option<f64>;
}

impl<F: Fn(&str) -> Option<f64>> Names for F {
    fn lookup(&self, name: &str) -> Option<f64> {
        self(name)
    }
}

/// The two identifier rules of the JS evaluators.
#[derive(Clone, Copy, PartialEq)]
pub enum IdentRule {
    /// `\b[A-Za-z_][A-Za-z0-9_]*\b` (the local evaluators)
    Word,
    /// `(?<![\w.])[A-Za-z_][A-Za-z0-9_.]*` (`_evalAsmExpr`: dotted local labels)
    Dotted,
}

fn re(pattern: &'static str, cell: &'static OnceLock<Regex>) -> &'static Regex {
    cell.get_or_init(|| Regex::new(pattern).unwrap())
}

macro_rules! regex {
    ($p:expr) => {{
        static CELL: OnceLock<Regex> = OnceLock::new();
        re($p, &CELL)
    }};
}

/// The text pipeline shared by the JS evaluators. Returns None for an unknown name or a
/// syntax error; `bool_to_num` is `_evalAsmExpr`'s comparison normalisation (others give null).
pub fn eval_asm(expr: &str, rule: IdentRule, names: &dyn Names, bool_to_num: bool) -> Option<f64> {
    let mut text = expr.trim().to_string();
    if text.is_empty() {
        return None;
    }
    if let Some(rest) = text.strip_prefix('#') {
        text = rest.to_string();
    }
    let dollar_name = match rule {
        IdentRule::Word => regex!(r"\$([A-Za-z_][A-Za-z0-9_]*)"),
        IdentRule::Dotted => regex!(r"\$([A-Za-z_][A-Za-z0-9_.]*)"),
    };
    text = dollar_name
        .replace_all(&text, |c: &regex::Captures| {
            let name = &c[1];
            if name.chars().all(|ch| ch.is_ascii_hexdigit()) { c[0].to_string() } else { name.to_string() }
        })
        .into_owned();
    text = regex!(r"\$<\s*\(").replace_all(&text, "lo(").into_owned();
    text = regex!(r"\$>\s*\(").replace_all(&text, "hi(").into_owned();
    text = regex!(r"<\s*\(").replace_all(&text, "lo(").into_owned();
    text = regex!(r">\s*\(").replace_all(&text, "hi(").into_owned();
    let (lo_id, hi_id) = match rule {
        IdentRule::Word => (regex!(r"<\s*([A-Za-z_][A-Za-z0-9_]*)"), regex!(r">\s*([A-Za-z_][A-Za-z0-9_]*)")),
        IdentRule::Dotted => (regex!(r"<\s*([A-Za-z_][A-Za-z0-9_.]*)"), regex!(r">\s*([A-Za-z_][A-Za-z0-9_.]*)")),
    };
    text = lo_id.replace_all(&text, "lo($1)").into_owned();
    text = hi_id.replace_all(&text, "hi($1)").into_owned();
    text = regex!(r"\$([0-9A-Fa-f]+)").replace_all(&text, "0x$1").into_owned();
    text = regex!(r"%([01]+)").replace_all(&text, "0b$1").into_owned();
    text = regex!(r"(?i-u)\b(round|sin|cos|max|min|abs)\b")
        .replace_all(&text, |c: &regex::Captures| format!("__FUNC_{}__", c[1].to_uppercase()))
        .into_owned();
    text = regex!(r"(?i-u)\bPI\b").replace_all(&text, "__CONST_PI__").into_owned();

    let mut unknown = false;
    let resolve = |name: &str, unknown: &mut bool| -> String {
        if name.starts_with("__FUNC_") || name == "__CONST_PI__" || name == "lo" || name == "hi" || name == "Math" {
            return name.to_string();
        }
        if name.len() > 2 && name.starts_with("0x") && name[2..].chars().all(|c| c.is_ascii_hexdigit()) {
            return name.to_string();
        }
        match names.lookup(name) {
            Some(v) => js_num_string(v),
            None => {
                *unknown = true;
                String::new()
            }
        }
    };
    text = match rule {
        IdentRule::Word => regex!(r"(?-u)\b[A-Za-z_][A-Za-z0-9_]*\b")
            .replace_all(&text, |c: &regex::Captures| resolve(&c[0], &mut unknown))
            .into_owned(),
        IdentRule::Dotted => {
            let id = regex!(r"[A-Za-z_][A-Za-z0-9_.]*");
            let bytes = text.as_bytes();
            let mut out = String::new();
            let mut last = 0;
            for m in id.find_iter(&text) {
                let prev = if m.start() == 0 { None } else { Some(bytes[m.start() - 1]) };
                if matches!(prev, Some(p) if p.is_ascii_alphanumeric() || p == b'_' || p == b'.') {
                    continue;
                }
                out.push_str(&text[last..m.start()]);
                out.push_str(&resolve(m.as_str(), &mut unknown));
                last = m.end();
            }
            out.push_str(&text[last..]);
            out
        }
    };
    if unknown {
        return None;
    }
    for (from, to) in [
        ("__FUNC_ROUND__", "Math.round"),
        ("__FUNC_SIN__", "Math.sin"),
        ("__FUNC_COS__", "Math.cos"),
        ("__FUNC_MAX__", "Math.max"),
        ("__FUNC_MIN__", "Math.min"),
        ("__FUNC_ABS__", "Math.abs"),
        ("__CONST_PI__", "Math.PI"),
    ] {
        text = text.replace(from, to);
    }
    match eval_js(&text)? {
        Value::Num(n) if n.is_finite() => Some(n),
        Value::Bool(b) if bool_to_num => Some(b as i32 as f64),
        _ => None,
    }
}

/// 'A' → $41: a character literal is its ASCII / PETSCII code (`_charLiteralToHex`).
pub fn char_literal_to_hex(text: &str) -> String {
    regex!(r"'([^'])'")
        .replace_all(text, |c: &regex::Captures| {
            let ch = c[1].chars().next().unwrap();
            let code = ch as u32;
            // JS charCodeAt gives a UTF-16 unit; the sources are ASCII in practice
            format!("${:02X}", if code > 0xFFFF { 0xFFFD } else { code })
        })
        .into_owned()
}

/// `_hasStarPcRef`
pub fn has_star_pc_ref(expr: &str) -> bool {
    if expr.trim() == "*" {
        return false;
    }
    star_positions(expr).next().is_some()
}

fn star_positions(expr: &str) -> impl Iterator<Item = usize> + '_ {
    let b = expr.as_bytes();
    (0..b.len()).filter(move |&i| {
        b[i] == b'*'
            && b.get(i + 1) != Some(&b'*')
            && (i == 0 || b"(,+-/%&|^~<>= \t\r\n\x0b\x0c".contains(&b[i - 1]))
    })
}

/// `_substituteStarPc`: a `*` in value position becomes `(address)`.
pub fn substitute_star_pc(expr: &str, pc: i64) -> String {
    let addr = pc & 0xFFFF;
    let positions: Vec<usize> = star_positions(expr).collect();
    if positions.is_empty() {
        return expr.to_string();
    }
    let mut out = String::new();
    let mut last = 0;
    for p in positions {
        out.push_str(&expr[last..p]);
        out.push_str(&format!("({})", addr));
        last = p + 1;
    }
    out.push_str(&expr[last..]);
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    fn none(_: &str) -> Option<f64> {
        None
    }

    #[test]
    fn js_semantics() {
        assert_eq!(eval_js("~7 & 0xFF"), Some(Value::Num(248.0)));
        assert_eq!(eval_js("(7+1)*2"), Some(Value::Num(16.0)));
        assert_eq!(eval_js("1 == 1"), Some(Value::Bool(true)));
        assert_eq!(eval_js("7 / 2"), Some(Value::Num(3.5)));
        assert_eq!(eval_js("Math.round(127.5*Math.sin(1))"), Some(Value::Num(107.0)));
        assert_eq!(eval_js("1 +"), None);
    }

    #[test]
    fn rewrite_pipeline() {
        let names = |n: &str| if n == "label" { Some(4660.0) } else { None };
        assert_eq!(eval_asm("#<label", IdentRule::Word, &names, false), Some(0x34 as f64));
        assert_eq!(eval_asm(">(label+256)", IdentRule::Word, &names, false), Some(0x13 as f64));
        assert_eq!(eval_asm("$10 + %11", IdentRule::Word, &none, false), Some(19.0));
        assert_eq!(eval_asm("1 < 2", IdentRule::Dotted, &none, true), Some(1.0));
        assert_eq!(eval_asm("1 < 2", IdentRule::Word, &none, false), None);
        assert_eq!(eval_asm("foo", IdentRule::Word, &none, false), None);
    }

    #[test]
    fn star_pc() {
        assert_eq!(substitute_star_pc("*-2", 0x1000), "(4096)-2");
        assert_eq!(substitute_star_pc("STRIDE*2", 0x1000), "STRIDE*2");
        assert_eq!(substitute_star_pc("<(*+63)", 0x1000), "<((4096)+63)");
        assert!(!has_star_pc_ref("*"));
        assert_eq!(char_literal_to_hex("'A'+1"), "$41+1");
    }
}
