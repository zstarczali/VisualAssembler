window.TUTORIAL_DATA = {
  categories: [
    { id: "featured",     labelHu: "Kiemelt",      labelEn: "Featured" },
    { id: "tour",         labelHu: "Bemutató",     labelEn: "Tour" },
    { id: "basics",       labelHu: "Kezdőknek",    labelEn: "Beginners" },
    { id: "fundamentals", labelHu: "Alapok",       labelEn: "Fundamentals" },
    { id: "advanced",     labelHu: "Haladó",       labelEn: "Advanced" }
  ],
  lessons: [
    {
      id: "guided-first-text",
      category: "basics",
      type: "lesson",
      interactive: true,
      difficulty: 0,
      titleHu: "Építsd meg: első szöveges program",
      titleEn: "Build: Your First Text Program",
      descHu: "Interaktívan, lépésről lépésre felépítünk egy programot. A mnemonikokat és az operandus értékeket is neked kell megadni, a TEXT blokkok szövegét pedig neked kell beírni.",
      descEn: "Interactively build a program step by step. You must choose the mnemonics and enter the operand values yourself, and you must also type the TEXT block contents yourself.",
      steps: [
        {
          target: null,
          onEnterActionId: "prepare-guided-color-text",
          titleHu: "Kezdjük az üres programmal!",
          titleEn: "Starting with an Empty Program!",
          descHu: "Üres programterülettel indulunk. A bal oldali palettán neked kell kiválasztani a megfelelő mnemonikot, és neked kell beírni az operandus mezőbe az értékeket is. A TEXT blokkok szövegét szintén te írod be.\n\nA program amit felépítünk:\n  SEI\n  LDA #$00\n  STA $D020\n  STA $D021\n  JSR $E544\n  .text 12, 8, \"hello c64\"\n  .text 8, 10, \"visual assembler\"\n  RTS\n\nKészen állsz? Kattints a Tovább gombra!",
          descEn: "We start with a blank canvas. On the left palette you must choose the correct mnemonic, and you must also type the operand values yourself. For TEXT blocks, you also type the text yourself.\n\nThe program we'll build:\n  SEI\n  LDA #$00\n  STA $D020\n  STA $D021\n  JSR $E544\n  .text 12, 8, \"hello c64\"\n  .text 8, 10, \"visual assembler\"\n  RTS\n\nReady? Click Next!"
        },
        {
          target: "#mnemonic-select",
          onEnterActionId: "prep-sei",
          advanceOnTargetChange: true,
          targetValue: "SEI",
          titleHu: "1/27 \u2014 Válaszd ki a SEI mnemonikot",
          titleEn: "1/27 \u2014 Select the SEI Mnemonic",
          descHu: "A kategória már jó helyen van. Válaszd ki a listából a SEI-t!",
          descEn: "The category is already correct. Choose SEI from the list!"
        },
        {
          target: "#add-selected",
          advanceOnTargetClick: true,
          titleHu: "2/27 \u2014 Add hozzá a SEI blokkot",
          titleEn: "2/27 \u2014 Add the SEI Block",
          descHu: "Most kattints az Add gombra!",
          descEn: "Now click Add!"
        },
        {
          target: "#mnemonic-select",
          onEnterActionId: "prep-lda-black",
          advanceOnTargetChange: true,
          targetValue: "LDA",
          titleHu: "3/27 \u2014 Válaszd ki az LDA mnemonikot",
          titleEn: "3/27 \u2014 Select the LDA Mnemonic",
          descHu: "Most neked kell összeállítani az LDA #$00 utasítást. Először válaszd ki az LDA mnemonikot!",
          descEn: "Now you must assemble the LDA #$00 instruction yourself. First choose the LDA mnemonic!"
        },
        {
          target: "#operand-input",
          advanceOnTargetInput: true,
          targetValue: "00",
          titleHu: "4/27 \u2014 Írd be: 00",
          titleEn: "4/27 \u2014 Type: 00",
          descHu: "Az immediate operandus értékét most te add meg. Itt a C64 színkódját írjuk be, amit majd a következő STA blokkok kiírnak a border és a háttér regiszterébe.\n\nA C64 színei:\n0 fekete\n1 fehér\n2 piros\n3 cián\n4 lila\n5 zöld\n6 kék\n7 sárga\n8 narancs\n9 barna\nA világos piros\nB sötétszürke\nC szürke\nD világoszöld\nE világoskék\nF világosszürke\n\nÍrd be az operandus mezőbe: 00",
          descEn: "Enter the immediate operand value yourself now. This is where we enter the C64 color code, which the next STA blocks will write into the border and background registers.\n\nC64 colors:\n0 black\n1 white\n2 red\n3 cyan\n4 purple\n5 green\n6 blue\n7 yellow\n8 orange\n9 brown\nA light red\nB dark gray\nC gray\nD light green\nE light blue\nF light gray\n\nType 00 into the operand field."
        },
        {
          target: "#add-selected",
          advanceOnTargetClick: true,
          titleHu: "5/27 \u2014 Add hozzá az LDA blokkot",
          titleEn: "5/27 \u2014 Add the LDA Block",
          descHu: "Kattints az Add gombra az LDA #$00 blokkhoz!",
          descEn: "Click Add for the LDA #$00 block!"
        },
        {
          target: "#mnemonic-select",
          onEnterActionId: "prep-sta-border",
          advanceOnTargetChange: true,
          targetValue: "STA",
          titleHu: "6/27 \u2014 Válaszd ki az STA mnemonikot a borderhez",
          titleEn: "6/27 \u2014 Select STA for the Border",
          descHu: "Most a border színcímére írunk. Először válaszd ki az STA mnemonikot!",
          descEn: "Now we write to the border color address. First select the STA mnemonic!"
        },
        {
          target: "#operand-input",
          advanceOnTargetInput: true,
          targetValue: "D020",
          titleHu: "7/27 \u2014 Írd be: D020",
          titleEn: "7/27 \u2014 Type: D020",
          descHu: "Most add meg a border címét. Írd be az operandus mezőbe: D020",
          descEn: "Now enter the border address. Type D020 into the operand field."
        },
        {
          target: "#add-selected",
          advanceOnTargetClick: true,
          titleHu: "8/27 \u2014 Add hozzá a border STA blokkot",
          titleEn: "8/27 \u2014 Add the Border STA Block",
          descHu: "Kattints az Add gombra!",
          descEn: "Click Add!"
        },
        {
          target: "#mnemonic-select",
          onEnterActionId: "prep-sta-background",
          advanceOnTargetChange: true,
          targetValue: "STA",
          titleHu: "9/27 \u2014 Válaszd ki az STA mnemonikot a háttérhez",
          titleEn: "9/27 \u2014 Select STA for the Background",
          descHu: "Most a háttérszín címére írunk. Válaszd ki ismét az STA mnemonikot!",
          descEn: "Now we write to the background color address. Select STA again!"
        },
        {
          target: "#operand-input",
          advanceOnTargetInput: true,
          targetValue: "D021",
          titleHu: "10/27 \u2014 Írd be: D021",
          titleEn: "10/27 \u2014 Type: D021",
          descHu: "Add meg a háttér címét. Írd be az operandus mezőbe: D021",
          descEn: "Enter the background address. Type D021 into the operand field."
        },
        {
          target: "#add-selected",
          advanceOnTargetClick: true,
          titleHu: "11/27 \u2014 Add hozzá a háttér STA blokkot",
          titleEn: "11/27 \u2014 Add the Background STA Block",
          descHu: "Kattints az Add gombra!",
          descEn: "Click Add!"
        },
        {
          target: "#mnemonic-select",
          onEnterActionId: "prep-jsr-clearscreen",
          advanceOnTargetChange: true,
          targetValue: "JSR",
          titleHu: "12/27 \u2014 Válaszd ki a JSR mnemonikot",
          titleEn: "12/27 \u2014 Select the JSR Mnemonic",
          descHu: "Most a képernyőt törlő KERNAL rutint hívjuk. Először válaszd ki a JSR-t!",
          descEn: "Now we call the KERNAL clear-screen routine. First select JSR!"
        },
        {
          target: "#operand-input",
          advanceOnTargetInput: true,
          targetValue: "E544",
          titleHu: "13/27 \u2014 Írd be: E544",
          titleEn: "13/27 \u2014 Type: E544",
          descHu: "Add meg a clear-screen rutin címét. Írd be az operandus mezőbe: E544",
          descEn: "Enter the clear-screen routine address. Type E544 into the operand field."
        },
        {
          target: "#add-selected",
          advanceOnTargetClick: true,
          titleHu: "14/27 \u2014 Add hozzá a JSR blokkot",
          titleEn: "14/27 \u2014 Add the JSR Block",
          descHu: "Kattints az Add gombra!",
          descEn: "Click Add!"
        },
        {
          target: "#mnemonic-select",
          onEnterActionId: "prep-text-hello-c64",
          advanceOnTargetChange: true,
          targetValue: "TEXT",
          titleHu: "15/27 \u2014 Válaszd ki a TEXT makrót",
          titleEn: "15/27 \u2014 Select the TEXT Macro",
          descHu: "Most jön az első TEXT blokk. Válaszd ki a TEXT makrót a listából!",
          descEn: "Now comes the first TEXT block. Select the TEXT macro from the list!"
        },
        {
          target: "#operand-input",
          advanceOnTargetInput: true,
          targetValue: "hello c64",
          titleHu: "16/27 \u2014 Írd be: hello c64",
          titleEn: "16/27 \u2014 Type: hello c64",
          descHu: "Most neked kell beírni a szöveget az operandus mezőbe: hello c64",
          descEn: "Now you must type the text into the operand field: hello c64"
        },
        {
          target: "#add-selected",
          advanceOnTargetClick: true,
          titleHu: "17/27 \u2014 Add hozzá az első TEXT blokkot",
          titleEn: "17/27 \u2014 Add the First TEXT Block",
          descHu: "Kattints az Add gombra, majd a program panelen állítsd a koordinátákat X=12, Y=8 értékre.",
          descEn: "Click Add, then set the coordinates in the program panel to X=12, Y=8."
        },
        {
          target: "#mnemonic-select",
          onEnterActionId: "prep-text-visual-assembler",
          advanceOnTargetChange: true,
          targetValue: "TEXT",
          titleHu: "18/27 \u2014 Válaszd ki újra a TEXT makrót",
          titleEn: "18/27 \u2014 Select TEXT Again",
          descHu: "Most a második TEXT blokk következik. Válaszd ki ismét a TEXT makrót!",
          descEn: "Now the second TEXT block follows. Select TEXT again!"
        },
        {
          target: "#operand-input",
          advanceOnTargetInput: true,
          targetValue: "visual assembler",
          titleHu: "19/27 \u2014 Írd be: visual assembler",
          titleEn: "19/27 \u2014 Type: visual assembler",
          descHu: "Írd be az operandus mezőbe: visual assembler",
          descEn: "Type into the operand field: visual assembler"
        },
        {
          target: "#add-selected",
          advanceOnTargetClick: true,
          titleHu: "20/27 \u2014 Add hozzá a második TEXT blokkot",
          titleEn: "20/27 \u2014 Add the Second TEXT Block",
          descHu: "Kattints az Add gombra, majd a koordinátákat állítsd X=8, Y=10-re.",
          descEn: "Click Add, then set the coordinates to X=8, Y=10."
        },
        {
          target: "#mnemonic-select",
          onEnterActionId: "prep-rts-block",
          advanceOnTargetChange: true,
          targetValue: "RTS",
          titleHu: "21/27 \u2014 Válaszd ki az RTS mnemonikot",
          titleEn: "21/27 \u2014 Select the RTS Mnemonic",
          descHu: "Utolsó utasításként válaszd ki az RTS-t!",
          descEn: "As the final instruction, select RTS!"
        },
        {
          target: "#add-selected",
          advanceOnTargetClick: true,
          titleHu: "22/27 \u2014 Add hozzá az RTS blokkot",
          titleEn: "22/27 \u2014 Add the RTS Block",
          descHu: "Kattints az Add gombra!",
          descEn: "Click Add!"
        },
        {
          target: "[data-index=\"6\"] .collapse-toggle",
          advanceOnTargetClick: true,
          titleHu: "23/27 \u2014 Nyisd ki az első TEXT blokkot",
          titleEn: "23/27 \u2014 Expand the First TEXT Block",
          descHu: "Ez az első TEXT blokk (\"hello c64\"). Kattints a ▸ gombra a kinyitáshoz, majd beállíthatod a koordinátákat!",
          descEn: "This is the first TEXT block (\"hello c64\"). Click the ▸ button to expand it, then you can set the coordinates!"
        },
        {
          target: "[data-index=\"6\"] .macro-grid",
          titleHu: "24/27 \u2014 Állítsd be a koordinátákat (X=12, Y=8)",
          titleEn: "24/27 \u2014 Set the Coordinates (X=12, Y=8)",
          descHu: "Az X és Y mezőkbe írd be: X=12, Y=8.\nA szöveg a képernyő 12. oszlopától és 8. sorától kezdődik (0-tól számozva). Ha kész, kattints a Next gombra!",
          descEn: "Enter X=12 and Y=8 in the coordinate fields.\nThis positions the text starting at column 12, row 8 of the screen (0-indexed). When done, click Next!"
        },
        {
          target: "[data-index=\"7\"] .collapse-toggle",
          advanceOnTargetClick: true,
          titleHu: "25/27 \u2014 Nyisd ki a második TEXT blokkot",
          titleEn: "25/27 \u2014 Expand the Second TEXT Block",
          descHu: "Ez a második TEXT blokk (\"visual assembler\"). Kattints a ▸ gombra a kinyitáshoz, majd beállíthatod a koordinátákat!",
          descEn: "This is the second TEXT block (\"visual assembler\"). Click the ▸ button to expand it, then you can set the coordinates!"
        },
        {
          target: "[data-index=\"7\"] .macro-grid",
          titleHu: "26/27 \u2014 Állítsd be a koordinátákat (X=8, Y=10)",
          titleEn: "26/27 \u2014 Set the Coordinates (X=8, Y=10)",
          descHu: "Az X és Y mezőkbe írd be: X=8, Y=10.\nA szöveg a képernyő 8. oszlopától és 10. sorától helyezkedik el. Ha kész, kattints a Next gombra!",
          descEn: "Enter X=8 and Y=10 in the coordinate fields.\nThis places the text starting at column 8, row 10 of the screen. When done, click Next!"
        },
        {
          target: "#run-emulator",
          titleHu: "27/27 \u2014 Kész! Futtasd le!",
          titleEn: "27/27 \u2014 Done! Run It!",
          descHu: "Megépítetted az első C64 programodat! Kattints a Run gombra! A VICE emulátorban fekete képernyőt és két sort látsz majd: \"hello c64\" és \"visual assembler\".",
          descEn: "You built your first C64 program! Click Run! In the VICE emulator you should see a black screen with two lines: \"hello c64\" and \"visual assembler\"."
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
          target: "#sample-programs-group",
          openMenu: true,
          titleHu: "Mintaprogramok",
          titleEn: "Sample Programs",
          descHu: "A Menü → Példák részben 30+ kész mintaprogram vár!\n\nTölts be egyet — és nézd meg hogyan épül fel. Remek kiindulópont a tanuláshoz.",
          descEn: "Menu → Examples has 30+ ready-made sample programs!\n\nLoad one and explore how it's structured. Great starting point for learning."
        },
        {
          target: "#run-emulator",
          titleHu: "Futtatás gomb",
          titleEn: "Run Button",
          descHu: "A Run gombbal közvetlenül futtathatod a programodat a VICE C64 emulátorban.\n\nA gomb melletti nyíllal váltasz futtatási mód között:\n• PRG — közvetlenül a VICE-ba\n• D64 — virtuális lemezképen keresztül\n• Hardware — C64 Ultimate csatlakozón át\n\nA bemutató végéhez értél! Javasolt következő lépés: \"Az első programod\" lecke.",
          descEn: "Click Run to execute your program directly in the VICE C64 emulator.\n\nUse the arrow next to the button to switch run modes:\n• PRG — directly to VICE\n• D64 — via virtual disk image\n• Hardware — via C64 Ultimate connection\n\nYou've reached the end of the tour! Suggested next step: \"Your First Program\" lesson."
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
