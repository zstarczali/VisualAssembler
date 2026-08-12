use super::ast::{BinOp, ColorTarget, Expr, ReuOp, Stmt, VarType};
use super::{ArrayEntry, MemoryMap, SubEntry, VarEntry};
use std::collections::HashMap;

const ZP_BASE: u8 = 0x02;
const TMP_BASE: u8 = 0x50;
const PLOT4_MASK_ZP: u8 = 0xFB;
const PLOT4_PTR_LO_ZP: u8 = 0xFC;
const PLOT4_PTR_HI_ZP: u8 = 0xFD;
const RND_SEED_ZP: u8 = 0xFE;
const CHROUT: u16 = 0xFFD2;
const VIC_BORDER: u16 = 0xD020;
const VIC_BG: u16 = 0xD021;

// ════════════════════════════════════════════════════════════════════════════
// Inline 6502 assembler — used by Stmt::AsmSource (asm { ... } blocks)
// ════════════════════════════════════════════════════════════════════════════

#[derive(Debug, Clone, Copy, PartialEq)]
enum AMode {
    Imp,
    Acc,
    Imm,
    Zp,
    Zpx,
    Zpy,
    Abs,
    Abx,
    Aby,
    Ind,
    Izx,
    Izy,
    Rel,
}

fn asm_opcode(mnem: &str, mode: AMode) -> Option<u8> {
    use AMode::*;
    Some(match (mnem, mode) {
        // ADC
        ("ADC", Imm) => 0x69,
        ("ADC", Zp) => 0x65,
        ("ADC", Zpx) => 0x75,
        ("ADC", Abs) => 0x6D,
        ("ADC", Abx) => 0x7D,
        ("ADC", Aby) => 0x79,
        ("ADC", Izx) => 0x61,
        ("ADC", Izy) => 0x71,
        // AND
        ("AND", Imm) => 0x29,
        ("AND", Zp) => 0x25,
        ("AND", Zpx) => 0x35,
        ("AND", Abs) => 0x2D,
        ("AND", Abx) => 0x3D,
        ("AND", Aby) => 0x39,
        ("AND", Izx) => 0x21,
        ("AND", Izy) => 0x31,
        // ASL
        ("ASL", Acc) => 0x0A,
        ("ASL", Imp) => 0x0A,
        ("ASL", Zp) => 0x06,
        ("ASL", Zpx) => 0x16,
        ("ASL", Abs) => 0x0E,
        ("ASL", Abx) => 0x1E,
        // Branches
        ("BCC", Rel) => 0x90,
        ("BCS", Rel) => 0xB0,
        ("BEQ", Rel) => 0xF0,
        ("BMI", Rel) => 0x30,
        ("BNE", Rel) => 0xD0,
        ("BPL", Rel) => 0x10,
        ("BVC", Rel) => 0x50,
        ("BVS", Rel) => 0x70,
        // BIT
        ("BIT", Zp) => 0x24,
        ("BIT", Abs) => 0x2C,
        // BRK
        ("BRK", Imp) => 0x00,
        // CLx / SEx
        ("CLC", Imp) => 0x18,
        ("CLD", Imp) => 0xD8,
        ("CLI", Imp) => 0x58,
        ("CLV", Imp) => 0xB8,
        ("SEC", Imp) => 0x38,
        ("SED", Imp) => 0xF8,
        ("SEI", Imp) => 0x78,
        // CMP
        ("CMP", Imm) => 0xC9,
        ("CMP", Zp) => 0xC5,
        ("CMP", Zpx) => 0xD5,
        ("CMP", Abs) => 0xCD,
        ("CMP", Abx) => 0xDD,
        ("CMP", Aby) => 0xD9,
        ("CMP", Izx) => 0xC1,
        ("CMP", Izy) => 0xD1,
        // CPX
        ("CPX", Imm) => 0xE0,
        ("CPX", Zp) => 0xE4,
        ("CPX", Abs) => 0xEC,
        // CPY
        ("CPY", Imm) => 0xC0,
        ("CPY", Zp) => 0xC4,
        ("CPY", Abs) => 0xCC,
        // DEC
        ("DEC", Zp) => 0xC6,
        ("DEC", Zpx) => 0xD6,
        ("DEC", Abs) => 0xCE,
        ("DEC", Abx) => 0xDE,
        // DEX, DEY
        ("DEX", Imp) => 0xCA,
        ("DEY", Imp) => 0x88,
        // EOR
        ("EOR", Imm) => 0x49,
        ("EOR", Zp) => 0x45,
        ("EOR", Zpx) => 0x55,
        ("EOR", Abs) => 0x4D,
        ("EOR", Abx) => 0x5D,
        ("EOR", Aby) => 0x59,
        ("EOR", Izx) => 0x41,
        ("EOR", Izy) => 0x51,
        // INC
        ("INC", Zp) => 0xE6,
        ("INC", Zpx) => 0xF6,
        ("INC", Abs) => 0xEE,
        ("INC", Abx) => 0xFE,
        // INX, INY
        ("INX", Imp) => 0xE8,
        ("INY", Imp) => 0xC8,
        // JMP
        ("JMP", Abs) => 0x4C,
        ("JMP", Ind) => 0x6C,
        // JSR
        ("JSR", Abs) => 0x20,
        // LDA
        ("LDA", Imm) => 0xA9,
        ("LDA", Zp) => 0xA5,
        ("LDA", Zpx) => 0xB5,
        ("LDA", Abs) => 0xAD,
        ("LDA", Abx) => 0xBD,
        ("LDA", Aby) => 0xB9,
        ("LDA", Izx) => 0xA1,
        ("LDA", Izy) => 0xB1,
        // LDX
        ("LDX", Imm) => 0xA2,
        ("LDX", Zp) => 0xA6,
        ("LDX", Zpy) => 0xB6,
        ("LDX", Abs) => 0xAE,
        ("LDX", Aby) => 0xBE,
        // LDY
        ("LDY", Imm) => 0xA0,
        ("LDY", Zp) => 0xA4,
        ("LDY", Zpx) => 0xB4,
        ("LDY", Abs) => 0xAC,
        ("LDY", Abx) => 0xBC,
        // LSR
        ("LSR", Acc) => 0x4A,
        ("LSR", Imp) => 0x4A,
        ("LSR", Zp) => 0x46,
        ("LSR", Zpx) => 0x56,
        ("LSR", Abs) => 0x4E,
        ("LSR", Abx) => 0x5E,
        // NOP
        ("NOP", Imp) => 0xEA,
        // ORA
        ("ORA", Imm) => 0x09,
        ("ORA", Zp) => 0x05,
        ("ORA", Zpx) => 0x15,
        ("ORA", Abs) => 0x0D,
        ("ORA", Abx) => 0x1D,
        ("ORA", Aby) => 0x19,
        ("ORA", Izx) => 0x01,
        ("ORA", Izy) => 0x11,
        // Stack
        ("PHA", Imp) => 0x48,
        ("PHP", Imp) => 0x08,
        ("PLA", Imp) => 0x68,
        ("PLP", Imp) => 0x28,
        // ROL
        ("ROL", Acc) => 0x2A,
        ("ROL", Imp) => 0x2A,
        ("ROL", Zp) => 0x26,
        ("ROL", Zpx) => 0x36,
        ("ROL", Abs) => 0x2E,
        ("ROL", Abx) => 0x3E,
        // ROR
        ("ROR", Acc) => 0x6A,
        ("ROR", Imp) => 0x6A,
        ("ROR", Zp) => 0x66,
        ("ROR", Zpx) => 0x76,
        ("ROR", Abs) => 0x6E,
        ("ROR", Abx) => 0x7E,
        // RTI, RTS
        ("RTI", Imp) => 0x40,
        ("RTS", Imp) => 0x60,
        // SBC
        ("SBC", Imm) => 0xE9,
        ("SBC", Zp) => 0xE5,
        ("SBC", Zpx) => 0xF5,
        ("SBC", Abs) => 0xED,
        ("SBC", Abx) => 0xFD,
        ("SBC", Aby) => 0xF9,
        ("SBC", Izx) => 0xE1,
        ("SBC", Izy) => 0xF1,
        // STA
        ("STA", Zp) => 0x85,
        ("STA", Zpx) => 0x95,
        ("STA", Abs) => 0x8D,
        ("STA", Abx) => 0x9D,
        ("STA", Aby) => 0x99,
        ("STA", Izx) => 0x81,
        ("STA", Izy) => 0x91,
        // STX
        ("STX", Zp) => 0x86,
        ("STX", Zpy) => 0x96,
        ("STX", Abs) => 0x8E,
        // STY
        ("STY", Zp) => 0x84,
        ("STY", Zpx) => 0x94,
        ("STY", Abs) => 0x8C,
        // Transfers
        ("TAX", Imp) => 0xAA,
        ("TAY", Imp) => 0xA8,
        ("TSX", Imp) => 0xBA,
        ("TXA", Imp) => 0x8A,
        ("TXS", Imp) => 0x9A,
        ("TYA", Imp) => 0x98,
        _ => return None,
    })
}

fn asm_mode_size(mode: AMode) -> u16 {
    use AMode::*;
    match mode {
        Imp | Acc => 1,
        Imm | Zp | Zpx | Zpy | Izx | Izy | Rel => 2,
        Abs | Abx | Aby | Ind => 3,
    }
}

fn asm_is_branch(m: &str) -> bool {
    matches!(
        m,
        "BCC" | "BCS" | "BEQ" | "BMI" | "BNE" | "BPL" | "BVC" | "BVS"
    )
}

fn asm_strip_comment(s: &str) -> &str {
    let b = s.as_bytes();
    let mut i = 0;
    while i < b.len() {
        if b[i] == b';' {
            return &s[..i];
        } // ; comment
        if b[i..].starts_with(b"//") {
            return &s[..i];
        } // // comment
        // Note: '#' is NOT a comment here — it is the immediate-mode prefix (#$07)
        i += 1;
    }
    s
}

/// Parse a numeric literal: `$hex`, `%bin`, or decimal.
/// Returns `(value, force_abs)` where `force_abs` is true when the hex form
/// has more than 2 digits (user explicitly wrote a 16-bit address).
fn asm_parse_num(s: &str) -> Option<(u16, bool)> {
    let s = s.trim();
    if s.is_empty() {
        return None;
    }
    if let Some(hex) = s.strip_prefix('$') {
        let force_abs = hex.len() > 2;
        u16::from_str_radix(hex, 16).ok().map(|v| (v, force_abs))
    } else if let Some(bin) = s.strip_prefix('%') {
        u16::from_str_radix(bin, 2).ok().map(|v| (v, v > 255))
    } else {
        s.parse::<u32>().ok().map(|v| (v as u16, v > 255))
    }
}

/// Upgrade ZP → ABS (or ZPX → ABX, ZPY → ABY) when the instruction has no
/// zero-page addressing mode (e.g. `JMP`).
fn asm_resolve_mode(mnem: &str, mode: AMode) -> AMode {
    use AMode::*;
    match mode {
        Zp if asm_opcode(mnem, Zp).is_none() => Abs,
        Zpx if asm_opcode(mnem, Zpx).is_none() => Abx,
        Zpy if asm_opcode(mnem, Zpy).is_none() => Aby,
        other => other,
    }
}

/// Parse the operand field of one assembly line.
/// Returns `(addressing_mode, Option<numeric_value>, Option<label_reference>)`.
/// For `#<label` the label_ref starts with `<`; for `#>label` it starts with `>`.
/// `*` resolves to the current instruction address.
fn asm_parse_operand(mnem: &str, s: &str) -> (AMode, Option<u16>, Option<String>) {
    use AMode::*;
    let s = s.trim();

    if s.is_empty() {
        return (Imp, None, None);
    }
    if s.eq_ignore_ascii_case("A") {
        return (Acc, None, None);
    }
    if s == "*" {
        let mode = if asm_is_branch(mnem) { Rel } else { Abs };
        return (mode, None, Some("*".to_string()));
    }

    // Immediate: #value, #<label (lo), #>label (hi)
    if let Some(imm) = s.strip_prefix('#') {
        let imm = imm.trim();
        if let Some(lab) = imm.strip_prefix('<') {
            return (Imm, None, Some(format!("<{}", lab.trim().to_uppercase())));
        }
        if let Some(lab) = imm.strip_prefix('>') {
            return (Imm, None, Some(format!(">{}", lab.trim().to_uppercase())));
        }
        if let Some((v, _)) = asm_parse_num(imm) {
            return (Imm, Some(v & 0xFF), None);
        }
        // Bare label used as immediate (treats as lo byte)
        return (Imm, None, Some(format!("<{}", imm.to_uppercase())));
    }

    // Indirect modes: ($zp,X)  ($zp),Y  ($addr)
    if s.starts_with('(') {
        if let Some(close) = s.find(')') {
            let inside = s[1..close].trim();
            let after = s[close + 1..].trim();
            if inside.ends_with(",X") || inside.ends_with(",x") {
                let addr_str = inside[..inside.len() - 2].trim();
                return if let Some((v, _)) = asm_parse_num(addr_str) {
                    (Izx, Some(v & 0xFF), None)
                } else {
                    (Izx, None, Some(addr_str.to_uppercase()))
                };
            }
            if after.eq_ignore_ascii_case(",Y") {
                return if let Some((v, _)) = asm_parse_num(inside) {
                    (Izy, Some(v & 0xFF), None)
                } else {
                    (Izy, None, Some(inside.to_uppercase()))
                };
            }
            // ($addr) — plain indirect (only valid for JMP)
            return if let Some((v, _)) = asm_parse_num(inside) {
                (Ind, Some(v), None)
            } else {
                (Ind, None, Some(inside.to_uppercase()))
            };
        }
    }

    // Indexed: value,X  or  value,Y  (must not be inside parens — handled above)
    if let Some(comma) = s.find(',') {
        let base = s[..comma].trim();
        let idx = s[comma + 1..].trim().to_uppercase();
        if idx == "X" || idx == "Y" {
            if let Some((v, force_abs)) = asm_parse_num(base) {
                let zp = v <= 255 && !force_abs;
                let mode = match idx.as_str() {
                    "X" => asm_resolve_mode(mnem, if zp { Zpx } else { Abx }),
                    _ => asm_resolve_mode(mnem, if zp { Zpy } else { Aby }),
                };
                return (mode, Some(v), None);
            }
            // label,X or label,Y → absolute indexed
            let mode = if idx == "X" { Abx } else { Aby };
            return (mode, None, Some(base.to_uppercase()));
        }
    }

    // Plain value or label reference
    if let Some((v, force_abs)) = asm_parse_num(s) {
        if asm_is_branch(mnem) {
            return (Rel, Some(v), None);
        }
        let mode = if force_abs || v > 255 {
            Abs
        } else {
            asm_resolve_mode(mnem, Zp)
        };
        return (mode, Some(v), None);
    }

    // Label reference
    let mode = if asm_is_branch(mnem) { Rel } else { Abs };
    (mode, None, Some(s.to_uppercase()))
}

/// Two-pass 6502 assembler for `asm { ... }` blocks.
/// `base_addr` is the address at which the first byte will be loaded.
/// Supports:
///   - All official 6502 mnemonics and addressing modes
///   - Local labels (`label:`)
///   - `#<label` / `#>label` for lo/hi byte of a label address
///   - Backward and forward branches / jumps
///   - Raw byte fallback: lines starting with `$`, `%`, or a digit are emitted as bytes
pub(crate) fn assemble_inline(src: &str, base_addr: u16) -> Vec<u8> {
    use AMode::*;

    struct AsmItem {
        offset: u16,
        mnem: String,
        mode: AMode,
        value: Option<u16>,
        label_ref: Option<String>,
    }

    let mut items: Vec<AsmItem> = Vec::new();
    let mut labels: HashMap<String, u16> = HashMap::new();
    let mut offset: u16 = 0;

    // ── Pass 1: parse lines, collect label addresses, build item list ──
    for raw_line in src.lines() {
        let line = asm_strip_comment(raw_line).trim();
        if line.is_empty() {
            continue;
        }

        // Detect "label:" possibly followed by an instruction on the same line
        let rest = if let Some(cp) = line.find(':') {
            let candidate = line[..cp].trim();
            if !candidate.is_empty() && candidate.chars().all(|c| c.is_alphanumeric() || c == '_') {
                labels.insert(candidate.to_uppercase(), base_addr + offset);
                line[cp + 1..].trim()
            } else {
                line
            }
        } else {
            line
        };
        if rest.is_empty() {
            continue;
        }

        // Split mnemonic from operand
        let (mnem_raw, operand) = match rest.find(|c: char| c.is_whitespace()) {
            Some(sp) => (rest[..sp].trim(), rest[sp..].trim()),
            None => (rest, ""),
        };
        let mnem = mnem_raw.to_uppercase();

        // Raw-byte mode: token starts with $, %, or a digit
        let first = mnem.as_bytes().first().copied().unwrap_or(0);
        if first == b'$' || first == b'%' || first.is_ascii_digit() {
            let full = format!("{} {}", mnem, operand);
            for tok in full.split(|c: char| c == ',' || c.is_whitespace()) {
                let tok = tok.trim();
                if tok.is_empty() {
                    continue;
                }
                if let Some((v, _)) = asm_parse_num(tok) {
                    items.push(AsmItem {
                        offset,
                        mnem: String::new(),
                        mode: Imp,
                        value: Some(v & 0xFF),
                        label_ref: None,
                    });
                    offset += 1;
                }
            }
            continue;
        }

        // Regular instruction
        let (mode, value, label_ref) = asm_parse_operand(&mnem, operand);
        let size = asm_mode_size(mode);
        items.push(AsmItem {
            offset,
            mnem,
            mode,
            value,
            label_ref,
        });
        offset += size;
    }

    // ── Pass 2: resolve labels and emit bytes ──────────────────────────
    let mut out: Vec<u8> = Vec::new();

    for item in &items {
        // Raw byte (mnem is empty)
        if item.mnem.is_empty() {
            out.push(item.value.unwrap_or(0) as u8);
            continue;
        }

        let (final_mode, final_val) = if let Some(lab) = &item.label_ref {
            let _is_lo = lab.starts_with('<');
            let is_hi = lab.starts_with('>');
            let key = lab.trim_start_matches(|c| c == '<' || c == '>').trim();
            let target = if key == "*" {
                base_addr + item.offset
            } else {
                *labels.get(key).unwrap_or(&0)
            };

            if item.mode == Imm {
                let byte = if is_hi {
                    (target >> 8) as u16
                } else {
                    target & 0xFF
                };
                (Imm, byte)
            } else if asm_is_branch(&item.mnem) {
                let pc = base_addr + item.offset + 2;
                let rel = (target as i32 - pc as i32) as i8;
                (Rel, rel as u8 as u16)
            } else {
                (Abs, target)
            }
        } else if item.mode == Rel {
            // Numeric branch operand is an absolute target address
            let target = item.value.unwrap_or(0);
            let pc = base_addr + item.offset + 2;
            let rel = (target as i32 - pc as i32) as i8;
            (Rel, rel as u8 as u16)
        } else {
            (item.mode, item.value.unwrap_or(0))
        };

        let opcode = asm_opcode(&item.mnem, final_mode).unwrap_or(0xEA); // NOP on unknown
        out.push(opcode);
        match final_mode {
            Imp | Acc => {}
            Imm | Zp | Zpx | Zpy | Izx | Izy | Rel => {
                out.push(final_val as u8);
            }
            Abs | Abx | Aby | Ind => {
                out.push(final_val as u8);
                out.push((final_val >> 8) as u8);
            }
        }
    }

    out
}

// ════════════════════════════════════════════════════════════════════════════

pub struct Codegen {
    code: Vec<u8>,
    load_addr: u16,
    vars: HashMap<String, u8>,
    var_types: HashMap<String, VarType>,
    subs: HashMap<String, u16>,
    sub_patches: Vec<(usize, String, usize)>,
    sub_params: HashMap<String, Vec<(u8, Option<VarType>)>>, // sub_name → [(zp_addr, type) per param]
    fn_ret_types: HashMap<String, VarType>, // fn_name → return type (for word/float fns)
    labels: HashMap<String, u16>,
    goto_patches: Vec<(usize, String, usize)>,
    gosub_patches: Vec<(usize, String, usize)>, // (code_pos, label_name, src_line) for gosub forward refs
    charset_base: u16,                          // base address for chardef data (default $3800)
    perm_zp: u8,
    tmp_zp: u8,
    break_patches: Vec<Vec<usize>>,
    continue_patches: Vec<Vec<usize>>,
    arrays: HashMap<String, u16>, // array_name → base address ($C000+)
    array_sizes: HashMap<String, u16>, // array_name → size in bytes
    array_ptr: u16,               // next free array slot
    rnd_seeded: bool,
    plot_zp: Option<u8>,              // base of 5-byte ZP block for plot helper
    db_base_zp: Option<u8>,           // ZP byte: hi byte of current DRAW bitmap base ($20/$60)
    db_mtx_zp: Option<u8>,            // ZP byte: hi byte of current DRAW video matrix base ($04/$44)
    plot_patches: Vec<usize>,         // code positions of JSR targets to patch
    plot_erase_patches: Vec<usize>,   // code positions of JSR targets for plot-erase helper
    plot_xor_patches: Vec<usize>,     // code positions of JSR targets for plot-xor helper
    circle_zp: Option<u8>,            // base of 24-byte ZP block for circle helper state
    circle_patches: Vec<usize>,       // code positions of JSR targets for circle helper
    circle4_zp: Option<u8>,           // base of 7-byte ZP block for circle4 helper state
    circle4_patches: Vec<usize>,      // code positions of JSR targets for circle4 helper
    line_zp: Option<u8>,              // base of 15-byte ZP block for line (Bresenham, 16-bit x)
    line_patches: Vec<usize>,         // code positions of JSR targets for drawline-set helper
    line_erase_patches: Vec<usize>,   // code positions of JSR targets for drawline-erase helper
    line_xor_patches: Vec<usize>,     // code positions of JSR targets for drawline-xor helper
    rect_zp: Option<u8>,              // base of 9-byte ZP block for rect helper
    rect_patches: Vec<usize>,         // JSR targets for rect-set helper
    rect_erase_patches: Vec<usize>,   // JSR targets for rect-erase helper
    rect_xor_patches: Vec<usize>,     // JSR targets for rect-xor helper
    sin_table_patches: Vec<usize>,    // positions of 2-byte address in LDA abs,X for sin/cos
    sin_table_addr: Option<u16>,      // absolute address of the emitted 256-byte sin table
    hex_helper_patches: Vec<usize>,   // JSR targets for print_hex helper
    bin_helper_patches: Vec<usize>,   // JSR targets for print_bin helper
    data_bytes: Vec<u8>,              // all data-statement bytes (collected in pre_scan)
    data_zp: Option<u8>,              // ZP pair: lo at zp, hi at zp+1
    data_ptr_lo_patch: Option<usize>, // code pos of LDA #lo in init sequence
    data_ptr_hi_patch: Option<usize>, // code pos of LDA #hi in init sequence
    irq_patches: Vec<(usize, usize, String)>, // (lo_byte_pos, hi_byte_pos, sub_name) for irq forward refs
    nmi_patches: Vec<(usize, usize, String)>, // (lo_byte_pos, hi_byte_pos, sub_name) for nmi forward refs
    word_arrays: std::collections::HashSet<String>, // names of word-typed arrays
    plot4_zp: Option<u8>, // base of 5-byte ZP block for plot4 helper (pnt, ptr_lo, ptr_hi, x_in, y_in)
    plot4_patches: Vec<usize>, // JSR targets for plot4 set-pixel helper
    plot4_erase_patches: Vec<usize>, // JSR targets for plot4 clear-pixel helper
    fourxfour_mode: bool, // compile-time flag: true when block pixel mode is active
    paint_zp: Option<u8>, // base of 2-byte ZP pair: stk_head_lo, stk_head_hi
    paint_stack_addr: Option<u16>, // 512-byte stack for paint flood-fill ($C000 area)
    paint_patches: Vec<usize>, // JSR targets to patch to paint_helper
    sid: Option<SidData>, // pending SID music to embed at end of output
    sid_init_addr: Option<u16>, // init address from last load sid (for music play)
    sid_play_addr: Option<u16>, // play address from last load sid (for music play)
    mplot_zp: Option<u8>, // base of 7-byte ZP block for mplot (multicolor pixel) helper
    mplot_patches: Vec<usize>, // JSR targets to patch to mplot_helper
    mouse_zp: Option<u8>,              // base of 6-byte ZP block for mouse helper
    mouse_patches: Vec<usize>,         // JSR targets to patch to mouse_read_helper
    music_wrap_patches: Vec<(usize, usize)>, // (lo_pos, hi_pos) in music play setup code
    onerr_patches: Vec<(usize, usize, String, usize)>, // (lo_pos, hi_pos, label, src_line)
    strn_zp: Option<u8>,  // 2-byte ZP ptr pair for str$() result (lo=strn_zp, hi=strn_zp+1)
    strn_tmp_zp: Option<u8>, // 1-byte perm ZP working scratch for strn_helper digit extraction
    strn_helper_patches: Vec<usize>, // code positions of JSR targets to patch to strn_helper
    charset_lowercase: bool, // compile-time mode: true after 'lowercase', false after 'uppercase'
    fn_ret_zp: Option<u8>,    // 2-byte ZP pair for fn return value (word/float fns)
    fn_ret_type: Option<VarType>, // return type of the fn currently being generated
    used_vars: std::collections::HashSet<String>, // variables that have been read
}

/// Carry SID metadata through pre_scan → compile().
struct SidData {
    load_addr: u16,
    data: Vec<u8>,
}

impl Codegen {
    pub fn new(load_addr: u16) -> Self {
        Self {
            code: vec![],
            load_addr,
            vars: HashMap::new(),
            var_types: HashMap::new(),
            subs: HashMap::new(),
            sub_patches: vec![],
            sub_params: HashMap::new(),
            fn_ret_types: HashMap::new(),
            labels: HashMap::new(),
            goto_patches: vec![],
            gosub_patches: vec![],
            charset_base: 0x3800,
            perm_zp: ZP_BASE,
            tmp_zp: TMP_BASE,
            break_patches: vec![],
            continue_patches: vec![],
            arrays: HashMap::new(),
            array_sizes: HashMap::new(),
            array_ptr: 0xC000,
            rnd_seeded: false,
            plot_zp: None,
            db_base_zp: None,
            db_mtx_zp: None,
            plot_patches: vec![],
            plot_erase_patches: vec![],
            plot_xor_patches: vec![],
            circle_zp: None,
            circle_patches: vec![],
            circle4_zp: None,
            circle4_patches: vec![],
            line_zp: None,
            line_patches: vec![],
            line_erase_patches: vec![],
            line_xor_patches: vec![],
            rect_zp: None,
            rect_patches: vec![],
            rect_erase_patches: vec![],
            rect_xor_patches: vec![],
            sin_table_patches: vec![],
            sin_table_addr: None,
            hex_helper_patches: vec![],
            bin_helper_patches: vec![],
            data_bytes: vec![],
            data_zp: None,
            data_ptr_lo_patch: None,
            data_ptr_hi_patch: None,
            irq_patches: vec![],
            nmi_patches: vec![],
            word_arrays: std::collections::HashSet::new(),
            plot4_zp: None,
            plot4_patches: vec![],
            plot4_erase_patches: vec![],
            fourxfour_mode: false,
            paint_zp: None,
            paint_stack_addr: None,
            paint_patches: vec![],
            sid: None,
            sid_init_addr: None,
            sid_play_addr: None,
            mplot_zp: None,
            mplot_patches: vec![],
            mouse_zp: None,
            mouse_patches: vec![],
            music_wrap_patches: vec![],
            onerr_patches: vec![],
            strn_zp: None,
            strn_tmp_zp: None,
            strn_helper_patches: vec![],
            charset_lowercase: false,
            fn_ret_zp: None,
            fn_ret_type: None,
            used_vars: std::collections::HashSet::new(),
        }
    }

    /// Recursively check whether any Plot statement exists anywhere in the AST.
    fn has_plot_stmt(stmts: &[Stmt]) -> bool {
        for stmt in stmts {
            match stmt {
                Stmt::Plot(..)
                | Stmt::Circle { .. }
                | Stmt::PlotErase(..)
                | Stmt::PlotXor(..)
                | Stmt::Paint(..)
                | Stmt::Rect(..)
                | Stmt::RectErase(..)
                | Stmt::RectXor(..)
                | Stmt::LineErase { .. }
                | Stmt::LineXor { .. } => return true,
                Stmt::SubDef(_, _, body) | Stmt::FnDef(_, _, _, body) => {
                    if Self::has_plot_stmt(body) {
                        return true;
                    }
                }
                Stmt::If(_, then_b, else_b) => {
                    if Self::has_plot_stmt(then_b) {
                        return true;
                    }
                    if let Some(eb) = else_b {
                        if Self::has_plot_stmt(eb) {
                            return true;
                        }
                    }
                }
                Stmt::ForLoop { body, .. } | Stmt::Loop(_, body) | Stmt::WhileLoop(_, body) => {
                    if Self::has_plot_stmt(body) {
                        return true;
                    }
                }
                Stmt::RepeatLoop(body, _) => {
                    if Self::has_plot_stmt(body) {
                        return true;
                    }
                }
                _ => {}
            }
        }
        false
    }

    /// Recursively check for statements that read/redirect the bitmap draw base:
    /// `gcls`, a hires/multicolor `graphics on`, or `flip`.
    fn has_bitmap_base_use(stmts: &[Stmt]) -> bool {
        for stmt in stmts {
            match stmt {
                Stmt::Gcls | Stmt::Flip => return true,
                Stmt::Graphics {
                    on: true,
                    block: false,
                    ..
                } => return true,
                Stmt::SubDef(_, _, body) | Stmt::FnDef(_, _, _, body) => {
                    if Self::has_bitmap_base_use(body) {
                        return true;
                    }
                }
                Stmt::If(_, then_b, else_b) => {
                    if Self::has_bitmap_base_use(then_b) {
                        return true;
                    }
                    if let Some(eb) = else_b {
                        if Self::has_bitmap_base_use(eb) {
                            return true;
                        }
                    }
                }
                Stmt::ForLoop { body, .. } | Stmt::Loop(_, body) | Stmt::WhileLoop(_, body) => {
                    if Self::has_bitmap_base_use(body) {
                        return true;
                    }
                }
                Stmt::RepeatLoop(body, _) => {
                    if Self::has_bitmap_base_use(body) {
                        return true;
                    }
                }
                _ => {}
            }
        }
        false
    }

    /// Recursively check whether any Circle statement exists anywhere in the AST.
    fn has_circle_stmt(stmts: &[Stmt]) -> bool {
        for stmt in stmts {
            match stmt {
                Stmt::Circle { .. } => return true,
                Stmt::SubDef(_, _, body) | Stmt::FnDef(_, _, _, body) => {
                    if Self::has_circle_stmt(body) {
                        return true;
                    }
                }
                Stmt::If(_, then_b, else_b) => {
                    if Self::has_circle_stmt(then_b) {
                        return true;
                    }
                    if let Some(eb) = else_b {
                        if Self::has_circle_stmt(eb) {
                            return true;
                        }
                    }
                }
                Stmt::ForLoop { body, .. } | Stmt::Loop(_, body) | Stmt::WhileLoop(_, body) => {
                    if Self::has_circle_stmt(body) {
                        return true;
                    }
                }
                Stmt::RepeatLoop(body, _) => {
                    if Self::has_circle_stmt(body) {
                        return true;
                    }
                }
                _ => {}
            }
        }
        false
    }

    /// Recursively check whether any Mplot statement exists anywhere in the AST.
    fn has_mplot_stmt(stmts: &[Stmt]) -> bool {
        for stmt in stmts {
            match stmt {
                Stmt::Mplot { .. } => return true,
                Stmt::SubDef(_, _, body) | Stmt::FnDef(_, _, _, body) => {
                    if Self::has_mplot_stmt(body) {
                        return true;
                    }
                }
                Stmt::If(_, then_b, else_b) => {
                    if Self::has_mplot_stmt(then_b) {
                        return true;
                    }
                    if let Some(eb) = else_b {
                        if Self::has_mplot_stmt(eb) {
                            return true;
                        }
                    }
                }
                Stmt::ForLoop { body, .. } | Stmt::Loop(_, body) | Stmt::WhileLoop(_, body) => {
                    if Self::has_mplot_stmt(body) {
                        return true;
                    }
                }
                Stmt::RepeatLoop(body, _) => {
                    if Self::has_mplot_stmt(body) {
                        return true;
                    }
                }
                _ => {}
            }
        }
        false
    }

    /// Recursively check whether any Expr::StrN exists in an expression tree.
    fn expr_has_strn(expr: &Expr) -> bool {
        match expr {
            Expr::StrN(_) => true,
            Expr::BinOp(l, _, r) => Self::expr_has_strn(l) || Self::expr_has_strn(r),
            Expr::Not(e)
            | Expr::Abs(e)
            | Expr::Sgn(e)
            | Expr::StrLen(e)
            | Expr::Asc(e)
            | Expr::ChrStr(e)
            | Expr::Sin(e)
            | Expr::Cos(e)
            | Expr::HexFmt(e)
            | Expr::BinFmt(e)
            | Expr::FixedToInt(e)
            | Expr::Peek(e)
            | Expr::Peek16(e)
            | Expr::Spc(e)
            | Expr::Tab(e)
            | Expr::Val(e)
            | Expr::SpriteX(e)
            | Expr::SpriteY(e)
            | Expr::RndN(e) => Self::expr_has_strn(e),
            Expr::DecFmt(e, w) => Self::expr_has_strn(e) || Self::expr_has_strn(w),
            Expr::Min(a, b) | Expr::Max(a, b) => Self::expr_has_strn(a) || Self::expr_has_strn(b),
            Expr::Clamp(a, b, c) => {
                Self::expr_has_strn(a) || Self::expr_has_strn(b) || Self::expr_has_strn(c)
            }
            _ => false,
        }
    }

    /// Recursively check whether any Expr::StrN exists anywhere in the AST.
    fn has_strn_expr(stmts: &[Stmt]) -> bool {
        for stmt in stmts {
            let found = match stmt {
                Stmt::Print { args, .. } | Stmt::PrintAt { args, .. } => {
                    args.iter().any(|a| Self::expr_has_strn(a))
                }
                Stmt::Assign(_, e) => Self::expr_has_strn(e),
                Stmt::VarDecl { expr, .. } => Self::expr_has_strn(expr),
                Stmt::SubDef(_, _, body) | Stmt::FnDef(_, _, _, body) => Self::has_strn_expr(body),
                Stmt::If(cond, then_b, else_b) => {
                    Self::expr_has_strn(cond)
                        || Self::has_strn_expr(then_b)
                        || else_b
                            .as_ref()
                            .map(|b| Self::has_strn_expr(b))
                            .unwrap_or(false)
                }
                Stmt::ForLoop { body, .. } | Stmt::Loop(_, body) | Stmt::WhileLoop(_, body) => {
                    Self::has_strn_expr(body)
                }
                Stmt::RepeatLoop(body, _) => Self::has_strn_expr(body),
                Stmt::Select {
                    expr,
                    cases,
                    else_body,
                } => {
                    Self::expr_has_strn(expr)
                        || cases.iter().any(|(_, b)| Self::has_strn_expr(b))
                        || else_body
                            .as_ref()
                            .map(|b| Self::has_strn_expr(b))
                            .unwrap_or(false)
                }
                _ => false,
            };
            if found {
                return true;
            }
        }
        false
    }

    fn expr_has_mouse(expr: &Expr) -> bool {
        match expr {
            Expr::MouseX | Expr::MouseY => true,
            Expr::BinOp(l, _, r) => Self::expr_has_mouse(l) || Self::expr_has_mouse(r),
            Expr::Not(e)
            | Expr::Abs(e)
            | Expr::Sgn(e)
            | Expr::StrLen(e)
            | Expr::Asc(e)
            | Expr::ChrStr(e)
            | Expr::Sin(e)
            | Expr::Cos(e)
            | Expr::HexFmt(e)
            | Expr::BinFmt(e)
            | Expr::FixedToInt(e)
            | Expr::Peek(e)
            | Expr::Peek16(e)
            | Expr::Spc(e)
            | Expr::Tab(e)
            | Expr::Val(e)
            | Expr::StrN(e)
            | Expr::SpriteX(e)
            | Expr::SpriteY(e)
            | Expr::RndN(e) => Self::expr_has_mouse(e),
            Expr::DecFmt(e, w) => Self::expr_has_mouse(e) || Self::expr_has_mouse(w),
            Expr::Min(a, b) | Expr::Max(a, b) => Self::expr_has_mouse(a) || Self::expr_has_mouse(b),
            Expr::Clamp(a, b, c) => {
                Self::expr_has_mouse(a) || Self::expr_has_mouse(b) || Self::expr_has_mouse(c)
            }
            _ => false,
        }
    }

    fn has_mouse_expr(stmts: &[Stmt]) -> bool {
        for stmt in stmts {
            let found = match stmt {
                Stmt::Print { args, .. } | Stmt::PrintAt { args, .. } => {
                    args.iter().any(|a| Self::expr_has_mouse(a))
                }
                Stmt::Assign(_, e) => Self::expr_has_mouse(e),
                Stmt::VarDecl { expr, .. } => Self::expr_has_mouse(expr),
                Stmt::SubDef(_, _, body) | Stmt::FnDef(_, _, _, body) => Self::has_mouse_expr(body),
                Stmt::If(cond, then_b, else_b) => {
                    Self::expr_has_mouse(cond)
                        || Self::has_mouse_expr(then_b)
                        || else_b
                            .as_ref()
                            .map(|b| Self::has_mouse_expr(b))
                            .unwrap_or(false)
                }
                Stmt::ForLoop { body, .. } | Stmt::Loop(_, body) | Stmt::WhileLoop(_, body) => {
                    Self::has_mouse_expr(body)
                }
                Stmt::RepeatLoop(body, _) => Self::has_mouse_expr(body),
                Stmt::Select {
                    expr,
                    cases,
                    else_body,
                } => {
                    Self::expr_has_mouse(expr)
                        || cases.iter().any(|(_, b)| Self::has_mouse_expr(b))
                        || else_body
                            .as_ref()
                            .map(|b| Self::has_mouse_expr(b))
                            .unwrap_or(false)
                }
                _ => false,
            };
            if found {
                return true;
            }
        }
        false
    }

    /// Recursively check whether any Line statement exists anywhere in the AST.
    fn has_line_stmt(stmts: &[Stmt]) -> bool {
        for stmt in stmts {
            match stmt {
                Stmt::Line { .. } | Stmt::LineErase { .. } | Stmt::LineXor { .. } => return true,
                Stmt::SubDef(_, _, body) | Stmt::FnDef(_, _, _, body) => {
                    if Self::has_line_stmt(body) {
                        return true;
                    }
                }
                Stmt::If(_, then_b, else_b) => {
                    if Self::has_line_stmt(then_b) {
                        return true;
                    }
                    if let Some(eb) = else_b {
                        if Self::has_line_stmt(eb) {
                            return true;
                        }
                    }
                }
                Stmt::ForLoop { body, .. } | Stmt::Loop(_, body) | Stmt::WhileLoop(_, body) => {
                    if Self::has_line_stmt(body) {
                        return true;
                    }
                }
                Stmt::RepeatLoop(body, _) => {
                    if Self::has_line_stmt(body) {
                        return true;
                    }
                }
                _ => {}
            }
        }
        false
    }

    /// Recursively check whether any Rect/RectErase/RectXor statement exists anywhere in the AST.
    fn has_rect_stmt(stmts: &[Stmt]) -> bool {
        for stmt in stmts {
            match stmt {
                Stmt::Rect(..) | Stmt::RectErase(..) | Stmt::RectXor(..) => return true,
                Stmt::SubDef(_, _, body) | Stmt::FnDef(_, _, _, body) => {
                    if Self::has_rect_stmt(body) { return true; }
                }
                Stmt::If(_, then_b, else_b) => {
                    if Self::has_rect_stmt(then_b) { return true; }
                    if let Some(eb) = else_b {
                        if Self::has_rect_stmt(eb) { return true; }
                    }
                }
                Stmt::ForLoop { body, .. } | Stmt::Loop(_, body) | Stmt::WhileLoop(_, body) => {
                    if Self::has_rect_stmt(body) { return true; }
                }
                Stmt::RepeatLoop(body, _) => {
                    if Self::has_rect_stmt(body) { return true; }
                }
                _ => {}
            }
        }
        false
    }

    /// Recursively check whether any Plot4 or Plot4Erase statement exists anywhere in the AST.
    fn has_plot4_stmt(stmts: &[Stmt]) -> bool {
        for stmt in stmts {
            match stmt {
                Stmt::Plot4(..) | Stmt::Plot4Erase(..) | Stmt::Circle4 { .. } => return true,
                Stmt::SubDef(_, _, body) | Stmt::FnDef(_, _, _, body) => {
                    if Self::has_plot4_stmt(body) {
                        return true;
                    }
                }
                Stmt::If(_, then_b, else_b) => {
                    if Self::has_plot4_stmt(then_b) {
                        return true;
                    }
                    if let Some(eb) = else_b {
                        if Self::has_plot4_stmt(eb) {
                            return true;
                        }
                    }
                }
                Stmt::ForLoop { body, .. } | Stmt::Loop(_, body) | Stmt::WhileLoop(_, body) => {
                    if Self::has_plot4_stmt(body) {
                        return true;
                    }
                }
                Stmt::RepeatLoop(body, _) => {
                    if Self::has_plot4_stmt(body) {
                        return true;
                    }
                }
                _ => {}
            }
        }
        false
    }

    fn has_circle4_stmt(stmts: &[Stmt]) -> bool {
        for stmt in stmts {
            match stmt {
                Stmt::Circle4 { .. } => return true,
                Stmt::SubDef(_, _, body) | Stmt::FnDef(_, _, _, body) => {
                    if Self::has_circle4_stmt(body) {
                        return true;
                    }
                }
                Stmt::If(_, then_b, else_b) => {
                    if Self::has_circle4_stmt(then_b) {
                        return true;
                    }
                    if let Some(eb) = else_b {
                        if Self::has_circle4_stmt(eb) {
                            return true;
                        }
                    }
                }
                Stmt::ForLoop { body, .. } | Stmt::Loop(_, body) | Stmt::WhileLoop(_, body) => {
                    if Self::has_circle4_stmt(body) {
                        return true;
                    }
                }
                Stmt::RepeatLoop(body, _) => {
                    if Self::has_circle4_stmt(body) {
                        return true;
                    }
                }
                _ => {}
            }
        }
        false
    }

    /// Recursively check whether any Paint statement exists anywhere in the AST.
    fn has_paint_stmt(stmts: &[Stmt]) -> bool {
        for stmt in stmts {
            match stmt {
                Stmt::Paint(..) => return true,
                Stmt::SubDef(_, _, body) | Stmt::FnDef(_, _, _, body) => {
                    if Self::has_paint_stmt(body) {
                        return true;
                    }
                }
                Stmt::If(_, then_b, else_b) => {
                    if Self::has_paint_stmt(then_b) {
                        return true;
                    }
                    if let Some(eb) = else_b {
                        if Self::has_paint_stmt(eb) {
                            return true;
                        }
                    }
                }
                Stmt::ForLoop { body, .. } | Stmt::Loop(_, body) | Stmt::WhileLoop(_, body) => {
                    if Self::has_paint_stmt(body) {
                        return true;
                    }
                }
                Stmt::RepeatLoop(body, _) => {
                    if Self::has_paint_stmt(body) {
                        return true;
                    }
                }
                _ => {}
            }
        }
        false
    }

    fn has_data_or_read(stmts: &[Stmt]) -> bool {
        for stmt in stmts {
            match stmt {
                Stmt::Data(_) | Stmt::Read(_) => return true,
                Stmt::SubDef(_, _, body) | Stmt::FnDef(_, _, _, body) => {
                    if Self::has_data_or_read(body) {
                        return true;
                    }
                }
                Stmt::If(_, then_b, else_b) => {
                    if Self::has_data_or_read(then_b) {
                        return true;
                    }
                    if let Some(eb) = else_b {
                        if Self::has_data_or_read(eb) {
                            return true;
                        }
                    }
                }
                Stmt::ForLoop { body, .. } | Stmt::Loop(_, body) | Stmt::WhileLoop(_, body) => {
                    if Self::has_data_or_read(body) {
                        return true;
                    }
                }
                Stmt::RepeatLoop(body, _) => {
                    if Self::has_data_or_read(body) {
                        return true;
                    }
                }
                _ => {}
            }
        }
        false
    }

    fn collect_data_bytes(stmts: &[Stmt]) -> Vec<u8> {
        let mut bytes = Vec::new();
        for stmt in stmts {
            match stmt {
                Stmt::Data(items) => {
                    for item in items {
                        if let Expr::Number(n) = item {
                            bytes.push(*n as u8);
                        }
                    }
                }
                Stmt::SubDef(_, _, body) | Stmt::FnDef(_, _, _, body) => bytes.extend(Self::collect_data_bytes(body)),
                Stmt::If(_, then_b, else_b) => {
                    bytes.extend(Self::collect_data_bytes(then_b));
                    if let Some(eb) = else_b {
                        bytes.extend(Self::collect_data_bytes(eb));
                    }
                }
                Stmt::ForLoop { body, .. } | Stmt::Loop(_, body) | Stmt::WhileLoop(_, body) => {
                    bytes.extend(Self::collect_data_bytes(body));
                }
                Stmt::RepeatLoop(body, _) => {
                    bytes.extend(Self::collect_data_bytes(body));
                }
                _ => {}
            }
        }
        bytes
    }

    /// Pre-scan: allocate ZP slots for sub params, register arrays, reserve plot ZP.
    /// Must run before gen_stmt so that reserved slots precede regular vars in ZP.
    fn pre_scan(&mut self, stmts: &[Stmt]) {
        // Reserve 6 ZP bytes for the plot helper (X_lo, X_hi, Y, temp, ptr_lo, ptr_hi).
        // Also needed when line is used (drawline calls the plot helper).
        if Self::has_plot_stmt(stmts) || Self::has_line_stmt(stmts) {
            let zp = self.perm_zp;
            self.perm_zp += 6;
            self.plot_zp = Some(zp);
        }

        // Reserve 2 ZP bytes for the bitmap draw base: +0 = bitmap hi byte ($20/$60),
        // +1 = video matrix hi byte ($04/$44). Routes all pixel/gcls writes through a
        // runtime base so `flip` can redirect drawing to the hidden buffer. Initialised
        // to the default single-buffer layout ($2000 / $0400) at program start.
        if Self::has_plot_stmt(stmts)
            || Self::has_line_stmt(stmts)
            || Self::has_circle_stmt(stmts)
            || Self::has_rect_stmt(stmts)
            || Self::has_paint_stmt(stmts)
            || Self::has_bitmap_base_use(stmts)
        {
            let zp = self.perm_zp;
            self.perm_zp += 2;
            self.db_base_zp = Some(zp);
            self.db_mtx_zp = Some(zp + 1);
        }

        // Reserve 24 ZP bytes for the midpoint circle helper.
        if Self::has_circle_stmt(stmts) {
            let zp = self.perm_zp;
            self.perm_zp += 24;
            self.circle_zp = Some(zp);
        }

        // Reserve 15 ZP bytes for the Bresenham line helper.
        // Layout: cx_lo,cx_hi,cy, x2_lo,x2_hi,y2, dx_lo,dx_hi,dy, sx,sy, err_lo,err_hi,e2_lo,e2_hi
        if Self::has_line_stmt(stmts) {
            let zp = self.perm_zp;
            self.perm_zp += 15;
            self.line_zp = Some(zp);
        }

        // Reserve 9 ZP bytes for the rect helper.
        // Layout: x1_lo,x1_hi,y1, x2_lo,x2_hi,y2, cx_lo,cx_hi,cy
        if Self::has_rect_stmt(stmts) {
            let zp = self.perm_zp;
            self.perm_zp += 9;
            self.rect_zp = Some(zp);
        }

        // Reserve 7 ZP bytes for the mplot helper (x, y, color, scratch_a, ptr_lo, ptr_hi, scratch_b).
        if Self::has_mplot_stmt(stmts) {
            let zp = self.perm_zp;
            self.perm_zp += 7;
            self.mplot_zp = Some(zp);
        }

        // Reserve 3 ZP bytes for str$(): 2-byte ptr pair + 1 scratch byte for digit extraction.
        if Self::has_strn_expr(stmts) {
            let zp = self.perm_zp;
            self.perm_zp += 3; // lo=zp, hi=zp+1, scratch=zp+2
            self.strn_zp = Some(zp);
            self.strn_tmp_zp = Some(zp + 2);
        }

        // Reserve 8 ZP bytes for the mouse helper: accum_x, accum_y, prev_raw_x,
        // prev_raw_y, init_flag, tmp, accum_x_hi.
        if Self::has_mouse_expr(stmts) {
            let zp = self.perm_zp;
            self.perm_zp += 8;
            self.mouse_zp = Some(zp);
        }

        // Reserve 2 ZP bytes for the data pointer (lo/hi) if data/read is used.
        if Self::has_data_or_read(stmts) {
            let zp = self.perm_zp;
            self.perm_zp += 2;
            self.data_zp = Some(zp);
            self.data_bytes = Self::collect_data_bytes(stmts);
        }

        // The 4×4 block pixel helper uses fixed high ZP scratch ($FB-$FD), which is
        // the documented user-safe area on the C64.
        if Self::has_plot4_stmt(stmts) {
            self.plot4_zp = Some(PLOT4_MASK_ZP);
        }

        if Self::has_circle4_stmt(stmts) {
            let zp = self.perm_zp;
            self.perm_zp += 7;
            self.circle4_zp = Some(zp);
        }

        // Reserve 2 ZP bytes (stk_head_lo, stk_head_hi) and a 512-byte stack in
        // $C000 area for the paint flood-fill helper.
        if Self::has_paint_stmt(stmts) {
            let zp = self.perm_zp;
            self.perm_zp += 2;
            self.paint_zp = Some(zp);
            self.paint_stack_addr = Some(self.array_ptr);
            self.array_ptr += 512;
        }

        for stmt in stmts {
            match stmt {
                Stmt::SubDef(name, params, _) | Stmt::FnDef(name, params, _, _) => {
                    let mut addrs = vec![];
                    for (_, ptype) in params {
                        let addr = self.perm_zp;
                        self.perm_zp += 2; // 2 bytes per slot (pointer/value pair)
                        addrs.push((addr, ptype.clone()));
                    }
                    self.sub_params.insert(name.clone(), addrs);
                }
                Stmt::VarDecl {
                    name,
                    vtype: Some(VarType::Array),
                    expr,
                    ..
                } => {
                    let size = if let Expr::Number(n) = expr {
                        *n as u16
                    } else {
                        0
                    };
                    self.arrays.insert(name.clone(), self.array_ptr);
                    self.array_sizes.insert(name.clone(), size);
                    self.array_ptr += size;
                }
                Stmt::VarDecl {
                    name,
                    vtype: Some(VarType::WordArray),
                    expr,
                    ..
                } => {
                    let size = if let Expr::Number(n) = expr {
                        *n as u16
                    } else {
                        0
                    };
                    self.arrays.insert(name.clone(), self.array_ptr);
                    self.array_sizes.insert(name.clone(), size * 2); // 2 bytes per word element
                    self.word_arrays.insert(name.clone());
                    self.array_ptr += size * 2;
                }
                Stmt::LoadSid {
                    load_addr,
                    init_addr,
                    play_addr,
                    data,
                    ..
                } => {
                    // Store SID info; the actual bytes are embedded at the very end of compile().
                    // If multiple `load sid` statements exist, the last one wins.
                    self.sid_init_addr = Some(*init_addr);
                    self.sid_play_addr = Some(*play_addr);
                    self.sid = Some(SidData {
                        load_addr: *load_addr,
                        data: data.clone(),
                    });
                }
                _ => {}
            }
        }

        // Allocate 2-byte ZP pair for word/float fn return values
        for stmt in stmts {
            if let Stmt::FnDef(name, _, Some(ret_ty @ (VarType::Word | VarType::Float)), _) = stmt {
                if self.fn_ret_zp.is_none() {
                    self.fn_ret_zp = Some(self.perm_zp);
                    self.perm_zp += 2;
                }
                self.fn_ret_types.insert(name.clone(), ret_ty.clone());
            }
        }
    }

    fn emit(&mut self, byte: u8) {
        self.code.push(byte);
    }

    fn emit16(&mut self, val: u16) {
        self.emit(val as u8);
        self.emit((val >> 8) as u8);
    }

    fn current_addr(&self) -> u16 {
        self.load_addr + self.code.len() as u16
    }

    fn alloc_var(&mut self, name: &str) -> u8 {
        if let Some(&addr) = self.vars.get(name) {
            return addr;
        }
        let addr = self.perm_zp;
        self.perm_zp += 2; // 16-bit vars (lo/hi)
        self.vars.insert(name.to_string(), addr);
        addr
    }

    fn var_addr(&self, name: &str) -> Option<u8> {
        self.vars.get(name).copied()
    }

    fn mark_used(&mut self, name: &str) {
        self.used_vars.insert(name.to_string());
    }

    // Helpers for 16-bit register operations (reserved for future use)
    #[allow(dead_code)]
    fn load_imm16(&mut self, val: i16) {
        let lo = val as u8;
        let hi = (val >> 8) as u8;
        self.emit(0xA9);
        self.emit(lo); // LDA #lo
        self.emit(0xAA); // TAX -> now A=lo, but we need A=lo X=hi
        self.emit(0xA9);
        self.emit(lo); // LDA #lo
        self.emit(0xA2);
        self.emit(hi); // LDX #hi
    }

    #[allow(dead_code)]
    fn store_ax_to_var(&mut self, zp: u8) {
        self.emit(0x85);
        self.emit(zp); // STA zp (lo)
        self.emit(0x86);
        self.emit(zp + 1); // STX zp+1 (hi)
    }

    #[allow(dead_code)]
    fn load_var_to_ax(&mut self, zp: u8) {
        self.emit(0xA5);
        self.emit(zp); // LDA zp
        self.emit(0xA6);
        self.emit(zp + 1); // LDX zp+1
    }

    // Evaluate expression, result in A (lo byte only for simplicity)
    fn eval_expr(&mut self, expr: &Expr) {
        match expr {
            Expr::Number(n) => {
                self.emit(0xA9);
                self.emit(*n as u8); // LDA #n
            }
            Expr::StringLit(_) => {
                // strings handled separately in print
                self.emit(0xA9);
                self.emit(0x00);
            }
            Expr::Var(name) => {
                self.mark_used(name);
                if let Some(zp) = self.var_addr(name) {
                    self.emit(0xA5);
                    self.emit(zp); // LDA zp
                } else {
                    self.emit(0xA9);
                    self.emit(0x00);
                }
            }
            Expr::Not(expr) => {
                // not expr → 1 if expr==0, 0 if expr>=1 (any non-zero value)
                let expr = expr.clone();
                self.eval_expr(&expr);
                self.emit(0xC9);
                self.emit(0x01); // CMP #1 — carry set if A >= 1 (non-zero)
                self.emit(0xB0); // BCS → non-zero: return 0
                self.emit(0x05); // +5  (skips LDA#1 + JMP = 5 bytes)
                // zero path: return 1
                self.emit(0xA9);
                self.emit(0x01); // LDA #1
                self.emit(0x4C);
                let jmp = self.code.len();
                self.emit16(0x0000);
                // non-zero path: return 0
                self.emit(0xA9);
                self.emit(0x00);
                let end = self.current_addr();
                self.patch_abs(jmp, end);
            }
            Expr::ReuPresent => {
                // Write $55 to $DF04, read back; write $AA, read back.
                // Both must match → REU present (returns 1), else returns 0.
                // No ZP scratch needed; result in A.
                //
                // offset  0: A9 55        LDA #$55
                // offset  2: 8D 04 DF     STA $DF04
                // offset  5: AD 04 DF     LDA $DF04
                // offset  8: C9 55        CMP #$55
                // offset 10: D0 0C        BNE fail    (+12 → offset 24)
                // offset 12: A9 AA        LDA #$AA
                // offset 14: 8D 04 DF     STA $DF04
                // offset 17: AD 04 DF     LDA $DF04
                // offset 20: C9 AA        CMP #$AA
                // offset 22: F0 05        BEQ ok      (+5  → offset 29)
                // offset 24: A9 00        LDA #0      (fail)
                // offset 26: 4C ?? ??     JMP done
                // offset 29: A9 01        LDA #1      (ok)
                // offset 31:              (done)
                self.emit(0xA9);
                self.emit(0x55); // LDA #$55
                self.emit(0x8D);
                self.emit16(0xDF04); // STA $DF04
                self.emit(0xAD);
                self.emit16(0xDF04); // LDA $DF04
                self.emit(0xC9);
                self.emit(0x55); // CMP #$55
                self.emit(0xD0);
                self.emit(0x0C); // BNE fail
                self.emit(0xA9);
                self.emit(0xAA); // LDA #$AA
                self.emit(0x8D);
                self.emit16(0xDF04); // STA $DF04
                self.emit(0xAD);
                self.emit16(0xDF04); // LDA $DF04
                self.emit(0xC9);
                self.emit(0xAA); // CMP #$AA
                self.emit(0xF0);
                self.emit(0x05); // BEQ ok
                self.emit(0xA9);
                self.emit(0x00); // fail: LDA #0
                self.emit(0x4C); // JMP done (abs)
                let jmp_patch = self.code.len();
                self.emit(0x00);
                self.emit(0x00); // patch later
                self.emit(0xA9);
                self.emit(0x01); // ok: LDA #1
                // patch JMP target (current position = done)
                let done_addr = self.current_addr();
                self.code[jmp_patch] = (done_addr & 0xFF) as u8;
                self.code[jmp_patch + 1] = (done_addr >> 8) as u8;
            }
            Expr::Turbo => {
                // Read $D031, isolate bits 0-3 (speed index).
                // Return 1 if non-zero (turbo active), 0 if zero (1 MHz / off).
                //
                // AD 31 D0  LDA $D031
                // 29 0F     AND #$0F       ; isolate speed bits
                // F0 02     BEQ done       ; if 0, A is already 0
                // A9 01     LDA #1         ; turbo on
                // done:
                self.emit(0xAD);
                self.emit16(0xD031); // LDA $D031
                self.emit(0x29);
                self.emit(0x0F); // AND #$0F
                self.emit(0xF0);
                self.emit(0x02); // BEQ done
                self.emit(0xA9);
                self.emit(0x01); // LDA #1  (done skips here)
                // done: (A = 0 or 1)
            }
            Expr::Getch => {
                let loop_addr = self.current_addr();
                self.emit(0xA9);
                self.emit(0xFF); // LDA #$FF
                self.emit(0x85);
                self.emit(0x91); // STA $91
                self.emit(0x20);
                self.emit16(0xFFE4); // JSR $FFE4
                self.emit(0xC9);
                self.emit(0x00);
                self.emit(0xF0);
                let beq_zero = self.code.len();
                self.emit(0x00);
                self.patch_bxx(beq_zero, loop_addr);

                // Ignore RUN/STOP key (GETIN returns $03 on C64).
                self.emit(0xC9);
                self.emit(0x03); // CMP #$03
                self.emit(0xF0);
                let beq_stop = self.code.len();
                self.emit(0x00);
                self.patch_bxx(beq_stop, loop_addr);

                // Preserve key in A while clearing RUN/STOP flag to avoid BREAK on return.
                self.emit(0xAA); // TAX
                self.emit(0xA9);
                self.emit(0xFF); // LDA #$FF
                self.emit(0x85);
                self.emit(0x91); // STA $91
                self.emit(0x8A); // TXA
            }
            Expr::Inkey => {
                // Non-blocking GETIN: single call, returns 0 if no key pressed.
                self.emit(0x20);
                self.emit16(0xFFE4); // JSR $FFE4
            }
            Expr::Waitkey => {
                // CIA1 matrix direct scan — works even when CIA1 timer IRQ is disabled.
                // Select all rows (active-low: $00 = all rows selected)
                self.emit(0xA9);
                self.emit(0x00); // LDA #$00
                self.emit(0x8D);
                self.emit(0x00);
                self.emit(0xDC); // STA $DC00
                // Busy-loop: read columns; $FF = no key pressed
                let loop_addr = self.current_addr();
                self.emit(0xAD);
                self.emit(0x01);
                self.emit(0xDC); // LDA $DC01
                self.emit(0xC9);
                self.emit(0xFF); // CMP #$FF
                self.emit(0xF0); // BEQ loop
                let beq_off = self.code.len();
                self.emit(0x00);
                self.patch_bxx(beq_off, loop_addr);
                // A = raw $DC01 value on exit (column bits; 0 bit = key pressed)
            }
            Expr::FnCall(name, args) => {
                // Store args into the function's parameter ZP slots, then JSR.
                if let Some(param_addrs) = self.sub_params.get(name).cloned() {
                    for (i, arg) in args.iter().enumerate() {
                        if let Some((zp, ptype)) = param_addrs.get(i).cloned() {
                            let arg = arg.clone();
                            if matches!(ptype, Some(VarType::Str)) {
                                if let Expr::Var(arg_name) = &arg {
                                    self.mark_used(arg_name);
                                    if let Some(arg_zp) = self.var_addr(arg_name) {
                                        self.emit(0xA5);
                                        self.emit(arg_zp);
                                        self.emit(0x85);
                                        self.emit(zp);
                                        self.emit(0xA5);
                                        self.emit(arg_zp + 1);
                                        self.emit(0x85);
                                        self.emit(zp + 1);
                                        continue;
                                    }
                                }
                            }
                            self.eval_expr(&arg);
                            self.emit(0x85);
                            self.emit(zp); // STA param_zp
                        }
                    }
                }
                self.emit(0x20); // JSR
                if let Some(&addr) = self.subs.get(name) {
                    self.emit16(addr);
                } else {
                    let patch = self.code.len();
                    self.emit16(0x0000);
                    self.sub_patches.push((patch, name.clone(), 0));
                }
                // For word/float return fns, read lo byte from fn_ret_zp (hi ignored in 8-bit context)
                if matches!(self.fn_ret_types.get(name), Some(VarType::Word | VarType::Float)) {
                    if let Some(ret_zp) = self.fn_ret_zp {
                        self.emit(0xA5);
                        self.emit(ret_zp); // LDA fn_ret_zp (lo byte)
                    }
                }
                // For 8-bit return fns, result is already in A from callee's RTS
            }
            Expr::StrLen(inner) => {
                let inner = inner.clone();
                match inner.as_ref() {
                    Expr::StringLit(s) => {
                        // compile-time: length known
                        self.emit(0xA9);
                        self.emit(s.len() as u8); // LDA #len
                    }
                    Expr::Var(name) if matches!(self.var_types.get(name), Some(VarType::Str)) => {
                        if let Some(ptr) = self.var_addr(name) {
                            // inline len loop: LDY #$FF; loop: INY; LDA (ptr),Y; BNE loop; TYA
                            self.emit(0xA0);
                            self.emit(0xFF); // LDY #$FF
                            let loop_top = self.current_addr();
                            self.emit(0xC8); // INY
                            self.emit(0xB1);
                            self.emit(ptr); // LDA (ptr),Y
                            self.emit(0xD0); // BNE loop
                            let bne_pos = self.code.len();
                            self.emit(0x00);
                            self.patch_bxx(bne_pos, loop_top);
                            self.emit(0x98); // TYA → A = length
                        } else {
                            self.emit(0xA9);
                            self.emit(0x00);
                        }
                    }
                    _ => {
                        self.eval_expr(&inner);
                    } // fallback: evaluate as numeric
                }
            }
            Expr::Asc(inner) => {
                let inner = inner.clone();
                match inner.as_ref() {
                    Expr::StringLit(s) => {
                        let code = s
                            .chars()
                            .next()
                            .map(|c| ascii_to_petscii(c, self.charset_lowercase))
                            .unwrap_or(0);
                        self.emit(0xA9);
                        self.emit(code); // LDA #first_char
                    }
                    Expr::Var(name) if matches!(self.var_types.get(name), Some(VarType::Str)) => {
                        if let Some(ptr) = self.var_addr(name) {
                            self.emit(0xA0);
                            self.emit(0x00); // LDY #0
                            self.emit(0xB1);
                            self.emit(ptr); // LDA (ptr),Y → first char
                        } else {
                            self.emit(0xA9);
                            self.emit(0x00);
                        }
                    }
                    _ => {
                        self.eval_expr(&inner);
                    }
                }
            }
            Expr::SpriteHit => {
                // Read $D01E — sprite-sprite collision register (cleared on read).
                self.emit(0xAD);
                self.emit16(0xD01E);
            }
            Expr::SpriteBgHit => {
                // Read $D01F — sprite-background collision register (cleared on read).
                self.emit(0xAD);
                self.emit16(0xD01F);
            }
            Expr::SpriteX(id_expr) => {
                // sprite_x(id) — LDA $D000 + id*2 (sprite X low byte)
                match id_expr.as_ref() {
                    Expr::Number(n) => {
                        let addr = 0xD000u16.wrapping_add((*n as u16) * 2);
                        self.emit(0xAD);
                        self.emit16(addr); // LDA $D0xx
                    }
                    _ => {
                        let ptr = self.tmp_zp;
                        self.tmp_zp += 2;
                        self.emit(0xA9);
                        self.emit(0x00); // LDA #$00
                        self.emit(0x85);
                        self.emit(ptr); // STA ptr_lo = base $00
                        self.emit(0xA9);
                        self.emit(0xD0); // LDA #$D0
                        self.emit(0x85);
                        self.emit(ptr + 1); // STA ptr_hi = $D0
                        let id = id_expr.clone();
                        self.eval_expr(&id); // A = id
                        self.emit(0x0A); // ASL A (×2 stride)
                        self.emit(0xA8); // TAY
                        self.emit(0xB1);
                        self.emit(ptr); // LDA (ptr),Y → $D000 + id*2
                    }
                }
            }
            Expr::SpriteY(id_expr) => {
                // sprite_y(id) — LDA $D001 + id*2 (sprite Y register)
                match id_expr.as_ref() {
                    Expr::Number(n) => {
                        let addr = 0xD001u16.wrapping_add((*n as u16) * 2);
                        self.emit(0xAD);
                        self.emit16(addr); // LDA $D0xx
                    }
                    _ => {
                        let ptr = self.tmp_zp;
                        self.tmp_zp += 2;
                        self.emit(0xA9);
                        self.emit(0x00); // LDA #$00
                        self.emit(0x85);
                        self.emit(ptr); // STA ptr_lo
                        self.emit(0xA9);
                        self.emit(0xD0); // LDA #$D0
                        self.emit(0x85);
                        self.emit(ptr + 1); // STA ptr_hi = $D0
                        let id = id_expr.clone();
                        self.eval_expr(&id); // A = id
                        self.emit(0x0A); // ASL A (×2 stride)
                        self.emit(0xA8); // TAY
                        self.emit(0xC8); // INY (+1 for Y byte)
                        self.emit(0xB1);
                        self.emit(ptr); // LDA (ptr),Y → $D001 + id*2
                    }
                }
            }
            Expr::Joy(port) => {
                // CIA1 joystick: port 2 = $DC00, port 1 = $DC01; bits 0-4 active-low.
                // Return inverted lower 5 bits: bit0=up, bit1=down, bit2=left, bit3=right, bit4=fire.
                let addr: u16 = if *port == 1 { 0xDC01 } else { 0xDC00 };
                self.emit(0xAD);
                self.emit(addr as u8);
                self.emit((addr >> 8) as u8); // LDA $DCxx
                self.emit(0x29);
                self.emit(0x1F); // AND #$1F  (keep bits 0-4)
                self.emit(0x49);
                self.emit(0x1F); // EOR #$1F  (invert: 1 = pressed)
            }
            Expr::MouseXHi => {
                let zp = self.mouse_zp.expect("mouse_x_hi: mouse helper not allocated");
                self.emit(0xA5); // LDA zp
                self.emit(zp + 6); // accum_x_hi (0 or 1)
            }
            Expr::MouseX => {
                // 1351 mouse — JSR to helper, return accum_x (8-bit)
                let zp = self.mouse_zp.expect("mouse_x: mouse helper not allocated (pre_scan bug)");
                self.emit(0x20); // JSR
                let pos = self.code.len();
                self.emit16(0x0000); // placeholder
                self.mouse_patches.push(pos);
                self.emit(0xA5); // LDA zp
                self.emit(zp);   // accum_x
            }
            Expr::MouseY => {
                // 1351 mouse — just return accum_y (helper already ran via mouse_x)
                let zp = self.mouse_zp.expect("mouse_y: mouse helper not allocated (pre_scan bug)");
                self.emit(0xA5); // LDA zp
                self.emit(zp + 1); // accum_y
            }
            Expr::MouseBtn => {
                // CIA1 $DC01 (control port 1): bit4=fire (left button, active-low),
                // bit0=up direction (right button, active-low for 1351 mouse).
                // Result: bit0 = left pressed, bit1 = right pressed (both active-high).
                let tmp = self.tmp_zp;
                self.tmp_zp += 1;
                self.emit(0xAD);
                self.emit(0x01);
                self.emit(0xDC); // LDA $DC01
                self.emit(0x49);
                self.emit(0xFF); // EOR #$FF  (invert: active-high)
                self.emit(0x29);
                self.emit(0x10); // AND #$10  (isolate bit4 = fire/left)
                self.emit(0x4A); // LSR
                self.emit(0x4A); // LSR
                self.emit(0x4A); // LSR
                self.emit(0x4A); // LSR  → bit0
                self.emit(0x85);
                self.emit(tmp); // STA tmp  (left button in bit0)
                self.emit(0xAD);
                self.emit(0x01);
                self.emit(0xDC); // LDA $DC01
                self.emit(0x49);
                self.emit(0xFF); // EOR #$FF  (invert)
                self.emit(0x29);
                self.emit(0x01); // AND #$01  (isolate bit0 = up/right)
                self.emit(0x0A); // ASL       → bit1
                self.emit(0x05);
                self.emit(tmp); // ORA tmp   → bit0=left, bit1=right
            }
            Expr::Peek(addr) => {
                match addr.as_ref() {
                    Expr::Number(n) => {
                        let n = *n;
                        self.emit(0xAD);
                        self.emit(n as u8);
                        self.emit((n >> 8) as u8); // LDA abs
                    }
                    Expr::Var(name) => {
                        let name = name.clone();
                        if matches!(self.var_types.get(&name), Some(VarType::Word)) {
                            // word var = 16-bit ZP pointer → LDA (zp),Y  Y=0
                            if let Some(zp) = self.var_addr(&name) {
                                self.emit(0xA0);
                                self.emit(0x00); // LDY #0
                                self.emit(0xB1);
                                self.emit(zp); // LDA (zp),Y
                            }
                        } else if let Some(zp) = self.var_addr(&name) {
                            // 8-bit var used as ZP address
                            self.emit(0xA5);
                            self.emit(zp); // LDA zp
                        }
                    }
                    _ => {
                        let addr = addr.clone();
                        let ptr = self.tmp_zp;
                        self.tmp_zp += 2;
                        self.eval_expr(&addr);
                        self.emit(0x85);
                        self.emit(ptr); // STA ptr_lo
                        self.emit(0xA9);
                        self.emit(0x00);
                        self.emit(0x85);
                        self.emit(ptr + 1); // STA ptr_hi = 0
                        self.emit(0xA0);
                        self.emit(0x00); // LDY #0
                        self.emit(0xB1);
                        self.emit(ptr); // LDA (ptr),Y
                    }
                }
            }
            // peek16(addr) in 8-bit context: return lo byte only
            Expr::Peek16(addr) => {
                match addr.as_ref() {
                    Expr::Number(n) => {
                        let n = *n as u16;
                        self.emit(0xAD);
                        self.emit(n as u8);
                        self.emit((n >> 8) as u8); // LDA abs lo
                    }
                    Expr::Var(name) => {
                        let name = name.clone();
                        if matches!(self.var_types.get(&name), Some(VarType::Word)) {
                            if let Some(zp) = self.var_addr(&name) {
                                self.emit(0xA0);
                                self.emit(0x00); // LDY #0
                                self.emit(0xB1);
                                self.emit(zp); // LDA (zp),Y → lo byte
                            }
                        } else if let Some(zp) = self.var_addr(&name) {
                            self.emit(0xA5);
                            self.emit(zp); // LDA zp
                        }
                    }
                    _ => {
                        let addr = addr.clone();
                        let ptr = self.tmp_zp;
                        self.tmp_zp += 2;
                        self.eval_expr(&addr);
                        self.emit(0x85);
                        self.emit(ptr);
                        self.emit(0xA9);
                        self.emit(0x00);
                        self.emit(0x85);
                        self.emit(ptr + 1);
                        self.emit(0xA0);
                        self.emit(0x00);
                        self.emit(0xB1);
                        self.emit(ptr); // LDA (ptr),Y → lo byte
                    }
                }
            }
            Expr::ArrayGet(arr_name, idx_expr) => {
                if matches!(self.var_types.get(arr_name.as_str()), Some(VarType::Str)) {
                    // String character access: s[i] → LDA (str_ptr),Y
                    self.mark_used(arr_name);
                    if let Some(ptr) = self.var_addr(arr_name) {
                        match idx_expr.as_ref() {
                            Expr::Number(n) => {
                                self.emit(0xA0);
                                self.emit(*n as u8); // LDY #n
                                self.emit(0xB1);
                                self.emit(ptr); // LDA (ptr),Y
                            }
                            _ => {
                                let idx = idx_expr.clone();
                                self.eval_expr(&idx);
                                self.emit(0xA8); // TAY
                                self.emit(0xB1);
                                self.emit(ptr); // LDA (ptr),Y
                            }
                        }
                    }
                } else {
                    let base = self.arrays.get(arr_name).copied().unwrap_or(0xC000);
                    match idx_expr.as_ref() {
                        Expr::Number(n) => {
                            let addr = base.wrapping_add(*n as u16);
                            self.emit(0xAD);
                            self.emit16(addr); // LDA abs
                        }
                        _ => {
                            let idx = idx_expr.clone();
                            let ptr = self.tmp_zp;
                            self.tmp_zp += 2;
                            self.emit(0xA9);
                            self.emit(base as u8);
                            self.emit(0x85);
                            self.emit(ptr);
                            self.emit(0xA9);
                            self.emit((base >> 8) as u8);
                            self.emit(0x85);
                            self.emit(ptr + 1);
                            self.eval_expr(&idx);
                            self.emit(0xA8); // TAY
                            self.emit(0xB1);
                            self.emit(ptr); // LDA (ptr),Y
                        }
                    }
                }
            }
            Expr::ChrStr(inner) => {
                // chr$(n) evaluates to the raw byte value n (PETSCII code).
                // In print context print_single_arg handles the JSR CHROUT.
                let inner = inner.clone();
                self.eval_expr(&inner);
            }
            Expr::StrN(inner) => {
                // str$(n): evaluate n → A, then JSR strn_helper.
                // After the call, strn_zp/strn_zp+1 point to a 4-byte buffer holding "NNN\0".
                let inner = inner.clone();
                self.eval_expr(&inner);
                self.emit(0x20); // JSR strn_helper (address patched in post-code)
                let patch = self.code.len();
                self.emit16(0x0000);
                self.strn_helper_patches.push(patch);
            }
            Expr::Rnd => {
                // LCG: seed = seed*5 + 1 mod 256  (full period, Hull-Dobell)
                // Seed at $FE – documented free ZP byte on the C64.
                if !self.rnd_seeded {
                    // Seed with raster line for variety across runs
                    self.emit(0xAD);
                    self.emit(0x12);
                    self.emit(0xD0); // LDA $D012
                    self.emit(0x85);
                    self.emit(RND_SEED_ZP); // STA seed
                    self.rnd_seeded = true;
                }
                self.emit(0xA5);
                self.emit(RND_SEED_ZP); // LDA seed
                self.emit(0x0A); // ASL A  (×2)
                self.emit(0x0A); // ASL A  (×4)
                self.emit(0x18); // CLC
                self.emit(0x65);
                self.emit(RND_SEED_ZP); // ADC seed (×5)
                self.emit(0x18); // CLC
                self.emit(0x69);
                self.emit(0x01); // ADC #1
                self.emit(0x85);
                self.emit(RND_SEED_ZP); // STA seed
                self.emit(0x4D);
                self.emit(0x12);
                self.emit(0xD0); // EOR $D012 (post-whiten)
            }
            Expr::RndN(n) => {
                // rnd(n) = rnd() mod n — generate LCG value then apply modulo
                let n = n.clone();
                // Step 1: LCG — same as Expr::Rnd
                if !self.rnd_seeded {
                    self.emit(0xAD);
                    self.emit(0x12);
                    self.emit(0xD0); // LDA $D012
                    self.emit(0x85);
                    self.emit(RND_SEED_ZP);
                    self.rnd_seeded = true;
                }
                self.emit(0xA5);
                self.emit(RND_SEED_ZP);
                self.emit(0x0A);
                self.emit(0x0A);
                self.emit(0x18);
                self.emit(0x65);
                self.emit(RND_SEED_ZP);
                self.emit(0x18);
                self.emit(0x69);
                self.emit(0x01);
                self.emit(0x85);
                self.emit(RND_SEED_ZP);
                self.emit(0x4D);
                self.emit(0x12);
                self.emit(0xD0); // EOR $D012
                // Step 2: mod by n — same as BinOp::Mod
                let tmp = self.tmp_zp;
                self.tmp_zp += 1; // dividend (rnd value)
                self.emit(0x85);
                self.emit(tmp); // STA tmp
                let divisor = self.tmp_zp;
                self.tmp_zp += 1;
                self.eval_expr(&n);
                self.emit(0x85);
                self.emit(divisor); // STA divisor
                self.emit(0xA5);
                self.emit(tmp); // LDA tmp (dividend)
                // mod loop: SEC; SBC divisor; BCS loop_top; CLC; ADC divisor
                let loop_top = self.current_addr();
                self.emit(0x38); // SEC
                self.emit(0xE5);
                self.emit(divisor); // SBC divisor
                self.emit(0xB0); // BCS loop_top
                let bcs = self.code.len();
                self.emit(0x00);
                self.patch_bxx(bcs, loop_top);
                self.emit(0x18); // CLC
                self.emit(0x65);
                self.emit(divisor); // ADC divisor → remainder in A
            }
            Expr::Abs(expr) => {
                let expr = expr.clone();
                self.eval_expr(&expr);
                self.emit(0x10); // BPL + (skip negate if positive)
                let bpl_pos = self.code.len();
                self.emit(0x00);
                self.emit(0x49);
                self.emit(0xFF); // EOR #$FF
                self.emit(0x18);
                self.emit(0x69);
                self.emit(0x01); // ADC #1 (two's complement)
                let after = self.current_addr();
                self.patch_bxx(bpl_pos, after);
            }
            Expr::Min(a, b) => {
                let (a, b) = (a.clone(), b.clone());
                let t = self.tmp_zp;
                self.tmp_zp += 1;
                self.eval_expr(&b);
                self.emit(0x85);
                self.emit(t);
                self.eval_expr(&a);
                self.emit(0xC5);
                self.emit(t);
                self.emit(0x90);
                self.emit(0x05); // BCC +5
                self.emit(0xA5);
                self.emit(t);
                self.emit(0x4C);
                let skip = self.code.len();
                self.emit16(0x0000);
                let end = self.current_addr();
                self.patch_abs(skip, end);
            }
            Expr::Max(a, b) => {
                let (a, b) = (a.clone(), b.clone());
                let t = self.tmp_zp;
                self.tmp_zp += 1;
                self.eval_expr(&b);
                self.emit(0x85);
                self.emit(t);
                self.eval_expr(&a);
                self.emit(0xC5);
                self.emit(t);
                self.emit(0xB0);
                self.emit(0x05); // BCS +5
                self.emit(0xA5);
                self.emit(t);
                self.emit(0x4C);
                let skip = self.code.len();
                self.emit16(0x0000);
                let end = self.current_addr();
                self.patch_abs(skip, end);
            }
            Expr::Clamp(val_e, lo_e, hi_e) => {
                // clamp(val, lo, hi) — 8-bit unsigned clamp, result in A
                // Algorithm (12 bytes of clamp logic after evaluating val):
                //   CMP tmp_lo  (carry set if A >= lo)
                //   BCS step2   (skip if A >= lo)
                //   LDA tmp_lo  (A < lo: return lo)
                //   step2:
                //   CMP tmp_hi  (carry set if A >= hi)
                //   BCC done    (A < hi: keep A)
                //   LDA tmp_hi  (A >= hi: return hi, handles A==hi and A>hi)
                //   done:
                let (val_e, lo_e, hi_e) = (val_e.clone(), lo_e.clone(), hi_e.clone());
                let tmp_lo = self.tmp_zp;
                self.tmp_zp += 1;
                let tmp_hi = self.tmp_zp;
                self.tmp_zp += 1;
                self.eval_expr(&lo_e);
                self.emit(0x85);
                self.emit(tmp_lo); // STA tmp_lo
                self.eval_expr(&hi_e);
                self.emit(0x85);
                self.emit(tmp_hi); // STA tmp_hi
                self.eval_expr(&val_e); // A = val
                // if A < lo → A = lo
                self.emit(0xC5);
                self.emit(tmp_lo); // CMP tmp_lo
                self.emit(0xB0);
                self.emit(0x02); // BCS step2 (+2)
                self.emit(0xA5);
                self.emit(tmp_lo); // LDA tmp_lo
                // step2: if A > hi → A = hi
                self.emit(0xC5);
                self.emit(tmp_hi); // CMP tmp_hi
                self.emit(0x90);
                self.emit(0x02); // BCC done (+2)
                self.emit(0xA5);
                self.emit(tmp_hi); // LDA tmp_hi
                // done: A has the clamped value
            }
            Expr::Sgn(expr) => {
                // Returns: 0 = zero, 1 = positive (1-127), $FF = negative (128-255)
                let expr = expr.clone();
                self.eval_expr(&expr);
                self.emit(0xC9);
                self.emit(0x01); // CMP #1  (carry clear iff A==0)
                self.emit(0x90); // BCC → zero
                let bcc_zero = self.code.len();
                self.emit(0x00);
                self.emit(0x10); // BPL → positive (bit 7 clear: 1-127)
                let bpl_pos = self.code.len();
                self.emit(0x00);
                // negative (128-255): return $FF
                self.emit(0xA9);
                self.emit(0xFF); // LDA #$FF
                self.emit(0x4C);
                let jmp1 = self.code.len();
                self.emit16(0x0000);
                // positive (1-127): return 1
                let pos_addr = self.current_addr();
                self.patch_bxx(bpl_pos, pos_addr);
                self.emit(0xA9);
                self.emit(0x01); // LDA #1
                self.emit(0x4C);
                let jmp2 = self.code.len();
                self.emit16(0x0000);
                // zero: return 0
                let zero_addr = self.current_addr();
                self.patch_bxx(bcc_zero, zero_addr);
                self.emit(0xA9);
                self.emit(0x00); // LDA #0
                let end = self.current_addr();
                self.patch_abs(jmp1, end);
                self.patch_abs(jmp2, end);
            }
            Expr::Sin(e) => {
                // sin(angle): angle 0-255 → lookup table → 0-255 (center=128)
                let e = e.clone();
                self.eval_expr(&e);
                self.emit(0xAA); // TAX — angle into X
                self.emit(0xBD); // LDA abs,X
                let patch = self.code.len();
                self.emit(0x00);
                self.emit(0x00); // table address (patched later)
                self.sin_table_patches.push(patch);
            }
            Expr::Cos(e) => {
                // cos(angle) = sin(angle + 64) for 256-step circle
                let e = e.clone();
                self.eval_expr(&e);
                self.emit(0x18); // CLC
                self.emit(0x69);
                self.emit(64); // ADC #64 — quarter period (+90°)
                self.emit(0xAA); // TAX
                self.emit(0xBD); // LDA abs,X
                let patch = self.code.len();
                self.emit(0x00);
                self.emit(0x00);
                self.sin_table_patches.push(patch);
            }
            Expr::HexFmt(inner) | Expr::BinFmt(inner) => {
                // In non-print context, evaluate the inner expression (pass-through)
                let inner = inner.clone();
                self.eval_expr(&inner);
            }
            Expr::DecFmt(inner, _) => {
                // In non-print context, evaluate the inner expression (pass-through)
                let inner = inner.clone();
                self.eval_expr(&inner);
            }
            Expr::Spc(inner) | Expr::Tab(inner) => {
                // In non-print context, evaluate the inner expression only
                let inner = inner.clone();
                self.eval_expr(&inner);
            }
            Expr::FixedLit(v) => {
                // Q8.8 literal in 8-bit context → return integer part (hi byte)
                self.emit(0xA9);
                self.emit((*v >> 8) as u8); // LDA #hi
            }
            Expr::FixedToInt(inner) => {
                // int(f) — extract integer part (hi byte) of a float variable
                let inner = inner.clone();
                match inner.as_ref() {
                    Expr::Var(name)
                        if matches!(self.var_types.get(name.as_str()), Some(VarType::Float)) =>
                    {
                        if let Some(zp) = self.var_addr(name) {
                            self.emit(0xA5);
                            self.emit(zp + 1); // LDA hi (integer part)
                        } else {
                            self.emit(0xA9);
                            self.emit(0x00);
                        }
                    }
                    other => {
                        // General case: evaluate as 16-bit, take hi byte
                        let other = other.clone();
                        let tmp_lo = self.tmp_zp;
                        self.tmp_zp += 1;
                        let tmp_hi = self.tmp_zp;
                        self.tmp_zp += 1;
                        self.eval_expr_word(&other, tmp_lo, tmp_hi);
                        self.emit(0xA5);
                        self.emit(tmp_hi); // LDA hi = integer part
                    }
                }
            }
            Expr::Val(inner) => {
                // val(s) — runtime PETSCII decimal string → 8-bit int
                // Supports: string literal (compile-time), string var (runtime loop)
                let inner = inner.clone();
                match inner.as_ref() {
                    Expr::StringLit(s) => {
                        // compile-time conversion
                        let n: u8 = s.trim().parse::<u8>().unwrap_or(0);
                        self.emit(0xA9);
                        self.emit(n);
                    }
                    Expr::Var(name)
                        if matches!(self.var_types.get(name.as_str()), Some(VarType::Str)) =>
                    {
                        if let Some(ptr) = self.var_addr(name) {
                            // runtime decimal-string → uint8 via multiply-accumulate loop
                            // ZP scratch: result, digit
                            let result_zp = self.tmp_zp;
                            self.tmp_zp += 1;
                            let digit_zp = self.tmp_zp;
                            self.tmp_zp += 1;
                            self.emit(0xA9);
                            self.emit(0x00); // LDA #0
                            self.emit(0x85);
                            self.emit(result_zp); // STA result
                            self.emit(0xA0);
                            self.emit(0x00); // LDY #0
                            // loop top: LDA (ptr),Y
                            let loop_top = self.current_addr();
                            self.emit(0xB1);
                            self.emit(ptr); // LDA (ptr),Y
                            // BEQ done (null terminator)
                            self.emit(0xF0);
                            let beq_done = self.code.len();
                            self.emit(0x00);
                            // CMP #$30 ('0'); BCC done (< '0')
                            self.emit(0xC9);
                            self.emit(0x30);
                            self.emit(0x90);
                            let bcc1 = self.code.len();
                            self.emit(0x00);
                            // CMP #$3A ('9'+1); BCS done (> '9')
                            self.emit(0xC9);
                            self.emit(0x3A);
                            self.emit(0xB0);
                            let bcs1 = self.code.len();
                            self.emit(0x00);
                            // digit = A - $30
                            self.emit(0x38); // SEC
                            self.emit(0xE9);
                            self.emit(0x30); // SBC #$30
                            self.emit(0x85);
                            self.emit(digit_zp); // STA digit
                            // result = result*2; save; result = result*4; result = result*8
                            // result*10 = result*8 + result*2
                            self.emit(0xA5);
                            self.emit(result_zp); // LDA result
                            self.emit(0x0A); // ASL A  (*2)
                            self.emit(0x85);
                            self.emit(result_zp); // STA result  (save *2)
                            self.emit(0x0A); // ASL A  (*4)
                            self.emit(0x0A); // ASL A  (*8)
                            self.emit(0x18); // CLC
                            self.emit(0x65);
                            self.emit(result_zp); // ADC result  (*8 + *2 = *10)
                            self.emit(0x18); // CLC
                            self.emit(0x65);
                            self.emit(digit_zp); // ADC digit   (+digit)
                            self.emit(0x85);
                            self.emit(result_zp); // STA result
                            self.emit(0xC8); // INY
                            // BNE loop_top (Y wraps at 256: stop; normal: keep going)
                            self.emit(0xD0);
                            let bne_back = self.code.len();
                            self.emit(0x00);
                            self.patch_bxx(bne_back, loop_top);
                            // done: patch all forward branch targets
                            let done_addr = self.current_addr();
                            self.patch_bxx(beq_done, done_addr);
                            self.patch_bxx(bcc1, done_addr);
                            self.patch_bxx(bcs1, done_addr);
                            self.emit(0xA5);
                            self.emit(result_zp); // LDA result
                        } else {
                            self.emit(0xA9);
                            self.emit(0x00);
                        }
                    }
                    _ => {
                        // Non-string expression: just evaluate it (pass-through)
                        self.eval_expr(&inner);
                    }
                }
            }
            Expr::BinOp(l, op, r) => {
                match op {
                    BinOp::And => {
                        // Bitwise AND – matches BASIC's AND semantics (e.g. color and 15)
                        let tmp = self.tmp_zp;
                        self.tmp_zp += 1;
                        self.eval_expr(l);
                        self.emit(0x85);
                        self.emit(tmp); // STA tmp (l)
                        self.eval_expr(r);
                        self.emit(0x25);
                        self.emit(tmp); // AND tmp → A = l & r
                    }
                    BinOp::Or => {
                        // Bitwise OR
                        let tmp = self.tmp_zp;
                        self.tmp_zp += 1;
                        self.eval_expr(l);
                        self.emit(0x85);
                        self.emit(tmp); // STA tmp (l)
                        self.eval_expr(r);
                        self.emit(0x05);
                        self.emit(tmp); // ORA tmp → A = l | r
                    }
                    BinOp::Xor => {
                        // Bitwise XOR
                        let tmp = self.tmp_zp;
                        self.tmp_zp += 1;
                        self.eval_expr(l);
                        self.emit(0x85);
                        self.emit(tmp); // STA tmp (l)
                        self.eval_expr(r);
                        self.emit(0x45);
                        self.emit(tmp); // EOR tmp → A = l ^ r
                    }
                    BinOp::Shl | BinOp::Shr => {
                        // Shift left/right by variable or constant amount
                        // A = left_val (stored in tmp); shift A left/right by right_val (cnt)
                        let tmp = self.tmp_zp;
                        self.tmp_zp += 1;
                        let cnt = self.tmp_zp;
                        self.tmp_zp += 1;
                        let l = l.clone();
                        let r = r.clone();
                        let op = op.clone();
                        self.eval_expr(&l);
                        self.emit(0x85);
                        self.emit(tmp); // STA tmp (value to shift)
                        self.eval_expr(&r);
                        // if shift count == 0, skip the loop
                        let beq_done = self.code.len();
                        self.emit(0xF0);
                        self.emit(0x00); // BEQ done (patched)
                        self.emit(0x85);
                        self.emit(cnt); // STA cnt (shift count)
                        let loop_top = self.code.len();
                        if matches!(op, BinOp::Shl) {
                            self.emit(0x06);
                            self.emit(tmp); // ASL tmp
                        } else {
                            self.emit(0x46);
                            self.emit(tmp); // LSR tmp
                        }
                        self.emit(0xC6);
                        self.emit(cnt); // DEC cnt
                        let bne_pos = self.code.len();
                        self.emit(0xD0);
                        self.emit(0x00); // BNE loop_top (patched)
                        self.emit(0xA5);
                        self.emit(tmp); // LDA tmp (done)
                        let done_addr = self.current_addr();
                        self.patch_bxx(beq_done + 1, done_addr);
                        self.patch_bxx(bne_pos + 1, self.load_addr + loop_top as u16);
                        return; // result already in A via LDA tmp above
                    }
                    cmp_op @ (BinOp::Eq
                    | BinOp::NotEq
                    | BinOp::Lt
                    | BinOp::Gt
                    | BinOp::LtEq
                    | BinOp::GtEq)
                        if self.can_be_word_result(l) || self.can_be_word_result(r) =>
                    {
                        // Word-aware unsigned 16-bit compare; result A = 1 (true) or 0 (false).
                        let cmp_op = cmp_op.clone();
                        let l_clone = l.clone();
                        let r_clone = r.clone();
                        let lhs_lo = self.tmp_zp;
                        self.tmp_zp += 1;
                        let lhs_hi = self.tmp_zp;
                        self.tmp_zp += 1;
                        let rhs_lo = self.tmp_zp;
                        self.tmp_zp += 1;
                        let rhs_hi = self.tmp_zp;
                        self.tmp_zp += 1;
                        self.eval_expr_word(&l_clone, lhs_lo, lhs_hi);
                        self.eval_expr_word(&r_clone, rhs_lo, rhs_hi);

                        match cmp_op {
                            BinOp::Eq | BinOp::NotEq => {
                                // LDA lhs_lo; CMP rhs_lo; BNE diff
                                // LDA lhs_hi; CMP rhs_hi; BNE diff
                                // LDA #eq_val; JMP end; diff: LDA #neq_val; end:
                                self.emit(0xA5);
                                self.emit(lhs_lo);
                                self.emit(0xC5);
                                self.emit(rhs_lo);
                                self.emit(0xD0); // BNE diff
                                let bne1 = self.code.len();
                                self.emit(0x00);
                                self.emit(0xA5);
                                self.emit(lhs_hi);
                                self.emit(0xC5);
                                self.emit(rhs_hi);
                                self.emit(0xD0); // BNE diff
                                let bne2 = self.code.len();
                                self.emit(0x00);
                                let (eq_val, neq_val) = if matches!(cmp_op, BinOp::Eq) {
                                    (0x01u8, 0x00u8)
                                } else {
                                    (0x00u8, 0x01u8)
                                };
                                self.emit(0xA9);
                                self.emit(eq_val); // LDA #eq_val
                                self.emit(0x4C); // JMP end
                                let jmp_end = self.code.len();
                                self.emit16(0x0000);
                                let diff_addr = self.current_addr();
                                self.patch_bxx(bne1, diff_addr);
                                self.patch_bxx(bne2, diff_addr);
                                self.emit(0xA9);
                                self.emit(neq_val); // LDA #neq_val
                                let end_addr = self.current_addr();
                                self.code[jmp_end] = end_addr as u8;
                                self.code[jmp_end + 1] = (end_addr >> 8) as u8;
                            }
                            BinOp::Lt | BinOp::GtEq | BinOp::Gt | BinOp::LtEq => {
                                // Unsigned compare via SBC. For Gt/LtEq, swap operands first.
                                // After SBC: C=1 ⇔ lhs>=rhs (unsigned)
                                //   Lt:   C=0 → true
                                //   GtEq: C=1 → true
                                //   Gt:   swap, C=0 → true  (lhs>rhs ⇔ rhs<lhs)
                                //   LtEq: swap, C=1 → true  (lhs<=rhs ⇔ rhs>=lhs)
                                let (alo, ahi, blo, bhi, want_carry_set) = match cmp_op {
                                    BinOp::Lt => (lhs_lo, lhs_hi, rhs_lo, rhs_hi, false),
                                    BinOp::GtEq => (lhs_lo, lhs_hi, rhs_lo, rhs_hi, true),
                                    BinOp::Gt => (rhs_lo, rhs_hi, lhs_lo, lhs_hi, false),
                                    BinOp::LtEq => (rhs_lo, rhs_hi, lhs_lo, lhs_hi, true),
                                    _ => unreachable!(),
                                };
                                // LDA alo; CMP blo; LDA ahi; SBC bhi
                                self.emit(0xA5);
                                self.emit(alo);
                                self.emit(0xC5);
                                self.emit(blo);
                                self.emit(0xA5);
                                self.emit(ahi);
                                self.emit(0xE5);
                                self.emit(bhi);
                                // A := 0; ROL A  → A = carry (1 if C=1, else 0)
                                self.emit(0xA9);
                                self.emit(0x00);
                                self.emit(0x2A); // ROL A
                                if !want_carry_set {
                                    // Invert: A ^= 1
                                    self.emit(0x49);
                                    self.emit(0x01); // EOR #1
                                }
                            }
                            _ => unreachable!(),
                        }
                    }
                    _ => {
                        let tmp = self.tmp_zp;
                        self.tmp_zp += 1;
                        self.eval_expr(l);
                        self.emit(0x85);
                        self.emit(tmp); // STA tmp
                        self.eval_expr(r);
                        match op {
                            BinOp::Add => {
                                self.emit(0x18); // CLC
                                self.emit(0x65);
                                self.emit(tmp); // ADC tmp
                            }
                            BinOp::Sub => {
                                let tmp2 = self.tmp_zp;
                                self.tmp_zp += 1;
                                self.emit(0x85);
                                self.emit(tmp2); // STA tmp2 (r)
                                self.emit(0xA5);
                                self.emit(tmp); // LDA tmp (l)
                                self.emit(0x38); // SEC
                                self.emit(0xE5);
                                self.emit(tmp2); // SBC tmp2
                            }
                            BinOp::Mul => {
                                let cnt = self.tmp_zp;
                                self.tmp_zp += 1;
                                let res = self.tmp_zp;
                                self.tmp_zp += 1;
                                self.emit(0x85);
                                self.emit(cnt); // STA cnt (r = count)
                                self.emit(0xA9);
                                self.emit(0x00);
                                self.emit(0x85);
                                self.emit(res); // STA res = 0
                                let loop_addr = self.current_addr();
                                self.emit(0xA5);
                                self.emit(res);
                                self.emit(0x18);
                                self.emit(0x65);
                                self.emit(tmp); // ADC tmp (l)
                                self.emit(0x85);
                                self.emit(res);
                                self.emit(0xC6);
                                self.emit(cnt); // DEC cnt
                                self.emit(0xD0); // BNE
                                let offset = loop_addr as i32 - self.current_addr() as i32 - 1;
                                self.emit(offset as u8);
                                self.emit(0xA5);
                                self.emit(res); // LDA res
                            }
                            BinOp::Div => {
                                let divisor = self.tmp_zp;
                                self.tmp_zp += 1;
                                let quot = self.tmp_zp;
                                self.tmp_zp += 1;
                                self.emit(0x85);
                                self.emit(divisor); // STA divisor
                                self.emit(0xA9);
                                self.emit(0x00);
                                self.emit(0x85);
                                self.emit(quot); // STA quot = 0
                                let loop_addr = self.current_addr();
                                self.emit(0xA5);
                                self.emit(tmp); // LDA tmp (dividend)
                                self.emit(0x38); // SEC
                                self.emit(0xE5);
                                self.emit(divisor); // SBC divisor
                                self.emit(0x85);
                                self.emit(tmp); // STA tmp
                                // BCS +3: skip the 3-byte JMP below and land on INC quot
                                self.emit(0xB0);
                                self.emit(0x03); // BCS +3 (no borrow → continue)
                                self.emit(0x4C); // JMP end (borrow → done)
                                let patch = self.code.len();
                                self.emit16(0x0000); // (patched below)
                                self.emit(0xE6);
                                self.emit(quot); // INC quot
                                self.emit(0x4C); // JMP loop_addr (unconditional)
                                self.emit(loop_addr as u8);
                                self.emit((loop_addr >> 8) as u8);
                                let end_addr = self.current_addr();
                                let p = patch;
                                self.code[p] = end_addr as u8;
                                self.code[p + 1] = (end_addr >> 8) as u8;
                                self.emit(0xA5);
                                self.emit(quot); // LDA quot
                            }
                            BinOp::Eq
                            | BinOp::NotEq
                            | BinOp::Lt
                            | BinOp::Gt
                            | BinOp::LtEq
                            | BinOp::GtEq => {
                                // Compare: returns 1 (true) or 0 (false) in A
                                let tmp2 = self.tmp_zp;
                                self.tmp_zp += 1;
                                self.emit(0x85);
                                self.emit(tmp2); // STA tmp2 (r)
                                self.emit(0xA5);
                                self.emit(tmp); // LDA tmp (l)
                                self.emit(0xC5);
                                self.emit(tmp2); // CMP tmp2
                                let branch_op: u8 = match op {
                                    BinOp::Eq => 0xF0,    // BEQ
                                    BinOp::NotEq => 0xD0, // BNE
                                    BinOp::Lt => 0x90,    // BCC
                                    BinOp::GtEq => 0xB0,  // BCS
                                    BinOp::Gt => 0x00,    // special
                                    BinOp::LtEq => 0x00,  // special
                                    _ => 0xF0,
                                };
                                if matches!(op, BinOp::Gt) {
                                    // l > r  ->  r < l  -> swap and BCC
                                    self.emit(0xA5);
                                    self.emit(tmp2);
                                    self.emit(0xC5);
                                    self.emit(tmp);
                                    self.emit(0x90); // BCC true
                                } else if matches!(op, BinOp::LtEq) {
                                    self.emit(0xA5);
                                    self.emit(tmp2);
                                    self.emit(0xC5);
                                    self.emit(tmp);
                                    self.emit(0xB0); // BCS true
                                } else {
                                    self.emit(branch_op);
                                }
                                self.emit(0x05); // branch +5 to true (skip LDA#0(2) + JMP(3) = 5 bytes)
                                self.emit(0xA9);
                                self.emit(0x00); // LDA #0 (false)
                                self.emit(0x4C); // JMP past true
                                let patch = self.code.len();
                                self.emit16(0x0000);
                                self.emit(0xA9);
                                self.emit(0x01); // LDA #1 (true)
                                let end = self.current_addr();
                                self.code[patch] = end as u8;
                                self.code[patch + 1] = (end >> 8) as u8;
                            }
                            BinOp::Mod => {
                                // A = r (right operand), tmp = l (left/dividend)
                                let divisor = self.tmp_zp;
                                self.tmp_zp += 1;
                                self.emit(0x85);
                                self.emit(divisor); // STA divisor
                                self.emit(0xA5);
                                self.emit(tmp); // LDA tmp (dividend)
                                // loop: SEC; SBC divisor; BCS loop; CLC; ADC divisor → A = l mod r
                                let loop_top = self.current_addr();
                                self.emit(0x38); // SEC
                                self.emit(0xE5);
                                self.emit(divisor); // SBC divisor
                                self.emit(0xB0); // BCS loop_top
                                let bcs = self.code.len();
                                self.emit(0x00);
                                self.patch_bxx(bcs, loop_top);
                                self.emit(0x18); // CLC
                                self.emit(0x65);
                                self.emit(divisor); // ADC divisor → remainder in A
                            }
                            BinOp::And | BinOp::Or | BinOp::Xor | BinOp::Shl | BinOp::Shr => {
                                unreachable!()
                            }
                        } // end _ => { inner match
                    } // end outer match op
                } // end BinOp
            }
        }
    }

    // Print string literal, no trailing newline
    fn print_str_inline(&mut self, s: &str) {
        let lowercase = self.charset_lowercase;
        for c in s.chars() {
            self.emit(0xA9);
            self.emit(ascii_to_petscii(c, lowercase));
            self.emit(0x20);
            self.emit16(CHROUT);
        }
    }

    fn print_newline(&mut self) {
        self.emit(0xA9);
        self.emit(0x0D);
        self.emit(0x20);
        self.emit16(CHROUT);
    }

    /// Print null-terminated PETSCII string whose address is in ZP pair (ptr, ptr+1).
    fn print_str_via_ptr(&mut self, ptr: u8) {
        self.emit(0xA0);
        self.emit(0x00); // LDY #0
        let loop_top = self.current_addr();
        self.emit(0xB1);
        self.emit(ptr); // LDA (ptr),Y
        self.emit(0xF0); // BEQ done (null terminator)
        let beq_pos = self.code.len();
        self.emit(0x00);
        self.emit(0x20);
        self.emit16(CHROUT); // JSR CHROUT
        self.emit(0xC8); // INY
        self.emit(0x4C);
        self.emit16(loop_top); // JMP loop_top
        let done = self.current_addr();
        self.patch_bxx(beq_pos, done);
    }

    // Print 8-bit decimal value from ZP address, no trailing newline.
    // Uses 3 ZP temps. Suppresses leading zeros.
    fn print_decimal(&mut self, zp: u8) {
        let t_val = self.tmp_zp;
        self.tmp_zp += 1; // working copy
        let t_lz = self.tmp_zp;
        self.tmp_zp += 1; // leading-zero flag (1=suppress)

        // t_val = zp;  t_lz = 1
        self.emit(0xA5);
        self.emit(zp);
        self.emit(0x85);
        self.emit(t_val);
        self.emit(0xA9);
        self.emit(0x01);
        self.emit(0x85);
        self.emit(t_lz);

        self.print_digit_loop(t_val, 100, t_lz);
        self.print_digit_loop(t_val, 10, t_lz);

        // Ones: always print (no suppression)
        self.emit(0xA5);
        self.emit(t_val);
        self.emit(0x09);
        self.emit(0x30); // ORA #'0'
        self.emit(0x20);
        self.emit16(CHROUT);
    }

    // Emit code that divides t_val by `div`, prints the quotient digit
    // (with leading-zero suppression via t_lz), leaves remainder in t_val.
    fn print_digit_loop(&mut self, t_val: u8, div: u8, t_lz: u8) {
        let t_digit = self.tmp_zp;
        self.tmp_zp += 1;

        // t_digit = 0
        self.emit(0xA9);
        self.emit(0x00);
        self.emit(0x85);
        self.emit(t_digit);

        // loop: while t_val >= div { t_val -= div; t_digit++ }
        let loop_top = self.current_addr();
        self.emit(0xA5);
        self.emit(t_val);
        self.emit(0xC9);
        self.emit(div); // CMP #div
        self.emit(0x90); // BCC → done
        let bcc_pos = self.code.len();
        self.emit(0x00);
        self.emit(0x38);
        self.emit(0xE9);
        self.emit(div); // SBC #div
        self.emit(0x85);
        self.emit(t_val);
        self.emit(0xE6);
        self.emit(t_digit); // INC t_digit
        self.emit(0x4C);
        self.emit16(loop_top); // JMP loop_top
        let loop_done = self.current_addr();
        self.patch_bxx(bcc_pos, loop_done);

        // if t_digit == 0 && t_lz == 1: skip (leading zero)
        self.emit(0xA5);
        self.emit(t_digit);
        self.emit(0xD0); // BNE → print
        let bne_pos = self.code.len();
        self.emit(0x00);
        // digit is 0 — check leading zero flag
        self.emit(0xA5);
        self.emit(t_lz);
        self.emit(0xD0); // BNE → skip
        let bne_skip_pos = self.code.len();
        self.emit(0x00);
        // fall through: digit != 0 path joins here
        let print_pos = self.current_addr();
        self.patch_bxx(bne_pos, print_pos);

        // print digit: ORA #'0', JSR CHROUT, clear lz flag
        self.emit(0xA5);
        self.emit(t_digit);
        self.emit(0x09);
        self.emit(0x30); // ORA #'0'
        self.emit(0x20);
        self.emit16(CHROUT);
        self.emit(0xA9);
        self.emit(0x00);
        self.emit(0x85);
        self.emit(t_lz); // t_lz = 0 (printed something)
        self.emit(0x4C); // JMP → after_skip
        let jmp_pos = self.code.len();
        self.emit16(0x0000);

        let skip_pos = self.current_addr();
        self.patch_bxx(bne_skip_pos, skip_pos);
        let after_skip = self.current_addr();
        self.patch_abs(jmp_pos, after_skip);
    }

    /// Returns true when the expression may produce a value > 255
    /// (word variable, or a sub-expression that contains one, or large constant).
    fn can_be_word_result(&self, expr: &Expr) -> bool {
        match expr {
            Expr::Number(n) => *n > 255_i16 || *n < 0_i16,
            Expr::FixedLit(_) => true,
            Expr::Var(name) => matches!(
                self.var_types.get(name),
                Some(VarType::Word) | Some(VarType::Float)
            ),
            Expr::ArrayGet(name, _) => self.word_arrays.contains(name.as_str()),
            Expr::BinOp(l, _, r) => self.can_be_word_result(l) || self.can_be_word_result(r),
            _ => false,
        }
    }

    /// Returns true if `expr` contains at least one FixedLit (float) node.
    fn contains_fixed_lit(expr: &Expr) -> bool {
        match expr {
            Expr::FixedLit(_) => true,
            Expr::BinOp(l, _, r) => Self::contains_fixed_lit(l) || Self::contains_fixed_lit(r),
            Expr::Var(_) => false,
            _ => false,
        }
    }

    /// Returns true if `expr` is Q8.8 (float) — is a FixedLit or is a float-typed variable,
    /// or is a BinOp where either operand is Q8.8.
    fn is_float_like(&self, expr: &Expr) -> bool {
        match expr {
            Expr::FixedLit(_) => true,
            Expr::Var(n) => matches!(self.var_types.get(n), Some(VarType::Float)),
            Expr::BinOp(l, _, r) => self.is_float_like(l) || self.is_float_like(r),
            _ => false,
        }
    }

    /// Evaluate `expr` as a 16-bit result, storing lo-byte at ZP `lo`, hi-byte at `lo+1`.
    /// Handles: Number, Var (int/word), BinOp Add/Sub.  All others fall back to 8-bit, hi=0.
    fn eval_expr_word(&mut self, expr: &Expr, lo: u8, hi: u8) {
        match expr {
            Expr::Number(n) => {
                let v = *n as u16;
                self.emit(0xA9);
                self.emit(v as u8);
                self.emit(0x85);
                self.emit(lo);
                self.emit(0xA9);
                self.emit((v >> 8) as u8);
                self.emit(0x85);
                self.emit(hi);
            }
            Expr::Var(name) => {
                if let Some(zp) = self.var_addr(name) {
                    self.emit(0xA5);
                    self.emit(zp);
                    self.emit(0x85);
                    self.emit(lo);
                    if matches!(
                        self.var_types.get(name),
                        Some(VarType::Word) | Some(VarType::Float)
                    ) {
                        self.emit(0xA5);
                        self.emit(zp + 1);
                    } else {
                        self.emit(0xA9);
                        self.emit(0x00);
                    }
                    self.emit(0x85);
                    self.emit(hi);
                } else {
                    self.emit(0xA9);
                    self.emit(0x00);
                    self.emit(0x85);
                    self.emit(lo);
                    self.emit(0xA9);
                    self.emit(0x00);
                    self.emit(0x85);
                    self.emit(hi);
                }
            }
            Expr::BinOp(l, BinOp::Add, r) => {
                let tmp_lo = self.tmp_zp;
                self.tmp_zp += 1;
                let tmp_hi = self.tmp_zp;
                self.tmp_zp += 1;
                let (l, r) = (l.clone(), r.clone());
                self.eval_expr_word(&l, tmp_lo, tmp_hi);
                self.eval_expr_word(&r, lo, hi);
                // 16-bit add: result = r + l
                self.emit(0x18); // CLC
                self.emit(0xA5);
                self.emit(lo); // LDA lo
                self.emit(0x65);
                self.emit(tmp_lo); // ADC tmp_lo
                self.emit(0x85);
                self.emit(lo); // STA lo
                self.emit(0xA5);
                self.emit(hi); // LDA hi
                self.emit(0x65);
                self.emit(tmp_hi); // ADC tmp_hi
                self.emit(0x85);
                self.emit(hi); // STA hi
            }
            Expr::BinOp(l, BinOp::Sub, r) => {
                let tmp_lo = self.tmp_zp;
                self.tmp_zp += 1;
                let tmp_hi = self.tmp_zp;
                self.tmp_zp += 1;
                let (l, r) = (l.clone(), r.clone());
                self.eval_expr_word(&l, lo, hi);
                self.eval_expr_word(&r, tmp_lo, tmp_hi);
                self.emit(0x38); // SEC
                self.emit(0xA5);
                self.emit(lo); // LDA lo
                self.emit(0xE5);
                self.emit(tmp_lo); // SBC tmp_lo
                self.emit(0x85);
                self.emit(lo); // STA lo
                self.emit(0xA5);
                self.emit(hi); // LDA hi
                self.emit(0xE5);
                self.emit(tmp_hi); // SBC tmp_hi
                self.emit(0x85);
                self.emit(hi); // STA hi
            }
            Expr::BinOp(l, BinOp::And, r) => {
                let tmp_lo = self.tmp_zp;
                self.tmp_zp += 1;
                let tmp_hi = self.tmp_zp;
                self.tmp_zp += 1;
                let (l, r) = (l.clone(), r.clone());
                self.eval_expr_word(&l, tmp_lo, tmp_hi);
                self.eval_expr_word(&r, lo, hi);
                self.emit(0xA5);
                self.emit(lo);
                self.emit(0x25);
                self.emit(tmp_lo);
                self.emit(0x85);
                self.emit(lo);
                self.emit(0xA5);
                self.emit(hi);
                self.emit(0x25);
                self.emit(tmp_hi);
                self.emit(0x85);
                self.emit(hi);
            }
            Expr::BinOp(l, BinOp::Or, r) => {
                let tmp_lo = self.tmp_zp;
                self.tmp_zp += 1;
                let tmp_hi = self.tmp_zp;
                self.tmp_zp += 1;
                let (l, r) = (l.clone(), r.clone());
                self.eval_expr_word(&l, tmp_lo, tmp_hi);
                self.eval_expr_word(&r, lo, hi);
                self.emit(0xA5);
                self.emit(lo);
                self.emit(0x05);
                self.emit(tmp_lo);
                self.emit(0x85);
                self.emit(lo);
                self.emit(0xA5);
                self.emit(hi);
                self.emit(0x05);
                self.emit(tmp_hi);
                self.emit(0x85);
                self.emit(hi);
            }
            Expr::BinOp(l, BinOp::Xor, r) => {
                let tmp_lo = self.tmp_zp;
                self.tmp_zp += 1;
                let tmp_hi = self.tmp_zp;
                self.tmp_zp += 1;
                let (l, r) = (l.clone(), r.clone());
                self.eval_expr_word(&l, tmp_lo, tmp_hi);
                self.eval_expr_word(&r, lo, hi);
                self.emit(0xA5);
                self.emit(lo);
                self.emit(0x45);
                self.emit(tmp_lo);
                self.emit(0x85);
                self.emit(lo);
                self.emit(0xA5);
                self.emit(hi);
                self.emit(0x45);
                self.emit(tmp_hi);
                self.emit(0x85);
                self.emit(hi);
            }
            // Multiply: dispatch based on whether operands are Q8.8 (float-like) or integers.
            //   float × float : 16×16 Russian Peasant, take bits 8-23 → Q8.8 result
            //   int   × float : 16×8 with mc=float(Q8.8), mr=int (swap operands)
            //   float × int   : 16×8 with mc=float(Q8.8), mr=int  (standard)
            //   word  × int   : 16×8 (standard; same as float × int path)
            Expr::BinOp(l, BinOp::Mul, r) => {
                let l_is_float = self.is_float_like(l);
                let r_is_float = self.is_float_like(r);
                if l_is_float && r_is_float {
                    // Q8.8 × Q8.8: 16×16 Russian Peasant, result = (mc_raw × mr_raw) >> 8
                    // Uses 8 ZP temp bytes.
                    let mc_lo = self.tmp_zp;
                    self.tmp_zp += 1;
                    let mc_hi = self.tmp_zp;
                    self.tmp_zp += 1;
                    let mc_ext = self.tmp_zp;
                    self.tmp_zp += 1;
                    let mr_lo = self.tmp_zp;
                    self.tmp_zp += 1;
                    let mr_hi = self.tmp_zp;
                    self.tmp_zp += 1;
                    let r0 = self.tmp_zp;
                    self.tmp_zp += 1;
                    let r1 = self.tmp_zp;
                    self.tmp_zp += 1;
                    let r2 = self.tmp_zp;
                    self.tmp_zp += 1;
                    let (l, r) = (l.clone(), r.clone());
                    self.eval_expr_word(&l, mc_lo, mc_hi);
                    self.emit(0xA9);
                    self.emit(0x00);
                    self.emit(0x85);
                    self.emit(mc_ext); // mc_ext = 0
                    self.eval_expr_word(&r, mr_lo, mr_hi);
                    self.emit(0xA9);
                    self.emit(0x00);
                    self.emit(0x85);
                    self.emit(r0);
                    self.emit(0x85);
                    self.emit(r1);
                    self.emit(0x85);
                    self.emit(r2);
                    self.emit(0xA2);
                    self.emit(0x10); // LDX #16
                    let loop_top = self.current_addr();
                    // Shift mr right; carry = bit0 of original mr_lo (the bit to test)
                    self.emit(0x46);
                    self.emit(mr_hi); // LSR mr_hi (bit0 → carry)
                    self.emit(0x66);
                    self.emit(mr_lo); // ROR mr_lo (carry→bit7; old bit0→carry)
                    self.emit(0x90);
                    let bcc = self.code.len();
                    self.emit(0x00); // BCC no_add
                    // Add mc (24-bit) to result r (24-bit), with carry chain
                    self.emit(0x18); // CLC
                    self.emit(0xA5);
                    self.emit(r0);
                    self.emit(0x65);
                    self.emit(mc_lo);
                    self.emit(0x85);
                    self.emit(r0);
                    self.emit(0xA5);
                    self.emit(r1);
                    self.emit(0x65);
                    self.emit(mc_hi);
                    self.emit(0x85);
                    self.emit(r1);
                    self.emit(0xA5);
                    self.emit(r2);
                    self.emit(0x65);
                    self.emit(mc_ext);
                    self.emit(0x85);
                    self.emit(r2);
                    let no_add = self.current_addr();
                    self.patch_bxx(bcc, no_add);
                    // Shift mc left (24-bit)
                    self.emit(0x06);
                    self.emit(mc_lo); // ASL mc_lo
                    self.emit(0x26);
                    self.emit(mc_hi); // ROL mc_hi
                    self.emit(0x26);
                    self.emit(mc_ext); // ROL mc_ext
                    self.emit(0xCA); // DEX
                    self.emit(0xD0);
                    let bne = self.code.len();
                    self.emit(0x00); // BNE loop
                    self.patch_bxx(bne, loop_top);
                    // Q8.8 result is in bits 8-23 of the 32-bit product: lo=r1, hi=r2
                    self.emit(0xA5);
                    self.emit(r1);
                    self.emit(0x85);
                    self.emit(lo);
                    self.emit(0xA5);
                    self.emit(r2);
                    self.emit(0x85);
                    self.emit(hi);
                } else if !l_is_float && r_is_float {
                    // int × Q8.8: swap — mc=right (Q8.8, 16-bit), mr=left (int, 8-bit)
                    let mc_lo = self.tmp_zp;
                    self.tmp_zp += 1;
                    let mc_hi = self.tmp_zp;
                    self.tmp_zp += 1;
                    let mr = self.tmp_zp;
                    self.tmp_zp += 1;
                    let (l, r) = (l.clone(), r.clone());
                    self.eval_expr_word(&r, mc_lo, mc_hi); // float operand as 16-bit mc
                    self.eval_expr(&l); // integer operand as 8-bit mr
                    self.emit(0x85);
                    self.emit(mr);
                    self.emit(0xA9);
                    self.emit(0x00);
                    self.emit(0x85);
                    self.emit(lo);
                    self.emit(0x85);
                    self.emit(hi);
                    self.emit(0xA2);
                    self.emit(0x08); // LDX #8
                    let loop_top = self.current_addr();
                    self.emit(0x46);
                    self.emit(mr); // LSR mr
                    self.emit(0x90);
                    let bcc = self.code.len();
                    self.emit(0x00); // BCC skip
                    self.emit(0x18); // CLC
                    self.emit(0xA5);
                    self.emit(lo);
                    self.emit(0x65);
                    self.emit(mc_lo);
                    self.emit(0x85);
                    self.emit(lo);
                    self.emit(0xA5);
                    self.emit(hi);
                    self.emit(0x65);
                    self.emit(mc_hi);
                    self.emit(0x85);
                    self.emit(hi);
                    let skip = self.current_addr();
                    self.patch_bxx(bcc, skip);
                    self.emit(0x06);
                    self.emit(mc_lo); // ASL mc_lo
                    self.emit(0x26);
                    self.emit(mc_hi); // ROL mc_hi
                    self.emit(0xCA); // DEX
                    self.emit(0xD0);
                    let bne = self.code.len();
                    self.emit(0x00);
                    self.patch_bxx(bne, loop_top);
                } else {
                    // Q8.8 × int (or word × int): 16×8, l as 16-bit mc, r as 8-bit multiplier
                    let mc_lo = self.tmp_zp;
                    self.tmp_zp += 1;
                    let mc_hi = self.tmp_zp;
                    self.tmp_zp += 1;
                    let mr = self.tmp_zp;
                    self.tmp_zp += 1;
                    let (l, r) = (l.clone(), r.clone());
                    self.eval_expr_word(&l, mc_lo, mc_hi);
                    self.eval_expr(&r); // 8-bit multiplier
                    self.emit(0x85);
                    self.emit(mr);
                    self.emit(0xA9);
                    self.emit(0x00);
                    self.emit(0x85);
                    self.emit(lo);
                    self.emit(0x85);
                    self.emit(hi);
                    self.emit(0xA2);
                    self.emit(0x08); // LDX #8
                    let loop_top = self.current_addr();
                    self.emit(0x46);
                    self.emit(mr); // LSR mr
                    self.emit(0x90);
                    let bcc = self.code.len();
                    self.emit(0x00); // BCC skip
                    self.emit(0x18); // CLC
                    self.emit(0xA5);
                    self.emit(lo);
                    self.emit(0x65);
                    self.emit(mc_lo);
                    self.emit(0x85);
                    self.emit(lo);
                    self.emit(0xA5);
                    self.emit(hi);
                    self.emit(0x65);
                    self.emit(mc_hi);
                    self.emit(0x85);
                    self.emit(hi);
                    let skip = self.current_addr();
                    self.patch_bxx(bcc, skip);
                    self.emit(0x06);
                    self.emit(mc_lo); // ASL mc_lo
                    self.emit(0x26);
                    self.emit(mc_hi); // ROL mc_hi
                    self.emit(0xCA); // DEX
                    self.emit(0xD0);
                    let bne = self.code.len();
                    self.emit(0x00);
                    self.patch_bxx(bne, loop_top);
                }
            }
            Expr::BinOp(l, BinOp::Shl, r) => {
                let l = l.clone();
                self.eval_expr_word(&l, lo, hi);
                match r.as_ref() {
                    Expr::Number(n) => {
                        let n = (*n as usize).min(15);
                        for _ in 0..n {
                            self.emit(0x06);
                            self.emit(lo); // ASL lo
                            self.emit(0x26);
                            self.emit(hi); // ROL hi
                        }
                    }
                    other => {
                        let other = other.clone();
                        let cnt = self.tmp_zp;
                        self.tmp_zp += 1;
                        self.eval_expr(&other);
                        self.emit(0xF0);
                        let beq_done = self.code.len();
                        self.emit(0x00);
                        self.emit(0x85);
                        self.emit(cnt);
                        let loop_top = self.current_addr();
                        self.emit(0x06);
                        self.emit(lo);
                        self.emit(0x26);
                        self.emit(hi);
                        self.emit(0xC6);
                        self.emit(cnt);
                        self.emit(0xD0);
                        let bne = self.code.len();
                        self.emit(0x00);
                        let done = self.current_addr();
                        self.patch_bxx(bne, loop_top);
                        self.patch_bxx(beq_done, done);
                    }
                }
            }
            Expr::BinOp(l, BinOp::Shr, r) => {
                let l = l.clone();
                self.eval_expr_word(&l, lo, hi);
                match r.as_ref() {
                    Expr::Number(n) => {
                        let n = (*n as usize).min(15);
                        for _ in 0..n {
                            self.emit(0x46);
                            self.emit(hi); // LSR hi (MSB first)
                            self.emit(0x66);
                            self.emit(lo); // ROR lo
                        }
                    }
                    other => {
                        let other = other.clone();
                        let cnt = self.tmp_zp;
                        self.tmp_zp += 1;
                        self.eval_expr(&other);
                        self.emit(0xF0);
                        let beq_done = self.code.len();
                        self.emit(0x00);
                        self.emit(0x85);
                        self.emit(cnt);
                        let loop_top = self.current_addr();
                        self.emit(0x46);
                        self.emit(hi);
                        self.emit(0x66);
                        self.emit(lo);
                        self.emit(0xC6);
                        self.emit(cnt);
                        self.emit(0xD0);
                        let bne = self.code.len();
                        self.emit(0x00);
                        let done = self.current_addr();
                        self.patch_bxx(bne, loop_top);
                        self.patch_bxx(beq_done, done);
                    }
                }
            }
            // 16÷8 division: 16-bit dividend / 8-bit divisor → 16-bit quotient.
            // For Q8.8 / int: treats Q8.8 raw bits as 16-bit integer, divides by r (integer).
            // Example: Q8.8(7.0) = 0x0700 / 2 = 0x0380 = Q8.8(3.5) ✓
            // For Q8.8 / Q8.8: eval_expr(r) returns hi byte (integer part), so divisor is
            // the integer part of the right operand (approximate — avoids 24÷16 complexity).
            Expr::BinOp(l, BinOp::Div, r) => {
                let dlo = self.tmp_zp;
                self.tmp_zp += 1;
                let dhi = self.tmp_zp;
                self.tmp_zp += 1;
                let div = self.tmp_zp;
                self.tmp_zp += 1;
                let rem = self.tmp_zp;
                self.tmp_zp += 1;
                let (l, r) = (l.clone(), r.clone());
                self.eval_expr_word(&l, dlo, dhi); // 16-bit dividend
                self.eval_expr(&r); // 8-bit divisor
                self.emit(0x85);
                self.emit(div);
                self.emit(0xA9);
                self.emit(0x00);
                self.emit(0x85);
                self.emit(rem); // rem = 0
                self.emit(0xA2);
                self.emit(0x10); // LDX #16
                let loop_top = self.current_addr();
                self.emit(0x06);
                self.emit(dlo); // ASL dlo (bit7 → carry)
                self.emit(0x26);
                self.emit(dhi); // ROL dhi (carry → bit0; bit7 → carry)
                self.emit(0x26);
                self.emit(rem); // ROL rem (carry from dhi's MSB)
                self.emit(0x38); // SEC
                self.emit(0xA5);
                self.emit(rem); // LDA rem
                self.emit(0xE5);
                self.emit(div); // SBC div
                self.emit(0x90);
                let bcc = self.code.len();
                self.emit(0x00); // BCC skip
                self.emit(0x85);
                self.emit(rem); // rem = rem - div (subtraction succeeded)
                self.emit(0xE6);
                self.emit(dlo); // INC dlo (set quotient bit)
                let skip = self.current_addr();
                self.patch_bxx(bcc, skip);
                self.emit(0xCA); // DEX
                self.emit(0xD0);
                let bne = self.code.len();
                self.emit(0x00); // BNE loop
                self.patch_bxx(bne, loop_top);
                // Quotient is in dlo/dhi
                self.emit(0xA5);
                self.emit(dlo);
                self.emit(0x85);
                self.emit(lo);
                self.emit(0xA5);
                self.emit(dhi);
                self.emit(0x85);
                self.emit(hi);
            }
            Expr::FixedLit(v) => {
                let v = *v;
                self.emit(0xA9);
                self.emit(v as u8); // LDA #lo
                self.emit(0x85);
                self.emit(lo); // STA lo
                self.emit(0xA9);
                self.emit((v >> 8) as u8); // LDA #hi
                self.emit(0x85);
                self.emit(hi); // STA hi
            }
            _ => {
                // Fallback: 8-bit eval, zero-extend
                let expr = expr.clone();
                self.eval_expr(&expr);
                self.emit(0x85);
                self.emit(lo);
                self.emit(0xA9);
                self.emit(0x00);
                self.emit(0x85);
                self.emit(hi);
            }
        }
    }

    /// Print Q8.8 fixed-point value at ZP `zp` (lo=frac) / `zp+1` (hi=int) as "N.DD" decimal.
    fn print_fixed(&mut self, zp: u8) {
        // 1. Print integer part (hi byte) as decimal
        let t_hi = self.tmp_zp;
        self.tmp_zp += 1;
        self.emit(0xA5);
        self.emit(zp + 1); // LDA hi
        self.emit(0x85);
        self.emit(t_hi); // STA t_hi
        self.print_decimal(t_hi);

        // 2. Print '.' ($2E in PETSCII)
        self.emit(0xA9);
        self.emit(0x2E); // LDA #'.'
        self.emit(0x20);
        self.emit16(CHROUT); // JSR $FFD2

        // 3. Compute (lo × 100) >> 8 → fractional decimal (0..99)
        //    Russian Peasant multiply: shift multiplicand right, add multiplier when bit set,
        //    double multiplier each iteration. After 8 iterations, res_hi = hi_byte(lo × 100).
        let mc = self.tmp_zp;
        self.tmp_zp += 1; // multiplicand (lo byte copy)
        let res_lo = self.tmp_zp;
        self.tmp_zp += 1; // result lo
        let res_hi = self.tmp_zp;
        self.tmp_zp += 1; // result hi (our answer)
        let mul_lo = self.tmp_zp;
        self.tmp_zp += 1; // multiplier lo (starts at 100)
        let mul_hi = self.tmp_zp;
        self.tmp_zp += 1; // multiplier hi (starts at 0)

        self.emit(0xA5);
        self.emit(zp); // LDA lo
        self.emit(0x85);
        self.emit(mc); // STA mc
        self.emit(0xA9);
        self.emit(0x00);
        self.emit(0x85);
        self.emit(res_lo); // res_lo = 0
        self.emit(0x85);
        self.emit(res_hi); // res_hi = 0
        self.emit(0xA9);
        self.emit(100u8); // LDA #100
        self.emit(0x85);
        self.emit(mul_lo); // mul_lo = 100
        self.emit(0xA9);
        self.emit(0x00);
        self.emit(0x85);
        self.emit(mul_hi); // mul_hi = 0
        self.emit(0xA2);
        self.emit(0x08); // LDX #8

        let loop_top = self.current_addr();
        self.emit(0x46);
        self.emit(mc); // LSR mc  (carry = bit0)
        self.emit(0x90);
        let bcc1 = self.code.len();
        self.emit(0x00); // BCC skip
        // add multiplier to result (16-bit)
        self.emit(0x18); // CLC
        self.emit(0xA5);
        self.emit(res_lo);
        self.emit(0x65);
        self.emit(mul_lo);
        self.emit(0x85);
        self.emit(res_lo); // res_lo += mul_lo
        self.emit(0xA5);
        self.emit(res_hi);
        self.emit(0x65);
        self.emit(mul_hi);
        self.emit(0x85);
        self.emit(res_hi); // res_hi += mul_hi + carry
        let skip1 = self.current_addr();
        self.patch_bxx(bcc1, skip1);
        // double multiplier
        self.emit(0x06);
        self.emit(mul_lo); // ASL mul_lo
        self.emit(0x26);
        self.emit(mul_hi); // ROL mul_hi
        self.emit(0xCA); // DEX
        self.emit(0xD0);
        let bne1 = self.code.len();
        self.emit(0x00); // BNE loop_top
        self.patch_bxx(bne1, loop_top);

        // 4. Print res_hi as zero-padded 2-digit decimal (0..99)
        //    tens = res_hi / 10;  units = res_hi mod 10
        let t_tens = self.tmp_zp;
        self.tmp_zp += 1;
        self.emit(0xA9);
        self.emit(0x00);
        self.emit(0x85);
        self.emit(t_tens); // t_tens = 0
        let div_top = self.current_addr();
        self.emit(0xA5);
        self.emit(res_hi);
        self.emit(0xC9);
        self.emit(10u8); // CMP #10
        self.emit(0x90);
        let bcc2 = self.code.len();
        self.emit(0x00); // BCC div_done
        self.emit(0x38); // SEC
        self.emit(0xE9);
        self.emit(10u8); // SBC #10
        self.emit(0x85);
        self.emit(res_hi); // STA res_hi (remainder)
        self.emit(0xE6);
        self.emit(t_tens); // INC t_tens
        self.emit(0x4C);
        self.emit16(div_top); // JMP div_top
        let div_done = self.current_addr();
        self.patch_bxx(bcc2, div_done);

        // print tens digit (always, even if 0)
        self.emit(0xA5);
        self.emit(t_tens);
        self.emit(0x09);
        self.emit(0x30); // ORA #'0'
        self.emit(0x20);
        self.emit16(CHROUT); // JSR $FFD2
        // print units digit
        self.emit(0xA5);
        self.emit(res_hi);
        self.emit(0x09);
        self.emit(0x30); // ORA #'0'
        self.emit(0x20);
        self.emit16(CHROUT); // JSR $FFD2
    }

    /// Print the 16-bit value at ZP `zp` (lo) / `zp+1` (hi) as decimal (0-65535).
    fn print_decimal_word(&mut self, zp: u8) {
        let t_lo = self.tmp_zp;
        self.tmp_zp += 1;
        let t_hi = self.tmp_zp;
        self.tmp_zp += 1;
        let t_lz = self.tmp_zp;
        self.tmp_zp += 1;
        // Copy working value
        self.emit(0xA5);
        self.emit(zp);
        self.emit(0x85);
        self.emit(t_lo);
        self.emit(0xA5);
        self.emit(zp + 1);
        self.emit(0x85);
        self.emit(t_hi);
        self.emit(0xA9);
        self.emit(0x01);
        self.emit(0x85);
        self.emit(t_lz); // lz=1
        // Divisors: 10000 ($2710), 1000 ($03E8), 100 ($0064), 10 ($000A)
        let divisors: &[(u8, u8)] = &[
            (0x10, 0x27), // 10000
            (0xE8, 0x03), // 1000
            (0x64, 0x00), // 100
            (0x0A, 0x00), // 10
        ];
        for &(div_lo, div_hi) in divisors {
            self.print_word_digit_loop(t_lo, t_hi, div_lo, div_hi, t_lz);
        }
        // Ones: always print
        self.emit(0xA5);
        self.emit(t_lo);
        self.emit(0x09);
        self.emit(0x30); // ORA #'0'
        self.emit(0x20);
        self.emit16(CHROUT);
    }

    /// Emit a single-digit extraction loop for `print_decimal_word`.
    /// Subtracts `div` repeatedly from `t_lo/t_hi`, counts in a fresh tmp byte,
    /// then prints the digit with leading-zero suppression via `t_lz`.
    fn print_word_digit_loop(&mut self, t_lo: u8, t_hi: u8, div_lo: u8, div_hi: u8, t_lz: u8) {
        let t_dig = self.tmp_zp;
        self.tmp_zp += 1;
        self.emit(0xA9);
        self.emit(0x00);
        self.emit(0x85);
        self.emit(t_dig); // t_dig = 0

        let loop_top = self.current_addr();
        // Compare t_hi vs div_hi
        self.emit(0xA5);
        self.emit(t_hi);
        self.emit(0xC9);
        self.emit(div_hi); // CMP #div_hi
        self.emit(0x90); // BCC → loop_done
        let bcc1_pos = self.code.len();
        self.emit(0x00);
        self.emit(0xD0); // BNE → do_sub (t_hi > div_hi)
        let bne1_pos = self.code.len();
        self.emit(0x00);
        // t_hi == div_hi: compare lo bytes
        self.emit(0xA5);
        self.emit(t_lo);
        self.emit(0xC9);
        self.emit(div_lo); // CMP #div_lo
        self.emit(0x90); // BCC → loop_done
        let bcc2_pos = self.code.len();
        self.emit(0x00);
        // do_sub:
        let do_sub = self.current_addr();
        self.patch_bxx(bne1_pos, do_sub);
        self.emit(0x38); // SEC
        self.emit(0xA5);
        self.emit(t_lo);
        self.emit(0xE9);
        self.emit(div_lo);
        self.emit(0x85);
        self.emit(t_lo);
        self.emit(0xA5);
        self.emit(t_hi);
        self.emit(0xE9);
        self.emit(div_hi);
        self.emit(0x85);
        self.emit(t_hi);
        self.emit(0xE6);
        self.emit(t_dig); // INC t_dig
        self.emit(0x4C);
        self.emit16(loop_top); // JMP loop_top
        let loop_done = self.current_addr();
        self.patch_bxx(bcc1_pos, loop_done);
        self.patch_bxx(bcc2_pos, loop_done);

        // Print digit with leading-zero suppression
        self.emit(0xA5);
        self.emit(t_dig);
        self.emit(0xD0);
        let bne_nonzero = self.code.len();
        self.emit(0x00); // BNE → print
        self.emit(0xA5);
        self.emit(t_lz);
        self.emit(0xD0);
        let bne_skip = self.code.len();
        self.emit(0x00); // BNE → skip
        let print_pos = self.current_addr();
        self.patch_bxx(bne_nonzero, print_pos);
        self.emit(0xA5);
        self.emit(t_dig);
        self.emit(0x09);
        self.emit(0x30); // ORA #'0'
        self.emit(0x20);
        self.emit16(CHROUT);
        self.emit(0xA9);
        self.emit(0x00);
        self.emit(0x85);
        self.emit(t_lz); // t_lz = 0
        self.emit(0x4C);
        let jmp_pos = self.code.len();
        self.emit16(0x0000);
        let skip_pos = self.current_addr();
        self.patch_bxx(bne_skip, skip_pos);
        let after = self.current_addr();
        self.patch_abs(jmp_pos, after);
    }

    fn patch_bxx(&mut self, offset_pos: usize, target: u16) {
        // offset_pos = index of the branch offset byte in self.code
        // after branch instr = load_addr + offset_pos + 1
        let after = self.load_addr as i32 + offset_pos as i32 + 1;
        self.code[offset_pos] = (target as i32 - after) as u8;
    }

    fn patch_abs(&mut self, lo_pos: usize, target: u16) {
        self.code[lo_pos] = target as u8;
        self.code[lo_pos + 1] = (target >> 8) as u8;
    }

    fn emit_store_expr_u8(&mut self, expr: &Expr, zp: u8) {
        let expr = expr.clone();
        self.eval_expr(&expr);
        self.emit(0x85);
        self.emit(zp);
    }

    fn emit_store_expr_u16(&mut self, expr: &Expr, zp: u8) {
        match expr {
            Expr::Number(n) => {
                let value = *n as u16;
                self.emit(0xA9);
                self.emit(value as u8);
                self.emit(0x85);
                self.emit(zp);
                self.emit(0xA9);
                self.emit((value >> 8) as u8);
                self.emit(0x85);
                self.emit(zp + 1);
            }
            Expr::Var(name) if matches!(self.var_types.get(name), Some(VarType::Word)) => {
                if let Some(vz) = self.var_addr(name) {
                    self.emit(0xA5);
                    self.emit(vz);
                    self.emit(0x85);
                    self.emit(zp);
                    self.emit(0xA5);
                    self.emit(vz + 1);
                    self.emit(0x85);
                    self.emit(zp + 1);
                }
            }
            _ => {
                let expr = expr.clone();
                self.eval_expr(&expr);
                self.emit(0x85);
                self.emit(zp);
                self.emit(0xA9);
                self.emit(0x00);
                self.emit(0x85);
                self.emit(zp + 1);
            }
        }
    }

    // Convert 8-bit ZP value to decimal ASCII string stored at dest_addr.
    // Always writes 3 chars + null terminator: "042\0"
    fn emit_int_to_str(&mut self, zp_src: u8, dest_addr: u16) {
        let t_val = self.tmp_zp;
        self.tmp_zp += 1;

        self.emit(0xA5);
        self.emit(zp_src);
        self.emit(0x85);
        self.emit(t_val);

        self.store_digit(t_val, 100, dest_addr);
        self.store_digit(t_val, 10, dest_addr.wrapping_add(1));

        // ones = remainder
        self.emit(0xA5);
        self.emit(t_val);
        self.emit(0x09);
        self.emit(0x30); // ORA #'0'
        self.emit(0x8D);
        self.emit16(dest_addr.wrapping_add(2)); // STA dest+2

        // null terminator
        self.emit(0xA9);
        self.emit(0x00);
        self.emit(0x8D);
        self.emit16(dest_addr.wrapping_add(3)); // STA dest+3
    }

    fn store_digit(&mut self, t_val: u8, div: u8, dest: u16) {
        let t_digit = self.tmp_zp;
        self.tmp_zp += 1;

        self.emit(0xA9);
        self.emit(0x00);
        self.emit(0x85);
        self.emit(t_digit); // t_digit = 0

        let lp = self.current_addr();
        self.emit(0xA5);
        self.emit(t_val);
        self.emit(0xC9);
        self.emit(div); // CMP #div
        self.emit(0x90);
        let bcc = self.code.len();
        self.emit(0x00); // BCC done
        self.emit(0x38);
        self.emit(0xE9);
        self.emit(div); // SBC #div
        self.emit(0x85);
        self.emit(t_val);
        self.emit(0xE6);
        self.emit(t_digit); // INC t_digit
        self.emit(0x4C);
        self.emit16(lp);
        let done = self.current_addr();
        self.patch_bxx(bcc, done);

        self.emit(0xA5);
        self.emit(t_digit);
        self.emit(0x09);
        self.emit(0x30); // ORA #'0'
        self.emit(0x8D);
        self.emit16(dest); // STA dest
    }

    // Fast CLS: fill screen RAM $0400-$07FF with spaces, color RAM with white,
    // then reset cursor position via KERNAL home ($E566).
    fn emit_cls_fast(&mut self) {
        // Fill screen RAM $0400-$07FF (4 × 256 = 1024 bytes) with space ($20).
        // Uses X-register natural overflow: INX from $FF wraps to $00 → BNE exits.
        // This covers all 4 pages in one loop, same as the classic C64 technique.
        // ($07F8-$07FF are sprite pointers; overwriting with $20 is harmless in text mode.)
        self.emit(0xA9);
        self.emit(0x20); // LDA #$20
        self.emit(0xA2);
        self.emit(0x00); // LDX #0
        let lp1 = self.current_addr();
        self.emit(0x9D);
        self.emit16(0x0400); // STA $0400,X
        self.emit(0x9D);
        self.emit16(0x0500); // STA $0500,X
        self.emit(0x9D);
        self.emit16(0x0600); // STA $0600,X
        self.emit(0x9D);
        self.emit16(0x0700); // STA $0700,X
        self.emit(0xE8); // INX
        self.emit(0xD0); // BNE lp1 (exits when X wraps $FF→$00)
        let bne1 = self.code.len();
        self.emit(0x00);
        self.patch_bxx(bne1, lp1);

        // Fill color RAM $D800-$DBFF (4 × 256 = 1024 bytes) with white ($01).
        self.emit(0xA9);
        self.emit(0x01); // LDA #1 (white)
        self.emit(0xA2);
        self.emit(0x00); // LDX #0
        let lp2 = self.current_addr();
        self.emit(0x9D);
        self.emit16(0xD800); // STA $D800,X
        self.emit(0x9D);
        self.emit16(0xD900); // STA $D900,X
        self.emit(0x9D);
        self.emit16(0xDA00); // STA $DA00,X
        self.emit(0x9D);
        self.emit16(0xDB00); // STA $DB00,X
        self.emit(0xE8); // INX
        self.emit(0xD0); // BNE lp2
        let bne2 = self.code.len();
        self.emit(0x00);
        self.patch_bxx(bne2, lp2);

        // Cursor home
        self.emit(0x20);
        self.emit16(0xE566); // JSR $E566
    }

    // Graphics ON: C64 hires or multicolor bitmap mode at $2000, video matrix at $0400.
    // multi=false → standard hires 320×200 (1bpp); multi=true → multicolor 160×200 (2bpp).
    fn emit_graphics_on(&mut self, multi: bool) {
        // ── 0. Reset draw base to the single-buffer layout ($2000 / $0400) in
        //       case this follows a `graphics on double` session. ──────────────
        if let Some(base) = self.db_base_zp {
            self.emit(0xA9);
            self.emit(0x20);
            self.emit(0x85);
            self.emit(base);
        }
        if let Some(mtx) = self.db_mtx_zp {
            self.emit(0xA9);
            self.emit(0x04);
            self.emit(0x85);
            self.emit(mtx);
        }

        // ── 1. Blank display to avoid mode-switch glitch ──────────────────
        self.emit(0xAD);
        self.emit16(0xD011); // LDA $D011
        self.emit(0x29);
        self.emit(0xEF); // AND #$EF  (clear DEN=bit4 → blank)
        self.emit(0x8D);
        self.emit16(0xD011); // STA $D011

        // ── 2. Set VIC memory layout: bitmap @$2000, matrix @$0400 ────────
        self.emit(0xA9);
        self.emit(0x18); // LDA #$18
        self.emit(0x8D);
        self.emit16(0xD018); // STA $D018

        // ── 3. Set or clear MCM bit ($D016 bit4) ──────────────────────────
        self.emit(0xAD);
        self.emit16(0xD016); // LDA $D016
        if multi {
            self.emit(0x09);
            self.emit(0x10); // ORA #$10  (set MCM=bit4)
        } else {
            self.emit(0x29);
            self.emit(0xEF); // AND #$EF  (clear MCM=bit4)
        }
        self.emit(0x8D);
        self.emit16(0xD016); // STA $D016

        // ── 4. Set BMM — display stays blanked (DEN=0), user calls `display on` ──
        self.emit(0xAD);
        self.emit16(0xD011); // LDA $D011
        self.emit(0x09);
        self.emit(0x20); // ORA #$20  (set BMM=bit5 only; DEN stays 0)
        self.emit(0x8D);
        self.emit16(0xD011); // STA $D011
    }

    // Inline page-fill loop: store `fill` into `pages` pages starting at (start_hi*256).
    // Uses 3 scratch ZP bytes from tmp_zp.
    fn emit_fill_pages(&mut self, start_hi: u8, pages: u8, fill: u8) {
        let ptr_lo = self.tmp_zp;
        self.tmp_zp += 1;
        let ptr_hi = self.tmp_zp;
        self.tmp_zp += 1;
        let ctr = self.tmp_zp;
        self.tmp_zp += 1;
        self.emit(0xA9);
        self.emit(0x00);
        self.emit(0x85);
        self.emit(ptr_lo); // ptr_lo = 0
        self.emit(0xA9);
        self.emit(start_hi);
        self.emit(0x85);
        self.emit(ptr_hi); // ptr_hi = start_hi
        self.emit(0xA9);
        self.emit(pages);
        self.emit(0x85);
        self.emit(ctr); // ctr = pages
        self.emit(0xA9);
        self.emit(fill); // A = fill value
        let page_top = self.current_addr();
        self.emit(0xA0);
        self.emit(0x00); // LDY #0
        let byte_top = self.current_addr();
        self.emit(0x91);
        self.emit(ptr_lo); // STA (ptr),Y
        self.emit(0xC8); // INY
        self.emit(0xD0);
        let b1 = self.code.len();
        self.emit(0x00); // BNE byte_top
        self.patch_bxx(b1, byte_top);
        self.emit(0xE6);
        self.emit(ptr_hi); // INC ptr_hi
        self.emit(0xC6);
        self.emit(ctr); // DEC ctr
        self.emit(0xD0);
        let b2 = self.code.len();
        self.emit(0x00); // BNE page_top
        self.patch_bxx(b2, page_top);
    }

    // Graphics ON DOUBLE: double-buffered hires bitmap.
    //   Buffer A: bitmap $2000, matrix $0400, VIC bank 0 ($DD00 low = %11)
    //   Buffer B: bitmap $6000, matrix $4400, VIC bank 1 ($DD00 low = %10)
    // Both buffers use $D018=$18 (same offsets within their bank); only $DD00 selects
    // which is shown. After setup: A is shown, drawing is directed to hidden buffer B.
    // Requires $4000-$7FFF free of program code (matrix $4400, bitmap $6000-$7FFF).
    fn emit_graphics_on_double(&mut self) {
        // 1. Blank display (clear DEN) to avoid mode-switch glitch.
        self.emit(0xAD);
        self.emit16(0xD011);
        self.emit(0x29);
        self.emit(0xEF);
        self.emit(0x8D);
        self.emit16(0xD011);

        // 2. $D018 = $18 (matrix offset $0400, bitmap offset $2000 within bank).
        self.emit(0xA9);
        self.emit(0x18);
        self.emit(0x8D);
        self.emit16(0xD018);

        // 3. Clear MCM (hires).
        self.emit(0xAD);
        self.emit16(0xD016);
        self.emit(0x29);
        self.emit(0xEF);
        self.emit(0x8D);
        self.emit16(0xD016);

        // 4. Set BMM (DEN stays 0 — user calls `display on` after first flip).
        self.emit(0xAD);
        self.emit16(0xD011);
        self.emit(0x09);
        self.emit(0x20);
        self.emit(0x8D);
        self.emit16(0xD011);

        // 5. Show buffer A: CIA2 VIC bank 0 → $DD00 low bits = %11.
        self.emit(0xAD);
        self.emit16(0xDD00);
        self.emit(0x29);
        self.emit(0xFC);
        self.emit(0x09);
        self.emit(0x03);
        self.emit(0x8D);
        self.emit16(0xDD00);

        // 6. Pre-clear both buffers so neither shows garbage before it is drawn.
        self.emit_fill_pages(0x20, 0x20, 0x00); // A bitmap $2000-$3FFF = 0
        self.emit_fill_pages(0x04, 0x04, 0x10); // A matrix  $0400-$07FF = $10
        self.emit_fill_pages(0x60, 0x20, 0x00); // B bitmap $6000-$7FFF = 0
        self.emit_fill_pages(0x44, 0x04, 0x10); // B matrix  $4400-$47FF = $10

        // 7. Direct drawing into the hidden back buffer B.
        if let Some(base) = self.db_base_zp {
            self.emit(0xA9);
            self.emit(0x60);
            self.emit(0x85);
            self.emit(base);
        }
        if let Some(mtx) = self.db_mtx_zp {
            self.emit(0xA9);
            self.emit(0x44);
            self.emit(0x85);
            self.emit(mtx);
        }
    }

    // Flip: show the buffer that was just drawn (the hidden one) and redirect drawing to
    // the other. Waits for the lower border (raster >= 251) first so the bank switch is
    // tear-free. db_base holds the hidden/draw buffer's bitmap hi byte ($20 or $60).
    fn emit_flip(&mut self) {
        let (base, mtx) = match (self.db_base_zp, self.db_mtx_zp) {
            (Some(b), Some(m)) => (b, m),
            _ => return, // no double-buffer state allocated — nothing to flip
        };

        // Wait until raster line >= 251 (lower border, past the visible bitmap).
        let wait_top = self.current_addr();
        self.emit(0xAD);
        self.emit16(0xD012); // LDA $D012
        self.emit(0xC9);
        self.emit(0xFB); // CMP #251
        self.emit(0x90);
        let bcc = self.code.len();
        self.emit(0x00); // BCC wait_top
        self.patch_bxx(bcc, wait_top);

        // Branch on which buffer we just drew.
        self.emit(0xA5);
        self.emit(base); // LDA db_base
        self.emit(0xC9);
        self.emit(0x60); // CMP #$60
        self.emit(0xF0);
        let beq_drew_b = self.code.len();
        self.emit(0x00); // BEQ drew_b

        // drew A ($20): show A (bank %11), draw into B ($60 / $44).
        self.emit(0xAD);
        self.emit16(0xDD00);
        self.emit(0x29);
        self.emit(0xFC);
        self.emit(0x09);
        self.emit(0x03);
        self.emit(0x8D);
        self.emit16(0xDD00);
        self.emit(0xA9);
        self.emit(0x60);
        self.emit(0x85);
        self.emit(base);
        self.emit(0xA9);
        self.emit(0x44);
        self.emit(0x85);
        self.emit(mtx);
        self.emit(0x4C);
        let jmp_done = self.code.len();
        self.emit16(0x0000); // JMP done

        // drew B ($60): show B (bank %10), draw into A ($20 / $04).
        self.patch_bxx(beq_drew_b, self.current_addr());
        self.emit(0xAD);
        self.emit16(0xDD00);
        self.emit(0x29);
        self.emit(0xFC);
        self.emit(0x09);
        self.emit(0x02);
        self.emit(0x8D);
        self.emit16(0xDD00);
        self.emit(0xA9);
        self.emit(0x20);
        self.emit(0x85);
        self.emit(base);
        self.emit(0xA9);
        self.emit(0x04);
        self.emit(0x85);
        self.emit(mtx);

        // done:
        let done = self.current_addr();
        self.code[jmp_done] = done as u8;
        self.code[jmp_done + 1] = (done >> 8) as u8;
    }

    // Graphics OFF: back to text mode with display blanking around the switch.
    fn emit_graphics_off(&mut self) {
        self.fourxfour_mode = false;
        // ── 1. Blank display ──────────────────────────────────────────────
        self.emit(0xAD);
        self.emit16(0xD011); // LDA $D011
        self.emit(0x29);
        self.emit(0xEF); // AND #$EF  (clear DEN → blank)
        self.emit(0x8D);
        self.emit16(0xD011); // STA $D011

        // ── 2. Clear MCM ($D016): 40-col text, single-color ───────────────
        self.emit(0xAD);
        self.emit16(0xD016); // LDA $D016
        self.emit(0x29);
        self.emit(0xEF); // AND #$EF  (clear MCM=bit4)
        self.emit(0x09);
        self.emit(0x08); // ORA #$08  (set CSEL=bit3 → 40 cols)
        self.emit(0x8D);
        self.emit16(0xD016); // STA $D016

        // ── 3. Restore $D018: screen @$0400, char @$1000 ─────────────────
        self.emit(0xA9);
        self.emit(0x14); // LDA #$14
        self.emit(0x8D);
        self.emit16(0xD018); // STA $D018

        // ── 4. CIA2 VIC bank: bank 0 ($0000-$3FFF) ───────────────────────
        self.emit(0xAD);
        self.emit16(0xDD00); // LDA $DD00
        self.emit(0x29);
        self.emit(0xFC); // AND #$FC
        self.emit(0x09);
        self.emit(0x03); // ORA #$03
        self.emit(0x8D);
        self.emit16(0xDD00); // STA $DD00

        // ── 5. Unblank in text mode: clear BMM, set DEN + RSEL + YSCROLL=3
        self.emit(0xAD);
        self.emit16(0xD011); // LDA $D011
        self.emit(0x29);
        self.emit(0xDF); // AND #$DF  (clear BMM=bit5)
        self.emit(0x09);
        self.emit(0x1B); // ORA #$1B  (DEN+RSEL+YSCROLL=3)
        self.emit(0x8D);
        self.emit16(0xD011); // STA $D011
    }

    // Graphics ON BLOCK: 4×4 block pixel mode via custom charset at $2800.
    // Effective resolution 80×50 pixels (40 cols × 25 rows, each cell = 2×2 4-pixel blocks).
    // Character N encodes: bit3=top-left, bit2=top-right, bit1=bot-left, bit0=bot-right 4-pixel area.
    fn emit_graphics_on_block(&mut self) {
        // 1. Blank display to avoid glitch.
        self.emit(0xAD);
        self.emit16(0xD011); // LDA $D011
        self.emit(0x29);
        self.emit(0xEF); // AND #$EF  (clear DEN)
        self.emit(0x8D);
        self.emit16(0xD011); // STA $D011

        // 1a. Defensive reset of VIC state in case a prior program left it dirty
        //     (sprites enabled, MCM/ECM set, etc.). Prevents leftover sprites
        //     from rendering through the 4x4 block playfield.
        self.emit(0xA9);
        self.emit(0x00); // LDA #0
        self.emit(0x8D);
        self.emit16(0xD015); // STA $D015  (disable all 8 sprites)
        self.emit(0x8D);
        self.emit16(0xD01C); // STA $D01C  (clear sprite multicolor)
        self.emit(0x8D);
        self.emit16(0xD017); // STA $D017  (clear sprite Y-expand)
        self.emit(0x8D);
        self.emit16(0xD01D); // STA $D01D  (clear sprite X-expand)
        self.emit(0x8D);
        self.emit16(0xD01B); // STA $D01B  (clear sprite priority)
        // Clear MCM bit and force CSEL=40-col in $D016.
        self.emit(0xAD);
        self.emit16(0xD016); // LDA $D016
        self.emit(0x29);
        self.emit(0xEF); // AND #$EF  (clear MCM=bit4)
        self.emit(0x09);
        self.emit(0x08); // ORA #$08  (set CSEL=bit3, 40 cols)
        self.emit(0x8D);
        self.emit16(0xD016); // STA $D016
        // Force VIC bank 0 ($0000-$3FFF) so screen @$0400 and charset @$2800
        // are read from the same bank the CPU writes to.
        self.emit(0xAD);
        self.emit16(0xDD00); // LDA $DD00
        self.emit(0x29);
        self.emit(0xFC); // AND #$FC
        self.emit(0x09);
        self.emit(0x03); // ORA #$03
        self.emit(0x8D);
        self.emit16(0xDD00); // STA $DD00
        // Clear ECM bit in $D011 (will be re-asserted by step 4 below).
        // (Step 4's AND #$DF only clears BMM; ECM=bit6 needs explicit clear.)

        // 2. Build and copy the 16-char charset (128 bytes) to $2800.
        //    top_tab[n] = ((n>>3)&1)*0xF0 | ((n>>2)&1)*0x0F  (bits 3 and 2)
        //    bot_tab[n] = ((n>>1)&1)*0xF0 | ((n>>0)&1)*0x0F  (bits 1 and 0)
        //    Char n rows 0-3 = top_tab[n], rows 4-7 = bot_tab[n]
        let mut charset = [0u8; 128];
        for n in 0u8..16 {
            let top = if n & 8 != 0 { 0xF0u8 } else { 0 } | if n & 4 != 0 { 0x0Fu8 } else { 0 };
            let bot = if n & 2 != 0 { 0xF0u8 } else { 0 } | if n & 1 != 0 { 0x0Fu8 } else { 0 };
            for row in 0u8..8 {
                charset[(n as usize) * 8 + row as usize] = if row < 4 { top } else { bot };
            }
        }

        // JMP over the 128-byte charset data block.
        self.emit(0x4C);
        let jmp_pos = self.code.len();
        self.emit16(0x0000);

        let charset_addr = self.current_addr();
        for b in &charset {
            self.emit(*b);
        }

        let copy_start = self.current_addr();
        self.code[jmp_pos] = copy_start as u8;
        self.code[jmp_pos + 1] = (copy_start >> 8) as u8;

        // 2a. Zero the entire 2KB charset area $2800-$2FFF (8 pages) so that
        //     chars 16-255 render as blank (background color).  Prevents garbage
        //     from VICE RAM init or cursor-blink (char $80 = offset $2C00) from
        //     showing as stripes in the VIC display / overscan area.
        //     LDA #0; LDX #0; loop: STA $2800..2F00,X; INX; BNE loop
        self.emit(0xA9);
        self.emit(0x00); // LDA #0
        self.emit(0xA2);
        self.emit(0x00); // LDX #0
        let zero_loop = self.current_addr();
        self.emit(0x9D);
        self.emit(0x00);
        self.emit(0x28); // STA $2800,X
        self.emit(0x9D);
        self.emit(0x00);
        self.emit(0x29); // STA $2900,X
        self.emit(0x9D);
        self.emit(0x00);
        self.emit(0x2A); // STA $2A00,X
        self.emit(0x9D);
        self.emit(0x00);
        self.emit(0x2B); // STA $2B00,X
        self.emit(0x9D);
        self.emit(0x00);
        self.emit(0x2C); // STA $2C00,X
        self.emit(0x9D);
        self.emit(0x00);
        self.emit(0x2D); // STA $2D00,X
        self.emit(0x9D);
        self.emit(0x00);
        self.emit(0x2E); // STA $2E00,X
        self.emit(0x9D);
        self.emit(0x00);
        self.emit(0x2F); // STA $2F00,X
        self.emit(0xE8); // INX
        self.emit(0xD0);
        let bne_zero = self.code.len();
        self.emit(0x00);
        self.patch_bxx(bne_zero, zero_loop);

        // 2b. Copy our 16-char charset (128 bytes) from PRG → $2800-$287F,
        //     overwriting the first 128 zero bytes we just wrote.
        self.emit(0xA2);
        self.emit(127u8); // LDX #127
        let copy_loop = self.current_addr();
        self.emit(0xBD);
        self.emit16(charset_addr); // LDA charset_addr,X
        self.emit(0x9D);
        self.emit(0x00);
        self.emit(0x28); // STA $2800,X
        self.emit(0xCA); // DEX
        self.emit(0x10); // BPL copy_loop
        let bpl_pos = self.code.len();
        self.emit(0x00);
        self.patch_bxx(bpl_pos, copy_loop);

        // 3. Point VIC charset to $2800 and keep the screen matrix at $0400.
        //    $1A = screen@$0400 (bits7-4 = 0001), charset@$2800 (bits3-1 = 101).
        //    Direct write is idempotent; EOR would fail if re-entered without graphics off.
        self.emit(0xA9);
        self.emit(0x1A); // LDA #$1A
        self.emit(0x8D);
        self.emit16(0xD018); // STA $D018

        // 4. Canonical blanked text-mode state for block graphics: DEN=0, RSEL=1,
        //    YSCROLL=3, BMM=0, ECM=0. `display on` only sets DEN, so block mode
        //    must normalize the remaining bits here instead of inheriting prior VIC state.
        self.emit(0xA9);
        self.emit(0x0B); // LDA #$0B
        self.emit(0x8D);
        self.emit16(0xD011); // STA $D011

        self.fourxfour_mode = true;
    }

    // Gcls for 4×4 block mode: fill screen RAM ($0400-$07E7, 1000 bytes) with 0
    // and color RAM ($D800-$DBE7, 1000 bytes) with 1 (white pixels on background color).
    fn emit_gcls_block(&mut self) {
        // ── Screen RAM ($0400-$07E7) ← 0 (char 0 = all pixels off) ───────
        // Clear all 4 pages $0400-$07FF (1024 bytes) with a single INX/BNE page
        // loop so the WHOLE 1000-byte matrix — including the bottom rows
        // ($0700-$07E7) — is cleared. The extra $07E8-$07FF (incl. sprite
        // pointers) is harmless: sprites are disabled in block mode.
        // NOTE: a descending `LDX #231 … DEX BPL` loop is WRONG here — 231 = $E7
        // already has bit 7 set, so BPL exits after one iteration and leaves
        // $0700-$07E6 holding the KERNAL's leftover $20 spaces; plot4's ORA then
        // turns those into $2F (undefined char → blank), blanking the bottom rows.
        self.emit(0xA9);
        self.emit(0x00); // LDA #0
        self.emit(0xA2);
        self.emit(0x00); // LDX #0
        let top1 = self.current_addr();
        self.emit(0x9D);
        self.emit(0x00);
        self.emit(0x04); // STA $0400,X
        self.emit(0x9D);
        self.emit(0x00);
        self.emit(0x05); // STA $0500,X
        self.emit(0x9D);
        self.emit(0x00);
        self.emit(0x06); // STA $0600,X
        self.emit(0x9D);
        self.emit(0x00);
        self.emit(0x07); // STA $0700,X
        self.emit(0xE8); // INX
        self.emit(0xD0);
        let b1 = self.code.len();
        self.emit(0x00);
        self.patch_bxx(b1, top1);

        // ── Color RAM ($D800-$DBE7) ← 1 (white pixels) ───────────────────
        // Same 4-page INX/BNE clear ($D800-$DBFF), covering all 1000 cells incl.
        // the bottom rows. Without this the bottom color cells keep the default
        // $0E (light blue) — but since the char itself is blank the pixels show
        // background anyway; clearing keeps state consistent.
        self.emit(0xA9);
        self.emit(0x01); // LDA #1 (white)
        self.emit(0xA2);
        self.emit(0x00); // LDX #0
        let top3 = self.current_addr();
        self.emit(0x9D);
        self.emit(0x00);
        self.emit(0xD8); // STA $D800,X
        self.emit(0x9D);
        self.emit(0x00);
        self.emit(0xD9); // STA $D900,X
        self.emit(0x9D);
        self.emit(0x00);
        self.emit(0xDA); // STA $DA00,X
        self.emit(0x9D);
        self.emit(0x00);
        self.emit(0xDB); // STA $DB00,X
        self.emit(0xE8); // INX
        self.emit(0xD0);
        let b3 = self.code.len();
        self.emit(0x00);
        self.patch_bxx(b3, top3);
    }

    // Gcls: clear bitmap $2000-$3FFF (32 pages with $00) AND fill video matrix
    // $0400-$07FF (4 pages with $10 = white-on-black) so bitmap mode has clean colors.
    // In 4×4 block mode, clears screen RAM ($0400-$07E7) with char 0 and color RAM white.
    fn emit_gcls(&mut self) {
        if self.fourxfour_mode {
            self.emit_gcls_block();
            return;
        }
        let ptr_lo = self.tmp_zp;
        self.tmp_zp += 1;
        let ptr_hi = self.tmp_zp;
        self.tmp_zp += 1;
        let pg_ctr = self.tmp_zp;
        self.tmp_zp += 1;

        // ── 1. Zero-fill bitmap $2000-$3FFF (32 pages) ──────────────────────
        self.emit(0xA9);
        self.emit(0x00);
        self.emit(0x85);
        self.emit(ptr_lo); // ptr = draw bitmap base (lo=0)
        self.emit_lda_bmp_base(); // LDA db_base (hi byte; $20 default, $60 back buffer)
        self.emit(0x85);
        self.emit(ptr_hi);
        self.emit(0xA9);
        self.emit(0x20);
        self.emit(0x85);
        self.emit(pg_ctr); // 32 pages
        self.emit(0xA9);
        self.emit(0x00); // fill value = $00

        let bm_page_top = self.current_addr();
        self.emit(0xA0);
        self.emit(0x00); // LDY #0
        let bm_byte_top = self.current_addr();
        self.emit(0x91);
        self.emit(ptr_lo); // STA (ptr),Y
        self.emit(0xC8); // INY
        self.emit(0xD0); // BNE bm_byte_top
        let bne_bm_i = self.code.len();
        self.emit(0x00);
        self.patch_bxx(bne_bm_i, bm_byte_top);
        self.emit(0xE6);
        self.emit(ptr_hi); // INC ptr_hi
        self.emit(0xC6);
        self.emit(pg_ctr); // DEC pg_ctr
        self.emit(0xD0); // BNE bm_page_top
        let bne_bm_o = self.code.len();
        self.emit(0x00);
        self.patch_bxx(bne_bm_o, bm_page_top);

        // ── 2. Fill video matrix $0400-$07FF with $10 (white/black) ─────────
        // Hires bitmap: high nibble = foreground color, low nibble = background.
        // $10 = foreground 1 (white), background 0 (black).
        self.emit(0xA9);
        self.emit(0x00);
        self.emit(0x85);
        self.emit(ptr_lo); // ptr = draw matrix base (lo=0)
        self.emit_lda_mtx_base(); // LDA db_mtx (hi byte; $04 default, $44 back buffer)
        self.emit(0x85);
        self.emit(ptr_hi);
        self.emit(0xA9);
        self.emit(0x04);
        self.emit(0x85);
        self.emit(pg_ctr); // 4 pages
        self.emit(0xA9);
        self.emit(0x10); // fill value = $10

        let vm_page_top = self.current_addr();
        self.emit(0xA0);
        self.emit(0x00); // LDY #0
        let vm_byte_top = self.current_addr();
        self.emit(0x91);
        self.emit(ptr_lo); // STA (ptr),Y
        self.emit(0xC8); // INY
        self.emit(0xD0); // BNE vm_byte_top
        let bne_vm_i = self.code.len();
        self.emit(0x00);
        self.patch_bxx(bne_vm_i, vm_byte_top);
        self.emit(0xE6);
        self.emit(ptr_hi); // INC ptr_hi
        self.emit(0xC6);
        self.emit(pg_ctr); // DEC pg_ctr
        self.emit(0xD0); // BNE vm_page_top
        let bne_vm_o = self.code.len();
        self.emit(0x00);
        self.patch_bxx(bne_vm_o, vm_page_top);
    }

    // Emit `ADC db_base` (zero-page) when the bitmap draw base is dynamic (double-buffer
    // capable), else the classic `ADC #$20` immediate. Both are 2 bytes, so callers that
    // pre-computed branch offsets are unaffected.
    fn emit_adc_bmp_base(&mut self) {
        match self.db_base_zp {
            Some(z) => {
                self.emit(0x65);
                self.emit(z); // ADC db_base
            }
            None => {
                self.emit(0x69);
                self.emit(0x20); // ADC #$20
            }
        }
    }

    // `LDA db_base` (zp) or `LDA #$20` — high byte of the current draw bitmap base.
    fn emit_lda_bmp_base(&mut self) {
        match self.db_base_zp {
            Some(z) => {
                self.emit(0xA5);
                self.emit(z);
            }
            None => {
                self.emit(0xA9);
                self.emit(0x20);
            }
        }
    }

    // `LDA db_mtx` (zp) or `LDA #$04` — high byte of the current draw video-matrix base.
    fn emit_lda_mtx_base(&mut self) {
        match self.db_mtx_zp {
            Some(z) => {
                self.emit(0xA5);
                self.emit(z);
            }
            None => {
                self.emit(0xA9);
                self.emit(0x04);
            }
        }
    }

    // Plot helper subroutine (emitted once, called via JSR).
    // ZP layout: zp+0=X_lo, zp+1=X_hi, zp+2=Y, zp+3=b/mask, zp+4=ptr_lo, zp+5=ptr_hi
    // X: 0-319 (full bitmap width), Y: 0-199
    // Bitmap at $2000: byte = $2000 + (Y>>3)*320 + (X & $1F8) + (Y&7); bit = $80 >> (X&7)
    fn emit_plot_helper(&mut self) {
        let zp = match self.plot_zp {
            Some(z) => z,
            None => return,
        };

        // b = Y >> 3  (cell row, 0-24)
        self.emit(0xA5);
        self.emit(zp + 2); // LDA Y
        self.emit(0x4A); // LSR
        self.emit(0x4A); // LSR
        self.emit(0x4A); // LSR  → A = b
        self.emit(0x85);
        self.emit(zp + 3); // STA b

        // ptr_lo = (b*64) & $FF
        self.emit(0x0A); // ASL ×6
        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x85);
        self.emit(zp + 4); // STA ptr_lo

        // ptr_hi = b + (b>>2) + $20
        self.emit(0xA5);
        self.emit(zp + 3); // LDA b
        self.emit(0x4A); // LSR
        self.emit(0x4A); // LSR  → b>>2
        self.emit(0x18); // CLC
        self.emit(0x65);
        self.emit(zp + 3); // ADC b
        self.emit_adc_bmp_base(); // ADC db_base (or #$20)
        self.emit(0x85);
        self.emit(zp + 5); // STA ptr_hi

        // ptr_lo += X_lo & $F8  (low part of cell_col*8)
        self.emit(0xA5);
        self.emit(zp + 0); // LDA X_lo
        self.emit(0x29);
        self.emit(0xF8); // AND #$F8
        self.emit(0x18); // CLC
        self.emit(0x65);
        self.emit(zp + 4); // ADC ptr_lo
        self.emit(0x85);
        self.emit(zp + 4); // STA ptr_lo
        self.emit(0x90); // BCC skip_inc1
        let bcc1 = self.code.len();
        self.emit(0x00);
        self.emit(0xE6);
        self.emit(zp + 5); // INC ptr_hi
        self.patch_bxx(bcc1, self.current_addr());

        // If X_hi != 0 (X >= 256): add 1 to ptr_hi (X & $100 contribution)
        self.emit(0xA5);
        self.emit(zp + 1); // LDA X_hi
        self.emit(0xF0); // BEQ skip_xhi
        let beq_xhi = self.code.len();
        self.emit(0x00);
        self.emit(0xE6);
        self.emit(zp + 5); // INC ptr_hi
        self.patch_bxx(beq_xhi, self.current_addr());

        // ptr_lo += Y & 7  (pixel row within cell)
        self.emit(0xA5);
        self.emit(zp + 2); // LDA Y
        self.emit(0x29);
        self.emit(0x07); // AND #$07
        self.emit(0x18); // CLC
        self.emit(0x65);
        self.emit(zp + 4); // ADC ptr_lo
        self.emit(0x85);
        self.emit(zp + 4); // STA ptr_lo
        self.emit(0x90); // BCC skip_inc2
        let bcc2 = self.code.len();
        self.emit(0x00);
        self.emit(0xE6);
        self.emit(zp + 5); // INC ptr_hi
        self.patch_bxx(bcc2, self.current_addr());

        // bit mask = $80 >> (X_lo & 7)  — pixel column within byte
        self.emit(0xA5);
        self.emit(zp + 0); // LDA X_lo
        self.emit(0x29);
        self.emit(0x07); // AND #$07
        self.emit(0xAA); // TAX  (shift count)
        self.emit(0xA9);
        self.emit(0x80); // LDA #$80
        self.emit(0xE0);
        self.emit(0x00); // CPX #$00
        self.emit(0xF0); // BEQ done_mask
        let beq_mask = self.code.len();
        self.emit(0x00);
        let shift_top = self.current_addr();
        self.emit(0x4A); // LSR
        self.emit(0xCA); // DEX
        self.emit(0xD0); // BNE shift_top
        let bne_shift = self.code.len();
        self.emit(0x00);
        self.patch_bxx(bne_shift, shift_top);
        self.patch_bxx(beq_mask, self.current_addr());

        // Set the pixel
        self.emit(0x85);
        self.emit(zp + 3); // STA mask (reuse b slot)
        self.emit(0xA0);
        self.emit(0x00); // LDY #0
        self.emit(0xB1);
        self.emit(zp + 4); // LDA (ptr_lo),Y
        self.emit(0x05);
        self.emit(zp + 3); // ORA mask
        self.emit(0x91);
        self.emit(zp + 4); // STA (ptr_lo),Y
        self.emit(0x60); // RTS
    }

    /// Multicolor bitmap pixel helper.
    ///
    /// ZP layout (7 bytes, base = mplot_zp):
    ///   +0 = x (0–159)   +1 = y (0–199)   +2 = color (0–3)
    ///   +3 = scratch_a   +4 = ptr_lo       +5 = ptr_hi   +6 = scratch_b
    ///
    /// Address formula: $2000 + (y>>3)*320 + (x>>2)*8 + (y&7)
    ///   same row calc as hires; column offset = (x>>2)<<3 (with possible carry for x≥128)
    /// Emit the str$(n) helper subroutine + 4-byte result buffer.
    /// Input:  A = 8-bit value (0–255)
    /// Output: strn_zp/strn_zp+1 point to "NNN\0" (3 decimal digits + null, overwritten in-place)
    /// Returns the address of the helper entry point.
    fn emit_strn_helper(&mut self) -> u16 {
        let strn_tmp = self.strn_tmp_zp.expect("strn_tmp_zp not allocated");
        let strn_zp = self.strn_zp.expect("strn_zp not allocated");
        let helper_addr = self.current_addr();

        // Save input value
        self.emit(0x85);
        self.emit(strn_tmp); // STA strn_tmp

        // --- hundreds digit ---
        self.emit(0xA9);
        self.emit(0x30); // LDA #'0'
        self.emit(0x8D);
        let p0 = self.code.len();
        self.emit16(0x0000); // STA buf+0 (patch)
        let h_loop = self.current_addr();
        self.emit(0xA5);
        self.emit(strn_tmp); // LDA strn_tmp
        self.emit(0xC9);
        self.emit(100); // CMP #100
        self.emit(0x90);
        let h_bcc = self.code.len();
        self.emit(0x00); // BCC h_done
        self.emit(0x38); // SEC
        self.emit(0xE9);
        self.emit(100); // SBC #100
        self.emit(0x85);
        self.emit(strn_tmp); // STA strn_tmp
        self.emit(0xEE);
        let p0b = self.code.len();
        self.emit16(0x0000); // INC buf+0 (patch)
        self.emit(0x4C);
        self.emit16(h_loop); // JMP h_loop
        let h_done = self.current_addr();
        self.patch_bxx(h_bcc, h_done);

        // --- tens digit ---
        self.emit(0xA9);
        self.emit(0x30); // LDA #'0'
        self.emit(0x8D);
        let p1 = self.code.len();
        self.emit16(0x0000); // STA buf+1 (patch)
        let t_loop = self.current_addr();
        self.emit(0xA5);
        self.emit(strn_tmp); // LDA strn_tmp
        self.emit(0xC9);
        self.emit(10); // CMP #10
        self.emit(0x90);
        let t_bcc = self.code.len();
        self.emit(0x00); // BCC t_done
        self.emit(0x38); // SEC
        self.emit(0xE9);
        self.emit(10); // SBC #10
        self.emit(0x85);
        self.emit(strn_tmp); // STA strn_tmp
        self.emit(0xEE);
        let p1b = self.code.len();
        self.emit16(0x0000); // INC buf+1 (patch)
        self.emit(0x4C);
        self.emit16(t_loop); // JMP t_loop
        let t_done = self.current_addr();
        self.patch_bxx(t_bcc, t_done);

        // --- ones digit ---
        self.emit(0xA5);
        self.emit(strn_tmp); // LDA strn_tmp (remainder 0-9)
        self.emit(0x09);
        self.emit(0x30); // ORA #'0'  (add ASCII offset)
        self.emit(0x8D);
        let p2 = self.code.len();
        self.emit16(0x0000); // STA buf+2 (patch)

        // --- null terminator ---
        self.emit(0xA9);
        self.emit(0x00); // LDA #0
        self.emit(0x8D);
        let p3 = self.code.len();
        self.emit16(0x0000); // STA buf+3 (patch)

        // --- set ZP ptr to buf ---
        self.emit(0xA9);
        let plo = self.code.len();
        self.emit(0x00); // LDA #<buf (patch)
        self.emit(0x85);
        self.emit(strn_zp); // STA strn_zp
        self.emit(0xA9);
        let phi = self.code.len();
        self.emit(0x00); // LDA #>buf (patch)
        self.emit(0x85);
        self.emit(strn_zp + 1); // STA strn_zp+1

        self.emit(0x60); // RTS

        // 4-byte result buffer — overwritten at runtime with "NNN\0"
        let buf_addr = self.current_addr();
        self.emit(0x30);
        self.emit(0x30);
        self.emit(0x30);
        self.emit(0x00); // "000\0"

        // Patch all absolute address references inside the helper
        let buf0 = buf_addr;
        let buf1 = buf_addr + 1;
        let buf2 = buf_addr + 2;
        let buf3 = buf_addr + 3;

        for &pos in &[p0, p0b] {
            self.code[pos] = buf0 as u8;
            self.code[pos + 1] = (buf0 >> 8) as u8;
        }
        for &pos in &[p1, p1b] {
            self.code[pos] = buf1 as u8;
            self.code[pos + 1] = (buf1 >> 8) as u8;
        }
        self.code[p2] = buf2 as u8;
        self.code[p2 + 1] = (buf2 >> 8) as u8;
        self.code[p3] = buf3 as u8;
        self.code[p3 + 1] = (buf3 >> 8) as u8;
        self.code[plo] = buf0 as u8;
        self.code[phi] = (buf0 >> 8) as u8;

        helper_addr
    }

    fn emit_mplot_helper(&mut self) {
        let zp = match self.mplot_zp {
            Some(z) => z,
            None => return,
        };

        // ── Step 1: b = y >> 3 ───────────────────────────────────────────
        self.emit(0xA5);
        self.emit(zp + 1); // LDA y
        self.emit(0x4A);
        self.emit(0x4A);
        self.emit(0x4A); // LSR×3 → b
        self.emit(0x85);
        self.emit(zp + 3); // STA b (scratch_a)

        // ── Step 2: ptr_lo = b<<6 ────────────────────────────────────────
        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x0A); // ASL×6
        self.emit(0x85);
        self.emit(zp + 4); // STA ptr_lo

        // ── Step 3: ptr_hi = b + (b>>2) + $20 ───────────────────────────
        self.emit(0xA5);
        self.emit(zp + 3); // LDA b
        self.emit(0x4A);
        self.emit(0x4A); // LSR×2 → b>>2
        self.emit(0x18); // CLC
        self.emit(0x65);
        self.emit(zp + 3); // ADC b
        self.emit(0x69);
        self.emit(0x20); // ADC #$20
        self.emit(0x85);
        self.emit(zp + 5); // STA ptr_hi

        // ── Step 4: column offset = (x>>2)<<3, split lo + carry ─────────
        // (x>>2) = 0–39; (x>>2)<<3 = 0–312, overflows byte for x≥128
        self.emit(0xA5);
        self.emit(zp + 0); // LDA x
        self.emit(0x4A);
        self.emit(0x4A); // LSR×2 → x>>2
        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x0A); // ASL×3 → (x>>2)<<3; carry=1 if x≥128
        self.emit(0x85);
        self.emit(zp + 3); // STA col_lo (scratch_a)
        self.emit(0xA9);
        self.emit(0x00); // LDA #0 (no effect on carry)
        self.emit(0x69);
        self.emit(0x00); // ADC #0 → A = carry (0 or 1)
        self.emit(0x85);
        self.emit(zp + 6); // STA col_hi (scratch_b)
        // ptr_lo += col_lo; ptr_hi += col_hi + carry
        self.emit(0xA5);
        self.emit(zp + 4); // LDA ptr_lo
        self.emit(0x18); // CLC
        self.emit(0x65);
        self.emit(zp + 3); // ADC col_lo
        self.emit(0x85);
        self.emit(zp + 4); // STA ptr_lo
        self.emit(0xA5);
        self.emit(zp + 5); // LDA ptr_hi
        self.emit(0x65);
        self.emit(zp + 6); // ADC col_hi (+ carry from above)
        self.emit(0x85);
        self.emit(zp + 5); // STA ptr_hi

        // ── Step 5: ptr_lo += y & 7 ──────────────────────────────────────
        self.emit(0xA5);
        self.emit(zp + 1); // LDA y
        self.emit(0x29);
        self.emit(0x07); // AND #$07
        self.emit(0x18); // CLC
        self.emit(0x65);
        self.emit(zp + 4); // ADC ptr_lo
        self.emit(0x85);
        self.emit(zp + 4); // STA ptr_lo
        self.emit(0x90); // BCC skip_y7
        let bcc_y7 = self.code.len();
        self.emit(0x00);
        self.emit(0xE6);
        self.emit(zp + 5); // INC ptr_hi
        self.patch_bxx(bcc_y7, self.current_addr()); // skip_y7:

        // ── Step 6: pair = x & 3 ─────────────────────────────────────────
        self.emit(0xA5);
        self.emit(zp + 0); // LDA x
        self.emit(0x29);
        self.emit(0x03); // AND #$03 → pair (0–3)
        self.emit(0x85);
        self.emit(zp + 3); // STA pair (scratch_a)

        // ── Step 7: shift_count = (3 - pair) * 2  (→ 6, 4, 2, or 0) ────
        self.emit(0xA9);
        self.emit(0x03); // LDA #3
        self.emit(0x38); // SEC
        self.emit(0xE5);
        self.emit(zp + 3); // SBC pair
        self.emit(0x0A); // ASL → ×2
        self.emit(0x85);
        self.emit(zp + 6); // STA shift_count (scratch_b)

        // ── Step 8: and_mask = ~($03 << shift_count) ─────────────────────
        self.emit(0xA9);
        self.emit(0x03); // LDA #$03
        self.emit(0xA6);
        self.emit(zp + 6); // LDX shift_count
        self.emit(0xF0); // BEQ skip_msk
        let beq_msk = self.code.len();
        self.emit(0x00);
        let msk_loop = self.current_addr();
        self.emit(0x0A); // ASL
        self.emit(0xCA); // DEX
        self.emit(0xD0); // BNE msk_loop
        let bne_msk = self.code.len();
        self.emit(0x00);
        self.patch_bxx(bne_msk, msk_loop);
        self.patch_bxx(beq_msk, self.current_addr()); // skip_msk:
        self.emit(0x49);
        self.emit(0xFF); // EOR #$FF → and_mask
        self.emit(0x85);
        self.emit(zp + 3); // STA and_mask (scratch_a)

        // ── Step 9: set_bits = (color & 3) << shift_count ────────────────
        self.emit(0xA5);
        self.emit(zp + 2); // LDA color
        self.emit(0x29);
        self.emit(0x03); // AND #$03
        self.emit(0xA6);
        self.emit(zp + 6); // LDX shift_count
        self.emit(0xF0); // BEQ skip_clr
        let beq_clr = self.code.len();
        self.emit(0x00);
        let clr_loop = self.current_addr();
        self.emit(0x0A); // ASL
        self.emit(0xCA); // DEX
        self.emit(0xD0); // BNE clr_loop
        let bne_clr = self.code.len();
        self.emit(0x00);
        self.patch_bxx(bne_clr, clr_loop);
        self.patch_bxx(beq_clr, self.current_addr()); // skip_clr:
        // A = set_bits

        // ── Step 10: Read-Modify-Write the pixel byte ────────────────────
        self.emit(0x85);
        self.emit(zp + 6); // STA set_bits (scratch_b)
        self.emit(0xA0);
        self.emit(0x00); // LDY #0
        self.emit(0xB1);
        self.emit(zp + 4); // LDA (ptr_lo),Y
        self.emit(0x25);
        self.emit(zp + 3); // AND and_mask
        self.emit(0x05);
        self.emit(zp + 6); // ORA set_bits
        self.emit(0x91);
        self.emit(zp + 4); // STA (ptr_lo),Y
        self.emit(0x60); // RTS
    }

    /// 1351 mouse read helper.
    ///
    /// On first call: primes prev_raw_x / prev_raw_y from current POT values.
    /// On subsequent calls: charges SID POT capacitor, reads raw X/Y from
    /// $D419/$D41A, computes signed 7-bit deltas, updates accum_x / accum_y.
    ///
    /// Uses mouse_zp (6 bytes):
    ///   zp+0 = accum_x    (8-bit accumulated X position)
    ///   zp+1 = accum_y    (8-bit accumulated Y position, with EOR #$FF inversion)
    ///   zp+2 = prev_raw_x
    ///   zp+3 = prev_raw_y
    ///   zp+4 = init_flag  (0 = need init, 1 = ready)
    ///   zp+5 = tmp
    ///
    /// Trashes A, X, Y.
    fn emit_mouse_read_helper(&mut self) {
        let zp = self.mouse_zp.expect("mouse_read_helper: no ZP allocated");

        // ── Check init flag ──────────────────────────────────────────────
        self.emit(0xA5);
        self.emit(zp + 4); // LDA init_flag
        self.emit(0xD0);   // BNE @do_delta
        let bne_do_delta = self.code.len();
        self.emit(0x00);   // placeholder

        // ── First call: prime prev values + set default cursor position ──
        // JSR charge_delay (same charge method as do_delta for consistent POT)
        self.emit(0x20); // JSR
        let jsr_charge1 = self.code.len();
        self.emit16(0x0000); // placeholder → @charge_delay
        self.emit(0xA9);
        self.emit(152);    // LDA #152
        self.emit(0x85);
        self.emit(zp);     // STA accum_x
        self.emit(0xA9);
        self.emit(0x00);
        self.emit(0x85);
        self.emit(zp + 6); // STA accum_x_hi
        self.emit(0xA9);
        self.emit(100);    // LDA #100
        self.emit(0x85);
        self.emit(zp + 1); // STA accum_y
        self.emit(0xAD);
        self.emit(0x19);
        self.emit(0xD4);   // LDA $D419
        self.emit(0x85);
        self.emit(zp + 2); // STA prev_raw_x
        self.emit(0xAD);
        self.emit(0x1A);
        self.emit(0xD4);   // LDA $D41A
        self.emit(0x85);
        self.emit(zp + 3); // STA prev_raw_y
        self.emit(0xE6);
        self.emit(zp + 4); // INC init_flag
        self.emit(0xA5);
        self.emit(zp);     // LDA accum_x
        self.emit(0x60);   // RTS

        // ── @do_delta ────────────────────────────────────────────────────
        // Charge + delay + read — exactly like original game loop.
        let do_delta = self.current_addr();
        self.patch_bxx(bne_do_delta, do_delta);

        // jsr @charge_delay (charge $DC00 + ~516 cycle delay)
        self.emit(0x20); // JSR
        let jsr_charge2 = self.code.len();
        self.emit16(0x0000); // placeholder → @charge_delay

        // Read raw values
        self.emit(0xAD);
        self.emit(0x19);
        self.emit(0xD4); // LDA $D419
        self.emit(0x85);
        self.emit(zp + 5); // STA tmp = raw_x
        self.emit(0xAD);
        self.emit(0x1A);
        self.emit(0xD4); // LDA $D41A
        self.emit(0xAA);   // TAX  (raw_y → X)

        // ── X delta ──────────────────────────────────────────────────────
        self.emit(0xA5);
        self.emit(zp + 5); // LDA raw_x
        self.emit(0x38);   // SEC
        self.emit(0xE5);
        self.emit(zp + 2); // SBC prev_raw_x
        self.emit(0x29);
        self.emit(0x7F);   // AND #$7F
        self.emit(0xC9);
        self.emit(0x40);   // CMP #$40
        self.emit(0xB0);   // BCS @x_neg
        let bcs_x_neg = self.code.len();
        self.emit(0x00);   // placeholder

        // X positive: accum_x += delta >> 1  (update prev only if moved)
        self.emit(0x4A);   // LSR
        self.emit(0xF0);   // BEQ @x_done  (delta=0 → skip)
        let beq_x_pos = self.code.len();
        self.emit(0x00);
        self.emit(0x18);   // CLC
        self.emit(0x65);
        self.emit(zp);     // ADC accum_x
        self.emit(0x85);
        self.emit(zp);     // STA accum_x
        self.emit(0x90);   // BCC @x_nocarry
        let bcc_x_carry = self.code.len();
        self.emit(0x00);
        self.emit(0xE6);
        self.emit(zp + 6); // INC accum_x_hi
        // @x_nocarry:
        let x_nocarry = self.current_addr();
        self.patch_bxx(bcc_x_carry, x_nocarry);
        // Update prev_raw_x (only when moved)
        self.emit(0xA5);
        self.emit(zp + 5); // LDA raw_x
        self.emit(0x85);
        self.emit(zp + 2); // STA prev_raw_x
        self.emit(0x4C);   // JMP @x_done
        let jmp_x_pos = self.code.len();
        self.emit16(0x0000);

        // @x_neg:
        let x_neg = self.current_addr();
        self.patch_bxx(bcs_x_neg, x_neg);
        self.emit(0x09);
        self.emit(0xC0);   // ORA #$C0
        self.emit(0xC9);
        self.emit(0xFF);   // CMP #$FF
        self.emit(0xF0);   // BEQ @x_done ($FF = no movement)
        let beq_x_neg = self.code.len();
        self.emit(0x00);
        self.emit(0x38);   // SEC
        self.emit(0x6A);   // ROR (sign-extended)
        self.emit(0x18);   // CLC
        self.emit(0x65);
        self.emit(zp);     // ADC accum_x
        self.emit(0x85);
        self.emit(zp);     // STA accum_x
        self.emit(0xB0);   // BCS @x_noborrow (carry = no borrow)
        let bcs_x_borrow = self.code.len();
        self.emit(0x00);
        self.emit(0xC6);
        self.emit(zp + 6); // DEC accum_x_hi (borrow)
        // @x_noborrow:
        let x_noborrow = self.current_addr();
        self.patch_bxx(bcs_x_borrow, x_noborrow);
        // Update prev_raw_x (only when moved)
        self.emit(0xA5);
        self.emit(zp + 5); // LDA raw_x
        self.emit(0x85);
        self.emit(zp + 2); // STA prev_raw_x

        // @x_done:
        let x_done = self.current_addr();
        self.patch_bxx(beq_x_pos, x_done);
        self.patch_bxx(beq_x_neg, x_done);
        self.patch_abs(jmp_x_pos, x_done);

        // ── Y delta (with EOR #$FF inversion) ───────────────────────────
        self.emit(0x8A);   // TXA (A = raw_y)
        self.emit(0x38);   // SEC
        self.emit(0xE5);
        self.emit(zp + 3); // SBC prev_raw_y
        self.emit(0x29);
        self.emit(0x7F);   // AND #$7F
        self.emit(0xC9);
        self.emit(0x40);   // CMP #$40
        self.emit(0xB0);   // BCS @y_neg
        let bcs_y_neg = self.code.len();
        self.emit(0x00);

        // Y positive (inverted via EOR #$FF, update prev only if moved)
        self.emit(0x4A);   // LSR
        self.emit(0xF0);   // BEQ @y_done
        let beq_y_pos = self.code.len();
        self.emit(0x00);
        self.emit(0x49);
        self.emit(0xFF);   // EOR #$FF  (INVERT)
        self.emit(0x38);   // SEC
        self.emit(0x65);
        self.emit(zp + 1); // ADC accum_y
        self.emit(0x85);
        self.emit(zp + 1); // STA accum_y
        // Update prev_raw_y (only when moved)
        self.emit(0x8A);   // TXA (raw_y)
        self.emit(0x85);
        self.emit(zp + 3); // STA prev_raw_y
        self.emit(0x4C);   // JMP @y_done
        let jmp_y_pos = self.code.len();
        self.emit16(0x0000);

        // @y_neg:
        let y_neg = self.current_addr();
        self.patch_bxx(bcs_y_neg, y_neg);
        self.emit(0x09);
        self.emit(0xC0);   // ORA #$C0
        self.emit(0xC9);
        self.emit(0xFF);   // CMP #$FF
        self.emit(0xF0);   // BEQ @y_done
        let beq_y_neg = self.code.len();
        self.emit(0x00);
        self.emit(0x38);   // SEC
        self.emit(0x6A);   // ROR
        self.emit(0x49);
        self.emit(0xFF);   // EOR #$FF  (INVERT)
        self.emit(0x38);   // SEC
        self.emit(0x65);
        self.emit(zp + 1); // ADC accum_y
        self.emit(0x85);
        self.emit(zp + 1); // STA accum_y
        // Update prev_raw_y (only when moved)
        self.emit(0x8A);   // TXA (raw_y)
        self.emit(0x85);
        self.emit(zp + 3); // STA prev_raw_y

        // @y_done:
        let y_done = self.current_addr();
        self.patch_bxx(beq_y_pos, y_done);
        self.patch_bxx(beq_y_neg, y_done);
        self.patch_abs(jmp_y_pos, y_done);

        // ── Second POT sample (matches original .mouse x2) ──────────────
        // jsr @charge_delay
        self.emit(0x20); // JSR
        let jsr_charge3 = self.code.len();
        self.emit16(0x0000); // placeholder → @charge_delay
        self.emit(0xAD);
        self.emit(0x19);
        self.emit(0xD4); // LDA $D419
        self.emit(0x85);
        self.emit(zp + 5); // STA tmp = raw_x
        self.emit(0xAD);
        self.emit(0x1A);
        self.emit(0xD4); // LDA $D41A
        self.emit(0xAA);   // TAX  (raw_y → X)

        // ── X delta, second pass ────────────────────────────────────────
        self.emit(0xA5);
        self.emit(zp + 5); // LDA raw_x
        self.emit(0x38);   // SEC
        self.emit(0xE5);
        self.emit(zp + 2); // SBC prev_raw_x
        self.emit(0x29);
        self.emit(0x7F);   // AND #$7F
        self.emit(0xC9);
        self.emit(0x40);   // CMP #$40
        self.emit(0xB0);   // BCS @x2_neg
        let bcs_x2_neg = self.code.len();
        self.emit(0x00);
        // positive
        self.emit(0x4A);   // LSR
        self.emit(0xF0);   // BEQ @x2_done
        let beq_x2_pos = self.code.len();
        self.emit(0x00);
        self.emit(0x18);   // CLC
        self.emit(0x65);
        self.emit(zp);     // ADC accum_x
        self.emit(0x85);
        self.emit(zp);     // STA accum_x
        self.emit(0x90);   // BCC @x2_nocarry
        let bcc_x2_carry = self.code.len();
        self.emit(0x00);
        self.emit(0xE6);
        self.emit(zp + 6); // INC accum_x_hi
        let x2_nocarry = self.current_addr();
        self.patch_bxx(bcc_x2_carry, x2_nocarry);
        self.emit(0xA5);
        self.emit(zp + 5); // LDA raw_x
        self.emit(0x85);
        self.emit(zp + 2); // STA prev_raw_x
        self.emit(0x4C);   // JMP @x2_done
        let jmp_x2_pos = self.code.len();
        self.emit16(0x0000);
        // negative
        let x2_neg = self.current_addr();
        self.patch_bxx(bcs_x2_neg, x2_neg);
        self.emit(0x09);
        self.emit(0xC0);
        self.emit(0xC9);
        self.emit(0xFF);
        self.emit(0xF0);   // BEQ @x2_done
        let beq_x2_neg = self.code.len();
        self.emit(0x00);
        self.emit(0x38);   // SEC
        self.emit(0x6A);   // ROR
        self.emit(0x18);   // CLC
        self.emit(0x65);
        self.emit(zp);     // ADC accum_x
        self.emit(0x85);
        self.emit(zp);     // STA accum_x
        self.emit(0xB0);   // BCS @x2_noborrow
        let bcs_x2_borrow = self.code.len();
        self.emit(0x00);
        self.emit(0xC6);
        self.emit(zp + 6); // DEC accum_x_hi
        let x2_noborrow = self.current_addr();
        self.patch_bxx(bcs_x2_borrow, x2_noborrow);
        self.emit(0xA5);
        self.emit(zp + 5); // LDA raw_x
        self.emit(0x85);
        self.emit(zp + 2); // STA prev_raw_x

        let x2_done = self.current_addr();
        self.patch_bxx(beq_x2_pos, x2_done);
        self.patch_bxx(beq_x2_neg, x2_done);
        self.patch_abs(jmp_x2_pos, x2_done);

        // ── Y delta, second pass (inverted) ─────────────────────────────
        self.emit(0x8A);   // TXA (raw_y)
        self.emit(0x38);   // SEC
        self.emit(0xE5);
        self.emit(zp + 3); // SBC prev_raw_y
        self.emit(0x29);
        self.emit(0x7F);
        self.emit(0xC9);
        self.emit(0x40);
        self.emit(0xB0);   // BCS @y2_neg
        let bcs_y2_neg = self.code.len();
        self.emit(0x00);
        // positive
        self.emit(0x4A);   // LSR
        self.emit(0xF0);   // BEQ @y2_done
        let beq_y2_pos = self.code.len();
        self.emit(0x00);
        self.emit(0x49);
        self.emit(0xFF);   // EOR #$FF
        self.emit(0x38);   // SEC
        self.emit(0x65);
        self.emit(zp + 1); // ADC accum_y
        self.emit(0x85);
        self.emit(zp + 1); // STA accum_y
        self.emit(0x8A);   // TXA (raw_y)
        self.emit(0x85);
        self.emit(zp + 3); // STA prev_raw_y
        self.emit(0x4C);   // JMP @y2_done
        let jmp_y2_pos = self.code.len();
        self.emit16(0x0000);
        // negative
        let y2_neg = self.current_addr();
        self.patch_bxx(bcs_y2_neg, y2_neg);
        self.emit(0x09);
        self.emit(0xC0);
        self.emit(0xC9);
        self.emit(0xFF);
        self.emit(0xF0);   // BEQ @y2_done
        let beq_y2_neg = self.code.len();
        self.emit(0x00);
        self.emit(0x38);   // SEC
        self.emit(0x6A);   // ROR
        self.emit(0x49);
        self.emit(0xFF);   // EOR #$FF
        self.emit(0x38);   // SEC
        self.emit(0x65);
        self.emit(zp + 1); // ADC accum_y
        self.emit(0x85);
        self.emit(zp + 1); // STA accum_y
        self.emit(0x8A);   // TXA (raw_y)
        self.emit(0x85);
        self.emit(zp + 3); // STA prev_raw_y

        let y2_done = self.current_addr();
        self.patch_bxx(beq_y2_pos, y2_done);
        self.patch_bxx(beq_y2_neg, y2_done);
        self.patch_abs(jmp_y2_pos, y2_done);
        self.emit(0xA5);
        self.emit(zp);     // LDA accum_x_lo (return value for mouse_x())
        self.emit(0x60);   // RTS

        // ── @charge_delay subroutine ────────────────────────────────────
        // Set POT line high to power the 1351 mouse circuitry.
        // The 1351 mouse sends digital pulses – no discharge needed.
        let charge_delay = self.current_addr();
        // Patch all JSR calls to here
        self.patch_abs(jsr_charge1, charge_delay);
        self.patch_abs(jsr_charge2, charge_delay);
        self.patch_abs(jsr_charge3, charge_delay);
        self.emit(0xAD);
        self.emit(0x00);
        self.emit(0xDC);   // LDA $DC00
        self.emit(0x29);
        self.emit(0x3F);   // AND #$3F
        self.emit(0x09);
        self.emit(0x40);   // ORA #$40
        self.emit(0x8D);
        self.emit(0x00);
        self.emit(0xDC);   // STA $DC00
        self.emit(0xA2);
        self.emit(0x67);   // LDX #$67
        // @delay:
        let delay_loop = self.current_addr();
        self.emit(0xCA);   // DEX
        self.emit(0xD0);   // BNE @delay
        let bne_delay = self.code.len();
        self.emit(0x00);
        self.patch_bxx(bne_delay, delay_loop);
        self.emit(0x60);   // RTS
    }

    // Plot-erase helper: computes pixel address/mask identically to emit_plot_helper,
    // then clears (AND ~mask) the pixel instead of setting it.
    fn emit_plot_erase_helper(&mut self) {
        let zp = match self.plot_zp {
            Some(z) => z,
            None => return,
        };

        // ── Same address computation as emit_plot_helper ──────────────────
        self.emit(0xA5);
        self.emit(zp + 2);
        self.emit(0x4A);
        self.emit(0x4A);
        self.emit(0x4A);
        self.emit(0x85);
        self.emit(zp + 3);

        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x85);
        self.emit(zp + 4);

        self.emit(0xA5);
        self.emit(zp + 3);
        self.emit(0x4A);
        self.emit(0x4A);
        self.emit(0x18);
        self.emit(0x65);
        self.emit(zp + 3);
        self.emit_adc_bmp_base(); // ADC db_base (or #$20)
        self.emit(0x85);
        self.emit(zp + 5);

        self.emit(0xA5);
        self.emit(zp + 0);
        self.emit(0x29);
        self.emit(0xF8);
        self.emit(0x18);
        self.emit(0x65);
        self.emit(zp + 4);
        self.emit(0x85);
        self.emit(zp + 4);
        self.emit(0x90);
        let bcc1 = self.code.len();
        self.emit(0x00);
        self.emit(0xE6);
        self.emit(zp + 5);
        self.patch_bxx(bcc1, self.current_addr());

        self.emit(0xA5);
        self.emit(zp + 1);
        self.emit(0xF0);
        let beq_xhi = self.code.len();
        self.emit(0x00);
        self.emit(0xE6);
        self.emit(zp + 5);
        self.patch_bxx(beq_xhi, self.current_addr());

        self.emit(0xA5);
        self.emit(zp + 2);
        self.emit(0x29);
        self.emit(0x07);
        self.emit(0x18);
        self.emit(0x65);
        self.emit(zp + 4);
        self.emit(0x85);
        self.emit(zp + 4);
        self.emit(0x90);
        let bcc2 = self.code.len();
        self.emit(0x00);
        self.emit(0xE6);
        self.emit(zp + 5);
        self.patch_bxx(bcc2, self.current_addr());

        self.emit(0xA5);
        self.emit(zp + 0);
        self.emit(0x29);
        self.emit(0x07);
        self.emit(0xAA);
        self.emit(0xA9);
        self.emit(0x80);
        self.emit(0xE0);
        self.emit(0x00);
        self.emit(0xF0);
        let beq_mask = self.code.len();
        self.emit(0x00);
        let shift_top = self.current_addr();
        self.emit(0x4A);
        self.emit(0xCA);
        self.emit(0xD0);
        let bne_shift = self.code.len();
        self.emit(0x00);
        self.patch_bxx(bne_shift, shift_top);
        self.patch_bxx(beq_mask, self.current_addr());

        // Erase the pixel: AND with ~mask
        self.emit(0x85);
        self.emit(zp + 3); // STA mask
        self.emit(0xA5);
        self.emit(zp + 3); // LDA mask
        self.emit(0x49);
        self.emit(0xFF); // EOR #$FF → ~mask
        self.emit(0x85);
        self.emit(zp + 3); // STA ~mask
        self.emit(0xA0);
        self.emit(0x00); // LDY #0
        self.emit(0xB1);
        self.emit(zp + 4); // LDA (ptr_lo),Y
        self.emit(0x25);
        self.emit(zp + 3); // AND ~mask → clear pixel
        self.emit(0x91);
        self.emit(zp + 4); // STA (ptr_lo),Y
        self.emit(0x60); // RTS
    }

    // Plot-xor helper: computes pixel address/mask identically to emit_plot_helper,
    // then XORs (EOR mask) the pixel instead of setting it.
    fn emit_plot_xor_helper(&mut self) {
        let zp = match self.plot_zp {
            Some(z) => z,
            None => return,
        };

        // ── Same address computation as emit_plot_helper ──────────────────
        self.emit(0xA5);
        self.emit(zp + 2);
        self.emit(0x4A);
        self.emit(0x4A);
        self.emit(0x4A);
        self.emit(0x85);
        self.emit(zp + 3);

        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x85);
        self.emit(zp + 4);

        self.emit(0xA5);
        self.emit(zp + 3);
        self.emit(0x4A);
        self.emit(0x4A);
        self.emit(0x18);
        self.emit(0x65);
        self.emit(zp + 3);
        self.emit_adc_bmp_base(); // ADC db_base (or #$20)
        self.emit(0x85);
        self.emit(zp + 5);

        self.emit(0xA5);
        self.emit(zp + 0);
        self.emit(0x29);
        self.emit(0xF8);
        self.emit(0x18);
        self.emit(0x65);
        self.emit(zp + 4);
        self.emit(0x85);
        self.emit(zp + 4);
        self.emit(0x90);
        let bcc1 = self.code.len();
        self.emit(0x00);
        self.emit(0xE6);
        self.emit(zp + 5);
        self.patch_bxx(bcc1, self.current_addr());

        self.emit(0xA5);
        self.emit(zp + 1);
        self.emit(0xF0);
        let beq_xhi = self.code.len();
        self.emit(0x00);
        self.emit(0xE6);
        self.emit(zp + 5);
        self.patch_bxx(beq_xhi, self.current_addr());

        self.emit(0xA5);
        self.emit(zp + 2);
        self.emit(0x29);
        self.emit(0x07);
        self.emit(0x18);
        self.emit(0x65);
        self.emit(zp + 4);
        self.emit(0x85);
        self.emit(zp + 4);
        self.emit(0x90);
        let bcc2 = self.code.len();
        self.emit(0x00);
        self.emit(0xE6);
        self.emit(zp + 5);
        self.patch_bxx(bcc2, self.current_addr());

        self.emit(0xA5);
        self.emit(zp + 0);
        self.emit(0x29);
        self.emit(0x07);
        self.emit(0xAA);
        self.emit(0xA9);
        self.emit(0x80);
        self.emit(0xE0);
        self.emit(0x00);
        self.emit(0xF0);
        let beq_mask = self.code.len();
        self.emit(0x00);
        let shift_top = self.current_addr();
        self.emit(0x4A);
        self.emit(0xCA);
        self.emit(0xD0);
        let bne_shift = self.code.len();
        self.emit(0x00);
        self.patch_bxx(bne_shift, shift_top);
        self.patch_bxx(beq_mask, self.current_addr());

        // XOR the pixel: EOR mask
        self.emit(0x85);
        self.emit(zp + 3); // STA mask
        self.emit(0xA0);
        self.emit(0x00); // LDY #0
        self.emit(0xB1);
        self.emit(zp + 4); // LDA (ptr_lo),Y
        self.emit(0x45);
        self.emit(zp + 3); // EOR mask → flip pixel
        self.emit(0x91);
        self.emit(zp + 4); // STA (ptr_lo),Y
        self.emit(0x60); // RTS
    }

    /// Emit the paint flood-fill helper and all its internal subroutines.
    ///
    /// Layout (all emitted consecutively at the current code position):
    ///   paint_main   — init stack, check initial pixel, iterative 4-connected fill loop
    ///   check_pixel  — compute bitmap byte address + mask, return non-zero if pixel set
    ///   push_if_clear — test pixel; push (x,y) onto stack only if pixel is clear
    ///   push_triplet — push ZP(x_lo, x_hi, y) to the stack, advance stack pointer
    ///   pop_triplet  — decrement stack pointer, load ZP(x_lo, x_hi, y) from stack
    ///
    /// Entry conditions (set by gen_stmt for Stmt::Paint):
    ///   plot_zp+0 = x_lo, plot_zp+1 = x_hi, plot_zp+2 = y
    ///
    /// ZP usage:
    ///   plot_zp+0..+5  — x_lo, x_hi, y, scratch(b/mask), ptr_lo, ptr_hi (shared with plot helper)
    ///   paint_zp+0..+1 — stk_head_lo, stk_head_hi (16-bit stack pointer)
    ///
    /// Stack: 512 bytes at paint_stack_addr; each entry = 3 bytes (x_lo, x_hi, y)
    ///        = up to 170 pending pixels. Overflows silently wrap (known limitation).
    fn emit_paint_helper(&mut self, plot_addr: u16) {
        let zp = match self.plot_zp {
            Some(z) => z,
            None => return,
        };
        let paint_zp = match self.paint_zp {
            Some(z) => z,
            None => return,
        };
        let stack_base = match self.paint_stack_addr {
            Some(a) => a,
            None => return,
        };

        // ── paint_main ───────────────────────────────────────────────────────

        // 1. Initialise stack pointer
        self.emit(0xA9);
        self.emit(stack_base as u8); // LDA #<stack_base
        self.emit(0x85);
        self.emit(paint_zp); // STA stk_head_lo
        self.emit(0xA9);
        self.emit((stack_base >> 8) as u8); // LDA #>stack_base
        self.emit(0x85);
        self.emit(paint_zp + 1); // STA stk_head_hi

        // 2. If initial pixel is already set, return immediately.
        let check_pixel_jsr_1 = self.code.len();
        self.emit(0x20);
        self.emit(0x00);
        self.emit(0x00); // JSR check_pixel (patched later)
        self.emit(0xD0); // BNE → done
        let bne_to_done_1 = self.code.len();
        self.emit(0x00);

        // 3. Push initial point
        let push_triplet_jsr_1 = self.code.len();
        self.emit(0x20);
        self.emit(0x00);
        self.emit(0x00); // JSR push_triplet (patched later)

        // ── fill_loop ────────────────────────────────────────────────────────
        let fill_loop_addr = self.current_addr();

        // 4. Empty check: stk_head == stack_base?
        self.emit(0xA5);
        self.emit(paint_zp); // LDA stk_head_lo
        self.emit(0xC9);
        self.emit(stack_base as u8); // CMP #<stack_base
        self.emit(0xD0); // BNE → not_empty
        let bne_not_empty = self.code.len();
        self.emit(0x00);
        self.emit(0xA5);
        self.emit(paint_zp + 1); // LDA stk_head_hi
        self.emit(0xC9);
        self.emit((stack_base >> 8) as u8); // CMP #>stack_base
        self.emit(0xF0); // BEQ → done (stack empty)
        let beq_done = self.code.len();
        self.emit(0x00);
        self.patch_bxx(bne_not_empty, self.current_addr()); // not_empty:

        // 5. Pop (x_lo, x_hi, y) → plot_zp+0,+1,+2
        let pop_triplet_jsr = self.code.len();
        self.emit(0x20);
        self.emit(0x00);
        self.emit(0x00); // JSR pop_triplet (patched later)

        // 6. Test pixel: if already set, skip fill and loop
        let check_pixel_jsr_2 = self.code.len();
        self.emit(0x20);
        self.emit(0x00);
        self.emit(0x00); // JSR check_pixel (patched later)
        self.emit(0xD0); // BNE → skip_fill (pixel set)
        let bne_skip_fill = self.code.len();
        self.emit(0x00);

        // 7. Set the pixel
        self.emit(0x20);
        self.emit(plot_addr as u8);
        self.emit((plot_addr >> 8) as u8); // JSR plot_helper

        // 8. Push up: y-1  (if y > 0)
        self.emit(0xA5);
        self.emit(zp + 2); // LDA y
        self.emit(0xF0); // BEQ → skip_up
        let beq_skip_up = self.code.len();
        self.emit(0x00);
        self.emit(0xC6);
        self.emit(zp + 2); // DEC y
        let pic_up_jsr = self.code.len();
        self.emit(0x20);
        self.emit(0x00);
        self.emit(0x00); // JSR push_if_clear (patched later)
        self.emit(0xE6);
        self.emit(zp + 2); // INC y  (restore)
        self.patch_bxx(beq_skip_up, self.current_addr()); // skip_up:

        // 9. Push down: y+1  (if y < 199)
        self.emit(0xA5);
        self.emit(zp + 2); // LDA y
        self.emit(0xC9);
        self.emit(199u8); // CMP #199
        self.emit(0xB0); // BCS → skip_down
        let bcs_skip_down = self.code.len();
        self.emit(0x00);
        self.emit(0xE6);
        self.emit(zp + 2); // INC y
        let pic_down_jsr = self.code.len();
        self.emit(0x20);
        self.emit(0x00);
        self.emit(0x00); // JSR push_if_clear (patched later)
        self.emit(0xC6);
        self.emit(zp + 2); // DEC y  (restore)
        self.patch_bxx(bcs_skip_down, self.current_addr()); // skip_down:

        // 10. Push left: x-1  (if x > 0)
        self.emit(0xA5);
        self.emit(zp + 0); // LDA x_lo
        self.emit(0x05);
        self.emit(zp + 1); // ORA x_hi  → non-zero means x != 0
        self.emit(0xF0); // BEQ → skip_left
        let beq_skip_left = self.code.len();
        self.emit(0x00);
        // Decrement 16-bit x
        self.emit(0xA5);
        self.emit(zp + 0); // LDA x_lo
        self.emit(0xD0); // BNE → dec_lo_left
        let bne_dec_lo = self.code.len();
        self.emit(0x00);
        self.emit(0xC6);
        self.emit(zp + 1); // DEC x_hi  (borrow)
        self.patch_bxx(bne_dec_lo, self.current_addr()); // dec_lo_left:
        self.emit(0xC6);
        self.emit(zp + 0); // DEC x_lo
        let pic_left_jsr = self.code.len();
        self.emit(0x20);
        self.emit(0x00);
        self.emit(0x00); // JSR push_if_clear (patched later)
        // Restore: increment 16-bit x
        self.emit(0xE6);
        self.emit(zp + 0); // INC x_lo
        self.emit(0xD0); // BNE → no_inc_hi
        let bne_no_inc_hi = self.code.len();
        self.emit(0x00);
        self.emit(0xE6);
        self.emit(zp + 1); // INC x_hi  (carry)
        self.patch_bxx(bne_no_inc_hi, self.current_addr()); // no_inc_hi:
        self.patch_bxx(beq_skip_left, self.current_addr()); // skip_left:

        // 11. Push right: x+1  (if x <= 318, i.e., incremented x <= 319)
        self.emit(0xE6);
        self.emit(zp + 0); // INC x_lo
        self.emit(0xD0); // BNE → no_carry_right
        let bne_no_carry_right = self.code.len();
        self.emit(0x00);
        self.emit(0xE6);
        self.emit(zp + 1); // INC x_hi  (carry)
        self.patch_bxx(bne_no_carry_right, self.current_addr()); // no_carry_right:
        // Check x <= 319: x_hi==0 → always ok; x_hi==1 and x_lo < 64 → ok; else skip
        self.emit(0xA5);
        self.emit(zp + 1); // LDA x_hi
        self.emit(0xF0); // BEQ → in_range_right (x_hi==0, x<256)
        let beq_in_range_right = self.code.len();
        self.emit(0x00);
        self.emit(0xC9);
        self.emit(0x01); // CMP #1
        self.emit(0xD0); // BNE → skip_right (x_hi >= 2)
        let bne_skip_right = self.code.len();
        self.emit(0x00);
        self.emit(0xA5);
        self.emit(zp + 0); // LDA x_lo
        self.emit(0xC9);
        self.emit(0x40); // CMP #$40 (64)  x >= 320 if hi==1 && lo>=64
        self.emit(0xB0); // BCS → skip_right
        let bcs_skip_right = self.code.len();
        self.emit(0x00);
        self.patch_bxx(beq_in_range_right, self.current_addr()); // in_range_right:
        let pic_right_jsr = self.code.len();
        self.emit(0x20);
        self.emit(0x00);
        self.emit(0x00); // JSR push_if_clear (patched later)
        self.patch_bxx(bne_skip_right, self.current_addr()); // skip_right:
        self.patch_bxx(bcs_skip_right, self.current_addr());
        // Restore: decrement 16-bit x
        self.emit(0xA5);
        self.emit(zp + 0); // LDA x_lo
        self.emit(0xD0); // BNE → no_dec_hi_right
        let bne_no_dec_hi_right = self.code.len();
        self.emit(0x00);
        self.emit(0xC6);
        self.emit(zp + 1); // DEC x_hi
        self.patch_bxx(bne_no_dec_hi_right, self.current_addr()); // no_dec_hi_right:
        self.emit(0xC6);
        self.emit(zp + 0); // DEC x_lo

        // skip_fill / end of fill body: JMP fill_loop  (both the normal path and skip-pixel path converge here)
        self.patch_bxx(bne_skip_fill, self.current_addr()); // BNE skip_fill lands here
        self.emit(0x4C);
        self.emit(fill_loop_addr as u8);
        self.emit((fill_loop_addr >> 8) as u8); // JMP fill_loop

        // done:
        let done_addr = self.current_addr();
        self.patch_bxx(bne_to_done_1, done_addr); // initial pixel-set branch
        self.patch_bxx(beq_done, done_addr); // empty-stack branch
        self.emit(0x60); // RTS

        // ── check_pixel ──────────────────────────────────────────────────────
        // Same address computation as emit_plot_helper, but final step is
        //   LDA (ptr),Y / AND mask  →  returns A non-zero if pixel set, zero if clear.
        let check_pixel_addr = self.current_addr();

        self.emit(0xA5);
        self.emit(zp + 2); // LDA Y
        self.emit(0x4A);
        self.emit(0x4A);
        self.emit(0x4A); // LSR×3 → b = Y>>3
        self.emit(0x85);
        self.emit(zp + 3); // STA b

        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x0A); // ASL×6 → b*64 (lo byte)
        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x0A);
        self.emit(0x85);
        self.emit(zp + 4); // STA ptr_lo

        self.emit(0xA5);
        self.emit(zp + 3); // LDA b
        self.emit(0x4A);
        self.emit(0x4A); // LSR×2 → b>>2
        self.emit(0x18); // CLC
        self.emit(0x65);
        self.emit(zp + 3); // ADC b
        self.emit_adc_bmp_base(); // ADC db_base (or #$20)
        self.emit(0x85);
        self.emit(zp + 5); // STA ptr_hi

        self.emit(0xA5);
        self.emit(zp + 0); // LDA x_lo
        self.emit(0x29);
        self.emit(0xF8); // AND #$F8
        self.emit(0x18); // CLC
        self.emit(0x65);
        self.emit(zp + 4); // ADC ptr_lo
        self.emit(0x85);
        self.emit(zp + 4); // STA ptr_lo
        self.emit(0x90); // BCC skip_inc1
        let bcc1 = self.code.len();
        self.emit(0x00);
        self.emit(0xE6);
        self.emit(zp + 5); // INC ptr_hi
        self.patch_bxx(bcc1, self.current_addr()); // skip_inc1:

        self.emit(0xA5);
        self.emit(zp + 1); // LDA x_hi
        self.emit(0xF0); // BEQ skip_xhi
        let beq_xhi = self.code.len();
        self.emit(0x00);
        self.emit(0xE6);
        self.emit(zp + 5); // INC ptr_hi
        self.patch_bxx(beq_xhi, self.current_addr()); // skip_xhi:

        self.emit(0xA5);
        self.emit(zp + 2); // LDA Y
        self.emit(0x29);
        self.emit(0x07); // AND #$07
        self.emit(0x18); // CLC
        self.emit(0x65);
        self.emit(zp + 4); // ADC ptr_lo
        self.emit(0x85);
        self.emit(zp + 4); // STA ptr_lo
        self.emit(0x90); // BCC skip_inc2
        let bcc2 = self.code.len();
        self.emit(0x00);
        self.emit(0xE6);
        self.emit(zp + 5); // INC ptr_hi
        self.patch_bxx(bcc2, self.current_addr()); // skip_inc2:

        // bit mask = $80 >> (x_lo & 7)
        self.emit(0xA5);
        self.emit(zp + 0); // LDA x_lo
        self.emit(0x29);
        self.emit(0x07); // AND #$07
        self.emit(0xAA); // TAX  (shift count)
        self.emit(0xA9);
        self.emit(0x80); // LDA #$80
        self.emit(0xE0);
        self.emit(0x00); // CPX #0
        self.emit(0xF0); // BEQ done_mask
        let beq_mask = self.code.len();
        self.emit(0x00);
        let shift_top = self.current_addr();
        self.emit(0x4A); // LSR
        self.emit(0xCA); // DEX
        self.emit(0xD0); // BNE shift_top
        let bne_shift = self.code.len();
        self.emit(0x00);
        self.patch_bxx(bne_shift, shift_top);
        self.patch_bxx(beq_mask, self.current_addr()); // done_mask:

        self.emit(0x85);
        self.emit(zp + 3); // STA mask  (reuse b slot)
        self.emit(0xA0);
        self.emit(0x00); // LDY #0
        self.emit(0xB1);
        self.emit(zp + 4); // LDA (ptr_lo),Y
        self.emit(0x25);
        self.emit(zp + 3); // AND mask  → non-zero if pixel set
        self.emit(0x60); // RTS

        // ── push_if_clear ─────────────────────────────────────────────────────
        let push_if_clear_addr = self.current_addr();
        let check_pixel_jsr_3 = self.code.len();
        self.emit(0x20);
        self.emit(0x00);
        self.emit(0x00); // JSR check_pixel (patched later)
        self.emit(0xD0); // BNE → skip_push (pixel set)
        let bne_skip_push = self.code.len();
        self.emit(0x00);
        let push_triplet_jsr_2 = self.code.len();
        self.emit(0x20);
        self.emit(0x00);
        self.emit(0x00); // JSR push_triplet (patched later)
        self.patch_bxx(bne_skip_push, self.current_addr()); // skip_push:
        self.emit(0x60); // RTS

        // ── push_triplet ──────────────────────────────────────────────────────
        // Store (x_lo, x_hi, y) at (paint_zp),Y=0..2, then advance paint_zp by 3.
        let push_triplet_addr = self.current_addr();
        self.emit(0xA0);
        self.emit(0x00); // LDY #0
        self.emit(0xA5);
        self.emit(zp + 0); // LDA x_lo
        self.emit(0x91);
        self.emit(paint_zp); // STA (stk_head),Y
        self.emit(0xC8); // INY
        self.emit(0xA5);
        self.emit(zp + 1); // LDA x_hi
        self.emit(0x91);
        self.emit(paint_zp); // STA (stk_head),Y
        self.emit(0xC8); // INY
        self.emit(0xA5);
        self.emit(zp + 2); // LDA y
        self.emit(0x91);
        self.emit(paint_zp); // STA (stk_head),Y
        // stk_head += 3
        self.emit(0x18); // CLC
        self.emit(0xA5);
        self.emit(paint_zp); // LDA stk_head_lo
        self.emit(0x69);
        self.emit(0x03); // ADC #3
        self.emit(0x85);
        self.emit(paint_zp); // STA stk_head_lo
        self.emit(0x90); // BCC no_carry_push
        let bcc_push = self.code.len();
        self.emit(0x00);
        self.emit(0xE6);
        self.emit(paint_zp + 1); // INC stk_head_hi
        self.patch_bxx(bcc_push, self.current_addr()); // no_carry_push:
        self.emit(0x60); // RTS

        // ── pop_triplet ───────────────────────────────────────────────────────
        // stk_head -= 3, then load (x_lo, x_hi, y) from (paint_zp),Y=0..2.
        let pop_triplet_addr = self.current_addr();
        self.emit(0x38); // SEC
        self.emit(0xA5);
        self.emit(paint_zp); // LDA stk_head_lo
        self.emit(0xE9);
        self.emit(0x03); // SBC #3
        self.emit(0x85);
        self.emit(paint_zp); // STA stk_head_lo
        self.emit(0xB0); // BCS no_borrow_pop
        let bcs_pop = self.code.len();
        self.emit(0x00);
        self.emit(0xC6);
        self.emit(paint_zp + 1); // DEC stk_head_hi
        self.patch_bxx(bcs_pop, self.current_addr()); // no_borrow_pop:
        self.emit(0xA0);
        self.emit(0x00); // LDY #0
        self.emit(0xB1);
        self.emit(paint_zp); // LDA (stk_head),Y
        self.emit(0x85);
        self.emit(zp + 0); // STA x_lo
        self.emit(0xC8); // INY
        self.emit(0xB1);
        self.emit(paint_zp); // LDA (stk_head),Y
        self.emit(0x85);
        self.emit(zp + 1); // STA x_hi
        self.emit(0xC8); // INY
        self.emit(0xB1);
        self.emit(paint_zp); // LDA (stk_head),Y
        self.emit(0x85);
        self.emit(zp + 2); // STA y
        self.emit(0x60); // RTS

        // ── Patch all internal JSR addresses ──────────────────────────────────
        // JSR check_pixel (occurrences 1, 2, 3)
        for &pos in &[check_pixel_jsr_1, check_pixel_jsr_2, check_pixel_jsr_3] {
            self.code[pos + 1] = check_pixel_addr as u8;
            self.code[pos + 2] = (check_pixel_addr >> 8) as u8;
        }
        // JSR push_triplet (occurrences 1, 2)
        for &pos in &[push_triplet_jsr_1, push_triplet_jsr_2] {
            self.code[pos + 1] = push_triplet_addr as u8;
            self.code[pos + 2] = (push_triplet_addr >> 8) as u8;
        }
        // JSR pop_triplet
        self.code[pop_triplet_jsr + 1] = pop_triplet_addr as u8;
        self.code[pop_triplet_jsr + 2] = (pop_triplet_addr >> 8) as u8;
        // JSR push_if_clear (up, down, left, right)
        for &pos in &[pic_up_jsr, pic_down_jsr, pic_left_jsr, pic_right_jsr] {
            self.code[pos + 1] = push_if_clear_addr as u8;
            self.code[pos + 2] = (push_if_clear_addr >> 8) as u8;
        }
    }

    // Emit helper function for 4×4 block pixel SET.
    // Fixed ZP layout: pnt=$FB, ptr_lo=$FC, ptr_hi=$FD.
    // Algorithm:
    //   pnt = $08 (top-left bit mask)
    //   input X = y, Y = x
    //   if x & 1 → LSR pnt       (move to right half)
    //   Y = x / 2                (character column)
    //   if y & 1 → LSR pnt twice (move to bottom half)
    //   X = y / 2                (character row)
    //   ptr = $0400 + row*40     (computed arithmetically)
    //   screen[ptr + Y] |= pnt
    fn emit_plot4_helper(&mut self) {
        if self.plot4_zp.is_none() {
            return;
        }
        let pnt = PLOT4_MASK_ZP;
        let ptr_lo = PLOT4_PTR_LO_ZP;
        let ptr_hi = PLOT4_PTR_HI_ZP;

        // LDA #$08; STA pnt  — start with top-left pixel bit
        self.emit(0xA9);
        self.emit(0x08);
        self.emit(0x85);
        self.emit(pnt);

        // TYA; LSR A; BCC :+; LSR pnt  :  TAY
        self.emit(0x98); // TYA
        self.emit(0x4A); // LSR A
        self.emit(0x90);
        let bcc1 = self.code.len();
        self.emit(0x00); // BCC +
        self.emit(0x46);
        self.emit(pnt); // LSR pnt  (right half)
        self.patch_bxx(bcc1, self.current_addr());
        self.emit(0xA8); // TAY  (Y = column)

        // TXA; LSR A; BCC :+; LSR pnt; LSR pnt  :  TAX
        self.emit(0x8A); // TXA
        self.emit(0x4A); // LSR A
        self.emit(0x90);
        let bcc2 = self.code.len();
        self.emit(0x00); // BCC +
        self.emit(0x46);
        self.emit(pnt); // LSR pnt  (bottom-left)
        self.emit(0x46);
        self.emit(pnt); // LSR pnt  (bottom-right area)
        self.patch_bxx(bcc2, self.current_addr());
        self.emit(0xAA); // TAX  (X = row)

        // ptr = $0400 + row*40
        self.emit(0xA9);
        self.emit(0x00); // LDA #<$0400
        self.emit(0x85);
        self.emit(ptr_lo); // STA ptr_lo
        self.emit(0xA9);
        self.emit(0x04); // LDA #>$0400
        self.emit(0x85);
        self.emit(ptr_hi); // STA ptr_hi

        let loop_top = self.current_addr();
        self.emit(0x8A); // TXA
        self.emit(0xC9);
        self.emit(0x00); // CMP #0
        self.emit(0xF0);
        let done_beq = self.code.len();
        self.emit(0x00); // BEQ done
        self.emit(0xA9);
        self.emit(0x28); // LDA #40
        self.emit(0x18); // CLC
        self.emit(0x65);
        self.emit(ptr_lo); // ADC ptr_lo
        self.emit(0x85);
        self.emit(ptr_lo); // STA ptr_lo
        self.emit(0x90);
        let no_carry_bcc = self.code.len();
        self.emit(0x00); // BCC skip-inc
        self.emit(0xE6);
        self.emit(ptr_hi); // INC ptr_hi
        self.patch_bxx(no_carry_bcc, self.current_addr());
        self.emit(0xCA); // DEX
        self.emit(0x4C);
        self.emit16(loop_top); // JMP loop_top
        self.patch_bxx(done_beq, self.current_addr());

        // LDA (ptr_lo),Y; ORA pnt; STA (ptr_lo),Y; RTS
        self.emit(0xB1);
        self.emit(ptr_lo); // LDA (ptr_lo),Y
        self.emit(0x05);
        self.emit(pnt); // ORA pnt  (set pixel bit)
        self.emit(0x91);
        self.emit(ptr_lo); // STA (ptr_lo),Y
        self.emit(0x60); // RTS
    }

    // Emit helper function for 4×4 block pixel ERASE (clear).
    // Same as emit_plot4_helper but uses De Morgan: A = (A EOR $FF ORA pnt) EOR $FF = A AND NOT pnt
    fn emit_plot4_erase_helper(&mut self) {
        if self.plot4_zp.is_none() {
            return;
        }
        let pnt = PLOT4_MASK_ZP;
        let ptr_lo = PLOT4_PTR_LO_ZP;
        let ptr_hi = PLOT4_PTR_HI_ZP;

        self.emit(0xA9);
        self.emit(0x08);
        self.emit(0x85);
        self.emit(pnt);

        self.emit(0x98); // TYA
        self.emit(0x4A);
        self.emit(0x90);
        let bcc1 = self.code.len();
        self.emit(0x00);
        self.emit(0x46);
        self.emit(pnt);
        self.patch_bxx(bcc1, self.current_addr());
        self.emit(0xA8);

        self.emit(0x8A); // TXA
        self.emit(0x4A);
        self.emit(0x90);
        let bcc2 = self.code.len();
        self.emit(0x00);
        self.emit(0x46);
        self.emit(pnt);
        self.emit(0x46);
        self.emit(pnt);
        self.patch_bxx(bcc2, self.current_addr());
        self.emit(0xAA);

        self.emit(0xA9);
        self.emit(0x00); // LDA #<$0400
        self.emit(0x85);
        self.emit(ptr_lo);
        self.emit(0xA9);
        self.emit(0x04); // LDA #>$0400
        self.emit(0x85);
        self.emit(ptr_hi);

        let loop_top = self.current_addr();
        self.emit(0x8A); // TXA
        self.emit(0xC9);
        self.emit(0x00); // CMP #0
        self.emit(0xF0);
        let done_beq = self.code.len();
        self.emit(0x00); // BEQ done
        self.emit(0xA9);
        self.emit(0x28); // LDA #40
        self.emit(0x18); // CLC
        self.emit(0x65);
        self.emit(ptr_lo); // ADC ptr_lo
        self.emit(0x85);
        self.emit(ptr_lo);
        self.emit(0x90);
        let no_carry_bcc = self.code.len();
        self.emit(0x00); // BCC skip-inc
        self.emit(0xE6);
        self.emit(ptr_hi); // INC ptr_hi
        self.patch_bxx(no_carry_bcc, self.current_addr());
        self.emit(0xCA); // DEX
        self.emit(0x4C);
        self.emit16(loop_top);
        self.patch_bxx(done_beq, self.current_addr());

        // Erase: screen = screen AND NOT pnt  via De Morgan:
        //   LDA (ptr),Y; EOR #$FF; ORA pnt; EOR #$FF; STA (ptr),Y
        self.emit(0xB1);
        self.emit(ptr_lo); // LDA (ptr_lo),Y
        self.emit(0x49);
        self.emit(0xFF); // EOR #$FF
        self.emit(0x05);
        self.emit(pnt); // ORA pnt
        self.emit(0x49);
        self.emit(0xFF); // EOR #$FF
        self.emit(0x91);
        self.emit(ptr_lo); // STA (ptr_lo),Y
        self.emit(0x60); // RTS
    }

    fn emit_circle4_try_plot(&mut self, tx: u8, ty: u8, plot4_helper_addr: u16) {
        self.emit(0xA5);
        self.emit(tx); // LDA tx
        self.emit(0xC9);
        self.emit(80); // CMP #80
        self.emit(0xB0);
        let bcs_x = self.code.len();
        self.emit(0x00);
        self.emit(0xA5);
        self.emit(ty); // LDA ty
        self.emit(0xC9);
        self.emit(50); // CMP #50
        self.emit(0xB0);
        let bcs_y = self.code.len();
        self.emit(0x00);
        self.emit(0xA6);
        self.emit(ty); // LDX ty (plot4 expects X=y)
        self.emit(0xA4);
        self.emit(tx); // LDY tx (plot4 expects Y=x)
        self.emit(0x20);
        self.emit16(plot4_helper_addr);
        let skip = self.current_addr();
        self.patch_bxx(bcs_x, skip);
        self.patch_bxx(bcs_y, skip);
    }

    fn emit_circle4_point(
        &mut self,
        cx: u8,
        cy: u8,
        ox: u8,
        oy: u8,
        tx: u8,
        ty: u8,
        x_sign: i8,
        y_sign: i8,
        plot4_helper_addr: u16,
    ) {
        if x_sign >= 0 {
            self.emit(0x18); // CLC
            self.emit(0xA5);
            self.emit(cx); // LDA cx
            self.emit(0x65);
            self.emit(ox); // ADC ox
        } else {
            self.emit(0x38); // SEC
            self.emit(0xA5);
            self.emit(cx); // LDA cx
            self.emit(0xE5);
            self.emit(ox); // SBC ox
        }
        self.emit(0x85);
        self.emit(tx); // STA tx

        if y_sign >= 0 {
            self.emit(0x18);
            self.emit(0xA5);
            self.emit(cy);
            self.emit(0x65);
            self.emit(oy);
        } else {
            self.emit(0x38);
            self.emit(0xA5);
            self.emit(cy);
            self.emit(0xE5);
            self.emit(oy);
        }
        self.emit(0x85);
        self.emit(ty); // STA ty
        self.emit_circle4_try_plot(tx, ty, plot4_helper_addr);
    }

    fn emit_circle4_helper(&mut self, plot4_helper_addr: u16) {
        let zp = match self.circle4_zp {
            Some(z) => z,
            None => return,
        };
        let cx = zp;
        let cy = zp + 1;
        let x = zp + 2;
        let y = zp + 3;
        let d = zp + 4;
        let tx = zp + 5;
        let ty = zp + 6;

        self.emit(0xA9);
        self.emit(0x00); // y = 0
        self.emit(0x85);
        self.emit(y);
        self.emit(0xA9);
        self.emit(0x01); // d = 1 - r
        self.emit(0x38);
        self.emit(0xE5);
        self.emit(x);
        self.emit(0x85);
        self.emit(d);

        let loop_addr = self.current_addr();

        self.emit_circle4_point(cx, cy, x, y, tx, ty, 1, 1, plot4_helper_addr);
        self.emit_circle4_point(cx, cy, x, y, tx, ty, 1, -1, plot4_helper_addr);
        self.emit_circle4_point(cx, cy, x, y, tx, ty, -1, -1, plot4_helper_addr);
        self.emit_circle4_point(cx, cy, x, y, tx, ty, -1, 1, plot4_helper_addr);
        self.emit_circle4_point(cx, cy, y, x, tx, ty, 1, 1, plot4_helper_addr);
        self.emit_circle4_point(cx, cy, y, x, tx, ty, 1, -1, plot4_helper_addr);
        self.emit_circle4_point(cx, cy, y, x, tx, ty, -1, -1, plot4_helper_addr);
        self.emit_circle4_point(cx, cy, y, x, tx, ty, -1, 1, plot4_helper_addr);

        self.emit(0xA5);
        self.emit(y); // done if y >= x
        self.emit(0xC5);
        self.emit(x);
        self.emit(0xB0);
        let bcs_done = self.code.len();
        self.emit(0x00);

        self.emit(0xE6);
        self.emit(y); // y++

        self.emit(0xA5);
        self.emit(d); // if d < 0
        self.emit(0x30);
        let bmi_neg = self.code.len();
        self.emit(0x00);

        self.emit(0xC6);
        self.emit(x); // x--; d += 2*(y-x)+1
        self.emit(0x38);
        self.emit(0xA5);
        self.emit(y);
        self.emit(0xE5);
        self.emit(x);
        self.emit(0x0A);
        self.emit(0x18);
        self.emit(0x69);
        self.emit(0x01);
        self.emit(0x18);
        self.emit(0x65);
        self.emit(d);
        self.emit(0x85);
        self.emit(d);
        self.emit(0x4C);
        self.emit16(loop_addr);

        let neg_addr = self.current_addr();
        self.patch_bxx(bmi_neg, neg_addr);
        self.emit(0xA5);
        self.emit(y); // d += 2*y + 1
        self.emit(0x0A);
        self.emit(0x18);
        self.emit(0x69);
        self.emit(0x01);
        self.emit(0x18);
        self.emit(0x65);
        self.emit(d);
        self.emit(0x85);
        self.emit(d);
        self.emit(0x4C);
        self.emit16(loop_addr);

        let done_addr = self.current_addr();
        self.patch_bxx(bcs_done, done_addr);
        self.emit(0x60); // RTS
    }

    /// Midpoint circle helper. Caller fills circle_zp with center/radius and calls via JSR.
    /// Layout: zp+0..1=center_x, zp+2=center_y, zp+3..4=radius,
    ///         zp+5..6=x, zp+7..8=y, zp+9..10=decision,
    ///         zp+11..12=x0+x, zp+13..14=x0-x, zp+15..16=x0+y, zp+17..18=x0-y,
    ///         zp+19=y0+x, zp+20=y0-x, zp+21=y0+y, zp+22=y0-y, zp+23=scratch
    fn emit_circle_helper(&mut self, plot_helper_addr: u16) {
        let zp = match self.circle_zp {
            Some(z) => z,
            None => return,
        };
        let pzp = match self.plot_zp {
            Some(z) => z,
            None => return,
        };

        // ZP layout (24 bytes from zp):
        //  zp+0,1  : center_x (word)      zp+2    : center_y (byte)
        //  zp+3,4  : radius (word)  — kept as x (pXR), decreases
        //  zp+5,6  : x current (starts = radius)
        //  zp+7,8  : y current (starts = 0)
        //  zp+9,10 : dA accumulator (starts = radius; a=a-y each iter; if<0: x--; a+=x)
        //  zp+11,12: xoPx=cx+x  zp+13,14: xoMx=cx-x
        //  zp+15,16: xoPy=cx+y  zp+17,18: xoMy=cx-y
        //  zp+19   : yoPx=cy+x  zp+20: yoMx=cy-x
        //  zp+21   : yoPy=cy+y  zp+22: yoMy=cy-y

        // ═══ ENTRY POINT — callers JSR here ════════════════════════════════
        // Init: y=0, x=radius, dA=radius  (reference: a=x=r; y=0)
        self.emit(0xA9);
        self.emit(0x00); // LDA #0
        self.emit(0x85);
        self.emit(zp + 7); // STA y_lo
        self.emit(0x85);
        self.emit(zp + 8); // STA y_hi
        self.emit(0xA5);
        self.emit(zp + 3); // LDA radius_lo
        self.emit(0x85);
        self.emit(zp + 5); // STA x_lo
        self.emit(0x85);
        self.emit(zp + 9); // STA dA_lo
        self.emit(0xA5);
        self.emit(zp + 4); // LDA radius_hi
        self.emit(0x85);
        self.emit(zp + 6); // STA x_hi
        self.emit(0x85);
        self.emit(zp + 10); // STA dA_hi

        let loop_addr = self.current_addr();

        // ─── Compute 8 coordinate combinations ───────────────────────────
        // xoPx = cx + x  (zp+11,12)
        self.emit(0x18);
        self.emit(0xA5);
        self.emit(zp + 0);
        self.emit(0x65);
        self.emit(zp + 5);
        self.emit(0x85);
        self.emit(zp + 11);
        self.emit(0xA5);
        self.emit(zp + 1);
        self.emit(0x65);
        self.emit(zp + 6);
        self.emit(0x85);
        self.emit(zp + 12);

        // xoMx = cx - x  (zp+13,14)
        self.emit(0x38);
        self.emit(0xA5);
        self.emit(zp + 0);
        self.emit(0xE5);
        self.emit(zp + 5);
        self.emit(0x85);
        self.emit(zp + 13);
        self.emit(0xA5);
        self.emit(zp + 1);
        self.emit(0xE5);
        self.emit(zp + 6);
        self.emit(0x85);
        self.emit(zp + 14);

        // xoPy = cx + y  (zp+15,16)
        self.emit(0x18);
        self.emit(0xA5);
        self.emit(zp + 0);
        self.emit(0x65);
        self.emit(zp + 7);
        self.emit(0x85);
        self.emit(zp + 15);
        self.emit(0xA5);
        self.emit(zp + 1);
        self.emit(0x65);
        self.emit(zp + 8);
        self.emit(0x85);
        self.emit(zp + 16);

        // xoMy = cx - y  (zp+17,18)
        self.emit(0x38);
        self.emit(0xA5);
        self.emit(zp + 0);
        self.emit(0xE5);
        self.emit(zp + 7);
        self.emit(0x85);
        self.emit(zp + 17);
        self.emit(0xA5);
        self.emit(zp + 1);
        self.emit(0xE5);
        self.emit(zp + 8);
        self.emit(0x85);
        self.emit(zp + 18);

        // yoPx = cy + x  (zp+19), clamped to 201 if overflow
        self.emit(0xA5);
        self.emit(zp + 6); // LDA x_hi
        self.emit(0xD0);
        let bne1 = self.code.len();
        self.emit(0x00); // BNE → out
        self.emit(0x18);
        self.emit(0xA5);
        self.emit(zp + 2); // LDA cy
        self.emit(0x65);
        self.emit(zp + 5); // ADC x_lo
        self.emit(0x90);
        let bcc1 = self.code.len();
        self.emit(0x00); // BCC → store
        let out1 = self.current_addr();
        self.patch_bxx(bne1, out1);
        self.emit(0xA9);
        self.emit(201);
        self.emit(0x85);
        self.emit(zp + 19);
        self.emit(0x4C);
        let jmp1 = self.code.len();
        self.emit16(0x0000);
        let store1 = self.current_addr();
        self.patch_bxx(bcc1, store1);
        self.emit(0x85);
        self.emit(zp + 19);
        let after1 = self.current_addr();
        self.patch_abs(jmp1, after1);

        // yoMx = cy - x  (zp+20), clamped to 201 if borrow
        self.emit(0xA5);
        self.emit(zp + 6); // LDA x_hi
        self.emit(0xD0);
        let bne2 = self.code.len();
        self.emit(0x00); // BNE → out
        self.emit(0x38);
        self.emit(0xA5);
        self.emit(zp + 2); // LDA cy
        self.emit(0xE5);
        self.emit(zp + 5); // SBC x_lo
        self.emit(0xB0);
        let bcs2 = self.code.len();
        self.emit(0x00); // BCS → store
        let out2 = self.current_addr();
        self.patch_bxx(bne2, out2);
        self.emit(0xA9);
        self.emit(201);
        self.emit(0x85);
        self.emit(zp + 20);
        self.emit(0x4C);
        let jmp2 = self.code.len();
        self.emit16(0x0000);
        let store2 = self.current_addr();
        self.patch_bxx(bcs2, store2);
        self.emit(0x85);
        self.emit(zp + 20);
        let after2 = self.current_addr();
        self.patch_abs(jmp2, after2);

        // yoPy = cy + y  (zp+21), clamped to 201 if overflow
        self.emit(0xA5);
        self.emit(zp + 8); // LDA y_hi
        self.emit(0xD0);
        let bne3 = self.code.len();
        self.emit(0x00); // BNE → out
        self.emit(0x18);
        self.emit(0xA5);
        self.emit(zp + 2); // LDA cy
        self.emit(0x65);
        self.emit(zp + 7); // ADC y_lo
        self.emit(0x90);
        let bcc3 = self.code.len();
        self.emit(0x00); // BCC → store
        let out3 = self.current_addr();
        self.patch_bxx(bne3, out3);
        self.emit(0xA9);
        self.emit(201);
        self.emit(0x85);
        self.emit(zp + 21);
        self.emit(0x4C);
        let jmp3 = self.code.len();
        self.emit16(0x0000);
        let store3 = self.current_addr();
        self.patch_bxx(bcc3, store3);
        self.emit(0x85);
        self.emit(zp + 21);
        let after3 = self.current_addr();
        self.patch_abs(jmp3, after3);

        // yoMy = cy - y  (zp+22), clamped to 201 if borrow
        self.emit(0xA5);
        self.emit(zp + 8); // LDA y_hi
        self.emit(0xD0);
        let bne4 = self.code.len();
        self.emit(0x00); // BNE → out
        self.emit(0x38);
        self.emit(0xA5);
        self.emit(zp + 2); // LDA cy
        self.emit(0xE5);
        self.emit(zp + 7); // SBC y_lo
        self.emit(0xB0);
        let bcs4 = self.code.len();
        self.emit(0x00); // BCS → store
        let out4 = self.current_addr();
        self.patch_bxx(bne4, out4);
        self.emit(0xA9);
        self.emit(201);
        self.emit(0x85);
        self.emit(zp + 22);
        self.emit(0x4C);
        let jmp4 = self.code.len();
        self.emit16(0x0000);
        let store4 = self.current_addr();
        self.patch_bxx(bcs4, store4);
        self.emit(0x85);
        self.emit(zp + 22);
        let after4 = self.current_addr();
        self.patch_abs(jmp4, after4);

        // ─── Plot 8 symmetric points (forward JSR to try_plot, patched later) ──
        let mut try_jsrs: Vec<usize> = Vec::new();

        // arc3: (cx+x, cy+y)
        self.emit(0xA5);
        self.emit(zp + 11);
        self.emit(0x85);
        self.emit(pzp + 0);
        self.emit(0xA5);
        self.emit(zp + 12);
        self.emit(0x85);
        self.emit(pzp + 1);
        self.emit(0xA5);
        self.emit(zp + 21);
        self.emit(0x85);
        self.emit(pzp + 2);
        self.emit(0x20);
        try_jsrs.push(self.code.len());
        self.emit16(0x0000);

        // arc2: (cx+x, cy-y)
        self.emit(0xA5);
        self.emit(zp + 11);
        self.emit(0x85);
        self.emit(pzp + 0);
        self.emit(0xA5);
        self.emit(zp + 12);
        self.emit(0x85);
        self.emit(pzp + 1);
        self.emit(0xA5);
        self.emit(zp + 22);
        self.emit(0x85);
        self.emit(pzp + 2);
        self.emit(0x20);
        try_jsrs.push(self.code.len());
        self.emit16(0x0000);

        // arc7: (cx-x, cy-y)
        self.emit(0xA5);
        self.emit(zp + 13);
        self.emit(0x85);
        self.emit(pzp + 0);
        self.emit(0xA5);
        self.emit(zp + 14);
        self.emit(0x85);
        self.emit(pzp + 1);
        self.emit(0xA5);
        self.emit(zp + 22);
        self.emit(0x85);
        self.emit(pzp + 2);
        self.emit(0x20);
        try_jsrs.push(self.code.len());
        self.emit16(0x0000);

        // arc6: (cx-x, cy+y)
        self.emit(0xA5);
        self.emit(zp + 13);
        self.emit(0x85);
        self.emit(pzp + 0);
        self.emit(0xA5);
        self.emit(zp + 14);
        self.emit(0x85);
        self.emit(pzp + 1);
        self.emit(0xA5);
        self.emit(zp + 21);
        self.emit(0x85);
        self.emit(pzp + 2);
        self.emit(0x20);
        try_jsrs.push(self.code.len());
        self.emit16(0x0000);

        // arc4: (cx+y, cy+x)
        self.emit(0xA5);
        self.emit(zp + 15);
        self.emit(0x85);
        self.emit(pzp + 0);
        self.emit(0xA5);
        self.emit(zp + 16);
        self.emit(0x85);
        self.emit(pzp + 1);
        self.emit(0xA5);
        self.emit(zp + 19);
        self.emit(0x85);
        self.emit(pzp + 2);
        self.emit(0x20);
        try_jsrs.push(self.code.len());
        self.emit16(0x0000);

        // arc1: (cx+y, cy-x)
        self.emit(0xA5);
        self.emit(zp + 15);
        self.emit(0x85);
        self.emit(pzp + 0);
        self.emit(0xA5);
        self.emit(zp + 16);
        self.emit(0x85);
        self.emit(pzp + 1);
        self.emit(0xA5);
        self.emit(zp + 20);
        self.emit(0x85);
        self.emit(pzp + 2);
        self.emit(0x20);
        try_jsrs.push(self.code.len());
        self.emit16(0x0000);

        // arc8: (cx-y, cy-x)
        self.emit(0xA5);
        self.emit(zp + 17);
        self.emit(0x85);
        self.emit(pzp + 0);
        self.emit(0xA5);
        self.emit(zp + 18);
        self.emit(0x85);
        self.emit(pzp + 1);
        self.emit(0xA5);
        self.emit(zp + 20);
        self.emit(0x85);
        self.emit(pzp + 2);
        self.emit(0x20);
        try_jsrs.push(self.code.len());
        self.emit16(0x0000);

        // arc5: (cx-y, cy+x)
        self.emit(0xA5);
        self.emit(zp + 17);
        self.emit(0x85);
        self.emit(pzp + 0);
        self.emit(0xA5);
        self.emit(zp + 18);
        self.emit(0x85);
        self.emit(pzp + 1);
        self.emit(0xA5);
        self.emit(zp + 19);
        self.emit(0x85);
        self.emit(pzp + 2);
        self.emit(0x20);
        try_jsrs.push(self.code.len());
        self.emit16(0x0000);

        // ─── Exit check: if y >= x → done ────────────────────────────────
        self.emit(0xA5);
        self.emit(zp + 7); // LDA y_lo
        self.emit(0xC5);
        self.emit(zp + 5); // CMP x_lo
        self.emit(0xA5);
        self.emit(zp + 8); // LDA y_hi
        self.emit(0xE5);
        self.emit(zp + 6); // SBC x_hi  — carry set if y >= x
        self.emit(0xB0);
        let bcs_done = self.code.len();
        self.emit(0x00); // BCS done

        // ─── y = y + 1 ────────────────────────────────────────────────────
        self.emit(0xE6);
        self.emit(zp + 7); // INC y_lo
        self.emit(0xD0);
        let bne_ync = self.code.len();
        self.emit(0x00);
        self.emit(0xE6);
        self.emit(zp + 8); // INC y_hi
        let ync_addr = self.current_addr();
        self.patch_bxx(bne_ync, ync_addr);

        // ─── dA = dA - y  (reference step 15: a=a-y) ─────────────────────
        self.emit(0x38); // SEC
        self.emit(0xA5);
        self.emit(zp + 9); // LDA dA_lo
        self.emit(0xE5);
        self.emit(zp + 7); // SBC y_lo
        self.emit(0x85);
        self.emit(zp + 9); // STA dA_lo
        self.emit(0xA5);
        self.emit(zp + 10); // LDA dA_hi
        self.emit(0xE5);
        self.emit(zp + 8); // SBC y_hi
        self.emit(0x85);
        self.emit(zp + 10); // STA dA_hi (N flag = sign of result)

        // ─── if dA >= 0 skip x decrement (reference step 16: if a<0) ─────
        self.emit(0x10);
        let bpl_skip = self.code.len();
        self.emit(0x00); // BPL skip_xdec

        // ─── x = x - 1  (reference step 17: x=x-1) ──────────────────────
        self.emit(0xA5);
        self.emit(zp + 5); // LDA x_lo
        self.emit(0xD0);
        let bne_xlo = self.code.len();
        self.emit(0x00); // BNE no_borrow_hi
        self.emit(0xC6);
        self.emit(zp + 6); // DEC x_hi
        let xlo_addr = self.current_addr();
        self.patch_bxx(bne_xlo, xlo_addr);
        self.emit(0xC6);
        self.emit(zp + 5); // DEC x_lo

        // ─── dA = dA + x  (reference step 18: a=a+x) ────────────────────
        self.emit(0x18); // CLC
        self.emit(0xA5);
        self.emit(zp + 9); // LDA dA_lo
        self.emit(0x65);
        self.emit(zp + 5); // ADC x_lo
        self.emit(0x85);
        self.emit(zp + 9); // STA dA_lo
        self.emit(0xA5);
        self.emit(zp + 10); // LDA dA_hi
        self.emit(0x65);
        self.emit(zp + 6); // ADC x_hi
        self.emit(0x85);
        self.emit(zp + 10); // STA dA_hi

        let skip_xdec = self.current_addr();
        self.patch_bxx(bpl_skip, skip_xdec);

        // ─── JMP loop ─────────────────────────────────────────────────────
        self.emit(0x4C);
        self.emit16(loop_addr);

        // ─── done: RTS ────────────────────────────────────────────────────
        let done_addr = self.current_addr();
        self.patch_bxx(bcs_done, done_addr);
        self.emit(0x60); // RTS

        // ─── try_plot subroutine  (back-patched into the 8 JSRs above) ────
        let try_plot_addr = self.current_addr();
        for patch in &try_jsrs {
            self.code[*patch] = (try_plot_addr & 0xFF) as u8;
            self.code[*patch + 1] = (try_plot_addr >> 8) as u8;
        }

        // Y bounds: skip if plot_y >= 200
        self.emit(0xA5);
        self.emit(pzp + 2); // LDA plot_y
        self.emit(0xC9);
        self.emit(200); // CMP #200
        self.emit(0xB0);
        let bcs_skip = self.code.len();
        self.emit(0x00); // BCS skip

        // X bounds: skip if plot_x >= 320
        // Reference algorithm: CMP X_lo,#$40; LDA X_hi (no carry change); SBC #$01; BCS skip
        self.emit(0xA5);
        self.emit(pzp + 0); // LDA X_lo
        self.emit(0xC9);
        self.emit(0x40); // CMP #<320  ($40)
        self.emit(0xA5);
        self.emit(pzp + 1); // LDA X_hi  (carry preserved)
        self.emit(0xE9);
        self.emit(0x01); // SBC #>320  ($01)
        self.emit(0xB0);
        let bcs_skip_x = self.code.len();
        self.emit(0x00); // BCS skip (X >= 320)

        self.emit(0x20);
        self.emit16(plot_helper_addr); // JSR plot helper

        let skip_addr = self.current_addr();
        self.patch_bxx(bcs_skip, skip_addr);
        self.patch_bxx(bcs_skip_x, skip_addr);
        self.emit(0x60); // RTS
    }

    /// Emit code to store a 16-bit address expression to two consecutive REU registers.
    /// Used for C64 address ($DF02/$DF03), REU address ($DF04/$DF05), length ($DF07/$DF08).
    fn emit_addr_to_reu_reg(&mut self, expr: &Expr, lo_reg: u16, hi_reg: u16) {
        match expr {
            Expr::Number(n) => {
                let n = *n;
                self.emit(0xA9);
                self.emit(n as u8);
                self.emit(0x8D);
                self.emit16(lo_reg);
                self.emit(0xA9);
                self.emit((n >> 8) as u8);
                self.emit(0x8D);
                self.emit16(hi_reg);
            }
            Expr::Var(name) => {
                let name = name.clone();
                if matches!(self.var_types.get(&name), Some(VarType::Word)) {
                    if let Some(zp) = self.var_addr(&name) {
                        self.emit(0xA5);
                        self.emit(zp); // LDA zp_lo
                        self.emit(0x8D);
                        self.emit16(lo_reg); // STA lo_reg
                        self.emit(0xA5);
                        self.emit(zp + 1); // LDA zp_hi
                        self.emit(0x8D);
                        self.emit16(hi_reg); // STA hi_reg
                    }
                } else if let Some(zp) = self.var_addr(&name) {
                    self.emit(0xA5);
                    self.emit(zp);
                    self.emit(0x8D);
                    self.emit16(lo_reg);
                    self.emit(0xA9);
                    self.emit(0x00);
                    self.emit(0x8D);
                    self.emit16(hi_reg);
                }
            }
            _ => {
                let expr = expr.clone();
                self.eval_expr(&expr);
                self.emit(0x8D);
                self.emit16(lo_reg);
                self.emit(0xA9);
                self.emit(0x00);
                self.emit(0x8D);
                self.emit16(hi_reg);
            }
        }
    }

    /// Print hex helper: called with value in A, prints as 2 uppercase hex digits.
    /// Layout: print_hex (11 bytes) then print_nibble (11 bytes) = 22 bytes total.
    /// print_hex falls through into print_nibble for the low nibble (tail call to CHROUT).
    fn emit_print_hex_helper(&mut self) -> u16 {
        let base = self.current_addr();
        let nibble_addr = base + 11;
        // print_hex:
        self.emit(0x48); // PHA         — save byte
        self.emit(0x4A);
        self.emit(0x4A); // LSR; LSR    — shift high nibble
        self.emit(0x4A);
        self.emit(0x4A); // LSR; LSR      into bits 0-3
        self.emit(0x20);
        self.emit16(nibble_addr); // JSR print_nibble — print high nibble
        self.emit(0x68); // PLA         — restore byte
        self.emit(0x29);
        self.emit(0x0F); // AND #$0F    — isolate low nibble
        // print_nibble: (A = nibble 0-15)
        // if A >= 10: A+7+$30='A'..'F'; else A+$30='0'..'9'
        self.emit(0xC9);
        self.emit(0x0A); // CMP #$0A
        self.emit(0x90);
        self.emit(0x02); // BCC +2      — skip ADC #6 if < 10
        self.emit(0x69);
        self.emit(0x06); // ADC #$06    — carry=1: +7 total
        self.emit(0x69);
        self.emit(0x30); // ADC #$30    — to ASCII '0'-'F'
        self.emit(0x4C);
        self.emit16(CHROUT); // JMP $FFD2   — CHROUT tail call
        base
    }

    /// Print bin helper: called with value in A, prints as 8-bit binary (MSB first).
    /// Uses only stack (no extra ZP). 17 bytes.
    fn emit_print_bin_helper(&mut self) -> u16 {
        let base = self.current_addr();
        //             offset  bytes
        self.emit(0xA2);
        self.emit(0x08); //  0  LDX #8
        // loop: (offset 2)
        self.emit(0x0A); //  2  ASL A   — MSB into carry, A shifts left
        self.emit(0x48); //  3  PHA     — save shifted value
        self.emit(0xA9);
        self.emit(0x00); //  4  LDA #0
        self.emit(0x2A); //  6  ROL     — A = carry (0 or 1)
        self.emit(0x09);
        self.emit(0x30); //  7  ORA #$30 → '0' or '1'
        self.emit(0x20);
        self.emit16(CHROUT); // 9  JSR $FFD2
        self.emit(0x68); // 12  PLA
        self.emit(0xCA); // 13  DEX
        self.emit(0xD0);
        self.emit(0xF2); // 14  BNE -14 → loop (target: offset 2)
        self.emit(0x60); // 16  RTS
        base
    }

    /// 256-byte sin table: sin(i * 2π/256) * 127 + 128, result 1-255 (center=128).
    fn sin_table() -> Vec<u8> {
        (0u16..256)
            .map(|i| {
                let angle = i as f64 * 2.0 * std::f64::consts::PI / 256.0;
                let v = (angle.sin() * 127.0).round() as i32 + 128;
                v.clamp(0, 255) as u8
            })
            .collect()
    }

    /// Rectangle outline helper. Draws 4 edges by looping pixel-by-pixel via the given plot routine.
    /// Caller fills rect_zp+0..5 (x1_lo,x1_hi,y1,x2_lo,x2_hi,y2) and calls via JSR.
    /// ZP layout (9 bytes):
    ///   zp+0=x1_lo  zp+1=x1_hi  zp+2=y1
    ///   zp+3=x2_lo  zp+4=x2_hi  zp+5=y2
    ///   zp+6=cx_lo  zp+7=cx_hi  zp+8=cy  (loop temporaries)
    fn emit_rect_helper(&mut self, plot_addr: u16) {
        let zp = match self.rect_zp {
            Some(z) => z,
            None => return,
        };
        let pzp = match self.plot_zp {
            Some(z) => z,
            None => return,
        };
        let pa_lo = plot_addr as u8;
        let pa_hi = (plot_addr >> 8) as u8;

        // Helper macro (inline): sets up and runs a horizontal span (x from cx..x2, fixed Y in pzp+2)
        // The caller must have already set pzp+2 = Y before calling into the loop.

        // ── Top edge: y=y1, x: x1→x2 ────────────────────────────────────────
        self.emit(0xA5); self.emit(zp+2);   // LDA y1
        self.emit(0x85); self.emit(pzp+2);  // STA Y
        self.emit(0xA5); self.emit(zp+0);   // LDA x1_lo
        self.emit(0x85); self.emit(zp+6);   // STA cx_lo
        self.emit(0xA5); self.emit(zp+1);   // LDA x1_hi
        self.emit(0x85); self.emit(zp+7);   // STA cx_hi
        let top_loop = self.current_addr();
        self.emit(0xA5); self.emit(zp+6);   // LDA cx_lo
        self.emit(0x85); self.emit(pzp+0);  // STA X_lo
        self.emit(0xA5); self.emit(zp+7);   // LDA cx_hi
        self.emit(0x85); self.emit(pzp+1);  // STA X_hi
        self.emit(0x20); self.emit(pa_lo); self.emit(pa_hi); // JSR plot
        // if cx == x2 → done
        self.emit(0xA5); self.emit(zp+6);
        self.emit(0xC5); self.emit(zp+3);
        self.emit(0xD0); let bne_top_inc = self.code.len(); self.emit(0x00); // BNE top_inc
        self.emit(0xA5); self.emit(zp+7);
        self.emit(0xC5); self.emit(zp+4);
        self.emit(0xD0); let bne_top_inc2 = self.code.len(); self.emit(0x00); // BNE top_inc
        self.emit(0x4C); let jmp_after_top = self.code.len(); self.emit16(0x0000); // JMP after_top
        let top_inc = self.current_addr();
        self.patch_bxx(bne_top_inc, top_inc);
        self.patch_bxx(bne_top_inc2, top_inc);
        self.emit(0xE6); self.emit(zp+6);   // INC cx_lo
        self.emit(0xD0); let bne_top_nohi = self.code.len(); self.emit(0x00); // BNE top_loop
        self.emit(0xE6); self.emit(zp+7);   // INC cx_hi
        self.patch_bxx(bne_top_nohi, top_loop);
        self.emit(0x4C); self.emit(top_loop as u8); self.emit((top_loop >> 8) as u8);

        // ── Bottom edge: y=y2, x: x1→x2 ─────────────────────────────────────
        let after_top = self.current_addr();
        self.patch_abs(jmp_after_top, after_top);
        self.emit(0xA5); self.emit(zp+5);   // LDA y2
        self.emit(0x85); self.emit(pzp+2);  // STA Y
        self.emit(0xA5); self.emit(zp+0);   // LDA x1_lo
        self.emit(0x85); self.emit(zp+6);   // STA cx_lo
        self.emit(0xA5); self.emit(zp+1);   // LDA x1_hi
        self.emit(0x85); self.emit(zp+7);   // STA cx_hi
        let bot_loop = self.current_addr();
        self.emit(0xA5); self.emit(zp+6);
        self.emit(0x85); self.emit(pzp+0);
        self.emit(0xA5); self.emit(zp+7);
        self.emit(0x85); self.emit(pzp+1);
        self.emit(0x20); self.emit(pa_lo); self.emit(pa_hi);
        self.emit(0xA5); self.emit(zp+6);
        self.emit(0xC5); self.emit(zp+3);
        self.emit(0xD0); let bne_bot_inc = self.code.len(); self.emit(0x00);
        self.emit(0xA5); self.emit(zp+7);
        self.emit(0xC5); self.emit(zp+4);
        self.emit(0xD0); let bne_bot_inc2 = self.code.len(); self.emit(0x00);
        self.emit(0x4C); let jmp_after_bot = self.code.len(); self.emit16(0x0000);
        let bot_inc = self.current_addr();
        self.patch_bxx(bne_bot_inc, bot_inc);
        self.patch_bxx(bne_bot_inc2, bot_inc);
        self.emit(0xE6); self.emit(zp+6);
        self.emit(0xD0); let bne_bot_nohi = self.code.len(); self.emit(0x00);
        self.emit(0xE6); self.emit(zp+7);
        self.patch_bxx(bne_bot_nohi, bot_loop);
        self.emit(0x4C); self.emit(bot_loop as u8); self.emit((bot_loop >> 8) as u8);

        // ── Left edge: x=x1, y: y1→y2 ────────────────────────────────────────
        let after_bot = self.current_addr();
        self.patch_abs(jmp_after_bot, after_bot);
        self.emit(0xA5); self.emit(zp+0);   // LDA x1_lo
        self.emit(0x85); self.emit(pzp+0);  // STA X_lo
        self.emit(0xA5); self.emit(zp+1);   // LDA x1_hi
        self.emit(0x85); self.emit(pzp+1);  // STA X_hi
        self.emit(0xA5); self.emit(zp+2);   // LDA y1
        self.emit(0x85); self.emit(zp+8);   // STA cy
        let left_loop = self.current_addr();
        self.emit(0xA5); self.emit(zp+8);   // LDA cy
        self.emit(0x85); self.emit(pzp+2);  // STA Y
        self.emit(0x20); self.emit(pa_lo); self.emit(pa_hi);
        self.emit(0xA5); self.emit(zp+8);
        self.emit(0xC5); self.emit(zp+5);   // CMP y2
        self.emit(0xD0); let bne_left_inc = self.code.len(); self.emit(0x00); // BNE left_inc
        self.emit(0x4C); let jmp_after_left = self.code.len(); self.emit16(0x0000);
        let left_inc = self.current_addr();
        self.patch_bxx(bne_left_inc, left_inc);
        self.emit(0xE6); self.emit(zp+8);   // INC cy
        self.emit(0x4C); self.emit(left_loop as u8); self.emit((left_loop >> 8) as u8);

        // ── Right edge: x=x2, y: y1→y2 ───────────────────────────────────────
        let after_left = self.current_addr();
        self.patch_abs(jmp_after_left, after_left);
        self.emit(0xA5); self.emit(zp+3);   // LDA x2_lo
        self.emit(0x85); self.emit(pzp+0);  // STA X_lo
        self.emit(0xA5); self.emit(zp+4);   // LDA x2_hi
        self.emit(0x85); self.emit(pzp+1);  // STA X_hi
        self.emit(0xA5); self.emit(zp+2);   // LDA y1
        self.emit(0x85); self.emit(zp+8);   // STA cy
        let right_loop = self.current_addr();
        self.emit(0xA5); self.emit(zp+8);
        self.emit(0x85); self.emit(pzp+2);
        self.emit(0x20); self.emit(pa_lo); self.emit(pa_hi);
        self.emit(0xA5); self.emit(zp+8);
        self.emit(0xC5); self.emit(zp+5);
        self.emit(0xD0); let bne_right_inc = self.code.len(); self.emit(0x00); // BNE right_inc
        self.emit(0x4C); let jmp_after_right = self.code.len(); self.emit16(0x0000);
        let right_inc = self.current_addr();
        self.patch_bxx(bne_right_inc, right_inc);
        self.emit(0xE6); self.emit(zp+8);
        self.emit(0x4C); self.emit(right_loop as u8); self.emit((right_loop >> 8) as u8);

        let after_right = self.current_addr();
        self.patch_abs(jmp_after_right, after_right);
        self.emit(0x60); // RTS
    }

    /// Bresenham line helper. Called via JSR; caller fills line_zp+0..5 (cx_lo,cx_hi,cy,x2_lo,x2_hi,y2).
    /// Internally uses line_zp+6..14 and calls the plot helper for each pixel.
    /// Supports full 9-bit x range (0–319) matching the 320-pixel hires bitmap.
    /// ZP layout (15 bytes):
    ///   zp+0  = cx_lo   zp+1  = cx_hi   zp+2  = cy
    ///   zp+3  = x2_lo   zp+4  = x2_hi   zp+5  = y2
    ///   zp+6  = dx_lo   zp+7  = dx_hi   zp+8  = dy
    ///   zp+9  = sx      zp+10 = sy
    ///   zp+11 = err_lo  zp+12 = err_hi
    ///   zp+13 = e2_lo   zp+14 = e2_hi
    fn emit_drawline_helper(&mut self, plot_helper_addr: u16) {
        let zp = match self.line_zp {
            Some(z) => z,
            None => return,
        };
        let pzp = match self.plot_zp {
            Some(z) => z,
            None => return,
        };

        // ── |dx| and sx (16-bit) ───────────────────────────────────────────
        // 16-bit compare x2 vs cx: compare hi bytes first
        self.emit(0xA5); self.emit(zp + 4); // LDA x2_hi
        self.emit(0xC5); self.emit(zp + 1); // CMP cx_hi
        self.emit(0x90); let bcc_xneg = self.code.len(); self.emit(0x00); // BCC dl_xneg
        self.emit(0xD0); let bne_xpos = self.code.len(); self.emit(0x00); // BNE dl_xpos
        // hi bytes equal → compare lo bytes
        self.emit(0xA5); self.emit(zp + 3); // LDA x2_lo
        self.emit(0xC5); self.emit(zp + 0); // CMP cx_lo
        self.emit(0xB0); let bcs_xpos = self.code.len(); self.emit(0x00); // BCS dl_xpos (x2>=cx)

        // dl_xneg: |dx| = cx - x2, sx = $FF
        let dl_xneg = self.current_addr();
        self.patch_bxx(bcc_xneg, dl_xneg);
        self.emit(0x38); // SEC
        self.emit(0xA5); self.emit(zp + 0); // LDA cx_lo
        self.emit(0xE5); self.emit(zp + 3); // SBC x2_lo
        self.emit(0x85); self.emit(zp + 6); // STA dx_lo
        self.emit(0xA5); self.emit(zp + 1); // LDA cx_hi
        self.emit(0xE5); self.emit(zp + 4); // SBC x2_hi
        self.emit(0x85); self.emit(zp + 7); // STA dx_hi
        self.emit(0xA9); self.emit(0xFF);    // LDA #$FF
        self.emit(0x85); self.emit(zp + 9); // STA sx
        self.emit(0x4C); let jmp_caldy = self.code.len(); self.emit16(0x0000); // JMP dl_caldy

        // dl_xpos: |dx| = x2 - cx, sx = +1
        let dl_xpos = self.current_addr();
        self.patch_bxx(bne_xpos, dl_xpos);
        self.patch_bxx(bcs_xpos, dl_xpos);
        self.emit(0x38); // SEC
        self.emit(0xA5); self.emit(zp + 3); // LDA x2_lo
        self.emit(0xE5); self.emit(zp + 0); // SBC cx_lo
        self.emit(0x85); self.emit(zp + 6); // STA dx_lo
        self.emit(0xA5); self.emit(zp + 4); // LDA x2_hi
        self.emit(0xE5); self.emit(zp + 1); // SBC cx_hi
        self.emit(0x85); self.emit(zp + 7); // STA dx_hi
        self.emit(0xA9); self.emit(0x01);    // LDA #1
        self.emit(0x85); self.emit(zp + 9); // STA sx
        // fall through to dl_caldy

        // ── |dy| and sy (8-bit; y is always 0-199) ────────────────────────
        let dl_caldy = self.current_addr();
        self.patch_abs(jmp_caldy, dl_caldy);
        self.emit(0xA5); self.emit(zp + 5); // LDA y2
        self.emit(0xC5); self.emit(zp + 2); // CMP cy
        self.emit(0xB0); let bcs_ypos = self.code.len(); self.emit(0x00); // BCS dl_ypos
        // y2 < cy: |dy| = cy - y2, sy = $FF
        self.emit(0x38);
        self.emit(0xA5); self.emit(zp + 2); // LDA cy
        self.emit(0xE5); self.emit(zp + 5); // SBC y2
        self.emit(0x85); self.emit(zp + 8);  // STA dy
        self.emit(0xA9); self.emit(0xFF);
        self.emit(0x85); self.emit(zp + 10); // STA sy
        self.emit(0x4C); let jmp_init = self.code.len(); self.emit16(0x0000); // JMP dl_init

        // dl_ypos: |dy| = y2 - cy, sy = +1
        let dl_ypos = self.current_addr();
        self.patch_bxx(bcs_ypos, dl_ypos);
        self.emit(0x38);
        self.emit(0xA5); self.emit(zp + 5); // LDA y2
        self.emit(0xE5); self.emit(zp + 2); // SBC cy
        self.emit(0x85); self.emit(zp + 8);  // STA dy
        self.emit(0xA9); self.emit(0x01);
        self.emit(0x85); self.emit(zp + 10); // STA sy

        // ── err = |dx| - |dy|  (16-bit signed) ────────────────────────────
        let dl_init = self.current_addr();
        self.patch_abs(jmp_init, dl_init);
        self.emit(0x38); // SEC
        self.emit(0xA5); self.emit(zp + 6);  // LDA dx_lo
        self.emit(0xE5); self.emit(zp + 8);  // SBC dy  (8-bit, zero-extended)
        self.emit(0x85); self.emit(zp + 11); // STA err_lo
        self.emit(0xA5); self.emit(zp + 7);  // LDA dx_hi
        self.emit(0xE9); self.emit(0x00);    // SBC #0  (borrow → err_hi=$FF if dx<dy)
        self.emit(0x85); self.emit(zp + 12); // STA err_hi

        // ── Main loop ──────────────────────────────────────────────────────
        let dl_loop = self.current_addr();
        // Set up plot ZP: X_lo=cx_lo, X_hi=cx_hi, Y=cy
        self.emit(0xA5); self.emit(zp + 0);  // LDA cx_lo
        self.emit(0x85); self.emit(pzp + 0); // STA X_lo
        self.emit(0xA5); self.emit(zp + 1);  // LDA cx_hi
        self.emit(0x85); self.emit(pzp + 1); // STA X_hi
        self.emit(0xA5); self.emit(zp + 2);  // LDA cy
        self.emit(0x85); self.emit(pzp + 2); // STA Y
        self.emit(0x20); self.emit(plot_helper_addr as u8); self.emit((plot_helper_addr >> 8) as u8); // JSR plot

        // Check termination: cx_lo==x2_lo && cx_hi==x2_hi && cy==y2 → done
        // Use BNE-over-JMP to avoid a long forward branch (loop body > 127 bytes)
        self.emit(0xA5); self.emit(zp + 0);  // LDA cx_lo
        self.emit(0xC5); self.emit(zp + 3);  // CMP x2_lo
        self.emit(0xD0); let bne_step = self.code.len(); self.emit(0x00); // BNE dl_step
        self.emit(0xA5); self.emit(zp + 1);  // LDA cx_hi
        self.emit(0xC5); self.emit(zp + 4);  // CMP x2_hi
        self.emit(0xD0); let bne_step2 = self.code.len(); self.emit(0x00); // BNE dl_step
        self.emit(0xA5); self.emit(zp + 2);  // LDA cy
        self.emit(0xC5); self.emit(zp + 5);  // CMP y2
        self.emit(0xD0); let bne_step3 = self.code.len(); self.emit(0x00); // BNE dl_step (cy!=y2)
        self.emit(0x4C); let jmp_done = self.code.len(); self.emit16(0x0000); // JMP dl_done (all match)

        // dl_step: compute e2 = err << 1 (16-bit)
        let dl_step = self.current_addr();
        self.patch_bxx(bne_step,  dl_step);
        self.patch_bxx(bne_step2, dl_step);
        self.patch_bxx(bne_step3, dl_step);
        self.emit(0xA5); self.emit(zp + 11); // LDA err_lo
        self.emit(0x0A);                      // ASL A
        self.emit(0x85); self.emit(zp + 13); // STA e2_lo
        self.emit(0xA5); self.emit(zp + 12); // LDA err_hi
        self.emit(0x2A);                      // ROL A
        self.emit(0x85); self.emit(zp + 14); // STA e2_hi

        // X update: if (e2 + dy) > 0 → err -= dy, cx += sx
        self.emit(0x18);                      // CLC
        self.emit(0xA5); self.emit(zp + 13); // LDA e2_lo
        self.emit(0x65); self.emit(zp + 8);  // ADC dy
        self.emit(0xAA);                      // TAX (save sum_lo)
        self.emit(0xA5); self.emit(zp + 14); // LDA e2_hi
        self.emit(0x69); self.emit(0x00);    // ADC #0 (carry from lo add)
        self.emit(0x10); let bpl_xchk = self.code.len(); self.emit(0x00); // BPL dl_xchk (sum_hi>=0)
        self.emit(0x4C); let jmp_ychk = self.code.len(); self.emit16(0x0000); // JMP dl_ychk

        // dl_xchk: sum_hi in 0..127; sum>0 if hi!=0 or lo!=0
        let dl_xchk = self.current_addr();
        self.patch_bxx(bpl_xchk, dl_xchk);
        self.emit(0xD0); let bne_do_x = self.code.len(); self.emit(0x00); // BNE dl_do_x (hi!=0)
        self.emit(0xE0); self.emit(0x00);    // CPX #0  (check lo)
        self.emit(0xF0); let beq_ychk = self.code.len(); self.emit(0x00); // BEQ dl_ychk (sum==0)

        // dl_do_x: err -= dy (16-bit borrow), cx += sx (16-bit)
        let dl_do_x = self.current_addr();
        self.patch_bxx(bne_do_x, dl_do_x);
        self.emit(0x38);
        self.emit(0xA5); self.emit(zp + 11); // LDA err_lo
        self.emit(0xE5); self.emit(zp + 8);  // SBC dy
        self.emit(0x85); self.emit(zp + 11); // STA err_lo
        self.emit(0xA5); self.emit(zp + 12); // LDA err_hi
        self.emit(0xE9); self.emit(0x00);    // SBC #0 (borrow)
        self.emit(0x85); self.emit(zp + 12); // STA err_hi
        // cx += sx: sx=+1 → INC, sx=$FF → DEC (16-bit with carry/borrow)
        self.emit(0xA5); self.emit(zp + 9);  // LDA sx
        self.emit(0x10); let bpl_cx_inc = self.code.len(); self.emit(0x00); // BPL dl_cx_inc
        // DEC cx_lo; if cx_lo was 0, borrow from cx_hi
        self.emit(0xA5); self.emit(zp + 0);  // LDA cx_lo
        self.emit(0xD0); let bne_nodec_hi = self.code.len(); self.emit(0x00); // BNE (no borrow)
        self.emit(0xC6); self.emit(zp + 1);  // DEC cx_hi
        let dl_nodec_hi = self.current_addr();
        self.patch_bxx(bne_nodec_hi, dl_nodec_hi);
        self.emit(0xC6); self.emit(zp + 0);  // DEC cx_lo
        self.emit(0x4C); let jmp_ychk2 = self.code.len(); self.emit16(0x0000); // JMP dl_ychk

        // dl_cx_inc: INC cx_lo; if carry, INC cx_hi
        let dl_cx_inc = self.current_addr();
        self.patch_bxx(bpl_cx_inc, dl_cx_inc);
        self.emit(0xE6); self.emit(zp + 0);  // INC cx_lo
        self.emit(0xD0); let bne_no_inc_hi = self.code.len(); self.emit(0x00); // BNE dl_ychk
        self.emit(0xE6); self.emit(zp + 1);  // INC cx_hi
        // fall through to dl_ychk

        // Y update: if (e2 - |dx|) < 0 → err += |dx|, cy += sy
        let dl_ychk = self.current_addr();
        self.patch_abs(jmp_ychk,  dl_ychk);
        self.patch_abs(jmp_ychk2, dl_ychk);
        self.patch_bxx(beq_ychk,       dl_ychk);
        self.patch_bxx(bne_no_inc_hi,  dl_ychk);
        // 16-bit: e2 - |dx|; N flag after hi SBC = sign of result
        self.emit(0x38);
        self.emit(0xA5); self.emit(zp + 13); // LDA e2_lo
        self.emit(0xE5); self.emit(zp + 6);  // SBC dx_lo
        self.emit(0xA5); self.emit(zp + 14); // LDA e2_hi
        self.emit(0xE5); self.emit(zp + 7);  // SBC dx_hi
        self.emit(0x10); let bpl_skip_y = self.code.len(); self.emit(0x00); // BPL skip_y (>=0 → skip)
        // do y: err += |dx| (16-bit), cy += sy
        self.emit(0x18);
        self.emit(0xA5); self.emit(zp + 11); // LDA err_lo
        self.emit(0x65); self.emit(zp + 6);  // ADC dx_lo
        self.emit(0x85); self.emit(zp + 11); // STA err_lo
        self.emit(0xA5); self.emit(zp + 12); // LDA err_hi
        self.emit(0x65); self.emit(zp + 7);  // ADC dx_hi
        self.emit(0x85); self.emit(zp + 12); // STA err_hi
        // cy += sy: sy=+1 → INC, sy=$FF → DEC
        self.emit(0xA5); self.emit(zp + 10); // LDA sy
        self.emit(0x10); let bpl_cy_inc = self.code.len(); self.emit(0x00); // BPL dl_cy_inc
        self.emit(0xC6); self.emit(zp + 2);  // DEC cy
        self.emit(0x4C); self.emit(dl_loop as u8); self.emit((dl_loop >> 8) as u8); // JMP dl_loop
        let dl_cy_inc = self.current_addr();
        self.patch_bxx(bpl_cy_inc, dl_cy_inc);
        self.emit(0xE6); self.emit(zp + 2);  // INC cy
        self.emit(0x4C); self.emit(dl_loop as u8); self.emit((dl_loop >> 8) as u8); // JMP dl_loop

        // skip_y: result >= 0 → no y update → back to loop
        let dl_skip_y = self.current_addr();
        self.patch_bxx(bpl_skip_y, dl_skip_y);
        self.emit(0x4C); self.emit(dl_loop as u8); self.emit((dl_loop >> 8) as u8); // JMP dl_loop

        // dl_done:
        let dl_done = self.current_addr();
        self.patch_abs(jmp_done, dl_done);
        self.emit(0x60); // RTS
    }

    /// True if the expression is or contains a string (literal, Str var, or chr$).
    /// Used to decide whether `+` means string concat or numeric add in print.
    fn is_string_expr(&self, expr: &Expr) -> bool {
        match expr {
            Expr::StringLit(_) => true,
            Expr::ChrStr(_) => true,
            Expr::StrN(_) => true,
            Expr::Var(name) => matches!(self.var_types.get(name), Some(VarType::Str)),
            Expr::BinOp(l, BinOp::Add, r) => self.is_string_expr(l) || self.is_string_expr(r),
            _ => false,
        }
    }

    /// Print a single argument. Handles the `+` operator as string concat
    /// when at least one operand is a string; otherwise evaluates numerically.
    fn print_single_arg(&mut self, arg: &Expr) {
        match arg {
            // Large constant (> 255): emit digits as a compile-time string literal
            Expr::Number(n) if *n > 255_i16 || *n < 0_i16 => {
                let s = n.to_string();
                self.print_str_inline(&s);
            }
            Expr::StringLit(s) => {
                let s = s.clone();
                self.print_str_inline(&s);
            }
            Expr::ChrStr(inner) => {
                // chr$(n): evaluate n into A then output via CHROUT
                let inner = inner.clone();
                self.eval_expr(&inner);
                self.emit(0x20);
                self.emit16(CHROUT); // JSR CHROUT
            }
            Expr::StrN(_) => {
                // str$(n): run strn_helper (sets strn_zp ptr), then print via ptr
                let arg = arg.clone();
                self.eval_expr(&arg); // JSR strn_helper; strn_zp points to "NNN\0"
                if let Some(ptr) = self.strn_zp {
                    self.print_str_via_ptr(ptr);
                }
            }
            Expr::HexFmt(inner) => {
                // hex(n): print value as 2-digit uppercase hexadecimal
                let inner = inner.clone();
                self.eval_expr(&inner);
                self.emit(0x20);
                let patch = self.code.len();
                self.emit16(0x0000);
                self.hex_helper_patches.push(patch);
            }
            Expr::BinFmt(inner) => {
                // bin(n): print value as 8-bit binary string
                let inner = inner.clone();
                self.eval_expr(&inner);
                self.emit(0x20);
                let patch = self.code.len();
                self.emit16(0x0000);
                self.bin_helper_patches.push(patch);
            }
            Expr::DecFmt(inner, width_expr) => {
                // dec(n, width): right-justified decimal in a field of `width` chars.
                // Computes spaces = max(0, width - digit_count), prints spaces then n.
                let inner = inner.clone();
                let width_expr = width_expr.clone();

                let t_val = self.tmp_zp;
                self.tmp_zp += 1;
                let t_width = self.tmp_zp;
                self.tmp_zp += 1;

                // eval n → t_val
                self.eval_expr(&inner);
                self.emit(0x85);
                self.emit(t_val);

                // eval width → t_width
                self.eval_expr(&width_expr);
                self.emit(0x85);
                self.emit(t_width);

                // Branch on digit count to compute spaces = t_width - digit_count
                self.emit(0xA5);
                self.emit(t_val); // LDA t_val
                self.emit(0xC9);
                self.emit(100); // CMP #100
                self.emit(0x90); // BCC not3
                let bcc_not3 = self.code.len();
                self.emit(0x00);
                // >= 100: 3 digits → spaces = t_width - 3
                self.emit(0xA5);
                self.emit(t_width); // LDA t_width
                self.emit(0x38); // SEC
                self.emit(0xE9);
                self.emit(3); // SBC #3
                self.emit(0x4C); // JMP do_spaces
                let jmp_do1 = self.code.len();
                self.emit16(0x0000);

                let not3 = self.current_addr();
                self.patch_bxx(bcc_not3, not3);
                self.emit(0xC9);
                self.emit(10); // CMP #10
                self.emit(0x90); // BCC not2
                let bcc_not2 = self.code.len();
                self.emit(0x00);
                // >= 10: 2 digits → spaces = t_width - 2
                self.emit(0xA5);
                self.emit(t_width); // LDA t_width
                self.emit(0x38); // SEC
                self.emit(0xE9);
                self.emit(2); // SBC #2
                self.emit(0x4C); // JMP do_spaces
                let jmp_do2 = self.code.len();
                self.emit16(0x0000);

                let not2 = self.current_addr();
                self.patch_bxx(bcc_not2, not2);
                // < 10: 1 digit → spaces = t_width - 1
                self.emit(0xA5);
                self.emit(t_width); // LDA t_width
                self.emit(0x38); // SEC
                self.emit(0xE9);
                self.emit(1); // SBC #1
                // fall through to do_spaces

                let do_spaces = self.current_addr();
                self.patch_abs(jmp_do1, do_spaces);
                self.patch_abs(jmp_do2, do_spaces);

                // A = spaces to print; carry clear = underflow (width < digits)
                self.emit(0x90); // BCC no_spaces
                let bcc_no_spc = self.code.len();
                self.emit(0x00);
                self.emit(0xF0); // BEQ no_spaces
                let beq_no_spc = self.code.len();
                self.emit(0x00);
                // print A space characters
                self.emit(0xAA); // TAX
                self.emit(0xA9);
                self.emit(0x20); // LDA #' '
                let spc_loop = self.current_addr();
                self.emit(0x20);
                self.emit16(CHROUT); // JSR CHROUT
                self.emit(0xCA); // DEX
                self.emit(0xD0); // BNE spc_loop
                let bne_spc = self.code.len();
                self.emit(0x00);
                self.patch_bxx(bne_spc, spc_loop);

                let no_spaces = self.current_addr();
                self.patch_bxx(bcc_no_spc, no_spaces);
                self.patch_bxx(beq_no_spc, no_spaces);

                // print decimal value (leading-zero suppression)
                self.print_decimal(t_val);
            }
            Expr::Spc(n) => {
                // spc(n): print n space characters ($20)
                // LDA n; BEQ skip; TAX; LDA #$20; loop: JSR CHROUT; DEX; BNE loop; skip:
                let n = n.clone();
                self.eval_expr(&n); // A = n
                self.emit(0xF0); // BEQ skip (if n==0 skip everything)
                let beq_offset_pos = self.code.len();
                self.emit(0x00); // BEQ offset placeholder
                self.emit(0xAA); // TAX (X = n)
                self.emit(0xA9);
                self.emit(0x20); // LDA #$20 (space)
                let loop_addr = self.code.len();
                self.emit(0x20);
                self.emit16(CHROUT); // JSR CHROUT
                self.emit(0xCA); // DEX
                let bne_pos = self.code.len();
                self.emit(0xD0); // BNE loop
                let back_offset = (loop_addr as i32 - (bne_pos as i32 + 2)) as i8;
                self.emit(back_offset as u8); // BNE offset
                // Patch BEQ offset
                let skip_addr = self.code.len();
                let beq_offset = (skip_addr as i32 - (beq_offset_pos as i32 + 1)) as i8;
                self.code[beq_offset_pos] = beq_offset as u8;
            }
            Expr::Tab(n) => {
                // tab(n): move cursor to column n, keeping current row
                // SEC; JSR $FFF0 → read cursor: X=row, Y=col
                // STX tmp; eval n → TAY; LDX tmp; CLC; JSR $FFF0 → set cursor
                let n = n.clone();
                let tmp = self.tmp_zp;
                self.tmp_zp += 1;
                self.emit(0x38); // SEC (read mode for PLOT)
                self.emit(0x20);
                self.emit16(0xFFF0); // JSR $FFF0 (KERNAL PLOT — read cursor)
                self.emit(0x86);
                self.emit(tmp); // STX tmp (save row)
                self.eval_expr(&n); // A = column target
                self.emit(0xA8); // TAY (Y = new column)
                self.emit(0xA6);
                self.emit(tmp); // LDX tmp (restore row)
                self.emit(0x18); // CLC (write mode for PLOT)
                self.emit(0x20);
                self.emit16(0xFFF0); // JSR $FFF0 (KERNAL PLOT — set cursor)
            }
            Expr::Var(name) => {
                let name = name.clone();
                self.mark_used(&name);
                if matches!(self.var_types.get(&name), Some(VarType::Str)) {
                    if let Some(zp) = self.var_addr(&name) {
                        self.print_str_via_ptr(zp);
                    }
                } else if matches!(self.var_types.get(&name), Some(VarType::Float)) {
                    if let Some(zp) = self.var_addr(&name) {
                        self.print_fixed(zp);
                    }
                } else if matches!(self.var_types.get(&name), Some(VarType::Word)) {
                    if let Some(zp) = self.var_addr(&name) {
                        self.print_decimal_word(zp);
                    }
                } else if let Some(zp) = self.var_addr(&name) {
                    self.print_decimal(zp);
                }
            }
            // String-side `+`: print left part then right part (no separator)
            Expr::BinOp(l, BinOp::Add, r) if self.is_string_expr(l) || self.is_string_expr(r) => {
                let (l, r) = (l.clone(), r.clone());
                self.print_single_arg(&l);
                self.print_single_arg(&r);
            }
            _ => {
                let arg = arg.clone();
                if self.can_be_word_result(&arg) {
                    // 16-bit expression: evaluate as word and print
                    let lo = self.tmp_zp;
                    self.tmp_zp += 1;
                    let hi = self.tmp_zp;
                    self.tmp_zp += 1;
                    self.eval_expr_word(&arg, lo, hi);
                    self.print_decimal_word(lo);
                } else {
                    // 8-bit expression
                    let tmp = self.tmp_zp;
                    self.tmp_zp += 1;
                    self.eval_expr(&arg);
                    self.emit(0x85);
                    self.emit(tmp);
                    self.print_decimal(tmp);
                }
            }
        }
    }

    fn gen_stmts(&mut self, stmts: &[Stmt]) {
        for stmt in stmts {
            self.tmp_zp = TMP_BASE; // reset scratch pool – prevents ZP overflow into BASIC/KERNAL vars
            self.gen_stmt(stmt);
        }
    }

    /// Generate 16-bit assignment code for a word-typed destination at ZP `dst_zp`.
    /// Returns `true` when a 16-bit pattern was matched and code was emitted.
    /// Returns `false` on fallback (caller should emit 8-bit eval + STA lo + clear hi).
    fn gen_word_assign(&mut self, dst_zp: u8, expr: &Expr) -> bool {
        match expr {
            // ── constant ──────────────────────────────────────────────────────────
            Expr::Number(n) => {
                let n = *n;
                self.emit(0xA9);
                self.emit(n as u8); // LDA #lo
                self.emit(0x85);
                self.emit(dst_zp); // STA lo
                self.emit(0xA9);
                self.emit((n >> 8) as u8); // LDA #hi
                self.emit(0x85);
                self.emit(dst_zp + 1); // STA hi
                true
            }
            // ── fixed-point literal ───────────────────────────────────────────────
            Expr::FixedLit(v) => {
                let v = *v;
                self.emit(0xA9);
                self.emit(v as u8); // LDA #lo
                self.emit(0x85);
                self.emit(dst_zp); // STA lo
                self.emit(0xA9);
                self.emit((v >> 8) as u8); // LDA #hi
                self.emit(0x85);
                self.emit(dst_zp + 1); // STA hi
                true
            }
            // ── word_var or float_var copy ────────────────────────────────────────
            Expr::Var(src)
                if matches!(
                    self.var_types.get(src),
                    Some(VarType::Word) | Some(VarType::Float)
                ) =>
            {
                if let Some(src_zp) = self.var_addr(src) {
                    self.emit(0xA5);
                    self.emit(src_zp); // LDA lo
                    self.emit(0x85);
                    self.emit(dst_zp); // STA lo
                    self.emit(0xA5);
                    self.emit(src_zp + 1); // LDA hi
                    self.emit(0x85);
                    self.emit(dst_zp + 1); // STA hi
                    true
                } else {
                    false
                }
            }
            // ── peek16(addr) ──────────────────────────────────────────────────────
            Expr::Peek16(addr) => {
                let addr = addr.clone();
                match addr.as_ref() {
                    Expr::Number(n) => {
                        let n = *n as u16;
                        // LDA abs     → lo byte
                        self.emit(0xAD);
                        self.emit(n as u8);
                        self.emit((n >> 8) as u8);
                        self.emit(0x85);
                        self.emit(dst_zp); // STA lo
                        // LDA abs+1   → hi byte
                        let n1 = n.wrapping_add(1);
                        self.emit(0xAD);
                        self.emit(n1 as u8);
                        self.emit((n1 >> 8) as u8);
                        self.emit(0x85);
                        self.emit(dst_zp + 1); // STA hi
                        true
                    }
                    Expr::Var(vname)
                        if matches!(self.var_types.get(vname.as_str()), Some(VarType::Word)) =>
                    {
                        if let Some(ptr_zp) = self.var_addr(vname) {
                            // LDA (ptr),Y with Y=0 → lo
                            self.emit(0xA0);
                            self.emit(0x00); // LDY #0
                            self.emit(0xB1);
                            self.emit(ptr_zp); // LDA (ptr),Y
                            self.emit(0x85);
                            self.emit(dst_zp); // STA lo
                            // LDA (ptr),Y with Y=1 → hi
                            self.emit(0xA0);
                            self.emit(0x01); // LDY #1
                            self.emit(0xB1);
                            self.emit(ptr_zp); // LDA (ptr),Y
                            self.emit(0x85);
                            self.emit(dst_zp + 1); // STA hi
                            true
                        } else {
                            false
                        }
                    }
                    other => {
                        // General expr → compute address into tmp ZP pair, then LDA (ptr),Y
                        let other = other.clone();
                        let ptr = self.tmp_zp;
                        self.tmp_zp += 2;
                        self.eval_expr(&other);
                        self.emit(0x85);
                        self.emit(ptr); // STA ptr_lo
                        self.emit(0xA9);
                        self.emit(0x00);
                        self.emit(0x85);
                        self.emit(ptr + 1); // STA ptr_hi = 0
                        self.emit(0xA0);
                        self.emit(0x00); // LDY #0
                        self.emit(0xB1);
                        self.emit(ptr); // LDA (ptr),Y → lo
                        self.emit(0x85);
                        self.emit(dst_zp);
                        self.emit(0xA0);
                        self.emit(0x01); // LDY #1
                        self.emit(0xB1);
                        self.emit(ptr); // LDA (ptr),Y → hi
                        self.emit(0x85);
                        self.emit(dst_zp + 1);
                        true
                    }
                }
            }
            // ── mouse_x() → 9-bit accumulated X ───────────────────────────────────
            Expr::MouseX => {
                let zp = self.mouse_zp.expect("mouse_x: mouse helper not allocated");
                // JSR helper (charge + read + delta + accumulate)
                self.emit(0x20); // JSR
                let pos = self.code.len();
                self.emit16(0x0000); // placeholder
                self.mouse_patches.push(pos);
                // STA lo, STA hi
                self.emit(0x85);
                self.emit(dst_zp);     // STA lo (from A = accum_x)
                self.emit(0xA5);
                self.emit(zp + 6);     // LDA accum_x_hi
                self.emit(0x85);
                self.emit(dst_zp + 1); // STA hi
                true
            }
            // ── word_src + rhs  (16-bit add with carry) ───────────────────────────
            Expr::BinOp(l, BinOp::Add, r) if matches!(l.as_ref(), Expr::Var(n) if matches!(self.var_types.get(n), Some(VarType::Word))) =>
            {
                if let Expr::Var(lname) = l.as_ref() {
                    if let Some(lzp) = self.var_addr(lname) {
                        match r.as_ref() {
                            Expr::Number(n) => {
                                let n = *n as u16;
                                self.emit(0x18); // CLC
                                self.emit(0xA5);
                                self.emit(lzp); // LDA lo_l
                                self.emit(0x69);
                                self.emit(n as u8); // ADC #lo_n
                                self.emit(0x85);
                                self.emit(dst_zp); // STA lo
                                self.emit(0xA5);
                                self.emit(lzp + 1); // LDA hi_l
                                self.emit(0x69);
                                self.emit((n >> 8) as u8); // ADC #hi_n
                                self.emit(0x85);
                                self.emit(dst_zp + 1); // STA hi
                                return true;
                            }
                            Expr::Var(rname)
                                if matches!(self.var_types.get(rname), Some(VarType::Word)) =>
                            {
                                if let Some(rzp) = self.var_addr(rname) {
                                    self.emit(0x18); // CLC
                                    self.emit(0xA5);
                                    self.emit(lzp); // LDA lo_l
                                    self.emit(0x65);
                                    self.emit(rzp); // ADC lo_r
                                    self.emit(0x85);
                                    self.emit(dst_zp); // STA lo
                                    self.emit(0xA5);
                                    self.emit(lzp + 1); // LDA hi_l
                                    self.emit(0x65);
                                    self.emit(rzp + 1); // ADC hi_r
                                    self.emit(0x85);
                                    self.emit(dst_zp + 1); // STA hi
                                    return true;
                                }
                            }
                            // word + 8-bit expr: add to lo, propagate carry to hi
                            other => {
                                let other = other.clone();
                                self.eval_expr(&other);
                                let tmp = self.tmp_zp;
                                self.tmp_zp += 1;
                                self.emit(0x85);
                                self.emit(tmp); // STA tmp
                                self.emit(0x18); // CLC
                                self.emit(0xA5);
                                self.emit(lzp); // LDA lo_l
                                self.emit(0x65);
                                self.emit(tmp); // ADC tmp
                                self.emit(0x85);
                                self.emit(dst_zp); // STA lo
                                self.emit(0xA5);
                                self.emit(lzp + 1); // LDA hi_l
                                self.emit(0x69);
                                self.emit(0x00); // ADC #0 (carry)
                                self.emit(0x85);
                                self.emit(dst_zp + 1); // STA hi
                                return true;
                            }
                        }
                    }
                }
                false
            }
            // ── number + word_src  (commutative: swap and use above pattern) ──────
            Expr::BinOp(l, BinOp::Add, r) if matches!(r.as_ref(), Expr::Var(n) if matches!(self.var_types.get(n), Some(VarType::Word))) =>
            {
                let swapped = Expr::BinOp(r.clone(), BinOp::Add, l.clone());
                self.gen_word_assign(dst_zp, &swapped)
            }
            // ── word_src - rhs  (16-bit sub with borrow) ─────────────────────────
            Expr::BinOp(l, BinOp::Sub, r) if matches!(l.as_ref(), Expr::Var(n) if matches!(self.var_types.get(n), Some(VarType::Word))) =>
            {
                if let Expr::Var(lname) = l.as_ref() {
                    if let Some(lzp) = self.var_addr(lname) {
                        match r.as_ref() {
                            Expr::Number(n) => {
                                let n = *n as u16;
                                self.emit(0x38); // SEC
                                self.emit(0xA5);
                                self.emit(lzp); // LDA lo_l
                                self.emit(0xE9);
                                self.emit(n as u8); // SBC #lo_n
                                self.emit(0x85);
                                self.emit(dst_zp); // STA lo
                                self.emit(0xA5);
                                self.emit(lzp + 1); // LDA hi_l
                                self.emit(0xE9);
                                self.emit((n >> 8) as u8); // SBC #hi_n
                                self.emit(0x85);
                                self.emit(dst_zp + 1); // STA hi
                                return true;
                            }
                            Expr::Var(rname)
                                if matches!(self.var_types.get(rname), Some(VarType::Word)) =>
                            {
                                if let Some(rzp) = self.var_addr(rname) {
                                    self.emit(0x38); // SEC
                                    self.emit(0xA5);
                                    self.emit(lzp); // LDA lo_l
                                    self.emit(0xE5);
                                    self.emit(rzp); // SBC lo_r
                                    self.emit(0x85);
                                    self.emit(dst_zp); // STA lo
                                    self.emit(0xA5);
                                    self.emit(lzp + 1); // LDA hi_l
                                    self.emit(0xE5);
                                    self.emit(rzp + 1); // SBC hi_r
                                    self.emit(0x85);
                                    self.emit(dst_zp + 1); // STA hi
                                    return true;
                                }
                            }
                            // word - 8-bit expr
                            other => {
                                let other = other.clone();
                                self.eval_expr(&other);
                                let tmp = self.tmp_zp;
                                self.tmp_zp += 1;
                                self.emit(0x85);
                                self.emit(tmp); // STA tmp
                                self.emit(0x38); // SEC
                                self.emit(0xA5);
                                self.emit(lzp); // LDA lo_l
                                self.emit(0xE5);
                                self.emit(tmp); // SBC tmp
                                self.emit(0x85);
                                self.emit(dst_zp); // STA lo
                                self.emit(0xA5);
                                self.emit(lzp + 1); // LDA hi_l
                                self.emit(0xE9);
                                self.emit(0x00); // SBC #0 (borrow)
                                self.emit(0x85);
                                self.emit(dst_zp + 1); // STA hi
                                return true;
                            }
                        }
                    }
                }
                false
            }
            // ── word AND rhs (16-bit bitwise AND) ────────────────────────────────
            Expr::BinOp(l, BinOp::And, r) if matches!(l.as_ref(), Expr::Var(n) if matches!(self.var_types.get(n), Some(VarType::Word))) =>
            {
                if let Expr::Var(lname) = l.as_ref() {
                    if let Some(lzp) = self.var_addr(lname) {
                        match r.as_ref() {
                            Expr::Number(n) => {
                                let n = *n as u16;
                                self.emit(0xA5);
                                self.emit(lzp); // LDA lo
                                self.emit(0x29);
                                self.emit(n as u8); // AND #lo
                                self.emit(0x85);
                                self.emit(dst_zp); // STA lo
                                self.emit(0xA5);
                                self.emit(lzp + 1); // LDA hi
                                self.emit(0x29);
                                self.emit((n >> 8) as u8); // AND #hi
                                self.emit(0x85);
                                self.emit(dst_zp + 1); // STA hi
                                return true;
                            }
                            Expr::Var(rname)
                                if matches!(self.var_types.get(rname), Some(VarType::Word)) =>
                            {
                                if let Some(rzp) = self.var_addr(rname) {
                                    self.emit(0xA5);
                                    self.emit(lzp); // LDA lo_l
                                    self.emit(0x25);
                                    self.emit(rzp); // AND lo_r
                                    self.emit(0x85);
                                    self.emit(dst_zp); // STA lo
                                    self.emit(0xA5);
                                    self.emit(lzp + 1); // LDA hi_l
                                    self.emit(0x25);
                                    self.emit(rzp + 1); // AND hi_r
                                    self.emit(0x85);
                                    self.emit(dst_zp + 1); // STA hi
                                    return true;
                                }
                            }
                            // word AND 8-bit: hi becomes 0 (AND with 0 = 0)
                            other => {
                                let other = other.clone();
                                self.eval_expr(&other);
                                let tmp = self.tmp_zp;
                                self.tmp_zp += 1;
                                self.emit(0x85);
                                self.emit(tmp); // STA tmp
                                self.emit(0xA5);
                                self.emit(lzp); // LDA lo
                                self.emit(0x25);
                                self.emit(tmp); // AND tmp
                                self.emit(0x85);
                                self.emit(dst_zp); // STA lo
                                self.emit(0xA9);
                                self.emit(0x00); // LDA #0
                                self.emit(0x85);
                                self.emit(dst_zp + 1); // STA hi
                                return true;
                            }
                        }
                    }
                }
                false
            }
            // ── const AND word (commutative) ──────────────────────────────────────
            Expr::BinOp(l, BinOp::And, r) if matches!(r.as_ref(), Expr::Var(n) if matches!(self.var_types.get(n), Some(VarType::Word))) =>
            {
                let swapped = Expr::BinOp(r.clone(), BinOp::And, l.clone());
                self.gen_word_assign(dst_zp, &swapped)
            }
            // ── word OR rhs (16-bit bitwise OR) ──────────────────────────────────
            Expr::BinOp(l, BinOp::Or, r) if matches!(l.as_ref(), Expr::Var(n) if matches!(self.var_types.get(n), Some(VarType::Word))) =>
            {
                if let Expr::Var(lname) = l.as_ref() {
                    if let Some(lzp) = self.var_addr(lname) {
                        match r.as_ref() {
                            Expr::Number(n) => {
                                let n = *n as u16;
                                self.emit(0xA5);
                                self.emit(lzp); // LDA lo
                                self.emit(0x09);
                                self.emit(n as u8); // ORA #lo
                                self.emit(0x85);
                                self.emit(dst_zp); // STA lo
                                self.emit(0xA5);
                                self.emit(lzp + 1); // LDA hi
                                self.emit(0x09);
                                self.emit((n >> 8) as u8); // ORA #hi
                                self.emit(0x85);
                                self.emit(dst_zp + 1); // STA hi
                                return true;
                            }
                            Expr::Var(rname)
                                if matches!(self.var_types.get(rname), Some(VarType::Word)) =>
                            {
                                if let Some(rzp) = self.var_addr(rname) {
                                    self.emit(0xA5);
                                    self.emit(lzp); // LDA lo_l
                                    self.emit(0x05);
                                    self.emit(rzp); // ORA lo_r
                                    self.emit(0x85);
                                    self.emit(dst_zp); // STA lo
                                    self.emit(0xA5);
                                    self.emit(lzp + 1); // LDA hi_l
                                    self.emit(0x05);
                                    self.emit(rzp + 1); // ORA hi_r
                                    self.emit(0x85);
                                    self.emit(dst_zp + 1); // STA hi
                                    return true;
                                }
                            }
                            // word OR 8-bit: hi unchanged (OR with 0 = identity)
                            other => {
                                let other = other.clone();
                                self.eval_expr(&other);
                                let tmp = self.tmp_zp;
                                self.tmp_zp += 1;
                                self.emit(0x85);
                                self.emit(tmp); // STA tmp
                                self.emit(0xA5);
                                self.emit(lzp); // LDA lo
                                self.emit(0x05);
                                self.emit(tmp); // ORA tmp
                                self.emit(0x85);
                                self.emit(dst_zp); // STA lo
                                self.emit(0xA5);
                                self.emit(lzp + 1); // LDA hi (unchanged)
                                self.emit(0x85);
                                self.emit(dst_zp + 1); // STA hi
                                return true;
                            }
                        }
                    }
                }
                false
            }
            // ── const OR word (commutative) ───────────────────────────────────────
            Expr::BinOp(l, BinOp::Or, r) if matches!(r.as_ref(), Expr::Var(n) if matches!(self.var_types.get(n), Some(VarType::Word))) =>
            {
                let swapped = Expr::BinOp(r.clone(), BinOp::Or, l.clone());
                self.gen_word_assign(dst_zp, &swapped)
            }
            // ── word XOR rhs (16-bit bitwise XOR) ────────────────────────────────
            Expr::BinOp(l, BinOp::Xor, r) if matches!(l.as_ref(), Expr::Var(n) if matches!(self.var_types.get(n), Some(VarType::Word))) =>
            {
                if let Expr::Var(lname) = l.as_ref() {
                    if let Some(lzp) = self.var_addr(lname) {
                        match r.as_ref() {
                            Expr::Number(n) => {
                                let n = *n as u16;
                                self.emit(0xA5);
                                self.emit(lzp); // LDA lo
                                self.emit(0x49);
                                self.emit(n as u8); // EOR #lo
                                self.emit(0x85);
                                self.emit(dst_zp); // STA lo
                                self.emit(0xA5);
                                self.emit(lzp + 1); // LDA hi
                                self.emit(0x49);
                                self.emit((n >> 8) as u8); // EOR #hi
                                self.emit(0x85);
                                self.emit(dst_zp + 1); // STA hi
                                return true;
                            }
                            Expr::Var(rname)
                                if matches!(self.var_types.get(rname), Some(VarType::Word)) =>
                            {
                                if let Some(rzp) = self.var_addr(rname) {
                                    self.emit(0xA5);
                                    self.emit(lzp); // LDA lo_l
                                    self.emit(0x45);
                                    self.emit(rzp); // EOR lo_r
                                    self.emit(0x85);
                                    self.emit(dst_zp); // STA lo
                                    self.emit(0xA5);
                                    self.emit(lzp + 1); // LDA hi_l
                                    self.emit(0x45);
                                    self.emit(rzp + 1); // EOR hi_r
                                    self.emit(0x85);
                                    self.emit(dst_zp + 1); // STA hi
                                    return true;
                                }
                            }
                            // word XOR 8-bit: hi unchanged (XOR with 0 = identity)
                            other => {
                                let other = other.clone();
                                self.eval_expr(&other);
                                let tmp = self.tmp_zp;
                                self.tmp_zp += 1;
                                self.emit(0x85);
                                self.emit(tmp); // STA tmp
                                self.emit(0xA5);
                                self.emit(lzp); // LDA lo
                                self.emit(0x45);
                                self.emit(tmp); // EOR tmp
                                self.emit(0x85);
                                self.emit(dst_zp); // STA lo
                                self.emit(0xA5);
                                self.emit(lzp + 1); // LDA hi (unchanged)
                                self.emit(0x85);
                                self.emit(dst_zp + 1); // STA hi
                                return true;
                            }
                        }
                    }
                }
                false
            }
            // ── const XOR word (commutative) ──────────────────────────────────────
            Expr::BinOp(l, BinOp::Xor, r) if matches!(r.as_ref(), Expr::Var(n) if matches!(self.var_types.get(n), Some(VarType::Word))) =>
            {
                let swapped = Expr::BinOp(r.clone(), BinOp::Xor, l.clone());
                self.gen_word_assign(dst_zp, &swapped)
            }
            // ── word SHL rhs (16-bit shift left) ─────────────────────────────────
            Expr::BinOp(l, BinOp::Shl, r) if matches!(l.as_ref(), Expr::Var(n) if matches!(self.var_types.get(n), Some(VarType::Word))) =>
            {
                if let Expr::Var(lname) = l.as_ref() {
                    if let Some(lzp) = self.var_addr(lname) {
                        // Copy src → dst first (handles src == dst correctly too)
                        self.emit(0xA5);
                        self.emit(lzp); // LDA lo
                        self.emit(0x85);
                        self.emit(dst_zp); // STA lo
                        self.emit(0xA5);
                        self.emit(lzp + 1); // LDA hi
                        self.emit(0x85);
                        self.emit(dst_zp + 1); // STA hi
                        match r.as_ref() {
                            Expr::Number(n) => {
                                let n = (*n as u16) as usize;
                                if n >= 16 {
                                    self.emit(0xA9);
                                    self.emit(0x00); // LDA #0
                                    self.emit(0x85);
                                    self.emit(dst_zp); // STA lo
                                    self.emit(0x85);
                                    self.emit(dst_zp + 1); // STA hi
                                } else if n == 8 {
                                    // hi = lo, lo = 0
                                    self.emit(0xA5);
                                    self.emit(dst_zp); // LDA lo
                                    self.emit(0x85);
                                    self.emit(dst_zp + 1); // STA hi
                                    self.emit(0xA9);
                                    self.emit(0x00); // LDA #0
                                    self.emit(0x85);
                                    self.emit(dst_zp); // STA lo
                                } else {
                                    for _ in 0..n {
                                        self.emit(0x06);
                                        self.emit(dst_zp); // ASL lo
                                        self.emit(0x26);
                                        self.emit(dst_zp + 1); // ROL hi
                                    }
                                }
                                return true;
                            }
                            other => {
                                let other = other.clone();
                                let cnt = self.tmp_zp;
                                self.tmp_zp += 1;
                                self.eval_expr(&other);
                                self.emit(0xF0);
                                let beq_done = self.code.len();
                                self.emit(0x00); // BEQ done
                                self.emit(0x85);
                                self.emit(cnt); // STA cnt
                                let loop_top = self.current_addr();
                                self.emit(0x06);
                                self.emit(dst_zp); // ASL lo
                                self.emit(0x26);
                                self.emit(dst_zp + 1); // ROL hi
                                self.emit(0xC6);
                                self.emit(cnt); // DEC cnt
                                self.emit(0xD0);
                                let bne_back = self.code.len();
                                self.emit(0x00); // BNE loop
                                let done = self.current_addr();
                                self.patch_bxx(bne_back, loop_top);
                                self.patch_bxx(beq_done, done);
                                return true;
                            }
                        }
                    }
                }
                false
            }
            // ── word SHR rhs (16-bit shift right) ────────────────────────────────
            Expr::BinOp(l, BinOp::Shr, r) if matches!(l.as_ref(), Expr::Var(n) if matches!(self.var_types.get(n), Some(VarType::Word))) =>
            {
                if let Expr::Var(lname) = l.as_ref() {
                    if let Some(lzp) = self.var_addr(lname) {
                        // Copy src → dst first
                        self.emit(0xA5);
                        self.emit(lzp); // LDA lo
                        self.emit(0x85);
                        self.emit(dst_zp); // STA lo
                        self.emit(0xA5);
                        self.emit(lzp + 1); // LDA hi
                        self.emit(0x85);
                        self.emit(dst_zp + 1); // STA hi
                        match r.as_ref() {
                            Expr::Number(n) => {
                                let n = (*n as u16) as usize;
                                if n >= 16 {
                                    self.emit(0xA9);
                                    self.emit(0x00); // LDA #0
                                    self.emit(0x85);
                                    self.emit(dst_zp); // STA lo
                                    self.emit(0x85);
                                    self.emit(dst_zp + 1); // STA hi
                                } else if n == 8 {
                                    // lo = hi, hi = 0
                                    self.emit(0xA5);
                                    self.emit(dst_zp + 1); // LDA hi
                                    self.emit(0x85);
                                    self.emit(dst_zp); // STA lo
                                    self.emit(0xA9);
                                    self.emit(0x00); // LDA #0
                                    self.emit(0x85);
                                    self.emit(dst_zp + 1); // STA hi
                                } else {
                                    for _ in 0..n {
                                        self.emit(0x46);
                                        self.emit(dst_zp + 1); // LSR hi (MSB first)
                                        self.emit(0x66);
                                        self.emit(dst_zp); // ROR lo
                                    }
                                }
                                return true;
                            }
                            other => {
                                let other = other.clone();
                                let cnt = self.tmp_zp;
                                self.tmp_zp += 1;
                                self.eval_expr(&other);
                                self.emit(0xF0);
                                let beq_done = self.code.len();
                                self.emit(0x00); // BEQ done
                                self.emit(0x85);
                                self.emit(cnt); // STA cnt
                                let loop_top = self.current_addr();
                                self.emit(0x46);
                                self.emit(dst_zp + 1); // LSR hi
                                self.emit(0x66);
                                self.emit(dst_zp); // ROR lo
                                self.emit(0xC6);
                                self.emit(cnt); // DEC cnt
                                self.emit(0xD0);
                                let bne_back = self.code.len();
                                self.emit(0x00); // BNE loop
                                let done = self.current_addr();
                                self.patch_bxx(bne_back, loop_top);
                                self.patch_bxx(beq_done, done);
                                return true;
                            }
                        }
                    }
                }
                false
            }
            // ── word * rhs (16×8 shift-and-add multiply) ─────────────────────────
            Expr::BinOp(l, BinOp::Mul, r) if matches!(l.as_ref(), Expr::Var(n) if matches!(self.var_types.get(n), Some(VarType::Word))) =>
            {
                if let Expr::Var(lname) = l.as_ref() {
                    if let Some(lzp) = self.var_addr(lname) {
                        // Allocate scratch: mc_lo/hi = multiplicand copy, mr = 8-bit multiplier
                        let mc_lo = self.tmp_zp;
                        self.tmp_zp += 1;
                        let mc_hi = self.tmp_zp;
                        self.tmp_zp += 1;
                        let mr = self.tmp_zp;
                        self.tmp_zp += 1;
                        // Evaluate multiplier → A → mr (use lo byte for word rhs)
                        match r.as_ref() {
                            Expr::Number(n) => {
                                self.emit(0xA9);
                                self.emit(*n as u8); // LDA #lo
                            }
                            Expr::Var(rname) => {
                                if let Some(rzp) = self.var_addr(rname) {
                                    self.emit(0xA5);
                                    self.emit(rzp); // LDA rzp (lo byte)
                                } else {
                                    self.emit(0xA9);
                                    self.emit(0x00);
                                }
                            }
                            other => {
                                let other = other.clone();
                                self.eval_expr(&other);
                            }
                        }
                        self.emit(0x85);
                        self.emit(mr); // STA mr
                        // mc = lzp (multiplicand)
                        self.emit(0xA5);
                        self.emit(lzp); // LDA lo
                        self.emit(0x85);
                        self.emit(mc_lo); // STA mc_lo
                        self.emit(0xA5);
                        self.emit(lzp + 1); // LDA hi
                        self.emit(0x85);
                        self.emit(mc_hi); // STA mc_hi
                        // result = 0
                        self.emit(0xA9);
                        self.emit(0x00); // LDA #0
                        self.emit(0x85);
                        self.emit(dst_zp); // STA lo
                        self.emit(0x85);
                        self.emit(dst_zp + 1); // STA hi
                        // LDX #8; loop: LSR mr; BCC no_add; add mc to result; no_add: ASL mc; DEX; BNE loop
                        self.emit(0xA2);
                        self.emit(0x08); // LDX #8
                        let loop_top = self.current_addr();
                        self.emit(0x46);
                        self.emit(mr); // LSR mr
                        self.emit(0x90);
                        let bcc_no_add = self.code.len();
                        self.emit(0x00); // BCC no_add
                        self.emit(0x18); // CLC
                        self.emit(0xA5);
                        self.emit(dst_zp); // LDA lo
                        self.emit(0x65);
                        self.emit(mc_lo); // ADC mc_lo
                        self.emit(0x85);
                        self.emit(dst_zp); // STA lo
                        self.emit(0xA5);
                        self.emit(dst_zp + 1); // LDA hi
                        self.emit(0x65);
                        self.emit(mc_hi); // ADC mc_hi
                        self.emit(0x85);
                        self.emit(dst_zp + 1); // STA hi
                        let no_add = self.current_addr();
                        self.patch_bxx(bcc_no_add, no_add);
                        self.emit(0x06);
                        self.emit(mc_lo); // ASL mc_lo
                        self.emit(0x26);
                        self.emit(mc_hi); // ROL mc_hi
                        self.emit(0xCA); // DEX
                        self.emit(0xD0);
                        let bne_loop = self.code.len();
                        self.emit(0x00); // BNE loop
                        self.patch_bxx(bne_loop, loop_top);
                        return true;
                    }
                }
                false
            }
            // ── const * word (commutative) ─────────────────────────────────────────
            Expr::BinOp(l, BinOp::Mul, r) if matches!(r.as_ref(), Expr::Var(n) if matches!(self.var_types.get(n), Some(VarType::Word))) =>
            {
                let swapped = Expr::BinOp(r.clone(), BinOp::Mul, l.clone());
                self.gen_word_assign(dst_zp, &swapped)
            }
            // ── word / rhs (16-bit non-restoring division) ────────────────────────
            Expr::BinOp(l, BinOp::Div, r) if matches!(l.as_ref(), Expr::Var(n) if matches!(self.var_types.get(n), Some(VarType::Word))) =>
            {
                if let Expr::Var(lname) = l.as_ref() {
                    if let Some(lzp) = self.var_addr(lname) {
                        // Scratch: num(2)=dividend→quotient, rem(2)=remainder, den(2)=divisor
                        let num_lo = self.tmp_zp;
                        self.tmp_zp += 1;
                        let num_hi = self.tmp_zp;
                        self.tmp_zp += 1;
                        let rem_lo = self.tmp_zp;
                        self.tmp_zp += 1;
                        let rem_hi = self.tmp_zp;
                        self.tmp_zp += 1;
                        let den_lo = self.tmp_zp;
                        self.tmp_zp += 1;
                        let den_hi = self.tmp_zp;
                        self.tmp_zp += 1;
                        // Set up divisor
                        match r.as_ref() {
                            Expr::Number(n) => {
                                let n = *n as u16;
                                self.emit(0xA9);
                                self.emit(n as u8); // LDA #lo
                                self.emit(0x85);
                                self.emit(den_lo); // STA den_lo
                                self.emit(0xA9);
                                self.emit((n >> 8) as u8); // LDA #hi
                                self.emit(0x85);
                                self.emit(den_hi); // STA den_hi
                            }
                            Expr::Var(rname)
                                if matches!(self.var_types.get(rname), Some(VarType::Word)) =>
                            {
                                if let Some(rzp) = self.var_addr(rname) {
                                    self.emit(0xA5);
                                    self.emit(rzp); // LDA lo
                                    self.emit(0x85);
                                    self.emit(den_lo); // STA den_lo
                                    self.emit(0xA5);
                                    self.emit(rzp + 1); // LDA hi
                                    self.emit(0x85);
                                    self.emit(den_hi); // STA den_hi
                                } else {
                                    return false;
                                }
                            }
                            other => {
                                let other = other.clone();
                                self.eval_expr(&other);
                                self.emit(0x85);
                                self.emit(den_lo); // STA den_lo (8-bit)
                                self.emit(0xA9);
                                self.emit(0x00); // LDA #0
                                self.emit(0x85);
                                self.emit(den_hi); // STA den_hi = 0
                            }
                        }
                        // num = dividend (copy lzp)
                        self.emit(0xA5);
                        self.emit(lzp); // LDA lo
                        self.emit(0x85);
                        self.emit(num_lo); // STA num_lo
                        self.emit(0xA5);
                        self.emit(lzp + 1); // LDA hi
                        self.emit(0x85);
                        self.emit(num_hi); // STA num_hi
                        // rem = 0
                        self.emit(0xA9);
                        self.emit(0x00); // LDA #0
                        self.emit(0x85);
                        self.emit(rem_lo); // STA rem_lo
                        self.emit(0x85);
                        self.emit(rem_hi); // STA rem_hi
                        // LDX #16 iterations
                        self.emit(0xA2);
                        self.emit(0x10); // LDX #16
                        let loop_top = self.current_addr();
                        // Shift num:rem left 32 bits — MSB of num shifts into rem
                        self.emit(0x06);
                        self.emit(num_lo); // ASL num_lo
                        self.emit(0x26);
                        self.emit(num_hi); // ROL num_hi
                        self.emit(0x26);
                        self.emit(rem_lo); // ROL rem_lo
                        self.emit(0x26);
                        self.emit(rem_hi); // ROL rem_hi
                        // Try to subtract: SEC; rem - den; Y=lo, A=hi
                        self.emit(0x38); // SEC
                        self.emit(0xA5);
                        self.emit(rem_lo); // LDA rem_lo
                        self.emit(0xE5);
                        self.emit(den_lo); // SBC den_lo
                        self.emit(0xA8); // TAY (save lo result)
                        self.emit(0xA5);
                        self.emit(rem_hi); // LDA rem_hi
                        self.emit(0xE5);
                        self.emit(den_hi); // SBC den_hi
                        // BCC too_small (borrow → rem < den, don't subtract)
                        self.emit(0x90);
                        let bcc_small = self.code.len();
                        self.emit(0x00);
                        // Commit subtraction: rem -= den
                        self.emit(0x85);
                        self.emit(rem_hi); // STA rem_hi
                        self.emit(0x84);
                        self.emit(rem_lo); // STY rem_lo
                        // Set quotient bit (bit 0 was cleared by ASL)
                        self.emit(0xE6);
                        self.emit(num_lo); // INC num_lo
                        let too_small = self.current_addr();
                        self.patch_bxx(bcc_small, too_small);
                        self.emit(0xCA); // DEX
                        self.emit(0xD0);
                        let bne_loop = self.code.len();
                        self.emit(0x00); // BNE loop
                        self.patch_bxx(bne_loop, loop_top);
                        // Copy quotient (num) → dst
                        self.emit(0xA5);
                        self.emit(num_lo); // LDA num_lo
                        self.emit(0x85);
                        self.emit(dst_zp); // STA lo
                        self.emit(0xA5);
                        self.emit(num_hi); // LDA num_hi
                        self.emit(0x85);
                        self.emit(dst_zp + 1); // STA hi
                        return true;
                    }
                }
                false
            }
            // ── word mod rhs (16-bit modulo — same as div but yield remainder) ────
            Expr::BinOp(l, BinOp::Mod, r) if matches!(l.as_ref(), Expr::Var(n) if matches!(self.var_types.get(n), Some(VarType::Word))) =>
            {
                if let Expr::Var(lname) = l.as_ref() {
                    if let Some(lzp) = self.var_addr(lname) {
                        let num_lo = self.tmp_zp;
                        self.tmp_zp += 1;
                        let num_hi = self.tmp_zp;
                        self.tmp_zp += 1;
                        let rem_lo = self.tmp_zp;
                        self.tmp_zp += 1;
                        let rem_hi = self.tmp_zp;
                        self.tmp_zp += 1;
                        let den_lo = self.tmp_zp;
                        self.tmp_zp += 1;
                        let den_hi = self.tmp_zp;
                        self.tmp_zp += 1;
                        match r.as_ref() {
                            Expr::Number(n) => {
                                let n = *n as u16;
                                self.emit(0xA9);
                                self.emit(n as u8);
                                self.emit(0x85);
                                self.emit(den_lo);
                                self.emit(0xA9);
                                self.emit((n >> 8) as u8);
                                self.emit(0x85);
                                self.emit(den_hi);
                            }
                            Expr::Var(rname)
                                if matches!(self.var_types.get(rname), Some(VarType::Word)) =>
                            {
                                if let Some(rzp) = self.var_addr(rname) {
                                    self.emit(0xA5);
                                    self.emit(rzp);
                                    self.emit(0x85);
                                    self.emit(den_lo);
                                    self.emit(0xA5);
                                    self.emit(rzp + 1);
                                    self.emit(0x85);
                                    self.emit(den_hi);
                                } else {
                                    return false;
                                }
                            }
                            other => {
                                let other = other.clone();
                                self.eval_expr(&other);
                                self.emit(0x85);
                                self.emit(den_lo);
                                self.emit(0xA9);
                                self.emit(0x00);
                                self.emit(0x85);
                                self.emit(den_hi);
                            }
                        }
                        self.emit(0xA5);
                        self.emit(lzp);
                        self.emit(0x85);
                        self.emit(num_lo);
                        self.emit(0xA5);
                        self.emit(lzp + 1);
                        self.emit(0x85);
                        self.emit(num_hi);
                        self.emit(0xA9);
                        self.emit(0x00);
                        self.emit(0x85);
                        self.emit(rem_lo);
                        self.emit(0x85);
                        self.emit(rem_hi);
                        self.emit(0xA2);
                        self.emit(0x10); // LDX #16
                        let loop_top = self.current_addr();
                        self.emit(0x06);
                        self.emit(num_lo);
                        self.emit(0x26);
                        self.emit(num_hi);
                        self.emit(0x26);
                        self.emit(rem_lo);
                        self.emit(0x26);
                        self.emit(rem_hi);
                        self.emit(0x38);
                        self.emit(0xA5);
                        self.emit(rem_lo);
                        self.emit(0xE5);
                        self.emit(den_lo);
                        self.emit(0xA8); // TAY
                        self.emit(0xA5);
                        self.emit(rem_hi);
                        self.emit(0xE5);
                        self.emit(den_hi);
                        self.emit(0x90);
                        let bcc_small = self.code.len();
                        self.emit(0x00); // BCC
                        self.emit(0x85);
                        self.emit(rem_hi);
                        self.emit(0x84);
                        self.emit(rem_lo);
                        self.emit(0xE6);
                        self.emit(num_lo);
                        let too_small = self.current_addr();
                        self.patch_bxx(bcc_small, too_small);
                        self.emit(0xCA);
                        self.emit(0xD0);
                        let bne_loop = self.code.len();
                        self.emit(0x00);
                        self.patch_bxx(bne_loop, loop_top);
                        // Copy remainder → dst
                        self.emit(0xA5);
                        self.emit(rem_lo); // LDA rem_lo
                        self.emit(0x85);
                        self.emit(dst_zp); // STA lo
                        self.emit(0xA5);
                        self.emit(rem_hi); // LDA rem_hi
                        self.emit(0x85);
                        self.emit(dst_zp + 1); // STA hi
                        return true;
                    }
                }
                false
            }
            // ── word_array[idx] → 16-bit load ─────────────────────────────────────
            Expr::ArrayGet(arr_name, idx_expr) if self.word_arrays.contains(arr_name.as_str()) => {
                let base = self.arrays.get(arr_name).copied().unwrap_or(0xC000);
                match idx_expr.as_ref() {
                    Expr::Number(n) => {
                        let addr = base.wrapping_add((*n as u16) * 2);
                        self.emit(0xAD);
                        self.emit16(addr); // LDA abs (lo)
                        self.emit(0x85);
                        self.emit(dst_zp); // STA lo
                        let addr_hi = addr.wrapping_add(1);
                        self.emit(0xAD);
                        self.emit16(addr_hi); // LDA abs+1 (hi)
                        self.emit(0x85);
                        self.emit(dst_zp + 1); // STA hi
                        return true;
                    }
                    _ => {
                        let idx = idx_expr.clone();
                        let ptr = self.tmp_zp;
                        self.tmp_zp += 2;
                        self.emit(0xA9);
                        self.emit(base as u8);
                        self.emit(0x85);
                        self.emit(ptr);
                        self.emit(0xA9);
                        self.emit((base >> 8) as u8);
                        self.emit(0x85);
                        self.emit(ptr + 1);
                        self.eval_expr(&idx); // index → A
                        self.emit(0x0A); // ASL A (×2 for word stride)
                        self.emit(0xA8); // TAY
                        self.emit(0xB1);
                        self.emit(ptr); // LDA (ptr),Y  → lo byte
                        self.emit(0x85);
                        self.emit(dst_zp);
                        self.emit(0xC8); // INY
                        self.emit(0xB1);
                        self.emit(ptr); // LDA (ptr),Y  → hi byte
                        self.emit(0x85);
                        self.emit(dst_zp + 1);
                        return true;
                    }
                }
            }
            // ── FnCall → call fn, then read 16-bit result from fn_ret_zp ──────
            Expr::FnCall(name, args)
                if matches!(self.fn_ret_types.get(name), Some(VarType::Word | VarType::Float)) =>
            {
                // Store args into param ZP slots
                if let Some(param_addrs) = self.sub_params.get(name).cloned() {
                    for (i, arg) in args.iter().enumerate() {
                        if let Some((zp, ptype)) = param_addrs.get(i).cloned() {
                            let arg = arg.clone();
                            if matches!(ptype, Some(VarType::Str)) {
                                if let Expr::Var(arg_name) = &arg {
                                    self.mark_used(arg_name);
                                    if let Some(arg_zp) = self.var_addr(arg_name) {
                                        self.emit(0xA5);
                                        self.emit(arg_zp);
                                        self.emit(0x85);
                                        self.emit(zp);
                                        self.emit(0xA5);
                                        self.emit(arg_zp + 1);
                                        self.emit(0x85);
                                        self.emit(zp + 1);
                                        continue;
                                    }
                                }
                            }
                            self.eval_expr(&arg);
                            self.emit(0x85);
                            self.emit(zp);
                        }
                    }
                }
                // JSR to the fn
                self.emit(0x20);
                if let Some(&addr) = self.subs.get(name) {
                    self.emit16(addr);
                } else {
                    let patch = self.code.len();
                    self.emit16(0x0000);
                    self.sub_patches.push((patch, name.clone(), 0));
                }
                // Read 16-bit result from fn_ret_zp
                if let Some(ret_zp) = self.fn_ret_zp {
                    self.emit(0xA5);
                    self.emit(ret_zp); // LDA lo
                    self.emit(0x85);
                    self.emit(dst_zp); // STA dst_lo
                    self.emit(0xA5);
                    self.emit(ret_zp + 1); // LDA hi
                    self.emit(0x85);
                    self.emit(dst_zp + 1); // STA dst_hi
                }
                return true;
            }
            _ => false,
        }
    }

    fn gen_stmt(&mut self, stmt: &Stmt) {
        match stmt {
            Stmt::VarDecl { name, vtype, expr } => {
                // Infer type from expr when not annotated
                let effective = vtype.clone().or_else(|| match expr {
                    Expr::StringLit(_) => Some(VarType::Str),
                    _ => None,
                });
                match effective {
                    Some(VarType::Array) => {
                        // Already registered in pre_scan — no ZP, no code
                        self.var_types.insert(name.clone(), VarType::Array);
                    }
                    Some(VarType::WordArray) => {
                        // Already registered in pre_scan — no ZP, no code
                        self.var_types.insert(name.clone(), VarType::WordArray);
                    }
                    Some(VarType::Word) => {
                        let zp = self.alloc_var(name);
                        self.var_types.insert(name.clone(), VarType::Word);
                        let expr = expr.clone();
                        if !self.gen_word_assign(zp, &expr) {
                            // Fallback: 8-bit eval, lo only
                            self.eval_expr(&expr);
                            self.emit(0x85);
                            self.emit(zp);
                            self.emit(0xA9);
                            self.emit(0x00);
                            self.emit(0x85);
                            self.emit(zp + 1);
                        }
                    }
                    Some(VarType::Float) => {
                        let zp = self.alloc_var(name);
                        self.var_types.insert(name.clone(), VarType::Float);
                        let expr = expr.clone();
                        // For integer literals (0..255): promote to float N.0 (hi=N, lo=0)
                        // For larger Number/FixedLit/word_var: use gen_word_assign as-is
                        match &expr {
                            Expr::Number(n) if *n >= 0 && *n <= 255 => {
                                self.emit(0xA9);
                                self.emit(0x00); // LDA #0 (no fraction)
                                self.emit(0x85);
                                self.emit(zp); // STA lo
                                self.emit(0xA9);
                                self.emit(*n as u8); // LDA #n
                                self.emit(0x85);
                                self.emit(zp + 1); // STA hi
                            }
                            _ if self.is_float_like(&expr) => {
                                // Float-typed expression (involves float var or FixedLit):
                                // use 16-bit eval_expr_word which handles Q8.8 mul/div/add/sub
                                self.eval_expr_word(&expr, zp, zp + 1);
                            }
                            _ => {
                                if !self.gen_word_assign(zp, &expr) {
                                    // Fallback: 8-bit expr → store as integer part, lo = 0
                                    self.eval_expr(&expr);
                                    self.emit(0x85);
                                    self.emit(zp + 1); // STA hi
                                    self.emit(0xA9);
                                    self.emit(0x00); // LDA #0
                                    self.emit(0x85);
                                    self.emit(zp); // STA lo
                                }
                            }
                        }
                    }
                    Some(VarType::Str) => {
                        let zp = self.alloc_var(name);
                        self.var_types.insert(name.clone(), VarType::Str);
                        if let Expr::StringLit(s) = expr {
                            let s = s.clone();
                            // JMP over inline string data
                            self.emit(0x4C);
                            let jmp_patch = self.code.len();
                            self.emit16(0x0000);
                            // Emit PETSCII string + null terminator
                            let str_addr = self.current_addr();
                            let lowercase = self.charset_lowercase;
                            for c in s.chars() {
                                self.emit(ascii_to_petscii(c, lowercase));
                            }
                            self.emit(0x00);
                            let after = self.current_addr();
                            self.patch_abs(jmp_patch, after);
                            // Store pointer in ZP pair
                            self.emit(0xA9);
                            self.emit(str_addr as u8);
                            self.emit(0x85);
                            self.emit(zp);
                            self.emit(0xA9);
                            self.emit((str_addr >> 8) as u8);
                            self.emit(0x85);
                            self.emit(zp + 1);
                        }
                    }
                    _ => {
                        let zp = self.alloc_var(name);
                        // Auto-promote to word when initial value > 255
                        if let Expr::Number(n) = expr {
                            if *n > 255_i16 || *n < 0_i16 {
                                self.var_types.insert(name.clone(), VarType::Word);
                                let v = *n as u16;
                                self.emit(0xA9);
                                self.emit(v as u8);
                                self.emit(0x85);
                                self.emit(zp);
                                self.emit(0xA9);
                                self.emit((v >> 8) as u8);
                                self.emit(0x85);
                                self.emit(zp + 1);
                            } else {
                                let expr = expr.clone();
                                self.eval_expr(&expr);
                                self.emit(0x85);
                                self.emit(zp);
                            }
                        } else if self.can_be_word_result(expr) {
                            if Self::contains_fixed_lit(expr) {
                                // Expression contains float literals — auto-promote to float
                                self.var_types.insert(name.clone(), VarType::Float);
                                let expr = expr.clone();
                                if !self.gen_word_assign(zp, &expr) {
                                    self.eval_expr_word(&expr, zp, zp + 1);
                                }
                            } else {
                                // Expression involves word variables — auto-promote to word
                                self.var_types.insert(name.clone(), VarType::Word);
                                let expr = expr.clone();
                                self.eval_expr_word(&expr, zp, zp + 1);
                            }
                        } else {
                            let expr = expr.clone();
                            self.eval_expr(&expr);
                            self.emit(0x85);
                            self.emit(zp);
                        }
                    }
                }
            }
            Stmt::Assign(name, expr) => {
                if matches!(
                    self.var_types.get(name),
                    Some(VarType::Word) | Some(VarType::Float)
                ) {
                    let is_float = matches!(self.var_types.get(name), Some(VarType::Float));
                    if let Some(zp) = self.var_addr(name) {
                        let expr = expr.clone();
                        if is_float {
                            // Float assignment: integer literals become N.0 (hi=N, lo=0)
                            match &expr {
                                Expr::Number(n) if *n >= 0 && *n <= 255 => {
                                    self.emit(0xA9);
                                    self.emit(0x00); // LDA #0 (no fraction)
                                    self.emit(0x85);
                                    self.emit(zp); // STA lo
                                    self.emit(0xA9);
                                    self.emit(*n as u8); // LDA #n
                                    self.emit(0x85);
                                    self.emit(zp + 1); // STA hi
                                }
                                _ => {
                                    if !self.gen_word_assign(zp, &expr) {
                                        // Fallback: 8-bit expr → integer part, lo = 0
                                        self.eval_expr(&expr);
                                        self.emit(0x85);
                                        self.emit(zp + 1);
                                        self.emit(0xA9);
                                        self.emit(0x00);
                                        self.emit(0x85);
                                        self.emit(zp);
                                    }
                                }
                            }
                        } else {
                            if !self.gen_word_assign(zp, &expr) {
                                // Fallback: 8-bit eval → store lo, zero-extend hi.
                                // (Must clear hi — a stale high byte from a previous
                                //  value would corrupt later 16-bit arithmetic.)
                                self.eval_expr(&expr);
                                self.emit(0x85);
                                self.emit(zp);
                                self.emit(0xA9);
                                self.emit(0x00);
                                self.emit(0x85);
                                self.emit(zp + 1);
                            }
                        }
                    }
                } else {
                    let zp = self.alloc_var(name);
                    let expr = expr.clone();
                    self.eval_expr(&expr);
                    self.emit(0x85);
                    self.emit(zp);
                }
            }
            Stmt::Print { args, no_newline } => {
                for arg in args {
                    let arg = arg.clone();
                    self.print_single_arg(&arg);
                }
                if !no_newline {
                    self.print_newline();
                }
            }
            Stmt::PrintAt { col, row, args } => {
                // Cursor positioning: KERNAL PLOT $FFF0, carry CLEAR = set position
                // (carry SET = read position — opposite! see tab() for reference)
                let col = col.clone();
                let row = row.clone();
                let args = args.clone();
                let row_zp = self.tmp_zp;
                self.tmp_zp += 1;
                self.eval_expr(&row);
                self.emit(0x85);
                self.emit(row_zp); // STA row_zp
                self.eval_expr(&col);
                self.emit(0xA8); // TAY (col → Y)
                self.emit(0xA6);
                self.emit(row_zp); // LDX row_zp (row → X)
                self.emit(0x18); // CLC (carry=0 → set cursor)
                self.emit(0x20);
                self.emit16(0xFFF0); // JSR $FFF0 (KERNAL PLOT)
                // Print arguments
                for arg in &args {
                    self.print_single_arg(arg);
                }
                // No trailing newline — cursor stays at end of printed text.
                // print at positions explicitly; newline at row 24 would scroll the screen.
            }
            Stmt::If(cond, then_body, else_body) => {
                self.eval_expr(cond);
                self.emit(0xC9);
                self.emit(0x00); // CMP #0  (nonzero = true)
                // BNE +3 skip the JMP → execute then_body
                // JMP else/end (absolute, no branch distance limit)
                self.emit(0xD0);
                self.emit(0x03); // BNE +3
                self.emit(0x4C); // JMP skip
                let skip_patch = self.code.len();
                self.emit16(0x0000);

                self.gen_stmts(then_body);

                if let Some(eb) = else_body {
                    self.emit(0x4C); // JMP past else
                    let patch_else = self.code.len();
                    self.emit16(0x0000);

                    let else_start = self.current_addr();
                    self.patch_abs(skip_patch, else_start);

                    self.gen_stmts(eb);
                    let end = self.current_addr();
                    self.code[patch_else] = end as u8;
                    self.code[patch_else + 1] = (end >> 8) as u8;
                } else {
                    let end = self.current_addr();
                    self.patch_abs(skip_patch, end);
                }
            }
            Stmt::Loop(count, body) => {
                self.break_patches.push(vec![]);
                self.continue_patches.push(vec![]);

                if *count == 0 {
                    // Infinite loop: JMP back unconditionally
                    let loop_start = self.current_addr();
                    self.gen_stmts(body);
                    // patch continues to loop_start (re-run body from the top)
                    let conts = self.continue_patches.pop().unwrap_or_default();
                    for pos in conts {
                        self.patch_abs(pos, loop_start);
                    }
                    self.emit(0x4C);
                    self.emit16(loop_start);
                } else {
                    let cnt = self.perm_zp;
                    self.perm_zp += 1; // permanent: persists across iterations
                    self.emit(0xA9);
                    self.emit(*count);
                    self.emit(0x85);
                    self.emit(cnt);
                    let loop_start = self.current_addr();
                    self.gen_stmts(body);
                    // patch continues to DEC cnt (after body, before decrement check)
                    let continue_target = self.current_addr();
                    let conts = self.continue_patches.pop().unwrap_or_default();
                    for pos in conts {
                        self.patch_abs(pos, continue_target);
                    }
                    self.emit(0xC6);
                    self.emit(cnt); // DEC cnt
                    // Use BEQ+JMP so any body size works (BNE only reaches ±128 bytes)
                    self.emit(0xF0);
                    self.emit(0x03); // BEQ +3 → skip JMP when done
                    self.emit(0x4C);
                    self.emit16(loop_start); // JMP loop_start
                }

                let loop_end = self.current_addr();
                let breaks = self.break_patches.pop().unwrap_or_default();
                for pos in breaks {
                    self.patch_abs(pos, loop_end);
                }
            }
            Stmt::ForLoop {
                var,
                from,
                to,
                step,
                body,
            } => {
                let zp = self.alloc_var(var);
                // eval from → var
                self.eval_expr(from);
                self.emit(0x85);
                self.emit(zp);

                // eval 'to' once into a permanent ZP temp (must survive loop body resets)
                let zp_to = self.perm_zp;
                self.perm_zp += 1;
                self.eval_expr(to);
                self.emit(0x85);
                self.emit(zp_to);

                // eval 'step' once into a permanent ZP temp (default 1)
                let zp_step = self.perm_zp;
                self.perm_zp += 1;
                match step {
                    Some(expr) => {
                        self.eval_expr(expr);
                    }
                    None => {
                        self.emit(0xA9);
                        self.emit(0x01);
                    }
                }
                self.emit(0x85);
                self.emit(zp_step);

                self.break_patches.push(vec![]);
                self.continue_patches.push(vec![]);
                let loop_top = self.current_addr();

                // if var > zp_to → exit  (unsigned: zp_to < var → C=0 after CMP zp_to,var? no)
                // LDA var; CMP zp_to; BEQ body (equal → run once more); BCS exit (var > to)
                self.emit(0xA5);
                self.emit(zp);
                self.emit(0xC5);
                self.emit(zp_to); // CMP zp_to
                self.emit(0x90); // BCC → continue (var < to)
                let bcc_pos = self.code.len();
                self.emit(0x00);
                self.emit(0xF0); // BEQ → continue (var == to)
                let beq_pos = self.code.len();
                self.emit(0x00);
                // var > to → exit
                self.emit(0x4C);
                let exit_pos = self.code.len();
                self.emit16(0x0000);

                let body_start = self.current_addr();
                self.patch_bxx(bcc_pos, body_start);
                self.patch_bxx(beq_pos, body_start);

                self.gen_stmts(body);

                // continue target: var += step (skip body tail, redo increment+check)
                let continue_target = self.current_addr();
                let conts = self.continue_patches.pop().unwrap_or_default();
                for pos in conts {
                    self.patch_abs(pos, continue_target);
                }

                // var += step
                self.emit(0xA5);
                self.emit(zp);
                self.emit(0x18);
                self.emit(0x75);
                self.emit(zp_step); // ADC zp_step (BUG: indexed, should be 0x65)
                // Fix: undo last 5 bytes (2+1+2) and redo correctly
                let len = self.code.len();
                self.code.truncate(len - 5);
                self.emit(0xA5);
                self.emit(zp);
                self.emit(0x18);
                self.emit(0x65);
                self.emit(zp_step); // ADC zp_step
                self.emit(0x85);
                self.emit(zp);

                self.emit(0x4C);
                self.emit16(loop_top);

                let loop_end = self.current_addr();
                self.patch_abs(exit_pos, loop_end);
                let breaks = self.break_patches.pop().unwrap_or_default();
                for pos in breaks {
                    self.patch_abs(pos, loop_end);
                }
            }
            Stmt::WhileLoop(cond, body) => {
                self.break_patches.push(vec![]);
                self.continue_patches.push(vec![]);
                let loop_top = self.current_addr();
                self.eval_expr(cond);
                self.emit(0xC9);
                self.emit(0x01); // CMP #1
                // BEQ continue → skip JMP exit (3 bytes)
                // JMP exit (absolute, no distance limit for large bodies)
                self.emit(0xF0);
                self.emit(0x03); // BEQ +3
                self.emit(0x4C); // JMP exit
                let exit_patch = self.code.len();
                self.emit16(0x0000);
                // continue:
                self.gen_stmts(body);
                // patch continues to loop_top (re-evaluate condition)
                let conts = self.continue_patches.pop().unwrap_or_default();
                for pos in conts {
                    self.patch_abs(pos, loop_top);
                }
                self.emit(0x4C);
                self.emit16(loop_top);
                let loop_end = self.current_addr();
                self.patch_abs(exit_patch, loop_end);
                let breaks = self.break_patches.pop().unwrap_or_default();
                for pos in breaks {
                    self.patch_abs(pos, loop_end);
                }
            }
            Stmt::Break => {
                self.emit(0x4C); // JMP (address patched later)
                let pos = self.code.len();
                self.emit16(0x0000);
                if let Some(list) = self.break_patches.last_mut() {
                    list.push(pos);
                }
            }
            Stmt::Continue => {
                self.emit(0x4C); // JMP (address patched later)
                let pos = self.code.len();
                self.emit16(0x0000);
                if let Some(list) = self.continue_patches.last_mut() {
                    list.push(pos);
                }
            }
            Stmt::Select {
                expr,
                cases,
                else_body,
            } => {
                let expr = expr.clone();
                let cases = cases.clone();
                let else_body = else_body.clone();
                // Store select value in permanent ZP (survives across body codegen which resets tmp_zp)
                let tmp_select = self.perm_zp;
                self.perm_zp += 1;
                self.eval_expr(&expr);
                self.emit(0x85);
                self.emit(tmp_select); // STA tmp_select

                let mut end_patches: Vec<usize> = vec![];

                for (val, body) in &cases {
                    let val = val.clone();
                    let body = body.clone();
                    // Allocate scratch slot for this case's value (used before gen_stmts clobbers tmp_zp)
                    let tmp_val = self.tmp_zp;
                    self.tmp_zp += 1;
                    self.eval_expr(&val);
                    self.emit(0x85);
                    self.emit(tmp_val); // STA tmp_val
                    self.emit(0xA5);
                    self.emit(tmp_select); // LDA tmp_select
                    self.emit(0xC5);
                    self.emit(tmp_val); // CMP tmp_val
                    // BEQ +3 → match (skip JMP next_case); JMP next_case
                    self.emit(0xF0);
                    self.emit(0x03); // BEQ +3
                    self.emit(0x4C);
                    let next_patch = self.code.len();
                    self.emit16(0x0000);

                    self.gen_stmts(&body);

                    self.emit(0x4C); // JMP end_select
                    let end_patch = self.code.len();
                    self.emit16(0x0000);
                    end_patches.push(end_patch);

                    let next_addr = self.current_addr();
                    self.patch_abs(next_patch, next_addr);
                }

                if let Some(body) = &else_body {
                    self.gen_stmts(body);
                }

                let end_addr = self.current_addr();
                for pos in end_patches {
                    self.patch_abs(pos, end_addr);
                }
            }
            Stmt::Sys { addr, arg } => {
                if let Some(a) = arg {
                    self.eval_expr(a); // result in A register before JSR
                }
                self.emit(0x20);
                self.emit16(*addr); // JSR addr
            }
            Stmt::IrqExit => {
                self.emit(0x4C);
                self.emit16(0xEA81); // JMP $EA81 (KERNAL end-of-IRQ: restores Y/X/A, RTI)
            }
            Stmt::NmiExit => {
                self.emit(0x4C);
                self.emit16(0xFE47); // JMP $FE47 (KERNAL NMI exit: restores A/X/Y, RTI)
            }
            Stmt::Nmi { handler } => {
                let handler = handler.clone();
                self.emit(0x78); // SEI (protect vector write from concurrent NMI)
                match handler {
                    Expr::Number(n) => {
                        let a = n as u16;
                        self.emit(0xA9);
                        self.emit(a as u8);
                        self.emit(0x8D);
                        self.emit16(0x0318); // STA $0318 (NMI vector lo)
                        self.emit(0xA9);
                        self.emit((a >> 8) as u8);
                        self.emit(0x8D);
                        self.emit16(0x0319); // STA $0319 (NMI vector hi)
                    }
                    Expr::Var(ref name) => {
                        let is_word =
                            matches!(self.var_types.get(name.as_str()), Some(VarType::Word));
                        let zp_opt = self.var_addr(name);
                        let sub_addr = self.subs.get(name.as_str()).copied();
                        if is_word {
                            if let Some(zp) = zp_opt {
                                self.emit(0xA5);
                                self.emit(zp);
                                self.emit(0x8D);
                                self.emit16(0x0318);
                                self.emit(0xA5);
                                self.emit(zp + 1);
                                self.emit(0x8D);
                                self.emit16(0x0319);
                            }
                        } else if let Some(addr) = sub_addr {
                            self.emit(0xA9);
                            self.emit(addr as u8);
                            self.emit(0x8D);
                            self.emit16(0x0318);
                            self.emit(0xA9);
                            self.emit((addr >> 8) as u8);
                            self.emit(0x8D);
                            self.emit16(0x0319);
                        } else {
                            // Forward reference — patch after all subs are emitted
                            self.emit(0xA9);
                            let lo_pos = self.code.len();
                            self.emit(0x00);
                            self.emit(0x8D);
                            self.emit16(0x0318);
                            self.emit(0xA9);
                            let hi_pos = self.code.len();
                            self.emit(0x00);
                            self.emit(0x8D);
                            self.emit16(0x0319);
                            let sub_name = name.clone();
                            self.nmi_patches.push((lo_pos, hi_pos, sub_name));
                        }
                    }
                    other => {
                        let o2 = other.clone();
                        self.eval_expr(&o2);
                        self.emit(0x8D);
                        self.emit16(0x0318);
                        self.emit(0xA9);
                        self.emit((self.load_addr >> 8) as u8);
                        self.emit(0x8D);
                        self.emit16(0x0319);
                    }
                }
                self.emit(0x58); // CLI
            }
            Stmt::CiaTimer { period, handler } => {
                // CIA1 timer A IRQ: period cycles between interrupts, handler at $0314/$0315
                let period = period.clone();
                let handler = handler.clone();
                self.emit(0x78); // SEI
                // Disable all CIA1 IRQs
                self.emit(0xA9);
                self.emit(0x7F);
                self.emit(0x8D);
                self.emit16(0xDC0D); // STA $DC0D (CIA1 ICR clear)
                // Load timer period lo/hi into timer A latches
                // For a 16-bit period we need to split lo/hi
                // We emit period lo first (eval_expr gives 8-bit; for word vars gen_word_assign)
                {
                    let tmp_lo = self.tmp_zp;
                    self.tmp_zp += 1;
                    let tmp_hi = self.tmp_zp;
                    self.tmp_zp += 1;
                    if !self.gen_word_assign(tmp_lo, &period) {
                        self.eval_expr(&period);
                        self.emit(0x85);
                        self.emit(tmp_lo);
                        self.emit(0xA9);
                        self.emit(0x00);
                        self.emit(0x85);
                        self.emit(tmp_hi);
                    }
                    self.emit(0xA5);
                    self.emit(tmp_lo);
                    self.emit(0x8D);
                    self.emit16(0xDC04); // STA $DC04 (timer A lo latch)
                    self.emit(0xA5);
                    self.emit(tmp_hi);
                    self.emit(0x8D);
                    self.emit16(0xDC05); // STA $DC05 (timer A hi latch)
                }
                // Set handler address at $0314/$0315
                match handler {
                    Expr::Number(n) => {
                        let a = n as u16;
                        self.emit(0xA9);
                        self.emit(a as u8);
                        self.emit(0x8D);
                        self.emit16(0x0314);
                        self.emit(0xA9);
                        self.emit((a >> 8) as u8);
                        self.emit(0x8D);
                        self.emit16(0x0315);
                    }
                    Expr::Var(ref name) => {
                        let is_word =
                            matches!(self.var_types.get(name.as_str()), Some(VarType::Word));
                        let zp_opt = self.var_addr(name);
                        let sub_addr = self.subs.get(name.as_str()).copied();
                        if is_word {
                            if let Some(zp) = zp_opt {
                                self.emit(0xA5);
                                self.emit(zp);
                                self.emit(0x8D);
                                self.emit16(0x0314);
                                self.emit(0xA5);
                                self.emit(zp + 1);
                                self.emit(0x8D);
                                self.emit16(0x0315);
                            }
                        } else if let Some(addr) = sub_addr {
                            self.emit(0xA9);
                            self.emit(addr as u8);
                            self.emit(0x8D);
                            self.emit16(0x0314);
                            self.emit(0xA9);
                            self.emit((addr >> 8) as u8);
                            self.emit(0x8D);
                            self.emit16(0x0315);
                        } else {
                            // Forward reference
                            self.emit(0xA9);
                            let lo_pos = self.code.len();
                            self.emit(0x00);
                            self.emit(0x8D);
                            self.emit16(0x0314);
                            self.emit(0xA9);
                            let hi_pos = self.code.len();
                            self.emit(0x00);
                            self.emit(0x8D);
                            self.emit16(0x0315);
                            let sub_name = name.clone();
                            self.irq_patches.push((lo_pos, hi_pos, sub_name));
                        }
                    }
                    other => {
                        let o2 = other.clone();
                        self.eval_expr(&o2);
                        self.emit(0x8D);
                        self.emit16(0x0314);
                        self.emit(0xA9);
                        self.emit((self.load_addr >> 8) as u8);
                        self.emit(0x8D);
                        self.emit16(0x0315);
                    }
                }
                // Enable timer A IRQ: bit7=1 (set mask), bit0=1 (timer A)
                self.emit(0xA9);
                self.emit(0x81);
                self.emit(0x8D);
                self.emit16(0xDC0D); // STA $DC0D
                // Start timer A: continuous mode (bit0=start, bit3=0=continuous)
                self.emit(0xA9);
                self.emit(0x01);
                self.emit(0x8D);
                self.emit16(0xDC0E); // STA $DC0E (CIA1 CRA)
                self.emit(0x58); // CLI
            }
            Stmt::ScrollX(expr) => {
                // Set $D016 bits 0-2 to expr AND 7 (horizontal fine scroll, 0-7 pixels)
                let expr = expr.clone();
                let tmp = self.tmp_zp;
                self.tmp_zp += 1;
                self.eval_expr(&expr);
                self.emit(0x29);
                self.emit(0x07); // AND #$07  (keep bits 0-2)
                self.emit(0x85);
                self.emit(tmp); // STA tmp
                self.emit(0xAD);
                self.emit16(0xD016); // LDA $D016
                self.emit(0x29);
                self.emit(0xF8); // AND #$F8  (clear bits 0-2)
                self.emit(0x05);
                self.emit(tmp); // ORA tmp
                self.emit(0x8D);
                self.emit16(0xD016); // STA $D016
            }
            Stmt::ScrollXMode { value, wide } => {
                // Set $D016 bits 0-2 and force bit 3: wide=true → 40 columns, false → 38 columns.
                let value = value.clone();
                let tmp = self.tmp_zp;
                self.tmp_zp += 1;
                self.eval_expr(&value);
                self.emit(0x29);
                self.emit(0x07); // AND #$07
                self.emit(0x85);
                self.emit(tmp); // STA tmp
                self.emit(0xAD);
                self.emit16(0xD016); // LDA $D016
                self.emit(0x29);
                self.emit(0xF0); // keep bits 4-7, clear columns/fine-scroll bits
                if *wide {
                    self.emit(0x09);
                    self.emit(0x08); // ORA #$08 (40 columns)
                }
                self.emit(0x05);
                self.emit(tmp); // ORA tmp
                self.emit(0x8D);
                self.emit16(0xD016); // STA $D016
            }
            Stmt::ScrollY(expr) => {
                // Set $D011 bits 0-2 to expr AND 7 (vertical fine scroll, 0-7 pixels)
                let expr = expr.clone();
                let tmp = self.tmp_zp;
                self.tmp_zp += 1;
                self.eval_expr(&expr);
                self.emit(0x29);
                self.emit(0x07); // AND #$07
                self.emit(0x85);
                self.emit(tmp); // STA tmp
                self.emit(0xAD);
                self.emit16(0xD011); // LDA $D011
                self.emit(0x29);
                self.emit(0xF8); // AND #$F8
                self.emit(0x05);
                self.emit(tmp); // ORA tmp
                self.emit(0x8D);
                self.emit16(0xD011); // STA $D011
            }
            Stmt::ScrollRowLeft(row) => {
                let row = row.clone();
                let row_num = match row {
                    Expr::Number(n) if (0..=24).contains(&n) => n as u16,
                    _ => panic!("scroll row: row must be a compile-time constant 0-24"),
                };
                let base = 0x0400u16 + row_num * 40;
                self.emit(0xA2);
                self.emit(0x00); // LDX #$00
                let loop_addr = self.current_addr();
                self.emit(0xBD);
                self.emit16(base + 1); // LDA base+1,X
                self.emit(0x9D);
                self.emit16(base); // STA base,X
                self.emit(0xE8); // INX
                self.emit(0xE0);
                self.emit(0x27); // CPX #39
                self.emit(0xD0); // BNE loop
                let offset = (loop_addr as i32 - (self.current_addr() as i32 + 1)) as i8;
                self.emit(offset as u8);
            }
            Stmt::Speed(expr) => {
                // U64 Turbo Control register $D031: bits 0-3 = speed index, bit 7 = badlines.
                // speed N (MHz constant) → compile-time table lookup to index 0-15
                // speed <var>           → variable holds raw index 0-15
                // Preserves bit 7 (badlines setting) and bits 4-6.
                let expr = expr.clone();
                let tmp = self.tmp_zp;
                self.tmp_zp += 1;
                match &expr {
                    Expr::Number(mhz) => {
                        let idx = mhz_to_speed_index(*mhz as i32);
                        self.emit(0xAD);
                        self.emit16(0xD031); // LDA $D031
                        self.emit(0x29);
                        self.emit(0xF0); // AND #$F0 (clear bits 0-3)
                        if idx > 0 {
                            self.emit(0x09);
                            self.emit(idx); // ORA #index
                        }
                        self.emit(0x8D);
                        self.emit16(0xD031); // STA $D031
                    }
                    _ => {
                        self.eval_expr(&expr);
                        self.emit(0x29);
                        self.emit(0x0F); // AND #$0F (safety: only bits 0-3)
                        self.emit(0x85);
                        self.emit(tmp); // STA tmp
                        self.emit(0xAD);
                        self.emit16(0xD031); // LDA $D031
                        self.emit(0x29);
                        self.emit(0xF0); // AND #$F0
                        self.emit(0x05);
                        self.emit(tmp); // ORA tmp
                        self.emit(0x8D);
                        self.emit16(0xD031); // STA $D031
                    }
                }
            }
            Stmt::Badlines(on) => {
                // U64 $D031 bit 7: 0 = badlines enabled (normal C64 timing), 1 = disabled (more CPU cycles)
                self.emit(0xAD);
                self.emit16(0xD031); // LDA $D031
                if *on {
                    self.emit(0x29);
                    self.emit(0x7F); // AND #$7F (clear bit 7 → enable badlines)
                } else {
                    self.emit(0x09);
                    self.emit(0x80); // ORA #$80 (set bit 7 → disable badlines)
                }
                self.emit(0x8D);
                self.emit16(0xD031); // STA $D031
            }
            Stmt::Lowercase => {
                // CHR$(14) → KERNAL CHROUT: switches VIC-II to lowercase/uppercase charset
                self.charset_lowercase = true;
                self.emit(0xA9);
                self.emit(0x0E); // LDA #14
                self.emit(0x20);
                self.emit16(0xFFD2); // JSR $FFD2 (CHROUT)
            }
            Stmt::Uppercase => {
                // CHR$(142) → KERNAL CHROUT: switches VIC-II to uppercase/graphics charset
                self.charset_lowercase = false;
                self.emit(0xA9);
                self.emit(0x8E); // LDA #142
                self.emit(0x20);
                self.emit16(0xFFD2); // JSR $FFD2 (CHROUT)
            }
            Stmt::SidVolume(expr) => {
                self.eval_expr(expr); // A = volume/filter byte
                self.emit(0x8D);
                self.emit16(0xD418); // STA $D418 (master volume + filter mode)
            }
            Stmt::WaitKey => {
                // CIA1 matrix direct scan — same as Expr::Waitkey but as a statement
                self.emit(0xA9);
                self.emit(0x00); // LDA #$00 — select all rows
                self.emit(0x8D);
                self.emit(0x00);
                self.emit(0xDC); // STA $DC00
                let loop_addr = self.current_addr();
                self.emit(0xAD);
                self.emit(0x01);
                self.emit(0xDC); // LDA $DC01
                self.emit(0xC9);
                self.emit(0xFF); // CMP #$FF
                self.emit(0xF0); // BEQ loop
                let beq_off = self.code.len();
                self.emit(0x00);
                self.patch_bxx(beq_off, loop_addr);
            }
            Stmt::WaitGetch => {
                // Blocking wait until a keypress: JSR $FFE4 (GETIN); CMP #0; BEQ loop
                // 7 bytes: 20 E4 FF  C9 00  F0 F9
                let loop_addr = self.current_addr();
                self.emit(0x20);
                self.emit(0xE4);
                self.emit(0xFF); // JSR $FFE4
                self.emit(0xC9);
                self.emit(0x00); // CMP #$00
                self.emit(0xF0); // BEQ loop
                let beq_off = self.code.len();
                self.emit(0x00);
                self.patch_bxx(beq_off, loop_addr);
            }
            Stmt::SidStop => {
                // Zero all 25 SID registers ($D400–$D418): LDX #24; LDA #0; loop: STA $D400,X; DEX; BPL loop
                self.emit(0xA2);
                self.emit(0x18); // LDX #$18  (24)
                self.emit(0xA9);
                self.emit(0x00); // LDA #$00
                self.emit(0x9D);
                self.emit16(0xD400); // STA $D400,X
                self.emit(0xCA); // DEX
                self.emit(0x10);
                self.emit(0xFA); // BPL -6 → back to STA
            }
            Stmt::AsmBytes(bytes) => {
                for &b in bytes {
                    self.emit(b);
                }
            }
            Stmt::AsmSource(src) => {
                let base = self.load_addr + self.code.len() as u16;
                let bytes = assemble_inline(src, base);
                for b in bytes {
                    self.emit(b);
                }
            }
            Stmt::IntToStr { var, addr } => {
                let addr = *addr;
                if let Some(zp) = self.var_addr(var) {
                    self.emit_int_to_str(zp, addr);
                }
            }
            Stmt::Color { target, expr } => {
                let expr = expr.clone();
                self.eval_expr(&expr);
                let addr = match target {
                    ColorTarget::Text => 0x0286,
                    ColorTarget::Border => VIC_BORDER,
                    ColorTarget::Bg => VIC_BG,
                };
                self.emit(0x8D);
                self.emit16(addr); // STA addr
            }
            Stmt::Cls { fast } => {
                if *fast {
                    self.emit_cls_fast();
                } else {
                    // KERNAL clear screen
                    self.emit(0x20);
                    self.emit16(0xE544); // JSR $E544
                }
            }
            Stmt::Graphics { on, multi, block, dbuf } => {
                if *on {
                    if *block {
                        self.emit_graphics_on_block();
                    } else if *dbuf {
                        self.emit_graphics_on_double();
                    } else {
                        self.emit_graphics_on(*multi);
                    }
                } else {
                    self.emit_graphics_off();
                }
            }
            Stmt::Flip => {
                self.emit_flip();
            }
            Stmt::Display { on } => {
                // Set or clear DEN (bit4) in $D011.
                // display on  → LDA $D011; ORA #$10; STA $D011
                // display off → LDA $D011; AND #$EF; STA $D011
                self.emit(0xAD);
                self.emit16(0xD011); // LDA $D011
                if *on {
                    self.emit(0x09);
                    self.emit(0x10); // ORA #$10  (set DEN)
                } else {
                    self.emit(0x29);
                    self.emit(0xEF); // AND #$EF  (clear DEN)
                }
                self.emit(0x8D);
                self.emit16(0xD011); // STA $D011
            }
            Stmt::SubDef(name, params, body) => {
                let addr = self.current_addr();
                self.subs.insert(name.clone(), addr);
                // Register params as vars with their pre-allocated ZP addresses
                if let Some(param_addrs) = self.sub_params.get(name).cloned() {
                    for (i, (param_name, _ptype)) in params.iter().enumerate() {
                        if let Some((zp, ptype)) = param_addrs.get(i).cloned() {
                            self.vars.insert(param_name.clone(), zp);
                            if let Some(ptype) = ptype {
                                self.var_types.insert(param_name.clone(), ptype);
                            }
                        }
                    }
                }
                self.gen_stmts(body);
                self.emit(0x60); // RTS
            }
            Stmt::FnDef(name, params, ret_type, body) => {
                let addr = self.current_addr();
                self.subs.insert(name.clone(), addr);
                // Register params as vars with their pre-allocated ZP addresses
                if let Some(param_addrs) = self.sub_params.get(name).cloned() {
                    for (i, (param_name, _ptype)) in params.iter().enumerate() {
                        if let Some((zp, ptype)) = param_addrs.get(i).cloned() {
                            self.vars.insert(param_name.clone(), zp);
                            if let Some(ptype) = ptype {
                                self.var_types.insert(param_name.clone(), ptype);
                            }
                        }
                    }
                }
                let prev_ret_type = self.fn_ret_type.clone();
                self.fn_ret_type = ret_type.clone();
                self.gen_stmts(body);
                self.fn_ret_type = prev_ret_type;
                self.emit(0x60); // RTS
            }
            Stmt::Call(name, args, src_line) => {
                // Store args into the sub's parameter ZP slots before calling
                if let Some(param_addrs) = self.sub_params.get(name).cloned() {
                    for (i, arg) in args.iter().enumerate() {
                        if let Some((zp, ptype)) = param_addrs.get(i).cloned() {
                            let arg = arg.clone();
                            if matches!(ptype, Some(VarType::Str)) {
                                if let Expr::Var(arg_name) = &arg {
                                    self.mark_used(arg_name);
                                    if let Some(arg_zp) = self.var_addr(arg_name) {
                                        self.emit(0xA5);
                                        self.emit(arg_zp);
                                        self.emit(0x85);
                                        self.emit(zp);
                                        self.emit(0xA5);
                                        self.emit(arg_zp + 1);
                                        self.emit(0x85);
                                        self.emit(zp + 1);
                                        continue;
                                    }
                                }
                            }
                            self.eval_expr(&arg);
                            self.emit(0x85);
                            self.emit(zp); // STA param_zp
                        }
                    }
                }
                self.emit(0x20); // JSR
                if let Some(&addr) = self.subs.get(name) {
                    self.emit16(addr);
                } else {
                    // Forward reference — patch later
                    let patch = self.code.len();
                    self.emit16(0x0000);
                    self.sub_patches.push((patch, name.clone(), *src_line));
                }
            }
            Stmt::Return(expr_opt) => {
                if let Some(expr) = expr_opt {
                    let expr = expr.clone();
                    if matches!(self.fn_ret_type, Some(VarType::Word | VarType::Float)) {
                        if let Some(ret_zp) = self.fn_ret_zp {
                            if !self.gen_word_assign(ret_zp, &expr) {
                                // Fallback: 8-bit eval, hi=0
                                self.eval_expr(&expr);
                                self.emit(0x85);
                                self.emit(ret_zp);
                                self.emit(0xA9);
                                self.emit(0x00);
                                self.emit(0x85);
                                self.emit(ret_zp + 1);
                            }
                        } else {
                            self.eval_expr(&expr);
                        }
                    } else {
                        self.eval_expr(&expr);
                    }
                }
                self.emit(0x60); // RTS
            }
            Stmt::Const(..) => {
                // Constants are handled at parse time (stored in parser.consts)
                // No code generation needed
            }
            Stmt::Label(name) => {
                let addr = self.current_addr();
                self.labels.insert(name.clone(), addr);
            }
            Stmt::Goto(name, src_line) => {
                self.emit(0x4C); // JMP
                if let Some(&addr) = self.labels.get(name) {
                    self.emit16(addr);
                } else {
                    let pos = self.code.len();
                    self.emit16(0x0000);
                    self.goto_patches.push((pos, name.clone(), *src_line));
                }
            }
            Stmt::ArraySet(arr_name, idx_expr, val_expr) => {
                // String character write: s[i] = c — STA (ptr),Y into inline string buffer
                if matches!(self.var_types.get(arr_name.as_str()), Some(VarType::Str)) {
                    self.mark_used(arr_name);
                    if let Some(ptr) = self.var_addr(arr_name) {
                        let val = val_expr.clone();
                        let idx = idx_expr.clone();
                        let tmp_val = self.tmp_zp;
                        self.tmp_zp += 1;
                        self.eval_expr(&val);
                        self.emit(0x85);
                        self.emit(tmp_val); // STA tmp_val
                        match &idx {
                            Expr::Number(n) => {
                                self.emit(0xA0);
                                self.emit(*n as u8); // LDY #n
                                self.emit(0xA5);
                                self.emit(tmp_val); // LDA tmp_val
                                self.emit(0x91);
                                self.emit(ptr); // STA (ptr),Y
                            }
                            _ => {
                                self.eval_expr(&idx);
                                self.emit(0xA8); // TAY
                                self.emit(0xA5);
                                self.emit(tmp_val); // LDA tmp_val
                                self.emit(0x91);
                                self.emit(ptr); // STA (ptr),Y
                            }
                        }
                    }
                } else {
                    let base = self.arrays.get(arr_name).copied().unwrap_or(0xC000);
                    let is_word_arr = self.word_arrays.contains(arr_name.as_str());
                    if is_word_arr {
                        // Word array: each element is 2 bytes; val must be 16-bit
                        let val = val_expr.clone();
                        let idx = idx_expr.clone();
                        let tmp_lo = self.tmp_zp;
                        self.tmp_zp += 1;
                        let tmp_hi = self.tmp_zp;
                        self.tmp_zp += 1;
                        // Evaluate 16-bit value → tmp_lo/hi
                        if !self.gen_word_assign(tmp_lo, &val) {
                            // Fallback: 8-bit eval, hi = 0
                            self.eval_expr(&val);
                            self.emit(0x85);
                            self.emit(tmp_lo);
                            self.emit(0xA9);
                            self.emit(0x00);
                            self.emit(0x85);
                            self.emit(tmp_hi);
                        }
                        match &idx {
                            Expr::Number(n) => {
                                let addr = base.wrapping_add((*n as u16) * 2);
                                self.emit(0xA5);
                                self.emit(tmp_lo); // LDA lo
                                self.emit(0x8D);
                                self.emit16(addr); // STA base+n*2
                                self.emit(0xA5);
                                self.emit(tmp_hi); // LDA hi
                                self.emit(0x8D);
                                self.emit16(addr.wrapping_add(1)); // STA base+n*2+1
                            }
                            _ => {
                                let ptr = self.tmp_zp;
                                self.tmp_zp += 2;
                                self.emit(0xA9);
                                self.emit(base as u8);
                                self.emit(0x85);
                                self.emit(ptr);
                                self.emit(0xA9);
                                self.emit((base >> 8) as u8);
                                self.emit(0x85);
                                self.emit(ptr + 1);
                                self.eval_expr(&idx); // index → A
                                self.emit(0x0A); // ASL A (×2 for word stride)
                                self.emit(0xA8); // TAY
                                self.emit(0xA5);
                                self.emit(tmp_lo); // LDA lo
                                self.emit(0x91);
                                self.emit(ptr); // STA (ptr),Y
                                self.emit(0xC8); // INY
                                self.emit(0xA5);
                                self.emit(tmp_hi); // LDA hi
                                self.emit(0x91);
                                self.emit(ptr); // STA (ptr),Y
                            }
                        }
                    } else {
                        let val = val_expr.clone();
                        let idx = idx_expr.clone();
                        self.eval_expr(&val);
                        let tmp = self.tmp_zp;
                        self.tmp_zp += 1;
                        self.emit(0x85);
                        self.emit(tmp); // STA tmp (value)
                        match &idx {
                            Expr::Number(n) => {
                                let addr = base.wrapping_add(*n as u16);
                                self.emit(0xA5);
                                self.emit(tmp); // LDA tmp
                                self.emit(0x8D);
                                self.emit16(addr); // STA base+n
                            }
                            _ => {
                                let ptr = self.tmp_zp;
                                self.tmp_zp += 2;
                                self.emit(0xA9);
                                self.emit(base as u8);
                                self.emit(0x85);
                                self.emit(ptr);
                                self.emit(0xA9);
                                self.emit((base >> 8) as u8);
                                self.emit(0x85);
                                self.emit(ptr + 1);
                                self.eval_expr(&idx); // index → A
                                self.emit(0xA8); // TAY
                                self.emit(0xA5);
                                self.emit(tmp); // LDA tmp (value)
                                self.emit(0x91);
                                self.emit(ptr); // STA (ptr),Y
                            }
                        }
                    }
                } // end string else
            }
            Stmt::Plot(x_expr, y_expr) => {
                if let Some(zp) = self.plot_zp {
                    let x = x_expr.clone();
                    let y = y_expr.clone();
                    // ZP layout: zp+0=X_lo, zp+1=X_hi, zp+2=Y

                    // Store Y (always 8-bit)
                    self.emit_store_expr_u8(&y, zp + 2);
                    self.emit_store_expr_u16(&x, zp);
                    self.emit(0x20);
                    let patch = self.code.len();
                    self.emit16(0x0000);
                    self.plot_patches.push(patch);
                }
            }
            Stmt::Circle { x, y, radius } => {
                if let Some(zp) = self.circle_zp {
                    self.emit_store_expr_u16(x, zp + 0);
                    self.emit_store_expr_u8(y, zp + 2);
                    self.emit_store_expr_u16(radius, zp + 3);
                    self.emit(0x20);
                    let patch = self.code.len();
                    self.emit16(0x0000);
                    self.circle_patches.push(patch);
                }
            }
            Stmt::Circle4 { x, y, radius } => {
                if let Some(zp) = self.circle4_zp {
                    self.emit_store_expr_u8(x, zp + 0);
                    self.emit_store_expr_u8(y, zp + 1);
                    self.emit_store_expr_u8(radius, zp + 2);
                    self.emit(0x20);
                    let patch = self.code.len();
                    self.emit16(0x0000);
                    self.circle4_patches.push(patch);
                }
            }
            Stmt::Line { x1, y1, x2, y2 }
            | Stmt::LineErase { x1, y1, x2, y2 }
            | Stmt::LineXor   { x1, y1, x2, y2 } => {
                if let Some(zp) = self.line_zp {
                    let x1 = x1.clone();
                    let y1 = y1.clone();
                    let x2 = x2.clone();
                    let y2 = y2.clone();
                    // ZP layout: cx_lo,cx_hi,cy, x2_lo,x2_hi,y2, ...
                    self.emit_store_expr_u16(&x1, zp + 0); // cx_lo, cx_hi
                    self.emit_store_expr_u8(&y1, zp + 2);  // cy
                    self.emit_store_expr_u16(&x2, zp + 3); // x2_lo, x2_hi
                    self.emit_store_expr_u8(&y2, zp + 5);  // y2
                    // JSR drawline helper (address patched after emit)
                    self.emit(0x20);
                    let patch = self.code.len();
                    self.emit16(0x0000);
                    match stmt {
                        Stmt::LineErase { .. } => self.line_erase_patches.push(patch),
                        Stmt::LineXor   { .. } => self.line_xor_patches.push(patch),
                        _                      => self.line_patches.push(patch),
                    }
                }
            }
            Stmt::Gcls => {
                self.emit_gcls();
            }
            Stmt::Bye => {
                self.emit(0x20);
                self.emit16(0xE544); // JSR $E544 — KERNAL CLS
                self.emit(0xA9);
                self.emit(0x00); // LDA #$00
                self.emit(0x85);
                self.emit(0xC6); // STA $C6 — clear keyboard buffer length
                // SEI/CLI bracket the $91 clear to prevent IRQ race with STOP key
                self.emit(0x78); // SEI
                self.emit(0xA9);
                self.emit(0xFF); // LDA #$FF
                self.emit(0x85);
                self.emit(0x91); // STA $91 — clear stop-key flag
                self.emit(0x58); // CLI
                // Jump into BASIC warm start so we avoid BREAK-line handling path.
                self.emit(0x4C);
                self.emit16(0xA659); // JMP $A659
            }
            Stmt::Incbin(path) => match std::fs::read(path) {
                Ok(bytes) => {
                    for b in bytes {
                        self.emit(b);
                    }
                }
                Err(e) => eprintln!("incbin: cannot read '{}': {}", path, e),
            },
            Stmt::LoadSid { .. } => {
                // SID data is embedded at the end of compile(), not inline here.
            }
            Stmt::Load { filename, addr } => {
                // JMP over inline filename bytes (no null terminator; SETNAM takes length)
                self.emit(0x4C);
                let jmp_pos = self.code.len();
                self.emit(0x00);
                self.emit(0x00); // placeholder
                let name_addr = self.current_addr();
                for c in filename.chars() {
                    self.emit(ascii_to_petscii(c, false));
                }
                let after_name = self.current_addr();
                self.patch_abs(jmp_pos, after_name);

                // SETNAM ($FFBD): A=len, X=name_lo, Y=name_hi
                self.emit(0xA9);
                self.emit(filename.len() as u8); // LDA #len
                self.emit(0xA2);
                self.emit(name_addr as u8); // LDX #lo
                self.emit(0xA0);
                self.emit((name_addr >> 8) as u8); // LDY #hi
                self.emit(0x20);
                self.emit16(0xFFBD); // JSR $FFBD

                // SETLFS ($FFBA): A=1 (logical#), X=8 (disk), Y=secondary
                // secondary=0 → use file's own 2-byte header address
                // secondary=1 → use address in X/Y of LOAD call
                let secondary: u8 = if addr.is_some() { 1 } else { 0 };
                self.emit(0xA9);
                self.emit(0x01); // LDA #1
                self.emit(0xA2);
                self.emit(0x08); // LDX #8
                self.emit(0xA0);
                self.emit(secondary); // LDY #secondary
                self.emit(0x20);
                self.emit16(0xFFBA); // JSR $FFBA

                // LOAD ($FFD5): A=0 (load), X=lo, Y=hi of target address
                self.emit(0xA9);
                self.emit(0x00); // LDA #0 (load, not verify)
                if let Some(addr_expr) = addr {
                    let addr_expr = addr_expr.clone();
                    match addr_expr {
                        Expr::Number(n) => {
                            let a = n as u16;
                            self.emit(0xA2);
                            self.emit(a as u8); // LDX #lo
                            self.emit(0xA0);
                            self.emit((a >> 8) as u8); // LDY #hi
                        }
                        Expr::Var(vname) => {
                            let is_word = matches!(self.var_types.get(&vname), Some(VarType::Word));
                            if is_word {
                                if let Some(zp) = self.var_addr(&vname) {
                                    self.emit(0xA2);
                                    self.emit(zp); // LDX zp_lo
                                    self.emit(0xA0);
                                    self.emit(zp + 1); // LDY zp_hi
                                } else {
                                    self.emit(0xA2);
                                    self.emit(0x00);
                                    self.emit(0xA0);
                                    self.emit(0x00);
                                }
                            } else {
                                self.eval_expr(&Expr::Var(vname));
                                self.emit(0xAA); // TAX
                                self.emit(0xA0);
                                self.emit(0x00); // LDY #0
                            }
                        }
                        other => {
                            self.eval_expr(&other);
                            self.emit(0xAA); // TAX
                            self.emit(0xA0);
                            self.emit(0x00); // LDY #0
                        }
                    }
                } else {
                    self.emit(0xA2);
                    self.emit(0x00); // LDX #0
                    self.emit(0xA0);
                    self.emit(0x00); // LDY #0
                }
                self.emit(0x20);
                self.emit16(0xFFD5); // JSR $FFD5 (LOAD)
            }
            Stmt::Input { prompt, var } => {
                let var = var.clone();
                let prompt = prompt.clone();

                // 1. Print prompt (char-by-char, no overhead)
                if let Some(p) = &prompt {
                    if !p.is_empty() {
                        self.print_str_inline(p);
                    }
                }

                let is_string = matches!(self.var_types.get(&var), Some(VarType::Str));
                let buf_size: usize = if is_string { 32 } else { 4 };
                let max_chars: u8 = if is_string { 30 } else { 3 };

                // 2. Inline buffer allocation (JMP skip; buf[N]; skip:)
                self.emit(0x4C);
                let jmp_pos = self.code.len();
                self.emit(0x00);
                self.emit(0x00);
                let buf_addr = self.current_addr();
                for _ in 0..buf_size {
                    self.emit(0x00);
                }
                self.patch_abs(jmp_pos, self.current_addr());

                // 3. Point ptr at buffer
                let (ptr_lo, ptr_hi) = if is_string {
                    let zp = self.alloc_var(&var);
                    (zp, zp + 1)
                } else {
                    let lo = self.tmp_zp;
                    self.tmp_zp += 1;
                    let hi = self.tmp_zp;
                    self.tmp_zp += 1;
                    (lo, hi)
                };
                self.emit(0xA9);
                self.emit(buf_addr as u8); // LDA #buf_lo
                self.emit(0x85);
                self.emit(ptr_lo); // STA ptr_lo
                self.emit(0xA9);
                self.emit((buf_addr >> 8) as u8); // LDA #buf_hi
                self.emit(0x85);
                self.emit(ptr_hi); // STA ptr_hi

                // 4. BASIN input loop: Y = write index, A = char from BASIN
                self.emit(0xA0);
                self.emit(0x00); // LDY #0
                let loop_top = self.current_addr();
                self.emit(0x20);
                self.emit16(0xFFCF); // JSR $FFCF (BASIN — blocking, echo)

                // CMP #$0D (CR) → done
                self.emit(0xC9);
                self.emit(0x0D);
                let beq_done = self.code.len();
                self.emit(0xF0);
                self.emit(0x00);

                // CMP #$14 (DEL/BACKSPACE)
                self.emit(0xC9);
                self.emit(0x14);
                let beq_del = self.code.len();
                self.emit(0xF0);
                self.emit(0x00);

                // For int: only accept '0'–'9'
                let (bcc_digit, bcs_digit) = if !is_string {
                    self.emit(0xC9);
                    self.emit(0x30); // CMP #'0'
                    let bcc = self.code.len();
                    self.emit(0x90);
                    self.emit(0x00);
                    self.emit(0xC9);
                    self.emit(0x3A); // CMP #':' (one past '9')
                    let bcs = self.code.len();
                    self.emit(0xB0);
                    self.emit(0x00);
                    (Some(bcc), Some(bcs))
                } else {
                    (None, None)
                };

                // CPY #max → skip if full
                self.emit(0xC0);
                self.emit(max_chars);
                let bcs_max = self.code.len();
                self.emit(0xB0);
                self.emit(0x00);

                self.emit(0x91);
                self.emit(ptr_lo); // STA (ptr),Y
                self.emit(0xC8); // INY

                // skip_store: JMP loop_top
                let skip_addr = self.current_addr();
                self.emit(0x4C);
                self.emit16(loop_top);

                // For integer mode: invalid char handler — erase echoed char with DEL ($14),
                // then loop back. BASIN already echoed the char; CHROUT $14 erases it.
                let inv_char_addr = if !is_string {
                    let addr = self.current_addr();
                    self.emit(0xA9);
                    self.emit(0x14); // LDA #$14 (DEL)
                    self.emit(0x20);
                    self.emit16(0xFFD2); // JSR $FFD2 (CHROUT)
                    self.emit(0x4C);
                    self.emit16(loop_top); // JMP loop_top
                    addr
                } else {
                    skip_addr
                };

                // Patch digit-filter skips: invalid chars → erase echo; buffer-full → silent skip
                if let Some(bcc) = bcc_digit {
                    self.patch_bxx(bcc + 1, inv_char_addr);
                }
                if let Some(bcs) = bcs_digit {
                    self.patch_bxx(bcs + 1, inv_char_addr);
                }
                self.patch_bxx(bcs_max + 1, skip_addr);

                // DEL handler
                let del_addr = self.current_addr();
                self.patch_bxx(beq_del + 1, del_addr);
                self.emit(0xC0);
                self.emit(0x00); // CPY #0
                let beq_nodel = self.code.len();
                self.emit(0xF0);
                self.emit(0x00);
                self.emit(0x88); // DEY
                self.emit(0x4C);
                self.emit16(loop_top); // JMP loop_top
                self.patch_bxx(beq_nodel + 1, loop_top);

                // DONE
                let done_addr = self.current_addr();
                self.patch_bxx(beq_done + 1, done_addr);

                if is_string {
                    // Null-terminate
                    self.emit(0xA9);
                    self.emit(0x00); // LDA #0
                    self.emit(0x91);
                    self.emit(ptr_lo); // STA (ptr),Y
                } else {
                    // Convert digit chars in buffer → 8-bit integer → store in var
                    // Y = digit count at this point
                    let var_zp = self.alloc_var(&var);
                    let count_zp = self.tmp_zp;
                    self.tmp_zp += 1;
                    let mul2_zp = self.tmp_zp;
                    self.tmp_zp += 1;
                    let tmp10_zp = self.tmp_zp;
                    self.tmp_zp += 1;

                    self.emit(0x84);
                    self.emit(count_zp); // STY count_zp
                    self.emit(0xA9);
                    self.emit(0x00); // LDA #0 (accumulator)
                    self.emit(0xA0);
                    self.emit(0x00); // LDY #0 (digit index)

                    let conv_top = self.current_addr();
                    self.emit(0xC4);
                    self.emit(count_zp); // CPY count_zp
                    let beq_store = self.code.len();
                    self.emit(0xF0);
                    self.emit(0x00);

                    // acc*10 = acc*8 + acc*2
                    self.emit(0x0A); // ASL (*2)
                    self.emit(0x85);
                    self.emit(mul2_zp); // STA mul2_zp
                    self.emit(0x0A);
                    self.emit(0x0A); // ASL ASL (*8)
                    self.emit(0x18); // CLC
                    self.emit(0x65);
                    self.emit(mul2_zp); // ADC mul2_zp → acc*10
                    self.emit(0x85);
                    self.emit(tmp10_zp); // STA tmp10_zp

                    // Add digit value
                    self.emit(0xB1);
                    self.emit(ptr_lo); // LDA (ptr),Y (digit char)
                    self.emit(0x38); // SEC
                    self.emit(0xE9);
                    self.emit(0x30); // SBC #'0'
                    self.emit(0x18); // CLC
                    self.emit(0x65);
                    self.emit(tmp10_zp); // ADC tmp10_zp
                    self.emit(0xC8); // INY
                    self.emit(0x4C);
                    self.emit16(conv_top); // JMP conv_top

                    let store_addr = self.current_addr();
                    self.patch_bxx(beq_store + 1, store_addr);
                    self.emit(0x85);
                    self.emit(var_zp); // STA var_zp
                }
            }
            Stmt::Fill { addr, len, val } => {
                let addr = addr.clone();
                let len = len.clone();
                let val = val.clone();

                let ptr_lo = self.tmp_zp;
                self.tmp_zp += 1;
                let ptr_hi = self.tmp_zp;
                self.tmp_zp += 1;
                let pg_ctr = self.tmp_zp;
                self.tmp_zp += 1;
                let partial_ctr = self.tmp_zp;
                self.tmp_zp += 1;
                let val_zp = self.tmp_zp;
                self.tmp_zp += 1;

                // Store addr → ptr (16-bit)
                match addr {
                    Expr::Number(n) => {
                        let a = n as u16;
                        self.emit(0xA9);
                        self.emit(a as u8);
                        self.emit(0x85);
                        self.emit(ptr_lo);
                        self.emit(0xA9);
                        self.emit((a >> 8) as u8);
                        self.emit(0x85);
                        self.emit(ptr_hi);
                    }
                    Expr::Var(ref name) => {
                        let is_word =
                            matches!(self.var_types.get(name.as_str()), Some(VarType::Word));
                        let zp_opt = self.var_addr(name);
                        if is_word {
                            if let Some(zp) = zp_opt {
                                self.emit(0xA5);
                                self.emit(zp);
                                self.emit(0x85);
                                self.emit(ptr_lo);
                                self.emit(0xA5);
                                self.emit(zp + 1);
                                self.emit(0x85);
                                self.emit(ptr_hi);
                            }
                        } else {
                            self.eval_expr(&addr);
                            self.emit(0x85);
                            self.emit(ptr_lo);
                            self.emit(0xA9);
                            self.emit(0x00);
                            self.emit(0x85);
                            self.emit(ptr_hi);
                        }
                    }
                    other => {
                        self.eval_expr(&other);
                        self.emit(0x85);
                        self.emit(ptr_lo);
                        self.emit(0xA9);
                        self.emit(0x00);
                        self.emit(0x85);
                        self.emit(ptr_hi);
                    }
                }

                // Store len → pg_ctr (hi byte) + partial_ctr (lo byte)
                match len {
                    Expr::Number(n) => {
                        let l = n as u16;
                        self.emit(0xA9);
                        self.emit((l >> 8) as u8);
                        self.emit(0x85);
                        self.emit(pg_ctr);
                        self.emit(0xA9);
                        self.emit(l as u8);
                        self.emit(0x85);
                        self.emit(partial_ctr);
                    }
                    Expr::Var(ref name) => {
                        let is_word =
                            matches!(self.var_types.get(name.as_str()), Some(VarType::Word));
                        let zp_opt = self.var_addr(name);
                        if is_word {
                            if let Some(zp) = zp_opt {
                                self.emit(0xA5);
                                self.emit(zp + 1);
                                self.emit(0x85);
                                self.emit(pg_ctr);
                                self.emit(0xA5);
                                self.emit(zp);
                                self.emit(0x85);
                                self.emit(partial_ctr);
                            }
                        } else {
                            self.eval_expr(&len);
                            self.emit(0x85);
                            self.emit(partial_ctr);
                            self.emit(0xA9);
                            self.emit(0x00);
                            self.emit(0x85);
                            self.emit(pg_ctr);
                        }
                    }
                    other => {
                        self.eval_expr(&other);
                        self.emit(0x85);
                        self.emit(partial_ctr);
                        self.emit(0xA9);
                        self.emit(0x00);
                        self.emit(0x85);
                        self.emit(pg_ctr);
                    }
                }

                // val → val_zp; keep A = val through fill loops
                self.eval_expr(&val);
                self.emit(0x85);
                self.emit(val_zp);

                // Full-page fill: LDX pg_ctr; BEQ skip_pages
                self.emit(0xA5);
                self.emit(val_zp); // LDA val_zp (A = fill value)
                self.emit(0xA6);
                self.emit(pg_ctr); // LDX pg_ctr
                let beq_pages = self.code.len();
                self.emit(0xF0);
                self.emit(0x00);

                let page_top = self.current_addr();
                self.emit(0xA0);
                self.emit(0x00); // LDY #0
                let inner_top = self.current_addr();
                self.emit(0x91);
                self.emit(ptr_lo); // STA (ptr),Y
                self.emit(0xC8); // INY
                self.emit(0xD0);
                let bne_inner = self.code.len();
                self.emit(0x00);
                self.patch_bxx(bne_inner, inner_top);
                self.emit(0xE6);
                self.emit(ptr_hi); // INC ptr_hi
                self.emit(0xCA); // DEX
                self.emit(0xD0);
                let bne_page = self.code.len();
                self.emit(0x00);
                self.patch_bxx(bne_page, page_top);

                self.patch_bxx(beq_pages + 1, self.current_addr());

                // Partial fill: LDX partial_ctr; BEQ done
                self.emit(0xA6);
                self.emit(partial_ctr); // LDX partial_ctr
                let beq_part = self.code.len();
                self.emit(0xF0);
                self.emit(0x00);
                self.emit(0xA0);
                self.emit(0x00); // LDY #0
                let part_top = self.current_addr();
                self.emit(0x91);
                self.emit(ptr_lo); // STA (ptr),Y
                self.emit(0xC8); // INY
                self.emit(0xCA); // DEX
                self.emit(0xD0);
                let bne_part = self.code.len();
                self.emit(0x00);
                self.patch_bxx(bne_part, part_top);
                self.patch_bxx(beq_part + 1, self.current_addr());
            }
            Stmt::FillScreen(val_expr) => {
                // fill screen RAM $0400-$07FF (4 × 256 = 1024 bytes) with val
                // LDA #val; LDX #0; loop: STA $0400,X / $0500,X / $0600,X / $0700,X; INX; BNE loop
                let val = val_expr.clone();
                self.eval_expr(&val); // A = fill value
                self.emit(0xA2);
                self.emit(0x00); // LDX #0
                let loop_top = self.current_addr();
                self.emit(0x9D);
                self.emit(0x00);
                self.emit(0x04); // STA $0400,X
                self.emit(0x9D);
                self.emit(0x00);
                self.emit(0x05); // STA $0500,X
                self.emit(0x9D);
                self.emit(0x00);
                self.emit(0x06); // STA $0600,X
                self.emit(0x9D);
                self.emit(0x00);
                self.emit(0x07); // STA $0700,X
                self.emit(0xE8); // INX
                self.emit(0xD0);
                let bne = self.code.len();
                self.emit(0x00);
                self.patch_bxx(bne, loop_top);
            }
            Stmt::FillColor(val_expr) => {
                // fill color RAM $D800-$DBFF (4 × 256 = 1024 bytes) with val
                // LDA #val; LDX #0; loop: STA $D800,X / $D900,X / $DA00,X / $DB00,X; INX; BNE loop
                let val = val_expr.clone();
                self.eval_expr(&val); // A = fill value
                self.emit(0xA2);
                self.emit(0x00); // LDX #0
                let loop_top = self.current_addr();
                self.emit(0x9D);
                self.emit(0x00);
                self.emit(0xD8); // STA $D800,X
                self.emit(0x9D);
                self.emit(0x00);
                self.emit(0xD9); // STA $D900,X
                self.emit(0x9D);
                self.emit(0x00);
                self.emit(0xDA); // STA $DA00,X
                self.emit(0x9D);
                self.emit(0x00);
                self.emit(0xDB); // STA $DB00,X
                self.emit(0xE8); // INX
                self.emit(0xD0);
                let bne = self.code.len();
                self.emit(0x00);
                self.patch_bxx(bne, loop_top);
            }

            Stmt::Gosub(name, src_line) => {
                // JSR label — same as Goto but emits $20 (JSR) instead of $4C (JMP)
                self.emit(0x20); // JSR
                if let Some(&addr) = self.labels.get(name) {
                    self.emit16(addr);
                } else {
                    let pos = self.code.len();
                    self.emit16(0x0000);
                    self.gosub_patches.push((pos, name.clone(), *src_line));
                }
            }

            Stmt::SpriteFrame { id, addr } => {
                // Compute addr >> 6 into A, then store at $07F8+id (or $07F8,X for var id)
                let id = id.clone();
                let addr = addr.clone();

                // Step 1: compute addr >> 6 → A
                match &addr {
                    Expr::Number(n) => {
                        let page = (*n as u16) >> 6;
                        self.emit(0xA9);
                        self.emit(page as u8); // LDA #(addr>>6)
                    }
                    Expr::Var(name)
                        if self.var_types.get(name.as_str()) == Some(&VarType::Word) =>
                    {
                        // ptr = (hi<<2) | (lo>>6)  — same logic as existing Stmt::Sprite
                        let zp = *self
                            .vars
                            .get(name.as_str())
                            .expect("sprite_frame: word addr var");
                        let tmp = self.tmp_zp;
                        self.tmp_zp += 1;
                        self.emit(0xA5);
                        self.emit(zp + 1); // LDA hi
                        self.emit(0x0A);
                        self.emit(0x0A); // ASL A; ASL A (hi<<2)
                        self.emit(0x85);
                        self.emit(tmp); // STA tmp
                        self.emit(0xA5);
                        self.emit(zp); // LDA lo
                        for _ in 0..6 {
                            self.emit(0x4A);
                        } // LSR A ×6 (lo>>6)
                        self.emit(0x05);
                        self.emit(tmp); // ORA tmp
                    }
                    other => {
                        // 8-bit expression: treat as already a pointer value (addr>>6 pre-computed)
                        let other = other.clone();
                        self.eval_expr(&other);
                    }
                }

                // Step 2: store A to $07F8+id
                match &id {
                    Expr::Number(n) => {
                        let ptr_reg = 0x07F8u16 + (*n as u16);
                        self.emit(0x8D);
                        self.emit(ptr_reg as u8);
                        self.emit((ptr_reg >> 8) as u8);
                        // STA $07F8+id (absolute)
                    }
                    _ => {
                        // Variable id: save A, eval id → X, load A back, STA $07F8,X
                        let tmp2 = self.tmp_zp;
                        self.tmp_zp += 1;
                        self.emit(0x85);
                        self.emit(tmp2); // STA tmp2
                        self.eval_expr(&id);
                        self.emit(0xAA); // TAX
                        self.emit(0xA5);
                        self.emit(tmp2); // LDA tmp2
                        self.emit(0x9D);
                        self.emit(0xF8);
                        self.emit(0x07); // STA $07F8,X
                    }
                }
            }

            Stmt::CharsetBase(addr) => {
                // Compile-time directive: set charset base address
                self.charset_base = *addr;
            }

            // ── mplot x, y, color ─────────────────────────────────────────────────
            Stmt::Mplot { x, y, color } => {
                let mzp = match self.mplot_zp {
                    Some(z) => z,
                    None => {
                        panic!("mplot: mplot_zp not allocated (should have been set in pre_scan)")
                    }
                };
                let x = x.clone();
                let y = y.clone();
                let c = color.clone();
                // Evaluate x → mzp+0
                self.eval_expr(&x);
                self.emit(0x85);
                self.emit(mzp);
                // Evaluate y → mzp+1
                self.eval_expr(&y);
                self.emit(0x85);
                self.emit(mzp + 1);
                // Evaluate color → mzp+2
                self.eval_expr(&c);
                self.emit(0x85);
                self.emit(mzp + 2);
                // JSR mplot_helper (address patched in post-code phase)
                self.emit(0x20);
                let jsr_pos = self.code.len();
                self.emit(0x00);
                self.emit(0x00);
                self.mplot_patches.push(jsr_pos);
            }

            // ── music play / stop / pause / resume ───────────────────────────────
            Stmt::MusicPlay(song_expr) => {
                // LDA #song_num; JSR sid_init
                let song = song_expr.clone();
                self.eval_expr(&song); // A = song number (0-based)
                let init_addr = self.sid_init_addr.unwrap_or(0);
                self.emit(0x20);
                self.emit(init_addr as u8);
                self.emit((init_addr >> 8) as u8);
                // Set up CIA1 timer A at 19656 cycles (~50 Hz PAL)
                self.emit(0x78); // SEI
                self.emit(0xA9);
                self.emit(0x7F);
                self.emit(0x8D);
                self.emit(0x0D);
                self.emit(0xDC); // STA $DC0D — disable CIA1 IRQs
                self.emit(0xA9);
                self.emit(0xC8); // LDA #$C8  (lo of 19656)
                self.emit(0x8D);
                self.emit(0x04);
                self.emit(0xDC); // STA $DC04 — timer A lo
                self.emit(0xA9);
                self.emit(0x4C); // LDA #$4C  (hi of 19656)
                self.emit(0x8D);
                self.emit(0x05);
                self.emit(0xDC); // STA $DC05 — timer A hi
                // Wrapper address — patched in post-code phase
                self.emit(0xA9);
                let lo_pos = self.code.len();
                self.emit(0x00); // LDA #lo (placeholder)
                self.emit(0x8D);
                self.emit(0x14);
                self.emit(0x03); // STA $0314
                self.emit(0xA9);
                let hi_pos = self.code.len();
                self.emit(0x00); // LDA #hi (placeholder)
                self.emit(0x8D);
                self.emit(0x15);
                self.emit(0x03); // STA $0315
                self.emit(0xA9);
                self.emit(0x81);
                self.emit(0x8D);
                self.emit(0x0D);
                self.emit(0xDC); // STA $DC0D — enable timer A IRQ
                self.emit(0xA9);
                self.emit(0x01);
                self.emit(0x8D);
                self.emit(0x0E);
                self.emit(0xDC); // STA $DC0E — start timer A
                self.emit(0x58); // CLI
                self.music_wrap_patches.push((lo_pos, hi_pos));
            }

            Stmt::MusicStop => {
                // Disable CIA1 timer A IRQ
                self.emit(0x78); // SEI
                self.emit(0xA9);
                self.emit(0x7F);
                self.emit(0x8D);
                self.emit(0x0D);
                self.emit(0xDC); // STA $DC0D — disable CIA1 IRQs
                self.emit(0x58); // CLI
                // Zero all 25 SID registers ($D400–$D418)
                self.emit(0xA2);
                self.emit(0x18); // LDX #24
                self.emit(0xA9);
                self.emit(0x00); // LDA #0
                let loop_top = self.current_addr();
                self.emit(0x9D);
                self.emit(0x00);
                self.emit(0xD4); // STA $D400,X
                self.emit(0xCA); // DEX
                self.emit(0x10); // BPL opcode
                let bpl_off = self.code.len();
                self.emit(0x00); // BPL offset (placeholder)
                self.patch_bxx(bpl_off, loop_top);
            }

            Stmt::MusicPause => {
                // Disable CIA1 timer A IRQ without resetting SID
                self.emit(0x78); // SEI
                self.emit(0xA9);
                self.emit(0x7F);
                self.emit(0x8D);
                self.emit(0x0D);
                self.emit(0xDC); // STA $DC0D — disable CIA1 IRQs
                self.emit(0x58); // CLI
            }

            Stmt::MusicResume => {
                // Re-enable CIA1 timer A IRQ
                self.emit(0x78); // SEI
                self.emit(0xA9);
                self.emit(0x81);
                self.emit(0x8D);
                self.emit(0x0D);
                self.emit(0xDC); // STA $DC0D — re-enable CIA1 timer A
                self.emit(0x58); // CLI
            }

            // ── onerr goto label ──────────────────────────────────────────────────
            Stmt::OnErrGoto(label, src_line) => {
                // Write label address lo/hi to KERNAL IERROR vector $0300/$0301.
                // When a KERNAL I/O error occurs, it does JMP ($0300) → our label.
                self.emit(0xA9);
                let lo_pos = self.code.len();
                self.emit(0x00); // LDA #lo (placeholder)
                self.emit(0x8D);
                self.emit(0x00);
                self.emit(0x03); // STA $0300
                self.emit(0xA9);
                let hi_pos = self.code.len();
                self.emit(0x00); // LDA #hi (placeholder)
                self.emit(0x8D);
                self.emit(0x01);
                self.emit(0x03); // STA $0301
                // Resolve immediately if label already defined; otherwise defer
                if let Some(&addr) = self.labels.get(label) {
                    self.code[lo_pos] = addr as u8;
                    self.code[hi_pos] = (addr >> 8) as u8;
                } else {
                    self.onerr_patches
                        .push((lo_pos, hi_pos, label.clone(), *src_line));
                }
            }

            Stmt::Chardef { id, bytes } => {
                let id = *id;
                let charset_base = self.charset_base;
                let dst = charset_base + id as u16 * 8;

                // JMP past inline data (3 bytes for JMP instruction)
                self.emit(0x4C);
                let jmp_lo = self.code.len();
                self.emit16(0x0000);

                // 8 bytes of character data (zero-padded if fewer supplied)
                let data_addr = self.current_addr();
                let mut data = bytes.clone();
                data.resize(8, 0);
                for b in &data {
                    self.emit(*b);
                }

                // Patch JMP to instruction immediately after the data block
                let past_data = self.current_addr();
                self.patch_abs(jmp_lo, past_data);

                // Runtime: copy 8 bytes from data_addr to charset_base+id*8
                // LDY #7; loop: LDA data_addr,Y; STA dst,Y; DEY; BPL loop
                self.emit(0xA0);
                self.emit(0x07); // LDY #7
                let loop_top = self.current_addr();
                self.emit(0xB9);
                self.emit(data_addr as u8);
                self.emit((data_addr >> 8) as u8); // LDA abs,Y
                self.emit(0x99);
                self.emit(dst as u8);
                self.emit((dst >> 8) as u8); // STA dst,Y
                self.emit(0x88); // DEY
                self.emit(0x10);
                let bpl = self.code.len();
                self.emit(0x00);
                self.patch_bxx(bpl, loop_top);
            }
            Stmt::Memcopy { src, dst, len } => {
                let src = src.clone();
                let dst = dst.clone();
                let len = len.clone();

                let src_lo = self.tmp_zp;
                self.tmp_zp += 1;
                let src_hi = self.tmp_zp;
                self.tmp_zp += 1;
                let dst_lo = self.tmp_zp;
                self.tmp_zp += 1;
                let dst_hi = self.tmp_zp;
                self.tmp_zp += 1;
                let pg_ctr = self.tmp_zp;
                self.tmp_zp += 1;
                let partial_ctr = self.tmp_zp;
                self.tmp_zp += 1;

                // Helper closure inline: emit 16-bit expr to ZP pair
                macro_rules! emit_addr16 {
                    ($expr:expr, $lo:expr, $hi:expr) => {
                        match $expr {
                            Expr::Number(n) => {
                                let a = n as u16;
                                self.emit(0xA9);
                                self.emit(a as u8);
                                self.emit(0x85);
                                self.emit($lo);
                                self.emit(0xA9);
                                self.emit((a >> 8) as u8);
                                self.emit(0x85);
                                self.emit($hi);
                            }
                            Expr::Var(ref name) => {
                                let iw = matches!(
                                    self.var_types.get(name.as_str()),
                                    Some(VarType::Word)
                                );
                                let zo = self.var_addr(name);
                                if iw {
                                    if let Some(zp) = zo {
                                        self.emit(0xA5);
                                        self.emit(zp);
                                        self.emit(0x85);
                                        self.emit($lo);
                                        self.emit(0xA5);
                                        self.emit(zp + 1);
                                        self.emit(0x85);
                                        self.emit($hi);
                                    }
                                } else {
                                    self.eval_expr(&$expr);
                                    self.emit(0x85);
                                    self.emit($lo);
                                    self.emit(0xA9);
                                    self.emit(0x00);
                                    self.emit(0x85);
                                    self.emit($hi);
                                }
                            }
                            other => {
                                self.eval_expr(&other);
                                self.emit(0x85);
                                self.emit($lo);
                                self.emit(0xA9);
                                self.emit(0x00);
                                self.emit(0x85);
                                self.emit($hi);
                            }
                        }
                    };
                }
                emit_addr16!(src, src_lo, src_hi);
                emit_addr16!(dst, dst_lo, dst_hi);

                // len → pg_ctr (hi) + partial_ctr (lo)
                match len {
                    Expr::Number(n) => {
                        let l = n as u16;
                        self.emit(0xA9);
                        self.emit((l >> 8) as u8);
                        self.emit(0x85);
                        self.emit(pg_ctr);
                        self.emit(0xA9);
                        self.emit(l as u8);
                        self.emit(0x85);
                        self.emit(partial_ctr);
                    }
                    Expr::Var(ref name) => {
                        let is_word =
                            matches!(self.var_types.get(name.as_str()), Some(VarType::Word));
                        let zp_opt = self.var_addr(name);
                        if is_word {
                            if let Some(zp) = zp_opt {
                                self.emit(0xA5);
                                self.emit(zp + 1);
                                self.emit(0x85);
                                self.emit(pg_ctr);
                                self.emit(0xA5);
                                self.emit(zp);
                                self.emit(0x85);
                                self.emit(partial_ctr);
                            }
                        } else {
                            self.eval_expr(&len);
                            self.emit(0x85);
                            self.emit(partial_ctr);
                            self.emit(0xA9);
                            self.emit(0x00);
                            self.emit(0x85);
                            self.emit(pg_ctr);
                        }
                    }
                    other => {
                        self.eval_expr(&other);
                        self.emit(0x85);
                        self.emit(partial_ctr);
                        self.emit(0xA9);
                        self.emit(0x00);
                        self.emit(0x85);
                        self.emit(pg_ctr);
                    }
                }

                // Full-page copy
                self.emit(0xA6);
                self.emit(pg_ctr);
                let beq_pages = self.code.len();
                self.emit(0xF0);
                self.emit(0x00);
                let page_top = self.current_addr();
                self.emit(0xA0);
                self.emit(0x00); // LDY #0
                let inner_top = self.current_addr();
                self.emit(0xB1);
                self.emit(src_lo); // LDA (src),Y
                self.emit(0x91);
                self.emit(dst_lo); // STA (dst),Y
                self.emit(0xC8); // INY
                self.emit(0xD0);
                let bne_inner = self.code.len();
                self.emit(0x00);
                self.patch_bxx(bne_inner, inner_top);
                self.emit(0xE6);
                self.emit(src_hi); // INC src_hi
                self.emit(0xE6);
                self.emit(dst_hi); // INC dst_hi
                self.emit(0xCA); // DEX
                self.emit(0xD0);
                let bne_page = self.code.len();
                self.emit(0x00);
                self.patch_bxx(bne_page, page_top);
                self.patch_bxx(beq_pages + 1, self.current_addr());

                // Partial copy
                self.emit(0xA6);
                self.emit(partial_ctr);
                let beq_part = self.code.len();
                self.emit(0xF0);
                self.emit(0x00);
                self.emit(0xA0);
                self.emit(0x00); // LDY #0
                let part_top = self.current_addr();
                self.emit(0xB1);
                self.emit(src_lo); // LDA (src),Y
                self.emit(0x91);
                self.emit(dst_lo); // STA (dst),Y
                self.emit(0xC8); // INY
                self.emit(0xCA); // DEX
                self.emit(0xD0);
                let bne_part = self.code.len();
                self.emit(0x00);
                self.patch_bxx(bne_part, part_top);
                self.patch_bxx(beq_part + 1, self.current_addr());
            }
            Stmt::DrawMem {
                src,
                dst,
                width,
                height,
                stride,
            } => {
                let src = src.clone();
                let dst = dst.clone();
                let width = width.clone();
                let height = height.clone();
                let stride = stride.clone();

                // ZP scratch layout: src_lo, src_hi, dst_lo, dst_hi, w_hold, h_ctr, stride_zp
                let src_lo = self.tmp_zp;
                self.tmp_zp += 1;
                let src_hi = self.tmp_zp;
                self.tmp_zp += 1;
                let dst_lo = self.tmp_zp;
                self.tmp_zp += 1;
                let dst_hi = self.tmp_zp;
                self.tmp_zp += 1;
                let w_hold = self.tmp_zp;
                self.tmp_zp += 1;
                let h_ctr = self.tmp_zp;
                self.tmp_zp += 1;
                let stride_zp = self.tmp_zp;
                self.tmp_zp += 1;

                // Helper macro: load 16-bit address expr into two ZP bytes (lo, hi)
                macro_rules! emit_addr16 {
                    ($expr:expr, $lo:expr, $hi:expr) => {
                        match $expr {
                            Expr::Number(n) => {
                                let a = n as u16;
                                self.emit(0xA9);
                                self.emit(a as u8);
                                self.emit(0x85);
                                self.emit($lo);
                                self.emit(0xA9);
                                self.emit((a >> 8) as u8);
                                self.emit(0x85);
                                self.emit($hi);
                            }
                            Expr::Var(ref name) => {
                                let iw = matches!(
                                    self.var_types.get(name.as_str()),
                                    Some(VarType::Word)
                                );
                                let zo = self.var_addr(name);
                                if iw {
                                    if let Some(zp) = zo {
                                        self.emit(0xA5);
                                        self.emit(zp);
                                        self.emit(0x85);
                                        self.emit($lo);
                                        self.emit(0xA5);
                                        self.emit(zp + 1);
                                        self.emit(0x85);
                                        self.emit($hi);
                                    }
                                } else {
                                    self.eval_expr(&$expr);
                                    self.emit(0x85);
                                    self.emit($lo);
                                    self.emit(0xA9);
                                    self.emit(0x00);
                                    self.emit(0x85);
                                    self.emit($hi);
                                }
                            }
                            other => {
                                self.eval_expr(&other);
                                self.emit(0x85);
                                self.emit($lo);
                                self.emit(0xA9);
                                self.emit(0x00);
                                self.emit(0x85);
                                self.emit($hi);
                            }
                        }
                    };
                }

                // Initialise ZP slots
                emit_addr16!(src, src_lo, src_hi);
                emit_addr16!(dst, dst_lo, dst_hi);

                self.eval_expr(&width);
                self.emit(0x85);
                self.emit(w_hold); // STA w_hold

                self.eval_expr(&height);
                self.emit(0x85);
                self.emit(h_ctr); // STA h_ctr

                self.eval_expr(&stride);
                self.emit(0x85);
                self.emit(stride_zp); // STA stride_zp

                // outer_top: reset Y to 0 each row
                let outer_top = self.current_addr();
                self.emit(0xA0);
                self.emit(0x00); // LDY #0

                // inner_top: copy one pixel
                let inner_top = self.current_addr();
                self.emit(0xB1);
                self.emit(src_lo); // LDA (src_lo),Y
                self.emit(0x91);
                self.emit(dst_lo); // STA (dst_lo),Y
                self.emit(0xC8); // INY
                self.emit(0xC4);
                self.emit(w_hold); // CPY w_hold
                self.emit(0xD0);
                let bne_inner = self.code.len();
                self.emit(0x00);
                self.patch_bxx(bne_inner, inner_top);

                // Advance src by width (src_lo += w_hold, carry → src_hi)
                self.emit(0x18); // CLC
                self.emit(0xA5);
                self.emit(src_lo); // LDA src_lo
                self.emit(0x65);
                self.emit(w_hold); // ADC w_hold
                self.emit(0x85);
                self.emit(src_lo); // STA src_lo
                self.emit(0x90); // BCC (skip INC src_hi)
                let bcc_src = self.code.len();
                self.emit(0x00);
                self.emit(0xE6);
                self.emit(src_hi); // INC src_hi
                self.patch_bxx(bcc_src, self.current_addr());

                // Advance dst by stride (dst_lo += stride_zp, carry → dst_hi)
                self.emit(0x18); // CLC
                self.emit(0xA5);
                self.emit(dst_lo); // LDA dst_lo
                self.emit(0x65);
                self.emit(stride_zp); // ADC stride_zp
                self.emit(0x85);
                self.emit(dst_lo); // STA dst_lo
                self.emit(0x90); // BCC (skip INC dst_hi)
                let bcc_dst = self.code.len();
                self.emit(0x00);
                self.emit(0xE6);
                self.emit(dst_hi); // INC dst_hi
                self.patch_bxx(bcc_dst, self.current_addr());

                // Dec row counter; loop if not zero
                self.emit(0xC6);
                self.emit(h_ctr); // DEC h_ctr
                self.emit(0xD0);
                let bne_outer = self.code.len();
                self.emit(0x00);
                self.patch_bxx(bne_outer, outer_top);
            }
            Stmt::Irq { handler, line } => {
                let handler = handler.clone();
                let line = line.clone();

                self.emit(0x78); // SEI

                // Disable CIA1 timer IRQ: prevents CIA1 from competing with VIC raster IRQ
                self.emit(0xA9);
                self.emit(0x7F);
                self.emit(0x8D);
                self.emit16(0xDC0D); // STA $DC0D (CIA1 ICR)

                // ACK any pending VIC IRQ
                self.emit(0xAD);
                self.emit16(0xD019); // LDA $D019
                self.emit(0x8D);
                self.emit16(0xD019); // STA $D019 (clear flags)

                // Clear raster bit 8 ($D011 bit 7) so raster lines 0–255 are usable
                self.emit(0xAD);
                self.emit16(0xD011); // LDA $D011
                self.emit(0x29);
                self.emit(0x7F); // AND #$7F
                self.emit(0x8D);
                self.emit16(0xD011); // STA $D011

                // Set raster trigger line ($D012)
                if let Some(line_expr) = line {
                    let le = line_expr.clone();
                    self.eval_expr(&le);
                } else {
                    self.emit(0xA9);
                    self.emit(0x00); // default: line 0
                }
                self.emit(0x8D);
                self.emit16(0xD012); // STA $D012

                // Enable raster IRQ in VIC ($D01A bit 0)
                self.emit(0xA9);
                self.emit(0x01);
                self.emit(0x8D);
                self.emit16(0xD01A); // STA $D01A

                // Set BASIC soft IRQ vector ($0314/$0315)
                // Handler must end with JMP $EA81 (KERNAL end-of-IRQ) not RTI
                match handler {
                    Expr::Number(n) => {
                        let a = n as u16;
                        self.emit(0xA9);
                        self.emit(a as u8);
                        self.emit(0x8D);
                        self.emit16(0x0314);
                        self.emit(0xA9);
                        self.emit((a >> 8) as u8);
                        self.emit(0x8D);
                        self.emit16(0x0315);
                    }
                    Expr::Var(ref name) => {
                        let is_word =
                            matches!(self.var_types.get(name.as_str()), Some(VarType::Word));
                        let zp_opt = self.var_addr(name);
                        let sub_addr = self.subs.get(name.as_str()).copied();
                        if is_word {
                            if let Some(zp) = zp_opt {
                                self.emit(0xA5);
                                self.emit(zp);
                                self.emit(0x8D);
                                self.emit16(0x0314);
                                self.emit(0xA5);
                                self.emit(zp + 1);
                                self.emit(0x8D);
                                self.emit16(0x0315);
                            }
                        } else if let Some(addr) = sub_addr {
                            self.emit(0xA9);
                            self.emit(addr as u8);
                            self.emit(0x8D);
                            self.emit16(0x0314);
                            self.emit(0xA9);
                            self.emit((addr >> 8) as u8);
                            self.emit(0x8D);
                            self.emit16(0x0315);
                        } else {
                            // Forward ref to a sub defined later
                            self.emit(0xA9);
                            let lo_pos = self.code.len();
                            self.emit(0x00); // placeholder lo
                            self.emit(0x8D);
                            self.emit16(0x0314);
                            self.emit(0xA9);
                            let hi_pos = self.code.len();
                            self.emit(0x00); // placeholder hi
                            self.emit(0x8D);
                            self.emit16(0x0315);
                            let sub_name = name.clone();
                            self.irq_patches.push((lo_pos, hi_pos, sub_name));
                        }
                    }
                    other => {
                        // Best-effort: evaluate as 8-bit, store lo; hi defaults to load-addr page
                        let o2 = other.clone();
                        self.eval_expr(&o2);
                        self.emit(0x8D);
                        self.emit16(0x0314);
                        self.emit(0xA9);
                        self.emit((self.load_addr >> 8) as u8);
                        self.emit(0x8D);
                        self.emit16(0x0315);
                    }
                }

                self.emit(0x58); // CLI
            }
            Stmt::Data(_) => {
                // Data bytes were collected in pre_scan and will be emitted as a block
                // after all executable code. Nothing to emit here.
            }
            Stmt::Read(varname) => {
                let var_zp = self.alloc_var(varname);
                if let Some(zp) = self.data_zp {
                    self.emit(0xA0);
                    self.emit(0x00); // LDY #0
                    self.emit(0xB1);
                    self.emit(zp); // LDA (data_ptr),Y
                    self.emit(0x85);
                    self.emit(var_zp); // STA var_zp
                    // Increment data_ptr (16-bit: INC lo; BNE skip; INC hi)
                    self.emit(0xE6);
                    self.emit(zp); // INC data_ptr_lo
                    self.emit(0xD0);
                    self.emit(0x02); // BNE +2 (skip INC hi)
                    self.emit(0xE6);
                    self.emit(zp + 1); // INC data_ptr_hi
                }
            }
            Stmt::Wait {
                raster_target,
                value,
            } => {
                let value = value.clone();
                if *raster_target {
                    // wait raster N — spin until $D012 == N
                    let tmp = self.tmp_zp;
                    self.tmp_zp += 1;
                    self.eval_expr(&value);
                    self.emit(0x85);
                    self.emit(tmp); // STA tmp (target line)
                    let loop_top = self.code.len();
                    self.emit(0xAD);
                    self.emit(0x12);
                    self.emit(0xD0); // LDA $D012
                    self.emit(0xC5);
                    self.emit(tmp); // CMP tmp
                    let bne_pos = self.code.len();
                    self.emit(0xD0);
                    self.emit(0x00); // BNE loop_top (patched)
                    self.patch_bxx(bne_pos + 1, self.load_addr + loop_top as u16);
                } else {
                    // wait N — count N raster-line transitions via $D012 polling
                    let fc = self.tmp_zp;
                    self.tmp_zp += 1;
                    let prev = self.tmp_zp;
                    self.tmp_zp += 1;
                    self.eval_expr(&value);
                    let beq_done = self.code.len();
                    self.emit(0xF0);
                    self.emit(0x00); // BEQ done (N=0, skip)
                    self.emit(0x85);
                    self.emit(fc); // STA fc
                    let outer_top = self.code.len();
                    self.emit(0xAD);
                    self.emit(0x12);
                    self.emit(0xD0); // LDA $D012
                    self.emit(0x85);
                    self.emit(prev); // STA prev
                    let inner_top = self.code.len();
                    self.emit(0xAD);
                    self.emit(0x12);
                    self.emit(0xD0); // LDA $D012
                    self.emit(0xC5);
                    self.emit(prev); // CMP prev
                    let beq_inner = self.code.len();
                    self.emit(0xF0);
                    self.emit(0x00); // BEQ inner_top (patched)
                    self.emit(0xC6);
                    self.emit(fc); // DEC fc
                    let bne_outer = self.code.len();
                    self.emit(0xD0);
                    self.emit(0x00); // BNE outer_top (patched)
                    let done_addr = self.current_addr();
                    self.patch_bxx(beq_done + 1, done_addr);
                    self.patch_bxx(beq_inner + 1, self.load_addr + inner_top as u16);
                    self.patch_bxx(bne_outer + 1, self.load_addr + outer_top as u16);
                }
            }
            Stmt::Delay(expr) => {
                // delay N — busy-wait N PAL frames (50 Hz); uses raster line 200 ($C8)
                // Algorithm:
                //   eval N → A; if 0 skip; STA fc
                //   outer: LDA $D012; CMP #$C8; BNE outer   (wait for line 200)
                //   leave: LDA $D012; CMP #$C8; BEQ leave   (wait to leave line 200)
                //          DEC fc; BNE outer
                let expr = expr.clone();
                let fc = self.tmp_zp;
                self.tmp_zp += 1;
                self.eval_expr(&expr);
                let beq_done = self.code.len();
                self.emit(0xF0);
                self.emit(0x00); // BEQ done (N=0 skip, patched)
                self.emit(0x85);
                self.emit(fc); // STA fc
                let outer_top = self.code.len();
                self.emit(0xAD);
                self.emit(0x12);
                self.emit(0xD0); // LDA $D012
                self.emit(0xC9);
                self.emit(0xC8); // CMP #$C8 (line 200)
                let bne_outer = self.code.len();
                self.emit(0xD0);
                self.emit(0x00); // BNE outer_top (patched)
                let leave_top = self.code.len();
                self.emit(0xAD);
                self.emit(0x12);
                self.emit(0xD0); // LDA $D012
                self.emit(0xC9);
                self.emit(0xC8); // CMP #$C8
                let beq_leave = self.code.len();
                self.emit(0xF0);
                self.emit(0x00); // BEQ leave_top (patched)
                self.emit(0xC6);
                self.emit(fc); // DEC fc
                let bne_next = self.code.len();
                self.emit(0xD0);
                self.emit(0x00); // BNE outer_top (patched)
                let done_addr = self.current_addr();
                self.patch_bxx(beq_done + 1, done_addr);
                self.patch_bxx(bne_outer + 1, self.load_addr + outer_top as u16);
                self.patch_bxx(beq_leave + 1, self.load_addr + leave_top as u16);
                self.patch_bxx(bne_next + 1, self.load_addr + outer_top as u16);
            }
            Stmt::Sound {
                channel,
                freq,
                duration,
            } => {
                let channel = channel.clone();
                let freq = freq.clone();
                let duration = duration.clone();
                // Channel must be a compile-time constant 0, 1, or 2.
                let ch = match &channel {
                    Expr::Number(n) => *n as u16,
                    _ => panic!("sound: channel must be a constant 0, 1, or 2"),
                };
                assert!(ch <= 2, "sound: channel must be 0, 1, or 2");
                let base = 0xD400u16 + ch * 7;
                // $D418 master volume = $0F (all voices audible)
                self.emit(0xA9);
                self.emit(0x0F);
                self.emit(0x8D);
                self.emit16(0xD418);
                // ADSR: attack/decay = $09 (fast attack, medium decay),
                //       sustain/release = $F0 (full sustain, fast release)
                self.emit(0xA9);
                self.emit(0x09);
                self.emit(0x8D);
                self.emit16(base + 5);
                self.emit(0xA9);
                self.emit(0xF0);
                self.emit(0x8D);
                self.emit16(base + 6);
                // Frequency (16-bit)
                match &freq {
                    Expr::Number(n) => {
                        let n = *n as u16;
                        self.emit(0xA9);
                        self.emit(n as u8);
                        self.emit(0x8D);
                        self.emit16(base); // freq lo
                        self.emit(0xA9);
                        self.emit((n >> 8) as u8);
                        self.emit(0x8D);
                        self.emit16(base + 1); // freq hi
                    }
                    Expr::Var(name) => {
                        let name = name.clone();
                        if matches!(self.var_types.get(&name), Some(VarType::Word)) {
                            if let Some(zp) = self.var_addr(&name) {
                                self.emit(0xA5);
                                self.emit(zp);
                                self.emit(0x8D);
                                self.emit16(base);
                                self.emit(0xA5);
                                self.emit(zp + 1);
                                self.emit(0x8D);
                                self.emit16(base + 1);
                            }
                        } else {
                            // 8-bit var: lo = var, hi = 0
                            let fe = Expr::Var(name);
                            self.eval_expr(&fe);
                            self.emit(0x8D);
                            self.emit16(base);
                            self.emit(0xA9);
                            self.emit(0x00);
                            self.emit(0x8D);
                            self.emit16(base + 1);
                        }
                    }
                    other => {
                        let other = other.clone();
                        self.eval_expr(&other);
                        self.emit(0x8D);
                        self.emit16(base);
                        self.emit(0xA9);
                        self.emit(0x00);
                        self.emit(0x8D);
                        self.emit16(base + 1);
                    }
                }
                // GATE on: sawtooth waveform + GATE = $11
                self.emit(0xA9);
                self.emit(0x11);
                self.emit(0x8D);
                self.emit16(base + 4);
                // Wait `duration` PAL frames (count raster line 0 crossings)
                let fc = self.tmp_zp;
                self.tmp_zp += 1;
                self.eval_expr(&duration);
                let beq_skip = self.code.len();
                self.emit(0xF0);
                self.emit(0x00); // BEQ skip_wait (patched)
                self.emit(0x85);
                self.emit(fc); // STA fc
                // wait_not_zero: wait while $D012 == 0 to avoid false-positive
                let wait_nz = self.code.len();
                self.emit(0xAD);
                self.emit(0x12);
                self.emit(0xD0); // LDA $D012
                let beq_nz = self.code.len();
                self.emit(0xF0);
                self.emit(0x00); // BEQ wait_not_zero (patched)
                // wait_zero: wait until $D012 == 0 (raster line 0 = new frame)
                let wait_z = self.code.len();
                self.emit(0xAD);
                self.emit(0x12);
                self.emit(0xD0); // LDA $D012
                let bne_z = self.code.len();
                self.emit(0xD0);
                self.emit(0x00); // BNE wait_zero (patched)
                self.emit(0xC6);
                self.emit(fc); // DEC fc
                let bne_fc = self.code.len();
                self.emit(0xD0);
                self.emit(0x00); // BNE wait_not_zero (patched)
                // skip_wait: GATE off — release note
                let skip_addr = self.current_addr();
                self.patch_bxx(beq_skip + 1, skip_addr);
                self.patch_bxx(beq_nz, self.load_addr + wait_nz as u16);
                self.patch_bxx(bne_z, self.load_addr + wait_z as u16);
                self.patch_bxx(bne_fc + 1, self.load_addr + wait_nz as u16);
                // GATE off: sawtooth, no gate = $10
                self.emit(0xA9);
                self.emit(0x10);
                self.emit(0x8D);
                self.emit16(base + 4);
            }
            Stmt::Sprite {
                id,
                x,
                y,
                data_addr,
            } => {
                // VIC-II sprite registers:
                //   $D000+id*2 = X low,  $D001+id*2 = Y
                //   $D010 bit id = X bit 8 (MSB) — read-modify-write
                //   $07F8+id = sprite data pointer (screen_ram+$3F8+id; value = data_addr >> 6)
                let sprite_id = match id {
                    Expr::Number(n) => *n as u16,
                    _ => panic!("sprite: id must be a compile-time constant 0-7"),
                };
                assert!(sprite_id <= 7, "sprite: id must be 0-7");
                let x_reg = 0xD000u16 + sprite_id * 2;
                let y_reg = 0xD001u16 + sprite_id * 2;
                let msb_bit = 1u8 << (sprite_id as u8);
                let msb_clr = !msb_bit;

                // Set Y (8-bit, no MSB)
                let y = y.clone();
                self.eval_expr(&y);
                self.emit(0x8D);
                self.emit16(y_reg);

                // Set X — different code paths depending on expression type
                match x {
                    Expr::Number(n) => {
                        let xv = *n as u16;
                        self.emit(0xA9);
                        self.emit((xv & 0xFF) as u8); // LDA #lo
                        self.emit(0x8D);
                        self.emit16(x_reg); // STA $D000+id*2
                        self.emit(0xAD);
                        self.emit16(0xD010); // LDA $D010
                        if xv >= 256 {
                            self.emit(0x09);
                            self.emit(msb_bit); // ORA #bit (set MSB)
                        } else {
                            self.emit(0x29);
                            self.emit(msb_clr); // AND #~bit (clear MSB)
                        }
                        self.emit(0x8D);
                        self.emit16(0xD010); // STA $D010
                    }
                    Expr::Var(name) if self.var_types.get(name) == Some(&VarType::Word) => {
                        // Word var: lo byte → X register, hi byte → $D010 bit
                        let zp = *self.vars.get(name).expect("sprite: word var not found");
                        self.emit(0xA5);
                        self.emit(zp); // LDA zp_lo
                        self.emit(0x8D);
                        self.emit16(x_reg); // STA $D000+id*2
                        // Runtime MSB logic
                        self.emit(0xA5);
                        self.emit(zp + 1); // LDA zp_hi
                        self.emit(0xF0);
                        let beq_pos = self.code.len();
                        self.emit(0); // BEQ clear_msb (patched)
                        // hi != 0 → set MSB bit
                        self.emit(0xAD);
                        self.emit16(0xD010); // LDA $D010
                        self.emit(0x09);
                        self.emit(msb_bit); // ORA #bit
                        self.emit(0x4C);
                        let jmp_pos = self.code.len();
                        self.emit16(0); // JMP done (patched)
                        // clear_msb:
                        let clear_addr = self.current_addr();
                        self.patch_bxx(beq_pos, clear_addr);
                        self.emit(0xAD);
                        self.emit16(0xD010); // LDA $D010
                        self.emit(0x29);
                        self.emit(msb_clr); // AND #~bit
                        // done:
                        let done_addr = self.current_addr();
                        self.patch_abs(jmp_pos, done_addr);
                        self.emit(0x8D);
                        self.emit16(0xD010); // STA $D010
                    }
                    other => {
                        // 8-bit expression: X always < 256 → clear MSB bit
                        let other = other.clone();
                        self.eval_expr(&other);
                        self.emit(0x8D);
                        self.emit16(x_reg); // STA $D000+id*2
                        self.emit(0xAD);
                        self.emit16(0xD010); // LDA $D010
                        self.emit(0x29);
                        self.emit(msb_clr); // AND #~bit
                        self.emit(0x8D);
                        self.emit16(0xD010); // STA $D010
                    }
                }

                // Set data pointer (optional): ptr = data_addr >> 6 stored at $07F8+id
                let ptr_reg = 0x07F8u16 + sprite_id;
                if let Some(addr_expr) = data_addr {
                    match addr_expr {
                        Expr::Number(n) => {
                            let ptr = (*n as u16) >> 6;
                            self.emit(0xA9);
                            self.emit(ptr as u8); // LDA #(addr>>6)
                            self.emit(0x8D);
                            self.emit16(ptr_reg); // STA $07F8+id
                        }
                        Expr::Var(name) if self.var_types.get(name) == Some(&VarType::Word) => {
                            // ptr = (hi<<2) | (lo>>6)
                            let zp = *self.vars.get(name).expect("sprite: word data_addr var");
                            let tmp = self.tmp_zp;
                            self.tmp_zp += 1;
                            self.emit(0xA5);
                            self.emit(zp + 1); // LDA hi
                            self.emit(0x0A);
                            self.emit(0x0A); // ASL A; ASL A (hi<<2)
                            self.emit(0x85);
                            self.emit(tmp); // STA tmp
                            self.emit(0xA5);
                            self.emit(zp); // LDA lo
                            for _ in 0..6 {
                                self.emit(0x4A);
                            } // LSR A ×6 (lo>>6)
                            self.emit(0x05);
                            self.emit(tmp); // ORA tmp
                            self.emit(0x8D);
                            self.emit16(ptr_reg); // STA $07F8+id
                        }
                        other => {
                            // Other 8-bit expr: treat as already a pointer value (addr>>6)
                            let other = other.clone();
                            self.eval_expr(&other);
                            self.emit(0x8D);
                            self.emit16(ptr_reg); // STA $07F8+id
                        }
                    }
                }
            }
            Stmt::SpriteOn { id } => {
                // $D015: sprite enable register — set bit for this sprite
                let sprite_id = match id {
                    Expr::Number(n) => *n as u16,
                    _ => panic!("sprite_on: id must be a compile-time constant 0-7"),
                };
                let bit = 1u8 << (sprite_id as u8);
                self.emit(0xAD);
                self.emit16(0xD015); // LDA $D015
                self.emit(0x09);
                self.emit(bit); // ORA #bit
                self.emit(0x8D);
                self.emit16(0xD015); // STA $D015
            }
            Stmt::SpriteOff { id } => {
                // $D015: sprite enable register — clear bit for this sprite
                let sprite_id = match id {
                    Expr::Number(n) => *n as u16,
                    _ => panic!("sprite_off: id must be a compile-time constant 0-7"),
                };
                let bit = !(1u8 << (sprite_id as u8));
                self.emit(0xAD);
                self.emit16(0xD015); // LDA $D015
                self.emit(0x29);
                self.emit(bit); // AND #~bit
                self.emit(0x8D);
                self.emit16(0xD015); // STA $D015
            }
            Stmt::SpriteColor { id, color } => {
                // $D027+id: sprite color register
                let sprite_id = match id {
                    Expr::Number(n) => *n as u16,
                    _ => panic!("sprite_color: id must be a compile-time constant 0-7"),
                };
                let color = color.clone();
                self.eval_expr(&color);
                self.emit(0x8D);
                self.emit16(0xD027 + sprite_id); // STA $D027+id
            }
            Stmt::SpriteMulticolor { id, on } => {
                // $D01C: sprite multicolor enable register
                let sprite_id = match id {
                    Expr::Number(n) => *n as u16,
                    _ => panic!("sprite_multicolor: id must be a compile-time constant 0-7"),
                };
                let on = *on;
                let bit = 1u8 << (sprite_id as u8);
                self.emit(0xAD);
                self.emit16(0xD01C); // LDA $D01C
                if on {
                    self.emit(0x09);
                    self.emit(bit); // ORA #bit
                } else {
                    self.emit(0x29);
                    self.emit(!bit); // AND #~bit
                }
                self.emit(0x8D);
                self.emit16(0xD01C); // STA $D01C
            }
            Stmt::SpriteExpandX { id, on } => {
                // $D01D: sprite X-expand register — set/clear bit for this sprite
                let sprite_id = match id {
                    Expr::Number(n) => *n as u16,
                    _ => panic!("sprite_expand_x: id must be a compile-time constant 0-7"),
                };
                let on = *on;
                let bit = 1u8 << (sprite_id as u8);
                self.emit(0xAD);
                self.emit16(0xD01D); // LDA $D01D
                if on {
                    self.emit(0x09);
                    self.emit(bit); // ORA #bit → enable X-expand
                } else {
                    self.emit(0x29);
                    self.emit(!bit); // AND #~bit → disable X-expand
                }
                self.emit(0x8D);
                self.emit16(0xD01D); // STA $D01D
            }
            Stmt::SpriteExpandY { id, on } => {
                // $D017: sprite Y-expand register — set/clear bit for this sprite
                let sprite_id = match id {
                    Expr::Number(n) => *n as u16,
                    _ => panic!("sprite_expand_y: id must be a compile-time constant 0-7"),
                };
                let on = *on;
                let bit = 1u8 << (sprite_id as u8);
                self.emit(0xAD);
                self.emit16(0xD017); // LDA $D017
                if on {
                    self.emit(0x09);
                    self.emit(bit); // ORA #bit → enable Y-expand
                } else {
                    self.emit(0x29);
                    self.emit(!bit); // AND #~bit → disable Y-expand
                }
                self.emit(0x8D);
                self.emit16(0xD017); // STA $D017
            }
            Stmt::SpritePriority { id, on } => {
                // $D01B: sprite priority — 1=behind background, 0=in front
                let sprite_id = match id {
                    Expr::Number(n) => *n as u16,
                    _ => panic!("sprite_priority: id must be a compile-time constant 0-7"),
                };
                let on = *on;
                let bit = 1u8 << (sprite_id as u8);
                self.emit(0xAD);
                self.emit16(0xD01B); // LDA $D01B
                if on {
                    self.emit(0x09);
                    self.emit(bit); // ORA #bit → behind background
                } else {
                    self.emit(0x29);
                    self.emit(!bit); // AND #~bit → in front
                }
                self.emit(0x8D);
                self.emit16(0xD01B); // STA $D01B
            }
            Stmt::Save {
                filename,
                addr,
                len,
            } => {
                let filename = filename.clone();
                let addr = addr.clone();
                let len = len.clone();
                // Emit filename bytes inline (JMP over them)
                let name_len = filename.len() as u8;
                self.emit(0x4C);
                let jmp_pos = self.code.len();
                self.emit(0x00);
                self.emit(0x00);
                let name_addr = self.current_addr();
                for b in filename.bytes() {
                    self.emit(b);
                }
                self.patch_abs(jmp_pos, self.current_addr());
                // SETNAM: A=len, X=lo, Y=hi
                self.emit(0xA9);
                self.emit(name_len);
                self.emit(0xA2);
                self.emit(name_addr as u8);
                self.emit(0xA0);
                self.emit((name_addr >> 8) as u8);
                self.emit(0x20);
                self.emit16(0xFFBD); // JSR $FFBD (SETNAM)
                // SETLFS: A=LFN=1, X=device=8, Y=SA=0
                self.emit(0xA9);
                self.emit(0x01);
                self.emit(0xA2);
                self.emit(0x08);
                self.emit(0xA0);
                self.emit(0x00);
                self.emit(0x20);
                self.emit16(0xFFBA); // JSR $FFBA (SETLFS)
                if let (Some(addr_expr), Some(len_expr)) = (addr, len) {
                    // Allocate ZP scratch: zp_start (2 bytes) + end_lo + end_hi
                    let zp_start = self.tmp_zp;
                    self.tmp_zp += 2;
                    let end_lo = self.tmp_zp;
                    self.tmp_zp += 1;
                    let end_hi = self.tmp_zp;
                    self.tmp_zp += 1;
                    // Store start addr (16-bit) to zp_start/zp_start+1
                    match addr_expr {
                        Expr::Number(n) => {
                            let a = n as u16;
                            self.emit(0xA9);
                            self.emit(a as u8);
                            self.emit(0x85);
                            self.emit(zp_start);
                            self.emit(0xA9);
                            self.emit((a >> 8) as u8);
                            self.emit(0x85);
                            self.emit(zp_start + 1);
                        }
                        Expr::Var(ref vname)
                            if matches!(
                                self.var_types.get(vname.as_str()),
                                Some(VarType::Word)
                            ) =>
                        {
                            if let Some(zp) = self.var_addr(vname) {
                                self.emit(0xA5);
                                self.emit(zp);
                                self.emit(0x85);
                                self.emit(zp_start);
                                self.emit(0xA5);
                                self.emit(zp + 1);
                                self.emit(0x85);
                                self.emit(zp_start + 1);
                            }
                        }
                        ref other => {
                            let other = other.clone();
                            self.eval_expr(&other);
                            self.emit(0x85);
                            self.emit(zp_start);
                            self.emit(0xA9);
                            self.emit(0x00);
                            self.emit(0x85);
                            self.emit(zp_start + 1);
                        }
                    }
                    // Compute end = start + len (16-bit add)
                    match len_expr {
                        Expr::Number(n) => {
                            let l = n as u16;
                            self.emit(0x18); // CLC
                            self.emit(0xA5);
                            self.emit(zp_start);
                            self.emit(0x69);
                            self.emit(l as u8); // ADC #len_lo
                            self.emit(0x85);
                            self.emit(end_lo);
                            self.emit(0xA5);
                            self.emit(zp_start + 1);
                            self.emit(0x69);
                            self.emit((l >> 8) as u8); // ADC #len_hi
                            self.emit(0x85);
                            self.emit(end_hi);
                        }
                        ref other => {
                            let other = other.clone();
                            let len_zp = self.tmp_zp;
                            self.tmp_zp += 1;
                            self.eval_expr(&other);
                            self.emit(0x85);
                            self.emit(len_zp); // STA len_lo
                            self.emit(0x18); // CLC
                            self.emit(0xA5);
                            self.emit(zp_start);
                            self.emit(0x65);
                            self.emit(len_zp); // ADC len_lo
                            self.emit(0x85);
                            self.emit(end_lo);
                            self.emit(0xA5);
                            self.emit(zp_start + 1);
                            self.emit(0x69);
                            self.emit(0x00); // ADC #0 + carry
                            self.emit(0x85);
                            self.emit(end_hi);
                        }
                    }
                    // SAVE: A = ZP addr of start pointer, X = end_lo, Y = end_hi
                    self.emit(0xA6);
                    self.emit(end_lo); // LDX end_lo
                    self.emit(0xA4);
                    self.emit(end_hi); // LDY end_hi
                    self.emit(0xA9);
                    self.emit(zp_start); // LDA #zp_start (ZP pointer to start)
                    self.emit(0x20);
                    self.emit16(0xFFD8); // JSR $FFD8 (SAVE)
                } else {
                    // No addr/len given: call SAVE with null range (A=0, X=Y=0)
                    self.emit(0xA9);
                    self.emit(0x00);
                    self.emit(0xA2);
                    self.emit(0x00);
                    self.emit(0xA0);
                    self.emit(0x00);
                    self.emit(0x20);
                    self.emit16(0xFFD8); // JSR $FFD8 (SAVE)
                }
            }
            Stmt::Cursor { x, y } => {
                // KERNAL PLOT ($FFF0): carry CLEAR = set position (X=row, Y=col)
                // cursor x, y → col=x, row=y
                let x = x.clone();
                let y = y.clone();
                let row_zp = self.tmp_zp;
                self.tmp_zp += 1;
                self.eval_expr(&y); // evaluate row
                self.emit(0x85);
                self.emit(row_zp); // STA row_zp
                self.eval_expr(&x); // evaluate col → A
                self.emit(0xA8); // TAY (col → Y)
                self.emit(0xA6);
                self.emit(row_zp); // LDX row_zp (row → X)
                self.emit(0x18); // CLC (carry=0 → set cursor)
                self.emit(0x20);
                self.emit16(0xFFF0); // JSR $FFF0 (KERNAL PLOT)
            }
            Stmt::RepeatLoop(body, cond) => {
                let body = body.clone();
                let cond = cond.clone();
                self.break_patches.push(vec![]);
                self.continue_patches.push(vec![]);
                let loop_top = self.current_addr();
                self.gen_stmts(&body);
                // continue target: the until-condition evaluation (skip remaining body, re-check)
                let continue_target = self.current_addr();
                let conts = self.continue_patches.pop().unwrap_or_default();
                for pos in conts {
                    self.patch_abs(pos, continue_target);
                }
                // Evaluate until-condition: non-zero (1) = true → exit loop
                self.eval_expr(&cond);
                self.emit(0xC9);
                self.emit(0x01); // CMP #1
                // BEQ +3: if cond==1 (true) → skip JMP back → exit loop
                self.emit(0xF0);
                self.emit(0x03); // BEQ +3
                self.emit(0x4C);
                self.emit16(loop_top); // JMP loop_top (loop again)
                let loop_end = self.current_addr();
                let breaks = self.break_patches.pop().unwrap_or_default();
                for pos in breaks {
                    self.patch_abs(pos, loop_end);
                }
            }
            Stmt::PlotErase(x_expr, y_expr) => {
                // Clear (erase) a pixel in bitmap — uses shared plot ZP block
                if let Some(zp) = self.plot_zp {
                    let x = x_expr.clone();
                    let y = y_expr.clone();
                    self.emit_store_expr_u8(&y, zp + 2);
                    self.emit_store_expr_u16(&x, zp);
                    self.emit(0x20); // JSR
                    let patch = self.code.len();
                    self.emit16(0x0000);
                    self.plot_erase_patches.push(patch);
                }
            }
            Stmt::PlotXor(x_expr, y_expr) => {
                // XOR a pixel in bitmap — uses shared plot ZP block
                if let Some(zp) = self.plot_zp {
                    let x = x_expr.clone();
                    let y = y_expr.clone();
                    self.emit_store_expr_u8(&y, zp + 2);
                    self.emit_store_expr_u16(&x, zp);
                    self.emit(0x20); // JSR
                    let patch = self.code.len();
                    self.emit16(0x0000);
                    self.plot_xor_patches.push(patch);
                }
            }
            Stmt::Paint(x_expr, y_expr) => {
                // Flood fill from (x, y) — uses plot ZP block + separate paint ZP + stack
                if let Some(zp) = self.plot_zp {
                    let x = x_expr.clone();
                    let y = y_expr.clone();
                    // ZP layout reuses plot_zp+0=X_lo, zp+1=X_hi, zp+2=Y
                    self.emit_store_expr_u8(&y, zp + 2);
                    self.emit_store_expr_u16(&x, zp);
                    self.emit(0x20); // JSR paint_helper
                    let patch = self.code.len();
                    self.emit16(0x0000);
                    self.paint_patches.push(patch);
                }
            }
            Stmt::Rect(x1e, y1e, x2e, y2e)
            | Stmt::RectErase(x1e, y1e, x2e, y2e)
            | Stmt::RectXor(x1e, y1e, x2e, y2e) => {
                if let Some(zp) = self.rect_zp {
                    let x1 = x1e.clone(); let y1 = y1e.clone();
                    let x2 = x2e.clone(); let y2 = y2e.clone();
                    // Fill rect_zp: x1_lo,x1_hi,y1, x2_lo,x2_hi,y2
                    self.emit_store_expr_u16(&x1, zp + 0);
                    self.emit_store_expr_u8(&y1, zp + 2);
                    self.emit_store_expr_u16(&x2, zp + 3);
                    self.emit_store_expr_u8(&y2, zp + 5);
                    self.emit(0x20); // JSR rect_helper
                    let patch = self.code.len();
                    self.emit16(0x0000);
                    match stmt {
                        Stmt::RectErase(..) => self.rect_erase_patches.push(patch),
                        Stmt::RectXor(..)   => self.rect_xor_patches.push(patch),
                        _                   => self.rect_patches.push(patch),
                    }
                }
            }
            Stmt::Plot4(x_expr, y_expr) => {
                // Set a 4×4 block pixel — helper uses safe fixed high-ZP scratch.
                if self.plot4_zp.is_some() {
                    let x = x_expr.clone();
                    let y = y_expr.clone();
                    self.eval_expr(&x);
                    self.emit(0x48); // PHA (save x)
                    self.eval_expr(&y);
                    self.emit(0xAA); // TAX (X = y)
                    self.emit(0x68); // PLA (restore x)
                    self.emit(0xA8); // TAY (Y = x)
                    self.emit(0x20); // JSR plot4_helper
                    let patch = self.code.len();
                    self.emit16(0x0000);
                    self.plot4_patches.push(patch);
                }
            }
            Stmt::Plot4Erase(x_expr, y_expr) => {
                // Clear a 4×4 block pixel — helper uses safe fixed high-ZP scratch.
                if self.plot4_zp.is_some() {
                    let x = x_expr.clone();
                    let y = y_expr.clone();
                    self.eval_expr(&x);
                    self.emit(0x48); // PHA (save x)
                    self.eval_expr(&y);
                    self.emit(0xAA); // TAX (X = y)
                    self.emit(0x68); // PLA (restore x)
                    self.emit(0xA8); // TAY (Y = x)
                    self.emit(0x20); // JSR plot4_erase_helper
                    let patch = self.code.len();
                    self.emit16(0x0000);
                    self.plot4_erase_patches.push(patch);
                }
            }
            Stmt::SpriteDef { id, bytes } => {
                let id = *id;
                // After JMP (3 bytes), find the next 64-byte-aligned address.
                let after_jmp = self.current_addr() + 3;
                let data_addr = ((after_jmp as u32 + 63) / 64 * 64) as u16;
                let padding = (data_addr - after_jmp) as usize;
                let page = (data_addr >> 6) as u8;
                let ptr_reg = 0x07F8u16 + id as u16;

                // JMP past data block (patched below)
                self.emit(0x4C);
                let jmp_lo = self.code.len();
                self.emit16(0x0000);

                // Zero-padding to reach 64-byte boundary
                for _ in 0..padding {
                    self.emit(0x00);
                }

                // 63 bytes of sprite data (zero-padded if fewer supplied)
                let mut data = bytes.clone();
                data.resize(63, 0);
                for b in &data {
                    self.emit(*b);
                }
                self.emit(0x00); // 1 filler byte — completes the 64-byte block

                // Patch JMP to instruction immediately after the data block
                let past_data = self.current_addr();
                self.patch_abs(jmp_lo, past_data);

                // Runtime: register sprite data pointer → $07F8+id
                self.emit(0xA9);
                self.emit(page); // LDA #page
                self.emit(0x8D);
                self.emit(ptr_reg as u8);
                self.emit((ptr_reg >> 8) as u8); // STA
            }
            Stmt::Reu {
                op,
                c64_addr,
                reu_bank,
                reu_addr,
                length,
            } => {
                // $DF02/$DF03 = C64 address, $DF04/$DF05 = REU offset,
                // $DF06 = bank, $DF07/$DF08 = length, $DF01 = command (execute).
                let c64_addr = c64_addr.clone();
                let reu_bank = reu_bank.clone();
                let reu_addr = reu_addr.clone();
                let length = length.clone();
                let op = op.clone();
                self.emit_addr_to_reu_reg(&c64_addr, 0xDF02, 0xDF03);
                self.emit_addr_to_reu_reg(&reu_addr, 0xDF04, 0xDF05);
                self.eval_expr(&reu_bank);
                self.emit(0x8D);
                self.emit16(0xDF06); // STA $DF06 — REU bank
                self.emit_addr_to_reu_reg(&length, 0xDF07, 0xDF08);
                let cmd: u8 = match op {
                    ReuOp::Stash => 0xB0, // execute + stash (C64→REU)
                    ReuOp::Fetch => 0xB1, // execute + fetch (REU→C64)
                    ReuOp::Swap => 0xB2,  // execute + swap
                };
                self.emit(0xA9);
                self.emit(cmd); // LDA #cmd
                self.emit(0x8D);
                self.emit16(0xDF01); // STA $DF01 — trigger DMA
            }
            // ── inc var / dec var ──────────────────────────────────────────────
            Stmt::Inc(name) => {
                self.mark_used(name);
                let name = name.clone();
                if let Some(zp) = self.var_addr(&name) {
                    if matches!(self.var_types.get(name.as_str()), Some(VarType::Word)) {
                        // 16-bit: INC lo; BNE skip; INC hi; skip:
                        self.emit(0xE6);
                        self.emit(zp); // INC lo
                        self.emit(0xD0);
                        self.emit(0x02); // BNE skip (+2)
                        self.emit(0xE6);
                        self.emit(zp + 1); // INC hi
                    // skip: (falls through)
                    } else {
                        self.emit(0xE6);
                        self.emit(zp); // INC zp
                    }
                }
            }
            Stmt::Dec(name) => {
                self.mark_used(name);
                let name = name.clone();
                if let Some(zp) = self.var_addr(&name) {
                    if matches!(self.var_types.get(name.as_str()), Some(VarType::Word)) {
                        // 16-bit: LDA lo; BNE skip; DEC hi; skip: DEC lo
                        self.emit(0xA5);
                        self.emit(zp); // LDA lo
                        self.emit(0xD0);
                        self.emit(0x02); // BNE skip (+2)
                        self.emit(0xC6);
                        self.emit(zp + 1); // DEC hi
                        // skip:
                        self.emit(0xC6);
                        self.emit(zp); // DEC lo
                    } else {
                        self.emit(0xC6);
                        self.emit(zp); // DEC zp
                    }
                }
            }
            // ── screen col, row, char [, color] ───────────────────────────────
            // Directly poke a character (and optionally color) into screen RAM.
            // screen addr = $0400 + row*40 + col;  color addr = $D800 + row*40 + col
            Stmt::Screen {
                col,
                row,
                char_expr,
                color_expr,
            } => {
                let col = col.clone();
                let row = row.clone();
                let char_expr = char_expr.clone();
                let color_expr = color_expr.clone();
                match (&col, &row) {
                    (Expr::Number(c), Expr::Number(r))
                        if *r >= 0 && *r <= 24 && *c >= 0 && *c <= 39 =>
                    {
                        // Compile-time: compute absolute addresses directly
                        let offset = (*r as u16) * 40 + (*c as u16);
                        let screen_addr = 0x0400u16 + offset;
                        let color_addr = 0xD800u16 + offset;
                        self.eval_expr(&char_expr);
                        self.emit(0x8D);
                        self.emit(screen_addr as u8);
                        self.emit((screen_addr >> 8) as u8);
                        if let Some(col_expr) = &color_expr {
                            let col_expr = col_expr.clone();
                            self.eval_expr(&col_expr);
                            self.emit(0x8D);
                            self.emit(color_addr as u8);
                            self.emit((color_addr >> 8) as u8);
                        }
                    }
                    _ => {
                        // Runtime: compute row*40 + col + $0400 as 16-bit pointer
                        let tmp_row = self.tmp_zp;
                        self.tmp_zp += 1;
                        let tmp10 = self.tmp_zp;
                        self.tmp_zp += 1;
                        let ptr_lo = self.tmp_zp;
                        self.tmp_zp += 1;
                        let ptr_hi = self.tmp_zp;
                        self.tmp_zp += 1;
                        let tmp_char = self.tmp_zp;
                        self.tmp_zp += 1;

                        // Evaluate and save character first
                        self.eval_expr(&char_expr);
                        self.emit(0x85);
                        self.emit(tmp_char); // STA tmp_char

                        // Evaluate row → tmp_row
                        self.eval_expr(&row);
                        self.emit(0x85);
                        self.emit(tmp_row); // STA tmp_row

                        // row*10 = row*2 + row*8 (fits in u8 for row 0-24)
                        self.emit(0xA5);
                        self.emit(tmp_row); // LDA tmp_row
                        self.emit(0x0A); // ASL A (×2)
                        self.emit(0x85);
                        self.emit(tmp10); // STA tmp10 = row*2
                        self.emit(0x0A); // ASL A (×4)
                        self.emit(0x0A); // ASL A (×8)
                        self.emit(0x18); // CLC
                        self.emit(0x65);
                        self.emit(tmp10); // ADC tmp10 → row*10
                        self.emit(0x85);
                        self.emit(tmp10); // STA tmp10

                        // row*40 = row*10 * 4, tracking carry into ptr_hi
                        self.emit(0xA9);
                        self.emit(0x00);
                        self.emit(0x85);
                        self.emit(ptr_hi); // ptr_hi = 0
                        self.emit(0xA5);
                        self.emit(tmp10); // LDA tmp10
                        self.emit(0x0A); // ASL A → row*20, carry
                        self.emit(0x26);
                        self.emit(ptr_hi); // ROL ptr_hi
                        self.emit(0x0A); // ASL A → row*40 lo, carry
                        self.emit(0x26);
                        self.emit(ptr_hi); // ROL ptr_hi
                        self.emit(0x85);
                        self.emit(ptr_lo); // STA ptr_lo = row*40 lo

                        // Add col; carry propagates into ptr_hi + $04
                        self.eval_expr(&col);
                        self.emit(0x18); // CLC
                        self.emit(0x65);
                        self.emit(ptr_lo); // ADC ptr_lo
                        self.emit(0x85);
                        self.emit(ptr_lo); // STA ptr_lo
                        // ptr_hi = row*40_hi + carry_from_col + $04
                        self.emit(0xA5);
                        self.emit(ptr_hi); // LDA ptr_hi
                        self.emit(0x69);
                        self.emit(0x04); // ADC #$04 (carry still live)
                        self.emit(0x85);
                        self.emit(ptr_hi); // STA ptr_hi

                        // STA (ptr_lo), Y with Y=0
                        self.emit(0xA5);
                        self.emit(tmp_char); // LDA tmp_char
                        self.emit(0xA0);
                        self.emit(0x00); // LDY #0
                        self.emit(0x91);
                        self.emit(ptr_lo); // STA (ptr_lo), Y

                        // Color (if present): ptr_hi += $D4 (maps $04xx → $D8xx)

                        if let Some(col_expr) = &color_expr {
                            let col_expr = col_expr.clone();
                            self.eval_expr(&col_expr);
                            self.emit(0x85);
                            self.emit(tmp_char); // reuse for color value
                            self.emit(0xA5);
                            self.emit(ptr_hi);
                            self.emit(0x18); // CLC
                            self.emit(0x69);
                            self.emit(0xD4); // ADC #$D4
                            self.emit(0x85);
                            self.emit(ptr_hi);
                            self.emit(0xA5);
                            self.emit(tmp_char); // LDA color value
                            self.emit(0xA0);
                            self.emit(0x00); // LDY #0
                            self.emit(0x91);
                            self.emit(ptr_lo); // STA (ptr_lo), Y
                        }
                    }
                }
            }
            Stmt::ColorScreen { col, row, color } => {
                // color screen col, row, c — write color byte to $D800 + row*40 + col
                let col = col.clone();
                let row = row.clone();
                let color = color.clone();
                match (&col, &row) {
                    (Expr::Number(c), Expr::Number(r))
                        if *r >= 0 && *r <= 24 && *c >= 0 && *c <= 39 =>
                    {
                        // Compile-time: direct absolute STA to color RAM
                        let offset = (*r as u16) * 40 + (*c as u16);
                        let color_addr = 0xD800u16 + offset;
                        self.eval_expr(&color);
                        self.emit(0x8D);
                        self.emit(color_addr as u8);
                        self.emit((color_addr >> 8) as u8);
                    }
                    _ => {
                        // Runtime: compute row*40 + col, add $D800 base
                        let tmp_row = self.tmp_zp;
                        self.tmp_zp += 1;
                        let tmp10 = self.tmp_zp;
                        self.tmp_zp += 1;
                        let ptr_lo = self.tmp_zp;
                        self.tmp_zp += 1;
                        let ptr_hi = self.tmp_zp;
                        self.tmp_zp += 1;
                        // row → tmp_row
                        self.eval_expr(&row);
                        self.emit(0x85);
                        self.emit(tmp_row);
                        // row*10 = row*2 + row*8
                        self.emit(0xA5);
                        self.emit(tmp_row);
                        self.emit(0x0A); // ASL ×2
                        self.emit(0x85);
                        self.emit(tmp10);
                        self.emit(0x0A); // ×4
                        self.emit(0x0A); // ×8
                        self.emit(0x18);
                        self.emit(0x65);
                        self.emit(tmp10); // ADC tmp10 → ×10
                        self.emit(0x85);
                        self.emit(tmp10);
                        // row*40 with carry → ptr_hi
                        self.emit(0xA9);
                        self.emit(0x00);
                        self.emit(0x85);
                        self.emit(ptr_hi);
                        self.emit(0xA5);
                        self.emit(tmp10);
                        self.emit(0x0A); // ASL ×20, carry
                        self.emit(0x26);
                        self.emit(ptr_hi); // ROL ptr_hi
                        self.emit(0x0A); // ASL ×40 lo, carry
                        self.emit(0x26);
                        self.emit(ptr_hi); // ROL ptr_hi
                        self.emit(0x85);
                        self.emit(ptr_lo);
                        // Add col, carry → ptr_hi
                        self.eval_expr(&col);
                        self.emit(0x18);
                        self.emit(0x65);
                        self.emit(ptr_lo);
                        self.emit(0x85);
                        self.emit(ptr_lo);
                        self.emit(0xA5);
                        self.emit(ptr_hi);
                        self.emit(0x69);
                        self.emit(0xD8); // ADC #$D8 (carry still live, adds base $D8xx)
                        self.emit(0x85);
                        self.emit(ptr_hi);
                        // STA (ptr_lo), Y  with color value
                        self.eval_expr(&color);
                        self.emit(0xA0);
                        self.emit(0x00); // LDY #0
                        self.emit(0x91);
                        self.emit(ptr_lo); // STA (ptr_lo), Y
                    }
                }
            }
            Stmt::Poke(addr, val) => {
                let val = val.clone();
                let addr = addr.clone();
                self.eval_expr(&val);
                let tmp_val = self.tmp_zp;
                self.tmp_zp += 1;
                self.emit(0x85);
                self.emit(tmp_val); // STA tmp_val
                if let Expr::Number(n) = &addr {
                    // Constant address: direct STA abs
                    self.emit(0xA5);
                    self.emit(tmp_val); // LDA tmp_val
                    self.emit(0x8D);
                    self.emit(*n as u8);
                    self.emit((n >> 8) as u8);
                } else if let Expr::Var(ref vname) = addr {
                    if matches!(self.var_types.get(vname), Some(VarType::Word)) {
                        // Word var already holds 16-bit address in ZP pair → STA (zp),Y
                        if let Some(zp) = self.var_addr(vname) {
                            self.emit(0xA0);
                            self.emit(0x00); // LDY #0
                            self.emit(0xA5);
                            self.emit(tmp_val); // LDA tmp_val
                            self.emit(0x91);
                            self.emit(zp); // STA (zp),Y
                        }
                    } else {
                        // 8-bit var used as lo-byte address (rare but valid)
                        let ptr = self.tmp_zp;
                        self.tmp_zp += 2;
                        self.eval_expr(&addr);
                        self.emit(0x85);
                        self.emit(ptr);
                        self.emit(0xA9);
                        self.emit(0x00);
                        self.emit(0x85);
                        self.emit(ptr + 1);
                        self.emit(0xA8);
                        self.emit(0xA5);
                        self.emit(tmp_val);
                        self.emit(0x91);
                        self.emit(ptr);
                    }
                } else {
                    // General expression address: compute then indirect
                    let ptr = self.tmp_zp;
                    self.tmp_zp += 2;
                    self.eval_expr(&addr);
                    self.emit(0x85);
                    self.emit(ptr); // STA ptr_lo
                    self.emit(0xA9);
                    self.emit(0x00); // LDA #0
                    self.emit(0x85);
                    self.emit(ptr + 1); // STA ptr_hi
                    self.emit(0xA8); // TAY (Y=0)
                    self.emit(0xA5);
                    self.emit(tmp_val); // LDA tmp_val
                    self.emit(0x91);
                    self.emit(ptr); // STA (ptr),Y
                }
            }
            // ── open channel, device, secondary [, "filename"] ───────────────────
            // KERNAL: SETNAM ($FFBD) → SETLFS ($FFBA) → OPEN ($FFC0)
            Stmt::Open {
                channel,
                device,
                secondary,
                filename,
            } => {
                let channel = channel.clone();
                let device = device.clone();
                let secondary = secondary.clone();
                let filename = filename.clone();

                if let Some(ref fname) = filename {
                    // Embed filename inline, JMP over it
                    self.emit(0x4C);
                    let jmp_pos = self.code.len();
                    self.emit16(0x0000);
                    let name_addr = self.current_addr();
                    for c in fname.chars() {
                        self.emit(ascii_to_petscii(c, false));
                    }
                    self.patch_abs(jmp_pos, self.current_addr());
                    // SETNAM: A=len, X=lo, Y=hi
                    self.emit(0xA9);
                    self.emit(fname.len() as u8);
                    self.emit(0xA2);
                    self.emit(name_addr as u8);
                    self.emit(0xA0);
                    self.emit((name_addr >> 8) as u8);
                } else {
                    // SETNAM with empty name
                    self.emit(0xA9);
                    self.emit(0x00);
                    self.emit(0xA2);
                    self.emit(0x00);
                    self.emit(0xA0);
                    self.emit(0x00);
                }
                self.emit(0x20);
                self.emit16(0xFFBD); // JSR $FFBD (SETNAM)

                // SETLFS: A=logical#, X=device#, Y=secondary#
                let tmp_dev = self.tmp_zp;
                self.tmp_zp += 1;
                let tmp_sec = self.tmp_zp;
                self.tmp_zp += 1;
                self.eval_expr(&device);
                self.emit(0x85);
                self.emit(tmp_dev); // STA tmp_dev
                self.eval_expr(&secondary);
                self.emit(0x85);
                self.emit(tmp_sec); // STA tmp_sec
                self.eval_expr(&channel); // A = logical#
                self.emit(0xA6);
                self.emit(tmp_dev); // LDX device
                self.emit(0xA4);
                self.emit(tmp_sec); // LDY secondary
                self.emit(0x20);
                self.emit16(0xFFBA); // JSR $FFBA (SETLFS)

                self.emit(0x20);
                self.emit16(0xFFC0); // JSR $FFC0 (OPEN)
            }
            // ── close channel ────────────────────────────────────────────────────
            // KERNAL: CLOSE ($FFC3) with A = logical file number
            Stmt::Close(channel) => {
                let channel = channel.clone();
                self.eval_expr(&channel); // A = logical#
                self.emit(0x20);
                self.emit16(0xFFC3); // JSR $FFC3 (CLOSE)
            }
            // ── print# channel, args... ──────────────────────────────────────────
            // CHKOUT ($FFC9) redirects output; each arg is printed via CHROUT;
            // CLRCHN ($FFCC) restores default output.
            Stmt::PrintHash { channel, args } => {
                let channel = channel.clone();
                let args = args.clone();
                self.eval_expr(&channel); // A = logical#
                self.emit(0xAA); // TAX  (CHKOUT takes channel in X)
                self.emit(0x20);
                self.emit16(0xFFC9); // JSR $FFC9 (CHKOUT)
                // Print each argument via CHROUT (same as regular print)
                for arg in &args {
                    self.print_single_arg(arg);
                }
                // Newline (CR = $0D)
                self.emit(0xA9);
                self.emit(0x0D);
                self.emit(0x20);
                self.emit16(CHROUT); // JSR $FFD2
                self.emit(0x20);
                self.emit16(0xFFCC); // JSR $FFCC (CLRCHN)
            }
            // ── poke16 addr, val ─────────────────────────────────────────────────
            // Write 16-bit value (lo then hi) to two consecutive bytes.
            Stmt::Poke16(addr, val) => {
                let addr = addr.clone();
                let val = val.clone();
                // Evaluate the 16-bit value into (val_lo, val_hi) ZP scratch
                let val_lo = self.tmp_zp;
                self.tmp_zp += 1;
                let val_hi = self.tmp_zp;
                self.tmp_zp += 1;
                match &val {
                    Expr::Number(n) => {
                        let n = *n;
                        self.emit(0xA9);
                        self.emit(n as u8); // LDA #lo
                        self.emit(0x85);
                        self.emit(val_lo);
                        self.emit(0xA9);
                        self.emit((n >> 8) as u8); // LDA #hi
                        self.emit(0x85);
                        self.emit(val_hi);
                    }
                    Expr::Var(vname)
                        if matches!(self.var_types.get(vname.as_str()), Some(VarType::Word)) =>
                    {
                        if let Some(src_zp) = self.var_addr(vname) {
                            self.emit(0xA5);
                            self.emit(src_zp); // LDA lo
                            self.emit(0x85);
                            self.emit(val_lo);
                            self.emit(0xA5);
                            self.emit(src_zp + 1); // LDA hi
                            self.emit(0x85);
                            self.emit(val_hi);
                        }
                    }
                    _ => {
                        self.eval_expr(&val);
                        self.emit(0x85);
                        self.emit(val_lo);
                        self.emit(0xA9);
                        self.emit(0x00);
                        self.emit(0x85);
                        self.emit(val_hi);
                    }
                }
                // Write lo byte to addr, hi byte to addr+1
                match &addr {
                    Expr::Number(n) => {
                        let a = *n as u16;
                        self.emit(0xA5);
                        self.emit(val_lo);
                        self.emit(0x8D);
                        self.emit(a as u8);
                        self.emit((a >> 8) as u8);
                        let a1 = a.wrapping_add(1);
                        self.emit(0xA5);
                        self.emit(val_hi);
                        self.emit(0x8D);
                        self.emit(a1 as u8);
                        self.emit((a1 >> 8) as u8);
                    }
                    Expr::Var(vname)
                        if matches!(self.var_types.get(vname.as_str()), Some(VarType::Word)) =>
                    {
                        if let Some(ptr_zp) = self.var_addr(vname) {
                            self.emit(0xA0);
                            self.emit(0x00); // LDY #0
                            self.emit(0xA5);
                            self.emit(val_lo);
                            self.emit(0x91);
                            self.emit(ptr_zp); // STA (ptr),Y → lo
                            self.emit(0xA0);
                            self.emit(0x01); // LDY #1
                            self.emit(0xA5);
                            self.emit(val_hi);
                            self.emit(0x91);
                            self.emit(ptr_zp); // STA (ptr),Y → hi
                        }
                    }
                    _ => {
                        let ptr = self.tmp_zp;
                        self.tmp_zp += 2;
                        self.eval_expr(&addr);
                        self.emit(0x85);
                        self.emit(ptr);
                        self.emit(0xA9);
                        self.emit(0x00);
                        self.emit(0x85);
                        self.emit(ptr + 1);
                        self.emit(0xA0);
                        self.emit(0x00); // LDY #0
                        self.emit(0xA5);
                        self.emit(val_lo);
                        self.emit(0x91);
                        self.emit(ptr); // STA (ptr),Y → lo
                        self.emit(0xA0);
                        self.emit(0x01); // LDY #1
                        self.emit(0xA5);
                        self.emit(val_hi);
                        self.emit(0x91);
                        self.emit(ptr); // STA (ptr),Y → hi
                    }
                }
            }
        }
    }

    fn patch_forward_refs(&mut self) {
        for (offset, name, _) in self.sub_patches.clone() {
            if let Some(&addr) = self.subs.get(&name) {
                self.code[offset] = addr as u8;
                self.code[offset + 1] = (addr >> 8) as u8;
            }
        }
        for (offset, name, _) in self.goto_patches.clone() {
            if let Some(&addr) = self.labels.get(&name) {
                self.code[offset] = addr as u8;
                self.code[offset + 1] = (addr >> 8) as u8;
            }
        }
        for (offset, name, _) in self.gosub_patches.clone() {
            if let Some(&addr) = self.labels.get(&name) {
                self.code[offset] = addr as u8;
                self.code[offset + 1] = (addr >> 8) as u8;
            }
        }
        for (lo_pos, hi_pos, name) in self.irq_patches.clone() {
            if let Some(&addr) = self.subs.get(&name) {
                self.code[lo_pos] = addr as u8;
                self.code[hi_pos] = (addr >> 8) as u8;
            }
        }
        for (lo_pos, hi_pos, name) in self.nmi_patches.clone() {
            if let Some(&addr) = self.subs.get(&name) {
                self.code[lo_pos] = addr as u8;
                self.code[hi_pos] = (addr >> 8) as u8;
            }
        }
        for (lo_pos, hi_pos, name, _src_line) in self.onerr_patches.clone() {
            if let Some(&addr) = self.labels.get(&name) {
                self.code[lo_pos] = addr as u8;
                self.code[hi_pos] = (addr >> 8) as u8;
            }
        }
    }

    /// Returns raw machine code bytes (no PRG header).
    /// Two-pass: main code first, subroutines after.
    /// This prevents sub bodies from executing as inline code at startup.
    pub fn compile(&mut self, stmts: &[Stmt]) -> Vec<u8> {
        // Pre-scan: allocate ZP for sub params, register arrays, data pointer
        self.pre_scan(stmts);

        // Real C64 environments may leave the decimal flag set. The generated
        // arithmetic assumes binary ADC/SBC semantics, so normalize once at
        // program entry.
        self.emit(0xD8); // CLD

        // Initialise the bitmap draw base to the default single-buffer layout:
        // bitmap $2000 (hi=$20), video matrix $0400 (hi=$04). `graphics on double`
        // and `flip` overwrite these to redirect drawing to the hidden back buffer.
        if let Some(base) = self.db_base_zp {
            self.emit(0xA9);
            self.emit(0x20); // LDA #$20
            self.emit(0x85);
            self.emit(base); // STA db_base
        }
        if let Some(mtx) = self.db_mtx_zp {
            self.emit(0xA9);
            self.emit(0x04); // LDA #$04
            self.emit(0x85);
            self.emit(mtx); // STA db_mtx
        }

        // Emit data pointer init (forward-patched later when data block address is known)
        if let Some(zp) = self.data_zp {
            self.emit(0xA9);
            self.data_ptr_lo_patch = Some(self.code.len());
            self.emit(0x00); // lo placeholder
            self.emit(0x85);
            self.emit(zp); // STA data_ptr_lo
            self.emit(0xA9);
            self.data_ptr_hi_patch = Some(self.code.len());
            self.emit(0x00); // hi placeholder
            self.emit(0x85);
            self.emit(zp + 1); // STA data_ptr_hi
        }

        // Pass 1: everything except SubDef
        for stmt in stmts {
            if !matches!(stmt, Stmt::SubDef(..) | Stmt::FnDef(..)) {
                self.tmp_zp = TMP_BASE; // reset scratch ZP per statement (same as gen_stmts)
                self.gen_stmt(stmt);
            }
        }
        self.emit(0x60); // RTS — end of main program

        // Pass 2: subroutine definitions (after main, so they aren't executed at startup)
        for stmt in stmts {
            if matches!(stmt, Stmt::SubDef(..) | Stmt::FnDef(..)) {
                self.tmp_zp = TMP_BASE; // reset scratch ZP per statement
                self.gen_stmt(stmt);
            }
        }

        // Emit plot helper subroutine (once) — needed for direct plot AND for line command
        let mut plot_helper_addr: Option<u16> = None;
        if !self.plot_patches.is_empty() || !self.line_patches.is_empty() {
            let addr = self.current_addr();
            plot_helper_addr = Some(addr);
            self.emit_plot_helper();
            for &pos in &self.plot_patches.clone() {
                self.code[pos] = addr as u8;
                self.code[pos + 1] = (addr >> 8) as u8;
            }
        }

        // Emit drawline-set (Bresenham) helper — calls plot-set helper
        if !self.line_patches.is_empty() {
            if let Some(plot_addr) = plot_helper_addr {
                let dl_addr = self.current_addr();
                self.emit_drawline_helper(plot_addr);
                for &pos in &self.line_patches.clone() {
                    self.code[pos] = dl_addr as u8;
                    self.code[pos + 1] = (dl_addr >> 8) as u8;
                }
            }
        }

        // Emit midpoint circle helper — uses the plot helper for visible pixels only.
        if !self.circle_patches.is_empty() {
            if let Some(plot_addr) = plot_helper_addr {
                let circle_addr = self.current_addr();
                self.emit_circle_helper(plot_addr);
                for &pos in &self.circle_patches.clone() {
                    self.code[pos] = circle_addr as u8;
                    self.code[pos + 1] = (circle_addr >> 8) as u8;
                }
            }
        }

        // Emit plot-erase helper (clear pixel, AND ~mask) — also used by rect erase and line erase
        let mut plot_erase_helper_addr: Option<u16> = None;
        if !self.plot_erase_patches.is_empty() || !self.rect_erase_patches.is_empty()
            || !self.line_erase_patches.is_empty() {
            let addr = self.current_addr();
            self.emit_plot_erase_helper();
            plot_erase_helper_addr = Some(addr);
            for &pos in &self.plot_erase_patches.clone() {
                self.code[pos] = addr as u8;
                self.code[pos + 1] = (addr >> 8) as u8;
            }
        }

        // Emit plot-xor helper (XOR pixel, EOR mask) — also used by rect xor and line xor
        let mut plot_xor_helper_addr: Option<u16> = None;
        if !self.plot_xor_patches.is_empty() || !self.rect_xor_patches.is_empty()
            || !self.line_xor_patches.is_empty() {
            let addr = self.current_addr();
            self.emit_plot_xor_helper();
            plot_xor_helper_addr = Some(addr);
            for &pos in &self.plot_xor_patches.clone() {
                self.code[pos] = addr as u8;
                self.code[pos + 1] = (addr >> 8) as u8;
            }
        }

        // Emit drawline-erase helper — calls plot-erase helper
        if !self.line_erase_patches.is_empty() {
            if let Some(erase_addr) = plot_erase_helper_addr {
                let dl_addr = self.current_addr();
                self.emit_drawline_helper(erase_addr);
                for &pos in &self.line_erase_patches.clone() {
                    self.code[pos] = dl_addr as u8;
                    self.code[pos + 1] = (dl_addr >> 8) as u8;
                }
            }
        }

        // Emit drawline-xor helper — calls plot-xor helper
        if !self.line_xor_patches.is_empty() {
            if let Some(xor_addr) = plot_xor_helper_addr {
                let dl_addr = self.current_addr();
                self.emit_drawline_helper(xor_addr);
                for &pos in &self.line_xor_patches.clone() {
                    self.code[pos] = dl_addr as u8;
                    self.code[pos + 1] = (dl_addr >> 8) as u8;
                }
            }
        }

        // Emit plot4 set-pixel helper and patch all JSR targets. circle4 also uses it.
        let mut plot4_helper_addr: Option<u16> = None;
        if !self.plot4_patches.is_empty() || !self.circle4_patches.is_empty() {
            let addr = self.current_addr();
            self.emit_plot4_helper();
            for &pos in &self.plot4_patches.clone() {
                self.code[pos] = addr as u8;
                self.code[pos + 1] = (addr >> 8) as u8;
            }
            plot4_helper_addr = Some(addr);
        }

        // Emit circle4 helper after plot4 helper and patch all JSR targets.
        if !self.circle4_patches.is_empty() {
            if let Some(plot4_addr) = plot4_helper_addr {
                let addr = self.current_addr();
                self.emit_circle4_helper(plot4_addr);
                for &pos in &self.circle4_patches.clone() {
                    self.code[pos] = addr as u8;
                    self.code[pos + 1] = (addr >> 8) as u8;
                }
            }
        }

        // Emit plot4 clear-pixel helper and patch all JSR targets
        if !self.plot4_erase_patches.is_empty() {
            let addr = self.current_addr();
            self.emit_plot4_erase_helper();
            for &pos in &self.plot4_erase_patches.clone() {
                self.code[pos] = addr as u8;
                self.code[pos + 1] = (addr >> 8) as u8;
            }
        }

        // Emit paint flood-fill helper — depends on plot_helper already being emitted.
        if !self.paint_patches.is_empty() {
            if let Some(plot_addr) = plot_helper_addr {
                let paint_addr = self.current_addr();
                self.emit_paint_helper(plot_addr);
                for &pos in &self.paint_patches.clone() {
                    self.code[pos] = paint_addr as u8;
                    self.code[pos + 1] = (paint_addr >> 8) as u8;
                }
            }
        }

        // Emit rect helpers (set, erase, xor) — each instance calls its respective plot routine.
        if !self.rect_patches.is_empty() {
            if let Some(plot_addr) = plot_helper_addr {
                let addr = self.current_addr();
                self.emit_rect_helper(plot_addr);
                for &pos in &self.rect_patches.clone() {
                    self.code[pos] = addr as u8;
                    self.code[pos + 1] = (addr >> 8) as u8;
                }
            }
        }
        if !self.rect_erase_patches.is_empty() {
            if let Some(erase_addr) = plot_erase_helper_addr {
                let addr = self.current_addr();
                self.emit_rect_helper(erase_addr);
                for &pos in &self.rect_erase_patches.clone() {
                    self.code[pos] = addr as u8;
                    self.code[pos + 1] = (addr >> 8) as u8;
                }
            }
        }
        if !self.rect_xor_patches.is_empty() {
            if let Some(xor_addr) = plot_xor_helper_addr {
                let addr = self.current_addr();
                self.emit_rect_helper(xor_addr);
                for &pos in &self.rect_xor_patches.clone() {
                    self.code[pos] = addr as u8;
                    self.code[pos + 1] = (addr >> 8) as u8;
                }
            }
        }

        // Emit data block and patch init code
        if !self.data_bytes.is_empty() {
            let data_addr = self.current_addr();
            if let Some(pos) = self.data_ptr_lo_patch {
                self.code[pos] = data_addr as u8;
            }
            if let Some(pos) = self.data_ptr_hi_patch {
                self.code[pos] = (data_addr >> 8) as u8;
            }
            for &b in &self.data_bytes.clone() {
                self.emit(b);
            }
        }

        // Emit sin/cos lookup table and patch all LDA abs,X references
        if !self.sin_table_patches.is_empty() {
            let table_addr = self.current_addr();
            self.sin_table_addr = Some(table_addr);
            for b in Self::sin_table() {
                self.emit(b);
            }
            for &pos in &self.sin_table_patches.clone() {
                self.code[pos] = table_addr as u8;
                self.code[pos + 1] = (table_addr >> 8) as u8;
            }
        }

        // Emit print_hex helper and patch all JSR targets
        if !self.hex_helper_patches.is_empty() {
            let hex_addr = self.emit_print_hex_helper();
            for &pos in &self.hex_helper_patches.clone() {
                self.code[pos] = hex_addr as u8;
                self.code[pos + 1] = (hex_addr >> 8) as u8;
            }
        }

        // Emit print_bin helper and patch all JSR targets
        if !self.bin_helper_patches.is_empty() {
            let bin_addr = self.emit_print_bin_helper();
            for &pos in &self.bin_helper_patches.clone() {
                self.code[pos] = bin_addr as u8;
                self.code[pos + 1] = (bin_addr >> 8) as u8;
            }
        }

        // Emit multicolor pixel (mplot) helper and patch all JSR targets
        if !self.mplot_patches.is_empty() {
            let mplot_addr = self.current_addr();
            self.emit_mplot_helper();
            for &pos in &self.mplot_patches.clone() {
                self.code[pos] = mplot_addr as u8;
                self.code[pos + 1] = (mplot_addr >> 8) as u8;
            }
        }

        // Emit str$() helper and patch all JSR targets
        if !self.strn_helper_patches.is_empty() {
            let helper_addr = self.emit_strn_helper();
            for &pos in &self.strn_helper_patches.clone() {
                self.code[pos] = helper_addr as u8;
                self.code[pos + 1] = (helper_addr >> 8) as u8;
            }
        }

        // Emit 1351 mouse read helper and patch all JSR targets
        if !self.mouse_patches.is_empty() {
            let mouse_addr = self.current_addr();
            self.emit_mouse_read_helper();
            for &pos in &self.mouse_patches.clone() {
                self.code[pos] = mouse_addr as u8;
                self.code[pos + 1] = (mouse_addr >> 8) as u8;
            }
        }

        // Emit CIA1 music play-wrapper (LDA #$01; STA $DC0D; JSR sid_play; JMP $EA81)
        // Emitted once; all `music play` setup sequences are patched to point here.
        if !self.music_wrap_patches.is_empty() {
            let wrap_addr = self.current_addr();
            let play_addr = self.sid_play_addr.unwrap_or(0);
            self.emit(0xA9);
            self.emit(0x01); // LDA #$01
            self.emit(0x8D);
            self.emit(0x0D);
            self.emit(0xDC); // STA $DC0D — ACK timer A
            self.emit(0x20);
            self.emit(play_addr as u8);
            self.emit((play_addr >> 8) as u8); // JSR sid_play
            self.emit(0x4C);
            self.emit(0x81);
            self.emit(0xEA); // JMP $EA81 — irq_exit
            for (lo_pos, hi_pos) in &self.music_wrap_patches.clone() {
                self.code[*lo_pos] = wrap_addr as u8;
                self.code[*hi_pos] = (wrap_addr >> 8) as u8;
            }
        }

        self.patch_forward_refs();

        // Embed SID music data at its native C64 load address.
        // Pad the code segment with zeros to reach the target address, then
        // append the raw music bytes.  This must happen AFTER all helpers and
        // data blocks so we don't accidentally overwrite generated code.
        if let Some(sid) = self.sid.take() {
            let code_end = self.load_addr + self.code.len() as u16;
            if sid.load_addr < code_end {
                eprintln!(
                    "load sid: SID load address ${:04X} overlaps generated code ending at ${:04X}; SID data NOT embedded",
                    sid.load_addr, code_end
                );
            } else {
                let pad = (sid.load_addr - code_end) as usize;
                for _ in 0..pad {
                    self.emit(0x00);
                }
                for &b in &sid.data {
                    self.emit(b);
                }
            }
        }

        self.code.clone()
    }

    pub fn errors(&self) -> Vec<String> {
        let mut errs = vec![];
        for (_, name, src_line) in &self.sub_patches {
            if !self.subs.contains_key(name) {
                errs.push(format!("line {src_line}: Undefined subroutine: {name}"));
            }
        }
        for (_, name, src_line) in &self.goto_patches {
            if !self.labels.contains_key(name) {
                errs.push(format!("line {src_line}: Undefined label: {name}"));
            }
        }
        for (_, name, src_line) in &self.gosub_patches {
            if !self.labels.contains_key(name) {
                errs.push(format!("line {src_line}: Undefined label: {name}"));
            }
        }
        for (_, _, name, src_line) in &self.onerr_patches {
            if !self.labels.contains_key(name) {
                errs.push(format!(
                    "line {src_line}: onerr goto: Undefined label: {name}"
                ));
            }
        }
        errs
    }

    pub fn memory_map(&self) -> MemoryMap {
        let mut variables: Vec<VarEntry> = self
            .vars
            .iter()
            .map(|(name, &zp_addr)| {
                let type_str = match self.var_types.get(name) {
                    Some(VarType::Word) => "word",
                    Some(VarType::Float) => "float",
                    Some(VarType::Str) => "string",
                    Some(VarType::Array) => "array",
                    Some(VarType::WordArray) => "word_array",
                    _ => "int",
                }
                .to_string();

                VarEntry {
                    name: name.clone(),
                    zp_addr,
                    type_str,
                }
            })
            .collect();
        variables.sort_by_key(|v| v.zp_addr);

        let mut subroutines: Vec<SubEntry> = self
            .subs
            .iter()
            .map(|(name, &addr)| SubEntry {
                name: name.clone(),
                addr,
            })
            .collect();
        subroutines.sort_by_key(|s| s.addr);

        let mut labels: Vec<crate::compiler::LabelEntry> = self
            .labels
            .iter()
            .map(|(name, &addr)| crate::compiler::LabelEntry { name: name.clone(), addr })
            .collect();
        labels.sort_by_key(|label| label.addr);

        let mut arrays: Vec<ArrayEntry> = self
            .arrays
            .iter()
            .map(|(name, &base_addr)| ArrayEntry {
                name: name.clone(),
                base_addr,
                size: self.array_sizes.get(name).copied().unwrap_or(0),
            })
            .collect();
        arrays.sort_by_key(|a| a.base_addr);

        MemoryMap {
            load_addr: self.load_addr,
            code_size: self.code.len(),
            variables,
            subroutines,
            labels,
            arrays,
            plot_zp: self.plot_zp,
            line_zp: self.line_zp,
            rect_zp: self.rect_zp,
            sin_table_addr: self.sin_table_addr,
            data_zp: self.data_zp,
            code_bytes: self.code.clone(),
            unused_vars: self
                .vars
                .keys()
                .filter(|name| !self.used_vars.contains(*name))
                .cloned()
                .collect(),
        }
    }
}

/// Convert an approximate MHz value to the U64 Turbo Control speed index (bits 0-3 of $D031).
/// Available speeds: 1,2,3,4,5,6,8,10,12,14,16,20,24,32,40,48 MHz (indices 0-15).
/// Values are rounded down to the nearest available speed; ≥48 gives index 15 (max).
fn mhz_to_speed_index(mhz: i32) -> u8 {
    const SPEEDS: [i32; 16] = [1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48];
    let idx = SPEEDS.partition_point(|&s| s <= mhz);
    (if idx == 0 { 0 } else { idx - 1 }).min(15) as u8
}

fn ascii_to_petscii(c: char, lowercase_mode: bool) -> u8 {
    // PETSCII charset mode behaviour:
    // Uppercase mode (default): $41-$5A = uppercase A-Z on screen; $61-$7A = graphics
    // Lowercase mode (CHR$(14)): $41-$5A = lowercase a-z on screen; $61-$7A = uppercase A-Z on screen
    //
    // To make "Hello World" in source display as "Hello World" in lowercase mode we swap cases:
    //   source 'H' (uppercase) → emit $68 ($61+'H'-'A') → displays as 'H' in lowercase mode
    //   source 'e' (lowercase) → emit $45 ($41+'e'-'a') → displays as 'e' in lowercase mode
    match c {
        'A'..='Z' => {
            if lowercase_mode {
                c as u8 + 0x20
            } else {
                c as u8
            }
        }
        'a'..='z' => {
            if lowercase_mode {
                c as u8 - 0x20
            } else {
                c as u8
            }
        }
        '0'..='9' => c as u8,
        ' ' => 0x20,
        '!' => 0x21,
        '"' => 0x22,
        '#' => 0x23,
        '$' => 0x24,
        '%' => 0x25,
        '&' => 0x26,
        '\'' => 0x27,
        '(' => 0x28,
        ')' => 0x29,
        '*' => 0x2A,
        '+' => 0x2B,
        ',' => 0x2C,
        '-' => 0x2D,
        '.' => 0x2E,
        '/' => 0x2F,
        ':' => 0x3A,
        ';' => 0x3B,
        '<' => 0x3C,
        '=' => 0x3D,
        '>' => 0x3E,
        '?' => 0x3F,
        '@' => 0x40,
        _ => 0x3F, // '?' for unknown
    }
}
