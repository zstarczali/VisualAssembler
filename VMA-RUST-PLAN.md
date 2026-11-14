# VMA fordító Rustban — állapot

A Visual Assembler egyetlen fordítója a Rust VMA (Visual Macro Assembler). A port lezárult: a JS fordító
(layout, `compileBlock`, `assembleProgramToPrg`, `buildAutostartPrgForEmulator`, a `#vma-engine` motorválasztó és
a `shadow` mód) törölve. WASM nincs (döntés: csak az asztali app fordít), Tauri nélkül nincs fordítás
(`vmaNeedsDesktop`).

---

## 1. Hol van

- **Repó:** https://github.com/zstarczali/VMA (publikus, GPLv3), helyben a VA mellett (`../VMA`).
  Nyelvi és makró-kézikönyv: `docs/VMA-Manual.md` + `.hu.md` ott.
- **Függőség:** `src-tauri/Cargo.toml` → `vma = { git = "…/VMA.git", rev = "<sha>" }`, jelenleg VMA 2.3.0 = `7a7d7ff`.
  VMA-módosítás után: commit + push a VMA-ban, majd itt a `rev` cseréje + `cargo update -p vma`.
- **Együttes fejlesztés:** ideiglenesen `[patch."https://github.com/zstarczali/VMA.git"] vma = { path = "../../VMA" }`
  (nem commitolandó).
- **Verzió az About-ban:** `get_vma_version` (`build.rs` a `Cargo.lock`-ból).

## 2. Bekötés a VA-ban

| Fázis | Hol |
|-------|-----|
| Forrás | `_vmaBuildInput` / `_vmaEditorInput`: Expert szöveg, vagy a blokkok `_blockToExpertSourceLine` szövege (`_vmaBlocksSource`: `blockOfLine`, `lineMap`); projektnél a `.define` / `.const` előtag (`_projVmaPrelude`, `_vmaWithPrelude`) |
| Fordítás | `_vmaAnalyze` → Tauri `vma_analyze` (PRG, listing, címkék, szegmensek, memória, sidecarok) → `_vmaNormalize`; Kick extra kimenetek: `vma_build` `raw`-val |
| Build | `_kickOrVaPrg` → `_kickBuildPrg` / `_vaBuildPrg` → `_vmaRustBuild` |
| Élő nézetek | `_vmaLiveFor` / `_vmaLiveNow` (gyorsítótár) + `_vmaLayout` (disasm, monitor, memória, ciklus-gutter, peephole, ASM nézet) |
| Debugger / VICE Monitor | `_vmaDebuggerTargets` (címkék, töréspontok), `_vmBuildSegments` (hot reload a `segments`-ből, újraindítás az `entry`-n) |
| Hibák | Rust `Msg { key, params }` a JS fordítókulcsaival → `_vmaErrorMessage` / `_vmaErrorEntry`; új kulcs mind a 7 nyelven kell |

A fájlokat (INCBIN, KOALA, SID, LEVEL, INCLUDE) a Rust olvassa az app keresési sorrendjével: alapmappa →
working folder → `samples/`, idegen gép útjánál fájlnév-fallback (`push_bare_name_fallbacks`).

## 3. Nyelvi szabályok, amelyeket tesztek rögzítenek

`tests/vma-language.test.js` (a golden korpusz csak azt rögzíti, hogy egy eset hibás-e):

- `'A'` karakter-literál = ASCII / PETSCII kód operandusban, `.byte`-ban és `.print_char`-ban;
- vegyes `.byte` / `.word` listában minden elem a saját számrendszerében (`.byte 3, %11` → `03 03`);
- `~` (bitenkénti NOT) immediate operandusban is;
- `.if NÉV` = `.define`-olt vagy nem nulla `.const`; más = konstans-kifejezés; kiértékelhetetlen → `ifConditionNotResolvable`;
- `.push` / `.pull` vesszővel vagy szóközzel elválasztva is (`A, X, Y`);
- `.const` / `.var` ≤ `$FF` → zero page címzés; abszolútra `lda.abs`.

## 4. Ismert furcsaságok (VMA 2.3.0-n ellenőrizve)

Ha valamelyiket javítani kell: a VMA repóban, utána golden-frissítés.

- `lda.zp c` → `LDA $0C`: a hexa jegyekből álló szimbólumnevet a `.zp` ág számnak veszi;
- a CHARDEF bájtjai hexák (`129` = `$129` → hiba);
- futásidejű `.if` / `.while` / `.until` nem immediate operandusa cím: a `10` hexa (`$0010`), a `%101` hiba;
- feloldatlan SPRITE_ANIM képkocka-szám hiba („must be 1-255”);
- makró törzsében másik makró hívása (`:a()`) „unknown macro” hibát ad.

## 5. Tesztek

| Fájl | Szerep |
|------|--------|
| `tests/vma-golden/cases.js` | Korpusz: minták, sablonok, opkód-mátrix (minden mnemonik × címzési mód, aliasokkal), nyelvi snippetek, minden palettamakró, makró-változatok, Kick fixture-ök |
| `tests/vma-golden/manifest.json` | A Rust kimenete: PRG + `.sym` / `.vs` / `.dbg` méret és sha256, vagy elvárt hiba (603 bejegyzés: BASIC stubbal / anélkül, Kick kimenet `@raw`) |
| `scripts/vma-golden.js` | `[szűrő]` ellenőrzés, `--update` (szándékos változás után; csak a szándékolt esetek változhatnak), `--inputs DIR` |
| `tests/vma-golden.test.js` | A manifest a CLI-vel |
| `tests/vma-build.test.js` | A VA build-útja (stubolt command vagy valódi CLI), `vmaNeedsDesktop` |
| `tests/vma-memory.test.js` | A szegmensek = a PRG bájtjai |
| `tests/vma-debug-targets.test.js` | Blokk mód: szimbólumok, töréspont-címek |
| `tests/vma-error-keys.test.js` | Minden Rust-hibakulcs mind a 7 nyelven |
| `tests/vma-language.test.js` | A 3. szakasz szabályai |
| `tests/helpers/vma-cli.js` | `compileText`, `codeOf`, `labelOf`, `useVmaCli(app)`, `buildApp`, `analyzeApp`, `vmaTest` |

A CLI-t a `VMA_BIN` vagy a `VMA_DIR` (alapból `../VMA`) `target/{release,debug}/vma[.exe]` adja → előbb
`cargo build --release` a VMA repóban; nélküle a fordítós tesztek kimaradnak. A CLI `--analyze FILE` = a
`vma::analyze` JSON. A VMA saját tesztje: `cargo test --offline` ott. Opkód-tábla: `node scripts/vma-gen-opcodes.js`
(a VMA repóba ír).

## 6. A port története röviden

| Fázis | Tartalom | Commit |
|-------|----------|--------|
| F0 | Golden korpusz, referencia-harness, CLI-szerződés | `1a4f86e` |
| F1 | JS-hibák javítása (karakter-literál, vegyes listák, `~`, `.if`, `.push A, X, Y`, fájl-fallback), korpusz bővítése | `8291481`, `c029369` |
| F2 | Rust mag + CLI (akkor `crates/vma`) | `c0cc68d` |
| F3 | Makrók, LOOP / FOR, `.var`, PUSH / PULL | `536986e` |
| F4 | Kódgeneráló makrók | `516d372` … |
| F5 | Fájl-makrók és közös resolver | `8fce8d3`, `7844c6e` … |
| F6 | Bekötés a VA-ba (`vma_build`, debugger, memória, hibakulcsok), majd külön repó | — |
| 2.7.8 | A JS fordító törlése, minden nézet a `vma_analyze`-ból; a golden a Rust snapshotja (egyetlen PRG sem változott) | — |
