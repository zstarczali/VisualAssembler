//! LEVEL / LEVEL_ROW: a Level Editor project (`.bin` with an "lv-level" manifest) → the placed
//! screens and their lookup tables (`_levelBuild` of www/app.js), and the row copy routine
//! (`_levelRowBytes`).

use crate::expr::to_int32;
use serde_json::Value;
use std::collections::HashMap;

const SCREEN: usize = 2000;
const MAGIC: &[u8] = b"VA-BIN1!";
/// The tables `.level_row` reads (`_LEVEL_ROW_TABLES`).
pub const ROW_TABLES: [&str; 9] = ["LEVEL_SLOT_LO", "LEVEL_SLOT_HI", "LEVEL_ROW_SLOT", "LEVEL_ROW_LO", "LEVEL_ROW_HI", "LEVEL_CROW_LO", "LEVEL_CROW_HI", "LEVEL_COL_SLOT", "LEVEL_COL_OFS"];
const OBJ_TYPES: [&str; 6] = ["START", "ENEMY", "ITEM", "DOOR", "EXIT", "TRIGGER"];
const ATTR_BITS: [(&str, i64); 4] = [("SOLID", 1), ("LADDER", 2), ("HAZARD", 4), ("COLLECT", 8)];

pub struct LevelInfo {
    pub data: Vec<u8>,
    /// in the JS insertion order
    pub labels: Vec<(String, f64)>,
}

/// `_vaReadBinWithMeta`: (payload, manifest, extras), None without a valid trailer.
fn read_bin_meta(src: &[u8]) -> Option<(&[u8], Value, HashMap<String, &[u8]>)> {
    let footer = MAGIC.len() + 4;
    if src.len() < footer || &src[src.len() - MAGIC.len()..] != MAGIC {
        return None;
    }
    let at = src.len() - footer;
    let len = u32::from_le_bytes(src[at..at + 4].try_into().unwrap()) as usize;
    if len == 0 || len > at {
        return None;
    }
    let offset = at - len;
    let manifest: Value = serde_json::from_str(&String::from_utf8_lossy(&src[offset..at])).ok()?;
    let payload_len = int(&manifest["baseLength"]);
    if payload_len < 0 || payload_len as usize > offset {
        return None;
    }
    let base = payload_len as usize;
    let mut extras = HashMap::new();
    if let Some(list) = manifest["extras"].as_array() {
        for e in list {
            let Some(id) = e["id"].as_str() else { continue };
            let (start, length) = (base as i64 + int(&e["offset"]), int(&e["length"]));
            if length <= 0 || start < base as i64 || start + length > offset as i64 {
                continue;
            }
            extras.insert(id.to_string(), &src[start as usize..(start + length) as usize]);
        }
    }
    Some((&src[..base], manifest, extras))
}

/// A JSON value as a JS number (`undefined` → NaN).
fn num(v: &Value) -> f64 {
    match v {
        Value::Number(n) => n.as_f64().unwrap_or(f64::NAN),
        Value::Bool(b) => *b as i32 as f64,
        Value::Null => 0.0,
        _ => f64::NAN,
    }
}

/// `v | 0`
fn int(v: &Value) -> i64 {
    to_int32(num(v)) as i64
}

/// `(v ?? dflt) & 15`
fn color(v: &Value, dflt: i64) -> i64 {
    if v.is_null() { dflt & 15 } else { int(v) & 15 }
}

fn truthy(v: &Value) -> bool {
    match v {
        Value::Null => false,
        Value::Bool(b) => *b,
        Value::Number(n) => n.as_f64().is_some_and(|f| f != 0.0 && !f.is_nan()),
        Value::String(s) => !s.is_empty(),
        _ => true,
    }
}

/// `_levelBuild`: Ok(None) for an empty file (no error, no data), Err for a file that is not a usable level.
pub fn level_build(src: &[u8], addr: i64) -> Result<Option<LevelInfo>, String> {
    if src.is_empty() {
        return Ok(None);
    }
    let Some((payload, manifest, extras)) = read_bin_meta(src).filter(|(_, m, _)| m["kind"] == "lv-level") else {
        return Err("LEVEL: the file is not a Level Editor project".into());
    };
    let ms = &manifest["settings"];
    let (w, h) = (int(&ms["w"]), int(&ms["h"]));
    let empty = Vec::new();
    let cells = ms["cells"].as_array().unwrap_or(&empty);
    let count = (payload.len() / SCREEN) as f64;
    let cell = |s: i64| -> Option<i64> {
        let c = cells.get(s as usize).map(num).unwrap_or(f64::NAN);
        (c >= 0.0 && c < count).then_some(c as i64)
    };
    if w < 1 || h < 1 || !cells.iter().any(|c| num(c) >= 0.0 && num(c) < count) {
        return Err("LEVEL: the level has no placed screen".into());
    }
    if w > 7 || h > 10 {
        return Err(format!("LEVEL: {w}×{h} screens is too large (max 7×10)"));
    }
    let (slots, rows, cols) = (w * h, h * 25, w * 40);
    let n_cols = cols - 39;
    let mut screens: Vec<i64> = Vec::new();
    let mut slot_screen: Vec<i64> = Vec::new();
    for s in 0..slots {
        let key = cell(s).unwrap_or(-1);
        let i = match screens.iter().position(|k| *k == key) {
            Some(i) => i,
            None => {
                screens.push(key);
                screens.len() - 1
            }
        };
        slot_screen.push(i as i64);
    }
    let objs: Vec<&Value> = ms["objects"]
        .as_array()
        .map(|a| a.iter().filter(|o| o.is_object() && num(&o["x"]) >= 0.0 && num(&o["y"]) >= 0.0 && num(&o["x"]) < (cols * 8) as f64 && num(&o["y"]) < (rows * 8) as f64).take(255).collect())
        .unwrap_or_default();
    let attr = extras.get("attr").filter(|a| a.iter().any(|v| *v != 0));
    let lvl = [color(&ms["bgColor"], 6), color(&ms["borderColor"], 0), color(&ms["mc1Color"], 5), color(&ms["mc2Color"], 13)];
    let scr_cols = ms["screenColors"].as_array();
    // a placed screen's own colours, or the level's
    let slot_cols: Vec<Option<Vec<i64>>> = (0..slots)
        .map(|s| cell(s).and_then(|c| scr_cols.and_then(|l| l.get(c as usize)).and_then(|v| v.as_array())).map(|own| own.iter().map(|v| int(v) & 15).collect()))
        .collect();
    let own_cols = slot_cols.iter().any(|c| c.is_some());
    let size = screens.len() * SCREEN + (slots as usize + 1) * 2 + rows as usize * 5 + n_cols as usize * 2 + objs.len() * 6 + if attr.is_some() { 256 } else { 0 } + if own_cols { slots as usize * 4 } else { 0 };
    if addr + size as i64 > 0x10000 {
        return Err(format!("LEVEL: {size} bytes do not fit in memory"));
    }
    let mut data = vec![0u8; size];
    for (i, key) in screens.iter().enumerate() {
        let o = i * SCREEN;
        if *key < 0 {
            data[o..o + 1000].fill(0x20);
        } else {
            let k = *key as usize * SCREEN;
            data[o..o + SCREEN].copy_from_slice(&payload[k..k + SCREEN]);
        }
    }
    let mut p = screens.len() * SCREEN;
    let mut labels: Vec<(String, f64)> = vec![("LEVEL_DATA".into(), addr as f64)];
    let mut table = |labels: &mut Vec<(String, f64)>, name: &str, n: i64, f: &dyn Fn(i64) -> i64| {
        labels.push((name.into(), (addr + p as i64) as f64));
        for i in 0..n {
            data[p] = f(i) as u8;
            p += 1;
        }
    };
    let slot_addr = |s: i64| if s < slots { addr + slot_screen[s as usize] * SCREEN as i64 } else { 0 };
    let obj = |i: i64, k: &str| int(&objs[i as usize][k]);
    table(&mut labels, "LEVEL_SLOT_LO", slots + 1, &|s| slot_addr(s));
    table(&mut labels, "LEVEL_SLOT_HI", slots + 1, &|s| slot_addr(s) >> 8);
    table(&mut labels, "LEVEL_ROW_SLOT", rows, &|r| r / 25 * w);
    table(&mut labels, "LEVEL_ROW_LO", rows, &|r| r % 25 * 40);
    table(&mut labels, "LEVEL_ROW_HI", rows, &|r| (r % 25 * 40) >> 8);
    table(&mut labels, "LEVEL_CROW_LO", rows, &|r| r % 25 * 40 + 1000);
    table(&mut labels, "LEVEL_CROW_HI", rows, &|r| (r % 25 * 40 + 1000) >> 8);
    table(&mut labels, "LEVEL_COL_SLOT", n_cols, &|c| c / 40);
    table(&mut labels, "LEVEL_COL_OFS", n_cols, &|c| c % 40);
    let n = objs.len() as i64;
    table(&mut labels, "LEVEL_OBJ_X_LO", n, &|i| obj(i, "x"));
    table(&mut labels, "LEVEL_OBJ_X_HI", n, &|i| obj(i, "x") >> 8);
    table(&mut labels, "LEVEL_OBJ_Y_LO", n, &|i| obj(i, "y"));
    table(&mut labels, "LEVEL_OBJ_Y_HI", n, &|i| obj(i, "y") >> 8);
    table(&mut labels, "LEVEL_OBJ_TYPE", n, &|i| obj(i, "t"));
    table(&mut labels, "LEVEL_OBJ_PARAM", n, &|i| obj(i, "p"));
    if let Some(a) = attr {
        table(&mut labels, "LEVEL_ATTR", 256, &|c| a.get(c as usize).copied().unwrap_or(0) as i64);
    }
    if own_cols {
        for (k, name) in ["LEVEL_SCR_BG", "LEVEL_SCR_BORDER", "LEVEL_SCR_MC1", "LEVEL_SCR_MC2"].iter().enumerate() {
            let pick = |s: i64| match &slot_cols[s as usize] {
                Some(own) => own.get(k).copied().unwrap_or(0),
                None => lvl[k],
            };
            table(&mut labels, name, slots, &pick);
        }
    }
    let mut set = |name: &str, v: f64| match labels.iter_mut().find(|(k, _)| k == name) {
        Some(e) => e.1 = v,
        None => labels.push((name.to_string(), v)),
    };
    set("LEVEL_BORDER", lvl[1] as f64);
    set("LEVEL_SCR_COLORS", own_cols as i32 as f64);
    for (name, bit) in ATTR_BITS {
        set(&format!("LEVEL_ATTR_{name}"), bit as f64);
    }
    set("LEVEL_OBJ_COUNT", n as f64);
    for (i, name) in OBJ_TYPES.iter().enumerate() {
        set(&format!("LEVEL_OBJ_T_{name}"), i as f64);
    }
    if let Some(start) = objs.iter().find(|o| int(&o["t"]) == 0) {
        set("LEVEL_START_X", num(&start["x"]));
        set("LEVEL_START_Y", num(&start["y"]));
    }
    for (name, v) in [
        ("LEVEL_W", w),
        ("LEVEL_H", h),
        ("LEVEL_COLS", cols),
        ("LEVEL_ROWS", rows),
        ("LEVEL_MAX_X", (cols - 40) * 8),
        ("LEVEL_MAX_Y", (rows - 25) * 8),
        ("LEVEL_MULTICOLOR", truthy(&ms["multicolor"]) as i64),
        ("LEVEL_BG", lvl[0]),
        ("LEVEL_MC1", lvl[2]),
        ("LEVEL_MC2", lvl[3]),
        ("LEVEL_SIZE", size as i64),
        ("LEVEL_END", (addr + size as i64) & 0xFFFF),
    ] {
        set(name, v as f64);
    }
    Ok(Some(LevelInfo { data, labels }))
}

/// `_levelRowParse`: (dst, col, color)
pub fn level_row_parse(raw: &str) -> Option<(String, String, bool)> {
    let parts: Vec<&str> = raw.split(',').map(|s| s.trim()).filter(|s| !s.is_empty()).collect();
    if parts.len() < 2 || parts.len() > 3 {
        return None;
    }
    if parts.len() == 3 && !matches!(parts[2].to_lowercase().as_str(), "color" | "colour") {
        return None;
    }
    Some((parts[0].to_string(), parts[1].to_string(), parts.len() == 3))
}

/// `_levelRowBytes`: the 40 bytes of level row X from column [col] to the pointer at dst, with the
/// source and target addresses patched into its two copy loops. `tab` = the `ROW_TABLES` values.
pub fn level_row_bytes(org: i64, dst: i64, col: i64, color: bool, tab: &[i64; 9]) -> Vec<u8> {
    let [slot_lo, slot_hi, row_slot, row_lo, row_hi, crow_lo, crow_hi, col_slot, col_ofs] = *tab;
    let (rlo, rhi) = if color { (crow_lo, crow_hi) } else { (row_lo, row_hi) };
    let mut out: Vec<u8> = Vec::new();
    let mut fix: Vec<(usize, &str, i64)> = Vec::new();
    let mut at: HashMap<&str, i64> = HashMap::new();
    macro_rules! abs {
        ($op:expr, $a:expr) => {{
            let a: i64 = $a;
            out.extend([$op, a as u8, (a >> 8) as u8]);
        }};
    }
    macro_rules! r#ref {
        ($op:expr, $name:expr, $plus:expr) => {{
            out.extend([$op, 0, 0]);
            fix.push((out.len() - 2, $name, $plus));
        }};
    }
    macro_rules! mark {
        ($name:expr) => {
            at.insert($name, org + out.len() as i64);
        };
    }
    abs!(0xAC, col);
    abs!(0xB9, col_ofs);
    r#ref!(0x8D, "ofs", 1);
    r#ref!(0x8D, "cntR", 1);
    out.extend([0x49, 0xFF, 0x18, 0x69, 41]);
    r#ref!(0x8D, "cntL", 1);
    r#ref!(0x8D, "n1", 1);
    abs!(0xBD, row_slot);
    out.push(0x18);
    abs!(0x79, col_slot);
    out.push(0xA8);
    for (side, plus) in [("lsrc", 0), ("rsrc", 1)] {
        abs!(0xB9, slot_lo + plus);
        out.push(0x18);
        abs!(0x7D, rlo);
        r#ref!(0x8D, side, 1);
        abs!(0xB9, slot_hi + plus);
        abs!(0x7D, rhi);
        r#ref!(0x8D, side, 2);
    }
    r#ref!(0xAD, "lsrc", 1);
    out.push(0x18);
    mark!("ofs");
    out.extend([0x69, 0x00]);
    r#ref!(0x8D, "lsrc", 1);
    out.extend([0x90, 0x03]);
    r#ref!(0xEE, "lsrc", 2);
    abs!(0xAD, dst);
    r#ref!(0x8D, "ldst", 1);
    out.push(0x18);
    mark!("n1");
    out.extend([0x69, 0x00]);
    r#ref!(0x8D, "rdst", 1);
    abs!(0xAD, (dst + 1) & 0xFFFF);
    r#ref!(0x8D, "ldst", 2);
    out.extend([0x69, 0x00]);
    r#ref!(0x8D, "rdst", 2);
    mark!("cntL");
    out.extend([0xA0, 0x00, 0x88]);
    mark!("lsrc");
    abs!(0xB9, 0xFFFF);
    mark!("ldst");
    abs!(0x99, 0xFFFF);
    out.extend([0x88, 0x10, 0xF7]);
    mark!("cntR");
    out.extend([0xA0, 0x00, 0xF0, 0x0A, 0x88]);
    mark!("rsrc");
    abs!(0xB9, 0xFFFF);
    mark!("rdst");
    abs!(0x99, 0xFFFF);
    out.extend([0x88, 0x10, 0xF7]);
    for (pos, name, plus) in fix {
        let a = (at[name] + plus) & 0xFFFF;
        out[pos] = a as u8;
        out[pos + 1] = (a >> 8) as u8;
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn row_routine_size() {
        assert_eq!(level_row_bytes(0, 0, 0, false, &[0; 9]).len(), 132);
    }
}
