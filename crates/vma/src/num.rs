//! Number parsing exactly as the JS compiler does it (parseInt, parseNumberByBase, …).

use crate::parse::Base;

/// JavaScript `parseInt(s, radix)`: leading whitespace, optional sign, the longest digit
/// prefix. NaN when there is no digit.
pub fn js_parse_int(s: &str, radix: u32) -> f64 {
    let t = s.trim_start();
    let (neg, rest) = match t.as_bytes().first() {
        Some(b'-') => (true, &t[1..]),
        Some(b'+') => (false, &t[1..]),
        _ => (false, t),
    };
    let mut rest = rest;
    if radix == 16 && (rest.starts_with("0x") || rest.starts_with("0X")) {
        rest = &rest[2..];
    }
    let digits: String = rest.chars().take_while(|c| c.is_digit(radix)).collect();
    if digits.is_empty() {
        return f64::NAN;
    }
    let mut v = 0f64;
    for c in digits.chars() {
        v = v * radix as f64 + c.to_digit(radix).unwrap() as f64;
    }
    if neg { -v } else { v }
}

/// `n.toString(16).toUpperCase()` for the integers the compiler formats.
pub fn js_hex_upper(n: f64) -> String {
    if n.is_nan() {
        return "NAN".into();
    }
    let i = n.trunc() as i64;
    if i < 0 { format!("-{:X}", -i) } else { format!("{:X}", i) }
}

fn all(s: &str, f: impl Fn(char) -> bool) -> bool {
    !s.is_empty() && s.chars().all(f)
}

pub fn is_hex(s: &str) -> bool {
    all(s, |c| c.is_ascii_hexdigit())
}
pub fn is_dec(s: &str) -> bool {
    all(s, |c| c.is_ascii_digit())
}
pub fn is_bin(s: &str) -> bool {
    all(s, |c| c == '0' || c == '1')
}
pub fn is_ident(s: &str) -> bool {
    let mut cs = s.chars();
    matches!(cs.next(), Some(c) if c.is_ascii_alphabetic() || c == '_') && cs.all(|c| c.is_ascii_alphanumeric() || c == '_')
}

/// `parseNumberByBase`
pub fn parse_number_by_base(value: &str, base: Base) -> Option<f64> {
    let mut v = value.trim();
    if let Some(rest) = v.strip_prefix('#') {
        v = rest;
        if v.is_empty() {
            return None;
        }
    }
    if let Some(bits) = v.strip_prefix('%') {
        return if is_bin(bits) { Some(js_parse_int(bits, 2)) } else { None };
    }
    if let Some(hex) = v.strip_prefix('$') {
        return if is_hex(hex) { Some(js_parse_int(hex, 16)) } else { None };
    }
    if v.len() >= 2 && (v.starts_with("0x") || v.starts_with("0X")) {
        let hex = &v[2..];
        return if is_hex(hex) { Some(js_parse_int(hex, 16)) } else { None };
    }
    match base {
        Base::Bin => if is_bin(v) { Some(js_parse_int(v, 2)) } else { None },
        Base::Hex => if is_hex(v) { Some(js_parse_int(v, 16)) } else { None },
        Base::Dec => {
            let digits = v.strip_prefix('-').unwrap_or(v);
            if is_dec(digits) { v.parse::<f64>().ok() } else { None }
        }
    }
}

/// `parseAddressValue` without a label map.
pub fn parse_address_value(raw: &str) -> Option<f64> {
    let t = raw.trim();
    if t.is_empty() {
        return None;
    }
    if let Some(h) = t.strip_prefix('$') {
        return if is_hex(h) { Some(js_parse_int(h, 16)) } else { None };
    }
    if t.len() > 2 && (t.starts_with("0x") || t.starts_with("0X")) && is_hex(&t[2..]) {
        return Some(js_parse_int(&t[2..], 16));
    }
    if t.len() <= 4 && is_hex(t) {
        return Some(js_parse_int(t, 16));
    }
    if is_dec(t) {
        return Some(js_parse_int(t, 10));
    }
    None
}

/// `_importParseScalar`: (base, value text)
pub fn import_parse_scalar(raw: &str) -> (Base, String) {
    let v = raw.trim();
    if let Some(b) = v.strip_prefix('%') {
        if is_bin(b) {
            return (Base::Bin, b.to_string());
        }
    }
    if let Some(h) = v.strip_prefix('$') {
        if is_hex(h) {
            return (Base::Hex, h.to_uppercase());
        }
    }
    if v.len() > 2 && (v.starts_with("0x") || v.starts_with("0X")) && is_hex(&v[2..]) {
        return (Base::Hex, v[2..].to_uppercase());
    }
    if is_dec(v) {
        return (Base::Dec, v.to_string());
    }
    (Base::Hex, v.to_uppercase())
}

/// `Uint8Array` store: ToUint8 (NaN and infinities → 0).
pub fn to_uint8(v: f64) -> u8 {
    crate::expr::to_int32(v) as u8
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn js_numbers() {
        assert_eq!(js_parse_int("12ab", 10), 12.0);
        assert!(js_parse_int("x", 16).is_nan());
        assert_eq!(parse_number_by_base("$1F", Base::Dec), Some(31.0));
        assert_eq!(parse_number_by_base("10", Base::Hex), Some(16.0));
        assert_eq!(parse_number_by_base("-5", Base::Dec), Some(-5.0));
        assert_eq!(parse_address_value("0900"), Some(0x900 as f64));
        assert_eq!(parse_address_value("49152"), Some(49152.0));
        assert_eq!(js_hex_upper(-1.0), "-1");
        assert_eq!(to_uint8(300.0), 44);
        assert_eq!(to_uint8(-1.0), 255);
    }
}
