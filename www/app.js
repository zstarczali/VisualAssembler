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
  zeroPageY: {
    label: "Zero page,Y",
    needsOperand: true,
    placeholder: "0-255",
    help: "Zero page cim + Y regiszter offset. Pl: LDX $FB,Y"
  }
};

const mnemonicLibrary = {
  Adatmozgas: [
    { mnemonic: "LDA", description: "Akkumulator betoltese memoriabol vagy konstansbol.", modes: ["immediate", "zeroPage", "absolute", "absoluteX", "absoluteY", "indirectX", "indirectY"] },
    { mnemonic: "LDX", description: "X regiszter betoltese.", modes: ["immediate", "zeroPage", "zeroPageY", "absolute", "absoluteY"] },
    { mnemonic: "LDY", description: "Y regiszter betoltese.", modes: ["immediate", "zeroPage", "absolute", "absoluteX"] },
    { mnemonic: "STA", description: "Akkumulator kiirasa memoriacimre.", modes: ["zeroPage", "absolute", "absoluteX", "absoluteY", "indirectX", "indirectY"] },
    { mnemonic: "STX", description: "X regiszter tarolasa.", modes: ["zeroPage", "zeroPageY", "absolute"] },
    { mnemonic: "STY", description: "Y regiszter tarolasa.", modes: ["zeroPage", "absolute"] }
  ],
  Aritmetika: [
    { mnemonic: "ADC", description: "Osszeadas carry figyelembevetele mellett.", modes: ["immediate", "zeroPage", "absolute", "absoluteX", "absoluteY", "indirectX", "indirectY"] },
    { mnemonic: "SBC", description: "Kivonas carry figyelembevetele mellett.", modes: ["immediate", "zeroPage", "absolute", "absoluteX", "absoluteY", "indirectX", "indirectY"] },
    { mnemonic: "INC", description: "Memoriacim noveles.", modes: ["zeroPage", "absolute", "absoluteX"] },
    { mnemonic: "DEC", description: "Memoriacim csokkentes.", modes: ["zeroPage", "absolute", "absoluteX"] },
    { mnemonic: "CMP", description: "Osszehasonlitas az akkumulatorral.", modes: ["immediate", "zeroPage", "absolute", "absoluteX", "absoluteY", "indirectX", "indirectY"] },
    { mnemonic: "CPX", description: "Osszehasonlitas az X regiszterrel.", modes: ["immediate", "zeroPage", "absolute"] },
    { mnemonic: "CPY", description: "Osszehasonlitas az Y regiszterrel.", modes: ["immediate", "zeroPage", "absolute"] }
  ],
  Logika: [
    { mnemonic: "AND", description: "Logikai ES muvelet az akkumulatorral.", modes: ["immediate", "zeroPage", "absolute", "absoluteX", "absoluteY", "indirectX", "indirectY"] },
    { mnemonic: "ORA", description: "Logikai VAGY muvelet az akkumulatorral.", modes: ["immediate", "zeroPage", "absolute", "absoluteX", "absoluteY", "indirectX", "indirectY"] },
    { mnemonic: "EOR", description: "Exkluziv VAGY muvelet az akkumulatorral.", modes: ["immediate", "zeroPage", "absolute", "absoluteX", "absoluteY", "indirectX", "indirectY"] },
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
    { mnemonic: "ASL", description: "Balra tolas egy bittel.", modes: ["implied", "zeroPage", "absolute"] },
    { mnemonic: "LSR", description: "Jobbra tolas egy bittel.", modes: ["implied", "zeroPage", "absolute"] },
    { mnemonic: "ROL", description: "Balra forgas carryvel.", modes: ["implied", "zeroPage", "absolute"] },
    { mnemonic: "ROR", description: "Jobbra forgas carryvel.", modes: ["implied", "zeroPage", "absolute"] }
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
    { mnemonic: "TEXT", description: "Szoveg kiirasa a kepernyore KERNAL CHROUT rutinon keresztul.", modes: ["implied"], isTextMacro: true },
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
    { mnemonic: "PUSH", description: "Regiszterek mentese a stackre (A, X, Y kombinaciok).", modes: ["implied"], isPushMacro: true },
    { mnemonic: "PULL", description: "Regiszterek visszatoltese a stackrol (A, X, Y kombinaciok).", modes: ["implied"], isPullMacro: true },
    { mnemonic: "MACRO", description: "Felhasznaloi makro definicio kezdete. Nevet var, ENDM-mel zarjuk.", modes: ["implied"], isMacroDefStart: true },
    { mnemonic: "ENDM", description: "Felhasznaloi makro definicio vege.", modes: ["implied"], isMacroDefEnd: true },
    { mnemonic: "INVOKE", description: "Felhasznaloi makro hivasa. Valaszd ki a listabol a makro nevet.", modes: ["implied"], isMacroInvoke: true },
    { mnemonic: "SPRITE_INIT", description: "Sprite inicializalasa: adatlap pointer, engedely bit es szin beallitasa ($D015, $D027+N, $07F8+N).", modes: ["implied"], isSpriteInitMacro: true },
    { mnemonic: "SPRITE_POS", description: "Sprite pozicio beallitasa: X (0-319) es Y (0-255), kezeli a $D010 felso bitet X>255 eseten.", modes: ["implied"], isSpritePosMacro: true },
    { mnemonic: "WAIT_RASTER", description: "Rasztervonal varakozas: LDA $D012 / CMP #sor / BNE -7. Inline, 7 byte, nincs JSR.", modes: ["implied"], isWaitRasterMacro: true },
    { mnemonic: "JOYSTICK", description: "Joystick olvasas es sprite mozgatasa: UP/DOWN/LEFT/RIGHT bitek LSR+BCS+DEC/INC-cel. Port 1=$DC01, Port 2=$DC00 (alap). 27 byte inline.", modes: ["implied"], isJoystickMacro: true },
    { mnemonic: "SPRITE_COL", description: "Sprite utkozes detektalas: LDA $D01E/$D01F + AND #bitMask. Eredmeny A-ban: nem nulla = utkozes. Utana BEQ/BNE-vel ugri. 5 byte.", modes: ["implied"], isSpriteColMacro: true },
    { mnemonic: "DEFINE", description: "Szimbolum definialasa felteteles forditashoz. Ha jelen van, az IF blokkban levo feltetelek kivalutalodnak.", modes: ["implied"], isDefineMacro: true },
    { mnemonic: "IF", description: "Felteteles forditas kezdete. Kifejezest var (pl. DEBUG). ENDIF-fel zarjuk.", modes: ["implied"], isIfMacro: true },
    { mnemonic: "ELSE", description: "Alternativ ag IF blokkon belul.", modes: ["implied"], isElseMacro: true },
    { mnemonic: "ENDIF", description: "Felteteles forditas vege.", modes: ["implied"], isEndIfMacro: true },
    { mnemonic: "CONST", description: "Nevesitett konstans definialasa. Barmely fontos mnemoniknal felhasznalhato (LDA, STA, JSR, stb.).", modes: ["implied"], isConstMacro: true }
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
const loadProjectButton = document.getElementById("load-project");
const zoomOutButton = document.getElementById("zoom-out");
const zoomInButton = document.getElementById("zoom-in");
const addSelectedButton = document.getElementById("add-selected");
const clearProgramButton = document.getElementById("clear-program");
const collapseAllButton = document.getElementById("collapse-all");
const expandAllButton = document.getElementById("expand-all");
const copyAsmButton = document.getElementById("copy-asm");
const runEmulatorButton = document.getElementById("run-emulator");
const chooseViceButton = document.getElementById("choose-vice");
const emulatorStatus = document.getElementById("emulator-status");
const emulatorRunHint = document.getElementById("emulator-run-hint");
const vicePathInput = document.getElementById("vice-path");
const currentFileDisplay = document.getElementById("current-file");
const originInput = document.getElementById("origin-input");
const originPreview = document.getElementById("origin-preview");
const memoryMap = document.getElementById("memory-map");
const memoryStrip = document.getElementById("memory-strip");
const memoryStripTop = document.getElementById("memory-strip-top");
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
let showMacroSource = false;
let asmOutputBase = "hex";
let originBase = "hex";
const macroSourceToggleOn = document.getElementById("macro-source-toggle-on");
const macroSourceToggle = document.getElementById("macro-source-toggle");
const macroSourceToggleText = document.getElementById("macro-source-toggle-text");
const asmBaseInputs = document.querySelectorAll('input[name="asm-output-base"]');
const originBaseInputs = document.querySelectorAll('input[name="origin-base"]');
const compileErrorDialog = document.getElementById("compile-error-dialog");
const compileErrorList = document.getElementById("compile-error-list");
const compileErrorTitle = document.getElementById("compile-error-title");
const compileErrorClose = document.getElementById("compile-error-close");
const checkUpdateButton = document.getElementById("check-update-btn");
const reportBugButton = document.getElementById("report-bug-btn");
const basicSysToggle = document.getElementById("basic-sys-toggle");
const aboutDialog = document.getElementById("about-dialog");
const aboutCloseButton = document.getElementById("about-close");
const whatsNewDialog = document.getElementById("whats-new-dialog");
const whatsNewCloseButton = document.getElementById("whats-new-close");
const knowledgeBaseButton = document.getElementById("knowledge-base-btn");
const knowledgeBaseDialog = document.getElementById("knowledge-base-dialog");
const knowledgeBaseCloseButton = document.getElementById("knowledge-base-close");
const exitAppButton = document.getElementById("exit-app");

let program = [];
let dragState = null;
let _dndSrc = null;
let _dndActive = false;
let _dndGhost = null;
const defaultOrigin = 0x0801;
let blockScale = 0.9;
let currentLanguage = "en";
let vicePath = "";
let savedUiSettings = {};
let userMacros = {};  // Stores user-defined macros: { macroName: [blocks...] }

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
    savePrg: "Export PRG-kent",
    savePrgSuccess: "PRG elmentve",
    savePrgFailed: "PRG mentes sikertelen",
    programSettings: "Programbeallitasok",
    macroSourceToggle: "Makro forraskod megjelenites",
    asmNumbersLabel: "Szamok az ASM kimenetben",
    asmOutputLabel: "ASM kimenet",
    monitorOutputLabel: "Monitor kimenet",
    originPreviewLabel: "Forditas info",
    compileErrorTitle: "Forditasi hibak",
    loadProject: "Program betoltese",
    exitApp: "Kilepes",
    themeToggle: "Tema valtasa",
    crtToggle: "CRT retro mod",
    clearProgram: "Program torlese",
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
    outputProgram: "Program",
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
    sampleLabel: "Label pelda",
    sampleText: "TEXT pelda",
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
    sampleInclude: "INCLUDE demo",
    sampleSidDemo: "SID zenelejatszas (Ikari Warriors)",
    sampleSidDirectDemo: "SID lejatszas - SID makro (Ikari Warriors)",
    sampleSpriteMacroDemo: "SPRITE_INIT / SPRITE_POS makro demo",
    sampleJoystickDemo: "JOYSTICK makro demo",
    sampleCollisionDemo: "SPRITE_COL utkozes demo",
    sample10Print: "10 PRINT - veletlen labirintus",
    checkForUpdate: "Frissites keresese",
    reportBug: "Hiba bejelentese",
    viceRunning: "VICE fut",
    whatsNew: "Ujdonsagok",
    paletteSearchPlaceholder: "Kereses...",
    paletteSearchLabel: "Kereses",
    basicSysLabel: "BASIC SYS stub generálása",
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
    fieldColType: "Utkozes tipusa",
    colTypeSprite: "Sprite-Sprite ($D01E)",
    colTypeBackground: "Sprite-Hatter ($D01F)",
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
    }
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
    savePrg: "Export to PRG",
    savePrgSuccess: "PRG saved",
    savePrgFailed: "PRG save failed",
    programSettings: "Program settings",
    macroSourceToggle: "Show macro source code",
    asmNumbersLabel: "Numbers in ASM output",
    asmOutputLabel: "ASM output",
    monitorOutputLabel: "Monitor output",
    originPreviewLabel: "Compile info",
    compileErrorTitle: "Compilation errors",
    loadProject: "Load program",
    exitApp: "Exit",
    themeToggle: "Toggle theme",
    crtToggle: "CRT retro mode",
    clearProgram: "Clear program",
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
    outputProgram: "Program",
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
    sampleLabel: "Label example",
    sampleText: "TEXT example",
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
    sampleInclude: "INCLUDE demo",
    sampleSidDemo: "SID player - INCBIN (Ikari Warriors)",
    sampleSidDirectDemo: "SID player - SID macro (Ikari Warriors)",
    sampleSpriteMacroDemo: "SPRITE_INIT / SPRITE_POS macro demo",
    sampleJoystickDemo: "JOYSTICK macro demo",
    sampleCollisionDemo: "SPRITE_COL collision demo",
    sample10Print: "10 PRINT - random maze",
    languageLabel: "Language",
    checkForUpdate: "Check for Update",
    reportBug: "Report Bug",
    viceRunning: "VICE running",
    whatsNew: "What's New",
    paletteSearchPlaceholder: "Search...",
    paletteSearchLabel: "Search",
    basicSysLabel: "Generate BASIC SYS stub",
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
    fieldColType: "Collision type",
    colTypeSprite: "Sprite-Sprite ($D01E)",
    colTypeBackground: "Sprite-Background ($D01F)",
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
    }
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
    origin: originInput?.value || "",
    zoom: blockScale,
    sample: sampleSelect?.value || "basic-colors",
    memoryPanelOpen: !!globalMemoryPanel?.open,
    basicSys: basicSysToggle ? basicSysToggle.checked : true,
    showMacroSource,
    asmOutputBase,
    originBase
  };

  localStorage.setItem("c64-ui-settings", JSON.stringify(settings));
  savedUiSettings = settings;
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
  SPRITE_POS: "Set sprite position: X (0–319) and Y (0–255). Handles the $D010 MSB for X > 255.",
  WAIT_RASTER: "Busy-wait for a raster line: LDA $D012 / CMP #line / BNE -7. Inline, 7 bytes, no JSR.",
  JOYSTICK: "Read joystick and move sprite: UP/DOWN/LEFT/RIGHT via LSR+BCS+DEC/INC. Port 1=$DC01, Port 2=$DC00. 27 bytes inline.",
  SPRITE_COL: "Sprite collision detection: LDA $D01E/$D01F + AND #bitMask. Result in A: non-zero = collision. Follow with BEQ/BNE. 5 bytes.",
  DEFINE: "Define a symbol for conditional assembly. When present, IF blocks evaluate the condition.",
  CONST: "Named constant definition. Can be used as an operand in any mnemonic (LDA, STA, JSR, etc.).",
  REGION: "Group blocks into a collapsible named section. Close with ENDREGION.",
  ENDREGION: "End of a REGION section."
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
  LDA: { immediate: 0xA9, zeroPage: 0xA5, absolute: 0xAD, absoluteX: 0xBD, absoluteY: 0xB9, indirectX: 0xA1, indirectY: 0xB1 },
  LDX: { immediate: 0xA2, zeroPage: 0xA6, zeroPageY: 0xB6, absolute: 0xAE, absoluteY: 0xBE },
  LDY: { immediate: 0xA0, zeroPage: 0xA4, absolute: 0xAC, absoluteX: 0xBC },
  STA: { zeroPage: 0x85, absolute: 0x8D, absoluteX: 0x9D, absoluteY: 0x99, indirectX: 0x81, indirectY: 0x91 },
  STX: { zeroPage: 0x86, zeroPageY: 0x96, absolute: 0x8E },
  STY: { zeroPage: 0x84, absolute: 0x8C },
  ADC: { immediate: 0x69, zeroPage: 0x65, absolute: 0x6D, absoluteX: 0x7D, absoluteY: 0x79, indirectX: 0x61, indirectY: 0x71 },
  SBC: { immediate: 0xE9, zeroPage: 0xE5, absolute: 0xED, absoluteX: 0xFD, absoluteY: 0xF9, indirectX: 0xE1, indirectY: 0xF1 },
  INC: { zeroPage: 0xE6, absolute: 0xEE, absoluteX: 0xFE },
  DEC: { zeroPage: 0xC6, absolute: 0xCE, absoluteX: 0xDE },
  CMP: { immediate: 0xC9, zeroPage: 0xC5, absolute: 0xCD, absoluteX: 0xDD, absoluteY: 0xD9, indirectX: 0xC1, indirectY: 0xD1 },
  CPX: { immediate: 0xE0, zeroPage: 0xE4, absolute: 0xEC },
  CPY: { immediate: 0xC0, zeroPage: 0xC4, absolute: 0xCC },
  AND: { immediate: 0x29, zeroPage: 0x25, absolute: 0x2D, absoluteX: 0x3D, absoluteY: 0x39, indirectX: 0x21, indirectY: 0x31 },
  ORA: { immediate: 0x09, zeroPage: 0x05, absolute: 0x0D, absoluteX: 0x1D, absoluteY: 0x19, indirectX: 0x01, indirectY: 0x11 },
  EOR: { immediate: 0x49, zeroPage: 0x45, absolute: 0x4D, absoluteX: 0x5D, absoluteY: 0x59, indirectX: 0x41, indirectY: 0x51 },
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
  ASL: { implied: 0x0A, zeroPage: 0x06, absolute: 0x0E },
  LSR: { implied: 0x4A, zeroPage: 0x46, absolute: 0x4E },
  ROL: { implied: 0x2A, zeroPage: 0x26, absolute: 0x2E },
  ROR: { implied: 0x6A, zeroPage: 0x66, absolute: 0x6E },
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
  themeToggleButton.addEventListener("click", toggleTheme);
  document.getElementById("crt-toggle")?.addEventListener("click", toggleCrtMode);
  languageSelect.addEventListener("change", handleLanguageChange);
  aboutButton?.addEventListener("click", async () => {
    const version = await window.electronAPI.getAppVersion();
    document.getElementById("about-version").textContent = `v${version}`;
    const dlg = document.getElementById("about-dialog");
    dlg?.querySelectorAll("a[href^='mailto:']").forEach(a => {
      a.addEventListener("click", e => { e.preventDefault(); window.electronAPI.openExternal(a.href); }, { once: true });
    });
    dlg?.showModal();
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
  });
  aboutCloseButton?.addEventListener("click", () => aboutDialog?.close());
  whatsNewButton?.addEventListener("click", () => {
    whatsNewDialog?.showModal();
  });
  whatsNewCloseButton?.addEventListener("click", () => whatsNewDialog?.close());
  knowledgeBaseButton?.addEventListener("click", () => knowledgeBaseDialog?.showModal());
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
  sampleSelect?.addEventListener("change", saveUiSettings);
  loadSampleButton.addEventListener("click", loadSelectedSample);
  saveProjectButton?.addEventListener("click", saveProjectToFile);
  savePrgButton?.addEventListener("click", savePrgToFile);
  loadProjectButton?.addEventListener("click", loadProjectFromFile);
  zoomOutButton.addEventListener("click", () => adjustZoom(-0.08));
  zoomInButton.addEventListener("click", () => adjustZoom(0.08));
  outputModeInputs.forEach((input) => input.addEventListener("change", renderOutputMode));
  compileErrorClose?.addEventListener("click", () => compileErrorDialog?.close());
  compileErrorDialog?.addEventListener("click", (e) => { if (e.target === compileErrorDialog) compileErrorDialog.close(); });
  macroSourceToggleOn?.addEventListener("change", () => {
    showMacroSource = macroSourceToggleOn.checked;
    saveUiSettings();
    renderAsmOutput();
  });
  macroSourceToggle?.addEventListener("change", () => {
    showMacroSource = false;
    saveUiSettings();
    renderAsmOutput();
  });
  asmBaseInputs.forEach(input => {
    input.addEventListener("change", () => {
      asmOutputBase = input.value;
      saveUiSettings();
      renderAsmOutput();
    });
  });

  addSelectedButton.addEventListener("click", addSelectedBlock);
  clearProgramButton.addEventListener("click", clearProgram);
  collapseAllButton.addEventListener("click", collapseAllBlocks);
  expandAllButton.addEventListener("click", expandAllBlocks);
  copyAsmButton?.addEventListener("click", copyAsmToClipboard);
  chooseViceButton?.addEventListener("click", chooseViceExecutable);
  runEmulatorButton?.addEventListener("click", runInEmulator);
  originInput.addEventListener("input", handleOriginInput);
  originBaseInputs.forEach(input => {
    input.addEventListener("change", () => {
      const oldBase = originBase;
      originBase = input.value;
      // Convert the current input value to the new base
      const raw = originInput.value.trim();
      if (raw) {
        const parsed = parseNumberByBase(raw, oldBase) ?? parseNumberByBase(raw, oldBase === "hex" ? "dec" : "hex");
        if (parsed !== null && Number.isInteger(parsed) && parsed >= 0 && parsed <= 0xFFFF) {
          originInput.value = originBase === "hex"
            ? parsed.toString(16).toUpperCase().padStart(4, "0")
            : String(parsed);
        }
      }
      updateOriginPlaceholder();
      saveUiSettings();
      handleOriginInput();
    });
  });
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
  });
}

function applySavedLanguage() {
  const savedLanguage = localStorage.getItem("c64-block-language") || "en";
  currentLanguage = savedLanguage === "en" ? "en" : "hu";
  document.documentElement.lang = currentLanguage;
  if (languageSelect) {
    languageSelect.value = currentLanguage;
  }
}

function applySavedUiSettings() {
  savedUiSettings = readUiSettings();

  if (sampleSelect && savedUiSettings.sample) {
    sampleSelect.value = savedUiSettings.sample;
  }

  if (typeof savedUiSettings.zoom === "number" && Number.isFinite(savedUiSettings.zoom)) {
    blockScale = Math.max(0.72, Math.min(1.25, Number(savedUiSettings.zoom)));
  }

  if (originInput) {
    originInput.value = savedUiSettings.origin || "0801";
  }

  if (baseInputs.length) {
    const selectedBase = savedUiSettings.numberBase === "dec" ? "dec" : "hex";
    baseInputs.forEach((input) => {
      input.checked = input.value === selectedBase;
    });
  }

  if (outputModeInputs.length) {
    const selectedOutputMode = ["asm", "monitor", "both"].includes(savedUiSettings.outputMode)
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

  if (savedUiSettings.showMacroSource !== undefined) {
    showMacroSource = !!savedUiSettings.showMacroSource;
    if (macroSourceToggleOn) macroSourceToggleOn.checked = showMacroSource;
    if (macroSourceToggle) macroSourceToggle.checked = !showMacroSource;
  }

  if (savedUiSettings.asmOutputBase) {
    asmOutputBase = savedUiSettings.asmOutputBase;
  }
  asmBaseInputs.forEach(input => { input.checked = input.value === asmOutputBase; });

  if (savedUiSettings.originBase) {
    originBase = savedUiSettings.originBase;
  }
  originBaseInputs.forEach(input => { input.checked = input.value === originBase; });
  updateOriginPlaceholder();

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
  if (checkUpdateButton) checkUpdateButton.textContent = t("checkForUpdate");
  if (reportBugButton) reportBugButton.textContent = t("reportBug");
  if (whatsNewButton) whatsNewButton.textContent = t("whatsNew");
  if (paletteSearchInput) paletteSearchInput.placeholder = t("paletteSearchPlaceholder");
  const paletteSearchLabel = document.getElementById("palette-search-label");
  if (paletteSearchLabel) paletteSearchLabel.textContent = t("paletteSearchLabel");
  const mnemonicDescLabel = document.getElementById("mnemonic-description-label");
  if (mnemonicDescLabel) mnemonicDescLabel.textContent = t("mnemonicCardLabel");
  const basicSysLabelEl = document.getElementById("basic-sys-label");
  if (basicSysLabelEl) basicSysLabelEl.textContent = t("basicSysLabel");

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
    setText('.origin-label-text', t("originLabel"));
    setText(".global-memory-title", t("memoryTitle"));
    setText(".menu-field span", t("viceExecutable"));
    setText("#choose-vice", t("openEmulator"));
    setText("#run-emulator .run-label", t("runInEmulator"));
    setText("#copy-asm", t("copyAsm"));
    setText("#save-project", t("saveProject"));
    setText("#save-prg", t("savePrg"));
    setText("#program-settings-label", t("programSettings"));
    if (macroSourceToggleText) macroSourceToggleText.textContent = t("macroSourceToggle");
    setText("#asm-numbers-label", t("asmNumbersLabel"));
    setText("#origin-preview-label", t("originPreviewLabel"));
    updateOriginPlaceholder();
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
    themeToggleButton.setAttribute("title", document.body.dataset.theme === "dark" ? t("lightMode") : t("darkMode"));
    const crtToggleBtn = document.getElementById("crt-toggle");
    if (crtToggleBtn) crtToggleBtn.lastElementChild.textContent = t("crtToggle");
    const srOnlyLabels = document.querySelectorAll("label.sample-picker .sr-only");
  if (srOnlyLabels[0]) srOnlyLabels[0].textContent = t("sampleSrOnly");
  const languageLabelEl = document.getElementById("language-label");
  if (languageLabelEl) languageLabelEl.textContent = t("languageLabel");

  const sampleOptions = sampleSelect.options;
  if (sampleOptions[0]) sampleOptions[0].textContent = t("sampleBasic");
  if (sampleOptions[1]) sampleOptions[1].textContent = t("sampleLabel");
  if (sampleOptions[2]) sampleOptions[2].textContent = t("sampleText");
  if (sampleOptions[3]) sampleOptions[3].textContent = t("sampleMacro");
  if (sampleOptions[4]) sampleOptions[4].textContent = t("sampleSprite");
  if (sampleOptions[5]) sampleOptions[5].textContent = t("sampleSetpixel");
  if (sampleOptions[6]) sampleOptions[6].textContent = t("sampleBitmap");
  if (sampleOptions[7]) sampleOptions[7].textContent = t("sampleMacroTest");
  if (sampleOptions[8]) sampleOptions[8].textContent = t("sampleLoop");
  if (sampleOptions[9]) sampleOptions[9].textContent = t("sampleHelloLoop");
  if (sampleOptions[10]) sampleOptions[10].textContent = t("samplePushPull");
  if (sampleOptions[11]) sampleOptions[11].textContent = t("sampleIfElse");
  if (sampleOptions[12]) sampleOptions[12].textContent = t("sampleUserMacro");
  if (sampleOptions[13]) sampleOptions[13].textContent = t("sampleIncBin");
  if (sampleOptions[14]) sampleOptions[14].textContent = t("sampleInclude");
  if (sampleOptions[15]) sampleOptions[15].textContent = t("sampleSidDemo");
  if (sampleOptions[16]) sampleOptions[16].textContent = t("sampleSidDirectDemo");
  if (sampleOptions[17]) sampleOptions[17].textContent = t("sampleSpriteMacroDemo");
  if (sampleOptions[18]) sampleOptions[18].textContent = t("sampleJoystickDemo");
  if (sampleOptions[19]) sampleOptions[19].textContent = t("sampleCollisionDemo");
  if (sampleOptions[20]) sampleOptions[20].textContent = t("sample10Print");

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
  return formatOperand(block.addressingMode, numericValue, asmOutputBase);
}

function updateOriginPlaceholder() {
  originInput.placeholder = originBase === "hex" ? t("originPlaceholderHex") : t("originPlaceholderDec");
}

function handleOriginInput() {
  renderOriginPreview();
  renderAsmOutput();
  renderMemoryMap();
  renderEmulatorRunHint();
  saveUiSettings();
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
      <p>${currentLanguage === "en" ? "Macro addressing: writes byte by byte to an absolute memory address." : "Makro-cimzes: abszolut memoriacimre ir byte-onkent."}</p>
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
      <p>${currentLanguage === "en" ? "Macro addressing: places text as PETSCII bytes directly at an absolute memory address, no LDA/STA code generated." : "Makro-cimzes: szoveget PETSCII byte-kenkent helyez el kozvetlenul egy abszolut memoriacimre, LDA/STA kod generalas nelkul."}</p>
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
  const results = [];

  for (const [category, items] of Object.entries(mnemonicLibrary)) {
    for (const item of items) {
      if (
        item.mnemonic.toLowerCase().includes(q) ||
        getItemDescription(item).toLowerCase().includes(q) ||
        getCategoryLabel(category).toLowerCase().includes(q)
      ) {
        results.push({ item, category, userMacroName: null });
      }
    }
  }

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
      stringAddress: "C000"
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
    const isMacroOrSpecial = block.isLabel || block.isComment || block.isLoopMacro ||
      block.isNextMacro || block.isTableMacro || block.isDefineMacro || block.isConstMacro ||
      block.isIfMacro || block.isElseMacro || block.isEndIfMacro || block.isByteMacro ||
      block.isWordMacro || block.isDataMacro || block.isRawBytesMacro || block.isFillMacro ||
      block.isAlignMacro || block.isTextMacro || block.isStringMacro || block.isRawTextMacro ||
      block.isPetsciiMacro || block.isIncBinMacro || block.isSidMacro || block.isIncludeMacro || block.isPushMacro ||
      block.isPullMacro || block.isMacroDefStart || block.isMacroDefEnd || block.isMacroInvoke ||
      block.isRegionMacro || block.isEndRegionMacro;
    if (!isMacroOrSpecial && block.rawOperand && block.addressingMode) {
      const preview = buildOperandPreview(block.addressingMode, block.rawOperand, block.base || "hex");
      if (!preview.error) block.operand = preview.operand;
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
  });

  return result;
}

function addSelectedBlock() {
  const selected = getSelectedMnemonic();
  insertBlock(program.length, createBlockFromMnemonic(selected));
}

function clearProgram() {
  program = [];
  userMacros = {};
  selectedBlockId = null;
  renderProgram();

  // Clear current file display
  if (currentFileDisplay) {
    currentFileDisplay.textContent = "";
  }
}

function parseUserMacros() {
  userMacros = {};
  let macroStart = -1;
  let macroName = null;

  for (let i = 0; i < program.length; i++) {
    const block = program[i];

    if (block.isMacroDefStart) {
      macroStart = i;
      macroName = block.macroName;
    } else if (block.isMacroDefEnd && macroStart >= 0 && macroName) {
      const macroBody = program.slice(macroStart + 1, i);
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
        const numericValue = parseNumberByBase(block.rawOperand.trim().replace(/^\$/, ""), prevBase);
        if (numericValue !== null) {
          block.rawOperand = value === "hex"
            ? numericValue.toString(16).toUpperCase()
            : String(numericValue);
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
    block.validationError = validateStringMacroAddress(block.stringAddress);
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
    block.validationError = validateStringMacroAddress(block.rawTextAddress);
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

  if (block.isSpriteInitMacro && (field === "spriteNum" || field === "spriteColor" || field === "spriteDataPage")) {
    block.validationError = validateSpriteInitMacro(block.spriteNum, block.spriteColor, block.spriteDataPage);
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

  renderProgram();
}

function deleteBlock(index) {
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
    .map((b) => targetBase === "hex" ? b.toString(16).toUpperCase().padStart(2, "0") : b.toString(10))
    .join(",");
}

function parseByteMacro(raw, base = "dec") {
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
      return Number.parseInt(part, base === "hex" ? 16 : 10);
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
    const validHexPrefixed = /^\$[0-9A-Fa-f]+$/.test(part) || /^0x[0-9A-Fa-f]+$/i.test(part);
    const validBare = base === "hex" ? /^[0-9A-Fa-f]+$/.test(part) : /^\d+$/.test(part);
    if (!validHexPrefixed && !validBare) {
      return base === "hex"
        ? (currentLanguage === "en" ? "BYTE macro only accepts hex bytes separated by commas, for example FF,00,8D." : "A BYTE makroban csak hex byte-ok lehetnek, peldaul FF,00,8D.")
        : (currentLanguage === "en" ? "BYTE macro only accepts decimal or hex bytes separated by commas." : "A BYTE makroban csak decimalis vagy hex byte-ok lehetnek, vesszovel elvalasztva.");
    }

    const value = validHexPrefixed
      ? Number.parseInt(part.replace(/^\$/, "").replace(/^0x/i, ""), 16)
      : Number.parseInt(part, base === "hex" ? 16 : 10);

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
      return Number.parseInt(part, base === "hex" ? 16 : 10);
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
    return Number.parseInt(part, base === "hex" ? 16 : 10);
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

function encodeTextMacro(text) {
  return [...(text || "HELLO C64")].map((char) => toPetsciiCharCode(char));
}

// PETSCII makro: szoveg → PETSCII byte-ok (CHROUT-kompatibilis)
// Nagybetuk: $41-$5A, kisbetuk: $61-$7A, egyeb: ASCII ertek
function encodePetsciiMacro(text) {
  return [...(text || "HELLO")].map((char) => {
    const code = char.charCodeAt(0);
    if (code >= 32 && code <= 126) return code; // printable ASCII = PETSCII
    if (char === "\n") return 13;
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

  if (modeKey === "immediate" || modeKey === "zeroPage" || modeKey === "indirectX" || modeKey === "indirectY" || modeKey === "zeroPageY") {
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
  const formatter = base === "hex" ? toHex : toDec;

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

function applySavedTheme() {
  const savedTheme = localStorage.getItem("c64-block-theme") || "light";
  document.body.dataset.theme = savedTheme;
  updateThemeToggleLabel();
}

function toggleTheme() {
  document.body.dataset.theme = document.body.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("c64-block-theme", document.body.dataset.theme);
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
  const nextModeLabel = document.body.dataset.theme === "dark" ? t("lightMode") : t("darkMode");
  themeToggleButton.setAttribute("aria-label", nextModeLabel);
  themeToggleButton.setAttribute("title", nextModeLabel);
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
  return {
    version: 1,
    app: "c64-visual-assembler",
    origin: originInput?.value || "0801",
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
      theme: document.body.dataset.theme || "light"
    }
  };
}

function updateWindowTitle(fileName) {
  const base = "C64 Visual Assembler";
  const title = fileName ? `${base} - ${fileName}` : base;
  window.electronAPI?.setWindowTitle?.(title);
}

async function saveProjectToFile() {
  if (!window.electronAPI?.saveProject) {
    if (emulatorStatus) {
      emulatorStatus.textContent = t("projectSaveFailed");
    }
    return;
  }

  const result = await window.electronAPI.saveProject(getProjectPayload());
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
  if (currentFileDisplay && result.filePath) {
    const fileName = result.filePath.split(/[\\/]/).pop();
    currentFileDisplay.textContent = `📄 ${fileName}`;
    updateWindowTitle(fileName);
  }
}

function showCompileErrorDialog(errors) {
  if (!compileErrorDialog || !compileErrorList) return;
  if (compileErrorTitle) compileErrorTitle.textContent = t("compileErrorTitle");
  compileErrorList.innerHTML = errors
    .map(err => `<li>${err.replace(/</g, "&lt;")}</li>`)
    .join("");
  compileErrorDialog.showModal();
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

async function reloadIncludeBlocks() {
  if (!window.electronAPI?.reloadIncludeFile) return;
  for (const block of program) {
    if (block.isIncludeMacro && block.includeFile) {
      const result = await window.electronAPI.reloadIncludeFile(block.includeFile);
      if (!result.error) {
        block.includedBlocks = result.blocks || [];
        block.includeFileName = result.fileName;
        block.validationError = "";
      } else {
        block.includedBlocks = [];
        block.validationError = result.error;
      }
    }
  }
}

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
  await reloadIncludeBlocks();

  if (originInput) {
    originInput.value = projectData.origin || "0801";
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
  saveUiSettings();

  if (emulatorStatus) {
    emulatorStatus.textContent = `${t("projectLoaded")}: ${result.filePath}`;
  }

  // Update current file display
  if (currentFileDisplay && result.filePath) {
    const fileName = result.filePath.split(/[\\/]/).pop();
    currentFileDisplay.textContent = `📄 ${fileName}`;
    updateWindowTitle(fileName);
  }
}

async function copyAsmToClipboard() {
  if (!copyAsmButton) {
    return;
  }

  try {
    await navigator.clipboard.writeText(asmOutput.textContent);
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
  if (!vicePath) {
    showViceToast(currentLanguage === "en" ? "VICE is not configured. Select it in the menu first." : "A VICE nincs beallitva. Valaszd ki a menuben.", true);
    return;
  }

  const prg = buildAutostartPrgForEmulator();
  if (!prg.ok) {
    if (prg.errors?.length) { showCompileErrorDialog(prg.errors); return; }
    if (emulatorStatus) emulatorStatus.textContent = prg.error;
    return;
  }

  if (!window.electronAPI?.launchVice) {
    showViceToast(currentLanguage === "en" ? "VICE launch is not available." : "A VICE inditasa nem elerheto.", true);
    return;
  }

  const result = await window.electronAPI.launchVice({
    bytes: Array.from(prg.bytes),
    fileName: `c64-visual-assembler-${Date.now()}.prg`
  });

  if (!result?.ok) {
    showViceToast(result?.error || (currentLanguage === "en" ? "Launching VICE failed." : "A VICE inditasa sikertelen."), true);
    return;
  }

  updateVicePathPreview(result.vicePath || vicePath);
  const parts = (result.filePath || "").replace(/\\/g, "/").split("/");
  const fileName = parts[parts.length - 1] || result.filePath;
  showViceToast(fileName);
}

function buildAutostartPrgForEmulator() {
  const useBasicSys = basicSysToggle ? basicSysToggle.checked : true;

  if (!useBasicSys) {
    // When BASIC SYS stub is disabled, use the user-defined origin value
    // If origin is $0801 (BASIC area), automatically use $C000 (Free RAM) instead
    const origin = parseOriginValue();
    const targetOrigin = (origin.value === 0x0801) ? 0xC000 : origin.value;
    return assembleProgramToPrg(targetOrigin);
  }

  const sysAddress = 0x080D;
  const codePrg = assembleProgramToPrg(sysAddress);
  if (!codePrg.ok) {
    return codePrg;
  }

  const basicStub = buildBasicSysStub(sysAddress);
  const bytes = new Uint8Array(basicStub.length + codePrg.bytes.length - 2);
  bytes.set(basicStub, 0);
  bytes.set(codePrg.bytes.slice(2), basicStub.length);

  return {
    ok: true,
    bytes,
    sysAddress
  };
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

  // Assemble inline code bytes, collecting all errors
  const inlineBytes = [];
  const compileErrors = [];
  for (const line of layout.lines) {
    if (line.block.isLabel || line.block.isComment || line.block.isIncludeMacro) continue;
    const compiled = compileLineBytes(line, labels);
    if (!compiled.ok) {
      const addr = `$${line.address.toString(16).toUpperCase().padStart(4, "0")}`;
      const mnemonic = line.block.mnemonic || "?";
      const operand = line.block.operand ? ` ${line.block.operand}` : "";
      compileErrors.push(`${addr}  ${mnemonic}${operand} — ${compiled.error}`);
    } else {
      inlineBytes.push(...compiled.bytes);
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
      const chunkBytes = encodeTextMacro(block.rawOperand);
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

  if (deferredChunks.length === 0) {
    const bytes = [origin & 0xFF, (origin >> 8) & 0xFF, ...inlineBytes];
    return { ok: true, bytes: new Uint8Array(bytes) };
  }

  // Determine full address range across inline code + deferred chunks
  let maxAddr = origin + inlineBytes.length - 1;
  for (const chunk of deferredChunks) {
    maxAddr = Math.max(maxAddr, chunk.addr + chunk.bytes.length - 1);
  }

  // Build flat buffer from origin to maxAddr (zeros for gaps)
  const bufSize = maxAddr - origin + 1;
  const buf = new Uint8Array(bufSize);
  buf.set(inlineBytes, 0);
  for (const chunk of deferredChunks) {
    const offset = chunk.addr - origin;
    if (offset >= 0 && offset + chunk.bytes.length <= bufSize) {
      buf.set(chunk.bytes, offset);
    }
  }

  // PRG: 2-byte load address header + flat buffer
  const result = new Uint8Array(2 + bufSize);
  result[0] = origin & 0xFF;
  result[1] = (origin >> 8) & 0xFF;
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

  if (block.validationError) {
    return { ok: false, error: tf("compileInvalidOperand", { mnemonic: block.mnemonic }) };
  }

  if (block.isTextMacro) {
    const chars = encodeTextMacro(block.rawOperand);
    const startAddress = 0x0400 + ((block.textY ?? 0) * 40) + (block.textX ?? 0);
    const bytes = [];
    chars.forEach((charCode, charIndex) => {
      const targetAddress = startAddress + charIndex;
      bytes.push(0xA9, charCode & 0xFF, 0x8D, targetAddress & 0xFF, (targetAddress >> 8) & 0xFF);
    });
    return {
      ok: true,
      bytes,
      comment: `TEXT "${block.rawOperand || ""}" @ (${block.textX ?? 0}, ${block.textY ?? 0})`
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
    const chars = encodeTextMacro(block.rawOperand);
    const startAddress = parseAddressValue(block.stringAddress) ?? 0xC000;
    const bytes = [];
    chars.forEach((charCode, charIndex) => {
      const targetAddress = startAddress + charIndex;
      bytes.push(0xA9, charCode & 0xFF, 0x8D, targetAddress & 0xFF, (targetAddress >> 8) & 0xFF);
    });
    return {
      ok: true,
      bytes,
      comment: `STRING "${block.rawOperand || ""}" @ ${formatAddress(startAddress)}`
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
    const relative = resolveRelativeOperand(block, line.address, labels);
    if (!relative.ok) {
      return relative;
    }
    bytes.push(relative.value & 0xFF);
    return { ok: true, bytes, comment: `${block.mnemonic} ${block.operand || block.rawOperand}` };
  }

  const operandValue = resolveNumericOperand(block, labels);
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

  const parsed = parseNumberByBase(stripped.replace(/^\$/, ""), block.base);
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

function parseNumberByBase(value, base) {
  if (base === "hex") {
    const normalized = value.replace(/^\$/, "");
    return /^[0-9A-Fa-f]+$/.test(normalized) ? Number.parseInt(normalized, 16) : null;
  }

  return /^-?\d+$/.test(value) ? Number(value) : null;
}

function getNumberFormatError(base) {
  return base === "hex"
    ? (currentLanguage === "en" ? "In hex mode use only 0-9 and A-F characters, optionally with a $ prefix." : "Hex modban csak 0-9 es A-F karaktereket hasznalj, opcionis $ elotaggal.")
    : (currentLanguage === "en" ? "In decimal mode provide only whole numbers." : "Decimalis modban csak egesz szamot adj meg.");
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

  return modeText(modeKey, "placeholder");
}

function parseOriginValue() {
  const raw = originInput.value.trim();
  if (!raw) {
    return { value: defaultOrigin, text: toHex(defaultOrigin, 4), error: "" };
  }

  const parsed = parseNumberByBase(raw, originBase) ?? parseNumberByBase(raw, "hex");
  if (parsed === null || !Number.isInteger(parsed)) {
    return { value: defaultOrigin, text: raw, error: currentLanguage === "en" ? "The start address is not a valid number." : "A kezdocim nem ervenyes szam." };
  }

  if (parsed < 0 || parsed > 0xFFFF) {
    return { value: defaultOrigin, text: formatAddress(defaultOrigin), error: currentLanguage === "en" ? "The start address must be between 0 and 65535." : "A kezdocimnek 0 es 65535 kozott kell lennie." };
  }

  return { value: parsed, text: formatAddress(parsed), error: "" };
}

function renderOriginPreview() {
  const origin = parseOriginValue();
  const useBasicSys = basicSysToggle ? basicSysToggle.checked : true;

  let effectiveNote;
  if (useBasicSys && !origin.error) {
    effectiveNote = `<small>${currentLanguage === "en" ? "Code placed at $080D (after BASIC stub)" : "Kód elhelyezése: $080D (BASIC stub után)"}</small>`;
  } else if (!useBasicSys && origin.value === 0x0801 && !origin.error) {
    const warning = currentLanguage === "en"
      ? "Auto-switched to $C000 (Free RAM)<br><span style='color: #d97706;'>⚠ Sample programs may not work without BASIC SYS stub</span>"
      : "Automatikusan átváltva: $C000 (Szabad RAM)<br><span style='color: #d97706;'>⚠ Mintaprogramok nem biztos hogy működnek BASIC SYS stub nélkül</span>";
    effectiveNote = `<small>${warning}</small>`;
  } else if (origin.error) {
    effectiveNote = `<small class="error-text">${origin.error}</small>`;
  } else {
    effectiveNote = `<small>${origin.value} dec | ${origin.text} hex</small>`;
  }

  originPreview.innerHTML = `<strong>*= ${origin.text}</strong> ${effectiveNote}`;
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

  if (block.isLabel) {
    return 0;
  }

  if (block.isComment) {
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

  if (block.isWaitRasterMacro) {
    return 7;  // LDA $D012 + CMP #rl + BNE -7
  }

  if (block.isSpriteColMacro) {
    return 5;  // LDA $D01E/$D01F + AND #mask
  }

  if (block.isSpriteInitMacro) {
    return 18;  // LDA/STA ptr + LDA/ORA/STA $D015 + LDA/STA color
  }

  if (block.isSpritePosMacro) {
    return 18;  // LDA/STA xLow + LDA/[ORA|AND]/STA $D010 + LDA/STA y
  }

  if (block.isLoopMacro) {
    return 2;  // LDX/LDY #count
  }

  if (block.isNextMacro) {
    return 3;  // DEX/DEY + BNE offset
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

  if (block.isTableMacro) {
    return 0;  // TABLE is just a label
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

  if (block.addressingMode === "immediate" || block.addressingMode === "zeroPage" || block.addressingMode === "relative" || block.addressingMode === "indirectX" || block.addressingMode === "indirectY" || block.addressingMode === "zeroPageY") {
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

  for (const block of program) {
    if (block.isMacroDefStart) {
      insideMacroDef = true;
      if (showMacroSource) expandedProgram.push(block);
      continue;
    }
    if (block.isMacroDefEnd) {
      insideMacroDef = false;
      if (showMacroSource) expandedProgram.push(block);
      continue;
    }
    if (insideMacroDef) {
      if (showMacroSource) {
        expandedProgram.push({ ...block, _macroSourceBlock: true });
      }
      continue;
    }

    // Expand INCLUDE blocks inline
    if (block.isIncludeMacro) {
      expandedProgram.push(block); // header marker, 0 bytes
      if (block.includedBlocks?.length) {
        for (const subBlock of block.includedBlocks) {
          expandedProgram.push({ ...subBlock, _fromInclude: block.id, _includeFileName: block.includeFileName });
        }
      }
      continue;
    }

    // Check if this block invokes a user macro (INVOKE block or legacy format)
    const macroName = block.isMacroInvoke ? block.invokeMacroName : (userMacros[block.mnemonic] ? block.mnemonic : null);

    if (macroName && userMacros[macroName]) {
      const invokeId = block.id;
      // Add INVOKE block as a zero-size header line for ASM view selection
      expandedProgram.push({ ...block, _isMacroInvokeHeader: true });
      // Expand the macro body inline, linking back to the INVOKE block
      for (const macroBlock of userMacros[macroName]) {
        expandedProgram.push({
          ...macroBlock,
          id: crypto.randomUUID(),
          _fromMacro: macroName,
          _invokeBlockId: invokeId
        });
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

  const lines = expandedProgram.map((block) => {
    let size = getInstructionSize(block);

    if (skippedBlocks.has(block)) {
      return { block, size: 0, address: cursor, end: cursor - 1, conditionallySkipped: true };
    }

    // Handle TABLE macro: set address cursor if tableAddress is present
    if (block.isTableMacro && block.tableAddress) {
      const tableAddr = parseAddressValue(block.tableAddress);
      if (typeof tableAddr === "number" && !isNaN(tableAddr)) {
        cursor = tableAddr;
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
        const chars = encodeTextMacro(line.block.rawOperand);
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
        const chars = encodeTextMacro(line.block.rawOperand);
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
    freeRamBytes: Math.max(0, totalRamBytes - occupiedRamBytes)
  };
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

  return `
    <div class="memory-strip-track">
      <div class="memory-strip-base">${segmentMarkup}</div>
      <div class="memory-strip-overlays">${overlayMarkup}</div>
    </div>
    <div class="memory-strip-axis">
      <span>$0000</span>
      <span>$FFFF</span>
    </div>
  `;
}

function renderMemoryStrip() {
  const usage = getMemoryUsage();
  const markup = buildMemoryStripMarkup(usage);

  if (!memoryStrip || !memoryStripTop) {
    return;
  }
  memoryStripTop.innerHTML = markup;
  memoryStrip.innerHTML = markup;
}

function renderMemoryMap() {
  const usage = getMemoryUsage();
  const layout = usage.layout;
  memoryMap.innerHTML = "";

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

  renderMemoryStrip();
}

function isRomOrIoSegment(segment) {
  return segment.kind === "rom" || segment.kind === "io";
}

function getBlockDescription(block) {
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
    return block.validationError || `${currentLanguage === "en" ? "STRING macro" : "STRING makro"}: "${block.rawOperand || ""}" @ ${block.stringAddress || "C000"}`;
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
    return block.validationError || `${currentLanguage === "en" ? "INCLUDE" : "INCLUDE"}: "${name}" (${count} ${t("includeBlocksCount")})`;
  }

  if (block.isRawTextMacro) {
    return block.validationError || `${currentLanguage === "en" ? "RAWTEXT macro" : "RAWTEXT makro"}: "${block.rawOperand || ""}" @ ${block.rawTextAddress || "C000"}`;
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
    return `${currentLanguage === "en" ? "Memory" : "Memoria"} | ${block.stringAddress || "C000"}`;
  }

  if (block.isDataMacro) {
    return `${currentLanguage === "en" ? "Memory" : "Memoria"} | ${block.dataAddress || "C000"}`;
  }

  if (block.isRawBytesMacro) {
    return `${currentLanguage === "en" ? "Raw @ memory" : "Nyers @ memoria"} | ${block.rawBytesAddress || "C000"}`;
  }

  if (block.isRawTextMacro) {
    return `${currentLanguage === "en" ? "Raw @ memory" : "Nyers @ memoria"} | ${block.rawTextAddress || "C000"}`;
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

  if (block.isWaitRasterMacro) {
    const rl = (block.rasterLine || "FF").replace(/^\$/, "").toUpperCase().padStart(2, "0");
    return `$D012 = $${rl}`;
  }

  if (block.isSpriteColMacro) {
    const typeLabel = (block.colType || "sprite") === "background"
      ? (currentLanguage === "en" ? "bg" : "hatter")
      : (currentLanguage === "en" ? "spr" : "sprite");
    return `#${block.spriteNum || "0"} ${typeLabel} → BEQ/BNE`;
  }

  if (block.isSpriteInitMacro) {
    const pageHex = (block.spriteDataPage || "21").replace(/^\$/, "").toUpperCase().padStart(2, "0");
    return `#${block.spriteNum || "0"} col=${block.spriteColor || "7"} page=$${pageHex}`;
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

      if (block.isLabel) {
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
          ${block.sidTitle ? `<div class="sid-meta">
            <span class="sid-meta-title">${block.sidTitle}</span>
            <span class="sid-meta-line">${block.sidAuthor || ""}</span>
            <span class="sid-meta-line">Load: ${fmtHex(block.sidLoadAddress)} &nbsp; Init: ${fmtHex(block.sidInitAddress)} &nbsp; Play: ${fmtHex(block.sidPlayAddress)}</span>
          </div>` : ""}
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
        renderProgram();
        renderAsmOutput();
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
      blockControls.insertAdjacentHTML(
        "beforeend",
        `<div class="region-btn-row">
          <button type="button" class="region-expand-all-btn" title="${currentLanguage === "en" ? "Expand all blocks in region" : "Régió blokkjainak kinyitása"}">&#8597;</button>
          <button type="button" class="region-select-asm-btn" title="${currentLanguage === "en" ? "Select region range in ASM view" : "Régió kijelölése az ASM nézetben"}">&#9678;</button>
        </div>`
      );
      blockControls.querySelector(".region-expand-all-btn")?.addEventListener("click", () => {
        // Expand the group itself if collapsed, then expand all child blocks
        if (block.regionCollapsed) {
          block.regionCollapsed = false;
          block.collapsed = false;
        }
        let inside = false;
        program.forEach((b, i) => {
          if (i === index) { inside = true; return; }
          if (b.isRegionMacro || b.isEndRegionMacro) { inside = false; return; }
          if (inside) b.collapsed = false;
        });
        renderProgram();
      });

      blockControls.querySelector(".region-select-asm-btn")?.addEventListener("click", () => {
        // Find the matching ENDREGION block
        let endGroupBlock = null;
        let depth = 0;
        for (let i = index; i < program.length; i++) {
          if (program[i].isRegionMacro) depth++;
          else if (program[i].isEndRegionMacro) {
            depth--;
            if (depth === 0) { endGroupBlock = program[i]; break; }
          }
        }
        const groupRange = asmBlockRanges[block.id];
        const endRange = endGroupBlock ? asmBlockRanges[endGroupBlock.id] : null;
        if (groupRange) {
          const combinedRange = {
            firstLine: groupRange.firstLine,
            lastLine: endRange ? endRange.lastLine : groupRange.lastLine
          };
          // Switch to ASM view if not visible
          const asmTab = document.querySelector('[data-tab="asm"]');
          if (asmTab && !asmTab.classList.contains("active")) asmTab.click();
          // Apply highlight using the combined range
          const tempId = "__group_range__";
          asmBlockRanges[tempId] = combinedRange;
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
      if (mode.needsOperand && (block.addressingMode === "relative" || block.addressingMode === "absolute" || block.addressingMode === "absoluteX" || block.addressingMode === "absoluteY" || block.addressingMode === "immediate")) {
        const programLabels = block.addressingMode === "immediate"
          ? []
          : program.filter(b => b.isLabel && b.labelName).map(b => b.labelName);
        const constNames = program.filter(b => b.isConstMacro && b.constName).map(b => b.constName);
        const pickerNames = [...programLabels, ...constNames];
        if (pickerNames.length > 0) {
          operandField.classList.add("has-label-picker");
          const wrapper = document.createElement("div");
          wrapper.className = "label-picker-wrap";
          operandField.parentNode.insertBefore(wrapper, operandField);
          wrapper.appendChild(operandField);
          const dropdown = document.createElement("div");
          dropdown.className = "label-picker-dropdown";
          dropdown.hidden = true;
          dropdown.innerHTML = pickerNames.map(n => `<div class="label-picker-item">${n}</div>`).join("");
          document.body.appendChild(dropdown);
          function positionLabelDropdown() {
            const r = operandField.getBoundingClientRect();
            dropdown.style.top = (r.bottom + window.scrollY + 4) + "px";
            dropdown.style.left = (r.left + window.scrollX) + "px";
            dropdown.style.width = r.width + "px";
          }
          function closeLabelDropdown() {
            dropdown.hidden = true;
            window.removeEventListener("scroll", closeLabelDropdown, { capture: true });
          }
          operandField.addEventListener("focus", () => {
            positionLabelDropdown();
            dropdown.hidden = false;
            window.addEventListener("scroll", closeLabelDropdown, { capture: true, passive: true });
          });
          operandField.addEventListener("blur", () => { setTimeout(closeLabelDropdown, 150); });
          operandField.addEventListener("keydown", e => { if (e.key === "Escape") closeLabelDropdown(); });
          dropdown.querySelectorAll(".label-picker-item").forEach(item => {
            item.addEventListener("pointerdown", e => {
              e.preventDefault();
              operandField.value = item.textContent;
              operandField.dispatchEvent(new Event("input"));
              dropdown.hidden = true;
            });
          });
        }
      }
    }

    blockControls.insertAdjacentHTML(
      "beforeend",
      `
          ${(mode.needsOperand && !block.isLabel && !block.isComment && !block.isTextMacro && !block.isByteMacro && !block.isStringMacro && !block.isDataMacro && !block.isRawBytesMacro && !block.isRawTextMacro && !block.isPetsciiMacro && !block.isIncBinMacro && !block.isIncludeMacro && !block.isLoopMacro && !block.isNextMacro && !block.isWordMacro && !block.isFillMacro && !block.isAlignMacro && !block.isTableMacro && !block.isIfMacro && !block.isElseMacro && !block.isEndIfMacro && !block.isMacroInvoke && !block.isRegionMacro && !block.isEndRegionMacro) || block.isByteMacro || block.isDataMacro || block.isRawBytesMacro || block.isWordMacro || block.isFillMacro || block.isAlignMacro ? `
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
          </div>
        </label>` : ""}
          <label class="mini-field"${block.isLabel || block.isComment || block.isTextMacro || block.isByteMacro || block.isStringMacro || block.isDataMacro || block.isRawBytesMacro || block.isRawTextMacro || block.isPetsciiMacro || block.isIncBinMacro || block.isSidMacro || block.isIncludeMacro || block.isLoopMacro || block.isNextMacro || block.isWordMacro || block.isFillMacro || block.isAlignMacro || block.isTableMacro || block.isDefineMacro || block.isIfMacro || block.isElseMacro || block.isEndIfMacro || block.isMacroInvoke || block.isMacroDefStart || block.isMacroDefEnd || block.isPushMacro || block.isPullMacro || block.isRegionMacro || block.isEndRegionMacro || getMnemonicModes(block.mnemonic).length <= 1 ? ` hidden` : ""}>
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
        // For LOOP blocks, convert loopCount between hex and dec
        if (block.isLoopMacro) {
          const countInput = node.querySelector(".loop-count");
          const rawCount = (countInput?.value || block.loopCount || "0A").trim();
          const oldBase = newBase === "hex" ? "dec" : "hex";
          let parsed;
          if (oldBase === "dec") {
            parsed = /^\d+$/.test(rawCount) ? parseInt(rawCount, 10) : parseInt(rawCount, 16);
          } else {
            parsed = parseInt(rawCount, 16);
          }
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 255) {
            const converted = newBase === "hex"
              ? parsed.toString(16).toUpperCase().padStart(2, "0")
              : String(parsed);
            if (countInput) countInput.value = converted;
            updateProgramBlock(index, "loopCount", converted);
          }
        }
        // For CONST blocks, convert the value input between hex and dec
        if (block.isConstMacro) {
          const constValueInput = node.querySelector(".const-value");
          const rawVal = (constValueInput?.value || block.rawOperand || "0").trim();
          const oldBase = newBase === "hex" ? "dec" : "hex";
          const parsed = parseNumberByBase(rawVal.replace(/^\$/, ""), oldBase);
          if (parsed !== null && parsed >= 0 && parsed <= 65535 && constValueInput) {
            constValueInput.value = newBase === "hex"
              ? parsed.toString(16).toUpperCase().padStart(4, "0")
              : String(parsed);
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
    const joyPortSelect = node.querySelector(".joy-port");
    if (joyPortSelect) {
      joyPortSelect.addEventListener("change", (event) => updateProgramBlock(index, "joyPort", event.target.value));
    }
    const joySpriteNumInput = node.querySelector(".joy-sprite-num");
    if (joySpriteNumInput) {
      joySpriteNumInput.addEventListener("input", (event) => updateProgramBlock(index, "joySpriteNum", event.target.value));
    }
    const rasterLineInput = node.querySelector(".raster-line");
    if (rasterLineInput) {
      rasterLineInput.addEventListener("input", (event) => updateProgramBlock(index, "rasterLine", event.target.value));
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
}

function getMnemonicModes(mnemonic) {
  const items = Object.values(mnemonicLibrary).flat();
  return items.find((item) => item.mnemonic === mnemonic)?.modes || ["implied"];
}

function applyAsmHighlight(blockId) {
  const rangeInfo = asmBlockRanges[blockId];
  const text = asmOutput.textContent;
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
      asmOutput.appendChild(document.createTextNode(line));
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
}

function renderAsmOutput() {
  const layout = getProgramLayout();

  if (!program.length) {
    asmOutput.textContent = `*= ${layout.origin.text}\n; ${currentLanguage === "en" ? "The C64 assembly source will appear here" : "Itt fog megjelenni a C64 assembly kod"}`;
    renderMonitorOutput(layout);
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

    // Handle macro source blocks (body of MACRO/ENDM definition when toggle is on)
    if (line.block._macroSourceBlock) {
      if (line.block.isLabel) return `    ${line.block.labelName}:`;
      if (line.block.isComment) return `    ; ${line.block.rawOperand || ""}`;
      if (line.block.validationError) {
        const suffix = line.block.operand ? ` ${line.block.operand}` : "";
        return `    ${line.block.mnemonic}${suffix}  ; ${t("warningLabel")}: ${line.block.validationError}`;
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
      if (line.block.isLabel) {
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

    if (line.block.isComment) {
      return `; ${line.block.rawOperand || ""}`;
    }

    if (line.block.isRegionMacro) {
      return `; ===[ ${line.block.regionName || "region"} ]===`;
    }

    if (line.block.isEndRegionMacro) {
      let regionName = "region";
      let depth = 0;
      for (let i = index - 1; i >= 0; i--) {
        if (layout.lines[i].block.isEndRegionMacro) { depth++; }
        else if (layout.lines[i].block.isRegionMacro) {
          if (depth === 0) { regionName = layout.lines[i].block.regionName || "region"; break; }
          depth--;
        }
      }
      return `; ===[/${regionName}]===`;
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
        text: `text_${lineNumber}:\n    ; .text "${line.block.rawOperand || ""}" -> screen (${line.block.textX ?? 0}, ${line.block.textY ?? 0})\n    ; ${formatAddress(startAddress)}\n${expanded}`
      });
      return `; .text text_${lineNumber}`;
    }

    if (line.block.isByteMacro) {
      const asmBytes = parseByteMacro(line.block.rawOperand, line.block.base);
      const asmByteList = asmBytes.map(b => toHex(b, 2)).join(", ");
      return `    .byte ${asmByteList}`;
    }

    if (line.block.isStringMacro) {
      const chars = encodeTextMacro(line.block.rawOperand);
      const startAddress = parseAddressValue(line.block.stringAddress) ?? 0xC000;
      const expanded = chunkBytes(chars, 16).map((chunk, chunkIndex) => {
        const chunkAddress = startAddress + (chunkIndex * 16);
        const byteList = chunk.map((byte) => toHex(byte, 2)).join(", ");
        return `    ; ${formatAddress(chunkAddress)}\n    .byte ${byteList}`;
      }).join("\n");
      deferredDataSections.push({
        address: startAddress,
        text: `string_${lineNumber}:\n    ; .string "${line.block.rawOperand || ""}" -> ${formatAddress(startAddress)}\n    ; ${formatAddress(startAddress)}\n${expanded}`
      });
      return `; .string string_${lineNumber}`;
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
        text: `data_${lineNumber}:\n    ; .data ${line.block.rawOperand || ""} -> ${formatAddress(startAddress)}\n    ; ${formatAddress(startAddress)}\n${expanded}`
      });
      return `; .data data_${lineNumber}`;
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
        text: `rawbytes_${lineNumber}:\n    ; .rawbytes ${line.block.rawOperand || ""} -> ${formatAddress(startAddress)}\n    ; ${formatAddress(startAddress)}\n${expanded}`
      });
      return `; .rawbytes rawbytes_${lineNumber}`;
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
          text: `incbin_${lineNumber}:\n    ; .incbin "${fileName}" -> ${formatAddress(startAddress)}\n    ; ${formatAddress(startAddress)}\n${expanded}`
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
      const init = line.block.sidInitAddress || 0;
      const play = line.block.sidPlayAddress || 0;
      if (bytes.length > 0 && load > 0) {
        const overrideNote = customAddr != null ? " [override]" : "";
        return `; .sid "${fileName}" @ ${formatAddress(load)}${overrideNote}  init:${formatAddress(init)}  play:${formatAddress(play)}  (${bytes.length} bytes)`;
      }
      return `; .sid "${fileName}" (${currentLanguage === "en" ? "no file loaded" : "nincs betoltott fajl"})`;
    }

    if (line.block.isIncludeMacro) {
      const count = (line.block.includedBlocks || []).length;
      const fname = line.block.includeFileName || "?";
      if (count === 0) return `; .include "${fname}" (${currentLanguage === "en" ? "no blocks loaded" : "nincsenek blokkok betoltve"})`;
      return `; .include "${fname}" — ${count} ${t("includeBlocksCount")}`;
    }

    if (line.block.isRawTextMacro) {
      const chars = encodeTextMacro(line.block.rawOperand);
      const startAddress = parseAddressValue(line.block.rawTextAddress) ?? 0xC000;
      const expanded = chunkBytes(chars, 16).map((chunk, chunkIndex) => {
        const chunkAddress = startAddress + (chunkIndex * 16);
        const byteList = chunk.map((byte) => toHex(byte, 2)).join(", ");
        return `    ; ${formatAddress(chunkAddress)}\n    .byte ${byteList}`;
      }).join("\n");
      deferredDataSections.push({
        address: startAddress,
        text: `rawtext_${lineNumber}:\n    ; .rawtext "${line.block.rawOperand || ""}" -> ${formatAddress(startAddress)}\n    ; ${formatAddress(startAddress)}\n${expanded}`
      });
      return `; .rawtext rawtext_${lineNumber}`;
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
        text: `petscii_${lineNumber}:\n    ; .petscii "${line.block.rawOperand || ""}" -> ${formatAddress(startAddress)}\n    ; ${formatAddress(startAddress)}\n${expanded}`
      });
      return `; .petscii petscii_${lineNumber}`;
    }

    if (line.block.isLoopMacro) {
      const reg = line.block.loopReg || "X";
      const rawCount = (line.block.loopCount || "00").trim();
      const parsedCount = /^\d+$/.test(rawCount) ? parseInt(rawCount, 10) : parseInt(rawCount, 16);
      const countHex = isNaN(parsedCount) ? rawCount.toUpperCase() : parsedCount.toString(16).toUpperCase().padStart(2, "0");
      const label = line.block.loopLabel || "loop";
      return `    LD${reg} #$${countHex}\n${label}:`;
    }

    if (line.block.isNextMacro) {
      const reg = line.block.nextReg || "X";
      const label = line.block.nextLabel || "loop";
      return `    DE${reg}\n    BNE ${label}`;
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

    if (line.block.isRegionMacro) {
      return `; ===[ ${line.block.regionName || "region"} ]===`;
    }

    if (line.block.isEndRegionMacro) {
      let regionName = "region";
      let depth = 0;
      for (let i = index - 1; i >= 0; i--) {
        if (layout.lines[i].block.isEndRegionMacro) { depth++; }
        else if (layout.lines[i].block.isRegionMacro) {
          if (depth === 0) { regionName = layout.lines[i].block.regionName || "region"; break; }
          depth--;
        }
      }
      return `; ===[/${regionName}]===`;
    }

    if (line.block.isDefineMacro) {
      return `; .DEFINE ${line.block.defineSymbol || "?"}`;
    }

    if (line.block.isConstMacro) {
      const constVal = parseNumberByBase((line.block.rawOperand || "").replace(/^\$/, ""), line.block.base);
      const formatted = constVal !== null ? formatOperand("absolute", constVal, asmOutputBase) : "?";
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

    if (line.block.isSpritePosMacro) {
      return `; .sprite_pos #${line.block.spriteNum || "0"} x=${line.block.spriteX || "152"} y=${line.block.spriteY || "100"}`;
    }

    if (line.block.isWaitRasterMacro) {
      return `; .wait_raster $${(line.block.rasterLine || "FF").toUpperCase()}`;
    }

    if (line.block.isJoystickMacro) {
      return `; .joystick port=${line.block.joyPort || "2"} sprite=${line.block.joySpriteNum || "0"}`;
    }

    if (line.block.isSpriteColMacro) {
      return `; .sprite_col #${line.block.spriteNum || "0"} ${line.block.colType || "sprite"}`;
    }

    const suffix = line.block.operand ? ` ${getAsmDisplayOperand(line.block)}` : "";
    const comment = line.block.validationError ? ` ; ${t("warningLabel")}: ${line.block.validationError}` : "";
    return `    ${line.block.mnemonic}${suffix}${comment}`;
  });

  deferredDataSections.sort((left, right) => left.address - right.address);

  // Build block → line-number index for ASM selection (2 header lines: "*= ..." + empty)
  asmBlockRanges = {};
  let textLineNum = 2; // skip header "*= ..." (line 0) + empty (line 1)
  codeLines.forEach((codeLine, i) => {
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
    `*= ${layout.origin.text}`,
    "",
    ...codeLines,
    ...(deferredDataSections.length
      ? ["", `; ${t("remoteMemoryData")}`, "", ...deferredDataSections.map((section) => section.text)]
      : [])
  ].join("\n");

  if (asmOutputBase === "dec") {
    asmText = asmText.replace(/\$([0-9A-Fa-f]+)/g, (_, hex) => String(parseInt(hex, 16)));
  }

  asmOutput.textContent = asmText;

  if (selectedBlockId && asmBlockRanges[selectedBlockId]) {
    applyAsmHighlight(selectedBlockId);
  }

  renderMonitorOutput(layout);
}

function renderMonitorOutput(layout = getProgramLayout()) {
  if (!program.length) {
    monitorOutput.textContent = `>${formatAddress(layout.origin.value)}`;
    return;
  }

  // Build a flat memory map: address → byte
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

  for (const line of layout.lines) {
    if (line.block.isLabel || line.block.isComment) continue;
    const compiled = compileLineBytes(line, labels);
    if (!compiled.ok) continue;
    compiled.bytes.forEach((byte, i) => memMap.set(line.address + i, byte));
  }

  deferredSections.forEach((section) => {
    section.bytes.forEach((byte, i) => memMap.set(section.address + i, byte));
  });

  if (!memMap.size) {
    monitorOutput.textContent = `>${formatAddress(layout.origin.value)}`;
    return;
  }

  // Group non-contiguous regions into segments to avoid huge gaps of ".."
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
        if (b === 0x00) return "@";
        if (b >= 0x01 && b <= 0x1A) return String.fromCharCode(0x40 + b); // A-Z screen codes
        if (b === 0x1B) return "[";
        if (b === 0x1D) return "]";
        return ".";
      }).join("");
      rows.push(`>${formatAddress(addr)}  ${hexPart}  |${charPart}|`);
    }
  });

  monitorOutput.textContent = rows.join("\n");
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
  originInput.value = sampleData.origin || "0801";
  program = collapseLoadedProgram(sampleData.program);
  await reloadIncludeBlocks();

  renderOriginPreview();
  renderEmulatorRunHint();
  parseUserMacros();  // Parse any user-defined macros in the loaded sample
  renderProgram();
  saveUiSettings();

  // Clear current file display when loading a sample
  if (currentFileDisplay) {
    currentFileDisplay.textContent = "";
  }
  updateWindowTitle(null);

  return true;
}

async function loadSampleProgram() {
  await loadSampleFromFile("basic-colors");
}

async function loadLabelSampleProgram() {
  await loadSampleFromFile("label-border");
}

async function loadTextSampleProgram() {
  await loadSampleFromFile("text-demo");
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
      }
    }
  }
}

async function loadIncludeDemo() {
  const ok = await loadSampleFromFile("include-demo");
  if (!ok) return;

  // Auto-load the library file from the samples folder
  if (window.electronAPI?.reloadIncludeFile) {
    const incIdx = program.findIndex(b => b.isIncludeMacro);
    if (incIdx >= 0) {
      // Build path to the sample library
      const sampleResult = await window.electronAPI.loadSample("include-library");
      if (sampleResult?.ok && sampleResult.sample?.program) {
        program[incIdx].includedBlocks = sampleResult.sample.program;
        program[incIdx].includeFileName = "include-library";
        program[incIdx].validationError = "";
        renderProgram();
        renderAsmOutput();
      }
    }
  }
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

  if (sampleSelect.value === "raster-irq-demo") {
    loadRasterIrqDemo();
    return;
  }

  loadSampleProgram();
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


renderOriginPreview();
renderEmulatorRunHint();
renderMemoryStrip();
renderProgram();

