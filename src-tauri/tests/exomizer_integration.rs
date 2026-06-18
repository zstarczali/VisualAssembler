// Integration test for the exomizer compression + depacker workflow.
//
// What this verifies end-to-end:
//   1. exomizer mem-mode compresses samples/multi-color.bin with our chosen flags.
//   2. Output PRG has the expected $C000 load-address header.
//   3. The depacker (samples/exo-decrunch.bin) executed on the compressed stream
//      correctly reproduces the original 10000-byte bitmap at $2000-$472F.
//
// The 6502 execution is done with the `emulator_6502` crate. We give the depacker
// a 64K flat RAM, push a sentinel return address ($FFFD) on the stack, and run
// until PC reaches that sentinel (which means the top-level RTS fired).

use emulator_6502::{Interface6502, MOS6502};
use std::path::PathBuf;
use std::process::Command;

const DEPACKER_LOAD: u16 = 0xB000;
const COMPRESSED_LOAD: u16 = 0xC000;
const DECOMPRESS_TARGET: u16 = 0x2000;
const SENTINEL_PC: u16 = 0xFFFE; // RTS pulls $FFFD, increments → $FFFE

struct FlatRam(Box<[u8; 65536]>);

impl FlatRam {
    fn new() -> Self {
        FlatRam(Box::new([0u8; 65536]))
    }
    fn load_at(&mut self, addr: u16, data: &[u8]) {
        let end = addr as usize + data.len();
        assert!(end <= 65536, "load_at: data overflows 64K at {:04X}", addr);
        self.0[addr as usize..end].copy_from_slice(data);
    }
}

impl Interface6502 for FlatRam {
    fn read(&mut self, address: u16) -> u8 {
        self.0[address as usize]
    }
    fn write(&mut self, address: u16, data: u8) {
        self.0[address as usize] = data;
    }
}

fn project_root() -> PathBuf {
    // tests run with CWD = src-tauri/, so go one level up
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("project parent")
        .to_path_buf()
}

fn exomizer_path() -> Option<PathBuf> {
    // Read from the user's config so the test runs without env vars on this machine.
    let cfg_path = std::env::var("APPDATA")
        .ok()
        .map(|a| PathBuf::from(a).join("hu.zstarczali.c64visualassembler").join("config.json"))?;
    let raw = std::fs::read_to_string(&cfg_path).ok()?;
    let v: serde_json::Value = serde_json::from_str(&raw).ok()?;
    let p = v.get("exomizerPath")?.as_str()?.to_string();
    let pb = PathBuf::from(p);
    if pb.exists() { Some(pb) } else { None }
}

/// Compresses with exomizer mem mode. `user_target_hex` is the FINAL destination
/// (where the user wants the decompressed bytes). We add +2 internally to
/// compensate for exomizer's default safety_offset of 2 — same logic as the
/// Rust crunch_with_exomizer in lib.rs.
fn compress_with_exomizer(input: &PathBuf, load_hex: &str, user_target_hex: &str) -> Result<Vec<u8>, String> {
    let exo = exomizer_path()
        .ok_or_else(|| "exomizer not configured (skip test)".to_string())?;
    let tmp_dir = std::env::temp_dir().join("va-test-exomizer");
    std::fs::create_dir_all(&tmp_dir).map_err(|e| e.to_string())?;
    let out_path = tmp_dir.join("out.exo");
    let user_target = u32::from_str_radix(user_target_hex.trim_start_matches('$'), 16)
        .map_err(|e| format!("bad target hex: {}", e))?;
    let adjusted_target = user_target.saturating_add(2);
    let infile = format!("{},${:04X}", input.to_str().unwrap(), adjusted_target);
    let load_arg = format!("${}", load_hex);

    let status = Command::new(&exo)
        .args(&[
            "mem",
            "-l", &load_arg,
            "-q",
            "-o", out_path.to_str().unwrap(),
            &infile,
        ])
        .status()
        .map_err(|e| format!("spawn exomizer: {}", e))?;
    if !status.success() {
        return Err(format!("exomizer exit code {:?}", status.code()));
    }
    std::fs::read(&out_path).map_err(|e| e.to_string())
}

fn run_depacker(
    depacker_bytes: &[u8],
    compressed_bytes: &[u8],
    depacker_load: u16,
    compressed_load: u16,
) -> FlatRam {
    let mut ram = FlatRam::new();

    // Place depacker at its load address (raw binary, no PRG header).
    ram.load_at(depacker_load, depacker_bytes);

    // The compressed output is a PRG (2-byte load address header). KERNAL LOAD
    // would strip that header and place the payload at compressed_load. We
    // simulate that: skip the first 2 bytes of `compressed_bytes`.
    let header_lo = compressed_bytes[0] as u16;
    let header_hi = compressed_bytes[1] as u16;
    let prg_load = header_lo | (header_hi << 8);
    assert_eq!(
        prg_load, compressed_load,
        "PRG header load address mismatch: got ${:04X}, want ${:04X}",
        prg_load, compressed_load
    );
    let payload = &compressed_bytes[2..];
    ram.load_at(compressed_load, payload);
    let crunched_end = compressed_load as usize + payload.len();
    assert!(crunched_end <= 65536, "payload overflows 64K");

    // KERNAL sets $AE/$AF to end-of-load. Simulate that, so the EXODECRUNCH
    // macro's `LDA $AE / STA $04 / LDA $AF / STA $05` path would work — but we
    // bypass the macro and set $04/$05 directly to the same value.
    ram.0[0x00AE] = (crunched_end & 0xFF) as u8;
    ram.0[0x00AF] = ((crunched_end >> 8) & 0xFF) as u8;
    ram.0[0x0004] = ram.0[0x00AE];
    ram.0[0x0005] = ram.0[0x00AF];
    eprintln!("[setup] crunched at ${:04X}-${:04X}, end ptr=${:04X}",
        compressed_load, crunched_end - 1, crunched_end);

    // Push sentinel return address on the stack. RTS pulls lo then hi and
    // adds 1, so push (SENTINEL_PC - 1) high then low.
    let ret = SENTINEL_PC.wrapping_sub(1);
    let ret_hi = (ret >> 8) as u8;
    let ret_lo = (ret & 0xFF) as u8;
    // Stack grows down from $01FF. SP starts at $FF.
    ram.0[0x01FF] = ret_hi;
    ram.0[0x01FE] = ret_lo;

    let mut cpu = MOS6502::new();
    cpu.set_program_counter(depacker_load);
    // Manually align SP to $FD (we pushed 2 bytes onto $FF/$FE).
    // The crate doesn't expose set_stack_pointer directly; we work around by
    // executing a fake stack-prime sequence: RTS in reset would also be ok.
    // Instead, write the bytes to $01FE/$01FF and use the crate's reset to set
    // SP to FD via a fake routine. Simpler: just JSR to depacker_load from
    // an inert "JSR / JMP $FFFE" trampoline placed at a known address.
    // We do that by setting PC = trampoline.
    const TRAMP: u16 = 0x0200;
    ram.0[TRAMP as usize] = 0x20; // JSR
    ram.0[TRAMP as usize + 1] = (depacker_load & 0xFF) as u8;
    ram.0[TRAMP as usize + 2] = (depacker_load >> 8) as u8;
    ram.0[TRAMP as usize + 3] = 0x4C; // JMP $FFFE
    ram.0[TRAMP as usize + 4] = (SENTINEL_PC & 0xFF) as u8;
    ram.0[TRAMP as usize + 5] = (SENTINEL_PC >> 8) as u8;
    cpu.set_program_counter(TRAMP);

    // Run until PC reaches sentinel (or a step budget is exhausted).
    let mut steps = 0usize;
    let max_steps = 10_000_000usize;
    while cpu.get_program_counter() != SENTINEL_PC {
        cpu.execute_instruction(&mut ram);
        steps += 1;
        if steps > max_steps {
            panic!("depacker did not return after {} instructions (PC=${:04X})", steps, cpu.get_program_counter());
        }
    }
    eprintln!("[depacker] completed in {} instructions", steps);
    ram
}

#[test]
fn multi_color_compress_and_decrunch_roundtrip() {
    let root = project_root();
    let mc_path = root.join("samples").join("multi-color.bin");
    let depacker_path = root.join("samples").join("exo-decrunch.bin");

    let original = std::fs::read(&mc_path).expect("read multi-color.bin");
    assert_eq!(original.len(), 10000, "multi-color.bin must be 10000 bytes");

    let depacker = std::fs::read(&depacker_path).expect("read exo-decrunch.bin");
    assert!(depacker.len() > 200 && depacker.len() < 600, "depacker size sanity");

    // Pass the user-facing target ($2000). The helper adds +2 for safety_offset.
    let compressed = match compress_with_exomizer(&mc_path, "C000", "2000") {
        Ok(b) => b,
        Err(e) if e.contains("not configured") => {
            eprintln!("[skip] {}", e);
            return;
        }
        Err(e) => panic!("exomizer compression failed: {}", e),
    };
    assert!(compressed.len() > 4, "compressed output too small");
    assert_eq!(compressed[0], 0x00, "PRG header lo");
    assert_eq!(compressed[1], 0xC0, "PRG header hi");
    eprintln!("[exo] compressed {} → {} bytes", original.len(), compressed.len() - 2);

    let ram = run_depacker(&depacker, &compressed, DEPACKER_LOAD, COMPRESSED_LOAD);

    let start = DECOMPRESS_TARGET as usize;
    let end = start + original.len();
    // Diagnostic: print 16 bytes around $2000 to see if data spills before/after.
    eprintln!(
        "[mem] $1FF8-$2017: {}",
        (0x1FF8usize..0x2018usize).map(|a| format!("{:02X}", ram.0[a])).collect::<Vec<_>>().join(" ")
    );
    eprintln!(
        "[mem] $472A-$4731: {}",
        (0x472Ausize..0x4732usize).map(|a| format!("{:02X}", ram.0[a])).collect::<Vec<_>>().join(" ")
    );
    let decompressed = &ram.0[start..end];

    // Compare. Print first diverging offset and a context window if mismatch.
    if decompressed != &original[..] {
        let mut first_diff = None;
        for i in 0..original.len() {
            if decompressed[i] != original[i] {
                first_diff = Some(i);
                break;
            }
        }
        if let Some(i) = first_diff {
            let lo = i.saturating_sub(8);
            let hi = (i + 8).min(original.len());
            let fmt = |slice: &[u8]| -> String {
                slice.iter().map(|b| format!("{:02X}", b)).collect::<Vec<_>>().join(" ")
            };
            eprintln!("[diff] window offset {}-{}:", lo, hi - 1);
            eprintln!("  original    : {}", fmt(&original[lo..hi]));
            eprintln!("  decompressed: {}", fmt(&decompressed[lo..hi]));
            // also dump first 16 bytes of each so we can spot an alignment shift
            eprintln!("  orig[0..16] : {}", fmt(&original[0..16]));
            eprintln!("  decomp[0..16]: {}", fmt(&decompressed[0..16]));
            panic!(
                "decompressed mismatch at offset {} (${:04X}): got ${:02X}, want ${:02X}",
                i,
                DECOMPRESS_TARGET as usize + i,
                decompressed[i],
                original[i]
            );
        }
    }
    eprintln!("[ok] decompressed {} bytes match original", original.len());
}

#[test]
fn depacker_binary_has_known_size() {
    let depacker = std::fs::read(project_root().join("samples").join("exo-decrunch.bin"))
        .expect("read exo-decrunch.bin");
    // Loose bounds — exact size depends on whether INC $D020 border-flash is in.
    assert!(
        depacker.len() >= 460 && depacker.len() <= 520,
        "depacker size out of expected range: {} bytes",
        depacker.len()
    );
    // First instruction must be `LDA $04` (backward-mode src-end load), opcode A5 04.
    assert_eq!(depacker[0], 0xA5, "depacker entry opcode mismatch (expect LDA zp = A5)");
    assert_eq!(depacker[1], 0x04, "depacker entry operand mismatch (expect $04)");
}
