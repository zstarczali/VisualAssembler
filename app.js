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
  }
};

const mnemonicLibrary = {
  Adatmozgas: [
    { mnemonic: "LDA", description: "Akkumulator betoltese memoriabol vagy konstansbol.", modes: ["immediate", "zeroPage", "absolute", "absoluteX"] },
    { mnemonic: "LDX", description: "X regiszter betoltese.", modes: ["immediate", "zeroPage", "absolute"] },
    { mnemonic: "LDY", description: "Y regiszter betoltese.", modes: ["immediate", "zeroPage", "absolute", "absoluteX"] },
    { mnemonic: "STA", description: "Akkumulator kiirasa memoriacimre.", modes: ["zeroPage", "absolute", "absoluteX"] },
    { mnemonic: "STX", description: "X regiszter tarolasa.", modes: ["zeroPage", "absolute"] },
    { mnemonic: "STY", description: "Y regiszter tarolasa.", modes: ["zeroPage", "absolute"] }
  ],
  Aritmetika: [
    { mnemonic: "ADC", description: "Osszeadas carry figyelembevetele mellett.", modes: ["immediate", "zeroPage", "absolute"] },
    { mnemonic: "SBC", description: "Kivonas carry figyelembevetele mellett.", modes: ["immediate", "zeroPage", "absolute"] },
    { mnemonic: "INC", description: "Memoriacim noveles.", modes: ["zeroPage", "absolute"] },
    { mnemonic: "DEC", description: "Memoriacim csokkentes.", modes: ["zeroPage", "absolute"] },
    { mnemonic: "CMP", description: "Osszehasonlitas az akkumulatorral.", modes: ["immediate", "zeroPage", "absolute"] },
    { mnemonic: "CPX", description: "Osszehasonlitas az X regiszterrel.", modes: ["immediate", "zeroPage", "absolute"] },
    { mnemonic: "CPY", description: "Osszehasonlitas az Y regiszterrel.", modes: ["immediate", "zeroPage", "absolute"] }
  ],
  Logika: [
    { mnemonic: "AND", description: "Logikai ES muvelet az akkumulatorral.", modes: ["immediate", "zeroPage", "absolute"] },
    { mnemonic: "ORA", description: "Logikai VAGY muvelet az akkumulatorral.", modes: ["immediate", "zeroPage", "absolute"] },
    { mnemonic: "EOR", description: "Exkluziv VAGY muvelet az akkumulatorral.", modes: ["immediate", "zeroPage", "absolute"] },
    { mnemonic: "BIT", description: "Bitek tesztelese memoriacimrol.", modes: ["zeroPage", "absolute"] }
  ],
  Ugrasok: [
    { mnemonic: "JMP", description: "Feltetel nelkuli ugras egy cimre.", modes: ["absolute"] },
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
    { mnemonic: "STRING", description: "Karakterlanc kiirasa egy megadott memoriacimre.", modes: ["implied"], isStringMacro: true }
  ],
  Szerkezet: [
    { mnemonic: "LABEL", description: "Nevvel ellatott cimke a kodban, ugrasi celhoz.", modes: ["implied"], isLabel: true },
    { mnemonic: "COMMENT", description: "Megjegyzes a programhoz, ami nem general byte-ot.", modes: ["implied"], isComment: true }
  ]
};

const categorySelect = document.getElementById("category-select");
const mnemonicSelect = document.getElementById("mnemonic-select");
const operandInput = document.getElementById("operand-input");
const addressingSelect = document.getElementById("addressing-select");
const baseInputs = [...document.querySelectorAll('input[name="number-base"]')];
const themeToggleButton = document.getElementById("theme-toggle");
const languageSelect = document.getElementById("language-select");
const loadSampleButton = document.getElementById("load-sample");
const sampleSelect = document.getElementById("sample-select");
const saveProjectButton = document.getElementById("save-project");
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
const checkUpdateButton = document.getElementById("check-update-btn");
const basicSysToggle = document.getElementById("basic-sys-toggle");
const aboutDialog = document.getElementById("about-dialog");
const aboutCloseButton = document.getElementById("about-close");
const exitAppButton = document.getElementById("exit-app");

let program = [];
let dragState = null;
const defaultOrigin = 0x0801;
let blockScale = 0.9;
let currentLanguage = "hu";
let vicePath = "";
let savedUiSettings = {};

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
    loadProject: "Program betoltese",
    exitApp: "Kilepes",
    themeToggle: "Tema valtasa",
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
    outputAsm: "ASM",
    outputMonitor: "Monitor",
    outputBoth: "Mindketto",
    originLabel: "Kezdocim (`*=`)",
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
    languageLabel: "Nyelv",
    checkForUpdate: "Frissites keresese",
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
    warningLabel: "FIGYELEM",
    remoteMemoryData: "Tavoli memoria-adatok",
    dataBelow: "adat lent",
    textDataBelow: "TEXT adat lent",
    stringDataBelow: "STRING adat lent",
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
    loadProject: "Load program",
    exitApp: "Exit",
    themeToggle: "Toggle theme",
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
    outputAsm: "ASM",
    outputMonitor: "Monitor",
    outputBoth: "Both",
    originLabel: "Start address (`*=`)",
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
    languageLabel: "Language",
    checkForUpdate: "Check for Update",
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
    warningLabel: "WARNING",
    remoteMemoryData: "Remote memory data",
    dataBelow: "data below",
    textDataBelow: "TEXT data below",
    stringDataBelow: "STRING data below",
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
    basicSys: basicSysToggle ? basicSysToggle.checked : true
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
  STRING: "Write a string to a given memory address.",
  LABEL: "Named label in code for jump targets.",
  COMMENT: "Program comment that does not generate bytes."
};

function modeText(modeKey, field) {
  return addressingModeText[modeKey]?.[currentLanguage]?.[field] ?? addressingModes[modeKey]?.[field] ?? "";
}

function getItemDescription(item) {
  return currentLanguage === "en"
    ? mnemonicDescriptionsEn[item.mnemonic] || item.description
    : item.description;
}

const opcodeMap = {
  LDA: { immediate: 0xA9, zeroPage: 0xA5, absolute: 0xAD, absoluteX: 0xBD },
  LDX: { immediate: 0xA2, zeroPage: 0xA6, absolute: 0xAE },
  LDY: { immediate: 0xA0, zeroPage: 0xA4, absolute: 0xAC, absoluteX: 0xBC },
  STA: { zeroPage: 0x85, absolute: 0x8D, absoluteX: 0x9D },
  STX: { zeroPage: 0x86, absolute: 0x8E },
  STY: { zeroPage: 0x84, absolute: 0x8C },
  ADC: { immediate: 0x69, zeroPage: 0x65, absolute: 0x6D, absoluteX: 0x7D },
  SBC: { immediate: 0xE9, zeroPage: 0xE5, absolute: 0xED, absoluteX: 0xFD },
  INC: { zeroPage: 0xE6, absolute: 0xEE, absoluteX: 0xFE },
  DEC: { zeroPage: 0xC6, absolute: 0xCE, absoluteX: 0xDE },
  CMP: { immediate: 0xC9, zeroPage: 0xC5, absolute: 0xCD, absoluteX: 0xDD },
  CPX: { immediate: 0xE0, zeroPage: 0xE4, absolute: 0xEC },
  CPY: { immediate: 0xC0, zeroPage: 0xC4, absolute: 0xCC },
  AND: { immediate: 0x29, zeroPage: 0x25, absolute: 0x2D, absoluteX: 0x3D },
  ORA: { immediate: 0x09, zeroPage: 0x05, absolute: 0x0D, absoluteX: 0x1D },
  EOR: { immediate: 0x49, zeroPage: 0x45, absolute: 0x4D, absoluteX: 0x5D },
  BIT: { zeroPage: 0x24, absolute: 0x2C },
  JMP: { absolute: 0x4C },
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
  BRK: { implied: 0x00 }
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
  languageSelect.addEventListener("change", handleLanguageChange);
  aboutButton?.addEventListener("click", async () => {
    const version = await window.electronAPI.getAppVersion();
    document.getElementById("about-version").textContent = `v${version}`;
    aboutDialog?.showModal();
  });
  checkUpdateButton?.addEventListener("click", () => {
    window.electronAPI.openExternal("https://zstarczali.itch.io/visual-assembler-commodore-64");
  });
  basicSysToggle?.addEventListener("change", () => {
    saveUiSettings();
    renderEmulatorRunHint();
    renderOriginPreview();
  });
  aboutCloseButton?.addEventListener("click", () => aboutDialog?.close());
  exitAppButton?.addEventListener("click", () => window.electronAPI.quitApp());
  setupOperandDropdown();
  sampleSelect?.addEventListener("change", saveUiSettings);
  loadSampleButton.addEventListener("click", loadSelectedSample);
  saveProjectButton?.addEventListener("click", saveProjectToFile);
  loadProjectButton?.addEventListener("click", loadProjectFromFile);
  zoomOutButton.addEventListener("click", () => adjustZoom(-0.08));
  zoomInButton.addEventListener("click", () => adjustZoom(0.08));
  outputModeInputs.forEach((input) => input.addEventListener("change", renderOutputMode));
  addSelectedButton.addEventListener("click", addSelectedBlock);
  clearProgramButton.addEventListener("click", clearProgram);
  collapseAllButton.addEventListener("click", collapseAllBlocks);
  expandAllButton.addEventListener("click", expandAllBlocks);
  copyAsmButton?.addEventListener("click", copyAsmToClipboard);
  chooseViceButton?.addEventListener("click", chooseViceExecutable);
  runEmulatorButton?.addEventListener("click", runInEmulator);
  originInput.addEventListener("input", handleOriginInput);
  globalMemoryPanel?.addEventListener("toggle", saveUiSettings);

  applySavedTheme();
  applySavedLanguage();
  applySavedUiSettings();
  applyTranslations();
  applyZoom();
  updateEmulatorStatus();
  setupProgramDropZone();
  syncMnemonicMenu();
  renderOutputMode();
  renderMemoryStrip();
  loadViceConfig();
  saveUiSettings();
}

function applySavedLanguage() {
  const savedLanguage = localStorage.getItem("c64-block-language") || "hu";
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
    setText(".output-panel .panel-heading p", t("asmHelp"));
    setText(".global-memory-panel .panel-heading h2", t("memoryTitle"));
    setText(".global-memory-panel .panel-heading p", t("memoryHelp"));

  const menuLabels = document.querySelectorAll(".control-menu-label");
    if (menuLabels[0]) menuLabels[0].textContent = t("menuFile");
    if (menuLabels[1]) menuLabels[1].textContent = t("menuExamples");
    if (menuLabels[2]) menuLabels[2].textContent = t("menuSettings");
    if (menuLabels[3]) menuLabels[3].textContent = t("menuView");
    if (menuLabels[4]) menuLabels[4].textContent = t("menuProgram");
  if (checkUpdateButton) checkUpdateButton.textContent = t("checkForUpdate");
  const basicSysLabelEl = document.getElementById("basic-sys-label");
  if (basicSysLabelEl) basicSysLabelEl.textContent = t("basicSysLabel");

  document.querySelector('label[for="category-select"]');
  setText(".palette-panel .field:nth-of-type(1) span", t("fieldCategory"));
  setText(".palette-panel .field:nth-of-type(2) span", t("fieldMnemonic"));
    setText(".palette-panel .field:nth-of-type(3) span", t("fieldOperand"));
    setText(".base-switch legend", t("numberBase"));
    setText(".palette-panel .field:nth-of-type(4) span", t("addressingMode"));
    setText("#add-selected", t("addSelected"));
    setText('.view-mode-option input[value="asm"] + span', t("outputAsm"));
    setText('.view-mode-option input[value="monitor"] + span', t("outputMonitor"));
    setText('.view-mode-option input[value="both"] + span', t("outputBoth"));
    setText('.origin-row .field span', t("originLabel"));
    setText(".global-memory-title", t("memoryTitle"));
    setText(".menu-field span", t("viceExecutable"));
    setText("#choose-vice", t("openEmulator"));
    setText("#run-emulator .run-label", t("runInEmulator"));
    setText("#copy-asm", t("copyAsm"));
    setText("#save-project", t("saveProject"));
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
    el.addEventListener("mousedown", e => {
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

  // Hide addressing mode selector for COMMENT
  if (addressingField) addressingField.hidden = !!(item?.isComment);

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
  const needsCommentOperand = item?.isComment;
  operandInput.disabled = !(mode.needsOperand || needsTextOperand || needsByteOperand || needsStringOperand || needsCommentOperand);
  operandInput.placeholder = needsTextOperand
    ? (currentLanguage === "en" ? "For example HELLO C64" : "Peldaul HELLO C64")
    : needsByteOperand
      ? (currentLanguage === "en" ? "For example 169,0,141,32,208" : "Peldaul 169,0,141,32,208")
      : needsStringOperand
        ? (currentLanguage === "en" ? "For example HELLO" : "Peldaul HELLO")
        : needsCommentOperand
          ? (currentLanguage === "en" ? "For example border scroll demo" : "Peldaul border scroll demo")
          : getOperandPlaceholder(mode, getSelectedBase());

  if (!mode.needsOperand && !needsTextOperand && !needsByteOperand && !needsStringOperand && !needsCommentOperand) {
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
  const category = categorySelect.value;
  const items = mnemonicLibrary[category];
  const selectedBase = getSelectedBase();
  const selectedMode = addressingSelect.value;
  paletteList.innerHTML = "";

  items.forEach((item) => {
    const defaultMode = item.modes.includes(selectedMode) ? selectedMode : item.modes[0];
    const preview = item.isTextMacro || item.isStringMacro
      ? formatTextMacroPreview(operandInput.value.trim())
      : item.isByteMacro
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
          : item.isComment
            ? `${currentLanguage === "en" ? "Comment" : "Komment"} | ; ${operandInput.value.trim() || (currentLanguage === "en" ? "new comment" : "uj komment")}`
            : `${modeText(defaultMode, "label")} | ${preview.text}`;

    node.addEventListener("click", () => {
      mnemonicSelect.value = item.mnemonic;
      syncAddressingModes();
    });

    node.addEventListener("dragstart", (event) => {
      mnemonicSelect.value = item.mnemonic;
      syncAddressingModes();

      if (item.modes.includes(selectedMode)) {
        addressingSelect.value = selectedMode;
        updateOperandField();
      }

      renderMnemonicDescription();

      dragState = {
        type: "palette",
        block: createBlockFromMnemonic(item)
      };

      event.dataTransfer.effectAllowed = "copy";
      event.dataTransfer.setData("text/plain", item.mnemonic);
      node.classList.add("dragging");
    });

    node.addEventListener("dragend", () => {
      dragState = null;
      node.classList.remove("dragging");
      clearDropIndicators();
    });

    paletteList.appendChild(node);
  });
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
      base: "bytes",
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
  return blocks.map((block) => ({
    ...block,
    collapsed: true
  }));
}

function addSelectedBlock() {
  const selected = getSelectedMnemonic();
  insertBlock(program.length, createBlockFromMnemonic(selected));
}

function clearProgram() {
  program = [];
  renderProgram();
}

function insertBlock(index, block) {
  program.splice(index, 0, block);
  operandInput.value = "";
  renderMnemonicDescription();
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
  renderProgram();
}

function collapseAllBlocks() {
  program.forEach((block) => {
    block.collapsed = true;
  });
  renderProgram();
}

function expandAllBlocks() {
  program.forEach((block) => {
    block.collapsed = false;
  });
  renderProgram();
}

function updateProgramBlock(index, field, value) {
  const block = program[index];
  block[field] = value;

  if (field === "labelName") {
    block.labelName = sanitizeLabelName(value);
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
      block.operand = block.rawOperand.trim();
      block.validationError = validateByteMacro(block.rawOperand);
    } else if (block.isStringMacro) {
      block.operand = block.rawOperand.trim();
      block.validationError = validateStringMacroAddress(block.stringAddress);
    } else {
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

  if (field === "rawOperand") {
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  renderProgram();
}

function deleteBlock(index) {
  program.splice(index, 1);
  renderProgram();
}

function setupProgramDropZone() {
  programList.addEventListener("dragover", (event) => {
    if (!dragState) {
      return;
    }

    event.preventDefault();
    const dropIndex = getDropIndex(event.clientY);
    highlightDropTarget(dropIndex);
    event.dataTransfer.dropEffect = dragState.type === "palette" ? "copy" : "move";
  });

  programList.addEventListener("dragleave", (event) => {
    if (event.target === programList) {
      clearDropIndicators();
    }
  });

  programList.addEventListener("drop", (event) => {
    if (!dragState) {
      return;
    }

    event.preventDefault();
    const dropIndex = getDropIndex(event.clientY);
    clearDropIndicators();

    if (dragState.type === "palette") {
      insertBlock(dropIndex, { ...dragState.block, id: crypto.randomUUID() });
    } else if (dragState.type === "program") {
      reorderBlock(dragState.index, dropIndex);
    }

    dragState = null;
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

  if (dropIndex >= blocks.length) {
    blocks[blocks.length - 1].classList.add("drop-after");
    return;
  }

  blocks[dropIndex].classList.add("drop-before");
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
  renderProgram();
}

function startProgramBlockDrag(event, node, index, mnemonic) {
  dragState = { type: "program", index };
  node.classList.add("dragging");
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", mnemonic);
  }
}

function buildOperandPreview(modeKey, rawValue, base) {
  const mode = addressingModes[modeKey];
  const value = rawValue.trim();

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

function formatByteMacroPreview(value) {
  const raw = value || "169,0,141,32,208";
  const error = validateByteMacro(raw);
  const bytes = error ? [] : parseByteMacro(raw);
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

function parseByteMacro(raw) {
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
      return Number.parseInt(part, 10);
    });
}

function validateByteMacro(raw) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return currentLanguage === "en" ? "BYTE macro needs at least one byte." : "A BYTE makrohoz legalabb egy byte kell.";
  }

  const parts = trimmed.split(",").map((part) => part.trim()).filter(Boolean);
  if (!parts.length) {
    return currentLanguage === "en" ? "BYTE macro needs at least one byte." : "A BYTE makrohoz legalabb egy byte kell.";
  }

  for (const part of parts) {
    const valid = /^\$[0-9A-Fa-f]+$/.test(part) || /^0x[0-9A-Fa-f]+$/i.test(part) || /^\d+$/.test(part);
    if (!valid) {
      return currentLanguage === "en" ? "BYTE macro only accepts decimal or hex bytes separated by commas." : "A BYTE makroban csak decimalis vagy hex byte-ok lehetnek, vesszovel elvalasztva.";
    }

    const value = /^\d+$/.test(part)
      ? Number.parseInt(part, 10)
      : Number.parseInt(part.replace(/^\$/, "").replace(/^0x/i, ""), 16);

    if (value < 0 || value > 255) {
      return currentLanguage === "en" ? "Every BYTE macro element must be a byte between 0 and 255." : "A BYTE makro minden eleme 0 es 255 kozotti byte kell legyen.";
    }
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

  if (/^\d+$/.test(trimmed)) {
    return Number.parseInt(trimmed, 10);
  }

  if (/^[0-9A-Fa-f]{1,4}$/.test(trimmed)) {
    return Number.parseInt(trimmed, 16);
  }

  return null;
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

function encodeTextMacro(text) {
  return [...(text || "HELLO C64")].map((char) => toPetsciiCharCode(char));
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

  if (modeKey === "immediate" || modeKey === "zeroPage") {
    return value < 0 || value > 255 ? (currentLanguage === "en" ? "This mode expects a value between 0 and 255." : "Ez a mod 0 es 255 kozotti erteket var.") : "";
  }

  if (modeKey === "absolute") {
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
    vicePathInput.value = vicePath;
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
    program,
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

  if (originInput) {
    originInput.value = projectData.origin || "0801";
  }

  if (projectData.ui?.sample && sampleSelect) {
    sampleSelect.value = projectData.ui.sample;
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
  renderProgram();
  saveUiSettings();

  if (emulatorStatus) {
    emulatorStatus.textContent = `${t("projectLoaded")}: ${result.filePath}`;
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

async function runInEmulator() {
  const prg = buildAutostartPrgForEmulator();
  if (!prg.ok) {
    if (emulatorStatus) {
      emulatorStatus.textContent = prg.error;
    }
    return;
  }

  if (!window.electronAPI?.launchVice) {
    if (emulatorStatus) {
      emulatorStatus.textContent = currentLanguage === "en"
        ? "VICE launch is only available in the Electron app."
        : "A VICE inditasa csak az Electron appban erheto el.";
    }
    return;
  }

  const result = await window.electronAPI.launchVice({
    bytes: Array.from(prg.bytes),
    fileName: `c64-visual-assembler-${Date.now()}.prg`
  });

  if (!result?.ok) {
    if (emulatorStatus) {
      emulatorStatus.textContent = result?.error || (currentLanguage === "en" ? "Launching VICE failed." : "A VICE inditasa sikertelen.");
    }
    return;
  }

  updateVicePathPreview(result.vicePath || vicePath);
  if (emulatorStatus) {
    emulatorStatus.textContent = currentLanguage === "en"
      ? `VICE started with ${result.filePath}`
      : `A VICE elindult ezzel: ${result.filePath}`;
  }
}

function buildAutostartPrgForEmulator() {
  const useBasicSys = basicSysToggle ? basicSysToggle.checked : true;

  if (!useBasicSys) {
    return assembleProgramToPrg();
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
    if (line.block.isLabel) {
      labels.set(line.block.labelName, line.address);
    }
  });

  const bytes = [layout.origin.value & 0xFF, (layout.origin.value >> 8) & 0xFF];

  for (const line of layout.lines) {
    if (line.block.isLabel || line.block.isComment) {
      continue;
    }
    const compiled = compileLineBytes(line, labels);
    if (!compiled.ok) {
      return { ok: false, error: compiled.error };
    }
    bytes.push(...compiled.bytes);
  }

  return { ok: true, bytes: new Uint8Array(bytes) };
}

function compileLineBytes(line, labels) {
  const block = line.block;

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
    const bytes = parseByteMacro(block.rawOperand);
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

  if (block.addressingMode === "immediate" || block.addressingMode === "zeroPage") {
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

  const parsed = parseNumberByBase(block.rawOperand.replace(/^#/, "").replace(/^\$/, ""), block.base);
  if (parsed === null) {
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

  const parsed = parseNumberByBase(raw, getSelectedBase()) ?? parseNumberByBase(raw, "hex");
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
  const effectiveNote = useBasicSys && !origin.error
    ? `<small>${currentLanguage === "en" ? "Code placed at $080D (after BASIC stub)" : "Kód elhelyezése: $080D (BASIC stub után)"}</small>`
    : (origin.error ? `<small class="error-text">${origin.error}</small>` : `<small>${origin.value} dec | ${origin.text} hex</small>`);
  originPreview.innerHTML = `<strong>*= ${origin.text}</strong> ${effectiveNote}`;
}

function renderEmulatorRunHint() {
  if (!emulatorRunHint) {
    return;
  }

  const useBasicSys = basicSysToggle ? basicSysToggle.checked : true;
  const origin = parseOriginValue();

  if (!useBasicSys) {
    emulatorRunHint.innerHTML = currentLanguage === "en"
      ? `<strong>Run hint:</strong> BASIC SYS stub disabled — load and run manually via ML monitor.`
      : `<strong>Futtatas tipp:</strong> BASIC SYS stub kikapcsolva — ML monitorból toltsd be es inditsd el.`;
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
    return parseByteMacro(block.rawOperand).length;
  }

  if (block.isStringMacro) {
    return encodeTextMacro(block.rawOperand).length * 5;
  }

  if (block.addressingMode === "implied") {
    return 1;
  }

  if (block.addressingMode === "immediate" || block.addressingMode === "zeroPage" || block.addressingMode === "relative") {
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

  const lines = program.map((block) => {
    const size = getInstructionSize(block);
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

  return block.validationError || (currentLanguage === "en" ? mnemonicDescriptionsEn[block.mnemonic] || block.description : block.description);
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

  if (block.isLabel) {
    return `${getCategoryLabel(block.category)} | label`;
  }

  return `${getCategoryLabel(block.category)} | ${modeText(block.addressingMode, "label")}`;
}

function renderBlockPreview(index) {
  const block = program[index];
  const node = programList.querySelector(`.asm-block[data-index="${index}"]`);

  if (!block || !node) {
    return;
  }

  node.querySelector(".block-category").textContent = getBlockModeCaption(block);
  node.querySelector(".block-description").textContent = getBlockDescription(block);
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

  return block.operand || block.rawOperand || "";
}

function renderProgram() {
  if (!program.length) {
    programList.innerHTML = `<div class="empty-state">${t("emptyState")}</div>`;
    renderAsmOutput();
    renderMemoryMap();
    return;
  }

  programList.innerHTML = "";

    program.forEach((block, index) => {
      const node = blockTemplate.content.firstElementChild.cloneNode(true);
      node.dataset.index = index;
      node.dataset.categoryTone = getCategoryTone(block.category);
      node.dataset.collapsed = block.collapsed ? "true" : "false";
      node.draggable = true;

      node.querySelector(".block-mnemonic").textContent = block.mnemonic;
      node.querySelector(".collapsed-operand").textContent = getCollapsedOperandText(block);
      node.querySelector(".block-category").textContent = getBlockModeCaption(block);
      node.querySelector(".block-description").textContent = getBlockDescription(block);

      const mode = addressingModes[block.addressingMode];
      const blockControls = node.querySelector(".block-controls");
      const inlineField = node.querySelector(".inline-field");
      const operandField = node.querySelector(".block-operand");
      const collapseToggle = node.querySelector(".collapse-toggle");
      const dragHandle = node.querySelector(".drag-handle");
      collapseToggle.textContent = block.collapsed ? "\u25B8" : "\u25BE";
      collapseToggle.setAttribute("aria-label", block.collapsed ? t("expand") : t("collapse"));
      collapseToggle.setAttribute("title", block.collapsed ? t("expand") : t("collapse"));
      dragHandle.setAttribute("title", t("dragBlock"));
      collapseToggle.addEventListener("click", () => toggleBlockCollapsed(index));

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
      operandField.placeholder = currentLanguage === "en" ? "For example 169,0,141,32,208" : "Peldaul 169,0,141,32,208";
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
              <input class="macro-address" type="text" value="${block.stringAddress || "C000"}" placeholder="$C000">
            </label>
          </div>
        `
      );
    } else {
      inlineField.querySelector("span").textContent = t("fieldOperand");
      inlineField.hidden = !mode.needsOperand;
      operandField.value = block.rawOperand || "";
      operandField.disabled = !mode.needsOperand;
      operandField.placeholder = getOperandPlaceholder(mode, block.base);
      operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
    }

    blockControls.insertAdjacentHTML(
      "beforeend",
      `
          ${mode.needsOperand && !block.isLabel && !block.isComment && !block.isTextMacro && !block.isByteMacro && !block.isStringMacro ? `
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
          <label class="mini-field"${block.isLabel || block.isComment || block.isTextMacro || block.isByteMacro || block.isStringMacro ? ` hidden` : ""}>
            <span>${t("addressingMode")}</span>
          <select class="block-mode">
            ${getMnemonicModes(block.mnemonic).map((modeKey) => `<option value="${modeKey}"${block.addressingMode === modeKey ? " selected" : ""}>${modeText(modeKey, "label")}</option>`).join("")}
          </select>
        </label>
      `
    );

    node.querySelectorAll(".block-base").forEach((baseInput) => {
      baseInput.addEventListener("change", (event) => updateProgramBlock(index, "base", event.target.value));
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
      macroAddressInput.addEventListener("input", (event) => updateProgramBlock(index, "stringAddress", event.target.value));
    }
      const blockModeSelect = node.querySelector(".block-mode");
      if (blockModeSelect) {
        blockModeSelect.addEventListener("change", (event) => updateProgramBlock(index, "addressingMode", event.target.value));
      }

      if (block.collapsed) {
        blockControls.hidden = true;
        node.querySelector(".block-description").hidden = true;
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
      dragHandle.draggable = true;
      dragHandle.addEventListener("dragstart", (event) => {
        startProgramBlockDrag(event, node, index, block.mnemonic);
      });
    }

    node.addEventListener("dragstart", (event) => {
      if (event.target !== node && !event.target.closest(".drag-handle")) {
        event.preventDefault();
        return;
      }
      startProgramBlockDrag(event, node, index, block.mnemonic);
    });

    node.addEventListener("dragover", (event) => {
      if (!dragState) {
        return;
      }

      event.preventDefault();
      const dropIndex = getDropIndex(event.clientY);
      highlightDropTarget(dropIndex);
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = dragState.type === "palette" ? "copy" : "move";
      }
    });

    node.addEventListener("drop", (event) => {
      if (!dragState) {
        return;
      }

      event.preventDefault();
      const dropIndex = getDropIndex(event.clientY);
      clearDropIndicators();

      if (dragState.type === "palette") {
        insertBlock(dropIndex, { ...dragState.block, id: crypto.randomUUID() });
      } else if (dragState.type === "program") {
        reorderBlock(dragState.index, dropIndex);
      }

      dragState = null;
    });

    node.addEventListener("dragend", () => {
      node.classList.remove("dragging");
      clearDropIndicators();
      dragState = null;
    });

    programList.appendChild(node);
  });

  renderAsmOutput();
  renderMemoryMap();
}

function getMnemonicModes(mnemonic) {
  const items = Object.values(mnemonicLibrary).flat();
  return items.find((item) => item.mnemonic === mnemonic)?.modes || ["implied"];
}

function renderAsmOutput() {
  const layout = getProgramLayout();

  if (!program.length) {
    asmOutput.textContent = `*= ${layout.origin.text}\n; ${currentLanguage === "en" ? "The C64 assembly source will appear here" : "Itt fog megjelenni a C64 assembly kod"}`;
    return;
  }

  const deferredDataSections = [];
  const codeLines = layout.lines.map((line, index) => {
    const lineNumber = `${(index + 1).toString().padStart(2, "0")}`;

    if (line.block.isLabel) {
      return `${line.block.labelName}:`;
    }

    if (line.block.isComment) {
      return `; ${line.block.rawOperand || ""}`;
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
        text: `text_${lineNumber}:\n    ; TEXT "${line.block.rawOperand || ""}" -> screen (${line.block.textX ?? 0}, ${line.block.textY ?? 0})\n    ; ${formatAddress(startAddress)}\n${expanded}`
      });
      return `    ; ${currentLanguage === "en" ? "TEXT data below" : "TEXT data lent"}: text_${lineNumber}`;
    }

    if (line.block.isByteMacro) {
      return `    .byte ${line.block.rawOperand}`;
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
        text: `string_${lineNumber}:\n    ; STRING "${line.block.rawOperand || ""}" -> ${formatAddress(startAddress)}\n    ; ${formatAddress(startAddress)}\n${expanded}`
      });
      return `    ; ${currentLanguage === "en" ? "STRING data below" : "STRING data lent"}: string_${lineNumber}`;
    }

    const suffix = line.block.operand ? ` ${line.block.operand}` : "";
    const comment = line.block.validationError ? ` ; ${t("warningLabel")}: ${line.block.validationError}` : "";
    return `    ${line.block.mnemonic}${suffix}${comment}`;
  });

  deferredDataSections.sort((left, right) => left.address - right.address);

  asmOutput.textContent = [
    `*= ${layout.origin.text}`,
    "",
    ...codeLines,
    ...(deferredDataSections.length
      ? ["", `; ${t("remoteMemoryData")}`, "", ...deferredDataSections.map((section) => section.text)]
      : [])
  ].join("\n");

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

  // Find address range
  const allAddresses = [...memMap.keys()].sort((a, b) => a - b);
  const startAddr = allAddresses[0] & ~0xF; // align to 16-byte boundary
  const endAddr = allAddresses[allAddresses.length - 1];

  const rows = [];
  for (let addr = startAddr; addr <= endAddr; addr += 16) {
    const bytes = [];
    for (let i = 0; i < 16; i++) {
      const b = memMap.get(addr + i);
      bytes.push(b !== undefined ? b.toString(16).toUpperCase().padStart(2, "0") : "..");
    }
    rows.push(`>${formatAddress(addr)}  ${bytes.join(" ")}`);
  }

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

function loadSampleProgram() {
  originInput.value = "0801";
  program = collapseLoadedProgram([
    {
      id: crypto.randomUUID(),
      category: "Rendszer",
      mnemonic: "SEI",
      operand: "",
      rawOperand: "",
      description: "IRQ megszakitasok tiltasa.",
      addressingMode: "implied",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "LDA",
      operand: "#$00",
      rawOperand: "00",
      description: "Akkumulator betoltese memoriabol vagy konstansbol.",
      addressingMode: "immediate",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "STA",
      operand: "$D020",
      rawOperand: "D020",
      description: "Akkumulator kiirasa memoriacimre.",
      addressingMode: "absolute",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "STA",
      operand: "$D021",
      rawOperand: "D021",
      description: "Akkumulator kiirasa memoriacimre.",
      addressingMode: "absolute",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Ugrasok",
      mnemonic: "RTS",
      operand: "",
      rawOperand: "",
      description: "Visszateres szubrutinbol.",
      addressingMode: "implied",
      base: "hex",
      validationError: ""
    }
  ]);
  renderOriginPreview();
  renderEmulatorRunHint();
  renderProgram();
  saveUiSettings();
}

function loadLabelSampleProgram() {
  originInput.value = "0801";
  program = collapseLoadedProgram([
    {
      id: crypto.randomUUID(),
      category: "Szerkezet",
      mnemonic: "LABEL",
      operand: "",
      rawOperand: "",
      description: "Nevvel ellatott cimke a kodban, ugrasi celhoz.",
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      isLabel: true,
      labelName: "loop"
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "LDA",
      operand: "$D020",
      rawOperand: "D020",
      description: "Akkumulator betoltese memoriabol vagy konstansbol.",
      addressingMode: "absolute",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Rendszer",
      mnemonic: "CLC",
      operand: "",
      rawOperand: "",
      description: "Carry flag torlese.",
      addressingMode: "implied",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Aritmetika",
      mnemonic: "ADC",
      operand: "#$01",
      rawOperand: "01",
      description: "Osszeadas carry figyelembevetele mellett.",
      addressingMode: "immediate",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "STA",
      operand: "$D020",
      rawOperand: "D020",
      description: "Akkumulator kiirasa memoriacimre.",
      addressingMode: "absolute",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Ugrasok",
      mnemonic: "JMP",
      operand: "loop",
      rawOperand: "loop",
      description: "Feltetel nelkuli ugras egy cimre.",
      addressingMode: "absolute",
      base: "hex",
      validationError: ""
    }
  ]);
  renderOriginPreview();
  renderEmulatorRunHint();
  renderProgram();
  saveUiSettings();
}

function loadTextSampleProgram() {
  originInput.value = "0801";
  program = collapseLoadedProgram([
    {
      id: crypto.randomUUID(),
      category: "Rendszer",
      mnemonic: "SEI",
      operand: "",
      rawOperand: "",
      description: "IRQ megszakitasok tiltasa.",
      addressingMode: "implied",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Ugrasok",
      mnemonic: "JSR",
      operand: "$E544",
      rawOperand: "E544",
      description: "Szubrutin meghivasa.",
      addressingMode: "absolute",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Makrok",
      mnemonic: "TEXT",
      operand: "HELLO C64",
      rawOperand: "HELLO C64",
      description: "Szoveg kiirasa a kepernyore KERNAL CHROUT rutinon keresztul.",
      addressingMode: "implied",
      base: "text",
      validationError: "",
      isTextMacro: true,
      textX: 12,
      textY: 8
    },
    {
      id: crypto.randomUUID(),
      category: "Makrok",
      mnemonic: "TEXT",
      operand: "VISUAL ASSEMBLER",
      rawOperand: "VISUAL ASSEMBLER",
      description: "Szoveg kiirasa a kepernyore KERNAL CHROUT rutinon keresztul.",
      addressingMode: "implied",
      base: "text",
      validationError: "",
      isTextMacro: true,
      textX: 8,
      textY: 10
    },
    {
      id: crypto.randomUUID(),
      category: "Ugrasok",
      mnemonic: "RTS",
      operand: "",
      rawOperand: "",
      description: "Visszateres szubrutinbol.",
      addressingMode: "implied",
      base: "hex",
      validationError: ""
    }
  ]);
  renderOriginPreview();
  renderEmulatorRunHint();
  renderProgram();
  saveUiSettings();
}

function loadMacroDemoProgram() {
  // Text scroller demo:
  // $080D: JMP main  (3 bytes)
  // $0810: BYTE message (40 screen-code bytes)  <- LDA $0810,X reads here
  // $0838: main label -> setup + fill + scroll loop
  // Screen row 12 = $05E0 .. $0607 (40 chars)
  // ZP $FE = message offset (0-39)
  originInput.value = "0801";

  const b = (category, mnemonic, operand, rawOperand, addressingMode, extra = {}) => ({
    id: crypto.randomUUID(), category, mnemonic, operand, rawOperand,
    description: "", addressingMode, base: "hex", validationError: "", ...extra
  });
  const lbl = (name) => b("Szerkezet", "LABEL", "", "", "implied", {
    isLabel: true, labelName: name,
    description: "Nevvel ellatott cimke a kodban, ugrasi celhoz."
  });
  const cmt = (text) => ({
    id: crypto.randomUUID(), category: "Szerkezet", mnemonic: "COMMENT",
    operand: text, rawOperand: text,
    description: "Megjegyzes a programhoz, ami nem general byte-ot.",
    addressingMode: "implied", base: "comment", validationError: "", collapsed: false, isComment: true
  });
  const txt = (text, x, y) => ({
    id: crypto.randomUUID(), category: "Makrok", mnemonic: "TEXT",
    operand: text, rawOperand: text,
    description: "Szoveg kiirasa a kepernyore.", addressingMode: "implied",
    base: "text", validationError: "", isTextMacro: true, textX: x, textY: y
  });

  // Message: "C64 SCROLLER DEMO" (17) + 23 spaces = 40 screen-code bytes
  // C=$03 6=$36 4=$34 sp=$20 S=$13 C=$03 R=$12 O=$0F L=$0C L=$0C E=$05 R=$12
  // sp=$20 D=$04 E=$05 M=$0D O=$0F + 23x $20
  const msg = "$03,$36,$34,$20,$13,$03,$12,$0F,$0C,$0C,$05,$12,$20,$04,$05,$0D,$0F" +
              ",$20,$20,$20,$20,$20,$20,$20,$20,$20,$20,$20,$20,$20,$20,$20,$20,$20,$20,$20,$20,$20,$20,$20";

  program = collapseLoadedProgram([
    cmt("C64 Text Scroller Demo – sor 12 gorgetese balra, absoluteX cimazassal"),

    // $080D: jump over message data to main code
    b("Ugrasok", "JMP", "main", "main", "absolute"),

    // $0810: 40-byte message (screen codes)
    cmt("Uzenet: C64 kepernyo kodok (A=$01 B=$02 ... Z=$1A space=$20)"),
    { id: crypto.randomUUID(), category: "Makrok", mnemonic: "BYTE",
      operand: msg, rawOperand: msg,
      description: "Gorgetett uzenet adatai.", addressingMode: "implied",
      base: "bytes", validationError: "", isByteMacro: true },

    // $0838: main
    lbl("main"),
    b("Rendszer",   "SEI",   "",      "",      "implied"),
    b("Ugrasok",    "JSR",   "$E544", "E544",  "absolute", { description: "KERNAL CLRSCR: kepernyo torlese." }),
    b("Adatmozgas", "LDA",   "#$00",  "00",    "immediate"),
    b("Adatmozgas", "STA",   "$D021", "D021",  "absolute"),
    b("Adatmozgas", "LDA",   "#$0E",  "0E",    "immediate"),
    b("Adatmozgas", "STA",   "$D020", "D020",  "absolute"),

    // Static title rows via TEXT macro
    txt("** C64 TEXT SCROLLER **", 9, 0),
    txt("VISUAL ASSEMBLER DEMO",  10, 2),

    // Init message offset in ZP $FE
    cmt("ZP $FE = uzenet offset (0..39)"),
    b("Adatmozgas", "LDA",   "#$00",  "00",    "immediate"),
    b("Adatmozgas", "STA",   "$FE",   "FE",    "zeroPage"),

    // Fill scroll row 12 with spaces
    cmt("12. sor ($05E0) kezdeti feltoltese szokozzel"),
    b("Regiszterek","LDX",   "#$00",  "00",    "immediate"),
    lbl("fillrow"),
    b("Adatmozgas", "LDA",   "#$20",  "20",    "immediate"),
    b("Adatmozgas", "STA",   "$05E0", "05E0",  "absoluteX"),
    b("Regiszterek","INX",   "",      "",      "implied"),
    b("Aritmetika", "CPX",   "#$28",  "28",    "immediate"),
    b("Ugrasok",    "BNE",   "fillrow", "fillrow", "relative"),

    // ── Main scroll loop ──────────────────────────────────────────────
    cmt("Fo gorgetesi ciklus: fine-scroll + karakter-eltolos + uj char"),
    lbl("main_loop"),

    // Fine pixel scroll: $D016 bits 0-2 step 7->0
    cmt("Finompixel scroll: Y=7..0, $D016 = Y|$08 (CSEL=1, 40 col mod)"),
    b("Adatmozgas", "LDY",   "#$07",  "07",    "immediate"),
    lbl("scroll_pixel"),
    b("Regiszterek","TYA",   "",      "",      "implied"),
    b("Logika",     "ORA",   "#$08",  "08",    "immediate"),
    b("Adatmozgas", "STA",   "$D016", "D016",  "absolute"),
    b("Ugrasok",    "JSR",   "fdelay","fdelay","absolute"),
    b("Regiszterek","DEY",   "",      "",      "implied"),
    b("Ugrasok",    "BPL",   "scroll_pixel","scroll_pixel","relative"),

    // Shift screen row left by 1 char (col 1..39 -> col 0..38)
    cmt("Sor eltolasa balra 1 karakterrel (LDA $05E1,X / STA $05E0,X)"),
    b("Regiszterek","LDX",   "#$00",  "00",    "immediate"),
    lbl("shift_loop"),
    b("Adatmozgas", "LDA",   "$05E1", "05E1",  "absoluteX"),
    b("Adatmozgas", "STA",   "$05E0", "05E0",  "absoluteX"),
    b("Regiszterek","INX",   "",      "",      "implied"),
    b("Aritmetika", "CPX",   "#$27",  "27",    "immediate"),
    b("Ugrasok",    "BNE",   "shift_loop","shift_loop","relative"),

    // Write next message char into col 39 ($0607)
    cmt("Kovetkezo karakter beolvasasa az uzenetbol -> col 39"),
    b("Regiszterek","LDX",   "$FE",   "FE",    "zeroPage"),
    b("Adatmozgas", "LDA",   "$0810", "0810",  "absoluteX"),
    b("Adatmozgas", "STA",   "$0607", "0607",  "absolute"),

    // Advance offset, wrap at 40
    cmt("Offset noveles es visszaallitas 0-ra, ha elerte a 40-et"),
    b("Aritmetika", "INC",   "$FE",   "FE",    "zeroPage"),
    b("Adatmozgas", "LDA",   "$FE",   "FE",    "zeroPage"),
    b("Aritmetika", "CMP",   "#$28",  "28",    "immediate"),
    b("Ugrasok",    "BNE",   "main_loop","main_loop","relative"),
    b("Adatmozgas", "LDA",   "#$00",  "00",    "immediate"),
    b("Adatmozgas", "STA",   "$FE",   "FE",    "zeroPage"),
    b("Ugrasok",    "JMP",   "main_loop","main_loop","absolute"),

    // ── Frame delay subroutine ────────────────────────────────────────
    cmt("fdelay: kesleltetese (LDX #$18, dupla DEY/DEX ciklus)"),
    lbl("fdelay"),
    b("Regiszterek","LDX",   "#$18",  "18",    "immediate"),
    lbl("fdelay_o"),
    b("Regiszterek","LDY",   "#$FF",  "FF",    "immediate"),
    lbl("fdelay_i"),
    b("Regiszterek","DEY",   "",      "",      "implied"),
    b("Ugrasok",    "BNE",   "fdelay_i","fdelay_i","relative"),
    b("Regiszterek","DEX",   "",      "",      "implied"),
    b("Ugrasok",    "BNE",   "fdelay_o","fdelay_o","relative"),
    b("Ugrasok",    "RTS",   "",      "",      "implied"),
  ]);
  renderOriginPreview();
  renderEmulatorRunHint();
  renderProgram();
  saveUiSettings();
}

function loadSpriteSampleProgram() {
  // Sprite data at $0840 (= 64 * 33, pointer = $21)
  // Memory layout: $0801 JMP(3) + padding(60) + spritedata(63) + code
  originInput.value = "0801";
  program = collapseLoadedProgram([
    {
      id: crypto.randomUUID(),
      category: "Szerkezet",
      mnemonic: "COMMENT",
      operand: "Sprite mozgatas demo – gomb sprite balrol jobbra halad",
      rawOperand: "Sprite mozgatas demo – gomb sprite balrol jobbra halad",
      description: "Megjegyzes a programhoz, ami nem general byte-ot.",
      addressingMode: "implied",
      base: "comment",
      validationError: "",
      collapsed: false,
      isComment: true
    },
    {
      id: crypto.randomUUID(),
      category: "Ugrasok",
      mnemonic: "JMP",
      operand: "main",
      rawOperand: "main",
      description: "Feltetel nelkuli ugras egy cimre.",
      addressingMode: "absolute",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Makrok",
      mnemonic: "BYTE",
      operand: "$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00",
      rawOperand: "$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00",
      description: "Tetszoleges byte tomb beillesztese vesszovel elvalasztva.",
      addressingMode: "implied",
      base: "bytes",
      validationError: "",
      isByteMacro: true
    },
    {
      id: crypto.randomUUID(),
      category: "Makrok",
      mnemonic: "BYTE",
      operand: "$00,$3C,$00,$00,$FF,$00,$01,$FF,$80,$03,$FF,$C0,$07,$FF,$E0,$0F,$FF,$F0,$1F,$FF,$F8,$1F,$FF,$F8,$1F,$FF,$F8,$1F,$FF,$F8,$1F,$FF,$F8,$0F,$FF,$F0,$07,$FF,$E0,$03,$FF,$C0,$01,$FF,$80,$00,$FF,$00,$00,$3C,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00",
      rawOperand: "$00,$3C,$00,$00,$FF,$00,$01,$FF,$80,$03,$FF,$C0,$07,$FF,$E0,$0F,$FF,$F0,$1F,$FF,$F8,$1F,$FF,$F8,$1F,$FF,$F8,$1F,$FF,$F8,$1F,$FF,$F8,$0F,$FF,$F0,$07,$FF,$E0,$03,$FF,$C0,$01,$FF,$80,$00,$FF,$00,$00,$3C,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00",
      description: "Tetszoleges byte tomb beillesztese vesszovel elvalasztva.",
      addressingMode: "implied",
      base: "bytes",
      validationError: "",
      isByteMacro: true
    },
    {
      id: crypto.randomUUID(),
      category: "Szerkezet",
      mnemonic: "LABEL",
      operand: "",
      rawOperand: "",
      description: "Nevvel ellatott cimke a kodban, ugrasi celhoz.",
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      isLabel: true,
      labelName: "main"
    },
    {
      id: crypto.randomUUID(),
      category: "Ugrasok",
      mnemonic: "JSR",
      operand: "$E544",
      rawOperand: "E544",
      description: "Szubrutin meghivasa.",
      addressingMode: "absolute",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Makrok",
      mnemonic: "TEXT",
      operand: "SPRITE DEMO",
      rawOperand: "SPRITE DEMO",
      description: "Szoveg kiirasa a kepernyore KERNAL CHROUT rutinon keresztul.",
      addressingMode: "implied",
      base: "text",
      validationError: "",
      isTextMacro: true,
      textX: 14,
      textY: 0
    },
    {
      id: crypto.randomUUID(),
      category: "Szerkezet",
      mnemonic: "COMMENT",
      operand: "Sprite pointer: $07F8 = $0840 / 64 = 33 ($21)",
      rawOperand: "Sprite pointer: $07F8 = $0840 / 64 = 33 ($21)",
      description: "Megjegyzes a programhoz, ami nem general byte-ot.",
      addressingMode: "implied",
      base: "comment",
      validationError: "",
      collapsed: false,
      isComment: true
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "LDA",
      operand: "#$21",
      rawOperand: "21",
      description: "Akkumulator betoltese memoriabol vagy konstansbol.",
      addressingMode: "immediate",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "STA",
      operand: "$07F8",
      rawOperand: "07F8",
      description: "Akkumulator kiirasa memoriacimre.",
      addressingMode: "absolute",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Szerkezet",
      mnemonic: "COMMENT",
      operand: "Sprite 0 bekapcsolasa: $D015 bit0 = 1",
      rawOperand: "Sprite 0 bekapcsolasa: $D015 bit0 = 1",
      description: "Megjegyzes a programhoz, ami nem general byte-ot.",
      addressingMode: "implied",
      base: "comment",
      validationError: "",
      collapsed: false,
      isComment: true
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "LDA",
      operand: "#$01",
      rawOperand: "01",
      description: "Akkumulator betoltese memoriabol vagy konstansbol.",
      addressingMode: "immediate",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "STA",
      operand: "$D015",
      rawOperand: "D015",
      description: "Akkumulator kiirasa memoriacimre.",
      addressingMode: "absolute",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "LDA",
      operand: "#$0A",
      rawOperand: "0A",
      description: "Akkumulator betoltese memoriabol vagy konstansbol.",
      addressingMode: "immediate",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "STA",
      operand: "$D027",
      rawOperand: "D027",
      description: "Akkumulator kiirasa memoriacimre.",
      addressingMode: "absolute",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "LDA",
      operand: "#$00",
      rawOperand: "00",
      description: "Akkumulator betoltese memoriabol vagy konstansbol.",
      addressingMode: "immediate",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "STA",
      operand: "$D010",
      rawOperand: "D010",
      description: "Akkumulator kiirasa memoriacimre.",
      addressingMode: "absolute",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "LDA",
      operand: "#$18",
      rawOperand: "18",
      description: "Akkumulator betoltese memoriabol vagy konstansbol.",
      addressingMode: "immediate",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "STA",
      operand: "$D000",
      rawOperand: "D000",
      description: "Akkumulator kiirasa memoriacimre.",
      addressingMode: "absolute",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "LDA",
      operand: "#$64",
      rawOperand: "64",
      description: "Akkumulator betoltese memoriabol vagy konstansbol.",
      addressingMode: "immediate",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "STA",
      operand: "$D001",
      rawOperand: "D001",
      description: "Akkumulator kiirasa memoriacimre.",
      addressingMode: "absolute",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Szerkezet",
      mnemonic: "LABEL",
      operand: "",
      rawOperand: "",
      description: "Nevvel ellatott cimke a kodban, ugrasi celhoz.",
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      isLabel: true,
      labelName: "moveloop"
    },
    {
      id: crypto.randomUUID(),
      category: "Aritmetika",
      mnemonic: "INC",
      operand: "$D000",
      rawOperand: "D000",
      description: "Memoriacim noveles.",
      addressingMode: "absolute",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "LDA",
      operand: "$D000",
      rawOperand: "D000",
      description: "Akkumulator betoltese memoriabol vagy konstansbol.",
      addressingMode: "absolute",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Aritmetika",
      mnemonic: "CMP",
      operand: "#$E0",
      rawOperand: "E0",
      description: "Osszehasonlitas az akkumulatorral.",
      addressingMode: "immediate",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Ugrasok",
      mnemonic: "BNE",
      operand: "no_reset",
      rawOperand: "no_reset",
      description: "Ugras, ha az elozo eredmeny nem nulla.",
      addressingMode: "relative",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "LDA",
      operand: "#$18",
      rawOperand: "18",
      description: "Akkumulator betoltese memoriabol vagy konstansbol.",
      addressingMode: "immediate",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "STA",
      operand: "$D000",
      rawOperand: "D000",
      description: "Akkumulator kiirasa memoriacimre.",
      addressingMode: "absolute",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Szerkezet",
      mnemonic: "LABEL",
      operand: "",
      rawOperand: "",
      description: "Nevvel ellatott cimke a kodban, ugrasi celhoz.",
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      isLabel: true,
      labelName: "no_reset"
    },
    {
      id: crypto.randomUUID(),
      category: "Ugrasok",
      mnemonic: "JSR",
      operand: "delay",
      rawOperand: "delay",
      description: "Szubrutin meghivasa.",
      addressingMode: "absolute",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Ugrasok",
      mnemonic: "JMP",
      operand: "moveloop",
      rawOperand: "moveloop",
      description: "Feltetel nelkuli ugras egy cimre.",
      addressingMode: "absolute",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Szerkezet",
      mnemonic: "LABEL",
      operand: "",
      rawOperand: "",
      description: "Nevvel ellatott cimke a kodban, ugrasi celhoz.",
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      isLabel: true,
      labelName: "delay"
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "LDX",
      operand: "#$06",
      rawOperand: "06",
      description: "X regiszter betoltese.",
      addressingMode: "immediate",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Szerkezet",
      mnemonic: "LABEL",
      operand: "",
      rawOperand: "",
      description: "Nevvel ellatott cimke a kodban, ugrasi celhoz.",
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      isLabel: true,
      labelName: "delay_outer"
    },
    {
      id: crypto.randomUUID(),
      category: "Adatmozgas",
      mnemonic: "LDY",
      operand: "#$FF",
      rawOperand: "FF",
      description: "Y regiszter betoltese.",
      addressingMode: "immediate",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Szerkezet",
      mnemonic: "LABEL",
      operand: "",
      rawOperand: "",
      description: "Nevvel ellatott cimke a kodban, ugrasi celhoz.",
      addressingMode: "implied",
      base: "hex",
      validationError: "",
      isLabel: true,
      labelName: "delay_inner"
    },
    {
      id: crypto.randomUUID(),
      category: "Regiszterek",
      mnemonic: "DEY",
      operand: "",
      rawOperand: "",
      description: "Y regiszter csokkentese.",
      addressingMode: "implied",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Ugrasok",
      mnemonic: "BNE",
      operand: "delay_inner",
      rawOperand: "delay_inner",
      description: "Ugras, ha az elozo eredmeny nem nulla.",
      addressingMode: "relative",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Regiszterek",
      mnemonic: "DEX",
      operand: "",
      rawOperand: "",
      description: "X regiszter csokkentese.",
      addressingMode: "implied",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Ugrasok",
      mnemonic: "BNE",
      operand: "delay_outer",
      rawOperand: "delay_outer",
      description: "Ugras, ha az elozo eredmeny nem nulla.",
      addressingMode: "relative",
      base: "hex",
      validationError: ""
    },
    {
      id: crypto.randomUUID(),
      category: "Ugrasok",
      mnemonic: "RTS",
      operand: "",
      rawOperand: "",
      description: "Visszateres szubrutinbol.",
      addressingMode: "implied",
      base: "hex",
      validationError: ""
    }
  ]);
  renderOriginPreview();
  renderEmulatorRunHint();
  renderProgram();
  saveUiSettings();
}

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

