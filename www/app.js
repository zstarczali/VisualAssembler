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
    { mnemonic: "PETSCII", description: "Szoveg PETSCII kodolassal egy megadott memoriacimtol, kod generalas nelkul. CHROUT ($FFD2) kompatibilis. Null lezaro checkbox.", modes: ["implied"], isPetsciiMacro: true },
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
    { mnemonic: "MAP_COPY", description: "Terkep masolasa screen RAM-ba (es opcionalisan Color RAM-ba) tobb 256 byte-os LDX/LDA abs,X/STA abs,X ciklussal. Forras, cel, meret es szin-forras parameterezheto.", modes: ["implied"], isMapCopyMacro: true },
    { mnemonic: "SPRITE_ANIM", description: "Sprite animacio: ZP frame szamlalot leptet (0..count-1), majd a frame lista (1 byte/frame = sprite adatlap pointer) alapjan frissiti a $07F8+N regisztert. 19 byte.", modes: ["implied"], isSpriteAnimMacro: true },
    { mnemonic: "SCORE_BCD", description: "BCD pontszam noveles es kijelzes: SED/CLC/ADC pattern a pontszam hozzaadasahoz, majd BCD nibble → screen kod konverzioval kiiratja a screen RAM-ra. 2/4/6 jegy, inline.", modes: ["implied"], isScoreBcdMacro: true },
    { mnemonic: "LOADFILE", description: "Fajl betoltese D64-rol KERNAL SETNAM/SETLFS/LOAD rutinokkal. Cim opcionalis (ures = fajl sajat cime, sec=1; kitoltve = override, sec=0). Hiba cimke opcionalis (BCS).", modes: ["implied"], isLoadFileMacro: true },
    { mnemonic: "EXODECRUNCH", description: "Exomizer mem-mode tömörített adat kicsomagolása. Átmásolja a KERNAL load-end mutatóját ($AE/$AF) a depacker forrás-vég ZP mutatójára ($04/$05), átkapcsolja $01-et $36-ra (BASIC ROM ki, hogy $B000 RAM legyen), JSR a depacker rutinra (alapból $B000), majd visszaállítja $01-et $37-re. A depacker külön (exo-decrunch.bin, 480 byte) INCBIN-nel kell betölteni. 19 byte.", modes: ["implied"], isExoDecrunchMacro: true },
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
const chooseExomizerButton = document.getElementById("choose-exomizer");
const runExomizerToggle = document.getElementById("run-exomizer-toggle");
const chooseDebuggerButton = document.getElementById("choose-debugger");
const emulatorStatus = document.getElementById("emulator-status");
const emulatorRunHint = document.getElementById("emulator-run-hint");
const vicePathInput = document.getElementById("vice-path");
const exomizerPathInput = document.getElementById("exomizer-path");
const exomizerStatus = document.getElementById("exomizer-status");
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
const outputModeTabs = [...document.querySelectorAll('.view-mode-tab')];
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
let showMemoryOverlays = true;
let blockPaletteSync = true;
let asmOutputBase = "hex";
let originBase = "hex";
const macroSourceToggle = document.getElementById("macro-source-toggle");
const macroSourceToggleText = document.getElementById("macro-source-toggle-text");
const regionCommentsToggle = document.getElementById("region-comments-toggle");
const memoryOverlaysToggle = document.getElementById("memory-overlays-toggle");
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
const exomizerBorderFlashToggle = document.getElementById("exomizer-border-flash");
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
let exomizerPath = "";
let exomizerEnabled = false;
let debuggerPath = "";
let debuggerJmp = true;
let debuggerWait = false;
let debuggerWaitMs = 3000;
let debuggerUnpause = false;
let savedUiSettings = {};
let userMacros = {};  // Stores user-defined macros: { macroName: [blocks...] }

// ΓöÇΓöÇ Tab system ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
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

// translations object is defined in i18n.js (loaded before app.js)
function t(key) {
  return translations[currentLanguage]?.[key] ?? translations.en[key] ?? translations.hu[key] ?? key;
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

function _applyMemoryOverlaysVisibility() {
  document.body.dataset.memoryOverlays = showMemoryOverlays ? "1" : "0";
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
    exomizerBorderFlash: exomizerBorderFlashToggle ? exomizerBorderFlashToggle.checked : true,
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
    showMemoryOverlays,
    blockPaletteSync,
    asmOutputBase,
    exomizerEnabled,
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
  PETSCII: "Place text as PETSCII bytes at a given memory address without generating runtime code. Compatible with CHROUT ($FFD2). Null terminator checkbox appends $00.",
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
  EXODECRUNCH: "Decompress Exomizer mem-mode data in place. Copies KERNAL's load-end pointer ($AE/$AF) into the depacker's source-end ZP ($04/$05), toggles $01 to $36 (BASIC ROM off so $A000-$BFFF is RAM), JSRs the depacker (default $B000), then restores $01 to $37. The depacker itself (exo-decrunch.bin, 480 bytes) must be INCBIN'd separately. 19 bytes.",
  SPRITE_POS: "Set sprite position: X (0–319) and Y (0–255). Handles the $D010 MSB for X > 255.",
  WAIT_RASTER: "Busy-wait for a raster line: LDA $D012 / CMP #line / BNE -7. Inline, 7 bytes, no JSR.",
  JOYSTICK: "Read joystick and move sprite: UP/DOWN/LEFT/RIGHT via LSR+BCS+DEC/INC. Port 1=$DC01, Port 2=$DC00. 27 bytes inline.",
  MOUSE: "Read 1351 proportional mouse via SID POTX/POTY ($D419/$D41A) and move sprite. The macro follows standard 1351-style 7-bit delta decoding, waits one SID conversion window after CIA port selection, uses the classic low-byte-add plus $D010 toggle pattern on X, and inverts Y for VICE. 142 bytes inline.",
  SPRITE_COL: "Sprite collision detection: LDA $D01E/$D01F + AND #bitMask. Result in A: non-zero = collision. Follow with BEQ/BNE. 5 bytes.",
  MAP_COPY: "Copy map data to screen RAM (and optionally Color RAM) using multiple 256-byte LDX/LDA abs,X/STA abs,X loops. Source, destination, size and color source are configurable.",
  SPRITE_ANIM: "Sprite animation: increments a ZP frame counter (0..count-1) and updates $07F8+N from a 1-byte-per-frame pointer list. 19 bytes.",
  SCORE_BCD: "BCD score increment and display: SED/CLC/ADC pattern adds points, then converts BCD nibbles to screen codes and writes to screen RAM. 2/4/6 digits, inline.",
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

const mnemonicDescriptionsEs = {
  LDA: "Carga el acumulador desde memoria o constante.",
  LDX: "Carga el registro X.",
  LDY: "Carga el registro Y.",
  STA: "Almacena el acumulador en una dirección de memoria.",
  STX: "Almacena el registro X.",
  STY: "Almacena el registro Y.",
  ADC: "Suma con acarreo.",
  SBC: "Resta con acarreo.",
  INC: "Incrementa una dirección de memoria.",
  DEC: "Decrementa una dirección de memoria.",
  CMP: "Compara con el acumulador.",
  CPX: "Compara con el registro X.",
  CPY: "Compara con el registro Y.",
  AND: "AND lógico con el acumulador.",
  ORA: "OR lógico con el acumulador.",
  EOR: "OR exclusivo con el acumulador.",
  BIT: "Prueba bits de la memoria.",
  JMP: "Salto incondicional a una dirección.",
  JSR: "Llamada a subrutina.",
  RTS: "Retorno de subrutina.",
  BNE: "Salto si el resultado anterior no es cero.",
  BEQ: "Salto si el resultado anterior es cero.",
  BCC: "Salto si el acarreo está limpio.",
  BCS: "Salto si el acarreo está activo.",
  BMI: "Salto si el resultado es negativo.",
  BPL: "Salto si el resultado es positivo.",
  BVC: "Salto si el desbordamiento está limpio.",
  BVS: "Salto si el desbordamiento está activo.",
  RTI: "Retorno de interrupción.",
  TAX: "Copia el acumulador en X.",
  TAY: "Copia el acumulador en Y.",
  INX: "Incrementa el registro X.",
  DEX: "Decrementa el registro X.",
  INY: "Incrementa el registro Y.",
  DEY: "Decrementa el registro Y.",
  TSX: "Copia el puntero de pila en X.",
  TXA: "Copia el registro X en el acumulador.",
  TXS: "Copia el registro X en el puntero de pila.",
  TYA: "Copia el registro Y en el acumulador.",
  ASL: "Desplazamiento a la izquierda un bit.",
  LSR: "Desplazamiento a la derecha un bit.",
  ROL: "Rotación a la izquierda a través del acarreo.",
  ROR: "Rotación a la derecha a través del acarreo.",
  PHA: "Apila el acumulador en la pila.",
  PHP: "Apila el estado del procesador en la pila.",
  PLA: "Extrae el acumulador de la pila.",
  PLP: "Extrae el estado del procesador de la pila.",
  CLC: "Limpia el flag de acarreo.",
  CLD: "Limpia el flag decimal.",
  CLI: "Re-habilita las interrupciones.",
  CLV: "Limpia el flag de desbordamiento.",
  SEC: "Activa el flag de acarreo.",
  SED: "Activa el modo decimal.",
  SEI: "Deshabilita las interrupciones IRQ.",
  NOP: "Sin operación, solo continúa.",
  BRK: "Break/interrupción para depuración.",
  TEXT: "Escribe texto en la pantalla.",
  BYTE: "Inserta un array de bytes separados por comas.",
  WORD: "Inserta valores de 16 bits como pares LO/HI, separados por comas.",
  FILL: "Genera bytes repetidos con un conteo especificado.",
  ALIGN: "Alineación de memoria. Ej.: 64 → salto al siguiente límite de 64 bytes (sprite), 256 → límite de página.",
  TABLE: "Define una tabla de consulta con una etiqueta y dirección de inicio.",
  STRING: "Escribe una cadena en una dirección de memoria dada.",
  DATA: "Escribe bytes sin procesar en una dirección de memoria mediante código LDA/STA.",
  RAWBYTES: "Coloca bytes sin procesar en una dirección de memoria sin generar código en tiempo de ejecución.",
  RAWTEXT: "Coloca texto como códigos de pantalla en una dirección de memoria sin generar código en tiempo de ejecución.",
  PETSCII: "Coloca texto como bytes PETSCII en una dirección de memoria sin generar código. Compatible con CHROUT ($FFD2).",
  SID: "Carga un archivo de música SID directamente en memoria. La cabecera se elimina y se extraen las direcciones Load/Init/Play.",
  INCBIN: "Incluye un archivo binario externo en una dirección de memoria sin generar código en tiempo de ejecución.",
  INCLUDE: "Incluye los bloques de otro archivo JSON de proyecto en esta posición (solo lectura).",
  LOOP: "Bucle contador: LD* #count carga el contador, luego una etiqueta marca el inicio del cuerpo. Cerrar con NEXT.",
  NEXT: "Fin del bucle: DE* decrementa el contador, BNE vuelve a la etiqueta LOOP.",
  FOR: "Bucle de conteo hacia adelante: LD* #0, luego una etiqueta marca el inicio del cuerpo. Cerrar con ENDF.",
  ENDF: "Fin del bucle hacia adelante: IN* incrementa, CP* #limit compara, BNE vuelve a la etiqueta FOR.",
  PUSH: "Guarda registros en la pila (combinaciones de A, X, Y).",
  PULL: "Restaura registros de la pila (combinaciones de A, X, Y).",
  MACRO: "Inicio de definición de macro de usuario. Requiere un nombre; cerrar con ENDM.",
  ENDM: "Fin de definición de macro de usuario.",
  INVOKE: "Invocación de macro de usuario. Selecciona el nombre de la macro de la lista.",
  IF: "Inicio de ensamblado condicional. Requiere una condición (ej. DEBUG). Cerrar con ENDIF.",
  ELSE: "Rama alternativa dentro de un bloque IF.",
  ENDIF: "Fin del ensamblado condicional.",
  LAX: "Carga A y X desde la misma dirección simultáneamente (ilegal: LDA+LDX).",
  SAX: "Almacena A AND X en una dirección de memoria (ilegal).",
  DCP: "Decrementa memoria y compara con el acumulador (ilegal: DEC+CMP).",
  ISC: "Incrementa memoria y resta del acumulador (ilegal: INC+SBC).",
  SLO: "Desplaza memoria a la izquierda y OR con el acumulador (ilegal: ASL+ORA).",
  RLA: "Rota memoria a la izquierda y AND con el acumulador (ilegal: ROL+AND).",
  SRE: "Desplaza memoria a la derecha y EOR con el acumulador (ilegal: LSR+EOR).",
  RRA: "Rota memoria a la derecha y suma con acarreo (ilegal: ROR+ADC).",
  ANC: "AND inmediato y activa acarreo desde bit 7 (ilegal).",
  ALR: "AND y desplazamiento lógico a la derecha en un paso (ilegal: AND+LSR).",
  ARR: "AND y rotación a la derecha en un paso (ilegal: AND+ROR).",
  AXS: "Resta inmediato de A AND X, resultado en X (ilegal: SBX).",
  LABEL: "Etiqueta con nombre en el código para destinos de salto.",
  COMMENT: "Comentario del programa que no genera bytes.",
  SPRITE_INIT: "Inicializa un sprite: puntero de datos ($07F8+N), bit de habilitación ($D015) y color ($D027+N).",
  LOADFILE: "Carga un archivo del disco mediante KERNAL SETNAM/SETLFS/LOAD. Dirección opcional; etiqueta de error opcional (BCS).",
  EXODECRUNCH: "Descomprime datos comprimidos con Exomizer en modo mem. Copia el puntero de fin de carga del KERNAL ($AE/$AF) al puntero ZP de fin de fuente del depacker ($04/$05), cambia $01 a $36 (BASIC ROM desactivado para que $A000-$BFFF sea RAM), llama JSR al depacker (por defecto $B000), y luego restaura $01 a $37. El depacker en sí (exo-decrunch.bin, 480 bytes) debe incluirse por separado con INCBIN. 19 bytes.",
  SPRITE_POS: "Establece la posición del sprite: X (0–319) e Y (0–255). Gestiona el MSB de $D010 para X > 255.",
  WAIT_RASTER: "Espera activa una línea de raster: LDA $D012 / CMP #línea / BNE -7. Inline, 7 bytes, sin JSR.",
  JOYSTICK: "Lee el joystick y mueve el sprite: UP/DOWN/LEFT/RIGHT mediante LSR+BCS+DEC/INC. Puerto 1=$DC01, Puerto 2=$DC00. 27 bytes inline.",
  MOUSE: "Lee el ratón 1351 proporcional mediante SID POTX/POTY ($D419/$D41A) y mueve el sprite. 142 bytes inline.",
  SPRITE_COL: "Detección de colisión de sprite: LDA $D01E/$D01F + AND #bitMask. Resultado en A: no-cero = colisión. 5 bytes.",
  MAP_COPY: "Copia datos del mapa a Screen RAM (y opcionalmente Color RAM) con bucles LDX/LDA abs,X/STA abs,X de 256 bytes. Fuente, destino, tamaño y fuente de color configurables.",
  SPRITE_ANIM: "Animación de sprite: incrementa un contador ZP de frame (0..N-1) y actualiza $07F8+N desde una lista de punteros (1 byte/frame). 19 bytes.",
  SCORE_BCD: "Incremento y visualización de puntuación BCD: patrón SED/CLC/ADC para sumar puntos, convierte nibbles BCD a códigos de pantalla. 2/4/6 dígitos, inline.",
  DEFINE: "Define un símbolo para ensamblado condicional. Cuando está presente, los bloques IF evalúan la condición.",
  CONST: "Definición de constante con nombre. Se puede usar como operando en cualquier mnemónico.",
  REGION: "Agrupa bloques en una sección con nombre colapsable. Cerrar con ENDREGION.",
  ENDREGION: "Fin de una sección REGION.",
  ORG: "Establece la dirección de origen (directiva *=). Los bloques siguientes se ensamblan desde esta dirección.",
  REU_CHECK: "Comprueba si hay una RAM Expansion Unit (REU) mediante una prueba de escritura/lectura en $DF04. Z=0 → REU presente. 34 bytes.",
  REU_STASH: "Transferencia C64 RAM → REU (guardar): establece C64/REU addr, banco y longitud, luego escribe $90 en $DF01. 40 bytes.",
  REU_FETCH: "Transferencia REU → C64 RAM (cargar): establece C64/REU addr, banco y longitud, luego escribe $91 en $DF01. 40 bytes.",
  REU_SWAP: "Intercambio C64 RAM ↔ REU: establece C64/REU addr, banco y longitud, luego escribe $92 en $DF01. 40 bytes.",
  TURBO_SET: "Establece la velocidad turbo U64: escribe índice de velocidad (0–15) y control de badline (bit 7) en $D031. 5 bytes.",
  SUPERCPU_DETECT: "Detecta la presencia del CMD SuperCPU: LDA $D0B8 / CMP #$FF. Z=0 → SuperCPU presente. 5 bytes.",
  TURBO_ENABLE: "CMD SuperCPU turbo on/off: ON → LDA #$00 / STA $D07A, OFF → LDA #$00 / STA $D07B. 5 bytes."
};

function getItemDescription(item) {
  if (currentLanguage === "es") return mnemonicDescriptionsEs[item.mnemonic] || mnemonicDescriptionsEn[item.mnemonic] || item.description;
  if (currentLanguage !== "hu") return mnemonicDescriptionsEn[item.mnemonic] || item.description;
  return item.description;
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
    const os = ua.includes("Win") ? "Windows" : ua.includes("Mac") ? "macOS" : navigator.platform || "Unknown";
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
  exomizerBorderFlashToggle?.addEventListener("change", saveUiSettings);

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
  // Deferred: _C64_COLORS is a const declared later in the file (TDZ at init);
  // try/catch guards a degraded browser where earlier eval aborted (no Tauri).
  setTimeout(function() { try { _buildToolkitPalette(); } catch (_) {} }, 0);
  setupC64CharRom();
  setupCharEditor();
  setupMapEditor();
  setupHiresEditor();
  setupSpriteEditor();
  setupSidEditor();
  _setupFileMenus();
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
    // Force a file dialog every time the menu item is clicked (Save As behaviour).
    // Bootstrap an empty project if there isn't one yet, then clear the cached
    // path so _expertSaveProject always prompts for a location.
    if (!_expertProjectData) {
      _expertProjectData = { name: "Új projekt", files: [], _projPath: "" };
    } else {
      _expertProjectData._projPath = "";
    }
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
          _expertSetStatus(currentLanguage === "hu" ? "Mentve ✓" : "Saved ✓", "ok");
          setTimeout(() => _expertValidate(), 1800);
        } else if (emulatorStatus) {
          const prev = emulatorStatus.textContent;
          emulatorStatus.textContent = currentLanguage === "hu" ? "Mentve ✓" : "Saved ✓";
          setTimeout(() => { if (emulatorStatus.textContent.includes("✓")) emulatorStatus.textContent = prev; }, 1800);
        }
      });
    }
    // Ctrl+Shift+E / Cmd+Shift+E — toggle Expert mode
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "E") {
      e.preventDefault();
      const newVal = !expertMode;
      if (expertModeToggle) expertModeToggle.checked = newVal;
      setExpertMode(newVal);
    }
  });
  loadProjectButton?.addEventListener("click", async () => {
    const ok = await loadProjectFromFile();
    if (ok) document.querySelector(".control-menu")?.removeAttribute("open");
  });
  zoomOutButton.addEventListener("click", () => adjustZoom(-0.08));
  zoomInButton.addEventListener("click", () => adjustZoom(0.08));
  outputModeTabs.forEach((tab) => tab.addEventListener("click", () => {
    setOutputMode(tab.dataset.mode);
  }));
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
  memoryOverlaysToggle?.addEventListener("change", () => {
    showMemoryOverlays = memoryOverlaysToggle.checked;
    _applyMemoryOverlaysVisibility();
    saveUiSettings();
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
  chooseExomizerButton?.addEventListener("click", chooseExomizerExecutable);
  runExomizerToggle?.addEventListener("change", () => {
    exomizerEnabled = !!runExomizerToggle.checked;
    saveUiSettings();
  });
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
  loadExomizerConfig();
  loadDebuggerConfig();

  // Populate version on splash screen AND About dialog text node up-front so
  // any code that reads #about-version before the user opens About (e.g. the
  // copy-ASM header — although that now queries the backend directly) sees
  // the current version, not the placeholder in index.html.
  window.electronAPI.getAppVersion().then(version => {
    const splashVersion = document.getElementById('splash-version');
    if (splashVersion) splashVersion.textContent = `v${version}`;
    const aboutVersion = document.getElementById('about-version');
    if (aboutVersion) aboutVersion.textContent = `v${version}`;
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
  currentLanguage = ["en", "es", "hu"].includes(savedLanguage) ? savedLanguage : "hu";
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

  if (outputModeTabs.length && savedUiSettings.outputMode) {
    const mode = ["asm","monitor","both","disasm","toolkit"].includes(savedUiSettings.outputMode) ? savedUiSettings.outputMode : "asm";
    outputModeTabs.forEach((tab) => {
      const isActive = tab.dataset.mode === mode;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });
  }

  if (globalMemoryPanel) {
    globalMemoryPanel.open = !!savedUiSettings.memoryPanelOpen;
  }

  if (basicSysToggle) {
    basicSysToggle.checked = savedUiSettings.basicSys !== false;
  }

  if (exomizerBorderFlashToggle) {
    exomizerBorderFlashToggle.checked = savedUiSettings.exomizerBorderFlash !== false;
  }

  if (savedUiSettings.showMacroSource !== undefined) {
    showMacroSource = !!savedUiSettings.showMacroSource;
    if (macroSourceToggle) macroSourceToggle.checked = showMacroSource;
  }

  if (savedUiSettings.showRegionComments !== undefined) {
    showRegionComments = !!savedUiSettings.showRegionComments;
    if (regionCommentsToggle) regionCommentsToggle.checked = showRegionComments;
  }

  if (savedUiSettings.showMemoryOverlays !== undefined) {
    showMemoryOverlays = !!savedUiSettings.showMemoryOverlays;
    if (memoryOverlaysToggle) memoryOverlaysToggle.checked = showMemoryOverlays;
    _applyMemoryOverlaysVisibility();
  }

  if (savedUiSettings.blockPaletteSync !== undefined) {
    blockPaletteSync = !!savedUiSettings.blockPaletteSync;
    if (blockPaletteSyncToggle) blockPaletteSyncToggle.checked = blockPaletteSync;
  }

  exomizerEnabled = !!savedUiSettings.exomizerEnabled;
  if (runExomizerToggle) runExomizerToggle.checked = exomizerEnabled;

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
        _applyMemoryOverlaysVisibility();
        renderMemoryStrip();
      }
    }).catch(() => {});
  }
}

function handleLanguageChange() {
  currentLanguage = ["en", "es", "hu"].includes(languageSelect.value) ? languageSelect.value : "hu";
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
  document.title = currentLanguage === "hu" ? "C64 Block Assembler" : "C64 Visual Assembler";
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
  const exomizerFlashLabelEl = document.getElementById("exomizer-border-flash-label");
  if (exomizerFlashLabelEl) exomizerFlashLabelEl.textContent = t("exomizerBorderFlashLabel");
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
    setText('.view-mode-tab[data-mode="asm"]', t("outputAsm"));
    setText('.view-mode-tab[data-mode="monitor"]', t("outputMonitor"));
    setText('.view-mode-tab[data-mode="both"]', t("outputBoth"));
    setText('.view-mode-tab[data-mode="disasm"]', t("outputDisasm"));
    setText(".global-memory-title", t("memoryTitle"));
    setText("#hardware-settings-btn", t("hardwareSettings"));
    setText("#hardware-settings-title", t("hardwareSettingsTitle"));
    setText("#hardware-settings-close", t("hardwareSettingsClose"));
    setText("#hw-vice-section-label", t("hwViceSectionLabel"));
    setText("#hw-exomizer-section-label", t("hwExomizerSectionLabel"));
    setText("#hw-debugger-section-label", t("hwDebuggerSectionLabel"));
    setText("#vice-exe-label", t("viceExecutable"));
    setText("#choose-vice", t("openEmulator"));
    setText("#choose-exomizer", t("chooseExomizer"));
    setText("#exomizer-exe-label", t("exomizerExecutable"));
    setText("#choose-debugger", t("chooseDebugger"));
    setText("#debugger-exe-label", t("debuggerExecutable"));
    setText("#debugger-params-label", t("debuggerParamsLabel"));
    setText("#dbg-jmp-label", t("debuggerJmpLabel"));
    setText("#dbg-wait-label", t("debuggerWaitLabel"));
    setText("#dbg-unpause-label", t("debuggerUnpauseLabel"));
    setText("#run-emulator .run-label", getRunModeLabel(runMode));
    setText("#run-prg-label", t("runAsPrg"));
    setText("#run-exomizer-toggle-label", t("runWithExomizer"));
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
    setText("#asm-output-settings-label", t("asmOutputSettings"));
    if (macroSourceToggleText) macroSourceToggleText.textContent = t("macroSourceToggle");
    setText("#asm-numbers-label", t("asmNumbersLabel"));
    setText("#region-comments-label", t("regionCommentsLabel"));
    setText("#memory-overlays-label", t("memoryOverlaysLabel"));
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
      const runLabel = getRunModeLabel(runMode);
      runEmulatorButton.setAttribute("title", runLabel);
      runEmulatorButton.setAttribute("aria-label", runLabel);
    }
    if (runDebuggerButton) {
      runDebuggerButton.setAttribute("title", t("runInDebuggerTitle"));
      runDebuggerButton.setAttribute("aria-label", t("runInDebuggerTitle"));
    }
    chooseDebuggerButton?.setAttribute("title", t("chooseDebugger"));
    chooseDebuggerButton?.setAttribute("aria-label", t("chooseDebugger"));
    chooseExomizerButton?.setAttribute("title", t("chooseExomizer"));
    chooseExomizerButton?.setAttribute("aria-label", t("chooseExomizer"));
    updateVicePathPreview(vicePath);
    updateExomizerPathPreview(exomizerPath);
    updateDebuggerPathPreview(debuggerPath);
    updateEmulatorStatus();
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
  if (sampleOptions[17]) sampleOptions[17].textContent = t("sampleExoMulticolorDemo");
  if (sampleOptions[18]) sampleOptions[18].textContent = t("sampleInclude");
  if (sampleOptions[19]) sampleOptions[19].textContent = t("sampleSidDemo");
  if (sampleOptions[20]) sampleOptions[20].textContent = t("sampleSidDirectDemo");
  if (sampleOptions[21]) sampleOptions[21].textContent = t("sampleSpriteMacroDemo");
  if (sampleOptions[22]) sampleOptions[22].textContent = t("sampleJoystickDemo");
  if (sampleOptions[23]) sampleOptions[23].textContent = t("sampleMouseDemo");
  if (sampleOptions[24]) sampleOptions[24].textContent = t("sampleCollisionDemo");
  if (sampleOptions[25]) sampleOptions[25].textContent = t("sample10Print");
  if (sampleOptions[26]) sampleOptions[26].textContent = t("sampleRasterIrqDemo");
  if (sampleOptions[27]) sampleOptions[27].textContent = t("sampleOverlappingRasterDemo");
  if (sampleOptions[28]) sampleOptions[28].textContent = t("sampleMemoryOverlapDemo");
  if (sampleOptions[29]) sampleOptions[29].textContent = t("sampleRandLinesDemo");
  if (sampleOptions[30]) sampleOptions[30].textContent = t("sampleReuDemo");
  if (sampleOptions[31]) sampleOptions[31].textContent = t("sampleScrollTextDemo");
  if (sampleOptions[32]) sampleOptions[32].textContent = t("sampleNameInputDemo");

  updateThemeToggleLabel();
  refreshCategoryOptions();
  updateOperandField();
  _applyEditorTranslations();
}

/* Translate the new tool dialogs (CharROM, Character Editor, Map Editor) */
function _applyEditorTranslations() {
  const setText = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };
  const setAttr = (sel, val) => {
    const el = document.querySelector(sel);
    if (el) { el.setAttribute("title", val); el.setAttribute("aria-label", val); }
  };
  // Toolbar button tooltips
  setAttr("#c64-palette-btn", t("paletteBtnTitle"));
  setAttr("#c64-chrrom-btn", t("chrromBtnTitle"));
  setAttr("#char-editor-btn", t("charEditorBtnTitle"));
  setAttr("#map-editor-btn", t("mapEditorBtnTitle"));
  // CharROM dialog
  setText(".c64-chrrom-title", t("chrromTitle"));
  setText("#c64-chrrom-tab1", t("chrromSet1"));
  setText("#c64-chrrom-tab2", t("chrromSet2"));
  const hint = document.getElementById("c64-chrrom-info-hint");
  if (hint && !hint.hidden) hint.textContent = t("chrromHint");
  // Character Editor
  setText(".ce-hdr-titles .ce-section-lbl", t("ceEditorLabel"));
  setText(".ce-map-lbl", t("ceMapLabel"));
  setAttr("#ce-clear", t("ceClear"));
  setAttr("#ce-invert", t("ceInvert"));
  setAttr("#ce-fliph", t("ceFlipH"));
  setAttr("#ce-flipv", t("ceFlipV"));
  setText(".ce-export-lbl", t("ceExport"));
  setText("#ce-copy-asm", t("ceCopyAsm"));
  setAttr("#ce-load-rom", t("ceLoadRom"));
  setText("#ce-load-bin", t("ceLoadBin"));
  setText("#ce-save-bin", t("ceSaveBin"));
  // _ceData/_ceSel are `let`s declared later in the file; at first init they are
  // still in the temporal dead zone (typeof throws too), so guard with try/catch.
  try { _ceUpdateInfo(); } catch (_) {}
  // Files ▾ button (all editors share the same class)
  document.querySelectorAll(".ed-file-btn").forEach(el => { el.textContent = t("edFilesBtn"); });
  // Character Editor — FG/BG labels, shift tooltips
  const ceColorLabels = document.querySelectorAll(".ce-color-row .ce-color-lbl");
  if (ceColorLabels[0]) ceColorLabels[0].textContent = t("ceFg");
  if (ceColorLabels[1]) ceColorLabels[1].textContent = t("ceBg");
  setAttr("#ce-shl", t("shiftLeft"));
  setAttr("#ce-shr", t("shiftRight"));
  setAttr("#ce-shu", t("shiftUp"));
  setAttr("#ce-shd", t("shiftDown"));
  // Map Editor
  setText(".me-title", t("meTitle"));
  setAttr('.me-tool[data-tool="paint"]', t("mePaint"));
  setAttr('.me-tool[data-tool="fill"]', t("meFill"));
  setAttr('.me-tool[data-tool="flood"]', t("meFlood"));
  setAttr('.me-tool[data-tool="select"]', t("meSelect"));
  setAttr('.me-tool[data-tool="pick"]', t("mePick"));
  setText('#map-editor-dialog button[data-export="screen"]', t("meExportScreen"));
  setText('#map-editor-dialog button[data-export="color"]', t("meExportColor"));
  setText('#map-editor-dialog button[data-export="bin"]', t("meExportBin"));
  setText('#map-editor-dialog button[data-export="layer-bin"]', t("meExportLayerBin"));
  setText('#map-editor-dialog button[data-export="layers-bin"]', t("meExportAllLayersBin"));
  setText('#map-editor-dialog button[data-export="layer-screen"]', t("meExportLayerScreen"));
  setText("#me-load-map", t("meLoadMap"));
  setText("#me-grid-label", t("meGrid"));
  setText(".me-palette-wrap .me-section-lbl", t("meColorLabel"));
  setText(".me-layers .me-section-lbl", t("meLayers"));
  setAttr("#me-layer-flatten", t("meMergeLayersTitle"));
  setAttr("#me-layer-add", t("meAddLayerTitle"));
  setAttr("#me-clear", t("meClearMap"));
  // Hires Editor
  setText(".hg-title", t("hgTitle"));
  setText("#hg-import", t("hgImport"));
  setText("#hg-export", t("hgExport"));
  setText("#hg-export-blocks", t("hgExportBlocks"));
  setText("#hg-save-d64", t("hgSaveD64"));
  setAttr('.hg-tool[data-tool="pencil"]', t("hgToolPencil"));
  setAttr('.hg-tool[data-tool="eraser"]', t("hgToolEraser"));
  setAttr('.hg-tool[data-tool="line"]', t("hgToolLine"));
  setAttr('.hg-tool[data-tool="rect"]', t("hgToolRect"));
  setAttr('.hg-tool[data-tool="fillrect"]', t("hgToolFillRect"));
  setAttr('.hg-tool[data-tool="oval"]', t("hgToolOval"));
  setAttr('.hg-tool[data-tool="filloval"]', t("hgToolFillOval"));
  setAttr('.hg-tool[data-tool="fill"]', t("hgToolFill"));
  setAttr("#hg-undo", t("hgUndo"));
  setAttr("#hg-redo", t("hgRedo"));
  setAttr("#hg-clear", t("hgClear"));
  setText("#hg-multicolor-label", t("hgMulticolor"));
  setText("#hg-grid-label", t("hgGrid"));
  setText("#hg-color-lbl", t("hgColorLabel"));
  setText("#hg-paper-lbl", t("hgPaperLabel"));
  setText("#hg-zoom-lbl", t("hgZoomLabel"));
  setText("#hg-raster-label", t("hgRaster"));
  // Sprite Editor
  setText(".se-title", t("seTitle"));
  setText("#se-open-spd", t("seLoadBin"));
  setText("#se-save-bin", t("seSaveBin"));
  setText("#se-copy-data", t("seCopyBytes"));
  setAttr("#se-fliph", t("seFlipH"));
  setAttr("#se-flipv", t("seFlipV"));
  setAttr("#se-clear", t("seClearFrame"));
  const seShiftLbl = document.querySelector(".se-shift-group .se-mini-lbl");
  if (seShiftLbl) seShiftLbl.textContent = t("seShiftLabel");
  setAttr("#se-shl", t("shiftLeft"));
  setAttr("#se-shr", t("shiftRight"));
  setAttr("#se-shu", t("shiftUp"));
  setAttr("#se-shd", t("shiftDown"));
  const seWrapSpan = document.querySelector("#se-wrap + span");
  if (seWrapSpan) seWrapSpan.textContent = t("seWrap");
  const seMultiSpan = document.querySelector("#se-multicolor + span");
  if (seMultiSpan) seMultiSpan.textContent = t("seMulticolor");
  const seGridSpan = document.querySelector("#se-grid + span");
  if (seGridSpan) seGridSpan.textContent = t("seGrid");
  const seZoomLbl = document.querySelector(".se-tb-right .se-mini-lbl");
  if (seZoomLbl) seZoomLbl.textContent = t("seZoom");
  const seSectionLbls = document.querySelectorAll(".se-section-lbl");
  if (seSectionLbls[0]) seSectionLbls[0].textContent = t("seColorsSection");
  if (seSectionLbls[1]) seSectionLbls[1].textContent = t("sePaletteSection");
  const sePlayBtn = document.getElementById("se-play");
  if (sePlayBtn && !sePlayBtn.dataset.playing) sePlayBtn.textContent = t("sePlay");
  const sePingSpan = document.querySelector("#se-pingpong + span");
  if (sePingSpan) sePingSpan.textContent = t("sePingPong");
  const seOnionSpan = document.querySelector("#se-onion + span");
  if (seOnionSpan) seOnionSpan.textContent = t("seOnion");
  const seFpsLbl = document.querySelector(".se-anim-controls .se-mini-lbl");
  if (seFpsLbl) seFpsLbl.textContent = t("seFps");
  setText("#se-add", t("seAdd"));
  setText("#se-dup", t("seDup"));
  setText("#se-fcopy", t("seCopy"));
  setText("#se-fpaste", t("sePaste"));
  setText("#se-fdel", t("seDelete"));
  // SID Editor
  setText(".sid-title", t("sidTitle"));
  setText("#sid-load-bin", t("sidLoadBin"));
  setText("#sid-save-bin", t("sidSaveBin"));
  setText("#sid-export-data", t("sidExportData"));
  setText("#sid-export-player", t("sidExportPlayer"));
  setText("#sid-export-asm", t("sidExportAsm"));
  setText(".sid-inst-row .sid-lbl", t("sidInstrumentLabel"));
  setAttr("#sid-inst-add", t("sidAddInstrument"));
  setAttr("#sid-preview", t("sidPreview"));
  const sidWaveLbl = document.querySelector(".sid-wave-row .sid-lbl");
  if (sidWaveLbl) sidWaveLbl.textContent = t("sidWaveformLabel");
  const sidPwLbl = document.querySelector(".sid-wave-row .sid-mini-lbl");
  if (sidPwLbl) sidPwLbl.textContent = t("sidPwLabel");
  const sidSections = document.querySelectorAll(".sid-section");
  if (sidSections[0]) sidSections[0].textContent = t("sidAdsrLabel");
  if (sidSections[1]) sidSections[1].textContent = t("sidFilterLabel");
  const sidAdsrLbls = document.querySelectorAll(".sid-adsr .sid-sl-lbl");
  if (sidAdsrLbls[0]) sidAdsrLbls[0].textContent = t("sidAttack");
  if (sidAdsrLbls[1]) sidAdsrLbls[1].textContent = t("sidDecay");
  if (sidAdsrLbls[2]) sidAdsrLbls[2].textContent = t("sidSustain");
  if (sidAdsrLbls[3]) sidAdsrLbls[3].textContent = t("sidRelease");
  const sidFilterLbls = document.querySelectorAll(".sid-filter .sid-sl-lbl");
  if (sidFilterLbls[0]) sidFilterLbls[0].textContent = t("sidCutoff");
  if (sidFilterLbls[1]) sidFilterLbls[1].textContent = t("sidResonance");
  if (sidFilterLbls[2]) sidFilterLbls[2].textContent = t("sidVolume");
  setText(".sid-tracker-row .sid-lbl", t("sidTrackerLabel"));
  setAttr("#sid-pat-add", t("sidAddPattern"));
  const sidTrackerMiniLbls = document.querySelectorAll(".sid-tracker-row .sid-mini-lbl");
  if (sidTrackerMiniLbls[0]) sidTrackerMiniLbls[0].textContent = t("sidSpeed");
  if (sidTrackerMiniLbls[1]) sidTrackerMiniLbls[1].textContent = t("sidOctave");
  setAttr("#sid-oct-down", t("sidOctaveDown"));
  setAttr("#sid-oct-up", t("sidOctaveUp"));
  setAttr("#sid-play", t("sidPlay"));
  setAttr("#sid-stop", t("sidStop"));
  setAttr("#sid-voice-copy", t("sidVoiceCopy"));
  setAttr("#sid-voice-paste", t("sidVoicePaste"));
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
  return outputModeTabs.find((tab) => tab.classList.contains("active"))?.dataset.mode || "asm";
}

function setOutputMode(mode) {
  outputModeTabs.forEach((tab) => {
    const isActive = tab.dataset.mode === mode;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  outputStack.dataset.mode = mode;
  if (mode === "toolkit") { try { _buildToolkitPalette(); } catch (_) {} }
  saveUiSettings();
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
  const operandField = operandInput.closest(".field");
  const addressingField = document.getElementById("addressing-field");
  const hideOperandField = !!item?.isTableMacro;

  // Hide addressing mode selector for COMMENT or single-mode instructions
  if (addressingField) addressingField.hidden = !!(item?.isComment) || (item ? item.modes.length <= 1 : false);
  if (operandField) operandField.hidden = hideOperandField;

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
    operandInput.placeholder = currentLanguage === "hu" ? "Valassz elobb mnemonikot" : "Select a mnemonic first";
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
  operandInput.disabled = hideOperandField || !(mode.needsOperand || needsTextOperand || needsByteOperand || needsStringOperand || needsDataOperand || needsRawBytesOperand || needsRawTextOperand || needsPetsciiOperand || needsCommentOperand) || item?.isIncBinMacro || item?.isIncludeMacro;
  operandInput.placeholder = needsTextOperand
    ? (currentLanguage === "hu" ? "Peldaul HELLO C64" : "For example HELLO C64")
    : needsByteOperand
      ? (currentLanguage === "hu" ? "Peldaul 169,0,141,32,208" : "For example 169,0,141,32,208")
      : needsStringOperand
        ? (currentLanguage === "hu" ? "Peldaul HELLO" : "For example HELLO")
        : needsDataOperand
          ? (currentLanguage === "hu" ? "Peldaul 169,0,141,32,208" : "For example 169,0,141,32,208")
          : needsRawBytesOperand
            ? (currentLanguage === "hu" ? "Peldaul 169,0,141,32,208" : "For example 169,0,141,32,208")
            : needsRawTextOperand
              ? (currentLanguage === "hu" ? "Peldaul HELLO" : "For example HELLO")
              : needsCommentOperand
                ? (currentLanguage === "hu" ? "Peldaul border scroll demo" : "For example border scroll demo")
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
      <p>${currentLanguage === "hu" ? "Makro-cimzes: kepernyo pozicio X/Y alapon." : "Macro addressing: screen position by X/Y."}</p>
      <small>${currentLanguage === "hu" ? "Elonezet" : "Preview"}: ${textPreview.preview}</small>
    `;
    return;
  }
  if (item.isByteMacro) {
    const bytePreview = formatByteMacroPreview(operandInput.value.trim());
    mnemonicDescription.innerHTML = `
      <strong>${item.mnemonic}</strong>
      <p>${getItemDescription(item)}</p>
      <p>${currentLanguage === "hu" ? "Makro-cimzes: a byte-ok a jelenlegi assembly cimre kerulnek." : "Macro addressing: bytes are inserted at the current assembly address."}</p>
      <small>${currentLanguage === "hu" ? "Elonezet" : "Preview"}: ${bytePreview.preview}</small>
      ${bytePreview.error ? `<br><small class="error-text">${bytePreview.error}</small>` : ""}
    `;
    return;
  }
  if (item.isStringMacro) {
    const textPreview = formatTextMacroPreview(operandInput.value.trim());
    mnemonicDescription.innerHTML = `
      <strong>${item.mnemonic}</strong>
      <p>${getItemDescription(item)}</p>
      <p>${currentLanguage === "hu" ? "Makro-cimzes: szoveget kepernyo kodkent kodol, majd LDA #kod / STA $cim parokat general futasidokor." : "Macro addressing: encodes text as screen codes, then generates LDA #code / STA $addr pairs at runtime."}</p>
      <small>${currentLanguage === "hu" ? "Elonezet" : "Preview"}: ${textPreview.preview}</small>
    `;
    return;
  }
  if (item.isRawBytesMacro) {
    const bytePreview = formatByteMacroPreview(operandInput.value.trim());
    mnemonicDescription.innerHTML = `
      <strong>${item.mnemonic}</strong>
      <p>${getItemDescription(item)}</p>
      <p>${currentLanguage === "hu" ? "Makro-cimzes: nyers byte-okat helyez el kozvetlenul egy abszolut memoriacimre, LDA/STA kod generalas nelkul." : "Macro addressing: places raw bytes directly at an absolute memory address, no LDA/STA code generated."}</p>
      <small>${currentLanguage === "hu" ? "Elonezet" : "Preview"}: ${bytePreview.preview}</small>
      ${bytePreview.error ? `<br><small class="error-text">${bytePreview.error}</small>` : ""}
    `;
    return;
  }
  if (item.isIncBinMacro) {
    mnemonicDescription.innerHTML = `
      <strong>${item.mnemonic}</strong>
      <p>${getItemDescription(item)}</p>
      <p>${currentLanguage === "hu" ? "Makro-cimzes: kulso binarfajl adatait helyezi el egy abszolut memoriacimre, runtime kod generalas nelkul." : "Macro addressing: includes an external binary file at a given memory address, no runtime code generated."}</p>
      <small>${currentLanguage === "hu" ? "A fajlt a Tallozas gombbal valaszthatod ki a beillesztes utan." : "Select a binary file with the Browse button after inserting."}</small>
    `;
    return;
  }
  if (item.isIncludeMacro) {
    mnemonicDescription.innerHTML = `
      <strong>${item.mnemonic}</strong>
      <p>${getItemDescription(item)}</p>
      <p>${currentLanguage === "hu" ? "Egy masik projekt JSON fajl blokkjait illeszti be erre a helyre. A blokkok szurkitve, csak olvashatoan jelennek meg." : "Embeds another project JSON file's blocks inline at this position. The blocks appear grayed out and read-only."}</p>
      <small>${currentLanguage === "hu" ? "A projektet a Tallozas gombbal valaszthatod ki a beillesztes utan." : "Select a project file with the Browse button after inserting."}</small>
    `;
    return;
  }
  if (item.isRawTextMacro) {
    const textPreview = formatTextMacroPreview(operandInput.value.trim());
    mnemonicDescription.innerHTML = `
      <strong>${item.mnemonic}</strong>
      <p>${getItemDescription(item)}</p>
      <p>${currentLanguage === "hu" ? "Makro-cimzes: szoveget kepernyo kodkent helyez el kozvetlenul egy abszolut memoriacimre, LDA/STA kod generalas nelkul." : "Macro addressing: places text as screen codes directly at an absolute memory address, no LDA/STA code generated."}</p>
      <small>${currentLanguage === "hu" ? "Elonezet" : "Preview"}: ${textPreview.preview}</small>
    `;
    return;
  }
  if (item.isComment) {
    mnemonicDescription.innerHTML = `
      <strong>${item.mnemonic}</strong>
      <p>${getItemDescription(item)}</p>
      <p>${currentLanguage === "hu" ? "Kommentsor, ami az ASM-ben es a monitorban is latszik, de nem general byte-ot." : "Comment line visible in ASM and monitor, but it generates no bytes."}</p>
      <small>${currentLanguage === "hu" ? "Elonezet" : "Preview"}: ; ${operandInput.value.trim() || (currentLanguage === "hu" ? "uj komment" : "new comment")}</small>
    `;
    return;
  }
  const preview = buildOperandPreview(modeKey, operandInput.value.trim(), getSelectedBase());

  mnemonicDescription.innerHTML = `
    <strong>${item.mnemonic}</strong>
    <p>${getItemDescription(item)}</p>
    <p>${currentLanguage === "hu" ? "Cimzes" : "Addressing"}: ${modeText(modeKey, "label")}. ${modeText(modeKey, "help")}</p>
    <small>${currentLanguage === "hu" ? "Engedett modok" : "Allowed modes"}: ${item.modes.map((key) => modeText(key, "label")).join(", ")}</small>
    <br>
    <small>${currentLanguage === "hu" ? "Elonezet" : "Preview"}: ${preview.text}</small>
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
      ? `${currentLanguage === "hu" ? "Kepernyo X/Y" : "Screen X/Y"} | ${preview.preview}`
      : item.isByteMacro
        ? `${currentLanguage === "hu" ? "Byte tomb" : "Byte array"} | ${preview.preview}`
        : item.isStringMacro
          ? `${currentLanguage === "hu" ? "Abszolut cim" : "Absolute address"} | ${preview.preview}`
          : item.isDataMacro
            ? `${currentLanguage === "hu" ? "Abszolut cim" : "Absolute address"} | ${preview.preview}`
            : item.isRawBytesMacro
              ? `${currentLanguage === "hu" ? "Nyers byte-ok adott cimre" : "Raw bytes at address"} | ${preview.preview}`
              : item.isRawTextMacro
                ? `${currentLanguage === "hu" ? "Nyers szoveg adott cimre" : "Raw text at address"} | ${preview.preview}`
                : item.isIncBinMacro
                  ? `${currentLanguage === "hu" ? "Binarfajl adott cimre" : "Binary file at address"}`
                  : item.isIncludeMacro
                  ? `${currentLanguage === "hu" ? "Projekt blokkjainak beillesztese" : "Include project blocks inline"}`
                  : item.isSidMacro
                  ? `${currentLanguage === "hu" ? "SID zenefajl, fejlec automatikusan eltavolitva" : "SID music file, header stripped automatically"}`
                  : item.isComment
                ? `${currentLanguage === "hu" ? "Komment" : "Comment"} | ; ${operandInput.value.trim() || (currentLanguage === "hu" ? "uj komment" : "new comment")}`
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

function _highlightPaletteItemByMnemonic(mnemonic, behavior = "smooth") {
  document.querySelectorAll(".palette-item--active").forEach(el => el.classList.remove("palette-item--active"));
  if (!mnemonic) return;
  const items = paletteList.querySelectorAll(".palette-item");
  for (const item of items) {
    const mn = item.querySelector(".palette-mnemonic")?.textContent?.trim();
    if (mn === mnemonic) {
      item.classList.add("palette-item--active");
      item.scrollIntoView({ block: "nearest", behavior });
      break;
    }
  }
}

function _highlightActivePaletteItem() {
  if (!selectedBlockId) return;
  const block = program.find(b => b.id === selectedBlockId);
  if (!block) return;
  _highlightPaletteItemByMnemonic(block.mnemonic, "smooth");
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
    empty.textContent = currentLanguage !== "hu" ? "No results." : "Nincs talalat.";
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
      ? `${currentLanguage !== "hu" ? "Call user macro" : "Felhasznaloi makro hivasa"}`
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
      petsciiAddress: "C000",
      petsciiNullTerminated: false
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

  if (item.isExoDecrunchMacro) {
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
      isExoDecrunchMacro: true,
      exoDepackerAddr: "B000"
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

  if (item.isMapCopyMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "", rawOperand: "", description: item.description,
      addressingMode: "implied", base: "hex", validationError: "",
      collapsed: true, isMapCopyMacro: true,
      mapCopySrc: "C000", mapCopyDst: "0400", mapCopySize: 1000,
      mapCopyCombined: false, mapCopyColorSrc: "", mapCopyColorDst: "D800"
    };
  }

  if (item.isSpriteAnimMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "", rawOperand: "", description: item.description,
      addressingMode: "implied", base: "hex", validationError: "",
      collapsed: true, isSpriteAnimMacro: true,
      animSpriteNum: 0, animFrameListAddr: "C100", animFrameCount: 4, animFrameZP: "FB"
    };
  }

  if (item.isScoreBcdMacro) {
    return {
      id: crypto.randomUUID(),
      category: categorySelect.value,
      mnemonic: item.mnemonic,
      operand: "", rawOperand: "", description: item.description,
      addressingMode: "implied", base: "hex", validationError: "",
      collapsed: true, isScoreBcdMacro: true,
      scoreBcdAddr: "C200", scoreDigits: 4, scoreAddPoints: "100", scoreScreenAddr: "0400"
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
      macroName: macroName,
      macroParams: ""
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
      validationError: macroNames.length === 0 ? (currentLanguage !== "hu" ? "No macros defined yet" : "Meg nincs definialva makro") : "",
      collapsed: true,
      isMacroInvoke: true,
      invokeMacroName: firstMacro,
      invokeArgs: ""
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
  if (block.isBlankLine) return "";
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
  const fmtAddr = a => /^[A-Za-z_]/.test(a || "") ? a : "$" + (a || "C000").replace(/^\$/, "").toUpperCase();
  const fmtMacroLabel = ml => ml ? ` :${ml}` : "";
  if (block.isStringMacro)    return `.string ${fmtAddr(block.stringAddress)}, "${block.rawOperand || ""}"${fmtMacroLabel(block.macroLabel)}`;
  if (block.isRawTextMacro)   return `.rawtext ${fmtAddr(block.rawTextAddress)}, "${block.rawOperand || ""}"${fmtMacroLabel(block.macroLabel)}`;
  if (block.isDataMacro)      return `.data ${fmtAddr(block.dataAddress)}, ${fmtRaw(block.rawOperand, block.base)}${fmtMacroLabel(block.macroLabel)}`;
  if (block.isRawBytesMacro)  return `.rawbytes ${fmtAddr(block.rawBytesAddress)}, ${fmtRaw(block.rawOperand, block.base)}${fmtMacroLabel(block.macroLabel)}`;
  if (block.isByteMacro) {
      const asmBytes = parseByteMacro(block.rawOperand, block.base);
      const chunks = chunkBytes(asmBytes, 8);
      return chunks.map(chunk => `.byte ${chunk.map(b => "$" + b.toString(16).toUpperCase().padStart(2, "0")).join(", ")}`).join("\n");
  }
  if (block.isWordMacro) {
      const words = parseWordMacro(block.rawOperand, block.base);
      const chunks = chunkBytes(words, 4);
      return chunks.map(chunk => `.word ${chunk.map(w => "$" + (w & 0xFFFF).toString(16).toUpperCase().padStart(4, "0")).join(", ")}`).join("\n");
  }
  if (block.isFillMacro)      return `.fill ${fmtRaw(block.rawOperand, block.base)}`;
  if (block.isAlignMacro)     return `.align ${block.rawOperand || "64"}`;
  if (block.isIncBinMacro)    return `.incbin "${block.incBinFileName || "data.bin"}"${block.incBinAddress && block.incBinAddress !== "$C000" ? ", $" + block.incBinAddress.replace(/^\$/,"") : ""}`;
  if (block.isPetsciiMacro)   return `.petscii ${fmtAddr(block.petsciiAddress)}, "${block.rawOperand || "HELLO"}"${block.petsciiNullTerminated ? ", null" : ""}${fmtMacroLabel(block.macroLabel)}`;
  if (block.isTableMacro)     return block.tableAddress ? `.table ${block.tableName || "table1"} $${block.tableAddress.replace(/^\$/,"").toUpperCase()}` : `.table ${block.tableName || "table1"}`;  
  if (block.isLoadFileMacro)  return `.loadfile "${block.loadFileName || "DATA"}", ${block.loadFileDevice || "8"}${block.loadFileAddress ? ", $" + block.loadFileAddress.replace(/^\$/,"") : ""}${block.loadFileErrorLabel ? ", " + block.loadFileErrorLabel : ""}`;
  if (block.isExoDecrunchMacro) return `.exodecrunch depacker=$${(block.exoDepackerAddr||"B000").toUpperCase()}`;
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
  if (block.isMacroDefStart)  return `.macro ${block.macroName || block.rawOperand || "myMacro"}${block.macroParams ? "(" + block.macroParams + ")" : ""}`;
  if (block.isMacroDefEnd)    return `.endm`;
  if (block.isMacroInvoke)    return `.${block.invokeSyntax || "invoke"} ${block.invokeMacroName || "myMacro"}${block.invokeArgs ? "(" + block.invokeArgs + ")" : ""}`;  
  if (block.isSpriteInitMacro)return `.sprite_init ${block.spriteNum || 0}, ${block.spriteColor || 7}, $${(block.spriteDataPage || "21").toUpperCase()}`;
  if (block.isSpritePosMacro) return `.sprite_pos ${block.spriteNum || 0}, ${block.spriteX || 152}, ${block.spriteY || 100}`;
  if (block.isWaitRasterMacro)return `.wait_raster $${(block.rasterLine || "FF").toUpperCase()}`;
  if (block.isTurboSetMacro) return `.turbo_set ${block.turboSpeed || "7"},${block.turboBadline || "0"}`;
  if (block.isSuperCpuDetectMacro) return `.supercpu_detect`;
  if (block.isTurboEnableMacro)    return `.turbo_enable ${block.turboEnableMode || "on"}`;
  if (block.isJoystickMacro)  return `.joystick ${block.joyPort || 2}, ${block.joySpriteNum || 0}`;
  if (block.isMouseMacro)     return `.mouse ${block.mousePort || 2}, ${block.mouseSpriteNum || 0}, ${(block.mousePotXZP || "FD").toUpperCase()}, ${(block.mousePotYZP || "FE").toUpperCase()}`;
  if (block.isSpriteColMacro) return `.sprite_col ${block.spriteNum || 0}, ${block.colType || "background"}`;
  if (block.isMapCopyMacro) {
    const base = `.map_copy $${(block.mapCopySrc || "C000").toUpperCase()}, $${(block.mapCopyDst || "0400").toUpperCase()}, ${block.mapCopySize || 1000}`;
    return block.mapCopyCombined
      ? base + `, auto, $${(block.mapCopyColorDst || "D800").toUpperCase()}`
      : block.mapCopyColorSrc ? base + `, $${block.mapCopyColorSrc.toUpperCase()}, $${(block.mapCopyColorDst || "D800").toUpperCase()}` : base;
  }
  if (block.isSpriteAnimMacro) return `.sprite_anim ${block.animSpriteNum || 0}, $${(block.animFrameListAddr || "C100").toUpperCase()}, ${block.animFrameCount || 4}, $${(block.animFrameZP || "FB").toUpperCase()}`;
  if (block.isScoreBcdMacro) return `.score_bcd $${(block.scoreBcdAddr || "C200").toUpperCase()}, ${block.scoreDigits || 4}, ${block.scoreAddPoints || 100}, $${(block.scoreScreenAddr || "0400").toUpperCase()}`;
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
  loop:"LOOP", next:"NEXT", for:"FOR", endf:"ENDF", push:"PUSH", pull:"PULL",
  macro:"MACRO", endm:"ENDM", invoke:"INVOKE", call:"INVOKE",
  sprite_init:"SPRITE_INIT", sprite_pos:"SPRITE_POS", wait_raster:"WAIT_RASTER",
  joystick:"JOYSTICK", mouse:"MOUSE", sprite_col:"SPRITE_COL", turbo_set:"TURBO_SET",
  map_copy:"MAP_COPY", sprite_anim:"SPRITE_ANIM", score_bcd:"SCORE_BCD",
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
  ".macro":"define macro", ".endm":"end macro", ".invoke":"call macro", ".call":"call macro",
  ".define":"define symbol", ".if":"conditional", ".else":"else branch", ".endif":"end if",
  ".const":"constant", ".table":"lookup table", ".petscii":"PETSCII string",
  ".loadfile":"load file KERNAL", ".sprite_init":"init sprite", ".sprite_pos":"set sprite pos",
  ".wait_raster":"wait raster line", ".joystick":"joystick macro", ".mouse":"1351 mouse macro", ".sprite_col":"sprite collision",
  ".turbo_set":"U64 turbo speed",
  ".supercpu_detect":"detect SuperCPU",
  ".turbo_enable":"SuperCPU turbo on/off",
  ".reu_check":"detect REU", ".reu_stash":"C64→REU DMA", ".reu_fetch":"REU→C64 DMA", ".reu_swap":"C64↔REU DMA",
  ".region":"visual region", ".endregion":"end region",
  ".map_copy":"copy map to screen RAM", ".sprite_anim":"sprite animation frames", ".score_bcd":"BCD score update+display"
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
      _expertSetStatus(currentLanguage !== "hu" ? "Already formatted" : "Már formázott", "ok");
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
    _expertSetStatus(currentLanguage !== "hu" ? "Formatted" : "Formázva", "ok");
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
    layout.lines.forEach(line => addLayoutLabels(labels, line));
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
        "isLoadFileMacro","isExoDecrunchMacro","isReuStashMacro","isReuFetchMacro","isReuSwapMacro","isReuCheckMacro",
        "isTurboSetMacro","isTurboEnableMacro","isSuperCpuDetectMacro",
        "isMapCopyMacro","isSpriteAnimMacro","isScoreBcdMacro",
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
  const TOKEN_RE = /("(?:[^"\\]|\\.)*")|(\*\s*=)|(\.(?:text|string|rawtext|rawbytes|data|byte|word|fill|align|loop|next|push|pull|const|define|if|else|endif|region|endregion|macro|endm|invoke|call|incbin|include|sid|petscii|table|loadfile|sprite_init|sprite_pos|wait_raster|joystick|sprite_col|map_copy|sprite_anim|score_bcd)\b)|(#?\$[0-9A-Fa-f]+|#\d+\b)|(\b\d+\b)|([A-Za-z_][A-Za-z0-9_]*\s*:)|([A-Za-z_][A-Za-z0-9_]*)/gi;

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
      // \n must be INSIDE the display:block span — same rule as asm-line-highlight:
      // display:block + \n outside creates an extra blank line, desyncing the textarea.
      return `<span class="expert-err-line">${lineHtml}${nl}</span>`;
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
      else blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "BLANK", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isBlankLine: true });
      continue;
    }

    // * = $XXXX or * = decimal → ORG
    const orgM = line.match(/^\*\s*=\s*(?:\$([0-9A-Fa-f]{1,4})|(\d{1,5}))\s*$/);
    if (orgM) {
      const orgAddress = orgM[1]
        ? orgM[1].toUpperCase().padStart(4, "0")
        : parseInt(orgM[2], 10).toString(16).toUpperCase().padStart(4, "0");
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "ORG", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isOrgMacro: true, orgAddress });
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

    // .string $ADDR|label, "string" [, shift] [:macroLabel]
    const stringM = line.match(/^\.string\s+(?:\$([0-9A-Fa-f]{1,4})|([A-Za-z_][A-Za-z0-9_]*))\s*,\s*"([^"]*)"\s*(?:,\s*([0-9A-Fa-f]{1,2}))?\s*(?::([A-Za-z_][A-Za-z0-9_]*))?\s*$/i);
    if (stringM) {
      const strAddr = stringM[1] ? "$" + stringM[1].toUpperCase().padStart(4,"0") : stringM[2];
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "STRING", operand: stringM[3], rawOperand: stringM[3], description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isStringMacro: true, stringAddress: strAddr, charOffset: stringM[4] ? stringM[4].toUpperCase().padStart(2,"0") : "00", macroLabel: stringM[5] || "" });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .rawtext $ADDR|label, "string" [, shift] [:macroLabel]
    const rawtextM = line.match(/^\.rawtext\s+(?:\$([0-9A-Fa-f]{1,4})|([A-Za-z_][A-Za-z0-9_]*))\s*,\s*"([^"]*)"\s*(?:,\s*([0-9A-Fa-f]{1,2}))?\s*(?::([A-Za-z_][A-Za-z0-9_]*))?\s*$/i);
    if (rawtextM) {
      const rtAddr = rawtextM[1] ? "$" + rawtextM[1].toUpperCase().padStart(4,"0") : rawtextM[2];
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "RAWTEXT", operand: rawtextM[3], rawOperand: rawtextM[3], description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isRawTextMacro: true, rawTextAddress: rtAddr, charOffset: rawtextM[4] ? rawtextM[4].toUpperCase().padStart(2,"0") : "00", macroLabel: rawtextM[5] || "" });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .data $ADDR|label, bytes... [:macroLabel]
    const dataM = line.match(/^\.data\s+(?:\$([0-9A-Fa-f]{1,4})|([A-Za-z_][A-Za-z0-9_]*))\s*,\s*(.+?)\s*(?::([A-Za-z_][A-Za-z0-9_]*))?\s*$/i);
    if (dataM) {
      const dataAddr = dataM[1] ? "$" + dataM[1].toUpperCase().padStart(4,"0") : dataM[2];
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "DATA", operand: dataM[3].trim(), rawOperand: dataM[3].trim(), description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isDataMacro: true, dataAddress: dataAddr, macroLabel: dataM[4] || "" });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .rawbytes $ADDR|label, bytes... [:macroLabel]
    const rawbytesM = line.match(/^\.rawbytes\s+(?:\$([0-9A-Fa-f]{1,4})|([A-Za-z_][A-Za-z0-9_]*))\s*,\s*(.+?)\s*(?::([A-Za-z_][A-Za-z0-9_]*))?\s*$/i);
    if (rawbytesM) {
      const rbAddr = rawbytesM[1] ? "$" + rawbytesM[1].toUpperCase().padStart(4,"0") : rawbytesM[2];
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "RAWBYTES", operand: rawbytesM[3].trim(), rawOperand: rawbytesM[3].trim(), description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isRawBytesMacro: true, rawBytesAddress: rbAddr, macroLabel: rawbytesM[4] || "" });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .petscii $ADDR|label, "text" [, shift] [, null] [:macroLabel]
    const petsciiM = line.match(/^\.petscii\s+(?:\$([0-9A-Fa-f]{1,4})|([A-Za-z_][A-Za-z0-9_]*))\s*,\s*"([^"]*)"\s*(?:,\s*([0-9A-Fa-f]{1,2}))?(?:\s*,\s*(null))?\s*(?::([A-Za-z_][A-Za-z0-9_]*))?\s*$/i);
    if (petsciiM) {
      const peAddr = petsciiM[1] ? petsciiM[1].toUpperCase().padStart(4,"0") : petsciiM[2];
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "PETSCII", operand: petsciiM[3], rawOperand: petsciiM[3], description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isPetsciiMacro: true, petsciiAddress: peAddr, charOffset: petsciiM[4] ? petsciiM[4].toUpperCase().padStart(2,"0") : "00", petsciiNullTerminated: !!petsciiM[5], macroLabel: petsciiM[6] || "" });
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

    // .exodecrunch [depacker=$XXXX]
    const exoDecrM = line.match(/^\.exodecrunch(?:\s+depacker\s*=\s*\$?([0-9A-Fa-f]{1,4}))?\s*$/i);
    if (exoDecrM) {
      blocks.push({
        id: crypto.randomUUID(),
        category: "Makrok",
        mnemonic: "EXODECRUNCH",
        operand: "",
        rawOperand: "",
        description: "",
        addressingMode: "implied",
        base: "hex",
        validationError: "",
        collapsed: true,
        isExoDecrunchMacro: true,
        exoDepackerAddr: exoDecrM[1] ? exoDecrM[1].toUpperCase() : "B000"
      });
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
    const forM = line.match(/^\.for\s+([XY])\s*,\s*(\$?[0-9A-Fa-f]+|\d+)\s*,\s*([A-Za-z_][A-Za-z0-9_]*)\s*$/i);
    if (forM) {
      const reg = forM[1].toUpperCase();
      const countRaw = forM[2];
      const count = countRaw.startsWith("$") ? countRaw.slice(1).toUpperCase().padStart(2,"0") : parseInt(countRaw,10).toString(16).toUpperCase().padStart(2,"0");
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "FOR", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isForMacro: true, loopReg: reg, loopCount: count, loopLabel: forM[3] });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .endf label
    const endfM = line.match(/^\.endf\s+([A-Za-z_][A-Za-z0-9_]*)\s*$/i);
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

    // .map_copy $src, $dst, size[, auto, $colorDst | $colorSrc, $colorDst]
    const mcpM = line.match(/^\.map_copy\s+\$?([0-9A-Fa-f]{1,4})\s*,\s*\$?([0-9A-Fa-f]{1,4})\s*,\s*(\d+)(?:\s*,\s*(auto|\$?[0-9A-Fa-f]{1,4})\s*,\s*\$?([0-9A-Fa-f]{1,4}))?\s*$/i);
    if (mcpM) {
      const isCombined = mcpM[4] && mcpM[4].toLowerCase() === "auto";
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "MAP_COPY", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isMapCopyMacro: true, mapCopySrc: mcpM[1].toUpperCase(), mapCopyDst: mcpM[2].toUpperCase(), mapCopySize: parseInt(mcpM[3], 10), mapCopyCombined: isCombined, mapCopyColorSrc: (!isCombined && mcpM[4]) ? mcpM[4].replace(/^\$/, "").toUpperCase() : "", mapCopyColorDst: mcpM[5] ? mcpM[5].toUpperCase() : "D800" });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .sprite_anim spriteNum, $frameListAddr, frameCount, $zpByte
    const sAnimM = line.match(/^\.sprite_anim\s+(\d)\s*,\s*\$?([0-9A-Fa-f]{1,4})\s*,\s*(\d+)\s*,\s*\$?([0-9A-Fa-f]{1,2})\s*$/i);
    if (sAnimM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "SPRITE_ANIM", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isSpriteAnimMacro: true, animSpriteNum: parseInt(sAnimM[1], 10), animFrameListAddr: sAnimM[2].toUpperCase(), animFrameCount: parseInt(sAnimM[3], 10), animFrameZP: sAnimM[4].toUpperCase() });
      if (commentText) blocks.push(_importMakeComment(commentText));
      continue;
    }

    // .score_bcd $bcdAddr, digits, addPoints, $screenAddr
    const sBcdM = line.match(/^\.score_bcd\s+\$?([0-9A-Fa-f]{1,4})\s*,\s*([246])\s*,\s*(\d+)\s*,\s*\$?([0-9A-Fa-f]{1,4})\s*$/i);
    if (sBcdM) {
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "SCORE_BCD", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isScoreBcdMacro: true, scoreBcdAddr: sBcdM[1].toUpperCase(), scoreDigits: parseInt(sBcdM[2], 10), scoreAddPoints: sBcdM[3], scoreScreenAddr: sBcdM[4].toUpperCase() });
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

    // .macro name(param1, param2) or .macro name param1, param2 / .endm
    const macroM = line.match(/^\.macro\s+([A-Za-z_][A-Za-z0-9_]*)(?:\(([^)]*)\)|\s*(.*?))?\s*$/i);
    if (macroM) {
      const macroParams = (macroM[2] !== undefined ? macroM[2] : (macroM[3] || "")).trim();
      blocks.push(_importMakeMacroDefStart(macroM[1], macroParams)); if (commentText) blocks.push(_importMakeComment(commentText)); continue;
    }
    if (/^\.endm\s*$/i.test(line)) { blocks.push(_importMakeMacroDefEnd()); if (commentText) blocks.push(_importMakeComment(commentText)); continue; }

    // .invoke/.call macroname(arg1, arg2, ...) or .invoke/.call macroname arg1, arg2
    const invokeM = line.match(/^\.(invoke|call)\s+([A-Za-z_][A-Za-z0-9_]*)(?:\(([^)]*)\)|\s+(.*?))?\s*$/i);
    if (invokeM) {
      const invokeArgs = (invokeM[3] !== undefined ? invokeM[3] : (invokeM[4] || "")).trim();
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "INVOKE", operand: invokeM[2], rawOperand: invokeM[2], description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isMacroInvoke: true, invokeMacroName: invokeM[2], invokeArgs, invokeSyntax: invokeM[1].toLowerCase() });  
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
    } else if (!hasCode && !isCommentOnly) {
      // Pure empty line → blank line block (if parseExpertText emitted one)
      if (bIdx < blocks.length && blocks[bIdx].isBlankLine) {
        blocks[bIdx]._srcLine = li;
        bIdx++;
      }
    }
  }
}

// Universal "Export to blocks" helper used by SID / sprite / char / etc. editors.
// Parses asm text and appends the resulting blocks to the active program[].
// Returns the number of blocks inserted.
function exportAsmToBlocks(asmText) {
  if (!asmText) return 0;
  const newBlocks = parseExpertText(asmText);
  if (!newBlocks.length) return 0;
  const insertAt = program.length;
  for (let i = 0; i < newBlocks.length; i++) program.splice(insertAt + i, 0, newBlocks[i]);
  markTabDirty();
  parseUserMacros();
  renderProgram();
  if (expertMode) _expertSyncFromProgram();
  return newBlocks.length;
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
      } else {
        renderMnemonicDescription();
      }
      _highlightPaletteItemByMnemonic(targetMnem, "smooth");
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
        layout.lines.forEach((line) => addLayoutLabels(labels, line));
        labels._anonAddrs = _collectAnonLabels(layout);
        // Run compileLineBytes to detect unknown mnemonics / bad operands
        for (const line of layout.lines) {
          if (line.conditionallySkipped) continue;
          if (line.block.isLabel || line.block.isComment || line.block.isIncludeMacro || line.block.isBlankLine) continue;
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
        _expertSetStatus(currentLanguage !== "hu"
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
    layout.lines.forEach((line) => addLayoutLabels(labelMap, line));
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

      const block = line.block;

      // Deferred data blocks: RAWBYTES, RAWTEXT, PETSCII — no inline code; show data at target address
      if (block.isRawBytesMacro || block.isRawTextMacro || block.isPetsciiMacro) {
        let deferredBytes = [];
        let deferredAddr = 0;
        if (block.isRawBytesMacro) {
          deferredBytes = parseByteMacro(block.rawOperand, block.base);
          deferredAddr = parseAddressValue(block.rawBytesAddress, labelMap) ?? 0xC000;
        } else if (block.isRawTextMacro) {
          const rawOffset = parseInt(block.charOffset || "0", 16);
          deferredBytes = encodeTextMacro(block.rawOperand, block.textCharset || "standard")
            .map(b => (b + (isNaN(rawOffset) ? 0 : rawOffset)) & 0xFF);
          deferredAddr = parseAddressValue(block.rawTextAddress, labelMap) ?? 0xC000;
        } else if (block.isPetsciiMacro) {
          deferredBytes = encodePetsciiMacro(block.rawOperand);
          if (block.petsciiNullTerminated) deferredBytes.push(0x00);
          deferredAddr = parseAddressValue(block.petsciiAddress, labelMap) ?? 0xC000;
        }
        if (deferredBytes.length > 0) {
          const DCHUNK = 8;
          const DCOLW = DCHUNK * 3 - 1;
          const isShort = deferredBytes.length <= DCHUNK;
          for (let ci = 0; ci < deferredBytes.length; ci += DCHUNK) {
            const chunk = deferredBytes.slice(ci, ci + DCHUNK);
            const chunkAddrHex = (deferredAddr + ci).toString(16).toUpperCase().padStart(4, "0");
            const hexDump = chunk.map(b => b.toString(16).toUpperCase().padStart(2, "0")).join(" ");
            const padTo = isShort ? Math.max(hexDump.length, 8) : DCOLW;
            lines.push(
              `<span class="dsm-addr">$${chunkAddrHex}</span>  ` +
              `<span class="dsm-bytes">${hexDump.padEnd(padTo)}</span>  ` +
              `<span class="asm-tok-mnemonic">.BYTE</span>  ` +
              `<span class="asm-tok-operand">${esc(chunk.map(b => "$" + b.toString(16).toUpperCase().padStart(2, "0")).join(", "))}</span>`
            );
          }
        }
        continue;
      }

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
    el.innerHTML = `<span class="asm-tok-comment">; ${currentLanguage !== "hu" ? "Disassembly will appear here" : "A disassembler kimenet itt jelenik meg"}</span>`;
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
      const mm = line.match(/^\s*\.macro\s+([A-Za-z_][A-Za-z0-9_]*)(?:\s|\(|$)/i);
      if (mm) { macros.push({ _textName: mm[1].trim(), _lineIdx: idx }); return; }
      const lm = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(?:;.*)?$/);
      if (lm) { labels.push({ _textName: lm[1].trim(), _lineIdx: idx }); return; }
      // Inline macro label suffix — e.g. .petscii $0C00, "...", null :bbb
      const ilm = line.match(/:([A-Za-z_][A-Za-z0-9_]*)\s*(?:;.*)?$/);
      if (ilm && /^\s*\.(petscii|string|rawtext|rawbytes|data|table|incbin|byte|fill|word)\b/i.test(line)) {
        labels.push({ _textName: ilm[1].trim(), _lineIdx: idx });
      }
    });
  } else {
    regions = program.filter(b => b.isRegionMacro && b.regionName);
    macros  = program.filter(b => b.isMacroDefStart && b.macroName);
    labels  = program.filter(b => b.isLabel && b.labelName);
    // Also include macro-label suffixes (:bbb) from data macros
    program.forEach(b => {
      if (b.macroLabel && b.macroLabel.trim()) {
        labels.push({ ...b, labelName: b.macroLabel.trim() });
      }
    });
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
    // Include macro definitions from ALL included files (both inline and fixed-address libraries)
    // so INVOKE can find macros regardless of where they were defined
    if (block.isIncludeMacro && block.includedBlocks?.length) {
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
      const macroParamsDef = allBlocks[macroStart].macroParams || "";
      const paramsArray = macroParamsDef.split(",").map(s => s.trim()).filter(Boolean);
      userMacros[macroName] = { params: paramsArray, body: macroBody };
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
        block.validationError = currentLanguage !== "hu" ? "No macros defined yet" : "Meg nincs definialva makro";
      } else {
        block.validationError = currentLanguage !== "hu" ? `Macro not found: ${name}` : `Makro nem talalhato: ${name}`;
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
    block.validationError = userMacros[value] ? "" : (currentLanguage !== "hu" ? "Macro not found" : "Makro nem talalhato");
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
      if (field === "petsciiNullTerminated") {
        renderBlockPreview(index);
        renderAsmOutput();
        return;
      }
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
      (port !== 1 && port !== 2) ? (currentLanguage !== "hu" ? "Port must be 1 or 2." : "A port 1 vagy 2 lehet.") :
      (isNaN(num) || num < 0 || num > 7) ? (currentLanguage !== "hu" ? "Sprite number must be 0–7." : "A sprite szama 0 es 7 kozott lehet.") :
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
      (port !== 1 && port !== 2) ? (currentLanguage !== "hu" ? "Port must be 1 or 2." : "A port 1 vagy 2 lehet.") :
      (isNaN(num) || num < 0 || num > 7) ? (currentLanguage !== "hu" ? "Sprite number must be 0–7." : "A sprite szama 0 es 7 kozott lehet.") :
      (!/^[0-9A-Fa-f]{1,2}$/.test(zpX)) ? (currentLanguage !== "hu" ? "ZP X must be a hex byte (00–FF)." : "ZP X 1 hex byte legyen (00–FF).") :
      (!/^[0-9A-Fa-f]{1,2}$/.test(zpY)) ? (currentLanguage !== "hu" ? "ZP Y must be a hex byte (00–FF)." : "ZP Y 1 hex byte legyen (00–FF).") :
      "";
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isSpriteColMacro && (field === "spriteNum" || field === "colType")) {
    const num = parseInt(field === "spriteNum" ? value : block.spriteNum, 10);
    block.validationError = (isNaN(num) || num < 0 || num > 7)
      ? (currentLanguage !== "hu" ? "Sprite number must be 0–7." : "A sprite szama 0 es 7 kozott lehet.")
      : "";
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isMapCopyMacro) {
    const src = parseInt((block.mapCopySrc || "C000"), 16);
    const dst = parseInt((block.mapCopyDst || "0400"), 16);
    const sz = block.mapCopySize || 1000;
    block.validationError =
      (isNaN(src) || src < 0 || src > 0xFFFF) ? (currentLanguage !== "hu" ? "Invalid source address." : "Ervenytelen forras cim.") :
      (isNaN(dst) || dst < 0 || dst > 0xFFFF) ? (currentLanguage !== "hu" ? "Invalid destination address." : "Ervenytelen cel cim.") :
      (sz < 1 || sz > 65000) ? (currentLanguage !== "hu" ? "Size must be 1–65000." : "Meret 1 es 65000 kozott legyen.") : "";
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isSpriteAnimMacro) {
    const num = parseInt(block.animSpriteNum || "0", 10);
    const count = parseInt(block.animFrameCount || "4", 10);
    const zp = parseInt((block.animFrameZP || "FB"), 16);
    const listAddr = parseInt((block.animFrameListAddr || "C100"), 16);
    block.validationError =
      (isNaN(num) || num < 0 || num > 7) ? (currentLanguage !== "hu" ? "Sprite number must be 0–7." : "A sprite szama 0 es 7 kozott lehet.") :
      (isNaN(count) || count < 1 || count > 255) ? (currentLanguage !== "hu" ? "Frame count must be 1–255." : "Frame szam 1 es 255 kozott legyen.") :
      (isNaN(zp) || zp > 0xFF) ? (currentLanguage !== "hu" ? "ZP must be $00–$FF." : "ZP $00-$FF kozott legyen.") :
      (isNaN(listAddr) || listAddr > 0xFFFF) ? (currentLanguage !== "hu" ? "Invalid frame list address." : "Ervenytelen frame lista cim.") : "";
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isScoreBcdMacro) {
    const addr = parseInt((block.scoreBcdAddr || "C200"), 16);
    const scr = parseInt((block.scoreScreenAddr || "0400"), 16);
    const pts = parseInt(block.scoreAddPoints || "100", 10);
    block.validationError =
      (isNaN(addr) || addr > 0xFFFF) ? (currentLanguage !== "hu" ? "Invalid BCD address." : "Ervenytelen BCD cim.") :
      (isNaN(scr) || scr > 0xFFFF) ? (currentLanguage !== "hu" ? "Invalid screen address." : "Ervenytelen screen cim.") :
      (isNaN(pts) || pts < 0) ? (currentLanguage !== "hu" ? "Add value must be >= 0." : "Hozzaadando ertek >= 0 legyen.") : "";
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isWaitRasterMacro && field === "rasterLine") {
    const v = value.replace(/^\$/, "");
    const parsed = parseInt(v, 16);
    block.validationError = (isNaN(parsed) || parsed < 0 || parsed > 255)
      ? (currentLanguage !== "hu" ? "Raster line must be a hex byte ($00–$FF)." : "A rasztersor 1 hex byte legyen ($00-$FF).")
      : "";
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isTurboSetMacro && (field === "turboSpeed" || field === "turboBadline")) {
    const spd = parseInt(block.turboSpeed || "7", 10);
    block.validationError = (isNaN(spd) || spd < 0 || spd > 15)
      ? (currentLanguage !== "hu" ? "Turbo speed must be 0–15." : "A turbo sebesseg 0 es 15 kozott lehet.")
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

  if (block.isExoDecrunchMacro && field === "exoDepackerAddr") {
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
      block.validationError = currentLanguage !== "hu" ? "C64 address must be $0000–$FFFF." : "A C64 cim $0000-$FFFF kozott lehet.";
    } else if (isNaN(expAddr) || expAddr < 0 || expAddr > 0xFFFF) {
      block.validationError = currentLanguage !== "hu" ? "REU address must be $0000–$FFFF." : "A REU cim $0000-$FFFF kozott lehet.";
    } else if (isNaN(bankVal) || bankVal < 0 || bankVal > 7) {
      block.validationError = currentLanguage !== "hu" ? "REU bank must be 0–7." : "A REU bank 0-7 lehet.";
    } else if (isNaN(length) || length < 1 || length > 0xFFFF) {
      block.validationError = currentLanguage !== "hu" ? "Length must be $0001–$FFFF." : "A hossz $0001-$FFFF kozott lehet.";
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
    parseUserMacros();
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isMacroDefStart && field === "macroParams") {
    block.macroParams = value;
    parseUserMacros();
    renderBlockPreview(index);
    renderAsmOutput();
    return;
  }

  if (block.isMacroInvoke && field === "invokeArgs") {
    block.invokeArgs = value;
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
    return { operand: "", text: currentLanguage !== "hu" ? "no operand" : "operandus nelkul", error: "" };
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
    return { operand: "", text: currentLanguage !== "hu" ? "missing operand" : "hianyzo operandus", error: currentLanguage !== "hu" ? "This addressing mode requires an operand." : "Ehhez a cimzesi modhoz operandus kell." };
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
    return currentLanguage !== "hu" ? "TEXT macro X and Y must be whole numbers." : "A TEXT makro X es Y erteke csak egesz szam lehet.";
  }

  if (x < 0 || x > 39) {
    return currentLanguage !== "hu" ? "TEXT macro X must be between 0 and 39." : "A TEXT makro X erteke 0 es 39 kozott lehet.";
  }

  if (y < 0 || y > 24) {
    return currentLanguage !== "hu" ? "TEXT macro Y must be between 0 and 24." : "A TEXT makro Y erteke 0 es 24 kozott lehet.";
  }

  if ((x + Math.max(0, (text || "").length - 1)) > 39) {
    return currentLanguage !== "hu" ? "TEXT macro would run past the right edge of the row." : "A TEXT makro szovege kifutna a sor jobb szelere.";
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
    return currentLanguage !== "hu" ? "BYTE macro needs at least one byte." : "A BYTE makrohoz legalabb egy byte kell.";
  }

  const parts = trimmed.split(",").map((part) => part.trim()).filter(Boolean);
  if (!parts.length) {
    return currentLanguage !== "hu" ? "BYTE macro needs at least one byte." : "A BYTE makrohoz legalabb egy byte kell.";
  }

  for (const part of parts) {
    const validBinary = /^%[01]+$/.test(part);
    const validHexPrefixed = /^\$[0-9A-Fa-f]+$/.test(part) || /^0x[0-9A-Fa-f]+$/i.test(part);
    const validBare = base === "bin" ? /^[01]+$/.test(part) : (base === "hex" ? /^[0-9A-Fa-f]+$/.test(part) : /^\d+$/.test(part));
    if (!validBinary && !validHexPrefixed && !validBare) {
      return base === "bin"
        ? (currentLanguage !== "hu" ? "In binary mode use only 0 and 1 separated by commas, optionally with % prefix." : "Binaris modban csak 0-kat es 1-eseket hasznalj, opcionis % elotaggal.")
        : base === "hex"
          ? (currentLanguage !== "hu" ? "BYTE macro only accepts hex bytes separated by commas, for example FF,00,8D." : "A BYTE makroban csak hex byte-ok lehetnek, peldaul FF,00,8D.")
          : (currentLanguage !== "hu" ? "BYTE macro only accepts decimal or hex bytes separated by commas." : "A BYTE makroban csak decimalis vagy hex byte-ok lehetnek, vesszovel elvalasztva.");
    }

    const value = validBinary
      ? Number.parseInt(part.slice(1), 2)
      : validHexPrefixed
        ? Number.parseInt(part.replace(/^\$/, "").replace(/^0x/i, ""), 16)
        : Number.parseInt(part, base === "bin" ? 2 : (base === "hex" ? 16 : 10));

    if (value < 0 || value > 255) {
      return currentLanguage !== "hu" ? "Every BYTE macro element must be a byte between 0 and 255." : "A BYTE makro minden eleme 0 es 255 kozotti byte kell legyen.";
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
    return currentLanguage !== "hu" ? "WORD macro needs at least one 16-bit value." : "A WORD makrohoz legalabb egy 16-bites ertek kell.";
  }

  const parts = trimmed.split(",").map((part) => part.trim()).filter(Boolean);
  if (!parts.length) {
    return currentLanguage !== "hu" ? "WORD macro needs at least one 16-bit value." : "A WORD makrohoz legalabb egy 16-bites ertek kell.";
  }

  for (const part of parts) {
    const validHexPrefixed = /^\$[0-9A-Fa-f]+$/.test(part) || /^0x[0-9A-Fa-f]+$/i.test(part);
    const validBare = base === "hex" ? /^[0-9A-Fa-f]+$/.test(part) : /^\d+$/.test(part);
    if (!validHexPrefixed && !validBare) {
      return base === "hex"
        ? (currentLanguage !== "hu" ? "WORD macro only accepts hex values separated by commas." : "A WORD makroban csak hex ertekek lehetnek, vesszovel elvalasztva.")
        : (currentLanguage !== "hu" ? "WORD macro only accepts decimal or hex values separated by commas." : "A WORD makroban csak decimalis vagy hex ertekek lehetnek, vesszovel elvalasztva.");
    }

    const value = validHexPrefixed
      ? Number.parseInt(part.replace(/^\$/, "").replace(/^0x/i, ""), 16)
      : Number.parseInt(part, base === "hex" ? 16 : 10);

    if (value < 0 || value > 65535) {
      return currentLanguage !== "hu" ? "Every WORD macro element must be between 0 and 65535." : "A WORD makro minden eleme 0 es 65535 kozotti kell legyen.";
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
    return currentLanguage !== "hu" ? "FILL macro needs count and value (e.g., FILL 256,$00)." : "A FILL makrohoz darabszam es ertek kell (pl. FILL 256,$00).";
  }

  const parts = trimmed.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length !== 2) {
    return currentLanguage !== "hu" ? "FILL macro needs exactly two parameters: count,value." : "A FILL makrohoz pontosan ket parameter kell: darabszam,ertek.";
  }

  const parsed = parseFillMacro(raw, base);
  if (!parsed) {
    return currentLanguage !== "hu" ? "FILL macro parameters are invalid." : "A FILL makro parameterei ervenytelenek.";
  }

  if (isNaN(parsed.count) || parsed.count < 1 || parsed.count > 65536) {
    return currentLanguage !== "hu" ? "FILL count must be between 1 and 65536." : "A FILL darabszam 1 es 65536 kozott kell legyen.";
  }

  if (isNaN(parsed.value) || parsed.value < 0 || parsed.value > 255) {
    return currentLanguage !== "hu" ? "FILL value must be a byte between 0 and 255." : "A FILL ertek 0 es 255 kozotti byte kell legyen.";
  }

  return "";
}

function validateAlignMacro(raw, base = "hex") {
  const trimmed = raw.trim();
  if (!trimmed) {
    return currentLanguage !== "hu" ? "ALIGN macro needs a boundary value (e.g., 64, 256, $2000)." : "Az ALIGN makrohoz hatar ertek kell (pl. 64, 256, $2000).";
  }

  const parsed = parseNumberByBase(trimmed.replace(/^\$/, ""), base);
  if (parsed === null || isNaN(parsed)) {
    return currentLanguage !== "hu" ? "ALIGN boundary must be a valid number." : "Az ALIGN hatar ervenyes szam kell legyen.";
  }

  if (parsed < 1 || parsed > 65536) {
    return currentLanguage !== "hu" ? "ALIGN boundary must be between 1 and 65536." : "Az ALIGN hatar 1 es 65536 kozott kell legyen.";
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
    return currentLanguage !== "hu" ? "TABLE macro needs a label name." : "A TABLE makrohoz cimke nev kell.";
  }

  const value = parseAddressValue(address);
  if (value === null) {
    return currentLanguage !== "hu" ? "TABLE macro needs a valid start address, for example $C000." : "A TABLE makrohoz ervenyes kezdocim kell, peldaul $C000.";
  }

  if (value < 0 || value > 0xFFFF) {
    return currentLanguage !== "hu" ? "TABLE macro address must be between 0 and 65535." : "A TABLE makro cime 0 es 65535 kozott lehet.";
  }

  return "";
}

function validateSpriteInitMacro(spriteNum, spriteColor, spriteDataPage) {
  const num = parseInt(spriteNum, 10);
  if (isNaN(num) || num < 0 || num > 7) {
    return currentLanguage !== "hu" ? "Sprite number must be 0–7." : "A sprite szama 0 es 7 kozott lehet.";
  }
  const color = parseInt(spriteColor, 10);
  if (isNaN(color) || color < 0 || color > 15) {
    return currentLanguage !== "hu" ? "Color must be 0–15." : "A szin erteke 0 es 15 kozott lehet.";
  }
  const pageStr = (spriteDataPage || "").replace(/^\$/, "");
  const page = parseInt(pageStr, 16);
  if (isNaN(page) || page < 0 || page > 255) {
    return currentLanguage !== "hu" ? "Data page must be a hex byte ($00–$FF), e.g. $21 for $0840." : "Az adatlap 1 hex byte legyen ($00-$FF), pl. $21 = $0840.";
  }
  return "";
}

function validateSpritePosMacro(spriteNum, spriteX, spriteY) {
  const num = parseInt(spriteNum, 10);
  if (isNaN(num) || num < 0 || num > 7) {
    return currentLanguage !== "hu" ? "Sprite number must be 0–7." : "A sprite szama 0 es 7 kozott lehet.";
  }
  const x = parseInt(spriteX, 10);
  if (isNaN(x) || x < 0 || x > 319) {
    return currentLanguage !== "hu" ? "X must be 0–319." : "Az X erteke 0 es 319 kozott lehet.";
  }
  const y = parseInt(spriteY, 10);
  if (isNaN(y) || y < 0 || y > 255) {
    return currentLanguage !== "hu" ? "Y must be 0–255." : "Az Y erteke 0 es 255 kozott lehet.";
  }
  return "";
}

function validateDefineMacro(symbols) {
  if (!symbols || !symbols.trim()) {
    return currentLanguage !== "hu" ? "DEFINE needs at least one symbol (e.g., DEBUG or DEBUG, PAL)." : "A DEFINE-hoz legalabb egy szimbolum kell (pl. DEBUG vagy DEBUG, PAL).";
  }
  const parts = symbols.split(",").map(s => s.trim()).filter(Boolean);
  const invalid = parts.find(p => !/^[A-Za-z_][A-Za-z0-9_]*$/.test(p));
  if (invalid) {
    return currentLanguage !== "hu" ? `"${invalid}" is not a valid identifier.` : `"${invalid}" nem ervenyes azonosito.`;
  }
  return "";
}

function validateConstMacro(name, value, base) {
  if (!name || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
    return currentLanguage !== "hu" ? "CONST name must be a valid identifier (e.g., SCORE_ADDR)." : "A CONST neve ervenyes azonosito kell legyen (pl. SCORE_ADDR).";
  }
  const numericValue = parseNumberByBase((value || "").replace(/^\$/, ""), base);
  if (numericValue === null || numericValue < 0 || numericValue > 65535) {
    return currentLanguage !== "hu" ? "CONST value must be a number between 0 and 65535." : "A CONST erteke 0 es 65535 kozott kell legyen.";
  }
  return "";
}

function validateIfMacro(condition) {
  if (!condition || !condition.trim()) {
    return currentLanguage !== "hu" ? "IF macro needs a condition (e.g., DEBUG)." : "Az IF makrohoz feltetel kell (pl. DEBUG).";
  }

  // Simple validation - just check it's a valid identifier
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(condition.trim())) {
    return currentLanguage !== "hu" ? "IF condition must be a valid identifier." : "Az IF feltetelnek ervenyes azonositonak kell lennie.";
  }

  return "";
}

function parseAddressValue(raw, labelMap) {
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

  // Label identifier — look up in label map if provided (must come AFTER all numeric checks)
  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(trimmed)) {
    if (labelMap) {
      const v = labelMap.get(trimmed);
      return v !== undefined ? v : null;
    }
    return null;
  }

  return null;
}

function validateIncBinMacro(incBinBytes, rawAddress) {
  const value = parseAddressValue(rawAddress);
  if (value === null) {
    return currentLanguage !== "hu" ? "INCBIN macro needs a valid start address, for example $C000." : "Az INCBIN makrohoz ervenyes kezdocim kell, peldaul $C000.";
  }
  if (value < 0 || value > 0xFFFF) {
    return currentLanguage !== "hu" ? "INCBIN macro address must be between 0 and 65535." : "Az INCBIN makro cime 0 es 65535 kozott lehet.";
  }
  return "";
}

function validateStringMacroAddress(raw) {
  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test((raw || "").trim())) return ""; // label identifier — resolved at assembly time
  const value = parseAddressValue(raw);
  if (value === null) {
    return currentLanguage !== "hu" ? "STRING macro needs a valid start address, for example $C000." : "A STRING makrohoz ervenyes kezdocim kell, peldaul $C000.";
  }

  if (value < 0 || value > 0xFFFF) {
    return currentLanguage !== "hu" ? "STRING macro address must be between 0 and 65535." : "A STRING makro cime 0 es 65535 kozott lehet.";
  }

  return "";
}

function validateTextWithOffset(rawOperand, charOffset) {
  const offset = parseInt(charOffset || "0", 16);
  if (isNaN(offset) || offset < 0 || offset > 255) {
    return currentLanguage !== "hu" ? "+Byte offset must be a hex value between 00 and FF." : "A +Byte offset 00 es FF kozotti hex ertek lehet.";
  }
  if (offset === 0) return "";
  const chars = encodeTextMacro(rawOperand);
  const overflow = chars.find(c => (c + offset) > 255);
  if (overflow !== undefined) {
    return currentLanguage !== "hu"
      ? `+Byte offset $${offset.toString(16).toUpperCase().padStart(2,"0")} causes overflow (char code $${overflow.toString(16).toUpperCase().padStart(2,"0")} + offset > $FF).`
      : `A +Byte offset $${offset.toString(16).toUpperCase().padStart(2,"0")} tulcsordulast okoz (karakter kod $${overflow.toString(16).toUpperCase().padStart(2,"0")} + offset > $FF).`;
  }
  return "";
}

function validateDataMacro(rawBytes, rawAddress, base = "dec") {
  const byteError = validateByteMacro(rawBytes, base);
  if (byteError) return byteError;

  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test((rawAddress || "").trim())) return ""; // label identifier — resolved at assembly time
  const value = parseAddressValue(rawAddress);
  if (value === null) {
    return currentLanguage !== "hu" ? "DATA macro needs a valid start address, for example $C000." : "A DATA makrohoz ervenyes kezdocim kell, peldaul $C000.";
  }

  if (value < 0 || value > 0xFFFF) {
    return currentLanguage !== "hu" ? "DATA macro address must be between 0 and 65535." : "A DATA makro cime 0 es 65535 kozott lehet.";
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
    return currentLanguage !== "hu" ? "Only whole numbers are supported." : "Csak egesz szam tamogatott.";
  }

  if (modeKey === "immediate" || modeKey === "zeroPage" || modeKey === "zeroPageX" || modeKey === "indirectX" || modeKey === "indirectY" || modeKey === "zeroPageY") {
    return value < 0 || value > 255 ? (currentLanguage !== "hu" ? "This mode expects a value between 0 and 255." : "Ez a mod 0 es 255 kozotti erteket var.") : "";
  }

  if (modeKey === "absolute" || modeKey === "absoluteX" || modeKey === "absoluteY" || modeKey === "indirect") {
    return value < 0 || value > 65535 ? (currentLanguage !== "hu" ? "Absolute addressing requires a value between 0 and 65535." : "Absolute cimzesnel 0 es 65535 kozotti ertek kell.") : "";
  }

  if (modeKey === "relative") {
    return value < -128 || value > 65535 ? (currentLanguage !== "hu" ? "Relative/label mode needs a label or a sensible address/offset." : "Relative/label modban label vagy esszeru cim/offset kell.") : "";
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

async function loadExomizerConfig() {
  if (!window.electronAPI?.getExomizerConfig) {
    updateExomizerPathPreview("");
    return;
  }

  const config = await window.electronAPI.getExomizerConfig();
  updateExomizerPathPreview(config?.exomizerPath || "");
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
    vicePathInput.placeholder = currentLanguage !== "hu" ? "VICE not configured" : "Nincs beallitva";
  }
}

function updateExomizerPathPreview(nextPath) {
  exomizerPath = nextPath || "";
  if (exomizerPathInput) {
    let displayPath = exomizerPath;
    if (displayPath.length > 50) {
      const parts = displayPath.replace(/\\/g, "/").split("/");
      if (parts.length > 3) {
        displayPath = `.../${parts.slice(-2).join("/")}`;
      }
    }
    exomizerPathInput.value = displayPath;
    exomizerPathInput.title = exomizerPath;
    exomizerPathInput.placeholder = currentLanguage !== "hu" ? "Exomizer not configured" : "Nincs beallitva";
  }
  if (exomizerStatus) {
    exomizerStatus.textContent = exomizerPath
      ? tf("exomizerStatusReady", { path: exomizerPath })
      : t("exomizerStatusPending");
  }
}

async function chooseViceExecutable() {
  if (!window.electronAPI?.chooseViceExecutable) {
    if (emulatorStatus) {
      emulatorStatus.textContent = currentLanguage !== "hu"
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

async function chooseExomizerExecutable() {
  if (!window.electronAPI?.chooseExomizerExecutable) {
    if (exomizerStatus) {
      exomizerStatus.textContent = currentLanguage !== "hu"
        ? "Exomizer selection is only available in the desktop app."
        : "Az Exomizer kivalasztasa csak a desktop appban erheto el.";
    }
    return;
  }

  const result = await window.electronAPI.chooseExomizerExecutable();
  if (result?.canceled) {
    return;
  }

  updateExomizerPathPreview(result?.exomizerPath || "");
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
    showViceToast(currentLanguage !== "hu" ? "Nothing to run — add some instructions first." : "Nincs mit futtatni — adj hozzá utasításokat.", true);
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
      if (line.block._autoBufferLabel) {
        symbols.push({ name: line.block._autoBufferLabel, address: line.address });
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
    emulatorStatus.textContent = currentLanguage !== "hu"
      ? "VICE launching is available only inside the Electron desktop app."
      : "A VICE inditasa csak az Electron desktop appban erheto el.";
    return;
  }

  emulatorStatus.textContent = vicePath
    ? (currentLanguage !== "hu"
      ? `VICE is ready. Executable: ${vicePath}`
      : `A VICE keszen all. Exe: ${vicePath}`)
    : (currentLanguage !== "hu"
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
      theme: document.documentElement.dataset.theme || "light",
      runMode: runMode
    },
    d64: {
      diskName: d64ExportState.diskName,
      progName: d64ExportState.progName,
      extras: (d64ExportState.extras.length > 0
        ? d64ExportState.extras
        : (d64ExportState._pendingExtras || [])
      ).map(e => ({ name: e.name, sourcePath: e.sourcePath, loadAddress: e.loadAddress || "", decompressAddress: e.decompressAddress || "", crunch: e.crunch || false }))
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
    const sepIdx = err.indexOf(" \u2014 ");
    let html;
    if (sepIdx !== -1) {
      const prefix = err.slice(0, sepIdx).replace(/</g, "&lt;");
      const msg = err.slice(sepIdx + 3).replace(/</g, "&lt;");
      html = `${prefix} <span class="compile-error-msg">\u2014 ${msg}</span>`;
    } else {
      html = `<span class="compile-error-msg">${err.replace(/</g, "&lt;")}</span>`;
    }
    return `<li data-index="${idx}" data-asm-line="${asmLine ?? ""}">${html}</li>`;
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

async function showWorkProgress(messageKey, opts = {}) {
  if (!workProgressDialog) return;
  if (workProgressTimer) {
    clearInterval(workProgressTimer);
    workProgressTimer = null;
  }

  const indeterminate = !!opts.indeterminate;

  if (workProgressTitle) workProgressTitle.textContent = t("workProgressTitle");
  if (workProgressSubtitle) workProgressSubtitle.textContent = t(messageKey);

  if (indeterminate) {
    workProgressValue = 0;
    if (workProgressBar) {
      workProgressBar.style.width = "";
      workProgressBar.classList.add("work-progress-bar--indeterminate");
    }
  } else {
    workProgressValue = 10;
    if (workProgressBar) {
      workProgressBar.classList.remove("work-progress-bar--indeterminate");
      workProgressBar.style.width = `${workProgressValue}%`;
    }
  }

  if (!workProgressDialog.open) workProgressDialog.showModal();

  if (indeterminate) return;

  await new Promise(resolve => window.requestAnimationFrame(() => resolve()));

  workProgressTimer = window.setInterval(() => {
    workProgressValue = Math.min(92, workProgressValue + 3);
    if (workProgressBar) workProgressBar.style.width = `${workProgressValue}%`;
  }, 120);
}

function setWorkProgress(value) {
  workProgressValue = Math.max(0, Math.min(100, value));
  if (workProgressBar) {
    workProgressBar.classList.remove("work-progress-bar--indeterminate");
    workProgressBar.style.width = `${workProgressValue}%`;
  }
}

function hideWorkProgress() {
  if (!workProgressDialog) return;
  if (workProgressTimer) {
    clearInterval(workProgressTimer);
    workProgressTimer = null;
  }
  if (workProgressBar) {
    workProgressBar.classList.remove("work-progress-bar--indeterminate");
    workProgressBar.style.width = "";
  }
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
  if (workProgressBar) {
    workProgressBar.classList.remove("work-progress-bar--indeterminate");
    workProgressBar.style.width = "100%";
  }
  await new Promise(resolve => setTimeout(resolve, delayMs));
  if (workProgressDialog.open) {
    workProgressDialog.close();
  }
}

async function savePrgToFile() {
  const prg = await buildRunPrgForCurrentMode();
  if (!prg.ok) {
    if (prg.errors?.length) { showCompileErrorDialog(prg.errors); return; }
    if (prg.error) { showViceToast(prg.error, true); return; }
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
  const prg = await buildRunPrgForCurrentMode();
  if (!prg.ok) {
    if (prg.errors?.length) { showCompileErrorDialog(prg.errors); return; }
    if (prg.error) { showViceToast(prg.error, true); return; }
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
  extras: [],  // [{ name: string, sourcePath: string, bytes: number[], loadAddress: string, crunch: bool }]
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
  const meta = d64ExportState.extras.map(e => ({ name: e.name, sourcePath: e.sourcePath, loadAddress: e.loadAddress, decompressAddress: e.decompressAddress || "", crunch: e.crunch || false }));
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
      if (r?.ok && r.bytes) restored.push({ name: meta.name, sourcePath: resolvedPath, loadAddress: meta.loadAddress || "", decompressAddress: meta.decompressAddress || "", crunch: meta.crunch || false, bytes: r.bytes });
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
        <input type="text" maxlength="5" class="d64-extra-addr" value="${escapeHtmlAttribute(entry.loadAddress || "")}" placeholder="${t("d64ExtraAddrPlaceholder")}" title="${t("d64ExtraAddrTooltip")}">
        <input type="text" maxlength="5" class="d64-extra-decomp" value="${escapeHtmlAttribute(entry.decompressAddress || "")}" placeholder="${t("d64ExtraDecompPlaceholder")}" title="${t("d64ExtraDecompTooltip")}">
        <label class="d64-extra-crunch" title="${t("d64ExtraCrunchTooltip")}">
          <input type="checkbox" class="d64-extra-crunch-cb"${entry.crunch ? " checked" : ""}>
          <span>Exomizer</span>
        </label>
        <button type="button" class="d64-export-extra-remove" title="${t("d64ExtraRemove")}"><svg viewBox="0 0 16 16" fill="none" width="13" height="13" aria-hidden="true"><path d="M3 5h10M6 5V3.5A.5.5 0 016.5 3h3a.5.5 0 01.5.5V5M7 8v4M9 8v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><rect x="4" y="5" width="8" height="9" rx="1" stroke="currentColor" stroke-width="1.2"/></svg></button>
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

    item.querySelector(".d64-extra-decomp").addEventListener("input", (event) => {
      const cleaned = event.target.value.replace(/^\$/, "").replace(/[^0-9A-Fa-f]/g, "").slice(0, 4);
      d64ExportState.extras[idx].decompressAddress = cleaned;
      event.target.value = cleaned;
    });

    item.querySelector(".d64-extra-crunch-cb").addEventListener("change", (event) => {
      d64ExportState.extras[idx].crunch = event.target.checked;
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
    loadAddress: "",  // empty = save raw, no load addr prepended
    crunch: false
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
    if (extra.crunch && loadAddr === null) {
      if (errorBox) { errorBox.hidden = false; errorBox.textContent = tf("d64ErrorCrunchNeedsAddr", { name: extra.name }); }
      return;
    }
    files.push({
      name: extra.name.toLowerCase(),
      bytes: Array.from(extra.bytes),
      loadAddress: loadAddr,
      _crunch: extra.crunch || false,
      _decompressAddress: (extra.decompressAddress || "").trim()
    });
  }

  // Disable buttons during the async backend call
  const confirmBtn = document.getElementById("d64-export-confirm");
  const cancelBtn = document.getElementById("d64-export-cancel");
  if (confirmBtn) confirmBtn.disabled = true;
  if (cancelBtn) cancelBtn.disabled = true;

  const isRunMode = d64ExportState.runMode;
  const isUltimateMode = isRunMode === "ultimate";

  // If any extra needs EXO crunching, the loop below blocks on `exomizer`
  // for several seconds per file. Show the work-progress modal up front so
  // the user gets immediate feedback instead of an unresponsive dialog.
  const willCrunchAny = files.some((f, i) => i > 0 && f._crunch);
  if (willCrunchAny) {
    await showWorkProgress("workProgressExomizerCompress", { indeterminate: true });
    // Force one layout + paint cycle so the modal is actually on-screen
    // before we start the multi-second synchronous-looking IPC chain.
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }

  // Compress extras that have EXO checked
  for (let i = 1; i < files.length; i++) {
    const f = files[i];
    const needsCrunch = f._crunch;
    delete f._crunch;
    if (!needsCrunch) continue;
    let crunchResult;
    try {
      if (f.loadAddress === 0x0801) {
        // sfx sys: self-extracting PRG, load address header prepended for Exomizer
        const prgForExo = [f.loadAddress & 0xFF, (f.loadAddress >> 8) & 0xFF, ...f.bytes];
        crunchResult = await window.electronAPI.buildExomizerPrg({ bytes: prgForExo, fileName: f.name + ".prg" });
        if (crunchResult?.ok) {
          f.bytes = Array.from(crunchResult.bytes);
          f.loadAddress = null; // output already has its own load address header
        }
      } else {
        // mem mode: exomizer prepends a 2-byte load address header and embeds the
        // decompression target into the stream. Output is a complete PRG, so we
        // clear f.loadAddress so the D64 builder doesn't double-prepend.
        const loadHex = (typeof f.loadAddress === "number") ? f.loadAddress.toString(16).toUpperCase().padStart(4, "0") : null;
        const decompHex = f._decompressAddress ? f._decompressAddress.replace(/^\$/, "").toUpperCase().padStart(4, "0") : null;
        crunchResult = await window.electronAPI.buildExomizerRaw({
          bytes: f.bytes,
          fileName: f.name + ".bin",
          targetAddress: loadHex,
          decompressAddress: decompHex
        });
        if (crunchResult?.ok) {
          f.bytes = Array.from(crunchResult.bytes);
          f.loadAddress = null; // PRG header is already in the bytes
        }
      }
    } catch (_) { crunchResult = null; }
    delete f._decompressAddress;
    if (!crunchResult?.ok) {
      if (willCrunchAny) hideWorkProgress();
      if (confirmBtn) { confirmBtn.disabled = false; confirmBtn.textContent = t(isUltimateMode ? "runOnUltimate" : isRunMode ? "runViaD64Confirm" : "d64ExportConfirm"); }
      if (cancelBtn) cancelBtn.disabled = false;
      if (errorBox) { errorBox.hidden = false; errorBox.textContent = `${f.name}: ${crunchResult?.error || t("exomizerLaunchFailed")}`; }
      return;
    }
  }

  // Switch the progress modal's subtitle to the D64 packaging message. If we
  // didn't open it during compression and we're in run mode, open it now.
  if (isRunMode) {
    await showWorkProgress(isUltimateMode ? "workProgressRunD64Ultimate" : "workProgressRunD64");
  } else if (willCrunchAny) {
    // Save-only mode: progress modal is up but the EXO loop is done — close it
    // so the OS save dialog (if any) isn't blocked behind it.
    hideWorkProgress();
  }

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

function getRunModeLabel(mode) {
  if (mode === "d64") return t("runViaD64");
  if (mode === "ultimate") return t("runOnUltimate");
  if (mode === "ultimate-d64") return t("runD64OnHardware");
  return t("runInEmulator");
}

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
  const runLabel = getRunModeLabel(mode);
  if (label) label.textContent = runLabel;
  if (runEmulatorButton) {
    runEmulatorButton.setAttribute("title", runLabel);
    runEmulatorButton.setAttribute("aria-label", runLabel);
  }
}

async function runViaD64() {
  if (isProgramEmpty()) {
    showViceToast(currentLanguage !== "hu" ? "Nothing to run — add some instructions first." : "Nincs mit futtatni — adj hozzá utasításokat.", true);
    return;
  }
  if (!vicePath) {
    showViceToast(currentLanguage !== "hu" ? "VICE is not configured. Select it in the menu first." : "A VICE nincs beallitva. Valaszd ki a menuben.", true);
    return;
  }
  if (!window.electronAPI?.runD64) {
    showViceToast(currentLanguage !== "hu" ? "D64 run is not available." : "A D64 futtatás nem elerheto.", true);
    return;
  }

  const prg = await buildRunPrgForCurrentMode();
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

async function runViaExomizer() {
  if (isProgramEmpty()) {
    showViceToast(currentLanguage !== "hu" ? "Nothing to run — add some instructions first." : "Nincs mit futtatni — adj hozzá utasításokat.", true);
    return;
  }
  if (!exomizerPath) {
    showViceToast(t("exomizerNotConfiguredMsg"), true);
    return;
  }
  if (!vicePath) {
    showViceToast(currentLanguage !== "hu" ? "VICE is not configured. Select it in the menu first." : "A VICE nincs beallitva. Valaszd ki a menuben.", true);
    return;
  }
  if (!window.electronAPI?.launchExomizer) {
    showViceToast(t("exomizerLaunchNotAvailable"), true);
    return;
  }

  const prg = buildAutostartPrgForEmulator();
  if (!prg.ok) {
    if (prg.errors?.length) { showCompileErrorDialog(prg.errors); return; }
    if (emulatorStatus) emulatorStatus.textContent = prg.error;
    return;
  }

  await showWorkProgress("workProgressRunExomizer", { indeterminate: true });
  let success = false;
  try {

    const result = await window.electronAPI.launchExomizer({
      bytes: Array.from(prg.bytes),
      fileName: `c64-visual-assembler-${Date.now()}.prg`
    });

    if (!result?.ok) {
      showViceToast(result?.error || t("exomizerLaunchFailed"), true);
      return;
    }

    updateVicePathPreview(result.vicePath || vicePath);
    updateExomizerPathPreview(result.exomizerPath || exomizerPath);
    const parts = (result.filePath || "").replace(/\\/g, "/").split("/");
    const fileName = parts[parts.length - 1] || result.filePath;
    showViceToast(fileName);
    success = true;
  } finally {
    if (success) {
      await completeWorkProgress("workProgressSuccessRunExomizer");
    } else {
      hideWorkProgress();
    }
  }
}

async function buildRunPrgForCurrentMode() {
  const prg = buildAutostartPrgForEmulator();
  if (!prg.ok) return prg;

  if (!exomizerEnabled) return prg;

  if (!exomizerPath) {
    return { ok: false, error: t("exomizerNotConfiguredMsg") };
  }

  if (!window.electronAPI?.buildExomizerPrg) {
    return { ok: false, error: t("exomizerLaunchNotAvailable") };
  }

  // Show progress dialog while Exomizer compresses (can take several seconds)
  const wasDialogOpen = workProgressDialog?.open;
  if (!wasDialogOpen) {
    await showWorkProgress("workProgressExomizerCompress", { indeterminate: true });
  } else {
    // Update subtitle + switch to indeterminate in already-open progress dialog (e.g. runProgram flow)
    if (workProgressSubtitle) workProgressSubtitle.textContent = t("workProgressExomizerCompress");
    if (workProgressBar) {
      workProgressBar.classList.add("work-progress-bar--indeterminate");
      workProgressBar.style.width = "";
    }
  }

  try {
    const result = await window.electronAPI.buildExomizerPrg({
      bytes: Array.from(prg.bytes),
      fileName: `c64-visual-assembler-${Date.now()}.prg`
    });

    if (!result?.ok) {
      return { ok: false, error: result?.error || t("exomizerLaunchFailed") };
    }

    return {
      ok: true,
      bytes: Uint8Array.from(result.bytes || []),
      exomizerPath: result.exomizerPath,
      filePath: result.filePath
    };
  } finally {
    // Hide progress only if we opened it (don't close an outer dialog)
    if (!wasDialogOpen) {
      hideWorkProgress();
    }
  }
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
    showViceToast(currentLanguage !== "hu" ? "Nothing to run — add some instructions first." : "Nincs mit futtatni — adj hozzá utasításokat.", true);
    return;
  }
  const host = (document.getElementById("ultimate-host")?.value || ultimateHost).trim();
  if (!host) {
    showViceToast(t("ultimateNotConfigured"), true);
    return;
  }
  const prg = await buildRunPrgForCurrentMode();
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
    showViceToast(currentLanguage !== "hu" ? "Nothing to run — add some instructions first." : "Nincs mit futtatni — adj hozzá utasításokat.", true);
    return;
  }
  const host = (document.getElementById("ultimate-host")?.value || ultimateHost).trim();
  if (!host) {
    showViceToast(t("ultimateNotConfigured"), true);
    return;
  }

  const prg = await buildRunPrgForCurrentMode();
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

function _importMakeMacroDefStart(name, params) {
  return {
    id: crypto.randomUUID(),
    category: "Makrok", mnemonic: "MACRO",
    operand: name, rawOperand: name, description: "",
    addressingMode: "implied", base: "hex",
    validationError: "", collapsed: true, isMacroDefStart: true,
    macroName: name,
    macroParams: params || ""
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

    // * = $XXXX or * = decimal → ORG
    const orgM = line.match(/^\*\s*=\s*(?:\$([0-9A-Fa-f]{1,4})|(\d{1,5}))\s*$/);
    if (orgM) {
      const orgAddress = orgM[1]
        ? orgM[1].toUpperCase().padStart(4, "0")
        : parseInt(orgM[2], 10).toString(16).toUpperCase().padStart(4, "0");
      blocks.push({ id: crypto.randomUUID(), category: "Makrok", mnemonic: "ORG", operand: "", rawOperand: "", description: "", addressingMode: "implied", base: "hex", validationError: "", collapsed: true, isOrgMacro: true, orgAddress });
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
        description: currentLanguage !== "hu" ? "Anonymous local label" : "Nevtelen helyi cimke",
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
        description: currentLanguage !== "hu" ? "Anonymous local label" : "Nevtelen helyi cimke",
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

function splitMacroInvokeArgs(argText) {
  const result = [];
  let current = "";
  let quote = "";
  let escaped = false;

  for (const char of (argText || "")) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }
    if (char === "\\") {
      current += char;
      escaped = true;
      continue;
    }
    if (quote) {
      current += char;
      if (char === quote) {
        quote = "";
      }
      continue;
    }
    if (char === "\"" || char === "'") {
      quote = char;
      current += char;
      continue;
    }
    if (char === ",") {
      result.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }

  if (current.trim() || result.length) {
    result.push(current.trim());
  }

  return result.filter(part => part !== "");
}

function normalizeMacroInvokeArg(arg) {
  const trimmed = (arg || "").trim();
  if (trimmed.length >= 2) {
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
}

function isBareLabelToken(value) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test((value || "").trim());
}

function getDeferredMacroAddressField(block) {
  if (block.isStringMacro) return "stringAddress";
  if (block.isRawTextMacro) return "rawTextAddress";
  if (block.isDataMacro) return "dataAddress";
  if (block.isRawBytesMacro) return "rawBytesAddress";
  if (block.isPetsciiMacro) return "petsciiAddress";
  return null;
}

function makeMacroBufferLabel(invokeId, paramName) {
  const safeInvokeId = String(invokeId || "").replace(/-/g, "").slice(0, 8) || "invk";
  const safeParamName = String(paramName || "buf").replace(/[^A-Za-z0-9_]/g, "_");
  return `__buf_${safeInvokeId}_${safeParamName}`;
}

function addLayoutLabels(labelMap, line) {
  if (!line || line.conditionallySkipped) return;
  const block = line.block || {};
  if (block.isLabel && block.labelName) labelMap.set(block.labelName, line.address);
  if (block.isLoopMacro && block.loopLabel) labelMap.set(block.loopLabel, line.address + 2);
  if (block.isForMacro && block.loopLabel) labelMap.set(block.loopLabel, line.address + 2);
  if (block.isTableMacro && block.tableName) {
    const tableAddr = block.tableAddress
      ? (parseAddressValue(block.tableAddress) ?? line.address)
      : line.address;
    labelMap.set(block.tableName, tableAddr);
  }
  if (block.isConstMacro && block.constName) {
    const v = parseNumberByBase((block.rawOperand || "").replace(/^\$/, ""), block.base);
    if (v !== null) labelMap.set(block.constName, v);
  }
  if (block._autoBufferLabel) {
    labelMap.set(block._autoBufferLabel, block._autoBufferAddress ?? line.address);
  }
  if (block.macroLabel) {
    const ml = block.macroLabel.trim();
    if (ml) {
      let addr = null;
      if (block.isTextMacro)      addr = 0x0400 + ((block.textY ?? 0) * 40) + (block.textX ?? 0);
      else if (block.isStringMacro)  addr = parseAddressValue(block.stringAddress) ?? 0xC000;
      else if (block.isDataMacro)    addr = parseAddressValue(block.dataAddress) ?? 0xC000;
      else if (block.isRawBytesMacro) addr = parseAddressValue(block.rawBytesAddress) ?? 0xC000;
      else if (block.isRawTextMacro)  addr = parseAddressValue(block.rawTextAddress) ?? 0xC000;
      else if (block.isPetsciiMacro)  addr = parseAddressValue(block.petsciiAddress) ?? 0xC000;
      if (addr !== null) labelMap.set(ml, addr);
    }
  }
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

  if (projectData.ui?.outputMode && outputModeTabs.length) {
    outputModeTabs.forEach((tab) => {
      const isActive = tab.dataset.mode === projectData.ui.outputMode;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });
  }

  if (typeof projectData.ui?.zoom === "number") {
    blockScale = Math.max(0.72, Math.min(1.25, Number(projectData.ui.zoom)));
    applyZoom();
  }

  const validRunModes = ["prg", "d64", "ultimate", "ultimate-d64"];
  if (projectData.ui?.runMode && validRunModes.includes(projectData.ui.runMode)) {
    setRunMode(projectData.ui.runMode);
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

async function _getAsmExportHeader() {
  // Always fetch the current version from the Tauri backend (single source of
  // truth = src-tauri/Cargo.toml). The DOM #about-version element is only
  // populated when the user opens the About dialog, so reading from there
  // gives stale text (whatever was hardcoded in index.html).
  let version = "v?";
  try {
    const raw = await window.electronAPI?.getAppVersion?.();
    if (raw) version = `v${raw}`;
  } catch (_) { /* fallback to "v?" */ }
  return `; Generated by C64 Visual Assembler ${version}\n; https://zstarczali.itch.io/visual-assembler-commodore-64\n;\n`;
}

function _buildDisasmText() {
  const html = _buildDisasmHTML();
  if (!html) return "";
  const host = document.createElement("div");
  host.innerHTML = html;
  return (host.textContent || "").replace(/\u00A0/g, " ");
}

function _replaceAddressesWithLabels(text, addrToLabel) {
  if (!text) return "";
  return text.replace(/\$([0-9A-F]{4})\b/gi, (match, hex) => {
    const label = addrToLabel?.get(parseInt(hex, 16));
    return label || match;
  });
}

function _formatPlainByteLines(bytes, perLine = 16, indent = "    ") {
  if (!Array.isArray(bytes) || !bytes.length) return [];
  const lines = [];
  for (let i = 0; i < bytes.length; i += perLine) {
    const chunk = bytes.slice(i, i + perLine);
    lines.push(`${indent}.byte ${chunk.map((byte) => toHex(byte, 2)).join(", ")}`);
  }
  return lines;
}

function _formatPlainWordLines(words, perLine = 8, indent = "    ") {
  if (!Array.isArray(words) || !words.length) return [];
  const lines = [];
  for (let i = 0; i < words.length; i += perLine) {
    const chunk = words.slice(i, i + perLine);
    lines.push(`${indent}.word ${chunk.map((word) => `$${toHex(word, 4)}`).join(", ")}`);
  }
  return lines;
}

function _formatPlainDisasmLines(bytes, baseAddr, addrToLabel) {
  if (!Array.isArray(bytes) || !bytes.length) return [];
  return _disasmBytes(bytes, baseAddr).map((instr) => {
    const mnemonic = instr.mnemonic === ".BYTE" ? ".byte" : instr.mnemonic;
    const operand = _replaceAddressesWithLabels(instr.operand, addrToLabel);
    return operand ? `    ${mnemonic} ${operand}` : `    ${mnemonic}`;
  });
}

function _commentifyAsmLines(lines) {
  return lines.filter(Boolean).map((line) => `; ${line.trimStart()}`);
}

function _getPlainAsmSourceText() {
  const layout = getProgramLayout();

  if (!program.length) {
    return `* = ${layout.origin.text}\n; ${currentLanguage !== "hu" ? "The C64 assembly source will appear here" : "Itt fog megjelenni a C64 assembly kod"}`;
  }

  if (expertMode && expertEditor) {
    return expertEditor.value || "";
  }

  return asmPlainText || "";

  const labels = new Map();
  layout.lines.forEach((line) => addLayoutLabels(labels, line));
  labels._anonAddrs = _collectAnonLabels(layout);

  const addrToLabel = new Map();
  for (const [name, addr] of labels) {
    if (!addrToLabel.has(addr)) {
      addrToLabel.set(addr, name);
    }
  }

  const mainLines = [];
  const deferredSections = [];
  const pushLine = (text) => {
    if (text === null || text === undefined) return;
    mainLines.push(text);
  };
  const addDeferredSection = (block, address, bytes, comment, fallbackName) => {
    if (!Array.isArray(bytes) || !bytes.length) {
      if (comment) pushLine(`; ${comment}`);
      return;
    }
    const macroLabel = (block.macroLabel || "").trim();
    deferredSections.push({
      address,
      bytes,
      label: macroLabel ? sanitizeLabelName(macroLabel) : fallbackName,
      comment
    });
  };

  layout.lines.forEach((line, index) => {
    const block = line.block || {};

    if (line.conditionallySkipped) return;
    if (block._isSavedAddress || block._isRestoreAddress) return;
    if (block._macroSourceBlock || block._isMacroInvokeHeader) return;
    if (block.isIncludeMacro) return;

    if (block.isBlankLine) {
      pushLine("");
      return;
    }

    if (block.isComment) {
      pushLine(`; ${block.rawOperand || ""}`);
      return;
    }

    if (block.isLabel) {
      pushLine(`${block.labelName || "label"}:`);
      return;
    }

    if (block.isAnonymousLabel) {
      pushLine("-");
      return;
    }

    if (block.isRegionMacro) {
      if (showRegionComments) pushLine(`; region ${block.regionName || "region"}`);
      return;
    }

    if (block.isEndRegionMacro) {
      if (showRegionComments) pushLine(`; endregion ${block.regionName || "region"}`);
      return;
    }

    if (block.isOrgMacro) {
      if (block.orgAddress) pushLine(`* = $${block.orgAddress.toUpperCase()}`);
      return;
    }

    if (block.isTableMacro) {
      if (block.tableAddress) {
        const tableAddr = parseAddressValue(block.tableAddress, labels);
        if (typeof tableAddr === "number" && !isNaN(tableAddr)) {
          pushLine(`* = ${formatAddress(tableAddr)}`);
        }
      }
      if (block.tableName) pushLine(`${block.tableName}:`);
      return;
    }

    if (block.isDefineMacro) {
      pushLine(`; DEFINE ${block.defineSymbol || "?"}`);
      return;
    }

    if (block.isConstMacro) {
      const constVal = parseNumberByBase((block.rawOperand || "").replace(/^\$/, ""), block.base);
      if (block.constName && constVal !== null) {
        pushLine(`${block.constName} = ${formatOperand("absolute", constVal, block.base || "hex")}`);
      } else {
        pushLine(`; CONST ${block.constName || "?"} = ${block.rawOperand || "?"}`);
      }
      return;
    }

    if (block.isIfMacro) {
      pushLine(`; IF ${block.ifCondition || "?"}`);
      return;
    }

    if (block.isElseMacro) {
      pushLine("; ELSE");
      return;
    }

    if (block.isEndIfMacro) {
      pushLine("; ENDIF");
      return;
    }

    if (block.isMacroDefStart) {
      pushLine(`; MACRO ${block.macroName || "?"}${block.macroParams ? `(${block.macroParams})` : ""}`);
      return;
    }

    if (block.isMacroDefEnd) {
      pushLine("; ENDM");
      return;
    }

    if (block.isByteMacro) {
      const byteLines = _formatPlainByteLines(parseByteMacro(block.rawOperand, block.base));
      if (byteLines.length) {
        pushLine(_commentifyAsmLines(byteLines).join("\n"));
        pushLine(byteLines.join("\n"));
      }
      return;
    }

    if (block.isWordMacro) {
      const wordLines = _formatPlainWordLines(parseWordMacro(block.rawOperand, block.base));
      if (wordLines.length) {
        pushLine(_commentifyAsmLines(wordLines).join("\n"));
        pushLine(wordLines.join("\n"));
      }
      return;
    }

    if (block.isFillMacro) {
      const parsed = parseFillMacro(block.rawOperand, block.base);
      if (parsed && !isNaN(parsed.count) && !isNaN(parsed.value)) {
        const fillLines = _formatPlainByteLines(new Array(parsed.count).fill(parsed.value & 0xFF));
        pushLine(_commentifyAsmLines(fillLines).join("\n"));
        pushLine(fillLines.join("\n"));
      } else {
        pushLine(`; FILL ${block.rawOperand || ""}`);
      }
      return;
    }

    if (block.isAlignMacro) {
      const boundary = parseNumberByBase(block.rawOperand.replace(/^\$/, ""), block.base);
      if (boundary && boundary > 0) {
        const remainder = line.address % boundary;
        const padding = remainder === 0 ? 0 : boundary - remainder;
        if (padding > 0) {
          const alignLines = _formatPlainByteLines(new Array(padding).fill(0x00));
          pushLine(_commentifyAsmLines(alignLines).join("\n"));
          pushLine(alignLines.join("\n"));
        }
      } else {
        pushLine(`; ALIGN ${block.rawOperand || ""}`);
      }
      return;
    }

    if (block.isRawBytesMacro) {
      const address = parseAddressValue(block.rawBytesAddress, labels) ?? 0xC000;
      const bytes = parseByteMacro(block.rawOperand, block.base);
      const byteLines = _formatPlainByteLines(bytes);
      if (byteLines.length) {
        pushLine(_commentifyAsmLines(byteLines).join("\n"));
      }
      addDeferredSection(
        block,
        address,
        bytes,
        `raw bytes @ ${formatAddress(address)}`,
        `rawbytes_${String(index + 1).padStart(2, "0")}`
      );
      return;
    }

    if (block.isRawTextMacro) {
      const address = parseAddressValue(block.rawTextAddress, labels) ?? 0xC000;
      const rawOffset = parseInt(block.charOffset || "0", 16);
      const bytes = encodeTextMacro(block.rawOperand, block.textCharset || "standard")
        .map((byte) => (byte + (isNaN(rawOffset) ? 0 : rawOffset)) & 0xFF);
      const byteLines = _formatPlainByteLines(bytes);
      if (byteLines.length) {
        pushLine(_commentifyAsmLines(byteLines).join("\n"));
      }
      addDeferredSection(
        block,
        address,
        bytes,
        `raw text @ ${formatAddress(address)}`,
        `rawtext_${String(index + 1).padStart(2, "0")}`
      );
      return;
    }

    if (block.isPetsciiMacro) {
      const address = parseAddressValue(block.petsciiAddress, labels) ?? 0xC000;
      const bytes = encodePetsciiMacro(block.rawOperand);
      if (block.petsciiNullTerminated) bytes.push(0x00);
      const byteLines = _formatPlainByteLines(bytes);
      if (byteLines.length) {
        pushLine(_commentifyAsmLines(byteLines).join("\n"));
      }
      addDeferredSection(
        block,
        address,
        bytes,
        `petscii @ ${formatAddress(address)}`,
        `petscii_${String(index + 1).padStart(2, "0")}`
      );
      return;
    }

    if (block.isIncBinMacro) {
      const address = parseAddressValue(block.incBinAddress, labels) ?? 0xC000;
      const bytes = Array.from(block.incBinBytes || []);
      const byteLines = _formatPlainByteLines(bytes);
      if (byteLines.length) {
        pushLine(_commentifyAsmLines(byteLines).join("\n"));
      }
      addDeferredSection(
        block,
        address,
        bytes,
        `incbin "${block.incBinFileName || block.incBinFile || "?"}" @ ${formatAddress(address)}`,
        `incbin_${String(index + 1).padStart(2, "0")}`
      );
      return;
    }

    if (block.isSidMacro) {
      const address = block.sidCustomAddress
        ? parseAddressValue(block.sidCustomAddress, labels)
        : block.sidLoadAddress;
      const bytes = Array.from(block.sidBytes || []);
      if (typeof address === "number" && !isNaN(address)) {
        const byteLines = _formatPlainByteLines(bytes);
        if (byteLines.length) {
          pushLine(_commentifyAsmLines(byteLines).join("\n"));
        }
        addDeferredSection(
          block,
          address,
          bytes,
          `sid "${block.sidFileName || block.sidFile || "?"}" @ ${formatAddress(address)}`,
          `sid_${String(index + 1).padStart(2, "0")}`
        );
      } else {
        pushLine(`; SID "${block.sidFileName || block.sidFile || "?"}" (${currentLanguage !== "hu" ? "no file loaded" : "nincs betoltott fajl"})`);
      }
      return;
    }

    const compiled = compileLineBytes(line, labels);
    if (!compiled.ok) {
      const suffix = block.operand ? ` ${getAsmDisplayOperand(block)}` : "";
      pushLine(`; ${block.mnemonic}${suffix}  ; ${compiled.error || "compile error"}`);
      return;
    }
    if (!compiled.bytes.length) return;
    const disasmLines = _formatPlainDisasmLines(compiled.bytes, line.address, addrToLabel);
    if (disasmLines.length) {
      pushLine(_commentifyAsmLines(disasmLines).join("\n"));
      pushLine(disasmLines.join("\n"));
    }
  });

  if (deferredSections.length) {
    deferredSections.sort((left, right) => left.address - right.address || left.label.localeCompare(right.label));
    pushLine("");
    pushLine(`; ${currentLanguage !== "hu" ? "Deferred data" : "Elhalasztott adatok"}`);
    pushLine("");
    deferredSections.forEach((section) => {
      pushLine(`* = ${formatAddress(section.address)}`);
      if (section.label) pushLine(`${section.label}:`);
      if (section.comment) pushLine(`    ; ${section.comment}`);
      const byteLines = _formatPlainByteLines(section.bytes);
      if (byteLines.length) {
        pushLine(_commentifyAsmLines(byteLines).join("\n"));
        byteLines.forEach(pushLine);
      } else {
        pushLine(`    ; ${currentLanguage !== "hu" ? "no data loaded" : "nincs betoltott adat"}`);
      }
      pushLine("");
    });
    while (mainLines.length && mainLines[mainLines.length - 1] === "") {
      mainLines.pop();
    }
  }

  return mainLines.join("\n");
}

async function copyAsmToClipboard() {
  if (!copyAsmButton) {
    return;
  }

  try {
    const header = await _getAsmExportHeader();
    await navigator.clipboard.writeText(header + _getPlainAsmSourceText());
    copyAsmButton.textContent = currentLanguage !== "hu" ? "ASM copied" : "ASM kimasolva";
    window.setTimeout(() => {
      copyAsmButton.textContent = t("copyAsm");
    }, 1400);
  } catch (error) {
    copyAsmButton.textContent = currentLanguage !== "hu" ? "Copy failed" : "Masolas sikertelen";
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
    showViceToast(currentLanguage !== "hu" ? "Nothing to run — add some instructions first." : "Nincs mit futtatni — adj hozzá utasításokat.", true);
    return;
  }
  if (!vicePath) {
    showViceToast(currentLanguage !== "hu" ? "VICE is not configured. Select it in the menu first." : "A VICE nincs beallitva. Valaszd ki a menuben.", true);
    return;
  }

  if (!window.electronAPI?.launchVice) {
    showViceToast(currentLanguage !== "hu" ? "VICE launch is not available." : "A VICE inditasa nem elerheto.", true);
    return;
  }

  await showWorkProgress("workProgressRun");
  let success = false;
  try {
    setWorkProgress(20);

    const prg = await buildRunPrgForCurrentMode();
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
      showViceToast(result?.error || (currentLanguage !== "hu" ? "Launching VICE failed." : "A VICE inditasa sikertelen."), true);
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

  layout.lines.forEach((line) => addLayoutLabels(labels, line));
  labels._anonAddrs = _collectAnonLabels(layout);

  // Assemble inline code bytes as sections (split by ORG blocks)
  const inlineSections = [{ addr: layout.origin.value, bytes: [] }];
  let currentSection = inlineSections[0];
  const compileErrors = [];
  for (const [layoutIndex, line] of layout.lines.entries()) {
    if (line.block.isLabel || line.block.isComment || line.block.isIncludeMacro || line.block.isBlankLine) continue;
    if (line.block._isSavedAddress) continue;
    // Skip macro definition-site blocks that still contain unresolved {param} placeholders
    if (line.block._fromMacroDef && /\{[A-Za-z_][A-Za-z0-9_]*\}/.test(line.block.rawOperand || "")) continue;
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
      const addr = parseAddressValue(block.rawBytesAddress, labels) ?? 0xC000;
      if (chunkBytes.length > 0) deferredChunks.push({ addr, bytes: chunkBytes });
    } else if (block.isRawTextMacro) {
      const rawOffset = parseInt(block.charOffset || "0", 16);
      const chunkBytes = encodeTextMacro(block.rawOperand, block.textCharset || "standard").map(b => (b + (isNaN(rawOffset) ? 0 : rawOffset)) & 0xFF);
      const addr = parseAddressValue(block.rawTextAddress, labels) ?? 0xC000;
      if (chunkBytes.length > 0) deferredChunks.push({ addr, bytes: chunkBytes });
    } else if (block.isPetsciiMacro) {
      const chunkBytes = encodePetsciiMacro(block.rawOperand);
      if (block.petsciiNullTerminated) chunkBytes.push(0x00);
      const addr = parseAddressValue(block.petsciiAddress, labels) ?? 0xC000;
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

  // Macro body at definition site with unresolved {param} placeholders — skip compilation
  if (block._fromMacroDef && /\{[A-Za-z_][A-Za-z0-9_]*\}/.test(block.rawOperand || "")) {
    return { ok: true, bytes: [] };
  }

  if (block.isLabel || block.isComment || block.isAnonymousLabel || block.isBlankLine) {
    return { ok: true, bytes: [] };
  }

  const blockError = getLiveValidationError(block);
  if (blockError) {
    // If the rawOperand still has an unresolved {param} placeholder, give a clearer message
    if (/\{[A-Za-z_][A-Za-z0-9_]*\}/.test(block.rawOperand || "")) {
      return { ok: false, error: `Unresolved macro parameter in ${block.mnemonic}: ${block.rawOperand}` };
    }
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
    const startAddress = parseAddressValue(block.stringAddress, labels) ?? 0xC000;
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
    const startAddress = parseAddressValue(block.dataAddress, labels) ?? 0xC000;
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
    const nullNote = block.petsciiNullTerminated ? " +$00" : "";
    return {
      ok: true,
      bytes: [],
      comment: `PETSCII "${block.rawOperand || ""}"${nullNote} @ ${formatAddress(parseAddressValue(block.petsciiAddress) ?? 0xC000)}`
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
      return { ok: false, error: currentLanguage !== "hu" ? "TURBO_SET: speed must be 0–15." : "TURBO_SET: a sebesseg 0 es 15 kozott lehet." };
    }
    const badline = parseInt(block.turboBadline || "0", 10) === 1 ? 0x80 : 0x00;
    const val = (spd & 0x0F) | badline;
    // LDA #val (A9 val) + STA $D031 (8D 31 D0)
    return { ok: true, bytes: [0xA9, val, 0x8D, 0x31, 0xD0], comment: `TURBO_SET speed=${spd} badline=${block.turboBadline === "1" ? "off" : "on"}` };
  }

  if (block.isSpriteColMacro) {
    const num = parseInt(block.spriteNum || "0", 10);
    if (isNaN(num) || num < 0 || num > 7) {
      return { ok: false, error: currentLanguage !== "hu" ? "SPRITE_COL: sprite number must be 0–7." : "SPRITE_COL: a sprite szama 0 es 7 kozott lehet." };
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

  if (block.isMapCopyMacro) {
    const srcStr = (block.mapCopySrc || "C000").replace(/^\$/, "");
    const dstStr = (block.mapCopyDst || "0400").replace(/^\$/, "");
    const srcInt = parseInt(srcStr, 16);
    const dstInt = parseInt(dstStr, 16);
    if (isNaN(srcInt) || srcInt < 0 || srcInt > 0xFFFF)
      return { ok: false, error: currentLanguage !== "hu" ? "MAP_COPY: invalid source address." : "MAP_COPY: ervenytelen forras cim." };
    if (isNaN(dstInt) || dstInt < 0 || dstInt > 0xFFFF)
      return { ok: false, error: currentLanguage !== "hu" ? "MAP_COPY: invalid destination address." : "MAP_COPY: ervenytelen cel cim." };
    const n = parseInt(block.mapCopySize, 10) || 1000;
    if (n < 1 || n > 0x10000)
      return { ok: false, error: currentLanguage !== "hu" ? "MAP_COPY: size must be 1–65536." : "MAP_COPY: meret 1 es 65536 kozott legyen." };
    const genSection = (src, dst) => {
      const out = [];
      const fp = Math.floor(n / 256);
      const rem = n % 256;
      out.push(0xA2, 0x00);  // LDX #0
      for (let i = 0; i < fp; i++) {
        const ps = (src + i * 256) & 0xFFFF, pd = (dst + i * 256) & 0xFFFF;
        out.push(0xBD, ps & 0xFF, ps >> 8, 0x9D, pd & 0xFF, pd >> 8, 0xE8, 0xD0, 0xF7);
      }
      if (rem > 0) {
        const ps = (src + fp * 256) & 0xFFFF, pd = (dst + fp * 256) & 0xFFFF;
        out.push(0xBD, ps & 0xFF, ps >> 8, 0x9D, pd & 0xFF, pd >> 8, 0xE8, 0xE0, rem, 0xD0, 0xF5);
      }
      return out;
    };
    const bytes = genSection(srcInt, dstInt);
    if (block.mapCopyCombined) {
      const cSrc = (srcInt + n) & 0xFFFF;
      const cDst = parseInt((block.mapCopyColorDst || "D800").replace(/^\$/, ""), 16);
      if (!isNaN(cDst)) bytes.push(...genSection(cSrc, cDst));
    } else if (block.mapCopyColorSrc) {
      const cSrcStr = (block.mapCopyColorSrc || "C3E8").replace(/^\$/, "");
      const cDstStr = (block.mapCopyColorDst || "D800").replace(/^\$/, "");
      const cSrc = parseInt(cSrcStr, 16), cDst = parseInt(cDstStr, 16);
      if (!isNaN(cSrc) && !isNaN(cDst)) bytes.push(...genSection(cSrc, cDst));
    }
    return { ok: true, bytes, comment: `MAP_COPY $${srcStr.toUpperCase()}→$${dstStr.toUpperCase()} ${n}b${block.mapCopyCombined ? " +col" : ""}` };
  }

  if (block.isSpriteAnimMacro) {
    const num = parseInt(block.animSpriteNum || "0", 10);
    if (isNaN(num) || num < 0 || num > 7)
      return { ok: false, error: currentLanguage !== "hu" ? "SPRITE_ANIM: sprite number must be 0–7." : "SPRITE_ANIM: a sprite szama 0 es 7 kozott lehet." };
    const count = parseInt(block.animFrameCount || "4", 10);
    if (isNaN(count) || count < 1 || count > 255)
      return { ok: false, error: currentLanguage !== "hu" ? "SPRITE_ANIM: frame count must be 1–255." : "SPRITE_ANIM: a frame szam 1 es 255 kozott lehet." };
    const zpStr = (block.animFrameZP || "FB").replace(/^\$/, "");
    const zp = parseInt(zpStr, 16);
    if (isNaN(zp) || zp < 0 || zp > 0xFF)
      return { ok: false, error: currentLanguage !== "hu" ? "SPRITE_ANIM: ZP counter must be $00–$FF." : "SPRITE_ANIM: a ZP szamlalo $00-$FF kozott lehet." };
    const listStr = (block.animFrameListAddr || "C100").replace(/^\$/, "");
    const listAddr = parseInt(listStr, 16);
    if (isNaN(listAddr) || listAddr < 0 || listAddr > 0xFFFF)
      return { ok: false, error: currentLanguage !== "hu" ? "SPRITE_ANIM: invalid frame list address." : "SPRITE_ANIM: ervenytelen frame lista cim." };
    const ptrAddr = 0x07F8 + num;
    const bytes = [
      0xE6, zp,                             // INC $ZP
      0xA5, zp,                             // LDA $ZP
      0xC9, count,                          // CMP #count
      0x90, 0x04,                           // BCC +4 (skip reset)
      0xA9, 0x00,                           // LDA #0
      0x85, zp,                             // STA $ZP
      0xAA,                                 // TAX
      0xBD, listAddr & 0xFF, listAddr >> 8, // LDA frameList,X
      0x8D, ptrAddr & 0xFF, ptrAddr >> 8    // STA $07F8+N
    ];
    return { ok: true, bytes, comment: `SPRITE_ANIM #${num} ${count}f zp=$${zpStr.toUpperCase()}` };
  }

  if (block.isScoreBcdMacro) {
    const addrStr = (block.scoreBcdAddr || "C200").replace(/^\$/, "");
    const addr = parseInt(addrStr, 16);
    if (isNaN(addr) || addr < 0 || addr > 0xFFFF)
      return { ok: false, error: currentLanguage !== "hu" ? "SCORE_BCD: invalid BCD storage address." : "SCORE_BCD: ervenytelen BCD tarolasi cim." };
    const digits = block.scoreDigits || 4;
    const scrStr = (block.scoreScreenAddr || "0400").replace(/^\$/, "");
    const scr = parseInt(scrStr, 16);
    if (isNaN(scr) || scr < 0 || scr > 0xFFFF)
      return { ok: false, error: currentLanguage !== "hu" ? "SCORE_BCD: invalid screen address." : "SCORE_BCD: ervenytelen screen cim." };
    const pts = parseInt(block.scoreAddPoints || "100", 10) || 0;
    const bcdByte = v => (Math.floor(v / 10) % 10) * 16 + (v % 10);
    const b0 = bcdByte(pts % 100);
    const b1 = bcdByte(Math.floor(pts / 100) % 100);
    const b2 = bcdByte(Math.floor(pts / 10000) % 100);
    const bcdBytes = digits / 2;
    const bcdAddrs = [addr, addr + 1, addr + 2];
    const bcdVals = [b0, b1, b2];
    const bytes = [];
    // BCD add
    bytes.push(0xF8, 0x18);  // SED, CLC
    for (let i = 0; i < bcdBytes; i++) {
      const a = bcdAddrs[i];
      bytes.push(0xAD, a & 0xFF, a >> 8);  // LDA abs
      bytes.push(0x69, bcdVals[i]);          // ADC #bcdN
      bytes.push(0x8D, a & 0xFF, a >> 8);  // STA abs
    }
    bytes.push(0xD8);  // CLD
    // BCD display (most significant byte first → left to right on screen)
    for (let i = bcdBytes - 1; i >= 0; i--) {
      const a = bcdAddrs[i];
      const screenPos = scr + (bcdBytes - 1 - i) * 2;
      const sp0 = screenPos & 0xFFFF, sp1 = (screenPos + 1) & 0xFFFF;
      bytes.push(
        0xAD, a & 0xFF, a >> 8,          // LDA abs (BCD byte)
        0x48,                              // PHA
        0x4A, 0x4A, 0x4A, 0x4A,          // LSR×4 → high nibble
        0x09, 0x30,                        // ORA #$30 → screen code
        0x8D, sp0 & 0xFF, sp0 >> 8,       // STA screen+pos
        0x68,                              // PLA
        0x29, 0x0F,                        // AND #$0F → low nibble
        0x09, 0x30,                        // ORA #$30
        0x8D, sp1 & 0xFF, sp1 >> 8        // STA screen+pos+1
      );
    }
    return { ok: true, bytes, comment: `SCORE_BCD $${addrStr.toUpperCase()} +${pts} → $${scrStr.toUpperCase()} (${digits}d)` };
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
      return { ok: false, error: t("loadfileErrEmptyName") };
    }
    const device = parseInt(block.loadFileDevice || "8", 10);
    if (isNaN(device) || device < 8 || device > 30) {
      return { ok: false, error: t("loadfileErrBadDevice") };
    }
    const addrStr = (block.loadFileAddress || "").trim().replace(/^\$/, "");
    const useOverride = addrStr !== "";
    let overrideAddr = 0;
    if (useOverride) {
      overrideAddr = parseInt(addrStr, 16);
      if (isNaN(overrideAddr) || overrideAddr < 0 || overrideAddr > 0xFFFF) {
        return { ok: false, error: t("loadfileErrBadAddr") };
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

    // BCS errorLabel on KERNAL load error (carry set); if no label, BCS * (self-loop = halts on error)
    if (useErrorCheck) {
      const target = labels.get(errorLabel);
      if (target === undefined) {
        return { ok: false, error: `${t("loadfileErrUnknownLabel")} ${errorLabel}` };
      }
      const bcsAddr = baseAddr + bytes.length;
      const offset = target - (bcsAddr + 2);
      if (offset < -128 || offset > 127) {
        return { ok: false, error: `${t("loadfileErrLabelTooFar")} ${offset}).` };
      }
      bytes.push(0xB0, offset & 0xFF);
    } else {
      bytes.push(0xB0, 0xFE);  // BCS * — megáll ha a fájl nem található
    }

    const addrSuffix = useOverride
      ? ` @$${overrideAddr.toString(16).toUpperCase().padStart(4, "0")}`
      : "";
    const errSuffix = useErrorCheck ? ` BCS ${errorLabel}` : "";
    return { ok: true, bytes, comment: `LOADFILE "${filename}" dev=${device}${addrSuffix}${errSuffix}` };
  }

  if (block.isExoDecrunchMacro) {
    // Backward exomizer mem-mode convention. Sequence:
    //   1) Copy KERNAL's load-end ZP ($AE/$AF) into depacker's src-end ZP ($04/$05).
    //   2) Turn off BASIC ROM ($01 = $36) so the depacker at $A000-$BFFF
    //      area is visible as RAM (default $37 maps BASIC ROM over $A000-$BFFF).
    //   3) JSR to depacker.
    //   4) Restore default memory mapping ($01 = $37) for downstream code.
    const depackStr = (block.exoDepackerAddr || "B000").replace(/^\$/, "");
    const depackAddr = parseInt(depackStr, 16);
    if (isNaN(depackAddr) || depackAddr < 0 || depackAddr > 0xFFFF) {
      return { ok: false, error: t("exoDecrunchErrBadDepacker") };
    }
    const bytes = [
      0xA5, 0xAE,           // LDA $AE  (KERNAL load-end lo)
      0x85, 0x04,           // STA $04  (depacker src-end lo)
      0xA5, 0xAF,           // LDA $AF  (KERNAL load-end hi)
      0x85, 0x05,           // STA $05  (depacker src-end hi)
      0xA9, 0x36,           // LDA #$36 (BASIC ROM off, KERNAL+I/O on)
      0x85, 0x01,           // STA $01
      0x20, depackAddr & 0xFF, (depackAddr >> 8) & 0xFF, // JSR depacker
      0xA9, 0x37,           // LDA #$37 (restore default: BASIC+KERNAL+I/O)
      0x85, 0x01,           // STA $01
    ];
    return {
      ok: true,
      bytes,
      comment: `EXODECRUNCH depacker=$${depackAddr.toString(16).toUpperCase().padStart(4,"0")} (toggles $01 around JSR for ROM-overlay area)`
    };
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
    const count = parseNumberByBase(rawCount, block.base || "hex") ?? NaN;
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
    const count = (block.base === "dec") ? parseInt(rawCount, 10) : parseInt(rawCount, 16);
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
    const count = (block.base === "dec") ? parseInt(rawCount, 10) : parseInt(rawCount, 16);
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
    return currentLanguage !== "hu"
      ? "In binary mode use only 0 and 1 characters, optionally with a % prefix."
      : "Binaris modban csak 0 es 1 karaktereket hasznalj, opcionis % elotaggal.";
  }
  return base === "hex"
    ? (currentLanguage !== "hu" ? "In hex mode use only 0-9 and A-F characters, optionally with a $ prefix. Binary literals (%00001111) are also accepted." : "Hex modban csak 0-9 es A-F karaktereket hasznalj, opcionis $ elotaggal. Binaris literalok is elfogadottak (%00001111).")
    : (currentLanguage !== "hu" ? "In decimal mode provide only whole numbers. Binary literals (%00001111) are also accepted." : "Decimalis modban csak egesz szamot adj meg. Binaris literalok is elfogadottak (%00001111).");
}

// For regular 6502 instruction blocks, always re-evaluate validation error from current rawOperand.
// This avoids stale stored errors (e.g. from before a fix or from a loaded project).
function getLiveValidationError(block) {
  if (opcodeMap[block.mnemonic] && block.addressingMode) {
    // Skip validation for macro body blocks with {param} placeholders (definition site or include source)
    if ((block._macroSourceBlock || block._fromMacroDef) && /\{[A-Za-z_][A-Za-z0-9_]*\}/.test(block.rawOperand || "")) {
      block.validationError = "";
      return "";
    }
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
      return currentLanguage !== "hu" ? "for example 01 or $FF" : "peldaul 01 vagy $FF";
    }

    if (modeText(modeKey, "label") === "Absolute") {
      return currentLanguage !== "hu" ? "for example C000 or $D020" : "peldaul C000 vagy $D020";
    }

    if (modeText(modeKey, "label") === "Zero page") {
      return currentLanguage !== "hu" ? "for example 10 or $A0" : "peldaul 10 vagy $A0";
    }
  }

  if (base === "bin") {
    if (modeText(modeKey, "label") === "Immediate" || modeText(modeKey, "label") === "Zero page") {
      return currentLanguage !== "hu" ? "for example 11111000" : "peldaul 11111000";
    }
    if (modeText(modeKey, "label") === "Absolute") {
      return currentLanguage !== "hu" ? "for example 1101000000010001" : "peldaul 1101000000010001";
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
      return currentLanguage !== "hu"
        ? `<small>BASIC stub: $0801 &nbsp;|&nbsp; <code>SYS ${codeAddr}</code> &nbsp;|&nbsp; Code: ${codeText}</small>`
        : `<small>BASIC stub: $0801 &nbsp;|&nbsp; <code>SYS ${codeAddr}</code> &nbsp;|&nbsp; Gépi kód: ${codeText}</small>`;
    }
    if (isFirst && !useBasicSys && addr === 0x0801) {
      const warning = currentLanguage !== "hu"
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
    const warning = currentLanguage !== "hu"
      ? `<strong>Run hint:</strong> BASIC SYS stub disabled — program loads at ${targetText}. Use <code>SYS ${targetOrigin}</code> to run.<br><span style='color: #d97706;'>⚠ Warning: Sample programs with RAWBYTES, sprites, or fixed memory addresses may not work correctly without BASIC SYS stub.</span>`
      : `<strong>Futtatas tipp:</strong> BASIC SYS stub kikapcsolva — program betöltve ide: ${targetText}. Futtatas: <code>SYS ${targetOrigin}</code><br><span style='color: #d97706;'>⚠ Figyelem: RAWBYTES, sprite-ok vagy fix memóriacímeket használó mintaprogramok nem biztos, hogy helyesen működnek BASIC SYS stub nélkül.</span>`;
    emulatorRunHint.innerHTML = warning;
    return;
  }

  if (origin.error) {
    emulatorRunHint.innerHTML = currentLanguage !== "hu"
      ? `<strong>Run hint:</strong> fix the start address so we can show a valid ` + "`SYS`" + ` entry point.`
      : `<strong>Futtatas tipp:</strong> javitsd a kezdocimet, hogy helyes ` + "`SYS`" + ` cimet tudjunk mutatni.`;
    return;
  }

  const runAddress = 0x080D;
  emulatorRunHint.innerHTML = currentLanguage !== "hu"
    ? `<strong>Run hint:</strong> if you want to start it manually in the emulator, use: <code>SYS ${runAddress}</code> <span>(${formatAddress(runAddress)})</span>`
    : `<strong>Futtatas tipp:</strong> ha az emulatorban kezzel inditanad, hasznald ezt: <code>SYS ${runAddress}</code> <span>(${formatAddress(runAddress)})</span>`;
}

function formatAddress(value) {
  return `$${value.toString(16).toUpperCase().padStart(4, "0")}`;
}

function getInstructionSize(block) {
  if (block.isBlankLine) {
    return 0;
  }

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

  if (block.isMapCopyMacro) {
    const n = block.mapCopySize || 1000;
    const fp = Math.floor(n / 256);
    const rem = n % 256;
    const sec = 2 + fp * 9 + (rem > 0 ? 11 : 0);  // LDX#0 + fp full loops + partial
    return sec * (block.mapCopyCombined || block.mapCopyColorSrc ? 2 : 1);
  }

  if (block.isSpriteAnimMacro) {
    return 19;  // INC zp + LDA zp + CMP #N + BCC +4 + LDA #0 + STA zp + TAX + LDA abs,X + STA abs
  }

  if (block.isScoreBcdMacro) {
    const digits = block.scoreDigits || 4;
    const bcdBytes = digits / 2;  // 1, 2, or 3
    const addSize = 3 + bcdBytes * 8;  // SED+CLC+CLD + (LDA+ADC+STA) × bcdBytes
    const dispSize = bcdBytes * 21;    // (LDA+PHA+LSR×4+ORA+STA+PLA+AND+ORA+STA) per BCD byte
    return addSize + dispSize;
  }

  if (block.isSpriteInitMacro) {
    return 18;  // LDA/STA ptr + LDA/ORA/STA $D015 + LDA/STA color
  }

  if (block.isLoadFileMacro) {
    const filename = (block.loadFileName || "").toUpperCase().replace(/[^\x20-\x7E]/g, "").slice(0, 16);
    const fnLen = Math.max(filename.length, 1);  // reserve at least 1 byte even if empty (compile error will surface separately)
    const useOverride = (block.loadFileAddress || "").trim() !== "";
    const useErrorCheck = (block.loadFileErrorLabel || "").trim() !== "";
    // 3 (JMP skip) + fnLen + 9 (SETNAM) + 9 (SETLFS) + (4 if override) + 5 (LDA #0 + JSR LOAD) + 2 (BCS always)
    return 3 + fnLen + 9 + 9 + (useOverride ? 4 : 0) + 5 + 2;
  }

  if (block.isExoDecrunchMacro) {
    return 19;  // 4×(LDA zp+STA zp)=16 for src-end + $01 toggle + JSR (3)
                // Actually: 8 (src-end) + 4 ($01=$36) + 3 (JSR) + 4 ($01=$37) = 19
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
    for (const macroBlock of userMacros[macroName].body) {
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
  let currentMacroHasParams = false;

  for (const block of program) {
    if (block.isMacroDefStart) {
      insideMacroDef = true;
      currentMacroName = block.macroName || null;
      // Macros with parameters cannot be used as subroutines (placeholders can't be resolved at definition site)
      currentMacroHasParams = !!(block.macroParams && block.macroParams.trim());
      // Emit synthetic label so JSR macroName can resolve to the definition site (param-less macros only)
      if (currentMacroName && !currentMacroHasParams) {
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
      currentMacroHasParams = false;
      if (showMacroSource) expandedProgram.push(block);
      continue;
    }
    if (insideMacroDef) {
      // Emit macro body as real subroutine code at definition site (enables JSR macroName) —
      // only for parameter-less macros; parameterised macros are INVOKE-only
      if (!currentMacroHasParams) {
        expandedProgram.push({ ...block, _fromMacroDef: currentMacroName });
      } else if (showMacroSource) {
        expandedProgram.push({ ...block, _macroSourceBlock: true, _fromMacroDef: currentMacroName });
      }
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
      const macroBody = userMacros[macroName].body;
      const macroParams = userMacros[macroName].params || [];
      // Collect local label names defined inside this macro body
      // Includes both explicit LABEL blocks AND loop labels (isLoopMacro.loopLabel)
      // so that LOOP/NEXT labels inside macros are uniquified per-invocation.
      const localLabels = new Set([
        ...macroBody.filter(b => b.isLabel && b.labelName).map(b => b.labelName),
        ...macroBody.filter(b => b.isLoopMacro && b.loopLabel).map(b => b.loopLabel)
      ]);
      const bufferParams = new Set();
      for (const macroBlock of macroBody) {
        const addrFieldName = getDeferredMacroAddressField(macroBlock);
        if (!addrFieldName) continue;
        const addrToken = (macroBlock[addrFieldName] || "").trim();
        if (isBareLabelToken(addrToken) && macroParams.includes(addrToken)) {
          bufferParams.add(addrToken);
        }
      }
      const bufferLabels = new Map(
        [...bufferParams].map((paramName) => [paramName, makeMacroBufferLabel(invokeId, paramName)])
      );
      // Build parameter → argument substitution map
      const invokeArgsStr = block.invokeArgs || "";
      const invokeArgsList = splitMacroInvokeArgs(invokeArgsStr).map(normalizeMacroInvokeArg);
      const paramSubst = {};
      macroParams.forEach((p, i) => { if (p) paramSubst[p] = invokeArgsList[i] ?? ""; });
      // Helper: substitute {param} placeholders with argument values
      const applyParams = (raw) => {
        if (!raw || !macroParams.length) return raw;
        let result = raw;
        for (const [p, v] of Object.entries(paramSubst)) {
          result = result.replace(new RegExp(`\\{${p}\\}`, "g"), v);
          const bareReplacement = bufferLabels.get(p) || v;
          result = result.replace(new RegExp(`(?<![A-Za-z0-9_])${p}(?![A-Za-z0-9_])`, "g"), bareReplacement);
        }
        return result;
      };
      // Helper: replace local label references in a rawOperand string, and apply param substitution
      const rewriteOperand = (raw) => {
        if (!raw) return raw;
        let result = applyParams(raw);
        if (!localLabels.size) return result;
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
      for (const macroBlock of userMacros[macroName].body) {
        const expanded = {
          ...macroBlock,
          id: crypto.randomUUID(),
          _fromMacro: macroName,
          _invokeBlockId: invokeId
        };
        const addrFieldName = getDeferredMacroAddressField(macroBlock);
        if (macroBlock.isLabel && macroBlock.labelName && localLabels.has(macroBlock.labelName)) {
          expanded.labelName = macroBlock.labelName + localSuffix;
        }
        if (addrFieldName) {
          const resolvedAddr = applyParams(macroBlock[addrFieldName]);
          expanded[addrFieldName] = resolvedAddr;
          if (bufferLabels.has((macroBlock[addrFieldName] || "").trim())) {
            expanded._autoBufferLabel = resolvedAddr;
          }
        }
        if (macroBlock.rawOperand) {
          const newRaw = rewriteOperand(macroBlock.rawOperand);
          expanded.rawOperand = newRaw;
          expanded.operand   = rewriteOperand(macroBlock.operand);
          // If param substitution changed the operand (had {param}), re-derive addressing mode
          // because the original block was parsed with a placeholder (e.g. "absolute" for "{color}")
          if (newRaw !== macroBlock.rawOperand && opcodeMap[macroBlock.mnemonic]) {
            const reparsedOperand = rewriteOperand(macroBlock.operand || macroBlock.rawOperand);
            const reparsed = _importMakeInstruction(macroBlock.mnemonic, reparsedOperand, new Set(["BEQ","BNE","BCC","BCS","BMI","BPL","BVC","BVS","BRA"]));
            expanded.addressingMode = reparsed.addressingMode;
            expanded.rawOperand = reparsed.rawOperand;
            expanded.operand = reparsed.operand;
            expanded.base = reparsed.base;
          }
        } else if (macroParams.length) {
          // No rawOperand, but still apply param substitution to operand
          expanded.operand = applyParams(macroBlock.operand);
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

  let autoBufferCursor = lines.length ? (lines[lines.length - 1].end + 1) : origin.value;
  for (const line of lines) {
    const block = line.block;
    const addrFieldName = getDeferredMacroAddressField(block);
    if (!addrFieldName || !block._autoBufferLabel) continue;
    const autoBytes = block.isPetsciiMacro
      ? (() => {
          const bytes = encodePetsciiMacro(block.rawOperand);
          if (block.petsciiNullTerminated) bytes.push(0x00);
          return bytes;
        })()
      : block.isStringMacro
        ? (() => {
            const rawChars = encodeTextMacro(block.rawOperand);
            const offset = parseInt(block.charOffset || "0", 16);
            return isNaN(offset) || offset === 0 ? rawChars : rawChars.map(b => (b + offset) & 0xFF);
          })()
        : block.isRawTextMacro
          ? (() => {
              const rawChars = encodeTextMacro(block.rawOperand, block.textCharset || "standard");
              const offset = parseInt(block.charOffset || "0", 16);
              return isNaN(offset) || offset === 0 ? rawChars : rawChars.map(b => (b + offset) & 0xFF);
            })()
          : [];
    const resolvedAddr = autoBufferCursor;
    block._autoBufferAddress = resolvedAddr;
    block[addrFieldName] = `$${resolvedAddr.toString(16).toUpperCase().padStart(4, "0")}`;
    autoBufferCursor += autoBytes.length;
  }

  return {
    origin,
    lines,
    start: origin.value,
    end: lines.length ? lines[lines.length - 1].end : origin.value - 1
  };
}

function getDeferredMemorySections(layout) {
  // Build label map for address resolution
  const labelMap = new Map();
  layout.lines.forEach((line) => addLayoutLabels(labelMap, line));

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
        const startAddress = parseAddressValue(line.block.stringAddress, labelMap) ?? 0xC000;
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
        const startAddress = parseAddressValue(line.block.dataAddress, labelMap) ?? 0xC000;
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
        const startAddress = parseAddressValue(line.block.rawBytesAddress, labelMap) ?? 0xC000;
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
        const startAddress = parseAddressValue(line.block.rawTextAddress, labelMap) ?? 0xC000;
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
        const startAddress = parseAddressValue(line.block.petsciiAddress, labelMap) ?? 0xC000;
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
    return currentLanguage !== "hu" ? "Anonymous local label (-)" : "Nevtelen helyi cimke (-)";
  }

  if (block.isLabel) {
    return `${currentLanguage !== "hu" ? "Label" : "Label"}: ${block.labelName || "start"}`;
  }

  if (block.isComment) {
    return `${currentLanguage !== "hu" ? "Comment" : "Komment"}: ${block.rawOperand || ""}`;
  }

  if (block.isTextMacro) {
    return block.validationError || `${currentLanguage !== "hu" ? "TEXT macro" : "TEXT makro"}: "${block.rawOperand || ""}" @ (${block.textX ?? 0}, ${block.textY ?? 0})`;
  }

  if (block.isByteMacro) {
    return block.validationError || `${currentLanguage !== "hu" ? "BYTE macro" : "BYTE makro"}: ${block.rawOperand || ""}`;
  }

  if (block.isStringMacro) {
    const offsetNote = (() => { const v = parseInt(block.charOffset || "0", 16); return (!isNaN(v) && v !== 0) ? ` (+$${v.toString(16).toUpperCase().padStart(2,"0")} ${currentLanguage !== "hu" ? "added to each char" : "hozzaadva minden karakterhez"})` : ""; })();
    return block.validationError || `${currentLanguage !== "hu" ? "STRING macro" : "STRING makro"}: "${block.rawOperand || ""}" @ ${block.stringAddress || "C000"}${offsetNote}`;
  }

  if (block.isDataMacro) {
    return block.validationError || `${currentLanguage !== "hu" ? "DATA macro" : "DATA makro"}: ${block.rawOperand || ""} @ ${block.dataAddress || "C000"}`;
  }

  if (block.isRawBytesMacro) {
    return block.validationError || `${currentLanguage !== "hu" ? "RAWBYTES macro" : "RAWBYTES makro"}: ${block.rawOperand || ""} @ ${block.rawBytesAddress || "C000"}`;
  }

  if (block.isIncBinMacro) {
    const size = (block.incBinBytes || []).length;
    const name = block.incBinFileName || (currentLanguage !== "hu" ? "no file" : "nincs fajl");
    return block.validationError || `${currentLanguage !== "hu" ? "INCBIN macro" : "INCBIN makro"}: "${name}" (${size} bytes) @ ${block.incBinAddress || "$C000"}`;
  }

  if (block.isIncludeMacro) {
    const count = (block.includedBlocks || []).length;
    const name = block.includeFileName || (currentLanguage !== "hu" ? "no file" : "nincs fajl");
    const addrNote = block.includeAddress ? ` @ $${block.includeAddress.replace(/^\$/, "").toUpperCase().padStart(4, "0")}` : "";
    return block.validationError || `${currentLanguage !== "hu" ? "INCLUDE" : "INCLUDE"}: "${name}" (${count} ${t("includeBlocksCount")})${addrNote}`;
  }

  if (block.isRawTextMacro) {
    const offsetNote = (() => { const v = parseInt(block.charOffset || "0", 16); return (!isNaN(v) && v !== 0) ? ` (+$${v.toString(16).toUpperCase().padStart(2,"0")} ${currentLanguage !== "hu" ? "added to each char" : "hozzaadva minden karakterhez"})` : ""; })();
    return block.validationError || `${currentLanguage !== "hu" ? "RAWTEXT macro" : "RAWTEXT makro"}: "${block.rawOperand || ""}" @ ${block.rawTextAddress || "C000"}${offsetNote}`;
  }

  if (block.isPetsciiMacro) {
    return block.validationError || `${currentLanguage !== "hu" ? "PETSCII macro" : "PETSCII makro"}: "${block.rawOperand || ""}" @ ${block.petsciiAddress || "C000"}`;
  }

  if (block.isWordMacro) {
    return block.validationError || `${currentLanguage !== "hu" ? "WORD macro" : "WORD makro"}: ${block.rawOperand || ""}`;
  }

  if (block.isFillMacro) {
    return block.validationError || `${currentLanguage !== "hu" ? "FILL macro" : "FILL makro"}: ${block.rawOperand || ""}`;
  }

  if (block.isAlignMacro) {
    return block.validationError || `${currentLanguage !== "hu" ? "ALIGN macro" : "ALIGN makro"}: ${block.rawOperand || ""}`;
  }

  if (block.isTableMacro) {
    return block.validationError || `${currentLanguage !== "hu" ? "TABLE" : "TABLA"}: ${block.tableName || "?"} @ ${block.tableAddress || "C000"}`;
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
    return block.validationError || `${currentLanguage !== "hu" ? "IF" : "HA"}: ${block.ifCondition || "?"}`;
  }

  if (block.isElseMacro) {
    return currentLanguage !== "hu" ? "ELSE" : "KULONBEN";
  }

  if (block.isEndIfMacro) {
    return currentLanguage !== "hu" ? "ENDIF" : "HA_VEGE";
  }

  if (block.isMacroInvoke) {
    const name = block.invokeMacroName || "?";
    if (userMacros[name]) {
      const bodyCount = userMacros[name].body.length;
      return currentLanguage !== "hu"
        ? `Invokes user-defined macro "${name}" (${bodyCount} instruction${bodyCount !== 1 ? 's' : ''})`
        : `Felhasználói makró "${name}" hívása (${bodyCount} utasítás)`;
    }
    return currentLanguage !== "hu" ? `Invoke macro "${name}" (not defined yet)` : `Makró "${name}" hívása (még nincs definiálva)`;
  }

  if (block.isRegionMacro) {
    return currentLanguage !== "hu" ? `Region: ${block.regionName || "region"}` : `Régió: ${block.regionName || "region"}`;
  }
  if (block.isEndRegionMacro) {
    return currentLanguage !== "hu" ? "End of region" : "Régió vége";
  }

  // Check if this block invokes a user macro (legacy format)
  if (userMacros[block.mnemonic]) {
    const bodyCount = userMacros[block.mnemonic].length;
    return currentLanguage !== "hu"
      ? `Invokes user-defined macro "${block.mnemonic}" (${bodyCount} instruction${bodyCount !== 1 ? 's' : ''})`
      : `Felhasználói makró "${block.mnemonic}" hívása (${bodyCount} utasítás)`;
  }

  return block.validationError || (currentLanguage === "es"
    ? mnemonicDescriptionsEs[block.mnemonic] || mnemonicDescriptionsEn[block.mnemonic] || block.description
    : currentLanguage !== "hu"
      ? mnemonicDescriptionsEn[block.mnemonic] || block.description
      : block.description);
}

function getBlockModeCaption(block) {
  if (block.isComment) {
    return `${getCategoryLabel(block.category)} | ${currentLanguage !== "hu" ? "comment" : "komment"}`;
  }

  if (block.isTextMacro) {
    const n = encodeTextMacro(block.rawOperand).length;
    return `${currentLanguage !== "hu" ? "Screen" : "Kepernyo"} | X:${block.textX ?? 0} Y:${block.textY ?? 0}  (${n} byte)`;
  }

  if (block.isByteMacro) {
    const n = parseByteMacro(block.rawOperand, block.base).length;
    return (currentLanguage !== "hu" ? "Byte array | current address" : "Byte tomb | aktualis cim") + `  (${n} byte)`;
  }

  if (block.isStringMacro) {
    const off = parseInt(block.charOffset || "0", 16);
    const offNote = (!isNaN(off) && off !== 0) ? ` +$${off.toString(16).toUpperCase().padStart(2,"0")}` : "";
    const n = encodeTextMacro(block.rawOperand).length;
    return `${currentLanguage !== "hu" ? "Screen code" : "Kepernyo kod"} | ${block.stringAddress || "C000"}${offNote}  (${n} byte)`;
  }

  if (block.isDataMacro) {
    const n = parseByteMacro(block.rawOperand, block.base).length;
    return `${currentLanguage !== "hu" ? "Memory" : "Memoria"} | ${block.dataAddress || "C000"}  (${n} byte)`;
  }

  if (block.isRawBytesMacro) {
    const n = parseByteMacro(block.rawOperand, block.base).length;
    return `${currentLanguage !== "hu" ? "Raw bytes @ mem" : "Nyers byte @ mem"} | ${block.rawBytesAddress || "C000"}  (${n} byte)`;
  }

  if (block.isRawTextMacro) {
    const off = parseInt(block.charOffset || "0", 16);
    const offNote = (!isNaN(off) && off !== 0) ? ` +$${off.toString(16).toUpperCase().padStart(2,"0")}` : "";
    const n = encodeTextMacro(block.rawOperand).length;
    return `${currentLanguage !== "hu" ? "Screen codes @ mem" : "Kepernyo kod @ mem"} | ${block.rawTextAddress || "C000"}${offNote}  (${n} byte)`;
  }

  if (block.isPetsciiMacro) {
    const n = encodePetsciiMacro(block.rawOperand).length;
    return `PETSCII @ ${block.petsciiAddress || "C000"}  (${n} byte)`;
  }

  if (block.isIncBinMacro) {
    const size = (block.incBinBytes || []).length;
    return `${currentLanguage !== "hu" ? "Binary file @ memory" : "Binarfajl @ memoria"} | ${block.incBinAddress || "$C000"}  (${size} byte)`;
  }

  if (block.isIncludeMacro) {
    const count = (block.includedBlocks || []).length;
    return `${currentLanguage !== "hu" ? "Included project" : "Beillesztett projekt"} | ${count} ${t("includeBlocksCount")}`;
  }

  if (block.isWordMacro) {
    const n = parseWordMacro(block.rawOperand, block.base).length * 2;
    return (currentLanguage !== "hu" ? "16-bit values | LO/HI pairs" : "16-bites ertekek | LO/HI parok") + `  (${n} byte)`;
  }

  if (block.isFillMacro) {
    const parsed = parseFillMacro(block.rawOperand, block.base);
    const n = parsed ? parsed.count : 0;
    return (currentLanguage !== "hu" ? "Fill | repeated bytes" : "Toltes | ismetlodo byte-ok") + `  (${n} byte)`;
  }

  if (block.isAlignMacro) {
    const boundary = block.rawOperand || "?";
    return currentLanguage !== "hu" ? `Align | boundary: ${boundary}` : `Igazitas | hatar: ${boundary}`;
  }

  if (block.isTableMacro) {
    return `${currentLanguage !== "hu" ? "Lookup table" : "Kereso tabla"} | ${block.tableAddress || "C000"}`;
  }

  if (block.isOrgMacro) {
    return `${currentLanguage !== "hu" ? "Origin" : "Forditasi cim"} | $${(block.orgAddress || "0900").toUpperCase()}`;
  }

  if (block.isDefineMacro) {
    return currentLanguage !== "hu" ? "Conditional | DEFINE" : "Felteteles | DEFINE";
  }

  if (block.isConstMacro) {
    return currentLanguage !== "hu" ? "Macro | Const" : "Makro | Const";
  }

  if (block.isIfMacro) {
    return currentLanguage !== "hu" ? "Conditional | IF" : "Felteteles | HA";
  }

  if (block.isElseMacro) {
    return currentLanguage !== "hu" ? "Conditional | ELSE" : "Felteteles | KULONBEN";
  }

  if (block.isEndIfMacro) {
    return currentLanguage !== "hu" ? "Conditional | ENDIF" : "Felteteles | HA_VEGE";
  }

  if (block.isPushMacro) {
    const regs = block.pushRegs || "A";
    return currentLanguage !== "hu" ? `Stack | Push ${regs}` : `Stack | Ment ${regs}`;
  }

  if (block.isPullMacro) {
    const regs = block.pullRegs || "A";
    return currentLanguage !== "hu" ? `Stack | Pull ${regs}` : `Stack | Visszatolt ${regs}`;
  }

  if (block.isMacroDefStart) {
    return currentLanguage !== "hu" ? "User Macro | Definition" : "Felhasznaloi Makro | Definicio";
  }

  if (block.isMacroDefEnd) {
    return currentLanguage !== "hu" ? "User Macro | End" : "Felhasznaloi Makro | Vege";
  }

  if (block.isMacroInvoke) {
    return currentLanguage !== "hu" ? "User Macro | Invoke" : "Felhasznaloi Makro | Hivas";
  }

  if (block.isRegionMacro) {
    return currentLanguage !== "hu" ? "Structure | Region" : "Szerkezet | Régió";
  }

  if (block.isEndRegionMacro) {
    return currentLanguage !== "hu" ? "Structure | End Region" : "Szerkezet | Régió vége";
  }

  if (block.isAnonymousLabel) {
    return getCategoryLabel(block.category);
  }

  // Check if this block invokes a user macro (legacy format)
  if (userMacros[block.mnemonic]) {
    return currentLanguage !== "hu" ? "User Macro | Invoke" : "Felhasznaloi Makro | Hivas";
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
    return currentLanguage !== "hu" ? "no file" : "nincs fajl";
  }

  if (block.isSidMacro) {
    const size = (block.sidBytes || []).length;
    if (block.sidFileName) return `"${block.sidFileName}"${size ? ` (${size} bytes)` : ""}`;
    return currentLanguage !== "hu" ? "no file" : "nincs fajl";
  }

  if (block.isIncludeMacro) {
    const count = (block.includedBlocks || []).length;
    if (block.includeFileName) return `"${block.includeFileName}" (${count} ${t("includeBlocksCount")})`;
    return currentLanguage !== "hu" ? "no file" : "nincs fajl";
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
      ? (currentLanguage !== "hu" ? "badline off" : "badline ki")
      : (currentLanguage !== "hu" ? "badline on" : "badline be");
    return `$D031 = spd${spd} ${badlineLabel}`;
  }

  if (block.isSuperCpuDetectMacro) {
    return currentLanguage !== "hu" ? "$D0B8 vs $FF" : "$D0B8 vs $FF";
  }

  if (block.isTurboEnableMacro) {
    const mode = (block.turboEnableMode || "on") === "on"
      ? (currentLanguage !== "hu" ? "ON" : "BE")
      : (currentLanguage !== "hu" ? "OFF" : "KI");
    return `$D07${(block.turboEnableMode || "on") === "on" ? "A" : "B"} (${mode})`;
  }

  if (block.isSpriteColMacro) {
    const typeLabel = (block.colType || "sprite") === "background"
      ? (currentLanguage !== "hu" ? "bg" : "hatter")
      : (currentLanguage !== "hu" ? "spr" : "sprite");
    return `#${block.spriteNum || "0"} ${typeLabel} → BEQ/BNE`;
  }

  if (block.isMapCopyMacro) {
    const src = (block.mapCopySrc || "C000").toUpperCase();
    const dst = (block.mapCopyDst || "0400").toUpperCase();
    const sz = block.mapCopySize || 1000;
    const colPart = block.mapCopyCombined
      ? ` + col auto→$${(block.mapCopyColorDst || "D800").toUpperCase()}`
      : block.mapCopyColorSrc
        ? ` + col $${block.mapCopyColorSrc.toUpperCase()}→$${(block.mapCopyColorDst || "D800").toUpperCase()}`
        : "";
    return `$${src}→$${dst} ${sz}b${colPart}`;
  }

  if (block.isSpriteAnimMacro) {
    return `#${block.animSpriteNum || 0} ${block.animFrameCount || 4}f $${(block.animFrameListAddr || "C100").toUpperCase()} zp=$${(block.animFrameZP || "FB").toUpperCase()}`;
  }

  if (block.isScoreBcdMacro) {
    return `$${(block.scoreBcdAddr || "C200").toUpperCase()} +${block.scoreAddPoints || 100} → $${(block.scoreScreenAddr || "0400").toUpperCase()} (${block.scoreDigits || 4}d)`;
  }

  if (block.isReuCheckMacro) {
    return currentLanguage !== "hu" ? "probe $DF04 with $55/$AA" : "$DF04 proba $55/$AA mintaval";
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
      const parsed = parseNumberByBase(rawCount, block.base || "hex") ?? NaN;
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
      const parsed = parseNumberByBase(rawCount, block.base || "hex") ?? NaN;
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

      // Blank line blocks are invisible in block mode — they only exist for expert mode round-trip
      if (block.isBlankLine) return;

      const node = blockTemplate.content.firstElementChild.cloneNode(true);
      node.dataset.index = index;
      node.dataset.blockId = block.id;
      node.dataset.categoryTone = getCategoryTone(block.category);
      node.dataset.collapsed = block.collapsed ? "true" : "false";
      if (block.isConstMacro) node.dataset.macroKind = "const";
      if (block.isMacroDefStart) node.dataset.blockKind = "macro-def-start";
      if (block.isMacroDefEnd) node.dataset.blockKind = "macro-def-end";
      if (block.isLabel) node.dataset.blockKind = "label";
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
        operandField.placeholder = currentLanguage !== "hu" ? "for example start_loop" : "peldaul start_loop";
        operandField.addEventListener("input", (event) => updateProgramBlock(index, "labelName", event.target.value));
      } else if (block.isComment) {
        inlineField.hidden = false;
        inlineField.querySelector("span").textContent = t("fieldComment");
        operandField.value = block.rawOperand || "";
        operandField.disabled = false;
        operandField.placeholder = currentLanguage !== "hu" ? "For example border scroll demo" : "Peldaul border scroll demo";
        operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
      } else if (block.isTextMacro) {
        inlineField.hidden = false;
        inlineField.querySelector("span").textContent = t("fieldText");
        operandField.value = block.rawOperand || "";
        operandField.disabled = false;
        operandField.placeholder = currentLanguage !== "hu" ? "For example HELLO C64" : "Peldaul HELLO C64";
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
              <span>${currentLanguage !== "hu" ? "Label (optional)" : "Label (opcionális)"}</span>
              <input class="macro-label" type="text" value="${block.macroLabel || ""}" placeholder="${currentLanguage !== "hu" ? "e.g. mytext" : "pl. sajatszoveg"}">
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
        ? (currentLanguage !== "hu" ? "For example FF,00,8D,20,D0" : "Peldaul FF,00,8D,20,D0")
        : (currentLanguage !== "hu" ? "For example 169,0,141,32,208" : "Peldaul 169,0,141,32,208");
      operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
    } else if (block.isStringMacro) {
      inlineField.hidden = false;
      inlineField.querySelector("span").textContent = t("fieldText");
      operandField.value = block.rawOperand || "";
      operandField.disabled = false;
      operandField.placeholder = currentLanguage !== "hu" ? "For example HELLO" : "Peldaul HELLO";
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
              <span>${currentLanguage !== "hu" ? "Label (optional)" : "Label (opcionális)"}</span>
              <input class="macro-label" type="text" value="${block.macroLabel || ""}" placeholder="${currentLanguage !== "hu" ? "e.g. mystr" : "pl. sajatstr"}">
            </label>
            <label class="mini-field">
              <span>${currentLanguage !== "hu" ? "Shift" : "Eltolas"}</span>
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
        ? (currentLanguage !== "hu" ? "For example FF,00,8D,20,D0" : "Peldaul FF,00,8D,20,D0")
        : (currentLanguage !== "hu" ? "For example 169,0,141,32,208" : "Peldaul 169,0,141,32,208");
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
              <span>${currentLanguage !== "hu" ? "Label (optional)" : "Label (opcionális)"}</span>
              <input class="macro-label" type="text" value="${block.macroLabel || ""}" placeholder="${currentLanguage !== "hu" ? "e.g. mydata" : "pl. sajatadat"}">
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
        ? (currentLanguage !== "hu" ? "For example FF,00,8D,20,D0" : "Peldaul FF,00,8D,20,D0")
        : (currentLanguage !== "hu" ? "For example 169,0,141,32,208" : "Peldaul 169,0,141,32,208");
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
              <span>${currentLanguage !== "hu" ? "Label (optional)" : "Label (opcionális)"}</span>
              <input class="macro-label" type="text" value="${block.macroLabel || ""}" placeholder="${currentLanguage !== "hu" ? "e.g. myraw" : "pl. sajatnyers"}">
            </label>
          </div>
        `
      );
    } else if (block.isRawTextMacro) {
      inlineField.hidden = false;
      inlineField.querySelector("span").textContent = t("fieldText");
      operandField.value = block.rawOperand || "";
      operandField.disabled = false;
      operandField.placeholder = currentLanguage !== "hu" ? "For example HELLO" : "Peldaul HELLO";
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
              <span>${currentLanguage !== "hu" ? "Label (optional)" : "Label (opcionális)"}</span>
              <input class="macro-label" type="text" value="${block.macroLabel || ""}" placeholder="${currentLanguage !== "hu" ? "e.g. mytext" : "pl. sajatszoveg"}">
            </label>
            <label class="mini-field">
              <span>${currentLanguage !== "hu" ? "Shift" : "Eltolas"}</span>
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
      operandField.placeholder = currentLanguage !== "hu" ? "For example HELLO" : "Peldaul HELLO";
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
              <span>${currentLanguage !== "hu" ? "Label (optional)" : "Label (opcionális)"}</span>
              <input class="macro-label" type="text" value="${block.macroLabel || ""}" placeholder="${currentLanguage !== "hu" ? "e.g. mypetscii" : "pl. sajatpetscii"}">
            </label>
          </div>
          <div style="display:flex;align-items:center;gap:6px;margin-top:4px;font-size:0.72rem;color:var(--muted);">
            <input class="petscii-null-check mini-checkbox" data-field="petsciiNullTerminated" type="checkbox"${block.petsciiNullTerminated ? " checked" : ""}>
            ${currentLanguage !== "hu" ? "Append $00 (null terminator)" : "Null lezaro ($00) hozzafuzese"}
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
              <span>${currentLanguage !== "hu" ? "Load address (optional)" : "Betoltesi cim (opcionalis)"}</span>
              <input type="text" class="include-address-input" maxlength="4"
                value="${block.includeAddress || ""}"
                placeholder="${currentLanguage !== "hu" ? "e.g. C000" : "Pl. C000"}">
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
      inlineField.querySelector("span").textContent = currentLanguage !== "hu" ? "16-bit values" : "16-bites ertekek";
      operandField.value = block.rawOperand || "";
      operandField.disabled = false;
      operandField.placeholder = block.base === "hex"
        ? (currentLanguage !== "hu" ? "For example 03E8,07D0,0BB8" : "Peldaul 03E8,07D0,0BB8")
        : (currentLanguage !== "hu" ? "For example 1000,2000,3000" : "Peldaul 1000,2000,3000");
      operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
    } else if (block.isFillMacro) {
      inlineField.hidden = false;
      inlineField.querySelector("span").textContent = currentLanguage !== "hu" ? "Count,Value" : "Darab,Ertek";
      operandField.value = block.rawOperand || "";
      operandField.disabled = false;
      operandField.placeholder = block.base === "hex"
        ? (currentLanguage !== "hu" ? "For example 100,00" : "Peldaul 100,00")
        : (currentLanguage !== "hu" ? "For example 256,0" : "Peldaul 256,0");
      operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
    } else if (block.isAlignMacro) {
      inlineField.hidden = false;
      inlineField.querySelector("span").textContent = currentLanguage !== "hu" ? "Boundary" : "Hatar";
      operandField.value = block.rawOperand || "";
      operandField.disabled = false;
      operandField.placeholder = block.base === "hex"
        ? (currentLanguage !== "hu" ? "For example 40 (64), 100 (256), 2000" : "Peldaul 40 (64), 100 (256), 2000")
        : (currentLanguage !== "hu" ? "For example 64, 256, 8192" : "Peldaul 64, 256, 8192");
      operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
    } else if (block.isTableMacro) {
      inlineField.hidden = true;
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid">
            <label class="mini-field">
              <span>${currentLanguage !== "hu" ? "Table name" : "Tabla nev"}</span>
              <input class="table-name" type="text" value="${block.tableName || "table1"}" placeholder="table1">
            </label>
            <label class="mini-field">
              <span>${currentLanguage !== "hu" ? "Address" : "Cim"}</span>
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
              <span>${currentLanguage !== "hu" ? "New origin" : "Uj forditasi cim"}</span>
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
              <span>${currentLanguage !== "hu" ? "Turbo" : "Turbo"}</span>
              <select class="turbo-enable-mode">
                <option value="on" ${curMode === "on" ? "selected" : ""}>${currentLanguage !== "hu" ? "Enable ($D07A)" : "Bekapcsol ($D07A)"}</option>
                <option value="off" ${curMode === "off" ? "selected" : ""}>${currentLanguage !== "hu" ? "Disable ($D07B)" : "Kikapcsol ($D07B)"}</option>
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
              <span>${currentLanguage !== "hu" ? "Speed" : "Sebesseg"}</span>
              <select class="turbo-speed">${spdOptions}</select>
            </label>
            <label class="mini-field">
              <span>${currentLanguage !== "hu" ? "Badline" : "Badline"}</span>
              <select class="turbo-badline">
                <option value="0" ${curBl === "0" ? "selected" : ""}>${currentLanguage !== "hu" ? "Enabled (C64 compat)" : "Engedelyezve (C64 kompatibilis)"}</option>
                <option value="1" ${curBl === "1" ? "selected" : ""}>${currentLanguage !== "hu" ? "Disabled (turbo)" : "Letiltva (turbo)"}</option>
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
    } else if (block.isMapCopyMacro) {
      inlineField.hidden = true;
      const isCombined = !!block.mapCopyCombined;
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid">
            <label class="mini-field">
              <span>${t("fieldMapCopySrc")}</span>
              <input class="map-copy-src" type="text" maxlength="4" value="${(block.mapCopySrc || "C000").toUpperCase()}" placeholder="C000">
            </label>
            <label class="mini-field">
              <span>${t("fieldMapCopyDst")}</span>
              <input class="map-copy-dst" type="text" maxlength="4" value="${(block.mapCopyDst || "0400").toUpperCase()}" placeholder="0400">
            </label>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;column-gap:calc(6px * var(--block-scale));row-gap:calc(3px * var(--block-scale));margin-top:calc(4px * var(--block-scale))">
            <span style="font-size:calc(0.7rem * var(--block-scale));color:var(--muted);grid-area:1/1">${t("fieldMapCopySize")}</span>
            <input class="map-copy-size" type="number" min="1" max="65000" value="${block.mapCopySize || 1000}" style="grid-area:2/1">
            <label style="display:flex;align-items:center;gap:4px;font-size:0.72rem;color:var(--muted);white-space:nowrap;cursor:pointer;grid-area:2/2;align-self:center">
              <input class="map-copy-combined mini-checkbox" type="checkbox"${isCombined ? " checked" : ""}> ${t("fieldMapCopyCombined")}
            </label>
          </div>
          <div class="macro-grid map-copy-color-row"${isCombined ? ' style="display:none"' : ""}>
            <label class="mini-field">
              <span>${t("fieldMapCopyColorSrc")}</span>
              <input class="map-copy-color-src" type="text" maxlength="4" value="${(block.mapCopyColorSrc || "").toUpperCase()}" placeholder="">
            </label>
            <label class="mini-field">
              <span>${t("fieldMapCopyColorDst")}</span>
              <input class="map-copy-color-dst" type="text" maxlength="4" value="${(block.mapCopyColorDst || "D800").toUpperCase()}" placeholder="D800">
            </label>
          </div>
          <div class="macro-grid map-copy-combined-dst-row"${!isCombined ? ' style="display:none"' : ""}>
            <label class="mini-field">
              <span>${t("fieldMapCopyColorDst")}</span>
              <input class="map-copy-color-dst" type="text" maxlength="4" value="${(block.mapCopyColorDst || "D800").toUpperCase()}" placeholder="D800">
            </label>
          </div>
        `
      );
    } else if (block.isSpriteAnimMacro) {
      inlineField.hidden = true;
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid">
            <label class="mini-field">
              <span>${t("fieldAnimSpriteNum")}</span>
              <input class="anim-sprite-num" type="number" min="0" max="7" value="${block.animSpriteNum || "0"}">
            </label>
            <label class="mini-field">
              <span>${t("fieldAnimFrameCount")}</span>
              <input class="anim-frame-count" type="number" min="1" max="255" value="${block.animFrameCount || 4}">
            </label>
          </div>
          <div class="macro-grid">
            <label class="mini-field">
              <span>${t("fieldAnimFrameListAddr")}</span>
              <input class="anim-frame-list-addr" type="text" maxlength="4" value="${(block.animFrameListAddr || "C100").toUpperCase()}" placeholder="C100">
            </label>
            <label class="mini-field">
              <span>${t("fieldAnimFrameZP")}</span>
              <input class="anim-frame-zp" type="text" maxlength="2" value="${(block.animFrameZP || "FB").toUpperCase()}" placeholder="FB">
            </label>
          </div>
        `
      );
    } else if (block.isScoreBcdMacro) {
      inlineField.hidden = true;
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid">
            <label class="mini-field">
              <span>${t("fieldScoreBcdAddr")}</span>
              <input class="score-bcd-addr" type="text" maxlength="4" value="${(block.scoreBcdAddr || "C200").toUpperCase()}" placeholder="C200">
            </label>
            <label class="mini-field">
              <span>${t("fieldScoreDigits")}</span>
              <select class="score-digits">
                <option value="2"${(block.scoreDigits || 4) === 2 ? " selected" : ""}>2</option>
                <option value="4"${(block.scoreDigits || 4) === 4 ? " selected" : ""}>4</option>
                <option value="6"${block.scoreDigits === 6 ? " selected" : ""}>6</option>
              </select>
            </label>
          </div>
          <div class="macro-grid">
            <label class="mini-field">
              <span>${t("fieldScoreAddPoints")}</span>
              <input class="score-add-points" type="number" min="0" max="999999" value="${block.scoreAddPoints || 100}">
            </label>
            <label class="mini-field">
              <span>${t("fieldScoreScreenAddr")}</span>
              <input class="score-screen-addr" type="text" maxlength="4" value="${(block.scoreScreenAddr || "0400").toUpperCase()}" placeholder="0400">
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
    } else if (block.isExoDecrunchMacro) {
      inlineField.hidden = true;
      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid">
            <label class="mini-field">
              <span>${t("fieldExoDepackerAddr")}</span>
              <input class="exo-depacker-addr" type="text" maxlength="5" value="${escapeHtmlAttribute(block.exoDepackerAddr || "B000")}" placeholder="B000">
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
              <span>${currentLanguage !== "hu" ? "C64 addr" : "C64 cim"}</span>
              <input class="reu-c64-addr" type="text" maxlength="5" value="${block.reuC64Addr || "C000"}" placeholder="C000">
            </label>
            <label class="mini-field">
              <span>${currentLanguage !== "hu" ? "REU addr" : "REU cim"}</span>
              <input class="reu-exp-addr" type="text" maxlength="5" value="${block.reuExpAddr || "0000"}" placeholder="0000">
            </label>
          </div>
          <div class="macro-grid">
            <label class="mini-field">
              <span>${currentLanguage !== "hu" ? "Bank (0–7)" : "Bank (0–7)"}</span>
              <input class="reu-bank" type="number" min="0" max="7" value="${block.reuBank || "0"}">
            </label>
            <label class="mini-field">
              <span>${currentLanguage !== "hu" ? "Length (hex)" : "Hossz (hex)"}</span>
              <input class="reu-length" type="text" maxlength="5" value="${block.reuLength || "0100"}" placeholder="0100">
            </label>
          </div>
        `
      );
    } else if (block.isDefineMacro) {
      inlineField.querySelector("span").textContent = currentLanguage !== "hu" ? "Symbol" : "Szimbolum";
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
              <span>${currentLanguage !== "hu" ? "Name" : "Nev"}</span>
              <input class="const-name" type="text" value="${block.constName || "MY_CONST"}" placeholder="MY_CONST">
            </label>
            <label class="mini-field">
              <span>${currentLanguage !== "hu" ? "Value" : "Ertek"}</span>
              <input class="const-value" type="text" value="${block.rawOperand || "0000"}" placeholder="${block.base === "hex" ? "0400" : "1024"}">
            </label>
            <label class="mini-field">
              <span>${currentLanguage !== "hu" ? "Format" : "Formatum"}</span>
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
      inlineField.querySelector("span").textContent = currentLanguage !== "hu" ? "Condition" : "Feltetel";
      inlineField.hidden = false;
      operandField.value = block.ifCondition || "";
      operandField.placeholder = "DEBUG";
      operandField.addEventListener("input", (event) => updateProgramBlock(index, "rawOperand", event.target.value));
    } else if (block.isElseMacro || block.isEndIfMacro) {
      inlineField.hidden = true;
    } else if (block.isMacroDefStart) {
      blockControls.insertAdjacentHTML("beforeend", `
        <div class="macro-grid">
          <label class="mini-field">
            <span>${currentLanguage !== "hu" ? "Macro name" : "Makro nev"}</span>
            <input class="macro-def-name" type="text" value="${block.macroName || ""}" placeholder="my_macro">
          </label>
          <label class="mini-field">
            <span>${currentLanguage !== "hu" ? "Params (comma-sep.)" : "Paraméterek (vesszővel)"}</span>
            <input class="macro-def-params" type="text" value="${block.macroParams || ""}" placeholder="color, addr">
          </label>
        </div>
      `);
      inlineField.hidden = true;
      blockControls.querySelector(".macro-def-name")?.addEventListener("input", (e) => updateProgramBlock(index, "macroName", e.target.value));
      blockControls.querySelector(".macro-def-params")?.addEventListener("input", (e) => updateProgramBlock(index, "macroParams", e.target.value));
    } else if (block.isMacroDefEnd) {
      inlineField.hidden = true;
    } else if (block.isRegionMacro) {
      inlineField.hidden = false;
      inlineField.querySelector("span").textContent = currentLanguage !== "hu" ? "Region name" : "Régió neve";
      operandField.value = block.regionName || "region";
      operandField.disabled = false;
      operandField.placeholder = currentLanguage !== "hu" ? "for example init_section" : "peldaul init_szekció";
      operandField.addEventListener("input", (event) => {
        updateProgramBlock(index, "regionName", event.target.value);
      });
      collapseToggle.insertAdjacentHTML(
        "beforebegin",
        `<div class="region-topline-btns">
          <button type="button" class="region-expand-all-btn" title="${currentLanguage !== "hu" ? "Expand all blocks in region" : "Régió blokkjainak kinyitása"}">&#8597;</button>
          <button type="button" class="region-select-asm-btn" title="${currentLanguage !== "hu" ? "Select region range in ASM view" : "Régió kijelölése az ASM nézetben"}">&#9678;</button>
          <button type="button" class="region-copy-btn" title="${currentLanguage !== "hu" ? "Copy region with all blocks" : "Régió másolása az összes blokkal"}">&#10697;</button>
          <button type="button" class="region-paste-btn" title="${currentLanguage !== "hu" ? "Paste copied region after this region" : "Másolt régió beillesztése e régió után"}" style="${_clipboardRegion ? '' : 'opacity:0.4'}">&#9112;</button>
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
      inlineField.querySelector("span").textContent = currentLanguage !== "hu" ? "Region" : "Régió";
      operandField.value = matchingRegionName;
      operandField.disabled = true;
    } else if (block.isMacroInvoke) {
      // INVOKE block: show dropdown with available macros
      const macroNames = Object.keys(userMacros);
      const options = macroNames.length > 0
        ? macroNames.map(name => `<option value="${name}"${block.invokeMacroName === name ? " selected" : ""}>${name}</option>`).join("")
        : `<option value="">${currentLanguage !== "hu" ? "No macros defined" : "Nincs definialva makro"}</option>`;

      const selectedMacro = block.invokeMacroName && userMacros[block.invokeMacroName];
      const paramNames = selectedMacro ? (userMacros[block.invokeMacroName].params || []) : [];
      const paramPlaceholder = paramNames.length ? paramNames.map(p => `{${p}}`).join(", ") : "";

      blockControls.insertAdjacentHTML(
        "beforeend",
        `
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${currentLanguage !== "hu" ? "Macro name" : "Makro nev"}</span>
              <select class="invoke-macro-select">
                ${options}
              </select>
            </label>
          </div>
          <div class="macro-grid single-macro-row">
            <label class="mini-field">
              <span>${currentLanguage !== "hu" ? "Arguments" : "Argumentumok"}${paramPlaceholder ? " (" + paramPlaceholder + ")" : ""}</span>
              <input class="invoke-macro-args" type="text" value="${(block.invokeArgs || "").replace(/"/g, "&quot;")}" placeholder="${paramPlaceholder || currentLanguage !== "hu" ? "arg1, arg2" : "arg1, arg2"}">
            </label>
          </div>
        `
      );
      inlineField.hidden = true;
      blockControls.querySelector(".invoke-macro-args")?.addEventListener("input", (e) => updateProgramBlock(index, "invokeArgs", e.target.value));
    } else {
      inlineField.querySelector("span").textContent = t("fieldOperand");
      inlineField.hidden = !mode.needsOperand || !!block.isTableMacro;
      operandField.value = block.rawOperand || "";
      operandField.disabled = !mode.needsOperand || !!block.isTableMacro;
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
    const petsciiNullCheck = node.querySelector(".petscii-null-check");
    if (petsciiNullCheck) {
      petsciiNullCheck.addEventListener("change", (event) => updateProgramBlock(index, "petsciiNullTerminated", event.target.checked));
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
    const mapCopySrcInput = node.querySelector(".map-copy-src");
    if (mapCopySrcInput) mapCopySrcInput.addEventListener("input", e => updateProgramBlock(index, "mapCopySrc", e.target.value.toUpperCase()));
    const mapCopyDstInput = node.querySelector(".map-copy-dst");
    if (mapCopyDstInput) mapCopyDstInput.addEventListener("input", e => updateProgramBlock(index, "mapCopyDst", e.target.value.toUpperCase()));
    const mapCopySizeInput = node.querySelector(".map-copy-size");
    if (mapCopySizeInput) mapCopySizeInput.addEventListener("input", e => updateProgramBlock(index, "mapCopySize", parseInt(e.target.value, 10) || 1000));
    const mapCopyCombinedChk = node.querySelector(".map-copy-combined");
    if (mapCopyCombinedChk) {
      mapCopyCombinedChk.addEventListener("change", e => {
        const combined = e.target.checked;
        updateProgramBlock(index, "mapCopyCombined", combined);
        const colorRow = node.querySelector(".map-copy-color-row");
        const combinedDstRow = node.querySelector(".map-copy-combined-dst-row");
        if (colorRow) colorRow.style.display = combined ? "none" : "";
        if (combinedDstRow) combinedDstRow.style.display = combined ? "" : "none";
      });
    }
    const mapCopyColorSrcInput = node.querySelector(".map-copy-color-src");
    if (mapCopyColorSrcInput) mapCopyColorSrcInput.addEventListener("input", e => updateProgramBlock(index, "mapCopyColorSrc", e.target.value.toUpperCase()));
    node.querySelectorAll(".map-copy-color-dst").forEach(el => el.addEventListener("input", e => updateProgramBlock(index, "mapCopyColorDst", e.target.value.toUpperCase())));
    const animSpriteNumInput = node.querySelector(".anim-sprite-num");
    if (animSpriteNumInput) animSpriteNumInput.addEventListener("input", e => updateProgramBlock(index, "animSpriteNum", parseInt(e.target.value, 10)));
    const animFrameCountInput = node.querySelector(".anim-frame-count");
    if (animFrameCountInput) animFrameCountInput.addEventListener("input", e => updateProgramBlock(index, "animFrameCount", parseInt(e.target.value, 10)));
    const animFrameListAddrInput = node.querySelector(".anim-frame-list-addr");
    if (animFrameListAddrInput) animFrameListAddrInput.addEventListener("input", e => updateProgramBlock(index, "animFrameListAddr", e.target.value.toUpperCase()));
    const animFrameZPInput = node.querySelector(".anim-frame-zp");
    if (animFrameZPInput) animFrameZPInput.addEventListener("input", e => updateProgramBlock(index, "animFrameZP", e.target.value.toUpperCase()));
    const scoreBcdAddrInput = node.querySelector(".score-bcd-addr");
    if (scoreBcdAddrInput) scoreBcdAddrInput.addEventListener("input", e => updateProgramBlock(index, "scoreBcdAddr", e.target.value.toUpperCase()));
    const scoreDigitsSelect = node.querySelector(".score-digits");
    if (scoreDigitsSelect) scoreDigitsSelect.addEventListener("change", e => updateProgramBlock(index, "scoreDigits", parseInt(e.target.value, 10)));
    const scoreAddPointsInput = node.querySelector(".score-add-points");
    if (scoreAddPointsInput) scoreAddPointsInput.addEventListener("input", e => updateProgramBlock(index, "scoreAddPoints", e.target.value));
    const scoreScreenAddrInput = node.querySelector(".score-screen-addr");
    if (scoreScreenAddrInput) scoreScreenAddrInput.addEventListener("input", e => updateProgramBlock(index, "scoreScreenAddr", e.target.value.toUpperCase()));
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
    const exoDepackerAddrInput = node.querySelector(".exo-depacker-addr");
    if (exoDepackerAddrInput) {
      exoDepackerAddrInput.addEventListener("input", (event) => updateProgramBlock(index, "exoDepackerAddr", event.target.value));
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
    asmPlainText = `*= ${layout.origin.text}\n; ${currentLanguage !== "hu" ? "The C64 assembly source will appear here" : "Itt fog megjelenni a C64 assembly kod"}`;
    asmDisplayText = withAsmLineNumbers(asmPlainText);
    asmOutput.innerHTML = highlightAsmHtml(asmDisplayText);
    renderMonitorOutput(layout);
    renderDisasmOutput();
    return;
  }

  const deferredDataSections = [];
  const codeLines = layout.lines.map((line, index) => {
    const lineNumber = `${(index + 1).toString().padStart(2, "0")}`;

    // Blank line block → empty line in ASM output
    if (line.block.isBlankLine) {
      return "";
    }

    // Handle conditionally skipped blocks (inactive IF branch)
    if (line.conditionallySkipped) {
      const summary = line.block.operand || "";
      return `; [IF skipped] ${line.block.mnemonic}${summary ? " " + summary : ""}`;
    }

    // Handle INVOKE block header line
    if (line.block._isMacroInvokeHeader) {
      const args = line.block.invokeArgs ? `(${line.block.invokeArgs})` : "";
      return `; .${line.block.invokeSyntax || "invoke"} ${line.block.invokeMacroName || "?"}${args}`;
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
    // Only intercept labels and comments here (to suppress the address annotation).
    // All other block types (LOOP, NEXT, REGION, regular instructions, etc.) fall
    // through to their own rendering code below so they render correctly.
    if (line.block._fromMacro) {
      if (line.block.isAnonymousLabel) return `-`;
      if (line.block.isLabel) return `${line.block.labelName}:`;
      if (line.block.isComment) return `; ${line.block.rawOperand || ""}`;
      // fall through to normal rendering for everything else
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
      const chunks = chunkBytes(asmBytes, 8);
      return chunks.map(chunk => `    .byte ${chunk.map(b => toHex(b, 2)).join(", ")}`).join("\n");
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
      return `; .incbin "${fileName}" @ ${formatAddress(startAddress)} (${currentLanguage !== "hu" ? "no file loaded" : "nincs betoltott fajl"})`;
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
      return `; .sid "${fileName}" (${currentLanguage !== "hu" ? "no file loaded" : "nincs betoltott fajl"})`;
    }

    if (line.block.isIncludeMacro) {
      const count = (line.block.includedBlocks || []).length;
      const fname = line.block.includeFileName || "?";
      const addrNote = line.block.includeAddress ? ` @ $${line.block.includeAddress.replace(/^\$/, "").toUpperCase().padStart(4, "0")}` : "";
      if (count === 0) return `; .include "${fname}"${addrNote} (${currentLanguage !== "hu" ? "no blocks loaded" : "nincsenek blokkok betoltve"})`;
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
      const nullNote = line.block.petsciiNullTerminated ? ", null" : "";
      const expanded = chunkBytes(chars, 16).map((chunk, chunkIndex) => {
        const chunkAddress = startAddress + (chunkIndex * 16);
        const byteList = chunk.map((byte) => toHex(byte, 2)).join(", ");
        return `    ; ${formatAddress(chunkAddress)}\n    .byte ${byteList}`;
      }).join("\n");
      const nullLine = line.block.petsciiNullTerminated ? `\n    ; ${formatAddress(startAddress + chars.length)}\n    .byte 00  ; null terminator` : "";
      deferredDataSections.push({
        address: startAddress,
        text: `${line.block.macroLabel ? line.block.macroLabel.trim() : `petscii_${lineNumber}`}:\n    ; .petscii "${line.block.rawOperand || ""}"${nullNote} -> ${formatAddress(startAddress)}\n${expanded}${nullLine}`
      });
      const petsciiLabel = line.block.macroLabel ? line.block.macroLabel.trim() : `petscii_${lineNumber}`;
      return `; .petscii ${petsciiLabel}`;
    }

    if (line.block.isLoopMacro || line.block.isForMacro) {
      const reg = line.block.loopReg || "X";
      const rawCount = (line.block.loopCount || "00").trim();
      const parsedCount = parseNumberByBase(rawCount, line.block.base || "hex") ?? NaN;
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
      const parsedCount = parseNumberByBase(rawCount, line.block.base || "hex") ?? NaN;
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
      const chunks = chunkBytes(words, 4);
      return chunks.map(chunk => `    .word ${chunk.map(w => `$${toHex(w, 4)}`).join(", ")}`).join("\n");
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
      const params = line.block.macroParams ? `(${line.block.macroParams})` : "";
      return `; .MACRO ${line.block.macroName || "?"}${params}`;
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

    if (line.block.isMapCopyMacro) {
      const src = (line.block.mapCopySrc || "C000").toUpperCase();
      const dst = (line.block.mapCopyDst || "0400").toUpperCase();
      const sz = line.block.mapCopySize || 1000;
      const colPart = line.block.mapCopyCombined
        ? `, auto, $${(line.block.mapCopyColorDst || "D800").toUpperCase()}`
        : line.block.mapCopyColorSrc ? `, $${line.block.mapCopyColorSrc.toUpperCase()}, $${(line.block.mapCopyColorDst || "D800").toUpperCase()}` : "";
      return `; .map_copy $${src}, $${dst}, ${sz}${colPart}`;
    }

    if (line.block.isSpriteAnimMacro) {
      return `; .sprite_anim ${line.block.animSpriteNum || 0}, $${(line.block.animFrameListAddr || "C100").toUpperCase()}, ${line.block.animFrameCount || 4}, $${(line.block.animFrameZP || "FB").toUpperCase()}`;
    }

    if (line.block.isScoreBcdMacro) {
      return `; .score_bcd $${(line.block.scoreBcdAddr || "C200").toUpperCase()}, ${line.block.scoreDigits || 4}, ${line.block.scoreAddPoints || 100}, $${(line.block.scoreScreenAddr || "0400").toUpperCase()}`;
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

  layout.lines.forEach((line) => addLayoutLabels(labels, line));
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
        decompressAddress: e.decompressAddress || "",
        crunch: e.crunch || false,
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

async function loadExoMulticolorDemo() {
  const ok = await loadSampleFromFile("exo-multicolor-demo");
  if (!ok) return;

  if (window.electronAPI?.loadIncBinSampleFile) {
    const result = await window.electronAPI.loadIncBinSampleFile("exo-decrunch.bin");
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

  if (sampleSelect.value === "exo-multicolor-demo") {
    loadExoMulticolorDemo();
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

const TUTORIAL_DATA = window.TUTORIAL_DATA || { categories: [], lessons: [] };

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
let _tourRepositionRaf = 0;

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
        mnemonic: "LDA",
        addressingMode: "absolute",
        operand: "",
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
        mnemonic: "LDA",
        addressingMode: "absolute",
        operand: "",
        base: "hex"
      });
      break;
    case "prep-rts-block":
      _tutorialSetPaletteSelection({
        category: "Ugrasok",
        mnemonic: "JMP",
        addressingMode: "implied",
        operand: ""
      });
      break;
    case "prep-jsr-clearscreen":
      _tutorialSetPaletteSelection({
        category: "Ugrasok",
        mnemonic: "JMP",
        addressingMode: "absolute",
        operand: "",
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
    case "prep-sei":
      _tutorialSetPaletteSelection({
        category: "Rendszer",
        mnemonic: "CLC",
        addressingMode: "implied",
        operand: ""
      });
      break;
    case "prep-lda-black":
      _tutorialSetPaletteSelection({
        category: "Adatmozgas",
        mnemonic: "LDX",
        addressingMode: "immediate",
        operand: "",
        base: "hex"
      });
      break;
    case "prep-text-hello-c64":
      _tutorialSetPaletteSelection({
        category: "Makrok",
        mnemonic: "BYTE",
        operand: ""
      });
      break;
    case "prep-text-visual-assembler":
      _tutorialSetPaletteSelection({
        category: "Makrok",
        mnemonic: "BYTE",
        operand: ""
      });
      break;
    case "open-settings-dialog": {
      const dlg = document.getElementById("hardware-settings-dialog");
      if (dlg) {
        // Force NON-MODAL show — even if the user clicked the settings button
        // earlier and the dialog is currently modal. Non-modal dialogs don't
        // enter the top-layer, don't have a backdrop, and don't block events
        // on the tour-card popover. If we left the dialog modal, the backdrop
        // sits above the page below the popovers, but in some browser/timing
        // paths events on the tour card still get swallowed.
        try { if (dlg.open) dlg.close(); } catch (_) {}
        try { dlg.show(); } catch (_) {
          // Fall back to showModal if show() is unavailable.
          try { dlg.showModal(); } catch (_) {}
        }
        // Re-elevate tour popovers above the dialog (safety net for showModal
        // fallback path — for the non-modal happy path it's a no-op).
        const reElevateTour = () => {
          const _ov = document.getElementById("tour-overlay");
          const _sp = document.getElementById("tour-spotlight");
          const _tc = document.getElementById("tour-card");
          try { if (_ov?.matches(":popover-open")) { _ov.hidePopover(); _ov.showPopover(); } } catch (_) {}
          try { if (_sp?.matches(":popover-open")) { _sp.hidePopover(); _sp.showPopover(); } } catch (_) {}
          try { if (_tc?.matches(":popover-open")) { _tc.hidePopover(); _tc.showPopover(); } } catch (_) {}
        };
        reElevateTour();
        setTimeout(reElevateTour, 350);
      }
      break;
    }
    case "close-settings-dialog":
      try { document.getElementById("hardware-settings-dialog")?.close(); } catch (_) {}
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
  if (!_tourInteractiveMode || !step?.target) return;

  const targetEl = document.querySelector(step.target);
  if (!targetEl) return;

  const cleanups = [];

  const advance = () => {
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

  if (step.advanceOnTargetClick) {
    const onClick = () => advance();
    targetEl.addEventListener("click", onClick);
    cleanups.push(() => targetEl.removeEventListener("click", onClick));
  }

  if (step.advanceOnTargetChange) {
    const onChange = () => {
      if (!_tourTargetValueMatches(step, targetEl.value)) {
        return;
      }
      advance();
    };
    targetEl.addEventListener("change", onChange);
    cleanups.push(() => targetEl.removeEventListener("change", onChange));
  }

  if (step.advanceOnTargetInput) {
    const onInput = () => {
      if (!_tourTargetValueMatches(step, targetEl.value)) {
        return;
      }
      advance();
    };
    targetEl.addEventListener("input", onInput);
    cleanups.push(() => targetEl.removeEventListener("input", onInput));
  }

  _tourTargetAdvanceCleanup = () => cleanups.forEach((cleanup) => cleanup());
}

function _tourTargetValueMatches(step, actualValue) {
  if (typeof step?.targetValue === "undefined") return true;

  const actual = String(actualValue ?? "").trim();
  const expected = String(step.targetValue).trim();
  const allowCaseInsensitiveHex = step.target === "#operand-input" && /^[0-9A-F]+$/i.test(expected);

  if (step.caseInsensitiveTargetValue || allowCaseInsensitiveHex) {
    return actual.toUpperCase() === expected.toUpperCase();
  }

  return actual === expected;
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
      <div class="tutorial-category-label">${lang === "hu" ? cat.labelHu : (lang === "es" && cat.labelEs ? cat.labelEs : cat.labelEn)}</div>
      ${catLessons.map(lesson => {
        const done = _tutorialProgress[lesson.id]?.completed;
        const title = lang === "hu" ? lesson.titleHu : (lang === "es" && lesson.titleEs ? lesson.titleEs : lesson.titleEn);
        const stars = lesson.difficulty > 0
          ? `${lesson.difficulty}/3`
          : "TOUR";
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

  const firstBtn = listEl.querySelector(".tutorial-lesson-item");
  if (firstBtn) firstBtn.click();
}

function _tutShowLesson(lessonId) {
  const lang = currentLanguage;
  const lesson = TUTORIAL_DATA.lessons.find(l => l.id === lessonId);
  const contentEl = document.getElementById("tutorial-lesson-content");
  if (!lesson || !contentEl) return;
  const canStartTour = lesson.type === "tour" || lesson.interactive === true;

  const title = lang === "hu" ? lesson.titleHu : (lang === "es" && lesson.titleEs ? lesson.titleEs : lesson.titleEn);
  const desc = lang === "hu" ? lesson.descHu : (lang === "es" && lesson.descEs ? lesson.descEs : lesson.descEn);
  const diffStars = lesson.difficulty > 0
    ? `(${lesson.difficulty}/3)`
    : null;
  const diffLabel = lesson.difficulty === 0 ? "Tour"
    : lesson.difficulty === 1 ? (lang === "hu" ? "Kezdo" : (lang === "es" ? "Principiante" : "Beginner"))
    : lesson.difficulty === 2 ? (lang === "hu" ? "Kozepes" : (lang === "es" ? "Intermedio" : "Intermediate"))
    : (lang === "hu" ? "Halado" : (lang === "es" ? "Avanzado" : "Advanced"));

  const stepsHtml = lesson.steps.map((step, i) => {
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
    ${canStartTour ? `<div class="tutorial-tour-start">
      <button class="primary tutorial-start-tour-btn" type="button">${t("tutorialStartTour")}</button>
    </div>` : ""}
    <div class="tutorial-steps">${stepsHtml}</div>
    <div class="tutorial-content-footer">
      <button class="primary tutorial-mark-done-btn" type="button"></button>
    </div>`;

  contentEl.querySelector(".tutorial-content-title").textContent = title;
  contentEl.querySelector(".tutorial-content-desc").textContent = desc;
  lesson.steps.forEach((step, i) => {
    const stepEl = contentEl.querySelectorAll(".tutorial-step")[i];
    if (!stepEl) return;
    stepEl.querySelector(".tutorial-step-title").textContent = lang === "hu" ? step.titleHu : (lang === "es" && step.titleEs ? step.titleEs : step.titleEn);
    stepEl.querySelector(".tutorial-step-desc").textContent = lang === "hu" ? step.descHu : (lang === "es" && step.descEs ? step.descEs : step.descEn);
    const actionBtn = stepEl.querySelector(".tutorial-step-action-btn");
    if (actionBtn) actionBtn.textContent = lang === "hu" ? step.actionLabelHu : (lang === "es" && step.actionLabelEs ? step.actionLabelEs : step.actionLabelEn);
  });

  contentEl.querySelectorAll(".tutorial-load-sample-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      loadSampleFromFile(btn.dataset.sample);
      document.getElementById("tutorial-dialog")?.close();
    });
  });

  contentEl.querySelectorAll(".tutorial-step-action-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      _runTutorialAction(btn.dataset.actionId);
    });
  });

  const startTourBtn = contentEl.querySelector(".tutorial-start-tour-btn");
  if (startTourBtn) {
    startTourBtn.addEventListener("click", () => {
      document.getElementById("tutorial-dialog")?.close();
      _tourStart(lesson.steps, lessonId, lesson.interactive === true);
    });
  }

  const doneBtn = contentEl.querySelector(".tutorial-mark-done-btn");
  doneBtn.textContent = isDone ? t("tutorialMarkDoneCompleted") : t("tutorialMarkDone");
  doneBtn.addEventListener("click", () => {
    _tutMarkDone(lessonId);
    _tutRenderDialog();
    const listEl = document.getElementById("tutorial-lesson-list");
    const btn = listEl?.querySelector(`[data-lesson-id="${lessonId}"]`);
    if (btn) {
      listEl.querySelectorAll(".tutorial-lesson-item").forEach(b => b.classList.remove("tutorial-lesson-item--active"));
      btn.classList.add("tutorial-lesson-item--active");
    }
    _tutShowLesson(lessonId);
  });
}

function _tourStart(steps, lessonId, interactive = false) {
  if (expertMode) {
    setExpertMode(false);
    if (expertModeToggle) expertModeToggle.checked = false;
  }
  _tourActive = true;
  _tourCurrentStep = 0;
  _tourSteps = steps;
  _tourLessonId = lessonId;
  _tourAllowOverlayClose = true;
  _tourInteractiveMode = interactive;
  _tourPreparedLessonId = null;
  const overlay = document.getElementById("tour-overlay");
  const spotlight = document.getElementById("tour-spotlight");
  const card = document.getElementById("tour-card");
  if (overlay) overlay.style.pointerEvents = interactive ? "none" : "all";
  // Add to top-layer in order: overlay → spotlight → card (last = topmost)
  if (!overlay?.matches(":popover-open")) overlay?.showPopover();
  spotlight.style.visibility = "hidden"; // start invisible, position per step
  if (!spotlight?.matches(":popover-open")) spotlight?.showPopover();
  if (!card?.matches(":popover-open")) card?.showPopover();
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
    if (!_tourMenuOpened) return;
    const menuDetails = document.querySelector(".control-menu");
    const menuPanel = document.querySelector(".control-menu-panel");
    if (menuDetails?.open) {
      menuDetails.classList.add("tour-menu-open");
      menuPanel?.classList.add("menu-opening");
      _tourMenuSyncRaf = requestAnimationFrame(sync);
      return;
    }
    _tourMenuSyncRaf = 0;
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
  if (cardTitle) cardTitle.textContent = lang === "hu" ? step.titleHu : (lang === "es" && step.titleEs ? step.titleEs : step.titleEn);
  if (cardDesc) cardDesc.textContent = lang === "hu" ? step.descHu : (lang === "es" && step.descEs ? step.descEs : step.descEn);
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
    // Poll up to ~1.5s for the target element to appear AND have a non-zero
    // bounding box. Handles cases where onEnterActionId opens a dialog and the
    // target is inside that dialog (layout may take a few frames).
    const doPosition = (attemptsLeft = 30) => {
      const targetEl = document.querySelector(step.target);
      if (!spotlight) return;
      if (!targetEl) {
        if (attemptsLeft > 0) setTimeout(() => doPosition(attemptsLeft - 1), 50);
        return;
      }
      if (typeof targetEl.scrollIntoView === "function") {
        targetEl.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
      }
      requestAnimationFrame(() => {
        const rect = targetEl.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) {
          if (attemptsLeft > 0) {
            setTimeout(() => doPosition(attemptsLeft - 1), 50);
          }
          return;
        }
        _positionSpotlightAndCard(spotlight, card, rect, step);
      });
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
      if (step.target === "#sample-programs-group") sampleProgramsGroup?.classList.add("tour-sample-highlight");
      _tourMenuOpened = true;
      _tourStartMenuSync();
      // 250 ms: enough for menu slide-in animation to complete before measuring
      setTimeout(() => {
        requestAnimationFrame(doPosition);
      }, 250);
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
    if (spotlight) spotlight.style.visibility = "hidden";
    _tourCenterCard(card);
  }
}

function _applyTourSpotlightPosition(spotlight, card, rect, step) {
  const pad = 8;
  spotlight.style.left = (rect.left - pad) + "px";
  spotlight.style.top = (rect.top - pad) + "px";
  spotlight.style.width = (rect.width + pad * 2) + "px";
  spotlight.style.height = (rect.height + pad * 2) + "px";
  spotlight.style.visibility = "visible";
  if (step.centerCard) {
    _tourCenterCard(card);
  } else {
    _tourPositionCard(card, rect);
  }
}

function _positionSpotlightAndCard(spotlight, card, rect, step) {
  _applyTourSpotlightPosition(spotlight, card, rect, step);
  _tourBindTargetAdvance(step);
}

function _tourRefreshCurrentStepPosition() {
  if (!_tourActive) return;
  const step = _tourSteps[_tourCurrentStep];
  if (!step?.target) return;

  const spotlight = document.getElementById("tour-spotlight");
  const card = document.getElementById("tour-card");
  const targetEl = document.querySelector(step.target);
  if (!spotlight || !card || !targetEl) return;

  const rect = targetEl.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return;
  _applyTourSpotlightPosition(spotlight, card, rect, step);
}

function _tourScheduleReposition() {
  if (!_tourActive) return;
  if (_tourRepositionRaf) return;
  _tourRepositionRaf = requestAnimationFrame(() => {
    _tourRepositionRaf = 0;
    _tourRefreshCurrentStepPosition();
  });
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
  if (_tourRepositionRaf) {
    cancelAnimationFrame(_tourRepositionRaf);
    _tourRepositionRaf = 0;
  }
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
  if (overlay?.matches(":popover-open")) overlay.hidePopover();
  if (spotlight?.matches(":popover-open")) spotlight.hidePopover();
  if (card?.matches(":popover-open")) card.hidePopover();
  if (_tourLessonId) _tutMarkDone(_tourLessonId);
}

function _initTutorialEvents() {
  const tutBtn = document.getElementById("tutorial-btn");
  const tutDlg = document.getElementById("tutorial-dialog");
  const tutClose = document.getElementById("tutorial-close");

  tutBtn?.addEventListener("click", () => openTutorialDialog());
  tutClose?.addEventListener("click", () => tutDlg?.close());

  document.getElementById("tour-next")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
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
    } catch (err) {
      console.error("tour-next failed:", err);
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

  window.addEventListener("scroll", _tourScheduleReposition, { capture: true, passive: true });
  window.addEventListener("resize", _tourScheduleReposition, { passive: true });
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

/* ─── C64 Color Palette ─────────────────────────────────── */
const _C64_COLORS = [
  {n:"Black",       hex:"#000000"}, {n:"White",       hex:"#FFFFFF"},
  {n:"Red",         hex:"#9F4E44"}, {n:"Cyan",        hex:"#6ABFC6"},
  {n:"Purple",      hex:"#A057A3"}, {n:"Green",       hex:"#5CAB5E"},
  {n:"Blue",        hex:"#50459B"}, {n:"Yellow",      hex:"#C9D487"},
  {n:"Orange",      hex:"#A1683C"}, {n:"Brown",       hex:"#6D5412"},
  {n:"Light Red",   hex:"#CB7E75"}, {n:"Dark Grey",   hex:"#626262"},
  {n:"Med. Grey",   hex:"#898989"}, {n:"Light Green", hex:"#9AE29B"},
  {n:"Light Blue",  hex:"#887ECB"}, {n:"Light Grey",  hex:"#ADADAD"},
];

// C64 colour palette now lives in the ASM view's Toolkit tab.
function _buildToolkitPalette() {
  const grid = document.getElementById("toolkit-palette");
  if (!grid || grid.children.length > 0) return;
  _C64_COLORS.forEach((color, i) => {
    const item = document.createElement("div");
    item.className = "c64-palette-item";
    const swatch = document.createElement("div");
    swatch.className = "c64-palette-swatch";
    swatch.style.background = color.hex;
    swatch.title = "Click to copy";
    swatch.addEventListener("click", () => {
      navigator.clipboard.writeText(String(i)).catch(() => {});
    });
    const label = document.createElement("div");
    label.className = "c64-palette-label";
    label.textContent = i + ": " + color.n;
    item.appendChild(swatch);
    item.appendChild(label);
    grid.appendChild(item);
  });
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




// ── C64 Character ROM Viewer ─────────────────────────────────────

// Character names / display strings for Set 1 (uppercase/graphics)
// Index = screen code 0-127 (reversed chars 128-255 use base = sc-128)
const _C64_ROM_CHARS = [
  // SC 0-31: @A-Z[\£]↑←
  "@","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O",
  "P","Q","R","S","T","U","V","W","X","Y","Z","[","£","]","↑","←",
  // SC 32-63: printable ASCII
  " ","!",'"',"#","$","%","&","'","(",")","*","+",",","-",".","/",
  "0","1","2","3","4","5","6","7","8","9",":",";","<","=",">","?",
  // SC 64-95: C64 graphics block 1
  "─","♠","│","╮","╰","╯","╲","╱","├","▒","└","┐","┌","┼","▔","▗",
  "▁","▂","▃","▄","▅","▆","▇","█","▏","▎","▍","▌","▋","▊","▉","▔",
  // SC 96-127: C64 graphics block 2
  "╲","♣","┤","─","▊","║","┼","▓","─","▒","●","█","○","►","◄","▲",
  "▼","┼","│","├","─","╮","▒","┌","┘","╯","─","╱","●","╭","─","π",
];

const _C64_ROM_CHARS_SET2 = [
  // SC 0-31: @a-z[\£]↑←  (lowercase)
  "@","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o",
  "p","q","r","s","t","u","v","w","x","y","z","[","£","]","↑","←",
  // SC 32-63: printable ASCII (same)
  " ","!",'"',"#","$","%","&","'","(",")","*","+",",","-",".","/",
  "0","1","2","3","4","5","6","7","8","9",":",";","<","=",">","?",
  // SC 64-95: A-Z uppercase (in lowercase charset)
  "─","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O",
  "P","Q","R","S","T","U","V","W","X","Y","Z","[","£","]","↑","←",
  // SC 96-127: C64 graphics block 2 (same as Set 1)
  "╲","♣","┤","─","▊","║","┼","▓","─","▒","●","█","○","►","◄","▲",
  "▼","┼","│","├","─","╮","▒","┌","┘","╯","─","╱","●","╭","─","π",
];

// Return the character name/string for display for a given screen code
function _c64RomDisplayChar(sc, set) {
  const base = sc >= 128 ? sc - 128 : sc;
  const chars = set === 2 ? _C64_ROM_CHARS_SET2 : _C64_ROM_CHARS;
  return chars[base] !== undefined ? chars[base] : " ";
}

// PETSCII code for info display only (not used for font rendering)
function _c64RomPetsciiCode(sc) {
  const base = sc >= 128 ? sc - 128 : sc;
  if (base <= 31)  return base + 64;
  if (base <= 63)  return base;
  if (base <= 95)  return base + 32;
  return base + 96;
}

// Extract 8x8 bitmap via canvas
let _c64RomCanvas = null;
function _c64RomBitmapData(sc, set) {
  const S = 8;          // device px per C64 pixel
  const N = 8 * S;      // 64×64 canvas
  if (!_c64RomCanvas) _c64RomCanvas = document.createElement("canvas");
  if (_c64RomCanvas.width !== N) { _c64RomCanvas.width = N; _c64RomCanvas.height = N; }
  const ctx = _c64RomCanvas.getContext("2d");
  ctx.clearRect(0, 0, N, N);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, N, N);
  ctx.fillStyle = "#ffffff";
  ctx.font = N + "px C64ProMono";   // 64px → 8 C64 px, each 8 device px
  ctx.textBaseline = "top";
  ctx.fillText(_c64RomDisplayChar(sc, set), 0, 0);
  const img = ctx.getImageData(0, 0, N, N).data;
  const bits = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      // Coverage over the inner area of each S×S cell (skip 1px edges to avoid AA bleed)
      let lit = 0, total = 0;
      for (let dy = 1; dy < S - 1; dy++) {
        for (let dx = 1; dx < S - 1; dx++) {
          const idx = ((row * S + dy) * N + (col * S + dx)) * 4;
          if (img[idx] > 96) lit++;
          total++;
        }
      }
      bits.push(lit * 2 >= total ? 1 : 0);
    }
  }
  // Invert for reversed chars (SC 128-255)
  if (sc >= 128) return bits.map(function(b) { return b ^ 1; });
  return bits;
}

let _c64ChrromSet = 1;
let _c64ChrromSelected = -1;
function _buildC64CharRomGrid() {
  const grid = document.getElementById("c64-chrrom-grid");
  if (!grid) return;
  grid.innerHTML = "";
  for (let sc = 0; sc < 256; sc++) {
    const cell = document.createElement("div");
    cell.className = "c64-chrrom-cell" + (sc >= 128 ? " c64-chrrom-cell--rev" : "");
    cell.textContent = _c64RomDisplayChar(sc, _c64ChrromSet);
    cell.dataset.sc = sc;
    cell.addEventListener("click", function() { _c64RomSelect(sc); });
    grid.appendChild(cell);
  }
}

function _c64RomRenderPixgrid(bits) {
  const pixgrid = document.getElementById("c64-chrrom-pixgrid");
  if (!pixgrid) return;
  pixgrid.innerHTML = "";
  bits.forEach(function(b) {
    const px = document.createElement("div");
    px.className = "c64-chrrom-pixel c64-chrrom-pixel--" + (b ? "on" : "off");
    pixgrid.appendChild(px);
  });
}

function _c64RomSelect(sc) {
  document.querySelectorAll(".c64-chrrom-cell").forEach(function(c) { c.classList.remove("c64-chrrom-cell--sel"); });
  const selCell = document.querySelector(".c64-chrrom-cell[data-sc='" + sc + "']");
  if (selCell) selCell.classList.add("c64-chrrom-cell--sel");
  _c64ChrromSelected = sc;

  document.getElementById("c64-chrrom-info-hint").hidden = true;
  const content = document.getElementById("c64-chrrom-info-content");
  if (!content) return;
  content.hidden = false;
  content.innerHTML = "";

  const base = sc >= 128 ? sc - 128 : sc;
  const petscii = _c64RomPetsciiCode(sc);
  const isRev = sc >= 128;
  const chars = _c64ChrromSet === 1 ? _C64_ROM_CHARS : _C64_ROM_CHARS_SET2;
  const ch = _c64RomDisplayChar(sc, _c64ChrromSet);
  const charName = chars[base] || "?";

  // Big char preview box
  const preview = document.createElement("div");
  preview.className = "c64-chrrom-char-preview";
  preview.textContent = ch;
  preview.style.fontFamily = '"C64ProMono", monospace';
  preview.style.color = isRev ? "#352879" : "#6c5eb5";
  preview.style.background = isRev ? "#6c5eb5" : "#352879";
  content.appendChild(preview);

  const nameEl = document.createElement("div");
  nameEl.className = "c64-chrrom-name-val";
  nameEl.textContent = charName;
  content.appendChild(nameEl);

  // Info rows
  [
    ["SC",      sc + " ($" + sc.toString(16).toUpperCase().padStart(2,"0") + ")"],
    ["PETSCII", petscii + " ($" + petscii.toString(16).toUpperCase().padStart(2,"0") + ")"],
    ["Offset",  "$" + (base*8).toString(16).toUpperCase().padStart(4,"0")],
    ["Rev",     isRev ? "Yes" : "No"],
  ].forEach(function(pair) {
    const row = document.createElement("div");
    row.className = "c64-chrrom-info-row";
    const l = document.createElement("span"); l.className = "c64-chrrom-info-lbl"; l.textContent = pair[0];
    const v = document.createElement("span"); v.className = "c64-chrrom-info-val"; v.textContent = pair[1];
    row.appendChild(l); row.appendChild(v);
    content.appendChild(row);
  });

  // Bitmap
  const bits = _c64RomBitmapData(sc, _c64ChrromSet);
  _c64RomRenderPixgrid(bits);

  // Byte rows — structured (fixed-size pixel squares + right-aligned hex)
  const rowsDiv = document.createElement("div");
  rowsDiv.className = "c64-chrrom-pixrows";
  rowsDiv.id = "c64-chrrom-pixrows";
  for (let r = 0; r < 8; r++) {
    let byte = 0;
    const row = document.createElement("div");
    row.className = "c64-chrrom-pixrow";
    const bitsWrap = document.createElement("div");
    bitsWrap.className = "c64-chrrom-pixrow-bits";
    for (let c = 0; c < 8; c++) {
      const b = bits[r*8+c];
      if (b) byte |= (1<<(7-c));
      const bit = document.createElement("div");
      bit.className = "c64-chrrom-bit " + (b ? "c64-chrrom-bit--on" : "c64-chrrom-bit--off");
      bitsWrap.appendChild(bit);
    }
    const hex = document.createElement("span");
    hex.className = "c64-chrrom-pixrow-hex";
    hex.textContent = "$" + byte.toString(16).toUpperCase().padStart(2,"0");
    row.appendChild(bitsWrap);
    row.appendChild(hex);
    rowsDiv.appendChild(row);
  }
  content.appendChild(rowsDiv);

  // Copy button
  const copyBtn = document.createElement("button");
  copyBtn.className = "c64-chrrom-action-btn";
  const _copyLbl = (typeof t === "function" ? t("chrromCopyBytes") : "Copy bytes");
  copyBtn.textContent = _copyLbl;
  copyBtn.addEventListener("click", function() {
    const bytes = [];
    for (let r = 0; r < 8; r++) {
      let byte = 0;
      for (let c = 0; c < 8; c++) { if (bits[r*8+c]) byte |= (1<<(7-c)); }
      bytes.push("$" + byte.toString(16).toUpperCase().padStart(2,"0"));
    }
    navigator.clipboard.writeText(bytes.join(", ")).then(function() {
      copyBtn.textContent = (typeof t === "function" ? t("copied") : "Copied!");
      setTimeout(function() { copyBtn.textContent = _copyLbl; }, 1200);
    });
  });
  content.appendChild(copyBtn);
}

function setupC64CharRom() {
  const dialog = document.getElementById("c64-chrrom-dialog");
  if (!dialog) return;

  document.getElementById("c64-chrrom-btn")?.addEventListener("click", function() {
    document.querySelector(".control-menu")?.removeAttribute("open");
    _buildC64CharRomGrid();
    dialog.showModal();
  });
  document.getElementById("c64-chrrom-close")?.addEventListener("click", function() { dialog.close(); });

  document.getElementById("c64-chrrom-tab1")?.addEventListener("click", function() {
    _c64ChrromSet = 1;
    document.getElementById("c64-chrrom-tab1").classList.add("c64-chrrom-tab--active");
    document.getElementById("c64-chrrom-tab2").classList.remove("c64-chrrom-tab--active");
    _buildC64CharRomGrid();
    if (_c64ChrromSelected >= 0) _c64RomSelect(_c64ChrromSelected);
  });

  document.getElementById("c64-chrrom-tab2")?.addEventListener("click", function() {
    _c64ChrromSet = 2;
    document.getElementById("c64-chrrom-tab2").classList.add("c64-chrrom-tab--active");
    document.getElementById("c64-chrrom-tab1").classList.remove("c64-chrrom-tab--active");
    _buildC64CharRomGrid();
    if (_c64ChrromSelected >= 0) _c64RomSelect(_c64ChrromSelected);
  });


}

/* ═══════════════════════════════════════════════════════
   CHARACTER SET EDITOR
   ═══════════════════════════════════════════════════════ */
const _CE_COLORS = [
  "#000000","#ffffff","#68372b","#70a4b2",
  "#6f3d86","#588d43","#352879","#b8c76f",
  "#6f4f25","#433900","#9a6759","#444444",
  "#6c6c6c","#9ad284","#6c5eb5","#959595"
];

let _ceData = null;
let _ceSel  = 0;
let _ceFg   = 14;   // Light Blue
let _ceBg   = 6;    // Blue
let _cePainting = false;
let _cePaintVal = 1;

function _ceGetBit(charIdx, row, col) {
  if (!_ceData) return 0;
  return (_ceData[charIdx * 8 + row] >> (7 - col)) & 1;
}

function _ceSetBit(charIdx, row, col, val) {
  if (!_ceData) return;
  const i = charIdx * 8 + row;
  if (val) _ceData[i] |= (1 << (7 - col));
  else     _ceData[i] &= ~(1 << (7 - col));
}

function _ceRenderEditor() {
  const grid = document.getElementById("ce-editor-grid");
  if (!grid || !_ceData) return;
  const cells = grid.children;
  const fg = _CE_COLORS[_ceFg];
  const bg = _CE_COLORS[_ceBg];
  for (let i = 0; i < 64; i++) {
    cells[i].style.background = _ceGetBit(_ceSel, i >> 3, i & 7) ? fg : bg;
  }
}

function _ceRenderMap() {
  const canvas = document.getElementById("ce-map-canvas");
  if (!canvas || !_ceData) return;
  const ctx = canvas.getContext("2d");
  const W    = canvas.width;   // 256
  const CELL = W / 16;         // 16 px per char
  const PIX  = CELL / 8;       // 2 px per bit
  const fg   = _CE_COLORS[_ceFg];
  const bg   = _CE_COLORS[_ceBg];

  ctx.clearRect(0, 0, W, W);

  for (let n = 0; n < 256; n++) {
    const cx = (n % 16) * CELL;
    const cy = Math.floor(n / 16) * CELL;

    ctx.fillStyle = n === _ceSel ? "#4a3a9a" : bg;
    ctx.fillRect(cx, cy, CELL, CELL);

    ctx.fillStyle = fg;
    for (let r = 0; r < 8; r++) {
      const byte = _ceData[n * 8 + r];
      for (let c = 0; c < 8; c++) {
        if ((byte >> (7 - c)) & 1) {
          ctx.fillRect(cx + c * PIX, cy + r * PIX, PIX, PIX);
        }
      }
    }

    if (n === _ceSel) {
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(cx + 0.5, cy + 0.5, CELL - 1, CELL - 1);
    }
  }
}

function _ceUpdateInfo() {
  const el = document.getElementById("ce-char-info");
  if (el) el.textContent = (typeof t === "function" ? t("ceCharLabel") : "Char:") + " " + _ceSel + " ($" + _ceSel.toString(16).toUpperCase().padStart(2,"0") + ")";
}

function _ceUpdateAsm() {
  const el = document.getElementById("ce-asm-out");
  if (!el) return;
  if (!_ceData) { el.textContent = ""; return; }
  const n   = _ceSel;
  const hex = n.toString(16).toUpperCase().padStart(2,"0");
  const bytes = [];
  for (let r = 0; r < 8; r++) {
    bytes.push("$" + _ceData[n * 8 + r].toString(16).toUpperCase().padStart(2,"0"));
  }
  el.textContent = "char_" + hex + ":  ; $" + hex + "\n        .byte " + bytes.join(", ");
}

function _ceSelect(n) {
  _ceSel = n;
  _ceUpdateInfo();
  _ceRenderEditor();
  _ceRenderMap();
  _ceUpdateAsm();
}

function _ceClear() {
  if (!_ceData) return;
  for (let r = 0; r < 8; r++) _ceData[_ceSel * 8 + r] = 0;
  _ceRenderEditor(); _ceRenderMap(); _ceUpdateAsm();
}

function _ceInvert() {
  if (!_ceData) return;
  for (let r = 0; r < 8; r++) _ceData[_ceSel * 8 + r] ^= 0xFF;
  _ceRenderEditor(); _ceRenderMap(); _ceUpdateAsm();
}

function _ceFlipH() {
  if (!_ceData) return;
  for (let r = 0; r < 8; r++) {
    let b = _ceData[_ceSel * 8 + r], rev = 0;
    for (let i = 0; i < 8; i++) rev |= ((b >> i) & 1) << (7 - i);
    _ceData[_ceSel * 8 + r] = rev;
  }
  _ceRenderEditor(); _ceRenderMap(); _ceUpdateAsm();
}

function _ceFlipV() {
  if (!_ceData) return;
  const base = _ceSel * 8;
  for (let r = 0; r < 4; r++) {
    const t = _ceData[base + r];
    _ceData[base + r] = _ceData[base + 7 - r];
    _ceData[base + 7 - r] = t;
  }
  _ceRenderEditor(); _ceRenderMap(); _ceUpdateAsm();
}

function _ceShift(dir) {
  if (!_ceData) return;
  const base = _ceSel * 8;
  if (dir === "up") {
    const first = _ceData[base];
    for (let r = 0; r < 7; r++) _ceData[base + r] = _ceData[base + r + 1];
    _ceData[base + 7] = first;
  } else if (dir === "down") {
    const last = _ceData[base + 7];
    for (let r = 7; r > 0; r--) _ceData[base + r] = _ceData[base + r - 1];
    _ceData[base] = last;
  } else if (dir === "left") {
    for (let r = 0; r < 8; r++) {
      const b = _ceData[base + r];
      _ceData[base + r] = ((b << 1) | (b >> 7)) & 0xFF;
    }
  } else {
    for (let r = 0; r < 8; r++) {
      const b = _ceData[base + r];
      _ceData[base + r] = ((b >> 1) | (b << 7)) & 0xFF;
    }
  }
  _ceRenderEditor(); _ceRenderMap(); _ceUpdateAsm();
}

function _ceLoadRom() {
  if (!_ceData) _ceData = new Uint8Array(256 * 8);
  for (let sc = 0; sc < 256; sc++) {
    const bits = _c64RomBitmapData(sc, 1);
    const base = sc * 8;
    for (let r = 0; r < 8; r++) {
      let byte = 0;
      for (let c = 0; c < 8; c++) {
        if (bits[r * 8 + c]) byte |= (1 << (7 - c));
      }
      _ceData[base + r] = byte;
    }
  }
  _ceRenderEditor(); _ceRenderMap(); _ceUpdateAsm();
  showViceToast(t("ceLoadRomDone"), false);
}

function _ceInit() {
  if (_ceData) return;
  _ceData = new Uint8Array(256 * 8);

  const grid = document.getElementById("ce-editor-grid");
  if (grid) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = document.createElement("div");
        cell.className = "ce-pixel";
        cell.dataset.r = r;
        cell.dataset.c = c;
        grid.appendChild(cell);
      }
    }
  }

  const fgEl = document.getElementById("ce-fg-colors");
  const bgEl = document.getElementById("ce-bg-colors");
  if (fgEl && bgEl) {
    _CE_COLORS.forEach(function(hex, i) {
      const mkSwatch = function(container, isFg) {
        const sw = document.createElement("div");
        sw.className = "ce-color-swatch" + ((isFg ? i === _ceFg : i === _ceBg) ? " ce-color-swatch--sel" : "");
        sw.style.background = hex;
        sw.title = "Color " + i;
        sw.addEventListener("click", function() {
          if (isFg) { _ceFg = i; fgEl.querySelectorAll(".ce-color-swatch").forEach(function(s,j){ s.classList.toggle("ce-color-swatch--sel",j===i); }); }
          else       { _ceBg = i; bgEl.querySelectorAll(".ce-color-swatch").forEach(function(s,j){ s.classList.toggle("ce-color-swatch--sel",j===i); }); }
          _ceRenderEditor(); _ceRenderMap();
        });
        container.appendChild(sw);
      };
      mkSwatch(fgEl, true);
      mkSwatch(bgEl, false);
    });
  }
}

function setupCharEditor() {
  const dialog = document.getElementById("char-editor-dialog");
  if (!dialog) return;

  document.getElementById("char-editor-btn")?.addEventListener("click", function() {
    document.querySelector(".control-menu")?.removeAttribute("open");
    _ceInit();
    _ceUpdateInfo();
    _ceRenderEditor();
    _ceRenderMap();
    _ceUpdateAsm();
    dialog.showModal();
  });

  document.getElementById("ce-close")?.addEventListener("click", function() { dialog.close(); });

  const grid = document.getElementById("ce-editor-grid");
  if (grid) {
    const _cePaintAt = function(clientX, clientY, firstHit) {
      const el = document.elementFromPoint(clientX, clientY);
      const cell = el && el.closest ? el.closest(".ce-pixel") : null;
      if (!cell || !grid.contains(cell)) return;
      const r = +cell.dataset.r, c = +cell.dataset.c;
      if (firstHit) {
        _cePaintVal = _ceGetBit(_ceSel, r, c) ? 0 : 1;
      } else if (_ceGetBit(_ceSel, r, c) === _cePaintVal) {
        return;
      }
      _ceSetBit(_ceSel, r, c, _cePaintVal);
      _ceRenderEditor(); _ceRenderMap(); _ceUpdateAsm();
    };
    grid.addEventListener("pointerdown", function(e) {
      if (!_ceData || e.button !== 0) return;
      _cePainting = true;
      try { grid.setPointerCapture(e.pointerId); } catch (_) {}
      _cePaintAt(e.clientX, e.clientY, true);
      e.preventDefault();
    });
    grid.addEventListener("pointermove", function(e) {
      if (!_cePainting || !_ceData) return;
      _cePaintAt(e.clientX, e.clientY, false);
      e.preventDefault();
    });
    const _ceEndPaint = function(e) {
      if (!_cePainting) return;
      _cePainting = false;
      if (e && e.pointerId != null) { try { grid.releasePointerCapture(e.pointerId); } catch (_) {} }
    };
    grid.addEventListener("pointerup", _ceEndPaint);
    grid.addEventListener("pointercancel", _ceEndPaint);
    document.addEventListener("pointerup", _ceEndPaint);
  }

  const mapCanvas = document.getElementById("ce-map-canvas");
  if (mapCanvas) {
    mapCanvas.addEventListener("click", function(e) {
      const rect = mapCanvas.getBoundingClientRect();
      const sx = mapCanvas.width / rect.width;
      const sy = mapCanvas.height / rect.height;
      const cx = (e.clientX - rect.left) * sx;
      const cy = (e.clientY - rect.top)  * sy;
      const CELL = mapCanvas.width / 16;
      const col  = Math.min(15, Math.floor(cx / CELL));
      const row  = Math.min(15, Math.floor(cy / CELL));
      _ceSelect(row * 16 + col);
    });
  }

  document.getElementById("ce-clear")?.addEventListener("click", _ceClear);
  document.getElementById("ce-invert")?.addEventListener("click", _ceInvert);
  document.getElementById("ce-fliph")?.addEventListener("click", _ceFlipH);
  document.getElementById("ce-flipv")?.addEventListener("click", _ceFlipV);
  document.getElementById("ce-shl")?.addEventListener("click", function() { _ceShift("left"); });
  document.getElementById("ce-shr")?.addEventListener("click", function() { _ceShift("right"); });
  document.getElementById("ce-shu")?.addEventListener("click", function() { _ceShift("up"); });
  document.getElementById("ce-shd")?.addEventListener("click", function() { _ceShift("down"); });

  document.getElementById("ce-copy-asm")?.addEventListener("click", function() {
    const el = document.getElementById("ce-asm-out");
    if (!el) return;
    navigator.clipboard.writeText(el.textContent).then(function() {
      const btn = document.getElementById("ce-copy-asm");
      if (btn) { const o = btn.textContent; btn.textContent = (typeof t === "function" ? t("copied") : "Copied!"); setTimeout(function() { btn.textContent = o; }, 1300); }
    });
  });

  document.getElementById("ce-load-rom")?.addEventListener("click", _ceLoadRom);

  document.getElementById("ce-save-bin")?.addEventListener("click", function() {
    if (!_ceData) return;
    _saveBinFile(_ceData, "charset.bin");
  });

  const ceLoadFile = document.getElementById("ce-load-file");
  document.getElementById("ce-load-bin")?.addEventListener("click", function() { ceLoadFile?.click(); });
  ceLoadFile?.addEventListener("change", function(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function() {
      if (!_ceData) _ceData = new Uint8Array(256 * 8);
      const src = new Uint8Array(reader.result);
      _ceData.fill(0);
      _ceData.set(src.subarray(0, Math.min(src.length, _ceData.length)));
      _ceRenderEditor(); _ceRenderMap(); _ceUpdateAsm();
      const btn = document.getElementById("ce-load-bin");
      if (btn) { const o = btn.textContent; btn.textContent = (typeof t === "function" ? t("loaded") : "Loaded!"); setTimeout(function(){ btn.textContent = o; }, 1400); }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  });
}

/* ═══════════════════════════════════════════════════════
   MAP EDITOR
   ═══════════════════════════════════════════════════════ */
const _ME_COLS = 40, _ME_ROWS = 25;
let _meScreen   = null;   // active layer screen codes (alias of _meLayers[active].screen)
let _meColorRam = null;   // active layer colour indices (alias)
let _meLayers = null;     // [{ name, screen:Uint8Array, color:Uint8Array, visible }]
let _meActiveLayer = 0;
const _ME_EMPTY = 0x20;   // space tile = transparent for layers above
let _meTile  = 1;         // selected screen code
let _meColor = 14;        // selected color (Light Blue)
let _meBgColor = 6;       // map background (Blue)
let _meTool  = "paint";
let _meZoom  = 16;        // pixels per tile on main canvas
let _meGrid  = true;
let _mePainting = false;
let _meSelStart = null;   // {col,row} during Select drag
let _meSelEnd   = null;
let _meClipboard = null;  // { w, h, screen: Uint8Array, color: Uint8Array }
let _mePasteMode = false; // true while hovering to place paste preview
let _meTileCache = null;   // [256][64] ROM bit arrays
let _meCustomCache = null; // [256][64] custom charset bit arrays
let _meCustomData = null;  // Uint8Array(2048) custom charset bytes
let _meCharSource = "rom"; // "rom" | "custom"
let _meBuffer = null;      // offscreen canvas (map without overlay)
let _meCtx = null, _meBufCtx = null;
let _meInited = false;

function _meTileBits(sc) {
  sc &= 0xFF;
  if (_meCharSource === "custom" && _meCustomCache) return _meCustomCache[sc];
  if (!_meTileCache) {
    _meTileCache = [];
    for (let i = 0; i < 256; i++) _meTileCache.push(_c64RomBitmapData(i, 1));
  }
  return _meTileCache[sc];
}

/* The ROM tiles are extracted by rendering the C64ProMono font to a canvas.
   If that cache is built before the font has loaded, the canvas uses a
   fallback font → garbled tiles. Ensure the font is loaded, then rebuild the
   cache once and re-run the callback. */
let _meRomFontReady = false;
function _meEnsureRomFont(cb) {
  if (_meRomFontReady || !(document.fonts && document.fonts.load)) { cb(); return; }
  document.fonts.load('64px "C64ProMono"').then(function() {
    _meRomFontReady = true; _meTileCache = null; cb();
  }, function() { cb(); });
}

/* Build per-tile bit arrays from a 2048-byte (256×8) custom charset */
function _meSetCustomCharset(bytes) {
  const data = new Uint8Array(2048);
  data.set(bytes.subarray(0, Math.min(bytes.length, 2048)));
  _meCustomData = data;
  _meCustomCache = [];
  for (let sc = 0; sc < 256; sc++) {
    const bits = [];
    const base = sc * 8;
    for (let r = 0; r < 8; r++) {
      const byte = data[base + r];
      for (let c = 0; c < 8; c++) bits.push((byte >> (7 - c)) & 1);
    }
    _meCustomCache.push(bits);
  }
  _meCharSource = "custom";
}

/* ── Draw one map cell into the offscreen buffer ── */
function _meDrawCellBuf(col, row) {
  const Z = _meZoom, sub = Z / 8, ss = Math.ceil(sub);
  const x0 = col * Z, y0 = row * Z;
  const i = row * _ME_COLS + col;
  // paper background
  _meBufCtx.fillStyle = _CE_COLORS[_meBgColor];
  _meBufCtx.fillRect(x0, y0, Z, Z);
  // Merge: draw every visible layer's tile pixels bottom→top, so two
  // characters on different layers overlay (combine) in the same cell.
  for (let L = 0; L < _meLayers.length; L++) {
    if (!_meLayers[L].visible) continue;
    const t = _meLayers[L].screen[i];
    if (t === _ME_EMPTY) continue;
    const bits = _meTileBits(t);
    _meBufCtx.fillStyle = _CE_COLORS[_meLayers[L].color[i]];
    for (let p = 0; p < 64; p++) {
      if (bits[p]) _meBufCtx.fillRect(x0 + (p & 7) * sub, y0 + (p >> 3) * sub, ss, ss);
    }
  }
  if (_meGrid) {
    _meBufCtx.strokeStyle = "rgba(170,160,225,0.22)";
    _meBufCtx.lineWidth = 1;
    _meBufCtx.strokeRect(x0 + 0.5, y0 + 0.5, Z - 1, Z - 1);
  }
}

/* ── Full render: buffer → main canvas ── */
function _meRenderAll() {
  const W = _ME_COLS * _meZoom, H = _ME_ROWS * _meZoom;
  if (_meBuffer.width !== W) { _meBuffer.width = W; _meBuffer.height = H; }
  const canvas = document.getElementById("me-canvas");
  if (canvas.width !== W) { canvas.width = W; canvas.height = H; }
  for (let r = 0; r < _ME_ROWS; r++)
    for (let c = 0; c < _ME_COLS; c++) _meDrawCellBuf(c, r);
  _meBlit();
}

function _meBlit() { _meCtx.drawImage(_meBuffer, 0, 0); }
function _meBlitCell(col, row) {
  const Z = _meZoom, x0 = col * Z, y0 = row * Z;
  _meCtx.drawImage(_meBuffer, x0, y0, Z, Z, x0, y0, Z, Z);
}

function _meSetCell(col, row, tile, color) {
  if (col < 0 || col >= _ME_COLS || row < 0 || row >= _ME_ROWS) return;
  const i = row * _ME_COLS + col;
  _meScreen[i] = tile;
  _meColorRam[i] = color;
  _meDrawCellBuf(col, row);
  _meBlitCell(col, row);
}

/* ── Tools ── */
function _meFloodFill(col, row) {
  const target = _meScreen[row * _ME_COLS + col];
  if (target === _meTile) { _meSetCell(col, row, _meTile, _meColor); return; }
  const stack = [[col, row]];
  while (stack.length) {
    const [c, r] = stack.pop();
    if (c < 0 || c >= _ME_COLS || r < 0 || r >= _ME_ROWS) continue;
    if (_meScreen[r * _ME_COLS + c] !== target) continue;
    _meScreen[r * _ME_COLS + c] = _meTile;
    _meColorRam[r * _ME_COLS + c] = _meColor;
    _meDrawCellBuf(c, r);
    stack.push([c+1, r], [c-1, r], [c, r+1], [c, r-1]);
  }
  _meBlit();
}

function _meFillAll() {
  for (let i = 0; i < _meScreen.length; i++) { _meScreen[i] = _meTile; _meColorRam[i] = _meColor; }
  _meRenderAll();
}

function _meFillRect(c0, r0, c1, r1) {
  const ca = Math.min(c0,c1), cb = Math.max(c0,c1);
  const ra = Math.min(r0,r1), rb = Math.max(r0,r1);
  for (let r = ra; r <= rb; r++)
    for (let c = ca; c <= cb; c++) {
      const i = r * _ME_COLS + c;
      _meScreen[i] = _meTile; _meColorRam[i] = _meColor;
      _meDrawCellBuf(c, r);
    }
  _meBlit();
}

function _meCellFromEvent(e) {
  const canvas = document.getElementById("me-canvas");
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
  const col = Math.floor((e.clientX - rect.left) * sx / _meZoom);
  const row = Math.floor((e.clientY - rect.top)  * sy / _meZoom);
  if (col < 0 || col >= _ME_COLS || row < 0 || row >= _ME_ROWS) return null;
  return { col, row };
}

function _meUpdateStatus(col, row) {
  const el = document.getElementById("me-status");
  if (!el) return;
  if (col == null) { el.textContent = "Col: -   Row: -   Tile: --   Offset: ----"; return; }
  const off = row * _ME_COLS + col;
  const tile = _meScreen[off];
  el.textContent =
    "Col: " + col + "   Row: " + row +
    "   Tile: $" + tile.toString(16).toUpperCase().padStart(2,"0") +
    "   Offset: $" + off.toString(16).toUpperCase().padStart(4,"0");
}

function _meDrawSelOverlay() {
  _meBlit();
  if (!_meSelStart || !_meSelEnd) return;
  const Z = _meZoom;
  const ca = Math.min(_meSelStart.col, _meSelEnd.col), cb = Math.max(_meSelStart.col, _meSelEnd.col);
  const ra = Math.min(_meSelStart.row, _meSelEnd.row), rb = Math.max(_meSelStart.row, _meSelEnd.row);
  _meCtx.strokeStyle = "rgba(255,255,255,0.9)";
  _meCtx.lineWidth = 2;
  _meCtx.setLineDash([5, 4]);
  _meCtx.strokeRect(ca*Z+1, ra*Z+1, (cb-ca+1)*Z-2, (rb-ra+1)*Z-2);
  _meCtx.setLineDash([]);
}

function _meCopy() {
  if (!_meSelStart || !_meSelEnd) return;
  const ca = Math.min(_meSelStart.col, _meSelEnd.col), cb = Math.max(_meSelStart.col, _meSelEnd.col);
  const ra = Math.min(_meSelStart.row, _meSelEnd.row), rb = Math.max(_meSelStart.row, _meSelEnd.row);
  const w = cb - ca + 1, h = rb - ra + 1;
  const scr = new Uint8Array(w * h), col = new Uint8Array(w * h);
  for (let r = ra; r <= rb; r++)
    for (let c = ca; c <= cb; c++) {
      const si = (r - ra) * w + (c - ca), mi = r * _ME_COLS + c;
      scr[si] = _meScreen[mi]; col[si] = _meColorRam[mi];
    }
  _meClipboard = { w, h, screen: scr, color: col };
  document.getElementById("me-paste")?.removeAttribute("disabled");
}

function _mePasteCommit(col, row) {
  if (!_meClipboard) return;
  const { w, h, screen: scr, color: col_data } = _meClipboard;
  for (let r = 0; r < h; r++)
    for (let c = 0; c < w; c++) {
      const dc = col + c, dr = row + r;
      if (dc >= 0 && dc < _ME_COLS && dr >= 0 && dr < _ME_ROWS) {
        const si = r * w + c;
        _meSetCell(dc, dr, scr[si], col_data[si]);
      }
    }
  _meBlit();
}

function _meDrawPastePreview(col, row) {
  _meBlit();
  if (!_meClipboard) return;
  const { w, h, screen: scr, color: col_data } = _meClipboard;
  const Z = _meZoom, sub = Z / 8, ss = Math.ceil(sub);
  _meCtx.save();
  _meCtx.globalAlpha = 0.6;
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const dc = col + c, dr = row + r;
      if (dc < 0 || dc >= _ME_COLS || dr < 0 || dr >= _ME_ROWS) continue;
      const si = r * w + c;
      const bits = _meTileBits(scr[si]);
      _meCtx.fillStyle = _CE_COLORS[_meBgColor];
      _meCtx.fillRect(dc * Z, dr * Z, Z, Z);
      _meCtx.fillStyle = _CE_COLORS[col_data[si]];
      for (let p = 0; p < 64; p++)
        if (bits[p]) _meCtx.fillRect(dc * Z + (p & 7) * sub, dr * Z + (p >> 3) * sub, ss, ss);
    }
  }
  _meCtx.restore();
  _meCtx.strokeStyle = "rgba(255,230,0,0.9)";
  _meCtx.lineWidth = 2;
  _meCtx.setLineDash([5, 4]);
  _meCtx.strokeRect(col * Z + 1, row * Z + 1, w * Z - 2, h * Z - 2);
  _meCtx.setLineDash([]);
}

/* ── Tile banks ── */
function _meRenderBank(canvasId, startSc) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const TS = 16;            // tile size in bank
  ctx.fillStyle = "#23263a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 128; i++) {
    const sc = startSc + i;
    const bx = (i % 16) * TS, by = Math.floor(i / 16) * TS;
    const bits = _meTileBits(sc);
    ctx.fillStyle = "#c2c8dc";
    for (let p = 0; p < 64; p++) {
      if (bits[p]) ctx.fillRect(bx + (p & 7) * 2, by + (p >> 3) * 2, 2, 2);
    }
    if (sc === _meTile) {
      ctx.strokeStyle = "#ffcc33";
      ctx.lineWidth = 2;
      ctx.strokeRect(bx + 1, by + 1, TS - 2, TS - 2);
    }
  }
}
function _meRenderBanks() { _meRenderBank("me-bank0", 0); _meRenderBank("me-bank1", 128); }

function _meBuildPalette() {
  const wrap = document.getElementById("me-palette");
  if (!wrap || wrap.children.length) return;
  _CE_COLORS.forEach(function(hex, i) {
    const sw = document.createElement("div");
    sw.className = "me-swatch" + (i === _meColor ? " me-swatch--sel" : "");
    sw.style.background = hex;
    sw.title = "Color " + i;
    sw.addEventListener("click", function() {
      _meColor = i;
      wrap.querySelectorAll(".me-swatch").forEach(function(s, j) { s.classList.toggle("me-swatch--sel", j === i); });
    });
    wrap.appendChild(sw);
  });
}

/* Save raw bytes to a file. Uses the native save dialog in the desktop app
   (the <a download> trick does not work inside the Tauri webview), with a
   browser blob-download fallback for dev. */
async function _saveBinFile(bytes, fileName) {
  const arr = Array.from(bytes);
  const api = window.electronAPI;
  if (api?.saveBin) {
    try { return await api.saveBin({ bytes: arr, fileName: fileName }); } catch (_) {}
  }
  if (api?.savePrg) {
    try { return await api.savePrg({ bytes: arr }); } catch (_) {}
  }
  const blob = new Blob([new Uint8Array(arr)], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = fileName;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
}

function _meExport(kind) {
  // Per-layer exports — each layer is its own charmap (so a game can composite
  // / swap them in software).
  if (kind === "layer-bin") { _saveBinFile(_meLayers[_meActiveLayer].screen, "layer-" + _meActiveLayer + ".bin"); return; }
  if (kind === "layers-bin") {
    const n = _ME_COLS * _ME_ROWS, out = new Uint8Array(_meLayers.length * n);
    _meLayers.forEach(function(L, li){ out.set(L.screen, li * n); });
    _saveBinFile(out, "layers.bin"); return;
  }
  const comp = _meComposite();   // flattened visible layers
  if (kind === "bin") {
    _saveBinFile(comp.screen, "map.bin");
    return;
  }
  if (kind === "bin-color") {
    const n = _ME_COLS * _ME_ROWS;
    const out = new Uint8Array(n * 2);
    out.set(comp.screen, 0);
    out.set(comp.color, n);
    _saveBinFile(out, "map-color.bin");
    return;
  }
  const data = (kind === "color") ? comp.color :
               (kind === "layer-screen") ? _meLayers[_meActiveLayer].screen : comp.screen;
  let out = "";
  for (let r = 0; r < _ME_ROWS; r++) {
    const row = [];
    for (let c = 0; c < _ME_COLS; c++) row.push("$" + data[r * _ME_COLS + c].toString(16).toUpperCase().padStart(2,"0"));
    out += row.join(", ") + (r < _ME_ROWS - 1 ? ",\n" : "\n");
  }
  navigator.clipboard.writeText(out).then(function() {
    const btn = document.querySelector("#map-editor-dialog .ed-file-btn");
    if (btn) { const o = btn.textContent; btn.textContent = (typeof t === "function" ? t("copied") : "Copied!"); setTimeout(function(){ btn.textContent = o; }, 1200); }
  }).catch(function(){});
}

function _meNewLayer(name) {
  return {
    name: name,
    screen: new Uint8Array(_ME_COLS * _ME_ROWS).fill(_ME_EMPTY),
    color:  new Uint8Array(_ME_COLS * _ME_ROWS).fill(_meColor),
    visible: true
  };
}
function _meInit() {
  if (_meInited) return;
  _meInited = true;
  _meLayers = [_meNewLayer(t("meBackground"))];
  _meActiveLayer = 0;
  _meScreen = _meLayers[0].screen;
  _meColorRam = _meLayers[0].color;
  _meBuffer = document.createElement("canvas");
  _meBufCtx = _meBuffer.getContext("2d");
  const canvas = document.getElementById("me-canvas");
  _meCtx = canvas.getContext("2d");
  _meBuildPalette();
  _meBuildLayers();
}

/* ── Layers ── */
function _meSetActiveLayer(i) {
  if (i < 0 || i >= _meLayers.length) return;
  _meActiveLayer = i;
  _meScreen = _meLayers[i].screen;
  _meColorRam = _meLayers[i].color;
  _meBuildLayers();
  if (_meBufCtx) _meRenderAll();   // keep the canvas showing the full composite
}
function _meAddLayer() {
  _meLayers.push(_meNewLayer(t("meNewLayerName") + " " + _meLayers.length));
  _meSetActiveLayer(_meLayers.length - 1);
  _meRenderAll();
}
function _meDeleteLayer(i) {
  if (_meLayers.length <= 1) return;
  _meLayers.splice(i, 1);
  if (_meActiveLayer >= _meLayers.length) _meActiveLayer = _meLayers.length - 1;
  _meSetActiveLayer(_meActiveLayer);
  _meRenderAll();
}
function _meBuildLayers() {
  const list = document.getElementById("me-layers-list");
  if (!list) return;
  list.innerHTML = "";
  // top layer first (visually like Photoshop)
  for (let i = _meLayers.length - 1; i >= 0; i--) {
    (function(idx) {
      const L = _meLayers[idx];
      const row = document.createElement("div");
      row.className = "me-layer" + (idx === _meActiveLayer ? " me-layer--active" : "");
      const eye = document.createElement("button");
      eye.type = "button"; eye.className = "me-layer-eye" + (L.visible ? "" : " me-layer-eye--off");
      eye.title = L.visible ? t("meLayerHide") : t("meLayerShow");
      eye.innerHTML = L.visible
        ? '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8s-2.5 4.5-6.5 4.5S1.5 8 1.5 8z"/><circle cx="8" cy="8" r="2"/></svg>'
        : '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" aria-hidden="true"><path d="M2 8s2.5-4.5 6-4.5c1 0 1.9.3 2.7.7M14 8s-2.5 4.5-6 4.5c-1 0-1.9-.3-2.7-.7"/><path d="M2.5 2.5l11 11"/></svg>';
      eye.addEventListener("click", function(e) { e.stopPropagation(); L.visible = !L.visible; _meBuildLayers(); _meRenderAll(); });
      const nm = document.createElement("span");
      nm.className = "me-layer-name"; nm.textContent = L.name;
      nm.title = t("meLayerRename");
      nm.addEventListener("dblclick", function(e) {
        e.stopPropagation();
        const v = prompt("Layer name:", L.name);
        if (v != null && v.trim()) { L.name = v.trim(); _meBuildLayers(); }
      });
      row.appendChild(eye); row.appendChild(nm);
      if (_meLayers.length > 1) {
        const del = document.createElement("button");
        del.type = "button"; del.className = "me-layer-del"; del.title = t("meLayerDelete"); del.textContent = "×";
        del.addEventListener("click", function(e) { e.stopPropagation(); _meDeleteLayer(idx); });
        row.appendChild(del);
      }
      row.addEventListener("click", function() { _meSetActiveLayer(idx); });
      list.appendChild(row);
    })(i);
  }
}
/* Merge all visible layers into a single Background layer (flatten). */
function _meFlatten() {
  if (!_meLayers || _meLayers.length <= 1) return;
  const comp = _meComposite();
  _meLayers = [{ name: "Background", screen: comp.screen, color: comp.color, visible: true }];
  _meActiveLayer = 0;
  _meScreen = _meLayers[0].screen;
  _meColorRam = _meLayers[0].color;
  _meBuildLayers();
  _meRenderAll();
}
/* Composite the visible layers into a final {screen,color} (top-down). */
function _meComposite() {
  const n = _ME_COLS * _ME_ROWS;
  const screen = new Uint8Array(n).fill(_ME_EMPTY);
  const color = new Uint8Array(n).fill(_meColor);
  for (let i = 0; i < n; i++) {
    for (let L = _meLayers.length - 1; L >= 0; L--) {
      if (!_meLayers[L].visible) continue;
      const t = _meLayers[L].screen[i];
      if (t !== _ME_EMPTY) { screen[i] = t; color[i] = _meLayers[L].color[i]; break; }
    }
  }
  return { screen: screen, color: color };
}

function setupMapEditor() {
  const dialog = document.getElementById("map-editor-dialog");
  if (!dialog) return;

  document.getElementById("map-editor-btn")?.addEventListener("click", function() {
    document.querySelector(".control-menu")?.removeAttribute("open");
    _meInit();
    _meRenderBanks();
    _meRenderAll();
    _meUpdateStatus(null);
    dialog.showModal();
    // Re-render once the C64 font is ready (first open may extract tiles too early).
    _meEnsureRomFont(function() { _meRenderBanks(); _meRenderAll(); });
  });
  document.getElementById("me-close")?.addEventListener("click", function() { dialog.close(); });

  // Tool selection
  dialog.querySelectorAll(".me-tool[data-tool]").forEach(function(btn) {
    btn.addEventListener("click", function() {
      _meTool = btn.dataset.tool;
      dialog.querySelectorAll(".me-tool[data-tool]").forEach(function(b) { b.classList.toggle("me-tool--active", b === btn); });
      if (_mePasteMode) {
        _mePasteMode = false;
        const cv = document.getElementById("me-canvas");
        if (cv) cv.style.cursor = "";
        _meBlit();
      }
      if (_meTool !== "select") { _meSelStart = _meSelEnd = null; _meBlit(); }
    });
  });

  // Export items (in the File menu — open/close handled by _setupFileMenus)
  dialog.querySelectorAll("button[data-export]").forEach(function(b) {
    b.addEventListener("click", function() { _meExport(b.dataset.export); });
  });

  // Charset: load from C64 ROM
  document.getElementById("me-charset-rom")?.addEventListener("click", function() {
    _meCharSource = "rom";
    _meEnsureRomFont(function() { _meTileCache = null; _meRenderBanks(); _meRenderAll(); });
  });
  document.getElementById("me-copy")?.addEventListener("click", function() {
    _meCopy();
  });
  document.getElementById("me-paste")?.addEventListener("click", function() {
    if (!_meClipboard) return;
    _mePasteMode = true;
    _meSelStart = _meSelEnd = null;
    _meBlit();
    const canvas = document.getElementById("me-canvas");
    if (canvas) canvas.style.cursor = "copy";
    // switch to select tool visually so paste-mode is clear
    dialog.querySelectorAll(".me-tool[data-tool]").forEach(function(b) { b.classList.remove("me-tool--active"); });
  });
  dialog.addEventListener("keydown", function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "c") {
      _meCopy(); e.preventDefault(); return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "v") {
      if (!_meClipboard) return;
      _mePasteMode = true;
      _meSelStart = _meSelEnd = null;
      _meBlit();
      const cv = document.getElementById("me-canvas");
      if (cv) cv.style.cursor = "copy";
      dialog.querySelectorAll(".me-tool[data-tool]").forEach(function(b) { b.classList.remove("me-tool--active"); });
      e.preventDefault(); return;
    }
    if (e.key === "Escape") {
      if (_mePasteMode) {
        _mePasteMode = false;
        const cv = document.getElementById("me-canvas");
        if (cv) cv.style.cursor = "";
        _meBlit();
        // restore active tool button
        dialog.querySelectorAll(".me-tool[data-tool]").forEach(function(b) {
          b.classList.toggle("me-tool--active", b.dataset.tool === _meTool);
        });
      }
      _meSelStart = _meSelEnd = null;
      _meBlit();
    }
  });
  document.getElementById("me-layer-add")?.addEventListener("click", _meAddLayer);
  document.getElementById("me-layer-flatten")?.addEventListener("click", _meFlatten);
  // Clear the whole map (toolbar icon + Files menu entry)
  const _meClearMap = function() {
    if (!_meScreen) return;
    _meScreen.fill(0x20);
    _meColorRam.fill(_meColor);
    _meRenderAll();
  };
  document.getElementById("me-clear")?.addEventListener("click", _meClearMap);
  document.getElementById("me-clear-menu")?.addEventListener("click", _meClearMap);
  const csFile = document.getElementById("me-charset-file");
  document.getElementById("me-charset-load")?.addEventListener("click", function() { csFile?.click(); });
  csFile?.addEventListener("change", function(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function() {
      _meSetCustomCharset(new Uint8Array(reader.result));
      _meRenderBanks(); _meRenderAll();
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  });
  document.getElementById("me-charset-editor")?.addEventListener("click", function() {
    if (typeof _ceData !== "undefined" && _ceData) {
      _meSetCustomCharset(_ceData);
      _meRenderBanks(); _meRenderAll();
    } else {
      const btn = document.getElementById("me-charset-editor");
      if (btn) { const o = btn.title; btn.title = "Editor empty!"; setTimeout(function(){ btn.title = o; }, 1400); }
    }
  });

  // Load map (.bin) — first 1000 bytes = screen codes, optional next 1000 = color RAM
  const mapFile = document.getElementById("me-map-file");
  document.getElementById("me-load-map")?.addEventListener("click", function() { mapFile?.click(); });
  mapFile?.addEventListener("change", function(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function() {
      const src = new Uint8Array(reader.result);
      const n = _ME_COLS * _ME_ROWS;
      for (let i = 0; i < n; i++) _meScreen[i] = i < src.length ? src[i] : 0x20;
      if (src.length >= n * 2) {
        for (let i = 0; i < n; i++) _meColorRam[i] = src[n + i] & 0x0F;
      }
      _meRenderAll();
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  });

  // Grid + zoom
  document.getElementById("me-grid-toggle")?.addEventListener("change", function(e) {
    _meGrid = e.target.checked; _meRenderAll();
  });
  document.getElementById("me-zoom")?.addEventListener("input", function(e) {
    _meZoom = parseInt(e.target.value, 10); _meRenderAll();
  });

  // Bank tile selection
  ["me-bank0", "me-bank1"].forEach(function(id, bank) {
    const cv = document.getElementById(id);
    cv?.addEventListener("click", function(e) {
      const rect = cv.getBoundingClientRect();
      const col = Math.floor((e.clientX - rect.left) / rect.width * 16);
      const row = Math.floor((e.clientY - rect.top) / rect.height * 8);
      const sc = bank * 128 + row * 16 + col;
      if (sc >= 0 && sc < 256) { _meTile = sc; _meRenderBanks(); }
    });
  });

  // Main canvas interaction
  const canvas = document.getElementById("me-canvas");
  if (canvas) {
    const apply = function(cell) {
      if (!cell) return;
      if (_meTool === "paint") { _meSetCell(cell.col, cell.row, _meTile, _meColor); }
      else if (_meTool === "fill") { _meFloodFill(cell.col, cell.row); }
      else if (_meTool === "flood") { _meFillAll(); }
      else if (_meTool === "pick") {
        const i = cell.row * _ME_COLS + cell.col;
        _meTile = _meScreen[i]; _meColor = _meColorRam[i];
        _meRenderBanks();
        document.querySelectorAll("#me-palette .me-swatch").forEach(function(s, j) { s.classList.toggle("me-swatch--sel", j === _meColor); });
      }
    };
    canvas.addEventListener("pointerdown", function(e) {
      if (e.button !== 0) return;
      const cell = _meCellFromEvent(e);
      if (!cell) return;
      if (_mePasteMode) {
        _mePasteCommit(cell.col, cell.row);
        _meDrawPastePreview(cell.col, cell.row);
        e.preventDefault(); return;
      }
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      if (_meTool === "select") {
        _meSelStart = cell; _meSelEnd = cell; _mePainting = true;
        document.getElementById("me-copy")?.setAttribute("disabled", "");
        _meDrawSelOverlay();
      } else {
        _mePainting = true; apply(cell);
      }
      e.preventDefault();
    });
    canvas.addEventListener("pointermove", function(e) {
      const cell = _meCellFromEvent(e);
      _meUpdateStatus(cell ? cell.col : null, cell ? cell.row : null);
      if (_mePasteMode && cell) { _meDrawPastePreview(cell.col, cell.row); return; }
      if (!_mePainting || !cell) return;
      if (_meTool === "select") { _meSelEnd = cell; _meDrawSelOverlay(); }
      else if (_meTool === "paint") { _meSetCell(cell.col, cell.row, _meTile, _meColor); }
    });
    canvas.addEventListener("pointerleave", function() {
      _meUpdateStatus(null);
      if (_mePasteMode) _meBlit();
    });
    const endPaint = function(e) {
      if (!_mePainting) return;
      _mePainting = false;
      if (_meTool === "select" && _meSelStart && _meSelEnd) {
        _meDrawSelOverlay();
        const ca = Math.min(_meSelStart.col, _meSelEnd.col), cb = Math.max(_meSelStart.col, _meSelEnd.col);
        const ra = Math.min(_meSelStart.row, _meSelEnd.row), rb = Math.max(_meSelStart.row, _meSelEnd.row);
        if (ca !== cb || ra !== rb) document.getElementById("me-copy")?.removeAttribute("disabled");
      }
      if (e && e.pointerId != null) { try { canvas.releasePointerCapture(e.pointerId); } catch (_) {} }
    };
    canvas.addEventListener("pointerup", endPaint);
    canvas.addEventListener("pointercancel", endPaint);
  }
}

/* ═══════════════════════════════════════════════════════
   HI-RES / MULTICOLOR GRAPHICS EDITOR
   ═══════════════════════════════════════════════════════ */
let _hgMulti = false;        // false = hi-res (320x200), true = multicolor (160x200)
// Hi-res storage: C64 bitmap is 40x25 cells of 8x8 px; each cell allows only
// TWO colours — fg (set bits) + bg (clear bits), taken from the screen-RAM
// byte (hi nibble = fg, lo nibble = bg). So we store a per-pixel BIT plus a
// per-cell fg/bg colour, and painting a 3rd colour recolours the cell (the
// classic "colour clash"). Ref: c64-assembly-expert knowledge base — VIC-II
// standard bitmap mode.
let _hgBit    = null;        // Uint8Array(320*200) 0/1
let _hgFgCell = null;        // Uint8Array(40*25) foreground colour per cell
let _hgBgCell = null;        // Uint8Array(40*25) background colour per cell
let _hgPixMC  = null;        // Uint8Array(160*200) multicolor: free per-pixel colour
let _hgColor = 1;            // selected color index (ink)
let _hgPaper = 0;            // paper / background colour index (bit-0 in hi-res)
let _hgTool  = "pencil";
let _hgZoom  = 3;
let _hgGrid  = false;
let _hgRaster = false;
let _hgCanvas = null, _hgCtx = null, _hgBuf = null, _hgBufCtx = null;
let _hgPainting = false, _hgStart = null, _hgLast = null;
let _hgUndo = [], _hgRedo = [];
let _hgInited = false;

function _hgW() { return _hgMulti ? 160 : 320; }
function _hgH() { return 200; }
function _hgPxW() { return _hgMulti ? _hgZoom * 2 : _hgZoom; }  // display px width of one logical pixel
function _hgPxH() { return _hgZoom; }
function _hgDispW() { return _hgW() * _hgPxW(); }   // = 320*zoom always
function _hgDispH() { return _hgH() * _hgPxH(); }

function _hgGet(x, y) {
  if (x < 0 || y < 0 || x >= _hgW() || y >= _hgH()) return -1;
  if (_hgMulti) return _hgPixMC[y * 160 + x];
  const cell = (y >> 3) * 40 + (x >> 3);
  return _hgBit[y * 320 + x] ? _hgFgCell[cell] : _hgBgCell[cell];
}
function _hgSet(x, y, col) {
  if (x < 0 || y < 0 || x >= _hgW() || y >= _hgH()) return;
  if (_hgMulti) { _hgPixMC[y * 160 + x] = col; return; }
  // Hi-res: only 2 colours per 8x8 cell. col == bg → clear bit; any other
  // colour becomes the cell's single foreground (recolouring lit pixels =
  // C64 colour clash).
  const idx = y * 320 + x;
  const cell = (y >> 3) * 40 + (x >> 3);
  if (col === _hgBgCell[cell]) { _hgBit[idx] = 0; return; }
  _hgFgCell[cell] = col;
  _hgBit[idx] = 1;
}

/* ── Rendering ── */
function _hgDrawPixelBuf(x, y) {
  const pw = _hgPxW(), ph = _hgPxH();
  _hgBufCtx.fillStyle = _CE_COLORS[_hgGet(x, y)];
  _hgBufCtx.fillRect(x * pw, y * ph, pw, ph);
}
/* Redraw the whole 8x8 cell a pixel belongs to (hi-res clash may have
   recoloured neighbours); multicolor just redraws the single pixel. */
function _hgRedrawCellBuf(x, y) {
  if (_hgMulti) { _hgDrawPixelBuf(x, y); return; }
  const cx = (x >> 3) << 3, cy = (y >> 3) << 3;
  for (let yy = 0; yy < 8; yy++)
    for (let xx = 0; xx < 8; xx++) _hgDrawPixelBuf(cx + xx, cy + yy);
}
function _hgRenderBuf() {
  const W = _hgDispW(), H = _hgDispH();
  if (!_hgBuf) _hgBuf = document.createElement("canvas");
  if (_hgBuf.width !== W) { _hgBuf.width = W; _hgBuf.height = H; }
  for (let y = 0; y < _hgH(); y++)
    for (let x = 0; x < _hgW(); x++) _hgDrawPixelBuf(x, y);
}
function _hgOverlays() {
  const W = _hgDispW(), H = _hgDispH();
  if (_hgGrid) {
    _hgCtx.strokeStyle = "rgba(120,130,160,0.5)";
    _hgCtx.lineWidth = 1;
    const cw = 8 * _hgPxW(), ch = 8 * _hgPxH();
    _hgCtx.beginPath();
    for (let x = 0; x <= W; x += cw) { _hgCtx.moveTo(x + 0.5, 0); _hgCtx.lineTo(x + 0.5, H); }
    for (let y = 0; y <= H; y += ch) { _hgCtx.moveTo(0, y + 0.5); _hgCtx.lineTo(W, y + 0.5); }
    _hgCtx.stroke();
  }
  if (_hgRaster) {
    _hgCtx.fillStyle = "rgba(0,0,0,0.28)";
    for (let y = 0; y < H; y += 2) _hgCtx.fillRect(0, y, W, 1);
  }
}
function _hgBlit() {
  const W = _hgDispW(), H = _hgDispH();
  if (_hgCanvas.width !== W) { _hgCanvas.width = W; _hgCanvas.height = H; }
  _hgCtx.drawImage(_hgBuf, 0, 0);
  _hgOverlays();
}
function _hgRenderAll() { _hgRenderBuf(); _hgBlit(); }

/* ── Undo / redo ── */
function _hgSnapshot() {
  if (_hgMulti) return { m: true, mc: _hgPixMC.slice(0) };
  return { m: false, bit: _hgBit.slice(0), fg: _hgFgCell.slice(0), bg: _hgBgCell.slice(0) };
}
function _hgRestore(s) {
  if (s.m) { _hgPixMC.set(s.mc); }
  else { _hgBit.set(s.bit); _hgFgCell.set(s.fg); _hgBgCell.set(s.bg); }
}
function _hgPushUndo() {
  _hgUndo.push(_hgSnapshot());
  if (_hgUndo.length > 40) _hgUndo.shift();
  _hgRedo.length = 0;
}
function _hgUndoOp() {
  if (!_hgUndo.length) return;
  _hgRedo.push(_hgSnapshot());
  _hgRestore(_hgUndo.pop());
  _hgRenderAll();
}
function _hgRedoOp() {
  if (!_hgRedo.length) return;
  _hgUndo.push(_hgSnapshot());
  _hgRestore(_hgRedo.pop());
  _hgRenderAll();
}

/* ── Shape rasterizers (write into a target setter fn) ── */
function _hgLine(x0, y0, x1, y1, set) {
  let dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
  let sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  while (true) {
    set(x0, y0);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 < dx) { err += dx; y0 += sy; }
  }
}
function _hgRect(x0, y0, x1, y1, set, filled) {
  const xa = Math.min(x0,x1), xb = Math.max(x0,x1), ya = Math.min(y0,y1), yb = Math.max(y0,y1);
  if (filled) {
    for (let y = ya; y <= yb; y++) for (let x = xa; x <= xb; x++) set(x, y);
  } else {
    for (let x = xa; x <= xb; x++) { set(x, ya); set(x, yb); }
    for (let y = ya; y <= yb; y++) { set(xa, y); set(xb, y); }
  }
}
function _hgOval(x0, y0, x1, y1, set, filled) {
  const xa = Math.min(x0,x1), xb = Math.max(x0,x1), ya = Math.min(y0,y1), yb = Math.max(y0,y1);
  const cx = (xa + xb) / 2, cy = (ya + yb) / 2;
  const rx = Math.max(0.5, (xb - xa) / 2), ry = Math.max(0.5, (yb - ya) / 2);
  if (filled) {
    for (let y = ya; y <= yb; y++) for (let x = xa; x <= xb; x++) {
      const nx = (x - cx) / rx, ny = (y - cy) / ry;
      if (nx*nx + ny*ny <= 1) set(x, y);
    }
  } else {
    const steps = Math.max(8, Math.round((rx + ry) * 4));
    let px = null, py = null;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const x = Math.round(cx + Math.cos(a) * rx), y = Math.round(cy + Math.sin(a) * ry);
      if (px !== null) _hgLine(px, py, x, y, set); else set(x, y);
      px = x; py = y;
    }
  }
}
function _hgFloodFill(x, y, col) {
  const target = _hgGet(x, y);
  if (target === col || target === -1) return;
  const W = _hgW(), H = _hgH();
  // `seen` guard: in hi-res _hgSet recolours a whole cell, which can change a
  // neighbour's displayed colour mid-fill, so track visited pixels explicitly.
  const seen = new Uint8Array(W * H);
  const stack = [[x, y]];
  while (stack.length) {
    const [cx, cy] = stack.pop();
    if (cx < 0 || cy < 0 || cx >= W || cy >= H) continue;
    if (seen[cy * W + cx]) continue;
    if (_hgGet(cx, cy) !== target) continue;
    seen[cy * W + cx] = 1;
    _hgSet(cx, cy, col);
    stack.push([cx+1, cy], [cx-1, cy], [cx, cy+1], [cx, cy-1]);
  }
}

/* ── Pointer → pixel ── */
function _hgPixelFromEvent(e) {
  const rect = _hgCanvas.getBoundingClientRect();
  const sx = _hgCanvas.width / rect.width, sy = _hgCanvas.height / rect.height;
  const x = Math.floor((e.clientX - rect.left) * sx / _hgPxW());
  const y = Math.floor((e.clientY - rect.top)  * sy / _hgPxH());
  return { x, y };
}
function _hgStatus(x, y) {
  const el = document.getElementById("hg-status");
  if (el) el.textContent = (x == null) ? "(-, -)" : "(" + x + ", " + y + ")";
}

/* ── Palette / status helpers ── */
function _hgBuildPalette() {
  const wrap = document.getElementById("hg-palette");
  if (!wrap || wrap.children.length) return;
  _CE_COLORS.forEach(function(hex, i) {
    const sw = document.createElement("div");
    sw.className = "hg-swatch" + (i === _hgColor ? " hg-swatch--sel" : "");
    sw.style.background = hex;
    sw.title = "Color " + i + " — left-click: ink, right-click: paper";
    sw.addEventListener("click", function() {
      _hgColor = i;
      wrap.querySelectorAll(".hg-swatch").forEach(function(s, j) { s.classList.toggle("hg-swatch--sel", j === i); });
    });
    sw.addEventListener("contextmenu", function(e) { e.preventDefault(); _hgSetPaper(i); });
    wrap.appendChild(sw);
  });
  _hgUpdatePaperSwatch();
}

function _hgUpdatePaperSwatch() {
  const el = document.getElementById("hg-paper");
  if (el) el.style.background = _CE_COLORS[_hgPaper];
}

function _hgSetPaper(col) {
  _hgPaper = col;
  if (_hgBgCell) _hgBgCell.fill(col);   // hi-res: recolour every cell background
  if (_hgMulti && _hgPixMC) {
    // multicolor: recolour pixels currently showing the old paper is ambiguous;
    // paper here just defines the clear/erase colour, so leave existing pixels.
  }
  _hgUpdatePaperSwatch();
  _hgRenderAll();
}

/* ── Palette RGB (cached) + nearest-colour ── */
let _hgPalRGB = null;
function _hgPal() {
  if (!_hgPalRGB) {
    _hgPalRGB = _CE_COLORS.map(function(h) {
      return [parseInt(h.substr(1,2),16), parseInt(h.substr(3,2),16), parseInt(h.substr(5,2),16)];
    });
  }
  return _hgPalRGB;
}
function _hgNearestColor(r, g, b) {
  const pal = _hgPal();
  let best = 0, bestD = Infinity;
  for (let i = 0; i < 16; i++) {
    const c = pal[i];
    const d = (r-c[0])*(r-c[0]) + (g-c[1])*(g-c[1]) + (b-c[2])*(b-c[2]);
    if (d < bestD) { bestD = d; best = i; }
  }
  return best;
}

/* Convert a full-resolution RGB source into hi-res: for each 8×8 cell pick the
   two dominant palette colours (bg + fg) and assign each pixel to whichever of
   the two its RGB is CLOSER to. This preserves detail (the old exact-match test
   collapsed cells to a single colour → blocky). rgbAt(x,y) → [r,g,b]. */
function _hgHiresFromRGB(rgbAt) {
  const pal = _hgPal();
  for (let cy = 0; cy < 25; cy++) {
    for (let cx = 0; cx < 40; cx++) {
      const freq = new Array(16).fill(0);
      for (let yy = 0; yy < 8; yy++)
        for (let xx = 0; xx < 8; xx++) {
          const c = rgbAt(cx*8+xx, cy*8+yy);
          freq[_hgNearestColor(c[0], c[1], c[2])]++;
        }
      let c0 = 0, c1 = 0, f0 = -1, f1 = -1;
      for (let k = 0; k < 16; k++) {
        if (freq[k] > f0) { f1 = f0; c1 = c0; f0 = freq[k]; c0 = k; }
        else if (freq[k] > f1) { f1 = freq[k]; c1 = k; }
      }
      const cell = cy * 40 + cx;
      _hgBgCell[cell] = c0;
      _hgFgCell[cell] = (f1 > 0 && c1 !== c0) ? c1 : c0;
      const p0 = pal[c0], p1 = pal[_hgFgCell[cell]];
      for (let yy = 0; yy < 8; yy++)
        for (let xx = 0; xx < 8; xx++) {
          const px = cx*8+xx, py = cy*8+yy;
          const c = rgbAt(px, py);
          const d0 = (c[0]-p0[0])**2 + (c[1]-p0[1])**2 + (c[2]-p0[2])**2;
          const d1 = (c[0]-p1[0])**2 + (c[1]-p1[1])**2 + (c[2]-p1[2])**2;
          _hgBit[py * 320 + px] = (d1 < d0) ? 1 : 0;
        }
    }
  }
}

function _hgImportImage(img) {
  const W = _hgW(), H = _hgH();
  const tmp = document.createElement("canvas");
  tmp.width = W; tmp.height = H;
  const tc = tmp.getContext("2d");
  tc.imageSmoothingEnabled = false;   // crisp scaling for pixel-art sources
  tc.drawImage(img, 0, 0, W, H);
  const d = tc.getImageData(0, 0, W, H).data;
  _hgPushUndo();
  if (_hgMulti) {
    for (let i = 0; i < W * H; i++) _hgPixMC[i] = _hgNearestColor(d[i*4], d[i*4+1], d[i*4+2]);
  } else {
    _hgHiresFromRGB(function(x, y) { const i = (y * W + x) * 4; return [d[i], d[i+1], d[i+2]]; });
  }
  _hgRenderAll();
}

function _hgIsBinFile(file) {
  return /\.(bin|prg|raw)$/i.test(file.name) || file.type === "application/octet-stream";
}

function _hgIsImageFile(file) {
  return /^image\//i.test(file.type) || /\.(png|jpe?g|gif|webp|bmp|avif|tiff?)$/i.test(file.name);
}

function _hgImportImageFile(file) {
  const loadFromObjectUrl = function() {
    const img = new Image();
    img.onload = function() { _hgImportImage(img); URL.revokeObjectURL(img.src); };
    img.onerror = function() { URL.revokeObjectURL(img.src); };
    img.src = URL.createObjectURL(file);
  };
  if (window.createImageBitmap) {
    createImageBitmap(file).then(function(bitmap) {
      _hgImportImage(bitmap);
      if (bitmap && bitmap.close) bitmap.close();
    }, function() {
      loadFromObjectUrl();
    });
  } else {
    loadFromObjectUrl();
  }
}

/* Per-pixel displayed-colour buffer (for export). */
/* Export the picture.
   Hi-res → standard C64 layout: 8000-byte bitmap + 1000-byte screen RAM
   (hi nibble = fg/set bits, lo nibble = bg/clear bits).
   Multicolor → raw 160×200 per-pixel colour indices (32000 bytes). */
function _hgExportBytes() {
  if (_hgMulti) return _hgPixMC.slice(0);
  const out = new Uint8Array(9000);
  for (let cell = 0; cell < 1000; cell++) {
    const cx = (cell % 40) * 8, cy = ((cell / 40) | 0) * 8;
    for (let row = 0; row < 8; row++) {
      let byte = 0;
      for (let col = 0; col < 8; col++) {
        if (_hgBit[(cy + row) * 320 + (cx + col)]) byte |= (1 << (7 - col));
      }
      out[cell * 8 + row] = byte;
    }
    out[8000 + cell] = ((_hgFgCell[cell] & 0x0F) << 4) | (_hgBgCell[cell] & 0x0F);
  }
  return out;
}

/* Load a .bin, detecting the format by size so the resolution/mode always
   matches the file (fixes images loading at the wrong resolution). */
function _hgImportBytes(src) {
  _hgPushUndo();
  const len = src.length;
  if (len === 32000) {
    // Multicolor raw per-pixel
    _hgMulti = true;
    for (let i = 0; i < 32000; i++) _hgPixMC[i] = src[i] & 0x0F;
  } else if (len === 10000) {
    // C64 native multicolor bitmap (8000 bitmap + 1000 screen RAM + 1000 color RAM)
    _hgMulti = true;
    const bg = _hgPaper & 0x0F;
    for (let cell = 0; cell < 1000; cell++) {
      const cellX = cell % 40, cellY = (cell / 40) | 0;
      const cx = cellX * 4, cy = cellY * 8;
      const c1 = (src[8000 + cell] >> 4) & 0x0F;
      const c2 = src[8000 + cell] & 0x0F;
      const c3 = src[9000 + cell] & 0x0F;
      const palette = [bg, c1, c2, c3];
      for (let row = 0; row < 8; row++) {
        const byte = src[cell * 8 + row];
        for (let px = 0; px < 4; px++) {
          const bits = (byte >> ((3 - px) * 2)) & 3;
          _hgPixMC[(cy + row) * 160 + (cx + px)] = palette[bits];
        }
      }
    }
  } else if (len === 9000 || len === 8000) {
    // C64 hi-res bitmap (+ optional screen RAM)
    _hgMulti = false;
    for (let cell = 0; cell < 1000; cell++) {
      const cx = (cell % 40) * 8, cy = ((cell / 40) | 0) * 8;
      const scr = len === 9000 ? src[8000 + cell] : 0x10; // default white/black
      _hgFgCell[cell] = (scr >> 4) & 0x0F;
      _hgBgCell[cell] = scr & 0x0F;
      for (let row = 0; row < 8; row++) {
        const byte = src[cell * 8 + row];
        for (let col = 0; col < 8; col++) {
          _hgBit[(cy + row) * 320 + (cx + col)] = (byte >> (7 - col)) & 1;
        }
      }
    }
  } else if (len === 64000) {
    // Legacy hi-res per-pixel colour → proper per-cell 2-colour reduction
    _hgMulti = false;
    const pal = _hgPal();
    _hgHiresFromRGB(function(x, y) { return pal[src[y * 320 + x] & 0x0F]; });
  } else {
    // Unknown size — best effort into the current mode
    const W = _hgW(), H = _hgH();
    if (!_hgMulti) {
      const pal = _hgPal();
      _hgHiresFromRGB(function(x, y) { const i = y * W + x; return pal[(i < len ? src[i] : _hgPaper) & 0x0F]; });
    } else {
      for (let i = 0; i < W * H; i++) _hgPixMC[i] = i < len ? (src[i] & 0x0F) : _hgPaper;
    }
  }
  const mc = document.getElementById("hg-multicolor");
  if (mc) mc.checked = _hgMulti;
  _hgRenderAll();
}

function _hgInit() {
  if (_hgInited) return;
  _hgInited = true;
  _hgBit    = new Uint8Array(320 * 200).fill(0);
  _hgFgCell = new Uint8Array(40 * 25).fill(1);
  _hgBgCell = new Uint8Array(40 * 25).fill(_hgPaper);
  _hgPixMC  = new Uint8Array(160 * 200).fill(_hgPaper);
  _hgCanvas = document.getElementById("hg-canvas");
  _hgCtx = _hgCanvas.getContext("2d");
  _hgBuf = document.createElement("canvas");
  _hgBufCtx = _hgBuf.getContext("2d");
  _hgBuildPalette();
}

function _hgExportBlocks() {
  const lines = [];
  const hx = n => "$" + (n & 0xFF).toString(16).toUpperCase().padStart(2, "0");
  const hx4 = n => n.toString(16).toUpperCase().padStart(4, "0");

  // 4 passes of 250 bytes using .for/.endf VA macros
  function pushCopy(srcBase, dstBase, pfx) {
    for (let i = 0; i < 4; i++) {
      lines.push(".for X, $FA, " + pfx + i);
      lines.push("LDA $" + hx4(srcBase + i * 250) + ",X");
      lines.push("STA $" + hx4(dstBase + i * 250) + ",X");
      lines.push(".endf " + pfx + i);
    }
    lines.push("");
  }

  if (_hgMulti) {
    lines.push("; Multicolor bitmap loader");
    lines.push("; 1) Export (.bin) -> D64-en legyen HIRES neven");
  } else {
    lines.push("; Hi-res bitmap loader");
    lines.push("; 1) Export (.bin) -> D64-en legyen HIRES neven");
  }
  lines.push("; 2) Compile, SYS 2061");
  lines.push("");
  lines.push("* = $080D");
  lines.push("");
  lines.push(".loadfile \"HIRES\", 8, $2000");
  lines.push("");
  lines.push("; Screen RAM $3F40 → $0400");
  pushCopy(0x3F40, 0x0400, "scr");
  if (_hgMulti) {
    lines.push("; Color RAM $4328 → $D800");
    pushCopy(0x4328, 0xD800, "col");
  }
  lines.push("; VIC-II " + (_hgMulti ? "multicolor" : "hires") + " bitmap");
  lines.push("LDA #$3B");
  lines.push("STA $D011");
  lines.push("LDA #" + (_hgMulti ? "$18" : "$08"));
  lines.push("STA $D016");
  lines.push("LDA #$18");
  lines.push("STA $D018");
  lines.push("LDA #$00");
  lines.push("STA $D020");
  lines.push("LDA #" + hx(_hgMulti ? _hgPaper : 0));
  lines.push("STA $D021");
  lines.push("");
  lines.push("hires_loop:");
  lines.push("JMP hires_loop");
  return lines.join("\n");
}

// Convert internal MC per-pixel format to C64 native multicolor bitmap (10000 bytes):
// [0..7999] packed bitmap, [8000..8999] screen RAM, [9000..9999] color RAM
function _hgExportMultiNative() {
  _hgInit();
  const out = new Uint8Array(10000);
  const bg = _hgPaper & 0x0F;
  for (let cellY = 0; cellY < 25; cellY++) {
    for (let cellX = 0; cellX < 40; cellX++) {
      const cell = cellY * 40 + cellX;
      const cx = cellX * 4, cy = cellY * 8;
      const extras = [];
      for (let row = 0; row < 8; row++) {
        for (let px = 0; px < 4; px++) {
          const c = _hgPixMC[(cy + row) * 160 + (cx + px)] & 0x0F;
          if (c !== bg && !extras.includes(c) && extras.length < 3) extras.push(c);
        }
      }
      while (extras.length < 3) extras.push(0);
      out[8000 + cell] = ((extras[0] & 0x0F) << 4) | (extras[1] & 0x0F);
      out[9000 + cell] = extras[2] & 0x0F;
      for (let row = 0; row < 8; row++) {
        let byte = 0;
        for (let px = 0; px < 4; px++) {
          const c = _hgPixMC[(cy + row) * 160 + (cx + px)] & 0x0F;
          const slot = c === bg ? 0 : c === extras[0] ? 1 : c === extras[1] ? 2 : c === extras[2] ? 3 : 0;
          byte |= (slot << ((3 - px) * 2));
        }
        out[cell * 8 + row] = byte;
      }
    }
  }
  return out;
}

function setupHiresEditor() {
  const dialog = document.getElementById("hires-editor-dialog");
  if (!dialog) return;

  document.getElementById("hires-editor-btn")?.addEventListener("click", function() {
    document.querySelector(".control-menu")?.removeAttribute("open");
    _hgInit();
    _hgRenderAll();
    _hgStatus(null);
    dialog.showModal();
  });
  document.getElementById("hg-close")?.addEventListener("click", function() { dialog.close(); });

  dialog.querySelectorAll(".hg-tool[data-tool]").forEach(function(btn) {
    btn.addEventListener("click", function() {
      _hgTool = btn.dataset.tool;
      dialog.querySelectorAll(".hg-tool[data-tool]").forEach(function(b) { b.classList.toggle("hg-tool--active", b === btn); });
    });
  });

  document.getElementById("hg-undo")?.addEventListener("click", _hgUndoOp);
  document.getElementById("hg-redo")?.addEventListener("click", _hgRedoOp);
  document.getElementById("hg-clear")?.addEventListener("click", function() {
    _hgPushUndo();
    if (_hgMulti) { _hgPixMC.fill(_hgPaper); }
    else { _hgBit.fill(0); _hgFgCell.fill(1); _hgBgCell.fill(_hgPaper); }
    _hgRenderAll();
  });

  document.getElementById("hg-multicolor")?.addEventListener("change", function(e) {
    const toMulti = !!e.target.checked;
    if (toMulti === _hgMulti) { _hgRenderAll(); return; }
    _hgPushUndo();
    if (toMulti) {
      // Hi-res (320 wide) → Multicolor (160 wide). Each MC pixel covers hires
      // columns 2x / 2x+1; keep the non-paper one if they differ (less loss).
      for (let y = 0; y < 200; y++)
        for (let x = 0; x < 160; x++) {
          const a = _hgGet(2 * x, y), b = _hgGet(2 * x + 1, y);
          _hgPixMC[y * 160 + x] = (a === _hgPaper && b !== _hgPaper) ? b : a;
        }
      _hgMulti = true;
    } else {
      // Multicolor (160 wide) → Hi-res (320 wide): each MC pixel → 2 hires
      // columns; reduce to 2 colours per 8×8 cell.
      const mc = _hgPixMC, pal = _hgPal();
      _hgMulti = false;
      _hgHiresFromRGB(function(x, y) { return pal[mc[y * 160 + (x >> 1)] & 0x0F]; });
    }
    _hgRenderAll();
  });
  document.getElementById("hg-grid")?.addEventListener("change", function(e) {
    _hgGrid = e.target.checked; _hgBlit();
  });
  document.getElementById("hg-raster")?.addEventListener("change", function(e) {
    _hgRaster = e.target.checked; _hgBlit();
  });
  // Paper colour: click sets it from the selected ink; right-click a palette
  // swatch also sets paper (wired in _hgBuildPalette).
  document.getElementById("hg-paper")?.addEventListener("click", function() { _hgSetPaper(_hgColor); });
  document.getElementById("hg-zoom")?.addEventListener("input", function(e) {
    _hgZoom = parseInt(e.target.value, 10);
    const lbl = document.getElementById("hg-zoom-val");
    if (lbl) lbl.textContent = _hgZoom + "×";
    _hgRenderAll();
  });

  // Import
  const impFile = document.getElementById("hg-import-file");
  document.getElementById("hg-import")?.addEventListener("click", function() { impFile?.click(); });
  impFile?.addEventListener("change", function(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (_hgIsBinFile(file) && !_hgIsImageFile(file)) {
      const reader = new FileReader();
      reader.onload = function() { _hgImportBytes(new Uint8Array(reader.result)); };
      reader.readAsArrayBuffer(file);
    } else {
      _hgImportImageFile(file);
    }
    e.target.value = "";
  });

  // Export / Save
  document.getElementById("hg-export")?.addEventListener("click", function() {
    _saveBinFile(_hgMulti ? _hgExportMultiNative() : _hgExportBytes(), _hgMulti ? "image-mc-native.bin" : "image-hires.bin");
  });
  document.getElementById("hg-export-blocks")?.addEventListener("click", function() {
    if (exportAsmToBlocks(_hgExportBlocks()) > 0) dialog.close();
  });
  document.getElementById("hg-save-d64")?.addEventListener("click", function() {
    const imageBytes = _hgMulti ? _hgExportMultiNative() : _hgExportBytes();
    const entryName = "HIRES";
    const entryAddr = _hgMulti ? "2000" : "";  // hires: fájl saját cíeme; multi: $2000
    const existingIdx = d64ExportState.extras.findIndex(e => e.name === entryName);
    if (existingIdx !== -1) d64ExportState.extras.splice(existingIdx, 1);
    d64ExportState.extras.push({
      name: entryName,
      sourcePath: _hgMulti ? "(multicolor editor — image-mc-native)" : "(hires editor — image-hires)",
      bytes: Array.from(imageBytes),
      loadAddress: entryAddr,
      crunch: false
    });
    showViceToast(`HIRES (${imageBytes.length} byte) hozzáadva a D64 Extra fájlokhoz`, false);
  });

  // Canvas interaction
  const canvas = document.getElementById("hg-canvas");
  const applyPoint = function(x, y) {
    const col = _hgTool === "eraser" ? _hgPaper : _hgColor;
    _hgSet(x, y, col);
    _hgRedrawCellBuf(x, y);
  };
  canvas.addEventListener("pointerdown", function(e) {
    if (e.button !== 0) return;
    _hgInit();
    const p = _hgPixelFromEvent(e);
    if (p.x < 0 || p.y < 0 || p.x >= _hgW() || p.y >= _hgH()) return;
    try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
    _hgPushUndo();
    _hgPainting = true; _hgStart = p; _hgLast = p;
    if (_hgTool === "pencil" || _hgTool === "eraser") { applyPoint(p.x, p.y); _hgBlit(); }
    else if (_hgTool === "fill") { _hgFloodFill(p.x, p.y, _hgColor); _hgRenderAll(); _hgPainting = false; }
    e.preventDefault();
  });
  canvas.addEventListener("pointermove", function(e) {
    const p = _hgPixelFromEvent(e);
    _hgStatus(p.x >= 0 && p.y >= 0 && p.x < _hgW() && p.y < _hgH() ? p.x : null, p.y);
    if (!_hgPainting) return;
    const col = _hgTool === "eraser" ? _hgPaper : _hgColor;
    if (_hgTool === "pencil" || _hgTool === "eraser") {
      _hgLine(_hgLast.x, _hgLast.y, p.x, p.y, function(x, y) { _hgSet(x, y, col); _hgRedrawCellBuf(x, y); });
      _hgLast = p; _hgBlit();
    } else {
      // shape preview: blit committed, draw preview on top
      _hgBlit();
      _hgCtx.fillStyle = _CE_COLORS[col];
      const pw = _hgPxW(), ph = _hgPxH();
      const draw = function(x, y) { if (x>=0&&y>=0&&x<_hgW()&&y<_hgH()) _hgCtx.fillRect(x*pw, y*ph, pw, ph); };
      _hgPreviewShape(_hgStart, p, draw);
    }
  });
  const endPaint = function(e) {
    if (!_hgPainting) return;
    _hgPainting = false;
    const p = (e && e.clientX != null) ? _hgPixelFromEvent(e) : _hgLast;
    if (_hgTool !== "pencil" && _hgTool !== "eraser" && _hgTool !== "fill") {
      const col = _hgColor;
      const set = function(x, y) { _hgSet(x, y, col); };
      _hgPreviewShape(_hgStart, p, set);
      _hgRenderAll();
    }
    if (e && e.pointerId != null) { try { canvas.releasePointerCapture(e.pointerId); } catch (_) {} }
  };
  canvas.addEventListener("pointerup", endPaint);
  canvas.addEventListener("pointercancel", endPaint);
  canvas.addEventListener("pointerleave", function() { _hgStatus(null); });
}

function _hgPreviewShape(a, b, set) {
  if (_hgTool === "line") _hgLine(a.x, a.y, b.x, b.y, set);
  else if (_hgTool === "rect") _hgRect(a.x, a.y, b.x, b.y, set, false);
  else if (_hgTool === "fillrect") _hgRect(a.x, a.y, b.x, b.y, set, true);
  else if (_hgTool === "oval") _hgOval(a.x, a.y, b.x, b.y, set, false);
  else if (_hgTool === "filloval") _hgOval(a.x, a.y, b.x, b.y, set, true);
}

/* Generic open/close wiring for all editor File menus (.ed-file). The menu
   items keep their original ids/data-attrs so existing handlers stay bound. */
function _setupFileMenus() {
  const allMenus = function() { return document.querySelectorAll(".ed-file-menu"); };
  document.querySelectorAll(".ed-file").forEach(function(wrap) {
    const btn = wrap.querySelector(".ed-file-btn");
    const menu = wrap.querySelector(".ed-file-menu");
    if (!btn || !menu) return;
    btn.addEventListener("click", function(e) {
      e.stopPropagation();
      const willOpen = menu.hidden;
      allMenus().forEach(function(m) { m.hidden = true; });
      menu.hidden = !willOpen;
    });
    menu.addEventListener("click", function(e) { e.stopPropagation(); });
    menu.querySelectorAll("button").forEach(function(b) {
      b.addEventListener("click", function() { menu.hidden = true; });
    });
  });
  document.addEventListener("click", function() {
    allMenus().forEach(function(m) { m.hidden = true; });
  });
}

/* =======================================================
   SPRITE EDITOR (24x21 hi-res / 12x21 multicolor, animated)
   ======================================================= */
const _SP_W = 24, _SP_H = 21;
let _spFrames = null;
let _spFrame = 0;
let _spMulti = false;
let _spGrid = true;
let _spZoom = 13;
let _spSlot = "sprite";
let _spCol = { sprite: 1, bg: 6, mc1: 0, mc2: 11 };
let _spWrap = false;
let _spPainting = false, _spPaintVal = 0;
let _spCanvas = null, _spCtx = null;
let _spInited = false;
let _spClip = null;
let _spPlay = null;
let _spPlayDir = 1;
let _spPingPong = false, _spOnion = false, _spFps = 6;

function _spCur() { return _spFrames[_spFrame]; }
function _spGet(x, y) { return (x<0||y<0||x>=_SP_W||y>=_SP_H) ? 0 : _spCur()[y*_SP_W+x]; }
function _spSet(x, y, v) {
  if (x<0||y<0||x>=_SP_W||y>=_SP_H) return;
  const f = _spCur();
  if (_spMulti) { const x0 = x & ~1; f[y*_SP_W+x0] = v; f[y*_SP_W+x0+1] = v; }
  else f[y*_SP_W+x] = v;
}
function _spSlotVal(slot) {
  if (slot === "bg") return 0;
  if (_spMulti) return slot === "mc1" ? 1 : slot === "mc2" ? 3 : 2;
  return 1;
}
function _spPenColor(v) {
  if (v === 0) return _spCol.bg;
  if (!_spMulti) return _spCol.sprite;
  return v === 1 ? _spCol.mc1 : v === 3 ? _spCol.mc2 : _spCol.sprite;
}

function _spRender() {
  const W = _SP_W * _spZoom, H = _SP_H * _spZoom;
  if (_spCanvas.width !== W) { _spCanvas.width = W; _spCanvas.height = H; }
  const z = _spZoom;
  for (let y = 0; y < _SP_H; y++)
    for (let x = 0; x < _SP_W; x++) {
      _spCtx.fillStyle = _CE_COLORS[_spPenColor(_spCur()[y*_SP_W+x])];
      _spCtx.fillRect(x*z, y*z, z, z);
    }
  if (_spOnion && _spFrames.length > 1) {
    const prev = _spFrames[(_spFrame - 1 + _spFrames.length) % _spFrames.length];
    _spCtx.globalAlpha = 0.3;
    for (let y = 0; y < _SP_H; y++)
      for (let x = 0; x < _SP_W; x++) {
        const v = prev[y*_SP_W+x];
        if (v !== 0) { _spCtx.fillStyle = _CE_COLORS[_spPenColor(v)]; _spCtx.fillRect(x*z, y*z, z, z); }
      }
    _spCtx.globalAlpha = 1;
  }
  if (_spGrid) {
    _spCtx.strokeStyle = "rgba(255,255,255,0.12)"; _spCtx.lineWidth = 1;
    _spCtx.beginPath();
    const step = _spMulti ? 2 : 1;
    for (let x = 0; x <= _SP_W; x += step) { _spCtx.moveTo(x*z+0.5, 0); _spCtx.lineTo(x*z+0.5, H); }
    for (let y = 0; y <= _SP_H; y++) { _spCtx.moveTo(0, y*z+0.5); _spCtx.lineTo(W, y*z+0.5); }
    _spCtx.stroke();
    _spCtx.strokeStyle = "rgba(255,255,255,0.32)"; _spCtx.beginPath();
    for (let x = 0; x <= _SP_W; x += 8) { _spCtx.moveTo(x*z+0.5, 0); _spCtx.lineTo(x*z+0.5, H); }
    _spCtx.stroke();
  }
  _spRenderPreview();
  _spRenderThumbs();
  const fl = document.getElementById("se-frame-label");
  if (fl) fl.textContent = t("seFrame") + " " + (_spFrame+1) + " / " + _spFrames.length;
}
function _spDrawFrameTo(ctx, frame, cw, ch) {
  const zx = cw / _SP_W, zy = ch / _SP_H;
  ctx.clearRect(0,0,cw,ch);
  ctx.fillStyle = _CE_COLORS[_spCol.bg]; ctx.fillRect(0,0,cw,ch);
  for (let y = 0; y < _SP_H; y++)
    for (let x = 0; x < _SP_W; x++) {
      const v = frame[y*_SP_W+x];
      if (v !== 0) { ctx.fillStyle = _CE_COLORS[_spPenColor(v)]; ctx.fillRect(Math.floor(x*zx), Math.floor(y*zy), Math.ceil(zx), Math.ceil(zy)); }
    }
}
function _spRenderPreview() {
  const c = document.getElementById("se-preview"); if (!c) return;
  _spDrawFrameTo(c.getContext("2d"), _spCur(), c.width, c.height);
}
function _spRenderThumbs() {
  const wrap = document.getElementById("se-anim-frames"); if (!wrap) return;
  wrap.innerHTML = "";
  _spFrames.forEach(function(fr, i) {
    const cv = document.createElement("canvas");
    cv.width = 48; cv.height = 42;
    cv.className = "se-frame-thumb" + (i === _spFrame ? " se-frame-thumb--active" : "");
    cv.title = t("seFrame") + " " + (i+1);
    _spDrawFrameTo(cv.getContext("2d"), fr, 48, 42);
    cv.addEventListener("click", function() { _spStop(); _spFrame = i; _spRender(); });
    wrap.appendChild(cv);
  });
}

function _spBuildColors() {
  const wrap = document.getElementById("se-colors"); if (!wrap) return;
  wrap.innerHTML = "";
  const slots = _spMulti
    ? [["sprite",t("seSpriteColor")],["mc1",t("seMultiColor1")],["mc2",t("seMultiColor2")],["bg",t("seBackground")]]
    : [["sprite",t("seSpriteColor")],["bg",t("seBackground")]];
  slots.forEach(function(s) {
    const row = document.createElement("div");
    row.className = "se-color-slot" + (s[0] === _spSlot ? " se-color-slot--active" : "");
    const sw = document.createElement("div"); sw.className = "se-color-sw"; sw.style.background = _CE_COLORS[_spCol[s[0]]];
    const nm = document.createElement("div"); nm.className = "se-color-name"; nm.textContent = s[1];
    row.appendChild(sw); row.appendChild(nm);
    row.addEventListener("click", function() { _spSlot = s[0]; _spBuildColors(); });
    wrap.appendChild(row);
  });
}
function _spBuildPalette() {
  const wrap = document.getElementById("se-palette"); if (!wrap || wrap.children.length) return;
  _CE_COLORS.forEach(function(hex, i) {
    const sw = document.createElement("div");
    sw.className = "se-swatch"; sw.style.background = hex; sw.title = "Color " + i;
    sw.addEventListener("click", function() { _spCol[_spSlot] = i; _spBuildColors(); _spRender(); });
    wrap.appendChild(sw);
  });
}

function _spFrameBytes(frame) {
  const out = new Uint8Array(64);
  for (let y = 0; y < _SP_H; y++) {
    for (let b = 0; b < 3; b++) {
      let byte = 0;
      if (_spMulti) {
        for (let j = 0; j < 4; j++) { const v = frame[y*_SP_W + (b*4+j)*2] & 3; byte |= v << ((3-j)*2); }
      } else {
        for (let i = 0; i < 8; i++) { if (frame[y*_SP_W + b*8 + i]) byte |= 1 << (7-i); }
      }
      out[y*3 + b] = byte;
    }
  }
  return out;
}
function _spExportText() {
  const fmtEl = document.getElementById("se-export-fmt");
  const fmt = fmtEl ? fmtEl.value : "hex";
  const allEl = document.getElementById("se-export-all");
  const all = allEl && allEl.checked;
  const frames = all ? _spFrames : [_spCur()];
  let out = "", line = 1000;
  frames.forEach(function(fr, fi) {
    const bytes = _spFrameBytes(fr);
    if (fmt === "basic") {
      out += line + " REM FRAME " + (all ? fi+1 : _spFrame+1) + "\n"; line += 10;
      for (let r = 0; r < 8; r++) {
        const row = [];
        for (let c = 0; c < 8; c++) row.push(bytes[r*8+c]);
        out += line + " DATA " + row.join(",") + "\n"; line += 10;
      }
    } else if (fmt === "asm") {
      out += "sprite_" + (all ? fi+1 : _spFrame+1) + ":\n";
      for (let r = 0; r < 8; r++) {
        const row = [];
        for (let c = 0; c < 8; c++) row.push("$" + bytes[r*8+c].toString(16).toUpperCase().padStart(2,"0"));
        out += "    .byte " + row.join(", ") + "\n";
      }
    } else {
      let s = "";
      for (let i = 0; i < 64; i++) s += bytes[i].toString(16).toUpperCase().padStart(2,"0") + (i%8===7?"\n":" ");
      out += s;
    }
    out += "\n";
  });
  return out.replace(/\s+$/, "");
}
/* Current frame as comma-separated hex bytes ($xx, $xx, …) — 63 sprite bytes. */
function _spHexCSV() {
  const bytes = _spFrameBytes(_spCur());
  const arr = [];
  for (let i = 0; i < 63; i++) arr.push("$" + bytes[i].toString(16).toUpperCase().padStart(2,"0"));
  return arr.join(", ");
}
function _spUpdateExport() {
  const el = document.getElementById("se-export-out");
  if (el) el.textContent = _spExportText();
}

function _spFlipH() { const f = _spCur(); for (let y=0;y<_SP_H;y++) for (let x=0;x<_SP_W/2;x++){ const i=y*_SP_W+x, j=y*_SP_W+(_SP_W-1-x); const t=f[i]; f[i]=f[j]; f[j]=t; } _spRender(); }
function _spFlipV() { const f = _spCur(); for (let y=0;y<_SP_H/2;y++) for (let x=0;x<_SP_W;x++){ const i=y*_SP_W+x, j=(_SP_H-1-y)*_SP_W+x; const t=f[i]; f[i]=f[j]; f[j]=t; } _spRender(); }
function _spShift(dir) {
  const f = _spCur(), n = new Uint8Array(_SP_W*_SP_H);
  for (let y=0;y<_SP_H;y++) for (let x=0;x<_SP_W;x++) {
    let sx=x, sy=y;
    if (dir==="left") sx=x+1; else if (dir==="right") sx=x-1; else if (dir==="up") sy=y+1; else sy=y-1;
    if (_spWrap) { sx=(sx+_SP_W)%_SP_W; sy=(sy+_SP_H)%_SP_H; n[y*_SP_W+x]=f[sy*_SP_W+sx]; }
    else { n[y*_SP_W+x] = (sx<0||sy<0||sx>=_SP_W||sy>=_SP_H) ? 0 : f[sy*_SP_W+sx]; }
  }
  f.set(n); _spRender();
}

function _spStop() { if (_spPlay) { clearInterval(_spPlay); _spPlay = null; } const b = document.getElementById("se-play"); if (b) b.textContent = t("sePlay"); }
function _spTogglePlay() {
  if (_spPlay) { _spStop(); return; }
  if (_spFrames.length < 2) return;
  _spPlayDir = 1;
  const b = document.getElementById("se-play"); if (b) b.textContent = t("seStop");
  _spPlay = setInterval(function() {
    if (_spPingPong) {
      _spFrame += _spPlayDir;
      if (_spFrame >= _spFrames.length-1) { _spFrame = _spFrames.length-1; _spPlayDir = -1; }
      else if (_spFrame <= 0) { _spFrame = 0; _spPlayDir = 1; }
    } else { _spFrame = (_spFrame + 1) % _spFrames.length; }
    _spRender();
  }, Math.round(1000 / _spFps));
}

function _spInit() {
  if (_spInited) return;
  _spInited = true;
  _spFrames = [new Uint8Array(_SP_W*_SP_H)];
  _spCanvas = document.getElementById("se-canvas");
  _spCtx = _spCanvas.getContext("2d");
  _spBuildColors();
  _spBuildPalette();
}

function setupSpriteEditor() {
  const dialog = document.getElementById("sprite-editor-dialog");
  if (!dialog) return;
  const sbtn = document.getElementById("sprite-editor-btn");
  if (sbtn) sbtn.addEventListener("click", function() {
    const cm = document.querySelector(".control-menu"); if (cm) cm.removeAttribute("open");
    _spInit(); _spRender(); dialog.showModal();
  });
  const cbtn = document.getElementById("se-close");
  if (cbtn) cbtn.addEventListener("click", function() { _spStop(); dialog.close(); });

  const canvas = document.getElementById("se-canvas");
  const cellFromEvent = function(e) {
    const r = canvas.getBoundingClientRect();
    const sx = canvas.width / r.width, sy = canvas.height / r.height;
    return { x: Math.floor((e.clientX-r.left)*sx/_spZoom), y: Math.floor((e.clientY-r.top)*sy/_spZoom) };
  };
  canvas.addEventListener("pointerdown", function(e) {
    if (e.button !== 0) return;
    _spInit();
    const p = cellFromEvent(e);
    if (p.x<0||p.y<0||p.x>=_SP_W||p.y>=_SP_H) return;
    try { canvas.setPointerCapture(e.pointerId); } catch(_){}
    const pen = _spSlotVal(_spSlot);
    _spPaintVal = (_spGet(p.x,p.y) === pen && pen !== 0) ? 0 : pen;
    _spPainting = true;
    _spSet(p.x, p.y, _spPaintVal); _spRender();
    e.preventDefault();
  });
  canvas.addEventListener("pointermove", function(e) {
    if (!_spPainting) return;
    const p = cellFromEvent(e);
    if (p.x<0||p.y<0||p.x>=_SP_W||p.y>=_SP_H) return;
    if (_spGet(p.x,p.y) === _spPaintVal) return;
    _spSet(p.x, p.y, _spPaintVal); _spRender();
  });
  const end = function(e){ _spPainting=false; if(e&&e.pointerId!=null){try{canvas.releasePointerCapture(e.pointerId);}catch(_){}}};
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);

  const onClick = function(id, fn){ const el=document.getElementById(id); if(el) el.addEventListener("click", fn); };
  const onChange = function(id, fn){ const el=document.getElementById(id); if(el) el.addEventListener("change", fn); };
  const onInput = function(id, fn){ const el=document.getElementById(id); if(el) el.addEventListener("input", fn); };

  onClick("se-fliph", _spFlipH);
  onClick("se-flipv", _spFlipV);
  onClick("se-clear", function() { _spCur().fill(0); _spRender(); });
  onClick("se-shl", function(){ _spShift("left"); });
  onClick("se-shr", function(){ _spShift("right"); });
  onClick("se-shu", function(){ _spShift("up"); });
  onClick("se-shd", function(){ _spShift("down"); });
  onChange("se-wrap", function(e){ _spWrap = e.target.checked; });

  onChange("se-multicolor", function(e) {
    _spMulti = e.target.checked;
    if (_spMulti) { _spFrames.forEach(function(f){ for(let y=0;y<_SP_H;y++) for(let x=0;x<_SP_W;x+=2){ const v=f[y*_SP_W+x]||f[y*_SP_W+x+1]; f[y*_SP_W+x]=v; f[y*_SP_W+x+1]=v; } }); }
    if (_spSlot==="mc1"||_spSlot==="mc2") _spSlot = "sprite";
    _spBuildColors(); _spRender();
  });
  onChange("se-grid", function(e){ _spGrid = e.target.checked; _spRender(); });
  onInput("se-zoom", function(e){ _spZoom = parseInt(e.target.value,10); _spRender(); });

  onClick("se-copy-data", function() { navigator.clipboard.writeText(_spHexCSV()).catch(function(){}); });

  onClick("se-play", _spTogglePlay);
  onChange("se-pingpong", function(e){ _spPingPong = e.target.checked; });
  onChange("se-onion", function(e){ _spOnion = e.target.checked; _spRender(); });
  onInput("se-fps", function(e){ _spFps = parseInt(e.target.value,10); const v=document.getElementById("se-fps-val"); if(v)v.textContent=_spFps; if(_spPlay){_spStop();_spTogglePlay();} });
  onClick("se-add", function(){ _spStop(); _spFrames.splice(_spFrame+1,0,new Uint8Array(_SP_W*_SP_H)); _spFrame++; _spRender(); });
  onClick("se-dup", function(){ _spStop(); _spFrames.splice(_spFrame+1,0,_spCur().slice(0)); _spFrame++; _spRender(); });
  onClick("se-fcopy", function(){ _spClip = _spCur().slice(0); });
  onClick("se-fpaste", function(){ if(_spClip){ _spCur().set(_spClip); _spRender(); } });
  onClick("se-fdel", function(){ _spStop(); if(_spFrames.length<=1){ _spCur().fill(0); } else { _spFrames.splice(_spFrame,1); if(_spFrame>=_spFrames.length)_spFrame=_spFrames.length-1; } _spRender(); });

  const fileIn = document.createElement("input"); fileIn.type = "file"; fileIn.accept = ".bin,.spd,application/octet-stream"; fileIn.hidden = true;
  dialog.appendChild(fileIn);
  onClick("se-open-spd", function(){ fileIn.click(); });
  fileIn.addEventListener("change", function(e){
    const file = e.target.files && e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = function(){ _spImportBin(new Uint8Array(reader.result)); };
    reader.readAsArrayBuffer(file); e.target.value = "";
  });
  onClick("se-save-bin", function(){
    const allEl = document.getElementById("se-export-all");
    const all = allEl && allEl.checked;
    const frames = all ? _spFrames : [_spCur()];
    const out = new Uint8Array(frames.length * 64);
    frames.forEach(function(fr,i){ out.set(_spFrameBytes(fr), i*64); });
    _saveBinFile(out, "sprite.bin");
  });
}

function _spImportBin(src) {
  _spStop();
  const count = Math.max(1, Math.floor(src.length / 64));
  _spFrames = [];
  for (let f = 0; f < count; f++) {
    const fr = new Uint8Array(_SP_W*_SP_H);
    for (let y = 0; y < _SP_H; y++)
      for (let b = 0; b < 3; b++) {
        const byte = src[f*64 + y*3 + b] || 0;
        if (_spMulti) { for (let j=0;j<4;j++){ const v=(byte>>((3-j)*2))&3; const x=(b*4+j)*2; fr[y*_SP_W+x]=v; fr[y*_SP_W+x+1]=v; } }
        else { for (let i=0;i<8;i++) fr[y*_SP_W+b*8+i] = (byte>>(7-i))&1; }
      }
    _spFrames.push(fr);
  }
  _spFrame = 0; _spRender();
}
function _spImportText(txt) {
  const nums = [];
  const re = /\$[0-9A-Fa-f]+|\d+/g; let m;
  while ((m = re.exec(txt)) !== null) { const t = m[0]; nums.push(t[0]==="$" ? parseInt(t.slice(1),16) : parseInt(t,10)); }
  const bytes = nums.filter(function(n){ return n>=0 && n<=255; });
  if (!bytes.length) return;
  _spImportBin(Uint8Array.from(bytes));
}

/* =======================================================
   SID EDITOR / PLAYER (3-voice tracker, Web Audio preview)
   ======================================================= */
const _SID_ROWS = 32;
let _sidInsts = null;     // instruments
let _sidPatterns = null;  // [pattern][voice 0..2][row 0..31] = {note, inst}
let _sidInst = 0, _sidPat = 0, _sidSpeed = 6;
let _sidSel = { voice: 0, row: 0 };
let _sidSelAnchor = null;  // row anchor for range selection, null = no range
let _sidClipboard = null;  // copied voice column: array of 32 {note, inst}
let _sidCellClip = null;   // cell-range clipboard: [{note,inst},...] from Ctrl+C
let _sidAudio = null;
let _sidTimer = null, _sidRow = 0;
let _sidInited = false;
let _sidOctave = 4;

// SID attack / decay-release time tables (ms) — approximate
const _SID_ATK = [2,8,16,24,38,56,68,80,100,250,500,800,1000,3000,5000,8000];
const _SID_DCR = [6,24,48,72,114,168,204,240,300,750,1500,2400,3000,9000,15000,24000];

function _sidNewInst(name) {
  return { name: name || t("sidNewInstrumentName"), tri:false, saw:false, pul:true, noi:false,
           pw:2048, a:2, d:8, s:6, r:4, lp:false, bp:false, hp:false, cut:1400, res:0, vol:15 };
}
function _sidNewPattern() {
  const p = [];
  for (let v = 0; v < 3; v++) { const col = []; for (let r = 0; r < _SID_ROWS; r++) col.push({ note:null, inst:0 }); p.push(col); }
  return p;
}
function _sidCurInst() { return _sidInsts[_sidInst]; }
function _sidCurPat() { return _sidPatterns[_sidPat]; }

const _SID_NOTE_NAMES = ["C-","C#","D-","D#","E-","F-","F#","G-","G#","A-","A#","B-"];
function _sidNoteName(n) {
  if (n == null) return "...";
  return _SID_NOTE_NAMES[n % 12] + Math.floor(n / 12);
}
function _sidNoteFreq(n) { return 440 * Math.pow(2, (n - 57) / 12); } // n: 0 = C-0

/* ── Instrument panel binding ── */
function _sidLoadInstUI() {
  const inst = _sidCurInst();
  const set = function(id, prop, isCheck) {
    const el = document.getElementById(id); if (!el) return;
    if (isCheck) el.checked = !!inst[prop]; else el.value = inst[prop];
  };
  document.getElementById("sid-inst-name").value = inst.name;
  set("sid-tri","tri",true); set("sid-saw","saw",true); set("sid-pul","pul",true); set("sid-noi","noi",true);
  set("sid-pw","pw"); set("sid-a","a"); set("sid-d","d"); set("sid-s","s"); set("sid-r","r");
  set("sid-lp","lp",true); set("sid-bp","bp",true); set("sid-hp","hp",true);
  set("sid-cut","cut"); set("sid-res","res"); set("sid-vol","vol");
  ["pw","a","d","s","r"].forEach(function(k){ const v=document.getElementById("sid-"+k+"-val"); if(v) v.textContent = inst[k]; });
  _sidDrawADSR();
}
function _sidBuildInstSel() {
  const sel = document.getElementById("sid-inst-sel"); if (!sel) return;
  sel.innerHTML = "";
  _sidInsts.forEach(function(ins, i) {
    const o = document.createElement("option");
    o.value = i; o.textContent = (i<16?"0":"") + i.toString(16).toUpperCase() + ": " + ins.name;
    sel.appendChild(o);
  });
  sel.value = _sidInst;
}

/* ── ADSR graph ── */
let _sidAdsrGeom = null;
function _sidDrawADSR() {
  const c = document.getElementById("sid-adsr-canvas"); if (!c) return;
  const ctx = c.getContext("2d"), W = c.width, H = c.height;
  ctx.clearRect(0,0,W,H);
  const inst = _sidCurInst();
  const x0 = 10, x1 = W - 10, yTop = 10, y0 = H - 18, span = x1 - x0, q = span / 4;
  // grid (4 horizontal levels + 3 segment dividers)
  ctx.strokeStyle = "rgba(120,140,200,0.12)"; ctx.lineWidth = 1;
  for (let g = 0; g <= 4; g++) { const y = yTop + (y0-yTop)*g/4; ctx.beginPath(); ctx.moveTo(x0,y); ctx.lineTo(x1,y); ctx.stroke(); }
  for (let g = 1; g < 4; g++) { const x = x0 + q*g; ctx.beginPath(); ctx.moveTo(x,yTop); ctx.lineTo(x,y0); ctx.stroke(); }
  // handle positions: A in 1st quarter, D in 2nd, sustain-hold 3rd, R in 4th
  const susY = y0 - (y0 - yTop) * (inst.s / 15);
  const ax = x0 + q * (inst.a / 15);
  const dx = x0 + q + q * (inst.d / 15);
  const sx = x0 + 3 * q;
  const rx = x0 + 3 * q + q * (inst.r / 15);
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(ax, yTop); ctx.lineTo(dx, susY); ctx.lineTo(sx, susY); ctx.lineTo(rx, y0);
  ctx.strokeStyle = "#5ec8ff"; ctx.lineWidth = 2; ctx.stroke();
  ctx.lineTo(x0, y0); ctx.closePath(); ctx.fillStyle = "rgba(94,200,255,0.12)"; ctx.fill();
  const handles = [{id:"a",x:ax,y:yTop},{id:"d",x:dx,y:susY},{id:"s",x:sx,y:susY},{id:"r",x:rx,y:y0}];
  ctx.fillStyle = "#5ec8ff";
  handles.forEach(function(p){ ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, 7); ctx.fill(); });
  ctx.fillStyle = "#6a7a9a"; ctx.font = "10px monospace";
  ctx.fillText("A", ax-3, H-4); ctx.fillText("D", dx-3, H-4); ctx.fillText("S", sx-3, H-4); ctx.fillText("R", rx-3, H-4);
  _sidAdsrGeom = { x0:x0, x1:x1, yTop:yTop, y0:y0, q:q, handles:handles };
}

/* ── Tracker grid ── */
function _sidCellText(cell) {
  if (cell.note == null) return "... ..";
  return _sidNoteName(cell.note) + " " + (cell.inst<16?"0":"") + cell.inst.toString(16).toUpperCase();
}
function _sidCopyVoice() {
  if (!_sidPatterns) return;
  const col = _sidCurPat()[_sidSel.voice];
  _sidClipboard = col.map(function(c){ return { note: c.note, inst: c.inst }; });
  const btn = document.getElementById("sid-voice-copy");
  if (btn) {
    const orig = btn.title;
    btn.title = "Copied!";
    setTimeout(function(){ btn.title = orig; }, 1000);
  }
}
function _sidPasteVoice() {
  if (!_sidClipboard || !_sidPatterns) return;
  const col = _sidCurPat()[_sidSel.voice];
  for (var r = 0; r < _sidClipboard.length; r++) {
    col[r] = { note: _sidClipboard[r].note, inst: _sidClipboard[r].inst };
  }
  _sidBuildTracker();
}
function _sidCopyCells() {
  if (!_sidPatterns) return;
  const v = _sidSel.voice, col = _sidCurPat()[v];
  if (_sidSelAnchor !== null) {
    const lo = Math.min(_sidSelAnchor, _sidSel.row);
    const hi = Math.max(_sidSelAnchor, _sidSel.row);
    _sidCellClip = [];
    for (let r = lo; r <= hi; r++) _sidCellClip.push({ note: col[r].note, inst: col[r].inst });
  } else {
    _sidCellClip = [{ note: col[_sidSel.row].note, inst: col[_sidSel.row].inst }];
  }
  const btn = document.getElementById("sid-voice-copy");
  if (btn) { const o = btn.title; btn.title = "Copied!"; setTimeout(function(){ btn.title = o; }, 1000); }
}
function _sidPasteCells() {
  if (!_sidCellClip || !_sidPatterns) return;
  const v = _sidSel.voice, col = _sidCurPat()[v];
  for (let i = 0; i < _sidCellClip.length; i++) {
    const r = (_sidSel.row + i) % _SID_ROWS;
    col[r] = { note: _sidCellClip[i].note, inst: _sidCellClip[i].inst };
  }
  _sidBuildTracker();
}
function _sidBuildTracker() {
  const t = document.getElementById("sid-tracker"); if (!t) return;
  const pat = _sidCurPat();
  let html = "<thead><tr><th></th><th>VOICE 1</th><th>VOICE 2</th><th>VOICE 3</th></tr></thead><tbody>";
  for (let r = 0; r < _SID_ROWS; r++) {
    const beat = (r % 4 === 0) ? " sid-beat" : "";
    html += '<tr class="sid-trow'+beat+'" data-row="'+r+'">';
    html += '<td class="sid-rownum">' + (r<10?"0":"") + r + '</td>';
    const rangeLo = _sidSelAnchor !== null ? Math.min(_sidSelAnchor, _sidSel.row) : _sidSel.row;
    const rangeHi = _sidSelAnchor !== null ? Math.max(_sidSelAnchor, _sidSel.row) : _sidSel.row;
    for (let v = 0; v < 3; v++) {
      const isCursor = _sidSel.voice === v && _sidSel.row === r;
      const inRange  = _sidSel.voice === v && _sidSelAnchor !== null && r >= rangeLo && r <= rangeHi && !isCursor;
      const selCls = isCursor ? " sid-cell--sel" : (inRange ? " sid-cell--sel-range" : "");
      html += '<td class="sid-cell'+selCls+'" data-v="'+v+'" data-r="'+r+'">' + _sidCellText(pat[v][r]) + '</td>';
    }
    html += "</tr>";
  }
  html += "</tbody>";
  t.innerHTML = html;
  t.querySelectorAll("td.sid-cell").forEach(function(td) {
    td.addEventListener("click", function(e) {
      const v = +td.dataset.v, r = +td.dataset.r;
      if (e.shiftKey && _sidSel.voice === v) {
        if (_sidSelAnchor === null) _sidSelAnchor = _sidSel.row;
        _sidSel.row = r;
      } else {
        _sidSelAnchor = null;
        _sidSel = { voice: v, row: r };
      }
      _sidRefreshSel();
      document.getElementById("sid-tracker-wrap").focus();
    });
  });
}
function _sidRefreshSel() {
  const t = document.getElementById("sid-tracker"); if (!t) return;
  t.querySelectorAll("td.sid-cell--sel, td.sid-cell--sel-range").forEach(function(td){
    td.classList.remove("sid-cell--sel");
    td.classList.remove("sid-cell--sel-range");
  });
  const v = _sidSel.voice, r = _sidSel.row;
  const cursor = t.querySelector('td.sid-cell[data-v="'+v+'"][data-r="'+r+'"]');
  if (cursor) cursor.classList.add("sid-cell--sel");
  if (_sidSelAnchor !== null) {
    const lo = Math.min(_sidSelAnchor, r), hi = Math.max(_sidSelAnchor, r);
    for (let row = lo; row <= hi; row++) {
      if (row === r) continue;
      const rc = t.querySelector('td.sid-cell[data-v="'+v+'"][data-r="'+row+'"]');
      if (rc) rc.classList.add("sid-cell--sel-range");
    }
  }
}
function _sidSetCellText(v, r) {
  const t = document.getElementById("sid-tracker"); if (!t) return;
  const td = t.querySelector('td.sid-cell[data-v="'+v+'"][data-r="'+r+'"]');
  if (td) td.textContent = _sidCellText(_sidCurPat()[v][r]);
}

/* Keyboard note mapping (tracker style, one octave + above) */
const _SID_KEYMAP = { z:0,s:1,x:2,d:3,c:4,v:5,g:6,b:7,h:8,n:9,j:10,m:11,
  q:12,2:13,w:14,3:15,e:16,r:18,5:19,t:20,6:21,y:22,7:23,u:24,i:26 };

/* ── Audio ── */
function _sidEnsureAudio() {
  if (!_sidAudio) _sidAudio = new (window.AudioContext || window.webkitAudioContext)();
  if (_sidAudio.state === "suspended") _sidAudio.resume();
  return _sidAudio;
}
let _sidNoiseBuf = null;
function _sidNoise(ac) {
  if (!_sidNoiseBuf) {
    _sidNoiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
    const d = _sidNoiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random()*2-1;
  }
  const s = ac.createBufferSource(); s.buffer = _sidNoiseBuf; s.loop = true; return s;
}
function _sidPlayInst(inst, freq, when, holdSec) {
  const ac = _sidEnsureAudio();
  let src;
  if (inst.noi) { src = _sidNoise(ac); }
  else {
    src = ac.createOscillator();
    src.type = inst.pul ? "square" : inst.saw ? "sawtooth" : inst.tri ? "triangle" : "square";
    src.frequency.value = freq;
  }
  const gain = ac.createGain();
  const atk = _SID_ATK[inst.a]/1000, dec = _SID_DCR[inst.d]/1000, rel = _SID_DCR[inst.r]/1000;
  const peak = (inst.vol/15) * 0.22;
  const sus = peak * (inst.s/15);
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.linearRampToValueAtTime(peak, when + Math.max(0.002, atk));
  gain.gain.linearRampToValueAtTime(Math.max(0.0001, sus), when + Math.max(0.002, atk) + Math.max(0.002, dec));
  const relStart = when + Math.max(0.05, holdSec);
  gain.gain.setValueAtTime(Math.max(0.0001, sus), relStart);
  gain.gain.linearRampToValueAtTime(0.0001, relStart + Math.max(0.01, rel));
  let node = src;
  node.connect(gain);
  let out = gain;
  if (inst.lp || inst.bp || inst.hp) {
    const filt = ac.createBiquadFilter();
    filt.type = inst.hp ? "highpass" : inst.bp ? "bandpass" : "lowpass";
    filt.frequency.value = 30 + (inst.cut/2047) * 9000;
    filt.Q.value = 0.5 + (inst.res/15) * 8;
    gain.connect(filt); out = filt;
  }
  out.connect(ac.destination);
  src.start(when);
  src.stop(relStart + Math.max(0.01, rel) + 0.05);
}

function _sidStop() {
  if (_sidTimer) { clearInterval(_sidTimer); _sidTimer = null; }
  const t = document.getElementById("sid-tracker");
  if (t) t.querySelectorAll("tr.sid-playing").forEach(function(r){ r.classList.remove("sid-playing"); });
}
function _sidPlay() {
  _sidStop();
  _sidEnsureAudio();
  _sidRow = 0;
  const rowSec = Math.max(0.04, _sidSpeed / 50);
  const t = document.getElementById("sid-tracker");
  const tick = function() {
    const ac = _sidAudio, when = ac.currentTime + 0.02;
    const pat = _sidCurPat();
    for (let v = 0; v < 3; v++) {
      const cell = pat[v][_sidRow];
      if (cell.note != null) _sidPlayInst(_sidInsts[cell.inst] || _sidCurInst(), _sidNoteFreq(cell.note), when, rowSec);
    }
    if (t) {
      t.querySelectorAll("tr.sid-playing").forEach(function(r){ r.classList.remove("sid-playing"); });
      const tr = t.querySelector('tr.sid-trow[data-row="'+_sidRow+'"]');
      if (tr) { tr.classList.add("sid-playing"); tr.scrollIntoView({ block: "nearest" }); }
    }
    _sidRow = (_sidRow + 1) % _SID_ROWS;
  };
  tick();
  _sidTimer = setInterval(tick, rowSec * 1000);
}

/* ── Export ── */
function _sidWaveByte(inst) {
  return (inst.tri?0x10:0) | (inst.saw?0x20:0) | (inst.pul?0x40:0) | (inst.noi?0x80:0) | 0x01;
}
function _sidInstBytes(ins) {
  return [_sidWaveByte(ins), (ins.a<<4)|ins.d, (ins.s<<4)|ins.r,
          ins.pw&0xFF, (ins.pw>>8)&0x0F, ins.cut&0x07, (ins.cut>>3)&0xFF,
          (ins.res<<4), ((ins.lp?0x10:0)|(ins.bp?0x20:0)|(ins.hp?0x40:0))|ins.vol];
}
/* Binary save/load: [numInst][numPat] + 9 bytes/inst + 2 bytes/cell (note+1, inst) */
function _sidSerialize() {
  const out = [_sidInsts.length, _sidPatterns.length];
  _sidInsts.forEach(function(ins){ _sidInstBytes(ins).forEach(function(b){ out.push(b & 0xFF); }); });
  _sidPatterns.forEach(function(pat){ for (let v=0;v<3;v++) for (let r=0;r<_SID_ROWS;r++){ const c=pat[v][r]; out.push(c.note==null?0:(c.note+1)&0xFF); out.push(c.inst&0xFF); } });
  return Uint8Array.from(out);
}
function _sidDeserialize(src) {
  _sidStop();
  let p = 0;
  const ni = src[p++] || 0, np = src[p++] || 0;
  _sidInsts = [];
  for (let i=0;i<ni;i++) {
    const ctrl=src[p++], ad=src[p++], sr=src[p++], pwlo=src[p++], pwhi=src[p++], cutlo=src[p++], cuthi=src[p++], resfilt=src[p++], mv=src[p++];
    _sidInsts.push({ name:"Sound "+i,
      tri:!!(ctrl&0x10), saw:!!(ctrl&0x20), pul:!!(ctrl&0x40), noi:!!(ctrl&0x80),
      pw:(pwlo|((pwhi&0x0F)<<8)), a:(ad>>4)&0x0F, d:ad&0x0F, s:(sr>>4)&0x0F, r:sr&0x0F,
      lp:!!(mv&0x10), bp:!!(mv&0x20), hp:!!(mv&0x40),
      cut:((cutlo&0x07)|((cuthi&0xFF)<<3)), res:(resfilt>>4)&0x0F, vol:mv&0x0F });
  }
  if (!_sidInsts.length) _sidInsts = [_sidNewInst()];
  _sidPatterns = [];
  for (let pi=0; pi<np; pi++) {
    const pat = _sidNewPattern();
    for (let v=0;v<3;v++) for (let r=0;r<_SID_ROWS;r++){ const note=src[p++], inst=src[p++]; pat[v][r] = { note: note ? note-1 : null, inst: inst||0 }; }
    _sidPatterns.push(pat);
  }
  if (!_sidPatterns.length) _sidPatterns = [_sidNewPattern()];
  _sidInst = 0; _sidPat = 0;
  _sidBuildInstSel(); _sidLoadInstUI(); _sidBuildPatSel(); _sidBuildTracker();
}
function _sidExport(kind) {
  if (kind === "asm") return _sidExportAsmPlayable();
  // BASIC DATA dump (unchanged legacy path)
  let lines = [];
  const dd = function(arr){ return arr.join(","); };
  _sidInsts.forEach(function(ins, i) {
    const ctrl = _sidWaveByte(ins);
    const ad = (ins.a<<4) | ins.d;
    const sr = (ins.s<<4) | ins.r;
    const resFilt = (ins.res<<4) | 0;
    const modeVol = ((ins.lp?0x10:0)|(ins.bp?0x20:0)|(ins.hp?0x40:0)) | ins.vol;
    const bytes = [ctrl, ad, sr, ins.pw&0xFF, (ins.pw>>8)&0x0F, ins.cut&0x07, (ins.cut>>3)&0xFF, resFilt, modeVol];
    lines.push((1000+i*10) + " DATA " + dd(bytes) + " : REM " + ins.name);
  });
  _sidPatterns.forEach(function(pat, pi) {
    lines.push("REM PATTERN " + pi);
    for (let v = 0; v < 3; v++) {
      const notes = [];
      for (let r = 0; r < _SID_ROWS; r++) { const c = pat[v][r]; notes.push(c.note==null ? 0 : (c.note+1)); }
      lines.push((2000+pi*100+v*30) + " DATA " + dd(notes));
    }
  });
  return lines.join("\n");
}

// Build a self-contained, playable C64 SID module in Visual Assembler / Kick
// syntax: PAL 50Hz IRQ-driven player at $C000 + all instrument/pattern/freq
// tables. The user calls `JSR sid_init` from their main code to start playback.
function _sidExportDataOnly() {
  const lines = [];
  const hx = function(n){ return "$" + (n&0xFF).toString(16).toUpperCase().padStart(2,"0"); };
  const dh = function(arr){ return arr.map(hx).join(", "); };
  const chunk = function(label, arr, perLine) {
    perLine = perLine || 16;
    lines.push(label + ":");
    for (let i = 0; i < arr.length; i += perLine)
      lines.push("    .byte " + dh(arr.slice(i, i + perLine)));
  };
  const maxPatterns = Math.floor(255 / _SID_ROWS);
  const exportedPatterns = Math.min(_sidPatterns.length, maxPatterns);

  lines.push("; SID music data (generated by Visual Assembler SID editor)");
  lines.push("; " + exportedPatterns + " pattern(s), " + _SID_ROWS + " rows, 3 voices");
  lines.push("; ctrl, AD, SR, PWlo, PWhi, cut_lo, cut_hi, res/filt, mode/vol");
  lines.push("");

  lines.push("sid_instruments:");
  _sidInsts.forEach(function(ins, i) {
    const ctrl = _sidWaveByte(ins);
    const ad = (ins.a<<4) | ins.d;
    const sr = (ins.s<<4) | ins.r;
    const filterActive = ins.lp || ins.bp || ins.hp;
    const resFilt = (ins.res<<4) | (filterActive ? 0x07 : 0x00);
    const modeVol = ((ins.lp?0x10:0)|(ins.bp?0x20:0)|(ins.hp?0x40:0)) | ins.vol;
    lines.push("    .byte " + dh([ctrl, ad, sr, ins.pw&0xFF, (ins.pw>>8)&0x0F, ins.cut&0x07, (ins.cut>>3)&0xFF, resFilt, modeVol]) + "   ; #" + i + " " + ins.name);
  });
  lines.push("");

  for (let v = 0; v < 3; v++) {
    const notes = [], insts = [];
    for (let pi = 0; pi < exportedPatterns; pi++) {
      const pat = _sidPatterns[pi];
      for (let r = 0; r < _SID_ROWS; r++) {
        const c = pat[v][r];
        notes.push(c.note == null ? 0 : (c.note + 1));
        insts.push((c.inst|0) & 0xFF);
      }
    }
    chunk("sid_v" + v + "_notes", notes);
    chunk("sid_v" + v + "_insts", insts);
  }
  lines.push("");

  const freqLo = [], freqHi = [];
  for (let n = 0; n < 96; n++) {
    const hz = 440 * Math.pow(2, (n - 57) / 12);
    let f = Math.round(hz * 16777216 / 985248);
    if (f > 0xFFFF) f = 0xFFFF;
    freqLo.push(f & 0xFF);
    freqHi.push((f >> 8) & 0xFF);
  }
  lines.push("; PAL frequency table (note 0 = C-0, note 95 = B-7)");
  chunk("sid_freq_lo", freqLo);
  chunk("sid_freq_hi", freqHi);

  return lines.join("\n");
}

function _sidExportAsmPlayable() {
  const lines = [];
  const hx = function(n){ return "$" + (n&0xFF).toString(16).toUpperCase().padStart(2,"0"); };
  const dh = function(arr){ return arr.map(hx).join(", "); };
  const chunk = function(label, arr, perLine) {
    perLine = perLine || 16;
    lines.push(label + ":");
    for (let i = 0; i < arr.length; i += perLine) {
      lines.push("    .byte " + dh(arr.slice(i, i + perLine)));
    }
  };

  const speed = Math.max(1, Math.min(255, _sidSpeed|0));
  const maxPatterns = Math.floor(255 / _SID_ROWS);  // single-byte row counter limit
  const exportedPatterns = Math.min(_sidPatterns.length, maxPatterns);
  const totalRows = exportedPatterns * _SID_ROWS;

  lines.push("; =========================================================");
  lines.push("; SID player + tune (generated by Visual Assembler SID editor)");
  lines.push("; PAL 50 Hz IRQ-driven, 3 voices, " + _SID_ROWS + "-row patterns");
  lines.push("; Call JSR sid_init once to start playback; JSR sid_stop to silence.");
  lines.push("; Speed: " + speed + " frames/row, " + exportedPatterns + " pattern(s) = " + totalRows + " rows.");
  if (exportedPatterns < _sidPatterns.length) {
    lines.push("; NOTE: only the first " + exportedPatterns + " patterns are exported (" +
               _sidPatterns.length + " present); player uses an 8-bit row counter.");
  }
  lines.push("; =========================================================");
  lines.push("");
  lines.push("* = $080D");
  lines.push("");
  lines.push("sid_main:");
  lines.push("    JSR sid_init");
  lines.push("sid_main_loop:");
  lines.push("    JMP sid_main_loop");
  lines.push("");
  lines.push("* = $C000");
  lines.push("");

  // ---- sid_init ----------------------------------------------------------
  lines.push("sid_init:");
  lines.push("    SEI");
  lines.push("    LDA #$00");
  lines.push("    STA $D418");
  lines.push("    LDX #$18");
  lines.push("sid_clr:");
  lines.push("    STA $D400,X");
  lines.push("    DEX");
  lines.push("    BPL sid_clr");
  lines.push("    LDA #" + hx(speed));
  lines.push("    STA $FB");           // SID_TICK
  lines.push("    LDA #$00");
  lines.push("    STA $FC");           // SID_ROW
  lines.push("    LDA #<sid_irq");
  lines.push("    STA $0314");
  lines.push("    LDA #>sid_irq");
  lines.push("    STA $0315");
  lines.push("    LDA #$01");
  lines.push("    STA $D01A");         // enable raster IRQ
  lines.push("    LDA #$80");
  lines.push("    STA $D012");         // trigger raster line $80
  lines.push("    LDA $D011");
  lines.push("    AND #$7F");
  lines.push("    STA $D011");         // clear bit 8 of raster
  lines.push("    LDA #$7F");
  lines.push("    STA $DC0D");         // CIA1 ints off
  lines.push("    STA $DD0D");         // CIA2 ints off
  lines.push("    LDA $DC0D");         // ack pending CIA1
  lines.push("    LDA $DD0D");         // ack pending CIA2
  lines.push("    CLI");
  lines.push("    RTS");
  lines.push("");

  // ---- sid_stop ----------------------------------------------------------
  lines.push("sid_stop:");
  lines.push("    SEI");
  lines.push("    LDA #$00");
  lines.push("    STA $D01A");         // disable raster IRQ
  lines.push("    STA $D404");         // voice 1 gate off
  lines.push("    STA $D40B");         // voice 2 gate off
  lines.push("    STA $D412");         // voice 3 gate off
  lines.push("    STA $D418");         // master vol = 0
  lines.push("    LDA #$81");
  lines.push("    STA $DC0D");         // restore CIA1 timer A IRQ
  lines.push("    LDA #$31");
  lines.push("    STA $0314");
  lines.push("    LDA #$EA");
  lines.push("    STA $0315");         // restore KERNAL IRQ vector
  lines.push("    CLI");
  lines.push("    RTS");
  lines.push("");

  // ---- sid_irq -----------------------------------------------------------
  lines.push("sid_irq:");
  lines.push("    LDA #$01");
  lines.push("    STA $D019");         // ack raster
  lines.push("    DEC $FB");           // SID_TICK
  lines.push("    BNE sid_irq_done");
  lines.push("    LDA #" + hx(speed));
  lines.push("    STA $FB");
  lines.push("    JSR sid_play_row");
  lines.push("sid_irq_done:");
  lines.push("    JMP $EA31");
  lines.push("");

  // ---- sid_play_row ------------------------------------------------------
  lines.push("sid_play_row:");
  lines.push("    LDY $FC");           // Y = current row
  lines.push("    LDA sid_v0_notes,Y");
  lines.push("    BEQ sid_skip_v0");
  lines.push("    LDX sid_v0_insts,Y");
  lines.push("    LDY #$00");          // voice base offset
  lines.push("    JSR sid_set_voice");
  lines.push("    LDY $FC");
  lines.push("sid_skip_v0:");
  lines.push("    LDA sid_v1_notes,Y");
  lines.push("    BEQ sid_skip_v1");
  lines.push("    LDX sid_v1_insts,Y");
  lines.push("    LDY #$07");
  lines.push("    JSR sid_set_voice");
  lines.push("    LDY $FC");
  lines.push("sid_skip_v1:");
  lines.push("    LDA sid_v2_notes,Y");
  lines.push("    BEQ sid_skip_v2");
  lines.push("    LDX sid_v2_insts,Y");
  lines.push("    LDY #$0E");
  lines.push("    JSR sid_set_voice");
  lines.push("sid_skip_v2:");
  lines.push("    INC $FC");
  lines.push("    LDA $FC");
  lines.push("    CMP #" + hx(totalRows & 0xFF));
  lines.push("    BCC sid_row_done");
  lines.push("    LDA #$00");
  lines.push("    STA $FC");
  lines.push("sid_row_done:");
  lines.push("    RTS");
  lines.push("");

  // ---- sid_set_voice (A=note 1..96, X=inst index, Y=voice base 0/7/14) --
  lines.push("sid_set_voice:");
  lines.push("    PHA");               // save note
  lines.push("    TXA");
  lines.push("    PHA");               // save inst
  lines.push("    LDA $D404,Y");
  lines.push("    AND #$FE");
  lines.push("    STA $D404,Y");       // gate off
  lines.push("    PLA");               // A = inst
  lines.push("    TAX");
  lines.push("    ASL");
  lines.push("    ASL");
  lines.push("    ASL");               // A = inst*8
  lines.push("    STA $FD");           // SID_TMP
  lines.push("    TXA");
  lines.push("    CLC");
  lines.push("    ADC $FD");           // A = inst*9
  lines.push("    TAX");               // X = offset into sid_instruments
  lines.push("    LDA sid_instruments+3,X");
  lines.push("    STA $D402,Y");       // PW lo
  lines.push("    LDA sid_instruments+4,X");
  lines.push("    STA $D403,Y");       // PW hi
  lines.push("    LDA sid_instruments+1,X");
  lines.push("    STA $D405,Y");       // AD
  lines.push("    LDA sid_instruments+2,X");
  lines.push("    STA $D406,Y");       // SR
  lines.push("    LDA sid_instruments,X");
  lines.push("    STA $FD");           // stash ctrl (gate-on byte) for later
  lines.push("    CPY #$00");
  lines.push("    BNE sid_no_filt");
  lines.push("    LDA sid_instruments+5,X");
  lines.push("    STA $D415");         // filter cutoff lo
  lines.push("    LDA sid_instruments+6,X");
  lines.push("    STA $D416");         // filter cutoff hi
  lines.push("    LDA sid_instruments+7,X");
  lines.push("    STA $D417");         // resonance / filter route
  lines.push("    LDA sid_instruments+8,X");
  lines.push("    STA $D418");         // mode + master volume
  lines.push("sid_no_filt:");
  lines.push("    PLA");               // A = note (1..96)
  lines.push("    SEC");
  lines.push("    SBC #$01");          // note-1 → 0-based freq table index
  lines.push("    TAX");
  lines.push("    LDA sid_freq_lo,X");
  lines.push("    STA $D400,Y");
  lines.push("    LDA sid_freq_hi,X");
  lines.push("    STA $D401,Y");
  lines.push("    LDA $FD");
  lines.push("    STA $D404,Y");       // gate on with full ctrl byte
  lines.push("    RTS");
  lines.push("");

  // ---- Instrument table (9 bytes per instrument, contiguous) ------------
  lines.push("; Instruments: ctrl, AD, SR, PWlo, PWhi, cut_lo, cut_hi, res/filt, mode/vol");
  lines.push("sid_instruments:");
  _sidInsts.forEach(function(ins, i) {
    const ctrl = _sidWaveByte(ins);
    const ad = (ins.a<<4) | ins.d;
    const sr = (ins.s<<4) | ins.r;
    const filterActive = ins.lp || ins.bp || ins.hp;
    const resFilt = (ins.res<<4) | (filterActive ? 0x07 : 0x00);
    const modeVol = ((ins.lp?0x10:0)|(ins.bp?0x20:0)|(ins.hp?0x40:0)) | ins.vol;
    const bytes = [ctrl, ad, sr, ins.pw&0xFF, (ins.pw>>8)&0x0F, ins.cut&0x07, (ins.cut>>3)&0xFF, resFilt, modeVol];
    lines.push("    .byte " + dh(bytes) + "   ; #" + i + " " + ins.name);
  });
  lines.push("");

  // ---- Notes + instrument-per-cell per voice, all patterns concatenated -
  for (let v = 0; v < 3; v++) {
    const notes = [];
    const insts = [];
    for (let pi = 0; pi < exportedPatterns; pi++) {
      const pat = _sidPatterns[pi];
      for (let r = 0; r < _SID_ROWS; r++) {
        const c = pat[v][r];
        notes.push(c.note == null ? 0 : (c.note + 1));
        insts.push((c.inst|0) & 0xFF);
      }
    }
    chunk("sid_v" + v + "_notes", notes);
    chunk("sid_v" + v + "_insts", insts);
  }
  lines.push("");

  // ---- PAL frequency tables (96 notes: C-0..B-7) -------------------------
  const freqLo = [], freqHi = [];
  const Fclk = 985248; // PAL
  for (let n = 0; n < 96; n++) {
    const hz = 440 * Math.pow(2, (n - 57) / 12);
    let f = Math.round(hz * 16777216 / Fclk);
    if (f > 0xFFFF) f = 0xFFFF;
    freqLo.push(f & 0xFF);
    freqHi.push((f >> 8) & 0xFF);
  }
  lines.push("; PAL frequency table (note 0 = C-0, note 95 = B-7)");
  chunk("sid_freq_lo", freqLo);
  chunk("sid_freq_hi", freqHi);

  return lines.join("\n");
}

function _sidCopyExport(kind) {
  navigator.clipboard.writeText(_sidExport(kind)).catch(function(){});
}

/* ── Init + wiring ── */
function _sidInit() {
  if (_sidInited) return;
  _sidInited = true;
  _sidInsts = [_sidNewInst()];
  _sidPatterns = [_sidNewPattern()];
  _sidBuildInstSel();
  _sidLoadInstUI();
  _sidBuildPatSel();
  _sidBuildTracker();
  _sidSetOctave(_sidOctave);
}
function _sidBuildPatSel() {
  const sel = document.getElementById("sid-pat-sel"); if (!sel) return;
  sel.innerHTML = "";
  _sidPatterns.forEach(function(p, i) {
    const o = document.createElement("option"); o.value = i; o.textContent = "Pat " + (i<10?"0":"") + i; sel.appendChild(o);
  });
  sel.value = _sidPat;
}

function setupSidEditor() {
  const dialog = document.getElementById("sid-editor-dialog");
  if (!dialog) return;
  const onId = function(id, ev, fn){ const el=document.getElementById(id); if(el) el.addEventListener(ev, fn); };

  onId("sid-editor-btn", "click", function() {
    const cm = document.querySelector(".control-menu"); if (cm) cm.removeAttribute("open");
    _sidInit(); dialog.showModal();
  });
  onId("sid-close", "click", function() { _sidStop(); dialog.close(); });

  // instrument param bindings
  const bindCheck = function(id, prop) { onId(id, "change", function(e){ _sidCurInst()[prop] = e.target.checked; _sidDrawADSR(); }); };
  const bindRange = function(id, prop, valId) { onId(id, "input", function(e){ _sidCurInst()[prop] = parseInt(e.target.value,10); if(valId){const v=document.getElementById(valId); if(v) v.textContent = e.target.value;} _sidDrawADSR(); }); };
  bindCheck("sid-tri","tri"); bindCheck("sid-saw","saw"); bindCheck("sid-pul","pul"); bindCheck("sid-noi","noi");
  bindRange("sid-pw","pw","sid-pw-val");
  bindRange("sid-a","a","sid-a-val"); bindRange("sid-d","d","sid-d-val"); bindRange("sid-s","s","sid-s-val"); bindRange("sid-r","r","sid-r-val");
  bindCheck("sid-lp","lp"); bindCheck("sid-bp","bp"); bindCheck("sid-hp","hp");
  bindRange("sid-cut","cut"); bindRange("sid-res","res"); bindRange("sid-vol","vol");
  onId("sid-inst-name", "input", function(e){ _sidCurInst().name = e.target.value; _sidBuildInstSel(); });
  onId("sid-inst-sel", "change", function(e){ _sidInst = parseInt(e.target.value,10); _sidLoadInstUI(); });
  onId("sid-inst-add", "click", function(){ _sidInsts.push(_sidNewInst(t("sidNewInstrumentName") + " " + (_sidInsts.length+1))); _sidInst = _sidInsts.length-1; _sidBuildInstSel(); _sidLoadInstUI(); });
  onId("sid-preview", "click", function(){ _sidEnsureAudio(); _sidPlayInst(_sidCurInst(), _sidNoteFreq(57), _sidAudio.currentTime+0.02, 0.5); });

  // ADSR graph: drag the A/D/S/R handles with the mouse
  const adsrC = document.getElementById("sid-adsr-canvas");
  if (adsrC) {
    adsrC.style.cursor = "pointer";
    let drag = null;
    const pos = function(e){ const r = adsrC.getBoundingClientRect(); return { x:(e.clientX-r.left)*(adsrC.width/r.width), y:(e.clientY-r.top)*(adsrC.height/r.height) }; };
    const cl = function(v){ return Math.max(0, Math.min(15, Math.round(v))); };
    const upd = function(p){
      const g = _sidAdsrGeom; if (!g || !drag) return;
      const inst = _sidCurInst();
      if (drag === "a") inst.a = cl((p.x - g.x0)/g.q * 15);
      else if (drag === "d") { inst.d = cl((p.x - (g.x0+g.q))/g.q * 15); inst.s = cl((g.y0 - p.y)/(g.y0-g.yTop) * 15); }
      else if (drag === "s") inst.s = cl((g.y0 - p.y)/(g.y0-g.yTop) * 15);
      else if (drag === "r") inst.r = cl((p.x - (g.x0+3*g.q))/g.q * 15);
      ["a","d","s","r"].forEach(function(k){ const sl=document.getElementById("sid-"+k); if(sl) sl.value=inst[k]; const vv=document.getElementById("sid-"+k+"-val"); if(vv) vv.textContent=inst[k]; });
      _sidDrawADSR();
    };
    adsrC.addEventListener("pointerdown", function(e){
      const p = pos(e), g = _sidAdsrGeom; if (!g) return;
      let best=null, bd=16;
      g.handles.forEach(function(h){ const d=Math.hypot(p.x-h.x, p.y-h.y); if(d<bd){bd=d;best=h.id;} });
      if (best) { drag=best; try{adsrC.setPointerCapture(e.pointerId);}catch(_){} upd(p); e.preventDefault(); }
    });
    adsrC.addEventListener("pointermove", function(e){ if (drag) upd(pos(e)); });
    const end = function(e){ drag=null; if(e&&e.pointerId!=null){try{adsrC.releasePointerCapture(e.pointerId);}catch(_){}} };
    adsrC.addEventListener("pointerup", end);
    adsrC.addEventListener("pointercancel", end);
  }

  // tracker
  onId("sid-pat-sel", "change", function(e){ _sidPat = parseInt(e.target.value,10); _sidBuildTracker(); });
  onId("sid-pat-add", "click", function(){ _sidPatterns.push(_sidNewPattern()); _sidPat = _sidPatterns.length-1; _sidBuildPatSel(); _sidBuildTracker(); });
  onId("sid-speed", "input", function(e){ _sidSpeed = Math.max(1, parseInt(e.target.value,10)||6); if(_sidTimer){ _sidPlay(); } });
  onId("sid-play", "click", _sidPlay);
  onId("sid-stop", "click", _sidStop);
  // Files: save/load .bin + export blocks / export asm
  onId("sid-export-asm", "click", function(){ _sidCopyExport("asm"); });
  onId("sid-export-data", "click", function(){
    if (exportAsmToBlocks(_sidExportDataOnly()) > 0) { _sidStop(); dialog.close(); }
  });
  onId("sid-export-player", "click", function(){
    if (exportAsmToBlocks(_sidExportAsmPlayable()) > 0) { _sidStop(); dialog.close(); }
  });
  onId("sid-save-bin", "click", function(){ _saveBinFile(_sidSerialize(), "sound.bin"); });
  const sidBinFile = document.getElementById("sid-bin-file");
  onId("sid-load-bin", "click", function(){ if (sidBinFile) sidBinFile.click(); });
  if (sidBinFile) sidBinFile.addEventListener("change", function(e){
    const file = e.target.files && e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = function(){ _sidDeserialize(new Uint8Array(reader.result)); };
    reader.readAsArrayBuffer(file); e.target.value = "";
  });

  // keyboard note entry / navigation
  const wrap = document.getElementById("sid-tracker-wrap");
  if (wrap) wrap.addEventListener("keydown", function(e) {
    const k = e.key.toLowerCase();
    if (e.ctrlKey && k === "c") { _sidCopyCells(); e.preventDefault(); return; }
    if (e.ctrlKey && k === "v") { _sidPasteCells(); e.preventDefault(); return; }
    if (e.key === "ArrowDown") {
      if (e.shiftKey) { if (_sidSelAnchor === null) _sidSelAnchor = _sidSel.row; } else { _sidSelAnchor = null; }
      _sidSel.row = (_sidSel.row+1)%_SID_ROWS; _sidRefreshSel(); e.preventDefault(); return;
    }
    if (e.key === "ArrowUp") {
      if (e.shiftKey) { if (_sidSelAnchor === null) _sidSelAnchor = _sidSel.row; } else { _sidSelAnchor = null; }
      _sidSel.row = (_sidSel.row-1+_SID_ROWS)%_SID_ROWS; _sidRefreshSel(); e.preventDefault(); return;
    }
    if (e.key === "ArrowLeft") { _sidSelAnchor = null; _sidSel.voice = (_sidSel.voice+2)%3; _sidRefreshSel(); e.preventDefault(); return; }
    if (e.key === "ArrowRight") { _sidSelAnchor = null; _sidSel.voice = (_sidSel.voice+1)%3; _sidRefreshSel(); e.preventDefault(); return; }
    if (e.key === "Delete" || e.key === "Backspace" || k === ".") {
      _sidSelAnchor = null;
      _sidCurPat()[_sidSel.voice][_sidSel.row] = { note:null, inst:0 };
      _sidSetCellText(_sidSel.voice, _sidSel.row);
      _sidSel.row = (_sidSel.row+1)%_SID_ROWS; _sidRefreshSel(); e.preventDefault(); return;
    }
    if (_SID_KEYMAP.hasOwnProperty(k)) {
      _sidSelAnchor = null;
      const note = _sidOctave*12 + _SID_KEYMAP[k];
      _sidCurPat()[_sidSel.voice][_sidSel.row] = { note: note, inst: _sidInst };
      _sidSetCellText(_sidSel.voice, _sidSel.row);
      _sidEnsureAudio(); _sidPlayInst(_sidCurInst(), _sidNoteFreq(note), _sidAudio.currentTime+0.01, 0.25);
      _sidSel.row = (_sidSel.row+1)%_SID_ROWS; _sidRefreshSel(); e.preventDefault(); return;
    }
    if (k === "+" || k === "*" || e.key === "PageUp")   { _sidSetOctave(_sidOctave+1); e.preventDefault(); }
    if (k === "-" || k === "/" || e.key === "PageDown") { _sidSetOctave(_sidOctave-1); e.preventDefault(); }
  });

  // Voice copy/paste
  onId("sid-voice-copy", "click", _sidCopyVoice);
  onId("sid-voice-paste", "click", _sidPasteVoice);

  // Octave controls
  onId("sid-oct-up", "click", function(){ _sidSetOctave(_sidOctave+1); });
  onId("sid-oct-down", "click", function(){ _sidSetOctave(_sidOctave-1); });
}
function _sidSetOctave(o) {
  _sidOctave = Math.max(0, Math.min(7, o));
  const el = document.getElementById("sid-oct-val");
  if (el) el.textContent = _sidOctave;
}
