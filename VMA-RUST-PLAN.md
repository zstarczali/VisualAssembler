# VMA fordító Rustban — terv

Cél: a Visual Macro Assembler (VMA) fordítója a `www/app.js` helyett egy Rust crate legyen, és a VA
(Block, Expert, Kick projekt, Build / Run / D64 / CRT / debugger) ezt használja. A kimenet bájtra
azonos marad a mai JS fordítóéval — ezt a golden korpusz (`tests/vma-golden.test.js`) igazolja.

---

## 0. Hol tartunk (2026-11-10): a JS fordító kikerült

A VA egyetlen fordítója a Rust VMA. A JS fordító (layout, `compileBlock`, `assembleProgramToPrg`,
`buildAutostartPrgForEmulator`, a `#vma-engine` motorválasztó) törölve; minden build és élő nézet
(disasm, monitor, memória, ciklus-gutter, peephole, ASM nézet, VICE Monitor, debugger) a `vma_analyze`
Tauri command eredményéből dolgozik (`_vmaAnalyze`, `_vmaLiveFor`, `_vmaLayout`). Tauri nélkül nincs
fordítás (`vmaNeedsDesktop`). WASM nincs (a felhasználó döntése: csak az asztali app fordít).

- VMA: új CLI kapcsoló `--analyze FILE` (a `vma::analyze` JSON, hibánál is); pontos lokális címkék
  abszolút operandusban (`jmp Second.lp`, `lda .lp+1,x`), teszt `local_labels_as_absolute_operands`.
- Golden: a `manifest.json` a Rust kimenete (PRG + `.sym` / `.vs` / `.dbg` hash), `node scripts/vma-golden.js
  [--update | szűrő]`; a régi JS manifesthez képest egyetlen PRG sem változott.
- Tesztek: `tests/helpers/vma-cli.js` (a CLI-n át); törölve: `tests/helpers/vma-reference.js`, `vma-rust.js`,
  `scripts/vma-cli.js`, `vma-shadow-scan.js`, `vma-rust-report.js`, `tests/vma-engine.test.js`
  (→ `tests/vma-build.test.js`), `tests/vma-debug-files.test.js` (a manifest fedi).

Az alábbi állapot- és teendőlista a port történetét őrzi.

## 0a. Korábbi állás (2026-10-26)

| Fázis | Állapot | Commit |
|-------|---------|--------|
| F0 golden korpusz, referencia-harness, CLI-szerződés | ✔ kész | `1a4f86e` |
| F1 JS-hibák javítása, korpusz bővítése | ✔ kész | `8291481`, `c029369` |
| F2 Rust mag + CLI (`crates/vma`) | ✔ kész | `c0cc68d` |
| F3 makrók, LOOP/FOR, `.var`, PUSH/PULL | ✔ kész | `536986e` |
| F4 kódgeneráló makrók | ✔ kész (a SID_PLAYER kódja az F5-tel jön) | `516d372` … |
| F5 fájl-makrók | ✔ kész | `8fce8d3`, `7844c6e`, … |
| **F6 bekötés a VA-ba (Tauri `vma_build`, shadow mód)** | **folyamatban** — A fázis (PRG) kész: `vma_build`, motorválasztó, shadow-napló; B fázisból kész: a debugger nézet (sidecarok, címkék, töréspontok), a memórianézet (shadow-ellenőrzés), a VICE Monitor hot reload és a lokalizált hibák Rustból; shadow-próba a projekteken kész (`scripts/vma-shadow-scan.js`), a Kick projekt is a VMA motoron; az alapérték egyelőre `js` marad (a felhasználó választ) (az ASM nézet gépelés közben szinkron, az F7-re vár) | — |
| F7 WASM, a szinkron UI-elemzések | hátra | — |
| F8 Kick előfeldolgozó (opcionális), JS mag törlése, dokumentáció | hátra | — |

Golden állás (`node scripts/vma-rust-report.js`): **mind a 520 eset rendben: 462 bájtra egyezik, 58 elvárt hiba
(a Rust is hibát ad), 0 nem portolt, 0 eltérés.** A Rust fordító a teljes VMA nyelvet és minden makrót fordítja.

Ellenőrzés bármikor: `npm test` (a golden Rust-ága a `crates/vma/target/{debug,release}/vma.exe`-t használja,
ha le van fordítva), `cargo test --offline` a `crates/vma`-ban, és az esetenkénti riport fent.

### Teendők sorrendben

1. **F4** — a 7. szakasz listája szerint, kisebb adagokban, minden adag után `cargo build` + riport:
   1. ✔ egyszerű, fix kódú makrók: SET_BORDER / SET_BG, CLEAR_SCREEN, WAIT_KEY, RAND, TURBO_SET / TURBO_ENABLE,
      SUPERCPU_DETECT, WAIT_RASTER, CHARSET, REU_CHECK, EXODECRUNCH, PRINT_CHAR, PRINT_HEX (`parse.rs`
      `simple_macro`, `Kind::Fixed` / `SetColor` / `WaitRaster` / `TurboSet` / `ExoDecrunch` / `PrintChar` /
      `PrintHex` / `Rand`; golden: `var-fixed-code-*`, `var-set-color-*`, `var-print-char-unknown-error`,
      `var-wait-raster-unknown`);
   2. ✔ szöveg / adat: TEXT, STRING, DATA, PRINT, PETSCII, RAWBYTES, RAWTEXT (+ deferred darabok a PRG-ben),
      CHARDEF, TABLE, a `macroLabel` címkék (`parse.rs` `data_macro`, `Kind::Text` / `Mem` (`MemOp`) / `Print` /
      `CharDef` / `Table`; `asm.rs` `encode_text` / `encode_petscii` / `stores`, a deferred darabok az `assemble`
      második menetében; golden: `var-text-data-macros`, `var-table-macro`, `var-text-in-macro`,
      `var-chardef-count-error`, `var-print-too-long-error`). Makrótörzsben a csupasz paraméter mint cím
      (auto buffer) egyelőre `MACRO_BUFFER` „nem támogatott” hiba — a 6. adag;
   3. ✔ sprite / input: SPRITE_INIT, SPRITE_POS, SPRITE_COL, SPRITE_ANIM, JOYSTICK (mindkét mód), MOUSE,
      BOX_HIT, SCORE_BCD (`parse.rs` `sprite_macro`, `asm.rs` `mouse_bytes` a belső címkékkel; golden:
      `var-sprite-input-macros` és hat hibaág-eset);
   4. ✔ vezérlés / memória: futásidejű IF / ELSE / ENDIF, WHILE / ENDW, REPEAT / UNTIL, MEMCPY, MEMSET,
      MAP_COPY, MAP_COPY16X16, REU_STASH / FETCH / SWAP, IRQ_SETUP, LOADFILE, DELAY (+ a közös helper)
      (`parse.rs` `memory_macro` és a futásidejű verem a fő ciklusban, `Kind::RtCmp` / `RtElse` / `RtEndIf` /
      `RtEndw` / `RtRepeat`; `asm.rs` `count_or_size` (`parseMacroCountOrSize`), `delay_frames`,
      `delay_helper_address` (`appendDelayHelperLabel` + `getDeferredMemorySections`), `delay_helper_bytes`;
      a címkék sorszámot kapnak a JS véletlen utótagja helyett — a bájtokra nincs hatásuk; golden:
      `var-runtime-*`, `var-memory-macros`, `var-delay-helper-*` és öt hibaág-eset);
   5. SID_PLAYER kódja (a `_sidPlayerBytes` port) — az F5 SID-részével együtt;
   6. ✔ a makrók „buffer” paraméterei (`getDeferredMacroAddressField`, `_autoBufferLabel`, a layout végi
      `autoBufferCursor`): `asm.rs` `expand` (a paraméter minden csupasz előfordulása a `__buf_…` címke),
      `Meta::auto_buffer` / `auto_buffer_address`, a `layout` végén kiosztva; golden: `var-macro-buffers`,
      `var-macro-buffer-delay`.
   Minden adaghoz célzott golden snippet / változat a `tests/vma-golden/cases.js`-be (a JS adja az elvárt
   bájtot), utána `node scripts/vma-golden.js --update` — csak új bejegyzés változhat.
2. **F5** — ✔ `FileProvider` + közös resolver (`files.rs`: `FileProvider`, `DirFiles` — a bázismappák sorban,
   utána a puszta fájlnév ugyanott —, `NoFiles`, `load_assets` = `reloadIncBinBlocks`; `build_with_files`; a CLI
   `--base-dir` (alapból a bemenet mappája) és `--search` mappái); ✔ INCBIN, KOALA (`Kind::IncBin`,
   `koala_show_bytes`, `incbin_payload`; a deferred darabok sorrendje a JS-é, a DELAY helper az INCBIN szakaszát
   is kerüli; golden: `var-incbin-*`, `var-koala-*`). ✔ SID (`files::parse_sid`, `Kind::Sid`: `SID_LOAD` / `SID_INIT` /
   `SID_PLAY` az egyedi címmel eltolva, a deferred darab a betöltési címen) + SID_PLAYER (`sid_player_bytes`);
   ✔ LEVEL / LEVEL_ROW (`level.rs`: `read_bin_meta` = `_vaReadBinWithMeta`, `level_build` = `_levelBuild` a
   címkéivel, `level_row_bytes`; a crate második függősége a `serde_json`; golden: `var-sid-*`, `var-level-*`).
   ✔ INCLUDE (`Kind::Include`, `files::include_blocks`: `.asm` / `.inc` / `.s` → `parse_expert_text`, `.json` → a
   nyers blokkmezőkből közvetlenül `Kind` (`json_block`: ORG, LABEL, BYTE, CONST, COMMENT, BLANK, MACRO / ENDM,
   utasítás — más blokkfajta `JSON_INCLUDE_BLOCK` „nem támogatott”); a layout a `getProgramLayout` szerint bont ki:
   rögzített címnél `SaveAddress` + szintetikus ORG … `RestoreAddress`, a könyvtár ORG-jai kimaradnak, a
   paraméter nélküli makró csak rögzített címnél szubrutin; az include-ok makrói a makrótáblában
   (`user_macros`); golden: `var-include-*`). ✔ Kilépés: minden eset.
3. **F6** — ✔ A fázis: a crate a `src-tauri` path-függősége; `vma_build(source, base_dir, basic_stub)` →
   `{ ok, prg, sysAddress }` / `{ ok: false, error, line }` (`vma::build_full`, `prg::Built`); a fájlokat az app saját
   keresési sorrendje adja (`AppFiles`: a `reload_*` parancsokból kiemelt `asset_candidates` /
   `include_candidates`, viselkedés változatlan). JS: Beállítások → Általános → Program `#vma-engine`
   (`c64va-vma-engine`: `js` (alapérték) / `rust`; a `shadow` mód később kikerült, a mentett érték `js`; i18n `vmaEngine*` mind a 7 nyelven); minden build-út
   a `_kickOrVaPrg` → `_vaBuildPrg`-n megy (Run / Save PRG / D64 / CRT / Exomizer / debugger), Kick projekt marad JS;
   `_vmaBuildInput` = a `buildAutostartPrgForEmulator` választása szövegként (Expert: az indítófájl vagy az editor,
   Block: `_blockToExpertSourceLine`), `_vmaRustBuild` (hiba `[Rnnn]` a sorral), (megszűnt) `shadow`: a JS eredmény ment tovább,
   a Rust is fordított, az eltérés a konzolba és a `_vaErrorLog`-ba; teszt `tests/vma-engine.test.js`
   (a valódi CLI-vel is). Valós projektek összevetése: `scripts/vma-shadow-scan.js` (az appban már nincs shadow mód); `BuildResult`
   (szegmensek, sorok, címkék — a memóriasáv, ASM nézet, debugger sidecar, VICE Monitor hot reload ebből), a
   hibák i18n-kulcsai, az alapérték átállítása `rust`-ra.
   ✔ B fázis, debugger nézet: `vma::build_result` → `BuildResult` (`built`, `origin`, `info` = a debugger-layout sorai,
   `symbols` a fájlok sorrendjében, `debug` = .sym / .vs / .dbg; `to_json` = a `vma_build` válasza: `debugOrigin`, `sidecars`,
   `symbols` `[név, cím]`, `lines` `[cím, méret, kihagyott, forrássor vagy -1]`). `vma_build(…, source_path, line_map)`;
   a CLI-n `--json` / `--source-path` / `--line-map`. A sortérkép a blokkokból írt forrás sorait a blokkok `_srcLine`-jára
   képezi (-1: nincs, -2: ugyanannak a blokknak a következő sora — a több sorra írt `.byte` egy tartomány marad). JS:
   `_vmaBuildInput` (`blocks`, `blockOfLine`, `lineMap`, `sourcePath` = a `runInDebugger` választása), `_vmaRustBuild` →
   `prg.vma`, `_vmaDebuggerTargets` (címkék, Blokk-töréspontok — a makrótörzs minden kibontása —, Expert-sorok címe),
   a `_buildDebuggerSidecarPayload` és a `runInDebugger` Rust-ága. Include-olt blokk saját sora: `Block::file_line` (`.asm`:
   a fájl sora, `.json`: a tárolt `_srcLine`), az include-olt makró kibontása az include fájlé (`Macro::files`).
   Tesztek: `tests/vma-debug-files.test.js` (szöveg), `tests/vma-debug-targets.test.js` (Blokk mód, sortérkép,
   töréspontok — a golden szöveges esetein, valódi CLI-vel), `tests/vma-engine.test.js`.
   Közben javítva: a SID_PLAYER Rust-kódja a 78 bájtos, ROM-ot kikapcsoló változatra (`94f1b8f`); a `bb83d4f` merge négy
   elavult SID_PLAYER manifest-bejegyzése; JS: az Expert töréspont nem illeszkedik include-olt sorra
   (`_breakpointAddressForSourceLines`), az include-olt makró kibontása a `.dbg`-ben az include fájlé (`_macroInclude`
   a `parseUserMacros`-ban — nem `_fromInclude`, hogy a memóriasáv / ASM nézet csoportosítása ne változzon).
   ✔ B fázis, memória és VICE Monitor: `Assembler::memory_info` (a `getMemoryUsage` `getProgramLayout()`-ja, első ORG,
   override nélkül: `code` tartomány, `regions` = a `detectMemoryOverlaps` kód-régiói, `deferred` = `deferred_sections`, a
   `getDeferredMemorySections` portja — a DELAY helper címe is ebből), `Image::written` / `segments()` = a kód-szakaszok és a
   deferred darabok egyesített tartományai a bájtjaikkal, `Built::segments` + `Built::entry` (a program saját belépője, a
   relocating loader mögött is). JSON: `segments`, `entry`, `memory` {code, regions, deferred: [{type, address, end,
   sourceAddress, label}]}. JS: `getMemoryUsage` → `_memoryUsageOf(layout, code, deferred, regions)` (a `detectMemoryOverlaps`
   helyett `_memoryCodeRegions` + `_memoryOverlaps`), a shadow móddal együtt a `_vmaMemoryUsage` / `_vmaShadowMemoryDiff` is kikerült; a `_vmBuildSegments` Rust buildnél a
   `segments`-et írja és az `entry`-n indít újra (`_vmWithProgram(fn, blocks)`). Közben javítva: a Rust `origin_of` kihagyja a
   makrótörzs ORG-ját, mint a `parseOriginValue` (golden `org-in-macro-body`). Tesztek: `tests/vma-memory.test.js` (a korpusz
   minden szöveges esetén JS `getMemoryUsage` = Rust `memory`, és a szegmensek a PRG bájtjai), `tests/vma-engine.test.js`
   (hot reload), Rust `segments_entry_and_memory_view`. A memóriapanel gépelés közben továbbra is a JS
   layoutból rajzol (szinkron) — az F7 (WASM) váltja ki.
   ✔ B fázis, hibakulcsok: `msg.rs` `Msg { key, params, text }` (`Msg::keyed(…).p(név, érték)`; a JS összetételéhez
   `_prefix` / `_suffix` / `_replace`), a `compile_line` és a segédei `Msg`-et adnak, a JS minden `t()` / `tf()` hibáját
   ugyanazzal a kulccsal (a JS-ben is nyers szöveges hibák szövegként maradnak); a parse-hibák (`unknownDirective`,
   `vmaAcmeDirective`, `kickTextBadChar`, `ifConditionNotResolvable`), a fájl nélküli makrók (`*MacroNeedsFile`) és az
   `autostartImageOverlapsStub` is. A `CompileError` `key` / `params` / `address` / `more`: az `assemble` a JS-hez hasonlóan
   minden hibás sort gyűjt (`CompileError::collect`). `vma::error_json` = a `vma_build` / CLI `--json` hibaválasza (`errors`:
   line, message, key, params, address); a CLI minden hibát külön sorba ír. JS: `_vmaErrorMessage` (tf a kulccsal, különben
   az angol szöveg), `_vmaErrorEntry` (`[Lnnn]` a blokk ASM-sorával / `[Rnnn]`, cím, `MNEM operandus` vagy a forrássor,
   `sourceLine`). Tesztek: `tests/vma-error-keys.test.js` (minden Rust-kulcs mind a 7 nyelven), `tests/vma-engine.test.js`
   (két hiba magyarul, valódi CLI-vel).
   ✔ Shadow-próba és Kick: `scripts/vma-shadow-scan.js <.proj | .asm | .json | mappa>…` (JS referencia = Rust CLI stubbal és
   anélkül; Kick projektnél a `_kickPreprocess` szövege és a `.file` / `.disk` kimenetek nyersen; a VA-mentésként JSON-ba
   csomagolt forrást kicsomagolja): a Dark Chambers C64 (51 177 bájt) és a `samples/*.proj` egyezik. A Kick projekt is a VMA
   motoron fordul (`_kickBuildPrg` → `_vaBuildPrg(kick)` → `_vmaBuildInput(kick)` = a `kick.text` az indítófájl mappájából;
   a hibák a `_kickMapResult`-tal fájl:sor; a debugger / hot reload / memória Kick projektben a JS layoutból marad).
   Projekt beállítások → VMA: `vmaDefines` / `vmaConsts` a `.proj`-ban (`_projKickFields`), `_projVmaPrelude` (`.define` /
   `.const` sorok, csak VMA projektnél, a projekt fájljain), JS: `_projVmaWithPrelude` a `getProgramLayout`-ban és a
   `resolveProgramConstValue`-ban, Rust: `_vmaWithPrelude` (a szöveg elé, sortérképpel); teszt `tests/project-vma-defines.test.js`.
   ✔ Teljesség-ellenőrzés: a Kick extra kimenetek (`.file` / `.segmentout` / `.disk` fájljai) a Rustban is (`build_raw` /
   `build_prg_raw` = `assembleProgramToPrg()`, CLI `--raw`, `vma_build(…, raw)`; JS `_kickOutputImage` → az async
   `_kickBuildOutput`), golden `kick-*-out-*@raw` esetek (527 eset, 469 PRG, mind egyezik); a `kick-project.test.js` minden
   lefordított Kick-szövegét (29) a záró teszt a Rust CLI-vel is fordítja (a teszt BASIC SYS állásával). Makrók: a golden a
   paletta minden `is*Macro` elemét és az `opcodeMap` minden párját (aliasokkal) tartalmazza. Alapérték marad `js`: a
   felhasználó választ (Beállítások → Általános → Program). Compiling ablak: `#work-progress-step` lépéssor (`setWorkStep`,
   `step*` kulcsok mind a 7 nyelven: Kick beolvasás / előfeldolgozás, VMA JS / Rust / shadow, PRG méret, ACME, UB, Exomizer,
   VICE, Ultimate, KFF2, c1541, Build project fájlonként, Kick kimenetek, debugger).
   ✔ Külön repó: a crate a `crates/vma` történetével (`git subtree split`) a `F:\Development\VMA` repóba költözött
   = `github.com/zstarczali/VMA` (publikus, GPLv3; README, LICENSE). A VA `src-tauri` git-függőségként húzza be
   (`rev = "<sha>"`, commit SHA-ra kötve, 2.3.0 óta `7a7d7ff`; frissítés: a `rev` cseréje + `cargo update -p vma`;
   helyi fejlesztéshez `[patch."https://github.com/zstarczali/VMA.git"] vma = { path = "../../VMA" }`). A VA tesztjei / szkriptjei a `VMA_DIR` (alapból
   `../VMA`) és a `VMA_BIN` alapján találják a CLI-t és a forrást (`tests/helpers/vma-rust.js` `vmaDir()`); a golden
   korpusz és a JS referencia a VA-ban marad. A JS fordító (`www/app.js`) változatlanul megmarad, az alapmotor.
   ✔ Mentés: a Ctrl+S / Menü → Save / verziókezelés forrásfájlon (`.asm` / `.s` / `.inc` / `.a` / `.a65` / `.lib`) szöveget ír
   (`_saveSourceTab`; blokk módban a `_blockToExpertSourceLine` sorai), nem a VA JSON payloadot (`tests/save-source-file.test.js`).
   ✔ Makró-javítások (JS + Rust, golden `var-macro-field-params`, `var-macro-char-literal-arg`,
   `var-macro-runtime-control-twice`, `var-set-color-in-macro`): a saját mezős könyvtári makrók (`MACRO_RELINE` /
   `Kind::reparsed_in_macro`) makrótörzsben a forrássorukból (`_macroLine` / `Block::text`) újraelemződnek a paraméterekkel
   és a lokális címkékkel — csak amíg a blokk mezői változatlanok (`_macroPrint`, `_macroLineFor`), és a blokkokból írt
   szöveg is ezt a sort adja; a futásidejű `.if` / `.while` / `.repeat` címkék hívásonként utótagot kapnak; a `'A'`
   makró-argumentum karakter-literál marad (`normalizeMacroInvokeArg`). Teszt `tests/macro-field-params.test.js`.
4. **F7–F8** — az 5. szakasz táblázata szerint.

Közben észrevett JS-furcsaságok, amelyeket a Rust szándékosan hűen hoz (ha javítani kell, előbb a JS-ben,
utána golden-frissítés):
- `lda.zp c` → `LDA $0C`: hexa-jegyekből álló szimbólumnevet a `.zp` ág számnak vesz;
- `JMP (címke)` fordítási hiba (az indirekt mód csak `($hhhh)` alakot ismer);
- `lda $1234+1` fordítási hiba (`$`-ral kezdődő kifejezés nem megy át az operandus-ellenőrzésen);
- a paraméter nélküli makró törzse a definíció helyén is lefordul — az első `* =` előtti definíció a
  program elejére kerül, és a következő ORG felülírja;
- feloldatlan TURBO_SET sebesség 0-val fordul (`null` mint 0);
- a TEXT a `charOffset`-et (`.text X, Y, "s", 80`) elemzi, de nem használja; a méret mindig a nagybetűs
  kódolással számol (a hossz ugyanaz);
- a DATA / RAWBYTES bájtjai címkék nélkül értékelődnek ki (`parseByteMacro(raw, base)`), a CHARDEF bájtjai hexák
  (`129` = $129 → hiba);
- a `macroLabel` címe `parseAddressValue` címkék nélkül: címkés célcímnél $C000;
- a JOYSTICK mérete a portot címkék nélkül oldja fel (`_joyPortValue`), a bájtok címkékkel — címkés port 3-nál
  a méret 3 bájttal kevesebb, mint a kód;
- a SPRITE_ANIM feloldatlan képkocka-száma hiba (`null < 1`), a sprite száma és a ZP-cím 0;
- futásidejű `.if` / `.while` / `.until` nem immediate operandusa `parseAddressValue`: `%bin` hiba, a `10`
  hexa ($0010); az `.else` / `.endif` futásidejű, amíg nyitott futásidejű `.if` van — a köztes fordítási idejű
  `.if` ágát is lezárhatja;
- a DELAY helper a layout utolsó sora (nem a legnagyobb cím) és a deferred szakaszok (TEXT / STRING / DATA is)
  fölé kerül, kihagyott (`.if 0`) DELAY esetén is;
- a MEMCPY / MEMSET mérete (`getInstructionSize`) címkék nélkül számol, a bájtok címkékkel;
- a makró auto buffere DATA / RAWBYTES-nél 0 bájtot foglal (a darab mégis oda kerül, a következő buffer
  felülírhatja), a kihagyott sorok buffere is kap címet;
- a nem található include nem hiba (a fordítás nélküle megy tovább), az include-olt fájl saját `.incbin` /
  `.sid` / `.include` direktíváit a VA nem tölti be (üres adat), és a benne lévő makróhívás nincs kibontva.

F4 közben javított JS-hibák (mindkettő TypeError volt `null.toString`-on a `compileLineBytes`-ban): feloldatlan
címkéjű `.wait_raster` — most `compileWaitRasterByte`; feloldatlan `.sprite_init` adatlap — most
`compileSpriteInitPageByte`.

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

`crates/vma/` (most: a külön `VMA` repó) önálló crate (Tauri-függés nélkül, függőségei a `regex` és a `serde_json`); a `src-tauri`
path-függőségként húzza be (F6). Nem workspace, hogy a `src-tauri/target` útvonalak (CI, bundle) ne változzanak.

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
- Kapcsoló: `c64va-vma-engine` = `js` | `rust` (a korábbi `shadow` mód kikerült). Alapértelmezés `js` → `rust`.

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

---

## 7. F4 munkajegyzet — a JS-oldal, ahogy portolni kell

A `www/app.js`-ben: elemzés `parseExpertText` (a regexek és a mezők), méret `getInstructionSize`, bájtok
`compileLineBytes`, címkék `addLayoutLabels`, deferred darabok `assembleProgramToPrg` +
`getDeferredMemorySections`. A Rust-oldalon: új `Kind` változatok a `parse.rs`-ben (a `UNPORTED` listából
a sorát törölni), méret az `asm.rs` `size()`-ában, bájtok a `compile_line()`-ban (vagy új `macros.rs`).

### Általános csapdák

- **`null` mint 0.** A `resolveProgramNumericValue` / `parseMacroNumber` feloldhatatlan értékre `null`-t ad;
  az `isNaN(null)` hamis, a `null < 0` / `null > 7` hamis, az aritmetikában és bitműveletben 0. Ezért sok makró
  feloldatlan paraméterrel **0-val fordul, nem hibával** (pl. SPRITE_COL, MOUSE sprite-száma, WAIT_RASTER,
  CHARDEF bájtjai). Kivétel a szigorú összevetés: `port !== 1 && port !== 2` → `null` hibát ad (JOYSTICK,
  MOUSE portja), és ahol a kód kifejezetten `=== null`-t néz (SPRITE_POS, SET_*, MEMSET értéke, PRINT_CHAR,
  IRQ_SETUP / SID_PLAYER raszter, DELAY).
- A bájtok `& 0xFF`-fel vagy a `Uint8Array` ToUint8-jával kerülnek a pufferbe (NaN → 0).
- Az `encodeTextMacro(text || "HELLO C64")` és az `encodePetsciiMacro(text || "HELLO")` üres szövegre
  alapértelmezett szöveget kódol — a méret és a bájt is ezzel számol.
- A `parseAddressValue(cím, labels)` címkét csak pontos névvel keres; 1–4 hexa jegy hexa.
- A `_evalAsmExpression` (MEMCPY / MEMSET `parseMacroCountOrSize`) a „Folded” kiértékelő (a Rustban
  `eval_folded`).

### Makrónként

| Makró | Elemzés (`parseExpertText`) | Méret | Bájtok / megjegyzés |
|-------|------------------------------|-------|---------------------|
| TEXT | `.text X, Y, "s"[, lower\|hex]` → textX/textY (azonosító vagy szám), charset | `len(encodeTextMacro(raw))*5` | `LDA #c / STA $0400+Y*40+X+i`; X/Y `resolveProgramNumericValue(…, "dec")` |
| STRING | `.string $addr\|címke, "s"[, hex][, lower][:címke]` | `len*5` | `LDA #(c+offset) / STA addr+i`; offset `resolveProgramNumericValue(charOffset, labels, "hex")` |
| DATA | `.data $addr\|címke, bájtok[:címke]`, base hex | `parseByteMacro(raw).len*5` | `LDA #b / STA addr+i` (bájtok címkék nélkül) |
| RAWBYTES / RAWTEXT / PETSCII | mint fent; PETSCII címe `$` nélkül, `, lower`, `, null` | 0 | deferred darab a címén (RAWBYTES: `parseByteMacro(raw, base)` címkék nélkül; RAWTEXT + offset; PETSCII `encodePetsciiMacro` + opcionális 0) |
| macroLabel | `:címke` a fenti négyen | — | `addLayoutLabels`: a cím `parseAddressValue(mező)` ?? $C000 |
| CHARSET | `.charset lower\|upper` | 8 | `LDA $D018 / ORA #$02` vagy `AND #$FD` `/ STA $D018` |
| CHARDEF | `.chardef $base, index, 8 bájt` | 40 | 8× `LDA #b / STA base+index*8+i`; bájt `parseMacroNumber(…, "hex")` |
| BOX_HIT | `.box_hit $zp1, $zp2` | 30 | fix 30 bájt, `off(pos, target)` |
| TABLE | `.table NÉV [$addr]` | 0 | **a layoutban `cursor = cím`**, ha van cím; címke: a cím vagy a sor címe |
| LOADFILE | `.loadfile "NÉV", dev[, $addr][, hibacímke]` | `3+max(len,1)+9+9+(addr?4:0)+5+2` | JMP át a néven, SETNAM / SETLFS / LOAD, `BCS hibacímke` vagy `BCS *` |
| EXODECRUNCH | `.exodecrunch [depacker=$B000]` | 19 | $AE/$AF → $04/$05, $01=$36, JSR, $01=$37 |
| SPRITE_INIT | `.sprite_init n, color, page[, mc]`, page nagybetűsítve | 26 | `parseMacroNumber` (n, color dec; page hex) |
| SPRITE_POS | `.sprite_pos n, x, y` | 18 | `=== null` hiba; $D010 ORA/AND x>255 szerint |
| SPRITE_COL | `.sprite_col n, sprite\|background` | 5 | `LDA $D01E/$D01F / AND #1<<n` |
| SPRITE_ANIM | `.sprite_anim n, $lista, db, $zp` | 19 | INC zp … `STA $07F8+n` |
| SCORE_BCD | `.score_bcd $addr, 2\|4\|6, pont, $képernyő` | `3+b*8+b*21` (b = digits/2) | SED/CLC, ADC BCD, CLD, kiírás |
| JOYSTICK | `.joystick port, sprite` vagy `.joystick port, vx, vy[, fire]` | `_joystickSize` | `_joyReadBytes` (port 3: `LDA $DC00 / AND $DC01`), `_joyVarBytes`; a változós mód `_evalAsmExpr` + `_substituteStarPc` |
| MOUSE | `.mouse port, n, zpX, zpY` | 142 | belső címkés kód (xStart / xNeg / xDone / yNeg / yDone), abszolút ugrás `line.address`-hez |
| WAIT_RASTER | `.wait_raster sor` (hexa, 2 jegyre töltve) | 7 | `LDA $D012 / CMP #sor / BNE -7` |
| TURBO_SET / TURBO_ENABLE / SUPERCPU_DETECT | regexek a JS-ben | 5 / 5 / 5 | fix kód |
| REU_CHECK / REU_STASH / FETCH / SWAP | `.reu_x $c64, $reu, bank, $len` | 34 / 40 | fix próba; 8× `LDA # / STA $DF0x`, parancs $90 / $91 / $92 |
| MAP_COPY / MAP_COPY16X16 | regexek a JS-ben | lásd `getInstructionSize` | `genSection`; 16×19 bájt |
| MEMCPY / MEMSET | `src=… , dst=… , size=…` (`_importNormalizeAddressToken` / `SizeToken`) | lapok × 11 (+13) / 2 + lapok × 8 (+10); a méret címkék nélkül | `parseMacroCountOrSize`, `parseMacroAddress` |
| PRINT / PRINT_CHAR / PRINT_HEX | `.print "s"[, lower]`, `.print_char x`, `.print_hex A\|X\|Y` | 17+len / 5 / 30 (X, Y: 31) | JMP a szöveg fölött + CHROUT ciklus; `parsePetsciiCharValue`; `compilePrintHexA` |
| CLEAR_SCREEN / WAIT_KEY | — | 5 / 7 | fix |
| SET_BORDER / SET_BG | `.set_border x` (azonosító vagy hexa) | 5 | `parseMacroNumber(…, "hex")`, 0–15 |
| IRQ_SETUP | `.irq_setup handler=címke, raster=$xx` | 46 | fix kód a handler címével |
| RAND | `.rand [$zp\|címke]` | 15 | `parseMacroAddress` |
| DELAY | `.delay n` / `.wait n` (két helyen ugyanaz a regex) | 5 | `LDX #n / JSR helper`; a helper (`buildDelayHelperBytes`, 34 bájt) deferred darab a `max(layout.end, deferred szakaszok vége) + 1` címen (`appendDelayHelperLabel`, `getDeferredMemorySections` — a TEXT képernyőcíme is beleszámít) |
| futásidejű IF / ELSE / ENDIF | `.if A == #$10` / `.if_x …`; a parser `runtimeIfStack`-je dönti el, hogy az `.else` / `.endif` futásidejű-e | `(imm?2:3) + (<= vagy > ? 4 : 2)` / 3 / 0 | CMP/CPX/CPY + ugrás az else-címkére; címkék: ELSE → else = cím+3, ENDIF → end = cím (else nélkül else = end is) |
| WHILE / ENDW, REPEAT / UNTIL | `whileStack`, `repeatStack` a parserben | mint IF / 3 / 0 / mint IF | `_compileCmpBranch`; címkék: WHILE start = cím, ENDW end = cím+3, REPEAT start = cím |
| SID_PLAYER | `.sid_player [song][, raster]` | 58 | `_sidPlayerBytes`; `SID_INIT` / `SID_PLAY` nélkül hiba (F5 adja a címkéket) |
