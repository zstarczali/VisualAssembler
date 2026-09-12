# C64 Visual Assembler – Benutzerhandbuch

**Version 2.3.9**

Ein visueller, blockbasierter 6502-Assembler für den Commodore 64. Erstellen Sie Programme durch Ziehen und Ablegen von Befehlsblöcken und sehen Sie den generierten Assembler- und Maschinencode in Echtzeit.

---

## Inhaltsverzeichnis

- [C64 Visual Assembler — Benutzerhandbuch](#c64-visual-assembler--user-manual)
    - [Version 2.3.9 Highlights](#version-239-highlights)
    - [Version 2.3.8 Highlights](#version-238-highlights)
  - [Inhaltsverzeichnis](#table-of-contents)
  - [1. Schnittstellenübersicht](#1-interface-overview)
  - [2. Blockpalette](#2-block-palette)
  - [3. Programmbereich](#3-program-area)
    - [Operand input](#operand-input)
  - [4. ASM-Ansicht](#4-asm-view)
    - [Ausgabemodi](#output-modes)
    - [Toolkit-Registerkarte](#toolkit-tab)
    - [Registerkarte „Optionen“](#options-tab)
    - [Klicken auf eine ASM-Zeile](#clicking-an-asm-line)
    - [ASM-Zeilennummern](#asm-line-numbers)
    - [Kompilierungsfortschrittsanzeige](#compile-progress-modal)
  - [5. Einstellungen & Symbolleiste](#5-settings--toolbar)
    - [Lade .asm-Datei (Kurzanleitung)](#load-asm-file-quick-reference)
      - [Hinweise und Best Practices zum Importieren von Daten](#import-parsing-notes-and-best-practices)
  - [Ultimativer Basismodus](#ultimatebasic-mode)
    - [Öffnen des UB-Editors](#opening-the-ub-editor)
    - [Editor-Werkzeuge](#editor-tools)
    - [Projekte, Registerkarten und Startdateien](#projects-tabs-and-startup-files)
    - [Gebäude und Diagnostik](#building-and-diagnostics)
    - [Running, D64 und Exomizer](#running-d64-and-exomizer)
    - [Debugger-Symbole und Disassemblierung](#debugger-symbols-and-disassembly)
    - [Ultimate Basic-Handbuch und Quellcode](#ultimate-basic-manual-and-source)
  - [6. Expertenmodus](#6-expert-mode)
    - [Schaltmodi](#switching-modes)
    - [Editor layout](#editor-layout)
    - [Symbolleistenschaltflächen](#toolbar-buttons)
    - [Fehlerhervorhebung](#error-highlighting)
    - [Syntaxhervorhebung](#syntax-highlight)
    - [Quellformatierer](#source-formatter)
    - [Projektbereich & Registerkarten](#project-panel--tabs)
    - [Tab-Leiste](#tab-bar)
  - [7. Adressierungsmodi](#7-addressing-modes)
    - [Bezeichnungsausdrücke als Operanden](#label-expressions-as-operands)
    - [Der `*`-Programmzähler in Ausdrücken](#the--program-counter-in-expressions)
    - [Lokale (gepunktete) Bezeichnungen](#local-dotted-labels)
    - [Selbstmodifizierende Code-Operandenbezeichnungen](#self-modifying-code-operand-labels)
  - [8. Standard 6502 Anweisungen](#8-standard-6502-instructions)
    - [Datenbewegung](#data-movement)
    - [Arithmetik](#arithmetic)
    - [Logik](#logic)
    - [Sprünge & Verzweigungen](#jumps--branches)
    - [LBNE / LBEQ / … (Lange Zweige)](#lbne--lbeq---long-branches)
    - [Registeroperationen](#register-operations)
    - [Shift \&amp; Rotate](#shift--rotate)
    - [Stack](#stack)
    - [System / Flags](#system--flags)
    - [Illegale / Nicht dokumentierte Anweisungen](#illegal--undocumented-instructions)
  - [9. Makroblöcke — Referenz](#9-macro-blocks--reference)
    - [LABEL](#label)
    - [COMMENT](#comment)
    - [BYTE](#byte)
    - [WORD](#word)
    - [FILL](#fill)
    - [ALIGN](#align)
    - [TEXT](#text)
    - [STRING](#string)
    - [DATA](#data)
    - [RAWBYTES](#rawbytes)
    - [RAWTEXT](#rawtext)
    - [PETSCII](#petscii)
    - [CHARSET](#charset)
    - [CHARDEF](#chardef)
    - [BOX_HIT](#box_hit)
    - [INCBIN](#incbin)
    - [SID](#sid)
    - [INCLUDE](#include)
    - [TABLE](#table)
    - [ORG](#org)
    - [LOOP / NEXT](#loop--next)
      - [LOOP](#loop)
      - [NEXT](#next)
    - [FOR / ENDF](#for--endf)
      - [FOR](#for)
      - [ENDF](#endf)
    - [PUSH / PULL](#push--pull)
      - [PUSH](#push)
      - [PULL](#pull)
    - [END / RTS alias](#end--rts-alias)
    - [MACRO / ENDM / INVOKE](#macro--endm--invoke)
      - [MACRO (definition start)](#macro-definition-start)
      - [ENDM (definition end)](#endm-definition-end)
      - [INVOKE](#invoke)
    - [REGION / ENDREGION](#region--endregion)
    - [DEFINE / IF / ELSE / ENDIF](#define--if--else--endif)
    - [.ASSERT](#assert)
      - [DEFINE](#define)
      - [IF](#if)
      - [ELSE](#else)
    - [ENDIF](#endif)
    - [CONST](#const)
    - [VAR](#var)
    - [Runtime IF / ELSE / ENDIF](#runtime-if--else--endif)
    - [WHILE / ENDW](#while--endw)
    - [REPEAT / UNTIL](#repeat--until)
    - [MEMCPY / MEMSET](#memcpy--memset)
    - [PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY / SET_BORDER / SET_BG](#print--print_char--print_hex--clear_screen--wait_key--delay--set_border--set_bg)
    - [IRQ_SETUP](#irq_setup)
    - [RAND](#rand)
    - [SPRITE\_INIT](#sprite_init)
    - [SPRITE\_POS](#sprite_pos)
    - [WAIT\_RASTER](#wait_raster)
    - [JOYSTICK](#joystick)
    - [MOUSE](#mouse)
    - [SPRITE\_COL](#sprite_col)
    - [LOADFILE](#loadfile)
    - [EXODECRUNCH](#exodecrunch)
    - [REU\_CHECK](#reu_check)
    - [REU\_STASH / REU\_FETCH / REU\_SWAP](#reu_stash--reu_fetch--reu_swap)
    - [TURBO\_SET](#turbo_set)
    - [SUPERCPU\_DETECT](#supercpu_detect)
    - [TURBO\_ENABLE](#turbo_enable)
    - [MAP\_COPY](#map_copy)
    - [MAP\_COPY16X16](#map_copy16x16)
    - [SPRITE\_ANIM](#sprite_anim)
    - [SCORE\_BCD](#score_bcd)
  - [10. Debugger-Integration](#10-debugger-integration)
    - [RetroDebugger](#retrodebugger)
    - [Breakpoint Blocks](#breakpoint-blocks)
    - [Debugger-Flags (Options-Registerkarte)](#debugger-flags-options-tab)
  - [11. Links zur Wissensdatenbank](#11-knowledge-base-links)
  - [12. D64 Export & Run](#12-d64-export--run)
    - [Split Run-Schaltfläche](#split-run-button)
    - [Export nach D64-Dialog](#export-to-d64-dialog)
    - [D64-Metadaten in Projekten](#d64-metadata-in-projects)
  - [12b. CRT-Export (Magic Desk 64K-Cartridge)](#12b-crt-export-magic-desk-64k-cartridge)
  - [13. Hardware-Einstellungen](#13-hardware-settings)
    - [VICE Emulator](#vice-emulator)
    - [Exomizer](#exomizer)
    - [Retro Debugger](#retro-debugger)
    - [C64 Ultimate / 1541 Ultimate](#c64-ultimate--1541-ultimate)
  - [14. Visuelle Editoren (Toolkit)](#14-visual-editors-toolkit)
    - [Hi-Res / Multicolor Editor](#hi-res--multicolor-editor)
    - [Sprite-Editor](#sprite-editor)
    - [C64 Character ROM Browser ("Char map")](#c64-character-rom-browser-char-map)
    - [Zeicheneditor (Zeichensatz)](#character-editor-charset)
    - [Charset Canvas Editor](#charset-canvas-editor)
    - [Karteneditor (Mehrschichtige Kachelkarten)](#map-editor-multilayer-tilemaps)
    - [SID Editor (3-Voice Tracker)](#sid-editor-3-voice-tracker)
    - [Kurveneditor](#curve-editor)

---

## Highlights der Version 2.3.9

Fünf Assembler-Funktionen zur Verbesserung der Benutzerfreundlichkeit, die alle im Expertenmodus als Text und (wo sinnvoll) als Blöcke verwendet werden können. Jede Funktion hat weiter unten einen eigenen Referenzabschnitt:

- **`*` in beliebigen Ausdrücken** – das Programmzählersymbol funktioniert nun innerhalb von Operandenausdrücken, nicht nur allein: `BNE *-5`, `JMP *+20`, `LDA #&lt;*`, `LDA #&gt;(*+63)`. Ein `*`, das auf einen Wert folgt (`STRIDE*2`), entspricht weiterhin einer Multiplikation. Siehe [Adressierungsmodi → Der `*`-Programmzähler in Ausdrücken](#the--program-counter-in-expressions).
- **Lokale (gepunktete) Labels** – Ein Label wie `.loop` gehört zum Gültigkeitsbereich des nächstgelegenen vorhergehenden *globalen* (nicht gepunkteten) Labels, sodass `DrawSprite` und `ClearScreen` jeweils ihr eigenes `.loop` definieren können, ohne dass es zu einem Konflikt kommt. Siehe [Lokale (gepunktete) Labels](#local-dotted-labels).
- **Lange Verzweigungs-Pseudo-Operationen** – `LBNE`, `LBEQ`, `LBCC`, `LBCS`, `LBMI`, `LBPL`, `LBVC`, `LBVS` werden zu einer invertierten Verzweigung über einem `JMP` (immer 5 Bytes) assembliert, sodass das Ziel beliebig weit entfernt sein kann. Neue Palettenkategorie **Lange Verzweigungen**. Siehe [LBNE / LBEQ / … (Lange Verzweigungen)](#lbne--lbeq---long-branches).
- Die Direktive **`.assert`** — `.assert end - start &lt;= 256` oder `.assert * &lt; $A000, "message"` wird zur Assemblierungszeit ausgewertet und führt zu einem Build-Fehler (mit Anzeige des tatsächlichen Werts), wenn der Ausdruck falsch ist. Siehe [.ASSERT](#assert).
- **Selbstmodifizierende Code-Operandenbezeichnungen** — `LDA Wert:#$00` definiert die Bezeichnung `Wert`, die auf das Operandenbyte der Anweisung zeigt, sodass `STA Wert` diese direkt überschreibt. Siehe [Selbstmodifizierende Code-Operandenbezeichnungen](#self-modifying-code-operand-labels).
- **Freundlichere Fehler bei Verzweigungen außerhalb des Bereichs** — eine Verzweigung, die außerhalb von −128…+127 landet, meldet nun genau, wie weit sie den Bereich überschreitet, und schlägt die passende lange Verzweigung `LBxx` vor.

---

## Highlights der Version 2.3.8

- Arbeitsbereich speichern/öffnen: Speichert die exakte Menge der geöffneten, dateibasierten Tabs – einschließlich des aktiven Tabs und des Bearbeitungsmodus jedes Tabs – in einer Arbeitsbereichsdatei im Format `.vaws`. Arbeitsbereiche werden bei Änderungen automatisch gespeichert, und die App stellt beim Start automatisch Ihren zuletzt verwendeten Arbeitsbereich wieder her.
- **Globaler Speicherpanel-Umschalter:** Das vollständige C64-Speicherpanel kann über einen dedizierten UI-Schalter ein- oder ausgeblendet werden.
- **Lokalisierte Ultimate Basic-Befehlsreferenz:** Die Befehlsbeschreibungen im Autocomplete-Popup und im Befehlsfeld folgen nun der aktuellen UI-Sprache (Ungarisch, Englisch, Spanisch, Deutsch, Niederländisch), wobei Englisch als Fallback dient.
- **Aktualisierte Grafikdokumentation für Ultimate Basic:** `FARBSTIFT` und der Hilfetext für die Befehle zum Zeichnen von Plots, Linien, Rechtecken, Kreisen und Mehrfarbenzeichnungen entsprechen nun dem aktuellen Verhalten des Compilers.
- **Fixed KERNAL reference:** corrected the `SETLFS` and `PLOT` entries (addresses and calling conventions) in the disassembler's KERNAL address table.
- **Behobene Speichernutzung bei vielen geöffneten Tabs:** Der Verlauf von Rückgängigmachen/Wiederherstellen pro Tab ist jetzt begrenzt (mit einer kleinen Entprellung), wodurch das unbegrenzte Speicherwachstum verhindert wird, das eine lange Sitzung mit vielen geöffneten Dokumenten früher verursachte.
- **Bereinigung der Editor-Symbolleiste:** Die überflüssigen Haltepunkt-Umschaltknöpfe wurden aus den Symbolleisten Expert und Ultimate Basic entfernt (Haltepunkte werden weiterhin über die Zeilennummernleiste gesetzt), und die Höhe der Expert-Symbolleiste wurde an die Höhe der Ultimate Basic-Symbolleiste angepasst.

---

## 1. Schnittstellenübersicht

Die App ist in drei Hauptbereiche unterteilt:

| Panel                 | Beschreibung                                                                              |
| --------------------- | ----------------------------------------------------------------------------------------- |
| **Links — Palette**   | Alle verfügbaren Befehls- und Makroblöcke. Suchen oder nach Kategorie durchsuchen.        |
| **Center — Programm** | Ihr Programm. Ziehen Sie Blöcke hierher, ordnen Sie sie neu an, bearbeiten Sie Operanden. |
| **Rechts — Ausgang**  | Live-ASM-Ansicht und/oder Speichermonitorausgabe.                                         |

Die Modusanzeige ganz rechts in der Kopfzeile kennzeichnet den aktiven Editor **Block**, **Expert** oder **Ultimative Basic**. Sie wird sofort aktualisiert, sobald sich der Bearbeitungsmodus ändert.

---

## 2. Blockpalette

Die Palette auf der linken Seite listet alle verfügbaren Blöcke nach Kategorien gruppiert auf:

- **Datenbewegung** — LDA, LDX, STA, STX, …
- **Arithmetik** — ADC, SBC, INC, DEC, CMP, …
- **Logik** — UND, ORA, EOR, BIT
- **Sprünge und Verzweigungen** – JMP, JSR, RTS, BNE, BEQ, …
- **Lange Zweige** — LBNE, LBEQ, LBCC, LBCS, LBMI, LBPL, LBVC, LBVS (Zweig bis zu beliebiger Entfernung; siehe §8)
- **Registeroperationen** — TAX, TAY, INX, DEX, …
- **Shift & Rotating** — ASL, LSR, ROL, ROR
- **Stack** — PHA, PHP, PLA, PLP
- **System** — CLC, SEC, NOP, BRK, …
- **Ungültige Befehle** — LAX, SAX, DCP, …
- **Structure** — LABEL, COMMENT, REGION, ENDREGION
- **Makros** — LOOP, NEXT, FOR, ENDF, PUSH, PULL, END, TEXT, BYTE, WORD, FILL, ALIGN, ASSERT, STRING, DATA, RAWBYTES, RAWTEXT, PETSCII, CHARSET, INCBIN, SID, INCLUDE, TABLE, ORG, MACRO, ENDM, INVOKE, IF, ELSE, ENDIF, VAR, WHILE, ENDW, REPEAT, UNTIL, MEMCPY, MEMSET, PRINT, PRINT_CHAR, PRINT_HEX, CLEAR_SCREEN, WAIT_KEY, DELAY, SET_BORDER, SET_BG, IRQ_SETUP, RAND, SPRITE_INIT, SPRITE_POS, WAIT_RASTER, JOYSTICK, MOUSE, SPRITE_COL, LOADFILE, REU_CHECK, REU_STASH, REU_FETCH, REU_SWAP, TURBO_SET, SUPERCPU_DETECT, TURBO_ENABLE, MAP_COPY, MAP_COPY16X16, SPRITE_ANIM, SCORE_BCD

Verwenden Sie das Suchfeld ** oben in der Palette, um nach Namen zu filtern. Klicken Sie auf die Schaltfläche **Ausgewählten Block hinzufügen** oder ziehen Sie einen Block in den Programmbereich.

---

## 3. Programmbereich

- **Ziehen Sie **Blöcke aus der Palette per Drag & Drop, oder **ordnen Sie ** vorhandene Blöcke neu an, indem Sie an ihrem Griff (≡) ziehen.
- Jeder Block zeigt seine **Mnemonik**, sein **Operandenfeld** und seinen **Adressierungsmodus-Selektor** (sofern zutreffend).
- Klicken Sie auf den Schalter **▸ / ▾**, um einen Block ein- oder auszublenden.
- Verwenden Sie die Schaltfläche **× (Löschen)** auf einem Block, um ihn zu entfernen.
- Mit der Schaltfläche **Alle ausblenden** werden alle Blöcke gleichzeitig eingeklappt.

### Blockpanel-Minimap

Das Programm-Panel verfügt in seiner Überschrift über eine umschaltbare Schaltfläche **minimap**. Wenn diese aktiviert ist, erscheint am rechten Rand des Panels ein schmaler `56 px`Leinwandstreifen, der alle Blöcke als farbcodierte horizontale Balken anzeigt:

| Balkenfarbe | Blocktyp                            |
| ----------- | ----------------------------------- |
| Cyan        | Etiketten                           |
| Blau/Lila   | Makros und Direktiven               |
| Gelb        | Anweisungen                         |
| Grün        | Kommentare und Leerzeilen           |
| Rot         | Blöcke mit einem Validierungsfehler |

Zusammengeklappte Blöcke werden mit reduzierter Deckkraft dargestellt. Klicken oder ziehen Sie an einer beliebigen Stelle auf der Minikarte, um die Programmliste an diese Position zu scrollen. Die Ansichtsanzeige (farbiges Rechteck) zeigt den sichtbaren Teil der Liste an. Der Status wird in den UI-Einstellungen gespeichert (Taste `blockMinimap`).

### Operandeneingabe

- Bei Verzweigungs-/Sprunganweisungen (`BNE`, `JMP`, `JSR`, etc.) erscheint ein **Label-Picker**-Dropdown – klicken Sie auf ein definiertes Label, um es einzufügen.
- Das Zahlenformat richtet sich nach dem Umschalter **HEX / DEC** in der Symbolleiste (siehe Abschnitt 5).

---

## 4. ASM-Ansicht

Im rechten Bereich wird die generierte Ausgabe in Echtzeit angezeigt.

### Ausgabemodi

| Modus            | Beschreibung                                                                                                                                                                                                                                                                                                                     |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ASM**          | 6502-Assemblerquellcode mit Adressen und Labels                                                                                                                                                                                                                                                                                  |
| **Monitor**      | Hex-/Byte-Dump (C64-Monitor-Stil)                                                                                                                                                                                                                                                                                                |
| **Disasm**       | Reine 6502-Disassemblierung: Adresse · Hex-Bytes · Mnemonics mit aufgelösten numerischen Operanden. Makros werden zu einzelnen Befehlen expandiert (TEXT → LDA/STA-Paare, LOOP → LDX usw.). BYTE/WORD/FILL-Daten werden als segmentierter Hex-Dump angezeigt. Die Ausgabe enthält keine Makronamen, Kommentare oder Anmerkungen. |
| **Beide**        | ASM oben, Monitor unten                                                                                                                                                                                                                                                                                                          |
| **Disassembler** | Wie bei Disasm – eigener Tab für die Demontageansicht                                                                                                                                                                                                                                                                            |
| **Toolkit**      | C64-Referenzpanel: 16-Farben-Farbpalette + PETSCII-Steuercodes und Übersicht der druckbaren Zeichen. Schreibgeschützt – Details finden Sie im Unterabschnitt „Toolkit“ weiter unten.                                                                                                                                             |
| **Optionen**     | Programmeinstellungen – Zahlenformat, Makroquellen-Umschaltung, Debugger-Parameter                                                                                                                                                                                                                                               |

### Registerkarte „Werkzeugkasten“

Die Registerkarte **Toolkit** in der ASM-Ansicht ist ein schreibgeschütztes Schnellreferenzfeld – sie verändert Ihr Programm niemals. Zwei Abschnitte:

| Abschnitt                 | Inhalt                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **C64-Farbpalette**       | Ein Raster mit 16 Farbfeldern zeigt alle C64-Farben mit ihrem Index (0–15 / `$00`–`$0F`) und Namen. Klicken Sie auf ein Farbfeld, um dessen Hex-Index in die Zwischenablage zu kopieren. Bewegen Sie den Mauszeiger darüber, um den Farbnamen (Hellblau, Braun usw.) anzuzeigen.                                                                                                                                             |
| **PETSCII control codes** | Allgemeine Steuercodes für `CHROUT` ($FFD2): Farbwechselcodes (`$05` Weiß, `$1C` Rot, `$1E` Grün, `$1F` Blau, …), Cursorbewegung (`$11`/`$1D`/`$91`/`$9D`), Umkehrung ein/aus (`$12`/`$92`), `$93` Bildschirm löschen, `$8E`/`$0E` Zeichensatzumschalter. Außerdem eine Übersicht der druckbaren Bereiche (32–64 Satzzeichen, 65–90 A–Z, 91–95 Klammern, 96–127 Grafiken, 160–191 verschobene Grafiken, 192–223 Spiegelung). |

Das Toolkit ist der schnellste Weg, einen Farbindex oder ein PETSCII-Steuerbyte nachzuschlagen, ohne den Editor zu verlassen.

### Registerkarte „Optionen“

Die Registerkarte **Optionen** enthält die Einstellungen, die die Codegenerierung und die Ausgabedarstellung beeinflussen:

- **Makro-Quellcode** — Wenn diese Option aktiviert ist, wird der Quellcode von Makrodefinitionsblöcken (MACRO…ENDM) inline in der ASM-Ansicht angezeigt.
- **Programmstartadresse** – wird nun über einen **ORG-Block** im Programmbereich anstatt über ein separates Eingabefeld festgelegt. Der erste ORG-Block definiert die Ladeadresse des Programms; nachfolgende ORG-Blöcke starten weitere Abschnitte an unterschiedlichen Adressen.
- **Debugger-Parameter** — drei Inline-Schalter, die steuern, welche Flags beim Start an den externen Debugger übergeben werden:
  - **`-jmp` ON/OFF** — springt nach dem Laden direkt zur Startadresse des Programms.
  - **`-unpause` ON/OFF** — Debugger beim Laden sofort wieder aktivieren.
  - **`-wait` ms EIN/AUS** — fügt eine `-wait <ms>` Verzögerung vor dem Fortsetzen hinzu; wählen Sie 500 ms oder 1000 ms aus dem Dropdown-Menü.
- **Kompilierungsinfo** — zeigt eine Zusammenfassung des kompilierten Programms (Code-Startadresse, Größe, BASIC SYS Stub-Status).

### Klicken auf eine ASM-Zeile

Klicken Sie auf eine beliebige Zeile in der ASM-Ansicht, um **den entsprechenden Block** im Programmbereich hervorzuheben.

### ASM-Zeilennummern

Im ASM-Panel werden **Zeilennummern** (`001 |`, `002 |`, …) angezeigt, um die Fehlersuche zu erleichtern, wenn ein Kompilierungsfehler auf eine bestimmte Zeile hinweist.

- Die visuellen Liniennummern dienen nur zu Diagnosezwecken.
- **Copy ASM** kopiert weiterhin den sauberen Quelltext **ohne** Zeilennummernpräfixe.

### Fortschrittsanzeige für Kompilierung

Bei komplexeren Aktionen erscheint ein zentriertes Fortschrittsfenster mit einem Fortschrittsbalken:

- **Run in VICE** — Kompilieren/Erstellen von PRG und Starten des Emulators.
- **Debug** — PRG wird kompiliert/erstellt und der Debugger gestartet.
- **Lade .asm-Datei** — Öffne eine `.asm`-Datei im Expertenmodus und materialisiere Blöcke aus dem Quellcode.

Das Modal schließt sich automatisch, wenn die Aktion abgeschlossen ist oder fehlschlägt.

---

## 5. Einstellungen & Symbolleiste

| Kontrolle                              | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Zahlenbasis (HEX / DEC / BIN)**      | Legt das Anzeige-/Eingabeformat für Operanden in der gesamten Benutzeroberfläche fest. Im BIN-Modus werden Werte binär mit dem Präfix `%` angezeigt (z. B. `%11111000`). Die ASM-Ansicht zeigt jeden Block immer in seinem eigenen Format an.                                                                                                                                                                                                                                                                                 |
| **Sprache**                            | Wechseln Sie die Benutzeroberfläche zwischen Englisch, Ungarisch, Spanisch, Deutsch und Niederländisch (Nederlands).                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Theme**                              | Hell / Dunkel / OLED / Commodore 77 – Wählen Sie im Menü „Einstellungen“ das gewünschte Design aus. OLED verwendet einen rein schwarzen Hintergrund für AMOLED-Displays. Commodore 77 ist ein neongelbes Design auf schwarzem Hintergrund. Ist dieses Design aktiv, verwendet der Startbildschirm die Farbe des Designs (passend zur Meldungskarte), zeigt ein kleineres Commodore-77-Logo und einen gelben Fortschrittsbalken. Das gewählte Design wird beim nächsten Start vor dem ersten Laden des Bildschirms angewendet. |
| **CRT-Retromodus**                     | Aktiviert/Deaktiviert einen Vollbild-CRT-Filter: Scanlines, Phosphorvignettierung, Flimmern und tonnenförmige Verzeichnung. Der Status wird zwischen den Sitzungen gespeichert.                                                                                                                                                                                                                                                                                                                                               |
| **Speicherpanel anzeigen**             | Globaler Schalter zum Ein- oder Ausblenden des gesamten C64-Speicherpanels                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **BASIC SYS stub**                     | Fügt dem Ursprung Ihres Programms eine BASIC-Zeile voran, die SYS aufruft.                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Sample**                             | Laden Sie ein integriertes Beispielprogramm                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Vergrößern / Verkleinern**           | Skaliert die Block-UI (betrifft alle Blockelemente)                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Projekt speichern**                  | Speichern Sie das aktuelle Programm als `.json`-Projektdatei                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Programm speichern unter**           | Speichern Sie das aktuelle Programm jedes Mal als `.json`-Projektdatei über einen neuen Dateidialog.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Projekt laden**                      | Ein zuvor gespeichertes Projekt laden                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Arbeitsbereich speichern**           | Speichern Sie die exakte Menge der aktuell geöffneten, dateibasierten Registerkarten – einschließlich der aktiven Registerkarte und des jeweiligen Bearbeitungsmodus (Block/Experte/Ultimativ Basic) – in einer `.vaws`-Arbeitsbereichsdatei.                                                                                                                                                                                                                                                                                 |
| **Arbeitsbereich speichern unter**     | Speichern Sie den aktuellen Arbeitsbereich jedes Mal über einen neuen Dateidialog.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Arbeitsbereich öffnen**              | Schließen Sie alle geöffneten Tabs und öffnen Sie die in einer `.vaws`-Arbeitsbereichsdatei gespeicherten Dateien erneut.                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Arbeitsordner festlegen**            | Wählen Sie den Standardordner für Dateiauswahl- und Speicherdialoge. Der Pfad wird in der App-Konfiguration gespeichert, und in der Menüvorschau wird das Ende des Pfades angezeigt.                                                                                                                                                                                                                                                                                                                                          |
| **Projekt öffnen** (`Menü → Datei`)    | Öffnen Sie ein `.proj`-Projekt mit mehreren Dateien und öffnen Sie alle Quelldateien als Tabs.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Projekt speichern** (`Menü → Datei`) | Speichern Sie das aktuelle `.proj`-Projekt (das Projektfenster muss geöffnet sein).                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Projekt schließen** (`Menü → Datei`) | Das aktuell geöffnete Projekt und alle zugehörigen Dateiregisterkarten werden geschlossen. Es wird eine Aufforderung zum Speichern der nicht gespeicherten Änderungen angezeigt. Das Projektfenster wird auf seinen leeren Zustand zurückgesetzt.                                                                                                                                                                                                                                                                             |
| **Lade .asm-Datei**                    | Öffnet eine `.asm`-Datei im Expertenmodus und importiert textuellen 6502-ASM-Code in den aktuellen Tab                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Speichern PRG**                      | Exportieren Sie die kompilierte Binärdatei als `.prg`-Datei                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **CRT erstellen**                      | Exportieren Sie das Programm als 64K Magic Desk-Datei (`.crt`, Cartridge-Typ 19). Siehe [Abschnitt 12b](#12b-crt-export-magic-desk-64k-cartridge).                                                                                                                                                                                                                                                                                                                                                                            |
| **Laufen (Split-Taste)**               | Die Hauptschaltfläche **▶ Ausführen** startet den aktuellen Modus. Klicken Sie auf den Pfeil **▾**, um zwischen folgenden Optionen zu wechseln: **Als PRG ausführen** (VICE direkt kompilieren und starten), **Über D64 ausführen** (in ein .d64-Disk-Image packen und VICE starten) oder **Auf Hardware ausführen** (PRG an ein C64 Ultimate / 1541 Ultimate-Gerät senden). Siehe [Abschnitt 12](#12-d64-export--run) und [Abschnitt 13](#13-hardware-settings).                                                             |
| **Debug (RetroDebugger)**              | Kompilieren und starten Sie in RetroDebugger mit Haltepunkten, Symbolen und Autostart-Flags (siehe [Abschnitt 9](#9-debugger-integration)).                                                                                                                                                                                                                                                                                                                                                                                   |
| **Mit Exomizer ausführen**             | Kontrollkästchen im Menü „Einstellungen“ – wenn aktiviert, wird bei allen Ausführungs- und Build-Vorgängen die PRG-Datei vor dem Starten oder Speichern mit `exomizer sfx sys` verarbeitet. Funktioniert mit „Als PRG ausführen“, „Über D64 ausführen“, „Auf Hardware ausführen“, „PRG erstellen“ und „D64 erstellen“. Konfigurieren Sie die Exomizer-Datei zuerst in den **Hardwareeinstellungen**.                                                                                                                          |
| **Automatische Snapshot-Speicherung**  | Aktivieren Sie das Kontrollkästchen unter **Hardwareeinstellungen → Snapshot**. Ist diese Option aktiviert, erstellt die App automatisch ca. 2,5 Sekunden nach Beendigung der Bearbeitung eines Tabs einen Snapshot. Deaktivieren Sie sie, wenn Sie Snapshots nur manuell speichern möchten.                                                                                                                                                                                                                                  |
| **Hardwareeinstellungen**              | Öffnen Sie den Hardwarekonfigurationsdialog und konfigurieren Sie VICE, Exomizer, RetroDebugger und C64 Ultimate (Host, Passwort, Verbindungstest). Siehe [Abschnitt 13](#13-hardware-settings).                                                                                                                                                                                                                                                                                                                              |
| **Neues Programm…**                    | Öffnet einen Bestätigungsdialog und entfernt anschließend alle Blöcke aus dem Programmbereich.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Alle ausblenden**                    | Alle Blöcke ausblenden                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Über**                               | Versionsinformationen                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Was gibt's Neues?**                  | Änderungsprotokoll                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

### Projekt-Snapshots

Projekt-Snapshots werden als separate JSON-Dateien auf der Festplatte gespeichert, nicht im lokalen Speicher. Sie sind an die aktuelle Projektdatei gebunden, sofern eine solche existiert, sodass die Historie auch nach Neustarts erhalten bleibt und dem Projekt folgt.

- **Menü → Erstellen → Snapshot speichern** öffnet den Snapshot-Dialog und speichert den aktuellen Blockstatus sowie den Expert ASM-Text.
- **Menü → Erstellen → Vorherige Version wiederherstellen** stellt den letzten Snapshot direkt wieder her.
- **Menü → Erstellen → Snapshot-Verlauf** öffnet den Dialog, in dem Sie Notizen hinzufügen, ältere Einträge wiederherstellen oder löschen können.
- **Hardwareeinstellungen → Snapshot → Automatische Snapshot-Speicherung** steuert, ob die App nach Bearbeitungen automatisch Snapshots erstellt. Die Standardverzögerung beträgt ca. 2,5 Sekunden, und die Einstellung gilt pro Tab.
- Wenn ein Projekt noch nicht gespeichert wurde, werden Snapshots im App-Konfigurationsverzeichnis gespeichert, bis dem Projekt ein Dateipfad zugewiesen wird. | **Wissensdatenbank** | Referenzlinks (6502 Opcodes, C64-Kernel, Speicherbelegung, Farben) | | **Nach Updates suchen** | Öffnen Sie die itch.io-Seite, um nach einer neueren Version zu suchen.

### Arbeitsbereiche

Ein **Workspace** (`.vaws`-Datei) merkt sich, welche realen Dateien auf der Festplatte in den einzelnen Tabs geöffnet waren – einschließlich des Bearbeitungsmodus und des aktiven Tabs –, sodass Sie genau diese Einstellungen später wieder öffnen können. Er ist von einem `.proj`-Projekt getrennt: Ein Workspace kann beliebige Kombinationen von Block/Expert `.json`-Projektdateien, eigenständigen `.asm`-Dateien und Ultimate Basic `.ub`/`.proj`-Quelldateien über mehrere Tabs umfassen.

- Arbeitsbereiche ** werden nach einigen hundert Millisekunden automatisch gespeichert**, sobald eine Änderung vorgenommen wurde oder ein Arbeitsbereich einmal gespeichert oder geöffnet wurde.
- Die App stellt beim Start automatisch Ihren letzten Arbeitsbereich wieder her, sodass Ihre geöffneten Tabs genau dort weitermachen, wo Sie aufgehört haben.
- Nur Tabs, die durch eine reale Datei auf der Festplatte belegt sind, werden im Arbeitsbereich gespeichert; ein Tab, der ein nicht gespeichertes Beispiel oder ein nur im Arbeitsspeicher befindliches Programm enthält, hat nichts zu speichern und wird übersprungen (mit einem Hinweis, falls keiner der geöffneten Tabs die Voraussetzungen erfüllt).
- Beim Öffnen eines Arbeitsbereichs werden zunächst alle aktuell geöffneten Tabs geschlossen – Sie werden vor dem Fortfahren um Bestätigung gebeten.
- Wenn ein Arbeitsbereich auf eine Datei verweist, die inzwischen verschoben oder gelöscht wurde, wird dieser Eintrag übersprungen und nach dem Laden namentlich gemeldet.

### Laden der .asm-Datei (Kurzanleitung)

Der Loader Expert-mode `.asm` akzeptiert gängige 6502-Quellcodemuster und wandelt sie in Blöcke um:

- `* = $1500` → ORG block
- `Beschriftung:` → LABEL-Block
- `Label: .byte 0` → LABEL + BYTE-Blöcke
- `.byte ...` → BYTE block
- `; comment` (or inline `; ...`) → COMMENT block
- Anweisungen (`lda`, `jsr`, `beq`, etc.) → Anweisungsblöcke mit erkanntem Adressierungsmodus

#### Hinweise und bewährte Vorgehensweisen zum Importieren

- Lokale Labels wie `.wait` werden als Standardlabels importiert (Punkt entfernt), und Referenzen werden entsprechend normalisiert.
- Für Adressierungen im Stil `($zp),Y` / `($zp,X)` sollte zur besseren Kompatibilität ein konkretes Nullseitenbyte (`$FB`, `$FC` usw.) verwendet werden.
- Vermeiden Sie mehrdeutige kurze Bezeichnungen, die wie Hexadezimalzahlen aussehen (`cc1`, `dead`, `beef`); bevorzugen Sie stattdessen Namen wie `loop_cc1`.
- Wenn Ihr Programm mit Daten (`.byte`) vor dem ausführbaren Code beginnt, fügen Sie oben einen expliziten Einstiegssprung hinzu (zum Beispiel `JMP Start`).

### ASM-Import (Kick Assembler)

Die Schaltfläche **ASM importieren** im Menü „Programm“ importiert rohen Kick-Assembler-Quellcode in einen neuen Blockmodus-Tab. Sie ist von der oben beschriebenen Funktion `Laden einer .asm-Datei im Expertenmodus ` getrennt – ihr benutzerdefinierter Tooltip weist darauf hin, dass **nur Kick-Assembler-Code unterstützt wird** (andere Assembler können den Code möglicherweise teilweise parsen, aber eine vollständige Verarbeitung ist nicht garantiert).

Unterstützte Muster:

- `.pc = $XXXX` Ursprungsdirektive → ORG-Block
- `.const NAME = value`, `.label NAME = value` → CONST equate
- `.macro NAME(p1, p2, ...) { ... }` mit `{`/`}` geschweiften Klammern oder `.endm` → Benutzermakrodefinition
- Makroaufruf `NAME(args)`, Kick-Doppelpunktpräfix `:NAME(args)` und `.invoke NAME(args)` – alle über die Kick-Doppelpunktform
- `@local` labels (`@loop:`, `BEQ @loop`) preserve the `@` prefix as is
- Operand `label + N` / `label - N` (z.B. `STA mod1+2`, `LDA xp+1`)
- Zeilenkommentare `// ...` und `;` werden beide akzeptiert, `/* ... */`-Blöcke werden als eine einzelne Kommentarzeile behandelt.
- BASIC-Autostart-Passthrough: Wenn das Programm an Adresse `$0801` mit dem standardmäßigen Byte-Stub `SYS 2061` (`.byte $0B,$08,$0A,$00,$9E,$32,$30,$36,$31,$00,$00,$00`) startet, gibt der Compiler das PRG unverändert aus, anstatt es mit einem zweiten BASIC SYS zu umschließen.

Bekannte Einschränkung:

- Konstanten, die auf eine Nullseitenadresse aufgelöst werden (z. B. `.const BYTEADDR = $FC`, verwendet als `STA BYTEADDR`), werden aktuell in absolute Anweisungen (3 Byte) anstatt in Nullseitenanweisungen (2 Byte) kompiliert. Der kompilierte Code schreibt weiterhin an die korrekte Speicheradresse, jedoch mit einem geringen Mehraufwand an Größe und Rechenzyklen im Vergleich zum gleichen Quellcode, der mit Kick Assembler erstellt wurde.

## Ultimativer Basismodus

Visual Assembler enthält eine vollständige Ultimate Basic IDE. Ultimate Basic ist eine moderne, kompilierte BASIC-Sprache zur Erstellung von C64-Programmen, Spielen und Demos, ohne dass jede Operation in hardwarenaher 6502-Assemblersprache geschrieben werden muss. Der Compiler läuft lokal und erzeugt native C64-PRG-Ausgabe.

### Öffnen des UB-Editors

Wählen Sie das Symbol **UB** in der Hauptsymbolleiste, um in den Modus „Ultimative Basiseinstellungen“ zu wechseln. Der ausgewählte Bearbeitungsmodus bleibt auch nach einem Neustart der Anwendung erhalten. Eine neue Quelle beginnt mit:

```basic
color bg 0
color border 0

print "HELLO FROM ULTIMATE BASIC"
```

Der UB-Modus funktioniert mit `.ub`-Quelldateien. **Neu**, **Öffnen**, **Speichern** und **Speichern unter** werden im aktiven UB-Tab ausgeführt. Beim Öffnen einer `.ub`-Datei wird der entsprechende Editor-Tab automatisch aktiviert.

Die Symbolleiste zeigt den aktuellen UB-Arbeitsordner an. Dieser Ordner wird separat vom Block-/Experten-Arbeitsordner gespeichert. Im UB-Modus wählt **Datei → Arbeitsordner festlegen** den UB-Ordner aus; die zugehörige QuickInfo zeigt den aktiven Bereich an. Die Dialogfelder „Öffnen“ und „Speichern“ im UB-Modus starten dort, und nicht gespeicherte Quellen verwenden ihn als Basis für relative `include`- und `incbin`-Pfade.

### Editorwerkzeuge

Die UB-Symbolleiste verwendet dieselbe visuelle Sprache und dieselben benutzerdefinierten Tooltips wie der Expertenmodus. Sie bietet Folgendes:

- Syntaxhervorhebung basierend auf der aktuellen Ultimate Basic-Sprachreferenz;
- Zeilennummern bleiben mit langen Dateien synchronisiert;
- eine Minikarte und Zoom-Steuerelemente für den Editor; klicken Sie auf die Minikarte, um zu springen, oder ziehen Sie den Bereich, in dem sich der Ansichtsbereich befindet, um kontinuierlich zu scrollen;
- Suchen Sie (`Strg+F` / `Cmd+F`) mit Hilfe der Experten-Suchleiste;
- Quellcodeformatierung mit strukturorientierter Einrückung;
- Automatische Vervollständigung für Befehle und integrierte Funktionen;
- ein durchsuchbares **Befehlsfeld** mit Syntax, Beschreibung und Anwendungshinweisen – die Beschreibungen folgen der aktuellen UI-Sprache (Ungarisch, Englisch, Spanisch, Deutsch, Niederländisch), wobei für alles, was noch nicht übersetzt ist, auf Englisch zurückgegriffen wird;
- Unabhängig voneinander umschaltbare **Projekt** und **Befehle** Bedienfelder, die nebeneinander angezeigt werden, wenn beide aktiviert sind;
- Unabhängig voneinander umschaltbare und in der Größe veränderbare Bedienfelder **Build Output** und **Disassembly**.

Das Disassemblierungsfenster enthält eine Schaltfläche **Kopieren**, die den gesamten angezeigten Quellcode in die Zwischenablage kopiert. Die Befehlshilfe ist dem mitgelieferten Compiler zugeordnet: Beispielsweise wählt `Sprite-Frame-ID, Datenadresse [, Frame]` ein Animationsbild aus aufeinanderfolgenden 64-Byte-Sprite-Frames aus.

Die Befehlsliste ist absichtlich in ihrer Höhe begrenzt, damit die Befehlsdetailkarte die verbleibende Höhe des Bedienfelds ausfüllen kann. Der Detailbereich lässt sich für längere Syntaxbeschreibungen unabhängig scrollen.

### Projekte, Registerkarten und Startdateien

Ultimate Basic-Projekte verwenden `.proj`-Dateien und können mehrere `.ub`-Quelldateien enthalten. Das Projektfenster listet geöffnete Dateien auf, markiert nicht gespeicherte Registerkarten und zeigt erkannte Labels, Funktionen und Unterprogramme an. Mit den Projektaktionen können Sie ein Projekt erstellen, öffnen, speichern und schließen oder eine weitere Quelldatei hinzufügen.

Klicken Sie auf den Stern neben einer Projektdatei, um diese als **Startdatei** zu markieren. Die Befehle „Erstellen“, „Ausführen“, „D64“, „C64 Ultimate“ und „Debuggen“ kompilieren diese Startdatei, selbst wenn ein anderer Tab aktiv ist. Ohne Auswahl einer Startdatei wird der aktive UB-Tab verwendet.

### Gebäude und Diagnostik

Die Schaltfläche **Build** öffnet die gleiche zentrierte Fortschrittsanzeige wie die anderen Workflows für die Ausführung des Visual Assemblers. Erfolgreiche Builds aktualisieren die Build-Ausgabe, die Build-Informationen und die Disassemblierung. Aktivieren Sie **Verbose**, um Details zur Compiler-Speicherbelegung, interne Nullseitenzuweisungen und generierte Codedaten anzuzeigen.

Wenn die Kompilierung fehlschlägt:

- Die Build-Ausgabe wird automatisch angezeigt;
- Compilerfehler werden rot dargestellt;
- Im zentrierten Kompilierungsdialog wird der Fehler angezeigt;
- Fehler, die eine Quellzeile enthalten, wählen diese Zeile im aktiven UB-Editor aus.

Build Info meldet Lade-/Endadressen, Code- und PRG-Größen, Exomizer-Status, Variablen, Arrays, Funktionen/Unterprogramme und Labels.

### Laufen, D64 und Exomizer

Die Haupt-Split-Taste **Run** unterstützt Ultimate Basic in jedem normalen Ziel:

| Laufmodus                      | Grundlegendes Verhalten                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **Als PRG ausführen**          | Kompilieren und starten Sie die PRG direkt in VICE.                                                    |
| **Ausführung über D64**        | Kompilieren Sie, öffnen Sie den Standard-D64-Paketierungsdialog und starten Sie dann die Disk in VICE. |
| **Auf Ultimate ausführen**     | Laden Sie das PRG über die konfigurierte C64 Ultimate REST-Verbindung hoch und führen Sie es aus.      |
| **D64 auf Hardware ausführen** | Packen Sie ein D64-Paket und senden Sie es an den konfigurierten C64 Ultimate.                         |

Die globale Option **Einstellungen → Exomizer** gilt auch für UB-Builds und normale Laufzeitziele; ein separater Schalter in der UB-Toolbar ist nicht erforderlich. Debugger-Starts verwenden absichtlich die unkomprimierte PRG-Datei, sodass Compileradressen und Symbole weiterhin mit dem ausgeführten Programm übereinstimmen.

Aktivieren Sie unter **Einstellungen → Programmeinstellungen → UltimateBasic ASM-Quellcode generieren (.asm)** die Option, um den vom Compiler generierten Assembler-Code neben einem PRG- oder D64-Build mit demselben Basisdateinamen zu speichern. Da es sich um eine Build-Option handelt, enthält die UB-Symbolleiste keine separaten ASM-Exportschaltflächen. Mit der Anweisung `load "NAME", $address` wird außerdem die PRG-Ladeadresse der entsprechenden D64-Zusatzdatei angegeben.

### Debugger-Symbole und Disassemblierung

Die Builds fordern Ultimate Basic-Debug-Informationen an und erzeugen drei kompatible Sidecars:

- `.sym` für Symbole im KickAssembler-Stil;
- `.dbg` für Quell- und Segmentinformationen von C64Debugger/RetroDebugger;
- `.vs` für VICE-Monitor-Labels.

Das farbige UB-Disassemblierungsfenster löst bekannte Labels auf und zeigt Adressen, Bytes, Mnemonics und Operanden an. Die Schaltfläche **Debug** startet RetroDebugger mit dem rohen UB-PRG, Debug-Sidecars sowie den Labels, Funktionen, Subroutinen, Variablen und Arrays des Compilers. Die Einstellungen für Debug-Wartezeit und -Fortsetzung sind mit der normalen Konfiguration des Visual Assembler-Debuggers identisch.

### Handbuch und Quelle für Ultimate Basic

Das Buchsymbol in der UB-Symbolleiste öffnet das zugehörige Ultimate Basic `MANUAL.pdf` offline; die Schaltfläche „Handbuch“ im Begrüßungsdialog öffnet dasselbe Handbuch. Visual Assembler verwendet sowohl den Compiler als auch das PDF aus der festgelegten Git/Cargo-Abhängigkeit, sodass die IDE keine zweite Kopie der Ultimate Basic-Implementierung verwaltet. Im Dialogfeld „Über“ und auf dem Startbildschirm wird die aktuelle Abhängigkeitsversion angezeigt.

Ultimate Basic ist auch als eigenständiges Open-Source-Projekt verfügbar:

<https://github.com/zstarczali/UltimateBasic>

Der Compiler ist in Visual Assembler integriert, daher ist zur Laufzeit keine separate `ub`-Executable erforderlich.

## 6. Expertenmodus

Der Expertenmodus ist ein vollwertiger 6502-Bauteil-Editor mit direkter Texteingabe, der parallel zum Blockeditor existiert. Jede Registerkarte kann entweder im Block- oder im Expertenmodus verwendet werden – der Wechsel zwischen den Modi ist jederzeit über den Schalter **Block / Experte** in der oberen Leiste möglich.

### Schaltmodi

- **Block → Experte:** Das aktuelle Programm wird in Text serialisiert (eine Anweisung pro Zeile, Labels, Makros als Direktiven). Änderungen im Expertenmodus werden beim Zurückwechseln oder Auslösen einer Aktion mit dem Block-Array synchronisiert.
- **Experte → Block:** Der Text wird mit `parseAsmText()` analysiert und das Ergebnis ersetzt das Blockprogramm. Bei einem Analysefehler wird ein Kompilierfehlerdialog angezeigt.
- **Leere Zeilen** bleiben auch nach Hin- und Rückwechseln erhalten: Leere Zeilen im Expert-Editor erscheinen im Block-Modus als dünne gestrichelte Leerzeichen und werden beim Zurückwechseln in den Expert-Modus wieder als leere Zeilen dargestellt.

### Editor-Layout

```
┌──────────────────────────────────────────────────────┐
│ [toolbar]  Block │ Expert < tab toggle               │
├────────────┬────────────────────────────┬────────────┤
│  Palette   │   ASM text editor          │  Disasm    │
│  (opt.)    │   (monospace, editable)    │  panel     │
│            │                            │  (opt.)    │
└────────────┴────────────────────────────┴────────────┘
```

| Panel            | Umschalten            | Beschreibung                                                                                                                        |
| ---------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Palette**      | `#expert-palette-btn` | Die linke Blockpalette – Blöcke per Drag & Drop in den Editor ziehen oder per Klick an der Cursorposition einfügen                  |
| **ASM-Editor**   | immer sichtbar        | Vollständiges Monospace-Textfeld mit Live-Syntaxhervorhebung                                                                        |
| **Disasm-Panel** | `#expert-disasm-btn`  | Reine 6502-Disassemblierung: Jede Anweisung zeigt Adresse, Hexadezimalbytes und numerische Operanden; Makros vollständig expandiert |

### Schaltflächen in der Symbolleiste

| Taste                             | AUSWEIS                                        | Funktion                                                                                                                                                                                                                                                                                                                |
| --------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Format**                        | `#expert-format-btn`                           | Automatische Formatierung des Quelltextes (Beschriftungen in Spalte 0, 4-facher Einzug, 1-facher Mnemonik/Operand)                                                                                                                                                                                                      |
| **Load .asm**                     | `#expert-load-asm-btn`                         | Öffnen Sie eine `.asm`-Datei – der Inhalt wird in einem **neuen Tab** mit dem Dateinamen als Tab-Bezeichnung geladen. Jede geladene Datei wird zu einem unabhängigen Tab mit eigenen Programmblöcken und eigenem Editorstatus.                                                                                          |
| **Speichern .asm**                | `#expert-save-asm-btn`                         | Editorinhalte in einer `.asm`-Datei speichern (Dateidialog beim ersten Speichern)                                                                                                                                                                                                                                       |
| **Build Info**                    | `#expert-build-info-btn`                       | Öffnen Sie den Dialog „Build-Informationen“ (Ursprung, Größe, Bezeichnungen, Fehler).                                                                                                                                                                                                                                   |
| **HL**                            | `#expert-hl-btn`                               | Syntaxhervorhebung umschalten (bei sehr großen Dateien deaktivieren)                                                                                                                                                                                                                                                    |
| **Autocomplete**                  | `#expert-autocomplete-btn`                     | Die Autovervollständigungsvorschläge des Experten können aktiviert/deaktiviert werden. Wenn diese Option deaktiviert ist, werden im Experten-Editor keine Anweisungen, Merksätze oder Beschriftungen angezeigt.                                                                                                         |
| **Regionsauswahl**                | `#expert-region-selection-btn`                 | Aktivieren Sie die automatische Bereichsmarkierung im Expertenmodus. Der Faltstatus bleibt gespeichert, aber wenn diese Funktion deaktiviert ist, bleibt der vollständige Quelltext sichtbar und der aktuelle Bereich wird nicht automatisch ausgewählt.                                                                |
| **Alle Regionen ein-/ausblenden** | `#expert-region-fold-all-btn`                  | Alle `.region`-Blöcke lassen sich mit einem Klick ein- oder ausklappen. Ist bereits eine Region geöffnet, werden alle durch den Button ausgeblendet; sind alle Regionen bereits ausgeblendet, werden sie durch den nächsten Klick wieder ausgeblendet. Der Button leuchtet auf, sobald alle Regionen ausgeblendet sind. |
| **Zeilennummern**                 | `#expert-line-numbers-btn`                     | Aktivieren/Deaktivieren Sie die Zeilennummernleiste links im Editor. Die Leiste bleibt mit der Scrollposition synchronisiert und wird während der Eingabe live aktualisiert.                                                                                                                                            |
| **Finde**                         | `#expert-find-btn`                             | Öffnen Sie die schwebende Suchleiste (Strg+F). Geben Sie einen Suchbegriff ein; die Treffer werden in der Überlagerung hervorgehoben. Mit der Eingabetaste bzw. Umschalt+Eingabe können Sie zwischen den Treffern navigieren. Mit der Escape-Taste schließen Sie die Leiste.                                            |
| **Verkleinern / Vergrößern**      | `#expert-zoom-out-btn` / `#expert-zoom-in-btn` | Verringern/Vergrößern Sie die Schriftgröße im Editor (8–28 px). Die Einstellung wird gespeichert.                                                                                                                                                                                                                       |
| **Palette**                       | `#expert-palette-btn`                          | Linke Mnemopalette ein-/ausblenden                                                                                                                                                                                                                                                                                      |
| **Disasm**                        | `#expert-disasm-btn`                           | Demontagefenster ein-/ausblenden (reines 6502, Makros erweitert)                                                                                                                                                                                                                                                        |
| **Monitor**                       | `#expert-monitor-btn`                          | Monitor-Hex-Dump-Panel ein-/ausblenden                                                                                                                                                                                                                                                                                  |
| **Minimap**                       | `#expert-minimap-btn`                          | Den Code-Minimap-Streifen auf der rechten Seite des Editors ein-/ausblenden.                                                                                                                                                                                                                                            |

Editor-Tastenkombinationen: `Strg+/` (`Cmd+/` unter macOS) kommentiert die aktuelle Zeile oder jede ausgewählte Zeile; durch Hinzufügen von `Umschalt` wird die führende Kommentarmarkierung aus diesen Zeilen entfernt. Inline-Kommentare (z. B. `LDA $12 ; Erklärung`) bleiben beim Wechsel zwischen Experten- und Blockmodus in der Anweisungszeile erhalten. Im Blockmodus werden sie als grüne kursive Markierung `; Kommentar` in der Blocküberschrift angezeigt; beim Überfahren der Markierung mit der Maus wird der vollständige Text angezeigt, falls er gekürzt ist.

### Minimap des Experten-Editors

Die Minimap des Experteneditors ist ein schmaler Canvas-Streifen (`88 px`) ganz rechts im Editorbereich. Sie rendert eine verkleinerte Darstellung jeder Quellcodezeile:

| Balkenfarbe           | Token-Typ                                                |
| --------------------- | -------------------------------------------------------- |
| Kommentarfarbe        | Zeilen, die mit `;` beginnen                             |
| Etikettenfarbe        | Zeilen mit einer `label:` Definition                     |
| Richtlinienfarbe      | `.byte`, `.macro`, `.region` und alle anderen Direktiven |
| Mnemotechnische Farbe | Alles andere (Anleitung)                                 |

Ein halbtransparenter Anzeigebereichsindikator (farblich hervorgehobenes Rechteck) zeigt an, welcher Teil der Quelle aktuell sichtbar ist. Klicken Sie auf eine beliebige Stelle der Minikarte, um zu dieser Position zu springen; ziehen Sie, um kontinuierlich zu scrollen. Die Minikarte scrollt unabhängig, um den Anzeigebereichsindikator zentriert zu halten. Der Zustand wird in den UI-Einstellungen gespeichert (Schlüssel „expertMinimap“).

### Fehlerhervorhebung

Fehlerhafte Zeilen werden in Echtzeit, 350 ms nach jedem Tastendruck, rot hervorgehoben (getönter Hintergrund + linker Akzentrand). Die erste Fehlermeldung wird ebenfalls in der Statusleiste angezeigt. Sobald die Zeile korrigiert ist, verschwindet die Hervorhebung automatisch.

### Syntaxhervorhebung

Der Editor verwendet eine transparente Überlagerung (expert-hl), die den Inhalt des Textbereichs mit farbigen Elementen spiegelt. Die Hervorhebung kann mit der Schaltfläche HL deaktiviert werden, um die Leistung bei sehr großen Programmen zu verbessern.

| Farbe      | Token                                                                                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gelbgrün   | Mnemonics (`LDA`, `STA`, `JMP`, …) und Long-Branch-Pseudo-Ops (`LBNE`, `LBEQ`, …)                                                                           |
| Blau       | Direktiven (`.byte`, `.word`, `.fill`, `.assert`, `*=`, …)                                                                                                  |
| Orange     | Zahlen (`$FF`, `%1010`, `255`)                                                                                                                              |
| Cyan       | Labels — Zeilen, die mit `:` enden, einschließlich lokaler Labels (`.loop:`) und selbstmodifizierender Code-Operanden-Labels (`value:` in `LDA value:#$00`) |
| Türkis     | Zeichenkettenliterale                                                                                                                                       |
| Dunkelgrün | Kommentare (`; …`)                                                                                                                                          |

Die Direktiven `REGION` / `ENDREGION` werden wie die anderen Assembler-Direktiven hervorgehoben. Reduzierte Regionen zeigen im Editor nur die Regionsüberschrift an, bis sie wieder geöffnet werden. Die neue Option **Regionsauswahl** in der Symbolleiste steuert lediglich die automatische Hervorhebung der aktuellen Region im Expertenmodus; durch Deaktivieren bleibt der Quellcode sichtbar, ohne den Faltstatus zu ändern.

### Quelltextformatierer

Klicken Sie auf die Schaltfläche **Format** (`#expert-format-btn`), um die aktuelle Quelle automatisch zu formatieren:

- Die Labeldefinitionen werden in Spalte 0 verschoben.
- Die Anweisungen sind mit 4 Leerzeichen eingerückt.
- Eselsbrücken werden in Großbuchstaben geschrieben.
- Zwischen Mnemonik und Operand befindet sich genau ein Leerzeichen (zusätzliche Leerzeichen werden normalisiert).
- Wenn die Quelle bereits formatiert ist, wird der Status `"Bereits formatiert"` angezeigt.

### Projektbereich & Registerkarten

Der Expertenmodus unterstützt ein **Projektpanel** (`#expert-project-panel`) für `.proj`-Projekte mit mehreren Dateien:

- Eine `.proj`-Datei ist ein JSON-Manifest, das Quelldateien und deren Metadaten auflistet.
- Öffnen Sie ein Projekt mit **Menü → Datei → Projekt öffnen** oder ziehen Sie eine `.proj`-Datei in das Fenster.
- Jede Datei im Projekt öffnet sich als separater **Tab** in der Tableiste am oberen Rand des Editors.
- **Projekt schließen** (`Menü → Datei → Projekt schließen` / `#menu-close-project`) schließt das aktuelle Projekt und alle zugehörigen Dateiregisterkarten gleichzeitig. Vor dem Schließen werden Sie aufgefordert, nicht gespeicherte Änderungen zu speichern. Das Projektfenster wird auf seinen leeren Zustand zurückgesetzt und `_expertProjectData` wird gelöscht.
- Jede Datei kann als **Startdatei** (★ Sternsymbol) markiert werden. Wenn eine Startdatei festgelegt ist, kompiliert und führt die Schaltfläche **Ausführen** (PRG, D64, Ultimate) immer den Code dieser Datei aus – unabhängig vom aktuell aktiven Tab. Dies funktioniert sowohl im Blockmodus als auch im Expertenmodus.
- Der Abschnitt **symbols** am unteren Rand des Projektfensters kann mithilfe der Trennlinie zwischen Dateibaum und Symbolliste vertikal in der Größe angepasst werden, sodass lange Symbollisten bei Bedarf mehr Platz einnehmen können.

### Tableiste

Die Tableiste erscheint oberhalb des Editors, wenn mehr als ein Tab geöffnet ist.

| Besonderheit          | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Schmutziger Punkt** | Ein kleiner, farblich hervorgehobener Punkt auf dem Tabnamen kennzeichnet nicht gespeicherte Änderungen.                                                                                                                                                                                                                                                                                                             |
| **Scrollpfeile**      | Links/rechts Scroll-Schaltflächen werden angezeigt, wenn mehr Tabs vorhanden sind, als in die Leiste passen.                                                                                                                                                                                                                                                                                                         |
| **Schließen (×)**     | Schließt den Tab; fordert zum Speichern auf, falls der Tab geändert wurde.                                                                                                                                                                                                                                                                                                                                           |
| **Dateierweiterung**  | Der vollständige Dateiname einschließlich Erweiterung (`.c64va`, `.json`) wird angezeigt                                                                                                                                                                                                                                                                                                                             |
| **Rechtsklickmenü**   | Klicken Sie mit der rechten Maustaste auf einen Tab (oder einen leeren Bereich in der Tableiste), um Folgendes auszuwählen: **Neuer Tab**, **Tab schließen**, **Weitere Tabs schließen**, **Tabs rechts schließen**, **Alle Tabs schließen**. Beim Schließen mehrerer Tabs gleichzeitig werden Sie für jeden geänderten Tab gefragt und der Vorgang wird abgebrochen. **Alle schließen** lässt immer einen Tab leer. |

> Tipp: Die Palettensynchronisierung (#expert-palette-sync-btn) sorgt dafür, dass die Palettenauswahl mit der Tastenkombination am Cursor synchronisiert bleibt. Deaktivieren Sie diese Funktion, wenn Sie nicht möchten, dass die Palette während der Bearbeitung springt.

---

## 7. Adressierungsmodi

Jeder 6502-Befehl unterstützt einen oder mehrere Adressierungsmodi. Der Moduswähler befindet sich auf jedem Block.

| Modus          | Etikett             | Beispiel       | Beschreibung                                                                    |
| -------------- | ------------------- | -------------- | ------------------------------------------------------------------------------- |
| **impliziert** | Impliziert          | `NOP`          | Kein Operand; die Anweisung ist in sich abgeschlossen.                          |
| **sofort**     | Sofort              | `LDA #$FF`     | Inline-Konstante; der Assembler fügt `#` automatisch hinzu.                     |
| **zeroPage**   | Seite Null          | `LDA $10`      | Einzelbyte-Adresse auf Seite Null (0–255)                                       |
| **zeroPageX**  | Seite Null,X        | `LDA $10,X`    | Nullseitenadresse + X-Register-Offset (Ergebnis wird auf Seite 0 umgebrochen)   |
| **zeroPageY**  | Seite Null,Y        | `LDX $FB,Y`    | Nullseitenadresse + Y-Register-Offset                                           |
| **absolut**    | Absolute            | `LDA $0400`    | Vollständige 16-Bit-Speicheradresse                                             |
| **absoluteX**  | Absolut,X           | `LDA $0400,X`  | 16-Bit-Adresse + X-Register-Offset                                              |
| **absoluteY**  | Absolut,Y           | `LDA $0400,Y`  | 16-Bit-Adresse + Y-Register-Offset                                              |
| **relativ**    | Relativ/Bezeichnung | `BNE-Schleife` | Für Filialanweisungen: Geben Sie einen Labelnamen oder eine Zieladresse ein.    |
| **indirectX**  | Indirekt,X          | `LDA ($FB,X)`  | Indirekter Index bei Nullseiten (Operand = Nullseitenadresse, 1 Byte)           |
| **indirectY**  | Indirekt,Y          | `LDA ($FB),Y`  | Indirekte Indexierung auf Seite Null (Operand = Adresse der Seite Null, 1 Byte) |
| **indirect**   | Indirekt            | `JMP ($0100)`  | Indirekt; nur mit JMP nutzbar.                                                  |

### Labelausdrücke als Operanden

Jedes Operandenfeld, das eine Adresse oder einen unmittelbaren Wert akzeptiert, akzeptiert auch direkt einen **Konstantennamen** (aus einem `CONST`-Block oder einem `LABEL`). Zusätzlich können Sie die Ausdrücke **label+offset** oder **label−offset** verwenden, um eine Adresse relativ zu einer benannten Konstante zu referenzieren:

| Syntax          | Beispiel                 | Beschreibung                                                                                                                   |
| --------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `label`         | `STA screen_ram,X`       | Wird auf den Label-/Konstantenwert aufgelöst                                                                                   |
| `label+$hex`    | `STA screen_ram+$0100,X` | Labeladresse plus Hex-Offset                                                                                                   |
| `label+decimal` | `STA screen_ram+256,X`   | Labeladresse plus Dezimaloffset                                                                                                |
| `label-$hex`    | `LDA table-$10`          | Labeladresse minus einem Hex-Offset                                                                                            |
| `#<label`       | `LDA #<screen_ram`       | Niedrigstes Byte der Labeladresse                                                                                              |
| `#&gt;label`    | `LDA #&gt;screen_ram`    | Höchstwertiges Byte der Labeladresse                                                                                           |
| `*`             | `BNE *`                  | Aktueller Programmzähler (die Adresse der Anweisung selbst); Verzweigungen mit `*` erzeugen eine Endlosschleife (Offset `$FE`) |

**Beispiel — Zwei Bildschirmseiten mit einer CONST löschen:**
```
; .CONST screen_ram = $0400
    LDX #$00
clear:
    STA screen_ram,X
    STA screen_ram+$0100,X
    DEX
    BNE clear
```

### Der `*`-Programmzähler in Ausdrücken

*(Neu in 2.3.9.)* `*` ist nicht mehr auf den gesamten Operanden beschränkt – es kann **an beliebig innerhalb eines Operandenausdrucks** vorkommen und steht für die Adresse der Anweisung, in der es steht. Es wird zur Assemblierungszeit anhand der tatsächlichen Adresse dieser Anweisung aufgelöst, sodass für kurze relative Sprünge oder PC-relative Datenlesevorgänge keine Marke benötigt wird.

| Syntax              | Beispiel                   | Bedeutung                                                     |
| ------------------- | -------------------------- | ------------------------------------------------------------- |
| `*`                 | `BNE *`                    | Verzweigung zu sich selbst (Endlosschleife, Offset `$FE`)     |
| `*-n` / `*+n`       | `BNE *-5`, `BEQ *+4`       | Verzweigung relativ zum aktuellen Programmzähler um *n* Bytes |
| `JMP *+n`           | `JMP *+20`                 | Absoluter Sprung, berechnet vom aktuellen PC                  |
| `#&lt;*` / `#&gt;*` | `LDA #&lt;*`, `LDA #&gt;*` | Niedriges/hohes Byte des aktuellen PCs                        |
| `#&gt;(*+n)`        | `LDA #&gt;(*+63)`          | Niedriges/hohes Byte einer PC-relativen Adresse               |

**PC vs. Multiplikation.** `*` wird nur dann als Programmzähler behandelt, wenn es sich an der *Wertposition* befindet – am Anfang des Ausdrucks oder direkt nach einem Operator, `(`, `,`, `&lt;`, `&gt;` oder einem Leerzeichen. Ein `*`, das auf eine Zahl, `)` oder einen Bezeichner folgt, ist eine gewöhnliche Multiplikation, daher bleiben `LDA table*2` und `CONST_A*4` unverändert.

**Wo es funktioniert.** Jeder Operand, der bereits einen Ausdruck akzeptiert: Sprungziele, `JMP` / `JSR`, `LDA`/`STA`/… absolute und indizierte, unmittelbare Low-/High-Byte-Operatoren und der Ausdruck `.assert`. `*` ändert niemals die Größe einer Anweisung, daher ist es in jedem Adressierungsmodus sicher.

### Lokale (gepunktete) Bezeichnungen

*(Neu in 2.3.9.)* Eine Marke, deren Name mit einem Punkt beginnt – `.loop`, `.skip`, `.done` – ist eine **lokale Marke**. Sie gehört zum Gültigkeitsbereich der nächstgelegenen vorhergehenden **globalen** (nicht gepunkteten) Marke und wird intern zu `<global>.<name>`. Zwei lokale Marken mit demselben Kurznamen unter verschiedenen globalen Marken kollidieren nicht.

```
DrawSprite:
    LDX #0
.loop:                 ; == DrawSprite.loop
    LDA SpriteData,X
    STA $2000,X
    INX
    CPX #63
    BNE .loop          ; resolves within DrawSprite
    RTS

ClearScreen:
    LDX #0
.loop:                 ; == ClearScreen.loop — no clash
    STA $0400,X
    INX
    BNE .loop
    RTS
```

- Innerhalb eines Gültigkeitsbereichs kann auf eine lokale Bezeichnung mit `.name` verwiesen werden.
- Aus einem anderen Gültigkeitsbereich kann explizit darauf verwiesen werden als `Global.name` (z. B. `JMP ClearScreen.loop`).
- Ein `.name`, das vor einer globalen Marke geschrieben wird, bleibt ein einfacher Top-Level-`.name`.
- Lokale Labels werden beim Wechsel zwischen Block- und Expertenmodus unverändert beibehalten; das Präfix `<global>.` ist ein Layout-Detail und wird niemals im Blockprogramm gespeichert.

### Selbstmodifizierende Code-Operandenbezeichnungen

*(Neu in 2.3.9.)* Um ein Label auf das Operandenbyte **** anstatt auf den Opcode zu setzen, wird dem Operandenbyte `label:` eine Marke vorangestellt. Der Befehl wird aus dem nach dem Doppelpunkt folgenden Code assembliert.

```
setup:
    LDA value:#$00     ; 'value' -> address of the #$00 operand byte
    ...
patch:
    LDA #new
    STA value          ; writes the operand byte directly — classic SMC
```

Der Wert `value` zeigt in jedem Adressierungsmodus auf `<Befehlsadresse> + 1` (das erste Operandenbyte). Dies ersetzt das ältere Muster `STA-Befehl+1` / `Befehl: LDA #$00`. Es durchläuft dabei den Block- und Expertenmodus (das Operandenfeld behält das Präfix `label:` bei).

---

## 8. Standard 6502 Anweisungen

### Datenbewegung

| Mnemotechnik | Beschreibung        | Modi                                                                      |
| ------------ | ------------------- | ------------------------------------------------------------------------- |
| `LDA`        | Lastspeicher        | unmittelbar, Nullseite, absolut, absolutX, absolutY, indirektX, indirektY |
| `LDX`        | X-Register laden    | sofort, Nullseite, NullseiteY, absolut, absolutY                          |
| `LDY`        | Y-Register laden    | sofort, Nullseite, absolut, absolutX                                      |
| `STA`        | Speicherakkumulator | zeroPage, absolute, absoluteX, absoluteY, indirectX, indirectY            |
| `STX`        | Kasse Filiale X     | zeroPage, zeroPageY, absolute                                             |
| `STY`        | Kasse im Geschäft Y | zeroPage, absolute                                                        |

### Arithmetik

| Mnemotechnik | Beschreibung              | Anmerkungen                                                                     |
| ------------ | ------------------------- | ------------------------------------------------------------------------------- |
| `ADC`        | Addieren mit Übertrag     | Stellen Sie die Trageoption `SEC` vor der Verwendung in den meisten Fällen ein. |
| `SBC`        | Subtrahieren mit Übertrag | Setze den Übertrag vor der Subtraktion mit `SEC`.                               |
| `INC`        | Speicher inkrementieren   | —                                                                               |
| `DEC`        | Speicher dekrementieren   | —                                                                               |
| `CMP`        | Vergleiche mit A          | Setzt Flags; ändert A nicht.                                                    |
| `CPX`        | Vergleiche mit X          | —                                                                               |
| `CPY`        | Vergleiche mit Y          | —                                                                               |

### Logik

| Mnemotechnik | Beschreibung                                                     |
| ------------ | ---------------------------------------------------------------- |
| `UND`        | Logisches UND mit Akkumulator                                    |
| `ORA`        | Logisches ODER mit Akkumulator                                   |
| `EOR`        | Exklusives ODER mit Akkumulator                                  |
| `BIT`        | Testet die Bits im Speicher gegen A (setzt die Flags N, V und Z) |

### Sprünge & Äste

| Mnemotechnik | Beschreibung                                                          |
| ------------ | --------------------------------------------------------------------- |
| `JMP`        | Unbedingter Sprung (absolut oder indirekt)                            |
| `JSR`        | Zu Unterprogramm springen (speichert Rücksprungadresse auf dem Stack) |
| `RTS`        | Rückkehr aus der Unterroutine                                         |
| `RTI`        | Rückkehr von der Unterbrechung                                        |
| `BNE`        | Verzweige, falls ungleich (Z=0)                                       |
| `BEQ`        | Verzweige, falls gleich (Z=1)                                         |
| `BCC`        | Verzweige, falls Übertrag gelöscht (C=0)                              |
| `BCS`        | Verzweige, falls Übertragsmenge (C=1)                                 |
| `BMI`        | Verzweige, falls Minus (N=1)                                          |
| `BPL`        | Verzweige, falls Plus (N=0)                                           |
| `BVC`        | Verzweige, falls Überlauf löschen (V=0)                               |
| `BVS`        | Verzweige, falls Überlauf gesetzt (V=1)                               |

#### LBNE / LBEQ / … (Lange Zweige)

*(Neu in 2.3.9.)* Die Palettenkategorie **Lange Verzweigungen** enthält acht Pseudo-Operationen, die sich wie bedingte Verzweigungen verhalten, aber **beliebige Adressen** erreichen können, nicht nur −128…+127. Jede dieser Operationen wird zu einer invertierten Verzweigung assembliert, die einen 3-Byte-JMP` überspringt – immer `5 Bytes**:

```
LBEQ done      ; assembles to:   BNE *+3   ($D0 $03)
               ;                 JMP done  ($4C lo hi)
```

| Lange Operation | Zustand                | Ausgegeben als         |
| --------------- | ---------------------- | ---------------------- |
| `LBNE`          | ungleich (Z=0)         | `BEQ *+3 / JMP-Ziel`   |
| `LBEQ`          | gleich (Z=1)           | `BNE *+3 / JMP target` |
| `LBCC`          | Übertrag löschen (C=0) | `BCS *+3 / JMP target` |
| `LBCS`          | Übertragsmenge (C=1)   | `BCC *+3 / JMP target` |
| `LBMI`          | minus (N=1)            | `BPL *+3 / JMP target` |
| `LBPL`          | plus (N=0)             | `BMI *+3 / JMP Ziel`   |
| `LBVC`          | Überlauf löschen (V=0) | `BVS *+3 / JMP target` |
| `LBVS`          | Überlaufmenge (V=1)    | `BVC *+3 / JMP target` |

- Operand: eine Marke, ein `*`-Ausdruck oder eine Literaladresse – genau wie bei einem normalen Verzweigungsziel.
- Kosten: 5 Bytes und 1 zusätzlicher Zyklus auf dem eingeschlagenen Pfad im Vergleich zu einer kurzen Verzweigung. Eine automatische Erweiterung einer kurzen Verzweigung findet nicht statt – Sie wählen `LBxx` explizit.
- Wenn ein einfacher Zweig (`BNE`, `BEQ`, …) außerhalb des gültigen Bereichs liegt, gibt der Compilerfehler nun den genauen Überschuss an und schlägt den passenden Zweig `LBxx` vor.

### Registervorgänge

| Mnemotechnik | Beschreibung                    |
| ------------ | ------------------------------- |
| `TAX`        | Transfer A → X                  |
| `TAY`        | Transfer A → Y                  |
| `TXA`        | Transfer X → A                  |
| `TYA`        | Transfer Y → A                  |
| `TSX`        | Übertrage den Stack-Pointer → X |
| `TXS`        | Übertrage X → Stapelzeiger      |
| `INX`        | Inkrement X                     |
| `DEX`        | X verringern                    |
| `INY`        | Y-Schritt                       |
| `DEY`        | Y verringern                    |

### Shift & Rotate

| Mnemotechnik | Beschreibung                       |
| ------------ | ---------------------------------- |
| `ASL`        | Arithmetische Linksverschiebung    |
| `LSR`        | Logische Rechtsverschiebung        |
| `ROL`        | Nach links drehen durch Übertragen |
| `ROR`        | Rechts drehen durch Übertragen     |

### Stapel

| Mnemotechnik | Beschreibung                          |
| ------------ | ------------------------------------- |
| `PHA`        | Akkumulator auf den Stapel legen      |
| `PHP`        | Prozessorstatus auf den Stack legen   |
| `PLA`        | Akkumulator aus dem Stapel ziehen     |
| `PLP`        | Prozessorstatus aus dem Stack abrufen |

### System / Flags

| Mnemotechnik | Beschreibung                                   |
| ------------ | ---------------------------------------------- |
| `CLC`        | Clear Carry Flagge                             |
| `CLD`        | Dezimalmodus löschen                           |
| `CLI`        | Clear Interrupt deaktivieren                   |
| `CLV`        | Überlauf-Flag löschen                          |
| `SEC`        | Flagge tragen                                  |
| `SED`        | Dezimalmodus einstellen                        |
| `SEI`        | Interrupt deaktivieren                         |
| `NOP`        | Keine Operation                                |
| `BRK`        | Erzwingen des Abbruchs / Softwareunterbrechung |

### Illegale / nicht dokumentierte Anweisungen

Diese Chips sind für fortgeschrittene Anwendungen geeignet. Vorsicht ist geboten – das Verhalten kann je nach Chip variieren.

`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`, `AXS`

---

## 9. Makroblöcke – Referenz

Makroblöcke ermöglichen es Ihnen, häufige Aufgaben in einem Schritt zu erledigen – anstatt 10–20 Anweisungen manuell zu schreiben, fügen Sie einfach einen Block ein, und der Assembler generiert den Code für Sie. Man kann sie sich wie integrierte Unterprogramme vorstellen.

---

### LABEL

Ähnlich einer Zeilennummer in BASIC – jedoch mit einem Namen anstelle einer Nummer. Sprungziele für JMP, JSR, BNE usw.

| Feld      | Beschreibung                                             |
| --------- | -------------------------------------------------------- |
| Labelname | Kennung, die in `JMP`, `JSR`, `BNE` usw. verwendet wird. |

**Expertensyntax:**
```
loop:
```

**Generiertes ASM:**
```
loop:  ; $0820
```

Die aktuelle Adresse wird als Kommentar angezeigt. Labels haben eine Größe von **0 Byte**.

---

### COMMENT

Wie **REM in BASIC** — eine Notiz für Sie selbst, die der Assembler vollständig ignoriert.

**Expertensyntax:**
```
; Your comment text here
```

**Generiertes ASM:**
```
; Your comment text here
```

---

### BYTE

Wie **DATA in BASIC** — speichert eine Liste von Rohbytewerten direkt im Programm.

| Feld    | Beschreibung                                                      |
| ------- | ----------------------------------------------------------------- |
| Operand | Kommagetrennte Bytewerte (z. B. `$01, $02, $FF` oder `1, 2, 255`) |

**Expertensyntax:**
```
.byte $01, $02, $FF
```

**Generiertes ASM:**
```
    .byte $01, $02, $FF
```

**Lo/Hi-Byte-Label-Referenzen: ** BYTE akzeptiert KickAssembler-/ca65-artige Token `<label` (niederwertiges Byte) und `>label` (hochwertiges Byte) neben numerischen Werten. Der Assembler löst die Labeladresse zur Kompilierzeit auf und fügt das entsprechende Byte ein. Beispiel:

```
    .byte <frame_0, >frame_0, <frame_1, >frame_1
```

Hier wird das niederwertige Byte der Adresse von `frame_0` gespeichert, dann das höherwertige Byte und anschließend das gleiche für `frame_1`. Nützlich zum Erstellen von Sprungtabellen und Adresslisten.

**Größe:** Anzahl der Bytes in der Liste.

---

### WORD

Wie **DATA in BASIC, aber für 16-Bit-Zahlen**. Jeder Wert wird als zwei Bytes gespeichert (zuerst das niederwertige Byte, dann das höherwertige Byte – 6502 Little-Endian-Reihenfolge).

| Feld    | Beschreibung                                               |
| ------- | ---------------------------------------------------------- |
| Operand | Durch Kommas getrennte 16-Bit-Werte (z. B. `$0400, $C000`) |

**Expertensyntax:**
```
.word $0400, $C000
```

**Generiertes ASM:**
```
    .word $0400, $C000
```

**Größe:** 2 Bytes pro Wort.

---

### FILL

Wie `FOR I=1 TO N : POKE addr+I, val : NEXT` — füllt einen Speicherblock mit demselben Byte, jedoch in einem einzigen Block. Ideal zum Löschen von Bereichen oder Vorbefüllen von Tabellen.

| Feld    | Beschreibung                                             |
| ------- | -------------------------------------------------------- |
| Operand | `count,value` — z. B. füllt `256,0` 256 Bytes mit Nullen |

**Expertensyntax:**
```
.fill 256, $00
```

**Generiertes ASM:**
```
    .fill 256, $00
```

**Ausdruckssyntax:** Sowohl `count` als auch `value` akzeptieren arithmetische Ausdrücke. Sie können auf CONST-Namen verweisen, Hexadezimal-/Binärliterale verwenden und integrierte mathematische Funktionen aufrufen:

| Ausdruck                    | Bedeutung                             |
| --------------------------- | ------------------------------------- |
| `TILE_COUNT, $00`           | count from a CONST, value hex literal |
| `40*25, 0`                  | Inline-Multiplikation                 |
| `round(sin(PI/4)*255), $80` | Trigonometrie                         |

**Eingebaute Funktionen:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`, `abs()`, constant `PI`

Operatoren: `+ - * /` Literale: `$FF` (hex), `%10110000` (binär) Niedrigstes/höchstes Byte: `lo(expr)`, `hi(expr)`

**Größe:** Der Zählerwert in Bytes.

---

### ALIGN

Verschiebt die aktuelle Adresse durch Einfügen von Null-Auffüllungsbytes zur nächsten freien Grenze. Der C64 benötigt Sprite-Daten, die an einer 64-Byte-Grenze beginnen – `ALIGN 64` erledigt dies automatisch.

| Feld   | Beschreibung                                                                   |
| ------ | ------------------------------------------------------------------------------ |
| Grenze | Ausrichtungswert – z. B. `64` (Sprite-Grenze), `256` (Seite), `$2000` (Bitmap) |

**Expertensyntax:**
```
.align 64
.align $2000
```

**Generiertes ASM:**
```
    ; ALIGN 64 → $0840 (12 bytes padding)
```

**Größe:** Dynamisch — abhängig von der aktuellen Programmzählerposition.

> **Tipp:** Verwenden Sie `ALIGN 64` vor Sprite-Daten, `ALIGN 256` um seitenbündige Tabellen zu gewährleisten.

---

### TEXT

Wie **PRINT AT** schreibt es Text direkt auf den C64-Bildschirm in einer bestimmten Spalte und Zeile, ohne den KERNAL zu verwenden. Es erzeugt ein LDA/STA-Paar pro Zeichen und zielt auf den Bildschirm-RAM an `$0400` ab.

| Feld                        | Beschreibung                                                                  |
| --------------------------- | ----------------------------------------------------------------------------- |
| Text                        | Die anzuzeigende Zeichenkette                                                 |
| X                           | Spalte (0–39)                                                                 |
| Y                           | Reihe (0–24)                                                                  |
| Etikett (optional)          | Weist eine Bezeichnung zu, die auf die berechnete Bildschirmadresse verweist. |
| Kleinbuchstaben-Zeichensatz | Kontrollkästchen – siehe unten                                                |

**Zeichensatzmodi:**

Der C64 verfügt über zwei zur Laufzeit auswählbare Zeichensätze:

| Modus                                                   | $D018 Bit 1 | Eingabe in Großbuchstaben           | Eingabe in Kleinbuchstaben            |
| ------------------------------------------------------- | ----------- | ----------------------------------- | ------------------------------------- |
| **Großbuchstaben/Grafiken** (Standard)                  | 0           | `A`–`Z` → Bildschirmcodes $01–$1A ✓ | wird auch als Großbuchstabe behandelt |
| **Kleinbuchstaben/Großbuchstaben** (nach CHARSET lower) | 1           | `A`–`Z` → $01–$1A (Großbuchstaben)  | `a`–`z` → $41–$5A (Kleinbuchstaben) ✓ |

- **Großbuchstaben (Standard, Kontrollkästchen deaktiviert):** Geben Sie ein, was in Großbuchstaben angezeigt werden soll. `"HELLO"` wird als `HELLO` angezeigt. Kleinbuchstaben werden Großbuchstaben-Bildschirmcodes zugeordnet.
- **Kleinbuchstaben-Zeichensatz (Kontrollkästchen aktiviert):** Geben Sie die gewünschte Schreibweise ein. `"hello"` → Anzeige in Kleinbuchstaben, `"HELLO"` → Anzeige in Großbuchstaben. Erfordert einen Laufzeit-Zeichensatzwechsel, bevor der Bildschirm geschrieben wird (verwenden Sie das Makro **CHARSET lower**).

**Generierter ASM (Großbuchstabenmodus, `"HELLO"`):**
```
    LDA #$08      ; 'H' screen code $08
    STA $0400
    LDA #$05      ; 'E' screen code $05
    STA $0401
    ...
```

**Expertensyntax:**
```
.text 0, 2, "HELLO"           ; uppercase charset (default)
.text 0, 2, "hello", lower    ; lowercase charset
```

Die Zeichen werden als **Bildschirmcodes** (nicht PETSCII) kodiert. **Größe:** `Textlänge × 5` Bytes (LDA + STA pro Zeichen).

---

### STRING

Wie **POKE, das zur Laufzeit eine Zeichenkette ** in eine beliebige Speicheradresse schreibt. Erzeugt LDA/STA-Paare, die den Bildschirmcode jedes Zeichens in aufeinanderfolgende Adressen kopieren.

| Feld                        | Beschreibung                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------- |
| Text                        | Die zu schreibende Zeichenkette                                                                         |
| Adresse                     | Zielspeicheradresse — `$C000` hex oder ein **Labelname**                                                |
| Etikett (optional)          | Weist eine Bezeichnung zu, die auf die Zieladresse verweist.                                            |
| Schicht                     | Hexadezimalwert (00–FF), der zu jedem Bildschirmcodebyte addiert wird (z. B. `$80` = umgekehrtes Video) |
| Kleinbuchstaben-Zeichensatz | Kontrollkästchen – gleiche Semantik wie TEXT (siehe Abschnitt TEXT)                                     |

**Expertensyntax:**
```
.string $C000, "HELLO"                  ; uppercase charset (default)
.string $C000, "hello", lower           ; lowercase charset
.string $C000, "HELLO", 80             ; with shift (reverse video)
.string $C000, "hello", 80, lower      ; shift + lowercase
.string $C000, "HELLO" :my_string      ; with macroLabel
```

**Generiertes ASM:**
```
    LDA #$08      ; 'H' screen code
    STA $C000
    LDA #$05      ; 'E' screen code
    STA $C001
    ...
```

Zeichen werden als **Bildschirmcodes** (nicht PETSCII) kodiert. Der optionale Wert **Shift** wird zu jedem Byte addiert, z. B. `$80` für umgekehrtes Video. **Größe:** `Textlänge × 5` Bytes (ein LDA + ein STA pro Zeichen).

---

### DATA

Wie eine **POKE-Schleife** — schreibt eine Liste von Rohbytes zur Laufzeit an eine Speicheradresse, ein LDA/STA-Paar pro Byte.

| Feld               | Beschreibung                                                 |
| ------------------ | ------------------------------------------------------------ |
| Bytes              | Kommagetrennte Byte-Werte                                    |
| Adresse            | Zielspeicheradresse — `$C000` hex oder ein **Labelname**     |
| Etikett (optional) | Weist eine Bezeichnung zu, die auf die Zieladresse verweist. |

**Expertensyntax:**
```
.data $C000, $01, $02, $03          ; hex address
.data my_buf, $01, $02, $03         ; label address
.data $C000, $01, $02, $03 :mydata  ; with macroLabel
```

**Generiertes ASM:**
```
    LDA #$01
    STA $C000
    LDA #$02
    STA $C001
    ...
```

**Größe:** `byte_count × 5` Bytes (ein LDA + ein STA pro Byte).

---

### RAWBYTES

Wie **DATA, das direkt in den Speicher geladen wird** – ganz ohne Laufzeitcode. Die Bytes sind ab dem Zeitpunkt des Ladens des PRG vorhanden, noch bevor Ihr Code startet. Verwenden Sie dies für Sprite-Daten, Level-Maps, Lookup-Tabellen und alles, was sich an einer bestimmten Adresse befinden muss.

| Feld               | Beschreibung                                                 |
| ------------------ | ------------------------------------------------------------ |
| Bytes              | Kommagetrennte Byte-Werte                                    |
| Adresse            | Zielspeicheradresse — `$C000` hex oder ein **Labelname**     |
| Etikett (optional) | Weist eine Bezeichnung zu, die auf die Zieladresse verweist. |

**Expertensyntax:**
```
.rawbytes $C000, $00, $00, $00      ; hex address
.rawbytes sprite_data, $00, $00     ; label address
.rawbytes $0C50, $00, $00 :nev      ; with macroLabel — other code can use LDA nev,X
```

**Größe im Code: ** 0 Bytes. Die Daten werden an der angegebenen Adresse in der Ausgabe platziert.

> **DATA vs. RAWBYTES:** DATA generiert LDA/STA-Code, der Bytes zur Laufzeit kopiert (langsamer, aber geeignet, wenn die Daten dynamisch sein müssen). RAWBYTES platziert die Bytes direkt – ohne Code, sofort, ohne Kosten.

---

### RAWTEXT

Ähnlich wie RAWBYTES, jedoch für Text – die Zeichenkette wird als Bildschirmcode kodiert und die Bytes werden an einer festen Adresse ohne Laufzeitcode ** abgelegt. Der Text ist im Speicher verfügbar, sobald die PRG geladen ist.

| Feld                        | Beschreibung                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------- |
| Text                        | Zu kodierende Zeichenkette                                                                              |
| Adresse                     | Zielspeicheradresse — `$C000` hex oder ein **Labelname**                                                |
| Etikett (optional)          | Weist eine Bezeichnung zu, die auf die Zieladresse verweist.                                            |
| Schicht                     | Hexadezimalwert (00–FF), der zu jedem Bildschirmcodebyte addiert wird (z. B. `$80` = umgekehrtes Video) |
| Kleinbuchstaben-Zeichensatz | Kontrollkästchen – gleiche Semantik wie TEXT (siehe Abschnitt TEXT)                                     |

**Expertensyntax:**
```
.rawtext $C000, "HELLO"                 ; uppercase charset (default)
.rawtext $C000, "hello", lower          ; lowercase charset
.rawtext $C000, "HELLO", 80            ; with shift (reverse video)
.rawtext $C000, "hello", 80, lower     ; shift + lowercase
.rawtext $0400, "HELLO" :my_text       ; with macroLabel
```

**Generiertes ASM:**
```
; .rawtext "HELLO" -> $C000
; $C000
    .byte $08, $05, $0C, $0C, $0F   ; H E L L O (uppercase screen codes)

; .rawtext "hello", lower -> $C000
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; h e l l o (lowercase screen codes $41–$5A range)
```

**Größe im Code: ** 0 Bytes. Die Daten werden an der angegebenen Adresse in der Ausgabe platziert.

> **STRING vs RAWTEXT:** STRING generiert LDA/STA-Code, der den Text zur Laufzeit kopiert. RAWTEXT bettet die Bytes beim Laden in die PRG ein – kein Code, keine Wartezeit.

---

### PETSCII

Ähnlich wie **RAWBYTES, jedoch für die KERNAL-Ausgabe** – kodiert die Zeichenkette als PETSCII-Bytes (kompatibel mit CHROUT unter `$FFD2`) und speichert sie an einer festen Adresse ohne Laufzeitcode. Verwenden Sie dies, wenn Sie Zeichen über `JSR $FFD2` in einer Schleife ausgeben möchten. Beachten Sie, dass das neue Makro `PRINT` denselben Kodierer und dasselbe Verhalten wie die Kontrollkästchen für Kleinbuchstaben verwendet.

> **PETSCII vs. Bildschirmcodes:** PETSCII und Bildschirmcodes sind zwei unterschiedliche Kodierungen. Bildschirmcode `$01` = Buchstabe A; PETSCII `$41` = Buchstabe A (über CHROUT). Verwenden Sie PETSCII nur beim Drucken über den Kernel; verwenden Sie TEXT/STRING/RAWTEXT zum direkten Schreiben in den Bildschirmspeicher.

| Feld                    | Beschreibung                                                 |
| ----------------------- | ------------------------------------------------------------ |
| Text                    | Zeichenkette, die als PETSCII-Bytes kodiert werden soll      |
| Adresse                 | Zielspeicheradresse — `$C000` hex oder ein **Labelname**     |
| Etikett (optional)      | Weist eine Bezeichnung zu, die auf die Zieladresse verweist. |
| Kleinbuchstaben PETSCII | Kontrollkästchen – siehe unten                               |

**Zeichensatzmodi:**

| Modus                                           | Eingabe in Großbuchstaben (`A`–`Z`)                                                                                                | Eingabe in Kleinbuchstaben (`a`–`z`) |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Großbuchstaben (Standard, nicht ausgewählt)** | `$41`–`$5A` (PETSCII Großbuchstaben via CHROUT)                                                                                    | ebenfalls abgebildet auf `$41`–`$5A` |
| **Kleinbuchstaben (geprüft)**                   | Die alphabetischen Buchstaben werden neu zugeordnet, sodass die sichtbare Groß-/Kleinschreibung im Zeichensatz einheitlich bleibt. | Gleiche Regel                        |

**Expertensyntax:**
```
.petscii $C000, "HELLO"              ; uppercase PETSCII (default)
.petscii $C000, "hello", lower       ; lowercase PETSCII ($61–$7A)
.petscii $C000, "HELLO", null        ; with null terminator
.petscii $C000, "hello", lower, null ; lowercase + null terminator
.petscii $C000, "HELLO" :my_msg      ; with macroLabel
```

**Generierte Bytes (Großbuchstaben, `"HELLO"`):**
```
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; H E L L O (PETSCII $41–$5A range)
```

**Größe im Code:** 0 Bytes. Die Daten werden als verzögerter Datenabschnitt (wie RAWBYTES) an der Zieladresse abgelegt.

**Nullterminator:** Aktivieren Sie das Kontrollkästchen *"Anhängen `$00` (Nullterminator)"*, um automatisch ein Byte `$00` nach dem Text hinzuzufügen. Ideal für nullterminierte Schleifen:

```
    LDX #$00
loop:
    LDA msg,X
    BEQ done        ; $00 stops the loop
    JSR $FFD2
    INX
    BNE loop
done:
    RTS
```

**Kodierungsregeln:**

| Eingang                                    | Großbuchstabenmodus                     | Kleinbuchstabenmodus |
| ------------------------------------------ | --------------------------------------- | -------------------- |
| `A`–`Z`                                    | `$41`–`$5A`                             | `$61`–`$7A`          |
| `a`–`z`                                    | `$41`–`$5A` (erzwungene Großschreibung) | `$41`–`$5A`          |
| Leerzeichen, Ziffern, Satzzeichen (32–126) | im Istzustand                           | im Istzustand        |
| Neue Zeile                                 | `$0D` (RETURN)                          | `$0D`                |
| Andere                                     | `$20` (Leerzeichen)                     | `$20`                |

> **Tipp:** Verwenden Sie PETSCII für Daten, die über CHROUT (`$FFD2`) ausgegeben werden. Um direkt in den Bildschirmspeicher zu schreiben, verwenden Sie stattdessen STRING oder RAWTEXT.

---

### CHARSET

Schaltet den VIC-II-Zeichen-ROM zwischen Großbuchstaben-/Grafikmodus (C64-Standard) und Kleinbuchstaben-/Großbuchstabenmodus um, indem Bit 1 von `$D018` zur Laufzeit geändert wird.

| Feld  | Beschreibung                                                                                                                                                           |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modus | **Kleinbuchstaben** – Aktiviert den Kleinbuchstaben-/Großbuchstaben-Zeichensatz; **Großbuchstaben** – Stellt den Standard-Großbuchstaben-/Grafikzeichensatz wieder her |

**Expertensyntax:**
```
.charset lower    ; switch to lowercase charset
.charset upper    ; switch back to uppercase/graphics charset
```

**Generiertes ASM:**

Kleinbuchstabenmodus:
```
    LDA $D018
    ORA #$02      ; set bit 1 → lowercase/uppercase ROM at $1800
    STA $D018
```

Großbuchstabenmodus:
```
    LDA $D018
    AND #$FD      ; clear bit 1 → uppercase/graphics ROM at $1000
    STA $D018
```

**Größe:** 8 Bytes (LDA abs + ORA/AND imm + STA abs).

**Warum ORA/AND anstelle eines direkten Schreibvorgangs?** `$D018` steuert auch die Speicheradresse im Bildschirm-RAM (Bits 7–4). Durch das Umschalten von Bit 1 bleiben die restlichen Registerwerte erhalten.

**Typischer Arbeitsablauf:**

```
    CHARSET lower             ; switch to lowercase charset
    TEXT 0, 0, "hello world"  ; [checkbox: Lowercase charset]
    ...
    CHARSET upper             ; restore default when done
```

Oder im Expertenmodus:
```
.charset lower
.text 0, 0, "hello world", lower
.charset upper
```

Im Expertenmodus durchläuft der `.charset`-Block nun auch das Modus-Dropdown-Menü, sodass die Blockvorschau und der exportierte Quellcode übereinstimmen.

> **Hinweis:** Das Makro CHARSET ändert lediglich den Zeiger auf das VIC-Zeichen-ROM. Es ruft nicht `$E544` (KERNAL-Zeichensatzinitialisierung) auf. In den meisten Fällen ist dies ausreichend; rufen Sie `JSR $E544` nur dann auf, wenn die Ausgaberoutinen des KERNAL die Änderung berücksichtigen müssen.

---

### CHARDEF

Definiert ein einzelnes 8×8-Zeichen in einem RAM-basierten Zeichensatz. Erzeugt Inline-Laufzeitcode, der zur Laufzeit 8 Bytes in `base + index * 8` kopiert – eine vorhergehende Marke oder `ORG` ist nicht erforderlich.

| Feld             | Beschreibung                                                                                                                  |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Zeichensatzbasis | Basisadresse des RAM-Zeichensatzes (Standard: `$3800`). Muss so ausgerichtet sein, dass der VIC-II sie erkennt (siehe unten). |
| Zeichenindex     | Welcher Zeichenslot (0–255) neu definiert werden soll. `65` = 'A' im Standard-Bildschirmcode-Layout.                          |
| 8 Bytes          | Durch Kommas getrennte Bitmap-Zeilen, von oben nach unten. Bit 7 jedes Bytes = Pixel ganz links.                              |

**Expertensyntax:**
```
.chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00
```

**Generierter ASM (8 × `LDA #b` / `STA target+n`, insgesamt 40 Bytes):**
```
    LDA #$18
    STA $3A08
    LDA #$3C
    STA $3A09
    LDA #$66
    STA $3A0A
    LDA #$7E
    STA $3A0B
    LDA #$66
    STA $3A0C
    LDA #$66
    STA $3A0D
    LDA #$66
    STA $3A0E
    LDA #$00
    STA $3A0F
```

**Zieladresse:** `$3800 + 65 * 8 = $3A08`. Zur Kompilierzeit berechnet und in den STA-Operanden fest codiert.

**Größe:** 40 Bytes pro Zeichen (8 × 5).

**Typischer Arbeitsablauf:**
```
    ; Point VIC-II at RAM charset at $3800
    LDA $D018
    AND #$F1
    ORA #$0E       ; bits 3-1 = %111 → charset at bank+$3800
    STA $D018

    CHARDEF $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00   ; redefine 'A'
    CHARDEF $3800, 66, $7C,$66,$66,$7C,$66,$66,$7C,$00   ; redefine 'B'
    ; ... more CHARDEF calls for each custom char
```

**Wann CHARDEF gegenüber Alternativen verwenden?**

| Ansatz                           | Verwenden Sie es, wenn                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **CHARDEF**                      | Sie benötigen einige benutzerdefinierte Zeichen (z. B. 1–20). Der Speicherbedarf beträgt jeweils 40 Byte.                 |
| **RAWBYTES @ $3800**             | Sie verwenden einen vollständig benutzerdefinierten Zeichensatz (256 Zeichen). Insgesamt 2 KB Daten, keine Laufzeitkopie. |
| **INCBIN "charset.bin" @ $3800** | Externe Zeichensatzdatei (vom Zeicheneditor erstellt). Die sauberste Option.                                              |
| **Charset Canvas + INCBIN**      | Die vollständige 256-Zeichen-Bitmap wird als ein 128×128-Bild dargestellt.                                                |

> **Hinweis zur Ausrichtung:** VIC-II erwartet die Zeichensatzbasis als Vielfaches von `$0800`. Gültige Speicherbereiche: `$0000`, `$0800`, `$1000`, ... , `$3800` (innerhalb des aktuellen 16-KB-VIC-Speicherbereichs). RAM-Zeichensätze befinden sich typischerweise an den Speicheradressen `$2000`, `$2800`, `$3000` oder `$3800`.

---

### BOX_HIT

Achsenparalleler Begrenzungsrahmen-Kollisionstest (AABB) zwischen zwei Rechtecken, die durch 4-Byte-Nullseitenstrukturen beschrieben werden. Gibt das Ergebnis im Akkumulator zurück: **A = 1** bei Überlappung, **A = 0** andernfalls. Reiner Inline-Assembler-Code, kein Unterprogrammaufruf.

| Feld            | Beschreibung                                                              |
| --------------- | ------------------------------------------------------------------------- |
| Box1 ZP Adresse | Nullseitenbasis der 4-Byte-Struktur der ersten Box (Standardwert `$FB`).  |
| Box2 ZP Adresse | Nullseitenbasis der 4-Byte-Struktur der zweiten Box (Standardwert `$F7`). |

**Strukturlayout** (4 Bytes pro Box, vorzeichenlose 8-Bit-Koordinaten):

| Offset | Feld   |
| ------ | ------ |
| `+0`   | Links  |
| `+1`   | Spitze |
| `+2`   | Rechts |
| `+3`   | Unten  |

**Expertensyntax:**
```
.box_hit $FB, $F7
```

**Generierter ASM-Code (30 Bytes, vollständig PC-relativ — keine Unterprogramme, keine absoluten Sprünge):**
```
    LDA $FD        ; b1 right
    CMP $F7        ; b2 left
    BCC no         ; R1 < L2 → miss
    LDA $F9        ; b2 right
    CMP $FB        ; b1 left
    BCC no
    LDA $FE        ; b1 bottom
    CMP $F8        ; b2 top
    BCC no
    LDA $FA        ; b2 bottom
    CMP $FC        ; b1 top
    BCC no
    LDA #$01       ; hit
    BNE done       ; unconditional (A ≠ 0)
no: LDA #$00
done:
```

**Größe:** 30 Bytes.

**Typischer Arbeitsablauf:**

```
    ; Player sprite box at $FB..$FE
    LDA sprite_x            ; L
    STA $FB
    LDA sprite_y            ; T
    STA $FC
    CLC
    ADC #23                 ; +23 → B (24-pixel tall sprite)
    STA $FE
    LDA $FB
    CLC
    ADC #23                 ; R
    STA $FD

    ; Enemy box at $F7..$FA (populated similarly)
    ; ...

    BOX_HIT $FB, $F7        ; test player vs enemy → A = 0 or 1

    CMP #$01
    BNE no_collision
    JSR handle_hit
no_collision:
```

**Einschränkungen:**
- Beide Nullseitenadressen müssen `≤ $FC` sein (jede Box benötigt 4 aufeinanderfolgende Bytes: `zp`, `zp+1`, `zp+2`, `zp+3`).
- Koordinaten werden als **unsigned 8-Bit** (0–255) behandelt. Für vorzeichenbehaftete Sprite-Koordinaten außerhalb dieses Bereichs werden diese vor dem Speichern normalisiert.
- Die beiden Felder können sich im ZP-Bereich überlappen, wenn gewünscht, normalerweise benötigt man jedoch 8 unterschiedliche Bytes.

Warum nicht eine Unterroutine? Die Inline-Generierung vermeidet den JSR/RTS-Overhead (14+ Zyklen) und hält den Test bei kurzen Spielschleifen im Cache. Wenn Sie viele Paare testen müssen, fügen Sie manuell eine eigene JSR box_hit_sub um einen einzelnen BOX_HIT-Block ein.

**Vergleich mit der Funktion `box_hit()` von UB:** Ultimate Basic kapselt dieselbe 6502-Logik als Laufzeitfunktion, die einen Wert an eine Variable zurückgibt. In VA platzieren Sie BOX_HIT direkt an der Stelle im Code, an der Sie den Test benötigen; das Ergebnis befindet sich in `A`.

---

### INCBIN

Wie **BLOAD in BASIC** — nimmt eine externe Binärdatei (`.bin`, `.prg`, `.sid`, `.raw`) und bettet sie direkt in den assemblierten PRG an der von Ihnen angegebenen Adresse ein.

| Feld    | Beschreibung                                                                     |
| ------- | -------------------------------------------------------------------------------- |
| Datei   | Navigieren Sie, um eine `.bin`-, `.prg`-, `.sid`- oder `.raw`-Datei auszuwählen. |
| Adresse | Zielladeadresse (z. B. `$C000`)                                                  |

**Expertensyntax:**
```
.incbin "music.bin", $C000
```

**Generierter ASM-Kommentar:**
```
    ; INCBIN "music.bin" @ $C000 (2048 bytes)
    .byte $01, $02, ...
```

**Größe im Code:** 0 Bytes (aufgeschobener Datenbereich). Die Binärdatei ist an der angegebenen Adresse eingebettet.

---

### SID

Wie **BLOAD für Musik** – lädt eine `.sid`-Datei in Ihren PRG und liest automatisch deren Init- und Play-Adressen aus dem Header. Rufen Sie Init einmal beim Start auf und anschließend Play in jedem Frame über Ihren IRQ-Handler.

| Feld                                  | Beschreibung                                                                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Datei                                 | Navigieren Sie, um eine `.sid`-Datei auszuwählen.                                                                                           |
| Benutzerdefinierte Adresse (optional) | Überschreiben Sie die native Ladeadresse der SID (z. B. `$1000`). Lassen Sie das Feld leer, um die Adresse aus dem SID-Header zu verwenden. |

Der Block zeigt Folgendes an:
- **Titel / Autor** aus dem SID-Header
- **Ladeadresse** — wo die Daten im Speicher abgelegt werden (effektive Adresse nach etwaiger Überschreibung)
- **Initial address** — call this with JSR to initialing music (adjusted for relocation if a custom address is used)
- **Wiedergabeadresse** — Rufen Sie dies mit JSR in jedem Frame in einem IRQ-Handler auf (angepasst an die Relocation)
- Ein **(relocated)**-Badge erscheint, wenn eine benutzerdefinierte Adresse die Daten von ihrer ursprünglichen Position verschiebt.

**Expertensyntax:**
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", $1000
```

**Generierter ASM-Kommentar:**
```
    ; SID "Ikari_Warriors.sid" @ $1000  Init:$1000  Play:$1006  (4096 bytes)
```

**Größe im Code:** 0 Bytes inline. Die SID-Binärdatei wird als verzögerter Chunk an der angegebenen Adresse im PRG abgelegt.

> Wichtig: Die meisten SID-Dateien enthalten fest codierte interne absolute Adressen. Diese können nur verschoben werden, wenn die gesamte Binärdatei um denselben Offset verschoben wird. Enthält eine SID interne Sprünge zu `$10xx`, muss sie an der Adresse `$1000` verbleiben – eine Verschiebung an eine andere Adresse würde diese internen Referenzen ungültig machen.

> **Typische Verwendung:** Platzieren Sie einen ORG-Block vor dem SID-Block, um dessen Adresse festzulegen. Rufen Sie Init einmal beim Start auf und anschließend Play für jedes Frame über einen Raster-IRQ-Handler.

---

### INCLUDE

Wie **MERGE in BASIC** – lädt es eine weitere Datei und erweitert deren Blöcke an dieser Position direkt im Projekt. Ideal für wiederverwendbare Unterprogrammbibliotheken. Die eingebundenen Blöcke sind im aktuellen Projekt schreibgeschützt.

Es werden zwei Dateitypen unterstützt:
- **Visual Assembler project** (`.json`) — die Blöcke des Projekts werden unverändert eingefügt.
- **Einfacher Assembler-Quellcode** (`.inc`, `.asm`, `.s`) – die Datei wird als Text gelesen und wie im Expertenmodus analysiert. Bei jedem Kompilieren wird die Datei neu von der Festplatte eingelesen (die Datei selbst ist die maßgebliche Quelle), sodass sie extern mit jedem beliebigen Editor bearbeitet werden kann.

| Feld                   | Beschreibung                                                                                                                                                                                                                                                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Datei                  | Navigieren Sie, um ein `.json`-Projekt oder eine `.inc`/`.asm`/`.s`-Assemblerquelle auszuwählen.                                                                                                                                                                                                                                             |
| Ladeadresse (optional) | Wenn dieser Wert gesetzt ist (hexadezimal, z. B. `C000`), werden die eingebundenen Blöcke an dieser Adresse platziert. Ein synthetischer `ORG`-Block wird davor eingefügt und überschreibt alle ORG-Blöcke innerhalb der eingebundenen Datei. Wenn Sie das Feld leer lassen, steuern die ORG-Blöcke der eingebundenen Datei die Platzierung. |

**Syntax im Expertenmodus:**
```
.include "library.json"
.include "macros.inc", $1500
.include "sprites.asm"
```

- Die Dateierweiterung ** ist im Expertenmodus erforderlich** – ein einfacher Name wie `.include "macros"` wird als `.include "macros.json"` interpretiert.
- Pfadauflösung: Zuerst wird versucht, im selben Verzeichnis wie die Projektdatei (relativ) zu arbeiten, dann wird auf das mit der App mitgelieferte Verzeichnis `samples/` zurückgegriffen.

**Generierter ASM (keine Adressüberschreibung):**
```
    ; .include "library.json" — 12 block(s)
    ... (expanded blocks follow)
```

**Generiertes ASM (mit Ladeadresse `C000`):**
```
    ; .include "library.json" @ $C000 — 12 block(s)
    *=$C000
    ... (expanded blocks follow)
```

> Tipp: Verwenden Sie INCLUDE, um wiederverwendbare Unterprogrammbibliotheken zu erstellen, die Sie projektübergreifend nutzen können. `.inc`/`.asm`/`.s`-Dateien eignen sich am besten, wenn Sie die Bibliothek in einem einfachen Texteditor bearbeiten oder mit anderen 6502-Assemblern teilen möchten; `.json`-Dateien, wenn die Bibliothek direkt in Visual Assembler erstellt wurde. Legen Sie eine Ladeadresse fest, wenn die Bibliothek keine eigene ORG-Variable besitzt oder wenn Sie deren Standardplatzierung überschreiben möchten.

---

### TABLE

Wie **DIM an einer bestimmten Adresse** – benennt eine Nachschlagetabelle und legt deren Speicherort fest. Platzieren Sie im Anschluss BYTE-, WORD- oder FILL-Blöcke, um den Inhalt der Tabelle zu definieren.

| Feld    | Beschreibung                                              |
| ------- | --------------------------------------------------------- |
| Name    | Bezeichnung für die Tabelle (z. B. `color_table`)         |
| Adresse | Feste Adresse, an der die Tabelle beginnt (z. B. `$C000`) |

**Expertensyntax:**
```
.table color_table, $C000
```

**Generiertes ASM:**
```
color_table:
```

The program counter jumps to the specified address. Place BYTE/WORD/FILL blocks after TABLE to fill the content.

**Größe:** 0 Bytes.

---

### ORG

Legt fest, wo im Speicher das Programm (oder ein Teil davon) abgelegt wird – vergleichbar mit der Wahl einer Startadresse vor der Eingabe von Maschinencode. Jedes Programm benötigt mindestens eine ORG-Adresse. Die standardmäßige, in C64 BASIC ladbare Startadresse ist `$0801`.

| Feld      | Beschreibung                                                              |
| --------- | ------------------------------------------------------------------------- |
| Adresse   | Die neue Ursprungsadresse (z. B. `0801` in HEX oder `2049` in DEC)        |
| HEX / DEC | Umschaltt die Adresseingabe zwischen hexadezimaler und dezimaler Anzeige. |

**Expertensyntax:**
```
* = $C000
```

**Generiertes ASM:**
```
* = $C000
```

**Größe:** 0 Bytes. Der ORG-Block selbst generiert keinen Maschinencode.

Jeder ORG-Block leitet einen neuen Abschnitt ein. Die nachfolgenden Blöcke werden ab dieser Adresse zusammengesetzt. Beim Exportieren der PRG-Datei werden alle Abschnitte zu einer einzigen Datei zusammengeführt – Lücken zwischen den Abschnitten werden mit Nullen aufgefüllt.

**Beispiel — Code unter `$0801`, Datentabelle unter `$C000`:**
```
* = $0801
    LDX #$00
loop:
    LDA $C000,X
    STA $D800,X
    INX
    BNE loop
    RTS

* = $C000
    .byte $01, $02, $03, ...
```

> **Tipp:** Jedes Programm muss mit einem ORG-Block beginnen. Die typische Startadresse für ein in C64 BASIC ladbares Programm ist `$0801` (2049 dezimal). Wenn **BASIC SYS stub** aktiviert ist, fügt der Assembler eine kurze BASIC-Zeile an der Adresse `$0801` hinzu, und Ihr Code beginnt an der Adresse `$080D`.

---

### LOOP / NEXT

Wie **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** in BASIC – zählt von N bis 1 herunter und verwendet dabei das X- oder Y-Register. Fügen Sie einen LOOP-Block ein, platzieren Sie Ihre Anweisungen zwischen diesem und NEXT, und die Schleife wird automatisch die richtige Anzahl Male ausgeführt.

#### LOOP

| Feld         | Beschreibung                                                               |
| ------------ | -------------------------------------------------------------------------- |
| Registrieren | `X` oder `Y` — das Zählerregister                                          |
| Zählen       | Anzahl der Schleifendurchläufe (hexadezimal oder dezimal, z. B. `0A` = 10) |
| Etikett      | Automatisch generierte Schleifenbezeichnung (z. B. `loop0`)                |

**Expertensyntax:**
```
.loop X, 10, loop0
```

**Generiertes ASM:**
```
    LDX #$0A
loop0:
```

**Größe:** 2 Bytes (LD_ Opcode + unmittelbarer Operand).

#### NEXT

| Feld         | Beschreibung                             |
| ------------ | ---------------------------------------- |
| Registrieren | Automatisch dem LOOP-Register zugeordnet |
| Etikett      | Automatisch mit dem LOOP-Label verknüpft |

**Expertensyntax:**
```
.next loop0
```

**Generiertes ASM:**
```
    DEX
    BNE loop0
```

**Größe:** 3 Bytes (DEX + BNE + Verzweigungsoffset).

**Beispiel – 10 Bildschirmzellen löschen:**
```
    LDX #$0A
loop0:
    LDA #$20        ; space character
    STA $0400,X
    DEX
    BNE loop0
```

---

### FOR / ENDF

Wie **`FOR X=0 TO N-1 : ... : NEXT X`** in BASIC — zählt *up* von 0. Ideal, wenn Sie einen Vorwärtsindex benötigen, z. B. zum Durchlaufen einer Zeichenkette oder eines Arrays.

#### FOR

| Feld         | Beschreibung                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| Registrieren | `X` oder `Y` — das Zählerregister                                                                        |
| Zählen       | Schleifengrenze (hexadezimal oder dezimal, z. B. `$12` = 18). X/Y läuft von 0 bis zur Schleifengrenze-1. |
| Etikett      | Automatisch generierte Schleifenbezeichnung (z. B. `for0`)                                               |

**Expertensyntax:**
```
.for X, $12, for0
```

**Generiertes ASM:**
```
    LDX #$00
for0:
```

**Größe:** 2 Bytes (LD_ Opcode + `#$00`).

#### ENDF

| Feld         | Beschreibung                                 |
| ------------ | -------------------------------------------- |
| Registrieren | Automatisch mit dem FOR-Register abgeglichen |
| Etikett      | Automatisch mit dem FOR-Label verknüpft      |
| Zählen       | Automatisch aus dem gepaarten FOR kopiert    |

**Expertensyntax:**
```
.endf for0
```

**Generiertes ASM:**
```
    INX
    CPX #$12
    BNE for0
```

**Größe:** 5 Bytes (IN_ + CP_ #imm + BNE Offset).

**Beispiel — Ausgabe einer nullterminierten Zeichenkette:**
```
    LDX #$00
for0:
    LDA msg,X       ; msg = PETSCII string at fixed address
    BEQ done        ; null terminator → exit
    JSR $FFD2       ; CHROUT
    INX
    CPX #$12        ; 18 characters max
    BNE for0
done:
    RTS
```

> **LOOP vs FOR:** LOOP zählt abwärts (N→1) – gut für Verzögerungen, Füllschleifen und Pixelschleifen. FOR zählt aufwärts (0→N) – gut für den Zugriff auf Zeichenketten/Arrays. Beide können X oder Y verwenden.

---

### PUSH / PULL

Ähnlich wie ** das Speichern von Variablen vor einem GOSUB und deren Wiederherstellung danach ** – jedoch unter Verwendung des 6502-Hardware-Stacks. Wenn eine Subroutine A, X oder Y verwendet, muss sie mit PUSH und PULL umschlossen werden, damit die Register des aufrufenden Codes erhalten bleiben.

#### PUSH

Legt ein oder mehrere Register auf den Stack. Die Reihenfolge ist immer A → X → Y (das innerste zuerst).

| Feld     | Beschreibung                                                  |
| -------- | ------------------------------------------------------------- |
| Register | Beliebige Kombination: `A`, `X`, `Y`, `AX`, `AY`, `XY`, `AXY` |

**Expertensyntax:**
```
.push AXY
```

**Generierter ASM (Beispiel: `AX`):**
```
    PHA
    TXA
    PHA
```

**Größe:** 1 Byte für A (`PHA`), 2 Bytes für X oder Y (Transfer + Push).

#### PULL

Stellt Register vom Stack in umgekehrter Reihenfolge wieder her **** (Y → X → A).

| Feld     | Beschreibung                                                                    |
| -------- | ------------------------------------------------------------------------------- |
| Register | Gleiches gilt für PUSH – muss mit dem entsprechenden PUSH-Block übereinstimmen. |

**Expertensyntax:**
```
.pull AXY
```

**Generierter ASM (Beispiel: `AX`):**
```
    PLA
    TAX
    PLA
```

> **Regel:** PUSH und PULL müssen immer den ** gleichen Registersatz** verwenden. `PUSH AX` → `PULL AX` (intern wird die Wiederherstellung in umgekehrter Reihenfolge durchgeführt: zuerst X, dann A).

---

### END / RTS alias

Wie **RTS mit einem benutzerfreundlicheren Makronamen** — `.end` gibt ein einzelnes `RTS` Byte aus und verhält sich im Expertenmodus wie ein kurzer Unterprogrammterminator.

**Expertensyntax:**
```
.end
```

**Generiertes ASM:**
```
    RTS
```

**Größe:** 1 Byte.

Verwenden Sie diese Option, wenn Sie eine Unterprogramm-Endmarkierung benötigen, die eher einem Makro als einer einfachen Anweisung ähnelt.

---

### MACRO / ENDM / INVOKE

Wie **a named GOSUB with parameters** – definieren Sie einen wiederverwendbaren Codeabschnitt einmal (MACRO…ENDM) und rufen Sie ihn dann überall mit INVOKE auf. Übergeben Sie jedes Mal unterschiedliche Argumentwerte, anstatt Codeblöcke zu kopieren und einzufügen.

#### MACRO (definition start)

| Feld      | Beschreibung                                                                         |
| --------- | ------------------------------------------------------------------------------------ |
| Name      | Kennung für das Makro (z. B. `setColor`)                                             |
| Parameter | Optionale, durch Kommas getrennte Parameternamen (z. B. `color` oder `color, count`) |

Markiert den Beginn einer Makrodefinition. Die Blöcke zwischen MACRO und ENDM bilden den Makrokörper – sie generieren **keinen Code** an der Stelle der Definition. Verwenden Sie `{paramName}` als Platzhalter für Argumente.

**Generiertes ASM:**
```
; .MACRO setColor (color)
    ... (body blocks)
; .ENDM
```

**Syntax im Expertenmodus:**
```
.macro setColor color
    LDA {color}
    STA $D020
.endm
```

#### ENDM (definition end)

Schließt die aktuelle Makrodefinition. Keine Felder.

#### INVOKE

Ruft an dieser Position ein definiertes Makro auf und ersetzt die Platzhalter `{paramName}` im Makrokörper durch die angegebenen Argumentwerte.

| Feld      | Beschreibung                                                                                        |
| --------- | --------------------------------------------------------------------------------------------------- |
| Makroname | Wählen Sie aus der Dropdown-Liste der definierten Makros aus.                                       |
| Argumente | Durch Kommas getrennte Argumentwerte, die der Parameterliste des Makros entsprechen (z. B. `#$07`). |

**Generiertes ASM:**
```
; .invoke setColor(#$07)
    LDA #$07
    STA $D020
```

**Syntax im Expertenmodus:**
```
; single argument:
.invoke setColor(#$07)

; multiple arguments:
.invoke drawPixel($10, $20)

; no arguments:
.invoke clearScreen

; text / string arguments (quoted):
.invoke printText("Hello, World!")

; .call alias (synonym for .invoke):
.call setColor(#$07)
```

Der Makrokörper wird inline expandiert, wobei `{paramName}` durch die tatsächlichen Argumente ersetzt wird. Die durch Leerzeichen getrennte Form (`.invoke setColor #$07`) wird ebenfalls akzeptiert.

**Argumenttypen:**
- **Numerisch**: `#$07`, `$10`, `255` — Hexadezimal- oder Dezimalwerte
- **Textzeichenfolgen**: `"Hallo Welt!"` — Zeichenketten in Anführungszeichen; Kommas innerhalb von Anführungszeichen werden als Teil des Textes und nicht als Argumenttrennzeichen behandelt.
- **Gemischt**: `#$07, "Hallo", $20` — beliebige Kombination

> **Tip:** Define macros at the top (or bottom) of your program, then INVOKE them wherever needed. Macros can be invoked multiple times with different arguments.

---

### REGION / ENDREGION

Rein visuelle Gruppierung – **Null Bytes**, keine Auswirkung auf den kompilierten Code. Vergleichbar mit dem Zusammenklappen eines Abschnitts eines BASIC-Programms in einen benannten Block, um ihn ausblenden und sich auf etwas anderes konzentrieren zu können.

| Feld        | Beschreibung                                                                      |
| ----------- | --------------------------------------------------------------------------------- |
| Regionsname | Freitextbezeichnung für den Abschnitt (z. B. `init`, `game_loop`, `sprite_setup`) |

**Expertensyntax:**
```
.region init
    ; blocks...
.endregion
```

**Steuerelemente im REGION-Blockheader (immer sichtbar):**
- **▸ / ▾ toggle** — blendet die gesamte Region ein oder aus. Im eingeklappten Zustand sind alle Blöcke zwischen REGION und ENDREGION ausgeblendet.
- **↕ Expand all** — hebt alle einzelnen zusammengeklappten Blöcke innerhalb der Region auf und erweitert bei Bedarf die Region selbst.
- **⦵ In ASM auswählen** — markiert den gesamten Codebereich der Region in der ASM-Ansicht (von `; ===[ Name ]===` bis `; ===[/Name]===`) und scrollt dorthin. Wechselt automatisch zum ASM-Tab, falls dieser nicht sichtbar ist.
- **⧉ Region kopieren** – kopiert den REGION-Block, alle untergeordneten Blöcke und den zugehörigen ENDREGION-Block in die Zwischenablage. Ein blinkendes ✓ bestätigt den Kopiervorgang.
- **⎘ Region einfügen** — fügt die kopierte Region als neue Region direkt nach dem ENDREGION der aktuellen Region ein und scrollt dorthin. Die Schaltfläche ist ausgegraut, bis eine Region kopiert wurde.

**Generiertes ASM:**
```
; region init
    SEI
    LDA #$00
    STA $D020
; endregion init
```

**Größe:** 0 Bytes für REGION und ENDREGION.

**Beispielhafter Arbeitsablauf:**
1. Füge einen `REGION`-Block hinzu und setze den Regionsnamen auf `init`.
2. Fügen Sie Ihre Initialisierungsanweisungen darunter ein.
3. Fügen Sie einen `ENDREGION`-Block hinzu, um den Abschnitt zu schließen.
4. Klicken Sie auf ▸ auf die REGION, um den gesamten Abschnitt in eine Zeile zusammenzuklappen, während Sie an anderen Teilen des Programms arbeiten.

> **Hinweis:** Regionen können **ineinander verschachtelt werden.** Jede ENDREGION schließt die nächstgelegene offene REGION. Dies hat keine Auswirkung auf die Ausgabe.

---

### DEFINE / IF / ELSE / ENDIF

Wie ein vom Assembler gelesener Schalter ** – **DEFINE DEBUG` aktiviert ein Symbol, woraufhin ein beliebiger `IF DEBUG`-Block eingefügt und dessen `ELSE`-Zweig übersprungen wird. Entfernt man den DEFINE-Block, verschwindet der IF-Block aus der Ausgabe. Für Release-Builds ist kein Code-Löschen erforderlich.

#### DEFINE

| Feld   | Beschreibung                                                                                         |
| ------ | ---------------------------------------------------------------------------------------------------- |
| Symbol | Ein oder mehrere durch Kommas getrennte Bezeichner zur Aktivierung (z. B. `DEBUG` oder `DEBUG, PAL`) |

**Expertensyntax:**
```
.define DEBUG, PAL
```

**Generiertes ASM:**
```
; .DEFINE DEBUG
; .DEFINE DEBUG, PAL
```

Ein `DEFINE`-Block kann mehrere Symbole gleichzeitig aktivieren (durch Komma getrennt). Platzieren Sie DEFINE-Blöcke am Anfang Ihres Programms. Wenn Sie den Block entfernen, werden alle darin enthaltenen Symbole sofort deaktiviert.

#### IF

| Feld    | Beschreibung                                                                              |
| ------- | ----------------------------------------------------------------------------------------- |
| Zustand | Zu testender Bezeichner (muss mit einem `DEFINE`-Symbol übereinstimmen, um aktiv zu sein) |

**Expertensyntax:**
```
.if DEBUG
```

**Generiertes ASM:**
```
; .IF DEBUG
```

Blöcke zwischen `IF` und `ENDIF` (oder `ELSE`) werden je nachdem, ob das Bedingungssymbol ein entsprechendes `DEFINE` im Programm hat, ein- oder übersprungen. Übersprungene Blöcke erscheinen als `; [IF übersprungen] …`-Kommentare und erzeugen **Nullbytes**.

#### ELSE

Keine Felder. Markiert den alternativen Zweig – wird zusammengesetzt, wenn die Bedingung `IF` nicht *aktiv ist.

**Expertensyntax:**
```
.else
```

**Generiertes ASM:**
```
; .ELSE
```

#### ENDIF

Keine Felder. Schließt den Bedingungsblock.

**Expertensyntax:**
```
.endif
```

**Generiertes ASM:**
```
; .ENDIF
```

**Größe:** 0 Bytes für alle vier Blöcke. Nur der Inhalt *zwischen* zählt.

**Beispiel – Debug-Randblitz, Release-Build überspringt ihn:**
```
; .DEFINE DEBUG

; .IF DEBUG
    LDA #$02        ; red border
    STA $D020
; .ELSE
    LDA #$00        ; black (release)
    STA $D020
; .ENDIF
```

**Beispiel — mehrere Symbole in einem DEFINE-Block:**
```
; .DEFINE DEBUG, PAL

; .IF PAL
    LDA #$xx        ; PAL timing constant
; .ELSE
    LDA #$xx        ; NTSC timing constant
; .ENDIF
```

Verschachtelte `IF`-Blöcke werden unterstützt. Wird ein äußerer Block übersprungen, werden auch die inneren Blöcke übersprungen.

> **Hinweis:** Dies ist die Behandlung von Bedingungen zur Kompilierzeit. Informationen zu Vergleichs- und Verzweigungsfunktionen zur Laufzeit finden Sie unter **Laufzeit-IF / ELSE / ENDIF** weiter unten.

### .ASSERT

*(Neu in 2.3.9.)* Eine **Kompilierzeit-Integritätsprüfung**. `.assert` wertet einen Ausdruck während der Assemblierung aus; ist das Ergebnis falsch (`0`), wird der Build mit einer eindeutigen Fehlermeldung, die den tatsächlichen Wert enthält, abgebrochen. Ist das Ergebnis wahr (ungleich null), wird keine Ausgabe erzeugt.

| Feld      | Beschreibung                                                                                                                                    |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Ausdruck  | Beliebige Assembler-Ausdrücke: Labels, `CONST`s, `*` (Programmzähler), Arithmetik und Vergleiche (`&lt;`, `&lt;=`, `&gt;`, `&gt;=`, `==`, `!=`) |
| Nachricht | Optionaler Text, der an die Fehlermeldung angehängt wird                                                                                        |

**Expertensyntax:**
```
.assert spriteData < $C000
.assert * < $A000
.assert end - start <= 256, "sprite table overflowed one page"
```

**Verhalten:**

- **Größe:** 0 Bytes.
- Eine falsche Assertion führt zum Abbruch der Assemblierung: `` `.assert end - start &lt;= 256` ist falsch (Wert: 0). Die Sprite-Tabelle hat einen Seitenüberlauf. ``
- Eine Assertion, die nicht ausgewertet werden kann (undefinierte Bezeichnung usw.), schlägt ebenfalls fehl, mit *"kann zur Assemblierungszeit nicht ausgewertet werden"*.
- Vergleiche ergeben `1` / `0`; platzieren Sie `.assert` an beliebiger Stelle im Programmablauf – es wird an der Adresse geprüft, an der es sich befindet, so dass `.assert * &lt; $D000` die aktuelle Ausgabeposition prüft.

**Beispiel — Schützen Sie einen Sprite-Block vor einem Seitenübergang:**
```
* = $3000
sprite_data:
    .byte $00, $00, $00        ; … 63 bytes …
sprite_data_end:
    .assert sprite_data_end - sprite_data == 63, "sprite must be exactly 63 bytes"
    .assert (sprite_data % 64) == 0, "sprite must be 64-byte aligned"
```

---

### CONST

Wie **eine benannte Variable, die sich nie ändert** — `SCREEN = $0400`. Verwenden Sie den Namen, anstatt überall Rohadressen einzugeben. Dadurch wird der Code lesbarer und lässt sich später leichter ändern.

| Feld   | Beschreibung                                                                                                                  |
| ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Name   | Kennung für die Konstante (z. B. `SCREEN`)                                                                                    |
| Wert   | Numerischer Wert in der ausgewählten Basis (z. B. `0400` in HEX = Adresse $0400) oder ein PC-relativer Ausdruck (siehe unten) |
| Format | HEX oder DEC – steuert, wie der Wert eingegeben und angezeigt wird                                                            |

**Expertensyntax:**
```
.const SCREEN = $0400
.const FRAMES_1S = 60
```

**Generiertes ASM:**
```
; .CONST SCREEN = $0400
```

Der Konstantenname erscheint in der **Labelauswahl**-Dropdown-Liste auf Anweisungsblöcken – einfach anklicken, um ihn einzufügen.

**PC-relative Ausdrücke (`*+N` / `*-N`):**

Das Wertfeld akzeptiert auch `*+N` oder `*-N`, wobei `*` die Kompilieradresse des CONST-Blocks selbst ist. Dies wird verwendet, um einen benannten Alias für ein Byte innerhalb einer benachbarten Anweisung zu erstellen – das klassische Muster des selbstmodifizierenden Codes:

```
CONST op = *+1      ; op → address of the immediate operand of the next LDA
LDA #$00            ; $00 will be patched at runtime
...
STA op              ; overwrites the #$00 byte → LDA reads the new value next time
```

Die CONST-Anweisung gibt 0 Bytes aus; die Marke wird zur Kompilierzeit zu `current_address + 1` aufgelöst.

**Arithmetische Ausdrücke:**

Das Wertfeld akzeptiert allgemeine Arithmetik, einschließlich Verweise auf zuvor definierte CONST-Namen, Hex-/Binärliterale und eingebaute mathematische Funktionen:

```
.const SCREEN      = $0400
.const SCREEN_END  = SCREEN + 40*25   ; 1000 bytes later
.const COLOR_RAM   = $D800
.const MID_X       = 160
.const SIN_TABLE   = round(sin(PI/8) * 127)   ; pre-computed sine value
```

**Eingebaute Funktionen:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`, `abs()`, constant `PI`

Operatoren: `+ - * /` Literale: `$FF` (hex), `%10110000` (binär) Niedrigstes/höchstes Byte: `lo(expr)`, `hi(expr)`

**Größe:** 0 Bytes.

---

### VAR

Wie **CONST, aber automatisch allokiert** – `VAR` reserviert Nullseitenspeicher für eine Bezeichnung, ohne dass Sie die Adresse eingeben müssen. Verwenden Sie es für Zähler, Zeiger und kurzlebige Zustände, die in die Nullseiten gehören.

| Feld             | Beschreibung                                                          |
| ---------------- | --------------------------------------------------------------------- |
| Name             | Variablenname / Bezeichnung                                           |
| Größe (optional) | Anzahl der zu reservierenden Bytes. Für ein einzelnes Byte weglassen. |

**Expertensyntax:**
```
.var counter
.var timer, 2
.var lives
```

**Praktisches Beispiel:**
```
.region Vars
.var counter
.var timer, 2
.endregion

LDA #$00
STA counter
```

**Generiertes ASM:**
```
; .var counter
```

**Größe:** Standardmäßig 1 Byte, oder `N` Bytes, wenn die Größe angegeben wird.

Der Speicherallokator durchläuft einen konfigurierbaren Nullseiten-Cursor (`$02` bis `$FE`) und weist den nächsten freien Speicherplatz zu. Falls der angeforderte Bereich eine bereits verwendete Marke überschneidet, gibt der Compiler eine Warnung aus.

---

### Runtime IF / ELSE / ENDIF

Wie **eine echte Verzweigungsvorlage** – diese Version arbeitet zur Laufzeit, nicht zur Kompilierzeit. Sie vergleicht `A`, `X` oder `Y` mit einem unmittelbaren Wert und gibt die korrekte Verzweigungssequenz `CMP` / `CPX` / `CPY` aus.

| Feld         | Beschreibung                                 |
| ------------ | -------------------------------------------- |
| Registrieren | `A`, `X` oder `Y`                            |
| Operator     | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Wert         | Sofortiger Wert im HEX- oder DEC-Format      |

**Expertensyntax:**
```
.if A == #$10
    LDA #$07
.else
    LDA #$0F
.endif
```

**Größe:** Abhängig von den gewählten Zweigen und dem Vergleichsformular.

Der Vergleich erfolgt standardmäßig vorzeichenlos. Für `&lt;=` und `&gt;` wird das Makro zur kürzesten äquivalenten Verzweigungskette für das ausgewählte Register erweitert.

---

### WHILE / ENDW

Wie **eine Laufzeitschleife mit einer Bedingung am Anfang** – der Schleifenkörper wird so lange ausgeführt, wie die Bedingung wahr bleibt.

| Feld         | Beschreibung                                 |
| ------------ | -------------------------------------------- |
| Registrieren | `A`, `X` oder `Y`                            |
| Operator     | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Wert         | Sofortiger Wert im HEX- oder DEC-Format      |

**Expertensyntax:**
```
.while A != #$00
    JSR getchar
.endw
```

**Größe:** Abhängig vom Schleifenkörper und der Vergleichsform.

Verwenden Sie `WHILE`, wenn die Schleife vor Abschluss der ersten Iteration beendet werden kann. Es ist das Laufzeit-Pendant zum zählerbasierten Hilfsprogramm `LOOP / NEXT`.

---

### REPEAT / UNTIL

Wie **eine Laufzeitschleife mit einem Test am Ende** – der Schleifenkörper wird immer mindestens einmal ausgeführt, dann entscheidet die Bedingung, ob angehalten wird.

| Feld         | Beschreibung                                 |
| ------------ | -------------------------------------------- |
| Registrieren | `A`, `X` oder `Y`                            |
| Operator     | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Wert         | Sofortiger Wert im HEX- oder DEC-Format      |

**Expertensyntax:**
```
.repeat
    JSR getchar
.until A == #$00
```

**Größe:** Abhängig vom Schleifenkörper und der Vergleichsform.

Verwenden Sie `REPEAT / UNTIL`, wenn der Funktionskörper mindestens einmal vor der Exit-Prüfung ausgeführt werden soll.

---

### MEMCPY / MEMSET

Wie **kleine Speicherroutinen, auf die Sie ständig zurückgreifen** — `MEMCPY` kopiert einen zusammenhängenden Block, `MEMSET` füllt einen Bereich mit einem Byte.

| Makro    | Felder                  |
| -------- | ----------------------- |
| `MEMCPY` | `src`, `dst`, `size`    |
| `MEMSET` | `addr`, `value`, `size` |

**Expertensyntax:**
```
.memcpy src=$C000, dst=$D000, size=$0100
.memset addr=$0400, value=#$20, size=$03E8
```

**Generiertes ASM:** Inline-Kopier-/Füllschleifen, ausgewählt, um der angeforderten Größe zu entsprechen.

Bei Größen bis zu 256 Byte wird eine kurze 8-Bit-Schleife verwendet. Größere Größen schalten automatisch auf einen 16-Bit-Zähler um.

---

### PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY / SET_BORDER / SET_BG

#### PRINT

Wie **PETSCII-Ausgabe ohne den Boilerplate-Code** – gibt eine Zeichenkette über `CHROUT` mit derselben Groß-/Kleinschreibung wie der PETSCII-Block aus. Die Option für Kleinbuchstaben wird vom PETSCII-Encoder gemeinsam genutzt, sodass der Textpfad konsistent bleibt.

**Expertensyntax:**
```
.print "HELLO"
.print "hello", lower
```

#### PRINT_CHAR

Gibt ein PETSCII-Byte anhand seines numerischen Codes aus und sendet es über `CHROUT`. Der Wert kann auch eine benannte Konstante oder ein Label sein, das zur Assemblierungszeit in ein Byte aufgelöst wird, sowohl im Block- als auch im Expertenmodus.

**Expertensyntax:**
```
.print_char 65
.print_char $41
.print_char color
```

#### PRINT_HEX

Gibt einen 8-Bit-Wert als Hexadezimaltext über den normalen KERNAL-Ausgabepfad aus.

**Expertensyntax:**
```
.print_hex A
```

#### CLEAR_SCREEN

Abkürzung für den Standard-C64-Clear-Screen-Steuerungscode.

**Expertensyntax:**
```
.clear_screen
```

#### WAIT_KEY

Wartet, bis eine Taste gedrückt wird, damit Sie die `GETIN`-Schleife nicht jedes Mal manuell ausführen müssen.

**Expertensyntax:**
```
.wait_key
```

#### DELAY

Wartet die angeforderte Anzahl an Frames mithilfe einer gemeinsamen Hilfsroutine ab. Verwenden Sie dies für kurze Pausen und Zeitlücken, wenn eine vollständige benutzerdefinierte Schleife übertrieben wäre. Die Frame-Anzahl kann eine Rohzahl oder eine benannte Konstante sein, und `.wait` ist lediglich ein Alias für `.delay`.

**Expertensyntax:**
```
.delay 29
.wait 29
.delay frames=FRAMES_1S
```

Im Blockmodus verwendet das Verzögerungsfeld eine kompakte Konstantenauswahl, wenn ein symbolischer Wert verfügbar ist, sodass Sie den Namen nicht jedes Mal manuell eingeben müssen.

#### SET_BORDER / SET_BG

Komfortable Wrapper für die Farbregister des VIC-II. Der Farbwert kann eine Rohzahl oder eine benannte Konstante sein, die einen Wert zwischen 0 und 15 annimmt. Sowohl der Block- als auch der Expertenmodus akzeptieren hier symbolische Konstantennamen.

**Expertensyntax:**
```
.set_border 6
.set_bg 0
.set_border color
.set_bg color
```

**Größe:** Jeder Helfer wird zu einer winzigen Registerschreibsequenz oder einem kurzen KERNAL-Aufruf erweitert.

Im Blockmodus verwenden diese Felder auch den Konstantenwähler, sodass der symbolische Wert sichtbar bleibt und nicht durch eine Rohzahl ersetzt wird.

---

### IRQ_SETUP

Richtet einen Raster-IRQ-Handler in einem Schritt ein. Das Makro schreibt den IRQ-Vektor, aktiviert Raster-IRQs, setzt die Leitung, deaktiviert die gemeinsamen CIA-IRQ-Quellen und kehrt mit `CLI` zur normalen Ausführung zurück.

| Feld    | Beschreibung                                                      |
| ------- | ----------------------------------------------------------------- |
| Handler | IRQ-Routinebezeichnung (z. B. `my_irq`)                           |
| Raster  | Rasterzeile in Hexadezimal- oder Dezimaldarstellung (z. B. `$FA`) |

**Expertensyntax:**
```
.irq_setup handler=my_irq, raster=$FA
```

**Größe:** Eine kleine Setup-Sequenz; die genaue Länge hängt von der ausgewählten Rasterzeile ab.

Verwenden Sie dies, wenn Sie den üblichen "SEI / Install Handler / Enable IRQ / CLI"-Code benötigen, ohne ihn über das gesamte Programm zu verteilen.

---

### RAND

Wie **ein winziger eingebauter PRNG** — gibt einen 8-Bit-Pseudozufallswert aus einem kompakten Nullseiten-Seed zurück.

| Feld  | Beschreibung                                                           |
| ----- | ---------------------------------------------------------------------- |
| Samen | Optionales Startbyte oder Label für die Nullseite (Standardwert `$FB`) |

**Expertensyntax:**
```
.rand
```

**Größe:** Eine Handvoll Bytes, abhängig vom gewählten Implementierungspfad.

Der Generator ist für Gameplay, Effektvariationen und schnelle Testdaten gedacht. Er ist bewusst klein gehalten und verzichtet auf kryptografisch ausgefeilte Sicherheitsvorkehrungen.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Erstellt einen VIC-II-Sprite in einem Block – anstatt etwa sechs POKE-Anweisungen in BASIC zu schreiben, müssen nur die Felder ausgefüllt werden. Setzt den Datenzeiger des Sprites, schaltet ihn ein, aktiviert optional den Mehrfarbenmodus und legt seine Farbe fest.

| Feld       | Beschreibung                                                                       |
| ---------- | ---------------------------------------------------------------------------------- |
| Sprite #   | Sprite-Nummer 0–7                                                                  |
| Farbe      | Farbindex 0–15 (C64-Palette)                                                       |
| Datenseite | Sprite-Datenadresse / 64 (z. B. `$21`, wenn sich die Daten unter `$0840` befinden) |
| Mehrfarbig | Schaltet das Mehrfarbenbit des Sprites um (`$D01C`)                                |

**Expertensyntax:**
```
.sprite_init 0, 7, $21
.sprite_init 0, 7, $21, multicolor
.sprite_init 0, 7, $21, mono
```

**Generiertes ASM:**
```
    LDA #$21
    STA $07F8       ; sprite pointer register ($07F8 + N)
    LDA $D015
    ORA #$01        ; set enable bit for sprite 0
    STA $D015
    LDA $D01C
    AND #$FE        ; clear multicolor bit for sprite 0
    STA $D01C
    LDA #$07
    STA $D027       ; sprite 0 colour register
```

**Größe:** 26 Bytes.

> **Sprite-Datenseite:** `Datenadresse ÷ 64`. Mit dem standardmäßigen BASIC SYS-Stub platziert `ALIGN 64` nach `JMP main` Sprite-Daten an `$0840` → Seite = `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Wie **`POKE 53248, x : POKE 53249, y`** in BASIC – legt dies die Startposition eines Sprites fest. Die Koordinaten werden zur Assemblierungszeit festgelegt, und die Felder akzeptieren Konstanten im Blockmodus; für Animationen verwenden Sie `INC`/`DEC` direkt auf dem Sprite-Register.

| Feld     | Beschreibung               |
| -------- | -------------------------- |
| Sprite # | Sprite-Nummer 0–7          |
| X        | Horizontale Position 0–319 |
| Y        | Vertikale Position 0–255   |

**Expertensyntax:**
```
.sprite_pos 0, 152, 100
```

**Generiertes ASM (Beispiel: Sprite 0, X=152, Y=100):**
```
    LDA #$98        ; X low byte
    STA $D000       ; sprite 0 X register
    LDA $D010
    AND #$FE        ; clear X MSB for sprite 0 (X ≤ 255)
    STA $D010
    LDA #$64        ; Y = 100
    STA $D001       ; sprite 0 Y register
```

Für X > 255 setzt das Makro das entsprechende Bit in `$D010`, anstatt es zu löschen.

**Größe:** 18 Bytes.

> **Hinweis:** `SPRITE_POS` bettet die X/Y-Koordinaten in den Code ein (`LDA #$xx`). Um einen Sprite zur Laufzeit zu animieren, verwenden Sie `INC $D000` / `DEC $D000` – siehe das Beispiel `sprite-macro-demo`.

---

<a id="wait_raster"></a>
### WAIT_RASTER

Wartet, bis der Elektronenstrahl des VIC-II eine bestimmte Scanzeile erreicht – ähnlich der Synchronisierung mit einem Fernsehbild. Platzieren Sie dies am Anfang Ihrer Spielschleife, um Sprite-Tearing zu verhindern. Kein JSR, keine Beschriftung erforderlich.

| Feld        | Beschreibung                                                        |
| ----------- | ------------------------------------------------------------------- |
| Rasterlinie | Ziel-Rasterzeile in Hexadezimaldarstellung (z. B. `FF` = Zeile 255) |

**Expertensyntax:**
```
.wait_raster $FF
```

**Generiertes ASM:**
```
wait:
    LDA $D012       ; current raster line
    CMP #$FF        ; target line
    BNE wait        ; loop back (-7 bytes)
```

**Größe:** 7 Bytes (der `BNE` Offset `$F9` = −7 verweist immer zurück auf den `LDA`).

> **Tipp:** Platzieren Sie `WAIT_RASTER` am Anfang Ihrer Spielschleife, um die Synchronisierung mit der Anzeige zu gewährleisten und Sprite-Tearing zu verhindern.

---

### JOYSTICK

Wie das Auslesen von **`PEEK($DC00)`** und anschließendes Anpassen der Sprite-Position – jedoch in einem einzigen Block. Liest einen CIA-Joystick-Port und passt die X/Y-Register eines Sprites entsprechend an. Vollständig inline, kein JSR erforderlich.

| Feld     | Beschreibung                                                            |
| -------- | ----------------------------------------------------------------------- |
| Hafen    | `1` = Port 1 (`$DC01`) oder `2` = Port 2 (`$DC00`)                      |
| Sprite # | Sprite-Nummer 0–7 (steuert, welches X/Y-Registerpaar aktualisiert wird) |

**Expertensyntax:**
```
.joystick 2, 0
```

**Generiertes ASM (Port 2, Sprite 0):**
```
    LDA $DC00       ; read CIA port 2
    LSR             ; bit 0 → carry (Up)
    BCS skip_up     ; carry set = NOT pressed
    DEC $D001       ; Y−1 (move up)
skip_up:
    LSR             ; bit 1 → carry (Down)
    BCS skip_down
    INC $D001       ; Y+1 (move down)
skip_down:
    LSR             ; bit 2 → carry (Left)
    BCS skip_left
    DEC $D000       ; X−1 (move left)
skip_left:
    LSR             ; bit 3 → carry (Right)
    BCS skip_right
    INC $D000       ; X+1 (move right)
skip_right:
```

**Joystick-Bitbelegung (aktiv-LOW — Bit = 0 bedeutet gedrückt):**

| Bisschen | Richtung | CIA-Register                              |
| -------- | -------- | ----------------------------------------- |
| 0        | Hoch     | $DC00 (Port 2) / $DC01 (Port 1)           |
| 1        | Runter   |                                           |
| 2        | Links    |                                           |
| 3        | Rechts   |                                           |
| 4        | Feuer    | (wird von diesem Makro nicht verarbeitet) |

**Größe:** 27 Bytes. Der Offset `BCS` ist immer `+3` (überspringt die folgende 3-Byte-Anweisung `DEC`/`INC abs`).

> **Typische Verwendung:** Platzieren Sie es innerhalb eines `gameloop` Labels mit `WAIT_RASTER` zuerst:
> ```
> gameloop:
>     WAIT_RASTER ($FF)
>     JOYSTICK (port=2, sprite=0)
>     JMP gameloop
> ```

---

<a id="mouse"></a>
### MOUSE

Liest die proportionale Maus eines Commodore 1351 und bewegt einen Sprite. Vollständig inline ** – kein JSR oder Label erforderlich. Das Makro wählt den CIA-Port aus, wartet, bis sich die SID-Paddle-Eingaben stabilisiert haben, dekodiert dann die Delta-Bewegung mit dem Standard-1351-Treibermuster und wendet sie auf die Sprite-Register an.

| Feld      | Beschreibung                                                                             |
| --------- | ---------------------------------------------------------------------------------------- |
| Hafen     | `1` = CIA `$DC00` Bits `7:6` = `%01`; `2` = `%10`                                        |
| Sprite #  | Sprite-Nummer 0–7                                                                        |
| ZP-Byte X | Nullseitenadresse (hexadezimal) zur Speicherung des vorherigen POTX-Samples (z. B. `FD`) |
| ZP-Byte Y | Nullseitenadresse (hexadezimal) zur Speicherung des vorherigen POTY-Samples (z. B. `FE`) |

**Generierte ASM-Form (Port 1, Sprite 0, ZP `$FD`/`$FE`):**

```
    ; CIA port select + settle
    LDA $DC00
    AND #$3F
    ORA #$40
    STA $DC00
    LDX #$67
wait:
    DEX
    BNE wait

    ; X axis — standard 1351-style 7-bit delta decode
    LDA $D419
    TAY
    SEC
    SBC $FD
    AND #$7F
    LDX #$00
    CMP #$40
    BCS xneg
    LSR A
    BEQ xdone
    STY $FD
    CLC
    ADC $D000
    STA $D000
    TXA
    ADC #$00
    AND #$01
    BEQ xdone
    LDA $D010
    EOR #$01
    STA $D010
    JMP xdone
xneg:
    ORA #$C0
    CMP #$FF
    BEQ xdone
    SEC
    ROR
    DEX
    STY $FD
    CLC
    ADC $D000
    STA $D000
    TXA
    ADC #$00
    AND #$01
    BEQ xdone
    LDA $D010
    EOR #$01
    STA $D010
xdone:

    ; Y axis — same decode, then inverted before apply
    LDA $D41A
    TAX
    SEC
    SBC $FE
    AND #$7F
    CMP #$40
    BCS yneg
    LSR A
    BEQ ydone
    STX $FE
    EOR #$FF
    SEC
    ADC $D001
    STA $D001
    JMP ydone
yneg:
    ORA #$C0
    CMP #$FF
    BEQ ydone
    SEC
    ROR
    STX $FE
    EOR #$FF
    SEC
    ADC $D001
    STA $D001
ydone:
```

**Größe:** 142 Bytes.

**Syntax im Expertenmodus:**
```
.mouse port, spriteNum, zpX, zpY
; example:
.mouse 2, 0, FD, FE
```

> **Wichtig:** Initialisieren Sie vor dem ersten Aufruf die Nullseitenbytes mit den aktuellen POTX/POTY-Werten, um einen Sprung im ersten Frame zu vermeiden:
> ```
>     ; port 1: LDA $DC00 : AND #$3F : ORA #$40 : STA $DC00
>     ; port 2: LDA $DC00 : AND #$3F : ORA #$80 : STA $DC00
>     LDA $D419 : LSR A : AND #$3F : STA $FD
>     LDA $D41A : LSR A : AND #$3F : STA $FE
> ```

> **Tipp:** Fragen Sie die Maus einmal pro Frame ab — platzieren Sie `WAIT_RASTER` in der Spielschleife vor `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Wie **`PEEK($D01E)`** in BASIC – prüft die Hardware-Kollisionsregister des VIC-II und gibt an, ob ein Sprite einen anderen Sprite oder den Hintergrund berührt hat. Vollständig inline, kein JSR erforderlich.

| Feld          | Beschreibung                                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Sprite #      | Sprite-Nummer 0–7 (welches Sprite-Bit zu überprüfen ist)                                                                      |
| Kollisionstyp | `Sprite-Sprite ($D01E)` – Kollision mit einem anderen Sprite; `Sprite-Background ($D01F)` – Kollision mit Hintergrundgrafiken |

**Expertensyntax:**
```
.sprite_col 0, sprite
.sprite_col 0, background
```

**Generiertes ASM (Sprite 0, Sprite–Sprite):**
```
    LDA $D01E       ; read sprite-sprite collision register (clears it!)
    AND #$01        ; isolate bit 0 (sprite 0)
                    ; A ≠ 0 → collision occurred
```

**Größe:** 5 Bytes.

> **Wichtig:** Das Lesen von `$D01E`/`$D01F` ** löscht das Register**. Lesen Sie es einmal pro Frame und reagieren Sie sofort mit `BEQ`/`BNE`.

**Typische Verwendung:**
```
gameloop:
    WAIT_RASTER ($FF)
    JOYSTICK (port=2, sprite=0)
    SPRITE_COL (sprite=0, type=sprite-sprite)
    BEQ no_hit          ; A = 0 → no collision
    LDA #$02
    STA $D020           ; red border = hit!
    JMP gameloop
no_hit:
    LDA #$0E
    STA $D020           ; light blue border = clear
    JMP gameloop
```

> **Siehe auch:** `collision-demo` Beispiel — grüner Ball (Sprite #0) vs. rotes Kreuz (Sprite #1).

---

### LOADFILE

Wie **`LOAD "Datei",8`** in BASIC – lädt eine Datei zur Laufzeit von einer D64-Disk mithilfe der KERNAL LOAD-Routine. Verwenden Sie dies, um Daten, Musik oder zusätzlichen Code von der Diskette zu laden, während Ihr Programm läuft.

| Feld                             | Beschreibung                                                                                                                                                                                                                                   |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dateiname                        | File name on the disk (max 16 chars, auto-uppercase; characters `,`, `"`, `/`, `\`, `:`, `*`, `?`, `<`, `>`, `                                                                                                                                 |
| Gerät                            | Gerätenummer 8–30 (Standard `8`)                                                                                                                                                                                                               |
| Überschreiben-Adresse (optional) | Hexadezimale Ladeadresse (z. B. `C000`). Ist diese Adresse angegeben, wird die Datei unter dieser Adresse geladen (`sec=0`, PRG-Header wird ignoriert). Wird das Feld leer gelassen, wird der 2-Byte-PRG-Header der Datei verwendet (`sec=1`). |
| Fehlerbezeichnung (optional)     | Falls gesetzt, wird nach JSR LOAD eine `BCS`-Anweisung generiert. Falls KERNAL mit gesetztem Übertrag (Fehler) zurückkehrt, springt die Ausführung zu dieser Marke.                                                                            |

**Expertensyntax:**
```
.loadfile "DEMO-COLORS", 8
.loadfile "DEMO-COLORS", 8, $C000
.loadfile "DEMO-COLORS", 8, $C000, error_label
```

**Generierte Codestruktur:**
```
    JMP skip_filename      ; jump over the inline filename
    .byte "DEMO-COLORS"    ; filename bytes (PETSCII, 11 chars)
skip_filename:
    LDA #11                ; filename length
    LDX #<fname            ; pointer lo
    LDY #>fname            ; pointer hi
    JSR $FFBD              ; SETNAM
    LDA #1                 ; logical file #1
    LDX #8                 ; device 8
    LDY #0                 ; sec=0 (override addr) or #1 (file's own addr)
    JSR $FFBA              ; SETLFS
    LDA #0                 ; LOAD command (not VERIFY)
    JSR $FFD5              ; LOAD
    BCS fail               ; (only if error label set)
```

**Größe:** `3 + Dateinamenlänge + 9 (SETNAM) + 9 (SETLFS) + (4 bei Überschreibung) + 5 (LOAD) + (2 bei Fehlerbezeichnung)` Bytes. Mindestens 27 Bytes.

> Wichtig: Der Dateiname wird direkt nach einem JMP skip_filename im Maschinencode gespeichert. Der Dateiname auf der Festplatte muss in Großbuchstaben (PETSCII) vorliegen – entsprechend den ASCII-Großbuchstaben (A–Z). Das Makro erzwingt dies automatisch.

> **Verwenden Sie für Produktionsprogramme immer eine Fehlerbezeichnung** – wenn die Datei nicht gefunden wird, setzt KERNAL das Übertragsflag und die Ausführung springt zum nächsten Programm.

> **Siehe auch:** `loadfile-demo` Beispiel — demonstriert das Laden von `DEMO-COLORS.PRG` von einem D64 mit einem BCS-Fehlerzweig und einem visuellen Fehlerbildschirm.

---

### EXODECRUNCH

In-Program **Exomizer-Dekomprimierung**. Verwenden Sie dieses Makro direkt nach einem `LOADFILE`, das einen im Exomizer-Modus `mem` komprimierten Datenstrom geladen hat – EXODECRUNCH entpackt ihn rückwärts in die im Datenstrom eingebettete Adresse.

| Feld                   | Beschreibung                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| Adresse des Entpackers | Speicherort des Entpackungscodes (Standard: `B000`). Es muss sich um eine 16-Bit-Hexadezimaladresse handeln. |

**Expertensyntax:**
```
.exodecrunch
.exodecrunch depacker=$B000
```

**Generierter Code (19 Bytes):**
```
    LDA $AE           ; KERNAL load-end lo (set by previous LOAD)
    STA $04           ; depacker src-end pointer lo
    LDA $AF           ; KERNAL load-end hi
    STA $05           ; depacker src-end pointer hi
    LDA #$36          ; BASIC ROM off ($A000-$BFFF becomes RAM)
    STA $01
    JSR depacker      ; depacker reads back-to-front via $04/$05
    LDA #$37          ; restore default mapping (BASIC + KERNAL + I/O)
    STA $01
```

**So funktioniert es:**

1. KERNAL `LOAD` ($FFD5) aktualisiert ZP `$AE/$AF`, sodass der Zeiger eins nach dem zuletzt geladenen Byte liegt. EXODECRUNCH kopiert dies nach ZP `$04/$05`, was der offiziellen Exomizer-Konvention für das Backward-Source-End entspricht.
2. Der Depacker befindet sich üblicherweise an Adresse `$B000` (innerhalb des BASIC-ROM-Bereichs). Das Makro schaltet `$01 auf $36` um, sodass die CPU während des JSR dort RAM erkennt, und stellt anschließend `$01 auf $37` wieder her.
3. Die Dekomprimierungszieladresse wird **in den komprimierten Datenstrom selbst kodiert**, wenn Sie mit `exomizer mem -l <load> file,<target> komprimieren` — der Depacker liest sie aus den ersten Bytes des Datenstroms.

**Depacker-Binärdatei:** Der vorkompilierte Backward-Depacker ist `samples/exo-decrunch.bin` (477 Bytes, ORG $B000). Es handelt sich um einen Kick-Assembler-Wrapper der offiziellen `exodecrunch.asm`, wobei `INC $D020` bei jedem Lesevorgang hinzugefügt wurde, um einen sichtbaren Border-Flash-Effekt während der Dekomprimierung zu erzeugen. Platzieren Sie die Datei mit einem `INCBIN`-Block an der Depacker-Adresse in Ihrem Programm.

**Sicherheits-Offset-Kompensation:** Der Standard-Speichermodus von Exomizer wendet einen 2-Byte-Sicherheits-Offset an – die Daten landen 2 Bytes vor dem angeforderten Ziel. Der Dialog „Über D64 ausführen“ **addiert automatisch 2 zum Zielfeld**, bevor Exomizer aufgerufen wird, sodass das sichtbare Verhalten der eingegebenen Adresse entspricht.

> **Siehe auch:** das `exo-multicolor-demo` Beispiel – vollständiges End-to-End-Beispiel: LOADFILE eine komprimierte Multicolor-Bitmap nach $C000, EXODECRUNCH entpackt sie nach $2000, dann kopiert screen → $0400 und color → $D800 und schaltet VIC-II in den Multicolor-Bitmap-Modus.

> **Integrationstest:** `cargo test --test exomizer_integration` (in `src-tauri/`) überprüft den vollständigen Komprimierungs- und Dekomprimierungsprozess auf einem 6502-Emulator mit der echten Depacker-Binärdatei. Bestehenskriterium: 10000 Bytes, Byte-gleich der Quelldatei `multi-color.bin`.

---

### REU_CHECK

Erkennt, ob eine Commodore RAM-Erweiterungseinheit (REU) angeschlossen ist – ähnlich wie die Überprüfung von `PEEK($D010)`, um festzustellen, ob Hardware vorhanden ist. Der Test erfolgt durch Schreiben und Auslesen zweier Muster in das REU-Register `$DF04`.

| Feld   | Beschreibung    |
| ------ | --------------- |
| Keiner | Keine Operanden |

**Generierter Code (34 Bytes):**
```
LDA #$55
STA $DF04
LDA $DF04
CMP #$55
BNE fail
LDA #$AA
STA $DF04
LDA $DF04
CMP #$AA
BNE fail
LDA #$00
CMP #$FF   ; Z=0 => REU present
BNE done
fail:
LDA #$FF
CMP #$FF   ; Z=1 => no REU
done:
```
> Das Makro normalisiert das Ergebnis, sodass der folgende Zweig einfach bleibt: `BNE` bedeutet REU vorhanden, `BEQ` bedeutet REU nicht vorhanden.

**Expertensyntax:**
```
.reu_check
```

**Ergebnis in Flags:**
- **Z = 0** (Ergebnis ≠ 0) → REU vorhanden → verwende `BNE`
- **Z = 1** (Ergebnis = 0) → kein REU → `BEQ` verwenden

**Keine konfigurierbaren Felder** — das Makro generiert jedes Mal denselben Code.

**Typische Verwendung:**
```assembly
REU_CHECK
BEQ no_reu        ; skip if REU not present
; ... REU code here ...
no_reu:
```

---

### REU_STASH / REU_FETCH / REU_SWAP

Der DMA-Blocktransfer zwischen C64-RAM und REU-Erweiterungsspeicher funktioniert ähnlich wie eine extrem schnelle POKE-Schleife, jedoch ohne dass die CPU arbeiten muss (der REU-Chip kopiert die Daten, während die CPU pausiert). Ein Transfer von `$1000` Bytes erfolgt praktisch instantan.

| Makro       | Richtung      | `$DF01` Befehl |
| ----------- | ------------- | -------------- |
| `REU_STASH` | C64 RAM → REU | `$90`          |
| `REU_FETCH` | REU → C64 RAM | `$91`          |
| `REU_SWAP`  | C64 RAM ↔ REU | `$92`          |

**Felder:**

| Feld        | Beschreibung                                            | Beispiel |
| ----------- | ------------------------------------------------------- | -------- |
| C64-Adresse | Quelle/Ziel im C64-RAM (hex)                            | `C000`   |
| REU-Adresse | Quelle/Ziel in REU (hex, 16-Bit)                        | `0000`   |
| REU-Bank    | REU-Speicherbank (0–7)                                  | `0`      |
| Länge       | Anzahl der zu übertragenden Bytes (hexadezimal, 16 Bit) | `1000`   |

**Expertensyntax:**
```
.reu_stash $C000, $0000, 0, $1000
.reu_fetch $C000, $0000, 0, $1000
.reu_swap $C000, $0000, 0, $1000
```

**Generierter Code (40 Bytes):**
```
LDA #c64lo    STA $DF02    ; C64 address LO
LDA #c64hi    STA $DF03    ; C64 address HI
LDA #reuLo    STA $DF04    ; REU address LO
LDA #reuHi    STA $DF05    ; REU address HI
LDA #bank     STA $DF06    ; REU bank
LDA #lenLo    STA $DF07    ; length LO
LDA #lenHi    STA $DF08    ; length HI
LDA #$00      STA $DF09    ; address control (fixed)
LDA #$00      STA $DF0A    ; interrupt mask (fixed)
LDA #cmd      STA $DF01    ; execute DMA ($90/$91/$92 = stash/fetch/swap, immediate)
```

> **Hinweis:** Befehle verwenden `$90/$91/$92` (Bit 4 gesetzt = sofortiger DMA-Modus). Das Schreiben in `$DF01` startet die Übertragung; die CPU setzt die Arbeit fort, sobald sie abgeschlossen ist.

---

### TURBO_SET

Legt die CPU-Geschwindigkeit des Ultimate-64 (U64) über das Register $D031 fest. Hat keine Auswirkung auf einen echten C64 oder andere Emulatoren.

**Felder:**

| Feld            | Beschreibung              | Reichweite                                       |
| --------------- | ------------------------- | ------------------------------------------------ |
| Geschwindigkeit | CPU-Geschwindigkeitsindex | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz             |
| Badline         | Badline-Emulation         | Aktiviert (C64-kompatibel) / Deaktiviert (Turbo) |

Das Geschwindigkeitsbyte wird wie folgt berechnet: `(speedIndex &amp; 0x0F) | (badline_disabled ? 0x80 : 0x00)`.

**Generierter Code (5 Bytes):**
```
A9 xx   LDA #speed_byte
8D 31 D0   STA $D031
```

**Syntax im Expertenmodus:**
```
.turbo_set 7,0    ; speed=7 (~10 MHz), badline enabled
.turbo_set 15,1   ; speed=15 (~48 MHz), badline disabled
```

> **Hinweis:** Dieses Makro wirkt sich nur auf U64-Hardware aus. Auf einem echten C64 oder anderen Emulatoren schreibt es in `$D031`, was Auswirkungen auf die CIA haben oder ignoriert werden kann.

---

### SUPERCPU_DETECT

Prüft, ob ein **CMD SuperCPU**-Beschleuniger installiert ist – wie `PEEK($D0B8)`, um zu sehen, ob er etwas anderes als `$FF` zurückgibt.

**Generierter Code (5 Bytes):**
```
AD B8 D0   LDA $D0B8
C9 FF      CMP #$FF
```

**Ergebnis in Flags:**
- **Z = 0** → SuperCPU vorhanden → verwende `BNE`
- **Z = 1** → SuperCPU nicht gefunden → verwende `BEQ`

**Keine konfigurierbaren Felder.**

**Expertensyntax:**
```
.supercpu_detect
```

**Typische Verwendung:**
```assembly
SUPERCPU_DETECT
BEQ no_scpu       ; skip if SuperCPU not present
; ... SuperCPU turbo code here ...
no_scpu:
```

---

### TURBO_ENABLE

Aktiviert oder deaktiviert den SuperCPU-Turbomodus **. Rufen Sie zuerst `SUPERCPU_DETECT` auf und überspringen Sie diesen Schritt, falls keine SuperCPU vorhanden ist.

| Modus        | Registrieren | Wirkung                                             |
| ------------ | ------------ | --------------------------------------------------- |
| Aktivieren   | `$D07A`      | Turbo-Modus aktivieren (bis zu 20 MHz mit SuperCPU) |
| Deaktivieren | `$D07B`      | Rückkehr zum 1-MHz-Kompatibilitätsmodus             |

**Generierter Code (5 Bytes):**
```
A9 00         LDA #$00
8D 7A D0      STA $D07A    ; (or $D07B for disable)
```

**Syntax im Expertenmodus:**
```
.turbo_enable on
.turbo_enable off
```

> **Hinweis:** Rufen Sie zuerst `SUPERCPU_DETECT` auf und verzweigen Sie um dieses Makro herum, wenn die SuperCPU nicht vorhanden ist.

---

<a id="map_copy"></a>
### MAP_COPY

Kopiert eine Tilemap von einer Quelladresse in den Bildschirmspeicher (und optional in den Farbspeicher) mithilfe einer Reihe von `LDA abs,X` / `STA abs,X`-Schleifen. Pro Schleifendurchlauf wird eine 256 Byte große Seite kopiert; eine Teilseite am Ende wird mit `CPX #rem / BNE` abgebrochen. Es wird kein JSR benötigt – der gesamte Code wird inline generiert.

| Feld                      | Beschreibung                                                                                                                                                                            |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Quelladresse (Bildschirm) | Hexadezimaladresse, unter der die Kartendaten nach dem Laden gespeichert werden (z. B. `C000`)                                                                                          |
| Bildschirm RAM Ziel       | Wohin die Bildschirmcodes kopiert werden sollen (z. B. `0400`)                                                                                                                          |
| Größe (Bytes)             | Gesamtzahl der zu kopierenden Bytes — typischerweise `$03E8` = 1000 (40×25 Zeichen)                                                                                                     |
| Kombinierte .bin-Datei    | Bei Überprüfung werden Bildschirmcodes erwartet, gefolgt von Farbdaten an der Adresse `source + size`. Die Farbdaten werden in einem zweiten Durchlauf nach **Color RAM dest** kopiert. |
| Farb-RAM-Ziel             | Ziel für Farbdaten — Standard `D800` (C64 Farb-RAM)                                                                                                                                     |

**Generiertes ASM (1000-Byte-Map, nur Bildschirm):**
```
    LDX #$00
    LDA $C000,X   ; page 0
    STA $0400,X
    INX
    BNE *-9       ; loops until X wraps to 0 (256 iters)
    LDA $C100,X   ; page 1
    STA $0500,X
    INX
    BNE *-9
    LDA $C200,X   ; page 2
    STA $0600,X
    INX
    BNE *-9
    LDA $C300,X   ; remainder — 232 bytes
    STA $0700,X
    INX
    CPX #$E8
    BNE *-11
```

**Größe:** `2 (LDX) + volleSeiten×9 + (rem &gt; 0 ? 11 : 0)` Bytes pro Abschnitt. Im kombinierten Modus verdoppelt sich die Größe (Bildschirmabschnitt + identischer Farbabschnitt).

**Kopplung mit dem Karteneditor:**

Der Karteneditor exportiert über **Dateien → Karte + Farb-RAM speichern (.bin)** eine einzelne Binärdatei, deren erste `size` Bytes Bildschirmcodes und deren nächste `size` Bytes Farb-RAM-Werte enthalten. Verwenden Sie MAP_COPY mit aktiviertem **Kombinierte .bin** und geben Sie **Quelladresse** den Speicherort an, an dem diese Datei geladen wird (z. B. über INCBIN in `$C000`).

```
* = $C000
    INCBIN "map-color.bin" @ $C000   ; screen codes $C000–$C3E7, color $C3E8–$C7CF
* = $0801
    ; ...
    MAP_COPY src=$C000 dst=$0400 size=1000 combined color_dst=$D800
```

**Syntax im Expertenmodus:**
```
.map_copy $C000, $0400, 1000               ; screen only
.map_copy $C000, $0400, 1000, auto, $D800  ; combined (color at src+size)
.map_copy $C000, $0400, 1000, $C3E8, $D800 ; explicit color source address
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Kopiert einen 16×16-Zeichenbereich aus einem kompakten 256-Byte-Bildschirmcodeblock und einem zugehörigen 256-Byte-Farb-RAM-Block. Es ist für Charset-Canvas-Exporte und kleine Kachel-/Bildabschnitte vorgesehen, bei denen das Schreiben von sechzehn separaten MAP_COPY-Zeilen zu unübersichtlich wäre.

**Standardlayout:**

| Daten                 | Standardadresse        |
| --------------------- | ---------------------- |
| 16×16 Bildschirmcodes | Quelladresse (`src`)   |
| 16×16 Farbwerte       | `src + 256`            |
| Bildschirm-RAM-Ziel   | `$0400 + row×40 + col` |
| Farb-RAM-Ziel         | `$D800 + row×40 + col` |

**Syntax im Expertenmodus:**
```
.map_copy16x16 $3000, 12, 4
.map_copy16x16 $3000, 12, 4, $0400, $3100, $D800
```

Die Kurzform kopiert Bildschirmbytes von `$3000`, Farbbytes von `$3100` und platziert den 16×16-Block in Spalte 12, Zeile 4. Gültige Positionen oben links sind `col = 0..24` und `row = 0..9`, sodass der gesamte 16×16-Bereich auf dem 40×25 C64-Textbildschirm erhalten bleibt.

**Generiertes Verhalten:**

- Erzeugt sechzehn Inline-Zeilenkopien.
- Jede Zeile kopiert 16 Bildschirmbytes und 16 Farbbytes.
- Es wird kein JSR benötigt; der Code wird direkt an der Makroposition ausgegeben.
- Funktioniert sowohl im normalen Zeichenmodus als auch im Mehrfarben-Zeichenmodus; die Farb-RAM-Bytes enthalten das Zeichenfarb-/Mehrfarben-Aktivierungsbit jeder Zelle.

Typische Kombination mit Charset Canvas:

```
* = $0801
    SEI
    LDA #$00
    STA $D021
    LDA #$05
    STA $D022
    LDA #$0D
    STA $D023
    .map_copy16x16 $3000, 12, 4
loop:
    JMP loop

.incbin "16x16+ram+color.bin", $3000
.incbin "16x16+charset.bin", $2000
```

---

<a id="sprite_anim"></a>
### SPRITE_ANIM

Bei jedem Aufruf wird der Animationsframe eines Sprites erhöht und der Datenzeiger des VIC-II-Sprites aktualisiert. Pro Frame wird ein Byte in einer Tabelle gespeichert (Sprite-Datenseitennummer = `Datenadresse / 64`), SPRITE_ANIM wird darauf verwiesen und die Funktion einmal pro Spielframe aufgerufen – JSR ist nicht erforderlich.

| Feld                | Beschreibung                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| Sprite #            | Sprite-Nummer 0–7                                                                                |
| Frame-Listenadresse | Hex-Adresse der Frame-Tabelle — ein Byte pro Frame, jedes Byte = Sprite-Seite (`data_addr / 64`) |
| Frame-Anzahl        | Gesamtzahl der Einzelbilder (1–255)                                                              |
| Rahmen ZP           | Null-Seitenbyte, das als Frame-Zähler verwendet wird (z. B. `FB`).                               |

**Generiertes ASM (Sprite 0, 4 Frames, ZP `$FB`, Liste bei `$C100`):**
```
    INC $FB         ; advance frame counter
    LDA $FB
    CMP #$04        ; frame count
    BCC *+6         ; if counter < count, skip reset
    LDA #$00
    STA $FB
    TAX             ; X = current frame index
    LDA $C100,X     ; load sprite data page for this frame
    STA $07F8       ; update sprite 0 pointer ($07F8 + sprite#)
```

**Größe:** 19 Bytes.

**Typische Verwendung:**
```
frameTable:
    .byte $21, $22, $23, $24   ; 4 frames at $0840, $0880, $08C0, $0900

gameloop:
    WAIT_RASTER ($FF)
    SPRITE_ANIM (sprite=0, list=$C100, count=4, zp=$FB)
    JMP gameloop
```

**Syntax im Expertenmodus:**
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; example:
.sprite_anim 0, C100, 4, FB
```

> **Tipp:** Platzieren Sie die Frame-Tabelle als RAWBYTES-Block an einer festen Adresse. Das Zähler-ZP-Byte (`$FB`) muss vor dem ersten Aufruf auf `$00` initialisiert werden. Falls Ihr Code `$FB` anderweitig verwendet, wählen Sie eine freie ZP-Adresse.

---

<a id="score_bcd"></a>
### SCORE_BCD

Addiert einen Festkommawert zu einem im Speicher abgelegten Mehrbyte-BCD-Wert und gibt anschließend jede Ziffer als Bildschirmcodezeichen im RAM aus. Verwendet den Dezimalmodus des 6502 (`SED`/`CLD`) für übertragssichere BCD-Arithmetik – manuelle Übertragsberechnungen sind nicht erforderlich.

| Feld              | Beschreibung                                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Score-Adresse     | Hexadezimale Adresse der BCD-Score-Bytes (z. B. `C200`). Niedrigstwertiges Byte zuerst.                                       |
| Ziffern           | Anzahl der BCD-Bytes (jedes Byte enthält zwei Ziffern: `$99` = "99"). `4` Bytes = bis zu 99999999.                            |
| Punkte hinzufügen | Dezimalwert, der pro Aufruf addiert werden soll (z. B. `100`).                                                                |
| Bildschirmadresse | Hier sollen die Ziffernbildschirmcodes eingetragen werden (z. B. `0400`). Ein Byte pro Ziffer (höchstwertiges Nibble zuerst). |

**Expertensyntax:**
```
.score_bcd $C200, 4, 100, $0400
```

**Generierter ASM-Code (4 Bytes, +100 Punkte, Bewertung bei `$C200`, Bildschirm bei `$0400`):**
```
    SED              ; enable BCD / decimal mode
    CLC
    LDA $C200        ; byte 0 (digits 1–2)
    ADC #$00         ; low byte of 100 in BCD = $00
    STA $C200
    LDA $C201        ; byte 1 (digits 3–4)
    ADC #$01         ; mid byte of 100 in BCD = $01 (carry propagates)
    STA $C201
    LDA $C202
    ADC #$00
    STA $C202
    LDA $C203
    ADC #$00
    STA $C203
    CLD              ; back to binary mode

    ; render digits
    LDX #$00
digit_loop:
    LDA $C200,X
    PHA
    LSR : LSR : LSR : LSR  ; high nibble → low nibble
    ORA #$30         ; + '0' screen code
    STA $0406,X      ; right-justified: screen_addr + (digits*2 - 2) - X*2
    PLA
    AND #$0F         ; low nibble
    ORA #$30
    STA $0407,X
    INX
    CPX #$04
    BNE digit_loop
```

**Größe:** `3 + Ziffern×8` Bytes (SED + CLC + CLD Overhead + 8 Bytes pro BCD-Byte für ADC + Anzeigeschleife).

**Syntax im Expertenmodus:**
```
.score_bcd $C200, 4, 100, $0400
```

> **Tipp:** Initialisieren Sie die Punktebytes beim Start auf `$00`. Die Punkteadresse sollte sich im Nullseitenbereich oder im absoluten RAM befinden – nicht im ROM. Die Bildschirmadresse sollte auf die erste Ziffernzelle zeigen; die Ziffern werden von links nach rechts geschrieben (das höchstwertige Byte zuerst).

> **BCD-Bereich:** `Ziffern=4` Bytes → 8 Dezimalstellen → Maximalwert 99.999.999. Jedes Byte kodiert zwei BCD-Ziffern: `$00`–`$99`.

---

## 10. Debugger-Integration

Die App unterstützt **RetroDebugger** als externen C64-Debugger. Sie empfängt Haltepunkte, Symbole und Autostart-Flags, die vom assemblierten Programm generiert werden.

### RetroDebugger

[RetroDebugger](https://github.com/slajerek/RetroDebugger) ist ein plattformübergreifender Commodore 64 Debugger mit Breakpoint-Unterstützung, Speicherinspektion und labelbasierter Disassemblierung.

**Setup:** Öffnen Sie **Einstellungen → Konfigurieren Sie die RetroDebugger-Executable** und verweisen Sie auf die `RetroDebugger`-Binärdatei.

**Starten:** Klicken Sie in der Symbolleiste auf **Debuggen (RetroDebugger)**. Die App wird:

1. Das Programm soll in einer temporären Datei `.prg` kompiliert werden.
2. Schreibe eine **breakpoints-Datei** (`breakpoints.txt`) — ein `break $ADDR` pro markiertem Block.
3. Erstellen Sie eine **symbols-Datei** (`symbols.txt`) im Vice/RetroDebugger-Labelformat (`al C:addr .name`). Alle LABEL- und CONST-Blöcke sind enthalten.
4. Schreiben Sie außerdem Sidecars im C64Debugger-Stil neben die kompilierte PRG-Datei: `.dbg`, `.sym` und `.vs`.
5. RetroDebugger starten mit:
   ```
   RetroDebugger -prg <file.prg> -breakpoints <breakpoints.txt> -symbols <symbols.txt> [flags]
   ```

### Haltepunktblöcke

Klicken Sie auf das Haltepunktsymbol (●) in einem beliebigen Anweisungsblock, um diesen als Haltepunkt zu aktivieren. Haltepunktblöcke werden rot hervorgehoben. Ihre Adressen werden bei jedem Start des Debuggers in die Haltepunktdatei geschrieben.

### Debugger-Flags (Registerkarte „Optionen“)

| Umschalten     | Flagge       | Wirkung                                                                             |
| -------------- | ------------ | ----------------------------------------------------------------------------------- |
| `-jmp` EIN     | `-jmp $ADDR` | Nach dem Laden direkt zur Startadresse des Programms springen.                      |
| `-unpause` EIN | `-unpause`   | Den Debugger beim Laden sofort wieder aktivieren.                                   |
| `-wait` ON     | `-wait <ms>` | Warten Sie `<ms>` Millisekunden, bevor Sie die Pause aufheben – 500 ms oder 1000 ms |

> Tipp: Aktivieren Sie für die meisten Programme die Befehle `-jmp` und `-unpause` für den sofortigen Autostart. Verwenden Sie `-wait 500` oder `-wait 1000`, wenn Ihr Programm IRQs oder SID-Musik einrichtet, die vor dem ersten Raster Zeit zum Initialisieren benötigen.

---

## 11. Links zur Wissensdatenbank

Schnellzugriffslinks sind in der App unter **Wissensdatenbank** verfügbar:

| Ressource             | URL                                            |
| --------------------- | ---------------------------------------------- |
| 6502 Opcodes-Referenz | http://www.6502.org/tutorials/6502opcodes.html |
| C64-Kernelfunktionen  | https://sta.c64.org/cbm64krnfunc.html          |
| C64 Speicherbelegung  | https://sta.c64.org/cbm64mem.html              |
| C64-Farbcodes         | https://sta.c64.org/cbm64col.html              |
| VIC-II Artikel        | https://www.cebix.net/VIC-Article.txt          |
| C64-Codebasis         | https://codebase.c64.org/                      |
| Der Turbo-Monteur     | https://turbo.style64.org/                     |
| RetroDebugger         | https://github.com/slajerek/RetroDebugger/     |

---

## 12. D64 Export & Run

Version 1.5.1 bietet die Möglichkeit, Ihr Programm (und zusätzliche Datendateien) in ein C64 D64 Disk-Image zu packen und es in VICE zu starten – oder das Disk-Image für die Verwendung an anderer Stelle zu exportieren.

### Split-Run-Taste

Die Schaltfläche **Ausführen** in der Symbolleiste wurde durch eine Schaltfläche **Teilen** ersetzt:

| Teil              | Aktion                                              |
| ----------------- | --------------------------------------------------- |
| **▶ Run** (Haupt) | Führt den aktuell ausgewählten Ausführungsmodus aus |
| **▾** (Pfeil)     | Öffnet die Modusauswahl                             |

**Verfügbare Betriebsmodi:**

| Modus                      | Beschreibung                                                                                                                                                                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Als PRG ausführen**      | Erstellen Sie eine temporäre `.prg`-Datei und starten Sie VICE direkt. Klassisches Vorgehen.                                                                                                                                                     |
| **Ausführung über D64**    | Erstellen Sie ein `.d64`-Disk-Image (mit c1541), fügen Sie alle konfigurierten Zusatzdateien hinzu und starten Sie VICE von der Disk. Verwenden Sie dies immer dann, wenn Ihr Programm Dateien zur Laufzeit lädt (z. B. mit dem Makro LOADFILE). |
| **Auf Hardware ausführen** | Zusammenstellen und an ein **1541 Ultimate / Ultimate 64**-Gerät über das lokale Netzwerk senden. Siehe [Abschnitt 13](#13-hardware-settings).                                                                                                   |

Der gewählte Modus wird zwischen den Sitzungen gespeichert.

### Dialogfeld „Exportieren nach D64“

Öffnen Sie die Option über das Dropdown-Menü **PRG speichern ▾** → **Exportieren nach D64**. Im Dialogfeld haben Sie folgende Möglichkeiten:

1. Legen Sie den **Disk-Namen** (max. 16 Zeichen) und den **Programmnamen** fest – dies sind die Namen, die im C64-Disk-Verzeichnis erscheinen.
2. **Zusätzliche Dateien hinzufügen** — Klicken Sie auf **+**, um eine beliebige Binärdatei auszuwählen (`.prg`, `.bin`, `.sid` usw.). Für jede zusätzliche Datei:
   - **Name** — wie es im D64-Verzeichnis erscheint (max. 16 Zeichen, automatische Großschreibung).
   - **Addr** (Ladeadresse, optional) – Falls angegeben, wird ein 2-Byte-PRG-Header vorangestellt. Leer lassen, um Rohdaten ohne Header zu schreiben.
   - **Dst** (Dekomprimierungsziel, nur mit EXO) – hier soll der Depacker die Daten auf dem C64 ablegen. Wenn EXO aktiviert ist, werden die zusätzlichen Daten mit `exomizer mem -l <Adresse> Datei,<Ziel>` komprimiert, bevor sie auf den D64 geschrieben werden. Die Sicherheits-Offset-Kompensation von +2 wird automatisch angewendet.
   - **EXO** – Kontrollkästchen, das die Rückwärtsverarbeitung im Speichermodus `mem` für diesen Eintrag aktiviert. Die Größe auf der Festplatte beträgt typischerweise 5–20 % des Originals.
3. Klicken Sie auf **Export**, um die Datei `.d64` mit dem Tool `c1541` von VICE zu generieren.

**Paarung mit EXODECRUNCH:** Wenn Sie eine Datei mit EXO=on ausliefern, sollte das Programm, das diese liest, sie an die Adresse **Addr** (sec=1, eigener PRG-Header der Datei) laden und anschließend das Makro **EXODECRUNCH** aufrufen, um sie in **Dst** zu entpacken. Das vollständige Muster finden Sie im Beispiel `exo-multicolor-demo`.

### D64-Metadaten in Projekten

Der Datenträgername, der Programmname und die Liste der zusätzlichen Dateien werden in der Projekt-JSON-Datei (unter dem Schlüssel `d64`) gespeichert. Beim Neuladen des Projekts oder eines Beispiels mit D64-Metadaten werden die zusätzlichen Daten automatisch wiederhergestellt – sie müssen nicht jedes Mal erneut hinzugefügt werden.

Das Beispiel **loadfile-demo** enthält bereits die Datei `DEMO-COLORS.PRG` als zusätzliche Datei. Wählen Sie diese aus, öffnen Sie **Run via D64** und klicken Sie auf **Run**, um den gesamten Ladevorgang zu sehen.

> **Anforderung:** Sowohl D64-Export als auch Ausführen über D64 erfordern, dass VICE (`c1541`) in [Hardware-Einstellungen](#13-hardware-settings) konfiguriert ist.

---

## 12b. CRT-Export (Magic Desk 64K-Kassette)

**Menü → Erstellen → CRT erstellen** erzeugt ein Commodore 64-Cartridge-Image (`.crt`, **Cartridge Typ 19 – Magic Desk / Domark / HES Australia**), das auf VICE, TheC64, echter Hardware via EasyFlash / Kung Fu Flash und 1541 Ultimate II+-Cartridge-Slots läuft. Es ist sowohl im **Blockmodus** als auch im **Expertenmodus** verfügbar und – seit dem aktuellen Build – auch im **UltimateBasic-Modus**.

### Was befindet sich im Warenkorb?

- **8 × 8 KB Bänke** an `$8000`, Bankumschaltung über `$DE00` (Magic Desk Konvention: die unteren 3 Bits = Bank, Bit 7 = Modul deaktivieren).
- **Bank 0** enthält einen 128-Byte-Header + Bootloader:
  - `$8000/$8002` Kalt- und Warmstartvektoren zeigen auf `$8009`.
  - `$8004–$8008` = die `CBM80`-Signatur, die vom KERNAL-Reset-Code benötigt wird.
  - `$8009–$807F` = der Loader: SEI / Stack-Initialisierung / `JSR $FDA3` (IOINIT) / `JSR $FD50` (RAMTAS) / `JSR $FD15` (RESTOR) / `JSR $FF5B` (CINT), dann eine Byte-Kopierschleife, die die Nutzdaten vom Cartridge-ROM in den RAM streamt und die Bänke wechselt, wenn `$FC` `$A0` erreicht. Am Ende kopiert es einen winzigen **Exit-Stub** nach `$0100`, deaktiviert den Cart mit `LDA #$80 : STA $DE00` und springt mit `JMP`s zum Einstiegspunkt.
- Die Nutzdaten ** beginnen bei `$8080` in Bank 0 und werden bei Bedarf in die Bänke 1–7 verteilt. Die maximale Nutzlast beträgt `8 * 8192 − 128 = 65 408 Bytes`.

### Ladeadresse und Einstiegspunkt

Build CRT verwendet niemals Exomizer (der Depacker kann nicht vom Cartridge-ROM ausgeführt werden). Es kompiliert den aktuellen Tab mit der Standard-Autostart-Pipeline und übernimmt die Ladeadresse aus dem PRG-Header und den Einstiegspunkt aus dem SYS-Ziel:

- **Block-/Expertenmodus mit BASIC SYS-Stub aktiviert:** load = `$0801`, entry = das SYS-Ziel (typischerweise `$080D` oder der Ursprung des Benutzers).
- **Block-/Expertenmodus mit deaktiviertem BASIC SYS-Stub:** Laden = Benutzerursprung (mit dem klassischen `$0801 → $C000`-Fallback), Eintrag = Ladeadresse.
- **UltimateBasic-Modus:** Laden und Starten erfolgen beide über die UB-Compiler-Map (`build.map.loadAddress`). Der UB-Autostart-Stub innerhalb der Payload wird dann genau so ausgeführt, wie es nach `LOAD "...",8,1 : RUN` von der Festplatte der Fall wäre.

Die im ASM-Output angezeigte Ursprungsadresse bleibt erhalten; der Loader kopiert einfach das flache Speicherabbild aus dem PRG in den RAM und springt zum Einstiegspunkt, sobald der Cartridge-ROM nicht mehr zugeordnet ist.

### Größenbeschränkung

Da die Nutzdaten linear gespeichert werden und `assembleProgramToPrg()` einen flachen `minAddr..maxAddr`-Puffer mit Null-aufgefüllten Lücken zurückgibt, zählt ein Programm mit weit auseinanderliegenden ORG-Segmenten (z. B. `$0801` + `$C000` + `$E000`) jedes Byte dazwischen zum Budget von 65.408 Byte. Wird dieses Limit überschritten, bricht der Build mit einem `saveCrtTooLarge`-Fehler ab – entweder muss das Speicherlayout komprimiert oder die Daten aufgeteilt werden.

> **⚠️ Wichtiger Hinweis – vor dem Versand eines CRT lesen**
> 
> Der Loader ruft im Rahmen der Standard-Reset-Sequenz den KERNAL **`RESTOR` ($FD15)** auf. Dadurch werden die Standard-I/O-Vektoren an den Adressen `$0314/$0315`, `$0316/$0317`, `$0318/$0319`, `$0328/$0329` und weitere absichtlich auf ihre ROM-Standardwerte zurückgesetzt. Folgen:
> 
> - **Alle vor dem CRT-Start gesetzten IRQ-/NMI-/BRK-Hooks werden gelöscht.** Ihr Programm muss diese nach dem Start selbst installieren – genau wie bei einem frischen `LOAD "",8,1 : RUN` von Band/Disk.
> - **UltimateBasic-Programme**, die darauf angewiesen sind, dass nicht standardmäßige KERNAL-Vektoren beim Start aktiv sind, benötigen möglicherweise einen expliziten `SYS`- oder init-Aufruf im Autostart-Stub. Der standardmäßige UB-Autostart funktioniert sofort; Erweiterungsbibliotheken, die Vektoren *before* `RUN` einbinden, tun dies nicht.
> - **CIA1 / CIA2** werden durch `IOINIT` neu initialisiert. Benutzerdefinierte Timer-Einstellungen (Raster-IRQs, Musikplayer CIA-A) müssen nach dem Aufruf neu programmiert werden.
> - Der Cart ist über einen 8-Byte-Stub im **RAM an Adresse `$0100`** deaktiviert, sodass der `STA $DE00` nicht durch einen fehlerhaften ROM-Fetch unterbrochen werden kann. Verlassen Sie sich nicht darauf, dass `$0100–$0107` beim Eintritt das Stack-Top-Image enthält – der erste RAM-Push überschreibt den Stub.
> 
> Wenn ein CRT-Programm in VICE läuft, aber auf realer Hardware fehlschlägt, sollte zunächst geprüft werden, ob das Programm beim Start einen bestimmten Kernel-Vektor oder CIA-Timer-Zustand voraussetzt. Legen Sie den Zustand explizit in Ihrer Initialisierungsroutine fest, dann verhält sich das Programm auf beiden Systemen gleich.

### Kompatibilität

| Plattform                       | Status                                                  |
| ------------------------------- | ------------------------------------------------------- |
| VICE (`x64sc`, `x64`)           | Funktioniert über **Datei → Cartridge-Image anhängen**. |
| TheC64 / TheC64 Mini            | Funktioniert über den eingebauten Patronenlader.        |
| Kung Fu Blitz                   | Funktioniert – im nativen Magic Desk-Modus.             |
| EasyFlash-Kartusche             | Funktioniert, wenn es als Magic Desk programmiert ist.  |
| 1541 Ultimate II+ / Ultimate 64 | Funktioniert über **Cartridge → Load cart image**.      |
| Chamäleon / Turbo-Chamäleon     | Funktioniert.                                           |

---

## 13. Hardwareeinstellungen

Öffnen Sie **Einstellungen → Hardwareeinstellungen…** im Menü der Symbolleiste. Hier finden Sie alle externen Hardwarepfade und die Netzwerkkonfiguration.

### VICE-Emulator

| Einstellung        | Beschreibung                                                     |
| ------------------ | ---------------------------------------------------------------- |
| **VICE auswählen** | Navigieren Sie zur ausführbaren VICE-Datei `x64sc` (oder `x64`). |
| **Status**         | Zeigt an, ob der Ausführungspfad gültig und erreichbar ist.      |

VICE wird benötigt für **Ausführen als PRG**, **Ausführen über D64** und **Export nach D64**.

### Exomizer

| Einstellung                              | Beschreibung                                                                                                                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Exomizer auswählen**                   | Navigieren Sie zur ausführbaren Datei `exomizer`.                                                                                                                                    |
| **Blitzlicht während der Dekompression** | Wenn aktiviert, verwenden SFX-komprimierte PRGs den in Exomizer integrierten schnellen Randblitz-Effekt `-x1`; wenn deaktiviert, wird `-n` für die stille Dekomprimierung übergeben. |
| **Status**                               | Zeigt an, ob der Ausführungspfad gültig und erreichbar ist.                                                                                                                          |

**Workflow:**
1. Installieren Sie die Exomizer-Binärdatei:
   - **Windows:** Laden Sie die vorkompilierte `win32/exomizer.exe` von https://bitbucket.org/magli143/exomizer/wiki/Home oder https://csdb.dk/release/?id=244342 herunter.
   - **macOS:** `brew install exomizer` (installiert Magnus Linds offiziellen Build 3.1.2).
2. Konfigurieren Sie den Pfad im Abschnitt **Hardware-Einstellungen → Exomizer**.
3. Aktivieren Sie das Kontrollkästchen **Mit Exomizer ausführen** im Menü **Einstellungen**.
4. Alle **Run**-Aktionen (PRG, D64, hardware) und **Build**-Aktionen (Build PRG, Build D64) werden nun das assemblierte Programm vor dem Start oder Speichern durch `exomizer sfx sys` verarbeiten.

Exomizer funktioniert unter Windows und macOS auf die gleiche Weise – die CLI wird vom Tauri-Backend aufgerufen; nichts an der Integration ist plattformspezifisch.

**Intern werden zwei Kompressionsmodi verwendet:**

| Modus             | Wird verwendet von                                            | Anrufungskonvention                                                                                                                                                                                        |
| ----------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sfx sys`         | Mit Exomizer-Umschaltung erstellen/ausführen (Haupt-PRG-Pfad) | Selbstextrahierendes PRG mit integriertem Decruncher; die Border-Flash-Einstellung steuert `-x1` vs `-n`                                                                                                   |
| `mem` (rückwärts) | Ausführung über D64 → Kontrollkästchen pro Datei **EXO**      | Komprimiert jede zusätzliche Datei zu einem `mem`-Modus-Stream; das Programm dekomprimiert sie zur Laufzeit über das **EXODECRUNCH**-Makro und einen vorgefertigten Depacker (`samples/exo-decrunch.bin`). |

> **Tipp:** Wenn der Exomizer-Pfad nicht konfiguriert, das Kontrollkästchen aber aktiviert ist, wird anstelle des Starts eine Fehlermeldung angezeigt. Deaktivieren Sie das Kontrollkästchen, um die Anwendung ohne Komprimierung auszuführen.

> **Integrationstest:** `cargo test --test exomizer_integration` (in `src-tauri/`) überprüft den vollständigen Mem-Mode-Komprimierungs- und Dekomprimierungs-Roundtrip auf einem 6502-Emulator.

### Retro-Debugger

| Einstellung                 | Beschreibung                                   |
| --------------------------- | ---------------------------------------------- |
| **RetroDebugger auswählen** | Navigieren Sie zur Binärdatei `RetroDebugger`. |
| **Status**                  | Zeigt an, ob der Pfad gültig ist.              |

Die vollständige Dokumentation zum Debugger finden Sie in [Abschnitt 9](#9-debugger-integration).

### C64 Ultimate / 1541 Ultimate

Führen Sie zusammengestellte PRGs direkt auf realer Hardware über das lokale Netzwerk mithilfe der Ultimate REST API aus.

| Einstellung           | Beschreibung                                                           |
| --------------------- | ---------------------------------------------------------------------- |
| **Host (IP)**         | IP-Adresse des Geräts (z. B. `192.168.1.100`)                          |
| **Passwort**          | Optional – falls das Gerät eine Authentifizierung erfordert            |
| **Verbindung testen** | Sendet eine Testanfrage an `/v3/runners/info`; zeigt OK oder Fehler an |

**Workflow:**
1. Verbinden Sie den 1541 Ultimate / Ultimate 64 mit Ihrem lokalen Netzwerk.
2. Geben Sie die IP-Adresse (und gegebenenfalls das Passwort) in den Hardwareeinstellungen ein.
3. Wählen Sie im geteilten Ausführungsmenü die Option **Auf Hardware ausführen**.
4. Klicken Sie auf **▶ Ausführen** – das PRG wird kompiliert und per HTTP POST an `/v3/runners/prg` gesendet. Das Gerät lädt es und führt es sofort auf dem C64 aus.

> **Tipp:** Kein USB-Kabel oder Treiber erforderlich – die REST-API ist in die Ultimate-Firmware integriert. Ihr Computer und das Gerät müssen sich im selben lokalen Netzwerk befinden.

---

## 14. Visuelle Editoren (Toolkit)

Das Menü **Toolkit** in der Symbolleiste gruppiert die visuellen Dateneditoren, die alle über ein gemeinsames Menü „Dateien“ (`Dateien ▾`) für „BIN laden“, „BIN speichern“, „In Blöcke exportieren“ und „Als D64 speichern“ verfügen. Jeder Editor erzeugt Rohdaten im Format `.bin`, die mit `INCBIN` in ein Programm eingebunden oder über den Eintrag **Als D64 speichern** direkt auf eine D64-Disk geschrieben werden können.

Die Dialogfelder des visuellen Editors lassen sich über ihre Kopfzeilen im gesamten Arbeitsbereich des Visual Assemblers verschieben. Ein Dialogfeld ohne gespeicherte Position wird zentriert geöffnet; nach dem Verschieben wird seine letzte Position in den UI-Einstellungen gespeichert und beim nächsten Öffnen wiederhergestellt.

### Hi-Res / Multicolor Editor

Pixelgenauer Bitmap-Editor mit 320×200-Hi-Res- und 160×200-Multicolor-Modus. Öffnen über Toolkit → Hi-Res-Editor.

| Besonderheit                  | Beschreibung                                                                                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Modusumschalter               | Mit dem Kontrollkästchen **Multicolor** kann zwischen hochauflösender Darstellung (monochrom pro Zelle) und mehrfarbiger Darstellung (4 Farben pro Zelle) umgeschaltet werden. |
| Werkzeuge                     | Bleistift, Radiergummi, Linie, Rechteck, ausgefülltes Rechteck, Oval, ausgefülltes Oval, Flächenfüllung.                                                                       |
| Sprühwerkzeug                 | Ein Malprogramm im Airbrush-Stil, das beim Zeichnen Pixel um den Cursor herum verteilt.                                                                                        |
| Sprühintensität               | Über das Dropdown-Menü neben dem Sprühwerkzeug lässt sich die Dichte jedes Sprühstoßes steuern.                                                                                |
| Farbpalette                   | Vordergrund- (Tinte) + Papier- (Hintergrund) Auswahlmöglichkeiten. Im Mehrfarbenmodus werden automatisch 3 zusätzliche Farben pro Zelle erfasst.                               |
| Rückgängig / Wiederherstellen | Verlauf pro Hub, Strg+Z / Strg+Y.                                                                                                                                              |
| Raster                        | Optionale 8×8-Raster- und Rasterzeilenüberlagerung zur Zellenausrichtung.                                                                                                      |
| Bild importieren              | PNG/JPEG/GIF-Dateien, die in die Arbeitsfläche eingefügt werden, werden automatisch auf die 16-Farben-C64-Palette quantisiert.                                                 |
| Exportblöcke                  | Fügt dem Programm BYTE/RAWBYTES-Blöcke mit den codierten Bitmap-, Bildschirm- und Farbdaten hinzu.                                                                             |
| Export `.bin`                 | Speichert das native Multicolor-Format (10000 Bytes: 8000 Bitmap + 1000 Bildschirm + 1000 Farbe) bereit für LOADFILE in $2000.                                                 |

### Sprite-Editor

Sprite-Editor (24×21 Pixel) mit Mehrbildanimation. Öffnen über Toolkit → Sprite-Editor.

| Besonderheit                  | Beschreibung                                                                                                                                                                                                                            |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rahmen                        | Rahmen hinzufügen / entfernen / neu anordnen; Rahmenleiste unten dargestellt.                                                                                                                                                           |
| Modus                         | Umschaltung zwischen einfarbig und mehrfarbig.                                                                                                                                                                                          |
| Werkzeuge                     | Stift, Füllung, Linie, Rechteck, Kreis – plus horizontal spiegeln, vertikal spiegeln, verschieben (links/rechts/oben/unten, mit optionalem Umbruch). Die Formwerkzeuge zeigen beim Ziehen eine Live-Vorschau; zum Bestätigen loslassen. |
| Rückgängig / Wiederherstellen | Vollständiger Rückgängig-/Wiederherstellen-Stapel pro Frame. Strg/Cmd+Z / Strg/Cmd+Y oder die Schaltflächen in der Symbolleiste.                                                                                                        |
| Bildimport                    | Importieren Sie eine PNG- oder JPEG-Datei über Datei → Bild importieren. Der Importer ordnet jedem Pixel die nächstgelegene Farbe der C64-Palette zu und schreibt sie in den aktuellen Frame.                                           |
| Animationsvorschau            | Wiedergabe/Stopp mit einstellbarer Geschwindigkeit.                                                                                                                                                                                     |
| Exportblöcke                  | Fügt für jeden Frame einen RAWBYTES-Block an einer 64-Byte-ausgerichteten Adresse sowie eine Sprite-Pointer-Einrichtung ein.                                                                                                            |
| Speichern `.bin`              | Schreibt 64 Bytes pro Frame (Rohdaten der Sprites ohne Auffüllung).                                                                                                                                                                     |

### C64 Character ROM Browser ("Zeichentabelle")

Nur-Lese-Viewer für das C64-Zeichen-ROM (die integrierte PETSCII-Schriftart). Öffnen über den Eintrag **C64 chargen** im Toolkit-Menü. Nützlich, um den Bildschirmcode eines Glyphen zu ermitteln, bevor dieser mit `RAWBYTES` oder `TEXT` geschrieben wird.

| Besonderheit      | Beschreibung                                                                                                                                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Zwei Zeichensätze | Registerkarte 1: **Einstellung 1 – Oben/Grafik** (Standardmodus nach dem Einschalten). Registerkarte 2: **Einstellung 2 – Unten/Oben** (nach Umschalten auf `$0E`).                                                                                    |
| Glyphenraster     | 16×16-Raster aller 256 Zeichen. Klicken Sie auf ein Glyphe, um dessen Detailansicht anzuzeigen: vergrößerte 8×8-Pixel-Ansicht, Bildschirmcode (dezimal + hexadezimal), PETSCII-Codes (sowohl Standard als auch verschoben) und die rohe 8-Byte-Bitmap. |
| Detailpanel       | Zeigt den Bildschirmcode des ausgewählten Glyphen, die PETSCII-Codes und die acht Rohbytes an – bereit zum Einfügen in einen `RAWBYTES`- oder BYTE-Block.                                                                                              |
| Nur lesbar        | Hier ist keine Bearbeitung möglich – verwenden Sie den Zeicheneditor (unten), um Glyphen zu ändern.                                                                                                                                                    |

### Zeicheneditor (Zeichensatz)

256-Zeichen-Zeichensatz-Editor (8×8). Öffnen über Toolkit → Zeicheneditor.

| Besonderheit         | Beschreibung                                                                                                                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ROM laden            | Importiert den C64 ROM-Zeichensatz direkt aus VICEs `chargen` (ohne Dateiauswahl).                                                                                                                                       |
| Lade `.bin`          | Importiert eine externe 2048-Byte-Zeichensatz-Binärdatei.                                                                                                                                                                |
| Vorschau pro Zeichen | Ein 16 Zellen breites Raster aller 256 Glyphen, wobei die aktuelle Zelle hervorgehoben ist.                                                                                                                              |
| Pixel-Editor         | 8×8 Einzelzeichen-Editor mit Umschalt-/Invertierungs-/Löschwerkzeugen.                                                                                                                                                   |
| Farbe pro Zeichen    | Speichert einen Standardwert für den Farbspeicher (Color RAM) für jedes Glyphen. Im Mehrfarbenzeichenmodus bleiben dabei auch das Mehrfarben-Aktivierungsbit pro Zelle und die eigene 3-Bit-Farbe des Zeichens erhalten. |
| Metadaten-Roundtrip  | Beim Laden kompatibler Daten aus Charset Canvas / Map-Workflows bleiben die Farbmetadaten pro Zeichen erhalten, sodass Bearbeitungen fortgesetzt werden können, ohne die Farbabsicht zu verlieren.                       |
| Exportblöcke         | Fügt RAWBYTES an der Adresse $0800 (Block 2) oder $3800 (Block 7) mit dem kodierten Zeichensatz an.                                                                                                                      |

### Zeichensatz-Leinwand-Editor

Vollflächiger Zeichensatz-Maler zum Erstellen von Bildschirmdarstellungen aus einem vollständigen 256-Zeichen-Zeichensatz. Öffnen über Toolkit → Zeichensatz-Leinwand.

Die Zeichenfläche umfasst 16×16 Zeichen. Im Monochrom-Modus ergibt sich daraus ein Arbeitsbereich von 128×128 Pixeln; im Mehrfarben-Zeichenmodus ergibt sich ein breiter Arbeitsbereich von 64×128 Pixeln unter Verwendung der Mehrfarbenregeln des C64.

| Besonderheit                            | Beschreibung                                                                                                                                                                                    |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Monochrom / mehrfarbig                  | Im Mono-Modus werden 1-Bit-Glyphen der Größe 8×8 gespeichert. Im Mehrfarbenmodus werden horizontale Pixelpaare mit zwei Bit gespeichert und verwendete Zellen mit Bit 3 des Farb-RAMs markiert. |
| C64 Farbmodell                          | Hintergrund verwendet `$D021`; gemeinsam genutzte Mehrfarben 1 verwendet `$D022`; gemeinsam genutzte Mehrfarben 2 verwendet `$D023`; die Farbe jedes Zeichens stammt aus den Farb-RAM-Bits 0–2. |
| Zeichenwerkzeuge                        | Bleistift, Radiergummi, Linie, Rechteck, Oval und Flächenfüllung arbeiten über die Zeichengrenzen hinweg.                                                                                       |
| Sprühwerkzeug                           | Eine Zeichnung im Airbrush-Stil, bei der Pixel über benachbarte Zellen/Zeichen verteilt werden.                                                                                                 |
| Sprühintensität                         | Über das Dropdown-Menü neben dem Sprühwerkzeug lässt sich die Hubdichte einstellen.                                                                                                             |
| Raster umschalten                       | Das Kontrollkästchen „Raster“ blendet das 16×16-Zeichenraster ein oder aus.                                                                                                                     |
| Zeichensatz speichern `.bin`            | Speichert die 2048 Byte großen Zeichenbitmap-Daten.                                                                                                                                             |
| 16×16 Karte speichern + Farb-RAM `.bin` | Speichert 256 Bildschirmcodes, gefolgt von 256 Farb-RAM-Werten. Verwenden Sie dies mit `MAP_COPY16X16`.                                                                                         |
| Laden                                   | Kann charset-canvas-Speicherstände, einfache charset-Daten und kompatible Character Editor-charset-Daten einschließlich gespeicherter Farben pro Zeichen laden, sofern vorhanden.               |

**Wichtige C64-Einschränkung:** Im Mehrfarben-Zeichenmodus gelten die beiden gemeinsam genutzten Farben global für den gesamten Bildschirm (`$D022` / `$D023`). Nur die Farbe des jeweiligen Zeichens ist pro Zelle verfügbar und auf die Farben 0–7 beschränkt, da Bit 3 des Farb-RAM den Mehrfarbenmodus auswählt.

### Karteneditor (Mehrschichtige Kachelkarten)

Layered Tilemap Editor für statische Szenerien, Sprite-Spawn-Maps, Kollisionsdaten und Ähnliches. Öffnen über Toolkit → Map Editor.

| Besonderheit                                | Beschreibung                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Schichten                                   | Mehrere benannte Ebenen, jede mit eigenem Tileset und eigener Deckkraft.                                                                                                                                                                                                                                       |
| Pinsel                                      | Einzelkachel-, Füll-, Linien-, Rechteck- und Kreismodus. Die Formwerkzeuge zeigen beim Ziehen eine Live-Vorschau an; zum Bestätigen loslassen.                                                                                                                                                                 |
| Rückgängig / Wiederherstellen               | Vollständige Rückgängig-/Wiederherstellen-Funktion pro Ebene. Strg/Cmd+Z / Strg/Cmd+Y oder die entsprechenden Schaltflächen in der Symbolleiste.                                                                                                                                                               |
| Menü löschen                                | Klarstellung pro Ebene oder für die gesamte Karte mit Bestätigung.                                                                                                                                                                                                                                             |
| Bildimport                                  | Ziehen Sie eine PNG-Datei einer Kachelkarte hinein; der Editor zerlegt diese automatisch in Kacheln.                                                                                                                                                                                                           |
| Kopieren / Einfügen                         | Kopieren Sie einen ausgewählten Kachelbereich und fügen Sie ihn anschließend normal ein oder verwenden Sie die transparente Einfügefunktion, um leere Kacheln transparent zu halten.                                                                                                                           |
| Mehrfarbenfähige Fliesenfärbung             | Bei Verwendung kompatibler Zeichensatz-Metadaten verwendet das Malen die im Farbspeicher der Kachel gespeicherten Standardwerte (einschließlich Mehrfarbenkodierung) anstelle einer generischen, flachen Farbe.                                                                                                |
| Benutzerdefinierte Zeichensatzfarben        | Wenn ein Zeichensatz `charColors`-Metadaten enthält, verwendet der Karteneditor beim Zeichnen den Standardwert des Farb-RAMs der ausgewählten Kachel.                                                                                                                                                          |
| Exportblöcke                                | Gibt RAWBYTES-Blöcke für Tileset-Grafiken + Kartendaten aus.                                                                                                                                                                                                                                                   |
| Bildschirmspeicher (.bin) speichern…        | Speichert nur die Bildschirmcodes für die aktuelle Kartenebene (40×25 = 1000 Bytes).                                                                                                                                                                                                                           |
| Bildschirm-RAM + Farb-RAM speichern (.bin)… | Speichert Bildschirmcodes, verkettet mit Farb-RAM-Werten, in einer einzigen 2000-Byte-Datei (`screen[0..999]` gefolgt von `color[0..999]`). Verwenden Sie diese Datei zusammen mit dem Makro **MAP_COPY** (kombinierter .bin-Modus), um Bildschirm und Farbe in einem Schritt zur Laufzeit wiederherzustellen. |

### SID-Editor (3-Stimmen-Tracker)

Multiinstrumentaler 3-stimmiger Tracker mit Web-Audio-Vorschau. Öffnen über Toolkit → SID-Editor.

**Instrumentenspezifische Steuerung:**
- Kontrollkästchen für Wellenformen (TRI / SAW / PUL / NOI) — mehrere Wellenformen können miteinander verknüpft werden.
- ADSR (Attack / Decay / Sustain / Release) wird als Drag-Diagramm über den vier Schiebereglern dargestellt.
- Impulsbreitenregler (0-4095) mit optionalen Klingel-/Synchronisationsflags.
- Filterrouting-Kontrollkästchen pro Stimme; globaler Filter-Cutoff / Resonanz / Lautstärke / Modus (LP/BP/HP).

**Tracker-Gitter:**
- 3 Stimmen × bis zu 7 Muster × 32 Zeilen = 7 × 32 = maximal 224 Zeilen (begrenzt durch einen 8-Bit-Zeilenzähler).
- Pro Zeile: Note + Instrumentenindex. Leere Zeilen enthalten die vorherige Note.
- Wählen Sie eine Zelle wie gewohnt aus oder halten Sie **Shift** gedrückt und klicken Sie mit den Pfeiltasten, um eine rechteckige Auswahl über mehrere Zeilen und eine der drei Stimmen zu erweitern. Ein Rechtsklick innerhalb des ausgewählten Bereichs erhält die Auswahl aufrecht.
- Kopieren, Ausschneiden, Einfügen und Löschen sind über die Symbolleiste und das Kontextmenü verfügbar. `Strg/Cmd+C` und `Strg/Cmd+V` wirken auf dieselbe rechteckige Auswahl.
- Harmoniehilfe: Wählen Sie Grundton, Akkordtyp und Oktave, hören Sie sich den Akkord mit dem aktuellen Instrument an und fügen Sie die Voicings direkt in den Tracker ein. Verfügbare Typen: Dur, Moll, Vermindert, Übermäßig, Sus2, Sus4, Dominantseptakkord, Durseptakkord, Mollseptakkord, Sextakkord, Mollsextakkord, None, kleine None, übermäßige None, Verminderter Septakkord und Septakkord-sus4.
- Arpeggio-Hilfe: Vorschau oder Einfügen von 4-, 8- oder 16-stufigen Notenläufen vom ausgewählten Akkord in aufwärts, abwärts oder aufwärts/abwärts gerichteter Richtung.
- **Vorschauzeile** spielt die ausgewählte Zeile in allen drei Stimmen ab, ohne die Musterwiedergabe zu starten.
- Beim Einfügen von Zellbereichen beginnt die Einfügung nun an der Startzelle des ausgewählten Bereichs und endet sauber an den Zeilen- und Bereichsgrenzen, anstatt in die nächste Spalte oder Zeile umzubrechen.
- Mit dem Geschwindigkeitsregler wird der IRQ-Tick-Teiler (Frames zwischen den Zeilen) festgelegt.

**Wiedergabe und virtuelle Tastatur:**
- Die Schaltfläche „Wiedergabe“ in der Symbolleiste ändert sich während der Wiedergabe zu „Pause“ und während der Pause zu „Fortsetzen“; „Stopp“ beendet die Wiedergabe und setzt den Status zurück.
- Die Schaltfläche in der Tastatur-Symbolleiste öffnet ein nicht-modales Piano, das auch während der Nutzung des SID-Editors verwendet werden kann. Ziehen Sie dessen Kopfzeile, um sie an einer beliebigen Stelle über der Hauptanwendung zu platzieren.
- Aktivieren Sie **In Tracker einfügen**, um jede gespielte Note an der aktuellen Tracker-Cursorposition zu speichern und zur nächsten Zeile zu wechseln. Deaktivieren Sie diese Funktion, um Noten ohne Bearbeitung anzuhören.
- Akkord- und Arpeggio-Vorschauen leuchten die entsprechenden Klaviertasten auf, wenn die Tastatur geöffnet ist.

**Dateien-Menü-Exporte:**
| Export                                   | Was es tut                                                                                                                                                                                                                                                  |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Speichern .bin…`                        | Schreibt das vom Editor bereitgestellte serialisierte Format (Instrumente + Muster + Sequenz).                                                                                                                                                              |
| `Exportblöcke (nur Daten)`               | Fügt Instrumententabelle + Musterblöcke an das Programm an der Stelle `* = $C000` an.                                                                                                                                                                       |
| `Exportblöcke + Minispieler`             | Fügt den vollständigen Player (sid_init / sid_irq / sid_play_row / sid_set_voice) sowie PAL-Frequenztabellen hinzu. Nach dem Export fügen Sie in Ihrem Hauptcode an der Stelle, an der die Musikwiedergabe starten soll, eine `JSR sid_init`-Anweisung ein. |
| `Assembler exportieren (Zwischenablage)` | Kopiert den vollständigen Assembler-Quelltext in die Zwischenablage.                                                                                                                                                                                        |

**ZP-Nutzung des Spielers: ** `$FB` (Tickzähler), `$FC` (Zeilenindex), `$FD` (set_voice temp). Diese können in Konflikt geraten, wenn sie von Ihrem Hauptcode verwendet werden – verschieben Sie sie gegebenenfalls im Expertenmodus.

**Bekannte Grenzwerte:**
- Einzelne lineare Musterliste (noch keine Sequenztabelle pro Stimme).
- Der 8-Bit-Zeilenzähler ist auf 7 Muster × 32 Zeilen begrenzt.
- C64 `$D418` Die globale Lautstärke wird über alle Stimmen hinweg geteilt – der Lautstärkeregler pro Instrument dient nur der Information; der Sustain-Pegel (`S` von ADSR) ist die effektive Lautstärke pro Stimme.
- Die Web-Audio-Vorschau ist nur annähernd korrekt: PWM-Modulation, Klingeln/Synchronisation und der Charakter des SID-Filters weichen vom realen Chip ab.

---

### Kurveneditor

Erzeugt sofort einsatzbereite `.byte`-Lookup-Tabellen aus mathematischen Kurven – Sinus, Easing, Dreieck/Sägezahn/Rechteck und Bounce. Ideal für Sprite-Bewegungen, Rastereffekte, Farbwechsel oder jede Animation, die auf einer vorab berechneten Tabelle basiert. Öffnen Sie den Kurveneditor über das Symbol **Kurveneditor** in der oberen Symbolleiste (neben der Schaltfläche „SID-Editor“).

**Kurven:** Sinus, Kosinus, Linear, Ease In/Out/InOut (Quad und Cubic), Ease In/Out (Circ), Dreieck, Sägezahn, Quadrat und Ease In/Out/InOut Bounce.

**Steuerung:**
| Kontrolle                   | Zweck                                                                                                                                                                                                             |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Start-/Endwert**          | Ausgabebereich: 0..255 im 8-Bit-Modus, 0..320 im 16-Bit-Modus.                                                                                                                                                    |
| **Anzahl der Werte**        | Tabellenlänge, 4–512 Einträge.                                                                                                                                                                                    |
| **Zyklen**                  | Wie viele Schwingungen gibt es in der Tabelle (nur Sinus-/Kosinus-/Dreiecks-/Sägezahn-/Quadratfunktionen)? Auch Brüche werden akzeptiert (z. B. `3,625`).                                                         |
| **Phase**                   | Phasenverschiebung in Grad (nur Sinus/Kosinus).                                                                                                                                                                   |
| **Kombiniere zweite Kurve** | Eine zweite Kurve wird mit **Mix / Add / Multiply / Min / Max / Subtract**, ihren eigenen Zyklen/Phasen und einem Mischbetrag kombiniert. Beide Quellkurven sind als gestrichelte Linien im Diagramm dargestellt. |
| **Beschriftung**            | Tabellenbezeichnung (automatisch aus dem Kurvennamen vorgeschlagen).                                                                                                                                              |
| **Zahlenformat**            | `$XX` hexadezimal oder dezimal.                                                                                                                                                                                   |
| **Werte pro Zeile**         | 8 / 16 / 32 Bytes pro `.byte` Zeile.                                                                                                                                                                              |

**Ausgabemodi: **
| Modus      | Sendet                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **8-Bit**  | Eine einzelne `.byte`-Tabelle (Werte 0..255). Gelesen mit `LDX #index / LDA-Tabelle,X`. Optional wird eine **Sprite-Y-Leseroutine** (`<label>_set_y`) — `LDA <label>,X` / `STA $D001+2N` — für eine auswählbare Sprite-Nummer von 0-7 ausgegeben.                                                                                                                                                                                                               |
| **16-Bit** | Zwei parallele Bytetabellen – `<label>_lo` (niedrige 8 Bits) und `<label>_hi` (9. Bit, 0/1) – indiziert durch **same** X (2 Bytes pro Eintrag). Erforderlich für Sprite X über den gesamten Bildschirm (0.320 > ein Byte). Optional wird eine **Sprite-X-Leseroutine** (`<label>_set_x`) ausgegeben, die das niedrigste Byte in `$D000+2N` schreibt und das MSB des Sprites in `$D010` setzt/löscht, um eine auswählbare Sprite-Nummer von 0 bis 7 zu erhalten. |

Jede Kopier-/Einfügeausgabe beginnt mit einem Kopfzeilenkommentar, der die Kurve, den tatsächlichen Min-/Max-Bereich, die Anzahl der Einträge und die genaue Verwendung dokumentiert (wodurch jeder Tabellenfeed erfasst wird).

**Vorschau:**
- **Graph** – die Kurve, deren Wert oben ** und unten ** 0 beträgt und deren Maximum bei **unten ** liegt. Dies entspricht der Sprite-Y-/Raster-Konvention des C64 (die angezeigten Werte entsprechen also den Hardware-Ausgaben der Tabelle). Eine Metazeile unter dem Graphen zeigt die Byte-Anzahl, die tatsächlichen Minimal- und Maximalwerte sowie den/die Kurvennamen an.
- **Hüpfender Ball** – animiert eine Markierung über den Tisch mit dem **Tempo** (5–240 Werte/Sek.). Bei Tempo 50 entspricht dies einem Wert pro Frame auf PAL (50 Hz), d. h. einem `.wait_raster`-Schritt pro Index. Wiedergabe-/Pause- und Neustart-Tasten, ein Ausblendeffekt der letzten ca. 24 Positionen und eine Live-Anzeige von `Index · Wert`.

**Kopieren / Einfügen:** Die beiden Symbole der Symbolleiste – **Kopieren** legt die Tabelle in die Zwischenablage; **In Editor einfügen** fügt die Tabelle (und den Reader, falls aktiviert) als Blöcke an das aktuelle Programm an. Erneutes Einfügen** ersetzt** den vorherigen Eintrag im Kurveneditor, anstatt Duplikate zu stapeln (funktioniert im Block- und Expertenmodus).

**Menü „Dateien“:**
| Aktion                         | Was es tut                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ** Kurve speichern (.bin)…**   | Speichert die Rohdaten der Tabelle exakt so, wie der C64 sie über `INCBIN` lesen würde. 16 Bit: N LO-Bytes, gefolgt von N HI-Bytes.                                                                                                                                                                                                                                                                                                            |
| **Lastkurve (.bin)…**          | Lädt die Rohdaten der Tabelle zurück in den Editor, interpretiert gemäß der aktuellen Bittiefe (16 Bit: erste Hälfte niedrig, zweite Hälfte hoch). Die geladene Tabelle wird unverändert angezeigt, bis eine Kurvensteuerung eine neue Kurve generiert.                                                                                                                                                                                        |
| **Demo in Blöcke exportieren** | Fügt eine vollständige, lauffähige Sprite-Demo hinzu: Sprite-Initialisierung, rastersynchronisierte Hauptschleife, die eingebettete Tabelle und die Daten des Kugel-Sprites. Die X-Achse durchläuft den Bereich von 0 bis 320 in 8,8-Punkt-Festkommadarstellung mit dem MSB `$D010`, während die Tabelle die Sprite-Y-Achse steuert – exakt entsprechend der Editor-Vorschau. Der erneute Export ersetzt den vorherigen Kurveneditor-Einschub. |

**Entsprechend der Vorschau auf dem C64:** Die Vorschau liest die Tabelle **linear, in einer Schleife von 0 → N-1 → 0, ein Wert pro Frame**. Um dies exakt zu reproduzieren, muss die Tabelle auf dieselbe Weise angesteuert werden (Index einmal pro Frame inkrementieren, Überlauf bei Tabellenlänge). Eine Ping-Pong- oder Teilbereichswiedergabe verhält sich anders, obwohl die Bytewerte identisch sind. Ein funktionierendes 16-Bit-Sprite-X-Beispiel finden Sie unter `samples/curve-new-demo.asm`.

---


*© 2026 Zsolt Tarczali — C64 Visual Assembler*
