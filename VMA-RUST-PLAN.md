# VMA fordító Rustban — terv

Cél: a Visual Macro Assembler (VMA) fordítója a `www/app.js` helyett egy Rust crate legyen, és a VA
(Block, Expert, Kick projekt, Build / Run / D64 / CRT / debugger) ezt használja. A kimenet bájtra
azonos marad a mai JS fordítóéval — ezt a golden korpusz (`tests/vma-golden.test.js`) igazolja.

---

## 1. Felmérés — mi van meg

### A JS VMA fordító (a portolandó rész)

Belépő: `_kickOrVaPrg` → `parseExpertText` → `reload*Blocks` (fájlok) → `parseUserMacros` →
`_buildAutostartPrgCore` → `assembleProgramToPrg` → `getProgramLayout` + `compileLineBytes`.

A belépőkből elérhető deklarációk (statikus hívásgráf): **133 függvény / tábla, ~6 900 sor**, DOM-hivatkozás
egyetlen (`basicSysToggle.checked`) — vagyis a mag tisztán leválasztható.

| Rész | Fő függvények | Sor |
|------|---------------|-----|
| Szöveg → blokkok | `parseExpertText`, `parseAsmText`, `_importMake*` (33 db), `_splitAsmLineComment`, `_kickScopeRewrite` | ~1 600 |
| Kifejezések | `_evalAsmExpr`, `_evalAsmExpression`, `_evalJsExprSafe`, `_substituteStarPc`, `resolveNumericOperand`, `resolveRelativeOperand`, `parseMacroNumber` | ~500 |
| Elrendezés | `getProgramLayout` (ORG, `.if`/define, makró-expanzió, lokális / anonim címkék), `addLayoutLabels`, `getInstructionSize` | ~900 |
| Kódgenerálás | `compileLineBytes` (minden makró bájtjai), `opcodeMap`, `_koalaShowBytes`, `_levelBuild`, `_levelRowBytes`, `_joyVarBytes`, `buildDelayHelperBytes` … | ~2 300 |
| PRG | `assembleProgramToPrg`, `getDeferredMemorySections`, `buildBasicSysStub`, `_buildRelocatingLoader`, `_buildAutostartPrgCore` | ~400 |
| Kick előfeldolgozó | `_kickPreprocess` + 40 `_kick*` (Kick forrás → VMA szöveg) | ~1 600 |

Makrók: 70 könyvtári `is*Macro` típus (+ `IF_A/WHILE_X/…` futásidejű vezérlők, `LBxx`).

### Rust oldalon már meglévő, újrahasznosítható

- Fájlfeloldás: `reload_incbin_file` / `reload_sid_file` / `reload_include_file` (`lib.rs`) — alapmappa, `samples/`, resource, working folder.
- `parse_sid_buffer` (PSID/RSID fejléc).
- Minta az integrációra: a UltimateBasic fordító már Rust crate (`ultimate-basic` git függőség), `compile_ultimate_basic` command → PRG + map + listing. A VMA ugyanezt a mintát követi.
- Exomizer, D64 (`c1541`), CRT, VICE / RetroDebugger indítás: a PRG után jönnek, változatlanok maradnak.
- CSP: a `script-src` már tartalmazza a `'wasm-unsafe-eval'`-t (WebSid miatt) → WASM build is mehet.

### Ami nincs meg

- Nincs Rust assembler. A UB `assemble_inline` (inline asm) túl kicsi alapnak, csak az opkód-tábla vehető át ötletként.
- Nincs gépi szerződés a fordító kimenetére (eddig csak a PRG számított) — ezt pótolja a golden teszt és a CLI.
- Az ACME külső program, nem része a portnak.

---

## 2. A teszt — kész (F0)

| Fájl | Szerep |
|------|--------|
| `tests/helpers/vma-reference.js` | A JS fordító mint referencia: szöveg vagy blokk-JSON → PRG, fájl-reload emulációval (a `lib.rs` feloldási sorrendje + más gépről mentett abszolút útvonalnál fájlnév-fallback) |
| `tests/vma-golden/cases.js` | Korpusz: 76 minta / sablon (`samples/*.asm|json`, ebből 56 blokk-program; `templates/*.asm`), opkód-mátrix (az `opcodeMap` minden mnemonik × címzési mód párja), 10 nyelvi snippet, 86 makró-eset (minden palettamakró alapsora, kontextussal) |
| `tests/vma-golden/manifest.json` | 173 eset × (BASIC stubbal / anélkül) = 346 bejegyzés: méret + sha256 vagy elvárt hiba |
| `tests/vma-golden/files/picture.koa` | Szintetikus Koala kép a `.koala` esethez |
| `scripts/vma-golden.js` | Manifest ellenőrzés / `--update` / `--inputs DIR` (a Rust bemenetek kiírása) |
| `scripts/vma-cli.js` | A CLI-szerződés JS-en: `vma build <in> -o <out.prg> [--base-dir D] [--search D]… [--no-basic-stub]` |
| `tests/vma-golden.test.js` | 3 teszt (lent) |

A három teszt:

1. **A JS fordító = manifest** — bármely `app.js` változás, ami a kimenetet módosítja, itt megbukik
   (szándékos változásnál `node scripts/vma-golden.js --update`).
2. **Block → Expert szöveg veszteségmentes** — minden blokk-mintát a `_blockToExpertSourceLine` szövegén
   át is lefordít; mind az 55 fordítható blokk-program bájtra azonos. **Ezért a Rust fordító bemenete
   egyedül a VMA szöveg lehet**, a blokk-modellt nem kell Rustba vinni.
3. **Rust CLI = JS** — `VMA_BIN` vagy `src-tauri/target/{release,debug}/vma[.exe]`; ha nincs, skip.
   Eltérésnél az első eltérő bájt offsetjét írja. A teszt ága a `VMA_BIN=scripts/vma-cli.js` referenciával
   ellenőrizve: 346/346 egyezik.

Futtatás:

```bash
node --test tests/vma-golden.test.js
```

```bash
VMA_BIN=src-tauri/target/release/vma.exe node --test tests/vma-golden.test.js
```

---

## 3. A korpusz által talált eltérések — döntés kell a port előtt

Ezeket **nem** pineltem a golden-be (a snippetekből kivettem), előbb el kell dönteni, mi a helyes:

| # | Jelenség | Javaslat |
|---|----------|----------|
| 1 | `.byte` vegyes listában a `%` bináris rossz: `.byte 3, %11` → `03 11`, `.byte %101, $FF` → `01 FF` (egyedül állva jó) | **Hiba** — JS-ben javítani (`_importDetectListBase` / `parseByteMacro`), majd `--update` |
| 2 | Karakter-literál: `lda #'A'` hiba, `.byte …, 'A'` → `00` | Hiba vagy hiányzó funkció — Rustban egyszerű; előbb JS-ben |
| 3 | `~` (bitenkénti NOT) nincs az operandus-kifejezésekben | Bővítés, ha kell |
| 4 | `.if` = `ifdef` (csak `.define` szimbólumot néz); `.if DEBUG == 1` mindig hamis, csendben | Szemantika marad, de **hibát/figyelmeztetést** adjon kifejezésre |
| 5 | `.const zp = $FB` → `LDA zp` abszolút (`AD FB 00`), míg a Kick előfeldolgozó érték szerint ZP-t választ | Szándékos? Ha nem, javítás + `--update` |
| 6 | `reload_incbin_file` / `reload_sid_file` idegen abszolút útnál nem esik vissza fájlnévre (az include igen) | A Rust fordító közös resolvert kap |
| 7 | `samples/region-demo.json` régi `GROUP` blokk, `samples/exo-decrunch-src.asm` önmagában nem fordul (include-modul) | Elvárt hibaként maradnak a korpuszban |

Szabály a port alatt: a Rust a JS-t követi bájtra; viselkedésváltozás **csak** úgy, hogy előbb a JS-ben
javul, a manifest frissül, és utána a Rust követi.

---

## 4. Architektúra

### Crate

`crates/vma/` (workspace tag, Tauri-függés nélkül), a `src-tauri` path-függőségként húzza be.

```
crates/vma/src/
  lib.rs        build(source, &BuildOptions, &dyn FileProvider) -> BuildResult
  lexer.rs      sor-tokenizálás, komment-vágás (_splitAsmLineComment)
  parse.rs      sor → Stmt (instr / direktíva / makró / címke) — parseExpertText megfelelője
  expr.rs       kifejezés-kiértékelő (_evalAsmExpr: *, <, >, lokális címke, 1/0 boolean)
  layout.rs     ORG / szegmensek, .define/.if, makró-expanzió, címketábla, méretek
  macros/       makrónként egy modul: méret + bájtok (compileLineBytes ágai)
  opcodes.rs    opcodeMap + illegális opkódok
  prg.rs        PRG összerakás, BASIC SYS stub, relocating loader, deferred szegmensek
  files.rs      FileProvider trait + közös resolver (incbin / sid / include / level / koala)
  error.rs      Diag { line, file, code: "P014", key, args } 
  bin/vma.rs    CLI (a scripts/vma-cli.js szerződése)
```

### Kimenet — nem csak a PRG

A UI 14 helyen hívja a `getProgramLayout`-ot (memóriasáv, ASM nézet, ciklus-gutter, ZP-térkép, debugger
sidecar, VICE Monitor hot reload). A `BuildResult` ezért:

```rust
pub struct BuildResult {
    pub prg: Option<Vec<u8>>,
    pub sys_address: Option<u16>,
    pub segments: Vec<Segment>,          // start, end, forrás
    pub lines: Vec<LineInfo>,            // forrássor → cím, méret, bájtok, kihagyott-e (.if)
    pub labels: Vec<Label>,              // név, érték, lokális scope
    pub diagnostics: Vec<Diag>,          // hibák + figyelmeztetések kóddal
}
```

A hibaszövegek fordítása a JS-ben marad: a Rust i18n-kulcsot + paramétereket ad (`P014` +
`tf(key, args)`), így a 7 nyelvű `translations` változatlan.

### Bekötés

- **Fázis A — natív:** Tauri command `vma_build(source, base_dir, options)`; a Build / Run / D64 / CRT /
  debugger út már `async` (`buildRunPrgForCurrentMode`), ide közvetlenül beköthető.
- **Fázis B — WASM:** ugyanaz a crate `wasm32-unknown-unknown` + `wasm-bindgen` célra, a szinkron
  élő elemzésekhez (gépelés közbeni validáció, memóriasáv, ASM nézet). A CSP már engedi.
- Block mód: `program.map(_blockToExpertSourceLine)` → szöveg → Rust; a sor → blokk index a join közben
  készül, a hibák így a blokkhoz kerülnek. A bináris blokkmezők (`incBinBytes`, `sidBytes`) feleslegessé
  válnak: a fájlt a Rust olvassa.
- Kick projekt: a `_kickPreprocess` (JS) kimenete VMA szöveg — első körben marad JS-ben, a Rust ezt kapja.
  Portja külön, későbbi fázis.
- Kapcsoló: `uiSettings.vmaEngine = "js" | "rust" | "shadow"`; `shadow` = mindkettő fut, eltérésnél a
  konzolba és a hibalogba (`_vaErrorLog`) ír. Alapértelmezés `js` → `shadow` (dev) → `rust`.

---

## 5. Fázisok

Minden fázis kilépési feltétele a golden teszt adott részhalmaza a Rust CLI-vel.

| Fázis | Tartalom | Kész, ha |
|-------|----------|----------|
| **F0** ✔ | Golden korpusz, referencia-harness, CLI-szerződés | `tests/vma-golden.test.js` zöld |
| **F1** | 3. szakasz döntései JS-ben; korpusz bővítése: a `tests/*.test.js` makró-tesztjeinek forrásai is legyenek golden esetek; Kick fixture (`tests/fixtures/kick-project`) előfeldolgozott szövege | manifest frissítve, nincs ismert hiba benne |
| **F2** | Crate váz, CLI, lexer / parser, kifejezések, címkék, opkódok, ORG / több szegmens, `.byte/.word/.text/.fill/.align`, PRG + BASIC stub | `gen-opcode-matrix`, `snip-*`, egyszerű minták |
| **F3** | Szerkezeti makrók: `.const/.var/.define/.if/.else`, `.macro/.endm` + `:invoke`, LOOP/NEXT, FOR/ENDF, REGION, `LBxx`, `.assert`, SMC címke, lokális `.loop` és anonim címkék | `macro-*` szerkezeti esetek + a JSON minták többsége |
| **F4** | Kódgeneráló makrók 1:1 (PRINT*, SPRITE_*, JOYSTICK, MOUSE, REU_*, TURBO, DELAY, MEMCPY/MEMSET, IRQ_SETUP, futásidejű IF/WHILE/REPEAT …) | összes `macro-*` |
| **F5** | Fájl-makrók és közös resolver: INCBIN, KOALA, SID, LEVEL, LEVEL_ROW, INCLUDE (`.json` és `.asm`), LOADFILE, EXODECRUNCH | összes minta, mind a 346 eset |
| **F6** | Tauri `vma_build` + `BuildResult` → JS adapter (`getProgramLayout`-kompatibilis objektum), `vmaEngine` kapcsoló, shadow mód | a VA Rusttal fordít; shadow módban 0 eltérés a mintákon és a felhasználói projekteken |
| **F7** | WASM build, a szinkron UI-elemzések átállítása | a JS mag (`compileLineBytes`, `getProgramLayout` …) törölhető |
| **F8** | Kick előfeldolgozó portja (opcionális), JS mag törlése, dokumentáció (`CLAUDE.md`, copilot-instructions, kézikönyv), verzióemelés | `npm test` + `cargo test` zöld |

Rust oldali tesztek: modulonkénti `cargo test`; egy `crates/vma/tests/golden.rs`, ami a
`scripts/vma-golden.js --inputs` kiírt bemeneteit és a `manifest.json` sha256-ait használja (node nélkül
is fut CI-ben); később differenciális fuzz: véletlen utasítás / kifejezés-folyamok a JS és a Rust CLI-n.

---

## 6. Kockázatok

- **Rejtett JS-szemantika** (`parseInt` lazaság, `"0900"` decimális, `base: "hex"` ALIGN, `*` PC vs
  szorzás, JS boolean → 1/0): csak a bájtos összevetés fogja meg → a korpusz bővítése (F1) a legfontosabb.
- **Hibaüzenetek**: a golden csak az ok/hiba tényt nézi, a szöveget nem; az i18n-kulcsok egyezését külön
  egységteszt figyelje.
- **Szinkron hívások**: a natív command async; a gépelés közbeni elemzések a WASM-ig (F7) a JS-en maradnak,
  ezért az F6–F7 között két fordító él — a shadow mód és a golden teszt tartja szinkronban.
- **Méret**: `compileLineBytes` (1 600 sor) a legnagyobb falat; makrónként portolva, makrónként tesztelve.
