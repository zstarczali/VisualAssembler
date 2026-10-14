# C64 Visual Assembler – Benutzerhandbuch

**Version 2.5.9**

Ein visueller, blockbasierter 6502-Assembler für den Commodore 64. Erstellen Sie
Programme durch Ziehen und Ablegen von Befehlsblöcken und sehen Sie den
generierten Assembler- und Maschinencode in Echtzeit.

---

## Inhaltsverzeichnis

- [C64 Visual Assembler — Benutzerhandbuch](#c64-visual-assembler--user-manual)
    - [Version 2.5.9 Highlights](#version-259-highlights)
    - [Version 2.5.8 Highlights](#version-258-highlights)
    - [Version 2.5.7 Highlights](#version-257-highlights)
    - [Version 2.5.6 Highlights](#version-256-highlights)
    - [Version 2.5.5 Highlights](#version-255-highlights)
    - [Version 2.5.4 Highlights](#version-254-highlights)
    - [Version 2.5.3 Highlights](#version-253-highlights)
    - [Version 2.5.2 Highlights](#version-252-highlights)
    - [Version 2.5.1 Highlights](#version-251-highlights)
    - [Version 2.5.0 Highlights](#version-250-highlights)
    - [Version 2.4.9 Highlights](#version-249-highlights)
    - [Version 2.4.8 Highlights](#version-248-highlights)
    - [Version 2.4.7 Highlights](#version-247-highlights)
    - [Version 2.4.6 Highlights](#version-246-highlights)
    - [Version 2.4.5 Highlights](#version-245-highlights)
    - [Version 2.4.3 Highlights](#version-243-highlights)
    - [Version 2.4.2 Highlights](#version-242-highlights)
    - [Version 2.4.1 Highlights](#version-241-highlights)
    - [Version 2.4.0 Highlights](#version-240-highlights)
    - [Version 2.3.9 Highlights](#version-239-highlights)
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
    - [Versionskontrolle](#version-control)
    - [Freemium und Professional](#freemium-and-professional)
    - [Fehler melden](#reporting-a-bug)
    - [Projektvorlagen](#project-templates)
    - [Build project](#build-project)
    - [Beispielprogramme](#example-programs)
    - [Lade .asm-Datei (Kurzanleitung)](#load-asm-file-quick-reference)
      - [Hinweise und Best Practices zum Importieren von
        Daten](#import-parsing-notes-and-best-practices)
  - [Ultimativer Basismodus](#ultimatebasic-mode)
    - [Öffnen des UB-Editors](#opening-the-ub-editor)
    - [Editor-Werkzeuge](#editor-tools)
    - [Projekte, Registerkarten und
      Startdateien](#projects-tabs-and-startup-files)
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
    - [Der `*`-Programmzähler in
      Ausdrücken](#the--program-counter-in-expressions)
    - [Lokale (gepunktete) Bezeichnungen](#local-dotted-labels)
    - [Selbstmodifizierende
      Code-Operandenbezeichnungen](#self-modifying-code-operand-labels)
  - [8. Standard 6502 Anweisungen](#8-standard-6502-instructions)
    - [Datenbewegung](#data-movement)
    - [Arithmetik](#arithmetic)
    - [Logik](#logic)
    - [Sprünge & Verzweigungen](#jumps--branches)
    - [LBNE / LBEQ / … (Lange Zweige)](#lbne--lbeq---long-branches)
    - [Registeroperationen](#register-operations)
    - [Shift & Rotate](#shift--rotate)
    - [Stack](#stack)
    - [System / Flags](#system--flags)
    - [Illegale / Nicht dokumentierte
      Anweisungen](#illegal--undocumented-instructions)
  - [9. Makroblöcke — Referenz](#9-macro-blocks--reference)
    - [LABEL](#label)
    - [KOMMENTAR](#comment)
    - [BYTE](#byte)
    - [WORT](#word)
    - [FILL](#fill)
    - [ALIGN](#align)
    - [TEXT 1}
    - [STRING](#string)
    - [DATA](#data)
    - [RAWBYTES](#rawbytes)
    - [RAWTEXT](#rawtext)
    - [PETSCII](#petscii)
    - [CHARSET](#charset)
    - [CHARDEF](#chardef)
    - [BOX_HIT](#box_hit)
    - [INCBIN](#incbin)
    - [KOALA](#koala)
    - [LEVEL / LEVEL\_ROW](#level--level_row)
      - [LEVEL](#level)
      - [LEVEL\_ROW](#level_row)
    - [SID](#sid)
    - [INCLUDE](#include)
    - [TABELLE](#table)
    - [ORG](#org)
    - [SCHLEIFE / NÄCHSTES](#loop--next)
      - [LOOP](#loop)
      - [NÄCHSTES](#next)
    - [FOR / ENDF](#for--endf)
      - [FOR](#for)
      - [ENDF](#endf)
    - [DRÜCKEN / ZIEHEN](#push--pull)
      - [PUSH](#push)
      - [ZIEHEN](#pull)
    - [END / RTS alias](#end--rts-alias)
    - [MACRO / ENDM / INVOKE](#macro--endm--invoke)
      - [MACRO (Definitionsstart)](#macro-definition-start)
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
    - [WIEDERHOLEN BIS](#repeat--until)
    - [MEMCPY / MEMSET](#memcpy--memset)
    - [PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY /
      SET_BORDER /
      SET_BG](#print--print_char--print_hex--clear_screen--wait_key--delay--set_border--set_bg)
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
    - [TURBO_ENABLE](#turbo_enable)
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
    - [Dialog zum Exportieren nach D64](#export-to-d64-dialog)
    - [D64-Metadaten in Projekten](#d64-metadata-in-projects)
  - [12b. CRT-Export (Magic Desk
    64K-Cartridge)](#12b-crt-export-magic-desk-64k-cartridge)
  - [13. Hardware-Einstellungen](#13-hardware-settings)
    - [VICE Emulator](#vice-emulator)
    - [Exomizer](#exomizer)
    - [Retro Debugger](#retro-debugger)
    - [C64 Ultimate / 1541 Ultimate](#c64-ultimate--1541-ultimate)
    - [Kung Fu Flash 2](#kung-fu-flash-2)
  - [14. Visuelle Editoren (Toolkit)](#14-visual-editors-toolkit)
    - [Hi-Res / Multicolor Editor](#hi-res--multicolor-editor)
    - [Sprite-Editor](#sprite-editor)
    - [C64 Character ROM Browser ("Char
      map")](#c64-character-rom-browser-char-map)
    - [Zeicheneditor (Zeichensatz)](#character-editor-charset)
    - [Charset Canvas Editor](#charset-canvas-editor)
    - [Karteneditor (Mehrschichtige
      Kachelkarten)](#map-editor-multilayer-tilemaps)
    - [Level Editor](#level-editor)
    - [SID-Editor (3-Voice-Tracker)](#sid-editor-3-voice-tracker)
    - [SID Player](#sid-player)
    - [Kurveneditor](#curve-editor)
    - [Zahlenkonverter](#number-converter)

---

## Highlights der Version 2.5.9

- **Commodore 64-Design** — der C64-Einschaltbildschirm: ein hellblauer Rahmen
  um blaue Felder, hellblauer Text, Umkehrvideo-Tasten, Syntaxfarben aus der
  C64-Palette und die C64-Schriftart in der Monitoransicht (Professional).
- **Commodore Beige-Design** – der klassische Brotkasten: beiges Gehäuse,
  senffarbene Funktionstasten, die Regenbogenstreifen des Logos und eine
  C64-blaue Monitoransicht. Wählen Sie es in der Designauswahl oder wechseln Sie
  mit der Design-Schaltfläche (Professionell) dorthin. Siehe [Einstellungen &
  Symbolleiste](#5-settings--toolbar).
- **Commodore Starlight Theme** — ein helles Theme nach dem durchscheinenden
  C64-Brotkasten: mattiertes Klarglas, durch das das Regenbogen-RGB-Leuchten
  hindurchscheint, ein magentafarbener Akzent, Regenbogen-Syntaxfarben und eine
  rauchig-dunkle Monitoransicht (Professional).
- **Versionskontrolldialog** – Der Dialog kann an seiner Kopfzeile verschoben
  werden und öffnet sich an der zuletzt geöffneten Stelle. Er bleibt sichtbar,
  wenn das Protokoll oder eine Änderung die Höhe des Dialogs vergrößert, und ein
  Klick außerhalb des Dialogs schließt ihn nicht mehr (im Gegensatz zur
  Esc-Taste). Siehe [Versionskontrolle](#version-control).
- **Projektweite Versionskontrolle** – Für einen geöffneten Tab eines
  `.proj`-Projekts bewirkt der Schalter **Datei / Projekt**, dass alle
  Quelldateien des Projekts (Projektbaum + eingebundene Dateien) in einem
  einzigen Eintrag gespeichert werden. Das Protokoll listet die geänderten
  Dateien jedes Commits auf, der Diff-Befehl arbeitet dateiweise, der
  Checkout-Befehl stellt alle Dateien in den Editor-Tabs wieder her, und es
  werden auch automatische Speichereinträge pro Projekt erstellt. Im Git-Modus
  decken Protokoll und Diff das gesamte Repository ab. Siehe
  [Projektmodus](#project-mode).

---

## Highlights der Version 2.5.8

- **Versionskontrolle** – Die Projekt-Snapshots wurden zu einer Git-ähnlichen
  Versionskontrolle umfunktioniert: Commits mit Nachricht und kurzem Hash, ein
  Log mit **HEAD**, ein **Diff** gegen die Arbeitskopie, **Checkout** in den
  Editor und separate Einträge für das automatische Speichern.
  Blockmodus-Programme (JSON) werden als Assembler-Zeilen verglichen, sodass der
  Diff die tatsächlichen Änderungen anzeigt. Funktioniert auf den Registerkarten
  „Block“, „Experte“ und „Ultimativ Basic“. Siehe
  [Versionskontrolle](#version-control).
- Git-Integration – Wählen Sie git.exe unter Einstellungen → Versionskontrolle
  (oder lassen Sie die App es finden). Befindet sich das Projekt in einem
  Git-Repository, zeigt der Dialog den Branch, die geänderten Dateien, Commit
  (speichert zuerst), Log, Diff mit RAW-Ansicht, Checkout, Pull / Push und git
  init an.
- **Fehler melden** – ein integriertes Meldeformular mit bis zu 4 Screenshots
  (Datei, Strg+V oder Drag & Drop), optionaler E-Mail-Adresse,
  Systeminformationen und den letzten App-Fehlern. Siehe [Fehler
  melden](#reporting-a-bug).
- **Professionelle Seriennummer per E-Mail** – Unterstützer fordern ihre
  Seriennummer im Registrierungsdialog an (**Seriennummer anfordern
  (Unterstützer)**); die Professional-Version kann auf c64va.pro mit PayPal (5
  €, einmalig) erworben werden und die Seriennummer wird direkt nach der Zahlung
  per E-Mail zugestellt. Siehe [Freemium und
  Professional](#freemium-and-professional).
- **SID Player** — **Shuffle** und **Favoriten** (★) pro Titel. Siehe [SID
  Player](#sid-player).

---

## Highlights der Version 2.5.7

- **VA SID Core 1.2** – Der SID Player verwendet nun einen nativen Rust
  C64-Kern: einen taktgenauen 6510 mit präziser Interrupt-Zeitsteuerung, den CIA
  6526A, VIC-II-Timing mit fehlerhaften Zeilen, Sprite-DMA und Raster-Interrupts
  sowie den 6510-I/O-Port. Siehe [SID Player](#sid-player).
- **Hi-Res Editor** – zwei Farben in jeder 8×8-Zelle: das neue Werkzeug
  **Zellenpapier**. Siehe [Hi-Res /
  Mehrfarben-Editor](#hi-res--multicolor-editor).
- **Exakte Charakter-ROM** im ROM-Viewer, im Charaktereditor **Load ROM** und in
  den Karten-/Level-Editoren.
- **Sprite-Editor** – Hochauflösende Überlagerung, Flächenfüllung,
  Auswählen/Verschieben, Drehen, Alles spiegeln, Sprite-Sheet-Import,
  Trefferzone, X/Y ×2-Vorschau. Siehe [Sprite-Editor](#sprite-editor).
- **Level-Editor** – Objekte, Charakterattribute, Kantenprüfung, Farben pro
  Bildschirm, Speicheranzeige mit RLE, Ausführung in VICE. Siehe
  [Level-Editor](#level-editor).
- **Charaktereditor** – Rückgängig/Wiederherstellen, Zeichenwerkzeuge,
  90°-Drehung, Kopieren/Einfügen und Verschieben zum Tauschen auf der Karte,
  2×2-Kacheln, Kleinbuchstaben-ROM-Satz, Textvorschau und Bereichsexport. Siehe
  [Charaktereditor](#character-editor-charset).
- **Charset Canvas** – 2×–24× Zoom (Schieberegler oder Strg+Rad) mit
  Pixelraster, Hintergrundfarbe im hochauflösenden Modus, hochauflösende Zeichen
  im Mehrfarbenmodus und **ECM** (ein Hintergrund pro Zeichen). Siehe [Charset
  Canvas Editor](#charset-canvas-editor).

---

## Highlights der Version 2.5.6

- **SID Player** – Eine neue Schaltfläche in der Symbolleiste öffnet einen
  schwebenden Player für `.sid` (PSID/RSID)-Titel: eine Wiedergabeliste mit Drag
  & Drop, vorherigem/nächstem Titel, Submelodien, Suchfunktion (±10 s),
  Lautstärkeregelung und Speichern/Öffnen der Wiedergabeliste (`.sidpl`). Die
  Liste und der Fensterstatus werden gespeichert. Siehe [SID
  Player](#sid-player).
- **VA SID Core 1.1** – eine integrierte SID-Emulation (MOS 6581/8580 mit einem
  reSID-ausgerichteten 6581-Filter) und ein zyklusgekoppelter PSID/RSID-Player
  (6510-CPU, CIA/VIC-Timing). Wählen Sie diese Option unter **Einstellungen →
  SID-Vorschau** aus; der SID-Player zeigt an, welche Engine aktiv ist.
- **SID-Editor** – Regler für die Instrumentenparameter, ein breiteres
  ADSR-Diagramm, **MIDI-Eingang**, **Aufnahme** in den Tracker (ein neues
  Pattern wird hinzugefügt, sobald das aktuelle voll ist), ein **Metronom**mit
  Beat-Lampen, **Pattern löschen**, die Master-Lautstärkeregelung am VA-VK und
  **GoatTracker .sng importieren**. Siehe
  [SID-Editor](#sid-editor-3-voice-tracker).
- **Freemium und Professional** – Ohne Registrierung läuft die App als
  Freemium-Version. Geben Sie Ihre E-Mail-Adresse und Seriennummer aus dem Kauf
  unter **Menü → Registrieren…** ein, um die Professional-Version zu erhalten.
  Siehe [Freemium und Professional](#freemium-and-professional).
- **Ultimate Basic 1.6.4** enthalten.

---

## Highlights der Version 2.5.5

- **Hi-Res-Editor: Pixelraster und 16-facher Zoom** – Mit aktiviertem **Raster**
  erhält ab 4-fachem Zoom jedes Pixel eine eigene Rasterlinie, die an den
  Zeichenzellenrändern stärker hervorgehoben und so schattiert ist, dass sie in
  allen 16 Farben sichtbar bleibt. Der Zoom-Regler reicht nun bis 16-fach. Siehe
  [Hi-Res-/Mehrfarben-Editor](#hi-res--multicolor-editor).
- **Rechtsklick-Menü „Kopieren/Einfügen“** – auf der Arbeitsfläche des Hi-Res-
  und Karteneditors (Kopieren, Einfügen, Transparentes Einfügen) und im
  Sprite-Editor (Frame kopieren, Frame einfügen, auch auf der Frame-Leiste).
  Beim Einfügen wird die Menüvorschau an der angeklickten Stelle angezeigt.
- **Zahlenkonverter** — die Schaltfläche in der Symbolleiste bleibt
  hervorgehoben, solange der Konverter angezeigt wird.
- **Fixiert** — Das mehrfarbige Zellenraster des Hi-Res Editors war doppelt so
  breit wie eine Zeichenzelle; die Schaltfläche **Einfügen** der
  Hi-Res-Werkzeugleiste fügte immer transparent ein; das Kontextmenü des SID
  Editors öffnete sich außerhalb der Cursorposition, während der Dialog
  zentriert war.
- **In diesem Handbuch** werden nun die Auswahl, das Kopieren/Einfügen und das
  transparente Einfügen des Hi-Res Editors beschrieben.

---

## Highlights der Version 2.5.4

- **Behoben: Fenster wird beim Neustart nicht angezeigt** – Wenn die Anwendung
  mit minimiertem oder ausgeblendetem Fenster beendet wurde (hauptsächlich unter
  macOS, aber auch unter Linux/Wayland), konnte es beim nächsten Start
  vorkommen, dass kein Fenster angezeigt wurde. Der Sichtbarkeitsstatus wird
  nicht mehr gespeichert (die Fenstergröße jedoch weiterhin), und das Fenster
  wird beim Start immer angezeigt.
- **Ultimate Basic 1.6.3 gebündelt** — QBasic-ähnliche Syntax: `dim name as
  type` für Variablen und Arrays jedes Typs, `function` / `sub` mit `as` Typen,
  `elseif`, `do … loop`, `while … wend`, `select case`, `exit do` / `exit sub`,
  einzeilig `if`, `'` Kommentare und `print a; b; c`; Laufzeitstrings (`+`,
  `left$` / `right$` / `mid$`) und vorzeichenbehaftete 16-Bit-`integer`. Im
  UB-Editor hervorgehoben, vervollständigt und formatiert, mit neuen Einträgen
  **DIM**, **FUNCTION**, **ELSEIF**, **DO**, **WEND**, **SELECT CASE**, **END**,
  **EXIT SUB** und **LEFT$** / **RIGHT$** / **MID$** im Befehlsfeld. Siehe
  [UltimateBasic-Modus](#ultimatebasic-mode).

---

## Highlights der Version 2.5.2

- **SID Editor-Vorschauen auf dem realen SID** – Instrumentenvorschau, virtuelle
  Tastatur, Noteneingabe, Akkord-/Arpeggio-, Zeilen- und Einzelmusterwiedergabe
  über WebSID; der Synthesizer dient nur als Ausweichmöglichkeit. Siehe [SID
  Editor]{1}.

---

## Highlights der Version 2.5.1

- **SID-Editor-Instrumente** – Filterrouting pro Stimme, **3 OFF** und ein
  Resonanz-Cutoff **Sweep** (Start, Ende, Geschwindigkeit, Ping-Pong);
  Instrument **Vibrato** (Verzögerung, Geschwindigkeit, Tiefe);
  **Pulsweitenmodulation**; **Gate-Timer**, **Hard Restart** und
  First-Frame-Wellenform; eine **Wellen-/Arpeggio-Tabelle** mit Presets;
  **RING** und **SYNC**. Siehe [SID-Editor](#sid-editor-3-voice-tracker).
- **Neuer SID-Player** – Der exportierte Player führt die Instrumentenmodulation
  in jedem Frame aus (`JSR sid_frame` für Ihre eigene IRQ); die Vorschau rendert
  denselben Player über einen kleinen SID-Synthesizer. `.bin` speichert die
  Instrumentennamen und die Geschwindigkeit.
- **Virtuelle Tastatur** — 2, 3 oder 4 Oktaven im Commodore 64 Synthesizer-Look.
- **Ultimate Basic 1.6.2 mitgeliefert** — `tune` erhält `imod`, `ifilt`, `igate`
  und `itab`; **Export nach UltimateBasic** schreibt sie.
- **Lesezeichen und Gehe zu Zeile** in den Editoren Expert und Ultimate Basic —
  Strg+F2 / F2 / Umschalt+F2, Strg+G.
- **Fixiert:** Label-Ausdrücke (`.assert`, `LEVEL_MULTICOLOR*16`, `*`)
  funktionieren in der installierten App wieder (kein `eval` unter dem
  Release-CSP).

---

## Highlights der Version 2.5.0

- **Level-Editor** – Ein neuer Toolbar-Editor ordnet die
  Karteneditor-Bildschirme vertikal, horizontal oder in einem 2D-Raster an und
  zeigt eine Vorschau des gesamten Levels mit flüssigem Scrollen. Siehe
  [Level-Editor](#sid-editor-3-voice-tracker).
- **LEVEL / LEVEL_ROW-Makros** — `.level "level.bin"[, $addr]` platziert nur die
  platzierten Bildschirme eines Level-Editor-Projekts sowie Zeigertabellen und
  definiert `LEVEL_*`-Labels und -Konstanten; `.level_row dst, col[, color]`
  kopiert eine 40 Zeichen lange Levelzeile in einen Puffer. Siehe [LEVEL /
  LEVEL_ROW]{1}.
- **JOYSTICK-Variablenmodus** — `.joystick-Port, vx, vy[, fire]` schreibt die
  Richtung in Variablen (−1 / 0 / +1), anstatt einen Sprite zu bewegen; Port `3`
  liest beide Joystick-Ports. Siehe [JOYSTICK]{1}.
- **Level scroll demo** — `samples/level-demo.asm` scrollt ein
  2×5-Bildschirm-Level Pixel für Pixel in jede Richtung mit dem Joystick, ohne
  Tearing, und lässt Platz für Sprites und Spielcode.
- **Zahlenkonverter** – ein nicht-modaler DEC/HEX/BIN-Dialog in der
  Symbolleiste. Siehe [Zahlenkonverter]{1}.
- **Beispieldialog** — **Menü → Beispiele…** öffnet eine durchsuchbare,
  kategorisierte Liste der integrierten Beispielprogramme. Siehe
  [Beispielprogramme]{1}.
- **Ultimate Basic 1.6.1 mitgeliefert** — `map load "level.bin"[, addr]` liest
  ein Level-Editor-Projekt direkt ein, und der neue Befehl `map view px, py`
  scrollt die Karte flüssig und ruckelfrei an einer Pixelposition (Beispiel:
  `level_scroll_demo.ub`). Ein Byte-Produkt innerhalb einer 16-Bit-Summe wird
  nicht mehr auf 8 Bit abgeschnitten. Die UB-Befehlsreferenz listet `map view`
  auf, und die Suche sortiert Treffer nach Befehlsnamen zuerst aus.

---

## Highlights der Version 2.4.9

- **Projektvorlagen** – **Menü → Datei → Neues Projekt aus Vorlage…** oder die
  neue Schaltfläche in der Symbolleiste zwischen **Menü** und **Tutorials**
  erstellt ein fertiges `.proj`-Projekt in einem eigenen Ordner. Der Dialog
  enthält einen **Assembler**-Bereich (leeres Programm, Spielgerüst,
  hochauflösende und mehrfarbige Bitmap) und einen **UltimateBasic**-Bereich
  (leeres Programm, Spielgerüst, hochauflösende Bitmap, Raster-IRQ) mit einer
  Syntax-Vorschau. Ihre eigenen `.asm` / `.ub`-Vorlagen werden aus dem
  Benutzervorlagenordner geladen. Siehe [Projektvorlagen](#level-editor).
- **Projekt erstellen** — **Menü → Erstellen → Projekt erstellen** kompiliert
  alle kompilierbaren Dateien des geöffneten Projekts (oder der geöffneten Tabs)
  zu einer `.prg-Datei` neben dem Quellcode, schreibt gegebenenfalls
  Debugger-Symboldateien, überspringt Module, die nur eingebunden werden können,
  und zeigt einen Bericht pro Datei an. Siehe [Projekt
  erstellen](#level--level_row).
- **Strg + Mausrad zoomen** in den Editoren Expert und Ultimate Basic (`Cmd` +
  Mausrad auf macOS; Touchpad-Pinch funktioniert auch).
- **Arbeitsbereiche speichern Projekte** – die Projektstrukturen „Experte“ und
  „Ultimativer Basis-Arbeitsbereich“, die Startdatei und nicht gespeicherte
  Projektänderungen werden im Arbeitsbereich `.vaws` gespeichert und mit diesem
  wiederhergestellt. Ältere Arbeitsbereiche bleiben geöffnet.
- **Ultimate Basic** — der mitgelieferte Compiler generiert schnelleren,
  kleineren 6502-Code; die Speicherabbildung unterscheidet nun zwischen echtem
  Code und Daten sowie Padding und langen `org` Lücken.
- **Dateidialoge starten im aktiven Arbeitsordner** – dem Block/Expert- oder dem
  Ultimate Basic-Ordner, abhängig vom aktuellen Modus.
- **Ultimate Basic 1.6.1 mitgeliefert** — `map load "level.bin"[, addr]` liest
  ein Level-Editor-Projekt direkt ein, und der neue Befehl `map view px, py`
  scrollt die Karte flüssig und ruckelfrei an einer Pixelposition (Beispiel:
  `level_scroll_demo.ub`). Ein Byte-Produkt innerhalb einer 16-Bit-Summe wird
  nicht mehr auf 8 Bit abgeschnitten. Die UB-Befehlsreferenz listet `map view`
  auf, und die Suche sortiert Treffer nach Befehlsnamen zuerst aus.

---

## Highlights der Version 2.4.8

- **Neues KOALA-Makro** — `.koala "picture.koa"` (optional `, $2000`) lädt ein
  Koala Painter-Bild und zeigt es mit einer 86-Byte-Anzeigeroutine an. Siehe
  [KOALA](#project-templates).
- **Koala-Import/Export im HiRes-Editor** — **Dateien → Koala importieren
  (.koa)…** / **Koala exportieren (.koa)…** (Standarddatei mit 10003 Byte;
  hochauflösende Bilder werden beim Export auf Mehrfarben reduziert). `.koa` /
  `.kla` werden auch von **Bild importieren / .bin** erkannt.
- **Ultimate Basic 1.5.9 enthalten** – neu `chain "FILE" [, Gerät]` (lädt ein
  anderes Programm über das laufende und führt es aus); `load "FILE"` lädt in
  die Adresse der Datei, `load "FILE", addr` bis `addr`; D64-Korrekturen.
  `chain` ist hervorgehoben und in der Befehlsreferenz aufgeführt.
- **Aktualisierungsstatus in der Expert-Statusleiste** — der gleiche *Aktuell* /
  anklickbare *Update verfügbar* Indikator wie im Ultimate Basic-Modus.
- **Speicherdialoge** bieten den Dateityp selbst an (z. B. *KOA*) anstelle von
  *Binär (\*.bin)*.
- **Robustere Updateprüfung** — Die Installerliste wird unter
  c64va.tech/downloads/VA/ veröffentlicht, sodass die Prüfung mit der neuen
  Downloadseite funktioniert; der Linux-Update-Helfer erbt nicht mehr die
  AppImage-Bibliothekspfade.

---

## Highlights der Version 2.4.7

- **In-App-Updates** — **Menü → Nach Updates suchen** prüft auf c64va.tech, ob
  eine neuere Version verfügbar ist, und lädt nach Bestätigung das
  Installationsprogramm für Ihre Plattform mit Fortschrittsanzeige herunter und
  installiert es. Siehe [In-App-Updates](#koala). Die Prüfung wird außerdem bei
  jedem Start im Hintergrund ausgeführt.
- **Update-Status in der Ultimate Basic-Statusleiste** — zeigt **Aktuell (vX)**
  an oder ein hervorgehobenes **Update verfügbar: vY**, das beim Anklicken den
  Update-Dialog öffnet.
- **Kurveneditor → UltimateBasic-Export** – **Dateien → Nach UltimateBasic
  exportieren** schreibt die Tabelle als initialisiertes UB-Array; **Dateien →
  UltimateBasic-Demo exportieren** erzeugt eine sofort lauffähige
  UB-Sprite-Demo. Siehe [Kurveneditor]{1}.
- **Ultimate Basic 1.5.8 mitgeliefert** — die neue **`data <array>: v, …`** Form
  füllt ein deklariertes `array` / `array_word` beim Programmstart (weitere
  Zeilen werden dort fortgesetzt, wo die vorherige aufgehört hat, Wort-Arrays
  nehmen 16-Bit-Werte an), ohne den `read` Stream zu berühren.
- **Layout passt sich dem Fenster an** – die Editor-Panels nehmen exakt die
  verbleibende Fensterhöhe ein, sodass die Anwendung keine vertikale
  Scrollleiste mehr anzeigt; das ASM-Ausgabe-Panel behält eine Mindestbreite von
  440 Pixeln; der Pfad zum Arbeitsordner wird in einem dezenten Badge über dem
  Titel der ASM-Ansicht angezeigt und verwendet denselben Badge in den
  Symbolleisten „Experte“ und „Ultimate Basic“. Die Beschriftungen von
  Dialogfeld-Schaltflächen werden nicht mehr umgebrochen.
- **Robustere Updateprüfung** — Die Installationsliste wird unter
  c64va.pro/downloads/VA/ veröffentlicht, sodass die Prüfung mit der neuen
  Downloadseite funktioniert; der Linux-Update-Helfer erbt nicht mehr die
  AppImage-Bibliothekspfade.

---

## Highlights der Version 2.4.6

- **In-App-Updates** — **Menü → Nach Updates suchen** prüft, ob eine neuere
  Version von c64va.pro verfügbar ist, und lädt nach Bestätigung das
  Installationsprogramm für Ihre Plattform mit Fortschrittsanzeige herunter und
  installiert es. Siehe [In-App-Updates](#in-app-updates). Die Prüfung wird
  außerdem bei jedem Start im Hintergrund ausgeführt.
- **Ultimatives Basic-Sprachupdate** – Syntaxhervorhebung und Befehlsreferenz
  umfassen nun **`sfx`** (nicht blockierender SID-Effekt: `sfx Kanal, Frequenz,
  Frames [, Welle]`), **`org`** (Sub-/Funktionscode an einer Adresse fortsetzen
  und eine mit Nullen gefüllte Lücke hinterlassen, die `incbin` Daten aufnehmen
  kann), **`charset on` / `charset off`** (VIC-II auf den RAM-Zeichensatz
  umschalten und zurück) und **`incbin` slicing** (`incbin "font.prg", $3C00, 2`
  überspringt die ersten Bytes, ein optionales viertes Argument begrenzt die
  Länge).
- **Mehrere Blöcke in der ASM-Ansicht hervorheben** – Durch die Auswahl mehrerer
  Blöcke werden alle zugehörigen ASM-Zeilen gleichzeitig hervorgehoben, die
  Scrollposition bleibt während der Auswahl stabil, und die Zeilennummern werden
  durch eine dezente vertikale Trennlinie weicher dargestellt.
- **Assembler-Modus bleibt beim Wechsel zwischen Ultimate Basic erhalten** –
  Beim Öffnen eines Projekts oder eines integrierten Beispiels, während Ultimate
  Basic aktiv ist, wird nun zuerst Ultimate Basic gestartet und zum zuletzt
  verwendeten Block-/Expertenmodus zurückgekehrt. Dadurch kann der
  Ultimate-Basic-Puffer den Modus oder Titel des neuen Tabs nicht mehr
  überschreiben. Neue Tabs werden im korrekten Modus erstellt.
- **Kung Fu Flash 2 Einstellungen** — eine **USB-Erkennen** Schaltfläche in den
  Hardware-Einstellungen scannt erneut nach dem seriellen Anschluss der
  Cartridge, und die KFF2-Voraussetzungen geben nun die erforderliche Kung Fu
  Flash Firmware (v2.07+) an.
- **Ultimative Basic-Befehlsreferenz** — `tune` und `music` zeigen vollständige,
  kommentierte Beispiele (Zellenformat, Effekte, Spielernoten, `music play N`);
  `inst`, `order`, `pat` und tune `speed` haben ihre eigenen Einträge; `data`
  zeigt die neue Array-Form; die Syntax von `load sid` wurde korrigiert (`load
  sid "tune.sid", $2000`).

---

## Highlights der Version 2.4.5

- **Kung Fu Flash 2-Unterstützung – Programme auf einem echten Commodore 64/128
  ausführen.** Ein neuer **Kung Fu Flash 2**-Eintrag im geteilten
  **Ausführen**-Menü kompiliert das Programm und lädt es per USB direkt auf
  einen eingeschalteten C64 (oder C128) mit Kung Fu Flash 2-Modul hoch – ohne
  Disk-Image, ohne SD-Karten-Kopie, ohne Emulator. Es funktioniert im Block-,
  Experten- und Ultimate Basic-Modus. Der serielle USB-Anschluss des Moduls wird
  automatisch erkannt (und kann auch manuell eingegeben werden); siehe [Kung Fu
  Flash 2]{1} für die Einrichtung und den genauen Arbeitsablauf.
- **Verstellbare Programm-/ASM-Bedienfelder** – Ein schmaler vertikaler
  Trennstreifen zwischen dem Programm- und dem ASM-/Ausgabe-Bedienfeld
  ermöglicht das Verschieben der Trennlinie nach links oder rechts (mindestens
  260 px pro Bedienfeld). Mit den Pfeiltasten lässt sich die Trennlinie
  verschieben, ein Doppelklick stellt die 50/50-Aufteilung wieder her, und die
  Position wird zwischen den Sitzungen gespeichert. Der Trennstreifen ist im
  Experten- und Ultimate Basic-Modus sowie im schmalen gestapelten Layout
  ausgeblendet.
- **Sauberere Makrozeilen in der ASM-Ansicht** – Makroblöcke werden jetzt ohne
  vorangestelltes Kommentarzeichen angezeigt (`.print "HELLO"`, `.if A == 1`,
  `.sprite_init …` statt `; .print …`), und der ASM-Syntaxhervorhebungs-Editor
  färbt sie als Makros ein. Normale KOMMENTARBlöcke und Bereichsmarkierungen
  beginnen weiterhin mit `;`.
- **Benutzerdefinierte Makro-Hervorhebung im Expert-Editor** – der Makroname
  nach `.macro`, `.invoke` und `.call` (und Kick-artigen `:name(...)`-Aufrufen)
  hat seine eigene Farbe, ebenso wie die `{param}`-Ersetzungen innerhalb des
  Makrokörpers und die Parameternamen im `.macro`-Header, in jedem Theme.
- **Überarbeiteter Info-Dialog** – ein breiteres zweispaltiges Layout mit
  gruppierten Projekt-, Lizenz- und Credits-Links, und das Ultimate Basic-Banner
  hat jetzt einen transparenten Hintergrund, sodass es sich in jedes Design
  einfügt.

---

## Highlights der Version 2.4.3

- **SID-Editor: Song-/Reihenfolgeliste** – Patterns werden nun in einer
  Song-/Reihenfolgeliste angeordnet, die über der ursprünglichen Patternbank
  liegt. Dadurch können sich Patterns wiederholen und Songs länger sein als die
  Anzahl der gespeicherten Patterns. Schritte lassen sich direkt im SID-Editor
  hinzufügen, entfernen und neu anordnen. Wiedergabe und exportierter Player
  verwenden diese Liste anstelle der ursprünglichen Patternreihenfolge.
- **SID-Editor: Effektspalte** – Jede Trackerzelle kann nun neben der Note auch
  einen Effekt enthalten: **V**Ibrato, Slide **U**p / **D**own, Note-**C**ut und
  Tempoänderung (**F**). Geben Sie den Effekt direkt in eine Zelle ein, z. B.
  `C-4 01 V24` (Note + Instrument + Vibrato) oder `F06` (nur Tempoänderung).
  Effekte werden einmal pro Zeile ausgeführt, entsprechend dem exportierten
  Player, und werden nun sowohl in der In-App-Web-Audio-Vorschau als auch im
  kompilierten 6502-Export korrekt wiedergegeben – eine echte, spielbare
  Effekt-Engine, nicht nur ein Exportgerüst.
- **Rückwärtskompatibles SID-Speicherformat** — SID-Speicherstände enthalten
  jetzt eine Versionsmarkierung, sodass ältere `.bin`-Speicherstände, die vor
  dem Vorhandensein der Effektspalte erstellt wurden, weiterhin genau wie zuvor
  geladen werden, nur dass die Effekte fehlen.
- **D64-Editor: Expliziter Speicher-Workflow** – Jede Bearbeitung
  (Hinzufügen/Extrahieren/Umbenennen/Löschen und jetzt auch Byte-Bearbeitungen
  im Block-Editor) erfolgt in einer privaten Arbeitskopie. Ihre eigentliche
  `.d64`-Datei bleibt unberührt, bis Sie auf **Speichern** klicken. Dabei wird
  zuvor automatisch eine Sicherungskopie erstellt. Beim Schließen des Editors
  oder beim Öffnen eines anderen Datenträgers mit ungespeicherten Änderungen
  werden Sie nun um Bestätigung gebeten, anstatt die Änderungen stillschweigend
  zu verwerfen.
- **D64 Editor: Block Editor Hex-Grid** — Die Rohbyte-Ansicht für den
  ausgewählten 256-Byte-Block ist jetzt ein richtiges Byte-pro-Byte-Hex-Grid
  anstelle eines einfachen Textfelds, und der Dialog blendet den Rest der
  Anwendung im Hintergrund nicht mehr aus, solange er geöffnet ist.
- **Web64 auf der Produktseite** — ein neuer Web64 IDE-Bereich auf
  [c64va.pro](https://www.c64va.pro).
- **Beispiel update** — das `macro-with-parameter` Beispiel verwendet jetzt die
  geklammerte `.macro setColor(color)` Form.

---

## Highlights der Version 2.4.2

- **Drag & Drop in den D64 Editor** – Ziehen Sie eine kompilierte
  `.prg`/`.bin`-Datei (aus den Exporten der SID-/Sprite-/Charaktereditoren oder
  von einem anderen Speicherort) direkt auf das Disk-Image; das
  Hinzufügen-Fenster öffnet sich automatisch. Wenn Sie mehrere Dateien
  gleichzeitig ablegen, werden diese nacheinander in die Warteschlange gestellt.
- **Include-Datei generieren** — eine neue Schaltfläche in der Symbolleiste
  schreibt eine `.inc`-Datei, die `.const NAME = $ADDR` für jeden Eintrag auf
  der Festplatte auflistet, sodass das Hauptprogramm darauf zugreifen kann, wo
  jeder Eintrag gelandet ist, ohne die Adressen manuell neu eingeben zu müssen.
- **Blockeditor (neu)** – Ein Umschalter in der Symbolleiste schaltet den
  D64-Editor auf direkten Zugriff auf Spuren/Sektoren unterhalb des
  Verzeichnisses um: eine anklickbare Blockkarte (farblich dargestellt anhand
  der freien/belegten Bitmap der BAM-Datei, wobei die BAM-Datei und die
  Verzeichniskette separat markiert sind), eine Hex-Ansicht/einen Hex-Editor für
  den ausgewählten 256-Byte-Block sowie die Navigation zum vorherigen/nächsten
  Sektor. Liest und schreibt das Disk-Image direkt
  (`read_bin_file`/`write_bin_file`), unabhängig von `c1541`.
- **D64-Editor: Expliziter Speicher-Workflow** – Jede Bearbeitung
  (Hinzufügen/Extrahieren/Umbenennen/Löschen und jetzt auch Byte-Bearbeitungen
  im Block-Editor) erfolgt in einer privaten Arbeitskopie. Ihre eigentliche
  `.d64`-Datei bleibt unberührt, bis Sie auf **Speichern** klicken. Dabei wird
  zuvor automatisch eine Sicherungskopie erstellt. Beim Schließen des Editors
  oder beim Öffnen eines anderen Datenträgers mit ungespeicherten Änderungen
  werden Sie nun um Bestätigung gebeten, anstatt die Änderungen stillschweigend
  zu verwerfen.
- **D64 Editor: Block Editor Hex-Grid** — Die Rohbyte-Ansicht für den
  ausgewählten 256-Byte-Block ist jetzt ein richtiges Byte-pro-Byte-Hex-Grid
  anstelle eines einfachen Textfelds, und der Dialog blendet den Rest der
  Anwendung im Hintergrund nicht mehr aus, solange er geöffnet ist.

---

## Highlights der Version 2.4.1

- **Polnische und italienische UI-Sprachen** — vollständige Übersetzung der
  Benutzeroberfläche (Menüs, Dialoge, mnemonische Beschreibungen, Ultimate
  Basic-Befehlsreferenz) neben den bereits vorhandenen ungarischen, englischen,
  spanischen, deutschen und niederländischen.
- **Online-Hilfe-Symbolleistenschaltfläche** — eine neue Symbolschaltfläche, die
  nach dem Debuggen die mehrsprachige Dokumentationsseite
  ([c64va.tech/docs.html]{1}) direkt aus der App öffnet.
- **Zentralisierte Tastenkombinationen:** Die sprachspezifischen
  Tastenkombinationen wurden zusammen mit den übrigen UI-Texten in die
  gemeinsame Übersetzungsdatei verschoben. Außerdem wird ein langjähriger Fehler
  behoben, bei dem die englischen Beschreibungen für `PRINT`, `PRINT_HEX`,
  `CLEAR_SCREEN`, `WAIT_KEY`, `SET_BORDER`, `SET_BG`, `IRQ_SETUP` und `RAND`
  stillschweigend durch übrig gebliebenen spanischen Text überschrieben wurden.

---

## Highlights der Version 2.4.0

- **D64-Editor** – ein vollständiger Disk-Image-Browser in der Symbolleiste
  (nach dem Kurveneditor). Öffnen Sie ein vorhandenes `.d64`, erstellen Sie ein
  neues, leeres oder starten Sie die aktuelle Disk direkt in VICE. Dies ist
  jeweils über das Menü „Dateien ▾“ möglich, analog zu den anderen visuellen
  Editoren. Siehe [D64-Editor (vorhandenes Disk-Image durchsuchen und
  bearbeiten)]{1}.
- **Online-Hilfe-Symbolleistenschaltfläche** — eine neue Symbolschaltfläche, die
  nach dem Debuggen die mehrsprachige Dokumentationsseite
  ([c64va.pro/docs.html](https://www.c64va.pro/docs.html)) direkt aus der App
  öffnet.
- **Ladeadresse, Dekomprimierungsadresse & Exomizer im D64-Editor** – Durch
  Hinzufügen einer Rohdatei ohne Header können Sie eine optionale Ladeadresse
  und ein Exomizer-Dekomprimierungsziel festlegen sowie die Datei beim Import
  komprimieren. Dabei werden dieselben `mem`/`sfx`-Komprimierungsmodi wie bei
  den Zusatzdateien des Dialogfelds „Exportieren nach D64“ verwendet. Eine
  `.prg`-Datei, die bereits einen eigenen Header enthält, überspringt diese
  Felder vollständig.

---

## Highlights der Version 2.3.9

- **`*` in beliebigen Ausdrücken** – das Programmzählersymbol funktioniert nun
  innerhalb von Operandenausdrücken, nicht nur allein: `BNE *-5`, `JMP *+20`,
  `LDA #&lt;*`, `LDA #&gt;(*+63)`. Ein `*`, das auf einen Wert folgt
  (`STRIDE*2`), entspricht weiterhin einer Multiplikation. Siehe
  [Adressierungsmodi → Der `*`-Programmzähler in
  Ausdrücken](#d64-editor-browse--edit-an-existing-disk-image).
- **Lokale (gepunktete) Labels** – Ein Label wie `.loop` gehört zum
  Gültigkeitsbereich des nächstgelegenen vorhergehenden *globalen* (nicht
  gepunkteten) Labels, sodass `DrawSprite` und `ClearScreen` jeweils ihr eigenes
  `.loop` definieren können, ohne dass es zu einem Konflikt kommt. Siehe [Lokale
  (gepunktete) Labels]{1}.
- **Lange Verzweigungs-Pseudo-Operationen** – `LBNE`, `LBEQ`, `LBCC`, `LBCS`,
  `LBMI`, `LBPL`, `LBVC`, `LBVS` werden zu einer invertierten Verzweigung über
  einem `JMP` (immer 5 Bytes) assembliert, sodass das Ziel beliebig weit
  entfernt sein kann. Neue Palettenkategorie **Lange Verzweigungen**. Siehe
  [LBNE / LBEQ / … (Lange Verzweigungen)]{1}.
- Die Direktive **`.assert`** — `.assert end - start &lt;= 256` oder `.assert *
  &lt; $A000, "message"` wird zur Assemblierungszeit ausgewertet und führt zu
  einem Build-Fehler (mit Anzeige des tatsächlichen Werts), wenn der Ausdruck
  falsch ist. Siehe [.ASSERT]{1}.
- **Selbstmodifizierende Code-Operandenbezeichnungen** — `LDA Wert:#$00`
  definiert die Bezeichnung `Wert`, die auf das Operandenbyte der Anweisung
  zeigt, sodass `STA Wert` diese direkt überschreibt. Siehe
  [Selbstmodifizierende Code-Operandenbezeichnungen]{1}.
- **Freundlichere Fehler bei Verzweigungen außerhalb des Bereichs** — eine
  Verzweigung, die außerhalb von −128…+127 landet, meldet nun genau, wie weit
  sie den Bereich überschreitet, und schlägt die passende lange Verzweigung
  `LBxx` vor.
- **Verbessert:** Das Symbol in der Symbolleiste des hellen Designs (BLOCKMODUS
  / EXPERTENMODUS / …) ist dunkler und besser lesbar, und seine
  Schimmeranimation ist wieder sichtbar.

---

## 1. Schnittstellenübersicht

Die App ist in drei Hauptbereiche unterteilt:

- **`*` in beliebigen Ausdrücken** – das Programmzählersymbol funktioniert nun
  innerhalb von Operandenausdrücken, nicht nur allein: `BNE *-5`, `JMP *+20`,
  `LDA #&lt;*`, `LDA #&gt;(*+63)`. Ein `*`, das auf einen Wert folgt
  (`STRIDE*2`), entspricht weiterhin einer Multiplikation. Siehe
  [Adressierungsmodi → Der `*`-Programmzähler in
  Ausdrücken](#the--program-counter-in-expressions).
- **Lokale (gepunktete) Labels** – Ein Label wie `.loop` gehört zum
  Gültigkeitsbereich des nächstgelegenen vorhergehenden *globalen* (nicht
  gepunkteten) Labels, sodass `DrawSprite` und `ClearScreen` jeweils ihr eigenes
  `.loop` definieren können, ohne dass es zu einem Konflikt kommt. Siehe [Lokale
  (gepunktete) Labels](#local-dotted-labels).
- **Lange Verzweigungs-Pseudo-Operationen** – `LBNE`, `LBEQ`, `LBCC`, `LBCS`,
  `LBMI`, `LBPL`, `LBVC`, `LBVS` werden zu einer invertierten Verzweigung über
  einem `JMP` (immer 5 Bytes) assembliert, sodass das Ziel beliebig weit
  entfernt sein kann. Neue Palettenkategorie **Lange Verzweigungen**. Siehe
  [LBNE / LBEQ / … (Lange Verzweigungen)](#lbne--lbeq---long-branches).
- Die Direktive **`.assert`** — `.assert end - start &lt;= 256` oder `.assert *
  &lt; $A000, "message"` wird zur Assemblierungszeit ausgewertet und führt zu
  einem Build-Fehler (mit Anzeige des tatsächlichen Werts), wenn der Ausdruck
  falsch ist. Siehe [.ASSERT](#assert).
- **Selbstmodifizierende Code-Operandenbezeichnungen** — `LDA Wert:#$00`
  definiert die Bezeichnung `Wert`, die auf das Operandenbyte der Anweisung
  zeigt, sodass `STA Wert` diese direkt überschreibt. Siehe
  [Selbstmodifizierende
  Code-Operandenbezeichnungen](#self-modifying-code-operand-labels).
- **Freundlichere Fehler bei Verzweigungen außerhalb des Bereichs** — eine
  Verzweigung, die außerhalb von −128…+127 landet, meldet nun genau, wie weit
  sie den Bereich überschreitet, und schlägt die passende lange Verzweigung
  `LBxx` vor.

---

## 2. Blockpalette

Die Palette auf der linken Seite listet alle verfügbaren Blöcke nach Kategorien
gruppiert auf:

| Panel                 | Beschreibung                                                                              |
| --------------------- | ----------------------------------------------------------------------------------------- |
| **Links — Palette**   | Alle verfügbaren Befehls- und Makroblöcke. Suchen oder nach Kategorie durchsuchen.        |
| **Center — Programm** | Ihr Programm. Ziehen Sie Blöcke hierher, ordnen Sie sie neu an, bearbeiten Sie Operanden. |
| **Rechts — Ausgang**  | Live-ASM-Ansicht und/oder Speichermonitorausgabe.                                         |

Verwenden Sie das **Suchfeld** oben in der Palette, um nach Namen zu filtern.
Klicken Sie auf die Schaltfläche **Ausgewählten Block hinzufügen** oder ziehen
Sie einen Block in den Programmbereich.

Im Blockmodus befindet sich ein schmaler vertikaler Trennstrich zwischen dem
Programm- und dem Ausgabefenster. Ziehen Sie ihn, um einem der Fenster mehr
Platz zu geben (jedes behält mindestens 260 Pixel), verwenden Sie die
Pfeiltasten ← / →, um ihn in 16-Pixel-Schritten zu verschieben, oder
doppelklicken Sie darauf, um die Aufteilung auf 50/50 zurückzusetzen. Die
Position wird in den Benutzeroberflächeneinstellungen gespeichert. Der
Trennstrich ist im Expertenmodus und im Modus „Ultimativ Basic“ ausgeblendet,
ebenso wenn das Fenster schmal genug ist, um die Fenster übereinander zu
stapeln.

---

## 3. Programmbereich

Die Palette auf der linken Seite listet alle verfügbaren Blöcke nach Kategorien
gruppiert auf:

- **Ziehen Sie**Blöcke aus der Palette per Drag & Drop, oder **ordnen Sie**
  vorhandene Blöcke neu an, indem Sie an ihrem Griff (≡) ziehen.
- Jeder Block zeigt seine **Mnemonik**, sein **Operandenfeld** und seinen
  **Adressierungsmodus-Selektor** (sofern zutreffend).
- Klicken Sie auf den Schalter **▸ / ▾**, um einen Block ein- oder auszublenden.
- Verwenden Sie die Schaltfläche **× (Löschen)** auf einem Block, um ihn zu
  entfernen.
- Mit der Schaltfläche **Alle ausblenden** werden alle Blöcke gleichzeitig
  eingeklappt.
- **Registeroperationen** — TAX, TAY, INX, DEX, …
- **Shift & Rotating** — ASL, LSR, ROL, ROR
- **Stack** — PHA, PHP, PLA, PLP
- **System** — CLC, SEC, NOP, BRK, …
- **Ungültige Befehle** — LAX, SAX, DCP, …
- **Struktur** — BEZEICHNUNG, KOMMENTAR, REGION, ENDREGION
- **Macros** — LOOP, NEXT, FOR, ENDF, PUSH, PULL, END, TEXT, BYTE, WORD, FILL,
  ALIGN, ASSERT, STRING, DATA, RAWBYTES, RAWTEXT, PETSCII, CHARSET, INCBIN, SID,
  INCLUDE, TABLE, ORG, MACRO, ENDM, INVOKE, IF, ELSE, ENDIF, VAR, WHILE, ENDW,
  REPEAT, UNTIL, MEMCPY, MEMSET, PRINT, PRINT_CHAR, PRINT_HEX, CLEAR_SCREEN,
  WAIT_KEY, DELAY, SET_BORDER, SET_BG, IRQ_SETUP, RAND, SPRITE_INIT, SPRITE_POS,
  WAIT_RASTER, JOYSTICK, MOUSE, SPRITE_COL, LOADFILE, REU_CHECK, REU_STASH,
  REU_FETCH, REU_SWAP, TURBO_SET, SUPERCPU_DETECT, TURBO_ENABLE, MAP_COPY,
  MAP_COPY16X16, SPRITE_ANIM, SCORE_BCD

Verwenden Sie das Suchfeld ** oben in der Palette, um nach Namen zu filtern.
Klicken Sie auf die Schaltfläche **Ausgewählten Block hinzufügen** oder ziehen
Sie einen Block in den Programmbereich.

---

## 4. ASM-Ansicht

- **Ziehen Sie **Blöcke aus der Palette per Drag & Drop, oder **ordnen Sie **
  vorhandene Blöcke neu an, indem Sie an ihrem Griff (≡) ziehen.
- Jeder Block zeigt seine **Mnemonik**, sein **Operandenfeld** und seinen
  **Adressierungsmodus-Selektor** (sofern zutreffend).
- Klicken Sie auf den Schalter **▸ / ▾**, um einen Block ein- oder auszublenden.
- Verwenden Sie die Schaltfläche **× (Löschen)** auf einem Block, um ihn zu
  entfernen.
- Mit der Schaltfläche **Alle ausblenden** werden alle Blöcke gleichzeitig
  eingeklappt.

### Ausgabemodi

Makroblöcke erscheinen in der ASM- und der Both-Ansicht als einfache Makrozeilen
ohne Kommentarzeichen (`.print "HELLO"`, `.wait_raster $FF`, `.invoke
setColor(blue)`) und werden als Makros farbig dargestellt; nur echte
KOMMENTARblöcke, Regionsmarkierungen und Warnungen behalten ihr führendes `;`.

| Balkenfarbe      | Beschreibung                                                                                                                                                                                                                                                                                                                     |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cyan             | 6502-Assemblerquellcode mit Adressen und Labels                                                                                                                                                                                                                                                                                  |
| **Monitor**      | Hex-/Byte-Dump (C64-Monitor-Stil)                                                                                                                                                                                                                                                                                                |
| **Disasm**       | Reine 6502-Disassemblierung: Adresse · Hex-Bytes · Mnemonics mit aufgelösten numerischen Operanden. Makros werden zu einzelnen Befehlen expandiert (TEXT → LDA/STA-Paare, LOOP → LDX usw.). BYTE/WORD/FILL-Daten werden als segmentierter Hex-Dump angezeigt. Die Ausgabe enthält keine Makronamen, Kommentare oder Anmerkungen. |
| **Beide**        | ASM oben, Monitor unten                                                                                                                                                                                                                                                                                                          |
| **Disassembler** | Wie bei Disasm – eigener Tab für die Demontageansicht                                                                                                                                                                                                                                                                            |

Zusammengeklappte Blöcke werden mit reduzierter Deckkraft dargestellt. Klicken
oder ziehen Sie an einer beliebigen Stelle auf der Minikarte, um die
Programmliste an diese Position zu scrollen. Die Ansichtsanzeige (farbiges
Rechteck) zeigt den sichtbaren Teil der Liste an. Der Status wird in den
UI-Einstellungen gespeichert (Taste `blockMinimap`).

### Registerkarte „Werkzeugkasten“

- Bei Verzweigungs-/Sprunganweisungen (`BNE`, `JMP`, `JSR`, etc.) erscheint ein
  **Label-Picker**-Dropdown – klicken Sie auf ein definiertes Label, um es
  einzufügen.
- Das Zahlenformat richtet sich nach dem Umschalter **HEX / DEC** in der
  Symbolleiste (siehe Abschnitt 5).

---

## 5. Einstellungen & Symbolleiste

Im rechten Bereich wird die generierte Ausgabe in Echtzeit angezeigt.

### Projekt-Snapshots

| Modus            | Beschreibung                                                                                                                                                                                                                                                                                                                     |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ASM**          | 6502-Assemblerquellcode mit Adressen und Labels                                                                                                                                                                                                                                                                                  |
| **Monitor**      | Hex-/Byte-Dump (C64-Monitor-Stil)                                                                                                                                                                                                                                                                                                |
| **Disasm**       | Reine 6502-Disassemblierung: Adresse · Hex-Bytes · Mnemonics mit aufgelösten numerischen Operanden. Makros werden zu einzelnen Befehlen expandiert (TEXT → LDA/STA-Paare, LOOP → LDX usw.). BYTE/WORD/FILL-Daten werden als segmentierter Hex-Dump angezeigt. Die Ausgabe enthält keine Makronamen, Kommentare oder Anmerkungen. |
| **Beide**        | ASM oben, Monitor unten                                                                                                                                                                                                                                                                                                          |
| **Disassembler** | Wie bei Disasm – eigener Tab für die Demontageansicht                                                                                                                                                                                                                                                                            |
| **Toolkit**      | C64-Referenzpanel: 16-Farben-Farbpalette + PETSCII-Steuercodes und Übersicht der druckbaren Zeichen. Schreibgeschützt – Details finden Sie im Unterabschnitt „Toolkit“ weiter unten.                                                                                                                                             |
| **Optionen**     | Programmeinstellungen – Zahlenformat, Makroquellen-Umschaltung, Debugger-Parameter                                                                                                                                                                                                                                               |

Projekt-Snapshots werden als separate JSON-Dateien auf der Festplatte
gespeichert, nicht im lokalen Speicher. Sie sind an die aktuelle Projektdatei
gebunden, sofern eine solche existiert, sodass die Historie auch nach Neustarts
erhalten bleibt und dem Projekt folgt.

### In-App-Updates

**Menü → Nach Updates suchen** sucht die neueste Version auf c64va.tech (liest
die Download-Links für Ihre Plattform aus) und vergleicht sie mit der aktuell
laufenden Version:

| Abschnitt   | Was geschieht                                                                                                                                                                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Windows** | Die Installation läuft im passiven Modus (nur Fortschrittsanzeige) und startet nach Abschluss die neue Version. Bei einer Installation pro Rechner werden Administratorrechte (Benutzerkontensteuerung) angefordert.                                         |
| **macOS**   | Die DMG-Datei wird eingebunden und das App-Bundle an dessen Stelle ersetzt, anschließend startet die neue Version. Falls der App-Ordner nicht beschreibbar ist, wird die DMG-Datei einfach geöffnet, sodass Sie die App per Drag & Drop hineinziehen können. |

Nach dem Herunterladen installiert die App das Update und startet neu:

### Arbeitsbereiche

Ein **Workspace** (`.vaws`-Datei) merkt sich, welche realen Dateien auf der
Festplatte in den einzelnen Tabs geöffnet waren – einschließlich des
Bearbeitungsmodus und des aktiven Tabs –, sodass Sie genau diese Einstellungen
später wieder öffnen können. Er ist von einem `.proj`-Projekt getrennt: Ein
Workspace kann beliebige Kombinationen von Block/Expert `.json`-Projektdateien,
eigenständigen `.asm`-Dateien und Ultimate Basic `.ub`/`.proj`-Quelldateien über
mehrere Tabs umfassen.

- Arbeitsbereiche **werden nach einigen hundert Millisekunden automatisch
  gespeichert**, sobald eine Änderung vorgenommen wurde oder ein Arbeitsbereich
  einmal gespeichert oder geöffnet wurde.
- Die App **stellt beim Start automatisch Ihren letzten Arbeitsbereich** wieder
  her, sodass Ihre geöffneten Tabs genau dort weitermachen, wo Sie aufgehört
  haben.
- Nur Tabs, die durch eine reale Datei auf der Festplatte belegt sind, werden im
  Arbeitsbereich gespeichert; ein Tab, der ein nicht gespeichertes Beispiel oder
  ein nur im Arbeitsspeicher befindliches Programm enthält, hat nichts zu
  speichern und wird übersprungen (mit einem Hinweis, falls keiner der
  geöffneten Tabs die Voraussetzungen erfüllt).
  - **`-jmp` ON/OFF** — springt nach dem Laden direkt zur Startadresse des
    Programms.
  - **`-unpause` ON/OFF** — Debugger beim Laden sofort wieder aktivieren.
  - **`-wait` ms EIN/AUS** — fügt eine `-wait <ms>` Verzögerung vor dem
    Fortsetzen hinzu; wählen Sie 500 ms oder 1000 ms aus dem Dropdown-Menü.
- Beim Öffnen eines Arbeitsbereichs werden zunächst alle aktuell geöffneten Tabs
  geschlossen – Sie werden vor dem Fortfahren um Bestätigung gebeten.

### Projektvorlagen

**Menü → Datei → Neues Projekt aus Vorlage…** — oder die Schaltfläche in der
Symbolleiste zwischen **Menü** und **Tutorials** — öffnet den Vorlagendialog:

### Bauprojekt

**Menü → Erstellen → Projekt erstellen** kompiliert ein gesamtes Projekt in
einem Schritt. Die Dateien des geöffneten `.proj`-Projekts werden erstellt –
oder, falls kein Projekt vorhanden ist, die geöffneten Dateiregisterkarten:

- Jede kompilierbare Quelle (`.asm`, Block `.json`, `.ub`) wird zu einer `.prg`
  **neben ihrer Quelle** mit demselben Namen kompiliert; wenn **Run with
  Exomizer** aktiviert ist, wird die Ausgabe komprimiert;
- Debugger-Sidecar-Dateien (Symbole / Quellzuordnung) werden, sofern verfügbar,
  zusammen mit der PRG geschrieben;

### Beispielprogramme

**Menü → Beispiele…** öffnet den Beispielbrowser: die integrierten
Beispielprogramme, gruppiert nach Thema (Grundlagen, Makros & Kontrollfluss,
Grafik, Sprites & Eingabe, Dateien & Laden, Musik, IRQ & Hardware) in zwei
Spalten.

- Geben Sie im Suchfeld einen Suchbegriff ein, um nach Name oder Kategorie zu
  filtern; in der Fußzeile wird die Anzahl der übereinstimmenden Beispiele
  angezeigt.
- Klicken Sie auf ein Beispiel, um es auszuwählen; **↑ / ↓** verschieben Sie die
  Auswahl; **Doppelklick**, **Enter** oder **Load** laden es.
- Der Dialog öffnet sich mit dem zuletzt geladenen Beispiel.

Das Modal schließt sich automatisch, wenn die Aktion abgeschlossen ist oder
fehlschlägt.

---

## Ultimativer Basismodus

| Kontrolle                                                                                                | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Zahlenbasis (HEX / DEC / BIN)**                                                                        | Legt das Anzeige-/Eingabeformat für Operanden in der gesamten Benutzeroberfläche fest. Im BIN-Modus werden Werte binär mit dem Präfix `%` angezeigt (z. B. `%11111000`). Die ASM-Ansicht zeigt jeden Block immer in seinem eigenen Format an.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Sprache**                                                                                              | Wechseln Sie die Benutzeroberfläche zwischen Englisch, Ungarisch, Spanisch, Deutsch und Niederländisch (Nederlands).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Theme**                                                                                                | Hell / Dunkel / OLED / Commodore 77 / Commodore Starlight / Commodore Beige / Commodore 64 – wählen Sie Ihr Wunschdesign im Menü „Einstellungen“. OLED verwendet einen rein schwarzen Hintergrund für AMOLED-Displays. Commodore 77 ist ein neongelbes Design auf schwarzem Grund. Ist es aktiv, verwendet das Startbildschirm-Panel die Farbe des Designs (passend zur Meldungskarte), zeigt ein kleineres Commodore-77-Logo und einen gelben Fortschrittsbalken. Commodore Starlight ist ein helles Design, angelehnt an das durchscheinende Gehäuse des C64: mattierte Glaspaneele, durch die das RGB-Regenbogenlicht schimmert, ein magentafarbener Akzent, Regenbogenfarben für die Syntax und eine rauchig-dunkle Monitoransicht. Commodore Beige ist das klassische Design des Commodore 64: beiges Gehäuse, senffarbene Funktionstasten, die Regenbogenstreifen des Logos und ein blauer C64-Bildschirm für die Monitoransicht. Das gewählte Design wird beim nächsten Start vor dem ersten Lackieren angewendet. |
| **CRT-Retromodus**                                                                                       | Aktiviert/Deaktiviert einen Vollbild-CRT-Filter: Scanlines, Phosphorvignettierung, Flimmern und tonnenförmige Verzeichnung. Der Status wird zwischen den Sitzungen gespeichert.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Speicherpanel anzeigen**                                                                               | Globaler Schalter zum Ein- oder Ausblenden des gesamten C64-Speicherpanels                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **BASIC SYS stub**                                                                                       | Fügt dem Ursprung Ihres Programms eine BASIC-Zeile voran, die SYS aufruft.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Beispiele…**                                                                                           | Öffnen Sie den Beispielbrowser und laden Sie ein integriertes Beispielprogramm – siehe [Beispielprogramme](#example-programs)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Vergrößern / Verkleinern**                                                                             | Skaliert die Block-UI (betrifft alle Blockelemente)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Projekt speichern**                                                                                    | Speichern Sie das aktuelle Programm als `.json`-Projektdatei                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Programm speichern unter**                                                                             | Speichern Sie das aktuelle Programm jedes Mal als `.json`-Projektdatei über einen neuen Dateidialog.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Projekt laden**                                                                                        | Ein zuvor gespeichertes Projekt laden                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Arbeitsbereich speichern**                                                                             | Speichern Sie die exakte Menge der aktuell geöffneten, dateibasierten Registerkarten – einschließlich der aktiven Registerkarte und des jeweiligen Bearbeitungsmodus (Block/Experte/Ultimativ Basic) – in einer `.vaws`-Arbeitsbereichsdatei.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Arbeitsbereich speichern unter**                                                                       | Speichern Sie den aktuellen Arbeitsbereich jedes Mal über einen neuen Dateidialog.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Arbeitsbereich öffnen**                                                                                | Schließen Sie alle geöffneten Tabs und öffnen Sie die in einer `.vaws`-Arbeitsbereichsdatei gespeicherten Dateien erneut.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Arbeitsordner festlegen**                                                                              | Wählen Sie den Standardordner für Dateiauswahl- und Speicherdialoge. Der Pfad wird in der App-Konfiguration gespeichert, und in der Menüvorschau wird das Ende des Pfades angezeigt.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Neues Projekt aus Vorlage…** (`Menü → Datei` oder die Schaltfläche in der Symbolleiste neben **Menü**) | Erstellen Sie ein neues `.proj`-Projekt aus einer Assembler- oder UltimateBasic-Vorlage in einem eigenen Ordner – siehe [Projektvorlagen](#project-templates)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Projekt öffnen** (`Menü → Datei`)                                                                      | Öffnen Sie ein `.proj`-Projekt mit mehreren Dateien und öffnen Sie alle Quelldateien als Tabs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Projekt speichern** (`Menü → Datei`)                                                                   | Speichern Sie das aktuelle `.proj`-Projekt (das Projektfenster muss geöffnet sein).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Projekt schließen** (`Menü → Datei`)                                                                   | Das aktuell geöffnete Projekt und alle zugehörigen Dateiregisterkarten werden geschlossen. Es wird eine Aufforderung zum Speichern der nicht gespeicherten Änderungen angezeigt. Das Projektfenster wird auf seinen leeren Zustand zurückgesetzt.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Lade .asm-Datei**                                                                                      | Öffnet eine `.asm`-Datei im Expertenmodus und importiert textuellen 6502-ASM-Code in den aktuellen Tab                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Speichern PRG**                                                                                        | Exportieren Sie die kompilierte Binärdatei als `.prg`-Datei                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **CRT erstellen**                                                                                        | Exportieren Sie das Programm als 64K Magic Desk-Datei (`.crt`, Cartridge-Typ 19). Siehe [Abschnitt 12b](#12b-crt-export-magic-desk-64k-cartridge).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Projekt erstellen** (`Menü → Erstellen`)                                                               | Kompilieren Sie jede kompilierbare Datei des Projekts (oder der geöffneten Tabs) zu einer `.prg`-Datei neben dem Quellcode – siehe [Projekt erstellen](#build-project)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Laufen (Split-Taste)**                                                                                 | Die Hauptschaltfläche **▶ Ausführen** startet den aktuellen Modus. Klicken Sie auf den Pfeil **▾**, um zwischen folgenden Optionen zu wechseln: **Als PRG ausführen** (VICE direkt kompilieren und starten), **Über D64 ausführen** (als .d64-Disk-Image packen und VICE starten), **Auf Hardware ausführen** (PRG an ein C64 Ultimate / 1541 Ultimate-Gerät senden) oder **Kung Fu Flash 2** (PRG per USB auf einen echten C64/C128 mit Kung Fu Flash 2-Modul hochladen). Siehe [Abschnitt 12](#12-d64-export--run) und [Abschnitt 13](#13-hardware-settings).                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Debug (RetroDebugger)**                                                                                | Kompilieren und starten Sie in RetroDebugger mit Haltepunkten, Symbolen und Autostart-Flags (siehe [Abschnitt 9](#9-debugger-integration)).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Run with Exomizer**                                                                                    | Kontrollkästchen im Menü „Einstellungen“ – wenn aktiviert, wird bei allen Ausführungs- und Build-Vorgängen die PRG-Datei vor dem Starten oder Speichern mit `exomizer sfx sys` verarbeitet. Funktioniert mit „Als PRG ausführen“, „Über D64 ausführen“, „Auf Hardware ausführen“, „PRG erstellen“ und „D64 erstellen“. Konfigurieren Sie die Exomizer-Datei zuerst in den **Hardwareeinstellungen**.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Automatische Speicherung von Einträgen**                                                               | Aktivieren Sie das Kontrollkästchen unter **Hardwareeinstellungen → Versionskontrolle**. Ist diese Option aktiviert, fügt die App ca. 2,5 Sekunden nach Beendigung der Bearbeitung eines Tabs einen automatischen Speichereintrag zur Versionshistorie hinzu (bei Tabs eines Projekts auch zur Projekthistorie). Deaktivieren Sie die Option, wenn Sie nur Ihre eigenen Commits speichern möchten. Siehe [Versionskontrolle](#version-control).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Hardwareeinstellungen**                                                                                | Öffnen Sie den Hardwarekonfigurationsdialog und konfigurieren Sie VICE, Exomizer, RetroDebugger, C64 Ultimate (Host, Passwort, Verbindungstest) und die serielle Schnittstelle von Kung Fu Flash 2. Siehe [Abschnitt 13](#13-hardware-settings).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Neues Programm…**                                                                                      | Öffnet einen Bestätigungsdialog und entfernt anschließend alle Blöcke aus dem Programmbereich.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Alle ausblenden**                                                                                      | Alle Blöcke ausblenden                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Über**                                                                                                 | Versionsinformationen                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Was gibt's Neues?**                                                                                    | Änderungsprotokoll                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

### Versionskontrolle

Jeder Tab verfügt über eine eigene Versionshistorie, ähnlich einem kleinen
Git-Repository. Ein Tab, der zu einem geöffneten `.proj`-Projekt gehört, kann
auch als Gesamtprojekt versioniert werden (siehe [Projektmodus](#project-mode)).
**Menü → Erstellen → Versionskontrolle…** (oder **Commit…**) öffnet den Dialog;
**Änderungen verwerfen (zurück zu HEAD)** stellt den letzten Commit direkt
wieder her.

Der übliche Arbeitsablauf: eine **Commit-Nachricht** schreiben und **Commit**
(oder Strg+Eingabe) drücken → weiter bearbeiten → **Diff** drücken, um zu sehen,
was sich geändert hat → erneut committen.

- **Commit** – speichert den aktuellen Zustand des Tabs mit Ihrer Nachricht.
  Jeder Commit erhält einen kurzen Hash (z. B. `1bd55ba`); der neueste ist
  **HEAD**. Ein Commit ohne Änderungen seit HEAD wird nicht erstellt.
- **Statuszeile** — *Nichts zu committen, Arbeitsverzeichnis sauber* oder *Nicht
  committete Änderungen seit `<hash>`*.
- **Diff** – die Änderungen seit HEAD; die Schaltfläche **Diff** eines
  Logeintrags vergleicht diese Version mit dem Editor. Hinzugefügte Zeilen
  werden grün, entfernte rot dargestellt, und die Kopfzeile zeigt **+N / −M**.
  Blockmodus-Programme werden als Assemblerzeilen verglichen (eine Zeile pro
  Block), Expert-Quellcode zeilenweise, Ultimate Basic-Quellcode tabulatorweise,
  sodass ein als JSON gespeichertes Blockmodus-Projekt weiterhin lesbare
  Änderungen anzeigt.
- **Checkout** – lädt diese Version in den Editor. Die Datei auf der Festplatte
  ändert sich nur beim Speichern; **Discard changes** setzt die Datei auf HEAD
  zurück.
- **Automatisch speichern** – Mit **Einstellungen → Versionskontrolle →
  Automatische Speicherung von Einträgen in der Versionskontrolle** fügt die App
  etwa 2,5 Sekunden nach Beendigung der Bearbeitung einen Eintrag hinzu. Diese
  Einträge sind mit *automatisch speichern* gekennzeichnet; die letzten 20
  werden zusammen mit bis zu 100 Commits gespeichert.
- Der Dialog kann über seine Kopfzeile verschoben werden; er öffnet sich an
  derselben Stelle wieder und wird mit **Esc** oder über die Schaltfläche
  „Schließen“ geschlossen (ein Klick außerhalb des Dialogs schließt ihn nicht).
- Der Verlauf wird neben der Projektdatei als `<Projekt>.snapshots.json` (im
  Anwendungskonfigurationsordner, bis das Projekt gespeichert wird) gespeichert
  und bleibt somit auch nach Neustarts erhalten. Snapshots aus früheren
  Versionen werden als Commits angezeigt.

#### Projektmodus

Gehört der Tab zu einem geöffneten `.proj`-Projekt (Experten- oder Ultimate
Basic-Projektfenster), zeigt die Dialogüberschrift die Option **Datei /
Projekt** an; **Projekt** ist standardmäßig ausgewählt. Tabs außerhalb eines
Projekts behalten den oben beschriebenen dateispezifischen Verlauf bei.

- **Commit** speichert alle Quelldateien des Projekts in einem Eintrag: die
  Dateien des Projektbaums sowie die darin enthaltenen Textdateien (`.include`,
  `include`, `#import`, `!source`, INCLUDE-Blöcke im Blockmodus). Geöffnete Tabs
  werden mit ihrem aktuellen, auch ungespeicherten Inhalt gezählt; die übrigen
  Dateien werden von der Festplatte gelesen. Binärdateien des Projektbaums
  (Schriftarten, `.koa`, `.bin`, `.sid` …, jeweils bis zu 1 MB) werden ebenfalls
  gespeichert; ihre Größenänderung wird angezeigt, und **Checkout** schreibt sie
  direkt zurück auf die Festplatte.
- Das Protokoll zeigt die Commit-Nachricht, den kurzen Hash und die **geänderten
  Dateien** jedes Eintrags (**A** hinzugefügt, **M** geändert, **D** entfernt).
- **Diff** arbeitet dateiweise: Jede geänderte Datei erhält ihren eigenen Header
  und ihre eigenen Hunks.
- **Änderungen verwerfen** führt auf die gleiche Weise zum letzten
  Projekt-Commit (HEAD) zurück.
- **Checkout** (nach Bestätigung) lädt alle Dateien dieser Version in den
  Editor: Geöffnete Tabs werden aktualisiert, fehlende Dateien werden als neue
  Tabs geöffnet. Es wird nichts auf die Festplatte geschrieben, bis Sie
  speichern; Dateien, die dem Projekt seit dieser Version hinzugefügt wurden,
  bleiben unverändert.
- Autosave-Einträge werden auch auf Projektebene erstellt.
- Die Projekthistorie wird neben der Projektdatei als
  `<project>.proj.history.json` gespeichert.
- Im Git-Modus zeigt das Log das gesamte Repository mit den geänderten Dateien
  jedes Commits an (git log --name-status). Mit Diff wird der Commit dateiweise
  angezeigt. Die Schaltfläche Diff vergleicht HEAD mit den Projektdateien im
  Editor (RAW entspricht git diff HEAD des Repositorys). Commit speichert alle
  ungespeicherten Projekt-Tabs und fügt alle Änderungen dem Staging-Bereich
  hinzu (git add -A). Checkout lädt die Projektdateien dieses Commits in den
  Editor.

#### Git

Wenn `git` installiert ist, kann derselbe Dialog auch mit einem echten
Git-Repository verwendet werden.

- **Einstellungen → Versionskontrolle:** **git.exe auswählen…** oder
  **Automatisch erkennen** (durchsucht den PATH und die üblichen
  Installationsordner); die folgende Zeile zeigt die Git-Version an. **Git
  verwenden, wenn sich das Projekt in einem Repository befindet** (standardmäßig
  aktiviert) schaltet den Dialog für Dateien innerhalb eines Repositorys
  automatisch in den Git-Modus. Der Schalter **Integriert / Git** in der
  Dialogüberschrift ändert den Modus manuell.
- Im Header wird der Branch mit **↑** (Commits zum Pushen) und **↓** (Commits
  zum Pullen) angezeigt, gefolgt von den geänderten Dateien des Repositorys.
- **Commit** speichert zuerst die Datei, stellt nur diese Datei (oder jede
  Änderung mit **Alle Änderungen stellen (git add -A)**) zur Verfügung und führt
  dann `git commit` aus.
- Das Protokoll listet die Commits dieser Datei mit ihren Branches und Tags auf.
  **Diff** vergleicht einen Eintrag mit seinem übergeordneten Commit; die
  Schaltfläche **Diff** vergleicht HEAD mit dem Editor, einschließlich
  ungespeicherter Änderungen. Projektdateien werden genauso verglichen wie im
  integrierten Modus; **RAW** zeigt den einfachen `git diff` an.
- **Checkout** lädt die Datei dieses Commits in den Editor (`git show`), ohne
  die Festplatte zu berühren.
- **Pull** (`--ff-only`), **Push** (der erste Push setzt den Upstream mit `-u
  origin <branch>`) und **Repository erstellen (git init)**, wenn der Ordner
  noch kein Repository ist.
- git läuft ohne Konsolenfenster und fragt niemals nach einem Passwort: Die
  Anmeldeinformationen müssen von einem Anmeldeinformationsmanager oder einem
  SSH-Schlüssel stammen, andernfalls wird eine Fehlermeldung im Dialogfeld
  angezeigt. | **Wissensdatenbank** | Referenzlinks (6502 Opcodes, C64-Kernel,
  Speicherbelegung, Farben) | | **Nach Updates suchen** | Prüfen Sie auf
  c64va.pro, ob eine neuere Version verfügbar ist, und laden Sie diese
  herunter/installieren Sie sie – siehe [In-App-Updates](#in-app-updates) |

### Editorwerkzeuge

**Menü → Nach Updates suchen** sucht die neueste Version auf c64va.pro (liest
die Download-Links für Ihre Plattform) und vergleicht sie mit der aktuell
laufenden Version:

- Syntaxhervorhebung basierend auf der aktuellen Ultimate Basic-Sprachreferenz;
- Zeilennummern bleiben mit langen Dateien synchronisiert;

Das Disassemblierungsfenster enthält eine Schaltfläche **Kopieren**, die den
gesamten angezeigten Quellcode in die Zwischenablage kopiert. Die Befehlshilfe
ist dem mitgelieferten Compiler zugeordnet: Beispielsweise wählt
`Sprite-Frame-ID, Datenadresse [, Frame]` ein Animationsbild aus
aufeinanderfolgenden 64-Byte-Sprite-Frames aus.

| Plattform   | Was geschieht                                                                                                                                                                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Windows** | Die Installation läuft im passiven Modus (nur Fortschrittsanzeige) und startet nach Abschluss die neue Version. Bei einer Installation pro Rechner werden Administratorrechte (Benutzerkontensteuerung) angefordert.                                         |
| **macOS**   | Die DMG-Datei wird eingebunden und das App-Bundle an dessen Stelle ersetzt, anschließend startet die neue Version. Falls der App-Ordner nicht beschreibbar ist, wird die DMG-Datei einfach geöffnet, sodass Sie die App per Drag & Drop hineinziehen können. |
| **Linux**   | Eine AppImage-Datei wird durch die neue ersetzt. Eine `.deb` / `.rpm`-Installation wird mit `pkexec` aktualisiert (Sie werden nach Ihrem Passwort gefragt); ohne `pkexec` wird das Paket im Software-Installer geöffnet.                                     |

Die Befehlsliste ist absichtlich in ihrer Höhe begrenzt, damit die
Befehlsdetailkarte die verbleibende Höhe des Bedienfelds ausfüllen kann. Der
Detailbereich lässt sich für längere Syntaxbeschreibungen unabhängig scrollen.

### Freemium und Professional

Ohne Registrierung läuft Visual Assembler als **Freemium**; das Symbol neben dem
Titel zeigt **FREEMIUM** oder **PROFESSIONAL** an. In der Freemium-Version
können Sie Programme schreiben und erstellen und diese in VICE im Block-,
Experten- und Ultimate Basic-Modus ausführen. Diese Modi erfordern die
Professional-Version.

- die visuellen Editoren (SID, Sprite, Char, Charset, Hi-Res, Map, Level, D64,
  Curve) und der SID Player;
- **Build PRG**, **Build D64**, **Build CRT**, **Build project** and Exomizer
  packing;
- Läuft auf dem C64 Ultimate und auf Kung Fu Flash 2;
- Benutzeroberflächensprachen außer Ungarisch und Englisch sowie die Designs
  OLED, Commodore 77, Commodore Starlight, Commodore Beige und Commodore 64.

Durch Klicken auf eine gesperrte Funktion wird der Registrierungsdialog
geöffnet. Zur Registrierung öffnen Sie **Menü → Registrieren…** (oder klicken
Sie auf das Symbol), geben Sie die E-Mail-Adresse und die Seriennummer Ihres
Kaufs ein und klicken Sie auf **Aktivieren**. Die Seriennummer ist dieser
E-Mail-Adresse zugeordnet (Groß-/Kleinschreibung und Leerzeichen spielen keine
Rolle), und die Überprüfung erfolgt offline. Mit **Lizenz entfernen** wird die
Registrierung von diesem Computer gelöscht.

**Seriennummer erhalten.** Falls Sie das Projekt bereits unterstützt haben,
geben Sie Ihre E-Mail-Adresse im Registrierungsdialog ein und klicken Sie auf
**Seriennummer anfordern (Unterstützer)** (oder nutzen Sie das Formular unter
c64va.pro/register): Die Seriennummer wird einmal pro Adresse per E-Mail
zugesendet. Die Professional-Version kann auf c64va.pro erworben werden –
**Vollversion kaufen** Im Dialog öffnet sich die Seite: PayPal, einmalig 5 €,
und die Seriennummer wird direkt nach der Zahlung per E-Mail versendet. Auf der
Seite werden auch die Freemium- und die Professional-Version verglichen.

### Einen Fehler melden

**Menü → Fehler melden** öffnet ein Formular, das den Bericht direkt an den
Entwickler sendet.

- **Zusammenfassung** und **Was ist passiert?** sind Pflichtfelder – beschreiben
  Sie, was Sie getan haben, was Sie erwartet haben und was stattdessen passiert
  ist. **E-Mail** ist optional (tragen Sie hier Ihre Lizenz-E-Mail-Adresse ein);
  geben Sie diese an, wenn Sie eine Antwort wünschen.
- Screenshots: Bis zu 4 Bilder können mit „Bild hinzufügen…“ eingefügt werden,
  entweder mit Strg+V (z. B. nach Win+Umschalt+S) oder per Drag & Drop in das
  Formular. Große Bilder werden auf 1920 Pixel skaliert.
- **Systeminformationen und aktuelle Fehler einbeziehen** (standardmäßig
  aktiviert) fügt die App-Version, das Betriebssystem, die Sprache, das Design,
  den Editor und den Ausführungsmodus, den Lizenzstatus, die Bildschirmgröße,
  die Anzahl der Blöcke und die letzten App-Fehler hinzu. **Was wird gesendet?**
  Zeigt die Daten an. Ihr Quellcode wird nicht gesendet.
- **Bericht senden** bestätigt mit der Berichtsnummer. **Per E-Mail senden**
  öffnet stattdessen Ihr E-Mail-Programm.

### Projekte, Registerkarten und Startdateien

Ultimate Basic-Projekte verwenden `.proj`-Dateien und können mehrere
`.ub`-Quelldateien enthalten. Im Projektfenster werden geöffnete Dateien
aufgelistet, nicht gespeicherte Registerkarten markiert und gefundene Labels,
Funktionen und Unterprogramme angezeigt. Mit den Projektaktionen können Sie ein
Projekt erstellen, öffnen, speichern und schließen oder eine weitere Quelldatei
hinzufügen. Ein neues Projekt kann auch auf einer Ultimate Basic-Vorlage
basieren – siehe [Projektvorlagen]{1}.

- **Datei hinzufügen** – Wählen Sie eine oder mehrere Dateien gleichzeitig aus
  (beliebiger Typ – `.ub`, `.bin`, `.prg`, Bilder, Schriftarten usw.).
  `.ub`-Quelldateien werden ebenfalls als Editor-Tabs geöffnet; alles andere
  wird nur als Referenz hinzugefügt, damit `incbin`/`loadfile`-Assets mit dem
  Projekt übertragen werden.
- **Ordner hinzufügen** — einen ganzen Ordner referenzieren (z.B. ein `incbin`
  Asset-Verzeichnis wie `fonts/`), damit er dem Projekt zugeordnet bleibt.
- Nur Tabs, die durch eine reale Datei auf der Festplatte belegt sind, werden im
  Arbeitsbereich gespeichert; ein Tab, der ein nicht gespeichertes Beispiel oder
  ein nur im Arbeitsspeicher befindliches Programm enthält, hat nichts zu
  speichern und wird übersprungen (mit einem Hinweis, falls keiner der
  geöffneten Tabs die Voraussetzungen erfüllt).
- Beim Öffnen eines Arbeitsbereichs werden zunächst alle aktuell geöffneten Tabs
  geschlossen – Sie werden vor dem Fortfahren um Bestätigung gebeten.
- Wenn ein Arbeitsbereich auf eine Datei verweist, die inzwischen verschoben
  oder gelöscht wurde, wird dieser Eintrag übersprungen und nach dem Laden
  namentlich gemeldet.
- Die geöffneten Expert- und Ultimate Basic-Projekte **** werden ebenfalls
  gespeichert: Die Projektstruktur (einschließlich ungespeicherter Hinzufügungen
  und Löschungen), die Startdatei und das Speicherziel `.proj` werden mit dem
  Arbeitsbereich wiederhergestellt. Arbeitsbereiche, die mit älteren Versionen
  gespeichert wurden, können ohne diese Elemente geöffnet werden.

### Gebäude und Diagnostik

Die Schaltfläche **Build** öffnet die gleiche zentrierte Fortschrittsanzeige wie
die anderen Workflows für die Ausführung des Visual Assemblers. Erfolgreiche
Builds aktualisieren die Build-Ausgabe, die Build-Informationen und die
Disassemblierung. Aktivieren Sie **Verbose**, um Details zur
Compiler-Speicherbelegung, interne Nullseitenzuweisungen und generierte
Codedaten anzuzeigen.

1. Die Build-Ausgabe wird automatisch angezeigt;
2. Compilerfehler werden rot dargestellt;
3. Im zentrierten Kompilierungsdialog wird der Fehler angezeigt;
4. Fehler, die eine Quellzeile enthalten, wählen diese Zeile im aktiven
   UB-Editor aus.

| Abschnitt         | Integrierte Vorlagen                                                                                                                                                                                                                      |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Assembler**     | Leeres Programm, leeres Spiel (Titel-/Spiel-/Spiel-Ende-Zustände, Joystick, Spieler-Sprite), hochauflösende Bitmap, mehrfarbige Bitmap                                                                                                    |
| **UltimateBasic** | Leeres Programm, leeres Spiel (gleiche Zustandsmaschine im ungeordneten Zustand), hochauflösende Bitmap (`Linie` / `Rechteck` / `Kreis` mit `Farbstift`), Raster-IRQ (ein `Sub`, der in jedem Frame vom Raster-Interrupt aufgerufen wird) |

Wenn die Kompilierung fehlschlägt:

Build Info meldet Lade-/Endadressen, Code- und PRG-Größen, Exomizer-Status,
Variablen, Arrays, Funktionen/Unterprogramme und Labels.

```asm
; @name Rasterbalken

@name.hu Rasterbalken

@category Effekte

@desc Zwei Rasterbalken im Rahmen.

@order 50
```

`@name`, `@category` und `@desc` können sprachspezifische Varianten haben
(`@name.hu`, `@desc.de`, …); `@order` sortiert die Liste. Alles nach dem Header
wird zur neuen Hauptdatei, und `{{PROJECT}}` wird durch den Projektnamen ersetzt
(verwenden Sie ihn in einem Kommentar, damit die Vorlage selbst weiterhin
kompiliert wird).

### Laufen, D64 und Exomizer

Die Haupt-Split-Taste **Run** unterstützt Ultimate Basic in jedem normalen Ziel:

- Jede kompilierbare Quelle (`.asm`, Block `.json`, `.ub`) wird zu einer `.prg`
  **neben ihrer Quelle** mit demselben Namen kompiliert; wenn **Run with
  Exomizer** aktiviert ist, wird die Ausgabe komprimiert;
- Debugger-Sidecar-Dateien (Symbole / Quellzuordnung) werden, sofern verfügbar,
  zusammen mit der PRG geschrieben;
- Module, die von einer anderen Datei mit `.include` / `include` (und `.inc`
  Dateien) eingebunden werden, werden übersprungen, ebenso wie Tabulatoren, die
  nie gespeichert wurden;
- Ein Bericht listet jede Datei mit ihrer Größe, dem Grund für das Überspringen
  oder einem Compilerfehler auf, und die Statusleiste zeigt die Anzahl der
  erstellten Dateien an.

### Debugger-Symbole und Disassemblierung

Die Builds fordern Ultimate Basic-Debug-Informationen an und erzeugen drei
kompatible Sidecars:

- `.sym` für Symbole im KickAssembler-Stil;
- `.dbg` für Quell- und Segmentinformationen von C64Debugger/RetroDebugger;
- `.vs` für VICE-Monitor-Labels.

### Handbuch und Quelle für Ultimate Basic

Das Buchsymbol in der UB-Symbolleiste öffnet das zugehörige Ultimate Basic
`MANUAL.pdf` offline; die Schaltfläche „Handbuch“ im Begrüßungsdialog öffnet
dasselbe Handbuch. Visual Assembler verwendet sowohl den Compiler als auch das
PDF aus der festgelegten Git/Cargo-Abhängigkeit, sodass die IDE keine zweite
Kopie der Ultimate Basic-Implementierung verwaltet. Im Dialogfeld „Über“ und auf
dem Startbildschirm wird die aktuelle Abhängigkeitsversion angezeigt.

- `* = $1500` → ORG-Block
- `Beschriftung:` → LABEL-Block
- `Label: .byte 0` → LABEL + BYTE-Blöcke
- `.byte ...` → BYTE-Block
- `; Kommentar` (oder inline `; ...`) → KOMMENTAR-Block
- Anweisungen (`lda`, `jsr`, `beq`, etc.) → Anweisungsblöcke mit erkanntem
  Adressierungsmodus

#### Hinweise und bewährte Vorgehensweisen zum Importieren

- Lokale Labels wie `.wait` werden als Standardlabels importiert (Punkt
  entfernt), und Referenzen werden entsprechend normalisiert.
- Für Adressierungen im Stil `($zp),Y` / `($zp,X)` sollte zur besseren
  Kompatibilität ein konkretes Nullseitenbyte (`$FB`, `$FC` usw.) verwendet
  werden.
- Vermeiden Sie mehrdeutige kurze Bezeichnungen, die wie Hexadezimalzahlen
  aussehen (`cc1`, `dead`, `beef`); bevorzugen Sie stattdessen Namen wie
  `loop_cc1`.
- Wenn Ihr Programm mit Daten (`.byte`) vor dem ausführbaren Code beginnt, fügen
  Sie oben einen expliziten Einstiegssprung hinzu (zum Beispiel `JMP Start`).

### ASM-Import (Kick Assembler)

Die Schaltfläche **ASM importieren** im Menü „Programm“ importiert rohen
Kick-Assembler-Quellcode in einen neuen Blockmodus-Tab. Sie ist von der oben
beschriebenen Funktion `Laden einer .asm-Datei im Expertenmodus ` getrennt – ihr
benutzerdefinierter Tooltip weist darauf hin, dass **nur Kick-Assembler-Code
unterstützt wird** (andere Assembler können den Code möglicherweise teilweise
parsen, aber eine vollständige Verarbeitung ist nicht garantiert).

Unterstützte Muster:

- `.pc = $XXXX` Ursprungsdirektive → ORG-Block
- `.const NAME = value`, `.label NAME = value` → CONST equate
- `.macro NAME(p1, p2, ...) { ... }` mit `{`/`}` geschweiften Klammern oder
  `.endm` → Benutzermakrodefinition
- Makroaufruf `NAME(args)`, Kick-Doppelpunktpräfix `:NAME(args)` und `.invoke
  NAME(args)` – alle über die Kick-Doppelpunktform
- `@local` labels (`@loop:`, `BEQ @loop`) preserve the `@` prefix as is
- Operand `label + N` / `label - N` (z.B. `STA mod1+2`, `LDA xp+1`)
- Zeilenkommentare `// ...` und `;` werden beide akzeptiert, `/* ... */`-Blöcke
  werden als eine einzelne Kommentarzeile behandelt.
- BASIC-Autostart-Passthrough: Wenn das Programm an Adresse `$0801` mit dem
  standardmäßigen Byte-Stub `SYS 2061` (`.byte
  $0B,$08,$0A,$00,$9E,$32,$30,$36,$31,$00,$00,$00`) startet, gibt der Compiler
  das PRG unverändert aus, anstatt es mit einem zweiten BASIC SYS zu
  umschließen.

Bekannte Einschränkung:

- Konstanten, die auf eine Nullseitenadresse aufgelöst werden (z. B. `.const
  BYTEADDR = $FC`, verwendet als `STA BYTEADDR`), werden aktuell in absolute
  Anweisungen (3 Byte) anstatt in Nullseitenanweisungen (2 Byte) kompiliert. Der
  kompilierte Code schreibt weiterhin an die korrekte Speicheradresse, jedoch
  mit einem geringen Mehraufwand an Größe und Rechenzyklen im Vergleich zum
  gleichen Quellcode, der mit Kick Assembler erstellt wurde.

## 6. Expertenmodus

Der Expertenmodus ist ein vollwertiger 6502-Bauteil-Editor mit direkter
Texteingabe, der parallel zum Blockeditor existiert. Jede Registerkarte kann
entweder im Block- oder im Expertenmodus verwendet werden – der Wechsel zwischen
den Modi ist jederzeit über den Schalter **Block / Experte** in der oberen
Leiste möglich.

### Schaltmodi

Wählen Sie das Symbol **UB** in der Hauptsymbolleiste, um in den Modus
„Ultimative Basiseinstellungen“ zu wechseln. Der ausgewählte Bearbeitungsmodus
bleibt auch nach einem Neustart der Anwendung erhalten. Eine neue Quelle beginnt
mit:

```basic
Hintergrundfarbe 0
Rahmenfarbe 0

Druck: „HALLO VON ULTIMATE BASIC“
```

Der UB-Modus funktioniert mit `.ub`-Quelldateien. **Neu**, **Öffnen**,
**Speichern** und **Speichern unter** werden im aktiven UB-Tab ausgeführt. Beim
Öffnen einer `.ub`-Datei wird der entsprechende Editor-Tab automatisch
aktiviert.

Die Symbolleiste zeigt den aktuellen UB-Arbeitsordner an. Dieser Ordner wird
separat vom Block-/Experten-Arbeitsordner gespeichert. Im UB-Modus wählt **Datei
→ Arbeitsordner festlegen** den UB-Ordner aus; die zugehörige QuickInfo zeigt
den aktiven Bereich an. Die Dialogfelder „Öffnen“ und „Speichern“ im UB-Modus
starten dort, und nicht gespeicherte Quellen verwenden ihn als Basis für
relative `include`- und `incbin`-Pfade.

### Editor-Layout

Die UB-Symbolleiste verwendet dieselbe visuelle Sprache und dieselben
benutzerdefinierten Tooltips wie der Expertenmodus. Sie bietet Folgendes:

- Syntaxhervorhebung basierend auf der aktuellen Ultimate Basic-Sprachreferenz;
- Zeilennummern bleiben mit langen Dateien synchronisiert;
- eine Minikarte und Zoom-Steuerelemente für den Editor (`Strg` + Mausrad zoomt
  ebenfalls); klicken Sie auf die Minikarte, um zu springen, oder ziehen Sie die
  Auswahl im Ansichtsfenster, um kontinuierlich zu scrollen;
- Suchen Sie (`Strg+F` / `Cmd+F`) mit Hilfe der Experten-Suchleiste;
- Quellcodeformatierung mit strukturorientierter Einrückung;
- Automatische Vervollständigung für Befehle und integrierte Funktionen;
- ein durchsuchbares **Befehlsfeld** mit Syntax, Beschreibung und
  Anwendungshinweisen – die Beschreibungen folgen der aktuellen UI-Sprache
  (Ungarisch, Englisch, Spanisch, Deutsch, Niederländisch), wobei für alles, was
  noch nicht übersetzt ist, auf Englisch zurückgegriffen wird;
- Unabhängig voneinander umschaltbare **Projekt** und **Befehle** Bedienfelder,
  die nebeneinander angezeigt werden, wenn beide aktiviert sind;
- Unabhängig voneinander umschaltbare und in ihrer Größe veränderbare
  Bedienfelder **Build Output** und **Disassembly**.

Das Disassemblierungsfenster enthält eine Schaltfläche **Kopieren**, die den
gesamten angezeigten Quellcode in die Zwischenablage kopiert. Die Befehlshilfe
ist dem mitgelieferten Compiler zugeordnet: Beispielsweise wählt
`Sprite-Frame-ID, Datenadresse [, Frame]` ein Animationsbild aus
aufeinanderfolgenden 64-Byte-Sprite-Frames aus.

Der Editor versteht auch die QBasic-ähnliche Syntax von Ultimate Basic 1.6.3:
`dim name as type`, `function … end function`, `sub … end sub`, `elseif`, `do …
loop [while | until]`, `while … wend`, `select case`, `exit do` / `exit for` /
`exit while` / `exit sub` / `exit function`, die Stringfunktionen `left$` /
`right$` / `mid$` und Kommentare, die mit `'` sowie `#` oder `rem` beginnen.
Wörter, die der Compiler nur an einer Position als Schlüsselwörter behandelt,
werden nur dort farbig hervorgehoben und bleiben als Namen verwendbar: `as` mit
den BASIC-Typnamen (`byte`, `integer`, `single`, `double`), `case is`, `map
view`, `wait key` und den `scroll`-Optionen (`row`, `x`, `y`, `links`, `rechts`,
`schmal`, `breit`). **Format** rückt die Blöcke `function`, `do … loop`, `while
… wend` und `elseif` ein und lässt einzeilige Schleifen (`do while c : … :
loop`) ungerückt, das Projektfenster listet `function`-Blöcke unter Funktionen
auf, und das Befehlsfenster enthält **DIM**, **FUNCTION**, **ELSEIF**, **DO**,
**WEND**. **SELECT CASE**, **END**, **EXIT SUB**, **LEFT$**, **RIGHT$** und
**MID$** Einträge.

Die Befehlsliste ist absichtlich in ihrer Höhe begrenzt, damit die
Befehlsdetailkarte die verbleibende Höhe des Bedienfelds ausfüllen kann. Der
Detailbereich lässt sich für längere Syntaxbeschreibungen unabhängig scrollen.

### Schaltflächen in der Symbolleiste

Ultimate Basic-Projekte verwenden `.proj`-Dateien und können mehrere
`.ub`-Quelldateien enthalten. Im Projektfenster werden geöffnete Dateien
aufgelistet, nicht gespeicherte Registerkarten markiert und gefundene Labels,
Funktionen und Unterprogramme angezeigt. Mit den Projektaktionen können Sie ein
Projekt erstellen, öffnen, speichern und schließen oder eine weitere Quelldatei
hinzufügen. Im Dialogfeld „Versionskontrolle“ können Sie alle Projektdateien
gemeinsam speichern, vergleichen und wiederherstellen – siehe
[Projektmodus](#project-mode). Ein neues Projekt kann auch auf einer
UltimateBasic-Vorlage basieren – siehe [Projektvorlagen](#project-templates).

Klicken Sie auf den Stern neben einer Projektdatei, um diese als **Startdatei**
zu markieren. Die Befehle „Erstellen“, „Ausführen“, „D64“, „C64 Ultimate“ und
„Debuggen“ kompilieren diese Startdatei, selbst wenn ein anderer Tab aktiv ist.
Ohne Auswahl einer Startdatei wird der aktive UB-Tab verwendet.

Die Projektfenster-Symbolleiste verfügt über zwei Schaltflächen zum Hinzufügen,
und Dateidialoge verwenden standardmäßig den **UB-Arbeitsordner** (Menü → Datei
→ Arbeitsordner festlegen, UB-spezifisch):

- **Datei hinzufügen** – Wählen Sie eine oder mehrere Dateien gleichzeitig aus
  (beliebiger Typ – `.ub`, `.bin`, `.prg`, Bilder, Schriftarten usw.).
  `.ub`-Quelldateien werden ebenfalls als Editor-Tabs geöffnet; alles andere
  wird nur als Referenz hinzugefügt, damit `incbin`/`loadfile`-Assets mit dem
  Projekt übertragen werden.
- **Ordner hinzufügen** — einen ganzen Ordner referenzieren (z.B. ein `incbin`
  Asset-Verzeichnis wie `fonts/`), damit er dem Projekt zugeordnet bleibt.

Ordner in der Baumstruktur verfügen über einen Ein-/Ausklapppfeil. Durch
Rechtsklicken auf einen Ordner können Sie eine oder mehrere darin enthaltene
Dateien hinzufügen (eingerückt dargestellt). Jeder Eintrag hat eine Löschtaste
(✕). Einträge, die nicht mit `.ub` gekennzeichnet sind, dienen nur als Referenz
und werden durch Anklicken nicht geöffnet.

Die Schaltfläche **Projekt speichern** deaktiviert sich automatisch und zeigt
den Status „Gespeichert“ an, sobald das Projekt keine ausstehenden Änderungen
mehr enthält. Sie wird automatisch wieder aktiviert, sobald Sie eine Datei oder
einen Ordner hinzufügen, entfernen oder neu organisieren.

### Minimap des Experten-Editors

Die Minimap des Experteneditors ist ein schmaler Canvas-Streifen (`88 px`) ganz
rechts im Editorbereich. Sie rendert eine verkleinerte Darstellung jeder
Quellcodezeile:

Ein halbtransparenter Anzeigebereichsindikator (**,**, farblich hervorgehobenes
Rechteck) zeigt den aktuell sichtbaren Bereich der Quelle an. Klicken Sie auf
eine beliebige Stelle der Minikarte, um zu dieser Position zu springen; ziehen
Sie, um kontinuierlich zu scrollen. Die Minikarte scrollt unabhängig, um den
Anzeigebereichsindikator zentriert zu halten. Der Status wird in den
UI-Einstellungen gespeichert (Taste `expertMinimap`).

- Die Build-Ausgabe wird automatisch angezeigt;
- Compilerfehler werden rot dargestellt;
- Im zentrierten Kompilierungsdialog wird der Fehler angezeigt;
- Fehler, die eine Quellzeile enthalten, wählen diese Zeile im aktiven UB-Editor
  aus.

Build Info meldet Lade-/Endadressen, Code- und PRG-Größen, Exomizer-Status,
Variablen, Arrays, Funktionen/Unterprogramme und Labels.

### Fehlerhervorhebung

Fehlerhafte Zeilen werden in Echtzeit, 350 ms nach jedem Tastendruck, rot
(**,**) hervorgehoben (getönter Hintergrund + linker Akzentrand). Die erste
Fehlermeldung wird ebenfalls in der Statusleiste angezeigt. Sobald die Zeile
korrigiert ist, verschwindet die Hervorhebung automatisch.

| Laufmodus                      | Grundlegendes Verhalten                                                                                                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Als PRG ausführen**          | Kompilieren und starten Sie die PRG direkt in VICE.                                                                                                                             |
| **Ausführung über D64**        | Kompilieren Sie, öffnen Sie den Standard-D64-Paketierungsdialog und starten Sie dann die Disk in VICE.                                                                          |
| **Auf Ultimate ausführen**     | Laden Sie das PRG über die konfigurierte C64 Ultimate REST-Verbindung hoch und führen Sie es aus.                                                                               |
| **D64 auf Hardware ausführen** | Packen Sie ein D64 und senden Sie es an den konfigurierten C64 Ultimate.                                                                                                        |
| **Kung Fu Flash 2**            | Kompilieren Sie den UB-Startquellcode und laden Sie die PRG-Datei per USB auf einen echten C64/C128 mit einem Kung Fu Flash 2-Modul. Siehe [Kung Fu Flash 2](#kung-fu-flash-2). |

Die globale Option **Einstellungen → Exomizer** gilt auch für UB-Builds und
normale Laufzeitziele; ein separater Schalter in der UB-Toolbar ist nicht
erforderlich. Debugger-Starts verwenden absichtlich die unkomprimierte
PRG-Datei, sodass Compileradressen und Symbole weiterhin mit dem ausgeführten
Programm übereinstimmen.

Aktivieren Sie unter **Einstellungen → Programmeinstellungen → UltimateBasic
ASM-Quellcode generieren (.asm)** die Option, um den vom Compiler generierten
Assembler-Code neben einem PRG- oder D64-Build mit demselben Basisdateinamen zu
speichern. Da es sich um eine Build-Option handelt, enthält die UB-Symbolleiste
keine separaten ASM-Exportschaltflächen. Mit der Anweisung `load "NAME",
$address` wird außerdem die PRG-Ladeadresse der entsprechenden D64-Zusatzdatei
angegeben.

### Syntaxhervorhebung

Der Editor verwendet eine transparente `<div>`-Überlagerung (`expert-hl`), die
den Inhalt des Textbereichs mit farbigen `<span>`-Elementen widerspiegelt. Die
Hervorhebung kann mit der Schaltfläche **HL** deaktiviert werden, um die
Leistung bei sehr großen Programmen zu verbessern.

- `.sym` für Symbole im KickAssembler-Stil;
- `.dbg` für Quell- und Segmentinformationen von C64Debugger/RetroDebugger;
- `.vs` für VICE-Monitor-Labels.

Die Direktiven `REGION` / `ENDREGION` werden wie die anderen
Assembler-Direktiven hervorgehoben. Reduzierte Regionen zeigen im Editor nur die
Regionsüberschrift an, bis sie wieder geöffnet werden. Die neue Option
**Regionsauswahl** in der Symbolleiste steuert lediglich die automatische
Hervorhebung der aktuellen Region im Expertenmodus; durch Deaktivieren bleibt
der Quellcode sichtbar, ohne den Faltstatus zu ändern.

### Quelltextformatierer

Klicken Sie auf die Schaltfläche **Format** (`#expert-format-btn`), um die
aktuelle Quelle automatisch zu formatieren:

Ultimate Basic ist auch als eigenständiges Open-Source-Projekt verfügbar:

<https://github.com/zstarczali/UltimateBasic>

Der Compiler ist in Visual Assembler integriert, daher ist zur Laufzeit keine
separate `ub`-Executable erforderlich.

## 7. Adressierungsmodi

Jeder 6502-Befehl unterstützt einen oder mehrere Adressierungsmodi. Der
Moduswähler befindet sich auf jedem Block.

### Labelausdrücke als Operanden

- **Block → Experte:** Das aktuelle Programm wird in Text serialisiert (eine
  Anweisung pro Zeile, Labels, Makros als Direktiven). Änderungen im
  Expertenmodus werden beim Zurückwechseln oder Auslösen einer Aktion mit dem
  Block-Array synchronisiert.
- **Experte → Block:** Der Text wird mit `parseAsmText()` analysiert und das
  Ergebnis ersetzt das Blockprogramm. Bei einem Analysefehler wird ein
  Kompilierfehlerdialog angezeigt.
- **Leere Zeilen** bleiben auch nach Hin- und Rückwechseln erhalten: Leere
  Zeilen im Expert-Editor erscheinen im Block-Modus als dünne gestrichelte
  Leerzeichen und werden beim Zurückwechseln in den Expert-Modus wieder als
  leere Zeilen dargestellt.

### Der `*`-Programmzähler in Ausdrücken

```
┌─────────────────────────────────────────────────────────┐
│ [Symbolleiste] Blockieren │ Experte &lt; Tab-Umschalter │
├────────────┬────────────────────────────┬────────────┤
│ Palette │ ASM-Texteditor │ Disasm │
│ (optional) │ (Monospace, bearbeitbar) │ Bedienfeld │
│ │ │ (optional) │
└────────────┴─────────────────────────────┴────────────┘
```

| Panel         | Umschalten            | Beschreibung                                                  |
| ------------- | --------------------- | ------------------------------------------------------------- |
| **Palette**   | `#expert-palette-btn` | Verzweigung zu sich selbst (Endlosschleife, Offset `$FE`)     |
| `*-n` / `*+n` | `BNE *-5`, `BEQ *+4`  | Verzweigung relativ zum aktuellen Programmzähler um *n* Bytes |
| `JMP *+n`     | `#expert-disasm-btn`  | Absoluter Sprung, berechnet vom aktuellen PC                  |

### Lokale (gepunktete) Bezeichnungen

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
| **Zeilennummern**                 | `#expert-line-numbers-btn`                     | Aktivieren/Deaktivieren Sie die Zeilennummerierungsleiste auf der linken Seite des Editors. Die Leerstelle bleibt mit der Scrollposition synchronisiert und wird während der Eingabe live aktualisiert.                                                                                                                 |
| **Finde**                         | `#expert-find-btn`                             | Öffnen Sie die schwebende Suchleiste (Strg+F). Geben Sie einen Suchbegriff ein; die Treffer werden in der Überlagerung hervorgehoben. Mit der Eingabetaste bzw. Umschalt+Eingabe können Sie zwischen den Treffern navigieren. Mit der Escape-Taste schließen Sie die Leiste.                                            |
| **Verkleinern / Vergrößern**      | `#expert-zoom-out-btn` / `#expert-zoom-in-btn` | Verringern/Vergrößern Sie die Schriftgröße im Editor (8–28 px). Die gleiche Funktion lässt sich durch Drücken von `Strg` + Mausrad (`Cmd` + Mausrad unter macOS oder durch Zusammenziehen des Mausrads auf dem Touchpad) über dem Editor einstellen. Die Einstellung wird gespeichert.                                  |
| **Palette**                       | `#expert-palette-btn`                          | Linke Mnemonikpalette ein-/ausblenden                                                                                                                                                                                                                                                                                   |
| **Disasm**                        | `#expert-disasm-btn`                           | Demontagefenster ein-/ausblenden (reines 6502, Makros erweitert)                                                                                                                                                                                                                                                        |
| **Monitor**                       | `#expert-monitor-btn`                          | Monitor-Hex-Dump-Panel ein-/ausblenden                                                                                                                                                                                                                                                                                  |
| **Minimap**                       | `#expert-minimap-btn`                          | Den Code-Minimap-Streifen auf der rechten Seite des Editors ein-/ausblenden.                                                                                                                                                                                                                                            |

*(Neu in Version 2.3.9.)* Eine Marke, deren Name mit einem Punkt beginnt –
`.loop`, `.skip`, `.done` – ist eine **lokale Marke**. Sie gehört zum
Gültigkeitsbereich der nächstgelegenen vorhergehenden **globalen** (nicht
gepunkteten) Marke und wird intern zu `<global>.<name>`. Zwei lokale Marken mit
demselben Kurznamen unter verschiedenen globalen Marken **kollidieren nicht**.

### Selbstmodifizierende Code-Operandenbezeichnungen

*(Neu in 2.3.9.)* Um ein Label auf das Operandenbyte **** anstatt auf den Opcode
zu setzen, wird dem Operandenbyte `label:` eine Marke vorangestellt. Der Befehl
wird aus dem nach dem Doppelpunkt folgenden Code assembliert.

| Balkenfarbe      | Token-Typ                                                |
| ---------------- | -------------------------------------------------------- |
| Kommentarfarbe   | Zeilen, die mit `;` beginnen                             |
| Etikettenfarbe   | Zeilen mit einer `label:` Definition                     |
| Richtlinienfarbe | `.byte`, `.macro`, `.region` und alle anderen Direktiven |
| Merkfarbe        | Alles andere (Anleitung)                                 |

Der Wert `value` zeigt in jedem Adressierungsmodus auf `<Befehlsadresse> + 1`
(das erste Operandenbyte). Dies ersetzt das ältere Muster `STA-Befehl+1` /
`Befehl: LDA #$00`. Es durchläuft dabei den Block- und Expertenmodus (das
Operandenfeld behält das Präfix `label:` bei).

### Fehlerhervorhebung

Fehlerhafte Zeilen werden in Echtzeit, 350 ms nach jedem Tastendruck, rot
hervorgehoben (getönter Hintergrund + linker Akzentrand). Die erste
Fehlermeldung wird ebenfalls in der Statusleiste angezeigt. Sobald die Zeile
korrigiert ist, verschwindet die Hervorhebung automatisch.

### Syntaxhervorhebung

Der Editor verwendet eine transparente Überlagerung (expert-hl), die den Inhalt
des Textbereichs mit farbigen Elementen spiegelt. Die Hervorhebung kann mit der
Schaltfläche HL deaktiviert werden, um die Leistung bei sehr großen Programmen
zu verbessern.

| Farbe      | Token                                                                                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gelbgrün   | Mnemonics (`LDA`, `STA`, `JMP`, …) und Long-Branch-Pseudo-Ops (`LBNE`, `LBEQ`, …)                                                                           |
| Blau       | Direktiven (`.byte`, `.word`, `.fill`, `.assert`, `*=`, …)                                                                                                  |
| Orange     | Zahlen (`$FF`, `%1010`, `255`)                                                                                                                              |
| Cyan       | Labels — Zeilen, die mit `:` enden, einschließlich lokaler Labels (`.loop:`) und selbstmodifizierender Code-Operanden-Labels (`value:` in `LDA value:#$00`) |
| Türkis     | Zeichenkettenliterale                                                                                                                                       |
| Violett    | Benutzerdefinierte Makronamen – der Name nach `.macro`, `.invoke` und `.call` sowie Kick-artigen Aufrufen `:name(...)`.                                     |
| Aqua       | Makroparameter – die Parameternamen im `.macro`-Header und die `{param}`-Ersetzungen im Makrokörper                                                         |
| Dunkelgrün | Kommentare (`; …`)                                                                                                                                          |

Die Direktiven `REGION` / `ENDREGION` werden wie die anderen
Assembler-Direktiven hervorgehoben. Reduzierte Regionen zeigen im Editor nur die
Regionsüberschrift an, bis sie wieder geöffnet werden. Die neue Option
**Regionsauswahl** in der Symbolleiste steuert lediglich die automatische
Hervorhebung der aktuellen Region im Expertenmodus; durch Deaktivieren bleibt
der Quellcode sichtbar, ohne den Faltstatus zu ändern.

### Quelltextformatierer

Klicken Sie auf die Schaltfläche **Format** (`#expert-format-btn`), um die
aktuelle Quelle automatisch zu formatieren:

- Die Labeldefinitionen werden in Spalte 0 verschoben.
- Die Anweisungen sind mit 4 Leerzeichen eingerückt.
- Eselsbrücken werden in Großbuchstaben geschrieben.
- Zwischen Mnemonik und Operand befindet sich genau ein Leerzeichen (zusätzliche
  Leerzeichen werden normalisiert).
- Wenn die Quelle bereits formatiert ist, wird der Status `"Bereits formatiert"`
  angezeigt.

### Projektbereich & Registerkarten

Der Expertenmodus unterstützt ein **Projektpanel** (`#expert-project-panel`) für
`.proj`-Projekte mit mehreren Dateien:

- Eine `.proj`-Datei ist ein JSON-Manifest, das Quelldateien und deren Metadaten
  auflistet.
- Öffnen Sie ein Projekt mit **Menü → Datei → Projekt öffnen** oder ziehen Sie
  eine `.proj`-Datei in das Fenster.
- Jede Datei im Projekt öffnet sich als separater **Tab** in der Tableiste am
  oberen Rand des Editors.
- **Projekt schließen** (`Menü → Datei → Projekt schließen` /
  `#menu-close-project`) schließt das aktuelle Projekt und alle zugehörigen
  Dateiregisterkarten gleichzeitig. Vor dem Schließen werden Sie aufgefordert,
  nicht gespeicherte Änderungen zu speichern. Das Projektfenster wird auf seinen
  leeren Zustand zurückgesetzt und `_expertProjectData` wird gelöscht.
- Jede Datei kann als **Startdatei** (★ Sternsymbol) markiert werden. Wenn eine
  Startdatei festgelegt ist, kompiliert und führt die Schaltfläche **Ausführen**
  (PRG, D64, Ultimate) immer den Code dieser Datei aus – unabhängig vom aktuell
  aktiven Tab. Dies funktioniert sowohl im Blockmodus als auch im Expertenmodus.
- Die Schaltfläche „Hinzufügen“ in der Symbolleiste (X14X) wählt eine oder
  mehrere Dateien gleichzeitig aus (beliebiger Typ, nicht nur JSON- oder
  Asm-Dateien) und referenziert sie im Projekt, ohne sie zu öffnen. Verwenden
  Sie diese Funktion für Binärdateien wie INCBIN-Daten (X185X). Der Dialog
  öffnet standardmäßig das VA-Arbeitsverzeichnis. Die danebenliegende
  Schaltfläche „Ordner hinzufügen“ (X259X) referenziert auf dieselbe Weise einen
  ganzen Ordner (z. B. ein Asset-Verzeichnis). Einträge, die nur referenziert
  werden, zeigen eine Löschschaltfläche (✕) an, werden aber durch Anklicken
  nicht geöffnet.
- Die Ordner in der Baumstruktur verfügen über einen Ein-/Ausklapppfeil. Durch
  einen Rechtsklick auf einen Ordner können Sie eine oder mehrere darin
  verschachtelte Dateien hinzufügen (eingerückt dargestellt).
- Die Schaltfläche **Projekt speichern** deaktiviert sich automatisch und zeigt
  den Status „Gespeichert“ an, sobald das Projekt keine ausstehenden Änderungen
  mehr enthält. Sie wird automatisch wieder aktiviert, sobald Sie eine Datei
  oder einen Ordner hinzufügen, entfernen oder neu organisieren.
- Der Abschnitt **symbols** am unteren Rand des Projektfensters kann mithilfe
  der Trennlinie zwischen Dateibaum und Symbolliste vertikal in der Größe
  angepasst werden, sodass lange Symbollisten bei Bedarf mehr Platz einnehmen
  können.
- Die Versionskontrolle funktioniert für das gesamte Projekt: Mit der Option
  „Projekt“ im Dialogfeld „Versionskontrolle“ wird bei einem Commit jede
  Projektdatei erfasst, und beim Auschecken werden alle Dateien in den
  Registerkarten wiederhergestellt. Siehe Projektmodus.

### Tableiste

Die Tableiste erscheint oberhalb des Editors, wenn mehr als ein Tab geöffnet
ist.

| Besonderheit          | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Schmutziger Punkt** | Ein kleiner, farblich hervorgehobener Punkt auf dem Tabnamen kennzeichnet nicht gespeicherte Änderungen.                                                                                                                                                                                                                                                                                                          |
| **Scrollpfeile**      | Links/rechts Scroll-Schaltflächen werden angezeigt, wenn mehr Tabs vorhanden sind, als in die Leiste passen.                                                                                                                                                                                                                                                                                                      |
| **Schließen (×)**     | Schließt den Tab; fordert zum Speichern auf, falls der Tab geändert wurde.                                                                                                                                                                                                                                                                                                                                        |
| **Dateierweiterung**  | Der vollständige Dateiname einschließlich Erweiterung (`.c64va`, `.json`) wird angezeigt                                                                                                                                                                                                                                                                                                                          |
| **Rechtsklickmenü**   | Klicken Sie mit der rechten Maustaste auf einen Tab (oder einen leeren Bereich der Tableiste), um Folgendes auszuwählen: **Neuer Tab**, **Tab schließen**, **Weitere Tabs schließen**, **Tabs rechts schließen**, **Alle Tabs schließen**. Beim Schließen mehrerer Tabs gleichzeitig werden Sie für jeden geänderten Tab gefragt und der Vorgang wird abgebrochen. **Alle schließen** lässt immer einen Tab leer. |

> Tipp: Die Palettensynchronisierung (#expert-palette-sync-btn) sorgt dafür,
> dass die Palettenauswahl mit der Tastenkombination am Cursor synchronisiert
> bleibt. Deaktivieren Sie diese Funktion, wenn Sie nicht möchten, dass die
> Palette während der Bearbeitung springt.

---

## 8. Standard 6502 Anweisungen

Jeder 6502-Befehl unterstützt einen oder mehrere Adressierungsmodi. Der
Moduswähler befindet sich auf jedem Block.

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

### Datenbewegung

Jedes Operandenfeld, das eine Adresse oder einen unmittelbaren Wert akzeptiert,
akzeptiert auch direkt einen **Konstantennamen** (aus einem `CONST`-Block oder
einem `LABEL`). Zusätzlich können Sie die Ausdrücke **label+offset** oder
**label−offset** verwenden, um eine Adresse relativ zu einer benannten Konstante
zu referenzieren:

| Syntax | Beispiel            | Beschreibung                                                                                                                   |
| ------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `LDA`  | Lastspeicher        | unmittelbar, Nullseite, absolut, absolutX, absolutY, indirektX, indirektY                                                      |
| `LDX`  | X-Register laden    | sofort, Nullseite, NullseiteY, absolut, absolutY                                                                               |
| `LDY`  | Y-Register laden    | sofort, Nullseite, absolut, absolutX                                                                                           |
| `STA`  | Speicherakkumulator | zeroPage, absolute, absoluteX, absoluteY, indirectX, indirectY                                                                 |
| `STX`  | Kasse Filiale X     | zeroPage, zeroPageY, absolute                                                                                                  |
| `STY`  | Kasse im Geschäft Y | zeroPage, absolute                                                                                                             |
| `*`    | `BNE *`             | Aktueller Programmzähler (die Adresse der Anweisung selbst); Verzweigungen mit `*` erzeugen eine Endlosschleife (Offset `$FE`) |

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

### Arithmetik

*(Neu in 2.3.9.)* `*` ist nicht mehr auf den gesamten Operanden beschränkt – es
kann **an beliebig innerhalb eines Operandenausdrucks** vorkommen und steht für
die Adresse der Anweisung, in der es steht. Es wird zur Assemblierungszeit
anhand der tatsächlichen Adresse dieser Anweisung aufgelöst, sodass für kurze
relative Sprünge oder PC-relative Datenlesevorgänge keine Marke benötigt wird.

| Syntax | Beispiel                  | Bedeutung                                                                       |
| ------ | ------------------------- | ------------------------------------------------------------------------------- |
| `*`    | `BNE *`                   | Stellen Sie die Trageoption `SEC` vor der Verwendung in den meisten Fällen ein. |
| `SBC`  | Subtrahieren mit Übertrag | Setze den Übertrag vor der Subtraktion mit `SEC`.                               |
| `INC`  | Speicher inkrementieren   | —                                                                               |
| `DEC`  | Speicher dekrementieren   | —                                                                               |
| `CMP`  | Vergleiche mit A          | Setzt Flags; ändert A nicht.                                                    |

**PC vs. Multiplikation.** `*` wird nur dann als Programmzähler behandelt, wenn
es sich an der *Wertposition* befindet – am Anfang des Ausdrucks oder direkt
nach einem Operator, `(`, `,`, `&lt;`, `&gt;` oder einem Leerzeichen. Ein `*`,
das auf eine Zahl, `)` oder einen Bezeichner folgt, ist eine gewöhnliche
Multiplikation, daher bleiben `LDA table*2` und `CONST_A*4` unverändert.

**Wo es funktioniert.** Jeder Operand, der bereits einen Ausdruck akzeptiert:
Sprungziele, `JMP` / `JSR`, `LDA`/`STA`/… absolute und indizierte, unmittelbare
Low-/High-Byte-Operatoren und der Ausdruck `.assert`. `*` ändert niemals die
Größe einer Anweisung, daher ist es in jedem Adressierungsmodus sicher.

### Logik

*(Neu in 2.3.9.)* Eine Marke, deren Name mit einem Punkt beginnt – `.loop`,
`.skip`, `.done` – ist eine **lokale Marke**. Sie gehört zum Gültigkeitsbereich
der nächstgelegenen vorhergehenden **globalen** (nicht gepunkteten) Marke und
wird intern zu `<global>.<name>`. Zwei lokale Marken mit demselben Kurznamen
unter verschiedenen globalen Marken kollidieren nicht.

```
DrawSprite:
LDX #0
.loop: ; == DrawSprite.loop
LDA SpriteData,X
STA $2000,X
INX
CPX #63
BNE .loop ; wird innerhalb von DrawSprite aufgelöst
RTS

ClearScreen:
LDX #0
.loop: ; == ClearScreen.loop — kein Konflikt
STA $0400,X
INX
BNE .loop
RTS
```

- Innerhalb eines Gültigkeitsbereichs kann auf eine lokale Bezeichnung mit der
  Form `.name` verwiesen werden.
- Aus einem anderen Gültigkeitsbereich kann explizit darauf verwiesen werden als
  `Global.name` (z. B. `JMP ClearScreen.loop`).
- Ein `.name`, das vor einer globalen Marke geschrieben wird, bleibt ein
  einfacher Top-Level-`.name`.
- Lokale Labels werden beim Wechsel zwischen Block- und Expertenmodus
  unverändert beibehalten; das Präfix `<global>.` ist ein Layout-Detail und wird
  niemals im Blockprogramm gespeichert.

### Sprünge & Äste

*(Neu in 2.3.9.)* Um ein Label auf das Operandenbyte **** anstatt auf den Opcode
zu setzen, wird dem Operandenbyte `label:` eine Marke vorangestellt. Der Befehl
wird aus dem nach dem Doppelpunkt folgenden Code assembliert.

```
Setup:

LDA Wert: #$00 ; 'Wert' -&gt; Adresse des Operandenbytes #$00

Patch:

LDA #neu

STA Wert ; schreibt das Operandenbyte direkt — klassisches SMC
```

Der Wert `value` zeigt in jedem Adressierungsmodus auf `<Befehlsadresse> + 1`
(das erste Operandenbyte). Dies ersetzt das ältere Muster `STA-Befehl+1` /
`Befehl: LDA #$00`. Es durchläuft dabei den Block- und Expertenmodus (das
Operandenfeld behält das Präfix `label:` bei).

---

## 9. Makroblöcke – Referenz

### LABEL

| Mnemotechnik | Beschreibung                                             | Modi                                                                      |
| ------------ | -------------------------------------------------------- | ------------------------------------------------------------------------- |
| Labelname    | Kennung, die in `JMP`, `JSR`, `BNE` usw. verwendet wird. | unmittelbar, Nullseite, absolut, absolutX, absolutY, indirektX, indirektY |
| `LDX`        | X-Register laden                                         | sofort, Nullseite, NullseiteY, absolut, absolutY                          |
| `LDY`        | Lade Y-Register                                          | sofort, Nullseite, absolut, absolutX                                      |
| `STA`        | Speicherakkumulator                                      | zeroPage, absolute, absoluteX, absoluteY, indirectX, indirectY            |
| `STX`        | Kasse Filiale X                                          | zeroPage, zeroPageY, absolute                                             |
| `STY`        | Kasse im Geschäft Y                                      | zeroPage, absolute                                                        |

### COMMENT

| Mnemotechnik | Beschreibung              | Anmerkungen                                                                     |
| ------------ | ------------------------- | ------------------------------------------------------------------------------- |
| `ADC`        | Addieren mit Übertrag     | Stellen Sie die Trageoption `SEC` vor der Verwendung in den meisten Fällen ein. |
| `SBC`        | Subtrahieren mit Übertrag | Setze den Übertrag vor der Subtraktion mit `SEC`.                               |
| `INC`        | Speicher inkrementieren   | —                                                                               |
| `DEC`        | Speicher dekrementieren   | —                                                                               |
| `CMP`        | Vergleiche mit A          | Setzt Flags; ändert A nicht.                                                    |
| `CPX`        | Vergleiche mit X          | —                                                                               |
| `CPY`        | Vergleiche mit Y          | —                                                                               |

### BYTE

| Mnemotechnik | Beschreibung                                                      |
| ------------ | ----------------------------------------------------------------- |
| Operand      | Kommagetrennte Bytewerte (z. B. `$01, $02, $FF` oder `1, 2, 255`) |
| `ORA`        | Logisches ODER mit Akkumulator                                    |
| `EOR`        | Exklusives ODER mit Akkumulator                                   |
| `BIT`        | Testet die Bits im Speicher gegen A (setzt die Flags N, V und Z)  |

### WORD

| Mnemotechnik | Beschreibung                                                          |
| ------------ | --------------------------------------------------------------------- |
| Operand      | Durch Kommas getrennte 16-Bit-Werte (z. B. `$0400, $C000`)            |
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

*(Neu in 2.3.9.)* Die Palettenkategorie **Lange Verzweigungen** enthält acht
Pseudo-Operationen, die sich wie bedingte Verzweigungen verhalten, aber
**beliebige Adressen** erreichen können, nicht nur −128…+127. Jede dieser
Operationen wird zu einer invertierten Verzweigung assembliert, die einen
3-Byte-JMP` überspringt – immer `5 Bytes**:

```
LBEQ abgeschlossen; wird zusammengestellt zu: BNE *+3 ($D0 $03)

JMP abgeschlossen ($4C lo hi)
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

- Operand: eine Marke, ein `*`-Ausdruck oder eine Literaladresse – genau wie bei
  einem normalen Verzweigungsziel.
- Kosten: 5 Bytes und 1 zusätzlicher Zyklus auf dem eingeschlagenen Pfad im
  Vergleich zu einer kurzen Verzweigung. Eine automatische Erweiterung einer
  kurzen Verzweigung findet nicht statt – Sie wählen `LBxx` explizit.
- Wenn ein einfacher Zweig (`BNE`, `BEQ`, …) außerhalb des gültigen Bereichs
  liegt, gibt der Compilerfehler nun den genauen Überschuss an und schlägt den
  passenden Zweig `LBxx` vor.

### FILL

| Mnemotechnik | Beschreibung                                             |
| ------------ | -------------------------------------------------------- |
| Operand      | `count,value` — z. B. füllt `256,0` 256 Bytes mit Nullen |
| `TAY`        | Transfer A → Y                                           |
| `TXA`        | Transfer X → A                                           |
| `TYA`        | Transfer Y → A                                           |
| `TSX`        | Übertrage den Stack-Pointer → X                          |
| `TXS`        | Übertrage X → Stapelzeiger                               |
| `INX`        | Inkrement X                                              |
| `DEX`        | X verringern                                             |
| `INY`        | Y-Schritt                                                |
| `DEY`        | Y verringern                                             |

### ALIGN

| Mnemotechnik | Beschreibung                                                                   |
| ------------ | ------------------------------------------------------------------------------ |
| Grenze       | Ausrichtungswert – z. B. `64` (Sprite-Grenze), `256` (Seite), `$2000` (Bitmap) |
| `LSR`        | Logische Rechtsverschiebung                                                    |
| `ROL`        | Nach links drehen durch Übertragen                                             |
| `ROR`        | Rechts drehen durch Übertragen                                                 |

### TEXT

| Mnemotechnik       | Beschreibung                                                                  |
| ------------------ | ----------------------------------------------------------------------------- |
| Text               | Die anzuzeigende Zeichenkette                                                 |
| X                  | Spalte (0–39)                                                                 |
| Y                  | Reihe (0–24)                                                                  |
| Etikett (optional) | Weist eine Bezeichnung zu, die auf die berechnete Bildschirmadresse verweist. |

### STRING

| Mnemotechnik                | Beschreibung                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------- |
| Text                        | Die zu schreibende Zeichenkette                                                                         |
| Adresse                     | Zielspeicheradresse — `$C000` hex oder ein **Labelname**                                                |
| Etikett (optional)          | Weist eine Bezeichnung zu, die auf die Zieladresse verweist.                                            |
| Schicht                     | Hexadezimalwert (00–FF), der zu jedem Bildschirmcodebyte addiert wird (z. B. `$80` = umgekehrtes Video) |
| Kleinbuchstaben-Zeichensatz | Kontrollkästchen – gleiche Semantik wie TEXT (siehe Abschnitt TEXT)                                     |
| `SED`                       | Dezimalmodus einstellen                                                                                 |
| `SEI`                       | Interrupt deaktivieren                                                                                  |
| `NOP`                       | Keine Operation                                                                                         |
| `BRK`                       | Erzwingen des Abbruchs / Softwareunterbrechung                                                          |

### DATA

Wie eine **POKE-Schleife** — schreibt eine Liste von Rohbytes zur Laufzeit an
eine Speicheradresse, ein LDA/STA-Paar pro Byte.

**Expertensyntax:**

---

## 10. Debugger-Integration

Die App unterstützt **RetroDebugger** als externen C64-Debugger. Sie empfängt
Haltepunkte, Symbole und Autostart-Flags, die vom assemblierten Programm
generiert werden.

---

### RetroDebugger

[RetroDebugger]{1} ist ein plattformübergreifender Commodore 64 Debugger mit
Breakpoint-Unterstützung, Speicherinspektion und labelbasierter
Disassemblierung.

| Feld      | Beschreibung                                             |
| --------- | -------------------------------------------------------- |
| Labelname | Kennung, die in `JMP`, `JSR`, `BNE` usw. verwendet wird. |

**Expertensyntax:**
```
Schleife:
```

**Generiertes ASM:**
```
Schleife: ; $0820
```

Die aktuelle Adresse wird als Kommentar angezeigt. Labels haben eine Größe von
**0 Byte**.

---

### Haltepunktblöcke

Klicken Sie auf das Haltepunktsymbol (●) in einem beliebigen Anweisungsblock, um
diesen als Haltepunkt zu aktivieren. Haltepunktblöcke werden rot hervorgehoben.
Ihre Adressen werden bei jedem Start des Debuggers in die Haltepunktdatei
geschrieben.

**Expertensyntax:**
```
Ihr Kommentartext hier
```

**Generiertes ASM:**
```
Ihr Kommentartext hier
```

---

### Debugger-Flags (Registerkarte „Optionen“)

Wie **DATA in BASIC** — speichert eine Liste von Rohbytewerten direkt im
Programm.

| Feld    | Beschreibung |
| ------- | ------------ |
| Operand | `-jmp $ADDR` |

**Expertensyntax:**
```
.byte $01, $02, $FF
```

**Generiertes ASM:**
```
.byte $01, $02, $FF
```

**Lo/Hi-Byte-Label-Referenzen: ** BYTE akzeptiert KickAssembler-/ca65-artige
Token `<label` (niederwertiges Byte) und `>label` (hochwertiges Byte) neben
numerischen Werten. Der Assembler löst die Labeladresse zur Kompilierzeit auf
und fügt das entsprechende Byte ein. Beispiel:

```
.byte <frame_0, >frame_0, <frame_1, >frame_1
```

Hier wird das niederwertige Byte der Adresse von `frame_0` gespeichert, dann das
höherwertige Byte und anschließend das gleiche für `frame_1`. Nützlich zum
Erstellen von Sprungtabellen und Adresslisten.

**Größe:** Anzahl der Bytes in der Liste.

---

### WORT

Wie **DATA in BASIC, aber für 16-Bit-Zahlen**. Jeder Wert wird als zwei Bytes
gespeichert (zuerst das niederwertige Byte, dann das höherwertige Byte – 6502
Little-Endian-Reihenfolge).

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

### FÜLLEN

Wie `FOR I=1 TO N : POKE addr+I, val : NEXT` — füllt einen Speicherblock mit
demselben Byte, jedoch in einem einzigen Block. Ideal zum Löschen von Bereichen
oder Vorbefüllen von Tabellen.

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

**Ausdruckssyntax:** Sowohl `count` als auch `value` akzeptieren arithmetische
Ausdrücke. Sie können auf CONST-Namen verweisen, Hexadezimal-/Binärliterale
verwenden und integrierte mathematische Funktionen aufrufen:

| Ausdruck                    | Bedeutung                                    |
| --------------------------- | -------------------------------------------- |
| `TILE_COUNT, $00`           | Zählen Sie von einer CONST, Wert hexadezimal |
| `40*25, 0`                  | Inline-Multiplikation                        |
| `round(sin(PI/4)*255), $80` | Trigonometrie                                |

**Eingebaute Funktionen:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, constant `PI`

Operatoren: `+ - * /` Literale: `$FF` (hex), `%10110000` (binär)
Niedrigstes/höchstes Byte: `lo(expr)`, `hi(expr)`

**Größe:** Der Zählerwert in Bytes.

---

### AUSRICHTEN

Verschiebt die aktuelle Adresse durch Einfügen von Null-Auffüllungsbytes zur
nächsten freien Grenze. Der C64 benötigt Sprite-Daten, die an einer
64-Byte-Grenze beginnen – `ALIGN 64` erledigt dies automatisch.

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
; ALIGN 64 → $0840 (12 Bytes Padding)
```

**Größe:** Dynamisch — abhängig von der aktuellen Programmzählerposition.

> **Tipp:** Verwenden Sie `ALIGN 64` vor Sprite-Daten, `ALIGN 256` um
> seitenbündige Tabellen zu gewährleisten.

---

### TEXT

Wie **PRINT AT** schreibt es Text direkt auf den C64-Bildschirm in einer
bestimmten Spalte und Zeile, ohne den KERNAL zu verwenden. Es erzeugt ein
LDA/STA-Paar pro Zeichen und zielt auf den Bildschirm-RAM an `$0400` ab.

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

- **Großbuchstaben (Standard, Kontrollkästchen deaktiviert):** Geben Sie ein,
  was in Großbuchstaben angezeigt werden soll. `"HELLO"` wird als `HELLO`
  angezeigt. Kleinbuchstaben werden Großbuchstaben-Bildschirmcodes zugeordnet.
- **Kleinbuchstaben-Zeichensatz (Kontrollkästchen aktiviert):** Geben Sie die
  gewünschte Schreibweise ein. `"hello"` → Anzeige in Kleinbuchstaben, `"HELLO"`
  → Anzeige in Großbuchstaben. Erfordert einen Laufzeit-Zeichensatzwechsel,
  bevor der Bildschirm geschrieben wird (verwenden Sie das Makro **CHARSET
  lower**).

**Generierter ASM (Großbuchstabenmodus, `"HELLO"`):**
```
LDA #$08 ; Siebdruckcode 'H' $08
STA $0400
LDA #$05 ; Siebdruckcode 'E' $05
STA $0401

...
```

**Expertensyntax:**
```
.text 0, 2, "HELLO" ; Großbuchstaben (Standard)
.text 0, 2, "hello", lower ; Kleinbuchstaben
```

Die Zeichen werden als **Bildschirmcodes** (nicht PETSCII) kodiert. **Größe:**
`Textlänge × 5` Bytes (LDA + STA pro Zeichen).

---

### Saite

Wie **POKE, das zur Laufzeit eine Zeichenkette ** in eine beliebige
Speicheradresse schreibt. Erzeugt LDA/STA-Paare, die den Bildschirmcode jedes
Zeichens in aufeinanderfolgende Adressen kopieren.

| Feld                        | Beschreibung                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------- |
| Text                        | Die zu schreibende Zeichenkette                                                                         |
| Adresse                     | Zielspeicheradresse — `$C000` hex oder ein **Labelname**                                                |
| Etikett (optional)          | Weist eine Bezeichnung zu, die auf die Zieladresse verweist.                                            |
| Schicht                     | Hexadezimalwert (00–FF), der zu jedem Bildschirmcodebyte addiert wird (z. B. `$80` = umgekehrtes Video) |
| Kleinbuchstaben-Zeichensatz | Kontrollkästchen – gleiche Semantik wie TEXT (siehe Abschnitt TEXT)                                     |

**Expertensyntax:**
```
.string $C000, "HELLO" ; Großbuchstaben (Standard)
.string $C000, "hello", lower ; Kleinbuchstaben
.string $C000, "HELLO", 80 ; mit Shift (Video umkehren)
.string $C000, "hello", 80, lower ; Shift + Kleinbuchstaben
.string $C000, "HELLO" :my_string ; mit Makrobezeichnung
```

**Generiertes ASM:**
```
LDA #$08 ; Bildschirmcode „H“

STA $C000

LDA #$05 ; Bildschirmcode „E“

STA $C001

…
```

Zeichen werden als **Bildschirmcodes** (nicht PETSCII) kodiert. Der optionale
Wert **Shift** wird zu jedem Byte addiert, z. B. `$80` für umgekehrtes Video.
**Größe:** `Textlänge × 5` Bytes (ein LDA + ein STA pro Zeichen).

---

### DATEN

Wie eine **POKE-Schleife** — schreibt eine Liste von Rohbytes zur Laufzeit an
eine Speicheradresse, ein LDA/STA-Paar pro Byte.

| Feld               | Beschreibung                                                 |
| ------------------ | ------------------------------------------------------------ |
| Bytes              | Kommagetrennte Byte-Werte                                    |
| Adresse            | Zielspeicheradresse — `$C000` hex oder ein **Labelname**     |
| Etikett (optional) | Weist eine Bezeichnung zu, die auf die Zieladresse verweist. |

**Expertensyntax:**
```
.data $C000, $01, $02, $03 ; Hexadezimaladresse

.data my_buf, $01, $02, $03 ; Labeladresse

.data $C000, $01, $02, $03 :mydata ; mit MakroLabel
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

Wie **DATA, das direkt in den Speicher geladen wird** – ganz ohne Laufzeitcode.
Die Bytes sind ab dem Zeitpunkt des Ladens des PRG vorhanden, noch bevor Ihr
Code startet. Verwenden Sie dies für Sprite-Daten, Level-Maps, Lookup-Tabellen
und alles, was sich an einer bestimmten Adresse befinden muss.

| Feld               | Beschreibung                                                 |
| ------------------ | ------------------------------------------------------------ |
| Bytes              | Kommagetrennte Byte-Werte                                    |
| Adresse            | Zielspeicheradresse — `$C000` hex oder ein **Labelname**     |
| Etikett (optional) | Weist eine Bezeichnung zu, die auf die Zieladresse verweist. |

**Expertensyntax:**
```
.rawbytes $C000, $00, $00, $00 ; Hexadezimaladresse

.rawbytes sprite_data, $00, $00 ; Labeladresse

.rawbytes $0C50, $00, $00 :nev ; mit macroLabel – anderer Code kann LDA nev,X verwenden
```

**Größe im Code:** 0 Bytes. Die Daten werden an der angegebenen Adresse in der
Ausgabe platziert.

> **DATA vs. RAWBYTES:** DATA generiert LDA/STA-Code, der Bytes zur Laufzeit
> kopiert (langsamer, aber geeignet, wenn die Daten dynamisch sein müssen).
> RAWBYTES platziert die Bytes direkt – ohne Code, sofort, ohne Kosten.

---

### Rohtext

Ähnlich wie RAWBYTES, jedoch für Text – die Zeichenkette wird als Bildschirmcode
kodiert und die Bytes werden an einer festen Adresse ohne Laufzeitcode **
abgelegt. Der Text ist im Speicher verfügbar, sobald die PRG geladen ist.

| Feld                        | Beschreibung                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------- |
| Text                        | Zu kodierende Zeichenkette                                                                              |
| Adresse                     | Zielspeicheradresse — `$C000` hex oder ein **Labelname**                                                |
| Etikett (optional)          | Weist eine Bezeichnung zu, die auf die Zieladresse verweist.                                            |
| Schicht                     | Hexadezimalwert (00–FF), der zu jedem Bildschirmcodebyte addiert wird (z. B. `$80` = umgekehrtes Video) |
| Kleinbuchstaben-Zeichensatz | Kontrollkästchen – gleiche Semantik wie TEXT (siehe Abschnitt TEXT)                                     |

**Expertensyntax:**
```
.rawtext $C000, "HELLO" ; Großbuchstaben (Standard)
.rawtext $C000, "hello", lower ; Kleinbuchstaben

.rawtext $C000, "HELLO", 80 ; mit Shift (Video invertieren)

.rawtext $C000, "hello", 80, lower ; Shift + Kleinbuchstaben

.rawtext $0400, "HELLO" :my_text ; mit Makro-Label
```

**Generiertes ASM:**
```
; .rawtext "HELLO" -&gt; $C000

; $C000

.byte $08, $05, $0C, $0C, $0F ; H E L L O (Bildschirmcodes in Großbuchstaben)


; .rawtext "hello", lower -&gt; $C000


; $C000

.byte $48, $45, $4C, $4C, $4F ; h e l l o (Bildschirmcodes in Kleinbuchstaben, Bereich $41–$5A)
```

**Größe im Code:** 0 Bytes. Die Daten werden an der angegebenen Adresse in der
Ausgabe platziert.

> **STRING vs RAWTEXT:** STRING generiert LDA/STA-Code, der den Text zur
> Laufzeit kopiert. RAWTEXT bettet die Bytes beim Laden in die PRG ein – kein
> Code, keine Wartezeit.

---

### PETSCII

Ähnlich wie **RAWBYTES, jedoch für die KERNAL-Ausgabe** – kodiert die
Zeichenkette als PETSCII-Bytes (kompatibel mit CHROUT unter `$FFD2`) und
speichert sie an einer festen Adresse ohne Laufzeitcode. Verwenden Sie dies,
wenn Sie Zeichen über `JSR $FFD2` in einer Schleife ausgeben möchten. Beachten
Sie, dass das neue Makro `PRINT` denselben Kodierer und dasselbe Verhalten wie
die Kontrollkästchen für Kleinbuchstaben verwendet.

> **PETSCII vs. Bildschirmcodes:** PETSCII und Bildschirmcodes sind zwei
> unterschiedliche Kodierungen. Bildschirmcode `$01` = Buchstabe A; PETSCII
> `$41` = Buchstabe A (über CHROUT). Verwenden Sie PETSCII nur beim Drucken über
> den Kernel; verwenden Sie TEXT/STRING/RAWTEXT zum direkten Schreiben in den
> Bildschirmspeicher.

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
.petscii $C000, "HELLO" ; Großbuchstaben PETSCII (Standard)
.petscii $C000, "hello", lower ; Kleinbuchstaben PETSCII ($61–$7A)
.petscii $C000, "HELLO", null ; mit Nullbyte

.petscii $C000, "hello", lower, null ; Kleinbuchstaben + Nullbyte

.petscii $C000, "HELLO" :my_msg ; mit Makrolabel
```

**Generierte Bytes (Großbuchstaben, `"HELLO"`):**
```
; $C000

.byte $48, $45, $4C, $4C, $4F ; HELLO (PETSCII-Bereich $41–$5A)
```

**Größe im Code:** 0 Bytes. Die Daten werden als verzögerter Datenabschnitt (wie
RAWBYTES) an der Zieladresse abgelegt.

**Nullterminator:** Aktivieren Sie das Kontrollkästchen *"Anhängen `$00`
(Nullterminator)"*, um automatisch ein Byte `$00` nach dem Text hinzuzufügen.
Ideal für nullterminierte Schleifen:

```
LDX #$00
Schleife:
LDA msg,X
BEQ fertig ; $00 beendet die Schleife
JSR $FFD2
INX
BNE Schleife
fertig:
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

> **Tipp:** Verwenden Sie PETSCII für Daten, die über CHROUT (`$FFD2`)
> ausgegeben werden. Um direkt in den Bildschirmspeicher zu schreiben, verwenden
> Sie stattdessen STRING oder RAWTEXT.

---

### Zeichensatz

Schaltet den VIC-II-Zeichen-ROM zwischen Großbuchstaben-/Grafikmodus
(C64-Standard) und Kleinbuchstaben-/Großbuchstabenmodus um, indem Bit 1 von
`$D018` zur Laufzeit geändert wird.

| Feld  | Beschreibung                                                                                                                                                           |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modus | **Kleinbuchstaben** – Aktiviert den Kleinbuchstaben-/Großbuchstaben-Zeichensatz; **Großbuchstaben** – Stellt den Standard-Großbuchstaben-/Grafikzeichensatz wieder her |

**Expertensyntax:**
```
.charset lower ; Wechsel zu Kleinbuchstaben
.charset upper ; Wechsel zurück zu Großbuchstaben/Grafiken
```

**Generiertes ASM:**

Kleinbuchstabenmodus:
```
LDA $D018

ORA #$02 ; Bit 1 setzen → Klein-/Großbuchstaben-ROM bei $1800

STA $D018
```

Großbuchstabenmodus:
```
LDA $D018

AND #$FD ; Bit 1 löschen → Großbuchstaben/Grafik-ROM bei $1000

STA $D018
```

**Größe:** 8 Bytes (LDA abs + ORA/AND imm + STA abs).

**Warum ORA/AND anstelle eines direkten Schreibvorgangs?** `$D018` steuert auch
die Speicheradresse im Bildschirm-RAM (Bits 7–4). Durch das Umschalten von Bit 1
bleiben die restlichen Registerwerte erhalten.

**Typischer Arbeitsablauf:**

```
Zeichensatz Kleinbuchstaben ; auf Kleinbuchstaben umschalten
Text 0, 0, "hello world" ; [Kontrollkästchen: Kleinbuchstaben]

...
Zeichensatz Großbuchstaben ; Standardeinstellung wiederherstellen
```

Oder im Expertenmodus:
```
.charset lower

.text 0, 0, "hello world", lower

.charset upper
```

Im Expertenmodus durchläuft der `.charset`-Block nun auch das
Modus-Dropdown-Menü, sodass die Blockvorschau und der exportierte Quellcode
übereinstimmen.

> **Hinweis:** Das Makro CHARSET ändert lediglich den Zeiger auf das
> VIC-Zeichen-ROM. Es ruft nicht `$E544` (KERNAL-Zeichensatzinitialisierung)
> auf. In den meisten Fällen ist dies ausreichend; rufen Sie `JSR $E544` nur
> dann auf, wenn die Ausgaberoutinen des KERNAL die Änderung berücksichtigen
> müssen.

---

### CHARDEF

Definiert ein einzelnes 8×8-Zeichen in einem RAM-basierten Zeichensatz. Erzeugt
Inline-Laufzeitcode, der zur Laufzeit 8 Bytes in `base + index * 8` kopiert –
eine vorhergehende Marke oder `ORG` ist nicht erforderlich.

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
LDA #18
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

**Zieladresse:** `$3800 + 65 * 8 = $3A08`. Zur Kompilierzeit berechnet und in
den STA-Operanden fest codiert.

**Größe:** 40 Bytes pro Zeichen (8 × 5).

**Typischer Arbeitsablauf:**
```
; VIC-II-Punkt auf RAM-Zeichensatz bei $3800 setzen

LDA $D018

AND #$F1

ORA #$0E ; Bits 3-1 = %111 → Zeichensatz bei Bank+$3800

STA $D018

CHARDEF $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00 ; 'A' neu definieren

CHARDEF $3800, 66, $7C,$66,$66,$7C,$66,$66,$7C,$00 ; 'B' neu definieren

; ... weitere CHARDEF-Aufrufe für jedes benutzerdefinierte Zeichen
```

**Wann CHARDEF gegenüber Alternativen verwenden?**

| Ansatz                           | Verwenden Sie es, wenn                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **CHARDEF**                      | Sie benötigen einige benutzerdefinierte Zeichen (z. B. 1–20). Der Speicherbedarf beträgt jeweils 40 Byte.                 |
| **RAWBYTES @ $3800**             | Sie verwenden einen vollständig benutzerdefinierten Zeichensatz (256 Zeichen). Insgesamt 2 KB Daten, keine Laufzeitkopie. |
| **INCBIN "charset.bin" @ $3800** | Externe Zeichensatzdatei (vom Zeicheneditor erstellt). Die sauberste Option.                                              |
| **Charset Canvas + INCBIN**      | Die vollständige 256-Zeichen-Bitmap wird als ein 128×128-Bild dargestellt.                                                |

> **Hinweis zur Ausrichtung:** VIC-II erwartet die Zeichensatzbasis als
> Vielfaches von `$0800`. Gültige Speicherbereiche: `$0000`, `$0800`, `$1000`,
> ... , `$3800` (innerhalb des aktuellen 16-KB-VIC-Speicherbereichs).
> RAM-Zeichensätze befinden sich typischerweise an den Speicheradressen `$2000`,
> `$2800`, `$3000` oder `$3800`.

---

### BOX_HIT

Achsenparalleler Begrenzungsrahmen-Kollisionstest (AABB) zwischen zwei
Rechtecken, die durch 4-Byte-Nullseitenstrukturen beschrieben werden. Gibt das
Ergebnis im Akkumulator zurück: **A = 1** bei Überlappung, **A = 0**
andernfalls. Reiner Inline-Assembler-Code, kein Unterprogrammaufruf.

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

**Generierter ASM-Code (30 Bytes, vollständig PC-relativ — keine Unterprogramme,
keine absoluten Sprünge):**
```
LDA $FD ; b1 rechts
CMP $F7 ; b2 links
BCC nein ; R1 &lt; L2 → Fehlwurf
LDA $F9 ; b2 rechts
CMP $FB ; b1 links
BCC nein
LDA $FE ; b1 unten
CMP $F8 ; b2 oben
BCC nein
LDA $FA ; b2 unten
CMP $FC ; b1 oben
BCC nein
LDA #$01 ; Treffer
BNE abgeschlossen ; unbedingt (A ≠ 0)
nein: LDA #$00
abgeschlossen:
```

**Größe:** 30 Bytes.

**Typischer Arbeitsablauf:**

```
; Spieler-Sprite-Box bei $FB..$FE

LDA sprite_x ; L

STA $FB

LDA sprite_y ; T

STA $FC

CLC

ADC #23 ; +23 → B (24 Pixel hoher Sprite)

STA $FE

LDA $FB

CLC

ADC #23 ; R

STA $FD


Gegner-Box bei $F7..$FA (ähnlich befüllt)


...


BOX_HIT $FB, $F7 ; Teste Spieler vs. Gegner → A = 0 oder 1


CMP #$01

BNE no_collision

JSR handle_hit
no_collision:
```

**Einschränkungen:**
- Beide Nullseitenadressen müssen `≤ $FC` sein (jede Box benötigt 4
  aufeinanderfolgende Bytes: `zp`, `zp+1`, `zp+2`, `zp+3`).
- Koordinaten werden als **unsigned 8-Bit** (0–255) behandelt. Für
  vorzeichenbehaftete Sprite-Koordinaten außerhalb dieses Bereichs werden diese
  vor dem Speichern normalisiert.
- Die beiden Felder können sich im ZP-Bereich überlappen, wenn gewünscht,
  normalerweise benötigt man jedoch 8 unterschiedliche Bytes.

Warum nicht eine Unterroutine? Die Inline-Generierung vermeidet den
JSR/RTS-Overhead (14+ Zyklen) und hält den Test bei kurzen Spielschleifen im
Cache. Wenn Sie viele Paare testen müssen, fügen Sie manuell eine eigene JSR
box_hit_sub um einen einzelnen BOX_HIT-Block ein.

**Vergleich mit der Funktion `box_hit()` von UB:** Ultimate Basic kapselt
dieselbe 6502-Logik als Laufzeitfunktion, die einen Wert an eine Variable
zurückgibt. In VA platzieren Sie BOX_HIT direkt an der Stelle im Code, an der
Sie den Test benötigen; das Ergebnis befindet sich in `A`.

---

### INCBIN

Wie **BLOAD in BASIC** — nimmt eine externe Binärdatei (`.bin`, `.prg`, `.sid`,
`.raw`) und bettet sie direkt in den assemblierten PRG an der von Ihnen
angegebenen Adresse ein.

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
; INCBIN "music.bin" @ $C000 (2048 Bytes)

.byte $01, $02, ...
```

**Größe im Code:** 0 Bytes (aufgeschobener Datenbereich). Die Binärdatei ist an
der angegebenen Adresse eingebettet.

---

### KOALA

Lädt ein **Koala Painter**-Bild (`.koa` / `.kla`, 160×200, mehrfarbig) und zeigt
es an. Die Bilddaten sind an einer festen Adresse wie `INCBIN` eingebettet (die
2-Byte-Ladeadresse `$6000` der Datei wird entfernt), und der Block selbst wird
zu einer 86-Byte-Anzeigeroutine kompiliert, die an der Stelle ausgeführt wird,
an der sich der Block befindet.

| Feld    | Beschreibung                                                                                                                          |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Datei   | Navigieren Sie zur Auswahl einer `.koa` / `.kla`-Datei (10003 Bytes bzw. 10001 Bytes ohne Ladeadresse)                                |
| Adresse | Bitmap-Adresse: `$6000` (Standard, Koala nativ, VIC-Bank 1, Bildschirm-RAM `$4400`) oder `$2000` (VIC-Bank 0, Bildschirm-RAM `$0400`) |

Die Anzeigeroutine kopiert den Bildschirm-RAM-Bereich auf den Bildschirm und den
Farb-RAM-Bereich nach `$D800`, schreibt das Hintergrundbyte nach `$D021`, wählt
den VIC-Bank-Bereich in `$DD00` aus (die anderen Port-Bits bleiben erhalten) und
aktiviert den Mehrfarben-Bitmap-Modus (`$D011 = $3B`, `$D016 = $18`, `$D018 =
$18`). Andere Adressen werden verworfen: Die verbleibenden 8-KB-Slots liegen
unter dem BASIC/KERNAL-ROM (die Kopierschleife würde ROM lesen) oder überlappen
den Zeichen-ROM-Schatten.

**Expertensyntax:**
```
.koala „bild.koa“
.koala „picture.koa“, 2000 $
```

**Beispiel — ein Bild anzeigen und warten:**
```
* = $0801
.koala "picture.koa"
warten:
JMP warten
```

**Größe im Code:** 86 Bytes (Anzeigeroutine); die 10001 Bytes Bilddaten werden
an die angegebene Adresse geschrieben. Der Befehl **Dateien → Koala exportieren
(.koa)…** des HiRes-Editors erzeugt eine kompatible Datei.

---

### Ebene / Ebene_Zeile

Fügt ein **Level-Editor**-Projekt in Ihr Programm ein und kopiert Levelzeilen in
einen Bildschirmpuffer – die Bausteine eines Scrolling-Spiels. Unter
`samples/level-demo.asm` finden Sie ein vollständiges, per Joystick scrollbares
Level.

#### EBENE

Ein INCBIN-Block, der **0 Bytes Code** ausgibt. Nur die **platzierten**
Bildschirme des Level-Editor-Projekts (die `.bin`, gespeichert mit **Dateien →
Level speichern**) werden ab der angegebenen Adresse (Standard: `$2000`) in
Slot-Reihenfolge in den Speicher geladen, 2000 Bytes pro Bildschirm (1000
Bildschirmcodes + 1000 Farben). Identische Bildschirme werden nur einmal
gespeichert, und alle leeren Slots teilen sich einen leeren Bildschirm. Die
Zeigertabellen folgen den Bildschirmen. Ein Level kann bis zu 7 × 10 Bildschirme
umfassen.

**Expertensyntax:**
```
.level "level.bin"
.level "level.bin", $4000
```

| Definition                                                                    | Bedeutung                                                                                                                                                   |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LEVEL_SLOT_LO` / `LEVEL_SLOT_HI`                                             | Adresse des Bildschirms in jedem Slot (zeilenweise, `LEVEL_W` Slots pro Zeile)                                                                              |
| `LEVEL_ROW_SLOT`                                                              | Level-Charakterzeile → erster Platz der zugehörigen Bildschirmzeile                                                                                         |
| `LEVEL_ROW_LO/HI`, `LEVEL_CROW_LO/HI`                                         | Level-Zeichenzeile → Versatz der zugehörigen Bildschirmcode-Zeile / Farbzeile innerhalb eines Bildschirms                                                   |
| `LEVEL_COL_SLOT`, `LEVEL_COL_OFS`                                             | Ansicht Startspalte → Bildschirmspalte und Spalte innerhalb des Bildschirms                                                                                 |
| `LEVEL_W`, `LEVEL_H`                                                          | Levelgröße in Bildschirmen                                                                                                                                  |
| `LEVEL_COLS`, `LEVEL_ROWS`                                                    | Levelgröße in Zeichen                                                                                                                                       |
| `LEVEL_MAX_X`, `LEVEL_MAX_Y`                                                  | Größte Scrollposition in Pixeln einer 40×25-Ansicht                                                                                                         |
| `LEVEL_BG`, `LEVEL_MC1`, `LEVEL_MC2`, `LEVEL_MULTICOLOR`                      | Hintergrund / Mehrfarbigkeit und Modus des Levels                                                                                                           |
| `LEVEL_DATA`, `LEVEL_SIZE`, `LEVEL_END`                                       | Start-, Größen- und erste freie Adresse nach den Leveldaten                                                                                                 |
| `LEVEL_OBJ_X_LO/HI`, `LEVEL_OBJ_Y_LO/HI`, `LEVEL_OBJ_TYPE`, `LEVEL_OBJ_PARAM` | Objekttabelle (Objektebene des Level-Editors): Position in Levelpixeln, Typ und Parameterbyte, in Scrollreihenfolge — `LEVEL_OBJ_COUNT` Einträge (max. 255) |
| `LEVEL_OBJ_T_START` … `LEVEL_OBJ_T_TRIGGER`                                   | Objekttypnummern: START 0, FEIND 1, GEGENSTAND 2, TÜR 3, AUSGANG 4, AUSLÖSER 5                                                                              |
| `LEVEL_START_X`, `LEVEL_START_Y`                                              | Position des ersten Startobjekts (nur definiert, wenn das Level eines hat)                                                                                  |
| `LEVEL_ATTR`, `LEVEL_ATTR_SOLID` … `LEVEL_ATTR_COLLECT`                       | Charakterattributtabelle (ein Flag-Byte pro Bildschirmcode; nur wenn das Level Attribute besitzt) und ihre Bits: 1, 2, 4, 8                                 |
| `LEVEL_BORDER`, `LEVEL_SCR_COLORS`, `LEVEL_SCR_BG/BORDER/MC1/MC2`             | Level-Rahmen; Farbtabellen pro Slot (zeilenweise wie `LEVEL_SLOT_*`), wenn ein Bildschirm eigene Farben hat (`LEVEL_SCR_COLORS` = 1)                        |

Typischer Schutz: `.assert LEVEL_END &lt;= $9200, "Level-Daten laufen in den
Code"`.

#### LEVEL_ROW

Kopiert eine 40 Zeichen lange Zeile des Levels in einen Puffer: die Level-Zeile
in **X**, beginnend an der in der Variable `col` gespeicherten Level-Spalte, bis
zur Adresse im Zeiger `dst` (`dst` / `dst+1`, lo/hi). Mit dem dritten Argument
`color` werden die Farben anstelle der Bildschirmcodes kopiert (für Farb-RAM).
Ein 40 Zeichen langes Fenster, das sich über zwei Bildschirme erstreckt, wird
mit einer selbstmodifizierenden Kopierschleife verarbeitet (~14 Zyklen pro
Byte). X bleibt erhalten, A und Y werden zerstört. Benötigt einen `.level`-Block
im Programm.

**Expertensyntax:**
```
.level_row dst_lo, view_x
.level_row dst_lo, view_x, color
```

**Größe im Code:** 132 Bytes — Verwenden Sie `LBEQ` / `LBNE`, wenn ein Zweig
darüber springen muss.

---

### SID

Wie **BLOAD für Musik** – lädt eine `.sid`-Datei in Ihren PRG und liest
automatisch deren Init- und Play-Adressen aus dem Header. Rufen Sie Init einmal
beim Start auf und anschließend Play in jedem Frame über Ihren IRQ-Handler.

| Feld                                  | Beschreibung                                                                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Datei                                 | Navigieren Sie, um eine `.sid`-Datei auszuwählen.                                                                                           |
| Benutzerdefinierte Adresse (optional) | Überschreiben Sie die native Ladeadresse der SID (z. B. `$1000`). Lassen Sie das Feld leer, um die Adresse aus dem SID-Header zu verwenden. |

Der Block zeigt Folgendes an:
- **Titel / Autor** aus dem SID-Header
- **Ladeadresse** — wo die Daten im Speicher abgelegt werden (effektive Adresse
  nach etwaiger Überschreibung)
- **Initial address** — call this with JSR to initialing music (adjusted for
  relocation if a custom address is used)
- **Wiedergabeadresse** — Rufen Sie dies mit JSR in jedem Frame in einem
  IRQ-Handler auf (angepasst an die Relocation)
- Ein **(relocated)**-Badge erscheint, wenn eine benutzerdefinierte Adresse die
  Daten von ihrer ursprünglichen Position verschiebt.

**Expertensyntax:**
```
.sid „Ikari_Warriors.sid“
.sid „Ikari_Warriors.sid“, $1000
```

**Generierter ASM-Kommentar:**
```
; SID „Ikari_Warriors.sid“ @ $1000 Init:$1000 Play:$1006 (4096 Bytes)
```

**Größe im Code:** 0 Bytes inline. Die SID-Binärdatei wird als verzögerter Chunk
an der angegebenen Adresse im PRG abgelegt.

> Wichtig: Die meisten SID-Dateien enthalten fest codierte interne absolute
> Adressen. Diese können nur verschoben werden, wenn die gesamte Binärdatei um
> denselben Offset verschoben wird. Enthält eine SID interne Sprünge zu `$10xx`,
> muss sie an der Adresse `$1000` verbleiben – eine Verschiebung an eine andere
> Adresse würde diese internen Referenzen ungültig machen.

> **Typische Verwendung:** Platzieren Sie einen ORG-Block vor dem SID-Block, um
> dessen Adresse festzulegen. Rufen Sie Init einmal beim Start auf und
> anschließend Play für jedes Frame über einen Raster-IRQ-Handler.

---

### ENTHALTEN

Wie **MERGE in BASIC** – lädt es eine weitere Datei und erweitert deren Blöcke
an dieser Position direkt im Projekt. Ideal für wiederverwendbare
Unterprogrammbibliotheken. Die eingebundenen Blöcke sind im aktuellen Projekt
schreibgeschützt.

Es werden zwei Dateitypen unterstützt:
- **Visual Assembler project** (`.json`) — die Blöcke des Projekts werden
  unverändert eingefügt.
- **Einfacher Assembler-Quellcode** (`.inc`, `.asm`, `.s`) – die Datei wird als
  Text gelesen und wie im Expertenmodus analysiert. Bei jedem Kompilieren wird
  die Datei neu von der Festplatte eingelesen (die Datei selbst ist die
  maßgebliche Quelle), sodass sie extern mit jedem beliebigen Editor bearbeitet
  werden kann.

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

- Die Dateierweiterung ** ist im Expertenmodus erforderlich** – ein einfacher
  Name wie `.include "macros"` wird als `.include "macros.json"` interpretiert.
- Pfadauflösung: Zuerst wird versucht, im selben Verzeichnis wie die
  Projektdatei (relativ) zu arbeiten, dann wird auf das mit der App
  mitgelieferte Verzeichnis `samples/` zurückgegriffen.

**Generierter ASM (keine Adressüberschreibung):**
```
; .include "library.json" — 12 Blöcke

... (Ausführliche Blöcke folgen)
```

**Generiertes ASM (mit Ladeadresse `C000`):**
```
; .include "library.json" @ $C000 — 12 Blöcke

*=$C000

... (Erweiterte Blöcke folgen)
```

> Tipp: Verwenden Sie INCLUDE, um wiederverwendbare Unterprogrammbibliotheken zu
> erstellen, die Sie projektübergreifend nutzen können.
> `.inc`/`.asm`/`.s`-Dateien eignen sich am besten, wenn Sie die Bibliothek in
> einem einfachen Texteditor bearbeiten oder mit anderen 6502-Assemblern teilen
> möchten; `.json`-Dateien, wenn die Bibliothek direkt in Visual Assembler
> erstellt wurde. Legen Sie eine Ladeadresse fest, wenn die Bibliothek keine
> eigene ORG-Variable besitzt oder wenn Sie deren Standardplatzierung
> überschreiben möchten.

---

### TISCH

Wie **DIM an einer bestimmten Adresse** – benennt eine Nachschlagetabelle und
legt deren Speicherort fest. Platzieren Sie im Anschluss BYTE-, WORD- oder
FILL-Blöcke, um den Inhalt der Tabelle zu definieren.

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
Farbtabelle:
```

Der Programmzähler springt zur angegebenen Adresse. Fügen Sie nach der Tabelle
BYTE-/WORD-/FILL-Blöcke ein, um den Inhalt zu füllen.

**Größe:** 0 Bytes.

---

### ORG

Legt fest, wo im Speicher das Programm (oder ein Teil davon) abgelegt wird –
vergleichbar mit der Wahl einer Startadresse vor der Eingabe von Maschinencode.
Jedes Programm benötigt mindestens eine ORG-Adresse. Die standardmäßige, in C64
BASIC ladbare Startadresse ist `$0801`.

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

Jeder ORG-Block leitet einen neuen Abschnitt ein. Die nachfolgenden Blöcke
werden ab dieser Adresse zusammengesetzt. Beim Exportieren der PRG-Datei werden
alle Abschnitte zu einer einzigen Datei zusammengeführt – Lücken zwischen den
Abschnitten werden mit Nullen aufgefüllt.

**Beispiel — Code unter `$0801`, Datentabelle unter `$C000`:**
```
* = $0801
LDX #$00
Schleife:
LDA $C000,X
STA $D800,X
INX
BNE Schleife
RTS

* = $C000
.byte $01, $02, $03, ...
```

> **Tipp:** Jedes Programm muss mit einem ORG-Block beginnen. Die typische
> Startadresse für ein in C64 BASIC ladbares Programm ist `$0801` (2049
> dezimal). Wenn **BASIC SYS stub** aktiviert ist, fügt der Assembler eine kurze
> BASIC-Zeile an der Adresse `$0801` hinzu, und Ihr Code beginnt an der Adresse
> `$080D`.

---

### SCHLEIFE / WEITER

Wie **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** in BASIC – zählt von N bis 1
herunter und verwendet dabei das X- oder Y-Register. Fügen Sie einen LOOP-Block
ein, platzieren Sie Ihre Anweisungen zwischen diesem und NEXT, und die Schleife
wird automatisch die richtige Anzahl Male ausgeführt.

#### SCHLEIFE

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
Schleife0:
```

**Größe:** 2 Bytes (LD_ Opcode + unmittelbarer Operand).

#### NÄCHSTE

| Feld         | Beschreibung                             |
| ------------ | ---------------------------------------- |
| Registrieren | Automatisch dem LOOP-Register zugeordnet |
| Etikett      | Automatisch mit dem LOOP-Label verknüpft |

**Expertensyntax:**
```
.nächste Schleife0
```

**Generiertes ASM:**
```
DEX
BNE-Schleife0
```

**Größe:** 3 Bytes (DEX + BNE + Verzweigungsoffset).

**Beispiel – 10 Bildschirmzellen löschen:**
```
LDX #$0A
Schleife0:
LDA #$20 ; Leerzeichen
STA $0400,X
DEX
BNE Schleife0
```

---

### FÜR / ENDE

Wie **`FOR X=0 TO N-1 : ... : NEXT X`** in BASIC — zählt *up* von 0. Ideal, wenn
Sie einen Vorwärtsindex benötigen, z. B. zum Durchlaufen einer Zeichenkette oder
eines Arrays.

#### FÜR

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
für0:
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
BNE für 0
```

**Größe:** 5 Bytes (IN_ + CP_ #imm + BNE Offset).

**Beispiel — Ausgabe einer nullterminierten Zeichenkette:**
```
LDX #$00
for0:
LDA msg,X ; msg = PETSCII-Zeichenkette an fester Adresse
BEQ done ; Nullterminator → Beenden
JSR $FFD2 ; CHROUT
INX
CPX #$12 ; maximal 18 Zeichen
BNE for0
done:
RTS
```

> **LOOP vs FOR:** LOOP zählt abwärts (N→1) – gut für Verzögerungen,
> Füllschleifen und Pixelschleifen. FOR zählt aufwärts (0→N) – gut für den
> Zugriff auf Zeichenketten/Arrays. Beide können X oder Y verwenden.

---

### DRÜCKEN / ZIEHEN

Ähnlich wie ** das Speichern von Variablen vor einem GOSUB und deren
Wiederherstellung danach ** – jedoch unter Verwendung des 6502-Hardware-Stacks.
Wenn eine Subroutine A, X oder Y verwendet, muss sie mit PUSH und PULL
umschlossen werden, damit die Register des aufrufenden Codes erhalten bleiben.

#### DRÜCKEN

Legt ein oder mehrere Register auf den Stack. Die Reihenfolge ist immer A → X →
Y (das innerste zuerst).

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

#### ZIEHEN

Stellt Register vom Stack in umgekehrter Reihenfolge wieder her **** (Y → X →
A).

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
STEUER
PLA
```

> **Regel:** PUSH und PULL müssen immer den ** gleichen Registersatz**
> verwenden. `PUSH AX` → `PULL AX` (intern wird die Wiederherstellung in
> umgekehrter Reihenfolge durchgeführt: zuerst X, dann A).

---

### ENDE / RTS-Alias

Wie **RTS mit einem benutzerfreundlicheren Makronamen** — `.end` gibt ein
einzelnes `RTS` Byte aus und verhält sich im Expertenmodus wie ein kurzer
Unterprogrammterminator.

**Expertensyntax:**
```
.Ende
```

**Generiertes ASM:**
```
RTS
```

**Größe:** 1 Byte.

Verwenden Sie diese Option, wenn Sie eine Unterprogramm-Endmarkierung benötigen,
die eher einem Makro als einer einfachen Anweisung ähnelt.

---

### MACRO / ENDM / INVOKE

Wie **a named GOSUB with parameters** – definieren Sie einen wiederverwendbaren
Codeabschnitt einmal (MACRO…ENDM) und rufen Sie ihn dann überall mit INVOKE auf.
Übergeben Sie jedes Mal unterschiedliche Argumentwerte, anstatt Codeblöcke zu
kopieren und einzufügen.

#### MAKRO (Definitionsbeginn)

| Feld      | Beschreibung                                                                         |
| --------- | ------------------------------------------------------------------------------------ |
| Name      | Kennung für das Makro (z. B. `setColor`)                                             |
| Parameter | Optionale, durch Kommas getrennte Parameternamen (z. B. `color` oder `color, count`) |

Markiert den Beginn einer Makrodefinition. Die Blöcke zwischen MACRO und ENDM
bilden den Makrokörper – sie generieren **keinen Code** an der Stelle der
Definition. Verwenden Sie `{paramName}` als Platzhalter für Argumente.

**Generiertes ASM:**
```
; .MACRO setColor (Farbe)

... (Body-Blöcke)

; .ENDM
```

**Syntax im Expertenmodus:**
```
.macro setColor Farbe

LDA {Farbe}

STA $D020
.endm
```

#### ENDM (Definition Ende)

Schließt die aktuelle Makrodefinition. Keine Felder.

#### AUFRUFEN

Ruft an dieser Position ein definiertes Makro auf und ersetzt die Platzhalter
`{paramName}` im Makrokörper durch die angegebenen Argumentwerte.

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
; Einzelnes Argument:
.invoke setColor(#$07)

; Mehrere Argumente:
.invoke drawPixel($10, $20)

; Keine Argumente:
.invoke clearScreen

; Text-/Zeichenkettenargumente (in Anführungszeichen):
.invoke printText("Hallo Welt!")

; .call-Alias (Synonym für .invoke):
.call setColor(#$07)
```

Der Makrokörper wird inline expandiert, wobei `{paramName}` durch die
tatsächlichen Argumente ersetzt wird. Die durch Leerzeichen getrennte Form
(`.invoke setColor #$07`) wird ebenfalls akzeptiert.

**Argumenttypen:**
- **Numerisch**: `#$07`, `$10`, `255` — Hexadezimal- oder Dezimalwerte
- **Textzeichenfolgen**: `"Hallo Welt!"` — Zeichenketten in Anführungszeichen;
  Kommas innerhalb von Anführungszeichen werden als Teil des Textes und nicht
  als Argumenttrennzeichen behandelt.
- **Gemischt**: `#$07, "Hallo", $20` — beliebige Kombination

> **Tipp:** Definieren Sie Makros am Anfang (oder Ende) Ihres Programms und
> rufen Sie sie dann bei Bedarf auf. Makros können mehrfach mit
> unterschiedlichen Argumenten aufgerufen werden.

---

### REGION / ENDREGION

Rein visuelle Gruppierung – **Null Bytes**, keine Auswirkung auf den
kompilierten Code. Vergleichbar mit dem Zusammenklappen eines Abschnitts eines
BASIC-Programms in einen benannten Block, um ihn ausblenden und sich auf etwas
anderes konzentrieren zu können.

| Feld        | Beschreibung                                                                      |
| ----------- | --------------------------------------------------------------------------------- |
| Regionsname | Freitextbezeichnung für den Abschnitt (z. B. `init`, `game_loop`, `sprite_setup`) |

**Expertensyntax:**
```
.region init

; Blöcke...
.endregion
```

**Steuerelemente im REGION-Blockheader (immer sichtbar):**
- **▸ / ▾ toggle** — blendet die gesamte Region ein oder aus. Im eingeklappten
  Zustand sind alle Blöcke zwischen REGION und ENDREGION ausgeblendet.
- **↕ Expand all** — hebt alle einzelnen zusammengeklappten Blöcke innerhalb der
  Region auf und erweitert bei Bedarf die Region selbst.
- **⦵ In ASM auswählen** — markiert den gesamten Codebereich der Region in der
  ASM-Ansicht (von `; ===[ Name ]===` bis `; ===[/Name]===`) und scrollt
  dorthin. Wechselt automatisch zum ASM-Tab, falls dieser nicht sichtbar ist.
- **⧉ Region kopieren** – kopiert den REGION-Block, alle untergeordneten Blöcke
  und den zugehörigen ENDREGION-Block in die Zwischenablage. Ein blinkendes ✓
  bestätigt den Kopiervorgang.
- **⎘ Region einfügen** — fügt die kopierte Region als neue Region direkt nach
  dem ENDREGION der aktuellen Region ein und scrollt dorthin. Die Schaltfläche
  ist ausgegraut, bis eine Region kopiert wurde.

**Generiertes ASM:**
```
; Region init
    SEI
    LDA #$00
    STA $D020
; Endregion-Init
```

**Größe:** 0 Bytes für REGION und ENDREGION.

**Beispielhafter Arbeitsablauf:**
1. Füge einen `REGION`-Block hinzu und setze den Regionsnamen auf `init`.
2. Fügen Sie Ihre Initialisierungsanweisungen darunter ein.
3. Fügen Sie einen `ENDREGION`-Block hinzu, um den Abschnitt zu schließen.
4. Klicken Sie auf ▸ auf die REGION, um den gesamten Abschnitt in eine Zeile
   zusammenzuklappen, während Sie an anderen Teilen des Programms arbeiten.

> **Hinweis:** Regionen können **ineinander verschachtelt werden.** Jede
> ENDREGION schließt die nächstgelegene offene REGION. Dies hat keine Auswirkung
> auf die Ausgabe.

---

### DEFINIEREN / WENN / SONST / ENDEWENN

Wie ein vom Assembler gelesener Schalter ** – **DEFINE DEBUG` aktiviert ein
Symbol, woraufhin ein beliebiger `IF DEBUG`-Block eingefügt und dessen
`ELSE`-Zweig übersprungen wird. Entfernt man den DEFINE-Block, verschwindet auch
der IF-Block aus der Ausgabe. Für Release-Builds ist kein Code-Löschen
erforderlich.

#### DEFINIEREN

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

Ein `DEFINE`-Block kann mehrere Symbole gleichzeitig aktivieren (durch Komma
getrennt). Platzieren Sie DEFINE-Blöcke am Anfang Ihres Programms. Wenn Sie den
Block entfernen, werden alle darin enthaltenen Symbole sofort deaktiviert.

#### WENN

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

Blöcke zwischen `IF` und `ENDIF` (oder `ELSE`) werden je nachdem, ob das
Bedingungssymbol ein passendes `DEFINE` im Programm hat, ein- oder übersprungen.
Übersprungene Blöcke erscheinen als `; [IF übersprungen] …`-Kommentare und
erzeugen **Nullbytes**.

#### ANDERS

Keine Felder. Markiert den alternativen Zweig – wird zusammengesetzt, wenn die
Bedingung `IF` nicht *aktiv ist.

**Expertensyntax:**
```
.anders
```

**Generiertes ASM:**
```
; .ANDERS
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

LDA #$02 ; roter Rahmen

STA $D020

; .ELSE

LDA #$00 ; schwarz (Freigabe)

STA $D020

; .ENDIF
```

**Beispiel — mehrere Symbole in einem DEFINE-Block:**
```
; .DEFINE DEBUG, PAL

; .IF PAL
LDA #$xx ; PAL-Timingkonstante

; .ELSE
LDA #$xx ; NTSC-Timingkonstante

; .ENDIF
```

Verschachtelte `IF`-Blöcke werden unterstützt. Wird ein äußerer Block
übersprungen, werden auch die inneren Blöcke übersprungen.

> **Hinweis:** Dies ist die Behandlung von Bedingungen zur Kompilierzeit.
> Informationen zu Vergleichs- und Verzweigungsfunktionen zur Laufzeit finden
> Sie unter **Laufzeit-IF / ELSE / ENDIF** weiter unten.

### .BEHAUPTEN

*(Neu in 2.3.9.)* Eine **Kompilierzeit-Integritätsprüfung**. `.assert` wertet
einen Ausdruck während der Assemblierung aus; ist das Ergebnis falsch (`0`),
wird der Build mit einer eindeutigen Fehlermeldung, die den tatsächlichen Wert
enthält, abgebrochen. Ist das Ergebnis wahr (ungleich null), wird keine Ausgabe
erzeugt.

| Feld      | Beschreibung                                                                                                                                    |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Ausdruck  | Beliebige Assembler-Ausdrücke: Labels, `CONST`s, `*` (Programmzähler), Arithmetik und Vergleiche (`&lt;`, `&lt;=`, `&gt;`, `&gt;=`, `==`, `!=`) |
| Nachricht | Optionaler Text, der an die Fehlermeldung angehängt wird                                                                                        |

**Expertensyntax:**
```
.assert spriteData &lt; $C000

.assert * &lt; $A000

.assert end - start &lt;= 256, "Spritetabelle hat eine Seite überschritten"
```

**Verhalten:**

- **Größe:** 0 Bytes.
- Eine falsche Assertion führt zum Abbruch der Assemblierung: `` `.assert end -
  start &lt;= 256` ist falsch (Wert: 0). Die Sprite-Tabelle hat einen
  Seitenüberlauf. ``
- Eine Assertion, die nicht ausgewertet werden kann (undefinierte Bezeichnung
  usw.), schlägt ebenfalls fehl, mit *"kann zur Assemblierungszeit nicht
  ausgewertet werden"*.
- Vergleiche ergeben `1` / `0`; platzieren Sie `.assert` an beliebiger Stelle im
  Programmablauf – es wird an der Adresse geprüft, an der es sich befindet, so
  dass `.assert * &lt; $D000` die aktuelle Ausgabeposition prüft.

**Beispiel — Schützen Sie einen Sprite-Block vor einem Seitenübergang:**
```
* = $3000
sprite_data:

.byte $00, $00, $00 ; … 63 Bytes …
sprite_data_end:

.assert sprite_data_end - sprite_data == 63, "Sprite muss genau 63 Bytes groß sein"

.assert (sprite_data % 64) == 0, "Sprite muss 64-Byte-ausgerichtet sein"
```

---

### CONST

Wie **eine benannte Variable, die sich nie ändert** — `SCREEN = $0400`.
Verwenden Sie den Namen, anstatt überall Rohadressen einzugeben. Dadurch wird
der Code lesbarer und lässt sich später leichter ändern.

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

Der Konstantenname erscheint in der **Labelauswahl**-Dropdown-Liste auf
Anweisungsblöcken – einfach anklicken, um ihn einzufügen.

**PC-relative Ausdrücke (`*+N` / `*-N`):**

Das Wertfeld akzeptiert auch `*+N` oder `*-N`, wobei `*` die Kompilieradresse
des CONST-Blocks selbst ist. Dies wird verwendet, um einen benannten Alias für
ein Byte innerhalb einer benachbarten Anweisung zu erstellen – das klassische
Muster des selbstmodifizierenden Codes:

```
CONST op = *+1 ; op → Adresse des unmittelbaren Operanden des nächsten LDA
LDA #$00 ; $00 wird zur Laufzeit gepatcht

...
STA op ; überschreibt das Byte #$00 → LDA liest beim nächsten Aufruf den neuen Wert
```

Die CONST-Anweisung gibt 0 Bytes aus; die Marke wird zur Kompilierzeit zu
`current_address + 1` aufgelöst.

**Arithmetische Ausdrücke:**

Das Wertfeld akzeptiert allgemeine Arithmetik, einschließlich Verweise auf zuvor
definierte CONST-Namen, Hex-/Binärliterale und eingebaute mathematische
Funktionen:

```
.const SCREEN = $0400
.const SCREEN_END = SCREEN + 40*25 ; 1000 Bytes später
.const COLOR_RAM = $D800
.const MID_X = 160
.const SIN_TABLE = round(sin(PI/8) * 127) ; vorab berechneter Sinuswert
```

**Eingebaute Funktionen:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, constant `PI`

Operatoren: `+ - * /` Literale: `$FF` (hex), `%10110000` (binär)
Niedrigstes/höchstes Byte: `lo(expr)`, `hi(expr)`

**Größe:** 0 Bytes.

---

### VAR

Wie **CONST, aber automatisch allokiert** – `VAR` reserviert Nullseitenspeicher
für eine Bezeichnung, ohne dass Sie die Adresse eingeben müssen. Verwenden Sie
es für Zähler, Zeiger und kurzlebige Zustände, die in die Nullseiten gehören.

| Feld             | Beschreibung                                                          |
| ---------------- | --------------------------------------------------------------------- |
| Name             | Variablenname / Bezeichnung                                           |
| Größe (optional) | Anzahl der zu reservierenden Bytes. Für ein einzelnes Byte weglassen. |

**Expertensyntax:**
```
.var-Zähler
.var Timer, 2
.var lebt
```

**Praktisches Beispiel:**
```
.region Vars
.var-Zähler
.var Timer, 2
.endregion

LDA #$00
STA-Zähler
```

**Generiertes ASM:**
```
; .var counter
```

**Größe:** Standardmäßig 1 Byte, oder `N` Bytes, wenn die Größe angegeben wird.

Der Speicherallokator durchläuft einen konfigurierbaren Nullseiten-Cursor (`$02`
bis `$FE`) und weist den nächsten freien Speicherplatz zu. Falls der
angeforderte Bereich eine bereits verwendete Marke überschneidet, gibt der
Compiler eine Warnung aus.

---

### Laufzeit IF / ELSE / ENDIF

Wie **eine echte Verzweigungsvorlage** – diese Version arbeitet zur Laufzeit,
nicht zur Kompilierzeit. Sie vergleicht `A`, `X` oder `Y` mit einem
unmittelbaren Wert und gibt die korrekte Verzweigungssequenz `CMP` / `CPX` /
`CPY` aus.

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

Der Vergleich erfolgt standardmäßig vorzeichenlos. Für `&lt;=` und `&gt;` wird
das Makro zur kürzesten äquivalenten Verzweigungskette für das ausgewählte
Register erweitert.

---

### WHILE / ENDW

Wie **eine Laufzeitschleife mit einer Bedingung am Anfang** – der
Schleifenkörper wird so lange ausgeführt, wie die Bedingung wahr bleibt.

| Feld         | Beschreibung                                 |
| ------------ | -------------------------------------------- |
| Registrieren | `A`, `X` oder `Y`                            |
| Operator     | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Wert         | Sofortiger Wert im HEX- oder DEC-Format      |

**Expertensyntax:**
```
Solange A != #$00

JSR getchar

Ende
```

**Größe:** Abhängig vom Schleifenkörper und der Vergleichsform.

Verwenden Sie `WHILE`, wenn die Schleife vor Abschluss der ersten Iteration
beendet werden kann. Es ist das Laufzeit-Pendant zum zählerbasierten
Hilfsprogramm `LOOP / NEXT`.

---

### WIEDERHOLEN / BIS

Wie **eine Laufzeitschleife mit einem Test am Ende** – der Schleifenkörper wird
immer mindestens einmal ausgeführt, dann entscheidet die Bedingung, ob
angehalten wird.

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

Verwenden Sie `REPEAT / UNTIL`, wenn der Funktionskörper mindestens einmal vor
der Exit-Prüfung ausgeführt werden soll.

---

### MEMCPY / MEMSET

Wie **kleine Speicherroutinen, auf die Sie ständig zurückgreifen** — `MEMCPY`
kopiert einen zusammenhängenden Block, `MEMSET` füllt einen Bereich mit einem
Byte.

| Makro    | Felder                  |
| -------- | ----------------------- |
| `MEMCPY` | `src`, `dst`, `size`    |
| `MEMSET` | `addr`, `value`, `size` |

**Expertensyntax:**
```
.memcpy src=$C000, dst=$D000, size=$0100

.memset addr=$0400, value=#$20, size=$03E8
```

**Generiertes ASM:** Inline-Kopier-/Füllschleifen, ausgewählt, um der
angeforderten Größe zu entsprechen.

Bei Größen bis zu 256 Byte wird eine kurze 8-Bit-Schleife verwendet. Größere
Größen schalten automatisch auf einen 16-Bit-Zähler um.

---

### DRUCKEN / ZEICHEN DRUCKEN / HEX-DRUCKEN / BILDSCHIRM LÖSCHEN / TASTE WARTEN / VERZÖGERUNG / RAHMEN FESTLEGEN / HINTERGRUND FESTLEGEN

#### DRUCKEN

Wie **PETSCII-Ausgabe ohne den Boilerplate-Code** – gibt eine Zeichenkette über
`CHROUT` mit derselben Groß-/Kleinschreibung wie der PETSCII-Block aus. Die
Option für Kleinbuchstaben wird vom PETSCII-Encoder gemeinsam genutzt, sodass
der Textpfad konsistent bleibt.

**Expertensyntax:**
```
.print "HELLO"
.print "hello", lower
```

#### PRINT_CHAR

Gibt ein PETSCII-Byte anhand seines numerischen Codes aus und sendet es über
`CHROUT`. Der Wert kann auch eine benannte Konstante oder ein Label sein, das
zur Assemblierungszeit in ein Byte aufgelöst wird, sowohl im Block- als auch im
Expertenmodus.

**Expertensyntax:**
```
.print_char 65
.print_char $41
.print_char color
```

#### PRINT_HEX

Gibt einen 8-Bit-Wert als Hexadezimaltext über den normalen KERNAL-Ausgabepfad
aus.

**Expertensyntax:**
```
.print_hex A
```

#### Bildschirm löschen

Abkürzung für den Standard-C64-Clear-Screen-Steuerungscode.

**Expertensyntax:**
```
.clear_screen
```

#### WAIT_KEY

Wartet, bis eine Taste gedrückt wird, damit Sie die `GETIN`-Schleife nicht jedes
Mal manuell ausführen müssen.

**Expertensyntax:**
```
.wait_key
```

#### VERZÖGERUNG

Wartet die angeforderte Anzahl an Frames mithilfe einer gemeinsamen Hilfsroutine
ab. Verwenden Sie dies für kurze Pausen und Zeitlücken, wenn eine vollständige
benutzerdefinierte Schleife übertrieben wäre. Die Frame-Anzahl kann eine Rohzahl
oder eine benannte Konstante sein, und `.wait` ist lediglich ein Alias für
`.delay`.

**Expertensyntax:**
```
.delay 29
.wait 29
.delay frames=FRAMES_1S
```

Im Blockmodus verwendet das Verzögerungsfeld eine kompakte Konstantenauswahl,
wenn ein symbolischer Wert verfügbar ist, sodass Sie den Namen nicht jedes Mal
manuell eingeben müssen.

#### SET_BORDER / SET_BG

Komfortable Wrapper für die Farbregister des VIC-II. Der Farbwert kann eine
Rohzahl oder eine benannte Konstante sein, die einen Wert zwischen 0 und 15
annimmt. Sowohl der Block- als auch der Expertenmodus akzeptieren hier
symbolische Konstantennamen.

**Expertensyntax:**
```
.set_border 6
.set_bg 0
.set_border color
.set_bg color
```

**Größe:** Jeder Helfer wird zu einer winzigen Registerschreibsequenz oder einem
kurzen KERNAL-Aufruf erweitert.

Im Blockmodus verwenden diese Felder auch den Konstantenwähler, sodass der
symbolische Wert sichtbar bleibt und nicht durch eine Rohzahl ersetzt wird.

---

### IRQ_SETUP

Richtet einen Raster-IRQ-Handler in einem Schritt ein. Das Makro schreibt den
IRQ-Vektor, aktiviert Raster-IRQs, setzt die Leitung, deaktiviert die
gemeinsamen CIA-IRQ-Quellen und kehrt mit `CLI` zur normalen Ausführung zurück.

| Feld    | Beschreibung                                                      |
| ------- | ----------------------------------------------------------------- |
| Handler | IRQ-Routinebezeichnung (z. B. `my_irq`)                           |
| Raster  | Rasterzeile in Hexadezimal- oder Dezimaldarstellung (z. B. `$FA`) |

**Expertensyntax:**
```
.irq_setup handler=my_irq, raster=$FA
```

**Größe:** Eine kleine Setup-Sequenz; die genaue Länge hängt von der
ausgewählten Rasterzeile ab.

Verwenden Sie dies, wenn Sie den üblichen "SEI / Install Handler / Enable IRQ /
CLI"-Code benötigen, ohne ihn über das gesamte Programm zu verteilen.

---

### RAND

Wie **ein winziger eingebauter PRNG** — gibt einen 8-Bit-Pseudozufallswert aus
einem kompakten Nullseiten-Seed zurück.

| Feld  | Beschreibung                                                           |
| ----- | ---------------------------------------------------------------------- |
| Samen | Optionales Startbyte oder Label für die Nullseite (Standardwert `$FB`) |

**Expertensyntax:**
```
.rand
```

**Größe:** Eine Handvoll Bytes, abhängig vom gewählten Implementierungspfad.

Der Generator ist für Gameplay, Effektvariationen und schnelle Testdaten
gedacht. Er ist bewusst klein gehalten und verzichtet auf kryptografisch
ausgefeilte Sicherheitsvorkehrungen.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Erstellt einen VIC-II-Sprite in einem Block – anstatt etwa sechs
POKE-Anweisungen in BASIC zu schreiben, müssen nur die Felder ausgefüllt werden.
Setzt den Datenzeiger des Sprites, schaltet ihn ein, aktiviert optional den
Mehrfarbenmodus und legt seine Farbe fest.

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
STA $07F8 ; Sprite-Zeigerregister ($07F8 + N)
LDA $D015
ORA #$01 ; Aktivierungsbit für Sprite 0 setzen

STA $D015
LDA $D01C
AND #$FE ; Mehrfarbenbit für Sprite 0 löschen

STA $D01C
LDA #$07
STA $D027 ; Farbregister für Sprite 0
```

**Größe:** 26 Bytes.

> **Sprite-Datenseite:** `Datenadresse ÷ 64`. Mit dem standardmäßigen BASIC
> SYS-Stub platziert `ALIGN 64` nach `JMP main` Sprite-Daten an `$0840` → Seite
> = `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Wie **`POKE 53248, x : POKE 53249, y`** in BASIC – legt dies die Startposition
eines Sprites fest. Die Koordinaten werden zur Assemblierungszeit festgelegt,
und die Felder akzeptieren Konstanten im Blockmodus; für Animationen verwenden
Sie `INC`/`DEC` direkt auf dem Sprite-Register.

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
LDA #$98 ; X niedrigstes Byte

STA $D000 ; Sprite 0 X-Register

LDA $D010

AND #$FE ; X MSB für Sprite 0 löschen (X ≤ 255)

STA $D010

LDA #$64 ; Y = 100

STA $D001 ; Sprite 0 Y-Register
```

Für X > 255 setzt das Makro das entsprechende Bit in `$D010`, anstatt es zu
löschen.

**Größe:** 18 Bytes.

> **Hinweis:** `SPRITE_POS` bettet die X/Y-Koordinaten in den Code ein (`LDA
> #$xx`). Um einen Sprite zur Laufzeit zu animieren, verwenden Sie `INC $D000` /
> `DEC $D000` – siehe das Beispiel `sprite-macro-demo`.

---

<a id="wait_raster"></a>
### WAIT_RASTER

Wartet, bis der Elektronenstrahl des VIC-II eine bestimmte Scanzeile erreicht –
ähnlich der Synchronisierung mit einem Fernsehbild. Platzieren Sie dies am
Anfang Ihrer Spielschleife, um Sprite-Tearing zu verhindern. Kein JSR, keine
Beschriftung erforderlich.

| Feld        | Beschreibung                                                        |
| ----------- | ------------------------------------------------------------------- |
| Rasterlinie | Ziel-Rasterzeile in Hexadezimaldarstellung (z. B. `FF` = Zeile 255) |

**Expertensyntax:**
```
.wait_raster $FF
```

**Generiertes ASM:**
```
Warten:
LDA $D012 ; aktuelle Rasterzeile
CMP #$FF ; Zielzeile
BNE warten ; Rückschleife (-7 Bytes)
```

**Größe:** 7 Bytes (der `BNE` Offset `$F9` = −7 verweist immer zurück auf den
`LDA`).

> **Tipp:** Platzieren Sie `WAIT_RASTER` am Anfang Ihrer Spielschleife, um die
> Synchronisierung mit der Anzeige zu gewährleisten und Sprite-Tearing zu
> verhindern.

---

### JOYSTICK

Wie das Auslesen von **`PEEK($DC00)`** und anschließendes Anpassen der
Sprite-Position – jedoch in einem einzigen Block. Liest einen CIA-Joystick-Port
und passt die X/Y-Register eines Sprites entsprechend an. Vollständig inline,
kein JSR erforderlich.

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
LDA $DC00 ; CIA-Port 2 lesen

LSR ; Bit 0 → Übertrag (Aufwärts)

BCS skip_up ; Übertrag gesetzt = NICHT gedrückt

DEC $D001 ; Y−1 (Aufwärtsbewegung)
skip_up:

LSR ; Bit 1 → Übertrag (Abwärts)

BCS skip_down

INC $D001 ; Y+1 (Abwärtsbewegung)
skip_down:

LSR ; Bit 2 → Übertrag (Links)

BCS skip_left

DEC $D000 ; X−1 (Linksbewegung)
skip_left:

LSR ; Bit 3 → Übertrag (Rechts)

BCS skip_right

INC $D000 ; X+1 (Rechtsbewegung)
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

**Größe:** 27 Bytes. Der Offset `BCS` ist immer `+3` (überspringt die folgende
3-Byte-Anweisung `DEC`/`INC abs`).

**Variabler Modus — `.Joystick-Port, vx, vy[, fire]`:** Anstatt einen Sprite zu
bewegen, wird die Richtung in Variablen geschrieben: `vx` / `vy` = `-1` / `0` /
`+1` (`$FF` / `$00` / `$01`), und das optionale `fire` = `1`, solange die Taste
gedrückt ist. Andernfalls `0`. Verwenden Sie es für eine scrollende Kamera,
einen Spieler mit eigener Physik oder Menüs. Port `3` liest beide Joystick-Ports
gleichzeitig (`LDA $DC00` / `AND $DC01`), daher funktioniert jeder Port.

```
.joystick 2, vx, vy ; 35 Bytes

.joystick 3, vx, vy, fire ; beide Ports + Feuer: 45 Bytes
```

> **Typische Verwendung:** Platzieren Sie es innerhalb eines `gameloop` Labels
> mit `WAIT_RASTER` zuerst:
> ```
> Spielschleife:
> WAIT_RASTER ($FF)
> JOYSTICK (Port=2, Sprite=0)
> JMP Spielschleife
> ```

---

<a id="mouse"></a>
### MAUS

Liest die proportionale Maus eines Commodore 1351 und bewegt einen Sprite.
Vollständig inline ** – kein JSR oder Label erforderlich. Das Makro wählt den
CIA-Port aus, wartet, bis sich die SID-Paddle-Eingaben stabilisiert haben,
dekodiert dann die Delta-Bewegung mit dem Standard-1351-Treibermuster und wendet
sie auf die Sprite-Register an.

| Feld      | Beschreibung                                                                             |
| --------- | ---------------------------------------------------------------------------------------- |
| Hafen     | `1` = CIA `$DC00` Bits `7:6` = `%01`; `2` = `%10`                                        |
| Sprite #  | Sprite-Nummer 0–7                                                                        |
| ZP-Byte X | Nullseitenadresse (hexadezimal) zur Speicherung des vorherigen POTX-Samples (z. B. `FD`) |
| ZP-Byte Y | Nullseitenadresse (hexadezimal) zur Speicherung des vorherigen POTY-Samples (z. B. `FE`) |

**Generierte ASM-Form (Port 1, Sprite 0, ZP `$FD`/`$FE`):**

```
; CIA-Portauswahl + Abwicklung
LDA $DC00
UND #$3F
ORA #$40
STA $DC00
LDX #$67
Warten:
DEX
BNE warten

; X-Achse – Standard-1351-Delta-Dekodierung (7 Bit)
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

; Y-Achse – gleiche Dekodierung, dann invertiert vor der Anwendung
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

Beispiel:
.mouse 2, 0, FD, FE
```

> **Wichtig:** Initialisieren Sie vor dem ersten Aufruf die Nullseitenbytes mit
> den aktuellen POTX/POTY-Werten, um einen Sprung im ersten Frame zu vermeiden:
> ```
> Port 1: LDA $DC00 : AND #$3F : ORA #$40 : STA $DC00
> 
> Port 2: LDA $DC00 : AND #$3F : ORA #$80 : STA $DC00
> 
> LDA $D419 : LSR A : AND #$3F : STA $FD
> 
> LDA $D41A : LSR A : AND #$3F : STA $FE
> ```

> **Tipp:** Fragen Sie die Maus einmal pro Frame ab — platzieren Sie
> `WAIT_RASTER` in der Spielschleife vor `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Wie **`PEEK($D01E)`** in BASIC – prüft die Hardware-Kollisionsregister des
VIC-II und gibt an, ob ein Sprite einen anderen Sprite oder den Hintergrund
berührt hat. Vollständig inline, kein JSR erforderlich.

| Feld          | Beschreibung                                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Sprite #      | Sprite-Nummer 0–7 (welches Sprite-Bit zu überprüfen ist)                                                                      |
| Kollisionstyp | `Sprite-Sprite ($D01E)` – Kollision mit einem anderen Sprite; `Sprite-Background ($D01F)` – Kollision mit Hintergrundgrafiken |

**Expertensyntax:**
```
.sprite_col 0, Sprite
.sprite_col 0, Hintergrund
```

**Generiertes ASM (Sprite 0, Sprite–Sprite):**
```
LDA $D01E ; Sprite-Sprite-Kollisionsregister lesen (löscht es!)

AND #$01 ; Bit 0 (Sprite 0) isolieren

; A ≠ 0 → Kollision aufgetreten
```

**Größe:** 5 Bytes.

> **Wichtig:** Das Lesen von `$D01E`/`$D01F` ** löscht das Register**. Lesen Sie
> es einmal pro Frame und reagieren Sie sofort mit `BEQ`/`BNE`.

**Typische Verwendung:**
```
Spielschleife:
WAIT_RASTER ($FF)
JOYSTICK (Port=2, Sprite=0)
SPRITE_COL (Sprite=0, Typ=Sprite-Sprite)
BEQ no_hit ; A = 0 → keine Kollision
LDA #$02
STA $D020 ; roter Rand = Treffer!
JMP Spielschleife
no_hit:
LDA #$0E
STA $D020 ; hellblauer Rand = frei
JMP Spielschleife
```

> **Siehe auch:** `collision-demo` Beispiel — grüner Ball (Sprite #0) vs. rotes
> Kreuz (Sprite #1).

---

### LOADFILE

Wie **`LOAD "Datei",8`** in BASIC – lädt eine Datei zur Laufzeit von einer
D64-Disk mithilfe der KERNAL LOAD-Routine. Verwenden Sie dies, um Daten, Musik
oder zusätzlichen Code von der Diskette zu laden, während Ihr Programm läuft.

| Feld                             | Beschreibung                                                                                                                                                                                                                                   |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dateiname                        | Dateiname auf der Festplatte (max. 16 Zeichen, automatische Großschreibung; die Zeichen `,`, `"`, `/`, `\`, `:`, `*`, `?`, `&lt;`, `&gt;`, `|` werden herausgefiltert)                                                                         |
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
JMP skip_filename ; Überspringen des Inline-Dateinamens

.byte "DEMO-COLORS" ; Dateinamenbytes (PETSCII, 11 Zeichen)
skip_filename:

LDA #11 ; Dateinamenlänge

LDX #<fname ; Zeiger lo

LDY #>fname ; Zeiger hi

JSR $FFBD ; SETNAM

LDA #1 ; Logische Datei #1

LDX #8 ; Gerät 8

LDY #0 ; sec=0 (Überschreibungsadresse) oder #1 (eigene Dateiadresse)

JSR $FFBA ; SETLFS

LDA #0 ; LOAD-Befehl (nicht VERIFY)

JSR $FFD5 ; LOAD

BCS fehlgeschlagen ; (nur wenn Fehlerlabel gesetzt)
```

**Größe:** `3 + Dateinamenlänge + 9 (SETNAM) + 9 (SETLFS) + (4 bei
Überschreibung) + 5 (LOAD) + (2 bei Fehlerbezeichnung)` Bytes. Mindestens 27
Bytes.

> Wichtig: Der Dateiname wird direkt nach einem JMP skip_filename im
> Maschinencode gespeichert. Der Dateiname auf der Festplatte muss in
> Großbuchstaben (PETSCII) vorliegen – entsprechend den ASCII-Großbuchstaben
> (A–Z). Das Makro erzwingt dies automatisch.

> **Verwenden Sie für Produktionsprogramme immer eine Fehlerbezeichnung** – wenn
> die Datei nicht gefunden wird, setzt KERNAL das Übertragsflag und die
> Ausführung springt zum nächsten Programm.

> **Siehe auch:** `loadfile-demo` Beispiel — demonstriert das Laden von
> `DEMO-COLORS.PRG` von einem D64 mit einem BCS-Fehlerzweig und einem visuellen
> Fehlerbildschirm.

---

### EXODECRUNCH

In-Program **Exomizer-Dekomprimierung**. Verwenden Sie dieses Makro direkt nach
einem `LOADFILE`, das einen im Exomizer-Modus `mem` komprimierten Datenstrom
geladen hat – EXODECRUNCH entpackt ihn rückwärts in die im Datenstrom
eingebettete Adresse.

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
LDA $AE ; KERNAL-Ladeende niedrig (durch vorherigen Ladevorgang gesetzt)

STA $04 ; Depacker-Quellendzeiger niedrig

LDA $AF ; KERNAL-Ladeende hoch

STA $05 ; Depacker-Quellendzeiger hoch

LDA #$36 ; BASIC-ROM aus ($A000-$BFFF wird zu RAM)

STA $01
JSR-Depacker ; Depacker liest rückwärts über $04/$05

LDA #$37 ; Standardzuordnung wiederherstellen (BASIC + KERNAL + I/O)

STA $01
```

**So funktioniert es:**

1. KERNAL `LOAD` ($FFD5) aktualisiert ZP `$AE/$AF`, sodass der Zeiger eins nach
   dem zuletzt geladenen Byte liegt. EXODECRUNCH kopiert dies nach ZP `$04/$05`,
   was der offiziellen Exomizer-Konvention für das Backward-Source-End
   entspricht.
2. Der Depacker befindet sich üblicherweise an Adresse `$B000` (innerhalb des
   BASIC-ROM-Bereichs). Das Makro schaltet `$01 auf $36` um, sodass die CPU
   während des JSR dort RAM erkennt, und stellt anschließend `$01 auf $37`
   wieder her.
3. Die Dekomprimierungszieladresse wird **in den komprimierten Datenstrom selbst
   kodiert**, wenn Sie mit `exomizer mem -l <load> file,<target> komprimieren` —
   der Depacker liest sie aus den ersten Bytes des Datenstroms.

**Depacker-Binärdatei:** Der vorkompilierte Backward-Depacker ist
`samples/exo-decrunch.bin` (477 Bytes, ORG $B000). Es handelt sich um einen
Kick-Assembler-Wrapper der offiziellen `exodecrunch.asm`, wobei `INC $D020` bei
jedem Lesevorgang hinzugefügt wurde, um einen sichtbaren Border-Flash-Effekt
während der Dekomprimierung zu erzeugen. Platzieren Sie die Datei mit einem
`INCBIN`-Block an der Depacker-Adresse in Ihrem Programm.

**Sicherheits-Offset-Kompensation:** Der Standard-Speichermodus von Exomizer
wendet einen 2-Byte-Sicherheits-Offset an – die Daten landen 2 Bytes vor dem
angeforderten Ziel. Der Dialog „Über D64 ausführen“ **addiert automatisch 2 zum
Zielfeld**, bevor Exomizer aufgerufen wird, sodass das sichtbare Verhalten der
eingegebenen Adresse entspricht.

> **Siehe auch:** das `exo-multicolor-demo` Beispiel – vollständiges
> End-to-End-Beispiel: LOADFILE eine komprimierte Multicolor-Bitmap nach $C000,
> EXODECRUNCH entpackt sie nach $2000, dann kopiert screen → $0400 und color →
> $D800 und schaltet VIC-II in den Multicolor-Bitmap-Modus.

> **Integrationstest:** `cargo test --test exomizer_integration` (in
> `src-tauri/`) überprüft den vollständigen Komprimierungs- und
> Dekomprimierungsprozess auf einem 6502-Emulator mit der echten
> Depacker-Binärdatei. Bestehenskriterium: 10000 Bytes, Byte-gleich der
> Quelldatei `multi-color.bin`.

---

### REU_CHECK

Erkennt, ob eine Commodore RAM-Erweiterungseinheit (REU) angeschlossen ist –
ähnlich wie die Überprüfung von `PEEK($D010)`, um festzustellen, ob Hardware
vorhanden ist. Der Test erfolgt durch Schreiben und Auslesen zweier Muster in
das REU-Register `$DF04`.

| Feld   | Beschreibung    |
| ------ | --------------- |
| Keiner | Keine Operanden |

**Generierter Code (34 Bytes):**
```
LDA #$55
STA $DF04
LDA $DF04
CMP #55 $
BNE scheitert
LDA #$AA
STA $DF04
LDA $DF04
CMP #$AA
BNE scheitert
LDA #$00
CMP #$FF ; Z=0 =&gt; REU vorhanden
BNE fertig
scheitern:
LDA #$FF
CMP #$FF ; Z=1 =&gt; kein REU
Erledigt:
```
> Das Makro normalisiert das Ergebnis, sodass der folgende Zweig einfach bleibt:
> `BNE` bedeutet REU vorhanden, `BEQ` bedeutet REU nicht vorhanden.

**Expertensyntax:**
```
.reu_check
```

**Ergebnis in Flags:**
- **Z = 0** (Ergebnis ≠ 0) → REU vorhanden → verwende `BNE`
- **Z = 1** (Ergebnis = 0) → kein REU → `BEQ` verwenden

**Keine konfigurierbaren Felder** — das Makro generiert jedes Mal denselben
Code.

**Typische Verwendung:**
```assembly
REU_CHECK
BEQ no_reu ; überspringen, wenn REU nicht vorhanden ist
; ... REU-Code hier ...
no_reu:
```

---

### REU_STASH / REU_FETCH / REU_SWAP

Der DMA-Blocktransfer zwischen C64-RAM und REU-Erweiterungsspeicher funktioniert
ähnlich wie eine extrem schnelle POKE-Schleife, jedoch ohne dass die CPU
arbeiten muss (der REU-Chip kopiert die Daten, während die CPU pausiert). Ein
Transfer von `$1000` Bytes erfolgt praktisch instantan.

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
LDA #c64lo STA $DF02 ; C64-Adresse LO
LDA #c64hi STA $DF03 ; C64-Adresse HI
LDA #reuLo STA $DF04 ; REU-Adresse LO
LDA #reuHi STA $DF05 ; REU-Adresse HI
LDA #bank STA $DF06 ; REU-Bank
LDA #lenLo STA $DF07 ; Länge LO
LDA #lenHi STA $DF08 ; Länge HI
LDA #$00 STA $DF09 ; Adresssteuerung (fest)
LDA #$00 STA $DF0A ; Interruptmaske (fest)
LDA #cmd STA $DF01 ; DMA ausführen ($90/$91/$92 = stash/fetch/swap, immediate)
```

> **Hinweis:** Befehle verwenden `$90/$91/$92` (Bit 4 gesetzt = sofortiger
> DMA-Modus). Das Schreiben in `$DF01` startet die Übertragung; die CPU setzt
> die Arbeit fort, sobald sie abgeschlossen ist.

---

### TURBO_SET

Legt die CPU-Geschwindigkeit des Ultimate-64 (U64) über das Register $D031 fest.
Hat keine Auswirkung auf einen echten C64 oder andere Emulatoren.

**Felder:**

| Feld            | Beschreibung              | Reichweite                                       |
| --------------- | ------------------------- | ------------------------------------------------ |
| Geschwindigkeit | CPU-Geschwindigkeitsindex | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz             |
| Badline         | Badline-Emulation         | Aktiviert (C64-kompatibel) / Deaktiviert (Turbo) |

Das Geschwindigkeitsbyte wird wie folgt berechnet: `(speedIndex &amp; 0x0F) |
(badline_disabled ? 0x80 : 0x00)`.

**Generierter Code (5 Bytes):**
```
A9 xx LDA #speed_byte
8D 31 D0 STA $D031
```

**Syntax im Expertenmodus:**
```
.turbo_set 7,0 ; Geschwindigkeit=7 (~10 MHz), Badline aktiviert
.turbo_set 15,1 ; Geschwindigkeit=15 (~48 MHz), Badline deaktiviert
```

> **Hinweis:** Dieses Makro wirkt sich nur auf U64-Hardware aus. Auf einem
> echten C64 oder anderen Emulatoren schreibt es in `$D031`, was Auswirkungen
> auf die CIA haben oder ignoriert werden kann.

---

### SUPERCPU_DETECT

Prüft, ob ein **CMD SuperCPU**-Beschleuniger installiert ist – wie
`PEEK($D0B8)`, um zu sehen, ob er etwas anderes als `$FF` zurückgibt.

**Generierter Code (5 Bytes):**
```
AD B8 D0 LDA $D0B8
C9 FF CMP #$FF
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
BEQ no_scpu ; Überspringen, falls keine SuperCPU vorhanden

... SuperCPU-Turbo-Code hier ...
no_scpu:
```

---

### TURBO_ENABLE

Aktiviert oder deaktiviert den SuperCPU-Turbomodus **. Rufen Sie zuerst
`SUPERCPU_DETECT` auf und überspringen Sie diesen Schritt, falls keine SuperCPU
vorhanden ist.

| Modus        | Registrieren | Wirkung                                             |
| ------------ | ------------ | --------------------------------------------------- |
| Aktivieren   | `$D07A`      | Turbo-Modus aktivieren (bis zu 20 MHz mit SuperCPU) |
| Deaktivieren | `$D07B`      | Rückkehr zum 1-MHz-Kompatibilitätsmodus             |

**Generierter Code (5 Bytes):**
```
A9 00 LDA #$00
8D 7A D0 STA $D07A ; (oder $D07B zum Deaktivieren)
```

**Syntax im Expertenmodus:**
```
.turbo_enable on
.turbo_enable off
```

> **Hinweis:** Rufen Sie zuerst `SUPERCPU_DETECT` auf und verzweigen Sie um
> dieses Makro herum, wenn die SuperCPU nicht vorhanden ist.

---

<a id="map_copy"></a>
### MAP_COPY

Kopiert eine Tilemap von einer Quelladresse in den Bildschirmspeicher (und
optional in den Farbspeicher) mithilfe einer Reihe von `LDA abs,X` / `STA
abs,X`-Schleifen. Pro Schleifendurchlauf wird eine 256 Byte große Seite kopiert;
eine Teilseite am Ende wird mit `CPX #rem / BNE` abgebrochen. Es wird kein JSR
benötigt – der gesamte Code wird inline generiert.

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
LDA $C000,X ; Seite 0
STA $0400,X
INX
BNE *-9 ; Schleife bis X zu 0 überläuft (256 Iterationen)
LDA $C100,X ; Seite 1
STA $0500,X
INX
BNE *-9
LDA $C200,X ; Seite 2
STA $0600,X
INX
BNE *-9
LDA $C300,X ; Rest — 232 Bytes
STA $0700,X
INX
CPX #$E8
BNE *-11
```

**Größe:** `2 (LDX) + volleSeiten×9 + (rem &gt; 0 ? 11 : 0)` Bytes pro
Abschnitt. Im kombinierten Modus verdoppelt sich die Größe (Bildschirmabschnitt
+ identischer Farbabschnitt).

**Kopplung mit dem Karteneditor:**

Der Karteneditor exportiert über **Dateien → Karte + Farb-RAM speichern (.bin)**
eine einzelne Binärdatei, deren erste `size` Bytes Bildschirmcodes und deren
nächste `size` Bytes Farb-RAM-Werte enthalten. Verwenden Sie MAP_COPY mit
aktiviertem **Kombinierte .bin** und geben Sie **Quelladresse** den Speicherort
an, an dem diese Datei geladen wird (z. B. über INCBIN in `$C000`).

```
* = $C000

INCBIN "map-color.bin" @ $C000 ; Bildschirmcodes $C000–$C3E7, Farben $C3E8–$C7CF

* = $0801

; ...

MAP_COPY src=$C000 dst=$0400 size=1000 combined color_dst=$D800
```

**Syntax im Expertenmodus:**
```
.map_copy $C000, $0400, 1000 ; Nur Bildschirm

.map_copy $C000, $0400, 1000, auto, $D800 ; Kombiniert (Farbe an Quelladresse + Größe)

.map_copy $C000, $0400, 1000, $C3E8, $D800 ; Explizite Farbquellenadresse
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Kopiert einen 16×16-Zeichenbereich aus einem kompakten
256-Byte-Bildschirmcodeblock und einem zugehörigen 256-Byte-Farb-RAM-Block. Es
ist für Charset-Canvas-Exporte und kleine Kachel-/Bildabschnitte vorgesehen, bei
denen das Schreiben von sechzehn separaten MAP_COPY-Zeilen zu unübersichtlich
wäre.

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

Die Kurzform kopiert Bildschirmbytes von `$3000`, Farbbytes von `$3100` und
platziert den 16×16-Block in Spalte 12, Zeile 4. Gültige Positionen oben links
sind `col = 0..24` und `row = 0..9`, sodass der gesamte 16×16-Bereich auf dem
40×25 C64-Textbildschirm erhalten bleibt.

**Generiertes Verhalten:**

- Erzeugt sechzehn Inline-Zeilenkopien.
- Jede Zeile kopiert 16 Bildschirmbytes und 16 Farbbytes.
- Es wird kein JSR benötigt; der Code wird direkt an der Makroposition
  ausgegeben.
- Funktioniert sowohl im normalen Zeichenmodus als auch im
  Mehrfarben-Zeichenmodus; die Farb-RAM-Bytes enthalten das
  Zeichenfarb-/Mehrfarben-Aktivierungsbit jeder Zelle.

Typische Kombination mit Charset Canvas:

```
* = 0801 $
    SEI
    LDA #$00
    STA $D021
    LDA #$05
    STA $D022
    LDA #$0D
    STA $D023
    .map_copy16x16 $3000, 12, 4
Schleife:
    JMP-Schleife

.incbin „16x16+ram+color.bin“, 3000 $
.incbin „16x16+charset.bin“, $2000
```

---

<a id="sprite_anim"></a>
### SPRITE_ANIM

Bei jedem Aufruf wird der Animationsframe eines Sprites erhöht und der
Datenzeiger des VIC-II-Sprites aktualisiert. Pro Frame wird ein Byte in einer
Tabelle gespeichert (Sprite-Datenseitennummer = `Datenadresse / 64`),
SPRITE_ANIM wird darauf verwiesen und die Funktion einmal pro Spielframe
aufgerufen – JSR ist nicht erforderlich.

| Feld                | Beschreibung                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| Sprite #            | Sprite-Nummer 0–7                                                                                |
| Frame-Listenadresse | Hex-Adresse der Frame-Tabelle — ein Byte pro Frame, jedes Byte = Sprite-Seite (`data_addr / 64`) |
| Frame-Anzahl        | Gesamtzahl der Einzelbilder (1–255)                                                              |
| Rahmen ZP           | Null-Seitenbyte, das als Frame-Zähler verwendet wird (z. B. `FB`).                               |

**Generiertes ASM (Sprite 0, 4 Frames, ZP `$FB`, Liste bei `$C100`):**
```
INC $FB ; Frame-Zähler erhöhen
LDA $FB
CMP #$04 ; Frame-Zähler
BCC *+6 ; Wenn Zähler &lt; Zählerstand, Reset überspringen
LDA #$00
STA $FB
TAX ; X = aktueller Frame-Index
LDA $C100,X ; Sprite-Datenseite für diesen Frame laden
STA $07F8 ; Sprite-0-Zeiger aktualisieren ($07F8 + Sprite#)
```

**Größe:** 19 Bytes.

**Typische Verwendung:**
```
frameTable:

.byte $21, $22, $23, $24 ; 4 Frames bei $0840, $0880, $08C0, $0900

gameloop:

WAIT_RASTER ($FF)

SPRITE_ANIM (sprite=0, list=$C100, count=4, zp=$FB)

JMP gameloop
```

**Syntax im Expertenmodus:**
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte

Beispiel:
.sprite_anim 0, C100, 4, FB
```

> **Tipp:** Platzieren Sie die Frame-Tabelle als RAWBYTES-Block an einer festen
> Adresse. Das Zähler-ZP-Byte (`$FB`) muss vor dem ersten Aufruf auf `$00`
> initialisiert werden. Falls Ihr Code `$FB` anderweitig verwendet, wählen Sie
> eine freie ZP-Adresse.

---

<a id="score_bcd"></a>
### SCORE_BCD

Addiert einen Festkommawert zu einem im Speicher abgelegten Mehrbyte-BCD-Wert
und gibt anschließend jede Ziffer als Bildschirmcodezeichen im RAM aus.
Verwendet den Dezimalmodus des 6502 (`SED`/`CLD`) für übertragssichere
BCD-Arithmetik – manuelle Übertragsberechnungen sind nicht erforderlich.

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

**Generierter ASM-Code (4 Bytes, +100 Punkte, Bewertung bei `$C200`, Bildschirm
bei `$0400`):**
```
SED ; BCD-/Dezimalmodus aktivieren

CLC
LDA $C200 ; Byte 0 (Ziffern 1–2)
ADC #$00 ; Niederbyte von 100 in BCD = $00

STA $C200
LDA $C201 ; Byte 1 (Ziffern 3–4)

ADC #$01 ; Mittelbyte von 100 in BCD = $01 (Übertrag wird weitergeleitet)

STA $C201
LDA $C202
ADC #$00

STA $C202
LDA $C203
ADC #$00

STA $C203
CLD ; Zurück in den Binärmodus

; Ziffern ausgeben
LDX #$00
digit_loop:
LDA $C200,X
PHA
LSR : LSR : LSR : LSR ; Hohes Nibble → niedriges Nibble
ORA #$30 ; + '0' Bildschirmcode
STA $0406,X ; rechtsbündig: Bildschirmadresse + (Ziffern*2 - 2) - X*2
PLA
UND #$0F ; niedriges Nibble
ORA #$30
STA $0407,X
INX
CPX #$04
BNE Ziffernschleife
```

**Größe:** `3 + Ziffern×8` Bytes (SED + CLC + CLD Overhead + 8 Bytes pro
BCD-Byte für ADC + Anzeigeschleife).

**Syntax im Expertenmodus:**
```
.score_bcd $C200, 4, 100, $0400
```

> **Tipp:** Initialisieren Sie die Punktebytes beim Start auf `$00`. Die
> Punkteadresse sollte sich im Nullseitenbereich oder im absoluten RAM befinden
> – nicht im ROM. Die Bildschirmadresse sollte auf die erste Ziffernzelle
> zeigen; die Ziffern werden von links nach rechts geschrieben (das
> höchstwertige Byte zuerst).

> **BCD-Bereich:** `Ziffern=4` Bytes → 8 Dezimalstellen → Maximalwert
> 99.999.999. Jedes Byte kodiert zwei BCD-Ziffern: `$00`–`$99`.

---

## 11. Links zur Wissensdatenbank

Schnellzugriffslinks sind in der App unter **Wissensdatenbank** verfügbar:

### RetroDebugger

[RetroDebugger](https://github.com/slajerek/RetroDebugger) ist ein
plattformübergreifender Commodore 64 Debugger mit Breakpoint-Unterstützung,
Speicherinspektion und labelbasierter Disassemblierung.

**Setup:** Öffnen Sie **Einstellungen → Konfigurieren Sie die
RetroDebugger-Executable** und verweisen Sie auf die `RetroDebugger`-Binärdatei.

**Starten:** Klicken Sie in der Symbolleiste auf **Debuggen (RetroDebugger)**.
Die App wird:

1. Das Programm soll in einer temporären Datei `.prg` kompiliert werden.
2. Schreibe eine **breakpoints-Datei** (`breakpoints.txt`) — ein `break $ADDR`
   pro markiertem Block.
3. Erstellen Sie eine **symbols-Datei** (`symbols.txt`) im
   Vice/RetroDebugger-Labelformat (`al C:addr .name`). Alle LABEL- und
   CONST-Blöcke sind enthalten.
4. Schreiben Sie außerdem Sidecars im C64Debugger-Stil neben die kompilierte
   PRG-Datei: `.dbg`, `.sym` und `.vs`.
5. RetroDebugger starten mit:
   ```
   RetroDebugger -prg <file.prg> -breakpoints <breakpoints.txt> -symbols <symbols.txt> [flags]
   ```

### Haltepunktblöcke

Klicken Sie auf das Haltepunktsymbol (●) in einem beliebigen Anweisungsblock, um
diesen als Haltepunkt zu aktivieren. Haltepunktblöcke werden rot hervorgehoben.
Ihre Adressen werden bei jedem Start des Debuggers in die Haltepunktdatei
geschrieben.

### Debugger-Flags (Registerkarte „Optionen“)

| Umschalten     | Flagge       | Wirkung                                                                             |
| -------------- | ------------ | ----------------------------------------------------------------------------------- |
| `-jmp` EIN     | `-jmp $ADDR` | Nach dem Laden direkt zur Startadresse des Programms springen.                      |
| `-unpause` EIN | `-unpause`   | Den Debugger beim Laden sofort wieder aktivieren.                                   |
| `-wait` ON     | `-wait <ms>` | Warten Sie `<ms>` Millisekunden, bevor Sie die Pause aufheben – 500 ms oder 1000 ms |

> Tipp: Aktivieren Sie für die meisten Programme die Befehle `-jmp` und
> `-unpause` für den sofortigen Autostart. Verwenden Sie `-wait 500` oder `-wait
> 1000`, wenn Ihr Programm IRQs oder SID-Musik einrichtet, die vor dem ersten
> Raster Zeit zum Initialisieren benötigen.

---

## 12. D64 Export & Run

Version 1.5.1 bietet die Möglichkeit, Ihr Programm (und zusätzliche
Datendateien) in ein C64 D64 Disk-Image zu packen und es in VICE zu starten –
oder das Disk-Image für die Verwendung an anderer Stelle zu exportieren.

| Ressource                               | URL                                                            |
| --------------------------------------- | -------------------------------------------------------------- |
| 6502 Opcodes-Referenz                   | http://www.6502.org/tutorials/6502opcodes.html                 |
| C64-Kernelfunktionen                    | https://sta.c64.org/cbm64krnfunc.html                          |
| C64 Speicherbelegung                    | https://sta.c64.org/cbm64mem.html                              |
| C64-Farbcodes                           | https://sta.c64.org/cbm64col.html                              |
| VIC-II Artikel                          | https://www.cebix.net/VIC-Article.txt                          |
| C64-Codebasis                           | https://codebase.c64.org/                                      |
| Der Turbo-Monteur                       | https://turbo.style64.org/                                     |
| RetroDebugger                           | https://github.com/slajerek/RetroDebugger/                     |
| C64-Betriebssystem-Entwicklungsumgebung | https://www.c64os.com/c64os/programmersguide/?s=devenvironment |
| png2c64 Bildkonverter                   | https://png2c64.app/                                           |

---

## 12b. CRT-Export (Magic Desk 64K-Kassette)

**Menü → Erstellen → CRT erstellen** erzeugt ein Commodore 64-Cartridge-Image
(`.crt`, **Cartridge Typ 19 – Magic Desk / Domark / HES Australia**), das auf
VICE, TheC64, echter Hardware via EasyFlash / Kung Fu Flash und 1541 Ultimate
II+-Cartridge-Slots läuft. Es ist sowohl im **Blockmodus** als auch im
**Expertenmodus** verfügbar und – seit dem aktuellen Build – auch im
**UltimateBasic-Modus**.

### Was befindet sich im Warenkorb?

Die Schaltfläche **Ausführen** in der Symbolleiste wurde durch eine Schaltfläche
**Teilen** ersetzt:

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
| **Kung Fu Flash 2**        | Kompilieren Sie die Datei zu PRG und laden Sie sie über USB-Seriell auf einen echten C64/C128 mit einem **Kung Fu Flash 2**-Modul. Siehe [Kung Fu Flash 2](#kung-fu-flash-2).                                                                    |

Der gewählte Modus wird zwischen den Sitzungen gespeichert.

### Ladeadresse und Einstiegspunkt

Build CRT verwendet niemals Exomizer (der Depacker kann nicht vom Cartridge-ROM
ausgeführt werden). Es kompiliert den aktuellen Tab mit der
Standard-Autostart-Pipeline und übernimmt die Ladeadresse aus dem PRG-Header und
den Einstiegspunkt aus dem SYS-Ziel:

1. **Block-/Expertenmodus mit BASIC SYS-Stub aktiviert:** load = `$0801`, entry
   = das SYS-Ziel (typischerweise `$080D` oder der Ursprung des Benutzers).
2. **Block-/Expertenmodus mit deaktiviertem BASIC SYS-Stub:** Laden =
   Benutzerursprung (mit dem klassischen `$0801 → $C000`-Fallback), Eintrag =
   Ladeadresse.
   - **Name** — wie es im D64-Verzeichnis erscheint (max. 16 Zeichen,
     automatische Großschreibung).
   - **Addr** (Ladeadresse, optional) – Falls angegeben, wird ein
     2-Byte-PRG-Header vorangestellt. Leer lassen, um Rohdaten ohne Header zu
     schreiben.
   - **Dst** (Dekomprimierungsziel, nur mit EXO) – hier soll der Depacker die
     Daten auf dem C64 ablegen. Wenn EXO aktiviert ist, werden die zusätzlichen
     Daten mit `exomizer mem -l <Adresse> Datei,<Ziel>` komprimiert, bevor sie
     auf den D64 geschrieben werden. Die Sicherheits-Offset-Kompensation von +2
     wird automatisch angewendet.
   - **EXO** – Kontrollkästchen, das die Rückwärtsverarbeitung im Speichermodus
     `mem` für diesen Eintrag aktiviert. Die Größe auf der Festplatte beträgt
     typischerweise 5–20 % des Originals.
3. **UltimateBasic-Modus:** Laden und Starten erfolgen beide über die
   UB-Compiler-Map (`build.map.loadAddress`). Der UB-Autostart-Stub innerhalb
   der Payload wird dann genau so ausgeführt, wie es nach `LOAD "...",8,1 : RUN`
   von der Festplatte der Fall wäre.

Die im ASM-Output angezeigte Ursprungsadresse bleibt erhalten; der Loader
kopiert einfach das flache Speicherabbild aus dem PRG in den RAM und springt zum
Einstiegspunkt, sobald der Cartridge-ROM nicht mehr zugeordnet ist.

### Größenbeschränkung

Da die Nutzdaten linear gespeichert werden und `assembleProgramToPrg()` einen
flachen `minAddr..maxAddr`-Puffer mit Null-aufgefüllten Lücken zurückgibt, zählt
ein Programm mit weit auseinanderliegenden ORG-Segmenten (z. B. `$0801` +
`$C000` + `$E000`) jedes Byte dazwischen zum Budget von 65.408 Byte. Wird dieses
Limit überschritten, bricht der Build mit einem `saveCrtTooLarge`-Fehler ab –
entweder muss das Speicherlayout komprimiert oder die Daten aufgeteilt werden.

Das Beispiel **loadfile-demo** enthält bereits die Datei `DEMO-COLORS.PRG` als
zusätzliche Datei. Wählen Sie diese aus, öffnen Sie **Run via D64** und klicken
Sie auf **Run**, um den gesamten Ladevorgang zu sehen.

> **⚠️ Wichtiger Hinweis – vor dem Versand eines CRT lesen**

### Kompatibilität

Das Symbol in der Symbolleiste nach dem Kurveneditor öffnet den D64-Editor – ein
eigenständiges Werkzeug zur direkten Bearbeitung eines vorhandenen D64-Images,
unabhängig vom aktuell geöffneten Programm. Im Gegensatz zum Dialogfeld
„Exportieren nach D64“ (das immer eine neue Festplatte aus der kompilierten
PRG-Datei erstellt) bearbeitet der D64-Editor ein Festplatten-Image direkt über
c1541 und dient somit gleichzeitig als schlanker Festplattenmanager.

**Dateien ▾ Menü:**

| Plattform             | Aktion                                                  |
| --------------------- | ------------------------------------------------------- |
| VICE (`x64sc`, `x64`) | Funktioniert über **Datei → Cartridge-Image anhängen**. |
| TheC64 / TheC64 Mini  | Funktioniert über den eingebauten Patronenlader.        |
| Kung Fu Blitz         | Funktioniert – im nativen Magic Desk-Modus.             |
| EasyFlash-Kartusche   | Funktioniert, wenn es als Magic Desk programmiert ist.  |

**Symbolleiste:**

| Symbol                      | Aktion                                                                                                                                                                                                                     |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Programm hinzufügen**     | Wählen Sie eine lokale Datei aus und schreiben Sie sie in das Verzeichnis auf der Festplatte.                                                                                                                              |
| **Ausgewählte extrahieren** | Speichern Sie die Bytes des ausgewählten Eintrags in einer lokalen `.prg`-Datei.                                                                                                                                           |
| **Ausgewählte umbenennen**  | Bearbeiten Sie den Eintragsnamen direkt in der Tabelle – Enter bestätigt, Escape bricht ab.                                                                                                                                |
| **Ausgewählte löschen**     | Den ausgewählten Eintrag von der Festplatte entfernen.                                                                                                                                                                     |
| **Aktualisieren**           | Lesen Sie das Verzeichnis erneut ein, z. B. nachdem Sie die Festplatte mit einem anderen Tool bearbeitet haben.                                                                                                            |
| **Speichern**               | Schreibt die Änderungen der Arbeitskopie zurück in die eigentliche `.d64`-Datei und erstellt vorher eine automatische Sicherungskopie. Diese Funktion ist nur aktiviert, solange ungespeicherte Änderungen vorhanden sind. |

**Hinzufügen eines Programms:** Die Auswahl einer Datei, die bereits auf `.prg`
endet, fragt lediglich nach einem **Name** und einem Datenträgertyp**Typ**
(PRG/SEQ/USR/REL) – eine `.prg` enthält bereits ihren eigenen Ladeadressheader
und wird daher unverändert geschrieben. Die Auswahl einer anderen Datei (z. B.
einer unformatierten `.bin`) zeigt zusätzlich Folgendes an:

- **Ladeadresse** (hex, optional) — Füge an dieser Adresse einen
  2-Byte-PRG-Header voran; lasse das Feld leer, um die Bytes roh zu schreiben.
- **Dekomprimierungsadresse** (hex, optional) — wird nur zusammen mit Exomizer
  verwendet; die Zieladresse, an die der Depacker die Daten entpacken soll.
- Kontrollkästchen **Exomizer** — Die Datei wird vor dem Schreiben komprimiert,
  wobei die gleichen `mem`/`sfx`-Komprimierungsmodi wie bei den zusätzlichen
  Dateien im obigen Dialogfeld „Exportieren nach D64“ verwendet werden.

Die Verzeichnisauflistung gibt Dateinamen in der gleichen Schriftart und
Großbuchstabensprache wieder wie eine echte C64 `LOAD"$",8`-Auflistung.

Arbeitsablauf speichern: Jede Änderung – Hinzufügen, Extrahieren, Umbenennen,
Löschen und Byte-Bearbeitungen im Blockeditor – wird auf eine private
Arbeitskopie des Datenträgerabbilds angewendet, nicht auf Ihre eigentliche
Datei. Die Schaltfläche „Speichern“ in der Symbolleiste (aktiviert, sobald
ungespeicherte Änderungen vorhanden sind) überschreibt die eigentliche Datei mit
der Arbeitskopie und erstellt zuvor eine automatische Sicherung. Solange
Änderungen ungespeichert sind, wird im Header eine Markierung angezeigt. Beim
Schließen des Editors oder beim Öffnen eines anderen Datenträgers mit
ungespeicherten Änderungen werden Sie um Bestätigung gebeten, anstatt die
Änderungen zu verwerfen. Mit „Speichern unter…“ (Menü „Datei ▾“) wird die
Arbeitskopie unter einem neuen Pfad gespeichert und die Bearbeitung dort
fortgesetzt.

**Block-Editor:** Das Rastersymbol in der Symbolleiste wechselt zu einer
Rohdatenansicht der Spuren/Sektoren unterhalb des Verzeichnisses – einer
anklickbaren Blockkarte, die anhand der freien/belegten Bitmap der BAM-Datei
eingefärbt ist (BAM-Datei und Verzeichniskette werden separat markiert), einem
Byte-spezifischen Hex-Raster für den ausgewählten 256-Byte-Block sowie der
Navigation zum vorherigen/nächsten Sektor. Blockbearbeitungen durchlaufen
denselben Workflow (Arbeitskopie/Speichern) wie die oben beschriebenen
Verzeichnisaktionen.

> **Anforderung:** Wie beim Export nach D64 benötigt der D64 Editor VICE
> (`c1541`), das in den [Hardware-Einstellungen](#13-hardware-settings)
> konfiguriert ist.

---

## 13. Hardwareeinstellungen

Öffnen Sie **Einstellungen → Hardwareeinstellungen…** im Menü der Symbolleiste.
Hier finden Sie alle externen Hardwarepfade und die Netzwerkkonfiguration.

### VICE-Emulator

- **8 × 8 KB Bänke** an `$8000`, Bankumschaltung über `$DE00` (Magic Desk
  Konvention: die unteren 3 Bits = Bank, Bit 7 = Modul deaktivieren).
- **Bank 0** enthält einen 128-Byte-Header + Bootloader:
  - `$8000/$8002` Kalt- und Warmstartvektoren zeigen auf `$8009`.
  - `$8004–$8008` = die `CBM80`-Signatur, die vom KERNAL-Reset-Code benötigt
    wird.
  - `$8009–$807F` = der Loader: SEI / Stack-Initialisierung / `JSR $FDA3`
    (IOINIT) / `JSR $FD50` (RAMTAS) / `JSR $FD15` (RESTOR) / `JSR $FF5B` (CINT),
    dann eine Byte-Kopierschleife, die die Nutzdaten vom Cartridge-ROM in den
    RAM streamt und die Bänke wechselt, wenn `$FC` `$A0` erreicht. Am Ende
    kopiert es einen winzigen **Exit-Stub** nach `$0100`, deaktiviert den Cart
    mit `LDA #$80 : STA $DE00` und springt mit `JMP`s zum Einstiegspunkt.
- Die Nutzdaten ** beginnen bei `$8080` in Bank 0 und werden bei Bedarf in die
  Bänke 1–7 verteilt. Die maximale Nutzlast beträgt `8 * 8192 − 128 = 65 408
  Bytes`.

### Exomizer

**Workflow:**

- Installieren Sie die Exomizer-Binärdatei:
- Konfigurieren Sie den Pfad im Abschnitt **Hardware-Einstellungen → Exomizer**.
- Aktivieren Sie das Kontrollkästchen **Mit Exomizer ausführen** im Menü
  **Einstellungen**.

Exomizer funktioniert unter Windows und macOS auf die gleiche Weise – die CLI
wird vom Tauri-Backend aufgerufen; nichts an der Integration ist
plattformspezifisch.

### Retro-Debugger

Die vollständige Dokumentation zum Debugger finden Sie in [Abschnitt 9]{1}.

> **⚠️ Wichtiger Hinweis – vor dem Versand eines CRT lesen**
> 
> Der Loader ruft im Rahmen der Standard-Reset-Sequenz den KERNAL **`RESTOR`
> ($FD15)** auf. Dadurch werden die Standard-I/O-Vektoren an den Adressen
> `$0314/$0315`, `$0316/$0317`, `$0318/$0319`, `$0328/$0329` und weitere
> absichtlich auf ihre ROM-Standardwerte zurückgesetzt. Folgen:
> 
> - **Alle vor dem CRT-Start gesetzten IRQ-/NMI-/BRK-Hooks werden gelöscht.**
>   Ihr Programm muss diese nach dem Start selbst installieren – genau wie bei
>   einem frischen `LOAD "",8,1 : RUN` von Band/Disk.
> - **UltimateBasic-Programme**, die darauf angewiesen sind, dass nicht
>   standardmäßige KERNAL-Vektoren beim Start aktiv sind, benötigen
>   möglicherweise einen expliziten `SYS`- oder init-Aufruf im Autostart-Stub.
>   Der standardmäßige UB-Autostart funktioniert sofort;
>   Erweiterungsbibliotheken, die Vektoren *before* `RUN` einbinden, tun dies
>   nicht.
> - **CIA1 / CIA2** werden durch `IOINIT` neu initialisiert. Benutzerdefinierte
>   Timer-Einstellungen (Raster-IRQs, Musikplayer CIA-A) müssen nach dem Aufruf
>   neu programmiert werden.
> - Der Cart ist über einen 8-Byte-Stub im **RAM an Adresse `$0100`**
>   deaktiviert, sodass der `STA $DE00` nicht durch einen fehlerhaften ROM-Fetch
>   unterbrochen werden kann. Verlassen Sie sich nicht darauf, dass
>   `$0100–$0107` beim Eintritt das Stack-Top-Image enthält – der erste RAM-Push
>   überschreibt den Stub.
> 
> Wenn ein CRT-Programm in VICE läuft, aber auf realer Hardware fehlschlägt,
> sollte man zunächst prüfen, ob das Programm beim Start einen bestimmten
> Kernel-Vektor oder CIA-Timer-Zustand voraussetzt. Wenn Sie den Zustand
> explizit in Ihrer Initialisierungsroutine festlegen, verhält sich das Programm
> auf beiden Systemen gleich.

### C64 Ultimate / 1541 Ultimate

| Plattform                       | Beschreibung                                                           |
| ------------------------------- | ---------------------------------------------------------------------- |
| **Host (IP)**                   | IP-Adresse des Geräts (z. B. `192.168.1.100`)                          |
| **Passwort**                    | Optional – falls das Gerät eine Authentifizierung erfordert            |
| **Verbindung testen**           | Sendet eine Testanfrage an `/v3/runners/info`; zeigt OK oder Fehler an |
| EasyFlash-Kartusche             | Funktioniert, wenn es als Magic Desk programmiert ist.                 |
| 1541 Ultimate II+ / Ultimate 64 | Funktioniert über **Cartridge → Load cart image**.                     |
| Chamäleon / Turbo-Chamäleon     | Funktioniert.                                                          |

---

## 14. Visuelle Editoren (Toolkit)

Das Menü **Toolkit** in der Symbolleiste gruppiert die visuellen Dateneditoren,
die alle über ein gemeinsames Menü „Dateien“ (`Dateien ▾`) für „BIN laden“, „BIN
speichern“, „In Blöcke exportieren“ und „Als D64 speichern“ verfügen. Jeder
Editor erzeugt Rohdaten im Format `.bin`, die mit `INCBIN` in ein Programm
eingebunden oder über den Eintrag **Als D64 speichern** direkt auf eine D64-Disk
geschrieben werden können.

### Hi-Res / Multicolor Editor

| Einstellung     | Beschreibung                                                                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Modusumschalter | Mit dem Kontrollkästchen **Multicolor** kann zwischen hochauflösender Darstellung (monochrom pro Zelle) und mehrfarbiger Darstellung (4 Farben pro Zelle) umgeschaltet werden. |
| **Status**      | Zeigt an, ob der Ausführungspfad gültig und erreichbar ist.                                                                                                                    |

Pixelgenauer Bitmap-Editor mit 320×200-Hi-Res- und 160×200-Multicolor-Modus.
Öffnen über Toolkit → Hi-Res-Editor.

### Sprite-Editor

| Einstellung | Beschreibung                                                                  |
| ----------- | ----------------------------------------------------------------------------- |
| Rahmen      | Rahmen hinzufügen / entfernen / neu anordnen; Rahmenleiste unten dargestellt. |
| Modus       | Umschaltung zwischen einfarbig und mehrfarbig.                                |
| **Status**  | Zeigt an, ob der Ausführungspfad gültig und erreichbar ist.                   |

**Workflow:**
1. Installieren Sie die Exomizer-Binärdatei:
   - **Windows:** Laden Sie die vorkompilierte `win32/exomizer.exe` von
     https://bitbucket.org/magli143/exomizer/wiki/Home oder
     https://csdb.dk/release/?id=244342 herunter.
   - **macOS:** `brew install exomizer` (installiert Magnus Linds offiziellen
     Build 3.1.2).
2. Konfigurieren Sie den Pfad im Abschnitt **Hardware-Einstellungen →
   Exomizer**.
3. Aktivieren Sie das Kontrollkästchen **Mit Exomizer ausführen** im Menü
   **Einstellungen**.
4. Alle **Run**-Aktionen (PRG, D64, hardware) und **Build**-Aktionen (Build PRG,
   Build D64) werden nun das assemblierte Programm vor dem Start oder Speichern
   durch `exomizer sfx sys` verarbeiten.

Exomizer funktioniert unter Windows und macOS auf die gleiche Weise – die CLI
wird vom Tauri-Backend aufgerufen; nichts an der Integration ist
plattformspezifisch.

**Intern werden zwei Kompressionsmodi verwendet:**

| Modus             | Wird verwendet von                                            | Anrufungskonvention                                                                                                                                                                                        |
| ----------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sfx sys`         | Mit Exomizer-Umschaltung erstellen/ausführen (Haupt-PRG-Pfad) | Selbstextrahierendes PRG mit integriertem Decruncher; die Border-Flash-Einstellung steuert `-x1` vs `-n`                                                                                                   |
| `mem` (rückwärts) | Ausführung über D64 → Kontrollkästchen pro Datei **EXO**      | Komprimiert jede zusätzliche Datei zu einem `mem`-Modus-Stream; das Programm dekomprimiert sie zur Laufzeit über das **EXODECRUNCH**-Makro und einen vorgefertigten Depacker (`samples/exo-decrunch.bin`). |

> **Tipp:** Wenn der Exomizer-Pfad nicht konfiguriert, das Kontrollkästchen aber
> aktiviert ist, wird anstelle des Starts eine Fehlermeldung angezeigt.
> Deaktivieren Sie das Kontrollkästchen, um die Anwendung ohne Komprimierung
> auszuführen.

> **Integrationstest:** `cargo test --test exomizer_integration` (in
> `src-tauri/`) überprüft den vollständigen Mem-Mode-Komprimierungs- und
> Dekomprimierungs-Roundtrip auf einem 6502-Emulator.

### C64 Character ROM Browser ("Zeichentabelle")

| Einstellung       | Beschreibung                                                                                                                                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Zwei Zeichensätze | Registerkarte 1: **Einstellung 1 – Oben/Grafik** (Standardmodus nach dem Einschalten). Registerkarte 2: **Einstellung 2 – Unten/Oben** (nach Umschalten auf `$0E`).                                                                                    |
| **Status**        | 16×16-Raster aller 256 Zeichen. Klicken Sie auf ein Glyphe, um dessen Detailansicht anzuzeigen: vergrößerte 8×8-Pixel-Ansicht, Bildschirmcode (dezimal + hexadezimal), PETSCII-Codes (sowohl Standard als auch verschoben) und die rohe 8-Byte-Bitmap. |

Nur-Lese-Viewer für das C64-Zeichen-ROM (die integrierte PETSCII-Schriftart).
Öffnen über den Eintrag **C64 chargen** im Toolkit-Menü. Nützlich, um den
Bildschirmcode eines Glyphen zu ermitteln, bevor dieser mit `RAWBYTES` oder
`TEXT` geschrieben wird.

### Zeicheneditor (Zeichensatz)

256-Zeichen-Zeichensatz-Editor (8×8). Öffnen über Toolkit → Zeicheneditor.

| Einstellung          | Beschreibung                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------- |
| ROM laden            | Importiert den C64 ROM-Zeichensatz direkt aus VICEs `chargen` (ohne Dateiauswahl).          |
| Lade `.bin`          | Importiert eine externe 2048-Byte-Zeichensatz-Binärdatei.                                   |
| Vorschau pro Zeichen | Ein 16 Zellen breites Raster aller 256 Glyphen, wobei die aktuelle Zelle hervorgehoben ist. |

**Workflow:**
1. Verbinden Sie den 1541 Ultimate / Ultimate 64 mit Ihrem lokalen Netzwerk.
2. Geben Sie die IP-Adresse (und gegebenenfalls das Passwort) in den
   Hardwareeinstellungen ein.
3. Wählen Sie im geteilten Ausführungsmenü **Auf Hardware ausführen**.
4. Klicken Sie auf **▶ Ausführen** – das PRG wird kompiliert und per HTTP POST
   an `/v3/runners/prg` gesendet. Das Gerät lädt es und führt es sofort auf dem
   C64 aus.

> **Tipp:** Kein USB-Kabel oder Treiber erforderlich – die REST-API ist in die
> Ultimate-Firmware integriert. Ihr Computer und das Gerät müssen sich im selben
> lokalen Netzwerk befinden.

### Zeichensatz-Leinwand-Editor

Vollflächiger Zeichensatz-Maler zum Erstellen von Bildschirmdarstellungen aus
einem vollständigen 256-Zeichen-Zeichensatz. Öffnen über Toolkit →
Zeichensatz-Leinwand.

Die Zeichenfläche umfasst 16×16 Zeichen. Im Monochrom-Modus ergibt sich daraus
ein Arbeitsbereich von 128×128 Pixeln; im Mehrfarben-Zeichenmodus ergibt sich
ein breiter Arbeitsbereich von 64×128 Pixeln unter Verwendung der
Mehrfarbenregeln des C64.
- ein Commodore 64 / C128 mit eingebautem **Kung Fu Flash 2** Modul,
  eingeschaltet;
- **Kung Fu Flash Firmware v2.07 oder neuer** auf der Cartridge – ältere
  Firmware-Versionen unterstützen das von Visual Assembler verwendete
  Upload-Protokoll nicht. Firmware-Releases:
  <https://codeberg.org/KimJorgensen/KungFuFlash2/releases/>;
- ein **USB-Kabel**, das die Cartridge mit dem Computer verbindet, auf dem
  Visual Assembler läuft (es wird als virtueller serieller Port angezeigt).

| Einstellung            | Beschreibung                                                                                                                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Monochrom / mehrfarbig | Im Mono-Modus werden 1-Bit-Glyphen der Größe 8×8 gespeichert. Im Mehrfarbenmodus werden horizontale Pixelpaare mit zwei Bit gespeichert und verwendete Zellen mit Bit 3 des Farb-RAMs markiert. |

**Workflow:**
1. Stecken Sie das Kung Fu Flash 2 in den Modulschacht des C64, schalten Sie den
   Computer ein und verbinden Sie das USB-Kabel mit Ihrem PC/Mac.
2. Öffnen Sie die **Hardware-Einstellungen** und überprüfen Sie den Abschnitt
   **Kung Fu Flash 2** – der Port sollte bereits ausgefüllt sein.
3. Wählen Sie **Kung Fu Flash 2** aus dem Split-Run-Menü (die Auswahl wird
   gespeichert und auch in den Projektdateien abgelegt).
4. Klicken Sie auf **▶ Ausführen**. Das Programm wird kompiliert, die Cartridge
   startet im MENU-Loader neu (kurzes 1200-Baud-Signal an der seriellen
   Schnittstelle), es folgt ein kurzer Handshake und die PRG-Datei wird
   hochgeladen. Nach Abschluss der Übertragung läuft das Programm auf dem
   Rechner.

Funktioniert gleichermaßen im Block-, Experten- und Ultimate Basic-Modus;
Ultimate Basic-Programme werden aus der Startdatei des Projekts kompiliert.

> **Beschränkungen und Prüfungen:** Die PRG-Datei muss die Zwei-Byte-Ladeadresse
> plus mindestens ein Datenbyte enthalten, in den 64-KiB-Adressraum des C64
> passen und die vom Loader des Moduls akzeptierte Größe nicht überschreiten.
> Fehler – Port nicht konfiguriert, Port kann nicht geöffnet werden, Modul kehrt
> nicht vom Menü zurück oder Upload abgelehnt – werden in einer Benachrichtigung
> mit der genauen Begründung gemeldet.

> **Tipp:** Falls Sie ein Cartridge-Image anstelle eines Live-Uploads
> bevorzugen, **Build CRT** (Magic Desk 64K) läuft auch auf dem Kung Fu Flash –
> siehe [Abschnitt 12b](#12b-crt-export-magic-desk-64k-cartridge).

---

---

### Versionskontrolle (Git)

| Einstellung                                                               | Beschreibung                                                                                                                                                 |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Automatische Autosave-Einträge in der Versionskontrolle**               | Fügt etwa 2,5 Sekunden nach Beendigung der Bearbeitung einen automatischen Speichereintrag zur Versionshistorie hinzu (gilt auch für Projektregisterkarten). |
| **Wähle git.exe…**                                                        | Navigieren Sie zur ausführbaren Datei `git` (`git.exe` unter Windows).                                                                                       |
| **Automatische Erkennung**                                                | Löscht den ausgewählten Pfad und durchsucht den PATH sowie die üblichen Installationsordner.                                                                 |
| **Verwenden Sie Git, wenn sich das Projekt in einem Repository befindet** | Öffnet den Dialog zur Versionsverwaltung im Git-Modus für Dateien innerhalb eines Git-Repositorys.                                                           |
| **Status**                                                                | Zeigt die Git-Version an oder dass Git nicht gefunden wurde (die integrierte Versionskontrolle funktioniert weiterhin).                                      |

## 14. Visuelle Editoren (Toolkit)

Das Menü **Toolkit** in der Symbolleiste gruppiert die visuellen Dateneditoren,
die alle über ein gemeinsames Menü „Dateien“ (`Dateien ▾`) für „BIN laden“, „BIN
speichern“, „In Blöcke exportieren“ und „Als D64 speichern“ verfügen. Jeder
Editor erzeugt Rohdaten im Format `.bin`, die mit `INCBIN` in ein Programm
eingebunden oder über den Eintrag **Als D64 speichern** direkt auf eine D64-Disk
geschrieben werden können.

Die Dialogfelder des visuellen Editors lassen sich über ihre Kopfzeilen im
gesamten Arbeitsbereich des Visual Assemblers verschieben. Ein Dialogfeld ohne
gespeicherte Position wird zentriert geöffnet; nach dem Verschieben wird seine
letzte Position in den UI-Einstellungen gespeichert und beim nächsten Öffnen
wiederhergestellt.

### Hi-Res / Multicolor Editor

Pixelgenauer Bitmap-Editor mit 320×200-Hi-Res- und 160×200-Multicolor-Modus.
Öffnen über Toolkit → Hi-Res-Editor.

| Besonderheit                  | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modusumschalter               | Mit dem Kontrollkästchen **Multicolor** kann zwischen hochauflösender Darstellung (monochrom pro Zelle) und mehrfarbiger Darstellung (4 Farben pro Zelle) umgeschaltet werden.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Werkzeuge                     | Bleistift, Radiergummi, Linie, Rechteck, ausgefülltes Rechteck, Oval, ausgefülltes Oval, Flächenfüllung, Zellpapier, auswählen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Zellpapier (hochauflösend)    | Die hochauflösende Darstellung ermöglicht zwei Farben in jeder 8×8-Zelle: die Tinte (Pixel setzen, hohes Nibble des Bildschirm-RAM-Bytes der Zelle) und das Papier (Pixel löschen, niedriges Nibble). Das Werkzeug **Zellenpapier** ändert die Papierfarbe jeder Zelle, die Sie anklicken oder über die Sie ziehen; **PAPER** ändert die Farbe weiterhin für alle Zellen gleichzeitig. Der Radierer löscht Pixel, sodass das Papier der Zelle sichtbar wird. Diese Funktion ist im Mehrfarbenmodus deaktiviert, da der Hintergrund ($D021) gemeinsam genutzt wird.                                                                                                                                                                                          |
| Sprühwerkzeug                 | Ein Malprogramm im Airbrush-Stil, das beim Zeichnen Pixel um den Cursor herum verteilt.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Sprühintensität               | Über das Dropdown-Menü neben dem Sprühwerkzeug lässt sich die Dichte jedes Sprühstoßes steuern.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Farbpalette                   | Vordergrund- (Tinte) + Papier- (Hintergrund) Auswahlmöglichkeiten. Im Mehrfarbenmodus werden automatisch 3 zusätzliche Farben pro Zelle erfasst.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Rückgängig / Wiederherstellen | Verlauf pro Hub, Strg+Z / Strg+Y.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Wählen                        | Das gestrichelte Quadrat-Werkzeug: Ziehen Sie auf der Arbeitsfläche, um einen rechteckigen Bereich zu markieren. **Esc** löscht die Auswahl.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Kopieren / Einfügen           | **Kopieren** (`Strg/Cmd+C`) kopiert den ausgewählten Bereich. **Einfügen** (`Strg/Cmd+V`) zeigt eine Vorschau an, die dem Cursor folgt: Klicken Sie auf die Arbeitsfläche, um das Einfügen zu platzieren, **Esc** bricht ab. Die Kopie bleibt erhalten, sodass Sie sie durch Drücken von `Strg/Cmd+V` und erneutes Klicken beliebig oft einfügen können. Im hochauflösenden Modus gilt für eingefügte Pixel weiterhin die Beschränkung auf zwei Farben pro Zelle. Richten Sie den Bereich daher am Zellenraster aus, um die Farben beizubehalten. Kopieren, Einfügen und Transparentes Einfügen befinden sich auch im Kontextmenü der Arbeitsfläche (Rechtsklick). Ein dort gestartetes Einfügen wird an der angeklickten Stelle in der Vorschau angezeigt. |
| Transparente Paste            | `Ctrl/Cmd+Shift+V` (oder die entsprechende Schaltfläche in der Symbolleiste) überspringt die papierfarbenen Pixel der Kopie, sodass das darunterliegende Bild durchscheint.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Raster                        | **Grid** zeigt das Zeichenzellenraster an: 8×8 Pixel in hoher Auflösung, 4×8 Pixel doppelter Breite in Mehrfarbendarstellung. Ab 4-facher Vergrößerung wird außerdem eine dünnere Linie um jedes einzelne Pixel gezeichnet, sodass jedes Pixel exakt platziert werden kann. **Raster** fügt eine Rasterzeilen-Überlagerung hinzu.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Zoom                          | Schieberegler von 1× bis 16×.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Bild importieren              | PNG/JPEG/GIF-Dateien, die in die Arbeitsfläche eingefügt werden, werden automatisch auf die 16-Farben-C64-Palette quantisiert.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Exportblöcke                  | Fügt dem Programm BYTE/RAWBYTES-Blöcke mit den codierten Bitmap-, Bildschirm- und Farbdaten hinzu.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Export `.bin`                 | Speichert das native Multicolor-Format (10000 Bytes: 8000 Bitmap + 1000 Bildschirm + 1000 Farbe) bereit für LOADFILE in $2000.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

### Sprite-Editor

Sprite-Editor (24×21 Pixel) mit Mehrbildanimation. Öffnen über Toolkit →
Sprite-Editor.

| Besonderheit                  | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rahmen                        | Frames hinzufügen/entfernen/neu anordnen; Frame-Leiste unten angezeigt. **Kopieren** / **Einfügen** in der Frame-Zeile kopiert den gesamten aktuellen Frame; dieselben beiden Einträge befinden sich im Kontextmenü der Arbeitsfläche und der Frame-Leiste.                                                                                                                                                                                                                                                                     |
| Modus                         | Umschaltung zwischen einfarbig und mehrfarbig.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Werkzeuge                     | Stift, Füllung, Linie, Rechteck, Kreis – plus horizontal spiegeln, vertikal spiegeln, verschieben (links/rechts/oben/unten, mit optionalem Umbruch). Die Formwerkzeuge zeigen beim Ziehen eine Live-Vorschau; zum Bestätigen loslassen.                                                                                                                                                                                                                                                                                         |
| Rückgängig / Wiederherstellen | Vollständiger Rückgängig-/Wiederherstellen-Stapel pro Frame. Strg/Cmd+Z / Strg/Cmd+Y oder die Schaltflächen in der Symbolleiste.                                                                                                                                                                                                                                                                                                                                                                                                |
| Bildimport                    | Importieren Sie eine PNG- oder JPEG-Datei über Datei → Bild importieren. Der Importer ordnet jedem Pixel die nächstgelegene Farbe der C64-Palette zu und schreibt sie in den aktuellen Frame.                                                                                                                                                                                                                                                                                                                                   |
| Animationsvorschau            | Wiedergabe/Stopp mit einstellbarer Geschwindigkeit.                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Exportblöcke                  | Fügt für jeden Frame einen RAWBYTES-Block an einer 64-Byte-ausgerichteten Adresse sowie eine Sprite-Pointer-Einrichtung ein.                                                                                                                                                                                                                                                                                                                                                                                                    |
| Speichern `.bin`              | Schreibt 64 Bytes pro Frame (Rohdaten der Sprites ohne Auffüllung).                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Auswahl                       | **Auswählen/Verschieben**: Ziehen Sie ein Rechteck und anschließend innerhalb des Rechtecks, um die Pixel zu verschieben (leere Pixel sind transparent). Mit den Pfeiltasten verschieben Sie das Rechteck um ein Pixel (bei mehrfarbigen Elementen um zwei Pixel). Entf löscht die Auswahl, Esc lässt sie verschwinden. **90° drehen** (in beide Richtungen): Dreht die Auswahl oder den gesamten Rahmen. Auswahl, Spiegeln, Verschieben und Drehen wirken sich gleichzeitig auf den Rahmen und die darüberliegende Fläche aus. |
| Hochauflösendes Overlay       | **Hi-res overlay** fügt über jedem Frame einen zweiten, einfarbigen hochauflösenden Sprite hinzu – die klassische Kontur über einem mehrfarbigen Körper. Die Liste **Layer** wählt die bearbeitete Ebene aus; der Overlay wird abgedunkelt, während der Körper bearbeitet wird. Auf dem C64 ist es ein separater Sprite: Weisen Sie ihm eine niedrigere Sprite-Nummer als dem Körper zu. `.bin` und **Copy bytes** schreiben die Overlay-Sprites nach dem Sprite des Körpers (`sprite_f1_ov_1`).                                |
| Alle Spiegeln                 | Fügt eine horizontal gespiegelte Kopie jedes Frames (und seiner Hitbox) hinzu – ein Laufzyklus in die andere Richtung mit einem Klick.                                                                                                                                                                                                                                                                                                                                                                                          |
| Sprite-Sheet-Import           | Dateien → **Sprite-Sheet importieren…**: Zellenbreite/-höhe, Versatz, Abstand und Frame-Anzahl teilen das Bild in Frames der aktuellen Größe auf (mehrfarbige Zellen werden auf 12 Pixel pro Sprite skaliert). Die Farben stammen aus dem Bild oder bleiben die des Sprites; OKLab-Farbanpassung ohne Dithering, geordnetes (Bayer) oder Floyd-Steinberg-Dithering. Ersetzt die Frames oder fügt sie an.                                                                                                                        |
| Hitbox                        | Das **Hitbox**-Werkzeug zieht ein Rechteck pro Frame (gestrichelt cyan); **Anpassen**, **An jeden Frame anpassen**, **In jeden Frame kopieren** und **Entfernen** befinden sich im Seitenbereich. Dateien → **Hitbox-Tabelle kopieren** liefert `sprite_hit_x / _y / _w / _h` (ein Byte pro Frame, Bildschirmpixel von der oberen linken Ecke); ein Frame ohne Hitbox verwendet seine Pixelgrenzen.                                                                                                                             |
| X / Y ×2                      | Zeigt die Vorschau wie bei der Sprite-Erweiterung `$D01D` / `$D017`.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

### C64 Character ROM Browser ("Zeichentabelle")

Schreibgeschützter Viewer für das C64-Zeichen-ROM (die integrierte
PETSCII-Schriftart). Öffnen über den Eintrag **C64 chargen** im Toolkit-Menü.
Nützlich, um den Bildschirmcode eines Glyphen zu ermitteln, bevor dieser mit
`RAWBYTES` oder `TEXT` geschrieben wird.

| Besonderheit      | Beschreibung                                                                                                                                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Zwei Zeichensätze | Registerkarte 1: **Einstellung 1 – Oben/Grafik** (Standardmodus nach dem Einschalten). Registerkarte 2: **Einstellung 2 – Unten/Oben** (nach Umschalten auf `$0E`).                                                                                    |
| Glyphenraster     | 16×16-Raster aller 256 Zeichen. Klicken Sie auf ein Glyphe, um dessen Detailansicht anzuzeigen: vergrößerte 8×8-Pixel-Ansicht, Bildschirmcode (dezimal + hexadezimal), PETSCII-Codes (sowohl Standard als auch verschoben) und die rohe 8-Byte-Bitmap. |
| Detailpanel       | Zeigt den Bildschirmcode des ausgewählten Glyphen, die PETSCII-Codes und die acht Rohbytes an – bereit zum Einfügen in einen `RAWBYTES`- oder BYTE-Block.                                                                                              |
| Nur lesbar        | Hier ist keine Bearbeitung möglich – verwenden Sie den Zeicheneditor (unten), um Glyphen zu ändern.                                                                                                                                                    |

### Zeicheneditor (Zeichensatz)

256-Zeichen-Zeichensatz-Editor (8×8). Öffnen über Toolkit → Zeicheneditor.

| Besonderheit                  | Beschreibung                                                                                                                                                                                                                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ROM laden                     | Lädt den C64-Zeichen-ROM – die exakten Glyphen 901225-01, ohne Dateiauswahl. Die erste Schaltfläche (und **Dateien → ROM: Großbuchstaben / Grafiken**) lädt Satz 1, die zweite Schaltfläche (oder Shift+Klick oder **Dateien → ROM: Kleinbuchstaben / Großbuchstaben**) lädt Satz 2. |
| Lade `.bin`                   | Importiert eine externe 2048-Byte-Zeichensatz-Binärdatei.                                                                                                                                                                                                                            |
| Vorschau pro Zeichen          | Ein 16 Zellen breites Raster aller 256 Glyphen, wobei die aktuelle Zelle hervorgehoben ist.                                                                                                                                                                                          |
| Pixel-Editor                  | Bearbeitet das ausgewählte Zeichen oder eine **Kachel** aus 2×1, 1×2 oder 2×2 benachbarten Zeichen als ein Bild (Kachelauswahl).                                                                                                                                                     |
| Zeichenwerkzeuge              | Bleistift, Linie, Rechteck, gefülltes Rechteck und Flächenfüllung. Ein Klick auf ein bereits mit Tinte gefülltes Pixel löscht diese.                                                                                                                                                 |
| Transformiert                 | Löschen, invertieren, horizontal/vertikal spiegeln, mit Wrap-around verschieben, um 90° im Uhrzeigersinn/gegen den Uhrzeigersinn drehen (nur quadratische Kacheln) – auf der gesamten Kachel.                                                                                        |
| Rückgängig / Wiederherstellen | Symbolleistenschaltflächen, Strg+Z und Strg+Y (Strg+Umschalt+Z).                                                                                                                                                                                                                     |
| Kopieren / Einfügen           | Schaltflächen in der Symbolleiste, Strg+C / Strg+V oder Rechtsklick auf die Karte; kopiert die gesamte Kachel mit ihren Farben.                                                                                                                                                      |
| Kartenverschieben             | Ziehen Sie eine Spielfigur auf eine andere auf der Karte, um sie zu tauschen; ziehen Sie Kopien mit gedrückter Umschalttaste.                                                                                                                                                        |
| Textvorschau                  | Geben Sie Text ein, um ihn im aktuellen Zeichensatz anzuzeigen. Wählen Sie die Groß- oder Kleinbuchstabenzuordnung; `{65}` oder `{$41}` fügt einen Bildschirmcode ein.                                                                                                               |
| Bereichsexport                | Stellen Sie die Zeichen von / Bis ein und wählen Sie dann **Dateien → Bereich speichern (.bin)** (Rohbytes) oder **Bereich kopieren ASM** (`.byte` Zeilen).                                                                                                                          |
| Farbe pro Zeichen             | Speichert einen Standardwert für den Farbspeicher (Color RAM) für jedes Glyphen. Im Mehrfarbenzeichenmodus bleiben dabei auch das Mehrfarben-Aktivierungsbit pro Zelle und die eigene 3-Bit-Farbe des Zeichens erhalten.                                                             |
| Metadaten-Roundtrip           | Beim Laden kompatibler Daten aus Charset Canvas / Map-Workflows bleiben die Farbmetadaten pro Zeichen erhalten, sodass Bearbeitungen fortgesetzt werden können, ohne die Farbabsicht zu verlieren.                                                                                   |
| Exportblöcke                  | Fügt RAWBYTES an der Adresse $0800 (Block 2) oder $3800 (Block 7) mit dem kodierten Zeichensatz an.                                                                                                                                                                                  |

### Zeichensatz-Leinwand-Editor

Vollflächiger Zeichensatz-Maler zum Erstellen von Bildschirmdarstellungen aus
einem vollständigen 256-Zeichen-Zeichensatz. Öffnen über Toolkit →
Zeichensatz-Leinwand.

Die Zeichenfläche umfasst 16×16 Zeichen bzw. 128×128 Pixel. Im Mehrfarbenmodus
ist jedes Zeichen entweder mehrfarbig (breite Pixel, 4 Farben) oder
hochauflösend (8 schmale Pixel, 2 Farben), genau wie beim C64.

| Besonderheit                            | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| Monochrom / mehrfarbig                  | Im Mono-Modus werden 1-Bit-Glyphen der Größe 8×8 gespeichert. Im Mehrfarbenmodus werden horizontale Pixelpaare mit zwei Bit gespeichert und mehrfarbige Zellen mit dem dritten Bit des Farb-RAMs markiert.                                                                                                                                                                                                                                                                                                                                                                                                               |                                                               |
| Werkzeug für den Zeichenmodus           | Im Mehrfarbenmodus können Sie durch Klicken oder Ziehen über die Zeichen zwischen Mehrfarben- und hochauflösender Darstellung (Farb-RAM Bit 3) umschalten. Die Form bleibt erhalten: Ein festgelegtes Pixelpaar wird zur Farbe des Zeichens. Ein hochauflösendes Zeichen hat den Hintergrund und seine eigene Farbe (0–7); MC1/MC2 zeichnen dort nicht.                                                                                                                                                                                                                                                                  |                                                               |
| Hintergrund                             | Das BG-Dropdown-Menü wird auch im Monochrom-Modus angezeigt; MC1 / MC2 nur im Mehrfarbenmodus.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |                                                               |
| ECM                                     | Die Checkbox **ECM** (erweiterter Farbmodus, nicht zusammen mit Mehrfarben): Jedes Zeichen wird hochauflösend mit eigener Farbe (0–15) und einem von vier Hintergründen BG0–BG3 dargestellt (`$D021`–`$D024`; BG1/BG2 sind die MC1/MC2-Register). Wählen Sie eine Hintergrundfarbe aus der Palette (B0–B3) und klicken oder ziehen Sie dann mit dem Werkzeug **Zeichenhintergrund** über die Zeichen. Es passen nur 64 verschiedene Zeichen: Die Statuszeile zählt sie, und beim Speichern werden gleiche Zeichen zusammengeführt – der Zeichensatz umfasst 64 Zeichen (512 Byte), und die Bildschirmcodes sind `glyph`. | Hintergrund << 6`. Schalten Sie ECM mit Bit 6 von `$D011 ein. |
| C64 Farbmodell                          | Hintergrund verwendet `$D021`; gemeinsam genutzte Mehrfarben 1 verwendet `$D022`; gemeinsam genutzte Mehrfarben 2 verwendet `$D023`; die Farbe jedes Zeichens stammt aus den Farb-RAM-Bits 0–2.                                                                                                                                                                                                                                                                                                                                                                                                                          |                                                               |
| Zeichenwerkzeuge                        | Bleistift, Radiergummi, Linie, Rechteck, Oval und Flächenfüllung arbeiten über die Zeichengrenzen hinweg.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |                                                               |
| Sprühwerkzeug                           | Eine Zeichnung im Airbrush-Stil, bei der Pixel über benachbarte Zellen/Zeichen verteilt werden.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |                                                               |
| Sprühintensität                         | Über das Dropdown-Menü neben dem Sprühwerkzeug lässt sich die Hubdichte einstellen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                                                               |
| Raster umschalten                       | Das Kontrollkästchen „Raster“ blendet das 16×16-Zeichenraster ein oder aus.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |                                                               |
| Zoom                                    | Der Zoom-Regler (2×–24×, volle Gerätepixel pro C64-Pixel) oder Strg+Rad über der Arbeitsfläche; die Zoomstufe wird gespeichert. Ab 8× zeichnet das Raster zusätzlich eine feine Linie an jeder Pixelkante.                                                                                                                                                                                                                                                                                                                                                                                                               |                                                               |
| Zeichensatz speichern `.bin`            | Speichert die 2048 Byte großen Zeichenbitmap-Daten.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                                                               |
| 16×16 Karte speichern + Farb-RAM `.bin` | Speichert 256 Bildschirmcodes, gefolgt von 256 Farb-RAM-Werten. Verwenden Sie dies mit `MAP_COPY16X16`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                                                               |
| Laden                                   | Kann charset-canvas-Speicherstände, einfache charset-Daten und kompatible Character Editor-charset-Daten einschließlich gespeicherter Farben pro Zeichen laden, sofern vorhanden.                                                                                                                                                                                                                                                                                                                                                                                                                                        |                                                               |

**Wichtige C64-Einschränkung:** Im Mehrfarben-Zeichenmodus gelten die beiden
gemeinsam genutzten Farben global für den gesamten Bildschirm (`$D022` /
`$D023`). Nur die Eigenfarbe des Zeichens ist zellenspezifisch und auf die
Farben 0–7 beschränkt, da Bit 3 des Farb-RAMs den Mehrfarbenmodus auswählt. Ein
Zeichen kann also maximal **4 Farben** (Hintergrund, MC1, MC2 und Eigenfarbe)
und der gesamte Bildschirm maximal 3 + 8 Farben darstellen. In der Palette sind
die gemeinsam genutzten Farben mit BG / 1 / 2 gekennzeichnet, die nicht
gemeinsam genutzten Farben 8–15 sind abgedunkelt. Die Auswahl einer solchen
Farbe wird nur dann in MC2 oder MC1 gespeichert, wenn kein Pixel dieses Register
verwendet; andernfalls kann sie im zugehörigen Dropdown-Menü geändert werden
(wodurch der gesamte Bildschirm neu eingefärbt wird). Im hochauflösenden
(monochromen) Modus hat ein Zeichen 2 Farben: die Hintergrundfarbe und seine
eigene Farbe (0–15).

### Karteneditor (Mehrschichtige Kachelkarten)

Layered Tilemap Editor für statische Szenerien, Sprite-Spawn-Maps,
Kollisionsdaten und Ähnliches. Öffnen über Toolkit → Map Editor.

| Besonderheit                                | Beschreibung                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Schichten                                   | Mehrere benannte Ebenen, jede mit eigenem Tileset und eigener Deckkraft.                                                                                                                                                                                                                                       |
| Pinsel                                      | Einzelkachel-, Füll-, Linien-, Rechteck- und Kreismodus. Die Formwerkzeuge zeigen beim Ziehen eine Live-Vorschau an; zum Bestätigen loslassen.                                                                                                                                                                 |
| Rückgängig / Wiederherstellen               | Vollständige Rückgängig-/Wiederherstellen-Funktion pro Ebene. Strg/Cmd+Z / Strg/Cmd+Y oder die entsprechenden Schaltflächen in der Symbolleiste.                                                                                                                                                               |
| Menü löschen                                | Klarstellung pro Ebene oder für die gesamte Karte mit Bestätigung.                                                                                                                                                                                                                                             |
| Bildimport                                  | Ziehen Sie eine PNG-Datei einer Kachelkarte hinein; der Editor zerlegt diese automatisch in Kacheln.                                                                                                                                                                                                           |
| Kopieren / Einfügen                         | Kopieren Sie einen ausgewählten Kachelbereich und fügen Sie ihn anschließend normal ein oder verwenden Sie die transparente Einfügefunktion, um leere Kacheln transparent zu halten. Dieselben Optionen finden Sie im Kontextmenü (Rechtsklickmenü) der Arbeitsfläche.                                         |
| Mehrfarbenfähige Fliesenfärbung             | Bei Verwendung kompatibler Zeichensatz-Metadaten verwendet das Malen die im Farbspeicher der Kachel gespeicherten Standardwerte (einschließlich Mehrfarbenkodierung) anstelle einer generischen, flachen Farbe.                                                                                                |
| Benutzerdefinierte Zeichensatzfarben        | Wenn ein Zeichensatz `charColors`-Metadaten enthält, verwendet der Karteneditor beim Zeichnen den Standardwert des Farb-RAMs der ausgewählten Kachel.                                                                                                                                                          |
| Exportblöcke                                | Gibt RAWBYTES-Blöcke für Tileset-Grafiken + Kartendaten aus.                                                                                                                                                                                                                                                   |
| Bildschirmspeicher (.bin) speichern…        | Speichert nur die Bildschirmcodes für die aktuelle Kartenebene (40×25 = 1000 Bytes).                                                                                                                                                                                                                           |
| Bildschirm-RAM + Farb-RAM speichern (.bin)… | Speichert Bildschirmcodes, verkettet mit Farb-RAM-Werten, in einer einzigen 2000-Byte-Datei (`screen[0..999]` gefolgt von `color[0..999]`). Verwenden Sie diese Datei zusammen mit dem Makro **MAP_COPY** (kombinierter .bin-Modus), um Bildschirm und Farbe in einem Schritt zur Laufzeit wiederherzustellen. |

### Level-Editor

Ordnet die Bildschirme des **Karteneditors** zu einem Level an – beispielsweise
einem vertikalen Shooter, einem scrollenden Autospiel, einem Side-Scroller oder
einer 2D-Karte – und zeigt den gesamten Level in flüssiger Scroll-Vorschau an.
Öffnen Sie ihn über die Schaltfläche **Level-Editor** in der Symbolleiste neben
dem Karteneditor.

| Besonderheit           | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout                 | **Vertikal**, **Horizontal** oder **Raster** (Zeilen × Spalten, mit Schaltflächen zum Hinzufügen/Entfernen von Zeilen und Spalten).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Bildschirme            | **Neuer leerer Bildschirm**, **Aus dem Karteneditor hinzufügen** (die aktuell geöffnete Karte) oder **Karte(n) laden (.bin)…** (mehrere Kartenexporte gleichzeitig). Ziehen Sie einen Bildschirm aus der Liste auf einen Slot; ziehen Sie Slots aufeinander, um sie zu tauschen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Bearbeitung            | **Im Karteneditor bearbeiten** öffnet den ausgewählten Bildschirm im Karteneditor und stellt die Änderungen wieder her; duplizieren, nach oben/links oder unten/rechts verschieben, entfernen; rückgängig machen / wiederherstellen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Vorschau               | Ziehen Sie die Vorschau oder verwenden Sie die Pfeiltasten, um pixelweise zu scrollen; **Wiedergabe** scrollt automatisch (Richtung, Geschwindigkeit 1–8, Schleife), Leertaste = Wiedergabe/Stopp. *Rahmen* markiert die Bildschirmränder.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Schecks                | Informationen zum Zeichensatz und eine Warnung, wenn Bildschirme einen anderen Zeichensatz oder andere Farben verwenden (das Level verwendet die Einstellungen des ersten Bildschirms).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Charaktereigenschaften | Mit der Schaltfläche **Charakterattribute** wird die Übersicht auf Attributmalerei umgeschaltet: Wählen Sie **Solid**, **Ladder**, **Hazard** oder **Collectible**, klicken Sie auf einen Charakter, und jede Zelle mit diesem Bildschirmcode erhält (oder verliert) ihn; ziehen Sie, um weitere Codes hinzuzufügen. Die Attribute werden als farbige Ebene angezeigt und bilden die 256 Byte große Tabelle `LEVEL_ATTR` (`LEVEL_ATTR_SOLID` = 1, `_LADDER` = 2, `_HAZARD` = 4, `_COLLECT` = 8).                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Kantenprüfung          | Rote Markierungen zeigen an, wo benachbarte Bildschirme nicht aneinandergrenzen: eine Seite des Randes ist leer (Leerzeichen), die andere nicht, oder nur eine Seite ist ausgefüllt. Das Seitenfeld zählt die Ränder und Zellen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Farben                 | **Level-Rahmen** und **Eigene Farben für diesen Bildschirm** (Hintergrund, Rahmen, Mehrfarbig 1 / 2) für den ausgewählten Bildschirm; der Vorschaurahmen zeigt den Rahmen. Exportiert pro Slot als `LEVEL_SCR_BG / _BORDER / _MC1 / _MC2` (mit `LEVEL_SCR_COLORS` = 1), wenn ein platzierter Bildschirm eigene Farben hat.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Erinnerung             | Die Datengröße von `.level` an einer gewählten Adresse (genau berechnet, wie sie vom Makro erstellt wird), mit Warnungen für das BASIC-/KERNAL-ROM, den E/A-Bereich und den Speicher unterhalb von `$0800` sowie die RLE-Größe des Levels. **Export RLE to blocks / Copy RLE asm** gibt das mit dem `level_unrle`-Entpacker gepackte Level-RLE aus (`($FB)` → `($FD)`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Läuft bei VICE         | Erstellt ein mit dem Joystick scrollbares Testprogramm aus dem Level (dem `level-demo` Scroller, Code bei `$C000`, Leveldaten von `$2000`, benutzerdefinierter Zeichensatz bei `$2000`) und startet es in VICE – die Bildschirmfarben wechseln mit dem Bildschirm oben links in der Ansicht, die Kamera startet beim ersten Startobjekt.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Objekte                | Die Schaltfläche „Objektebene“ schaltet die Übersicht in den Objektbearbeitungsmodus: Wählen Sie einen Typ (Start, Gegner, Gegenstand, Tür, Ausgang, Auslöser) und ein Byte mit Parametern (Gegnerart, Gegenstands-ID, Türziel usw.) aus. Klicken Sie zum Platzieren, ziehen Sie zum Verschieben (einrastet bei 8 px, Umschalt = frei). Klicken Sie auf ein Objekt, um es auszuwählen und seinen Typ/Parameter zu ändern. Mit den Pfeiltasten verschieben Sie es, mit der Entf-Taste entfernen Sie es. Objekte gehören zur Levelposition, nicht zum Bildschirm. Sie werden in der Seitenleiste aufgelistet, in der Vorschau angezeigt, mit dem Level gespeichert und in Scrollreihenfolge (vertikal entlang der Y-Achse, horizontal entlang der X-Achse, Rasterzeile für Rasterzeile) als LEVEL_OBJ_*-Tabellen exportiert – entweder über „Assembler kopieren / In Blöcke exportieren“ oder über das Makro „Level“. |

**Menü „Dateien“:**
| Aktion                                                                   | Was es tut                                                                                                                                       |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Neues Level** / **Level öffnen (.bin)…** / **Level speichern (.bin)…** | Das Levelprojekt: alle Bildschirme plus das Layout. Dies ist die Datei, die das Makro `.level` und Ultimate Basics Map-Ladeprogramm `` einlesen. |
| **Speichern des Bildschirm-RAM-Levels (.bin)…**                          | Das gesamte Level als eine einzige Zeichenkarte (nur Bildschirmcodes).                                                                           |
| **Speichern des Levels Bildschirm + Farb-RAM (.bin)…**                   | Die gesamten Bildschirmcodes des Levels, gefolgt von den zugehörigen Farben.                                                                     |
| **Export nach Blöcken** / **Assembler kopieren**                         | Die Leveldaten als Blöcke oder als ASM-Text (Zwischenablage).                                                                                    |

**Verwendung des Levels:** im Assembler, `.level "level.bin"` + `.level_row`
(siehe [LEVEL / LEVEL_ROW](#level--level_row) und `samples/level-demo.asm`); in
Ultimate Basic 1.6.1+, `map load "level.bin", $4000` und `map view px, py`
(Beispiel `level_scroll_demo.ub`).

### SID-Editor (3-Stimmen-Tracker)

Multiinstrument-Tracker mit 3 Stimmen. Öffnen über Toolkit → SID-Editor. **Play:
All** startet den exportierten 6502-Player im WebSID-Emulator; alle anderen
Vorschauen (Instrumentenvorschau, virtuelle Tastatur, Noteneingabe,
Akkord/Arpeggio, Zeilen- und Einzelmusterwiedergabe) werden ebenfalls über das
emulierte SID wiedergegeben: Ein JS-Modell desselben Players (Frame für Frame)
streamt seine SID-Register in jedem Frame an WebSID, und bis zu drei
Vorschau-Noten teilen sich die drei Stimmen. Der Stream-Player wird beim Öffnen
des Editors und nach dem Stoppen erneut geladen, sodass die Noten gleichzeitig
erklingen; ohne WebSID wird stattdessen ein kleiner SID-Synthesizer verwendet.

**Vorschau-Engine:** **Einstellungen → SID-Vorschau** wählt **WebSID** oder **VA
SID Core (Rust)**, die eigene SID-Emulation der App; bei VA SID Core wählen Sie
auch den Chip (MOS 6581 / 8580). Die Instrumentenparameter werden über
Drehregler eingestellt.

**Instrumentenspezifische Steuerung:**
- Wellenform-Kontrollkästchen (TRI / SAW / PUL / NOI) — mehrere Wellenformen
  werden wie beim SID mit UND verknüpft — plus **RING** (Ringmodulation der
  Dreieckswelle durch die vorherige Stimme: 1 ← 3, 2 ← 1, 3 ← 2) und **SYNC**
  (harte Synchronisierung mit der vorherigen Stimme).
- ADSR (Attack / Decay / Sustain / Release) wird als Drag-Diagramm über den vier
  Schiebereglern dargestellt.
- Schieberegler für die Pulsbreite (0-4095).
- **Filter:** *Diese Stimme durch den Filter leiten*, LP / BP / HP und **3 AUS**
  (Stimme 3 stummschalten, wenn sie nicht geroutet ist), Cutoff, Resonanz,
  Lautstärke. **Ende** + **Sweep** verschiebt den Cutoff pro Frame um Sweep von
  Cut in Richtung End; **Ping-Pong** springt zwischen den beiden hin und her –
  dies erzeugt resonante Filter-Sweeps. Die Stimme, die ein durch den Filter
  geroutetes Instrument startet, bestimmt den Filter (Cutoff, Resonanz, Modus);
  jede Stimme, deren Instrument geroutet ist, durchläuft ihn.
- **Vibrato:** nach **Delay** Frames ein Dreieck-LFO, der alle **Speed** Frames,
  **Depth** 0-15 skaliert auf den Halbton der Note (unabhängig vom `V` Effekt)
  gedreht wird.
- **Pulsweitenmodulation:** **Geschwindigkeit** wird in jedem Frame zur
  Pulsbreite addiert und schwankt zwischen **Min** und **Max**.
- **Gate:** **Gate-Timer** gibt das Gate so viele Frames vor der nächsten Note
  der Stimme frei (unterhalb von Speed halten); **Harter Neustart** setzt ADSR
  ebenfalls auf Null, um einen sauberen Anschlag zu gewährleisten; **Erster
  Frame** schreibt eine Wellenform in den ersten Frame der Note (z. B. `$09`
  Test + Gate).
- **Wellenform-/Arpeggio-Tabelle: ** Bis zu 32 Wellenformschritte (— =
  beibehalten) und Notenwerte (Offset in Halbtonschritten oder **abs** =
  absolute Note), ein Schritt alle **Speed** Frames, **Loop** Zurück zum
  vorherigen Schritt oder Stopp beim letzten Schritt. **Presets** (25, in
  Gruppen; die Liste behält das ausgewählte Preset bei, bis die Tabelle manuell
  bearbeitet wird): Arpeggien (Dur, Moll, Septakkorde, Sus4, vermindert,
  übermäßig, Powerchord, Oktave, Triller), Drums (Bassdrum, Snare, Tom, Clap,
  geschlossene/offene Hi-Hat), Lead- und Bass-Attacks sowie Soundeffekte (Laser,
  Pickup, Explosion).

**Tracker-Gitter:**
- 3 Stimmen × bis zu 7 Muster × 32 Zeilen = 7 × 32 = maximal 224 Zeilen
  (begrenzt durch einen 8-Bit-Zeilenzähler).
- Pro Zeile: Note + Instrumentenindex, plus ein optionaler Effekt (siehe
  **Effektspalte** unten). Leere Zeilen enthalten die vorherige Note: Wie bei
  anderen Trackern (GoatTracker, SID-Wizard) behält eine Note ihren Haltepegel
  (Sustain-Pegel) bis zur nächsten Note dieser Stimme oder bis zu einem
  **Note-Off**.
- **Enter** (oder ein Doppelklick) bearbeitet die ausgewählte Zelle als Text
  (`C-4 01 V24`); **Enter** speichert und wechselt zur nächsten Zeile, **Esc**
  bricht ab.
- **Note-off** (`===`): Taste **1** (oder `` ` `` / `=`) oder `===` / `OFF` in
  eine Zelle eingeben. Dadurch wird das Gate freigegeben, sodass die
  Release-Funktion des Instruments läuft – genau wie beim Effekt `C` ohne Note
  (gespeichert und exportiert als `C00`).
- Wählen Sie eine Zelle wie gewohnt aus oder halten Sie **Shift** gedrückt und
  klicken Sie mit den Pfeiltasten, um eine rechteckige Auswahl über mehrere
  Zeilen und alle drei Stimmen zu erweitern. Ein Rechtsklick innerhalb des
  ausgewählten Bereichs erhält die Auswahl aufrecht.
- Kopieren, Ausschneiden, Einfügen und Löschen sind über die Symbolleiste und
  das Kontextmenü verfügbar. `Strg/Cmd+C` und `Strg/Cmd+V` wirken auf dieselbe
  rechteckige Auswahl.
- Harmoniehilfe: Wählen Sie Grundton, Akkordtyp und Oktave, hören Sie sich den
  Akkord mit dem aktuellen Instrument an und fügen Sie die Voicings direkt in
  den Tracker ein. Verfügbare Typen: Dur, Moll, Vermindert, Übermäßig, Sus2,
  Sus4, Dominantseptakkord, Durseptakkord, Mollseptakkord, 6, Mollsextakkord, 9,
  kleine None, übermäßige None, Verminderter Septakkord und 7sus4.
- Arpeggio-Hilfe: Vorschau oder Einfügen von 4-, 8- oder 16-stufigen Notenläufen
  vom ausgewählten Akkord in aufwärts, abwärts oder aufwärts/abwärts gerichteter
  Richtung.
- **Vorschauzeile** spielt die ausgewählte Zeile in allen drei Stimmen ab, ohne
  die Musterwiedergabe zu starten.
- Beim Einfügen von Zellbereichen beginnt die Einfügung nun an der Startzelle
  des ausgewählten Bereichs und endet sauber an den Zeilen- und Bereichsgrenzen,
  anstatt in die nächste Spalte oder Zeile umzubrechen.
- Mit dem Geschwindigkeitsregler wird der IRQ-Tick-Teiler (Frames zwischen den
  Zeilen) festgelegt.

**Song / Reihenfolge:**
- Die Muster werden über eine Song-/Reihenfolgeliste angeordnet, die über der
  Rohmusterbank liegt – dasselbe Muster kann sich wiederholen, und der Song kann
  länger sein als die Anzahl der gespeicherten Muster.
- Schritte können im Songlistenfenster hinzugefügt, entfernt und neu angeordnet
  werden; der aktuelle Schritt wird während der Wiedergabe hervorgehoben.
- Sowohl die Wiedergabe in der App als auch jeder Export folgen dieser Liste,
  nicht der Reihenfolge des Rohmusters – Exporte, die vor dem Bestehen der
  Reihenfolgeliste erstellt wurden, werden immer noch korrekt als einfacher
  0..N-1-Song geladen.

**Effektspalte:** Jede Zelle kann einen Effekt zusammen mit ihrer Note und ihrem
Instrument enthalten, der als Kurzcode direkt nach der Note eingegeben wird (z.
B. `C-4 01 V24`) oder allein für eine notenlose Effektzeile (z. B. `F06`):

| Code | Wirkung                             | Wert                                                                                   |
| ---- | ----------------------------------- | -------------------------------------------------------------------------------------- |
| `V`  | Vibrato                             | Niedriges Anbeißen = Tiefe, hohes Anbeißen = Haltelänge                                |
| `U`  | Slide up (Portamento)               | Betrag, der in jeder Zeile zur Häufigkeit hinzugefügt wird                             |
| `D`  | Gleiten Sie nach unten (Portamento) | Betrag, der von der Häufigkeit jeder Zeile abgezogen wird                              |
| `C`  | Note abgeschnitten                  | Die Stimme wird stummgeschaltet, ohne erneut ausgelöst zu werden; Wert nicht verwendet |
| `F`  | Geschwindigkeitsänderung            | Der neue Wert für Bilder pro Zeile wird sofort wirksam.                                |

Die Effekte werden einmal pro Zeile aktualisiert (entsprechend dem Timing des
exportierten Players), laufen in der Web-Audio-Vorschau und dem kompilierten
6502-Export identisch ab und werden verlustfrei im versionierten `.bin`-Format
gespeichert/geladen.

**Wiedergabe und virtuelle Tastatur:**
- Die Schaltfläche „Wiedergabe“ in der Symbolleiste ändert sich während der
  Wiedergabe zu „Pause“ und während der Pause zu „Fortsetzen“; „Stopp“ beendet
  die Wiedergabe und setzt den Status zurück.
- Die Schaltfläche in der Tastaturleiste öffnet **VA-VK**, ein nicht-modales
  Piano (2, 3 oder 4 Oktaven; Position, Öffnungszustand, Oktave und *In Tracker
  einfügen* werden gespeichert) mit eigenen **Wiedergabe-/Stopp-Schaltflächen**,
  das auch während der Nutzung des SID-Editors verwendet werden kann. Ziehen Sie
  die Kopfzeile an eine beliebige Stelle innerhalb der Hauptanwendung.
- Aktivieren Sie **In Tracker einfügen**, um jede gespielte Note an der
  aktuellen Tracker-Cursorposition zu speichern und zur nächsten Zeile zu
  wechseln. Deaktivieren Sie diese Funktion, um Noten ohne Bearbeitung
  anzuhören.
- Akkord- und Arpeggio-Vorschauen leuchten die entsprechenden Klaviertasten auf,
  wenn die Tastatur geöffnet ist.

**Aufnahme, Metronom und MIDI:**
- **Aufnahme** (der rote Punkt in der Tracker-Symbolleiste und auf dem VA-VK)
  speichert die gespielten Noten – auf dem VA-VK, der Computertastatur oder
  einem MIDI-Keyboard – zeitgesteuert in der ausgewählten Stimme, beginnend in
  der ausgewählten Zeile und mit der aktuellen Geschwindigkeit. Sobald das
  Pattern voll ist, wird nach dem aktuellen Songschritt ein neues, leeres
  Pattern eingefügt und die Aufnahme dort fortgesetzt. Drücken Sie erneut auf
  Aufnahme, um den Vorgang zu beenden.
- Das Metronom (Tracker-Symbolleiste und VA-VK) klickt alle vier Zeilen, wobei
  der erste Schlag jedes Vier-Schlag-Takts betont wird. Die daneben befindlichen
  Taktlichter blinken bei jedem Schlag während der Wiedergabe und Aufnahme, auch
  wenn das Klicken deaktiviert ist.
- **MIDI:** Wählen Sie den Eingang in der **MIDI**-Liste neben dem
  Instrumentennamen und drücken Sie **MIDI verbinden**. Die Noten werden über
  das aktuelle Instrument wiedergegeben (und während der Aufnahme oder mit *In
  Tracker einfügen* in den Tracker geschrieben). Die Lampe neben der Taste
  blinkt bei jeder eingehenden MIDI-Nachricht.
- **Muster löschen:** Die Schaltfläche **−** neben **Pat +** löscht das aktuelle
  Muster (vorher wird gefragt, ob das Muster Noten enthält). Die Songschritte,
  die dieses Muster verwendet haben, werden entfernt und die anderen neu
  nummeriert; mindestens ein Muster bleibt immer erhalten.
- Der **Master-Lautstärkeregler** befindet sich auf VA-VK.

**Dateien-Menü-Exporte:**
| Export                                   | Was es tut                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Speichern .bin…`                        | Speichert im vom Editor bereitgestellten serialisierten Format (Instrumente mit allen Modulationseinstellungen und -namen, Geschwindigkeit, Patterns, Song). Ältere Speicherstände werden weiterhin geladen.                                                                                                                                                                                                                                                       |
| `Exportblöcke (nur Daten)`               | Fügt Instrumententabelle + Musterblöcke an das Programm an der Stelle `* = $C000` an.                                                                                                                                                                                                                                                                                                                                                                              |
| `Exportblöcke + Minispieler`             | Fügt den vollständigen Player (sid_init / sid_irq / sid_frame / sid_play_row / sid_set_voice) sowie PAL-Frequenztabellen hinzu. Nach dem Export fügen Sie in Ihrem Hauptcode an der Stelle, an der die Musik starten soll, einen `JSR sid_init`-Aufruf ein; verwenden Sie stattdessen Ihren eigenen IRQ-Aufruf `JSR sid_frame` einmal pro Frame.                                                                                                                   |
| `Assembler exportieren (Zwischenablage)` | Kopiert den vollständigen Assembler-Quelltext in die Zwischenablage.                                                                                                                                                                                                                                                                                                                                                                                               |
| `GoatTracker .sng importieren…`          | Lädt einen GoatTracker 2-Song anstelle des aktuellen – siehe **GoatTracker import** unten.                                                                                                                                                                                                                                                                                                                                                                         |
| `Export nach UltimateBasic`              | Schreibt einen `tune ... end`-Block (Instrumente, Reihenfolgeliste, Patternzeilen als Text) plus `music play` und fügt ihn an der Cursorposition des Ultimate Basic-Editors ein; außerhalb des UB-Modus wird der Text in die Zwischenablage kopiert. Der Ultimate Basic-Compiler erstellt den Player, daher steuern `music play` / `music stop` ihn. Die Instrumentenmodulation erfolgt in den Zeilen `imod` / `ifilt` / `igate` / `itab` (Ultimate Basic 1.6.2+). |

**GoatTracker-Import:** **Dateien → GoatTracker .sng importieren…** lädt einen
GoatTracker 2-Song (`.sng`, GTS3–GTS5) anstelle des aktuellen. Die Konvertierung
ist nur annähernd genau, da die beiden Tracker unterschiedlich funktionieren.
- Die Reihenfolgelisten für jede Stimme (mit Transponierung und Wiederholung)
  werden zu einem dreistimmigen Lied zusammengefasst und in 32-zeilige Muster
  unterteilt; identische Muster werden geteilt.
- Instrumente: AD/SR, erste Welle, Gate-Timer und Hard Restart werden
  übernommen; die Wavetable wird zur Wave-/Arpeggio-Tabelle, die Pulstabelle zur
  PWM, die Filtertabelle zum Filtermodus, Resonanz- und Cutoff-Sweep und die
  Geschwindigkeitstabelle zum Instrumenten-Vibrato.
- Pattern-Befehle: Key Off → Note-Off, Portamento → `U` / `D` (maximal 255 pro
  Zeile), Tempo → `F`; Toneporta wird zu einer einfachen Note. Andere Befehle
  werden verworfen, und eine Meldung listet auf, was approximiert oder
  übersprungen wurde.
- Ein vom Wavetable freigegebenes Gate wird in der nächsten freien Zeile zu
  einem Note-Off. Nur die erste Subtune wird importiert, und die
  Exportbeschränkung von 7 Patterns gilt weiterhin.

**ZP-Nutzung des Spielers: ** `$02`–`$1C` (Pattern-Zeiger, Pattern-Offset, temp)
und `$2F` (aktuelle Geschwindigkeit) sowie `$FB`–`$FD` (Tick-Zähler,
Zeilenindex, Position in der Orderliste). Stimme, Modulations- und Filterstatus
befinden sich nach den Daten in `sid_state`. Die ZP-Bytes können in Konflikt
geraten, wenn Ihr Hauptcode sie verwendet – verschieben Sie sie gegebenenfalls
im Expertenmodus.

**Bekannte Grenzwerte:**
- Ein 8-Bit-Zeilenzähler begrenzt jedes Muster auf 7 Muster × 32 Zeilen im
  Rohdatenspeicher (die Song-/Reihenfolgeliste kann durch Wiederholung von
  Mustern beliebig lang sein).
- C64 `$D418` Die globale Lautstärke wird über alle Stimmen hinweg geteilt – der
  Lautstärkeregler pro Instrument dient nur der Information; der Sustain-Pegel
  (`S` von ADSR) ist die effektive Lautstärke pro Stimme.
- Während **Play: All** die eigentliche Melodie lädt (auch im Pausenmodus),
  greifen die Notenvorschauen auf den kleinen Synthesizer zurück, der den
  SID-Chip nur annähernd simuliert. Die Vorschauen erreichen WebSID etwa 0,1
  Sekunden vor dem eigentlichen Ton.

---

### SID Player

Über die Symbolleistenschaltfläche **SID Player** wird ein schwebendes Fenster
geöffnet, das `.sid`-Musikdateien (PSID und RSID) abspielt, beispielsweise Titel
aus der HVSC-Sammlung.

- **Playlist:** Füge Titel mit **.sid-Dateien hinzufügen…** oder durch Ziehen in
  das Fenster hinzu und klicke auf einen Titel, um ihn abzuspielen;
  **Entfernen** und **Playlist leeren** räumen die Liste auf. **Playlist
  speichern…** / **Playlist öffnen…** Schreibe und lese eine `.sidpl`-Datei mit
  den eingebetteten Titeln. Die Liste, der aktuelle Titel und ob das Fenster
  geöffnet ist, werden gespeichert.
- **Transport:** Wiedergabe, Pause, Stopp, **Vorheriger** / **Nächster** Titel,
  **Vorheriger / Nächster Unterton** für Dateien mit mehreren Titeln und ein
  Zeitzähler.
- **Suchen:** Die Positionsleiste und **Zurück/Vorwärts 10 s** funktionieren mit
  der VA SID Core-Engine. WebSID unterstützt keine Suchfunktion, daher sind
  diese Steuerelemente deaktiviert.
- **Lautstärke:** Der Regler wird mit der Master-Lautstärke des SID-Editors
  geteilt.
- **Engine:** Das Fenster zeigt die aktuell abspielende Engine an (WebSID oder
  VA SID Core mit Versionsnummer und SID-Chip). Die Auswahl erfolgt unter
  **Einstellungen → SID-Vorschau**. VA SID Core spielt die Melodie auf einem
  nativen Rust C64-Kern mit einem taktgenauen 6510, präzisem Interrupt-Timing,
  CIA 6526A, VIC-II-Timing mit fehlerhaften Zeilen, Sprite-DMA und
  Raster-Interrupts sowie dem 6510-I/O-Port ab – Raster-IRQ-, CIA-getaktete und
  Digi-Melodien werden also mit dem Timing einer realen Maschine wiedergegeben.
- **Zufallswiedergabe:** Die Zufallswiedergabe-Taste neben **Nächster** spielt
  die Playlist in zufälliger Reihenfolge ab – kein Titel wird wiederholt, bis
  alle Titel abgespielt wurden. **Vorheriger** springt innerhalb der zufälligen
  Reihenfolge zurück. Die Einstellung wird gespeichert.
- **Favoriten:** Die ☆ / ★ in jeder Zeile markieren einen Titel; er wird im
  gespeicherten Zustand und in `.sidpl` Wiedergabelisten beibehalten.

---

### Kurveneditor

Erzeugt sofort einsatzbereite `.byte`-Lookup-Tabellen aus mathematischen Kurven
– Sinus, Easing, Dreieck/Sägezahn/Rechteck und Bounce. Ideal für
Sprite-Bewegungen, Rastereffekte, Farbwechsel oder jede Animation, die auf einer
vorab berechneten Tabelle basiert. Öffnen Sie den Kurveneditor über das Symbol
**Kurveneditor** in der oberen Symbolleiste (neben der Schaltfläche
„SID-Editor“).

**Kurven:** Sinus, Kosinus, Linear, Ease In/Out/InOut (Quad und Cubic), Ease
In/Out (Circ), Dreieck, Sägezahn, Quadrat und Ease In/Out/InOut Bounce.

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

Jede Kopier-/Einfügeausgabe beginnt mit einem Kopfzeilenkommentar, der die
Kurve, den tatsächlichen Min-/Max-Bereich, die Anzahl der Einträge und die
genaue Verwendung dokumentiert (wodurch jeder Tabellenfeed erfasst wird).

**Vorschau:**
- **Graph** – die Kurve, deren Wert oben ** und unten ** 0 beträgt und deren
  Maximum bei **unten ** liegt. Dies entspricht der Sprite-Y-/Raster-Konvention
  des C64 (die angezeigten Werte entsprechen also den Hardware-Ausgaben der
  Tabelle). Eine Metazeile unter dem Graphen zeigt die Byte-Anzahl, die
  tatsächlichen Minimal- und Maximalwerte sowie den/die Kurvennamen an.
- **Hüpfender Ball** – animiert eine Markierung über den Tisch mit dem **Tempo**
  (5–240 Werte/Sek.). Bei Tempo 50 entspricht dies einem Wert pro Frame auf PAL
  (50 Hz), d. h. einem `.wait_raster`-Schritt pro Index. Wiedergabe-/Pause- und
  Neustart-Tasten, ein Ausblendeffekt der letzten ca. 24 Positionen und eine
  Live-Anzeige von `Index · Wert`.

**Kopieren / Einfügen:** Die beiden Symbole der Symbolleiste – **Kopieren** legt
die Tabelle in die Zwischenablage; **In Editor einfügen** fügt die Tabelle (und
den Reader, falls aktiviert) als Blöcke an das aktuelle Programm an. Erneutes
Einfügen** ersetzt** den vorherigen Eintrag im Kurveneditor, anstatt Duplikate
zu stapeln (funktioniert im Block- und Expertenmodus).

**Menü „Dateien“:**
| Aktion                         | Was es tut                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ** Kurve speichern (.bin)…**   | Speichert die Rohdaten der Tabelle exakt so, wie der C64 sie über `INCBIN` lesen würde. 16 Bit: N LO-Bytes, gefolgt von N HI-Bytes.                                                                                                                                                                                                                                                                                                                                    |
| **Lastkurve (.bin)…**          | Lädt die Rohdaten der Tabelle zurück in den Editor, interpretiert gemäß der aktuellen Bittiefe (16 Bit: erste Hälfte niedrig, zweite Hälfte hoch). Die geladene Tabelle wird unverändert angezeigt, bis eine Kurvensteuerung eine neue Kurve generiert.                                                                                                                                                                                                                |
| **Demo in Blöcke exportieren** | Fügt eine vollständige, lauffähige Sprite-Demo hinzu: Sprite-Initialisierung, rastersynchronisierte Hauptschleife, die eingebettete Tabelle und die Daten des Kugel-Sprites. Die X-Achse durchläuft den Bereich von 0 bis 320 in 8,8-Punkt-Festkommadarstellung mit dem MSB `$D010`, während die Tabelle die Sprite-Y-Achse steuert – exakt entsprechend der Editor-Vorschau. Der erneute Export ersetzt den vorherigen Kurveneditor-Einschub.                         |
| **Export nach UltimateBasic**  | Schreibt die Tabelle als initialisiertes Ultimate Basic-Array – `var name = array(N)` (oder `array_word(N)` für 16 Bit), gefolgt von `data name: …` Zeilen – und fügt sie an der Cursorposition des UB-Editors ein (außerhalb des UB-Modus wird sie in die Zwischenablage kopiert). Die Bezeichnung wird zu einem gültigen UB-Namen in Kleinbuchstaben; die Tabelle wird als `name[i]` indiziert. Benötigt Ultimate Basic 1.5.8+ (im Lieferumfang enthalten).          |
| **Export UltimateBasic Demo**  | Erzeugt ein vollständiges, sofort ausführbares UB-Programm: einen Ball-Sprite (`sprdef 0`), die Tabelle und eine rastersynchronisierte Schleife, die pro Frame einen Tabelleneintrag abspielt. 8-Bit-Tabellen steuern den Sprite **Y**, während X den Bereich von 0 bis 320 durchläuft; 16-Bit-Tabellen (0 bis 320) steuern den Sprite **X**, während Y den Bereich von 0 bis 200 durchläuft. Tabellen mit mehr als 256 Einträgen spielen ihre ersten 256 Einträge ab. |

**Entsprechend der Vorschau auf dem C64:** Die Vorschau liest die Tabelle
**linear, in einer Schleife von 0 → N-1 → 0, ein Wert pro Frame**. Um dies exakt
zu reproduzieren, muss die Tabelle auf dieselbe Weise angesteuert werden (Index
einmal pro Frame inkrementieren, Überlauf bei Tabellenlänge). Eine Ping-Pong-
oder Teilbereichswiedergabe verhält sich anders, obwohl die Bytewerte identisch
sind. Ein funktionierendes 16-Bit-Sprite-X-Beispiel finden Sie unter
`samples/curve-new-demo.asm`.

---

### Zahlenkonverter

Ein kleiner **nicht-modaler** DEC/HEX/BIN-Konverter, der über die Schaltfläche
in der Symbolleiste neben dem D64-Editor geöffnet wird (erneut klicken oder Esc
drücken zum Schließen). Die Schaltfläche bleibt hervorgehoben, solange der
Konverter angezeigt wird. Er bleibt geöffnet, während Sie das Programm in einem
beliebigen Modus bearbeiten.

- Geben Sie einen Wert in eines der Felder **DEC**, **HEX** oder **BIN** ein;
  die beiden anderen Felder werden automatisch aktualisiert. Präfixe `$`, `0x`,
  `%`, `0b` und Trennzeichen (Leerzeichen, `_`) sind zulässig. Negative
  Dezimalzahlen werden im aktuellen Format als Zweierkomplement dargestellt.
  Ungültige Eingaben werden rot markiert.
- **8 / 16 Bit** Breite — ein Wert über 255 schaltet automatisch auf 16 Bit um.
- **Bits row** — click a bit to switch it.
- Die Infozeile zeigt den **signed**-Wert und im 16-Bit-Modus das **low**- und
  das **high**-Byte an.
- Die Schaltflächen **Copy** kopieren den Wert mit seinem Präfix (`53280`,
  `$D020`, `%1101000000100000`).
- Ziehen Sie es an der Kopfzeile; es merkt sich seinen Wert, seine Breite und
  seine Position und öffnet sich nach einem Neustart wieder, wenn es beim
  Beenden geöffnet war.

---


*© 2026 Zsolt Tarczali — C64 Visual Assembler*
