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
| `tests/vma-golden/cases.js` | Korpusz: 76 minta / sablon (`samples/*.asm|json`, ebből 56 blokk-program; `templates/*.asm`), opkód-mátrix (az `opcodeMap` minden mnemonik × címzési mód párja), 11 nyelvi snippet, 86 makró-eset (minden palettamakró alapsora, kontextussal), 18 makró-paraméterváltozat, 11 Kick fixture a `_kickPreprocess` kimenetével |
| `tests/vma-golden/manifest.json` | 203 eset × (BASIC stubbal / anélkül) = 406 bejegyzés: méret + sha256 vagy elvárt hiba |
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

## 3. A korpusz által talált eltérések — F1-ben rendezve

| # | Jelenség | Döntés / állapot |
|---|----------|------------------|
| 1 | `.byte` / `.word` vegyes listában a `%` bináris és a decimális hexként ment: `.byte 3, %11` → `03 11`, `.byte %101, $FF` → `01 FF` | **Javítva** (`_importDetectListBase`): vegyes listában minden elem a saját értékét adja |
| 2 | Karakter-literál: `lda #'A'` hiba, `.byte …, 'A'` → `00` | **Javítva**: `'A'` = ASCII / PETSCII kód (`$41`, mint a `.text`), `_charLiteralToHex` a kifejezés-kiértékelőkben, `.byte`-ban és az operandus-ellenőrzésben |
| 3 | `~` (bitenkénti NOT) az immediate operandusban | **Javítva**: a kiértékelő tudta, csak a `buildOperandPreview` karakterosztálya tiltotta |
| 4 | `.if DEBUG == 1` csendben mindig hamis volt (csak `.define`-t nézett) | **Javítva** (`_ifConditionActive`): `.if NÉV` = `.define`-olt vagy nem nulla `.const`; más = konstans-kifejezés; kiértékelhetetlen → hiba (`ifConditionNotResolvable`, 7 nyelv) |
| 5 | `.const zp = $FB` → `LDA zp` abszolút (`AD FB 00`) | **Marad szándékosan**: a címzési módot a forrás / paletta adja, a meglévő projektek címei nem tolódhatnak el, és a Block → szöveg körút bájtazonossága is ezen múlik. ZP konstansra: `lda.zp zp` |
| 6 | `reload_incbin_file` / `reload_sid_file` (és Windows-on a `/Users/…` include) idegen gép útjánál nem esett vissza fájlnévre | **Javítva** (`push_bare_name_fallbacks`, `lib.rs`): alapmappa → working folder → `samples/`. A Rust fordító ugyanezt a resolvert kapja |
| 7 | `samples/region-demo.json` régi `GROUP` blokk, `samples/exo-decrunch-src.asm` önmagában nem fordul (include-modul) | Elvárt hibaként maradnak a korpuszban |
| 8 | `.push A, X, Y` / `.pull A, X, Y` „Unknown directive” (csak `AXY` alakot ismert) | **Javítva**: vessző / szóköz elválasztó is jó |
| 9 | `.print_char 'A'` nem oldotta fel a karakter-literált | **Javítva** (`parsePetsciiCharValue`) |
| 10 | Makró törzsében makróhívás: „Unknown macro”, pedig definiált | **Funkcióhiány**: a kibontás egyszintű. Most pontos hibát ad (`compileNestedMacro`, 7 nyelv), elvárt hibaként a korpuszban (`var-macro-nested-error`). Többszintű kibontás: a Rust portban (F3) érdemes, utána a JS-ben is |

Egységtesztek: `tests/vma-language.test.js` (a hibaágak és a Block-mód `.if` ellenőrzése), Rust `asset_path_tests`
(`bare_name_candidates`).

Szabály a port alatt: a Rust a JS-t követi bájtra; viselkedésváltozás **csak** úgy, hogy előbb a JS-ben
javul, a manifest frissül, és utána a Rust követi.

---

## 4. Architektúra

### Crate

`crates/vma/` önálló crate (Tauri-függés nélkül, egyetlen függősége a `regex`); az F6-ban a `src-tauri`
path-függőségként húzza be. Nem workspace, hogy a `src-tauri/target` útvonalak (CI, bundle) ne változzanak.

```
crates/vma/src/            (F3 állapot)
  lib.rs        build(source, &BuildOptions) -> Result<PRG, CompileError>
  parse.rs      parseExpertText + parseAsmText sorrendje: sor → Block { kind, line }; Mode, Base;
                _importMakeInstruction címzési szabályai, _importDetectListBase, _kickTextBytes,
                _kickScopeRewrite; a még nem portolt direktíva → Kind::Unsupported (pontos hiba)
  expr.rs       a JS szöveg-átírási lánc ($hex → 0x, <címke → lo(), nevek → értékek, Word / Dotted
                azonosító-szabály) + _evalJsExprSafe JS-számszemantikával (f64, ToInt32)
  num.rs        parseInt, parseNumberByBase, parseAddressValue, _importParseScalar, ToUint8
  asm.rs        getProgramLayout (makrókibontás: parseUserMacros, paraméterek, lokális címkék),
                _scopeLocalLabels, .var ZP-kiosztás, .define / .if, addLayoutLabels, a const-tábla
                (resolveProgramConstValue, a JS-ben helyben frissülő constValue-val), compileLineBytes,
                resolveNumericOperand / resolveRelativeOperand, buildOperandPreview hibaszabályai
  opcodes.rs    generált: scripts/vma-gen-opcodes.js az élő opcodeMap-ből (256 bejegyzés)
  prg.rs        _buildAutostartPrgCore, BASIC SYS stub, beágyazott SYS, _sourceEntryHint,
                _buildRelocatingLoader
  bin/vma.rs    CLI: vma build <in> -o <out.prg> [--base-dir D] [--search D]… [--no-basic-stub]
```

Később: `files.rs` (FileProvider + közös resolver, F5), makró-modulok (F3–F4), `BuildResult` (F6).

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
| **F1** ✔ | 3. szakasz javításai JS-ben és Rustban; korpusz bővítve: 18 makró-paraméterváltozat (`var-*`) és a 11 Kick fixture előfeldolgozott szövege (`kick-*`); 203 eset × 2 = 406 bejegyzés, 400 PRG | `npm test` (558) + `cargo test` zöld, manifestben nincs ismert hiba |
| **F2** ✔ | Crate váz, CLI, parser, kifejezések, címkék (lokális, anonim, SMC), opkódok, ORG / több szegmens, `.byte/.word/.text "…"/.fill/.align/.const/.define/.if/.assert`, `LBxx`, PRG + BASIC stub + relocating loader | 408-ból 136 eset bájtra egyezik (opkód-mátrix, a snippetek, egyszerű minták, mind a 11 Kick fixture), 272 egy még nem portolt direktívánál áll meg, **0 eltérés** |
| **F3** ✔ | Szerkezeti makrók: `.macro/.endm` (Kick `{ }` is), `:név()` / `.invoke` / `.call` / csupasz `név()` és nagybetűs „utasítás” makró, paraméter-helyettesítés (`{p}` és csupasz név, JS `$&`-szabályokkal), újraelemzés a display operandusból (címzési mód váltás), lokális címkék hívásonként egyedi utótaggal, definíció-helyi szubrutin (paraméter nélküli makró), egyszintű kibontás + `compileNestedMacro`, LOOP/NEXT, FOR/ENDF, `.var` ZP-kiosztás, PUSH/PULL, `.end` | 420-ból 188 eset egyezik (+6 célzott makró-snippet), 232 még nem portolt direktívánál áll, **0 eltérés**. Hátra (F4/F5): az include-olt fájlok makrói, a deferred-címes makrók „buffer” paraméterei |
| **F4** | Kódgeneráló makrók 1:1 (PRINT*, SPRITE_*, JOYSTICK, MOUSE, REU_*, TURBO, DELAY, MEMCPY/MEMSET, IRQ_SETUP, futásidejű IF/WHILE/REPEAT …) | összes `macro-*` |
| **F5** | Fájl-makrók és közös resolver: INCBIN, KOALA, SID, LEVEL, LEVEL_ROW, INCLUDE (`.json` és `.asm`), LOADFILE, EXODECRUNCH | összes minta, mind a 346 eset |
| **F6** | Tauri `vma_build` + `BuildResult` → JS adapter (`getProgramLayout`-kompatibilis objektum), `vmaEngine` kapcsoló, shadow mód | a VA Rusttal fordít; shadow módban 0 eltérés a mintákon és a felhasználói projekteken |
| **F7** | WASM build, a szinkron UI-elemzések átállítása | a JS mag (`compileLineBytes`, `getProgramLayout` …) törölhető |
| **F8** | Kick előfeldolgozó portja (opcionális), JS mag törlése, dokumentáció (`CLAUDE.md`, copilot-instructions, kézikönyv), verzióemelés | `npm test` + `cargo test` zöld |

Állás esetenként: `node scripts/vma-rust-report.js [szűrő]` (match / diff / error / unsupported, és melyik
direktíva hiányzik a legtöbbször). A golden teszt Rust-ága a port alatt a „még nem portolt” eseteket csak
számolja; minden más esetnek egyeznie kell, így a félkész port is regresszióvédett.

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
