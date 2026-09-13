# C64 Visual Assembler — Podręcznik użytkownika

**Wersja 2.4.0**

Wizualny, blokowy assembler 6502 dla Commodore 64. Twórz programy, przeciągając i upuszczając bloki instrukcji, i oglądaj generowany kod assemblera i maszynowy w czasie rzeczywistym.

---

## Spis treści

- [C64 Visual Assembler — Podręcznik użytkownika](#c64-visual-assembler--user-manual)
    - [Najważniejsze cechy wersji 2.4.0](#version-240-highlights)
    - [Najważniejsze cechy wersji 2.3.9](#version-239-highlights)
    - [Najważniejsze cechy wersji 2.3.8](#version-238-highlights)
  - [Spis treści](#table-of-contents)
  - [1. Przegląd interfejsu](#1-interface-overview)
  - [2. Paleta bloków](#2-block-palette)
  - [3. Obszar programu](#3-program-area)
    - [Wejście operandu](#operand-input)
  - [4. Widok ASM](#4-asm-view)
    - [Tryby wyjściowe](#output-modes)
    - [Karta Zestaw narzędzi](#toolkit-tab)
    - [Karta Opcje](#options-tab)
    - [Kliknięcie wiersza ASM](#clicking-an-asm-line)
    - [Numery wierszy ASM](#asm-line-numbers)
    - [Modalne okno postępu kompilacji](#compile-progress-modal)
  - [5. Ustawienia i pasek narzędzi](#5-settings--toolbar)
    - [Załaduj plik .asm (szybkie odniesienie)](#load-asm-file-quick-reference)
      - [Importuj notatki dotyczące analizy i najlepsze praktyki](#import-parsing-notes-and-best-practices)
  - [Tryb Ultimate Basic](#ultimatebasic-mode)
    - [Otwieranie edytora UB](#opening-the-ub-editor)
    - [Narzędzia edytora](#editor-tools)
    - [Projekty, zakładki i pliki startowe](#projects-tabs-and-startup-files)
    - [Budowa i diagnostyka](#building-and-diagnostics)
    - [Uruchomienie, D64 i Exomizer](#running-d64-and-exomizer)
    - [Symbole debugera i deasemblacja](#debugger-symbols-and-disassembly)
    - [Podręcznik i źródło Ultimate Basic](#ultimate-basic-manual-and-source)
  - [6. Tryb ekspercki](#6-expert-mode)
    - [Przełączanie trybów](#switching-modes)
    - [Układ edytora](#editor-layout)
    - [Przyciski paska narzędzi](#toolbar-buttons)
    - [Podświetlanie błędu](#error-highlighting)
    - [Podświetlenie składni](#syntax-highlight)
    - [Formater źródła](#source-formatter)
    - [Panel projektu \&amp; zakładki](#project-panel--tabs)
    - [Pasek kart](#tab-bar)
  - [7. Tryby adresowania](#7-addressing-modes)
    - [Oznacz wyrażenia jako operandy](#label-expressions-as-operands)
    - [Licznik programu `*` w wyrażeniach](#the--program-counter-in-expressions)
    - [Lokalne etykiety (kropkowane)](#local-dotted-labels)
    - [Etykiety operandów kodu samomodyfikującego](#self-modifying-code-operand-labels)
  - [8. Standardowe instrukcje 6502](#8-standard-6502-instructions)
    - [Przenoszenie danych](#data-movement)
    - [Arytmetyka](#arithmetic)
    - [Logika](#logic)
    - [Skoki i gałęzie](#jumps--branches)
    - [LBNE / LBEQ / … (Długie gałęzie)](#lbne--lbeq---long-branches)
    - [Operacje rejestru](#register-operations)
    - [Przesunięcie i obrót](#shift--rotate)
    - [Stos](#stack)
    - [System / Flagi](#system--flags)
    - [Nielegalne/nieudokumentowane instrukcje](#illegal--undocumented-instructions)
  - [9. Bloki makro — odniesienie](#9-macro-blocks--reference)
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
      - [MAKRO (początek definicji)](#macro-definition-start)
      - [ENDM (koniec definicji)](#endm-definition-end)
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
    - [Czas wykonania JEŻELI / W PRZECIWNYM RAZIE / ENDIF](#runtime-if--else--endif)
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
  - [10. Integracja debugera](#10-debugger-integration)
    - [RetroDebugger](#retrodebugger)
    - [Bloki punktów przerwania](#breakpoint-blocks)
    - [Flagi debugera (zakładka Opcje)](#debugger-flags-options-tab)
  - [11. Linki do bazy wiedzy](#11-knowledge-base-links)
  - [12. Eksport D64 i uruchomienie](#12-d64-export--run)
    - [Przycisk Podziel bieg](#split-run-button)
    - [Eksportuj do okna dialogowego D64](#export-to-d64-dialog)
    - [Metadane D64 w projektach](#d64-metadata-in-projects)
  - [12b. Eksport CRT (wkład Magic Desk 64K)](#12b-crt-export-magic-desk-64k-cartridge)
  - [13. Ustawienia sprzętowe](#13-hardware-settings)
    - [Emulator VICE](#vice-emulator)
    - [Exomizer](#exomizer)
    - [Retro Debugger](#retro-debugger)
    - [C64 Ultimate / 1541 Ultimate](#c64-ultimate--1541-ultimate)
  - [14. Edytory wizualne (zestaw narzędzi)](#14-visual-editors-toolkit)
    - [Edytor wysokiej rozdzielczości / wielokolorowy](#hi-res--multicolor-editor)
    - [Edytor sprite'ów](#sprite-editor)
    - [Przeglądarka ROM-u znaków C64 („Mapa znaków”)](#c64-character-rom-browser-char-map)
    - [Edytor znaków (zestaw znaków)](#character-editor-charset)
    - [Edytor kanwy znaków](#charset-canvas-editor)
    - [Edytor map (mapy kafelkowe wielowarstwowe)](#map-editor-multilayer-tilemaps)
    - [Edytor SID (śledzenie 3-głosowe)](#sid-editor-3-voice-tracker)
    - [Edytor krzywych](#curve-editor)

---

## Najważniejsze cechy wersji 2.4.0

- **Edytor D64** — pełna przeglądarka obrazów dysków na pasku narzędzi (po Edytorze Krzywych). Otwórz istniejący plik `.d64`, utwórz nowy, pusty lub uruchom bieżący dysk bezpośrednio w programie VICE – wszystko z menu Pliki ▾, podobnie jak w innych edytorach wizualnych. Zobacz [Edytor D64 (przeglądanie i edycja istniejącego obrazu dysku)](#d64-editor-browse--edit-an-existing-disk-image).
- **Dodaj/wyodrębnij/zmień nazwę/usuń w edytorze D64** — dodaj plik lokalny do katalogu na dysku, wyodrębnij wybrany wpis z powrotem do `.prg`, zmień nazwę wpisu w tabeli lub usuń go — każda akcja jest stosowana bezpośrednio do pliku `.d64` za pośrednictwem `c1541`, bez oddzielnego kroku zapisu.
- **Adres ładowania, adres dekompresji i Exomizer w edytorze D64** — dodanie pliku RAW bez nagłówka pozwala ustawić opcjonalny adres ładowania, cel dekompresji Exomizera i skompresować go w trakcie przesyłania, używając tych samych trybów kompresji `mem`/`sfx`, co pliki dodatkowe w oknie dialogowym Eksport do D64. Plik `.prg`, który zawiera już własny nagłówek, całkowicie pomija te pola.
- **Selektor typu wpisu dysku** — wybierz PRG / SEQ / USR / REL dla nowo dodanego pliku zamiast zawsze zapisywać go jako PRG.
- **Autentyczna lista katalogów** — lista plików edytora D64 jest renderowana w dołączonej czcionce C64 Pro, wielkimi literami, co zapewnia klasyczny wygląd `LOAD"$",8`.
- **Naprawiono:** Zmiana nazwy wpisu w edytorze D64 nie powoduje już odrzucenia edycji po kliknięciu w polu tekstowym.
- **Ulepszono:** odznaka wskaźnika trybu motywu jasnego na pasku narzędzi (TRYB BLOKOWY / TRYB EKSPERCKI / …) jest ciemniejsza i bardziej czytelna, a jej migocząca animacja jest ponownie widoczna.

---

## Najważniejsze cechy wersji 2.3.9

Pięć funkcji poprawiających jakość pracy asemblera, z których wszystkie można wykorzystać w trybie tekstowym w trybie eksperckim oraz (jeśli ma to sens) jako bloki. Każda z nich ma swoją własną sekcję referencyjną poniżej:

- **`*` w dowolnym wyrażeniu** — symbol licznika programów działa teraz wewnątrz wyrażeń operandów, a nie tylko samodzielnie: `BNE *-5`, `JMP *+20`, `LDA #&lt;*`, `LDA #&gt;(*+63)`. `*` następujący po wartości (`STRIDE*2`) to nadal mnożenie. Zobacz [Tryby adresowania → Licznik programów `*` w wyrażeniach](#the--program-counter-in-expressions).
- **Lokalne etykiety (kropkowane)** — etykieta taka jak `.loop` należy do zakresu najbliższej poprzedzającej ją etykiety globalnej *(niekropkowanej), więc `DrawSprite` i `ClearScreen` mogą definiować własne etykiety `.loop` bez kolizji. Zobacz [Lokalne etykiety (kropkowane)](#local-dotted-labels).
- **Pseudooperacje z długimi gałęziami** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`, `LBMI`, `LBPL`, `LBVC`, `LBVS` asemblacja do odwróconej gałęzi przez `JMP` (zawsze 5 bajtów), dzięki czemu cel może znajdować się w dowolnej odległości. Nowa kategoria palety **Długie gałęzie**. Zobacz [LBNE / LBEQ / … (Długie gałęzie)](#lbne--lbeq---long-branches).
- Dyrektywa **`.assert` ** — `.assert end - start &lt;= 256` lub `.assert * &lt; $A000, „message” ` jest oceniane w czasie montażu i kończy kompilację niepowodzeniem (pokazując rzeczywistą wartość), gdy wyrażenie jest fałszywe. Zobacz [.ASSERT](#assert).
- **Etykiety operandów kodu samomodyfikującego** — `Wartość LDA:#$00` definiuje etykietę `wartość` wskazującą na bajt operandu instrukcji, więc `Wartość STA` łata ją bezpośrednio. Zobacz [Etykiety operandów kodu samomodyfikującego](#self-modifying-code-operand-labels).
- **Przyjaźniejsze błędy gałęzi poza zakresem** — gałąź, która ląduje poza zakresem −128…+127, teraz dokładnie raportuje, o ile wykracza poza zakres i sugeruje pasującą `LBxx` długą gałąź.

---

## Najważniejsze cechy wersji 2.3.8

- **Zapisywanie/otwieranie obszaru roboczego: ** zapisuje dokładny zestaw otwartych kart z kopią zapasową pliku — w tym aktywną kartę i tryb edytora każdej karty — w pliku obszaru roboczego `.vaws`. Obszary robocze zapisują się automatycznie po zmianie, a aplikacja automatycznie przywraca ostatni obszar roboczy po uruchomieniu.
- **Przełączanie globalnego panelu pamięci:** wyświetlanie lub ukrywanie całego panelu pamięci C64 za pomocą dedykowanego przełącznika interfejsu użytkownika.
- **Zlokalizowane odniesienie do poleceń Ultimate Basic: ** opisy poleceń w okienku autouzupełniania i panelu Polecenia są teraz zgodne z bieżącym językiem interfejsu użytkownika (węgierskim, angielskim, hiszpańskim, niemieckim, holenderskim) z opcją zastępczą w języku angielskim.
- **Odświeżona dokumentacja graficzna Ultimate Basic:** `PIÓRO KOLOROWE` oraz tekst pomocy dla poleceń wykresu/linii/prostokąta/koła i rysowania wielokolorowego są teraz zgodne z bieżącym zachowaniem kompilatora.
- **Naprawiono odniesienie do KERNAL:** poprawiono wpisy `SETLFS` i `PLOT` (adresy i konwencje wywołań) w tabeli adresów KERNAL w deasemblerze.
- **Naprawiono zużycie pamięci przy wielu otwartych kartach:** Historia cofania/ponawiania dla każdej karty jest teraz ograniczona (z niewielkim opóźnieniem), co zapobiega nieograniczonemu wzrostowi pamięci, który dawniej powodowała długa sesja z wieloma otwartymi dokumentami.
- **Porządkowanie paska narzędzi edytora:** usunięto zbędne przyciski przełączania punktów przerwania z pasków narzędzi Expert i Ultimate Basic (punkty przerwania są nadal ustawiane z poziomu paska numerów wierszy) i wyrównano wysokość paska narzędzi Expert z wysokością paska narzędzi Ultimate Basic.

---

## 1. Przegląd interfejsu

Aplikacja jest podzielona na trzy główne panele:

| Płyta                 | Opis                                                                                |
| --------------------- | ----------------------------------------------------------------------------------- |
| **Lewo — Paleta**     | Wszystkie dostępne instrukcje i bloki makr. Szukaj lub przeglądaj według kategorii. |
| **Centrum — Program** | Twój program. Przeciągnij bloki tutaj, zmień ich kolejność, edytuj operandy.        |
| **Prawy — Wyjście**   | Podgląd na żywo ASM i/lub wyjście monitora pamięci.                                 |

Etykieta trybu po prawej stronie nagłówka identyfikuje aktywny edytor **Block**, **Expert** lub **Ultimate Basic**. Jest ona aktualizowana natychmiast po zmianie trybu edycji.

---

## 2. Paleta blokowa

Paleta po lewej stronie zawiera listę wszystkich dostępnych bloków pogrupowanych według kategorii:

- **Przemieszczanie danych** — LDA, LDX, STA, STX, …
- **Arytmetyka** — ADC, SBC, INC, DEC, CMP, …
- **Logika** — AND, ORA, EOR, BIT
- **Skoki i gałęzie** — JMP, JSR, RTS, BNE, BEQ, …
- **Długie gałęzie** — LBNE, LBEQ, LBCC, LBCS, LBMI, LBPL, LBVC, LBVS (gałęzie na dowolną odległość; patrz §8)
- **Operacje rejestrowe** — TAX, TAY, INX, DEX, …
- **Przesunięcie i obrót** — ASL, LSR, ROL, ROR
- **Stos** — PHA, PHP, PLA, PLP
- **System** — CLC, SEC, NOP, BRK, …
- **Nielegalne instrukcje** — LAX, SAX, DCP, …
- **Structure** — LABEL, COMMENT, REGION, ENDREGION
- **Macros** — LOOP, NEXT, FOR, ENDF, PUSH, PULL, END, TEXT, BYTE, WORD, FILL, ALIGN, ASSERT, STRING, DATA, RAWBYTES, RAWTEXT, PETSCII, CHARSET, INCBIN, SID, INCLUDE, TABLE, ORG, MACRO, ENDM, INVOKE, IF, ELSE, ENDIF, VAR, WHILE, ENDW, REPEAT, UNTIL, MEMCPY, MEMSET, PRINT, PRINT_CHAR, PRINT_HEX, CLEAR_SCREEN, WAIT_KEY, DELAY, SET_BORDER, SET_BG, IRQ_SETUP, RAND, SPRITE_INIT, SPRITE_POS, WAIT_RASTER, JOYSTICK, MOUSE, SPRITE_COL, LOADFILE, REU_CHECK, REU_STASH, REU_FETCH, REU_SWAP, TURBO_SET, SUPERCPU_DETECT, TURBO_ENABLE, MAP_COPY, MAP_COPY16X16, SPRITE_ANIM, SCORE_BCD

Użyj pola wyszukiwania **** u góry palety, aby filtrować według nazwy. Kliknij przycisk **Dodaj wybrany blok** lub przeciągnij blok do obszaru programu.

---

## 3. Obszar programu

- **Przeciągnij i upuść** bloki z palety lub **zmień kolejność** istniejących bloków, przeciągając ich uchwyt (≡).
- Każdy blok pokazuje swój **mnemonik**, **pole operandu** i **selektor trybu adresowania** (jeśli ma to zastosowanie).
- Kliknij przełącznik **▸ / ▾**, aby zwinąć lub rozwinąć blok.
- Aby usunąć blok, naciśnij przycisk **× (usuń)**.
- Przycisk **Zwiń wszystko** powoduje zwinięcie wszystkich bloków na raz.

### Minimapa panelu bloku

W panelu Program znajduje się przełączany przycisk **minimapy** w nagłówku. Po włączeniu tej opcji na prawej krawędzi panelu pojawia się wąski pasek płótna `o szerokości 56 pikseli`, przedstawiający wszystkie bloki w postaci poziomych pasków oznaczonych kolorami:

| Kolor paska         | Typ bloku                |
| ------------------- | ------------------------ |
| Cyjan               | Etykiety                 |
| Niebieski/fioletowy | Makra i dyrektywy        |
| Żółty               | Instrukcje               |
| Zielony             | Komentarze i puste linie |
| Czerwony            | Bloki z błędem walidacji |

Zwinięte bloki są renderowane z mniejszą przezroczystością. Kliknij lub przeciągnij w dowolne miejsce minimapy, aby przewinąć listę programów do tej pozycji. Wskaźnik widoku (prostokąt w kolorze akcentującym) śledzi widoczną część listy. Stan jest zapisany w ustawieniach interfejsu użytkownika (klawisz `blockMinimap`).

### Wejście operandu

- W przypadku instrukcji rozgałęzienia/skoku (`BNE`, `JMP`, `JSR` itd.) pojawia się rozwijana lista wyboru etykiet **** — kliknij zdefiniowaną etykietę, aby ją wstawić.
- Format liczb jest zgodny z przełącznikiem **HEX / DEC** na pasku narzędzi (patrz sekcja 5).

---

## 4. Widok ASM

Prawy panel pokazuje wygenerowany wynik w czasie rzeczywistym.

### Tryby wyjściowe

| Tryb                | Opis                                                                                                                                                                                                                                                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ASM**             | Źródło montażu 6502 z adresami i etykietami                                                                                                                                                                                                                                                                           |
| **Monitor**         | Zrzut szesnastkowy/bajtowy (w stylu monitora C64)                                                                                                                                                                                                                                                                     |
| **Dyzasm**          | Czysty deasembler 6502: adres · bajty szesnastkowe · mnemoniki z rozwiązanymi operandami numerycznymi. Makra są rozwijane do pojedynczych instrukcji (TEKST → pary LDA/STA, PĘTLA → LDX itd.). Dane BAJT/SŁOWO/WYPEŁNIENIE prezentowane jako zrzut szesnastkowy. Brak nazw makr, komentarzy ani adnotacji w wynikach. |
| **Oba**             | ASM na górze, monitor poniżej                                                                                                                                                                                                                                                                                         |
| **Dezasembler**     | Tak samo jak w Disasm — dedykowana zakładka do widoku demontażu                                                                                                                                                                                                                                                       |
| **Zestaw narzędzi** | Panel referencyjny C64: próbnik palety 16 kolorów + kod sterujący PETSCII i ściągawka ze znakami do druku. Tylko do odczytu — szczegóły w podsekcji „Zestaw narzędzi” poniżej.                                                                                                                                        |
| **Opcje**           | Panel ustawień programu — format liczb, przełączanie źródła makra, parametry debugera                                                                                                                                                                                                                                 |

### Karta Zestaw narzędzi

Karta **Zestaw narzędzi ** w widoku ASM to panel szybkiego dostępu tylko do odczytu — nigdy nie modyfikuje programu. Dwie sekcje:

| Sekcja                     | Treść                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Paleta kolorów C64**     | Siatka 16 próbek pokazująca każdy kolor C64 wraz z indeksem (0–15 / `$00`–`$0F`) i nazwą. Kliknij próbkę, aby skopiować jej indeks szesnastkowy do schowka. Najedź kursorem, aby wyświetlić nazwę koloru (jasnoniebieski, brązowy itd.).                                                                                                                                                                                                           |
| **Kody sterujące PETSCII** | Wspólne kody sterujące dla `CHROUT` ($FFD2): kody zmiany koloru (`$05` biały, `$1C` czerwony, `$1E` zielony, `$1F` niebieski, …), ruch kursora (`$11`/`$1D`/`$91`/`$9D`), włączanie/wyłączanie odwrotne (`$12`/`$92`), `$93` czysty ekran, Przełączniki zestawów znaków `$8E`/`$0E`. A także ściągawka z zakresem do druku (interpunkcja 32-64, A-Z 65-90, nawiasy 91-95, grafika 96-127, grafika przesunięta 160-191, odbicie lustrzane 192-223). |

Toolkit to najszybszy sposób na wyszukanie indeksu koloru lub bajtu kontrolnego PETSCII bez opuszczania edytora.

### Karta Opcje

Karta **Opcje** zawiera ustawienia wpływające na generowanie kodu i wyświetlanie wyników:

- **Źródło makra** — gdy włączone, bloki definicji makra (MACRO…ENDM) wyświetlają swój kod źródłowy w widoku ASM.
- **Adres początkowy programu** — teraz ustawiany za pomocą bloku **ORG** w obszarze programu, a nie osobnego pola wprowadzania. Pierwszy blok ORG definiuje adres ładowania programu; kolejne bloki ORG rozpoczynają dodatkowe sekcje pod różnymi adresami.
- **Parametry debugera** — trzy wbudowane przełączniki kontrolujące, które flagi są przekazywane do zewnętrznego debugera podczas uruchamiania:
  - **`-jmp` ON/OFF** — przejdź bezpośrednio do adresu startowego programu po załadowaniu.
  - **`-unpause` WŁ./WYŁ.** — natychmiastowe wznawianie debugera po załadowaniu.
  - **`-wait` ms ON/OFF** — dodaje opóźnienie `-wait <ms>` przed wznowieniem; wybierz 500 ms lub 1000 ms z listy rozwijanej.
- **Informacje o kompilacji** — wyświetla podsumowanie skompilowanego programu (adres początkowy kodu, rozmiar, status szczątkowego kodu BASIC SYS).

### Kliknięcie linii ASM

Kliknij dowolny wiersz w widoku ASM, aby **podświetlić odpowiedni blok ** w obszarze programu.

### Numery linii ASM

Panel ASM wyświetla **numery wierszy** (`001 |`, `002 |`, …), aby ułatwić rozwiązywanie problemów, gdy błąd kompilacji wskazuje na konkretny wiersz.

- Numery linii wizualnych służą wyłącznie celom diagnostycznym.
- **Kopiuj ASM** nadal kopiuje czysty tekst źródłowy **bez** prefiksów numerów wierszy.

### Modalny postęp kompilacji

Podczas wykonywania cięższych akcji pojawia się wyśrodkowane okno postępu z paskiem postępu:

- **Uruchom w VICE** — kompilowanie/budowanie PRG i uruchamianie emulatora.
- **Debugowanie** — kompilowanie/budowanie PRG i uruchamianie debugera.
- **Załaduj plik .asm** — otwórz plik `.asm` w trybie eksperta i zmaterializuj bloki ze źródła.

Okno modalne zamyka się automatycznie po zakończeniu akcji lub jej niepowodzeniu.

---

## 5. Ustawienia i pasek narzędzi

| Kontrola                                | Opis                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Podstawa liczbowa (HEX / DEC / BIN)** | Ustawia format wyświetlania/wprowadzania operandów w całym interfejsie użytkownika. Tryb BIN wyświetla wartości jako binarne z prefiksem `%` (np. `%11111000`). Widok ASM zawsze wyświetla każdy blok w jego własnym formacie.                                                                                                                                                                                                                                         |
| **Język**                               | Przełączanie interfejsu użytkownika między językiem angielskim, węgierskim, hiszpańskim, niemieckim i holenderskim (Nederlands)                                                                                                                                                                                                                                                                                                                                        |
| **Motyw**                               | Jasny / Ciemny / OLED / Commodore 77 — wybierz z selektora motywów w menu Ustawienia. OLED używa czystego czarnego tła dla wyświetlaczy AMOLED. Commodore 77 to neonowożółty motyw na czarnym tle; gdy jest aktywny, panel powitalny startowy używa koloru panelu motywu (pasującego do karty wiadomości), wyświetla mniejsze, dedykowane logo Commodore 77 i żółty pasek postępu. Wybrany motyw jest stosowany przed pierwszym malowaniem przy kolejnym uruchomieniu. |
| **Tryb retro CRT**                      | Przełącza pełnoekranowy filtr CRT: linie skanowania, winietę fosforową, migotanie i zniekształcenie beczkowate. Stan jest zapisywany między sesjami.                                                                                                                                                                                                                                                                                                                   |
| **Pokaż panel pamięci**                 | Globalny przełącznik pokazujący lub ukrywający cały panel pamięci C64                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Podstawowy schemat systemu **         | Dodaje wiersz języka BASIC, który wywołuje SYS do źródła programu                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Próbka**                              | Załaduj wbudowany przykładowy program                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Powiększ / pomniejsz **               | Skalowanie interfejsu użytkownika bloku (dotyczy wszystkich elementów bloku)                                                                                                                                                                                                                                                                                                                                                                                           |
| **Zapisz projekt**                      | Zapisz bieżący program jako plik projektu `.json`                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Zapisz program jako**                 | Zapisz bieżący program jako plik projektu `.json` za każdym razem, korzystając z nowego okna dialogowego pliku                                                                                                                                                                                                                                                                                                                                                         |
| **Załaduj projekt**                     | Załaduj wcześniej zapisany projekt                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Zapisz obszar roboczy**               | Zapisz dokładny zestaw aktualnie otwartych kart z kopią zapasową pliku — w tym aktywną kartę i tryb edytora każdej karty (Blok/Ekspert/Ultimate Basic) — w pliku obszaru roboczego `.vaws`.                                                                                                                                                                                                                                                                            |
| **Zapisz obszar roboczy jako**          | Zapisz bieżący obszar roboczy za każdym razem, korzystając z nowego okna dialogowego pliku                                                                                                                                                                                                                                                                                                                                                                             |
| **Otwórz przestrzeń roboczą**           | Zamknij wszystkie otwarte karty i ponownie otwórz zestaw plików przechowywanych w pliku obszaru roboczego `.vaws`.                                                                                                                                                                                                                                                                                                                                                     |
| **Ustaw folder roboczy**                | Wybierz domyślny folder używany przez selektory plików i okna dialogowe zapisu. Ścieżka jest zapisywana w konfiguracji aplikacji, a podglądy menu utrzymują koniec ścieżki widoczny.                                                                                                                                                                                                                                                                                   |
| **Otwórz projekt** (`Menu → Plik`)      | Otwórz wieloplikowy projekt `.proj` i otwórz wszystkie pliki źródłowe jako zakładki                                                                                                                                                                                                                                                                                                                                                                                    |
| **Zapisz projekt** (`Menu → Plik`)      | Zapisz bieżący projekt `.proj` (panel projektu musi być otwarty)                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Zamknij projekt** (`Menu → Plik`)     | Zamknij aktualnie otwarty projekt i wszystkie jego zakładki plików. Wyświetla monit o zapisanie niezapisanych zmian. Panel projektu resetuje się do stanu pustego.                                                                                                                                                                                                                                                                                                     |
| **Załaduj plik .asm**                   | Otwiera plik `.asm` w trybie eksperckim i importuje tekstowy plik ASM 6502 do bieżącej karty                                                                                                                                                                                                                                                                                                                                                                           |
| **Zapisz program **                     | Eksportuj skompilowany plik binarny jako plik `.prg`                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Budowa CRT**                          | Wyeksportuj program jako plik Magic Desk o rozmiarze 64 KB (`.crt`, typ kartridża 19). Zobacz [Sekcję 12b](#12b-crt-export-magic-desk-64k-cartridge).                                                                                                                                                                                                                                                                                                                  |
| **Uruchom (przycisk podziału)**         | Główny przycisk **▶ Uruchom** uruchamia bieżący tryb; kliknij strzałkę **▾**, aby przełączać się między: **Uruchom jako PRG** (kompilacja i uruchomienie programu VICE bezpośrednio), **Uruchom przez D64** (pakowanie do obrazu dysku .d64 i uruchomienie programu VICE) lub **Uruchom na sprzęcie** (wysyłanie PRG do urządzenia C64 Ultimate / 1541 Ultimate). Zobacz [Sekcję 12](#12-d64-export--run) i [Sekcję 13](#13-hardware-settings).                        |
| **Debugowanie (RetroDebugger)**         | Kompiluj i uruchamiaj w RetroDebuggerze z punktami przerwania, symbolami i flagami autostartu (patrz [Sekcja 9](#9-debugger-integration))                                                                                                                                                                                                                                                                                                                              |
| **Uruchom z Exomizerem**                | Pole wyboru w menu Ustawienia — po zaznaczeniu wszystkie operacje Uruchom i Kompilacja przeszukują PRG przez `exomizer sfx sys` przed uruchomieniem lub zapisaniem. Działa z opcjami Uruchom jako PRG, Uruchom przez D64, Uruchom na sprzęcie, Kompilacja PRG i Kompilacja D64. Najpierw skonfiguruj plik wykonywalny Exomizera w **Ustawieniach sprzętu**.                                                                                                            |
| **Automatyczne zapisywanie migawek**    | Zaznacz pole wyboru w **Ustawienia sprzętowe → Migawka **. Po włączeniu aplikacja automatycznie utworzy migawkę około 2,5 sekundy po zakończeniu edycji karty. Wyłącz tę opcję, jeśli chcesz tylko ręcznie zapisywać migawki.                                                                                                                                                                                                                                          |
| **Ustawienia sprzętowe**                | Otwórz okno dialogowe konfiguracji sprzętu — skonfiguruj VICE, Exomizer, RetroDebugger i C64 Ultimate (host, hasło, test połączenia). Zobacz [Sekcję 13](#13-hardware-settings).                                                                                                                                                                                                                                                                                       |
| **Nowy program…**                       | Otwiera okno dialogowe potwierdzenia, a następnie czyści wszystkie bloki z obszaru programu                                                                                                                                                                                                                                                                                                                                                                            |
| **Zwiń wszystko**                       | Zwiń wszystkie bloki                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **O **                                  | Informacje o wersji                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Co nowego**                           | Dziennik zmian                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

### Migawki projektu

Migawki projektu są przechowywane jako pliki JSON sidecar na dysku, a nie w pamięci lokalnej. Są one powiązane z bieżącym plikiem projektu, jeśli taki istnieje, dzięki czemu historia przetrwa ponowne uruchomienia i będzie śledzić projekt.

- **Menu → Kompilacja → Zapisz migawkę** otwiera okno dialogowe migawki i zapisuje bieżący stan bloku oraz tekst Expert ASM.
- **Menu → Kompilacja → Przywróć poprzednią wersję** przywraca bezpośrednio najnowszą migawkę.
- **Menu → Kompilacja → Historia migawek** otwiera okno dialogowe, w którym można dodawać notatki, przywracać starsze wpisy lub je usuwać.
- **Ustawienia sprzętowe → Migawka → Automatyczne zapisywanie migawek ** – określa, czy aplikacja ma automatycznie tworzyć migawki po edycjach. Domyślne opóźnienie wynosi około 2,5 sekundy, a ustawienie ma zastosowanie dla każdej karty.
- Jeśli projekt nie został jeszcze zapisany, migawki są przechowywane w katalogu konfiguracji aplikacji, dopóki projekt nie otrzyma ścieżki dostępu do pliku. | **Baza wiedzy** | Linki referencyjne (kody operacji 6502, jądro C64, mapa pamięci, kolory) | | **Sprawdź dostępność aktualizacji** | Otwórz stronę itch.io, aby sprawdzić dostępność nowszej wersji |

### Przestrzenie robocze

Obszar roboczy **** (plik `.vaws`) zapamiętuje, które rzeczywiste pliki na dysku były otwarte na każdej karcie — w tym tryb edytora każdej karty i która karta była aktywna — dzięki czemu można później ponownie otworzyć ten sam zestaw. Jest on niezależny od projektu `.proj`: obszar roboczy może obejmować dowolną kombinację plików projektu Block/Expert `.json`, samodzielnych plików `.asm` oraz plików źródłowych Ultimate Basic `.ub`/`.proj` na wielu kartach.

- Przestrzenie robocze **zapisują się automatycznie** kilkaset milisekund po wprowadzeniu zmiany, jeśli została ona zapisana lub otwarta.
- Aplikacja **automatycznie przywraca ostatnią przestrzeń roboczą ** po uruchomieniu, dzięki czemu możesz kontynuować pracę na otwartych kartach od miejsca, w którym przerwałeś.
- W obszarze roboczym zapisywane są tylko karty oparte na rzeczywistym pliku na dysku; karta zawierająca niezapisaną próbkę lub program znajdujący się wyłącznie w pamięci nie ma niczego do zapisania i jest pomijana (jeśli żadna z otwartych kart nie kwalifikuje się, wyświetlane jest powiadomienie).
- Otwarcie obszaru roboczego powoduje najpierw zamknięcie wszystkich otwartych kart — przed kontynuacją zostaniesz poproszony o potwierdzenie.
- Jeśli obszar roboczy odwołuje się do pliku, który został już przeniesiony lub usunięty, wpis ten jest pomijany i zgłaszany według nazwy po załadowaniu.

### Załaduj plik .asm (szybki przewodnik)

Program ładujący w trybie eksperckim `.asm` akceptuje powszechne wzorce źródłowe 6502 i konwertuje je na bloki:

- `* = 1500$` → blok ORG
- `Etykieta:` → blok ETYKIETA
- `Etykieta: .bajt 0` → ETYKIETA + bloki BYTE
- `.bajt ...` → blok BYTE
- `; komentarz` (lub wbudowany `; ...`) → blok KOMENTARZA
- instrukcje (`lda`, `jsr`, `beq` itd.) → bloki instrukcji z wykrytym trybem adresowania

#### Importuj notatki dotyczące analizy i najlepsze praktyki

- Lokalne etykiety, takie jak `.wait`, są importowane jako standardowe etykiety (bez kropki), a odniesienia są odpowiednio normalizowane.
- W przypadku adresowania w stylu `($zp),Y` / `($zp,X)` należy użyć konkretnego bajtu strony zerowej (`$FB`, `$FC` itd.) w celu zapewnienia najlepszej zgodności.
- Unikaj niejednoznacznych krótkich etykiet wyglądających jak hex (`cc1`, `dead`, `beef`) w kontekstach gałęzi; preferuj nazwy takie jak `loop_cc1`.
- Jeżeli program rozpoczyna się od danych (`.byte`) przed kodem wykonywalnym, należy na początku dodać jawny skok wejściowy (na przykład `JMP Start`).

### Import ASM (Kick Assembler)

Przycisk **Import ASM** w menu Program pobiera surowy kod źródłowy Kick Assembler do nowej zakładki w trybie blokowym. Jest on niezależny od przycisku `Załaduj plik .asm` w trybie Eksperta — jego niestandardowa podpowiedź informuje, że **obsługiwany jest tylko kod Kick Assembler** (inne asemblery mogą analizować kod częściowo, ale nie ma gwarancji poprawnego działania).

Obsługiwane wzorce:

- `.pc = $XXXX` dyrektywa origin → blok ORG
- `.const NAZWA = wartość`, `.label NAZWA = wartość` → CONST równa się
- `.macro NAME(p1, p2, ...) { ... }` z korpusem nawiasu klamrowego `{`/`}` lub `.endm` → definicja makra użytkownika
- Wywołanie makra `NAZWA(args)`, prefiks dwukropka Kick `:NAZWA(args)` i `.invoke NAME(args)` — wszystko odbywa się w obie strony przez formę dwukropka Kick
- Etykiety `@local` (`@loop:`, `BEQ @loop`) zachowują prefiks `@` w obecnej postaci
- Operand `etykieta + N` / `etykieta - N` (np. `STA mod1+2`, `LDA xp+1`)
- Komentarze liniowe `// ...` i `;` — oba akceptowane, bloki `/* ... */` są traktowane jako pojedynczy wiersz komentarza
- Przejście automatycznego startu języka BASIC: gdy program rozpoczyna się od `$0801` ze standardowym `SYS 2061` bajtowym szczątkiem (`.byte $0B,$08,$0A,$00,$9E,$32,$30,$36,$31,$00,$00,$00`), kompilator emituje PRG dosłownie zamiast otaczać go drugim BASIC SYS

Znane ograniczenie:

- Stałe, które odpowiadają adresowi strony zerowej (na przykład `.const BYTEADDR = $FC` użyte jako `STA BYTEADDR`), kompilują się obecnie do instrukcji w trybie absolutnym (3 bajty) zamiast strony zerowej (2 bajty). Skompilowany kod nadal zapisuje dane do prawidłowej lokalizacji w pamięci, ale z niewielkim rozmiarem i narzutem cyklu w porównaniu z tym samym kodem źródłowym skompilowanym przez Kick Assembler.

## Tryb Ultimate Basic

Visual Assembler zawiera kompletne środowisko programistyczne **Ultimate Basic **. Ultimate Basic to nowoczesny, kompilowany język BASIC do tworzenia programów, gier i dem w języku C64 bez konieczności pisania wszystkich operacji w niskopoziomowym asemblerze 6502. Kompilator działa lokalnie i generuje natywne dane wyjściowe PRG dla języka C64.

### Otwieranie edytora UB

Wybierz ikonę **UB** na głównym pasku narzędzi, aby przejść do trybu Ultimate Basic. Wybrany tryb edytora jest zapamiętywany po ponownym uruchomieniu aplikacji. Nowe źródło zaczyna się od:

```basic
color bg 0
color border 0

print "HELLO FROM ULTIMATE BASIC"
```

Tryb UB działa z plikami źródłowymi `.ub`. Funkcje **Nowy**, **Otwórz**, **Zapisz** i **Zapisz jako** działają na aktywnej karcie UB. Otwarcie pliku `.ub` automatycznie aktywuje odpowiednią kartę edytora.

Pasek narzędzi pokazuje aktualny folder roboczy UB. Ten folder jest przechowywany oddzielnie od folderu roboczego Blok/Ekspert. Gdy tryb UB jest aktywny, polecenie **Plik → Ustaw folder roboczy** wybiera folder UB; jego podpowiedź identyfikuje aktywny zakres. Okna dialogowe Otwórz/Zapisz UB rozpoczynają się w tym miejscu, a niezapisane źródła używają go jako bazy dla względnych ścieżek `include` i `incbin`.

### Narzędzia edytora

Pasek narzędzi UB korzysta z tego samego języka wizualnego i niestandardowych podpowiedzi, co tryb Eksperta. Zapewnia on:

- podświetlanie składni w oparciu o bieżący podręcznik języka Ultimate Basic;
- numery wierszy, które pozostają zsynchronizowane z długimi plikami;
- minimapa i sterowanie powiększeniem edytora; kliknij minimapę, aby przeskoczyć lub przeciągnij wybrany obszar widoku, aby przewijać go w sposób ciągły;
- Znajdź (`Ctrl+F` / `Cmd+F`) korzystając z paska wyszukiwania w stylu eksperta;
- formatowanie źródła z uwzględnieniem wcięć strukturalnych;
- automatyczne uzupełnianie poleceń i wbudowanych funkcji;
- przeszukiwalny panel **Poleceń** ze składnią, opisem i wskazówkami dotyczącymi użytkowania — opisy są zgodne z bieżącym językiem interfejsu użytkownika (węgierskim, angielskim, hiszpańskim, niemieckim, holenderskim), a w przypadku elementów, które nie zostały jeszcze przetłumaczone, stosuje się język angielski;
- niezależnie przełączane panele **Projekt** i **Polecenia**, wyświetlane obok siebie, gdy oba są włączone;
- niezależnie przełączane i zmieniane rozmiarowo panele **Wyjście kompilacji** i **Demontaż**.

Panel Demontażu zawiera przycisk **Kopiuj**, który kopiuje cały wyświetlany kod źródłowy do schowka. Pomoc dotycząca poleceń jest zgodna z dołączonym kompilatorem: na przykład polecenie `identyfikator_klatki_sprite'a, adres_danych [, klatka]` wybiera obraz animacji z kolejnych 64-bajtowych klatek sprite'a.

Lista poleceń ma celowo ograniczoną wysokość, aby karta szczegółów polecenia mogła wypełnić pozostałą wysokość panelu. Obszar szczegółów przewija się niezależnie, umożliwiając dostęp do dłuższych opisów składni.

### Projekty, zakładki i pliki startowe

Projekty Ultimate Basic korzystają z plików `.proj` i mogą zawierać wiele plików źródłowych `.ub`. Panel Projekt wyświetla listę otwartych plików, oznacza niezapisane karty oraz pokazuje odkryte etykiety, funkcje i podprogramy. Akcje projektu umożliwiają tworzenie, otwieranie, zapisywanie i zamykanie projektu lub dodawanie kolejnego pliku źródłowego.

Kliknij gwiazdkę obok pliku projektu, aby oznaczyć go jako **plik startowy **. Polecenia Build, Run, D64, C64 Ultimate i Debug kompilują ten plik startowy, nawet jeśli aktywna jest inna karta. Bez wyboru pliku startowego używana jest aktywna karta UB.

### Budynek i diagnostyka

Przycisk **Build** otwiera ten sam wyśrodkowany widok postępu, co w innych przepływach pracy w Visual Assembler. Pomyślne kompilacje aktualizują dane wyjściowe kompilacji, informacje o kompilacji i deasemblację. Włącz **Verbose**, aby uwzględnić szczegóły mapy pamięci kompilatora, wewnętrzne alokacje stron zerowych i wygenerowane dane kodu.

Gdy kompilacja się nie powiedzie:

- Dane wyjściowe kompilacji stają się widoczne automatycznie;
- błędy kompilatora są wyświetlane na czerwono;
- wyśrodkowane okno dialogowe kompilacji wyświetla błąd;
- błędy zawierające wiersz źródłowy wybierz ten wiersz w aktywnym edytorze UB.

Informacje o kompilacji zawierają raporty dotyczące adresów ładowania/zakończenia, rozmiarów kodów i PRG, stanu Exomizera, zmiennych, tablic, funkcji/podprogramów i etykiet.

### Uruchomienie, D64 i Exomizer

Główny przycisk podziału **Uruchom** obsługuje Ultimate Basic w każdym normalnym miejscu docelowym:

| Tryb pracy                  | Podstawowe zachowanie Ultimate                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Uruchom jako PRG**        | Skompiluj i uruchom PRG bezpośrednio w programie VICE.                                                 |
| **Uruchom przez D64**       | Skompiluj, otwórz standardowe okno dialogowe pakowania D64, a następnie uruchom dysk w programie VICE. |
| **Uruchom na Ultimate**     | Prześlij i uruchom PRG poprzez skonfigurowane połączenie C64 Ultimate REST.                            |
| **Uruchom D64 na sprzęcie** | Spakuj D64 i wyślij do skonfigurowanego C64 Ultimate.                                                  |

Globalna opcja **Ustawienia → Exomizer** dotyczy również kompilacji UB i normalnych celów uruchomieniowych; nie jest potrzebne osobne przełączanie paska narzędzi UB. Uruchomienia debugera celowo korzystają z nieskompresowanego pliku PRG, aby adresy i symbole kompilatora nadal odpowiadały wykonywanemu programowi.

Włącz **Ustawienia → Ustawienia programu → Generuj kod źródłowy UltimateBasic ASM (.asm)**, aby zapisać wygenerowany przez kompilator zestaw obok pliku PRG lub kompilacji D64, używając tej samej nazwy pliku bazowego. Jest to opcja kompilacji, więc pasek narzędzi UB nie zawiera oddzielnych przycisków eksportu ASM. Polecenie `load "NAME", $address` dostarcza również adres ładowania PRG dla odpowiedniego pliku dodatkowego D64.

### Symbole debugera i deasemblacja

Kompilacje żądają informacji debugowania Ultimate Basic i generują trzy zgodne sidecary:

- `.sym` dla symboli w stylu KickAssembler;
- `.dbg` dla źródła C64Debugger/RetroDebugger i informacji o segmencie;
- `.vs` dla etykiet monitorów VICE.

Kolorowy panel UB Disassembly rozpoznaje znane etykiety i prezentuje adresy, bajty, mnemoniki i operandy. Przycisk **Debug** uruchamia RetroDebugger z surowym programem UB PRG, elementami pomocniczymi debugowania oraz etykietami, funkcjami, podprogramami, zmiennymi i tablicami kompilatora. Ustawienia oczekiwania i wznawiania debugowania są wspólne dla standardowej konfiguracji debugera Visual Assembler.

### Podręcznik i źródło Ultimate Basic

Ikona książki na pasku narzędzi UB otwiera odpowiedni plik Ultimate Basic `MANUAL.pdf` w trybie offline; przycisk podręcznika w oknie powitalnym startowym otwiera ten sam podręcznik. Visual Assembler pobiera zarówno kompilator, jak i plik PDF z przypiętej zależności Git/Cargo, więc środowisko IDE nie utrzymuje drugiej kopii implementacji Ultimate Basic. Okno dialogowe Informacje i ekran powitalny wyświetlają aktualną wersję zależności.

Ultimate Basic jest również dostępny jako samodzielny projekt open-source:

<https://github.com/zstarczali/UltimateBasic>

Kompilator jest dołączony do programu Visual Assembler, więc w czasie wykonywania nie jest wymagany żaden oddzielny plik wykonywalny `ub`.

## 6. Tryb eksperta

Tryb Eksperta to w pełni funkcjonalny edytor tekstów bezpośrednich 6502, działający równolegle z edytorem bloków. Każda karta może działać w trybie blokowym lub eksperckim — można się między nimi swobodnie przełączać w dowolnym momencie za pomocą przełącznika **Blok/Ekspert** na górnym pasku.

### Przełączanie trybów

- **Blok → Ekspert:** bieżący program jest serializowany do tekstu (jedna instrukcja w wierszu, etykiety, makra jako dyrektywy). Edycje w trybie Eksperta są synchronizowane z tablicą bloków za każdym razem, gdy przełączasz się z powrotem lub uruchamiasz akcję.
- **Ekspert → Blok:** tekst jest parsowany za pomocą `parseAsmText()`, a wynik zastępuje program blokowy. W przypadku niepowodzenia parsowania wyświetlane jest okno dialogowe błędu kompilacji.
- **Puste linie** są zachowywane podczas przesyłania danych w obie strony: puste linie w edytorze eksperta pojawiają się jako cienkie przerywane odstępy w trybie blokowym i są przywracane jako puste linie po przełączeniu z powrotem do edytora eksperta.

### Układ edytora

```
┌──────────────────────────────────────────────────────┐
│ [toolbar]  Block │ Expert < tab toggle               │
├────────────┬────────────────────────────┬────────────┤
│  Palette   │   ASM text editor          │  Disasm    │
│  (opt.)    │   (monospace, editable)    │  panel     │
│            │                            │  (opt.)    │
└────────────┴────────────────────────────┴────────────┘
```

| Płyta               | Dźwignia kolankowa          | Opis                                                                                                                      |
| ------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Paleta**          | `#przycisk-palety-eksperta` | Lewa paleta bloków — przeciągnij bloki do edytora lub kliknij, aby wstawić je w miejscu kursora                           |
| **Edytor ASM**      | zawsze widoczny             | Pełny obszar tekstowy o stałej szerokości z nakładką podświetlania składni na żywo                                        |
| **Panel demontażu** | `#ekspert-disasm-btn`       | Czysty demontaż 6502: każda instrukcja pokazuje adres, bajty szesnastkowe i operandy numeryczne; makra w pełni rozwinięte |

### Przyciski paska narzędzi

| Przycisk                            | ID                                                                 | Funkcjonować                                                                                                                                                                                                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Format**                          | `#przycisk-formatu-eksperta`                                       | Automatyczne formatowanie źródła (etykiety do kolumny 0, wcięcie 4-spacji, mnemonik/operand 1-spacji)                                                                                                                                                                         |
| **Załaduj .asm**                    | `#expert-load-asm-btn`                                             | Otwórz plik `.asm` — zawartość zostanie załadowana do **nowej karty**, a nazwa pliku będzie etykietą karty. Każdy załadowany plik stanie się niezależną kartą z własnymi blokami programu i stanem edytora.                                                                   |
| **Zapisz .asm**                     | `#ekspert-zapisz-asm-przycisk`                                     | Zapisz zawartość edytora do pliku `.asm` (okno dialogowe pliku przy pierwszym zapisywaniu)                                                                                                                                                                                    |
| **Informacje o kompilacji**         | `#ekspert-build-info-przycisk`                                     | Otwórz okno dialogowe Informacje o kompilacji (pochodzenie, rozmiar, etykiety, błędy)                                                                                                                                                                                         |
| **HL**                              | `#ekspert-hl-przycisk`                                             | Przełącz podświetlanie składni (wyłącz w przypadku bardzo dużych plików)                                                                                                                                                                                                      |
| **Autouzupełnianie**                | `#ekspert-autocomplete-przycisk`                                   | Włącz/wyłącz podpowiedzi autouzupełniania dla ekspertów. Po wyłączeniu tej opcji w edytorze ekspertów nie pojawi się żadne polecenie, mnemonik ani wyskakujące okienko z etykietą.                                                                                            |
| **Wybór regionu**                   | `#ekspert-region-selection-btn`                                    | Włącz automatyczne podświetlanie regionu w trybie Eksperta. Stan zagięcia pozostaje zapisany, ale po wyłączeniu tej opcji edytor utrzymuje widoczny cały kod źródłowy i nie zaznacza automatycznie bieżącego regionu.                                                         |
| **Zwiń / rozwiń wszystkie regiony** | `#ekspert-region-złóż-wszystkie-przyciski`                         | Złóż lub rozłóż każdy blok `.region` jednym kliknięciem. Jeśli którykolwiek region jest aktualnie otwarty, przycisk zwinie je wszystkie; jeśli wszystkie regiony są już zwinięte, kolejne kliknięcie je rozwinie. Przycisk zaświeci się, gdy wszystkie regiony będą zwinięte. |
| **Numery wierszy**                  | `#ekspert-numery-linii-przycisk`                                   | Przełącz pasek z numerem wiersza po lewej stronie edytora. Pasek pozostaje zsynchronizowany z pozycją przewijania i aktualizuje się na bieżąco podczas pisania.                                                                                                               |
| **Znajdź**                          | `#ekspert-znajdź-przycisk`                                         | Otwórz pasek wyszukiwania (`Ctrl+F`). Wpisz, aby wyszukać; dopasowania są podświetlone w nakładce. `Enter` / `Shift+Enter` umożliwia nawigację między dopasowaniami. `Escape` zamyka pasek.                                                                                   |
| **Oddalanie/przybliżanie**          | `#ekspert-przycisk-oddalania-` / `#ekspert-przycisk-przybliżania-` | Zmniejsz/zwiększ rozmiar czcionki edytora (8–28 px). Ustawienie jest trwałe.                                                                                                                                                                                                  |
| **Paleta**                          | `#przycisk-palety-eksperta`                                        | Pokaż/ukryj lewą paletę mnemotechniczną                                                                                                                                                                                                                                       |
| **Dyzasm**                          | `#ekspert-disasm-btn`                                              | Pokaż/ukryj panel demontażu (czysty 6502, rozwinięte makra)                                                                                                                                                                                                                   |
| **Monitor**                         | `#przycisk-eksperta-monitora`                                      | Pokaż/ukryj panel zrzutu szesnastkowego monitora                                                                                                                                                                                                                              |
| **Minimapa**                        | `#ekspert-minimapa-przycisk`                                       | Pokaż/ukryj pasek minimapy kodu po prawej stronie edytora                                                                                                                                                                                                                     |

Skróty edytora: `Ctrl+/` (`Cmd+/` na macOS) komentuje bieżący wiersz lub każdy zaznaczony wiersz; dodanie `Shift` usuwa początkowy znacznik komentarza z tych wierszy. Komentarze w wierszu instrukcji (na przykład `LDA $12 ; wyjaśnienie`) pozostają w wierszu instrukcji podczas przełączania między trybem eksperta a trybem blokowym. W trybie blokowym są one wyświetlane jako zielony znacznik kursywy `; komentarz` w nagłówku bloku; najechanie kursorem na znacznik ujawnia pełny tekst, gdy jest on obcięty.

### Ekspert edytora minimapy

Minimapa edytora Eksperta to wąski pasek płótna (`88 px`) znajdujący się po prawej stronie obszaru edytora. Wyświetla on pomniejszoną reprezentację każdej linii źródłowej:

| Kolor paska           | Typ tokena                                              |
| --------------------- | ------------------------------------------------------- |
| Kolor komentarza      | Linie zaczynające się od `;`                            |
| Kolor etykiety        | Wiersze z etykietą `:definicja `                        |
| Kolor dyrektywny      | `.byte`, `.macro`, `.region` i wszystkie inne dyrektywy |
| Mnemotechniczny kolor | Wszystko inne (instrukcje)                              |

**półprzezroczysty wskaźnik widoku ** (prostokąt z akcentem) pokazuje, która część źródła jest aktualnie widoczna. Kliknij dowolne miejsce na minimapie, aby przejść do tej pozycji; przeciągnij, aby przewijać w sposób ciągły. Minimapa przewija się niezależnie, utrzymując wskaźnik widoku na środku. Stan jest zapisany w ustawieniach interfejsu użytkownika (klawisz `expertMinimap`).

### Błąd podświetlania

Wiersze, których kompilacja nie powiodła się, są podświetlane na czerwono **** (przyciemniane tło + lewa ramka akcentująca) w czasie rzeczywistym, 350 ms po każdym naciśnięciu klawisza. Pierwszy komunikat o błędzie jest również wyświetlany na pasku stanu. Popraw wiersz, a podświetlenie zniknie automatycznie.

### Podświetlanie składni

Edytor wykorzystuje przezroczystą nakładkę `<div>` (`expert-hl`), która odzwierciedla zawartość pola tekstowego za pomocą kolorowych elementów `<span>`. Podświetlanie można wyłączyć przyciskiem **HL**, aby zwiększyć wydajność w bardzo dużych programach.

| Kolor         | Znak                                                                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Żółto-zielony | Mnemoniki (`LDA`, `STA`, `JMP`, …) i pseudooperacje o długiej gałęzi (`LBNE`, `LBEQ`, …)                                                                     |
| Niebieski     | Dyrektywy (`.byte`, `.word`, `.fill`, `.assert`, `*=`, …)                                                                                                    |
| Pomarańczowy  | Liczby (`$FF`, `%1010`, `255`)                                                                                                                               |
| Cyjan         | Etykiety — wiersze kończące się na `:`, w tym etykiety lokalne (`.loop:`) i etykiety operandów kodu samomodyfikującego się (`wartość:` w `wartość LDA:#$00`) |
| Cyraneczka    | Literały ciągów                                                                                                                                              |
| Ciemnozielony | Komentarze (`; …`)                                                                                                                                           |

Dyrektywy `REGION` / `ENDREGION` są podświetlane tak samo jak inne dyrektywy asemblera. Zwinięte regiony pozostawiają widoczny w edytorze tylko nagłówek regionu do momentu ich ponownego otwarcia. Nowy przełącznik **Wybór regionu** na pasku narzędzi steruje automatycznym podświetlaniem bieżącego regionu tylko w trybie eksperta; jego wyłączenie sprawia, że źródło jest widoczne bez zmiany stanu zwinięcia.

### Formater źródła

Kliknij przycisk **Formatuj** (`#expert-format-btn`), aby automatycznie sformatować bieżące źródło:

- Definicje etykiet zostały przeniesione do kolumny 0.
- Instrukcje są wcięte czterema spacjami.
- Mnemoniki pisane są wielkimi literami.
- Dokładnie jedna spacja między mnemonikiem i operandem (dodatkowa spacja jest normalizowana).
- Jeśli źródło jest już sformatowane, wyświetlany jest status `„Już sformatowano”`.

### Panel projektu i zakładki

Tryb eksperta obsługuje **panel projektu** (`#expert-project-panel`) dla projektów wieloplikowych `.proj`:

- Plik `.proj` to manifest JSON zawierający listę plików źródłowych i ich metadanych.
- Otwórz projekt za pomocą **Menu → Plik → Otwórz projekt ** lub przeciągnij plik `.proj` na okno.
- Każdy plik w projekcie otwiera się jako osobna karta **** na pasku kart u góry edytora.
- **Zamknij projekt** (`Menu → Plik → Zamknij projekt` / `#menu-close-project`) zamyka bieżący projekt i wszystkie jego karty plików jednocześnie. Wyświetla monit o zapisanie niezapisanych zmian przed zamknięciem. Panel projektu resetuje się do stanu pustego, a `_expertProjectData` zostaje wyczyszczony.
- Każdy plik można oznaczyć jako **plik startowy** (ikona gwiazdki ★). Po ustawieniu pliku startowego przycisk **Uruchom** (PRG, D64, Ultimate) zawsze asembluje i uruchamia kod tego pliku — niezależnie od tego, która karta jest aktualnie aktywna. Działa to zarówno w trybie blokowym, jak i eksperckim.
- Sekcję **symboli** znajdującą się na dole panelu projektu można zmieniać w pionie za pomocą separatora między drzewem plików a listą symboli, dzięki czemu długie listy symboli mogą zajmować więcej miejsca, gdy jest to potrzebne.

### Pasek kart

Pasek kart pojawia się nad edytorem, jeśli otwarta jest więcej niż jedna karta.

| Funkcja                          | Opis                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Brudna kropka**                | Mała kropka w kolorze akcentującym na nazwie zakładki wskazuje niezapisane zmiany                                                                                                                                                                                                                                                                                                                                           |
| **Strzałki przewijania**         | Przyciski przewijania w lewo/w prawo pojawiają się, gdy liczba kart przekracza liczbę mieszczącą się na pasku                                                                                                                                                                                                                                                                                                               |
| **Zamknij (×)**                  | Zamyka kartę; wyświetla monit o zapisanie, jeśli karta jest brudna                                                                                                                                                                                                                                                                                                                                                          |
| **Rozszerzenie pliku**           | Wyświetlana jest pełna nazwa pliku, łącznie z rozszerzeniem (`.c64va`, `.json`)                                                                                                                                                                                                                                                                                                                                             |
| **Menu prawego przycisku myszy** | Kliknij prawym przyciskiem myszy kartę (lub puste miejsce na pasku kart), aby wykonać następujące czynności: **Nowa karta**, **Zamknij kartę**, **Zamknij inne karty**, **Zamknij karty po prawej stronie**, **Zamknij wszystkie karty**. Operacje zamykania zbiorczego wyświetlają monit o zamknięcie każdej niezapisanej karty i zatrzymują się po anulowaniu. **Zamknij wszystkie** zawsze pozostawia jedną pustą kartę. |

> **Wskazówka: ** Synchronizacja palet (`#expert-palette-sync-btn`) synchronizuje wybór palety z mnemonikiem przy kursorze. Wyłącz tę funkcję, jeśli nie chcesz, aby paleta przeskakiwała podczas edycji.

---

## 7. Tryby adresowania

Każda instrukcja 6502 obsługuje jeden lub więcej trybów adresowania. Selektor trybu znajduje się na każdym bloku.

| Tryb              | Etykieta          | Przykład           | Opis                                                                                  |
| ----------------- | ----------------- | ------------------ | ------------------------------------------------------------------------------------- |
| **dorozumiane**   | Ukryty            | `NIE`              | Brak operandu; instrukcja jest samodzielna                                            |
| **natychmiast**   | Natychmiastowy    | `LDA #$FF`         | Stała wbudowana; asembler automatycznie dodaje `#`                                    |
| **Strona zerowa** | Strona zerowa     | `LDA 10 dolarów`   | Adres jednobajtowy na stronie zerowej (0–255)                                         |
| **zeroPageX**     | Strona zerowa, X  | `LDA 10 dolarów,X` | Adres strony zerowej + przesunięcie rejestru X (wynik zawija się na stronie 0)        |
| **zeroPageY**     | Strona zerowa, Y  | `LDX $FB,Y`        | Adres strony zerowej + przesunięcie rejestru Y                                        |
| **absolutny**     | Absolutny         | `LDA $0400`        | Pełny 16-bitowy adres pamięci                                                         |
| **absolutnyX**    | Absolute,X        | `LDA $0400,X`      | 16-bitowy adres + przesunięcie rejestru X                                             |
| **absolutnyY**    | Absolute,Y        | `LDA $0400,Y`      | 16-bitowy adres + przesunięcie rejestru Y                                             |
| **względny**      | Względny/Etykieta | `Pętla BNE`        | Aby uzyskać instrukcje dotyczące oddziału, wprowadź nazwę etykiety lub adres docelowy |
| **pośredniX**     | Pośrednie,X       | `LDA ($FB,X)`      | Strona zerowa indeksowana pośrednio (operand = adres strony zerowej, 1 bajt)          |
| **pośredniY**     | Pośrednie, Y      | `LDA ($FB),Y`      | Strona zerowa indeksowana pośrednio (operand = adres strony zerowej, 1 bajt)          |
| **pośredni**      | Pośredni          | `JMP ($0100)`      | Pośredni; można go używać tylko z JMP                                                 |

### Oznacz wyrażenia etykietami jako operandy

Każde pole operandu akceptujące adres lub wartość bezpośrednią akceptuje również bezpośrednio **nazwę stałej** (z bloku `CONST` lub `LABEL`). Dodatkowo można użyć wyrażeń **etykieta+przesunięcie** lub **etykieta−przesunięcie**, aby odwołać się do adresu względnego do nazwanej stałej:

| Składnia              | Przykład                     | Opis                                                                                                                             |
| --------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `etykieta`            | `RAM ekranu STA,X`           | Rozwiązuje się do etykiety/wartości stałej                                                                                       |
| `etykieta+$hex`       | `STA screen_ram+$0100,X`     | Adres etykiety plus przesunięcie szesnastkowe                                                                                    |
| `etykieta+dziesiętne` | `STA screen_ram+256,X`       | Adres etykiety plus przesunięcie dziesiętne                                                                                      |
| `etykieta-$hex`       | `Tabela LDA-$10`             | Adres etykiety pomniejszony o przesunięcie szesnastkowe                                                                          |
| `#<etykieta`          | `LDA #<pamięć_ekranu`        | Niski bajt adresu etykiety                                                                                                       |
| `#&gt;etykieta`       | `LDA #&gt;pamięć_ram_ekranu` | Wysoki bajt adresu etykiety                                                                                                      |
| `*`                   | `BNE *`                      | Aktualny licznik programu (adres własny instrukcji); rozgałęzienia z `*` generują nieskończoną pętlę własną (przesunięcie `$FE`) |

**Przykład — wyczyść dwie strony ekranowe za pomocą stałej:**
```
; .CONST screen_ram = $0400
    LDX #$00
clear:
    STA screen_ram,X
    STA screen_ram+$0100,X
    DEX
    BNE clear
```

### Licznik programu `*` w wyrażeniach

*(Nowość w wersji 2.3.9.)* `*` nie jest już ograniczony do całego operandu — może pojawić się **w dowolnym miejscu wyrażenia operandu** i oznacza adres instrukcji, w której jest zapisany. Jest on rozwiązywany w momencie asemblacji na podstawie rzeczywistego adresu tej instrukcji, więc etykieta nie jest potrzebna w przypadku krótkich skoków względnych lub odczytów danych względnych względem PC.

| Składnia            | Przykład                   | Oznaczający                                                      |
| ------------------- | -------------------------- | ---------------------------------------------------------------- |
| `*`                 | `BNE *`                    | Rozgałęzienie do siebie (pętla nieskończona, przesunięcie `$FE`) |
| `*-n` / `*+n`       | `BNE *-5`, `BEQ *+4`       | Rozgałęzienie względem bieżącego komputera o *n* bajtów          |
| `SKOCZ *+n`         | `SKOK *+20`                | Skok absolutny obliczony na podstawie bieżącego komputera        |
| `#&lt;*` / `#&gt;*` | `LDA #&lt;*`, `LDA #&gt;*` | Niski/wysoki bajt bieżącego komputera                            |
| `#&gt;(*+n)`        | `LDA #&gt;(*+63)`          | Niski/wysoki bajt adresu względnego komputera                    |

**PC kontra mnożenie. ** `*` jest traktowany jako licznik programu tylko wtedy, gdy znajduje się w *pozycji wartości* — na początku wyrażenia lub zaraz po operatorze, `(`, `,`, `&lt;`, `&gt;` lub spacji. Operator `*` następujący po liczbie, `)` lub identyfikatorze jest zwykłym mnożeniem, więc `tabela LDA*2` i `CONST_A*4` pozostają niezmienione.

**Gdzie to działa.** Dowolny operand, który akceptuje już wyrażenie: cele rozgałęzień, `JMP` / `JSR`, `LDA`/`STA`/… bezwzględne i indeksowane, natychmiastowe operatory bajtów niskiego/wysokiego oraz wyrażenie `.assert`. `*` nigdy nie zmienia rozmiaru instrukcji, więc jest bezpieczny w każdym trybie adresowania.

### Etykiety lokalne (kropkowane)

*(Nowość w wersji 2.3.9.)* Etykieta, której nazwa zaczyna się od kropki — `.loop`, `.skip`, `.done` — jest **lokalną etykietą**. Należy ona do zakresu najbliższej poprzedzającej ją **globalnej** (bez kropki) etykiety i wewnętrznie staje się `<global>.<name>`. Dwie lokalne etykiety o tej samej krótkiej nazwie pod różnymi etykietami globalnymi **nie** kolidują.

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

- W zakresie odwołaj się do lokalnej etykiety jako `.nazwa`.
- Z innego zakresu odwołaj się do niego jawnie jako `Global.name` (np. `JMP ClearScreen.loop`).
- `.name` zapisane przed jakąkolwiek etykietą globalną pozostaje zwykłym `.name` najwyższego poziomu.
- Lokalne etykiety przechodzą przez tryb Blok ⇄ Ekspert bez zmian; prefiks `<global>.` jest szczegółem układu i nigdy nie jest przechowywany w programie blokowym.

### Etykiety operandów kodu samomodyfikującego

*(Nowość w wersji 2.3.9.)* Dodaj prefiks do operandu instrukcji z `label:`, aby umieścić etykietę na bajcie **operandu**, a nie na kodzie operacji. Instrukcja jest asemblowana z tego, co następuje po dwukropku.

```
setup:
    LDA value:#$00     ; 'value' -> address of the #$00 operand byte
    ...
patch:
    LDA #new
    STA value          ; writes the operand byte directly — classic SMC
```

`wartość` wskazuje na `<adres instrukcji> + 1` (pierwszy bajt operandu) dla każdego trybu adresowania. Zastępuje to starszy wzorzec `instrukcja STA + 1` / `instrukcja: LDA #$00`. Przechodzi on w obie strony przez tryb Blok ⇄ Ekspert (pole operandu zachowuje prefiks `etykieta:`).

---

## 8. Standardowe instrukcje 6502

### Przenoszenie danych

| Mnemoniczny | Opis                | Tryby                                                                             |
| ----------- | ------------------- | --------------------------------------------------------------------------------- |
| `LDA`       | Załaduj akumulator  | natychmiastowy, zeroPage, absolutny, absolutnyX, absolutnyY, pośredniX, pośredniY |
| `LDX`       | Załaduj rejestr X   | natychmiastowy, zeroPage, zeroPageY, absolutny, absolutnyY                        |
| `LDY`       | Załaduj rejestr Y   | natychmiastowy, zeroPage, absolutny, absoluteX                                    |
| `STA`       | Akumulator sklepowy | zeroPage, absolutny, absolutnyX, absolutnyY, pośredniX, pośredniY                 |
| `STX`       | Sklep X rejestr     | zeroPage, zeroPageY, absolutny                                                    |
| `STY`       | Sklep Y kasa        | zeroPage, absolutny                                                               |

### Arytmetyka

| Mnemoniczny | Opis                         | Notatki                                                    |
| ----------- | ---------------------------- | ---------------------------------------------------------- |
| `ADC`       | Dodaj z przeniesieniem       | W większości przypadków przed użyciem należy ustawić `SEC` |
| `SBC`       | Odejmowanie z przeniesieniem | Ustaw przeniesienie z `SEC` przed odjęciem                 |
| `INK`       | Zwiększ pamięć               | —                                                          |
| `GRU`       | Zmniejsz pamięć              | —                                                          |
| `CMP`       | Porównaj z A                 | Ustawia flagi; nie modyfikuje A                            |
| `CPX`       | Porównaj z X                 | —                                                          |
| `CPY`       | Porównaj z Y                 | —                                                          |

### Logika

| Mnemoniczny | Opis                                                            |
| ----------- | --------------------------------------------------------------- |
| `I`         | Logiczne AND z akumulatorem                                     |
| `ORA`       | Logiczne OR z akumulatorem                                      |
| `EOR`       | Ekskluzywny OR z akumulatorem                                   |
| `BIT`       | Testowanie bitów w pamięci względem A (ustawianie flag N, V, Z) |

### Skoki i gałęzie

| Mnemoniczny | Opis                                                   |
| ----------- | ------------------------------------------------------ |
| `SKOK`      | Skok bezwarunkowy (absolutny lub pośredni)             |
| `JSR`       | Skok do podprogramu (zapisuje adres powrotu na stosie) |
| `RTS`       | Powrót z podprogramu                                   |
| `RTI`       | Powrót z przerwania                                    |
| `BNE`       | Rozgałęzienie, jeśli nie jest równe (Z=0)              |
| `BEQ`       | Gałąź, jeśli równe (Z=1)                               |
| `UDW`       | Rozgałęzienie, jeśli Carry Clear (C=0)                 |
| `BCS`       | Rozgałęzienie, jeśli zestaw Carry (C=1)                |
| `BMI`       | Gałąź jeśli minus (N=1)                                |
| `BPL`       | Rozgałęzienie jeśli Plus (N=0)                         |
| `BVC`       | Gałąź, jeśli wyczyszczono przepełnienie (V=0)          |
| `BVS`       | Gałąź, jeśli przepełnienie ustawione (V=1)             |

#### LBNE / LBEQ / … (Długie gałęzie)

*(Nowość w wersji 2.3.9.)* Kategoria palety **Długie gałęzie** zawiera osiem pseudooperacji, które zachowują się jak gałęzie warunkowe, ale docierają do **dowolnego adresu**, a nie tylko −128…+127. Każda z nich składa się do odwróconej gałęzi, która pomija 3-bajtowy `JMP` — zawsze **5 bajtów**:

```
LBEQ done      ; assembles to:   BNE *+3   ($D0 $03)
               ;                 JMP done  ($4C lo hi)
```

| Długa op | Stan                     | Wyemitowano jako    |
| -------- | ------------------------ | ------------------- |
| `LBNE`   | nierówne (Z=0)           | `BEQ *+3 / Cel JMP` |
| `LBEQ`   | równy (Z=1)              | `BNE *+3 / cel JMP` |
| `LBCC`   | przenieść czysto (C=0)   | `BCS *+3 / cel JMP` |
| `LBCS`   | zestaw przeniesień (C=1) | `BCC *+3 / cel JMP` |
| `LBMI`   | minus (N=1)              | `BPL *+3 / cel JMP` |
| `LBPL`   | plus (N=0)               | `BMI *+3 / cel JMP` |
| `LBVC`   | wyczyść nadmiar (V=0)    | `BVS *+3 / cel JMP` |
| `LBVS`   | zestaw przelewowy (V=1)  | `BVC *+3 / cel JMP` |

- Operand: etykieta, wyrażenie `*` lub adres literowy — taki sam jak normalny cel rozgałęzienia.
- Koszt: 5 bajtów i 1 dodatkowy cykl na wybranej ścieżce w porównaniu z krótką gałęzią. Nie ma automatycznej promocji krótkiej gałęzi — wybierasz jawnie `LBxx`.
- Gdy prosta gałąź (`BNE`, `BEQ`, …) wykracza poza zakres, błąd kompilatora teraz nazywa dokładne przekroczenie i sugeruje pasującą `LBxx`.

### Operacje rejestrowe

| Mnemoniczny | Opis                         |
| ----------- | ---------------------------- |
| `PODATEK`   | Przelew A → X                |
| `TAY`       | Przelew A → Y                |
| `TXA`       | Przenieś X → A               |
| `TYA`       | Przenieś Y → A               |
| `TSX`       | Wskaźnik stosu transferu → X |
| `TXS`       | Przenieś X → Wskaźnik stosu  |
| `INX`       | Zwiększ X                    |
| `ZRĘCZNOŚĆ` | Zmniejsz X                   |
| `INY`       | Zwiększ Y                    |
| `DEY`       | Zmniejszenie Y               |

### Shift & Rotate

| Mnemoniczny | Opis                             |
| ----------- | -------------------------------- |
| `ASL`       | Przesunięcie arytmetyczne w lewo |
| `LSR`       | Logiczne przesunięcie w prawo    |
| `ROL`       | Obrót w lewo przez Carry         |
| `ROR`       | Obróć w prawo przez Carry        |

### Stos

| Mnemoniczny | Opis                              |
| ----------- | --------------------------------- |
| `PHA`       | Włóż akumulator na stos           |
| `PHP`       | Przenieś status procesora na stos |
| `PLA`       | Wyciągnij akumulator ze stosu     |
| `PLP`       | Pobierz status procesora ze stosu |

### System / Flagi

| Mnemoniczny | Opis                                  |
| ----------- | ------------------------------------- |
| `CLC`       | Flaga Clear Carry                     |
| `CLD`       | Wyczyść tryb dziesiętny               |
| `CLI`       | Wyczyść Wyłącz przerwanie             |
| `CLV`       | Wyczyść flagę przepełnienia           |
| `SEK`       | Ustaw flagę przenoszenia              |
| `SED`       | Ustaw tryb dziesiętny                 |
| `SEI`       | Ustaw wyłączenie przerwania           |
| `NIE`       | Brak operacji                         |
| `BRK`       | Wymuś przerwę / przerwanie programowe |

### Nielegalne/nieudokumentowane instrukcje

Są one obsługiwane w przypadku zaawansowanego użytkowania. Należy zachować ostrożność — zachowanie może się różnić w zależności od układu.

`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`, `AXS`

---

## 9. Bloki makro — odniesienie

Bloki makro pozwalają wykonywać typowe zadania w jednym kroku – zamiast pisać 10–20 instrukcji ręcznie, wystarczy usunąć jeden blok, a asembler wygeneruje kod za Ciebie. Pomyśl o nich jak o wbudowanych podprogramach.

---

### LABEL

Podobnie jak numer wiersza ** w BASIC** — ale z nazwą zamiast numeru. Cele skoku dla `JMP`, `JSR`, `BNE` itd.

| Pole           | Opis                                             |
| -------------- | ------------------------------------------------ |
| Nazwa etykiety | Identyfikator używany w `JMP`, `JSR`, `BNE` itd. |

**Składnia ekspercka:**
```
loop:
```

**Wygenerowano ASM:**
```
loop:  ; $0820
```

Aktualny adres jest wyświetlany jako komentarz. Etykiety mają rozmiar **0 bajtów**.

---

### COMMENT

Podobnie jak **REM w BASIC** — uwaga dla Ciebie, którą asembler całkowicie ignoruje.

**Składnia ekspercka:**
```
; Your comment text here
```

**Wygenerowano ASM:**
```
; Your comment text here
```

---

### BYTE

Podobnie jak **DATA w BASIC** — przechowuje listę surowych wartości bajtów w tekście programu.

| Pole    | Opis                                                                          |
| ------- | ----------------------------------------------------------------------------- |
| Operand | Wartości bajtów rozdzielone przecinkami (np. `$01, $02, $FF` lub `1, 2, 255`) |

**Składnia ekspercka:**
```
.byte $01, $02, $FF
```

**Wygenerowano ASM:**
```
    .byte $01, $02, $FF
```

**Odwołania do etykiet bajtów niskich/wysokich: ** BYTE akceptuje tokeny `<label` (młodszy bajt) i `>label` (starszy bajt) w stylu KickAssembler/ca65 wraz z wartościami numerycznymi. Asembler rozwiązuje adres etykiety w czasie kompilacji i wstawia odpowiedni bajt. Przykład:

```
    .byte <frame_0, >frame_0, <frame_1, >frame_1
```

Przechowuje najpierw bajt młodszy adresu ramki `frame_0`, następnie bajt starszy, a potem to samo dla ramki `frame_1`. Przydatne przy tworzeniu tablic skoków i list adresowych.

**Rozmiar:** Liczba bajtów na liście.

---

### WORD

Podobnie jak **DATA w BASIC-u, ale dla liczb 16-bitowych **. Każda wartość jest przechowywana jako dwa bajty (najpierw bajt młodszy, potem bajt starszy — kolejność little-endian 6502).

| Pole    | Opis                                                            |
| ------- | --------------------------------------------------------------- |
| Operand | Wartości 16-bitowe rozdzielone przecinkami (np. `$0400, $C000`) |

**Składnia ekspercka:**
```
.word $0400, $C000
```

**Wygenerowano ASM:**
```
    .word $0400, $C000
```

**Rozmiar:** 2 bajty na słowo.

---

### FILL

Podobnie jak `FOR I=1 TO N : POKE addr+I, val : NEXT` — wypełnia blok pamięci tym samym bajtem, ale w jednym bloku. Świetnie nadaje się do czyszczenia obszarów lub wstępnego wypełniania tabel.

| Pole    | Opis                                                     |
| ------- | -------------------------------------------------------- |
| Operand | `liczba,wartość` — np. `256,0` wypełnia 256 bajtów zerem |

**Składnia ekspercka:**
```
.fill 256, $00
```

**Wygenerowano ASM:**
```
    .fill 256, $00
```

**Składnia wyrażenia: ** Zarówno `liczba`, jak i `wartość` akceptują wyrażenia arytmetyczne. Można odwoływać się do nazw stałych, używać literałów szesnastkowych/binarnych i wywoływać wbudowane funkcje matematyczne:

| Wyrażenie                     | Oznaczający                                      |
| ----------------------------- | ------------------------------------------------ |
| `LICZBA_KAFELEK, $00`         | liczenie z CONST, literał wartości szesnastkowej |
| `40*25, 0`                    | mnożenie liniowe                                 |
| `okrągły(sin(PI/4)*255), 80$` | trygonometria                                    |

**Funkcje wbudowane: ** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`, `abs()`, constant `PI`

Operatorzy: `+ - * /` Literały: `$FF` (szesnastkowy), `%10110000` (binarny) Bajt młodszy/starszy: `lo(wyrażenie)`, `hi(wyrażenie)`

**Rozmiar:** Wartość liczbowa w bajtach.

---

### ALIGN

Przesuwa bieżący adres do przodu do następnej czystej granicy, wstawiając bajty uzupełniające zerami. C64 wymaga, aby dane sprite'a zaczynały się od granicy 64 bajtów — `ALIGN 64` obsługuje to automatycznie.

| Pole    | Opis                                                                                    |
| ------- | --------------------------------------------------------------------------------------- |
| Granica | Wartość wyrównania — np. `64` (granica sprite’a), `256` (strona), `$2000` (mapa bitowa) |

**Składnia ekspercka:**
```
.align 64
.align $2000
```

**Wygenerowano ASM:**
```
    ; ALIGN 64 → $0840 (12 bytes padding)
```

**Rozmiar:** Dynamiczny — zależy od aktualnej pozycji licznika programu.

> **Wskazówka: ** Użyj `ALIGN 64` przed danymi sprite, `ALIGN 256` aby zapewnić wyrównanie tabel do stron.

---

### TEXT

Podobnie jak **PRINT AT** — zapisuje tekst bezpośrednio na ekranie C64 w podanej kolumnie i wierszu, bez użycia KERNAL-a. Generuje jedną parę LDA/STA na znak, wykorzystując pamięć RAM ekranu pod adresem `$0400`.

| Pole                       | Opis                                                     |
| -------------------------- | -------------------------------------------------------- |
| Tekst                      | Ciąg do wyświetlenia                                     |
| X                          | Kolumna (0–39)                                           |
| Y                          | Wiersz (0–24)                                            |
| Etykieta (opcjonalnie)     | Przypisuje etykietę wskazującą na obliczony adres ekranu |
| Zestaw znaków małych liter | Pole wyboru — patrz poniżej                              |

**Tryby zestawów znaków:**

W systemie C64 możliwe jest wybranie w czasie działania programu dwóch zestawów znaków:

| Tryb                                       | $D018 bit 1 | Wprowadzanie wielkich liter        | Wprowadzanie małych liter              |
| ------------------------------------------ | ----------- | ---------------------------------- | -------------------------------------- |
| **Wielkie litery/grafika** (domyślne)      | 0           | `A`–`Z` → kody ekranowe $01–$1A ✓  | traktowane również jako wielkie litery |
| **Małe/wielkie litery** (po CHARSET small) | 1           | `A`–`Z` → $01–$1A (wielkie litery) | `a`–`z` → $41–$5A (małe litery) ✓      |

- **Zestaw znaków wielkich liter (domyślny, pole wyboru niezaznaczone): ** Wpisz, co chcesz zobaczyć wielkimi literami. `„CZEŚĆ”` wyświetla się jako `CZEŚĆ`. Wprowadzanie małymi literami jest mapowane na wielkie litery w kodach ekranowych.
- **Zestaw znaków małych liter (pole wyboru zaznaczone): ** Wpisz dokładnie taką wielkość liter, jaką chcesz zobaczyć. `„hello”` → wyświetlanie małych liter, `„HELLO”` → wyświetlanie wielkich liter. Wymaga przełączenia zestawu znaków w czasie wykonywania przed zapisaniem zawartości ekranu (użyj makra **CHARSET lower**).

**Wygenerowany ASM (tryb wielkich liter, `"HELLO"`):**
```
    LDA #$08      ; 'H' screen code $08
    STA $0400
    LDA #$05      ; 'E' screen code $05
    STA $0401
    ...
```

**Składnia ekspercka:**
```
.text 0, 2, "HELLO"           ; uppercase charset (default)
.text 0, 2, "hello", lower    ; lowercase charset
```

Znaki są kodowane jako **kody ekranowe** (nie PETSCII). **Rozmiar: ** `długość tekstu × 5` bajtów (LDA + STA na znak).

---

### STRING

Podobnie jak **Wprowadzanie ciągu ** do dowolnego adresu pamięci w czasie wykonywania. Generuje pary LDA/STA, które kopiują kod ekranu każdego znaku do kolejnych adresów.

| Pole                       | Opis                                                                                            |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| Tekst                      | Ciąg do napisania                                                                               |
| Adres                      | Adres pamięci docelowej — `$C000` hex lub **nazwa etykiety**                                    |
| Etykieta (opcjonalnie)     | Przypisuje etykietę wskazującą na adres docelowy                                                |
| Zmiana                     | Wartość szesnastkowa (00–FF) dodawana do każdego bajtu kodu ekranu (np. `$80` = odwrotne wideo) |
| Zestaw znaków małych liter | Pole wyboru — ta sama semantyka co w przypadku TEKST (patrz sekcja TEKST)                       |

**Składnia ekspercka:**
```
.string $C000, "HELLO"                  ; uppercase charset (default)
.string $C000, "hello", lower           ; lowercase charset
.string $C000, "HELLO", 80             ; with shift (reverse video)
.string $C000, "hello", 80, lower      ; shift + lowercase
.string $C000, "HELLO" :my_string      ; with macroLabel
```

**Wygenerowano ASM:**
```
    LDA #$08      ; 'H' screen code
    STA $C000
    LDA #$05      ; 'E' screen code
    STA $C001
    ...
```

Znaki są kodowane jako **kody ekranowe** (nie PETSCII). Do każdego bajtu dodawana jest opcjonalna wartość **Shift**, np. `$80` dla odwróconego obrazu. **Rozmiar:** `długość tekstu × 5` bajtów (jeden LDA + jeden STA na znak).

---

### DATA

Podobnie jak pętla **POKE** — zapisuje listę surowych bajtów do adresu pamięci w czasie wykonywania, jedną parę LDA/STA na bajt.

| Pole                   | Opis                                                         |
| ---------------------- | ------------------------------------------------------------ |
| Bajty                  | Wartości bajtów rozdzielone przecinkami                      |
| Adres                  | Adres pamięci docelowej — `$C000` hex lub **nazwa etykiety** |
| Etykieta (opcjonalnie) | Przypisuje etykietę wskazującą na adres docelowy             |

**Składnia ekspercka:**
```
.data $C000, $01, $02, $03          ; hex address
.data my_buf, $01, $02, $03         ; label address
.data $C000, $01, $02, $03 :mydata  ; with macroLabel
```

**Wygenerowano ASM:**
```
    LDA #$01
    STA $C000
    LDA #$02
    STA $C001
    ...
```

**Rozmiar:** `liczba bajtów × 5` bajtów (jeden LDA + jeden STA na bajt).

---

### RAWBYTES

Podobnie jak **DATA, które ładuje się bezpośrednio do pamięci** — bez żadnego kodu wykonawczego. Bajty są obecne od momentu załadowania PRG, jeszcze przed uruchomieniem kodu. Używaj tego do danych sprite'ów, map poziomów, tabel wyszukiwania i wszystkiego, co musi znajdować się pod określonym adresem.

| Pole                   | Opis                                                         |
| ---------------------- | ------------------------------------------------------------ |
| Bajty                  | Wartości bajtów rozdzielone przecinkami                      |
| Adres                  | Adres pamięci docelowej — `$C000` hex lub **nazwa etykiety** |
| Etykieta (opcjonalnie) | Przypisuje etykietę wskazującą na adres docelowy             |

**Składnia ekspercka:**
```
.rawbytes $C000, $00, $00, $00      ; hex address
.rawbytes sprite_data, $00, $00     ; label address
.rawbytes $0C50, $00, $00 :nev      ; with macroLabel — other code can use LDA nev,X
```

**Rozmiar w kodzie: ** 0 bajtów. Dane są umieszczane pod podanym adresem na wyjściu.

> **DATA kontra RAWBYTES:** DATA generuje kod LDA/STA, który kopiuje bajty w czasie wykonywania (wolniej, ale działa, jeśli dane muszą być dynamiczne). RAWBYTES po prostu umieszcza bajty bezpośrednio — bez kodu, natychmiast, bez kosztów.

---

### RAWTEXT

Podobnie jak RAWBYTES, ale dla tekstu — koduje ciąg jako kody ekranowe i umieszcza bajty pod stałym adresem bez kodu wykonawczego ****. Tekst jest gotowy w pamięci w momencie załadowania PRG.

| Pole                       | Opis                                                                                            |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| Tekst                      | Ciąg do zakodowania                                                                             |
| Adres                      | Adres pamięci docelowej — `$C000` hex lub **nazwa etykiety**                                    |
| Etykieta (opcjonalnie)     | Przypisuje etykietę wskazującą na adres docelowy                                                |
| Zmiana                     | Wartość szesnastkowa (00–FF) dodawana do każdego bajtu kodu ekranu (np. `$80` = odwrotne wideo) |
| Zestaw znaków małych liter | Pole wyboru — ta sama semantyka co w przypadku TEKST (patrz sekcja TEKST)                       |

**Składnia ekspercka:**
```
.rawtext $C000, "HELLO"                 ; uppercase charset (default)
.rawtext $C000, "hello", lower          ; lowercase charset
.rawtext $C000, "HELLO", 80            ; with shift (reverse video)
.rawtext $C000, "hello", 80, lower     ; shift + lowercase
.rawtext $0400, "HELLO" :my_text       ; with macroLabel
```

**Wygenerowano ASM:**
```
; .rawtext "HELLO" -> $C000
; $C000
    .byte $08, $05, $0C, $0C, $0F   ; H E L L O (uppercase screen codes)

; .rawtext "hello", lower -> $C000
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; h e l l o (lowercase screen codes $41–$5A range)
```

**Rozmiar w kodzie: ** 0 bajtów. Dane są umieszczane pod podanym adresem na wyjściu.

> **STRING kontra RAWTEXT: ** STRING generuje kod LDA/STA, który kopiuje tekst w czasie wykonywania. RAWTEXT wczytuje bajty do PRG w momencie ładowania — bez kodu i czekania.

---

### PETSCII

Podobnie jak **RAWBYTES, ale dla wyjścia KERNAL ** — koduje ciąg jako bajty PETSCII (zgodne z CHROUT w `$FFD2`) i umieszcza je pod stałym adresem bez kodu wykonawczego. Użyj tego, gdy chcesz wydrukować znaki za pomocą `JSR $FFD2` w pętli, i zwróć uwagę, że nowe makro `PRINT` używa tego samego kodera i zachowania pola wyboru dla małych liter.

> **PETSCII a kody ekranowe: ** PETSCII i kody ekranowe to dwa różne kodowania. Kod ekranowy `$01` = litera A; PETSCII `$41` = litera A (przez CHROUT). Używaj PETSCII tylko podczas drukowania przez KERNAL; do zapisu bezpośrednio do pamięci RAM ekranu używaj TEXT/STRING/RAWTEXT.

| Pole                   | Opis                                                         |
| ---------------------- | ------------------------------------------------------------ |
| Tekst                  | Ciąg do zakodowania jako bajty PETSCII                       |
| Adres                  | Adres pamięci docelowej — `$C000` hex lub **nazwa etykiety** |
| Etykieta (opcjonalnie) | Przypisuje etykietę wskazującą na adres docelowy             |
| Małe litery PETSCII    | Pole wyboru — patrz poniżej                                  |

**Tryby zestawów znaków:**

| Tryb                                         | Wprowadzanie wielkich liter (`A`–`Z`)                                                                      | Wprowadzanie małymi literami (`a`–`z`) |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **Wielkie litery (domyślne, niezaznaczone)** | `$41`–`$5A` (PETSCII wielkie litery przez CHROUT)                                                          | mapowane również na `$41`–`$5A`        |
| **Małe litery (zaznaczone)**                 | Litery alfabetu są mapowane tak, aby widoczna wielkość liter była spójna w zestawie znaków małych/wielkich | Ta sama zasada                         |

**Składnia ekspercka:**
```
.petscii $C000, "HELLO"              ; uppercase PETSCII (default)
.petscii $C000, "hello", lower       ; lowercase PETSCII ($61–$7A)
.petscii $C000, "HELLO", null        ; with null terminator
.petscii $C000, "hello", lower, null ; lowercase + null terminator
.petscii $C000, "HELLO" :my_msg      ; with macroLabel
```

**Wygenerowane bajty (wielkie litery, `"CZEŚĆ"`):**
```
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; H E L L O (PETSCII $41–$5A range)
```

**Rozmiar w kodzie: ** 0 bajtów. Dane są umieszczane pod adresem docelowym jako odroczona sekcja danych (jak RAWBYTES).

**Terminator zerowy:** Zaznacz pole wyboru *„Dołącz `$00` (terminator zerowy)”*, aby automatycznie dodać bajt `$00` po tekście. Idealne dla pętli zakończonych zerem:

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

**Zasady kodowania:**

| Wejście                                      | Tryb wielkich liter                    | Tryb małych liter |
| -------------------------------------------- | -------------------------------------- | ----------------- |
| `A`–`Z`                                      | `41$`–`5$`                             | `61$`–`7$`        |
| `a`–`z`                                      | `$41`–`$5A` (wymuszone wielkie litery) | `41$`–`5$`        |
| Spacja, cyfry, znaki interpunkcyjne (32–126) | tak jak jest                           | tak jak jest      |
| Nowa linia                                   | `$0D` (ZWROT)                          | `$0D`             |
| Inny                                         | `20$` (spacja)                         | `20 dolarów`      |

> **Wskazówka: ** Użyj PETSCII do danych, które będą wyprowadzane przez CHROUT (`$FFD2`). Aby zapisać dane bezpośrednio do pamięci RAM ekranu, użyj zamiast tego STRING lub RAWTEXT.

---

### CHARSET

Przełącza pamięć ROM znaków VIC-II pomiędzy trybem wielkich liter/grafiki (domyślnie w C64) a trybem małych liter/wielkich liter, poprzez modyfikację bitu 1 parametru `$D018` w czasie wykonywania.

| Pole | Opis                                                                                                                                     |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Tryb | **Małe litery** — włącza zestaw znaków małych/wielkich liter; **Wielkie litery** — przywraca domyślny zestaw znaków wielkich/graficznych |

**Składnia ekspercka:**
```
.charset lower    ; switch to lowercase charset
.charset upper    ; switch back to uppercase/graphics charset
```

**Wygenerowano ASM:**

Tryb małych liter:
```
    LDA $D018
    ORA #$02      ; set bit 1 → lowercase/uppercase ROM at $1800
    STA $D018
```

Tryb wielkich liter:
```
    LDA $D018
    AND #$FD      ; clear bit 1 → uppercase/graphics ROM at $1000
    STA $D018
```

**Rozmiar:** 8 bajtów (LDA abs + ORA/AND imm + STA abs).

**Dlaczego ORA/AND zamiast bezpośredniego zapisu?** `$D018` steruje również lokalizacją pamięci RAM ekranu (bity 7–4). Przełączenie tylko bitu 1 zachowuje resztę rejestru.

**Typowy przepływ pracy:**

```
    CHARSET lower             ; switch to lowercase charset
    TEXT 0, 0, "hello world"  ; [checkbox: Lowercase charset]
    ...
    CHARSET upper             ; restore default when done
```

Lub w trybie eksperckim:
```
.charset lower
.text 0, 0, "hello world", lower
.charset upper
```

W trybie eksperckim blok `.charset` teraz przechodzi również przez rozwijane menu trybów, dzięki czemu podgląd bloku i eksportowany kod źródłowy pozostają wyrównane.

> **Uwaga: ** Makro CHARSET zmienia tylko wskaźnik pamięci ROM znaków VIC. Nie wywołuje `$E544` (inicjalizacja zestawu znaków KERNAL). W większości przypadków jest to wystarczające; wywołaj najpierw `JSR $E544` tylko wtedy, gdy chcesz, aby własne procedury drukowania KERNAL-a uwzględniły tę zmianę.

---

### CHARDEF

Definiuje pojedynczy niestandardowy znak 8×8 w zestawie znaków opartym na pamięci RAM. Wysyła kod inline środowiska wykonawczego, który kopiuje 8 bajtów do `base + index * 8` w momencie wykonania — bez potrzeby poprzedzania etykietą lub `ORG`.

| Pole                | Opis                                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Baza zestawu znaków | Adres bazowy zestawu znaków RAM (domyślnie `$3800`). Musi być wyrównany, aby mógł go zobaczyć komputer VIC-II (patrz poniżej). |
| Indeks znaków       | Który slot znaku zdefiniować ponownie, 0–255. `65` = 'A' w domyślnym układzie kodu ekranu.                                     |
| 8 bajtów            | Wiersze mapy bitowej rozdzielone przecinkami, od góry do dołu. Siódmy bit każdego bajtu = piksel najbardziej na lewo.          |

**Składnia ekspercka:**
```
.chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00
```

**Wygenerowany ASM (8 × `LDA #b` / `Cel STA+n`, łącznie 40 bajtów):**
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

**Adres docelowy: ** `$3800 + 65 * 8 = $3A08`. Obliczany w czasie kompilacji i zakodowany na stałe w operandach STA.

**Rozmiar: ** 40 bajtów na znak (8 × 5).

**Typowy przepływ pracy:**
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

**Kiedy używać CHARDEF a kiedy alternatyw:**

| Zbliżać się                        | Użyj kiedy                                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **CHARDEF**                        | Potrzebujesz kilku niestandardowych znaków (powiedzmy 1–20). Koszt wykonania każdego z nich wynosi 40 bajtów. |
| **RAWBYTES @ $3800**               | Masz pełny, niestandardowy zestaw znaków (256 znaków). Łącznie 2 KB danych, bez kopii w czasie wykonywania.   |
| **INCBIN „charset.bin” @ $3800**   | Zewnętrzny plik zestawu znaków (stworzony przez edytor znaków). Najczystsza opcja.                            |
| ** Zestaw znaków Canvas + INCBIN** | Pełna mapa bitowa składająca się z 256 znaków, namalowana jako jeden obraz o wymiarach 128×128.               |

> **Przypomnienie o wyrównaniu: ** VIC-II oczekuje bazy zestawu znaków jako wielokrotności `$0800`. Prawidłowe banki: `$0000`, `$0800`, `$1000`, ..., `$3800` (w ramach obecnego banku VIC o pojemności 16 KB). Zestawy znaków RAM zazwyczaj mają wartość `$2000`, `$2800`, `$3000` lub `$3800`.

---

### BOX_HIT

Test kolizji prostokątów ograniczających wyrównanych do osi (AABB) między dwoma prostokątami opisanymi 4-bajtowymi strukturami zerowej strony. Zwraca wynik w akumulatorze: **A = 1** w przypadku nakładania się, **A = 0** w przeciwnym razie. Czysty asembler inline, bez wywołania podprogramu.

| Pole                          | Opis                                                                              |
| ----------------------------- | --------------------------------------------------------------------------------- |
| Adres pocztowy Box1           | Podstawowa strona zerowej struktury 4-bajtowej pierwszego pola (domyślnie `$FB`). |
| Adres skrzynki pocztowej Box2 | Podstawa strony zerowej 4-bajtowej struktury drugiego pola (domyślnie `$F7`).     |

**Układ struktury** (4 bajty na pole, współrzędne 8-bitowe bez znaku):

| Zrównoważyć | Pole       |
| ----------- | ---------- |
| `+0`        | Lewy       |
| `+1`        | Szczyt     |
| `+2`        | Prawidłowy |
| `+3`        | Spód       |

**Składnia ekspercka:**
```
.box_hit $FB, $F7
```

**Wygenerowany ASM (30 bajtów, w pełni względny dla PC — bez podprogramów, bez skoków bezwzględnych):**
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

**Rozmiar:** 30 bajtów.

**Typowy przepływ pracy:**

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

**Ograniczenia:**
- Oba adresy strony zerowej muszą być `≤ $FC` (każde pole wymaga 4 kolejnych bajtów: `zp`, `zp+1`, `zp+2`, `zp+3`).
- Współrzędne są traktowane jako **8-bitowe bez znaku ** (0–255). W przypadku współrzędnych sprite’ów ze znakiem spoza tego zakresu należy je znormalizować przed zapisaniem.
- Jeśli zachodzi taka potrzeba, oba pola mogą na siebie nachodzić w przestrzeni ZP, zwykle jednak potrzebnych jest 8 odrębnych bajtów.

**Dlaczego nie podprogram?** Generowanie inline pozwala uniknąć obciążenia JSR/RTS (ponad 14 cykli) i utrzymuje test w pamięci podręcznej, co zapewnia ciasne pętle gry. Jeśli musisz przetestować wiele par, umieść ręcznie własny `JSR box_hit_sub` wokół pojedynczego bloku BOX_HIT.

**Porównanie z funkcją `box_hit()` w UB:** Ultimate Basic opakowuje tę samą logikę 6502, co funkcja czasu wykonania zwracająca zmienną. W VA umieszczasz BOX_HIT w miejscu, w którym potrzebujesz testu; wynik znajduje się w `A`.

---

### INCBIN

Podobnie jak **BLOAD w BASIC** — pobiera zewnętrzny plik binarny (`.bin`, `.prg`, `.sid`, `.raw`) i osadza go bezpośrednio w zmontowanym pliku PRG pod określonym adresem.

| Pole  | Opis                                                           |
| ----- | -------------------------------------------------------------- |
| Plik  | Przeglądaj, aby wybrać plik `.bin`, `.prg`, `.sid` lub `.raw`. |
| Adres | Adres obciążenia docelowego (np. `$C000`)                      |

**Składnia ekspercka:**
```
.incbin "music.bin", $C000
```

**Wygenerowany komentarz ASM:**
```
    ; INCBIN "music.bin" @ $C000 (2048 bytes)
    .byte $01, $02, ...
```

**Rozmiar w kodzie: ** 0 bajtów (sekcja danych odroczonych). Plik binarny jest osadzony pod podanym adresem.

---

### SID

Podobnie jak **BLOAD dla muzyki** — ładuje plik `.sid` do PRG i automatycznie odczytuje adresy Init i Play z nagłówka. Wywołuje Init raz podczas uruchamiania, a następnie wywołuj Play z obsługi przerwań IRQ co klatkę.

| Pole                               | Opis                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------- |
| Plik                               | Przeglądaj, aby wybrać plik `.sid`                                                                |
| Adres niestandardowy (opcjonalnie) | Zastąp natywny adres ładowania SID (np. `$1000`). Pozostaw puste, aby użyć adresu z nagłówka SID. |

Blok wyświetla:
- **Tytuł/Autor** z nagłówka SID
- **Adres ładowania** — miejsce, w którym dane są umieszczane w pamięci (adres efektywny po nadpisaniu)
- **Adres inicjalizacji** — wywołaj to za pomocą JSR, aby zainicjować muzykę (dostosowane do relokacji, jeśli używany jest niestandardowy adres)
- **Adres odtwarzania** — wywołuj to za pomocą JSR w każdej ramce w obsłudze przerwań IRQ (dostosowany do relokacji)
- Odznaka **(przeniesiony)** pojawia się, gdy niestandardowy adres przesuwa dane z ich pierwotnej pozycji

**Składnia ekspercka:**
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", $1000
```

**Wygenerowany komentarz ASM:**
```
    ; SID "Ikari_Warriors.sid" @ $1000  Init:$1000  Play:$1006  (4096 bytes)
```

**Rozmiar w kodzie: ** 0 bajtów w linii. Plik binarny SID jest umieszczany pod określonym adresem jako odroczony fragment w PRG.

> **Ważne:** Większość plików SID zawiera zakodowane na stałe wewnętrzne adresy absolutne. Można je relokować tylko wtedy, gdy cały plik binarny zostanie przesunięty o to samo przesunięcie. Jeśli SID zawiera wewnętrzne skoki do `$10xx`, musi pozostać na `$1000` — przeniesienie go na inny adres spowoduje uszkodzenie tych wewnętrznych odwołań.

> **Typowe zastosowanie:** Umieść blok ORG przed blokiem SID, aby ustawić jego adres. Wywołaj funkcję „Init” raz podczas uruchamiania, a następnie wywołaj funkcję „Odtwórz każdą klatkę” z rastrowego programu obsługi przerwań IRQ.

---

### INCLUDE

Podobnie jak **MERGE w BASIC** — wczytuje inny plik i rozszerza jego bloki w tym miejscu. Idealne dla bibliotek podprogramów wielokrotnego użytku. Dołączone bloki są dostępne tylko do odczytu w bieżącym projekcie.

Obsługiwane są dwa rodzaje plików:
- **Projekt Visual Assembler** (`.json`) — bloki projektu są wstawiane w stanie takim, jaki jest.
- **Zwykły kod źródłowy asemblera** (`.inc`, `.asm`, `.s`) — plik jest odczytywany jako tekst i parsowany w ten sam sposób, co w trybie eksperckim. Przy każdej kompilacji plik jest ponownie odczytywany z dysku (źródło prawdy = plik), dzięki czemu można go edytować zewnętrznie w dowolnym edytorze.

| Pole                        | Opis                                                                                                                                                                                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Plik                        | Przeglądaj, aby wybrać projekt `.json` lub źródło zestawu `.inc`/`.asm`/`.s`.                                                                                                                                                                                                        |
| Załaduj adres (opcjonalnie) | Jeśli ustawiono (szesnastkowo, np. `C000`), dołączone bloki są umieszczane pod tym adresem — przed nimi wstrzykiwany jest syntetyczny blok `ORG`, nadpisujący wszystkie bloki ORG w dołączonym pliku. Pozostaw puste, aby bloki ORG z dołączonego pliku kontrolowały umiejscowienie. |

**Składnia trybu eksperckiego:**
```
.include "library.json"
.include "macros.inc", $1500
.include "sprites.asm"
```

- Rozszerzenie pliku ** jest wymagane w trybie eksperckim ** — nazwa typu `.include "macros"` jest traktowana jako `.include "macros.json"`.
- Rozwiązywanie ścieżki: najpierw próbuje przejść obok pliku projektu (względnego), a następnie wraca do dołączonego katalogu aplikacji `samples/`.

**Wygenerowany ASM (bez nadpisywania adresu):**
```
    ; .include "library.json" — 12 block(s)
    ... (expanded blocks follow)
```

**Wygenerowany ASM (z adresem obciążenia `C000`):**
```
    ; .include "library.json" @ $C000 — 12 block(s)
    *=$C000
    ... (expanded blocks follow)
```

> **Wskazówka: ** Użyj polecenia INCLUDE, aby tworzyć biblioteki podprogramów wielokrotnego użytku, którymi możesz dzielić się między projektami. Pliki `.inc`/`.asm`/`.s` najlepiej sprawdzają się, gdy chcesz edytować bibliotekę w edytorze tekstu lub udostępniać ją innym asemblerom 6502; `.json`, gdy biblioteka została utworzona w samym Visual Assemblerze. Ustaw adres ładowania, gdy biblioteka nie ma własnej struktury ORG lub gdy chcesz zastąpić jej domyślne położenie.

---

### TABLE

Podobnie jak **DIM pod określonym adresem ** — nadaje nazwę tabeli odnośników i określa jej miejsce w pamięci. Umieść po niej bloki BYTE, WORD lub FILL, aby zdefiniować zawartość tabeli.

| Pole  | Opis                                                     |
| ----- | -------------------------------------------------------- |
| Nazwa | Identyfikator etykiety tabeli (np. `color_table`)        |
| Adres | Stały adres, pod którym zaczyna się tabela (np. `$C000`) |

**Składnia ekspercka:**
```
.table color_table, $C000
```

**Wygenerowano ASM:**
```
color_table:
```

Licznik programu przeskakuje do wskazanego adresu. Umieść bloki BYTE/WORD/FILL po TABELI, aby wypełnić zawartość.

**Rozmiar:** 0 bajtów.

---

### ORG

Ustawia miejsce w pamięci, w którym program (lub jego fragment) zostanie umieszczony — na przykład wybierając adres startowy przed wpisaniem kodu maszynowego. Każdy program wymaga co najmniej jednego pliku ORG. Standardowy, ładowalny kod startowy języka C64 BASIC to `$0801`.

| Pole      | Opis                                                                                        |
| --------- | ------------------------------------------------------------------------------------------- |
| Adres     | Nowy adres źródłowy (np. `0801` w formacie szesnastkowym lub `2049` w formacie dziesiętnym) |
| HEX / DEC | Przełączaj wprowadzanie adresu między wyświetlaniem szesnastkowym i dziesiętnym             |

**Składnia ekspercka:**
```
* = $C000
```

**Wygenerowano ASM:**
```
* = $C000
```

**Rozmiar: ** 0 bajtów. Sam blok ORG nie generuje kodu maszynowego.

Każdy blok ORG rozpoczyna nową sekcję. Kolejne bloki są składane, zaczynając od tego adresu. Podczas eksportu pliku PRG wszystkie sekcje są scalane w jeden plik — przerwy między sekcjami są wypełniane zerami.

**Przykład — kod w `$0801`, tabela danych w `$C000`:**
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

> **Wskazówka: ** Każdy program musi zaczynać się od bloku ORG. Typowy adres startowy programu ładowalnego w języku C64 BASIC to `$0801` (2049 w systemie dziesiętnym). Po włączeniu **instancji stub BASIC SYS**, asembler dodaje krótką linię kodu BASIC pod adresem `$0801`, a kod zaczyna się od `$080D`.

---

### LOOP / NEXT

Podobnie jak **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** w języku BASIC — odlicza od N do 1 przy użyciu rejestru X lub Y. Usuń blok LOOP, umieść swoje instrukcje między nim a NEXT, a blok automatycznie wykona odpowiednią liczbę pętli.

#### LOOP

| Pole     | Opis                                                               |
| -------- | ------------------------------------------------------------------ |
| Rejestr  | `X` lub `Y` — rejestr licznika                                     |
| Liczyć   | Liczba iteracji pętli (szesnastkowa lub dziesiętna, np. `0A` = 10) |
| Etykieta | Automatycznie wygenerowana etykieta pętli (np. `loop0`)            |

**Składnia ekspercka:**
```
.loop X, 10, loop0
```

**Wygenerowano ASM:**
```
    LDX #$0A
loop0:
```

**Rozmiar:** 2 bajty (kod operacji LD_ + bezpośredni operand).

#### NEXT

| Pole     | Opis                                      |
| -------- | ----------------------------------------- |
| Rejestr  | Automatycznie dopasowane do rejestru LOOP |
| Etykieta | Automatycznie powiązane z etykietą LOOP   |

**Składnia ekspercka:**
```
.next loop0
```

**Wygenerowano ASM:**
```
    DEX
    BNE loop0
```

**Rozmiar:** 3 bajty (DEX + BNE + przesunięcie gałęzi).

**Przykład — wyczyść 10 komórek ekranu:**
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

Podobnie jak **`FOR X=0 TO N-1 : ... : NEXT X`** w języku BASIC — zlicza *w górę* od 0. Idealne, gdy potrzebujesz indeksu do przodu, np. podczas przechodzenia przez ciąg lub tablicę.

#### FOR

| Pole     | Opis                                                                                   |
| -------- | -------------------------------------------------------------------------------------- |
| Rejestr  | `X` lub `Y` — rejestr licznika                                                         |
| Liczyć   | Limit pętli (szesnastkowy lub dziesiętny, np. `$12` = 18). X/Y działa od 0 do limit-1. |
| Etykieta | Automatycznie wygenerowana etykieta pętli (np. `dla0`)                                 |

**Składnia ekspercka:**
```
.for X, $12, for0
```

**Wygenerowano ASM:**
```
    LDX #$00
for0:
```

**Rozmiar:** 2 bajty (kod operacji LD_ + `#$00`).

#### ENDF

| Pole     | Opis                                       |
| -------- | ------------------------------------------ |
| Rejestr  | Automatycznie dopasowane do rejestru FOR   |
| Etykieta | Automatycznie powiązane z etykietą FOR     |
| Liczyć   | Automatycznie skopiowane z sparowanego FOR |

**Składnia ekspercka:**
```
.endf for0
```

**Wygenerowano ASM:**
```
    INX
    CPX #$12
    BNE for0
```

**Rozmiar:** 5 bajtów (IN_ + CP_ #imm + przesunięcie BNE).

**Przykład — wydrukuj ciąg zakończony zerem: **
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

> **LOOP vs FOR: ** LOOP odlicza w dół (N→1) — dobre do opóźnień, wypełnień i pętli pikseli. FOR odlicza w górę (0→N) — dobre do dostępu do ciągów znaków/tablic. Oba mogą używać X lub Y.

---

### PUSH / PULL

Podobnie jak **zapisywanie zmiennych przed GOSUB i przywracanie ich po ** — ale wykorzystuje stos sprzętowy 6502. Jeśli podprogram używa A, X lub Y, należy go opakować za pomocą PUSH i PULL, aby zachować rejestry kodu wywołującego.

#### PUSH

Umieszcza jeden lub więcej rejestrów na stosie. Kolejność jest zawsze następująca: A → X → Y (najpierw najbardziej wewnętrzny).

| Pole     | Opis                                                       |
| -------- | ---------------------------------------------------------- |
| Rejestry | Dowolna kombinacja: `A`, `X`, `Y`, `AX`, `AY`, `XY`, `AXY` |

**Składnia ekspercka:**
```
.push AXY
```

**Wygenerowany ASM (przykład: `AX`):**
```
    PHA
    TXA
    PHA
```

**Rozmiar:** 1 bajt dla A (`PHA`), 2 bajty dla X lub Y (transfer + push).

#### PULL

Przywraca rejestry ze stosu w **odwrotnej kolejności** (Y → X → A).

| Pole     | Opis                                                         |
| -------- | ------------------------------------------------------------ |
| Rejestry | Tak samo jak PUSH — musi pasować do odpowiedniego bloku PUSH |

**Składnia ekspercka:**
```
.pull AXY
```

**Wygenerowany ASM (przykład: `AX`):**
```
    PLA
    TAX
    PLA
```

> **Zasada: ** Funkcje PUSH i PULL muszą zawsze używać **tego samego zestawu rejestrów **. `PUSH AX` → `PULL AX` (wewnętrznie przywraca w odwrotnej kolejności: najpierw X, potem A).

---

### END / alias RTS

Podobnie jak **RTS z przyjaźniejszą nazwą makra ** — `.end` emituje pojedynczy bajt `RTS` i zachowuje się jak krótki terminator podprogramu w trybie eksperckim.

**Składnia ekspercka:**
```
.end
```

**Wygenerowano ASM:**
```
    RTS
```

**Rozmiar:** 1 bajt.

Użyj tego, jeśli chcesz uzyskać znacznik końca podprogramu, który wygląda bardziej jak makro niż surowa instrukcja.

---

### MACRO / ENDM / INVOKE

Podobnie jak **nazwany GOSUB z parametrami ** — zdefiniuj fragment kodu wielokrotnego użytku raz (MACRO…ENDM), a następnie wywołaj go w dowolnym miejscu za pomocą INVOKE. Przekazuj za każdym razem różne wartości argumentów zamiast kopiować i wklejać bloki.

#### MAKRO (początek definicji)

| Pole      | Opis                                                                                  |
| --------- | ------------------------------------------------------------------------------------- |
| Nazwa     | Identyfikator makra (np. `setColor`)                                                  |
| Parametry | Opcjonalne nazwy parametrów rozdzielone przecinkami (np. `kolor` lub `kolor, liczba`) |

Oznacza początek definicji makra. Bloki między MACRO a ENDM stanowią treść makra — **nie generują żadnego kodu** w miejscu, w którym znajduje się definicja. Użyj `{paramName}` jako symbolu zastępczego dla argumentów.

**Wygenerowano ASM:**
```
; .MACRO setColor (color)
    ... (body blocks)
; .ENDM
```

**Składnia trybu eksperckiego:**
```
.macro setColor color
    LDA {color}
    STA $D020
.endm
```

#### ENDM (koniec definicji)

Zamyka bieżącą definicję makra. Brak pól.

#### INVOKE

Wywołuje zdefiniowaną makroinstrukcję w tym miejscu i podstawia podane wartości argumentów w miejsce symboli zastępczych `{paramName}` w treści.

| Pole        | Opis                                                                                         |
| ----------- | -------------------------------------------------------------------------------------------- |
| Nazwa makra | Wybierz z listy rozwijanej zdefiniowanych makr                                               |
| Argumenty   | Wartości argumentów rozdzielone przecinkami, pasujące do listy parametrów makra (np. `#$07`) |

**Wygenerowano ASM:**
```
; .invoke setColor(#$07)
    LDA #$07
    STA $D020
```

**Składnia trybu eksperckiego:**
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

Treść makra jest rozwijana w linii, a `{paramName}` jest zastępowane rzeczywistymi argumentami. Akceptowana jest również forma rozdzielona spacjami (`.invoke setColor #$07`).

**Typy argumentów:**
- **Numeryczne**: `#$07`, `$10`, `255` — wartości szesnastkowe lub dziesiętne
- **Ciągi tekstowe**: `„Witaj, świecie!”` — ciągi w cudzysłowie; przecinki w cudzysłowie są traktowane jako część tekstu, a nie jako separatory argumentów
- **Mieszane**: `#$07, „cześć”, $20` — dowolna kombinacja

> **Wskazówka: ** Zdefiniuj makra na górze (lub na dole) programu, a następnie WYWOŁUJ je w razie potrzeby. Makra można wywoływać wielokrotnie z różnymi argumentami.

---

### REGION / ENDREGION

Grupowanie czysto wizualne — **zero bajtów**, zero wpływu na kod asemblera. Jak złożenie sekcji programu BASIC w nazwany blok, aby móc go zwinąć i skupić się na czymś innym.

| Pole          | Opis                                                                           |
| ------------- | ------------------------------------------------------------------------------ |
| Nazwa regionu | Etykieta tekstu dowolnego dla sekcji (np. `init`, `game_loop`, `sprite_setup`) |

**Składnia ekspercka:**
```
.region init
    ; blocks...
.endregion
```

**Kontrolki w nagłówku bloku REGION (zawsze widoczne):**
- **▸ / ▾ przełącznik** — zwija lub rozwija cały region. Po zwinięciu wszystkie bloki między REGION i ENDREGION są ukryte.
- **↕ Rozwiń wszystko** — przywraca każdy indywidualnie zwinięty blok wewnątrz regionu i rozszerza sam region, jeśli jest to konieczne.
- **⦵ Wybierz w ASM** — zaznacza cały zakres kodów regionu w widoku ASM (od `; ===[ nazwa ]===` do `; ===[/ nazwa]===`) i przewija do niego. Przełącza automatycznie na kartę ASM, jeśli nie jest ona obecnie widoczna.
- **⧉ Kopiuj region** — kopiuje blok REGION, wszystkie bloki podrzędne i pasujący do niego ENDREGION do schowka. Mignięcie ✓ potwierdza kopiowanie.
- **⎘ Wklej region** — wstawia skopiowany region jako nowy region bezpośrednio za regionem ENDREGION bieżącego regionu i przewija do niego. Przycisk jest przyciemniony, dopóki region nie zostanie skopiowany.

**Wygenerowano ASM:**
```
; region init
    SEI
    LDA #$00
    STA $D020
; endregion init
```

**Rozmiar:** 0 bajtów dla regionu REGION i ENDREGION.

**Przykładowy przepływ pracy: **
1. Dodaj blok `REGION`, ustaw nazwę regionu na `init`.
2. Poniżej dodaj instrukcje inicjalizacji.
3. Dodaj blok `ENDREGION`, aby zamknąć sekcję.
4. Kliknij ▸ w REGIONIE, aby zwinąć całą sekcję do jednego wiersza podczas pracy nad innymi częściami programu.

> **Uwaga: Regiony ** mogą być **zagnieżdżane** w sobie. Każdy ENDREGION zamyka najbliższy otwarty REGION. Nie ma to wpływu na zmontowany wynik.

---

### DEFINE / IF / ELSE / ENDIF

Podobnie jak **przełącznik, który asembler odczytuje ** — `DEFINE DEBUG` włącza symbol, a następnie dowolny blok `IF DEBUG` jest uwzględniany, a jego gałąź `ELSE` jest pomijana. Usunięcie bloku DEFINE powoduje, że blok IF znika z wyników. Nie ma potrzeby usuwania kodu w kompilacjach do wydania.

#### DEFINE

| Pole   | Opis                                                                                                   |
| ------ | ------------------------------------------------------------------------------------------------------ |
| Symbol | Jeden lub więcej identyfikatorów rozdzielonych przecinkami do aktywacji (np. `DEBUG` lub `DEBUG, PAL`) |

**Składnia ekspercka:**
```
.define DEBUG, PAL
```

**Wygenerowano ASM:**
```
; .DEFINE DEBUG
; .DEFINE DEBUG, PAL
```

Blok `DEFINE` może aktywować wiele symboli jednocześnie (rozdzielonych przecinkami). Umieść bloki DEFINE na górze programu. Usunięcie bloku natychmiast dezaktywuje wszystkie jego symbole.

#### IF

| Pole | Opis                                                                                |
| ---- | ----------------------------------------------------------------------------------- |
| Stan | Identyfikator do przetestowania (musi pasować do symbolu `DEFINE`, aby był aktywny) |

**Składnia ekspercka:**
```
.if DEBUG
```

**Wygenerowano ASM:**
```
; .IF DEBUG
```

Bloki pomiędzy `IF` i `ENDIF` (lub `ELSE`) są uwzględniane lub pomijane w zależności od tego, czy symbol warunku ma w programie odpowiadający mu `DEFINE`. Pominięte bloki są wyświetlane jako komentarze `; [IF skiped] …` i generują **zerowe bajty**.

#### ELSE

Brak pól. Oznacza gałąź alternatywną — montowaną, gdy warunek `JEŻELI` jest *nie* aktywny.

**Składnia ekspercka:**
```
.else
```

**Wygenerowano ASM:**
```
; .ELSE
```

#### ENDIF

Brak pól. Zamyka blok warunkowy.

**Składnia ekspercka:**
```
.endif
```

**Wygenerowano ASM:**
```
; .ENDIF
```

**Rozmiar:** 0 bajtów dla wszystkich czterech bloków. Liczy się tylko zawartość *pomiędzy*.

**Przykład — debugowanie granicy flash, kompilacja wydania pomija to:**
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

**Przykład — wiele symboli w jednym bloku DEFINE:**
```
; .DEFINE DEBUG, PAL

; .IF PAL
    LDA #$xx        ; PAL timing constant
; .ELSE
    LDA #$xx        ; NTSC timing constant
; .ENDIF
```

Obsługiwane są zagnieżdżone bloki `IF`. Jeśli pominięty zostanie blok zewnętrzny, pominięte zostaną również bloki wewnętrzne.

> **Uwaga: ** To jest obsługa warunków w czasie kompilacji. Informacje na temat porównywania/rozgałęziania w czasie wykonania można znaleźć poniżej w sekcji **Instrukcje IF / ELSE / ENDIF w czasie wykonania **.

### .ASSERT

*(Nowość w wersji 2.3.9.)* **Sprawdzanie poprawności w czasie kompilacji**. `.assert` ocenia wyrażenie podczas asemblacji; jeśli jest ono fałszywe (`0`), kompilacja zatrzymuje się z wyraźnym błędem zawierającym rzeczywistą wartość. Jeśli jest ono prawdziwe (różne od zera), nie jest emitowane.

| Pole      | Opis                                                                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Wyrażenie | Dowolne wyrażenie asemblera: etykiety, `CONST`s, `*` (licznik programów), arytmetyka i porównania (`&lt;`, `&lt;=`, `&gt;`, `&gt;=`, `==`, `!=`) |
| Wiadomość | Opcjonalny tekst dołączony do komunikatu o błędzie                                                                                               |

**Składnia ekspercka:**
```
.assert spriteData < $C000
.assert * < $A000
.assert end - start <= 256, "sprite table overflowed one page"
```

**Zachowanie:**

- **Rozmiar:** 0 bajtów.
- Fałszywe potwierdzenie przerywa montaż: `` `.assert end - start &lt;= 256` jest fałszywe (wartość: 0). Tabela sprite'ów przepełniła się o jedną stronę ``
- Twierdzenie, którego nie można ocenić (niezdefiniowana etykieta itp.) również kończy się niepowodzeniem, z komunikatem *„nie można ocenić w momencie montażu”*.
- Porównania dają `1` / `0`; umieść `.assert` w dowolnym miejscu przebiegu programu — jest on sprawdzany pod adresem, pod którym się znajduje, więc `.assert * &lt; $D000` testuje bieżącą pozycję wyjściową.

**Przykład — ochrona bloku sprite'ów przed przekroczeniem strony:**
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

Podobnie jak **zmienna o nazwie, która nigdy się nie zmienia** — `SCREEN = $0400`. Użyj nazwy zamiast wpisywać wszędzie surowe adresy, dzięki czemu kod będzie łatwiejszy do odczytania i późniejszej modyfikacji.

| Pole    | Opis                                                                                                                                  |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Nazwa   | Identyfikator stałej (np. `SCREEN`)                                                                                                   |
| Wartość | Wartość liczbowa w wybranej bazie (np. `0400` w formacie HEX = adres $0400) lub wyrażenie względne względem komputera (patrz poniżej) |
| Format  | HEX lub DEC — kontroluje sposób wprowadzania i wyświetlania wartości                                                                  |

**Składnia ekspercka:**
```
.const SCREEN = $0400
.const FRAMES_1S = 60
```

**Wygenerowano ASM:**
```
; .CONST SCREEN = $0400
```

Nazwa stałej pojawia się w menu rozwijanym **selektora etykiet** w blokach instrukcji — wystarczy ją kliknąć, aby wstawić.

**Wyrażenia względne względem PC (`*+N` / `*-N`):**

Pole wartości akceptuje również `*+N` lub `*-N`, gdzie `*` to adres kompilacji samego bloku CONST. Służy to do utworzenia nazwanego aliasu dla bajtu w pobliskiej instrukcji — klasyczny wzorzec kodu samomodyfikującego:

```
CONST op = *+1      ; op → address of the immediate operand of the next LDA
LDA #$00            ; $00 will be patched at runtime
...
STA op              ; overwrites the #$00 byte → LDA reads the new value next time
```

CONST emituje 0 bajtów, etykieta w momencie kompilacji zmienia się na `current_address + 1`.

**Wyrażenia arytmetyczne:**

Pole wartości akceptuje ogólne działania arytmetyczne, w tym odwołania do wcześniej zdefiniowanych nazw CONST, literałów szesnastkowych/binarnych i wbudowanych funkcji matematycznych:

```
.const SCREEN      = $0400
.const SCREEN_END  = SCREEN + 40*25   ; 1000 bytes later
.const COLOR_RAM   = $D800
.const MID_X       = 160
.const SIN_TABLE   = round(sin(PI/8) * 127)   ; pre-computed sine value
```

**Funkcje wbudowane: ** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`, `abs()`, constant `PI`

Operatorzy: `+ - * /` Literały: `$FF` (szesnastkowy), `%10110000` (binarny) Bajt młodszy/starszy: `lo(wyrażenie)`, `hi(wyrażenie)`

**Rozmiar:** 0 bajtów.

---

### VAR

Podobnie jak **CONST, ale automatycznie przydzielane ** — `VAR` rezerwuje miejsce na stronie zerowej dla etykiety bez konieczności wpisywania adresu. Używaj go do liczników, wskaźników i krótkotrwałych stanów, które należą do ZP.

| Pole                  | Opis                                                                          |
| --------------------- | ----------------------------------------------------------------------------- |
| Nazwa                 | Nazwa/etykieta zmiennej                                                       |
| Rozmiar (opcjonalnie) | Liczba bajtów do zarezerwowania. Pomiń, jeśli chcesz zarezerwować jeden bajt. |

**Składnia ekspercka:**
```
.var counter
.var timer, 2
.var lives
```

**Przykład praktyczny: **
```
.region Vars
.var counter
.var timer, 2
.endregion

LDA #$00
STA counter
```

**Wygenerowano ASM:**
```
; .var counter
```

**Rozmiar: ** domyślnie 1 bajt lub `N` bajtów, gdy określono rozmiar.

Alokator przesuwa konfigurowalny kursor strony zerowej (`$02` do `$FE`) i przypisuje kolejny wolny slot. Jeśli żądany region nakłada się na już używaną etykietę, kompilator generuje ostrzeżenie.

---

### Czas wykonania IF / ELSE / ENDIF

Podobnie jak **prawdziwy szablon gałęzi** — ta wersja działa w czasie wykonywania, a nie kompilacji. Porównuje `A`, `X` lub `Y` z wartością bezpośrednią i generuje poprawną sekwencję gałęzi `CMP` / `CPX` / `CPY` za Ciebie.

| Pole     | Opis                                          |
| -------- | --------------------------------------------- |
| Rejestr  | `A`, `X` lub `Y`                              |
| Operator | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=`  |
| Wartość  | Wartość natychmiastowa w formacie HEX lub DEC |

**Składnia ekspercka:**
```
.if A == #$10
    LDA #$07
.else
    LDA #$0F
.endif
```

**Rozmiar: ** Zależy od wybranych gałęzi i formy porównania.

Porównanie jest domyślnie bez znaku. W przypadku `&lt;=` i `&gt;` makro rozszerza się do najkrótszego równoważnego łańcucha rozgałęzień dla wybranego rejestru.

---

### WHILE / ENDW

Podobnie jak **pętla czasu wykonania z testem na górze** — treść jest wykonywana tak długo, jak długo warunek pozostaje prawdziwy.

| Pole     | Opis                                          |
| -------- | --------------------------------------------- |
| Rejestr  | `A`, `X` lub `Y`                              |
| Operator | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=`  |
| Wartość  | Wartość natychmiastowa w formacie HEX lub DEC |

**Składnia ekspercka:**
```
.while A != #$00
    JSR getchar
.endw
```

**Rozmiar:** Zależy od treści pętli i formy porównania.

Użyj `WHILE`, jeśli pętla może zakończyć się przed zakończeniem pierwszej iteracji. Jest to odpowiednik w czasie wykonywania funkcji pomocniczej `LOOP/NEXT` opartej na zliczaniu.

---

### REPEAT / UNTIL

Podobnie jak **pętla czasu wykonania z testem na dole** — treść zawsze jest uruchamiana co najmniej raz, a następnie warunek decyduje, czy się zatrzymać.

| Pole     | Opis                                          |
| -------- | --------------------------------------------- |
| Rejestr  | `A`, `X` lub `Y`                              |
| Operator | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=`  |
| Wartość  | Wartość natychmiastowa w formacie HEX lub DEC |

**Składnia ekspercka:**
```
.repeat
    JSR getchar
.until A == #$00
```

**Rozmiar:** Zależy od treści pętli i formy porównania.

Użyj `REPEAT / UNTIL`, jeśli chcesz, aby treść została wykonana co najmniej raz przed sprawdzeniem wyjścia.

---

### MEMCPY / MEMSET

Podobnie jak **małe procedury pamięci, po które ciągle sięgasz** — `MEMCPY` kopiuje ciągły blok, `MEMSET` wypełnia zakres jednym bajtem.

| Makro    | Pola                          |
| -------- | ----------------------------- |
| `MEMCPY` | `źródło`, `dst`, `rozmiar`    |
| `MEMSET` | `adres`, `wartość`, `rozmiar` |

**Składnia ekspercka:**
```
.memcpy src=$C000, dst=$D000, size=$0100
.memset addr=$0400, value=#$20, size=$03E8
```

**Wygenerowano pętle ASM:** kopiowania/wypełniania w tekście, dobrane tak, aby odpowiadały żądanemu rozmiarowi.

Rozmiary do 256 bajtów korzystają z krótkiej pętla 8-bitowej. Większe rozmiary automatycznie przełączają się na licznik 16-bitowy.

---

### PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY / SET_BORDER / SET_BG

#### PRINT

Podobnie jak wyjście **PETSCII bez szablonu ** — drukuje ciąg znaków przez `CHROUT` z takim samym traktowaniem wielkich i małych liter jak w bloku PETSCII. Pole wyboru małych liter jest współdzielone z koderem PETSCII, dzięki czemu ścieżka tekstowa pozostaje spójna.

**Składnia ekspercka:**
```
.print "HELLO"
.print "hello", lower
```

#### PRINT_CHAR

Drukuje jeden bajt PETSCII według kodu numerycznego i wysyła go przez `CHROUT`. Wartość może być również nazwaną stałą lub etykietą, która w momencie montażu jest przekształcana na bajt, zarówno w trybie blokowym, jak i eksperckim.

**Składnia ekspercka:**
```
.print_char 65
.print_char $41
.print_char color
```

#### PRINT_HEX

Drukuje 8-bitową wartość jako tekst szesnastkowy poprzez normalną ścieżkę wyjściową KERNAL.

**Składnia ekspercka:**
```
.print_hex A
```

#### CLEAR_SCREEN

Skrót do standardowego kodu sterującego czystym ekranem w C64.

**Składnia ekspercka:**
```
.clear_screen
```

#### WAIT_KEY

Czeka, aż zostanie naciśnięty klawisz, dzięki czemu nie musisz ręcznie powtarzać pętli `GETIN` za każdym razem.

**Składnia ekspercka:**
```
.wait_key
```

#### DELAY

Oczekuje żądaną liczbę klatek w ramach współdzielonej procedury pomocniczej. Używaj tego w przypadku krótkich przerw i przerw w synchronizacji, gdy pełna pętla niestandardowa byłaby przesadą. Liczba klatek może być liczbą całkowitą lub stałą o określonej nazwie, a `.wait` to po prostu alias `.delay`.

**Składnia ekspercka:**
```
.delay 29
.wait 29
.delay frames=FRAMES_1S
```

W trybie blokowym pole opóźnienia wykorzystuje kompaktowy selektor const, gdy dostępna jest wartość symboliczna, dzięki czemu nie musisz za każdym razem wpisywać nazwy ręcznie.

#### SET_BORDER / SET_BG

Wygodne wrappery dla rejestrów kolorów VIC-II. Wartość koloru może być liczbą bezwzględną lub nazwaną stałą z zakresu 0–15. Zarówno tryb blokowy, jak i tryb ekspercki akceptują tutaj symboliczne nazwy stałych.

**Składnia ekspercka:**
```
.set_border 6
.set_bg 0
.set_border color
.set_bg color
```

**Rozmiar:** Każdy pomocnik rozszerza się do małej sekwencji zapisu do rejestru lub krótkiego wywołania KERNAL.

W trybie blokowym pola te korzystają także z selektora const, dzięki czemu wartość symboliczna pozostaje widoczna i nie jest zastępowana przez surową liczbę.

---

### IRQ_SETUP

Konfiguruje obsługę przerwań rastrowych w jednym kroku. Makro zapisuje wektor IRQ, włącza przerwania rastrowe, ustawia linię, wyłącza typowe źródła IRQ CIA i powraca do normalnego wykonywania za pomocą `CLI`.

| Pole   | Opis                                                                |
| ------ | ------------------------------------------------------------------- |
| Treser | Etykieta procedury IRQ (np. `my_irq`)                               |
| Raster | Linia rastrowa w systemie szesnastkowym lub dziesiętnym (np. `$FA`) |

**Składnia ekspercka:**
```
.irq_setup handler=my_irq, raster=$FA
```

**Rozmiar:** Krótka sekwencja ustawień; dokładna długość zależy od wybranej linii rastrowej.

Użyj tego, jeśli chcesz mieć standardowy kod „SEI / install handler / enable IRQ / CLI” bez rozpraszania go po całym programie.

---

### RAND

Podobnie jak **niewielki wbudowany PRNG** — zwraca 8-bitową pseudolosową wartość z kompaktowego ziarna zerowej strony.

| Pole     | Opis                                                          |
| -------- | ------------------------------------------------------------- |
| Nasienie | Opcjonalny bajt lub etykieta zerowej strony (domyślnie `$FB`) |

**Składnia ekspercka:**
```
.rand
```

**Rozmiar:** Kilka bajtów, w zależności od wybranej ścieżki implementacji.

Generator jest przeznaczony do rozgrywki, modyfikacji efektów i szybkiego testowania danych. Jest celowo niewielki, a nie kryptograficznie skomplikowany.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Konfiguruje sprite'a VIC-II w jednym bloku — zamiast pisać ~6 poleceń POKE w BASIC-u, wystarczy wypełnić pola. Ustawia wskaźnik danych sprite'a, włącza go, opcjonalnie włącza tryb wielokolorowy i ustawia jego kolor.

| Pole          | Opis                                                                      |
| ------------- | ------------------------------------------------------------------------- |
| Sprite #      | Numer duszka 0–7                                                          |
| Kolor         | Indeks kolorów 0–15 (paleta C64)                                          |
| Strona danych | Adres danych sprite'a / 64 (np. `$21`, jeśli dane znajdują się w `$0840`) |
| Wielobarwność | Przełącza wielokolorowy bit sprite'a (`$D01C`)                            |

**Składnia ekspercka:**
```
.sprite_init 0, 7, $21
.sprite_init 0, 7, $21, multicolor
.sprite_init 0, 7, $21, mono
```

**Wygenerowano ASM:**
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

**Rozmiar:** 26 bajtów.

> **Strona danych sprite'a: ** `adres_danych ÷ 64`. Z domyślnym stubem BASIC SYS, `ALIGN 64` po `JMP main` umieszcza dane sprite'a w `$0840` → strona = `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Podobnie jak **`POKE 53248, x : POKE 53249, y`** w BASIC-u — ustawia pozycję początkową sprite'a. Współrzędne są wbudowywane w trakcie montażu, a pola akceptują stałe w trybie blokowym; do animacji użyj `INC`/`DEC` bezpośrednio w rejestrze sprite'a.

| Pole     | Opis                  |
| -------- | --------------------- |
| Sprite # | Numer duszka 0–7      |
| X        | Pozycja pozioma 0–319 |
| Y        | Pozycja pionowa 0–255 |

**Składnia ekspercka:**
```
.sprite_pos 0, 152, 100
```

**Wygenerowany ASM (przykład: sprite 0, X=152, Y=100):**
```
    LDA #$98        ; X low byte
    STA $D000       ; sprite 0 X register
    LDA $D010
    AND #$FE        ; clear X MSB for sprite 0 (X ≤ 255)
    STA $D010
    LDA #$64        ; Y = 100
    STA $D001       ; sprite 0 Y register
```

W przypadku X > 255 makro ustawia odpowiedni bit w `$D010` zamiast go czyścić.

**Rozmiar:** 18 bajtów.

> **Uwaga: ** `SPRITE_POS` wstawia współrzędne X/Y do kodu (`LDA #$xx`). Aby animować sprite'a w czasie wykonywania, użyj `INC $D000` / `DEC $D000` — zobacz przykład `sprite-macro-demo`.

---

<a id="wait_raster"></a>
### WAIT_RASTER

Czeka, aż wiązka elektronów VIC-II dotrze do określonej linii skanowania – jak synchronizacja z ramką telewizora. Umieść to na początku pętli gry, aby zapobiec rozrywaniu sprite'ów. Bez JSR, bez etykiety.

| Pole           | Opis                                                                    |
| -------------- | ----------------------------------------------------------------------- |
| Linia rastrowa | Docelowa linia rastrowa w formacie szesnastkowym (np. `FF` = linia 255) |

**Składnia ekspercka:**
```
.wait_raster $FF
```

**Wygenerowano ASM:**
```
wait:
    LDA $D012       ; current raster line
    CMP #$FF        ; target line
    BNE wait        ; loop back (-7 bytes)
```

**Rozmiar: ** 7 bajtów (przesunięcie `BNE` `$F9` = −7 zawsze wskazuje z powrotem na `LDA`).

> **Wskazówka:** Umieść `WAIT_RASTER` na górze pętli gry, aby zsynchronizować ją z wyświetlaczem i zapobiec rozrywaniu się sprite'ów.

---

### JOYSTICK

Jak odczyt **`PEEK($DC00)`**, a następnie POKE-owanie pozycji sprite'a — ale w jednym bloku. Odczytuje jeden port joysticka CIA i odpowiednio dostosowuje rejestry X/Y sprite'a. Całkowicie inline, bez potrzeby JSR.

| Pole     | Opis                                                                       |
| -------- | -------------------------------------------------------------------------- |
| Port     | `1` = port 1 (`$DC01`) lub `2` = port 2 (`$DC00`)                          |
| Sprite # | Numer duszka 0–7 (kontroluje, która para rejestrów X/Y jest aktualizowana) |

**Składnia ekspercka:**
```
.joystick 2, 0
```

**Wygenerowany ASM (port 2, sprite 0):**
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

**Mapa bitów joysticka (aktywny-NISKI — bit = 0 oznacza wciśnięty):**

| Fragment | Kierunek   | Rejestr CIA                               |
| -------- | ---------- | ----------------------------------------- |
| 0        | W górę     | $DC00 (port 2) / $DC01 (port 1)           |
| 1        | W dół      |                                           |
| 2        | Lewy       |                                           |
| 3        | Prawidłowy |                                           |
| 4        | Ogień      | (nieobsługiwane przez tę makroinstrukcję) |

**Rozmiar: ** 27 bajtów. Przesunięcie `BCS` zawsze wynosi `+3` (pomija następującą 3-bajtową instrukcję `DEC`/`INC abs`).

> **Typowe zastosowanie:** Umieść w etykiecie `gameloop` najpierw `WAIT_RASTER`:
> ```
> gameloop:
>     WAIT_RASTER ($FF)
>     JOYSTICK (port=2, sprite=0)
>     JMP gameloop
> ```

---

<a id="mouse"></a>
### MOUSE

Odczytuje dane z myszy proporcjonalnej Commodore 1351 i przesuwa sprite'a. Całkowicie **inline** — bez JSR ani etykiety. Makro wybiera port CIA, czeka na ustabilizowanie się sygnałów wejściowych z łopatki SID, a następnie dekoduje ruch delta za pomocą standardowego wzorca sterownika 1351 i stosuje go do rejestrów sprite'a.

| Pole      | Opis                                                                                     |
| --------- | ---------------------------------------------------------------------------------------- |
| Port      | `1` = CIA `$DC00` bitów `7:6` = `%01`; `2` = `%10`                                       |
| Sprite #  | Numer duszka 0–7                                                                         |
| Bajt ZP X | Adres strony zerowej (szesnastkowy) do przechowywania poprzedniej próbki POTX (np. `FD`) |
| Bajt ZP Y | Adres strony zerowej (szesnastkowy) do przechowywania poprzedniej próbki POTY (np. `FE`) |

**Wygenerowany kształt ASM (port 1, sprite 0, ZP `$FD`/`$FE`):**

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

**Rozmiar:** 142 bajty.

**Składnia trybu eksperckiego:**
```
.mouse port, spriteNum, zpX, zpY
; example:
.mouse 2, 0, FD, FE
```

> **Ważne:** Przed pierwszym wywołaniem zainicjuj bajty strony zerowej bieżącymi wartościami POTX/POTY, aby uniknąć przeskoku w pierwszej ramce:
> ```
>     ; port 1: LDA $DC00 : AND #$3F : ORA #$40 : STA $DC00
>     ; port 2: LDA $DC00 : AND #$3F : ORA #$80 : STA $DC00
>     LDA $D419 : LSR A : AND #$3F : STA $FD
>     LDA $D41A : LSR A : AND #$3F : STA $FE
> ```

> **Wskazówka:** Odczytuj ruch myszy raz na klatkę — umieść `WAIT_RASTER` w pętli gry przed `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Podobnie jak **`PEEK($D01E)`** w BASIC-u — sprawdza rejestry kolizji sprzętowych VIC-II i informuje, czy sprite uderzył w inny sprite lub tło. Całkowicie inline, bez potrzeby JSR.

| Pole        | Opis                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------- |
| Sprite #    | Numer duszka 0–7 (bit, który duszek należy sprawdzić)                                             |
| Typ kolizji | `Sprite-Sprite ($D01E)` — kolizja z innym sprite'em; `Sprite-Tło ($D01F)` — kolizja z grafiką tła |

**Składnia ekspercka:**
```
.sprite_col 0, sprite
.sprite_col 0, background
```

**Wygenerowany ASM (sprite 0, sprite–sprite):**
```
    LDA $D01E       ; read sprite-sprite collision register (clears it!)
    AND #$01        ; isolate bit 0 (sprite 0)
                    ; A ≠ 0 → collision occurred
```

**Rozmiar:** 5 bajtów.

> **Ważne:** Odczytanie `$D01E`/`$D01F` **czyści rejestr**. Odczytuj go raz na klatkę i natychmiast wykonaj działanie na wyniku za pomocą `BEQ`/`BNE`.

**Typowe zastosowanie:**
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

> **Zobacz także:** `przykład kolizji` — zielona kula (sprite #0) kontra czerwony krzyż (sprite #1).

---

### LOADFILE

Podobnie jak **`LOAD „plik”, 8`** w BASIC-u — ładuje plik z dysku D64 w czasie wykonywania za pomocą procedury KERNAL LOAD. Użyj tej funkcji, aby załadować dane, muzykę lub dodatkowy kod z dysku podczas działania programu.

| Pole                         | Opis                                                                                                                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nazwa pliku                  | Nazwa pliku na dysku (maks. 16 znaków, automatycznie wielkie litery; filtrowane są znaki `,`, `"`, `/`, `\`, `:`, `*`, `?`, `&lt;`, `&gt;`, `|`)                                                              |
| Urządzenie                   | Numer urządzenia 8–30 (domyślnie `8`)                                                                                                                                                                         |
| Zastąp adres (opcjonalnie)   | Adres ładowania szesnastkowego (np. `C000`). Jeśli ustawiony, plik jest ładowany pod ten adres (`sec=0`, ignorując nagłówek PRG). Pozostaw puste, aby użyć własnego 2-bajtowego nagłówka PRG pliku (`sec=1`). |
| Etykieta błędu (opcjonalnie) | Jeśli ustawione, instrukcja `BCS` jest generowana po JSR LOAD. Jeśli KERNAL zwróci wartość z ustawionym przeniesieniem (błąd), wykonanie zostanie przeskoczone do tej etykiety.                               |

**Składnia ekspercka:**
```
.loadfile "DEMO-COLORS", 8
.loadfile "DEMO-COLORS", 8, $C000
.loadfile "DEMO-COLORS", 8, $C000, error_label
```

**Wygenerowana struktura kodu: **
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

**Rozmiar: ** `3 + długość_nazwy_pliku + 9 (SETNAM) + 9 (SETLFS) + (4 w przypadku nadpisania) + 5 (WCZYTAJ) + (2 w przypadku etykiety błędu) ` bajtów. Minimum 27 bajtów.

> **Ważne:** Nazwa pliku jest zapisywana w kodzie maszynowym zaraz po `JMP skip_filename`. Nazwa pliku na dysku musi być zapisana wielkimi literami PETSCII — co odpowiada wielkim literom w ASCII (`A`–`Z`). Makro wymusza to automatycznie.

> **Zawsze używaj etykiety błędu** w programach produkcyjnych — jeśli plik nie zostanie znaleziony, KERNAL ustawia flagę przeniesienia, a wykonywanie zostaje przerwane i przechodzi do następnego kroku.

> **Zobacz także:** `przykład loadfile-demo` — demonstruje ładowanie `DEMO-COLORS.PRG` z D64 z gałęzią błędu BCS i wizualnym ekranem błędu.

---

### EXODECRUNCH

Dekompresja Exomizera w programie ****. Użyj tej makry zaraz po poleceniu `LOADFILE`, które załadowało strumień skompresowany w trybie Exomizera `mem` — EXODECRUNCH rozpakuje ją wstecz do adresu osadzonego w strumieniu.

| Pole           | Opis                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| Adres depakera | Miejsce w pamięci, w którym znajduje się kod depakera (domyślnie `B000`). Musi to być 16-bitowy adres szesnastkowy. |

**Składnia ekspercka:**
```
.exodecrunch
.exodecrunch depacker=$B000
```

**Wygenerowany kod (19 bajtów):**
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

**Jak to działa:**

1. KERNAL `LOAD` ($FFD5) aktualizuje ZP `$AE/$AF` do punktu znajdującego się jeden za ostatnim załadowanym bajtem. EXODECRUNCH kopiuje to do ZP `$04/$05`, co jest oficjalną konwencją wstecznego kodu źródłowego Exomizera.
2. Depaker jest zazwyczaj umieszczony w `$B000` (w regionie mapowanym na ROM BASIC). Makro przełącza `$01 = $36`, aby procesor widział tam pamięć RAM podczas JSR, a następnie przywraca `$01 = $37`.
3. Adres docelowy dekompresji jest **kodowany w samym strumieniu skompresowanym** podczas kompresji za pomocą `exomizer mem -l <load> plik,<target>` — depaker odczytuje go z pierwszych bajtów strumienia.

**Plik binarny depakera: ** wstępnie skompilowany depaker wsteczny to `samples/exo-decrunch.bin` (477 bajtów, ORG $B000). Jest to wersja Kick Assemblera oficjalnego pliku `exodecrunch.asm` z dodanym do każdego odczytu kodem `INC $D020`, aby uzyskać widoczny efekt flashowania obramowania podczas dekompresji. Umieść go w swoim programie z blokiem `INCBIN` pod adresem depakera.

**Kompensacja przesunięcia bezpieczeństwa:** Domyślny tryb pamięci Exomizera stosuje 2-bajtowe przesunięcie bezpieczeństwa — dane trafiają 2 bajty wcześniej niż żądany cel. Okno dialogowe „Uruchom przez D64” **automatycznie dodaje 2 do pola Dst ** przed wywołaniem Exomizera, więc widoczne zachowanie jest zgodne z wpisanym adresem.

> **Zobacz także:** przykład `exo-multicolor-demo` — pełny przykład od początku do końca: WCZYTAJ skompresowaną wielokolorową mapę bitową do $C000, EXODECRUNCH rozpakowuje ją do $2000, następnie kopiuje ekran → $0400 i kolor → $D800, a następnie przełącza VIC-II w tryb wielokolorowej mapy bitowej.

> **Test integracji: ** `test cargo --test exomizer_integration` (w `src-tauri/`) weryfikuje pełną kompresję i dekompresję w emulatorze 6502 z rzeczywistym plikiem binarnym depakera. Kryteria zaliczenia: 10000 bajtów, co odpowiada bajtowi źródłowemu `multi-color.bin`.

---

### REU_CHECK

Wykrywa, czy podłączona jest jednostka rozszerzeń pamięci RAM Commodore (REU) — na przykład sprawdza obecność sprzętu w rejestrze `PEEK($D010)`. Testy polegają na zapisie i odczycie dwóch wzorców do rejestru REU `$DF04`.

| Pole | Opis           |
| ---- | -------------- |
| Nic  | Brak operandów |

**Wygenerowany kod (34 bajty):**
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
> Makro normalizuje wynik, więc poniższa gałąź pozostaje prosta: `BNE` oznacza obecność REU, `BEQ` oznacza brak REU.

**Składnia ekspercka:**
```
.reu_check
```

**Wynik we flagach: **
- **Z = 0** (wynik ≠ 0) → obecność REU → użycie `BNE`
- **Z = 1** (wynik = 0) → brak REU → użyj `BEQ`

**Brak pól konfigurowalnych** — makro generuje ten sam kod za każdym razem.

**Typowe zastosowanie:**
```assembly
REU_CHECK
BEQ no_reu        ; skip if REU not present
; ... REU code here ...
no_reu:
```

---

### REU_STASH / REU_FETCH / REU_SWAP

Transfer bloku DMA między pamięcią RAM komputera C64 a pamięcią rozszerzeń REU — jak bardzo szybka pętla POKE, ale procesor nie wykonuje żadnej pracy (układ REU kopiuje dane, gdy procesor jest zatrzymany). Transfer `$1000` bajtów jest praktycznie natychmiastowy.

| Makro       | Kierunek             | Polecenie `$DF01` |
| ----------- | -------------------- | ----------------- |
| `REU_STASH` | Pamięć RAM C64 → REU | `90 dolarów`      |
| `REU_FETCH` | REU → Pamięć RAM C64 | `91 dolarów`      |
| `REU_SWAP`  | Pamięć RAM C64 ↔ REU | `92 dolary`       |

**Pola: **

| Pole      | Opis                                               | Przykład |
| --------- | -------------------------------------------------- | -------- |
| Adres C64 | Źródło/cel w pamięci RAM C64 (hex)                 | `C000`   |
| Adres REU | Źródło/cel w REU (szesnastkowo, 16-bit)            | `0000`   |
| Bank REU  | Bank pamięci REU (0–7)                             | `0`      |
| Długość   | Liczba bajtów do przesłania (szesnastkowo, 16-bit) | `1000`   |

**Składnia ekspercka:**
```
.reu_stash $C000, $0000, 0, $1000
.reu_fetch $C000, $0000, 0, $1000
.reu_swap $C000, $0000, 0, $1000
```

**Wygenerowany kod (40 bajtów):**
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

> **Uwaga: polecenia ** używają `$90/$91/$92` (ustawiony bit 4 = natychmiastowy tryb DMA). Zapis do `$DF01` rozpoczyna transfer; procesor wznawia działanie po jego zakończeniu.

---

### TURBO_SET

Ustawia prędkość procesora **Ultimate-64 (U64)** za pomocą rejestru `$D031`. Nie ma to wpływu na prawdziwy C64 ani inne emulatory.

**Pola: **

| Pole      | Opis                         | Zakres                                      |
| --------- | ---------------------------- | ------------------------------------------- |
| Prędkość  | Wskaźnik prędkości procesora | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz        |
| Zła linia | Emulacja Badline             | Włączone (zgodne z C64) / Wyłączone (turbo) |

Bajt prędkości obliczany jest w następujący sposób: `(speedIndex &amp; 0x0F) | (badline_disabled ? 0x80 : 0x00)`.

**Wygenerowany kod (5 bajtów):**
```
A9 xx   LDA #speed_byte
8D 31 D0   STA $D031
```

**Składnia trybu eksperckiego:**
```
.turbo_set 7,0    ; speed=7 (~10 MHz), badline enabled
.turbo_set 15,1   ; speed=15 (~48 MHz), badline disabled
```

> **Uwaga: ** Ta makroinstrukcja dotyczy tylko sprzętu U64. Na prawdziwym C64 lub innych emulatorach zapisuje ona do `$D031`, co może mieć wpływ na CIA lub zostać zignorowane.

---

### SUPERCPU_DETECT

Sprawdza, czy zainstalowany jest akcelerator **CMD SuperCPU** — na przykład `PEEK($D0B8)`, aby sprawdzić, czy zwraca on coś innego niż `$FF`.

**Wygenerowany kod (5 bajtów):**
```
AD B8 D0   LDA $D0B8
C9 FF      CMP #$FF
```

**Wynik we flagach: **
- **Z = 0** → obecny SuperCPU → użyj `BNE`
- **Z = 1** → Nie znaleziono SuperCPU → użyj `BEQ`

**Brak pól konfigurowalnych.**

**Składnia ekspercka:**
```
.supercpu_detect
```

**Typowe zastosowanie:**
```assembly
SUPERCPU_DETECT
BEQ no_scpu       ; skip if SuperCPU not present
; ... SuperCPU turbo code here ...
no_scpu:
```

---

### TURBO_ENABLE

Włącza lub wyłącza tryb turbo **CMD SuperCPU**. Najpierw wywołaj `SUPERCPU_DETECT` i pomiń tę czynność, jeśli SuperCPU nie jest obecny.

| Tryb     | Rejestr | Efekt                              |
| -------- | ------- | ---------------------------------- |
| Włączać  | `$D07A` | Włącz turbo (do 20 MHz z SuperCPU) |
| Wyłączyć | `$D07B` | Powrót do trybu zgodności 1 MHz    |

**Wygenerowany kod (5 bajtów):**
```
A9 00         LDA #$00
8D 7A D0      STA $D07A    ; (or $D07B for disable)
```

**Składnia trybu eksperckiego:**
```
.turbo_enable on
.turbo_enable off
```

> **Uwaga:** Najpierw wywołaj `SUPERCPU_DETECT` i rozgałęzij się wokół tej makroinstrukcji, jeśli SuperCPU nie jest obecny.

---

<a id="map_copy"></a>
### MAP_COPY

Kopiuje mapę kafelków z adresu źródłowego do pamięci RAM ekranu (i opcjonalnie pamięci RAM kolorów) za pomocą serii pętli `LDA abs,X` / `STA abs,X`. Każda iteracja pętli kopiuje jedną stronę 256-bajtową; część strony na końcu zatrzymuje się za pomocą `CPX #rem / BNE`. JSR nie jest potrzebny — cały kod jest generowany inline.

| Pole                   | Opis                                                                                                                                                                                   |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Adres źródłowy (ekran) | Adres szesnastkowy, pod którym znajdują się dane mapy po załadowaniu (np. `C000`)                                                                                                      |
| Pamięć RAM ekranu dest | Gdzie kopiować kody ekranowe (np. `0400`)                                                                                                                                              |
| Rozmiar (bajty)        | Łączna liczba bajtów do skopiowania — typowo `$03E8` = 1000 (40×25 znaków)                                                                                                             |
| Połączony .bin         | Po zaznaczeniu tej opcji oczekuje kodów ekranowych bezpośrednio po danych o kolorze w `źródło + rozmiar`; kopiuje dane o kolorze do **docelowa pamięć RAM kolorów** w drugim przebiegu |
| Pamięć RAM koloru      | Miejsce docelowe dla danych o kolorze — domyślne `D800` (pamięć RAM kolorów C64)                                                                                                       |

**Wygenerowany ASM (mapa 1000-bajtowa, tylko ekran):**
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

**Rozmiar: ** `2 (LDX) + pełne strony×9 + (rem &gt; 0 ? 11 : 0)` bajtów na sekcję. Tryb łączony podwaja tę liczbę (sekcja ekranu + sekcja identycznego koloru).

**Parowanie z edytorem map:**

Edytor Map **Pliki → Zapisz mapę + pamięć RAM kolorów (.bin)** eksportuje pojedynczy plik binarny, w którym pierwsze `size` bajtów to kody ekranu, a kolejne `size` bajtów to wartości pamięci RAM kolorów. Użyj MAP_COPY z zaznaczoną opcją **Combined .bin** i wskaż **Adres źródłowy** miejsce, w którym załadowany jest ten plik (np. przez INCBIN w `$C000`):

```
* = $C000
    INCBIN "map-color.bin" @ $C000   ; screen codes $C000–$C3E7, color $C3E8–$C7CF
* = $0801
    ; ...
    MAP_COPY src=$C000 dst=$0400 size=1000 combined color_dst=$D800
```

**Składnia trybu eksperckiego:**
```
.map_copy $C000, $0400, 1000               ; screen only
.map_copy $C000, $0400, 1000, auto, $D800  ; combined (color at src+size)
.map_copy $C000, $0400, 1000, $C3E8, $D800 ; explicit color source address
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Kopiuje obszar znaków o wymiarach 16×16 z kompaktowego, 256-bajtowego bloku kodu ekranowego oraz pasującego do niego 256-bajtowego bloku pamięci RAM kolorów. Jest przeznaczony do eksportów kanw Charset i małych fragmentów kafelków/obrazów, gdzie zapis szesnastu oddzielnych wierszy MAP_COPY byłby uciążliwy.

**Domyślny układ: **

| Dane                                | Domyślny adres                |
| ----------------------------------- | ----------------------------- |
| Kody ekranowe 16×16                 | Adres źródłowy (`źródło`)     |
| 16×16 wartości kolorów              | `źródło + 256`                |
| Miejsce docelowe pamięci RAM ekranu | `$0400 + wiersz×40 + kolumna` |
| Miejsce docelowe pamięci RAM koloru | `$D800 + wiersz×40 + kolumna` |

**Składnia trybu eksperckiego:**
```
.map_copy16x16 $3000, 12, 4
.map_copy16x16 $3000, 12, 4, $0400, $3100, $D800
```

Krótsza wersja kopiuje bajty ekranu z `$3000`, bajty koloru z `$3100` i umieszcza blok 16×16 w kolumnie 12, wierszu 4. Prawidłowe pozycje w lewym górnym rogu to `col = 0..24` i `row = 0..9`, więc cały obszar 16×16 pozostaje na ekranie tekstowym C64 o wymiarach 40×25.

**Wygenerowane zachowanie: **

- Generuje szesnaście kopii wierszy.
- Każdy wiersz kopiuje 16 bajtów ekranu i 16 bajtów koloru.
- JSR nie jest potrzebny; kod jest emitowany bezpośrednio w pozycji makra.
- Działa w trybie znakowym normalnym i wielokolorowym. Bajty pamięci RAM kolorów przenoszą bit włączający kolor znaku/wielokolorowość każdej komórki.

Typowe parowanie z Charset Canvas:

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

Przesuwa klatkę animacji sprite'a przy każdym wywołaniu i aktualizuje wskaźnik danych sprite'a VIC-II. Przechowuje jeden bajt na klatkę w tabeli (numer strony danych sprite'a = `data_address / 64`), wskazuje na niego SPRITE_ANIM i wywołuje go raz na klatkę gry — bez potrzeby JSR.

| Pole              | Opis                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| Sprite #          | Numer duszka 0–7                                                                                       |
| Adres listy ramek | Adres szesnastkowy tabeli ramek — jeden bajt na ramkę, każdy bajt = strona sprite'a (`data_addr / 64`) |
| Liczba klatek     | Łączna liczba klatek (1–255)                                                                           |
| Rama ZP           | Bajt strony zerowej używany jako licznik ramek (np. `FB`)                                              |

**Wygenerowany ASM (sprite 0, 4 klatki, ZP `$FB`, lista w `$C100`):**
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

**Rozmiar:** 19 bajtów.

**Typowe zastosowanie:**
```
frameTable:
    .byte $21, $22, $23, $24   ; 4 frames at $0840, $0880, $08C0, $0900

gameloop:
    WAIT_RASTER ($FF)
    SPRITE_ANIM (sprite=0, list=$C100, count=4, zp=$FB)
    JMP gameloop
```

**Składnia trybu eksperckiego:**
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; example:
.sprite_anim 0, C100, 4, FB
```

> **Wskazówka: ** Umieść tablicę ramek jako blok RAWBYTES pod stałym adresem. Bajt licznika ZP (`$FB`) musi zostać zainicjowany wartością `$00` przed pierwszym wywołaniem. Jeśli Twój kod używa `$FB` do czegoś innego, wybierz wolną lokalizację ZP.

---

<a id="score_bcd"></a>
### SCORE_BCD

Dodaje wartość stałego punktu do wielobajtowego wyniku BCD przechowywanego w pamięci, a następnie renderuje każdą cyfrę do pamięci RAM ekranu jako znak kodu ekranu. Używa trybu dziesiętnego 6502 (`SED`/`CLD`) do arytmetyki BCD z zachowaniem przenoszenia — bez konieczności ręcznego żonglowania przeniesieniami.

| Pole         | Opis                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------ |
| Adres wyniku | Adres szesnastkowy bajtów wyniku BCD (np. `C200`). Najpierw bajt młodszy.                  |
| Cyfry        | Liczba bajtów BCD (każdy bajt zawiera dwie cyfry: `$99` = "99"). `4` bajtów = do 99999999. |
| Dodaj punkty | Wartość dziesiętna do dodania podczas każdego wywołania (np. `100`).                       |
| Adres ekranu | Gdzie wpisać kody ekranowe cyfr (np. `0400`). Jeden bajt na cyfrę (najpierw wyższy bit).   |

**Składnia ekspercka:**
```
.score_bcd $C200, 4, 100, $0400
```

**Wygenerowany ASM (4 bajty, +100 punktów, wynik na poziomie `$C200`, ekran na poziomie `$0400`):**
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

**Rozmiar:** `3 + cyfry×8` bajtów (narzut SED + CLC + CLD + 8 bajtów na bajt BCD dla ADC + pętla wyświetlania).

**Składnia trybu eksperckiego:**
```
.score_bcd $C200, 4, 100, $0400
```

> **Wskazówka: ** Zainicjuj bajty wyniku do `$00` podczas uruchamiania. Adres wyniku powinien znajdować się na stronie zerowej lub w pamięci RAM bezwzględnej — a nie ROM. Adres ekranu powinien wskazywać na skrajnie lewą komórkę cyfrową; cyfry są zapisywane od lewej do prawej (najbardziej znaczący bajt na początku).

> Zakres **BCD: ** `cyfry = 4` bajtów → 8 cyfr dziesiętnych → maks. wynik 99 999 999. Każdy bajt koduje dwie cyfry BCD: `$00`–`$99`.

---

## 10. Integracja debugera

Aplikacja obsługuje **RetroDebugger** jako zewnętrzny debugger C64. Otrzymuje punkty przerwania, symbole i flagi autostartu generowane z asemblowanego programu.

### RetroDebugger

[RetroDebugger](https://github.com/slajerek/RetroDebugger) to wieloplatformowy debugger Commodore 64 z obsługą punktów przerwania, inspekcją pamięci i deasemblacją uwzględniającą etykiety.

**Konfiguracja: ** Otwórz **Ustawienia → Skonfiguruj plik wykonywalny RetroDebugger ** i skieruj go do pliku binarnego `RetroDebugger`.

**Uruchomienie:** Kliknij **Debugowanie (RetroDebugger)** na pasku narzędzi. Aplikacja:

1. Zmontuj program do pliku `.prg` w katalogu tymczasowym.
2. Napisz plik **punktów przerwania** (`breakpoints.txt`) — jeden `punkt przerwania $ADDR` na każdy oflagowany blok.
3. Zapisz plik **symbols** (`symbols.txt`) w formacie etykiet Vice/RetroDebugger (`al C:addr .name`). Zawiera wszystkie bloki LABEL i CONST.
4. Napisz także sidecary w stylu C64Debugger obok skompilowanego PRG: `.dbg`, `.sym` i `.vs`.
5. Uruchom RetroDebugger za pomocą:
   ```
   RetroDebugger -prg <file.prg> -breakpoints <breakpoints.txt> -symbols <symbols.txt> [flags]
   ```

### Bloki punktów przerwania

Kliknij ikonę punktu przerwania (●) w dowolnym bloku instrukcji, aby przełączyć go na punkt przerwania. Bloki z punktami przerwania są podświetlone na czerwono. Ich adresy są zapisywane w pliku punktów przerwania przy każdym uruchomieniu debugera.

### Flagi debugera (zakładka Opcje)

| Dźwignia kolankowa | Flaga          | Efekt                                                             |
| ------------------ | -------------- | ----------------------------------------------------------------- |
| `-jmp` WŁ.         | `-jmp $ADDR`   | Przejdź bezpośrednio do adresu startowego programu po załadowaniu |
| `-wznów` WŁ.       | `-wznów`       | Natychmiast wyłącz debugger po załadowaniu                        |
| `-czekaj` WŁ.      | `-czekaj <ms>` | Odczekaj `<ms>` milisekund przed wznowieniem — 500 ms lub 1000 ms |

> **Wskazówka: ** W przypadku większości programów włącz `-jmp` i `-unpause`, aby uzyskać natychmiastowy autostart. Użyj `-wait 500` lub `-wait 1000`, gdy program konfiguruje przerwania IRQ lub muzykę SID, która wymaga czasu na zainicjowanie przed pierwszym rastrem.

---

## 11. Linki do bazy wiedzy

Szybkie łącza referencyjne dostępne w aplikacji w zakładce **Baza wiedzy**:

| Ratunek                            | Adres URL                                      |
| ---------------------------------- | ---------------------------------------------- |
| Odniesienie do kodów operacji 6502 | http://www.6502.org/tutorials/6502opcodes.html |
| Funkcje jądra C64                  | https://sta.c64.org/cbm64krnfunc.html          |
| Mapa pamięci C64                   | https://sta.c64.org/cbm64mem.html              |
| Kody kolorów C64                   | https://sta.c64.org/cbm64col.html              |
| Artykuł VIC-II                     | https://www.cebix.net/VIC-Article.txt          |
| Baza kodów C64                     | https://codebase.c64.org/                      |
| Turbomontażysta                    | https://turbo.style64.org/                     |
| RetroDebugger                      | https://github.com/slajerek/RetroDebugger/     |

---

## 12. Eksport i uruchomienie D64

Wersja 1.5.1 wprowadza możliwość spakowania programu (oraz dodatkowych plików danych) do obrazu dysku C64 D64 i uruchomienia go w programie VICE — lub wyeksportowania obrazu dysku do wykorzystania w innym miejscu.

### Przycisk Split Run

Przycisk **Uruchom** na pasku narzędzi został zastąpiony podzielonym przyciskiem **:

| Część                  | Działanie                                 |
| ---------------------- | ----------------------------------------- |
| **▶ Uruchom** (główny) | Wykonuje aktualnie wybrany tryb działania |
| **▾** (strzałka)       | Otwiera selektor trybu                    |

**Dostępne tryby pracy: **

| Tryb                    | Opis                                                                                                                                                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Uruchom jako PRG**    | Zmontuj do tymczasowego pliku `.prg` i uruchom VICE bezpośrednio. Klasyczne zachowanie.                                                                                                                                                               |
| **Uruchom przez D64**   | Zmontuj, zbuduj obraz dysku `.d64` (używając c1541), dodaj wszelkie skonfigurowane pliki dodatkowe, a następnie uruchom VICE z dysku. Używaj tej opcji za każdym razem, gdy program ładuje pliki w czasie wykonywania (np. za pomocą makra LOADFILE). |
| **Uruchom na sprzęcie** | Zmontuj do formatu PRG i wyślij do urządzenia **1541 Ultimate / Ultimate 64 ** przez sieć lokalną. Zobacz [Sekcję 13](#13-hardware-settings).                                                                                                         |

Wybrany tryb jest zapisywany pomiędzy sesjami.

### Eksportuj do okna dialogowego D64

Otwórz za pomocą menu rozwijanego **Zapisz PRG ▾** → **Eksportuj do D64**. Okno dialogowe umożliwia:

1. Ustaw nazwę dysku **** (maks. 16 znaków) i nazwę programu **** — są to nazwy, które pojawiają się w katalogu dysku C64.
2. **Dodaj dodatkowe pliki** — kliknij **+**, aby wybrać dowolny plik binarny (`.prg`, `.bin`, `.sid` itd.). Dla każdego dodatkowego pliku:
   - **Nazwa** — jak jest wyświetlana w katalogu D64 (maks. 16 znaków, automatycznie wielkie litery).
   - **Addr** (adres ładowania, opcjonalnie) — jeśli podano, na początku dodawany jest 2-bajtowy nagłówek PRG. Pozostaw puste, aby zapisać surowe bajty bez nagłówka.
   - **Dst** (cel dekompresji, tylko z EXO) — miejsce, w którym depaker powinien umieścić dane na C64. Po włączeniu EXO, dane dodatkowe są kompresowane za pomocą pliku `exomizer mem -l <Addr>, <Dst>` przed zapisaniem na D64. Kompensacja przesunięcia bezpieczeństwa +2 jest stosowana automatycznie.
   - **EXO** — pole wyboru, które włącza wsteczne przetwarzanie danych w trybie `mem` dla tego wpisu. Rozmiar na dysku wynosi zazwyczaj 5–20% oryginału.
3. Kliknij **Eksportuj**, aby wygenerować plik `.d64` przy użyciu narzędzia `c1541` programu VICE.

**Parowanie z EXODECRUNCH:** po wysłaniu pliku z parametrem EXO=on, program odczytujący plik powinien go ZAŁADOWAĆ na adres **Addr** (sec=1, własny nagłówek PRG pliku), a następnie wywołać makro **EXODECRUNCH**, aby rozpakować go wstecz do **Dst**. Pełny schemat znajdziesz w przykładzie `exo-multicolor-demo`.

### Metadane D64 w projektach

Nazwa dysku, nazwa programu i lista dodatkowych plików są zapisywane w pliku JSON projektu (pod kluczem `d64`). Po ponownym załadowaniu projektu lub próbki zawierającej metadane D64, dodatkowe dane są przywracane automatycznie — nie ma potrzeby ich ponownego dodawania za każdym razem.

Przykład **loadfile-demo** jest wstępnie skonfigurowany z plikiem `DEMO-COLORS.PRG` jako dodatkowym plikiem. Wybierz go, otwórz **Uruchom przez D64** i kliknij **Uruchom**, aby zobaczyć pełny przepływ ładowania w akcji.

> **Wymagania: ** Eksport D64 i uruchamianie przez D64 wymagają skonfigurowania VICE (`c1541`) w [Ustawieniach sprzętu](#13-hardware-settings).

### Edytor D64 (przeglądanie i edycja istniejącego obrazu dysku)

Ikona na pasku narzędzi po Edytorze Krzywych otwiera **Edytor D64** — samodzielne narzędzie do pracy bezpośrednio z istniejącym obrazem `.d64`, niezależnie od aktualnie otwartego programu. W przeciwieństwie do okna dialogowego Eksportuj do D64 (które zawsze tworzy *nowy* dysk ze skompilowanego pliku PRG), Edytor D64 edytuje obraz dysku na miejscu za pomocą `c1541`, pełniąc więc również funkcję lekkiego menedżera dysków.

**Pliki ▾ menu:**

| Przedmiot          | Działanie                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------- |
| **Nowy D64…**      | Wybierz ścieżkę docelową i utwórz tam nowy, sformatowany, pusty obraz dysku.              |
| **Otwórz D64…**    | Wybierz istniejący plik `.d64` i załaduj jego katalog.                                    |
| **Zapisz jako…**   | Skopiuj aktualnie otwarty obraz dysku do nowej ścieżki i kontynuuj edycję kopii.          |
| **Uruchom w VICE** | Uruchom aktualnie otwarty obraz dysku bezpośrednio w programie VICE (`-drive8type 1541`). |

**Pasek narzędzi: **

| Ikona                     | Działanie                                                                  |
| ------------------------- | -------------------------------------------------------------------------- |
| **Dodaj program**         | Wybierz plik lokalny i zapisz go w katalogu na dysku.                      |
| **Wyodrębnij wybrane**    | Zapisz wybrane bajty wpisu w lokalnym pliku `.prg`.                        |
| **Zmień nazwę wybranego** | Edytuj nazwę wpisu w tabeli — Enter potwierdza, Escape anuluje.            |
| **Usuń wybrane**          | Usuń wybrany wpis z dysku.                                                 |
| **Odśwież**               | Ponownie odczytaj katalog, np. po edycji dysku za pomocą innego narzędzia. |

**Dodawanie programu:** wybranie pliku, który kończy się już na `.prg` wymaga jedynie podania **Nazwy** i **Typu** dysku (PRG/SEQ/USR/REL) — plik `.prg` zawiera już własny nagłówek adresu ładowania, więc jest on zapisywany bez zmian. Wybranie dowolnego innego pliku (np. surowego pliku `.bin`) dodatkowo wyświetla:

- **Adres ładowania** (szesnastkowy, opcjonalnie) — dodaj 2-bajtowy nagłówek PRG na tym adresie; pozostaw puste, aby zapisać surowe bajty.
- **Adres dekompresji** (szesnastkowy, opcjonalny) — używany tylko w połączeniu z Exomizerem; adres docelowy, do którego dekompresor powinien rozpakować dane.
- Pole wyboru **Exomizer** — kompresuj plik przed zapisem, używając tych samych trybów kompresji `mem`/`sfx`, co w przypadku dodatkowych plików w oknie dialogowym Eksportuj do D64 powyżej.

W spisie katalogów nazwy plików są wyświetlane w tej samej czcionce i wielkimi literami, co w prawdziwym spisie C64 `LOAD"$",8`.

> **Wymaganie: **, podobnie jak w przypadku eksportu do D64, edytor D64 wymaga VICE (`c1541`) skonfigurowanego w [Ustawieniach sprzętowych](#13-hardware-settings). Każda czynność (dodawanie/usuwanie/zmiana nazwy/wyodrębnianie) jest wykonywana bezpośrednio na pliku `.d64` na dysku — nie ma osobnego kroku „zapisu”.

---

## 12b. Eksport CRT (wkład Magic Desk 64K)

**Menu → Kompilacja → Kompilacja CRT** generuje obraz kartridża Commodore 64 (`.crt`, **typ kartridża 19 — Magic Desk / Domark / HES Australia**), który działa na komputerach VICE, TheC64, prawdziwym sprzęcie za pośrednictwem EasyFlash / Kung Fu Flash oraz 1541 slotach kartridży Ultimate II+. Jest dostępny zarówno w trybie blokowym ****, jak i w trybie eksperckim ****, a od momentu kompilacji również w trybie Ultimate Basic **.

### Co znajduje się w koszyku

- **8 × 8 banków KB** przy `$8000`, przełączanie banków za pomocą `$DE00` (konwencja Magic Desk: 3 najniższe bity = bank, bit 7 = wyłączony moduł).
- **Bank 0** zawiera nagłówek 128-bajtowy + program ładujący:
  - Wektory zimnego i ciepłego startu `$8000/$8002` wskazują na `$8009`.
  - `$8004–$8008` = podpis `CBM80` wymagany przez kod resetujący KERNAL.
  - `$8009–$807F` = ładowarka: SEI / stack init / `JSR $FDA3` (IOINIT) / `JSR $FD50` (RAMTAS) / `JSR $FD15` (RESTOR) / `JSR $FF5B` (CINT), a następnie pętla kopiowania bajtów, która przesyła strumieniowo ładunek z pamięci ROM karty do pamięci RAM i przełącza banki, gdy `$FC` osiągnie `$A0`. Na końcu kopiuje malutki **stykowy kod wyjściowy ** do `$0100`, wyłącza wózek za pomocą `LDA #$80 : STA $DE00` i wykonuje `JMP`s do punktu wejścia.
- **Ładunek** zaczyna się od `$8080` w banku 0 i w razie potrzeby przelewa się do banków 1–7. Maksymalny ładunek = `8 * 8192 − 128 = 65 408 bajtów`.

### Adres załadunku i punkt wejścia

Kompilacja CRT nigdy nie korzysta z Exomizera (depacker nie może działać z pamięci ROM carta). Kompiluje bieżącą kartę za pomocą standardowego potoku autostartu i pobiera adres ładowania z nagłówka PRG oraz punkt wejścia z docelowego SYS:

- **Tryb blokowy/ekspercki z włączonym szczątkowym plikiem BASIC SYS: ** obciążenie = `$0801`, wpis = cel SYS (zwykle `$080D` lub źródło użytkownika).
- **Tryb blokowy/ekspercki z wyłączonym modułem BASIC SYS:** obciążenie = pochodzenie użytkownika (z klasycznym rozwiązaniem awaryjnym `$0801 → $C000`), wejście = adres ładowania.
- **Tryb Ultimate Basic: ** ładowanie i wejście pochodzą z mapy kompilatora UB (`build.map.loadAddress`). Następnie szczątkowy kod autostartu UB wewnątrz ładunku jest wykonywany dokładnie tak, jak po `LOAD "...",8,1 : RUN` z dysku.

Adres źródłowy widoczny na wyjściu ASM zostaje zachowany; moduł ładujący po prostu kopiuje płaski obraz pamięci z PRG do pamięci RAM i przechodzi do punktu wejścia po odmapowaniu pamięci ROM karty.

### Limit rozmiaru

Ponieważ ładunek jest przechowywany liniowo, a funkcja `assembleProgramToPrg()` zwraca płaski bufor `minAddr..maxAddr` z lukami wypełnionymi zerami, program z szeroko rozstawionymi segmentami ORG (np. `$0801` + `$C000` + `$E000`) zlicza każdy bajt pomiędzy nimi do budżetu 65 408 bajtów. Przekroczenie limitu powoduje przerwanie kompilacji z błędem `saveCrtTooLarge` — należy skompresować układ pamięci lub podzielić dane.

> **⚠️ Ważne ostrzeżenie — przeczytaj przed wysyłką monitora CRT**
> 
> Program ładujący wywołuje funkcję KERNAL **`RESTOR` ($FD15)** jako część standardowej sekwencji resetowania. To celowo przepisuje standardowe wektory wejścia/wyjścia w `$0314/$0315`, `$0316/$0317`, `$0318/$0319`, `$0328/$0329` i podobnych z powrotem do domyślnych ustawień ROM-u. Konsekwencje:
> 
> - **Wszystkie haki IRQ / NMI / BRK ustawione przed rozruchem CRT zostaną wyczyszczone.** Twój program musi zainstalować je samodzielnie po wejściu — dokładnie tak, jak świeże `LOAD "",8,1 : RUN` z taśmy/dysku.
> - Programy **UltimateBasic**, które opierają się na wektorach KERNAL innych niż domyślne, działających na wejściu, mogą wymagać jawnego wywołania `SYS` lub init w szczątkowym autostartie. Standardowy autostart UB działa od razu; biblioteki rozszerzeń, które przechwytują wektory *przed * `RUN`, nie.
> - **CIA1 / CIA2** są ponownie inicjowane przez `IOINIT`. Niestandardowe ustawienia timera (IRQ rastrowe, odtwarzacz muzyczny CIA-A) muszą zostać przeprogramowane po wprowadzeniu.
> - Wózek jest wyłączany z 8-bajtowego szczątku w **RAM pod adresem `$0100`**, aby `STA $DE00` nie mogła zostać przerwana przez błędne pobranie ROM-u. Nie należy polegać na `$0100–$0107` zawierającym obraz wierzchołka stosu przy wejściu — pierwsze wciśnięcie w RAM nadpisuje szczątek.
> 
> Jeśli CRT działa w VICE, ale zawodzi na prawdziwym sprzęcie, pierwszą rzeczą do sprawdzenia jest to, czy program przyjmuje konkretny stan wektora KERNAL lub timera CIA na wejściu. Zainstaluj ten stan jawnie w swojej procedurze init, a będzie on zachowywał się tak samo w obu przypadkach.

### Zgodność

| Platforma                       | Status                                              |
| ------------------------------- | --------------------------------------------------- |
| IMADŁO (`x64sc`, `x64`)         | Działa poprzez **Plik → Dołącz obraz wkładu **.     |
| TheC64 / TheC64 Mini            | Działa poprzez wbudowaną ładowarkę kaset.           |
| Kung Fu Flash                   | Działa — natywny tryb Magic Desk.                   |
| Kaseta EasyFlash                | Działa po zaprogramowaniu jako Magic Desk.          |
| 1541 Ultimate II+ / Ultimate 64 | Działa poprzez **Kaseta → Załaduj obraz koszyka **. |
| Kameleon / Turbo Kameleon       | Fabryka.                                            |

---

## 13. Ustawienia sprzętowe

Otwórz **Ustawienia → Ustawienia sprzętowe…** w menu paska narzędzi. Wszystkie ścieżki do sprzętu zewnętrznego i konfiguracja sieci znajdują się tutaj.

### Emulator VICE

| Ustawienie       | Opis                                                         |
| ---------------- | ------------------------------------------------------------ |
| **Wybierz VICE** | Przejdź do pliku wykonywalnego VICE `x64sc` (lub `x64`)      |
| **Status**       | Pokazuje, czy ścieżka wykonywalna jest prawidłowa i dostępna |

VICE jest wymagany do **Uruchom jako PRG**, **Uruchom przez D64** i **Eksportu do D64**.

### Exomizer

| Ustawienie                                | Opis                                                                                                                                                                                                |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Wybierz Exomizer**                      | Przejdź do pliku wykonywalnego `exomizer`                                                                                                                                                           |
| **Błysk obramowania podczas dekompresji** | Po włączeniu skompresowane pliki PRG SFX korzystają ze wbudowanego w exomizer szybkiego efektu flashowania obramowania `-x1`; po wyłączeniu, w celu cichej dekompresji przekazywany jest efekt `-n` |
| **Status**                                | Pokazuje, czy ścieżka wykonywalna jest prawidłowa i dostępna                                                                                                                                        |

**Przepływ pracy: **
1. Zainstaluj plik binarny Exomizera:
   - **Windows:** pobierz wstępnie skompilowany plik `win32/exomizer.exe` ze strony https://bitbucket.org/magli143/exomizer/wiki/Home lub https://csdb.dk/release/?id=244342.
   - **macOS:** `brew install exomizer` (instaluje oficjalną kompilację 3.1.2 Magnusa Linda).
2. Skonfiguruj ścieżkę w **Ustawienia sprzętowe → sekcja Exomizer**.
3. Zaznacz pole wyboru **Uruchom z Exomizerem** w menu **Ustawienia**.
4. Wszystkie akcje **Run** (PRG, D64, sprzęt) i akcje **Build** (Build PRG, Build D64) będą teraz przetwarzać zmontowany program za pomocą `exomizer sfx sys` przed uruchomieniem lub zapisaniem.

Exomizer działa w ten sam sposób w systemach Windows i macOS — interfejs wiersza poleceń jest wywoływany z poziomu zaplecza Tauri; integracja nie jest zależna od konkretnej platformy.

**Wewnętrznie używane są dwa tryby kompresji:**

| Tryb            | Używany przez                                                 | Konwencja wywoławcza                                                                                                                                                                           |
| --------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `system sfx`    | Zbuduj/Uruchom z przełącznikiem Exomizer (główna ścieżka PRG) | Samorozpakowujący się PRG z wbudowanym decruncherem; ustawienie Border-flash kontroluje `-x1` vs `-n`                                                                                          |
| `mem` (do tyłu) | Uruchom przez D64 → pole wyboru **EXO** dla każdego pliku     | Kompresuje każdy dodatkowy plik do strumienia w trybie `mem`; program dekompresuje go w czasie wykonywania za pomocą makra **EXODECRUNCH** i wbudowanego depakera (`samples/exo-decrunch.bin`) |

> **Wskazówka: ** Jeśli ścieżka Exomizera nie jest skonfigurowana, ale pole wyboru jest zaznaczone, zamiast uruchomienia wyświetla się czysty komunikat o błędzie. Odznacz pole wyboru, aby uruchomić Exomizer bez kompresji.

> **Test integracji:** `test cargo --test exomizer_integration` (w `src-tauri/`) weryfikuje pełną kompresję i dekompresję w trybie pamięci w obie strony na emulatorze 6502.

### Retro Debugger

| Ustawienie                | Opis                                       |
| ------------------------- | ------------------------------------------ |
| **Wybierz RetroDebugger** | Przejdź do pliku binarnego `RetroDebugger` |
| **Status**                | Pokazuje, czy ścieżka jest prawidłowa      |

Pełną dokumentację debugera można znaleźć w [Sekcji 9](#9-debugger-integration).

### C64 Ultimate / 1541 Ultimate

Uruchamiaj złożone programy PRG bezpośrednio na prawdziwym sprzęcie za pośrednictwem sieci lokalnej, korzystając z Ultimate REST API.

| Ustawienie          | Opis                                                                          |
| ------------------- | ----------------------------------------------------------------------------- |
| **Host (IP)**       | Adres IP urządzenia (np. `192.168.1.100`)                                     |
| **Hasło**           | Opcjonalnie — jeśli urządzenie wymaga uwierzytelnienia                        |
| **Test połączenia** | Wysyła żądanie testowe do `/v3/runners/info`; wyświetla komunikat OK lub błąd |

**Przepływ pracy: **
1. Podłącz urządzenie 1541 Ultimate / Ultimate 64 do sieci lokalnej.
2. Wprowadź adres IP (i hasło, jeśli zostało ustawione) w Ustawieniach sprzętu.
3. Wybierz **Uruchom na sprzęcie** z menu podzielonego uruchamiania.
4. Kliknij **▶ Uruchom** — PRG zostanie skompilowany i wysłany do urządzenia za pomocą protokołu HTTP POST do `/v3/runners/prg`. Urządzenie natychmiast go załaduje i uruchomi na komputerze C64.

> **Wskazówka: ** Nie potrzebujesz kabla USB ani sterownika — interfejs API REST jest wbudowany w oprogramowanie układowe Ultimate. Twój komputer i urządzenie muszą być w tej samej sieci lokalnej.

---

## 14. Edytory wizualne (zestaw narzędzi)

Menu paska narzędzi **Zestaw narzędzi** grupuje edytory danych wizualnych, które wszystkie mają wspólne menu Pliki (`Pliki ▾`) dla opcji Ładuj BIN / Zapisz BIN / Eksportuj do bloków / Zapisz do D64. Każdy edytor generuje surowe dane `.bin`, które można umieścić w programie za pomocą `INCBIN` lub bezpośrednio dodać do dysku D64 za pomocą opcji **Zapisz do D64**.

Okna dialogowe edytora wizualnego można przeciągać za nagłówki w całym obszarze roboczym Visual Assembler. Okno dialogowe bez zapisanej pozycji otwiera się wyśrodkowane; po przesunięciu jego ostatnia pozycja jest zapisywana w ustawieniach interfejsu użytkownika i przywracana przy następnym otwarciu.

### Edytor wysokiej rozdzielczości / wielokolorowy

Edytor bitmap na poziomie pikseli z trybami wysokiej rozdzielczości 320×200 i wielokolorowymi 160×200. Otwórz przez Toolkit → Hi-Res Editor.

| Funkcja                 | Opis                                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Przełączanie trybu      | Pole wyboru **Wielokolorowe** przełącza między wysoką rozdzielczością (monochromatyczne na komórkę) a wielokolorowym (4 kolory na komórkę). |
| Narzędzia               | Ołówek, gumka, linia, prostokąt, wypełniony prostokąt, owal, wypełniony owal, wypełnienie.                                                  |
| Narzędzie do rozpylania | Malarz w stylu aerografu, który rozprasza piksele wokół kursora podczas rysowania.                                                          |
| Intensywność rozpylania | Lista rozwijana obok narzędzia natryskowego umożliwia kontrolowanie gęstości każdego pociągnięcia natryskiem.                               |
| Paleta kolorów          | Selektory pierwszego planu (tusz) i papieru (tło). Tryb wielokolorowy automatycznie śledzi 3 dodatkowe elementy na komórkę.                 |
| Cofnij / Ponów          | Historia poszczególnych uderzeń, ctrl-Z / ctrl-Y.                                                                                           |
| Siatka + Raster         | Opcjonalna siatka 8×8 i nakładka wierszy rastrowych do wyrównywania komórek.                                                                |
| Importuj obraz          | Obrazy PNG/JPEG/GIF upuszczone na płótno są automatycznie kwantyzowane do 16-kolorowej palety C64.                                          |
| Eksportuj bloki         | Dołącza do programu bloki BYTE/RAWBYTES zawierające zakodowane dane dotyczące mapy bitowej, ekranu i koloru.                                |
| Eksportuj `.bin`        | Zapisuje natywny format wielokolorowy (10000 bajtów: 8000 bitmap + 1000 ekran + 1000 kolorów) gotowy do załadowania pliku do $2000.         |

### Edytor Sprite'ów

Edytor sprite'ów 24×21 pikseli z animacją wieloklatkową. Otwórz przez Toolkit → Edytor sprite'ów.

| Funkcja             | Opis                                                                                                                                                                                                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ramki               | Dodaj/usuń/zmień kolejność ramek; pasek ramek jest pokazany na dole.                                                                                                                                                                                        |
| Tryb                | Przełącznik mono/wielokolorowy.                                                                                                                                                                                                                             |
| Narzędzia           | Ołówek, wypełnienie, linia, prostokąt, okrąg — a także odbicie w poziomie, odbicie w pionie, przesunięcie w lewo/prawo/górę/dół (z opcjonalnym zawijaniem). Narzędzia kształtów wyświetlają podgląd na żywo podczas przeciągania; zwolnij, aby zatwierdzić. |
| Cofnij / ponów      | Pełny stos cofania/ponawiania dla każdej klatki. Ctrl/Cmd+Z / Ctrl/Cmd+Y lub przyciski paska narzędzi.                                                                                                                                                      |
| Importowanie obrazu | Zaimportuj PNG lub JPEG poprzez Pliki → Importuj obraz. Importer mapuje każdy piksel na najbliższy kolor z palety C64 i zapisuje go w bieżącej klatce.                                                                                                      |
| Podgląd animacji    | Odtwarzaj/zatrzymaj z konfigurowalną prędkością.                                                                                                                                                                                                            |
| Eksportuj bloki     | Wstawia blok RAWBYTES pod adresem 64-bajtowym dla każdej klatki, a także konfigurację wskaźnika sprite'a.                                                                                                                                                   |
| Zapisz `.bin`       | Zapisuje 64 bajty na klatkę (surowe dane sprite'a bez wypełnienia).                                                                                                                                                                                         |

### Przeglądarka ROM-u znaków C64 („mapa znaków”)

Przeglądarka tylko do odczytu pamięci ROM znaków C64 (wbudowanej czcionki PETSCII). Otwierana poprzez wpis **C64 chargen** w menu Toolkit. Przydatna do znalezienia kodu ekranowego glifu przed zapisaniem go za pomocą `RAWBYTES` lub `TEXT`.

| Funkcja            | Opis                                                                                                                                                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dwa zestawy znaków | Karta 1: **Zestaw 1 — Górny/Grafika** (domyślny tryb po włączeniu zasilania). Karta 2: **Zestaw 2 — Dolny/Górny** (po przełączeniu `$0E`).                                                                                                       |
| Siatka glifów      | Siatka 16×16 zawierająca wszystkie 256 znaków. Kliknij glif, aby zobaczyć jego panel szczegółów: powiększony widok 8×8 pikseli, kod ekranu (dziesiętny + szesnastkowy), kody PETSCII (domyślne i przesunięte) oraz surową 8-bajtową mapę bitową. |
| Panel szczegółów   | Pokazuje kod ekranowy wybranego glifu, kody PETSCII i osiem surowych bajtów — gotowych do wklejenia do bloku `RAWBYTES` lub BYTE.                                                                                                                |
| Tylko do odczytu   | Tutaj nie ma możliwości edycji — do modyfikacji glifów użyj Edytora znaków (poniżej).                                                                                                                                                            |

### Edytor znaków (zestaw znaków)

Edytor znaków 8×8 o pojemności 256 znaków. Otwórz przez Toolkit → Edytor znaków.

| Funkcja                         | Opis                                                                                                                                                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Załaduj ROM                     | Importuje zestaw znaków ROM C64 bezpośrednio z `chargen` programu VICE (bez selektora plików).                                                                                                                     |
| Załaduj `.bin`                  | Importuje zewnętrzny plik binarny z zestawem znaków o rozmiarze 2048 bajtów.                                                                                                                                       |
| Podgląd na znak                 | 16-szeroka siatka wszystkich 256 glifów z podświetloną bieżącą komórką.                                                                                                                                            |
| Edytor pikseli                  | Edytor pojedynczego znaku 8×8 z narzędziami przełączania/odwracania/czyszczenia.                                                                                                                                   |
| Kolor na znak                   | Przechowuje domyślną wartość pamięci RAM koloru dla każdego glifu. W trybie znaków wielokolorowych zachowuje również bit aktywacji wielokoloru dla każdej komórki oraz własny, 3-bitowy kolor znaku.               |
| Podróż w obie strony metadanych | Podczas ładowania zgodnych danych z przepływów pracy Charset Canvas/Map, metadane dotyczące koloru dla każdego znaku są zachowywane, dzięki czemu można kontynuować edycję bez utraty zamierzenia kolorystycznego. |
| Eksportuj bloki                 | Dodaje RAWBYTES pod numerem $0800 (blok 2) lub $3800 (blok 7) z zakodowanym zestawem znaków.                                                                                                                       |

### Edytor płótna zestawu znaków

Malarz pełnego zestawu znaków do tworzenia ekranów z kompletnego, 256-znakowego zestawu znaków. Otwórz przez Toolkit → Charset Canvas.

Płótno ma rozmiar 16×16 znaków. W trybie monochromatycznym daje to obszar roboczy o wymiarach 128×128 pikseli; w trybie wielokolorowym znaków daje obszar roboczy o szerokości 64×128 pikseli, zgodnie z rzeczywistymi regułami wielokolorowości znaków w C64.

| Funkcja                                        | Opis                                                                                                                                                                                            |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mono / wielokolorowy                           | Tryb monochromatyczny przechowuje 1-bitowe glify 8×8. Tryb wielokolorowy przechowuje dwubitowe poziome pary pikseli i oznacza używane komórki bitem 3 pamięci RAM koloru.                       |
| Model kolorów C64                              | Tło wykorzystuje `$D021`; współdzielony wielokolorowy 1 wykorzystuje `$D022`; współdzielony wielokolorowy 2 wykorzystuje `$D023`; kolor każdego znaku pochodzi z bitów 0–2 pamięci RAM kolorów. |
| Narzędzia do rysowania                         | Ołówek, gumka, linia, prostokąt, owal i wypełnienie działają niezależnie od granic znaków.                                                                                                      |
| Narzędzie do rozpylania                        | Rysunek w stylu aerografu, w którym piksele są rozrzucane po sąsiadujących komórkach/znakach.                                                                                                   |
| Intensywność rozpylania                        | Lista rozwijana obok narzędzia natryskowego umożliwia ustawienie gęstości pociągnięć.                                                                                                           |
| Przełącznik siatki                             | Pole wyboru Siatka pozwala wyświetlić lub ukryć siatkę znaków 16×16.                                                                                                                            |
| Zapisz zestaw znaków `.bin`                    | Zapisuje dane mapy bitowej znaków o rozmiarze 2048 bajtów.                                                                                                                                      |
| Zapisz mapę 16×16 + kolorową pamięć RAM `.bin` | Zapisuje 256 kodów ekranowych, a następnie 256 wartości pamięci RAM kolorów. Użyj tego z `MAP_COPY16X16`.                                                                                       |
| Załadunek                                      | Można wczytać zapisane zestawy znaków z płótna, zwykłe dane zestawu znaków i zgodne dane zestawu znaków edytora znaków, w tym zapisane kolory dla każdego znaku, jeśli są dostępne.             |

**Ważne ograniczenie C64: ** w trybie wielokolorowych znaków dwa współdzielone kolory są globalne dla całego ekranu (`$D022` / `$D023`). Tylko kolor własny znaku jest wyświetlany dla każdej komórki i jest ograniczony do kolorów 0–7, ponieważ bit 3 pamięci kolorów wybiera tryb wielokolorowy.

### Edytor map (mapy kafelkowe wielowarstwowe)

Warstwowy edytor map kafelkowych do statycznych scenerii, map pojawiania się sprite'ów, danych o kolizjach i podobnych. Otwórz przez Toolkit → Edytor map.

| Funkcja                                               | Opis                                                                                                                                                                                                                                                                                                       |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Warstwy                                               | Wiele nazwanych warstw, każda z własnym zestawem kafelków i kryciem.                                                                                                                                                                                                                                       |
| Pędzle                                                | Tryby pojedynczego kafelka, wypełnienia, linii, prostokąta i okręgu. Narzędzia kształtów wyświetlają podgląd na żywo podczas przeciągania; zwolnij, aby zatwierdzić.                                                                                                                                       |
| Cofnij / ponów                                        | Pełny stos cofania/ponawiania dla każdej warstwy. Ctrl/Cmd+Z / Ctrl/Cmd+Y lub przyciski paska narzędzi.                                                                                                                                                                                                    |
| Wyczyść menu                                          | Wyczyść pojedynczą warstwę lub całą mapę z potwierdzeniem.                                                                                                                                                                                                                                                 |
| Importowanie obrazu                                   | Upuść plik PNG mapy kafelkowej, a edytor automatycznie podzieli ją na kafelki.                                                                                                                                                                                                                             |
| Kopiuj/wklej                                          | Skopiuj zaznaczony obszar kafelka, a następnie wklej go normalnie lub użyj przezroczystego wklejenia, aby puste kafelki pozostały przezroczyste.                                                                                                                                                           |
| Kolorowanie kafelków z uwzględnieniem wielu kolorów   | Jeśli metadane zestawu znaków są zgodne, malowanie wykorzystuje domyślne ustawienia kolorów zapisane w pamięci RAM kafelka (w tym kodowanie wielokolorowe) zamiast ogólnego, jednolitego koloru.                                                                                                           |
| Niestandardowe kolory zestawu znaków                  | Jeśli zestaw znaków zawiera metadane `charColors`, Edytor map używa domyślnej wartości pamięci RAM kolorów wybranego kafelka podczas malowania.                                                                                                                                                            |
| Eksportuj bloki                                       | Emitują bloki RAWBYTES dla grafiki kafelkowej + danych mapy.                                                                                                                                                                                                                                               |
| Zapisz pamięć RAM ekranu (.bin)…                      | Zapisuje tylko kody ekranowe dla bieżącej warstwy mapy (40×25 = 1000 bajtów).                                                                                                                                                                                                                              |
| Zapisz pamięć RAM ekranu + pamięć RAM kolorów (.bin)… | Zapisuje kody ekranowe połączone z wartościami pamięci RAM kolorów jako pojedynczy plik o rozmiarze 2000 bajtów (`screen[0..999]`, a następnie `color[0..999]`). Użyj tego z makrem **MAP_COPY** (połączony tryb .bin), aby przywrócić zarówno ekran, jak i kolory w jednej operacji w czasie wykonywania. |

### Edytor SID (śledzenie 3-głosowe)

Wieloinstrumentalny, 3-głosowy tracker z silnikiem podglądu Web Audio. Otwórz przez Toolkit → Edytor SID.

**Sterowanie na instrument:**
- Pola wyboru przebiegów (TRI / SAW / PUL / NOI) — można połączyć ze sobą wiele przebiegów za pomocą operacji OR.
- ADSR (atak / zanik / podtrzymanie / uwolnienie) wyświetlane w formie wykresu przeciąganego nad czterema suwakami.
- Suwak szerokości impulsu (0-4095) z opcjonalnymi flagami dzwonienia/synchronizacji.
- Pole wyboru routingu filtrów dla każdego głosu; globalne odcięcie filtra / rezonans / głośność / tryb (LP/BP/HP).

**Siatka śledzenia: **
- 3 głosy × do 7 wzorów × 32 wiersze = 7 × 32 = maksymalnie 224 wiersze (ograniczenie stanowi 8-bitowy licznik wierszy).
- W wierszu: nuta + indeks instrumentu. Puste wiersze zawierają poprzednią nutę.
- Zaznacz jedną komórkę normalnie lub przytrzymaj klawisze **Shift** podczas klikania lub używania klawiszy strzałek, aby rozszerzyć prostokątne zaznaczenie na wiersze i dowolny z trzech głosów. Kliknięcie prawym przyciskiem myszy w zaznaczonym obszarze zachowuje zakres.
- Kopiuj, Wytnij, Wklej i Wyczyść są dostępne na pasku narzędzi ikon i w menu kontekstowym opartym na ikonach. `Ctrl/Cmd+C` i `Ctrl/Cmd+V` działają na tym samym prostokątnym zaznaczeniu.
- Pomocnik harmonii: wybierz nutę podstawową, rodzaj akordu i oktawę, odsłuchaj akord z bieżącym instrumentem, a następnie wstaw brzmienie bezpośrednio do trackera. Dostępne typy to: dur, mol, zmniejszony, zwiększony, Sus2, Sus4, dominanta 7, dur 7, mol 7, 6, mol 6, 9, b9, #9, Dim7 i 7sus4.
- Pomocnik arpeggio: podgląd lub wstawianie przebiegów nutowych składających się z 4, 8 lub 16 kroków od wybranego akordu w kierunku w górę, w dół lub w górę/w dół.
- **Podgląd wiersza** umożliwia odsłuchanie wybranego wiersza we wszystkich trzech głosach bez rozpoczynania odtwarzania wzorca.
- Wklejanie zakresu komórek rozpoczyna się teraz od wybranej komórki początkowej zakresu i kończy się na granicach wiersza lub głosu, zamiast przechodzić do następnej kolumny lub wiersza.
- Suwak prędkości ustawia dzielnik cykli IRQ (liczba klatek pomiędzy wierszami).

**Odtwarzanie i klawiatura wirtualna:**
- Przycisk Odtwórz na pasku narzędzi zmienia się na Wstrzymaj podczas odtwarzania i na Wznów po wstrzymaniu. Przycisk Zatrzymaj kończy odtwarzanie i resetuje stan.
- Przycisk na pasku narzędzi klawiatury otwiera niemodalny fortepian, z którego można korzystać, gdy edytor SID jest aktywny. Przeciągnij jego nagłówek, aby umieścić go w dowolnym miejscu nad główną aplikacją.
- Włącz opcję **Wstaw do trackera**, aby zapisać każdą zagraną nutę przy aktualnym kursorze trackera i przejść do następnego wiersza. Wyłącz tę opcję, aby odsłuchiwać nuty bez edycji.
- Podgląd akordów i arpeggio podświetla odpowiadające im klawisze fortepianu, gdy klawiatura jest otwarta.

**Eksportowanie menu Pliki: **
| Eksport                           | Co to robi                                                                                                                                                                                                        |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Zapisz .bin…`                    | Zapisuje natywny format serializowany edytora (instrumenty + wzorce + sekwencja).                                                                                                                                 |
| `Eksportuj bloki (tylko dane)`    | Dodaje do programu tabelę instrumentów + bloki wzorców w punkcie `* = $C000`.                                                                                                                                     |
| `Eksport bloków + miniodtwarzacz` | Dodaje pełny odtwarzacz (sid_init / sid_irq / sid_play_row / sid_set_voice) oraz tabele częstotliwości PAL. Po wyeksportowaniu umieść `JSR sid_init` w kodzie głównym w miejscu, w którym ma się zaczynać muzyka. |
| `Eksportuj asm (schowek)`         | Kopiuje cały kod źródłowy zestawu do schowka.                                                                                                                                                                     |

**Użycie ZP gracza: ** `$FB` (licznik cykli), `$FC` (indeks wiersza), `$FD` (temp. set_voice). Te elementy powodują konflikt, jeśli korzysta z nich Twój główny kod — w razie potrzeby przenieś je w trybie eksperckim.

**Znane limity:**
- Pojedyncza lista wzorców liniowych (jeszcze nie ma tabeli sekwencji dla każdego głosu).
- 8-bitowy licznik wierszy ogranicza się do 7 wzorów × 32 wierszy.
- Globalna głośność C64 `$D418` jest współdzielona przez wszystkie głosy — suwak głośności dla każdego instrumentu ma charakter informacyjny; poziom podtrzymania (`S` ADSR) to efektywna głośność dla każdego głosu.
- Podgląd Web Audio jest przybliżony: modulacja PWM, dzwonek/synchronizacja i charakter filtru SID różnią się od rzeczywistego układu.

---

### Edytor krzywych

Generuje gotowe do użycia tabele wyszukiwania `.byte` z krzywych matematycznych — sinusoidalnych, wygładzających, trójkątnych/piłokształtnych/kwadratowych i odbiciowych. Idealne do ruchu sprite'ów, efektów rastrowych, cykli kolorów i dowolnych animacji opartych na wstępnie obliczonej tabeli. Otwórz za pomocą ikony **Edytor krzywych** na górnym pasku narzędzi (obok przycisku Edytor SID).

**Krzywe: ** Sinus, Cosinus, Liniowa, Łatwe wejście/wyjście/Wejście/Wyjście (Czworokątna i Sześcienna), Łatwe wejście/wyjście (Kołowa), Trójkątna, Piłokształtna, Kwadratowa oraz Łatwe wejście/wyjście/Wejście/Wyjście odbicia.

**Sterowanie: **
| Kontrola                       | Zamiar                                                                                                                                                                                    |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Wartość początkowa/końcowa** | Zakres wyjściowy. 0..255 w trybie 8-bitowym, 0..320 w trybie 16-bitowym.                                                                                                                  |
| **Liczba wartości**            | Długość tabeli: 4–512 wpisów.                                                                                                                                                             |
| **Cykle**                      | Liczba oscylacji w tabeli (tylko sinus/cosinus/trójkąt/piła/kwadrat). Akceptowane są ułamki (np. `3,625`).                                                                                |
| **Faza**                       | Przesunięcie fazowe w stopniach (tylko sinus/cosinus).                                                                                                                                    |
| **Połącz drugą krzywą**        | Połącz drugą krzywą z **Miksuj/Dodaj/Mnoż/Min/Maks/Odejmij**, jej własnymi cyklami/fazą i wartością miksu. Obie krzywe źródłowe są rysowane na wykresie jako przerywane linie pomocnicze. |
| **Etykieta**                   | Etykieta tabeli (automatycznie podpowiadana na podstawie nazwy krzywej).                                                                                                                  |
| **Format liczb**               | `$XX` szesnastkowy lub dziesiętny.                                                                                                                                                        |
| **Wartości na wiersz**         | 8 / 16 / 32 bajtów na linię `.byte`.                                                                                                                                                      |

**Tryby wyjściowe:**
| Tryb          | Emituje                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **8-bitowy**  | Pojedyncza tabela `.byte` (wartości 0–255). Odczyt za pomocą tabeli `LDX #index / LDA, X`. Opcjonalnie emituje procedurę odczytu sprite’a **Y** (`<label>_set_y`) — `LDA <label>, X` / `STA $D001+2N` — dla wybieralnego numeru sprite’a 0–7.                                                                                                                                                                                             |
| **16-bitowy** | Dwie równoległe tablice bajtów — `<etykieta>_lo` (8 najniższych bitów) i `<etykieta>_hi` (9. bit, 0/1) — indeksowane przez **same** X (2 bajty na wpis). Wymagane dla sprite'a X na całym ekranie (0..320 > jeden bajt). Opcjonalnie emituje procedurę odczytu sprite'a X **** (`<etykieta>_set_x`), która zapisuje najniższy bajt do `$D000+2N` i ustawia/czyści MSB sprite'a w `$D010`, dla wybieralnego numeru sprite'a z zakresu 0–7. |

Każde wyjście Kopiuj/Wstaw rozpoczyna się komentarzem nagłówkowym dokumentującym krzywą, rzeczywisty zakres min./maks., liczbę wpisów i dokładne wykorzystanie (które rejestrują każdy kanał tabeli).

**Podgląd: **
- **Wykres** — krzywa narysowana z wartością 0 na **górze** i maks. na **dole**, zgodna z konwencją sprite-Y/raster C64 (więc to, co widzisz, to to, co tabela generuje sprzętowo). Meta linijka pod wykresem pokazuje liczbę bajtów, rzeczywistą wartość minimalną/maksymalną wygenerowanych wartości oraz nazwę(y) krzywej.
- **Odbijająca się piłka** — animuje znacznik w tabeli z **Tempo** (5–240 wartości/s). Przy tempie 50 odpowiada to jednej wartości na klatkę w systemie PAL (50 Hz), czyli jednemu `.wait_raster` krokowi na indeks. Przyciski Odtwórz/Pauza i Restart, zanikający ślad ostatnich ~24 pozycji oraz odczyt na żywo `Indeksu · Wartości`.

**Kopiuj/Wstaw:** dwie ikony paska narzędzi — **Kopiuj** umieszcza tabelę w schowku; **Wstaw do edytora** dołącza tabelę (i czytnik, jeśli jest włączony) jako bloki do bieżącego programu. Ponowne wstawienie **zastępuje** poprzednią operację wstawiania w Edytorze krzywych zamiast układania duplikatów (działa w trybie blokowym i eksperckim).

**Menu Pliki: **
| Działanie                     | Co to robi                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Zapisz krzywą (.bin)…**     | Zapisuje surowe bajty tabeli dokładnie tak, jak C64 odczytałby je za pomocą `INCBIN`. 16-bit: N bajtów niskich, po których następuje N bajtów wysokich.                                                                                                                                                                                                                 |
| **Krzywa obciążenia (.bin)…** | Ładuje surowe bajty tabeli z powrotem do edytora, interpretowane zgodnie z bieżącą głębokością bitową (16 bitów: pierwsza połowa lo, druga połowa hi). Załadowana tabela jest wyświetlana bez zmian, dopóki którykolwiek z elementów sterujących krzywą nie wygeneruje nowej krzywej.                                                                                   |
| **Eksportuj demo do bloków**  | Dodaje kompletne, uruchamialne demo sprite'a: inicjalizację sprite'a, pętlę główną zsynchronizowaną z rastrem, osadzoną tabelę i dane sprite'a piłki. Przesunięcie X o 0–320 w punkcie stałym 8,8 z `$D010` MSB, podczas gdy tabela steruje sprite'em Y — dokładnie tak, jak w podglądzie edytora. Ponowny eksport zastępuje poprzednie wstawienie w edytorze krzywych. |

**Dopasowanie podglądu na C64: ** podgląd odczytuje tabelę **liniowo, zapętlając 0 → N-1 → 0, jedna wartość na klatkę **. Aby odtworzyć to dokładnie, należy sterować tabelą w ten sam sposób (zwiększać indeks raz na klatkę, przewijać na całej długości tabeli). Odtwarzanie ping-pongowe lub częściowe będzie przebiegać inaczej, mimo że wartości bajtów są identyczne. Zobacz `samples/curve-new-demo.asm`, aby uzyskać działający 16-bitowy przykład sprite-X.

---


*© 2026 Zsolt Tarczali — Asembler wizualny C64*
