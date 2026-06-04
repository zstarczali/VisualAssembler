const addressingModes = {
  implied: {
    label: "Implied",
    needsOperand: false,
    placeholder: "Nem kell operandus",
    help: "Az utasitas onmagaban teljes."
  },
  immediate: {
    label: "Immediate",
    needsOperand: true,
    placeholder: "Peldaul 1 vagy 255",
    help: "Az ertek kozvetlen konstans, az assembler ele # jelet kap."
  },
  zeroPage: {
    label: "Zero page",
    needsOperand: true,
    placeholder: "0-255",
    help: "Az operandus a zero page tartomanyban van."
  },
  absolute: {
    label: "Absolute",
    needsOperand: true,
    placeholder: "0-65535",
    help: "Teljes 16 bites memoriacim."
  },
  relative: {
    label: "Relative/Label",
    needsOperand: true,
    placeholder: "ciklus vagy 2048",
    help: "Branch utasitasnal adhatsz meg labelt vagy celt."
  },
  absoluteX: {
    label: "Absolute,X",
    needsOperand: true,
    placeholder: "0-65535",
    help: "16 bites memoriacim + X regiszter offset. Pl: LDA $0400,X"
  },
  absoluteY: {
    label: "Absolute,Y",
    needsOperand: true,
    placeholder: "0-65535",
    help: "16 bites memoriacim + Y regiszter offset. Pl: LDA $0400,Y"
  },
  indirectX: {
    label: "Indirect,X",
    needsOperand: true,
    placeholder: "0-255",
    help: "Zero page indexelt indirekt. Pl: LDA ($FB,X)"
  },
  indirectY: {
    label: "Indirect,Y",
    needsOperand: true,
    placeholder: "0-255",
    help: "Zero page indirekt indexelt. Pl: LDA ($FB),Y"
  },
  indirect: {
    label: "Indirect",
    needsOperand: true,
    placeholder: "0-65535",
    help: "Indirektes cimzesi mod. Csak JMP-nel hasznalhato. Pl: JMP ($0100)"
  },
  zeroPageX: {
    label: "Zero page,X",
    needsOperand: true,
    placeholder: "0-255",
    help: "Zero page cim + X regiszter offset. Pl: LDA $FB,X"
  },
  zeroPageY: {
    label: "Zero page,Y",
    needsOperand: true,
    placeholder: "0-255",
    help: "Zero page cim + Y regiszter offset. Pl: LDX $FB,Y"
  }
};

const mnemonicLibrary = {
  Adatmozgas: [
    { mnemonic: "LDA", description: "Akkumulator betoltese memoriabol vagy konstansbol.", modes: ["immediate", "zeroPage", "zeroPageX", "absolute", "absoluteX", "absoluteY", "indirectX", "indirectY"] },
    { mnemonic: "LDX", description: "X regiszter betoltese.", modes: ["immediate", "zeroPage", "zeroPageY", "absolute", "absoluteY"] },
    { mnemonic: "LDY", description: "Y regiszter betoltese.", modes: ["immediate", "zeroPage", "zeroPageX", "absolute", "absoluteX"] },
    { mnemonic: "STA", description: "Akkumulator kiirasa memoriacimre.", modes: ["zeroPage", "zeroPageX", "absolute", "absoluteX", "absoluteY", "indirectX", "indirectY"] },
    { mnemonic: "STX", description: "X regiszter tarolasa.", modes: ["zeroPage", "zeroPageY", "absolute"] },
    { mnemonic: "STY", description: "Y regiszter tarolasa.", modes: ["zeroPage", "zeroPageX", "absolute"] }
  ],
  Aritmetika: [
    { mnemonic: "ADC", description: "Osszeadas carry figyelembevetele mellett.", modes: ["immediate", "zeroPage", "zeroPageX", "absolute", "absoluteX", "absoluteY", "indirectX", "indirectY"] },
    { mnemonic: "SBC", description: "Kivonas carry figyelembevetele mellett.", modes: ["immediate", "zeroPage", "zeroPageX", "absolute", "absoluteX", "absoluteY", "indirectX", "indirectY"] },
    { mnemonic: "INC", description: "Memoriacim noveles.", modes: ["zeroPage", "zeroPageX", "absolute", "absoluteX"] },
    { mnemonic: "DEC", description: "Memoriacim csokkentes.", modes: ["zeroPage", "zeroPageX", "absolute", "absoluteX"] },
    { mnemonic: "CMP", description: "Osszehasonlitas az akkumulatorral.", modes: ["immediate", "zeroPage", "zeroPageX", "absolute", "absoluteX", "absoluteY", "indirectX", "indirectY"] },
    { mnemonic: "CPX", description: "Osszehasonlitas az X regiszterrel.", modes: ["immediate", "zeroPage", "absolute"] },
    { mnemonic: "CPY", description: "Osszehasonlitas az Y regiszterrel.", modes: ["immediate", "zeroPage", "absolute"] }
  ],
  Logika: [
    { mnemonic: "AND", description: "Logikai ES muvelet az akkumulatorral.", modes: ["immediate", "zeroPage", "zeroPageX", "absolute", "absoluteX", "absoluteY", "indirectX", "indirectY"] },
    { mnemonic: "ORA", description: "Logikai VAGY muvelet az akkumulatorral.", modes: ["immediate", "zeroPage", "zeroPageX", "absolute", "absoluteX", "absoluteY", "indirectX", "indirectY"] },
    { mnemonic: "EOR", description: "Exkluziv VAGY muvelet az akkumulatorral.", modes: ["immediate", "zeroPage", "zeroPageX", "absolute", "absoluteX", "absoluteY", "indirectX", "indirectY"] },
    { mnemonic: "BIT", description: "Bitek tesztelese memoriacimrol.", modes: ["zeroPage", "absolute"] }
  ],
  Ugrasok: [
    { mnemonic: "JMP", description: "Feltetel nelkuli ugras egy cimre.", modes: ["absolute", "indirect"] },
    { mnemonic: "JSR", description: "Szubrutin meghivasa.", modes: ["absolute"] },
    { mnemonic: "RTS", description: "Visszateres szubrutinbol.", modes: ["implied"] },
    { mnemonic: "BNE", description: "Ugras, ha az elozo eredmeny nem nulla.", modes: ["relative"] },
    { mnemonic: "BEQ", description: "Ugras, ha az elozo eredmeny nulla.", modes: ["relative"] },
    { mnemonic: "BCC", description: "Ugras, ha a carry torolve van.", modes: ["relative"] },
    { mnemonic: "BCS", description: "Ugras, ha a carry be van allitva.", modes: ["relative"] },
    { mnemonic: "BMI", description: "Ugras, ha negativ az eredmeny.", modes: ["relative"] },
    { mnemonic: "BPL", description: "Ugras, ha pozitiv az eredmeny.", modes: ["relative"] },
    { mnemonic: "BVC", description: "Ugras, ha overflow nincs beallitva.", modes: ["relative"] },
    { mnemonic: "BVS", description: "Ugras, ha overflow be van allitva.", modes: ["relative"] },
    { mnemonic: "RTI", description: "Visszateres megszakitaskezelesbol.", modes: ["implied"] }
  ],
  Regiszterek: [
    { mnemonic: "TAX", description: "Akkumulator masolasa X-be.", modes: ["implied"] },
    { mnemonic: "TAY", description: "Akkumulator masolasa Y-ba.", modes: ["implied"] },
    { mnemonic: "INX", description: "X regiszter novelese.", modes: ["implied"] },
    { mnemonic: "DEX", description: "X regiszter csokkentese.", modes: ["implied"] },
    { mnemonic: "INY", description: "Y regiszter novelese.", modes: ["implied"] },
    { mnemonic: "DEY", description: "Y regiszter csokkentese.", modes: ["implied"] },
    { mnemonic: "TSX", description: "Stack pointer masolasa X-be.", modes: ["implied"] },
    { mnemonic: "TXA", description: "X regiszter masolasa az akkumulatorba.", modes: ["implied"] },
    { mnemonic: "TXS", description: "X regiszter masolasa a stack pointerbe.", modes: ["implied"] },
    { mnemonic: "TYA", description: "Y regiszter masolasa az akkumulatorba.", modes: ["implied"] }
  ],
  ShiftEsRotate: [
    { mnemonic: "ASL", description: "Balra tolas egy bittel.", modes: ["implied", "zeroPage", "zeroPageX", "absolute", "absoluteX"] },
    { mnemonic: "LSR", description: "Jobbra tolas egy bittel.", modes: ["implied", "zeroPage", "zeroPageX", "absolute", "absoluteX"] },
    { mnemonic: "ROL", description: "Balra forgas carryvel.", modes: ["implied", "zeroPage", "zeroPageX", "absolute", "absoluteX"] },
    { mnemonic: "ROR", description: "Jobbra forgas carryvel.", modes: ["implied", "zeroPage", "zeroPageX", "absolute", "absoluteX"] }
  ],
  Stack: [
    { mnemonic: "PHA", description: "Akkumulator push a verembe.", modes: ["implied"] },
    { mnemonic: "PHP", description: "Processzor statusz push a verembe.", modes: ["implied"] },
    { mnemonic: "PLA", description: "Akkumulator visszatoltese a verembol.", modes: ["implied"] },
    { mnemonic: "PLP", description: "Processzor statusz visszatoltese a verembol.", modes: ["implied"] }
  ],
  Rendszer: [
    { mnemonic: "CLC", description: "Carry flag torlese.", modes: ["implied"] },
    { mnemonic: "CLD", description: "Decimal flag torlese.", modes: ["implied"] },
    { mnemonic: "CLI", description: "Interrupt tiltasanak feloldasa.", modes: ["implied"] },
    { mnemonic: "CLV", description: "Overflow flag torlese.", modes: ["implied"] },
    { mnemonic: "SEC", description: "Carry flag beallitasa.", modes: ["implied"] },
    { mnemonic: "SED", description: "Decimal mode beallitasa.", modes: ["implied"] },
    { mnemonic: "SEI", description: "IRQ megszakitasok tiltasa.", modes: ["implied"] },
    { mnemonic: "NOP", description: "Nincs muvelet, csak tovabblep.", modes: ["implied"] },
    { mnemonic: "BRK", description: "Megszakitas vagy leallas hibakereseshez.", modes: ["implied"] }
  ],
  Makrok: [
    { mnemonic: "TEXT", description: "Szoveg kiirasa a kepernyore screen code-kent. Kisbetu eseten automatikus lowercase kodolas.", modes: ["implied"], isTextMacro: true },
    { mnemonic: "BYTE", description: "Tetszoleges byte tomb beillesztese vesszovel elvalasztva.", modes: ["implied"], isByteMacro: true },
    { mnemonic: "WORD", description: "16-bites ertekek tarolasa LO/HI byte parokban, vesszovel elvalasztva.", modes: ["implied"], isWordMacro: true },
    { mnemonic: "FILL", description: "Ismetlodo byte generalasa megadott darabszammal.", modes: ["implied"], isFillMacro: true },
    { mnemonic: "ALIGN", description: "Memoria hatar igazitas. Pl. 64 → kovetkezo 64-byte hatarra ugrik (sprite), 256 → page boundary, $2000 → bitmap.", modes: ["implied"], isAlignMacro: true },
    { mnemonic: "TABLE", description: "Lookup tabla definicio cimkevel es kezdocimmel.", modes: ["implied"], isTableMacro: true },
    { mnemonic: "STRING", description: "Karakterlanc kiirasa egy megadott memoriacimre.", modes: ["implied"], isStringMacro: true },
    { mnemonic: "DATA", description: "Nyers byte-ok kiirasa egy megadott memoriacimre.", modes: ["implied"], isDataMacro: true },
    { mnemonic: "RAWBYTES", description: "Nyers byte-ok elhelyezese egy megadott memoriacimtol, kod generalas nelkul.", modes: ["implied"], isRawBytesMacro: true },
    { mnemonic: "RAWTEXT", description: "Szoveg elhelyezese kepernyo kodkent (screen code) egy megadott memoriacimtol, kod generalas nelkul.", modes: ["implied"], isRawTextMacro: true },
    { mnemonic: "PETSCII", description: "Szoveg PETSCII kodolassal egy megadott memoriacimtol, kod generalas nelkul. CHROUT ($FFD2) kompatibilis.", modes: ["implied"], isPetsciiMacro: true },
    { mnemonic: "INCBIN", description: "Kulso binarfajl beillesztese megadott memoriacimtol, kod generalas nelkul.", modes: ["implied"], isIncBinMacro: true },
    { mnemonic: "SID", description: "SID zenefajl betoltese kozvetlenul a memoriaba. A fejlecet automatikusan eltavolitja, a Load/Init/Play cimeket kinyeri.", modes: ["implied"], isSidMacro: true },
    { mnemonic: "INCLUDE", description: "Masik projekt JSON fajl blokkjainak beillesztese erre a helyre (csak olvasható).", modes: ["implied"], isIncludeMacro: true },
    { mnemonic: "LOOP", description: "Szamlalo ciklus: LD* #count, majd cimke a body elejere. NEXT blokkal zarjuk.", modes: ["implied"], isLoopMacro: true },
    { mnemonic: "NEXT", description: "Ciklus vege: DE* es BNE visszaugras a LOOP cimkejere.", modes: ["implied"], isNextMacro: true },
    { mnemonic: "FOR", description: "Elore szamlalo ciklus: LD* #0, majd cimke. ENDF zarja (IN* / CP* #limit / BNE). X/Y = 0..limit-1.", modes: ["implied"], isForMacro: true },
    { mnemonic: "ENDF", description: "Elore szamlalo ciklus vege: IN* / CP* #limit / BNE cimkere. Parosa a FOR blokk.", modes: ["implied"], isEndfMacro: true },
    { mnemonic: "PUSH", description: "Regiszterek mentese a stackre (A, X, Y kombinaciok).", modes: ["implied"], isPushMacro: true },
    { mnemonic: "PULL", description: "Regiszterek visszatoltese a stackrol (A, X, Y kombinaciok).", modes: ["implied"], isPullMacro: true },
    { mnemonic: "MACRO", description: "Felhasznaloi makro definicio kezdete. Nevet var, ENDM-mel zarjuk.", modes: ["implied"], isMacroDefStart: true },
    { mnemonic: "ENDM", description: "Felhasznaloi makro definicio vege.", modes: ["implied"], isMacroDefEnd: true },
    { mnemonic: "INVOKE", description: "Felhasznaloi makro hivasa. Valaszd ki a listabol a makro nevet.", modes: ["implied"], isMacroInvoke: true },
    { mnemonic: "SPRITE_INIT", description: "Sprite inicializalasa: adatlap pointer, engedely bit es szin beallitasa ($D015, $D027+N, $07F8+N).", modes: ["implied"], isSpriteInitMacro: true },
    { mnemonic: "SPRITE_POS", description: "Sprite pozicio beallitasa: X (0-319) es Y (0-255), kezeli a $D010 felso bitet X>255 eseten.", modes: ["implied"], isSpritePosMacro: true },
    { mnemonic: "WAIT_RASTER", description: "Rasztervonal varakozas: LDA $D012 / CMP #sor / BNE -7. Inline, 7 byte, nincs JSR.", modes: ["implied"], isWaitRasterMacro: true },
    { mnemonic: "JOYSTICK", description: "Joystick olvasas es sprite mozgatasa: UP/DOWN/LEFT/RIGHT bitek LSR+BCS+DEC/INC-cel. Port 1=$DC01, Port 2=$DC00 (alap). 27 byte inline.", modes: ["implied"], isJoystickMacro: true },
    { mnemonic: "MOUSE", description: "C64 1351 arányos egér vezérlése: SID POTX/POTY olvasás, standard 1351-szeru 7 bites delta dekódolással, CIA $DC00 felső 2 bitjével portválasztás, 512-ciklusos SID settle wait, X oldalon a klasszikus $D010 toggle mintával, Y oldalon invertált mozgatással. 142 byte inline.", modes: ["implied"], isMouseMacro: true },
    { mnemonic: "SPRITE_COL", description: "Sprite utkozes detektalas: LDA $D01E/$D01F + AND #bitMask. Eredmeny A-ban: nem nulla = utkozes. Utana BEQ/BNE-vel ugri. 5 byte.", modes: ["implied"], isSpriteColMacro: true },
    { mnemonic: "LOADFILE", description: "Fajl betoltese D64-rol KERNAL SETNAM/SETLFS/LOAD rutinokkal. Cim opcionalis (ures = fajl sajat cime, sec=1; kitoltve = override, sec=0). Hiba cimke opcionalis (BCS).", modes: ["implied"], isLoadFileMacro: true },
    { mnemonic: "REU_CHECK", description: "REU (RAM bovito egyseg) jelenletenek ellenorzese: $DF04 write/read proba $55 es $AA mintaval. Z=0 → REU jelen van (BNE-vel ugri), Z=1 → nincs REU (BEQ-vel ugri). 34 byte.", modes: ["implied"], isReuCheckMacro: true },
    { mnemonic: "REU_STASH", description: "C64 RAM → REU mentes: C64 cim, REU cim/bank es hossz beallitasa ($DF02-$DF08), majd $90 parancs → $DF01 (execute + stash, azonnali DMA). 40 byte inline.", modes: ["implied"], isReuTransferMacro: true },
    { mnemonic: "REU_FETCH", description: "REU → C64 RAM betoltes: C64 cim, REU cim/bank es hossz beallitasa ($DF02-$DF08), majd $91 parancs → $DF01 (execute + fetch, azonnali DMA). 40 byte inline.", modes: ["implied"], isReuTransferMacro: true },
    { mnemonic: "REU_SWAP", description: "C64 RAM ↔ REU csere: C64 cim, REU cim/bank es hossz beallitasa ($DF02-$DF08), majd $92 parancs → $DF01 (execute + swap, azonnali DMA). 40 byte inline.", modes: ["implied"], isReuTransferMacro: true },
    { mnemonic: "TURBO_SET", description: "U64 Turbo mod beallitasa: $D031-be irja a sebessegi indexet (0-15) es a badline vezerlest (bit7). LDA #ertek + STA $D031, 5 byte.", modes: ["implied"], isTurboSetMacro: true },
    { mnemonic: "SUPERCPU_DETECT", description: "CMD SuperCPU jelenletenek ellenorzese: LDA $D0B8 / CMP #$FF. Z=0 → SuperCPU jelen (BNE-vel ugri), Z=1 → nincs (BEQ-vel ugri). 5 byte.", modes: ["implied"], isSuperCpuDetectMacro: true },
    { mnemonic: "TURBO_ENABLE", description: "CMD SuperCPU turbo be/ki: BE → LDA #$00 / STA $D07A, KI → LDA #$00 / STA $D07B. 5 byte.", modes: ["implied"], isTurboEnableMacro: true },
    { mnemonic: "DEFINE", description: "Szimbolum definialasa felteteles forditashoz. Ha jelen van, az IF blokkban levo feltetelek kivalutalodnak.", modes: ["implied"], isDefineMacro: true },
    { mnemonic: "IF", description: "Felteteles forditas kezdete. Kifejezest var (pl. DEBUG). ENDIF-fel zarjuk.", modes: ["implied"], isIfMacro: true },
    { mnemonic: "ELSE", description: "Alternativ ag IF blokkon belul.", modes: ["implied"], isElseMacro: true },
    { mnemonic: "ENDIF", description: "Felteteles forditas vege.", modes: ["implied"], isEndIfMacro: true },
    { mnemonic: "CONST", description: "Nevesitett konstans definialasa. Barmely fontos mnemoniknal felhasznalhato (LDA, STA, JSR, stb.).", modes: ["implied"], isConstMacro: true },
    { mnemonic: "ORG", description: "Cimzestarto atvaltasa (*= direktiva). A kovetkező blokkokat az itt megadott cimtol forditja.", modes: ["implied"], isOrgMacro: true }
  ],
  Illegalis: [
    { mnemonic: "LAX", description: "A es X regiszter egyideju betoltese (illegalis: LDA+LDX kombinacio).", modes: ["immediate", "zeroPage", "absolute"] },
    { mnemonic: "SAX", description: "A es X regiszter AND ertekenek kiirasa memoriacimre (illegalis).", modes: ["zeroPage", "absolute"] },
    { mnemonic: "DCP", description: "Memoria dekrementum majd osszehasonlitas az akkumulatorral (illegalis: DEC+CMP).", modes: ["zeroPage", "absolute", "absoluteX"] },
    { mnemonic: "ISC", description: "Memoria inkrementum majd kivonas az akkumulatorbol (illegalis: INC+SBC).", modes: ["zeroPage", "absolute", "absoluteX"] },
    { mnemonic: "SLO", description: "Memoria balra tolas majd logikai VAGY az akkumulatorral (illegalis: ASL+ORA).", modes: ["zeroPage", "absolute", "absoluteX"] },
    { mnemonic: "RLA", description: "Memoria balra forgatas majd logikai ES az akkumulatorral (illegalis: ROL+AND).", modes: ["zeroPage", "absolute", "absoluteX"] },
    { mnemonic: "SRE", description: "Memoria jobbra tolas majd kizaro VAGY az akkumulatorral (illegalis: LSR+EOR).", modes: ["zeroPage", "absolute", "absoluteX"] },
    { mnemonic: "RRA", description: "Memoria jobbra forgatas majd osszeadas carry-vel (illegalis: ROR+ADC).", modes: ["zeroPage", "absolute", "absoluteX"] },
    { mnemonic: "ANC", description: "AND azonnali ertekkel, carry beallitasa a 7. bitbol (illegalis).", modes: ["immediate"] },
    { mnemonic: "ALR", description: "AND majd jobbra tolas egy lepesben (illegalis: AND+LSR).", modes: ["immediate"] },
    { mnemonic: "ARR", description: "AND majd jobbra forgatas egy lepesben (illegalis: AND+ROR).", modes: ["immediate"] },
    { mnemonic: "AXS", description: "A es X AND ertekebol azonnali kivonas, eredmeny X-be (illegalis: SBX).", modes: ["immediate"] }
  ],
  Szerkezet: [
    { mnemonic: "LABEL", description: "Nevvel ellatott cimke a kodban, ugrasi celhoz.", modes: ["implied"], isLabel: true },
    { mnemonic: "COMMENT", description: "Megjegyzes a programhoz, ami nem general byte-ot.", modes: ["implied"], isComment: true },
    { mnemonic: "REGION", description: "Blokkok csoportositasa egy nevesitett, osszecsukhato szekcioba. Zarj le ENDREGION-nal.", modes: ["implied"], isRegionMacro: true },
    { mnemonic: "ENDREGION", description: "REGION szekció vege.", modes: ["implied"], isEndRegionMacro: true }
  ]
};

const categorySelect = document.getElementById("category-select");
const mnemonicSelect = document.getElementById("mnemonic-select");
const paletteSearchInput = document.getElementById("palette-search");
const operandInput = document.getElementById("operand-input");
const addressingSelect = document.getElementById("addressing-select");
const baseInputs = [...document.querySelectorAll('input[name="number-base"]')];
const themeToggleButton = document.getElementById("theme-toggle");
const languageSelect = document.getElementById("language-select");
const loadSampleButton = document.getElementById("load-sample");
const sampleSelect = document.getElementById("sample-select");
const saveProjectButton = document.getElementById("save-project");
const savePrgButton = document.getElementById("save-prg");
const saveD64Button = document.getElementById("save-d64");
const loadProjectButton = document.getElementById("load-project");
const zoomOutButton = document.getElementById("zoom-out");
const zoomInButton = document.getElementById("zoom-in");
const addSelectedButton = document.getElementById("add-selected");
const clearProgramButton = document.getElementById("clear-program");
const collapseAllButton = document.getElementById("collapse-all");
const expandAllButton = document.getElementById("expand-all");
const copyAsmButton = document.getElementById("copy-asm");
const runEmulatorButton = document.getElementById("run-emulator");
const runDebuggerButton = document.getElementById("run-debugger");
const chooseViceButton = document.getElementById("choose-vice");
const chooseDebuggerButton = document.getElementById("choose-debugger");
const emulatorStatus = document.getElementById("emulator-status");
const emulatorRunHint = document.getElementById("emulator-run-hint");
const vicePathInput = document.getElementById("vice-path");
const debuggerPathInput = document.getElementById("debugger-path");
const debuggerStatus = document.getElementById("debugger-status");
const dbgJmp = document.getElementById("dbg-jmp");
const dbgWait = document.getElementById("dbg-wait");
const dbgUnpause = document.getElementById("dbg-unpause");
const currentFileDisplay = document.getElementById("current-file");
const originInput = document.getElementById("origin-input");
const originPreview = document.getElementById("origin-preview");
const memoryMap = document.getElementById("memory-map");
const memoryStrip = document.getElementById("memory-strip");
const memoryStripTop = document.getElementById("memory-strip-top");
const memoryOverlapBadge = document.getElementById("memory-overlap-badge");
const mnemonicDescription = document.getElementById("mnemonic-description");
const paletteList = document.getElementById("palette-list");
const programList = document.getElementById("program-list");
const asmOutput = document.getElementById("asm-output");
const monitorOutput = document.getElementById("monitor-output");
const outputStack = document.getElementById("output-stack");
const outputModeInputs = [...document.querySelectorAll('input[name="output-mode"]')];
const blockTemplate = document.getElementById("block-template");
const paletteItemTemplate = document.getElementById("palette-item-template");
const globalMemoryPanel = document.querySelector(".global-memory-panel");
const aboutButton = document.getElementById("about-btn");
const whatsNewButton = document.getElementById("whats-new-btn");

let asmBlockRanges = {};
let selectedBlockId = null;
let asmPlainText = "";
let asmDisplayText = "";
let showMacroSource = false;
let showRegionComments = true;
let blockPaletteSync = true;
let asmOutputBase = "hex";
let originBase = "hex";
const macroSourceToggle = document.getElementById("macro-source-toggle");
const macroSourceToggleText = document.getElementById("macro-source-toggle-text");
const regionCommentsToggle = document.getElementById("region-comments-toggle");
const blockPaletteSyncToggle = document.getElementById("block-desc-sync-toggle");
const asmBaseInputs = document.querySelectorAll('input[name="asm-output-base"]');
const originBaseInputs = document.querySelectorAll('input[name="origin-base"]');
const compileErrorDialog = document.getElementById("compile-error-dialog");
const compileErrorList = document.getElementById("compile-error-list");
const compileErrorTitle = document.getElementById("compile-error-title");
const compileErrorClose = document.getElementById("compile-error-close");
const workProgressDialog = document.getElementById("work-progress-dialog");
const workProgressTitle = document.getElementById("work-progress-title");
const workProgressSubtitle = document.getElementById("work-progress-subtitle");
const workProgressBar = document.getElementById("work-progress-bar");
const helpManualButton = document.getElementById("help-manual-btn");
const checkUpdateButton = document.getElementById("check-update-btn");
const reportBugButton = document.getElementById("report-bug-btn");
const basicSysToggle = document.getElementById("basic-sys-toggle");
const expertModeToggle = document.getElementById("expert-mode-toggle");
const expertPanel = document.getElementById("expert-panel");
const expertEditor = document.getElementById("expert-editor");
const expertStatus = document.getElementById("expert-status");
const expertHlCode  = document.getElementById("expert-hl-code");
const expertHlPre   = document.getElementById("expert-hl");
const expertCursorPos = document.getElementById("expert-cursor-pos");
const expertFileName = document.getElementById("expert-file-name");
const aboutDialog = document.getElementById("about-dialog");
const aboutCloseButton = document.getElementById("about-close");
const whatsNewDialog = document.getElementById("whats-new-dialog");
const whatsNewCloseButton = document.getElementById("whats-new-close");
const knowledgeBaseButton = document.getElementById("knowledge-base-btn");
const knowledgeBaseDialog = document.getElementById("knowledge-base-dialog");
const knowledgeBaseCloseButton = document.getElementById("knowledge-base-close");
let workProgressTimer = null;
let workProgressValue = 10;
const exitAppButton = document.getElementById("exit-app");
const expertHlToggleBtn = document.getElementById("expert-hl-toggle");
const expertPaletteSyncBtn = document.getElementById("expert-palette-sync-btn");
const expertPaletteBtn     = document.getElementById("expert-palette-btn");
const expertDisasmBtn      = document.getElementById("expert-disasm-btn");
const expertDisasmPanel    = document.getElementById("expert-disasm-panel");
const expertDisasmOutput   = document.getElementById("expert-disasm-output");
const expertDisasmResizer  = document.getElementById("expert-disasm-resizer");
const expertMonitorBtn     = document.getElementById("expert-monitor-btn");
const expertMonitorPanel   = document.getElementById("expert-monitor-panel");
const expertMonitorOutput  = document.getElementById("expert-monitor-output");
const expertFormatBtn      = document.getElementById("expert-format-btn");
const expertLoadAsmBtn     = document.getElementById("expert-load-asm-btn");
const expertSaveAsmBtn     = document.getElementById("expert-save-asm-btn");
const expertBuildInfoBtn   = document.getElementById("expert-build-info-btn");
const buildInfoBtn         = document.getElementById("build-info-btn");
const expertProjectBtn     = document.getElementById("expert-project-btn");
const expertProjectPanel   = document.getElementById("expert-project-panel");

let program = [];
let dragState = null;
let _dndSrc = null;
let _dndActive = false;
let _dndGhost = null;
let _copiedBlock = null;
let _clipboardRegion = null;
const defaultOrigin = 0x0801;
let blockScale = 0.9;
let currentLanguage = "en";
let vicePath = "";
let debuggerPath = "";
let debuggerJmp = true;
let debuggerWait = false;
let debuggerWaitMs = 3000;
let debuggerUnpause = false;
let savedUiSettings = {};
let userMacros = {};  // Stores user-defined macros: { macroName: [blocks...] }

// ── Tab system ──────────────────────────────────────────────────────
let tabs = [];
let activeTabId = null;
let _tabCounter = 0;
let _expertHlEnabled = true;
let _expertPaletteSyncEnabled = true;
let _expertPaletteVisible = false;
let _expertDisasmVisible = false;
let _expertDisasmWidth   = 340;
let _expertMonitorVisible = false;
let _expertProjectVisible = false;
let _expertProjectData = null; // { name, files, _projPath }

const translations = {
  hu: {
    menu: "Menu",
    menuFile: "File",
    menuExamples: "Peldak",
    menuSettings: "Beallitasok",
    menuView: "Nezet",
    menuProgram: "Program",
    loadSample: "Betoltes",
    saveProject: "Program mentese",
    workProgressTitle: "Forditas folyamatban...",
    workProgressDoneTitle: "Sikeres build",
    workProgressRun: "PRG generalasa es VICE inditasa...",
    workProgressRunD64: "D64 csomagolas es VICE inditasa...",
    workProgressRunUltimate: "PRG kuldese a C64 Ultimate-re...",
    workProgressRunD64Ultimate: "D64 kuldese a C64 Ultimate-re...",
    workProgressDebug: "PRG generalasa es debugger inditasa...",
    workProgressImport: "ASM import feldolgozasa...",
    workProgressSuccessRun: "Build sikeres, VICE inditva.",
    workProgressSuccessRunD64: "Build sikeres, VICE inditva D64-rol.",
    workProgressSuccessUltimate: "Build sikeres, program elinditva a hardveren.",
    workProgressSuccessD64Ultimate: "D64 felcsatolva, lemez fut a hardveren.",
    workProgressSuccessDebug: "Build sikeres, debugger inditva.",
    workProgressSuccessImport: "Import sikeres.",
    savePrg: "Build PRG",
    buildSection: "Build",
    savePrgFailed: "PRG mentes sikertelen",
    saveD64: "Build D64",
    saveD64Success: "D64 elmentve",
    saveD64Failed: "D64 mentes sikertelen",
    saveD64NeedVice: "A D64 mentes a VICE c1541 toolt hasznalja. Allitsd be a VICE eleresi utjat a Beallitasok menuben.",
    d64ExtraNamePlaceholder: "FAJLNEV",
    d64ExtraAddrPlaceholder: "C000",
    d64ExtraRemove: "Eltavolitas",
    d64ErrorEmptyName: "Egy fajlhoz nincs nev megadva.",
    d64ErrorBadAddr: "Ervenytelen betoltesi cim a {name} fajlhoz (hex 0000-FFFF).",
    d64FilesLabel: "fajl",
    d64ExportTitle: "Build D64",
    d64ExportDiskName: "Lemez nev (max 16)",
    d64ExportProgName: "Program nev (max 16)",
    d64ExportExtrasTitle: "Tovabbi fajlok",
    d64ExportExtrasHelp: "Adj hozza nyers binaris fajlokat (pl. adat, sprite). PRG bejegyzeskent kerulnek a D64-re. A betoltesi cim mezo opcionalis (hex), uresen hagyva nyersen mented.",
    d64ExportAddFile: "+ Fajl hozzaadasa",
    d64ExportConfirm: "Mentes",
    d64ExportCancel: "Megse",
    programSettings: "Programbeallitasok",
    macroSourceToggle: "Makro forraskod megjelenites",
    asmNumbersLabel: "Szamok az ASM kimenetben",
    regionCommentsLabel: "Region kommentek megjelenites",
    asmOutputLabel: "ASM kimenet",
    monitorOutputLabel: "Monitor kimenet",
    originPreviewLabel: "Forditas info",
    compileErrorTitle: "Forditasi hibak",
    buildInfoTitle: "Build info",
    buildInfoOrigin: "Kezdocim",
    buildInfoSize: "Meret",
    buildInfoEnd: "Vegcim",
    buildInfoLabels: "Cimkek",
    buildInfoConsts: "Konstansok",
    buildInfoMacros: "Makrok",
    buildInfoErrors: "Hibak",
    buildInfoNoErrors: "Nincsenek hibak",
    buildInfoBtn: "Build info",
    vasmLoadBtn: "ASM betoltese",
    vasmSaveBtn: "ASM mentese",
    vasmLoadedStatus: "Betoltve",
    vasmSavedStatus: "Mentve",
    vasmLoadError: "Betoltesi hiba",
    vasmSaveError: "Mentesi hiba",
    loadProject: "Program betoltese",
    exitApp: "Kilepes",
    themeToggle: "Tema valtasa",
    crtToggle: "CRT retro mod",
    clearProgram: "Uj program...",
    newProgramConfirmMsg: "Uj programot hozol letre? A mentetlen valtozasok elvesznek.",
    newProgramConfirmBtn: "Uj program",
    heroCopy: "Huzz be egy mnemonik blokkot balrol, rendezd oket sorba, es nezd meg a jobb oldalon az assembly nezetet.",
    paletteTitle: "Mnemonik menu",
    paletteHelp: "Valassz kategoriat, majd huzd at a blokkot a programlistaba.",
    fieldCategory: "Kategoria",
    fieldMnemonic: "Mnemonik",
    fieldOperand: "Operandus",
    numberBase: "Szamrendszer",
    addressingMode: "Cimzesi mod",
    addSelected: "Kivalasztott blokk hozzaadasa",
    programTitle: "Program blokkok",
    programHelp: "Ide ejtsd a bal oldali blokkot, vagy rendezd at a mar bent levo sorokat.",
    asmTitle: "ASM nezet",
    asmHelp: "Az osszerakott szoveges kod innen indulhat tovabb export fele.",
    outputProgram: "Beallitas",
    outputAsm: "ASM",
    outputMonitor: "Monitor",
    outputBoth: "Mindketto",
    originLabel: "Program kezdocime",
    originPlaceholderHex: "pl. $0801 vagy $C000",
    originPlaceholderDec: "pl. 2049 vagy 49152",
    emulatorTitle: "VICE kapcsolat",
    emulatorHelp: "A helyi VICE emulatort inditjuk a desktop appbol.",
    openEmulator: "VICE kivalasztasa",
    runInEmulator: "Run",
    runAsPrg: "Futtatás PRG-ként",
    runViaD64: "Futtatás D64-ről",
    runViaD64Confirm: "Futtatás VICE-ban",
    runD64Title: "Futtatás D64-ről",
    hardwareSettings: "Hardver beállítások...",
    hardwareSettingsTitle: "Hardver beállítások",
    hardwareSettingsClose: "Bezárás",
    hwViceSectionLabel: "VICE Emulator",
    hwDebuggerSectionLabel: "Retro Debugger",
    runOnUltimate: "Futtatás hardveren",
    runD64OnHardware: "D64 hardveren",
    ultimateSectionLabel: "C64 Ultimate",
    ultimateHostLabel: "Host (IP)",
    ultimatePasswordLabel: "Jelszó",
    ultimatePasswordPlaceholder: "(opcionális)",
    ultimateConnectTest: "Kapcsolat tesztelése",
    ultimateConnecting: "Kapcsolódás...",
    ultimateConnected: "Csatlakozva",
    ultimateConnectFailed: "Kapcsolat sikertelen",
    ultimateNotConfigured: "C64 Ultimate nincs beállítva. Add meg a host IP-t a beállításokban.",
    ultimateRunFailed: "Futtatás sikertelen",
    copyAsm: "ASM masolasa",
    viceExecutable: "VICE exe",
    chooseViceStatusPending: "A VICE kapcsolat ellenorzese folyamatban.",
    projectSaved: "Program elmentve",
    projectLoaded: "Program betoltve",
    projectSaveFailed: "A program mentese sikertelen.",
    projectLoadFailed: "A program betoltese sikertelen.",
    projectInvalid: "A fajl nem ervenyes visual assembler projekt.",
    emulatorFallback: "Az app a generalt PRG-t ideiglenes fajlba menti, majd azzal inditja a helyi VICE-ot.",
    memoryTitle: "Teljes C64 memoria",
    memoryHelp: "Az egesz 64 KB cimter egy csikban, jelolve a foglalt, szabad, ROM es I/O reszeket.",
    memoryLegendRam: "Szabad RAM",
    memoryLegendUsed: "Foglalt",
    memoryLegendRom: "ROM",
    memoryLegendIo: "I/O",
    sampleBasic: "Mintaprogram",
    sampleClearScreen: "Kepernyo torles demo",
    sampleLabel: "Label pelda",
    sampleText: "TEXT pelda",
    sampleLowercaseText: "Kisbetus TEXT pelda",
    sampleMacro: "Komplex makro pelda",
    sampleSprite: "Sprite mozgatas pelda",
    sampleSetpixel: "Setpixel demo",
    sampleBitmap: "Bitmap vonal demo",
    sampleMacroTest: "Uj makrok teszt",
    sampleLoop: "LOOP / NEXT demo",
    sampleHelloLoop: "Hello World 1-40 (LOOP szamlalo)",
    samplePushPull: "PUSH / PULL demo",
    sampleIfElse: "IF / ELSE / ENDIF demo",
    sampleUserMacro: "User MACRO / ENDM demo",
    sampleIncBin: "INCBIN demo",
    sampleLoadFile: "LOADFILE demo (D64 betoltes futasidoben)",
    sampleInclude: "INCLUDE demo",
    sampleSidDemo: "SID zenelejatszas (Ikari Warriors)",
    sampleSidDirectDemo: "SID lejatszas - SID makro (Ikari Warriors)",
    sampleSpriteMacroDemo: "SPRITE_INIT / SPRITE_POS makro demo",
    sampleJoystickDemo: "JOYSTICK makro demo",
    sampleMouseDemo: "MOUSE makro demo",
    sampleCollisionDemo: "SPRITE_COL utkozes demo",
    sample10Print: "10 PRINT - veletlen labirintus",
    sampleRasterIrqDemo: "Raszter IRQ demo (szin villogas)",
    sampleOverlappingRasterDemo: "Overlapping raszter csik demo",
    sampleMemoryOverlapDemo: "Memoria atfedes demo",
    sampleRandLinesDemo: "Veletlen vonalak demo",
    sampleReuDemo: "REU demo",
    sampleScrollTextDemo: "Sima scroll demo (pontonkenti gorgetes)",
    sampleNameInputDemo: "Nev bekeres demo (PETSCII + CHROUT)",
    helpManual: "Kezikonyv",
    about: "Névjegy",
    knowledgeBase: "Tudásbázis",
    tutorials: "Leckék",
    tutorialDialogTitle: "Leckék",
    tutorialSelectHint: "Válassz egy leckét a listából",
    tutorialMarkDone: "Megjelölés elvégzettként",
    tutorialMarkDoneCompleted: "✓ Teljesítve",
    tutorialLoadSample: "▶ Mintaprogram betöltése",
    tutorialStartTour: "▶ Interaktív bemutató indítása",
    tourPrev: "← Előző",
    tourNext: "Következő →",
    tourFinish: "Befejezés ✓",
    tourSkip: "× Kihagyás",
    zoomIn: "Nagyítás (A+)",
    zoomOut: "Kicsinyítés (A-)",
    checkForUpdate: "Frissites keresese",
    reportBug: "Hiba bejelentese",
    tabCloseConfirm: "Biztosan bezárod a \"{name}\" tabot?",
    tabCloseConfirmUnsaved: "Biztosan bezárod a \"{name}\" tabot? Nem mentett változtatások elvesznek.",
    tabCloseConfirmOk: "Bezárás",
    tabCloseConfirmCancel: "Mégsem",
    expertPaletteSync: "Mnemonik panel szinkron",
    expertPaletteToggle: "Mnemonik panel megjelenítése",
    expertDisasm: "Disassembler be/ki",
    expertMonitor: "Monitor be/ki",
    expertFormat: "Forráskód formázása",
    expertProjectPanel: "Projekt panel",
    projOpenProjectBtn: "Projekt megnyítása",
    menuOpenProject: "Projekt megnyítása",
    menuSaveProject: "Projekt mentése",
    menuCloseProject: "Projekt bezárása",
    projNewProjectBtn: "Új projekt",
    projSaveProjectBtn: "Projekt mentése",
    projAddFileBtn: "Fájl hozzáadása",
    projNoProject: "Nincs projekt",
    projClickToOpen: "Kattints a mappa gombra\nprojekt megnyitásához",
    projAddFileHint: "Adj hozzá fájlt a + gombbal",
    projRegions: "Régiók",
    projMacros: "Makrók",
    projLabels: "Labelek",
    projOpened: "Projekt megnyitva",
    projSaved: "Projekt mentve",
    projClosed: "Projekt bezárva",
    projNoOpen: "Nincs megnyitott projekt",
    projError: "Projekt hiba",
    projOpenFile: "Megnyitva",
    projSaveError: "Mentési hiba",
    projRemove: "Eltávolítás",
    projStartupFile: "Indítófájl",
    projSetStartup: "Beállítás indítófájlként",
    projUnsetStartup: "Indítófájl törlése",
    projStartupSet: "Indítófájl beállítva",
    viceRunning: "VICE fut",
    whatsNew: "Ujdonsagok",
    paletteSearchPlaceholder: "Kereses...",
    paletteSearchLabel: "Kereses",
    basicSysLabel: "BASIC SYS stub generálása",
    blockDescSyncLabel: "Blokk kiválasztás követése a paletán",
    expertModeLabel: "Expert mode",
    collapseAll: "Osszes osszecsukasa",
    expandAll: "Osszes kinyitasa",
    collapse: "Osszecsukas",
    expand: "Kinyitas",
    moveUp: "Fel",
    moveDown: "Le",
    delete: "Torles",
    dragBlock: "Huzd a blokkot",
    fieldText: "Szoveg",
    fieldBytes: "Byte-ok",
    fieldAddress: "Cim",
    fieldComment: "Komment",
    fieldFormat: "Formatum",
    commentDefault: "uj komment",
    fieldLoopReg: "Register",
    fieldLoopCount: "Ciklus",
    fieldLoopLabel: "Cimke",
    fieldNextLabel: "LOOP cimkeje",
    fieldSpriteNum: "Sprite # (0-7)",
    fieldSpriteColor: "Szin (0-15)",
    fieldSpriteDataPage: "Adatlap ($XX)",
    fieldSpriteX: "X (0-319)",
    fieldSpriteY: "Y (0-255)",
    fieldRasterLine: "Rasztersor ($00-$FF)",
    fieldJoyPort: "Port (1 vagy 2)",
    fieldJoySpriteNum: "Sprite # (0-7)",
    fieldMousePort: "Port (1 vagy 2)",
    fieldMouseSpriteNum: "Sprite # (0-7)",
    fieldMousePotX: "ZP elozo X ($00-$FF)",
    fieldMousePotY: "ZP elozo Y ($00-$FF)",
    fieldColType: "Utkozes tipusa",
    colTypeSprite: "Sprite-Sprite ($D01E)",
    colTypeBackground: "Sprite-Hatter ($D01F)",
    fieldLoadFileName: "Fajlnev (max 16)",
    fieldLoadFileDevice: "Eszkoz (8-30)",
    fieldLoadFileAddress: "Cim (opcionalis)",
    fieldLoadFileAddressPlaceholder: "ures = fajl sajat cime",
    fieldLoadFileErrorLabel: "Hiba cimke (opcionalis)",
    fieldLoadFileErrorLabelPlaceholder: "BCS celja",
    pickLabel: "Cimke valasztas",
    fieldPushRegs: "Regiszterek",
    fieldPullRegs: "Regiszterek",
    warningLabel: "FIGYELEM",
    remoteMemoryData: "Tavoli memoria-adatok",
    dataBelow: "adat lent",
    textDataBelow: "TEXT adat lent",
    stringDataBelow: "STRING adat lent",
    dataDataBelow: "DATA adat lent",
    rawBytesDataBelow: "RAWBYTES adat lent",
    rawTextDataBelow: "RAWTEXT adat lent",
    incBinDataBelow: "INCBIN adat lent",
    fieldIncBinFile: "Fajl",
    incBinBrowse: "Tallozas...",
    incBinNoFile: "Nincs fajl kivalasztva",
    includeNoFile: "Nincs kivalasztott fajl",
    fieldIncludeFile: "Projekt fajl",
    includeBrowse: "Tallozas",
    includeReload: "Ujratoltes",
    includeShowBlocks: "Megjelenites",
    includeHideBlocks: "Elrejtes",
    includeBlocksCount: "blokk",
    includeFileNotFound: "A fajl nem talalhato",
    includeInvalidFile: "Ervenytelen projekt fajl",
    compileInvalidOperand: "Nem lehet forditani: hibas operandus a(z) {mnemonic} sorban.",
    compileUnsupportedMode: "A(z) {mnemonic} {mode} modhoz meg nincs forditasi tamogatas.",
    branchLabelTooFar: "A(z) {label} label tul messze van a(z) {mnemonic} branch-hez.",
    branchOperandInvalid: "Nem lehet futtatni: a(z) {mnemonic} branch operandusa nem ervenyes.",
    branchTargetOutOfRange: "A(z) {mnemonic} branch celcime nincs elerheto tavolsagban.",
    operandNotResolvable: "Nem lehet futtatni: a(z) {mnemonic} operandusa nem forditheto cimme vagy ertekke.",
    anonymousLabelNotFound: "A(z) \"{label}\" nevtelen cimke nem talalhato.",
    memorySegments: {
      zeroPageLabel: "Zero page",
      zeroPageNote: "Gyors eleresu valtozok es pointerek.",
      stackLabel: "Stack",
      stackNote: "6502 veremterulet.",
      systemRamLabel: "Rendszer RAM",
      systemRamNote: "KERNAL/BASIC munkateruletek.",
      basicRamLabel: "BASIC / felhasznaloi RAM",
      basicRamNote: "Tipikus programterulet, BASIC start kozeleben.",
      basicRomLabel: "BASIC ROM",
      basicRomNote: "ROM bank, nem irhato allandoan.",
      freeRamLabel: "Szabad RAM",
      freeRamNote: "Gyakori gepi kod terulet.",
      vicLabel: "VIC-II",
      vicNote: "Video regiszterek.",
      sidLabel: "SID",
      sidNote: "Hanggenerator regiszterek.",
      colorRamLabel: "Color RAM",
      colorRamNote: "Karakter szinek.",
      cia1Label: "CIA 1",
      cia1Note: "I/O, billentyuzet, joystick.",
      cia2Label: "CIA 2",
      cia2Note: "I/O, soros busz es bankolas.",
      ioCartLabel: "I/O / cartridge",
      ioCartNote: "Bovitokartya tartomany.",
      kernalRomLabel: "KERNAL ROM",
      kernalRomNote: "Rendszer ROM rutinok."
    },
    sidFileLabel: "SID fajl",
    sidFilePlaceholder: "Nincs SID fajl kivalasztva",
    sidFileBrowse: "SID fajl tallozas",
    sidCustomAddress: "Betoltesi cim (feluliras)",
    sidCustomAddressPlaceholder: "pl. C000 (ures = SID fejlec)",
    blockDescriptionLabel: "Leiras:",
    mnemonicCardLabel: "Leiras",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    oledMode: "OLED mode",
    emptyState: "Huzz ide egy blokkot a bal oldali palettarol.",
    memoryUsedRam: "Foglalt RAM",
    memoryFreeRam: "Szabad RAM",
    memoryOrigin: "Kod kezdete",
    memoryOccupied: "foglalt",
    memoryFreeInSegment: "Szabad ebben a RAM szegmensben",
    memoryNoUsage: "Nincs foglaltsag ebben a szegmensben.",
    memorySensitive: "A program beleer ebbe az erzekeny tartomanyba.",
    memoryUsedRange: "Foglalt tartomany",
    memorySegmentStatusFree: "Szabad RAM",
    memoryOverlapTitle: "Memoria atfedes",
    memoryOverlapWarning: "Figyelem: teruletek atfednek!",
    memoryOverlapSingle: "atfedes talalhato",
    memoryOverlapMultiple: "atfedes talalhato",
    memoryOverlapBytes: "byte atfedes",
    memoryOverlapCode: "Kod",
    memoryAxisLabel: "Teljes C64 memoria csik",
    languageLabel: "Nyelv",
    sampleSrOnly: "Mintaprogram",
    languageSrOnly: "Nyelv",
    categoryNames: {
      Adatmozgas: "Adatmozgas",
      Aritmetika: "Aritmetika",
      Logika: "Logika",
      Ugrasok: "Ugrasok",
      Regiszterek: "Regiszterek",
      ShiftEsRotate: "Shift es rotate",
      Stack: "Stack",
      Rendszer: "Rendszer",
      Makrok: "Makrok",
      Illegalis: "Illegalis opkodok",
      Szerkezet: "Szerkezet"
    },
    chooseDebugger: "RetroDebugger kivalasztasa",
    debuggerExecutable: "RetroDebugger exe",
    debuggerNotConfiguredPlaceholder: "Nincs beallitva",
    debuggerParamsLabel: "RetroDebugger",
    debuggerJmpLabel: "Ugras a kod cimere (-jmp)",
    debuggerWaitLabel: "Varakozas inditás előtt (-wait)",
    debuggerUnpauseLabel: "Futatas kenyszeritese (-unpause)",
    debuggerStatusPending: "Valaszd ki a RetroDebugger executable-t.",
    debuggerStatusReady: "RetroDebugger keszen all: {path}",
    debuggerNotConfiguredMsg: "A RetroDebugger nincs beallitva. Valaszd ki a menuben.",
    debuggerLaunchNotAvailable: "A debugger inditasa nem elerheto.",
    debuggerLaunched: "RetroDebugger elindult.",
    debuggerLaunchFailed: "A RetroDebugger inditasa sikertelen.",
    runInDebugger: "Debug",
    runInDebuggerTitle: "Futtatas RetroDebuggerben",
    breakpointToggle: "Torespont"
  },
  en: {
    menu: "Menu",
    menuFile: "File",
    menuExamples: "Examples",
    menuSettings: "Settings",
    menuView: "View",
    menuProgram: "Program",
    loadSample: "Load",
    saveProject: "Save program",
    workProgressTitle: "Compiling...",
    workProgressDoneTitle: "Build successful",
    workProgressRun: "Building PRG and launching VICE...",
    workProgressRunD64: "Packaging D64 and launching VICE...",
    workProgressRunUltimate: "Sending PRG to C64 Ultimate...",
    workProgressRunD64Ultimate: "Sending D64 to C64 Ultimate...",
    workProgressDebug: "Building PRG and launching debugger...",
    workProgressImport: "Importing ASM blocks...",
    workProgressSuccessRun: "Build successful, VICE launched.",
    workProgressSuccessRunD64: "Build successful, VICE launched from D64.",
    workProgressSuccessUltimate: "Build successful, program running on hardware.",
    workProgressSuccessD64Ultimate: "D64 mounted, disk running on hardware.",
    workProgressSuccessDebug: "Build successful, debugger launched.",
    workProgressSuccessImport: "Import successful.",
    savePrg: "Build PRG",
    buildSection: "Build",
    savePrgFailed: "PRG save failed",
    saveD64: "Build D64",
    saveD64Success: "D64 saved",
    saveD64Failed: "D64 export failed",
    saveD64NeedVice: "D64 export uses VICE's c1541 tool. Set the VICE path in the Settings menu.",
    d64ExtraNamePlaceholder: "FILENAME",
    d64ExtraAddrPlaceholder: "C000",
    d64ExtraRemove: "Remove",
    d64ErrorEmptyName: "An extra file has no name.",
    d64ErrorBadAddr: "Invalid load address for {name} (hex 0000-FFFF).",
    d64FilesLabel: "files",
    d64ExportTitle: "Build D64",
    d64ExportDiskName: "Disk name (max 16)",
    d64ExportProgName: "Program name (max 16)",
    d64ExportExtrasTitle: "Extra files",
    d64ExportExtrasHelp: "Add raw binary files (e.g. data, sprites). They are written as PRG entries on the D64. The load address field is optional (hex); leave empty to save raw.",
    d64ExportAddFile: "+ Add file",
    d64ExportConfirm: "Export",
    d64ExportCancel: "Cancel",
    programSettings: "Program settings",
    macroSourceToggle: "Show macro source code",
    asmNumbersLabel: "Numbers in ASM output",
    regionCommentsLabel: "Show region comments",
    asmOutputLabel: "ASM output",
    monitorOutputLabel: "Monitor output",
    originPreviewLabel: "Compile info",
    compileErrorTitle: "Compilation errors",
    buildInfoTitle: "Build info",
    buildInfoOrigin: "Origin",
    buildInfoSize: "Size",
    buildInfoEnd: "End address",
    buildInfoLabels: "Labels",
    buildInfoConsts: "Constants",
    buildInfoMacros: "Macros",
    buildInfoErrors: "Errors",
    buildInfoNoErrors: "No errors",
    buildInfoBtn: "Build info",
    vasmLoadBtn: "Load .asm",
    vasmSaveBtn: "Save .asm",
    vasmLoadedStatus: "Loaded",
    vasmSavedStatus: "Saved",
    vasmLoadError: "Load error",
    vasmSaveError: "Save error",
    loadProject: "Load program",
    exitApp: "Exit",
    themeToggle: "Toggle theme",
    crtToggle: "CRT retro mode",
    clearProgram: "New program...",
    newProgramConfirmMsg: "Create a new program? Unsaved changes will be lost.",
    newProgramConfirmBtn: "New program",
    heroCopy: "Drag mnemonic blocks in from the left, arrange them in order, and inspect the assembly view on the right.",
    paletteTitle: "Mnemonic menu",
    paletteHelp: "Choose a category, then drag a block into the program list.",
    fieldCategory: "Category",
    fieldMnemonic: "Mnemonic",
    fieldOperand: "Operand",
    numberBase: "Number base",
    addressingMode: "Addressing mode",
    addSelected: "Add selected block",
    programTitle: "Program blocks",
    programHelp: "Drop blocks from the left here, or reorder the lines already in the program.",
    asmTitle: "ASM view",
    asmHelp: "The assembled source code appears here and can be exported onward.",
    outputProgram: "Options",
    outputAsm: "ASM",
    outputMonitor: "Monitor",
    outputBoth: "Both",
    originLabel: "Program start address",
    originPlaceholderHex: "e.g. $0801 or $C000",
    originPlaceholderDec: "e.g. 2049 or 49152",
    emulatorTitle: "VICE connection",
    emulatorHelp: "The desktop app launches your local VICE emulator.",
    openEmulator: "Choose VICE",
    runInEmulator: "Run",
    runAsPrg: "Run as PRG",
    runViaD64: "Run via D64",
    runViaD64Confirm: "Run in VICE",
    runD64Title: "Run via D64",
    hardwareSettings: "Hardware settings...",
    hardwareSettingsTitle: "Hardware Settings",
    hardwareSettingsClose: "Close",
    hwViceSectionLabel: "VICE Emulator",
    hwDebuggerSectionLabel: "Retro Debugger",
    runOnUltimate: "Run on hardware",
    runD64OnHardware: "D64 on hardware",
    ultimateSectionLabel: "C64 Ultimate",
    ultimateHostLabel: "Host (IP)",
    ultimatePasswordLabel: "Password",
    ultimatePasswordPlaceholder: "(optional)",
    ultimateConnectTest: "Test connection",
    ultimateConnecting: "Connecting...",
    ultimateConnected: "Connected",
    ultimateConnectFailed: "Connection failed",
    ultimateNotConfigured: "C64 Ultimate is not configured. Enter the host IP in Settings.",
    ultimateRunFailed: "Run failed",
    copyAsm: "Copy ASM",
    viceExecutable: "VICE executable",
    chooseViceStatusPending: "Checking the VICE connection.",
    projectSaved: "Program saved",
    projectLoaded: "Program loaded",
    projectSaveFailed: "Saving the program failed.",
    projectLoadFailed: "Loading the program failed.",
    projectInvalid: "This file is not a valid visual assembler project.",
    emulatorFallback: "The app saves the generated PRG as a temporary file, then launches your local VICE with it.",
    memoryTitle: "Full C64 memory",
    memoryHelp: "The full 64 KB address space in one strip, with used, free, ROM and I/O areas highlighted.",
    memoryLegendRam: "Free RAM",
    memoryLegendUsed: "Used",
    memoryLegendRom: "ROM",
    memoryLegendIo: "I/O",
    sampleBasic: "Sample program",
    sampleClearScreen: "Clear screen demo",
    sampleLabel: "Label example",
    sampleText: "TEXT example",
    sampleLowercaseText: "Lowercase TEXT example",
    sampleMacro: "Complex macro example",
    sampleSprite: "Sprite movement example",
    sampleSetpixel: "Setpixel demo",
    sampleBitmap: "Bitmap line demo",
    sampleMacroTest: "New macros test",
    sampleLoop: "LOOP / NEXT demo",
    sampleHelloLoop: "Hello World 1-40 (LOOP counter)",
    samplePushPull: "PUSH / PULL demo",
    sampleIfElse: "IF / ELSE / ENDIF demo",
    sampleUserMacro: "User MACRO / ENDM demo",
    sampleIncBin: "INCBIN demo",
    sampleLoadFile: "LOADFILE demo (runtime D64 load)",
    sampleInclude: "INCLUDE demo",
    sampleSidDemo: "SID player - INCBIN (Ikari Warriors)",
    sampleSidDirectDemo: "SID player - SID macro (Ikari Warriors)",
    sampleSpriteMacroDemo: "SPRITE_INIT / SPRITE_POS macro demo",
    sampleJoystickDemo: "JOYSTICK macro demo",
    sampleMouseDemo: "MOUSE macro demo",
    sampleCollisionDemo: "SPRITE_COL collision demo",
    sample10Print: "10 PRINT - random maze",
    sampleRasterIrqDemo: "Raster IRQ demo (color flashing)",
    sampleOverlappingRasterDemo: "Overlapping raster bars demo",
    sampleMemoryOverlapDemo: "Memory overlap demo",
    sampleRandLinesDemo: "Random lines demo",
    sampleReuDemo: "REU demo",
    sampleScrollTextDemo: "Smooth scroll demo (per-pixel scrolling)",
    sampleNameInputDemo: "Name input demo (PETSCII + CHROUT)",
    helpManual: "Manual",
    about: "About",
    knowledgeBase: "Knowledge Base",
    tutorials: "Tutorials",
    tutorialDialogTitle: "Tutorials",
    tutorialSelectHint: "Select a lesson from the list",
    tutorialMarkDone: "Mark as Completed",
    tutorialMarkDoneCompleted: "✓ Completed",
    tutorialLoadSample: "▶ Load Sample Program",
    tutorialStartTour: "▶ Start Interactive Tour",
    tourPrev: "← Prev",
    tourNext: "Next →",
    tourFinish: "Finish ✓",
    tourSkip: "× Skip",
    zoomIn: "Zoom in (A+)",
    zoomOut: "Zoom out (A-)",
    languageLabel: "Language",
    checkForUpdate: "Check for Update",
    reportBug: "Report Bug",
    tabCloseConfirm: "Close the \"{name}\" tab?",
    tabCloseConfirmUnsaved: "Close the \"{name}\" tab? Unsaved changes will be lost.",
    tabCloseConfirmOk: "Close",
    tabCloseConfirmCancel: "Cancel",
    expertPaletteSync: "Toggle mnemonic panel sync",
    expertPaletteToggle: "Show mnemonic panel",
    expertDisasm: "Toggle disassembler",
    expertMonitor: "Toggle monitor",
    expertFormat: "Format source code",
    expertProjectPanel: "Project panel",
    projOpenProjectBtn: "Open project",
    menuOpenProject: "Open project",
    menuSaveProject: "Save project",
    menuCloseProject: "Close project",
    projNewProjectBtn: "New project",
    projSaveProjectBtn: "Save project",
    projAddFileBtn: "Add file",
    projNoProject: "No project",
    projClickToOpen: "Click the folder button\nto open a project",
    projAddFileHint: "Add files with the + button",
    projRegions: "Regions",
    projMacros: "Macros",
    projLabels: "Labels",
    projOpened: "Project opened",
    projSaved: "Project saved",
    projClosed: "Project closed",
    projNoOpen: "No project is open",
    projError: "Project error",
    projOpenFile: "Opened",
    projSaveError: "Save error",
    projRemove: "Remove",
    projStartupFile: "Startup file",
    projSetStartup: "Set as startup file",
    projUnsetStartup: "Remove startup file",
    projStartupSet: "Startup file set",
    viceRunning: "VICE running",
    whatsNew: "What's New",
    paletteSearchPlaceholder: "Search...",
    paletteSearchLabel: "Search",
    basicSysLabel: "Generate BASIC SYS stub",
    blockDescSyncLabel: "Track block selection in palette",
    expertModeLabel: "Expert mode",
    collapseAll: "Collapse all",
    expandAll: "Expand all",
    collapse: "Collapse",
    expand: "Expand",
    moveUp: "Move up",
    moveDown: "Move down",
    delete: "Delete",
    dragBlock: "Drag block",
    fieldText: "Text",
    fieldBytes: "Bytes",
    fieldAddress: "Address",
    fieldComment: "Comment",
    fieldFormat: "Format",
    commentDefault: "new comment",
    fieldLoopReg: "Register",
    fieldLoopCount: "Count",
    fieldLoopLabel: "Label",
    fieldNextLabel: "LOOP label",
    fieldSpriteNum: "Sprite # (0-7)",
    fieldSpriteColor: "Color (0-15)",
    fieldSpriteDataPage: "Data page ($XX)",
    fieldSpriteX: "X (0-319)",
    fieldSpriteY: "Y (0-255)",
    fieldRasterLine: "Raster line ($00-$FF)",
    fieldJoyPort: "Port (1 or 2)",
    fieldJoySpriteNum: "Sprite # (0-7)",
    fieldMousePort: "Port (1 or 2)",
    fieldMouseSpriteNum: "Sprite # (0-7)",
    fieldMousePotX: "ZP prev X ($00-$FF)",
    fieldMousePotY: "ZP prev Y ($00-$FF)",
    fieldColType: "Collision type",
    colTypeSprite: "Sprite-Sprite ($D01E)",
    colTypeBackground: "Sprite-Background ($D01F)",
    fieldLoadFileName: "Filename (max 16)",
    fieldLoadFileDevice: "Device (8-30)",
    fieldLoadFileAddress: "Address (optional)",
    fieldLoadFileAddressPlaceholder: "empty = file's own load addr",
    fieldLoadFileErrorLabel: "Error label (optional)",
    fieldLoadFileErrorLabelPlaceholder: "BCS target",
    pickLabel: "Pick label",
    fieldPushRegs: "Registers",
    fieldPullRegs: "Registers",
    warningLabel: "WARNING",
    remoteMemoryData: "Remote memory data",
    dataBelow: "data below",
    textDataBelow: "TEXT data below",
    stringDataBelow: "STRING data below",
    dataDataBelow: "DATA data below",
    rawBytesDataBelow: "RAWBYTES data below",
    rawTextDataBelow: "RAWTEXT data below",
    incBinDataBelow: "INCBIN data below",
    fieldIncBinFile: "File",
    incBinBrowse: "Browse...",
    incBinNoFile: "No file selected",
    includeNoFile: "No file selected",
    fieldIncludeFile: "Project file",
    includeBrowse: "Browse",
    includeReload: "Reload",
    includeShowBlocks: "Show blocks",
    includeHideBlocks: "Hide blocks",
    includeBlocksCount: "blocks",
    includeFileNotFound: "File not found",
    includeInvalidFile: "Invalid project file",
    compileInvalidOperand: "Cannot compile: invalid operand on the {mnemonic} line.",
    compileUnsupportedMode: "{mnemonic} {mode} is not wired to the compiler yet.",
    branchLabelTooFar: "Label {label} is too far for the {mnemonic} branch.",
    branchOperandInvalid: "Cannot run: the branch operand for {mnemonic} is invalid.",
    branchTargetOutOfRange: "The branch target for {mnemonic} is out of range.",
    operandNotResolvable: "Cannot run: the operand for {mnemonic} cannot be resolved to an address or value.",
    anonymousLabelNotFound: "Anonymous label \"{label}\" not found.",
    memorySegments: {
      zeroPageLabel: "Zero page",
      zeroPageNote: "Fast-access variables and pointers.",
      stackLabel: "Stack",
      stackNote: "6502 stack area.",
      systemRamLabel: "System RAM",
      systemRamNote: "KERNAL/BASIC work areas.",
      basicRamLabel: "BASIC / user RAM",
      basicRamNote: "Typical program area near the BASIC start.",
      basicRomLabel: "BASIC ROM",
      basicRomNote: "ROM bank, not always writable.",
      freeRamLabel: "Free RAM",
      freeRamNote: "Common machine-code area.",
      vicLabel: "VIC-II",
      vicNote: "Video registers.",
      sidLabel: "SID",
      sidNote: "Sound generator registers.",
      colorRamLabel: "Color RAM",
      colorRamNote: "Character colors.",
      cia1Label: "CIA 1",
      cia1Note: "I/O, keyboard, joystick.",
      cia2Label: "CIA 2",
      cia2Note: "I/O, serial bus and banking.",
      ioCartLabel: "I/O / cartridge",
      ioCartNote: "Expansion cartridge range.",
      kernalRomLabel: "KERNAL ROM",
      kernalRomNote: "System ROM routines."
    },
    sidFileLabel: "SID file",
    sidFilePlaceholder: "No SID file selected",
    sidFileBrowse: "Browse SID file",
    sidCustomAddress: "Load address (override)",
    sidCustomAddressPlaceholder: "e.g. C000 (empty = from SID header)",
    blockDescriptionLabel: "Description:",
    mnemonicCardLabel: "Description",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    oledMode: "OLED mode",
    emptyState: "Drag a block here from the palette on the left.",
    memoryUsedRam: "Used RAM",
    memoryFreeRam: "Free RAM",
    memoryOrigin: "Code start",
    memoryOccupied: "used",
    memoryFreeInSegment: "Free in this RAM segment",
    memoryNoUsage: "No usage in this segment.",
    memorySensitive: "The program overlaps this sensitive range.",
    memoryUsedRange: "Used range",
    memorySegmentStatusFree: "Free RAM",
    memoryOverlapTitle: "Memory overlap",
    memoryOverlapWarning: "Warning: regions overlap!",
    memoryOverlapSingle: "overlap found",
    memoryOverlapMultiple: "overlaps found",
    memoryOverlapBytes: "byte overlap",
    memoryOverlapCode: "Code",
    memoryAxisLabel: "Full C64 memory strip",
    sampleSrOnly: "Sample program",
    languageSrOnly: "Language",
    categoryNames: {
      Adatmozgas: "Data movement",
      Aritmetika: "Arithmetic",
      Logika: "Logic",
      Ugrasok: "Branches",
      Regiszterek: "Registers",
      ShiftEsRotate: "Shift and rotate",
      Stack: "Stack",
      Rendszer: "System",
      Makrok: "Macros",
      Illegalis: "Illegal opcodes",
      Szerkezet: "Structure"
    },
    chooseDebugger: "Choose RetroDebugger",
    debuggerExecutable: "RetroDebugger executable",
    debuggerNotConfiguredPlaceholder: "Not configured",
    debuggerParamsLabel: "RetroDebugger",
    debuggerJmpLabel: "Jump to code address (-jmp)",
    debuggerWaitLabel: "Wait before tasks (-wait)",
    debuggerUnpauseLabel: "Force code running (-unpause)",
    debuggerStatusPending: "Choose the RetroDebugger executable.",
    debuggerStatusReady: "RetroDebugger ready: {path}",
    debuggerNotConfiguredMsg: "RetroDebugger is not configured. Select it in the menu first.",
    debuggerLaunchNotAvailable: "Debugger launch not available.",
    debuggerLaunched: "RetroDebugger launched.",
    debuggerLaunchFailed: "Launching RetroDebugger failed.",
    runInDebugger: "Debug",
    runInDebuggerTitle: "Run in RetroDebugger",
    breakpointToggle: "Breakpoint"
  }
};

function t(key) {
  return translations[currentLanguage]?.[key] ?? translations.hu[key] ?? key;
}

function tf(key, values = {}) {
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    t(key)
  );
}

function readUiSettings() {
  try {
    return JSON.parse(localStorage.getItem("c64-ui-settings") || "{}");
  } catch {
    return {};
  }
}

function saveUiSettings() {
  const settings = {
    category: categorySelect?.value || "",
    mnemonic: mnemonicSelect?.value || "",
    addressingMode: addressingSelect?.value || "",
    numberBase: getSelectedBase(),
    outputMode: getSelectedOutputMode(),
    zoom: blockScale,
    sample: sampleSelect?.value || "basic-colors",
    memoryPanelOpen: !!globalMemoryPanel?.open,
    basicSys: basicSysToggle ? basicSysToggle.checked : true,
    expertMode: expertMode,
    expertHlEnabled: _expertHlEnabled,
    expertPaletteSyncEnabled: _expertPaletteSyncEnabled,
    expertPaletteVisible: _expertPaletteVisible,
    expertDisasmVisible: _expertDisasmVisible,
    expertDisasmWidth: _expertDisasmWidth,
    expertMonitorVisible: _expertMonitorVisible,
    expertProjectVisible: _expertProjectVisible,
    showMacroSource,
    showRegionComments,
    blockPaletteSync,
    asmOutputBase,
    debuggerJmp,
    debuggerWait,
    debuggerWaitMs,
    debuggerUnpause
  };

  localStorage.setItem("c64-ui-settings", JSON.stringify(settings));
  savedUiSettings = settings;
  window.electronAPI?.saveUiSettingsGlobal?.(settings);
}

function getCategoryLabel(category) {
  return translations[currentLanguage]?.categoryNames?.[category] ?? category;
}

function getMemorySegmentLabel(segment) {
  return translations[currentLanguage]?.memorySegments?.[segment.labelKey] ?? segment.labelKey;
}

function getMemorySegmentNote(segment) {
  return translations[currentLanguage]?.memorySegments?.[segment.noteKey] ?? segment.noteKey;
}

const addressingModeText = {
  implied: {
    hu: { label: "Implied", help: "Az utasitas onmagaban teljes.", placeholder: "Nem kell operandus" },
    en: { label: "Implied", help: "The instruction is complete on its own.", placeholder: "No operand needed" }
  },
  immediate: {
    hu: { label: "Immediate", help: "Az ertek kozvetlen konstans, az assembler ele # jelet kap.", placeholder: "Peldaul 1 vagy 255" },
    en: { label: "Immediate", help: "The value is an inline constant prefixed with # by the assembler.", placeholder: "For example 1 or 255" }
  },
  zeroPage: {
    hu: { label: "Zero page", help: "Az operandus a zero page tartomanyban van.", placeholder: "0-255" },
    en: { label: "Zero page", help: "The operand is in the zero page range.", placeholder: "0-255" }
  },
  absolute: {
    hu: { label: "Absolute", help: "Teljes 16 bites memoriacim.", placeholder: "0-65535" },
    en: { label: "Absolute", help: "Full 16-bit memory address.", placeholder: "0-65535" }
  },
  relative: {
    hu: { label: "Relative/Label", help: "Branch utasitasnal adhatsz meg labelt vagy celt.", placeholder: "ciklus vagy 2048" },
    en: { label: "Relative/Label", help: "For branch instructions you can provide a label or target.", placeholder: "loop or 2048" }
  },
  absoluteX: {
    hu: { label: "Absolute,X", help: "16 bites memoriacim + X regiszter offset. Pl: LDA $0400,X", placeholder: "0-65535" },
    en: { label: "Absolute,X", help: "16-bit memory address + X register offset. E.g.: LDA $0400,X", placeholder: "0-65535" }
  }
};

const mnemonicDescriptionsEn = {
  LDA: "Load accumulator from memory or constant.",
  LDX: "Load X register.",
  LDY: "Load Y register.",
  STA: "Store accumulator to a memory address.",
  STX: "Store X register.",
  STY: "Store Y register.",
  ADC: "Add with carry.",
  SBC: "Subtract with carry.",
  INC: "Increment memory address.",
  DEC: "Decrement memory address.",
  CMP: "Compare with the accumulator.",
  CPX: "Compare with the X register.",
  CPY: "Compare with the Y register.",
  AND: "Logical AND with the accumulator.",
  ORA: "Logical OR with the accumulator.",
  EOR: "Exclusive OR with the accumulator.",
  BIT: "Test bits from memory.",
  JMP: "Unconditional jump to an address.",
  JSR: "Call subroutine.",
  RTS: "Return from subroutine.",
  BNE: "Branch if previous result is not zero.",
  BEQ: "Branch if previous result is zero.",
  BCC: "Branch if carry is clear.",
  BCS: "Branch if carry is set.",
  BMI: "Branch if result is negative.",
  BPL: "Branch if result is positive.",
  BVC: "Branch if overflow is clear.",
  BVS: "Branch if overflow is set.",
  RTI: "Return from interrupt.",
  TAX: "Copy accumulator into X.",
  TAY: "Copy accumulator into Y.",
  INX: "Increment X register.",
  DEX: "Decrement X register.",
  INY: "Increment Y register.",
  DEY: "Decrement Y register.",
  TSX: "Copy stack pointer into X.",
  TXA: "Copy X register into accumulator.",
  TXS: "Copy X register into stack pointer.",
  TYA: "Copy Y register into accumulator.",
  ASL: "Shift left by one bit.",
  LSR: "Shift right by one bit.",
  ROL: "Rotate left through carry.",
  ROR: "Rotate right through carry.",
  PHA: "Push accumulator to the stack.",
  PHP: "Push processor status to the stack.",
  PLA: "Pull accumulator from the stack.",
  PLP: "Pull processor status from the stack.",
  CLC: "Clear carry flag.",
  CLD: "Clear decimal flag.",
  CLI: "Re-enable interrupts.",
  CLV: "Clear overflow flag.",
  SEC: "Set carry flag.",
  SED: "Set decimal mode.",
  SEI: "Disable IRQ interrupts.",
  NOP: "No operation, just continue.",
  BRK: "Break/interrupt for debugging.",
  TEXT: "Write text to the screen.",
  BYTE: "Insert an arbitrary comma-separated byte array.",
  WORD: "Insert 16-bit values stored as LO/HI byte pairs, comma-separated.",
  FILL: "Generate repeated bytes with a specified count.",
  ALIGN: "Memory alignment. E.g., 64 → jump to next 64-byte boundary (sprite), 256 → page boundary, $2000 → bitmap.",
  TABLE: "Define a lookup table with a label and start address.",
  STRING: "Write a string to a given memory address.",
  DATA: "Write raw bytes to a given memory address via LDA/STA code.",
  RAWBYTES: "Place raw bytes at a given memory address without generating any runtime code.",
  RAWTEXT: "Place text as screen codes at a given memory address without generating any runtime code.",
  PETSCII: "Place text as PETSCII bytes at a given memory address without generating runtime code. Compatible with CHROUT ($FFD2).",
  SID: "Load a SID music file directly into memory. The header is stripped automatically and the Load/Init/Play addresses are extracted.",
  INCBIN: "Include an external binary file at a given memory address without generating any runtime code.",
  INCLUDE: "Include another project JSON file's blocks inline at this position (read-only).",
  LOOP: "Counter loop: LD* #count loads the counter, then a label marks the body start. Close with NEXT.",
  NEXT: "Loop end: DE* decrements the counter, BNE branches back to the LOOP label.",
  FOR: "Forward counting loop: LD* #0, then a label marks the body start. Close with ENDF (IN* / CP* #limit / BNE).",
  ENDF: "Forward loop end: IN* increments, CP* #limit compares, BNE branches back to the FOR label.",
  PUSH: "Save registers to the stack (A, X, Y combinations).",
  PULL: "Restore registers from the stack (A, X, Y combinations).",
  MACRO: "User macro definition start. Expects a name, close with ENDM.",
  ENDM: "User macro definition end.",
  INVOKE: "User macro invocation. Select the macro name from the list.",
  IF: "Conditional assembly start. Expects a condition (e.g. DEBUG). Close with ENDIF.",
  ELSE: "Alternative branch within an IF block.",
  ENDIF: "Conditional assembly end.",
  LAX: "Load both A and X from the same address simultaneously (illegal: LDA+LDX).",
  SAX: "Store A AND X to a memory address (illegal).",
  DCP: "Decrement memory then compare with accumulator (illegal: DEC+CMP).",
  ISC: "Increment memory then subtract from accumulator (illegal: INC+SBC).",
  SLO: "Shift memory left then OR with accumulator (illegal: ASL+ORA).",
  RLA: "Rotate memory left then AND with accumulator (illegal: ROL+AND).",
  SRE: "Shift memory right then EOR with accumulator (illegal: LSR+EOR).",
  RRA: "Rotate memory right then add with carry (illegal: ROR+ADC).",
  ANC: "AND immediate then set carry from bit 7 (illegal).",
  ALR: "AND then logical shift right in one step (illegal: AND+LSR).",
  ARR: "AND then rotate right in one step (illegal: AND+ROR).",
  AXS: "Subtract immediate from A AND X, result to X (illegal: SBX).",
  LABEL: "Named label in code for jump targets.",
  COMMENT: "Program comment that does not generate bytes.",
  SPRITE_INIT: "Initialize a sprite: set data page pointer ($07F8+N), enable bit ($D015), and color ($D027+N).",
  LOADFILE: "Load a file from disk via KERNAL SETNAM/SETLFS/LOAD. Address optional (empty = file's own load address with secondary=1; filled = override with secondary=0). Error label optional (BCS to label on carry/error).",
  SPRITE_POS: "Set sprite position: X (0–319) and Y (0–255). Handles the $D010 MSB for X > 255.",
  WAIT_RASTER: "Busy-wait for a raster line: LDA $D012 / CMP #line / BNE -7. Inline, 7 bytes, no JSR.",
  JOYSTICK: "Read joystick and move sprite: UP/DOWN/LEFT/RIGHT via LSR+BCS+DEC/INC. Port 1=$DC01, Port 2=$DC00. 27 bytes inline.",
  MOUSE: "Read 1351 proportional mouse via SID POTX/POTY ($D419/$D41A) and move sprite. The macro follows standard 1351-style 7-bit delta decoding, waits one SID conversion window after CIA port selection, uses the classic low-byte-add plus $D010 toggle pattern on X, and inverts Y for VICE. 142 bytes inline.",
  SPRITE_COL: "Sprite collision detection: LDA $D01E/$D01F + AND #bitMask. Result in A: non-zero = collision. Follow with BEQ/BNE. 5 bytes.",
  DEFINE: "Define a symbol for conditional assembly. When present, IF blocks evaluate the condition.",
  CONST: "Named constant definition. Can be used as an operand in any mnemonic (LDA, STA, JSR, etc.).",
  REGION: "Group blocks into a collapsible named section. Close with ENDREGION.",
  ENDREGION: "End of a REGION section.",
  ORG: "Set the origin address (*= directive). The following blocks are assembled starting from this address.",
  REU_CHECK: "Check if a RAM Expansion Unit (REU) is present using a $DF04 write/read probe with $55 and $AA patterns. Z=0 → REU present (use BNE), Z=1 → no REU (use BEQ). 34 bytes.",
  REU_STASH: "C64 RAM → REU transfer (save): sets C64 address, REU address/bank and length in $DF02–$DF08, then writes command $90 to $DF01 (execute + stash, immediate DMA). 40 bytes inline.",
  REU_FETCH: "REU → C64 RAM transfer (load): sets C64 address, REU address/bank and length in $DF02–$DF08, then writes command $91 to $DF01 (execute + fetch, immediate DMA). 40 bytes inline.",
  REU_SWAP: "C64 RAM ↔ REU swap: sets C64 address, REU address/bank and length in $DF02–$DF08, then writes command $92 to $DF01 (execute + swap, immediate DMA). 40 bytes inline.",
  TURBO_SET: "Set U64 turbo speed: writes speed index (0–15) and badline control (bit 7) to $D031. LDA #value + STA $D031, 5 bytes. Speed 0=1 MHz … 7=10 MHz … 15=48 MHz (U64) / 64 MHz (U64E2).",
  SUPERCPU_DETECT: "Detect CMD SuperCPU presence: LDA $D0B8 / CMP #$FF. Z=0 → SuperCPU present (use BNE), Z=1 → not found (use BEQ). 5 bytes.",
  TURBO_ENABLE: "CMD SuperCPU turbo on/off: ON → LDA #$00 / STA $D07A, OFF → LDA #$00 / STA $D07B. 5 bytes."
};

const mnemonicDescriptionsHu = (() => {
  const map = {};
  for (const items of Object.values(mnemonicLibrary)) {
    for (const item of items) {
      if (item.mnemonic && item.description) map[item.mnemonic] = item.description;
    }
  }
  return map;
})();

function modeText(modeKey, field) {
  return addressingModeText[modeKey]?.[currentLanguage]?.[field] ?? addressingModes[modeKey]?.[field] ?? "";
}

function getItemDescription(item) {
  return currentLanguage === "en"
    ? mnemonicDescriptionsEn[item.mnemonic] || item.description
    : item.description;
}

const opcodeMap = {
  LDA: { immediate: 0xA9, zeroPage: 0xA5, zeroPageX: 0xB5, absolute: 0xAD, absoluteX: 0xBD, absoluteY: 0xB9, indirectX: 0xA1, indirectY: 0xB1 },
  LDX: { immediate: 0xA2, zeroPage: 0xA6, zeroPageY: 0xB6, absolute: 0xAE, absoluteY: 0xBE },
  LDY: { immediate: 0xA0, zeroPage: 0xA4, zeroPageX: 0xB4, absolute: 0xAC, absoluteX: 0xBC },
  STA: { zeroPage: 0x85, zeroPageX: 0x95, absolute: 0x8D, absoluteX: 0x9D, absoluteY: 0x99, indirectX: 0x81, indirectY: 0x91 },
  STX: { zeroPage: 0x86, zeroPageY: 0x96, absolute: 0x8E },
  STY: { zeroPage: 0x84, zeroPageX: 0x94, absolute: 0x8C },
  ADC: { immediate: 0x69, zeroPage: 0x65, zeroPageX: 0x75, absolute: 0x6D, absoluteX: 0x7D, absoluteY: 0x79, indirectX: 0x61, indirectY: 0x71 },
  SBC: { immediate: 0xE9, zeroPage: 0xE5, zeroPageX: 0xF5, absolute: 0xED, absoluteX: 0xFD, absoluteY: 0xF9, indirectX: 0xE1, indirectY: 0xF1 },
  INC: { zeroPage: 0xE6, zeroPageX: 0xF6, absolute: 0xEE, absoluteX: 0xFE },
  DEC: { zeroPage: 0xC6, zeroPageX: 0xD6, absolute: 0xCE, absoluteX: 0xDE },
  CMP: { immediate: 0xC9, zeroPage: 0xC5, zeroPageX: 0xD5, absolute: 0xCD, absoluteX: 0xDD, absoluteY: 0xD9, indirectX: 0xC1, indirectY: 0xD1 },
  CPX: { immediate: 0xE0, zeroPage: 0xE4, absolute: 0xEC },
  CPY: { immediate: 0xC0, zeroPage: 0xC4, absolute: 0xCC },
  AND: { immediate: 0x29, zeroPage: 0x25, zeroPageX: 0x35, absolute: 0x2D, absoluteX: 0x3D, absoluteY: 0x39, indirectX: 0x21, indirectY: 0x31 },
  ORA: { immediate: 0x09, zeroPage: 0x05, zeroPageX: 0x15, absolute: 0x0D, absoluteX: 0x1D, absoluteY: 0x19, indirectX: 0x01, indirectY: 0x11 },
  EOR: { immediate: 0x49, zeroPage: 0x45, zeroPageX: 0x55, absolute: 0x4D, absoluteX: 0x5D, absoluteY: 0x59, indirectX: 0x41, indirectY: 0x51 },
  BIT: { zeroPage: 0x24, absolute: 0x2C },
  JMP: { absolute: 0x4C, indirect: 0x6C },
  JSR: { absolute: 0x20 },
  RTS: { implied: 0x60 },
  BNE: { relative: 0xD0 },
  BEQ: { relative: 0xF0 },
  BCC: { relative: 0x90 },
  BCS: { relative: 0xB0 },
  BMI: { relative: 0x30 },
  BPL: { relative: 0x10 },
  BVC: { relative: 0x50 },
  BVS: { relative: 0x70 },
  RTI: { implied: 0x40 },
  TAX: { implied: 0xAA },
  TAY: { implied: 0xA8 },
  INX: { implied: 0xE8 },
  DEX: { implied: 0xCA },
  INY: { implied: 0xC8 },
  DEY: { implied: 0x88 },
  TSX: { implied: 0xBA },
  TXA: { implied: 0x8A },
  TXS: { implied: 0x9A },
  TYA: { implied: 0x98 },
  ASL: { implied: 0x0A, zeroPage: 0x06, zeroPageX: 0x16, absolute: 0x0E, absoluteX: 0x1E },
  LSR: { implied: 0x4A, zeroPage: 0x46, zeroPageX: 0x56, absolute: 0x4E, absoluteX: 0x5E },
  ROL: { implied: 0x2A, zeroPage: 0x26, zeroPageX: 0x36, absolute: 0x2E, absoluteX: 0x3E },
  ROR: { implied: 0x6A, zeroPage: 0x66, zeroPageX: 0x76, absolute: 0x6E, absoluteX: 0x7E },
  PHA: { implied: 0x48 },
  PHP: { implied: 0x08 },
  PLA: { implied: 0x68 },
  PLP: { implied: 0x28 },
  CLC: { implied: 0x18 },
  CLD: { implied: 0xD8 },
  CLI: { implied: 0x58 },
  CLV: { implied: 0xB8 },
  SEC: { implied: 0x38 },
  SED: { implied: 0xF8 },
  SEI: { implied: 0x78 },
  NOP: { implied: 0xEA },
  BRK: { implied: 0x00 },
  LAX: { immediate: 0xAB, zeroPage: 0xA7, absolute: 0xAF },
  SAX: { zeroPage: 0x87, absolute: 0x8F },
  DCP: { zeroPage: 0xC7, absolute: 0xCF, absoluteX: 0xDF },
  ISC: { zeroPage: 0xE7, absolute: 0xEF, absoluteX: 0xFF },
  SLO: { zeroPage: 0x07, absolute: 0x0F, absoluteX: 0x1F },
  RLA: { zeroPage: 0x27, absolute: 0x2F, absoluteX: 0x3F },
  SRE: { zeroPage: 0x47, absolute: 0x4F, absoluteX: 0x5F },
  RRA: { zeroPage: 0x67, absolute: 0x6F, absoluteX: 0x7F },
  ANC: { immediate: 0x0B },
  ALR: { immediate: 0x4B },
  ARR: { immediate: 0x6B },
  AXS: { immediate: 0xCB }
};

const kernalRoutines = [
  { addr: "$FFD2", name: "CHROUT",  hu: "Karakter kiirasa kepernyore/eszkozre (A=kar)",        en: "Print character to screen/device (A=char)" },
  { addr: "$FFCF", name: "CHRIN",   hu: "Karakter beolvasasa (blokkolO, A=kar)",                en: "Read character, blocking (A=char)" },
  { addr: "$FFE4", name: "GETIN",   hu: "Billentyu beolvasasa (nem blokkolO, A=kar/0)",         en: "Get key from keyboard, non-blocking (A=key/0)" },
  { addr: "$FFE1", name: "STOP",    hu: "STOP gomb ellenorzese (Z=1 ha lenyomva)",              en: "Check STOP key (Z=1 if pressed)" },
  { addr: "$FFCC", name: "CLRCHN",  hu: "I/O csatornak alaphelyzetbe allitasa",                 en: "Reset I/O channels to defaults" },
  { addr: "$FFC3", name: "SETLFS",  hu: "Logikai fajl beallitasa (A=LA, X=eszkoz, Y=SA)",      en: "Set logical file (A=LA, X=device, Y=SA)" },
  { addr: "$FFBD", name: "SETNAM",  hu: "Fajlnev beallitasa (A=hossz, XY=cim)",                en: "Set filename (A=length, XY=address)" },
  { addr: "$FFD5", name: "LOAD",    hu: "Program betoltese eszkozrol (A=0/1)",                  en: "Load file from device (A=0/1)" },
  { addr: "$FFD8", name: "SAVE",    hu: "Memoria mentese eszkozre",                             en: "Save memory to device" },
  { addr: "$FF9F", name: "SCNKEY",  hu: "Billentyuzet pasztazasa (frissiti a puffert)",         en: "Scan keyboard (updates key buffer)" },
  { addr: "$FF99", name: "MEMTOP",  hu: "Memoria csucs olvasasa/irasa (XY=cim, C=0 iras)",     en: "Read/write memory top (XY=addr, C=0 write)" },
  { addr: "$FF9C", name: "MEMBOT",  hu: "Memoria aljanak olvasasa/irasa (XY=cim, C=0 iras)",   en: "Read/write memory bottom (XY=addr, C=0 write)" },
  { addr: "$FFDE", name: "RDTIM",   hu: "Rendszerora beolvasasa (AXY=ido)",                     en: "Read system clock (AXY=time)" },
  { addr: "$FFDB", name: "SETTIM",  hu: "Rendszerora beallitasa (AXY=ido)",                     en: "Set system clock (AXY=time)" },
  { addr: "$FF81", name: "CINT",    hu: "Kepernyoszerkeszto inicializalasa",                    en: "Initialize screen editor" },
  { addr: "$FF84", name: "IOINIT",  hu: "I/O eszkozok inicializalasa",                          en: "Initialize I/O devices" },
  { addr: "$FF8A", name: "RESTOR",  hu: "Alapertelmezett I/O vektorok visszaallitasa",          en: "Restore default I/O vectors" },
  { addr: "$E544", name: "CLRSCR",  hu: "Kepernyotorlese (nem hivatalos KERNAL vektor)",        en: "Clear screen (unofficial KERNAL vector)" },
  { addr: "$E50C", name: "PLOT",    hu: "Kurzor pozicio olvasasa/beallitasa (XY=sor/oszlop)",   en: "Get/set cursor position (XY=row/col)" },
];

const memorySegments = [
  { start: 0x0000, end: 0x00FF, labelKey: "zeroPageLabel", noteKey: "zeroPageNote", kind: "ram" },
  { start: 0x0100, end: 0x01FF, labelKey: "stackLabel", noteKey: "stackNote", kind: "ram" },
  { start: 0x0200, end: 0x07FF, labelKey: "systemRamLabel", noteKey: "systemRamNote", kind: "ram" },
  { start: 0x0800, end: 0x9FFF, labelKey: "basicRamLabel", noteKey: "basicRamNote", kind: "ram" },
  { start: 0xA000, end: 0xBFFF, labelKey: "basicRomLabel", noteKey: "basicRomNote", kind: "rom" },
  { start: 0xC000, end: 0xCFFF, labelKey: "freeRamLabel", noteKey: "freeRamNote", kind: "ram" },
  { start: 0xD000, end: 0xD3FF, labelKey: "vicLabel", noteKey: "vicNote", kind: "io" },
  { start: 0xD400, end: 0xD7FF, labelKey: "sidLabel", noteKey: "sidNote", kind: "io" },
  { start: 0xD800, end: 0xDBFF, labelKey: "colorRamLabel", noteKey: "colorRamNote", kind: "io" },
  { start: 0xDC00, end: 0xDCFF, labelKey: "cia1Label", noteKey: "cia1Note", kind: "io" },
  { start: 0xDD00, end: 0xDDFF, labelKey: "cia2Label", noteKey: "cia2Note", kind: "io" },
  { start: 0xDE00, end: 0xDFFF, labelKey: "ioCartLabel", noteKey: "ioCartNote", kind: "io" },
  { start: 0xE000, end: 0xFFFF, labelKey: "kernalRomLabel", noteKey: "kernalRomNote", kind: "rom" }
];

function initPalette() {
  const categories = Object.keys(mnemonicLibrary);
  categorySelect.innerHTML = categories
      .map((category) => `<option value="${category}">${getCategoryLabel(category)}</option>`)
      .join("");
  categorySelect.value = savedUiSettings.category || categories[0] || "";
  if (!categories.includes(categorySelect.value)) {
    categorySelect.value = categories[0] || "";
  }

  paletteSearchInput.addEventListener("input", () => {
    renderSearchResults(paletteSearchInput.value);
  });
  paletteSearchInput.addEventListener("search", () => {
    renderSearchResults(paletteSearchInput.value);
  });

  categorySelect.addEventListener("change", () => {
    syncMnemonicMenu();
    saveUiSettings();
  });
  mnemonicSelect.addEventListener("change", () => {
    syncAddressingModes();
    saveUiSettings();
  });
  operandInput.addEventListener("input", renderMnemonicDescription);
  addressingSelect.addEventListener("change", () => {
    handleAddressingChange();
    saveUiSettings();
  });
  baseInputs.forEach((input) => input.addEventListener("change", handleBaseChange));
  document.querySelectorAll(".theme-option").forEach(btn => {
    btn.addEventListener("click", () => {
      setTheme(btn.dataset.themeOpt);
    });
  });
  document.addEventListener("click", e => {
    const picker = document.getElementById("theme-picker");
    if (picker?.open && !picker.contains(e.target)) picker.removeAttribute("open");
  });

  // Position theme-picker panel as fixed popup relative to the summary button
  document.getElementById("theme-picker")?.addEventListener("toggle", (e) => {
    const panel = document.querySelector(".theme-picker-panel");
    if (!panel) return;
    if (e.newState === "open") {
      const summaryRect = document.getElementById("theme-toggle")?.getBoundingClientRect();
      if (summaryRect) {
        const panelW = 160;
        let left = summaryRect.left;
        // Keep inside viewport
        if (left + panelW > window.innerWidth - 8) left = window.innerWidth - panelW - 8;
        if (left < 8) left = 8;
        let top = summaryRect.bottom + 6;
        // If would go off bottom, open upward
        const estH = 140;
        if (top + estH > window.innerHeight - 8) top = summaryRect.top - estH - 6;
        panel.style.top  = top + "px";
        panel.style.left = left + "px";
      }
    }
  });
  document.getElementById("crt-toggle")?.addEventListener("click", toggleCrtMode);
  languageSelect.addEventListener("change", handleLanguageChange);
  aboutButton?.addEventListener("click", async () => {
    document.querySelector(".control-menu")?.removeAttribute("open");
    const version = await window.electronAPI.getAppVersion();
    document.getElementById("about-version").textContent = `v${version}`;
    const dlg = document.getElementById("about-dialog");
    dlg?.querySelectorAll("a[href^='mailto:']").forEach(a => {
      a.addEventListener("click", e => { e.preventDefault(); window.electronAPI.openExternal(a.href); }, { once: true });
    });
    dlg?.showModal();
  });
  helpManualButton?.addEventListener("click", () => {
    window.electronAPI?.openManual();
  });
  checkUpdateButton?.addEventListener("click", () => {
    window.electronAPI.openExternal("https://zstarczali.itch.io/visual-assembler-commodore-64");
  });
  reportBugButton?.addEventListener("click", async () => {
    const version = await window.electronAPI.getAppVersion();
    const ua = navigator.userAgent;
    const os = ua.includes("Win") ? "Windows" : ua.includes("Mac") ? "macOS" : ua.includes("Linux") ? "Linux" : navigator.platform || "Unknown";
    const subject = encodeURIComponent(`Visual Assembler v${version} - Bug Report`);
    const body = encodeURIComponent(`Visual Assembler version: v${version}\nOS: ${os}\n\n--- Describe the bug ---\n\n\n--- Steps to reproduce ---\n\n`);
    window.electronAPI.openExternal(`mailto:retroboj@outlook.com?subject=${subject}&body=${body}`);
  });
  basicSysToggle?.addEventListener("change", () => {
    saveUiSettings();
    renderEmulatorRunHint();
    renderOriginPreview();
    renderExpertOriginInfo();
  });

  expertModeToggle?.addEventListener("change", () => {
    setExpertMode(expertModeToggle.checked);
  });

  expertHlToggleBtn?.addEventListener("click", () => {
    _expertHlEnabled = !_expertHlEnabled;
    expertHlToggleBtn.classList.toggle("expert-hl-toggle--on", _expertHlEnabled);
    expertHlToggleBtn.setAttribute("aria-pressed", String(_expertHlEnabled));
    _expertApplyHighlight();
    saveUiSettings();
  });

  expertPaletteBtn?.addEventListener("click", () => {
    _expertPaletteVisible = !_expertPaletteVisible;
    expertPaletteBtn.classList.toggle("expert-hl-toggle--on", _expertPaletteVisible);
    expertPaletteBtn.setAttribute("aria-pressed", String(_expertPaletteVisible));
    document.body.classList.toggle("expert-show-palette", _expertPaletteVisible);
    saveUiSettings();
  });

  expertPaletteSyncBtn?.addEventListener("click", () => {
    _expertPaletteSyncEnabled = !_expertPaletteSyncEnabled;
    expertPaletteSyncBtn.classList.toggle("expert-hl-toggle--on", _expertPaletteSyncEnabled);
    expertPaletteSyncBtn.setAttribute("aria-pressed", String(_expertPaletteSyncEnabled));
    saveUiSettings();
  });

  expertDisasmBtn?.addEventListener("click", () => {
    _expertDisasmVisible = !_expertDisasmVisible;
    expertDisasmBtn.classList.toggle("expert-hl-toggle--on", _expertDisasmVisible);
    expertDisasmBtn.setAttribute("aria-pressed", String(_expertDisasmVisible));
    if (_expertDisasmVisible) {
      expertDisasmPanel?.removeAttribute("hidden");
      expertDisasmResizer?.removeAttribute("hidden");
      expertDisasmPanel.style.width = `${_expertDisasmWidth}px`;
      _expertRenderDisasm();
    } else {
      expertDisasmPanel?.setAttribute("hidden", "");
      expertDisasmResizer?.setAttribute("hidden", "");
    }
    saveUiSettings();
  });

  if (expertDisasmResizer) {
    expertDisasmResizer.addEventListener("mousedown", (e) => {
      e.preventDefault();
      const startX     = e.clientX;
      const startWidth = _expertDisasmWidth;
      expertDisasmResizer.classList.add("dragging");
      const onMove = (ev) => {
        const delta = startX - ev.clientX;          // drag left → panel grows
        const minW  = 180;
        const maxW  = window.innerWidth * 0.6;
        _expertDisasmWidth = Math.max(minW, Math.min(maxW, startWidth + delta));
        if (expertDisasmPanel) expertDisasmPanel.style.width = `${_expertDisasmWidth}px`;
      };
      const onUp = () => {
        expertDisasmResizer.classList.remove("dragging");
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        saveUiSettings();
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
  }

  expertMonitorBtn?.addEventListener("click", () => {
    _expertMonitorVisible = !_expertMonitorVisible;
    expertMonitorBtn.classList.toggle("expert-hl-toggle--on", _expertMonitorVisible);
    expertMonitorBtn.setAttribute("aria-pressed", String(_expertMonitorVisible));
    if (_expertMonitorVisible) {
      expertMonitorPanel?.removeAttribute("hidden");
      _expertRenderMonitor();
    } else {
      expertMonitorPanel?.setAttribute("hidden", "");
    }
    saveUiSettings();
  });

  expertFormatBtn?.addEventListener("click", _expertFormatSource);
  expertLoadAsmBtn?.addEventListener("click", _expertLoadAsm);
  expertSaveAsmBtn?.addEventListener("click", _expertSaveAsm);
  expertBuildInfoBtn?.addEventListener("click", showBuildInfoDialog);
  buildInfoBtn?.addEventListener("click", showBuildInfoDialog);

  // Build info dialog close
  document.getElementById("build-info-close")?.addEventListener("click", () => {
    document.getElementById("build-info-dialog")?.close();
  });
  document.getElementById("build-info-dialog")?.addEventListener("click", (e) => {
    if (e.target === document.getElementById("build-info-dialog"))
      document.getElementById("build-info-dialog").close();
  });

  expertProjectBtn?.addEventListener("click", () => {
    _expertProjectVisible = !_expertProjectVisible;
    expertProjectBtn.classList.toggle("expert-hl-toggle--on", _expertProjectVisible);
    expertProjectBtn.setAttribute("aria-pressed", String(_expertProjectVisible));
    if (_expertProjectVisible) {
      expertProjectPanel?.removeAttribute("hidden");
      _expertRenderProjectTree();
    } else {
      expertProjectPanel?.setAttribute("hidden", "");
    }
    saveUiSettings();
  });

  document.getElementById("expert-project-open-btn")?.addEventListener("click", _expertOpenProject);
  document.getElementById("expert-project-new-btn")?.addEventListener("click",  _expertNewProject);
  document.getElementById("expert-project-save-btn")?.addEventListener("click", _expertSaveProject);
  document.getElementById("expert-project-add-btn")?.addEventListener("click",  _expertAddProjMember);

  expertEditor?.addEventListener("input", () => {
    markTabDirty();
    _expertValidate();
    renderExpertOriginInfo();
    _expertAcUpdate();
  });

  expertEditor?.addEventListener("keydown", (e) => {
    // Autocomplete navigation
    if (_expertAcVisible()) {
      if (e.key === "ArrowDown")  { e.preventDefault(); _expertAcMove(1);  return; }
      if (e.key === "ArrowUp")    { e.preventDefault(); _expertAcMove(-1); return; }
      if (e.key === "Enter" || e.key === "Tab") {
        if (_expertAcCommit()) { e.preventDefault(); return; }
      }
      if (e.key === "Escape")     { _expertAcHide(); return; }
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = expertEditor;
      const start = ta.selectionStart;
      const end   = ta.selectionEnd;
      ta.value = ta.value.slice(0, start) + "  " + ta.value.slice(end);
      ta.selectionStart = ta.selectionEnd = start + 2;
      _expertApplyHighlight();
      _expertValidate();
    }
  });
  expertEditor?.addEventListener("keyup",   _expertUpdateCursor);
  expertEditor?.addEventListener("click",   _expertUpdateCursor);

  expertEditor?.addEventListener("scroll", () => {
    if (expertHlCode) {
      expertHlCode.style.transform =
        `translate(${-expertEditor.scrollLeft}px, ${-expertEditor.scrollTop}px)`;
    }
    const _regionBg = document.getElementById("expert-region-bg");
    if (_regionBg && !_regionBg.hidden) {
      _regionBg.style.transform = `translateY(${-expertEditor.scrollTop}px)`;
    }
    _expertAcHide();
  });
  aboutCloseButton?.addEventListener("click", () => aboutDialog?.close());
  whatsNewButton?.addEventListener("click", () => {
    document.querySelector(".control-menu")?.removeAttribute("open");
    whatsNewDialog?.showModal();
  });
  whatsNewCloseButton?.addEventListener("click", () => whatsNewDialog?.close());
  knowledgeBaseButton?.addEventListener("click", () => {
    document.querySelector(".control-menu")?.removeAttribute("open");
    knowledgeBaseDialog?.showModal();
  });
  knowledgeBaseCloseButton?.addEventListener("click", () => knowledgeBaseDialog?.close());
  knowledgeBaseDialog?.addEventListener("click", (e) => { if (e.target === knowledgeBaseDialog) knowledgeBaseDialog.close(); });
  knowledgeBaseDialog?.querySelectorAll(".knowledge-base-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const url = link.dataset.url;
      if (url) window.electronAPI.openExternal(url);
    });
  });
  exitAppButton?.addEventListener("click", () => window.electronAPI.quitApp());
  setupOperandDropdown();
  setupD64ExportDialog();

  // Menu open/close animation
  const controlMenu = document.querySelector(".control-menu");
  const controlMenuPanel = document.querySelector(".control-menu-panel");
  let menuClosing = false;

  // Exposed helper so toolbar buttons outside the panel can also close with animation
  window._closeControlMenu = function(onDone) {
    if (_tourMenuOpened && !_tourAllowOverlayClose) { onDone?.(); return; }
    if (!controlMenu?.open) { onDone?.(); return; }
    if (menuClosing) { onDone?.(); return; }
    menuClosing = true;
    controlMenuPanel?.classList.add("menu-closing");
    controlMenuPanel?.addEventListener("animationend", () => {
      controlMenuPanel.classList.remove("menu-closing");
      menuClosing = false;
      controlMenu.removeAttribute("open");
      onDone?.();
    }, { once: true });
  };
  controlMenu?.querySelector("summary")?.addEventListener("click", (e) => {
    if (_tourMenuOpened && !_tourAllowOverlayClose) {
      e.preventDefault();
      return;
    }
    if (menuClosing) return;
    if (controlMenu.open) {
      // Intercept close: animate first, then remove open
      e.preventDefault();
      menuClosing = true;
      controlMenuPanel?.classList.add("menu-closing");
      controlMenuPanel?.addEventListener("animationend", () => {
        controlMenuPanel.classList.remove("menu-closing");
        menuClosing = false;
        controlMenu.removeAttribute("open");
      }, { once: true });
    } else {
      // Opening: add opening class
      controlMenuPanel?.classList.add("menu-opening");
    }
  });
  controlMenuPanel?.addEventListener("animationend", (e) => {
    if (e.animationName === "menuOpen") {
      controlMenuPanel.classList.remove("menu-opening");
    }
  });

  // Close menu when any button/link inside the panel is clicked
  controlMenuPanel?.addEventListener("click", (e) => {
    const target = e.target.closest("button, a, .run-mode-item");
    if (!target || !controlMenu.open) return;
    if (_tourMenuOpened && !_tourAllowOverlayClose) return;
    // Don't close when interacting with the theme picker
    if (e.target.closest("#theme-picker")) return;
    // Don't close when using zoom buttons
    if (e.target.closest("#zoom-in, #zoom-out")) return;
    // Don't close when toggling CRT mode
    if (e.target.closest("#crt-toggle")) return;
    // Small delay so the button's own handler can fire first
    setTimeout(() => { controlMenu.removeAttribute("open"); }, 80);
  });

  // Close menu when clicking outside of it (with closing animation)
  // Only fires for clicks truly outside — toolbar buttons outside the menu
  // use window._closeControlMenu() directly.
  document.addEventListener("click", (e) => {
    if (!controlMenu?.open) return;
    if (_tourMenuOpened && !_tourAllowOverlayClose) return;
    if (controlMenu.contains(e.target)) return;
    // If target is a button that calls _closeControlMenu itself, skip
    if (e.target.closest("[data-closes-menu]")) return;
    window._closeControlMenu();
  });

  sampleSelect?.addEventListener("change", saveUiSettings);
  loadSampleButton.addEventListener("click", () => {
    const ok = loadSelectedSample();
    if (ok !== false) document.querySelector(".control-menu")?.removeAttribute("open");
  });
  saveProjectButton?.addEventListener("click", async () => {
    await saveProjectToFile();
    document.querySelector(".control-menu")?.removeAttribute("open");
  });
  document.getElementById("menu-open-project")?.addEventListener("click", async () => {
    await _openProjectFromMenu();
    document.querySelector(".control-menu")?.removeAttribute("open");
  });
  document.getElementById("menu-save-project")?.addEventListener("click", async () => {
    await _expertSaveProject();
    document.querySelector(".control-menu")?.removeAttribute("open");
  });
  document.getElementById("menu-close-project")?.addEventListener("click", async () => {
    await _closeProject();
    document.querySelector(".control-menu")?.removeAttribute("open");
  });
  savePrgButton?.addEventListener("click", savePrgToFile);
  saveD64Button?.addEventListener("click", saveD64ToFile);

  // Global Ctrl+S / Cmd+S — works in both block mode and expert mode
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      saveProjectToFile().then(() => {
        markTabClean();
        if (expertMode) {
          _expertSetStatus(currentLanguage === "en" ? "Saved ✓" : "Mentve ✓", "ok");
          setTimeout(() => _expertValidate(), 1800);
        } else if (emulatorStatus) {
          const prev = emulatorStatus.textContent;
          emulatorStatus.textContent = currentLanguage === "en" ? "Saved ✓" : "Mentve ✓";
          setTimeout(() => { if (emulatorStatus.textContent.includes("✓")) emulatorStatus.textContent = prev; }, 1800);
        }
      });
    }
  });
  loadProjectButton?.addEventListener("click", async () => {
    const ok = await loadProjectFromFile();
    if (ok) document.querySelector(".control-menu")?.removeAttribute("open");
  });
  zoomOutButton.addEventListener("click", () => adjustZoom(-0.08));
  zoomInButton.addEventListener("click", () => adjustZoom(0.08));
  outputModeInputs.forEach((input) => input.addEventListener("change", renderOutputMode));
  compileErrorClose?.addEventListener("click", () => compileErrorDialog?.close());
  compileErrorDialog?.addEventListener("click", (e) => { if (e.target === compileErrorDialog) compileErrorDialog.close(); });

  document.getElementById("new-program-confirm")?.addEventListener("click", () => {
    document.getElementById("new-program-dialog")?.close();
    doClearProgram();
  });
  document.getElementById("new-program-cancel")?.addEventListener("click", () => {
    document.getElementById("new-program-dialog")?.close();
  });
  macroSourceToggle?.addEventListener("change", () => {
    showMacroSource = macroSourceToggle.checked;
    saveUiSettings();
    renderAsmOutput();
  });
  regionCommentsToggle?.addEventListener("change", () => {
    showRegionComments = regionCommentsToggle.checked;
    saveUiSettings();
    renderAsmOutput();
  });
  blockPaletteSyncToggle?.addEventListener("change", () => {
    blockPaletteSync = blockPaletteSyncToggle.checked;
    saveUiSettings();
  });
  addSelectedButton.addEventListener("click", addSelectedBlock);
  clearProgramButton.addEventListener("click", clearProgram);
  collapseAllButton.addEventListener("click", collapseAllBlocks);
  expandAllButton.addEventListener("click", expandAllBlocks);
  copyAsmButton?.addEventListener("click", () => {
    document.querySelector(".control-menu")?.removeAttribute("open");
    copyAsmToClipboard();
  });
  chooseViceButton?.addEventListener("click", chooseViceExecutable);
  runEmulatorButton?.addEventListener("click", () => {
    if (runMode === "d64") runViaD64();
    else if (runMode === "ultimate") runOnUltimate();
    else if (runMode === "ultimate-d64") runUltimateD64();
    else runInEmulator();
  });
  setupRunModeDropdown();
  setupHardwareSettingsDialog();
  setupUltimateSettings();
  chooseDebuggerButton?.addEventListener("click", chooseDebuggerExecutable);
  runDebuggerButton?.addEventListener("click", runInDebugger);
  dbgJmp?.addEventListener("change", () => { debuggerJmp = dbgJmp.checked; saveUiSettings(); });
  dbgWait?.addEventListener("change", () => { debuggerWait = dbgWait.checked; saveUiSettings(); });
  dbgUnpause?.addEventListener("change", () => { debuggerUnpause = dbgUnpause.checked; saveUiSettings(); });
  globalMemoryPanel?.addEventListener("toggle", saveUiSettings);

  applySavedTheme();
  applySavedCrtMode();
  applySavedLanguage();
  applySavedUiSettings();
  applyTranslations();
  applyZoom();
  updateEmulatorStatus();
  setupProgramDropZone();
  setupMouseDnd();
  syncMnemonicMenu();
  renderOutputMode();
  renderMemoryStrip();
  loadViceConfig();
  loadDebuggerConfig();
  saveUiSettings();

  // Populate version on splash screen
  window.electronAPI.getAppVersion().then(version => {
    const splashVersion = document.getElementById('splash-version');
    if (splashVersion) splashVersion.textContent = `v${version}`;
  });

  // Hide splash screen after initialization
  setTimeout(() => {
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
      splashScreen.classList.add('fade-out');
      setTimeout(() => {
        splashScreen.remove();
      }, 500);
    }
  }, 2000);

  document.addEventListener("contextmenu", e => {
    const tag = e.target.tagName;
    if (tag !== "INPUT" && tag !== "TEXTAREA") e.preventDefault();
    // Block context menu in block mode
    if (!expertMode) {
      const blockEl = e.target.closest(".asm-block");
      if (blockEl && blockEl.dataset.index !== undefined) {
        _showBlockCtxMenu(e, parseInt(blockEl.dataset.index, 10));
      } else {
        _hideBlockCtxMenu();
      }
    }
  });

  // Close context menu on any click outside
  document.addEventListener("click", e => {
    if (!e.target.closest("#block-ctx-menu")) _hideBlockCtxMenu();
  }, true);
}

function _showBlockCtxMenu(e, index) {
  let menu = document.getElementById("block-ctx-menu");
  if (!menu) {
    menu = document.createElement("div");
    menu.id = "block-ctx-menu";
    menu.className = "block-ctx-menu";
    document.body.appendChild(menu);
  }
  const block = program[index];
  if (!block) return;
  const isRegion = block.isRegionMacro;
  const isCopiedRegion = Array.isArray(_copiedBlock);
  const hu = currentLanguage === "hu";
  menu.innerHTML = `
    <button class="block-ctx-item" data-action="copy">
      <svg viewBox="0 0 16 16" fill="none" width="13" height="13" aria-hidden="true"><rect x="4" y="4" width="9" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3"/><rect x="2" y="2" width="9" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3" fill="var(--bg)"/></svg>
      ${isRegion ? (hu ? "Régió másolása" : "Copy region") : (hu ? "Másolás" : "Copy")}
    </button>
    <button class="block-ctx-item" data-action="cut">
      <svg viewBox="0 0 16 16" fill="none" width="13" height="13" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/><circle cx="4" cy="12" r="2" stroke="currentColor" stroke-width="1.2"/><circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="1.2"/></svg>
      ${isRegion ? (hu ? "Régió kivágása" : "Cut region") : (hu ? "Kivágás" : "Cut")}
    </button>
    <button class="block-ctx-item${_copiedBlock ? "" : " block-ctx-item--disabled"}" data-action="paste-before">
      <svg viewBox="0 0 16 16" fill="none" width="13" height="13" aria-hidden="true"><rect x="3" y="5" width="10" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M6 5V3.5A0.5 0.5 0 016.5 3h3a0.5 0.5 0 01.5.5V5" stroke="currentColor" stroke-width="1.1"/><path d="M8 8v4M6 10h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
      ${isCopiedRegion ? (hu ? "Régió beillesztése elé" : "Paste region before") : (hu ? "Beillesztés elé" : "Paste before")}
    </button>
    <button class="block-ctx-item${_copiedBlock ? "" : " block-ctx-item--disabled"}" data-action="paste-after">
      <svg viewBox="0 0 16 16" fill="none" width="13" height="13" aria-hidden="true"><rect x="3" y="5" width="10" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M6 5V3.5A0.5 0.5 0 016.5 3h3a0.5 0.5 0 01.5.5V5" stroke="currentColor" stroke-width="1.1"/><path d="M8 8v4M6 10h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/></svg>
      ${isCopiedRegion ? (hu ? "Régió beillesztése után" : "Paste region after") : (hu ? "Beillesztés után" : "Paste after")}
    </button>
    <button class="block-ctx-item" data-action="duplicate">
      <svg viewBox="0 0 16 16" fill="none" width="13" height="13" aria-hidden="true"><rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3"/><rect x="2" y="2" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3" fill="var(--bg)"/></svg>
      ${isRegion ? (hu ? "Régió duplikálása" : "Duplicate region") : (hu ? "Duplikálás" : "Duplicate")}
    </button>
    <div class="block-ctx-sep"></div>
    <button class="block-ctx-item block-ctx-item--danger" data-action="delete">
      <svg viewBox="0 0 16 16" fill="none" width="13" height="13" aria-hidden="true"><path d="M3 5h10M6 5V3.5A.5.5 0 016.5 3h3a.5.5 0 01.5.5V5M7 8v4M9 8v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><rect x="4" y="5" width="8" height="9" rx="1" stroke="currentColor" stroke-width="1.2"/></svg>
      ${hu ? "Törlés" : "Delete"}
    </button>
  `;
  menu.dataset.blockIndex = index;
  menu.querySelectorAll(".block-ctx-item").forEach(btn => {
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (btn.classList.contains("block-ctx-item--disabled")) return;
      const action = btn.dataset.action;
      const idx = parseInt(menu.dataset.blockIndex, 10);
      _handleBlockCtxAction(action, idx);
      _hideBlockCtxMenu();
    });
  });

  // Position: render off-screen first to measure actual height
  menu.style.visibility = "hidden";
  menu.style.left = "0px";
  menu.style.top  = "0px";
  menu.removeAttribute("hidden");
  const menuW = menu.offsetWidth || 180;
  const menuH = menu.offsetHeight || 230;
  let x = e.clientX, y = e.clientY;
  if (x + menuW > window.innerWidth - 8) x = window.innerWidth - menuW - 8;
  if (y + menuH > window.innerHeight - 8) y = window.innerHeight - menuH - 8;
  if (x < 8) x = 8;
  if (y < 8) y = 8;
  menu.style.left = x + "px";
  menu.style.top  = y + "px";
  menu.style.visibility = "";
}

function _hideBlockCtxMenu() {
  const menu = document.getElementById("block-ctx-menu");
  if (menu) menu.setAttribute("hidden", "");
}

function _handleBlockCtxAction(action, index) {
  const block = program[index];
  if (!block) return;

  // Find the matching ENDREGION index for a REGION at startIdx (depth-aware)
  function _regionEndIdx(startIdx) {
    let depth = 0;
    for (let i = startIdx; i < program.length; i++) {
      const b = program[i];
      if (b.isRegionMacro || b.mnemonic === "REGION") depth++;
      else if (b.isEndRegionMacro || b.mnemonic === "ENDREGION") { if (--depth === 0) return i; }
    }
    return -1;
  }

  // Build a deep-copied slice of REGION + children + ENDREGION
  function _regionGroupCopy(startIdx) {
    const endIdx = _regionEndIdx(startIdx);
    const src = endIdx === -1
      ? [program[startIdx], _importMakeEndRegion()]
      : program.slice(startIdx, endIdx + 1);
    return JSON.parse(JSON.stringify(src));
  }

  // Produce fresh blocks with new IDs; renames the top REGION to avoid name collision
  function _freshCopy(source) {
    const arr = Array.isArray(source) ? source : [source];
    const toInsert = arr.map(b => ({ ...JSON.parse(JSON.stringify(b)), id: crypto.randomUUID() }));
    if (toInsert.length > 0 && toInsert[0].isRegionMacro) {
      const origName = toInsert[0].regionName || "region";
      let newName = `copy of ${origName}`;
      let counter = 2;
      while (program.some(b => b.isRegionMacro && b.regionName === newName)) {
        newName = `copy of ${origName} ${counter++}`;
      }
      toInsert[0].regionName = newName;
      toInsert[0].regionCollapsed = false;
      toInsert[0].collapsed = false;
    }
    return toInsert;
  }

  if (action === "copy") {
    _copiedBlock = block.isRegionMacro ? _regionGroupCopy(index) : JSON.parse(JSON.stringify(block));

  } else if (action === "cut") {
    if (block.isRegionMacro) {
      const endIdx = _regionEndIdx(index);
      _copiedBlock = _regionGroupCopy(index);
      const count = endIdx === -1 ? 1 : endIdx - index + 1;
      markTabDirty();
      program.splice(index, count);
      parseUserMacros();
      renderProgram();
    } else {
      _copiedBlock = JSON.parse(JSON.stringify(block));
      deleteBlock(index);
    }

  } else if ((action === "paste-before" || action === "paste-after") && _copiedBlock) {
    let insertAt;
    if (action === "paste-before") {
      insertAt = index;
    } else {
      // When pasting after a REGION block, skip past its ENDREGION so the content
      // lands after the entire region (not hidden inside a collapsed region)
      if (block.isRegionMacro || block.mnemonic === "REGION") {
        const endIdx = _regionEndIdx(index);
        insertAt = endIdx === -1 ? program.length : endIdx + 1;
      } else {
        insertAt = index + 1;
      }
    }
    if (Array.isArray(_copiedBlock)) {
      const toInsert = _freshCopy(_copiedBlock);
      markTabDirty();
      toInsert.forEach((b, i) => program.splice(insertAt + i, 0, b));
      parseUserMacros();
      renderProgram();
    } else {
      insertBlock(insertAt, _freshCopy(_copiedBlock)[0]);
    }

  } else if (action === "duplicate") {
    if (block.isRegionMacro) {
      const endIdx = _regionEndIdx(index);
      const insertAt = endIdx === -1 ? index + 1 : endIdx + 1;
      const toInsert = _freshCopy(_regionGroupCopy(index));
      markTabDirty();
      toInsert.forEach((b, i) => program.splice(insertAt + i, 0, b));
      parseUserMacros();
      renderProgram();
    } else {
      insertBlock(index + 1, _freshCopy(block)[0]);
    }

  } else if (action === "delete") {
    deleteBlock(index);
  }
}

function applySavedLanguage() {
  const savedLanguage = localStorage.getItem("c64-block-language") || "en";
  currentLanguage = savedLanguage === "en" ? "en" : "hu";
  document.documentElement.lang = currentLanguage;
  if (languageSelect) {
    languageSelect.value = currentLanguage;
  }
}

function _applyUiSettingsToDOM() {
  if (sampleSelect && savedUiSettings.sample) {
    sampleSelect.value = savedUiSettings.sample;
  }

  if (typeof savedUiSettings.zoom === "number" && Number.isFinite(savedUiSettings.zoom)) {
    blockScale = Math.max(0.72, Math.min(1.25, Number(savedUiSettings.zoom)));
  }

  if (baseInputs.length) {
    const selectedBase = savedUiSettings.numberBase === "dec" ? "dec" : "hex";
    baseInputs.forEach((input) => {
      input.checked = input.value === selectedBase;
    });
  }

  if (outputModeInputs.length) {
    const selectedOutputMode = ["asm", "monitor", "both", "disasm"].includes(savedUiSettings.outputMode)
      ? savedUiSettings.outputMode
      : "asm";
    outputModeInputs.forEach((input) => {
      input.checked = input.value === selectedOutputMode;
    });
  }

  if (globalMemoryPanel) {
    globalMemoryPanel.open = !!savedUiSettings.memoryPanelOpen;
  }

  if (basicSysToggle) {
    basicSysToggle.checked = savedUiSettings.basicSys !== false;
  }

  if (savedUiSettings.expertMode) {
    // Capture toolbar states BEFORE setExpertMode(true) — it calls saveUiSettings()
    // which overwrites savedUiSettings with current (default) variable values.
    const _savedHlEnabled          = savedUiSettings.expertHlEnabled;
    const _savedPaletteSyncEnabled = savedUiSettings.expertPaletteSyncEnabled;
    const _savedPaletteVisible     = savedUiSettings.expertPaletteVisible;
    const _savedDisasmWidth        = savedUiSettings.expertDisasmWidth;
    const _savedDisasmVisible      = savedUiSettings.expertDisasmVisible;
    const _savedMonitorVisible     = savedUiSettings.expertMonitorVisible;
    const _savedProjectVisible     = savedUiSettings.expertProjectVisible;

    setExpertMode(true);

    // Restore expert toolbar toggles using captured values
    if (_savedHlEnabled === false) {
      _expertHlEnabled = false;
      expertHlToggleBtn?.classList.remove("expert-hl-toggle--on");
      expertHlToggleBtn?.setAttribute("aria-pressed", "false");
    }
    if (_savedPaletteSyncEnabled === false) {
      _expertPaletteSyncEnabled = false;
      expertPaletteSyncBtn?.classList.remove("expert-hl-toggle--on");
      expertPaletteSyncBtn?.setAttribute("aria-pressed", "false");
    }
    if (_savedPaletteVisible) {
      _expertPaletteVisible = true;
      expertPaletteBtn?.classList.add("expert-hl-toggle--on");
      expertPaletteBtn?.setAttribute("aria-pressed", "true");
      document.body.classList.add("expert-show-palette");
    }
    if (_savedDisasmWidth) {
      _expertDisasmWidth = _savedDisasmWidth;
    }
    if (_savedDisasmVisible) {
      _expertDisasmVisible = true;
      expertDisasmBtn?.classList.add("expert-hl-toggle--on");
      expertDisasmBtn?.setAttribute("aria-pressed", "true");
      expertDisasmPanel?.removeAttribute("hidden");
      expertDisasmResizer?.removeAttribute("hidden");
      if (expertDisasmPanel) expertDisasmPanel.style.width = `${_expertDisasmWidth}px`;
      _expertRenderDisasm();
    }
    if (_savedMonitorVisible) {
      _expertMonitorVisible = true;
      expertMonitorBtn?.classList.add("expert-hl-toggle--on");
      expertMonitorBtn?.setAttribute("aria-pressed", "true");
      expertMonitorPanel?.removeAttribute("hidden");
      _expertRenderMonitor();
    }
    if (_savedProjectVisible) {
      _expertProjectVisible = true;
      expertProjectBtn?.classList.add("expert-hl-toggle--on");
      expertProjectBtn?.setAttribute("aria-pressed", "true");
      expertProjectPanel?.removeAttribute("hidden");
    }
  }

  if (savedUiSettings.showMacroSource !== undefined) {
    showMacroSource = !!savedUiSettings.showMacroSource;
    if (macroSourceToggle) macroSourceToggle.checked = showMacroSource;
  }

  if (savedUiSettings.showRegionComments !== undefined) {
    showRegionComments = !!savedUiSettings.showRegionComments;
    if (regionCommentsToggle) regionCommentsToggle.checked = showRegionComments;
  }

  if (savedUiSettings.blockPaletteSync !== undefined) {
    blockPaletteSync = !!savedUiSettings.blockPaletteSync;
    if (blockPaletteSyncToggle) blockPaletteSyncToggle.checked = blockPaletteSync;
  }

  if (savedUiSettings.asmOutputBase) {
    asmOutputBase = savedUiSettings.asmOutputBase;
  }
  asmBaseInputs.forEach(input => { input.checked = input.value === asmOutputBase; });

  if (savedUiSettings.debuggerJmp !== undefined) debuggerJmp = !!savedUiSettings.debuggerJmp;
  if (dbgJmp) dbgJmp.checked = debuggerJmp;

  if (savedUiSettings.debuggerWait !== undefined) debuggerWait = !!savedUiSettings.debuggerWait;
  if (dbgWait) dbgWait.checked = debuggerWait;

  if (savedUiSettings.debuggerUnpause !== undefined) debuggerUnpause = !!savedUiSettings.debuggerUnpause;
  if (dbgUnpause) dbgUnpause.checked = debuggerUnpause;
}

function applySavedUiSettings() {
  savedUiSettings = readUiSettings();
  _applyUiSettingsToDOM();

  // If running in Tauri, prefer the global config over localStorage (async fallback)
  if (window.electronAPI?.getUiSettings) {
    window.electronAPI.getUiSettings().then(globalSettings => {
      if (globalSettings && typeof globalSettings === "object" && Object.keys(globalSettings).length > 0) {
        savedUiSettings = globalSettings;
        localStorage.setItem("c64-ui-settings", JSON.stringify(savedUiSettings));
        _applyUiSettingsToDOM();
      }
    }).catch(() => {});
  }
}

function handleLanguageChange() {
  currentLanguage = languageSelect.value === "en" ? "en" : "hu";
  localStorage.setItem("c64-block-language", currentLanguage);
  document.documentElement.lang = currentLanguage;
  applyTranslations();
  updateEmulatorStatus();
  renderPaletteItems();
  renderMnemonicDescription();
  renderOriginPreview();
  renderEmulatorRunHint();
  renderProgram();
  if (expertMode) _expertRenderProjectTree();
  saveUiSettings();
}

function applyTranslations() {
  document.title = currentLanguage === "en" ? "C64 Visual Assembler" : "C64 Block Assembler";
  const setText = (selector, value) => {
    const node = document.querySelector(selector);
    if (node) {
      node.textContent = value;
    }
  };

    setText(".control-menu-trigger", t("menu"));
    setText(".hero-copy", t("heroCopy"));
    setText(".palette-panel .panel-heading h2", t("paletteTitle"));
    setText(".palette-panel .panel-heading p", t("paletteHelp"));
    setText(".program-panel .panel-heading h2", t("programTitle"));
    setText(".program-panel .panel-heading p", t("programHelp"));
    setText(".output-panel .panel-heading h2", t("asmTitle"));
    setText(".output-panel .panel-heading > p", t("asmHelp"));
    setText(".global-memory-panel .panel-heading h2", t("memoryTitle"));
    setText(".global-memory-panel .panel-heading p", t("memoryHelp"));

  const menuLabels = document.querySelectorAll(".control-menu-label");
    if (menuLabels[0]) menuLabels[0].textContent = t("menuFile");
    if (menuLabels[1]) menuLabels[1].textContent = t("menuExamples");
    if (menuLabels[2]) menuLabels[2].textContent = t("menuSettings");
    if (menuLabels[3]) menuLabels[3].textContent = t("menuView");
    if (menuLabels[4]) menuLabels[4].textContent = t("menuProgram");
  if (helpManualButton) helpManualButton.textContent = t("helpManual");
  if (checkUpdateButton) checkUpdateButton.textContent = t("checkForUpdate");
  if (reportBugButton) reportBugButton.textContent = t("reportBug");
  if (whatsNewButton) whatsNewButton.textContent = t("whatsNew");
  const tutorialBtnEl = document.getElementById("tutorial-btn");
  const tutorialBtnLabelEl = document.getElementById("tutorial-toolbar-label");
  if (tutorialBtnLabelEl) tutorialBtnLabelEl.textContent = t("tutorials");
  if (tutorialBtnEl) {
    tutorialBtnEl.setAttribute("title", t("tutorials"));
    tutorialBtnEl.setAttribute("aria-label", t("tutorials"));
  }
  if (paletteSearchInput) paletteSearchInput.placeholder = t("paletteSearchPlaceholder");
  const paletteSearchLabel = document.getElementById("palette-search-label");
  if (paletteSearchLabel) paletteSearchLabel.textContent = t("paletteSearchLabel");
  const mnemonicDescLabel = document.getElementById("mnemonic-description-label");
  if (mnemonicDescLabel) mnemonicDescLabel.textContent = t("mnemonicCardLabel");
  const basicSysLabelEl = document.getElementById("basic-sys-label");
  if (basicSysLabelEl) basicSysLabelEl.textContent = t("basicSysLabel");
  const blockPaletteSyncLabelEl = document.getElementById("block-desc-sync-label");
  if (blockPaletteSyncLabelEl) blockPaletteSyncLabelEl.textContent = t("blockDescSyncLabel");
  const expertModeLabelEl = document.getElementById("expert-mode-label");
  if (expertModeLabelEl) expertModeLabelEl.textContent = t("expertModeLabel");
  if (_confirmYes) _confirmYes.textContent = t("tabCloseConfirmOk");
  if (_confirmNo)  _confirmNo.textContent  = t("tabCloseConfirmCancel");
  expertPaletteBtn?.setAttribute("title", t("expertPaletteToggle"));
  expertPaletteBtn?.setAttribute("aria-label", t("expertPaletteToggle"));
  expertProjectBtn?.setAttribute("title", t("expertProjectPanel"));
  expertProjectBtn?.setAttribute("aria-label", t("expertProjectPanel"));
  document.getElementById("expert-project-open-btn")?.setAttribute("title", t("projOpenProjectBtn"));
  document.getElementById("expert-project-open-btn")?.setAttribute("aria-label", t("projOpenProjectBtn"));
  document.getElementById("expert-project-new-btn")?.setAttribute("title", t("projNewProjectBtn"));
  document.getElementById("expert-project-new-btn")?.setAttribute("aria-label", t("projNewProjectBtn"));
  document.getElementById("expert-project-save-btn")?.setAttribute("title", t("projSaveProjectBtn"));
  document.getElementById("expert-project-save-btn")?.setAttribute("aria-label", t("projSaveProjectBtn"));
  document.getElementById("expert-project-add-btn")?.setAttribute("title", t("projAddFileBtn"));
  document.getElementById("expert-project-add-btn")?.setAttribute("aria-label", t("projAddFileBtn"));
  expertPaletteSyncBtn?.setAttribute("title", t("expertPaletteSync"));
  expertPaletteSyncBtn?.setAttribute("aria-label", t("expertPaletteSync"));
  expertDisasmBtn?.setAttribute("title", t("expertDisasm"));
  expertDisasmBtn?.setAttribute("aria-label", t("expertDisasm"));
  expertMonitorBtn?.setAttribute("title", t("expertMonitor"));
  expertMonitorBtn?.setAttribute("aria-label", t("expertMonitor"));
  expertFormatBtn?.setAttribute("title", t("expertFormat"));
  expertFormatBtn?.setAttribute("aria-label", t("expertFormat"));
  expertLoadAsmBtn?.setAttribute("title", t("vasmLoadBtn"));
  expertLoadAsmBtn?.setAttribute("aria-label", t("vasmLoadBtn"));
  expertSaveAsmBtn?.setAttribute("title", t("vasmSaveBtn"));
  expertSaveAsmBtn?.setAttribute("aria-label", t("vasmSaveBtn"));
  expertBuildInfoBtn?.setAttribute("title", t("buildInfoBtn"));
  expertBuildInfoBtn?.setAttribute("aria-label", t("buildInfoBtn"));
  buildInfoBtn?.setAttribute("title", t("buildInfoBtn"));

  document.querySelector('label[for="category-select"]');
  setText(".palette-panel .field:nth-of-type(1) span", t("fieldCategory"));
  setText(".palette-panel .field:nth-of-type(2) span", t("fieldMnemonic"));
    setText(".palette-panel .field:nth-of-type(3) span", t("fieldOperand"));
    setText(".base-switch legend", t("numberBase"));
    setText(".palette-panel .field:nth-of-type(4) span", t("addressingMode"));
    setText("#add-selected", t("addSelected"));
    setText('.view-mode-option input[value="program"] + span', t("outputProgram"));
    setText('.view-mode-option input[value="asm"] + span', t("outputAsm"));
    setText('.view-mode-option input[value="monitor"] + span', t("outputMonitor"));
    setText('.view-mode-option input[value="both"] + span', t("outputBoth"));
    setText(".global-memory-title", t("memoryTitle"));
    setText("#hardware-settings-btn", t("hardwareSettings"));
    setText("#hardware-settings-title", t("hardwareSettingsTitle"));
    setText("#hardware-settings-close", t("hardwareSettingsClose"));
    setText("#hw-vice-section-label", t("hwViceSectionLabel"));
    setText("#hw-debugger-section-label", t("hwDebuggerSectionLabel"));
    setText("#vice-exe-label", t("viceExecutable"));
    setText("#choose-vice", t("openEmulator"));
    setText("#choose-debugger", t("chooseDebugger"));
    setText("#debugger-exe-label", t("debuggerExecutable"));
    setText("#debugger-params-label", t("debuggerParamsLabel"));
    setText("#dbg-jmp-label", t("debuggerJmpLabel"));
    setText("#dbg-wait-label", t("debuggerWaitLabel"));
    setText("#dbg-unpause-label", t("debuggerUnpauseLabel"));
    setText("#run-emulator .run-label", runMode === "d64" ? t("runViaD64") : runMode === "ultimate" ? t("runOnUltimate") : runMode === "ultimate-d64" ? t("runD64OnHardware") : t("runInEmulator"));
    setText("#run-prg-label", t("runAsPrg"));
    setText("#run-d64-label", t("runViaD64"));
    setText("#run-ultimate-label", t("runOnUltimate"));
    setText("#run-ultimate-d64-label", t("runD64OnHardware"));
    setText("#ultimate-section-label", t("ultimateSectionLabel"));
    setText("#ultimate-host-label", t("ultimateHostLabel"));
    setText("#ultimate-password-label", t("ultimatePasswordLabel"));
    document.getElementById("ultimate-password")?.setAttribute("placeholder", t("ultimatePasswordPlaceholder"));
    setText("#ultimate-connect-test", t("ultimateConnectTest"));
    setText("#run-debugger .run-label", t("runInDebugger"));
    setText("#copy-asm", t("copyAsm"));
    setText("#save-project", t("saveProject"));
    setText("#menu-open-project", t("menuOpenProject"));
    setText("#menu-save-project", t("menuSaveProject"));
    setText("#menu-close-project", t("menuCloseProject"));
    setText("#save-prg", t("savePrg"));
    setText("#build-section-label", t("buildSection"));
    setText("#save-d64", t("saveD64"));
    setText("#d64-export-title", t("d64ExportTitle"));
    setText("#d64-export-diskname-label", t("d64ExportDiskName"));
    setText("#d64-export-progname-label", t("d64ExportProgName"));
    setText("#d64-export-extras-title", t("d64ExportExtrasTitle"));
    setText("#d64-export-extras-help", t("d64ExportExtrasHelp"));
    document.getElementById("d64-export-add-file")?.setAttribute("title", t("d64ExportAddFile"));
    setText("#d64-export-confirm", t("d64ExportConfirm"));
    setText("#d64-export-cancel", t("d64ExportCancel"));
    setText("#program-settings-label", t("programSettings"));
    if (macroSourceToggleText) macroSourceToggleText.textContent = t("macroSourceToggle");
    setText("#asm-numbers-label", t("asmNumbersLabel"));
    setText("#region-comments-label", t("regionCommentsLabel"));
    setText("#origin-preview-label", t("originPreviewLabel"));
    setText("#asm-output-label", t("asmOutputLabel"));
    setText("#monitor-output-label", t("monitorOutputLabel"));
    setText("#load-project", t("loadProject"));
    setText("#exit-app", t("exitApp"));
    exitAppButton?.setAttribute("title", t("exitApp"));
    exitAppButton?.setAttribute("aria-label", t("exitApp"));
    chooseViceButton?.setAttribute("title", t("openEmulator"));
    chooseViceButton?.setAttribute("aria-label", t("openEmulator"));
    copyAsmButton?.setAttribute("title", t("copyAsm"));
    copyAsmButton?.setAttribute("aria-label", t("copyAsm"));
    saveProjectButton?.setAttribute("title", t("saveProject"));
    saveProjectButton?.setAttribute("aria-label", t("saveProject"));
    savePrgButton?.setAttribute("title", t("savePrg"));
    savePrgButton?.setAttribute("aria-label", t("savePrg"));
    saveD64Button?.setAttribute("title", t("saveD64"));
    saveD64Button?.setAttribute("aria-label", t("saveD64"));
    loadProjectButton?.setAttribute("title", t("loadProject"));
    loadProjectButton?.setAttribute("aria-label", t("loadProject"));
    addSelectedButton?.setAttribute("title", t("addSelected"));
    addSelectedButton?.setAttribute("aria-label", t("addSelected"));
    loadSampleButton?.setAttribute("title", t("loadSample"));
    loadSampleButton?.setAttribute("aria-label", t("loadSample"));
    clearProgramButton?.setAttribute("title", t("clearProgram"));
    clearProgramButton?.setAttribute("aria-label", t("clearProgram"));
    if (runEmulatorButton) {
      runEmulatorButton.setAttribute("title", t("runInEmulator"));
      runEmulatorButton.setAttribute("aria-label", t("runInEmulator"));
    }
    if (runDebuggerButton) {
      runDebuggerButton.setAttribute("title", t("runInDebuggerTitle"));
      runDebuggerButton.setAttribute("aria-label", t("runInDebuggerTitle"));
    }
    chooseDebuggerButton?.setAttribute("title", t("chooseDebugger"));
    chooseDebuggerButton?.setAttribute("aria-label", t("chooseDebugger"));
    document.getElementById("hardware-settings-btn")?.setAttribute("title", t("hardwareSettings"));
    document.getElementById("hardware-settings-btn")?.setAttribute("aria-label", t("hardwareSettings"));
    document.getElementById("crt-toggle")?.setAttribute("title", t("crtToggle"));
    document.getElementById("crt-toggle")?.setAttribute("aria-label", t("crtToggle"));
    zoomInButton?.setAttribute("title", t("zoomIn"));
    zoomInButton?.setAttribute("aria-label", t("zoomIn"));
    zoomOutButton?.setAttribute("title", t("zoomOut"));
    zoomOutButton?.setAttribute("aria-label", t("zoomOut"));
    helpManualButton?.setAttribute("title", t("helpManual"));
    helpManualButton?.setAttribute("aria-label", t("helpManual"));
    aboutButton?.setAttribute("title", t("about"));
    aboutButton?.setAttribute("aria-label", t("about"));
    whatsNewButton?.setAttribute("title", t("whatsNew"));
    whatsNewButton?.setAttribute("aria-label", t("whatsNew"));
    knowledgeBaseButton?.setAttribute("title", t("knowledgeBase"));
    knowledgeBaseButton?.setAttribute("aria-label", t("knowledgeBase"));
    checkUpdateButton?.setAttribute("title", t("checkForUpdate"));
    checkUpdateButton?.setAttribute("aria-label", t("checkForUpdate"));
    reportBugButton?.setAttribute("title", t("reportBug"));
    reportBugButton?.setAttribute("aria-label", t("reportBug"));
    if (debuggerPathInput) {
      debuggerPathInput.placeholder = t("debuggerNotConfiguredPlaceholder");
    }
    updateDebuggerPathPreview(debuggerPath);
    if (emulatorStatus && !vicePath) {
      emulatorStatus.textContent = t("chooseViceStatusPending");
    }
    collapseAllButton?.setAttribute("aria-label", t("collapseAll"));
    collapseAllButton?.setAttribute("title", t("collapseAll"));
    expandAllButton?.setAttribute("aria-label", t("expandAll"));
    expandAllButton?.setAttribute("title", t("expandAll"));

    const legendItems = document.querySelectorAll(".memory-strip-legend span");
  if (legendItems[0]) legendItems[0].lastChild.textContent = t("memoryLegendRam");
  if (legendItems[1]) legendItems[1].lastChild.textContent = t("memoryLegendUsed");
  if (legendItems[2]) legendItems[2].lastChild.textContent = t("memoryLegendRom");
  if (legendItems[3]) legendItems[3].lastChild.textContent = t("memoryLegendIo");
  memoryStrip?.setAttribute("aria-label", t("memoryAxisLabel"));

  loadSampleButton.textContent = t("loadSample");
  clearProgramButton.textContent = t("clearProgram");
    themeToggleButton.lastElementChild.textContent = t("themeToggle");
    updateThemeToggleLabel();
    const crtToggleBtn = document.getElementById("crt-toggle");
    if (crtToggleBtn) crtToggleBtn.lastElementChild.textContent = t("crtToggle");
    const srOnlyLabels = document.querySelectorAll("label.sample-picker .sr-only");
  if (srOnlyLabels[0]) srOnlyLabels[0].textContent = t("sampleSrOnly");
  const languageLabelEl = document.getElementById("language-label");
  if (languageLabelEl) languageLabelEl.textContent = t("languageLabel");

  const sampleOptions = sampleSelect.options;
  if (sampleOptions[0]) sampleOptions[0].textContent = t("sampleBasic");
  if (sampleOptions[1]) sampleOptions[1].textContent = t("sampleClearScreen");
  if (sampleOptions[2]) sampleOptions[2].textContent = t("sampleLabel");
  if (sampleOptions[3]) sampleOptions[3].textContent = t("sampleText");
  if (sampleOptions[4]) sampleOptions[4].textContent = t("sampleLowercaseText");
  if (sampleOptions[5]) sampleOptions[5].textContent = t("sampleMacro");
  if (sampleOptions[6]) sampleOptions[6].textContent = t("sampleSprite");
  if (sampleOptions[7]) sampleOptions[7].textContent = t("sampleSetpixel");
  if (sampleOptions[8]) sampleOptions[8].textContent = t("sampleBitmap");
  if (sampleOptions[9]) sampleOptions[9].textContent = t("sampleMacroTest");
  if (sampleOptions[10]) sampleOptions[10].textContent = t("sampleLoop");
  if (sampleOptions[11]) sampleOptions[11].textContent = t("sampleHelloLoop");
  if (sampleOptions[12]) sampleOptions[12].textContent = t("samplePushPull");
  if (sampleOptions[13]) sampleOptions[13].textContent = t("sampleIfElse");
  if (sampleOptions[14]) sampleOptions[14].textContent = t("sampleUserMacro");
  if (sampleOptions[15]) sampleOptions[15].textContent = t("sampleIncBin");
  if (sampleOptions[16]) sampleOptions[16].textContent = t("sampleLoadFile");
  if (sampleOptions[17]) sampleOptions[17].textContent = t("sampleInclude");
  if (sampleOptions[18]) sampleOptions[18].textContent = t("sampleSidDemo");
  if (sampleOptions[19]) sampleOptions[19].textContent = t("sampleSidDirectDemo");
  if (sampleOptions[20]) sampleOptions[20].textContent = t("sampleSpriteMacroDemo");
  if (sampleOptions[21]) sampleOptions[21].textContent = t("sampleJoystickDemo");
  if (sampleOptions[22]) sampleOptions[22].textContent = t("sampleMouseDemo");
  if (sampleOptions[23]) sampleOptions[23].textContent = t("sampleCollisionDemo");
  if (sampleOptions[24]) sampleOptions[24].textContent = t("sample10Print");
  if (sampleOptions[25]) sampleOptions[25].textContent = t("sampleRasterIrqDemo");
  if (sampleOptions[26]) sampleOptions[26].textContent = t("sampleOverlappingRasterDemo");
  if (sampleOptions[27]) sampleOptions[27].textContent = t("sampleMemoryOverlapDemo");
  if (sampleOptions[28]) sampleOptions[28].textContent = t("sampleRandLinesDemo");
  if (sampleOptions[29]) sampleOptions[29].textContent = t("sampleReuDemo");
  if (sampleOptions[30]) sampleOptions[30].textContent = t("sampleScrollTextDemo");
  if (sampleOptions[31]) sampleOptions[31].textContent = t("sampleNameInputDemo");

  updateThemeToggleLabel();
  refreshCategoryOptions();
  updateOperandField();
}

function refreshCategoryOptions() {
  const selected = categorySelect.value;
  categorySelect.innerHTML = Object.keys(mnemonicLibrary)
    .map((category) => `<option value="${category}">${getCategoryLabel(category)}</option>`)
    .join("");
  if (selected) {
    categorySelect.value = selected;
  }
}

function getSelectedOutputMode() {
  return outputModeInputs.find((input) => input.checked)?.value || "asm";
}

function renderOutputMode() {
  outputStack.dataset.mode = getSelectedOutputMode();
  saveUiSettings();
}

function getSelectedBase() {
  return baseInputs.find((input) => input.checked)?.value || "hex";
}

function syncMnemonicMenu() {
  const category = categorySelect.value;
  const items = mnemonicLibrary[category] || [];

  mnemonicSelect.innerHTML = items
    .map(({ mnemonic }) => `<option value="${mnemonic}">${mnemonic}</option>`)
    .join("");
  const preferredMnemonic = items.some((item) => item.mnemonic === savedUiSettings.mnemonic)
    ? savedUiSettings.mnemonic
    : items[0]?.mnemonic || "";
  mnemonicSelect.value = preferredMnemonic;

  syncAddressingModes();
  renderPaletteItems();
}

function syncAddressingModes() {
  const item = getSelectedMnemonic();
  if (!item) {
    addressingSelect.innerHTML = "";
    mnemonicDescription.innerHTML = "";
    paletteList.innerHTML = "";
    return;
  }
    addressingSelect.innerHTML = item.modes
      .map((mode) => `<option value="${mode}">${modeText(mode, "label")}</option>`)
      .join("");
    const preferredMode = item.modes.includes(savedUiSettings.addressingMode)
      ? savedUiSettings.addressingMode
      : item.modes[0] || "";
    addressingSelect.value = preferredMode;

    updateOperandField();
    renderMnemonicDescription();
  }

function handleAddressingChange() {
  updateOperandField();
  renderMnemonicDescription();
}

function handleBaseChange() {
  updateOperandField();
  renderMnemonicDescription();
  renderPaletteItems();
  renderProgram();
  renderOriginPreview();
  saveUiSettings();
}

function getAsmDisplayOperand(block) {
  if (!block.rawOperand || !block.addressingMode) return block.operand || "";
  const numericValue = parseNumberByBase(block.rawOperand, block.base || "hex");
  if (numericValue === null) return block.operand || "";
  if (validateRange(block.addressingMode, numericValue)) return block.operand || "";
  return formatOperand(block.addressingMode, numericValue, block.base || "hex");
}


let _operandSuggestions = [];
let _operandActiveIndex = -1;

function closeOperandDropdown() {
  const dd = document.getElementById("operand-dropdown");
  if (dd) dd.hidden = true;
  _operandActiveIndex = -1;
}

function openOperandDropdown(filter) {
  const dd = document.getElementById("operand-dropdown");
  if (!dd || !_operandSuggestions.length) { closeOperandDropdown(); return; }
  const items = filter
    ? _operandSuggestions.filter(s => s.label.toLowerCase().includes(filter.toLowerCase()))
    : _operandSuggestions;
  if (!items.length) { closeOperandDropdown(); return; }
  dd.innerHTML = items.map((s, i) =>
    `<div class="operand-dropdown-item" data-value="${s.value}" data-index="${i}" title="${s.label}">${s.label}</div>`
  ).join("");
  // Position using fixed coords to escape overflow:hidden parent
  const rect = operandInput.getBoundingClientRect();
  dd.style.left = rect.left + "px";
  dd.style.top = (rect.bottom + 4) + "px";
  dd.style.minWidth = rect.width + "px";
  dd.hidden = false;
  dd.querySelectorAll(".operand-dropdown-item").forEach(el => {
    el.addEventListener("pointerdown", e => {
      e.preventDefault();
      operandInput.value = el.dataset.value;
      operandInput.dispatchEvent(new Event("input"));
      closeOperandDropdown();
    });
  });
}

function setupOperandDropdown() {
  // Create dropdown at body level to escape backdrop-filter containing block
  let dd = document.getElementById("operand-dropdown");
  if (!dd) {
    dd = document.createElement("div");
    dd.id = "operand-dropdown";
    dd.className = "operand-dropdown";
    dd.hidden = true;
    document.body.appendChild(dd);
  }
  operandInput.addEventListener("focus", () => {
    if (_operandSuggestions.length) openOperandDropdown(operandInput.value);
  });
  operandInput.addEventListener("input", () => {
    if (_operandSuggestions.length) openOperandDropdown(operandInput.value);
  });
  operandInput.addEventListener("blur", () => setTimeout(closeOperandDropdown, 150));
  operandInput.addEventListener("keydown", e => {
    const dd = document.getElementById("operand-dropdown");
    if (!dd || dd.hidden) return;
    const items = dd.querySelectorAll(".operand-dropdown-item");
    if (e.key === "ArrowDown") {
      e.preventDefault();
      _operandActiveIndex = Math.min(_operandActiveIndex + 1, items.length - 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      _operandActiveIndex = Math.max(_operandActiveIndex - 1, 0);
    } else if (e.key === "Enter" && _operandActiveIndex >= 0) {
      e.preventDefault();
      operandInput.value = items[_operandActiveIndex].dataset.value;
      operandInput.dispatchEvent(new Event("input"));
      closeOperandDropdown();
      return;
    } else if (e.key === "Escape") {
      closeOperandDropdown(); return;
    }
    items.forEach((el, i) => el.classList.toggle("active", i === _operandActiveIndex));
    if (_operandActiveIndex >= 0) items[_operandActiveIndex].scrollIntoView({ block: "nearest" });
  });
}

function updateOperandField() {
  const item = getSelectedMnemonic();
  const mode = addressingModes[addressingSelect.value];
  const addressingField = document.getElementById("addressing-field");

  // Hide addressing mode selector for COMMENT or single-mode instructions
  if (addressingField) addressingField.hidden = !!(item?.isComment) || (item ? item.modes.length <= 1 : false);

  // Populate KERNAL suggestions for JSR / JMP
  if (item && (item.mnemonic === "JSR" || item.mnemonic === "JMP")) {
    _operandSuggestions = kernalRoutines.map(r => ({
      value: r.addr,
      label: `${r.addr}  ${r.name} \u2013 ${r[currentLanguage] ?? r.en}`
    }));
  } else {
    _operandSuggestions = [];
  }
  closeOperandDropdown();

  if (!item || !mode) {
    operandInput.disabled = true;
    operandInput.placeholder = currentLanguage === "en" ? "Select a mnemonic first" : "Valassz elobb mnemonikot";
    return;
  }
  const needsTextOperand = item?.isTextMacro;
  const needsByteOperand = item?.isByteMacro;
  const needsStringOperand = item?.isStringMacro;
  const needsDataOperand = item?.isDataMacro;
  const needsRawBytesOperand = item?.isRawBytesMacro;
  const needsRawTextOperand = item?.isRawTextMacro;
  const needsPetsciiOperand = item?.isPetsciiMacro;
  const needsCommentOperand = item?.isComment;
  operandInput.disabled = !(mode.needsOperand || needsTextOperand || needsByteOperand || needsStringOperand || needsDataOperand || needsRawBytesOperand || needsRawTextOperand || needsPetsciiOperand || needsCommentOperand) || item?.isIncBinMacro || item?.isIncludeMacro;
  operandInput.placeholder = needsTextOperand
    ? (currentLanguage === "en" ? "For example HELLO C64" : "Peldaul HELLO C64")
    : needsByteOperand
      ? (currentLanguage === "en" ? "For example 169,0,141,32,208" : "Peldaul 169,0,141,32,208")
      : needsStringOperand
        ? (currentLanguage === "en" ? "For example HELLO" : "Peldaul HELLO")
        : needsDataOperand
          ? (currentLanguage === "en" ? "For example 169,0,141,32,208" : "Peldaul 169,0,141,32,208")
          : needsRawBytesOperand
            ? (currentLanguage === "en" ? "For example 169,0,141,32,208" : "Peldaul 169,0,141,32,208")
            : needsRawTextOperand
              ? (currentLanguage === "en" ? "For example HELLO" : "Peldaul HELLO")
              : needsCommentOperand
                ? (currentLanguage === "en" ? "For example border scroll demo" : "Peldaul border scroll demo")
                : getOperandPlaceholder(mode, getSelectedBase());

  if (!mode.needsOperand && !needsTextOperand && !needsByteOperand && !needsStringOperand && !needsDataOperand && !needsRawBytesOperand && !needsRawTextOperand && !needsCommentOperand) {
    operandInput.value = "";
  }
}

function renderMnemonicDescription() {
  const item = getSelectedMnemonic();
  const modeKey = addressingSelect.value;
  const mode = addressingModes[modeKey];
  if (!item || !mode) {
    mnemonicDescription.innerHTML = "";
    return;
  }
  if (item.isTextMacro) {
    const textPreview = formatTextMacroPreview(operandInput.value.trim());
    mnemonicDescription.innerHTML = `
      <strong>${item.mnemonic}</strong>
      <p>${getItemDescription(item)}</p>
      <p>${currentLanguage === "en" ? "Macro addressing: screen position by X/Y." : "Makro-cimzes: kepernyo pozicio X/Y alapon."}</p>
      <small>${currentLanguage === "en" ? "Preview" : "Elonezet"}: ${textPreview.preview}</small>
    `;
    return;
  }
  if (item.isByteMacro) {
    const bytePreview = formatByteMacroPreview(operandInput.value.trim());
    mnemonicDescription.innerHTML = `
      <strong>${item.mnemonic}</strong>
      <p>${getItemDescription(item)}</p>
      <p>${currentLanguage === "en" ? "Macro addressing: bytes are inserted at the current assembly address." : "Makro-cimzes: a byte-ok a jelenlegi assembly cimre kerulnek."}</p>
      <small>${currentLanguage === "en" ? "Preview" : "Elonezet"}: ${bytePreview.preview}</small>
      ${bytePreview.error ? `<br><small class="error-text">${bytePreview.error}</small>` : ""}
    `;
    return;
  }
  if (item.isStringMacro) {
    const textPreview = formatTextMacroPreview(operandInput.value.trim());
    mnemonicDescription.innerHTML = `
      <strong>${item.mnemonic}</strong>
      <p>${getItemDescription(item)}</p>
      <p>${currentLanguage === "en" ? "Macro addressing: encodes text as screen codes, then generates LDA #code / STA $addr pairs at runtime." : "Makro-cimzes: szoveget kepernyo kodkent kodol, majd LDA #kod / STA $cim parokat general futasidokor."}</p>
      <small>${currentLanguage === "en" ? "Preview" : "Elonezet"}: ${textPreview.preview}</small>
    `;
    return;
  }
  if (item.isRawBytesMacro) {
    const bytePreview = formatByteMacroPreview(operandInput.value.trim());
    mnemonicDescription.innerHTML = `
      <strong>${item.mnemonic}</strong>
      <p>${getItemDescription(item)}</p>
      <p>${currentLanguage === "en" ? "Macro addressing: places raw bytes directly at an absolute memory address, no LDA/STA code generated." : "Makro-cimzes: nyers byte-okat helyez el kozvetlenul egy abszolut memoriacimre, LDA/STA kod generalas nelkul."}</p>
      <small>${currentLanguage === "en" ? "Preview" : "Elonezet"}: ${bytePreview.preview}</small>
      ${bytePreview.error ? `<br><small class="error-text">${bytePreview.error}</small>` : ""}
    `;
    return;
  }
  if (item.isIncBinMacro) {
    mnemonicDescription.innerHTML = `
      <strong>${item.mnemonic}</strong>
      <p>${getItemDescription(item)}</p>
      <p>${currentLanguage === "en" ? "Macro addressing: includes an external binary file at a given memory address, no runtime code generated." : "Makro-cimzes: kulso binarfajl adatait helyezi el egy abszolut memoriacimre, runtime kod generalas nelkul."}</p>
      <small>${currentLanguage === "en" ? "Select a binary file with the Browse button after inserting." : "A fajlt a Tallozas gombbal valaszthatod ki a beillesztes utan."}</small>
    `;
    return;
  }
  if (item.isIncludeMacro) {
    mnemonicDescription.innerHTML = `
      <strong>${item.mnemonic}</strong>
      <p>${getItemDescription(item)}</p>
      <p>${currentLanguage === "en" ? "Embeds another project JSON file's blocks inline at this position. The blocks appear grayed out and read-only." : "Egy masik projekt JSON fajl blokkjait illeszti be erre a helyre. A blokkok szurkitve, csak olvashatoan jelennek meg."}</p>
      <small>${currentLanguage === "en" ? "Select a project file with the Browse button after inserting." : "A projektet a Tallozas gombbal valaszthatod ki a beillesztes utan."}</small>
    `;
    return;
  }
  if (item.isRawTextMacro) {
    const textPreview = formatTextMacroPreview(operandInput.value.trim());
    mnemonicDescription.innerHTML = `
      <strong>${item.mnemonic}</strong>
      <p>${getItemDescription(item)}</p>
      <p>${currentLanguage === "en" ? "Macro addressing: places text as screen codes directly at an absolute memory address, no LDA/STA code generated." : "Makro-cimzes: szoveget kepernyo kodkent helyez el kozvetlenul egy abszolut memoriacimre, LDA/STA kod generalas nelkul."}</p>
      <small>${currentLanguage === "en" ? "Preview" : "Elonezet"}: ${textPreview.preview}</small>
    `;
    return;
  }
  if (item.isComment) {
    mnemonicDescription.innerHTML = `
      <strong>${item.mnemonic}</strong>
      <p>${getItemDescription(item)}</p>
      <p>${currentLanguage === "en" ? "Comment line visible in ASM and monitor, but it generates no bytes." : "Kommentsor, ami az ASM-ben es a monitorban is latszik, de nem general byte-ot."}</p>
      <small>${currentLanguage === "en" ? "Preview" : "Elonezet"}: ; ${operandInput.value.trim() || (currentLanguage === "en" ? "new comment" : "uj komment")}</small>
    `;
    return;
  }
  const preview = buildOperandPreview(modeKey, operandInput.value.trim(), getSelectedBase());

  mnemonicDescription.innerHTML = `
    <strong>${item.mnemonic}</strong>
    <p>${getItemDescription(item)}</p>
    <p>${currentLanguage === "en" ? "Addressing" : "Cimzes"}: ${modeText(modeKey, "label")}. ${modeText(modeKey, "help")}</p>
    <small>${currentLanguage === "en" ? "Allowed modes" : "Engedett modok"}: ${item.modes.map((key) => modeText(key, "label")).join(", ")}</small>
    <br>
    <small>${currentLanguage === "en" ? "Preview" : "Elonezet"}: ${preview.text}</small>
    ${preview.error ? `<br><small class="error-text">${preview.error}</small>` : ""}
  `;
}

function renderPaletteItems() {
  if (paletteSearchInput && paletteSearchInput.value.trim()) {
    renderSearchResults(paletteSearchInput.value);
    return;
  }
  const category = categorySelect.value;
  const items = mnemonicLibrary[category];
  const selectedBase = getSelectedBase();
  const selectedMode = addressingSelect.value;
  paletteList.innerHTML = "";

  items.forEach((item) => {
    const defaultMode = item.modes.includes(selectedMode) ? selectedMode : item.modes[0];
    const preview = item.isTextMacro || item.isStringMacro || item.isRawTextMacro
      ? formatTextMacroPreview(operandInput.value.trim())
      : item.isByteMacro || item.isDataMacro || item.isRawBytesMacro
        ? formatByteMacroPreview(operandInput.value.trim())
        : buildOperandPreview(defaultMode, operandInput.value.trim(), selectedBase);
    const node = paletteItemTemplate.content.firstElementChild.cloneNode(true);

    node.querySelector(".palette-mnemonic").textContent = item.mnemonic;
    node.querySelector(".palette-description").textContent = item.isTextMacro
      ? `${currentLanguage === "en" ? "Screen X/Y" : "Kepernyo X/Y"} | ${preview.preview}`
      : item.isByteMacro
        ? `${currentLanguage === "en" ? "Byte array" : "Byte tomb"} | ${preview.preview}`
        : item.isStringMacro
          ? `${currentLanguage === "en" ? "Absolute address" : "Abszolut cim"} | ${preview.preview}`
          : item.isDataMacro
            ? `${currentLanguage === "en" ? "Absolute address" : "Abszolut cim"} | ${preview.preview}`
            : item.isRawBytesMacro
              ? `${currentLanguage === "en" ? "Raw bytes at address" : "Nyers byte-ok adott cimre"} | ${preview.preview}`
              : item.isRawTextMacro
                ? `${currentLanguage === "en" ? "Raw text at address" : "Nyers szoveg adott cimre"} | ${preview.preview}`
                : item.isIncBinMacro
                  ? `${currentLanguage === "en" ? "Binary file at address" : "Binarfajl adott cimre"}`
                  : item.isIncludeMacro
                  ? `${currentLanguage === "en" ? "Include project blocks inline" : "Projekt blokkjainak beillesztese"}`
                  : item.isSidMacro
                  ? `${currentLanguage === "en" ? "SID music file, header stripped automatically" : "SID zenefajl, fejlec automatikusan eltavolitva"}`
                  : item.isComment
                ? `${currentLanguage === "en" ? "Comment" : "Komment"} | ; ${operandInput.value.trim() || (currentLanguage === "en" ? "new comment" : "uj komment")}`
                : `${modeText(defaultMode, "label")} | ${preview.text}`;

    node.addEventListener("click", () => {
      mnemonicSelect.value = item.mnemonic;
      syncAddressingModes();
    });

    node.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      mnemonicSelect.value = item.mnemonic;
      syncAddressingModes();

      if (item.modes.includes(selectedMode)) {
        addressingSelect.value = selectedMode;
        updateOperandField();
      }

      renderMnemonicDescription();
      startMouseDnd(e, node, { type: "palette", block: createBlockFromMnemonic(item) }, item.mnemonic);
    });

    paletteList.appendChild(node);
  });
  _highlightActivePaletteItem();
}

function _syncPaletteToBlock(blockId, force = false) {
  if (expertMode) return;
  if (!blockPaletteSync && !force) return;
  if (paletteSearchInput && paletteSearchInput.value.trim()) return; // don't override search
  const block = program.find(b => b.id === blockId);
  if (!block) return;
  const paletteCategory = _importMnemonicCategory(block.mnemonic);
  if (!paletteCategory || !mnemonicLibrary[paletteCategory]) return;
  if (categorySelect.value !== paletteCategory) {
    categorySelect.value = paletteCategory;
    syncMnemonicMenu(); // re-renders palette + calls _highlightActivePaletteItem at end
  } else {
    _highlightActivePaletteItem();
  }
  if (mnemonicSelect.value !== block.mnemonic) {
    mnemonicSelect.value = block.mnemonic;
    syncAddressingModes();
  } else {
    renderMnemonicDescription();
  }
}

function _highlightActivePaletteItem() {
  document.querySelectorAll(".palette-item--active").forEach(el => el.classList.remove("palette-item--active"));
  if (!selectedBlockId) return;
  const block = program.find(b => b.id === selectedBlockId);
  if (!block) return;
  const items = paletteList.querySelectorAll(".palette-item");
  for (const item of items) {
    const mn = item.querySelector(".palette-mnemonic")?.textContent?.trim();
    if (mn === block.mnemonic) {
      item.classList.add("palette-item--active");
      item.scrollIntoView({ block: "nearest", behavior: "smooth" });
      break;
    }
  }
}

function renderSearchResults(query) {
  const q = query.toLowerCase().trim();
  paletteList.innerHTML = "";
  if (!q) {
    renderPaletteItems();
    return;
  }

  const selectedBase = getSelectedBase();
  const selectedMode = addressingSelect.value;

  // Score each item: 3=exact mnemonic, 2=mnemonic prefix, 1=mnemonic contains, 0=description/category only
  const scored = [];
  for (const [category, items] of Object.entries(mnemonicLibrary)) {
    for (const item of items) {
      const mn = item.mnemonic.toLowerCase();
      let score = -1;
      if (mn === q) score = 3;
      else if (mn.startsWith(q)) score = 2;
      else if (mn.includes(q)) score = 1;
      else if (
        getItemDescription(item).toLowerCase().includes(q) ||
        getCategoryLabel(category).toLowerCase().includes(q)
      ) score = 0;
      if (score >= 0) scored.push({ item, category, userMacroName: null, score });
    }
  }

  // If any mnemonic match exists (score >= 1), drop pure description/category matches (score 0)
  const hasMnemonicMatch = scored.some(r => r.score >= 1);
  const filtered = hasMnemonicMatch ? scored.filter(r => r.score >= 1) : scored;
  filtered.sort((a, b) => b.score - a.score);
  const results = filtered;

  const invokeItem = Object.values(mnemonicLibrary).flat().find(i => i.isMacroInvoke);
  for (const macroName of Object.keys(userMacros)) {
    if (macroName.toLowerCase().includes(q)) {
      if (invokeItem) {
        results.push({ item: invokeItem, category: "Makrok", userMacroName: macroName });
      }
    }
  }

  if (!results.length) {
    const empty = document.createElement("p");
    empty.className = "palette-no-results";
    empty.textContent = currentLanguage === "en" ? "No results." : "Nincs talalat.";
    paletteList.appendChild(empty);
    return;
  }

  let lastCat = null;
  for (const { item, category, userMacroName } of results) {
    if (category !== lastCat) {
      const hdr = document.createElement("p");
      hdr.className = "palette-search-group";
      hdr.textContent = getCategoryLabel(category);
      paletteList.appendChild(hdr);
      lastCat = category;
    }

    const defaultMode = item.modes.includes(selectedMode) ? selectedMode : item.modes[0];
    const node = paletteItemTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".palette-mnemonic").textContent = userMacroName ? `INVOKE: ${userMacroName}` : item.mnemonic;
    node.querySelector(".palette-description").textContent = userMacroName
      ? `${currentLanguage === "en" ? "Call user macro" : "Felhasznaloi makro hivasa"}`
      : getItemDescription(item);

    node.addEventListener("click", () => {
      categorySelect.value = category;
      syncMnemonicMenu();
      mnemonicSelect.value = item.mnemonic;
      syncAddressingModes();
    });

    node.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      categorySelect.value = category;
      mnemonicSelect.innerHTML = (mnemonicLibrary[category] || []).map(({ mnemonic }) => `<option value="${mnemonic}">${mnemonic}</option>`).join("");
      mnemonicSelect.value = item.mnemonic;
      syncAddressingModes();
      if (item.modes.includes(selectedMode)) {
        addressingSelect.value = selectedMode;
        updateOperandField();
      }
      renderMnemonicDescription();
      const block = createBlockFromMnemonic(item);
      if (userMacroName) block.invokeMacroName = userMacroName;
      startMouseDnd(e, node, { type: "palette", block }, item.mnemonic);
    });

    paletteList.appendChild(node);
  }
}

function getSelectedMnemonic() {
  const category = categorySelect.value;
  return mnemonicLibrary[category].find((item) => item.mnemonic === mnemonicSelect.value);
}

function createBlockFromMnemonic(item) {
  if (item.isLabel) {
    const labelName = sanitizeLabelName(operandInput.value.trim() || "start");
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: getSelectedBase(),
      validationError: "",
      collapsed: true,
      isLabel: true,
      labelName
    };
  }

  if (item.isComment) {
    const rawOperand = operandInput.value.trim() || t("commentDefault");
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: rawOperand,
      rawOperand,
      description: item.description,
      addressingMode: "implied",
      base: "comment",
      validationError: "",
      collapsed: true,
      isComment: true
    };
  }

  if (item.isTextMacro) {
    const rawOperand = operandInput.value.trim() || "HELLO C64";
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: rawOperand,
      rawOperand,
      description: item.description,
      addressingMode: "implied",
      base: "text",
      validationError: validateTextMacroPosition(0, 0, rawOperand),
      collapsed: true,
      isTextMacro: true,
      textCharset: "standard",
      textX: 0,
      textY: 0
    };
  }

  if (item.isByteMacro) {
    const rawOperand = operandInput.value.trim() || "169,0,141,32,208";
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: rawOperand,
      rawOperand,
      description: item.description,
      addressingMode: "implied",
      base: "dec",
      validationError: validateByteMacro(rawOperand),
      collapsed: true,
      isByteMacro: true
    };
  }

  if (item.isStringMacro) {
    const rawOperand = operandInput.value.trim() || "HELLO";
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: rawOperand,
      rawOperand,
      description: item.description,
      addressingMode: "implied",
      base: "string",
      validationError: validateStringMacroAddress("C000"),
      collapsed: true,
      isStringMacro: true,
      stringAddress: "C000",
      textCharset: "standard"
    };
  }

  if (item.isDataMacro) {
    const rawOperand = operandInput.value.trim() || "0";
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: rawOperand,
      rawOperand,
      description: item.description,
      addressingMode: "implied",
      base: "dec",
      validationError: validateDataMacro(rawOperand, "C000"),
      collapsed: true,
      isDataMacro: true,
      dataAddress: "C000"
    };
  }

  if (item.isRawBytesMacro) {
    const rawOperand = operandInput.value.trim() || "0";
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: rawOperand,
      rawOperand,
      description: item.description,
      addressingMode: "implied",
      base: "dec",
      validationError: validateDataMacro(rawOperand, "C000"),
      collapsed: true,
      isRawBytesMacro: true,
      rawBytesAddress: "C000"
    };
  }

  if (item.isRawTextMacro) {
    const rawOperand = operandInput.value.trim() || "HELLO";
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: rawOperand,
      rawOperand,
      description: item.description,
      addressingMode: "implied",
      base: "string",
      validationError: validateStringMacroAddress("C000"),
      collapsed: true,
      isRawTextMacro: true,
      rawTextAddress: "C000"
    };
  }

  if (item.isPetsciiMacro) {
    const rawOperand = operandInput.value.trim() || "HELLO";
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: rawOperand,
      rawOperand,
      description: item.description,
      addressingMode: "implied",
      base: "string",
      validationError: validateStringMacroAddress("C000"),
      collapsed: true,
      isPetsciiMacro: true,
      petsciiAddress: "C000"
    };
  }

  if (item.isIncBinMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isIncBinMacro: true,
      incBinFile: "",
      incBinFileName: "",
      incBinAddress: "$C000",
      incBinBytes: []
    };
  }
  if (item.isSidMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: "SID",
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isSidMacro: true,
      sidFile: "",
      sidFileName: "",
      sidTitle: "",
      sidAuthor: "",
      sidLoadAddress: 0,
      sidInitAddress: 0,
      sidPlayAddress: 0,
      sidBytes: [],
      sidCustomAddress: ""
    };
  }
  if (item.isIncludeMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: "INCLUDE",
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isIncludeMacro: true,
      includeFile: "",
      includeFileName: "",
      includeAddress: "",
      includeCollapsed: false,
      includedBlocks: []
    };
  }
  if (item.isSpriteInitMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isSpriteInitMacro: true,
      spriteNum: "0",
      spriteColor: "7",
      spriteDataPage: "21"
    };
  }

  if (item.isLoadFileMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isLoadFileMacro: true,
      loadFileName: "DATA",
      loadFileDevice: "8",
      loadFileAddress: "",
      loadFileErrorLabel: ""
    };
  }

  if (item.isSpritePosMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isSpritePosMacro: true,
      spriteNum: "0",
      spriteX: "152",
      spriteY: "100"
    };
  }

  if (item.isJoystickMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isJoystickMacro: true,
      joyPort: "2",
      joySpriteNum: "0"
    };
  }

  if (item.isMouseMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isMouseMacro: true,
      mousePort: "2",
      mouseSpriteNum: "0",
      mousePotXZP: "FD",
      mousePotYZP: "FE"
    };
  }

  if (item.isWaitRasterMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isWaitRasterMacro: true,
      rasterLine: "FF"
    };
  }

  if (item.isSpriteColMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isSpriteColMacro: true,
      spriteNum: "0",
      colType: "sprite"
    };
  }

  if (item.isTurboSetMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isTurboSetMacro: true,
      turboSpeed: "7",
      turboBadline: "0"
    };
  }

  if (item.isSuperCpuDetectMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "", rawOperand: "", description: item.description,
      addressingMode: "implied", base: "hex", validationError: "",
      collapsed: true, isSuperCpuDetectMacro: true
    };
  }

  if (item.isTurboEnableMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "", rawOperand: "", description: item.description,
      addressingMode: "implied", base: "hex", validationError: "",
      collapsed: true, isTurboEnableMacro: true, turboEnableMode: "on"
    };
  }

  if (item.isReuCheckMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isReuCheckMacro: true
    };
  }

  if (item.isReuTransferMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isReuTransferMacro: true,
      reuC64Addr: "C000",
      reuExpAddr: "0000",
      reuBank: "0",
      reuLength: "0100"
    };
  }

  if (item.isLoopMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isLoopMacro: true,
      loopReg: "X",
      loopCount: "0A",
      loopLabel: ""  // auto-assigned in insertBlock
    };
  }

  if (item.isNextMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isNextMacro: true,
      nextLabel: "",  // auto-filled in insertBlock
      nextReg: "X"
    };
  }

  if (item.isForMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isForMacro: true,
      loopReg: "X",
      loopCount: "0A",
      loopLabel: ""  // auto-assigned in insertBlock
    };
  }

  if (item.isEndfMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isEndfMacro: true,
      nextLabel: "",  // auto-filled in insertBlock
      nextReg: "X",
      nextCount: "0A"
    };
  }

  if (item.isWordMacro) {
    const rawOperand = operandInput.value.trim() || "1000,2000";
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: rawOperand,
      rawOperand,
      description: item.description,
      addressingMode: "implied",
      base: "dec",
      validationError: validateWordMacro(rawOperand),
      collapsed: true,
      isWordMacro: true
    };
  }

  if (item.isFillMacro) {
    const rawOperand = operandInput.value.trim() || "256,0";
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: rawOperand,
      rawOperand,
      description: item.description,
      addressingMode: "implied",
      base: "dec",
      validationError: validateFillMacro(rawOperand),
      collapsed: true,
      isFillMacro: true
    };
  }

  if (item.isAlignMacro) {
    const rawOperand = operandInput.value.trim() || "64";
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: rawOperand,
      rawOperand,
      description: item.description,
      addressingMode: "implied",
      base: getSelectedBase(),
      validationError: validateAlignMacro(rawOperand, getSelectedBase()),
      collapsed: true,
      isAlignMacro: true
    };
  }

  if (item.isOrgMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: "ORG",
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: false,
      isOrgMacro: true,
      orgAddress: "0900"
    };
  }

  if (item.isTableMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isTableMacro: true,
      tableName: "table1",
      tableAddress: "C000"
    };
  }

  if (item.isDefineMacro) {
    const rawOperand = operandInput.value.trim() || "DEBUG";
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: rawOperand,
      rawOperand,
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: validateDefineMacro(rawOperand),
      collapsed: true,
      isDefineMacro: true,
      defineSymbol: rawOperand
    };
  }

  if (item.isConstMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "0000",
      rawOperand: "0000",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isConstMacro: true,
      constName: "MY_CONST",
      constValue: 0
    };
  }

  if (item.isIfMacro) {
    const rawOperand = operandInput.value.trim() || "DEBUG";
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: rawOperand,
      rawOperand,
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: validateIfMacro(rawOperand),
      collapsed: true,
      isIfMacro: true,
      ifCondition: rawOperand
    };
  }

  if (item.isElseMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isElseMacro: true
    };
  }

  if (item.isEndIfMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isEndIfMacro: true
    };
  }

  if (item.isPushMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isPushMacro: true,
      pushRegs: "A"  // default: only A register
    };
  }

  if (item.isPullMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isPullMacro: true,
      pullRegs: "A"  // default: only A register
    };
  }

  if (item.isMacroDefStart) {
    const macroName = operandInput.value.trim() || "my_macro";
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: macroName,
      rawOperand: macroName,
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isMacroDefStart: true,
      macroName: macroName
    };
  }

  if (item.isMacroDefEnd) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: true,
      isMacroDefEnd: true
    };
  }

  if (item.isMacroInvoke) {
    // Get first available macro name or empty
    const macroNames = Object.keys(userMacros);
    const firstMacro = macroNames.length > 0 ? macroNames[0] : "";
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: "INVOKE",  // Always keep INVOKE as the mnemonic
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: macroNames.length === 0 ? (currentLanguage === "en" ? "No macros defined yet" : "Meg nincs definialva makro") : "",
      collapsed: true,
      isMacroInvoke: true,
      invokeMacroName: firstMacro
    };
  }

  if (item.isRegionMacro) {
    const regionName = operandInput.value.trim() || "region";
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: "REGION",
      operand: regionName,
      rawOperand: regionName,
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: false,
      isRegionMacro: true,
      regionName,
      regionCollapsed: false
    };
  }

  if (item.isEndRegionMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: "ENDREGION",
      operand: "",
      rawOperand: "",
      description: item.description,
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      collapsed: false,
      isEndRegionMacro: true
    };
  }

  const modeKey = item.modes.includes(addressingSelect.value) ? addressingSelect.value : item.modes[0];
  const preview = buildOperandPreview(modeKey, operandInput.value.trim(), getSelectedBase());

  return {
    id: crypto.randomUUID(),
    category: categorySelect.value,
    mnemonic: item.mnemonic,
    operand: preview.operand,
    rawOperand: operandInput.value.trim(),
    description: item.description,
    addressingMode: modeKey,
    base: getSelectedBase(),
    validationError: preview.error,
    collapsed: true
  };
}

function collapseLoadedProgram(blocks) {
  const result = blocks.map((block) => ({
    ...block,
    collapsed: true,
    ...(block.isRegionMacro ? { regionCollapsed: true } : {})
  }));

  // Rebuild operand from rawOperand for all regular instruction blocks to fix
  // suffix/prefix mismatches (,X / ,Y / #) from older saved files
  result.forEach((block) => {
    const isMacroOrSpecial = block.isLabel || block.isComment || block.isAnonymousLabel || block.isLoopMacro ||
      block.isNextMacro || block.isForMacro || block.isEndfMacro || block.isTableMacro || block.isDefineMacro || block.isConstMacro ||
      block.isIfMacro || block.isElseMacro || block.isEndIfMacro || block.isByteMacro ||
      block.isWordMacro || block.isDataMacro || block.isRawBytesMacro || block.isFillMacro ||
      block.isAlignMacro || block.isTextMacro || block.isStringMacro || block.isRawTextMacro ||
      block.isPetsciiMacro || block.isIncBinMacro || block.isSidMacro || block.isIncludeMacro || block.isPushMacro ||
      block.isPullMacro || block.isMacroDefStart || block.isMacroDefEnd || block.isMacroInvoke ||
      block.isRegionMacro || block.isEndRegionMacro || block.isOrgMacro;
    if (!isMacroOrSpecial && block.rawOperand && block.addressingMode) {
      const preview = buildOperandPreview(block.addressingMode, block.rawOperand, block.base || "hex");
      if (!preview.error) block.operand = preview.operand;
      // Always clear stale validationError — live validation runs again on render
      block.validationError = preview.error;
    } else if (!isMacroOrSpecial) {
      // No operand or addressing mode → not an error state
      block.validationError = "";
    }
  });

  // Initialize nextReg for NEXT blocks based on their matching LOOP
  result.forEach((block, index) => {
    if (block.isNextMacro && block.nextLabel) {
      const matching = result.find(b => b.isLoopMacro && b.loopLabel === block.nextLabel);
      if (matching) {
        block.nextReg = matching.loopReg || "X";
      }
    }
    if (block.isEndfMacro && block.nextLabel) {
      const matching = result.find(b => b.isForMacro && b.loopLabel === block.nextLabel);
      if (matching) {
        block.nextReg = matching.loopReg || "X";
        block.nextCount = matching.loopCount || "0A";
      }
    }
  });

  return result;
}

function addSelectedBlock() {
  const selected = getSelectedMnemonic();
  if (expertMode && expertEditor) {
    const block = createBlockFromMnemonic(selected);
    const line = _blockToExpertLine(block);
    _expertInsertLine(line);
  } else {
    let insertIndex = program.length;
    if (selectedBlockId) {
      const idx = program.findIndex(b => b.id === selectedBlockId);
      if (idx !== -1) insertIndex = idx + 1;
    }
    const newBlock = createBlockFromMnemonic(selected);
    insertBlock(insertIndex, newBlock);
    // Always track the newly inserted block in the palette, regardless of blockPaletteSync toggle
    selectedBlockId = newBlock.id;
    _syncPaletteToBlock(newBlock.id, true);
    requestAnimationFrame(() => {
      document.querySelectorAll(".asm-block--selected").forEach(el => el.classList.remove("asm-block--selected"));
      const blockNode = programList.querySelector(`[data-block-id="${newBlock.id}"]`);
      if (blockNode) {
        blockNode.classList.add("asm-block--selected");
        blockNode.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
  }
}

// Convert a block to its expert-mode source line representation
function _blockToExpertLine(block) {
  // Helper: prefix each comma-separated token with $ if base is hex
  const fmtRaw = (raw, base) => {
    if ((base || "hex") !== "hex") return raw || "0";
    return (raw || "0").split(",").map(t => {
      const s = t.trim();
      return s.startsWith("$") || s === "" ? s : "$" + s;
    }).join(", ");
  };
  if (block.isOrgMacro)       return `* = $${(block.orgAddress || "0801").toUpperCase()}`;
  if (block.isLabel)          return `${block.labelName || "start"}:`;
  if (block.isAnonymousLabel) return "-";
  if (block.isComment)        return `; ${block.rawOperand || ""}`;
  if (block.isTextMacro)      return `.text ${block.textX || 0}, ${block.textY || 0}, "${block.rawOperand || ""}"`;
  if (block.isStringMacro)    return `.string $${(block.stringAddress || "C000").toUpperCase()}, "${block.rawOperand || ""}"`;
  if (block.isRawTextMacro)   return `.rawtext $${(block.rawTextAddress || "C000").replace(/^\$/,"").toUpperCase()}, "${block.rawOperand || ""}"`;
  if (block.isDataMacro)      return `.data $${(block.dataAddress || "C000").replace(/^\$/,"").toUpperCase()}, ${fmtRaw(block.rawOperand, block.base)}`;
  if (block.isRawBytesMacro)  return `.rawbytes $${(block.rawBytesAddress || "C000").replace(/^\$/,"").toUpperCase()}, ${fmtRaw(block.rawOperand, block.base)}`;
  if (block.isByteMacro)      return `.byte ${fmtRaw(block.rawOperand, block.base)}`;
  if (block.isWordMacro)      return `.word ${fmtRaw(block.rawOperand, block.base)}`;
  if (block.isFillMacro)      return `.fill ${fmtRaw(block.rawOperand, block.base)}`;
  if (block.isAlignMacro)     return `.align ${block.rawOperand || "64"}`;
  if (block.isIncBinMacro)    return `.incbin "${block.incBinFileName || "data.bin"}"${block.incBinAddress && block.incBinAddress !== "$C000" ? ", $" + block.incBinAddress.replace(/^\$/,"") : ""}`;
  if (block.isPetsciiMacro)   return `.petscii $${(block.petsciiAddress || "C000").replace(/^\$/,"").toUpperCase()}, "${block.rawOperand || "HELLO"}"`;
  if (block.isTableMacro)     return block.tableAddress ? `.table ${block.tableName || "table1"} $${block.tableAddress.replace(/^\$/,"").toUpperCase()}` : `.table ${block.tableName || "table1"}`;  
  if (block.isLoadFileMacro)  return `.loadfile "${block.loadFileName || "DATA"}", ${block.loadFileDevice || "8"}${block.loadFileAddress ? ", $" + block.loadFileAddress.replace(/^\$/,"") : ""}${block.loadFileErrorLabel ? ", " + block.loadFileErrorLabel : ""}`;
  if (block.isSidMacro)       return `.sid "${block.sidFileName || "music.sid"}"${block.sidCustomAddress ? ", $" + block.sidCustomAddress.replace(/^\$/, "") : ""}`;  
  if (block.isIncludeMacro)   return `.include "${block.includeFileName || "library.json"}"${block.includeAddress ? ", $" + block.includeAddress.replace(/^\$/, "") : ""}`;  
  if (block.isLoopMacro)      return `.loop ${block.loopReg || "X"}, $${(block.loopCount || "0A").toUpperCase()}, ${block.loopLabel || "loop1"}`;
  if (block.isNextMacro)      return `.next ${block.nextLabel || "loop1"}`;
  if (block.isForMacro)     return `.for ${block.loopReg || "X"}, $${(block.loopCount || "0A").toUpperCase()}, ${block.loopLabel || "loop1"}`;
  if (block.isEndfMacro)     return `.endf ${block.nextLabel || "loop1"}`;
  if (block.isPushMacro)      return `.push ${block.pushRegs || "A"}`;
  if (block.isPullMacro)      return `.pull ${block.pullRegs || "A"}`;
  if (block.isConstMacro) {
    const raw = String(block.rawOperand ?? block.constValue ?? "0").trim();
    const base = block.base || "hex";
    let formatted;
    if (base === "dec") {
      formatted = raw.replace(/^\$/, "") ; // already decimal digits
    } else if (base === "hex") {
      // rawOperand stores the hex digits without $; re-add $
      const digits = raw.replace(/^\$/, "").toUpperCase();
      formatted = "$" + digits;
    } else {
      // fallback: use constValue
      const num = block.constValue ?? 0;
      formatted = "$" + num.toString(16).toUpperCase();
    }
    return `.const ${block.constName || "MY_CONST"} = ${formatted}`;
  }
  if (block.isDefineMacro)    return `.define ${block.rawOperand || "SYMBOL"}`;
  if (block.isIfMacro)        return `.if ${block.rawOperand || "SYMBOL"}`;
  if (block.isElseMacro)      return `.else`;
  if (block.isEndIfMacro)     return `.endif`;
  if (block.isRegionMacro)    return `.region ${block.regionName || "region"}`;
  if (block.isEndRegionMacro) return `.endregion`;
  if (block.isMacroDefStart)  return `.macro ${block.macroName || block.rawOperand || "myMacro"}`;
  if (block.isMacroDefEnd)    return `.endm`;
  if (block.isMacroInvoke)    return `.invoke ${block.invokeMacroName || "myMacro"}`;
  if (block.isSpriteInitMacro)return `.sprite_init ${block.spriteNum || 0}, ${block.spriteColor || 7}, $${(block.spriteDataPage || "21").toUpperCase()}`;
  if (block.isSpritePosMacro) return `.sprite_pos ${block.spriteNum || 0}, ${block.spriteX || 152}, ${block.spriteY || 100}`;
  if (block.isWaitRasterMacro)return `.wait_raster $${(block.rasterLine || "FF").toUpperCase()}`;
  if (block.isTurboSetMacro) return `.turbo_set ${block.turboSpeed || "7"},${block.turboBadline || "0"}`;
  if (block.isSuperCpuDetectMacro) return `.supercpu_detect`;
  if (block.isTurboEnableMacro)    return `.turbo_enable ${block.turboEnableMode || "on"}`;
  if (block.isJoystickMacro)  return `.joystick ${block.joyPort || 2}, ${block.joySpriteNum || 0}`;
  if (block.isMouseMacro)     return `.mouse ${block.mousePort || 2}, ${block.mouseSpriteNum || 0}, ${(block.mousePotXZP || "FD").toUpperCase()}, ${(block.mousePotYZP || "FE").toUpperCase()}`;
  if (block.isSpriteColMacro) return `.sprite_col ${block.spriteNum || 0}, ${block.colType || "background"}`;
  if (block.isReuCheckMacro)  return `.reu_check`;
  if (block.isReuTransferMacro) {
    const t = block.mnemonic.toLowerCase(); // reu_stash/reu_fetch/reu_swap
    return `.${t} $${(block.reuC64Addr||"C000").toUpperCase()}, $${(block.reuExpAddr||"0000").toUpperCase()}, ${block.reuBank||0}, $${(block.reuLength||"0100").toUpperCase()}`;
  }
  // Plain instruction
  const mnem = block.mnemonic || "NOP";
  const op = block.operand ? `    ${mnem} ${block.operand}` : `    ${mnem}`;
  return op.trimEnd();
}

// Sync expert editor from current program[] — call after loading a project/sample in expert mode
function _expertSyncFromProgram() {
  if (!expertEditor) return;
  _expertAcHide();
  const lines = program.map(_blockToExpertLine).join("\n");
  expertEditor.value = lines;
  _expertApplyHighlight();
  _expertValidate();
}

// Insert a line at cursor position (or end) in the expert editor
function _expertInsertLine(line) {
  if (!expertEditor) return;
  const ta = expertEditor;
  const val = ta.value;
  const start = ta.selectionStart ?? val.length;

  // Find the start of the current line
  let lineStart = val.lastIndexOf("\n", start - 1) + 1;
  // Find end of current line
  let lineEnd = val.indexOf("\n", start);
  if (lineEnd === -1) lineEnd = val.length;

  // Insert after current line
  const before = val.slice(0, lineEnd);
  const after  = val.slice(lineEnd);
  const insert = "\n" + line;
  ta.value = before + insert + after;
  // Move cursor to end of inserted line
  const newCursor = lineEnd + insert.length;
  ta.setSelectionRange(newCursor, newCursor);
  ta.focus();

  _expertApplyHighlight();
  _expertValidate();
}

function makeDefaultOrgBlock() {
  return {
    id: crypto.randomUUID(),
    category: "Makrok",
    mnemonic: "ORG",
    operand: "",
    rawOperand: "",
    description: "Fordítási cím beállítása",
    addressingMode: "implied",
    base: "hex",
    validationError: "",
    collapsed: false,
    isOrgMacro: true,
    orgAddress: "0801"
  };
}

function clearProgram() {
  document.querySelector(".control-menu")?.removeAttribute("open");
  const dialog = document.getElementById("new-program-dialog");
  if (dialog) {
    document.getElementById("new-program-dialog-msg").textContent = t("newProgramConfirmMsg");
    document.getElementById("new-program-confirm").textContent = t("newProgramConfirmBtn");
    document.getElementById("new-program-cancel").textContent = t("cancel");
    dialog.showModal();
    return;
  }
  doClearProgram();
}

function doClearProgram() {
  program = [makeDefaultOrgBlock()];
  userMacros = {};
  selectedBlockId = null;
  markTabClean();
  renderProgram();

  // Clear current file display
  _setCurrentFile("", "", null);
}

function isProgramEmpty() {
  if (expertMode) {
    const blocks = _expertGetStartupProgram() || _expertBuildProgram();
    return blocks.every(b => b.isOrgMacro || b.isRegionMacro || b.isEndRegionMacro || b.isComment || b.isDefineMacro);
  }
  return program.every(b => b.isOrgMacro || b.isRegionMacro || b.isEndRegionMacro || b.isComment || b.isDefineMacro);
}

// ── Expert Mode ────────────────────────────────────────────────────────────

let expertMode = false;
let _expertParseTimer = null;
let _expertErrorLineNos = new Set();  // source line indices (0-based) with compile errors
let _expertAsmFilePath = "";          // current .asm file path (empty = unsaved)

function setExpertMode(on) {
  if (!on && expertMode) {
    // Convert expert text → program blocks before switching off
    const blocks = _expertBuildProgram();
    if (blocks && blocks.length > 0) {
      program = blocks.map(b => ({ ...b, collapsed: false }));
    }
  }
  expertMode = on;
  document.body.classList.toggle("expert-mode", on);
  if (expertPanel) expertPanel.hidden = !on;
  if (expertModeToggle) expertModeToggle.checked = on;
  if (on) { _expertSyncFromProgram(); renderExpertOriginInfo(); }
  else renderProgram();
  saveUiSettings();
}

function _expertSetStatus(text, type) {
  if (!expertStatus) return;
  expertStatus.textContent = text;
  expertStatus.className = "expert-status" + (type ? " expert-status--" + type : "");
}

function renderExpertOriginInfo() {
  const el = document.getElementById("expert-origin-info");
  if (!el) return;
  const text = expertEditor ? expertEditor.value : "";
  const useBasicSys = basicSysToggle ? basicSysToggle.checked : true;

  // Find first * = $XXXX or * = XXXX directive (not in a comment)
  let origin = null;
  for (const line of text.split("\n")) {
    const stripped = line.replace(/;.*$/, "").trim();
    const m = stripped.match(/^\*\s*=\s*\$(\s*[0-9A-Fa-f]{1,4})\b/) ||
              stripped.match(/^\*\s*=\s*(\d{1,5})\b/);
    if (m) {
      const isHex = stripped.includes("$");
      origin = isHex ? parseInt(m[1].trim(), 16) : parseInt(m[1], 10);
      break;
    }
  }
  if (origin === null) origin = defaultOrigin;

  if (!useBasicSys) {
    el.textContent = `* = $${origin.toString(16).toUpperCase().padStart(4,"0")} (${origin}) ⚠ No BASIC SYS`;
    el.className = "expert-origin-info expert-origin-info--warn";
  } else {
    // With BASIC SYS stub, show the actual SYS address
    const rawOrigin = (origin === 0x0801) ? 0x080D : origin;
    const stubDigits = String(rawOrigin).length;
    const stubDataSize = 2 + 2 + 1 + stubDigits + 1 + 2;
    const codeAddr = Math.max(rawOrigin, 0x0801 + stubDataSize);
    el.textContent = `SYS ${codeAddr} ($${codeAddr.toString(16).toUpperCase().padStart(4,"0")})`;
    el.className = "expert-origin-info";
  }
}

/* ── Syntax highlight ─────────────────────────────────────────────── */
const _EXPERT_MNEM_SET = new Set([
  "ADC","AND","ASL","BCC","BCS","BEQ","BIT","BMI","BNE","BPL","BRK","BVC","BVS",
  "CLC","CLD","CLI","CLV","CMP","CPX","CPY","DEC","DEX","DEY","EOR","INC","INX",
  "INY","JMP","JSR","LDA","LDX","LDY","LSR","NOP","ORA","PHA","PHP","PLA","PLP",
  "ROL","ROR","RTI","RTS","SBC","SEC","SED","SEI","STA","STX","STY","TAX","TAY",
  "TSX","TXA","TXS","TYA"
]);

// Directive name (without dot) → uppercase mnemonic in mnemonicLibrary
const _DIRECTIVE_TO_MNEM = {
  text:"TEXT", string:"STRING", rawtext:"RAWTEXT", rawbytes:"RAWBYTES", data:"DATA",
  byte:"BYTE", word:"WORD", fill:"FILL", align:"ALIGN", incbin:"INCBIN",
  petscii:"PETSCII", table:"TABLE", loadfile:"LOADFILE", sid:"SID", include:"INCLUDE",
  loop:"LOOP", next:"NEXT", push:"PUSH", pull:"PULL",
  macro:"MACRO", endm:"ENDM", invoke:"INVOKE",
  sprite_init:"SPRITE_INIT", sprite_pos:"SPRITE_POS", wait_raster:"WAIT_RASTER",
  joystick:"JOYSTICK", mouse:"MOUSE", sprite_col:"SPRITE_COL", turbo_set:"TURBO_SET",
  supercpu_detect:"SUPERCPU_DETECT", turbo_enable:"TURBO_ENABLE",
  reu_check:"REU_CHECK", reu_stash:"REU_STASH", reu_fetch:"REU_FETCH", reu_swap:"REU_SWAP",
  define:"DEFINE", if:"IF", else:"ELSE", endif:"ENDIF", const:"CONST", org:"ORG",
  region:"REGION", endregion:"ENDREGION"
};

// Lazy-built: mnemonic → category
let _expertMnemCatMap = null;
function _getExpertMnemCatMap() {
  if (_expertMnemCatMap) return _expertMnemCatMap;
  _expertMnemCatMap = new Map();
  for (const [cat, items] of Object.entries(mnemonicLibrary)) {
    for (const item of items) _expertMnemCatMap.set(item.mnemonic.toUpperCase(), cat);
  }
  return _expertMnemCatMap;
}

// ── Expert autocomplete ────────────────────────────────────────────────────────────────────────
const _AC_DIRECTIVES = Object.keys(_DIRECTIVE_TO_MNEM).map(k => "."+k);

const _AC_DIRECTIVE_DESC = {
  ".org":"set origin", ".byte":"raw byte(s)", ".word":"16-bit value",
  ".fill":"repeat bytes", ".align":"align boundary", ".text":"screen text macro",
  ".string":"string at address", ".rawtext":"raw screen codes", ".rawbytes":"raw bytes at addr",
  ".data":"data macro", ".incbin":"include binary", ".sid":"SID player macro",
  ".include":"include file", ".loop":"loop start", ".next":"loop end",
  ".push":"push registers", ".pull":"pop registers",
  ".macro":"define macro", ".endm":"end macro", ".invoke":"call macro",
  ".define":"define symbol", ".if":"conditional", ".else":"else branch", ".endif":"end if",
  ".const":"constant", ".table":"lookup table", ".petscii":"PETSCII string",
  ".loadfile":"load file KERNAL", ".sprite_init":"init sprite", ".sprite_pos":"set sprite pos",
  ".wait_raster":"wait raster line", ".joystick":"joystick macro", ".mouse":"1351 mouse macro", ".sprite_col":"sprite collision",
  ".turbo_set":"U64 turbo speed",
  ".supercpu_detect":"detect SuperCPU",
  ".turbo_enable":"SuperCPU turbo on/off",
  ".reu_check":"detect REU", ".reu_stash":"C64→REU DMA", ".reu_fetch":"REU→C64 DMA", ".reu_swap":"C64↔REU DMA",
  ".region":"visual region", ".endregion":"end region"
};

let _acActive = -1;

function _expertAcEl() {
  let el = document.getElementById("expert-ac");
  if (!el) {
    el = document.createElement("div");
    el.id = "expert-ac";
    el.className = "expert-autocomplete";
    el.setAttribute("hidden", "");
    document.body.appendChild(el);
  }
  return el;
}

function _expertAcVisible() {
  const el = document.getElementById("expert-ac");
  return el && !el.hasAttribute("hidden");
}

function _expertAcHide() {
  const el = document.getElementById("expert-ac");
  if (el) el.setAttribute("hidden", "");
  _acActive = -1;
}

function _expertAcMove(dir) {
  const el = _expertAcEl();
  const items = el.querySelectorAll(".expert-ac-item");
  if (!items.length) return;
  items[_acActive]?.classList.remove("active");
  _acActive = (_acActive + dir + items.length) % items.length;
  const next = items[_acActive];
  next?.classList.add("active");
  next?.scrollIntoView({ block: "nearest" });
}

function _expertAcCommit() {
  const el = _expertAcEl();
  const active = el.querySelector(".expert-ac-item.active");
  const item = active || el.querySelector(".expert-ac-item");
  if (!item) return false;
  _expertAcInsert(item.dataset.value, item.dataset.kind);
  return true;
}

function _expertAcInsert(value, kind) {
  if (!expertEditor) return;
  const ta = expertEditor;
  const pos = ta.selectionStart;
  const before = ta.value.slice(0, pos);
  const after = ta.value.slice(pos);

  let replaceFrom, replaceWith;
  if (kind === "mnemonic" || kind === "label") {
    // Replace the typed word — use ([\ s\S]*\s) to anchor at the whitespace before the word
    // This avoids the greedy ([\ s\S]*) bug that only replaces the last character.
    const wordRe = kind === "label"
      ? /^([\s\S]*\s)([A-Za-z_]\w*)?$/
      : /^([\s\S]*\s)([A-Za-z]{1,4})?$/;
    const m = before.match(wordRe);
    if (!m) return;
    replaceFrom = m[1].length;
    replaceWith = value + (kind === "label" ? "" : " ");
  } else {
    // Directive: replace from the last dot
    const dotIdx = before.lastIndexOf(".");
    if (dotIdx === -1) return;
    replaceFrom = dotIdx;
    replaceWith = value + " ";
  }

  ta.value = before.slice(0, replaceFrom) + replaceWith + after;
  const newPos = replaceFrom + replaceWith.length;
  ta.selectionStart = ta.selectionEnd = newPos;
  _expertAcHide();
  _expertApplyHighlight();
  _expertValidate();
  renderExpertOriginInfo();
  markTabDirty();
}

function _expertAcUpdate() {
  if (!expertEditor) return;
  const ta = expertEditor;
  const pos = ta.selectionStart;
  const lineStart = ta.value.lastIndexOf("\n", pos - 1) + 1;
  const lineText = ta.value.slice(lineStart, pos);

  // Directive completion: line is optional whitespace + dot + optional word chars
  const mDir = lineText.match(/^\s*(\.\w*)$/);
  if (mDir) {
    const typed = mDir[1].toLowerCase();
    const matches = typed === "." ? _AC_DIRECTIVES
      : _AC_DIRECTIVES.filter(d => d.startsWith(typed));
    if (!matches.length) { _expertAcHide(); return; }
    _expertAcShowList(matches.map(d => ({
      value: d,
      label: d,
      desc: _AC_DIRECTIVE_DESC[d] || "",
      kind: "directive"
    })), ta, pos);
    return;
  }

  // Mnemonic completion: line is optional whitespace + 1-4 uppercase/lowercase letters (no dot, no colon yet)
  const mMnem = lineText.match(/^(\s+)([A-Za-z]{1,4})$/);
  if (mMnem) {
    const typed = mMnem[2].toUpperCase();
    const mnems = [..._EXPERT_MNEM_SET].filter(m => m.startsWith(typed));
    if (!mnems.length) { _expertAcHide(); return; }
    mnems.sort();
    _expertAcShowList(mnems.map(m => ({
      value: m,
      label: m,
      desc: mnemonicDescriptionsEn[m] ? mnemonicDescriptionsEn[m].replace(/\.$/, "") : "",
      kind: "mnemonic"
    })), ta, pos);
    return;
  }

  // Label completion: line is whitespace + mnemonic + whitespace + optional typed word (operand position)
  // Triggers immediately after the space following the mnemonic, even before any letter is typed.
  const mLabel = lineText.match(/^\s+[A-Za-z]{2,4}\s+([A-Za-z_]\w*)?$/);
  if (mLabel !== null) {
    const typed = mLabel[1] || "";
    const allLabels = _expertGetLabels(ta.value);
    const labels = typed ? allLabels.filter(l => l.startsWith(typed)) : allLabels;
    if (!labels.length) { _expertAcHide(); return; }
    _expertAcShowList(labels.map(l => ({
      value: l,
      label: l,
      desc: "label",
      kind: "label"
    })), ta, pos);
    return;
  }

  _expertAcHide();
}

function _expertGetLabels(src) {
  const labels = [];
  for (const line of src.split("\n")) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*):/);
    if (m) labels.push(m[1]);
  }
  return labels;
}

function _expertAcShowList(items, ta, pos) {
  const el = _expertAcEl();
  _acActive = -1;
  el.innerHTML = items.map(it =>
    `<div class="expert-ac-item" data-value="${it.value}" data-kind="${it.kind}">` +
    `<span class="expert-ac-item-kw">${it.label}</span>` +
    (it.desc ? `<span class="expert-ac-item-desc">${it.desc}</span>` : "") +
    `</div>`
  ).join("");

  el.querySelectorAll(".expert-ac-item").forEach(item => {
    item.addEventListener("mousedown", ev => {
      ev.preventDefault();
      _expertAcInsert(item.dataset.value, item.dataset.kind);
    });
  });

  // Position below the cursor line using textarea bounding rect
  const taRect = ta.getBoundingClientRect();
  const lineH = parseInt(window.getComputedStyle(ta).lineHeight) || 18;
  const linesBeforeCursor = ta.value.slice(0, pos).split("\n").length - 1;
  const paddingTop = parseInt(window.getComputedStyle(ta).paddingTop) || 0;
  const caretTop = taRect.top + paddingTop + linesBeforeCursor * lineH - ta.scrollTop;
  const caretBottom = caretTop + lineH;

  el.style.visibility = "hidden";
  el.removeAttribute("hidden");
  const elW = el.offsetWidth || 220;
  const elH = el.offsetHeight || 200;
  el.setAttribute("hidden", "");
  el.style.visibility = "";

  let x = taRect.left + 8;
  let y = caretBottom + 4;
  if (x + elW > window.innerWidth - 8) x = window.innerWidth - elW - 8;
  if (y + elH > window.innerHeight - 8) y = caretTop - elH - 2;
  if (y < 8) y = 8;
  el.style.left = x + "px";
  el.style.top  = y + "px";
  el.removeAttribute("hidden");
}

function _expertFormatSource() {
  if (!expertEditor) return;

  function splitComment(raw) {
    let inStr = false, idx = -1;
    for (let i = 0; i < raw.length; i++) {
      if (raw[i] === '"') inStr = !inStr;
      else if (raw[i] === ";" && !inStr) { idx = i; break; }
    }
    return idx >= 0
      ? { code: raw.slice(0, idx).trimEnd(), comment: "  " + raw.slice(idx).trim() }
      : { code: raw.trim(), comment: "" };
  }

  function formatInstr(code) {
    const m = code.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)\s*(.*)/s);
    if (!m) return code.trim();
    const mnem = _EXPERT_MNEM_SET.has(m[1].toUpperCase()) ? m[1].toUpperCase() : m[1];
    const operand = m[2].trim();
    return operand ? mnem + " " + operand : mnem;
  }

  try {
    const lines = expertEditor.value.split("\n");
    const out = lines.map(raw => {
      if (!raw.trim()) return "";

      // Preserve the original leading whitespace
      const origIndent = raw.match(/^(\s*)/)[1];

      const { code, comment } = splitComment(raw);
      if (!code) return origIndent + comment.trim();

      // * = $xxxx  (org) — always at col 0
      if (/^\*\s*=/.test(code)) {
        return code.replace(/\s+/g, " ") + comment;
      }

      // Label definition: "name:" optionally followed by instruction — always at col 0
      const labelM = code.match(/^([A-Za-z_][A-Za-z0-9_]*\s*:)\s*(.*)/s);
      if (labelM) {
        const label = labelM[1].trimEnd();
        const rest  = labelM[2].trim();
        if (!rest) return label + comment;
        return label + " " + formatInstr(rest) + comment;
      }

      // .directive or !directive lines — normalize to col 0 (like _blockToExpertLine generates)
      if (/^[.!]/.test(code)) {
        return code.trim() + comment;
      }

      // Regular instruction — always 4-space indent, normalize mnemonic/operand
      return "    " + formatInstr(code) + comment;
    });

    const result = out.join("\n");
    if (result === expertEditor.value) {
      _expertSetStatus(currentLanguage === "en" ? "Already formatted" : "Már formázott", "ok");
      return;
    }
    const sel = expertEditor.selectionStart;
    expertEditor.value = result;
    expertEditor.selectionStart = Math.min(sel, result.length);
    expertEditor.selectionEnd   = Math.min(sel, result.length);
    _expertApplyHighlight();
    markTabDirty();
    clearTimeout(_expertParseTimer);
    _expertParseTimer = setTimeout(() => _expertValidate(), 0);
    _expertSetStatus(currentLanguage === "en" ? "Formatted" : "Formázva", "ok");
  } catch (err) {
    _expertSetStatus("Format error: " + String(err), "error");
    console.error("_expertFormatSource error:", err);
  }
}

// ── VASM file I/O ────────────────────────────────────────────────────────────

async function _expertSaveAsm() {
  if (!expertEditor) return;
  const content = expertEditor.value;
  try {
    const res = await window.electronAPI?.saveAsmFile?.(_expertAsmFilePath || "", content);
    if (!res || res.canceled) return;
    if (!res.ok) {
      _expertSetStatus(t("vasmSaveError") + ": " + res.error, "error");
      return;
    }
    _expertAsmFilePath = res.filePath;
    const name = res.filePath.replace(/\\/g, "/").split("/").pop();
    if (expertFileName) expertFileName.textContent = name;
    _expertSetStatus(t("vasmSavedStatus") + ": " + name, "ok");
  } catch (e) {
    _expertSetStatus(t("vasmSaveError") + ": " + String(e), "error");
  }
}

async function _expertLoadAsm() {
  try {
    const res = await window.electronAPI?.chooseAsmFile?.();
    if (!res || res.canceled) return;
    if (!res.ok) {
      _expertSetStatus(t("vasmLoadError") + ": " + res.error, "error");
      return;
    }

    const filePath = res.filePath;
    const name = filePath.replace(/\\/g, "/").split("/").pop();

    // Save current tab state
    _tabSaveCurrent();

    // Parse ASM text into blocks
    const blocks = parseExpertText(res.content);
    _addSrcLineToBlocks(res.content, blocks);

    // Create new tab
    const tab = _tabCreate(name);
    tab.filePath = filePath;
    tab.program = blocks;
    tab.expertText = res.content;
    tab.userMacros = {};
    tabs.push(tab);
    activeTabId = tab.id;

    // Update active state
    program = JSON.parse(JSON.stringify(blocks));
    userMacros = {};
    selectedBlockId = null;
    _expertAsmFilePath = filePath;

    if (currentFileDisplay) currentFileDisplay.textContent = name;
    if (expertFileName) expertFileName.textContent = name;
    updateWindowTitle(name);

    // Update expert editor if in expert mode
    if (expertMode && expertEditor) {
      expertEditor.value = res.content;
      expertEditor.dispatchEvent(new Event("input"));
    }

    parseUserMacros();
    renderTabBar();
    renderProgram();
    renderAsmOutput();
    markTabClean();

    _expertSetStatus(t("vasmLoadedStatus") + ": " + name, "ok");
  } catch (e) {
    _expertSetStatus(t("vasmLoadError") + ": " + String(e), "error");
  }
}

// ── Build info dialog ────────────────────────────────────────────────────────

function showBuildInfoDialog() {
  const buildInfoDialog  = document.getElementById("build-info-dialog");
  const buildInfoContent = document.getElementById("build-info-content");
  const buildInfoTitle   = document.getElementById("build-info-title");
  if (!buildInfoDialog || !buildInfoContent) return;

  if (buildInfoTitle) buildInfoTitle.textContent = t("buildInfoTitle");

  const makeRow = (key, val, extra = "") =>
    `<div class="build-info-row"><span class="build-info-row-key">${key}</span><span class="build-info-row-val">${val}</span>${extra ? `<span class="build-info-row-note">${extra}</span>` : ""}</div>`;
  const makeSection = (label, rows) => {
    if (!rows.length) return "";
    return `<div class="build-info-section"><div class="build-info-section-label">${label}</div>${rows.join("")}</div>`;
  };

  let blocks;
  if (expertMode && expertEditor) {
    blocks = _expertBuildProgram();
  } else {
    blocks = program;
  }
  const savedProgram = program;
  const savedUserMacros = userMacros;
  program = blocks;
  parseUserMacros();

  let infoHtml = "";
  try {
    const layout = getProgramLayout();
    const labels = new Map();
    layout.lines.forEach(line => {
      if (line.block.isLabel && line.block.labelName) labels.set(line.block.labelName, line.address);
      if (line.block.isLoopMacro && line.block.loopLabel) labels.set(line.block.loopLabel, line.address + 2);
      if (line.block.isForMacro && line.block.loopLabel) labels.set(line.block.loopLabel, line.address + 2);
      if (line.block.isConstMacro && line.block.constName) {
        const v = parseNumberByBase((line.block.rawOperand || "").replace(/^\$/, ""), line.block.base);
        if (v !== null) labels.set(line.block.constName, v);
      }
    });
    labels._anonAddrs = _collectAnonLabels(layout);

    const origin = layout.lines.length ? layout.lines[0].address : 0;
    let totalBytes = 0, maxAddr = origin;
    for (const line of layout.lines) {
      if (line.conditionallySkipped) continue;
      if (line.size > 0) {
        totalBytes += line.size;
        maxAddr = Math.max(maxAddr, line.address + line.size);
      }
    }
    const fmtAddr = a => "$" + a.toString(16).toUpperCase().padStart(4, "0");

    const compileErrors = [];
    for (const line of layout.lines) {
      if (line.conditionallySkipped) continue;
      if (line.block.isLabel || line.block.isComment || line.block.isIncludeMacro) continue;
      if (line.block._isSavedAddress || line.block._isRestoreAddress || line.block.isOrgMacro) continue;
      if (line.block.validationError) { compileErrors.push(line.block.validationError); continue; }
      const result = compileLineBytes(line, labels);
      if (!result.ok) compileErrors.push(result.error);
    }

    const labelList = [];
    const constList = [];
    const macroCount = new Map();

    layout.lines.forEach(line => {
      if (line.conditionallySkipped) return;
      const b = line.block;
      if (b.isLabel && b.labelName) labelList.push({ name: b.labelName, addr: fmtAddr(line.address) });
      if (b.isLoopMacro && b.loopLabel) labelList.push({ name: b.loopLabel, addr: fmtAddr(line.address + 2) });
      if (b.isConstMacro && b.constName) {
        const v = parseNumberByBase((b.rawOperand || "").replace(/^\$/, ""), b.base);
        constList.push({ name: b.constName, val: v !== null ? fmtAddr(v) : (b.rawOperand || "?") });
      }
      const macroTypes = [
        "isTextMacro","isStringMacro","isDataMacro","isRawBytesMacro","isRawTextMacro",
        "isLoopMacro","isNextMacro","isForMacro","isEndfMacro","isSpriteInitMacro","isSpritePosMacro","isWaitRasterMacro",
        "isJoystickMacro","isMouseMacro","isSpriteColMacro","isIncBinMacro","isSidMacro",
        "isLoadFileMacro","isReuStashMacro","isReuFetchMacro","isReuSwapMacro","isReuCheckMacro",
        "isTurboSetMacro","isTurboEnableMacro","isSuperCpuDetectMacro",
      ];
      macroTypes.forEach(t2 => {
        if (b[t2]) {
          const key = t2.replace(/^is/, "").replace(/Macro$/, "");
          macroCount.set(key, (macroCount.get(key) || 0) + 1);
        }
      });
    });

    const summaryRows = [
      makeRow(t("buildInfoOrigin"), fmtAddr(origin)),
      makeRow(t("buildInfoEnd"),    maxAddr > origin ? fmtAddr(maxAddr - 1) : fmtAddr(origin)),
      makeRow(t("buildInfoSize"),   totalBytes + " bytes"),
    ];
    infoHtml += makeSection(t("buildInfoTitle"), summaryRows);

    if (compileErrors.length) {
      const errRows = compileErrors.map(e =>
        `<div class="build-info-row build-info-err"><span class="build-info-row-val">${e}</span></div>`);
      infoHtml += makeSection(t("buildInfoErrors"), errRows);
    }
    if (labelList.length) {
      infoHtml += makeSection(t("buildInfoLabels"), labelList.map(l => makeRow(l.name, l.addr)));
    }
    if (constList.length) {
      infoHtml += makeSection(t("buildInfoConsts"), constList.map(c => makeRow(c.name, c.val)));
    }
    if (macroCount.size) {
      infoHtml += makeSection(t("buildInfoMacros"),
        [...macroCount.entries()].map(([k, v]) => makeRow(k, v + "×")));
    }
    if (!compileErrors.length && !labelList.length && !constList.length && !macroCount.size) {
      infoHtml += `<div class="build-info-row"><span class="build-info-row-val">${t("buildInfoNoErrors")}</span></div>`;
    }
  } catch (e) {
    infoHtml = `<div class="build-info-row build-info-err"><span class="build-info-row-val">Error: ${e.message}</span></div>`;
  } finally {
    program = savedProgram;
    userMacros = savedUserMacros;
  }

  buildInfoContent.innerHTML = infoHtml;
  buildInfoDialog.showModal();
}

function _expertHighlightLine(raw) {
  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  if (raw === "") return "";

  // Split off comment (ignore ';' inside strings)
  let inStr = false;
  let commentIdx = -1;
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === '"') inStr = !inStr;
    else if (raw[i] === ";" && !inStr) { commentIdx = i; break; }
  }
  const commentHtml = commentIdx >= 0
    ? `<span class="hl-comment">${esc(raw.slice(commentIdx))}</span>`
    : "";
  const code = commentIdx >= 0 ? raw.slice(0, commentIdx) : raw;

  if (!code.trim()) return esc(code) + commentHtml;

  // Token regex (order matters)
  const TOKEN_RE = /("(?:[^"\\]|\\.)*")|(\*\s*=)|(\.(?:text|string|rawtext|rawbytes|data|byte|word|fill|align|loop|next|push|pull|const|define|if|else|endif|region|endregion|macro|endm|invoke|incbin|include|sid|petscii|table|loadfile|sprite_init|sprite_pos|wait_raster|joystick|sprite_col)\b)|(#?\$[0-9A-Fa-f]+|#\d+\b)|(\b\d+\b)|([A-Za-z_][A-Za-z0-9_]*\s*:)|([A-Za-z_][A-Za-z0-9_]*)/gi;

  let result = "";
  let lastIdx = 0;
  let m;
  while ((m = TOKEN_RE.exec(code)) !== null) {
    result += esc(code.slice(lastIdx, m.index));
    lastIdx = m.index + m[0].length;
    const [full, strLit, orgEq, directive, hexNum, decNum, label, ident] = m;
    if (strLit) {
      result += `<span class="hl-string">${esc(full)}</span>`;
    } else if (orgEq || directive) {
      result += `<span class="hl-directive">${esc(full)}</span>`;
    } else if (hexNum || decNum) {
      result += `<span class="hl-number">${esc(full)}</span>`;
    } else if (label) {
      result += `<span class="hl-label">${esc(full)}</span>`;
    } else if (ident && _EXPERT_MNEM_SET.has(full.trim().toUpperCase())) {
      result += `<span class="hl-mnem">${esc(full)}</span>`;
    } else {
      result += esc(full);
    }
  }
  result += esc(code.slice(lastIdx));
  return result + commentHtml;
}

// Current region range for highlight (set by _expertUpdateCursor, consumed by _expertApplyHighlight)
let _expertRegionHighlight = null; // null | { start: number, end: number }

function _expertApplyHighlight() {
  if (!expertHlCode || !expertEditor) return;
  const allLines = expertEditor.value.split("\n");
  const rh = _expertRegionHighlight;

  if (!_expertHlEnabled) {
    // No highlight — just escape HTML to prevent injection
    expertHlCode.innerHTML = allLines.map((raw, i) => {
      const escaped = raw.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      return escaped + (i < allLines.length - 1 ? "\n" : "");
    }).join("");
    return;
  }

  // CRITICAL: \n must be OUTSIDE spans — display:block + \n inside causes
  // the pre to render extra blank lines, desyncing it from the textarea.
  const html = allLines.map((raw, i) => {
    const hl = _expertHighlightLine(raw);
    const nl = i < allLines.length - 1 ? "\n" : "";
    let lineHtml = hl;
    if (rh) {
      if (i === rh.start || i === rh.end)
        lineHtml = `<span class="hl-region-bracket">${hl}</span>`;
      // body lines: background covered by #expert-region-bg div (no per-line span needed)
    }
    if (_expertErrorLineNos.has(i)) {
      lineHtml = `<span class="expert-err-line">${lineHtml}</span>`;
    }
    return lineHtml + nl;
  }).join("");
  expertHlCode.innerHTML = html;
  _updateExpertRegionBg();
}

function _updateExpertRegionBg() {
  const bgDiv = document.getElementById("expert-region-bg");
  if (!bgDiv || !expertEditor) return;
  const rh = _expertRegionHighlight;
  if (!rh || !_expertHlEnabled) {
    bgDiv.hidden = true;
    return;
  }
  const lh = parseFloat(getComputedStyle(expertEditor).lineHeight);
  const pt = parseFloat(getComputedStyle(expertEditor).paddingTop);
  bgDiv.style.top    = (pt + rh.start * lh) + "px";
  bgDiv.style.height = ((rh.end - rh.start + 1) * lh) + "px";
  bgDiv.style.transform = `translateY(${-expertEditor.scrollTop}px)`;
  bgDiv.hidden = false;
}

function parseExpertText(text) {
  const BRANCH_MNEMS = new Set(["BEQ","BNE","BCC","BCS","BMI","BPL","BVC","BVS","BRA"]);
  const blocks = [];

  for (let rawLine of text.split("\n")) {
    const scIdx = rawLine.indexOf(";");
    let commentText = "";
    let line = rawLine;
    if (scIdx >= 0) {
      commentText = rawLine.slice(scIdx + 1).trim();
      line = rawLine.slice(0, scIdx);
    }
    line = line.trim();

    if (!line) {
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // * = $XXXX → ORG
    const orgM = line.match(/^\*\s*=\s*\$([0-9A-Fa-f]{1,4})\s*$/);
    if (orgM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "ORG", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isOrgMacro: true, orgAddress: orgM[1].toUpperCase().padStart(4,"0") });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .text X, Y, "string" [, shift]
    const textM = line.match(/^\.text\s+(\d+)\s*,\s*(\d+)\s*,\s*"([^"]*)"\s*(?:,\s*([0-9A-Fa-f]{1,2}))?\s*$/i);
    if (textM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "TEXT", operand: textM[3], rawOperand: textM[3], description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isTextMacro: true, textX: parseInt(textM[1],10), textY: parseInt(textM[2],10), charOffset: textM[4] ? textM[4].toUpperCase().padStart(2,"0") : "00" });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .string $ADDR, "string" [, shift]
    const stringM = line.match(/^\.string\s+\$([0-9A-Fa-f]{1,4})\s*,\s*"([^"]*)"\s*(?:,\s*([0-9A-Fa-f]{1,2}))?\s*$/i);
    if (stringM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "STRING", operand: stringM[2], rawOperand: stringM[2], description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isStringMacro: true, stringAddress: stringM[1].toUpperCase().padStart(4,"0"), charOffset: stringM[3] ? stringM[3].toUpperCase().padStart(2,"0") : "00" });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .rawtext $ADDR, "string" [, shift]
    const rawtextM = line.match(/^\.rawtext\s+\$([0-9A-Fa-f]{1,4})\s*,\s*"([^"]*)"\s*(?:,\s*([0-9A-Fa-f]{1,2}))?\s*$/i);
    if (rawtextM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "RAWTEXT", operand: rawtextM[2], rawOperand: rawtextM[2], description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isRawTextMacro: true, rawTextAddress: "$" + rawtextM[1].toUpperCase().padStart(4,"0"), charOffset: rawtextM[3] ? rawtextM[3].toUpperCase().padStart(2,"0") : "00" });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .data $ADDR, bytes...
    const dataM = line.match(/^\.data\s+\$([0-9A-Fa-f]{1,4})\s*,\s*(.+)$/i);
    if (dataM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "DATA", operand: dataM[2].trim(), rawOperand: dataM[2].trim(), description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isDataMacro: true, dataAddress: "$" + dataM[1].toUpperCase().padStart(4,"0") });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .rawbytes $ADDR, bytes...
    const rawbytesM = line.match(/^\.rawbytes\s+\$([0-9A-Fa-f]{1,4})\s*,\s*(.+)$/i);
    if (rawbytesM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "RAWBYTES", operand: rawbytesM[2].trim(), rawOperand: rawbytesM[2].trim(), description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isRawBytesMacro: true, rawBytesAddress: "$" + rawbytesM[1].toUpperCase().padStart(4,"0") });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .petscii $ADDR, "text" [, shift]
    const petsciiM = line.match(/^\.petscii\s+\$([0-9A-Fa-f]{1,4})\s*,\s*"([^"]*)"\s*(?:,\s*([0-9A-Fa-f]{1,2}))?\s*$/i);
    if (petsciiM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "PETSCII", operand: petsciiM[2], rawOperand: petsciiM[2], description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isPetsciiMacro: true, petsciiAddress: petsciiM[1].toUpperCase().padStart(4,"0"), charOffset: petsciiM[3] ? petsciiM[3].toUpperCase().padStart(2,"0") : "00" });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .table NAME [$ADDR]  — address is optional
    const tableM = line.match(/^\.table\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:\$([0-9A-Fa-f]{1,4}))?\s*$/i);
    if (tableM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "TABLE", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isTableMacro: true, tableName: tableM[1], tableAddress: tableM[2] ? tableM[2].toUpperCase().padStart(4,"0") : "" });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .loadfile "NAME", device [, $addr] [, errorLabel]
    const loadfileM = line.match(/^\.loadfile\s+"([^"]*)"\s*,\s*(\d+)\s*(?:,\s*\$([0-9A-Fa-f]{1,4}))?\s*(?:,\s*([A-Za-z_][A-Za-z0-9_]*))?\s*$/i);
    if (loadfileM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "LOADFILE", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isLoadFileMacro: true, loadFileName: loadfileM[1].toUpperCase(), loadFileDevice: loadfileM[2], loadFileAddress: loadfileM[3] ? loadfileM[3].toUpperCase() : "", loadFileErrorLabel: loadfileM[4] || "" });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .incbin "filename" [, $ADDR]
    const incbinM = line.match(/^\.incbin\s+"([^"]*)"\s*(?:,\s*\$([0-9A-Fa-f]{1,4}))?\s*$/i);
    if (incbinM) {
      blocks.push(_importMakeIncBin(incbinM[1], incbinM[2] ? incbinM[2].toUpperCase() : ""));
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .sid "filename.sid" [, $ADDR]
    const sidDirM = line.match(/^\.sid\s+"([^"]*)"\s*(?:,\s*\$([0-9A-Fa-f]{1,4}))?\s*$/i);
    if (sidDirM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "SID", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "SID: valassz fajlt normalis modban", collapsed: true, isSidMacro: true, sidFile: "", sidFileName: sidDirM[1], sidTitle: "", sidAuthor: "", sidLoadAddress: 0, sidInitAddress: 0, sidPlayAddress: 0, sidBytes: [], sidCustomAddress: sidDirM[2] ? sidDirM[2].toUpperCase() : "" });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .include "filename.json" [, $ADDR]
    const includeDirM = line.match(/^\.include\s+"([^"]*)"\s*(?:,\s*\$([0-9A-Fa-f]{1,4}))?\s*$/i);
    if (includeDirM) {
      const _incName = includeDirM[1];
      const _incFile = /\.json$/i.test(_incName) ? _incName : `${_incName}.json`;
      const _incAddr = includeDirM[2] ? includeDirM[2].toUpperCase() : "";
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "INCLUDE", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isIncludeMacro: true, includeFile: _incFile, includeFileName: _incName, includeAddress: _incAddr, includeCollapsed: false, includedBlocks: [] });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .loop REG, count, label
    const loopM = line.match(/^\.loop\s+([XY])\s*,\s*(\$?[0-9A-Fa-f]+|\d+)\s*,\s*([A-Za-z_][A-Za-z0-9_]*)\s*$/i);
    if (loopM) {
      const reg = loopM[1].toUpperCase();
      const countRaw = loopM[2];
      const count = countRaw.startsWith("$") ? countRaw.slice(1).toUpperCase().padStart(2,"0") : parseInt(countRaw,10).toString(16).toUpperCase().padStart(2,"0");
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "LOOP", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isLoopMacro: true, loopReg: reg, loopCount: count, loopLabel: loopM[3] });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .next label
    const nextM = line.match(/^\.next\s+([A-Za-z_][A-Za-z0-9_]*)\s*$/i);
    if (nextM) {
      const matchingLoop = blocks.slice().reverse().find(b => b.isLoopMacro && b.loopLabel === nextM[1]);
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "NEXT", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isNextMacro: true, nextLabel: nextM[1], nextReg: matchingLoop?.loopReg || "X" });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .for REG, count, label
    const forM = line.match(/^\.loopf\s+([XY])\s*,\s*(\$?[0-9A-Fa-f]+|\d+)\s*,\s*([A-Za-z_][A-Za-z0-9_]*)\s*$/i);
    if (forM) {
      const reg = forM[1].toUpperCase();
      const countRaw = forM[2];
      const count = countRaw.startsWith("$") ? countRaw.slice(1).toUpperCase().padStart(2,"0") : parseInt(countRaw,10).toString(16).toUpperCase().padStart(2,"0");
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "FOR", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isForMacro: true, loopReg: reg, loopCount: count, loopLabel: forM[3] });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .endf label
    const endfM = line.match(/^\.nextf\s+([A-Za-z_][A-Za-z0-9_]*)\s*$/i);
    if (endfM) {
      const matchingLoop = blocks.slice().reverse().find(b => b.isForMacro && b.loopLabel === endfM[1]);
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "ENDF", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isEndfMacro: true, nextLabel: endfM[1], nextReg: matchingLoop?.loopReg || "X", nextCount: matchingLoop?.loopCount || "0A" });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .sprite_init spriteNum, color, $page
    const siM = line.match(/^\.sprite_init\s+(\d)\s*,\s*(\d{1,2})\s*,\s*\$([0-9A-Fa-f]{1,2})\s*$/i);
    if (siM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "SPRITE_INIT", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isSpriteInitMacro: true, spriteNum: parseInt(siM[1],10), spriteColor: parseInt(siM[2],10), spriteDataPage: siM[3].toUpperCase().padStart(2,"0") });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .sprite_pos spriteNum, x, y
    const spM = line.match(/^\.sprite_pos\s+(\d)\s*,\s*(\d+)\s*,\s*(\d+)\s*$/i);
    if (spM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "SPRITE_POS", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isSpritePosMacro: true, spriteNum: parseInt(spM[1],10), spriteX: parseInt(spM[2],10), spriteY: parseInt(spM[3],10) });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .wait_raster $line
    const wrM = line.match(/^\.wait_raster\s+\$([0-9A-Fa-f]{1,2})\s*$/i);
    if (wrM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "WAIT_RASTER", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isWaitRasterMacro: true, rasterLine: wrM[1].toUpperCase().padStart(2,"0") });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .turbo_set speed,badline
    const turboM = line.match(/^\.turbo_set\s+(\d{1,2})\s*,\s*([01])\s*$/i);
    if (turboM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "TURBO_SET", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isTurboSetMacro: true, turboSpeed: turboM[1], turboBadline: turboM[2] });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .supercpu_detect
    if (/^\.supercpu_detect\s*$/i.test(line)) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "SUPERCPU_DETECT", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isSuperCpuDetectMacro: true });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .turbo_enable on|off
    const turboEnM = line.match(/^\.turbo_enable\s+(on|off)\s*$/i);
    if (turboEnM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "TURBO_ENABLE", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isTurboEnableMacro: true, turboEnableMode: turboEnM[1].toLowerCase() });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .joystick port, spriteNum
    const joyM = line.match(/^\.joystick\s+([12])\s*,\s*(\d)\s*$/i);
    if (joyM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "JOYSTICK", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isJoystickMacro: true, joyPort: joyM[1], joySpriteNum: parseInt(joyM[2],10) });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .mouse port, spriteNum, zpX, zpY
    const mouseM = line.match(/^\.mouse\s+([12])\s*,\s*(\d)\s*,\s*\$?([0-9A-Fa-f]{1,2})\s*,\s*\$?([0-9A-Fa-f]{1,2})\s*$/i);
    if (mouseM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "MOUSE", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isMouseMacro: true, mousePort: mouseM[1], mouseSpriteNum: parseInt(mouseM[2], 10), mousePotXZP: mouseM[3].toUpperCase(), mousePotYZP: mouseM[4].toUpperCase() });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .sprite_col spriteNum, sprite|background
    const scColM = line.match(/^\.sprite_col\s+(\d)\s*,\s*(sprite|background)\s*$/i);
    if (scColM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "SPRITE_COL", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isSpriteColMacro: true, spriteNum: parseInt(scColM[1],10), colType: scColM[2].toLowerCase() });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .reu_check
    if (/^\.reu_check\s*$/i.test(line)) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "REU_CHECK", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isReuCheckMacro: true });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }
    // .reu_stash / .reu_fetch / .reu_swap $c64addr, $reuaddr, bank, $len
    const reuM = line.match(/^\.(reu_stash|reu_fetch|reu_swap)\s+\$?([0-9A-Fa-f]{1,4})\s*,\s*\$?([0-9A-Fa-f]{1,4})\s*,\s*([0-7])\s*,\s*\$?([0-9A-Fa-f]{1,4})\s*$/i);
    if (reuM) {
      const reuMnemonics = { reu_stash: "REU_STASH", reu_fetch: "REU_FETCH", reu_swap: "REU_SWAP" };
      const reuMnem = reuMnemonics[reuM[1].toLowerCase()];
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: reuMnem, operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isReuTransferMacro: true, reuC64Addr: reuM[2].toUpperCase().padStart(4,"0"), reuExpAddr: reuM[3].toUpperCase().padStart(4,"0"), reuBank: reuM[4], reuLength: reuM[5].toUpperCase().padStart(4,"0") });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .push / .pull regs
    const pushM = line.match(/^\.push\s+([AXYaxy]+)\s*$/i);
    if (pushM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "PUSH", operand: pushM[1].toUpperCase(), rawOperand: pushM[1].toUpperCase(), description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isPushMacro: true, pushRegs: pushM[1].toUpperCase() });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }
    const pullM = line.match(/^\.pull\s+([AXYaxy]+)\s*$/i);
    if (pullM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "PULL", operand: pullM[1].toUpperCase(), rawOperand: pullM[1].toUpperCase(), description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isPullMacro: true, pullRegs: pullM[1].toUpperCase() });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .const NAME = value
    const constM = line.match(/^\.const\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)\s*$/i);
    if (constM) { blocks.push(_importMakeConst(constM[1], constM[2].trim())); if (commentText) blocks.push(_importMakeComment(commentText)); continue; }

    // .define SYM [, SYM2]
    const defineM = line.match(/^\.define\s+(.+)$/i);
    if (defineM) { blocks.push(_importMakeDefine(defineM[1].trim())); if (commentText) blocks.push(_importMakeComment(commentText)); continue; }

    // .if / .else / .endif
    const ifM = line.match(/^\.if\s+(.+)$/i);
    if (ifM) { blocks.push(_importMakeIf(ifM[1].trim())); if (commentText) blocks.push(_importMakeComment(commentText)); continue; }
    if (/^\.else\s*$/i.test(line)) { blocks.push(_importMakeElse()); if (commentText) blocks.push(_importMakeComment(commentText)); continue; }
    if (/^\.endif\s*$/i.test(line)) { blocks.push(_importMakeEndIf()); if (commentText) blocks.push(_importMakeComment(commentText)); continue; }

    // .region / .endregion
    const regionM = line.match(/^\.region\s+(.+)$/i);
    if (regionM) { blocks.push(_importMakeRegion(regionM[1].trim())); if (commentText) blocks.push(_importMakeComment(commentText)); continue; }
    if (/^\.endregion(?:\s+.+)?$/i.test(line)) { blocks.push(_importMakeEndRegion()); if (commentText) blocks.push(_importMakeComment(commentText)); continue; }

    // .macro name / .endm
    const macroM = line.match(/^\.macro\s+([A-Za-z_][A-Za-z0-9_]*)\s*$/i);
    if (macroM) { blocks.push(_importMakeMacroDefStart(macroM[1])); if (commentText) blocks.push(_importMakeComment(commentText)); continue; }
    if (/^\.endm\s*$/i.test(line)) { blocks.push(_importMakeMacroDefEnd()); if (commentText) blocks.push(_importMakeComment(commentText)); continue; }

    // .invoke macroname
    const invokeM = line.match(/^\.invoke\s+([A-Za-z_][A-Za-z0-9_]*)\s*$/i);
    if (invokeM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "INVOKE", operand: invokeM[1], rawOperand: invokeM[1], description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isMacroInvoke: true, invokeMacroName: invokeM[1] });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // Delegate the rest to the existing parser patterns (ORG already handled above)
    const delegated = parseAsmText(line + (commentText ? " ; " + commentText : ""));
    if (delegated.length) { blocks.push(...delegated); continue; }

    // Fallback comment
    blocks.push(_importMakeComment(line + (commentText ? " ; " + commentText : "")));
  }

  return blocks;
}

// Map each block to its source line index by scanning the source text in parallel.
// Sets block._srcLine = lineIndex for the first block produced by each source line.
function _addSrcLineToBlocks(text, blocks) {
  if (!blocks.length) return;
  const srcLines = text.split("\n");
  let bIdx = 0;
  for (let li = 0; li < srcLines.length && bIdx < blocks.length; li++) {
    const raw = srcLines[li];
    const scIdx = raw.indexOf(";");
    const codePart = (scIdx >= 0 ? raw.slice(0, scIdx) : raw).trim();
    const hasCode = codePart.length > 0;
    const hasTrailingComment = scIdx >= 0 && raw.slice(scIdx + 1).trim().length > 0;
    const isCommentOnly = !hasCode && scIdx >= 0 && raw.slice(scIdx + 1).trim().length > 0;

    if (hasCode) {
      // Main block
      blocks[bIdx]._srcLine = li;
      bIdx++;
      // Trailing comment block (if any follows right away and is a comment)
      if (hasTrailingComment && bIdx < blocks.length && blocks[bIdx].isComment) {
        blocks[bIdx]._srcLine = li;
        bIdx++;
      }
    } else if (isCommentOnly) {
      // Comment-only line → one comment block
      if (blocks[bIdx].isComment) {
        blocks[bIdx]._srcLine = li;
        bIdx++;
      }
    }
    // pure empty lines: no blocks
  }
}

function _expertBuildProgram() {
  const text = expertEditor?.value || "";
  const blocks = parseExpertText(text);
  _addSrcLineToBlocks(text, blocks);

  // Preserve binary data from existing program[] blocks — can't be encoded in text form.
  // Match by filename so loaded bytes survive mode-switches and compile calls.
  blocks.forEach(newBlock => {
    if (newBlock.isIncBinMacro && newBlock.incBinFileName) {
      const existing = program.find(b =>
        b.isIncBinMacro && b.incBinFileName === newBlock.incBinFileName &&
        (b.incBinBytes || []).length > 0
      );
      if (existing) {
        newBlock.incBinBytes = existing.incBinBytes;
        newBlock.incBinFile  = existing.incBinFile || "";
        newBlock.validationError = validateIncBinMacro(newBlock.incBinBytes, newBlock.incBinAddress);
      }
    }
    if (newBlock.isSidMacro && newBlock.sidFileName) {
      const existing = program.find(b =>
        b.isSidMacro && b.sidFileName === newBlock.sidFileName &&
        (b.sidBytes || []).length > 0
      );
      if (existing) {
        newBlock.sidBytes        = existing.sidBytes;
        newBlock.sidFile         = existing.sidFile || "";
        newBlock.sidTitle        = existing.sidTitle || "";
        newBlock.sidAuthor       = existing.sidAuthor || "";
        newBlock.sidLoadAddress  = existing.sidLoadAddress || 0;
        newBlock.sidInitAddress  = existing.sidInitAddress || 0;
        newBlock.sidPlayAddress  = existing.sidPlayAddress || 0;
        newBlock.sidCustomAddress = existing.sidCustomAddress || "";
        newBlock.validationError = existing.validationError || "";
      }
    }
    if (newBlock.isIncludeMacro && newBlock.includeFileName) {
      const existing = program.find(b =>
        b.isIncludeMacro && b.includeFileName === newBlock.includeFileName &&
        (b.includedBlocks || []).length > 0
      );
      if (existing) {
        newBlock.includedBlocks  = existing.includedBlocks;
        newBlock.includeFile     = existing.includeFile || newBlock.includeFile || "";
        // Only copy address from existing if the text didn't specify one
        if (!newBlock.includeAddress && existing.includeAddress)
          newBlock.includeAddress = existing.includeAddress;
        newBlock.validationError = existing.validationError || "";
      }
    }
  });

  return blocks;
}

// Update Ln/Col display and region bracket highlighting
function _expertUpdateCursor() {
  if (!expertEditor) return;
  const val  = expertEditor.value;
  const pos  = expertEditor.selectionStart;
  const lines = val.slice(0, pos).split("\n");
  const ln  = lines.length;
  const col = lines[lines.length - 1].length + 1;

  // Find current region by scanning backwards (depth-aware)
  const allLines = val.split("\n");
  const curLine  = ln - 1; // 0-based
  let currentRegion = null;
  let depth = 0;
  for (let i = curLine; i >= 0; i--) {
    const raw = allLines[i] || "";
    if (/^\s*\.endregion\b/i.test(raw)) {
      depth++;
    } else {
      const m = raw.match(/^\s*\.region\s+(.+)$/i);
      if (m) {
        if (depth === 0) { currentRegion = m[1].trim(); break; }
        depth--;
      }
    }
  }

  if (expertCursorPos) {
    expertCursorPos.textContent = currentRegion
      ? `Ln ${ln}, Col ${col}  ·  ${currentRegion}`
      : `Ln ${ln}, Col ${col}`;
  }

  // Sync palette to current line
  if (!_expertPaletteSyncEnabled) return;
  const curRaw = allLines[curLine] || "";
  const trimmed = curRaw.trim();
  let targetMnem = null;
  if (/^\*\s*=/.test(trimmed)) {
    targetMnem = "ORG";
  } else if (/^[A-Za-z_][A-Za-z0-9_]*\s*:/.test(trimmed)) {
    targetMnem = "LABEL";
  } else if (trimmed.startsWith(".")) {
    const dir = trimmed.slice(1).split(/[\s(,]/)[0].toLowerCase();
    targetMnem = _DIRECTIVE_TO_MNEM[dir] || null;
  } else if (/^[A-Za-z]{2,3}(\s|$)/.test(trimmed)) {
    const mnem = trimmed.split(/\s+/)[0].toUpperCase();
    if (_getExpertMnemCatMap().has(mnem)) targetMnem = mnem;
  }
  if (targetMnem) {
    const cat = _getExpertMnemCatMap().get(targetMnem);
    if (cat) {
      if (categorySelect.value !== cat) {
        categorySelect.value = cat;
        syncMnemonicMenu();
      }
      if (mnemonicSelect.value !== targetMnem) {
        mnemonicSelect.value = targetMnem;
        syncAddressingModes();
        renderPaletteItems();
      }
    }
  }

  // Update region highlight state and rebuild overlay
  const isRegionLine    = /^\s*\.region\b/i.test(curRaw);
  const isEndRegionLine = /^\s*\.endregion\b/i.test(curRaw);

  let newRegionHighlight = null;
  if (isRegionLine || isEndRegionLine) {
    let regionStart = -1, regionEnd = -1;
    if (isRegionLine) {
      regionStart = curLine;
      let d = 0;
      for (let i = curLine; i < allLines.length; i++) {
        if (/^\s*\.region\b/i.test(allLines[i])) d++;
        else if (/^\s*\.endregion\b/i.test(allLines[i])) { d--; if (d === 0) { regionEnd = i; break; } }
      }
    } else {
      regionEnd = curLine;
      let d = 0;
      for (let i = curLine; i >= 0; i--) {
        if (/^\s*\.endregion\b/i.test(allLines[i])) d++;
        else if (/^\s*\.region\b/i.test(allLines[i])) { d--; if (d === 0) { regionStart = i; break; } }
      }
    }
    if (regionStart !== -1 && regionEnd !== -1) {
      newRegionHighlight = { start: regionStart, end: regionEnd };
    }
  }

  // Only rebuild if region highlight changed
  const prev = _expertRegionHighlight;
  const changed = (prev?.start !== newRegionHighlight?.start) || (prev?.end !== newRegionHighlight?.end);
  _expertRegionHighlight = newRegionHighlight;
  if (changed) _expertApplyHighlight();
}

function _expertValidate() {
  if (!expertMode || !expertEditor) return;
  _expertApplyHighlight();
  clearTimeout(_expertParseTimer);
  _expertParseTimer = setTimeout(() => {
    try {
      const blocks = _expertBuildProgram();
      const saved = program;
      const savedUserMacros = userMacros;
      program = blocks;
      parseUserMacros();
      let errors = [];
      try {
        const layout = getProgramLayout();
        // Build label map (same as assembleProgramToPrg)
        const labels = new Map();
        layout.lines.forEach((line) => {
          if (line.conditionallySkipped) return;
          if (line.block.isLabel && line.block.labelName) labels.set(line.block.labelName, line.address);
          if (line.block.isLoopMacro && line.block.loopLabel) labels.set(line.block.loopLabel, line.address + 2);
          if (line.block.isForMacro && line.block.loopLabel) labels.set(line.block.loopLabel, line.address + 2);
          if (line.block.isTableMacro && line.block.tableName) {
            const tableAddr = line.block.tableAddress
              ? (parseAddressValue(line.block.tableAddress) ?? line.address)
              : line.address;
            labels.set(line.block.tableName, tableAddr);
          }
          if (line.block.isConstMacro && line.block.constName) {
            const v = parseNumberByBase((line.block.rawOperand || "").replace(/^\$/, ""), line.block.base);
            if (v !== null) labels.set(line.block.constName, v);
          }
        });
        labels._anonAddrs = _collectAnonLabels(layout);
        // Run compileLineBytes to detect unknown mnemonics / bad operands
        for (const line of layout.lines) {
          if (line.conditionallySkipped) continue;
          if (line.block.isLabel || line.block.isComment || line.block.isIncludeMacro) continue;
          if (line.block._isSavedAddress || line.block._isRestoreAddress || line.block.isOrgMacro) continue;
          const result = compileLineBytes(line, labels);
          if (!result.ok) errors.push({ msg: result.error, srcLine: line.block._srcLine });
        }
        // Update overlap badge and panel
        renderMemoryMap(getMemoryUsage(layout));
        // Fall back to block-level validationError if compile found nothing
        if (!errors.length) {
          errors = layout.lines
            .filter(l => l.block?.validationError)
            .map(l => ({ msg: l.block.validationError, srcLine: l.block._srcLine }));
        }
      } finally {
        program = saved;
        userMacros = savedUserMacros;
      }
      // Update error line set and re-highlight
      const prevErrSize = _expertErrorLineNos.size;
      _expertErrorLineNos = new Set(errors.map(e => e.srcLine).filter(n => n !== undefined));
      if (_expertErrorLineNos.size !== prevErrSize) _expertApplyHighlight();

      if (errors.length) {
        _expertSetStatus(errors[0].msg + (errors.length > 1 ? ` (+${errors.length - 1} more)` : ""), "error");
      } else {
        _expertSetStatus(currentLanguage === "en"
          ? `${blocks.length} ${blocks.length === 1 ? "block" : "blocks"} — OK`
          : `${blocks.length} blokk — OK`, "ok");
      }
      if (_expertDisasmVisible) _expertRenderDisasm();
      if (_expertMonitorVisible) _expertRenderMonitor();
      if (_expertProjectVisible) _expertRenderSymbols();
    } catch (e) {
      _expertSetStatus(String(e), "error");
    }
  }, 350);
}

// ── Shared disassembler ────────────────────────────────────────────────────────

function _escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ── 6502 byte-level disassembler ────────────────────────────────────────────

// Reverse opcode lookup: opcode -> { mnemonic, mode, size }
const _REV_OP = (() => {
  const rev = {};
  const modeSize = {
    implied:1, immediate:2, zeroPage:2, zeroPageX:2, zeroPageY:2,
    absolute:3, absoluteX:3, absoluteY:3,
    indirectX:2, indirectY:2, relative:2, indirect:3
  };
  for (const [mnem, modes] of Object.entries(opcodeMap)) {
    for (const [mode, oc] of Object.entries(modes)) {
      rev[oc] = { mnem, mode, size: modeSize[mode] || 1 };
    }
  }
  // Fill unknown opcodes as .byte
  for (let i = 0; i < 256; i++) {
    if (!rev[i]) rev[i] = { mnem: ".BYTE", mode: "unknown", size: 1 };
  }
  return rev;
})();

function _disasmBytes(bytes, baseAddr) {
  const result = [];
  let i = 0;
  while (i < bytes.length) {
    const addr = baseAddr + i;
    const oc = bytes[i];
    const info = _REV_OP[oc] || { mnem: ".BYTE", mode: "unknown", size: 1 };
    const end = Math.min(i + info.size, bytes.length);
    const instrBytes = bytes.slice(i, end);
    let operand = "";

    if (info.size >= 2 && i + 1 < bytes.length) {
      const b1 = bytes[i + 1];
      if (info.mode === "immediate") {
        operand = "#$" + b1.toString(16).toUpperCase().padStart(2, "0");
      } else if (info.mode === "zeroPage") {
        operand = "$" + b1.toString(16).toUpperCase().padStart(2, "0");
      } else if (info.mode === "zeroPageX") {
        operand = "$" + b1.toString(16).toUpperCase().padStart(2, "0") + ",X";
      } else if (info.mode === "zeroPageY") {
        operand = "$" + b1.toString(16).toUpperCase().padStart(2, "0") + ",Y";
      } else if (info.mode === "indirectX") {
        operand = "($" + b1.toString(16).toUpperCase().padStart(2, "0") + ",X)";
      } else if (info.mode === "indirectY") {
        operand = "($" + b1.toString(16).toUpperCase().padStart(2, "0") + "),Y";
      } else if (info.mode === "relative") {
        const offset = (b1 & 0x80) ? b1 - 256 : b1;
        const target = addr + 2 + offset;
        const label = "$" + (target & 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
        operand = label;
      }
    }
    if (info.size >= 3 && i + 2 < bytes.length) {
      const b1 = bytes[i + 1], b2 = bytes[i + 2];
      const abs = b1 | (b2 << 8);
      if (info.mode === "absolute") {
        operand = "$" + abs.toString(16).toUpperCase().padStart(4, "0");
      } else if (info.mode === "absoluteX") {
        operand = "$" + abs.toString(16).toUpperCase().padStart(4, "0") + ",X";
      } else if (info.mode === "absoluteY") {
        operand = "$" + abs.toString(16).toUpperCase().padStart(4, "0") + ",Y";
      } else if (info.mode === "indirect") {
        operand = "($" + abs.toString(16).toUpperCase().padStart(4, "0") + ")";
      }
    }
    if (info.mnem === ".BYTE" && info.mode === "unknown") {
      operand = "$" + oc.toString(16).toUpperCase().padStart(2, "0");
    }

    result.push({ address: addr, bytes: Array.from(instrBytes), mnemonic: info.mnem, operand });
    i += info.size;
  }
  return result;
}

// Build syntax-highlighted disassembler HTML from current program[].
// Caller must ensure program[] is set to the desired block list before calling.
function _buildDisasmHTML() {
  const esc = _escHtml;
  const lines = [];
  try {
    const layout = getProgramLayout();

    // Build label map (name -> address)
    const labelMap = new Map();
    layout.lines.forEach((line) => {
      if (line.block.isLabel && line.block.labelName) labelMap.set(line.block.labelName, line.address);
      if (line.block.isLoopMacro && line.block.loopLabel) labelMap.set(line.block.loopLabel, line.address + 2);
      if (line.block.isForMacro && line.block.loopLabel) labelMap.set(line.block.loopLabel, line.address + 2);
      if (line.block.isTableMacro && line.block.tableName) {
        const tableAddr = line.block.tableAddress
          ? (parseAddressValue(line.block.tableAddress) ?? line.address)
          : line.address;
        labelMap.set(line.block.tableName, tableAddr);
      }
      if (line.block.isConstMacro && line.block.constName) {
        const v = parseNumberByBase((line.block.rawOperand || "").replace(/^\$/, ""), line.block.base);
        if (v !== null) labelMap.set(line.block.constName, v);
      }
    });
    labelMap._anonAddrs = _collectAnonLabels(layout);
    const addrToLabel = new Map();
    for (const [name, addr] of labelMap) addrToLabel.set(addr, name);

    for (const line of layout.lines) {
      // Skip non-code blocks
      if (line.conditionallySkipped) continue;
      if (line.block._isSavedAddress || line.block._isRestoreAddress) continue;
      if (line.block._macroSourceBlock) continue;
      if (line.block.isComment) continue;
      if (line.block.isIncludeMacro) continue;
      if (line.block.isOrgMacro) continue;
      if (line.block.isRegionMacro || line.block.isEndRegionMacro) continue;

      // Treat synthetic macro labels as invisible (they're internal to macro expansion)
      if (line.block.isLabel && line.block._syntheticMacroLabel) continue;

      const addrHex = line.address.toString(16).toUpperCase().padStart(4, "0");
      const compiled = compileLineBytes(line, labelMap);

      if (!compiled.ok) continue;

      // Only show lines that produce actual bytes (real code / inline data)
      if (!compiled.bytes.length) {
        continue;
      }

      // Show label at this address if one exists (inline, before the instruction)
      if (addrToLabel.has(line.address)) {
        lines.push(`<span class="asm-tok-label">${esc(addrToLabel.get(line.address))}:</span>`);
      }

      const DISASM_CHUNK = 8; // bytes per line for raw data blocks
      const allBytes = compiled.bytes;
      const mnem = line.block.mnemonic;
      const op   = line.block.operand || "";
      const isRealInstruction = opcodeMap[mnem] !== undefined;
      const isDataBlock = line.block.isByteMacro || line.block.isWordMacro || line.block.isFillMacro;

      if (isRealInstruction && allBytes.length <= DISASM_CHUNK) {
        // Short — real 6502 instruction, show resolved numeric operand
        let disasmOp = "";
        const mode = line.block.addressingMode;
        if (mode === "relative") {
          const rel = resolveRelativeOperand(line.block, line.address, labelMap);
          if (rel.ok) {
            const target = line.address + 2 + (rel.value & 0x80 ? rel.value - 256 : rel.value);
            disasmOp = "$" + (target & 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
          }
        } else if (mode !== "implied") {
          const num = resolveNumericOperand(line.block, labelMap);
          if (num.ok) {
            const v = num.value;
            if (mode === "immediate") {
              disasmOp = v <= 0xFF ? "#$" + (v & 0xFF).toString(16).toUpperCase().padStart(2, "0")
                                   : "#$" + (v & 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
            } else if (mode === "zeroPage") {
              disasmOp = "$" + (v & 0xFF).toString(16).toUpperCase().padStart(2, "0");
            } else if (mode === "zeroPageX" || mode === "zeroPageY") {
              const suffix = mode === "zeroPageX" ? ",X" : ",Y";
              disasmOp = "$" + (v & 0xFF).toString(16).toUpperCase().padStart(2, "0") + suffix;
            } else if (mode === "absolute") {
              disasmOp = "$" + (v & 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
            } else if (mode === "absoluteX" || mode === "absoluteY") {
              const suffix = mode === "absoluteX" ? ",X" : ",Y";
              disasmOp = "$" + (v & 0xFFFF).toString(16).toUpperCase().padStart(4, "0") + suffix;
            } else if (mode === "indirectX") {
              disasmOp = "($" + (v & 0xFF).toString(16).toUpperCase().padStart(2, "0") + ",X)";
            } else if (mode === "indirectY") {
              disasmOp = "($" + (v & 0xFF).toString(16).toUpperCase().padStart(2, "0") + "),Y";
            } else if (mode === "indirect") {
              disasmOp = "($" + (v & 0xFFFF).toString(16).toUpperCase().padStart(4, "0") + ")";
            }
          }
        }
        const hexDump = allBytes.map(b => b.toString(16).toUpperCase().padStart(2, "0")).join(" ");
        lines.push(
          `<span class="dsm-addr">$${addrHex}</span>  ` +
          `<span class="dsm-bytes">${hexDump.padEnd(Math.max(hexDump.length, 8))}</span>  ` +
          `<span class="asm-tok-mnemonic">${esc(mnem)}</span>` +
          (disasmOp ? `  <span class="asm-tok-operand">${esc(disasmOp)}</span>` : "")
        );
      } else if (isDataBlock) {
        // Raw data blocks — chunk into 8-byte hex lines
        const COLW = DISASM_CHUNK * 3 - 1; // fixed byte-column width for long data
        const opParts = op.split(",").map(s => s.trim());
        const isShortData = allBytes.length <= DISASM_CHUNK;
        for (let ci = 0; ci < allBytes.length; ci += DISASM_CHUNK) {
          const chunk = allBytes.slice(ci, ci + DISASM_CHUNK);
          const chunkAddr = (line.address + ci).toString(16).toUpperCase().padStart(4, "0");
          const hexDump = chunk.map(b => b.toString(16).toUpperCase().padStart(2, "0")).join(" ");
          const padTo = isShortData ? Math.max(hexDump.length, 8) : COLW;
          const chunkOp = opParts.slice(ci, ci + DISASM_CHUNK).join(", ");
          lines.push(
            `<span class="dsm-addr">$${chunkAddr}</span>  ` +
            `<span class="dsm-bytes">${hexDump.padEnd(padTo)}</span>  ` +
            `<span class="asm-tok-mnemonic">${esc(mnem)}</span>` +
            (chunkOp ? `  <span class="asm-tok-operand">${esc(chunkOp)}</span>` : "")
          );
        }
      } else {
        // Macro-generated code — disassemble instruction by instruction
        const instrs = _disasmBytes(allBytes, line.address);
        for (const instr of instrs) {
          const iAddr = instr.address.toString(16).toUpperCase().padStart(4, "0");
          const iHex = instr.bytes.map(b => b.toString(16).toUpperCase().padStart(2, "0")).join(" ");
          lines.push(
            `<span class="dsm-addr">$${iAddr}</span>  ` +
            `<span class="dsm-bytes">${iHex.padEnd(Math.max(iHex.length, 8))}</span>  ` +
            `<span class="asm-tok-mnemonic">${esc(instr.mnemonic)}</span>` +
            (instr.operand ? `  <span class="asm-tok-operand">${esc(instr.operand)}</span>` : "")
          );
        }
      }
    }
  } catch (e) {
    lines.push(`<span class="asm-tok-comment">; Error: ${esc(String(e))}</span>`);
  }
  return lines.join("\n");
}

function renderDisasmOutput() {
  const el = document.getElementById("disasm-output");
  if (!el) return;
  if (!program.length) {
    el.innerHTML = `<span class="asm-tok-comment">; ${currentLanguage === "en" ? "Disassembly will appear here" : "A disassembler kimenet itt jelenik meg"}</span>`;
    return;
  }
  el.innerHTML = _buildDisasmHTML();
}

function _expertRenderDisasm() {
  if (!expertDisasmOutput) return;
  try {
    const blocks = _expertBuildProgram();
    const saved = program;
    const savedUserMacros = userMacros;
    program = blocks;
    parseUserMacros();
    try {
      expertDisasmOutput.innerHTML = _buildDisasmHTML();
    } finally {
      program = saved;
      userMacros = savedUserMacros;
    }
  } catch (e) {
    expertDisasmOutput.textContent = String(e);
  }
}

function _expertRenderMonitor() {
  if (!expertMonitorOutput) return;
  try {
    const blocks = _expertBuildProgram();
    const saved = program;
    program = blocks;
    try {
      expertMonitorOutput.textContent = _buildMonitorText(getProgramLayout());
    } finally {
      program = saved;
    }
  } catch (e) {
    expertMonitorOutput.textContent = String(e);
  }
}

// ── Expert Project Panel ──────────────────────────────────────────────────────

function _expertRenderSymbols() {
  const el = document.getElementById("expert-project-symbols");
  if (!el) return;

  // In expert mode: scan textarea text directly so typing immediately reflects
  // In block mode: read from program[]
  let regions = [];
  let macros  = [];
  let labels  = [];

  if (expertMode && expertEditor) {
    const lines = expertEditor.value.split("\n");
    lines.forEach((line, idx) => {
      const rm = line.match(/^\s*\.region\s+(.+?)(?:\s*;.*)?$/i);
      if (rm) { regions.push({ _textName: rm[1].trim(), _lineIdx: idx }); return; }
      const mm = line.match(/^\s*\.macro\s+([A-Za-z_][A-Za-z0-9_]*)(?:\s|$)/i);
      if (mm) { macros.push({ _textName: mm[1].trim(), _lineIdx: idx }); return; }
      const lm = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(?:;.*)?$/);
      if (lm) { labels.push({ _textName: lm[1].trim(), _lineIdx: idx }); }
    });
  } else {
    regions = program.filter(b => b.isRegionMacro && b.regionName);
    macros  = program.filter(b => b.isMacroDefStart && b.macroName);
    labels  = program.filter(b => b.isLabel && b.labelName);
  }

  if (regions.length === 0 && macros.length === 0 && labels.length === 0) {
    el.hidden = true;
    return;
  }
  el.hidden = false;
  el.innerHTML = "";

  // Jump cursor in expert editor to a specific line index
  function gotoEditorLine(lineIdx) {
    if (!expertEditor) return;
    const lines = expertEditor.value.split("\n");
    const pos = lines.slice(0, lineIdx).reduce((a, l) => a + l.length + 1, 0);
    const endPos = pos + (lines[lineIdx] || "").trimEnd().length;
    expertEditor.focus();
    expertEditor.setSelectionRange(pos, endPos);
    const lineH = parseFloat(getComputedStyle(expertEditor).lineHeight) || 18;
    expertEditor.scrollTop = Math.max(0, lineIdx * lineH - expertEditor.clientHeight / 3);
  }

  // Jump by regex scan (fallback for block-mode derived data)
  function gotoEditorPattern(pattern) {
    if (!expertEditor) return;
    const lines = expertEditor.value.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (pattern.test(lines[i])) { gotoEditorLine(i); return; }
    }
  }

  const svgRegion = `<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="11" height="11"><rect x="1.5" y="1.5" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.2"/><path d="M4 4.5h6M4 7h4" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>`;
  const svgMacro  = `<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="11" height="11"><path d="M2.5 4l3.5 3-3.5 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 10h3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`;
  const svgLabel  = `<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="11" height="11"><path d="M2 4.5V2.8C2 2.36 2.36 2 2.8 2h4.64c.21 0 .42.08.57.23l3.76 3.76a.8.8 0 0 1 0 1.13L8.03 10.56a.8.8 0 0 1-.57.24H2.8A.8.8 0 0 1 2 10V8.3" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/><circle cx="5" cy="5.4" r="0.85" fill="currentColor"/></svg>`;

  function addGroup(labelKey, items, svgIcon, nameFn, clickFn) {
    if (items.length === 0) return;
    const hdr = document.createElement("div");
    hdr.className = "expert-project-symbols-label";
    hdr.textContent = t(labelKey);
    el.appendChild(hdr);

    items.forEach(item => {
      const row = document.createElement("div");
      row.className = "expert-project-item expert-project-item--file";

      const iconEl = document.createElement("span");
      iconEl.className = "expert-project-item-icon";
      iconEl.innerHTML = svgIcon;

      const nameEl = document.createElement("span");
      nameEl.className = "expert-project-item-name";
      nameEl.textContent = nameFn(item);

      row.appendChild(iconEl);
      row.appendChild(nameEl);
      row.addEventListener("click", () => clickFn(item));
      el.appendChild(row);
    });
  }

  addGroup("projRegions", regions, svgRegion,
    item => item._textName ?? item.regionName,
    item => {
      if (expertMode && expertEditor) {
        if (item._lineIdx != null) { gotoEditorLine(item._lineIdx); return; }
        const escaped = item.regionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        gotoEditorPattern(new RegExp(`^\\s*\\.region\\s+${escaped}\\s*(?:;.*)?$`, "i"));
      } else {
        selectBlockInAsm(item.id);
        programList?.querySelector(`[data-block-id="${item.id}"]`)
          ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  );

  addGroup("projMacros", macros, svgMacro,
    item => item._textName ?? item.macroName,
    item => {
      if (expertMode && expertEditor) {
        if (item._lineIdx != null) { gotoEditorLine(item._lineIdx); return; }
        const escaped = item.macroName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        gotoEditorPattern(new RegExp(`^\\s*\\.macro\\s+${escaped}\\b`, "i"));
      } else {
        selectBlockInAsm(item.id);
        programList?.querySelector(`[data-block-id="${item.id}"]`)
          ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  );

  addGroup("projLabels", labels, svgLabel,
    item => item._textName ?? item.labelName,
    item => {
      if (expertMode && expertEditor) {
        if (item._lineIdx != null) { gotoEditorLine(item._lineIdx); return; }
        const escaped = item.labelName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        gotoEditorPattern(new RegExp(`^\\s*${escaped}\\s*:\\s*(?:;.*)?$`));
      } else {
        selectBlockInAsm(item.id);
        programList?.querySelector(`[data-block-id="${item.id}"]`)
          ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  );
}

// ── Project tree SVG icons ─────────────────────────────────────────────────
const _PROJ_SVG = {
  project: `<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="12" height="12"><path d="M1 4C1 3.45 1.45 3 2 3H5.5L7 5H12C12.55 5 13 5.45 13 6V11C13 11.55 12.55 12 12 12H2C1.45 12 1 11.55 1 11V4Z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.1"/></svg>`,
  file_json: `<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="12" height="12"><path d="M2.5 1.5H8.5L11.5 4.5V12.5C11.5 12.78 11.28 13 11 13H3C2.72 13 2.5 12.78 2.5 12.5V2C2.5 1.72 2.72 1.5 3 1.5Z" fill="currentColor" opacity="0.12" stroke="currentColor" stroke-width="1.1"/><path d="M8.5 1.5V4.5H11.5" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><text x="3.5" y="11.5" font-size="4" fill="currentColor" opacity="0.75" font-family="monospace" font-weight="bold">{}</text></svg>`,
  file_generic: `<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="12" height="12"><path d="M2.5 1.5H8.5L11.5 4.5V12.5C11.5 12.78 11.28 13 11 13H3C2.72 13 2.5 12.78 2.5 12.5V2C2.5 1.72 2.72 1.5 3 1.5Z" fill="currentColor" opacity="0.12" stroke="currentColor" stroke-width="1.1"/><path d="M8.5 1.5V4.5H11.5" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

function _projFileIcon(name) {
  const ext = (name || "").split(".").pop().toLowerCase();
  if (ext === "json" || ext === "c64va") return _PROJ_SVG.file_json;
  return _PROJ_SVG.file_generic;
}

function _expertRenderProjectTree() {
  const nameEl = document.getElementById("expert-project-name");
  const treeEl = document.getElementById("expert-project-tree");
  if (!nameEl || !treeEl) return;

  if (!_expertProjectData) {
    nameEl.textContent = t("projNoProject");
    nameEl.title = "";
    treeEl.innerHTML = `<div class="expert-project-empty">${t("projClickToOpen").replace("\n", "<br>")}</div>`;
    return;
  }

  const projName = _expertProjectData.name || "Névtelen projekt";
  nameEl.textContent = projName;
  nameEl.title = _expertProjectData._projPath || "";

  treeEl.innerHTML = "";

  // Root node
  const rootItem = document.createElement("div");
  rootItem.className = "expert-project-item expert-project-item--root";
  const rootIcon = document.createElement("span");
  rootIcon.className = "expert-project-item-icon";
  rootIcon.innerHTML = _PROJ_SVG.project;
  const rootName = document.createElement("span");
  rootName.className = "expert-project-item-name";
  rootName.textContent = projName;
  rootItem.appendChild(rootIcon);
  rootItem.appendChild(rootName);
  treeEl.appendChild(rootItem);

  // Flat file list (ignore any folder nodes from old saves)
  const files = (_expertProjectData.files || []).filter(n => !n.type || n.type === "file");

  if (files.length === 0) {
    const empty = document.createElement("div");
    empty.className = "expert-project-empty";
    empty.style.cssText = "padding: 10px 12px; font-size: 0.68rem;";
    empty.textContent = t("projAddFileHint");
    treeEl.appendChild(empty);
    return;
  }

  const activeTab = tabs.find(t => t.id === activeTabId);
  const activeFilePath = _normFilePath(activeTab?.filePath || "");

  files.forEach(file => {
    if (!file._id) file._id = crypto.randomUUID();
    const isActive = activeFilePath && _normFilePath(_projResolveAbsPath(file.path)) === activeFilePath;
    const isStartup = _expertProjectData.startupFile === file.path;

    const item = document.createElement("div");
    item.className = `expert-project-item expert-project-item--file${isActive ? " expert-project-item--active" : ""}${isStartup ? " expert-project-item--startup" : ""}`;

    const iconEl = document.createElement("span");
    iconEl.className = "expert-project-item-icon";
    iconEl.innerHTML = _projFileIcon(file.name);

    const nameSpan = document.createElement("span");
    nameSpan.className = "expert-project-item-name";
    nameSpan.textContent = file.name;
    nameSpan.title = file.path;

    // Startup star button
    const starBtn = document.createElement("button");
    starBtn.className = "expert-project-item-star" + (isStartup ? " expert-project-item-star--on" : "");
    starBtn.title = isStartup ? t("projUnsetStartup") : t("projSetStartup");
    starBtn.innerHTML = isStartup
      ? `<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="11" height="11"><path d="M7 1L8.5 5.5H13L9.5 8.5L11 13L7 10L3 13L4.5 8.5L1 5.5H5.5L7 1Z" fill="currentColor" stroke="currentColor" stroke-width="0.5"/></svg>`
      : `<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="11" height="11"><path d="M7 1L8.5 5.5H13L9.5 8.5L11 13L7 10L3 13L4.5 8.5L1 5.5H5.5L7 1Z" stroke="currentColor" stroke-width="1" opacity="0.5"/></svg>`;
    starBtn.addEventListener("click", e => {
      e.stopPropagation();
      _expertProjectData.startupFile = _expertProjectData.startupFile === file.path ? null : file.path;
      _expertRenderProjectTree();
    });

    const delBtn = _makeProjDelBtn(() => {
      const idx = _expertProjectData.files.indexOf(file);
      if (idx >= 0) _expertProjectData.files.splice(idx, 1);
      // Clear startup if the deleted file was the startup
      if (_expertProjectData.startupFile === file.path) _expertProjectData.startupFile = null;
      _expertRenderProjectTree();
    });

    item.appendChild(iconEl);
    item.appendChild(nameSpan);
    item.appendChild(starBtn);
    item.appendChild(delBtn);
    item.addEventListener("click", e => {
      if (e.target === delBtn || delBtn.contains(e.target) || e.target === starBtn || starBtn.contains(e.target)) return;
      _expertProjectOpenFile(file);
    });
    treeEl.appendChild(item);
  });
}

function _makeProjDelBtn(onDelete) {
  const btn = document.createElement("button");
  btn.className = "expert-project-item-del";
  btn.title = t("projRemove");
  btn.textContent = "✕";
  btn.addEventListener("click", e => { e.stopPropagation(); onDelete(); });
  return btn;
}

async function _closeAllTabsWithConfirm() {
  // For each tab that has content, ask user. If user cancels any, stop and return false.
  for (const tab of [...tabs]) {
    if (_tabHasContent(tab)) {
      const key = tab.filePath ? "tabCloseConfirmUnsaved" : "tabCloseConfirm";
      const msg = tf(key, { name: tab.name });
      if (!await _showConfirm(msg)) return false;
    }
  }
  // All confirmed — clear all tabs, leave one blank
  tabs.length = 0;
  const blank = _tabCreate();
  blank.program = [makeDefaultOrgBlock()];
  tabs.push(blank);
  activeTabId = blank.id;
  program = JSON.parse(JSON.stringify(blank.program));
  userMacros = {};
  selectedBlockId = null;
  if (expertMode && expertEditor) {
    expertEditor.value = "";
    expertEditor.dispatchEvent(new Event("input"));
  }
  if (currentFileDisplay) currentFileDisplay.textContent = "";
  if (expertFileName) expertFileName.textContent = "";
  updateWindowTitle("");
  renderTabBar();
  return true;
}

async function _closeProject() {
  if (!_expertProjectData && tabs.every(t => !_tabHasContent(t))) {
    _expertSetStatus(t("projNoOpen"), "ok");
    return;
  }

  // Confirm closing project tabs
  if (!await _closeAllTabsWithConfirm()) return;

  // Clear project data
  _expertProjectData = null;

  // Hide project panel
  _expertProjectVisible = false;
  expertProjectBtn?.classList.remove("expert-hl-toggle--on");
  expertProjectBtn?.setAttribute("aria-pressed", "false");
  expertProjectPanel?.setAttribute("hidden", "");

  if (expertMode) {
    _expertRenderProjectTree();
    _expertSetStatus(t("projClosed"), "ok");
  } else {
    _expertSetStatus(t("projClosed"), "ok");
  }

  renderProgram();
  renderAsmOutput();
}

async function _openProjectFromMenu() {
  // Ask user for each dirty tab before loading
  if (!await _closeAllTabsWithConfirm()) return;

  // Load the .proj file first (shared with expert mode)
  const res = await window.electronAPI?.openProjFile?.();
  if (!res || res.canceled) return;
  if (!res.ok) { _expertSetStatus(t("projError") + ": " + res.error, "error"); return; }
  const proj = res.project || {};
  function migrateNodes(nodes) {
    return (nodes || []).map(n => {
      if (n.type === "folder") return { type: "folder", name: n.name, children: migrateNodes(n.children) };
      return { type: "file", name: n.name || n.path?.split("/").pop() || "", path: n.path };
    });
  }
  _expertProjectData = {
    name:        proj.name || "Névtelen projekt",
    files:       migrateNodes(proj.files),
    _projPath:   res.filePath,
    startupFile: proj.startupFile || null
  };

  if (expertMode) {
    // In expert mode: just update the panel as usual
    _expertRenderProjectTree();
    // Auto-open startup file if set
    if (_expertProjectData.startupFile) {
      const sf = _expertProjectData.files.find(f => f.path === _expertProjectData.startupFile);
      if (sf) await _expertProjectOpenFile(sf);
    }
    _expertSetStatus(t("projOpened") + ": " + _expertProjectData.name, "ok");
    return;
  }

  // In block mode: open every file as a tab
  const files = (_expertProjectData.files || []).filter(f => !f.type || f.type === "file");
  if (files.length === 0) {
    _expertSetStatus(t("projOpened") + ": " + _expertProjectData.name, "ok");
    return;
  }
  for (const file of files) {
    await _expertProjectOpenFile(file);
  }

  // Remove the initial blank placeholder tab left by _closeAllTabsWithConfirm
  // (only if at least one real tab was opened)
  if (tabs.length > 1) {
    const blankIdx = tabs.findIndex(t =>
      !t.filePath && (t.program || []).length <= 1 && ((t.program || [])[0]?.isOrgMacro ?? true)
    );
    if (blankIdx >= 0) {
      tabs.splice(blankIdx, 1);
      // Make sure activeTabId still points to a valid tab
      if (!tabs.find(t => t.id === activeTabId)) {
        activeTabId = tabs[0].id;
        _tabActivate(activeTabId);
      } else {
        renderTabBar();
      }
    }
  }

  _expertSetStatus(t("projOpened") + ": " + _expertProjectData.name, "ok");
}

function _projResolveAbsPath(relPath) {
  if (!relPath) return relPath;
  // Already absolute?
  if (/^[A-Za-z]:[\\/]/.test(relPath) || relPath.startsWith("/")) {
    return relPath.replace(/\\/g, "/");
  }
  if (!_expertProjectData?._projPath) return relPath;
  const dir = _expertProjectData._projPath.replace(/\\/g, "/").replace(/\/[^\/]*$/, "");
  return dir + "/" + relPath.replace(/\\/g, "/");
}

function _normFilePath(p) {
  return (p || "").replace(/\\/g, "/").toLowerCase();
}

async function _expertOpenProject() {
  if (!await _closeAllTabsWithConfirm()) return;
  const res = await window.electronAPI?.openProjFile?.();
  if (!res || res.canceled) return;
  if (!res.ok) { _expertSetStatus(t("projError") + ": " + res.error, "error"); return; }
  const proj = res.project || {};
  // Backward compat: old format had plain {name, path} objects without type field
  function migrateNodes(nodes) {
    return (nodes || []).map(n => {
      if (n.type === "folder") return { type: "folder", name: n.name, children: migrateNodes(n.children), _open: true };
      return { type: "file", name: n.name || n.path?.split("/").pop() || "", path: n.path };
    });
  }
  _expertProjectData = {
    name:        proj.name  || "Névtelen projekt",
    files:       migrateNodes(proj.files),
    _projPath:   res.filePath,
    startupFile: proj.startupFile || null
  };
  _expertRenderProjectTree();
  // Auto-open startup file if set
  if (_expertProjectData.startupFile) {
    const sf = _expertProjectData.files.find(f => f.path === _expertProjectData.startupFile);
    if (sf) await _expertProjectOpenFile(sf);
  }
  _expertSetStatus(t("projOpened") + ": " + _expertProjectData.name, "ok");
}

async function _expertNewProject() {
  _expertProjectData = { name: "Új projekt", files: [], _projPath: null };
  _expertRenderProjectTree();
  // Open save dialog right away so user can set name/path
  await _expertSaveProject();
}

async function _expertSaveProject() {
  if (!_expertProjectData) return;
  // Strip runtime-only fields before serialising
  const cleaned = (_expertProjectData.files || [])
    .filter(n => !n.type || n.type === "file")
    .map(n => ({ type: "file", name: n.name, path: n.path }));
  const payload = JSON.stringify({ name: _expertProjectData.name, files: cleaned, startupFile: _expertProjectData.startupFile || null }, null, 2);
  const path = _expertProjectData._projPath || "";
  const res = await window.electronAPI?.saveProjFile?.(path, payload);
  if (!res || res.canceled) return;
  if (!res.ok) { _expertSetStatus(t("projSaveError") + ": " + res.error, "error"); return; }
  _expertProjectData._projPath = res.filePath;
  // Update project name from filename if freshly created
  if (!_expertProjectData.name || _expertProjectData.name === "Új projekt") {
    _expertProjectData.name = res.filePath.replace(/\\/g, "/").split("/").pop().replace(/\.proj$/i, "");
  }
  _expertRenderProjectTree();
  _expertSetStatus(t("projSaved"), "ok");
}

async function _expertAddProjMember() {
  const res = await window.electronAPI?.chooseProjMember?.();
  if (!res || res.canceled) return;
  if (!_expertProjectData) {
    _expertProjectData = { name: "Névtelen projekt", files: [], _projPath: null };
  }
  // Compute relative path if project has a saved path
  let relPath = res.filePath;
  if (_expertProjectData._projPath) {
    const projDir = _expertProjectData._projPath.replace(/\\/g, "/").replace(/\/[^/]+$/, "");
    const absFile = res.filePath.replace(/\\/g, "/");
    if (absFile.startsWith(projDir + "/")) {
      relPath = absFile.slice(projDir.length + 1);
    }
  }
  // Avoid duplicates
  if (!_expertProjectData.files.some(f => f.path === relPath)) {
    _expertProjectData.files.push({ type: "file", name: res.fileName, path: relPath });
  }
  _expertRenderProjectTree();
}

async function _expertProjectOpenFile(fileEntry) {
  const absPath = _projResolveAbsPath(fileEntry.path);
  const normAbs = _normFilePath(absPath);

  // If tab for this file already open, just activate it
  const existing = tabs.find(t => _normFilePath(t.filePath) === normAbs);
  if (existing) {
    _tabActivate(existing.id);
    // Scroll active tab into view
    const tabBar = document.getElementById("tab-bar");
    const activeEl = tabBar?.querySelector(".tab-item--active");
    if (activeEl) activeEl.scrollIntoView({ block: "nearest", inline: "nearest" });
    _expertRenderProjectTree();
    return;
  }

  // Load as C64VA project JSON → program blocks
  const res = await window.electronAPI?.readTextFile?.(absPath);
  if (!res || !res.ok) {
    _expertSetStatus("Nem nyitható meg: " + (res?.error || "ismeretlen hiba"), "error");
    return;
  }

  let projectData;
  try {
    projectData = JSON.parse(res.content);
  } catch (e) {
    _expertSetStatus("Érvénytelen JSON: " + e.message, "error");
    return;
  }

  if (projectData.app !== "c64-visual-assembler" || !Array.isArray(projectData.program)) {
    _expertSetStatus("Nem C64VA projektfájl: " + fileEntry.name, "error");
    return;
  }

  // Parse program blocks (same logic as loadProjectFromFile)
  let loadedProgram = projectData.program.map(block => ({
    ...block,
    id: block.id || crypto.randomUUID()
  }));

  for (const block of loadedProgram) {
    if (block.isIncludeMacro && !block.includeFile) {
      const name = block.includeFileName || "";
      if (name) block.includeFile = /\.json$/i.test(name) ? name : `${name}.json`;
    }
    if (block.isIncBinMacro && !block.incBinFile) {
      const name = block.incBinFileName || "";
      if (name) block.incBinFile = name;
    }
    if (block.isSidMacro && !block.sidFile) {
      const name = block.sidFileName || "";
      if (name) block.sidFile = name;
    }
  }

  if (!loadedProgram.some(b => b.isOrgMacro)) {
    const orgAddr = (projectData.origin || "0801").replace(/^\$/, "").toUpperCase().padStart(4, "0");
    loadedProgram.unshift({ ...makeDefaultOrgBlock(), orgAddress: orgAddr });
  }

  // Create new tab
  _tabSaveCurrent();
  const tab = _tabCreate();
  tab.name     = fileEntry.name;
  tab.filePath = absPath;
  tab.program  = loadedProgram;
  tab.userMacros = {};
  tabs.push(tab);
  activeTabId = tab.id;

  program = JSON.parse(JSON.stringify(loadedProgram));
  userMacros = {};
  selectedBlockId = null;

  const displayName = tab.name;
  if (expertFileName)    expertFileName.textContent    = displayName;
  if (currentFileDisplay) currentFileDisplay.textContent = displayName;
  updateWindowTitle(displayName);

  await reloadIncludeBlocks(absPath);
  await reloadIncBinBlocks(absPath);
  await reloadSidBlocks(absPath);

  parseUserMacros();
  renderTabBar();
  renderProgram();
  renderAsmOutput();
  if (expertMode) _expertSyncFromProgram();
  markTabClean();
  _expertRenderProjectTree();
  _expertSetStatus(t("projOpenFile") + ": " + displayName, "ok");
}

function parseUserMacros() {
  userMacros = {};
  let macroStart = -1;
  let macroName = null;

  // Build a flat list: top-level program + any includedBlocks from INCLUDE macros
  const allBlocks = [];
  for (const block of program) {
    allBlocks.push(block);
    // Libraries with a fixed includeAddress emit macros as subroutines (not inline templates)
    if (block.isIncludeMacro && block.includedBlocks?.length && !block.includeAddress) {
      for (const sub of block.includedBlocks) {
        allBlocks.push(sub);
      }
    }
  }

  for (let i = 0; i < allBlocks.length; i++) {
    const block = allBlocks[i];

    if (block.isMacroDefStart) {
      macroStart = i;
      macroName = block.macroName;
    } else if (block.isMacroDefEnd && macroStart >= 0 && macroName) {
      const macroBody = allBlocks.slice(macroStart + 1, i);
      userMacros[macroName] = macroBody;
      macroStart = -1;
      macroName = null;
    }
  }

  // Sync validation errors on all INVOKE blocks with the current macro map
  for (const block of program) {
    if (block.isMacroInvoke) {
      const name = block.invokeMacroName;
      if (name && userMacros[name]) {
        block.validationError = "";
      } else if (!name) {
        block.validationError = currentLanguage === "en" ? "No macros defined yet" : "Meg nincs definialva makro";
      } else {
        block.validationError = currentLanguage === "en" ? `Macro not found: ${name}` : `Makro nem talalhato: ${name}`;
      }
    }
  }
}

function insertBlock(index, block) {
  markTabDirty();
  if (block.isLoopMacro && !block.loopLabel) {
    let n = 1;
    while (program.some(b => b.isLoopMacro && b.loopLabel === `loop${n}`)) n++;
    block.loopLabel = `loop${n}`;
  }
  if (block.isNextMacro && !block.nextLabel) {
    const loopsAbove = program.slice(0, index).filter(b => b.isLoopMacro);
    if (loopsAbove.length > 0) {
      const last = loopsAbove[loopsAbove.length - 1];
      block.nextLabel = last.loopLabel;
      block.nextReg = last.loopReg || "X";
    }
  }
  if (block.isForMacro && !block.loopLabel) {
    let n = 1;
    while (program.some(b => (b.isForMacro || b.isLoopMacro) && b.loopLabel === `for${n}`)) n++;
    block.loopLabel = `for${n}`;
  }
  if (block.isEndfMacro && !block.nextLabel) {
    const loopsAbove = program.slice(0, index).filter(b => b.isForMacro);
    if (loopsAbove.length > 0) {
      const last = loopsAbove[loopsAbove.length - 1];
      block.nextLabel = last.loopLabel;
      block.nextReg = last.loopReg || "X";
      block.nextCount = last.loopCount || "0A";
    }
  }
  program.splice(index, 0, block);
  operandInput.value = "";
  renderMnemonicDescription();
  parseUserMacros();  // Re-parse macros whenever program changes
  renderProgram();
}

function moveBlock(index, offset) {
  const targetIndex = index + offset;
  if (targetIndex < 0 || targetIndex >= program.length) {
    return;
  }

  [program[index], program[targetIndex]] = [program[targetIndex], program[index]];
  renderProgram();
}

function toggleBlockCollapsed(index) {
  const block = program[index];
  if (!block) {
    return;
  }

  block.collapsed = !block.collapsed;

  const node = programList.querySelector(`[data-index="${index}"]`);
  if (node) {
    node.dataset.collapsed = block.collapsed ? "true" : "false";
    const toggle = node.querySelector(".collapse-toggle");
    if (toggle) {
      toggle.textContent = block.collapsed ? "\u25B8" : "\u25BE";
      toggle.setAttribute("aria-label", block.collapsed ? t("expand") : t("collapse"));
      toggle.setAttribute("title", block.collapsed ? t("expand") : t("collapse"));
    }
  } else {
    renderProgram();
  }
}

function toggleRegionCollapsed(index) {
  const block = program[index];
  if (!block) return;
  block.regionCollapsed = !block.regionCollapsed;
  block.collapsed = block.regionCollapsed; // also collapse the REGION block body
  renderProgram();
  renderAsmOutput();
  renderMemoryMap();
}

function collapseAllBlocks() {
  program.forEach((block) => {
    block.collapsed = true;
    if (block.isRegionMacro) block.regionCollapsed = true;
  });
  renderProgram();
}

function expandAllBlocks() {
  program.forEach((block) => {
    block.collapsed = false;
    if (block.isRegionMacro) block.regionCollapsed = false;
  });
  renderProgram();
}

function updateProgramBlock(index, field, value) {
  markTabDirty();
  const block = program[index];
  const prevBase = block.base;
  const prevConstName = block.constName;
  block[field] = value;

  if (field === "labelName") {
    block.labelName = sanitizeLabelName(value);
    parseUserMacros();  // Re-parse in case label is inside a macro
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (field === "macroName") {
    block.macroName = sanitizeLabelName(value);
    parseUserMacros();  // Re-parse when macro name changes
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (field === "invokeMacroName") {
    block.invokeMacroName = value;
    // Keep mnemonic as "INVOKE", don't change it
    block.validationError = userMacros[value] ? "" : (currentLanguage === "en" ? "Macro not found" : "Makro nem talalhato");
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isComment && field === "rawOperand") {
    block.operand = block.rawOperand.trim();
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (field === "rawOperand" || field === "base" || field === "addressingMode") {
    if (block.isTextMacro) {
      block.operand = block.rawOperand.trim();
      block.validationError = validateTextMacroPosition(block.textX ?? 0, block.textY ?? 0, block.rawOperand);
    } else if (block.isByteMacro) {
      if (field === "base") {
        const bytes = parseByteMacro(block.rawOperand, prevBase);
        block.rawOperand = convertByteArray(bytes, value);
      }
      block.operand = block.rawOperand.trim();
      block.validationError = validateByteMacro(block.rawOperand, block.base);
    } else if (block.isStringMacro) {
      block.operand = block.rawOperand.trim();
      block.validationError = validateStringMacroAddress(block.stringAddress);
    } else if (block.isDataMacro) {
      if (field === "base") {
        const bytes = parseByteMacro(block.rawOperand, prevBase);
        block.rawOperand = convertByteArray(bytes, value);
      }
      block.operand = block.rawOperand.trim();
      block.validationError = validateDataMacro(block.rawOperand, block.dataAddress, block.base);
    } else if (block.isRawBytesMacro) {
      if (field === "base") {
        const bytes = parseByteMacro(block.rawOperand, prevBase);
        block.rawOperand = convertByteArray(bytes, value);
      }
      block.operand = block.rawOperand.trim();
      block.validationError = validateDataMacro(block.rawOperand, block.rawBytesAddress, block.base);
    } else if (block.isIncBinMacro) {
      block.validationError = validateIncBinMacro(block.incBinBytes, block.incBinAddress);
    } else if (block.isRawTextMacro) {
      block.operand = block.rawOperand.trim();
      block.validationError = validateStringMacroAddress(block.rawTextAddress);
    } else if (block.isPetsciiMacro) {
      block.operand = block.rawOperand.trim();
      block.validationError = validateStringMacroAddress(block.petsciiAddress);
    } else if (block.isWordMacro) {
      if (field === "base") {
        const words = parseWordMacro(block.rawOperand, prevBase);
        block.rawOperand = words.map(w => {
          return value === "hex" ? w.toString(16).toUpperCase() : w.toString(10);
        }).join(",");
      }
      block.operand = block.rawOperand.trim();
      block.validationError = validateWordMacro(block.rawOperand, block.base);
    } else if (block.isFillMacro) {
      block.operand = block.rawOperand.trim();
      block.validationError = validateFillMacro(block.rawOperand, block.base);
    } else if (block.isAlignMacro) {
      block.operand = block.rawOperand.trim();
      block.validationError = validateAlignMacro(block.rawOperand, block.base);
    } else if (block.isDefineMacro) {
      block.operand = block.rawOperand.trim();
      block.defineSymbol = block.rawOperand.trim();
      block.validationError = validateDefineMacro(block.rawOperand);
    } else if (block.isConstMacro) {
      if (field === "base") {
        const numericValue = parseNumberByBase(block.rawOperand.replace(/^\$/, ""), prevBase);
        if (numericValue !== null) {
          block.rawOperand = value === "hex"
            ? numericValue.toString(16).toUpperCase().padStart(4, "0")
            : value === "bin"
              ? numericValue.toString(2).padStart(numericValue > 255 ? 16 : 8, "0")
              : String(numericValue);
        }
      }
      block.operand = block.rawOperand.trim();
      block.constValue = parseNumberByBase(block.rawOperand.replace(/^\$/, ""), block.base);
      block.validationError = validateConstMacro(block.constName, block.rawOperand, block.base);
    } else if (block.isIfMacro) {
      block.operand = block.rawOperand.trim();
      block.ifCondition = block.rawOperand.trim();
      block.validationError = validateIfMacro(block.rawOperand);
    } else {
      if (field === "base" && block.rawOperand) {
        // parseNumberByBase now handles $ and % prefixes universally, no need to strip $
        const numericValue = parseNumberByBase(block.rawOperand.trim(), prevBase);
        if (numericValue !== null && numericValue >= 0) {
          if (value === "hex") {
            block.rawOperand = numericValue.toString(16).toUpperCase();
          } else if (value === "dec") {
            block.rawOperand = String(numericValue);
          } else if (value === "bin") {
            const is16bit = ["absolute", "absoluteX", "absoluteY", "indirect"].includes(block.addressingMode);
            block.rawOperand = numericValue.toString(2).padStart(is16bit ? 16 : 8, "0");
          }
        }
      }
      // If addressing mode changed away from immediate while base is "bin",
      // BIN no longer makes sense for address operands — coerce to hex.
      if (field === "addressingMode" && block.base === "bin" && value !== "immediate") {
        const numericValue = parseNumberByBase(block.rawOperand.trim(), "bin");
        block.base = "hex";
        if (numericValue !== null && numericValue >= 0) {
          block.rawOperand = numericValue.toString(16).toUpperCase();
        }
      }
      const preview = buildOperandPreview(block.addressingMode, block.rawOperand, block.base);
      block.operand = preview.operand;
      block.validationError = preview.error;
    }
  }

  if (field === "textX" || field === "textY") {
    const numeric = Number.parseInt(value, 10);
    block[field] = Number.isInteger(numeric) ? numeric : 0;
    block.validationError = validateTextMacroPosition(block.textX, block.textY, block.rawOperand);
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (field === "stringAddress") {
    block.validationError = validateStringMacroAddress(block.stringAddress) || validateTextWithOffset(block.rawOperand, block.charOffset);
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (field === "dataAddress") {
    block.validationError = validateDataMacro(block.rawOperand, block.dataAddress, block.base);
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (field === "rawBytesAddress") {
    block.validationError = validateDataMacro(block.rawOperand, block.rawBytesAddress, block.base);
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (field === "incBinAddress" || field === "incBinFile" || field === "incBinFileName" || field === "incBinBytes") {
    block.validationError = validateIncBinMacro(block.incBinBytes, block.incBinAddress);
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (field === "rawTextAddress") {
    block.validationError = validateStringMacroAddress(block.rawTextAddress) || validateTextWithOffset(block.rawOperand, block.charOffset);
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (field === "petsciiAddress") {
    block.validationError = validateStringMacroAddress(block.petsciiAddress);
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isJoystickMacro && (field === "joyPort" || field === "joySpriteNum")) {
    const port = parseInt(field === "joyPort" ? value : block.joyPort, 10);
    const num = parseInt(field === "joySpriteNum" ? value : block.joySpriteNum, 10);
    block.validationError =
      (port !== 1 && port !== 2) ? (currentLanguage === "en" ? "Port must be 1 or 2." : "A port 1 vagy 2 lehet.") :
      (isNaN(num) || num < 0 || num > 7) ? (currentLanguage === "en" ? "Sprite number must be 0–7." : "A sprite szama 0 es 7 kozott lehet.") :
      "";
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isMouseMacro && (field === "mousePort" || field === "mouseSpriteNum" || field === "mousePotXZP" || field === "mousePotYZP")) {
    const port = parseInt(field === "mousePort" ? value : block.mousePort, 10);
    const num = parseInt(field === "mouseSpriteNum" ? value : block.mouseSpriteNum, 10);
    const zpX = (field === "mousePotXZP" ? value : block.mousePotXZP || "FD").replace(/^\$/, "");
    const zpY = (field === "mousePotYZP" ? value : block.mousePotYZP || "FE").replace(/^\$/, "");
    block.validationError =
      (port !== 1 && port !== 2) ? (currentLanguage === "en" ? "Port must be 1 or 2." : "A port 1 vagy 2 lehet.") :
      (isNaN(num) || num < 0 || num > 7) ? (currentLanguage === "en" ? "Sprite number must be 0–7." : "A sprite szama 0 es 7 kozott lehet.") :
      (!/^[0-9A-Fa-f]{1,2}$/.test(zpX)) ? (currentLanguage === "en" ? "ZP X must be a hex byte (00–FF)." : "ZP X 1 hex byte legyen (00–FF).") :
      (!/^[0-9A-Fa-f]{1,2}$/.test(zpY)) ? (currentLanguage === "en" ? "ZP Y must be a hex byte (00–FF)." : "ZP Y 1 hex byte legyen (00–FF).") :
      "";
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isSpriteColMacro && (field === "spriteNum" || field === "colType")) {
    const num = parseInt(field === "spriteNum" ? value : block.spriteNum, 10);
    block.validationError = (isNaN(num) || num < 0 || num > 7)
      ? (currentLanguage === "en" ? "Sprite number must be 0–7." : "A sprite szama 0 es 7 kozott lehet.")
      : "";
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isWaitRasterMacro && field === "rasterLine") {
    const v = value.replace(/^\$/, "");
    const parsed = parseInt(v, 16);
    block.validationError = (isNaN(parsed) || parsed < 0 || parsed > 255)
      ? (currentLanguage === "en" ? "Raster line must be a hex byte ($00–$FF)." : "A rasztersor 1 hex byte legyen ($00-$FF).")
      : "";
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isTurboSetMacro && (field === "turboSpeed" || field === "turboBadline")) {
    const spd = parseInt(block.turboSpeed || "7", 10);
    block.validationError = (isNaN(spd) || spd < 0 || spd > 15)
      ? (currentLanguage === "en" ? "Turbo speed must be 0–15." : "A turbo sebesseg 0 es 15 kozott lehet.")
      : "";
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isSpriteInitMacro && (field === "spriteNum" || field === "spriteColor" || field === "spriteDataPage")) {
    block.validationError = validateSpriteInitMacro(block.spriteNum, block.spriteColor, block.spriteDataPage);
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isLoadFileMacro && (field === "loadFileName" || field === "loadFileDevice" || field === "loadFileAddress" || field === "loadFileErrorLabel")) {
    if (field === "loadFileName") {
      // Sanitize: ASCII printable only, max 16 chars, uppercase (PETSCII A-Z = $41-$5A)
      block.loadFileName = (value || "").toUpperCase().replace(/[^\x20-\x7E]/g, "").replace(/["\,\/\\:\*\?<>\|]/g, "").slice(0, 16);
    }
    if (field === "loadFileErrorLabel") {
      block.loadFileErrorLabel = sanitizeLabelName(value);
    }
    block.validationError = "";
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isSpritePosMacro && (field === "spriteNum" || field === "spriteX" || field === "spriteY")) {
    block.validationError = validateSpritePosMacro(block.spriteNum, block.spriteX, block.spriteY);
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isReuTransferMacro && (field === "reuC64Addr" || field === "reuExpAddr" || field === "reuBank" || field === "reuLength")) {
    const c64Addr = parseInt((block.reuC64Addr || "C000").replace(/^\$/, ""), 16);
    const expAddr = parseInt((block.reuExpAddr || "0000").replace(/^\$/, ""), 16);
    const bankVal = parseInt(block.reuBank || "0", 10);
    const length  = parseInt((block.reuLength || "0100").replace(/^\$/, ""), 16);
    if (isNaN(c64Addr) || c64Addr < 0 || c64Addr > 0xFFFF) {
      block.validationError = currentLanguage === "en" ? "C64 address must be $0000–$FFFF." : "A C64 cim $0000-$FFFF kozott lehet.";
    } else if (isNaN(expAddr) || expAddr < 0 || expAddr > 0xFFFF) {
      block.validationError = currentLanguage === "en" ? "REU address must be $0000–$FFFF." : "A REU cim $0000-$FFFF kozott lehet.";
    } else if (isNaN(bankVal) || bankVal < 0 || bankVal > 7) {
      block.validationError = currentLanguage === "en" ? "REU bank must be 0–7." : "A REU bank 0-7 lehet.";
    } else if (isNaN(length) || length < 1 || length > 0xFFFF) {
      block.validationError = currentLanguage === "en" ? "Length must be $0001–$FFFF." : "A hossz $0001-$FFFF kozott lehet.";
    } else {
      block.validationError = "";
    }
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isLoopMacro && (field === "loopReg" || field === "loopCount" || field === "loopLabel")) {
    if (field === "loopLabel") {
      block.loopLabel = sanitizeLabelName(value);
    }
    block.validationError = "";
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isNextMacro && field === "nextLabel") {
    block.nextLabel = sanitizeLabelName(value);
    const matching = program.find(b => b.isLoopMacro && b.loopLabel === block.nextLabel);
    if (matching) block.nextReg = matching.loopReg || "X";
    block.validationError = "";
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isForMacro && (field === "loopReg" || field === "loopCount" || field === "loopLabel")) {
    if (field === "loopLabel") {
      block.loopLabel = sanitizeLabelName(value);
    }
    block.validationError = "";
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isEndfMacro && field === "nextLabel") {
    block.nextLabel = sanitizeLabelName(value);
    const matching = program.find(b => b.isForMacro && b.loopLabel === block.nextLabel);
    if (matching) {
      block.nextReg = matching.loopReg || "X";
      block.nextCount = matching.loopCount || "0A";
    }
    block.validationError = "";
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isPushMacro && field === "pushRegs") {
    const sanitized = value.toUpperCase().split("").filter(c => c === "A" || c === "X" || c === "Y").join("");
    block.pushRegs = sanitized || "A";
    block.validationError = "";
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isPullMacro && field === "pullRegs") {
    const sanitized = value.toUpperCase().split("").filter(c => c === "A" || c === "X" || c === "Y").join("");
    block.pullRegs = sanitized || "A";
    block.validationError = "";
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isTableMacro && (field === "tableName" || field === "tableAddress")) {
    if (field === "tableName") {
      block.tableName = sanitizeLabelName(value);
    }
    block.validationError = validateTableMacro(block.tableName, block.tableAddress);
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isIncludeMacro && field === "includeAddress") {
    block.includeAddress = value.replace(/[^0-9a-fA-F]/g, "").toUpperCase().slice(0, 4);
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isOrgMacro && field === "orgAddress") {
    const orgBase = block.base || "hex";
    if (orgBase === "dec") {
      const parsed = parseInt(value, 10);
      block.orgAddress = !isNaN(parsed) ? parsed.toString(16).toUpperCase().padStart(4, "0") : (block.orgAddress || "0900");
    } else if (orgBase === "bin") {
      const bits = value.replace(/[^01]/g, "");
      const parsed = bits ? parseInt(bits, 2) : NaN;
      block.orgAddress = !isNaN(parsed) ? parsed.toString(16).toUpperCase().padStart(4, "0") : (block.orgAddress || "0900");
    } else {
      block.orgAddress = value.replace(/[^0-9a-fA-F]/g, "").toUpperCase().slice(0, 4) || "0900";
    }
    renderBlockPreview(index);
    renderOriginPreview();
    renderAsmOutput();
    return;
  }

  if (block.isSidMacro && field === "sidCustomAddress") {
    block.sidCustomAddress = value;
    renderBlockPreview(index);
    renderAsmOutput();
    // Update the SID meta line in-place (shows relocated init/play addresses)
    const node = programList.querySelector(`.asm-block[data-index="${index}"]`);
    const metaLine = node?.querySelector(".sid-meta .sid-meta-line:last-child");
    if (metaLine && block.sidTitle) {
      const fmtHex = v => v ? `$${v.toString(16).toUpperCase().padStart(4, "0")}` : "—";
      const customAddr = value ? parseAddressValue(value.replace(/^\$/, "")) : null;
      const effLoad = customAddr ?? block.sidLoadAddress ?? 0;
      const addrOffset = (customAddr !== null && block.sidLoadAddress) ? customAddr - block.sidLoadAddress : 0;
      const effInit = block.sidInitAddress ? block.sidInitAddress + addrOffset : 0;
      const effPlay = block.sidPlayAddress ? block.sidPlayAddress + addrOffset : 0;
      const overrideNote = addrOffset !== 0 ? ` <small style="color:var(--accent)">(relocated)</small>` : "";
      metaLine.innerHTML = `Load: ${fmtHex(effLoad)} &nbsp; Init: ${fmtHex(effInit)} &nbsp; Play: ${fmtHex(effPlay)}${overrideNote}`;
    }
    return;
  }

  if (block.isConstMacro && field === "constName") {
    const newName = sanitizeLabelName(value);
    block.constName = newName;
    block.validationError = validateConstMacro(block.constName, block.rawOperand, block.base);
    // Rename all instruction blocks that reference the old const name
    if (prevConstName && newName && prevConstName !== newName) {
      program.forEach((b, i) => {
        if (i === index) return;
        if (b.rawOperand === prevConstName) {
          b.rawOperand = newName;
          const preview = buildOperandPreview(b.addressingMode, b.rawOperand, b.base);
          b.operand = preview.operand;
          b.validationError = preview.error;
          // Update the operand input field in-place without full re-render
          const otherNode = programList.querySelector(`.asm-block[data-index="${i}"]`);
          const otherOperandField = otherNode?.querySelector(".block-operand");
          if (otherOperandField) otherOperandField.value = newName;
          renderBlockPreview(i);
        }
      });
      // Update label picker dropdowns in all expanded blocks
      programList.querySelectorAll(".label-picker-item").forEach(item => {
        if (item.textContent === prevConstName) item.textContent = newName;
      });
    }
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isMacroDefStart && field === "macroName") {
    block.macroName = sanitizeLabelName(value);
    block.operand = block.macroName;
    block.rawOperand = block.macroName;
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isRegionMacro && field === "regionName") {
    block.regionName = value;
    block.operand = value;
    block.rawOperand = value;
    // Update the matching ENDREGION's read-only input in the DOM directly (depth-aware)
    let depth = 0;
    for (let i = index + 1; i < program.length; i++) {
      if (program[i].isRegionMacro) { depth++; }
      else if (program[i].isEndRegionMacro) {
        if (depth === 0) {
          const endNode = programList.querySelector(`[data-index="${i}"]`);
          const endInput = endNode?.querySelector(".inline-field input");
          if (endInput) endInput.value = value || "region";
          break;
        }
        depth--;
      }
    }
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (field === "rawOperand" || field === "base") {
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (field === "macroLabel" || field === "charOffset") {
    if (field === "charOffset" && (block.isStringMacro || block.isRawTextMacro)) {
      block.validationError = validateTextWithOffset(block.rawOperand, block.charOffset);
      renderBlockPreview(index);
    }
    renderAsmOutput();
    return;
  }

  renderProgram();
}

function deleteBlock(index) {
  markTabDirty();
  program.splice(index, 1);
  parseUserMacros();  // Re-parse when blocks are deleted
  renderProgram();
}

function setupProgramDropZone() {
  // Drop handling is done in setupMouseDnd via global mouseup
}

function setupMouseDnd() {
  document.addEventListener("pointermove", (e) => {
    if (!_dndSrc) return;

    if (!_dndActive) {
      const dx = e.clientX - _dndSrc.x;
      const dy = e.clientY - _dndSrc.y;
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;

      _dndActive = true;
      dragState = _dndSrc.dragState;
      _dndSrc.node?.classList.add("dragging");
      document.body.classList.add("dnd-active");

      _dndGhost = document.createElement("div");
      _dndGhost.className = "dnd-ghost";
      _dndGhost.textContent = _dndSrc.label;
      document.body.appendChild(_dndGhost);
    }

    if (_dndGhost) {
      _dndGhost.style.left = (e.clientX + 14) + "px";
      _dndGhost.style.top = (e.clientY - 10) + "px";
    }

    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (el && (el === programList || programList.contains(el))) {
      highlightDropTarget(getDropIndex(e.clientY));
    } else {
      clearDropIndicators();
    }
  });

  document.addEventListener("pointerup", (e) => {
    if (!_dndSrc) return;

    if (_dndActive) {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el && (el === programList || programList.contains(el))) {
        const dropIndex = getDropIndex(e.clientY);
        clearDropIndicators();
        if (dragState.type === "palette") {
          insertBlock(dropIndex, { ...dragState.block, id: crypto.randomUUID() });
        } else if (dragState.type === "program") {
          reorderBlock(dragState.index, dropIndex);
        }
      } else {
        clearDropIndicators();
      }

      _dndGhost?.remove();
      _dndGhost = null;
      _dndSrc.node?.classList.remove("dragging");
      document.body.classList.remove("dnd-active");
      dragState = null;
    }

    _dndSrc = null;
    _dndActive = false;
  });

  document.addEventListener("pointercancel", () => {
    if (!_dndSrc) return;
    _dndGhost?.remove();
    _dndGhost = null;
    _dndSrc.node?.classList.remove("dragging");
    document.body.classList.remove("dnd-active");
    clearDropIndicators();
    dragState = null;
    _dndSrc = null;
    _dndActive = false;
  });
}

function getDropIndex(pointerY) {
  const blocks = [...programList.querySelectorAll(".asm-block")];
  const target = blocks.find((block) => {
    const rect = block.getBoundingClientRect();
    return pointerY < rect.top + rect.height / 2;
  });

  if (!target) {
    return program.length;
  }

  return Number(target.dataset.index);
}

function highlightDropTarget(dropIndex) {
  clearDropIndicators();
  const blocks = [...programList.querySelectorAll(".asm-block")];

  if (!blocks.length) {
    programList.classList.add("drop-active");
    return;
  }

  if (dropIndex === 0) {
    blocks[0].classList.add("drop-before");
  } else {
    // Find the block with data-index === dropIndex - 1 (handles region-wrapper nesting)
    const target = blocks.find(b => Number(b.dataset.index) === dropIndex - 1)
      || blocks[blocks.length - 1];
    target.classList.add("drop-after");
  }
}

function clearDropIndicators() {
  programList.classList.remove("drop-active");
  programList.querySelectorAll(".drop-before, .drop-after").forEach((node) => {
    node.classList.remove("drop-before", "drop-after");
  });
}

function reorderBlock(fromIndex, dropIndex) {
  if (fromIndex === dropIndex || fromIndex + 1 === dropIndex) {
    renderProgram();
    return;
  }

  const [moved] = program.splice(fromIndex, 1);
  const targetIndex = fromIndex < dropIndex ? dropIndex - 1 : dropIndex;
  program.splice(targetIndex, 0, moved);
  parseUserMacros();  // Re-parse when blocks are reordered
  renderProgram();
}

function startMouseDnd(e, node, ds, label) {
  if (e.button !== 0) return;
  e.preventDefault();
  e.target.setPointerCapture?.(e.pointerId);
  _dndSrc = { x: e.clientX, y: e.clientY, node, dragState: ds, label };
}

function buildOperandPreview(modeKey, rawValue, base) {
  const mode = addressingModes[modeKey];
  // Strip leading # if user typed it in immediate mode — # is added automatically by formatOperand
  const value = (modeKey === "immediate" ? rawValue.trim().replace(/^#/, "") : rawValue.trim());

  if (!mode.needsOperand) {
    return { operand: "", text: currentLanguage === "en" ? "no operand" : "operandus nelkul", error: "" };
  }

  // * = current program counter (e.g. JMP *, JSR *, BNE *)
  if (value === "*") {
    const display = modeKey === "immediate" ? "#*"
      : (modeKey === "absoluteX" || modeKey === "zeroPageX") ? "*,X"
      : (modeKey === "absoluteY" || modeKey === "zeroPageY") ? "*,Y"
      : (modeKey === "indirectX") ? "(*,X)"
      : (modeKey === "indirectY") ? "(*),Y"
      : "*";
    return { operand: display, text: display, error: "" };
  }

  // - / + anonymous labels (ACME-style: - = backward, + = forward)
  if (value === "-" || value === "+") {
    const operand = modeKey === "immediate" ? `#${value}`
      : (modeKey === "absoluteX" || modeKey === "zeroPageX") ? `${value},X`
      : (modeKey === "absoluteY" || modeKey === "zeroPageY") ? `${value},Y`
      : (modeKey === "indirectX") ? `(${value},X)`
      : (modeKey === "indirectY") ? `(${value}),Y`
      : value;
    return { operand, text: operand, error: "" };
  }

  if (!value) {
    return { operand: "", text: currentLanguage === "en" ? "missing operand" : "hianyzo operandus", error: currentLanguage === "en" ? "This addressing mode requires an operand." : "Ehhez a cimzesi modhoz operandus kell." };
  }

  if (modeKey === "relative" && parseNumberByBase(value, base) === null) {
    return { operand: value, text: value, error: "" };
  }

  const numericValue = parseNumberByBase(value, base);
  if (numericValue === null) {
    // Handle #<label and #>label low/high byte operators in immediate mode
    if (modeKey === "immediate" && (value.startsWith("<") || value.startsWith(">"))) {
      const name = value.slice(1).trim();
      if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
        const operand = `#${value}`;
        return { operand, text: operand, error: "" };
      }
    }
    // Allow label names (letters, digits, underscore) as valid operands for any addressing mode
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
      const operand = modeKey === "immediate" ? `#${value}`
        : (modeKey === "absoluteX" || modeKey === "zeroPageX") ? `${value},X`
        : (modeKey === "absoluteY" || modeKey === "zeroPageY") ? `${value},Y`
        : (modeKey === "indirectX") ? `(${value},X)`
        : (modeKey === "indirectY") ? `(${value}),Y`
        : value;
      return { operand, text: operand, error: "" };
    }
    // Allow label+offset or label-offset expressions (e.g. screen_ram+$0100)
    const exprMatch = value.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*([+-])\s*(\$[0-9A-Fa-f]+|\d+)$/);
    if (exprMatch) {
      const operand = modeKey === "immediate" ? `#${value}`
        : (modeKey === "absoluteX" || modeKey === "zeroPageX") ? `${value},X`
        : (modeKey === "absoluteY" || modeKey === "zeroPageY") ? `${value},Y`
        : (modeKey === "indirectX") ? `(${value},X)`
        : (modeKey === "indirectY") ? `(${value}),Y`
        : value;
      return { operand, text: operand, error: "" };
    }
    return { operand: value, text: value, error: getNumberFormatError(base) };
  }

  const rangeError = validateRange(modeKey, numericValue);
  const formatted = formatOperand(modeKey, numericValue, base);

  return {
    operand: formatted,
    text: formatted,
    error: rangeError
  };
}

function formatTextMacroPreview(value) {
  const text = value || "HELLO C64";
  return {
    preview: `"${text}"`,
    charCount: text.length
  };
}

function formatByteMacroPreview(value, base = "dec") {
  const raw = value || "169,0,141,32,208";
  const error = validateByteMacro(raw, base);
  const bytes = error ? [] : parseByteMacro(raw, base);
  return {
    preview: bytes.length ? bytes.map((byte) => `$${byte.toString(16).toUpperCase().padStart(2, "0")}`).join(", ") : raw,
    error
  };
}

function validateTextMacroPosition(x, y, text = "") {
  if (!Number.isInteger(x) || !Number.isInteger(y)) {
    return currentLanguage === "en" ? "TEXT macro X and Y must be whole numbers." : "A TEXT makro X es Y erteke csak egesz szam lehet.";
  }

  if (x < 0 || x > 39) {
    return currentLanguage === "en" ? "TEXT macro X must be between 0 and 39." : "A TEXT makro X erteke 0 es 39 kozott lehet.";
  }

  if (y < 0 || y > 24) {
    return currentLanguage === "en" ? "TEXT macro Y must be between 0 and 24." : "A TEXT makro Y erteke 0 es 24 kozott lehet.";
  }

  if ((x + Math.max(0, (text || "").length - 1)) > 39) {
    return currentLanguage === "en" ? "TEXT macro would run past the right edge of the row." : "A TEXT makro szovege kifutna a sor jobb szelere.";
  }

  return "";
}

function convertByteArray(bytes, targetBase) {
  return bytes
    .filter((b) => Number.isFinite(b) && b >= 0 && b <= 255)
    .map((b) => {
      if (targetBase === "hex") return b.toString(16).toUpperCase().padStart(2, "0");
      if (targetBase === "bin") return b.toString(2).padStart(8, "0");
      return b.toString(10);
    })
    .join(",");
}

function parseByteMacro(raw, base = "dec") {
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      if (/^%[01]+$/.test(part)) {
        return Number.parseInt(part.slice(1), 2);
      }
      if (/^\$[0-9A-Fa-f]+$/.test(part)) {
        return Number.parseInt(part.slice(1), 16);
      }
      if (/^0x[0-9A-Fa-f]+$/i.test(part)) {
        return Number.parseInt(part.slice(2), 16);
      }
      return Number.parseInt(part, base === "bin" ? 2 : (base === "hex" ? 16 : 10));
    });
}

function validateByteMacro(raw, base = "dec") {
  const trimmed = raw.trim();
  if (!trimmed) {
    return currentLanguage === "en" ? "BYTE macro needs at least one byte." : "A BYTE makrohoz legalabb egy byte kell.";
  }

  const parts = trimmed.split(",").map((part) => part.trim()).filter(Boolean);
  if (!parts.length) {
    return currentLanguage === "en" ? "BYTE macro needs at least one byte." : "A BYTE makrohoz legalabb egy byte kell.";
  }

  for (const part of parts) {
    const validBinary = /^%[01]+$/.test(part);
    const validHexPrefixed = /^\$[0-9A-Fa-f]+$/.test(part) || /^0x[0-9A-Fa-f]+$/i.test(part);
    const validBare = base === "bin" ? /^[01]+$/.test(part) : (base === "hex" ? /^[0-9A-Fa-f]+$/.test(part) : /^\d+$/.test(part));
    if (!validBinary && !validHexPrefixed && !validBare) {
      return base === "bin"
        ? (currentLanguage === "en" ? "In binary mode use only 0 and 1 separated by commas, optionally with % prefix." : "Binaris modban csak 0-kat es 1-eseket hasznalj, opcionis % elotaggal.")
        : base === "hex"
          ? (currentLanguage === "en" ? "BYTE macro only accepts hex bytes separated by commas, for example FF,00,8D." : "A BYTE makroban csak hex byte-ok lehetnek, peldaul FF,00,8D.")
          : (currentLanguage === "en" ? "BYTE macro only accepts decimal or hex bytes separated by commas." : "A BYTE makroban csak decimalis vagy hex byte-ok lehetnek, vesszovel elvalasztva.");
    }

    const value = validBinary
      ? Number.parseInt(part.slice(1), 2)
      : validHexPrefixed
        ? Number.parseInt(part.replace(/^\$/, "").replace(/^0x/i, ""), 16)
        : Number.parseInt(part, base === "bin" ? 2 : (base === "hex" ? 16 : 10));

    if (value < 0 || value > 255) {
      return currentLanguage === "en" ? "Every BYTE macro element must be a byte between 0 and 255." : "A BYTE makro minden eleme 0 es 255 kozotti byte kell legyen.";
    }
  }

  return "";
}

function parseWordMacro(raw, base = "dec") {
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      if (/^\$[0-9A-Fa-f]+$/.test(part)) {
        return Number.parseInt(part.slice(1), 16);
      }
      if (/^0x[0-9A-Fa-f]+$/i.test(part)) {
        return Number.parseInt(part.slice(2), 16);
      }
      return Number.parseInt(part, base === "bin" ? 2 : (base === "hex" ? 16 : 10));
    });
}

function validateWordMacro(raw, base = "dec") {
  const trimmed = raw.trim();
  if (!trimmed) {
    return currentLanguage === "en" ? "WORD macro needs at least one 16-bit value." : "A WORD makrohoz legalabb egy 16-bites ertek kell.";
  }

  const parts = trimmed.split(",").map((part) => part.trim()).filter(Boolean);
  if (!parts.length) {
    return currentLanguage === "en" ? "WORD macro needs at least one 16-bit value." : "A WORD makrohoz legalabb egy 16-bites ertek kell.";
  }

  for (const part of parts) {
    const validHexPrefixed = /^\$[0-9A-Fa-f]+$/.test(part) || /^0x[0-9A-Fa-f]+$/i.test(part);
    const validBare = base === "hex" ? /^[0-9A-Fa-f]+$/.test(part) : /^\d+$/.test(part);
    if (!validHexPrefixed && !validBare) {
      return base === "hex"
        ? (currentLanguage === "en" ? "WORD macro only accepts hex values separated by commas." : "A WORD makroban csak hex ertekek lehetnek, vesszovel elvalasztva.")
        : (currentLanguage === "en" ? "WORD macro only accepts decimal or hex values separated by commas." : "A WORD makroban csak decimalis vagy hex ertekek lehetnek, vesszovel elvalasztva.");
    }

    const value = validHexPrefixed
      ? Number.parseInt(part.replace(/^\$/, "").replace(/^0x/i, ""), 16)
      : Number.parseInt(part, base === "hex" ? 16 : 10);

    if (value < 0 || value > 65535) {
      return currentLanguage === "en" ? "Every WORD macro element must be between 0 and 65535." : "A WORD makro minden eleme 0 es 65535 kozotti kell legyen.";
    }
  }

  return "";
}

function parseFillMacro(raw, base = "dec") {
  const parts = raw.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length !== 2) return null;

  const parseValue = (part) => {
    if (/^\$[0-9A-Fa-f]+$/.test(part)) {
      return Number.parseInt(part.slice(1), 16);
    }
    if (/^0x[0-9A-Fa-f]+$/i.test(part)) {
      return Number.parseInt(part.slice(2), 16);
    }
    return Number.parseInt(part, base === "bin" ? 2 : (base === "hex" ? 16 : 10));
  };

  return {
    count: parseValue(parts[0]),
    value: parseValue(parts[1])
  };
}

function validateFillMacro(raw, base = "dec") {
  const trimmed = raw.trim();
  if (!trimmed) {
    return currentLanguage === "en" ? "FILL macro needs count and value (e.g., FILL 256,$00)." : "A FILL makrohoz darabszam es ertek kell (pl. FILL 256,$00).";
  }

  const parts = trimmed.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length !== 2) {
    return currentLanguage === "en" ? "FILL macro needs exactly two parameters: count,value." : "A FILL makrohoz pontosan ket parameter kell: darabszam,ertek.";
  }

  const parsed = parseFillMacro(raw, base);
  if (!parsed) {
    return currentLanguage === "en" ? "FILL macro parameters are invalid." : "A FILL makro parameterei ervenytelenek.";
  }

  if (isNaN(parsed.count) || parsed.count < 1 || parsed.count > 65536) {
    return currentLanguage === "en" ? "FILL count must be between 1 and 65536." : "A FILL darabszam 1 es 65536 kozott kell legyen.";
  }

  if (isNaN(parsed.value) || parsed.value < 0 || parsed.value > 255) {
    return currentLanguage === "en" ? "FILL value must be a byte between 0 and 255." : "A FILL ertek 0 es 255 kozotti byte kell legyen.";
  }

  return "";
}

function validateAlignMacro(raw, base = "hex") {
  const trimmed = raw.trim();
  if (!trimmed) {
    return currentLanguage === "en" ? "ALIGN macro needs a boundary value (e.g., 64, 256, $2000)." : "Az ALIGN makrohoz hatar ertek kell (pl. 64, 256, $2000).";
  }

  const parsed = parseNumberByBase(trimmed.replace(/^\$/, ""), base);
  if (parsed === null || isNaN(parsed)) {
    return currentLanguage === "en" ? "ALIGN boundary must be a valid number." : "Az ALIGN hatar ervenyes szam kell legyen.";
  }

  if (parsed < 1 || parsed > 65536) {
    return currentLanguage === "en" ? "ALIGN boundary must be between 1 and 65536." : "Az ALIGN hatar 1 es 65536 kozott kell legyen.";
  }

  // Check if it's a power of 2 or common boundary
  const isPowerOf2 = (parsed & (parsed - 1)) === 0;
  if (!isPowerOf2 && parsed !== 64 && parsed !== 256 && parsed !== 0x2000) {
    // Warning but not error - allow any value
  }

  return "";
}

function validateTableMacro(labelName, address) {
  if (!labelName || !labelName.trim()) {
    return currentLanguage === "en" ? "TABLE macro needs a label name." : "A TABLE makrohoz cimke nev kell.";
  }

  const value = parseAddressValue(address);
  if (value === null) {
    return currentLanguage === "en" ? "TABLE macro needs a valid start address, for example $C000." : "A TABLE makrohoz ervenyes kezdocim kell, peldaul $C000.";
  }

  if (value < 0 || value > 0xFFFF) {
    return currentLanguage === "en" ? "TABLE macro address must be between 0 and 65535." : "A TABLE makro cime 0 es 65535 kozott lehet.";
  }

  return "";
}

function validateSpriteInitMacro(spriteNum, spriteColor, spriteDataPage) {
  const num = parseInt(spriteNum, 10);
  if (isNaN(num) || num < 0 || num > 7) {
    return currentLanguage === "en" ? "Sprite number must be 0–7." : "A sprite szama 0 es 7 kozott lehet.";
  }
  const color = parseInt(spriteColor, 10);
  if (isNaN(color) || color < 0 || color > 15) {
    return currentLanguage === "en" ? "Color must be 0–15." : "A szin erteke 0 es 15 kozott lehet.";
  }
  const pageStr = (spriteDataPage || "").replace(/^\$/, "");
  const page = parseInt(pageStr, 16);
  if (isNaN(page) || page < 0 || page > 255) {
    return currentLanguage === "en" ? "Data page must be a hex byte ($00–$FF), e.g. $21 for $0840." : "Az adatlap 1 hex byte legyen ($00-$FF), pl. $21 = $0840.";
  }
  return "";
}

function validateSpritePosMacro(spriteNum, spriteX, spriteY) {
  const num = parseInt(spriteNum, 10);
  if (isNaN(num) || num < 0 || num > 7) {
    return currentLanguage === "en" ? "Sprite number must be 0–7." : "A sprite szama 0 es 7 kozott lehet.";
  }
  const x = parseInt(spriteX, 10);
  if (isNaN(x) || x < 0 || x > 319) {
    return currentLanguage === "en" ? "X must be 0–319." : "Az X erteke 0 es 319 kozott lehet.";
  }
  const y = parseInt(spriteY, 10);
  if (isNaN(y) || y < 0 || y > 255) {
    return currentLanguage === "en" ? "Y must be 0–255." : "Az Y erteke 0 es 255 kozott lehet.";
  }
  return "";
}

function validateDefineMacro(symbols) {
  if (!symbols || !symbols.trim()) {
    return currentLanguage === "en" ? "DEFINE needs at least one symbol (e.g., DEBUG or DEBUG, PAL)." : "A DEFINE-hoz legalabb egy szimbolum kell (pl. DEBUG vagy DEBUG, PAL).";
  }
  const parts = symbols.split(",").map(s => s.trim()).filter(Boolean);
  const invalid = parts.find(p => !/^[A-Za-z_][A-Za-z0-9_]*$/.test(p));
  if (invalid) {
    return currentLanguage === "en" ? `"${invalid}" is not a valid identifier.` : `"${invalid}" nem ervenyes azonosito.`;
  }
  return "";
}

function validateConstMacro(name, value, base) {
  if (!name || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
    return currentLanguage === "en" ? "CONST name must be a valid identifier (e.g., SCORE_ADDR)." : "A CONST neve ervenyes azonosito kell legyen (pl. SCORE_ADDR).";
  }
  const numericValue = parseNumberByBase((value || "").replace(/^\$/, ""), base);
  if (numericValue === null || numericValue < 0 || numericValue > 65535) {
    return currentLanguage === "en" ? "CONST value must be a number between 0 and 65535." : "A CONST erteke 0 es 65535 kozott kell legyen.";
  }
  return "";
}

function validateIfMacro(condition) {
  if (!condition || !condition.trim()) {
    return currentLanguage === "en" ? "IF macro needs a condition (e.g., DEBUG)." : "Az IF makrohoz feltetel kell (pl. DEBUG).";
  }

  // Simple validation - just check it's a valid identifier
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(condition.trim())) {
    return currentLanguage === "en" ? "IF condition must be a valid identifier." : "Az IF feltetelnek ervenyes azonositonak kell lennie.";
  }

  return "";
}

function parseAddressValue(raw) {
  const trimmed = (raw || "").trim();
  if (!trimmed) {
    return null;
  }

  if (/^\$[0-9A-Fa-f]+$/.test(trimmed)) {
    return Number.parseInt(trimmed.slice(1), 16);
  }

  if (/^0x[0-9A-Fa-f]+$/i.test(trimmed)) {
    return Number.parseInt(trimmed.slice(2), 16);
  }

  // 1-4 hex digits (e.g. "C000", "0900", "FF") — always treat as hex address
  if (/^[0-9A-Fa-f]{1,4}$/.test(trimmed)) {
    return Number.parseInt(trimmed, 16);
  }

  // Pure decimal only if longer than 4 digits (e.g. "49152" = $C000)
  if (/^\d+$/.test(trimmed)) {
    return Number.parseInt(trimmed, 10);
  }

  return null;
}

function validateIncBinMacro(incBinBytes, rawAddress) {
  const value = parseAddressValue(rawAddress);
  if (value === null) {
    return currentLanguage === "en" ? "INCBIN macro needs a valid start address, for example $C000." : "Az INCBIN makrohoz ervenyes kezdocim kell, peldaul $C000.";
  }
  if (value < 0 || value > 0xFFFF) {
    return currentLanguage === "en" ? "INCBIN macro address must be between 0 and 65535." : "Az INCBIN makro cime 0 es 65535 kozott lehet.";
  }
  return "";
}

function validateStringMacroAddress(raw) {
  const value = parseAddressValue(raw);
  if (value === null) {
    return currentLanguage === "en" ? "STRING macro needs a valid start address, for example $C000." : "A STRING makrohoz ervenyes kezdocim kell, peldaul $C000.";
  }

  if (value < 0 || value > 0xFFFF) {
    return currentLanguage === "en" ? "STRING macro address must be between 0 and 65535." : "A STRING makro cime 0 es 65535 kozott lehet.";
  }

  return "";
}

function validateTextWithOffset(rawOperand, charOffset) {
  const offset = parseInt(charOffset || "0", 16);
  if (isNaN(offset) || offset < 0 || offset > 255) {
    return currentLanguage === "en" ? "+Byte offset must be a hex value between 00 and FF." : "A +Byte offset 00 es FF kozotti hex ertek lehet.";
  }
  if (offset === 0) return "";
  const chars = encodeTextMacro(rawOperand);
  const overflow = chars.find(c => (c + offset) > 255);
  if (overflow !== undefined) {
    return currentLanguage === "en"
      ? `+Byte offset $${offset.toString(16).toUpperCase().padStart(2,"0")} causes overflow (char code $${overflow.toString(16).toUpperCase().padStart(2,"0")} + offset > $FF).`
      : `A +Byte offset $${offset.toString(16).toUpperCase().padStart(2,"0")} tulcsordulast okoz (karakter kod $${overflow.toString(16).toUpperCase().padStart(2,"0")} + offset > $FF).`;
  }
  return "";
}

function validateDataMacro(rawBytes, rawAddress, base = "dec") {
  const byteError = validateByteMacro(rawBytes, base);
  if (byteError) return byteError;

  const value = parseAddressValue(rawAddress);
  if (value === null) {
    return currentLanguage === "en" ? "DATA macro needs a valid start address, for example $C000." : "A DATA makrohoz ervenyes kezdocim kell, peldaul $C000.";
  }

  if (value < 0 || value > 0xFFFF) {
    return currentLanguage === "en" ? "DATA macro address must be between 0 and 65535." : "A DATA makro cime 0 es 65535 kozott lehet.";
  }

  return "";
}

function encodeTextMacro(text, charset = "standard") {
  // Auto-detect: any letter triggers lowercase charset encoding.
  // "HELLO WORLD" → HELLO WORLD, "Hello World" → Hello World.
  // Pure numbers/symbols stay standard for backward compat.
  const hasLetters = /[A-Za-z]/.test(text || "");
  const effectiveCharset = charset === "lowercase" || (charset === "standard" && hasLetters) ? "lowercase" : "standard";
  const mapper = effectiveCharset === "lowercase" ? toLowercaseScreenCode : toPetsciiCharCode;
  return [...(text || "HELLO C64")].map((char) => mapper(char));
}

// Lowercase charset screen code mapping (C64 char ROM at $1800, $D018=$17):
//   'a'-'z' ($61-$7A) → screen codes 1-26  ($01-$1A)
//   'A'-'Z' ($41-$5A) → screen codes 65-90 ($41-$5A — same as PETSCII/ASCII)
//   Everything else falls through to standard mapping.
function toLowercaseScreenCode(char) {
  if (char === "\n") return 13;
  const code = char.charCodeAt(0);
  if (code >= 97 && code <= 122) return code - 96;         // a-z → 1-26
  if (code >= 65 && code <= 90)  return code;               // A-Z → 65-90 (PETSCII match)
  return toPetsciiCharCode(char);                           // fallback
}

// PETSCII makro: szoveg → PETSCII byte-ok (CHROUT-kompatibilis)
// Mindig uppercase: C64 alap charset-ben $61-$7A = grafikus karakterek
// Kisbetus megjeleniteshez $D018 bit 1=1 (lowercase mode) szukseges
function encodePetsciiMacro(text) {
  return [...(text || "HELLO")].map((char) => {
    if (char === "\n") return 13;
    const upper = char.toUpperCase();
    const code = upper.charCodeAt(0);
    // Only printable ASCII range maps to PETSCII in default charset
    if (code >= 32 && code <= 90) return code;
    if (code >= 97 && code <= 122) return code - 32; // lowercase→uppercase PETSCII
    return 32;
  });
}

function toPetsciiCharCode(char) {
  if (char === "\n") {
    return 13;
  }

  const upper = char.toUpperCase();
  const code = upper.charCodeAt(0);
  if (code >= 65 && code <= 90) {
    return code - 64;
  }
  if (code >= 32 && code <= 126) {
    return code;
  }

  return 32;
}

function validateRange(modeKey, value) {
  if (!Number.isInteger(value)) {
    return currentLanguage === "en" ? "Only whole numbers are supported." : "Csak egesz szam tamogatott.";
  }

  if (modeKey === "immediate" || modeKey === "zeroPage" || modeKey === "zeroPageX" || modeKey === "indirectX" || modeKey === "indirectY" || modeKey === "zeroPageY") {
    return value < 0 || value > 255 ? (currentLanguage === "en" ? "This mode expects a value between 0 and 255." : "Ez a mod 0 es 255 kozotti erteket var.") : "";
  }

  if (modeKey === "absolute" || modeKey === "absoluteX" || modeKey === "absoluteY" || modeKey === "indirect") {
    return value < 0 || value > 65535 ? (currentLanguage === "en" ? "Absolute addressing requires a value between 0 and 65535." : "Absolute cimzesnel 0 es 65535 kozotti ertek kell.") : "";
  }

  if (modeKey === "relative") {
    return value < -128 || value > 65535 ? (currentLanguage === "en" ? "Relative/label mode needs a label or a sensible address/offset." : "Relative/label modban label vagy esszeru cim/offset kell.") : "";
  }

  return "";
}

function formatOperand(modeKey, value, base) {
  const formatter = base === "bin" ? toBin : (base === "hex" ? toHex : toDec);

  if (modeKey === "immediate") {
    return `#${formatter(value, 2)}`;
  }

  if (modeKey === "indirectX") {
    return `(${formatter(value, 2)},X)`;
  }

  if (modeKey === "indirectY") {
    return `(${formatter(value, 2)}),Y`;
  }

  if (modeKey === "indirect") {
    return `(${formatter(value, 4)})`;
  }

  if (modeKey === "zeroPageX") {
    return `${formatter(value, 2)},X`;
  }

  if (modeKey === "zeroPageY") {
    return `${formatter(value, 2)},Y`;
  }

  if (modeKey === "absoluteX") {
    return `${formatter(value, 4)},X`;
  }

  if (modeKey === "absoluteY") {
    return `${formatter(value, 4)},Y`;
  }

  return formatter(value, modeKey === "absolute" ? 4 : 2);
}

function toHex(value, minDigits) {
  if (value < 0) {
    return `-${toHex(Math.abs(value), minDigits)}`;
  }

  return `$${value.toString(16).toUpperCase().padStart(minDigits, "0")}`;
}

function toDec(value) {
  return String(value);
}

function toBin(value, nibbles) {
  return `%${value.toString(2).padStart(nibbles * 4, "0")}`;
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem("c64-block-theme") || "light";
  document.documentElement.dataset.theme = savedTheme;
  updateThemeToggleLabel();
  // Wait for two animation frames so the browser completes a full layout+paint
  // cycle with the correct theme before the window becomes visible.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.__TAURI__?.window?.getCurrentWindow()?.show().catch(() => {});
    });
  });
}

function toggleTheme() {
  const next = { light: "dark", dark: "oled", oled: "light" };
  setTheme(next[document.documentElement.dataset.theme] || "dark");
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("c64-block-theme", theme);
  updateThemeToggleLabel();
  saveUiSettings();
}

function applySavedCrtMode() {
  if (localStorage.getItem("c64-crt-mode") === "1") {
    document.body.classList.add("crt-mode");
  }
}

function toggleCrtMode() {
  const on = document.body.classList.toggle("crt-mode");
  localStorage.setItem("c64-crt-mode", on ? "1" : "0");
}

function updateThemeToggleLabel() {
  const current = document.documentElement.dataset.theme || "light";
  document.querySelectorAll(".theme-option").forEach(btn => {
    if (btn.dataset.themeOpt === current) {
      btn.setAttribute("data-active", "");
    } else {
      btn.removeAttribute("data-active");
    }
  });
  themeToggleButton.setAttribute("aria-label", t("themeToggle"));
  themeToggleButton.setAttribute("title", t("themeToggle"));
}

async function loadViceConfig() {
  if (!window.electronAPI?.getViceConfig) {
    updateVicePathPreview("");
    updateEmulatorStatus();
    return;
  }

  const config = await window.electronAPI.getViceConfig();
  vicePath = config?.vicePath || "";
  updateVicePathPreview(vicePath);
  updateEmulatorStatus();
}

function updateVicePathPreview(nextPath) {
  vicePath = nextPath || "";
  if (vicePathInput) {
    // Shorten long paths for display
    let displayPath = vicePath;
    if (displayPath.length > 50) {
      const parts = displayPath.split('/');
      if (parts.length > 3) {
        displayPath = `.../${parts.slice(-2).join('/')}`;
      }
    }
    vicePathInput.value = displayPath;
    vicePathInput.title = vicePath; // Show full path on hover
    vicePathInput.placeholder = currentLanguage === "en" ? "VICE not configured" : "Nincs beallitva";
  }
}

async function chooseViceExecutable() {
  if (!window.electronAPI?.chooseViceExecutable) {
    if (emulatorStatus) {
      emulatorStatus.textContent = currentLanguage === "en"
        ? "VICE selection is only available in the Electron app."
        : "A VICE valasztasa csak az Electron appban erheto el.";
    }
    return;
  }

  const result = await window.electronAPI.chooseViceExecutable();
  if (result?.canceled) {
    return;
  }

  updateVicePathPreview(result?.vicePath || "");
  updateEmulatorStatus();
}

async function loadDebuggerConfig() {
  if (!window.electronAPI?.getDebuggerConfig) return;
  const config = await window.electronAPI.getDebuggerConfig();
  updateDebuggerPathPreview(config?.debuggerPath || "");
}

function updateDebuggerPathPreview(nextPath) {
  debuggerPath = nextPath || "";
  if (debuggerPathInput) {
    let displayPath = debuggerPath;
    if (displayPath.length > 50) {
      const parts = displayPath.replace(/\\/g, "/").split("/");
      if (parts.length > 3) displayPath = `.../${parts.slice(-2).join("/")}`;
    }
    debuggerPathInput.value = displayPath;
    debuggerPathInput.title = debuggerPath;
    debuggerPathInput.placeholder = t("debuggerNotConfiguredPlaceholder");
  }
  if (debuggerStatus) {
    debuggerStatus.textContent = debuggerPath
      ? tf("debuggerStatusReady", { path: debuggerPath })
      : t("debuggerStatusPending");
  }
}

async function chooseDebuggerExecutable() {
  if (!window.electronAPI?.chooseDebuggerExecutable) return;
  const result = await window.electronAPI.chooseDebuggerExecutable();
  if (result?.canceled) return;
  updateDebuggerPathPreview(result?.debuggerPath || "");
}

async function runInDebugger() {
  if (isProgramEmpty()) {
    showViceToast(currentLanguage === "en" ? "Nothing to run — add some instructions first." : "Nincs mit futtatni — adj hozzá utasításokat.", true);
    return;
  }
  if (!debuggerPath) {
    showViceToast(t("debuggerNotConfiguredMsg"), true);
    return;
  }

  if (!window.electronAPI?.launchDebugger) {
    showViceToast(t("debuggerLaunchNotAvailable"), true);
    return;
  }

  await showWorkProgress("workProgressDebug");
  let success = false;
  try {
    setWorkProgress(20);

    const prg = buildAutostartPrgForEmulator();
    if (!prg.ok) {
      if (prg.errors?.length) { showCompileErrorDialog(prg.errors); return; }
      if (emulatorStatus) emulatorStatus.textContent = prg.error;
      return;
    }

    setWorkProgress(50);

    const debugCodeOrigin = prg.sysAddress ?? (() => {
      const o = parseOriginValue();
      return (o.value === 0x0801) ? 0xC000 : o.value;
    })();
    const layout = getProgramLayout(debugCodeOrigin);

    const symbols = [];
    const breakpoints = [];

    layout.lines.forEach(line => {
      if (line.block.isLabel && line.block.labelName) {
        symbols.push({ name: line.block.labelName, address: line.address });
      }
      if (line.block.isLoopMacro && line.block.loopLabel) {
        symbols.push({ name: line.block.loopLabel, address: line.address + 2 });
      }
      if (line.block.isTableMacro && line.block.tableName) {
        symbols.push({ name: line.block.tableName, address: line.address });
      }
      if (line.block.isBreakpoint) {
        breakpoints.push(line.address);
      }
    });

    setWorkProgress(80);
    const result = await window.electronAPI.launchDebugger({
      bytes: Array.from(prg.bytes),
      fileName: `c64-visual-assembler-${Date.now()}.prg`,
      symbols,
      breakpoints,
      autoJmp: false,
      jmpAddress: debuggerJmp ? debugCodeOrigin : undefined,
      waitMs: debuggerWait ? debuggerWaitMs : 0,
      unpause: debuggerUnpause || undefined
    });

    if (!result?.ok) {
      showViceToast(result?.error || t("debuggerLaunchFailed"), true);
      return;
    }

    setWorkProgress(100);
    showViceToast(t("debuggerLaunched"));
    success = true;
  } finally {
    if (success) {
      await completeWorkProgress("workProgressSuccessDebug");
    } else {
      hideWorkProgress();
    }
  }
}

function updateEmulatorStatus() {
  if (!emulatorStatus) {
    return;
  }

  if (!window.electronAPI) {
    emulatorStatus.textContent = currentLanguage === "en"
      ? "VICE launching is available only inside the Electron desktop app."
      : "A VICE inditasa csak az Electron desktop appban erheto el.";
    return;
  }

  emulatorStatus.textContent = vicePath
    ? (currentLanguage === "en"
      ? `VICE is ready. Executable: ${vicePath}`
      : `A VICE keszen all. Exe: ${vicePath}`)
    : (currentLanguage === "en"
      ? "Choose the VICE executable first, then use Run in emulator."
      : "Eloszor valaszd ki a VICE executable fajlt, utana hasznald a Run in emulator gombot.");
}

function getProjectPayload() {
  // In expert mode, sync program[] from editor content before building payload
  if (expertMode) {
    const blocks = _expertBuildProgram();
    if (blocks && blocks.length > 0) program = blocks;
  }
  return {
    version: 1,
    app: "c64-visual-assembler",
    expertText: expertMode && expertEditor ? expertEditor.value : undefined,
    program: program.map(block => {
      if (!block.isIncludeMacro) return block;
      const { includedBlocks, ...rest } = block;
      return rest;
    }),
    ui: {
      sample: sampleSelect?.value || "basic-colors",
      outputMode: getSelectedOutputMode(),
      numberBase: getSelectedBase(),
      zoom: blockScale,
      language: currentLanguage,
      theme: document.documentElement.dataset.theme || "light"
    },
    d64: {
      diskName: d64ExportState.diskName,
      progName: d64ExportState.progName,
      extras: (d64ExportState.extras.length > 0
        ? d64ExportState.extras
        : (d64ExportState._pendingExtras || [])
      ).map(e => ({ name: e.name, sourcePath: e.sourcePath, loadAddress: e.loadAddress || "" }))
    }
  };
}

function updateWindowTitle(fileName) {
  const base = "C64 Visual Assembler";
  const title = fileName ? `${base} - ${fileName}` : base;
  window.electronAPI?.setWindowTitle?.(title);
}

function _setCurrentFile(displayText, titleFileName, filePath) {
  if (currentFileDisplay) currentFileDisplay.textContent = displayText;
  if (expertFileName) expertFileName.textContent = displayText;
  updateWindowTitle(titleFileName || "");
  // Sync active tab
  const tab = tabs?.find(t => t.id === activeTabId);
  if (tab) {
    tab.name = titleFileName || tab._untitledName || "Untitled";
    if (filePath !== undefined) tab.filePath = filePath;
    renderTabBar();
  }
}

// ── Tab management ──────────────────────────────────────────────────

function _tabCreate(name) {
  _tabCounter++;
  const untitledName = `Untitled ${_tabCounter}`;
  return {
    id: _tabCounter,
    name: name || untitledName,
    _untitledName: untitledName,
    filePath: null,
    dirty: false,
    program: [],
    userMacros: {},
    selectedBlockId: null,
    expertText: ""
  };
}

function markTabDirty() {
  const tab = tabs?.find(t => t.id === activeTabId);
  if (!tab || tab.dirty) return;
  tab.dirty = true;
  renderTabBar();
}

function markTabClean() {
  const tab = tabs?.find(t => t.id === activeTabId);
  if (!tab || !tab.dirty) return;
  tab.dirty = false;
  renderTabBar();
}

function _tabSaveCurrent() {
  const tab = tabs.find(t => t.id === activeTabId);
  if (!tab) return;
  if (expertMode && expertEditor) {
    tab.expertText = expertEditor.value;
  } else {
    tab.expertText = "";
  }
  tab.program = JSON.parse(JSON.stringify(program));
  tab.userMacros = JSON.parse(JSON.stringify(userMacros));
  tab.selectedBlockId = selectedBlockId;
}

function _tabActivate(tabId) {
  _tabSaveCurrent();
  activeTabId = tabId;
  const tab = tabs.find(t => t.id === tabId);
  if (!tab) return;

  program = JSON.parse(JSON.stringify(tab.program));
  userMacros = JSON.parse(JSON.stringify(tab.userMacros));
  selectedBlockId = tab.selectedBlockId;

  // Update file display
  if (tab.filePath) {
    const fileName = tab.filePath.split(/[/\\]/).pop();
    if (currentFileDisplay) currentFileDisplay.textContent = fileName;
    if (expertFileName) expertFileName.textContent = fileName;
    updateWindowTitle(fileName);
  } else if (tab.name && !tab.name.startsWith("Untitled")) {
    if (currentFileDisplay) currentFileDisplay.textContent = tab.name;
    if (expertFileName) expertFileName.textContent = tab.name;
    updateWindowTitle(tab.name);
  } else {
    if (currentFileDisplay) currentFileDisplay.textContent = "";
    if (expertFileName) expertFileName.textContent = "";
    updateWindowTitle("");
  }

  // Restore expert editor if active
  if (expertMode && expertEditor) {
    if (tab.expertText) {
      expertEditor.value = tab.expertText;
      expertEditor.dispatchEvent(new Event("input"));
    } else {
      _expertSyncFromProgram();
    }
  }

  renderTabBar();
  renderProgram();
  renderAsmOutput();
  if (_expertProjectVisible && _expertProjectData) _expertRenderProjectTree();
}

function _tabNew() {
  _tabSaveCurrent();
  const tab = _tabCreate();
  tab.program = [makeDefaultOrgBlock()];
  tabs.push(tab);
  activeTabId = tab.id;

  program = [makeDefaultOrgBlock()];
  userMacros = {};
  selectedBlockId = null;

  if (currentFileDisplay) currentFileDisplay.textContent = "";
  if (expertFileName) expertFileName.textContent = "";
  updateWindowTitle("");
  if (expertMode && expertEditor) _expertSyncFromProgram();

  renderTabBar();
  renderProgram();
  renderAsmOutput();
}

function _tabHasContent(tab) {
  const prog = (tab.id === activeTabId ? program : tab.program) || [];
  // More than just a default ORG block, or has a saved filePath
  return tab.filePath != null || prog.length > 1 || (prog.length === 1 && !prog[0].isOrgMacro);
}

let _confirmResolve = null;
const _confirmDialog = document.getElementById("app-confirm-dialog");
const _confirmMsg    = document.getElementById("app-confirm-msg");
const _confirmYes    = document.getElementById("app-confirm-yes");
const _confirmNo     = document.getElementById("app-confirm-no");

_confirmYes?.addEventListener("click", () => { _confirmDialog?.close(); _confirmResolve?.(true); });
_confirmNo?.addEventListener("click",  () => { _confirmDialog?.close(); _confirmResolve?.(false); });
_confirmDialog?.addEventListener("cancel", () => { _confirmResolve?.(false); });

function _showConfirm(msg) {
  return new Promise(resolve => {
    _confirmResolve = resolve;
    if (_confirmMsg) _confirmMsg.textContent = msg;
    _confirmDialog?.showModal();
  });
}

async function _tabClose(tabId) {
  const tab = tabs.find(t => t.id === tabId);
  if (tab && _tabHasContent(tab)) {
    const key = tab.filePath ? "tabCloseConfirmUnsaved" : "tabCloseConfirm";
    const msg = tf(key, { name: tab.name });
    if (!await _showConfirm(msg)) return;
  }

  if (tabs.length <= 1) {
    // Clear the only tab instead of removing it
    doClearProgram();
    const tab = tabs[0];
    tab.name = tab._untitledName;
    tab.filePath = null;
    tab.expertText = "";
    if (expertMode && expertEditor) {
      expertEditor.value = "";
      expertEditor.dispatchEvent(new Event("input"));
    }
    if (currentFileDisplay) currentFileDisplay.textContent = "";
    if (expertFileName) expertFileName.textContent = "";
    updateWindowTitle("");
    renderTabBar();
    return;
  }
  const idx = tabs.findIndex(t => t.id === tabId);
  tabs.splice(idx, 1);
  if (activeTabId === tabId) {
    const nextTab = tabs[Math.min(idx, tabs.length - 1)];
    // The closing tab is already spliced from tabs[], so _tabSaveCurrent inside
    // _tabActivate will find no tab for the old activeTabId and return early (correct).
    // Do NOT set activeTabId before _tabActivate — that would make _tabSaveCurrent
    // overwrite the next tab with the closing tab's stale content.
    _tabActivate(nextTab.id);
  } else {
    renderTabBar();
  }
}

function renderTabBar() {
  const tabBar = document.getElementById("tab-bar");
  if (!tabBar) return;
  tabBar.innerHTML = "";

  tabs.forEach(tab => {
    const div = document.createElement("div");
    div.className = "tab-item" + (tab.id === activeTabId ? " tab-item--active" : "");
    div.dataset.tabId = tab.id;

    const nameSpan = document.createElement("span");
    nameSpan.className = "tab-name";
    if (tab.dirty) {
      const dot = document.createElement("span");
      dot.className = "tab-dirty-dot";
      dot.setAttribute("aria-hidden", "true");
      nameSpan.appendChild(dot);
    }
    nameSpan.appendChild(document.createTextNode(tab.name));
    div.appendChild(nameSpan);

    const closeBtn = document.createElement("button");
    closeBtn.className = "tab-close";
    closeBtn.title = "Close tab";
    closeBtn.innerHTML = "&#x2715;";
    closeBtn.addEventListener("click", e => { e.stopPropagation(); _tabClose(tab.id); });
    div.appendChild(closeBtn);

    div.addEventListener("click", () => { if (tab.id !== activeTabId) _tabActivate(tab.id); });
    tabBar.appendChild(div);
  });

  const newBtn = document.createElement("button");
  newBtn.id = "tab-new-btn";
  newBtn.className = "tab-new-btn";
  newBtn.title = "New tab";
  newBtn.textContent = "+";
  newBtn.addEventListener("click", _tabNew);
  tabBar.appendChild(newBtn);

  // Scroll the active tab into view
  const activeEl = tabBar.querySelector(".tab-item--active");
  if (activeEl) activeEl.scrollIntoView({ block: "nearest", inline: "nearest" });

  _updateTabScrollButtons();
}

function _updateTabScrollButtons() {
  const tabBar = document.getElementById("tab-bar");
  const wrap   = tabBar?.closest(".tab-bar-wrap");
  if (!tabBar || !wrap) return;
  const canLeft  = tabBar.scrollLeft > 1;
  const canRight = tabBar.scrollLeft + tabBar.clientWidth < tabBar.scrollWidth - 1;
  wrap.classList.toggle("can-scroll-left",  canLeft);
  wrap.classList.toggle("can-scroll-right", canRight);
}

// Wire scroll buttons (called once at startup)
(function _initTabScrollButtons() {
  const tabBar     = document.getElementById("tab-bar");
  const btnLeft    = document.getElementById("tab-scroll-left");
  const btnRight   = document.getElementById("tab-scroll-right");
  if (!tabBar || !btnLeft || !btnRight) return;

  let _scrollInterval = null;
  function startScroll(dir) {
    clearInterval(_scrollInterval);
    _scrollInterval = setInterval(() => {
      tabBar.scrollBy({ left: dir * 80, behavior: "smooth" });
      _updateTabScrollButtons();
    }, 120);
  }
  function stopScroll() { clearInterval(_scrollInterval); _scrollInterval = null; }

  btnLeft.addEventListener("mousedown",  () => startScroll(-1));
  btnRight.addEventListener("mousedown", () => startScroll(1));
  ["mouseup", "mouseleave"].forEach(ev => {
    btnLeft.addEventListener(ev,  stopScroll);
    btnRight.addEventListener(ev, stopScroll);
  });
  // Single click also nudges
  btnLeft.addEventListener("click",  () => { tabBar.scrollBy({ left: -120, behavior: "smooth" }); setTimeout(_updateTabScrollButtons, 150); });
  btnRight.addEventListener("click", () => { tabBar.scrollBy({ left:  120, behavior: "smooth" }); setTimeout(_updateTabScrollButtons, 150); });

  tabBar.addEventListener("scroll", _updateTabScrollButtons, { passive: true });
  new ResizeObserver(_updateTabScrollButtons).observe(tabBar);
}());

async function saveProjectToFile() {
  if (!window.electronAPI?.saveProject) {
    if (emulatorStatus) {
      emulatorStatus.textContent = t("projectSaveFailed");
    }
    return;
  }

  const tab = tabs?.find(t => t.id === activeTabId);
  const existingPath = tab?.filePath || "";
  const defaultName  = (tab?.name || "program").replace(/\.(json|c64va)$/i, "") + ".json";

  const payload = {
    ...getProjectPayload(),
    _filePath:    existingPath,
    _defaultName: defaultName
  };
  const result = await window.electronAPI.saveProject(payload);
  if (result?.canceled) {
    return;
  }

  if (!result?.ok) {
    if (emulatorStatus) {
      emulatorStatus.textContent = result?.error || t("projectSaveFailed");
    }
    return;
  }

  if (emulatorStatus) {
    emulatorStatus.textContent = `${t("projectSaved")}: ${result.filePath}`;
  }

  // Update current file display
  if (result.filePath) {
    const fileName = result.filePath.split(/[\\/]/).pop();
    _setCurrentFile(fileName, fileName, result.filePath);
  }
  markTabClean();
}

let _lastCompileErrors = [];

function showCompileErrorDialog(errors) {
  if (!compileErrorDialog || !compileErrorList) return;
  if (compileErrorTitle) compileErrorTitle.textContent = t("compileErrorTitle");
  _lastCompileErrors = errors;
  compileErrorList.innerHTML = errors.map((err, idx) => {
    const lineTagMatch = err.match(/^\[L(\d+)\]/);
    const asmLine = lineTagMatch ? parseInt(lineTagMatch[1], 10) : null;
    return `<li data-index="${idx}" data-asm-line="${asmLine ?? ""}">${err.replace(/</g, "&lt;")}</li>`;
  }).join("");

  compileErrorList.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", () => {
      const asmLine = parseInt(li.dataset.asmLine, 10);
      compileErrorDialog.close();
      if (!isNaN(asmLine)) {
        scrollAsmOutputToLine(asmLine);
      }
    });
  });

  compileErrorDialog.showModal();
}

async function showWorkProgress(messageKey) {
  if (!workProgressDialog) return;
  if (workProgressTimer) {
    clearInterval(workProgressTimer);
    workProgressTimer = null;
  }

  workProgressValue = 10;
  if (workProgressTitle) workProgressTitle.textContent = t("workProgressTitle");
  if (workProgressSubtitle) workProgressSubtitle.textContent = t(messageKey);
  if (workProgressBar) workProgressBar.style.width = `${workProgressValue}%`;
  if (!workProgressDialog.open) workProgressDialog.showModal();

  await new Promise(resolve => window.requestAnimationFrame(() => resolve()));

  workProgressTimer = window.setInterval(() => {
    workProgressValue = Math.min(92, workProgressValue + 3);
    if (workProgressBar) workProgressBar.style.width = `${workProgressValue}%`;
  }, 120);
}

function setWorkProgress(value) {
  workProgressValue = Math.max(0, Math.min(100, value));
  if (workProgressBar) workProgressBar.style.width = `${workProgressValue}%`;
}

function hideWorkProgress() {
  if (!workProgressDialog) return;
  if (workProgressTimer) {
    clearInterval(workProgressTimer);
    workProgressTimer = null;
  }
  setWorkProgress(100);
  if (workProgressDialog.open) {
    workProgressDialog.close();
  }
}

async function completeWorkProgress(successMessageKey, delayMs = 1200) {
  if (!workProgressDialog) return;
  if (workProgressTimer) {
    clearInterval(workProgressTimer);
    workProgressTimer = null;
  }
  if (workProgressTitle) workProgressTitle.textContent = t("workProgressDoneTitle");
  if (workProgressSubtitle) workProgressSubtitle.textContent = t(successMessageKey);
  setWorkProgress(100);
  await new Promise(resolve => setTimeout(resolve, delayMs));
  if (workProgressDialog.open) {
    workProgressDialog.close();
  }
}

async function savePrgToFile() {
  const prg = buildAutostartPrgForEmulator();
  if (!prg.ok) {
    if (prg.errors?.length) { showCompileErrorDialog(prg.errors); return; }
    if (emulatorStatus) emulatorStatus.textContent = prg.error;
    return;
  }

  const result = await window.electronAPI.savePrg({ bytes: Array.from(prg.bytes) });
  if (result?.canceled) return;

  if (!result?.ok) {
    if (emulatorStatus) emulatorStatus.textContent = result?.error || t("savePrgFailed");
    return;
  }

  if (emulatorStatus) {
    const fileName = result.filePath.split(/[\\/]/).pop();
    emulatorStatus.textContent = `${t("savePrgSuccess")}: ${fileName}`;
  }
}

async function saveD64ToFile() {
  if (!window.electronAPI?.saveD64) {
    if (emulatorStatus) emulatorStatus.textContent = t("saveD64Failed");
    return;
  }

  // Compile first so we surface errors early (before opening the dialog).
  const prg = buildAutostartPrgForEmulator();
  if (!prg.ok) {
    if (prg.errors?.length) { showCompileErrorDialog(prg.errors); return; }
    if (emulatorStatus) emulatorStatus.textContent = prg.error;
    return;
  }

  openD64ExportDialog(prg.bytes);
}

// ── D64 Export Dialog ─────────────────────────────────────────────────
// Lets the user pick a disk name + program name for the assembled PRG and
// add additional raw binary files (e.g. data files for LOADFILE) that get
// written to the same D64 image.
const d64ExportState = {
  prgBytes: null,
  extras: [],  // [{ name: string, sourcePath: string, bytes: number[], loadAddress: string }]
  runMode: false,
  diskName: "",
  progName: "",
  _pendingExtras: null,      // extras metadata from project JSON, loaded lazily on dialog open
  _pendingExtrasBaseDir: ""  // base directory of the project file, for resolving relative paths
};

function defaultDiskName() {
  if (sampleSelect && sampleSelect.value) {
    return sampleSelect.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 16) || "DISK";
  }
  return "DISK";
}

function d64SaveSettings(diskName, progName) {
  d64ExportState.diskName = diskName;
  d64ExportState.progName = progName;
  const meta = d64ExportState.extras.map(e => ({ name: e.name, sourcePath: e.sourcePath, loadAddress: e.loadAddress }));
  try { localStorage.setItem("d64LastSettings", JSON.stringify({ diskName, progName, extras: meta })); } catch (_) {}
}

async function d64LoadSavedExtras(savedExtras, baseDir = "") {
  if (!window.electronAPI?.readBinFile) return [];
  const restored = [];
  for (const meta of savedExtras) {
    if (!meta.sourcePath) continue;
    const isAbsolute = /^([A-Za-z]:[\\/]|\/)/.test(meta.sourcePath);
    const resolvedPath = (baseDir && !isAbsolute) ? baseDir + "/" + meta.sourcePath : meta.sourcePath;
    try {
      const r = await window.electronAPI.readBinFile(resolvedPath);
      if (r?.ok && r.bytes) restored.push({ name: meta.name, sourcePath: resolvedPath, loadAddress: meta.loadAddress || "", bytes: r.bytes });
    } catch (_) {}
  }
  return restored;
}

async function openD64ExportDialog(prgBytes) {
  const dialog = document.getElementById("d64-export-dialog");
  if (!dialog) return;
  d64ExportState.prgBytes = prgBytes;

  const diskInput = document.getElementById("d64-export-diskname");
  const progInput = document.getElementById("d64-export-progname");
  const errorBox = document.getElementById("d64-export-error");

  let diskName = d64ExportState.diskName || defaultDiskName();
  let progName = d64ExportState.progName || defaultDiskName();
  if (d64ExportState.extras.length === 0) {
    if (d64ExportState._pendingExtras?.length) {
      d64ExportState.extras = await d64LoadSavedExtras(d64ExportState._pendingExtras, d64ExportState._pendingExtrasBaseDir);
      d64ExportState._pendingExtras = null;
      d64ExportState._pendingExtrasBaseDir = "";
    } else {
      try {
        const saved = JSON.parse(localStorage.getItem("d64LastSettings") || "null");
        if (saved) {
          if (!d64ExportState.diskName && saved.diskName) diskName = saved.diskName;
          if (!d64ExportState.progName && saved.progName) progName = saved.progName;
          if (saved.extras?.length) d64ExportState.extras = await d64LoadSavedExtras(saved.extras);
        }
      } catch (_) {}
    }
  }

  if (diskInput) diskInput.value = diskName;
  if (progInput) progInput.value = progName;
  if (errorBox) { errorBox.hidden = true; errorBox.textContent = ""; }

  renderD64ExtraFiles();
  dialog.showModal();
}

function renderD64ExtraFiles() {
  const list = document.getElementById("d64-export-extras-list");
  if (!list) return;
  list.innerHTML = "";

  d64ExportState.extras.forEach((entry, idx) => {
    const item = document.createElement("div");
    item.className = "d64-export-extra-item";
    item.innerHTML = `
      <div class="d64-export-extra-top">
        <input type="text" maxlength="16" class="d64-extra-name" value="${escapeHtmlAttribute(entry.name)}" placeholder="${t("d64ExtraNamePlaceholder")}">
        <input type="text" maxlength="5" class="d64-extra-addr" value="${escapeHtmlAttribute(entry.loadAddress || "")}" placeholder="${t("d64ExtraAddrPlaceholder")}">
        <button type="button" class="d64-export-extra-remove" title="${t("d64ExtraRemove")}">×</button>
      </div>
      <input type="text" class="d64-extra-source" value="${escapeHtmlAttribute(entry.sourcePath || "")}" readonly tabindex="-1">
    `;
    list.appendChild(item);

    item.querySelector(".d64-extra-name").addEventListener("input", (event) => {
      const cleaned = event.target.value.toUpperCase().replace(/[^\x20-\x7E]/g, "").replace(/[",\/\\:\*\?<>\|]/g, "").slice(0, 16);
      d64ExportState.extras[idx].name = cleaned;
      event.target.value = cleaned;
    });

    item.querySelector(".d64-extra-addr").addEventListener("input", (event) => {
      const cleaned = event.target.value.replace(/^\$/, "").replace(/[^0-9A-Fa-f]/g, "").slice(0, 4);
      d64ExportState.extras[idx].loadAddress = cleaned;
      event.target.value = cleaned;
    });

    item.querySelector(".d64-export-extra-remove").addEventListener("click", () => {
      d64ExportState.extras.splice(idx, 1);
      renderD64ExtraFiles();
    });
  });
}

async function pickD64ExtraFile() {
  if (!window.electronAPI?.chooseIncBinFile) return;
  const result = await window.electronAPI.chooseIncBinFile();
  if (result?.canceled || !result?.bytes) return;

  // Default name = uppercase basename without extension, max 16 chars.
  const baseName = (result.fileName || "").replace(/\.[^.]+$/, "").toUpperCase().replace(/[^\x20-\x7E]/g, "").replace(/[",\/\\:\*\?<>\|]/g, "").slice(0, 16) || "DATA";

  d64ExportState.extras.push({
    name: baseName,
    sourcePath: result.filePath || result.fileName || "",
    bytes: result.bytes,
    loadAddress: ""  // empty = save raw, no load addr prepended
  });
  renderD64ExtraFiles();
}

async function confirmD64Export() {
  const dialog = document.getElementById("d64-export-dialog");
  const diskInput = document.getElementById("d64-export-diskname");
  const progInput = document.getElementById("d64-export-progname");
  const errorBox = document.getElementById("d64-export-error");
  if (!dialog || !d64ExportState.prgBytes) return;

  const diskName = ((diskInput?.value || "").trim() || "DISK").toLowerCase();
  const progName = ((progInput?.value || "").trim() || "PROGRAM").toLowerCase();

  // First file = the assembled PRG. Its bytes already contain the load
  // address prefix (from buildAutostartPrgForEmulator), so loadAddress = null.
  const files = [{
    name: progName,
    bytes: Array.from(d64ExportState.prgBytes),
    loadAddress: null
  }];

  for (const extra of d64ExportState.extras) {
    if (!extra.name) {
      if (errorBox) { errorBox.hidden = false; errorBox.textContent = t("d64ErrorEmptyName"); }
      return;
    }
    let loadAddr = null;
    if (extra.loadAddress && extra.loadAddress.trim()) {
      const parsed = parseInt(extra.loadAddress.trim(), 16);
      if (isNaN(parsed) || parsed < 0 || parsed > 0xFFFF) {
        if (errorBox) { errorBox.hidden = false; errorBox.textContent = tf("d64ErrorBadAddr", { name: extra.name }); }
        return;
      }
      loadAddr = parsed;
    }
    files.push({
      name: extra.name.toLowerCase(),
      bytes: Array.from(extra.bytes),
      loadAddress: loadAddr
    });
  }

  // Disable buttons during the async backend call
  const confirmBtn = document.getElementById("d64-export-confirm");
  const cancelBtn = document.getElementById("d64-export-cancel");
  if (confirmBtn) confirmBtn.disabled = true;
  if (cancelBtn) cancelBtn.disabled = true;

  const isRunMode = d64ExportState.runMode;
  const isUltimateMode = isRunMode === "ultimate";
  if (isRunMode) await showWorkProgress(isUltimateMode ? "workProgressRunD64Ultimate" : "workProgressRunD64");

  let result;
  try {
    if (isUltimateMode) {
      const host = (document.getElementById("ultimate-host")?.value || ultimateHost).trim();
      const password = (document.getElementById("ultimate-password")?.value || ultimatePassword).trim() || null;
      if (!host) {
        hideWorkProgress();
        if (errorBox) { errorBox.hidden = false; errorBox.textContent = t("ultimateNotConfigured"); }
        if (confirmBtn) { confirmBtn.disabled = false; confirmBtn.textContent = t("runOnUltimate"); }
        if (cancelBtn) cancelBtn.disabled = false;
        return;
      }
      result = await window.electronAPI.runD64OnUltimate({ host, password, diskName, files });
    } else if (isRunMode) {
      result = await window.electronAPI.runD64({ diskName, files });
    } else {
      result = await window.electronAPI.saveD64({ diskName, files });
    }
  } finally {
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.textContent = t(isUltimateMode ? "runOnUltimate" : isRunMode ? "runViaD64Confirm" : "d64ExportConfirm");
    }
    if (cancelBtn) cancelBtn.disabled = false;
  }

  if (result?.canceled) {
    if (isRunMode) hideWorkProgress();
    return;
  }

  if (!result?.ok) {
    if (isRunMode) hideWorkProgress();
    const err = result?.error || "";
    let msg = err || t("saveD64Failed");
    if (!isUltimateMode && /c1541|VICE/i.test(err)) msg = t("saveD64NeedVice");
    if (errorBox) { errorBox.hidden = false; errorBox.textContent = msg; }
    return;
  }

  d64SaveSettings((diskInput?.value || "").trim() || "DISK", (progInput?.value || "").trim() || "PROGRAM");
  dialog.close();
  if (isRunMode) {
    await completeWorkProgress(isUltimateMode ? "workProgressSuccessD64Ultimate" : "workProgressSuccessRunD64");
  } else if (emulatorStatus) {
    const fileName = (result.filePath || "").split(/[\\/]/).pop();
    const count = result.fileCount || files.length;
    emulatorStatus.textContent = `${t("saveD64Success")}: ${fileName} (${count} ${t("d64FilesLabel")})`;
  }
}

// ── Run mode (PRG / D64) split button ─────────────────────────────────────────

let runMode = "prg";

function setupRunModeDropdown() {
  const arrow = document.getElementById("run-mode-arrow");
  const menu = document.getElementById("run-mode-menu");
  if (!arrow || !menu) return;

  function openMenu() {
    menu.hidden = false;
    menu.classList.add("menu-opening");
    menu.addEventListener("animationend", () => menu.classList.remove("menu-opening"), { once: true });
    arrow.setAttribute("aria-expanded", "true");
  }

  let runMenuClosing = false;
  function closeMenu() {
    if (runMenuClosing || menu.hidden) return;
    runMenuClosing = true;
    menu.classList.add("menu-closing");
    menu.addEventListener("animationend", () => {
      menu.classList.remove("menu-closing");
      menu.hidden = true;
      runMenuClosing = false;
    }, { once: true });
    arrow.setAttribute("aria-expanded", "false");
  }

  arrow.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!menu.hidden) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.addEventListener("click", () => {
    if (!menu.hidden) closeMenu();
  });

  document.getElementById("run-prg-mode")?.addEventListener("click", () => { setRunMode("prg"); closeMenu(); });
  document.getElementById("run-d64-mode")?.addEventListener("click", () => { setRunMode("d64"); closeMenu(); });
  document.getElementById("run-ultimate-mode")?.addEventListener("click", () => { setRunMode("ultimate"); closeMenu(); });
  document.getElementById("run-ultimate-d64-mode")?.addEventListener("click", () => { setRunMode("ultimate-d64"); closeMenu(); });

  const saved = localStorage.getItem("runMode");
  if (saved === "prg" || saved === "d64" || saved === "ultimate" || saved === "ultimate-d64") setRunMode(saved);
}

function setRunMode(mode) {
  runMode = mode;
  localStorage.setItem("runMode", mode);
  const prgBtn = document.getElementById("run-prg-mode");
  const d64Btn = document.getElementById("run-d64-mode");
  const ulBtn = document.getElementById("run-ultimate-mode");
  const ulD64Btn = document.getElementById("run-ultimate-d64-mode");
  if (prgBtn) prgBtn.classList.toggle("active", mode === "prg");
  if (d64Btn) d64Btn.classList.toggle("active", mode === "d64");
  if (ulBtn) ulBtn.classList.toggle("active", mode === "ultimate");
  if (ulD64Btn) ulD64Btn.classList.toggle("active", mode === "ultimate-d64");
  const label = document.querySelector("#run-emulator .run-label");
  if (label) label.textContent = mode === "d64" ? t("runViaD64") : mode === "ultimate" ? t("runOnUltimate") : mode === "ultimate-d64" ? t("runD64OnHardware") : t("runInEmulator");
}

async function runViaD64() {
  if (isProgramEmpty()) {
    showViceToast(currentLanguage === "en" ? "Nothing to run — add some instructions first." : "Nincs mit futtatni — adj hozzá utasításokat.", true);
    return;
  }
  if (!vicePath) {
    showViceToast(currentLanguage === "en" ? "VICE is not configured. Select it in the menu first." : "A VICE nincs beallitva. Valaszd ki a menuben.", true);
    return;
  }
  if (!window.electronAPI?.runD64) {
    showViceToast(currentLanguage === "en" ? "D64 run is not available." : "A D64 futtatás nem elerheto.", true);
    return;
  }

  const prg = buildAutostartPrgForEmulator();
  if (!prg.ok) {
    if (prg.errors?.length) { showCompileErrorDialog(prg.errors); return; }
    if (emulatorStatus) emulatorStatus.textContent = prg.error;
    return;
  }

  d64ExportState.prgBytes = prg.bytes;
  d64ExportState.runMode = true;

  const dialog = document.getElementById("d64-export-dialog");
  const diskInput = document.getElementById("d64-export-diskname");
  const progInput = document.getElementById("d64-export-progname");
  const errorBox = document.getElementById("d64-export-error");
  const confirmBtn = document.getElementById("d64-export-confirm");

  let diskName = d64ExportState.diskName || defaultDiskName();
  let progName = d64ExportState.progName || defaultDiskName();
  if (d64ExportState.extras.length === 0) {
    if (d64ExportState._pendingExtras?.length) {
      d64ExportState.extras = await d64LoadSavedExtras(d64ExportState._pendingExtras, d64ExportState._pendingExtrasBaseDir);
      d64ExportState._pendingExtras = null;
      d64ExportState._pendingExtrasBaseDir = "";
    } else {
      try {
        const saved = JSON.parse(localStorage.getItem("d64LastSettings") || "null");
        if (saved) {
          if (!d64ExportState.diskName && saved.diskName) diskName = saved.diskName;
          if (!d64ExportState.progName && saved.progName) progName = saved.progName;
          if (saved.extras?.length) d64ExportState.extras = await d64LoadSavedExtras(saved.extras);
        }
      } catch (_) {}
    }
  }

  if (diskInput) diskInput.value = diskName;
  if (progInput) progInput.value = progName;
  if (errorBox) { errorBox.hidden = true; errorBox.textContent = ""; }
  if (confirmBtn) confirmBtn.textContent = t("runViaD64Confirm");
  const titleEl = document.getElementById("d64-export-title");
  if (titleEl) titleEl.textContent = t("runD64Title");
  renderD64ExtraFiles();
  dialog?.showModal();
}

function setupD64ExportDialog() {
  const dialog = document.getElementById("d64-export-dialog");
  if (!dialog) return;
  document.getElementById("d64-export-add-file")?.addEventListener("click", pickD64ExtraFile);
  document.getElementById("d64-export-confirm")?.addEventListener("click", confirmD64Export);
  document.getElementById("d64-export-cancel")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    d64ExportState.prgBytes = null;
    d64ExportState.runMode = false;
    const confirmBtn = document.getElementById("d64-export-confirm");
    if (confirmBtn) confirmBtn.textContent = t("d64ExportConfirm");
    const titleEl = document.getElementById("d64-export-title");
    if (titleEl) titleEl.textContent = t("d64ExportTitle");
  });
}

// ── Hardware Settings Dialog ──────────────────────────────────────────────────

function setupHardwareSettingsDialog() {
  const dialog = document.getElementById("hardware-settings-dialog");
  if (!dialog) return;
  document.getElementById("hardware-settings-btn")?.addEventListener("click", () => dialog.showModal());
  document.getElementById("hardware-settings-close")?.addEventListener("click", () => dialog.close());
}

// ── C64 Ultimate (1541 Ultimate REST API) ─────────────────────────────────────

let ultimateHost = localStorage.getItem("ultimateHost") || "";
let ultimatePassword = localStorage.getItem("ultimatePassword") || "";

function setupUltimateSettings() {
  const hostInput = document.getElementById("ultimate-host");
  const passInput = document.getElementById("ultimate-password");
  const testBtn = document.getElementById("ultimate-connect-test");

  if (hostInput) {
    hostInput.value = ultimateHost;
    hostInput.addEventListener("change", () => {
      ultimateHost = hostInput.value.trim();
      localStorage.setItem("ultimateHost", ultimateHost);
    });
  }
  if (passInput) {
    passInput.value = ultimatePassword;
    passInput.addEventListener("change", () => {
      ultimatePassword = passInput.value.trim();
      localStorage.setItem("ultimatePassword", ultimatePassword);
    });
  }
  testBtn?.addEventListener("click", testUltimateConnection);
}

async function testUltimateConnection() {
  const host = (document.getElementById("ultimate-host")?.value || ultimateHost).trim();
  const password = (document.getElementById("ultimate-password")?.value || ultimatePassword).trim() || null;
  const statusEl = document.getElementById("ultimate-status");
  if (!host) {
    if (statusEl) statusEl.textContent = t("ultimateNotConfigured");
    return;
  }
  if (statusEl) statusEl.textContent = t("ultimateConnecting");
  const result = await window.electronAPI?.testUltimateConnection(host, password);
  if (result?.ok) {
    const info = result.info || {};
    const product = info.product || "";
    const firmware = info.firmware || info.version || "";
    const desc = [product, firmware].filter(Boolean).join(" ").trim() || t("ultimateConnected");
    if (statusEl) statusEl.textContent = `✓ ${desc}`;
  } else {
    if (statusEl) statusEl.textContent = `✗ ${result?.error || t("ultimateConnectFailed")}`;
  }
}

async function runOnUltimate() {
  if (isProgramEmpty()) {
    showViceToast(currentLanguage === "en" ? "Nothing to run — add some instructions first." : "Nincs mit futtatni — adj hozzá utasításokat.", true);
    return;
  }
  const host = (document.getElementById("ultimate-host")?.value || ultimateHost).trim();
  if (!host) {
    showViceToast(t("ultimateNotConfigured"), true);
    return;
  }
  const prg = buildAutostartPrgForEmulator();
  if (!prg.ok) {
    if (prg.errors?.length) { showCompileErrorDialog(prg.errors); return; }
    if (emulatorStatus) emulatorStatus.textContent = prg.error;
    return;
  }
  const password = (document.getElementById("ultimate-password")?.value || ultimatePassword).trim() || null;
  await showWorkProgress("workProgressRunUltimate");
  const result = await window.electronAPI?.runOnUltimate(host, password, Array.from(prg.bytes));
  if (result?.ok) {
    await completeWorkProgress("workProgressSuccessUltimate");
  } else {
    hideWorkProgress();
    showViceToast(result?.error || t("ultimateRunFailed"), true);
  }
}

async function runUltimateD64() {
  if (isProgramEmpty()) {
    showViceToast(currentLanguage === "en" ? "Nothing to run — add some instructions first." : "Nincs mit futtatni — adj hozzá utasításokat.", true);
    return;
  }
  const host = (document.getElementById("ultimate-host")?.value || ultimateHost).trim();
  if (!host) {
    showViceToast(t("ultimateNotConfigured"), true);
    return;
  }

  const prg = buildAutostartPrgForEmulator();
  if (!prg.ok) {
    if (prg.errors?.length) { showCompileErrorDialog(prg.errors); return; }
    if (emulatorStatus) emulatorStatus.textContent = prg.error;
    return;
  }

  d64ExportState.prgBytes = prg.bytes;
  d64ExportState.runMode = "ultimate";

  const dialog = document.getElementById("d64-export-dialog");
  const diskInput = document.getElementById("d64-export-diskname");
  const progInput = document.getElementById("d64-export-progname");
  const errorBox = document.getElementById("d64-export-error");
  const confirmBtn = document.getElementById("d64-export-confirm");

  let diskName = d64ExportState.diskName || defaultDiskName();
  let progName = d64ExportState.progName || defaultDiskName();
  if (d64ExportState.extras.length === 0) {
    if (d64ExportState._pendingExtras?.length) {
      d64ExportState.extras = await d64LoadSavedExtras(d64ExportState._pendingExtras, d64ExportState._pendingExtrasBaseDir);
      d64ExportState._pendingExtras = null;
      d64ExportState._pendingExtrasBaseDir = "";
    } else {
      try {
        const saved = JSON.parse(localStorage.getItem("d64LastSettings") || "null");
        if (saved) {
          if (!d64ExportState.diskName && saved.diskName) diskName = saved.diskName;
          if (!d64ExportState.progName && saved.progName) progName = saved.progName;
          if (saved.extras?.length) d64ExportState.extras = await d64LoadSavedExtras(saved.extras);
        }
      } catch (_) {}
    }
  }

  if (diskInput) diskInput.value = diskName;
  if (progInput) progInput.value = progName;
  if (errorBox) { errorBox.hidden = true; errorBox.textContent = ""; }
  if (confirmBtn) confirmBtn.textContent = t("runOnUltimate");
  const titleEl = document.getElementById("d64-export-title");
  if (titleEl) titleEl.textContent = t("runD64Title");
  renderD64ExtraFiles();
  dialog?.showModal();
}

async function reloadIncludeBlocks(projectFilePath = "") {
  if (!window.electronAPI?.reloadIncludeFile) return;
  const lastSlash = typeof projectFilePath === "string"
    ? Math.max(projectFilePath.lastIndexOf("/"), projectFilePath.lastIndexOf("\\"))
    : -1;
  const baseDir = lastSlash >= 0 ? projectFilePath.slice(0, lastSlash) : "";
  for (const block of program) {
    if (block.isIncludeMacro && block.includeFile) {
      const result = await window.electronAPI.reloadIncludeFile(block.includeFile, baseDir);
      if (!result.error) {
        block.includedBlocks = result.blocks || [];
        block.includeFileName = result.fileName;
        block.validationError = "";
      } else {
        // Keep last successfully loaded content visible if a transient reload fails.
        // This prevents include source from flashing in/out during async refreshes.
        if (!Array.isArray(block.includedBlocks)) {
          block.includedBlocks = [];
        }
        block.validationError = result.error;
      }
    }
  }
}

async function reloadIncBinBlocks(projectFilePath = "") {
  if (!window.electronAPI?.reloadIncBinFile) return;
  const lastSlash = typeof projectFilePath === "string"
    ? Math.max(projectFilePath.lastIndexOf("/"), projectFilePath.lastIndexOf("\\"))
    : -1;
  const baseDir = lastSlash >= 0 ? projectFilePath.slice(0, lastSlash) : "";

  for (const block of program) {
    if (!block.isIncBinMacro) continue;

    const hasIncBinFile = typeof block.incBinFile === "string" && block.incBinFile.trim() !== "";
    const incBinName = typeof block.incBinFileName === "string" ? block.incBinFileName.trim() : "";
    const sourcePath = hasIncBinFile ? block.incBinFile : incBinName;
    if (!sourcePath) continue;

    const result = await window.electronAPI.reloadIncBinFile(sourcePath, baseDir);
    if (!result?.error) {
      block.incBinBytes = result.bytes || [];
      block.incBinFileName = result.fileName || block.incBinFileName || "";
      block.incBinFile = result.filePath || sourcePath;
      block.validationError = validateIncBinMacro(block.incBinBytes, block.incBinAddress);
    } else {
      block.incBinBytes = [];
      block.validationError = result.error;
    }
  }
}

async function reloadSidBlocks(projectFilePath = "") {
  if (!window.electronAPI?.reloadSidFile) return;
  const lastSlash = typeof projectFilePath === "string"
    ? Math.max(projectFilePath.lastIndexOf("/"), projectFilePath.lastIndexOf("\\"))
    : -1;
  const baseDir = lastSlash >= 0 ? projectFilePath.slice(0, lastSlash) : "";

  for (const block of program) {
    if (!block.isSidMacro) continue;

    const hasSidFile = typeof block.sidFile === "string" && block.sidFile.trim() !== "";
    const sidName = typeof block.sidFileName === "string" ? block.sidFileName.trim() : "";
    const sourcePath = hasSidFile ? block.sidFile : sidName;
    if (!sourcePath) continue;

    const result = await window.electronAPI.reloadSidFile(sourcePath, baseDir);
    if (!result?.error) {
      block.sidFile = result.filePath || sourcePath;
      block.sidFileName = result.fileName || block.sidFileName || "";
      block.sidTitle = result.title || block.sidTitle || "";
      block.sidAuthor = result.author || block.sidAuthor || "";
      block.sidLoadAddress = result.loadAddress;
      block.sidInitAddress = result.initAddress;
      block.sidPlayAddress = result.playAddress;
      block.sidBytes = result.bytes || [];
      block.validationError = "";
    } else {
      block.sidBytes = [];
      block.validationError = result.error;
    }
  }
}

// ── ASM Import parser ─────────────────────────────────────────────

function _importMnemonicCategory(mnemonic) {
  for (const [cat, items] of Object.entries(mnemonicLibrary)) {
    if (items.some(item => item.mnemonic === mnemonic)) return cat;
  }
  return "Szerkezet";
}

function _importMnemonicDescription(mnemonic) {
  for (const items of Object.values(mnemonicLibrary)) {
    const found = items.find(item => item.mnemonic === mnemonic);
    if (found) return found.description || "";
  }
  return "";
}

function _importMakeComment(text) {
  return {
    id: crypto.randomUUID(),
    category: "Szerkezet", mnemonic: "COMMENT",
    operand: text, rawOperand: text, description: "",
    addressingMode: "implied", base: "comment",
    validationError: "", collapsed: true, isComment: true,
    commentText: text
  };
}

function _importMakeLabel(name) {
  return {
    id: crypto.randomUUID(),
    category: "Szerkezet", mnemonic: "LABEL",
    operand: name, rawOperand: name, description: "",
    addressingMode: "implied", base: "hex",
    validationError: "", collapsed: true, isLabel: true,
    labelName: name
  };
}

function _importMakeByte(rawByteStr) {
  const { base, normalized } = _importDetectListBase(rawByteStr.trim());
  const display = base === "hex"
    ? normalized.split(",").map(t => { const s = t.trim(); return s ? "$" + s : s; }).join(", ")
    : normalized;
  return {
    id: crypto.randomUUID(),
    category: "Makrok", mnemonic: "BYTE",
    operand: display, rawOperand: normalized, description: "",
    addressingMode: "implied", base,
    validationError: "", collapsed: true, isByteMacro: true
  };
}

// Detect a comma-separated value list base. Returns { base, normalized } where
// normalized is the cleaned string (without $/% prefixes) that matches `base`.
function _importDetectListBase(rawList) {
  const parts = rawList.split(",").map(p => p.trim()).filter(Boolean);
  if (!parts.length) return { base: "hex", normalized: rawList.trim() };
  const allBin = parts.every(p => /^%[01]+$/.test(p));
  const allHex = parts.every(p => /^\$[0-9A-Fa-f]+$/.test(p) || /^0x[0-9A-Fa-f]+$/i.test(p));
  const allDec = parts.every(p => /^\d+$/.test(p));
  const stripped = parts.map(p => p.replace(/^[\$%]/, "").replace(/^0x/i, ""));
  if (allBin) return { base: "bin", normalized: stripped.join(",") };
  if (allDec) return { base: "dec", normalized: stripped.join(",") };
  if (allHex) return { base: "hex", normalized: stripped.join(",").toUpperCase() };
  // Mixed → keep hex semantics, strip prefixes where present
  return { base: "hex", normalized: stripped.join(",").toUpperCase() };
}

function _importParseScalar(raw) {
  const v = raw.trim();
  if (/^%[01]+$/.test(v)) return { base: "bin", value: v.slice(1) };
  if (/^\$[0-9A-Fa-f]+$/.test(v)) return { base: "hex", value: v.slice(1).toUpperCase() };
  if (/^0x[0-9A-Fa-f]+$/i.test(v)) return { base: "hex", value: v.slice(2).toUpperCase() };
  if (/^\d+$/.test(v)) return { base: "dec", value: v };
  return { base: "hex", value: v.toUpperCase() };
}

function _importMakeWord(rawList) {
  const detected = _importDetectListBase(rawList);
  return {
    id: crypto.randomUUID(),
    category: "Makrok", mnemonic: "WORD",
    operand: detected.normalized, rawOperand: detected.normalized, description: "",
    addressingMode: "implied", base: detected.base === "bin" ? "hex" : detected.base,
    validationError: "", collapsed: true, isWordMacro: true
  };
}

function _importMakeFill(rawList) {
  // FILL accepts "count, value"
  const parts = rawList.split(",").map(p => p.trim()).filter(Boolean);
  let base = "dec";
  let normalized = rawList.trim();
  if (parts.length === 2) {
    const a = _importParseScalar(parts[0]);
    const b = _importParseScalar(parts[1]);
    // Pick the value's base for the macro (count usually fits any base).
    base = b.base;
    normalized = `${a.value},${b.value}`;
  }
  return {
    id: crypto.randomUUID(),
    category: "Makrok", mnemonic: "FILL",
    operand: normalized, rawOperand: normalized, description: "",
    addressingMode: "implied", base,
    validationError: "", collapsed: true, isFillMacro: true
  };
}

function _importMakeAlign(rawValue) {
  const scalar = _importParseScalar(rawValue);
  return {
    id: crypto.randomUUID(),
    category: "Makrok", mnemonic: "ALIGN",
    operand: scalar.value, rawOperand: scalar.value, description: "",
    addressingMode: "implied",
    // ALIGN must use "dec" or "hex" — bin is meaningless and triggers known bugs.
    base: scalar.base === "bin" ? "hex" : scalar.base,
    validationError: "", collapsed: true, isAlignMacro: true
  };
}

function _importMakeIncBin(fileName, addressHex) {
  return {
    id: crypto.randomUUID(),
    category: "Makrok", mnemonic: "INCBIN",
    operand: "", rawOperand: "", description: "",
    addressingMode: "implied", base: "hex",
    validationError: "", collapsed: true, isIncBinMacro: true,
    incBinFileName: fileName,
    incBinFile: fileName,
    incBinBytes: [],
    incBinAddress: addressHex ? "$" + addressHex : "$C000"
  };
}

function _importMakeConst(name, rawValue) {
  const scalar = _importParseScalar(rawValue);
  return {
    id: crypto.randomUUID(),
    category: "Makrok", mnemonic: "CONST",
    operand: scalar.value, rawOperand: scalar.value, description: "",
    addressingMode: "implied", base: scalar.base,
    validationError: "", collapsed: true, isConstMacro: true,
    constName: name,
    constValue: parseNumberByBase(scalar.value, scalar.base)
  };
}

function _importMakeRegion(name) {
  return {
    id: crypto.randomUUID(),
    category: "Makrok", mnemonic: "REGION",
    operand: name, rawOperand: name, description: "",
    addressingMode: "implied", base: "hex",
    validationError: "", collapsed: false, isRegionMacro: true,
    regionName: name, regionCollapsed: false
  };
}

function _importMakeEndRegion() {
  return {
    id: crypto.randomUUID(),
    category: "Makrok", mnemonic: "ENDREGION",
    operand: "", rawOperand: "", description: "",
    addressingMode: "implied", base: "hex",
    validationError: "", collapsed: true, isEndRegionMacro: true
  };
}

function _importMakeDefine(symbol) {
  return {
    id: crypto.randomUUID(),
    category: "Makrok", mnemonic: "DEFINE",
    operand: symbol, rawOperand: symbol, description: "",
    addressingMode: "implied", base: "hex",
    validationError: "", collapsed: true, isDefineMacro: true,
    defineSymbol: symbol
  };
}

function _importMakeIf(condition) {
  return {
    id: crypto.randomUUID(),
    category: "Makrok", mnemonic: "IF",
    operand: condition, rawOperand: condition, description: "",
    addressingMode: "implied", base: "hex",
    validationError: "", collapsed: true, isIfMacro: true,
    ifCondition: condition
  };
}

function _importMakeElse() {
  return {
    id: crypto.randomUUID(),
    category: "Makrok", mnemonic: "ELSE",
    operand: "", rawOperand: "", description: "",
    addressingMode: "implied", base: "hex",
    validationError: "", collapsed: true, isElseMacro: true
  };
}

function _importMakeEndIf() {
  return {
    id: crypto.randomUUID(),
    category: "Makrok", mnemonic: "ENDIF",
    operand: "", rawOperand: "", description: "",
    addressingMode: "implied", base: "hex",
    validationError: "", collapsed: true, isEndIfMacro: true
  };
}

function _importMakeMacroDefStart(name) {
  return {
    id: crypto.randomUUID(),
    category: "Makrok", mnemonic: "MACRO",
    operand: name, rawOperand: name, description: "",
    addressingMode: "implied", base: "hex",
    validationError: "", collapsed: true, isMacroDefStart: true,
    macroName: name
  };
}

function _importMakeMacroDefEnd() {
  return {
    id: crypto.randomUUID(),
    category: "Makrok", mnemonic: "ENDM",
    operand: "", rawOperand: "", description: "",
    addressingMode: "implied", base: "hex",
    validationError: "", collapsed: true, isMacroDefEnd: true
  };
}

function _importMakeInstruction(mnemonic, operandRaw, branchMnems) {
  const category = _importMnemonicCategory(mnemonic);
  const description = _importMnemonicDescription(mnemonic);

  let addressingMode = "implied";
  let rawOperand = "";
  let base = "hex";
  let displayOperand = "";

  if (operandRaw) {
    const op = operandRaw;

    if (op.startsWith("#")) {
      // Immediate
      addressingMode = "immediate";
      const val = op.slice(1);
      if (val.startsWith("%")) {
        // Strip % so rawOperand stays consistent with other bin-base blocks
        // (the rest of the codebase stores BIN values as bare bits).
        base = "bin"; rawOperand = val.slice(1); displayOperand = "#" + val;
      } else if (val.startsWith("$")) {
        base = "hex"; rawOperand = val.slice(1).toUpperCase(); displayOperand = "#$" + rawOperand;
      } else if (/^\d+$/.test(val)) {
        base = "dec"; rawOperand = val; displayOperand = "#" + val;
      } else {
        base = "hex"; rawOperand = val; displayOperand = "#" + val;
      }
    } else if (/^\(\$[0-9A-Fa-f]+,X\)$/i.test(op)) {
      // (zp,X)
      const m = op.match(/^\((\$[0-9A-Fa-f]+),X\)$/i);
      addressingMode = "indirectX"; base = "hex";
      rawOperand = m[1].slice(1).toUpperCase(); displayOperand = "($" + rawOperand + ",X)";
    } else if (/^\(\$[0-9A-Fa-f]+\),Y$/i.test(op)) {
      // (zp),Y
      const m = op.match(/^\((\$[0-9A-Fa-f]+)\),Y$/i);
      addressingMode = "indirectY"; base = "hex";
      rawOperand = m[1].slice(1).toUpperCase(); displayOperand = "($" + rawOperand + "),Y";
    } else if (/^\$[0-9A-Fa-f]+,X$/i.test(op)) {
      const m = op.match(/^(\$[0-9A-Fa-f]+),X$/i);
      rawOperand = m[1].slice(1).toUpperCase(); base = "hex";
      addressingMode = parseInt(rawOperand, 16) > 0xFF ? "absoluteX" : "zeroPageX";
      displayOperand = "$" + rawOperand + ",X";
    } else if (/^\$[0-9A-Fa-f]+,Y$/i.test(op)) {
      const m = op.match(/^(\$[0-9A-Fa-f]+),Y$/i);
      rawOperand = m[1].slice(1).toUpperCase(); base = "hex";
      addressingMode = parseInt(rawOperand, 16) > 0xFF ? "absoluteY" : "zeroPageY";
      displayOperand = "$" + rawOperand + ",Y";
    } else if (/^\$[0-9A-Fa-f]+$/i.test(op)) {
      rawOperand = op.slice(1).toUpperCase(); base = "hex";
      addressingMode = parseInt(rawOperand, 16) > 0xFF ? "absolute" : "zeroPage";
      displayOperand = "$" + rawOperand;
    } else if (/^\([A-Za-z_][A-Za-z0-9_]*,X\)$/i.test(op)) {
      // (label,X) indirectX with label
      const m = op.match(/^\(([A-Za-z_][A-Za-z0-9_]*),X\)$/i);
      rawOperand = m[1]; base = "hex"; addressingMode = "indirectX";
      displayOperand = "(" + rawOperand + ",X)";
    } else if (/^\([A-Za-z_][A-Za-z0-9_]*\),Y$/i.test(op)) {
      // (label),Y indirectY with label
      const m = op.match(/^\(([A-Za-z_][A-Za-z0-9_]*)\),Y$/i);
      rawOperand = m[1]; base = "hex"; addressingMode = "indirectY";
      displayOperand = "(" + rawOperand + "),Y";
    } else if (/^[A-Za-z_][A-Za-z0-9_]*(?:\s*[+-]\s*(?:\$[0-9A-Fa-f]+|\d+))?,X$/i.test(op)) {
      // label,X or label+offset,X → absoluteX
      rawOperand = op.slice(0, op.lastIndexOf(",")).trim();
      base = "hex"; addressingMode = "absoluteX";
      displayOperand = rawOperand + ",X";
    } else if (/^[A-Za-z_][A-Za-z0-9_]*(?:\s*[+-]\s*(?:\$[0-9A-Fa-f]+|\d+))?,Y$/i.test(op)) {
      // label,Y or label+offset,Y → absoluteY
      rawOperand = op.slice(0, op.lastIndexOf(",")).trim();
      base = "hex"; addressingMode = "absoluteY";
      displayOperand = rawOperand + ",Y";
    } else if (/^\.[A-Za-z][A-Za-z0-9_]*$/.test(op)) {
      // Local label reference: strip dot
      rawOperand = op.slice(1); base = "hex";
      addressingMode = branchMnems.has(mnemonic) ? "relative" : "absolute";
      displayOperand = rawOperand;
    } else if (op === "-" || op === "+") {
      rawOperand = op; base = "hex";
      addressingMode = branchMnems.has(mnemonic) ? "relative" : "absolute";
      displayOperand = op;
    } else if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(op)) {
      rawOperand = op; base = "hex";
      addressingMode = branchMnems.has(mnemonic) ? "relative" : "absolute";
      displayOperand = op;
    } else if (/^\d+$/.test(op)) {
      rawOperand = op; base = "dec";
      addressingMode = parseInt(op, 10) > 255 ? "absolute" : "zeroPage";
      displayOperand = op;
    } else {
      rawOperand = op; base = "hex";
      addressingMode = "absolute"; displayOperand = op;
    }
  }

  return {
    id: crypto.randomUUID(),
    category, mnemonic, description,
    operand: displayOperand, rawOperand, addressingMode, base,
    validationError: "", collapsed: true
  };
}

function parseAsmText(text) {
  const BRANCH_MNEMS = new Set(["BEQ","BNE","BCC","BCS","BMI","BPL","BVC","BVS","BRA"]);
  const blocks = [];

  for (let rawLine of text.split("\n")) {
    // Separate inline comment
    const scIdx = rawLine.indexOf(";");
    let commentText = "";
    let line = rawLine;
    if (scIdx >= 0) {
      commentText = rawLine.slice(scIdx + 1).trim();
      line = rawLine.slice(0, scIdx);
    }
    line = line.trim();

    if (!line) {
      // Detect app-specific structural markers in comment-only lines.
      // These re-create REGION/CONST/IF/DEFINE when re-importing this app's
      // own ASM output.
      //
      // Note: ; .MACRO / ; .ENDM markers are intentionally NOT recognized.
      // The export emits them around fixed-address INCLUDE subroutines as
      // documentation, but treating them as real macro defs on import would
      // wrap the labels inside a template (skipped by getProgramLayout),
      // breaking external JSR references.
      if (commentText) {
        const ct = commentText.trim();
        // region NAME
        let m = ct.match(/^region\s+(.+?)\s*$/i);
        if (m) { blocks.push(_importMakeRegion(m[1].trim())); continue; }
        // endregion [NAME]
        if (/^endregion(?:\s+.+)?$/i.test(ct)) { blocks.push(_importMakeEndRegion()); continue; }
        // .DEFINE SYM
        m = ct.match(/^\.DEFINE\s+([A-Za-z_][A-Za-z0-9_]*)\s*$/i);
        if (m) { blocks.push(_importMakeDefine(m[1])); continue; }
        // .CONST name = value
        m = ct.match(/^\.CONST\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?)\s*$/i);
        if (m) { blocks.push(_importMakeConst(m[1], m[2])); continue; }
        // .IF condition
        m = ct.match(/^\.IF\s+(.+?)\s*$/i);
        if (m) { blocks.push(_importMakeIf(m[1].trim())); continue; }
        if (/^\.ELSE\s*$/i.test(ct)) { blocks.push(_importMakeElse()); continue; }
        if (/^\.ENDIF\s*$/i.test(ct)) { blocks.push(_importMakeEndIf()); continue; }
        blocks.push(_importMakeComment(commentText));
      }
      continue;
    }

    // * = $XXXX  →  ORG
    const orgM = line.match(/^\*\s*=\s*\$([0-9A-Fa-f]{1,4})\s*$/);
    if (orgM) {
      const orgAddress = orgM[1].toUpperCase().padStart(4, "0");
      blocks.push({
        id: crypto.randomUUID(),
        category: "Makrok", mnemonic: "ORG",
        operand: "", rawOperand: "", description: "",
        addressingMode: "implied", base: "hex",
        validationError: "", collapsed: true,
        isOrgMacro: true, orgAddress
      });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // Label: .word value,...  →  LABEL + WORD
    const lblWordM = line.match(/^([A-Za-z_.][A-Za-z0-9_.]*):\s*\.word\s+(.+)$/i);
    if (lblWordM) {
      blocks.push(_importMakeLabel(lblWordM[1].replace(/^\./, "")));
      blocks.push(_importMakeWord(lblWordM[2].trim()));
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // Standalone .word val,... (also accepts ACME-style !word)
    const standaloneWordM = line.match(/^(?:\.word|!word)\s+(.+)$/i);
    if (standaloneWordM) {
      blocks.push(_importMakeWord(standaloneWordM[1].trim()));
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .fill count,value  (also !fill)
    const fillM = line.match(/^(?:\.fill|!fill)\s+(.+)$/i);
    if (fillM) {
      blocks.push(_importMakeFill(fillM[1].trim()));
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .align N  (also !align)
    const alignM = line.match(/^(?:\.align|!align)\s+(.+)$/i);
    if (alignM) {
      blocks.push(_importMakeAlign(alignM[1].trim()));
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .incbin "filename"  (also !bin / !binary)
    const incbinM = line.match(/^(?:\.incbin|!bin(?:ary)?)\s+"([^"]+)"\s*(?:,\s*\$([0-9A-Fa-f]{1,4}))?\s*$/i);
    if (incbinM) {
      const addr = incbinM[2] ? incbinM[2].toUpperCase().padStart(4, "0") : "";
      blocks.push(_importMakeIncBin(incbinM[1], addr));
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // CONST equate: name = $value  or  name .equ $value
    const equateM = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*(?:=|\.equ\b)\s*(\$[0-9A-Fa-f]+|0x[0-9A-Fa-f]+|%[01]+|\d+)\s*$/i);
    if (equateM) {
      blocks.push(_importMakeConst(equateM[1], equateM[2]));
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // Label: .byte value  →  LABEL + BYTE
    const lblByteM = line.match(/^([A-Za-z_.][A-Za-z0-9_.]*):\s*\.byte\s+(.+)$/i);
    if (lblByteM) {
      blocks.push(_importMakeLabel(lblByteM[1].replace(/^\./, "")));
      blocks.push(_importMakeByte(lblByteM[2].trim()));
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // Standalone .byte value,... (also ACME-style !byte)
    const standaloneByteM = line.match(/^(?:\.byte|!byte)\s+(.+)$/i);
    if (standaloneByteM) {
      blocks.push(_importMakeByte(standaloneByteM[1].trim()));
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // Label only: "Name:" or ".name"
    const lblOnlyM = line.match(/^([A-Za-z_.][A-Za-z0-9_.]*):\s*$/);
    if (lblOnlyM) {
      blocks.push(_importMakeLabel(lblOnlyM[1].replace(/^\./, "")));
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // Anonymous label: "-" or "+" on its own line (ACME-style)
    if (line.trim() === "-" || line.trim() === "+") {
      const anonChar = line.trim();
      blocks.push({
        id: crypto.randomUUID(),
        category: "Makrok",
        mnemonic: "LABEL",
        operand: anonChar,
        rawOperand: anonChar,
        labelName: anonChar,
        description: currentLanguage === "en" ? "Anonymous local label" : "Nevtelen helyi cimke",
        addressingMode: "implied",
        base: "hex",
        validationError: "",
        collapsed: true,
        isAnonymousLabel: true
      });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // Anonymous label with instruction on same line: "-   LDA $D012" or "+   RTS"
    const anonWithInstrM = line.match(/^([-+])\s+([A-Za-z]{2,4})\s*(.*)\s*$/);
    if (anonWithInstrM) {
      blocks.push({
        id: crypto.randomUUID(),
        category: "Makrok",
        mnemonic: "LABEL",
        operand: anonWithInstrM[1],
        rawOperand: anonWithInstrM[1],
        labelName: anonWithInstrM[1],
        description: currentLanguage === "en" ? "Anonymous local label" : "Nevtelen helyi cimke",
        addressingMode: "implied",
        base: "hex",
        validationError: "",
        collapsed: true,
        isAnonymousLabel: true
      });
      blocks.push(_importMakeInstruction(anonWithInstrM[2].toUpperCase(), anonWithInstrM[3].trim(), BRANCH_MNEMS));
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // Local label without colon: ".name"
    const localLblM = line.match(/^(\.[A-Za-z][A-Za-z0-9_]*)\s*$/);
    if (localLblM) {
      blocks.push(_importMakeLabel(localLblM[1].slice(1)));
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // Instruction: "mnemonic [operand]"
    const instrM = line.match(/^([A-Za-z]{2,4})\s*(.*)\s*$/);
    if (instrM) {
      const mn = instrM[1].toUpperCase();
      const opRaw = instrM[2].trim();
      blocks.push(_importMakeInstruction(mn, opRaw, BRANCH_MNEMS));
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // Fallback: treat as comment
    const full = line + (commentText ? " ; " + commentText : "");
    blocks.push(_importMakeComment(full));
  }

  return blocks;
}

// ── End ASM Import parser ─────────────────────────────────────────

async function loadProjectFromFile() {
  if (!window.electronAPI?.loadProject) {
    if (emulatorStatus) {
      emulatorStatus.textContent = t("projectLoadFailed");
    }
    return;
  }

  const result = await window.electronAPI.loadProject();
  if (result?.canceled) {
    return;
  }

  if (!result?.ok) {
    if (emulatorStatus) {
      emulatorStatus.textContent = result?.error || t("projectLoadFailed");
    }
    return;
  }

  const projectData = result?.project;
  if (!projectData || projectData.app !== "c64-visual-assembler" || !Array.isArray(projectData.program)) {
    if (emulatorStatus) {
      emulatorStatus.textContent = t("projectInvalid");
    }
    return;
  }

  program = projectData.program.map((block) => ({
    ...block,
    id: block.id || crypto.randomUUID()
  }));

  // Backward compatibility for old INCLUDE projects:
  // some files store only includeFileName (includeFile is empty).
  for (const block of program) {
    if (!block?.isIncludeMacro) continue;
    const hasIncludeFile = typeof block.includeFile === "string" && block.includeFile.trim() !== "";
    if (hasIncludeFile) continue;
    const name = typeof block.includeFileName === "string" ? block.includeFileName.trim() : "";
    if (!name) continue;
    block.includeFile = /\.json$/i.test(name) ? name : `${name}.json`;
  }

  // Backward compatibility for old INCBIN projects:
  // some files store only incBinFileName (incBinFile is empty).
  for (const block of program) {
    if (!block?.isIncBinMacro) continue;
    const hasIncBinFile = typeof block.incBinFile === "string" && block.incBinFile.trim() !== "";
    if (hasIncBinFile) continue;
    const name = typeof block.incBinFileName === "string" ? block.incBinFileName.trim() : "";
    if (!name) continue;
    block.incBinFile = name;
  }

  // Backward compatibility for old SID projects:
  // some files store only sidFileName (sidFile is empty).
  for (const block of program) {
    if (!block?.isSidMacro) continue;
    const hasSidFile = typeof block.sidFile === "string" && block.sidFile.trim() !== "";
    if (hasSidFile) continue;
    const name = typeof block.sidFileName === "string" ? block.sidFileName.trim() : "";
    if (!name) continue;
    block.sidFile = name;
  }

  // Migrate old projects: if no ORG block at start, prepend one from saved origin
  if (!program.some(b => b.isOrgMacro)) {
    const orgAddr = (projectData.origin || "0801").replace(/^\$/, "").toUpperCase().padStart(4, "0");
    program.unshift({ ...makeDefaultOrgBlock(), orgAddress: orgAddr });
  }

  await reloadIncludeBlocks(result.filePath || "");
  await reloadIncBinBlocks(result.filePath || "");
  await reloadSidBlocks(result.filePath || "");

  d64ExportState.extras = [];
  const _d64BaseDir = (() => {
    const fp = typeof result.filePath === "string" ? result.filePath : "";
    const s = Math.max(fp.lastIndexOf("/"), fp.lastIndexOf("\\"));
    return s >= 0 ? fp.slice(0, s) : "";
  })();
  if (projectData.d64) {
    d64ExportState.diskName = projectData.d64.diskName || "";
    d64ExportState.progName = projectData.d64.progName || "";
    d64ExportState._pendingExtras = Array.isArray(projectData.d64.extras) ? projectData.d64.extras : [];
    d64ExportState._pendingExtrasBaseDir = _d64BaseDir;
  } else {
    d64ExportState.diskName = "";
    d64ExportState.progName = "";
    d64ExportState._pendingExtras = null;
    d64ExportState._pendingExtrasBaseDir = "";
  }

  if (projectData.ui?.numberBase && baseInputs.length) {
    baseInputs.forEach((input) => {
      input.checked = input.value === projectData.ui.numberBase;
    });
  }

  if (projectData.ui?.outputMode && outputModeInputs.length) {
    outputModeInputs.forEach((input) => {
      input.checked = input.value === projectData.ui.outputMode;
    });
  }

  if (typeof projectData.ui?.zoom === "number") {
    blockScale = Math.max(0.72, Math.min(1.25, Number(projectData.ui.zoom)));
    applyZoom();
  }

  renderOriginPreview();
  renderEmulatorRunHint();
  renderOutputMode();
  parseUserMacros();  // Parse any user-defined macros in the loaded project
  renderProgram();
  if (expertMode) {
    _expertAcHide();
    if (typeof projectData.expertText === "string") {
      expertEditor.value = projectData.expertText;
      expertEditor.dispatchEvent(new Event("input"));
    } else {
      _expertSyncFromProgram();
    }
  }
  saveUiSettings();

  if (emulatorStatus) {
    emulatorStatus.textContent = `${t("projectLoaded")}: ${result.filePath}`;
  }

  // Update current file display
  if (result.filePath) {
    const fileName = result.filePath.split(/[\\/]/).pop();
    _setCurrentFile(fileName, fileName, result.filePath);
  }
  markTabClean();

  return true;
}

async function copyAsmToClipboard() {
  if (!copyAsmButton) {
    return;
  }

  try {
    const version = document.getElementById("about-version")?.textContent?.trim() || "v?";
    const header = `; Generated by C64 Visual Assembler ${version}\n; https://zstarczali.itch.io/visual-assembler-commodore-64\n;\n`;
    await navigator.clipboard.writeText(header + asmPlainText);
    copyAsmButton.textContent = currentLanguage === "en" ? "ASM copied" : "ASM kimasolva";
    window.setTimeout(() => {
      copyAsmButton.textContent = t("copyAsm");
    }, 1400);
  } catch (error) {
    copyAsmButton.textContent = currentLanguage === "en" ? "Copy failed" : "Masolas sikertelen";
    window.setTimeout(() => {
      copyAsmButton.textContent = t("copyAsm");
    }, 1800);
  }
}

let _viceToastTimer = null;
function showViceToast(fileName, isError = false) {
  const toast = document.getElementById("vice-toast");
  const text = document.getElementById("vice-toast-text");
  if (!toast || !text) return;
  const icon = toast.querySelector(".vice-toast-icon");
  if (icon) icon.textContent = isError ? "✕" : "▶";
  text.textContent = isError ? fileName : `${t("viceRunning")} — ${fileName}`;
  toast.dataset.error = isError ? "1" : "";
  toast.hidden = false;
  if (_viceToastTimer) clearTimeout(_viceToastTimer);
  _viceToastTimer = setTimeout(() => { toast.hidden = true; }, isError ? 4000 : 3000);
}

async function runInEmulator() {
  if (isProgramEmpty()) {
    showViceToast(currentLanguage === "en" ? "Nothing to run — add some instructions first." : "Nincs mit futtatni — adj hozzá utasításokat.", true);
    return;
  }
  if (!vicePath) {
    showViceToast(currentLanguage === "en" ? "VICE is not configured. Select it in the menu first." : "A VICE nincs beallitva. Valaszd ki a menuben.", true);
    return;
  }

  if (!window.electronAPI?.launchVice) {
    showViceToast(currentLanguage === "en" ? "VICE launch is not available." : "A VICE inditasa nem elerheto.", true);
    return;
  }

  await showWorkProgress("workProgressRun");
  let success = false;
  try {
    setWorkProgress(20);

    const prg = buildAutostartPrgForEmulator();
    if (!prg.ok) {
      if (prg.errors?.length) { showCompileErrorDialog(prg.errors); return; }
      if (emulatorStatus) emulatorStatus.textContent = prg.error;
      return;
    }

    setWorkProgress(72);

    const result = await window.electronAPI.launchVice({
      bytes: Array.from(prg.bytes),
      fileName: `c64-visual-assembler-${Date.now()}.prg`
    });

    if (!result?.ok) {
      showViceToast(result?.error || (currentLanguage === "en" ? "Launching VICE failed." : "A VICE inditasa sikertelen."), true);
      return;
    }

    setWorkProgress(100);
    updateVicePathPreview(result.vicePath || vicePath);
    const parts = (result.filePath || "").replace(/\\/g, "/").split("/");
    const fileName = parts[parts.length - 1] || result.filePath;
    showViceToast(fileName);
    success = true;
  } finally {
    if (success) {
      await completeWorkProgress("workProgressSuccessRun");
    } else {
      hideWorkProgress();
    }
  }
}

function buildAutostartPrgForEmulator() {
  const saved = program;
  const savedUserMacros = userMacros;
  let didSwap = false;

  if (expertMode) {
    // Expert mode: always rebuild from editor, but prefer startup file if set
    const startupBlocks = _expertGetStartupProgram();
    program = startupBlocks || _expertBuildProgram();
    didSwap = true;
  } else {
    // Block mode: check for project startup file
    const startupBlocks = _expertGetStartupProgram();
    if (startupBlocks) {
      program = startupBlocks;
      didSwap = true;
    }
  }

  try {
    parseUserMacros();
    return _buildAutostartPrgCore();
  } finally {
    if (didSwap) {
      program = saved;
      userMacros = savedUserMacros;
    }
  }
}

/**
 * Returns the program blocks for the project startup file, or null if none.
 * Works in both block mode and expert mode:
 * - If the startup file's tab is active → use current program (expert: fresh parse, block: global program[])
 * - If startup file's tab is open but not active → use saved tab.program
 * - If startup file's tab is not open → null (fallback to current editor/tab)
 */
function _expertGetStartupProgram() {
  if (!_expertProjectData?.startupFile) return null;
  const sf = _expertProjectData.files.find(f => f.path === _expertProjectData.startupFile);
  if (!sf) return null;

  const absPath  = _projResolveAbsPath(sf.path);
  const normAbs  = _normFilePath(absPath);
  const activeTab = tabs.find(t => t.id === activeTabId);

  // If the startup file tab is active, use the current program
  if (activeTab && _normFilePath(activeTab.filePath) === normAbs) {
    // In expert mode, parse fresh from editor; in block mode use current program[]
    return expertMode ? _expertBuildProgram() : JSON.parse(JSON.stringify(program));
  }

  // Otherwise use the tab's saved program (from last _tabSaveCurrent)
  const tab = tabs.find(t => _normFilePath(t.filePath) === normAbs);
  if (tab?.program?.length > 0) {
    return JSON.parse(JSON.stringify(tab.program));
  }

  return null;  // fallback → current editor
}

function _buildAutostartPrgCore() {
  const useBasicSys = basicSysToggle ? basicSysToggle.checked : true;

  if (!useBasicSys) {
    const origin = parseOriginValue();
    const targetOrigin = (origin.value === 0x0801) ? 0xC000 : origin.value;
    return assembleProgramToPrg(targetOrigin);
  }

  // Use user's origin as the SYS target address.
  // Stub occupies $0801..$080C (for 4-digit decimal addresses) so code
  // must start at $080D or later. Clamp if needed.
  const origin = parseOriginValue();
  const rawOrigin = (origin.value === 0x0801) ? 0x080D : origin.value;
  const stubDigits = String(rawOrigin).length;
  const stubDataSize = 2 + 2 + 1 + stubDigits + 1 + 2; // nextptr+lineno+SYS+digits+EOL+BASIC_END
  const stubEndAddr = 0x0801 + stubDataSize;
  const sysAddress = Math.max(rawOrigin, stubEndAddr);

  const codePrg = assembleProgramToPrg(sysAddress);
  if (!codePrg.ok) return codePrg;

  const basicStub = buildBasicSysStub(sysAddress);
  // basicStub[0,1] = PRG load addr header ($0801)
  // basicStub[2..] = BASIC program data loaded at $0801
  const stubData = basicStub.slice(2);
  const codeData = codePrg.bytes.slice(2);
  // Fill gap between stub end and code start with zeros
  const gapSize = sysAddress - 0x0801 - stubData.length;
  const bytes = new Uint8Array(2 + stubData.length + gapSize + codeData.length);
  bytes[0] = 0x01; bytes[1] = 0x08; // load at $0801
  bytes.set(stubData, 2);
  bytes.set(codeData, 2 + stubData.length + gapSize);

  return { ok: true, bytes, sysAddress };
}

function buildBasicSysStub(sysAddress) {
  const sysDigits = String(sysAddress).split("").map((char) => char.charCodeAt(0));
  const lineAddress = 0x0801;
  const nextLineAddress = lineAddress + 2 + 2 + 1 + sysDigits.length + 1;

  return new Uint8Array([
    0x01, 0x08,
    nextLineAddress & 0xFF, (nextLineAddress >> 8) & 0xFF,
    0x0A, 0x00,
    0x9E,
    ...sysDigits,
    0x00,
    0x00, 0x00
  ]);
}

function assembleProgramToPrg(originOverride) {
  const layout = getProgramLayout(originOverride);
  const labels = new Map();

  layout.lines.forEach((line) => {
    if (line.conditionallySkipped) return;
    if (line.block.isLabel) {
      labels.set(line.block.labelName, line.address);
    }
    if (line.block.isLoopMacro && line.block.loopLabel) {
      labels.set(line.block.loopLabel, line.address + 2);
    }
    if (line.block.isForMacro && line.block.loopLabel) {
      labels.set(line.block.loopLabel, line.address + 2);
    }
    if (line.block.isTableMacro && line.block.tableName) {
      const tableAddr = line.block.tableAddress
        ? (parseAddressValue(line.block.tableAddress) ?? line.address)
        : line.address;
      labels.set(line.block.tableName, tableAddr);
    }
    if (line.block.isConstMacro && line.block.constName) {
      const constVal = parseNumberByBase((line.block.rawOperand || "").replace(/^\$/, ""), line.block.base);
      if (constVal !== null) {
        labels.set(line.block.constName, constVal);
      }
    }
    // Register optional macroLabel pointing to the macro's fixed memory address
    if (line.block.macroLabel) {
      const ml = line.block.macroLabel.trim();
      if (ml) {
        let addr = null;
        if (line.block.isTextMacro) {
          addr = 0x0400 + ((line.block.textY ?? 0) * 40) + (line.block.textX ?? 0);
        } else if (line.block.isStringMacro) {
          addr = parseAddressValue(line.block.stringAddress) ?? 0xC000;
        } else if (line.block.isDataMacro) {
          addr = parseAddressValue(line.block.dataAddress) ?? 0xC000;
        } else if (line.block.isRawBytesMacro) {
          addr = parseAddressValue(line.block.rawBytesAddress) ?? 0xC000;
        } else if (line.block.isRawTextMacro) {
          addr = parseAddressValue(line.block.rawTextAddress) ?? 0xC000;
        } else if (line.block.isPetsciiMacro) {
          addr = parseAddressValue(line.block.petsciiAddress) ?? 0xC000;
        }
        if (addr !== null) labels.set(ml, addr);
      }
    }
  });
  labels._anonAddrs = _collectAnonLabels(layout);

  // Assemble inline code bytes as sections (split by ORG blocks)
  const inlineSections = [{ addr: layout.origin.value, bytes: [] }];
  let currentSection = inlineSections[0];
  const compileErrors = [];
  for (const [layoutIndex, line] of layout.lines.entries()) {
    if (line.block.isLabel || line.block.isComment || line.block.isIncludeMacro) continue;
    if (line.block._isSavedAddress) continue;
    if (line.block._isRestoreAddress) {
      currentSection = { addr: line.address, bytes: [] };
      inlineSections.push(currentSection);
      continue;
    }
    if (line.block.isOrgMacro) {
      // Use line.address (clamped by getProgramLayout) instead of raw orgAddress,
      // so that an ORG below originOverride (e.g. ORG $0801 with sysAddress=$080D)
      // doesn't create a section at the wrong address and shift deferred data.
      currentSection = { addr: line.address, bytes: [] };
      inlineSections.push(currentSection);
      continue;
    }
    const compiled = compileLineBytes(line, labels);
    if (!compiled.ok) {
      const addr = `$${line.address.toString(16).toUpperCase().padStart(4, "0")}`;
      const mnemonic = line.block.mnemonic || "?";
      const operand = line.block.operand ? ` ${line.block.operand}` : "";
      const key = line.block._fromInclude || (line.block._fromMacro ? (line.block._invokeBlockId || null) : line.block.id);
      const asmLine = (key && asmBlockRanges[key]) ? (asmBlockRanges[key].firstLine + 1) : null;
      const lineTag = asmLine
        ? `L${String(asmLine).padStart(3, "0")}`
        : `P${String(layoutIndex + 1).padStart(3, "0")}`;
      compileErrors.push(`[${lineTag}] ${addr}  ${mnemonic}${operand} — ${compiled.error}`);
    } else {
      currentSection.bytes.push(...compiled.bytes);
    }
  }
  if (compileErrors.length > 0) {
    return { ok: false, error: compileErrors[0], errors: compileErrors };
  }

  const origin = layout.origin.value;

  // Collect deferred address chunks from RAWBYTES and RAWTEXT blocks
  const deferredChunks = [];
  for (const line of layout.lines) {
    const block = line.block;
    if (block.isRawBytesMacro) {
      const chunkBytes = parseByteMacro(block.rawOperand, block.base);
      const addr = parseAddressValue(block.rawBytesAddress) ?? 0xC000;
      if (chunkBytes.length > 0) deferredChunks.push({ addr, bytes: chunkBytes });
    } else if (block.isRawTextMacro) {
      const rawOffset = parseInt(block.charOffset || "0", 16);
      const chunkBytes = encodeTextMacro(block.rawOperand, block.textCharset || "standard").map(b => (b + (isNaN(rawOffset) ? 0 : rawOffset)) & 0xFF);
      const addr = parseAddressValue(block.rawTextAddress) ?? 0xC000;
      if (chunkBytes.length > 0) deferredChunks.push({ addr, bytes: chunkBytes });
    } else if (block.isPetsciiMacro) {
      const chunkBytes = encodePetsciiMacro(block.rawOperand);
      const addr = parseAddressValue(block.petsciiAddress) ?? 0xC000;
      if (chunkBytes.length > 0) deferredChunks.push({ addr, bytes: chunkBytes });
    } else if (block.isIncBinMacro) {
      const chunkBytes = block.incBinBytes || [];
      const addr = parseAddressValue(block.incBinAddress) ?? 0xC000;
      if (chunkBytes.length > 0) deferredChunks.push({ addr, bytes: Array.from(chunkBytes) });
    } else if (block.isSidMacro) {
      const chunkBytes = block.sidBytes || [];
      const customAddr = block.sidCustomAddress ? parseAddressValue(block.sidCustomAddress.replace(/^\$/, "")) : null;
      const addr = customAddr ?? block.sidLoadAddress ?? 0;
      if (chunkBytes.length > 0 && addr > 0) deferredChunks.push({ addr, bytes: Array.from(chunkBytes) });
    }
  }

  // Collect all non-empty chunks: inline sections + deferred chunks
  const allChunks = [
    ...inlineSections.filter(s => s.bytes.length > 0),
    ...deferredChunks
  ];

  if (allChunks.length === 0) {
    // No bytes at all — return minimal PRG with just load address
    return { ok: true, bytes: new Uint8Array([origin & 0xFF, (origin >> 8) & 0xFF]) };
  }

  // Determine full address range across all chunks
  let minAddr = allChunks[0].addr;
  let maxAddr = allChunks[0].addr + allChunks[0].bytes.length - 1;
  for (const chunk of allChunks) {
    minAddr = Math.min(minAddr, chunk.addr);
    maxAddr = Math.max(maxAddr, chunk.addr + chunk.bytes.length - 1);
  }

  // Build flat buffer from minAddr to maxAddr (zeros for gaps)
  const bufSize = maxAddr - minAddr + 1;
  const buf = new Uint8Array(bufSize);
  for (const chunk of allChunks) {
    const offset = chunk.addr - minAddr;
    if (offset >= 0 && offset + chunk.bytes.length <= bufSize) {
      buf.set(chunk.bytes, offset);
    }
  }

  // PRG: 2-byte load address header + flat buffer
  const result = new Uint8Array(2 + bufSize);
  result[0] = minAddr & 0xFF;
  result[1] = (minAddr >> 8) & 0xFF;
  result.set(buf, 2);
  return { ok: true, bytes: result };
}

function compileLineBytes(line, labels) {
  if (line.conditionallySkipped) {
    return { ok: true, bytes: [], comment: "conditionally skipped" };
  }
  const block = line.block;

  if (block._isMacroInvokeHeader) {
    return { ok: true, bytes: [], comment: `Invoke: ${block.invokeMacroName || "?"}` };
  }

  if (block._macroSourceBlock) {
    return { ok: true, bytes: [] };
  }

  if (block.isLabel || block.isComment || block.isAnonymousLabel) {
    return { ok: true, bytes: [] };
  }

  const blockError = getLiveValidationError(block);
  if (blockError) {
    return { ok: false, error: tf("compileInvalidOperand", { mnemonic: block.mnemonic }) };
  }

  if (block.isTextMacro) {
    const charset = block.textCharset || "standard";
    const chars = encodeTextMacro(block.rawOperand, charset);
    const startAddress = 0x0400 + ((block.textY ?? 0) * 40) + (block.textX ?? 0);
    const bytes = [];
    chars.forEach((charCode, charIndex) => {
      const targetAddress = startAddress + charIndex;
      bytes.push(0xA9, charCode & 0xFF, 0x8D, targetAddress & 0xFF, (targetAddress >> 8) & 0xFF);
    });
    const isLower = /[a-z]/.test(block.rawOperand || "");
    return {
      ok: true,
      bytes,
      comment: `TEXT "${block.rawOperand || ""}" @ (${block.textX ?? 0}, ${block.textY ?? 0})${isLower || charset === "lowercase" ? " [lowercase]" : ""}`
    };
  }

  if (block.isByteMacro) {
    const bytes = parseByteMacro(block.rawOperand, block.base);
    return {
      ok: true,
      bytes,
      comment: `BYTE ${block.rawOperand || ""}`
    };
  }

  if (block.isStringMacro) {
    const chars = encodeTextMacro(block.rawOperand, block.textCharset || "standard");
    const offset = parseInt(block.charOffset || "0", 16);
    const startAddress = parseAddressValue(block.stringAddress) ?? 0xC000;
    const bytes = [];
    chars.forEach((charCode, charIndex) => {
      const targetAddress = startAddress + charIndex;
      bytes.push(0xA9, (charCode + (isNaN(offset) ? 0 : offset)) & 0xFF, 0x8D, targetAddress & 0xFF, (targetAddress >> 8) & 0xFF);
    });
    return {
      ok: true,
      bytes,
      comment: `STRING "${block.rawOperand || ""}" @ ${formatAddress(startAddress)}${block.textCharset === "lowercase" ? " [lowercase]" : ""}`
    };
  }

  if (block.isDataMacro) {
    const dataBytes = parseByteMacro(block.rawOperand, block.base);
    const startAddress = parseAddressValue(block.dataAddress) ?? 0xC000;
    const bytes = [];
    dataBytes.forEach((byte, byteIndex) => {
      const targetAddress = startAddress + byteIndex;
      bytes.push(0xA9, byte & 0xFF, 0x8D, targetAddress & 0xFF, (targetAddress >> 8) & 0xFF);
    });
    return {
      ok: true,
      bytes,
      comment: `DATA ${block.rawOperand || ""} @ ${formatAddress(startAddress)}`
    };
  }

  if (block.isRawBytesMacro) {
    return {
      ok: true,
      bytes: [],
      comment: `RAWBYTES ${block.rawOperand || ""} @ ${formatAddress(parseAddressValue(block.rawBytesAddress) ?? 0xC000)}`
    };
  }

  if (block.isIncBinMacro) {
    const size = (block.incBinBytes || []).length;
    const addr = parseAddressValue(block.incBinAddress) ?? 0xC000;
    return {
      ok: true,
      bytes: [],
      comment: `INCBIN "${block.incBinFileName || block.incBinFile || ""}" (${size} bytes) @ ${formatAddress(addr)}`
    };
  }

  if (block.isSidMacro) {
    const size = (block.sidBytes || []).length;
    const load = block.sidLoadAddress || 0;
    const init = block.sidInitAddress || 0;
    const play = block.sidPlayAddress || 0;
    if (!size) return { ok: true, bytes: [], comment: `SID (no file loaded)` };
    return {
      ok: true,
      bytes: [],
      comment: `SID "${block.sidFileName || ""}" (${size} bytes) Load:${formatAddress(load)} Init:${formatAddress(init)} Play:${formatAddress(play)}`
    };
  }

  if (block.isRawTextMacro) {
    return {
      ok: true,
      bytes: [],
      comment: `RAWTEXT "${block.rawOperand || ""}" @ ${formatAddress(parseAddressValue(block.rawTextAddress) ?? 0xC000)}`
    };
  }

  if (block.isPetsciiMacro) {
    return {
      ok: true,
      bytes: [],
      comment: `PETSCII "${block.rawOperand || ""}" @ ${formatAddress(parseAddressValue(block.petsciiAddress) ?? 0xC000)}`
    };
  }

  if (block.isMouseMacro) {
    const port = parseInt(block.mousePort || "2", 10);
    if (port !== 1 && port !== 2) {
      return { ok: false, error: "MOUSE: a port 1 vagy 2 lehet." };
    }
    const num = parseInt(block.mouseSpriteNum || "0", 10);
    if (isNaN(num) || num < 0 || num > 7) {
      return { ok: false, error: "MOUSE: a sprite szama 0 es 7 kozott lehet." };
    }
    const zpXStr = (block.mousePotXZP || "FD").replace(/^\$/, "");
    const zpYStr = (block.mousePotYZP || "FE").replace(/^\$/, "");
    const zpX = parseInt(zpXStr, 16);
    const zpY = parseInt(zpYStr, 16);
    if (isNaN(zpX) || zpX < 0 || zpX > 255) {
      return { ok: false, error: "MOUSE: ZP X 1 hex byte legyen (00-FF)." };
    }
    if (isNaN(zpY) || zpY < 0 || zpY > 255) {
      return { ok: false, error: "MOUSE: ZP Y 1 hex byte legyen (00-FF)." };
    }
    const ciaSelect = port === 1 ? 0x40 : 0x80; // paddle mux on CIA1 PRA bits 7:6: port1=%01xxxxxx, port2=%10xxxxxx
    const xAddr = 0xD000 + num * 2;
    const yAddr = 0xD001 + num * 2;
    const xMsbMask = 1 << num;
    const xLo = xAddr & 0xFF, xHi = xAddr >> 8;
    const yLo = yAddr & 0xFF, yHi = yAddr >> 8;
    const bytes = [];
    const labels = new Map();
    const fixups = [];
    const emit = (...values) => values.forEach((value) => bytes.push(value & 0xFF));
    const mark = (name) => labels.set(name, bytes.length);
    const branch = (opcode, label) => {
      emit(opcode, 0x00);
      fixups.push({ kind: "rel", index: bytes.length - 1, label });
    };
    const jump = (label) => {
      emit(0x4C, 0x00, 0x00);
      fixups.push({ kind: "abs", index: bytes.length - 2, label });
    };

    emit(
      0xAD, 0x00, 0xDC,
      0x29, 0x3F,
      0x09, ciaSelect,
      0x8D, 0x00, 0xDC,
      0xA2, 0x67,
      0xCA,
      0xD0, 0xFD
    );

    mark("xStart");
    emit(0xAD, 0x19, 0xD4);
    emit(0xA8);
    emit(0x38);
    emit(0xE5, zpX);
    emit(0x29, 0x7F);
    emit(0xA2, 0x00);
    emit(0xC9, 0x40);
    branch(0xB0, "xNeg");
    emit(0x4A);
    branch(0xF0, "xDone");
    emit(0x84, zpX);
    emit(0x18);
    emit(0x6D, xLo, xHi);
    emit(0x8D, xLo, xHi);
    emit(0x8A);
    emit(0x69, 0x00);
    emit(0x29, 0x01);
    branch(0xF0, "xDone");
    emit(0xAD, 0x10, 0xD0);
    emit(0x49, xMsbMask);
    emit(0x8D, 0x10, 0xD0);
    jump("xDone");

    mark("xNeg");
    emit(0x09, 0xC0);
    emit(0xC9, 0xFF);
    branch(0xF0, "xDone");
    emit(0x38);
    emit(0x6A);
    emit(0xCA);
    emit(0x84, zpX);
    emit(0x18);
    emit(0x6D, xLo, xHi);
    emit(0x8D, xLo, xHi);
    emit(0x8A);
    emit(0x69, 0x00);
    emit(0x29, 0x01);
    branch(0xF0, "xDone");
    emit(0xAD, 0x10, 0xD0);
    emit(0x49, xMsbMask);
    emit(0x8D, 0x10, 0xD0);

    mark("xDone");
    emit(0xAD, 0x1A, 0xD4);
    emit(0xAA);
    emit(0x38);
    emit(0xE5, zpY);
    emit(0x29, 0x7F);
    emit(0xC9, 0x40);
    branch(0xB0, "yNeg");
    emit(0x4A);
    branch(0xF0, "yDone");
    emit(0x86, zpY);
    emit(0x49, 0xFF);
    emit(0x38);
    emit(0x6D, yLo, yHi);
    emit(0x8D, yLo, yHi);
    jump("yDone");

    mark("yNeg");
    emit(0x09, 0xC0);
    emit(0xC9, 0xFF);
    branch(0xF0, "yDone");
    emit(0x38);
    emit(0x6A);
    emit(0x86, zpY);
    emit(0x49, 0xFF);
    emit(0x38);
    emit(0x6D, yLo, yHi);
    emit(0x8D, yLo, yHi);
    mark("yDone");

    fixups.forEach((fixup) => {
      const target = labels.get(fixup.label);
      if (typeof target !== "number") {
        throw new Error(`Missing MOUSE label: ${fixup.label}`);
      }
      if (fixup.kind === "rel") {
        const offset = target - (fixup.index + 1);
        if (offset < -128 || offset > 127) {
          throw new Error(`MOUSE branch out of range: ${fixup.label}`);
        }
        bytes[fixup.index] = offset & 0xFF;
        return;
      }
      const absolute = line.address + target;
      bytes[fixup.index] = absolute & 0xFF;
      bytes[fixup.index + 1] = (absolute >> 8) & 0xFF;
    });

    return { ok: true, bytes, comment: `MOUSE port${port} → sprite#${num} ZP:$${zpXStr.toUpperCase()}/$${zpYStr.toUpperCase()} std1351` };
  }

  if (block.isJoystickMacro) {
    const port = parseInt(block.joyPort || "2", 10);
    if (port !== 1 && port !== 2) {
      return { ok: false, error: "JOYSTICK: a port 1 vagy 2 lehet." };
    }
    const num = parseInt(block.joySpriteNum || "0", 10);
    if (isNaN(num) || num < 0 || num > 7) {
      return { ok: false, error: "JOYSTICK: a sprite szama 0 es 7 kozott lehet." };
    }
    const portAddr = port === 2 ? 0xDC00 : 0xDC01;
    const xAddr = 0xD000 + num * 2;
    const yAddr = 0xD001 + num * 2;
    const xLo = xAddr & 0xFF, xHi = xAddr >> 8;
    const yLo = yAddr & 0xFF, yHi = yAddr >> 8;
    const pLo = portAddr & 0xFF, pHi = portAddr >> 8;
    // Each direction: LSR (1) + BCS +3 (2) + DEC/INC abs (3) = 6 bytes
    // BCS offset 3 = skip the following 3-byte DEC/INC
    const bytes = [
      0xAD, pLo, pHi,        // LDA $DCxx
      0x4A,                  // LSR  → bit0 (UP) → carry
      0xB0, 0x03,            // BCS +3 (not pressed)
      0xCE, yLo, yHi,        // DEC $D001+N*2  (Y--)
      0x4A,                  // LSR  → bit1 (DOWN) → carry
      0xB0, 0x03,            // BCS +3
      0xEE, yLo, yHi,        // INC $D001+N*2  (Y++)
      0x4A,                  // LSR  → bit2 (LEFT) → carry
      0xB0, 0x03,            // BCS +3
      0xCE, xLo, xHi,        // DEC $D000+N*2  (X--)
      0x4A,                  // LSR  → bit3 (RIGHT) → carry
      0xB0, 0x03,            // BCS +3
      0xEE, xLo, xHi         // INC $D000+N*2  (X++)
    ];
    return { ok: true, bytes, comment: `JOYSTICK port${port} → sprite#${num}` };
  }

  if (block.isWaitRasterMacro) {
    const lineStr = (block.rasterLine || "FF").replace(/^\$/, "");
    const rl = parseInt(lineStr, 16);
    if (isNaN(rl) || rl < 0 || rl > 255) {
      return { ok: false, error: "WAIT_RASTER: a rasztersor 1 hex byte legyen ($00-$FF)." };
    }
    const rlHex = rl.toString(16).toUpperCase().padStart(2, "0");
    // LDA $D012 (AD 12 D0) + CMP #rl (C9 rl) + BNE -7 (D0 F9)
    const bytes = [0xAD, 0x12, 0xD0, 0xC9, rl, 0xD0, 0xF9];
    return { ok: true, bytes, comment: `WAIT_RASTER $${rlHex}` };
  }

  if (block.isTurboSetMacro) {
    const spd = parseInt(block.turboSpeed || "7", 10);
    if (isNaN(spd) || spd < 0 || spd > 15) {
      return { ok: false, error: currentLanguage === "en" ? "TURBO_SET: speed must be 0–15." : "TURBO_SET: a sebesseg 0 es 15 kozott lehet." };
    }
    const badline = parseInt(block.turboBadline || "0", 10) === 1 ? 0x80 : 0x00;
    const val = (spd & 0x0F) | badline;
    // LDA #val (A9 val) + STA $D031 (8D 31 D0)
    return { ok: true, bytes: [0xA9, val, 0x8D, 0x31, 0xD0], comment: `TURBO_SET speed=${spd} badline=${block.turboBadline === "1" ? "off" : "on"}` };
  }

  if (block.isSpriteColMacro) {
    const num = parseInt(block.spriteNum || "0", 10);
    if (isNaN(num) || num < 0 || num > 7) {
      return { ok: false, error: currentLanguage === "en" ? "SPRITE_COL: sprite number must be 0–7." : "SPRITE_COL: a sprite szama 0 es 7 kozott lehet." };
    }
    const isBg = (block.colType || "sprite") === "background";
    // $D01E = sprite-sprite, $D01F = sprite-background; reading clears the register
    const regAddr = isBg ? 0xD01F : 0xD01E;
    const bitMask = 1 << num;
    // LDA $D01x (AD xx D0) + AND #mask (29 mask) = 5 bytes
    const bytes = [0xAD, regAddr & 0xFF, regAddr >> 8, 0x29, bitMask];
    const typeLabel = isBg ? "bg" : "spr";
    return { ok: true, bytes, comment: `SPRITE_COL #${num} ${typeLabel} → A≠0: utkozes` };
  }

  if (block.isReuCheckMacro) {
    // Probe a writable REU register twice. Present -> final CMP leaves Z=0; missing/open bus -> Z=1.
    return {
      ok: true,
      bytes: [
        0xA9, 0x55,
        0x8D, 0x04, 0xDF,
        0xAD, 0x04, 0xDF,
        0xC9, 0x55,
        0xD0, 0x12,
        0xA9, 0xAA,
        0x8D, 0x04, 0xDF,
        0xAD, 0x04, 0xDF,
        0xC9, 0xAA,
        0xD0, 0x06,
        0xA9, 0x00,
        0xC9, 0xFF,
        0xD0, 0x04,
        0xA9, 0xFF,
        0xC9, 0xFF
      ],
      comment: "REU_CHECK: probe $DF04 with $55/$AA"
    };
  }

  if (block.isReuTransferMacro) {
    const c64Addr = parseInt((block.reuC64Addr || "C000").replace(/^\$/, ""), 16);
    const expAddr = parseInt((block.reuExpAddr || "0000").replace(/^\$/, ""), 16);
    const bank    = parseInt(block.reuBank || "0", 10);
    const length  = parseInt((block.reuLength || "0100").replace(/^\$/, ""), 16);
    if (isNaN(c64Addr) || c64Addr < 0 || c64Addr > 0xFFFF) return { ok: false, error: "REU: ervenytelen C64 cim ($0000-$FFFF)." };
    if (isNaN(expAddr) || expAddr < 0 || expAddr > 0xFFFF) return { ok: false, error: "REU: ervenytelen REU cim ($0000-$FFFF)." };
    if (isNaN(bank)    || bank < 0    || bank > 7)         return { ok: false, error: "REU: a bank erteke 0-7 lehet." };
    if (isNaN(length)  || length < 1  || length > 0xFFFF)  return { ok: false, error: "REU: a hossz $0001-$FFFF lehet." };
    const cmd = block.mnemonic === "REU_STASH" ? 0x90 : block.mnemonic === "REU_FETCH" ? 0x91 : 0x92;
    const cmdLabel = block.mnemonic === "REU_STASH" ? "C64→REU" : block.mnemonic === "REU_FETCH" ? "REU→C64" : "C64↔REU";
    const bytes = [
      0xA9, c64Addr & 0xFF,       0x8D, 0x02, 0xDF,  // LDA #<c64  : STA $DF02
      0xA9, (c64Addr >> 8) & 0xFF, 0x8D, 0x03, 0xDF, // LDA #>c64  : STA $DF03
      0xA9, expAddr & 0xFF,       0x8D, 0x04, 0xDF,  // LDA #<reu  : STA $DF04
      0xA9, (expAddr >> 8) & 0xFF, 0x8D, 0x05, 0xDF, // LDA #>reu  : STA $DF05
      0xA9, bank & 0xFF,          0x8D, 0x06, 0xDF,  // LDA #bank  : STA $DF06
      0xA9, length & 0xFF,        0x8D, 0x07, 0xDF,  // LDA #<len  : STA $DF07
      0xA9, (length >> 8) & 0xFF, 0x8D, 0x08, 0xDF,  // LDA #>len  : STA $DF08
      0xA9, cmd,                  0x8D, 0x01, 0xDF   // LDA #cmd   : STA $DF01
    ];
    const c64Hex = c64Addr.toString(16).toUpperCase().padStart(4, "0");
    const expHex = expAddr.toString(16).toUpperCase().padStart(4, "0");
    const lenHex = length.toString(16).toUpperCase().padStart(4, "0");
    return { ok: true, bytes, comment: `${block.mnemonic} ${cmdLabel}: $${c64Hex} → REU${bank}:$${expHex} len=$${lenHex}` };
  }

  if (block.isSpriteInitMacro) {
    const num = parseInt(block.spriteNum || "0", 10);
    if (isNaN(num) || num < 0 || num > 7) {
      return { ok: false, error: "SPRITE_INIT: a sprite szama 0 es 7 kozott lehet." };
    }
    const color = parseInt(block.spriteColor || "7", 10);
    if (isNaN(color) || color < 0 || color > 15) {
      return { ok: false, error: "SPRITE_INIT: a szin erteke 0 es 15 kozott lehet." };
    }
    const pageStr = (block.spriteDataPage || "21").replace(/^\$/, "");
    const page = parseInt(pageStr, 16);
    if (isNaN(page) || page < 0 || page > 255) {
      return { ok: false, error: "SPRITE_INIT: az adatlap ertek 1 hex byte ($00-$FF) lehet." };
    }
    const ptrAddr = 0x07F8 + num;
    const colorAddr = 0xD027 + num;
    const bitMask = 1 << num;
    const bytes = [
      0xA9, page,                                // LDA #dataPage
      0x8D, ptrAddr & 0xFF, ptrAddr >> 8,        // STA $07F8+N
      0xAD, 0x15, 0xD0,                          // LDA $D015
      0x09, bitMask,                             // ORA #bitMask
      0x8D, 0x15, 0xD0,                          // STA $D015
      0xA9, color,                               // LDA #color
      0x8D, colorAddr & 0xFF, colorAddr >> 8     // STA $D027+N
    ];
    const pageHex = page.toString(16).toUpperCase().padStart(2, "0");
    return { ok: true, bytes, comment: `SPRITE_INIT #${num} col=${color} page=$${pageHex}` };
  }

  if (block.isLoadFileMacro) {
    const filename = (block.loadFileName || "").toUpperCase().replace(/[^\x20-\x7E]/g, "").slice(0, 16);
    if (!filename) {
      return { ok: false, error: "LOADFILE: a fajlnev nem lehet ures." };
    }
    const device = parseInt(block.loadFileDevice || "8", 10);
    if (isNaN(device) || device < 8 || device > 30) {
      return { ok: false, error: "LOADFILE: az eszkozszam 8 es 30 kozott lehet." };
    }
    const addrStr = (block.loadFileAddress || "").trim().replace(/^\$/, "");
    const useOverride = addrStr !== "";
    let overrideAddr = 0;
    if (useOverride) {
      overrideAddr = parseInt(addrStr, 16);
      if (isNaN(overrideAddr) || overrideAddr < 0 || overrideAddr > 0xFFFF) {
        return { ok: false, error: "LOADFILE: az override cim ervenytelen ($0000-$FFFF)." };
      }
    }
    const errorLabel = (block.loadFileErrorLabel || "").trim();
    const useErrorCheck = errorLabel !== "";

    const baseAddr = line.address;
    const fnameAddr = baseAddr + 3;             // immediately after JMP skip
    const skipAddr = fnameAddr + filename.length;

    const bytes = [];

    // JMP skip (over the filename data)
    bytes.push(0x4C, skipAddr & 0xFF, skipAddr >> 8);

    // Filename bytes (PETSCII; ASCII A-Z = PETSCII A-Z)
    for (let i = 0; i < filename.length; i++) {
      bytes.push(filename.charCodeAt(i) & 0xFF);
    }

    // SETNAM ($FFBD): A=length, X/Y=ptr lo/hi
    bytes.push(0xA9, filename.length);
    bytes.push(0xA2, fnameAddr & 0xFF);
    bytes.push(0xA0, (fnameAddr >> 8) & 0xFF);
    bytes.push(0x20, 0xBD, 0xFF);

    // SETLFS ($FFBA): A=logical, X=device, Y=secondary (0 = use override addr; 1 = use file's load addr)
    const secondary = useOverride ? 0x00 : 0x01;
    bytes.push(0xA9, 0x01);
    bytes.push(0xA2, device & 0xFF);
    bytes.push(0xA0, secondary);
    bytes.push(0x20, 0xBA, 0xFF);

    // Override address (only when secondary=0): LDX #<addr ; LDY #>addr
    if (useOverride) {
      bytes.push(0xA2, overrideAddr & 0xFF);
      bytes.push(0xA0, (overrideAddr >> 8) & 0xFF);
    }

    // LOAD ($FFD5): A=0 (load, not verify)
    bytes.push(0xA9, 0x00);
    bytes.push(0x20, 0xD5, 0xFF);

    // Optional BCS errorLabel (carry set on KERNAL load error)
    if (useErrorCheck) {
      const target = labels.get(errorLabel);
      if (target === undefined) {
        return { ok: false, error: `LOADFILE: ismeretlen hiba cimke: ${errorLabel}` };
      }
      const bcsAddr = baseAddr + bytes.length;
      const offset = target - (bcsAddr + 2);
      if (offset < -128 || offset > 127) {
        return { ok: false, error: `LOADFILE: a hiba cimke tul messze van (offset: ${offset}).` };
      }
      bytes.push(0xB0, offset & 0xFF);
    }

    const addrSuffix = useOverride
      ? ` @$${overrideAddr.toString(16).toUpperCase().padStart(4, "0")}`
      : "";
    const errSuffix = useErrorCheck ? ` BCS ${errorLabel}` : "";
    return { ok: true, bytes, comment: `LOADFILE "${filename}" dev=${device}${addrSuffix}${errSuffix}` };
  }

  if (block.isSpritePosMacro) {
    const num = parseInt(block.spriteNum || "0", 10);
    if (isNaN(num) || num < 0 || num > 7) {
      return { ok: false, error: "SPRITE_POS: a sprite szama 0 es 7 kozott lehet." };
    }
    const x = parseInt(block.spriteX || "152", 10);
    if (isNaN(x) || x < 0 || x > 319) {
      return { ok: false, error: "SPRITE_POS: X erteke 0 es 319 kozott lehet." };
    }
    const y = parseInt(block.spriteY || "100", 10);
    if (isNaN(y) || y < 0 || y > 255) {
      return { ok: false, error: "SPRITE_POS: Y erteke 0 es 255 kozott lehet." };
    }
    const xLow = x & 0xFF;
    const xAddr = 0xD000 + num * 2;
    const yAddr = 0xD001 + num * 2;
    const bitMask = 1 << num;
    const d010Op = x > 255 ? 0x09 : 0x29;                   // ORA (set) vs AND (clear)
    const d010Mask = x > 255 ? bitMask : (~bitMask & 0xFF);
    const bytes = [
      0xA9, xLow,                                // LDA #xLow
      0x8D, xAddr & 0xFF, xAddr >> 8,            // STA $D000+N*2
      0xAD, 0x10, 0xD0,                          // LDA $D010
      d010Op, d010Mask,                          // ORA/AND #mask
      0x8D, 0x10, 0xD0,                          // STA $D010
      0xA9, y,                                   // LDA #y
      0x8D, yAddr & 0xFF, yAddr >> 8             // STA $D001+N*2
    ];
    return { ok: true, bytes, comment: `SPRITE_POS #${num} X=${x} Y=${y}` };
  }

  if (block.isLoopMacro) {
    const reg = block.loopReg || "X";
    const opcode = reg === "Y" ? 0xA0 : 0xA2;
    const rawCount = (block.loopCount || "0A").trim();
    const count = /^\d+$/.test(rawCount) ? parseInt(rawCount, 10) : parseInt(rawCount, 16);
    if (isNaN(count) || count < 0 || count > 255) {
      return { ok: false, error: `LOOP: ${t("invalidOperand") || "ervenytelen szamlalocim"}` };
    }
    const countHex = count.toString(16).toUpperCase().padStart(2, "0");
    return { ok: true, bytes: [opcode, count], comment: `LD${reg} #$${countHex} ; ${block.loopLabel || "?"}:` };
  }

  if (block.isNextMacro) {
    const reg = block.nextReg || "X";
    const deOpcode = reg === "Y" ? 0x88 : 0xCA;
    const label = block.nextLabel || "";
    if (!label) {
      return { ok: false, error: "NEXT: hianyzik a LOOP cimke neve." };
    }
    const target = labels.get(label);
    if (target === undefined) {
      return { ok: false, error: `NEXT: ismeretlen cimke: ${label}` };
    }
    const offset = target - (line.address + 3);
    if (offset < -128 || offset > 127) {
      return { ok: false, error: `NEXT: a ciklus tul nagy, BNE nem er el (offset: ${offset}).` };
    }
    return { ok: true, bytes: [deOpcode, 0xD0, offset & 0xFF], comment: `DE${reg} / BNE ${label}` };
  }

  if (block.isForMacro) {
    const reg = block.loopReg || "X";
    const opcode = reg === "Y" ? 0xA0 : 0xA2;
    const rawCount = (block.loopCount || "0A").trim();
    const count = /^\d+$/.test(rawCount) ? parseInt(rawCount, 10) : parseInt(rawCount, 16);
    if (isNaN(count) || count < 0 || count > 255) {
      return { ok: false, error: `FOR: ervenytelen szamlalo` };
    }
    // LDX/LDY #0  — label at address+2
    return { ok: true, bytes: [opcode, 0x00], comment: `LD${reg} #$00 ; ${block.loopLabel || "?"}:` };
  }

  if (block.isEndfMacro) {
    const reg = block.nextReg || "X";
    const inOpcode  = reg === "Y" ? 0xC8 : 0xE8;  // INY / INX
    const cpOpcode  = reg === "Y" ? 0xC0 : 0xE0;  // CPY / CPX immediate
    const label = block.nextLabel || "";
    if (!label) {
      return { ok: false, error: "ENDF: hianyzik a FOR cimke neve." };
    }
    const rawCount = (block.nextCount || "0A").trim();
    const count = /^\d+$/.test(rawCount) ? parseInt(rawCount, 10) : parseInt(rawCount, 16);
    if (isNaN(count) || count < 0 || count > 255) {
      return { ok: false, error: `ENDF: ervenytelen hatarszam` };
    }
    const target = labels.get(label);
    if (target === undefined) {
      return { ok: false, error: `ENDF: ismeretlen cimke: ${label}` };
    }
    // INX/INY (1) + CPX/CPY #count (2) + BNE offset (2) = 5 bytes
    // BNE is at address+3, so target offset = target - (address+3+2) = target - (address+5)
    const offset = target - (line.address + 5);
    if (offset < -128 || offset > 127) {
      return { ok: false, error: `ENDF: a ciklus tul nagy, BNE nem er el (offset: ${offset}).` };
    }
    return { ok: true, bytes: [inOpcode, cpOpcode, count, 0xD0, offset & 0xFF], comment: `IN${reg} / CP${reg} #$${count.toString(16).toUpperCase().padStart(2,"0")} / BNE ${label}` };
  }

  if (block.isPushMacro) {
    const regs = (block.pushRegs || "A").toUpperCase();
    const bytes = [];
    let comment = "PUSH ";
    for (let i = 0; i < regs.length; i++) {
      const reg = regs[i];
      if (reg === 'A') {
        bytes.push(0x48);  // PHA
      } else if (reg === 'X') {
        bytes.push(0x8A);  // TXA
        bytes.push(0x48);  // PHA
      } else if (reg === 'Y') {
        bytes.push(0x98);  // TYA
        bytes.push(0x48);  // PHA
      } else {
        return { ok: false, error: `PUSH: ervenytelen regiszter: ${reg}` };
      }
      comment += reg;
    }
    return { ok: true, bytes, comment };
  }

  if (block.isPullMacro) {
    const regs = (block.pullRegs || "A").toUpperCase();
    const bytes = [];
    let comment = "PULL ";
    // IMPORTANT: PULL should be in REVERSE order of PUSH
    for (let i = regs.length - 1; i >= 0; i--) {
      const reg = regs[i];
      if (reg === 'A') {
        bytes.push(0x68);  // PLA
      } else if (reg === 'X') {
        bytes.push(0x68);  // PLA
        bytes.push(0xAA);  // TAX
      } else if (reg === 'Y') {
        bytes.push(0x68);  // PLA
        bytes.push(0xA8);  // TAY
      } else {
        return { ok: false, error: `PULL: ervenytelen regiszter: ${reg}` };
      }
      comment += reg;
    }
    return { ok: true, bytes, comment };
  }

  if (block.isWordMacro) {
    const words = parseWordMacro(block.rawOperand, block.base);
    const bytes = [];
    words.forEach(word => {
      bytes.push(word & 0xFF, (word >> 8) & 0xFF);  // LO, HI
    });
    return {
      ok: true,
      bytes,
      comment: `WORD ${block.rawOperand || ""}`
    };
  }

  if (block.isFillMacro) {
    const parsed = parseFillMacro(block.rawOperand, block.base);
    if (!parsed || isNaN(parsed.count) || isNaN(parsed.value)) {
      return { ok: false, error: `FILL: ${t("invalidOperand") || "invalid parameters"}` };
    }
    const bytes = new Array(parsed.count).fill(parsed.value & 0xFF);
    return {
      ok: true,
      bytes,
      comment: `FILL ${parsed.count},$${parsed.value.toString(16).toUpperCase().padStart(2, '0')}`
    };
  }

  if (block.isAlignMacro) {
    const boundary = parseNumberByBase(block.rawOperand.replace(/^\$/, ""), block.base);
    if (!boundary || boundary < 1) {
      return { ok: false, error: `ALIGN: ${t("invalidOperand") || "invalid boundary"}` };
    }
    // Calculate padding bytes needed
    const remainder = line.address % boundary;
    const padding = remainder === 0 ? 0 : boundary - remainder;
    const bytes = new Array(padding).fill(0x00);  // Fill with zeros
    const targetAddr = line.address + padding;
    return {
      ok: true,
      bytes,
      comment: `ALIGN ${boundary} → ${formatAddress(targetAddr)}`
    };
  }

  if (block.isTableMacro) {
    // TABLE just creates a label, no bytes generated here
    return {
      ok: true,
      bytes: [],
      comment: `TABLE ${block.tableName || "?"} @ ${formatAddress(parseAddressValue(block.tableAddress) ?? 0xC000)}`
    };
  }

  if (block.isRegionMacro || block.isEndRegionMacro) {
    return {
      ok: true,
      bytes: [],
      comment: block.isRegionMacro ? `Region: ${block.regionName || "region"}` : "End region"
    };
  }

  if (block.isDefineMacro || block.isIfMacro || block.isElseMacro || block.isEndIfMacro || block.isConstMacro) {
    return {
      ok: true,
      bytes: [],
      comment: block.isDefineMacro ? `DEFINE ${block.defineSymbol || "?"}` : block.isIfMacro ? `IF ${block.ifCondition || "?"}` : (block.isElseMacro ? "ELSE" : block.isConstMacro ? `CONST ${block.constName || "?"} = ${block.rawOperand || "?"}` : "ENDIF")
    };
  }

  if (block.isMacroDefStart || block.isMacroDefEnd) {
    // Macro definition blocks don't generate bytes
    return {
      ok: true,
      bytes: [],
      comment: block.isMacroDefStart ? `MACRO ${block.macroName || "?"}` : "ENDM"
    };
  }

  // Check if this is a user macro invocation (INVOKE block or legacy format)
  const macroName = block.isMacroInvoke ? block.invokeMacroName : (userMacros[block.mnemonic] ? block.mnemonic : null);
  if (macroName && userMacros[macroName]) {
    // This block invokes a user-defined macro - expand it inline
    return {
      ok: true,
      bytes: [],
      comment: `; Invoke user macro: ${macroName}`,
      isMacroInvocation: true
    };
  }

  if (block.isMacroInvoke) {
    // INVOKE block with undefined macro
    return {
      ok: false,
      error: `INVOKE: macro "${block.invokeMacroName || "?"}" is not defined`
    };
  }

  const opcode = opcodeMap[block.mnemonic]?.[block.addressingMode];
  if (opcode === undefined) {
    return { ok: false, error: tf("compileUnsupportedMode", { mnemonic: block.mnemonic, mode: block.addressingMode }) };
  }

  const bytes = [opcode];

  if (block.addressingMode === "implied") {
    return { ok: true, bytes, comment: block.mnemonic };
  }

  if (block.addressingMode === "relative") {
    let resolveBlock = block;
    if (block.rawOperand.trim() === "-" || block.rawOperand.trim() === "+") {
      const anonAddr = _resolveAnonymousLabel(block.rawOperand.trim(), line.address, labels._anonAddrs);
      if (anonAddr === null) {
        return { ok: false, error: tf("anonymousLabelNotFound", { label: block.rawOperand.trim() }) };
      }
      resolveBlock = { ...block, rawOperand: anonAddr.toString(16).toUpperCase().padStart(4, "0"), base: "hex" };
    }
    const relative = resolveRelativeOperand(resolveBlock, line.address, labels);
    if (!relative.ok) {
      return relative;
    }
    bytes.push(relative.value & 0xFF);
    return { ok: true, bytes, comment: `${block.mnemonic} ${block.operand || block.rawOperand}` };
  }

  // Resolve * (current PC) and -/+ anonymous labels to concrete addresses
  const resolveBlock = block.rawOperand.trim() === "*"
    ? { ...block, rawOperand: line.address.toString(16).toUpperCase().padStart(4, "0"), base: "hex" }
    : (block.rawOperand.trim() === "-" || block.rawOperand.trim() === "+")
      ? (() => {
          const anonAddr = _resolveAnonymousLabel(block.rawOperand.trim(), line.address, labels._anonAddrs);
          if (anonAddr === null) {
            return null;
          }
          return { ...block, rawOperand: anonAddr.toString(16).toUpperCase().padStart(4, "0"), base: "hex" };
        })()
      : block;

  if (resolveBlock === null) {
    return { ok: false, error: tf("anonymousLabelNotFound", { label: block.rawOperand.trim() }) };
  }

  const operandValue = resolveNumericOperand(resolveBlock, labels);
  if (!operandValue.ok) {
    return operandValue;
  }

  if (block.addressingMode === "immediate" || block.addressingMode === "zeroPage" || block.addressingMode === "indirectX" || block.addressingMode === "indirectY" || block.addressingMode === "zeroPageY") {
    bytes.push(operandValue.value & 0xFF);
  } else {
    bytes.push(operandValue.value & 0xFF, (operandValue.value >> 8) & 0xFF);
  }

  return { ok: true, bytes, comment: `${block.mnemonic} ${block.operand || block.rawOperand}` };
}

function resolveNumericOperand(block, labels) {
  if (labels.has(block.rawOperand)) {
    return { ok: true, value: labels.get(block.rawOperand) };
  }

  // label+offset or label-offset expression (e.g. screen_ram+$0100)
  const exprMatch = block.rawOperand.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*([+-])\s*(\$[0-9A-Fa-f]+|\d+)$/);
  if (exprMatch) {
    const [, name, op, offsetStr] = exprMatch;
    if (labels.has(name)) {
      const baseAddr = labels.get(name);
      const offsetVal = offsetStr.startsWith("$")
        ? parseInt(offsetStr.slice(1), 16)
        : parseInt(offsetStr, 10);
      const result = op === "+" ? baseAddr + offsetVal : baseAddr - offsetVal;
      return { ok: true, value: result & 0xFFFF };
    }
    return { ok: false, error: tf("operandNotResolvable", { mnemonic: block.mnemonic }) };
  }

  const stripped = block.rawOperand.replace(/^#/, "");

  // #<label  → low byte of label address
  if (stripped.startsWith("<")) {
    const name = stripped.slice(1).trim();
    if (labels.has(name)) return { ok: true, value: labels.get(name) & 0xFF };
    return { ok: false, error: tf("operandNotResolvable", { mnemonic: block.mnemonic }) };
  }
  // #>label  → high byte of label address
  if (stripped.startsWith(">")) {
    const name = stripped.slice(1).trim();
    if (labels.has(name)) return { ok: true, value: (labels.get(name) >> 8) & 0xFF };
    return { ok: false, error: tf("operandNotResolvable", { mnemonic: block.mnemonic }) };
  }

  // Strip $ (hex prefix) and % (binary prefix) before parsing
  const parsed = parseNumberByBase(stripped.replace(/^[\$%]/, ""), block.base);
  if (parsed === null) {
    // Try label lookup with stripped value (handles #LABEL_NAME for immediate mode)
    if (labels.has(stripped)) {
      return { ok: true, value: labels.get(stripped) };
    }
    return { ok: false, error: tf("operandNotResolvable", { mnemonic: block.mnemonic }) };
  }

  return { ok: true, value: parsed };
}

function resolveRelativeOperand(block, address, labels) {
  const raw = block.rawOperand.trim();

  // * = current PC: branch to self → offset = -2
  if (raw === "*") {
    return { ok: true, value: 0xFE }; // -2 as unsigned byte
  }

  if (labels.has(raw)) {
    const target = labels.get(raw);
    const offset = target - (address + 2);
    if (offset < -128 || offset > 127) {
      return { ok: false, error: tf("branchLabelTooFar", { label: raw, mnemonic: block.mnemonic }) };
    }
    return { ok: true, value: offset & 0xFF };
  }

  const parsed = parseNumberByBase(raw.replace(/^\$/, ""), block.base);
  if (parsed === null) {
    return { ok: false, error: tf("branchOperandInvalid", { mnemonic: block.mnemonic }) };
  }

  if (parsed >= -128 && parsed <= 127) {
    return { ok: true, value: parsed & 0xFF };
  }

  const offset = parsed - (address + 2);
  if (offset < -128 || offset > 127) {
    return { ok: false, error: tf("branchTargetOutOfRange", { mnemonic: block.mnemonic }) };
  }
  return { ok: true, value: offset & 0xFF };
}

// ── Anonymous label helpers ──────────────────────────────────────────────────────

// Collect anonymous label addresses from layout.
// These are stored on the labels map as labels._anonAddrs (sorted ascending).
function _collectAnonLabels(layout) {
  const addrs = [];
  for (const line of layout.lines) {
    if (line.block.isAnonymousLabel) {
      addrs.push(line.address);
    }
  }
  addrs.sort((a, b) => a - b);
  return addrs;
}

// Resolve an anonymous label reference ("-" or "+") to a concrete address.
// * "-" (backward) → largest anonymous label address < currentAddr
// * "+" (forward) → smallest anonymous label address > currentAddr
// Returns null if no matching anonymous label found.
function _resolveAnonymousLabel(operand, currentAddr, anonAddrs) {
  if (!anonAddrs || !anonAddrs.length) return null;
  if (operand === "-") {
    let best = null;
    for (const addr of anonAddrs) {
      if (addr < currentAddr && (best === null || addr > best)) {
        best = addr;
      }
    }
    return best;
  }
  if (operand === "+") {
    let best = null;
    for (const addr of anonAddrs) {
      if (addr > currentAddr && (best === null || addr < best)) {
        best = addr;
      }
    }
    return best;
  }
  return null;
}

// BIN format only makes sense for bitmask-style values (immediate mode, raw byte data).
// For address operands (JMP/JSR/branches/zeroPage/absolute/indirect) BIN is meaningless,
// so the BIN radio is hidden in those cases.
function shouldShowBinForBlock(block, mode) {
  if (!block) return false;
  // Macros: byte-level data benefits from BIN (bitmasks for sprites, chars, flags).
  if (block.isByteMacro || block.isDataMacro || block.isRawBytesMacro || block.isFillMacro) {
    return true;
  }
  // 16-bit values (mostly addresses) and alignment boundaries: BIN is not useful.
  if (block.isWordMacro || block.isAlignMacro) {
    return false;
  }
  // Regular instructions: BIN only for immediate mode.
  if (mode && mode.needsOperand) {
    return block.addressingMode === "immediate";
  }
  return false;
}

function parseNumberByBase(value, base) {
  // Trim leading/trailing whitespace — rawOperand may have trailing spaces from user input or old saves
  value = value.trim();

  // Strip leading # (immediate mode prefix — users sometimes type it, and
  // rawOperand may contain it from older saves or copy-paste)
  if (value.startsWith("#")) {
    value = value.slice(1);
    if (!value) return null;
  }

  // Binary literal with % prefix (works in any base mode)
  if (value.startsWith("%")) {
    const bits = value.slice(1);
    return /^[01]+$/.test(bits) ? Number.parseInt(bits, 2) : null;
  }

  // Hex literal with $ or 0x prefix (works in any base mode)
  if (value.startsWith("$")) {
    const hex = value.slice(1);
    return /^[0-9A-Fa-f]+$/.test(hex) ? Number.parseInt(hex, 16) : null;
  }
  if (/^0x/i.test(value)) {
    const hex = value.slice(2);
    return /^[0-9A-Fa-f]+$/.test(hex) ? Number.parseInt(hex, 16) : null;
  }

  if (base === "bin") {
    return /^[01]+$/.test(value) ? Number.parseInt(value, 2) : null;
  }

  if (base === "hex") {
    return /^[0-9A-Fa-f]+$/.test(value) ? Number.parseInt(value, 16) : null;
  }

  return /^-?\d+$/.test(value) ? Number(value) : null;
}

function getNumberFormatError(base) {
  if (base === "bin") {
    return currentLanguage === "en"
      ? "In binary mode use only 0 and 1 characters, optionally with a % prefix."
      : "Binaris modban csak 0 es 1 karaktereket hasznalj, opcionis % elotaggal.";
  }
  return base === "hex"
    ? (currentLanguage === "en" ? "In hex mode use only 0-9 and A-F characters, optionally with a $ prefix. Binary literals (%00001111) are also accepted." : "Hex modban csak 0-9 es A-F karaktereket hasznalj, opcionis $ elotaggal. Binaris literalok is elfogadottak (%00001111).")
    : (currentLanguage === "en" ? "In decimal mode provide only whole numbers. Binary literals (%00001111) are also accepted." : "Decimalis modban csak egesz szamot adj meg. Binaris literalok is elfogadottak (%00001111).");
}

// For regular 6502 instruction blocks, always re-evaluate validation error from current rawOperand.
// This avoids stale stored errors (e.g. from before a fix or from a loaded project).
function getLiveValidationError(block) {
  if (opcodeMap[block.mnemonic] && block.addressingMode) {
    const preview = buildOperandPreview(block.addressingMode, block.rawOperand || "", block.base || "hex");
    // Update stored error so block state stays in sync
    block.validationError = preview.error;
    return preview.error;
  }
  return block.validationError || "";
}

function getOperandPlaceholder(mode, base) {
  const modeKey = Object.keys(addressingModes).find((key) => addressingModes[key] === mode) || addressingSelect.value;
  if (!mode.needsOperand) {
    return modeText(modeKey, "placeholder");
  }

  if (base === "hex") {
    if (modeText(modeKey, "label") === "Immediate") {
      return currentLanguage === "en" ? "for example 01 or $FF" : "peldaul 01 vagy $FF";
    }

    if (modeText(modeKey, "label") === "Absolute") {
      return currentLanguage === "en" ? "for example C000 or $D020" : "peldaul C000 vagy $D020";
    }

    if (modeText(modeKey, "label") === "Zero page") {
      return currentLanguage === "en" ? "for example 10 or $A0" : "peldaul 10 vagy $A0";
    }
  }

  if (base === "bin") {
    if (modeText(modeKey, "label") === "Immediate" || modeText(modeKey, "label") === "Zero page") {
      return currentLanguage === "en" ? "for example 11111000" : "peldaul 11111000";
    }
    if (modeText(modeKey, "label") === "Absolute") {
      return currentLanguage === "en" ? "for example 1101000000010001" : "peldaul 1101000000010001";
    }
  }

  return modeText(modeKey, "placeholder");
}

function parseOriginValue() {
  // Origin is defined by the first ORG block in the program (top-level, not inside macro def)
  let insideMacroDef = false;
  for (const block of program) {
    if (block.isMacroDefStart) { insideMacroDef = true; continue; }
    if (block.isMacroDefEnd) { insideMacroDef = false; continue; }
    if (insideMacroDef) continue;
    if (block.isOrgMacro && block.orgAddress) {
      const addr = parseAddressValue(block.orgAddress);
      if (typeof addr === "number" && !isNaN(addr) && addr >= 0 && addr <= 0xFFFF) {
        return { value: addr, text: formatAddress(addr), error: "" };
      }
    }
  }
  return { value: defaultOrigin, text: toHex(defaultOrigin, 4), error: "" };
}

function renderOriginPreview() {
  const origin = parseOriginValue();
  const useBasicSys = basicSysToggle ? basicSysToggle.checked : true;

  // Collect all top-level ORG blocks for display
  let insideMacroDef = false;
  const orgBlocks = [];
  for (const block of program) {
    if (block.isMacroDefStart) { insideMacroDef = true; continue; }
    if (block.isMacroDefEnd) { insideMacroDef = false; continue; }
    if (insideMacroDef) continue;
    if (block.isOrgMacro && block.orgAddress) {
      orgBlocks.push(block.orgAddress.toUpperCase());
    }
  }

  function noteForOrg(addrHex, isFirst) {
    const addr = parseInt(addrHex, 16);
    if (isNaN(addr)) return "";
    if (isFirst && useBasicSys) {
      const rawOrigin = (addr === 0x0801) ? 0x080D : addr;
      const stubDigits = String(rawOrigin).length;
      const stubDataSize = 2 + 2 + 1 + stubDigits + 1 + 2;
      const stubEndAddr = 0x0801 + stubDataSize;
      const codeAddr = Math.max(rawOrigin, stubEndAddr);
      const codeText = formatAddress(codeAddr);
      return currentLanguage === "en"
        ? `<small>BASIC stub: $0801 &nbsp;|&nbsp; <code>SYS ${codeAddr}</code> &nbsp;|&nbsp; Code: ${codeText}</small>`
        : `<small>BASIC stub: $0801 &nbsp;|&nbsp; <code>SYS ${codeAddr}</code> &nbsp;|&nbsp; Gépi kód: ${codeText}</small>`;
    }
    if (isFirst && !useBasicSys && addr === 0x0801) {
      const warning = currentLanguage === "en"
        ? "Auto-switched to $C000 (Free RAM)<br><span style='color: #d97706;'>⚠ Sample programs may not work without BASIC SYS stub</span>"
        : "Automatikusan átváltva: $C000 (Szabad RAM)<br><span style='color: #d97706;'>⚠ Mintaprogramok nem biztos hogy működnek BASIC SYS stub nélkül</span>";
      return `<small>${warning}</small>`;
    }
    return `<small>${addr} dec | $${addrHex} hex</small>`;
  }

  let html;
  if (orgBlocks.length > 0) {
    html = orgBlocks.map((addrHex, i) =>
      `<div><strong>*= $${addrHex}</strong> ${noteForOrg(addrHex, i === 0)}</div>`
    ).join("");
  } else {
    if (origin.error) {
      html = `<div><strong>*= ${origin.text}</strong> <small class="error-text">${origin.error}</small></div>`;
    } else {
      html = `<div><strong>*= ${origin.text}</strong> ${noteForOrg(origin.text.replace(/^\$/, ""), true)}</div>`;
    }
  }

  originPreview.innerHTML = html;
}

function renderEmulatorRunHint() {
  if (!emulatorRunHint) {
    return;
  }

  const useBasicSys = basicSysToggle ? basicSysToggle.checked : true;
  const origin = parseOriginValue();

  if (!useBasicSys) {
    const targetOrigin = (origin.value === 0x0801) ? 0xC000 : origin.value;
    const targetText = formatAddress(targetOrigin);
    const warning = currentLanguage === "en"
      ? `<strong>Run hint:</strong> BASIC SYS stub disabled — program loads at ${targetText}. Use <code>SYS ${targetOrigin}</code> to run.<br><span style='color: #d97706;'>⚠ Warning: Sample programs with RAWBYTES, sprites, or fixed memory addresses may not work correctly without BASIC SYS stub.</span>`
      : `<strong>Futtatas tipp:</strong> BASIC SYS stub kikapcsolva — program betöltve ide: ${targetText}. Futtatas: <code>SYS ${targetOrigin}</code><br><span style='color: #d97706;'>⚠ Figyelem: RAWBYTES, sprite-ok vagy fix memóriacímeket használó mintaprogramok nem biztos, hogy helyesen működnek BASIC SYS stub nélkül.</span>`;
    emulatorRunHint.innerHTML = warning;
    return;
  }

  if (origin.error) {
    emulatorRunHint.innerHTML = currentLanguage === "en"
      ? `<strong>Run hint:</strong> fix the start address so we can show a valid ` + "`SYS`" + ` entry point.`
      : `<strong>Futtatas tipp:</strong> javitsd a kezdocimet, hogy helyes ` + "`SYS`" + ` cimet tudjunk mutatni.`;
    return;
  }

  const runAddress = 0x080D;
  emulatorRunHint.innerHTML = currentLanguage === "en"
    ? `<strong>Run hint:</strong> if you want to start it manually in the emulator, use: <code>SYS ${runAddress}</code> <span>(${formatAddress(runAddress)})</span>`
    : `<strong>Futtatas tipp:</strong> ha az emulatorban kezzel inditanad, hasznald ezt: <code>SYS ${runAddress}</code> <span>(${formatAddress(runAddress)})</span>`;
}

function formatAddress(value) {
  return `$${value.toString(16).toUpperCase().padStart(4, "0")}`;
}

function getInstructionSize(block) {
  if (block._isMacroInvokeHeader || block._macroSourceBlock) {
    return 0;
  }

  if (block._isSavedAddress || block._isRestoreAddress) {
    return 0;
  }

  if (block.isLabel) {
    return 0;
  }

  if (block.isComment) {
    return 0;
  }

  if (block.isAnonymousLabel) {
    return 0;
  }

  if (block.isTextMacro) {
    return encodeTextMacro(block.rawOperand).length * 5;
  }

  if (block.isByteMacro) {
    return parseByteMacro(block.rawOperand, block.base).length;
  }

  if (block.isStringMacro) {
    return encodeTextMacro(block.rawOperand).length * 5;
  }

  if (block.isDataMacro) {
    return parseByteMacro(block.rawOperand, block.base).length * 5;
  }

  if (block.isRawBytesMacro) {
    return 0;
  }

  if (block.isRawTextMacro) {
    return 0;
  }

  if (block.isPetsciiMacro) {
    return 0;
  }

  if (block.isIncBinMacro) {
    return 0;
  }

  if (block.isSidMacro) {
    return 0;
  }

  if (block.isIncludeMacro) {
    return 0;
  }

  if (block.isJoystickMacro) {
    return 27;  // LDA port + 4×(LSR + BCS+3 + DEC/INC)
  }

  if (block.isMouseMacro) {
    return 142;  // CIA select via bits 7:6 + settle wait + full X/Y 1351-style delta decode paths with $D010 handling on X
  }

  if (block.isWaitRasterMacro) {
    return 7;  // LDA $D012 + CMP #rl + BNE -7
  }

  if (block.isTurboSetMacro) {
    return 5;  // LDA #val + STA $D031
  }

  if (block.isSuperCpuDetectMacro) {
    return 5;  // LDA $D0B8 + CMP #$FF
  }

  if (block.isTurboEnableMacro) {
    return 5;  // LDA #$00 + STA $D07A/$D07B
  }

  if (block.isSpriteColMacro) {
    return 5;  // LDA $D01E/$D01F + AND #mask
  }

  if (block.isSpriteInitMacro) {
    return 18;  // LDA/STA ptr + LDA/ORA/STA $D015 + LDA/STA color
  }

  if (block.isLoadFileMacro) {
    const filename = (block.loadFileName || "").toUpperCase().replace(/[^\x20-\x7E]/g, "").slice(0, 16);
    const fnLen = Math.max(filename.length, 1);  // reserve at least 1 byte even if empty (compile error will surface separately)
    const useOverride = (block.loadFileAddress || "").trim() !== "";
    const useErrorCheck = (block.loadFileErrorLabel || "").trim() !== "";
    // 3 (JMP skip) + fnLen + 9 (SETNAM) + 9 (SETLFS) + (4 if override) + 5 (LDA #0 + JSR LOAD) + (2 if BCS)
    return 3 + fnLen + 9 + 9 + (useOverride ? 4 : 0) + 5 + (useErrorCheck ? 2 : 0);
  }

  if (block.isSpritePosMacro) {
    return 18;  // LDA/STA xLow + LDA/[ORA|AND]/STA $D010 + LDA/STA y
  }

  if (block.isReuCheckMacro) {
    return 34;  // $DF04 write/read probe with $55/$AA, normalized to Z=0 present / Z=1 missing
  }

  if (block.isReuTransferMacro) {
    return 40;  // 8 × (LDA #imm 2 + STA abs 3) = 8 × 5
  }

  if (block.isLoopMacro) {
    return 2;  // LDX/LDY #count
  }

  if (block.isNextMacro) {
    return 3;  // DEX/DEY + BNE offset
  }

  if (block.isForMacro) {
    return 2;  // LDX/LDY #0
  }

  if (block.isEndfMacro) {
    return 5;  // INX/INY + CPX/CPY #limit + BNE offset
  }

  if (block.isPushMacro) {
    const regs = (block.pushRegs || "A").toUpperCase();
    let size = 0;
    for (let i = 0; i < regs.length; i++) {
      const reg = regs[i];
      if (reg === 'A') {
        size += 1;  // PHA
      } else if (reg === 'X' || reg === 'Y') {
        size += 2;  // TXA/TYA + PHA
      }
    }
    return size;
  }

  if (block.isPullMacro) {
    const regs = (block.pullRegs || "A").toUpperCase();
    let size = 0;
    for (let i = 0; i < regs.length; i++) {
      const reg = regs[i];
      if (reg === 'A') {
        size += 1;  // PLA
      } else if (reg === 'X' || reg === 'Y') {
        size += 2;  // PLA + TAX/TAY
      }
    }
    return size;
  }

  if (block.isWordMacro) {
    return parseWordMacro(block.rawOperand, block.base).length * 2;  // 2 bytes per word
  }

  if (block.isFillMacro) {
    const parsed = parseFillMacro(block.rawOperand, block.base);
    return parsed ? parsed.count : 0;
  }

  if (block.isAlignMacro) {
    // ALIGN size is calculated dynamically based on current address
    // For now return 0, will be calculated in getProgramLayout
    return 0;
  }

  if (block.isTableMacro || block.isOrgMacro) {
    return 0;
  }

  if (block.isDefineMacro || block.isIfMacro || block.isElseMacro || block.isEndIfMacro || block.isConstMacro) {
    return 0;
  }

  if (block.isMacroDefStart || block.isMacroDefEnd) {
    return 0;  // Macro definitions don't take space
  }

  if (block.isRegionMacro || block.isEndRegionMacro) {
    return 0;  // REGION/ENDREGION are visual markers only
  }

  // Check if this is a user macro invocation (INVOKE block or legacy format)
  const macroName = block.isMacroInvoke ? block.invokeMacroName : (userMacros[block.mnemonic] ? block.mnemonic : null);
  if (macroName && userMacros[macroName]) {
    // Calculate size by expanding the macro body
    let totalSize = 0;
    for (const macroBlock of userMacros[macroName]) {
      totalSize += getInstructionSize(macroBlock);
    }
    return totalSize;
  }

  if (block.isMacroInvoke) {
    return 0;  // INVOKE block with undefined macro
  }

  if (block.addressingMode === "implied") {
    return 1;
  }

  if (block.addressingMode === "immediate" || block.addressingMode === "zeroPage" || block.addressingMode === "zeroPageX" || block.addressingMode === "relative" || block.addressingMode === "indirectX" || block.addressingMode === "indirectY" || block.addressingMode === "zeroPageY") {
    return 2;
  }

  return 3;
}

function getProgramLayout(originOverride) {
  const parsedOrigin = parseOriginValue();
  const origin = originOverride === undefined
    ? parsedOrigin
    : {
        value: originOverride,
        text: formatAddress(originOverride),
        error: ""
      };
  let cursor = origin.value;

  // Expand user macros before calculating layout
  const expandedProgram = [];
  let insideMacroDef = false;
  let currentMacroName = null;

  for (const block of program) {
    if (block.isMacroDefStart) {
      insideMacroDef = true;
      currentMacroName = block.macroName || null;
      // Emit synthetic label so JSR macroName can resolve to the definition site
      if (currentMacroName) {
        expandedProgram.push({
          id: crypto.randomUUID(),
          isLabel: true,
          labelName: currentMacroName,
          mnemonic: "LABEL",
          addressingMode: "implied",
          base: "hex",
          operand: currentMacroName,
          rawOperand: currentMacroName,
          _syntheticMacroLabel: true,
        });
      }
      if (showMacroSource) expandedProgram.push(block);
      continue;
    }
    if (block.isMacroDefEnd) {
      insideMacroDef = false;
      currentMacroName = null;
      if (showMacroSource) expandedProgram.push(block);
      continue;
    }
    if (insideMacroDef) {
      // Emit macro body as real subroutine code at definition site (enables JSR macroName)
      expandedProgram.push({ ...block, _fromMacroDef: currentMacroName });
      continue;
    }

    // Expand INCLUDE blocks inline
    if (block.isIncludeMacro) {
      expandedProgram.push(block); // header marker, 0 bytes
      if (block.includedBlocks?.length) {
        // If an override address is set, save current address then inject synthetic ORG
        if (block.includeAddress) {
          // Save address so main program can resume correctly after the library
          expandedProgram.push({ _isSavedAddress: true, id: crypto.randomUUID() });
          const addrHex = block.includeAddress.replace(/^\$/, "").toUpperCase().padStart(4, "0");
          expandedProgram.push({
            id: crypto.randomUUID(),
            mnemonic: "ORG",
            addressingMode: "implied",
            base: "hex",
            operand: "",
            rawOperand: "",
            validationError: "",
            isOrgMacro: true,
            orgAddress: addrHex,
            _fromInclude: block.id,
            _includeFileName: block.includeFileName,
            _syntheticOrg: true
          });
        }
        // Expand included blocks, respecting MACRO/ENDM boundaries
        // Skip ORG blocks from included libraries — they have no meaning in the including program's address space
        let insideIncludedMacroDef = false;
        let includedMacroName = null;
        for (const subBlock of block.includedBlocks) {
          if (subBlock.isOrgMacro) continue;
          if (subBlock.isMacroDefStart) {
            insideIncludedMacroDef = true;
            includedMacroName = subBlock.macroName || "";
            if (block.includeAddress) {
              // Library at fixed address: macros become subroutines
              // Show source comment first (if toggled on), then synthetic label for JSR target
              if (showMacroSource) expandedProgram.push({ ...subBlock, _fromInclude: block.id });
              if (includedMacroName) {
                expandedProgram.push({
                  id: crypto.randomUUID(),
                  isLabel: true,
                  labelName: includedMacroName,
                  mnemonic: "LABEL",
                  addressingMode: "implied",
                  base: "hex",
                  operand: includedMacroName,
                  rawOperand: includedMacroName,
                  _fromInclude: block.id,
                  _syntheticMacroLabel: true
                });
              }
            } else {
              if (showMacroSource) expandedProgram.push({ ...subBlock, _fromInclude: block.id });
            }
            continue;
          }
          if (subBlock.isMacroDefEnd) {
            insideIncludedMacroDef = false;
            includedMacroName = null;
            if (showMacroSource) expandedProgram.push({ ...subBlock, _fromInclude: block.id });
            continue;
          }
          if (insideIncludedMacroDef) {
            if (block.includeAddress) {
              // Emit as actual subroutine code so JSR macroName resolves correctly
              expandedProgram.push({ ...subBlock, _fromInclude: block.id, _includeFileName: block.includeFileName, _fromLibraryMacro: includedMacroName });
            } else if (showMacroSource) {
              expandedProgram.push({ ...subBlock, _macroSourceBlock: true, _fromInclude: block.id });
            }
            continue;
          }
          expandedProgram.push({ ...subBlock, _fromInclude: block.id, _includeFileName: block.includeFileName });
        }
        // After library: restore main program address
        if (block.includeAddress) {
          expandedProgram.push({ _isRestoreAddress: true, id: crypto.randomUUID() });
        }
      }
      continue;
    }

    // Check if this block invokes a user macro (INVOKE block or legacy format)
    const macroName = block.isMacroInvoke ? block.invokeMacroName : (userMacros[block.mnemonic] ? block.mnemonic : null);

    if (macroName && userMacros[macroName]) {
      const invokeId = block.id;
      const localSuffix = "__m" + invokeId.replace(/-/g, "").slice(0, 8);
      // Collect local label names defined inside this macro body
      // Includes both explicit LABEL blocks AND loop labels (isLoopMacro.loopLabel)
      // so that LOOP/NEXT labels inside macros are uniquified per-invocation.
      const localLabels = new Set([
        ...userMacros[macroName].filter(b => b.isLabel && b.labelName).map(b => b.labelName),
        ...userMacros[macroName].filter(b => b.isLoopMacro && b.loopLabel).map(b => b.loopLabel)
      ]);
      // Helper: replace local label references in a rawOperand string
      const rewriteOperand = (raw) => {
        if (!raw || !localLabels.size) return raw;
        let result = raw;
        for (const lbl of localLabels) {
          // Match whole-word label references (not part of a longer identifier)
          const re = new RegExp(`(?<![A-Za-z0-9_])${lbl}(?![A-Za-z0-9_])`, "g");
          result = result.replace(re, lbl + localSuffix);
        }
        return result;
      };
      // Add INVOKE block as a zero-size header line for ASM view selection
      expandedProgram.push({ ...block, _isMacroInvokeHeader: true });
      // Expand the macro body inline with uniquified local labels
      for (const macroBlock of userMacros[macroName]) {
        const expanded = {
          ...macroBlock,
          id: crypto.randomUUID(),
          _fromMacro: macroName,
          _invokeBlockId: invokeId
        };
        if (macroBlock.isLabel && macroBlock.labelName && localLabels.has(macroBlock.labelName)) {
          expanded.labelName = macroBlock.labelName + localSuffix;
        }
        if (macroBlock.rawOperand) {
          expanded.rawOperand = rewriteOperand(macroBlock.rawOperand);
          expanded.operand   = rewriteOperand(macroBlock.operand);
        }
        if (macroBlock.isLoopMacro && macroBlock.loopLabel && localLabels.has(macroBlock.loopLabel)) {
          expanded.loopLabel = macroBlock.loopLabel + localSuffix;
        }
        if (macroBlock.isNextMacro && macroBlock.nextLabel && localLabels.has(macroBlock.nextLabel)) {
          expanded.nextLabel = macroBlock.nextLabel + localSuffix;
        }
        expandedProgram.push(expanded);
      }
    } else {
      expandedProgram.push(block);
    }
  }

  // Collect active defines from DEFINE blocks in the program
  const activeDefines = new Set(
    program.filter(b => b.isDefineMacro && b.defineSymbol).flatMap(b =>
      b.defineSymbol.split(",").map(s => s.trim()).filter(Boolean)
    )
  );

  // Mark blocks that are inside an inactive IF branch
  const condStack = []; // frames: { active: bool, inElse: bool }
  const skippedBlocks = new WeakSet();
  for (const block of expandedProgram) {
    if (block.isIfMacro) {
      condStack.push({ active: activeDefines.has((block.ifCondition || "").trim()), inElse: false });
    } else if (block.isElseMacro) {
      if (condStack.length > 0) condStack[condStack.length - 1].inElse = true;
    } else if (block.isEndIfMacro) {
      if (condStack.length > 0) condStack.pop();
    } else if (condStack.length > 0) {
      const skip = condStack.some(f => f.inElse ? f.active : !f.active);
      if (skip) skippedBlocks.add(block);
    }
  }

  let savedAddress = null;
  const lines = expandedProgram.map((block) => {
    let size = getInstructionSize(block);

    if (skippedBlocks.has(block)) {
      return { block, size: 0, address: cursor, end: cursor - 1, conditionallySkipped: true };
    }

    if (block._isSavedAddress) {
      savedAddress = cursor;
      return { block, size: 0, address: cursor, end: cursor - 1 };
    }

    if (block._isRestoreAddress) {
      if (savedAddress !== null) { cursor = savedAddress; savedAddress = null; }
      return { block, size: 0, address: cursor, end: cursor - 1 };
    }

    // Handle TABLE macro: set address cursor if tableAddress is present
    if (block.isTableMacro && block.tableAddress) {
      const tableAddr = parseAddressValue(block.tableAddress);
      if (typeof tableAddr === "number" && !isNaN(tableAddr)) {
        cursor = tableAddr;
      }
    }

    // Handle ORG macro: set address cursor to new origin.
    // When originOverride is set (e.g. BASIC SYS mode), don't let ORG move
    // the cursor backwards below originOverride — that would place code at the
    // wrong physical address in the output.
    if (block.isOrgMacro && block.orgAddress) {
      const orgAddr = parseAddressValue(block.orgAddress);
      if (typeof orgAddr === "number" && !isNaN(orgAddr)) {
        cursor = (originOverride !== undefined && orgAddr < originOverride) ? originOverride : orgAddr;
      }
    }

    // Handle ALIGN macro: calculate padding to next boundary
    if (block.isAlignMacro) {
      const boundary = parseNumberByBase(block.rawOperand.replace(/^\$/, ""), block.base);
      if (boundary && boundary > 0) {
        const remainder = cursor % boundary;
        size = remainder === 0 ? 0 : boundary - remainder;
      }
    }

    const address = cursor;
    cursor += size;
    return {
      block,
      size,
      address,
      end: cursor - 1
    };
  });

  return {
    origin,
    lines,
    start: origin.value,
    end: lines.length ? lines[lines.length - 1].end : origin.value - 1
  };
}

function getDeferredMemorySections(layout) {
  return layout.lines
    .map((line, index) => {
      const lineNumber = `${(index + 1).toString().padStart(2, "0")}`;

      if (line.block.isTextMacro) {
        const chars = encodeTextMacro(line.block.rawOperand);
        const startAddress = 0x0400 + ((line.block.textY ?? 0) * 40) + (line.block.textX ?? 0);
        return {
          type: "text",
          lineNumber,
          sourceAddress: line.address,
          address: startAddress,
          end: startAddress + chars.length - 1,
          bytes: chars,
          label: `TEXT "${line.block.rawOperand || ""}" -> screen (${line.block.textX ?? 0}, ${line.block.textY ?? 0})`
        };
      }

      if (line.block.isStringMacro) {
        const rawChars = encodeTextMacro(line.block.rawOperand);
        const offset = parseInt(line.block.charOffset || "0", 16);
        const chars = isNaN(offset) || offset === 0 ? rawChars : rawChars.map(b => (b + offset) & 0xFF);
        const startAddress = parseAddressValue(line.block.stringAddress) ?? 0xC000;
        return {
          type: "string",
          lineNumber,
          sourceAddress: line.address,
          address: startAddress,
          end: startAddress + chars.length - 1,
          bytes: chars,
          label: `STRING "${line.block.rawOperand || ""}" -> ${formatAddress(startAddress)}`
        };
      }

      if (line.block.isDataMacro) {
        const bytes = parseByteMacro(line.block.rawOperand, line.block.base);
        const startAddress = parseAddressValue(line.block.dataAddress) ?? 0xC000;
        return {
          type: "data",
          lineNumber,
          sourceAddress: line.address,
          address: startAddress,
          end: startAddress + bytes.length - 1,
          bytes,
          label: `DATA ${line.block.rawOperand || ""} -> ${formatAddress(startAddress)}`
        };
      }

      if (line.block.isRawBytesMacro) {
        const bytes = parseByteMacro(line.block.rawOperand, line.block.base);
        const startAddress = parseAddressValue(line.block.rawBytesAddress) ?? 0xC000;
        return {
          type: "rawbytes",
          lineNumber,
          sourceAddress: line.address,
          address: startAddress,
          end: startAddress + bytes.length - 1,
          bytes,
          label: `RAWBYTES ${line.block.rawOperand || ""} -> ${formatAddress(startAddress)}`
        };
      }

      if (line.block.isIncBinMacro) {
        const bytes = line.block.incBinBytes || [];
        const startAddress = parseAddressValue(line.block.incBinAddress) ?? 0xC000;
        return {
          type: "incbin",
          lineNumber,
          sourceAddress: line.address,
          address: startAddress,
          end: startAddress + bytes.length - 1,
          bytes: Array.from(bytes),
          label: `INCBIN "${line.block.incBinFileName || ""}" -> ${formatAddress(startAddress)}`
        };
      }

      if (line.block.isRawTextMacro) {
        const rawChars = encodeTextMacro(line.block.rawOperand);
        const offset = parseInt(line.block.charOffset || "0", 16);
        const chars = isNaN(offset) || offset === 0 ? rawChars : rawChars.map(b => (b + offset) & 0xFF);
        const startAddress = parseAddressValue(line.block.rawTextAddress) ?? 0xC000;
        return {
          type: "rawtext",
          lineNumber,
          sourceAddress: line.address,
          address: startAddress,
          end: startAddress + chars.length - 1,
          bytes: chars,
          label: `RAWTEXT "${line.block.rawOperand || ""}" -> ${formatAddress(startAddress)}`
        };
      }

      if (line.block.isPetsciiMacro) {
        const chars = encodePetsciiMacro(line.block.rawOperand);
        const startAddress = parseAddressValue(line.block.petsciiAddress) ?? 0xC000;
        return {
          type: "petscii",
          lineNumber,
          sourceAddress: line.address,
          address: startAddress,
          end: startAddress + chars.length - 1,
          bytes: chars,
          label: `PETSCII "${line.block.rawOperand || ""}" -> ${formatAddress(startAddress)}`
        };
      }

      return null;
    })
    .filter(Boolean)
    .sort((left, right) => left.address - right.address);
}

function mergeMemoryRanges(ranges) {
  if (!ranges.length) {
    return [];
  }

  const sorted = [...ranges]
    .filter((range) => Number.isFinite(range.start) && Number.isFinite(range.end) && range.end >= range.start)
    .sort((left, right) => left.start - right.start);

  if (!sorted.length) {
    return [];
  }

  const merged = [{ ...sorted[0] }];

  for (let index = 1; index < sorted.length; index += 1) {
    const current = sorted[index];
    const previous = merged[merged.length - 1];

    if (current.start <= previous.end + 1) {
      previous.end = Math.max(previous.end, current.end);
      continue;
    }

    merged.push({ ...current });
  }

  return merged;
}

function countRangeBytes(ranges, start, end) {
  return ranges.reduce((total, range) => {
    const overlapStart = Math.max(start, range.start);
    const overlapEnd = Math.min(end, range.end);
    return overlapStart <= overlapEnd ? total + (overlapEnd - overlapStart + 1) : total;
  }, 0);
}

function getMemoryUsage(layout = getProgramLayout()) {
  const occupiedRanges = [];

  if (program.length && layout.start <= layout.end) {
    occupiedRanges.push({
      start: layout.start,
      end: layout.end,
      type: "code",
      label: `Kodresz ${formatAddress(layout.start)} - ${formatAddress(layout.end)}`
    });
  }

  const deferredSections = getDeferredMemorySections(layout);
  deferredSections.forEach((section) => {
    if (!section.bytes.length) {
      return;
    }

    occupiedRanges.push({
      start: section.address,
      end: section.end,
      type: section.type,
      label: section.label
    });
  });

  const mergedOccupied = mergeMemoryRanges(occupiedRanges);
  const totalRamBytes = memorySegments
    .filter((segment) => segment.kind === "ram")
    .reduce((sum, segment) => sum + (segment.end - segment.start + 1), 0);
  const occupiedRamBytes = memorySegments
    .filter((segment) => segment.kind === "ram")
    .reduce((sum, segment) => sum + countRangeBytes(mergedOccupied, segment.start, segment.end), 0);

  return {
    layout,
    deferredSections,
    occupiedRanges,
    mergedOccupied,
    totalRamBytes,
    occupiedRamBytes,
    freeRamBytes: Math.max(0, totalRamBytes - occupiedRamBytes),
    overlaps: detectMemoryOverlaps(layout, deferredSections)
  };
}

function detectMemoryOverlaps(layout, deferredSections) {
  // Build contiguous inline code regions (split at gaps/ORG jumps)
  const codeRegions = [];
  let runStart = null;
  let runEnd = null;

  for (const line of layout.lines) {
    if (
      line.conditionallySkipped ||
      line.block._isSavedAddress ||
      line.block._isRestoreAddress ||
      line.block._isMacroInvokeHeader ||
      line.block.isRawBytesMacro ||
      line.block.isRawTextMacro ||
      line.size === 0
    ) continue;

    const blockEnd = line.address + line.size - 1;
    if (runStart === null) {
      runStart = line.address;
      runEnd = blockEnd;
    } else if (line.address <= runEnd + 1) {
      runEnd = Math.max(runEnd, blockEnd);
    } else {
      codeRegions.push({ address: runStart, end: runEnd, type: "code" });
      runStart = line.address;
      runEnd = blockEnd;
    }
  }
  if (runStart !== null) {
    codeRegions.push({ address: runStart, end: runEnd, type: "code" });
  }

  const labeledCode = codeRegions.map(r => ({
    ...r,
    label: `${t("memoryOverlapCode")} ${formatAddress(r.address)}\u2013${formatAddress(r.end)}`
  }));

  const deferredRegions = deferredSections
    .filter(s => s.bytes.length > 0)
    .map(s => ({ address: s.address, end: s.end, type: s.type, label: s.label }));

  const allRegions = [...labeledCode, ...deferredRegions];

  const overlaps = [];
  for (let i = 0; i < allRegions.length; i++) {
    for (let j = i + 1; j < allRegions.length; j++) {
      const a = allRegions[i];
      const b = allRegions[j];
      const overlapStart = Math.max(a.address, b.address);
      const overlapEnd = Math.min(a.end, b.end);
      if (overlapStart <= overlapEnd) {
        overlaps.push({
          regionA: a,
          regionB: b,
          overlapStart,
          overlapEnd,
          bytes: overlapEnd - overlapStart + 1
        });
      }
    }
  }
  return overlaps;
}

function escapeHtmlAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildMemoryStripMarkup(usage) {
  const totalBytes = 0x10000;

  const segmentMarkup = memorySegments.map((segment) => {
    const percent = ((segment.end - segment.start + 1) / totalBytes) * 100;
    const usedBytes = countRangeBytes(usage.mergedOccupied, segment.start, segment.end);
    const label = usedBytes > 0
      ? `${getMemorySegmentLabel(segment)}: ${formatAddress(segment.start)} - ${formatAddress(segment.end)} | ${t("memoryOccupied")} ${usedBytes} byte`
      : `${getMemorySegmentLabel(segment)}: ${formatAddress(segment.start)} - ${formatAddress(segment.end)}`;

    return `<div class="memory-strip-segment is-${segment.kind}" style="width:${percent}%;" title="${escapeHtmlAttribute(label)}"></div>`;
  }).join("");

  const overlayMarkup = usage.mergedOccupied.map((range) => {
    const left = (range.start / totalBytes) * 100;
    const width = ((range.end - range.start + 1) / totalBytes) * 100;
    return `<div class="memory-strip-overlay" style="left:${left}%;width:${width}%;" title="${escapeHtmlAttribute(range.label)}"></div>`;
  }).join("");

  const overlapMarkup = (usage.overlaps || []).map((ov) => {
    const left = (ov.overlapStart / totalBytes) * 100;
    const width = (ov.bytes / totalBytes) * 100;
    const title = `\u26a0 ${ov.bytes} ${t("memoryOverlapBytes")}: ${ov.regionA.label} \u2194 ${ov.regionB.label}`;
    return `<div class="memory-strip-collision" style="left:${Math.max(0, left)}%;width:${Math.max(0.2, width)}%;" title="${escapeHtmlAttribute(title)}"></div>`;
  }).join("");

  return `
    <div class="memory-strip-track">
      <div class="memory-strip-base">${segmentMarkup}</div>
      <div class="memory-strip-overlays">${overlayMarkup}</div>
      ${overlapMarkup ? `<div class="memory-strip-collisions">${overlapMarkup}</div>` : ""}
    </div>
    <div class="memory-strip-axis">
      <span>$0000</span>
      <span>$FFFF</span>
    </div>
  `;
}

function renderMemoryStrip(precomputedUsage) {
  const usage = precomputedUsage || getMemoryUsage();
  const markup = buildMemoryStripMarkup(usage);

  if (!memoryStrip || !memoryStripTop) {
    return;
  }
  memoryStripTop.innerHTML = markup;
  memoryStrip.innerHTML = markup;
}

function renderMemoryMap(precomputedUsage) {
  const usage = precomputedUsage || getMemoryUsage();
  const layout = usage.layout;
  memoryMap.innerHTML = "";

  // Update the badge on the collapsed summary bar
  if (memoryOverlapBadge) {
    if (usage.overlaps.length > 0) {
      memoryOverlapBadge.textContent = `\u26a0 ${usage.overlaps.length} ${usage.overlaps.length === 1 ? t("memoryOverlapSingle") : t("memoryOverlapMultiple")}`;
      memoryOverlapBadge.removeAttribute("hidden");
    } else {
      memoryOverlapBadge.setAttribute("hidden", "");
    }
  }

  // Overlap warning panel
  if (usage.overlaps.length > 0) {
    const overlapNode = document.createElement("details");
    overlapNode.className = "memory-segment memory-overlap-panel";
    overlapNode.open = true;
    const count = usage.overlaps.length;
    const countLabel = `${count} ${count === 1 ? t("memoryOverlapSingle") : t("memoryOverlapMultiple")}`;
    const rows = usage.overlaps.map(ov =>
      `<li class="memory-overlap-item">
        <span class="memory-overlap-zone">${formatAddress(ov.overlapStart)}\u2013${formatAddress(ov.overlapEnd)}&nbsp;(${ov.bytes}&nbsp;byte)</span>
        <span class="memory-overlap-parties">${escapeHtmlAttribute(ov.regionA.label)} \u2194 ${escapeHtmlAttribute(ov.regionB.label)}</span>
      </li>`
    ).join("");
    overlapNode.innerHTML = `
      <summary class="memory-meta is-overlap">
        <span class="memory-title-group">
          <strong>\u26a0\ufe0f ${t("memoryOverlapTitle")}</strong>
          <small>${countLabel}</small>
        </span>
        <span class="memory-summary-side">
          <small class="error-text">${t("memoryOverlapWarning")}</small>
          <span class="memory-toggle-icon" aria-hidden="true"></span>
        </span>
      </summary>
      <div class="memory-content">
        <ul class="memory-overlap-list">${rows}</ul>
      </div>`;
    memoryMap.appendChild(overlapNode);
  }

  memorySegments.forEach((segment) => {
    const segmentNode = document.createElement("details");
    segmentNode.className = "memory-segment";

    const segmentSize = segment.end - segment.start + 1;
    const overlap = countRangeBytes(usage.mergedOccupied, segment.start, segment.end);
    const usagePercent = Math.max(0, Math.min(100, (overlap / segmentSize) * 100));
    const freeBytes = segment.kind === "ram" ? Math.max(0, segmentSize - overlap) : 0;

    const barClass = overlap > 0 ? "memory-bar has-program" : "memory-bar";
    const warning = overlap > 0 && isRomOrIoSegment(segment) ? `<small class="error-text">${t("memorySensitive")}</small>` : "";
      const statusLabel = overlap > 0 ? `${overlap} byte ${t("memoryOccupied")}` : segment.kind === "ram" ? t("memorySegmentStatusFree") : segment.kind.toUpperCase();
      segmentNode.open = overlap > 0;

    const segmentRanges = usage.mergedOccupied
      .filter((range) => range.end >= segment.start && range.start <= segment.end)
      .map((range) => `${formatAddress(Math.max(range.start, segment.start))} - ${formatAddress(Math.min(range.end, segment.end))}`)
      .join(", ");

      segmentNode.innerHTML = `
        <summary class="memory-meta is-${segment.kind}">
          <span class="memory-title-group">
            <strong>${getMemorySegmentLabel(segment)}</strong>
            <small>${formatAddress(segment.start)} - ${formatAddress(segment.end)}</small>
          </span>
        <span class="memory-summary-side">
          <small>${statusLabel}</small>
          <span class="memory-toggle-icon" aria-hidden="true"></span>
        </span>
      </summary>
        <div class="memory-content">
          <div class="${barClass}">
            <div class="memory-bar-fill" style="width:${usagePercent}%"></div>
          </div>
          <p>${getMemorySegmentNote(segment)}</p>
          ${overlap > 0 ? `<small>${t("memoryUsedRange")}: ${segmentRanges} (${overlap} byte)</small>` : `<small>${segment.kind === "ram" ? `${t("memoryFreeInSegment")}: ${freeBytes} byte` : t("memoryNoUsage")}</small>`}
          ${warning}
        </div>
      `;

    memoryMap.appendChild(segmentNode);
  });

  renderMemoryStrip(usage);
}

function isRomOrIoSegment(segment) {
  return segment.kind === "rom" || segment.kind === "io";
}

function getBlockDescription(block) {
  if (block.isAnonymousLabel) {
    return currentLanguage === "en" ? "Anonymous local label (-)" : "Nevtelen helyi cimke (-)";
  }

  if (block.isLabel) {
    return `${currentLanguage === "en" ? "Label" : "Label"}: ${block.labelName || "start"}`;
  }

  if (block.isComment) {
    return `${currentLanguage === "en" ? "Comment" : "Komment"}: ${block.rawOperand || ""}`;
  }

  if (block.isTextMacro) {
    return block.validationError || `${currentLanguage === "en" ? "TEXT macro" : "TEXT makro"}: "${block.rawOperand || ""}" @ (${block.textX ?? 0}, ${block.textY ?? 0})`;
  }

  if (block.isByteMacro) {
    return block.validationError || `${currentLanguage === "en" ? "BYTE macro" : "BYTE makro"}: ${block.rawOperand || ""}`;
  }

  if (block.isStringMacro) {
    const offsetNote = (() => { const v = parseInt(block.charOffset || "0", 16); return (!isNaN(v) && v !== 0) ? ` (+$${v.toString(16).toUpperCase().padStart(2,"0")} ${currentLanguage === "en" ? "added to each char" : "hozzaadva minden karakterhez"})` : ""; })();
    return block.validationError || `${currentLanguage === "en" ? "STRING macro" : "STRING makro"}: "${block.rawOperand || ""}" @ ${block.stringAddress || "C000"}${offsetNote}`;
  }

  if (block.isDataMacro) {
    return block.validationError || `${currentLanguage === "en" ? "DATA macro" : "DATA makro"}: ${block.rawOperand || ""} @ ${block.dataAddress || "C000"}`;
  }

  if (block.isRawBytesMacro) {
    return block.validationError || `${currentLanguage === "en" ? "RAWBYTES macro" : "RAWBYTES makro"}: ${block.rawOperand || ""} @ ${block.rawBytesAddress || "C000"}`;
  }

  if (block.isIncBinMacro) {
    const size = (block.incBinBytes || []).length;
    const name = block.incBinFileName || (currentLanguage === "en" ? "no file" : "nincs fajl");
    return block.validationError || `${currentLanguage === "en" ? "INCBIN macro" : "INCBIN makro"}: "${name}" (${size} bytes) @ ${block.incBinAddress || "$C000"}`;
  }

  if (block.isIncludeMacro) {
    const count = (block.includedBlocks || []).length;
    const name = block.includeFileName || (currentLanguage === "en" ? "no file" : "nincs fajl");
    const addrNote = block.includeAddress ? ` @ $${block.includeAddress.replace(/^\$/, "").toUpperCase().padStart(4, "0")}` : "";
    return block.validationError || `${currentLanguage === "en" ? "INCLUDE" : "INCLUDE"}: "${name}" (${count} ${t("includeBlocksCount")})${addrNote}`;
  }

  if (block.isRawTextMacro) {
    const offsetNote = (() => { const v = parseInt(block.charOffset || "0", 16); return (!isNaN(v) && v !== 0) ? ` (+$${v.toString(16).toUpperCase().padStart(2,"0")} ${currentLanguage === "en" ? "added to each char" : "hozzaadva minden karakterhez"})` : ""; })();
    return block.validationError || `${currentLanguage === "en" ? "RAWTEXT macro" : "RAWTEXT makro"}: "${block.rawOperand || ""}" @ ${block.rawTextAddress || "C000"}${offsetNote}`;
  }

  if (block.isPetsciiMacro) {
    return block.validationError || `${currentLanguage === "en" ? "PETSCII macro" : "PETSCII makro"}: "${block.rawOperand || ""}" @ ${block.petsciiAddress || "C000"}`;
  }

  if (block.isWordMacro) {
    return block.validationError || `${currentLanguage === "en" ? "WORD macro" : "WORD makro"}: ${block.rawOperand || ""}`;
  }

  if (block.isFillMacro) {
    return block.validationError || `${currentLanguage === "en" ? "FILL macro" : "FILL makro"}: ${block.rawOperand || ""}`;
  }

  if (block.isAlignMacro) {
    return block.validationError || `${currentLanguage === "en" ? "ALIGN macro" : "ALIGN makro"}: ${block.rawOperand || ""}`;
  }

  if (block.isTableMacro) {
    return block.validationError || `${currentLanguage === "en" ? "TABLE" : "TABLA"}: ${block.tableName || "?"} @ ${block.tableAddress || "C000"}`;
  }

  if (block.isOrgMacro) {
    return `*= $${(block.orgAddress || "0900").toUpperCase()}`;
  }

  if (block.isDefineMacro) {
    return block.validationError || `DEFINE: ${block.defineSymbol || "?"}`;
  }

  if (block.isConstMacro) {
    const constVal = parseNumberByBase((block.rawOperand || "").replace(/^\$/, ""), block.base);
    const formatted = constVal !== null ? formatOperand("absolute", constVal, block.base) : "?";
    return block.validationError || `CONST: ${block.constName || "?"} = ${formatted}`;
  }

  if (block.isIfMacro) {
    return block.validationError || `${currentLanguage === "en" ? "IF" : "HA"}: ${block.ifCondition || "?"}`;
  }

  if (block.isElseMacro) {
    return currentLanguage === "en" ? "ELSE" : "KULONBEN";
  }

  if (block.isEndIfMacro) {
    return currentLanguage === "en" ? "ENDIF" : "HA_VEGE";
  }

  if (block.isMacroInvoke) {
    const name = block.invokeMacroName || "?";
    if (userMacros[name]) {
      const bodyCount = userMacros[name].length;
      return currentLanguage === "en"
        ? `Invokes user-defined macro "${name}" (${bodyCount} instruction${bodyCount !== 1 ? 's' : ''})`
        : `Felhasználói makró "${name}" hívása (${bodyCount} utasítás)`;
    }
    return currentLanguage === "en" ? `Invoke macro "${name}" (not defined yet)` : `Makró "${name}" hívása (még nincs definiálva)`;
  }

  if (block.isRegionMacro) {
    return currentLanguage === "en" ? `Region: ${block.regionName || "region"}` : `Régió: ${block.regionName || "region"}`;
  }
  if (block.isEndRegionMacro) {
    return currentLanguage === "en" ? "End of region" : "Régió vége";
  }

  // Check if this block invokes a user macro (legacy format)
  if (userMacros[block.mnemonic]) {
    const bodyCount = userMacros[block.mnemonic].length;
    return currentLanguage === "en"
      ? `Invokes user-defined macro "${block.mnemonic}" (${bodyCount} instruction${bodyCount !== 1 ? 's' : ''})`
      : `Felhasználói makró "${block.mnemonic}" hívása (${bodyCount} utasítás)`;
  }

  return block.validationError || (currentLanguage === "en"
    ? mnemonicDescriptionsEn[block.mnemonic] || block.description
    : mnemonicDescriptionsHu[block.mnemonic] || block.description);
}

function getBlockModeCaption(block) {
  if (block.isComment) {
    return `${getCategoryLabel(block.category)} | ${currentLanguage === "en" ? "comment" : "komment"}`;
  }

  if (block.isTextMacro) {
    return `${currentLanguage === "en" ? "Screen" : "Kepernyo"} | X:${block.textX ?? 0} Y:${block.textY ?? 0}`;
  }

  if (block.isByteMacro) {
    return currentLanguage === "en" ? "Byte array | current address" : "Byte tomb | aktualis cim";
  }

  if (block.isStringMacro) {
    const off = parseInt(block.charOffset || "0", 16);
    const offNote = (!isNaN(off) && off !== 0) ? ` +$${off.toString(16).toUpperCase().padStart(2,"0")}` : "";
    return `${currentLanguage === "en" ? "Screen code" : "Kepernyo kod"} | ${block.stringAddress || "C000"}${offNote}`;
  }

  if (block.isDataMacro) {
    return `${currentLanguage === "en" ? "Memory" : "Memoria"} | ${block.dataAddress || "C000"}`;
  }

  if (block.isRawBytesMacro) {
    return `${currentLanguage === "en" ? "Raw bytes @ mem" : "Nyers byte @ mem"} | ${block.rawBytesAddress || "C000"}`;
  }

  if (block.isRawTextMacro) {
    const off = parseInt(block.charOffset || "0", 16);
    const offNote = (!isNaN(off) && off !== 0) ? ` +$${off.toString(16).toUpperCase().padStart(2,"0")}` : "";
    return `${currentLanguage === "en" ? "Screen codes @ mem" : "Kepernyo kod @ mem"} | ${block.rawTextAddress || "C000"}${offNote}`;
  }

  if (block.isPetsciiMacro) {
    return `PETSCII @ ${block.petsciiAddress || "C000"}`;
  }

  if (block.isIncBinMacro) {
    const size = (block.incBinBytes || []).length;
    return `${currentLanguage === "en" ? "Binary file @ memory" : "Binarfajl @ memoria"} | ${block.incBinAddress || "$C000"} (${size} bytes)`;
  }

  if (block.isIncludeMacro) {
    const count = (block.includedBlocks || []).length;
    return `${currentLanguage === "en" ? "Included project" : "Beillesztett projekt"} | ${count} ${t("includeBlocksCount")}`;
  }

  if (block.isWordMacro) {
    return currentLanguage === "en" ? "16-bit values | LO/HI pairs" : "16-bites ertekek | LO/HI parok";
  }

  if (block.isFillMacro) {
    return currentLanguage === "en" ? "Fill | repeated bytes" : "Toltes | ismetlodo byte-ok";
  }

  if (block.isAlignMacro) {
    const boundary = block.rawOperand || "?";
    return currentLanguage === "en" ? `Align | boundary: ${boundary}` : `Igazitas | hatar: ${boundary}`;
  }

  if (block.isTableMacro) {
    return `${currentLanguage === "en" ? "Lookup table" : "Kereso tabla"} | ${block.tableAddress || "C000"}`;
  }

  if (block.isOrgMacro) {
    return `${currentLanguage === "en" ? "Origin" : "Forditasi cim"} | $${(block.orgAddress || "0900").toUpperCase()}`;
  }

  if (block.isDefineMacro) {
    return currentLanguage === "en" ? "Conditional | DEFINE" : "Felteteles | DEFINE";
  }

  if (block.isConstMacro) {
    return currentLanguage === "en" ? "Macro | Const" : "Makro | Const";
  }

  if (block.isIfMacro) {
    return currentLanguage === "en" ? "Conditional | IF" : "Felteteles | HA";
  }

  if (block.isElseMacro) {
    return currentLanguage === "en" ? "Conditional | ELSE" : "Felteteles | KULONBEN";
  }

  if (block.isEndIfMacro) {
    return currentLanguage === "en" ? "Conditional | ENDIF" : "Felteteles | HA_VEGE";
  }

  if (block.isPushMacro) {
    const regs = block.pushRegs || "A";
    return currentLanguage === "en" ? `Stack | Push ${regs}` : `Stack | Ment ${regs}`;
  }

  if (block.isPullMacro) {
    const regs = block.pullRegs || "A";
    return currentLanguage === "en" ? `Stack | Pull ${regs}` : `Stack | Visszatolt ${regs}`;
  }

  if (block.isMacroDefStart) {
    return currentLanguage === "en" ? "User Macro | Definition" : "Felhasznaloi Makro | Definicio";
  }

  if (block.isMacroDefEnd) {
    return currentLanguage === "en" ? "User Macro | End" : "Felhasznaloi Makro | Vege";
  }

  if (block.isMacroInvoke) {
    return currentLanguage === "en" ? "User Macro | Invoke" : "Felhasznaloi Makro | Hivas";
  }

  if (block.isRegionMacro) {
    return currentLanguage === "en" ? "Structure | Region" : "Szerkezet | Régió";
  }

  if (block.isEndRegionMacro) {
    return currentLanguage === "en" ? "Structure | End Region" : "Szerkezet | Régió vége";
  }

  if (block.isAnonymousLabel) {
    return getCategoryLabel(block.category);
  }

  // Check if this block invokes a user macro (legacy format)
  if (userMacros[block.mnemonic]) {
    return currentLanguage === "en" ? "User Macro | Invoke" : "Felhasznaloi Makro | Hivas";
  }

  if (block.isLabel) {
    return `${getCategoryLabel(block.category)} | label`;
  }

  if (getMnemonicModes(block.mnemonic).length <= 1) {
    return getCategoryLabel(block.category);
  }

  return `${getCategoryLabel(block.category)} | ${modeText(block.addressingMode, "label")}`;
}

function renderBlockPreview(index) {
  const block = program[index];
  const node = programList.querySelector(`.asm-block[data-index="${index}"]`);

  if (!block || !node) {
    return;
  }

  // Keep stored validationError in sync for regular instruction blocks
  if (opcodeMap[block.mnemonic] && block.addressingMode) {
    const preview = buildOperandPreview(block.addressingMode, block.rawOperand || "", block.base || "hex");
    block.validationError = preview.error;
    block.operand = preview.operand || block.operand;
  }

  node.querySelector(".collapsed-operand").textContent = getCollapsedOperandText(block);
  node.querySelector(".block-category").textContent = getBlockModeCaption(block);
  const descText = getBlockDescription(block);
  node.querySelector(".block-description-label").textContent = "";
  node.querySelector(".block-description").textContent = descText;
}

function getCategoryTone(category) {
  const normalized = (category || "").toLowerCase();
  if (normalized.includes("adatmozgas")) {
    return "data";
  }
  if (normalized.includes("aritmetika") || normalized.includes("logika") || normalized.includes("shiftesrotate")) {
    return "math";
  }
  if (normalized.includes("ugras")) {
    return "jump";
  }
  if (normalized.includes("rendszer")) {
    return "system";
  }
  if (normalized.includes("regiszter")) {
    return "register";
  }
  if (normalized.includes("stack")) {
    return "stack";
  }
  if (normalized.includes("makro")) {
    return "macro";
  }
  if (normalized.includes("illegalis")) {
    return "illegal";
  }
  if (normalized.includes("szerkezet")) {
    return "structure";
  }
  return "default";
}

function getCollapsedOperandText(block) {
  if (block.isAnonymousLabel) {
    return "-";
  }

  if (block.isLabel) {
    return block.labelName ? `${block.labelName}:` : "";
  }

  if (block.isComment) {
    return block.rawOperand ? `; ${block.rawOperand}` : "";
  }

  if (block.isTextMacro) {
    return block.rawOperand ? `"${block.rawOperand}"` : "";
  }

  if (block.isByteMacro) {
    if (!block.rawOperand) return "";
    const parts = block.rawOperand.split(",").map(s => s.trim()).filter(Boolean);
    if (parts.length <= 6) return block.rawOperand;
    return parts.slice(0, 6).join(", ") + " \u2026";
  }

  if (block.isStringMacro) {
    return block.rawOperand ? `"${block.rawOperand}"` : "";
  }

  if (block.isDataMacro) {
    if (!block.rawOperand) return "";
    const parts = block.rawOperand.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length <= 6) return block.rawOperand;
    return parts.slice(0, 6).join(", ") + " …";
  }

  if (block.isRawBytesMacro) {
    if (!block.rawOperand) return "";
    const parts = block.rawOperand.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length <= 6) return block.rawOperand;
    return parts.slice(0, 6).join(", ") + " …";
  }

  if (block.isIncBinMacro) {
    const size = (block.incBinBytes || []).length;
    if (block.incBinFileName) return `"${block.incBinFileName}" (${size} bytes)`;
    return currentLanguage === "en" ? "no file" : "nincs fajl";
  }

  if (block.isSidMacro) {
    const size = (block.sidBytes || []).length;
    if (block.sidFileName) return `"${block.sidFileName}"${size ? ` (${size} bytes)` : ""}`;
    return currentLanguage === "en" ? "no file" : "nincs fajl";
  }

  if (block.isIncludeMacro) {
    const count = (block.includedBlocks || []).length;
    if (block.includeFileName) return `"${block.includeFileName}" (${count} ${t("includeBlocksCount")})`;
    return currentLanguage === "en" ? "no file" : "nincs fajl";
  }

  if (block.isRawTextMacro) {
    return block.rawOperand ? `"${block.rawOperand}"` : "";
  }

  if (block.isPetsciiMacro) {
    return block.rawOperand ? `"${block.rawOperand}"` : "";
  }

  if (block.isJoystickMacro) {
    return `port${block.joyPort || "2"} → sprite#${block.joySpriteNum || "0"}`;
  }

  if (block.isMouseMacro) {
    const zpX = (block.mousePotXZP || "FD").toUpperCase();
    const zpY = (block.mousePotYZP || "FE").toUpperCase();
    return `port${block.mousePort || "2"} → sprite#${block.mouseSpriteNum || "0"} ZP:$${zpX}/$${zpY}`;
  }

  if (block.isWaitRasterMacro) {
    const rl = (block.rasterLine || "FF").replace(/^\$/, "").toUpperCase().padStart(2, "0");
    return `$D012 = $${rl}`;
  }

  if (block.isTurboSetMacro) {
    const spd = parseInt(block.turboSpeed || "7", 10);
    const badlineLabel = block.turboBadline === "1"
      ? (currentLanguage === "en" ? "badline off" : "badline ki")
      : (currentLanguage === "en" ? "badline on" : "badline be");
    return `$D031 = spd${spd} ${badlineLabel}`;
  }

  if (block.isSuperCpuDetectMacro) {
    return currentLanguage === "en" ? "$D0B8 vs $FF" : "$D0B8 vs $FF";
  }

  if (block.isTurboEnableMacro) {
    const mode = (block.turboEnableMode || "on") === "on"
      ? (currentLanguage === "en" ? "ON" : "BE")
      : (currentLanguage === "en" ? "OFF" : "KI");
    return `$D07${(block.turboEnableMode || "on") === "on" ? "A" : "B"} (${mode})`;
  }

  if (block.isSpriteColMacro) {
    const typeLabel = (block.colType || "sprite") === "background"
      ? (currentLanguage === "en" ? "bg" : "hatter")
      : (currentLanguage === "en" ? "spr" : "sprite");
    return `#${block.spriteNum || "0"} ${typeLabel} → BEQ/BNE`;
  }

  if (block.isReuCheckMacro) {
    return currentLanguage === "en" ? "probe $DF04 with $55/$AA" : "$DF04 proba $55/$AA mintaval";
  }

  if (block.isReuTransferMacro) {
    const cmd = block.mnemonic === "REU_STASH" ? "$90" : block.mnemonic === "REU_FETCH" ? "$91" : "$92";
    const c64 = (block.reuC64Addr || "C000").replace(/^\$/, "").toUpperCase();
    const exp = (block.reuExpAddr || "0000").replace(/^\$/, "").toUpperCase();
    const bank = block.reuBank || "0";
    const len = (block.reuLength || "0100").replace(/^\$/, "").toUpperCase();
    return `$${c64} ↔ REU${bank}:$${exp} len=$${len} [${cmd}]`;
  }

  if (block.isSpriteInitMacro) {
    const pageHex = (block.spriteDataPage || "21").replace(/^\$/, "").toUpperCase().padStart(2, "0");
    return `#${block.spriteNum || "0"} col=${block.spriteColor || "7"} page=$${pageHex}`;
  }

  if (block.isLoadFileMacro) {
    const fname = (block.loadFileName || "").trim();
    const dev = block.loadFileDevice || "8";
    const addr = (block.loadFileAddress || "").trim();
    const errLbl = (block.loadFileErrorLabel || "").trim();
    const addrPart = addr ? ` @$${addr.replace(/^\$/, "").toUpperCase()}` : "";
    const errPart = errLbl ? ` ⚠${errLbl}` : "";
    return `"${fname || "?"}" dev=${dev}${addrPart}${errPart}`;
  }

  if (block.isSpritePosMacro) {
    return `#${block.spriteNum || "0"} X=${block.spriteX || "152"} Y=${block.spriteY || "100"}`;
  }

  if (block.isLoopMacro) {
    const reg = block.loopReg || "X";
    let countDisplay = "";
    if (block.loopCount) {
      const rawCount = block.loopCount.trim();
      const parsed = /^\d+$/.test(rawCount) ? parseInt(rawCount, 10) : parseInt(rawCount, 16);
      countDisplay = isNaN(parsed) ? rawCount : `#$${parsed.toString(16).toUpperCase().padStart(2, "0")}`;
    }
    const label = block.loopLabel || "";
    return `${reg} ${countDisplay}${label ? ` → ${label}` : ""}`.trim();
  }

  if (block.isNextMacro) {
    return block.nextLabel ? `→ ${block.nextLabel}` : "";
  }

  if (block.isForMacro) {
    const reg = block.loopReg || "X";
    let countDisplay = "";
    if (block.loopCount) {
      const rawCount = block.loopCount.trim();
      const parsed = /^\d+$/.test(rawCount) ? parseInt(rawCount, 10) : parseInt(rawCount, 16);
      countDisplay = isNaN(parsed) ? rawCount : `#$${parsed.toString(16).toUpperCase().padStart(2, "0")}`;
    }
    const label = block.loopLabel || "";
    return `${reg} 0..${countDisplay}${label ? ` → ${label}` : ""}`.trim();
  }

  if (block.isEndfMacro) {
    return block.nextLabel ? `↑ ${block.nextLabel}` : "";
  }

  if (block.isPushMacro) {
    return block.pushRegs ? `${block.pushRegs}` : "A";
  }

  if (block.isPullMacro) {
    return block.pullRegs ? `${block.pullRegs}` : "A";
  }

  if (block.isWordMacro) {
    if (!block.rawOperand) return "";
    const parts = block.rawOperand.split(",").map(s => s.trim()).filter(Boolean);
    if (parts.length <= 4) return block.rawOperand;
    return parts.slice(0, 4).join(", ") + " …";
  }

  if (block.isFillMacro) {
    return block.rawOperand || "";
  }

  if (block.isAlignMacro) {
    return block.rawOperand || "";
  }

  if (block.isTableMacro) {
    return `${block.tableName || "?"} @ ${block.tableAddress || "C000"}`;
  }

  if (block.isOrgMacro) {
    return `*= $${(block.orgAddress || "0900").toUpperCase()}`;
  }

  if (block.isDefineMacro) {
    return block.defineSymbol || "?";
  }

  if (block.isConstMacro) {
    const constVal = parseNumberByBase((block.rawOperand || "").replace(/^\$/, ""), block.base);
    const formatted = constVal !== null ? formatOperand("absolute", constVal, block.base) : "?";
    return `${block.constName || "?"} = ${formatted}`;
  }

  if (block.isIfMacro) {
    return block.ifCondition || "?";
  }

  if (block.isElseMacro || block.isEndIfMacro) {
    return "";
  }

  if (block.isMacroDefStart) {
    return block.macroName || "?";
  }

  if (block.isMacroDefEnd) {
    return "";
  }

  if (block.isMacroInvoke) {
    return block.invokeMacroName ? `→ ${block.invokeMacroName}` : "";
  }

  if (block.isRegionMacro) return block.regionName || "region";
  if (block.isEndRegionMacro) return "";

  return block.operand || block.rawOperand || "";
}

function renderProgram() {
  renderOriginPreview();
  if (!program.length) {
    programList.innerHTML = `<div class="empty-state">${t("emptyState")}</div>`;
    renderAsmOutput();
    renderMemoryMap();
    return;
  }

  document.querySelectorAll(".label-picker-dropdown").forEach(el => el.remove());
  programList.innerHTML = "";

  // Pre-pass: which blocks are children of a collapsed group (hidden from view)
  const hiddenByGroup = new Set();
  const regionStack = []; // stack of REGION block indices
  for (let i = 0; i < program.length; i++) {
    const anyAncestorCollapsed = regionStack.some(idx => program[idx].regionCollapsed);
    if (program[i].isRegionMacro) {
      if (anyAncestorCollapsed) hiddenByGroup.add(i);
      regionStack.push(i);
    } else if (program[i].isEndRegionMacro) {
      if (anyAncestorCollapsed) hiddenByGroup.add(i);
      regionStack.pop();
    } else {
      if (anyAncestorCollapsed) hiddenByGroup.add(i);
    }
  }

  const wrapperStack = []; // stack of region-wrapper divs (null = collapsed/hidden region)
  const activeWrapper = () => {
    for (let i = wrapperStack.length - 1; i >= 0; i--) {
      if (wrapperStack[i]) return wrapperStack[i];
    }
    return null;
  };

    program.forEach((block, index) => {
      const isHidden = hiddenByGroup.has(index);

      // Maintain wrapperStack for REGION/ENDREGION even when hidden
      // For REGION: create wrapper now but append it AFTER the REGION node (late phase)
      let pendingWrapper = null;
      if (block.isRegionMacro) {
        if (!isHidden && !block.regionCollapsed) {
          pendingWrapper = document.createElement("div");
          pendingWrapper.className = "region-wrapper";
          wrapperStack.push(pendingWrapper); // push but don't append yet
        } else {
          wrapperStack.push(null);
        }
      } else if (block.isEndRegionMacro) {
        wrapperStack.pop();
      }

      // Skip hidden blocks (node not created/appended)
      if (isHidden) return;

      const node = blockTemplate.content.firstElementChild.cloneNode(true);
      node.dataset.index = index;
      node.dataset.blockId = block.id;
      node.dataset.categoryTone = getCategoryTone(block.category);
      node.dataset.collapsed = block.collapsed ? "true" : "false";
      if (block.isConstMacro) node.dataset.macroKind = "const";
      if (block.isRegionMacro) node.classList.add("region-header");
      if (block.isEndRegionMacro) node.classList.add("region-endblock");

      const bpBtn = node.querySelector(".bp-toggle");
      if (bpBtn) {
        const bpAllowed = !block.isOrgMacro && !block.isRegionMacro && !block.isEndRegionMacro
          && !block.isComment && !block.isConstMacro && !block.isDefineMacro
          && !block.isIfMacro && !block.isElseMacro && !block.isEndIfMacro
          && !block.isMacroDefStart && !block.isMacroDefEnd && !block.isIncludeMacro;
        if (!bpAllowed) {
          bpBtn.hidden = true;
        } else {
          bpBtn.classList.toggle("bp-active", !!block.isBreakpoint);
          bpBtn.setAttribute("aria-label", t("breakpointToggle"));
          bpBtn.setAttribute("title", t("breakpointToggle"));
          bpBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            block.isBreakpoint = !block.isBreakpoint;
            bpBtn.classList.toggle("bp-active", block.isBreakpoint);
          });
        }
      }

      node.querySelector(".block-mnemonic").textContent = block.mnemonic;
      node.querySelector(".collapsed-operand").textContent = getCollapsedOperandText(block);
      node.querySelector(".block-category").textContent = getBlockModeCaption(block);
      const blockDescText = getBlockDescription(block);
      node.querySelector(".block-description-label").textContent = "";
      node.querySelector(".block-description").textContent = blockDescText;

      const mode = addressingModes[block.addressingMode];
      const blockControls = node.querySelector(".block-controls");
      const inlineField = node.querySelector(".inline-field");
      const operandField = node.querySelector(".block-operand");
      const collapseToggle = node.querySelector(".collapse-toggle");
      const dragHandle = node.querySelector(".drag-handle");
      const groupIsCollapsed = block.isRegionMacro ? (block.regionCollapsed || false) : block.collapsed;
      collapseToggle.textContent = groupIsCollapsed ? "\u25B8" : "\u25BE";
      collapseToggle.setAttribute("aria-label", groupIsCollapsed ? t("expand") : t("collapse"));
      collapseToggle.setAttribute("title", groupIsCollapsed ? t("expand") : t("collapse"));
      dragHandle.setAttribute("title", t("dragBlock"));
      if (block.isRegionMacro) {
        collapseToggle.addEventListener("click", () => toggleRegionCollapsed(index));
      } else {
        collapseToggle.addEventListener("click", () => toggleBlockCollapsed(index));
      }

      if (block.isAnonymousLabel) {
        inlineField.hidden = false;
        inlineField.querySelector("span").textContent = "-";
        operandField.value = "-";
        operandField.disabled = true;
      } else if (block.isLabel) {
        inlineField.hidden = false;
        inlineField.querySelector("span").textContent = "Label";
        operandField.value = block.labelName || "";
        operandField.disabled = false;
        operandField.placeholder = currentLanguage === "en" ? "for example start_loop" : "peldaul start_loop";
        operandField.addEventListener("input", (event) => updateProgramBlock(index, "labelName", event.target.value));
      } else if (block.isComment) {
        inlineField.hidden = false;
        inlineField.querySelector("span").textContent = t("fieldComment");
        operandField.value = block.rawOperand || "";
        operandField.disabled = false;
        operandField.placeholder = currentLanguage === "en" ? "For example border scroll demo" : "Peldaul border scroll demo";
        operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
      } else if (block.isTextMacro) {
        inlineField.hidden = false;
        inlineField.querySelector("span").textContent = t("fieldText");
        operandField.value = block.rawOperand || "";
        operandField.disabled = false;
        operandField.placeholder = currentLanguage === "en" ? "For example HELLO C64" : "Peldaul HELLO C64";
        operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
        blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid">
            <label class="mini-field">
              <span>X</span>
              <input class="macro-x" type="number" min="0" max="39" value="${block.textX ?? 0}">
            </label>
            <label class="mini-field">
              <span>Y</span>
              <input class="macro-y" type="number" min="0" max="24" value="${block.textY ?? 0}">
            </label>
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "Label (optional)" : "Label (opcionális)"}</span>
              <input class="macro-label" type="text" value="${block.macroLabel || ""}" placeholder="${currentLanguage === "en" ? "e.g. mytext" : "pl. sajatszoveg"}">
            </label>
          </div>
        `
      );
    } else if (block.isByteMacro) {
      inlineField.hidden = false;
      inlineField.querySelector("span").textContent = t("fieldBytes");
      operandField.value = block.rawOperand || "";
      operandField.disabled = false;
      operandField.placeholder = block.base === "hex"
        ? (currentLanguage === "en" ? "For example FF,00,8D,20,D0" : "Peldaul FF,00,8D,20,D0")
        : (currentLanguage === "en" ? "For example 169,0,141,32,208" : "Peldaul 169,0,141,32,208");
      operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
    } else if (block.isStringMacro) {
      inlineField.hidden = false;
      inlineField.querySelector("span").textContent = t("fieldText");
      operandField.value = block.rawOperand || "";
      operandField.disabled = false;
      operandField.placeholder = currentLanguage === "en" ? "For example HELLO" : "Peldaul HELLO";
      operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${t("fieldAddress")}</span>
              <input class="macro-address" data-address-field="stringAddress" type="text" value="${block.stringAddress || "C000"}" placeholder="$C000">
            </label>
          </div>
          <div class="macro-grid" style="grid-template-columns:1fr auto">
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "Label (optional)" : "Label (opcionális)"}</span>
              <input class="macro-label" type="text" value="${block.macroLabel || ""}" placeholder="${currentLanguage === "en" ? "e.g. mystr" : "pl. sajatstr"}">
            </label>
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "Shift" : "Eltolas"}</span>
              <input class="macro-char-offset" type="text" value="${block.charOffset !== undefined ? block.charOffset : "00"}" placeholder="00" style="width:2.8em;min-width:0">
            </label>
          </div>
        `
      );
    } else if (block.isDataMacro) {
      inlineField.hidden = false;
      inlineField.querySelector("span").textContent = t("fieldBytes");
      operandField.value = block.rawOperand || "";
      operandField.disabled = false;
      operandField.placeholder = block.base === "hex"
        ? (currentLanguage === "en" ? "For example FF,00,8D,20,D0" : "Peldaul FF,00,8D,20,D0")
        : (currentLanguage === "en" ? "For example 169,0,141,32,208" : "Peldaul 169,0,141,32,208");
      operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${t("fieldAddress")}</span>
              <input class="macro-address" data-address-field="dataAddress" type="text" value="${block.dataAddress || "C000"}" placeholder="$C000">
            </label>
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "Label (optional)" : "Label (opcionális)"}</span>
              <input class="macro-label" type="text" value="${block.macroLabel || ""}" placeholder="${currentLanguage === "en" ? "e.g. mydata" : "pl. sajatadat"}">
            </label>
          </div>
        `
      );
    } else if (block.isRawBytesMacro) {
      inlineField.hidden = false;
      inlineField.querySelector("span").textContent = t("fieldBytes");
      operandField.value = block.rawOperand || "";
      operandField.disabled = false;
      operandField.placeholder = block.base === "hex"
        ? (currentLanguage === "en" ? "For example FF,00,8D,20,D0" : "Peldaul FF,00,8D,20,D0")
        : (currentLanguage === "en" ? "For example 169,0,141,32,208" : "Peldaul 169,0,141,32,208");
      operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${t("fieldAddress")}</span>
              <input class="macro-address" data-address-field="rawBytesAddress" type="text" value="${block.rawBytesAddress || "C000"}" placeholder="$C000">
            </label>
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "Label (optional)" : "Label (opcionális)"}</span>
              <input class="macro-label" type="text" value="${block.macroLabel || ""}" placeholder="${currentLanguage === "en" ? "e.g. myraw" : "pl. sajatnyers"}">
            </label>
          </div>
        `
      );
    } else if (block.isRawTextMacro) {
      inlineField.hidden = false;
      inlineField.querySelector("span").textContent = t("fieldText");
      operandField.value = block.rawOperand || "";
      operandField.disabled = false;
      operandField.placeholder = currentLanguage === "en" ? "For example HELLO" : "Peldaul HELLO";
      operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${t("fieldAddress")}</span>
              <input class="macro-address" data-address-field="rawTextAddress" type="text" value="${block.rawTextAddress || "C000"}" placeholder="$C000">
            </label>
          </div>
          <div class="macro-grid" style="grid-template-columns:1fr auto">
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "Label (optional)" : "Label (opcionális)"}</span>
              <input class="macro-label" type="text" value="${block.macroLabel || ""}" placeholder="${currentLanguage === "en" ? "e.g. mytext" : "pl. sajatszoveg"}">
            </label>
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "Shift" : "Eltolas"}</span>
              <input class="macro-char-offset" type="text" value="${block.charOffset !== undefined ? block.charOffset : "00"}" placeholder="00" style="width:2.8em;min-width:0">
            </label>
          </div>
        `
      );
    } else if (block.isPetsciiMacro) {
      inlineField.hidden = false;
      inlineField.querySelector("span").textContent = t("fieldText");
      operandField.value = block.rawOperand || "";
      operandField.disabled = false;
      operandField.placeholder = currentLanguage === "en" ? "For example HELLO" : "Peldaul HELLO";
      operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${t("fieldAddress")}</span>
              <input class="macro-address" data-address-field="petsciiAddress" type="text" value="${block.petsciiAddress || "C000"}" placeholder="$C000">
            </label>
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "Label (optional)" : "Label (opcionális)"}</span>
              <input class="macro-label" type="text" value="${block.macroLabel || ""}" placeholder="${currentLanguage === "en" ? "e.g. mypetscii" : "pl. sajatpetscii"}">
            </label>
          </div>
        `
      );
    } else if (block.isIncBinMacro) {
      inlineField.hidden = true;
      const fileName = block.incBinFileName || "";
      const fileSize = (block.incBinBytes || []).length;

      const folderIcon = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 5a1 1 0 0 1 1-1h3.5l1.5 1.5H14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5z"/></svg>`;

      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${t("fieldIncBinFile")}</span>
              <div class="incbin-file-row">
                <input type="text" class="include-file-input block-operand" readonly
                  value="${fileName.replace(/"/g, "&quot;")}${fileName && fileSize ? ` (${fileSize} bytes)` : ""}"
                  placeholder="${t("incBinNoFile")}">
                <button class="icon-btn include-browse-icon" title="${t("incBinBrowse")}">${folderIcon}</button>
              </div>
            </label>
          </div>
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${t("fieldAddress")}</span>
              <input class="macro-address" data-address-field="incBinAddress" type="text" value="${block.incBinAddress || "$C000"}" placeholder="$C000">
            </label>
          </div>
        `
      );
      blockControls.querySelector(".include-browse-icon")?.addEventListener("click", async () => {
        if (!window.electronAPI?.chooseIncBinFile) return;
        const result = await window.electronAPI.chooseIncBinFile();
        if (result.canceled || result.error) return;
        updateProgramBlock(index, "incBinFile", result.filePath);
        updateProgramBlock(index, "incBinFileName", result.fileName);
        updateProgramBlock(index, "incBinBytes", result.bytes);
        renderProgram();
      });
    } else if (block.isSidMacro) {
      inlineField.hidden = true;
      const fileName = block.sidFileName || "";
      const fileSize = (block.sidBytes || []).length;
      const fmtHex = v => v ? `$${v.toString(16).toUpperCase().padStart(4, "0")}` : "—";

      const folderIcon = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 5a1 1 0 0 1 1-1h3.5l1.5 1.5H14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5z"/></svg>`;

      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${t("sidFileLabel")}</span>
              <div class="incbin-file-row">
                <input type="text" class="include-file-input block-operand" readonly
                  value="${(fileName + (fileSize ? ` (${fileSize} bytes)` : "")).replace(/"/g, "&quot;")}"
                  placeholder="${t("sidFilePlaceholder")}">
                <button class="icon-btn include-browse-icon" title="${t("sidFileBrowse")}">${folderIcon}</button>
              </div>
            </label>
          </div>
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${t("sidCustomAddress")}</span>
              <input class="sid-custom-address" type="text" maxlength="6"
                value="${block.sidCustomAddress || ""}"
                placeholder="${t("sidCustomAddressPlaceholder")}">
            </label>
          </div>
          ${block.sidTitle ? (() => {
            const customAddr = block.sidCustomAddress ? parseAddressValue(block.sidCustomAddress.replace(/^\$/, "")) : null;
            const effLoad = customAddr ?? block.sidLoadAddress ?? 0;
            const addrOffset = (customAddr !== null && block.sidLoadAddress) ? customAddr - block.sidLoadAddress : 0;
            const effInit = block.sidInitAddress ? block.sidInitAddress + addrOffset : 0;
            const effPlay = block.sidPlayAddress ? block.sidPlayAddress + addrOffset : 0;
            const overrideNote = addrOffset !== 0 ? ` <small style="color:var(--accent)">(relocated)</small>` : "";
            return `<div class="sid-meta">
              <span class="sid-meta-title">${block.sidTitle}</span>
              <span class="sid-meta-line">${block.sidAuthor || ""}</span>
              <span class="sid-meta-line">Load: ${fmtHex(effLoad)} &nbsp; Init: ${fmtHex(effInit)} &nbsp; Play: ${fmtHex(effPlay)}${overrideNote}</span>
            </div>`;
          })() : ""}
        `
      );
      blockControls.querySelector(".include-browse-icon")?.addEventListener("click", async () => {
        if (!window.electronAPI?.chooseSidFile) return;
        const result = await window.electronAPI.chooseSidFile();
        if (result.canceled || result.error) { if (result.error) alert(result.error); return; }
        updateProgramBlock(index, "sidFile", result.filePath);
        updateProgramBlock(index, "sidFileName", result.fileName);
        updateProgramBlock(index, "sidTitle", result.title || "");
        updateProgramBlock(index, "sidAuthor", result.author || "");
        updateProgramBlock(index, "sidLoadAddress", result.loadAddress);
        updateProgramBlock(index, "sidInitAddress", result.initAddress);
        updateProgramBlock(index, "sidPlayAddress", result.playAddress);
        updateProgramBlock(index, "sidBytes", result.bytes);
        renderProgram();
      });
      blockControls.querySelector(".sid-custom-address")?.addEventListener("input", e => {
        updateProgramBlock(index, "sidCustomAddress", e.target.value);
      });
    } else if (block.isIncludeMacro) {
      inlineField.hidden = true;
      const fileName = block.includeFileName || "";
      const count = (block.includedBlocks || []).length;

      const folderIcon = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 5a1 1 0 0 1 1-1h3.5l1.5 1.5H14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5z"/></svg>`;

      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${t("fieldIncludeFile")}</span>
              <div class="incbin-file-row">
                <input type="text" class="include-file-input block-operand" readonly
                  value="${fileName.replace(/"/g, "&quot;")}"
                  placeholder="${t("includeNoFile")}">
                <button class="icon-btn include-browse-icon" title="${t("includeBrowse")}">${folderIcon}</button>
              </div>
            </label>
          </div>
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "Load address (optional)" : "Betoltesi cim (opcionalis)"}</span>
              <input type="text" class="include-address-input" maxlength="4"
                value="${block.includeAddress || ""}"
                placeholder="${currentLanguage === "en" ? "e.g. C000" : "Pl. C000"}">
            </label>
          </div>
        `
      );
      blockControls.querySelector(".include-browse-icon")?.addEventListener("click", async () => {
        if (!window.electronAPI?.chooseIncludeFile) return;
        const result = await window.electronAPI.chooseIncludeFile();
        if (result.canceled || result.error) return;
        program[index].includeFile = result.filePath;
        program[index].includeFileName = result.fileName;
        program[index].includedBlocks = result.blocks || [];
        program[index].validationError = "";
        parseUserMacros();
        renderProgram();
        renderAsmOutput();
      });
      blockControls.querySelector(".include-address-input")?.addEventListener("input", (e) => {
        updateProgramBlock(index, "includeAddress", e.target.value);
      });

      node.addEventListener("click", (e) => {
        if (e.target.closest("button") || e.target.closest("input") || e.target.closest("select")) return;
        selectBlockInAsm(block.id);
      });
    } else if (block.isLoopMacro) {
      inlineField.hidden = true;
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid">
            <label class="mini-field">
              <span>${t("fieldLoopReg")}</span>
              <select class="loop-reg">
                <option value="X"${(block.loopReg || "X") === "X" ? " selected" : ""}>X</option>
                <option value="Y"${block.loopReg === "Y" ? " selected" : ""}>Y</option>
              </select>
            </label>
            <label class="mini-field">
              <span>${t("fieldLoopCount")}</span>
              <input class="loop-count" type="text" maxlength="3" value="${block.loopCount || "0A"}" placeholder="0A / 10">
            </label>
          </div>
          <label class="mini-field">
            <span>${t("fieldFormat")}</span>
            <div class="mini-toggle" role="radiogroup" aria-label="${t("fieldFormat")}">
              <label class="mini-toggle-option">
                <input class="block-base" type="radio" name="block-base-${block.id}" value="hex"${block.base === "hex" ? " checked" : ""}>
                <span>HEX</span>
              </label>
              <label class="mini-toggle-option">
                <input class="block-base" type="radio" name="block-base-${block.id}" value="dec"${block.base === "dec" ? " checked" : ""}>
                <span>DEC</span>
              </label>
              <label class="mini-toggle-option">
                <input class="block-base" type="radio" name="block-base-${block.id}" value="bin"${block.base === "bin" ? " checked" : ""}>
                <span>BIN</span>
              </label>
            </div>
          </label>
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${t("fieldLoopLabel")}</span>
              <input class="loop-label" type="text" value="${block.loopLabel || ""}" placeholder="loop1">
            </label>
          </div>
        `
      );
    } else if (block.isNextMacro) {
      inlineField.hidden = true;
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${t("fieldNextLabel")}</span>
              <input class="next-label" type="text" value="${block.nextLabel || ""}" placeholder="loop1">
            </label>
          </div>
        `
      );
      // Label picker for next-label: shows all LOOP labels in the program
      {
        const loopLabels = program.filter(b => b.isLoopMacro && b.loopLabel).map(b => b.loopLabel);
        if (loopLabels.length > 0) {
          const nextLabelInput = blockControls.querySelector(".next-label");
          nextLabelInput.classList.add("has-label-picker");
          const wrapper = document.createElement("div");
          wrapper.className = "label-picker-wrap";
          nextLabelInput.parentNode.insertBefore(wrapper, nextLabelInput);
          wrapper.appendChild(nextLabelInput);
          const dropdown = document.createElement("div");
          dropdown.className = "label-picker-dropdown";
          dropdown.hidden = true;
          dropdown.innerHTML = loopLabels.map(n => `<div class="label-picker-item">${n}</div>`).join("");
          document.body.appendChild(dropdown);
          function positionNextDropdown() {
            const r = nextLabelInput.getBoundingClientRect();
            dropdown.style.top = (r.bottom + window.scrollY + 4) + "px";
            dropdown.style.left = (r.left + window.scrollX) + "px";
            dropdown.style.width = r.width + "px";
          }
          let nextDropdownHovered = false;
          function closeNextDropdown() {
            dropdown.hidden = true;
            window.removeEventListener("scroll", positionNextDropdown, { capture: true });
          }
          nextLabelInput.addEventListener("focus", () => {
            positionNextDropdown();
            dropdown.hidden = false;
            window.addEventListener("scroll", positionNextDropdown, { capture: true, passive: true });
          });
          nextLabelInput.addEventListener("blur", () => {
            if (!nextDropdownHovered) closeNextDropdown();
          });
          nextLabelInput.addEventListener("keydown", e => { if (e.key === "Escape") closeNextDropdown(); });
          dropdown.addEventListener("mouseenter", () => { nextDropdownHovered = true; });
          dropdown.addEventListener("mouseleave", () => { nextDropdownHovered = false; });
          dropdown.querySelectorAll(".label-picker-item").forEach(item => {
            item.addEventListener("pointerdown", e => {
              e.preventDefault();
              nextLabelInput.value = item.textContent;
              nextLabelInput.dispatchEvent(new Event("input"));
              closeNextDropdown();
              nextDropdownHovered = false;
            });
          });
          document.addEventListener("pointerdown", e => {
            if (!dropdown.contains(e.target) && e.target !== nextLabelInput) closeNextDropdown();
          }, { capture: true });
        }
      }
    } else if (block.isForMacro) {
      inlineField.hidden = true;
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid">
            <label class="mini-field">
              <span>${t("fieldLoopReg")}</span>
              <select class="loop-reg">
                <option value="X"${(block.loopReg || "X") === "X" ? " selected" : ""}>X</option>
                <option value="Y"${block.loopReg === "Y" ? " selected" : ""}>Y</option>
              </select>
            </label>
            <label class="mini-field">
              <span>${t("fieldLoopCount")}</span>
              <input class="loop-count" type="text" maxlength="3" value="${block.loopCount || "0A"}" placeholder="0A / 10">
            </label>
          </div>
          <label class="mini-field">
            <span>${t("fieldFormat")}</span>
            <div class="mini-toggle" role="radiogroup" aria-label="${t("fieldFormat")}">
              <label class="mini-toggle-option">
                <input class="block-base" type="radio" name="block-base-${block.id}" value="hex"${block.base === "hex" ? " checked" : ""}>
                <span>HEX</span>
              </label>
              <label class="mini-toggle-option">
                <input class="block-base" type="radio" name="block-base-${block.id}" value="dec"${block.base === "dec" ? " checked" : ""}>
                <span>DEC</span>
              </label>
              <label class="mini-toggle-option">
                <input class="block-base" type="radio" name="block-base-${block.id}" value="bin"${block.base === "bin" ? " checked" : ""}>
                <span>BIN</span>
              </label>
            </div>
          </label>
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${t("fieldLoopLabel")}</span>
              <input class="loop-label" type="text" value="${block.loopLabel || ""}" placeholder="for1">
            </label>
          </div>
        `
      );
    } else if (block.isEndfMacro) {
      inlineField.hidden = true;
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${t("fieldNextLabel")}</span>
              <input class="next-label" type="text" value="${block.nextLabel || ""}" placeholder="for1">
            </label>
          </div>
        `
      );
      // Label picker: shows all LOOPF labels
      {
        const loopLabels = program.filter(b => b.isForMacro && b.loopLabel).map(b => b.loopLabel);
        if (loopLabels.length > 0) {
          const nextLabelInput = blockControls.querySelector(".next-label");
          nextLabelInput.classList.add("has-label-picker");
          const wrapper = document.createElement("div");
          wrapper.className = "label-picker-wrap";
          nextLabelInput.parentNode.insertBefore(wrapper, nextLabelInput);
          wrapper.appendChild(nextLabelInput);
          const dropdown = document.createElement("div");
          dropdown.className = "label-picker-dropdown";
          dropdown.hidden = true;
          dropdown.innerHTML = loopLabels.map(n => `<div class="label-picker-item">${n}</div>`).join("");
          document.body.appendChild(dropdown);
          function positionNFDropdown() {
            const r = nextLabelInput.getBoundingClientRect();
            dropdown.style.top = (r.bottom + window.scrollY + 4) + "px";
            dropdown.style.left = (r.left + window.scrollX) + "px";
            dropdown.style.width = r.width + "px";
          }
          let nfDropdownHovered = false;
          function closeNFDropdown() {
            dropdown.hidden = true;
            window.removeEventListener("scroll", positionNFDropdown, { capture: true });
          }
          nextLabelInput.addEventListener("focus", () => {
            positionNFDropdown();
            dropdown.hidden = false;
            window.addEventListener("scroll", positionNFDropdown, { capture: true, passive: true });
          });
          nextLabelInput.addEventListener("blur", () => { if (!nfDropdownHovered) closeNFDropdown(); });
          nextLabelInput.addEventListener("keydown", e => { if (e.key === "Escape") closeNFDropdown(); });
          dropdown.addEventListener("mouseenter", () => { nfDropdownHovered = true; });
          dropdown.addEventListener("mouseleave", () => { nfDropdownHovered = false; });
          dropdown.querySelectorAll(".label-picker-item").forEach(item => {
            item.addEventListener("pointerdown", e => {
              e.preventDefault();
              nextLabelInput.value = item.textContent;
              nextLabelInput.dispatchEvent(new Event("input"));
              closeNFDropdown();
              nfDropdownHovered = false;
            });
          });
          document.addEventListener("pointerdown", e => {
            if (!dropdown.contains(e.target) && e.target !== nextLabelInput) closeNFDropdown();
          }, { capture: true });
        }
      }
    } else if (block.isPushMacro) {
      inlineField.hidden = true;
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${t("fieldPushRegs")}</span>
              <input class="push-regs" type="text" maxlength="3" value="${block.pushRegs || "A"}" placeholder="AXY">
            </label>
          </div>
        `
      );
    } else if (block.isPullMacro) {
      inlineField.hidden = true;
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${t("fieldPullRegs")}</span>
              <input class="pull-regs" type="text" maxlength="3" value="${block.pullRegs || "A"}" placeholder="AXY">
            </label>
          </div>
        `
      );
    } else if (block.isWordMacro) {
      inlineField.hidden = false;
      inlineField.querySelector("span").textContent = currentLanguage === "en" ? "16-bit values" : "16-bites ertekek";
      operandField.value = block.rawOperand || "";
      operandField.disabled = false;
      operandField.placeholder = block.base === "hex"
        ? (currentLanguage === "en" ? "For example 03E8,07D0,0BB8" : "Peldaul 03E8,07D0,0BB8")
        : (currentLanguage === "en" ? "For example 1000,2000,3000" : "Peldaul 1000,2000,3000");
      operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
    } else if (block.isFillMacro) {
      inlineField.hidden = false;
      inlineField.querySelector("span").textContent = currentLanguage === "en" ? "Count,Value" : "Darab,Ertek";
      operandField.value = block.rawOperand || "";
      operandField.disabled = false;
      operandField.placeholder = block.base === "hex"
        ? (currentLanguage === "en" ? "For example 100,00" : "Peldaul 100,00")
        : (currentLanguage === "en" ? "For example 256,0" : "Peldaul 256,0");
      operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
    } else if (block.isAlignMacro) {
      inlineField.hidden = false;
      inlineField.querySelector("span").textContent = currentLanguage === "en" ? "Boundary" : "Hatar";
      operandField.value = block.rawOperand || "";
      operandField.disabled = false;
      operandField.placeholder = block.base === "hex"
        ? (currentLanguage === "en" ? "For example 40 (64), 100 (256), 2000" : "Peldaul 40 (64), 100 (256), 2000")
        : (currentLanguage === "en" ? "For example 64, 256, 8192" : "Peldaul 64, 256, 8192");
      operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
    } else if (block.isTableMacro) {
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid">
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "Table name" : "Tabla nev"}</span>
              <input class="table-name" type="text" value="${block.tableName || "table1"}" placeholder="table1">
            </label>
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "Address" : "Cim"}</span>
              <input class="table-address" type="text" value="${block.tableAddress || "C000"}" placeholder="C000">
            </label>
          </div>
        `
      );
    } else if (block.isOrgMacro) {
      inlineField.hidden = true;
      const orgBase = block.base || "hex";
      const orgHexVal = block.orgAddress || "0900";
      const orgNumVal = parseInt(orgHexVal, 16);
      const orgDisplayVal = orgBase === "dec" ? String(orgNumVal) : orgBase === "bin" ? orgNumVal.toString(2).padStart(16, "0") : orgHexVal;
      const orgMaxLen = orgBase === "dec" ? 5 : orgBase === "bin" ? 16 : 4;
      const orgPlaceholder = orgBase === "dec" ? "2049" : orgBase === "bin" ? "0000100000000001" : "0900";
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid">
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "New origin" : "Uj forditasi cim"}</span>
              <input class="org-address" type="text" maxlength="${orgMaxLen}" value="${orgDisplayVal}" placeholder="${orgPlaceholder}">
            </label>
            <label class="mini-field">
              <span>${t("fieldFormat")}</span>
              <div class="mini-toggle" role="radiogroup" aria-label="${t("fieldFormat")}">
                <label class="mini-toggle-option">
                  <input class="block-base" type="radio" name="block-base-${block.id}" value="hex"${orgBase !== "dec" ? " checked" : ""}>
                  <span>HEX</span>
                </label>
                <label class="mini-toggle-option">
                  <input class="block-base" type="radio" name="block-base-${block.id}" value="dec"${orgBase === "dec" ? " checked" : ""}>
                  <span>DEC</span>
                </label>
              </div>
            </label>
          </div>
        `
      );
    } else if (block.isJoystickMacro) {
      inlineField.hidden = true;
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid">
            <label class="mini-field">
              <span>${t("fieldJoyPort")}</span>
              <select class="joy-port">
                <option value="2"${(block.joyPort || "2") === "2" ? " selected" : ""}>2 ($DC00)</option>
                <option value="1"${block.joyPort === "1" ? " selected" : ""}>1 ($DC01)</option>
              </select>
            </label>
            <label class="mini-field">
              <span>${t("fieldJoySpriteNum")}</span>
              <input class="joy-sprite-num" type="number" min="0" max="7" value="${block.joySpriteNum || "0"}">
            </label>
          </div>
        `
      );
    } else if (block.isMouseMacro) {
      inlineField.hidden = true;
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid">
            <label class="mini-field">
              <span>${t("fieldMousePort")}</span>
              <select class="mouse-port">
                <option value="2"${(block.mousePort || "2") === "2" ? " selected" : ""}>2 ($D41x, CIA $40)</option>
                <option value="1"${block.mousePort === "1" ? " selected" : ""}>1 ($D41x, CIA $00)</option>
              </select>
            </label>
            <label class="mini-field">
              <span>${t("fieldMouseSpriteNum")}</span>
              <input class="mouse-sprite-num" type="number" min="0" max="7" value="${block.mouseSpriteNum || "0"}">
            </label>
            <label class="mini-field">
              <span>${t("fieldMousePotX")}</span>
              <input class="mouse-pot-x-zp" type="text" maxlength="2" value="${(block.mousePotXZP || "FD").toUpperCase()}" placeholder="FD">
            </label>
            <label class="mini-field">
              <span>${t("fieldMousePotY")}</span>
              <input class="mouse-pot-y-zp" type="text" maxlength="2" value="${(block.mousePotYZP || "FE").toUpperCase()}" placeholder="FE">
            </label>
          </div>
        `
      );
    } else if (block.isWaitRasterMacro) {
      inlineField.hidden = true;
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${t("fieldRasterLine")}</span>
              <input class="raster-line" type="text" maxlength="3" value="${block.rasterLine || "FF"}" placeholder="FF">
            </label>
          </div>
        `
      );
    } else if (block.isSuperCpuDetectMacro) {
      inlineField.hidden = true;
    } else if (block.isTurboEnableMacro) {
      inlineField.hidden = true;
      const curMode = block.turboEnableMode || "on";
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "Turbo" : "Turbo"}</span>
              <select class="turbo-enable-mode">
                <option value="on" ${curMode === "on" ? "selected" : ""}>${currentLanguage === "en" ? "Enable ($D07A)" : "Bekapcsol ($D07A)"}</option>
                <option value="off" ${curMode === "off" ? "selected" : ""}>${currentLanguage === "en" ? "Disable ($D07B)" : "Kikapcsol ($D07B)"}</option>
              </select>
            </label>
          </div>
        `
      );
    } else if (block.isTurboSetMacro) {
      inlineField.hidden = true;
      const turboSpeeds = [
        "0=1MHz","1=2MHz","2=3MHz","3=4MHz","4=5MHz","5=6MHz",
        "6=8MHz","7=10MHz","8=12MHz","9=14MHz","10=16MHz",
        "11=20MHz","12=24MHz","13=32MHz","14=40MHz","15=48MHz"
      ];
      const curSpd = parseInt(block.turboSpeed || "7", 10);
      const curBl = block.turboBadline || "0";
      const spdOptions = turboSpeeds.map((s, i) => `<option value="${i}" ${i === curSpd ? "selected" : ""}>${s}</option>`).join("");
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid">
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "Speed" : "Sebesseg"}</span>
              <select class="turbo-speed">${spdOptions}</select>
            </label>
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "Badline" : "Badline"}</span>
              <select class="turbo-badline">
                <option value="0" ${curBl === "0" ? "selected" : ""}>${currentLanguage === "en" ? "Enabled (C64 compat)" : "Engedelyezve (C64 kompatibilis)"}</option>
                <option value="1" ${curBl === "1" ? "selected" : ""}>${currentLanguage === "en" ? "Disabled (turbo)" : "Letiltva (turbo)"}</option>
              </select>
            </label>
          </div>
        `
      );
    } else if (block.isSpriteInitMacro) {
      inlineField.hidden = true;
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid">
            <label class="mini-field">
              <span>${t("fieldSpriteNum")}</span>
              <input class="sprite-num" type="number" min="0" max="7" value="${block.spriteNum || "0"}">
            </label>
            <label class="mini-field">
              <span>${t("fieldSpriteColor")}</span>
              <input class="sprite-color" type="number" min="0" max="15" value="${block.spriteColor || "7"}">
            </label>
          </div>
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${t("fieldSpriteDataPage")}</span>
              <input class="sprite-data-page" type="text" maxlength="3" value="${block.spriteDataPage || "21"}" placeholder="21">
            </label>
          </div>
        `
      );
    } else if (block.isSpritePosMacro) {
      inlineField.hidden = true;
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid">
            <label class="mini-field">
              <span>${t("fieldSpriteNum")}</span>
              <input class="sprite-num" type="number" min="0" max="7" value="${block.spriteNum || "0"}">
            </label>
            <label class="mini-field">
              <span>${t("fieldSpriteX")}</span>
              <input class="sprite-x" type="number" min="0" max="319" value="${block.spriteX || "152"}">
            </label>
          </div>
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${t("fieldSpriteY")}</span>
              <input class="sprite-y" type="number" min="0" max="255" value="${block.spriteY || "100"}">
            </label>
          </div>
        `
      );
    } else if (block.isSpriteColMacro) {
      inlineField.hidden = true;
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid">
            <label class="mini-field">
              <span>${t("fieldSpriteNum")}</span>
              <input class="col-sprite-num" type="number" min="0" max="7" value="${block.spriteNum || "0"}">
            </label>
            <label class="mini-field">
              <span>${t("fieldColType")}</span>
              <select class="col-type">
                <option value="sprite"${(block.colType || "sprite") === "sprite" ? " selected" : ""}>${t("colTypeSprite")}</option>
                <option value="background"${block.colType === "background" ? " selected" : ""}>${t("colTypeBackground")}</option>
              </select>
            </label>
          </div>
        `
      );
    } else if (block.isLoadFileMacro) {
      inlineField.hidden = true;
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid">
            <label class="mini-field">
              <span>${t("fieldLoadFileName")}</span>
              <input class="loadfile-name" type="text" maxlength="16" value="${escapeHtmlAttribute(block.loadFileName || "")}" placeholder="DATA">
            </label>
            <label class="mini-field">
              <span>${t("fieldLoadFileDevice")}</span>
              <input class="loadfile-device" type="number" min="8" max="30" value="${block.loadFileDevice || "8"}">
            </label>
          </div>
          <div class="macro-grid">
            <label class="mini-field">
              <span>${t("fieldLoadFileAddress")}</span>
              <input class="loadfile-address" type="text" maxlength="5" value="${escapeHtmlAttribute(block.loadFileAddress || "")}" placeholder="${t("fieldLoadFileAddressPlaceholder")}">
            </label>
            <label class="mini-field">
              <span>${t("fieldLoadFileErrorLabel")}</span>
              <input class="loadfile-error-label" type="text" value="${escapeHtmlAttribute(block.loadFileErrorLabel || "")}" placeholder="${t("fieldLoadFileErrorLabelPlaceholder")}">
            </label>
          </div>
        `
      );
    } else if (block.isReuCheckMacro) {
      inlineField.hidden = true;
    } else if (block.isReuTransferMacro) {
      inlineField.hidden = true;
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid">
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "C64 addr" : "C64 cim"}</span>
              <input class="reu-c64-addr" type="text" maxlength="5" value="${block.reuC64Addr || "C000"}" placeholder="C000">
            </label>
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "REU addr" : "REU cim"}</span>
              <input class="reu-exp-addr" type="text" maxlength="5" value="${block.reuExpAddr || "0000"}" placeholder="0000">
            </label>
          </div>
          <div class="macro-grid">
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "Bank (0–7)" : "Bank (0–7)"}</span>
              <input class="reu-bank" type="number" min="0" max="7" value="${block.reuBank || "0"}">
            </label>
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "Length (hex)" : "Hossz (hex)"}</span>
              <input class="reu-length" type="text" maxlength="5" value="${block.reuLength || "0100"}" placeholder="0100">
            </label>
          </div>
        `
      );
    } else if (block.isDefineMacro) {
      inlineField.querySelector("span").textContent = currentLanguage === "en" ? "Symbol" : "Szimbolum";
      inlineField.hidden = false;
      operandField.value = block.defineSymbol || "";
      operandField.placeholder = "DEBUG";
      operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
    } else if (block.isConstMacro) {
      inlineField.hidden = true;
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid">
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "Name" : "Nev"}</span>
              <input class="const-name" type="text" value="${block.constName || "MY_CONST"}" placeholder="MY_CONST">
            </label>
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "Value" : "Ertek"}</span>
              <input class="const-value" type="text" value="${block.rawOperand || "0000"}" placeholder="${block.base === "hex" ? "0400" : "1024"}">
            </label>
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "Format" : "Formatum"}</span>
              <div class="mini-toggle" role="radiogroup" aria-label="Format">
                <label class="mini-toggle-option">
                  <input class="block-base" type="radio" name="block-base-${block.id}" value="hex"${block.base === "hex" ? " checked" : ""}>
                  <span>HEX</span>
                </label>
                <label class="mini-toggle-option">
                  <input class="block-base" type="radio" name="block-base-${block.id}" value="dec"${block.base === "dec" ? " checked" : ""}>
                  <span>DEC</span>
                </label>
                <label class="mini-toggle-option">
                  <input class="block-base" type="radio" name="block-base-${block.id}" value="bin"${block.base === "bin" ? " checked" : ""}>
                  <span>BIN</span>
                </label>
              </div>
            </label>
          </div>
        `
      );
    } else if (block.isIfMacro) {
      inlineField.querySelector("span").textContent = currentLanguage === "en" ? "Condition" : "Feltetel";
      inlineField.hidden = false;
      operandField.value = block.ifCondition || "";
      operandField.placeholder = "DEBUG";
      operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
    } else if (block.isElseMacro || block.isEndIfMacro) {
      inlineField.hidden = true;
    } else if (block.isMacroDefStart) {
      inlineField.querySelector("span").textContent = currentLanguage === "en" ? "Macro name" : "Makro nev";
      inlineField.hidden = false;
      operandField.value = block.macroName || "";
      operandField.placeholder = "my_macro";
      operandField.addEventListener("input", (event) => updateProgramBlock(index, "macroName", event.target.value));
    } else if (block.isMacroDefEnd) {
      inlineField.hidden = true;
    } else if (block.isRegionMacro) {
      inlineField.hidden = false;
      inlineField.querySelector("span").textContent = currentLanguage === "en" ? "Region name" : "Régió neve";
      operandField.value = block.regionName || "region";
      operandField.disabled = false;
      operandField.placeholder = currentLanguage === "en" ? "for example init_section" : "peldaul init_szekció";
      operandField.addEventListener("input", (event) => {
        updateProgramBlock(index, "regionName", event.target.value);
      });
      collapseToggle.insertAdjacentHTML(
        "beforebegin",
        `<div class="region-topline-btns">
          <button type="button" class="region-expand-all-btn" title="${currentLanguage === "en" ? "Expand all blocks in region" : "Régió blokkjainak kinyitása"}">&#8597;</button>
          <button type="button" class="region-select-asm-btn" title="${currentLanguage === "en" ? "Select region range in ASM view" : "Régió kijelölése az ASM nézetben"}">&#9678;</button>
          <button type="button" class="region-copy-btn" title="${currentLanguage === "en" ? "Copy region with all blocks" : "Régió másolása az összes blokkal"}">&#10697;</button>
          <button type="button" class="region-paste-btn" title="${currentLanguage === "en" ? "Paste copied region after this region" : "Másolt régió beillesztése e régió után"}" style="${_clipboardRegion ? '' : 'opacity:0.4'}">&#9112;</button>
        </div>`
      );
      node.querySelector(".region-expand-all-btn")?.addEventListener("click", () => {
        // Expand the group itself if collapsed, then expand all child blocks
        if (block.regionCollapsed) {
          block.regionCollapsed = false;
          block.collapsed = false;
        }
        // Depth-aware scan: expand all blocks within this region (handles nested regions)
        let depth = 0;
        for (let i = index; i < program.length; i++) {
          const _b = program[i];
          if (_b.isRegionMacro || _b.mnemonic === "REGION") {
            if (i === index) { depth++; continue; }
            depth++;
            _b.regionCollapsed = false;
            _b.collapsed = false;
          } else if (_b.isEndRegionMacro || _b.mnemonic === "ENDREGION") {
            if (--depth === 0) break;
          } else if (depth > 0) {
            _b.collapsed = false;
          }
        }
        renderProgram();
      });

      node.querySelector(".region-copy-btn")?.addEventListener("click", () => {
        let depth = 0, endIndex = -1;
        for (let i = index; i < program.length; i++) {
          const _b = program[i];
          if (_b.isRegionMacro || _b.mnemonic === "REGION") depth++;
          else if (_b.isEndRegionMacro || _b.mnemonic === "ENDREGION") { if (--depth === 0) { endIndex = i; break; } }
        }
        let slice;
        if (endIndex === -1) {
          // Region has no matching ENDREGION — copy the REGION block and add a synthetic ENDREGION
          // so the paste always produces a complete, balanced region structure
          slice = [program[index], _importMakeEndRegion()];
        } else {
          slice = program.slice(index, endIndex + 1);
        }
        _clipboardRegion = slice.map(b => ({ ...b, id: crypto.randomUUID() }));
        const btn = node.querySelector(".region-copy-btn");
        const pasteBtn = node.querySelector(".region-paste-btn");
        if (btn) { const orig = btn.innerHTML; btn.innerHTML = "&#10003;"; setTimeout(() => { btn.innerHTML = orig; }, 700); }
        if (pasteBtn) pasteBtn.style.opacity = "";
      });

      node.querySelector(".region-paste-btn")?.addEventListener("click", () => {
        if (!_clipboardRegion || _clipboardRegion.length === 0) return;
        let depth = 0, endIndex = -1;
        for (let i = index; i < program.length; i++) {
          const _b = program[i];
          if (_b.isRegionMacro || _b.mnemonic === "REGION") depth++;
          else if (_b.isEndRegionMacro || _b.mnemonic === "ENDREGION") { if (--depth === 0) { endIndex = i; break; } }
        }
        // When endIndex === -1 the target region has no ENDREGION; append at end of program
        // rather than inserting at index+1 (which would land inside the unclosed region)
        const insertAt = endIndex === -1 ? program.length : endIndex + 1;
        const toInsert = _clipboardRegion.map(b => ({ ...b, id: crypto.randomUUID() }));
        // Force the pasted REGION to be expanded so the user can clearly see it was pasted
        if (toInsert.length > 0 && toInsert[0].isRegionMacro) {
          toInsert[0].regionCollapsed = false;
          toInsert[0].collapsed = false;
          // Give the pasted region a unique name so it doesn't conflict with the original
          const origName = toInsert[0].regionName || "region";
          let newName = `copy of ${origName}`;
          let counter = 2;
          while (program.some(b => b.isRegionMacro && b.regionName === newName)) {
            newName = `copy of ${origName} ${counter++}`;
          }
          toInsert[0].regionName = newName;
        }
        program.splice(insertAt, 0, ...toInsert);
        markTabDirty();
        renderProgram();
        // Scroll the newly pasted REGION block into view
        requestAnimationFrame(() => {
          const pastedNode = programList.querySelector(`[data-index="${insertAt}"]`);
          if (pastedNode) pastedNode.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      });

      node.querySelector(".region-select-asm-btn")?.addEventListener("click", () => {
        // Find the matching ENDREGION block and its index
        let endGroupBlock = null;
        let endGroupIndex = -1;
        let depth = 0;
        for (let i = index; i < program.length; i++) {
          const _b = program[i];
          if (_b.isRegionMacro || _b.mnemonic === "REGION") depth++;
          else if (_b.isEndRegionMacro || _b.mnemonic === "ENDREGION") {
            depth--;
            if (depth === 0) { endGroupBlock = program[i]; endGroupIndex = i; break; }
          }
        }
        const groupRange = asmBlockRanges[block.id];
        const endRange = endGroupBlock ? asmBlockRanges[endGroupBlock.id] : null;

        let firstLine = null;
        let lastLine = null;
        if (groupRange) {
          firstLine = groupRange.firstLine;
          lastLine = endRange ? endRange.lastLine : groupRange.lastLine;
        } else {
          // Region comments hidden — derive range from child blocks inside the region
          const childEnd = endGroupIndex === -1 ? program.length : endGroupIndex;
          for (let i = index + 1; i < childEnd; i++) {
            const r = asmBlockRanges[program[i].id];
            if (r) {
              if (firstLine === null) firstLine = r.firstLine;
              lastLine = r.lastLine;
            }
          }
        }

        if (firstLine !== null) {
          // Switch to ASM view if not visible
          const asmTab = document.querySelector('[data-tab="asm"]');
          if (asmTab && !asmTab.classList.contains("active")) asmTab.click();
          // Apply highlight using the combined range
          const tempId = "__group_range__";
          asmBlockRanges[tempId] = { firstLine, lastLine };
          applyAsmHighlight(tempId);
          delete asmBlockRanges[tempId];
        }
      });
    } else if (block.isEndRegionMacro) {
      // Show the matching REGION name as read-only label (depth-aware)
      let matchingRegionName = "";
      let depth = 0;
      for (let i = index - 1; i >= 0; i--) {
        if (program[i].isEndRegionMacro) { depth++; }
        else if (program[i].isRegionMacro) {
          if (depth === 0) { matchingRegionName = program[i].regionName || "region"; break; }
          depth--;
        }
      }
      inlineField.hidden = false;
      inlineField.querySelector("span").textContent = currentLanguage === "en" ? "Region" : "Régió";
      operandField.value = matchingRegionName;
      operandField.disabled = true;
    } else if (block.isMacroInvoke) {
      // INVOKE block: show dropdown with available macros
      const macroNames = Object.keys(userMacros);
      const options = macroNames.length > 0
        ? macroNames.map(name => `<option value="${name}"${block.invokeMacroName === name ? " selected" : ""}>${name}</option>`).join("")
        : `<option value="">${currentLanguage === "en" ? "No macros defined" : "Nincs definialva makro"}</option>`;

      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${currentLanguage === "en" ? "Macro name" : "Makro nev"}</span>
              <select class="invoke-macro-select">
                ${options}
              </select>
            </label>
          </div>
        `
      );
      inlineField.hidden = true;
    } else {
      inlineField.querySelector("span").textContent = t("fieldOperand");
      inlineField.hidden = !mode.needsOperand;
      operandField.value = block.rawOperand || "";
      operandField.disabled = !mode.needsOperand;
      operandField.placeholder = getOperandPlaceholder(mode, block.base);
      operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
      // Custom label picker dropdown for addressing modes that can reference a label or constant
      if (mode.needsOperand && (block.addressingMode === "relative" || block.addressingMode === "absolute" || block.addressingMode === "absoluteX" || block.addressingMode === "absoluteY" || block.addressingMode === "zeroPage" || block.addressingMode === "zeroPageX" || block.addressingMode === "zeroPageY" || block.addressingMode === "indirectX" || block.addressingMode === "indirectY" || block.addressingMode === "indirect" || block.addressingMode === "immediate")) {
        const programLabels = block.addressingMode === "immediate"
          ? []
          : program.filter(b => b.isLabel && b.labelName).map(b => b.labelName);
        const constNames = program.filter(b => b.isConstMacro && b.constName).map(b => b.constName);
        const tableNames = block.addressingMode === "immediate"
          ? []
          : program.filter(b => b.isTableMacro && b.tableName).map(b => b.tableName);
        // Labels and macro-subroutines from all INCLUDE blocks
      // Helper: build current picker names by scanning program state at this moment
        function buildPickerNamesForBlock() {
          const isImm = block.addressingMode === "immediate";
          const labels = isImm ? [] : program.filter(b => b.isLabel && b.labelName).map(b => b.labelName);
          const macroLabels = isImm ? [] : program.filter(b => b.macroLabel).map(b => b.macroLabel.trim()).filter(Boolean);
          const consts = program.filter(b => b.isConstMacro && b.constName).map(b => b.constName);
          const tables = isImm ? [] : program.filter(b => b.isTableMacro && b.tableName).map(b => b.tableName);
          const included = isImm ? [] : program
            .filter(b => b.isIncludeMacro && b.includedBlocks?.length)
            .flatMap(b => {
              const names = [];
              let inMacro = false;
              for (const sub of b.includedBlocks) {
                if (sub.isMacroDefStart) {
                  inMacro = true;
                  if (b.includeAddress && sub.macroName) names.push(sub.macroName);
                  continue;
                }
                if (sub.isMacroDefEnd) { inMacro = false; continue; }
                if (!inMacro && sub.isLabel && sub.labelName) names.push(sub.labelName);
              }
              return names;
            });
          return [...labels, ...macroLabels, ...included, ...consts, ...tables];
        }

        // Always create the picker container; populate dynamically on focus
        {
          operandField.classList.add("has-label-picker");
          const wrapper = document.createElement("div");
          wrapper.className = "label-picker-wrap";
          operandField.parentNode.insertBefore(wrapper, operandField);
          wrapper.appendChild(operandField);
          const dropdown = document.createElement("div");
          dropdown.className = "label-picker-dropdown";
          dropdown.hidden = true;
          document.body.appendChild(dropdown);
          function positionLabelDropdown() {
            const r = operandField.getBoundingClientRect();
            dropdown.style.top = (r.bottom + window.scrollY + 4) + "px";
            dropdown.style.left = (r.left + window.scrollX) + "px";
            dropdown.style.width = r.width + "px";
          }
          let dropdownHovered = false;
          function closeLabelDropdown() {
            dropdown.hidden = true;
            window.removeEventListener("scroll", positionLabelDropdown, { capture: true });
          }
          function attachPickerItemHandlers() {
            dropdown.querySelectorAll(".label-picker-item").forEach(item => {
              item.addEventListener("pointerdown", e => {
                e.preventDefault();
                operandField.value = item.textContent;
                operandField.dispatchEvent(new Event("input"));
                closeLabelDropdown();
                dropdownHovered = false;
              });
            });
          }
          operandField.addEventListener("focus", () => {
            // Rebuild picker content from current program state
            const names = buildPickerNamesForBlock();
            dropdown.innerHTML = names.map(n => `<div class="label-picker-item">${n}</div>`).join("");
            attachPickerItemHandlers();
            if (names.length > 0) {
              positionLabelDropdown();
              dropdown.hidden = false;
              window.addEventListener("scroll", positionLabelDropdown, { capture: true, passive: true });
            }
          });
          operandField.addEventListener("blur", () => {
            if (!dropdownHovered) closeLabelDropdown();
          });
          operandField.addEventListener("keydown", e => { if (e.key === "Escape") closeLabelDropdown(); });
          dropdown.addEventListener("mouseenter", () => { dropdownHovered = true; });
          dropdown.addEventListener("mouseleave", () => { dropdownHovered = false; });
          document.addEventListener("pointerdown", e => {
            if (!dropdown.contains(e.target) && e.target !== operandField) closeLabelDropdown();
          }, { capture: true });
        }
      }
    }

    blockControls.insertAdjacentHTML(
      "beforeend",
      `
          ${(mode.needsOperand && !block.isLabel && !block.isAnonymousLabel && !block.isComment && !block.isTextMacro && !block.isByteMacro && !block.isStringMacro && !block.isDataMacro && !block.isRawBytesMacro && !block.isRawTextMacro && !block.isPetsciiMacro && !block.isIncBinMacro && !block.isIncludeMacro && !block.isLoopMacro && !block.isNextMacro && !block.isForMacro && !block.isEndfMacro && !block.isWordMacro && !block.isFillMacro && !block.isAlignMacro && !block.isTableMacro && !block.isIfMacro && !block.isElseMacro && !block.isEndIfMacro && !block.isMacroInvoke && !block.isRegionMacro && !block.isEndRegionMacro && !block.isLoadFileMacro) || block.isByteMacro || block.isDataMacro || block.isRawBytesMacro || block.isWordMacro || block.isFillMacro || block.isAlignMacro ? `
          <label class="mini-field">
            <span>${t("fieldFormat")}</span>
          <div class="mini-toggle" role="radiogroup" aria-label="${t("fieldFormat")}">
            <label class="mini-toggle-option">
              <input class="block-base" type="radio" name="block-base-${block.id}" value="hex"${block.base === "hex" ? " checked" : ""}>
              <span>HEX</span>
            </label>
            <label class="mini-toggle-option">
              <input class="block-base" type="radio" name="block-base-${block.id}" value="dec"${block.base === "dec" ? " checked" : ""}>
              <span>DEC</span>
            </label>
            ${shouldShowBinForBlock(block, mode) ? `<label class="mini-toggle-option">
              <input class="block-base" type="radio" name="block-base-${block.id}" value="bin"${block.base === "bin" ? " checked" : ""}>
              <span>BIN</span>
            </label>` : ""}
          </div>
        </label>` : ""}
          <label class="mini-field"${block.isLabel || block.isAnonymousLabel || block.isComment || block.isTextMacro || block.isByteMacro || block.isStringMacro || block.isDataMacro || block.isRawBytesMacro || block.isRawTextMacro || block.isPetsciiMacro || block.isIncBinMacro || block.isSidMacro || block.isIncludeMacro || block.isLoopMacro || block.isNextMacro || block.isForMacro || block.isEndfMacro || block.isWordMacro || block.isFillMacro || block.isAlignMacro || block.isTableMacro || block.isDefineMacro || block.isIfMacro || block.isElseMacro || block.isEndIfMacro || block.isMacroInvoke || block.isMacroDefStart || block.isMacroDefEnd || block.isPushMacro || block.isPullMacro || block.isRegionMacro || block.isEndRegionMacro || block.isLoadFileMacro || getMnemonicModes(block.mnemonic).length <= 1 ? ` hidden` : ""}>
            <span>${t("addressingMode")}</span>
          <select class="block-mode">
            ${getMnemonicModes(block.mnemonic).map((modeKey) => `<option value="${modeKey}"${block.addressingMode === modeKey ? " selected" : ""}>${modeText(modeKey, "label")}</option>`).join("")}
          </select>
        </label>
      `
    );

    node.querySelectorAll(".block-base").forEach((baseInput) => {
      baseInput.addEventListener("change", (event) => {
        const newBase = event.target.value;
        // For ORG blocks, convert orgAddress between hex and dec display
        if (block.isOrgMacro) {
          const orgInput = node.querySelector(".org-address");
          const rawVal = (orgInput?.value || block.orgAddress || "0900").trim();
          const oldBase = block.base || "hex";
          let numericVal;
          if (oldBase === "dec") numericVal = parseInt(rawVal, 10);
          else if (oldBase === "bin") numericVal = /^[01]+$/.test(rawVal) ? parseInt(rawVal, 2) : NaN;
          else numericVal = parseInt(rawVal, 16);
          const hexVal = !isNaN(numericVal)
            ? numericVal.toString(16).toUpperCase().padStart(4, "0")
            : (block.orgAddress || "0900");
          block.orgAddress = hexVal;
          if (orgInput) {
            if (newBase === "dec") { orgInput.value = String(parseInt(hexVal, 16)); orgInput.maxLength = 5; orgInput.placeholder = "2049"; }
            else if (newBase === "bin") { orgInput.value = parseInt(hexVal, 16).toString(2).padStart(16, "0"); orgInput.maxLength = 16; orgInput.placeholder = "0001000000000000"; }
            else { orgInput.value = hexVal; orgInput.maxLength = 4; orgInput.placeholder = "0900"; }
          }
          updateProgramBlock(index, "base", newBase);
          return;
        }
        // For LOOP blocks, convert loopCount between hex, dec, and bin
        if (block.isLoopMacro || block.isForMacro) {
          const countInput = node.querySelector(".loop-count");
          const rawCount = (countInput?.value || block.loopCount || "0A").trim();
          const oldBase = block.base || "hex";
          const parsed = parseNumberByBase(rawCount, oldBase);
          if (parsed !== null && !isNaN(parsed) && parsed >= 0 && parsed <= 255) {
            let converted;
            if (newBase === "hex") converted = parsed.toString(16).toUpperCase().padStart(2, "0");
            else if (newBase === "bin") converted = parsed.toString(2).padStart(8, "0");
            else converted = String(parsed);
            if (countInput) countInput.value = converted;
            updateProgramBlock(index, "loopCount", converted);
          }
        }
        // For CONST blocks, convert the value input between hex, dec, and bin
        if (block.isConstMacro) {
          const constValueInput = node.querySelector(".const-value");
          const rawVal = (constValueInput?.value || block.rawOperand || "0").trim();
          const oldBase = block.base || "hex";
          const parsed = parseNumberByBase(rawVal.replace(/^\$/, ""), oldBase);
          if (parsed !== null && parsed >= 0 && parsed <= 65535 && constValueInput) {
            let converted;
            if (newBase === "hex") converted = parsed.toString(16).toUpperCase().padStart(4, "0");
            else if (newBase === "bin") converted = parsed.toString(2).padStart(16, "0");
            else converted = String(parsed);
            constValueInput.value = converted;
          }
        }
        updateProgramBlock(index, "base", newBase);
        // Sync the operand input DOM after rawOperand may have been converted
        const operandInput = node.querySelector(".block-operand");
        if (operandInput) operandInput.value = block.rawOperand || "";
      });
    });
    const macroXInput = node.querySelector(".macro-x");
    const macroYInput = node.querySelector(".macro-y");
    if (macroXInput) {
      macroXInput.addEventListener("input", (event) => updateProgramBlock(index, "textX", event.target.value));
    }
    if (macroYInput) {
      macroYInput.addEventListener("input", (event) => updateProgramBlock(index, "textY", event.target.value));
    }
    const macroAddressInput = node.querySelector(".macro-address");
    if (macroAddressInput) {
      const addressField = macroAddressInput.dataset.addressField || "stringAddress";
      macroAddressInput.addEventListener("input", (event) => updateProgramBlock(index, addressField, event.target.value));
    }
    const macroLabelInput = node.querySelector(".macro-label");
    if (macroLabelInput) {
      macroLabelInput.addEventListener("input", (event) => updateProgramBlock(index, "macroLabel", event.target.value));
    }
    const macroCharOffsetInput = node.querySelector(".macro-char-offset");
    if (macroCharOffsetInput) {
      macroCharOffsetInput.addEventListener("input", (event) => updateProgramBlock(index, "charOffset", event.target.value));
    }
    const joyPortSelect = node.querySelector(".joy-port");
    if (joyPortSelect) {
      joyPortSelect.addEventListener("change", (event) => updateProgramBlock(index, "joyPort", event.target.value));
    }
    const joySpriteNumInput = node.querySelector(".joy-sprite-num");
    if (joySpriteNumInput) {
      joySpriteNumInput.addEventListener("input", (event) => updateProgramBlock(index, "joySpriteNum", event.target.value));
    }
    const mousePortSelect = node.querySelector(".mouse-port");
    if (mousePortSelect) {
      mousePortSelect.addEventListener("change", (event) => updateProgramBlock(index, "mousePort", event.target.value));
    }
    const mouseSpriteNumInput = node.querySelector(".mouse-sprite-num");
    if (mouseSpriteNumInput) {
      mouseSpriteNumInput.addEventListener("input", (event) => updateProgramBlock(index, "mouseSpriteNum", event.target.value));
    }
    const mousePotXZPInput = node.querySelector(".mouse-pot-x-zp");
    if (mousePotXZPInput) {
      mousePotXZPInput.addEventListener("input", (event) => updateProgramBlock(index, "mousePotXZP", event.target.value));
    }
    const mousePotYZPInput = node.querySelector(".mouse-pot-y-zp");
    if (mousePotYZPInput) {
      mousePotYZPInput.addEventListener("input", (event) => updateProgramBlock(index, "mousePotYZP", event.target.value));
    }
    const rasterLineInput = node.querySelector(".raster-line");
    if (rasterLineInput) {
      rasterLineInput.addEventListener("input", (event) => updateProgramBlock(index, "rasterLine", event.target.value));
    }
    const turboSpeedSelect = node.querySelector(".turbo-speed");
    if (turboSpeedSelect) {
      turboSpeedSelect.addEventListener("change", (event) => updateProgramBlock(index, "turboSpeed", event.target.value));
    }
    const turboBadlineSelect = node.querySelector(".turbo-badline");
    if (turboBadlineSelect) {
      turboBadlineSelect.addEventListener("change", (event) => updateProgramBlock(index, "turboBadline", event.target.value));
    }
    const turboEnableModeSelect = node.querySelector(".turbo-enable-mode");
    if (turboEnableModeSelect) {
      turboEnableModeSelect.addEventListener("change", (event) => updateProgramBlock(index, "turboEnableMode", event.target.value));
    }
    const reuC64AddrInput = node.querySelector(".reu-c64-addr");
    if (reuC64AddrInput) {
      reuC64AddrInput.addEventListener("input", (event) => updateProgramBlock(index, "reuC64Addr", event.target.value));
    }
    const reuExpAddrInput = node.querySelector(".reu-exp-addr");
    if (reuExpAddrInput) {
      reuExpAddrInput.addEventListener("input", (event) => updateProgramBlock(index, "reuExpAddr", event.target.value));
    }
    const reuBankInput = node.querySelector(".reu-bank");
    if (reuBankInput) {
      reuBankInput.addEventListener("input", (event) => updateProgramBlock(index, "reuBank", event.target.value));
    }
    const reuLengthInput = node.querySelector(".reu-length");
    if (reuLengthInput) {
      reuLengthInput.addEventListener("input", (event) => updateProgramBlock(index, "reuLength", event.target.value));
    }
    const spriteNumInput = node.querySelector(".sprite-num");
    if (spriteNumInput) {
      spriteNumInput.addEventListener("input", (event) => updateProgramBlock(index, "spriteNum", event.target.value));
    }
    const spriteColorInput = node.querySelector(".sprite-color");
    if (spriteColorInput) {
      spriteColorInput.addEventListener("input", (event) => updateProgramBlock(index, "spriteColor", event.target.value));
    }
    const spriteDataPageInput = node.querySelector(".sprite-data-page");
    if (spriteDataPageInput) {
      spriteDataPageInput.addEventListener("input", (event) => updateProgramBlock(index, "spriteDataPage", event.target.value));
    }
    const spriteXInput = node.querySelector(".sprite-x");
    if (spriteXInput) {
      spriteXInput.addEventListener("input", (event) => updateProgramBlock(index, "spriteX", event.target.value));
    }
    const spriteYInput = node.querySelector(".sprite-y");
    if (spriteYInput) {
      spriteYInput.addEventListener("input", (event) => updateProgramBlock(index, "spriteY", event.target.value));
    }
    const colSpriteNumInput = node.querySelector(".col-sprite-num");
    if (colSpriteNumInput) {
      colSpriteNumInput.addEventListener("input", (event) => updateProgramBlock(index, "spriteNum", event.target.value));
    }
    const colTypeSelect = node.querySelector(".col-type");
    if (colTypeSelect) {
      colTypeSelect.addEventListener("change", (event) => updateProgramBlock(index, "colType", event.target.value));
    }
    const loadFileNameInput = node.querySelector(".loadfile-name");
    if (loadFileNameInput) {
      loadFileNameInput.addEventListener("input", (event) => updateProgramBlock(index, "loadFileName", event.target.value));
    }
    const loadFileDeviceInput = node.querySelector(".loadfile-device");
    if (loadFileDeviceInput) {
      loadFileDeviceInput.addEventListener("input", (event) => updateProgramBlock(index, "loadFileDevice", event.target.value));
    }
    const loadFileAddressInput = node.querySelector(".loadfile-address");
    if (loadFileAddressInput) {
      loadFileAddressInput.addEventListener("input", (event) => updateProgramBlock(index, "loadFileAddress", event.target.value));
    }
    const loadFileErrorLabelInput = node.querySelector(".loadfile-error-label");
    if (loadFileErrorLabelInput) {
      loadFileErrorLabelInput.addEventListener("input", (event) => updateProgramBlock(index, "loadFileErrorLabel", event.target.value));

      // Label picker dropdown — shows all program labels for the BCS target.
      const programLabels = program.filter(b => b.isLabel && b.labelName).map(b => b.labelName);
      if (programLabels.length > 0) {
        loadFileErrorLabelInput.classList.add("has-label-picker");
        const wrapper = document.createElement("div");
        wrapper.className = "label-picker-wrap";
        loadFileErrorLabelInput.parentNode.insertBefore(wrapper, loadFileErrorLabelInput);
        wrapper.appendChild(loadFileErrorLabelInput);
        const dropdown = document.createElement("div");
        dropdown.className = "label-picker-dropdown";
        dropdown.hidden = true;
        dropdown.innerHTML = programLabels.map(n => `<div class="label-picker-item">${n}</div>`).join("");
        document.body.appendChild(dropdown);
        const positionDropdown = () => {
          const r = loadFileErrorLabelInput.getBoundingClientRect();
          dropdown.style.top = (r.bottom + window.scrollY + 4) + "px";
          dropdown.style.left = (r.left + window.scrollX) + "px";
          dropdown.style.width = r.width + "px";
        };
        let dropdownHovered = false;
        const closeDropdown = () => {
          dropdown.hidden = true;
          window.removeEventListener("scroll", positionDropdown, { capture: true });
        };
        loadFileErrorLabelInput.addEventListener("focus", () => {
          positionDropdown();
          dropdown.hidden = false;
          window.addEventListener("scroll", positionDropdown, { capture: true, passive: true });
        });
        loadFileErrorLabelInput.addEventListener("blur", () => {
          if (!dropdownHovered) closeDropdown();
        });
        loadFileErrorLabelInput.addEventListener("keydown", e => { if (e.key === "Escape") closeDropdown(); });
        dropdown.addEventListener("mouseenter", () => { dropdownHovered = true; });
        dropdown.addEventListener("mouseleave", () => { dropdownHovered = false; });
        dropdown.querySelectorAll(".label-picker-item").forEach(item => {
          item.addEventListener("pointerdown", e => {
            e.preventDefault();
            loadFileErrorLabelInput.value = item.textContent;
            loadFileErrorLabelInput.dispatchEvent(new Event("input"));
            closeDropdown();
            dropdownHovered = false;
          });
        });
        document.addEventListener("pointerdown", e => {
          if (!dropdown.contains(e.target) && e.target !== loadFileErrorLabelInput) closeDropdown();
        }, { capture: true });
      }
    }
    const loopRegSelect = node.querySelector(".loop-reg");
    if (loopRegSelect) {
      loopRegSelect.addEventListener("change", (event) => updateProgramBlock(index, "loopReg", event.target.value));
    }
    const loopCountInput = node.querySelector(".loop-count");
    if (loopCountInput) {
      loopCountInput.addEventListener("input", (event) => updateProgramBlock(index, "loopCount", event.target.value));
    }
    const loopLabelInput = node.querySelector(".loop-label");
    if (loopLabelInput) {
      loopLabelInput.addEventListener("input", (event) => updateProgramBlock(index, "loopLabel", event.target.value));
    }
    const nextLabelInput = node.querySelector(".next-label");
    if (nextLabelInput) {
      nextLabelInput.addEventListener("input", (event) => updateProgramBlock(index, "nextLabel", event.target.value));
    }
    const pushRegsInput = node.querySelector(".push-regs");
    if (pushRegsInput) {
      pushRegsInput.addEventListener("input", (event) => updateProgramBlock(index, "pushRegs", event.target.value.toUpperCase()));
    }
    const pullRegsInput = node.querySelector(".pull-regs");
    if (pullRegsInput) {
      pullRegsInput.addEventListener("input", (event) => updateProgramBlock(index, "pullRegs", event.target.value.toUpperCase()));
    }
    const tableNameInput = node.querySelector(".table-name");
    if (tableNameInput) {
      tableNameInput.addEventListener("input", (event) => updateProgramBlock(index, "tableName", event.target.value));
    }
    const tableAddressInput = node.querySelector(".table-address");
    if (tableAddressInput) {
      tableAddressInput.addEventListener("input", (event) => updateProgramBlock(index, "tableAddress", event.target.value));
    }
    const orgAddressInput = node.querySelector(".org-address");
    if (orgAddressInput) {
      orgAddressInput.addEventListener("input", (event) => updateProgramBlock(index, "orgAddress", event.target.value));
    }
    const constNameInput = node.querySelector(".const-name");
    if (constNameInput) {
      constNameInput.addEventListener("input", (event) => updateProgramBlock(index, "constName", event.target.value));
    }
    const constValueInput = node.querySelector(".const-value");
    if (constValueInput) {
      constValueInput.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
    }
    const invokeMacroSelect = node.querySelector(".invoke-macro-select");
    if (invokeMacroSelect) {
      invokeMacroSelect.addEventListener("change", (event) => updateProgramBlock(index, "invokeMacroName", event.target.value));
    }
      const blockModeSelect = node.querySelector(".block-mode");
      if (blockModeSelect) {
        blockModeSelect.addEventListener("change", (event) => updateProgramBlock(index, "addressingMode", event.target.value));
      }

      const moveUpButton = node.querySelector(".move-up");
      const moveDownButton = node.querySelector(".move-down");
      const deleteButton = node.querySelector(".delete");
      moveUpButton.setAttribute("aria-label", t("moveUp"));
      moveUpButton.setAttribute("title", t("moveUp"));
      moveDownButton.setAttribute("aria-label", t("moveDown"));
      moveDownButton.setAttribute("title", t("moveDown"));
      deleteButton.setAttribute("aria-label", t("delete"));
      deleteButton.setAttribute("title", t("delete"));
      moveUpButton.addEventListener("click", () => moveBlock(index, -1));
      moveDownButton.addEventListener("click", () => moveBlock(index, 1));
      deleteButton.addEventListener("click", () => deleteBlock(index));

    if (dragHandle) {
      dragHandle.addEventListener("pointerdown", (e) => {
        startMouseDnd(e, node, { type: "program", index }, block.mnemonic);
      });
    }

    node.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest("input") || e.target.closest("select")) return;
      selectBlockInAsm(block.id);
      const descEl = node.querySelector(".block-description");
      if (descEl && descEl.textContent.trim()) {
        const range = document.createRange();
        range.selectNodeContents(descEl);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });

    if (block.isRegionMacro) {
      // REGION node + wrapper both go into the PARENT wrapper
      // wrapperStack already has the new wrapper pushed; parent is one level up
      const parentEl = wrapperStack.length >= 2
        ? (wrapperStack[wrapperStack.length - 2] || programList)
        : programList;
      parentEl.appendChild(node);          // 1. REGION block card
      if (pendingWrapper) parentEl.appendChild(pendingWrapper); // 2. wrapper for children
    } else if (block.isEndRegionMacro) {
      // ENDREGION node goes into the PARENT wrapper (already popped)
      (activeWrapper() || programList).appendChild(node);
    } else {
      (activeWrapper() || programList).appendChild(node);
    }
  });

  renderAsmOutput();
  renderMemoryMap();

  // Restore block selection highlight after re-render
  if (selectedBlockId) {
    const node = programList.querySelector(`[data-block-id="${selectedBlockId}"]`);
    if (node) node.classList.add("asm-block--selected");
  }

  _expertRenderSymbols();
}

function getMnemonicModes(mnemonic) {
  const items = Object.values(mnemonicLibrary).flat();
  return items.find((item) => item.mnemonic === mnemonic)?.modes || ["implied"];
}

function syntaxHighlightAsmLine(line) {
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const hilightNums = s => esc(s)
    .replace(/(\$[0-9A-Fa-f]+)/g, '<span class="asm-tok-number">$1</span>');

  let prefix = "";
  let content = line;
  const lineNoMatch = line.match(/^(\d+\s\|\s)(.*)$/);
  if (lineNoMatch) {
    prefix = '<span class="asm-tok-lineno">' + esc(lineNoMatch[1]) + '</span>';
    content = lineNoMatch[2];
  }

  // Origin: * = $xxxx  or  *= $xxxx
  if (/^\* ?=/.test(content)) {
    const eqIdx = content.indexOf('=');
    return prefix + '<span class="asm-tok-directive">' + esc(content.slice(0, eqIdx + 1)) + '</span>' + hilightNums(content.slice(eqIdx + 1));
  }

  // Label: "labelname:  ; ..."
  if (/^[A-Za-z_][A-Za-z0-9_]*:/.test(content)) {
    const m = content.match(/^([A-Za-z_][A-Za-z0-9_]*:)(.*)/);
    if (m) return prefix + '<span class="asm-tok-label">' + esc(m[1]) + '</span>' + hilightNums(m[2]);
  }

  // Region comment: "; region ..." / "; endregion ..."
  if (/^; (?:region|endregion)\b/.test(content)) {
    return prefix + '<span class="asm-tok-region">' + esc(content) + '</span>';
  }

  // Macro comment: "; .xxx ..."
  if (/^; \./.test(content)) {
    const m = content.match(/^(; )(\.\S+)(.*)/);
    if (m) return prefix + '<span class="asm-tok-comment">' + esc(m[1]) + '</span><span class="asm-tok-macro">' + esc(m[2]) + '</span>' + hilightNums(m[3]);
  }

  // Regular comment: "; ..."
  if (/^;/.test(content)) {
    return prefix + '<span class="asm-tok-comment">' + esc(content) + '</span>';
  }

  // Indented macro comment: "    ; .text / .string / .data ..."
  if (/^    ; \./.test(content)) {
    const m = content.match(/^(    ; )(\.\S+)(.*)/);
    if (m) return prefix + '<span class="asm-tok-comment">' + esc(m[1]) + '</span><span class="asm-tok-macro">' + esc(m[2]) + '</span>' + hilightNums(m[3]);
  }

  // Directive: "    .byte / .word / .fill / .align / .word"
  const dirMatch = content.match(/^(    )(\.\w+)(.*)/);
  if (dirMatch) {
    return prefix + esc(dirMatch[1]) + '<span class="asm-tok-directive">' + esc(dirMatch[2]) + '</span>' + hilightNums(dirMatch[3]);
  }

  // Instruction: "    MNEMONIC operand  ; comment"
  const instrMatch = content.match(/^(    )([A-Z]{2,4})(.*)/);
  if (instrMatch) {
    const rest = instrMatch[3];
    const commentIdx = rest.indexOf(" ; ");
    const operand = commentIdx !== -1 ? rest.slice(0, commentIdx) : rest;
    const inlineComment = commentIdx !== -1 ? rest.slice(commentIdx) : "";
    return prefix + esc(instrMatch[1]) +
      '<span class="asm-tok-mnemonic">' + esc(instrMatch[2]) + '</span>' +
      (operand ? '<span class="asm-tok-operand">' + hilightNums(operand) + '</span>' : '') +
      (inlineComment ? '<span class="asm-tok-comment">' + esc(inlineComment) + '</span>' : '');
  }

  return prefix + esc(content);
}

function highlightAsmHtml(text) {
  return text.split("\n").map(line => syntaxHighlightAsmLine(line)).join("\n");
}

function withAsmLineNumbers(text) {
  const lines = text.split("\n");
  const width = Math.max(3, String(lines.length).length);
  return lines
    .map((line, idx) => `${String(idx + 1).padStart(width, "0")} | ${line}`)
    .join("\n");
}

function scrollAsmOutputToLine(targetLine) {
  if (!targetLine || !asmDisplayText) return;
  const text = asmDisplayText;
  const lines = text.split("\n");

  asmOutput.innerHTML = "";
  lines.forEach((line, i) => {
    const isTarget = i === targetLine - 1;
    if (isTarget) {
      const span = document.createElement("span");
      span.className = "asm-line-highlight";
      span.textContent = line;
      asmOutput.appendChild(span);
      if (i < lines.length - 1) span.appendChild(document.createTextNode("\n"));
    } else {
      const span = document.createElement("span");
      span.innerHTML = syntaxHighlightAsmLine(line);
      asmOutput.appendChild(span);
      if (i < lines.length - 1) span.appendChild(document.createTextNode("\n"));
    }
  });

  const lineHeight = parseFloat(getComputedStyle(asmOutput).lineHeight) || 18;
  asmOutput.scrollTop = Math.max(0, (targetLine - 3) * lineHeight);
}

function applyAsmHighlight(blockId) {
  const rangeInfo = asmBlockRanges[blockId];
  const text = asmDisplayText || asmPlainText;
  if (!rangeInfo || !text) return;

  const { firstLine, lastLine } = rangeInfo;
  const lines = text.split("\n");

  asmOutput.innerHTML = "";
  lines.forEach((line, i) => {
    const isHighlighted = i >= firstLine && i <= lastLine;
    if (isHighlighted) {
      const span = document.createElement("span");
      span.className = "asm-line-highlight";
      span.textContent = line;
      asmOutput.appendChild(span);
      // display:block already breaks the line — only add \n for copy-paste on non-last lines
      if (i < lines.length - 1) span.appendChild(document.createTextNode("\n"));
    } else {
      const span = document.createElement("span");
      span.innerHTML = syntaxHighlightAsmLine(line);
      asmOutput.appendChild(span);
      if (i < lines.length - 1) asmOutput.appendChild(document.createTextNode("\n"));
    }
  });

  const lineHeight = parseFloat(getComputedStyle(asmOutput).lineHeight) || 18;
  asmOutput.scrollTop = Math.max(0, (firstLine - 3) * lineHeight);
}

function selectBlockInAsm(blockId) {
  selectedBlockId = blockId;

  // Highlight the block card
  document.querySelectorAll(".asm-block--selected").forEach(el => el.classList.remove("asm-block--selected"));
  const blockNode = programList.querySelector(`[data-block-id="${blockId}"]`);
  if (blockNode) blockNode.classList.add("asm-block--selected");

  applyAsmHighlight(blockId);
  _syncPaletteToBlock(blockId);
}

function renderAsmOutput() {
  const layout = getProgramLayout();

  if (!program.length) {
    asmPlainText = `*= ${layout.origin.text}\n; ${currentLanguage === "en" ? "The C64 assembly source will appear here" : "Itt fog megjelenni a C64 assembly kod"}`;
    asmDisplayText = withAsmLineNumbers(asmPlainText);
    asmOutput.innerHTML = highlightAsmHtml(asmDisplayText);
    renderMonitorOutput(layout);
    renderDisasmOutput();
    return;
  }

  const deferredDataSections = [];
  const codeLines = layout.lines.map((line, index) => {
    const lineNumber = `${(index + 1).toString().padStart(2, "0")}`;

    // Handle conditionally skipped blocks (inactive IF branch)
    if (line.conditionallySkipped) {
      const summary = line.block.operand || "";
      return `; [IF skipped] ${line.block.mnemonic}${summary ? " " + summary : ""}`;
    }

    // Handle INVOKE block header line
    if (line.block._isMacroInvokeHeader) {
      return `; .invoke ${line.block.invokeMacroName || "?"}`;
    }

    // Invisible layout markers — address save/restore for INCLUDE with fixed address
    if (line.block._isSavedAddress || line.block._isRestoreAddress) return null;

    // Handle macro source blocks (body of MACRO/ENDM definition when toggle is on)
    if (line.block._macroSourceBlock) {
      if (line.block.isLabel) return `    ${line.block.labelName}:`;
      if (line.block.isAnonymousLabel) return `    -`;
      if (line.block.isComment) return `    ; ${line.block.rawOperand || ""}`;
      const macroSrcError = getLiveValidationError(line.block);
      if (macroSrcError) {
        const suffix = line.block.operand ? ` ${line.block.operand}` : "";
        return `    ${line.block.mnemonic}${suffix}  ; ${t("warningLabel")}: ${macroSrcError}`;
      }
      const suffix = line.block.operand ? ` ${line.block.operand}` : "";
      return `    ${line.block.mnemonic}${suffix}`;
    }

    // Check if this line came from a macro expansion
    if (line.block._fromMacro) {
      const macroName = line.block._fromMacro;
      // Show expansion header only for legacy expansions (not INVOKE-based)
      const isFirstInMacro = !line.block._invokeBlockId &&
        (index === 0 || layout.lines[index - 1].block._fromMacro !== macroName);
      const prefix = isFirstInMacro ? `; >>> Macro expansion: ${macroName}\n` : "";

      // Generate the code for this expanded block
      let expandedCode = "";
      if (line.block.isAnonymousLabel) {
        expandedCode = "-";
      } else if (line.block.isLabel) {
        expandedCode = `${line.block.labelName}:`;
      } else if (line.block.isComment) {
        expandedCode = `; ${line.block.rawOperand || ""}`;
      } else {
        const suffix = line.block.operand ? ` ${line.block.operand}` : "";
        expandedCode = `    ${line.block.mnemonic}${suffix}`;
      }

      return prefix + expandedCode;
    }

    if (line.block.isLabel) {
      return `${line.block.labelName}:  ; ${formatAddress(line.address)}`;
    }

    if (line.block.isAnonymousLabel) {
      return `-  ; ${formatAddress(line.address)}`;
    }

    if (line.block.isComment) {
      return `; ${line.block.rawOperand || ""}`;
    }

    if (line.block.isRegionMacro) {
      if (!showRegionComments) return null;
      return `; region ${line.block.regionName || "region"}`;
    }

    if (line.block.isEndRegionMacro) {
      if (!showRegionComments) return null;
      let regionName = "region";
      let depth = 0;
      for (let i = index - 1; i >= 0; i--) {
        if (layout.lines[i].block.isEndRegionMacro) { depth++; }
        else if (layout.lines[i].block.isRegionMacro) {
          if (depth === 0) { regionName = layout.lines[i].block.regionName || "region"; break; }
          depth--;
        }
      }
      return `; endregion ${regionName}`;
    }

    if (line.block.isTextMacro) {
      const chars = encodeTextMacro(line.block.rawOperand);
      const startAddress = 0x0400 + ((line.block.textY ?? 0) * 40) + (line.block.textX ?? 0);
      const expanded = chunkBytes(chars, 16).map((chunk, chunkIndex) => {
        const chunkAddress = startAddress + (chunkIndex * 16);
        const byteList = chunk.map((byte) => toHex(byte, 2)).join(", ");
        return `    ; ${formatAddress(chunkAddress)}\n    .byte ${byteList}`;
      }).join("\n");
      deferredDataSections.push({
        address: startAddress,
        text: `${line.block.macroLabel ? line.block.macroLabel.trim() : `text_${lineNumber}`}:\n    ; .text "${line.block.rawOperand || ""}" -> screen (${line.block.textX ?? 0}, ${line.block.textY ?? 0})\n${expanded}`
      });
      const textLabel = line.block.macroLabel ? line.block.macroLabel.trim() : `text_${lineNumber}`;
      return `; .text ${textLabel}`;
    }

    if (line.block.isByteMacro) {
      const asmBytes = parseByteMacro(line.block.rawOperand, line.block.base);
      const asmByteList = asmBytes.map(b => toHex(b, 2)).join(", ");
      return `    .byte ${asmByteList}`;
    }

    if (line.block.isStringMacro) {
      const rawOffset = parseInt(line.block.charOffset || "0", 16);
      const chars = encodeTextMacro(line.block.rawOperand).map(b => (b + (isNaN(rawOffset) ? 0 : rawOffset)) & 0xFF);
      const startAddress = parseAddressValue(line.block.stringAddress) ?? 0xC000;
      const expanded = chunkBytes(chars, 16).map((chunk, chunkIndex) => {
        const chunkAddress = startAddress + (chunkIndex * 16);
        const byteList = chunk.map((byte) => toHex(byte, 2)).join(", ");
        return `    ; ${formatAddress(chunkAddress)}\n    .byte ${byteList}`;
      }).join("\n");
      deferredDataSections.push({
        address: startAddress,
        text: `${line.block.macroLabel ? line.block.macroLabel.trim() : `string_${lineNumber}`}:\n    ; .string "${line.block.rawOperand || ""}" -> ${formatAddress(startAddress)}\n${expanded}`
      });
      const stringLabel = line.block.macroLabel ? line.block.macroLabel.trim() : `string_${lineNumber}`;
      return `; .string ${stringLabel}`;
    }

    if (line.block.isDataMacro) {
      const dataBytes = parseByteMacro(line.block.rawOperand, line.block.base);
      const startAddress = parseAddressValue(line.block.dataAddress) ?? 0xC000;
      const expanded = chunkBytes(dataBytes, 16).map((chunk, chunkIndex) => {
        const chunkAddress = startAddress + (chunkIndex * 16);
        const byteList = chunk.map((byte) => toHex(byte, 2)).join(", ");
        return `    ; ${formatAddress(chunkAddress)}\n    .byte ${byteList}`;
      }).join("\n");
      deferredDataSections.push({
        address: startAddress,
        text: `${line.block.macroLabel ? line.block.macroLabel.trim() : `data_${lineNumber}`}:\n    ; .data ${line.block.rawOperand || ""} -> ${formatAddress(startAddress)}\n${expanded}`
      });
      const dataLabel = line.block.macroLabel ? line.block.macroLabel.trim() : `data_${lineNumber}`;
      return `; .data ${dataLabel}`;
    }

    if (line.block.isRawBytesMacro) {
      const rawBytes = parseByteMacro(line.block.rawOperand, line.block.base);
      const startAddress = parseAddressValue(line.block.rawBytesAddress) ?? 0xC000;
      const expanded = chunkBytes(rawBytes, 16).map((chunk, chunkIndex) => {
        const chunkAddress = startAddress + (chunkIndex * 16);
        const byteList = chunk.map((byte) => toHex(byte, 2)).join(", ");
        return `    ; ${formatAddress(chunkAddress)}\n    .byte ${byteList}`;
      }).join("\n");
      deferredDataSections.push({
        address: startAddress,
        text: `${line.block.macroLabel ? line.block.macroLabel.trim() : `rawbytes_${lineNumber}`}:\n    ; .rawbytes ${line.block.rawOperand || ""} -> ${formatAddress(startAddress)}\n${expanded}`
      });
      const rawbytesLabel = line.block.macroLabel ? line.block.macroLabel.trim() : `rawbytes_${lineNumber}`;
      return `; .rawbytes ${rawbytesLabel}`;
    }

    if (line.block.isIncBinMacro) {
      const bytes = line.block.incBinBytes || [];
      const startAddress = parseAddressValue(line.block.incBinAddress) ?? 0xC000;
      const fileName = line.block.incBinFileName || line.block.incBinFile || "?";
      if (bytes.length > 0) {
        const expanded = chunkBytes(Array.from(bytes), 16).map((chunk, chunkIndex) => {
          const chunkAddress = startAddress + (chunkIndex * 16);
          const byteList = chunk.map((byte) => toHex(byte, 2)).join(", ");
          return `    ; ${formatAddress(chunkAddress)}\n    .byte ${byteList}`;
        }).join("\n");
        deferredDataSections.push({
          address: startAddress,
          text: `incbin_${lineNumber}:\n    ; .incbin "${fileName}" -> ${formatAddress(startAddress)}\n${expanded}`
        });
        return `; .incbin incbin_${lineNumber} (${bytes.length} bytes)`;
      }
      return `; .incbin "${fileName}" @ ${formatAddress(startAddress)} (${currentLanguage === "en" ? "no file loaded" : "nincs betoltott fajl"})`;
    }

    if (line.block.isSidMacro) {
      const bytes = line.block.sidBytes || [];
      const fileName = line.block.sidFileName || "?";
      const customAddr = line.block.sidCustomAddress ? parseAddressValue(line.block.sidCustomAddress.replace(/^\$/, "")) : null;
      const load = customAddr ?? line.block.sidLoadAddress ?? 0;
      const addrOffset = (customAddr !== null && line.block.sidLoadAddress) ? customAddr - line.block.sidLoadAddress : 0;
      const init = (line.block.sidInitAddress || 0) + addrOffset;
      const play = (line.block.sidPlayAddress || 0) + addrOffset;
      if (bytes.length > 0 && load > 0) {
        const overrideNote = addrOffset !== 0 ? " [relocated]" : "";
        return `; .sid "${fileName}" @ ${formatAddress(load)}${overrideNote}  init:${formatAddress(init)}  play:${formatAddress(play)}  (${bytes.length} bytes)`;
      }
      return `; .sid "${fileName}" (${currentLanguage === "en" ? "no file loaded" : "nincs betoltott fajl"})`;
    }

    if (line.block.isIncludeMacro) {
      const count = (line.block.includedBlocks || []).length;
      const fname = line.block.includeFileName || "?";
      const addrNote = line.block.includeAddress ? ` @ $${line.block.includeAddress.replace(/^\$/, "").toUpperCase().padStart(4, "0")}` : "";
      if (count === 0) return `; .include "${fname}"${addrNote} (${currentLanguage === "en" ? "no blocks loaded" : "nincsenek blokkok betoltve"})`;
      return `; .include "${fname}"${addrNote} — ${count} ${t("includeBlocksCount")}`;
    }

    if (line.block.isRawTextMacro) {
      const rawOffset = parseInt(line.block.charOffset || "0", 16);
      const chars = encodeTextMacro(line.block.rawOperand).map(b => (b + (isNaN(rawOffset) ? 0 : rawOffset)) & 0xFF);
      const startAddress = parseAddressValue(line.block.rawTextAddress) ?? 0xC000;
      const expanded = chunkBytes(chars, 16).map((chunk, chunkIndex) => {
        const chunkAddress = startAddress + (chunkIndex * 16);
        const byteList = chunk.map((byte) => toHex(byte, 2)).join(", ");
        return `    ; ${formatAddress(chunkAddress)}\n    .byte ${byteList}`;
      }).join("\n");
      deferredDataSections.push({
        address: startAddress,
        text: `${line.block.macroLabel ? line.block.macroLabel.trim() : `rawtext_${lineNumber}`}:\n    ; .rawtext "${line.block.rawOperand || ""}" -> ${formatAddress(startAddress)}\n${expanded}`
      });
      const rawtextLabel = line.block.macroLabel ? line.block.macroLabel.trim() : `rawtext_${lineNumber}`;
      return `; .rawtext ${rawtextLabel}`;
    }

    if (line.block.isPetsciiMacro) {
      const chars = encodePetsciiMacro(line.block.rawOperand);
      const startAddress = parseAddressValue(line.block.petsciiAddress) ?? 0xC000;
      const expanded = chunkBytes(chars, 16).map((chunk, chunkIndex) => {
        const chunkAddress = startAddress + (chunkIndex * 16);
        const byteList = chunk.map((byte) => toHex(byte, 2)).join(", ");
        return `    ; ${formatAddress(chunkAddress)}\n    .byte ${byteList}`;
      }).join("\n");
      deferredDataSections.push({
        address: startAddress,
        text: `${line.block.macroLabel ? line.block.macroLabel.trim() : `petscii_${lineNumber}`}:\n    ; .petscii "${line.block.rawOperand || ""}" -> ${formatAddress(startAddress)}\n${expanded}`
      });
      const petsciiLabel = line.block.macroLabel ? line.block.macroLabel.trim() : `petscii_${lineNumber}`;
      return `; .petscii ${petsciiLabel}`;
    }

    if (line.block.isLoopMacro || line.block.isForMacro) {
      const reg = line.block.loopReg || "X";
      const rawCount = (line.block.loopCount || "00").trim();
      const parsedCount = /^\d+$/.test(rawCount) ? parseInt(rawCount, 10) : parseInt(rawCount, 16);
      const countHex = isNaN(parsedCount) ? rawCount.toUpperCase() : parsedCount.toString(16).toUpperCase().padStart(2, "0");
      const label = line.block.loopLabel || "loop";
      if (line.block.isForMacro) {
        return `    LD${reg} #$00\n${label}:`;
      }
      return `    LD${reg} #$${countHex}\n${label}:`;
    }

    if (line.block.isNextMacro) {
      const reg = line.block.nextReg || "X";
      const label = line.block.nextLabel || "loop";
      return `    DE${reg}\n    BNE ${label}`;
    }

    if (line.block.isEndfMacro) {
      const reg = line.block.nextReg || "X";
      const label = line.block.nextLabel || "loop";
      const rawCount = (line.block.nextCount || "00").trim();
      const parsedCount = /^\d+$/.test(rawCount) ? parseInt(rawCount, 10) : parseInt(rawCount, 16);
      const countStr = isNaN(parsedCount) ? rawCount.toUpperCase() : `$${parsedCount.toString(16).toUpperCase().padStart(2, "0")}`;
      return `    IN${reg}\n    CP${reg} #${countStr}\n    BNE ${label}`;
    }

    if (line.block.isPushMacro) {
      const regs = (line.block.pushRegs || "A").toUpperCase();
      const lines = [];
      for (let i = 0; i < regs.length; i++) {
        const reg = regs[i];
        if (reg === 'A') {
          lines.push("    PHA");
        } else if (reg === 'X') {
          lines.push("    TXA");
          lines.push("    PHA");
        } else if (reg === 'Y') {
          lines.push("    TYA");
          lines.push("    PHA");
        }
      }
      return lines.join("\n");
    }

    if (line.block.isPullMacro) {
      const regs = (line.block.pullRegs || "A").toUpperCase();
      const lines = [];
      // PULL in reverse order
      for (let i = regs.length - 1; i >= 0; i--) {
        const reg = regs[i];
        if (reg === 'A') {
          lines.push("    PLA");
        } else if (reg === 'X') {
          lines.push("    PLA");
          lines.push("    TAX");
        } else if (reg === 'Y') {
          lines.push("    PLA");
          lines.push("    TAY");
        }
      }
      return lines.join("\n");
    }

    if (line.block.isWordMacro) {
      const words = parseWordMacro(line.block.rawOperand, line.block.base);
      const wordList = words.map(w => `$${toHex(w, 4)}`).join(", ");
      return `    .word ${wordList}`;
    }

    if (line.block.isFillMacro) {
      const parsed = parseFillMacro(line.block.rawOperand, line.block.base);
      if (parsed) {
        return `    .fill ${parsed.count}, $${toHex(parsed.value, 2)}`;
      }
      return `    ; FILL: invalid parameters`;
    }

    if (line.block.isAlignMacro) {
      const boundary = parseNumberByBase(line.block.rawOperand.replace(/^\$/, ""), line.block.base);
      if (boundary) {
        const remainder = line.address % boundary;
        const padding = remainder === 0 ? 0 : boundary - remainder;
        const targetAddr = line.address + padding;
        return `; .align ${boundary} \u2192 ${formatAddress(targetAddr)} (${padding} bytes)`;
      }
      return `; .align invalid boundary`;
    }

    if (line.block.isTableMacro) {
      return `${line.block.tableName || "table"}:`;
    }

    if (line.block.isOrgMacro) {
      return `* = $${(line.block.orgAddress || "0900").toUpperCase()}`;
    }

    if (line.block.isRegionMacro) {
      if (!showRegionComments) return null;
      return `; region ${line.block.regionName || "region"}`;
    }

    if (line.block.isEndRegionMacro) {
      if (!showRegionComments) return null;
      let regionName = "region";
      let depth = 0;
      for (let i = index - 1; i >= 0; i--) {
        if (layout.lines[i].block.isEndRegionMacro) { depth++; }
        else if (layout.lines[i].block.isRegionMacro) {
          if (depth === 0) { regionName = layout.lines[i].block.regionName || "region"; break; }
          depth--;
        }
      }
      return `; endregion ${regionName}`;
    }

    if (line.block.isDefineMacro) {
      return `; .DEFINE ${line.block.defineSymbol || "?"}`;
    }

    if (line.block.isConstMacro) {
      const constVal = parseNumberByBase((line.block.rawOperand || "").replace(/^\$/, ""), line.block.base);
      const formatted = constVal !== null ? formatOperand("absolute", constVal, line.block.base || "hex") : "?";
      return `; .CONST ${line.block.constName || "?"} = ${formatted}`;
    }

    if (line.block.isIfMacro) {
      return `; .IF ${line.block.ifCondition || "?"}`;
    }

    if (line.block.isElseMacro) {
      return `; .ELSE`;
    }

    if (line.block.isEndIfMacro) {
      return `; .ENDIF`;
    }

    if (line.block.isMacroDefStart) {
      return `; .MACRO ${line.block.macroName || "?"}`;
    }

    if (line.block.isMacroDefEnd) {
      return `; .ENDM`;
    }

    if (line.block.isSpriteInitMacro) {
      const pageHex = (line.block.spriteDataPage || "21").replace(/^\$/, "").toUpperCase().padStart(2, "0");
      return `; .sprite_init #${line.block.spriteNum || "0"} col=${line.block.spriteColor || "7"} page=$${pageHex}`;
    }

    if (line.block.isLoadFileMacro) {
      const fname = (line.block.loadFileName || "").trim() || "?";
      const dev = line.block.loadFileDevice || "8";
      const addr = (line.block.loadFileAddress || "").trim();
      const errLbl = (line.block.loadFileErrorLabel || "").trim();
      const addrPart = addr ? ` addr=$${addr.replace(/^\$/, "").toUpperCase()}` : "";
      const errPart = errLbl ? ` err=${errLbl}` : "";
      return `; .loadfile "${fname}" dev=${dev}${addrPart}${errPart}`;
    }

    if (line.block.isSpritePosMacro) {
      return `; .sprite_pos #${line.block.spriteNum || "0"} x=${line.block.spriteX || "152"} y=${line.block.spriteY || "100"}`;
    }

    if (line.block.isWaitRasterMacro) {
      return `; .wait_raster $${(line.block.rasterLine || "FF").toUpperCase()}`;
    }

    if (line.block.isTurboSetMacro) {
      const spd = parseInt(line.block.turboSpeed || "7", 10);
      const bl = line.block.turboBadline === "1" ? "off" : "on";
      return `; .TURBO_SET speed=${spd} badline=${bl}`;
    }

    if (line.block.isSuperCpuDetectMacro) {
      return `; .SUPERCPU_DETECT`;
    }

    if (line.block.isTurboEnableMacro) {
      return `; .TURBO_ENABLE ${(line.block.turboEnableMode || "on").toUpperCase()}`;
    }

    if (line.block.isJoystickMacro) {
      return `; .joystick port=${line.block.joyPort || "2"} sprite=${line.block.joySpriteNum || "0"}`;
    }

    if (line.block.isMouseMacro) {
      const zpX = (line.block.mousePotXZP || "FD").toUpperCase();
      const zpY = (line.block.mousePotYZP || "FE").toUpperCase();
      return `; .mouse port=${line.block.mousePort || "2"} sprite=${line.block.mouseSpriteNum || "0"} zp=$${zpX}/$${zpY}`;
    }

    if (line.block.isSpriteColMacro) {
      return `; .sprite_col #${line.block.spriteNum || "0"} ${line.block.colType || "sprite"}`;
    }

    if (line.block.isReuCheckMacro) {
      return `; .REU_CHECK`;
    }

    if (line.block.isReuTransferMacro) {
      const cmd = line.block.mnemonic === "REU_STASH" ? "STASH" : line.block.mnemonic === "REU_FETCH" ? "FETCH" : "SWAP";
      const c64 = (line.block.reuC64Addr || "C000").replace(/^\$/, "").toUpperCase().padStart(4, "0");
      const exp = (line.block.reuExpAddr || "0000").replace(/^\$/, "").toUpperCase().padStart(4, "0");
      const bank = line.block.reuBank || "0";
      const len  = (line.block.reuLength || "0100").replace(/^\$/, "").toUpperCase().padStart(4, "0");
      return `; .REU_${cmd} $${c64} → REU${bank}:$${exp} len=$${len}`;
    }

    const suffix = line.block.operand ? ` ${getAsmDisplayOperand(line.block)}` : "";
    const liveError = getLiveValidationError(line.block);
    const comment = liveError ? ` ; ${t("warningLabel")}: ${liveError}` : "";
    return `    ${line.block.mnemonic}${suffix}${comment}`;
  });

  deferredDataSections.sort((left, right) => left.address - right.address);

  // Build block → line-number index for ASM selection (no header line, ORG block is line 0)
  asmBlockRanges = {};
  let textLineNum = 0;
  codeLines.forEach((codeLine, i) => {
    if (codeLine === null) return; // suppressed line (e.g. region comment hidden) — not in output
    const block = layout.lines[i].block;
    const key = block._fromInclude || (block._fromMacro ? (block._invokeBlockId || null) : block.id);
    const linesInEntry = codeLine.split("\n").length;
    if (key) {
      if (!asmBlockRanges[key]) {
        asmBlockRanges[key] = { firstLine: textLineNum, lastLine: textLineNum + linesInEntry - 1 };
      } else {
        asmBlockRanges[key].lastLine = textLineNum + linesInEntry - 1;
      }
    }
    textLineNum += linesInEntry;
  });

  let asmText = [
    ...codeLines.filter(line => line !== null),
    ...(deferredDataSections.length
      ? ["", `; ${t("remoteMemoryData")}`, "", ...deferredDataSections.map((section) => section.text)]
      : [])
  ].join("\n");

  asmPlainText = asmText;
  asmDisplayText = withAsmLineNumbers(asmText);
  asmOutput.innerHTML = highlightAsmHtml(asmDisplayText);

  if (selectedBlockId && asmBlockRanges[selectedBlockId]) {
    applyAsmHighlight(selectedBlockId);
  }

  renderMonitorOutput(layout);
  renderDisasmOutput();

  // Keep overlap badge and panel in sync on every ASM render (reuses layout)
  renderMemoryMap(getMemoryUsage(layout));
}

function _buildMonitorText(layout) {
  if (!program.length) return `>${formatAddress(layout.origin.value)}`;

  const memMap = new Map();
  const labels = new Map();
  const deferredSections = getDeferredMemorySections(layout);

  layout.lines.forEach((line) => {
    if (line.block.isLabel) {
      labels.set(line.block.labelName, line.address);
    }
    if (line.block.isLoopMacro && line.block.loopLabel) {
      labels.set(line.block.loopLabel, line.address + 2);
    }
    if (line.block.isForMacro && line.block.loopLabel) {
      labels.set(line.block.loopLabel, line.address + 2);
    }
    if (line.block.isTableMacro && line.block.tableName) {
      const tableAddr = line.block.tableAddress
        ? (parseAddressValue(line.block.tableAddress) ?? line.address)
        : line.address;
      labels.set(line.block.tableName, tableAddr);
    }
    if (line.block.isConstMacro && line.block.constName) {
      const constVal = parseNumberByBase((line.block.rawOperand || "").replace(/^\$/, ""), line.block.base);
      if (constVal !== null) {
        labels.set(line.block.constName, constVal);
      }
    }
  });
  labels._anonAddrs = _collectAnonLabels(layout);

  for (const line of layout.lines) {
    if (line.block.isLabel || line.block.isComment) continue;
    const compiled = compileLineBytes(line, labels);
    if (!compiled.ok) continue;
    compiled.bytes.forEach((byte, i) => memMap.set(line.address + i, byte));
  }

  deferredSections.forEach((section) => {
    section.bytes.forEach((byte, i) => memMap.set(section.address + i, byte));
  });

  if (!memMap.size) return `>${formatAddress(layout.origin.value)}`;

  const allAddresses = [...memMap.keys()].sort((a, b) => a - b);
  const GAP_THRESHOLD = 256;
  const segments = [];
  let segStart = allAddresses[0];
  let segEnd = allAddresses[0];
  for (let i = 1; i < allAddresses.length; i++) {
    if (allAddresses[i] - segEnd > GAP_THRESHOLD) {
      segments.push({ start: segStart & ~0x7, end: segEnd });
      segStart = allAddresses[i];
    }
    segEnd = allAddresses[i];
  }
  segments.push({ start: segStart & ~0x7, end: segEnd });

  const rows = [];
  segments.forEach((seg, segIndex) => {
    if (segIndex > 0) rows.push("");
    for (let addr = seg.start; addr <= seg.end; addr += 8) {
      const byteValues = [];
      for (let i = 0; i < 8; i++) {
        byteValues.push(memMap.get(addr + i));
      }
      const hexPart = byteValues.map((b) => b !== undefined ? b.toString(16).toUpperCase().padStart(2, "0") : "..").join(" ");
      const charPart = byteValues.map((b) => {
        if (b === undefined) return " ";
        if (b >= 0x20 && b <= 0x7E) return String.fromCharCode(b);
        return ".";
      }).join("");
      rows.push(`>${formatAddress(addr)}  ${hexPart}  |${charPart}|`);
    }
  });

  return rows.join("\n");
}

function renderMonitorOutput(layout = getProgramLayout()) {
  monitorOutput.textContent = _buildMonitorText(layout);
}

function chunkBytes(bytes, size) {
  const chunks = [];
  for (let index = 0; index < bytes.length; index += size) {
    chunks.push(bytes.slice(index, index + size));
  }
  return chunks;
}

function sanitizeLabelName(value) {
  const sanitized = value.replace(/[^A-Za-z0-9_]/g, "_").replace(/^[^A-Za-z_]+/, "");
  return sanitized || "start";
}

async function loadSampleFromFile(sampleName) {
  if (!window.electronAPI?.loadSample) {
    console.error("Sample loading not available");
    return false;
  }

  const result = await window.electronAPI.loadSample(sampleName);
  if (!result?.ok || !result?.sample) {
    console.error("Failed to load sample:", sampleName);
    return false;
  }

  const sampleData = result.sample;
  const useExpertTextProgram = sampleData?.useExpertTextProgram === true && typeof sampleData.expertText === "string";
  program = useExpertTextProgram
    ? collapseLoadedProgram(parseExpertText(sampleData.expertText))
    : collapseLoadedProgram(sampleData.program);

  // Migrate old samples: if no ORG block, prepend one from saved origin
  if (!program.some(b => b.isOrgMacro)) {
    const orgAddr = (sampleData.origin || "0801").replace(/^\$/, "").toUpperCase().padStart(4, "0");
    program.unshift({ ...makeDefaultOrgBlock(), orgAddress: orgAddr });
  }

  await reloadIncludeBlocks(result.filePath || "");

  d64ExportState.extras = [];
  d64ExportState._pendingExtras = null;
  d64ExportState._pendingExtrasBaseDir = "";
  if (sampleData.d64) {
    d64ExportState.diskName = sampleData.d64.diskName || "";
    d64ExportState.progName = sampleData.d64.progName || "";
    // Use pre-loaded bytes returned by the Rust load_sample command (most reliable)
    if (Array.isArray(result.extrasLoaded) && result.extrasLoaded.length > 0) {
      d64ExportState.extras = result.extrasLoaded.map(e => ({
        name: e.name || "",
        sourcePath: e.sourcePath || "",
        loadAddress: e.loadAddress || "",
        bytes: e.bytes
      }));
    } else {
      // Fallback: lazy-load via readBinFile when the dialog is opened
      const rawExtras = Array.isArray(sampleData.d64.extras) ? sampleData.d64.extras : [];
      if (rawExtras.length > 0) {
        const fp = typeof result.filePath === "string" ? result.filePath : "";
        const s = Math.max(fp.lastIndexOf("/"), fp.lastIndexOf("\\"));
        const baseDir = s >= 0 ? fp.slice(0, s) : "";
        d64ExportState._pendingExtras = rawExtras;
        d64ExportState._pendingExtrasBaseDir = baseDir;
      }
    }
  } else {
    d64ExportState.diskName = "";
    d64ExportState.progName = "";
  }

  renderOriginPreview();
  renderEmulatorRunHint();
  parseUserMacros();  // Parse any user-defined macros in the loaded sample
  renderProgram();
  if (expertMode) _expertSyncFromProgram();
  saveUiSettings();

  // Update file display with sample name
  const displayName = `${sampleName}.c64va`;
  _setCurrentFile(displayName, displayName);
  markTabClean();

  return true;
}

async function loadSampleProgram() {
  await loadSampleFromFile("basic-colors");
}

async function loadClearScreenSampleProgram() {
  await loadSampleFromFile("clear-screen");
}

async function loadLabelSampleProgram() {
  await loadSampleFromFile("label-border");
}

async function loadTextSampleProgram() {
  await loadSampleFromFile("text-demo");
}

async function loadLowercaseTextDemo() {
  await loadSampleFromFile("lowercase-text-demo");
}

async function loadMacroDemoProgram() {
  await loadSampleFromFile("macro-demo");
}

async function loadSpriteSampleProgram() {
  await loadSampleFromFile("sprite-demo");
}

async function loadSpriteMacroDemoProgram() {
  await loadSampleFromFile("sprite-macro-demo");
}

async function loadJoystickDemoProgram() {
  await loadSampleFromFile("joystick-demo");
}

async function loadMouseDemoProgram() {
  await loadSampleFromFile("mouse-demo");
}

async function loadCollisionDemoProgram() {
  await loadSampleFromFile("collision-demo");
}

async function loadSetpixelDemo() {
  await loadSampleFromFile("setpixel-demo");
}

async function loadLoopSampleProgram() {
  await loadSampleFromFile("loop-demo");
}

async function loadBitmapLineSampleProgram() {
  await loadSampleFromFile("bitmap-demo");
}

async function loadHelloLoopSampleProgram() {
  await loadSampleFromFile("hello-loop-demo");
}

async function loadMacroTest() {
  await loadSampleFromFile("macro-test");
}

async function loadPushPullDemo() {
  await loadSampleFromFile("push-pull-demo");
}

async function loadUserMacroDemo() {
  await loadSampleFromFile("user-macro-demo");
}

async function loadLoadFileDemo() {
  await loadSampleFromFile("loadfile-demo");
}

async function loadIncBinDemo() {
  const ok = await loadSampleFromFile("incbin-demo");
  if (!ok) return;

  // Actually load the demo binary file from disk
  if (window.electronAPI?.loadIncBinSampleFile) {
    const result = await window.electronAPI.loadIncBinSampleFile("demo-colors.bin");
    if (result && !result.error) {
      const incBinIdx = program.findIndex(b => b.isIncBinMacro);
      if (incBinIdx >= 0) {
        program[incBinIdx].incBinFileName = result.fileName;
        program[incBinIdx].incBinFile = result.filePath;
        program[incBinIdx].incBinBytes = result.bytes;
        program[incBinIdx].validationError = validateIncBinMacro(result.bytes, program[incBinIdx].incBinAddress);
        renderProgram();
        if (expertMode) _expertSyncFromProgram();
      }
    }
  }
}

async function loadIncludeDemo() {
  await loadSampleFromFile("include-demo");
}

async function loadSidDemo() {
  const ok = await loadSampleFromFile("sid-demo");
  if (!ok) return;

  if (window.electronAPI?.loadIncBinSampleFile) {
    const result = await window.electronAPI.loadIncBinSampleFile("Ikari_Intro_music.bin");
    if (result && !result.error) {
      const incBinIdx = program.findIndex(b => b.isIncBinMacro);
      if (incBinIdx >= 0) {
        program[incBinIdx].incBinFileName = result.fileName;
        program[incBinIdx].incBinFile = result.filePath;
        program[incBinIdx].incBinBytes = result.bytes;
        program[incBinIdx].validationError = "";
        renderProgram();
        if (expertMode) _expertSyncFromProgram();
        renderAsmOutput();
      }
    }
  }
}

async function loadIfElseDemo() {
  await loadSampleFromFile("if-else");
}

async function load10PrintDemo() {
  await loadSampleFromFile("10-print");
}

async function loadRasterIrqDemo() {
  await loadSampleFromFile("irq-demo");
}

async function loadOverlappingRasterDemo() {
  await loadSampleFromFile("overlapping-raster-demo");
}

async function loadMemoryOverlapDemo() {
  await loadSampleFromFile("memory-overlap-demo");
}

async function loadRandLinesDemo() {
  await loadSampleFromFile("rand-lines-demo");
}

async function loadReuDemo() {
  await loadSampleFromFile("reu-demo");
}

async function loadScrollTextDemo() {
  await loadSampleFromFile("scroll-text-demo");
}

async function loadSidDirectDemo() {
  const ok = await loadSampleFromFile("sid-direct-demo");
  if (!ok) return;

  if (window.electronAPI?.loadSidSampleFile) {
    const result = await window.electronAPI.loadSidSampleFile("Ikari_Intro.sid");
    if (result && !result.error) {
      const sidIdx = program.findIndex(b => b.isSidMacro);
      if (sidIdx >= 0) {
        program[sidIdx].sidFile = result.filePath;
        program[sidIdx].sidFileName = result.fileName;
        program[sidIdx].sidTitle = result.title || "";
        program[sidIdx].sidAuthor = result.author || "";
        program[sidIdx].sidLoadAddress = result.loadAddress;
        program[sidIdx].sidInitAddress = result.initAddress;
        program[sidIdx].sidPlayAddress = result.playAddress;
        program[sidIdx].sidBytes = result.bytes;
        program[sidIdx].validationError = "";
        renderProgram();
        if (expertMode) _expertSyncFromProgram();
        renderAsmOutput();
      }
    }
  }
}

// === OLD INLINE CODE BELOW (KEPT FOR REFERENCE, NOT EXECUTED) ===
function loadSelectedSample() {
  if (sampleSelect.value === "label-border") {
    loadLabelSampleProgram();
    return;
  }

  if (sampleSelect.value === "text-demo") {
    loadTextSampleProgram();
    return;
  }

  if (sampleSelect.value === "lowercase-text-demo") {
    loadLowercaseTextDemo();
    return;
  }

  if (sampleSelect.value === "clear-screen") {
    loadClearScreenSampleProgram();
    return;
  }

  if (sampleSelect.value === "macro-demo") {
    loadMacroDemoProgram();
    return;
  }

  if (sampleSelect.value === "sprite-demo") {
    loadSpriteSampleProgram();
    return;
  }

  if (sampleSelect.value === "joystick-demo") {
    loadJoystickDemoProgram();
    return;
  }

  if (sampleSelect.value === "mouse-demo") {
    loadMouseDemoProgram();
    return;
  }

  if (sampleSelect.value === "collision-demo") {
    loadCollisionDemoProgram();
    return;
  }

  if (sampleSelect.value === "sprite-macro-demo") {
    loadSpriteMacroDemoProgram();
    return;
  }

  if (sampleSelect.value === "setpixel-demo") {
    loadSetpixelDemo();
    return;
  }

  if (sampleSelect.value === "bitmap-demo") {
    loadBitmapLineSampleProgram();
    return;
  }

  if (sampleSelect.value === "macro-test") {
    loadMacroTest();
    return;
  }

  if (sampleSelect.value === "loop-demo") {
    loadLoopSampleProgram();
    return;
  }

  if (sampleSelect.value === "hello-loop-demo") {
    loadHelloLoopSampleProgram();
    return;
  }

  if (sampleSelect.value === "push-pull-demo") {
    loadPushPullDemo();
    return;
  }

  if (sampleSelect.value === "user-macro-demo") {
    loadUserMacroDemo();
    return;
  }

  if (sampleSelect.value === "if-else") {
    loadIfElseDemo();
    return;
  }

  if (sampleSelect.value === "incbin-demo") {
    loadIncBinDemo();
    return;
  }

  if (sampleSelect.value === "loadfile-demo") {
    loadLoadFileDemo();
    return;
  }

  if (sampleSelect.value === "include-demo") {
    loadIncludeDemo();
    return;
  }

  if (sampleSelect.value === "sid-demo") {
    loadSidDemo();
    return;
  }

  if (sampleSelect.value === "sid-direct-demo") {
    loadSidDirectDemo();
    return;
  }

  if (sampleSelect.value === "10-print") {
    load10PrintDemo();
    return;
  }

  if (sampleSelect.value === "irq-demo") {
    loadRasterIrqDemo();
    return;
  }

  if (sampleSelect.value === "overlapping-raster-demo") {
    loadOverlappingRasterDemo();
    return;
  }

  if (sampleSelect.value === "memory-overlap-demo") {
    loadMemoryOverlapDemo();
    return;
  }

  if (sampleSelect.value === "rand-lines-demo") {
    loadRandLinesDemo();
    return;
  }

  if (sampleSelect.value === "reu-demo") {
    loadReuDemo();
    return;
  }

  if (sampleSelect.value === "scroll-text-demo") {
    loadScrollTextDemo();
    return;
  }

  if (sampleSelect.value === "name-input-demo") {
    loadSampleFromFile("name-input-demo");
    return;
  }

  loadSampleFromFile(sampleSelect.value);
}

function adjustZoom(delta) {
  blockScale = Math.max(0.72, Math.min(1.25, Number((blockScale + delta).toFixed(2))));
  applyZoom();
  saveUiSettings();
}

function applyZoom() {
  programList.style.setProperty("--block-scale", String(blockScale));
}

initPalette();

// ===== TUTORIAL SYSTEM =======================================================

const TUTORIAL_DATA = {
  categories: [
    { id: "featured",     labelHu: "Kiemelt",      labelEn: "Featured" },
    { id: "tour",         labelHu: "Bemutató",     labelEn: "Tour" },
    { id: "basics",       labelHu: "Kezdőknek",    labelEn: "Beginners" },
    { id: "fundamentals", labelHu: "Alapok",       labelEn: "Fundamentals" },
    { id: "advanced",     labelHu: "Haladó",       labelEn: "Advanced" }
  ],
  lessons: [
    {
      id: "featured-color-text-build",
      category: "featured",
      type: "tour",
      interactive: true,
      difficulty: 1,
      titleHu: "Kiemelt: név bekérés PETSCII-vel",
      titleEn: "Featured: Name Input with PETSCII",
      descHu: "Egy működő program: PETSCII makró + CHROUT print loop + CHRIN input. A mintaprogram betöltődik, majd a tour végigvezet a részein.",
      descEn: "A working program: PETSCII macro + CHROUT print loop + CHRIN input. The sample loads, then the tour walks you through each section.",
      steps: [
        {
          target: null,
          onEnterActionId: "prepare-name-input-demo",
          titleHu: "Név bekérés demo — PETSCII + CHROUT + CHRIN",
          titleEn: "Name Input Demo — PETSCII + CHROUT + CHRIN",
          descHu: "Ez a program valódi billentyűzet inputot kezel!\n\n1. Kiírja: \"hello c64!\"\n2. Kiírja: \"what's your name?\"\n3. Vár a nevedre — a CHRIN ($FFCF) beolvassa, a CHROUT ($FFD2) visszhangozza, és a bufferbe ($0C30) menti\n4. ENTER után új sorba lép\n5. Kiírja: \"hello \" + a buffer tartalma + \"!\"\n\nAz adatok $0C00 környékén vannak — közel a programkódhoz.",
          descEn: "This program handles real keyboard input!\n\n1. Prints: \"hello c64!\"\n2. Prints: \"what's your name?\"\n3. Prints: \"hello \"\n4. Waits for your name — CHRIN ($FFCF) reads, CHROUT ($FFD2) echoes\n5. After ENTER prints \"!\" and returns\n\nThe text is stored with the PETSCII macro, output by a print loop using CHROUT."
        },
        {
          target: ".program-panel",
          titleHu: "Blokklista áttekintése",
          titleEn: "Block List Overview",
          descHu: "A mintaprogram betöltődött. A középső panelen látod a blokkokat:\n\n• JSR $E544 — képernyő törlése\n• LDA/STA $D020 — border szín (kék)\n• LDA/STA $D021 — háttérszín (fekete)\n• Print loop — PETSCII szöveg kiírása CHROUT-tal\n• Input loop — CHRIN + CHROUT a név beolvasásához\n• \"!\" kiírása + RTS",
          descEn: "The sample program is loaded. In the center panel you see the blocks:\n\n• JSR $E544 — clear screen\n• LDA/STA $D020 — border color (blue)\n• LDA/STA $D021 — background color (black)\n• Print loop — outputs PETSCII text via CHROUT\n• Input loop — CHRIN + CHROUT to read your name\n• Print \"!\" + RTS"
        },
        {
          target: ".output-panel",
          titleHu: "ASM kimenet — PETSCII és TABLE",
          titleEn: "ASM Output — PETSCII and TABLE",
          descHu: "A jobb oldali ASM panelen láthatod:\n\n• `TABLE msg_text` — a $0C00 címhez rendelt címke\n• A PETSCII makró a $0C00 címtől tárolja a szöveget (31 bájt)\n• `TABLE hello_text` — $0C20 cím, RAWBYTES \"hello \" (6 bájt)\n• `TABLE name_buf` — $0C30 cím, 16 bájt buffer (kezdetben $00)\n• A print loop: `LDA msg_text,Y` / `JSR $FFD2` / `NEXT`\n• Az input loop: `JSR $FFCF` / `CMP #$0D` / `BEQ` / `STA name_buf,X` / `JSR $FFD2`\n\nA név a bufferbe mentődik, majd a program újra kiírja a \"hello \" + név + \"!\" stringet!",
          descEn: "In the right ASM panel you can see:\n\n• `TABLE msg_start` — label assigned to address $C000\n• The PETSCII macro stores text starting from $C000\n• The text contains `$0D` (RETURN) bytes for line breaks\n• The print loop: `LDA msg_start,Y` / `JSR $FFD2` / `INY` / `CPY #$25` / `BNE`\n\nCHROUT handles $0D automatically: it moves the cursor to a new line!"
        },
        {
          target: ".program-panel",
          titleHu: "Input loop — így működik a CHRIN",
          titleEn: "Input Loop — How CHRIN Works",
          descHu: "Az input loop a program lelke:\n\n```\ninput_loop:\n  JSR $FFCF    ; CHRIN: vár egy billentyűre\n  CMP #$0D     ; RETURN?\n  BEQ done     ; ha igen, kilép\n  STA name_buf,X ; eltárolja a bufferben\n  JSR $FFD2    ; CHROUT: visszhangozza\n  INX          ; következő pozíció\n  CPX #$10     ; max 16 karakter\n  BNE loop     ; vissza\ninput_done:\n  STX $FB      ; elmenti a hosszt (X)\n  LDA #0       ; null terminátor\n  STA name_buf,X\n```\n\nUtána:\\n• `LDA #$0D` / `JSR $FFD2` — új sor\\n• LOOP: kiírja a \"hello \" szöveget\\n• Ciklus: kiírja a name_buf tartalmát\\n• `LDA #$21` / `JSR $FFD2` — \"!\" kiírása",
          descEn: "The input loop is the heart of the program:\n\n```\ninput_loop:\n  JSR $FFCF    ; CHRIN: waits for a key\n  CMP #$0D     ; RETURN?\n  BEQ done     ; if yes, exit\n  JSR $FFD2    ; CHROUT: echo the character\n  JMP loop     ; back to start\ninput_done:\n```\n\n$FFCF (CHRIN) WAITS for a key — it won't continue until you press one. $FFD2 (CHROUT) prints the character at the cursor.\n\nAt the end, LDA #$21 / JSR $FFD2 prints a \"!\"."
        },
        {
          target: "#run-emulator",
          centerCard: true,
          titleHu: "Futtasd le!",
          titleEn: "Run It!",
          descHu: "Kattints a Run gombra! A VICE emulátorban:\n\n1. Megjelenik \"hello c64!\"\n2. Megjelenik \"what's your name?\"\n3. A kurzor villog — gépeld be a neved! (pl. ANNA)\n4. ENTER után új sorban: \"hello ANNA!\"\n\nPróbáld ki! Ha kész, nyomj Finish-t.",
          descEn: "Click Run! In the VICE emulator:\n\n1. \"hello c64!\" appears\n2. \"what's your name?\" appears\n3. \"hello \" appears\n4. The cursor blinks — type your name! (e.g. JOHN)\n5. After ENTER, \"!\" appears\n\nTry it! When done, press Finish."
        }
      ]
    },
    {
      id: "app-tour",
      category: "tour",
      type: "tour",
      difficulty: 0,
      titleHu: "Ismerkedj az alkalmazással",
      titleEn: "Explore the Application",
      descHu: "Interaktív bemutatón megismerhetőd a C64 Visual Assembler főbb részeit és funkcióit.",
      descEn: "An interactive walkthrough of the main UI areas and features of C64 Visual Assembler.",
      steps: [
        {
          target: null,
          titleHu: "Üdvözöl a C64 Visual Assembler!",
          titleEn: "Welcome to C64 Visual Assembler!",
          descHu: "Ez az alkalmazás lehetővé teszi, hogy Commodore 64 assembly programokat vizuálisan, drag-and-drop módszerrel szerkessz — assembly tudás nélkül is!\n\nA bemutató végigvezet a főbb felületrészeken.",
          descEn: "This app lets you create Commodore 64 assembly programs visually with drag-and-drop — even without prior assembly knowledge!\n\nThis tour will walk you through the main UI areas."
        },
        {
          target: ".palette-panel",
          titleHu: "Paletta panel (bal oldal)",
          titleEn: "Palette Panel (left side)",
          descHu: "A bal oldali panel az utasítások és makrók palettája.\n\nInnen húzhatod a mnemonikokat (pl. LDA, STA, BNE) és a C64-specifikus makrókat (TEXT, SPRITE_INIT, LOOP...) a programba.",
          descEn: "The left panel is the instruction and macro palette.\n\nDrag mnemonics (e.g. LDA, STA, BNE) and C64-specific macros (TEXT, SPRITE_INIT, LOOP...) from here into your program."
        },
        {
          target: "#category-select",
          titleHu: "Kategória választó",
          titleEn: "Category Selector",
          descHu: "Válassz kategóriát az utasítások szűréséhez:\n• Aritmetika — összeadás, kivonás\n• Ugrasok — JMP, BNE, BEQ...\n• Makrok — C64-specifikus segédblokkok\n\nA kereső mezőben bármelyik mnemonikot megtalálhatod.",
          descEn: "Select a category to filter instructions:\n• Arithmetic — addition, subtraction\n• Branches — JMP, BNE, BEQ...\n• Macros — C64-specific helper blocks\n\nYou can also use the search field to find any mnemonic."
        },
        {
          target: "#mnemonic-select",
          titleHu: "Mnemonik választó",
          titleEn: "Mnemonic Selector",
          descHu: "A kategória kiválasztása után itt jelennek meg az adott csoporthoz tartozó utasítások és makrók.\n\nItt gyorsan kiválaszthatod például az LDA, STA, JMP vagy egy makró nevét, mielőtt hozzáadod a programhoz.",
          descEn: "After choosing a category, this dropdown lists the instructions and macros that belong to that group.\n\nUse it to quickly pick items like LDA, STA, JMP, or a macro before adding it to the program."
        },
        {
          target: "#palette-list",
          titleHu: "Mnemonik lista",
          titleEn: "Mnemonic List",
          descHu: "Az utasítások kártyaként jelennek meg.\n\nMódjai a hozzáadásnak:\n• Húzd be a középső (Program) panelbe\n• Kattints a + gombra a kártyán\n• Kattints az \"Add selected\" gombra",
          descEn: "Instructions appear as cards.\n\nWays to add them:\n• Drag into the center (Program) panel\n• Click the + button on a card\n• Click the \"Add selected\" button"
        },
        {
          target: ".program-panel",
          titleHu: "Program panel (közép)",
          titleEn: "Program Panel (center)",
          descHu: "A középső panel a programod blokkjainak listája.\n\nArt tevékenységek:\n• Blokkokat sorba rendezhetsz (drag-and-drop)\n• Minden blokkot szerkeszthetsz (operandus, cimzési mód)\n• Blokkokat törölhetsz a kuka ikonnal",
          descEn: "The center panel holds your program's block list.\n\nWhat you can do:\n• Reorder blocks with drag-and-drop\n• Edit each block (operand, addressing mode)\n• Delete blocks with the trash icon"
        },
        {
          target: ".output-panel",
          titleHu: "ASM kimenet (jobb oldal)",
          titleEn: "ASM Output (right side)",
          descHu: "A jobb oldali panel mutatja az összeállított assembly kódot.\n\n• ASM nézet — olvasható assembly forráskód\n• Monitor — VICE monitorban futtatható hexadecimális lista\n• Disassembler — fordított gépi kód lista\n\nKattints egy programblokkra — az ASM nézetben kiemeli a hozzá tartozó sorokat!",
          descEn: "The right panel shows the assembled code.\n\n• ASM view — readable assembly source\n• Monitor — hex listing for VICE monitor\n• Disassembler — reverse machine code listing\n\nClick a program block — the matching lines are highlighted in the ASM view!"
        },
        {
          target: "#run-emulator",
          titleHu: "Futtatás gomb",
          titleEn: "Run Button",
          descHu: "A Run gombbal közvetlenül futtathatod a programodat a VICE C64 emulátorban.\n\nA gomb melletti nyíllal váltasz futtatási mód között:\n• PRG — közvetlenül a VICE-ba\n• D64 — virtuális lemezképen keresztül\n• Hardware — C64 Ultimate csatlakozón át",
          descEn: "Click Run to execute your program directly in the VICE C64 emulator.\n\nUse the arrow next to the button to switch run modes:\n• PRG — directly to VICE\n• D64 — via virtual disk image\n• Hardware — via C64 Ultimate connection"
        },
        {
          target: "#sample-programs-group",
          openMenu: true,
          titleHu: "Mintaprogramok",
          titleEn: "Sample Programs",
          descHu: "A Menü → Példák részben 30+ kész mintaprogram vár!\n\nTölts be egyet — és nézd meg hogyan épül fel. Remek kiindulópont a tanuláshoz.\n\nA bemutató végéhez értél! Javasolt következő lépés: \"Az első programod\" lecke.",
          descEn: "Menu → Examples has 30+ ready-made sample programs!\n\nLoad one and explore how it's structured. Great starting point for learning.\n\nYou've reached the end of the tour! Suggested next step: \"Your First Program\" lesson."
        }
      ]
    },
    {
      id: "first-program",
      category: "basics",
      type: "lesson",
      difficulty: 1,
      titleHu: "Az első programod",
      titleEn: "Your First Program",
      descHu: "Írj egy egyszerű programot, amely megváltoztatja a C64 keret (border) és háttér színét.",
      descEn: "Write a simple program that changes the C64 border and background color.",
      sample: "basic-colors",
      steps: [
        {
          titleHu: "A C64 memóriatérképe",
          titleEn: "C64 Memory Map",
          descHu: "A Commodore 64 hardvere memória-leképzett regisztereken keresztül vezérelhető. Egyszerűen: ha egy bizonyos memóriacímre értéket írsz, az azonnal befolyásolja a hardvert.\n\nLegfontosabb videó regiszterek:\n  $D020 — keret (border) szín\n  $D021 — háttér szín\n  $D011 — videó mód, scrolling\n\nA C64 16 színt ismer (0–15, azaz $00–$0F).",
          descEn: "The Commodore 64 hardware is controlled through memory-mapped registers. Simply: writing a value to a specific memory address immediately affects the hardware.\n\nKey video registers:\n  $D020 — border color\n  $D021 — background color\n  $D011 — video mode, scrolling\n\nThe C64 supports 16 colors (0–15, i.e. $00–$0F)."
        },
        {
          titleHu: "LDA és STA — a legalapvetőbb utasítások",
          titleEn: "LDA and STA — The Most Essential Instructions",
          descHu: "A 6502 processzor két legfontosabb utasítása:\n\n  LDA #$XX   — Load: betölt egy értéket az A (Accumulator) regiszterbe\n  STA $XXXX  — Store: elmenti az A regiszter értékét a megadott memóriacímre\n\nPélda — keret piros lesz:\n  LDA #$02     ; A = 2 (piros)\n  STA $D020    ; $D020 ← 2, keret piros\n\nA # jelzi, hogy közvetlen értéket (immediate) adunk meg, nem memóriacímet.",
          descEn: "The two most important 6502 instructions:\n\n  LDA #$XX   — Load: loads a value into the A (Accumulator) register\n  STA $XXXX  — Store: stores the A register value at a memory address\n\nExample — border turns red:\n  LDA #$02     ; A = 2 (red)\n  STA $D020    ; $D020 ← 2, border is red\n\nThe # means an immediate value (not a memory address)."
        },
        {
          titleHu: "Nézd meg a mintaprogramot!",
          titleEn: "Check Out the Sample Program!",
          descHu: "Töltsd be a 'Basic Colors' mintaprogramot az alábbi gombbal.\n\nA program egy egyszerű ciklust tartalmaz, amely végigjárja a 16 C64 szín mindegyikét, és beállítja a keret + háttér színét.\n\nNézd meg a blokkokat: LDA, STA, INC, CMP, BNE utasítások sorban.",
          descEn: "Load the 'Basic Colors' sample program using the button below.\n\nThe program contains a simple loop that cycles through all 16 C64 colors, setting the border and background color.\n\nLook at the blocks: LDA, STA, INC, CMP, BNE instructions in sequence.",
          loadSample: "basic-colors",
          highlight: ".program-panel"
        },
        {
          titleHu: "Próbáld ki!",
          titleEn: "Try It!",
          descHu: "Módosítsd a programot:\n\n1. Keresd az első LDA #$XX blokkot (az INC előtt)\n2. Változtasd meg az értékét #$0E-re (világossárga)\n3. Kattints a Run gombra\n\nA C64 16 színe:\n  0=fekete  1=fehér  2=piros  3=cián\n  4=lila    5=zöld   6=kék    7=sárga\n  8=narancs 9=barna  A=pirosas B=sötétszürke\n  C=szürke  D=világoszöld E=világoskék F=világosszürke",
          descEn: "Modify the program:\n\n1. Find the first LDA #$XX block (before INC)\n2. Change the value to #$0E (light blue)\n3. Click Run\n\nC64 16 colors:\n  0=black   1=white  2=red    3=cyan\n  4=purple  5=green  6=blue   7=yellow\n  8=orange  9=brown  A=pink   B=dark gray\n  C=gray    D=lt.green  E=lt.blue  F=lt.gray"
        }
      ]
    },
    {
      id: "registers",
      category: "basics",
      type: "lesson",
      difficulty: 1,
      titleHu: "Regiszterek és adatmozgatás",
      titleEn: "Registers and Data Movement",
      descHu: "Ismerd meg a 6502 processzor regisztereit és az adatmozgatás alapjait.",
      descEn: "Learn about the 6502 processor registers and the basics of data movement.",
      steps: [
        {
          titleHu: "A 6502 regiszterei",
          titleEn: "6502 Registers",
          descHu: "A 6502 processzornak 3 általános célú és 3 speciális regisztere van:\n\n• A (Accumulator) — aritmetikai/logikai műveletek fő regisztere\n• X — index regiszter; ciklusszámlálónak, tömbindexeléshez\n• Y — index regiszter; hasonlóan X-hez\n\n• PC (Program Counter) — következő utasítás memóriacíme\n• SP (Stack Pointer) — verem teteje ($0100-$01FF)\n• P (Processor Status) — jelzőbitek (Zero, Carry, Negative...)\n\nMinden utasítás valamelyik regisztert használja.",
          descEn: "The 6502 has 3 general-purpose and 3 special registers:\n\n• A (Accumulator) — main register for arithmetic/logic\n• X — index register; for loop counters, array indexing\n• Y — index register; similar to X\n\n• PC (Program Counter) — address of next instruction\n• SP (Stack Pointer) — top of stack ($0100-$01FF)\n• P (Processor Status) — flag bits (Zero, Carry, Negative...)\n\nEvery instruction uses one of the registers."
        },
        {
          titleHu: "Adatbetöltés",
          titleEn: "Loading Data",
          descHu: "A három általános regiszterbe adatot így tölthetsz:\n\n  LDA #$05   — Azonnali érték betöltése A-ba\n  LDA $FB    — Zero Page cím olvasása\n  LDA $D020  — Abszolút cím olvasása\n  LDX #$0A   — Azonnali érték X-be\n  LDY #$28   — Azonnali érték Y-ba\n\nÉs mentés memóriába:\n  STA $D020  — A értéke → $D020\n  STX $FB    — X értéke → $FB (Zero Page)\n  STY $FC    — Y értéke → $FC (Zero Page)\n\nA # (hash) jelzi, hogy közvetlen értéket adunk meg.",
          descEn: "Load data into the three general registers:\n\n  LDA #$05   — Load immediate value into A\n  LDA $FB    — Read from Zero Page address\n  LDA $D020  — Read from absolute address\n  LDX #$0A   — Load immediate value into X\n  LDY #$28   — Load immediate value into Y\n\nAnd store to memory:\n  STA $D020  — A value → $D020\n  STX $FB    — X value → $FB (Zero Page)\n  STY $FC    — Y value → $FC (Zero Page)\n\nThe # (hash) indicates an immediate value."
        },
        {
          titleHu: "Regiszterek közötti adatmozgatás",
          titleEn: "Transferring Between Registers",
          descHu: "Transfer utasításokkal másolhatsz regiszterek között:\n\n  TAX — A → X (Transfer A to X)\n  TAY — A → Y\n  TXA — X → A\n  TYA — Y → A\n  TXS — X → SP\n  TSX — SP → X\n\nFontos: A-ba nem lehet közvetlenül X-ből tölteni (nincs TAX fordított verziója).\nMegoldás: TXA (X → A), majd felhasználod A-t.\n\nPélda:\n  LDX #$05   ; X = 5\n  TXA        ; A = 5\n  STA $D020  ; $D020 = 5 (zöld keret)",
          descEn: "Use transfer instructions to copy between registers:\n\n  TAX — A → X (Transfer A to X)\n  TAY — A → Y\n  TXA — X → A\n  TYA — Y → A\n  TXS — X → SP\n  TSX — SP → X\n\nImportant: there is no direct X-to-A (no reverse of TAX).\nSolution: TXA (X → A), then use A.\n\nExample:\n  LDX #$05   ; X = 5\n  TXA        ; A = 5\n  STA $D020  ; $D020 = 5 (green border)"
        },
        {
          titleHu: "Zero Page — gyors memória",
          titleEn: "Zero Page — Fast Memory",
          descHu: "A Zero Page ($0000–$00FF) különleges terület:\n• A 6502 az itteni cimeket 1 byte-tal kódolja (nem 2-vel)\n→ gyorsabb és kompaktabb kód\n\nÖsszehasonlítás:\n  LDA $FB    ; Zero Page (2 byte opkód, 3 ciklus)\n  LDA $00FB  ; Abszolút  (3 byte opkód, 4 ciklus)\n\nAjánlott felhasználás:\n• Ideiglenes változók ($FB, $FC, $FD...)\n• Mutatók (pointer-ek) 16 bites indirekt cimzéshez\n\nMegjegyzés: A $00–$FF tartomány nagy részét a KERNAL és BASIC uses, de a $FB–$FE általában szabad.",
          descEn: "Zero Page ($0000–$00FF) is a special area:\n• The 6502 encodes these addresses with 1 byte (not 2)\n→ faster and more compact code\n\nComparison:\n  LDA $FB    ; Zero Page (2 byte opcode, 3 cycles)\n  LDA $00FB  ; Absolute  (3 byte opcode, 4 cycles)\n\nRecommended uses:\n• Temporary variables ($FB, $FC, $FD...)\n• Pointers for 16-bit indirect addressing\n\nNote: Much of $00–$FF is used by KERNAL/BASIC, but $FB–$FE is generally free."
        }
      ]
    },
    {
      id: "loops",
      category: "basics",
      type: "lesson",
      difficulty: 1,
      titleHu: "Ciklusok és ugrások",
      titleEn: "Loops and Jumps",
      descHu: "Tanulj meg ciklusokat és feltételes ugrásokat írni 6502 assemblyben.",
      descEn: "Learn to write loops and conditional jumps in 6502 assembly.",
      sample: "loop-demo",
      steps: [
        {
          titleHu: "JMP — feltétlen ugrás",
          titleEn: "JMP — Unconditional Jump",
          descHu: "A JMP utasítás a program futását egy label (cimke) nevű ponthoz irányítja:\n\nloop:\n    LDA $D020\n    INC $D020\n    JMP loop      ; Visszaugrik a 'loop' cimkére\n\nEz végtelen ciklust hoz létre — a keret színe folyamatosan változik.\n\nA Visual Assemblerben: add hozzá a LABEL makrót (pl. \"loop\" névvel), majd a JMP abszolút utasítást, a rawOperand mezőbe írd a label nevét.",
          descEn: "JMP redirects program execution to a labeled point:\n\nloop:\n    LDA $D020\n    INC $D020\n    JMP loop      ; Jump back to 'loop'\n\nThis creates an infinite loop — the border color changes continuously.\n\nIn Visual Assembler: add a LABEL macro (e.g. name \"loop\"), then a JMP absolute instruction with the label name as operand."
        },
        {
          titleHu: "Jelzőbitek (Flags) és CMP",
          titleEn: "Status Flags and CMP",
          descHu: "A feltételes ugrások a processzor jelzőbitjeit (flags) vizsgálják.\n\nA CMP utasítás összehasonlítja A-t egy értékkel (A − érték), és beállítja a flageket:\n• Z=1 ha A == érték\n• N=1 ha A < érték\n• C=1 ha A >= érték\n\nFeltételes ugrások:\n  BEQ label — ugrás ha Z=1 (egyenlő)\n  BNE label — ugrás ha Z=0 (nem egyenlő)\n  BCC label — ugrás ha C=0\n  BCS label — ugrás ha C=1\n  BMI label — ugrás ha N=1 (negatív)\n  BPL label — ugrás ha N=0 (pozitív)",
          descEn: "Conditional jumps test the processor status flags.\n\nCMP compares A to a value (A − value) and sets the flags:\n• Z=1 if A == value\n• N=1 if A < value\n• C=1 if A >= value\n\nConditional jumps:\n  BEQ label — jump if Z=1 (equal)\n  BNE label — jump if Z=0 (not equal)\n  BCC label — jump if C=0\n  BCS label — jump if C=1\n  BMI label — jump if N=1 (negative)\n  BPL label — jump if N=0 (positive)"
        },
        {
          titleHu: "Ciklus számlálóval",
          titleEn: "Loop with Counter",
          descHu: "X és Y regiszterek ciklusszámlálóként:\n\n    LDX #$0A     ; X = 10 (ciklus száma)\nloop:\n    ; ... ciklus törzs ...\n    DEX          ; X = X - 1 (és beállítja a Z flag-et)\n    BNE loop     ; Ha X != 0, visszaugrik\n\nDEX dekrementálja X-et, és ha X == 0 lett, a Z flag = 1.\nBNE (Branch if Not Equal) nem ugrik ha Z=1, tehát kilép a ciklusból.\n\nINX/INY — növelés (increment)\nDEX/DEY — csökkentés (decrement)",
          descEn: "Use X and Y registers as loop counters:\n\n    LDX #$0A     ; X = 10 (loop count)\nloop:\n    ; ... loop body ...\n    DEX          ; X = X - 1 (sets Z flag)\n    BNE loop     ; If X != 0, loop back\n\nDEX decrements X, and if X == 0 then Z flag = 1.\nBNE (Branch if Not Equal) doesn't jump when Z=1, so it exits the loop.\n\nINX/INY — increment\nDEX/DEY — decrement"
        },
        {
          titleHu: "LOOP / NEXT makrók",
          titleEn: "LOOP / NEXT Macros",
          descHu: "A Visual Assembler LOOP és NEXT makrói leegyszerűsítik a ciklusírást:\n\nLOOP blokk — mezők: regiszter (X/Y), count ($0A = 10), label (pl. loop1)\n  → Generál: LDX/LDY #count + label meghatározása\n\nNEXT blokk — mező: a párosított LOOP label neve\n  → Generál: DEX/DEY + BNE loop1\n\nMintaprogram betöltésekor láthatod a LOOP/NEXT blokkokat. Kísérletezz a count értékkel!",
          descEn: "Visual Assembler's LOOP and NEXT macros simplify loop writing:\n\nLOOP block — fields: register (X/Y), count ($0A = 10), label (e.g. loop1)\n  → Generates: LDX/LDY #count + label definition\n\nNEXT block — field: the matching LOOP label name\n  → Generates: DEX/DEY + BNE loop1\n\nWhen you load the sample program you can see LOOP/NEXT blocks. Experiment with the count value!",
          loadSample: "loop-demo",
          highlight: ".program-panel"
        }
      ]
    },
    {
      id: "macros-intro",
      category: "fundamentals",
      type: "lesson",
      difficulty: 2,
      titleHu: "Makrók bemutatása",
      titleEn: "Introduction to Macros",
      descHu: "A Visual Assembler makrói leegyszerűsítik a komplex C64 programozási feladatokat.",
      descEn: "Visual Assembler macros simplify complex C64 programming tasks.",
      steps: [
        {
          titleHu: "Mi az a makró?",
          titleEn: "What is a Macro?",
          descHu: "A makrók előre definiált kódszekvenciák. A szerkesztőben egyetlen kártyát látsz, de a fordítás során a teljes gépi kód generálódik.\n\nPéldák:\n  TEXT X,Y,\"Hello!\" → KERNAL CHROUT hívások sorozata\n  SPRITE_INIT       → VIC-II sprite regiszterek beállítása (18 byte)\n  LOOP X,$0A        → LDX #$0A + label generálás\n  WAIT_RASTER $C8   → Rasztersor-szinkron busy-wait ciklus\n\nA Makrok kategóriában találod az összes makrót.",
          descEn: "Macros are pre-defined code sequences. In the editor you see one card, but the full machine code is generated during compilation.\n\nExamples:\n  TEXT X,Y,\"Hello!\" → Series of KERNAL CHROUT calls\n  SPRITE_INIT       → VIC-II sprite register setup (18 bytes)\n  LOOP X,$0A        → LDX #$0A + label generation\n  WAIT_RASTER $C8   → Raster line sync busy-wait loop\n\nFind all macros in the Macros category."
        },
        {
          titleHu: "TEXT makró",
          titleEn: "TEXT Macro",
          descHu: "A TEXT makró szöveget ír ki a screen RAM-ba (NEM KERNAL CHROUT-on keresztül — direkt memóriaírás):\n\n• textX, textY — szöveg pozíciója (0–39, 0–24)\n• Szöveg — a kiírandó karakterek\n\nFordításkor LDA/STA párokat generál: minden karakterhez LDA #$screenCode + STA $0400+offset.\n\nFontos: screen code ≠ PETSCII ≠ ASCII.\nNagybetűk: azonosak ($41–$5A)\nKisbetűk a C64-en grafikus karakterek = más kód kell!",
          descEn: "The TEXT macro writes text to screen RAM (NOT via KERNAL CHROUT — direct memory write):\n\n• textX, textY — text position (0–39, 0–24)\n• Text — characters to display\n\nDuring compilation generates LDA/STA pairs: for each char LDA #$screenCode + STA $0400+offset.\n\nImportant: screen code ≠ PETSCII ≠ ASCII.\nUppercase letters: identical ($41–$5A)\nLowercase on C64 = graphic characters = different code!"
        },
        {
          titleHu: "CONST makró — névvel ellátott konstansok",
          titleEn: "CONST Macro — Named Constants",
          descHu: "A CONST makróval névvel ellátott konstansokat definiálhatsz:\n\n  CONST SCREEN, $0400\n  CONST BORDER, $D020\n\n  LDA #$02\n  STA BORDER     ; fordítva: STA $D020\n\nElőnyök:\n• Olvashatóbb kód\n• Ha az érték változik, csak egy helyen kell módosítani\n• A label-táblába kerül → operandus mezőben hivatkozhatsz rá\n\nKonstans nevében: betűk, számok, alulvonás (_), nem kezdődhet számmal.",
          descEn: "Use CONST to define named constants:\n\n  CONST SCREEN, $0400\n  CONST BORDER, $D020\n\n  LDA #$02\n  STA BORDER     ; compiled as: STA $D020\n\nBenefits:\n• More readable code\n• If the value changes, update in one place only\n• Added to label table → can be referenced in operand fields\n\nConstant names: letters, digits, underscore (_), cannot start with a digit."
        },
        {
          titleHu: "BYTE és RAWBYTES makrók",
          titleEn: "BYTE and RAWBYTES Macros",
          descHu: "BYTE — nyers byte-ok beágyazása a kód folyamába:\n  Formátum: $FF,$10,$2A,... (vesszővel elválasztott hex értékek)\n  A byte-ok inline kerülnek a program után.\n  ⚠ Ha a CPU végrehajtja, azt adatként értelmezi → gondoskodj arról, hogy a program ne fusson bele!\n\nRAWBYTES — nyers byte-ok fix memóriacímre:\n  Mezők: cím (pl. $C000) + byte értékek\n  Ezek NEM kerülnek a kód folyamába, hanem külön memóriaterületre.\n  Sprite adathoz, lookup táblákhoz ideális.",
          descEn: "BYTE — embed raw bytes inline in the code stream:\n  Format: $FF,$10,$2A,... (comma-separated hex values)\n  Bytes are placed immediately after the program.\n  ⚠ If the CPU executes them it treats them as data → ensure program doesn't run into them!\n\nRAWBYTES — raw bytes at a fixed memory address:\n  Fields: address (e.g. $C000) + byte values\n  These are NOT placed in the code stream — they go to a separate memory area.\n  Ideal for sprite data, lookup tables."
        }
      ]
    },
    {
      id: "text-macro",
      category: "fundamentals",
      type: "lesson",
      difficulty: 2,
      titleHu: "TEXT makró",
      titleEn: "TEXT Macro",
      descHu: "Tanuld meg, hogyan ír a TEXT makró közvetlenül a képernyőmemóriába.",
      descEn: "Learn how the TEXT macro writes directly into screen memory.",
      steps: [
        {
          titleHu: "Mit csinál a TEXT makró?",
          titleEn: "What Does the TEXT Macro Do?",
          descHu: "A TEXT makró a képernyőre ír szöveget a screen RAM-on keresztül. A Visual Assemblerben megadod a pozíciót és a szöveget, fordításkor pedig karakterenként LDA/STA párok generálódnak.\n\nLényeg: ez nem CHROUT hívás, és nem PETSCII string tárolás, hanem közvetlen memóriaírás a $0400 környékére.",
          descEn: "The TEXT macro writes text to the screen through screen RAM. In Visual Assembler you provide the position and the text, and compilation generates LDA/STA pairs character by character.\n\nKey point: this is not a CHROUT call and not PETSCII string storage, but direct memory writes around $0400."
        },
        {
          titleHu: "Pozíció és karakterkódok",
          titleEn: "Position and Character Codes",
          descHu: "A TEXT makró fő mezői:\n• textX, textY — hova kerüljön a szöveg\n• a szöveg operandusa — mit írjon ki\n\nA C64 screen code rendszere eltér az ASCII-tól és a PETSCII-tól. Emiatt a kis- és nagybetűk kezelése nem ugyanaz, mint PC-n. Oktatási szempontból érdemes először rövid, nagybetűs szövegekkel kezdeni.",
          descEn: "The main TEXT fields are:\n• textX, textY — where the text should appear\n• the text operand — what should be displayed\n\nThe C64 screen code system differs from ASCII and PETSCII. Because of that, lowercase and uppercase handling is not the same as on a PC. For teaching, it is best to start with short uppercase texts."
        },
        {
          titleHu: "Nézd meg a TEXT mintát",
          titleEn: "Check the TEXT Sample",
          descHu: "Töltsd be a text-demo mintát, és figyeld meg a TEXT blokkok mezőit. Különösen azt nézd meg, hogy a blokk egyetlen sorból áll, de az ASM kimenetben több gépi utasítás lesz belőle.\n\nPróbáld átírni a szöveget vagy a koordinátát, majd futtasd újra.",
          descEn: "Load the text-demo sample and inspect the TEXT block fields. Notice that the block is a single line in the editor, but it expands into multiple machine instructions in the ASM output.\n\nTry changing the text or the coordinates, then run it again.",
          loadSample: "text-demo"
        }
      ]
    },
    {
      id: "petscii-macro",
      category: "fundamentals",
      type: "lesson",
      difficulty: 2,
      titleHu: "PETSCII makró",
      titleEn: "PETSCII Macro",
      descHu: "Tanuld meg, hogyan tárolhatsz CHROUT-kompatibilis szöveget fix memóriacímen.",
      descEn: "Learn how to store CHROUT-compatible text at a fixed memory address.",
      steps: [
        {
          titleHu: "TEXT vs. PETSCII",
          titleEn: "TEXT vs. PETSCII",
          descHu: "A PETSCII makró nem ír ki semmit önmagában a képernyőre. Ehelyett egy adott memóriacímre helyezi el a szöveg byte-jait PETSCII kódolással.\n\nEzért a PETSCII inkább adat-elhelyező makró, míg a TEXT inkább közvetlen vizuális kiírásra szolgál.",
          descEn: "The PETSCII macro does not display anything on the screen by itself. Instead, it places the text bytes at a given memory address using PETSCII encoding.\n\nThat makes PETSCII more of a data-placement macro, while TEXT is for direct visual output."
        },
        {
          titleHu: "Mikor hasznos?",
          titleEn: "When Is It Useful?",
          descHu: "A PETSCII akkor jó választás, ha a szöveget később futásidőben akarod feldolgozni:\n• CHROUT-tal karakterenként kiírni\n• scrolltextként olvasni\n• saját rutinból pointerrel bejárni\n\nA tipikus forma: `.petscii $0900, \"HELLO\"`. A címet mindig érdemes $ prefixszel megadni, hogy ne legyen félreértelmezett decimális/hex formátum.",
          descEn: "PETSCII is useful when you want to process text later at runtime:\n• print it character by character with CHROUT\n• use it as scrolltext\n• walk through it with your own pointer-based routine\n\nA typical form is: `.petscii $0900, \"HELLO\"`. It is best to include the $ prefix in the address so decimal/hex interpretation stays unambiguous."
        },
        {
          titleHu: "Nézd meg a PETSCII mintát",
          titleEn: "Check the PETSCII Sample",
          descHu: "Töltsd be a scroll-text-demo mintát. Ebben a PETSCII makró külön memóriaterületre helyezi a görgetendő szöveget, amit a program később beolvas és screen code-dá alakít.\n\nEz jó példa arra, hogyan válik el a tárolt adat és a megjelenített képernyőtartalom.",
          descEn: "Load the scroll-text-demo sample. In it, the PETSCII macro places the scrolling text in a separate memory area, and the program later reads it back and converts it to screen code.\n\nThis is a good example of separating stored data from rendered screen content.",
          loadSample: "scroll-text-demo"
        }
      ]
    },
    {
      id: "loop-next-macro",
      category: "fundamentals",
      type: "lesson",
      difficulty: 2,
      titleHu: "LOOP / NEXT makrók",
      titleEn: "LOOP / NEXT Macros",
      descHu: "Tanuld meg, hogyan egyszerűsítik a LOOP / NEXT blokkok a számlálós ciklusokat.",
      descEn: "Learn how LOOP / NEXT blocks simplify counter-based loops.",
      steps: [
        {
          titleHu: "A makrópár szerepe",
          titleEn: "Role of the Macro Pair",
          descHu: "A LOOP és NEXT együtt használható. A LOOP indítja a ciklust, a NEXT zárja le.\n\nA LOOP blokkban megadod:\n• a regisztert (X vagy Y)\n• a ciklusszámot\n• a loop label nevét\n\nA NEXT blokk ebből generálja a megfelelő DEX/DEY + BNE visszaugrást.",
          descEn: "LOOP and NEXT are designed to be used together. LOOP starts the cycle and NEXT closes it.\n\nIn the LOOP block you provide:\n• the register (X or Y)\n• the loop count\n• the loop label name\n\nThe NEXT block then generates the matching DEX/DEY + BNE jump back."
        },
        {
          titleHu: "Mit generál fordításkor?",
          titleEn: "What Does It Generate?",
          descHu: "A LOOP makró elején egy `LDX #count` vagy `LDY #count` utasítás jön létre, és a belső címke a ciklustörzs elejére kerül.\n\nA NEXT makró a végén `DEX/DEY` + `BNE label` kódot rak be. Ez didaktikailag azért jó, mert a felhasználó először a blokklogikát tanulja meg, később pedig visszaolvashatja az ASM nézetben a valódi 6502 mintát.",
          descEn: "At the start, the LOOP macro generates `LDX #count` or `LDY #count`, and the internal label points to the beginning of the loop body.\n\nAt the end, NEXT inserts `DEX/DEY` + `BNE label`. Pedagogically this works well because the learner first understands the block logic, then can inspect the ASM view for the real 6502 pattern."
        },
        {
          titleHu: "Nézd meg a LOOP/NEXT mintát",
          titleEn: "Check the LOOP/NEXT Sample",
          descHu: "Töltsd be a hello-loop-demo mintát. Ebben látszik, hogyan használható a ciklus makró szövegek és számlálók ismétlésére.\n\nPróbáld átírni a count mezőt vagy a regisztert X-ről Y-ra, és nézd meg, hogyan változik az ASM kimenet.",
          descEn: "Load the hello-loop-demo sample. It shows how the loop macro can be used to repeat text and counting logic.\n\nTry changing the count field or switching the register from X to Y, then inspect how the ASM output changes.",
          loadSample: "hello-loop-demo"
        }
      ]
    },
    {
      id: "org-macro",
      category: "fundamentals",
      type: "lesson",
      difficulty: 1,
      titleHu: "ORG makró",
      titleEn: "ORG Macro",
      descHu: "Tanuld meg, hogyan állítható be a fordítási cím és a memórialayout ORG blokkokkal.",
      descEn: "Learn how ORG blocks control assembly address and memory layout.",
      steps: [
        {
          titleHu: "Mi az ORG?",
          titleEn: "What Is ORG?",
          descHu: "Az ORG nem klasszikus futásidejű utasítás, hanem fordítási direktíva. Azt mondja meg, hogy a következő blokkokat milyen memóriacímtől kell elhelyezni.\n\nAssembly megfelelője: `* = $0801` vagy más kezdőcím. Az ORG önmagában nem generál hasznos gépi kódot, hanem a layoutot változtatja meg.",
          descEn: "ORG is not a classic runtime instruction but an assembly directive. It tells the compiler from which memory address the following blocks should be placed.\n\nIts assembly equivalent is `* = $0801` or another origin address. ORG itself does not emit useful machine code; it changes layout."
        },
        {
          titleHu: "Miért fontos tanításkor?",
          titleEn: "Why Is It Important to Teach?",
          descHu: "A kezdők sokszor csak az utasításokra figyelnek, pedig C64-en a memóriaelrendezés legalább ilyen fontos. Az ORG segítségével megérthető:\n• honnan indul a kód\n• hová kerülnek a táblák és adatok\n• hogyan lehet elkülöníteni a kódot és az adatot\n\nEz jó belépő a memóriatérkép gondolkodásmódjához.",
          descEn: "Beginners often focus only on instructions, but on the C64 memory layout is just as important. ORG helps explain:\n• where code starts\n• where tables and data are placed\n• how code and data can be separated\n\nThat makes it a good entry point into memory-map thinking."
        },
        {
          titleHu: "Nézd meg az ORG használatát",
          titleEn: "See ORG in Use",
          descHu: "Töltsd be a basic-colors mintát, és nézd meg a legelső ORG blokkot. Ez mutatja meg, honnan kezdődik a program fordítása.\n\nPróbáld átírni az ORG címet, majd figyeld meg az ASM nézetben, hogyan változnak a címek.",
          descEn: "Load the basic-colors sample and inspect the first ORG block. It shows where program assembly begins.\n\nTry changing the ORG address, then watch how the addresses change in the ASM view.",
          loadSample: "basic-colors"
        }
      ]
    },
    {
      id: "label-macro",
      category: "fundamentals",
      type: "lesson",
      difficulty: 1,
      titleHu: "LABEL makró",
      titleEn: "LABEL Macro",
      descHu: "Tanuld meg, hogyan használhatsz szimbolikus neveket ugrási célokra és belépési pontokra.",
      descEn: "Learn how to use symbolic names for jump targets and entry points.",
      steps: [
        {
          titleHu: "Miért jobb a név, mint a nyers cím?",
          titleEn: "Why Use a Name Instead of a Raw Address?",
          descHu: "A LABEL makróval nem kell minden ugrásnál konkrét memóriacímet írnod. Elég egy nevet adni, például `main`, `loop` vagy `exit`.\n\nEz olvashatóbbá teszi a programot, és ha a kód hossza megváltozik, a fordító újraszámolja a célcímet.",
          descEn: "With the LABEL macro you do not need to type a concrete memory address for every jump. A symbolic name such as `main`, `loop`, or `exit` is enough.\n\nThis makes the program easier to read, and if code length changes, the compiler recalculates the destination address."
        },
        {
          titleHu: "Hol használható?",
          titleEn: "Where Can It Be Used?",
          descHu: "A LABEL neve használható többek között:\n• JMP / JSR célként\n• branch operandusként (BEQ, BNE, stb.)\n• makrókban, ahol logikai belépési pont kell\n\nA Visual Assembler operandus mezőjében a label-pickeren keresztül is kiválaszthatod a már létező címkéket.",
          descEn: "A LABEL name can be used as:\n• a JMP / JSR target\n• a branch operand (BEQ, BNE, etc.)\n• a logical entry point inside macro-driven programs\n\nIn Visual Assembler, existing labels can also be chosen from the label picker in the operand field."
        },
        {
          titleHu: "Nézd meg a LABEL mintát",
          titleEn: "Check the LABEL Sample",
          descHu: "Töltsd be a label-border mintát, és figyeld meg, hogyan kapcsolódnak a LABEL blokkok az ugróutasításokhoz.\n\nEz az egyik legjobb kezdő példa arra, hogyan lesz az olvasható programstruktúrából valódi ugrási logika.",
          descEn: "Load the label-border sample and observe how LABEL blocks connect to jump instructions.\n\nIt is one of the best beginner examples of how readable structure turns into actual jump logic.",
          loadSample: "label-border"
        }
      ]
    },
    {
      id: "table-macro",
      category: "fundamentals",
      type: "lesson",
      difficulty: 2,
      titleHu: "TABLE makró",
      titleEn: "TABLE Macro",
      descHu: "Tanuld meg, hogyan jelölhetsz ki lookup táblákat névvel és címmel.",
      descEn: "Learn how to define lookup tables with a name and an address.",
      steps: [
        {
          titleHu: "Mit csinál a TABLE?",
          titleEn: "What Does TABLE Do?",
          descHu: "A TABLE makró egy lookup tábla nevét és kezdőcímét jelöli ki. Oktatási szempontból ez azért hasznos, mert külön kezeli a 'mi ennek a táblának a neve?' és a 'hol helyezkedik el memóriában?' kérdést.\n\nA TABLE blokk önmagában nem a táblaadatot tartalmazza, hanem annak címkézett kiindulópontját.",
          descEn: "The TABLE macro marks the name and start address of a lookup table. Pedagogically this is useful because it separates the question of 'what is this table called?' from 'where is it stored in memory?'.\n\nThe TABLE block does not contain the table data by itself; it defines the labeled starting point of that data."
        },
        {
          titleHu: "Hogyan használjuk együtt adatokkal?",
          titleEn: "How Is It Used Together with Data?",
          descHu: "A TABLE mögé jellemzően BYTE, WORD, RAWBYTES vagy más adatblokkok kerülnek. Később a program például így hivatkozhat rájuk:\n\n  LDA tablanev,X\n\nEz különösen hasznos bitmaszkoknál, karaktertábláknál, sor-offset tábláknál vagy bármilyen előre kiszámolt értéksornál.",
          descEn: "TABLE is typically followed by BYTE, WORD, RAWBYTES, or other data blocks. Later the program can reference them like this:\n\n  LDA tableName,X\n\nThis is especially useful for bit masks, character tables, row-offset tables, or any precomputed value sequence."
        },
        {
          titleHu: "Nézd meg a TABLE használatát",
          titleEn: "See TABLE in Use",
          descHu: "Töltsd be a hello-loop-demo mintát, és keresd meg a TABLE blokkot. Itt jól látszik, hogy a TABLE nem egy önálló végrehajtandó utasítás, hanem egy memóriában elhelyezett adatsor névvel ellátott horgonypontja.\n\nEz segít átlátni, hogyan találkozik az adat és a vezérlési logika a programban.",
          descEn: "Load the hello-loop-demo sample and find the TABLE block. It shows clearly that TABLE is not a standalone runtime instruction, but an anchor point for a named data sequence in memory.\n\nThis helps explain how data and control logic meet inside the program.",
          loadSample: "hello-loop-demo"
        }
      ]
    },
    {
      id: "sprites",
      category: "fundamentals",
      type: "lesson",
      difficulty: 2,
      titleHu: "Sprite-ok kezelése",
      titleEn: "Working with Sprites",
      descHu: "Tanulj meg sprite-okat inicializálni, pozicionálni és mozgatni a C64-en.",
      descEn: "Learn to initialize, position, and move sprites on the C64.",
      sample: "sprite-macro-demo",
      steps: [
        {
          titleHu: "C64 sprite alapok",
          titleEn: "C64 Sprite Basics",
          descHu: "A C64-nek 8 hardveres sprite-ja van (VIC-II chip). Minden sprite:\n• 24×21 pixel méretű\n• Saját X/Y pozícióval rendelkezik ($D000–$D00F)\n• Saját színe van ($D027–$D02E)\n• Hardver kezeli (a CPU nem rajzol)\n\nA sprite adatokat 64 byte-os blokkokban kell tárolni, 64 byte határra igazítva!\n\nSprite pointer: $07F8–$07FF — mindegyik sprite egy page-számot tárol: cím / 64\nPélda: sprite adat $2000-nél → pointer = $2000/64 = $80",
          descEn: "The C64 has 8 hardware sprites (VIC-II chip). Each sprite:\n• Is 24×21 pixels\n• Has its own X/Y position ($D000–$D00F)\n• Has its own color ($D027–$D02E)\n• Is hardware-managed (CPU doesn't draw it)\n\nSprite data must be stored in 64-byte blocks, aligned to 64-byte boundaries!\n\nSprite pointer: $07F8–$07FF — each stores a page number: address / 64\nExample: sprite data at $2000 → pointer = $2000/64 = $80"
        },
        {
          titleHu: "SPRITE_INIT makró",
          titleEn: "SPRITE_INIT Macro",
          descHu: "A SPRITE_INIT makró beállítja a sprite-ot (18 byte generálódik):\n\n• Sprite száma (0–7)\n• Szín (0–15)\n• Adatlapszám (hex byte): a sprite adat memóriacíme / 64\n  $2000 → $80, $2040 → $81, $0840 → $21\n\nGenerált kód:\n  LDA #page;  STA $07F8+N   (pointer)\n  LDA $D015; ORA #bitN; STA $D015  (engedélyezés)\n  LDA #color; STA $D027+N  (szín)\n\nFontos: a SPRITE_INIT futásidőben rögzíti a pozíciót → animáció külön kóddal.",
          descEn: "The SPRITE_INIT macro sets up a sprite (generates 18 bytes):\n\n• Sprite number (0–7)\n• Color (0–15)\n• Data page number (hex byte): sprite data address / 64\n  $2000 → $80, $2040 → $81, $0840 → $21\n\nGenerated code:\n  LDA #page;  STA $07F8+N   (pointer)\n  LDA $D015; ORA #bitN; STA $D015  (enable)\n  LDA #color; STA $D027+N  (color)\n\nNote: SPRITE_INIT bakes in static settings → animation needs separate code."
        },
        {
          titleHu: "SPRITE_POS makró",
          titleEn: "SPRITE_POS Macro",
          descHu: "A SPRITE_POS makró beállítja a sprite pozícióját:\n\n• Sprite száma (0–7)\n• X koordináta (0–319; ha X>255, a $D010 9. bitje is beállítódik)\n• Y koordináta (0–255)\n\n⚠ STATIKUS pozicionálás: az értékek a fordítás idején sülnek bele a kódba (LDA #immediate). Ha animálni szeretnéd a sprite-ot, futás közben módosítsd a $D000+N*2 és $D001+N*2 regisztereket:\n  INC $D000   ; sprite 0 X + 1\n  DEC $D001   ; sprite 0 Y - 1",
          descEn: "The SPRITE_POS macro sets a sprite's position:\n\n• Sprite number (0–7)\n• X coordinate (0–319; if X>255, the 9th bit of $D010 is set)\n• Y coordinate (0–255)\n\n⚠ STATIC positioning: values are baked in at compile time (LDA #immediate). To animate a sprite at runtime, modify $D000+N*2 and $D001+N*2:\n  INC $D000   ; sprite 0 X + 1\n  DEC $D001   ; sprite 0 Y - 1"
        },
        {
          titleHu: "Sprite adat elhelyezése — helyes módszer",
          titleEn: "Placing Sprite Data — The Right Way",
          descHu: "Sprite adatot RAWBYTES makróval helyezz fix memóriacímre:\n\n  RAWBYTES $2000\n  ; 63 byte pixel adat (3 byte/sor × 21 sor) + 1 padding byte\n\n⛔ SOHA ne tárold a sprite adatot inline BYTE blokkban a kód folyamában!\n   Ha a kód hossza megváltozik, a sprite elcsúszik.\n\n✓ Ajánlott minta:\n  RAWBYTES fix $2000/$2040/... + matching SPRITE_INIT page ($80/$81/...)\n\nA mintaprogram betöltésekor láthatod a helyes megközelítést.",
          descEn: "Place sprite data at a fixed address using RAWBYTES:\n\n  RAWBYTES $2000\n  ; 63 bytes pixel data (3 bytes/row × 21 rows) + 1 padding byte\n\n⛔ NEVER store sprite data in an inline BYTE block in the code stream!\n   If code length changes, the sprite will shift.\n\n✓ Recommended pattern:\n  RAWBYTES at fixed $2000/$2040/... + matching SPRITE_INIT page ($80/$81/...)\n\nLoad the sample program to see the correct approach.",
          loadSample: "sprite-macro-demo",
          highlight: ".program-panel"
        }
      ]
    },
    {
      id: "sound-sid",
      category: "advanced",
      type: "lesson",
      difficulty: 3,
      titleHu: "Hang — a SID chip",
      titleEn: "Sound — The SID Chip",
      descHu: "Ismerkedj meg a C64 legendás SID hangchipjével és a hangprogramozás alapjaival.",
      descEn: "Explore the legendary SID sound chip of the C64 and the basics of sound programming.",
      sample: "sid-demo",
      steps: [
        {
          titleHu: "A MOS 6581 SID chip",
          titleEn: "The MOS 6581 SID Chip",
          descHu: "A SID (Sound Interface Device) a C64 legendás hangchipje:\n• 3 független hangcsatorna (voice)\n• Minden csatornán: frekvencia, ADSR burkológörbe, hullámforma\n• Hullámformák: háromszög, fűrész, négyszög, fehér zaj\n• Analóg szűrő: low-pass, high-pass, band-pass\n• 1 SID chip = kb. 1-2 trombitás felér\n\nSID regiszterek: $D400–$D41F\nMinden csatornához 7 regiszter ($D400–$D406 = ch1, $D407–$D40D = ch2...)\nGlobális: $D418 (master volume + filter routing)",
          descEn: "The SID (Sound Interface Device) is the C64's legendary sound chip:\n• 3 independent sound channels (voices)\n• Per channel: frequency, ADSR envelope, waveform\n• Waveforms: triangle, sawtooth, square, white noise\n• Analog filter: low-pass, high-pass, band-pass\n• 1 SID chip ≈ the sound quality of 1-2 trumpets\n\nSID registers: $D400–$D41F\n7 registers per channel ($D400–$D406 = ch1, $D407–$D40D = ch2...)\nGlobal: $D418 (master volume + filter routing)"
        },
        {
          titleHu: "Alap hang közvetlen regiszterírással",
          titleEn: "Basic Sound via Direct Register Writes",
          descHu: "Egy egyszerű hang lejátszása 1. csatornán:\n\n  LDA #$0F\n  STA $D418    ; Master volume = 15\n\n  LDA #$94     ; Frekvencia LO (kb. 440 Hz A hang)\n  STA $D400\n  LDA #$11     ; Frekvencia HI\n  STA $D401\n\n  LDA #$00\n  STA $D405    ; Attack=0, Decay=0\n  LDA #$F0\n  STA $D406    ; Sustain=15, Release=0\n\n  LDA #$11     ; Háromszög hullám + GATE bit (1)\n  STA $D404    ; → Hang START!\n\nA GATE bit (bit0) beállításával indul a hang. Törlésével elhal.",
          descEn: "Playing a simple sound on channel 1:\n\n  LDA #$0F\n  STA $D418    ; Master volume = 15\n\n  LDA #$94     ; Frequency LO (approx. 440 Hz A note)\n  STA $D400\n  LDA #$11     ; Frequency HI\n  STA $D401\n\n  LDA #$00\n  STA $D405    ; Attack=0, Decay=0\n  LDA #$F0\n  STA $D406    ; Sustain=15, Release=0\n\n  LDA #$11     ; Triangle wave + GATE bit (1)\n  STA $D404    ; → Sound START!\n\nSetting the GATE bit (bit0) starts the sound. Clearing it stops it."
        },
        {
          titleHu: "SID makró és INCBIN",
          titleEn: "SID Macro and INCBIN",
          descHu: "A Visual Assembler SID makrója betölt egy .sid fájlt és automatikusan generálja a lejátszó kódot.\n\nA .sid fájl tartalmazza:\n• Init cím ($XX) — inicializálás\n• Play cím ($XX) — egy frame lejátszása\n• Maga a zenei adat\n\nA generált kód:\n1. JSR init_addr — SID inicializálás\n2. IRQ-n keresztül (50/60 Hz) JSR play_addr\n\nAlternatíva: INCBIN + kézi inicializáló kód. A sid-demo.json mintaprogram teljes IRQ-alapú megvalósítást mutat be.",
          descEn: "The Visual Assembler SID macro loads a .sid file and auto-generates playback code.\n\nThe .sid file contains:\n• Init address ($XX) — initialization routine\n• Play address ($XX) — play one frame\n• The music data itself\n\nGenerated code:\n1. JSR init_addr — SID initialization\n2. Via IRQ (50/60 Hz) JSR play_addr\n\nAlternative: INCBIN + manual init code. The sid-demo.json sample shows a complete IRQ-based implementation.",
          loadSample: "sid-demo",
          highlight: ".program-panel"
        }
      ]
    },
    {
      id: "irq-raster",
      category: "advanced",
      type: "lesson",
      difficulty: 3,
      titleHu: "IRQ és raszter interrupt",
      titleEn: "IRQ and Raster Interrupt",
      descHu: "Tanulj meg IRQ megszakításokat kezelni szinkron animációhoz és hanglejátszáshoz.",
      descEn: "Learn to handle IRQ interrupts for synchronized animation and sound playback.",
      sample: "irq-demo",
      steps: [
        {
          titleHu: "Mi az az IRQ?",
          titleEn: "What is IRQ?",
          descHu: "Az IRQ (Interrupt Request) hardveres megszakítás: időközönként félbeszakítja a fő programot és egy külön kódot futtat, majd visszatér.\n\nA C64-en a raszter IRQ a leghasználtabb:\n• A VIC-II kirajzolja a képernyőt soronként (rasztersor)\n• Megadhatod, hogy melyik sorban fusson meg a megszakítás\n• PAL: 312 sor/kép, 50 fps; NTSC: 263 sor/kép, 60 fps\n\nHasználata:\n• Szinkron zenelejátszás (50 Hz frame-enként)\n• Szín effektek a képernyőn (raszterbars)\n• Parallax scrolling\n• Sprite multiplexing",
          descEn: "IRQ (Interrupt Request) is a hardware interrupt: it periodically interrupts the main program to run separate code, then returns.\n\nOn the C64, the raster IRQ is most commonly used:\n• VIC-II draws the screen line by line (raster lines)\n• You specify which line triggers the interrupt\n• PAL: 312 lines/frame, 50 fps; NTSC: 263 lines/frame, 60 fps\n\nUsages:\n• Synchronized music playback (50 Hz per frame)\n• Color effects on screen (raster bars)\n• Parallax scrolling\n• Sprite multiplexing"
        },
        {
          titleHu: "IRQ beállítása lépései",
          titleEn: "IRQ Setup Steps",
          descHu: "IRQ handler regisztrálása:\n\n  SEI              ; Megszakítások tiltása\n  LDA #<handler\n  STA $FFFE        ; IRQ vektor LO\n  LDA #>handler\n  STA $FFFF        ; IRQ vektor HI\n\n  LDA $D011\n  AND #$7F\n  STA $D011        ; Raszter IRQ mód (bit7=0)\n\n  LDA #rasterLine\n  STA $D012        ; Melyik sorban fusson\n\n  LDA #$01\n  STA $D01A        ; VIC-II IRQ engedélyezés\n  CLI              ; Megszakítások engedélyezése\n\nhandler:\n  ; ... IRQ kód ...\n  LDA #$FF; STA $D019  ; IRQ törlése\n  RTI              ; Visszatérés",
          descEn: "Registering an IRQ handler:\n\n  SEI              ; Disable interrupts\n  LDA #<handler\n  STA $FFFE        ; IRQ vector LO\n  LDA #>handler\n  STA $FFFF        ; IRQ vector HI\n\n  LDA $D011\n  AND #$7F\n  STA $D011        ; Raster IRQ mode (bit7=0)\n\n  LDA #rasterLine\n  STA $D012        ; Which line to trigger\n\n  LDA #$01\n  STA $D01A        ; VIC-II IRQ enable\n  CLI              ; Enable interrupts\n\nhandler:\n  ; ... IRQ code ...\n  LDA #$FF; STA $D019  ; Clear IRQ flag\n  RTI              ; Return from interrupt"
        },
        {
          titleHu: "WAIT_RASTER — egyszerűbb megoldás",
          titleEn: "WAIT_RASTER — Simpler Approach",
          descHu: "Ha IRQ nélkül akarsz egy rasztersorhoz szinkronizálni, a WAIT_RASTER makró busy-wait ciklust generál:\n\n  WAIT_RASTER $C8   ; Várakozás a 200. raszterig\n  LDA #$02\n  STA $D020         ; Border pirossá válik a 200. sornál\n\nGenerált kód (7 byte):\n  LDA $D012          ; Aktuális rasztersor olvasása\n  CMP #$C8           ; Összehasonlítás\n  BNE $FD            ; Ha nem egyezik → vissza (-3)\n\n⚠ Hátrány: CPU 100%-on pörög a várakozás alatt.\nIRQ-val a CPU szabad a fő loop futtatásához.",
          descEn: "If you want to sync to a raster line without IRQ, WAIT_RASTER generates a busy-wait loop:\n\n  WAIT_RASTER $C8   ; Wait until raster line 200\n  LDA #$02\n  STA $D020         ; Border turns red at line 200\n\nGenerated code (7 bytes):\n  LDA $D012          ; Read current raster line\n  CMP #$C8           ; Compare\n  BNE $FD            ; If not equal → loop back (-3)\n\n⚠ Downside: CPU runs at 100% during the wait.\nWith IRQ the CPU is free to run the main loop.",
          loadSample: "irq-demo",
          highlight: ".program-panel"
        }
      ]
    }
  ]
};

// --- Tutorial state ---
let _tutorialProgress = {};
let _tourActive = false;
let _tourCurrentStep = 0;
let _tourSteps = [];
let _tourLessonId = null;
let _tourMenuOpened = false;
let _tourAllowOverlayClose = true;
let _tourMenuSyncRaf = 0;
let _tourInteractiveMode = false;
let _tourTargetAdvanceCleanup = null;
let _tourPreparedLessonId = null;

function _tutLoadProgress() {
  try {
    const saved = localStorage.getItem("c64-tutorial-progress");
    _tutorialProgress = saved ? JSON.parse(saved) : {};
  } catch { _tutorialProgress = {}; }
}

function _tutSaveProgress() {
  localStorage.setItem("c64-tutorial-progress", JSON.stringify(_tutorialProgress));
}

function _tutMarkDone(lessonId) {
  if (!_tutorialProgress[lessonId]) _tutorialProgress[lessonId] = {};
  _tutorialProgress[lessonId].completed = true;
  _tutSaveProgress();
}

function _tutorialFindMnemonicDefinition(mnemonic) {
  for (const [category, items] of Object.entries(mnemonicLibrary)) {
    const item = (items || []).find((entry) => entry.mnemonic === mnemonic);
    if (item) return { category, item };
  }
  return null;
}

function _tutorialCreateInstructionBlock(mnemonic, addressingMode = "implied", rawOperand = "", base = "hex") {
  const found = _tutorialFindMnemonicDefinition(mnemonic);
  const preview = buildOperandPreview(addressingMode, rawOperand, base);
  return {
    id: crypto.randomUUID(),
    category: found?.category || "Adatmozgas",
    mnemonic,
    operand: preview.operand || "",
    rawOperand,
    description: found?.item?.description || "",
    addressingMode,
    base,
    validationError: preview.error || "",
    collapsed: true
  };
}

function _tutorialBuildColorTextProgram() {
  document.getElementById("tutorial-dialog")?.close();

  if (expertMode) {
    setExpertMode(false);
    if (expertModeToggle) expertModeToggle.checked = false;
  }

  const textInfo = _tutorialFindMnemonicDefinition("TEXT");
  const orgBlock = makeDefaultOrgBlock();
  orgBlock.orgAddress = "0801";
  orgBlock.collapsed = false;

  program = [
    orgBlock,
    _tutorialCreateInstructionBlock("LDA", "immediate", "06"),
    _tutorialCreateInstructionBlock("STA", "absolute", "D020"),
    _tutorialCreateInstructionBlock("LDA", "immediate", "00"),
    _tutorialCreateInstructionBlock("STA", "absolute", "D021"),
    {
      id: crypto.randomUUID(),
      category: textInfo?.category || "Makrok",
      mnemonic: "TEXT",
      operand: "HELLO C64",
      rawOperand: "HELLO C64",
      description: textInfo?.item?.description || "",
      addressingMode: "implied",
      base: "text",
      validationError: validateTextMacroPosition(10, 8, "HELLO C64"),
      collapsed: false,
      isTextMacro: true,
      textCharset: "standard",
      textX: 10,
      textY: 8
    },
    _tutorialCreateInstructionBlock("RTS")
  ];

  userMacros = {};
  selectedBlockId = null;
  markTabDirty();
  renderProgram();
  renderAsmOutput();
  renderMemoryMap();
  renderMonitorOutput();
  document.querySelector(".program-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function _runTutorialAction(actionId) {
  if (actionId === "build-color-text-program") {
    _tutorialBuildColorTextProgram();
  }
}

function _tutorialSetPaletteSelection({ category, mnemonic, addressingMode = null, operand = "", base = null }) {
  if (expertMode) {
    setExpertMode(false);
    if (expertModeToggle) expertModeToggle.checked = false;
  }

  if (categorySelect && category) {
    categorySelect.value = category;
  }
  syncMnemonicMenu();

  if (mnemonicSelect && mnemonic) {
    mnemonicSelect.value = mnemonic;
  }
  syncAddressingModes();

  if (addressingSelect && addressingMode) {
    addressingSelect.value = addressingMode;
    handleAddressingChange();
  }

  if (base) {
    const baseInput = Array.from(baseInputs || []).find((input) => input.value === base);
    if (baseInput) {
      baseInput.checked = true;
      handleBaseChange();
    }
  }

  if (operandInput) {
    operandInput.value = operand;
  }

  updateOperandField();
  renderMnemonicDescription();
}

function _runTutorialStepAction(actionId) {
  switch (actionId) {
    case "prepare-name-input-demo": {
      if (_tourPreparedLessonId === _tourLessonId) return;
      _tourPreparedLessonId = _tourLessonId;
      if (expertMode) {
        setExpertMode(false);
        if (expertModeToggle) expertModeToggle.checked = false;
      }
      if (sampleSelect) {
        sampleSelect.value = "name-input-demo";
        loadSelectedSample();
      }
      break;
    }
    case "prepare-guided-color-text": {
      if (_tourPreparedLessonId === _tourLessonId) return;
      _tourPreparedLessonId = _tourLessonId;
      if (expertMode) {
        setExpertMode(false);
        if (expertModeToggle) expertModeToggle.checked = false;
      }
      doClearProgram();
      selectedBlockId = null;
      renderProgram();
      renderAsmOutput();
      renderMemoryMap();
      renderMonitorOutput();
      break;
    }
    case "prep-text-block":
      _tutorialSetPaletteSelection({
        category: "Makrok",
        mnemonic: "TEXT",
        operand: "hello c64!"
      });
      break;
    case "prep-lda-border":
      _tutorialSetPaletteSelection({
        category: "Adatmozgas",
        mnemonic: "LDA",
        addressingMode: "immediate",
        operand: "",
        base: "hex"
      });
      break;
    case "prep-sta-border":
      _tutorialSetPaletteSelection({
        category: "Adatmozgas",
        mnemonic: "STA",
        addressingMode: "absolute",
        operand: "D020",
        base: "hex"
      });
      break;
    case "prep-lda-background":
      _tutorialSetPaletteSelection({
        category: "Adatmozgas",
        mnemonic: "LDA",
        addressingMode: "immediate",
        operand: "",
        base: "hex"
      });
      break;
    case "prep-sta-background":
      _tutorialSetPaletteSelection({
        category: "Adatmozgas",
        mnemonic: "STA",
        addressingMode: "absolute",
        operand: "D021",
        base: "hex"
      });
      break;
    case "prep-rts-block":
      _tutorialSetPaletteSelection({
        category: "Ugrasok",
        mnemonic: "RTS",
        addressingMode: "implied",
        operand: ""
      });
      break;
    case "prep-jsr-clearscreen":
      _tutorialSetPaletteSelection({
        category: "Ugrasok",
        mnemonic: "JSR",
        addressingMode: "absolute",
        operand: "E544",
        base: "hex"
      });
      break;
    case "prep-text-greeting":
      _tutorialSetPaletteSelection({
        category: "Makrok",
        mnemonic: "TEXT",
        operand: "hello "
      });
      break;
    case "prep-text-whatsyourname":
      _tutorialSetPaletteSelection({
        category: "Makrok",
        mnemonic: "TEXT",
        operand: "what's your name?"
      });
      break;
    case "prep-jsr-chrin":
      _tutorialSetPaletteSelection({
        category: "Ugrasok",
        mnemonic: "JSR",
        addressingMode: "absolute",
        operand: "FFCF",
        base: "hex"
      });
      break;
  }
}

function _tourClearTargetAdvance() {
  if (_tourTargetAdvanceCleanup) {
    _tourTargetAdvanceCleanup();
    _tourTargetAdvanceCleanup = null;
  }
}

function _tourBindTargetAdvance(step) {
  _tourClearTargetAdvance();
  if (!_tourInteractiveMode || !step?.advanceOnTargetClick || !step.target) return;

  const targetEl = document.querySelector(step.target);
  if (!targetEl) return;

  const onClick = () => {
    if (!_tourActive) return;
    setTimeout(() => {
      if (!_tourActive) return;
      if (_tourCurrentStep >= _tourSteps.length - 1) {
        _tourEnd();
        return;
      }
      _tourCurrentStep += 1;
      _tourShowStep(_tourCurrentStep);
    }, 0);
  };

  targetEl.addEventListener("click", onClick);
  _tourTargetAdvanceCleanup = () => targetEl.removeEventListener("click", onClick);
}

function openTutorialDialog() {
  const dlg = document.getElementById("tutorial-dialog");
  if (!dlg) return;
  _tutRenderDialog();
  document.querySelector(".control-menu")?.removeAttribute("open");
  dlg.showModal();
}

function _tutRenderDialog() {
  const lang = currentLanguage;
  const listEl = document.getElementById("tutorial-lesson-list");
  const contentEl = document.getElementById("tutorial-lesson-content");
  const titleEl = document.getElementById("tutorial-dialog-title");
  if (titleEl) titleEl.textContent = t("tutorialDialogTitle");
  const hintEl = document.getElementById("tutorial-select-hint");
  if (hintEl) hintEl.textContent = t("tutorialSelectHint");
  if (!listEl || !contentEl) return;

  listEl.innerHTML = TUTORIAL_DATA.categories.map(cat => {
    const catLessons = TUTORIAL_DATA.lessons.filter(l => l.category === cat.id);
    if (catLessons.length === 0) return "";
    return `<div class="tutorial-category">
      <div class="tutorial-category-label">${lang === "hu" ? cat.labelHu : cat.labelEn}</div>
      ${catLessons.map(lesson => {
        const done = _tutorialProgress[lesson.id]?.completed;
        const title = lang === "hu" ? lesson.titleHu : lesson.titleEn;
        const stars = lesson.difficulty > 0
          ? "★".repeat(lesson.difficulty) + "☆".repeat(3 - lesson.difficulty)
          : "★★★ Tour";
        return `<button class="tutorial-lesson-item${done ? " tutorial-lesson-item--done" : ""}" data-lesson-id="${lesson.id}" type="button">
          <span class="tutorial-lesson-check">${done ? "✓" : ""}</span>
          <span class="tutorial-lesson-title">${title}</span>
          <span class="tutorial-lesson-stars">${stars}</span>
        </button>`;
      }).join("")}
    </div>`;
  }).join("");

  listEl.querySelectorAll(".tutorial-lesson-item").forEach(btn => {
    btn.addEventListener("click", () => {
      listEl.querySelectorAll(".tutorial-lesson-item").forEach(b => b.classList.remove("tutorial-lesson-item--active"));
      btn.classList.add("tutorial-lesson-item--active");
      _tutShowLesson(btn.dataset.lessonId);
    });
  });

  // Show first lesson by default
  const firstBtn = listEl.querySelector(".tutorial-lesson-item");
  if (firstBtn) firstBtn.click();
}

function _tutShowLesson(lessonId) {
  const lang = currentLanguage;
  const lesson = TUTORIAL_DATA.lessons.find(l => l.id === lessonId);
  const contentEl = document.getElementById("tutorial-lesson-content");
  if (!lesson || !contentEl) return;

  const title = lang === "hu" ? lesson.titleHu : lesson.titleEn;
  const desc = lang === "hu" ? lesson.descHu : lesson.descEn;
  const isTour = lesson.type === "tour";
  const diffStars = lesson.difficulty > 0
    ? ("★".repeat(lesson.difficulty) + "☆".repeat(3 - lesson.difficulty))
    : null;
  const diffLabel = lesson.difficulty === 0 ? "Tour"
    : lesson.difficulty === 1 ? (lang === "hu" ? "Kezdő" : "Beginner")
    : lesson.difficulty === 2 ? (lang === "hu" ? "Közepes" : "Intermediate")
    : (lang === "hu" ? "Haladó" : "Advanced");

  const stepsHtml = lesson.steps.map((step, i) => {
    const sTitle = lang === "hu" ? step.titleHu : step.titleEn;
    const sDesc = lang === "hu" ? step.descHu : step.descEn;
    return `<div class="tutorial-step">
      <div class="tutorial-step-num">${i + 1}</div>
      <div class="tutorial-step-content">
        <h4 class="tutorial-step-title"></h4>
        <pre class="tutorial-step-desc"></pre>
        ${step.loadSample ? `<button class="secondary tutorial-load-sample-btn" data-sample="${step.loadSample}" type="button">${t("tutorialLoadSample")}</button>` : ""}
        ${step.actionId ? `<button class="primary tutorial-step-action-btn" data-action-id="${step.actionId}" type="button"></button>` : ""}
      </div>
    </div>`;
  }).join("");

  const isDone = _tutorialProgress[lessonId]?.completed;

  contentEl.innerHTML = `
    <div class="tutorial-content-header">
      <div class="tutorial-content-meta">
        <span class="tutorial-difficulty-badge">${diffLabel}${diffStars ? " " + diffStars : ""}</span>
      </div>
      <h3 class="tutorial-content-title"></h3>
      <p class="tutorial-content-desc"></p>
    </div>
    ${isTour ? `<div class="tutorial-tour-start">
      <button class="primary tutorial-start-tour-btn" type="button">${t("tutorialStartTour")}</button>
    </div>` : ""}
    <div class="tutorial-steps">${stepsHtml}</div>
    <div class="tutorial-content-footer">
      <button class="primary tutorial-mark-done-btn" type="button"></button>
    </div>`;

  // Set text content safely (no XSS)
  contentEl.querySelector(".tutorial-content-title").textContent = title;
  contentEl.querySelector(".tutorial-content-desc").textContent = desc;
  lesson.steps.forEach((step, i) => {
    const stepEl = contentEl.querySelectorAll(".tutorial-step")[i];
    if (!stepEl) return;
    stepEl.querySelector(".tutorial-step-title").textContent = lang === "hu" ? step.titleHu : step.titleEn;
    stepEl.querySelector(".tutorial-step-desc").textContent = lang === "hu" ? step.descHu : step.descEn;
    const actionBtn = stepEl.querySelector(".tutorial-step-action-btn");
    if (actionBtn) actionBtn.textContent = lang === "hu" ? step.actionLabelHu : step.actionLabelEn;
  });
  const doneBtn = contentEl.querySelector(".tutorial-mark-done-btn");
  doneBtn.textContent = isDone ? t("tutorialMarkDoneCompleted") : t("tutorialMarkDone");
  if (isDone) doneBtn.disabled = true;

  // Load sample buttons
  contentEl.querySelectorAll(".tutorial-load-sample-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const sampleVal = btn.dataset.sample;
      document.getElementById("tutorial-dialog")?.close();
      if (sampleSelect) {
        sampleSelect.value = sampleVal;
        loadSelectedSample();
      }
    });
  });

  contentEl.querySelectorAll(".tutorial-step-action-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      _runTutorialAction(btn.dataset.actionId);
    });
  });

  // Start tour button
  const startTourBtn = contentEl.querySelector(".tutorial-start-tour-btn");
  if (startTourBtn) {
    startTourBtn.addEventListener("click", () => {
      document.getElementById("tutorial-dialog")?.close();
      _tourStart(lesson.steps, lessonId, lesson.interactive === true);
    });
  }

  // Mark done button
  doneBtn.addEventListener("click", () => {
    _tutMarkDone(lessonId);
    _tutRenderDialog();
    // Re-activate the item and re-show lesson
    const listEl = document.getElementById("tutorial-lesson-list");
    const btn = listEl?.querySelector(`[data-lesson-id="${lessonId}"]`);
    if (btn) {
      listEl.querySelectorAll(".tutorial-lesson-item").forEach(b => b.classList.remove("tutorial-lesson-item--active"));
      btn.classList.add("tutorial-lesson-item--active");
    }
    _tutShowLesson(lessonId);
  });
}

// --- Tour engine ---

function _tourStart(steps, lessonId, interactive = false) {
  _tourActive = true;
  _tourCurrentStep = 0;
  _tourSteps = steps;
  _tourLessonId = lessonId;
  _tourAllowOverlayClose = true;
  _tourInteractiveMode = interactive;
  _tourPreparedLessonId = null;
  const overlay = document.getElementById("tour-overlay");
  const card = document.getElementById("tour-card");
  if (overlay) overlay.style.pointerEvents = interactive ? "none" : "all";
  overlay?.removeAttribute("hidden");
  card?.removeAttribute("hidden");
  _tourShowStep(0);
}

function _tourStopMenuSync() {
  if (_tourMenuSyncRaf) {
    cancelAnimationFrame(_tourMenuSyncRaf);
    _tourMenuSyncRaf = 0;
  }
}

function _tourStartMenuSync() {
  _tourStopMenuSync();
  const sync = () => {
    if (!_tourActive || !_tourMenuOpened || _tourAllowOverlayClose) {
      _tourMenuSyncRaf = 0;
      return;
    }
    const menuDetails = document.querySelector(".control-menu");
    const menuPanel = document.querySelector(".control-menu-panel");
    menuDetails?.classList.add("tour-menu-open");
    menuPanel?.classList.remove("menu-closing");
    menuPanel?.classList.add("menu-opening");
    menuDetails?.setAttribute("open", "");
    if (menuDetails) menuDetails.open = true;
    _tourMenuSyncRaf = requestAnimationFrame(sync);
  };
  _tourMenuSyncRaf = requestAnimationFrame(sync);
}

function _tourShowStep(index) {
  const lang = currentLanguage;
  const step = _tourSteps[index];
  if (!step) return;
  _tourClearTargetAdvance();
  if (step.onEnterActionId) {
    _runTutorialStepAction(step.onEnterActionId);
  }

  const stepLabel = document.getElementById("tour-step-label");
  const cardTitle = document.getElementById("tour-card-title");
  const cardDesc = document.getElementById("tour-card-desc");
  const prevBtn = document.getElementById("tour-prev");
  const nextBtn = document.getElementById("tour-next");
  const skipBtn = document.getElementById("tour-skip");

  if (stepLabel) stepLabel.textContent = `${index + 1} / ${_tourSteps.length}`;
  if (cardTitle) cardTitle.textContent = lang === "hu" ? step.titleHu : step.titleEn;
  if (cardDesc) cardDesc.textContent = lang === "hu" ? step.descHu : step.descEn;
  if (prevBtn) prevBtn.disabled = index === 0;
  if (nextBtn) nextBtn.textContent = index === _tourSteps.length - 1
    ? t("tourFinish") : t("tourNext");
  if (skipBtn) skipBtn.textContent = t("tourSkip");
  if (prevBtn) prevBtn.textContent = t("tourPrev");

  const spotlight = document.getElementById("tour-spotlight");
  const card = document.getElementById("tour-card");
  const sampleProgramsGroup = document.getElementById("sample-programs-group");
  sampleProgramsGroup?.classList.remove("tour-sample-highlight");

  // Close menu from previous step if we opened it
  if (!step.openMenu && _tourMenuOpened) {
    _tourStopMenuSync();
    const menuDetails = document.querySelector(".control-menu");
    const menuPanel = document.querySelector(".control-menu-panel");
    menuPanel?.classList.remove("menu-opening");
    menuDetails?.classList.remove("tour-menu-open");
    menuDetails?.removeAttribute("open");
    if (menuDetails) menuDetails.open = false;
    _tourMenuOpened = false;
  }

  if (step.target) {
    _tourAllowOverlayClose = !step.openMenu;
    const doPosition = () => {
      const targetEl = document.querySelector(step.target);
      if (targetEl && spotlight) {
        if (typeof targetEl.scrollIntoView === "function") {
          targetEl.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
        }
        const rect = targetEl.getBoundingClientRect();
        // Retry once if the element has zero area (not yet laid out after scrollIntoView)
        if (rect.width === 0 && rect.height === 0) {
          requestAnimationFrame(() => {
            const rect2 = targetEl.getBoundingClientRect();
            if (rect2.width === 0 && rect2.height === 0) return;
            _positionSpotlightAndCard(spotlight, card, rect2, step);
          });
          return;
        }
        _positionSpotlightAndCard(spotlight, card, rect, step);
      }
    };
    // If this step needs the menu open, open it and wait for animation (160ms)
    if (step.openMenu) {
      const menuDetails = document.querySelector(".control-menu");
      const menuPanel = document.querySelector(".control-menu-panel");
      menuDetails?.classList.add("tour-menu-open");
      menuPanel?.classList.remove("menu-closing");
      menuPanel?.classList.add("menu-opening");
      menuDetails?.setAttribute("open", "");
      if (menuDetails) menuDetails.open = true;
      sampleProgramsGroup?.classList.add("tour-sample-highlight");
      _tourMenuOpened = true;
      _tourStartMenuSync();
      setTimeout(() => {
        requestAnimationFrame(doPosition);
      }, 0);
    } else {
      // Double rAF: first lets DOM mutations from onEnterActionId settle,
      // second fires after the browser has completed layout.
      const delay = step.positionDelay || 0;
      const schedule = () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(doPosition);
        });
      };
      if (delay > 0) {
        setTimeout(schedule, delay);
      } else {
        schedule();
      }
    }
  } else {
    if (spotlight) spotlight.setAttribute("hidden", "");
    _tourCenterCard(card);
  }
}

function _positionSpotlightAndCard(spotlight, card, rect, step) {
  const pad = 8;
  spotlight.style.left = (rect.left - pad) + "px";
  spotlight.style.top = (rect.top - pad) + "px";
  spotlight.style.width = (rect.width + pad * 2) + "px";
  spotlight.style.height = (rect.height + pad * 2) + "px";
  spotlight.removeAttribute("hidden");
  if (step.centerCard) {
    _tourCenterCard(card);
  } else {
    _tourPositionCard(card, rect);
  }
  _tourBindTargetAdvance(step);
}

function _tourPositionCard(card, targetRect) {
  if (!card) return;
  const cardW = 320;
  const cardH = card.offsetHeight || 220;
  const margin = 14;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let left, top;

  if (targetRect.right + cardW + margin < vw) {
    left = targetRect.right + margin;
    top = Math.max(margin, Math.min(targetRect.top, vh - cardH - margin));
  } else if (targetRect.left - cardW - margin > 0) {
    left = targetRect.left - cardW - margin;
    top = Math.max(margin, Math.min(targetRect.top, vh - cardH - margin));
  } else if (targetRect.bottom + cardH + margin < vh) {
    left = Math.max(margin, (vw - cardW) / 2);
    top = targetRect.bottom + margin;
  } else {
    left = Math.max(margin, (vw - cardW) / 2);
    top = Math.max(margin, targetRect.top - cardH - margin);
  }

  card.style.left = left + "px";
  card.style.top = top + "px";
  card.style.transform = "";
}

function _tourCenterCard(card) {
  if (!card) return;
  card.style.left = "50%";
  card.style.top = "50%";
  card.style.transform = "translate(-50%, -50%)";
}

function _tourEnd() {
  _tourActive = false;
  _tourAllowOverlayClose = true;
  _tourInteractiveMode = false;
  _tourPreparedLessonId = null;
  _tourClearTargetAdvance();
  _tourStopMenuSync();
  document.getElementById("sample-programs-group")?.classList.remove("tour-sample-highlight");
  // Close menu if tour opened it
  if (_tourMenuOpened) {
    const menuDetails = document.querySelector(".control-menu");
    const menuPanel = document.querySelector(".control-menu-panel");
    menuPanel?.classList.remove("menu-opening");
    menuDetails?.classList.remove("tour-menu-open");
    menuDetails?.removeAttribute("open");
    if (menuDetails) menuDetails.open = false;
    _tourMenuOpened = false;
  }
  const overlay = document.getElementById("tour-overlay");
  const spotlight = document.getElementById("tour-spotlight");
  const card = document.getElementById("tour-card");
  if (overlay) overlay.style.pointerEvents = "all";
  overlay?.setAttribute("hidden", "");
  spotlight?.setAttribute("hidden", "");
  card?.setAttribute("hidden", "");
  if (_tourLessonId) _tutMarkDone(_tourLessonId);
}

function _initTutorialEvents() {
  const tutBtn = document.getElementById("tutorial-btn");
  const tutDlg = document.getElementById("tutorial-dialog");
  const tutClose = document.getElementById("tutorial-close");

  tutBtn?.addEventListener("click", () => openTutorialDialog());
  tutClose?.addEventListener("click", () => tutDlg?.close());
  tutDlg?.addEventListener("click", (e) => { if (e.target === tutDlg) tutDlg.close(); });

  document.getElementById("tour-next")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (_tourCurrentStep >= _tourSteps.length - 1) {
      const wasInteractive = _tourInteractiveMode;
      _tourEnd();
      // Don't reopen the dialog for interactive/guided lessons —
      // the user just built a program and wants to interact with the editor.
      if (!wasInteractive) openTutorialDialog();
    } else {
      _tourCurrentStep++;
      _tourShowStep(_tourCurrentStep);
    }
  });

  document.getElementById("tour-prev")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (_tourCurrentStep > 0) {
      _tourCurrentStep--;
      _tourShowStep(_tourCurrentStep);
    }
  });

  document.getElementById("tour-skip")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    _tourEnd();
  });

  // Close tour on overlay click (not on spotlight/card area)
  document.getElementById("tour-overlay")?.addEventListener("click", () => {
    if (!_tourAllowOverlayClose) return;
    _tourEnd();
  });
}

_tutLoadProgress();
_initTutorialEvents();

// Initialize tab system
if (tabs.length === 0) {
  const _firstTab = _tabCreate("Untitled 1");
  // Override the auto-incremented name/counter so first tab is always "Untitled 1"
  _firstTab.name = "Untitled 1";
  _firstTab._untitledName = "Untitled 1";
  tabs.push(_firstTab);
  activeTabId = _firstTab.id;
}

// Wire up static new-tab button (only used before renderTabBar replaces it)
document.getElementById("tab-new-btn")?.addEventListener("click", _tabNew);

// Start with a default ORG block if program is empty
if (program.length === 0) {
  program = [makeDefaultOrgBlock()];
  // Persist into the first tab too
  if (tabs[0]) tabs[0].program = JSON.parse(JSON.stringify(program));
}

renderOriginPreview();
renderEmulatorRunHint();
renderMemoryStrip();
renderTabBar();
renderProgram();

