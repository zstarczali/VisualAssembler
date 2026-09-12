# C64 Visual Assembler — Manuale utente

**Versione 2.4.0**

Un assembler visuale a blocchi per il Commodore 64, basato sul processore 6502. Crea programmi trascinando e rilasciando blocchi di istruzioni e visualizza in tempo reale il codice assembly e il codice macchina generati.

---

## Sommario

- [C64 Visual Assembler — Manuale utente](#c64-visual-assembler--user-manual)
    - [Punti salienti della versione 2.4.0](#version-240-highlights)
    - [Punti salienti della versione 2.3.9](#version-239-highlights)
    - [Punti salienti della versione 2.3.8](#version-238-highlights)
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
    - [Carica il file .asm (riferimento rapido)](#load-asm-file-quick-reference)
      - [Note e best practice sull'analisi dell'importazione](#import-parsing-notes-and-best-practices)
  - [Modalità UltimateBasic](#ultimatebasic-mode)
    - [Apertura dell'editor UB](#opening-the-ub-editor)
    - [Strumenti dell'editor](#editor-tools)
    - [Progetti, schede e file di avvio](#projects-tabs-and-startup-files)
    - [Edificio e diagnostica](#building-and-diagnostics)
    - [Running, D64, ed Exomizer](#running-d64-and-exomizer)
    - [Simboli di debug e disassemblaggio](#debugger-symbols-and-disassembly)
    - [Manuale e fonte di Ultimate Basic](#ultimate-basic-manual-and-source)
  - [6. Modalità esperto](#6-expert-mode)
    - [Cambio modalità](#switching-modes)
    - [Layout dell'editor](#editor-layout)
    - [Pulsanti della barra degli strumenti](#toolbar-buttons)
    - [Evidenziazione degli errori](#error-highlighting)
    - [Evidenziazione della sintassi](#syntax-highlight)
    - [Formattatore sorgente](#source-formatter)
    - [Pannello e schede del progetto](#project-panel--tabs)
    - [Barra delle schede](#tab-bar)
  - [7. Modalità di indirizzamento](#7-addressing-modes)
    - [Etichetta le espressioni come operandi](#label-expressions-as-operands)
    - [Il contatore di programma `*` nelle espressioni](#the--program-counter-in-expressions)
    - [Etichette locali (tratteggiate)](#local-dotted-labels)
    - [Etichette degli operandi del codice automodificante](#self-modifying-code-operand-labels)
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
    - [END / alias RTS](#end--rts-alias)
    - [MACRO / ENDM / INVOKE](#macro--endm--invoke)
      - [MACRO (inizio definizione)](#macro-definition-start)
      - [ENDM (fine della definizione)](#endm-definition-end)
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
  - [10. Integrazione del debugger](#10-debugger-integration)
    - [RetroDebugger](#retrodebugger)
    - [Blocchi di interruzione](#breakpoint-blocks)
    - [Flag di debug (scheda Opzioni)](#debugger-flags-options-tab)
  - [11. Collegamenti alla base di conoscenza](#11-knowledge-base-links)
  - [12. Esportazione ed esecuzione D64](#12-d64-export--run)
    - [Pulsante Split Run](#split-run-button)
    - [Finestra di dialogo Esporta in D64](#export-to-d64-dialog)
    - [Metadati D64 nei progetti](#d64-metadata-in-projects)
  - [12b. Esportazione CRT (cartuccia Magic Desk 64K)](#12b-crt-export-magic-desk-64k-cartridge)
  - [13. Impostazioni hardware](#13-hardware-settings)
    - [Emulatore VICE](#vice-emulator)
    - [Esoizer](#exomizer)
    - [Retro Debugger](#retro-debugger)
    - [C64 Ultimate / 1541 Ultimate](#c64-ultimate--1541-ultimate)
  - [14. Editor visivi (Toolkit)](#14-visual-editors-toolkit)
    - [Editor ad alta risoluzione/multicolore](#hi-res--multicolor-editor)
    - [Editor di sprite](#sprite-editor)
    - [C64 Character ROM Browser (“Char map”)](#c64-character-rom-browser-char-map)
    - [Editor di caratteri (Charset)](#character-editor-charset)
    - [Editor di tela Charset](#charset-canvas-editor)
    - [Editor di mappe (mappe a tessere multilivello)](#map-editor-multilayer-tilemaps)
    - [Editor SID (Tracker a 3 voci)](#sid-editor-3-voice-tracker)
    - [Editor di curve](#curve-editor)

---

## Punti salienti della versione 2.4.0

- **Editor D64** — un browser completo di immagini disco sulla barra degli strumenti (dopo l'Editor Curve). Apri un `.d64` esistente, creane uno nuovo vuoto o avvia il disco corrente direttamente in VICE, tutto da un menu File ▾ che corrisponde agli altri editor visivi. Vedi [Editor D64 (sfoglia e modifica un'immagine disco esistente)](#d64-editor-browse--edit-an-existing-disk-image).
- **Aggiungi / estrai / rinomina / elimina nell'editor D64** — aggiungi un file locale alla directory del disco, estrai una voce selezionata in un `.prg`, rinomina una voce in linea nella tabella o eliminala — ogni azione viene applicata direttamente al file `.d64` tramite `c1541`, senza alcun passaggio di salvataggio separato.
- **Indirizzo di caricamento, indirizzo di decompressione ed Exomizer nell'editor D64** — l'aggiunta di un file raw senza intestazione consente di impostare un indirizzo di caricamento opzionale, una destinazione di decompressione Exomizer e di comprimerlo durante l'importazione, utilizzando le stesse modalità di compressione `mem`/`sfx` dei file extra della finestra di dialogo Esporta in D64. Un `.prg` che contiene già la propria intestazione ignora completamente questi campi.
- **Selettore del tipo di voce del disco** — scegli PRG / SEQ / USR / REL per un file appena aggiunto invece di scriverlo sempre come PRG.
- **Elenco directory autentico** — l'elenco dei file dell'editor D64 viene visualizzato nel font C64 Pro incluso, in maiuscolo, per l'aspetto classico `LOAD"$",8`.
- **Risolto:** la ridenominazione di una voce nell'editor D64 non annulla più la modifica quando si fa clic nel campo di testo.
- **Migliorato:** il badge della barra degli strumenti dell'indicatore di modalità del tema chiaro (MODALITÀ BLOCCO / MODALITÀ ESPERTO / …) è più scuro e più leggibile e la sua animazione di scintillio è di nuovo visibile.

---

## Punti salienti della versione 2.3.9

Cinque funzionalità che migliorano l'esperienza utente nell'assembler, tutte utilizzabili nel testo della modalità Esperto e (ove opportuno) come blocchi. Ciascuna ha una propria sezione di riferimento più avanti:

- **`*` in qualsiasi espressione** — il simbolo del contatore di programma ora funziona all'interno delle espressioni operando, non solo da solo: `BNE *-5`, `JMP *+20`, `LDA #&lt;*`, `LDA #&gt;(*+63)`. Un `*` che segue un valore (`STRIDE*2`) è ancora una moltiplicazione. Vedi [Modalità di indirizzamento → Il contatore di programma `*` nelle espressioni](#the--program-counter-in-expressions).
- **Etichette locali (tratteggiate)** — un'etichetta come `.loop` appartiene all'ambito dell'etichetta *globale* (non tratteggiata) più vicina precedente, quindi `DrawSprite` e `ClearScreen` possono definire ciascuno il proprio `.loop` senza conflitti. Vedi [Etichette locali (tratteggiate)](#local-dotted-labels).
- **Pseudo-operazioni a diramazione lunga** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`, `LBMI`, `LBPL`, `LBVC`, `LBVS` si assemblano in un salto invertito su un `JMP` (sempre 5 byte) in modo che la destinazione possa essere a qualsiasi distanza. Nuova categoria di tavolozza **diramazioni lunghe**. Vedi [LBNE / LBEQ / … (diramazioni lunghe)](#lbne--lbeq---long-branches).
- **`.assert` direttiva** — `.assert fine - inizio &lt;= 256` o `.assert * &lt; $A000, "messaggio"` viene valutato in fase di assemblaggio e la compilazione fallisce (mostrando il valore effettivo) quando l'espressione è falsa. Vedi [.ASSERT](#assert).
- **Etichette degli operandi del codice automodificante** — `Il valore LDA:#$00` definisce l'etichetta `valore` che punta al byte dell'operando dell'istruzione, quindi `il valore STA` lo modifica direttamente. Vedi [Etichette degli operandi del codice automodificante](#self-modifying-code-operand-labels).
- **Errori di diramazione fuori intervallo più intuitivi** — una diramazione che si trova al di fuori di −128…+127 ora segnala esattamente di quanto supera l'intervallo e suggerisce la diramazione lunga corrispondente `LBxx`.

---

## Punti salienti della versione 2.3.8

- **Salvataggio/apertura dello spazio di lavoro:** salva l'insieme esatto di schede aperte basate su file, inclusa la scheda attiva e la modalità di modifica di ciascuna scheda, in un file di spazio di lavoro `.vaws`. Gli spazi di lavoro vengono salvati automaticamente in caso di modifiche e l'app ripristina automaticamente l'ultimo spazio di lavoro all'avvio.
- **Interruttore pannello memoria globale:** mostra o nascondi il pannello memoria C64 completo tramite un interruttore UI dedicato.
- **Riferimento ai comandi Ultimate Basic localizzato:** Le descrizioni dei comandi nel popup di completamento automatico e nel pannello Comandi ora seguono la lingua corrente dell'interfaccia utente (ungherese, inglese, spagnolo, tedesco, olandese), con fallback in inglese.
- **Documentazione grafica Ultimate Basic aggiornata:** `PENNA COLORATA` e il testo della guida del comando di disegno plot/line/rect/circle e multicolore ora corrispondono al comportamento corrente del compilatore.
- **Riferimento KERNAL corretto:** sono state corrette le voci `SETLFS` e `PLOT` (indirizzi e convenzioni di chiamata) nella tabella degli indirizzi KERNAL del disassemblatore.
- **Risolto il problema dell'utilizzo della memoria con molte schede aperte:** la cronologia di annullamento/ripristino per scheda è ora limitata (con un piccolo debounce), impedendo la crescita illimitata della memoria che una lunga sessione con molti documenti aperti causava in precedenza.
- **Pulizia della barra degli strumenti dell'editor:** sono stati rimossi i pulsanti ridondanti di attivazione/disattivazione dei breakpoint dalle barre degli strumenti Expert e Ultimate Basic (i breakpoint vengono ancora impostati dal margine dei numeri di riga) ed è stata allineata l'altezza della barra degli strumenti Expert con quella della barra degli strumenti Ultimate Basic.

---

## 1. Panoramica dell'interfaccia

L'applicazione è suddivisa in tre pannelli principali:

| Pannello                 | Descrizione                                                                      |
| ------------------------ | -------------------------------------------------------------------------------- |
| **Sinistra — Tavolozza** | Tutti i blocchi di istruzioni e macro disponibili. Cerca o naviga per categoria. |
| **Centro — Programma**   | Il tuo programma. Trascina i blocchi qui, riordinali, modifica gli operandi.     |
| **Destro — Uscita**      | Visualizzazione ASM in tempo reale e/o output del monitor di memoria.            |

Il badge della modalità all'estrema destra dell'intestazione identifica l'editor attivo **Block**, **Expert** o **Ultimate Basic**. Si aggiorna immediatamente quando cambia la modalità di modifica.

---

## 2. Tavolozza a blocchi

La tavolozza a sinistra elenca tutti i blocchi disponibili, raggruppati per categoria:

- **Movimento dati** — LDA, LDX, STA, STX, …
- **Aritmetica** — ADC, SBC, INC, DEC, CMP, …
- **Logica** — AND, ORA, EOR, BIT
- **Salti e diramazioni** — JMP, JSR, RTS, BNE, BEQ, …
- **Rami lunghi** — LBNE, LBEQ, LBCC, LBCS, LBMI, LBPL, LBVC, LBVS (ramo a qualsiasi distanza; vedi §8)
- **Operazioni di registrazione** — TAX, TAY, INX, DEX, …
- **Shift & Rotate** — ASL, LSR, ROL, ROR
- **Stack** — PHA, PHP, PLA, PLP
- **Sistema** — CLC, SEC, NOP, BRK, …
- **Istruzioni illegali** — LAX, SAX, DCP, …
- **Structure** — LABEL, COMMENT, REGION, ENDREGION
- **Macros** — LOOP, NEXT, FOR, ENDF, PUSH, PULL, END, TEXT, BYTE, WORD, FILL, ALIGN, ASSERT, STRING, DATA, RAWBYTES, RAWTEXT, PETSCII, CHARSET, INCBIN, SID, INCLUDE, TABLE, ORG, MACRO, ENDM, INVOKE, IF, ELSE, ENDIF, VAR, WHILE, ENDW, REPEAT, UNTIL, MEMCPY, MEMSET, PRINT, PRINT_CHAR, PRINT_HEX, CLEAR_SCREEN, WAIT_KEY, DELAY, SET_BORDER, SET_BG, IRQ_SETUP, RAND, SPRITE_INIT, SPRITE_POS, WAIT_RASTER, JOYSTICK, MOUSE, SPRITE_COL, LOADFILE, REU_CHECK, REU_STASH, REU_FETCH, REU_SWAP, TURBO_SET, SUPERCPU_DETECT, TURBO_ENABLE, MAP_COPY, MAP_COPY16X16, SPRITE_ANIM, SCORE_BCD

Utilizza la casella di ricerca **** nella parte superiore della tavolozza per filtrare per nome. Fai clic sul pulsante **Aggiungi blocco selezionato** oppure trascina un blocco nell'area del programma.

---

## 3. Area del programma

- **Trascina e rilascia** i blocchi dalla tavolozza oppure **riordina** i blocchi esistenti trascinando la loro maniglia (≡).
- Ogni blocco mostra il suo **mnemonico**, il **campo operando** e il **selettore della modalità di indirizzamento** (ove applicabile).
- Fai clic sul pulsante **▸ / ▾** per comprimere o espandere un blocco.
- Utilizza il pulsante **× (cancella)** su un blocco per rimuoverlo.
- **Comprimi tutto** Il pulsante comprime tutti i blocchi contemporaneamente.

### minimappa del pannello a blocchi

Il pannello Programma ha un pulsante **minimappa** attivabile/disattivabile nella sua intestazione. Quando è attivato, una stretta striscia di `56 px` appare sul bordo destro del pannello, mostrando tutti i blocchi come barre orizzontali con codifica a colori:

| Colore della barra | Tipo di blocco                     |
| ------------------ | ---------------------------------- |
| Ciano              | Etichette                          |
| Blu/viola          | Macro e direttive                  |
| Giallo             | Istruzioni                         |
| Verde              | Commenti e righe vuote             |
| Rosso              | Blocchi con un errore di convalida |

I blocchi compressi vengono visualizzati con opacità ridotta. Fai clic o trascina in un punto qualsiasi della minimappa per scorrere l'elenco dei programmi fino a quella posizione. L'indicatore della finestra di visualizzazione (rettangolo colorato) tiene traccia della porzione visibile dell'elenco. Lo stato viene salvato nelle impostazioni dell'interfaccia utente (tasto `blockMinimap`).

### Input operativo

- Per le istruzioni di diramazione/salto (`BNE`, `JMP`, `JSR`, ecc.) viene visualizzato un menu a tendina **selettore di etichette**: fai clic su un'etichetta definita per inserirla.
- Il formato numerico segue l'interruttore **HEX / DEC** nella barra degli strumenti (vedere la sezione 5).

---

## 4. Vista ASM

Il pannello di destra mostra l'output generato in tempo reale.

### Modalità di uscita

| Modalità             | Descrizione                                                                                                                                                                                                                                                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ASM**              | Codice sorgente di assemblaggio 6502 con indirizzi ed etichette                                                                                                                                                                                                                                                              |
| **Monitor**          | Dump esadecimale/byte (stile monitor C64)                                                                                                                                                                                                                                                                                    |
| **Disastro**         | Disassemblaggio puro del 6502: indirizzo · byte esadecimali · mnemonici con operandi numerici risolti. Le macro sono espanse in singole istruzioni (TEXT → coppie LDA/STA, LOOP → LDX, ecc.). I dati BYTE/WORD/FILL sono mostrati come dump esadecimale a blocchi. Nessun nome di macro, commento o annotazione nell'output. |
| **Entrambi**         | ASM in alto, monitor in basso                                                                                                                                                                                                                                                                                                |
| **Disassemblatore**  | Come per lo smontaggio: scheda dedicata alla visualizzazione dello smontaggio.                                                                                                                                                                                                                                               |
| **Kit di strumenti** | Pannello di riferimento C64: tavolozza di 16 colori + foglio riassuntivo con i codici di controllo PETSCII e i caratteri stampabili. Sola lettura: per maggiori dettagli, consultare la sottosezione "Toolkit" qui sotto.                                                                                                    |
| **Opzioni**          | Pannello delle impostazioni del programma: formato numerico, attivazione/disattivazione della sorgente macro, parametri del debugger                                                                                                                                                                                         |

### Scheda Strumenti

La scheda **Toolkit** nella vista ASM è un pannello di riferimento rapido di sola lettura: non modifica mai il programma. È composta da due sezioni:

| Sezione                         | Contenuto                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ** Tavolozza colori C64**       | Griglia di 16 campioni che mostra tutti i colori del C64 con il relativo indice (0–15 / `$00`–`$0F`) e nome. Clicca su un campione per copiare il suo indice esadecimale negli appunti. Passa il mouse sopra per visualizzare il nome del colore (Azzurro, Marrone, ecc.).                                                                                                                                                                       |
| **Codici di controllo PETSCII** | Codici di controllo comuni per `CHROUT` ($FFD2): codici di cambio colore (`$05` bianco, `$1C` rosso, `$1E` verde, `$1F` blu, …), movimento del cursore (`$11`/`$1D`/`$91`/`$9D`), inversione on/off (`$12`/`$92`), `$93` cancella schermo, `$8E`/`$0E` interruttori del set di caratteri. Anche un foglio riassuntivo stampabile (32-64 punteggiatura, 65-90 A-Z, 91-95 parentesi, 96-127 grafica, 160-191 grafica traslata, 192-223 speculare). |

Il Toolkit è il modo più rapido per cercare un indice di colore o un byte di controllo PETSCII senza uscire dall'editor.

### Scheda Opzioni

La scheda **Opzioni** contiene le impostazioni che influenzano la generazione del codice e la visualizzazione dell'output:

- **Codice sorgente macro** — quando ATTIVO, i blocchi di definizione macro (MACRO…ENDM) mostrano il loro codice sorgente in linea nella vista ASM.
- **Indirizzo di inizio programma** — ora impostato tramite un blocco **ORG** nell'area del programma anziché tramite un campo di input separato. Il primo blocco ORG definisce l'indirizzo di caricamento del programma; i blocchi ORG successivi avviano sezioni aggiuntive a indirizzi diversi.
- **Parametri del debugger** — tre interruttori in linea che controllano quali flag vengono passati al debugger esterno all'avvio:
  - **`-jmp` ON/OFF** — salta direttamente all'indirizzo di avvio del programma dopo il caricamento.
  - **`-unpause` ON/OFF** — riavvia il debugger immediatamente al caricamento.
  - **`-wait` ms ON/OFF** — aggiunge un ritardo `-wait <ms>` prima di riprendere; seleziona 500 ms o 1000 ms dal menu a tendina.
- **Informazioni di compilazione** — mostra un riepilogo del programma compilato (indirizzo di inizio del codice, dimensione, stato dello stub BASIC SYS).

### Fare clic su una riga ASM

Fai clic su una qualsiasi riga nella vista ASM per **evidenziare il blocco corrispondente** nell'area del programma.

### Numeri di riga ASM

Il pannello ASM visualizza i numeri di riga (001 | 002 | 002, ...) per facilitare la risoluzione dei problemi quando un errore di compilazione punta a una riga specifica.

- La numerazione visiva delle linee è solo a scopo diagnostico.
- **Copia ASM** copia ancora il testo sorgente pulito **senza** prefissi dei numeri di riga.

### Finestra modale di avanzamento della compilazione

Durante le operazioni più complesse, viene visualizzata una finestra modale centrata con una barra di avanzamento:

- **Esegui in VICE** — compilazione/creazione del PRG e avvio dell'emulatore.
- **Debug** — compilazione/creazione del PRG e avvio del debugger.
- **Carica file .asm** — apri un file `.asm` in modalità esperto e materializza i blocchi dal codice sorgente.

La finestra modale si chiude automaticamente al termine dell'azione o in caso di errore.

---

## 5. Impostazioni e barra degli strumenti

| Controllare                                          | Descrizione                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Base numerica (esadecimale / decimale / binario)** | Imposta il formato di visualizzazione/input per gli operandi nell'interfaccia utente. La modalità BIN visualizza i valori in formato binario con il prefisso `%` (ad esempio `%11111000`). La vista ASM mostra sempre ciascun blocco nel suo formato.                                                                                                                                                                                                                                            |
| **Lingua**                                           | Consente di passare dall'interfaccia utente in inglese, ungherese, spagnolo, tedesco e olandese (Nederlands).                                                                                                                                                                                                                                                                                                                                                                                    |
| **Tema**                                             | Chiaro / Scuro / OLED / Commodore 77: selezionalo dal selettore temi nel menu Impostazioni. OLED utilizza uno sfondo nero puro per i display AMOLED. Commodore 77 è un tema giallo neon su nero; quando è attivo, il pannello di avvio utilizza il colore del pannello del tema (che corrisponde alla schermata dei messaggi), mostra un logo Commodore 77 dedicato più piccolo e una barra di avanzamento gialla. Il tema scelto viene applicato prima del primo rendering al successivo avvio. |
| **Modalità retro CRT**                               | Attiva/disattiva un filtro CRT a schermo intero: linee di scansione, vignettatura del fosforo, sfarfallio e distorsione a barilotto. Lo stato viene salvato tra una sessione e l'altra.                                                                                                                                                                                                                                                                                                          |
| **Mostra pannello memoria**                          | Interruttore globale che mostra o nasconde il pannello completo della memoria del C64.                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Stub BASIC SYS**                                   | Aggiunge una riga BASIC che richiama SYS all'origine del programma.                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Esempio**                                          | Carica un programma di esempio integrato                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Zoom avanti/indietro**                             | Ridimensiona l'interfaccia utente del blocco (influisce su tutti gli elementi del blocco)                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Salva progetto**                                   | Salva il programma corrente come file di progetto `.json`                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Salva programma come**                             | Salva il programma corrente come file di progetto `.json` utilizzando una nuova finestra di dialogo file ogni volta                                                                                                                                                                                                                                                                                                                                                                              |
| **Carica progetto**                                  | Carica un progetto salvato in precedenza                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Salva l'area di lavoro**                           | Salva l'insieme esatto delle schede attualmente aperte e supportate da file, inclusa la scheda attiva e la modalità di modifica di ciascuna scheda (Blocco/Esperto/Base avanzata), in un file di spazio di lavoro `.vaws`.                                                                                                                                                                                                                                                                       |
| **Salva l'area di lavoro come**                      | Salvare l'area di lavoro corrente utilizzando una nuova finestra di dialogo file ogni volta                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Apri l'area di lavoro**                            | Chiudi tutte le schede aperte e riapri il set di file memorizzati in un file di spazio di lavoro `.vaws`.                                                                                                                                                                                                                                                                                                                                                                                        |
| **Imposta la cartella di lavoro**                    | Scegli la cartella predefinita utilizzata dalle finestre di dialogo di selezione e salvataggio dei file. Il percorso viene memorizzato nella configurazione dell'applicazione e le anteprime dei menu mantengono visibile la parte finale del percorso.                                                                                                                                                                                                                                          |
| **Apri progetto** (`Menu → File`)                    | Apri un progetto multifile `.proj` e apri tutti i file sorgente come schede                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Salva progetto** (`Menu → File`)                   | Salva il progetto `.proj` corrente (il pannello del progetto deve essere aperto)                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Chiudi progetto** (`Menu → File`)                  | Chiudi il progetto attualmente aperto e tutte le relative schede file. Viene richiesto di salvare le modifiche non salvate. Il pannello del progetto viene ripristinato allo stato vuoto.                                                                                                                                                                                                                                                                                                        |
| **Carica il file .asm**                              | Apre un file `.asm` in modalità esperto e importa codice ASM testuale 6502 nella scheda corrente                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Salva PRG**                                        | Esporta il binario compilato come file `.prg`                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Crea CRT**                                         | Esportare il programma come file Magic Desk da 64 KB (`.crt`, tipo di cartuccia 19). Vedere [Sezione 12b](#12b-crt-export-magic-desk-64k-cartridge).                                                                                                                                                                                                                                                                                                                                             |
| **Esegui (pulsante diviso)**                         | Il pulsante principale **▶ Esegui** avvia la modalità corrente; fai clic sulla freccia **▾** per passare tra: **Esegui come PRG** (compila e avvia VICE direttamente), **Esegui tramite D64** (impacchetta in un'immagine disco .d64 e avvia VICE) o **Esegui su hardware** (invia PRG a un dispositivo C64 Ultimate / 1541 Ultimate). Vedi [Sezione 12](#12-d64-export--run) e [Sezione 13](#13-hardware-settings).                                                                             |
| **Debug (RetroDebugger)**                            | Compilare ed eseguire in RetroDebugger con breakpoint, simboli e flag di avvio automatico (vedere [Sezione 9](#9-debugger-integration))                                                                                                                                                                                                                                                                                                                                                          |
| **Esegui con Exoizer**                               | Casella di controllo nel menu Impostazioni: quando abilitata, tutte le operazioni di esecuzione e compilazione elaborano il file PRG tramite `exomizer sfx sys` prima di avviarlo o salvarlo. Funziona con Esegui come PRG, Esegui tramite D64, Esegui su hardware, Compila PRG e Compila D64. Configura prima l'eseguibile di Exomizer in **Impostazioni hardware**.                                                                                                                            |
| **Salvataggio automatico delle istantanee**          | Casella di controllo in **Impostazioni hardware → Snapshot**. Quando è abilitata, l'app crea automaticamente uno snapshot circa 2,5 secondi dopo aver smesso di modificare una scheda. Disattivala se desideri salvare gli snapshot solo manualmente.                                                                                                                                                                                                                                            |
| **Impostazioni hardware**                            | Aprire la finestra di dialogo di configurazione hardware: configurare VICE, Exomizer, RetroDebugger e C64 Ultimate (host, password, test di connessione). Vedere [Sezione 13](#13-hardware-settings).                                                                                                                                                                                                                                                                                            |
| **Nuovo programma…**                                 | Apre una finestra di dialogo di conferma, quindi cancella tutti i blocchi dall'area del programma.                                                                                                                                                                                                                                                                                                                                                                                               |
| **Comprimi tutto**                                   | Comprimi tutti i blocchi                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Informazioni**                                     | Informazioni sulla variante                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Novità**                                           | Registro delle modifiche                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

### Istantanee del progetto

Le istantanee del progetto vengono memorizzate come file JSON sidecar su disco, non in localStorage. Sono collegate al file di progetto corrente, se presente, in modo che la cronologia sopravviva ai riavvii e segua il progetto.

- **Menu → Build → Salva snapshot** apre la finestra di dialogo snapshot e salva lo stato corrente del blocco più il testo Expert ASM.
- **Menu → Build → Ripristina versione precedente** ripristina direttamente l'ultima snapshot.
- **Menu → Build → Cronologia snapshot** apre la finestra di dialogo in cui è possibile aggiungere note, ripristinare voci precedenti o eliminarle.
- **Impostazioni hardware → Snapshot → Salvataggio automatico degli snapshot** controlla se l'app crea automaticamente snapshot dopo le modifiche. Il ritardo predefinito è di circa 2,5 secondi e l'impostazione si applica a ogni scheda.
- Se un progetto non è ancora stato salvato, gli snapshot vengono memorizzati nella directory di configurazione dell'app finché al progetto non viene assegnato un percorso file. | **Base di conoscenza** | Collegamenti di riferimento (opcode 6502, kernel C64, mappa della memoria, colori) | | **Verifica aggiornamenti** | Apri la pagina itch.io per verificare la disponibilità di una versione più recente |

### Spazi di lavoro

Un'area di lavoro (file vaws) memorizza quali file reali su disco erano aperti in ogni scheda, inclusa la modalità di modifica di ciascuna scheda e quale scheda era attiva, in modo da poter riaprire esattamente quello stesso set in seguito. È separata da un progetto proj: un'area di lavoro può estendersi su qualsiasi combinazione di file di progetto Block/Expert json, file asm autonomi e sorgenti Ultimate Basic ub/proj su più schede.

- Gli spazi di lavoro **salvano automaticamente** poche centinaia di millisecondi dopo aver apportato una modifica, una volta che uno è stato salvato o aperto.
- L'app **ripristina automaticamente l'ultimo spazio di lavoro** all'avvio, in modo che le schede aperte riprendano da dove le avevi interrotte.
- Solo le schede supportate da un file reale sul disco vengono salvate nell'area di lavoro; una scheda contenente un esempio non salvato o un programma presente solo in memoria non ha nulla da rendere persistente e viene ignorata (con un avviso se nessuna delle schede aperte soddisfa i requisiti).
- L'apertura di un'area di lavoro chiude prima tutte le schede attualmente aperte: ti verrà chiesto di confermare prima di procedere.
- Se un'area di lavoro fa riferimento a un file che è stato spostato o eliminato, tale voce viene ignorata e segnalata per nome dopo il caricamento.

### Carica il file .asm (guida rapida)

Il caricatore in modalità esperto `.asm` accetta i modelli di sorgente comuni del 6502 e li converte in blocchi:

- `* = $1500` → blocco ORG
- `Etichetta:` → blocco ETICHETTA
- `Etichetta: .byte 0` → Blocchi ETICHETTA + BYTE
- `.byte ...` → blocco BYTE
- `; commento` (o in linea `; ...`) → blocco COMMENTO
- istruzioni (`lda`, `jsr`, `beq`, ecc.) → blocchi di istruzioni con modalità di indirizzamento rilevata

#### Note di analisi e best practice per l'importazione

- Le etichette locali come `.wait` vengono importate come etichette standard (punto rimosso) e i riferimenti vengono normalizzati di conseguenza.
- Per l'indirizzamento in stile `($zp),Y` / `($zp,X)`, utilizzare un byte di pagina zero concreto (`$FB`, `$FC`, ecc.) per la migliore compatibilità.
- Evitare etichette brevi ambigue che assomigliano a esadecimale (`cc1`, `dead`, `beef`) nei contesti di diramazione; preferire nomi come `loop_cc1`.
- Se il tuo programma inizia con dati (`.byte`) prima del codice eseguibile, aggiungi un salto di ingresso esplicito (ad esempio `JMP Start`) all'inizio.

### Importazione ASM (Kick Assembler)

Il pulsante **Importazione ASM** nel menu Programma importa il codice sorgente grezzo di Kick Assembler in una nuova scheda in modalità blocco. È separato dal pulsante `Carica file .asm` della modalità Esperto sopra menzionato: il suo tooltip personalizzato segnala che **è supportato solo il codice Kick Assembler** (altri assembler potrebbero essere analizzati parzialmente ma non è garantito un ciclo completo).

Modelli supportati:

- `.pc = $XXXX` direttiva origine → blocco ORG
- `.const NOME = valore`, `.etichetta NOME = valore` → CONST equate
- `.macro NOME(p1, p2, ...) { ... }` con `{`/`}` corpo della parentesi graffa o `.endm` → definizione macro utente
- Invocazione macro `NOME(argomenti)`, prefisso due punti Kick `:NOME(argomenti)` e `.invoke NOME(argomenti)` — tutti con andata e ritorno tramite la forma due punti Kick
- Le etichette `@local` (`@loop:`, `BEQ @loop`) mantengono il prefisso `@` così com'è
- Operando `etichetta + N` / `etichetta - N` (ad esempio `STA mod1+2`, `LDA xp+1`)
- I commenti di riga `// ...` e `;` — entrambi accettati, i blocchi `/* ... */` vengono trattati come un'unica riga di commento
- Passaggio automatico BASIC: quando il programma inizia a `$0801` con lo stub di byte standard `SYS 2061` (`.byte $0B,$08,$0A,$00,$9E,$32,$30,$36,$31,$00,$00,$00`), il compilatore emette il PRG verbatim invece di racchiuderlo in un secondo BASIC SYS.

Limitazioni note:

- Le costanti che si risolvono in un indirizzo di pagina zero (ad esempio `.const BYTEADDR = $FC` usato come `STA BYTEADDR`) attualmente vengono compilate in istruzioni in modalità assoluta (3 byte) invece che in pagina zero (2 byte). Il codice compilato scrive comunque nella posizione di memoria corretta, ma con un piccolo overhead di dimensioni e cicli rispetto allo stesso codice sorgente compilato da Kick Assembler.

## Modalità UltimateBasic

Visual Assembler include un IDE **Ultimate Basic completo**. Ultimate Basic è un moderno linguaggio BASIC compilato per la creazione di programmi, giochi e demo per C64 senza dover scrivere ogni operazione in linguaggio assembly 6502 di basso livello. Il compilatore viene eseguito localmente e genera output PRG nativo per C64.

### Apertura dell'editor UB

Seleziona l'icona **UB** nella barra degli strumenti principale per passare alla modalità Ultimate Basic. La modalità editor selezionata viene memorizzata anche dopo il riavvio dell'applicazione. Un nuovo codice sorgente inizia con:

```basic
color bg 0
color border 0

print "HELLO FROM ULTIMATE BASIC"
```

La modalità UB funziona con i file sorgente `.ub`. **Nuovo**, **Apri**, **Salva** e **Salva con nome** operano sulla scheda UB attiva. L'apertura di un file `.ub` attiva automaticamente la scheda dell'editor corrispondente.

La barra degli strumenti mostra la cartella di lavoro UB corrente. Questa cartella è memorizzata separatamente dalla cartella di lavoro Blocco/Esperto. Quando la modalità UB è attiva, **File → Imposta cartella di lavoro** seleziona la cartella UB; il relativo tooltip identifica l'ambito attivo. Le finestre di dialogo Apri/Salva UB iniziano da lì e i file sorgente non salvati la utilizzano come base per i percorsi relativi `include` e `incbin`.

### Strumenti dell'editor

La barra degli strumenti UB segue lo stesso linguaggio visivo e gli stessi suggerimenti personalizzati della modalità Esperto. Offre:

- Evidenziazione della sintassi basata sul riferimento corrente al linguaggio Ultimate Basic;
- numeri di riga che rimangono sincronizzati con file di grandi dimensioni;
- una minimappa e controlli di zoom dell'editor; fai clic sulla minimappa per spostarti o trascina la selezione della sua area di visualizzazione per lo scorrimento continuo;
- Trova (`Ctrl+F` / `Cmd+F`) utilizzando la barra di ricerca in stile esperto;
- Formattazione del codice sorgente con rientro che tiene conto della struttura;
- Completamento automatico per comandi e funzioni integrate;
- un pannello **Comandi** ricercabile con sintassi, descrizione e guida all'uso: le descrizioni seguono la lingua corrente dell'interfaccia utente (ungherese, inglese, spagnolo, tedesco, olandese), con un ripiego sull'inglese per tutto ciò che non è ancora stato tradotto;
- Pannelli **Progetto** e **Comandi** attivabili e disattivabili indipendentemente, visualizzati uno accanto all'altro quando entrambi sono abilitati;
- Pannelli **Build Output** e **Disassembly** attivabili e ridimensionabili indipendentemente.

Il pannello Disassemblaggio include un pulsante **Copia** che copia negli appunti l'intero codice sorgente visualizzato. La guida ai comandi segue il compilatore incluso: ad esempio, `sprite_frame id, data_address [, frame]` seleziona un'immagine di animazione da frame sprite consecutivi da 64 byte.

L'elenco dei comandi è intenzionalmente limitato in altezza in modo che la scheda dei dettagli del comando possa riempire l'altezza rimanente del pannello. L'area dei dettagli scorre indipendentemente per consentire descrizioni di sintassi più lunghe.

### Progetti, schede e file di avvio

I progetti Ultimate Basic utilizzano file `.proj` e possono contenere più sorgenti `.ub`. Il pannello Progetto elenca i file aperti, contrassegna le schede non salvate e mostra etichette, funzioni e subroutine rilevate. Le azioni del progetto consentono di creare, aprire, salvare e chiudere un progetto o di aggiungere un altro file sorgente.

Fai clic sulla stella accanto a un file di progetto per contrassegnarlo come file di avvio ****. I comandi Build, Run, D64, C64 Ultimate e Debug compilano quel codice sorgente di avvio anche se è attualmente attiva una scheda diversa. Senza una selezione di avvio, viene utilizzata la scheda UB attiva.

### Costruzione e diagnostica

Il pulsante **Build** apre la stessa esperienza di avanzamento centrata utilizzata dagli altri flussi di lavoro di esecuzione di Visual Assembler. Le build riuscite aggiornano l'output di build, le informazioni di build e il disassemblaggio. Abilita **Verbose** per includere i dettagli della mappa di memoria del compilatore, le allocazioni interne di pagine zero e i dati del codice generato.

Quando la compilazione fallisce:

- L'output di compilazione viene reso visibile automaticamente;
- Gli errori di compilazione vengono visualizzati in rosso;
- la finestra di dialogo di compilazione centrata visualizza l'errore;
- errori contenenti una riga sorgente seleziona quella riga nell'editor UB attivo.

Il report Build Info riporta indirizzi di caricamento/fine, dimensioni del codice e dei PRG, stato dell'Exomizer, variabili, array, funzioni/sottoprogrammi ed etichette.

### Esecuzione, D64 ed Exomizer

Il pulsante principale diviso **Esegui** supporta Ultimate Basic in ogni destinazione normale:

| Modalità di esecuzione       | Comportamento di base ultimo                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Esegui come PRG**          | Compila ed esegui il PRG direttamente in VICE.                                                                   |
| **Esegui tramite D64**       | Compila, apri la finestra di dialogo standard per la creazione del pacchetto D64, quindi avvia il disco in VICE. |
| **Esegui su Ultimate**       | Carica ed esegui il file PRG tramite la connessione REST C64 Ultimate configurata.                               |
| **Esegui D64 sull'hardware** | Imballa un D64 e invialo al C64 Ultimate configurato.                                                            |

L'opzione globale **Impostazioni → Exomizer** si applica anche alle build UB e ai target di esecuzione normali; non è necessario attivare o disattivare separatamente la barra degli strumenti UB. Gli avvii del debugger utilizzano deliberatamente il PRG non compresso in modo che gli indirizzi e i simboli del compilatore continuino a corrispondere al programma eseguito.

Abilita **Impostazioni → Impostazioni programma → Genera sorgente UltimateBasic ASM (.asm)** per salvare l'assembly generato dal compilatore accanto a una build PRG o D64 utilizzando lo stesso nome file di base. Questa è un'opzione di compilazione, quindi la barra degli strumenti di UB non contiene pulsanti di esportazione ASM separati. Un'istruzione `load "NOME", $indirizzo` fornisce anche l'indirizzo di caricamento PRG del file extra D64 corrispondente.

### Simboli di debug e disassemblaggio

Le build richiedono informazioni di debug di Ultimate Basic e producono tre sidecar compatibili:

- `.sym` per i simboli in stile KickAssembly;
- `.dbg` per le informazioni sul codice sorgente e sul segmento di C64Debugger/RetroDebugger;
- `.vs` per le etichette del monitor VICE.

Il pannello di disassemblaggio UB colorato risolve le etichette note e presenta indirizzi, byte, mnemonici e operandi. Il pulsante **Debug** avvia RetroDebugger con il PRG UB grezzo, i sidecar di debug e le etichette, le funzioni, le subroutine, le variabili e gli array del compilatore. Le impostazioni di attesa e ripresa del debug sono condivise con la normale configurazione del debugger di Visual Assembler.

### Manuale e fonte di Ultimate Basic

L'icona del libro nella barra degli strumenti di UB apre il manuale Ultimate Basic `MANUAL.pdf` offline corrispondente; il pulsante del manuale nella finestra di dialogo di benvenuto all'avvio apre lo stesso manuale. Visual Assembler prende sia il compilatore che il PDF dalla dipendenza Git/Cargo upstream bloccata, quindi l'IDE non mantiene una seconda copia dell'implementazione di Ultimate Basic. La finestra di dialogo Informazioni e la schermata iniziale mostrano la versione effettiva della dipendenza.

Ultimate Basic è disponibile anche come progetto open-source autonomo:

<https://github.com/zstarczali/UltimateBasic>

Il compilatore è incluso in Visual Assembler, quindi non è necessario alcun eseguibile `ub` separato in fase di esecuzione.

## 6. Modalità esperto

La modalità Esperto è un editor di assembly 6502 completo, con funzionalità di scrittura diretta del testo, che affianca l'editor a blocchi. Ogni scheda può essere in modalità Blocco o in modalità Esperto: è possibile passare liberamente dall'una all'altra in qualsiasi momento utilizzando l'interruttore Blocco / Esperto nella barra superiore.

### Modalità di commutazione

- **Blocco → Esperto:** il programma corrente viene serializzato in testo (un'istruzione per riga, etichette, macro come direttive). Le modifiche in modalità Esperto vengono sincronizzate con l'array di blocchi ogni volta che si torna alla modalità precedente o si attiva un'azione.
- **Esperto → Blocco:** il testo viene analizzato con `parseAsmText()` e il risultato sostituisce il programma a blocchi. Viene visualizzata una finestra di dialogo di errore di compilazione se l'analisi fallisce.
- **Le righe vuote** vengono mantenute durante i passaggi di andata e ritorno: le righe vuote nell'editor esperto appaiono come sottili spaziatori tratteggiati in modalità Blocco e vengono ripristinate come righe vuote quando si torna alla modalità Esperto.

### Layout dell'editor

```
┌──────────────────────────────────────────────────────┐
│ [toolbar]  Block │ Expert < tab toggle               │
├────────────┬────────────────────────────┬────────────┤
│  Palette   │   ASM text editor          │  Disasm    │
│  (opt.)    │   (monospace, editable)    │  panel     │
│            │                            │  (opt.)    │
└────────────┴────────────────────────────┴────────────┘
```

| Pannello                  | Attiva/disattiva      | Descrizione                                                                                                                                             |
| ------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tavolozza**             | `#expert-palette-btn` | La tavolozza dei blocchi a sinistra: trascina i blocchi nell'editor oppure fai clic per inserirli in corrispondenza del cursore.                        |
| **Editor ASM**            | sempre visibile       | Area di testo a spaziatura fissa con evidenziazione della sintassi in tempo reale.                                                                      |
| **Pannello di emergenza** | `#expert-disasm-btn`  | Disassemblaggio completo del 6502: ogni istruzione mostra l'indirizzo, i byte esadecimali e gli operandi numerici; le macro sono completamente espanse. |

### Pulsanti della barra degli strumenti

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
| **Zoom indietro / avanti**              | `#expert-zoom-out-btn` / `#expert-zoom-in-btn` | Diminuisci/aumenta la dimensione del carattere dell'editor (da 8 a 28 px). L'impostazione viene salvata.                                                                                                                                                                         |
| **Tavolozza**                           | `#expert-palette-btn`                          | Mostra/nascondi la tavolozza mnemonica sinistra                                                                                                                                                                                                                                  |
| **Disastro**                            | `#expert-disasm-btn`                           | Mostra/nascondi il pannello di smontaggio (puro 6502, macro espanse)                                                                                                                                                                                                             |
| **Monitor**                             | `#pulsante-monitor-esperto`                    | Mostra/nascondi il pannello del dump esadecimale del monitor                                                                                                                                                                                                                     |
| **Minimappa**                           | `#expert-minimap-btn`                          | Mostra/nascondi la minimappa del codice sul lato destro dell'editor                                                                                                                                                                                                              |

Scorciatoie dell'editor: `Ctrl+/` (`Cmd+/` su macOS) commenta la riga corrente o tutte le righe selezionate; aggiungendo `Shift` si rimuove il marcatore di commento iniziale da tali righe. I commenti in linea (ad esempio `LDA $12 ; explanation`) rimangono sulla riga di istruzioni quando si passa dalla modalità Esperto alla modalità Blocco. La modalità Blocco li mostra come un marcatore verde corsivo `; comment` nell'intestazione del blocco; passando il mouse sopra il marcatore viene visualizzato il testo completo quando è troncato.

### Mappa del redattore esperto

La minimappa dell'editor esperto è una stretta striscia di tela (`88 px`) all'estrema destra dell'area dell'editor. Visualizza una rappresentazione in scala ridotta di ogni riga del codice sorgente:

| Colore della barra     | Tipo di token                                           |
| ---------------------- | ------------------------------------------------------- |
| Commento colore        | Righe che iniziano con `;`                              |
| Colore dell'etichetta  | Linee con una definizione `etichetta:`                  |
| Colore dell'indicatore | `.byte`, `.macro`, `.region` e tutte le altre direttive |
| Colore mnemonico       | Tutto il resto (istruzioni)                             |

Un indicatore di visualizzazione semitrasparente (rettangolo colorato) mostra quale parte della sorgente è attualmente visibile. Fai clic in un punto qualsiasi della minimappa per spostarti in quella posizione; trascina per scorrere continuamente. La minimappa scorre indipendentemente per mantenere l'indicatore di visualizzazione centrato. Lo stato viene salvato nelle impostazioni dell'interfaccia utente (tasto expertMinimap).

### Evidenziazione degli errori

Le righe che non vengono compilate correttamente vengono evidenziate in **rosso** (sfondo colorato + bordo accentato a sinistra) in tempo reale, 350 ms dopo ogni tasto premuto. Il primo messaggio di errore viene visualizzato anche nella barra di stato. Correggi la riga e l'evidenziazione scompare automaticamente.

### Evidenziazione della sintassi

L'editor utilizza una sovrapposizione trasparente `<div>` (`expert-hl`) che rispecchia il contenuto dell'area di testo con elementi colorati `<span>`. L'evidenziazione può essere disattivata con il pulsante **HL** per migliorare le prestazioni in programmi molto grandi.

| Colore       | Token                                                                                                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Giallo-verde | Mnemotecniche (`LDA`, `STA`, `JMP`, …) e pseudo-operazioni a lungo ramo (`LBNE`, `LBEQ`, …)                                                                             |
| Blu          | Direttive (`.byte`, `.word`, `.fill`, `.assert`, `*=`, …)                                                                                                               |
| Arancia      | Numeri (`$FF`, `%1010`, `255`)                                                                                                                                          |
| Ciano        | Etichette — righe che terminano con `:`, incluse le etichette locali (`.loop:`) e le etichette degli operandi del codice automodificante (`value:` in `LDA value:#$00`) |
| Verde acqua  | Letterali stringa                                                                                                                                                       |
| Verde scuro  | Commenti (`; …`)                                                                                                                                                        |

Le direttive `REGION` / `ENDREGION` vengono evidenziate come le altre direttive dell'assembler. Le regioni compresse mantengono visibile nell'editor solo l'intestazione della regione finché non vengono riaperte. La nuova opzione **Selezione regione** nella barra degli strumenti controlla solo l'evidenziazione automatica della regione corrente in modalità Esperto; disattivandola, il codice sorgente rimane visibile senza modificare lo stato di compressione.

### Formattatore sorgente

Fai clic sul pulsante **Formatta** (`#expert-format-btn`) per formattare automaticamente la sorgente corrente:

- Le definizioni delle etichette vengono spostate nella colonna 0.
- Le istruzioni sono rientrate di 4 spazi.
- Le formule mnemoniche sono scritte in maiuscolo.
- Esattamente uno spazio tra la frase mnemonica e l'operando (gli spazi bianchi in eccesso vengono normalizzati).
- Se la sorgente è già formattata, viene visualizzato lo stato `"Già formattato"`.

### Pannello e schede del progetto

La modalità esperto supporta un **pannello di progetto** (`#expert-project-panel`) per progetti `.proj` multi-file:

- Un file `.proj` è un manifesto JSON che elenca i file sorgente e i relativi metadati.
- Apri un progetto con **Menu → File → Apri progetto** oppure trascina un file `.proj` sulla finestra.
- Ogni file del progetto si apre come una scheda ** ** separata nella barra delle schede nella parte superiore dell'editor.
- **Chiudi progetto** (`Menu → File → Chiudi progetto` / `#menu-close-project`) chiude il progetto corrente e tutte le relative schede file contemporaneamente. Richiede di salvare eventuali modifiche non salvate prima della chiusura. Il pannello del progetto viene ripristinato allo stato vuoto e `_expertProjectData` viene cancellato.
- Ogni file può essere contrassegnato come **file di avvio** (★ icona a stella). Quando viene impostato un file di avvio, il pulsante **Esegui** (PRG, D64, Ultimate) compila ed esegue sempre il codice di quel file, indipendentemente dalla scheda attualmente attiva. Questo funziona sia in modalità a blocchi che in modalità esperto.
- La sezione **simboli** nella parte inferiore del pannello del progetto può essere ridimensionata verticalmente tramite il divisore tra la struttura dei file e l'elenco dei simboli, in modo che gli elenchi di simboli lunghi possano occupare più spazio quando necessario.

### Barra delle schede

La barra delle schede appare sopra l'editor quando sono aperte più schede.

| Caratteristica       | Descrizione                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Punto sporco**     | Un piccolo punto colorato a contrasto sul nome della scheda indica le modifiche non salvate.                                                                                                                                                                                                                                                                                                                  |
| **Scorri le frecce** | I pulsanti di scorrimento a sinistra/destra compaiono quando ci sono più schede di quelle che possono essere contenute nella barra.                                                                                                                                                                                                                                                                           |
| **Chiudi (×)**       | Chiude la scheda; chiede di salvare se la scheda è stata modificata.                                                                                                                                                                                                                                                                                                                                          |
| **Estensione file**  | Viene mostrato il nome completo del file, inclusa l'estensione (`.c64va`, `.json`).                                                                                                                                                                                                                                                                                                                           |
| **Menu clic destro** | Fai clic con il pulsante destro del mouse su una scheda (o su uno spazio vuoto della barra delle schede) per: **Nuova scheda**, **Chiudi scheda**, **Chiudi altre schede**, **Chiudi le schede a destra**, **Chiudi tutte le schede**. Le operazioni di chiusura in batch richiedono un avviso per ogni scheda modificata e si interrompono se si annulla. **Chiudi tutto** mantiene sempre una scheda vuota. |

> **Suggerimento:** La sincronizzazione della tavolozza (`#expert-palette-sync-btn`) mantiene la selezione della tavolozza sincronizzata con il tasto mnemonico sul cursore. Disabilitala quando preferisci che la tavolozza non si sposti durante la modifica.

---

## 7. Modalità di indirizzamento

Ogni istruzione del 6502 supporta una o più modalità di indirizzamento. Il selettore di modalità è presente su ciascun blocco.

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

### Etichetta le espressioni come operandi

Qualsiasi campo operando che accetta un indirizzo o un valore immediato accetta anche direttamente un **nome costante** (da un blocco `CONST` o un `LABEL`). Inoltre, è possibile utilizzare le espressioni **label+offset** o **label−offset** per fare riferimento a un indirizzo relativo a una costante denominata:

| Sintassi             | Esempio                  | Descrizione                                                                                                                   |
| -------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `etichetta`          | `STA screen_ram,X`       | Si risolve nell'etichetta/valore costante                                                                                     |
| `etichetta+$hex`     | `STA screen_ram+$0100,X` | Indirizzo dell'etichetta più un offset esadecimale                                                                            |
| `etichetta+decimale` | `STA screen_ram+256,X`   | Indirizzo dell'etichetta più un offset decimale                                                                               |
| `etichetta-$hex`     | `Tabella LDA-$10`        | Indirizzo dell'etichetta meno un offset esadecimale                                                                           |
| `#<etichetta`        | `LDA #<screen_ram`       | Byte meno significativo dell'indirizzo dell'etichetta                                                                         |
| `#&gt;etichetta`     | `LDA #&gt;screen_ram`    | Byte più significativo dell'indirizzo dell'etichetta                                                                          |
| `*`                  | `BNE *`                  | Contatore di programma corrente (indirizzo dell'istruzione stessa); i salti con `*` generano un ciclo infinito (offset `$FE`) |

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

### Il contatore di programma `*` nelle espressioni

*(Novità nella versione 2.3.9.)* `*` non è più limitato a essere l'intero operando: può apparire **ovunque all'interno di un'espressione operando** e rappresenta l'indirizzo dell'istruzione su cui è scritto. Viene risolto in fase di assemblaggio rispetto all'indirizzo reale di tale istruzione, quindi non è necessaria alcuna etichetta per brevi salti relativi o letture di dati relative al PC.

| Sintassi            | Esempio                    | Senso                                            |
| ------------------- | -------------------------- | ------------------------------------------------ |
| `*`                 | `BNE *`                    | Salto a se stesso (ciclo infinito, offset `$FE`) |
| `*-n` / `*+n`       | `BNE *-5`, `BEQ *+4`       | Salto relativo al PC corrente di *n* byte        |
| `JMP *+n`           | `JMP *+20`                 | Salto assoluto calcolato dal PC attuale          |
| `#&lt;*` / `#&gt;*` | `LDA #&lt;*`, `LDA #&gt;*` | Byte basso/alto del PC corrente                  |
| `#&gt;(*+n)`        | `LDA #&gt;(*+63)`          | Byte basso/alto di un indirizzo relativo al PC   |

**PC vs. moltiplicazione.** `*` viene trattato come contatore di programma solo quando si trova in *posizione valore* — all'inizio dell'espressione, o subito dopo un operatore, `(`, `,`, `&lt;`, `&gt;` o uno spazio bianco. Un `*` che segue un numero, `)` o un identificatore è una moltiplicazione ordinaria, quindi `tabella LDA*2` e `CONST_A*4` rimangono invariati.

**Dove funziona.** Qualsiasi operando che accetti già un'espressione: destinazioni di salto, `JMP` / `JSR`, `LDA`/`STA`/… assoluti e indicizzati, operatori immediati di byte bassi/alti e l'espressione `.assert`. `*` non modifica mai la dimensione di un'istruzione, quindi è sicuro in ogni modalità di indirizzamento.

### Etichette locali (tratteggiate)

*(Novità nella versione 2.3.9.)* Un'etichetta il cui nome inizia con un punto — `.loop`, `.skip`, `.done` — è un'etichetta **locale**. Appartiene all'ambito dell'etichetta **globale** (non puntata) più vicina precedente e internamente diventa `<globale>.<nome>`. Due etichette locali con lo stesso nome breve sotto etichette globali diverse non **entrano in conflitto.

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

- All'interno di un ambito, si fa riferimento a un'etichetta locale come `.nome`.
- Da un altro ambito, fai riferimento ad esso esplicitamente come `Global.name` (ad esempio `JMP ClearScreen.loop`).
- Un `.name` scritto prima di qualsiasi etichetta globale rimane un semplice `.name` di livello superiore.
- Le etichette locali passano invariate attraverso la modalità Blocco ⇄ Esperto; il prefisso `<globale>.` è un dettaglio in fase di layout e non viene mai memorizzato nel programma a blocchi.

### etichette degli operandi del codice automodificante

*(Novità nella versione 2.3.9.)* Anteporre `label:` all'operando di un'istruzione per posizionare un'etichetta sul **byte dell'operando** anziché sull'opcode. L'istruzione viene assemblata da ciò che segue i due punti.

```
setup:
    LDA value:#$00     ; 'value' -> address of the #$00 operand byte
    ...
patch:
    LDA #new
    STA value          ; writes the operand byte directly — classic SMC
```

`value` punta a `<indirizzo dell'istruzione> + 1` (il primo byte dell'operando), per ogni modalità di indirizzamento. Questo sostituisce il vecchio schema `STA istruzione+1` / `istruzione: LDA #$00`. Il ciclo passa attraverso la modalità Blocco ⇄ Esperto (il campo dell'operando mantiene il prefisso `etichetta:`).

---

## 8. Istruzioni standard 6502

### Movimento dei dati

| Mnemonico | Descrizione                         | Modalità                                                                    |
| --------- | ----------------------------------- | --------------------------------------------------------------------------- |
| `LDA`     | Accumulatore di carico              | immediato, zeroPage, assoluto, assolutoX, assolutoY, indirettoX, indirettoY |
| `LDX`     | Carica il registro X                | immediato, zeroPage, zeroPageY, assoluto, assolutoY                         |
| `LDY`     | Caricare il registro Y              | immediato, zeroPage, assoluto, assolutoX                                    |
| `STA`     | Accumulatore di magazzino           | zeroPage, assoluto, assolutoX, assolutoY, indirettoX, indirettoY            |
| `STX`     | Registrati al negozio X             | zeroPage, zeroPageY, assoluto                                               |
| `STY`     | Registratore di cassa del negozio Y | zeroPage, assoluto                                                          |

### Aritmetica

| Mnemonico  | Descrizione            | Note                                                                         |
| ---------- | ---------------------- | ---------------------------------------------------------------------------- |
| `ADC`      | Aggiungi con trasporto | Impostare il trasporto con `SEC` prima dell'uso nella maggior parte dei casi |
| `SBC`      | Sottrarre con riporto  | Imposta il riporto con `SEC` prima della sottrazione                         |
| `INC`      | Memoria incrementale   | —                                                                            |
| `DICEMBRE` | Decrementa la memoria  | —                                                                            |
| `CMP`      | Confronta con A        | Imposta i flag; non modifica A                                               |
| `CPX`      | Confronta con X        | —                                                                            |
| `CPY`      | Confronta con Y        | —                                                                            |

### Logica

| Mnemonico | Descrizione                                                      |
| --------- | ---------------------------------------------------------------- |
| `E`       | AND logico con accumulatore                                      |
| `ORA`     | OR logico con accumulatore                                       |
| `EOR`     | OR esclusivo con accumulatore                                    |
| `BIT`     | Verifica i bit in memoria rispetto ad A (imposta i flag N, V, Z) |

### Salti e rami

| Mnemonico | Descrizione                                                      |
| --------- | ---------------------------------------------------------------- |
| `JMP`     | Salto incondizionato (assoluto o indiretto)                      |
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
| `BVS`     | Salta se il set di overflow è impostato (V=1)                    |

#### LBNE / LBEQ / … (Rami lunghi)

*(Novità nella versione 2.3.9.)* La categoria di palette **diramazioni lunghe** contiene otto pseudo-operazioni che si comportano come diramazioni condizionali ma raggiungono **qualsiasi indirizzo**, non solo −128…+127. Ognuna di esse si assembla in una diramazione invertita che salta un `JMP` di 3 byte — sempre **5 byte**:

```
LBEQ done      ; assembles to:   BNE *+3   ($D0 $03)
               ;                 JMP done  ($4C lo hi)
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

- Operando: un'etichetta, un'espressione `*` o un indirizzo letterale, come per un normale obiettivo di salto.
- Costo: 5 byte e 1 ciclo aggiuntivo sul percorso scelto rispetto a un salto breve. Non c'è promozione automatica di un salto breve: si sceglie `LBxx` esplicitamente.
- Quando un salto semplice (`BNE`, `BEQ`, …) è fuori intervallo, l'errore del compilatore ora specifica l'esatto overshoot e suggerisce il corrispondente `LBxx`.

### Operazioni di cassa

| Mnemonico | Descrizione                                |
| --------- | ------------------------------------------ |
| `TASSA`   | Trasferimento A → X                        |
| `TAY`     | Trasferimento A → Y                        |
| `TXA`     | Trasferimento X → A                        |
| `TYA`     | Trasferimento Y → A                        |
| `TSX`     | Puntatore dello stack di trasferimento → X |
| `TXS`     | Trasferimento X → Puntatore dello stack    |
| `INX`     | Incremento X                               |
| `DEX`     | Decrementare X                             |
| `INY`     | Incremento Y                               |
| `DEY`     | Decrementare Y                             |

### Shift & Rotate

| Mnemonico | Descrizione                                |
| --------- | ------------------------------------------ |
| `ASL`     | Spostamento aritmetico a sinistra          |
| `LSR`     | Spostamento logico a destra                |
| `ROL`     | Ruotare a sinistra attraverso il trasporto |
| `ROR`     | Ruotare a destra attraverso il trasporto   |

### Pila

| Mnemonico | Descrizione                                   |
| --------- | --------------------------------------------- |
| `PHA`     | Spingere l'accumulatore sulla pila            |
| `PHP`     | Inserisci lo stato del processore nello stack |
| `PLA`     | Rimuovi l'accumulatore dalla pila             |
| `PLP`     | Recupera lo stato del processore dallo stack  |

### Sistema / Bandiere

| Mnemonico | Descrizione                                  |
| --------- | -------------------------------------------- |
| `CLC`     | Bandiera Clear Carry                         |
| `CLD`     | Cancella la modalità decimale                |
| `CLI`     | Disabilitare l'interruzione di cancellazione |
| `CLV`     | Cancella il flag di overflow                 |
| `SEC`     | Imposta la bandiera di trasporto             |
| `SED`     | Imposta la modalità decimale                 |
| `SEI`     | Imposta Interruzione disabilitata            |
| `NOP`     | Nessuna operazione                           |
| `BRK`     | Interruzione forzata / interruzione software |

### Istruzioni illegali/non documentate

Questi chip sono supportati per un utilizzo avanzato. Usare con cautela: il comportamento può variare da un chip all'altro.

`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`, `AXS`

---

## 9. Blocchi macro — Riferimento

I blocchi macro consentono di eseguire operazioni comuni in un unico passaggio: invece di scrivere manualmente 10-20 istruzioni, è sufficiente inserire un blocco e l'assembler genera il codice automaticamente. Si possono considerare come delle subroutine integrate.

---

### LABEL

Come un numero di riga ** in BASIC** — ma con un nome invece di un numero. Destinazioni di salto per `JMP`, `JSR`, `BNE`, ecc.

| Campo               | Descrizione                                            |
| ------------------- | ------------------------------------------------------ |
| Nome dell'etichetta | Identificatore utilizzato in `JMP`, `JSR`, `BNE`, ecc. |

**Sintassi esperta:**
```
loop:
```

**Assembly generato:**
```
loop:  ; $0820
```

L'indirizzo corrente viene mostrato come commento. Le etichette hanno una dimensione di **0 byte**.

---

### COMMENT

Come **REM in BASIC** — una nota per te stesso che l'assembler ignora completamente.

**Sintassi esperta:**
```
; Your comment text here
```

**Assembly generato:**
```
; Your comment text here
```

---

### BYTE

Come **DATA in BASIC** — memorizza un elenco di valori di byte grezzi in linea nel programma.

| Campo    | Descrizione                                                                   |
| -------- | ----------------------------------------------------------------------------- |
| Operando | Valori di byte separati da virgole (ad esempio `$01, $02, $FF` o `1, 2, 255`) |

**Sintassi esperta:**
```
.byte $01, $02, $FF
```

**Assembly generato:**
```
    .byte $01, $02, $FF
```

** Riferimenti all'etichetta del byte basso/alto: ** BYTE accetta token `<etichetta` (byte basso) e `>etichetta` (byte alto) in stile KickAssembler / ca65 insieme a valori numerici. L'assembler risolve l'indirizzo dell'etichetta in fase di compilazione e inserisce il byte appropriato. Esempio:

```
    .byte <frame_0, >frame_0, <frame_1, >frame_1
```

Questo memorizza il byte basso dell'indirizzo di `frame_0`, poi il byte alto, e poi lo stesso per `frame_1`. Utile per costruire tabelle di salto ed elenchi di indirizzi.

**Dimensione:** Numero di byte nell'elenco.

---

### WORD

Come **DATA in BASIC ma per numeri a 16 bit **. Ogni valore è memorizzato come due byte (prima il byte meno significativo, poi il byte più significativo - ordine little-endian 6502).

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

### FILL

Come `FOR I=1 TO N : POKE addr+I, val : NEXT` — riempie un blocco di memoria con lo stesso byte, ma in un unico blocco. Ottimo per liberare aree o pre-riempire tabelle.

| Campo    | Descrizione                                                  |
| -------- | ------------------------------------------------------------ |
| Operando | `count,value` — ad esempio `256,0` riempie 256 byte con zero |

**Sintassi esperta:**
```
.fill 256, $00
```

**Assembly generato:**
```
    .fill 256, $00
```

Sintassi dell'espressione: **Sia **count` che `value` accettano espressioni aritmetiche. È possibile fare riferimento a nomi CONST, utilizzare letterali esadecimali/binari e chiamare funzioni matematiche integrate:

| Espressione                       | Senso                                                   |
| --------------------------------- | ------------------------------------------------------- |
| `NUMERO_TESSERE, $00`             | conteggio da una COSTANTE, valore letterale esadecimale |
| `40*25, 0`                        | moltiplicazione in linea                                |
| `arrotondato(sin(PI/4)*255), $80` | trigonometria                                           |

**Funzioni integrate:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`, `abs()`, costante `PI`

Operatori: `+ - * /` Letterali: `$FF` (esadecimale), `%10110000` (binario) Byte basso/alto: `lo(expr)`, `hi(expr)`

**Dimensione:** Il valore del conteggio in byte.

---

### ALIGN

Sposta l'indirizzo corrente in avanti fino al successivo limite pulito inserendo byte di riempimento con zeri. Il C64 richiede che i dati degli sprite inizino su un limite di 64 byte: `ALIGN 64` lo gestisce automaticamente.

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
    ; ALIGN 64 → $0840 (12 bytes padding)
```

**Dimensione:** Dinamica — dipende dalla posizione corrente del contatore di programma.

> **Suggerimento:** Utilizzare `ALIGN 64` prima dei dati degli sprite, `ALIGN 256` per garantire tabelle allineate alla pagina.

---

### TEXT

Come **PRINT AT** — scrive il testo direttamente sullo schermo del C64 in una data colonna e riga, senza usare il KERNAL. Genera una coppia LDA/STA per carattere, indirizzando la RAM dello schermo a `$0400`.

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

- **Set di caratteri maiuscoli (predefinito, casella di controllo deselezionata):** Digita ciò che vuoi vedere in maiuscolo. `"CIAO"` viene visualizzato come `CIAO`. L'input minuscolo viene mappato ai codici schermo maiuscoli.
- **Set di caratteri minuscoli (casella di controllo selezionata):** Digitare esattamente il formato che si desidera visualizzare. `"hello"` → visualizzazione in minuscolo, `"HELLO"` → visualizzazione in maiuscolo. Richiede un cambio di set di caratteri in fase di esecuzione prima che venga visualizzata la schermata (utilizzare la macro **CHARSET lower**.

**ASM generato (modalità maiuscola, `"CIAO"`):**
```
    LDA #$08      ; 'H' screen code $08
    STA $0400
    LDA #$05      ; 'E' screen code $05
    STA $0401
    ...
```

**Sintassi esperta:**
```
.text 0, 2, "HELLO"           ; uppercase charset (default)
.text 0, 2, "hello", lower    ; lowercase charset
```

I caratteri sono codificati come **codici schermo** (non PETSCII). **Dimensione:** `lunghezza testo × 5` byte (LDA + STA per carattere).

---

### STRING

Come **inserire una stringa ** in qualsiasi indirizzo di memoria durante l'esecuzione. Genera coppie LDA/STA che copiano il codice schermo di ciascun carattere in indirizzi consecutivi.

| Campo                   | Descrizione                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| Testo                   | La stringa da scrivere                                                                                     |
| Indirizzo               | Indirizzo di memoria di destinazione — `$C000` esadecimale o un **nome dell'etichetta**                    |
| Etichetta (facoltativa) | Assegna un'etichetta che punta all'indirizzo di destinazione                                               |
| Spostare                | Valore esadecimale (00–FF) aggiunto a ciascun byte del codice schermo (ad esempio `$80` = video invertito) |
| caratteri minuscoli     | Casella di controllo — stessa semantica di TESTO (vedi sezione TESTO)                                      |

**Sintassi esperta:**
```
.string $C000, "HELLO"                  ; uppercase charset (default)
.string $C000, "hello", lower           ; lowercase charset
.string $C000, "HELLO", 80             ; with shift (reverse video)
.string $C000, "hello", 80, lower      ; shift + lowercase
.string $C000, "HELLO" :my_string      ; with macroLabel
```

**Assembly generato:**
```
    LDA #$08      ; 'H' screen code
    STA $C000
    LDA #$05      ; 'E' screen code
    STA $C001
    ...
```

I caratteri sono codificati come **codici schermo** (non PETSCII). Il valore opzionale **Shift** viene aggiunto a ogni byte, ad esempio `$80` per il video inverso. **Dimensione:** `lunghezza testo × 5` byte (un LDA + un STA per carattere).

---

### DATA

Come un ciclo **POKE** — scrive un elenco di byte grezzi in un indirizzo di memoria in fase di esecuzione, una coppia LDA/STA per byte.

| Campo                   | Descrizione                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| Byte                    | Valori di byte separati da virgole                                                      |
| Indirizzo               | Indirizzo di memoria di destinazione — `$C000` esadecimale o un **nome dell'etichetta** |
| Etichetta (facoltativa) | Assegna un'etichetta che punta all'indirizzo di destinazione                            |

**Sintassi esperta:**
```
.data $C000, $01, $02, $03          ; hex address
.data my_buf, $01, $02, $03         ; label address
.data $C000, $01, $02, $03 :mydata  ; with macroLabel
```

**Assembly generato:**
```
    LDA #$01
    STA $C000
    LDA #$02
    STA $C001
    ...
```

**Dimensione:** `numero di byte × 5` byte (un LDA + un STA per byte).

---

### RAWBYTES

Come **DATI che vengono caricati direttamente in memoria** — nessun codice in fase di esecuzione. I byte sono presenti dal momento in cui il PRG viene caricato, prima ancora che il tuo codice inizi. Usalo per i dati degli sprite, le mappe dei livelli, le tabelle di ricerca, qualsiasi cosa che debba semplicemente trovarsi a un indirizzo specifico.

| Campo                   | Descrizione                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| Byte                    | Valori di byte separati da virgole                                                      |
| Indirizzo               | Indirizzo di memoria di destinazione — `$C000` esadecimale o un **nome dell'etichetta** |
| Etichetta (facoltativa) | Assegna un'etichetta che punta all'indirizzo di destinazione                            |

**Sintassi esperta:**
```
.rawbytes $C000, $00, $00, $00      ; hex address
.rawbytes sprite_data, $00, $00     ; label address
.rawbytes $0C50, $00, $00 :nev      ; with macroLabel — other code can use LDA nev,X
```

**Dimensione in codice:** 0 byte. I dati vengono posizionati all'indirizzo specificato nell'output.

> **DATA vs RAWBYTES:** DATA genera codice LDA/STA che copia i byte in fase di esecuzione (più lento, ma funziona se i dati devono essere dinamici). RAWBYTES inserisce semplicemente i byte direttamente: nessun codice, istantaneo, costo zero.

---

### RAWTEXT

Come RAWBYTES ma per il testo: codifica la stringa come codici schermo e posiziona i byte a un indirizzo fisso senza **codice runtime**. Il testo è pronto in memoria nell'istante in cui il PRG viene caricato.

| Campo                   | Descrizione                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| Testo                   | Stringa da codificare                                                                                      |
| Indirizzo               | Indirizzo di memoria di destinazione — `$C000` esadecimale o un **nome dell'etichetta**                    |
| Etichetta (facoltativa) | Assegna un'etichetta che punta all'indirizzo di destinazione                                               |
| Spostare                | Valore esadecimale (00–FF) aggiunto a ciascun byte del codice schermo (ad esempio `$80` = video invertito) |
| caratteri minuscoli     | Casella di controllo — stessa semantica di TESTO (vedi sezione TESTO)                                      |

**Sintassi esperta:**
```
.rawtext $C000, "HELLO"                 ; uppercase charset (default)
.rawtext $C000, "hello", lower          ; lowercase charset
.rawtext $C000, "HELLO", 80            ; with shift (reverse video)
.rawtext $C000, "hello", 80, lower     ; shift + lowercase
.rawtext $0400, "HELLO" :my_text       ; with macroLabel
```

**Assembly generato:**
```
; .rawtext "HELLO" -> $C000
; $C000
    .byte $08, $05, $0C, $0C, $0F   ; H E L L O (uppercase screen codes)

; .rawtext "hello", lower -> $C000
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; h e l l o (lowercase screen codes $41–$5A range)
```

**Dimensione in codice:** 0 byte. I dati vengono posizionati all'indirizzo specificato nell'output.

> **STRING vs RAWTEXT:** STRING genera codice LDA/STA che copia il testo in fase di esecuzione. RAWTEXT inserisce i byte nel PRG al momento del caricamento: nessun codice, nessuna attesa.

---

### PETSCII

Come **RAWBYTES ma per l'output KERNAL** — codifica la stringa come byte PETSCII (compatibile con CHROUT a `$FFD2`) e li posiziona a un indirizzo fisso senza codice runtime. Usalo quando vuoi stampare caratteri tramite `JSR $FFD2` in un ciclo e nota che la nuova macro `PRINT` utilizza lo stesso codificatore e lo stesso comportamento della casella di controllo minuscolo.

> **Codici PETSCII vs codici schermo:** PETSCII e codici schermo sono due codifiche diverse. Codice schermo `$01` = lettera A; PETSCII `$41` = lettera A (tramite CHROUT). Utilizzare PETSCII solo quando si stampa tramite il KERNAL; utilizzare TEXT/STRING/RAWTEXT per scrivere direttamente nella RAM dello schermo.

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
.petscii $C000, "HELLO"              ; uppercase PETSCII (default)
.petscii $C000, "hello", lower       ; lowercase PETSCII ($61–$7A)
.petscii $C000, "HELLO", null        ; with null terminator
.petscii $C000, "hello", lower, null ; lowercase + null terminator
.petscii $C000, "HELLO" :my_msg      ; with macroLabel
```

**Byte generati (maiuscolo, `"CIAO"`):**
```
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; H E L L O (PETSCII $41–$5A range)
```

**Dimensione in codice:** 0 byte. I dati vengono posizionati all'indirizzo di destinazione come sezione dati differita (come RAWBYTES).

** Terminatore nullo:** Seleziona la casella di controllo *"Aggiungi `$00` (terminatore nullo)"* per aggiungere automaticamente un byte `$00` dopo il testo. Ideale per cicli terminati da null:

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

**Regole di codifica:**

| Ingresso                              | Modalità maiuscolo              | Modalità minuscolo |
| ------------------------------------- | ------------------------------- | ------------------ |
| `A`–`Z`                               | `$41`–`$5A`                     | `$61`–`$7A`        |
| `a`–`z`                               | `$41`–`$5A` (maiuscolo forzato) | `$41`–`$5A`        |
| Spazio, cifre, punteggiatura (32–126) | così com'è                      | così com'è         |
| Nuova linea                           | `$0D` (INVIO)                   | `$0D`              |
| Altro                                 | `$20` (spazio)                  | `$20`              |

> **Suggerimento:** Utilizzare PETSCII per i dati che verranno visualizzati tramite CHROUT (`$FFD2`). Per scrivere direttamente nella RAM dello schermo, utilizzare invece STRING o RAWTEXT.

---

### CHARSET

Commuta la ROM dei caratteri del VIC-II tra la modalità maiuscolo/grafica (impostazione predefinita del C64) e la modalità minuscolo/maiuscolo, modificando il bit 1 di `$D018` in fase di esecuzione.

| Campo    | Descrizione                                                                                                                                   |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Modalità | **Minuscolo** — abilita il set di caratteri minuscolo/maiuscolo; **Maiuscolo** — ripristina il set di caratteri predefinito maiuscolo/grafico |

**Sintassi esperta:**
```
.charset lower    ; switch to lowercase charset
.charset upper    ; switch back to uppercase/graphics charset
```

**Assembly generato:**

Modalità minuscolo:
```
    LDA $D018
    ORA #$02      ; set bit 1 → lowercase/uppercase ROM at $1800
    STA $D018
```

Modalità maiuscole:
```
    LDA $D018
    AND #$FD      ; clear bit 1 → uppercase/graphics ROM at $1000
    STA $D018
```

**Dimensione:** 8 byte (LDA abs + ORA/AND imm + STA abs).

**Perché ORA/AND invece di una scrittura diretta?** `$D018` controlla anche la posizione della RAM dello schermo (bit 7–4). L'inversione del solo bit 1 preserva il resto del registro.

**Flusso di lavoro tipico:**

```
    CHARSET lower             ; switch to lowercase charset
    TEXT 0, 0, "hello world"  ; [checkbox: Lowercase charset]
    ...
    CHARSET upper             ; restore default when done
```

Oppure in modalità esperto:
```
.charset lower
.text 0, 0, "hello world", lower
.charset upper
```

In modalità Esperto, il blocco `.charset` ora passa anche attraverso il menu a tendina della modalità, in modo che l'anteprima del blocco e il codice sorgente esportato rimangano allineati.

> **Nota:** La macro CHARSET modifica solo il puntatore alla ROM dei caratteri VIC. Non chiama `$E544` (inizializzazione del charset del KERNAL). Nella maggior parte dei casi questo è sufficiente; chiama `JSR $E544` prima solo se hai bisogno che le routine di stampa del KERNAL rispettino la modifica.

---

### CHARDEF

Definisce un singolo carattere personalizzato 8×8 in un set di caratteri basato su RAM. Emette codice runtime inline che copia 8 byte in `base + indice * 8` in fase di esecuzione, senza bisogno di un'etichetta precedente o di `ORG`.

| Campo                | Descrizione                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Charset base         | Indirizzo base del set di caratteri RAM (predefinito `$3800`). Deve essere allineato in modo che il VIC-II possa vederlo (vedi sotto). |
| Indice dei caratteri | Quale slot di caratteri ridefinire, 0–255. `65` = 'A' nel layout predefinito del codice schermo.                                       |
| 8 byte               | Righe di bitmap separate da virgole, dall'alto verso il basso. Il bit 7 di ciascun byte corrisponde al pixel più a sinistra.           |

**Sintassi esperta:**
```
.chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00
```

**ASM generato (8 × `LDA #b` / `STA target+n`, 40 byte totali):**
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

**Indirizzo di destinazione:** `$3800 + 65 * 8 = $3A08`. Calcolato in fase di compilazione e codificato direttamente negli operandi STA.

**Dimensione:** 40 byte per carattere (8 × 5).

**Flusso di lavoro tipico:**
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

**Quando utilizzare CHARDEF rispetto alle alternative:**

| Approccio                        | Utilizzare quando                                                                                                                |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **CHARDEF**                      | Sono necessari alcuni caratteri personalizzati (ad esempio da 1 a 20). Ciascuno ha un costo di 40 byte in fase di esecuzione.    |
| **RAWBYTES @ $3800**             | Hai a disposizione un set di caratteri personalizzato completo (256 caratteri). Totale di 2 KB di dati, nessuna copia a runtime. |
| **INCBIN "charset.bin" a $3800** | File di set di caratteri esterno (creato dall'Editor di caratteri). L'opzione più pulita.                                        |
| **Tela Charset + INCBIN**        | Bitmap completa di 256 caratteri visualizzata come un'unica immagine 128×128.                                                    |

> **Promemoria di allineamento:** VIC-II prevede che la base del charset sia un multiplo di `$0800`. Banchi validi: `$0000`, `$0800`, `$1000`, ... , `$3800` (all'interno dell'attuale banco VIC da 16 KB). I charset RAM risiedono tipicamente a `$2000`, `$2800`, `$3000` o `$3800`.

---

### BOX_HIT

Test di collisione Axis-aligned bounding box (AABB) tra due rettangoli descritti da strutture a pagina zero di 4 byte. Restituisce il risultato nell'accumulatore: **A = 1** in caso di sovrapposizione, **A = 0** altrimenti. Assemblaggio inline puro, nessuna chiamata a subroutine.

| Campo                           | Descrizione                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------ |
| Casella postale 1, indirizzo ZP | Base della pagina zero della struttura a 4 byte della prima casella (predefinita `$FB`).   |
| Casella postale 2, indirizzo ZP | Base della pagina zero della struttura a 4 byte della seconda casella (predefinita `$F7`). |

** Layout della struttura** (4 byte per riquadro, coordinate a 8 bit senza segno):

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

**ASM generato (30 byte, completamente relativo al PC - nessuna subroutine, nessun salto assoluto):**
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

**Dimensione:** 30 byte.

**Flusso di lavoro tipico:**

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

**Vincoli:**
- Entrambi gli indirizzi di pagina zero devono essere `≤ $FC` (ogni box necessita di 4 byte consecutivi: `zp`, `zp+1`, `zp+2`, `zp+3`).
- Le coordinate vengono trattate come **8 bit senza segno ** (0–255). Per le coordinate sprite con segno al di fuori di questo intervallo, normalizzare prima di memorizzare.
- I due riquadri possono sovrapporsi nello spazio ZP, se lo si desidera, ma in genere si preferiscono 8 byte distinti.

**Perché non una subroutine?** La generazione inline evita l'overhead JSR/RTS (14+ cicli) e mantiene il test attivo nella cache per cicli di gioco stretti. Se devi testare molte coppie, inserisci manualmente la tua `sub box_hit_jSR` attorno a un singolo blocco BOX_HIT.

**Confronto con la funzione `box_hit()` di UB:** Ultimate Basic incapsula la stessa logica del 6502 come una funzione runtime che restituisce una variabile. In VA, si posiziona BOX_HIT in linea dove è necessario il test; il risultato è in `A`.

---

### INCBIN

Come **BLOAD in BASIC** — preleva un file binario esterno (`.bin`, `.prg`, `.sid`, `.raw`) e lo incorpora direttamente nel PRG assemblato all'indirizzo specificato.

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
    ; INCBIN "music.bin" @ $C000 (2048 bytes)
    .byte $01, $02, ...
```

**Dimensione nel codice:** 0 byte (sezione dati differiti). Il binario è incorporato all'indirizzo specificato.

---

### SID

Come **BLOAD per la musica** — carica un file `.sid` nel tuo PRG e legge automaticamente i suoi indirizzi Init e Play dall'intestazione. Chiama Init una volta all'avvio, quindi chiama Play dal tuo gestore IRQ a ogni frame.

| Campo                                  | Descrizione                                                                                                                                    |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| File                                   | Sfoglia per selezionare un file `.sid`                                                                                                         |
| Indirizzo personalizzato (facoltativo) | Sovrascrivi l'indirizzo di caricamento nativo del SID (ad esempio `$1000`). Lascia vuoto per utilizzare l'indirizzo dall'intestazione del SID. |

Il blocco mostra:
- **Titolo / Autore** dall'intestazione SID
- **Indirizzo di caricamento** — dove i dati vengono posizionati in memoria (indirizzo effettivo dopo qualsiasi sovrascrittura)
- **Indirizzo di inizializzazione** — chiama questo con JSR per inizializzare la musica (adattato per la rilocazione se viene utilizzato un indirizzo personalizzato)
- **Riproduci indirizzo** — chiama questo con JSR su ogni frame in un gestore IRQ (adattato per la rilocazione)
- Un badge **(ricollocato)** appare quando un indirizzo personalizzato sposta i dati dalla sua posizione originale

**Sintassi esperta:**
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", $1000
```

**Commento ASM generato:**
```
    ; SID "Ikari_Warriors.sid" @ $1000  Init:$1000  Play:$1006  (4096 bytes)
```

**Dimensione nel codice:** 0 byte in linea. Il binario SID viene posizionato all'indirizzo specificato come blocco differito nel PRG.

> **Importante:** La maggior parte dei file SID contiene indirizzi assoluti interni hardcoded. Possono essere riposizionati solo se l'intero binario viene spostato dello stesso offset. Se un SID ha salti interni a `$10xx`, deve rimanere a `$1000`: spostarlo a un indirizzo diverso interromperà tali riferimenti interni.

> **Utilizzo tipico:** Posizionare un blocco ORG prima del blocco SID per impostarne l'indirizzo. Chiamare Init una volta all'avvio, quindi chiamare Play ad ogni frame da un gestore IRQ raster.

---

### INCLUDE

Come **MERGE in BASIC** — importa un altro file ed espande i suoi blocchi in linea in questa posizione. Perfetto per librerie di subroutine riutilizzabili. I blocchi inclusi sono di sola lettura nel progetto corrente.

Sono supportati due tipi di file:
- **Progetto Visual Assembler** (`.json`) — i blocchi del progetto vengono inseriti così come sono.
- **Codice sorgente assembly semplice** (`.inc`, `.asm`, `.s`) — il file viene letto come testo e analizzato nello stesso modo della modalità esperto. Ogni volta che compili, il file viene riletto dal disco (fonte di verità = il file), quindi puoi modificarlo esternamente con qualsiasi editor.

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

- L'estensione del file ** è richiesta in modalità esperto**: un nome semplice come `.include "macros"` viene trattato come `.include "macros.json"`.
- Risoluzione del percorso: prima tenta di cercare vicino al file di progetto (relativo), poi ripiega sulla directory `samples/` inclusa nell'app.

**ASM generato (nessuna sovrascrittura dell'indirizzo):**
```
    ; .include "library.json" — 12 block(s)
    ... (expanded blocks follow)
```

**ASM generato (con indirizzo di caricamento `C000`):**
```
    ; .include "library.json" @ $C000 — 12 block(s)
    *=$C000
    ... (expanded blocks follow)
```

> **Suggerimento:** Utilizzare INCLUDE per creare librerie di subroutine riutilizzabili che è possibile condividere tra progetti. I file `.inc`/`.asm`/`.s` sono ideali quando si desidera modificare la libreria in un editor di testo semplice o condividerla con altri assembler 6502; `.json` quando la libreria è stata creata direttamente in Visual Assembler. Impostare un indirizzo di caricamento quando la libreria non ha un proprio ORG o quando si desidera sovrascrivere il suo posizionamento predefinito.

---

### TABLE

Come **DIM a un indirizzo specifico** — specifica il nome di una tabella di ricerca e la sua posizione in memoria. Posiziona blocchi BYTE, WORD o FILL dopo di esso per definire il contenuto della tabella.

| Campo     | Descrizione                                                             |
| --------- | ----------------------------------------------------------------------- |
| Nome      | Identificatore dell'etichetta per la tabella (ad esempio `color_table`) |
| Indirizzo | Indirizzo fisso in cui inizia la tabella (ad esempio `$C000`)           |

**Sintassi esperta:**
```
.table color_table, $C000
```

**Assembly generato:**
```
color_table:
```

Il contatore di programma salta all'indirizzo specificato. Posizionare i blocchi BYTE/WORD/FILL dopo TABLE per riempirli.

**Dimensione:** 0 byte.

---

### ORG

Imposta la posizione in memoria in cui viene inserito il programma (o una sua sezione), come scegliere un indirizzo di inizio prima di digitare il codice macchina. Ogni programma necessita di almeno un ORG. L'indirizzo di inizio standard caricabile in BASIC per C64 è `$0801`.

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

Ogni blocco ORG dà inizio a una nuova sezione. I blocchi successivi vengono assemblati a partire da quell'indirizzo. Quando si esporta il file PRG, tutte le sezioni vengono unite in un unico file e gli spazi tra le sezioni vengono riempiti con zeri.

**Esempio — codice in `$0801`, tabella dati in `$C000`:**
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

> **Suggerimento:** Ogni programma deve iniziare con un blocco ORG. L'indirizzo di inizio tipico per un programma caricabile in BASIC per C64 è `$0801` (2049 decimale). Quando **BASIC SYS stub** è abilitato, l'assembler aggiunge una breve riga BASIC a `$0801` e il codice inizia a `$080D`.

---

### LOOP / NEXT

Come **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** in BASIC — conta alla rovescia da N a 1 usando il registro X o Y. Inserisci un blocco LOOP, inserisci le tue istruzioni tra esso e NEXT e il ciclo verrà eseguito automaticamente per il numero corretto di volte.

#### LOOP

| Campo     | Descrizione                                                                   |
| --------- | ----------------------------------------------------------------------------- |
| Registro  | `X` o `Y` — il registro del contatore                                         |
| Contare   | Numero di iterazioni del ciclo (esadecimale o decimale, ad esempio `0A` = 10) |
| Etichetta | Etichetta del ciclo generata automaticamente (ad esempio `loop0`)             |

**Sintassi esperta:**
```
.loop X, 10, loop0
```

**Assembly generato:**
```
    LDX #$0A
loop0:
```

**Dimensione:** 2 byte (codice operativo LD_ + operando immediato).

#### NEXT

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
    LDA #$20        ; space character
    STA $0400,X
    DEX
    BNE loop0
```

---

### FOR / ENDF

Come **`FOR X=0 TO N-1 : ... : NEXT X`** in BASIC — conta *up* da 0. Ideale quando è necessario un indice in avanti, ad esempio per scorrere una stringa o un array.

#### FOR

| Campo     | Descrizione                                                                              |
| --------- | ---------------------------------------------------------------------------------------- |
| Registro  | `X` o `Y` — il registro del contatore                                                    |
| Contare   | Limite del ciclo (esadecimale o decimale, ad esempio `$12` = 18). X/Y va da 0 a limit-1. |
| Etichetta | Etichetta del ciclo generata automaticamente (ad esempio `for0`)                         |

**Sintassi esperta:**
```
.for X, $12, for0
```

**Assembly generato:**
```
    LDX #$00
for0:
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
.endf for0
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
    LDA msg,X       ; msg = PETSCII string at fixed address
    BEQ done        ; null terminator → exit
    JSR $FFD2       ; CHROUT
    INX
    CPX #$12        ; 18 characters max
    BNE for0
done:
    RTS
```

> **LOOP vs FOR:** LOOP conta all'indietro (N→1) — utile per ritardi, riempimenti, cicli di pixel. FOR conta in avanti (0→N) — utile per l'accesso a stringhe/array. Entrambi possono usare X o Y.

---

### PUSH / PULL

Come **salvare le variabili prima di un GOSUB e ripristinarle dopo** — ma usa lo stack hardware del 6502. Se una subroutine usa A, X o Y, racchiuderla in PUSH e PULL in modo che i registri del codice chiamante vengano preservati.

#### PUSH

Inserisce uno o più registri nello stack. L'ordine è sempre A → X → Y (dal più interno al più esterno).

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

#### PULL

Ripristina i registri dallo stack in ordine inverso** (Y → X → A).

| Campo    | Descrizione                                                 |
| -------- | ----------------------------------------------------------- |
| Registri | Come PUSH: deve corrispondere al blocco PUSH corrispondente |

**Sintassi esperta:**
```
.pull AXY
```

**ASM generato (esempio: `AX`):**
```
    PLA
    TAX
    PLA
```

> **Regola:** PUSH e PULL devono sempre utilizzare lo stesso set di registri**. `PUSH AX` → `PULL AX` (ripristina internamente in ordine inverso: prima X, poi A).

---

### FINE / Alias RTS

Come **RTS con un nome macro più amichevole** — `.end` emette un singolo byte `RTS` e si comporta come un terminatore di subroutine breve in modalità esperto.

**Sintassi esperta:**
```
.end
```

**Assembly generato:**
```
    RTS
```

**Dimensione:** 1 byte.

Utilizzate questa opzione quando desiderate un marcatore di fine subroutine che assomigli più a una macro che a una semplice istruzione.

---

### MACRO / ENDM / INVOKE

Come **un GOSUB denominato con parametri** — definisci un blocco di codice riutilizzabile una volta (MACRO…ENDM), quindi richiamalo ovunque con INVOKE. Passa valori di argomento diversi ogni volta invece di copiare e incollare blocchi.

#### MACRO (inizio definizione)

| Campo     | Descrizione                                                                                 |
| --------- | ------------------------------------------------------------------------------------------- |
| Nome      | Identificatore per la macro (ad esempio `setColor`)                                         |
| Parametri | Nomi di parametri opzionali separati da virgole (ad esempio `colore` o `colore, conteggio`) |

Segna l'inizio di una definizione di macro. I blocchi tra MACRO e ENDM costituiscono il corpo della macro: non generano alcun codice dove si trova la definizione. Utilizzare {paramName} come segnaposto per gli argomenti.

**Assembly generato:**
```
; .MACRO setColor (color)
    ... (body blocks)
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

#### INVOKE

Richiama una macro definita in questa posizione e sostituisce i valori degli argomenti forniti ai segnaposto `{paramName}` nel corpo.

| Campo          | Descrizione                                                                                                           |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| Nome Macro     | Seleziona dal menu a tendina le macro definite                                                                        |
| Argomentazioni | Valori degli argomenti separati da virgole che corrispondono all'elenco dei parametri della macro (ad esempio `#$07`) |

**Assembly generato:**
```
; .invoke setColor(#$07)
    LDA #$07
    STA $D020
```

**Sintassi della modalità esperto:**
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

Il corpo della macro viene espanso in linea con `{paramName}` sostituito dagli argomenti effettivi. È accettata anche la forma separata da spazi (`.invoke setColor #$07`).

**Tipi di argomenti:**
- **Numerico**: `#$07`, `$10`, `255` — valori esadecimali o decimali
- **Stringhe di testo**: `"Ciao, mondo!"` — stringhe tra virgolette; le virgole all'interno delle virgolette sono trattate come parte del testo, non come separatori di argomenti
- **Misto**: `#$07, "ciao", $20` — qualsiasi combinazione

> **Suggerimento:** Definisci le macro all'inizio (o alla fine) del tuo programma, quindi INVOCALE ovunque sia necessario. Le macro possono essere invocate più volte con argomenti diversi.

---

### REGION / ENDREGION

Raggruppamento puramente visivo: **zero byte**, nessun effetto sul codice assemblato. Come comprimere una sezione di un programma BASIC in un blocco denominato in modo da poterlo comprimere e concentrarsi su qualcos'altro.

| Campo              | Descrizione                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------- |
| Nome della regione | Etichetta di testo libero per la sezione (ad esempio `init`, `game_loop`, `sprite_setup`) |

**Sintassi esperta:**
```
.region init
    ; blocks...
.endregion
```

**Controlli sull'intestazione del blocco REGION (sempre visibili):**
- **▸ / ▾ toggle** — comprime o espande l'intera regione. Quando è compressa, tutti i blocchi tra REGION e ENDREGION sono nascosti.
- **↕ Espandi tutto** — ripristina la forma originale di ogni singolo blocco compresso all'interno della regione ed espande la regione stessa, se necessario.
- **⦵ Seleziona in ASM** — evidenzia l'intero intervallo di codici della regione nella vista ASM (da `; ===[nome]===` a `; ===[/nome]===`) e scorre fino ad esso. Passa automaticamente alla scheda ASM se non è attualmente visibile.
- **⧉ Copia regione** — copia il blocco REGION, tutti i blocchi figli e il corrispondente ENDREGION negli appunti. Un lampeggio di ✓ conferma la copia.
- **⎘ Incolla regione** — inserisce la regione copiata come nuova regione immediatamente dopo l'ENDREGION della regione corrente e scorre fino ad essa. Il pulsante è attenuato finché non è stata copiata una regione.

**Assembly generato:**
```
; region init
    SEI
    LDA #$00
    STA $D020
; endregion init
```

**Dimensione:** 0 byte sia per REGION che per ENDREGION.

**Esempio di flusso di lavoro:**
1. Aggiungi un blocco `REGION`, imposta il nome della regione su `init`.
2. Aggiungi le istruzioni di inizializzazione qui sotto.
3. Aggiungi un blocco `ENDREGION` per chiudere la sezione.
4. Fai clic su ▸ sulla REGIONE per comprimere l'intera sezione in un'unica riga mentre lavori su altre parti del programma.

> **Nota:** Le regioni possono essere **annidate** l'una dentro l'altra. Ogni ENDREGION chiude la REGION aperta più vicina. Nessun effetto sull'output assemblato.

---

### DEFINE / IF / ELSE / ENDIF

Come un interruttore, l'assembler legge ** — `DEFINE DEBUG` attiva un simbolo, quindi qualsiasi blocco `IF DEBUG` viene incluso e il suo ramo `ELSE` viene saltato. Rimuovi il blocco DEFINE e il blocco IF scompare dall'output. Non è necessario eliminare il codice per le build di rilascio.

#### DEFINE

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

Un blocco `DEFINE` può attivare più simboli contemporaneamente (separati da virgole). Posiziona i blocchi DEFINE all'inizio del programma. La rimozione del blocco disattiva istantaneamente tutti i suoi simboli.

#### IF

| Campo      | Descrizione                                                                            |
| ---------- | -------------------------------------------------------------------------------------- |
| Condizione | Identificatore da testare (deve corrispondere a un simbolo `DEFINE` per essere attivo) |

**Sintassi esperta:**
```
.if DEBUG
```

**Assembly generato:**
```
; .IF DEBUG
```

I blocchi compresi tra `IF` e `ENDIF` (o `ELSE`) vengono inclusi o saltati a seconda che il simbolo di condizione abbia una `DEFINE` corrispondente nel programma. I blocchi saltati appaiono come commenti `; [IF saltato] …` e generano **zero byte**.

#### ELSE

Nessun campo. Contrassegna il ramo alternativo — assemblato quando la condizione `IF` non è *attiva.

**Sintassi esperta:**
```
.else
```

**Assembly generato:**
```
; .ELSE
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

**Dimensione:** 0 byte per tutti e quattro i blocchi. Solo il contenuto *tra* essi conta.

**Esempio: il bordo di debug lampeggia, la build di rilascio lo salta:**
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

**Esempio: simboli multipli in un unico blocco DEFINE:**
```
; .DEFINE DEBUG, PAL

; .IF PAL
    LDA #$xx        ; PAL timing constant
; .ELSE
    LDA #$xx        ; NTSC timing constant
; .ENDIF
```

Sono supportati i blocchi nidificati `IF`. Se un blocco esterno viene saltato, anche i blocchi interni vengono saltati.

> **Nota:** Questa è la gestione delle condizioni in fase di compilazione. Per la gestione delle diramazioni/confronti in fase di esecuzione, vedere **IF / ELSE / ENDIF in fase di esecuzione** di seguito.

### .ASSERT

*(Novità nella versione 2.3.9.)* Un **controllo di integrità in fase di compilazione**. `.assert` valuta un'espressione durante l'assemblaggio; se è falsa (`0`), la compilazione si interrompe con un errore chiaro che include il valore effettivo. Se è vera (diversa da zero), non emette nulla.

| Campo       | Descrizione                                                                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Espressione | Qualsiasi espressione assembler: etichette, `CONST`, `*` (contatore di programma), aritmetica e confronti (`&lt;`, `&lt;=`, `&gt;`, `&gt;=`, `==`, `!=`) |
| Messaggio   | Testo facoltativo aggiunto all'errore di errore                                                                                                          |

**Sintassi esperta:**
```
.assert spriteData < $C000
.assert * < $A000
.assert end - start <= 256, "sprite table overflowed one page"
```

**Comportamento:**

- **Dimensione:** 0 byte.
- Un'asserzione errata interrompe l'assemblaggio: `` `.assert end - start &lt;= 256` è falso (valore: 0). La tabella degli sprite ha superato una pagina ``
- Anche un'asserzione che non può essere valutata (etichetta non definita, ecc.) fallisce, con *"non può essere valutata in fase di assemblaggio"*.
- I confronti restituiscono `1` / `0`; posiziona `.assert` ovunque nel flusso del programma: viene controllato all'indirizzo in cui si trova, quindi `.assert * &lt; $D000` verifica la posizione di output corrente.

**Esempio: proteggere un blocco sprite dall'attraversamento di una pagina:**
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

Come **una variabile denominata che non cambia mai** — `SCREEN = $0400`. Usa il nome invece di digitare indirizzi grezzi ovunque, rendendo il codice più facile da leggere e modificare in seguito.

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

Il nome della costante appare nel menu a tendina **selettore di etichette** sui blocchi di istruzioni: basta cliccarci sopra per inserirlo.

**Espressioni relative al PC (`*+N` / `*-N`):**

Il campo valore accetta anche `*+N` o `*-N`, dove `*` è l'indirizzo di compilazione del blocco CONST stesso. Questo viene utilizzato per creare un alias denominato per un byte all'interno di un'istruzione vicina: il classico schema di codice automodificante.

```
CONST op = *+1      ; op → address of the immediate operand of the next LDA
LDA #$00            ; $00 will be patched at runtime
...
STA op              ; overwrites the #$00 byte → LDA reads the new value next time
```

La costante emette 0 byte; l'etichetta si risolve in fase di compilazione in `indirizzo_corrente + 1`.

**Espressioni aritmetiche:**

Il campo valore accetta operazioni aritmetiche generiche, inclusi riferimenti a nomi CONST definiti in precedenza, valori letterali esadecimali/binari e funzioni matematiche integrate:

```
.const SCREEN      = $0400
.const SCREEN_END  = SCREEN + 40*25   ; 1000 bytes later
.const COLOR_RAM   = $D800
.const MID_X       = 160
.const SIN_TABLE   = round(sin(PI/8) * 127)   ; pre-computed sine value
```

**Funzioni integrate:** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`, `abs()`, costante `PI`

Operatori: `+ - * /` Letterali: `$FF` (esadecimale), `%10110000` (binario) Byte basso/alto: `lo(expr)`, `hi(expr)`

**Dimensione:** 0 byte.

---

### VAR

Come **CONST, ma allocato automaticamente ** — `VAR` riserva spazio di memoria a pagina zero per un'etichetta senza che tu debba digitare l'indirizzo. Usalo per contatori, puntatori e stati di breve durata che appartengono a ZP.

| Campo                | Descrizione                                                |
| -------------------- | ---------------------------------------------------------- |
| Nome                 | Nome/etichetta della variabile                             |
| Taglia (facoltativa) | Numero di byte da riservare. Omettere per un singolo byte. |

**Sintassi esperta:**
```
.var counter
.var timer, 2
.var lives
```

**Esempio pratico:**
```
.region Vars
.var counter
.var timer, 2
.endregion

LDA #$00
STA counter
```

**Assembly generato:**
```
; .var counter
```

**Dimensione:** 1 byte per impostazione predefinita, oppure `N` byte quando la dimensione è specificata.

L'allocatore percorre un cursore di pagina zero configurabile (`$02` a `$FE`) e assegna il primo slot libero. Se la regione richiesta si sovrappone a un'etichetta già utilizzata, il compilatore emette un avviso.

---

### Runtime IF / ELSE / ENDIF

Come un vero modello di diramazione, questa versione funziona in fase di esecuzione, non in fase di compilazione. Confronta A, X o Y con un valore immediato ed emette la corretta sequenza di diramazione CMP / CPX / CPY + per te.

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
.endif
```

**Dimensioni:** Dipende dai rami scelti e dal modulo di confronto.

Il confronto è senza segno per impostazione predefinita. Per `&lt;=` e `&gt;` la macro si espande nella catena di diramazioni equivalente più breve per il registro selezionato.

---

### WHILE / ENDW

Come **un ciclo di runtime con un test in cima** — il corpo viene eseguito finché la condizione rimane vera.

| Campo     | Descrizione                                  |
| --------- | -------------------------------------------- |
| Registro  | `A`, `X` o `Y`                               |
| Operatore | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Valore    | Valore immediato in formato HEX o DEC        |

**Sintassi esperta:**
```
.while A != #$00
    JSR getchar
.endw
```

**Dimensioni:** Dipende dal corpo del ciclo e dalla forma di confronto.

Utilizzare `WHILE` quando il ciclo potrebbe terminare prima della fine della prima iterazione. È la controparte in fase di esecuzione dell'helper `LOOP / NEXT` basato sul conteggio.

---

### REPEAT / UNTIL

Come **un ciclo di runtime con un test in fondo** — il corpo viene sempre eseguito almeno una volta, poi la condizione decide se fermarsi.

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

Utilizza `REPEAT / UNTIL` quando desideri che il corpo venga eseguito almeno una volta prima del controllo di uscita.

---

### MEMCPY / MEMSET

Come le **piccole routine di memoria a cui fai ricorso costantemente** — `MEMCPY` copia un blocco contiguo, `MEMSET` riempie un intervallo con un byte.

| Macro    | Campi                               |
| -------- | ----------------------------------- |
| `MEMCPY` | `src`, `dst`, `size`                |
| `MEMSET` | `indirizzo`, `valore`, `dimensione` |

**Sintassi esperta:**
```
.memcpy src=$C000, dst=$D000, size=$0100
.memset addr=$0400, value=#$20, size=$03E8
```

**Assembly generato:** cicli di copia/riempimento in linea, scelti per corrispondere alla dimensione richiesta.

Per dimensioni fino a 256 byte viene utilizzato un breve ciclo a 8 bit. Per dimensioni maggiori, il passaggio a un contatore a 16 bit avviene automaticamente.

---

### PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY / SET_BORDER / SET_BG

#### PRINT

Come l'output **PETSCII senza il boilerplate** — stampa una stringa tramite `CHROUT` con la stessa gestione delle maiuscole/minuscole del blocco PETSCII. La casella di controllo delle minuscole è condivisa con il codificatore PETSCII, quindi il percorso del testo rimane coerente.

**Sintassi esperta:**
```
.print "HELLO"
.print "hello", lower
```

#### PRINT_CHAR

Stampa un byte PETSCII tramite codice numerico e lo invia tramite `CHROUT`. Il valore può anche essere una costante denominata o un'etichetta che si risolve in un byte in fase di assemblaggio, sia in modalità Blocco che in modalità Esperto.

**Sintassi esperta:**
```
.print_char 65
.print_char $41
.print_char color
```

#### PRINT_HEX

Stampa un valore a 8 bit come testo esadecimale attraverso il normale percorso di output del KERNAL.

**Sintassi esperta:**
```
.print_hex A
```

#### CLEAR_SCREEN

Scorciatoia per il codice di controllo standard per cancellare lo schermo del C64.

**Sintassi esperta:**
```
.clear_screen
```

#### WAIT_KEY

Attende che venga premuto un tasto, così non è necessario eseguire manualmente il ciclo `GETIN` ogni volta.

**Sintassi esperta:**
```
.wait_key
```

#### DELAY

Attende il numero di fotogrammi richiesto tramite una routine di supporto condivisa. Utilizzare questa opzione per brevi pause e intervalli di temporizzazione quando un ciclo personalizzato completo sarebbe eccessivo. Il conteggio dei fotogrammi può essere un numero grezzo o una costante denominata, e `.wait` è semplicemente un alias di `.delay`.

**Sintassi esperta:**
```
.delay 29
.wait 29
.delay frames=FRAMES_1S
```

In modalità Blocco, il campo ritardo utilizza un selettore di costanti compatto quando è disponibile un valore simbolico, in modo da non dover digitare il nome manualmente ogni volta.

#### SET_BORDER / SET_BG

Funzioni di convenienza per i registri colore del VIC-II. Il valore del colore può essere un numero grezzo o una costante denominata che si risolve in un intervallo da 0 a 15. Sia la modalità Blocco che la modalità Esperto accettano nomi di costanti simboliche.

**Sintassi esperta:**
```
.set_border 6
.set_bg 0
.set_border color
.set_bg color
```

**Dimensione:** Ogni helper si espande in una piccola sequenza di scrittura di registro o in una breve chiamata KERNAL.

In modalità Blocco, questi campi utilizzano anche il selettore const, quindi il valore simbolico rimane visibile invece di essere sostituito da un numero grezzo.

---

### IRQ_SETUP

Configura un gestore IRQ raster in un solo passaggio. La macro scrive il vettore IRQ, abilita gli IRQ raster, imposta la riga, disabilita le sorgenti IRQ CIA comuni e ritorna all'esecuzione normale con `CLI`.

| Campo       | Descrizione                                                       |
| ----------- | ----------------------------------------------------------------- |
| Manutentore | Etichetta della routine IRQ (ad esempio `my_irq`)                 |
| Raster      | Linea raster in formato esadecimale o decimale (ad esempio `$FA`) |

**Sintassi esperta:**
```
.irq_setup handler=my_irq, raster=$FA
```

**Dimensioni:** Una piccola sequenza di configurazione; la lunghezza esatta dipende dalla linea raster selezionata.

Utilizza questa opzione quando desideri il codice standard "SEI / installa gestore / abilita IRQ / CLI" senza doverlo disperdere nel programma.

---

### RAND

Come **un piccolo PRNG integrato** — restituisce un valore pseudo-casuale a 8 bit da un seme compatto a pagina zero.

| Campo | Descrizione                                                           |
| ----- | --------------------------------------------------------------------- |
| Seme  | Byte o etichetta di seed di pagina zero opzionale (predefinito `$FB`) |

**Sintassi esperta:**
```
.rand
```

**Dimensione:** Una manciata di byte, a seconda del percorso di implementazione scelto.

Il generatore è pensato per il gameplay, la variazione degli effetti e la raccolta rapida di dati di test. È volutamente di dimensioni ridotte, piuttosto che dotato di sofisticate funzionalità crittografiche.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Configura uno sprite VIC-II in un unico blocco: invece di scrivere circa 6 istruzioni POKE in BASIC, basta compilare i campi. Imposta il puntatore dati dello sprite, lo accende, abilita facoltativamente la modalità multicolore e ne imposta il colore.

| Campo       | Descrizione                                                                   |
| ----------- | ----------------------------------------------------------------------------- |
| Sprite #    | Numero dello sprite 0–7                                                       |
| Colore      | Indice di colore 0–15 (tavolozza C64)                                         |
| Pagina dati | Indirizzo dati sprite / 64 (ad esempio `$21` se i dati si trovano in `$0840`) |
| Multicolore | Attiva/disattiva il bit multicolore dello sprite (`$D01C`)                    |

**Sintassi esperta:**
```
.sprite_init 0, 7, $21
.sprite_init 0, 7, $21, multicolor
.sprite_init 0, 7, $21, mono
```

**Assembly generato:**
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

**Dimensione:** 26 byte.

> **Pagina dati sprite:** `indirizzo_dati ÷ 64`. Con lo stub BASIC SYS predefinito, `ALIGN 64` dopo `JMP main` posiziona i dati sprite a `$0840` → pagina = `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Come **`POKE 53248, x : POKE 53249, y`** in BASIC — imposta la posizione iniziale di uno sprite. Le coordinate vengono incorporate in fase di assemblaggio e i campi accettano costanti in modalità Blocco; per l'animazione utilizzare `INC`/`DEC` direttamente sul registro dello sprite.

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
    LDA #$98        ; X low byte
    STA $D000       ; sprite 0 X register
    LDA $D010
    AND #$FE        ; clear X MSB for sprite 0 (X ≤ 255)
    STA $D010
    LDA #$64        ; Y = 100
    STA $D001       ; sprite 0 Y register
```

Per X > 255 la macro imposta il bit corrispondente in `$D010` invece di azzerarlo.

**Dimensione:** 18 byte.

> **Nota:** `SPRITE_POS` inserisce le coordinate X/Y nel codice (`LDA #$xx`). Per animare uno sprite in fase di esecuzione, utilizzare `INC $D000` / `DEC $D000` — vedere l'esempio `sprite-macro-demo`.

---

<a id="wait_raster"></a>
### WAIT_RASTER

Attende che il fascio di elettroni del VIC-II raggiunga una specifica linea di scansione, come per sincronizzarsi con un fotogramma televisivo. Posizionalo all'inizio del ciclo di gioco per evitare il tearing degli sprite. Nessun JSR, nessuna etichetta necessaria.

| Campo        | Descrizione                                                             |
| ------------ | ----------------------------------------------------------------------- |
| Linea raster | Riga raster di destinazione in esadecimale (ad esempio `FF` = riga 255) |

**Sintassi esperta:**
```
.wait_raster $FF
```

**Assembly generato:**
```
wait:
    LDA $D012       ; current raster line
    CMP #$FF        ; target line
    BNE wait        ; loop back (-7 bytes)
```

**Dimensione:** 7 byte (l'offset `BNE` `$F9` = −7 punta sempre all'`LDA`).

> **Suggerimento:** Posiziona `WAIT_RASTER` all'inizio del ciclo di gioco per sincronizzarlo con il display e prevenire lo strappo degli sprite.

---

### JOYSTICK

Come leggere **`PEEK($DC00)`** e poi POKE la posizione dello sprite, ma in un unico blocco. Legge una porta joystick CIA e regola di conseguenza i registri X/Y di uno sprite. Interamente inline, non è necessario JSR.

| Campo    | Descrizione                                                                            |
| -------- | -------------------------------------------------------------------------------------- |
| Porta    | `1` = porta 1 (`$DC01`) oppure `2` = porta 2 (`$DC00`)                                 |
| Sprite # | Numero dello sprite da 0 a 7 (controlla quale coppia di registri X/Y viene aggiornata) |

**Sintassi esperta:**
```
.joystick 2, 0
```

**ASM generato (porta 2, sprite 0):**
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

**Mappa dei bit del joystick (attivo-BASSO - bit = 0 significa premuto):**

| Morso | Direzione | registro della CIA                |
| ----- | --------- | --------------------------------- |
| 0     | Su        | $DC00 (porta 2) / $DC01 (porta 1) |
| 1     | Giù       |                                   |
| 2     | Sinistra  |                                   |
| 3     | Giusto    |                                   |
| 4     | Fuoco     | (non gestito da questa macro)     |

**Dimensione:** 27 byte. L'offset `BCS` è sempre `+3` (salta la successiva istruzione abs`DEC`/`INC da 3 byte).

> **Uso tipico:** Inserire all'interno di un'etichetta `gameloop` con `WAIT_RASTER` per primo:
> ```
> gameloop:
>     WAIT_RASTER ($FF)
>     JOYSTICK (port=2, sprite=0)
>     JMP gameloop
> ```

---

<a id="mouse"></a>
### MOUSE

Legge un mouse proporzionale Commodore 1351 e muove uno sprite. Interamente **inline** — non sono necessari JSR o etichette. La macro seleziona la porta CIA, attende che gli input del paddle SID si stabilizzino, quindi decodifica il movimento delta utilizzando lo schema standard del driver 1351 e lo applica ai registri dello sprite.

| Campo     | Descrizione                                                                                        |
| --------- | -------------------------------------------------------------------------------------------------- |
| Porta     | `1` = CIA `$DC00` bit `7:6` = `%01`; `2` = `%10`                                                   |
| Sprite #  | Numero dello sprite 0–7                                                                            |
| ZP byte X | Indirizzo di pagina zero (esadecimale) per contenere il precedente campione POTX (ad esempio `FD`) |
| ZP byte Y | Indirizzo di pagina zero (esadecimale) per contenere il precedente campione POTY (ad esempio `FE`) |

** Forma ASM generata (porta 1, sprite 0, ZP `$FD`/`$FE`):**

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

**Dimensione:** 142 byte.

**Sintassi della modalità esperto:**
```
.mouse port, spriteNum, zpX, zpY
; example:
.mouse 2, 0, FD, FE
```

> **Importante:** Prima della prima chiamata, inizializzare i byte della pagina zero con i valori POTX/POTY correnti per evitare un salto nel primo frame:
> ```
>     ; port 1: LDA $DC00 : AND #$3F : ORA #$40 : STA $DC00
>     ; port 2: LDA $DC00 : AND #$3F : ORA #$80 : STA $DC00
>     LDA $D419 : LSR A : AND #$3F : STA $FD
>     LDA $D41A : LSR A : AND #$3F : STA $FE
> ```

> **Suggerimento:** Esegui il polling del mouse una volta per frame: posiziona `WAIT_RASTER` nel ciclo di gioco prima di `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Come **`PEEK($D01E)`** in BASIC: controlla i registri di collisione hardware del VIC-II e ti dice se uno sprite ha colpito un altro sprite o lo sfondo. Interamente inline, non è necessario JSR.

| Campo              | Descrizione                                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Sprite #           | Numero dello sprite 0–7 (quale bit dello sprite controllare)                                                            |
| Tipo di collisione | `Sprite-Sprite ($D01E)` — collisione con un altro sprite; `Sprite-Sfondo ($D01F)` — collisione con la grafica di sfondo |

**Sintassi esperta:**
```
.sprite_col 0, sprite
.sprite_col 0, background
```

**ASM generato (sprite 0, sprite–sprite):**
```
    LDA $D01E       ; read sprite-sprite collision register (clears it!)
    AND #$01        ; isolate bit 0 (sprite 0)
                    ; A ≠ 0 → collision occurred
```

**Dimensione:** 5 byte.

> **Importante:** La lettura di `$D01E`/`$D01F` **azzera il registro**. Leggilo una volta per frame e agisci immediatamente sul risultato con `BEQ`/`BNE`.

**Uso tipico:**
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

> **Vedi anche:** `esempio di dimostrazione di collisione` — palla verde (sprite n. 0) contro croce rossa (sprite n. 1).

---

### LOADFILE

Come **`LOAD "file",8`** in BASIC — carica un file da un disco D64 in fase di esecuzione utilizzando la routine KERNAL LOAD. Usalo per caricare dati, musica o codice aggiuntivo dal disco mentre il tuo programma è in esecuzione.

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

**Dimensione:** `3 + lunghezza_nome_file + 9 (SETNAM) + 9 (SETLFS) + (4 se sovrascrivi) + 5 (LOAD) + (2 se etichetta di errore)` byte. Minimo 27 byte.

> **Importante:** Il nome del file viene memorizzato in linea nel codice macchina subito dopo un `JMP skip_filename`. Il nome del file sul disco deve essere PETSCII in maiuscolo, che corrisponde alle normali lettere maiuscole ASCII (`A`–`Z`). La macro impone automaticamente questa condizione.

> **Utilizzare sempre un'etichetta di errore** per i programmi di produzione: se il file non viene trovato, KERNAL imposta il flag di riporto e l'esecuzione passa a ciò che è successivo.

> **Vedi anche:** `esempio loadfile-demo` — dimostra il caricamento di `DEMO-COLORS.PRG` da un D64 con un ramo di errore BCS e una schermata di errore visiva.

---

### EXODECRUNCH

Decompressione Exomizer in-program ** **. Utilizzare questa macro subito dopo un `LOADFILE ` che ha caricato un flusso compresso in modalità `mem ` di Exomizer: EXODECRUNCH lo decomprime all'indietro nell'indirizzo incorporato nel flusso.

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

**Come funziona:**

1. KERNAL `LOAD` ($FFD5) aggiorna ZP `$AE/$AF` al punto successivo all'ultimo byte caricato. EXODECRUNCH copia questo in ZP `$04/$05`, che è la convenzione ufficiale Exomizer per la fine del codice sorgente all'indietro.
2. Il depacker è tipicamente posizionato in `$B000` (all'interno della regione mappata della ROM BASIC). La macro commuta `$01 = $36` in modo che la CPU veda la RAM lì durante il JSR, quindi ripristina `$01 = $37` in seguito.
3. L'indirizzo di destinazione della decompressione è **codificato nel flusso compresso stesso** quando si comprime con `exomizer mem -l <carica> file,<destinazione>` — il depacker lo legge dai primi byte del flusso.

**Depacker binario:** il depacker precompilato all'indietro è `samples/exo-decrunch.bin` (477 byte, ORG $B000). È un wrap di Kick Assembler dell'ufficiale `exodecrunch.asm` con `INC $D020` aggiunto ad ogni lettura per un effetto di lampeggio del bordo visibile durante la decompressione. Inseriscilo nel tuo programma con un blocco `INCBIN` all'indirizzo del depacker.

**Compensazione dell'offset di sicurezza:**La modalità mem predefinita di Exomizer applica un offset di sicurezza di 2 byte: i dati vengono inseriti 2 byte prima della destinazione richiesta. La finestra di dialogo Esegui tramite D64 **aggiunge automaticamente 2 al campo Dst** prima di chiamare Exomizer, in modo che il comportamento visibile corrisponda all'indirizzo digitato.

> **Vedi anche:** l'esempio `exo-multicolor-demo` — esempio completo end-to-end: LOADFILE una bitmap multicolore compressa in $C000, EXODECRUNCH la decomprime in $2000, quindi copia lo schermo → $0400 e il colore → $D800 e passa VIC-II alla modalità bitmap multicolore.

> **Test di integrazione:** `test del carico --test exomizer_integration` (in `src-tauri/`) verifica il ciclo completo di compressione + decompressione su un emulatore 6502 con il binario depacker reale. Criteri di passaggio: 10000 byte equivalenti al file sorgente `multi-color.bin`.

---

### REU_CHECK

Rileva se è collegata un'unità di espansione RAM Commodore (REU), come controllare `PEEK($D010)` per verificare la presenza dell'hardware. Esegue i test scrivendo e leggendo due pattern nel registro REU `$DF04`.

| Campo   | Descrizione     |
| ------- | --------------- |
| Nessuno | Nessun operando |

**Codice generato (34 byte):**
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
> La macro normalizza il risultato in modo che il ramo seguente rimanga semplice: `BNE` significa REU presente, `BEQ` significa REU mancante.

**Sintassi esperta:**
```
.reu_check
```

**Risultato in flag:**
- **Z = 0** (risultato ≠ 0) → REU presente → usa `BNE`
- **Z = 1** (risultato = 0) → nessuna REU → usa `BEQ`

**Nessun campo configurabile** — la macro genera sempre lo stesso codice.

**Uso tipico:**
```assembly
REU_CHECK
BEQ no_reu        ; skip if REU not present
; ... REU code here ...
no_reu:
```

---

### REU_STASH / REU_FETCH / REU_SWAP

Trasferimento di blocchi DMA tra la RAM del C64 e la memoria di espansione REU: è come un ciclo POKE molto veloce, ma la CPU non esegue alcuna operazione (il chip REU copia i dati mentre la CPU è ferma). Un trasferimento di 1000 byte è praticamente istantaneo.

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

> **Nota:** I comandi utilizzano `$90/$91/$92` (bit 4 impostato = modalità DMA immediata). La scrittura su `$DF01` avvia il trasferimento; la CPU riprende quando è terminato.

---

### TURBO_SET

Imposta la velocità della CPU **Ultimate-64 (U64)** tramite il registro `$D031`. Nessun effetto su un vero C64 o altri emulatori.

** Campi:**

| Campo            | Descrizione                  | Allineare                                            |
| ---------------- | ---------------------------- | ---------------------------------------------------- |
| Velocità         | Indice di velocità della CPU | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz                 |
| Linea del sedere | Emulazione Badline           | Attivato (compatibile con C64) / Disattivato (turbo) |

Il byte della velocità viene calcolato come: `(speedIndex &amp; 0x0F) | (badline_disabled ? 0x80 : 0x00)`.

**Codice generato (5 byte):**
```
A9 xx   LDA #speed_byte
8D 31 D0   STA $D031
```

**Sintassi della modalità esperto:**
```
.turbo_set 7,0    ; speed=7 (~10 MHz), badline enabled
.turbo_set 15,1   ; speed=15 (~48 MHz), badline disabled
```

> **Nota:** Questa macro influisce solo sull'hardware U64. Su un vero C64 o su altri emulatori, scrive in `$D031`, il che potrebbe influire sul CIA o essere ignorato.

---

### SUPERCPU_DETECT

Controlla se è installato un acceleratore **CMD SuperCPU** — come `PEEK($D0B8)` per vedere se restituisce qualcosa di diverso da `$FF`.

**Codice generato (5 byte):**
```
AD B8 D0   LDA $D0B8
C9 FF      CMP #$FF
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
BEQ no_scpu       ; skip if SuperCPU not present
; ... SuperCPU turbo code here ...
no_scpu:
```

---

### TURBO_ENABLE

Attiva o disattiva la modalità turbo **CMD SuperCPU**. Chiama prima `SUPERCPU_DETECT` e salta questo passaggio se la SuperCPU non è presente.

| Modalità   | Registro | Effetto                                               |
| ---------- | -------- | ----------------------------------------------------- |
| Abilitare  | `$D07A`  | Attiva la modalità turbo (fino a 20 MHz con SuperCPU) |
| Disabilita | `$D07B`  | Ritorno alla modalità di compatibilità a 1 MHz        |

**Codice generato (5 byte):**
```
A9 00         LDA #$00
8D 7A D0      STA $D07A    ; (or $D07B for disable)
```

**Sintassi della modalità esperto:**
```
.turbo_enable on
.turbo_enable off
```

> **Nota:** Chiamare prima `SUPERCPU_DETECT` e saltare questa macro se la SuperCPU non è presente.

---

<a id="map_copy"></a>
### MAP_COPY

Copia una tilemap da un indirizzo sorgente alla RAM dello schermo (e opzionalmente alla RAM dei colori) utilizzando una serie di cicli `LDA abs,X` / `STA abs,X`. Una pagina da 256 byte viene copiata per ogni iterazione del ciclo; una pagina parziale alla fine utilizza `CPX #rem / BNE` per interrompere. Non è necessario JSR: tutto il codice viene generato inline.

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

**Dimensioni:** `2 (LDX) + fullPages×9 + (rem &gt; 0 ? 11 : 0)` byte per sezione. La modalità combinata lo raddoppia (sezione schermo + sezione colore identica).

**Associazione con l'editor di mappe:**

L'editor di mappe **File → Salva mappa + RAM colore (.bin)** esporta un singolo file binario in cui i primi `size` byte sono i codici schermo e i successivi `size` byte sono i valori della RAM colore. Utilizzare MAP_COPY con **Combined .bin** selezionato e puntare **Source addr** alla posizione in cui viene caricato questo file (ad esempio tramite INCBIN a `$C000`):

```
* = $C000
    INCBIN "map-color.bin" @ $C000   ; screen codes $C000–$C3E7, color $C3E8–$C7CF
* = $0801
    ; ...
    MAP_COPY src=$C000 dst=$0400 size=1000 combined color_dst=$D800
```

**Sintassi della modalità esperto:**
```
.map_copy $C000, $0400, 1000               ; screen only
.map_copy $C000, $0400, 1000, auto, $D800  ; combined (color at src+size)
.map_copy $C000, $0400, 1000, $C3E8, $D800 ; explicit color source address
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Copia un'area di caratteri 16×16 da un blocco di codice schermo compatto da 256 byte, più un blocco RAM Colore corrispondente da 256 byte. È pensato per le esportazioni Charset Canvas e per piccoli blocchi di tile/immagini, dove la scrittura di sedici righe separate di MAP_COPY risulterebbe eccessiva.

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

La forma abbreviata copia i byte dello schermo da `$3000`, i byte del colore da `$3100` e posiziona il blocco 16×16 nella colonna 12, riga 4. Le posizioni valide in alto a sinistra sono `col = 0..24` e `row = 0..9`, quindi l'intera area 16×16 rimane sullo schermo di testo 40×25 del C64.

**Comportamento generato:**

- Genera sedici copie di righe in linea.
- Ogni riga copia 16 byte dello schermo e 16 byte del colore.
- Non è necessario alcun JSR; il codice viene emesso direttamente nella posizione della macro.
- Funziona sia con la modalità caratteri normale che con la modalità caratteri multicolore; i byte della RAM Colore contengono il bit di abilitazione del colore del carattere/multicolore di ciascuna cella.

Abbinamento tipico con Charset Canvas:

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

Avanza il frame di animazione di uno sprite a ogni chiamata e aggiorna il puntatore ai dati dello sprite VIC-II. Memorizza un byte per frame in una tabella (il numero della pagina dei dati dello sprite = `indirizzo_dati / 64`), punta SPRITE_ANIM a tale tabella e chiamala una volta per frame di gioco, senza bisogno di JSR.

| Campo                           | Descrizione                                                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Sprite #                        | Numero dello sprite 0–7                                                                                        |
| Indirizzo dell'elenco dei frame | Indirizzo esadecimale della tabella dei frame: un byte per frame, ogni byte = pagina sprite (`data_addr / 64`) |
| Conteggio dei fotogrammi        | Numero totale di fotogrammi (1–255)                                                                            |
| Telaio ZP                       | Byte di pagina zero utilizzato come contatore di frame (ad esempio `FB`)                                       |

**ASM generato (sprite 0, 4 fotogrammi, ZP `$FB`, elenco a `$C100`):**
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

**Dimensione:** 19 byte.

**Uso tipico:**
```
frameTable:
    .byte $21, $22, $23, $24   ; 4 frames at $0840, $0880, $08C0, $0900

gameloop:
    WAIT_RASTER ($FF)
    SPRITE_ANIM (sprite=0, list=$C100, count=4, zp=$FB)
    JMP gameloop
```

**Sintassi della modalità esperto:**
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; example:
.sprite_anim 0, C100, 4, FB
```

> **Suggerimento:** Posiziona la tabella dei frame come blocco RAWBYTES a un indirizzo fisso. Il byte ZP del contatore (`$FB`) deve essere inizializzato a `$00` prima della prima chiamata. Se il tuo codice utilizza `$FB` per qualcos'altro, scegli una posizione ZP libera.

---

<a id="score_bcd"></a>
### SCORE_BCD

Aggiunge un valore a virgola fissa a un punteggio BCD multibyte memorizzato in memoria, quindi visualizza ogni cifra nella RAM dello schermo come carattere di codice schermo. Utilizza la modalità decimale 6502 (`SED`/`CLD`) per l'aritmetica BCD sicura al riporto: non è necessario alcun riporto manuale.

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

**Dimensione:** `3 + cifre×8` byte (overhead SED + CLC + CLD + 8 byte per byte BCD per ADC + ciclo di visualizzazione).

**Sintassi della modalità esperto:**
```
.score_bcd $C200, 4, 100, $0400
```

> **Suggerimento:** Inizializza i byte del punteggio a `$00` all'avvio. L'indirizzo del punteggio dovrebbe trovarsi nella pagina zero o nella RAM assoluta, non nella ROM. L'indirizzo dello schermo dovrebbe puntare alla cella della cifra più a sinistra; le cifre vengono scritte da sinistra a destra (il byte più significativo per primo).

> **Intervallo BCD:** `cifre=4` byte → 8 cifre decimali → punteggio massimo 99.999.999. Ogni byte codifica due cifre BCD: `$00`–`$99`.

---

## 10. Integrazione del debugger

L'app supporta **RetroDebugger** come debugger esterno per C64. Riceve breakpoint, simboli e flag di avvio automatico generati dal programma assemblato.

### RetroDebugger

[RetroDebugger](https://github.com/slajerek/RetroDebugger) è un debugger multipiattaforma per Commodore 64 con supporto per breakpoint, ispezione della memoria e disassemblaggio con riconoscimento delle etichette.

**Configurazione:** Apri **Impostazioni → Configura l'eseguibile di RetroDebugger** e indicagli il percorso del binario di `RetroDebugger`.

**Avvia:** Fai clic su **Debug (RetroDebugger)** nella barra degli strumenti. L'app:

1. Assembla il programma in un file `.prg` in una directory temporanea.
2. Scrivi un file di punti di interruzione **** (`breakpoints.txt`) — un `break $ADDR` per blocco contrassegnato.
3. Scrivi un file di simboli ** (**symbols.txt`) nel formato di etichetta di Vice/RetroDebugger (`al C:addr .name`). Tutti i blocchi LABEL e CONST sono inclusi.
4. Scrivi anche i file sidecar in stile C64Debugger accanto al PRG compilato: `.dbg`, `.sym` e `.vs`.
5. Avvia RetroDebugger con:
   ```
   RetroDebugger -prg <file.prg> -breakpoints <breakpoints.txt> -symbols <symbols.txt> [flags]
   ```

### Blocchi di interruzione

Fai clic sull'icona del punto di interruzione (●) su un blocco di istruzioni qualsiasi per attivarlo come punto di interruzione. I blocchi con punto di interruzione vengono evidenziati in rosso. I loro indirizzi vengono scritti nel file dei punti di interruzione ad ogni avvio del debugger.

### Flag di debug (scheda Opzioni)

| Attiva/disattiva   | Bandiera          | Effetto                                                                     |
| ------------------ | ----------------- | --------------------------------------------------------------------------- |
| `-salto` ATTIVO    | `-salta $ADDR`    | Passa direttamente all'indirizzo di avvio del programma dopo il caricamento |
| `-riprendi` ATTIVO | `-riprendi`       | Riattivare immediatamente il debugger al caricamento                        |
| `-attendi` ON      | `-attendere <ms>` | Attendi `<ms>` millisecondi prima di riprendere — 500 ms o 1000 ms          |

> **Suggerimento:** Per la maggior parte dei programmi, abilita `-jmp` e `-unpause` per l'avvio automatico istantaneo. Usa `-wait 500` o `-wait 1000` quando il tuo programma imposta IRQ o musica SID che necessita di tempo per l'inizializzazione prima del primo raster.

---

## 11. Collegamenti alla Knowledge Base

Collegamenti di riferimento rapido disponibili nell'app alla voce **Base di conoscenza**:

| Risorsa                              | URL                                            |
| ------------------------------------ | ---------------------------------------------- |
| Riferimento ai codici operativi 6502 | http://www.6502.org/tutorials/6502opcodes.html |
| Funzioni del kernel C64              | https://sta.c64.org/cbm64krnfunc.html          |
| Mappa della memoria del C64          | https://sta.c64.org/cbm64mem.html              |
| Codici colore C64                    | https://sta.c64.org/cbm64col.html              |
| Articolo VIC-II                      | https://www.cebix.net/VIC-Article.txt          |
| Codice sorgente C64                  | https://codebase.c64.org/                      |
| Il Turbo Assembler                   | https://turbo.style64.org/                     |
| RetroDebugger                        | https://github.com/slajerek/RetroDebugger/     |

---

## 12. Esportazione ed esecuzione D64

La versione 1.5.1 aggiunge la possibilità di impacchettare il programma (e file di dati aggiuntivi) in un'immagine disco C64 D64 e di avviarla in VICE, oppure di esportare l'immagine disco per utilizzarla altrove.

### Pulsante Split Run

Il pulsante **Esegui** della barra degli strumenti è stato sostituito da un pulsante **diviso**:

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

La modalità selezionata viene salvata tra una sessione e l'altra.

### Finestra di dialogo Esporta in D64

Apri tramite il menu a tendina **Salva PRG ▾** → **Esporta in D64**. La finestra di dialogo consente di:

1. Imposta il nome del disco ** (max 16 caratteri) e il nome del programma ** — questi sono i nomi che appaiono nella directory del disco C64.
2. **Aggiungi file extra** — fai clic su **+** per selezionare un file binario qualsiasi (`.prg`, `.bin`, `.sid`, ecc.). Per ogni extra:
   - **Nome** — come appare nella directory D64 (max 16 caratteri, maiuscolo automatico).
   - **Addr** (indirizzo di caricamento, facoltativo) — se fornito, viene anteposto un header PRG di 2 byte. Lasciare vuoto per scrivere byte grezzi senza header.
   - **Dst** (destinazione di decompressione, solo con EXO) — dove il depacker dovrebbe depositare i dati sul C64. Quando EXO è abilitato, l'extra viene compresso con `exomizer mem -l <Addr> file,<Dst>` prima di essere scritto sul D64. La compensazione dell'offset di sicurezza +2 viene applicata automaticamente.
   - **EXO** — casella di controllo che attiva la compressione inversa in modalità `mem` per questa voce. La dimensione su disco è in genere il 5-20% dell'originale.
3. Fai clic su **Esporta** per generare il file `.d64` utilizzando lo strumento `c1541` di VICE.

**Abbinamento con EXODECRUNCH:** quando si invia un file con EXO=on, il programma che lo legge dovrebbe CARICARLO all'indirizzo **Addr** (sec=1, intestazione PRG del file stesso), quindi chiamare la macro **EXODECRUNCH** per decomprimerlo in **Dst**. Vedere l'esempio `exo-multicolor-demo` per il modello completo.

### Metadati D64 nei progetti

Il nome del disco, il nome del programma e l'elenco dei file aggiuntivi vengono salvati all'interno del JSON del progetto (sotto la chiave `d64`). Quando si ricarica il progetto o un esempio che include metadati D64, i file aggiuntivi vengono ripristinati automaticamente, senza bisogno di aggiungerli nuovamente ogni volta.

L'esempio **loadfile-demo** viene fornito preconfigurato con `DEMO-COLORS.PRG` come file aggiuntivo. Selezionalo, apri **Esegui tramite D64** e fai clic su **Esegui** per vedere l'intero flusso di caricamento in azione.

> **Requisito:** Sia l'esportazione D64 che l'esecuzione tramite D64 richiedono che VICE (`c1541`) sia configurato in [Impostazioni hardware](#13-hardware-settings).

### Editor D64 (per visualizzare e modificare un'immagine disco esistente)

L'icona nella barra degli strumenti dopo l'Editor di curve apre l'Editor D64, uno strumento autonomo per lavorare direttamente con un'immagine D64 esistente, indipendentemente dal programma attualmente aperto. A differenza della finestra di dialogo Esporta in D64 mostrata sopra (che crea sempre un nuovo disco dal file PRG compilato), l'Editor D64 modifica un'immagine disco direttamente tramite c1541, fungendo quindi anche da gestore di dischi leggero.

**Menu File ▾:**

| Articolo            | Azione                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| **Nuovo D64…**      | Scegli un percorso di destinazione e crea lì un'immagine disco vuota e formattata di recente.    |
| **Apri D64…**       | Seleziona un file `.d64` esistente e carica la sua directory.                                    |
| **Salva con nome…** | Copia l'immagine disco attualmente aperta in un nuovo percorso e continua a modificare la copia. |
| **Esegui in VICE**  | Avvia l'immagine disco attualmente aperta direttamente in VICE (`-drive8type 1541`).             |

**Barra degli strumenti:**

| Icona                                | Azione                                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **Aggiungi programma**               | Seleziona un file locale e scrivilo nella directory del disco.                                         |
| **Estratto selezionato**             | Salva i byte della voce selezionata in un file locale `.prg`.                                          |
| **Rinomina selezionato**             | Modifica il nome della voce direttamente nella tabella: premi Invio per confermare, Esc per annullare. |
| **Elimina gli elementi selezionati** | Rimuovere la voce selezionata dal disco.                                                               |
| **Aggiorna**                         | Rileggere la directory, ad esempio dopo aver modificato il disco con un altro programma.               |

**Aggiunta di un programma:** selezionando un file che termina già con `.prg` richiede solo un **Nome** e un **Tipo di disco** (PRG/SEQ/USR/REL) — un `.prg` contiene già la propria intestazione di indirizzo di caricamento, quindi viene scritto invariato. Selezionando qualsiasi altro file (ad esempio un `.bin` non elaborato) viene inoltre visualizzato:

- **Indirizzo di caricamento** (esadecimale, facoltativo) — anteponi un'intestazione PRG di 2 byte a questo indirizzo; lascia vuoto per scrivere i byte raw.
- **Indirizzo di decompressione** (esadecimale, facoltativo) — utilizzato solo insieme a Exomizer; l'indirizzo di destinazione in cui il decompressore deve estrarre i dati.
- Casella di controllo **Exomizer** — comprime il file prima della scrittura, utilizzando le stesse modalità di compressione `mem`/`sfx` dei file aggiuntivi nella finestra di dialogo Esporta in D64 sopra.

L'elenco delle directory visualizza i nomi dei file con lo stesso carattere e stile maiuscolo di un vero elenco C64 `LOAD"$",8`.

> **Requisito:** come per l'esportazione in D64, l'editor D64 richiede VICE (`c1541`) configurato in [Impostazioni hardware](#13-hardware-settings). Ogni azione (aggiunta/eliminazione/rinomina/estrazione) viene applicata direttamente al file `.d64` sul disco: non è previsto un passaggio di "salvataggio" separato.

---

## 12b. Esportazione CRT (cartuccia Magic Desk 64K)

**Menu → Build → Build CRT** produce un'immagine di cartuccia per Commodore 64 (`.crt`, **tipo di cartuccia 19 — Magic Desk / Domark / HES Australia**) che funziona su VICE, TheC64, hardware reale tramite EasyFlash / Kung Fu Flash e slot per cartucce Ultimate II+ da 1541. È disponibile sia in **modalità a blocchi** che in **modalità esperto** e, a partire dalla build attuale, anche in **modalità UltimateBasic**.

### Cosa viene spedito nel carrello

- **8 × 8 KB di banchi** a `$8000`, commutazione di banco tramite `$DE00` (convenzione Magic Desk: 3 bit bassi = banco, bit 7 = disabilita carrello).
- **Il banco 0** contiene un'intestazione di 128 byte + boot loader:
  - `$8000/$8002` I vettori di avvio freddo + caldo puntano a `$8009`.
  - `$8004–$8008` = la firma `CBM80` richiesta dal codice di reset KERNAL.
  - `$8009–$807F` = il caricatore: SEI / inizializzazione dello stack / `JSR $FDA3` (IOINIT) / `JSR $FD50` (RAMTAS) / `JSR $FD15` (RESTOR) / `JSR $FF5B` (CINT), quindi un ciclo di copia di byte che trasmette il payload dalla ROM della cartuccia alla RAM e cambia banco quando `$FC` raggiunge `$A0`. Alla fine copia un piccolo stub di uscita in $0100, disabilita il carrello con LDA #80 : STA $DE00 e salta al punto di ingresso.
- **Il payload** inizia a `$8080` nel banco 0 e si espande nei banchi 1–7 secondo necessità. Il payload massimo = `8 * 8192 − 128 = 65 408 byte`.

### Indirizzo di caricamento e punto di ingresso

La build CRT non utilizza mai Exomizer (il depacker non può essere eseguito dalla ROM della cartuccia). Compila la scheda corrente con la pipeline di avvio automatico standard e prende l'indirizzo di caricamento dall'intestazione PRG e il punto di ingresso dal target SYS:

- **Modalità blocco/esperto con stub BASIC SYS attivo:** caricamento = `$0801`, ingresso = il target SYS (in genere `$080D` o l'origine dell'utente).
- **Modalità blocco/esperto con stub BASIC SYS disattivato:** caricamento = origine utente (con il classico fallback `$0801 → $C000`), ingresso = indirizzo di caricamento.
- **Modalità UltimateBasic:** sia il caricamento che l'ingresso provengono dalla mappa del compilatore UB (`build.map.loadAddress`). Lo stub di avvio automatico UB all'interno del payload viene quindi eseguito esattamente come avverrebbe dopo `LOAD "...",8,1 : RUN` dal disco.

L'indirizzo di origine visualizzato nell'output ASM viene mantenuto; il caricatore si limita a copiare l'immagine di memoria piatta dal PRG nella RAM e salta al punto di ingresso una volta che la ROM della cartuccia è stata deallocata.

### Limite di dimensione

Poiché il payload è memorizzato linearmente e `assembleProgramToPrg()` restituisce un buffer `minAddr..maxAddr` piatto con spazi riempiti di zeri, un programma con segmenti ORG ampiamente distanziati (ad esempio `$0801` + `$C000` + `$E000`) conta ogni byte intermedio nel budget di 65 408 byte. Se si supera il limite, la compilazione si interrompe con un errore `saveCrtTooLarge`: è necessario comprimere il layout di memoria o suddividere i dati.

> **⚠️ Avvertenza importante: leggere prima di spedire un CRT**
> 
> Il caricatore chiama il KERNAL **`RESTOR` ($FD15)** come parte della sequenza di reset standard. Questo riscrive intenzionalmente i vettori I/O standard a `$0314/$0315`, `$0316/$0317`, `$0318/$0319`, `$0328/$0329` e simili riportandoli ai loro valori predefiniti della ROM. Conseguenze:
> 
> - **Qualsiasi hook IRQ / NMI / BRK impostato prima dell'avvio del CRT viene cancellato.** Il tuo programma deve installarli da solo dopo l'ingresso, esattamente come un `CARICA "",8,1 : ESEGUI` da nastro/disco.
> - **I programmi UltimateBasic** che si basano su vettori KERNAL non predefiniti attivi all'ingresso potrebbero richiedere una chiamata esplicita `SYS` o init nello stub di avvio automatico. L'avvio automatico UB standard funziona immediatamente; le librerie di estensione che agganciano i vettori *before* `RUN` non lo fanno.
> - **CIA1 / CIA2** vengono reinizializzati da `IOINIT`. Le impostazioni personalizzate del timer (IRQ raster, lettore musicale CIA-A) devono essere riprogrammate dopo l'inserimento.
> - Il carrello è disabilitato da uno stub di 8 byte in **RAM a `$0100`** in modo che `STA $DE00` non possa essere interrotto da un prelievo ROM errato. Non fare affidamento sul fatto che `$0100–$0107` contenga l'immagine in cima allo stack all'ingresso: il primo push in RAM sovrascrive lo stub.
> 
> Se un CRT funziona in VICE ma non sull'hardware reale, la prima cosa da verificare è se il programma presuppone uno specifico vettore KERNAL o uno stato del timer CIA all'avvio. Installa esplicitamente lo stato nella tua routine di inizializzazione e si comporterà allo stesso modo su entrambi.

### Compatibilità

| Piattaforma                     | Stato                                                      |
| ------------------------------- | ---------------------------------------------------------- |
| VICE (`x64sc`, `x64`)           | Funziona tramite **File → Allega immagine cartuccia**.     |
| TheC64 / TheC64 Mini            | Funziona tramite il caricatore di cartucce integrato.      |
| Kung Fu Flash                   | Funziona — modalità nativa di Magic Desk.                  |
| Cartuccia EasyFlash             | Funziona se programmato come Magic Desk.                   |
| 1541 Ultimate II+ / Ultimate 64 | Funziona tramite **Cartuccia → Carica immagine carrello**. |
| Camaleonte / Turbo Camaleonte   | Funziona.                                                  |

---

## 13. Impostazioni hardware

Apri tramite **Impostazioni → Impostazioni hardware…** nel menu della barra degli strumenti. Tutti i percorsi hardware esterni e la configurazione di rete si trovano qui.

### Emulatore VICE

| Collocamento       | Descrizione                                                       |
| ------------------ | ----------------------------------------------------------------- |
| **Seleziona VICE** | Individuare il file eseguibile VICE `x64sc` (o `x64`).            |
| **Stato**          | Indica se il percorso del file eseguibile è valido e accessibile. |

VICE è necessario per **Esegui come PRG**, **Esegui tramite D64** ed **Esporta in D64**.

### Exoizer

| Collocamento                                  | Descrizione                                                                                                                                                                                    |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Seleziona Exoizer**                         | Accedi all'eseguibile `exomizer`.                                                                                                                                                              |
| **Flash del bordo durante la decompressione** | Quando abilitato, i PRG compressi con SFX utilizzano l'effetto flash rapido del bordo `-x1` integrato nell'exomizer; quando disabilitato, viene passato `-n` per la decompressione silenziosa. |
| **Stato**                                     | Indica se il percorso del file eseguibile è valido e accessibile.                                                                                                                              |

**Flusso di lavoro:**
1. Installa il file binario di Exomizer:
   - **Windows:** Scarica il file precompilato `win32/exomizer.exe` da https://bitbucket.org/magli143/exomizer/wiki/Home o da https://csdb.dk/release/?id=244342.
   - **macOS:** `brew install exomizer` (installa la build ufficiale 3.1.2 di Magnus Lind).
2. Configura il percorso in **Impostazioni hardware → sezione Exomizer**.
3. Abilita la casella di controllo **Esegui con Exomizer** nel menu **Impostazioni**.
4. Tutte le azioni **Run** (PRG, D64, hardware) e **Build** (Build PRG, Build D64) ora comprimeranno il programma assemblato tramite `exomizer sfx sys` prima di avviarlo o salvarlo.

Exomizer funziona allo stesso modo su Windows e macOS: la CLI viene richiamata dal backend di Tauri; l'integrazione non presenta alcuna caratteristica specifica per una singola piattaforma.

**Internamente vengono utilizzate due modalità di compressione:**

| Modalità             | Utilizzato da                                                                                | Convenzione di chiamata                                                                                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `sfx sys`            | Compila/Esegui con l'opzione Exomizer attivabile/disattivabile (percorso principale del PRG) | PRG autoestraente con decruncher incorporato; l'impostazione Border-flash controlla `-x1` vs `-n`                                                                                                            |
| `mem` (all'indietro) | Esegui tramite D64 → casella di controllo per file **EXO**                                   | Comprime ogni file aggiuntivo in un flusso in modalità `mem`; il programma lo decomprime in fase di esecuzione tramite la macro **EXODECRUNCH** e un decompressore precompilato (`samples/exo-decrunch.bin`) |

> **Suggerimento:** Se il percorso di Exomizer non è configurato ma la casella di controllo è abilitata, viene visualizzato un messaggio di errore chiaro anziché l'avvio. Disabilitare la casella di controllo per eseguire senza compressione.

> **Test di integrazione:** `test cargo --test exomizer_integration` (in `src-tauri/`) verifica il ciclo completo di compressione e decompressione in modalità memoria su un emulatore 6502.

### Retro Debugger

| Collocamento                | Descrizione                           |
| --------------------------- | ------------------------------------- |
| **Seleziona RetroDebugger** | Passa al file binario `RetroDebugger` |
| **Stato**                   | Indica se il percorso è valido        |

Vedere [Sezione 9](#9-debugger-integration) per la documentazione completa del debugger.

### C64 Ultimate / 1541 Ultimate

Esegui i PRG assemblati direttamente su hardware reale tramite la rete locale utilizzando l'API REST di Ultimate.

| Collocamento            | Descrizione                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| **Host (IP)**           | Indirizzo IP del dispositivo (ad esempio `192.168.1.100`)            |
| **Password**            | Opzionale — se il dispositivo richiede l'autenticazione              |
| **Test di connessione** | Invia una richiesta di test a `/v3/runners/info`; mostra OK o errore |

**Flusso di lavoro:**
1. Collega il 1541 Ultimate / Ultimate 64 alla tua rete locale.
2. Inserisci il suo indirizzo IP (e la password, se impostata) nelle Impostazioni hardware.
3. Seleziona **Esegui su hardware** dal menu di esecuzione diviso.
4. Fai clic su **▶ Esegui**: il PRG viene compilato e inviato al dispositivo tramite HTTP POST a `/v3/runners/prg`. Il dispositivo lo carica ed esegue immediatamente sul C64.

> **Suggerimento:** Non sono necessari cavi USB o driver: l'API REST è integrata nel firmware Ultimate. Il computer e il dispositivo devono trovarsi sulla stessa rete locale.

---

## 14. Editor visivi (Toolkit)

Il menu Toolkit** della barra degli strumenti raggruppa gli editor di dati visivi che condividono tutti un menu File (`File ▾`) comune per Carica BIN / Salva BIN / Esporta in blocchi / Salva su D64. Ogni editor produce dati `.bin` grezzi che possono essere inseriti in un programma con `INCBIN` o aggiunti direttamente a un disco D64 tramite la voce **Salva su D64**.

Le finestre di dialogo dell'editor visuale possono essere trascinate tramite le intestazioni nell'intera area di lavoro di Visual Assembler. Una finestra di dialogo senza posizione salvata si apre centrata; dopo essere stata spostata, la sua ultima posizione viene memorizzata nelle impostazioni dell'interfaccia utente e ripristinata alla successiva apertura.

### Editor ad alta risoluzione/multicolore

Editor di bitmap a livello di pixel con modalità ad alta risoluzione 320×200 e modalità multicolore 160×200. Apribile tramite Toolkit → Editor ad alta risoluzione.

| Caratteristica          | Descrizione                                                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Interruttore modalità   | **Multicolore** La casella di controllo commuta tra alta risoluzione (monocromatico per cella) e multicolore (4 colori per cella). |
| Utensili                | Matita, gomma, linea, rettangolo, rettangolo pieno, ovale, ovale pieno, riempimento a inondazione.                                 |
| Strumento a spruzzo     | Un programma di pittura in stile aerografo che sparge pixel intorno al cursore durante il disegno.                                 |
| Intensità dello spruzzo | Il menu a tendina accanto allo strumento spray controlla la densità di ogni spruzzo.                                               |
| Tavolozza di colori     | Selettori per primo piano (inchiostro) e carta (sfondo). La modalità multicolore traccia automaticamente 3 colori extra per cella. |
| Annulla / Ripeti        | Cronologia per ogni singolo colpo, ctrl-Z / ctrl-Y.                                                                                |
| Griglia + raster        | Griglia 8×8 opzionale e sovrapposizione di righe raster per l'allineamento delle celle.                                            |
| Immagine G              | I file PNG/JPEG/GIF trascinati sull'area di lavoro vengono automaticamente quantizzati alla tavolozza a 16 colori del C64.         |
| Blocchi di esportazione | Aggiunge al programma blocchi BYTE/RAWBYTES contenenti i dati codificati relativi a bitmap, schermo e colore.                      |
| Esporta `.bin`          | Salva il formato multicolore nativo (10000 byte: 8000 bitmap + 1000 schermo + 1000 colore) pronto per LOADFILE a $2000.            |

### Editor di sprite

Editor di sprite da 24×21 pixel con animazione multi-frame. Apri tramite Toolkit → Editor di sprite.

| Caratteristica            | Descrizione                                                                                                                                                                                                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cornici                   | Aggiungi/rimuovi/riordina le cornici; la striscia di cornici è mostrata in basso.                                                                                                                                                                                                     |
| Modalità                  | Interruttore monocromatico/multicolore.                                                                                                                                                                                                                                               |
| Utensili                  | Matita, riempimento, linea, rettangolo, cerchio — più capovolgi orizzontalmente, capovolgi verticalmente, sposta a sinistra/destra/su/giù (con ritorno a capo opzionale). Gli strumenti Forma mostrano un'anteprima in tempo reale durante il trascinamento; rilascia per confermare. |
| Annulla / Ripeti          | Stack completo di annulla/ripristina per ogni fotogramma. Ctrl/Cmd+Z / Ctrl/Cmd+Y o i pulsanti della barra degli strumenti.                                                                                                                                                           |
| Importazione immagini     | Importa un'immagine PNG o JPEG tramite File → Importa immagine. Il programma di importazione associa ogni pixel al colore della tavolozza C64 più vicino e lo scrive nel frame corrente.                                                                                              |
| Anteprima dell'animazione | Riproduzione/Arresto con velocità configurabile.                                                                                                                                                                                                                                      |
| Blocchi di esportazione   | Inserisce un blocco RAWBYTES a un indirizzo allineato a 64 byte per ogni fotogramma, oltre a una configurazione del puntatore sprite.                                                                                                                                                 |
| Salva `.bin`              | Scrive 64 byte per fotogramma (dati sprite grezzi senza riempimento).                                                                                                                                                                                                                 |

### Browser delle ROM dei personaggi del C64 ("Mappa dei caratteri")

Visualizzatore di sola lettura della ROM dei caratteri del C64 (il font PETSCII integrato). Si apre tramite la voce **C64 chargen** nel menu Toolkit. Utile per trovare il codice schermo di un glifo prima di scriverlo con `RAWBYTES` o `TEXT`.

| Caratteristica        | Descrizione                                                                                                                                                                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Due set di caratteri  | Scheda 1: **Set 1 — Superiore/Grafica** (modalità predefinita dopo l'accensione). Scheda 2: **Set 2 — Inferiore/Superiore** (dopo lo switch `$0E`).                                                                                                   |
| Griglia di glifi      | Griglia 16×16 di tutti i 256 caratteri. Clicca su un glifo per visualizzare il pannello dei dettagli: vista ingrandita 8×8 pixel, codice schermo (decimale + esadecimale), codici PETSCII (sia predefiniti che traslati) e la bitmap grezza a 8 byte. |
| Pannello di dettaglio | Mostra il codice schermo del glifo selezionato, i codici PETSCII e gli otto byte grezzi, pronti per essere incollati in un blocco `RAWBYTES` o BYTE.                                                                                                  |
| Sola lettura          | Qui non è possibile apportare modifiche: per modificare i glifi, utilizza l'Editor di caratteri (qui sotto).                                                                                                                                          |

### Editor dei personaggi (Charset)

Editor di caratteri 8×8 con supporto per 256 caratteri. Apribile tramite Toolkit → Editor di caratteri.

| Caratteristica            | Descrizione                                                                                                                                                                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Carica la ROM             | Importa il charset della ROM C64 direttamente da `chargen` di VICE (senza selettore di file).                                                                                                                                      |
| Carica `.bin`             | Importa un file binario esterno con set di caratteri da 2048 byte.                                                                                                                                                                 |
| Anteprima per carattere   | Griglia di 16 caselle con tutti i 256 glifi, con la cella corrente evidenziata.                                                                                                                                                    |
| Editor Pixel              | Editor di caratteri singoli 8×8 con strumenti di attivazione/inversione/cancellazione.                                                                                                                                             |
| Colore per carattere      | Memorizza un valore predefinito di RAM per il colore di ciascun glifo. In modalità caratteri multicolore, conserva anche il bit di abilitazione multicolore per cella e il colore a 3 bit inferiori del carattere stesso.          |
| Metadati andata e ritorno | Quando si caricano dati compatibili dai flussi di lavoro Charset Canvas/Map, i metadati relativi al colore di ciascun carattere vengono conservati, in modo che le modifiche possano continuare senza perdere l'intento cromatico. |
| Blocchi di esportazione   | Aggiunge RAWBYTES a $0800 (blocco 2) o $3800 (blocco 7) con il set di caratteri codificato.                                                                                                                                        |

### Editor di tela Charset

Strumento di creazione di schermate a schermo intero a partire da un set completo di 256 caratteri. Apribile tramite Toolkit → Charset Canvas.

La tela è composta da 16×16 caratteri. In modalità monocromatica, ciò corrisponde a un'area di lavoro di 128×128 pixel; in modalità caratteri multicolore, l'area di lavoro diventa di 64×128 pixel, utilizzando le reali regole di stampa multicolore dei caratteri del C64.

| Caratteristica                        | Descrizione                                                                                                                                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Monocromatico/multicolore             | La modalità monocromatica memorizza glifi 8×8 a 1 bit. La modalità multicolore memorizza coppie di pixel orizzontali a due bit e contrassegna le celle utilizzate con il bit 3 della RAM Colore.  |
| Modello a colori C64                  | Lo sfondo utilizza `$D021`; il multicolore condiviso 1 utilizza `$D022`; il multicolore condiviso 2 utilizza `$D023`; il colore di ciascun personaggio proviene dai bit 0-2 della RAM dei colori. |
| Strumenti di disegno                  | Matita, gomma, linea, rettangolo, ovale e riempimento a inondazione funzionano anche oltre i contorni dei caratteri.                                                                              |
| Strumento a spruzzo                   | Disegno in stile aerografo che sparge pixel sulle celle/caratteri adiacenti.                                                                                                                      |
| Intensità dello spruzzo               | Il menu a tendina accanto allo strumento spruzzo permette di impostare la densità del tratto.                                                                                                     |
| Attiva/disattiva griglia              | La casella di controllo Griglia mostra o nasconde la griglia di caratteri 16×16.                                                                                                                  |
| Salva charset `.bin`                  | Salva i dati della bitmap dei caratteri da 2048 byte.                                                                                                                                             |
| Salva mappa 16×16 + RAM colore `.bin` | Salva 256 codici schermo seguiti da 256 valori RAM colore. Utilizzare con `MAP_COPY16X16`.                                                                                                        |
| Caricamento                           | Può caricare salvataggi charset-canvas, dati charset semplici e dati charset compatibili dell'editor di personaggi, inclusi i colori per singolo personaggio memorizzati, se presenti.            |

**Importante limitazione del C64:** nella modalità caratteri multicolore i due colori condivisi sono globali per l'intero schermo (`$D022` / `$D023`). Solo il colore del carattere è per cella ed è limitato ai colori 0-7 perché il bit 3 della RAM dei colori seleziona la modalità multicolore.

### Editor di mappe (mappe a tessere multilivello)

Editor di tilemap a livelli per scenari statici, mappe di generazione sprite, dati di collisione e simili. Apribile tramite Toolkit → Editor di mappe.

| Caratteristica                                               | Descrizione                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Strati                                                       | Diversi livelli denominati, ognuno con il proprio set di tessere e opacità.                                                                                                                                                                                                                                                     |
| Spazzole                                                     | Modalità a piastrella singola, riempimento, linea, rettangolo e cerchio. Gli strumenti Forma mostrano un'anteprima in tempo reale durante il trascinamento; rilascia per confermare.                                                                                                                                            |
| Annulla / Ripeti                                             | Funzione completa di annulla/ripristina per ogni livello. Ctrl/Cmd+Z / Ctrl/Cmd+Y o i pulsanti della barra degli strumenti.                                                                                                                                                                                                     |
| Cancella menu                                                | Cancellazione per singolo strato o dell'intera mappa con conferma.                                                                                                                                                                                                                                                              |
| Importazione immagini                                        | Trascina un file PNG di una mappa a tessere; l'editor la suddividerà automaticamente in tessere.                                                                                                                                                                                                                                |
| Copia/incolla                                                | Copia una porzione di piastrella selezionata, quindi incollala normalmente oppure usa la funzione incolla trasparente per mantenere trasparenti le piastrelle vuote.                                                                                                                                                            |
| Colorazione delle piastrelle con sensibilità ai colori       | Con metadati charset compatibili, il disegno utilizza le impostazioni predefinite della RAM dei colori memorizzate nella tile (inclusa la codifica relativa ai colori multipli) anziché un colore piatto generico.                                                                                                              |
| Colori personalizzati dei caratteri                          | Quando un charset contiene metadati `charColors`, l'editor di mappe utilizza il valore predefinito di Color RAM della tessera selezionata durante la fase di disegno.                                                                                                                                                           |
| Blocchi di esportazione                                      | Emette blocchi RAWBYTES per la grafica dei tileset e i dati della mappa.                                                                                                                                                                                                                                                        |
| Salvataggio della RAM dello schermo (.bin)…                  | Salva solo i codici schermo per il livello mappa corrente (40×25 = 1000 byte).                                                                                                                                                                                                                                                  |
| Salvataggio della RAM dello schermo + RAM dei colori (.bin)… | Salva i codici dello schermo concatenati con i valori della RAM del colore come un singolo file da 2000 byte (`schermo[0..999]` seguito da `colore[0..999]`). Utilizzare questo con la macro **MAP_COPY** (modalità .bin combinata) per ripristinare sia lo schermo che il colore in un'unica operazione in fase di esecuzione. |

### Editor SID (Tracker a 3 voci)

Tracker multi-strumento a 3 voci con motore di anteprima Web Audio. Apribile tramite Toolkit → Editor SID.

**Comandi per strumento:**
- Caselle di controllo della forma d'onda (TRI / SAW / PUL / NOI): è possibile combinare più forme d'onda tramite l'operatore OR.
- ADSR (attacco/decadimento/sostenimento/rilascio) mostrato come un grafico a trascinamento sopra i quattro cursori.
- Cursore per la larghezza dell'impulso (0-4095) con flag di squillo/sincronizzazione opzionali.
- Casella di controllo per il routing del filtro per ciascuna voce; filtro globale con frequenza di taglio, risonanza, volume e modalità (passa-basso/passa-alto).

** Griglia di tracciamento:**
- 3 voci × fino a 7 pattern × 32 righe = 7 × 32 = 224 righe massime (il contatore di righe a 8 bit ne limita il numero).
- Per riga: nota + indice dello strumento. Le righe vuote contengono la nota precedente.
- Seleziona una cella normalmente oppure tieni premuto **Maiusc** mentre fai clic o usi i tasti freccia per estendere una selezione rettangolare su più righe e su una qualsiasi delle tre voci. Facendo clic con il pulsante destro del mouse all'interno dell'area selezionata, l'intervallo rimane invariato.
- Le funzioni Copia, Taglia, Incolla e Cancella sono disponibili dalla barra degli strumenti delle icone e dal menu contestuale basato sulle icone. `Ctrl/Cmd+C` e `Ctrl/Cmd+V` operano sulla stessa selezione rettangolare.
- Strumento per l'armonia: scegli una nota fondamentale, un tipo di accordo e un'ottava, ascolta in anteprima l'accordo con lo strumento corrente, quindi inserisci la disposizione delle voci direttamente nel tracker. I tipi disponibili includono Maggiore, Minore, Diminuito, Aumentato, Sus2, Sus4, Dominante 7, Maggiore 7, Minore 7, 6, Minore 6, 9, b9, #9, Dim7 e 7sus4.
- Strumento per arpeggi: visualizza in anteprima o inserisci sequenze di note di 4, 8 o 16 intervalli a partire dall'accordo selezionato, in direzione ascendente, discendente o ascendente/discendente.
- **Anteprima riga** ascolta la riga selezionata su tutte e tre le voci senza avviare la riproduzione del pattern.
- L'incolla di intervalli di celle ora inizia dalla cella iniziale dell'intervallo selezionato e termina in modo pulito ai limiti di riga e di voce, invece di andare a capo nella colonna o riga successiva.
- Il cursore della velocità imposta il divisore del tick IRQ (fotogrammi tra le righe).

**Riproduzione e tastiera virtuale:**
- Il pulsante Riproduci nella barra degli strumenti cambia in Pausa durante la riproduzione e in Riprendi quando è in pausa; Interrompi termina la riproduzione e ripristina lo stato.
- Il pulsante nella barra degli strumenti della tastiera apre una finestra di dialogo non modale per la selezione del pianoforte, che rimane utilizzabile anche mentre l'editor SID è attivo. Trascina la sua intestazione per posizionarla in qualsiasi punto sopra l'applicazione principale.
- Abilita **Inserisci nel tracker** per scrivere ogni nota suonata nella posizione corrente del cursore del tracker e passare alla riga successiva. Disabilitalo per ascoltare le note senza modificarle.
- Le anteprime di accordi e arpeggi illuminano i tasti corrispondenti del pianoforte quando la tastiera è aperta.

**Esportazioni del menu File:**
| Esportare                          | Cosa fa                                                                                                                                                                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Salva .bin…`                      | Scrive nel formato serializzato nativo dell'editor (strumenti + pattern + sequenza).                                                                                                                                                       |
| `Esportazione blocchi (solo dati)` | Aggiunge la tabella degli strumenti + i blocchi di pattern al programma in `* = $C000`.                                                                                                                                                    |
| `Esporta blocchi + minigiocatore`  | Aggiunge il lettore completo (sid_init / sid_irq / sid_play_row / sid_set_voice) più le tabelle di frequenza PAL. Dopo l'esportazione, inserisci un `JSR sid_init` nel tuo codice principale nel punto in cui dovrebbe iniziare la musica. |
| `Esporta asm (appunti)`            | Copia l'intero codice sorgente dell'assembly negli appunti.                                                                                                                                                                                |

**Utilizzo ZP del giocatore:** `$FB` (contatore tick), `$FC` (indice di riga), `$FD` (temp set_voice). Questi sono in conflitto se il codice principale li utilizza: riposizionarli tramite la modalità esperto se necessario.

**Limiti noti:**
- Elenco di pattern lineari singoli (non è ancora disponibile una tabella di sequenze per voce).
- Il contatore di righe a 8 bit ha un limite di 7 pattern × 32 righe.
- Il volume globale del C64 `$D418` è condiviso tra le voci: il cursore del volume per strumento è informativo; il livello di sustain (`S` di ADSR) è il volume effettivo per voce.
- L'anteprima audio sul web è approssimativa: la modulazione PWM, la sincronizzazione/ring e le caratteristiche del filtro SID differiscono dal chip reale.

---

### Editor di curve

Genera tabelle di ricerca `.byte` pronte all'uso da curve matematiche: seno, interpolazioni, triangolari/a dente di sega/quadrate e di rimbalzo. Ideale per il movimento degli sprite, effetti raster, cicli di colore o qualsiasi animazione guidata da una tabella precalcolata. Apri tramite l'icona **Editor di curve** nella barra degli strumenti superiore (accanto al pulsante Editor SID).

**Curve:** Seno, Coseno, Lineare, Entrata/Uscita/Entrata/Uscita (Quadrica e Cubica), Entrata/Uscita (Circolare), Triangolo, Dente di sega, Quadrato e Rimbalzo Entrata/Uscita/Entrata/Uscita.

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

Ogni output di copia/inserimento inizia con un commento di intestazione che documenta la curva, l'intervallo minimo/massimo effettivo, il conteggio delle voci e l'utilizzo esatto (quale registro alimenta ciascuna tabella).

**Anteprima:**
- **Grafico** — la curva tracciata con valore 0 in **alto** e massimo in **basso**, corrispondente alla convenzione sprite-Y / raster del C64 (quindi ciò che vedi è ciò che la tabella pilota sull'hardware). Una riga meta sotto il grafico mostra il conteggio dei byte, il valore minimo/massimo effettivo dei valori generati e il nome/i della curva.
- **Palla rimbalzante** — anima un marcatore attraverso la tabella al **Tempo** (5–240 valori/sec). Al tempo 50 questo equivale a un valore per fotogramma su PAL (50 Hz), ovvero un `.wait_raster` passo per indice. Pulsanti Riproduci/Pausa e Riavvia, una scia di dissolvenza delle ultime ~24 posizioni e una lettura `Indice · Valore` in tempo reale.

**Copia / Inserisci:** le due icone della barra degli strumenti — **Copia** inserisce la tabella negli appunti; **Inserisci nell'editor** aggiunge la tabella (e il lettore, se abilitato) come blocchi al programma corrente. Reinserire **sostituisce** l'inserimento precedente dell'Editor di curve invece di sovrapporre i duplicati (funziona in modalità Blocco ed Esperto).

**Menu file:**
| Azione                         | Cosa fa                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Salva la curva (.bin)...**   | Salva i byte della tabella grezza esattamente come li leggerebbe il C64 tramite `INCBIN`. 16 bit: N byte lo seguiti da N byte hi.                                                                                                                                                                                                                                                                                                                               |
| **Curva di carico (.bin)…**    | Carica i byte grezzi della tabella nell'editor, interpretati in base alla profondità di bit corrente (16 bit: prima metà a basso bit, seconda metà ad alto bit). La tabella caricata viene visualizzata così com'è finché un qualsiasi controllo di curva non rigenera una nuova curva.                                                                                                                                                                         |
| **Esporta la demo in blocchi** | Aggiunge una demo completa e funzionante di sprite: inizializzazione dello sprite, ciclo principale sincronizzato con il raster, la tabella incorporata e i dati dello sprite della palla. L'asse X si muove da 0 a 320 in virgola fissa 8.8 con il bit più significativo `$D010` mentre la tabella controlla l'asse Y dello sprite, esattamente come nell'anteprima dell'editor. La riesportazione sostituisce il precedente inserimento nell'editor di curve. |

**Corrispondendo all'anteprima sul C64:** l'anteprima legge la tabella **linearmente, eseguendo un ciclo 0 → N-1 → 0, un valore per frame**. Per riprodurla esattamente, pilotare la tabella nello stesso modo (incrementare l'indice una volta per frame, tornare alla lunghezza della tabella). Una riproduzione ping-pong o a intervallo parziale si muoverà in modo diverso anche se i valori dei byte sono identici. Vedere `samples/curve-new-demo.asm` per un esempio funzionante di sprite-X a 16 bit.

---


*© 2026 Zsolt Tarczali — Assemblatore visivo C64*
