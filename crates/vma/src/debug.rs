//! The debugger files of a build (`_buildDebuggerSidecarTexts` of www/app.js): `.sym` (KickAssembler
//! labels), `.vs` (VICE monitor labels) and `.dbg` (RetroDebugger / C64 Debugger source map).

use crate::asm::DebugInfo;
use std::cmp::Ordering;

pub struct DebugFiles {
    pub sym: String,
    pub vs: String,
    pub dbg: String,
}

/// `$xxxx`, lower case
fn addr(v: i64) -> String {
    format!("${:04x}", v & 0xFFFF)
}

fn xml(s: &str) -> String {
    s.replace('&', "&amp;").replace('<', "&lt;").replace('>', "&gt;").replace('"', "&quot;")
}

/// `String.prototype.localeCompare` of the label names (ICU root order for identifiers):
/// punctuation before digits before letters, letters case-insensitive, then lower case first.
fn locale_cmp(a: &str, b: &str) -> Ordering {
    let key = |c: char| -> (u8, u32) {
        if c.is_ascii_digit() {
            (1, c as u32)
        } else if c.is_alphabetic() {
            (2, c.to_lowercase().next().unwrap_or(c) as u32)
        } else {
            (0, c as u32)
        }
    };
    let primary = a.chars().map(key).cmp(b.chars().map(key));
    if primary != Ordering::Equal {
        return primary;
    }
    for (x, y) in a.chars().zip(b.chars()) {
        if x != y {
            return if x.is_lowercase() { Ordering::Less } else { Ordering::Greater };
        }
    }
    a.len().cmp(&b.len())
}

/// The three files; `origin` = the debugger layout's origin (lines below it are the "BASIC Stub"
/// block), `primary` = the main source's path.
pub fn debug_files(info: &DebugInfo, origin: i64, primary: &str) -> DebugFiles {
    let primary = if primary.is_empty() { "program.asm" } else { primary };
    let mut sources: Vec<String> = Vec::new();
    let mut blocks: Vec<(String, Vec<String>)> = Vec::new();
    for line in info.lines.iter().filter(|l| !l.skipped && l.size > 0) {
        let path = line.file.clone().unwrap_or_else(|| primary.to_string());
        let index = match sources.iter().position(|s| *s == path) {
            Some(i) => i,
            None => {
                sources.push(path.clone());
                sources.len() - 1
            }
        };
        let src_line = line.src_line.map(|l| l + 1).unwrap_or(index + 1);
        let name = if path == primary {
            if line.address < origin { "BASIC Stub".to_string() } else { "Main".to_string() }
        } else {
            let base = path.replace('\\', "/");
            let file = base.rsplit('/').next().unwrap_or("");
            let stem = match file.rfind('.') {
                Some(i) => &file[..i],
                None => file,
            };
            if stem.is_empty() { "Program".to_string() } else { stem.to_string() }
        };
        let entry = format!("{},{},{index},{src_line},1,{src_line},1", addr(line.address), addr(line.address + line.size - 1));
        match blocks.iter_mut().find(|(n, _)| *n == name) {
            Some((_, entries)) => entries.push(entry),
            None => blocks.push((name, vec![entry])),
        }
    }
    let mut symbols = info.symbols.clone();
    symbols.sort_by(|a, b| a.1.cmp(&b.1).then_with(|| locale_cmp(&a.0, &b.0)));

    let mut dbg = vec![r#"<C64debugger version="1.0">"#.to_string(), r#"   <Sources values="INDEX,FILE">"#.to_string()];
    dbg.extend(sources.iter().enumerate().map(|(i, s)| format!("      {i},{}", xml(s))));
    dbg.push("   </Sources>".into());
    dbg.push(String::new());
    dbg.push(r#"   <Segment name="Default" dest="" values="START,END,FILE_IDX,LINE1,COL1,LINE2,COL2">"#.into());
    for (name, entries) in &blocks {
        dbg.push(format!(r#"      <Block name="{}">"#, xml(name)));
        dbg.extend(entries.iter().map(|e| format!("         {e}")));
        dbg.push("      </Block>".into());
    }
    dbg.push("   </Segment>".into());
    dbg.push(String::new());
    dbg.push(r#"   <Labels values="SEGMENT,ADDRESS,NAME">"#.into());
    dbg.extend(symbols.iter().map(|(n, a)| format!("      Default,{},{}", addr(*a), xml(n))));
    dbg.push("   </Labels>".into());
    dbg.push(r#"   <Breakpoints values="SEGMENT,ADDRESS,ARGUMENT">"#.into());
    dbg.push("   </Breakpoints>".into());
    dbg.push(r#"   <Watchpoints values="SEGMENT,ADDRESS,SIZE,FORMAT">"#.into());
    dbg.push("   </Watchpoints>".into());
    dbg.push("</C64debugger>".into());

    DebugFiles {
        sym: symbols.iter().map(|(n, a)| format!(".label {n}={}", addr(*a))).collect::<Vec<_>>().join("\n"),
        vs: symbols.iter().map(|(n, a)| format!("al C:{} .{n}", &addr(*a)[1..])).collect::<Vec<_>>().join("\n"),
        dbg: dbg.join("\n"),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn label_order_like_locale_compare() {
        let mut v = vec!["b", "A", "_x", "a1", "a", "B"];
        v.sort_by(|a, b| locale_cmp(a, b));
        assert_eq!(v, vec!["_x", "a", "A", "a1", "b", "B"]);
    }
}
