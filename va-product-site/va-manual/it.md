# C64 Visual Assembler — Manuale utente

**Versione 2.6.1**

Un assembler visuale a blocchi per il Commodore 64, basato sul processore 6502.
Crea programmi trascinando e rilasciando blocchi di istruzioni e visualizza in
tempo reale il codice assembly e il codice macchina generati.

---

## Sommario

- [C64 Visual Assembler — Manuale utente](#c64-visual-assembler--user-manual)
    - [Punti salienti della versione 2.6.1](#version-261-highlights)
    - [Punti salienti della versione 2.6.0](#version-260-highlights)
    - [Punti salienti della versione 2.5.9](#version-259-highlights)
    - [Punti salienti della versione 2.5.8](#version-258-highlights)
    - [Punti salienti della versione 2.5.7](#version-257-highlights)
    - [Punti salienti della versione 2.5.6](#version-256-highlights)
    - [Punti salienti della versione 2.5.5](#version-255-highlights)
    - [Punti salienti della versione 2.5.4](#version-254-highlights)
    - [Punti salienti della versione 2.5.3](#version-253-highlights)
    - [Punti salienti della versione 2.5.2](#version-252-highlights)
    - [Punti salienti della versione 2.5.1](#version-251-highlights)
    - [Punti salienti della versione 2.5.0](#version-250-highlights)
    - [Punti salienti della versione 2.4.9](#version-249-highlights)
    - [Punti salienti della versione 2.4.8](#version-248-highlights)
    - [Punti salienti della versione 2.4.7](#version-247-highlights)
    - [Punti salienti della versione 2.4.6](#version-246-highlights)
    - [Punti salienti della versione 2.4.5](#version-245-highlights)
    - [Punti salienti della versione 2.4.3](#version-243-highlights)
    - [Punti salienti della versione 2.4.2](#version-242-highlights)
    - [Punti salienti della versione 2.4.1](#version-241-highlights)
    - [Punti salienti della versione 2.4.0](#version-240-highlights)
    - [Punti salienti della versione 2.3.9](#version-239-highlights)
  - [Indice](#table-of-contents)
  - [1. Panoramica dell'interfaccia](#1-interface-overview)
  - [2. Tavolozza a blocchi](#2-block-palette)
  - [3. Area del programma](#3-program-area)
    - [Input operando](#operand-input)
  - [4. Vista ASM](#4-asm-view)
    - [Modalità di uscita](#output-modes)
    - [Scheda Strumenti](#toolkit-tab)
    - [Scheda Opzioni](#options-tab)
    - [Cliccando su una riga ASM](#clicking-an-asm-line)
    - [Numeri di riga ASSM](#asm-line-numbers)
    - [Modulo di avanzamento della compilazione](#compile-progress-modal)
  - [5. Impostazioni e barra degli strumenti](#5-settings--toolbar)
    - [Controllo versione](#version-control)
    - [Libero e open source](#free-and-open-source)
    - [Segnalazione di un bug](#reporting-a-bug)
    - [Finestra di memoria e utilizzo zero della
      pagina](#memory-window-and-zero-page-usage)
    - [Modelli di progetto](#project-templates)
    - [Progetto di costruzione](#build-project)
    - [Esempi di programmi](#example-programs)
    - [Carica il file .asm (riferimento rapido)](#load-asm-file-quick-reference)
      - [Note e best practice sull'analisi
        dell'importazione](#import-parsing-notes-and-best-practices)
  - [Modalità UltimateBasic](#ultimatebasic-mode)
    - [Apertura dell'editor UB](#opening-the-ub-editor)
    - [Strumenti dell'editor](#editor-tools)
    - [Progetti, schede e file di avvio](#projects-tabs-and-startup-files)
    - [Edificio e diagnostica](#building-and-diagnostics)
    - [Dimensione del codice per riga e
      suggerimenti](#code-size-per-line-and-hints)
    - [Running, D64, ed Exomizer](#running-d64-and-exomizer)
    - [Simboli di debug e disassemblaggio](#debugger-symbols-and-disassembly)
    - [Manuale e fonte di Ultimate Basic](#ultimate-basic-manual-and-source)
  - [6. Modalità esperto](#6-expert-mode)
    - [Cambio modalità](#switching-modes)
    - [Layout dell'editor](#editor-layout)
    - [Pulsanti della barra degli strumenti](#toolbar-buttons)
    - [Conteggio cicli](#cycle-counts)
    - [Suggerimenti per l'ottimizzazione](#optimisation-hints)
    - [Evidenziazione degli errori](#error-highlighting)
    - [Evidenziazione della sintassi](#syntax-highlight)
    - [Formattatore sorgente](#source-formatter)
    - [Pannello e schede del progetto](#project-panel--tabs)
    - [Barra delle schede](#tab-bar)
  - [7. Modalità di indirizzamento](#7-addressing-modes)
    - [Etichetta le espressioni come operandi](#label-expressions-as-operands)
    - [Il contatore di programma `*` nelle
      espressioni](#the--program-counter-in-expressions)
    - [Etichette locali (tratteggiate)](#local-dotted-labels)
    - [Etichette degli operandi del codice
      automodificante](#self-modifying-code-operand-labels)
  - [8. Istruzioni standard 6502](#8-standard-6502-instructions)
    - [Movimento dati](#data-movement)
    - [Aritmetica](#arithmetic)
    - [Logica](#logic)
    - [Salti e ramificazioni](#jumps--branches)
    - [LBNE / LBEQ / … (Rami lunghi)](#lbne--lbeq---long-branches)
    - [Operazioni di registro](#register-operations)
    - [Shift & Rotate](#shift--rotate)
    - [Stack](#stack)
    - [Sistema / Flag](#system--flags)
    - [Istruzioni illegali/non documentate](#illegal--undocumented-instructions)
  - [9. Blocchi macro — Riferimento](#9-macro-blocks--reference)
    - [ETICHETTA](#label)
    - [COMMENTO](#comment)
    - [BYTE](#byte)
    - [PAROLA](#word)
    - [RIEMPIMENTO](#fill)
    - [ALIGN](#align)
    - [TESTO 1}
    - [STRING](#string)
    - [DATI](#data)
    - [RAWBYTES](#rawbytes)
    - [TESTO NON ROTTO](#rawtext)
    - [PETSCII](#petscii)
    - [CHARSET](#charset)
    - [CHARDEF](#chardef)
    - [BOX_HIT](#box_hit)
    - [INCBIN](#incbin)
    - [KOALA](#koala)
    - [LIVELLO / LIVELLO_RIGA](#level--level_row)
      - [LIVELLO](#level)
      - [LIVELLO_RIGA](#level_row)
    - [SID](#sid)
    - [INCLUDE](#include)
    - [TABELLA](#table)
    - [ORG](#org)
    - [CICLO / SUCCESSIVO](#loop--next)
      - [LOOP](#loop)
      - [SUCCESSIVO](#next)
    - [PER / FINE](#for--endf)
      - [PER](#for)
      - [ENDF](#endf)
    - [SPINGERE / TIRARE](#push--pull)
      - [SPINGI](#push)
      - [TIRA](#pull)
    - [END / alias RTS](#end--rts-alias)
    - [MACRO / ENDM / INVOKE](#macro--endm--invoke)
      - [MACRO (inizio definizione)](#macro-definition-start)
      - [ENDM (fine della definizione)](#endm-definition-end)
      - [INVOCA](#invoke)
    - [REGIONE / ENDREGIONE](#region--endregion)
    - [DEFINE / IF / ELSE / ENDIF](#define--if--else--endif)
    - [.ASSERT](#assert)
      - [DEFINIZIONE](#define)
      - [SE](#if)
      - [ALTRIMENTI](#else)
    - [ENDIF](#endif)
    - [COSTANTE](#const)
    - [VAR](#var)
    - [Runtime IF / ELSE / ENDIF](#runtime-if--else--endif)
    - [FINO A / FINE](#while--endw)
    - [RIPETI / FINO A](#repeat--until)
    - [MEMCPY / MEMSET](#memcpy--memset)
    - [PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY /
      SET_BORDER /
      SET_BG](#print--print_char--print_hex--clear_screen--wait_key--delay--set_border--set_bg)
    - [IRQ_SETUP](#irq_setup)
    - [RAND](#rand)
    - [SPRITE_INIT](#sprite_init)
    - [SPRITE_POS](#sprite_pos)
    - [WAIT_RASTER](#wait_raster)
    - [JOYSTICK](#joystick)
    - [MOUSE](#mouse)
    - [SPRITE\_COL](#sprite_col)
    - [LOADFILE](#loadfile)
    - [ESODECRUNCH](#exodecrunch)
    - [REU_CHECK](#reu_check)
    - [REU_STASH / REU_FETCH / REU_SWAP](#reu_stash--reu_fetch--reu_swap)
    - [TURBO_SET](#turbo_set)
    - [SUPERCPU_DETECT](#supercpu_detect)
    - [TURBO_ABILITA](#turbo_enable)
    - [MAP\_COPY](#map_copy)
    - [MAP\_COPY16X16](#map_copy16x16)
    - [SPRITE\_ANIM](#sprite_anim)
    - [SCORE_BCD](#score_bcd)
  - [10. Integrazione del debugger](#10-debugger-integration)
    - [RetroDebugger](#retrodebugger)
    - [Blocchi di interruzione](#breakpoint-blocks)
    - [Flag di debug (scheda Opzioni)](#debugger-flags-options-tab)
    - [VICE Monitor (hot reload, live watch,
      profiler)](#vice-monitor-hot-reload-live-watch-profiler)
  - [11. Collegamenti alla base di conoscenza](#11-knowledge-base-links)
  - [12. Esportazione ed esecuzione D64](#12-d64-export--run)
    - [Pulsante Split Run](#split-run-button)
    - [Finestra di dialogo Esporta in D64](#export-to-d64-dialog)
    - [Metadati D64 nei progetti](#d64-metadata-in-projects)
  - [12b. Esportazione CRT (cartuccia Magic Desk
    64K)](#12b-crt-export-magic-desk-64k-cartridge)
  - [13. Impostazioni hardware](#13-hardware-settings)
    - [Emulatore VICE](#vice-emulator)
    - [Esoizer](#exomizer)
    - [Retro Debugger](#retro-debugger)
    - [C64 Ultimate / 1541 Ultimate](#c64-ultimate--1541-ultimate)
    - [Kung Fu Flash 2](#kung-fu-flash-2)
  - [14. Editor visivi (Toolkit)](#14-visual-editors-toolkit)
    - [Editor ad alta risoluzione / multicolore](#hi-res--multicolor-editor)
    - [Editor di sprite](#sprite-editor)
    - [C64 Character ROM Browser (“Char
      map”)](#c64-character-rom-browser-char-map)
    - [Editor di caratteri (Charset)](#character-editor-charset)
    - [Editor di tela Charset](#charset-canvas-editor)
    - [Editor di mappe (mappe a tessere
      multilivello)](#map-editor-multilayer-tilemaps)
    - [Editor di livelli](#level-editor)
    - [Editor SID (Tracker a 3 voci)](#sid-editor-3-voice-tracker)
    - [SID Player](#sid-player)
    - [Editor di curve](#curve-editor)
    - [Generatore di tabelle](#table-generator)
    - [Convertitore di numeri](#number-converter)

---

## Novità principali della versione 2.6.1

- **Conteggio dei cicli in modalità esperto** — una barra laterale mostra i
  cicli di ogni istruzione, il totale della selezione e quante linee raster
  occupa. Vedi [Conteggio dei cicli](#cycle-counts).
- **Suggerimenti per l'ottimizzazione** — l'editor esperto contrassegna le righe
  che possono essere più brevi o più veloci (chiamata in coda, `CMP #0`
  ridondante, ricaricamenti, `INC` / `DEC` idiomi…). Vedi [Suggerimenti per
  l'ottimizzazione](#optimisation-hints).
- **Generatore di tabelle** — indirizzi di riga dello schermo/bitmap, maschere
  di pixel, tabelle di moltiplicazione/divisione, quarti di quadrato,
  logaritmo/esponenziale, inversione di bit, espressioni personalizzate e
  speedcode di riempimento/copia non srotolato. Vedi [Generatore di
  tabelle](#table-generator).
- **VICE Monitor** — ricaricamento a caldo nel VICE in esecuzione, monitoraggio
  in tempo reale di etichette e indirizzi e un profiler di campionamento PC.
  Vedi [VICE Monitor](#vice-monitor-hot-reload-live-watch-profiler).
- **Mappa di utilizzo della pagina zero** e una **finestra di memoria
  staccabile**. Vedere [Finestra di memoria e utilizzo della pagina
  zero](#memory-window-and-zero-page-usage).
- **Ultimate Basic** — dimensione del codice per riga, suggerimenti e editor di
  sprite → Esportazione Ultimate Basic con animazione.
- **Editor SID → esportazione .sid (PSID)** e un modello di progetto per
  multiplexer di sprite** (16 sprite).
- È possibile tenere aperte contemporaneamente diverse finestre flottanti;
  quella su cui si fa clic viene portata in primo piano.

---

## Punti salienti della versione 2.6.0

- **Visual Assembler è ora completamente gratuito** — la licenza
  Freemium/Professional è stata rimossa. Ogni editor, opzione di compilazione e
  di esecuzione hardware, tutte e 7 le lingue dell'interfaccia utente e ogni
  tema funzionano per tutti, senza registrazione o numero di serie. Il motivo è
  semplice: secondo le norme fiscali ungheresi, vendere il programma lascerebbe
  troppo poco dopo tasse e pratiche burocratiche per essere conveniente. I
  numeri di serie che già possedete non sono più necessari. Vedi [Gratuito e
  open source](#free-and-open-source).

---

## Punti salienti della versione 2.5.9

- **Tema Commodore 64** — la schermata di accensione del C64: un bordo azzurro
  attorno ai pannelli blu, testo azzurro, pulsanti per la riproduzione video
  inversa, colori della sintassi dalla tavolozza del C64 e il font del C64 nella
  vista monitor.
- **Tema Commodore Beige** — il classico cestino del pane: case beige, tasti
  funzione color senape, strisce del badge arcobaleno e visualizzazione del
  monitor blu C64. Selezionalo nel selettore temi o passa a esso con il pulsante
  temi. Vedi [Impostazioni e barra degli strumenti](#5-settings--toolbar).
- **Tema Commodore Starlight** — un tema chiaro ispirato al traslucido
  contenitore del C64: vetro trasparente satinato con bagliore RGB arcobaleno
  che traspare, un accento magenta, colori della sintassi arcobaleno e una
  visualizzazione del monitor scura e fumé.
- **Finestra di dialogo Controllo versione** — la finestra di dialogo può essere
  trascinata dall'intestazione e si riapre nel punto in cui è stata lasciata;
  rimane sullo schermo quando il registro o una differenza la rendono più alta e
  un clic all'esterno non la chiude più (Esc lo fa). Vedi [Controllo
  versione](#version-control).
- **Controllo versione a livello di progetto** — per una scheda di un progetto
  `.proj` aperto, un'opzione **File / Progetto** esegue il commit di ogni file
  sorgente del progetto (albero del progetto + file inclusi) in una singola
  voce. Il registro elenca i file modificati di ogni commit, Diff funziona file
  per file, Checkout ripristina tutti i file nelle schede dell'editor e vengono
  create voci di salvataggio automatico anche per progetto. In modalità Git, il
  registro e diff coprono l'intero repository. Vedi [Modalità
  progetto](#project-mode).

---

## Punti salienti della versione 2.5.8

- **Controllo versione** — gli snapshot del progetto sono diventati un controllo
  versione simile a git: commit con un messaggio e un hash breve, un registro
  con **HEAD**, un **Diff** rispetto alla copia di lavoro, **Checkout**
  nell'editor e voci di salvataggio automatico separate. I programmi in modalità
  blocco (JSON) vengono confrontati come linee di assemblaggio, quindi il diff
  mostra le modifiche reali. Funziona nelle schede Blocco, Esperto e Base
  definitiva. Vedi [Controllo versione](#version-control).
- **Integrazione Git** — scegli `git.exe` in **Impostazioni → Controllo
  versione** (oppure lascia che l'app lo trovi). Quando il progetto si trova
  all'interno di un repository Git, la finestra di dialogo mostra il ramo, i
  file modificati, il commit (salva prima), il log, il diff con una **vista
  RAW**, il checkout, **Pull** / **Push** e **git init**.
- **Segnala un bug** — un modulo di segnalazione integrato con fino a 4
  screenshot (file, Ctrl+V o trascinamento), e-mail facoltativa, informazioni di
  sistema ed errori recenti dell'app. Vedi [Segnalazione di un
  bug](#reporting-a-bug).
- **SID Player** — **Riproduzione casuale** e **preferiti** (★) per brano. Vedi
  [SID Player](#sid-player).

---

## Punti salienti della versione 2.5.7

- **VA SID Core 1.2** — il SID Player ora utilizza un core nativo Rust C64: un
  6510 a ciclo esatto con temporizzazione precisa degli interrupt, il CIA 6526A,
  temporizzazione VIC-II con linee errate, DMA sprite e interrupt raster e la
  porta I/O del 6510. Vedi [SID Player](#sid-player).
- **Editor ad alta risoluzione** — due colori in ogni cella 8×8: il nuovo
  strumento **Carta per celle**. Vedi [Editor ad alta
  risoluzione/multicolore](#hi-res--multicolor-editor).
- **ROM esatta del personaggio** nel visualizzatore ROM, nell'editor dei
  personaggi **Carica ROM** e negli editor di mappe/livelli.
- **Editor di sprite** — sovrapposizione ad alta risoluzione, riempimento a
  inondazione, selezione/spostamento, rotazione, specchia tutto, importazione di
  fogli di sprite, hitbox, anteprima X/Y ×2. Vedi [Editor di
  sprite](#sprite-editor).
- **Editor di livelli** — oggetti, attributi dei personaggi, controllo dei
  bordi, colori per schermata, indicatore di memoria con RLE, esegui in VICE.
  Vedi [Editor di livelli](#level-editor).
- **Editor di caratteri** — annulla/ripristina, strumenti di disegno, ruota di
  90°, copia/incolla e trascina per scambiare sulla mappa, tessere 2×2, set ROM
  minuscolo, anteprima del testo ed esportazione dell'intervallo. Vedi [Editor
  di caratteri](#character-editor-charset).
- **Charset Canvas** — zoom 2×–24× (cursore o Ctrl+rotella) con griglia di
  pixel, colore di sfondo in modalità ad alta risoluzione, caratteri ad alta
  risoluzione all'interno della modalità multicolore e **ECM** (uno sfondo per
  ogni carattere). Vedi [Editor Charset Canvas](#charset-canvas-editor).

---

## Punti salienti della versione 2.5.6

- **SID Player** — un nuovo pulsante della barra degli strumenti apre un lettore
  mobile per i brani `.sid` (PSID / RSID): una playlist con trascinamento, brano
  precedente/successivo, sottobrani, ricerca e ±10 s, volume e
  salvataggio/apertura della playlist (`.sidpl`); l'elenco e lo stato della
  finestra vengono memorizzati. Vedi [SID Player](#sid-player).
- **VA SID Core 1.1** — un'emulazione SID integrata (MOS 6581 / 8580, con un
  filtro 6581 basato su MOS 6581/8580) e un lettore PSID / RSID a ciclo bloccato
  (CPU 6510, temporizzazione CIA / VIC). Selezionalo in **Impostazioni →
  Anteprima SID**; il lettore SID mostra quale motore è in esecuzione.
- **Editor SID** — manopole per i parametri dello strumento, un grafico ADSR più
  ampio, **ingresso MIDI**, **registrazione** nel tracker (viene aggiunto un
  nuovo pattern quando quello corrente è pieno), un **metronomo** con spie di
  battito, **eliminazione pattern**, il volume master su VA-VK e **Importa
  GoatTracker .sng**. Vedi [Editor SID](#sid-editor-3-voice-tracker).
- **Ultimate Basic 1.6.4** incluso.

---

## Punti salienti della versione 2.5.5

- **Editor ad alta risoluzione: griglia di pixel e zoom 16×** — con **Griglia**
  attiva, dallo zoom 4× ogni pixel ottiene la propria linea di griglia, più
  marcata sui bordi delle celle dei caratteri e ombreggiata per rimanere
  visibile su tutti i 16 colori. Il cursore dello zoom ora arriva fino a 16×.
  Vedi [Editor ad alta risoluzione / multicolore](#hi-res--multicolor-editor).
- **Fare clic con il pulsante destro del mouse sul menu Copia/Incolla** — sulla
  tela degli editor Hi-Res e Mappa (Copia, Incolla, Incolla trasparente) e
  nell'Editor Sprite (Copia frame, Incolla frame, anche sulla striscia frame).
  L'incolla è stato avviato dalle anteprime del menu in cui si è fatto clic.
- **Convertitore numerico** — il relativo pulsante nella barra degli strumenti
  rimane evidenziato mentre il convertitore è visualizzato.
- **Corretto** — la griglia di celle multicolore dell'Editor ad alta risoluzione
  era larga il doppio di una cella di carattere; il pulsante **Incolla** della
  barra degli strumenti ad alta risoluzione incollava sempre in modo
  trasparente; il menu contestuale dell'Editor SID si apriva lontano dal cursore
  mentre la finestra di dialogo era centrata.
- **In questo manuale** vengono ora descritte le funzioni di selezione,
  copia/incolla e incolla trasparente dell'Editor ad alta risoluzione.

---

## Punti salienti della versione 2.5.4

- **Risolto: la finestra non veniva visualizzata al riavvio** — se l'app veniva
  chiusa con la finestra ridotta a icona o nascosta (principalmente su macOS, ma
  anche su Linux/Wayland), al successivo avvio poteva comparire senza la
  finestra. Lo stato di visibilità non viene più salvato (le dimensioni della
  finestra rimangono), e la finestra viene sempre mostrata all'avvio.
- **Ultimate Basic 1.6.3 incluso** — Sintassi in stile QBasic: `dim nome come
  tipo` per variabili e per array di ogni tipo, `funzione` / `sub` con `come`
  tipi, `elseif`, `do … loop`, `while … wend`, `select case`, `exit do` / `exit
  sub`, riga singola `if`, `'` commenti e `print a; b; c`; stringhe di runtime
  (`+`, `left$` / `right$` / `mid$`) e `intero` a 16 bit con segno. Evidenziato,
  completato e formattato nell'editor UB, con nuove voci **DIM**, **FUNCTION**,
  **ELSEIF**, **DO**, **WEND**, **SELECT CASE**, **END**, **EXIT SUB** e
  **LEFT$** / **RIGHT$** / **MID$** nel pannello Comandi. Vedi [UltimateBasic
  Mode](#ultimatebasic-mode).

---

## Punti salienti della versione 2.5.2

- **Anteprime dell'editor SID sul SID reale**: anteprima dello strumento,
  tastiera virtuale, immissione di note, accordi/arpeggi, riproduzione di righe
  e pattern singoli tramite WebSid; il sintetizzatore rimane solo come soluzione
  di ripiego. Vedi [Editor SID]{1}.

---

## Punti salienti della versione 2.5.1

- **Strumenti dell'editor SID** — routing del filtro per voce, **3 OFF** e un
  cutoff risonante **sweep** (inizio, fine, velocità, ping-pong); **vibrato
  dello strumento** (ritardo, velocità, profondità); **modulazione di larghezza
  di impulso**; **timer gate**, **hard restart** e forma d'onda del primo frame;
  una **tabella di onde/arpeggi** con preset; **RING** e **SYNC**. Vedi [Editor
  SID](#sid-editor-3-voice-tracker).
- **Nuovo lettore SID** — il lettore esportato esegue la modulazione dello
  strumento ad ogni frame (`JSR sid_frame` per il tuo IRQ); l'anteprima
  renderizza lo stesso lettore attraverso un piccolo sintetizzatore SID. `.bin`
  salva mantenendo i nomi degli strumenti e la velocità.
- **Tastiera virtuale** — 2, 3 o 4 ottave con l'aspetto di un sintetizzatore
  Commodore 64.
- **Ultimate Basic 1.6.2 incluso** — `tune` ottiene `imod`, `ifilt`, `igate` e
  `itab`; **Esporta in UltimateBasic** li scrive.
- **Segnalibri e Vai alla riga** negli editor Expert e Ultimate Basic — Ctrl+F2
  / F2 / Maiusc+F2, Ctrl+G.
- **Risolto:** le espressioni di etichetta (`.assert`, `LEVEL_MULTICOLOR*16`,
  `*`) funzionano di nuovo nell'app installata (nessun `eval` sotto il CSP di
  rilascio).

---

## Punti salienti della versione 2.5.0

- **Editor di livelli** — un nuovo editor della barra degli strumenti che
  dispone le schermate dell'Editor di mappe verticalmente, orizzontalmente o in
  una griglia 2D e visualizza in anteprima l'intero livello con scorrimento
  fluido. Vedi [Editor di livelli](#sid-editor-3-voice-tracker).
- **Macro LEVEL / LEVEL_ROW** — `.level "level.bin"[, $addr]` posiziona solo le
  schermate posizionate di un progetto di Editor di livelli più tabelle
  puntatori e definisce etichette e costanti `LEVEL_*`; `.level_row dst, col[,
  color]` copia una riga di livello di 40 caratteri in un buffer. Vedi [LEVEL /
  LEVEL_ROW]{1}.
- **Modalità variabile JOYSTICK** — `.Porta joystick, vx, vy[, fuoco]` scrive la
  direzione nelle variabili (−1 / 0 / +1) invece di muovere uno sprite; la porta
  `3` legge entrambe le porte joystick. Vedi [JOYSTICK]{1}.
- **Demo di scorrimento del livello** — `samples/level-demo.asm` fa scorrere un
  livello 2×5 pixel per pixel in ogni direzione con il joystick, senza tearing,
  lasciando spazio per sprite e codice di gioco.
- **Convertitore di numeri** — una finestra di dialogo non modale DEC / HEX /
  BIN sulla barra degli strumenti. Vedi [Convertitore di numeri]{1}.
- **Finestra di dialogo Esempi** — **Menu → Esempi…** apre un elenco ricercabile
  e categorizzato dei programmi di esempio integrati. Vedere [Programmi di
  esempio]{1}.
- **Ultimate Basic 1.6.1 incluso** — `map load "level.bin"[, addr]` legge
  direttamente un progetto di Level Editor e il nuovo `map view px, py` scorre
  la mappa in modo fluido e senza strappi in una posizione di pixel (esempio:
  `level_scroll_demo.ub`). Un prodotto di byte all'interno di una somma a 16 bit
  non viene più troncato a 8 bit. Il riferimento ai comandi UB elenca `map view`
  e la sua ricerca mette per prime le corrispondenze del nome del comando.

---

## Punti salienti della versione 2.4.9

- **Modelli di progetto** — **Menu → File → Nuovo progetto da modello…**, oppure
  il nuovo pulsante della barra degli strumenti tra **Menu** e **Tutorial**,
  crea un progetto `.proj` pronto per la compilazione nella propria cartella. La
  finestra di dialogo ha una sezione **Assembler** (programma vuoto, scheletro
  di gioco, bitmap ad alta risoluzione e multicolore) e una sezione
  **UltimateBasic** (programma vuoto, scheletro di gioco, bitmap ad alta
  risoluzione, IRQ raster), con un'anteprima con evidenziazione della sintassi.
  I tuoi modelli `.asm` / `.ub` vengono prelevati dalla cartella dei modelli
  utente. Vedi [Modelli di progetto](#level-editor).
- **Compila il progetto** — **Menu → Compila → Compila il progetto** compila
  ogni file compilabile del progetto aperto (o delle schede aperte) in un `.prg`
  accanto al suo codice sorgente, scrive i file dei simboli di debug dove
  disponibili, salta i moduli di sola inclusione e mostra un report per file.
  Vedi [Compila il progetto](#level--level_row).
- **Ctrl + rotellina del mouse zoom** negli editor Expert e Ultimate Basic
  (`Cmd` + rotellina su macOS; funziona anche il gesto di pizzicare il
  touchpad).
- **Gli spazi di lavoro ricordano i progetti**: gli alberi dei progetti Expert e
  Ultimate Basic, il file di avvio e le modifiche al progetto non salvate
  vengono salvati nello spazio di lavoro `.vaws` e ripristinati con esso. Gli
  spazi di lavoro più vecchi rimangono aperti.
- **Ultimate Basic** — il compilatore incluso genera codice 6502 più veloce e
  più piccolo; la mappa della memoria ora distingue il codice e i dati reali dal
  padding e dai lunghi `org` gap.
- **Le finestre di dialogo dei file si aprono nella cartella di lavoro attiva**
  — quella a blocchi/esperto o quella base definitiva, a seconda della modalità
  corrente.
- **Ultimate Basic 1.6.1 incluso** — `map load "level.bin"[, addr]` legge
  direttamente un progetto di Level Editor e il nuovo `map view px, py` scorre
  la mappa in modo fluido e senza strappi in una posizione di pixel (esempio:
  `level_scroll_demo.ub`). Un prodotto di byte all'interno di una somma a 16 bit
  non viene più troncato a 8 bit. Il riferimento ai comandi UB elenca `map view`
  e la sua ricerca mette per prime le corrispondenze del nome del comando.

---

## Punti salienti della versione 2.4.8

- **Nuova macro KOALA** — `.koala "picture.koa"` (opzionalmente `, $2000`)
  carica un'immagine di Koala Painter e la visualizza con una routine di
  visualizzazione da 86 byte. Vedi [KOALA](#project-templates).
- **Importazione/esportazione di Koala nell'editor Hires** — **File → Importa
  Koala (.koa)…** / **Esporta Koala (.koa)…** (file standard da 10003 byte; le
  immagini ad alta risoluzione vengono ridotte a multicolore durante
  l'esportazione). `.koa` / `.kla` sono riconosciuti anche da **Importa immagine
  / .bin**.
- **Ultimate Basic 1.5.9 incluso** — nuovo `chain "FILE" [, dispositivo]`
  (carica un altro programma sopra quello in esecuzione ed eseguilo); `load
  "FILE"` carica all'indirizzo del file stesso, `load "FILE", addr` a `addr`;
  correzioni D64. `chain` è evidenziato ed elencato nel riferimento dei comandi.
- **Stato di aggiornamento nella barra di stato Expert** — lo stesso indicatore
  *Aggiornato* / cliccabile *Aggiornamento disponibile* della modalità Ultimate
  Basic.
- **Le finestre di dialogo di salvataggio** offrono il tipo di file (ad esempio
  *KOA*) invece di *Binario (\*.bin)*.
- **Controllo degli aggiornamenti più robusto** — l'elenco dei programmi di
  installazione è pubblicato su c64va.tech/downloads/VA/, quindi il controllo
  funziona con la nuova pagina di download; l'assistente di aggiornamento di
  Linux non eredita più i percorsi della libreria AppImage.

---

## Punti salienti della versione 2.4.7

- **Aggiornamenti in-app** — **Menu → Verifica aggiornamenti** controlla
  c64va.tech per una versione più recente e, in caso di conferma, scarica il
  programma di installazione per la tua piattaforma con una barra di avanzamento
  e lo installa. Vedi [Aggiornamenti in-app](#koala). La verifica viene eseguita
  anche silenziosamente ad ogni avvio.
- **Stato di aggiornamento nella barra di stato di Ultimate Basic** — mostra
  **Aggiornato (vX)** oppure un **Aggiornamento disponibile: vY** evidenziato
  che apre la finestra di dialogo di aggiornamento quando viene cliccato.
- **Editor di curve → Esporta in UltimateBasic** — **File → Esporta in
  UltimateBasic** scrive la tabella come un array UB inizializzato; **File →
  Esporta demo UltimateBasic** produce una demo di sprite UB pronta per
  l'esecuzione. Vedi [Editor di curve]{1}.
- **Ultimate Basic 1.5.8 incluso** — la nuova forma **`data <array>: v, …`**
  riempie un `array` / `array_word` dichiarato all'avvio del programma (le righe
  successive continuano dove si è interrotta la precedente, gli array di parole
  prendono valori a 16 bit) senza toccare il flusso `read`.
- **Il layout si adatta alla finestra** — i pannelli dell'editor occupano
  esattamente l'altezza rimanente della finestra, quindi l'app non mostra più
  una barra di scorrimento verticale a livello di pagina; il pannello di output
  ASM mantiene una larghezza minima di 440 px; il percorso della cartella di
  lavoro si trova in un piccolo badge sopra il titolo della vista ASM e utilizza
  lo stesso badge nelle barre degli strumenti Expert e Ultimate Basic. Le
  etichette dei pulsanti di dialogo non vanno più a capo.
- **Controllo degli aggiornamenti più robusto** — l'elenco dei programmi di
  installazione è pubblicato su c64va.pro/downloads/VA/, quindi il controllo
  funziona con la nuova pagina di download; l'assistente di aggiornamento per
  Linux non eredita più i percorsi della libreria AppImage.

---

## Punti salienti della versione 2.4.6

- **Aggiornamenti in-app** — **Menu → Verifica aggiornamenti** controlla
  c64va.pro per una versione più recente e, in caso di conferma, scarica il
  programma di installazione per la tua piattaforma con una barra di avanzamento
  e lo installa. Vedi [Aggiornamenti in-app](#in-app-updates). La verifica viene
  eseguita anche silenziosamente ad ogni avvio.
- **Aggiornamento del linguaggio Ultimate Basic** — l'evidenziazione della
  sintassi e il riferimento ai comandi ora coprono **`sfx`** (effetto SID non
  bloccante: `canale sfx, freq, frame [, wave]`), **`org`** (continua il codice
  sub/fn a un indirizzo, lasciando uno spazio riempito di zeri che può contenere
  i dati `incbin`), **`charset on` / `charset off`** (commuta il VIC-II al set
  di caratteri RAM e viceversa) e **`incbin` slicing** (`incbin "font.prg",
  $3C00, 2` salta i primi byte, un quarto argomento opzionale limita la
  lunghezza).
- **Evidenziazione di più blocchi nella vista ASM** — selezionando più blocchi
  vengono evidenziate contemporaneamente tutte le relative linee ASM, la
  posizione di scorrimento rimane stabile durante la selezione e i numeri di
  riga sono più sfumati grazie a una sottile linea di separazione verticale.
- **Modalità Assembler mantenuta tra i passaggi a Ultimate Basic** — l'apertura
  di un progetto o di un esempio integrato mentre Ultimate Basic è attivo ora
  lascia prima UB e ritorna all'ultima modalità Blocco/Esperto, quindi il buffer
  UB non può più sovrascrivere la modalità o il titolo della nuova scheda. Le
  nuove schede vengono create nella modalità corretta.
- **Impostazioni di Kung Fu Flash 2** — un pulsante **Rileva USB** nelle
  Impostazioni hardware esegue nuovamente la scansione della porta seriale della
  cartuccia e i prerequisiti di KFF2 ora indicano il firmware Kung Fu Flash
  richiesto (v2.07+).
- **Riferimento ai comandi base definitivi** — `tune` e `music` mostrano esempi
  completi e commentati (formato cella, effetti, note del lettore, `music play
  N`); `inst`, `order`, `pat` e la melodia `speed` hanno voci proprie; `data`
  mostra la nuova forma dell'array; la sintassi di `load sid` è corretta (`load
  sid "tune.sid", $2000`).

---

## Punti salienti della versione 2.4.5

- **Supporto per Kung Fu Flash 2: esegui i tuoi programmi su un vero Commodore
  64/128.** Una nuova voce **Kung Fu Flash 2** nel menu **Esegui** compila il
  programma e lo carica tramite USB direttamente su un vero C64 (o C128) acceso,
  dotato di una cartuccia Kung Fu Flash 2: nessuna immagine disco, nessuna copia
  su scheda SD, nessun emulatore. Funziona in modalità Blocco, Esperto e Base
  definitiva. La porta seriale USB della cartuccia viene rilevata
  automaticamente (e può essere inserita manualmente); vedi [Kung Fu Flash 2]{1}
  per la configurazione e il flusso di lavoro esatto.
- **Pannelli Programma/ASM ridimensionabili** — un sottile divisore verticale
  tra il pannello Programma e il pannello ASM/Output consente di trascinare il
  bordo a sinistra o a destra (minimo 260 px per pannello). I tasti freccia lo
  spostano, un doppio clic lo ripristina a una divisione 50/50 e la posizione
  viene memorizzata tra una sessione e l'altra. Il divisore è nascosto nelle
  modalità Esperto e Base definitiva e nel layout a pila stretto.
- **Righe macro più pulite nella vista ASM** — i blocchi macro sono ora elencati
  senza il marcatore di commento iniziale (`.print "HELLO"`, `.if A == 1`,
  `.sprite_init …` invece di `; .print …`), e l'evidenziatore di sintassi ASM li
  colora come macro. I normali blocchi COMMENT e i marcatori di regione iniziano
  ancora con `;`.
- **Evidenziazione personalizzata delle macro nell'editor esperto**: il nome
  della macro dopo `.macro`, `.invoke` e `.call` (e chiamate in stile Kick
  `:name(...)`) ha un colore diverso, così come le sostituzioni `{param}`
  all'interno del corpo della macro e i nomi dei parametri nell'intestazione
  `.macro`, in ogni tema.
- **Finestra di dialogo Informazioni aggiornata**: un layout a due colonne più
  ampio con collegamenti raggruppati a progetto, licenza e crediti, e il banner
  Ultimate Basic ora ha uno sfondo trasparente in modo da integrarsi con
  qualsiasi tema.

---

## Punti salienti della versione 2.4.3

- **Editor SID: Elenco brani/ordine** — i pattern sono ora organizzati tramite
  un elenco brani/ordine appropriato sovrapposto al banco di pattern grezzi, in
  modo che un pattern possa ripetersi e il brano possa essere più lungo del
  numero di pattern memorizzati. Aggiungi, rimuovi e riordina i passaggi
  direttamente dall'Editor SID; la riproduzione e il lettore esportato seguono
  entrambi questo elenco invece dell'ordine dei pattern grezzi.
- **Editor SID: colonna Effetti** — ogni cella tracker può ora contenere un
  effetto insieme alla sua nota: **V**ibrato, slide **U**p / **D**own,
  nota-**C**ut e cambio di velocità (**F**). Digitalo direttamente in una cella,
  ad esempio `C-4 01 V24` (nota + strumento + vibrato) o `F06` (solo cambio di
  velocità). Gli effetti vengono eseguiti una volta per riga, in modo da
  corrispondere al lettore esportato, e ora vengono riprodotti correttamente sia
  nell'anteprima Web Audio in-app che nell'esportazione 6502 compilata: un vero
  motore di effetti riproducibile, non solo una struttura di esportazione.
- **Formato di salvataggio SID retrocompatibile** — I salvataggi SID ora
  contengono un indicatore di versione, quindi i salvataggi `.bin` precedenti
  all'esistenza della colonna degli effetti continuano a caricarsi esattamente
  come prima, con gli effetti semplicemente assenti.
- **Editor D64: flusso di lavoro di salvataggio esplicito** — ogni modifica
  (aggiunta/estrazione/rinomina/eliminazione e ora anche modifiche a byte
  dell'Editor a blocchi) avviene su una copia di lavoro privata; nulla tocca il
  tuo file `.d64` reale finché non fai clic su **Salva**, operazione che prima
  crea anche un backup automatico. La chiusura dell'editor o l'apertura di un
  altro disco con modifiche non salvate ora richiede conferma invece di
  eliminarle silenziosamente.
- **Editor D64: Griglia esadecimale dell'editor a blocchi** — la visualizzazione
  dei byte grezzi per il blocco selezionato da 256 byte è ora una griglia
  esadecimale per byte anziché una semplice casella di testo e la relativa
  finestra di dialogo non oscura più il resto dell'app sottostante mentre è
  aperta.
- **Web64 sul sito del prodotto** — una nuova sezione Web64 IDE su
  [c64va.pro](https://www.c64va.pro).
- **Aggiornamento dell'esempio** — l'esempio `macro-con-parametro` ora utilizza
  la forma tra parentesi `.macro setColor(colore)`.

---

## Punti salienti della versione 2.4.2

- **Trascina e rilascia sull'editor D64** — rilascia un file `.prg`/`.bin`
  compilato (dalle esportazioni degli editor SID/sprite/char o da qualsiasi
  altra posizione) direttamente sull'immagine del disco; il pannello Aggiungi si
  apre precompilato. Il rilascio di più file contemporaneamente li mette in coda
  uno dopo l'altro.
- **Genera file di inclusione** — un nuovo pulsante della barra degli strumenti
  scrive un file `.inc` che elenca `.const NOME = $ADDR` per ogni voce sul
  disco, in modo che il programma principale possa fare riferimento alla
  posizione di ciascuna senza dover riscrivere manualmente gli indirizzi.
- **Editor a blocchi (nuovo)** — un interruttore nella barra degli strumenti
  commuta l'Editor D64 all'accesso raw a tracce/settori sotto la directory: una
  mappa a blocchi cliccabile (colorata dalla bitmap libera/utilizzata del BAM,
  con il BAM e la catena di directory contrassegnati separatamente), una
  vista/editor esadecimale per il blocco selezionato da 256 byte e la
  navigazione settore Precedente/Successivo. Legge e scrive direttamente
  l'immagine del disco (`read_bin_file`/`write_bin_file`), indipendentemente da
  `c1541`.
- **Editor D64: flusso di lavoro di salvataggio esplicito** — ogni modifica
  (aggiunta/estrazione/rinomina/eliminazione e ora anche modifiche a byte
  dell'Editor a blocchi) avviene su una copia di lavoro privata; nulla tocca il
  tuo file `.d64` reale finché non fai clic su **Salva**, operazione che prima
  crea anche un backup automatico. La chiusura dell'editor o l'apertura di un
  altro disco con modifiche non salvate ora richiede conferma invece di
  eliminarle silenziosamente.
- **Editor D64: Griglia esadecimale dell'editor a blocchi** — la visualizzazione
  dei byte grezzi per il blocco selezionato da 256 byte è ora una griglia
  esadecimale per byte anziché una semplice casella di testo e la relativa
  finestra di dialogo non oscura più il resto dell'app sottostante mentre è
  aperta.

---

## Punti salienti della versione 2.4.1

- **Lingue dell'interfaccia utente in polacco e italiano** — traduzione completa
  dell'interfaccia (menu, finestre di dialogo, descrizioni mnemoniche,
  riferimento ai comandi di Ultimate Basic) oltre alle lingue ungherese,
  inglese, spagnolo, tedesco e olandese già esistenti.
- **Pulsante della barra degli strumenti Guida in linea** — un nuovo pulsante
  icona dopo Debug apre il sito della documentazione multilingue
  ([c64va.tech/docs.html]{1}) direttamente dall'app.
- **Descrizioni mnemoniche centralizzate:** Le descrizioni mnemoniche per lingua
  sono state spostate nel file di traduzione condiviso insieme al resto delle
  stringhe dell'interfaccia utente. Risolve anche un bug di vecchia data per cui
  le descrizioni in inglese per `PRINT`, `PRINT_HEX`, `CLEAR_SCREEN`,
  `WAIT_KEY`, `SET_BORDER`, `SET_BG`, `IRQ_SETUP` e `RAND` venivano sovrascritte
  silenziosamente da testo spagnolo residuo.

---

## Punti salienti della versione 2.4.0

- **Editor D64** — un browser completo di immagini disco sulla barra degli
  strumenti (dopo l'Editor Curve). Apri un `.d64` esistente, creane uno nuovo
  vuoto o avvia il disco corrente direttamente in VICE, tutto da un menu File ▾
  che corrisponde agli altri editor visivi. Vedi [Editor D64 (sfoglia e modifica
  un'immagine disco esistente)]{1}.
- **Pulsante della barra degli strumenti Guida in linea** — un nuovo pulsante
  icona dopo Debug apre il sito della documentazione multilingue
  ([c64va.pro/docs.html](https://www.c64va.pro/docs.html)) direttamente
  dall'app.
- **Indirizzo di caricamento, indirizzo di decompressione ed Exomizer
  nell'editor D64** — l'aggiunta di un file raw senza intestazione consente di
  impostare un indirizzo di caricamento opzionale, una destinazione di
  decompressione Exomizer e di comprimerlo durante l'importazione, utilizzando
  le stesse modalità di compressione `mem`/`sfx` dei file extra della finestra
  di dialogo Esporta in D64. Un `.prg` che contiene già la propria intestazione
  ignora completamente questi campi.

---

## Punti salienti della versione 2.3.9

- **`*` in qualsiasi espressione** — il simbolo del contatore di programma ora
  funziona all'interno delle espressioni operando, non solo da solo: `BNE *-5`,
  `JMP *+20`, `LDA #&lt;*`, `LDA #&gt;(*+63)`. Un `*` che segue un valore
  (`STRIDE*2`) è ancora una moltiplicazione. Vedi [Modalità di indirizzamento →
  Il contatore di programma `*` nelle
  espressioni](#d64-editor-browse--edit-an-existing-disk-image).
- **Etichette locali (tratteggiate)** — un'etichetta come `.loop` appartiene
  all'ambito dell'etichetta *globale* (non tratteggiata) più vicina precedente,
  quindi `DrawSprite` e `ClearScreen` possono definire ciascuno il proprio
  `.loop` senza conflitti. Vedi [Etichette locali (tratteggiate)]{1}.
- **Pseudo-operazioni a diramazione lunga** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`,
  `LBMI`, `LBPL`, `LBVC`, `LBVS` si assemblano in un salto invertito su un `JMP`
  (sempre 5 byte) in modo che la destinazione possa essere a qualsiasi distanza.
  Nuova categoria di tavolozza **diramazioni lunghe**. Vedi [LBNE / LBEQ / …
  (diramazioni lunghe)]{1}.
- **`.assert` direttiva** — `.assert fine - inizio &lt;= 256` o `.assert * &lt;
  $A000, "messaggio"` viene valutato in fase di assemblaggio e la compilazione
  fallisce (mostrando il valore effettivo) quando l'espressione è falsa. Vedi
  [.ASSERT]{1}.
- **Etichette degli operandi del codice automodificante** — `Il valore LDA:#$00`
  definisce l'etichetta `valore` che punta al byte dell'operando
  dell'istruzione, quindi `il valore STA` lo modifica direttamente. Vedi
  [Etichette degli operandi del codice automodificante]{1}.
- **Errori di diramazione fuori intervallo più intuitivi** — una diramazione che
  si trova al di fuori di −128…+127 ora segnala esattamente di quanto supera
  l'intervallo e suggerisce la diramazione lunga corrispondente `LBxx`.
- **Migliorato:** il badge della barra degli strumenti dell'indicatore di
  modalità del tema chiaro (MODALITÀ BLOCCO / MODALITÀ ESPERTO / …) è più scuro
  e più leggibile e la sua animazione di scintillio è di nuovo visibile.

---

## 1. Panoramica dell'interfaccia

L'applicazione è suddivisa in tre pannelli principali:

- **`*` in qualsiasi espressione** — il simbolo del contatore di programma ora
  funziona all'interno delle espressioni operando, non solo da solo: `BNE *-5`,
  `JMP *+20`, `LDA #&lt;*`, `LDA #&gt;(*+63)`. Un `*` che segue un valore
  (`STRIDE*2`) è ancora una moltiplicazione. Vedi [Modalità di indirizzamento →
  Il contatore di programma `*` nelle
  espressioni](#the--program-counter-in-expressions).
- **Etichette locali (tratteggiate)** — un'etichetta come `.loop` appartiene
  all'ambito dell'etichetta *globale* (non tratteggiata) più vicina precedente,
  quindi `DrawSprite` e `ClearScreen` possono definire ciascuno il proprio
  `.loop` senza conflitti. Vedi [Etichette locali
  (tratteggiate)](#local-dotted-labels).
- **Pseudo-operazioni a diramazione lunga** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`,
  `LBMI`, `LBPL`, `LBVC`, `LBVS` si assemblano in un salto invertito su un `JMP`
  (sempre 5 byte) in modo che la destinazione possa essere a qualsiasi distanza.
  Nuova categoria di tavolozza **diramazioni lunghe**. Vedi [LBNE / LBEQ / …
  (diramazioni lunghe)](#lbne--lbeq---long-branches).
- **`.assert` direttiva** — `.assert fine - inizio &lt;= 256` o `.assert * &lt;
  $A000, "messaggio"` viene valutato in fase di assemblaggio e la compilazione
  fallisce (mostrando il valore effettivo) quando l'espressione è falsa. Vedi
  [.ASSERT](#assert).
- **Etichette degli operandi del codice automodificante** — `Il valore LDA:#$00`
  definisce l'etichetta `valore` che punta al byte dell'operando
  dell'istruzione, quindi `il valore STA` lo modifica direttamente. Vedi
  [Etichette degli operandi del codice
  automodificante](#self-modifying-code-operand-labels).
- **Errori di diramazione fuori intervallo più intuitivi** — una diramazione che
  si trova al di fuori di −128…+127 ora segnala esattamente di quanto supera
  l'intervallo e suggerisce la diramazione lunga corrispondente `LBxx`.

---

## 2. Tavolozza a blocchi

La tavolozza a sinistra elenca tutti i blocchi disponibili, raggruppati per
categoria:

| Pannello                 | Descrizione                                                                       |
| ------------------------ | --------------------------------------------------------------------------------- |
| **Sinistra — Tavolozza** | Tutti i blocchi di istruzioni e macro disponibili. Cerca o sfoglia per categoria. |
| **Centro — Programma**   | Il tuo programma. Trascina i blocchi qui, riordinali, modifica gli operandi.      |
| **Destro — Uscita**      | Visualizzazione ASM in tempo reale e/o output del monitor di memoria.             |

Utilizza la casella di ricerca **** nella parte superiore della tavolozza per
filtrare per nome. Fai clic sul pulsante **Aggiungi blocco selezionato** oppure
trascina un blocco nell'area del programma.

In modalità Blocco, un sottile divisore verticale **** si trova tra i pannelli
Programma e Output. Trascinalo per dare più spazio a uno dei due pannelli
(ognuno mantiene almeno 260 px), usa ← / → per spostarlo di 16 px alla volta
oppure fai doppio clic su di esso per ripristinare la divisione 50/50. La
posizione viene salvata con le impostazioni dell'interfaccia utente. Il divisore
è nascosto nelle modalità Esperto e Base definitiva e quando la finestra è
sufficientemente stretta da permettere ai pannelli di sovrapporsi.

---

## 3. Area del programma

La tavolozza a sinistra elenca tutti i blocchi disponibili, raggruppati per
categoria:

- **Trascina e rilascia** i blocchi dalla tavolozza oppure **riordina** i
  blocchi esistenti trascinando la loro maniglia (≡).
- Ogni blocco mostra il suo **mnemonico**, il **campo operando** e il
  **selettore della modalità di indirizzamento** (ove applicabile).
- Fai clic sul pulsante **▸ / ▾** per comprimere o espandere un blocco.
- Utilizza il pulsante **× (cancella)** su un blocco per rimuoverlo.
- **Comprimi tutto** Il pulsante comprime tutti i blocchi contemporaneamente.
- **Operazioni di registrazione** — TAX, TAY, INX, DEX, …
- **Shift & Rotate** — ASL, LSR, ROL, ROR
- **Stack** — PHA, PHP, PLA, PLP
- **Sistema** — CLC, SEC, NOP, BRK, …
- **Istruzioni illegali** — LAX, SAX, DCP, …
- **Struttura** — ETICHETTA, COMMENTO, REGIONE, ENDREGIONE
- **Macro** — LOOP, NEXT, FOR, ENDF, PUSH, PULL, END, TEXT, BYTE, WORD, FILL,
  ALIGN, ASSERT, STRING, DATA, RAWBYTES, RAWTEXT, PETSCII, CHARSET, INCBIN, SID,
  INCLUDE, TABLE, ORG, MACRO, ENDM, INVOKE, IF, ELSE, ENDIF, VAR, WHILE, ENDW,
  REPEAT, UNTIL, MEMCPY, MEMSET, PRINT, PRINT_CHAR, PRINT_HEX, CLEAR_SCREEN,
  WAIT_KEY, DELAY, SET_BORDER, SET_BG, IRQ_SETUP, RAND, SPRITE_INIT, SPRITE_POS,
  WAIT_RASTER, JOYSTICK, MOUSE, SPRITE_COL, LOADFILE, REU_CHECK, REU_STASH,
  REU_FETCH, REU_SWAP, TURBO_SET, SUPERCPU_DETECT, TURBO_ENABLE, MAP_COPY,
  MAP_COPY16X16, SPRITE_ANIM, SCORE_BCD

Utilizza la casella di ricerca **** nella parte superiore della tavolozza per
filtrare per nome. Fai clic sul pulsante **Aggiungi blocco selezionato** oppure
trascina un blocco nell'area del programma.

---

## 4. Vista ASM

- **Trascina e rilascia** i blocchi dalla tavolozza oppure **riordina** i
  blocchi esistenti trascinando la loro maniglia (≡).
- Ogni blocco mostra il suo **mnemonico**, il **campo operando** e il
  **selettore della modalità di indirizzamento** (ove applicabile).
- Fai clic sul pulsante **▸ / ▾** per comprimere o espandere un blocco.
- Utilizza il pulsante **× (cancella)** su un blocco per rimuoverlo.
- **Comprimi tutto** Il pulsante comprime tutti i blocchi contemporaneamente.

### Modalità di uscita

I blocchi macro appaiono nelle viste ASM ed Both come semplici linee macro senza
un marcatore di commento (`.print "HELLO"`, `.wait_raster $FF`, `.invoke
setColor(blue)`) e sono colorati come macro; solo i veri blocchi COMMENT, i
marcatori di regione e gli avvisi mantengono il loro iniziale `;`.

| Colore della barra  | Descrizione                                                                                                                                                                                                                                                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ciano               | Codice sorgente di assemblaggio 6502 con indirizzi ed etichette                                                                                                                                                                                                                                                              |
| **Monitor**         | Dump esadecimale/byte (stile monitor C64)                                                                                                                                                                                                                                                                                    |
| **Disastro**        | Disassemblaggio puro del 6502: indirizzo · byte esadecimali · mnemonici con operandi numerici risolti. Le macro sono espanse in singole istruzioni (TEXT → coppie LDA/STA, LOOP → LDX, ecc.). I dati BYTE/WORD/FILL sono mostrati come dump esadecimale a blocchi. Nessun nome di macro, commento o annotazione nell'output. |
| **Entrambi**        | ASM in alto, monitor in basso                                                                                                                                                                                                                                                                                                |
| **Disassemblatore** | Come per lo smontaggio: scheda dedicata alla visualizzazione dello smontaggio.                                                                                                                                                                                                                                               |

I blocchi compressi vengono visualizzati con opacità ridotta. Fai clic o
trascina in un punto qualsiasi della minimappa per scorrere l'elenco dei
programmi fino a quella posizione. L'indicatore della finestra di
visualizzazione (rettangolo colorato) tiene traccia della porzione visibile
dell'elenco. Lo stato viene salvato nelle impostazioni dell'interfaccia utente
(tasto `blockMinimap`).

### Scheda Strumenti

- Per le istruzioni di diramazione/salto (`BNE`, `JMP`, `JSR`, ecc.) viene
  visualizzato un menu a tendina **selettore di etichette**: fai clic su
  un'etichetta definita per inserirla.
- Il formato numerico segue l'interruttore **HEX / DEC** nella barra degli
  strumenti (vedere la sezione 5).

---

## 5. Impostazioni e barra degli strumenti

Il pannello di destra mostra l'output generato in tempo reale.

### Istantanee del progetto

| Modalità             | Descrizione                                                                                                                                                                                                                                                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ASM**              | Codice sorgente di assemblaggio 6502 con indirizzi ed etichette                                                                                                                                                                                                                                                              |
| **Monitor**          | Dump esadecimale/byte (stile monitor C64)                                                                                                                                                                                                                                                                                    |
| **Disastro**         | Disassemblaggio puro del 6502: indirizzo · byte esadecimali · mnemonici con operandi numerici risolti. Le macro sono espanse in singole istruzioni (TEXT → coppie LDA/STA, LOOP → LDX, ecc.). I dati BYTE/WORD/FILL sono mostrati come dump esadecimale a blocchi. Nessun nome di macro, commento o annotazione nell'output. |
| **Entrambi**         | ASM in alto, monitor in basso                                                                                                                                                                                                                                                                                                |
| **Disassemblatore**  | Come per lo smontaggio: scheda dedicata alla visualizzazione dello smontaggio.                                                                                                                                                                                                                                               |
| **Kit di strumenti** | Pannello di riferimento C64: tavolozza di 16 colori + foglio riassuntivo con i codici di controllo PETSCII e i caratteri stampabili. Sola lettura: per maggiori dettagli, consultare la sottosezione "Toolkit" qui sotto.                                                                                                    |
| **Opzioni**          | Pannello delle impostazioni del programma: formato numerico, attivazione/disattivazione della sorgente macro, parametri del debugger                                                                                                                                                                                         |

Le istantanee del progetto vengono memorizzate come file JSON sidecar su disco,
non in localStorage. Sono collegate al file di progetto corrente, se presente,
in modo che la cronologia sopravviva ai riavvii e segua il progetto.

### Aggiornamenti in-app

**Menu → Verifica aggiornamenti** cerca la versione più recente su c64va.tech
(legge i link di download per la tua piattaforma) e la confronta con la versione
in esecuzione:

| Sezione     | Che succede                                                                                                                                                                                                                                         |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Windows** | Il programma di installazione viene eseguito in modalità passiva (solo avanzamento) e avvia la nuova versione al termine. L'installazione per singolo computer richiede i diritti di amministratore (UAC).                                          |
| **macOS**   | Il file DMG viene montato e il pacchetto dell'applicazione viene sostituito al suo posto, dopodiché si avvia la nuova versione. Se la cartella dell'applicazione non è scrivibile, è sufficiente aprire il file DMG per trascinarvi l'applicazione. |

Dopo il download, l'app installa l'aggiornamento e si riavvia:

### Spazi di lavoro

Un'area di lavoro **** (file `.vaws`) memorizza quali file reali su disco erano
aperti in ogni scheda, inclusa la modalità di modifica di ciascuna scheda e
quale scheda era attiva, in modo da poter riaprire esattamente quello stesso set
in un secondo momento. È separata da un progetto `.proj`: un'area di lavoro può
comprendere qualsiasi combinazione di file di progetto Block/Expert `.json`,
file `.asm` autonomi e sorgenti Ultimate Basic `.ub` / `.proj` su più schede.

- Gli spazi di lavoro **salvano automaticamente** poche centinaia di
  millisecondi dopo aver apportato una modifica, una volta che uno è stato
  salvato o aperto.
- L'app **ripristina automaticamente l'ultimo spazio di lavoro** all'avvio, in
  modo che le schede aperte riprendano da dove le avevi interrotte.
- Solo le schede supportate da un file reale sul disco vengono salvate nell'area
  di lavoro; una scheda contenente un esempio non salvato o un programma
  presente solo in memoria non ha nulla da rendere persistente e viene ignorata
  (con un avviso se nessuna delle schede aperte soddisfa i requisiti).
  - **`-jmp` ON/OFF** — salta direttamente all'indirizzo di avvio del programma
    dopo il caricamento.
  - **`-unpause` ON/OFF** — riavvia il debugger immediatamente al caricamento.
  - **`-wait` ms ON/OFF** — aggiunge un ritardo `-wait <ms>` prima di
    riprendere; seleziona 500 ms o 1000 ms dal menu a tendina.
- L'apertura di un'area di lavoro chiude prima tutte le schede attualmente
  aperte: ti verrà chiesto di confermare prima di procedere.

### Modelli di progetto

**Menu → File → Nuovo progetto da modello…** — oppure il pulsante della barra
degli strumenti tra **Menu** e **Tutorial** — apre la finestra di dialogo del
modello:

### Progetto di costruzione

**Menu → Compila → Compila progetto** compila un intero progetto in un solo
passaggio. Vengono compilati i file del progetto `.proj` aperto — oppure, senza
un progetto, le schede dei file aperti:

- ogni sorgente compilabile (`.asm`, blocco `.json`, `.ub`) viene compilato in
  un `.prg` **accanto alla sua sorgente** con lo stesso nome; con **Esegui con
  Exomizer** abilitato l'output viene elaborato;
- I file sidecar del debugger (simboli/mappa sorgente) vengono scritti insieme
  al PRG, ove disponibili;

### Esempi di programmi

**Menu → Esempi…** apre il browser degli esempi: i programmi di esempio
integrati sono raggruppati per argomento (Nozioni di base, Macro e flusso di
controllo, Grafica, Sprite e input, File e caricamento, Musica, IRQ e hardware)
in due colonne.

- Digita nella casella di ricerca per filtrare per nome o categoria; il piè di
  pagina mostra quanti esempi corrispondono.
- Fai clic su un esempio per selezionarlo, **↑ / ↓** sposta la selezione;
  **doppio clic**, **Invio** o **Carica** lo carica.
- La finestra di dialogo si apre sull'esempio caricato per ultimo.

La finestra modale si chiude automaticamente al termine dell'azione o in caso di
errore.

---

## Modalità UltimateBasic

| Controllare                                                                                                      | Descrizione                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Base numerica (esadecimale / decimale / binario)**                                                             | Imposta il formato di visualizzazione/input per gli operandi nell'interfaccia utente. La modalità BIN visualizza i valori in formato binario con il prefisso `%` (ad esempio `%11111000`). La vista ASM mostra sempre ciascun blocco nel suo formato.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Lingua**                                                                                                       | Consente di passare dall'interfaccia utente in inglese, ungherese, spagnolo, tedesco e olandese (Nederlands).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Tema**                                                                                                         | Chiaro / Scuro / OLED / Commodore 77 / Commodore Starlight / Commodore Beige / Commodore 64 — seleziona dal selettore temi nel menu Impostazioni. OLED utilizza uno sfondo nero puro per i display AMOLED. Commodore 77 è un tema giallo neon su nero; quando è il tema attivo, il pannello di avvio utilizza il colore del pannello del tema (che corrisponde alla schermata dei messaggi), mostra un logo Commodore 77 dedicato più piccolo e una barra di avanzamento gialla. Commodore Starlight è un tema chiaro ispirato al classico Commodore 64: pannelli in vetro trasparente satinato con bagliore RGB arcobaleno, un accento magenta, colori della sintassi arcobaleno e una visualizzazione del monitor scura e fumé. Commodore Beige è il classico Commodore 64: una scocca beige, tasti funzione color senape, le strisce del badge arcobaleno e una schermata blu C64 per la visualizzazione del monitor. Il tema scelto viene applicato prima della prima visualizzazione al successivo avvio. |
| **Modalità retrò CRT**                                                                                           | Attiva/disattiva un filtro CRT a schermo intero: linee di scansione, vignettatura del fosforo, sfarfallio e distorsione a barilotto. Lo stato viene salvato tra una sessione e l'altra.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Mostra pannello memoria**                                                                                      | Interruttore globale che mostra o nasconde il pannello completo della memoria del C64.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Stub BASIC SYS**                                                                                               | Aggiunge una riga BASIC che richiama SYS all'origine del programma.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Esempi…**                                                                                                      | Apri il browser di esempio e carica un programma di esempio integrato — vedi [Programmi di esempio](#example-programs)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Zoom avanti/indietro**                                                                                         | Ridimensiona l'interfaccia utente del blocco (influisce su tutti gli elementi del blocco)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Salva progetto**                                                                                               | Salva il programma corrente come file di progetto `.json`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Salva programma come**                                                                                         | Salva il programma corrente come file di progetto `.json` utilizzando una nuova finestra di dialogo file ogni volta                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Carica progetto**                                                                                              | Carica un progetto salvato in precedenza                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Salva l'area di lavoro**                                                                                       | Salva l'insieme esatto delle schede attualmente aperte e supportate da file, inclusa la scheda attiva e la modalità di modifica di ciascuna scheda (Blocco/Esperto/Base avanzata), in un file di spazio di lavoro `.vaws`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Salva l'area di lavoro come**                                                                                  | Salva l'area di lavoro corrente utilizzando una nuova finestra di dialogo file ogni volta                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Apri l'area di lavoro**                                                                                        | Chiudi tutte le schede aperte e riapri il set di file memorizzati in un file di spazio di lavoro `.vaws`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Imposta la cartella di lavoro**                                                                                | Scegli la cartella predefinita utilizzata dalle finestre di dialogo di selezione e salvataggio dei file. Il percorso viene memorizzato nella configurazione dell'applicazione e le anteprime dei menu mantengono visibile la parte finale del percorso.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Nuovo progetto da modello…** (`Menu → File` oppure il pulsante della barra degli strumenti accanto a **Menu**) | Crea un nuovo progetto `.proj` da un modello Assembler o UltimateBasic nella sua cartella — vedi [Modelli di progetto](#project-templates)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Apri progetto** (`Menu → File`)                                                                                | Apri un progetto multifile `.proj` e apri tutti i file sorgente come schede                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Salva progetto** (`Menu → File`)                                                                               | Salva il progetto `.proj` corrente (il pannello del progetto deve essere aperto)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Chiudi progetto** (`Menu → File`)                                                                              | Chiudi il progetto attualmente aperto e tutte le relative schede file. Viene richiesto di salvare le modifiche non salvate. Il pannello del progetto viene ripristinato allo stato vuoto.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Carica il file .asm**                                                                                          | Apre un file `.asm` in modalità esperto e importa codice ASM testuale 6502 nella scheda corrente                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Salva PRG**                                                                                                    | Esporta il binario compilato come file `.prg`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Crea CRT**                                                                                                     | Esportare il programma come file Magic Desk da 64 KB (`.crt`, tipo di cartuccia 19). Vedere [Sezione 12b](#12b-crt-export-magic-desk-64k-cartridge).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Compila il progetto** (`Menu → Compila`)                                                                       | Compila ogni file compilabile del progetto (o delle schede aperte) in un `.prg` accanto al suo codice sorgente — vedi [Compila il progetto](#build-project)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Esegui (pulsante diviso)**                                                                                     | Il pulsante principale **▶ Esegui** avvia la modalità corrente; fai clic sulla freccia **▾** per passare tra: **Esegui come PRG** (compila e avvia VICE direttamente), **Esegui tramite D64** (impacchetta in un'immagine disco .d64 e avvia VICE), **Esegui su hardware** (invia il PRG a un dispositivo C64 Ultimate / 1541 Ultimate) o **Kung Fu Flash 2** (carica il PRG tramite USB su un vero C64/C128 con una cartuccia Kung Fu Flash 2). Vedi [Sezione 12](#12-d64-export--run) e [Sezione 13](#13-hardware-settings).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Debug (RetroDebugger)**                                                                                        | Compilare ed eseguire in RetroDebugger con breakpoint, simboli e flag di avvio automatico (vedere [Sezione 9](#9-debugger-integration))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Esegui con Exoizer**                                                                                           | Casella di controllo nel menu Impostazioni: quando abilitata, tutte le operazioni di esecuzione e compilazione elaborano il file PRG tramite `exomizer sfx sys` prima di avviarlo o salvarlo. Funziona con Esegui come PRG, Esegui tramite D64, Esegui su hardware, Compila PRG e Compila D64. Configura prima l'eseguibile di Exomizer in **Impostazioni hardware**.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Salvataggio automatico delle voci**                                                                            | Casella di controllo in **Impostazioni hardware → Controllo versione**. Quando è abilitata, l'app aggiunge una voce di salvataggio automatico alla cronologia delle versioni circa 2,5 secondi dopo aver smesso di modificare una scheda (per una scheda di un progetto anche alla cronologia del progetto). Disattivala se desideri salvare solo i tuoi commit. Vedi [Controllo versione](#version-control).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Impostazioni hardware**                                                                                        | Aprire la finestra di dialogo di configurazione hardware: configurare VICE, Exomizer, RetroDebugger, C64 Ultimate (host, password, test di connessione) e la porta seriale di Kung Fu Flash 2. Vedere [Sezione 13](#13-hardware-settings).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Nuovo programma…**                                                                                             | Apre una finestra di dialogo di conferma, quindi cancella tutti i blocchi dall'area del programma.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Comprimi tutto**                                                                                               | Comprimi tutti i blocchi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Informazioni**                                                                                                 | Informazioni sulla variante                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Novità**                                                                                                       | Registro delle modifiche                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

### Controllo delle versioni

Ogni scheda ha la propria cronologia delle versioni, come un piccolo repository
git; una scheda che appartiene a un progetto `.proj` aperto può anche essere
versionata come un intero progetto (vedi [Modalità progetto](#project-mode)).
**Menu → Compilazione → Controllo versione…** (o **Commit…**) apre la finestra
di dialogo; **Annulla modifiche (torna a HEAD)** ripristina direttamente
l'ultimo commit.

Il flusso di lavoro usuale: scrivi un messaggio di commit e premi Commit (o
Ctrl+Invio) → continua a modificare → premi Diff per vedere cosa è cambiato →
esegui nuovamente il commit.

- **Commit** — salva lo stato corrente della scheda con il tuo messaggio. Ogni
  commit riceve un hash breve (ad esempio `1bd55ba`); il più recente è **HEAD**.
  Un commit senza modifiche da HEAD non viene creato.
- **Riga di stato** — *Niente da confermare, albero di lavoro pulito* o
  *Modifiche non confermate da `<hash>`*.
- **Diff** — le modifiche dall'HEAD; il pulsante **Diff** di una voce di
  registro confronta quella versione con l'editor. Le righe aggiunte sono verdi,
  quelle rimosse rosse e l'intestazione mostra **+N / −M**. I programmi in
  modalità blocco vengono confrontati come righe di assemblaggio (una riga per
  blocco), i sorgenti Expert riga per riga, le schede Ultimate Basic in base al
  loro codice sorgente, quindi un progetto in modalità blocco salvato come JSON
  mostra comunque modifiche leggibili.
- **Checkout** — carica quella versione nell'editor. Il file su disco cambia
  solo quando lo salvi; **Annulla modifiche** torna a HEAD.
- **Voci di salvataggio automatico** — con **Impostazioni → Controllo versione →
  Voci di salvataggio automatico automatico nel controllo versione** l'app
  aggiunge una voce circa 2,5 secondi dopo aver smesso di modificare. Sono
  contrassegnate come *salvataggio automatico*; vengono mantenute le ultime 20,
  accanto a un massimo di 100 commit.
- La finestra di dialogo può essere spostata tramite l'intestazione; si riapre
  nella stessa posizione e si chiude con **Esc** o con il pulsante di chiusura
  (un clic esterno non la chiude).
- La cronologia viene memorizzata accanto al file di progetto come
  `<progetto>.snapshots.json` (nella cartella di configurazione dell'app fino al
  salvataggio del progetto), quindi viene conservata anche dopo i riavvii. Gli
  snapshot creati dalle versioni precedenti appaiono come commit.

#### Modalità progetto

Quando la scheda appartiene a un progetto `.proj` aperto (pannello progetto
Esperto o Base definitiva), l'intestazione della finestra di dialogo mostra un
interruttore **File / Progetto**; **Progetto** è selezionato per impostazione
predefinita. Le schede al di fuori di un progetto mantengono la cronologia per
file descritta sopra.

- **Commit** registra ogni file sorgente del progetto in una voce: i file
  dell'albero del progetto più i file di testo che includono (`.include`,
  `include`, `#import`, `!source`, blocchi INCLUDE in modalità blocco). Le
  schede aperte vengono conteggiate con il loro contenuto corrente, anche non
  salvato; gli altri file vengono letti dal disco. Anche i file binari
  dell'albero del progetto (font, `.koa`, `.bin`, `.sid` …, fino a 1 MB
  ciascuno) vengono registrati; il loro diff mostra la variazione di dimensione
  e **Checkout** li riscrive direttamente su disco.
- Il registro mostra il messaggio di commit, l'hash breve e i **file
  modificati** di ogni voce (**A** aggiunti, **M** modificati, **D** rimossi).
- **Diff** funziona file per file: ogni file modificato ottiene la propria
  intestazione e i propri blocchi.
- **Annulla le modifiche** torna all'ultimo commit del progetto (HEAD) nello
  stesso modo.
- **Checkout** (dopo una conferma) carica tutti i file di quella versione
  nell'editor: le schede aperte vengono aggiornate, i file mancanti vengono
  aperti come nuove schede. Nulla viene scritto su disco finché non si salva; i
  file aggiunti al progetto da quella versione rimangono invariati.
- Le voci di salvataggio automatico vengono inserite anche a livello di
  progetto.
- La cronologia del progetto è memorizzata accanto al file di progetto come
  `<progetto>.proj.history.json`.
- In modalità **Git** il log mostra l'intero repository con i file modificati di
  ogni commit (`git log --name-status`); **Diff** su una voce mostra il commit
  file per file, il pulsante **Diff** confronta HEAD con i file del progetto
  nell'editor (**RAW** è `git diff HEAD` del repository). **Commit** salva ogni
  scheda del progetto non salvata e prepara tutte le modifiche (`git add -A`);
  **Checkout** carica i file del progetto di quel commit nell'editor.

#### Get

Se `git` è installato, la stessa finestra di dialogo può funzionare con un
repository git reale.

- **Impostazioni → Controllo versione:** **Scegli git.exe…** o **Rilevamento
  automatico** (cerca nel PATH e nelle solite cartelle di installazione); la
  riga seguente mostra la versione di git. **Usa Git quando il progetto si trova
  in un repository** (attivato per impostazione predefinita) commuta
  automaticamente la finestra di dialogo in modalità Git per i file all'interno
  di un repository. L'interruttore **Integrato / Git** nell'intestazione della
  finestra di dialogo modifica la modalità manualmente.
- L'intestazione mostra il ramo con **↑** (commit per il push) e **↓** (commit
  per il pull), seguito dai file modificati del repository.
- **Commit** salva prima il file, aggiunge all'area di staging solo questo file
  (o ogni modifica con **Aggiungi all changes (git add -A)**) ed esegue `git
  commit`.
- Il registro elenca i commit di questo file con i relativi rami e tag. **Diff**
  su una voce confronta il commit con il suo genitore; il pulsante **Diff**
  confronta HEAD con l'editor, incluse le modifiche non salvate. I file di
  progetto vengono confrontati nello stesso modo della modalità integrata;
  **RAW** mostra il semplice `git diff`.
- **Checkout** carica il file di quel commit nell'editor (`git show`) senza
  toccare il disco.
- **Pull** (`--ff-only`), **Push** (il primo push imposta l'upstream con `-u
  origin <branch>`) e **Crea repository (git init)** quando la cartella non è
  ancora un repository.
- git viene eseguito senza una finestra della console e non richiede mai una
  password: le credenziali devono provenire da un gestore di credenziali o da
  una chiave SSH, altrimenti viene visualizzato il messaggio di errore nella
  finestra di dialogo. | **Base di conoscenza** | Collegamenti di riferimento
  (opcode 6502, kernel C64, mappa della memoria, colori) | | **Verifica
  aggiornamenti** | Controlla c64va.pro per una versione più recente e
  scaricala/installala — vedi [Aggiornamenti in-app](#in-app-updates) |

### Strumenti dell'editor

**Menu → Verifica aggiornamenti** cerca la versione più recente su c64va.pro
(legge i link di download per la tua piattaforma) e la confronta con la versione
in esecuzione:

- Evidenziazione della sintassi basata sul riferimento corrente al linguaggio
  Ultimate Basic;
- numeri di riga che rimangono sincronizzati con file di grandi dimensioni;

Il pannello Disassemblaggio include un pulsante **Copia** che copia negli
appunti l'intero codice sorgente visualizzato. La guida ai comandi segue il
compilatore incluso: ad esempio, `sprite_frame id, data_address [, frame]`
seleziona un'immagine di animazione da frame sprite consecutivi da 64 byte.

| Piattaforma | Che succede                                                                                                                                                                                                                                         |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Windows** | Il programma di installazione viene eseguito in modalità passiva (solo avanzamento) e avvia la nuova versione al termine. L'installazione per singolo computer richiede i diritti di amministratore (UAC).                                          |
| **macOS**   | Il file DMG viene montato e il pacchetto dell'applicazione viene sostituito al suo posto, dopodiché si avvia la nuova versione. Se la cartella dell'applicazione non è scrivibile, è sufficiente aprire il file DMG per trascinarvi l'applicazione. |
| **Linux**   | Un'AppImage viene sostituita con quella nuova. Un'installazione `.deb` / `.rpm` viene aggiornata con `pkexec` (ti viene richiesta la password); senza `pkexec` il pacchetto viene aperto nel tuo programma di installazione.                        |

L'elenco dei comandi è intenzionalmente limitato in altezza in modo che la
scheda dei dettagli del comando possa riempire l'altezza rimanente del pannello.
L'area dei dettagli scorre indipendentemente per consentire descrizioni di
sintassi più lunghe.

### Libero e open source

Visual Assembler è gratuito: ogni funzionalità — gli editor visivi (SID, Sprite,
Char, Charset, Hi-Res, Map, Level, D64, Curve), il SID Player, **Build PRG**,
**Build D64**, **Build CRT**, **Build project**, l'impacchettamento Exomizer,
l'esecuzione su C64 Ultimate e su Kung Fu Flash 2, e ogni lingua e tema
dell'interfaccia utente — funziona senza registrazione o numero di serie. Il
codice sorgente è disponibile sotto la GNU General Public License v3.0 (vedi
**Menu → Informazioni**). Fino alla versione 2.5.9 l'applicazione aveva una
suddivisione Freemium/Professional; dalla versione 2.6.0 non è più necessario
inserire un numero di serie.

Se il programma ti piace, puoi supportarne lo sviluppo con una donazione: **Menu
→ Donazione** (sotto Visualizza) apre la pagina delle donazioni su c64va.pro,
dove puoi donare qualsiasi importo tramite PayPal.

**Statistiche di utilizzo.** Al massimo una volta al giorno, all'avvio, l'app
invia un ping anonimo a c64va.pro con la versione dell'app, il sistema
operativo, la lingua dell'interfaccia utente, il numero di avvii e i minuti di
attività dall'ultimo ping (un minuto viene conteggiato finché la finestra è
visibile e si è utilizzato il mouse o la tastiera negli ultimi 5 minuti), se un
numero di serie dalla 2.5.6 alla 2.5.9 è ancora memorizzato (solo sì/no) e un ID
di installazione casuale (conservato nel `config.json` dell'app come
`launchPing`). Non vengono inviati indirizzi email, numeri di serie, progetti o
codice sorgente; offline non succede nulla. L'app chiede inoltre occasionalmente
a c64va.pro un breve messaggio (ad esempio su una nuova versione, a volte solo
per i sostenitori); ogni messaggio viene mostrato una sola volta.

### Segnalazione di un bug

**Menu → Segnala bug** apre un modulo che invia la segnalazione direttamente
allo sviluppatore.

- **Riepilogo** e **Cosa è successo?** sono obbligatori: descrivi cosa hai
  fatto, cosa ti aspettavi e cosa è successo invece. **Email** è facoltativa;
  inseriscila se desideri una risposta.
- **Screenshot:** fino a 4 immagini con **Aggiungi immagine…**, incollandole con
  **Ctrl+V** (ad esempio dopo Win+Shift+S) o rilasciandole sul modulo. Le
  immagini di grandi dimensioni vengono ridimensionate a 1920 pixel.
- **Includi informazioni di sistema ed errori recenti** (attivato per
  impostazione predefinita) aggiunge la versione dell'app, il sistema operativo,
  la lingua, il tema, l'editor e la modalità di esecuzione, le dimensioni dello
  schermo, il numero di blocchi e gli ultimi errori dell'app. **Cosa viene
  inviato?** mostra i dati. Il tuo codice sorgente non viene inviato.
- **Invia rapporto** conferma con il numero del rapporto. **Invia tramite
  e-mail** apre invece il tuo programma di posta.

### Supporto

**Menu → Supporto** apre una chat con lo sviluppatore: scrivi una domanda,
un'idea o un problema e premi **Invia** (oppure **Ctrl+Invio**). È possibile
allegare fino a 3 file (4 MB in totale): immagini, file sorgente (`.asm`, `.ub`,
`.txt` …), file C64 (`.prg`, `.d64`, `.sid`, `.crt` …) o un `.zip` — con
**Allega file…**, incollandoli (**Ctrl+V**) o trascinandoli nella finestra. La
risposta appare nella stessa finestra, anche con i file: le immagini vengono
visualizzate come anteprime, un clic salva un file. La finestra non è modale:
trascinala dall'intestazione, ridimensionala dall'angolo in basso a destra e
continua a lavorare mentre è aperta. L'app controlla la presenza di risposte
all'avvio e ogni minuto; una nuova risposta emette un breve segnale acustico (il
pulsante dell'altoparlante nell'intestazione della finestra lo disattiva), fa
lampeggiare l'icona nella barra delle applicazioni quando l'app è in background,
mostra un punto rosso sul pulsante **Menu** e apre la finestra una volta. Una
volta avviata una conversazione, un'icona a forma di busta accanto al pulsante
**Menu** la apre; diventa rossa e lampeggia mostrando il numero di risposte non
lette. I pulsanti **×** accanto a un messaggio eliminano quel messaggio, il
pulsante del cestino nell'intestazione della finestra elimina l'intera
conversazione con i relativi allegati (anche per lo sviluppatore; in entrambi i
casi è necessario chiedere prima). L'indirizzo email è facoltativo: se lo
fornisci, la risposta arriverà anche via email. La conversazione è legata all'ID
di installazione casuale dell'app, quindi non sono necessari né un account né
una password.

### Progetti, schede e file di avvio

I progetti Ultimate Basic utilizzano file `.proj` e possono contenere più
sorgenti `.ub`. Il pannello Progetto elenca i file aperti, contrassegna le
schede non salvate e mostra etichette, funzioni e subroutine rilevate. Le azioni
del progetto consentono di creare, aprire, salvare e chiudere un progetto o
aggiungere un altro file sorgente. Un nuovo progetto può anche iniziare da un
modello UltimateBasic: vedere [Modelli di progetto]{1}.

- **Aggiungi file** — seleziona uno o più file contemporaneamente (qualsiasi
  tipo — `.ub`, `.bin`, `.prg`, immagini, font, ecc.). Anche i sorgenti `.ub`
  vengono aperti come schede dell'editor; tutto il resto viene aggiunto solo
  come riferimento, affinché le risorse `incbin`/`loadfile` vengano trasferite
  con il progetto.
- **Aggiungi cartella** — fai riferimento a un'intera cartella (ad esempio una
  directory di risorse `incbin` come `fonts/`) in modo che rimanga associata al
  progetto.
- Solo le schede supportate da un file reale sul disco vengono salvate nell'area
  di lavoro; una scheda contenente un esempio non salvato o un programma
  presente solo in memoria non ha nulla da rendere persistente e viene ignorata
  (con un avviso se nessuna delle schede aperte soddisfa i requisiti).
- L'apertura di un'area di lavoro chiude prima tutte le schede attualmente
  aperte: ti verrà chiesto di confermare prima di procedere.
- Se un'area di lavoro fa riferimento a un file che è stato spostato o
  eliminato, tale voce viene ignorata e visualizzata per nome dopo il
  caricamento.
- Anche i progetti Expert e Ultimate Basic **** aperti vengono memorizzati:
  l'albero del progetto (incluse aggiunte e rimozioni non salvate), il file di
  avvio e la destinazione di salvataggio `.proj` vengono ripristinati con l'area
  di lavoro. Le aree di lavoro salvate da versioni precedenti si aprono senza di
  essi.

### Finestra di memoria e utilizzo della pagina pari a zero

Il pannello **Full C64 memory** può essere mobile: il pulsante **undock** nella
sua intestazione lo sposta in una finestra separata, non modale, che puoi
trascinare e ridimensionare mentre continui a modificarla (l'indicatore di
sovrapposizione lo segue). **Dock** (o × / Esc) lo riporta nella posizione
originale. La finestra ricorda se è stata scollegata e le sue dimensioni.

Quando il programma tocca la pagina zero, nella parte superiore della mappa di
memoria appare una sezione **Utilizzo della pagina zero**: una griglia 16 × 16
di `$00–$FF`, colorata per area — porta CPU (`$00–$01`), libera (`$02`,
`$FB–$FE`), BASIC (`$03–$8F`, `$FF`) e KERNAL (`$90–$FA`). Le celle utilizzate
sono riempite; una cornice contrassegna una **scrittura**, un tratteggio un
**puntatore** (`(zp),Y` / `(zp,X)`). Fai clic su una cella utilizzata per vedere
quali righe vi accedono (fai clic su una riga per saltare lì) e un avviso quando
scrivi nell'area BASIC o KERNAL.

Se il programma contiene il player esportato dall'editor SID (`etichette sid_`),
anche la pagina zero del player (`$02–$1C`, `$2F`, `$FB–$FD`) viene
contrassegnata e ogni indirizzo utilizzato anche dal proprio codice viene
segnalato come un **conflitto** (cornice rossa, avviso nell'intestazione).

### Costruzione e diagnostica

Il pulsante **Build** apre la stessa esperienza di avanzamento centrata
utilizzata dagli altri flussi di lavoro di esecuzione di Visual Assembler. Le
build riuscite aggiornano l'output di build, le informazioni di build e il
disassemblaggio. Abilita **Verbose** per includere i dettagli della mappa di
memoria del compilatore, le allocazioni interne di pagine zero e i dati del
codice generato.

1. L'output di compilazione viene reso visibile automaticamente;
2. Gli errori di compilazione vengono visualizzati in rosso;
3. la finestra di dialogo di compilazione centrata visualizza l'errore;
4. errori contenenti una riga sorgente seleziona quella riga nell'editor UB
   attivo.

| Sezione           | Modelli predefiniti                                                                                                                                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Assemblatore**  | Programma vuoto, Gioco vuoto (stati titolo/gioca/fine partita, joystick, sprite del giocatore), Bitmap ad alta risoluzione, Bitmap multicolore, Multiplexer di sprite (16 sprite ordinati per Y ad ogni frame, visualizzati tramite una catena di interrupt raster) |
| **UltimateBasic** | Programma vuoto, gioco vuoto (stessa macchina a stati in UB), bitmap ad alta risoluzione (`linea` / `rettangolo` / `cerchio` con `penna colorata`), IRQ raster (una `sub` chiamata ad ogni frame dall'interrupt raster)                                             |

Quando la compilazione fallisce:

Il report Build Info riporta indirizzi di caricamento/fine, dimensioni del
codice e dei PRG, stato dell'Exomizer, variabili, array, funzioni/sottoprogrammi
ed etichette.

```asm
; @name Barre raster
; @name.hu Barre raster
; @category Effetti
; @desc Due barre raster nel bordo.

; @order 50
```

`@name`, `@category` e `@desc` possono avere varianti per lingua (`@name.hu`,
`@desc.de`, …); `@order` ordina l'elenco. Tutto ciò che segue l'intestazione
diventa il nuovo file principale e `{{PROJECT}}` viene sostituito con il nome
del progetto (usalo in un commento in modo che il modello stesso venga comunque
compilato).

### Esecuzione, D64 ed Exomizer

Il pulsante principale diviso **Esegui** supporta Ultimate Basic in ogni
destinazione normale:

- ogni sorgente compilabile (`.asm`, blocco `.json`, `.ub`) viene compilato in
  un `.prg` **accanto alla sua sorgente** con lo stesso nome; con **Esegui con
  Exomizer** abilitato l'output viene elaborato;
- I file sidecar del debugger (simboli/mappa sorgente) vengono scritti insieme
  al PRG, ove disponibili;
- I moduli che un altro file include con `.include` / `include` (e i file
  `.inc`) vengono ignorati, così come le schede che non sono mai state salvate;
- un report elenca ogni file con la sua dimensione, *saltato* motivo o errore
  del compilatore e la barra di stato mostra *N / M file creati*.

### Simboli di debug e disassemblaggio

Le build richiedono informazioni di debug di Ultimate Basic e producono tre
sidecar compatibili:

- `.sym` per i simboli in stile KickAssembly;
- `.dbg` per le informazioni sul codice sorgente e sul segmento di
  C64Debugger/RetroDebugger;
- `.vs` per le etichette del monitor VICE.

### Manuale e fonte di Ultimate Basic

L'icona del libro nella barra degli strumenti di UB apre il manuale Ultimate
Basic `MANUAL.pdf` offline corrispondente; il pulsante del manuale nella
finestra di dialogo di benvenuto all'avvio apre lo stesso manuale. Visual
Assembler prende sia il compilatore che il PDF dalla dipendenza Git/Cargo
upstream bloccata, quindi l'IDE non mantiene una seconda copia
dell'implementazione di Ultimate Basic. La finestra di dialogo Informazioni e la
schermata iniziale mostrano la versione effettiva della dipendenza.

- `* = $1500` → blocco ORG
- `Etichetta:` → blocco ETICHETTA
- `Etichetta: .byte 0` → Blocchi ETICHETTA + BYTE
- `.byte ...` → blocco BYTE
- `; commento` (o in linea `; ...`) → blocco COMMENTO
- istruzioni (`lda`, `jsr`, `beq`, ecc.) → blocchi di istruzioni con modalità di
  indirizzamento rilevata

#### Note di analisi e best practice per l'importazione

- Le etichette locali come `.wait` vengono importate come etichette standard
  (punto rimosso) e i riferimenti vengono normalizzati di conseguenza.
- Per l'indirizzamento in stile `($zp),Y` / `($zp,X)`, utilizzare un byte di
  pagina zero concreto (`$FB`, `$FC`, ecc.) per la migliore compatibilità.
- Evitare etichette brevi ambigue che assomigliano a esadecimale (`cc1`, `dead`,
  `beef`) nei contesti di diramazione; preferire nomi come `loop_cc1`.
- Se il tuo programma inizia con dati (`.byte`) prima del codice eseguibile,
  aggiungi un salto di ingresso esplicito (ad esempio `JMP Start`) all'inizio.

### Importazione ASM (Kick Assembler)

Il pulsante **Importazione ASM** nel menu Programma importa il codice sorgente
grezzo di Kick Assembler in una nuova scheda in modalità blocco. È separato dal
pulsante `Carica file .asm` della modalità Esperto sopra menzionato: il suo
tooltip personalizzato segnala che **è supportato solo il codice Kick
Assembler** (altri assembler potrebbero essere analizzati parzialmente ma non è
garantito un ciclo completo).

Modelli supportati:

- `.pc = $XXXX` direttiva origine → blocco ORG
- `.const NOME = valore`, `.etichetta NOME = valore` → CONST equate
- `.macro NOME(p1, p2, ...) { ... }` con `{`/`}` corpo della parentesi graffa o
  `.endm` → definizione macro utente
- Invocazione macro `NOME(argomenti)`, prefisso due punti Kick
  `:NOME(argomenti)` e `.invoke NOME(argomenti)` — tutti con andata e ritorno
  tramite la forma due punti Kick
- Le etichette `@local` (`@loop:`, `BEQ @loop`) mantengono il prefisso `@` così
  com'è
- Operando `etichetta + N` / `etichetta - N` (ad esempio `STA mod1+2`, `LDA
  xp+1`)
- I commenti di riga `// ...` e `;` — entrambi accettati, i blocchi `/* ... */`
  vengono trattati come un'unica riga di commento
- Passaggio automatico BASIC: quando il programma inizia a `$0801` con lo stub
  di byte standard `SYS 2061` (`.byte
  $0B,$08,$0A,$00,$9E,$32,$30,$36,$31,$00,$00,$00`), il compilatore emette il
  PRG verbatim invece di racchiuderlo in un secondo BASIC SYS.

Limitazioni note:

- Le costanti che si risolvono in un indirizzo di pagina zero (ad esempio
  `.const BYTEADDR = $FC` usato come `STA BYTEADDR`) attualmente vengono
  compilate in istruzioni in modalità assoluta (3 byte) invece che in pagina
  zero (2 byte). Il codice compilato scrive comunque nella posizione di memoria
  corretta, ma con un piccolo overhead di dimensioni e cicli rispetto allo
  stesso codice sorgente compilato da Kick Assembler.

## 6. Modalità esperto

La modalità Esperto è un editor di assembly 6502 completo, con funzionalità di
scrittura diretta del testo, che affianca l'editor a blocchi. Ogni scheda può
essere in modalità Blocco o in modalità Esperto: è possibile passare liberamente
da una all'altra in qualsiasi momento utilizzando l'interruttore **Blocco /
Esperto** nella barra superiore.

### Modalità di commutazione

Seleziona l'icona **UB** nella barra degli strumenti principale per passare alla
modalità Ultimate Basic. La modalità editor selezionata viene memorizzata anche
dopo il riavvio dell'applicazione. Un nuovo codice sorgente inizia con:

```basic
colore sfondo 0
colore bordo 0

stampa "CIAO DA ULTIMATE BASIC"
```

La modalità UB funziona con i file sorgente `.ub`. **Nuovo**, **Apri**,
**Salva** e **Salva con nome** operano sulla scheda UB attiva. L'apertura di un
file `.ub` attiva automaticamente la scheda dell'editor corrispondente.

La barra degli strumenti mostra la cartella di lavoro UB corrente. Questa
cartella è memorizzata separatamente dalla cartella di lavoro Blocco/Esperto.
Quando la modalità UB è attiva, **File → Imposta cartella di lavoro** seleziona
la cartella UB; il relativo tooltip identifica l'ambito attivo. Le finestre di
dialogo Apri/Salva UB iniziano da lì e i file sorgente non salvati la utilizzano
come base per i percorsi relativi `include` e `incbin`.

### Layout dell'editor

La barra degli strumenti UB segue lo stesso linguaggio visivo e gli stessi
suggerimenti personalizzati della modalità Esperto. Offre:

- Evidenziazione della sintassi basata sul riferimento corrente al linguaggio
  Ultimate Basic;
- numeri di riga che rimangono sincronizzati con file di grandi dimensioni;
- una minimappa e controlli di zoom dell'editor (`Ctrl` + rotellina del mouse
  consentono anche lo zoom); fai clic sulla minimappa per spostarti o trascina
  la selezione della sua area di visualizzazione per lo scorrimento continuo;
- Trova (`Ctrl+F` / `Cmd+F`) utilizzando la barra di ricerca in stile esperto;
- Formattazione del codice sorgente con rientro sensibile alla struttura;
- Completamento automatico per comandi e funzioni integrate;
- un pannello **Comandi** ricercabile con sintassi, descrizione e guida all'uso:
  le descrizioni seguono la lingua corrente dell'interfaccia utente (ungherese,
  inglese, spagnolo, tedesco, olandese), con un ripiego sull'inglese per tutto
  ciò che non è ancora stato tradotto;
- Pannelli **Progetto** e **Comandi** attivabili e disattivabili
  indipendentemente, visualizzati uno accanto all'altro quando entrambi sono
  abilitati;
- Pannelli **Build Output** e **Disassembly** attivabili e ridimensionabili
  indipendentemente.

Il pannello Disassemblaggio include un pulsante **Copia** che copia negli
appunti l'intero codice sorgente visualizzato. La guida ai comandi segue il
compilatore incluso: ad esempio, `sprite_frame id, data_address [, frame]`
seleziona un'immagine di animazione da frame sprite consecutivi da 64 byte.

L'editor comprende anche la sintassi in stile QBasic di Ultimate Basic 1.6.3:
`dim name as type`, `function … end function`, `sub … end sub`, `elseif`, `do …
loop [while | fino a]`, `mentre … wend`, `seleziona caso`, `esci fai` / `esci
per` / `esci mentre` / `esci sub` / `esci funzione`, le funzioni stringa
`sinistra$` / `destra$` / `centro$` e i commenti che iniziano con `'` così come
`#` o `rem`. Le parole che il compilatore tratta come parole chiave solo in una
posizione vengono colorate solo lì e rimangono utilizzabili come nomi: `as` con
i nomi dei tipi BASIC (`byte`, `integer`, `single`, `double`), `case is`, `map
view`, `wait key` e le opzioni `scroll` (`row`, `x`, `y`, `sinistra`, `destra`,
`stretta`, `larga`). **Format** rientra i blocchi `function`, `do … loop`,
`while … wend` e `elseif` e lascia i cicli su una riga (`do while c : … : loop`)
non rientrati, il pannello Progetto elenca i blocchi `function` sotto Funzioni e
il pannello Comandi ha **DIM**, **FUNCTION**, **ELSEIF**, **DO**, **WEND**,
**SELECT CASE**, **END**, **EXIT SUB**, **LEFT$**, **RIGHT$** e **MID$** voci.

L'elenco dei comandi è intenzionalmente limitato in altezza in modo che la
scheda dei dettagli del comando possa riempire l'altezza rimanente del pannello.
L'area dei dettagli scorre indipendentemente per consentire descrizioni di
sintassi più lunghe.

### Pulsanti della barra degli strumenti

I progetti Ultimate Basic utilizzano file `.proj` e possono contenere più
sorgenti `.ub`. Il pannello Progetto elenca i file aperti, contrassegna le
schede non salvate e mostra etichette, funzioni e subroutine rilevate. Le azioni
del progetto consentono di creare, aprire, salvare e chiudere un progetto o
aggiungere un altro file sorgente. La finestra di dialogo Controllo versione
consente di eseguire il commit, confrontare e ripristinare tutti i file del
progetto contemporaneamente (vedere [Modalità progetto](#project-mode)). È anche
possibile avviare un nuovo progetto da un modello UltimateBasic (vedere [Modelli
di progetto](#project-templates)).

Fai clic sulla stella accanto a un file di progetto per contrassegnarlo come
file di avvio ****. I comandi Build, Run, D64, C64 Ultimate e Debug compilano
quel codice sorgente di avvio anche se è attualmente attiva una scheda diversa.
Senza una selezione di avvio, viene utilizzata la scheda UB attiva.

La barra degli strumenti del pannello del progetto ha due pulsanti Aggiungi e le
finestre di dialogo dei file sono impostate di default sulla cartella di lavoro
**UB** (Menu → File → Imposta cartella di lavoro, specifica di UB):

- **Aggiungi file** — seleziona uno o più file contemporaneamente (qualsiasi
  tipo — `.ub`, `.bin`, `.prg`, immagini, font, ecc.). Anche i sorgenti `.ub`
  vengono aperti come schede dell'editor; tutto il resto viene aggiunto solo
  come riferimento, affinché le risorse `incbin`/`loadfile` vengano trasferite
  con il progetto.
- **Aggiungi cartella** — fai riferimento a un'intera cartella (ad esempio una
  directory di risorse `incbin` come `fonts/`) in modo che rimanga associata al
  progetto.

Le cartelle nell'albero hanno una freccia per comprimere/espandere e **fare clic
con il pulsante destro del mouse su una cartella** per aggiungere uno o più file
annidati al suo interno (mostrati rientrati). Ogni voce ha un pulsante di
eliminazione (✕); le voci non`.ub` sono solo di riferimento e non si aprono
facendo clic su di esse.

Il pulsante **Salva progetto** si disattiva e mostra lo stato "Salvato" quando
il progetto non presenta modifiche in sospeso, e si riattiva automaticamente nel
momento in cui si aggiunge, si rimuove o si riorganizza un file o una cartella.

### Mappa del redattore esperto

La minimappa dell'editor esperto è una stretta striscia di tela (`88 px`)
all'estrema destra dell'area dell'editor. Visualizza una rappresentazione in
scala ridotta di ogni riga del codice sorgente:

Un indicatore di visualizzazione semitrasparente (rettangolo colorato) mostra
quale parte della sorgente è attualmente visibile. Fai clic in un punto
qualsiasi della minimappa per spostarti in quella posizione; trascina per
scorrere continuamente. La minimappa scorre indipendentemente per mantenere
l'indicatore di visualizzazione centrato. Lo stato viene salvato nelle
impostazioni dell'interfaccia utente (tasto expertMinimap).

- L'output di compilazione viene reso visibile automaticamente;
- Gli errori di compilazione vengono visualizzati in rosso;
- la finestra di dialogo di compilazione centrata visualizza l'errore;
- errori contenenti una riga sorgente seleziona quella riga nell'editor UB
  attivo.

Il report Build Info riporta indirizzi di caricamento/fine, dimensioni del
codice e dei PRG, stato dell'Exomizer, variabili, array, funzioni/sottoprogrammi
ed etichette.

### Dimensione del codice per riga e suggerimenti

Il pulsante della barra degli strumenti **code size** (icona a forma di fiamma)
mostra, dopo la compilazione, quanti byte ha occupato ogni riga del codice
sorgente: il numero si trova nella colonna dei numeri di riga e una barra
arancione ne indica il peso rispetto alla riga più dispendiosa. La barra di
stato aggiunge i byte e una stima del numero di cicli (lineari, senza contare i
loop) della riga sotto il cursore.

Mentre digiti, nella barra di stato appare un pulsante **suggerimenti** quando
qualcosa non va; fai clic su di esso per visualizzare l'elenco e fai clic su un
suggerimento per passare alla riga:

- `sys $EA31` / `sys $EA81` — `sys` viene compilato in `JSR`, quindi l'`RTI` del
  KERNAL restituisce spazzatura; da un IRQ usa `irq_exit` o `asm { JMP $EA31 }`;
- `wait key` — non è una forma documentata, utilizzare `wait key`;
- una `var` / `dim` / `const` che non viene mai utilizzata;
- dopo una compilazione: un'istruzione di blocco `asm` su un indirizzo di pagina
  zero che contiene una variabile Ultimate Basic o la pagina zero del runtime
  stesso.

### Evidenziazione degli errori

Le righe che non vengono compilate correttamente vengono evidenziate in
**rosso** (sfondo colorato + bordo accentato a sinistra) in tempo reale, 350 ms
dopo ogni tasto premuto. Il primo messaggio di errore viene visualizzato anche
nella barra di stato. Correggi la riga e l'evidenziazione scompare
automaticamente.

| Modalità di esecuzione       | Comportamento di base ultimo                                                                                                                                                |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Esegui come PRG**          | Compila ed esegui il PRG direttamente in VICE.                                                                                                                              |
| **Esegui tramite D64**       | Compila, apri la finestra di dialogo standard per la creazione del pacchetto D64, quindi avvia il disco in VICE.                                                            |
| **Esegui su Ultimate**       | Carica ed esegui il file PRG tramite la connessione REST C64 Ultimate configurata.                                                                                          |
| **Esegui D64 sull'hardware** | Imballa un D64 e invialo al C64 Ultimate configurato.                                                                                                                       |
| **Kung Fu Flash 2**          | Compila il codice sorgente di avvio UB e carica il file PRG tramite USB su un vero C64/C128 con una cartuccia di Kung Fu Flash 2. Vedi [Kung Fu Flash 2](#kung-fu-flash-2). |

L'opzione globale **Impostazioni → Exomizer** si applica anche alle build UB e
ai target di esecuzione normali; non è necessario attivare o disattivare
separatamente la barra degli strumenti UB. Gli avvii del debugger utilizzano
deliberatamente il PRG non compresso in modo che gli indirizzi e i simboli del
compilatore continuino a corrispondere al programma eseguito.

Abilita **Impostazioni → Impostazioni programma → Genera sorgente UltimateBasic
ASM (.asm)** per salvare l'assembly generato dal compilatore accanto a una build
PRG o D64 utilizzando lo stesso nome file di base. Questa è un'opzione di
compilazione, quindi la barra degli strumenti di UB non contiene pulsanti di
esportazione ASM separati. Un'istruzione `load "NOME", $indirizzo` fornisce
anche l'indirizzo di caricamento PRG del file extra D64 corrispondente.

### Evidenziazione della sintassi

L'editor utilizza una sovrapposizione trasparente `<div>` (`expert-hl`) che
rispecchia il contenuto dell'area di testo con elementi colorati `<span>`.
L'evidenziazione può essere disattivata con il pulsante **HL** per migliorare le
prestazioni in programmi molto grandi.

- `.sym` per i simboli in stile KickAssembly;
- `.dbg` per le informazioni sul codice sorgente e sul segmento di
  C64Debugger/RetroDebugger;
- `.vs` per le etichette del monitor VICE.

Le direttive `REGION` / `ENDREGION` vengono evidenziate come le altre direttive
dell'assembler. Le regioni compresse mantengono visibile nell'editor solo
l'intestazione della regione finché non vengono riaperte. La nuova opzione
**Selezione regione** nella barra degli strumenti controlla solo
l'evidenziazione automatica della regione corrente in modalità Esperto;
disattivandola, il codice sorgente rimane visibile senza modificare lo stato di
compressione.

### Formattatore sorgente

Fai clic sul pulsante **Formatta** (`#expert-format-btn`) per formattare
automaticamente la sorgente corrente:

Ultimate Basic è disponibile anche come progetto open-source autonomo:

<https://github.com/zstarczali/UltimateBasic>

Il compilatore è incluso in Visual Assembler, quindi non è necessario alcun
eseguibile `ub` separato in fase di esecuzione.

## 7. Modalità di indirizzamento

Ogni istruzione del 6502 supporta una o più modalità di indirizzamento. Il
selettore di modalità è presente su ciascun blocco.

### Etichetta le espressioni come operandi

- **Blocco → Esperto:** il programma corrente viene serializzato in testo
  (un'istruzione per riga, etichette, macro come direttive). Le modifiche in
  modalità Esperto vengono sincronizzate con l'array di blocchi ogni volta che
  si torna alla modalità precedente o si attiva un'azione.
- **Esperto → Blocco:** il testo viene analizzato con `parseAsmText()` e il
  risultato sostituisce il programma a blocchi. Viene visualizzata una finestra
  di dialogo di errore di compilazione se l'analisi fallisce.
- **Le righe vuote** vengono mantenute durante i passaggi di andata e ritorno:
  le righe vuote nell'editor esperto appaiono come sottili spaziatori
  tratteggiati in modalità Blocco e vengono ripristinate come righe vuote quando
  si torna alla modalità Esperto.

### Il contatore di programma `*` nelle espressioni

```
┌──────────────────────────────────────────────────────────┐
│ [barra degli strumenti] Blocco │ Esperto &lt; tab toggle │
├────────────┬────────────────────────────┬────────────┤
│ Tavolozza │ Editor di testo ASM │ Disasm │
│ (opzionale) │ (monospazio, modificabile) │ pannello │
│ │ │ (opzionale) │
└────────────┴────────────────────────────┴────────────┘
```

| Pannello      | Attiva/disattiva      | Descrizione                                      |
| ------------- | --------------------- | ------------------------------------------------ |
| **Tavolozza** | `#expert-palette-btn` | Salto a se stesso (ciclo infinito, offset `$FE`) |
| `*-n` / `*+n` | `BNE *-5`, `BEQ *+4`  | Salto relativo al PC corrente di *n* byte        |
| `JMP *+n`     | `#expert-disasm-btn`  | Salto assoluto calcolato dal PC attuale          |

### Etichette locali (tratteggiate)

| Pulsante                                | ID                                             | Funzione                                                                                                                                                                                                                                                                         |
| --------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Formato**                             | `#expert-format-btn`                           | Formattazione automatica del codice sorgente (etichette nella colonna 0, rientro di 4 spazi, mnemonico/operando di 1 spazio)                                                                                                                                                     |
| **Carica .asm**                         | `#expert-load-asm-btn`                         | Apri un file `.asm`: il contenuto viene caricato in una **nuova scheda** con il nome del file come etichetta della scheda. Ogni file caricato diventa una scheda indipendente con i propri blocchi di programma e stato dell'editor.                                             |
| **Salva .asm**                          | `#expert-save-asm-btn`                         | Salva il contenuto dell'editor in un file `.asm` (finestra di dialogo file al primo salvataggio)                                                                                                                                                                                 |
| **Informazioni sulla build**            | `#pulsante-info-build-esperto`                 | Apri la finestra di dialogo Informazioni sulla build (origine, dimensioni, etichette, errori)                                                                                                                                                                                    |
| **HL**                                  | `#expert-hl-btn`                               | Attiva/disattiva l'evidenziazione della sintassi (disattivala per file di grandi dimensioni)                                                                                                                                                                                     |
| **Completamento automatico**            | `#expert-autocomplete-btn`                     | Attiva/disattiva i suggerimenti di completamento automatico dell'esperto. Quando è disattivato, nessun suggerimento, mnemonico o etichetta viene visualizzato nell'editor esperto.                                                                                               |
| **Selezione della regione**             | `#pulsante-di-selezione-regione-esperto`       | Attiva o disattiva l'evidenziazione automatica della regione in modalità Esperto. Lo stato di ripiegamento viene memorizzato, ma quando questa opzione è disattivata, l'editor mantiene visibile l'intero codice sorgente e non seleziona automaticamente la regione corrente.   |
| **Comprimi / espandi tutte le regioni** | `#expert-region-fold-all-btn`                  | Comprimi o espandi ogni blocco `.region` con un clic. Se una qualsiasi regione è attualmente aperta, il pulsante le comprime tutte; se tutte le regioni sono già compresse, il clic successivo le espande tutte. Il pulsante si illumina quando tutte le regioni sono compresse. |
| **Numeri di riga**                      | `#expert-line-numbers-btn`                     | Attiva o disattiva la spaziatura tra i numeri di riga sul lato sinistro dell'editor. La spaziatura si sincronizza con la posizione di scorrimento e si aggiorna in tempo reale mentre digiti.                                                                                    |
| **Trova**                               | `#pulsante-per-trova-esperto`                  | Apri la barra di ricerca mobile (`Ctrl+F`). Digita per cercare; i risultati vengono evidenziati nella sovrapposizione. `Invio` / `Maiusc+Invio` per navigare tra i risultati. `Esc` chiude la barra.                                                                             |
| **Zoom indietro / avanti**              | `#expert-zoom-out-btn` / `#expert-zoom-in-btn` | Diminuisci/aumenta la dimensione del carattere dell'editor (da 8 a 28 px). `Ctrl` + rotellina del mouse (`Cmd` + rotellina su macOS o pizzicando il touchpad) sull'editor ha lo stesso effetto. L'impostazione viene salvata.                                                    |
| **Tavolozza**                           | `#expert-palette-btn`                          | Mostra/nascondi la tavolozza mnemonica sinistra                                                                                                                                                                                                                                  |
| **Disastro**                            | `#expert-disasm-btn`                           | Mostra/nascondi il pannello di smontaggio (puro 6502, macro espanse)                                                                                                                                                                                                             |
| **Monitor**                             | `#pulsante-monitor-esperto`                    | Mostra/nascondi il pannello del dump esadecimale del monitor                                                                                                                                                                                                                     |
| **Minimappa**                           | `#expert-minimap-btn`                          | Mostra/nascondi la minimappa del codice sul lato destro dell'editor                                                                                                                                                                                                              |

*(Novità nella versione 2.3.9.)* Un'etichetta il cui nome inizia con un punto —
`.loop`, `.skip`, `.done` — è un'etichetta **locale**. Appartiene all'ambito
dell'etichetta **globale** (non puntata) più vicina che la precede e
internamente diventa `<global>.<name>`. Due etichette locali con lo stesso nome
breve sotto etichette globali diverse **non** entrano in conflitto.

### etichette degli operandi del codice automodificante

*(Novità nella versione 2.3.9.)* Anteporre `label:` all'operando di
un'istruzione per posizionare un'etichetta sul **byte dell'operando** anziché
sull'opcode. L'istruzione viene assemblata da ciò che segue i due punti.

| Colore della barra     | Tipo di token                                           |
| ---------------------- | ------------------------------------------------------- |
| Commento colore        | Righe che iniziano con `;`                              |
| Colore dell'etichetta  | Linee con una definizione `etichetta:`                  |
| Colore dell'indicatore | `.byte`, `.macro`, `.region` e tutte le altre direttive |
| Colore mnemonico       | Tutto il resto (istruzioni)                             |

`value` punta a `<indirizzo dell'istruzione> + 1` (il primo byte dell'operando),
per ogni modalità di indirizzamento. Questo sostituisce il vecchio schema `STA
istruzione+1` / `istruzione: LDA #$00`. Il ciclo passa attraverso la modalità
Blocco ⇄ Esperto (il campo dell'operando mantiene il prefisso `etichetta:`).

### Conteggio cicli

Il pulsante della barra degli strumenti **cycle counts** (icona dell'orologio)
aggiunge un margine che mostra i 6510 cicli di ogni riga di istruzione:

| Mostrato      | Senso                                                                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `4`           | costo fisso                                                                                                                                                  |
| `4+`          | lettura indicizzata (`abs,X`, `abs,Y`, `(zp),Y`): +1 quando l'indice attraversa una pagina; una base allineata alla pagina (`$xx00`) mostra il valore esatto |
| `2/3`         | ramo: non preso / preso                                                                                                                                      |
| `2/4` (rosso) | Il ramo preso che attraversa una pagina: utile da sapere nel codice temporizzato                                                                             |

Selezionando più righe, la barra di stato mostra la somma: numero di istruzioni,
cicli min-max e numero di linee raster PAL (63 cicli). Macro e linee dati non
vengono conteggiate. L'impostazione viene memorizzata.

### Suggerimenti per l'ottimizzazione

L'editor esperto controlla il codice assemblato alla ricerca di schemi di
spioncino comuni. Le righe con un suggerimento vengono evidenziate con una
striscia ambra e nella barra di stato appare un pulsante **N suggerimenti**;
cliccandoci sopra si visualizza l'elenco e cliccando su un suggerimento si passa
direttamente alla riga corrispondente. I suggerimenti non modificano mai il
codice:

- `JSR x` seguito da `RTS` → `JMP x` (1 byte più corto, 9 cicli più veloce);
- `CMP #0` / `CPX #0` / `CPY #0` subito dopo un'istruzione che ha già impostato
  N/Z per quel registro (nota: il confronto imposta anche C);
- lo stesso caricamento due volte, oppure un caricamento del valore appena
  memorizzato (`STA x` / `LDA x`);
- `LDA m` / `CLC` / `ADC #1` / `STA m` → `INC m`, e la forma `SEC` / `SBC #1` →
  `DEC m`;
- un `JMP` o salto all'istruzione successiva, e `PHA` immediatamente seguito da
  `PLA`.

Un'etichetta tra due istruzioni (un possibile obiettivo di salto) sopprime i
suggerimenti che le unirebbero.

### Evidenziazione degli errori

Le righe che non vengono compilate correttamente vengono evidenziate in
**rosso** (sfondo colorato + bordo accentato a sinistra) in tempo reale, 350 ms
dopo ogni tasto premuto. Il primo messaggio di errore viene visualizzato anche
nella barra di stato. Correggi la riga e l'evidenziazione scompare
automaticamente.

### Evidenziazione della sintassi

L'editor utilizza una sovrapposizione trasparente `<div>` (`expert-hl`) che
rispecchia il contenuto dell'area di testo con elementi colorati `<span>`.
L'evidenziazione può essere disattivata con il pulsante **HL** per migliorare le
prestazioni in programmi molto grandi.

| Colore       | Token                                                                                                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Giallo-verde | Mnemotecniche (`LDA`, `STA`, `JMP`, …) e pseudo-operazioni a lungo ramo (`LBNE`, `LBEQ`, …)                                                                             |
| Blu          | Direttive (`.byte`, `.word`, `.fill`, `.assert`, `*=`, …)                                                                                                               |
| Arancia      | Numeri (`$FF`, `%1010`, `255`)                                                                                                                                          |
| Ciano        | Etichette — righe che terminano con `:`, incluse le etichette locali (`.loop:`) e le etichette degli operandi del codice automodificante (`value:` in `LDA value:#$00`) |
| Verde acqua  | Letterali stringa                                                                                                                                                       |
| Viola        | Nomi macro personalizzati: il nome dopo `.macro`, `.invoke` e `.call`, e chiamate in stile Kick `:name(...)`                                                            |
| Sabato       | Parametri macro: i nomi dei parametri nell'intestazione `.macro` e le sostituzioni `{param}` nel corpo della macro                                                      |
| Verde scuro  | Commenti (`; …`)                                                                                                                                                        |

Le direttive `REGION` / `ENDREGION` vengono evidenziate come le altre direttive
dell'assembler. Le regioni compresse mantengono visibile nell'editor solo
l'intestazione della regione finché non vengono riaperte. La nuova opzione
**Selezione regione** nella barra degli strumenti controlla solo
l'evidenziazione automatica della regione corrente in modalità Esperto;
disattivandola, il codice sorgente rimane visibile senza modificare lo stato di
compressione.

### Formattatore sorgente

Fai clic sul pulsante **Formatta** (`#expert-format-btn`) per formattare
automaticamente la sorgente corrente:

- Le definizioni delle etichette vengono spostate nella colonna 0.
- Le istruzioni sono rientrate di 4 spazi.
- Le formule mnemoniche sono scritte in maiuscolo.
- Esattamente uno spazio tra la frase mnemonica e l'operando (gli spazi bianchi
  in eccesso vengono normalizzati).
- Se la sorgente è già formattata, viene visualizzato lo stato `"Già
  formattato"`.

### Pannello e schede del progetto

La modalità esperto supporta un **pannello di progetto**
(`#expert-project-panel`) per progetti `.proj` multi-file:

- Un file `.proj` è un manifesto JSON che elenca i file sorgente e i relativi
  metadati.
- Apri un progetto con **Menu → File → Apri progetto** oppure trascina un file
  `.proj` sulla finestra.
- Ogni file del progetto si apre come una scheda ** ** separata nella barra
  delle schede nella parte superiore dell'editor.
- **Chiudi progetto** (`Menu → File → Chiudi progetto` / `#menu-close-project`)
  chiude il progetto corrente e tutte le relative schede file
  contemporaneamente. Richiede di salvare eventuali modifiche non salvate prima
  della chiusura. Il pannello del progetto viene ripristinato allo stato vuoto e
  `_expertProjectData` viene cancellato.
- Ogni file può essere contrassegnato come **file di avvio** (★ icona a stella).
  Quando viene impostato un file di avvio, il pulsante **Esegui** (PRG, D64,
  Ultimate) compila ed esegue sempre il codice di quel file, indipendentemente
  dalla scheda attualmente attiva. Questo funziona sia in modalità a blocchi che
  in modalità esperto.
- Il pulsante **Aggiungi** della barra degli strumenti seleziona uno o più file
  contemporaneamente (di qualsiasi tipo, non solo `.json`/`.asm`) e li
  referenzia nel progetto senza aprirli: utilizzalo per risorse binarie come i
  dati `incbin`. La finestra di dialogo predefinita è la cartella di lavoro di
  VA. Il pulsante **Aggiungi cartella** adiacente referenzia un'intera cartella
  (ad esempio una directory di risorse) allo stesso modo. Le voci di solo
  riferimento mostrano un pulsante Elimina (✕) ma non vengono aperte facendo
  clic su di esse.
- Le cartelle nell'albero hanno una freccia per comprimere/espandere e **fare
  clic con il pulsante destro del mouse su una cartella** per aggiungere uno o
  più file annidati al suo interno (mostrati rientrati).
- Il pulsante **Salva progetto** si disattiva e mostra lo stato "Salvato" quando
  il progetto non presenta modifiche in sospeso, e si riattiva automaticamente
  nel momento in cui si aggiunge, si rimuove o si riorganizza un file o una
  cartella.
- La sezione **simboli** nella parte inferiore del pannello del progetto può
  essere ridimensionata verticalmente tramite il divisore tra la struttura dei
  file e l'elenco dei simboli, in modo che gli elenchi di simboli lunghi possano
  occupare più spazio quando necessario.
- **Il controllo della versione** funziona per l'intero progetto: con l'opzione
  **Progetto** della finestra di dialogo Controllo versione, un commit registra
  ogni file di progetto e Checkout li ripristina tutti nelle schede. Vedi
  [Modalità progetto](#project-mode).

### Barra delle schede

La barra delle schede appare sopra l'editor quando sono aperte più schede.

| Caratteristica       | Descrizione                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Punto sporco**     | Un piccolo punto colorato a contrasto sul nome della scheda indica le modifiche non salvate.                                                                                                                                                                                                                                                                                                                     |
| **Scorri le frecce** | I pulsanti di scorrimento a sinistra/destra compaiono quando ci sono più schede di quelle che possono essere contenute nella barra.                                                                                                                                                                                                                                                                              |
| **Chiudi (×)**       | Chiude la scheda; chiede di salvare se la scheda è stata modificata.                                                                                                                                                                                                                                                                                                                                             |
| **Estensione file**  | Viene mostrato il nome completo del file, inclusa l'estensione (`.c64va`, `.json`).                                                                                                                                                                                                                                                                                                                              |
| **Menu clic destro** | Fai clic con il pulsante destro del mouse su una scheda (o su uno spazio vuoto della barra delle schede) per: **Nuova scheda**, **Chiudi scheda**, **Chiudi altre schede**, **Chiudi le schede a destra**, **Chiudi tutte le schede**. Le operazioni di chiusura in batch richiedono un messaggio per ogni scheda modificata e si interrompono se si annulla. **Chiudi tutto** mantiene sempre una scheda vuota. |

> **Suggerimento:** La sincronizzazione della tavolozza
> (`#expert-palette-sync-btn`) mantiene la selezione della tavolozza
> sincronizzata con il tasto mnemonico sul cursore. Disabilitala quando
> preferisci che la tavolozza non si sposti durante la modifica.

---

## 8. Istruzioni standard 6502

Ogni istruzione del 6502 supporta una o più modalità di indirizzamento. Il
selettore di modalità è presente su ciascun blocco.

| Modalità       | Etichetta          | Esempio       | Descrizione                                                                                             |
| -------------- | ------------------ | ------------- | ------------------------------------------------------------------------------------------------------- |
| **implicito**  | Implicito          | `NOP`         | Nessun operando; l'istruzione è autonoma.                                                               |
| **immediato**  | Immediato          | `LDA #$FF`    | Costante in linea; l'assemblatore aggiunge automaticamente `#`.                                         |
| **zeroPage**   | Pagina zero        | `LDA $10`     | Indirizzo di un singolo byte nella pagina zero (0–255)                                                  |
| **zeroPageX**  | Pagina zero,X      | `LDA $10,X`   | Indirizzo di pagina zero + offset del registro X (il risultato va a capo nella pagina 0)                |
| **zeroPageY**  | Pagina zero,Y      | `LDX $FB,Y`   | Indirizzo di pagina zero + offset del registro Y                                                        |
| **assoluto**   | Assoluto           | `LDA $0400`   | Indirizzo di memoria completo a 16 bit                                                                  |
| **X assoluto** | Assoluto,X         | `LDA $0400,X` | Indirizzo a 16 bit + offset del registro X                                                              |
| **assolutoY**  | Assoluto,Y         | `LDA $0400,Y` | Indirizzo a 16 bit + offset del registro Y                                                              |
| **relativo**   | Relativo/Etichetta | `Ciclo BNE`   | Per le istruzioni relative alla filiale, inserire il nome dell'etichetta o l'indirizzo di destinazione. |
| **indirectX**  | Indiretto,X        | `LDA ($FB,X)` | Indicizzazione indiretta a pagina zero (operando = indirizzo di pagina zero, 1 byte)                    |
| **indirectY**  | Indiretto,Y        | `LDA ($FB),Y` | Indicizzazione indiretta della pagina zero (operando = indirizzo della pagina zero, 1 byte)             |
| **indiretto**  | Indiretto          | `JMP ($0100)` | Indiretto; utilizzabile solo con JMP                                                                    |

### Movimento dei dati

Qualsiasi campo operando che accetta un indirizzo o un valore immediato accetta
anche direttamente un **nome costante** (da un blocco `CONST` o un `LABEL`).
Inoltre, è possibile utilizzare le espressioni **label+offset** o
**label−offset** per fare riferimento a un indirizzo relativo a una costante
denominata:

| Sintassi | Esempio                             | Descrizione                                                                                                                   |
| -------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `LDA`    | Accumulatore di carico              | immediato, zeroPage, assoluto, assolutoX, assolutoY, indirettoX, indirettoY                                                   |
| `LDX`    | Carica il registro X                | immediato, zeroPage, zeroPageY, assoluto, assolutoY                                                                           |
| `LDY`    | Caricare il registro Y              | immediato, zeroPage, assoluto, assolutoX                                                                                      |
| `STA`    | Accumulatore di magazzino           | zeroPage, assoluto, assolutoX, assolutoY, indirettoX, indirettoY                                                              |
| `STX`    | Registrati al negozio X             | zeroPage, zeroPageY, assoluto                                                                                                 |
| `STY`    | Registratore di cassa del negozio Y | zeroPage, assoluto                                                                                                            |
| `*`      | `BNE *`                             | Contatore di programma corrente (indirizzo dell'istruzione stessa); i salti con `*` generano un ciclo infinito (offset `$FE`) |

**Esempio: cancellare due pagine dello schermo usando una COSTANTE:**
```
; .CONST screen_ram = $0400

LDX #$00
clear:

STA screen_ram,X

STA screen_ram+$0100,X

DEX
BNE clear
```

### Aritmetica

*(Novità nella versione 2.3.9.)* `*` non è più limitato a essere l'intero
operando: può apparire **ovunque all'interno di un'espressione operando** e
rappresenta l'indirizzo dell'istruzione su cui è scritto. Viene risolto in fase
di assemblaggio rispetto all'indirizzo reale di tale istruzione, quindi non è
necessaria alcuna etichetta per brevi salti relativi o letture di dati relative
al PC.

| Sintassi   | Esempio               | Senso                                                                        |
| ---------- | --------------------- | ---------------------------------------------------------------------------- |
| `*`        | `BNE *`               | Impostare il trasporto con `SEC` prima dell'uso nella maggior parte dei casi |
| `SBC`      | Sottrarre con riporto | Imposta il riporto con `SEC` prima della sottrazione                         |
| `INC`      | Memoria incrementale  | —                                                                            |
| `DICEMBRE` | Decrementa la memoria | —                                                                            |
| `CMP`      | Confronta con A       | Imposta i flag; non modifica A                                               |

**PC vs. moltiplicazione.** `*` viene trattato come contatore di programma solo
quando si trova in *posizione valore* — all'inizio dell'espressione, o subito
dopo un operatore, `(`, `,`, `&lt;`, `&gt;` o uno spazio bianco. Un `*` che
segue un numero, `)` o un identificatore è una moltiplicazione ordinaria, quindi
`tabella LDA*2` e `CONST_A*4` rimangono invariati.

**Dove funziona.** Qualsiasi operando che accetti già un'espressione:
destinazioni di salto, `JMP` / `JSR`, `LDA`/`STA`/… assoluti e indicizzati,
operatori immediati di byte bassi/alti e l'espressione `.assert`. `*` non
modifica mai la dimensione di un'istruzione, quindi è sicuro in ogni modalità di
indirizzamento.

### Logica

*(Novità nella versione 2.3.9.)* Un'etichetta il cui nome inizia con un punto —
`.loop`, `.skip`, `.done` — è un'etichetta **locale**. Appartiene all'ambito
dell'etichetta **globale** (non puntata) più vicina precedente e internamente
diventa `<globale>.<nome>`. Due etichette locali con lo stesso nome breve sotto
etichette globali diverse non **entrano in conflitto.

```
DrawSprite:

LDX #0
.loop: ; == DrawSprite.loop
LDA SpriteData,X

STA $2000,X

INX
CPX #63
BNE .loop ; si risolve all'interno di DrawSprite
RTS

ClearScreen:

LDX #0
.loop: ; == ClearScreen.loop — nessun conflitto

STA $0400,X

INX
BNE .loop
RTS
```

- All'interno di un ambito, si fa riferimento a un'etichetta locale come
  `.nome`.
- Da un altro ambito, fai riferimento ad esso esplicitamente come `Global.name`
  (ad esempio `JMP ClearScreen.loop`).
- Un `.name` scritto prima di qualsiasi etichetta globale rimane un semplice
  `.name` di livello superiore.
- Le etichette locali passano invariate attraverso la modalità Blocco ⇄ Esperto;
  il prefisso `<globale>.` è un dettaglio in fase di layout e non viene mai
  memorizzato nel programma a blocchi.

### Salti e rami

*(Novità nella versione 2.3.9.)* Anteporre `label:` all'operando di
un'istruzione per posizionare un'etichetta sul **byte dell'operando** anziché
sull'opcode. L'istruzione viene assemblata da ciò che segue i due punti.

```
Configurazione:
Valore LDA: #$00; 'valore' -&gt; indirizzo del byte operando #$00

... Patch:
LDA #new
Valore STA; scrive direttamente il byte operando — SMC classico
```

`value` punta a `<indirizzo dell'istruzione> + 1` (il primo byte dell'operando),
per ogni modalità di indirizzamento. Questo sostituisce il vecchio schema `STA
istruzione+1` / `istruzione: LDA #$00`. Il ciclo passa attraverso la modalità
Blocco ⇄ Esperto (il campo dell'operando mantiene il prefisso `etichetta:`).

---

## 9. Blocchi macro — Riferimento

### LABEL

| Mnemonico           | Descrizione                                            | Modalità                                                                    |
| ------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------- |
| Nome dell'etichetta | Identificatore utilizzato in `JMP`, `JSR`, `BNE`, ecc. | immediato, zeroPage, assoluto, assolutoX, assolutoY, indirettoX, indirettoY |
| `LDX`               | Carica il registro X                                   | immediato, zeroPage, zeroPageY, assoluto, assolutoY                         |
| `LDY`               | Caricare il registro Y                                 | immediato, zeroPage, assoluto, assolutoX                                    |
| `STA`               | Accumulatore di magazzino                              | zeroPage, assoluto, assolutoX, assolutoY, indirettoX, indirettoY            |
| `STX`               | Registrati al negozio X                                | zeroPage, zeroPageY, assoluto                                               |
| `STY`               | Registratore di cassa del negozio Y                    | zeroPage, assoluto                                                          |

### COMMENT

| Mnemonico  | Descrizione            | Note                                                                         |
| ---------- | ---------------------- | ---------------------------------------------------------------------------- |
| `ADC`      | Aggiungi con trasporto | Impostare il trasporto con `SEC` prima dell'uso nella maggior parte dei casi |
| `SBC`      | Sottrarre con riporto  | Imposta il riporto con `SEC` prima della sottrazione                         |
| `INC`      | Memoria incrementale   | —                                                                            |
| `DICEMBRE` | Decrementa la memoria  | —                                                                            |
| `CMP`      | Confronta con A        | Imposta i flag; non modifica A                                               |
| `CPX`      | Confronta con X        | —                                                                            |
| `CPY`      | Confronta con Y        | —                                                                            |

### BYTE

| Mnemonico | Descrizione                                                                   |
| --------- | ----------------------------------------------------------------------------- |
| Operando  | Valori di byte separati da virgole (ad esempio `$01, $02, $FF` o `1, 2, 255`) |
| `ORA`     | OR logico con accumulatore                                                    |
| `EOR`     | OR esclusivo con accumulatore                                                 |
| `BIT`     | Verifica i bit in memoria rispetto ad A (imposta i flag N, V, Z)              |

### WORD

| Mnemonico | Descrizione                                                      |
| --------- | ---------------------------------------------------------------- |
| Operando  | Valori a 16 bit separati da virgole (ad esempio `$0400, $C000`)  |
| `JSR`     | Salta alla subroutine (salva l'indirizzo di ritorno sullo stack) |
| `RTS`     | Ritorno dalla subroutine                                         |
| `RTI`     | Ritorno dall'interruzione                                        |
| `BNE`     | Salta se diverso da (Z=0)                                        |
| `BEQ`     | Salta se uguale (Z=1)                                            |
| `BCC`     | Salta se il riporto è azzerato (C=0)                             |
| `BCS`     | Salta se il set di riporto (C=1)                                 |
| `BMI`     | Salta se meno (N=1)                                              |
| `BPL`     | Salta se più (N=0)                                               |
| `BVC`     | Salta se l'overflow è a zero (V=0)                               |
| `BVS`     | Salta se è impostato l'overflow (V=1)                            |

#### LBNE / LBEQ / … (Rami lunghi)

*(Novità nella versione 2.3.9.)* La categoria di palette **diramazioni lunghe**
contiene otto pseudo-operazioni che si comportano come diramazioni condizionali
ma raggiungono **qualsiasi indirizzo**, non solo −128…+127. Ognuna di esse si
assembla in una diramazione invertita che salta un `JMP` di 3 byte — sempre **5
byte**:

```
LBEQ completato; assembla in: BNE *+3 ($D0 $03)

; JMP completato ($4C lo hi)
```

| Long op | Condizione                         | Emesso come               |
| ------- | ---------------------------------- | ------------------------- |
| `LBNE`  | diverso da (Z=0)                   | `BEQ *+3 / Obiettivo JMP` |
| `LBEQ`  | uguale (Z=1)                       | `BNE *+3 / JMP target`    |
| `LBCC`  | portare via (C=0)                  | `BCS *+3 / JMP target`    |
| `LBCS`  | set di riporto (C=1)               | `BCC *+3 / JMP target`    |
| `LBMI`  | meno (N=1)                         | `BPL *+3 / JMP target`    |
| `LBPL`  | più (N=0)                          | `BMI *+3 / Obiettivo JMP` |
| `LBVC`  | svuotamento del sovraccarico (V=0) | `BVS *+3 / JMP target`    |
| `LBVS`  | set di overflow (V=1)              | `BVC *+3 / JMP target`    |

- Operando: un'etichetta, un'espressione `*` o un indirizzo letterale, come per
  un normale obiettivo di salto.
- Costo: 5 byte e 1 ciclo aggiuntivo sul percorso scelto rispetto a un salto
  breve. Non c'è promozione automatica di un salto breve: si sceglie `LBxx`
  esplicitamente.
- Quando un salto semplice (`BNE`, `BEQ`, …) è fuori intervallo, l'errore del
  compilatore ora specifica l'esatto overshoot e suggerisce il corrispondente
  `LBxx`.

### FILL

| Mnemonico | Descrizione                                                  |
| --------- | ------------------------------------------------------------ |
| Operando  | `count,value` — ad esempio `256,0` riempie 256 byte con zero |
| `TAY`     | Trasferimento A → Y                                          |
| `TXA`     | Trasferimento X → A                                          |
| `TYA`     | Trasferimento Y → A                                          |
| `TSX`     | Puntatore dello stack di trasferimento → X                   |
| `TXS`     | Trasferimento X → Puntatore dello stack                      |
| `INX`     | Incremento X                                                 |
| `DEX`     | Decrementare X                                               |
| `INY`     | Incremento Y                                                 |
| `DEY`     | Decrementare Y                                               |

### ALIGN

| Mnemonico | Descrizione                                                                                  |
| --------- | -------------------------------------------------------------------------------------------- |
| Confine   | Valore di allineamento — ad esempio `64` (contorno sprite), `256` (pagina), `$2000` (bitmap) |
| `LSR`     | Spostamento logico a destra                                                                  |
| `ROL`     | Ruotare a sinistra attraverso il trasporto                                                   |
| `ROR`     | Ruotare a destra attraverso il trasporto                                                     |

### TEXT

| Mnemonico               | Descrizione                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| Testo                   | La stringa da visualizzare                                           |
| X                       | Colonna (0–39)                                                       |
| Y                       | Riga (0–24)                                                          |
| Etichetta (facoltativa) | Assegna un'etichetta che punta all'indirizzo dello schermo calcolato |

### STRING

| Mnemonico               | Descrizione                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| Testo                   | La stringa da scrivere                                                                                     |
| Indirizzo               | Indirizzo di memoria di destinazione — `$C000` esadecimale o un **nome dell'etichetta**                    |
| Etichetta (facoltativa) | Assegna un'etichetta che punta all'indirizzo di destinazione                                               |
| Spostare                | Valore esadecimale (00–FF) aggiunto a ciascun byte del codice schermo (ad esempio `$80` = video invertito) |
| caratteri minuscoli     | Casella di controllo — stessa semantica di TESTO (vedi sezione TESTO)                                      |
| `SED`                   | Imposta la modalità decimale                                                                               |
| `SEI`                   | Imposta Interruzione disabilitata                                                                          |
| `NOP`                   | Nessuna operazione                                                                                         |
| `BRK`                   | Interruzione forzata / interruzione software                                                               |

### DATA

Come un ciclo **POKE** — scrive un elenco di byte grezzi in un indirizzo di
memoria in fase di esecuzione, una coppia LDA/STA per byte.

**Sintassi esperta:**

---

## 10. Integrazione del debugger

L'app supporta **RetroDebugger** come debugger esterno per C64. Riceve
breakpoint, simboli e flag di avvio automatico generati dal programma
assemblato.

---

### RetroDebugger

[RetroDebugger]{1} è un debugger multipiattaforma per Commodore 64 con supporto
per breakpoint, ispezione della memoria e disassemblaggio con riconoscimento
delle etichette.

| Campo               | Descrizione                                            |
| ------------------- | ------------------------------------------------------ |
| Nome dell'etichetta | Identificatore utilizzato in `JMP`, `JSR`, `BNE`, ecc. |

**Sintassi esperta:**
```
ciclo continuo:
```

**Assembly generato:**
```
ciclo: ; $0820
```

L'indirizzo corrente viene mostrato come commento. Le etichette hanno una
dimensione di **0 byte**.

---

### Blocchi di interruzione

Fai clic sull'icona del punto di interruzione (●) su un blocco di istruzioni
qualsiasi per attivarlo come punto di interruzione. I blocchi con punto di
interruzione vengono evidenziati in rosso. I loro indirizzi vengono scritti nel
file dei punti di interruzione ad ogni avvio del debugger.

**Sintassi esperta:**
```
Il tuo commento qui
```

**Assembly generato:**
```
Il tuo commento qui
```

---

### Flag di debug (scheda Opzioni)

Come **DATA in BASIC** — memorizza un elenco di valori di byte grezzi in linea
nel programma.

| Campo    | Descrizione    |
| -------- | -------------- |
| Operando | `-salta $ADDR` |

**Sintassi esperta:**
```
.byte $01, $02, $FF
```

**Assembly generato:**
```
.byte $01, $02, $FF
```

** Riferimenti all'etichetta del byte basso/alto: ** BYTE accetta token
`<etichetta` (byte basso) e `>etichetta` (byte alto) in stile KickAssembler /
ca65 insieme a valori numerici. L'assembler risolve l'indirizzo dell'etichetta
in fase di compilazione e inserisce il byte appropriato. Esempio:

```
.byte <frame_0, >frame_0, <frame_1, >frame_1
```

Questo memorizza il byte basso dell'indirizzo di `frame_0`, poi il byte alto, e
poi lo stesso per `frame_1`. Utile per costruire tabelle di salto ed elenchi di
indirizzi.

**Dimensione:** Numero di byte nell'elenco.

---

### PAROLA

Come **DATA in BASIC ma per numeri a 16 bit **. Ogni valore è memorizzato come
due byte (prima il byte meno significativo, poi il byte più significativo -
ordine little-endian 6502).

| Campo    | Descrizione                                                     |
| -------- | --------------------------------------------------------------- |
| Operando | Valori a 16 bit separati da virgole (ad esempio `$0400, $C000`) |

**Sintassi esperta:**
```
.word $0400, $C000
```

**Assembly generato:**
```
.word $0400, $C000
```

**Dimensione:** 2 byte per parola.

---

### RIEMPIRE

Come `FOR I=1 TO N : POKE addr+I, val : NEXT` — riempie un blocco di memoria con
lo stesso byte, ma in un unico blocco. Ottimo per liberare aree o pre-riempire
tabelle.

| Campo    | Descrizione                                                  |
| -------- | ------------------------------------------------------------ |
| Operando | `count,value` — ad esempio `256,0` riempie 256 byte con zero |

**Sintassi esperta:**
```
.riempi 256, $00
```

**Assembly generato:**
```
.riempi 256, $00
```

Sintassi dell'espressione: **Sia **count` che `value` accettano espressioni
aritmetiche. È possibile fare riferimento a nomi CONST, utilizzare letterali
esadecimali/binari e chiamare funzioni matematiche integrate:

| Espressione                       | Senso                                                   |
| --------------------------------- | ------------------------------------------------------- |
| `NUMERO_TESSERE, $00`             | conteggio da una COSTANTE, valore letterale esadecimale |
| `40*25, 0`                        | moltiplicazione in linea                                |
| `arrotondato(sin(PI/4)*255), $80` | trigonometria                                           |

**Funzioni integrate:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, costante `PI`

Operatori: `+ - * /` Letterali: `$FF` (esadecimale), `%10110000` (binario) Byte
basso/alto: `lo(expr)`, `hi(expr)`

**Dimensione:** Il valore del conteggio in byte.

---

### ALLINEARE

Sposta l'indirizzo corrente in avanti fino al successivo limite pulito inserendo
byte di riempimento con zeri. Il C64 richiede che i dati degli sprite inizino su
un limite di 64 byte: `ALIGN 64` lo gestisce automaticamente.

| Campo   | Descrizione                                                                                  |
| ------- | -------------------------------------------------------------------------------------------- |
| Confine | Valore di allineamento — ad esempio `64` (contorno sprite), `256` (pagina), `$2000` (bitmap) |

**Sintassi esperta:**
```
.align 64
.align $2000
```

**Assembly generato:**
```
; ALLINEA 64 → $0840 (12 byte di riempimento)
```

**Dimensione:** Dinamica — dipende dalla posizione corrente del contatore di
programma.

> **Suggerimento:** Utilizzare `ALIGN 64` prima dei dati degli sprite, `ALIGN
> 256` per garantire tabelle allineate alla pagina.

---

### TESTO

Come **PRINT AT** — scrive il testo direttamente sullo schermo del C64 in una
data colonna e riga, senza usare il KERNAL. Genera una coppia LDA/STA per
carattere, indirizzando la RAM dello schermo a `$0400`.

| Campo                   | Descrizione                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| Testo                   | La stringa da visualizzare                                           |
| X                       | Colonna (0–39)                                                       |
| Y                       | Riga (0–24)                                                          |
| Etichetta (facoltativa) | Assegna un'etichetta che punta all'indirizzo dello schermo calcolato |
| caratteri minuscoli     | Casella di controllo — vedi sotto                                    |

**Modalità di set di caratteri:**

Il C64 offre due set di caratteri selezionabili in fase di esecuzione:

| Modalità                                         | $D018 bit 1 | Input in maiuscolo                 | Input in minuscolo              |
| ------------------------------------------------ | ----------- | ---------------------------------- | ------------------------------- |
| **Maiuscole/grafica** (predefinito)              | 0           | `A`–`Z` → codici schermo $01–$1A ✓ | trattato anche come maiuscolo   |
| **Minuscolo/maiuscolo** (dopo CHARSET minuscolo) | 1           | `A`–`Z` → $01–$1A (maiuscolo)      | `a`–`z` → $41–$5A (minuscolo) ✓ |

- **Set di caratteri maiuscoli (predefinito, casella di controllo
  deselezionata):** Digita ciò che vuoi vedere in maiuscolo. `"CIAO"` viene
  visualizzato come `CIAO`. L'input minuscolo viene mappato ai codici schermo
  maiuscoli.
- **Set di caratteri minuscoli (casella di controllo selezionata):** Digitare
  esattamente il formato che si desidera visualizzare. `"hello"` →
  visualizzazione in minuscolo, `"HELLO"` → visualizzazione in maiuscolo.
  Richiede un cambio di set di caratteri in fase di esecuzione prima che venga
  visualizzata la schermata (utilizzare la macro **CHARSET lower**.

**ASM generato (modalità maiuscola, `"CIAO"`):**
```
LDA #$08; codice schermo 'H' $08

STA $0400

LDA #$05; codice schermo 'E' $05

STA $0401

...
```

**Sintassi esperta:**
```
.text 0, 2, "HELLO" ; set di caratteri maiuscoli (predefinito)
.text 0, 2, "hello", lower ; set di caratteri minuscoli
```

I caratteri sono codificati come **codici schermo** (non PETSCII).
**Dimensione:** `lunghezza testo × 5` byte (LDA + STA per carattere).

---

### CORDA

Come **inserire una stringa ** in qualsiasi indirizzo di memoria durante
l'esecuzione. Genera coppie LDA/STA che copiano il codice schermo di ciascun
carattere in indirizzi consecutivi.

| Campo                   | Descrizione                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| Testo                   | La stringa da scrivere                                                                                     |
| Indirizzo               | Indirizzo di memoria di destinazione — `$C000` esadecimale o un **nome dell'etichetta**                    |
| Etichetta (facoltativa) | Assegna un'etichetta che punta all'indirizzo di destinazione                                               |
| Spostare                | Valore esadecimale (00–FF) aggiunto a ciascun byte del codice schermo (ad esempio `$80` = video invertito) |
| caratteri minuscoli     | Casella di controllo — stessa semantica di TESTO (vedi sezione TESTO)                                      |

**Sintassi esperta:**
```
.string $C000, "HELLO" ; set di caratteri maiuscoli (predefinito)
.string $C000, "hello", lower ; set di caratteri minuscoli
.string $C000, "HELLO", 80 ; con shift (video inverso)
.string $C000, "hello", 80, lower ; shift + minuscolo
.string $C000, "HELLO" :my_string ; con macroLabel
```

**Assembly generato:**
```
LDA #$08; codice schermo 'H'

STA $C000

LDA #$05; codice schermo 'E'

STA $C001

...
```

I caratteri sono codificati come **codici schermo** (non PETSCII). Il valore
opzionale **Shift** viene aggiunto a ogni byte, ad esempio `$80` per il video
inverso. **Dimensione:** `lunghezza testo × 5` byte (un LDA + un STA per
carattere).

---

### DATI

Come un ciclo **POKE** — scrive un elenco di byte grezzi in un indirizzo di
memoria in fase di esecuzione, una coppia LDA/STA per byte.

| Campo                   | Descrizione                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| Byte                    | Valori di byte separati da virgole                                                      |
| Indirizzo               | Indirizzo di memoria di destinazione — `$C000` esadecimale o un **nome dell'etichetta** |
| Etichetta (facoltativa) | Assegna un'etichetta che punta all'indirizzo di destinazione                            |

**Sintassi esperta:**
```
.data $C000, $01, $02, $03 ; indirizzo esadecimale
.data my_buf, $01, $02, $03 ; indirizzo dell'etichetta
.data $C000, $01, $02, $03 :mydata ; con macroLabel
```

**Assembly generato:**
```
LDA #$01
    STA$C000
    LDA #$02
    STA$C001
    ...
```

**Dimensione:** `numero_byte × 5` byte (un LDA + un STA per byte).

---

### RAWBYTES

Come **DATI che vengono caricati direttamente in memoria** — nessun codice in
fase di esecuzione. I byte sono presenti dal momento in cui il PRG viene
caricato, prima ancora che il tuo codice inizi. Usalo per i dati degli sprite,
le mappe dei livelli, le tabelle di ricerca, qualsiasi cosa che debba
semplicemente trovarsi a un indirizzo specifico.

| Campo                   | Descrizione                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| Byte                    | Valori di byte separati da virgole                                                      |
| Indirizzo               | Indirizzo di memoria di destinazione — `$C000` esadecimale o un **nome dell'etichetta** |
| Etichetta (facoltativa) | Assegna un'etichetta che punta all'indirizzo di destinazione                            |

**Sintassi esperta:**
```
.rawbytes $C000, $00, $00, $00 ; indirizzo esadecimale
.rawbytes sprite_data, $00, $00 ; indirizzo dell'etichetta
.rawbytes $0C50, $00, $00 :nev ; con macroLabel — altro codice può usare LDA nev,X
```

**Dimensione in codice:** 0 byte. I dati vengono posizionati all'indirizzo
specificato nell'output.

> **DATA vs RAWBYTES:** DATA genera codice LDA/STA che copia i byte in fase di
> esecuzione (più lento, ma funziona se i dati devono essere dinamici). RAWBYTES
> inserisce semplicemente i byte direttamente: nessun codice, istantaneo, costo
> zero.

---

### TESTO NON RAW

Come RAWBYTES ma per il testo: codifica la stringa come codici schermo e
posiziona i byte a un indirizzo fisso senza **codice runtime**. Il testo è
pronto in memoria nell'istante in cui il PRG viene caricato.

| Campo                   | Descrizione                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| Testo                   | Stringa da codificare                                                                                      |
| Indirizzo               | Indirizzo di memoria di destinazione — `$C000` esadecimale o un **nome dell'etichetta**                    |
| Etichetta (facoltativa) | Assegna un'etichetta che punta all'indirizzo di destinazione                                               |
| Spostare                | Valore esadecimale (00–FF) aggiunto a ciascun byte del codice schermo (ad esempio `$80` = video invertito) |
| caratteri minuscoli     | Casella di controllo — stessa semantica di TESTO (vedi sezione TESTO)                                      |

**Sintassi esperta:**
```
.rawtext $C000, "HELLO" ; set di caratteri maiuscoli (predefinito)
.rawtext $C000, "hello", lower ; set di caratteri minuscoli
.rawtext $C000, "HELLO", 80 ; con shift (video inverso)
.rawtext $C000, "hello", 80, lower ; shift + minuscolo
.rawtext $0400, "HELLO" :my_text ; con macroLabel
```

**Assembly generato:**
```
; .rawtext "HELLO" -&gt; $C000
; $C000

.byte $08, $05, $0C, $0C, $0F ; H E L L O (codici di visualizzazione maiuscoli)

; .rawtext "hello", minuscolo -&gt; $C000
; $C000

.byte $48, $45, $4C, $4C, $4F ; h e l l o (codici di visualizzazione minuscoli nell'intervallo $41–$5A)
```

**Dimensione in codice:** 0 byte. I dati vengono posizionati all'indirizzo
specificato nell'output.

> **STRING vs RAWTEXT:** STRING genera codice LDA/STA che copia il testo in fase
> di esecuzione. RAWTEXT inserisce i byte nel PRG al momento del caricamento:
> nessun codice, nessuna attesa.

---

### PETSCII

Come **RAWBYTES ma per l'output KERNAL** — codifica la stringa come byte PETSCII
(compatibile con CHROUT a `$FFD2`) e li posiziona a un indirizzo fisso senza
codice runtime. Usalo quando vuoi stampare caratteri tramite `JSR $FFD2` in un
ciclo e nota che la nuova macro `PRINT` utilizza lo stesso codificatore e lo
stesso comportamento della casella di controllo minuscolo.

> **Codici PETSCII vs codici schermo:** PETSCII e codici schermo sono due
> codifiche diverse. Codice schermo `$01` = lettera A; PETSCII `$41` = lettera A
> (tramite CHROUT). Utilizzare PETSCII solo quando si stampa tramite il KERNAL;
> utilizzare TEXT/STRING/RAWTEXT per scrivere direttamente nella RAM dello
> schermo.

| Campo                   | Descrizione                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| Testo                   | Stringa da codificare come byte PETSCII                                                 |
| Indirizzo               | Indirizzo di memoria di destinazione — `$C000` esadecimale o un **nome dell'etichetta** |
| Etichetta (facoltativa) | Assegna un'etichetta che punta all'indirizzo di destinazione                            |
| PETSCII minuscolo       | Casella di controllo — vedi sotto                                                       |

**Modalità di set di caratteri:**

| Modalità                                     | Input in maiuscolo (`A`–`Z`)                                                                                                         | Input in minuscolo (`a`–`z`) |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| **Maiuscolo (predefinito, non selezionato)** | `$41`–`$5A` (PETSCII maiuscolo tramite CHROUT)                                                                                       | mappato anche a `$41`–`$5A`  |
| **Minuscolo (selezionato)**                  | Le lettere dell'alfabeto vengono rimappate in modo che la visualizzazione rimanga coerente nel set di caratteri minuscolo/maiuscolo. | Stessa regola                |

**Sintassi esperta:**
```
.petscii $C000, "HELLO" ; PETSCII maiuscolo (predefinito)
.petscii $C000, "hello", lower ; PETSCII minuscolo ($61–$7A)
.petscii $C000, "HELLO", null ; con terminatore nullo
.petscii $C000, "hello", lower, null ; minuscolo + terminatore nullo
.petscii $C000, "HELLO" :my_msg ; con macroLabel
```

**Byte generati (maiuscolo, `"CIAO"`):**
```
; $C000

.byte $48, $45, $4C, $4C, $4F ; H E L L O (intervallo PETSCII $41–$5A)
```

**Dimensione in codice:** 0 byte. I dati vengono posizionati all'indirizzo di
destinazione come sezione dati differita (come RAWBYTES).

** Terminatore nullo:** Seleziona la casella di controllo *"Aggiungi `$00`
(terminatore nullo)"* per aggiungere automaticamente un byte `$00` dopo il
testo. Ideale per cicli terminati da null:

```
LDX #$00
ciclo:
LDA msg,X
BEQ completato; $00 interrompe il ciclo
JSR $FFD2
INX
BNE ciclo
completato:
RTS
```

**Regole di codifica:**

| Ingresso                              | Modalità maiuscolo              | Modalità minuscolo |
| ------------------------------------- | ------------------------------- | ------------------ |
| `A`–`Z`                               | `$41`–`$5A`                     | `$61`–`$7A`        |
| `a`–`z`                               | `$41`–`$5A` (maiuscolo forzato) | `$41`–`$5A`        |
| Spazio, cifre, punteggiatura (32–126) | così com'è                      | così com'è         |
| Nuova linea                           | `$0D` (INVIO)                   | `$0D`              |
| Altro                                 | `$20` (spazio)                  | `$20`              |

> **Suggerimento:** Utilizzare PETSCII per i dati che verranno visualizzati
> tramite CHROUT (`$FFD2`). Per scrivere direttamente nella RAM dello schermo,
> utilizzare invece STRING o RAWTEXT.

---

### SET DI CARATTERI

Commuta la ROM dei caratteri del VIC-II tra la modalità maiuscolo/grafica
(impostazione predefinita del C64) e la modalità minuscolo/maiuscolo,
modificando il bit 1 di `$D018` in fase di esecuzione.

| Campo    | Descrizione                                                                                                                                   |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Modalità | **Minuscolo** — abilita il set di caratteri minuscolo/maiuscolo; **Maiuscolo** — ripristina il set di caratteri predefinito maiuscolo/grafico |

**Sintassi esperta:**
```
.charset lower ; passa al set di caratteri minuscolo
.charset upper ; torna al set di caratteri maiuscolo/grafico
```

**Assembly generato:**

Modalità minuscolo:
```
LDA $D018

ORA #$02; imposta il bit 1 → ROM minuscolo/maiuscolo a $1800

STA $D018
```

Modalità maiuscole:
```
LDA $D018

E #$FD ; azzera il bit 1 → ROM maiuscole/grafiche a $1000

STA $D018
```

**Dimensione:** 8 byte (LDA abs + ORA/AND imm + STA abs).

**Perché ORA/AND invece di una scrittura diretta?** `$D018` controlla anche la
posizione della RAM dello schermo (bit 7–4). L'inversione del solo bit 1
preserva il resto del registro.

**Flusso di lavoro tipico:**

```
CHARSET lower ; passa al set di caratteri minuscolo
TEXT 0, 0, "hello world" ; [casella di controllo: Set di caratteri minuscolo]

...
CHARSET upper ; ripristina le impostazioni predefinite al termine
```

Oppure in modalità esperto:
```
.charset minuscolo
.testo 0, 0, "ciao mondo", minuscolo
.charset maiuscolo
```

In modalità Esperto, il blocco `.charset` ora passa anche attraverso il menu a
tendina della modalità, in modo che l'anteprima del blocco e il codice sorgente
esportato rimangano allineati.

> **Nota:** La macro CHARSET modifica solo il puntatore alla ROM dei caratteri
> VIC. Non chiama `$E544` (inizializzazione del charset del KERNAL). Nella
> maggior parte dei casi questo è sufficiente; chiama `JSR $E544` prima solo se
> hai bisogno che le routine di stampa del KERNAL rispettino la modifica.

---

### CHARDEF

Definisce un singolo carattere personalizzato 8×8 in un set di caratteri basato
su RAM. Emette codice runtime inline che copia 8 byte in `base + indice * 8` in
fase di esecuzione, senza bisogno di un'etichetta precedente o di `ORG`.

| Campo                | Descrizione                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Charset base         | Indirizzo base del set di caratteri RAM (predefinito `$3800`). Deve essere allineato in modo che il VIC-II possa vederlo (vedi sotto). |
| Indice dei caratteri | Quale slot carattere ridefinire, 0–255. `65` = 'A' nel layout predefinito del codice schermo.                                          |
| 8 byte               | Righe di bitmap separate da virgole, dall'alto verso il basso. Il bit 7 di ciascun byte corrisponde al pixel più a sinistra.           |

**Sintassi esperta:**
```
.chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00
```

**ASM generato (8 × `LDA #b` / `STA target+n`, 40 byte totali):**
```
LDA #$18
    ST$3A08
    LDA #$3C
    ST$3A09
    LDA #$66
    STA $ 3A0A
    LDA #$7E
    STA $ 3A0B
    LDA #$66
    STA$3A0C
    LDA #$66
    STA $ 3A0D
    LDA #$66
    STA$3A0E
    LDA #$00
    STA $ 3A0F
```

**Indirizzo di destinazione:** `$3800 + 65 * 8 = $3A08`. Calcolato in fase di
compilazione e codificato direttamente negli operandi STA.

**Dimensione:** 40 byte per carattere (8 × 5).

**Flusso di lavoro tipico:**
```
; Punto VIC-II nel charset RAM a $3800

LDA $D018

AND #$F1

ORA #$0E ; bit 3-1 = %111 → charset al banco +$3800

STA $D018

CHARDEF $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00 ; ridefinisci 'A'
CHARDEF $3800, 66, $7C,$66,$66,$7C,$66,$66,$7C,$00 ; ridefinisci 'B'

; ... altre chiamate CHARDEF per ogni char personalizzato
```

**Quando utilizzare CHARDEF rispetto alle alternative:**

| Approccio                        | Utilizzare quando                                                                                                                |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **CHARDEF**                      | Sono necessari alcuni caratteri personalizzati (ad esempio da 1 a 20). Ciascuno ha un costo di 40 byte in fase di esecuzione.    |
| **RAWBYTES a $3800**             | Hai a disposizione un set di caratteri personalizzato completo (256 caratteri). Totale di 2 KB di dati, nessuna copia a runtime. |
| **INCBIN "charset.bin" a $3800** | File di set di caratteri esterno (creato dall'Editor di caratteri). L'opzione più pulita.                                        |
| **Tela Charset + INCBIN**        | Bitmap completa di 256 caratteri visualizzata come un'unica immagine 128×128.                                                    |

> **Promemoria di allineamento:** VIC-II prevede che la base del charset sia un
> multiplo di `$0800`. Banchi validi: `$0000`, `$0800`, `$1000`, ... , `$3800`
> (all'interno dell'attuale banco VIC da 16 KB). I charset RAM risiedono
> tipicamente a `$2000`, `$2800`, `$3000` o `$3800`.

---

### BOX_HIT

Test di collisione Axis-aligned bounding box (AABB) tra due rettangoli descritti
da strutture a pagina zero di 4 byte. Restituisce il risultato
nell'accumulatore: **A = 1** in caso di sovrapposizione, **A = 0** altrimenti.
Assemblaggio inline puro, nessuna chiamata a subroutine.

| Campo                           | Descrizione                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------ |
| Casella postale 1, indirizzo ZP | Base della pagina zero della struttura a 4 byte della prima casella (predefinita `$FB`).   |
| Casella postale 2, indirizzo ZP | Base della pagina zero della struttura a 4 byte della seconda casella (predefinita `$F7`). |

** Layout della struttura** (4 byte per riquadro, coordinate a 8 bit senza
segno):

| Offset | Campo             |
| ------ | ----------------- |
| `+0`   | Sinistra          |
| `+1`   | Superiore         |
| `+2`   | Giusto            |
| `+3`   | Metter il fondo a |

**Sintassi esperta:**
```
.box_hit $FB, $F7
```

**ASM generato (30 byte, completamente relativo al PC - nessuna subroutine,
nessun salto assoluto):**
```
LDA $FD ; b1 destra
CMP $F7 ; b2 sinistra
BCC no ; R1 &lt; L2 → mancata corrispondenza
LDA $F9 ; b2 destra
CMP $FB ; b1 sinistra
BCC no
LDA $FE ; b1 in basso
CMP $F8 ; b2 in alto
BCC no
LDA $FA ; b2 in basso
CMP $FC ; b1 in alto
BCC no
LDA #$01 ; successo
BNE completato ; incondizionato (A ≠ 0)
no: LDA #$00
completato:
```

**Dimensione:** 30 byte.

**Flusso di lavoro tipico:**

```
; Box dello sprite del giocatore in $FB..$FE
LDA sprite_x ; L
STA $FB
LDA sprite_y ; T
STA $FC
CLC
ADC #23 ; +23 → B (sprite alto 24 pixel)

STA $FE
LDA $FB
CLC
ADC #23 ; R
STA $FD

; Box del nemico in $F7..$FA (popolato in modo simile)
; ...

BOX_HIT $FB, $F7 ; test giocatore contro nemico → A = 0 o 1

CMP #$01
BNE no_collision
JSR handle_hit
no_collision:
```

**Vincoli:**
- Entrambi gli indirizzi di pagina zero devono essere `≤ $FC` (ogni box
  necessita di 4 byte consecutivi: `zp`, `zp+1`, `zp+2`, `zp+3`).
- Le coordinate vengono trattate come **8 bit senza segno ** (0–255). Per le
  coordinate sprite con segno al di fuori di questo intervallo, normalizzare
  prima di memorizzare.
- I due riquadri possono sovrapporsi nello spazio ZP, se lo si desidera, ma in
  genere si preferiscono 8 byte distinti.

**Perché non una subroutine?** La generazione inline evita l'overhead JSR/RTS
(14+ cicli) e mantiene il test attivo nella cache per cicli di gioco stretti. Se
devi testare molte coppie, inserisci manualmente la tua `sub box_hit_jSR`
attorno a un singolo blocco BOX_HIT.

**Confronto con la funzione `box_hit()` di UB:** Ultimate Basic incapsula la
stessa logica del 6502 come una funzione runtime che restituisce una variabile.
In VA, si posiziona BOX_HIT in linea dove è necessario il test; il risultato è
in `A`.

---

### INCBIN

Come **BLOAD in BASIC** — preleva un file binario esterno (`.bin`, `.prg`,
`.sid`, `.raw`) e lo incorpora direttamente nel PRG assemblato all'indirizzo
specificato.

| Campo     | Descrizione                                                     |
| --------- | --------------------------------------------------------------- |
| File      | Sfoglia per selezionare un file `.bin`, `.prg`, `.sid` o `.raw` |
| Indirizzo | Indirizzo di caricamento di destinazione (ad esempio `$C000`)   |

**Sintassi esperta:**
```
.incbin "music.bin", $C000
```

**Commento ASM generato:**
```
; INCBIN "music.bin" @ $C000 (2048 byte)

.byte $01, $02, ...
```

**Dimensione nel codice:** 0 byte (sezione dati differiti). Il binario è
incorporato all'indirizzo specificato.

---

### KOALA

Carica un'immagine **Koala Painter** (`.koa` / `.kla`, 160×200 multicolore) e la
visualizza. I dati dell'immagine sono incorporati in un indirizzo fisso come
`INCBIN` (l'indirizzo di caricamento del file di 2 byte `$6000` viene rimosso) e
il blocco stesso viene compilato in una routine di visualizzazione di 86 byte
che viene eseguita dove si trova il blocco.

| Campo     | Descrizione                                                                                                                          |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| File      | Sfoglia per selezionare un file `.koa` / `.kla` (10003 byte, o 10001 senza indirizzo di caricamento)                                 |
| Indirizzo | Indirizzo bitmap: `$6000` (predefinito, nativo Koala, VIC banco 1, RAM schermo `$4400`) o `$2000` (VIC banco 0, RAM schermo `$0400`) |

La routine di visualizzazione copia la parte RAM dello schermo sullo schermo e
la parte RAM del colore in `$D800`, scrive il byte di sfondo in `$D021`,
seleziona il banco VIC in `$DD00` (mantenendo gli altri bit della porta) e
attiva la modalità bitmap multicolore (`$D011 = $3B`, `$D016 = $18`, `$D018 =
$18`). Altri indirizzi vengono rifiutati: gli slot 8K rimanenti si trovano sotto
la ROM BASIC/KERNAL (il ciclo di copia leggerebbe la ROM) o si sovrappongono
all'ombra della ROM dei caratteri.

**Sintassi esperta:**
```
.koala "immagine.koa"
.koala "picture.koa", $ 2000
```

**Esempio: mostra un'immagine e attendi:**
```
* = $0801
.koala "immagine.koa"
attendi:
Attendi JMP
```

**Dimensione nel codice:** 86 byte (routine di visualizzazione); i 10001 byte di
dati dell'immagine vanno all'indirizzo specificato. L'editor Hires **File →
Esporta Koala (.koa)…** produce un file compatibile.

---

### LIVELLO / LIVELLO_RIGA

Inserisce un progetto **Level Editor** nel tuo programma e copia le righe del
livello in un buffer dello schermo: i blocchi di costruzione di un gioco a
scorrimento. Vedi `samples/level-demo.asm` per un livello completo a scorrimento
tramite joystick.

#### LIVELLO

Un blocco in stile INCBIN che emette **0 byte di codice**. Solo le schermate
**posizionate** del progetto dell'Editor di Livello (il `.bin` salvato con
**File → Salva livello**) vanno in memoria dall'indirizzo specificato
(predefinito `$2000`), in ordine di slot, 2000 byte per schermata (1000 codici
schermata + 1000 colori). Le schermate identiche vengono memorizzate una sola
volta e tutti gli slot vuoti condividono una schermata vuota. Le tabelle dei
puntatori seguono le schermate. Un livello può avere fino a 7 × 10 schermate.

**Sintassi esperta:**
```
.level "level.bin"
.level "level.bin", $4000
```

| Definizione                                                                   | Senso                                                                                                                                                                                  |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LIVELLO_SLOT_BASSO` / `LIVELLO_SLOT ALTO`                                    | Indirizzo dello schermo in ogni slot (per riga, `LEVEL_W` slot per riga)                                                                                                               |
| `LIVEL_ROW_SLOT`                                                              | Riga del personaggio di livello → primo slot della sua riga dello schermo                                                                                                              |
| `LIVELLO_RIGA_BASSO/ALTO`, `LIVELLO_RIGA_BASSO/ALTO`                          | Riga del carattere di livello → offset della sua riga di codice schermo / riga di colore all'interno di uno schermo                                                                    |
| `LEVEL_COL_SLOT`, `LEVEL_COL_OFS`                                             | Visualizza la colonna iniziale → colonna dello schermo e colonna all'interno dello schermo                                                                                             |
| `LIVELLO_O`, `LIVELLO_ALTO`                                                   | Livello di dimensione negli schermi                                                                                                                                                    |
| `LEVEL_COLS`, `LEVEL_ROWS`                                                    | Dimensione del livello in caratteri                                                                                                                                                    |
| `LIVELLO_MAX_X`, `LIVELLO_MAX_Y`                                              | Posizione di scorrimento massima in pixel di una vista 40×25                                                                                                                           |
| `LIVEL_BG`, `LIVEL_MC1`, `LIVEL_MC2`, `LIVEL_MULTICOLOR`                      | Sfondo / colori multicolore e modalità del livello                                                                                                                                     |
| `DATI_LIVELLO`, `DIMENSIONE_LIVELLO`, `FINE_LIVELLO`                          | Inizio, dimensione e primo indirizzo libero dopo i dati di livello                                                                                                                     |
| `LIVEL_OBJ_X_LO/HI`, `LIVEL_OBJ_Y_LO/HI`, `LIVEL_OBJ_TYPE`, `LIVEL_OBJ_PARAM` | Tabella degli oggetti (livello oggetti dell'editor di livello): posizione in pixel del livello, tipo e byte del parametro, in ordine di scorrimento — `LEVEL_OBJ_COUNT` voci (max 255) |
| `LEVEL_OBJ_T_START` … `LEVEL_OBJ_T_TRIGGER`                                   | Numeri dei tipi di oggetto: INIZIO 0, NEMICO 1, OGGETTO 2, PORTA 3, USCITA 4, GRILLETTO 5                                                                                              |
| `LIVELLO_INIZIO_X`, `LIVELLO_INIZIO_Y`                                        | Posizione del primo oggetto Start (definita solo se il livello ne possiede uno)                                                                                                        |
| `LEVEL_ATTR`, `LEVEL_ATTR_SOLID` … `LEVEL_ATTR_COLLECT`                       | Tabella degli attributi del personaggio (un byte flag per codice schermo; solo quando il livello ha attributi) e i suoi bit: 1, 2, 4, 8                                                |
| `LIVEL_BORDER`, `LIVEL_SCR_COLORS`, `LIVEL_SCR_BG/BORDER/MC1/MC2`             | Bordo del livello; tabelle dei colori per slot (per riga come `LEVEL_SLOT_*`) quando uno schermo ha i propri colori (`LEVEL_SCR_COLORS` = 1)                                           |

Guardia tipica: `.assert LEVEL_END &lt;= $9200, "i dati di livello vengono
eseguiti nel codice"`.

#### LIVELLO_RIGA

Copia una riga di 40 caratteri del livello in un buffer: la riga del livello in
**X**, a partire dalla colonna del livello contenuta nella variabile `col`, fino
all'indirizzo contenuto nel puntatore `dst` (`dst` / `dst+1`, basso/alto). Con
il terzo argomento `color` copia i colori invece dei codici schermo (per la RAM
dei colori). Una finestra di 40 caratteri che si estende su due schermi viene
gestita con un ciclo di copia auto-modificante (~14 cicli per byte). X viene
mantenuto, A e Y vengono distrutti. Richiede un blocco `.level` nel programma.

**Sintassi esperta:**
```
.level_row dst_lo, view_x
.level_row dst_lo, view_x, color
```

**Dimensione nel codice:** 132 byte — utilizzare `LBEQ` / `LBNE` quando un ramo
deve saltarlo.

---

### SID

Come **BLOAD per la musica** — carica un file `.sid` nel tuo PRG e legge
automaticamente i suoi indirizzi Init e Play dall'intestazione. Chiama Init una
volta all'avvio, quindi chiama Play dal tuo gestore IRQ a ogni frame.

| Campo                                  | Descrizione                                                                                                                                    |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| File                                   | Sfoglia per selezionare un file `.sid`                                                                                                         |
| Indirizzo personalizzato (facoltativo) | Sovrascrivi l'indirizzo di caricamento nativo del SID (ad esempio `$1000`). Lascia vuoto per utilizzare l'indirizzo dall'intestazione del SID. |

Il blocco mostra:
- **Titolo / Autore** dall'intestazione SID
- **Indirizzo di caricamento** — dove i dati vengono posizionati in memoria
  (indirizzo effettivo dopo qualsiasi sovrascrittura)
- **Indirizzo di inizializzazione** — chiama questo con JSR per inizializzare la
  musica (adattato per la rilocazione se viene utilizzato un indirizzo
  personalizzato)
- **Riproduci indirizzo** — chiama questo con JSR su ogni frame in un gestore
  IRQ (adattato per la rilocazione)
- Un badge **(ricollocato)** appare quando un indirizzo personalizzato sposta i
  dati dalla sua posizione originale

**Sintassi esperta:**
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", $1000
```

**Commento ASM generato:**
```
; SID "Ikari_Warriors.sid" @ $1000 Init:$1000 Riproduzione:$1006 (4096 byte)
```

**Dimensione nel codice:** 0 byte in linea. Il binario SID viene posizionato
all'indirizzo specificato come blocco differito nel PRG.

> **Importante:** La maggior parte dei file SID contiene indirizzi assoluti
> interni hardcoded. Possono essere riposizionati solo se l'intero binario viene
> spostato dello stesso offset. Se un SID ha salti interni a `$10xx`, deve
> rimanere a `$1000`: spostarlo a un indirizzo diverso interromperà tali
> riferimenti interni.

> **Utilizzo tipico:** Posizionare un blocco ORG prima del blocco SID per
> impostarne l'indirizzo. Chiamare Init una volta all'avvio, quindi chiamare
> Play ad ogni frame da un gestore IRQ raster.

---

### INCLUDERE

Come **MERGE in BASIC** — importa un altro file ed espande i suoi blocchi in
linea in questa posizione. Perfetto per librerie di subroutine riutilizzabili. I
blocchi inclusi sono di sola lettura nel progetto corrente.

Sono supportati due tipi di file:
- **Progetto Visual Assembler** (`.json`) — i blocchi del progetto vengono
  inseriti così come sono.
- **Codice sorgente assembly semplice** (`.inc`, `.asm`, `.s`) — il file viene
  letto come testo e analizzato nello stesso modo della modalità esperto. Ogni
  volta che compili, il file viene riletto dal disco (fonte di verità = il
  file), quindi puoi modificarlo esternamente con qualsiasi editor.

| Campo                                  | Descrizione                                                                                                                                                                                                                                                                                                                     |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File                                   | Sfoglia per selezionare un progetto `.json` o un codice sorgente assembly `.inc`/`.asm`/`.s`                                                                                                                                                                                                                                    |
| Indirizzo di caricamento (facoltativo) | Se impostato (esadecimale, ad esempio `C000`), i blocchi inclusi vengono posizionati a quell'indirizzo: un blocco sintetico `ORG` viene iniettato prima di essi, sovrascrivendo qualsiasi blocco ORG presente nel file incluso. Lasciare vuoto per consentire ai blocchi ORG del file incluso di controllare il posizionamento. |

**Sintassi in modalità esperto:**
```
.include "library.json"
.include "macros.inc", $1500
.include "sprites.asm"
```

- L'estensione del file ** è richiesta in modalità esperto**: un nome semplice
  come `.include "macros"` viene trattato come `.include "macros.json"`.
- Risoluzione del percorso: prima tenta di cercare vicino al file di progetto
  (relativo), poi ripiega sulla directory `samples/` inclusa nell'app.

**ASM generato (nessuna sovrascrittura dell'indirizzo):**
```
; .include "library.json" — 12 blocchi

... (seguono i blocchi espansi)
```

**ASM generato (con indirizzo di caricamento `C000`):**
```
; .include "library.json" @ $C000 — 12 blocchi

*=$C000

... (seguono i blocchi espansi)
```

> **Suggerimento:** Utilizzare INCLUDE per creare librerie di subroutine
> riutilizzabili che è possibile condividere tra progetti. I file
> `.inc`/`.asm`/`.s` sono ideali quando si desidera modificare la libreria in un
> editor di testo semplice o condividerla con altri assembler 6502; `.json`
> quando la libreria è stata creata direttamente in Visual Assembler. Impostare
> un indirizzo di caricamento quando la libreria non ha un proprio ORG o quando
> si desidera sovrascrivere il suo posizionamento predefinito.

---

### TAVOLO

Come **DIM a un indirizzo specifico** — specifica il nome di una tabella di
ricerca e la sua posizione in memoria. Posiziona blocchi BYTE, WORD o FILL dopo
di esso per definire il contenuto della tabella.

| Campo     | Descrizione                                                             |
| --------- | ----------------------------------------------------------------------- |
| Nome      | Identificatore dell'etichetta per la tabella (ad esempio `color_table`) |
| Indirizzo | Indirizzo fisso in cui inizia la tabella (ad esempio `$C000`)           |

**Sintassi esperta:**
```
.tabella tabella_colori, $C000
```

**Assembly generato:**
```
tabella_colori:
```

Il contatore di programma salta all'indirizzo specificato. Posizionare i blocchi
BYTE/WORD/FILL dopo TABLE per riempirli.

**Dimensione:** 0 byte.

---

### ORG

Imposta la posizione in memoria in cui viene inserito il programma (o una sua
sezione), come scegliere un indirizzo di inizio prima di digitare il codice
macchina. Ogni programma necessita di almeno un ORG. L'indirizzo di inizio
standard caricabile in BASIC per C64 è `$0801`.

| Campo                  | Descrizione                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Indirizzo              | Il nuovo indirizzo di origine (ad esempio `0801` in esadecimale o `2049` in decimale)       |
| ESADECIMALE / DECIMALE | Consente di alternare la visualizzazione dell'indirizzo tra formato esadecimale e decimale. |

**Sintassi esperta:**
```
* = $C000
```

**Assembly generato:**
```
* = $C000
```

**Dimensione:** 0 byte. Il blocco ORG stesso non genera codice macchina.

Ogni blocco ORG dà inizio a una nuova sezione. I blocchi successivi vengono
assemblati a partire da quell'indirizzo. Quando si esporta il file PRG, tutte le
sezioni vengono unite in un unico file e gli spazi tra le sezioni vengono
riempiti con zeri.

**Esempio — codice in `$0801`, tabella dati in `$C000`:**
```
* = $0801
LDX #$00
ciclo:

LDA $C000,X

STA $D800,X

INX
Ciclo BNE
RTS

* = $C000
.byte $01, $02, $03, ...
```

> **Suggerimento:** Ogni programma deve iniziare con un blocco ORG. L'indirizzo
> di inizio tipico per un programma caricabile in BASIC per C64 è `$0801` (2049
> decimale). Quando **BASIC SYS stub** è abilitato, l'assembler aggiunge una
> breve riga BASIC a `$0801` e il codice inizia a `$080D`.

---

### CICLO / SUCCESSIVO

Come **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** in BASIC — conta alla rovescia da
N a 1 usando il registro X o Y. Inserisci un blocco LOOP, inserisci le tue
istruzioni tra esso e NEXT e il ciclo verrà eseguito automaticamente per il
numero corretto di volte.

#### CICLO CONTINUO

| Campo     | Descrizione                                                                   |
| --------- | ----------------------------------------------------------------------------- |
| Registro  | `X` o `Y` — il registro del contatore                                         |
| Contare   | Numero di iterazioni del ciclo (esadecimale o decimale, ad esempio `0A` = 10) |
| Etichetta | Etichetta del ciclo generata automaticamente (ad esempio `loop0`)             |

**Sintassi esperta:**
```
.ciclo X, 10, ciclo0
```

**Assembly generato:**
```
LDX #$0A
loop0:
```

**Dimensione:** 2 byte (codice operativo LD_ + operando immediato).

#### PROSSIMO

| Campo     | Descrizione                                |
| --------- | ------------------------------------------ |
| Registro  | Abbinamento automatico al registro LOOP    |
| Etichetta | Collegamento automatico all'etichetta LOOP |

**Sintassi esperta:**
```
.next loop0
```

**Assembly generato:**
```
DEX
BNE loop0
```

**Dimensione:** 3 byte (DEX + BNE + offset di diramazione).

**Esempio: cancellare 10 celle dello schermo:**
```
LDX #$0A
loop0:

LDA #$20 ; carattere spazio

STA $0400,X

DEX
BNE loop0
```

---

### PER / FINE

Come **`FOR X=0 TO N-1 : ... : NEXT X`** in BASIC — conta *up* da 0. Ideale
quando è necessario un indice in avanti, ad esempio per scorrere una stringa o
un array.

#### PER

| Campo     | Descrizione                                                                              |
| --------- | ---------------------------------------------------------------------------------------- |
| Registro  | `X` o `Y` — il registro del contatore                                                    |
| Contare   | Limite del ciclo (esadecimale o decimale, ad esempio `$12` = 18). X/Y va da 0 a limit-1. |
| Etichetta | Etichetta del ciclo generata automaticamente (ad esempio `for0`)                         |

**Sintassi esperta:**
```
.per X, $12, per0
```

**Assembly generato:**
```
LDX #$00
per0:
```

**Dimensione:** 2 byte (LD_ opcode + `#$00`).

#### ENDF

| Campo     | Descrizione                                |
| --------- | ------------------------------------------ |
| Registro  | Abbinamento automatico al registro FOR     |
| Etichetta | Collegamento automatico all'etichetta FOR  |
| Contare   | Copiato automaticamente dal FOR accoppiato |

**Sintassi esperta:**
```
.endf per0
```

**Assembly generato:**
```
INX
CPX #$12
BNE for0
```

**Dimensione:** 5 byte (IN_ + CP_ #imm + offset BNE).

**Esempio: stampare una stringa terminata da un carattere nullo:**
```
LDX #$00
for0:
LDA msg,X ; msg = stringa PETSCII a indirizzo fisso
BEQ done ; terminatore nullo → esci
JSR $FFD2 ; CHROUT
INX
CPX #$12 ; massimo 18 caratteri
BNE for0
done:

RTS
```

> **LOOP vs FOR:** LOOP conta all'indietro (N→1) — utile per ritardi,
> riempimenti, cicli di pixel. FOR conta in avanti (0→N) — utile per l'accesso a
> stringhe/array. Entrambi possono usare X o Y.

---

### SPINGERE / TIRARE

Come **salvare le variabili prima di un GOSUB e ripristinarle dopo** — ma usa lo
stack hardware del 6502. Se una subroutine usa A, X o Y, racchiuderla in PUSH e
PULL in modo che i registri del codice chiamante vengano preservati.

#### SPINGERE

Inserisce uno o più registri nello stack. L'ordine è sempre A → X → Y (dal più
interno al più esterno).

| Campo    | Descrizione                                                    |
| -------- | -------------------------------------------------------------- |
| Registri | Qualsiasi combinazione: `A`, `X`, `Y`, `AX`, `AY`, `XY`, `AXY` |

**Sintassi esperta:**
```
.push AXY
```

**ASM generato (esempio: `AX`):**
```
PHA

TXA

PHA
```

**Dimensione:** 1 byte per A (`PHA`), 2 byte per X o Y (trasferimento + push).

#### TIRO

Ripristina i registri dallo stack in ordine inverso** (Y → X → A).

| Campo    | Descrizione                                                 |
| -------- | ----------------------------------------------------------- |
| Registri | Come PUSH: deve corrispondere al blocco PUSH corrispondente |

**Sintassi esperta:**
```
.tira AXY
```

**ASM generato (esempio: `AX`):**
```
PLA
TASSA
PLA
```

> **Regola:** PUSH e PULL devono sempre utilizzare lo stesso set di registri**.
> `PUSH AX` → `PULL AX` (ripristina internamente in ordine inverso: prima X, poi
> A).

---

### FINE / Alias RTS

Come **RTS con un nome macro più amichevole** — `.end` emette un singolo byte
`RTS` e si comporta come un terminatore di subroutine breve in modalità esperto.

**Sintassi esperta:**
```
.FINE
```

**Assembly generato:**
```
RTS
```

**Dimensione:** 1 byte.

Utilizzate questa opzione quando desiderate un marcatore di fine subroutine che
assomigli più a una macro che a una semplice istruzione.

---

### MACRO / ENDM / INVOKE

Come **un GOSUB denominato con parametri** — definisci un blocco di codice
riutilizzabile una volta (MACRO…ENDM), quindi richiamalo ovunque con INVOKE.
Passa valori di argomento diversi ogni volta invece di copiare e incollare
blocchi.

#### MACRO (inizio definizione)

| Campo     | Descrizione                                                                                 |
| --------- | ------------------------------------------------------------------------------------------- |
| Nome      | Identificatore per la macro (ad esempio `setColor`)                                         |
| Parametri | Nomi di parametri opzionali separati da virgole (ad esempio `colore` o `colore, conteggio`) |

Segna l'inizio di una definizione di macro. I blocchi tra MACRO e ENDM
costituiscono il corpo della macro: non generano alcun codice dove si trova la
definizione. Utilizzare {paramName} come segnaposto per gli argomenti.

**Assembly generato:**
```
; .MACRO setColor (colore)

... (blocchi del corpo)
; .ENDM
```

**Sintassi della modalità esperto:**
```
.macro setColor color

LDA {color}

STA $D020
.endm
```

#### ENDM (fine della definizione)

Chiude la definizione della macro corrente. Nessun campo.

#### INVOCARE

Richiama una macro definita in questa posizione e sostituisce i valori degli
argomenti forniti ai segnaposto `{paramName}` nel corpo.

| Campo          | Descrizione                                                                                                           |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| Nome Macro     | Seleziona dal menu a tendina le macro definite                                                                        |
| Argomentazioni | Valori degli argomenti separati da virgole che corrispondono all'elenco dei parametri della macro (ad esempio `#$07`) |

**Assembly generato:**
```
; .invoca setColor(#$07)
    LDA #$07
    STA$D020
```

**Sintassi della modalità esperto:**
```
; argomento singolo:
.invoke setColor(#$07)

; argomenti multipli:
.invoke drawPixel($10, $20)

; nessun argomento:
.invoke clearScreen

; argomenti di testo/stringa (tra virgolette):
.invoke printText("Hello, World!")

; alias .call (sinonimo di .invoke):
.call setColor(#$07)
```

Il corpo della macro viene espanso in linea con `{paramName}` sostituito dagli
argomenti effettivi. È accettata anche la forma separata da spazi (`.invoke
setColor #$07`).

**Tipi di argomenti:**
- **Numerico**: `#$07`, `$10`, `255` — valori esadecimali o decimali
- **Stringhe di testo**: `"Ciao, mondo!"` — stringhe tra virgolette; le virgole
  all'interno delle virgolette sono trattate come parte del testo, non come
  separatori di argomenti
- **Misto**: `#$07, "ciao", $20` — qualsiasi combinazione

> **Suggerimento:** Definisci le macro all'inizio (o alla fine) del tuo
> programma, quindi INVOCALE ovunque sia necessario. Le macro possono essere
> invocate più volte con argomenti diversi.

---

### REGIONE / ENDREGIONE

Raggruppamento puramente visivo: **zero byte**, nessun effetto sul codice
assemblato. Come comprimere una sezione di un programma BASIC in un blocco
denominato in modo da poterlo comprimere e concentrarsi su qualcos'altro.

| Campo              | Descrizione                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------- |
| Nome della regione | Etichetta di testo libero per la sezione (ad esempio `init`, `game_loop`, `sprite_setup`) |

**Sintassi esperta:**
```
.region init

blocchi...
endregion
```

**Controlli sull'intestazione del blocco REGION (sempre visibili):**
- **▸ / ▾ toggle** — comprime o espande l'intera regione. Quando è compressa,
  tutti i blocchi tra REGION e ENDREGION sono nascosti.
- **↕ Espandi tutto** — ripristina la forma originale di ogni singolo blocco
  compresso all'interno della regione ed espande la regione stessa, se
  necessario.
- **⦵ Seleziona in ASM** — evidenzia l'intero intervallo di codici della regione
  nella vista ASM (da `; ===[nome]===` a `; ===[/nome]===`) e scorre fino ad
  esso. Passa automaticamente alla scheda ASM se non è attualmente visibile.
- **⧉ Copia regione** — copia il blocco REGION, tutti i blocchi figli e il
  corrispondente ENDREGION negli appunti. Un lampeggio di ✓ conferma la copia.
- **⎘ Incolla regione** — inserisce la regione copiata come nuova regione
  immediatamente dopo l'ENDREGION della regione corrente e scorre fino ad essa.
  Il pulsante è oscurato finché non è stata copiata una regione.

**Assembly generato:**
```
; regione init
    SEI
    LDA #$00
    STA$D020
; regione finale init
```

**Dimensione:** 0 byte sia per REGION che per ENDREGION.

**Esempio di flusso di lavoro:**
1. Aggiungi un blocco `REGION`, imposta il nome della regione su `init`.
2. Aggiungi le istruzioni di inizializzazione qui sotto.
3. Aggiungi un blocco `ENDREGION` per chiudere la sezione.
4. Fai clic su ▸ sulla REGIONE per comprimere l'intera sezione in un'unica riga
   mentre lavori su altre parti del programma.

> **Nota:** Le regioni possono essere **annidate** l'una dentro l'altra. Ogni
> ENDREGION chiude la REGION aperta più vicina. Nessun effetto sull'output
> assemblato.

---

### DEFINISCI / SE / ALTRIMENTI / FINE SE

Come un interruttore, l'assembler legge ** — `DEFINE DEBUG` attiva un simbolo,
quindi qualsiasi blocco `IF DEBUG` viene incluso e il suo ramo `ELSE` viene
saltato. Rimuovi il blocco DEFINE e il blocco IF scompare dall'output. Non è
necessario eliminare il codice per le build di rilascio.

#### DEFINIRE

| Campo   | Descrizione                                                                                  |
| ------- | -------------------------------------------------------------------------------------------- |
| Simbolo | Uno o più identificatori separati da virgole da attivare (ad esempio `DEBUG` o `DEBUG, PAL`) |

**Sintassi esperta:**
```
.define DEBUG, PAL
```

**Assembly generato:**
```
; .DEFINE DEBUG
; .DEFINE DEBUG, PAL
```

Un blocco `DEFINE` può attivare più simboli contemporaneamente (separati da
virgole). Posiziona i blocchi DEFINE all'inizio del programma. La rimozione del
blocco disattiva istantaneamente tutti i suoi simboli.

#### SE

| Campo      | Descrizione                                                                            |
| ---------- | -------------------------------------------------------------------------------------- |
| Condizione | Identificatore da testare (deve corrispondere a un simbolo `DEFINE` per essere attivo) |

**Sintassi esperta:**
```
.if DEBUG
```

**Assembly generato:**
```
; .SE DEBUG
```

I blocchi compresi tra `IF` e `ENDIF` (o `ELSE`) vengono inclusi o saltati a
seconda che il simbolo di condizione abbia una `DEFINE` corrispondente nel
programma. I blocchi saltati appaiono come commenti `; [IF saltato] …` e
generano **zero byte**.

#### ALTRO

Nessun campo. Contrassegna il ramo alternativo — assemblato quando la condizione
`IF` non è *attiva.

**Sintassi esperta:**
```
.altro
```

**Assembly generato:**
```
; .ALTRO
```

#### ENDIF

Nessun campo. Chiude il blocco condizionale.

**Sintassi esperta:**
```
.endif
```

**Assembly generato:**
```
; .ENDIF
```

**Dimensione:** 0 byte per tutti e quattro i blocchi. Solo il contenuto *tra*
essi conta.

**Esempio: il bordo di debug lampeggia, la build di rilascio lo salta:**
```
; .DEFINE DEBUG

; .IF DEBUG
LDA #$02 ; bordo rosso
STA $D020
; .ELSE
LDA #$00 ; nero (rilascio)
STA $D020
; .ENDIF
```

**Esempio: simboli multipli in un unico blocco DEFINE:**
```
; .DEFINE DEBUG, PAL

; .IF PAL
LDA #$xx ; Costante di temporizzazione PAL
; .ELSE
LDA #$xx ; Costante di temporizzazione NTSC
; .ENDIF
```

Sono supportati i blocchi nidificati `IF`. Se un blocco esterno viene saltato,
anche i blocchi interni vengono saltati.

> **Nota:** Questa è la gestione delle condizioni in fase di compilazione. Per
> la gestione delle diramazioni/confronti in fase di esecuzione, vedere **IF /
> ELSE / ENDIF in fase di esecuzione** di seguito.

### .ASSERT

*(Novità nella versione 2.3.9.)* Un **controllo di integrità in fase di
compilazione**. `.assert` valuta un'espressione durante l'assemblaggio; se è
falsa (`0`), la compilazione si interrompe con un errore chiaro che include il
valore effettivo. Se è vera (diversa da zero), non emette nulla.

| Campo       | Descrizione                                                                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Espressione | Qualsiasi espressione assembler: etichette, `CONST`, `*` (contatore di programma), aritmetica e confronti (`&lt;`, `&lt;=`, `&gt;`, `&gt;=`, `==`, `!=`) |
| Messaggio   | Testo facoltativo aggiunto all'errore di errore                                                                                                          |

**Sintassi esperta:**
```
.assert spriteData &lt; $C000
.assert * &lt; $A000
.assert end - start &lt;= 256, "la tabella degli sprite ha superato una pagina"
```

**Comportamento:**

- **Dimensione:** 0 byte.
- Un'asserzione errata interrompe l'assemblaggio: `` `.assert end - start &lt;=
  256` è falso (valore: 0). La tabella degli sprite ha superato una pagina ``
- Anche un'asserzione che non può essere valutata (etichetta non definita, ecc.)
  fallisce, con *"non può essere valutata in fase di assemblaggio"*.
- I confronti restituiscono `1` / `0`; posiziona `.assert` ovunque nel flusso
  del programma: viene controllato all'indirizzo in cui si trova, quindi
  `.assert * &lt; $D000` verifica la posizione di output corrente.

**Esempio: proteggere un blocco sprite dall'attraversamento di una pagina:**
```
* = $3000
sprite_data:

.byte $00, $00, $00 ; … 63 byte …
sprite_data_end:

.assert sprite_data_end - sprite_data == 63, "lo sprite deve essere esattamente di 63 byte"

.assert (sprite_data % 64) == 0, "lo sprite deve essere allineato a 64 byte"
```

---

### COST

Come **una variabile denominata che non cambia mai** — `SCREEN = $0400`. Usa il
nome invece di digitare indirizzi grezzi ovunque, rendendo il codice più facile
da leggere e modificare in seguito.

| Campo   | Descrizione                                                                                                                              |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Nome    | Identificatore per la costante (ad esempio `SCREEN`)                                                                                     |
| Valore  | Valore numerico nella base selezionata (ad esempio `0400` in esadecimale = indirizzo $0400) o un'espressione relativa al PC (vedi sotto) |
| Formato | ESA o DEC — controlla come viene inserito e visualizzato il valore                                                                       |

**Sintassi esperta:**
```
.const SCREEN = $0400
.const FRAMES_1S = 60
```

**Assembly generato:**
```
; .CONST SCREEN = $0400
```

Il nome della costante appare nel menu a tendina **selettore di etichette** sui
blocchi di istruzioni: basta cliccarci sopra per inserirlo.

**Espressioni relative al PC (`*+N` / `*-N`):**

Il campo valore accetta anche `*+N` o `*-N`, dove `*` è l'indirizzo di
compilazione del blocco CONST stesso. Questo viene utilizzato per creare un
alias denominato per un byte all'interno di un'istruzione vicina: il classico
schema di codice automodificante.

```
CONST op = *+1 ; op → indirizzo dell'operando immediato del successivo LDA
LDA #$00 ; $00 verrà modificato in fase di esecuzione
... STA op ; sovrascrive il byte #$00 → LDA leggerà il nuovo valore la prossima volta
```

La costante emette 0 byte; l'etichetta si risolve in fase di compilazione in
`indirizzo_corrente + 1`.

**Espressioni aritmetiche:**

Il campo valore accetta operazioni aritmetiche generiche, inclusi riferimenti a
nomi CONST definiti in precedenza, valori letterali esadecimali/binari e
funzioni matematiche integrate:

```
.const SCREEN = $0400
.const SCREEN_END = SCREEN + 40*25 ; 1000 byte dopo
.const COLOR_RAM = $D800
.const MID_X = 160
.const SIN_TABLE = round(sin(PI/8) * 127) ; valore del seno precalcolato
```

**Funzioni integrate:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, costante `PI`

Operatori: `+ - * /` Letterali: `$FF` (esadecimale), `%10110000` (binario) Byte
basso/alto: `lo(expr)`, `hi(expr)`

**Dimensione:** 0 byte.

---

### VAR

Come **CONST, ma allocato automaticamente ** — `VAR` riserva spazio di memoria a
pagina zero per un'etichetta senza che tu debba digitare l'indirizzo. Usalo per
contatori, puntatori e stati di breve durata che appartengono a ZP.

| Campo                | Descrizione                                                |
| -------------------- | ---------------------------------------------------------- |
| Nome                 | Nome/etichetta della variabile                             |
| Taglia (facoltativa) | Numero di byte da riservare. Omettere per un singolo byte. |

**Sintassi esperta:**
```
contatore .var
.var timer, 2
.var vive
```

**Esempio pratico:**
```
.regione Vars
contatore .var
.var timer, 2
.endregion

LDA #$00
Contatore STA
```

**Assembly generato:**
```
; .var contatore
```

**Dimensione:** 1 byte per impostazione predefinita, oppure `N` byte quando la
dimensione è specificata.

L'allocatore percorre un cursore di pagina zero configurabile (`$02` a `$FE`) e
assegna il primo slot libero. Se la regione richiesta si sovrappone a
un'etichetta già utilizzata, il compilatore emette un avviso.

---

### Runtime IF / ELSE / ENDIF

Come un vero modello di diramazione, questa versione funziona in fase di
esecuzione, non in fase di compilazione. Confronta A, X o Y con un valore
immediato ed emette la corretta sequenza di diramazione CMP / CPX / CPY + per
te.

| Campo     | Descrizione                                  |
| --------- | -------------------------------------------- |
| Registro  | `A`, `X` o `Y`                               |
| Operatore | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Valore    | Valore immediato in formato HEX o DEC        |

**Sintassi esperta:**
```
.if A == #$10

LDA #$07
.else

LDA #$0F
endif
```

**Dimensioni:** Dipende dai rami scelti e dal modulo di confronto.

Il confronto è senza segno per impostazione predefinita. Per `&lt;=` e `&gt;` la
macro si espande nella catena di diramazioni equivalente più breve per il
registro selezionato.

---

### MENTRE / FINE

Come **un ciclo di runtime con un test in cima** — il corpo viene eseguito
finché la condizione rimane vera.

| Campo     | Descrizione                                  |
| --------- | -------------------------------------------- |
| Registro  | `A`, `X` o `Y`                               |
| Operatore | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Valore    | Valore immediato in formato HEX o DEC        |

**Sintassi esperta:**
```
.mentre A != #$00

JSR getchar
.endw
```

**Dimensioni:** Dipende dal corpo del ciclo e dalla forma di confronto.

Utilizzare `WHILE` quando il ciclo potrebbe terminare prima della fine della
prima iterazione. È la controparte in fase di esecuzione dell'helper `LOOP /
NEXT` basato sul conteggio.

---

### RIPETI / FINO A

Come **un ciclo di runtime con un test in fondo** — il corpo viene sempre
eseguito almeno una volta, poi la condizione decide se fermarsi.

| Campo     | Descrizione                                  |
| --------- | -------------------------------------------- |
| Registro  | `A`, `X` o `Y`                               |
| Operatore | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Valore    | Valore immediato in formato HEX o DEC        |

**Sintassi esperta:**
```
.repeat
JSR getchar
.until A == #$00
```

**Dimensioni:** Dipende dal corpo del ciclo e dalla forma di confronto.

Utilizza `REPEAT / UNTIL` quando desideri che il corpo venga eseguito almeno una
volta prima del controllo di uscita.

---

### MEMCPY / MEMSET

Come le **piccole routine di memoria a cui fai ricorso costantemente** —
`MEMCPY` copia un blocco contiguo, `MEMSET` riempie un intervallo con un byte.

| Macro    | Campi                               |
| -------- | ----------------------------------- |
| `MEMCPY` | `src`, `dst`, `size`                |
| `MEMSET` | `indirizzo`, `valore`, `dimensione` |

**Sintassi esperta:**
```
.memcpy src=$C000, dst=$D000, size=$0100
.memset addr=$0400, value=#$20, size=$03E8
```

**Assembly generato:** cicli di copia/riempimento in linea, scelti per
corrispondere alla dimensione richiesta.

Per dimensioni fino a 256 byte viene utilizzato un breve ciclo a 8 bit. Per
dimensioni maggiori, il passaggio a un contatore a 16 bit avviene
automaticamente.

---

### STAMPA / STAMPA_CARATTERE / STAMPA_ESAGENICO / CANCELLA_SCHERMO / ATTENDI_TASTO / RITARDO / IMPOSTA_BORDO / IMPOSTA_SFONDO

#### STAMPA

Come l'output **PETSCII senza il boilerplate** — stampa una stringa tramite
`CHROUT` con la stessa gestione delle maiuscole/minuscole del blocco PETSCII. La
casella di controllo delle minuscole è condivisa con il codificatore PETSCII,
quindi il percorso del testo rimane coerente.

**Sintassi esperta:**
```
.print "CIAO"
.print "ciao", minuscolo
```

#### PRINT_CHAR

Stampa un byte PETSCII tramite codice numerico e lo invia tramite `CHROUT`. Il
valore può anche essere una costante denominata o un'etichetta che si risolve in
un byte in fase di assemblaggio, sia in modalità Blocco che in modalità Esperto.

**Sintassi esperta:**
```
.print_char 65
.print_char $41
.print_char colore
```

#### STAMPA_ESATTEZZA

Stampa un valore a 8 bit come testo esadecimale attraverso il normale percorso
di output del KERNAL.

**Sintassi esperta:**
```
.print_hex A
```

#### SCHERMO CHIARO

Scorciatoia per il codice di controllo standard per cancellare lo schermo del
C64.

**Sintassi esperta:**
```
.clear_screen
```

#### WAIT_KEY

Attende che venga premuto un tasto, così non è necessario eseguire manualmente
il ciclo `GETIN` ogni volta.

**Sintassi esperta:**
```
.wait_key
```

#### RITARDO

Attende il numero di fotogrammi richiesto tramite una routine di supporto
condivisa. Utilizzare questa opzione per brevi pause e intervalli di
temporizzazione quando un ciclo personalizzato completo sarebbe eccessivo. Il
conteggio dei fotogrammi può essere un numero grezzo o una costante denominata,
e `.wait` è semplicemente un alias di `.delay`.

**Sintassi esperta:**
```
.ritardo 29
.attesa 29
.ritardo frame=FRAMES_1S
```

In modalità Blocco, il campo ritardo utilizza un selettore di costanti compatto
quando è disponibile un valore simbolico, in modo da non dover digitare il nome
manualmente ogni volta.

#### IMPOSTA_BORDO / IMPOSTA_BORDO

Funzioni di convenienza per i registri colore del VIC-II. Il valore del colore
può essere un numero grezzo o una costante denominata che si risolve in un
intervallo da 0 a 15. Sia la modalità Blocco che la modalità Esperto accettano
nomi di costanti simboliche.

**Sintassi esperta:**
```
.set_border 6
.set_bg 0
.set_border color
.set_bg color
```

**Dimensione:** Ogni helper si espande in una piccola sequenza di scrittura di
registro o in una breve chiamata KERNAL.

In modalità Blocco, questi campi utilizzano anche il selettore const, quindi il
valore simbolico rimane visibile invece di essere sostituito da un numero
grezzo.

---

### IRQ_SETUP

Configura un gestore IRQ raster in un solo passaggio. La macro scrive il vettore
IRQ, abilita gli IRQ raster, imposta la riga, disabilita le sorgenti IRQ CIA
comuni e ritorna all'esecuzione normale con `CLI`.

| Campo       | Descrizione                                                       |
| ----------- | ----------------------------------------------------------------- |
| Manutentore | Etichetta della routine IRQ (ad esempio `my_irq`)                 |
| Raster      | Linea raster in formato esadecimale o decimale (ad esempio `$FA`) |

**Sintassi esperta:**
```
.irq_setup handler=my_irq, raster=$FA
```

**Dimensioni:** Una piccola sequenza di configurazione; la lunghezza esatta
dipende dalla linea raster selezionata.

Utilizza questa opzione quando desideri il codice standard "SEI / installa
gestore / abilita IRQ / CLI" senza doverlo disperdere nel programma.

---

### RAND

Come **un piccolo PRNG integrato** — restituisce un valore pseudo-casuale a 8
bit da un seme compatto a pagina zero.

| Campo | Descrizione                                                           |
| ----- | --------------------------------------------------------------------- |
| Seme  | Byte o etichetta di seed di pagina zero opzionale (predefinito `$FB`) |

**Sintassi esperta:**
```
.random
```

**Dimensione:** Una manciata di byte, a seconda del percorso di implementazione
scelto.

Il generatore è pensato per il gameplay, la variazione degli effetti e la
raccolta rapida di dati di test. È volutamente di dimensioni ridotte, piuttosto
che dotato di sofisticate funzionalità crittografiche.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Configura uno sprite VIC-II in un unico blocco: invece di scrivere circa 6
istruzioni POKE in BASIC, basta compilare i campi. Imposta il puntatore dati
dello sprite, lo accende, abilita facoltativamente la modalità multicolore e ne
imposta il colore.

| Campo       | Descrizione                                                                   |
| ----------- | ----------------------------------------------------------------------------- |
| Sprite #    | Numero dello sprite 0–7                                                       |
| Colore      | Indice di colore 0–15 (tavolozza C64)                                         |
| Pagina dati | Indirizzo dati sprite / 64 (ad esempio `$21` se i dati si trovano in `$0840`) |
| Multicolore | Attiva/disattiva il bit multicolore dello sprite (`$D01C`)                    |

**Sintassi esperta:**
```
.sprite_init 0, 7, $21
.sprite_init 0, 7, $21, multicolore
.sprite_init 0, 7, $21, monocromatico
```

**Assembly generato:**
```
LDA #$21

STA $07F8 ; registro puntatore sprite ($07F8 + N)

LDA $D015

ORA #$01 ; imposta il bit di abilitazione per lo sprite 0

STA $D015

LDA $D01C

AND #$FE ; azzera il bit multicolore per lo sprite 0

STA $D01C

LDA #$07

STA $D027 ; registro colore sprite 0
```

**Dimensione:** 26 byte.

> **Pagina dati sprite:** `indirizzo_dati ÷ 64`. Con lo stub BASIC SYS
> predefinito, `ALIGN 64` dopo `JMP main` posiziona i dati sprite a `$0840` →
> pagina = `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Come **`POKE 53248, x : POKE 53249, y`** in BASIC — imposta la posizione
iniziale di uno sprite. Le coordinate vengono incorporate in fase di
assemblaggio e i campi accettano costanti in modalità Blocco; per l'animazione
utilizzare `INC`/`DEC` direttamente sul registro dello sprite.

| Campo    | Descrizione                 |
| -------- | --------------------------- |
| Sprite # | Numero dello sprite 0–7     |
| X        | Posizione orizzontale 0–319 |
| Y        | Posizione verticale 0–255   |

**Sintassi esperta:**
```
.sprite_pos 0, 152, 100
```

**ASM generato (esempio: sprite 0, X=152, Y=100):**
```
LDA #$98 ; byte basso di X

STA $D000 ; registro X dello sprite 0

LDA $D010

AND #$FE ; azzera il bit più significativo di X per lo sprite 0 (X ≤ 255)

STA $D010

LDA #$64 ; Y = 100

STA $D001 ; registro Y dello sprite 0
```

Per X > 255 la macro imposta il bit corrispondente in `$D010` invece di
azzerarlo.

**Dimensione:** 18 byte.

> **Nota:** `SPRITE_POS` inserisce le coordinate X/Y nel codice (`LDA #$xx`).
> Per animare uno sprite in fase di esecuzione, utilizzare `INC $D000` / `DEC
> $D000` — vedere l'esempio `sprite-macro-demo`.

---

<a id="wait_raster"></a>
### WAIT_RASTER

Attende che il fascio di elettroni del VIC-II raggiunga una specifica linea di
scansione, come per sincronizzarsi con un fotogramma televisivo. Posizionalo
all'inizio del ciclo di gioco per evitare il tearing degli sprite. Nessun JSR,
nessuna etichetta necessaria.

| Campo        | Descrizione                                                             |
| ------------ | ----------------------------------------------------------------------- |
| Linea raster | Riga raster di destinazione in esadecimale (ad esempio `FF` = riga 255) |

**Sintassi esperta:**
```
.wait_raster $FF
```

**Assembly generato:**
```
Attendi:

LDA $D012 ; riga raster corrente

CMP #$FF ; riga di destinazione

BNE attendi ; ciclo di ritorno (-7 byte)
```

**Dimensione:** 7 byte (l'offset `BNE` `$F9` = −7 punta sempre all'`LDA`).

> **Suggerimento:** Posiziona `WAIT_RASTER` all'inizio del ciclo di gioco per
> sincronizzarlo con il display e prevenire lo strappo degli sprite.

---

### JOYSTICK

Come leggere **`PEEK($DC00)`** e poi POKE la posizione dello sprite, ma in un
unico blocco. Legge una porta joystick CIA e regola di conseguenza i registri
X/Y di uno sprite. Interamente inline, non è necessario JSR.

| Campo    | Descrizione                                                                            |
| -------- | -------------------------------------------------------------------------------------- |
| Porta    | `1` = porta 1 (`$DC01`) oppure `2` = porta 2 (`$DC00`)                                 |
| Sprite # | Numero dello sprite da 0 a 7 (controlla quale coppia di registri X/Y viene aggiornata) |

**Sintassi esperta:**
```
joystick 2, 0
```

**ASM generato (porta 2, sprite 0):**
```
LDA $DC00 ; lettura porta CIA 2

LSR ; bit 0 → riporto (su)

BCS skip_up ; riporto impostato = NON premuto

DEC $D001 ; Y−1 (spostamento verso l'alto)
skip_up:

LSR ; bit 1 → riporto (giù)

BCS skip_down

INC $D001 ; Y+1 (spostamento verso il basso)
skip_down:

LSR ; bit 2 → riporto (sinistra)

BCS skip_left

DEC $D000 ; X−1 (spostamento verso sinistra)
skip_left:

LSR ; bit 3 → riporto (destra)

BCS skip_right

INC $D000 ; X+1 (spostamento verso destra)
skip_right:
```

**Mappa dei bit del joystick (attivo-BASSO - bit = 0 significa premuto):**

| Morso | Direzione | registro della CIA                |
| ----- | --------- | --------------------------------- |
| 0     | Su        | $DC00 (porta 2) / $DC01 (porta 1) |
| 1     | Giù       |                                   |
| 2     | Sinistra  |                                   |
| 3     | Giusto    |                                   |
| 4     | Fuoco     | (non gestito da questa macro)     |

**Dimensione:** 27 byte. L'offset `BCS` è sempre `+3` (salta la successiva
istruzione abs`DEC`/`INC da 3 byte).

**Modalità variabile — `.porta joystick, vx, vy[, fuoco]`:** invece di muovere
uno sprite, la direzione viene scritta nelle variabili: `vx` / `vy` = `-1` / `0`
/ `+1` (`$FF` / `$00` / `$01`), e l'opzionale `fuoco` = `1` mentre il pulsante è
premuto, `0` altrimenti. Usalo per una telecamera scorrevole, un giocatore con
la propria fisica o menu. La porta `3` legge entrambe le porte joystick
contemporaneamente (`LDA $DC00` / `AND $DC01`), quindi entrambe le porte
funzionano.

```
.joystick 2, vx, vy; 35 byte
.joystick 3, vx, vy, fire; entrambe le porte + fire: 45 byte
```

> **Uso tipico:** Inserire all'interno di un'etichetta `gameloop` con
> `WAIT_RASTER` per primo:
> ```
> ciclo di gioco:
> 
> WAIT_RASTER ($FF)
> 
> JOYSTICK (porta=2, sprite=0)
> Ciclo di gioco JMP
> ```

---

<a id="mouse"></a>
### TOPO

Legge un mouse proporzionale Commodore 1351 e muove uno sprite. Interamente
**inline** — non sono necessari JSR o etichette. La macro seleziona la porta
CIA, attende che gli input del paddle SID si stabilizzino, quindi decodifica il
movimento delta utilizzando lo schema standard del driver 1351 e lo applica ai
registri dello sprite.

| Campo     | Descrizione                                                                                        |
| --------- | -------------------------------------------------------------------------------------------------- |
| Porta     | `1` = CIA `$DC00` bit `7:6` = `%01`; `2` = `%10`                                                   |
| Sprite #  | Numero dello sprite 0–7                                                                            |
| ZP byte X | Indirizzo di pagina zero (esadecimale) per contenere il precedente campione POTX (ad esempio `FD`) |
| ZP byte Y | Indirizzo di pagina zero (esadecimale) per contenere il precedente campione POTY (ad esempio `FE`) |

** Forma ASM generata (porta 1, sprite 0, ZP `$FD`/`$FE`):**

```
; CIA port select + settlement
LDA $DC00
AND #$3F

ORA #$40
STA $DC00
LDX #$67
wait:

DEX
BNE wait

; Asse X — decodifica delta standard a 7 bit in stile 1351
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

; Asse Y — stessa decodifica, poi invertito prima dell'applicazione
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

**Dimensione:** 142 byte.

**Sintassi della modalità esperto:**
```
.mouse porta, spriteNum, zpX, zpY
; esempio:
.mouse 2, 0, FD, FE
```

> **Importante:** Prima della prima chiamata, inizializzare i byte della pagina
> zero con i valori POTX/POTY correnti per evitare un salto nel primo frame:
> ```
> Porta 1: LDA $DC00 : AND #$3F : ORA #$40 : STA $DC00
> 
> Porta 2: LDA $DC00 : AND #$3F : ORA #$80 : STA $DC00
> 
> LDA $D419 : LSR A : AND #$3F : STA $FD
> 
> LDA $D41A : LSR A : AND #$3F : STA $FE
> ```

> **Suggerimento:** Esegui il polling del mouse una volta per frame: posiziona
> `WAIT_RASTER` nel ciclo di gioco prima di `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Come **`PEEK($D01E)`** in BASIC: controlla i registri di collisione hardware del
VIC-II e ti dice se uno sprite ha colpito un altro sprite o lo sfondo.
Interamente inline, non è necessario JSR.

| Campo              | Descrizione                                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Sprite #           | Numero dello sprite 0–7 (quale bit dello sprite controllare)                                                            |
| Tipo di collisione | `Sprite-Sprite ($D01E)` — collisione con un altro sprite; `Sprite-Sfondo ($D01F)` — collisione con la grafica di sfondo |

**Sintassi esperta:**
```
.sprite_col 0, sprite
.sprite_col 0, sfondo
```

**ASM generato (sprite 0, sprite–sprite):**
```
LDA $D01E ; legge il registro delle collisioni sprite-sprite (lo azzera!)

AND #$01 ; isola il bit 0 (sprite 0)

; A ≠ 0 → si è verificata una collisione
```

**Dimensione:** 5 byte.

> **Importante:** La lettura di `$D01E`/`$D01F` **azzera il registro**. Leggilo
> una volta per frame e agisci immediatamente sul risultato con `BEQ`/`BNE`.

**Uso tipico:**
```
ciclo di gioco:

WAIT_RASTER ($FF)

JOYSTICK (porta=2, sprite=0)

SPRITE_COL (sprite=0, tipo=sprite-sprite)

BEQ no_hit ; A = 0 → nessuna collisione

LDA #$02

STA $D020 ; bordo rosso = colpo!

JMP ciclo di gioco
no_hit:

LDA #$0E

STA $D020 ; bordo azzurro = trasparente

JMP ciclo di gioco
```

> **Vedi anche:** `esempio di dimostrazione di collisione` — palla verde (sprite
> n. 0) contro croce rossa (sprite n. 1).

---

### CARICAMENTO DEL FILE

Come **`LOAD "file",8`** in BASIC — carica un file da un disco D64 in fase di
esecuzione utilizzando la routine KERNAL LOAD. Usalo per caricare dati, musica o
codice aggiuntivo dal disco mentre il tuo programma è in esecuzione.

| Campo                               | Descrizione                                                                                                                                                                                                                                     |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome file                           | Nome del file sul disco (max 16 caratteri, maiuscolo automatico; i caratteri `,`, `"`, `/`, `\`, `:`, `*`, `?`, `&lt;`, `&gt;`, `|` vengono filtrati)                                                                                           |
| Dispositivo                         | Numero del dispositivo 8–30 (predefinito `8`)                                                                                                                                                                                                   |
| Indirizzo di override (facoltativo) | Indirizzo di caricamento esadecimale (ad esempio `C000`). Se impostato, il file viene caricato a questo indirizzo (`sec=0`, ignorando l'intestazione PRG). Lasciare vuoto per utilizzare l'intestazione PRG a 2 byte del file stesso (`sec=1`). |
| Etichetta di errore (facoltativa)   | Se impostato, dopo JSR LOAD viene generata un'istruzione `BCS`. Se il KERNAL restituisce con carry impostato (errore), l'esecuzione salta a questa etichetta.                                                                                   |

**Sintassi esperta:**
```
.loadfile "DEMO-COLORS", 8
.loadfile "DEMO-COLORS", 8, $C000
.loadfile "DEMO-COLORS", 8, $C000, error_label
```

**Struttura del codice generato:**
```
JMP skip_filename; salta il nome del file inline
.byte "DEMO-COLORS"; byte del nome del file (PETSCII, 11 caratteri)
skip_filename:

LDA #11; lunghezza del nome del file

LDX #<fname; puntatore lo

LDY #>fname; puntatore hi

JSR $FFBD; SETNAM

LDA #1; file logico #1

LDX #8; dispositivo 8

LDY #0; sec=0 (indirizzo di override) o #1 (indirizzo del file stesso)

JSR $FFBA; SETLFS

LDA #0; comando LOAD (non VERIFY)

JSR $FFD5; LOAD
BCS fail; (solo se è impostata l'etichetta di errore)
```

**Dimensione:** `3 + lunghezza_nome_file + 9 (SETNAM) + 9 (SETLFS) + (4 se
sovrascrivi) + 5 (LOAD) + (2 se etichetta di errore)` byte. Minimo 27 byte.

> **Importante:** Il nome del file viene memorizzato in linea nel codice
> macchina subito dopo un `JMP skip_filename`. Il nome del file sul disco deve
> essere PETSCII in maiuscolo, che corrisponde alle normali lettere maiuscole
> ASCII (`A`–`Z`). La macro impone automaticamente questa condizione.

> **Utilizzare sempre un'etichetta di errore** per i programmi di produzione: se
> il file non viene trovato, KERNAL imposta il flag di riporto e l'esecuzione
> passa a ciò che è successivo.

> **Vedi anche:** `esempio loadfile-demo` — dimostra il caricamento di
> `DEMO-COLORS.PRG` da un D64 con un ramo di errore BCS e una schermata di
> errore visiva.

---

### ESODECRO

Decompressione Exomizer in-program ** **. Utilizzare questa macro subito dopo un
`LOADFILE ` che ha caricato un flusso compresso in modalità `mem ` di Exomizer:
EXODECRUNCH lo decomprime all'indietro nell'indirizzo incorporato nel flusso.

| Campo                        | Descrizione                                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Indirizzo del disimballatore | Indirizzo in cui risiede il codice del decompressore in memoria (predefinito `B000`). Deve essere un indirizzo esadecimale a 16 bit. |

**Sintassi esperta:**
```
.exodecrunch
.exodecrunch depacker=$B000
```

**Codice generato (19 byte):**
```
LDA $AE ; fine caricamento KERNAL lo (impostato dal precedente LOAD)

STA $04 ; puntatore src-end del depacker lo

LDA $AF ; fine caricamento KERNAL hi

STA $05 ; puntatore src-end del depacker hi

LDA #$36 ; ROM BASIC disattivata ($A000-$BFFF diventa RAM)

STA $01
Depacker JSR ; il depacker legge da dietro a davanti tramite $04/$05

LDA #$37 ; ripristina la mappatura predefinita (BASIC + KERNAL + I/O)

STA $01
```

**Come funziona:**

1. KERNAL `LOAD` ($FFD5) aggiorna ZP `$AE/$AF` al punto successivo all'ultimo
   byte caricato. EXODECRUNCH copia questo in ZP `$04/$05`, che è la convenzione
   ufficiale Exomizer per la fine del codice sorgente all'indietro.
2. Il depacker è tipicamente posizionato in `$B000` (all'interno della regione
   mappata della ROM BASIC). La macro commuta `$01 = $36` in modo che la CPU
   veda la RAM lì durante il JSR, quindi ripristina `$01 = $37` in seguito.
3. L'indirizzo di destinazione della decompressione è **codificato nel flusso
   compresso stesso** quando si comprime con `exomizer mem -l <carica>
   file,<destinazione>` — il depacker lo legge dai primi byte del flusso.

**Depacker binario:** il depacker precompilato all'indietro è
`samples/exo-decrunch.bin` (477 byte, ORG $B000). È un wrap di Kick Assembler
dell'ufficiale `exodecrunch.asm` con `INC $D020` aggiunto ad ogni lettura per un
effetto di lampeggio del bordo visibile durante la decompressione. Inseriscilo
nel tuo programma con un blocco `INCBIN` all'indirizzo del depacker.

**Compensazione dell'offset di sicurezza:**La modalità mem predefinita di
Exomizer applica un offset di sicurezza di 2 byte: i dati vengono inseriti 2
byte prima della destinazione richiesta. La finestra di dialogo Esegui tramite
D64 **aggiunge automaticamente 2 al campo Dst** prima di chiamare Exomizer, in
modo che il comportamento visibile corrisponda all'indirizzo digitato.

> **Vedi anche:** l'esempio `exo-multicolor-demo` — esempio completo end-to-end:
> LOADFILE una bitmap multicolore compressa in $C000, EXODECRUNCH la decomprime
> in $2000, quindi copia lo schermo → $0400 e il colore → $D800 e passa VIC-II
> alla modalità bitmap multicolore.

> **Test di integrazione:** `test del carico --test exomizer_integration` (in
> `src-tauri/`) verifica il ciclo completo di compressione + decompressione su
> un emulatore 6502 con il binario depacker reale. Criteri di passaggio: 10000
> byte equivalenti al file sorgente `multi-color.bin`.

---

### REU_CHECK

Rileva se è collegata un'unità di espansione RAM Commodore (REU), come
controllare `PEEK($D010)` per verificare la presenza dell'hardware. Esegue i
test scrivendo e leggendo due pattern nel registro REU `$DF04`.

| Campo   | Descrizione     |
| ------- | --------------- |
| Nessuno | Nessun operando |

**Codice generato (34 byte):**
```
LDA #$55
STA$DF04
LDA$DF04
CMP #$55
BNE fallisce
LDA #$AA
STA$DF04
LDA$DF04
CMP #$AA
BNE fallisce
LDA #$00
CMP #$FF ; Z=0 =&gt; REU presente
BNE fatto
fallire:
LDA #$FF
CMP #$FF ; Z=1 =&gt; nessuna REU
Fatto:
```
> La macro normalizza il risultato in modo che il ramo seguente rimanga
> semplice: `BNE` significa REU presente, `BEQ` significa REU mancante.

**Sintassi esperta:**
```
.reu_check
```

**Risultato in flag:**
- **Z = 0** (risultato ≠ 0) → REU presente → usa `BNE`
- **Z = 1** (risultato = 0) → nessuna REU → utilizza `BEQ`

**Nessun campo configurabile** — la macro genera sempre lo stesso codice.

**Uso tipico:**
```assembly
REU_CHECK
BEQ no_reu ; saltare se REU non è presente
; ...Codice REU qui...
no_reu:
```

---

### REU_STASH / REU_FETCH / REU_SWAP

Trasferimento di blocchi DMA tra la RAM del C64 e la memoria di espansione REU:
è come un ciclo POKE molto veloce, ma la CPU non esegue alcuna operazione (il
chip REU copia i dati mentre la CPU è ferma). Un trasferimento di 1000 byte è
praticamente istantaneo.

| Macro       | Direzione     | `$DF01` comando |
| ----------- | ------------- | --------------- |
| `REU_STASH` | RAM C64 → REU | `$90`           |
| `REU_FETCH` | REU → RAM C64 | `$91`           |
| `REU_SWAP`  | RAM C64 ↔ REU | `$92`           |

** Campi:**

| Campo         | Descrizione                                          | Esempio |
| ------------- | ---------------------------------------------------- | ------- |
| Indirizzo C64 | Origine/destinazione nella RAM del C64 (esadecimale) | `C000`  |
| indirizzo REU | Origine/destinazione in REU (esadecimale, 16 bit)    | `0000`  |
| banca REU     | Banca di memoria REU (0–7)                           | `0`     |
| Lunghezza     | Numero di byte da trasferire (esadecimale, 16 bit)   | `1000`  |

**Sintassi esperta:**
```
.reu_stash $C000, $0000, 0, $1000
.reu_fetch $C000, $0000, 0, $1000
.reu_swap $C000, $0000, 0, $1000
```

**Codice generato (40 byte):**
```
LDA #c64lo STA $DF02 ; indirizzo C64 LO
LDA #c64hi STA $DF03 ; indirizzo C64 HI
LDA #reuLo STA $DF04 ; indirizzo REU LO
LDA #reuHi STA $DF05 ; indirizzo REU HI
LDA #bank STA $DF06 ; banco REU
LDA #lenLo STA $DF07 ; lunghezza LO
LDA #lenHi STA $DF08 ; lunghezza HI
LDA #$00 STA $DF09 ; controllo indirizzo (fisso)
LDA #$00 STA $DF0A ; maschera di interruzione (fissa)
LDA #cmd STA $DF01 ; esegui DMA ($90/$91/$92 = stash/fetch/swap, immediato)
```

> **Nota:** I comandi utilizzano `$90/$91/$92` (bit 4 impostato = modalità DMA
> immediata). La scrittura su `$DF01` avvia il trasferimento; la CPU riprende
> quando è terminato.

---

### TURBO_SET

Imposta la velocità della CPU **Ultimate-64 (U64)** tramite il registro `$D031`.
Nessun effetto su un vero C64 o altri emulatori.

** Campi:**

| Campo            | Descrizione                  | Allineare                                            |
| ---------------- | ---------------------------- | ---------------------------------------------------- |
| Velocità         | Indice di velocità della CPU | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz                 |
| Linea del sedere | Emulazione Badline           | Attivato (compatibile con C64) / Disattivato (turbo) |

Il byte della velocità viene calcolato come: `(speedIndex &amp; 0x0F) |
(badline_disabled ? 0x80 : 0x00)`.

**Codice generato (5 byte):**
```
A9 xx LDA #speed_byte
8D31D0STA$D031
```

**Sintassi della modalità esperto:**
```
.turbo_set 7,0 ; velocità=7 (~10 MHz), badline abilitato
.turbo_set 15,1 ; velocità=15 (~48 MHz), badline disabilitato
```

> **Nota:** Questa macro influisce solo sull'hardware U64. Su un vero C64 o su
> altri emulatori, scrive in `$D031`, il che potrebbe influire sul CIA o essere
> ignorato.

---

### SUPERCPU_DETECT

Controlla se è installato un acceleratore **CMD SuperCPU** — come `PEEK($D0B8)`
per vedere se restituisce qualcosa di diverso da `$FF`.

**Codice generato (5 byte):**
```
AD B8 D0 LDA $D0B8
C9 FF CMP #$FF
```

**Risultato in flag:**
- **Z = 0** → SuperCPU presente → usa `BNE`
- **Z = 1** → SuperCPU non trovato → usa `BEQ`

** Nessun campo configurabile.**

**Sintassi esperta:**
```
.supercpu_detect
```

**Uso tipico:**
```assembly
SUPERCPU_DETECT
BEQ no_scpu ; salta se SuperCPU non è presente
; ... Codice turbo di SuperCPU qui ...
no_scpu:
```

---

### TURBO_ABILITA

Attiva o disattiva la modalità turbo **CMD SuperCPU**. Chiama prima
`SUPERCPU_DETECT` e salta questo passaggio se la SuperCPU non è presente.

| Modalità   | Registro | Effetto                                               |
| ---------- | -------- | ----------------------------------------------------- |
| Abilitare  | `$D07A`  | Attiva la modalità turbo (fino a 20 MHz con SuperCPU) |
| Disabilita | `$D07B`  | Ritorno alla modalità di compatibilità a 1 MHz        |

**Codice generato (5 byte):**
```
A9 00 LDA #$00
8D 7A D0 STA $D07A ; (o $D07B per disabilitare)
```

**Sintassi della modalità esperto:**
```
.turbo_enable attivo
.turbo_enable disattivato
```

> **Nota:** Chiamare prima `SUPERCPU_DETECT` e saltare questa macro se la
> SuperCPU non è presente.

---

<a id="map_copy"></a>
### COPIA_MAPPA

Copia una tilemap da un indirizzo sorgente alla RAM dello schermo (e
opzionalmente alla RAM dei colori) utilizzando una serie di cicli `LDA abs,X` /
`STA abs,X`. Una pagina da 256 byte viene copiata per ogni iterazione del ciclo;
una pagina parziale alla fine utilizza `CPX #rem / BNE` per interrompere. Non è
necessario JSR: tutto il codice viene generato inline.

| Campo                        | Descrizione                                                                                                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Indirizzo sorgente (schermo) | Indirizzo esadecimale in cui risiedono i dati della mappa dopo il caricamento (ad esempio `C000`)                                                                         |
| Schermo RAM dest             | Dove copiare i codici dello schermo (ad esempio `0400`)                                                                                                                   |
| Dimensione (byte)            | Numero totale di byte da copiare — in genere `$03E8` = 1000 (40×25 caratteri)                                                                                             |
| File .bin combinato          | Quando selezionato, si aspetta codici schermo immediatamente seguiti da dati colore in `source + size`; copia i dati colore in **Color RAM dest** in un secondo passaggio |
| Colore RAM dest              | Destinazione per i dati colore — predefinita `D800` (RAM colore C64)                                                                                                      |

**ASM generato (mappa da 1000 byte, solo schermo):**
```
LDX #$00

LDA $C000,X ; pagina 0

STA $0400,X

INX

BNE *-9 ; ciclo fino a quando X non torna a 0 (256 iterazioni)

LDA $C100,X ; pagina 1

STA $0500,X

INX

BNE *-9

LDA $C200,X ; pagina 2

STA $0600,X

INX

BNE *-9

LDA $C300,X ; resto — 232 byte

STA $0700,X

INX

CPX #$E8

BNE *-11
```

**Dimensioni:** `2 (LDX) + fullPages×9 + (rem &gt; 0 ? 11 : 0)` byte per
sezione. La modalità combinata lo raddoppia (sezione schermo + sezione colore
identica).

**Associazione con l'editor di mappe:**

L'editor di mappe **File → Salva mappa + RAM colore (.bin)** esporta un singolo
file binario in cui i primi `size` byte sono i codici schermo e i successivi
`size` byte sono i valori della RAM colore. Utilizzare MAP_COPY con **Combined
.bin** selezionato e puntare **Source addr** alla posizione in cui viene
caricato questo file (ad esempio tramite INCBIN a `$C000`):

```
* = $C000
INCBIN "map-color.bin" @ $C000 ; codici schermo $C000–$C3E7, colore $C3E8–$C7CF
* = $0801

; ...
MAP_COPY src=$C000 dst=$0400 size=1000 combined color_dst=$D800
```

**Sintassi della modalità esperto:**
```
.map_copy $C000, $0400, 1000 ; solo schermo
.map_copy $C000, $0400, 1000, auto, $D800 ; combinato (colore a src+dimensione)
.map_copy $C000, $0400, 1000, $C3E8, $D800 ; indirizzo sorgente colore esplicito
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Copia un'area di caratteri 16×16 da un blocco di codice schermo compatto da 256
byte, più un blocco RAM Colore corrispondente da 256 byte. È pensato per le
esportazioni Charset Canvas e per piccoli blocchi di tile/immagini, dove la
scrittura di sedici righe separate di MAP_COPY risulterebbe eccessiva.

**Layout predefinito:**

| Dati                           | Indirizzo predefinito       |
| ------------------------------ | --------------------------- |
| Codici schermo 16×16           | Indirizzo sorgente (`src`)  |
| Valori di colore 16×16         | `src + 256`                 |
| Destinazione RAM dello schermo | `$0400 + riga×40 + colonna` |
| Destinazione RAM a colori      | `$D800 + riga×40 + colonna` |

**Sintassi della modalità esperto:**
```
.map_copy16x16 $3000, 12, 4
.map_copy16x16 $3000, 12, 4, $0400, $3100, $D800
```

La forma abbreviata copia i byte dello schermo da `$3000`, i byte del colore da
`$3100` e posiziona il blocco 16×16 nella colonna 12, riga 4. Le posizioni
valide in alto a sinistra sono `col = 0..24` e `row = 0..9`, quindi l'intera
area 16×16 rimane sullo schermo di testo 40×25 del C64.

**Comportamento generato:**

- Genera sedici copie di righe in linea.
- Ogni riga copia 16 byte dello schermo e 16 byte del colore.
- Non è necessario alcun JSR; il codice viene emesso direttamente nella
  posizione della macro.
- Funziona sia con la modalità caratteri normale che con la modalità caratteri
  multicolore; i byte della RAM Colore contengono il bit di abilitazione del
  colore del carattere/multicolore di ciascuna cella.

Abbinamento tipico con Charset Canvas:

```
* = $ 0801
    SEI
    LDA #$00
    STA$D021
    LDA #$05
    STA$D022
    LDA #$0D
    STA$D023
    .map_copy16x16 $ 3000, 12, 4
ciclo continuo:
    Ciclo JMP

.incbin "16x16+ram+color.bin", $ 3000
.incbin "16x16+charset.bin", $2000
```

---

<a id="sprite_anim"></a>
### SPRITE_ANIM

Avanza il frame di animazione di uno sprite a ogni chiamata e aggiorna il
puntatore ai dati dello sprite VIC-II. Memorizza un byte per frame in una
tabella (il numero della pagina dei dati dello sprite = `indirizzo_dati / 64`),
punta SPRITE_ANIM a tale tabella e chiamala una volta per frame di gioco, senza
bisogno di JSR.

| Campo                           | Descrizione                                                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Sprite #                        | Numero dello sprite 0–7                                                                                        |
| Indirizzo dell'elenco dei frame | Indirizzo esadecimale della tabella dei frame: un byte per frame, ogni byte = pagina sprite (`data_addr / 64`) |
| Conteggio dei fotogrammi        | Numero totale di fotogrammi (1–255)                                                                            |
| Telaio ZP                       | Byte di pagina zero utilizzato come contatore di frame (ad esempio `FB`)                                       |

**ASM generato (sprite 0, 4 fotogrammi, ZP `$FB`, elenco a `$C100`):**
```
INC $FB ; incrementa il contatore dei frame

LDA $FB

CMP #$04 ; conteggio dei frame

BCC *+6 ; se il contatore è inferiore al conteggio, salta il reset

LDA #$00

STA $FB

TAX ; X = indice del frame corrente

LDA $C100,X ; carica la pagina dati dello sprite per questo frame

STA $07F8 ; aggiorna il puntatore dello sprite 0 ($07F8 + sprite#)
```

**Dimensione:** 19 byte.

**Uso tipico:**
```
Tabella dei frame:

byte $21, $22, $23, $24; 4 frame a $0840, $0880, $08C0, $0900

Ciclo di gioco:

WAIT_RASTER ($FF)

SPRITE_ANIM (sprite=0, list=$C100, count=4, zp=$FB)
Ciclo di gioco JMP
```

**Sintassi della modalità esperto:**
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; esempio:
.sprite_anim 0, C100, 4, FB
```

> **Suggerimento:** Posiziona la tabella dei frame come blocco RAWBYTES a un
> indirizzo fisso. Il byte ZP del contatore (`$FB`) deve essere inizializzato a
> `$00` prima della prima chiamata. Se il tuo codice utilizza `$FB` per
> qualcos'altro, scegli una posizione ZP libera.

---

<a id="score_bcd"></a>
### PUNTEGGIO_BCD

Aggiunge un valore a virgola fissa a un punteggio BCD multibyte memorizzato in
memoria, quindi visualizza ogni cifra nella RAM dello schermo come carattere di
codice schermo. Utilizza la modalità decimale 6502 (`SED`/`CLD`) per
l'aritmetica BCD sicura al riporto: non è necessario alcun riporto manuale.

| Campo                   | Descrizione                                                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Indirizzo del punteggio | Indirizzo esadecimale dei byte del punteggio BCD (ad esempio `C200`). Il byte meno significativo inizia per primo.         |
| Cifre                   | Numero di byte BCD (ogni byte contiene due cifre: `$99` = "99"). `4` byte = fino a 99999999.                               |
| Aggiungi punti          | Valore decimale da aggiungere per ogni chiamata (ad esempio `100`).                                                        |
| Indirizzo dello schermo | Dove scrivere i codici numerici dello schermo (ad esempio `0400`). Un byte per cifra (nibble più significativo per primo). |

**Sintassi esperta:**
```
.score_bcd $C200, 4, 100, $0400
```

**ASM generato (4 byte, +100 punti, punteggio a `$C200`, schermo a `$0400`):**
```
SED ; abilita la modalità BCD/decimale

CLC

LDA $C200 ; byte 0 (cifre 1-2)

ADC #$00 ; byte basso di 100 in BCD = $00

STA $C200

LDA $C201 ; byte 1 (cifre 3-4)

ADC #$01 ; byte centrale di 100 in BCD = $01 (il riporto si propaga)

STA $C201

LDA $C202

ADC #$00

STA $C202

LDA $C203

ADC #$00

STA $C203

CLD ; torna alla modalità binaria

; visualizza le cifre

LDX #$00
ciclo cifre:

LDA $C200,X

PHA

LSR : LSR : LSR : LSR ; nibble alto → nibble basso

ORA #$30 ; + codice schermo '0'

STA $0406,X ; allineato a destra: screen_addr + (digits*2 - 2) - X*2


E #$0F ; nibble basso

ORA #$30

STA $0407,X

INX

CPX #$04

BNE digit_loop
```

**Dimensione:** `3 + cifre×8` byte (overhead SED + CLC + CLD + 8 byte per byte
BCD per ADC + ciclo di visualizzazione).

**Sintassi della modalità esperto:**
```
.score_bcd $C200, 4, 100, $0400
```

> **Suggerimento:** Inizializza i byte del punteggio a `$00` all'avvio.
> L'indirizzo del punteggio dovrebbe trovarsi nella pagina zero o nella RAM
> assoluta, non nella ROM. L'indirizzo dello schermo dovrebbe puntare alla cella
> della cifra più a sinistra; le cifre vengono scritte da sinistra a destra (il
> byte più significativo per primo).

> **Intervallo BCD:** `cifre=4` byte → 8 cifre decimali → punteggio massimo
> 99.999.999. Ogni byte codifica due cifre BCD: `$00`–`$99`.

---

## 11. Collegamenti alla Knowledge Base

Collegamenti di riferimento rapido disponibili nell'app alla voce **Base di
conoscenza**:

### RetroDebugger

[RetroDebugger](https://github.com/slajerek/RetroDebugger) è un debugger
multipiattaforma per Commodore 64 con supporto per breakpoint, ispezione della
memoria e disassemblaggio con riconoscimento delle etichette.

**Configurazione:** Apri **Impostazioni → Configura l'eseguibile di
RetroDebugger** e indicagli il percorso del binario di `RetroDebugger`.

**Avvia:** Fai clic su **Debug (RetroDebugger)** nella barra degli strumenti.
L'app:

1. Assembla il programma in un file `.prg` in una directory temporanea.
2. Scrivi un file di punti di interruzione **** (`breakpoints.txt`) — un `break
   $ADDR` per blocco contrassegnato.
3. Scrivi un file di simboli ** (**symbols.txt`) nel formato di etichetta di
   Vice/RetroDebugger (`al C:addr .name`). Tutti i blocchi LABEL e CONST sono
   inclusi.
4. Scrivi anche i file sidecar in stile C64Debugger accanto al PRG compilato:
   `.dbg`, `.sym` e `.vs`.
5. Avvia RetroDebugger con:
   ```
   RetroDebugger -prg <file.prg> -breakpoints <breakpoints.txt> -symbols <symbols.txt> [flags]
   ```

### Blocchi di interruzione

Fai clic sull'icona del punto di interruzione (●) su un blocco di istruzioni
qualsiasi per attivarlo come punto di interruzione. I blocchi con punto di
interruzione vengono evidenziati in rosso. I loro indirizzi vengono scritti nel
file dei punti di interruzione ad ogni avvio del debugger.

### Flag di debug (scheda Opzioni)

| Attiva/disattiva   | Bandiera          | Effetto                                                                     |
| ------------------ | ----------------- | --------------------------------------------------------------------------- |
| `-salto` ATTIVO    | `-salta $ADDR`    | Passa direttamente all'indirizzo di avvio del programma dopo il caricamento |
| `-riprendi` ATTIVO | `-riprendi`       | Riattivare immediatamente il debugger al caricamento                        |
| `-attendi` ON      | `-attendere <ms>` | Attendi `<ms>` millisecondi prima di riprendere — 500 ms o 1000 ms          |

> **Suggerimento:** Per la maggior parte dei programmi, abilita `-jmp` e
> `-unpause` per l'avvio automatico istantaneo. Usa `-wait 500` o `-wait 1000`
> quando il tuo programma imposta IRQ o musica SID che necessita di tempo per
> l'inizializzazione prima del primo raster.

### VICE Monitor (hot reload, live watch, profiler)

Il pulsante **VICE Monitor** nella barra degli strumenti apre una finestra non
modale che comunica con VICE in esecuzione tramite il suo monitor binario.
**Esegui (VICE)** avvia VICE con il monitor sulla porta 6502 (**Impostazioni →
Monitor remoto VICE**, attivo per impostazione predefinita). Chiudi e riavvia un
VICE avviato in un altro modo. L'intestazione mostra lo stato della connessione;
*Disponibile solo nell'app desktop* appare nell'anteprima del browser.

| Pulsante                                               | Cosa fa                                                                                                                                                                                     |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ricarica a caldo**                                   | Scrive il programma assemblato nella RAM del VICE in esecuzione (solo gli intervalli occupati, gli spazi vuoti vengono lasciati inalterati). Utilizzalo per i dati: sprite, tabelle, testo. |
| **Ricarica a caldo + riavvio**                         | Lo stesso, quindi si riavvia all'indirizzo SYS (reset dello stack; il `RTS` finale ritorna a `READY.`).                                                                                     |
| **Ricaricamento automatico a caldo dopo le modifiche** | Si ricarica e si riavvia circa un secondo dopo ogni modifica, se il programma viene assemblato correttamente.                                                                               |
| **Guarda in diretta**                                  | Aggiorna la lista di controllo ogni 0,4 secondi; un valore modificato lampeggia.                                                                                                            |
| **Profilo**                                            | Esegue un campionamento del contatore di programma per circa 5 secondi (fare nuovamente clic per interrompere prima).                                                                       |

**Elenco di controllo:** digita un'etichetta o un indirizzo — `score`, `$D020`,
`53280`, oppure con un conteggio di byte `table, 8` — e premi **+** o Invio.
Ogni riga mostra l'indirizzo, i byte in esadecimale e, per 1 o 2 byte, il valore
decimale. In modalità Ultimate Basic i nomi provengono dall'ultima build UB
(variabili, etichette, subroutine, array).

**Risultato del profiler:** due tabelle. *Routine* raggruppa i campioni in base
all'etichetta più vicina (in Ultimate Basic: per `sub`), con la quota in % e le
linee raster su cui è stato eseguito: il tempo trascorso nella ROM KERNAL o
BASIC è elencato separatamente. *Line* elenca le linee sorgente più costose; fai
clic su una per accedervi. Ogni campione mette brevemente in pausa l'emulatore,
quindi il profilo è un'immagine statistica, non un conteggio esatto dei cicli.

---

## 12. Esportazione ed esecuzione D64

La versione 1.5.1 aggiunge la possibilità di impacchettare il programma (e file
di dati aggiuntivi) in un'immagine disco C64 D64 e di avviarla in VICE, oppure
di esportare l'immagine disco per utilizzarla altrove.

| Risorsa                                        | URL                                                            |
| ---------------------------------------------- | -------------------------------------------------------------- |
| Riferimento ai codici operativi 6502           | http://www.6502.org/tutorials/6502opcodes.html                 |
| Funzioni del kernel C64                        | https://sta.c64.org/cbm64krnfunc.html                          |
| Mappa della memoria del C64                    | https://sta.c64.org/cbm64mem.html                              |
| Codici colore C64                              | https://sta.c64.org/cbm64col.html                              |
| Articolo VIC-II                                | https://www.cebix.net/VIC-Article.txt                          |
| Codice sorgente C64                            | https://codebase.c64.org/                                      |
| Il Turbo Assembler                             | https://turbo.style64.org/                                     |
| RetroDebugger                                  | https://github.com/slajerek/RetroDebugger/                     |
| Ambiente di sviluppo del sistema operativo C64 | https://www.c64os.com/c64os/programmersguide/?s=devenvironment |
| Convertitore di immagini png2c64               | https://png2c64.app/                                           |

---

## 12b. Esportazione CRT (cartuccia Magic Desk 64K)

**Menu → Build → Build CRT** produce un'immagine di cartuccia per Commodore 64
(`.crt`, **tipo di cartuccia 19 — Magic Desk / Domark / HES Australia**) che
funziona su VICE, TheC64, hardware reale tramite EasyFlash / Kung Fu Flash e
slot per cartucce Ultimate II+ da 1541. È disponibile sia in **modalità a
blocchi** che in **modalità esperto** e, a partire dalla build attuale, anche in
**modalità UltimateBasic**.

### Cosa viene spedito nel carrello

Il pulsante **Esegui** della barra degli strumenti è stato sostituito da un
pulsante **diviso**:

| Parte                     | Azione                                                   |
| ------------------------- | -------------------------------------------------------- |
| **▶ Esegui** (principale) | Esegue la modalità di esecuzione attualmente selezionata |
| **▾** (freccia)           | Apre il selettore di modalità                            |

**Modalità di esecuzione disponibili:**

| Modalità               | Descrizione                                                                                                                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Esegui come PRG**    | Assembla in un file temporaneo `.prg` e avvia VICE direttamente. Comportamento classico.                                                                                                                                                                |
| **Esegui tramite D64** | Assembla, crea un'immagine disco `.d64` (usando c1541), aggiungi eventuali file extra configurati, quindi avvia VICE dal disco. Usa questo metodo ogni volta che il tuo programma carica file in fase di esecuzione (ad esempio con la macro LOADFILE). |
| **Esegui su hardware** | Assemblare in PRG e inviarlo a un dispositivo **1541 Ultimate / Ultimate 64** tramite la rete locale. Vedere [Sezione 13](#13-hardware-settings).                                                                                                       |
| **Kung Fu Flash 2**    | Assembla in formato PRG e caricalo tramite seriale USB su un vero C64/C128 con una cartuccia **Kung Fu Flash 2**. Vedi [Kung Fu Flash 2](#kung-fu-flash-2).                                                                                             |

La modalità selezionata viene salvata tra una sessione e l'altra.

### Indirizzo di caricamento e punto di ingresso

La build CRT non utilizza mai Exomizer (il depacker non può essere eseguito
dalla ROM della cartuccia). Compila la scheda corrente con la pipeline di avvio
automatico standard e prende l'indirizzo di caricamento dall'intestazione PRG e
il punto di ingresso dal target SYS:

1. **Modalità blocco/esperto con stub BASIC SYS attivo:** caricamento = `$0801`,
   ingresso = il target SYS (in genere `$080D` o l'origine dell'utente).
2. **Modalità blocco/esperto con stub BASIC SYS disattivato:** caricamento =
   origine utente (con il classico fallback `$0801 → $C000`), ingresso =
   indirizzo di caricamento.
   - **Nome** — come appare nella directory D64 (max 16 caratteri, maiuscolo
     automatico).
   - **Addr** (indirizzo di caricamento, facoltativo) — se fornito, viene
     anteposto un header PRG di 2 byte. Lasciare vuoto per scrivere byte grezzi
     senza header.
   - **Dst** (destinazione di decompressione, solo con EXO) — dove il depacker
     dovrebbe depositare i dati sul C64. Quando EXO è abilitato, l'extra viene
     compresso con `exomizer mem -l <Addr> file,<Dst>` prima di essere scritto
     sul D64. La compensazione dell'offset di sicurezza +2 viene applicata
     automaticamente.
   - **EXO** — casella di controllo che attiva la compressione inversa in
     modalità `mem` per questa voce. La dimensione su disco è in genere il 5-20%
     dell'originale.
3. **Modalità UltimateBasic:** sia il caricamento che l'ingresso provengono
   dalla mappa del compilatore UB (`build.map.loadAddress`). Lo stub di avvio
   automatico UB all'interno del payload viene quindi eseguito esattamente come
   avverrebbe dopo `LOAD "...",8,1 : RUN` dal disco.

L'indirizzo di origine visualizzato nell'output ASM viene mantenuto; il
caricatore si limita a copiare l'immagine di memoria piatta dal PRG nella RAM e
salta al punto di ingresso una volta che la ROM della cartuccia è stata
deallocata.

### Limite di dimensione

Poiché il payload è memorizzato linearmente e `assembleProgramToPrg()`
restituisce un buffer `minAddr..maxAddr` piatto con spazi riempiti di zeri, un
programma con segmenti ORG ampiamente distanziati (ad esempio `$0801` + `$C000`
+ `$E000`) conta ogni byte intermedio nel budget di 65 408 byte. Se si supera il
limite, la compilazione si interrompe con un errore `saveCrtTooLarge`: è
necessario comprimere il layout di memoria o suddividere i dati.

L'esempio **loadfile-demo** viene fornito preconfigurato con `DEMO-COLORS.PRG`
come file aggiuntivo. Selezionalo, apri **Esegui tramite D64** e fai clic su
**Esegui** per vedere l'intero flusso di caricamento in azione.

> **⚠️ Avvertenza importante: leggere prima di spedire un CRT**

### Compatibilità

L'icona nella barra degli strumenti dopo l'Editor di curve apre l'Editor D64,
uno strumento autonomo per lavorare direttamente con un'immagine D64 esistente,
indipendentemente dal programma attualmente aperto. A differenza della finestra
di dialogo Esporta in D64 mostrata sopra (che crea sempre un nuovo disco dal
file PRG compilato), l'Editor D64 modifica un'immagine disco direttamente
tramite c1541, fungendo quindi anche da gestore di dischi leggero.

**Menu File ▾:**

| Piattaforma           | Azione                                                 |
| --------------------- | ------------------------------------------------------ |
| VICE (`x64sc`, `x64`) | Funziona tramite **File → Allega immagine cartuccia**. |
| TheC64 / TheC64 Mini  | Funziona tramite il caricatore di cartucce integrato.  |
| Kung Fu Flash         | Funziona — modalità nativa di Magic Desk.              |
| Cartuccia EasyFlash   | Funziona se programmato come Magic Desk.               |

**Barra degli strumenti:**

| Icona                                | Azione                                                                                                                                                      |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Aggiungi programma**               | Seleziona un file locale e scrivilo nella directory del disco.                                                                                              |
| **Estratto selezionato**             | Salva i byte della voce selezionata in un file locale `.prg`.                                                                                               |
| **Rinomina selezionato**             | Modifica il nome della voce direttamente nella tabella: premi Invio per confermare, Esc per annullare.                                                      |
| **Elimina gli elementi selezionati** | Rimuovere la voce selezionata dal disco.                                                                                                                    |
| **Aggiorna**                         | Rileggere la directory, ad esempio dopo aver modificato il disco con un altro programma.                                                                    |
| **Salva**                            | Riscrivi le modifiche della copia di lavoro nel file `.d64` reale, creando prima un backup automatico. Abilitato solo in presenza di modifiche non salvate. |

**Aggiunta di un programma:** selezionando un file che termina già con `.prg`
richiede solo un **Nome** e un **Tipo di disco** (PRG/SEQ/USR/REL) — un `.prg`
contiene già la propria intestazione di indirizzo di caricamento, quindi viene
scritto invariato. Selezionando qualsiasi altro file (ad esempio un `.bin` non
elaborato) viene inoltre visualizzato:

- **Indirizzo di caricamento** (esadecimale, facoltativo) — anteponi
  un'intestazione PRG di 2 byte a questo indirizzo; lascia vuoto per scrivere i
  byte raw.
- **Indirizzo di decompressione** (esadecimale, facoltativo) — utilizzato solo
  insieme a Exomizer; l'indirizzo di destinazione in cui il decompressore deve
  estrarre i dati.
- Casella di controllo **Exomizer** — comprime il file prima della scrittura,
  utilizzando le stesse modalità di compressione `mem`/`sfx` dei file aggiuntivi
  nella finestra di dialogo Esporta in D64 sopra.

L'elenco delle directory visualizza i nomi dei file con lo stesso carattere e
stile maiuscolo di un vero elenco C64 `LOAD"$",8`.

**Flusso di lavoro di salvataggio:** ogni modifica — aggiunta, estrazione,
ridenominazione, eliminazione e modifiche dei byte dell'Editor a blocchi — viene
applicata a una copia di lavoro privata dell'immagine disco, non al file reale.
Il pulsante **Salva** nella barra degli strumenti (abilitato quando sono
presenti modifiche non salvate) sovrascrive la copia di lavoro sul file `.d64`
reale, eseguendo prima un backup automatico; l'intestazione mostra un indicatore
**•** finché le modifiche non sono salvate e la chiusura dell'editor o
l'apertura di un altro disco con modifiche non salvate richiede conferma anziché
scartarle. **Salva con nome…** (menu File ▾) scrive la copia di lavoro in un
nuovo percorso e continua la modifica lì.

**Editor di blocchi:** l'icona della griglia della barra degli strumenti passa a
una visualizzazione di traccia/settore grezzo sotto la directory: una mappa di
blocchi cliccabile colorata dalla bitmap libera/utilizzata del BAM (con il BAM e
la catena di directory contrassegnati separatamente), una griglia esadecimale
per byte per il blocco selezionato da 256 byte e la navigazione settore
Precedente/Successivo. Le modifiche ai blocchi seguono lo stesso flusso di
lavoro copia di lavoro/Salvataggio delle azioni della directory sopra.

> **Requisito:** come per l'esportazione in D64, l'editor D64 richiede VICE
> (`c1541`) configurato in [Impostazioni hardware](#13-hardware-settings).

---

## 13. Impostazioni hardware

Apri tramite **Impostazioni → Impostazioni hardware…** nel menu della barra
degli strumenti. Tutti i percorsi hardware esterni e la configurazione di rete
si trovano qui.

### Emulatore VICE

- **8 × 8 KB di banchi** a `$8000`, commutazione di banco tramite `$DE00`
  (convenzione Magic Desk: 3 bit bassi = banco, bit 7 = disabilita carrello).
- **Il banco 0** contiene un'intestazione di 128 byte + boot loader:
  - `$8000/$8002` I vettori di avvio freddo + caldo puntano a `$8009`.
  - `$8004–$8008` = la firma `CBM80` richiesta dal codice di reset KERNAL.
  - `$8009–$807F` = il caricatore: SEI / inizializzazione dello stack / `JSR
    $FDA3` (IOINIT) / `JSR $FD50` (RAMTAS) / `JSR $FD15` (RESTOR) / `JSR $FF5B`
    (CINT), quindi un ciclo di copia di byte che trasmette il payload dalla ROM
    della cartuccia alla RAM e cambia banco quando `$FC` raggiunge `$A0`. Alla
    fine copia un piccolo stub di uscita in $0100, disabilita il carrello con
    LDA #80 : STA $DE00 e salta al punto di ingresso.
- **Il payload** inizia a `$8080` nel banco 0 e si espande nei banchi 1–7
  secondo necessità. Il payload massimo = `8 * 8192 − 128 = 65 408 byte`.

### Exoizer

**Flusso di lavoro:**

- Installa il file binario di Exomizer:
- Configura il percorso in **Impostazioni hardware → sezione Exomizer**.
- Abilita la casella di controllo **Esegui con Exomizer** nel menu
  **Impostazioni**.

Exomizer funziona allo stesso modo su Windows e macOS: la CLI viene richiamata
dal backend di Tauri; l'integrazione non presenta alcuna caratteristica
specifica per una singola piattaforma.

### Retro Debugger

Vedere [Sezione 9]{1} per la documentazione completa del debugger.

> **⚠️ Avvertenza importante: leggere prima di spedire un CRT**
> 
> Il caricatore chiama il KERNAL **`RESTOR` ($FD15)** come parte della sequenza
> di reset standard. Questo riscrive intenzionalmente i vettori I/O standard a
> `$0314/$0315`, `$0316/$0317`, `$0318/$0319`, `$0328/$0329` e simili
> riportandoli ai loro valori predefiniti della ROM. Conseguenze:
> 
> - **Qualsiasi hook IRQ / NMI / BRK impostato prima dell'avvio del CRT viene
>   cancellato.** Il tuo programma deve installarli da solo dopo l'ingresso,
>   esattamente come un `CARICA "",8,1 : ESEGUI` da nastro/disco.
> - **I programmi UltimateBasic** che si basano su vettori KERNAL non
>   predefiniti attivi all'ingresso potrebbero richiedere una chiamata esplicita
>   `SYS` o init nello stub di avvio automatico. L'avvio automatico UB standard
>   funziona immediatamente; le librerie di estensione che agganciano i vettori
>   *before* `RUN` non lo fanno.
> - **CIA1 / CIA2** vengono reinizializzati da `IOINIT`. Le impostazioni
>   personalizzate del timer (IRQ raster, lettore musicale CIA-A) devono essere
>   riprogrammate dopo l'inserimento.
> - Il carrello è disabilitato da uno stub di 8 byte in **RAM a `$0100`** in
>   modo che `STA $DE00` non possa essere interrotto da un prelievo ROM errato.
>   Non fare affidamento sul fatto che `$0100–$0107` contenga l'immagine in cima
>   allo stack all'ingresso: il primo push in RAM sovrascrive lo stub.
> 
> Se un CRT funziona in VICE ma non sull'hardware reale, la prima cosa da
> verificare è se il programma presuppone uno specifico vettore KERNAL o uno
> stato del timer CIA all'avvio. Installa esplicitamente lo stato nella tua
> routine di inizializzazione e si comporterà allo stesso modo su entrambi.

### C64 Ultimate / 1541 Ultimate

| Piattaforma                     | Descrizione                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| **Host (IP)**                   | Indirizzo IP del dispositivo (ad esempio `192.168.1.100`)            |
| **Password**                    | Opzionale — se il dispositivo richiede l'autenticazione              |
| **Test di connessione**         | Invia una richiesta di test a `/v3/runners/info`; mostra OK o errore |
| Cartuccia EasyFlash             | Funziona se programmato come Magic Desk.                             |
| 1541 Ultimate II+ / Ultimate 64 | Funziona tramite **Cartuccia → Carica immagine carrello**.           |
| Camaleonte / Turbo Camaleonte   | Funziona.                                                            |

---

## 14. Editor visivi (Toolkit)

Il menu **Toolkit** della barra degli strumenti raggruppa gli editor di dati
visivi che condividono tutti un menu File (`File ▾`) comune per Carica BIN /
Salva BIN / Esporta in blocchi / Salva su D64. Ogni editor produce dati grezzi
`.bin` che possono essere inseriti in un programma con `INCBIN` o aggiunti
direttamente a un disco D64 tramite la voce **Salva su D64**.

### Editor ad alta risoluzione/multicolore

| Collocamento              | Descrizione                                                                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Interruttore modalità     | **Multicolore** La casella di controllo commuta tra alta risoluzione (monocromatico per cella) e multicolore (4 colori per cella). |
| **Stato**                 | Indica se il percorso del file eseguibile è valido e accessibile.                                                                  |
| ** Monitor remoto VICE ** | Avvia VICE con il monitor binario sulla porta 6502, necessario per il [VICE Monitor](#vice-monitor-hot-reload-live-watch-profiler) |

Editor di bitmap a livello di pixel con modalità ad alta risoluzione 320×200 e
modalità multicolore 160×200. Apribile tramite Toolkit → Editor ad alta
risoluzione.

### Editor di sprite

| Collocamento | Descrizione                                                                       |
| ------------ | --------------------------------------------------------------------------------- |
| Cornici      | Aggiungi/rimuovi/riordina le cornici; la striscia di cornici è mostrata in basso. |
| Modalità     | Interruttore monocromatico/multicolore.                                           |
| **Stato**    | Indica se il percorso del file eseguibile è valido e accessibile.                 |

**Flusso di lavoro:**
1. Installa il file binario di Exomizer:
   - **Windows:** Scarica il file precompilato `win32/exomizer.exe` da
     https://bitbucket.org/magli143/exomizer/wiki/Home o da
     https://csdb.dk/release/?id=244342.
   - **macOS:** `brew install exomizer` (installa la build ufficiale 3.1.2 di
     Magnus Lind).
2. Configura il percorso in **Impostazioni hardware → sezione Exomizer**.
3. Abilita la casella di controllo **Esegui con Exomizer** nel menu
   **Impostazioni**.
4. Tutte le azioni **Run** (PRG, D64, hardware) e **Build** (Build PRG, Build
   D64) ora comprimeranno il programma assemblato tramite `exomizer sfx sys`
   prima di avviarlo o salvarlo.

Exomizer funziona allo stesso modo su Windows e macOS: la CLI viene richiamata
dal backend di Tauri; l'integrazione non presenta alcuna caratteristica
specifica per una singola piattaforma.

**Internamente vengono utilizzate due modalità di compressione:**

| Modalità             | Utilizzato da                                                                                | Convenzione di chiamata                                                                                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `sfx sys`            | Compila/Esegui con l'opzione Exomizer attivabile/disattivabile (percorso principale del PRG) | PRG autoestraente con decruncher incorporato; l'impostazione Border-flash controlla `-x1` vs `-n`                                                                                                            |
| `mem` (all'indietro) | Esegui tramite D64 → casella di controllo per file **EXO**                                   | Comprime ogni file aggiuntivo in un flusso in modalità `mem`; il programma lo decomprime in fase di esecuzione tramite la macro **EXODECRUNCH** e un decompressore precompilato (`samples/exo-decrunch.bin`) |

> **Suggerimento:** Se il percorso di Exomizer non è configurato ma la casella
> di controllo è abilitata, viene visualizzato un messaggio di errore chiaro
> anziché l'avvio. Disabilitare la casella di controllo per eseguire senza
> compressione.

> **Test di integrazione:** `test cargo --test exomizer_integration` (in
> `src-tauri/`) verifica il ciclo completo di compressione e decompressione in
> modalità memoria su un emulatore 6502.

### Browser delle ROM dei personaggi del C64 ("Mappa dei caratteri")

| Collocamento         | Descrizione                                                                                                                                                                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Due set di caratteri | Scheda 1: **Set 1 — Superiore/Grafica** (modalità predefinita dopo l'accensione). Scheda 2: **Set 2 — Inferiore/Superiore** (dopo lo switch `$0E`).                                                                                                   |
| **Stato**            | Griglia 16×16 di tutti i 256 caratteri. Clicca su un glifo per visualizzare il pannello dei dettagli: vista ingrandita 8×8 pixel, codice schermo (decimale + esadecimale), codici PETSCII (sia predefiniti che traslati) e la bitmap grezza a 8 byte. |

Visualizzatore di sola lettura della ROM dei caratteri del C64 (il font PETSCII
integrato). Si apre tramite la voce **C64 chargen** nel menu Toolkit. Utile per
trovare il codice schermo di un glifo prima di scriverlo con `RAWBYTES` o
`TEXT`.

### Editor dei personaggi (Charset)

Editor di caratteri 8×8 con supporto per 256 caratteri. Apribile tramite Toolkit
→ Editor di caratteri.

| Collocamento            | Descrizione                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| Carica la ROM           | Importa il charset della ROM C64 direttamente da `chargen` di VICE (senza selettore di file). |
| Carica `.bin`           | Importa un file binario esterno con set di caratteri da 2048 byte.                            |
| Anteprima per carattere | Griglia di 16 caselle con tutti i 256 glifi, con la cella corrente evidenziata.               |

**Flusso di lavoro:**
1. Collega il 1541 Ultimate / Ultimate 64 alla tua rete locale.
2. Inserisci il suo indirizzo IP (e la password, se impostata) nelle
   Impostazioni hardware.
3. Seleziona **Esegui su hardware** dal menu di esecuzione diviso.
4. Fai clic su **▶ Esegui**: il PRG viene compilato e inviato al dispositivo
   tramite HTTP POST a `/v3/runners/prg`. Il dispositivo lo carica ed esegue
   immediatamente sul C64.

> **Suggerimento:** Non sono necessari cavi USB o driver: l'API REST è integrata
> nel firmware Ultimate. Il computer e il dispositivo devono trovarsi sulla
> stessa rete locale.

### Editor di tela Charset

Strumento di creazione di schermate a schermo intero a partire da un set
completo di 256 caratteri. Apribile tramite Toolkit → Charset Canvas.

La tela è composta da 16×16 caratteri. In modalità monocromatica, ciò
corrisponde a un'area di lavoro di 128×128 pixel; in modalità caratteri
multicolore, l'area di lavoro diventa di 64×128 pixel, utilizzando le reali
regole di stampa multicolore dei caratteri del C64.
- un Commodore 64 / C128 con una cartuccia **Kung Fu Flash 2** inserita, acceso;
- **Firmware Kung Fu Flash v2.07 o successivo** sulla cartuccia: le versioni
  precedenti del firmware non supportano il protocollo di caricamento utilizzato
  da Visual Assembler. Versioni del firmware:
  <https://codeberg.org/KimJorgensen/KungFuFlash2/releases/>;
- un cavo **USB** che collega la cartuccia al computer su cui è in esecuzione
  Visual Assembler (viene visualizzato come una porta seriale virtuale).

| Collocamento              | Descrizione                                                                                                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Monocromatico/multicolore | La modalità monocromatica memorizza glifi 8×8 a 1 bit. La modalità multicolore memorizza coppie di pixel orizzontali a due bit e contrassegna le celle utilizzate con il bit 3 della RAM Colore. |

**Flusso di lavoro:**
1. Inserisci la cartuccia di Kung Fu Flash 2 nello slot del C64, accendi il
   computer e collega il cavo USB al tuo PC/Mac.
2. Apri **Impostazioni hardware** e controlla la sezione **Kung Fu Flash 2**: la
   porta dovrebbe essere già compilata.
3. Seleziona **Kung Fu Flash 2** dal menu di esecuzione divisa (la scelta viene
   memorizzata e salvata anche nei file di progetto).
4. Fare clic su **▶ Esegui **. Il programma viene compilato, la cartuccia viene
   riavviata nel suo caricatore MENU (un breve "tocco" a 1200 baud della porta
   seriale), segue un breve handshake e il PRG viene caricato. Al termine del
   trasferimento, il programma è in esecuzione sulla macchina reale.

Funziona sia in modalità **Blocco**, **Esperto** che **Ultimate Basic**; i
programmi Ultimate Basic vengono compilati dal file di avvio del progetto.

> **Limiti e controlli:** il PRG deve contenere l'indirizzo di caricamento di
> due byte più almeno un byte di dati, deve rientrare nello spazio di
> indirizzamento di 64 KiB del C64 e non deve superare la dimensione accettata
> dal caricatore della cartuccia. Gli errori — porta non configurata, porta non
> apribile, cartuccia non restituita dal MENU o caricamento rifiutato — vengono
> segnalati in un messaggio toast con la motivazione esatta.

> **Suggerimento:**se preferisci un'immagine della cartuccia invece di un
> caricamento live, **Build CRT** (Magic Desk 64K) funziona anche su Kung Fu
> Flash — vedi [Sezione 12b](#12b-crt-export-magic-desk-64k-cartridge).

---

---

### Controllo di versione (git)

| Collocamento                                                 | Descrizione                                                                                                                                                                                   |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Voci di salvataggio automatico nel controllo di versione** | Aggiunge una voce di salvataggio automatico alla cronologia delle versioni circa 2,5 secondi dopo aver terminato la modifica (anche per le schede di progetto nella cronologia del progetto). |
| **Scegli git.exe…**                                          | Individuare il file eseguibile `git` (`git.exe` su Windows)                                                                                                                                   |
| **Rilevamento automatico**                                   | Cancella il percorso scelto e cerca nel PATH e nelle solite cartelle di installazione                                                                                                         |
| **Usa Git quando il progetto si trova in un repository**     | Apre la finestra di dialogo Controllo versione in modalità Git per i file all'interno di un repository Git                                                                                    |
| **Stato**                                                    | Mostra la versione di git oppure indica che git non è stato trovato (il sistema di controllo versione integrato continua a funzionare).                                                       |

## 14. Editor visivi (Toolkit)

Il menu Toolkit** della barra degli strumenti raggruppa gli editor di dati
visivi che condividono tutti un menu File (`File ▾`) comune per Carica BIN /
Salva BIN / Esporta in blocchi / Salva su D64. Ogni editor produce dati `.bin`
grezzi che possono essere inseriti in un programma con `INCBIN` o aggiunti
direttamente a un disco D64 tramite la voce **Salva su D64**.

Le finestre di dialogo dell'editor visuale possono essere trascinate tramite le
intestazioni nell'intera area di lavoro di Visual Assembler. Una finestra di
dialogo senza posizione salvata si apre centrata; dopo essere stata spostata, la
sua ultima posizione viene memorizzata nelle impostazioni dell'interfaccia
utente e ripristinata alla successiva apertura.

### Editor ad alta risoluzione/multicolore

Editor di bitmap a livello di pixel con modalità ad alta risoluzione 320×200 e
modalità multicolore 160×200. Apribile tramite Toolkit → Editor ad alta
risoluzione.

| Caratteristica                     | Descrizione                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Interruttore modalità              | **Multicolore** La casella di controllo commuta tra alta risoluzione (monocromatico per cella) e multicolore (4 colori per cella).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Utensili                           | Matita, gomma, linea, rettangolo, rettangolo pieno, ovale, ovale pieno, riempimento a inondazione, carta a celle, seleziona.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Carta cellulare (alta risoluzione) | L'alta risoluzione consente due colori in ogni cella 8×8: l'inchiostro (pixel impostati, nibble alto del byte di RAM dello schermo della cella) e la carta (pixel cancellati, nibble basso). Lo strumento **Carta della cella** imposta la carta di ogni cella su cui si fa clic o si trascina il cursore sul colore selezionato; **CARTA** imposta comunque tutte le celle contemporaneamente. La gomma cancella i pixel, in modo che venga visualizzata la carta della cella. Disabilitato in modalità multicolore, dove lo sfondo ($D021) è condiviso.                                                                                                                                                                  |
| Strumento a spruzzo                | Un programma di pittura in stile aerografo che sparge pixel intorno al cursore durante il disegno.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Intensità dello spruzzo            | Il menu a tendina accanto allo strumento spray controlla la densità di ogni spruzzo.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Tavolozza di colori                | Selettori per primo piano (inchiostro) e carta (sfondo). La modalità multicolore traccia automaticamente 3 colori extra per cella.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Annulla / Ripeti                   | Cronologia per ogni singolo colpo, ctrl-Z / ctrl-Y.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Selezionare                        | Lo strumento quadrato tratteggiato: trascina sulla tela per selezionare un'area rettangolare. **Esc** cancella la selezione.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Copia/Incolla                      | **Copia** (`Ctrl/Cmd+C`) copia la regione selezionata. **Incolla** (`Ctrl/Cmd+V`) mostra un'anteprima che segue il cursore: fai clic sulla tela per posizionarla, **Esc** annulla. La copia viene mantenuta, quindi premendo `Ctrl/Cmd+V` e facendo di nuovo clic la si posiziona tutte le volte necessarie. In modalità ad alta risoluzione i pixel incollati rispettano ancora il limite di due colori per cella, quindi allinea la regione con la griglia delle celle per mantenerne i colori. Copia, Incolla e Incolla trasparente sono presenti anche nel menu contestuale del tasto destro del mouse sulla tela; un'operazione di incolla avviata da lì viene visualizzata in anteprima nel punto in cui si fa clic. |
| Pasta trasparente                  | `Ctrl/Cmd+Shift+V` (o il relativo pulsante nella barra degli strumenti) salta i pixel color carta della copia, in modo che l'immagine sottostante sia visibile.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Griglia + raster                   | **Griglia** mostra la griglia delle celle dei caratteri: 8×8 pixel in alta risoluzione, 4×8 pixel a doppia larghezza in multicolore. Con uno zoom 4× disegna anche una linea più sottile attorno a ogni singolo pixel, in modo che ogni pixel possa essere posizionato con precisione. **Raster** aggiunge una sovrapposizione di righe raster.                                                                                                                                                                                                                                                                                                                                                                            |
| Zoom                               | Cursore da 1× a 16×.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Immagine G                         | I file PNG/JPEG/GIF trascinati sull'area di lavoro vengono automaticamente quantizzati alla tavolozza a 16 colori del C64.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Blocchi di esportazione            | Aggiunge al programma blocchi BYTE/RAWBYTES contenenti i dati codificati relativi a bitmap, schermo e colore.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Esporta `.bin`                     | Salva il formato multicolore nativo (10000 byte: 8000 bitmap + 1000 schermo + 1000 colore) pronto per LOADFILE a $2000.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

### Editor di sprite

Editor di sprite da 24×21 pixel con animazione multi-frame. Apri tramite Toolkit
→ Editor di sprite.

| Caratteristica                      | Descrizione                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cornici                             | Aggiungi / rimuovi / riordina i frame; la striscia di frame viene visualizzata in basso. **Copia** / **Incolla** nella riga del frame copia l'intero frame corrente; le stesse due voci sono presenti nel menu contestuale del canvas e della striscia di frame.                                                                                                                                                                                                                                      |
| Modalità                            | Interruttore monocromatico/multicolore.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Utensili                            | Matita, riempimento, linea, rettangolo, cerchio — più capovolgi orizzontalmente, capovolgi verticalmente, sposta a sinistra/destra/su/giù (con ritorno a capo opzionale). Gli strumenti Forma mostrano un'anteprima in tempo reale durante il trascinamento; rilascia per confermare.                                                                                                                                                                                                                 |
| Annulla / Ripeti                    | Stack completo di annulla/ripristina per ogni fotogramma. Ctrl/Cmd+Z / Ctrl/Cmd+Y o i pulsanti della barra degli strumenti.                                                                                                                                                                                                                                                                                                                                                                           |
| Importazione immagini               | Importa un'immagine PNG o JPEG tramite File → Importa immagine. Il programma di importazione associa ogni pixel al colore della tavolozza C64 più vicino e lo scrive nel frame corrente.                                                                                                                                                                                                                                                                                                              |
| Anteprima dell'animazione           | Riproduzione/Arresto con velocità configurabile.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Blocchi di esportazione             | Inserisce un blocco RAWBYTES a un indirizzo allineato a 64 byte per ogni fotogramma, oltre a una configurazione del puntatore sprite.                                                                                                                                                                                                                                                                                                                                                                 |
| Salva `.bin`                        | Scrive 64 byte per fotogramma (dati sprite grezzi senza riempimento).                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Selezione                           | **Seleziona / sposta**: trascina un rettangolo, quindi trascina al suo interno per spostare i pixel (i pixel vuoti sono trasparenti); i tasti freccia lo spostano di un pixel (due in modalità multicolore), Canc lo cancella, Esc lo rilascia. **Ruota di 90°** (in entrambe le direzioni) ruota la selezione o l'intera cornice. La selezione, il capovolgimento, lo spostamento e la rotazione agiscono contemporaneamente sul corpo e sulla sovrapposizione.                                      |
| Sovrapposizione ad alta risoluzione | **Sovrapposizione ad alta risoluzione** aggiunge un secondo sprite ad alta risoluzione monocolore su ogni fotogramma: il classico contorno su un corpo multicolore. L'elenco **Livello** seleziona il livello modificato; la sovrapposizione viene attenuata mentre il corpo viene modificato. Sul C64 è uno sprite separato: assegnagli un numero di sprite inferiore rispetto al corpo. `.bin` e **Copia byte** scrivono gli sprite della sovrapposizione dopo quelli del corpo (`sprite_f1_ov_1`). |
| Specchia tutto                      | Aggiunge una copia speculare orizzontalmente di ogni fotogramma (e della relativa hitbox): un ciclo di camminata nella direzione opposta con un solo clic.                                                                                                                                                                                                                                                                                                                                            |
| Importazione del foglio sprite      | File → **Importa foglio sprite…**: larghezza/altezza cella, offset, spazio e numero di fotogrammi dividono l'immagine in fotogrammi delle dimensioni correnti (le celle multicolore vengono ridimensionate a 12 pixel per sprite). I colori provengono dall'immagine o rimangono quelli dello sprite; corrispondenza OKLab senza dithering, ordinato (Bayer) o Floyd-Steinberg. Sostituisce i fotogrammi o li aggiunge ad essi.                                                                       |
| Hitbox                              | Lo strumento **Hitbox** trascina un rettangolo per ogni fotogramma (ciano tratteggiato); **Adatta**, **Adatta ogni fotogramma**, **Copia in ogni fotogramma** e **Rimuovi** nel pannello laterale. File → **Copia tabella hitbox** restituisce `sprite_hit_x / _y / _w / _h` (un byte per fotogramma, pixel dello schermo dall'angolo in alto a sinistra); un fotogramma senza hitbox utilizza i suoi limiti in pixel.                                                                                |
| X / Y ×2                            | Mostra l'anteprima come con l'espansione sprite `$D01D` / `$D017`.                                                                                                                                                                                                                                                                                                                                                                                                                                    |

**Esporta in UltimateBasic** (menu File) scrive ogni fotogramma (fino a 8) come
`sprdef`, imposta lo sprite 0 (colore, multicolore, espansione) e, per
un'animazione, aggiunge un ciclo sincronizzato raster che fa avanzare i
fotogrammi alla velocità FPS dell'editor. In modalità Ultimate Basic viene
inserito nel cursore, altrimenti viene copiato negli appunti.

### Browser delle ROM dei personaggi del C64 ("Mappa dei caratteri")

Visualizzatore di sola lettura della ROM dei caratteri del C64 (il font PETSCII
integrato). Si apre tramite la voce **C64 chargen** nel menu Toolkit. Utile per
trovare il codice schermo di un glifo prima di scriverlo con `RAWBYTES` o
`TEXT`.

| Caratteristica        | Descrizione                                                                                                                                                                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Due set di caratteri  | Scheda 1: **Set 1 — Superiore/Grafica** (modalità predefinita dopo l'accensione). Scheda 2: **Set 2 — Inferiore/Superiore** (dopo lo switch `$0E`).                                                                                                   |
| Griglia di glifi      | Griglia 16×16 di tutti i 256 caratteri. Clicca su un glifo per visualizzare il pannello dei dettagli: vista ingrandita 8×8 pixel, codice schermo (decimale + esadecimale), codici PETSCII (sia predefiniti che traslati) e la bitmap grezza a 8 byte. |
| Pannello di dettaglio | Mostra il codice schermo del glifo selezionato, i codici PETSCII e gli otto byte grezzi, pronti per essere incollati in un blocco `RAWBYTES` o BYTE.                                                                                                  |
| Sola lettura          | Qui non è possibile apportare modifiche: per modificare i glifi, utilizza l'Editor di caratteri (qui sotto).                                                                                                                                          |

### Editor dei personaggi (Charset)

Editor di caratteri 8×8 con supporto per 256 caratteri. Apribile tramite Toolkit
→ Editor di caratteri.

| Caratteristica            | Descrizione                                                                                                                                                                                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Carica la ROM             | Carica la ROM dei caratteri del C64: glifi esatti 901225-01, senza selettore di file. Il primo pulsante (e **File → ROM: maiuscole / grafica**) carica il set 1, il secondo pulsante (o Maiusc+clic, o **File → ROM: minuscole / maiuscole**) carica il set 2. |
| Carica `.bin`             | Importa un file binario esterno con set di caratteri da 2048 byte.                                                                                                                                                                                             |
| Anteprima per carattere   | Griglia di 16 caselle con tutti i 256 glifi, con la cella corrente evidenziata.                                                                                                                                                                                |
| Editor Pixel              | Modifica il carattere selezionato o una **cella** di 2×1, 1×2 o 2×2 caratteri adiacenti come un'unica immagine (selettore di celle).                                                                                                                           |
| Strumenti di disegno      | Matita, linea, rettangolo, rettangolo pieno e riempimento a inondazione. Un clic su un pixel che contiene già l'inchiostro lo cancella.                                                                                                                        |
| Trasformazioni            | Cancella, inverti, capovolgi orizzontalmente/verticalmente, sposta con avvolgimento, ruota di 90° in senso orario/antiorario (solo tessere quadrate) — sull'intera tessera.                                                                                    |
| Annulla / Ripeti          | Pulsanti della barra degli strumenti, Ctrl+Z e Ctrl+Y (Ctrl+Maiusc+Z).                                                                                                                                                                                         |
| Copia/Incolla             | Tramite i pulsanti della barra degli strumenti, Ctrl+C / Ctrl+V o facendo clic con il pulsante destro del mouse sulla mappa, viene copiata l'intera porzione di mappa con i relativi colori.                                                                   |
| trascinamento della mappa | Trascina un personaggio su un altro sulla mappa per scambiarli; Maiusc+trascina per creare copie.                                                                                                                                                              |
| Anteprima del testo       | Digita il testo per visualizzarlo nel set di caratteri corrente. Scegli la mappatura del set di maiuscole o minuscole; `{65}` o `{$41}` inserisce un codice schermo.                                                                                           |
| Esportazione di gamma     | Imposta i caratteri Da / A, quindi **File → Salva intervallo (.bin)** (byte grezzi) oppure **Copia intervallo ASM** (`.byte` righe).                                                                                                                           |
| Colore per carattere      | Memorizza un valore predefinito di RAM per il colore di ciascun glifo. In modalità caratteri multicolore, conserva anche il bit di abilitazione multicolore per cella e il colore a 3 bit inferiori del carattere stesso.                                      |
| Metadati andata e ritorno | Quando si caricano dati compatibili dai flussi di lavoro Charset Canvas/Map, i metadati relativi al colore di ciascun carattere vengono conservati, in modo che le modifiche possano continuare senza perdere l'intento cromatico.                             |
| Blocchi di esportazione   | Aggiunge RAWBYTES a $0800 (blocco 2) o $3800 (blocco 7) con il set di caratteri codificato.                                                                                                                                                                    |

### Editor di tela Charset

Strumento di creazione di schermate a schermo intero a partire da un set
completo di 256 caratteri. Apribile tramite Toolkit → Charset Canvas.

La tela è composta da 16×16 caratteri, ovvero 128×128 pixel. In modalità
caratteri multicolore, ogni carattere è multicolore (pixel larghi, 4 colori) o
ad alta risoluzione (8 pixel stretti, 2 colori), esattamente come sul C64.

| Caratteristica                        | Descrizione                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |                                                 |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Monocromatico/multicolore             | La modalità monocromatica memorizza glifi 8×8 a 1 bit. La modalità multicolore memorizza coppie di pixel orizzontali a due bit e contrassegna le celle multicolore con il bit 3 della RAM Colore.                                                                                                                                                                                                                                                                                                                                                                             |                                                 |
| Strumento modalità personaggio        | In modalità multicolore, fai clic o trascina sui caratteri per passare dalla modalità multicolore a quella ad alta risoluzione (bit 3 della RAM Colore). La forma viene mantenuta: una determinata coppia di pixel diventa il colore del carattere. Un carattere ad alta risoluzione ha lo sfondo e un colore proprio (0-7); MC1/MC2 non disegnano in quella zona.                                                                                                                                                                                                            |                                                 |
| Sfondo                                | Il menu a tendina BG viene visualizzato anche in modalità monocromatica; MC1 / MC2 solo in modalità multicolore.                                                                                                                                                                                                                                                                                                                                                                                                                                                              |                                                 |
| ECM                                   | La casella di controllo **ECM** (modalità colore estesa, non insieme a multicolore): ogni carattere è ad alta risoluzione con il proprio colore (0–15) e uno dei quattro sfondi BG0–BG3 (`$D021`–`$D024`; BG1 / BG2 sono i registri MC1 / MC2). Scegli un colore BG nella tavolozza (contrassegnato B0–B3), quindi fai clic o trascina sui caratteri con lo strumento **Sfondo carattere**. Ci stanno solo 64 caratteri diversi: la riga di stato li conta e il salvataggio unisce i caratteri uguali: il charset è di 64 caratteri (512 byte) e i codici schermo sono `glyph | background << 6`. Attiva ECM con `$D011` bit 6. |
| Modello a colori C64                  | Lo sfondo utilizza `$D021`; il multicolore condiviso 1 utilizza `$D022`; il multicolore condiviso 2 utilizza `$D023`; il colore di ciascun personaggio proviene dai bit 0-2 della RAM dei colori.                                                                                                                                                                                                                                                                                                                                                                             |                                                 |
| Strumenti di disegno                  | Matita, gomma, linea, rettangolo, ovale e riempimento a inondazione funzionano anche oltre i contorni dei caratteri.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |                                                 |
| Strumento a spruzzo                   | Disegno in stile aerografo che sparge pixel sulle celle/caratteri adiacenti.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                                                 |
| Intensità dello spruzzo               | Il menu a tendina accanto allo strumento spruzzo permette di impostare la densità del tratto.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |                                                 |
| Attiva/disattiva griglia              | La casella di controllo Griglia mostra o nasconde la griglia di caratteri 16×16.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |                                                 |
| Zoom                                  | Il cursore dello zoom (da 2× a 24×, pixel dell'intero dispositivo per pixel C64) o Ctrl+rotellina del mouse sull'area di lavoro; lo zoom viene memorizzato. A partire da 8×, la griglia disegna anche una linea sottile su ogni bordo di pixel.                                                                                                                                                                                                                                                                                                                               |                                                 |
| Salva charset `.bin`                  | Salva i dati della bitmap dei caratteri da 2048 byte.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |                                                 |
| Salva mappa 16×16 + RAM colore `.bin` | Salva 256 codici schermo seguiti da 256 valori RAM colore. Utilizzare con `MAP_COPY16X16`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |                                                 |
| Caricamento                           | Può caricare salvataggi charset-canvas, dati charset semplici e dati charset compatibili dell'editor di personaggi, inclusi i colori per singolo personaggio memorizzati, se presenti.                                                                                                                                                                                                                                                                                                                                                                                        |                                                 |

**Importante limitazione del C64:** nella modalità caratteri multicolore i due
colori condivisi sono globali per l'intero schermo (`$D022` / `$D023`). Solo il
colore proprio del carattere è per cella ed è limitato ai colori 0-7 perché il
bit 3 della RAM dei colori seleziona la modalità multicolore. Quindi un
carattere mostra al massimo **4 colori** (sfondo, MC1, MC2 e il suo colore
proprio) e l'intero schermo al massimo 3 + 8. Nella tavolozza i colori condivisi
sono etichettati BG / 1 / 2 e i colori 8-15 che non sono condivisi sono
attenuati. Selezionando un colore di questo tipo, lo si inserisce in MC2 o MC1
solo finché nessun pixel utilizza quel registro; altrimenti, lo si può
modificare nel menu a tendina corrispondente (che ricolora l'intero schermo). In
modalità ad alta risoluzione (monocromatica) un personaggio ha 2 colori: lo
sfondo e il proprio colore (0–15).

### Editor di mappe (mappe a tessere multilivello)

Editor di tilemap a livelli per scenari statici, mappe di generazione di sprite,
dati di collisione e simili. Apribile tramite Toolkit → Editor di mappe.

| Caratteristica                                               | Descrizione                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Strati                                                       | Diversi livelli denominati, ognuno con il proprio set di tessere e opacità.                                                                                                                                                                                                                                                     |
| Spazzole                                                     | Modalità a piastrella singola, riempimento, linea, rettangolo e cerchio. Gli strumenti Forma mostrano un'anteprima in tempo reale durante il trascinamento; rilascia per confermare.                                                                                                                                            |
| Annulla / Ripeti                                             | Funzione completa di annulla/ripristina per ogni livello. Ctrl/Cmd+Z / Ctrl/Cmd+Y o i pulsanti della barra degli strumenti.                                                                                                                                                                                                     |
| Cancella menu                                                | Cancellazione per singolo strato o dell'intera mappa con conferma.                                                                                                                                                                                                                                                              |
| Importazione immagini                                        | Trascina un file PNG di una mappa a tessere; l'editor la suddividerà automaticamente in tessere.                                                                                                                                                                                                                                |
| Copia/incolla                                                | Copia una porzione di riquadro selezionata, quindi incollala normalmente oppure usa l'incolla trasparente per mantenere trasparenti i riquadri vuoti. Le stesse voci sono presenti nel menu contestuale che si apre cliccando con il tasto destro del mouse sull'area di lavoro.                                                |
| Colorazione delle piastrelle con sensibilità ai colori       | Con metadati charset compatibili, il disegno utilizza le impostazioni predefinite della RAM dei colori memorizzate nella tile (inclusa la codifica relativa ai colori multipli) anziché un colore piatto generico.                                                                                                              |
| Colori personalizzati dei caratteri                          | Quando un charset contiene metadati `charColors`, l'editor di mappe utilizza il valore predefinito di Color RAM della tessera selezionata durante la fase di disegno.                                                                                                                                                           |
| Blocchi di esportazione                                      | Emette blocchi RAWBYTES per la grafica dei tileset e i dati della mappa.                                                                                                                                                                                                                                                        |
| Salvataggio della RAM dello schermo (.bin)…                  | Salva solo i codici schermo per il livello mappa corrente (40×25 = 1000 byte).                                                                                                                                                                                                                                                  |
| Salvataggio della RAM dello schermo + RAM dei colori (.bin)… | Salva i codici dello schermo concatenati con i valori della RAM del colore come un singolo file da 2000 byte (`schermo[0..999]` seguito da `colore[0..999]`). Utilizzare questo con la macro **MAP_COPY** (modalità .bin combinata) per ripristinare sia lo schermo che il colore in un'unica operazione in fase di esecuzione. |

### Editor di livelli

Organizza le schermate dell'Editor di mappe in un unico livello, che si tratti
di uno sparatutto verticale, un gioco di auto a scorrimento verticale, un gioco
a scorrimento laterale o una mappa 2D, e ne visualizza l'anteprima con uno
scorrimento fluido. Aprilo con il pulsante della barra degli strumenti Editor di
livelli accanto all'Editor di mappe.

| Caratteristica         | Descrizione                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Disposizione           | **Verticale**, **Orizzontale** o **Griglia** (righe × colonne, con pulsanti per aggiungere/rimuovere righe e colonne).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Schermate              | **Nuova schermata vuota**, **Aggiungi dall'Editor mappe** (la mappa attualmente aperta) o **Carica mappa(e) (.bin)...** (più esportazioni dell'Editor mappe contemporaneamente). Trascina una schermata dall'elenco su uno slot; trascina gli slot uno sull'altro per scambiarli.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Modifica               | **Modifica nell'editor di mappe** apre la schermata selezionata nell'editor di mappe e riporta indietro le modifiche; duplica, sposta in alto/sinistra o in basso/destra, rimuovi; annulla/ripristina.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Anteprima              | Trascina l'anteprima o usa i tasti freccia per scorrere pixel per pixel; **Riproduci** scorre automaticamente (direzione, velocità 1–8, loop), Spazio = riproduci / interrompi. *Bordi* contrassegna i bordi dello schermo.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Assegni                | Informazioni sul set di caratteri e un avviso quando le schermate utilizzano un set di caratteri o colori diversi (il livello utilizza le impostazioni della prima schermata).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Attributi caratteriali | Il pulsante **Attributi del personaggio** commuta la panoramica alla pittura degli attributi: scegli **Solido**, **Scala**, **Pericolo** o **Collezionabile**, fai clic su un personaggio e ogni cella con quel codice schermo lo ottiene (o lo perde); trascina per altri codici. Gli attributi vengono visualizzati come un livello colorato e diventano la tabella `LEVEL_ATTR` da 256 byte (`LEVEL_ATTR_SOLID` = 1, `_LADDER` = 2, `_HAZARD` = 4, `_COLLECT` = 8).                                                                                                                                                                                                                                                                                                                                               |
| Controllo del bordo    | I segni rossi indicano le interruzioni tra le schermate adiacenti: un lato del bordo è vuoto (spazio) e l'altro no, oppure è pieno solo da un lato. Il pannello laterale conta i bordi e le celle.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Colori                 | **Bordo di livello** e **Colori propri per questo schermo** (sfondo, bordo, multicolore 1 / 2) per lo schermo selezionato; la cornice di anteprima mostra il bordo. Esportato per slot come `LEVEL_SCR_BG / _BORDER / _MC1 / _MC2` (con `LEVEL_SCR_COLORS` = 1) quando uno schermo posizionato ha i suoi colori.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Memoria                | La dimensione dei dati `.level` a un indirizzo scelto (calcolata esattamente come la macro la costruisce), con avvisi per la ROM BASIC/KERNAL, l'area I/O e la memoria sotto `$0800` e la dimensione RLE del livello. **Esporta RLE in blocchi / Copia RLE asm** fornisce l'RLE del livello impacchettato con l'unpacker `level_unrle` (`($FB)` → `($FD)`).                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Pubblicato su VICE     | Crea un programma di test con scorrimento tramite joystick dal livello (lo scroller `level-demo`, codice in `$C000`, dati del livello da `$2000`, set di caratteri personalizzato in `$2000`) e lo avvia in VICE: i colori dello schermo cambiano con lo schermo in alto a sinistra della vista, la telecamera inizia dal primo oggetto Start.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| oggetti                | Il pulsante **Livello oggetti** commuta la panoramica alla modifica degli oggetti: scegli un tipo (Inizio, Nemico, Oggetto, Porta, Uscita, Trigger) e un byte **Parametro** (tipo di nemico, ID oggetto, destinazione porta...), clicca per posizionare, trascina per spostare (agganciato a 8 px, Maiusc = libero), clicca su un oggetto per selezionarlo e modificarne il tipo/parametro, i tasti freccia lo spostano, Canc lo rimuove. Gli oggetti appartengono alla posizione del livello, non a una schermata. Sono elencati nella barra laterale, mostrati nell'anteprima, salvati con il livello ed esportati in ordine di scorrimento (verticale per Y, orizzontale per X, riga della griglia per riga) come tabelle `LEVEL_OBJ_*` — tramite **Copia asm / Esporta in blocchi** e tramite la macro `.level`. |

**Menu file:**
| Azione                                                                   | Cosa fa                                                                                                                                   |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Nuovo livello** / **Apri livello (.bin)…** / **Salva livello (.bin)…** | Il progetto del livello: tutte le schermate più il layout. Questo è il file letto dalla macro `.level` e da `map load` di Ultimate Basic. |
| **Salva il livello della RAM dello schermo (.bin)...**                   | L'intero livello come un'unica mappa dei personaggi (solo codici a schermo).                                                              |
| **Salva livello Schermo + RAM colore (.bin)…**                           | L'intero livello è rappresentato dai codici a schermo e dai relativi colori.                                                              |
| **Esporta in blocchi** / **Copia asm**                                   | I dati di livello come blocchi o come testo assembly (appunti).                                                                           |

**Utilizzo del livello:** in assembler, `.level "level.bin"` + `.level_row`
(vedere [LEVEL / LEVEL_ROW](#level--level_row) e `samples/level-demo.asm`); in
Ultimate Basic 1.6.1+, `map load "level.bin", $4000` e `map view px, py`
(esempio `level_scroll_demo.ub`).

### SID Editor (Tracker a 3 voci)

Tracker multi-strumento a 3 voci. Apri tramite Toolkit → SID Editor.
**Riproduci: Tutto** esegue il player 6502 esportato nell'emulatore WebSid; ogni
altra anteprima (anteprima strumento, tastiera virtuale, immissione nota,
accordo/arpeggio, riproduzione riga e pattern singolo) viene riprodotta anche
sul SID emulato: un modello JS dello stesso player (frame per frame) trasmette
in streaming i suoi registri SID a WebSid ad ogni frame e fino a tre note di
anteprima condividono le tre voci. Il player di streaming viene caricato
all'apertura dell'editor e di nuovo dopo Stop, quindi le note suonano
contemporaneamente; senza WebSid viene invece riprodotto un piccolo
sintetizzatore SID.

**Motore di anteprima:** **Impostazioni → Anteprima SID** seleziona **WebSID** o
**VA SID Core (Rust)**, l'emulazione SID proprietaria dell'app; con VA SID Core
si sceglie anche il chip (MOS 6581 / 8580). I parametri dello strumento vengono
impostati tramite manopole.

**Comandi per strumento:**
- Caselle di controllo della forma d'onda (TRI / SAW / PUL / NOI) — più forme
  d'onda sono combinate tramite AND come nel SID — più **RING** (modulazione ad
  anello del triangolo da parte della voce precedente: 1 ← 3, 2 ← 1, 3 ← 2) e
  **SYNC** (sincronizzazione rigida con la voce precedente).
- ADSR (attacco/decadimento/sostenimento/rilascio) mostrato come un grafico a
  trascinamento sopra i quattro cursori.
- Cursore della larghezza dell'impulso (0-4095).
- **Filtro:** *Instrada questa voce attraverso il filtro*, LP / BP / HP e **3
  OFF** (disattiva la voce 3 quando non è instradata), cutoff, risonanza,
  volume. **Fine** + **Sweep** spostano il cutoff da Cut verso End di Sweep per
  frame; **Ping-pong** rimbalza tra i due: questo è ciò che crea sweep di filtro
  risonanti. La voce che avvia uno strumento instradato dal filtro possiede il
  filtro (cutoff, risonanza, modalità); ogni voce il cui strumento è instradato
  lo attraversa.
- **Vibrato:** dopo **Delay** frame un LFO triangolare che ruota ogni **Speed**
  frame, **Depth** 0-15 scalato al semitono della nota (indipendentemente
  dall'effetto `V`.
- **Modulazione di larghezza dell'impulso:** **Velocità** aggiunta alla
  larghezza dell'impulso ad ogni frame, oscillando tra **Min** e **Max**.
- **Gate:** **Il timer del gate** rilascia il gate tanti frame prima della nota
  successiva sulla voce (mantienilo al di sotto di Speed); **Hard restart**
  azzera anche ADSR, per un attacco pulito; **Primo frame** scrive una forma
  d'onda sul primo frame della nota (ad esempio `$09` test + gate).
- **Tabella delle forme d'onda/arpeggi:** fino a 32 passi di forma d'onda (— =
  mantieni) e nota (offset in semitoni, o **abs** = nota assoluta), un passo
  ogni **Speed** frame, **Loop** torna a un passo o fermati all'ultimo.
  **Preset** (25, in gruppi; l'elenco mantiene il preset scelto finché la
  tabella non viene modificata manualmente): arpeggi (maggiori, minori, accordi
  di settima, sus4, diminuiti, aumentati, power chord, ottava, trillo), batteria
  (cassa, rullante, tom, clap, hi-hat chiuso/aperto), attacchi lead e basso ed
  effetti sonori (laser, pickup, esplosione).

** Griglia di tracciamento:**
- 3 voci × fino a 7 pattern × 32 righe = 7 × 32 = 224 righe massime (il
  contatore di righe a 8 bit ne limita il numero).
- Per riga: nota + indice dello strumento, più un effetto opzionale (vedi
  **Colonna Effetti** qui sotto). Le righe vuote contengono la nota precedente:
  come in altri tracker (GoatTracker, SID-Wizard), una nota mantiene il suo gate
  attivo (livello di sustain) fino alla nota successiva su quella voce o a una
  **nota-off**.
- **Invio** (o un doppio clic) modifica la cella selezionata come testo (`C-4 01
  V24`); **Invio** salva e passa alla riga successiva, **Esc** annulla.
- **Note-off** (`===`): premere **1** (o `` ` `` / `=`), oppure digitare `===` /
  `OFF` in una cella. Rilascia il gate, quindi il rilascio dello strumento viene
  eseguito — lo stesso dell'effetto `C` senza una nota (salvato ed esportato
  come `C00`).
- Seleziona una cella normalmente oppure tieni premuto **Maiusc** mentre fai
  clic o usi i tasti freccia per estendere una selezione rettangolare su più
  righe e su una qualsiasi delle tre voci. Facendo clic con il pulsante destro
  del mouse all'interno dell'area selezionata, l'intervallo rimane invariato.
- Le funzioni Copia, Taglia, Incolla e Cancella sono disponibili dalla barra
  degli strumenti delle icone e dal menu contestuale basato sulle icone.
  `Ctrl/Cmd+C` e `Ctrl/Cmd+V` operano sulla stessa selezione rettangolare.
- Strumento per l'armonia: scegli una nota fondamentale, un tipo di accordo e
  un'ottava, ascolta in anteprima l'accordo con lo strumento corrente, quindi
  inserisci la disposizione delle voci direttamente nel tracker. I tipi
  disponibili includono Maggiore, Minore, Diminuito, Aumentato, Sus2, Sus4,
  Dominante 7, Maggiore 7, Minore 7, 6, Minore 6, 9, b9, #9, Dim7 e 7sus4.
- Strumento per arpeggi: visualizza in anteprima o inserisci sequenze di note di
  4, 8 o 16 intervalli a partire dall'accordo selezionato, in direzione
  ascendente, discendente o ascendente/discendente.
- **Anteprima riga** Ascolta la riga selezionata su tutte e tre le voci senza
  avviare la riproduzione del pattern.
- L'incolla di intervalli di celle ora inizia dalla cella iniziale
  dell'intervallo selezionato e termina in modo pulito ai limiti di riga e di
  voce, invece di andare a capo nella colonna o riga successiva.
- Il cursore della velocità imposta il divisore del tick IRQ (fotogrammi tra le
  righe).

**Elenco brani/ordini:**
- I pattern sono organizzati tramite un elenco di brani/ordini sovrapposto alla
  banca di pattern grezzi: lo stesso pattern può ripetersi e il brano può essere
  più lungo del numero di pattern memorizzati.
- Aggiungi, rimuovi e riordina i passaggi dal pannello dell'elenco dei brani; il
  passaggio corrente viene evidenziato durante la riproduzione.
- Sia la riproduzione in-app che ogni esportazione seguono questo elenco, non
  l'ordine del pattern originale: le esportazioni effettuate prima che esistesse
  l'elenco d'ordine vengono comunque caricate correttamente come un semplice
  brano 0..N-1.

**Colonna effetti:** Ogni cella può contenere un effetto insieme alla nota e
allo strumento, inserito come codice breve subito dopo la nota (ad esempio `C-4
01 V24`) o da solo per una riga di effetti senza note (ad esempio `F06`):

| Codice | Effetto                    | Valore                                                                    |
| ------ | -------------------------- | ------------------------------------------------------------------------- |
| `V`    | Vibrato                    | basso nibble = profondità, alto nibble = lunghezza di tenuta              |
| `U`    | Slide up (portamento)      | importo aggiunto alla frequenza di ciascuna riga                          |
| `D`    | Scivolare giù (portamento) | importo sottratto dalla frequenza di ciascuna riga                        |
| `C`    | Nota tagliata              | silenzia la voce senza riattivarla; valore non utilizzato                 |
| `F`    | Cambio di velocità         | Nuovo valore per il numero di fotogrammi per riga, con effetto immediato. |

Gli effetti si aggiornano una volta per riga (in base alla temporizzazione del
lettore esportato), vengono eseguiti in modo identico nell'anteprima Web Audio e
nell'esportazione 6502 compilata e vengono salvati/caricati senza perdita di
dati nel formato versionato `.bin`.

**Riproduzione e tastiera virtuale:**
- Il pulsante Riproduci nella barra degli strumenti cambia in Pausa durante la
  riproduzione e in Riprendi quando è in pausa; Interrompi termina la
  riproduzione e ripristina lo stato.
- Il pulsante della barra degli strumenti della tastiera apre **VA-VK**, un
  pianoforte non modale (2, 3 o 4 ottave; posizione, stato di apertura, ottava e
  *Inserisci nel tracker* vengono memorizzati) con i propri pulsanti **Riproduci
  / Interrompi** che rimangono utilizzabili mentre l'editor SID è attivo.
  Trascina la sua intestazione per posizionarlo ovunque sopra l'applicazione
  principale.
- Abilita **Inserisci nel tracker** per scrivere ogni nota suonata nella
  posizione corrente del cursore del tracker e passare alla riga successiva.
  Disabilitalo per ascoltare le note senza modificarle.
- Le anteprime di accordi e arpeggi illuminano i tasti corrispondenti del
  pianoforte quando la tastiera è aperta.

**Registrazione, metronomo e MIDI:**
- **Registra** (il punto rosso, nella barra degli strumenti del tracker e su
  VA-VK) scrive le note che suoni — su VA-VK, sulla tastiera del computer o su
  una tastiera MIDI — a tempo nella voce selezionata, a partire dalla riga
  selezionata, alla velocità corrente. Quando il pattern è pieno, viene aggiunto
  un nuovo pattern vuoto dopo il passo corrente del brano e la registrazione
  continua lì. Premi di nuovo Registra per interrompere.
- **Il metronomo** (barra degli strumenti del tracker e VA-VK) emette un clic
  ogni 4 righe, accentuato sul primo battito di ogni battuta di 4 battiti. Le
  spie del battito accanto lampeggiano a ogni battito durante la riproduzione e
  la registrazione, anche con il clic disattivato.
- **MIDI:** scegli l'ingresso nell'elenco **MIDI** accanto al nome dello
  strumento e premi **Connetti MIDI**; le note vengono riprodotte dallo
  strumento corrente (e vengono scritte nel tracker durante la registrazione o
  con *Inserisci nel tracker*). La spia accanto al pulsante lampeggia ad ogni
  messaggio MIDI in arrivo.
- **Elimina pattern:** il pulsante **−** accanto a **Pat +** elimina il pattern
  corrente (chiede prima se il pattern ha delle note). I passaggi della canzone
  che lo utilizzavano vengono rimossi e gli altri rinumerati; almeno un pattern
  rimane sempre.
- La manopola del volume principale **** si trova su VA-VK.

**Esportazioni del menu File:**
| Esportare                          | Cosa fa                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Salva .bin…`                      | Scrive nel formato serializzato nativo dell'editor (strumenti con tutte le impostazioni di modulazione e i nomi, velocità, pattern, brano). I salvataggi precedenti vengono comunque caricati.                                                                                                                                                                                                                                            |
| `Esportazione blocchi (solo dati)` | Aggiunge la tabella degli strumenti + i blocchi di pattern al programma in `* = $C000`.                                                                                                                                                                                                                                                                                                                                                   |
| `Esporta blocchi + minigiocatore`  | Aggiunge il player completo (sid_init / sid_irq / sid_frame / sid_play_row / sid_set_voice) più le tabelle di frequenza PAL. Dopo l'esportazione, inserisci un `JSR sid_init` nel tuo codice principale dove dovrebbe iniziare la musica; con la tua chiamata IRQ `JSR sid_frame` una volta per frame.                                                                                                                                    |
| `Esporta asm (appunti)`            | Copia l'intero codice sorgente dell'assembly negli appunti.                                                                                                                                                                                                                                                                                                                                                                               |
| `Importa GoatTracker .sng…`        | Carica un brano di GoatTracker 2 al posto di quello corrente — vedi **Importazione GoatTracker** qui sotto.                                                                                                                                                                                                                                                                                                                               |
| `Esporta in UltimateBasic`         | Scrive un blocco `tune ... end` (strumenti, elenco ordine, righe pattern come testo) più `music play` e lo inserisce nel cursore dell'editor di Ultimate Basic; al di fuori della modalità UB copia il testo negli appunti. Il compilatore di UltimateBasic crea il player, quindi `music play` / `music stop` lo controllano. La modulazione dello strumento va nelle righe `imod` / `ifilt` / `igate` / `itab` (Ultimate Basic 1.6.2+). |

**Importazione GoatTracker:** **File → Importa GoatTracker .sng…** carica un
brano GoatTracker 2 (`.sng`, GTS3–GTS5) al posto di quello corrente. La
conversione è approssimativa, perché i due tracker funzionano in modo diverso:
- Gli elenchi di ordine per voce (con trasposizione e ripetizione) vengono
  appiattiti in un unico brano a 3 voci e suddivisi in schemi di 32 righe; gli
  schemi identici vengono condivisi.
- Strumenti: AD/SR, prima onda, timer gate e hard restart vengono gestiti; la
  wavetable diventa la tabella delle onde/arpeggi, la tabella degli impulsi PWM,
  la tabella dei filtri modalità filtro, risonanza e sweep di cutoff e la
  tabella della velocità immissione vibrato dello strumento.
- Comandi pattern: key off → note-off, portamento → `U` / `D` (al massimo 255
  per riga), tempo → `F`; toneporta diventa una nota semplice. Altri comandi
  vengono omessi e un messaggio elenca ciò che è stato approssimato o saltato.
- Un gate rilasciato dalla wavetable diventa una nota di riposo sulla riga
  libera successiva. Viene importata solo la prima sotto-melodia e il limite di
  esportazione di 7 pattern rimane valido.

**Utilizzo ZP del lettore:** `$02`–`$1C` (puntatori pattern, offset pattern,
temp) e `$2F` (velocità corrente), più `$FB`–`$FD` (contatore tick, indice di
riga, posizione nella lista degli ordini). Voce, modulazione e stato del filtro
risiedono in `sid_state` dopo i dati. I byte ZP sono in conflitto se il codice
principale li utilizza: riposizionarli tramite la modalità Esperto se
necessario.

**Limiti noti:**
- Il contatore di righe a 8 bit limita ogni pattern a 7 pattern × 32 righe nel
  banco raw (l'elenco dei brani/ordini può comunque essere arbitrariamente lungo
  ripetendo i pattern).
- Il volume globale del C64 `$D418` è condiviso tra le voci: il cursore del
  volume per strumento è informativo; il livello di sustain (`S` di ADSR) è il
  volume effettivo per voce.
- Mentre **Play: All** ha la melodia reale caricata (anche in pausa), le
  anteprime delle note tornano al piccolo sintetizzatore, che approssima solo il
  chip SID. Le anteprime raggiungono WebSid circa 0,1 s prima del suono.

---

**Esporta .sid (PSID)...** (menu File) salva il brano con il lettore
riproducibile `$C000` come un file PSID standard: viene riprodotto nel lettore
SID, in `vsid` di VICE e in qualsiasi altro lettore SID.

### SID Player

Il pulsante della barra degli strumenti **SID Player** apre una finestra mobile
che riproduce file musicali `.sid` (PSID e RSID), ad esempio brani dalla
collezione HVSC.

- **Playlist:** aggiungi brani con **Aggiungi file .sid…** o trascinandoli sulla
  finestra e fai clic su un brano per riprodurlo; **Rimuovi** e **Cancella
  playlist** riordina la lista. **Salva playlist…** / **Apri playlist…** scrivi
  e leggi un file `.sidpl` con i brani incorporati. La lista, il brano corrente
  e se la finestra è aperta vengono memorizzati.
- **Trasporto:** Riproduci, Pausa, Stop, **Brano precedente** / **successivo**,
  **Sottobrano precedente / successivo** per file con più brani e un contatore
  del tempo.
- **Ricerca:** la barra di posizione e **Indietro / Avanti 10 s** funzionano con
  il motore VA SID Core. WebSID non può cercare, quindi questi controlli sono
  disabilitati con esso.
- **Volume:** la manopola è condivisa con il volume principale dell'editor SID.
- **Motore:** la finestra mostra quale motore è in esecuzione (WebSID o VA SID
  Core con la sua versione e chip SID); selezionalo in **Impostazioni →
  Anteprima SID**. VA SID Core esegue la melodia su un core Rust C64 nativo con
  un 6510 a ciclo esatto, temporizzazione precisa degli interrupt, CIA 6526A,
  temporizzazione VIC-II con linee errate, DMA sprite e interrupt raster e la
  porta I/O 6510, quindi gli interrupt raster, temporizzati CIA e digitali
  vengono riprodotti con la temporizzazione di una macchina reale.
- **Riproduzione casuale:** il pulsante di riproduzione casuale accanto a
  **Avanti** riproduce la playlist in ordine casuale: nessun brano si ripete
  finché non sono stati riprodotti tutti i brani, e **Precedente** torna
  indietro nell'ordine casuale. L'impostazione viene memorizzata.
- **Preferiti:** la ☆ / ★ in ogni riga contrassegna un brano; viene mantenuto
  nello stato salvato e nelle playlist `.sidpl`.

---

### Editor di curve

Genera tabelle di ricerca `.byte` pronte all'uso da curve matematiche: seno,
interpolazioni, triangolari/a dente di sega/quadrate e di rimbalzo. Ideale per
il movimento degli sprite, effetti raster, cicli di colore o qualsiasi
animazione guidata da una tabella precalcolata. Apri tramite l'icona **Editor di
curve** nella barra degli strumenti superiore (accanto al pulsante Editor SID).

**Curve:** Seno, Coseno, Lineare, Entrata/Uscita/Entrata/Uscita (Quadrica e
Cubica), Entrata/Uscita (Circolare), Triangolo, Dente di sega, Quadrato e
Rimbalzo Entrata/Uscita/Entrata/Uscita.

**Comandi:**
| Controllare                  | Scopo                                                                                                                                                                                                            |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Valore iniziale/finale**   | Intervallo di uscita: 0..255 in modalità a 8 bit, 0..320 in modalità a 16 bit.                                                                                                                                   |
| **Numero di valori**         | Lunghezza della tabella: da 4 a 512 voci.                                                                                                                                                                        |
| **Cicli**                    | Quante oscillazioni lungo la tabella (solo seno/coseno/triangolare/dente di sega/quadra). Accetta frazioni (ad esempio `3.625`).                                                                                 |
| **Fase**                     | Sfasamento in gradi (solo seno/coseno).                                                                                                                                                                          |
| **Combina la seconda curva** | Mescola una seconda curva con **Mix / Add / Multiply / Min / Max / Subtract**, i suoi cicli/fase e una quantità di miscela. Entrambe le curve sorgente sono disegnate come linee guida tratteggiate sul grafico. |
| **Etichetta**                | Etichetta della tabella (suggerita automaticamente dal nome della curva).                                                                                                                                        |
| **Formato numerico**         | `$XX` esadecimale o decimale.                                                                                                                                                                                    |
| **Valori per riga**          | 8 / 16 / 32 byte per riga `.byte`.                                                                                                                                                                               |

**Modalità di uscita:**
| Modalità   | Emette                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **8 bit**  | Una singola tabella `.byte` (valori 0..255). Lettura con `LDX #index / tabella LDA,X`. Facoltativamente emette una routine di lettura **sprite-Y** (`<label>_set_y`) — `LDA <label>,X` / `STA $D001+2N` — per un numero di sprite selezionabile da 0 a 7.                                                                                                                                                                                                |
| **16 bit** | Due tabelle di byte parallele — `<label>_lo` (8 bit bassi) e `<label>_hi` (9° bit, 0/1) — indicizzate dallo stesso **X (2 byte per voce). Necessario per lo sprite X a schermo intero (0..320 > un byte). Facoltativamente emette una routine di lettura sprite-X ** (`<label>_set_x`) che scrive il byte basso in `$D000+2N` e imposta/cancella il bit più significativo (MSB) dello sprite in `$D010`, per un numero di sprite selezionabile da 0 a 7. |

Ogni output di copia/inserimento inizia con un commento di intestazione che
documenta la curva, l'intervallo minimo/massimo effettivo, il conteggio delle
voci e l'utilizzo esatto (quale registro alimenta ciascuna tabella).

**Anteprima:**
- **Grafico** — la curva tracciata con valore 0 in **alto** e massimo in
  **basso**, corrispondente alla convenzione sprite-Y / raster del C64 (quindi
  ciò che vedi è ciò che la tabella pilota sull'hardware). Una riga meta sotto
  il grafico mostra il conteggio dei byte, il valore minimo/massimo effettivo
  dei valori generati e il nome/i della curva.
- **Palla rimbalzante** — anima un marcatore attraverso la tabella al **Tempo**
  (5–240 valori/sec). Al tempo 50 questo equivale a un valore per fotogramma su
  PAL (50 Hz), ovvero un `.wait_raster` passo per indice. Pulsanti
  Riproduci/Pausa e Riavvia, una scia di dissolvenza delle ultime ~24 posizioni
  e una lettura `Indice · Valore` in tempo reale.

**Copia / Inserisci:** le due icone della barra degli strumenti — **Copia**
inserisce la tabella negli appunti; **Inserisci nell'editor** aggiunge la
tabella (e il lettore, se abilitato) come blocchi al programma corrente.
Reinserire **sostituisce** l'inserimento precedente dell'Editor di curve invece
di sovrapporre i duplicati (funziona in modalità Blocco ed Esperto).

**Menu file:**
| Azione                               | Cosa fa                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Salva la curva (.bin)...**         | Salva i byte della tabella grezza esattamente come li leggerebbe il C64 tramite `INCBIN`. 16 bit: N byte lo seguiti da N byte hi.                                                                                                                                                                                                                                                                                                                                        |
| **Curva di carico (.bin)…**          | Carica i byte grezzi della tabella nell'editor, interpretati in base alla profondità di bit corrente (16 bit: prima metà a basso bit, seconda metà ad alto bit). La tabella caricata viene visualizzata così com'è finché un qualsiasi controllo di curva non rigenera una nuova curva.                                                                                                                                                                                  |
| **Esporta la demo in blocchi**       | Aggiunge una demo completa e funzionante di sprite: inizializzazione dello sprite, ciclo principale sincronizzato con il raster, la tabella incorporata e i dati dello sprite della palla. L'asse X si muove da 0 a 320 in virgola fissa 8.8 con il bit più significativo `$D010` mentre la tabella controlla l'asse Y dello sprite, corrispondendo esattamente all'anteprima dell'editor. La riesportazione sostituisce il precedente inserimento nell'editor di curve. |
| **Esporta in UltimateBasic**         | Scrive la tabella come un array Ultimate Basic inizializzato — `var name = array(N)` (o `array_word(N)` per 16 bit) seguito da `data name: …` righe — e lo inserisce nel cursore dell'editor UB (al di fuori della modalità UB viene copiato negli appunti). L'etichetta diventa un nome UB valido in minuscolo; indicizza la tabella come `name[i]`. Richiede Ultimate Basic 1.5.8+ (incluso).                                                                          |
| **Esporta la demo di UltimateBasic** | Produce un programma UB completo e pronto per l'esecuzione: uno sprite della palla (`sprdef 0`), la tabella e un ciclo sincronizzato a raster che riproduce una voce della tabella per fotogramma. Le tabelle a 8 bit pilotano lo sprite **Y** mentre X varia da 0 a 320; le tabelle a 16 bit (da 0 a 320) pilotano lo sprite **X** mentre Y varia da 0 a 200. Le tabelle più lunghe di 256 voci riproducono le prime 256.                                               |

**Corrispondendo all'anteprima sul C64:** l'anteprima legge la tabella
**linearmente, eseguendo un ciclo 0 → N-1 → 0, un valore per frame**. Per
riprodurla esattamente, pilotare la tabella nello stesso modo (incrementare
l'indice una volta per frame, tornare alla lunghezza della tabella). Una
riproduzione ping-pong o a intervallo parziale si muoverà in modo diverso anche
se i valori dei byte sono identici. Vedere `samples/curve-new-demo.asm` per un
esempio funzionante di sprite-X a 16 bit.

---

### Generatore di tabelle

Il pulsante della barra degli strumenti **Generatore di tabelle** (icona a
griglia, accanto all'Editor di curve) crea tabelle di ricerca e speedcode.
Scegli un tipo di tabella, imposta i parametri e visualizza l'anteprima; la riga
meta mostra il numero di voci, la dimensione e l'intervallo di valori (per il
codice: byte e cicli/linee raster stimati).

| Tipo                                             | Valori                                                                                                                                          |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| indirizzi delle righe dello schermo              | base + 40 · riga (qualsiasi lunghezza di base e riga)                                                                                           |
| indirizzi delle righe bitmap                     | Pixel Y → indirizzo di byte nella colonna 0 (layout di celle 8 × 8)                                                                             |
| Offset delle colonne bitmap                      | pixel X → offset in byte all'interno della riga (alta risoluzione o multicolore)                                                                |
| Maschera di bit dei pixel                        | X → maschera di bit (alta risoluzione / multicolore, eventualmente invertita per ` E `)                                                         |
| Moltiplicare / dividere / resto per una costante | x · k, ⌊x / k⌋, x mod k                                                                                                                         |
| Quarti di quadrato                               | ⌊(x − offset)² / 4⌋, 512 voci — a · b = sqr(a + b) − sqr(a − b)                                                                                 |
| Reciproco                                        | ⌊N / x⌋                                                                                                                                         |
| Logaritmo / esponenziale                         | round(log2 x · s), round(2^(x / s))                                                                                                             |
| Bit inverso                                      | capovolge un byte (o coppie di bit in multicolore) per specchiare sprite e personaggi                                                           |
| Espressione personalizzata                       | qualsiasi formula di `i` (`k` = indice basato su 0, `n` = conteggio); `sin`, `cos`, `abs`, `min`, `max`, `round`, `floor`, `PI`, `$hex`, `%bin` |
| Speedcode: memoria di riempimento/copia          | una subroutine; *memorie per iterazione* 0 = completamente srotolato, N = un ciclo X con N memorie per passaggio                                |

I valori superiori a 255 diventano una coppia di tabelle **lo/hi** (`label_lo`,
`label_hi`) o una tabella `.word`; i valori negativi sono in complemento a due.
Opzioni: etichetta, esadecimale/decimale, valori per riga, **Allinea alla
pagina** (`.align 256`, evita il ciclo di cambio pagina). **Copia** inserisce
l'assemblaggio negli appunti; **Insert** lo aggiunge al programma (reinserendo
la stessa etichetta si sostituisce la copia precedente) — in modalità Ultimate
Basic inserisce un `array` con `data` righe. Il menu File salva anche la tabella
come `.bin` (byte bassi, poi byte alti) e la esporta in Ultimate Basic.

### Convertitore di numeri

Un piccolo convertitore DEC/HEX/BIN **non-modale**, apribile con il pulsante
della barra degli strumenti accanto all'Editor D64 (fare nuovamente clic o
premere Esc per chiudere). Il pulsante rimane evidenziato finché il convertitore
è visualizzato. Rimane aperto anche durante la modifica del programma in
qualsiasi modalità.

- Digita in uno qualsiasi dei campi **DEC**, **HEX** o **BIN** e gli altri due
  seguiranno. Sono accettati i prefissi `$`, `0x`, `%`, `0b` e i separatori
  (spazio, `_`); un numero decimale negativo viene convertito in complemento a
  due nella larghezza corrente; l'input non valido viene evidenziato in rosso.
- ** Larghezza a 8/16 bit ** — un valore superiore a 255 passa automaticamente a
  16 bit.
- **Riga di bit** — clicca su un bit per attivarlo/disattivarlo.
- La riga informativa mostra il valore **signed** e, in modalità a 16 bit, il
  byte **low** e **high**.
- **I pulsanti Copia** copiano il valore con il suo prefisso (`53280`, `$D020`,
  `%1101000000100000`).
- Trascinalo dall'intestazione; memorizzerà il suo valore, la larghezza e la
  posizione e si riaprirà dopo un riavvio se era aperto quando lo hai chiuso.

---


*© 2026 Zsolt Tarczali — Assemblatore visivo C64*
