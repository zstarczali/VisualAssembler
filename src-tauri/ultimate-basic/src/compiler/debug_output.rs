//! Debugger symbol-file exporters used by the embedded compiler.

use std::collections::BTreeMap;
use std::path::Path;

use super::MemoryMap;

fn clean_name(name: &str) -> String {
    let mut result = String::with_capacity(name.len());
    for ch in name.chars() {
        result.push(if ch.is_ascii_alphanumeric() || ch == '_' { ch } else { '_' });
    }
    if result.is_empty() || result.as_bytes()[0].is_ascii_digit() { result.insert(0, '_'); }
    result
}

fn symbols(map: &MemoryMap) -> BTreeMap<String, u16> {
    let mut result = BTreeMap::new();
    result.insert("program_start".into(), map.load_addr);
    result.insert("program_end".into(), map.load_addr.wrapping_add(map.code_size as u16));
    for var in &map.variables { result.insert(clean_name(&var.name), var.zp_addr as u16); }
    for array in &map.arrays { result.insert(clean_name(&array.name), array.base_addr); }
    for sub in &map.subroutines { result.insert(clean_name(&sub.name), sub.addr); }
    for label in &map.labels { result.insert(clean_name(&label.name), label.addr); }
    result
}

pub fn sym(map: &MemoryMap) -> String {
    symbols(map).into_iter().map(|(name, addr)| format!(".label {name} = ${addr:04x}\n")).collect()
}

pub fn vice(map: &MemoryMap) -> String {
    symbols(map).into_iter().map(|(name, addr)| format!("al C:{addr:04x} .{name}\n")).collect()
}

fn xml_escape(value: &str) -> String {
    value.replace('&', "&amp;").replace('<', "&lt;").replace('>', "&gt;").replace('"', "&quot;").replace('\'', "&apos;")
}

pub fn dbg(map: &MemoryMap, source_path: &Path) -> String {
    let start = map.load_addr;
    let end = start.wrapping_add(map.code_size.saturating_sub(1) as u16);
    let source = xml_escape(&source_path.to_string_lossy());
    let mut out = format!("<C64debugger version=\"1.0\">\n  <Sources values=\"INDEX,FILE\">\n    0,{source}\n  </Sources>\n  <Segment name=\"UltimateBasic\" values=\"START,END,FILE_IDX,LINE1,COL1,LINE2,COL2\">\n    {start:04x},{end:04x},0,1,1,1,1\n  </Segment>\n  <Labels values=\"SEGMENT,ADDRESS,NAME\">\n");
    for (name, addr) in symbols(map) {
        out.push_str(&format!("    UltimateBasic,{addr:04x},{}\n", xml_escape(&name)));
    }
    out.push_str("  </Labels>\n  <Breakpoints values=\"SEGMENT,ADDRESS,ARGUMENT\">\n  </Breakpoints>\n  <Watches values=\"SEGMENT,ADDRESS,SIZE,FORMAT\">\n  </Watches>\n</C64debugger>\n");
    out
}
