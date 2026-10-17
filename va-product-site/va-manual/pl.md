# C64 Visual Assembler — Podręcznik użytkownika

**Wersja 2.6.1**

Wizualny, blokowy assembler 6502 dla Commodore 64. Twórz programy, przeciągając
i upuszczając bloki instrukcji, i oglądaj generowany kod assemblera i maszynowy
w czasie rzeczywistym.

---

## Spis treści

- [C64 Visual Assembler — Podręcznik
  użytkownika](#c64-visual-assembler--user-manual)
    - [Najważniejsze cechy wersji 2.6.1](#version-261-highlights)
    - [Najważniejsze cechy wersji 2.6.0](#version-260-highlights)
    - [Najważniejsze cechy wersji 2.5.9](#version-259-highlights)
    - [Najważniejsze cechy wersji 2.5.8](#version-258-highlights)
    - [Najważniejsze cechy wersji 2.5.7](#version-257-highlights)
    - [Najważniejsze cechy wersji 2.5.6](#version-256-highlights)
    - [Najważniejsze cechy wersji 2.5.5](#version-255-highlights)
    - [Najważniejsze cechy wersji 2.5.4](#version-254-highlights)
    - [Najważniejsze cechy wersji 2.5.3](#version-253-highlights)
    - [Najważniejsze cechy wersji 2.5.2](#version-252-highlights)
    - [Najważniejsze cechy wersji 2.5.1](#version-251-highlights)
    - [Najważniejsze cechy wersji 2.5.0](#version-250-highlights)
    - [Najważniejsze cechy wersji 2.4.9](#version-249-highlights)
    - [Najważniejsze cechy wersji 2.4.8](#version-248-highlights)
    - [Najważniejsze cechy wersji 2.4.7](#version-247-highlights)
    - [Najważniejsze cechy wersji 2.4.6](#version-246-highlights)
    - [Najważniejsze cechy wersji 2.4.5](#version-245-highlights)
    - [Najważniejsze cechy wersji 2.4.3](#version-243-highlights)
    - [Najważniejsze cechy wersji 2.4.2](#version-242-highlights)
    - [Najważniejsze cechy wersji 2.4.1](#version-241-highlights)
    - [Najważniejsze cechy wersji 2.4.0](#version-240-highlights)
    - [Najważniejsze cechy wersji 2.3.9](#version-239-highlights)
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
    - [Kontrola wersji](#version-control)
    - [Darmowe i otwarte oprogramowanie](#free-and-open-source)
    - [Zgłaszanie błędu](#reporting-a-bug)
    - [Okno pamięci i wykorzystanie strony
      zerowej](#memory-window-and-zero-page-usage)
    - [Szablony projektów](#project-templates)
    - [Budowanie projektu](#build-project)
    - [Przykładowe programy](#example-programs)
    - [Załaduj plik .asm (szybkie odniesienie)](#load-asm-file-quick-reference)
      - [Importuj notatki dotyczące analizy i najlepsze
        praktyki](#import-parsing-notes-and-best-practices)
  - [Tryb Ultimate Basic](#ultimatebasic-mode)
    - [Otwieranie edytora UB](#opening-the-ub-editor)
    - [Narzędzia edytora](#editor-tools)
    - [Projekty, zakładki i pliki startowe](#projects-tabs-and-startup-files)
    - [Budowa i diagnostyka](#building-and-diagnostics)
    - [Rozmiar kodu na wiersz i wskazówki](#code-size-per-line-and-hints)
    - [Uruchomienie, D64 i Exomizer](#running-d64-and-exomizer)
    - [Symbole debugera i deasemblacja](#debugger-symbols-and-disassembly)
    - [Podręcznik i źródło Ultimate Basic](#ultimate-basic-manual-and-source)
  - [6. Tryb ekspercki](#6-expert-mode)
    - [Przełączanie trybów](#switching-modes)
    - [Układ edytora](#editor-layout)
    - [Przyciski paska narzędzi](#toolbar-buttons)
    - [Liczenie cykli](#cycle-counts)
    - [Wskazówki dotyczące optymalizacji](#optimisation-hints)
    - [Podświetlanie błędu](#error-highlighting)
    - [Podświetlenie składni](#syntax-highlight)
    - [Formater źródła](#source-formatter)
    - [Panel projektu \&amp; zakładki](#project-panel--tabs)
    - [Pasek kart](#tab-bar)
  - [7. Tryby adresowania](#7-addressing-modes)
    - [Oznacz wyrażenia jako operandy](#label-expressions-as-operands)
    - [Licznik programu `*` w wyrażeniach](#the--program-counter-in-expressions)
    - [Lokalne etykiety (kropkowane)](#local-dotted-labels)
    - [Etykiety operandów kodu
      samomodyfikującego](#self-modifying-code-operand-labels)
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
    - [Nielegalne/nieudokumentowane
      instrukcje](#illegal--undocumented-instructions)
  - [9. Bloki makro — odniesienie](#9-macro-blocks--reference)
    - [ETYKIETA](#label)
    - [KOMENTARZ](#comment)
    - [BAJT](#byte)
    - [SŁOWO](#word)
    - [WYPEŁNIJ](#fill)
    - [WYRÓWNAJ](#align)
    - [TEKST 1}
    - [CIĄG](#string)
    - [DANE](#data)
    - [RAWBYTES](#rawbytes)
    - [SUROWY TEKST](#rawtext)
    - [PETSCII](#petscii)
    - [ZESTAW ZNAKÓW](#charset)
    - [CHARDEF](#chardef)
    - [TRAFIENIE W PUDEŁKO](#box_hit)
    - [INCBIN](#incbin)
    - [KOALA](#koala)
    - [POZIOM / POZIOM\_RZĄD](#level--level_row)
      - [POZIOM](#level)
      - [POZIOM\_RZĄD](#level_row)
    - [SID](#sid)
    - [WŁĄCZ](#include)
    - [TABELA](#table)
    - [ORG](#org)
    - [PĘTLA / NASTĘPNY](#loop--next)
      - [PĘTLA](#loop)
      - [DALEJ](#next)
    - [DLA / ZAKOŃCZENIE](#for--endf)
      - [DLA](#for)
      - [KONIEC](#endf)
    - [PCHNIJ / POCIĄGNIJ](#push--pull)
      - [PCHNIJ](#push)
      - [POCIĄGNIJ](#pull)
    - [END / alias RTS](#end--rts-alias)
    - [MAKRO / ENDM / WYWOŁAJ](#macro--endm--invoke)
      - [MAKRO (początek definicji)](#macro-definition-start)
      - [ENDM (koniec definicji)](#endm-definition-end)
      - [WYWOŁAJ](#invoke)
    - [REGION / KONIEC REGIONU](#region--endregion)
    - [DEFINIUJ / JEŻELI / W PRZECIWNYM RAZIE / ENDIF](#define--if--else--endif)
    - [.ASSERT](#assert)
      - [DEFINIUJ](#define)
      - [JEŻELI](#if)
      - [INACZEJ](#else)
    - [KONIECJĘ JEŻELI](#endif)
    - [STAŁA](#const)
    - [VAR](#var)
    - [Czas wykonania JEŻELI / W PRZECIWNYM RAZIE /
      ENDIF](#runtime-if--else--endif)
    - [WHILE / ENDW](#while--endw)
    - [POWTARZAJ / DO](#repeat--until)
    - [MEMCPY / MEMSET](#memcpy--memset)
    - [DRUKUJ / DRUKUJ ZNAK / DRUKUJ SZESNASTKOWY / WYCZYŚĆ EKRAN / KLUCZ
      OCZEKIWANIA / OPÓŹNIENIE / USTAW_OBRAMOWANIE /
      USTAW_BOKIEM](#print--print_char--print_hex--clear_screen--wait_key--delay--set_border--set_bg)
    - [USTAWIENIA_IRQ](#irq_setup)
    - [RAND](#rand)
    - [SPRITE\_INIT](#sprite_init)
    - [SPRITE\_POS](#sprite_pos)
    - [CZEKAJ\_RASTER](#wait_raster)
    - [JOYSTICK](#joystick)
    - [MYSZ](#mouse)
    - [SPRITE\_COL](#sprite_col)
    - [WCZYTAJ PLIK](#loadfile)
    - [EXODECRUNCH](#exodecrunch)
    - [REU\_CHECK](#reu_check)
    - [REU\_SCHOWAJ / REU\_POBIERZ /
      REU\_ZAMIEŃ](#reu_stash--reu_fetch--reu_swap)
    - [TURBO\_SET](#turbo_set)
    - [SUPERPROCPU\_WYKRYWANIE](#supercpu_detect)
    - [TURBO\_WŁĄCZ](#turbo_enable)
    - [MAPA\_KOPIA](#map_copy)
    - [MAPA\_KOPIA16X16](#map_copy16x16)
    - [SPRITE\_ANIM](#sprite_anim)
    - [WYNIK\_BCD](#score_bcd)
  - [10. Integracja debugera](#10-debugger-integration)
    - [RetroDebugger](#retrodebugger)
    - [Bloki punktów przerwania](#breakpoint-blocks)
    - [Flagi debugera (zakładka Opcje)](#debugger-flags-options-tab)
    - [Monitor VICE (gorące przeładowanie, oglądanie na żywo,
      profilowanie)](#vice-monitor-hot-reload-live-watch-profiler)
  - [11. Linki do bazy wiedzy](#11-knowledge-base-links)
  - [12. Eksport D64 i uruchomienie](#12-d64-export--run)
    - [Przycisk Podziel bieg](#split-run-button)
    - [Eksportuj do okna dialogowego D64](#export-to-d64-dialog)
    - [Metadane D64 w projektach](#d64-metadata-in-projects)
  - [12b. Eksport CRT (wkład Magic Desk
    64K)](#12b-crt-export-magic-desk-64k-cartridge)
  - [13. Ustawienia sprzętowe](#13-hardware-settings)
    - [Emulator VICE](#vice-emulator)
    - [Exomizer](#exomizer)
    - [Retro Debugger](#retro-debugger)
    - [C64 Ultimate / 1541 Ultimate](#c64-ultimate--1541-ultimate)
    - [Kung Fu Flash 2](#kung-fu-flash-2)
  - [14. Edytory wizualne (zestaw narzędzi)](#14-visual-editors-toolkit)
    - [Edytor wysokiej rozdzielczości /
      wielokolorowy](#hi-res--multicolor-editor)
    - [Edytor sprite'ów](#sprite-editor)
    - [Przeglądarka ROM-u znaków C64 („Mapa
      znaków”)](#c64-character-rom-browser-char-map)
    - [Edytor znaków (zestaw znaków)](#character-editor-charset)
    - [Edytor kanwy znaków](#charset-canvas-editor)
    - [Edytor map (mapy kafelkowe
      wielowarstwowe)](#map-editor-multilayer-tilemaps)
    - [Edytor poziomów](#level-editor)
    - [Edytor SID (śledzenie 3-głosowe)](#sid-editor-3-voice-tracker)
    - [Odtwarzacz SID](#sid-player)
    - [Edytor krzywych](#curve-editor)
    - [Generator tabel](#table-generator)
    - [Konwerter liczb](#number-converter)

---

## Najważniejsze cechy wersji 2.6.1

- **Liczniki cykli w trybie eksperckim** — pasek postępu pokazuje cykle każdej
  instrukcji, całkowitą liczbę zaznaczeń i liczbę wierszy rastrowych, które
  zajmuje. Zobacz [Liczniki cykli](#cycle-counts).
- **Wskazówki dotyczące optymalizacji** — edytor eksperta oznacza linie, które
  mogą być krótsze lub szybsze (wywołanie ogonowe, redundantne `CMP #0`,
  przeładowania, idiomy `INC` / `DEC`…). Zobacz [Wskazówki dotyczące
  optymalizacji](#optimisation-hints).
- **Generator tabel** — adresy wierszy ekranu/bitmapy, maski pikseli, tabele
  mnożenia/dzielenia, ćwiartki kwadratów, logarytm/wyrażeń, odwracanie bitów,
  wyrażenia niestandardowe i rozwinięty kod prędkości wypełniania/kopiowania.
  Zobacz [Generator tabel](#table-generator).
- **Monitor VICE** — szybkie przeładowanie do działającego VICE, śledzenie
  etykiet i adresów na żywo oraz profilowanie próbkowania na komputerze. Zobacz
  [Monitor VICE](#vice-monitor-hot-reload-live-watch-profiler).
- **Mapa wykorzystania strony zerowej** i **odłączane okno pamięci**. Zobacz
  [Okno pamięci i wykorzystanie strony
  zerowej](#memory-window-and-zero-page-usage).
- **Ultimate Basic** — rozmiar kodu na linię, wskazówki i edytor Sprite →
  eksport Ultimate Basic z animacją.
- **Edytor SID → Eksport .sid (PSID)** i szablon projektu **multiplekser
  sprite’ów** (16 sprite’ów).
- Można otworzyć kilka okien jednocześnie. Okno, które klikniesz, pojawi się na
  wierzchu.

---

## Najważniejsze cechy wersji 2.6.0

- **Visual Assembler jest teraz całkowicie darmowy** — licencje
  Freemium/Professional zostały usunięte. Każdy edytor, opcja kompilacji i
  uruchomienia sprzętu, wszystkie 7 języków interfejsu użytkownika i każdy motyw
  działają dla wszystkich, bez rejestracji i numeru seryjnego. Powód jest
  prosty: zgodnie z węgierskimi przepisami podatkowymi, sprzedaż programu po
  opodatkowaniu i formalnościach byłaby zbyt mała, aby się opłacała. Numery
  seryjne, które już posiadasz, po prostu nie są już potrzebne. Zobacz [Darmowe
  i otwarte oprogramowanie](#free-and-open-source).

---

## Najważniejsze cechy wersji 2.5.9

- **Motyw Commodore 64** — ekran startowy C64: jasnoniebieska obwódka wokół
  niebieskich paneli, jasnoniebieski tekst, przyciski odwrotnego odtwarzania
  wideo, kolory składni z palety C64 oraz czcionka C64 w widoku monitora.
- **Motyw Commodore Beige** — klasyczny „schowek”: beżowa obudowa, musztardowe
  przyciski funkcyjne, tęczowe paski na znaczkach i niebieski widok monitora
  C64. Wybierz go w selektorze motywów lub przełącz za pomocą przycisku motywu.
  Zobacz [Ustawienia i pasek narzędzi](#5-settings--toolbar).
- **Motyw Commodore Starlight** — jasny motyw nawiązujący do półprzezroczystego
  pojemnika na chleb C64: matowe, przejrzyste szkło z prześwitującą tęczową
  poświatą RGB, akcent w kolorze magenty, tęczowe kolory składni i przydymiony,
  ciemny widok monitora.
- **Okno dialogowe kontroli wersji** — okno dialogowe można przeciągnąć za
  nagłówek i otworzyć ponownie w miejscu, w którym je zostawiono; pozostaje na
  ekranie, gdy dziennik lub różnica je podnoszą, a kliknięcie poza nim nie
  zamyka go już (tak jak robi to Esc). Zobacz [Kontrola
  wersji](#version-control).
- **Kontrola wersji na poziomie projektu** — w przypadku karty otwartego
  projektu `.proj` przełącznik **Plik/Projekt** zatwierdza każdy plik źródłowy
  projektu (drzewo projektu + pliki dołączone) w jednym wpisie. Dziennik zawiera
  listę zmienionych plików dla każdego zatwierdzenia, funkcja różnic działa plik
  po pliku, funkcja pobierania przywraca wszystkie pliki do kart edytora, a
  wpisy automatycznego zapisu są również tworzone dla każdego projektu. W trybie
  Git dziennik i tabela różnic obejmują całe repozytorium. Zobacz [Tryb
  projektu](#project-mode).

---

## Najważniejsze cechy wersji 2.5.8

- **Kontrola wersji** — migawki projektu stały się systemem kontroli wersji
  podobnym do Gita: zatwierdzenia z komunikatem i krótkim hashem, log z
  **HEAD**, **Diff** względem kopii roboczej, **Checkout** do edytora i
  oddzielne wpisy autozapisu. Programy w trybie blokowym (JSON) są porównywane
  jak linie montażowe, więc diff pokazuje rzeczywiste zmiany. Działa na kartach
  Block, Expert i Ultimate Basic. Zobacz [Kontrola wersji](#version-control).
- **Integracja z Gitem** — wybierz `git.exe` w **Ustawienia → Kontrola wersji**
  (lub pozwól aplikacji go znaleźć). Gdy projekt znajduje się w repozytorium
  Gita, okno dialogowe pokazuje gałąź, zmienione pliki, commit (najpierw
  zapisuje), log, porównanie z widokiem **RAW**, checkout, **Pull** / **Push** i
  **git init**.
- **Zgłoś błąd** — wbudowany formularz zgłoszeniowy z maksymalnie 4 zrzutami
  ekranu (plik, Ctrl+V lub przeciągnij i upuść), opcjonalnym adresem e-mail,
  informacjami o systemie i ostatnimi błędami aplikacji. Zobacz [Zgłaszanie
  błędu](#reporting-a-bug).
- **Odtwarzacz SID** — **Losowo** i **ulubione** (★) na utwór. Zobacz
  [Odtwarzacz SID](#sid-player).

---

## Najważniejsze cechy wersji 2.5.7

- **VA SID Core 1.2** — SID Player wykorzystuje teraz natywny rdzeń Rust C64:
  procesor 6510 z precyzyjnym taktowaniem przerwań, CIA 6526A, taktowanie VIC-II
  z błędnymi liniami, przerwania DMA i rastrowe dla sprite'ów oraz port
  wejścia/wyjścia 6510. Zobacz [SID Player](#sid-player).
- **Edytor wysokiej rozdzielczości** — dwa kolory w każdej komórce 8×8: nowe
  narzędzie **Papier komórkowy**. Zobacz [Edytor wysokiej rozdzielczości /
  wielokolorowy](#hi-res--multicolor-editor).
- **Dokładny ROM postaci** w przeglądarce ROM, **Załaduj ROM** edytora postaci i
  edytorach map/poziomów.
- **Edytor sprite'ów** — nakładka w wysokiej rozdzielczości, wypełnianie,
  zaznaczanie/przesuwanie, obracanie, odbijanie lustrzane wszystkich, import
  arkusza sprite'ów, pole trafienia, podgląd X/Y ×2. Zobacz [Edytor
  sprite'ów](#sprite-editor).
- **Edytor poziomów** — obiekty, atrybuty postaci, sprawdzanie krawędzi, liczba
  kolorów na ekran, licznik pamięci z RLE, uruchamianie w VICE. Zobacz [Edytor
  poziomów](#level-editor).
- **Edytor postaci** — cofanie/ponawianie, narzędzia do rysowania, obrót o 90°,
  kopiowanie/wklejanie i przeciąganie w celu zamiany na mapie, kafelki 2×2,
  zestaw ROM-ów z małymi literami, podgląd tekstu i eksport zakresu. Zobacz
  [Edytor postaci](#character-editor-charset).
- **Charset Canvas** — powiększenie 2×–24× (suwak lub Ctrl+kółko) z siatką
  pikseli, kolorem tła w trybie wysokiej rozdzielczości, znakami wysokiej
  rozdzielczości w trybie wielokolorowym i **ECM** (tło dla każdego znaku).
  Zobacz [Charset Canvas Editor](#charset-canvas-editor).

---

## Najważniejsze cechy wersji 2.5.6

- **Odtwarzacz SID** — nowy przycisk na pasku narzędzi otwiera pływający
  odtwarzacz dla utworów `.sid` (PSID / RSID): lista odtwarzania z funkcją
  „przeciągnij i upuść”, poprzednią / następną melodią, pododcinkami,
  wyszukiwaniem i ±10 s, głośnością oraz zapisywaniem / otwieraniem listy
  odtwarzania (`.sidpl`); lista i stan okna są zapamiętywane. Zobacz [Odtwarzacz
  SID](#sid-player).
- **VA SID Core 1.1** — wbudowana emulacja SID (MOS 6581/8580, z filtrem 6581
  opartym na MOS 6581/8580) i odtwarzacz PSID/RSID z cyklicznym blokowaniem
  (procesor 6510, taktowanie CIA/VIC). Wybierz w **Ustawienia → Podgląd SID**;
  odtwarzacz SID pokazuje, który silnik odtwarza.
- **Edytor SID** — pokrętła parametrów instrumentu, szerszy wykres ADSR,
  **wejście MIDI**, **nagrywanie** do trackera (nowy wzór jest dodawany, gdy
  obecny jest pełny), **metronom** z lampami uderzeniowymi, **usuwanie wzoru**,
  głośność główna na VA-VK i **Import pliku GoatTracker .sng**. Zobacz [Edytor
  SID](#sid-editor-3-voice-tracker).
- **W zestawie Ultimate Basic 1.6.4 **.

---

## Najważniejsze cechy wersji 2.5.5

- **Edytor wysokiej rozdzielczości: siatka pikseli i 16-krotny zoom ** — z
  włączoną opcją **Siatka **, od 4-krotnego zoomu każdy piksel ma własną linię
  siatki, mocniejszą na granicach komórek znaków i cieniowaną, aby była widoczna
  we wszystkich 16 kolorach. Suwak zoomu można teraz zwiększyć do 16x. Zobacz
  [Edytor wysokiej rozdzielczości / wielokolorowy](#hi-res--multicolor-editor).
- **Menu Kopiuj/Wklej po kliknięciu prawym przyciskiem myszy** — na płótnie
  edytorów Hi-Res i Map (Kopiuj, Wklej, Wklej przezroczyście) oraz w Edytorze
  Sprite’ów (Kopiuj klatkę, Wklej klatkę, również na pasku klatek). Wklejanie
  rozpoczynało się od podglądu menu, w którym kliknąłeś.
- **Konwerter liczb** — jego przycisk na pasku narzędzi pozostaje podświetlony,
  gdy wyświetlany jest konwerter.
- **Naprawiono** — wielokolorowa siatka komórek edytora Hi-Res była dwa razy
  szersza od komórki znaku; przycisk **Wklej** na pasku narzędzi Hi-Res zawsze
  wklejał się przezroczyście; menu prawego przycisku myszy edytora SID otwierało
  się z dala od kursora, podczas gdy okno dialogowe było wyśrodkowane.
- **W tym podręczniku** opisano funkcje zaznaczania, kopiowania/wklejania i
  przezroczystego wklejania edytora Hi-Res.

---

## Najważniejsze cechy wersji 2.5.4

- **Naprawiono: okno nie pojawiało się po ponownym uruchomieniu** — jeśli
  aplikacja została zamknięta z zminimalizowanym lub ukrytym oknem (głównie na
  macOS, ale także na Linuksie/Wayland), kolejne uruchomienie mogło się pojawić
  bez okna. Stan widoczny nie jest już zapisywany (rozmiar okna nadal jest), a
  okno jest zawsze wyświetlane po uruchomieniu.
- **Dołączony Ultimate Basic 1.6.3 ** — składnia w stylu QBasic: `dim name jako
  type` dla zmiennych i tablic każdego typu, `function` / `sub` z typami `as`,
  `elseif`, `do … loop`, `while … wend`, `select case`, `exit do` / `exit sub`,
  pojedyncza linia `if`, Komentarze `'` i `drukują a; b; c`; ciągi czasu
  wykonania (`+`, `left$` / `right$` / `mid$`) oraz 16-bitowe liczby całkowite
  `ze znakiem`. Podświetlono, uzupełniono i sformatowano w edytorze UB, dodając
  nowe wpisy **DIM**, **FUNCTION**, **ELSEIF**, **DO**, **WEND**, **SELECT
  CASE**, **END**, **EXIT SUB** i **LEFT$** / **RIGHT$** / **MID$** w panelu
  Polecenia. Zobacz [UltimateBasic Mode](#ultimatebasic-mode).

---

## Najważniejsze cechy wersji 2.5.2

- **Podgląd edytora SID na prawdziwym SID** — podgląd instrumentu, wirtualna
  klawiatura, wprowadzanie nut, odtwarzanie akordów/arpeggio, wierszy i
  pojedynczych wzorców przez WebSid; syntezator pozostaje jedynie opcją
  zapasową. Zobacz [Edytor SID]{1}.

---

## Najważniejsze cechy wersji 2.5.1

- **Instrumenty edytora SID** — routing filtrów na głos, **3 WYŁ.** i
  rezonansowy **przemiatanie** (start, koniec, prędkość, ping-pong); instrument
  **wibrato** (opóźnienie, prędkość, głębokość); **modulacja szerokości
  impulsu**; **timer bramki**, **twardy restart** i przebieg pierwszej klatki;
  **tabela fal/arpeggio** z presetami; **PIERŚCIEŃ** i **SYNC**. Zobacz [Edytor
  SID](#sid-editor-3-voice-tracker).
- **Nowy odtwarzacz SID** — wyeksportowany odtwarzacz uruchamia modulację
  instrumentu co klatkę (`JSR sid_frame` dla własnego IRQ); podgląd renderuje
  tego samego odtwarzacza przez mały syntezator SID. `.bin` zapisuje, zachowując
  nazwy instrumentów i szybkość.
- **Klawiatura wirtualna** — 2, 3 lub 4 oktawy o wyglądzie syntezatora Commodore
  64.
- **Ultimate Basic 1.6.2 w pakiecie** — `tune` zyskuje `imod`, `ifilt`, `igate`
  i `itab`; **Eksport do UltimateBasic** je zapisuje.
- **Zakładki i Przejdź do wiersza** w edytorach Expert i Ultimate Basic —
  Ctrl+F2 / F2 / Shift+F2, Ctrl+G.
- **Naprawiono: wyrażenia etykiet ** (`.assert`, `LEVEL_MULTICOLOR*16`, `*`)
  działają ponownie w zainstalowanej aplikacji (brak `eval` w ramach wersji
  CSP).

---

## Najważniejsze cechy wersji 2.5.0

- **Edytor poziomów** — nowy edytor pasków narzędzi, który rozmieszcza ekrany
  Edytora Map w pionie, poziomie lub w siatce 2D i umożliwia podgląd całego
  poziomu za pomocą płynnego przewijania. Zobacz [Edytor
  poziomów](#sid-editor-3-voice-tracker).
- Makra **LEVEL / LEVEL_ROW** — `.level "level.bin"[, $addr]` umieszcza tylko
  umieszczone ekrany projektu edytora poziomów oraz tabele wskaźników i
  definiuje etykiety i stałe `LEVEL_*`; `.level_row dst, col[, color]` kopiuje
  jeden wiersz poziomu składający się z 40 znaków do bufora. Zobacz [LEVEL /
  LEVEL_ROW]{1}.
- **Zmienny tryb JOYSTICKA** — `.port joysticka, vx, vy[, fire]` zapisuje
  kierunek do zmiennych (−1 / 0 / +1) zamiast przesuwać duszka; port `3`
  odczytuje oba porty joysticka. Zobacz [JOYSTICK]{1}.
- **Demo przewijania poziomów** — `samples/level-demo.asm` przewija poziom
  ekranu 2×5 piksel po pikselu w każdym kierunku za pomocą joysticka, bez efektu
  rozrywania obrazu, z pozostawieniem miejsca na sprite'y i kod gry.
- **Konwerter liczb** — niemodalne okno dialogowe DEC / HEX / BIN na pasku
  narzędzi. Zobacz [Konwerter liczb]{1}.
- **Okno dialogowe „Przykłady”** — **Menu → „Przykłady…”** otwiera
  przeszukiwalną, skategoryzowaną listę wbudowanych programów przykładowych.
  Zobacz [Programy przykładowe]{1}.
- **Dołączony Ultimate Basic 1.6.1 ** — `map load "level.bin" [, addr]`
  odczytuje projekt Level Editor bezpośrednio, a nowy `map view px, py` przewija
  mapę płynnie i bez rozrywania obrazu w pozycji piksela (przykład:
  `level_scroll_demo.ub`). Iloczyn bajtów w 16-bitowej sumie nie jest już
  obcinany do 8 bitów. W dokumentacji poleceń UB wymieniono `map view`, a
  wyszukiwanie w tym programie najpierw umieszcza dopasowania do nazw poleceń.

---

## Najważniejsze cechy wersji 2.4.9

- **Szablony projektów** — **Menu → Plik → Nowy projekt z szablonu…** lub nowy
  przycisk na pasku narzędzi pomiędzy **Menu** a **Samouczki** tworzy gotowy do
  kompilacji projekt `.proj` w osobnym folderze. Okno dialogowe zawiera sekcję
  **Assembler** (pusty program, szkielet gry, hires i wielokolorowa mapa bitowa)
  oraz sekcję **UltimateBasic** (pusty program, szkielet gry, mapa bitowa hires,
  rastrowe przerwanie IRQ) z podglądem z wyróżnioną składnią. Twoje własne
  szablony `.asm` / `.ub` są pobierane z folderu szablonów użytkownika. Zobacz
  [Szablony projektu](#level-editor).
- **Budowanie projektu** — **Menu → Budowanie → Budowanie projektu** kompiluje
  każdy możliwy do zbudowania plik otwartego projektu (lub otwartych kart) do
  pliku `.prg` obok jego źródła, zapisuje pliki symboli debugera, jeśli są
  dostępne, pomija moduły tylko do dołączenia i wyświetla raport dla każdego
  pliku. Zobacz [Budowanie projektu](#level--level_row).
- **Ctrl + kółko myszy – powiększenie** w edytorach Expert i Ultimate Basic
  (`Cmd` + kółko w systemie macOS; działa również szczypanie za pomocą
  touchpada).
- **Obszary robocze zapamiętują projekty** — drzewa projektów Expert i Ultimate
  Basic, plik startowy i niezapisane zmiany projektu są zapisywane w obszarze
  roboczym `.vaws` i przywracane z nim. Starsze obszary robocze są nadal
  otwarte.
- **Ultimate Basic** — dołączony kompilator generuje szybszy, mniejszy kod 6502;
  mapa pamięci teraz rozróżnia prawdziwy kod i dane, pomijając wypełnienia i
  długie `org` przerwy.
- **Okna dialogowe plików rozpoczynają się w aktywnym folderze roboczym** —
  Blokowym/Eksperckim lub Podstawowym, w zależności od bieżącego trybu.
- **W pakiecie Ultimate Basic 1.6.1 ** — `map load "level.bin" [, addr]`
  odczytuje projekt Level Editor bezpośrednio, a nowy `map view px, py` przewija
  mapę płynnie i bez rozrywania obrazu w pozycji piksela (przykład:
  `level_scroll_demo.ub`). Iloczyn bajtów w 16-bitowej sumie nie jest już
  obcinany do 8 bitów. W dokumentacji poleceń UB wymieniono `map view`, a
  wyszukiwanie w tym programie najpierw umieszcza dopasowania do nazw poleceń.

---

## Najważniejsze cechy wersji 2.4.8

- **Nowe makro KOALA** — `.koala "picture.koa"` (opcjonalnie `, $2000`) ładuje
  obrazek Koala Painter i wyświetla go za pomocą 86-bajtowej procedury
  wyświetlania. Zobacz [KOALA](#project-templates).
- **Import/eksport plików Koala w edytorze Hires** — **Pliki → Importuj pliki
  Koala (.koa)…** / **Eksportuj pliki Koala (.koa)…** (standardowy plik
  10003-bajtowy; zdjęcia w wysokiej rozdzielczości są podczas eksportu
  redukowane do wielokolorowych). Pliki `.koa` / `.kla` są również rozpoznawane
  przez **Importuj obraz / .bin**.
- **W pakiecie Ultimate Basic 1.5.9** — nowy `łańcuch „PLIK” [, urządzenie]`
  (ładuje inny program nad działającym i URUCHOM go); `ładowanie „PLIK”` ładuje
  pod adres pliku, `ładowanie „PLIK”, addr` do `addr`; poprawki błędów D64.
  `łańcuch` jest podświetlony i wymieniony w odniesieniu do poleceń.
- **Status aktualizacji na pasku stanu eksperta** — ten sam wskaźnik *Aktualny*
  / klikalny *Dostępna aktualizacja* co w trybie Ultimate Basic.
- **Okna dialogowe zapisu** oferują własny typ pliku (np. *KOA*) zamiast
  *Binarny (\*.bin)*.
- **Bardziej kompleksowa kontrola aktualizacji** — lista instalatorów jest
  opublikowana na stronie c64va.tech/downloads/VA/, więc kontrola działa z nową
  stroną pobierania; pomocnik aktualizacji systemu Linux nie dziedziczy już
  ścieżek bibliotek AppImage.

---

## Najważniejsze cechy wersji 2.4.7

- **Aktualizacje w aplikacji** — **Menu → Sprawdź dostępność aktualizacji**
  sprawdza, czy w pliku c64va.tech jest dostępna nowsza wersja, a po
  potwierdzeniu pobiera instalator dla Twojej platformy z paskiem postępu i
  instaluje go. Zobacz [Aktualizacje w aplikacji](#koala). To sprawdzanie jest
  również uruchamiane po cichu przy każdym uruchomieniu.
- **Status aktualizacji na pasku stanu Ultimate Basic** — pokazuje **Aktualne
  (vX)** lub podświetlony **Dostępna aktualizacja: vY**, którego kliknięcie
  otwiera okno dialogowe aktualizacji.
- **Edytor krzywych → Eksport UltimateBasic** — **Pliki → Eksport do
  UltimateBasic** zapisuje tabelę jako zainicjowaną tablicę UB; **Pliki →
  Eksport demonstracji UltimateBasic** generuje gotową do uruchomienia
  demonstrację sprite'ów UB. Zobacz [Edytor krzywych]{1}.
- **Ultimate Basic 1.5.8 w pakiecie** — nowy formularz **`data <array>: v, …`**
  wypełnia zadeklarowaną tablicę `array` / `array_word` na początku programu
  (dalsze wiersze są kontynuowane tam, gdzie zakończył się poprzedni, tablice
  słów przyjmują wartości 16-bitowe) bez dotykania strumienia `read`.
- **Układ dopasowany do okna** — panele edytora zajmują dokładnie pozostałą
  wysokość okna, więc aplikacja nie wyświetla już pionowego paska przewijania na
  poziomie strony; panel wyjściowy ASM zachowuje minimalną szerokość 440 px;
  ścieżka do folderu roboczego znajduje się w subtelnym znaczniku nad tytułem
  widoku ASM i korzysta z tego samego znacznika na paskach narzędzi Expert i
  Ultimate Basic. Etykiety przycisków dialogowych nie zawijają się już.
- **Bardziej kompleksowa kontrola aktualizacji** — lista instalatorów jest
  opublikowana na stronie c64va.pro/downloads/VA/, więc kontrola działa z nową
  stroną pobierania; pomocnik aktualizacji systemu Linux nie dziedziczy już
  ścieżek bibliotek AppImage.

---

## Najważniejsze cechy wersji 2.4.6

- **Aktualizacje w aplikacji** — **Menu → Sprawdź dostępność aktualizacji**
  sprawdza, czy w pliku c64va.pro jest dostępna nowsza wersja, a po
  potwierdzeniu pobiera instalator dla Twojej platformy z paskiem postępu i
  instaluje go. Zobacz [Aktualizacje w aplikacji](#in-app-updates). To
  sprawdzanie jest również przeprowadzane po cichu przy każdym uruchomieniu.
- **Aktualizacja języka Ultimate Basic** — podświetlanie składni i odniesienie
  do poleceń obejmują teraz **`sfx`** (efekt SID bez blokowania: `kanał sfx,
  częstotliwość, klatki [, fala]`), **`org`** (kontynuacja kodu sub/fn pod
  adresem, pozostawiając wypełnioną zerami lukę, która może pomieścić dane
  `incbin`), **`włączenie zestawu znaków` / `wyłączenie zestawu znaków`**
  (przełączenie VIC-II na zestaw znaków RAM i z powrotem) oraz **`incbin`
  slicing** (`incbin "font.prg", $3C00, 2` pomija pierwsze bajty, opcjonalny
  czwarty argument ogranicza długość).
- **Podświetlanie wielu bloków w widoku ASM** — zaznaczenie kilku bloków
  powoduje jednoczesne podświetlenie wszystkich ich linii ASM, pozycja
  przewijania pozostaje stabilna podczas zaznaczania, a numery linii są
  łagodniejsze dzięki subtelnej regule separatora pionowego.
- **Tryb asemblera zachowany we wszystkich przełącznikach Ultimate Basic** —
  otwarcie projektu lub wbudowanej próbki, gdy Ultimate Basic jest aktywny,
  powoduje teraz najpierw opuszczenie UB i powrót do ostatniego trybu
  blokowego/eksperckiego, dzięki czemu bufor UB nie może już nadpisać trybu ani
  tytułu nowej karty. Nowe karty są tworzone w prawidłowym trybie.
- **Ustawienia Kung Fu Flash 2** — przycisk **Wykryj USB** w Ustawieniach
  sprzętowych ponownie skanuje port szeregowy kartridża, a wymagania wstępne
  KFF2 teraz wskazują wymagane oprogramowanie układowe Kung Fu Flash (v2.07+).
- **Odniesienie do poleceń Ultimate Basic** — polecenia `tune` i `music`
  zawierają pełne, skomentowane przykłady (format komórki, efekty, notatki
  gracza, `music play N`); polecenia `inst`, `order`, `pat` i tune `speed` mają
  własne wpisy; polecenia `data` zawierają nową formę tablicy; poprawiono
  składnię polecenia `load sid` (`load sid "tune.sid", $2000`).

---

## Najważniejsze cechy wersji 2.4.5

- **Obsługa Kung Fu Flash 2 — uruchamiaj swoje programy na prawdziwym Commodore
  64/128.** Nowy wpis **Kung Fu Flash 2** w podzielonym menu **Uruchom**
  kompiluje program i przesyła go przez USB bezpośrednio do prawdziwego,
  włączonego komputera C64 (lub C128) z wbudowaną kartą Kung Fu Flash 2 — bez
  obrazu dysku, kopiowania z karty SD i emulatora. Działa w trybach blokowym,
  eksperckim i Ultimate Basic. Port szeregowy USB karty jest wykrywany
  automatycznie (i można go wpisać ręcznie); zobacz [Kung Fu Flash 2]{1}, aby
  zapoznać się z konfiguracją i dokładnym przebiegiem pracy.
- **Panele Program/ASM z możliwością zmiany rozmiaru** — cienki pionowy podział
  między panelem Program a panelem ASM/Wyjście pozwala przesunąć granicę w lewo
  lub w prawo (minimum 260 px na panel). Klawisze strzałek przesuwają go,
  dwukrotne kliknięcie resetuje podział do proporcji 50/50, a położenie jest
  zapamiętywane między sesjami. Podział jest ukryty w trybach Expert i Ultimate
  Basic oraz w układzie wąskiego stosu.
- **Czystsze linie makr w widoku ASM** — bloki makr są teraz wyświetlane bez
  początkowego znacznika komentarza (`.print "HELLO"`, `.if A == 1`,
  `.sprite_init …` zamiast `; .print …`), a moduł podświetlania składni ASM
  koloruje je jako makra. Zwykłe bloki KOMENTARZA i znaczniki regionów nadal
  zaczynają się od `;`.
- **Niestandardowe podświetlanie makr w edytorze eksperta** — nazwa makra po
  `.macro`, `.invoke` i `.call` (oraz wywołaniach w stylu Kick `:name(...)`) ma
  własny kolor, podobnie jak zamienniki `{param}` wewnątrz treści makra i nazwy
  parametrów w nagłówku `.macro` w każdym motywie.
- **Odświeżone okno dialogowe „O programie”** — szerszy układ dwukolumnowy z
  pogrupowanymi linkami do projektów, licencji i źródeł, a baner Ultimate Basic
  ma teraz przezroczyste tło, dzięki czemu pasuje do każdego motywu.

---

## Najważniejsze cechy wersji 2.4.3

- **Edytor SID: Lista utworów/kolejności** — wzory są teraz układane za pomocą
  odpowiedniej listy utworów/kolejności, umieszczonej na banku surowych wzorów,
  dzięki czemu wzór może się powtarzać, a utwór może być dłuższy niż liczba
  zapisanych wzorów. Dodawaj, usuwaj i zmieniaj kolejność kroków bezpośrednio z
  Edytora SID; odtwarzanie i wyeksportowany odtwarzacz korzystają z tej listy, a
  nie z surowej kolejności wzorów.
- **Edytor SID: Kolumna efektów** — każda komórka śledząca może teraz zawierać
  efekt obok swojej nuty: **V**ibrato, slajd **U**p / **D**own, nuta-**C**ut i
  zmiana tempa (**F**). Wpisz go bezpośrednio do komórki, np. `C-4 01 V24` (nuta
  + instrument + vibrato) lub `F06` (tylko zmiana tempa). Efekty są uruchamiane
  raz na wiersz, zgodnie z eksportowanym odtwarzaczem, i teraz są odtwarzane
  prawidłowo zarówno w podglądzie Web Audio w aplikacji, jak i w skompilowanym
  eksporcie 6502 — to prawdziwy, grywalny silnik efektów, a nie tylko
  rusztowanie eksportu.
- **Format zapisu SID zgodny z poprzednimi wersjami** — zapisy SID zawierają
  teraz znacznik wersji, więc starsze zapisy `.bin` wykonane przed powstaniem
  kolumny efektów są wczytywane dokładnie tak samo jak wcześniej, a efekty są po
  prostu nieobecne.
- **Edytor D64: jawny obieg zapisu** — każda edycja
  (dodawanie/wyodrębnianie/zmiana nazwy/usuwanie, a teraz także edycja bajtów w
  Edytorze Bloków) odbywa się na prywatnej kopii roboczej; nic nie ma wpływu na
  Twój prawdziwy plik `.d64`, dopóki nie klikniesz przycisku **Zapisz**, który
  również najpierw zapisuje automatyczną kopię zapasową. Zamknięcie edytora lub
  otwarcie innego dysku z niezapisanymi zmianami teraz wyświetla prośbę o
  potwierdzenie, zamiast bezgłośnie je odrzucać.
- **Edytor D64: Siatka heksadecymalna edytora bloków** — surowy widok bajtów dla
  wybranego bloku 256 bajtów jest teraz poprawną siatką heksadecymalną dla
  każdego bajtu, a nie zwykłym polem tekstowym, a jego okno dialogowe nie
  przyciemnia już reszty aplikacji znajdującej się za nim po otwarciu.
- **Web64 na stronie produktu** — nowa sekcja IDE Web64 na
  [c64va.pro](https://www.c64va.pro).
- **Aktualizacja przykładu** — przykład `makro z parametrem` używa teraz formy
  `.macro setColor(color)` w nawiasach.

---

## Najważniejsze cechy wersji 2.4.2

- **Przeciągnij i upuść do edytora D64** — upuść skompilowany plik `.prg`/`.bin`
  (z eksportów edytorów SID/sprite/char lub z dowolnego innego miejsca)
  bezpośrednio na obraz dysku; panel Dodaj otworzy się z wstępnie wypełnionym
  plikiem. Upuszczenie kilku plików naraz spowoduje umieszczenie ich w kolejce
  jeden po drugim.
- **Generuj plik dołączony** — nowy przycisk na pasku narzędzi zapisuje plik
  `.inc` zawierający listę `.const NAME = $ADDR` dla każdego wpisu na dysku,
  dzięki czemu program główny może odwołać się do miejsca, w którym każdy z nich
  się znalazł, bez konieczności ręcznego przepisywania adresów.
- **Edytor bloków (nowy)** — przełącznik na pasku narzędzi przełącza Edytor D64
  na dostęp do surowych ścieżek/sektorów poniżej katalogu: klikalna mapa bloków
  (pokolorowana bitmapą wolnych/używanych plików BAM, z łańcuchem BAM i
  katalogów oznaczonym oddzielnie), widok/edytor szesnastkowy dla wybranego
  bloku 256-bajtowego oraz nawigacja po sektorach Poprzedni/Następny. Odczytuje
  i zapisuje obraz dysku bezpośrednio (`read_bin_file`/`write_bin_file`),
  niezależnie od `c1541`.
- **Edytor D64: jawny obieg zapisu ** — każda edycja
  (dodawanie/wyodrębnianie/zmiana nazwy/usuwanie, a teraz także edycja bajtów w
  Edytorze Bloków) odbywa się na prywatnej kopii roboczej; nic nie ma wpływu na
  Twój prawdziwy plik `.d64`, dopóki nie klikniesz przycisku **Zapisz**, który
  również najpierw zapisuje automatyczną kopię zapasową. Zamknięcie edytora lub
  otwarcie innego dysku z niezapisanymi zmianami teraz wyświetla prośbę o
  potwierdzenie, zamiast bezgłośnie je odrzucać.
- **Edytor D64: Siatka heksadecymalna edytora bloków** — surowy widok bajtów dla
  wybranego bloku 256 bajtów jest teraz poprawną siatką heksadecymalną dla
  każdego bajtu, a nie zwykłym polem tekstowym, a jego okno dialogowe nie
  przyciemnia już reszty aplikacji znajdującej się za nim po otwarciu.

---

## Najważniejsze cechy wersji 2.4.1

- **Języki interfejsu użytkownika: polski i włoski** — pełne tłumaczenie
  interfejsu (menu, okna dialogowe, opisy mnemotechniczne, odnośniki do poleceń
  Ultimate Basic) obok istniejących wersji: węgierskiej, angielskiej,
  hiszpańskiej, niemieckiej i holenderskiej.
- **Przycisk paska narzędzi Pomocy online** — nowy przycisk ikony po
  uruchomieniu Debug, który otwiera wielojęzyczną witrynę dokumentacji
  ([c64va.tech/docs.html]{1}) bezpośrednio z aplikacji.
- **Centralne opisy mnemoników:** Opisy mnemoników dla poszczególnych języków
  zostały przeniesione do współdzielonego pliku tłumaczenia wraz z pozostałymi
  ciągami interfejsu użytkownika. Naprawiono również długotrwały błąd, w wyniku
  którego angielskie opisy poleceń `PRINT`, `PRINT_HEX`, `CLEAR_SCREEN`,
  `WAIT_KEY`, `SET_BORDER`, `SET_BG`, `IRQ_SETUP` i `RAND` były po cichu
  nadpisywane resztkami tekstu hiszpańskiego.

---

## Najważniejsze cechy wersji 2.4.0

- **Edytor D64** — pełna przeglądarka obrazów dysków na pasku narzędzi (po
  Edytorze Krzywych). Otwórz istniejący plik `.d64`, utwórz nowy, pusty lub
  uruchom bieżący dysk bezpośrednio w programie VICE – wszystko z menu Pliki ▾,
  podobnie jak w innych edytorach wizualnych. Zobacz [Edytor D64 (przeglądanie i
  edycja istniejącego obrazu dysku)]{1}.
- **Przycisk paska narzędzi Pomocy online** — nowy przycisk ikony po
  uruchomieniu Debug, który otwiera wielojęzyczną witrynę dokumentacji
  ([c64va.pro/docs.html](https://www.c64va.pro/docs.html)) bezpośrednio z
  aplikacji.
- **Adres ładowania, adres dekompresji i Exomizer w edytorze D64** — dodanie
  pliku RAW bez nagłówka pozwala ustawić opcjonalny adres ładowania, cel
  dekompresji Exomizera i skompresować go w trakcie przesyłania, używając tych
  samych trybów kompresji `mem`/`sfx`, co pliki dodatkowe w oknie dialogowym
  Eksport do D64. Plik `.prg`, który zawiera już własny nagłówek, całkowicie
  pomija te pola.

---

## Najważniejsze cechy wersji 2.3.9

- **`*` w dowolnym wyrażeniu** — symbol licznika programów działa teraz wewnątrz
  wyrażeń operandów, a nie tylko samodzielnie: `BNE *-5`, `JMP *+20`, `LDA
  #&lt;*`, `LDA #&gt;(*+63)`. `*` następujący po wartości (`STRIDE*2`) to nadal
  mnożenie. Zobacz [Tryby adresowania → Licznik programów `*` w
  wyrażeniach](#d64-editor-browse--edit-an-existing-disk-image).
- **Lokalne etykiety (kropkowane)** — etykieta taka jak `.loop` należy do
  zakresu najbliższej poprzedzającej ją etykiety globalnej *(niekropkowanej),
  więc `DrawSprite` i `ClearScreen` mogą definiować własne etykiety `.loop` bez
  kolizji. Zobacz [Lokalne etykiety (kropkowane)]{1}.
- **Pseudooperacje z długimi gałęziami** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`,
  `LBMI`, `LBPL`, `LBVC`, `LBVS` asemblacja do odwróconej gałęzi przez `JMP`
  (zawsze 5 bajtów), dzięki czemu cel może znajdować się w dowolnej odległości.
  Nowa kategoria palety **Długie gałęzie**. Zobacz [LBNE / LBEQ / … (Długie
  gałęzie)]{1}.
- Dyrektywa **`.assert`** — `.assert end - start &lt;= 256` lub `.assert * &lt;
  $A000, „message” ` jest oceniane w czasie montażu i kończy kompilację
  niepowodzeniem (pokazując rzeczywistą wartość), gdy wyrażenie jest fałszywe.
  Zobacz [.ASSERT]{1}.
- **Etykiety operandów kodu samomodyfikującego** — `Wartość LDA:#$00` definiuje
  etykietę `wartość` wskazującą na bajt operandu instrukcji, więc `Wartość STA`
  łata ją bezpośrednio. Zobacz [Etykiety operandów kodu samomodyfikującego]{1}.
- **Przyjaźniejsze błędy gałęzi poza zakresem** — gałąź, która ląduje poza
  zakresem −128…+127, teraz dokładnie raportuje, o ile wykracza poza zakres i
  sugeruje pasującą `LBxx` długą gałąź.
- **Ulepszono:** odznaka wskaźnika trybu motywu jasnego na pasku narzędzi (TRYB
  BLOKOWY / TRYB EKSPERCKI / …) jest ciemniejsza i bardziej czytelna, a jej
  migocząca animacja jest ponownie widoczna.

---

## 1. Przegląd interfejsu

Aplikacja jest podzielona na trzy główne panele:

- **`*` w dowolnym wyrażeniu** — symbol licznika programów działa teraz wewnątrz
  wyrażeń operandów, a nie tylko samodzielnie: `BNE *-5`, `JMP *+20`, `LDA
  #&lt;*`, `LDA #&gt;(*+63)`. `*` następujący po wartości (`STRIDE*2`) to nadal
  mnożenie. Zobacz [Tryby adresowania → Licznik programów `*` w
  wyrażeniach](#the--program-counter-in-expressions).
- **Lokalne etykiety (kropkowane)** — etykieta taka jak `.loop` należy do
  zakresu najbliższej poprzedzającej ją etykiety globalnej *(niekropkowanej),
  więc `DrawSprite` i `ClearScreen` mogą definiować własne etykiety `.loop` bez
  kolizji. Zobacz [Lokalne etykiety (kropkowane)](#local-dotted-labels).
- **Pseudooperacje z długimi gałęziami** — `LBNE`, `LBEQ`, `LBCC`, `LBCS`,
  `LBMI`, `LBPL`, `LBVC`, `LBVS` asemblacja do odwróconej gałęzi przez `JMP`
  (zawsze 5 bajtów), dzięki czemu cel może znajdować się w dowolnej odległości.
  Nowa kategoria palety **Długie gałęzie**. Zobacz [LBNE / LBEQ / … (Długie
  gałęzie)](#lbne--lbeq---long-branches).
- Dyrektywa **`.assert` ** — `.assert end - start &lt;= 256` lub `.assert * &lt;
  $A000, „message” ` jest oceniane w czasie montażu i kończy kompilację
  niepowodzeniem (pokazując rzeczywistą wartość), gdy wyrażenie jest fałszywe.
  Zobacz [.ASSERT](#assert).
- **Etykiety operandów kodu samomodyfikującego** — `Wartość LDA:#$00` definiuje
  etykietę `wartość` wskazującą na bajt operandu instrukcji, więc `Wartość STA`
  łata ją bezpośrednio. Zobacz [Etykiety operandów kodu
  samomodyfikującego](#self-modifying-code-operand-labels).
- **Przyjaźniejsze błędy gałęzi poza zakresem** — gałąź, która ląduje poza
  zakresem −128…+127, teraz dokładnie raportuje, o ile wykracza poza zakres i
  sugeruje pasującą `LBxx` długą gałąź.

---

## 2. Paleta blokowa

Paleta po lewej stronie zawiera listę wszystkich dostępnych bloków pogrupowanych
według kategorii:

| Płyta                 | Opis                                                                                |
| --------------------- | ----------------------------------------------------------------------------------- |
| **Lewo — Paleta**     | Wszystkie dostępne instrukcje i bloki makr. Szukaj lub przeglądaj według kategorii. |
| **Centrum — Program** | Twój program. Przeciągnij bloki tutaj, zmień ich kolejność, edytuj operandy.        |
| **Prawy — Wyjście**   | Podgląd na żywo ASM i/lub wyjście monitora pamięci.                                 |

Użyj pola wyszukiwania **** u góry palety, aby filtrować według nazwy. Kliknij
przycisk **Dodaj wybrany blok** lub przeciągnij blok do obszaru programu.

W trybie blokowym cienki **pionowy separator ** znajduje się między panelami
Program i Wyjście. Przeciągnij go, aby dać każdemu panelowi więcej miejsca
(każdy zachowa co najmniej 260 px), użyj klawiszy ← / →, aby przesuwać go o 16
px, lub kliknij go dwukrotnie, aby przywrócić podział do proporcji 50/50.
Pozycja jest zapisywana w ustawieniach interfejsu użytkownika. Separator jest
ukryty w trybach Ekspert i Ultimate Basic oraz gdy okno jest wystarczająco
wąskie, aby panele mogły się układać.

---

## 3. Obszar programu

Paleta po lewej stronie zawiera listę wszystkich dostępnych bloków pogrupowanych
według kategorii:

- **Przeciągnij i upuść** bloki z palety lub **zmień kolejność** istniejących
  bloków, przeciągając ich uchwyt (≡).
- Każdy blok pokazuje swój **mnemonik**, **pole operandu** i **selektor trybu
  adresowania** (jeśli ma to zastosowanie).
- Kliknij przełącznik **▸ / ▾**, aby zwinąć lub rozwinąć blok.
- Aby usunąć blok, naciśnij przycisk **× (usuń)**.
- Przycisk **Zwiń wszystko** powoduje zwinięcie wszystkich bloków na raz.
- **Operacje rejestrowe** — TAX, TAY, INX, DEX, …
- **Przesunięcie i obrót** — ASL, LSR, ROL, ROR
- **Stos** — PHA, PHP, PLA, PLP
- **System** — CLC, SEC, NOP, BRK, …
- **Nielegalne instrukcje** — LAX, SAX, DCP, …
- **Struktura** — ETYKIETA, KOMENTARZ, REGION, REGION KOŃCOWY
- **Makra** — PĘTLA, NASTĘPNY, DLA, ZAKOŃCZENIE, WCIŚNIJ, POCIĄGNIJ, KONIEC,
  TEKST, BAJT, SŁOWO, WYPEŁNIJ, WYRÓWNAJ, POTWIERDŹ, STRING, DANE, RAWBYTES,
  RAWTEXT, PETSCII, ZESTAW ZNAKÓW, INCBIN, SID, DOŁĄCZ, TABELA, ORG, MAKRO,
  ENDM, WYWOŁAJ, JEŻELI, W PRZECIWNYM WYPADKU, ENDIF, ZMIENNA, PODCZAS, ENDW,
  POWTARZAJ, DOPÓKI, MEMCPY, ZESTAW MEMSET, DRUKUJ, PRINT_CHAR, PRINT_HEX,
  WYCZYŚĆ_EKRAN, CZEKAJ_KLUCZ, OPÓŹNIJ, USTAW_BORDER, USTAW_BG, IRQ_SETUP, LOS,
  SPRITE_INIT, SPRITE_POS, WAIT_RASTER, JOYSTICK, MYSZ, SPRITE_COL, LOADFILE,
  REU_CHECK, REU_STASH, REU_FETCH, REU_SWAP, TURBO_SET, SUPERCPU_DETECT,
  TURBO_ENABLE, MAP_COPY, MAP_COPY16X16, SPRITE_ANIM, SCORE_BCD

Użyj pola wyszukiwania **** u góry palety, aby filtrować według nazwy. Kliknij
przycisk **Dodaj wybrany blok** lub przeciągnij blok do obszaru programu.

---

## 4. Widok ASM

- **Przeciągnij i upuść** bloki z palety lub **zmień kolejność** istniejących
  bloków, przeciągając ich uchwyt (≡).
- Każdy blok pokazuje swój **mnemonik**, **pole operandu** i **selektor trybu
  adresowania** (jeśli ma to zastosowanie).
- Kliknij przełącznik **▸ / ▾**, aby zwinąć lub rozwinąć blok.
- Aby usunąć blok, naciśnij przycisk **× (usuń)**.
- Przycisk **Zwiń wszystko** powoduje zwinięcie wszystkich bloków na raz.

### Tryby wyjściowe

Bloki makr pojawiają się w widokach ASM i Both jako proste linie makr bez
znacznika komentarza (`.print "HELLO"`, `.wait_raster $FF`, `.invoke
setColor(blue)`) i są kolorowane jak makra; tylko prawdziwe bloki KOMENTARZA,
znaczniki regionów i ostrzeżenia zachowują swoje wiodące `;`.

| Kolor paska     | Opis                                                                                                                                                                                                                                                                                                                  |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cyjan           | Źródło montażu 6502 z adresami i etykietami                                                                                                                                                                                                                                                                           |
| **Monitor**     | Zrzut szesnastkowy/bajtowy (w stylu monitora C64)                                                                                                                                                                                                                                                                     |
| **Dyzasm**      | Czysty deasembler 6502: adres · bajty szesnastkowe · mnemoniki z rozwiązanymi operandami numerycznymi. Makra są rozwijane do pojedynczych instrukcji (TEKST → pary LDA/STA, PĘTLA → LDX itd.). Dane BAJT/SŁOWO/WYPEŁNIENIE prezentowane jako zrzut szesnastkowy. Brak nazw makr, komentarzy ani adnotacji w wynikach. |
| **Oba**         | ASM na górze, monitor poniżej                                                                                                                                                                                                                                                                                         |
| **Dezasembler** | Tak samo jak w Disasm — dedykowana zakładka do widoku demontażu                                                                                                                                                                                                                                                       |

Zwinięte bloki są renderowane z mniejszą przezroczystością. Kliknij lub
przeciągnij w dowolne miejsce minimapy, aby przewinąć listę programów do tej
pozycji. Wskaźnik widoku (prostokąt w kolorze akcentującym) śledzi widoczną
część listy. Stan jest zapisany w ustawieniach interfejsu użytkownika (klawisz
`blockMinimap`).

### Karta Zestaw narzędzi

- W przypadku instrukcji rozgałęzienia/skoku (`BNE`, `JMP`, `JSR` itd.) pojawia
  się rozwijana lista wyboru etykiet **** — kliknij zdefiniowaną etykietę, aby
  ją wstawić.
- Format liczb jest zgodny z przełącznikiem **HEX / DEC** na pasku narzędzi
  (patrz sekcja 5).

---

## 5. Ustawienia i pasek narzędzi

Prawy panel pokazuje wygenerowany wynik w czasie rzeczywistym.

### Migawki projektu

| Tryb                | Opis                                                                                                                                                                                                                                                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ASM**             | Źródło montażu 6502 z adresami i etykietami                                                                                                                                                                                                                                                                           |
| **Monitor**         | Zrzut szesnastkowy/bajtowy (w stylu monitora C64)                                                                                                                                                                                                                                                                     |
| **Dyzasm**          | Czysty deasembler 6502: adres · bajty szesnastkowe · mnemoniki z rozwiązanymi operandami numerycznymi. Makra są rozwijane do pojedynczych instrukcji (TEKST → pary LDA/STA, PĘTLA → LDX itd.). Dane BAJT/SŁOWO/WYPEŁNIENIE prezentowane jako zrzut szesnastkowy. Brak nazw makr, komentarzy ani adnotacji w wynikach. |
| **Oba**             | ASM na górze, monitor poniżej                                                                                                                                                                                                                                                                                         |
| **Dezasembler**     | Tak samo jak w Disasm — dedykowana zakładka do widoku demontażu                                                                                                                                                                                                                                                       |
| **Zestaw narzędzi** | Panel referencyjny C64: próbnik palety 16 kolorów + kod sterujący PETSCII i ściągawka ze znakami do druku. Tylko do odczytu — szczegóły w podsekcji „Zestaw narzędzi” poniżej.                                                                                                                                        |
| **Opcje**           | Panel ustawień programu — format liczb, przełączanie źródła makra, parametry debugera                                                                                                                                                                                                                                 |

Migawki projektu są przechowywane jako pliki JSON sidecar na dysku, a nie w
pamięci lokalnej. Są one powiązane z bieżącym plikiem projektu, jeśli taki
istnieje, dzięki czemu historia przetrwa ponowne uruchomienia i będzie śledzić
projekt.

### Aktualizacje w aplikacji

**Menu → Sprawdź dostępność aktualizacji** wyszukuje najnowszą wersję na
c64va.tech (odczytuje linki do pobrania dla Twojej platformy) i porównuje ją z
bieżącą wersją:

| Sekcja    | Co się dzieje                                                                                                                                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Okna**  | Instalacja przebiega w trybie pasywnym (tylko postęp) i uruchamia nową wersję po jej zakończeniu. Instalacja na komputerze wymaga uprawnień administratora (UAC).                                                                      |
| **macOS** | Plik DMG zostaje zamontowany, a pakiet aplikacji zostaje zastąpiony nowym, po czym uruchamiana jest nowa wersja. Jeśli folder aplikacji nie jest zapisywalny, plik DMG jest po prostu otwierany, aby można było przeciągnąć aplikację. |

Po pobraniu aplikacja zainstaluje aktualizację i uruchomi się ponownie:

### Przestrzenie robocze

Obszar roboczy **** (plik `.vaws`) zapamiętuje, które rzeczywiste pliki na dysku
były otwarte na każdej karcie — w tym tryb edytora każdej karty i która karta
była aktywna — dzięki czemu można później ponownie otworzyć ten sam zestaw. Jest
on niezależny od projektu `.proj`: obszar roboczy może obejmować dowolną
kombinację plików projektu Block/Expert `.json`, samodzielnych plików `.asm`
oraz plików źródłowych Ultimate Basic `.ub`/`.proj` na wielu kartach.

- Przestrzenie robocze **zapisują się automatycznie** kilkaset milisekund po
  wprowadzeniu zmiany, jeśli została ona zapisana lub otwarta.
- Aplikacja **automatycznie przywraca ostatnią przestrzeń roboczą** po
  uruchomieniu, dzięki czemu możesz kontynuować pracę na otwartych kartach od
  miejsca, w którym przerwałeś.
- W obszarze roboczym zapisywane są tylko karty oparte na rzeczywistym pliku na
  dysku; karta zawierająca niezapisaną próbkę lub program znajdujący się
  wyłącznie w pamięci nie ma niczego do zapisania i jest pomijana (jeśli żadna z
  otwartych kart nie kwalifikuje się, wyświetlane jest powiadomienie).
  - **`-jmp` ON/OFF** — przejdź bezpośrednio do adresu startowego programu po
    załadowaniu.
  - **`-unpause` WŁ./WYŁ.** — natychmiastowe wznawianie debugera po załadowaniu.
  - **`-wait` ms ON/OFF** — dodaje opóźnienie `-wait <ms>` przed wznowieniem;
    wybierz 500 ms lub 1000 ms z listy rozwijanej.
- Otwarcie obszaru roboczego powoduje najpierw zamknięcie wszystkich otwartych
  kart — przed kontynuacją zostaniesz poproszony o potwierdzenie.

### Szablony projektów

**Menu → Plik → Nowy projekt z szablonu…** — lub przycisk na pasku narzędzi
pomiędzy **Menu** i **Samouczki** — otwiera okno dialogowe szablonu:

### Zbuduj projekt

**Menu → Kompilacja → Kompilacja projektu** kompiluje cały projekt w jednym
kroku. Zostają zbudowane pliki otwartego projektu `.proj` — lub, bez projektu,
otwarte zakładki plików:

- każde możliwe do skompilowania źródło (`.asm`, blok `.json`, `.ub`) jest
  kompilowane do pliku `.prg` **obok jego źródła** o tej samej nazwie; po
  włączeniu opcji **Uruchom z Exomizerem** dane wyjściowe są kompilowane;
- pliki pomocnicze debugera (symbole/mapa źródłowa) są zapisywane obok PRG,
  jeśli są dostępne;

### Przykładowe programy

**Menu → Przykłady…** otwiera przeglądarkę przykładów: wbudowane przykładowe
programy pogrupowane tematycznie (Podstawy, Makra i przepływ sterowania,
Grafika, Sprite'y i dane wejściowe, Pliki i ładowanie, Muzyka, IRQ i sprzęt) w
dwóch kolumnach.

- Wpisz w polu wyszukiwania, aby filtrować według nazwy lub kategorii. Stopka
  pokazuje, ile przykładów pasuje.
- Kliknij przykład, aby go wybrać, **↑ / ↓** przesuń wybór; **kliknij
  dwukrotnie**, **Enter** lub **Załaduj** ładuje go.
- Okno dialogowe otworzy się na ostatnio załadowanym przykładzie.

Okno modalne zamyka się automatycznie po zakończeniu akcji lub jej
niepowodzeniu.

---

## Tryb Ultimate Basic

| Kontrola                                                                               | Opis                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Podstawa liczbowa (HEX / DEC / BIN)**                                                | Ustawia format wyświetlania/wprowadzania operandów w całym interfejsie użytkownika. Tryb BIN wyświetla wartości jako binarne z prefiksem `%` (np. `%11111000`). Widok ASM zawsze wyświetla każdy blok w jego własnym formacie.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Język**                                                                              | Przełączanie interfejsu użytkownika między językiem angielskim, węgierskim, hiszpańskim, niemieckim i holenderskim (Nederlands)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Motyw**                                                                              | Jasny / Ciemny / OLED / Commodore 77 / Commodore Starlight / Commodore Beige / Commodore 64 — wybierz z selektora motywów w menu Ustawienia. OLED używa czystego czarnego tła dla wyświetlaczy AMOLED. Commodore 77 to neonowo-żółty motyw na czarnym tle; gdy jest aktywnym motywem, panel powitalny startowy używa koloru panelu motywu (pasującego do karty wiadomości), pokazuje mniejsze dedykowane logo Commodore 77 i żółty pasek postępu. Commodore Starlight to jasny motyw po półprzezroczystym chlebaku C64: matowe przezroczyste szklane panele z tęczową poświatą RGB, magenta akcent, tęczowe kolory składni i przydymiony ciemny widok monitora. Commodore Beige to klasyczny chlebak: beżowa obudowa, musztardowe przyciski funkcyjne, tęczowe paski na plakietce i niebieski ekran C64 dla widoku monitora. Wybrany motyw jest stosowany przed pierwszym malowaniem przy następnym uruchomieniu. |
| **Tryb retro CRT**                                                                     | Przełącza pełnoekranowy filtr CRT: linie skanowania, winietę fosforową, migotanie i zniekształcenie beczkowate. Stan jest zapisywany między sesjami.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Pokaż panel pamięci**                                                                | Globalny przełącznik pokazujący lub ukrywający cały panel pamięci C64                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Podstawowy schemat systemu **                                                        | Dodaje wiersz języka BASIC, który wywołuje SYS do źródła programu                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Przykłady…**                                                                         | Otwórz przykładową przeglądarkę i załaduj wbudowany przykładowy program — zobacz [Przykładowe programy](#example-programs)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Powiększ / pomniejsz **                                                              | Skalowanie interfejsu użytkownika bloku (dotyczy wszystkich elementów bloku)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Zapisz projekt**                                                                     | Zapisz bieżący program jako plik projektu `.json`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Zapisz program jako**                                                                | Zapisz bieżący program jako plik projektu `.json` za każdym razem, korzystając z nowego okna dialogowego pliku                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Załaduj projekt**                                                                    | Załaduj wcześniej zapisany projekt                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Zapisz obszar roboczy**                                                              | Zapisz dokładny zestaw aktualnie otwartych kart z kopią zapasową pliku — w tym aktywną kartę i tryb edytora każdej karty (Blok/Ekspert/Ultimate Basic) — w pliku obszaru roboczego `.vaws`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Zapisz obszar roboczy jako**                                                         | Zapisz bieżący obszar roboczy za każdym razem, korzystając z nowego okna dialogowego pliku                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Otwórz przestrzeń roboczą**                                                          | Zamknij wszystkie otwarte karty i ponownie otwórz zestaw plików przechowywanych w pliku obszaru roboczego `.vaws`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Ustaw folder roboczy**                                                               | Wybierz domyślny folder używany przez selektory plików i okna dialogowe zapisu. Ścieżka jest zapisywana w konfiguracji aplikacji, a podglądy menu utrzymują koniec ścieżki widoczny.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Nowy projekt z szablonu…** (`Menu → Plik` lub przycisk paska narzędzi obok **Menu**) | Utwórz nowy projekt `.proj` z szablonu Assemblera lub UltimateBasic w jego własnym folderze — zobacz [Szablony projektów](#project-templates)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Otwórz projekt** (`Menu → Plik`)                                                     | Otwórz wieloplikowy projekt `.proj` i otwórz wszystkie pliki źródłowe jako zakładki                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Zapisz projekt** (`Menu → Plik`)                                                     | Zapisz bieżący projekt `.proj` (panel projektu musi być otwarty)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Zamknij projekt** (`Menu → Plik`)                                                    | Zamknij aktualnie otwarty projekt i wszystkie jego zakładki plików. Wyświetla monit o zapisanie niezapisanych zmian. Panel projektu resetuje się do stanu pustego.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Załaduj plik .asm**                                                                  | Otwiera plik `.asm` w trybie eksperta i importuje tekstowy plik ASM 6502 do bieżącej karty                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Zapisz program **                                                                    | Eksportuj skompilowany plik binarny jako plik `.prg`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Budowa CRT**                                                                         | Wyeksportuj program jako plik Magic Desk o rozmiarze 64 KB (`.crt`, typ kartridża 19). Zobacz [Sekcję 12b](#12b-crt-export-magic-desk-64k-cartridge).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Buduj projekt** (`Menu → Buduj`)                                                     | Kompiluj każdy możliwy do skompilowania plik projektu (lub otwartych kart) do pliku `.prg` obok jego źródła — zobacz [Kompilowanie projektu](#build-project)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Uruchom (przycisk podziału)**                                                        | Główny przycisk **▶ Uruchom** uruchamia bieżący tryb; kliknij strzałkę **▾**, aby przełączać się między: **Uruchom jako PRG** (kompilacja i uruchomienie programu VICE bezpośrednio), **Uruchom przez D64** (pakowanie do obrazu dysku .d64 i uruchomienie programu VICE), **Uruchom na sprzęcie** (wysyłanie PRG do urządzenia C64 Ultimate / 1541 Ultimate) lub **Kung Fu Flash 2** (przesyłanie PRG przez USB do prawdziwego komputera C64/C128 za pomocą kartridża Kung Fu Flash 2). Zobacz [Sekcję 12](#12-d64-export--run) i [Sekcję 13](#13-hardware-settings).                                                                                                                                                                                                                                                                                                                                            |
| **Debugowanie (RetroDebugger)**                                                        | Kompiluj i uruchamiaj w RetroDebuggerze z punktami przerwania, symbolami i flagami autostartu (patrz [Sekcja 9](#9-debugger-integration))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Uruchom z Exomizerem**                                                               | Pole wyboru w menu Ustawienia — po zaznaczeniu wszystkie operacje Uruchom i Kompilacja przeszukują PRG przez `exomizer sfx sys` przed uruchomieniem lub zapisaniem. Działa z opcjami Uruchom jako PRG, Uruchom przez D64, Uruchom na sprzęcie, Kompilacja PRG i Kompilacja D64. Najpierw skonfiguruj plik wykonywalny Exomizera w **Ustawieniach sprzętu**.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Automatyczne wpisy autozapisu**                                                      | Pole wyboru w **Ustawienia sprzętowe → Kontrola wersji **. Po włączeniu aplikacja dodaje wpis automatycznego zapisu do historii wersji około 2,5 sekundy po zakończeniu edycji karty (w przypadku karty projektu również do historii projektu). Wyłącz tę opcję, jeśli chcesz mieć dostęp tylko do własnych zatwierdzeń. Zobacz [Kontrola wersji](#version-control).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Ustawienia sprzętowe**                                                               | Otwórz okno dialogowe konfiguracji sprzętu — skonfiguruj VICE, Exomizer, RetroDebugger, C64 Ultimate (host, hasło, test połączenia) i port szeregowy Kung Fu Flash 2. Zobacz [Sekcję 13](#13-hardware-settings).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Nowy program…**                                                                      | Otwiera okno dialogowe potwierdzenia, a następnie czyści wszystkie bloki z obszaru programu                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Zwiń wszystko**                                                                      | Zwiń wszystkie bloki                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **O **                                                                                 | Informacje o wersji                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Co nowego**                                                                          | Dziennik zmian                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

### Kontrola wersji

Każda karta ma własną historię wersji, podobnie jak małe repozytorium Git; karta
należąca do otwartego projektu `.proj` może być również wersjonowana jako cały
projekt (patrz [Tryb projektu](#project-mode)). **Menu → Kompilacja → Kontrola
wersji…** (lub **Zatwierdź…**) otwiera okno dialogowe; **Odrzuć zmiany (powrót
do HEAD)** przywraca bezpośrednio ostatnie zatwierdzenie.

Typowy obieg pracy: napisz **komunikat zatwierdzenia** i naciśnij **Zatwierdź**
(lub Ctrl+Enter) → kontynuuj edycję → naciśnij **Różnica**, aby zobaczyć, co się
zmieniło → ponownie zatwierdź.

- **Zatwierdzenie** — zapisuje aktualny stan karty wraz z Twoją wiadomością.
  Każde zatwierdzenie otrzymuje krótki hash (na przykład `1bd55ba`); najnowsze
  to **HEAD**. Zatwierdzenie bez zmian od czasu HEAD nie jest tworzone.
- **Wiersz stanu** — *Nic do zatwierdzenia, drzewo robocze czyste* lub
  *Niezatwierdzone zmiany od `<skrót>`*.
- **Diff** — zmiany od wersji HEAD; przycisk **Diff** we wpisie dziennika
  porównuje tę wersję z edytorem. Dodane wiersze są oznaczone kolorem zielonym,
  usunięte – czerwonym, a nagłówek wyświetla **+N / −M**. Programy w trybie
  blokowym są porównywane jako linie montażowe (jedna linia na blok), źródła w
  trybie eksperckim – wiersz po wierszu, karty w trybie Ultimate Basic – według
  źródła, więc projekt w trybie blokowym zapisany w formacie JSON nadal pokazuje
  czytelne zmiany.
- **Wymeldowanie** — wczytuje tę wersję do edytora. Plik na dysku zmienia się
  tylko po zapisaniu; **Odrzuć zmiany** wraca do HEAD.
- **Automatyczne zapisywanie wpisów** — dzięki opcji **Ustawienia → Kontrola
  wersji → Automatyczne automatyczne zapisywanie wpisów w kontroli wersji**
  aplikacja dodaje wpis około 2,5 sekundy po zakończeniu edycji. Są one
  oznaczone jako *automatyczne zapisywanie*; ostatnie 20 wpisów jest
  zachowywanych, obok maksymalnie 100 zatwierdzeń.
- Okno dialogowe można przesuwać za pomocą jego nagłówka; otwiera się ono
  ponownie w tym samym miejscu i zamyka za pomocą **Esc** lub przycisku
  zamykania (kliknięcie poza oknem dialogowym nie powoduje jego zamknięcia).
- Historia jest przechowywana obok pliku projektu jako
  `<projekt>.snapshots.json` (w folderze konfiguracji aplikacji do momentu
  zapisania projektu), dzięki czemu nie zanika po ponownym uruchomieniu. Migawki
  utworzone we wcześniejszych wersjach pojawiają się jako zatwierdzenia.

#### Tryb projektu

Gdy karta należy do otwartego projektu `.proj` (panel projektu Expert lub
Ultimate Basic), w nagłówku okna dialogowego wyświetla się przełącznik
**Plik/Projekt**; domyślnie wybrany jest **Projekt**. Karty poza projektem
zachowują historię poszczególnych plików opisaną powyżej.

- **Commit** rejestruje każdy plik źródłowy projektu w jednym wpisie: pliki
  drzewa projektu oraz zawarte w nich pliki tekstowe (`.include`, `include`,
  `#import`, `!source`, bloki INCLUDE w trybie blokowym). Otwarte karty są
  liczone wraz z ich bieżącą, nawet niezapisaną, zawartością; pozostałe pliki są
  odczytywane z dysku. Pliki binarne drzewa projektu (czcionki, `.koa`, `.bin`,
  `.sid` …, do 1 MB każdy) są również rejestrowane; ich diff pokazuje zmianę
  rozmiaru, a **Checkout** zapisuje je bezpośrednio z powrotem na dysk.
- Dziennik pokazuje komunikat zatwierdzenia, krótki hash i **zmienione pliki**
  każdego wpisu (dodano **A**, zmodyfikowano **M**, usunięto **D**).
- **Diff** działa plik po pliku: każdy zmieniony plik otrzymuje własny nagłówek
  i fragmenty.
- **Odrzuć zmiany** W ten sam sposób wraca do ostatniego zatwierdzenia projektu
  (HEAD).
- **Wymeldowanie** (po potwierdzeniu) ładuje do edytora wszystkie pliki danej
  wersji: otwarte zakładki są aktualizowane, brakujące pliki otwierane jako nowe
  zakładki. Nic nie jest zapisywane na dysku, dopóki nie zapiszesz; pliki dodane
  do projektu od tej wersji pozostają bez zmian.
- Wpisy automatycznego zapisywania są wykonywane również na poziomie projektu.
- Historia projektu jest przechowywana obok pliku projektu jako
  `<project>.proj.history.json`.
- W trybie **Git** dziennik pokazuje całe repozytorium ze zmienionymi plikami
  każdego zatwierdzenia (`git log --name-status`); **Diff** we wpisie pokazuje
  zatwierdzenia plik po pliku, przycisk **Diff** porównuje HEAD z plikami
  projektu w edytorze (**RAW** to `git diff HEAD` repozytorium). **Commit**
  zapisuje każdą niezapisaną kartę projektu i umieszcza wszystkie zmiany w
  poczekalni (`git add -A`); **Checkout** ładuje pliki projektu tego
  zatwierdzenia do edytora.

#### Git

Jeśli zainstalowany jest `git`, to samo okno dialogowe może działać z prawdziwym
repozytorium git.

- **Ustawienia → Kontrola wersji:** **Wybierz git.exe…** lub **Automatyczne
  wykrywanie** (przeszukuje ścieżkę PATH i standardowe foldery instalacyjne);
  poniższy wiersz pokazuje wersję gita. **Użyj gita, gdy projekt znajduje się w
  repozytorium** (domyślnie włączone) automatycznie przełącza okno dialogowe w
  tryb gita dla plików w repozytorium. Przełącznik **Wbudowany / Git** w
  nagłówku okna dialogowego zmienia tryb ręcznie.
- Nagłówek pokazuje gałąź z **↑** (zatwierdzenia do wypchnięcia) i **↓**
  (zatwierdzenia do ściągnięcia), a następnie zmienione pliki repozytorium.
- **Commit** najpierw zapisuje plik, przygotowuje tylko ten plik (lub każdą
  zmianę za pomocą **Stage all changes (git add -A)**) i uruchamia `git commit`.
- Dziennik wyświetla commity tego pliku wraz z ich gałęziami i tagami. Przycisk
  **Diff** we wpisie porównuje commit z jego elementem nadrzędnym; przycisk
  **Diff** porównuje HEAD z edytorem, wliczając niezapisane zmiany. Pliki
  projektu są porównywane w ten sam sposób, co w trybie wbudowanym; przycisk
  **RAW** wyświetla zwykły `git diff`.
- **Checkout** ładuje plik tego zatwierdzenia do edytora (`git show`) bez
  dotykania dysku.
- **Pobierz** (`--ff-only`), **Wyślij** (pierwsze przesłanie ustawia źródło na
  `-u origin <branch>`) i **Utwórz repozytorium (git init)**, gdy folder nie
  jest jeszcze repozytorium.
- Git działa bez okna konsoli i nigdy nie pyta o hasło: dane uwierzytelniające
  muszą pochodzić z menedżera danych uwierzytelniających lub klucza SSH, w
  przeciwnym razie w oknie dialogowym zostanie wyświetlony komunikat o błędzie.
  | **Baza wiedzy** | Linki referencyjne (kody operacji 6502, JĄDR C64, mapa
  pamięci, kolory) | | **Sprawdź dostępność aktualizacji** | Sprawdź, czy w
  pliku c64va.pro jest nowsza wersja i pobierz ją/zainstaluj — zobacz
  [Aktualizacje w aplikacji](#in-app-updates) |

### Narzędzia edytora

**Menu → Sprawdź dostępność aktualizacji** wyszukuje najnowszą wersję na
c64va.pro (odczytuje linki do pobrania dla Twojej platformy) i porównuje ją z
działającą wersją:

- podświetlanie składni w oparciu o bieżący podręcznik języka Ultimate Basic;
- numery wierszy, które pozostają zsynchronizowane z długimi plikami;

Panel Demontażu zawiera przycisk **Kopiuj**, który kopiuje cały wyświetlany kod
źródłowy do schowka. Pomoc dotycząca poleceń jest zgodna z dołączonym
kompilatorem: na przykład polecenie `identyfikator_klatki_sprite'a, adres_danych
[, klatka]` wybiera obraz animacji z kolejnych 64-bajtowych klatek sprite'a.

| Platforma | Co się dzieje                                                                                                                                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Okna**  | Instalacja przebiega w trybie pasywnym (tylko postęp) i uruchamia nową wersję po jej zakończeniu. Instalacja na komputerze wymaga uprawnień administratora (UAC).                                                                      |
| **macOS** | Plik DMG zostaje zamontowany, a pakiet aplikacji zostaje zastąpiony nowym, po czym uruchamiana jest nowa wersja. Jeśli folder aplikacji nie jest zapisywalny, plik DMG jest po prostu otwierany, aby można było przeciągnąć aplikację. |
| **Linux** | Obraz aplikacji zostaje zamieniony na nowy. Instalacja `.deb` / `.rpm` zostaje zaktualizowana za pomocą `pkexec` (zostaniesz poproszony o podanie hasła); bez `pkexec` pakiet zostanie otwarty w instalatorze oprogramowania.          |

Lista poleceń ma celowo ograniczoną wysokość, aby karta szczegółów polecenia
mogła wypełnić pozostałą wysokość panelu. Obszar szczegółów przewija się
niezależnie, umożliwiając dostęp do dłuższych opisów składni.

### Wolne i otwarte oprogramowanie

Visual Assembler jest darmowy: każda funkcja — edytory wizualne (SID, Sprite,
Char, Charset, Hi-Res, Map, Level, D64, Curve), SID Player, **Build PRG**,
**Build D64**, **Build CRT**, **Build project**, pakowanie Exomizer,
uruchamianie na C64 Ultimate i na Kung Fu Flash 2, a także każdy język i motyw
interfejsu użytkownika — działają bez rejestracji i numeru seryjnego. Kod
źródłowy jest dostępny na licencji GNU General Public License v3.0 (zobacz
**Menu → About**). Do wersji 2.5.9 aplikacja miała podział na Freemium i
Professional; od wersji 2.6.0 podawanie numeru seryjnego po prostu nie jest już
potrzebne.

Jeśli program Ci się podoba, możesz wesprzeć jego rozwój poprzez darowiznę:
**Menu → Darowizna** (w sekcji Widok) otwiera stronę darowizn na c64va.pro, na
której możesz przekazać dowolną kwotę za pośrednictwem systemu PayPal.

**Statystyki użytkowania.** Najwyżej raz dziennie, przy uruchomieniu, aplikacja
wysyła anonimowy ping do c64va.pro z informacjami o wersji aplikacji, systemie
operacyjnym, języku interfejsu użytkownika, liczbie uruchomień i minutach
aktywności od ostatniego pingu (minuta liczy się, gdy okno jest widoczne i
użytkownik korzystał z myszy lub klawiatury w ciągu ostatnich 5 minut), czy
numer seryjny z wersji 2.5.6–2.5.9 jest nadal zapisany (tylko tak/nie) oraz
losowym identyfikatorem instalacji (zapisanym w pliku `config.json` aplikacji
jako `launchPing`). Nie jest wysyłany żaden adres e-mail, numer seryjny, projekt
ani kod źródłowy; w trybie offline nic się nie dzieje. Aplikacja prosi również
c64va.pro o okazjonalne krótkie wiadomości (na przykład o nowej wersji, czasami
tylko dla osób wspierających); każda wiadomość jest wyświetlana raz.

### Zgłaszanie błędu

**Menu → Zgłoś błąd** otwiera formularz, który wysyła raport bezpośrednio do
programisty.

- Pola **Podsumowanie** i **Co się stało?** są wymagane — opisz, co zrobiłeś,
  czego się spodziewałeś i co się stało zamiast tego. Pola **Adres e-mail** są
  opcjonalne; podaj je, jeśli chcesz otrzymać odpowiedź.
- **Zrzuty ekranu: ** do 4 obrazów z **Dodaj obraz… **, wklejając go za pomocą
  **Ctrl+V** (np. po Win+Shift+S) lub upuszczając go na formularz. Duże obrazy
  są skalowane do 1920 pikseli.
- **Dołącz informacje o systemie i ostatnie błędy** (domyślnie włączone) dodaje
  wersję aplikacji, system operacyjny, język, motyw, edytor i tryb uruchamiania,
  rozmiar ekranu, liczbę bloków i ostatnie błędy aplikacji. **Co jest
  wysyłane?** wyświetla dane. Twój kod źródłowy nie jest wysyłany.
- **Wyślij raport** potwierdza numerem raportu. **Wyślij e-mailem** zamiast tego
  otwiera program pocztowy.

### Wsparcie

**Menu → Pomoc** otwiera czat z programistą: napisz pytanie, pomysł lub problem
i naciśnij **Wyślij** (lub **Ctrl+Enter**). Możesz dołączyć maksymalnie 3 pliki
(łącznie 4 MB): obrazy, pliki źródłowe (`.asm`, `.ub`, `.txt` …), pliki C64
(`.prg`, `.d64`, `.sid`, `.crt` …) lub `.zip` — za pomocą **Załącz plik…**,
wklejając je (**Ctrl+V**) lub przeciągając je do okna. Odpowiedź pojawi się w
tym samym oknie, również z plikami: obrazy są wyświetlane jako podglądy,
kliknięcie zapisuje plik. Okno nie jest modalne: przeciągnij je za nagłówek,
zmień jego rozmiar od prawego dolnego rogu i kontynuuj pracę, dopóki jest
otwarte. Aplikacja sprawdza odpowiedzi podczas uruchamiania i co minutę; nowa
odpowiedź odtwarza krótki sygnał dźwiękowy (przycisk głośnika w nagłówku okna
wycisza go), miga ikona na pasku zadań, gdy aplikacja działa w tle, pokazuje
czerwoną kropkę na przycisku **Menu** i otwiera okno raz. Po rozpoczęciu rozmowy
ikona koperty obok przycisku **Menu** otwiera ją; zmienia kolor na czerwony i
miga z liczbą nieprzeczytanych odpowiedzi. Naciśnięcie przycisku **×** obok
wiadomości usuwa tę wiadomość, a przycisk kosza w nagłówku okna usuwa całą
rozmowę wraz z załącznikami (również dla programisty; obaj najpierw pytają).
Adres e-mail jest opcjonalny: jeśli go podasz, odpowiedź również zostanie
wysłana e-mailem. Rozmowa jest powiązana z losowym identyfikatorem instalacji
aplikacji, więc nie ma konta ani hasła.

### Projekty, zakładki i pliki startowe

Projekty Ultimate Basic korzystają z plików `.proj` i mogą zawierać wiele plików
źródłowych `.ub`. Panel Projekt wyświetla listę otwartych plików, oznacza
niezapisane karty oraz pokazuje odkryte etykiety, funkcje i podprogramy. Akcje
projektu umożliwiają tworzenie, otwieranie, zapisywanie i zamykanie projektu lub
dodawanie kolejnego pliku źródłowego. Nowy projekt można również uruchomić na
podstawie szablonu UltimateBasic — zobacz [Szablony projektów]{1}.

- **Dodaj plik** — wybierz jeden lub więcej plików naraz (dowolny typ — `.ub`,
  `.bin`, `.prg`, obrazy, czcionki itd.). Pliki źródłowe `.ub` są również
  otwierane jako karty edytora; wszystko inne jest dodawane wyłącznie jako
  odniesienie, aby zasoby `incbin`/`loadfile` mogły być przenoszone wraz z
  projektem.
- **Dodaj folder** — odwołuje się do całego folderu (np. katalogu zasobów
  `incbin`, takiego jak `fonts/`), dzięki czemu pozostaje on powiązany z
  projektem.
- W obszarze roboczym zapisywane są tylko karty oparte na rzeczywistym pliku na
  dysku; karta zawierająca niezapisaną próbkę lub program znajdujący się
  wyłącznie w pamięci nie ma niczego do zapisania i jest pomijana (jeśli żadna z
  otwartych kart nie kwalifikuje się, wyświetlane jest powiadomienie).
- Otwarcie obszaru roboczego powoduje najpierw zamknięcie wszystkich otwartych
  kart — przed kontynuacją zostaniesz poproszony o potwierdzenie.
- Jeśli obszar roboczy odwołuje się do pliku, który został już przeniesiony lub
  usunięty, wpis ten jest pomijany i zgłaszany według nazwy po załadowaniu.
- Otwarte projekty Expert i Ultimate Basic **** są również przechowywane: drzewo
  projektu (wraz z niezapisanymi dodatkami i usunięciami), plik startowy i cel
  zapisu `.proj` wracają wraz z obszarem roboczym. Obszary robocze zapisane
  przez starsze wersje otwierają się bez nich.

### Okno pamięci i użycie zerowej strony

Panel **Pełna pamięć C64** może być odłączany: przycisk **Odłącz** w jego
nagłówku przenosi go do osobnego, niemodalnego okna, które można przeciągać i
zmieniać jego rozmiar podczas edycji (znaczek „nakładanie” jest z nim związany).
**Dokuj** (lub × / Esc) przywraca go z powrotem. Okno zapamiętuje, czy było
odłączone i jaki miało rozmiar.

Gdy program dotyka strony zerowej, na górze mapy pamięci pojawia się sekcja
**Użycie strony zerowej**: siatka 16 × 16 `$00–$FF`, pokolorowana według obszaru
— port procesora (`$00–$01`), wolny (`$02`, `$FB–$FE`), BASIC (`$03–$8F`, `$FF`)
i KERNAL (`$90–$FA`). Używane komórki są wypełniane; ramka oznacza **zapis**,
kreska oznacza **wskaźnik** (`(zp),Y` / `(zp,X)`). Kliknij używaną komórkę, aby
zobaczyć, które wiersze mają do niej dostęp (kliknij wiersz, aby tam przejść) i
ostrzeżenie, gdy zapisujesz do obszaru BASIC lub KERNAL.

Jeśli program zawiera wyeksportowany odtwarzacz SID Editor (etykiety `sid_`),
strona zerowa odtwarzacza (`$02–$1C`, `$2F`, `$FB–$FD`) jest również oznaczona,
a każdy adres używany przez Twój własny kod jest raportowany jako **conflict**
(czerwona ramka, ostrzeżenie w nagłówku).

### Budynek i diagnostyka

Przycisk **Build** otwiera ten sam wyśrodkowany widok postępu, co w innych
przepływach pracy w Visual Assembler. Pomyślne kompilacje aktualizują dane
wyjściowe kompilacji, informacje o kompilacji i deasemblację. Włącz **Verbose**,
aby uwzględnić szczegóły mapy pamięci kompilatora, wewnętrzne alokacje stron
zerowych i wygenerowane dane kodu.

1. Dane wyjściowe kompilacji stają się widoczne automatycznie;
2. błędy kompilatora są wyświetlane na czerwono;
3. wyśrodkowane okno dialogowe kompilacji wyświetla błąd;
4. błędy zawierające wiersz źródłowy wybierz ten wiersz w aktywnym edytorze UB.

| Sekcja            | Wbudowane szablony                                                                                                                                                                                                                                                      |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Asembler**      | Pusty program, pusta gra (tytuł / stany gry / zakończenia gry, joystick, sprite gracza), mapa bitowa Hires, mapa bitowa wielokolorowa, multiplekser sprite'ów (16 sprite'ów sortowanych według Y w każdej klatce, wyświetlanych za pomocą łańcucha przerwań rastrowych) |
| **UltimateBasic** | Pusty program, pusta gra (ta sama maszyna stanowa w UB), mapa bitowa Hires (`linia` / `prostokąt` / `koło` z `kolorowym pisakiem`), przerwanie rastrowe (`pod` wywoływane co każdą klatkę z przerwania rastrowego)                                                      |

Gdy kompilacja się nie powiedzie:

Informacje o kompilacji zawierają raporty dotyczące adresów
ładowania/zakończenia, rozmiarów kodów i PRG, stanu Exomizera, zmiennych,
tablic, funkcji/podprogramów i etykiet.

```asm
; @name Paski rastrowe
; @name.hu Paski rastrowe
; @category Efekty
; @desc Dwa paski rastrowe na obramowaniu.
; @order 50
```

`@name`, `@category` i `@desc` mogą mieć warianty w zależności od języka
(`@name.hu`, `@desc.de`, …); `@order` sortuje listę. Wszystko po nagłówku staje
się nowym plikiem głównym, a `{{PROJECT}}` jest zastępowane nazwą projektu (użyj
jej w komentarzu, aby sam szablon nadal się kompilował).

### Uruchomienie, D64 i Exomizer

Główny przycisk podziału **Uruchom** obsługuje Ultimate Basic w każdym normalnym
miejscu docelowym:

- każde możliwe do skompilowania źródło (`.asm`, blok `.json`, `.ub`) jest
  kompilowane do `.prg` **obok jego źródła** o tej samej nazwie; po włączeniu
  opcji **Uruchom z Exomizerem** dane wyjściowe są kompilowane;
- pliki pomocnicze debugera (symbole/mapa źródłowa) są zapisywane obok PRG,
  jeśli są dostępne;
- moduły pobierane przez inny plik za pomocą plików `.include` / `include` (i
  `.inc`) są pomijane, podobnie jak zakładki, które nigdy nie zostały zapisane;
- raport wyświetla wszystkie pliki wraz z ich rozmiarem, *powodem pominięcia*
  lub błędem kompilatora, a pasek stanu pokazuje *N/M utworzonych plików*.

### Symbole debugera i deasemblacja

Kompilacje żądają informacji debugowania Ultimate Basic i generują trzy zgodne
sidecary:

- `.sym` dla symboli w stylu KickAssembler;
- `.dbg` dla źródła C64Debugger/RetroDebugger i informacji o segmencie;
- `.vs` dla etykiet monitorów VICE.

### Podręcznik i źródło Ultimate Basic

Ikona książki na pasku narzędzi UB otwiera odpowiedni plik Ultimate Basic
`MANUAL.pdf` w trybie offline; przycisk podręcznika w oknie powitalnym startowym
otwiera ten sam podręcznik. Visual Assembler pobiera zarówno kompilator, jak i
plik PDF z przypiętej zależności Git/Cargo, więc środowisko IDE nie utrzymuje
drugiej kopii implementacji Ultimate Basic. Okno dialogowe Informacje i ekran
powitalny wyświetlają aktualną wersję zależności.

- `* = 1500$` → blok ORG
- `Etykieta:` → blok ETYKIETA
- `Etykieta: .bajt 0` → ETYKIETA + bloki BYTE
- `.bajt ...` → blok BYTE
- `; komentarz` (lub wbudowany `; ...`) → blok KOMENTARZA
- instrukcje (`lda`, `jsr`, `beq` itd.) → bloki instrukcji z wykrytym trybem
  adresowania

#### Importuj notatki dotyczące analizy i najlepsze praktyki

- Lokalne etykiety, takie jak `.wait`, są importowane jako standardowe etykiety
  (bez kropki), a odniesienia są odpowiednio normalizowane.
- W przypadku adresowania w stylu `($zp),Y` / `($zp,X)` należy użyć konkretnego
  bajtu strony zerowej (`$FB`, `$FC` itd.) w celu zapewnienia najlepszej
  zgodności.
- Unikaj niejednoznacznych krótkich etykiet wyglądających jak hex (`cc1`,
  `dead`, `beef`) w kontekstach gałęzi; preferuj nazwy takie jak `loop_cc1`.
- Jeżeli program rozpoczyna się od danych (`.byte`) przed kodem wykonywalnym,
  należy na początku dodać jawny skok wejściowy (na przykład `JMP Start`).

### Import ASM (Kick Assembler)

Przycisk **Import ASM** w menu Program pobiera surowy kod źródłowy Kick
Assembler do nowej zakładki w trybie blokowym. Jest on niezależny od przycisku
`Załaduj plik .asm` w trybie Eksperta — jego niestandardowa podpowiedź
informuje, że **obsługiwany jest tylko kod Kick Assembler** (inne asemblery mogą
analizować kod częściowo, ale nie ma gwarancji poprawnego działania).

Obsługiwane wzorce:

- `.pc = $XXXX` dyrektywa origin → blok ORG
- `.const NAZWA = wartość`, `.label NAZWA = wartość` → CONST równa się
- `.macro NAME(p1, p2, ...) { ... }` z korpusem nawiasu klamrowego `{`/`}` lub
  `.endm` → definicja makra użytkownika
- Wywołanie makra `NAZWA(args)`, prefiks dwukropka Kick `:NAZWA(args)` i
  `.invoke NAME(args)` — wszystko odbywa się w obie strony przez formę dwukropka
  Kick
- Etykiety `@local` (`@loop:`, `BEQ @loop`) zachowują prefiks `@` w obecnej
  postaci
- Operand `etykieta + N` / `etykieta - N` (np. `STA mod1+2`, `LDA xp+1`)
- Komentarze liniowe `// ...` i `;` — oba akceptowane, bloki `/* ... */` są
  traktowane jako pojedynczy wiersz komentarza
- Przejście automatycznego startu języka BASIC: gdy program rozpoczyna się od
  `$0801` ze standardowym `SYS 2061` bajtowym szczątkiem (`.byte
  $0B,$08,$0A,$00,$9E,$32,$30,$36,$31,$00,$00,$00`), kompilator emituje PRG
  dosłownie zamiast otaczać go drugim BASIC SYS

Znane ograniczenie:

- Stałe, które odpowiadają adresowi strony zerowej (na przykład `.const BYTEADDR
  = $FC` użyte jako `STA BYTEADDR`), kompilują się obecnie do instrukcji w
  trybie absolutnym (3 bajty) zamiast strony zerowej (2 bajty). Skompilowany kod
  nadal zapisuje dane do prawidłowej lokalizacji w pamięci, ale z niewielkim
  rozmiarem i narzutem cyklu w porównaniu z tym samym kodem źródłowym
  skompilowanym przez Kick Assembler.

## 6. Tryb eksperta

Tryb Eksperta to w pełni funkcjonalny edytor tekstów bezpośrednich 6502,
działający równolegle z edytorem bloków. Każda karta może działać w trybie
blokowym lub eksperckim — można się między nimi swobodnie przełączać w dowolnym
momencie za pomocą przełącznika **Blok/Ekspert** na górnym pasku.

### Przełączanie trybów

Wybierz ikonę **UB** na głównym pasku narzędzi, aby przejść do trybu Ultimate
Basic. Wybrany tryb edytora jest zapamiętywany po ponownym uruchomieniu
aplikacji. Nowe źródło zaczyna się od:

```basic
kolor tła 0
kolor obramowania 0

nadruk „HELLO FROM ULTIMATE BASIC”
```

Tryb UB działa z plikami źródłowymi `.ub`. Funkcje **Nowy**, **Otwórz**,
**Zapisz** i **Zapisz jako** działają na aktywnej karcie UB. Otwarcie pliku
`.ub` automatycznie aktywuje odpowiednią kartę edytora.

Pasek narzędzi pokazuje aktualny folder roboczy UB. Ten folder jest
przechowywany oddzielnie od folderu roboczego Blok/Ekspert. Gdy tryb UB jest
aktywny, polecenie **Plik → Ustaw folder roboczy** wybiera folder UB; jego
podpowiedź identyfikuje aktywny zakres. Okna dialogowe Otwórz/Zapisz UB
rozpoczynają się w tym miejscu, a niezapisane źródła używają go jako bazy dla
względnych ścieżek `include` i `incbin`.

### Układ edytora

Pasek narzędzi UB korzysta z tego samego języka wizualnego i niestandardowych
podpowiedzi, co tryb Eksperta. Zapewnia on:

- podświetlanie składni w oparciu o bieżący podręcznik języka Ultimate Basic;
- numery wierszy, które pozostają zsynchronizowane z długimi plikami;
- sterowanie powiększeniem minimapy i edytora (`Ctrl` + kółko myszy również
  powiększa); kliknij minimapę, aby przeskoczyć lub przeciągnij wybrany obszar
  widoku, aby przewijać go w sposób ciągły;
- Znajdź (`Ctrl+F` / `Cmd+F`) korzystając z paska wyszukiwania w stylu eksperta;
- formatowanie źródła z uwzględnieniem wcięć strukturalnych;
- automatyczne uzupełnianie poleceń i wbudowanych funkcji;
- przeszukiwalny panel **Poleceń** ze składnią, opisem i wskazówkami dotyczącymi
  użytkowania — opisy są zgodne z bieżącym językiem interfejsu użytkownika
  (węgierskim, angielskim, hiszpańskim, niemieckim, holenderskim), a w przypadku
  elementów, które nie zostały jeszcze przetłumaczone, stosuje się język
  angielski;
- niezależnie przełączane panele **Projekt** i **Polecenia**, wyświetlane obok
  siebie, gdy oba są włączone;
- niezależnie przełączane i zmieniane rozmiarowo panele **Wyjście kompilacji** i
  **Demontaż**.

Panel Demontażu zawiera przycisk **Kopiuj**, który kopiuje cały wyświetlany kod
źródłowy do schowka. Pomoc dotycząca poleceń jest zgodna z dołączonym
kompilatorem: na przykład polecenie `identyfikator_klatki_sprite'a, adres_danych
[, klatka]` wybiera obraz animacji z kolejnych 64-bajtowych klatek sprite'a.

Edytor rozumie również składnię w stylu QBasic z Ultimate Basic 1.6.3: `dim name
as type`, `function … end function`, `sub … end sub`, `elseif`, `do … loop
[while | until]`, `while … wend`, `select case`, `exit do` / `exit for` / `exit
while` / `exit sub` / `exit function`, funkcje łańcuchowe `left$` / `right$` /
`mid$` oraz komentarze zaczynające się od `'`, a także `#` lub `rem`. Słowa,
które kompilator traktuje jako słowa kluczowe tylko w jednej pozycji, są tam
kolorowane i pozostają użyteczne jako nazwy: `as` z nazwami typów BASIC (`byte`,
`integer`, `single`, `double`), `case is`, `map view`, `wait key` i opcjami
`scroll` (`row`, `x`, `y`, `lewy`, `prawy`, `wąski`, `szeroki`). **Format**
wcina bloki `funkcja`, `do … loop`, `while … wend` i `elseif` i pozostawia pętle
jednowierszowe (`do while c : … : loop`) bez wcięć, panel Projekt wyświetla
bloki `funkcja` w obszarze Funkcje, a panel Polecenia zawiera bloki **DIM**,
**FUNCTION**, **ELSEIF**, **DO**, Wpisy **WEND**, **SELECT CASE**, **END**,
**EXIT SUB**, **LEFT$**, **RIGHT$** i **MID$**.

Lista poleceń ma celowo ograniczoną wysokość, aby karta szczegółów polecenia
mogła wypełnić pozostałą wysokość panelu. Obszar szczegółów przewija się
niezależnie, umożliwiając dostęp do dłuższych opisów składni.

### Przyciski paska narzędzi

Projekty Ultimate Basic korzystają z plików `.proj` i mogą zawierać wiele plików
źródłowych `.ub`. Panel Projekt wyświetla listę otwartych plików, oznacza
niezapisane karty oraz pokazuje odkryte etykiety, funkcje i podprogramy. Akcje
projektu umożliwiają tworzenie, otwieranie, zapisywanie i zamykanie projektu lub
dodawanie kolejnego pliku źródłowego. Okno dialogowe Kontrola wersji umożliwia
zatwierdzanie, porównywanie i przywracanie wszystkich plików projektu
jednocześnie — patrz [Tryb projektu](#project-mode). Nowy projekt można również
uruchomić z szablonu UltimateBasic — patrz [Szablony
projektów](#project-templates).

Kliknij gwiazdkę obok pliku projektu, aby oznaczyć go jako **plik startowy **.
Polecenia Build, Run, D64, C64 Ultimate i Debug kompilują ten plik startowy,
nawet jeśli aktywna jest inna karta. Bez wyboru pliku startowego używana jest
aktywna karta UB.

Pasek narzędzi panelu projektu zawiera dwa przyciski dodawania, a okna dialogowe
plików domyślnie wskazują folder roboczy **UB** (Menu → Plik → Ustaw folder
roboczy, specyficzne dla UB):

- **Dodaj plik** — wybierz jeden lub więcej plików naraz (dowolny typ — `.ub`,
  `.bin`, `.prg`, obrazy, czcionki itd.). Pliki źródłowe `.ub` są również
  otwierane jako karty edytora; wszystko inne jest dodawane wyłącznie jako
  odniesienie, aby zasoby `incbin`/`loadfile` mogły być przenoszone wraz z
  projektem.
- **Dodaj folder** — odwołuje się do całego folderu (np. katalogu zasobów
  `incbin`, takiego jak `fonts/`), dzięki czemu pozostaje on powiązany z
  projektem.

Foldery w drzewie mają strzałkę zwijania/rozwijania, a kliknięcie prawym
przyciskiem myszy folderu **** pozwala dodać jeden lub więcej plików
zagnieżdżonych pod nim (pokazanych jako wcięte). Każdy wpis ma przycisk usuwania
(✕); wpisy inne niż `.ub` mają charakter wyłącznie referencyjny i nie otwierają
się po kliknięciu.

Przycisk **Zapisz projekt** wyłącza się automatycznie i pokazuje stan
„Zapisano”, gdy w projekcie nie ma żadnych oczekujących zmian, a automatycznie
włącza się ponownie w chwili dodania, usunięcia lub reorganizacji pliku lub
folderu.

### Ekspert edytora minimapy

Minimapa edytora Eksperta to wąski pasek płótna (`88 px`) znajdujący się po
prawej stronie obszaru edytora. Wyświetla on pomniejszoną reprezentację każdej
linii źródłowej:

**półprzezroczysty wskaźnik widoku** (prostokąt z akcentem) pokazuje, która
część źródła jest aktualnie widoczna. Kliknij dowolne miejsce na minimapie, aby
przejść do tej pozycji; przeciągnij, aby przewijać w sposób ciągły. Minimapa
przewija się niezależnie, utrzymując wskaźnik widoku na środku. Stan jest
zapisany w ustawieniach interfejsu użytkownika (klawisz `expertMinimap`).

- Dane wyjściowe kompilacji stają się widoczne automatycznie;
- błędy kompilatora są wyświetlane na czerwono;
- wyśrodkowane okno dialogowe kompilacji wyświetla błąd;
- błędy zawierające wiersz źródłowy wybierz ten wiersz w aktywnym edytorze UB.

Informacje o kompilacji zawierają raporty dotyczące adresów
ładowania/zakończenia, rozmiarów kodów i PRG, stanu Exomizera, zmiennych,
tablic, funkcji/podprogramów i etykiet.

### Rozmiar kodu na linię i wskazówki

Przycisk paska narzędzi **rozmiar kodu** (ikona płomienia) pokazuje po
kompilacji, do ilu bajtów skompilowano każdą linię źródłową – liczba ta znajduje
się w ramce z numerami linii, a pomarańczowy pasek pokazuje jej wagę w stosunku
do linii o największej wartości. Pasek stanu dodaje bajty i szacowaną liczbę
cykli (linia prosta, bez liczenia pętli) linii pod kursorem.

Podczas pisania na pasku stanu pojawia się przycisk **wskazówki**, gdy coś
wygląda nie tak; kliknij go, aby wyświetlić listę, a następnie kliknij
wskazówkę, aby przejść do wiersza:

- `sys $EA31` / `sys $EA81` — `sys` kompiluje się do `JSR`, więc `RTI` KERNALA
  zwraca śmieci; z IRQ należy użyć `irq_exit` lub `asm { JMP $EA31 }`;
- `klawisz oczekiwania` — nie jest to udokumentowana forma, użyj `klawisza
  oczekiwania`;
- `var` / `dim` / `const`, który nigdy nie jest używany;
- po kompilacji: instrukcja bloku `asm` na adresie strony zerowej, który
  przechowuje zmienną Ultimate Basic lub własną stronę zerową środowiska
  wykonawczego.

### Błąd podświetlania

Wiersze, których kompilacja nie powiodła się, są podświetlane na czerwono ****
(przyciemniane tło + lewa ramka akcentująca) w czasie rzeczywistym, 350 ms po
każdym naciśnięciu klawisza. Pierwszy komunikat o błędzie jest również
wyświetlany na pasku stanu. Popraw wiersz, a podświetlenie zniknie
automatycznie.

| Tryb pracy                  | Podstawowe zachowanie Ultimate                                                                                                                                   |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Uruchom jako PRG**        | Skompiluj i uruchom PRG bezpośrednio w programie VICE.                                                                                                           |
| **Uruchom przez D64**       | Skompiluj, otwórz standardowe okno dialogowe pakowania D64, a następnie uruchom dysk w programie VICE.                                                           |
| **Uruchom na Ultimate**     | Prześlij i uruchom PRG poprzez skonfigurowane połączenie C64 Ultimate REST.                                                                                      |
| **Uruchom D64 na sprzęcie** | Spakuj D64 i wyślij do skonfigurowanego C64 Ultimate.                                                                                                            |
| **Kung Fu Flash 2**         | Skompiluj kod źródłowy UB i prześlij plik PRG przez USB na prawdziwy komputer C64/C128 z kartridżem Kung Fu Flash 2. Zobacz [Kung Fu Flash 2](#kung-fu-flash-2). |

Globalna opcja **Ustawienia → Exomizer** dotyczy również kompilacji UB i
normalnych celów uruchomieniowych; nie jest potrzebne osobne przełączanie paska
narzędzi UB. Debuger celowo używa nieskompresowanego pliku PRG, aby adresy i
symbole kompilatora nadal odpowiadały wykonywanemu programowi.

Włącz **Ustawienia → Ustawienia programu → Generuj kod źródłowy UltimateBasic
ASM (.asm)**, aby zapisać wygenerowany przez kompilator zestaw obok pliku PRG
lub kompilacji D64, używając tej samej nazwy pliku bazowego. Jest to opcja
kompilacji, więc pasek narzędzi UB nie zawiera oddzielnych przycisków eksportu
ASM. Polecenie `load "NAME", $address` dostarcza również adres ładowania PRG dla
odpowiedniego pliku dodatkowego D64.

### Podświetlanie składni

Edytor wykorzystuje przezroczystą nakładkę `<div>` (`expert-hl`), która
odzwierciedla zawartość pola tekstowego za pomocą kolorowych elementów `<span>`.
Podświetlanie można wyłączyć przyciskiem **HL**, aby zwiększyć wydajność w
bardzo dużych programach.

- `.sym` dla symboli w stylu KickAssembler;
- `.dbg` dla źródła C64Debugger/RetroDebugger i informacji o segmencie;
- `.vs` dla etykiet monitorów VICE.

Dyrektywy `REGION` / `ENDREGION` są podświetlane tak samo jak inne dyrektywy
asemblera. Zwinięte regiony pozostawiają widoczny w edytorze tylko nagłówek
regionu do momentu ich ponownego otwarcia. Nowy przełącznik **Wybór regionu** na
pasku narzędzi steruje automatycznym podświetlaniem bieżącego regionu tylko w
trybie eksperta; jego wyłączenie sprawia, że źródło jest widoczne bez zmiany
stanu zwinięcia.

### Formater źródła

Kliknij przycisk **Formatuj** (`#expert-format-btn`), aby automatycznie
sformatować bieżące źródło:

Ultimate Basic jest również dostępny jako samodzielny projekt open-source:

<https://github.com/zstarczali/UltimateBasic>

Kompilator jest dołączony do programu Visual Assembler, więc w czasie
wykonywania nie jest wymagany żaden oddzielny plik wykonywalny `ub`.

## 7. Tryby adresowania

Każda instrukcja 6502 obsługuje jeden lub więcej trybów adresowania. Selektor
trybu znajduje się na każdym bloku.

### Oznacz wyrażenia etykietami jako operandy

- **Blok → Ekspert:** bieżący program jest serializowany do tekstu (jedna
  instrukcja w wierszu, etykiety, makra jako dyrektywy). Edycje w trybie
  Eksperta są synchronizowane z tablicą bloków za każdym razem, gdy przełączasz
  się z powrotem lub uruchamiasz akcję.
- **Ekspert → Blok:** tekst jest parsowany za pomocą `parseAsmText()`, a wynik
  zastępuje program blokowy. W przypadku niepowodzenia parsowania wyświetlane
  jest okno dialogowe błędu kompilacji.
- **Puste linie** są zachowywane podczas przesyłania danych w obie strony: puste
  linie w edytorze eksperta pojawiają się jako cienkie przerywane odstępy w
  trybie blokowym i są przywracane jako puste linie po przełączeniu z powrotem
  do edytora eksperta.

### Licznik programu `*` w wyrażeniach

```
┌──────────────────────────────────────────────────┐
│ [pasek narzędzi] Blok │ Ekspert &lt; przełącznik karty │
├─────────────┬─────────────────────────────────────┤
│ Paleta │ Edytor tekstu ASM │ Disasm │
│ (opcja) │ (stały odstęp, edytowalny) │ panel │
│ │ │ (opcja) │
└─────────────┴───────────────────────────────────────┘
```

| Płyta         | Dźwignia kolankowa          | Opis                                                             |
| ------------- | --------------------------- | ---------------------------------------------------------------- |
| **Paleta**    | `#przycisk-palety-eksperta` | Rozgałęzienie do siebie (pętla nieskończona, przesunięcie `$FE`) |
| `*-n` / `*+n` | `BNE *-5`, `BEQ *+4`        | Rozgałęzienie względem bieżącego komputera o *n* bajtów          |
| `SKOCZ *+n`   | `#ekspert-disasm-btn`       | Skok absolutny obliczony na podstawie bieżącego komputera        |

### Etykiety lokalne (kropkowane)

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
| **Oddalanie/przybliżanie**          | `#ekspert-przycisk-oddalania-` / `#ekspert-przycisk-przybliżania-` | Zmniejsz/zwiększ rozmiar czcionki edytora (8–28 pikseli). Naciśnięcie klawiszy `Ctrl` + kółko myszy (`Cmd` + kółko w systemie macOS lub szczypanie na touchpadzie) nad edytorem powoduje ten sam efekt. Ustawienie zostaje zapisane.                                          |
| **Paleta**                          | `#przycisk-palety-eksperta`                                        | Pokaż/ukryj lewą paletę mnemotechniczną                                                                                                                                                                                                                                       |
| **Dyzasm**                          | `#ekspert-disasm-btn`                                              | Pokaż/ukryj panel demontażu (czysty 6502, rozwinięte makra)                                                                                                                                                                                                                   |
| **Monitor**                         | `#przycisk-eksperta-monitora`                                      | Pokaż/ukryj panel zrzutu szesnastkowego monitora                                                                                                                                                                                                                              |
| **Minimapa**                        | `#ekspert-minimapa-przycisk`                                       | Pokaż/ukryj pasek minimapy kodu po prawej stronie edytora                                                                                                                                                                                                                     |

*(Nowość w wersji 2.3.9.)* Etykieta, której nazwa zaczyna się od kropki —
`.loop`, `.skip`, `.done` — jest **lokalną etykietą**. Należy ona do zakresu
najbliższej poprzedzającej ją **globalnej** (bez kropki) etykiety i wewnętrznie
staje się `<global>.<name>`. Dwie lokalne etykiety o tej samej krótkiej nazwie
pod różnymi etykietami globalnymi **nie** kolidują.

### Etykiety operandów kodu samomodyfikującego

*(Nowość w wersji 2.3.9.)* Dodaj prefiks do operandu instrukcji z `label:`, aby
umieścić etykietę na bajcie **operandu**, a nie na kodzie operacji. Instrukcja
jest asemblowana z tego, co następuje po dwukropku.

| Kolor paska           | Typ tokena                                              |
| --------------------- | ------------------------------------------------------- |
| Kolor komentarza      | Linie zaczynające się od `;`                            |
| Kolor etykiety        | Wiersze z etykietą `:definicja `                        |
| Kolor dyrektywny      | `.byte`, `.macro`, `.region` i wszystkie inne dyrektywy |
| Mnemotechniczny kolor | Wszystko inne (instrukcje)                              |

`wartość` wskazuje na `<adres instrukcji> + 1` (pierwszy bajt operandu) dla
każdego trybu adresowania. Zastępuje to starszy wzorzec `instrukcja STA + 1` /
`instrukcja: LDA #$00`. Przechodzi on w obie strony przez tryb Blok ⇄ Ekspert
(pole operandu zachowuje prefiks `etykieta:`).

### Liczenie cykli

Przycisk paska narzędzi **liczniki cykli** (ikona zegara) dodaje pasek, który
pokazuje 6510 cykli każdej linii instrukcji:

| Pokazano         | Oznaczający                                                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `4`              | stały koszt                                                                                                                                     |
| `4+`             | indeksowany odczyt (`abs,X`, `abs,Y`, `(zp),Y`): +1, gdy indeks przekracza stronę; wyrównana do strony baza (`$xx00`) pokazuje dokładną wartość |
| `2/3`            | gałąź: niepodjęta / podjęta                                                                                                                     |
| `2/4` (czerwony) | pobrana gałąź, która przechodzi przez stronę — warto wiedzieć w kodzie czasowym                                                                 |

Zaznacz kilka linii, a pasek stanu pokaże sumę: liczbę instrukcji, minimalną i
maksymalną liczbę cykli oraz liczbę linii rastrowych PAL (63 cykle). Makra i
linie danych nie są liczone. Ustawienie jest zapamiętywane.

### Wskazówki dotyczące optymalizacji

Edytor Ekspert sprawdza złożony kod pod kątem typowych wzorców „peephole”. Linie
z podpowiedzią otrzymują bursztynowy pasek, a na pasku stanu pojawia się
przycisk **N podpowiedzi**. Kliknij go, aby wyświetlić listę, a następnie
kliknij podpowiedź, aby przejść do wiersza. Podpowiedzi nigdy nie zmieniają
kodu:

- `JSR x` a następnie `RTS` → `JMP x` (1 bajt krótszy, 9 cykli szybszy);
- `CMP #0` / `CPX #0` / `CPY #0` zaraz po instrukcji, która już ustawiła N/Z dla
  tego rejestru (uwaga: porównanie ustawia także C);
- ten sam ładunek dwa razy lub ładunek o wartości właśnie zapisanej (`STA x` /
  `LDA x`);
- `LDA m` / `CLC` / `ADC #1` / `STA m` → `INC m` oraz forma `SEC` / `SBC #1` →
  `DEC m`;
- `JMP` lub przejście do następnej instrukcji i `PHA` bezpośrednio po niej
  następuje `PLA`.

Etykieta umieszczona pomiędzy dwiema instrukcjami (możliwy cel skoku) blokuje
wskazówki, które mogłyby je połączyć.

### Błąd podświetlania

Wiersze, których kompilacja nie powiodła się, są podświetlane na czerwono ****
(przyciemniane tło + lewa ramka akcentująca) w czasie rzeczywistym, 350 ms po
każdym naciśnięciu klawisza. Pierwszy komunikat o błędzie jest również
wyświetlany na pasku stanu. Popraw wiersz, a podświetlenie zniknie
automatycznie.

### Podświetlanie składni

Edytor wykorzystuje przezroczystą nakładkę `<div>` (`expert-hl`), która
odzwierciedla zawartość pola tekstowego za pomocą kolorowych elementów `<span>`.
Podświetlanie można wyłączyć przyciskiem **HL**, aby zwiększyć wydajność w
bardzo dużych programach.

| Kolor         | Znak                                                                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Żółto-zielony | Mnemoniki (`LDA`, `STA`, `JMP`, …) i pseudooperacje o długiej gałęzi (`LBNE`, `LBEQ`, …)                                                                     |
| Niebieski     | Dyrektywy (`.byte`, `.word`, `.fill`, `.assert`, `*=`, …)                                                                                                    |
| Pomarańczowy  | Liczby (`$FF`, `%1010`, `255`)                                                                                                                               |
| Cyjan         | Etykiety — wiersze kończące się na `:`, w tym etykiety lokalne (`.loop:`) i etykiety operandów kodu samomodyfikującego się (`wartość:` w `wartość LDA:#$00`) |
| Cyraneczka    | Literały ciągów                                                                                                                                              |
| Fioletowy     | Nazwy niestandardowych makr — nazwa po wywołaniach `.macro`, `.invoke` i `.call` oraz w stylu Kick `:name(...)`                                              |
| Woda          | Parametry makra — nazwy parametrów w nagłówku `.macro` i zamienniki `{param}` w treści makra                                                                 |
| Ciemnozielony | Komentarze (`; …`)                                                                                                                                           |

Dyrektywy `REGION` / `ENDREGION` są podświetlane tak samo jak inne dyrektywy
asemblera. Zwinięte regiony pozostawiają widoczny w edytorze tylko nagłówek
regionu do momentu ich ponownego otwarcia. Nowy przełącznik **Wybór regionu** na
pasku narzędzi steruje automatycznym podświetlaniem bieżącego regionu tylko w
trybie eksperta; jego wyłączenie sprawia, że źródło jest widoczne bez zmiany
stanu zwinięcia.

### Formater źródła

Kliknij przycisk **Formatuj** (`#expert-format-btn`), aby automatycznie
sformatować bieżące źródło:

- Definicje etykiet zostały przeniesione do kolumny 0.
- Instrukcje są wcięte czterema spacjami.
- Mnemoniki pisane są wielkimi literami.
- Dokładnie jedna spacja między mnemonikiem i operandem (dodatkowa spacja jest
  normalizowana).
- Jeśli źródło jest już sformatowane, wyświetlany jest status `„Już
  sformatowano”`.

### Panel projektu i zakładki

Tryb eksperta obsługuje **panel projektu** (`#expert-project-panel`) dla
projektów wieloplikowych `.proj`:

- Plik `.proj` to manifest JSON zawierający listę plików źródłowych i ich
  metadanych.
- Otwórz projekt za pomocą **Menu → Plik → Otwórz projekt ** lub przeciągnij
  plik `.proj` na okno.
- Każdy plik w projekcie otwiera się jako osobna karta **** na pasku kart u góry
  edytora.
- **Zamknij projekt** (`Menu → Plik → Zamknij projekt` / `#menu-close-project`)
  zamyka bieżący projekt i wszystkie jego karty plików jednocześnie. Wyświetla
  monit o zapisanie niezapisanych zmian przed zamknięciem. Panel projektu
  resetuje się do stanu pustego, a `_expertProjectData` zostaje wyczyszczony.
- Każdy plik można oznaczyć jako **plik startowy** (ikona gwiazdki ★). Po
  ustawieniu pliku startowego przycisk **Uruchom** (PRG, D64, Ultimate) zawsze
  asembluje i uruchamia kod tego pliku — niezależnie od tego, która karta jest
  aktualnie aktywna. Działa to zarówno w trybie blokowym, jak i eksperckim.
- Przycisk **Dodaj** na pasku narzędzi wybiera jeden lub więcej plików naraz
  (dowolnego typu, nie tylko `.json`/`.asm`) i odwołuje się do nich w projekcie
  bez ich otwierania — należy go używać w przypadku zasobów binarnych, takich
  jak dane `incbin`. Domyślnie w oknie dialogowym znajduje się folder roboczy
  VA. Sąsiedni przycisk **Dodaj folder** odwołuje się do całego folderu (np.
  katalogu zasobów) w ten sam sposób. Wpisy zawierające tylko odniesienia są
  oznaczone przyciskiem usuwania (✕), ale nie są otwierane kliknięciem.
- Foldery w drzewie mają strzałkę zwijania/rozwijania, a kliknięcie prawym
  przyciskiem myszy folderu **** umożliwia dodanie jednego lub więcej plików
  zagnieżdżonych pod nim (pokazanych jako wcięte).
- Przycisk **Zapisz projekt** wyłącza się automatycznie i pokazuje stan
  „Zapisano”, gdy w projekcie nie ma żadnych oczekujących zmian, a automatycznie
  włącza się ponownie w chwili dodania, usunięcia lub reorganizacji pliku lub
  folderu.
- Sekcję **symboli** znajdującą się na dole panelu projektu można zmieniać w
  pionie za pomocą separatora między drzewem plików a listą symboli, dzięki
  czemu długie listy symboli mogą zajmować więcej miejsca, gdy jest to
  potrzebne.
- **Kontrola wersji** działa dla całego projektu: dzięki przełącznikowi
  **Projekt** w oknie dialogowym Kontrola wersji, każdy plik projektu jest
  rejestrowany jednym zatwierdzeniem, a funkcja Checkout przywraca je wszystkie
  do zakładek. Zobacz [Tryb projektu](#project-mode).

### Pasek kart

Pasek kart pojawia się nad edytorem, jeśli otwarta jest więcej niż jedna karta.

| Funkcja                          | Opis                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Brudna kropka**                | Mała kropka w kolorze akcentującym na nazwie zakładki wskazuje niezapisane zmiany                                                                                                                                                                                                                                                                                                                                           |
| **Strzałki przewijania**         | Przyciski przewijania w lewo/w prawo pojawiają się, gdy liczba kart przekracza liczbę mieszczącą się na pasku                                                                                                                                                                                                                                                                                                               |
| **Zamknij (×)**                  | Zamyka kartę; wyświetla monit o zapisanie, jeśli karta jest brudna                                                                                                                                                                                                                                                                                                                                                          |
| **Rozszerzenie pliku**           | Wyświetlana jest pełna nazwa pliku, łącznie z rozszerzeniem (`.c64va`, `.json`)                                                                                                                                                                                                                                                                                                                                             |
| **Menu prawego przycisku myszy** | Kliknij prawym przyciskiem myszy kartę (lub puste miejsce na pasku kart), aby wykonać następujące czynności: **Nowa karta**, **Zamknij kartę**, **Zamknij inne karty**, **Zamknij karty po prawej stronie**, **Zamknij wszystkie karty**. Operacje zamykania zbiorczego wyświetlają monit o zamknięcie każdej niezapisanej karty i zatrzymują się po anulowaniu. **Zamknij wszystkie** zawsze pozostawia jedną pustą kartę. |

> **Wskazówka: ** Synchronizacja palet (`#expert-palette-sync-btn`)
> synchronizuje wybór palety z mnemonikiem przy kursorze. Wyłącz tę funkcję,
> jeśli nie chcesz, aby paleta przeskakiwała podczas edycji.

---

## 8. Standardowe instrukcje 6502

Każda instrukcja 6502 obsługuje jeden lub więcej trybów adresowania. Selektor
trybu znajduje się na każdym bloku.

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

### Przenoszenie danych

Każde pole operandu akceptujące adres lub wartość bezpośrednią akceptuje również
bezpośrednio **nazwę stałej** (z bloku `CONST` lub `LABEL`). Dodatkowo można
użyć wyrażeń **etykieta+przesunięcie** lub **etykieta−przesunięcie**, aby
odwołać się do adresu względnego do nazwanej stałej:

| Składnia | Przykład            | Opis                                                                                                                             |
| -------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `LDA`    | Załaduj akumulator  | natychmiastowy, zeroPage, absolutny, absolutnyX, absolutnyY, pośredniX, pośredniY                                                |
| `LDX`    | Załaduj rejestr X   | natychmiastowy, zeroPage, zeroPageY, absolutny, absolutnyY                                                                       |
| `LDY`    | Załaduj rejestr Y   | natychmiastowy, zeroPage, absolutny, absoluteX                                                                                   |
| `STA`    | Akumulator sklepowy | zeroPage, absolutny, absolutnyX, absolutnyY, pośredniX, pośredniY                                                                |
| `STX`    | Sklep X rejestr     | zeroPage, zeroPageY, absolutny                                                                                                   |
| `STY`    | Sklep Y kasa        | zeroPage, absolutny                                                                                                              |
| `*`      | `BNE *`             | Aktualny licznik programu (adres własny instrukcji); rozgałęzienia z `*` generują nieskończoną pętlę własną (przesunięcie `$FE`) |

**Przykład — wyczyść dwie strony ekranowe za pomocą stałej:**
```
; .CONST screen_ram = $0400
LDX #$00
wyczyść:
STA screen_ram,X
STA screen_ram+$0100,X
DEX
BNE wyczyść
```

### Arytmetyka

*(Nowość w wersji 2.3.9.)* `*` nie jest już ograniczony do całego operandu —
może pojawić się **w dowolnym miejscu wyrażenia operandu** i oznacza adres
instrukcji, w której jest zapisany. Jest on rozwiązywany w momencie asemblacji
na podstawie rzeczywistego adresu tej instrukcji, więc etykieta nie jest
potrzebna w przypadku krótkich skoków względnych lub odczytów danych względnych
względem PC.

| Składnia | Przykład                     | Oznaczający                                                |
| -------- | ---------------------------- | ---------------------------------------------------------- |
| `*`      | `BNE *`                      | W większości przypadków przed użyciem należy ustawić `SEC` |
| `SBC`    | Odejmowanie z przeniesieniem | Ustaw przeniesienie z `SEC` przed odjęciem                 |
| `INK`    | Zwiększ pamięć               | —                                                          |
| `GRU`    | Zmniejsz pamięć              | —                                                          |
| `CMP`    | Porównaj z A                 | Ustawia flagi; nie modyfikuje A                            |

**PC kontra mnożenie. ** `*` jest traktowany jako licznik programu tylko wtedy,
gdy znajduje się w *pozycji wartości* — na początku wyrażenia lub zaraz po
operatorze, `(`, `,`, `&lt;`, `&gt;` lub spacji. Operator `*` następujący po
liczbie, `)` lub identyfikatorze jest zwykłym mnożeniem, więc `tabela LDA*2` i
`CONST_A*4` pozostają niezmienione.

**Gdzie to działa.** Dowolny operand, który akceptuje już wyrażenie: cele
rozgałęzień, `JMP` / `JSR`, `LDA`/`STA`/… bezwzględne i indeksowane,
natychmiastowe operatory bajtów niskiego/wysokiego oraz wyrażenie `.assert`. `*`
nigdy nie zmienia rozmiaru instrukcji, więc jest bezpieczny w każdym trybie
adresowania.

### Logika

*(Nowość w wersji 2.3.9.)* Etykieta, której nazwa zaczyna się od kropki —
`.loop`, `.skip`, `.done` — jest **lokalną etykietą**. Należy ona do zakresu
najbliższej poprzedzającej ją **globalnej** (bez kropki) etykiety i wewnętrznie
staje się `<global>.<name>`. Dwie lokalne etykiety o tej samej krótkiej nazwie
pod różnymi etykietami globalnymi **nie** kolidują.

```
DrawSprite:
LDX #0
.loop: ; == DrawSprite.loop
LDA SpriteData,X
STA $2000,X
INX
CPX #63
BNE .loop ; rozwiązuje się w DrawSprite
RTS

ClearScreen:
LDX #0
.loop: ; == ClearScreen.loop — brak kolizji
STA $0400,X
INX
BNE .loop
RTS
```

- W zakresie odwołaj się do lokalnej etykiety jako `.nazwa`.
- Z innego zakresu odwołaj się do niego jawnie jako `Global.name` (np. `JMP
  ClearScreen.loop`).
- `.name` zapisane przed jakąkolwiek etykietą globalną pozostaje zwykłym `.name`
  najwyższego poziomu.
- Lokalne etykiety przechodzą przez tryb Blok ⇄ Ekspert bez zmian; prefiks
  `<global>.` jest szczegółem układu i nigdy nie jest przechowywany w programie
  blokowym.

### Skoki i gałęzie

*(Nowość w wersji 2.3.9.)* Dodaj prefiks do operandu instrukcji z `label:`, aby
umieścić etykietę na bajcie **operandu**, a nie na kodzie operacji. Instrukcja
jest asemblowana z tego, co następuje po dwukropku.

```
konfiguracja:
Wartość LDA: #$00 ; 'wartość' -&gt; adres bajtu operandu #$00
...
poprawka:
LDA #new
Wartość STA ; zapisuje bajt operandu bezpośrednio — klasyczny SMC
```

`wartość` wskazuje na `<adres instrukcji> + 1` (pierwszy bajt operandu) dla
każdego trybu adresowania. Zastępuje to starszy wzorzec `instrukcja STA + 1` /
`instrukcja: LDA #$00`. Przechodzi on w obie strony przez tryb Blok ⇄ Ekspert
(pole operandu zachowuje prefiks `etykieta:`).

---

## 9. Bloki makro — odniesienie

### LABEL

| Mnemoniczny    | Opis                                             | Tryby                                                                             |
| -------------- | ------------------------------------------------ | --------------------------------------------------------------------------------- |
| Nazwa etykiety | Identyfikator używany w `JMP`, `JSR`, `BNE` itd. | natychmiastowy, zeroPage, absolutny, absolutnyX, absolutnyY, pośredniX, pośredniY |
| `LDX`          | Załaduj rejestr X                                | natychmiastowy, zeroPage, zeroPageY, absolutny, absolutnyY                        |
| `LDY`          | Załaduj rejestr Y                                | natychmiastowy, zeroPage, absolutny, absoluteX                                    |
| `STA`          | Akumulator sklepowy                              | zeroPage, absolutny, absolutnyX, absolutnyY, pośredniX, pośredniY                 |
| `STX`          | Sklep X rejestr                                  | zeroPage, zeroPageY, absolutny                                                    |
| `STY`          | Sklep Y kasa                                     | zeroPage, absolutny                                                               |

### COMMENT

| Mnemoniczny | Opis                         | Notatki                                                    |
| ----------- | ---------------------------- | ---------------------------------------------------------- |
| `ADC`       | Dodaj z przeniesieniem       | W większości przypadków przed użyciem należy ustawić `SEC` |
| `SBC`       | Odejmowanie z przeniesieniem | Ustaw przeniesienie z `SEC` przed odjęciem                 |
| `INK`       | Zwiększ pamięć               | —                                                          |
| `GRU`       | Zmniejsz pamięć              | —                                                          |
| `CMP`       | Porównaj z A                 | Ustawia flagi; nie modyfikuje A                            |
| `CPX`       | Porównaj z X                 | —                                                          |
| `CPY`       | Porównaj z Y                 | —                                                          |

### BYTE

| Mnemoniczny | Opis                                                                          |
| ----------- | ----------------------------------------------------------------------------- |
| Operand     | Wartości bajtów rozdzielone przecinkami (np. `$01, $02, $FF` lub `1, 2, 255`) |
| `ORA`       | Logiczne OR z akumulatorem                                                    |
| `EOR`       | Ekskluzywny OR z akumulatorem                                                 |
| `BIT`       | Testowanie bitów w pamięci względem A (ustawianie flag N, V, Z)               |

### WORD

| Mnemoniczny | Opis                                                            |
| ----------- | --------------------------------------------------------------- |
| Operand     | Wartości 16-bitowe rozdzielone przecinkami (np. `$0400, $C000`) |
| `JSR`       | Skok do podprogramu (zapisuje adres powrotu na stosie)          |
| `RTS`       | Powrót z podprogramu                                            |
| `RTI`       | Powrót z przerwania                                             |
| `BNE`       | Rozgałęzienie, jeśli nie jest równe (Z=0)                       |
| `BEQ`       | Gałąź, jeśli równe (Z=1)                                        |
| `UDW`       | Rozgałęzienie, jeśli Carry Clear (C=0)                          |
| `BCS`       | Rozgałęzienie, jeśli zestaw Carry (C=1)                         |
| `BMI`       | Gałąź jeśli minus (N=1)                                         |
| `BPL`       | Rozgałęzienie jeśli Plus (N=0)                                  |
| `BVC`       | Gałąź, jeśli wyczyszczono przepełnienie (V=0)                   |
| `BVS`       | Gałąź, jeśli przepełnienie ustawione (V=1)                      |

#### LBNE / LBEQ / … (Długie gałęzie)

*(Nowość w wersji 2.3.9.)* Kategoria palety **Długie gałęzie** zawiera osiem
pseudooperacji, które zachowują się jak gałęzie warunkowe, ale docierają do
**dowolnego adresu**, a nie tylko −128…+127. Każda z nich składa się do
odwróconej gałęzi, która pomija 3-bajtowy `JMP` — zawsze **5 bajtów**:

```
LBEQ gotowe; montaż do: BNE *+3 ($D0 $03)
; JMP gotowe ($4C lo hi)
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

- Operand: etykieta, wyrażenie `*` lub adres literowy — taki sam jak normalny
  cel rozgałęzienia.
- Koszt: 5 bajtów i 1 dodatkowy cykl na wybranej ścieżce w porównaniu z krótką
  gałęzią. Nie ma automatycznej promocji krótkiej gałęzi — wybierasz jawnie
  `LBxx`.
- Gdy prosta gałąź (`BNE`, `BEQ`, …) wykracza poza zakres, błąd kompilatora
  teraz nazywa dokładne przekroczenie i sugeruje pasującą `LBxx`.

### FILL

| Mnemoniczny | Opis                                                     |
| ----------- | -------------------------------------------------------- |
| Operand     | `liczba,wartość` — np. `256,0` wypełnia 256 bajtów zerem |
| `TAY`       | Przelew A → Y                                            |
| `TXA`       | Przenieś X → A                                           |
| `TYA`       | Przenieś Y → A                                           |
| `TSX`       | Wskaźnik stosu transferu → X                             |
| `TXS`       | Przenieś X → Wskaźnik stosu                              |
| `INX`       | Zwiększ X                                                |
| `ZRĘCZNOŚĆ` | Zmniejsz X                                               |
| `INY`       | Zwiększ Y                                                |
| `DEY`       | Zmniejszenie Y                                           |

### ALIGN

| Mnemoniczny | Opis                                                                                    |
| ----------- | --------------------------------------------------------------------------------------- |
| Granica     | Wartość wyrównania — np. `64` (granica sprite’a), `256` (strona), `$2000` (mapa bitowa) |
| `LSR`       | Logiczne przesunięcie w prawo                                                           |
| `ROL`       | Obrót w lewo przez Carry                                                                |
| `ROR`       | Obróć w prawo przez Carry                                                               |

### TEXT

| Mnemoniczny            | Opis                                                     |
| ---------------------- | -------------------------------------------------------- |
| Tekst                  | Ciąg do wyświetlenia                                     |
| X                      | Kolumna (0–39)                                           |
| Y                      | Wiersz (0–24)                                            |
| Etykieta (opcjonalnie) | Przypisuje etykietę wskazującą na obliczony adres ekranu |

### STRING

| Mnemoniczny                | Opis                                                                                            |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| Tekst                      | Ciąg do napisania                                                                               |
| Adres                      | Adres pamięci docelowej — `$C000` hex lub **nazwa etykiety**                                    |
| Etykieta (opcjonalnie)     | Przypisuje etykietę wskazującą na adres docelowy                                                |
| Zmiana                     | Wartość szesnastkowa (00–FF) dodawana do każdego bajtu kodu ekranu (np. `$80` = odwrotne wideo) |
| Zestaw znaków małych liter | Pole wyboru — ta sama semantyka co w przypadku TEKST (patrz sekcja TEKST)                       |
| `SED`                      | Ustaw tryb dziesiętny                                                                           |
| `SEI`                      | Ustaw wyłączenie przerwania                                                                     |
| `NIE`                      | Brak operacji                                                                                   |
| `BRK`                      | Wymuś przerwę / przerwanie programowe                                                           |

### DATA

Podobnie jak pętla **POKE** — zapisuje listę surowych bajtów do adresu pamięci w
czasie wykonywania, jedną parę LDA/STA na bajt.

**Składnia ekspercka:**

---

## 10. Integracja debugera

Aplikacja obsługuje **RetroDebugger** jako zewnętrzny debugger C64. Otrzymuje
punkty przerwania, symbole i flagi autostartu generowane z asemblowanego
programu.

---

### RetroDebugger

[RetroDebugger]{1} to wieloplatformowy debugger Commodore 64 z obsługą punktów
przerwania, inspekcją pamięci i deasemblacją uwzględniającą etykiety.

| Pole           | Opis                                             |
| -------------- | ------------------------------------------------ |
| Nazwa etykiety | Identyfikator używany w `JMP`, `JSR`, `BNE` itd. |

**Składnia ekspercka:**
```
pętla:
```

**Wygenerowano ASM:**
```
pętla: ; $0820
```

Aktualny adres jest wyświetlany jako komentarz. Etykiety mają rozmiar **0
bajtów**.

---

### Bloki punktów przerwania

Kliknij ikonę punktu przerwania (●) w dowolnym bloku instrukcji, aby przełączyć
go na punkt przerwania. Bloki z punktami przerwania są podświetlone na czerwono.
Ich adresy są zapisywane w pliku punktów przerwania przy każdym uruchomieniu
debugera.

**Składnia ekspercka:**
```
; Tutaj wpisz tekst swojego komentarza
```

**Wygenerowano ASM:**
```
; Tutaj wpisz tekst swojego komentarza
```

---

### Flagi debugera (zakładka Opcje)

Podobnie jak **DATA w BASIC** — przechowuje listę surowych wartości bajtów w
tekście programu.

| Pole    | Opis         |
| ------- | ------------ |
| Operand | `-jmp $ADDR` |

**Składnia ekspercka:**
```
.bajt $01, $02, $FF
```

**Wygenerowano ASM:**
```
.bajt $01, $02, $FF
```

**Odwołania do etykiet bajtów niskich/wysokich: ** BYTE akceptuje tokeny
`<label` (młodszy bajt) i `>label` (starszy bajt) w stylu KickAssembler/ca65
wraz z wartościami numerycznymi. Asembler rozwiązuje adres etykiety w czasie
kompilacji i wstawia odpowiedni bajt. Przykład:

```
.bajt <ramka_0, >ramka_0, <ramka_1, >ramka_1
```

Przechowuje najpierw bajt młodszy adresu ramki `frame_0`, następnie bajt
starszy, a potem to samo dla ramki `frame_1`. Przydatne przy tworzeniu tablic
skoków i list adresowych.

**Rozmiar:** Liczba bajtów na liście.

---

### SŁOWO

Podobnie jak **DATA w BASIC-u, ale dla liczb 16-bitowych **. Każda wartość jest
przechowywana jako dwa bajty (najpierw bajt młodszy, potem bajt starszy —
kolejność little-endian 6502).

| Pole    | Opis                                                            |
| ------- | --------------------------------------------------------------- |
| Operand | Wartości 16-bitowe rozdzielone przecinkami (np. `$0400, $C000`) |

**Składnia ekspercka:**
```
.słowo $0400, $C000
```

**Wygenerowano ASM:**
```
.słowo $0400, $C000
```

**Rozmiar:** 2 bajty na słowo.

---

### WYPEŁNIĆ

Podobnie jak `FOR I=1 TO N : POKE addr+I, val : NEXT` — wypełnia blok pamięci
tym samym bajtem, ale w jednym bloku. Świetnie nadaje się do czyszczenia
obszarów lub wstępnego wypełniania tabel.

| Pole    | Opis                                                     |
| ------- | -------------------------------------------------------- |
| Operand | `liczba,wartość` — np. `256,0` wypełnia 256 bajtów zerem |

**Składnia ekspercka:**
```
.fill 256, 00 zł
```

**Wygenerowano ASM:**
```
.fill 256, 00 zł
```

**Składnia wyrażenia: ** Zarówno `liczba`, jak i `wartość` akceptują wyrażenia
arytmetyczne. Można odwoływać się do nazw stałych, używać literałów
szesnastkowych/binarnych i wywoływać wbudowane funkcje matematyczne:

| Wyrażenie                     | Oznaczający                                      |
| ----------------------------- | ------------------------------------------------ |
| `LICZBA_KAFELEK, $00`         | liczenie z CONST, literał wartości szesnastkowej |
| `40*25, 0`                    | mnożenie liniowe                                 |
| `okrągły(sin(PI/4)*255), 80$` | trygonometria                                    |

**Funkcje wbudowane: ** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, constant `PI`

Operatorzy: `+ - * /` Literały: `$FF` (szesnastkowy), `%10110000` (binarny) Bajt
młodszy/starszy: `lo(wyrażenie)`, `hi(wyrażenie)`

**Rozmiar:** Wartość liczbowa w bajtach.

---

### WYRÓWNYWAĆ

Przesuwa bieżący adres do przodu do następnej czystej granicy, wstawiając bajty
uzupełniające zerami. C64 wymaga, aby dane sprite'a zaczynały się od granicy 64
bajtów — `ALIGN 64` obsługuje to automatycznie.

| Pole    | Opis                                                                                    |
| ------- | --------------------------------------------------------------------------------------- |
| Granica | Wartość wyrównania — np. `64` (granica sprite’a), `256` (strona), `$2000` (mapa bitowa) |

**Składnia ekspercka:**
```
.align 64
.align 2000 dolarów
```

**Wygenerowano ASM:**
```
; ALIGN 64 → $0840 (12 bajtów wypełnienia)
```

**Rozmiar:** Dynamiczny — zależy od aktualnej pozycji licznika programu.

> **Wskazówka: ** Użyj `ALIGN 64` przed danymi sprite, `ALIGN 256` aby zapewnić
> wyrównanie tabel do stron.

---

### TEKST

Podobnie jak **PRINT AT** — zapisuje tekst bezpośrednio na ekranie C64 w podanej
kolumnie i wierszu, bez użycia KERNAL-a. Generuje jedną parę LDA/STA na znak,
wykorzystując pamięć RAM ekranu pod adresem `$0400`.

| Pole                       | Opis                                                     |
| -------------------------- | -------------------------------------------------------- |
| Tekst                      | Ciąg do wyświetlenia                                     |
| X                          | Kolumna (0–39)                                           |
| Y                          | Wiersz (0–24)                                            |
| Etykieta (opcjonalnie)     | Przypisuje etykietę wskazującą na obliczony adres ekranu |
| Zestaw znaków małych liter | Pole wyboru — patrz poniżej                              |

**Tryby zestawów znaków:**

W systemie C64 możliwe jest wybranie w czasie działania programu dwóch zestawów
znaków:

| Tryb                                       | $D018 bit 1 | Wprowadzanie wielkich liter        | Wprowadzanie małych liter              |
| ------------------------------------------ | ----------- | ---------------------------------- | -------------------------------------- |
| **Wielkie litery/grafika** (domyślne)      | 0           | `A`–`Z` → kody ekranowe $01–$1A ✓  | traktowane również jako wielkie litery |
| **Małe/wielkie litery** (po CHARSET small) | 1           | `A`–`Z` → $01–$1A (wielkie litery) | `a`–`z` → $41–$5A (małe litery) ✓      |

- **Zestaw znaków wielkich liter (domyślny, pole wyboru niezaznaczone): **
  Wpisz, co chcesz zobaczyć wielkimi literami. `„CZEŚĆ”` wyświetla się jako
  `CZEŚĆ`. Wprowadzanie małymi literami jest mapowane na wielkie litery w kodach
  ekranowych.
- **Zestaw znaków małych liter (pole wyboru zaznaczone): ** Wpisz dokładnie taką
  wielkość liter, jaką chcesz zobaczyć. `„hello”` → wyświetlanie małych liter,
  `„HELLO”` → wyświetlanie wielkich liter. Wymaga przełączenia zestawu znaków w
  czasie wykonywania przed zapisaniem zawartości ekranu (użyj makra **CHARSET
  lower**).

**Wygenerowany ASM (tryb wielkich liter, `"HELLO"`):**
```
LDA #$08; kod ekranu „H” $08
STA $0400
LDA #$05; kod ekranu „E” $05
STA $0401
...
```

**Składnia ekspercka:**
```
.text 0, 2, „HELLO”; zestaw znaków wielkich liter (domyślny)
.text 0, 2, „hello”, lower; zestaw znaków małych liter
```

Znaki są kodowane jako **kody ekranowe** (nie PETSCII). **Rozmiar: ** `długość
tekstu × 5` bajtów (LDA + STA na znak).

---

### SMYCZKOWY

Podobnie jak **Wprowadzanie ciągu ** do dowolnego adresu pamięci w czasie
wykonywania. Generuje pary LDA/STA, które kopiują kod ekranu każdego znaku do
kolejnych adresów.

| Pole                       | Opis                                                                                            |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| Tekst                      | Ciąg do napisania                                                                               |
| Adres                      | Adres pamięci docelowej — `$C000` hex lub **nazwa etykiety**                                    |
| Etykieta (opcjonalnie)     | Przypisuje etykietę wskazującą na adres docelowy                                                |
| Zmiana                     | Wartość szesnastkowa (00–FF) dodawana do każdego bajtu kodu ekranu (np. `$80` = odwrotne wideo) |
| Zestaw znaków małych liter | Pole wyboru — ta sama semantyka co w przypadku TEKST (patrz sekcja TEKST)                       |

**Składnia ekspercka:**
```
.string $C000, "HELLO" ; zestaw znaków wielkich liter (domyślny)
.string $C000, "hello", lower ; zestaw znaków małych liter
.string $C000, "HELLO", 80 ; z shiftem (odwrócenie obrazu)
.string $C000, "hello", 80, lower ; shift + małe litery
.string $C000, "HELLO" :my_string ; z macroLabel
```

**Wygenerowano ASM:**
```
LDA #$08; kod ekranu „H”
STA $C000
LDA #$05; kod ekranu „E”
STA $C001
...
```

Znaki są kodowane jako **kody ekranowe** (nie PETSCII). Do każdego bajtu
dodawana jest opcjonalna wartość **Shift**, np. `$80` dla odwróconego obrazu.
**Rozmiar:** `długość tekstu × 5` bajtów (jeden LDA + jeden STA na znak).

---

### DANE

Podobnie jak pętla **POKE** — zapisuje listę surowych bajtów do adresu pamięci w
czasie wykonywania, jedną parę LDA/STA na bajt.

| Pole                   | Opis                                                         |
| ---------------------- | ------------------------------------------------------------ |
| Bajty                  | Wartości bajtów rozdzielone przecinkami                      |
| Adres                  | Adres pamięci docelowej — `$C000` hex lub **nazwa etykiety** |
| Etykieta (opcjonalnie) | Przypisuje etykietę wskazującą na adres docelowy             |

**Składnia ekspercka:**
```
.data $C000, $01, $02, $03; adres szesnastkowy
.data my_buf, $01, $02, $03; adres etykiety
.data $C000, $01, $02, $03 :mydata; z makroLabel
```

**Wygenerowano ASM:**
```
LDA #01 USD
    STA $000
    LDA nr 02
    STA$C001
    ...
```

**Rozmiar:** `liczba bajtów × 5` bajtów (jeden LDA + jeden STA na bajt).

---

### RAWBYTES

Podobnie jak **DATA, które ładuje się bezpośrednio do pamięci** — bez żadnego
kodu wykonawczego. Bajty są obecne od momentu załadowania PRG, jeszcze przed
uruchomieniem kodu. Używaj tego do danych sprite'ów, map poziomów, tabel
wyszukiwania i wszystkiego, co musi znajdować się pod określonym adresem.

| Pole                   | Opis                                                         |
| ---------------------- | ------------------------------------------------------------ |
| Bajty                  | Wartości bajtów rozdzielone przecinkami                      |
| Adres                  | Adres pamięci docelowej — `$C000` hex lub **nazwa etykiety** |
| Etykieta (opcjonalnie) | Przypisuje etykietę wskazującą na adres docelowy             |

**Składnia ekspercka:**
```
.rawbytes $C000, $00, $00, $00; adres szesnastkowy
.rawbytes sprite_data, $00, $00; adres etykiety
.rawbytes $0C50, $00, $00 :nev; z makroLabel — inny kod może używać LDA nev,X
```

**Rozmiar w kodzie: ** 0 bajtów. Dane są umieszczane pod podanym adresem na
wyjściu.

> **DATA kontra RAWBYTES:** DATA generuje kod LDA/STA, który kopiuje bajty w
> czasie wykonywania (wolniej, ale działa, jeśli dane muszą być dynamiczne).
> RAWBYTES po prostu umieszcza bajty bezpośrednio — bez kodu, natychmiast, bez
> kosztów.

---

### RAWTEXT

Podobnie jak RAWBYTES, ale dla tekstu — koduje ciąg jako kody ekranowe i
umieszcza bajty pod stałym adresem bez kodu wykonawczego ****. Tekst jest gotowy
w pamięci w momencie załadowania PRG.

| Pole                       | Opis                                                                                            |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| Tekst                      | Ciąg do zakodowania                                                                             |
| Adres                      | Adres pamięci docelowej — `$C000` hex lub **nazwa etykiety**                                    |
| Etykieta (opcjonalnie)     | Przypisuje etykietę wskazującą na adres docelowy                                                |
| Zmiana                     | Wartość szesnastkowa (00–FF) dodawana do każdego bajtu kodu ekranu (np. `$80` = odwrotne wideo) |
| Zestaw znaków małych liter | Pole wyboru — ta sama semantyka co w przypadku TEKST (patrz sekcja TEKST)                       |

**Składnia ekspercka:**
```
.rawtext $C000, "HELLO" ; zestaw znaków wielkich liter (domyślny)
.rawtext $C000, "hello", lower ; zestaw znaków małych liter
.rawtext $C000, "HELLO", 80 ; z przesunięciem (odwrócenie obrazu)
.rawtext $C000, "hello", 80, lower ; przesunięcie + małe litery
.rawtext $0400, "HELLO" :my_text ; z makroLabelą
```

**Wygenerowano ASM:**
```
; .rawtext "HELLO" -&gt; $C000
; $C000
.byte $08, $05, $0C, $0C, $0F ; H E L L O (kody ekranowe pisane wielkimi literami)

; .rawtext "hello", pisane małymi literami -&gt; $C000
; $C000
.byte $48, $45, $4C, $4C, $4F ; h e l l o (kody ekranowe pisane małymi literami z zakresu $41–$5A)
```

**Rozmiar w kodzie: ** 0 bajtów. Dane są umieszczane pod podanym adresem na
wyjściu.

> **STRING kontra RAWTEXT: ** STRING generuje kod LDA/STA, który kopiuje tekst w
> czasie wykonywania. RAWTEXT wczytuje bajty do PRG w momencie ładowania — bez
> kodu i czekania.

---

### PETSCII

Podobnie jak **RAWBYTES, ale dla wyjścia KERNAL ** — koduje ciąg jako bajty
PETSCII (zgodne z CHROUT w `$FFD2`) i umieszcza je pod stałym adresem bez kodu
wykonawczego. Użyj tego, gdy chcesz wydrukować znaki za pomocą `JSR $FFD2` w
pętli, i zwróć uwagę, że nowe makro `PRINT` używa tego samego kodera i
zachowania pola wyboru dla małych liter.

> **PETSCII a kody ekranowe: ** PETSCII i kody ekranowe to dwa różne kodowania.
> Kod ekranowy `$01` = litera A; PETSCII `$41` = litera A (przez CHROUT). Używaj
> PETSCII tylko podczas drukowania przez KERNAL; do zapisu bezpośrednio do
> pamięci RAM ekranu używaj TEXT/STRING/RAWTEXT.

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
.petscii $C000, "HELLO"; PETSCII z wielką literą (domyślnie)
.petscii $C000, "hello", lower; PETSCII z małą literą ($61–$7A)
.petscii $C000, "HELLO", null; z terminatorem null
.petscii $C000, "hello", lower, null; z terminatorem null
.petscii $C000, "HELLO" :my_msg; z makroLabelą
```

**Wygenerowane bajty (wielkie litery, `"CZEŚĆ"`):**
```
; $C000
.byte $48, $45, $4C, $4C, $4F ; H E L L O (zakres PETSCII $41–$5A)
```

**Rozmiar w kodzie: ** 0 bajtów. Dane są umieszczane pod adresem docelowym jako
odroczona sekcja danych (jak RAWBYTES).

**Terminator zerowy:** Zaznacz pole wyboru *„Dołącz `$00` (terminator zerowy)”*,
aby automatycznie dodać bajt `$00` po tekście. Idealne dla pętli zakończonych
zerem:

```
LDX #$00
pętla:
LDA msg,X
BEQ zakończone; $00 zatrzymuje pętlę
JSR $FFD2
INX
Pętla BNE
wykonane:
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

> **Wskazówka: ** Użyj PETSCII do danych, które będą wyprowadzane przez CHROUT
> (`$FFD2`). Aby zapisać dane bezpośrednio do pamięci RAM ekranu, użyj zamiast
> tego STRING lub RAWTEXT.

---

### ZESTAW ZNAKÓW

Przełącza pamięć ROM znaków VIC-II pomiędzy trybem wielkich liter/grafiki
(domyślnie w C64) a trybem małych liter/wielkich liter, poprzez modyfikację bitu
1 parametru `$D018` w czasie wykonywania.

| Pole | Opis                                                                                                                                     |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Tryb | **Małe litery** — włącza zestaw znaków małych/wielkich liter; **Wielkie litery** — przywraca domyślny zestaw znaków wielkich/graficznych |

**Składnia ekspercka:**
```
.charset lower; przełącz na zestaw znaków małych liter
.charset upper; przełącz z powrotem na zestaw znaków wielkich liter/grafiki
```

**Wygenerowano ASM:**

Tryb małych liter:
```
LDA $D018
ORA #$02; ustaw bit 1 → małe/wielkie litery w pamięci ROM na $1800
STA $D018
```

Tryb wielkich liter:
```
LDA $D018
AND #$FD ; wyczyść bit 1 → ROM wielkich liter/grafiki przy $1000
STA $D018
```

**Rozmiar:** 8 bajtów (LDA abs + ORA/AND imm + STA abs).

**Dlaczego ORA/AND zamiast bezpośredniego zapisu?** `$D018` steruje również
lokalizacją pamięci RAM ekranu (bity 7–4). Przełączenie tylko bitu 1 zachowuje
resztę rejestru.

**Typowy przepływ pracy:**

```
CHARSET lower; przełącz na zestaw znaków małych liter
TEXT 0, 0, "hello world"; [pole wyboru: Zestaw znaków małych liter]
...
CHARSET upper; przywróć ustawienia domyślne po zakończeniu
```

Lub w trybie eksperckim:
```
.charset lower
.text 0, 0, "witaj świecie", lower
.charset upper
```

W trybie eksperckim blok `.charset` teraz przechodzi również przez rozwijane
menu trybów, dzięki czemu podgląd bloku i eksportowany kod źródłowy pozostają
wyrównane.

> **Uwaga: ** Makro CHARSET zmienia tylko wskaźnik pamięci ROM znaków VIC. Nie
> wywołuje `$E544` (inicjalizacja zestawu znaków KERNAL). W większości
> przypadków jest to wystarczające; wywołaj najpierw `JSR $E544` tylko wtedy,
> gdy chcesz, aby własne procedury drukowania KERNAL-a uwzględniły tę zmianę.

---

### CHARDEF

Definiuje pojedynczy niestandardowy znak 8×8 w zestawie znaków opartym na
pamięci RAM. Wysyła kod inline środowiska wykonawczego, który kopiuje 8 bajtów
do `base + index * 8` w momencie wykonania — bez potrzeby poprzedzania etykietą
lub `ORG`.

| Pole                | Opis                                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Baza zestawu znaków | Adres bazowy zestawu znaków RAM (domyślnie `$3800`). Musi być wyrównany, aby mógł go zobaczyć komputer VIC-II (patrz poniżej). |
| Indeks znaków       | Który slot znaku zdefiniować ponownie, 0–255. `65` = 'A' w domyślnym układzie kodu ekranu.                                     |
| 8 bajtów            | Wiersze mapy bitowej rozdzielone przecinkami, od góry do dołu. Siódmy bit każdego bajtu = piksel najbardziej na lewo.          |

**Składnia ekspercka:**
```
.chardef 3800 dolarów, 65, 18 dolarów, 3C dolarów, 66 dolarów, 7E dolarów, 66 dolarów, 66 dolarów, 66 dolarów, 00 dolarów
```

**Wygenerowany ASM (8 × `LDA #b` / `Cel STA+n`, łącznie 40 bajtów):**
```
LDA #18 dolarów
    STA $3A08
    LDA #3C
    STA $3A09
    LDA #66 dolarów
    STA $3A0A
    LDA #7E
    STA $3A0B
    LDA #66 dolarów
    STA $3A0C
    LDA #66 dolarów
    STA $3A0D
    LDA #66 dolarów
    STA $3A0E
    LDA#00 dolarów
    STA $3A0F
```

**Adres docelowy: ** `$3800 + 65 * 8 = $3A08`. Obliczany w czasie kompilacji i
zakodowany na stałe w operandach STA.

**Rozmiar: ** 40 bajtów na znak (8 × 5).

**Typowy przepływ pracy:**
```
; Wskaż VIC-II na zestaw znaków RAM o wartości $3800
LDA $D018
AND #$F1
ORA #$0E ; bity 3-1 = %111 → zestaw znaków o wartości bank+$3800
STA $D018

CHARDEF $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00 ; zdefiniuj ponownie 'A'
CHARDEF $3800, 66, $7C,$66,$66,$7C,$66,$66,$7C,$00 ; zdefiniuj ponownie 'B'
; ... więcej wywołań CHARDEF dla każdego niestandardowego znaku
```

**Kiedy używać CHARDEF a kiedy alternatyw:**

| Zbliżać się                        | Użyj kiedy                                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **CHARDEF**                        | Potrzebujesz kilku niestandardowych znaków (powiedzmy 1–20). Koszt wykonania każdego z nich wynosi 40 bajtów. |
| **RAWBYTES @ 3800$**               | Masz pełny, niestandardowy zestaw znaków (256 znaków). Łącznie 2 KB danych, bez kopii w czasie wykonywania.   |
| **INCBIN „charset.bin” @ $3800**   | Zewnętrzny plik zestawu znaków (stworzony przez edytor znaków). Najczystsza opcja.                            |
| ** Zestaw znaków Canvas + INCBIN** | Pełna mapa bitowa składająca się z 256 znaków, namalowana jako jeden obraz o wymiarach 128×128.               |

> **Przypomnienie o wyrównaniu: ** VIC-II oczekuje bazy zestawu znaków jako
> wielokrotności `$0800`. Prawidłowe banki: `$0000`, `$0800`, `$1000`, ...,
> `$3800` (w ramach obecnego banku VIC o pojemności 16 KB). Zestawy znaków RAM
> zazwyczaj mają wartość `$2000`, `$2800`, `$3000` lub `$3800`.

---

### BOX_HIT

Test kolizji prostokątów ograniczających wyrównanych do osi (AABB) między dwoma
prostokątami opisanymi 4-bajtowymi strukturami zerowej strony. Zwraca wynik w
akumulatorze: **A = 1** w przypadku nakładania się, **A = 0** w przeciwnym
razie. Czysty asembler inline, bez wywołania podprogramu.

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

**Wygenerowany ASM (30 bajtów, w pełni względny dla PC — bez podprogramów, bez
skoków bezwzględnych):**
```
LDA $FD ; b1 prawy
CMP $F7 ; b2 lewy
BCC nie ; R1 &lt; L2 → chybiony
LDA $F9 ; b2 prawy
CMP $FB ; b1 lewy
BCC nie
LDA $FE ; b1 dolny
CMP $F8 ; b2 górny
BCC nie
LDA $FA ; b2 dolny
CMP $FC ; b1 górny
BCC nie
LDA #$01 ; trafiony
BNE wykonany; bezwarunkowy (A ≠ 0)
nie: LDA #$00
wykonane:
```

**Rozmiar:** 30 bajtów.

**Typowy przepływ pracy:**

```
; Pole sprite'a gracza w punkcie $FB..$FE
LDA sprite_x ; L
STA $FB
LDA sprite_y ; T
STA $FC
CLC
ADC #23 ; +23 → B (sprite o wysokości 24 pikseli)
STA $FE
LDA $FB
CLC
ADC #23 ; R
STA $FD

; Pole przeciwnika w punkcie $F7..$FA (wypełnione w podobny sposób)
; ...

BOX_HIT $FB, $F7 ; test gracz kontra wróg → A = 0 lub 1

CMP #$01
BNE no_collision
JSR handle_hit
no_collision:
```

**Ograniczenia:**
- Oba adresy strony zerowej muszą być `≤ $FC` (każde pole wymaga 4 kolejnych
  bajtów: `zp`, `zp+1`, `zp+2`, `zp+3`).
- Współrzędne są traktowane jako **8-bitowe bez znaku ** (0–255). W przypadku
  współrzędnych sprite’ów ze znakiem spoza tego zakresu należy je znormalizować
  przed zapisaniem.
- Jeśli zachodzi taka potrzeba, oba pola mogą na siebie nachodzić w przestrzeni
  ZP, zwykle jednak potrzebnych jest 8 odrębnych bajtów.

**Dlaczego nie podprogram?** Generowanie inline pozwala uniknąć obciążenia
JSR/RTS (ponad 14 cykli) i utrzymuje test w pamięci podręcznej, co zapewnia
ciasne pętle gry. Jeśli musisz przetestować wiele par, umieść ręcznie własny
`JSR box_hit_sub` wokół pojedynczego bloku BOX_HIT.

**Porównanie z funkcją `box_hit()` w UB:** Ultimate Basic opakowuje tę samą
logikę 6502, co funkcja czasu wykonania zwracająca zmienną. W VA umieszczasz
BOX_HIT w miejscu, w którym potrzebujesz testu; wynik znajduje się w `A`.

---

### INCBIN

Podobnie jak **BLOAD w BASIC** — pobiera zewnętrzny plik binarny (`.bin`,
`.prg`, `.sid`, `.raw`) i osadza go bezpośrednio w zmontowanym pliku PRG pod
określonym adresem.

| Pole  | Opis                                                           |
| ----- | -------------------------------------------------------------- |
| Plik  | Przeglądaj, aby wybrać plik `.bin`, `.prg`, `.sid` lub `.raw`. |
| Adres | Adres obciążenia docelowego (np. `$C000`)                      |

**Składnia ekspercka:**
```
.incbin "muzyka.bin", $C000
```

**Wygenerowany komentarz ASM:**
```
; INCBIN "music.bin" @ $C000 (2048 bajtów)
.bajt $01, $02, ...
```

**Rozmiar w kodzie: ** 0 bajtów (sekcja danych odroczonych). Plik binarny jest
osadzony pod podanym adresem.

---

### KOALA

Ładuje obraz **Koala Painter** (`.koa` / `.kla`, 160×200, wielokolorowy) i
wyświetla go. Dane obrazu są osadzone pod stałym adresem, takim jak `INCBIN`
(2-bajtowy adres ładowania pliku `$6000` jest usuwany), a sam blok kompiluje się
do 86-bajtowej procedury wyświetlania, która jest uruchamiana w miejscu, w
którym znajduje się blok.

| Pole  | Opis                                                                                                                                                 |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plik  | Przeglądaj, aby wybrać plik `.koa` / `.kla` (10003 bajtów lub 10001 bez adresu ładowania)                                                            |
| Adres | Adres mapy bitowej: `$6000` (domyślny, natywny dla Koali, bank VIC 1, pamięć RAM ekranu `$4400`) lub `$2000` (bank VIC 0, pamięć RAM ekranu `$0400`) |

Procedura wyświetlania kopiuje część pamięci RAM ekranu na ekran, a część
pamięci RAM kolorów do `$D800`, zapisuje bajt tła do `$D021`, wybiera bank VIC w
`$DD00` (zachowując pozostałe bity portu) i przełącza na tryb wielokolorowej
mapy bitowej (`$D011 = $3B`, `$D016 = $18`, `$D018 = $18`). Pozostałe adresy są
odrzucane: pozostałe sloty 8K znajdują się pod pamięcią ROM BASIC/KERNAL (pętla
kopiowania odczytałaby pamięć ROM) lub nakładają się na cień pamięci ROM znaków.

**Składnia ekspercka:**
```
.koala „obrazek.koa”
.koala „picture.koa”, 2000 dolarów
```

**Przykład — pokaż obrazek i poczekaj:**
```
* = $0801
.koala "picture.koa"
czekaj:
JMP czekaj
```

**Rozmiar w kodzie: ** 86 bajtów (program wyświetlania); 10001 bajtów danych
obrazu trafia pod podany adres. Edytor Hires, polecenie **Pliki → Eksportuj
Koala (.koa)…** generuje zgodny plik.

---

### POZIOM / RZĄD_POZIOMU

Dodaje projekt **Edytora poziomów** do programu i kopiuje wiersze poziomów do
bufora ekranu — elementy składowe gry z przewijaniem. Zobacz
`samples/level-demo.asm`, aby zapoznać się z kompletnym poziomem przewijanym
joystickiem.

#### POZIOM

Blok w stylu INCBIN, który emituje **0 bajtów kodu**. Tylko **umieszczone**
ekrany projektu Edytora Poziomów (`.bin` zapisane poleceniem **Pliki → Zapisz
poziom**) trafiają do pamięci z podanego adresu (domyślnie `$2000`), w
kolejności slotów, po 2000 bajtów na ekran (1000 kodów ekranów + 1000 kolorów).
Identyczne ekrany są zapisywane raz, a wszystkie puste sloty współdzielą jeden
pusty ekran. Tabele wskaźników odpowiadają ekranom. Poziom może mieć maksymalnie
7 × 10 ekranów.

**Składnia ekspercka:**
```
.level „level.bin”
.level „level.bin”, 4000 USD
```

| Zdefiniowany                                                                         | Oznaczający                                                                                                                                                            |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POZIOM_SLOTU_NISKI` / `POZIOM_SLOTU_WYSOKI`                                         | Adres ekranu w każdym slocie (główny wiersz, `LEVEL_W` slotów na wiersz)                                                                                               |
| `SLOT_WIELU_POZIOMÓW`                                                                | Rząd postaci poziomu → pierwszy slot rzędu ekranu                                                                                                                      |
| `POZIOM_RZĘDU_NIŻSZY/WYŻSZY`, `POZIOM_RZĘDU_NIŻSZY/WYŻSZY`                           | Wiersz znaku poziomu → przesunięcie wiersza kodu ekranu/wiersza koloru wewnątrz ekranu                                                                                 |
| `GNIAZDO_KOLEK_POZIOMU`, `GNIAZDO_KOLEK_POZIOMU`                                     | Widok kolumny początkowej → kolumna ekranu i kolumna wewnątrz ekranu                                                                                                   |
| `POZIOM_W`, `POZIOM_W`                                                               | Rozmiar poziomu na ekranach                                                                                                                                            |
| `KOLUMBIA_POZIOMU`, `WIERZE_POZIOMU`                                                 | Rozmiar poziomu w znakach                                                                                                                                              |
| `POZIOM_MAX_X`, `POZIOM_MAX_Y`                                                       | Największa pozycja przewijania pikseli w widoku 40×25                                                                                                                  |
| `POZIOM_BG`, `POZIOM_MC1`, `POZIOM_MC2`, `POZIOM_WIELOKOLOROWY`                      | Tło / kolory wielokolorowe i tryb poziomu                                                                                                                              |
| `DANE_POZIOMU`, `ROZMIAR_POZIOMU`, `KONIEC_POZIOMU`                                  | Początek, rozmiar i pierwszy wolny adres po danych poziomu                                                                                                             |
| `POZIOM_OBJ_X_LO/HI`, `POZIOM_OBJ_Y_LO/HI`, `TYP_OBJ_POZIOMU`, `PARAM_OBJ_POZIOMU`   | Tabela obiektów (warstwa obiektów edytora poziomów): pozycja w pikselach poziomu, typ i bajt parametru, w kolejności przewijania — wpisy `LEVEL_OBJ_COUNT` (maks. 255) |
| `POCZĄTEK_OBIEKTÓW_T_POZIOMU` … `WYZWALACZ_OBIEKTÓW_T_POZIOMU`                       | Numery typów obiektów: START 0, WRÓG 1, PRZEDMIOT 2, DRZWI 3, WYJŚCIE 4, WYZWALACZ 5                                                                                   |
| `POZIOM_START_X`, `POZIOM_START_Y`                                                   | Pozycja pierwszego obiektu startowego (zdefiniowana tylko wtedy, gdy poziom go posiada)                                                                                |
| `ATRYB_POZIOMU`, `ATRYB_POZIOMU_SOLID` … `ZBIERZ_ATRYB_POZIOMU`                      | Tabela atrybutów znaku (jeden bajt flagi na kod ekranu; tylko gdy poziom ma atrybuty) i jej bity: 1, 2, 4, 8                                                           |
| `GRANICA_POZIOMU`, `KOLORY_SCR_POZIOMU`, `GRANICA_POZIOMU_SCR_BLASK/GRANICA/MC1/MC2` | Obramowanie poziomu; tabele kolorów dla każdego slotu (rzędowe, np. `LEVEL_SLOT_*`), gdy ekran ma własne kolory (`LEVEL_SCR_COLORS` = 1)                               |

Typowy strażnik: `.assert LEVEL_END &lt;= $9200, „dane poziomu trafiają do
kodu”`.

#### POZIOM_WIERZA

Kopiuje jeden 40-znakowy wiersz poziomu do bufora: wiersz poziomu w **X**,
zaczynając od kolumny poziomu przechowywanej w zmiennej `col`, do adresu
przechowywanego we wskaźniku `dst` (`dst` / `dst+1`, lo/hi). Z trzecim
argumentem `color` kopiuje kolory zamiast kodów ekranu (dla pamięci kolorów
RAM). Okno 40-znakowe obejmujące dwa ekrany jest obsługiwane przez
samomodyfikującą pętlę kopiowania (~14 cykli na bajt). X jest zachowywane, A i Y
są niszczone. Wymaga bloku `.level` w programie.

**Składnia ekspercka:**
```
.level_row dst_lo, view_x
.level_row dst_lo, view_x, color
```

**Rozmiar w kodzie:** 132 bajty — użyj `LBEQ` / `LBNE`, gdy gałąź musi nad nią
przeskoczyć.

---

### SID

Podobnie jak **BLOAD dla muzyki** — ładuje plik `.sid` do PRG i automatycznie
odczytuje adresy Init i Play z nagłówka. Wywołuje Init raz podczas uruchamiania,
a następnie wywołuj Play z obsługi przerwań IRQ co klatkę.

| Pole                               | Opis                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------- |
| Plik                               | Przeglądaj, aby wybrać plik `.sid`                                                                |
| Adres niestandardowy (opcjonalnie) | Zastąp natywny adres ładowania SID (np. `$1000`). Pozostaw puste, aby użyć adresu z nagłówka SID. |

Blok wyświetla:
- **Tytuł/Autor** z nagłówka SID
- **Adres ładowania** — miejsce, w którym dane są umieszczane w pamięci (adres
  efektywny po nadpisaniu)
- **Adres inicjalizacji** — wywołaj to za pomocą JSR, aby zainicjować muzykę
  (dostosowane do relokacji, jeśli używany jest niestandardowy adres)
- **Adres odtwarzania** — wywołuj to za pomocą JSR w każdej ramce w obsłudze
  przerwań IRQ (dostosowany do relokacji)
- Odznaka **(przeniesiony)** pojawia się, gdy niestandardowy adres przesuwa dane
  z ich pierwotnej pozycji

**Składnia ekspercka:**
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", 1000 dolarów
```

**Wygenerowany komentarz ASM:**
```
; SID "Ikari_Warriors.sid" @ 1000 $ Init: 1000 $ Odtwórz: 1006 $ (4096 bajtów)
```

**Rozmiar w kodzie: ** 0 bajtów w linii. Plik binarny SID jest umieszczany pod
określonym adresem jako odroczony fragment w PRG.

> **Ważne:** Większość plików SID zawiera zakodowane na stałe wewnętrzne adresy
> absolutne. Można je relokować tylko wtedy, gdy cały plik binarny zostanie
> przesunięty o to samo przesunięcie. Jeśli SID zawiera wewnętrzne skoki do
> `$10xx`, musi pozostać na `$1000` — przeniesienie go na inny adres spowoduje
> uszkodzenie tych wewnętrznych odwołań.

> **Typowe zastosowanie:** Umieść blok ORG przed blokiem SID, aby ustawić jego
> adres. Wywołaj funkcję „Init” raz podczas uruchamiania, a następnie wywołaj
> funkcję „Odtwórz każdą klatkę” z rastrowego programu obsługi przerwań IRQ.

---

### WŁĄCZAĆ

Podobnie jak **MERGE w BASIC** — wczytuje inny plik i rozszerza jego bloki w tym
miejscu. Idealne dla bibliotek podprogramów wielokrotnego użytku. Dołączone
bloki są dostępne tylko do odczytu w bieżącym projekcie.

Obsługiwane są dwa rodzaje plików:
- **Projekt Visual Assembler** (`.json`) — bloki projektu są wstawiane w stanie
  takim, jaki jest.
- **Zwykły kod źródłowy asemblera** (`.inc`, `.asm`, `.s`) — plik jest
  odczytywany jako tekst i parsowany w ten sam sposób, co w trybie eksperckim.
  Przy każdej kompilacji plik jest ponownie odczytywany z dysku (źródło prawdy =
  plik), dzięki czemu można go edytować zewnętrznie w dowolnym edytorze.

| Pole                        | Opis                                                                                                                                                                                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Plik                        | Przeglądaj, aby wybrać projekt `.json` lub źródło zestawu `.inc`/`.asm`/`.s`.                                                                                                                                                                                                        |
| Załaduj adres (opcjonalnie) | Jeśli ustawiono (szesnastkowo, np. `C000`), dołączone bloki są umieszczane pod tym adresem — przed nimi wstrzykiwany jest syntetyczny blok `ORG`, nadpisujący wszystkie bloki ORG w dołączonym pliku. Pozostaw puste, aby bloki ORG z dołączonego pliku kontrolowały umiejscowienie. |

**Składnia trybu eksperckiego:**
```
.include "library.json"
.include "macros.inc", 1500 USD
.include "sprites.asm"
```

- Rozszerzenie pliku ** jest wymagane w trybie eksperckim ** — nazwa typu
  `.include "macros"` jest traktowana jako `.include "macros.json"`.
- Rozwiązywanie ścieżki: najpierw próbuje przejść obok pliku projektu
  (względnego), a następnie wraca do dołączonego katalogu aplikacji `samples/`.

**Wygenerowany ASM (bez nadpisywania adresu):**
```
; .include "library.json" — 12 bloków
... (następnie rozwinięte bloki)
```

**Wygenerowany ASM (z adresem obciążenia `C000`):**
```
; .include "library.json" @ $C000 — 12 bloków
*=$C000
... (następnie rozszerzone bloki)
```

> **Wskazówka: ** Użyj polecenia INCLUDE, aby tworzyć biblioteki podprogramów
> wielokrotnego użytku, którymi możesz dzielić się między projektami. Pliki
> `.inc`/`.asm`/`.s` najlepiej sprawdzają się, gdy chcesz edytować bibliotekę w
> edytorze tekstu lub udostępniać ją innym asemblerom 6502; `.json`, gdy
> biblioteka została utworzona w samym Visual Assemblerze. Ustaw adres
> ładowania, gdy biblioteka nie ma własnej struktury ORG lub gdy chcesz zastąpić
> jej domyślne położenie.

---

### TABELA

Podobnie jak **DIM pod określonym adresem ** — nadaje nazwę tabeli odnośników i
określa jej miejsce w pamięci. Umieść po niej bloki BYTE, WORD lub FILL, aby
zdefiniować zawartość tabeli.

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
tabela_kolorów:
```

Licznik programu przeskakuje do wskazanego adresu. Umieść bloki BYTE/WORD/FILL
po TABELI, aby wypełnić zawartość.

**Rozmiar:** 0 bajtów.

---

### ORG

Ustawia miejsce w pamięci, w którym program (lub jego fragment) zostanie
umieszczony — na przykład wybierając adres startowy przed wpisaniem kodu
maszynowego. Każdy program wymaga co najmniej jednego pliku ORG. Standardowy,
ładowalny kod startowy języka C64 BASIC to `$0801`.

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

Każdy blok ORG rozpoczyna nową sekcję. Kolejne bloki są składane, zaczynając od
tego adresu. Podczas eksportu pliku PRG wszystkie sekcje są scalane w jeden plik
— przerwy między sekcjami są wypełniane zerami.

**Przykład — kod w `$0801`, tabela danych w `$C000`:**
```
* = $0801
LDX #$00
pętla:
LDA $C000,X
STA $D800,X
INX
pętla BNE
RTS

* = $C000
.bajt $01, $02, $03, ...
```

> **Wskazówka: ** Każdy program musi zaczynać się od bloku ORG. Typowy adres
> startowy programu ładowalnego w języku C64 BASIC to `$0801` (2049 w systemie
> dziesiętnym). Po włączeniu **instancji stub BASIC SYS**, asembler dodaje
> krótką linię kodu BASIC pod adresem `$0801`, a kod zaczyna się od `$080D`.

---

### PĘTLA / NASTĘPNY

Podobnie jak **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** w języku BASIC — odlicza
od N do 1 przy użyciu rejestru X lub Y. Usuń blok LOOP, umieść swoje instrukcje
między nim a NEXT, a blok automatycznie wykona odpowiednią liczbę pętli.

#### PĘTLA

| Pole     | Opis                                                               |
| -------- | ------------------------------------------------------------------ |
| Rejestr  | `X` lub `Y` — rejestr licznika                                     |
| Liczyć   | Liczba iteracji pętli (szesnastkowa lub dziesiętna, np. `0A` = 10) |
| Etykieta | Automatycznie wygenerowana etykieta pętli (np. `loop0`)            |

**Składnia ekspercka:**
```
.pętla X, 10, pętla 0
```

**Wygenerowano ASM:**
```
LDX #$0A
pętla0:
```

**Rozmiar:** 2 bajty (kod operacji LD_ + bezpośredni operand).

#### NASTĘPNY

| Pole     | Opis                                      |
| -------- | ----------------------------------------- |
| Rejestr  | Automatycznie dopasowane do rejestru LOOP |
| Etykieta | Automatycznie powiązane z etykietą LOOP   |

**Składnia ekspercka:**
```
.następna pętla 0
```

**Wygenerowano ASM:**
```
DEX
Pętla BNE 0
```

**Rozmiar:** 3 bajty (DEX + BNE + przesunięcie gałęzi).

**Przykład — wyczyść 10 komórek ekranu:**
```
LDX #$0A
pętla 0:
LDA #$20 ; znak spacji
STA $0400,X
DEX
pętla BNE 0
```

---

### DLA / ZAKOŃCZENIE

Podobnie jak **`FOR X=0 TO N-1 : ... : NEXT X`** w języku BASIC — zlicza *w
górę* od 0. Idealne, gdy potrzebujesz indeksu do przodu, np. podczas
przechodzenia przez ciąg lub tablicę.

#### DLA

| Pole     | Opis                                                                                   |
| -------- | -------------------------------------------------------------------------------------- |
| Rejestr  | `X` lub `Y` — rejestr licznika                                                         |
| Liczyć   | Limit pętli (szesnastkowy lub dziesiętny, np. `$12` = 18). X/Y działa od 0 do limit-1. |
| Etykieta | Automatycznie wygenerowana etykieta pętli (np. `dla0`)                                 |

**Składnia ekspercka:**
```
.dla X, 12$, dla 0
```

**Wygenerowano ASM:**
```
LDX #$00
dla0:
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
.endf dla 0
```

**Wygenerowano ASM:**
```
INX
CPX #$12
BNE za 0
```

**Rozmiar:** 5 bajtów (IN_ + CP_ #imm + przesunięcie BNE).

**Przykład — wydrukuj ciąg zakończony zerem: **
```
LDX #$00
for0:
LDA msg,X ; msg = ciąg PETSCII pod ustalonym adresem
BEQ done ; terminator null → wyjście
JSR $FFD2 ; CHROUT
INX
CPX #$12 ; maks. 18 znaków
BNE for0
done:
RTS
```

> **LOOP vs FOR: ** LOOP odlicza w dół (N→1) — dobre do opóźnień, wypełnień i
> pętli pikseli. FOR odlicza w górę (0→N) — dobre do dostępu do ciągów
> znaków/tablic. Oba mogą używać X lub Y.

---

### PCHNIJ / POCIĄGNIJ

Podobnie jak **zapisywanie zmiennych przed GOSUB i przywracanie ich po ** — ale
wykorzystuje stos sprzętowy 6502. Jeśli podprogram używa A, X lub Y, należy go
opakować za pomocą PUSH i PULL, aby zachować rejestry kodu wywołującego.

#### NACISKAĆ

Umieszcza jeden lub więcej rejestrów na stosie. Kolejność jest zawsze
następująca: A → X → Y (najpierw najbardziej wewnętrzny).

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

#### CIĄGNĄĆ

Przywraca rejestry ze stosu w **odwrotnej kolejności** (Y → X → A).

| Pole     | Opis                                                         |
| -------- | ------------------------------------------------------------ |
| Rejestry | Tak samo jak PUSH — musi pasować do odpowiedniego bloku PUSH |

**Składnia ekspercka:**
```
.pociągnij AXY
```

**Wygenerowany ASM (przykład: `AX`):**
```
PLA
PODATEK
PLA
```

> **Zasada: ** Funkcje PUSH i PULL muszą zawsze używać **tego samego zestawu
> rejestrów **. `PUSH AX` → `PULL AX` (wewnętrznie przywraca w odwrotnej
> kolejności: najpierw X, potem A).

---

### END / alias RTS

Podobnie jak **RTS z przyjaźniejszą nazwą makra ** — `.end` emituje pojedynczy
bajt `RTS` i zachowuje się jak krótki terminator podprogramu w trybie
eksperckim.

**Składnia ekspercka:**
```
.koniec
```

**Wygenerowano ASM:**
```
RTS
```

**Rozmiar:** 1 bajt.

Użyj tego, jeśli chcesz uzyskać znacznik końca podprogramu, który wygląda
bardziej jak makro niż surowa instrukcja.

---

### MAKRO / ENDM / WYWOŁAJ

Podobnie jak **nazwany GOSUB z parametrami ** — zdefiniuj fragment kodu
wielokrotnego użytku raz (MACRO…ENDM), a następnie wywołaj go w dowolnym miejscu
za pomocą INVOKE. Przekazuj za każdym razem różne wartości argumentów zamiast
kopiować i wklejać bloki.

#### MAKRO (początek definicji)

| Pole      | Opis                                                                                  |
| --------- | ------------------------------------------------------------------------------------- |
| Nazwa     | Identyfikator makra (np. `setColor`)                                                  |
| Parametry | Opcjonalne nazwy parametrów rozdzielone przecinkami (np. `kolor` lub `kolor, liczba`) |

Oznacza początek definicji makra. Bloki między MACRO a ENDM stanowią treść makra
— **nie generują żadnego kodu** w miejscu, w którym znajduje się definicja. Użyj
`{paramName}` jako symbolu zastępczego dla argumentów.

**Wygenerowano ASM:**
```
; .MACRO setColor (kolor)
... (bloki treści)
; .ENDM
```

**Składnia trybu eksperckiego:**
```
.macro setColor kolor
LDA {kolor}
STA $D020
.endm
```

#### ENDM (koniec definicji)

Zamyka bieżącą definicję makra. Brak pól.

#### ODWOŁAĆ SIĘ

Wywołuje zdefiniowaną makroinstrukcję w tym miejscu i podstawia podane wartości
argumentów w miejsce symboli zastępczych `{paramName}` w treści.

| Pole        | Opis                                                                                         |
| ----------- | -------------------------------------------------------------------------------------------- |
| Nazwa makra | Wybierz z listy rozwijanej zdefiniowanych makr                                               |
| Argumenty   | Wartości argumentów rozdzielone przecinkami, pasujące do listy parametrów makra (np. `#$07`) |

**Wygenerowano ASM:**
```
; .invoke setColor(#$07)
    LDA #07 dolarów
    STA $D020
```

**Składnia trybu eksperckiego:**
```
; pojedynczy argument:
.invoke setColor(#$07)

; wiele argumentów:
.invoke drawPixel($10, $20)

; brak argumentów:
.invoke clearScreen

; argumenty tekstowe/ciąg znaków (w cudzysłowie):
.invoke printText("Witaj, świecie!")

; .call alias (synonim .invoke):
.call setColor(#$07)
```

Treść makra jest rozwijana w linii, a `{paramName}` jest zastępowane
rzeczywistymi argumentami. Akceptowana jest również forma rozdzielona spacjami
(`.invoke setColor #$07`).

**Typy argumentów:**
- **Numeryczne**: `#$07`, `$10`, `255` — wartości szesnastkowe lub dziesiętne
- **Ciągi tekstowe**: `„Witaj, świecie!”` — ciągi w cudzysłowie; przecinki w
  cudzysłowie są traktowane jako część tekstu, a nie jako separatory argumentów
- **Mieszane**: `#$07, „cześć”, $20` — dowolna kombinacja

> **Wskazówka: ** Zdefiniuj makra na górze (lub na dole) programu, a następnie
> WYWOŁUJ je w razie potrzeby. Makra można wywoływać wielokrotnie z różnymi
> argumentami.

---

### REGION / ENDREGION

Grupowanie czysto wizualne — **zero bajtów**, zero wpływu na kod asemblera. Jak
złożenie sekcji programu BASIC w nazwany blok, aby móc go zwinąć i skupić się na
czymś innym.

| Pole          | Opis                                                                           |
| ------------- | ------------------------------------------------------------------------------ |
| Nazwa regionu | Etykieta tekstu dowolnego dla sekcji (np. `init`, `game_loop`, `sprite_setup`) |

**Składnia ekspercka:**
```
.region init
; bloki...
.endregion
```

**Kontrolki w nagłówku bloku REGION (zawsze widoczne):**
- **▸ / ▾ przełącznik** — zwija lub rozwija cały region. Po zwinięciu wszystkie
  bloki między REGION i ENDREGION są ukryte.
- **↕ Rozwiń wszystko** — przywraca każdy indywidualnie zwinięty blok wewnątrz
  regionu i rozszerza sam region, jeśli jest to konieczne.
- **⦵ Wybierz w ASM** — zaznacza cały zakres kodów regionu w widoku ASM (od `;
  ===[ nazwa ]===` do `; ===[/ nazwa]===`) i przewija do niego. Przełącza
  automatycznie na kartę ASM, jeśli nie jest ona obecnie widoczna.
- **⧉ Kopiuj region** — kopiuje blok REGION, wszystkie bloki podrzędne i
  pasujący do niego ENDREGION do schowka. Mignięcie ✓ potwierdza kopiowanie.
- **⎘ Wklej region** — wstawia skopiowany region jako nowy region bezpośrednio
  za regionem ENDREGION bieżącego regionu i przewija do niego. Przycisk jest
  przyciemniony, dopóki region nie zostanie skopiowany.

**Wygenerowano ASM:**
```
; inicjacja regionu
    SEI
    LDA#00 dolarów
    STA $D020
; inicjacja regionu końcowego
```

**Rozmiar:** 0 bajtów dla regionu REGION i ENDREGION.

**Przykładowy przepływ pracy: **
1. Dodaj blok `REGION`, ustaw nazwę regionu na `init`.
2. Poniżej dodaj instrukcje inicjalizacji.
3. Dodaj blok `ENDREGION`, aby zamknąć sekcję.
4. Kliknij ▸ w REGIONIE, aby zwinąć całą sekcję do jednego wiersza podczas pracy
   nad innymi częściami programu.

> **Uwaga: Regiony ** mogą być **zagnieżdżane** w sobie. Każdy ENDREGION zamyka
> najbliższy otwarty REGION. Nie ma to wpływu na zmontowany wynik.

---

### DEFINIUJ / JEŻELI / W PRZECIWNYM RAZIE / ENDIF

Podobnie jak **przełącznik, który asembler odczytuje ** — `DEFINE DEBUG` włącza
symbol, a następnie dowolny blok `IF DEBUG` jest uwzględniany, a jego gałąź
`ELSE` jest pomijana. Usunięcie bloku DEFINE powoduje, że blok IF znika z
wyników. Nie ma potrzeby usuwania kodu w kompilacjach do wydania.

#### OKREŚLIĆ

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

Blok `DEFINE` może aktywować wiele symboli jednocześnie (rozdzielonych
przecinkami). Umieść bloki DEFINE na górze programu. Usunięcie bloku natychmiast
dezaktywuje wszystkie jego symbole.

#### JEŚLI

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

Bloki pomiędzy `IF` i `ENDIF` (lub `ELSE`) są uwzględniane lub pomijane w
zależności od tego, czy symbol warunku ma w programie odpowiadający mu `DEFINE`.
Pominięte bloki są wyświetlane jako komentarze `; [IF skiped] …` i generują
**zerowe bajty**.

#### W PRZECIWNYM RAZIE

Brak pól. Oznacza gałąź alternatywną — montowaną, gdy warunek `JEŻELI` jest
*nie* aktywny.

**Składnia ekspercka:**
```
.w przeciwnym razie
```

**Wygenerowano ASM:**
```
; .W PRZECIWNYM RAZIE
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

**Rozmiar:** 0 bajtów dla wszystkich czterech bloków. Liczy się tylko zawartość
*pomiędzy*.

**Przykład — debugowanie granicy flash, kompilacja wydania pomija to:**
```
; .DEFINE DEBUG

; .IF DEBUG
LDA #$02 ; czerwona ramka
STA $D020
; .ELSE
LDA #$00 ; czarna (zwolnienie)
STA $D020
; .ENDIF
```

**Przykład — wiele symboli w jednym bloku DEFINE:**
```
; .DEFINE DEBUG, PAL

; .IF PAL
LDA #$xx ; Stała czasowa PAL
; .ELSE
LDA #$xx ; Stała czasowa NTSC
; .ENDIF
```

Obsługiwane są zagnieżdżone bloki `IF`. Jeśli pominięty zostanie blok
zewnętrzny, pominięte zostaną również bloki wewnętrzne.

> **Uwaga: ** To jest obsługa warunków w czasie kompilacji. Informacje na temat
> porównywania/rozgałęziania w czasie wykonania można znaleźć poniżej w sekcji
> **Instrukcje IF / ELSE / ENDIF w czasie wykonania **.

### .ZAPEWNIAĆ

*(Nowość w wersji 2.3.9.)* **Sprawdzanie poprawności w czasie kompilacji**.
`.assert` ocenia wyrażenie podczas asemblacji; jeśli jest ono fałszywe (`0`),
kompilacja zatrzymuje się z wyraźnym błędem zawierającym rzeczywistą wartość.
Jeśli jest ono prawdziwe (różne od zera), nie jest emitowane.

| Pole      | Opis                                                                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Wyrażenie | Dowolne wyrażenie asemblera: etykiety, `CONST`s, `*` (licznik programów), arytmetyka i porównania (`&lt;`, `&lt;=`, `&gt;`, `&gt;=`, `==`, `!=`) |
| Wiadomość | Opcjonalny tekst dołączony do komunikatu o błędzie                                                                                               |

**Składnia ekspercka:**
```
.assert spriteData &lt; $C000
.assert * &lt; $A000
.assert end - start &lt;= 256, "tabela sprite'ów przepełniła się o jedną stronę"
```

**Zachowanie:**

- **Rozmiar:** 0 bajtów.
- Fałszywe potwierdzenie przerywa montaż: `` `.assert end - start &lt;= 256`
  jest fałszywe (wartość: 0). Tabela sprite'ów przepełniła się o jedną stronę ``
- Twierdzenie, którego nie można ocenić (niezdefiniowana etykieta itp.) również
  kończy się niepowodzeniem, z komunikatem *„nie można ocenić w momencie
  montażu”*.
- Porównania dają `1` / `0`; umieść `.assert` w dowolnym miejscu przebiegu
  programu — jest on sprawdzany pod adresem, pod którym się znajduje, więc
  `.assert * &lt; $D000` testuje bieżącą pozycję wyjściową.

**Przykład — ochrona bloku sprite'ów przed przekroczeniem strony:**
```
* = 3000 $
sprite_data:
.byte $00, $00, $00 ; … 63 bajty …
sprite_data_end:
.assert sprite_data_end - sprite_data == 63, "Sprite musi mieć dokładnie 63 bajty"
.assert (sprite_data % 64) == 0, "Sprite musi być wyrównany do 64 bajtów"
```

---

### STAŁA

Podobnie jak **zmienna o nazwie, która nigdy się nie zmienia** — `SCREEN =
$0400`. Użyj nazwy zamiast wpisywać wszędzie surowe adresy, dzięki czemu kod
będzie łatwiejszy do odczytania i późniejszej modyfikacji.

| Pole    | Opis                                                                                                                                  |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Nazwa   | Identyfikator stałej (np. `SCREEN`)                                                                                                   |
| Wartość | Wartość liczbowa w wybranej bazie (np. `0400` w formacie HEX = adres $0400) lub wyrażenie względne względem komputera (patrz poniżej) |
| Format  | HEX lub DEC — kontroluje sposób wprowadzania i wyświetlania wartości                                                                  |

**Składnia ekspercka:**
```
.const EKRAN = $0400
.const RAMKI_1S = 60
```

**Wygenerowano ASM:**
```
; .CONST SCREEN = $0400
```

Nazwa stałej pojawia się w menu rozwijanym **selektora etykiet** w blokach
instrukcji — wystarczy ją kliknąć, aby wstawić.

**Wyrażenia względne względem PC (`*+N` / `*-N`):**

Pole wartości akceptuje również `*+N` lub `*-N`, gdzie `*` to adres kompilacji
samego bloku CONST. Służy to do utworzenia nazwanego aliasu dla bajtu w
pobliskiej instrukcji — klasyczny wzorzec kodu samomodyfikującego:

```
CONST op = *+1 ; op → adres bezpośredniego operandu następnego LDA
LDA #$00 ; $00 zostanie załatane w czasie wykonywania
...
STA op ; nadpisuje bajt #$00 → LDA odczytuje nową wartość następnym razem
```

CONST emituje 0 bajtów, etykieta w momencie kompilacji zmienia się na
`current_address + 1`.

**Wyrażenia arytmetyczne:**

Pole wartości akceptuje ogólne działania arytmetyczne, w tym odwołania do
wcześniej zdefiniowanych nazw CONST, literałów szesnastkowych/binarnych i
wbudowanych funkcji matematycznych:

```
.const SCREEN = $0400
.const SCREEN_END = SCREEN + 40*25 ; 1000 bajtów później
.const COLOR_RAM = $D800
.const MID_X = 160
.const SIN_TABLE = round(sin(PI/8) * 127) ; wstępnie obliczona wartość sinusoidalna
```

**Funkcje wbudowane: ** `sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, constant `PI`

Operatorzy: `+ - * /` Literały: `$FF` (szesnastkowy), `%10110000` (binarny) Bajt
młodszy/starszy: `lo(wyrażenie)`, `hi(wyrażenie)`

**Rozmiar:** 0 bajtów.

---

### VAR

Podobnie jak **CONST, ale automatycznie przydzielane ** — `VAR` rezerwuje
miejsce na stronie zerowej dla etykiety bez konieczności wpisywania adresu.
Używaj go do liczników, wskaźników i krótkotrwałych stanów, które należą do ZP.

| Pole                  | Opis                                                                          |
| --------------------- | ----------------------------------------------------------------------------- |
| Nazwa                 | Nazwa/etykieta zmiennej                                                       |
| Rozmiar (opcjonalnie) | Liczba bajtów do zarezerwowania. Pomiń, jeśli chcesz zarezerwować jeden bajt. |

**Składnia ekspercka:**
```
licznik .var
.var licznik czasu, 2
.var żyje
```

**Przykład praktyczny: **
```
.region Vars
licznik .var
.var licznik czasu, 2
.koniecregionu

LDA#00 dolarów
Licznik STA
```

**Wygenerowano ASM:**
```
; .var licznik
```

**Rozmiar: ** domyślnie 1 bajt lub `N` bajtów, gdy określono rozmiar.

Alokator przesuwa konfigurowalny kursor strony zerowej (`$02` do `$FE`) i
przypisuje kolejny wolny slot. Jeśli żądany region nakłada się na już używaną
etykietę, kompilator generuje ostrzeżenie.

---

### Czas wykonania IF / ELSE / ENDIF

Podobnie jak **prawdziwy szablon gałęzi** — ta wersja działa w czasie
wykonywania, a nie kompilacji. Porównuje `A`, `X` lub `Y` z wartością
bezpośrednią i generuje poprawną sekwencję gałęzi `CMP` / `CPX` / `CPY` za
Ciebie.

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

Porównanie jest domyślnie bez znaku. W przypadku `&lt;=` i `&gt;` makro
rozszerza się do najkrótszego równoważnego łańcucha rozgałęzień dla wybranego
rejestru.

---

### WHILE / ENDW

Podobnie jak **pętla czasu wykonania z testem na górze** — treść jest wykonywana
tak długo, jak długo warunek pozostaje prawdziwy.

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

Użyj `WHILE`, jeśli pętla może zakończyć się przed zakończeniem pierwszej
iteracji. Jest to odpowiednik w czasie wykonywania funkcji pomocniczej
`LOOP/NEXT` opartej na zliczaniu.

---

### POWTARZAJ / DO

Podobnie jak **pętla czasu wykonania z testem na dole** — treść zawsze jest
uruchamiana co najmniej raz, a następnie warunek decyduje, czy się zatrzymać.

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

Użyj `REPEAT / UNTIL`, jeśli chcesz, aby treść została wykonana co najmniej raz
przed sprawdzeniem wyjścia.

---

### MEMCPY / MEMSET

Podobnie jak **małe procedury pamięci, po które ciągle sięgasz** — `MEMCPY`
kopiuje ciągły blok, `MEMSET` wypełnia zakres jednym bajtem.

| Makro            | Pola                          |
| ---------------- | ----------------------------- |
| `MEMCPY`         | `źródło`, `dst`, `rozmiar`    |
| `ZESTAW PAMIĘCI` | `adres`, `wartość`, `rozmiar` |

**Składnia ekspercka:**
```
.memcpy src=$C000, dst=$D000, size=$0100
.memset addr=$0400, value=#$20, size=$03E8
```

**Wygenerowano pętle ASM:** kopiowania/wypełniania w tekście, dobrane tak, aby
odpowiadały żądanemu rozmiarowi.

Rozmiary do 256 bajtów korzystają z krótkiej pętla 8-bitowej. Większe rozmiary
automatycznie przełączają się na licznik 16-bitowy.

---

### DRUKUJ / DRUKUJ_ZNAK / DRUKUJ_SZESNASTKOWY / WYCZYŚĆ_EKRAN / KLUCZ_CZEKAJĄCY / OPÓŹNIJ / USTAW_OBRAMOWANIE / USTAW_BG

#### WYDRUKOWAĆ

Podobnie jak wyjście **PETSCII bez szablonu ** — drukuje ciąg znaków przez
`CHROUT` z takim samym traktowaniem wielkich i małych liter jak w bloku PETSCII.
Pole wyboru małych liter jest współdzielone z koderem PETSCII, dzięki czemu
ścieżka tekstowa pozostaje spójna.

**Składnia ekspercka:**
```
.print "CZEŚĆ"
.print "cześć", dolna część
```

#### DRUKUJ_ZNAK

Drukuje jeden bajt PETSCII według kodu numerycznego i wysyła go przez `CHROUT`.
Wartość może być również nazwaną stałą lub etykietą, która w momencie montażu
jest przekształcana na bajt, zarówno w trybie blokowym, jak i eksperckim.

**Składnia ekspercka:**
```
.print_char 65
.print_char $41
.print_char kolor
```

#### DRUKUJ_SZESNASTKO

Drukuje 8-bitową wartość jako tekst szesnastkowy poprzez normalną ścieżkę
wyjściową KERNAL.

**Składnia ekspercka:**
```
.print_hex A
```

#### WYCZYŚĆ_EKRAN

Skrót do standardowego kodu sterującego czystym ekranem w C64.

**Składnia ekspercka:**
```
.wyczyść_ekran
```

#### WAIT_KEY

Czeka, aż zostanie naciśnięty klawisz, dzięki czemu nie musisz ręcznie powtarzać
pętli `GETIN` za każdym razem.

**Składnia ekspercka:**
```
.wait_key
```

#### OPÓŹNIENIE

Oczekuje żądaną liczbę klatek w ramach współdzielonej procedury pomocniczej.
Używaj tego w przypadku krótkich przerw i przerw w synchronizacji, gdy pełna
pętla niestandardowa byłaby przesadą. Liczba klatek może być liczbą całkowitą
lub stałą o określonej nazwie, a `.wait` to po prostu alias `.delay`.

**Składnia ekspercka:**
```
.delay 29
.wait 29
.delay frames=FRAMES_1S
```

W trybie blokowym pole opóźnienia wykorzystuje kompaktowy selektor const, gdy
dostępna jest wartość symboliczna, dzięki czemu nie musisz za każdym razem
wpisywać nazwy ręcznie.

#### USTAW_GRANICĘ / USTAW_BG

Wygodne wrappery dla rejestrów kolorów VIC-II. Wartość koloru może być liczbą
bezwzględną lub nazwaną stałą z zakresu 0–15. Zarówno tryb blokowy, jak i tryb
ekspercki akceptują tutaj symboliczne nazwy stałych.

**Składnia ekspercka:**
```
.set_border 6
.set_bg 0
.set_border kolor
.set_bg kolor
```

**Rozmiar:** Każdy pomocnik rozszerza się do małej sekwencji zapisu do rejestru
lub krótkiego wywołania KERNAL.

W trybie blokowym pola te korzystają także z selektora const, dzięki czemu
wartość symboliczna pozostaje widoczna i nie jest zastępowana przez surową
liczbę.

---

### IRQ_SETUP

Konfiguruje obsługę przerwań rastrowych w jednym kroku. Makro zapisuje wektor
IRQ, włącza przerwania rastrowe, ustawia linię, wyłącza typowe źródła IRQ CIA i
powraca do normalnego wykonywania za pomocą `CLI`.

| Pole   | Opis                                                                |
| ------ | ------------------------------------------------------------------- |
| Treser | Etykieta procedury IRQ (np. `my_irq`)                               |
| Raster | Linia rastrowa w systemie szesnastkowym lub dziesiętnym (np. `$FA`) |

**Składnia ekspercka:**
```
.irq_setup handler=my_irq, raster=$FA
```

**Rozmiar:** Krótka sekwencja ustawień; dokładna długość zależy od wybranej
linii rastrowej.

Użyj tego, jeśli chcesz mieć standardowy kod „SEI / install handler / enable IRQ
/ CLI” bez rozpraszania go po całym programie.

---

### SKRAJ

Podobnie jak **niewielki wbudowany PRNG** — zwraca 8-bitową pseudolosową wartość
z kompaktowego ziarna zerowej strony.

| Pole     | Opis                                                          |
| -------- | ------------------------------------------------------------- |
| Nasienie | Opcjonalny bajt lub etykieta zerowej strony (domyślnie `$FB`) |

**Składnia ekspercka:**
```
.skraj
```

**Rozmiar:** Kilka bajtów, w zależności od wybranej ścieżki implementacji.

Generator jest przeznaczony do rozgrywki, modyfikacji efektów i szybkiego
testowania danych. Jest celowo niewielki, a nie kryptograficznie skomplikowany.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Konfiguruje sprite'a VIC-II w jednym bloku — zamiast pisać ~6 poleceń POKE w
BASIC-u, wystarczy wypełnić pola. Ustawia wskaźnik danych sprite'a, włącza go,
opcjonalnie włącza tryb wielokolorowy i ustawia jego kolor.

| Pole          | Opis                                                                      |
| ------------- | ------------------------------------------------------------------------- |
| Sprite #      | Numer duszka 0–7                                                          |
| Kolor         | Indeks kolorów 0–15 (paleta C64)                                          |
| Strona danych | Adres danych sprite'a / 64 (np. `$21`, jeśli dane znajdują się w `$0840`) |
| Wielobarwność | Przełącza wielokolorowy bit sprite'a (`$D01C`)                            |

**Składnia ekspercka:**
```
.sprite_init 0, 7, 21 USD
.sprite_init 0, 7, 21 USD, wielokolorowy
.sprite_init 0, 7, 21 USD, monochromatyczny
```

**Wygenerowano ASM:**
```
LDA #$21
STA $07F8 ; rejestr wskaźnika sprite'a ($07F8 + N)
LDA $D015
ORA #$01 ; ustaw bit włączenia dla sprite'a 0
STA $D015
LDA $D01C
AND #$FE ; wyczyść bit wielokolorowy dla sprite'a 0
STA $D01C
LDA #$07
STA $D027 ; rejestr koloru sprite'a 0
```

**Rozmiar:** 26 bajtów.

> **Strona danych sprite'a: ** `adres_danych ÷ 64`. Z domyślnym stubem BASIC
> SYS, `ALIGN 64` po `JMP main` umieszcza dane sprite'a w `$0840` → strona =
> `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Podobnie jak **`POKE 53248, x : POKE 53249, y`** w BASIC-u — ustawia pozycję
początkową sprite'a. Współrzędne są wbudowywane w trakcie montażu, a pola
akceptują stałe w trybie blokowym; do animacji użyj `INC`/`DEC` bezpośrednio w
rejestrze sprite'a.

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
LDA #$98; X niższy bajt
STA $D000; sprite 0 rejestr X
LDA $D010
AND #$FE; wyczyść X najstarszego bajta dla sprite'a 0 (X ≤ 255)
STA $D010
LDA #$64; Y = 100
STA $D001; sprite 0 rejestr Y
```

W przypadku X > 255 makro ustawia odpowiedni bit w `$D010` zamiast go czyścić.

**Rozmiar:** 18 bajtów.

> **Uwaga: ** `SPRITE_POS` wstawia współrzędne X/Y do kodu (`LDA #$xx`). Aby
> animować sprite'a w czasie wykonywania, użyj `INC $D000` / `DEC $D000` —
> zobacz przykład `sprite-macro-demo`.

---

<a id="wait_raster"></a>
### CZEKAJ_RASTER

Czeka, aż wiązka elektronów VIC-II dotrze do określonej linii skanowania – jak
synchronizacja z ramką telewizora. Umieść to na początku pętli gry, aby zapobiec
rozrywaniu sprite'ów. Bez JSR, bez etykiety.

| Pole           | Opis                                                                    |
| -------------- | ----------------------------------------------------------------------- |
| Linia rastrowa | Docelowa linia rastrowa w formacie szesnastkowym (np. `FF` = linia 255) |

**Składnia ekspercka:**
```
.wait_raster $FF
```

**Wygenerowano ASM:**
```
czekaj:
LDA $D012 ; bieżąca linia rastrowa
CMP #$FF ; linia docelowa
BNE czekaj ; pętla powrotna (-7 bajtów)
```

**Rozmiar: ** 7 bajtów (przesunięcie `BNE` `$F9` = −7 zawsze wskazuje z powrotem
na `LDA`).

> **Wskazówka:** Umieść `WAIT_RASTER` na górze pętli gry, aby zsynchronizować ją
> z wyświetlaczem i zapobiec rozrywaniu się sprite'ów.

---

### DRĄŻEK STEROWY

Jak odczyt **`PEEK($DC00)`**, a następnie POKE-owanie pozycji sprite'a — ale w
jednym bloku. Odczytuje jeden port joysticka CIA i odpowiednio dostosowuje
rejestry X/Y sprite'a. Całkowicie inline, bez potrzeby JSR.

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
LDA $DC00; odczyt portu CIA 2
LSR; bit 0 → przeniesienie (w górę)
BCS skip_up; przeniesienie ustawione = NIEnaciśnięte
DEC $D001; Y−1 (przesuń w górę)
skip_up:
LSR; bit 1 → przeniesienie (w dół)
BCS skip_down
INC $D001; Y+1 (przesuń w dół)
skip_down:
LSR; bit 2 → przeniesienie (w lewo)
BCS skip_left
DEC $D000; X−1 (przesuń w lewo)
skip_left:
LSR; bit 3 → przeniesienie (w prawo)
BCS skip_right
INC $D000; X+1 (przesuń w prawo)
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

**Rozmiar: ** 27 bajtów. Przesunięcie `BCS` zawsze wynosi `+3` (pomija
następującą 3-bajtową instrukcję `DEC`/`INC abs`).

**Tryb zmienny — `.port joysticka, vx, vy[, fire]`:** zamiast przesuwać duszka,
kierunek zapisywany jest w zmiennych: `vx` / `vy` = `-1` / `0` / `+1` (`$FF` /
`$00` / `$01`), a opcjonalnie `fire` = `1` podczas naciskania przycisku, W
przeciwnym razie użyj `0`. Użyj go do przewijania kamery, odtwarzacza z własną
fizyką lub menu. Port `3` odczytuje oba porty joysticka jednocześnie (`LDA
$DC00` / `AND $DC01`), więc oba porty działają.

```
.joystick 2, vx, vy; 35 bajtów
.joystick 3, vx, vy, fire; oba porty + fire: 45 bajtów
```

> **Typowe zastosowanie:** Umieść w etykiecie `gameloop` najpierw `WAIT_RASTER`:
> ```
> Pętla gry:
> WAIT_RASTER ($FF)
> JOYSTICK (port=2, sprite=0)
> Pętla gry JMP
> ```

---

<a id="mouse"></a>
### MYSZ

Odczytuje dane z myszy proporcjonalnej Commodore 1351 i przesuwa sprite'a.
Całkowicie **inline** — bez JSR ani etykiety. Makro wybiera port CIA, czeka na
ustabilizowanie się sygnałów wejściowych z łopatki SID, a następnie dekoduje
ruch delta za pomocą standardowego wzorca sterownika 1351 i stosuje go do
rejestrów sprite'a.

| Pole      | Opis                                                                                     |
| --------- | ---------------------------------------------------------------------------------------- |
| Port      | `1` = CIA `$DC00` bitów `7:6` = `%01`; `2` = `%10`                                       |
| Sprite #  | Numer duszka 0–7                                                                         |
| Bajt ZP X | Adres strony zerowej (szesnastkowy) do przechowywania poprzedniej próbki POTX (np. `FD`) |
| Bajt ZP Y | Adres strony zerowej (szesnastkowy) do przechowywania poprzedniej próbki POTY (np. `FE`) |

**Wygenerowany kształt ASM (port 1, sprite 0, ZP `$FD`/`$FE`):**

```
; Wybór portu CIA + rozliczenie
LDA $DC00
AND #$3F
ORA #$40
STA $DC00
LDX #$67
czekaj:
DEX
BNE czekaj

; Oś X — standardowe 7-bitowe dekodowanie delta w stylu 1351
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

; Oś Y — to samo dekodowanie, następnie odwrócone przed zastosowaniem
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
.mouse port, numer sprite'a, zpX, zpY
; przykład:
.mouse 2, 0, FD, FE
```

> **Ważne:** Przed pierwszym wywołaniem zainicjuj bajty strony zerowej bieżącymi
> wartościami POTX/POTY, aby uniknąć przeskoku w pierwszej ramce:
> ```
> ; port 1: LDA $DC00 : AND #$3F : ORA #$40 : STA $DC00
> ; port 2: LDA $DC00 : AND #$3F : ORA #$80 : STA $DC00
> LDA $D419 : LSR A : AND #$3F : STA $FD
> LDA $D41A : LSR A : AND #$3F : STA $FE
> ```

> **Wskazówka:** Odczytuj ruch myszy raz na klatkę — umieść `WAIT_RASTER` w
> pętli gry przed `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Podobnie jak **`PEEK($D01E)`** w BASIC-u — sprawdza rejestry kolizji sprzętowych
VIC-II i informuje, czy sprite uderzył w inny sprite lub tło. Całkowicie inline,
bez potrzeby JSR.

| Pole        | Opis                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------- |
| Sprite #    | Numer duszka 0–7 (bit, który duszek należy sprawdzić)                                             |
| Typ kolizji | `Sprite-Sprite ($D01E)` — kolizja z innym sprite'em; `Sprite-Tło ($D01F)` — kolizja z grafiką tła |

**Składnia ekspercka:**
```
.sprite_col 0, sprite
.sprite_col 0, tło
```

**Wygenerowany ASM (sprite 0, sprite–sprite):**
```
LDA $D01E ; odczyt rejestru kolizji sprite-sprite (czyszczenie!)
AND #$01 ; izolowanie bitu 0 (sprite 0)
; A ≠ 0 → wystąpiła kolizja
```

**Rozmiar:** 5 bajtów.

> **Ważne:** Odczytanie `$D01E`/`$D01F` **czyści rejestr**. Odczytuj go raz na
> klatkę i natychmiast wykonaj działanie na wyniku za pomocą `BEQ`/`BNE`.

**Typowe zastosowanie:**
```
Pętla gry:
WAIT_RASTER ($FF)
JOYSTICK (port=2, sprite=0)
SPRITE_COL (sprite=0, typ=sprite-sprite)
BEQ no_hit ; A = 0 → brak kolizji
LDA #$02
STA $D020 ; czerwona ramka = trafienie!
Pętla gry JMP
no_hit:
LDA #$0E
STA $D020 ; jasnoniebieska ramka = wyczyść
Pętla gry JMP
```

> **Zobacz także:** `przykład kolizji` — zielona kula (sprite #0) kontra
> czerwony krzyż (sprite #1).

---

### WCZYTAJ PLIK

Podobnie jak **`LOAD „plik”, 8`** w BASIC-u — ładuje plik z dysku D64 w czasie
wykonywania za pomocą procedury KERNAL LOAD. Użyj tej funkcji, aby załadować
dane, muzykę lub dodatkowy kod z dysku podczas działania programu.

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
.loadfile "DEMO-COLORS", 8, $C000, etykieta_błędu
```

**Wygenerowana struktura kodu: **
```
JMP skip_filename; przeskocz nazwę pliku
.byte "DEMO-COLORS" ; bajty nazwy pliku (PETSCII, 11 znaków)
skip_filename:
LDA #11 ; długość nazwy pliku
LDX #<fname ; wskaźnik lo
LDY #>fname ; wskaźnik hi
JSR $FFBD ; SETNAM
LDA #1 ; plik logiczny #1
LDX #8 ; urządzenie 8
LDY #0 ; s=0 (nadpisz adres) lub #1 (własny adres pliku)
JSR $FFBA ; SETLFS
LDA #0 ; polecenie LOAD (nie VERIFY)
JSR $FFD5 ; LOAD
BCS fail ; (tylko jeśli ustawiono etykietę błędu)
```

**Rozmiar: ** `3 + długość_nazwy_pliku + 9 (SETNAM) + 9 (SETLFS) + (4 w
przypadku nadpisania) + 5 (WCZYTAJ) + (2 w przypadku etykiety błędu) ` bajtów.
Minimum 27 bajtów.

> **Ważne:** Nazwa pliku jest zapisywana w kodzie maszynowym zaraz po `JMP
> skip_filename`. Nazwa pliku na dysku musi być zapisana wielkimi literami
> PETSCII — co odpowiada wielkim literom w ASCII (`A`–`Z`). Makro wymusza to
> automatycznie.

> **Zawsze używaj etykiety błędu** w programach produkcyjnych — jeśli plik nie
> zostanie znaleziony, KERNAL ustawia flagę przeniesienia, a wykonywanie zostaje
> przerwane i przechodzi do następnego kroku.

> **Zobacz także:** `przykład loadfile-demo` — demonstruje ładowanie
> `DEMO-COLORS.PRG` z D64 z gałęzią błędu BCS i wizualnym ekranem błędu.

---

### EXODECRUNCH

Dekompresja Exomizera w programie ****. Użyj tej makry zaraz po poleceniu
`LOADFILE`, które załadowało strumień skompresowany w trybie Exomizera `mem` —
EXODECRUNCH rozpakuje ją wstecz do adresu osadzonego w strumieniu.

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
LDA $AE; koniec ładowania jądra (ustawiony przez poprzednie LOAD)
STA $04; wskaźnik końca źródła depakera (src-end) (lo)
LDA $AF; koniec ładowania jądra (hi)
STA $05; wskaźnik końca źródła depakera (src-end) (hi)
LDA #$36; ROM BASIC wyłączony ($A000-$BFFF staje się RAM)
STA $01
Depaker JSR; depaker odczytuje od tyłu przez $04/$05
LDA #$37; przywraca domyślne mapowanie (BASIC + KERNAL + I/O)
STA $01
```

**Jak to działa:**

1. KERNAL `LOAD` ($FFD5) aktualizuje ZP `$AE/$AF` do punktu znajdującego się
   jeden za ostatnim załadowanym bajtem. EXODECRUNCH kopiuje to do ZP `$04/$05`,
   co jest oficjalną konwencją wstecznego kodu źródłowego Exomizera.
2. Depaker jest zazwyczaj umieszczony w `$B000` (w regionie mapowanym na ROM
   BASIC). Makro przełącza `$01 = $36`, aby procesor widział tam pamięć RAM
   podczas JSR, a następnie przywraca `$01 = $37`.
3. Adres docelowy dekompresji jest **kodowany w samym strumieniu
   skompresowanym** podczas kompresji za pomocą `exomizer mem -l <load>
   plik,<target>` — depaker odczytuje go z pierwszych bajtów strumienia.

**Plik binarny depakera: ** wstępnie skompilowany depaker wsteczny to
`samples/exo-decrunch.bin` (477 bajtów, ORG $B000). Jest to wersja Kick
Assemblera oficjalnego pliku `exodecrunch.asm` z dodanym do każdego odczytu
kodem `INC $D020`, aby uzyskać widoczny efekt flashowania obramowania podczas
dekompresji. Umieść go w swoim programie z blokiem `INCBIN` pod adresem
depakera.

**Kompensacja przesunięcia bezpieczeństwa:** Domyślny tryb pamięci Exomizera
stosuje 2-bajtowe przesunięcie bezpieczeństwa — dane trafiają 2 bajty wcześniej
niż żądany cel. Okno dialogowe „Uruchom przez D64” **automatycznie dodaje 2 do
pola Dst ** przed wywołaniem Exomizera, więc widoczne zachowanie jest zgodne z
wpisanym adresem.

> **Zobacz także:** przykład `exo-multicolor-demo` — pełny przykład od początku
> do końca: WCZYTAJ skompresowaną wielokolorową mapę bitową do $C000,
> EXODECRUNCH rozpakowuje ją do $2000, następnie kopiuje ekran → $0400 i kolor →
> $D800, a następnie przełącza VIC-II w tryb wielokolorowej mapy bitowej.

> **Test integracji: ** `test cargo --test exomizer_integration` (w
> `src-tauri/`) weryfikuje pełną kompresję i dekompresję w emulatorze 6502 z
> rzeczywistym plikiem binarnym depakera. Kryteria zaliczenia: 10000 bajtów, co
> odpowiada bajtowi źródłowemu `multi-color.bin`.

---

### REU_CHECK

Wykrywa, czy podłączona jest jednostka rozszerzeń pamięci RAM Commodore (REU) —
na przykład sprawdza obecność sprzętu w rejestrze `PEEK($D010)`. Testy polegają
na zapisie i odczycie dwóch wzorców do rejestru REU `$DF04`.

| Pole | Opis           |
| ---- | -------------- |
| Nic  | Brak operandów |

**Wygenerowany kod (34 bajty):**
```
LDA #55 dolarów
STA$DF04
LDA$DF04
CMP #55 dolarów
BNE porażka
LDA#$AA
STA$DF04
LDA$DF04
CMP#$AA
BNE porażka
LDA#00 dolarów
CMP #$FF ; Z=0 =&gt; REU obecne
BNE zrobione
ponieść porażkę:
LDA#$FF
CMP #$FF ; Z=1 =&gt; brak REU
zrobione:
```
> Makro normalizuje wynik, więc poniższa gałąź pozostaje prosta: `BNE` oznacza
> obecność REU, `BEQ` oznacza brak REU.

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
BEQ no_reu ; pominąć, jeżeli nie ma REU
; ...tutaj kod REU...
nie_reu:
```

---

### REU_STASH / REU_FETCH / REU_SWAP

Transfer bloku DMA między pamięcią RAM komputera C64 a pamięcią rozszerzeń REU —
jak bardzo szybka pętla POKE, ale procesor nie wykonuje żadnej pracy (układ REU
kopiuje dane, gdy procesor jest zatrzymany). Transfer `$1000` bajtów jest
praktycznie natychmiastowy.

| Makro              | Kierunek             | Polecenie `$DF01` |
| ------------------ | -------------------- | ----------------- |
| `REU_STASH`        | Pamięć RAM C64 → REU | `90 dolarów`      |
| `POBIERZ_PONOWNIE` | REU → Pamięć RAM C64 | `91 dolarów`      |
| `REU_SWAP`         | Pamięć RAM C64 ↔ REU | `92 dolary`       |

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
LDA #c64lo STA $DF02; adres C64 LO
LDA #c64hi STA $DF03; adres C64 HI
LDA #reuLo STA $DF04; adres REU LO
LDA #reuHi STA $DF05; adres REU HI
LDA #bank STA $DF06; bank REU
LDA #lenLo STA $DF07; długość LO
LDA #lenHi STA $DF08; długość HI
LDA #$00 STA $DF09; kontrola adresu (stała)
LDA #$00 STA $DF0A; maska przerwania (stała)
LDA #cmd STA $DF01; wykonanie DMA ($90/$91/$92 = przechowywanie/pobieranie/wymiana, natychmiast)
```

> **Uwaga: polecenia ** używają `$90/$91/$92` (ustawiony bit 4 = natychmiastowy
> tryb DMA). Zapis do `$DF01` rozpoczyna transfer; procesor wznawia działanie po
> jego zakończeniu.

---

### TURBO_SET

Ustawia prędkość procesora **Ultimate-64 (U64)** za pomocą rejestru `$D031`. Nie
ma to wpływu na prawdziwy C64 ani inne emulatory.

**Pola: **

| Pole      | Opis                         | Zakres                                      |
| --------- | ---------------------------- | ------------------------------------------- |
| Prędkość  | Wskaźnik prędkości procesora | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz        |
| Zła linia | Emulacja Badline             | Włączone (zgodne z C64) / Wyłączone (turbo) |

Bajt prędkości obliczany jest w następujący sposób: `(speedIndex &amp; 0x0F) |
(badline_disabled ? 0x80 : 0x00)`.

**Wygenerowany kod (5 bajtów):**
```
A9 xx LDA #speed_byte
8D 31 D0 STA $D031
```

**Składnia trybu eksperckiego:**
```
.turbo_set 7,0; prędkość=7 (~10 MHz), linia uszkodzona włączona
.turbo_set 15,1; prędkość=15 (~48 MHz), linia uszkodzona wyłączona
```

> **Uwaga: ** Ta makroinstrukcja dotyczy tylko sprzętu U64. Na prawdziwym C64
> lub innych emulatorach zapisuje ona do `$D031`, co może mieć wpływ na CIA lub
> zostać zignorowane.

---

### WYKRYWANIE SUPERCPU

Sprawdza, czy zainstalowany jest akcelerator **CMD SuperCPU** — na przykład
`PEEK($D0B8)`, aby sprawdzić, czy zwraca on coś innego niż `$FF`.

**Wygenerowany kod (5 bajtów):**
```
AD B8 D0 LDA $D0B8
C9 FF CMP #$FF
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
BEQ no_scpu; pomiń, jeśli SuperCPU nie jest obecny
; ... Tutaj kod turbo SuperCPU ...
no_scpu:
```

---

### TURBO_ENABLE

Włącza lub wyłącza tryb turbo **CMD SuperCPU**. Najpierw wywołaj
`SUPERCPU_DETECT` i pomiń tę opcję, jeśli SuperCPU nie jest obecny.

| Tryb     | Rejestr | Efekt                              |
| -------- | ------- | ---------------------------------- |
| Włączać  | `$D07A` | Włącz turbo (do 20 MHz z SuperCPU) |
| Wyłączyć | `$D07B` | Powrót do trybu zgodności 1 MHz    |

**Wygenerowany kod (5 bajtów):**
```
A9 00 LDA #00 dolarów
8D 7A D0 STA $D07A ; (lub $D07B za wyłączenie)
```

**Składnia trybu eksperckiego:**
```
.turbo_enable włączony
.turbo_enable wyłączony
```

> **Uwaga:** Najpierw wywołaj `SUPERCPU_DETECT` i rozgałęzij się wokół tej
> makroinstrukcji, jeśli SuperCPU nie jest obecny.

---

<a id="map_copy"></a>
### MAP_COPY

Kopiuje mapę kafelków z adresu źródłowego do pamięci RAM ekranu (i opcjonalnie
pamięci RAM kolorów) za pomocą serii pętli `LDA abs,X` / `STA abs,X`. Każda
iteracja pętli kopiuje jedną stronę 256-bajtową; część strony na końcu
zatrzymuje się za pomocą `CPX #rem / BNE`. JSR nie jest potrzebny — cały kod
jest generowany inline.

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
LDA $C000,X ; strona 0
STA $0400,X
INX
BNE *-9 ; pętla, aż X przejdzie do 0 (256 iteracji)
LDA $C100,X ; strona 1
STA $0500,X
INX
BNE *-9
LDA $C200,X ; strona 2
STA $0600,X
INX
BNE *-9
LDA $C300,X ; reszta — 232 bajty
STA $0700,X
INX
CPX #$E8
BNE *-11
```

**Rozmiar: ** `2 (LDX) + pełne strony×9 + (rem &gt; 0 ? 11 : 0)` bajtów na
sekcję. Tryb łączony podwaja tę liczbę (sekcja ekranu + sekcja identycznego
koloru).

**Parowanie z edytorem map:**

Edytor Map **Pliki → Zapisz mapę + pamięć RAM kolorów (.bin)** eksportuje
pojedynczy plik binarny, w którym pierwsze `size` bajtów to kody ekranu, a
kolejne `size` bajtów to wartości pamięci RAM kolorów. Użyj MAP_COPY z
zaznaczoną opcją **Combined .bin** i wskaż **Adres źródłowy** miejsce, w którym
załadowany jest ten plik (np. przez INCBIN w `$C000`):

```
* = $C000
INCBIN "map-color.bin" @ $C000; kody ekranowe $C000–$C3E7, kolor $C3E8–$C7CF
* = $0801
; ...
MAP_COPY src=$C000 dst=$0400 size=1000 combined color_dst=$D800
```

**Składnia trybu eksperckiego:**
```
.map_copy $C000, $0400, 1000; tylko ekran
.map_copy $C000, $0400, 1000, auto, $D800; połączone (kolor w źródle i rozmiarze)
.map_copy $C000, $0400, 1000, $C3E8, $D800; jawny adres źródłowy koloru
```

---

<a id="map_copy16x16"></a>
### MAPA_KOPIA16X16

Kopiuje obszar znaków o wymiarach 16×16 z kompaktowego, 256-bajtowego bloku kodu
ekranowego oraz pasującego do niego 256-bajtowego bloku pamięci RAM kolorów.
Jest przeznaczony do eksportów kanw Charset i małych fragmentów
kafelków/obrazów, gdzie zapis szesnastu oddzielnych wierszy MAP_COPY byłby
uciążliwy.

**Domyślny układ: **

| Dane                                | Domyślny adres                |
| ----------------------------------- | ----------------------------- |
| Kody ekranowe 16×16                 | Adres źródłowy (`źródło`)     |
| 16×16 wartości kolorów              | `źródło + 256`                |
| Miejsce docelowe pamięci RAM ekranu | `$0400 + wiersz×40 + kolumna` |
| Miejsce docelowe pamięci RAM koloru | `$D800 + wiersz×40 + kolumna` |

**Składnia trybu eksperckiego:**
```
.map_copy16x16 3000 USD, 12, 4
.map_copy16x16 3000 USD, 12, 4, 0400 USD, 3100 USD, 800 USD
```

Krótsza wersja kopiuje bajty ekranu z `$3000`, bajty koloru z `$3100` i
umieszcza blok 16×16 w kolumnie 12, wierszu 4. Prawidłowe pozycje w lewym górnym
rogu to `col = 0..24` i `row = 0..9`, więc cały obszar 16×16 pozostaje na
ekranie tekstowym C64 o wymiarach 40×25.

**Wygenerowane zachowanie: **

- Generuje szesnaście kopii wierszy.
- Każdy wiersz kopiuje 16 bajtów ekranu i 16 bajtów koloru.
- JSR nie jest potrzebny; kod jest emitowany bezpośrednio w pozycji makra.
- Działa w trybie znakowym normalnym i wielokolorowym. Bajty pamięci RAM kolorów
  przenoszą bit włączający kolor znaku/wielokolorowość każdej komórki.

Typowe parowanie z Charset Canvas:

```
* = 0801 USD
    SEI
    LDA#00 dolarów
    STA $D021
    LDA #05 dolarów
    STA $D022
    LDA #$0D
    STA $D023
    .map_copy16x16 3000 $, 12, 4
pętla:
    Pętla JMP

.incbin „16x16+ram+kolor.bin”, 3000 USD
.incbin „16x16+charset.bin”, 2000 USD
```

---

<a id="sprite_anim"></a>
### SPRITE_ANIM

Przesuwa klatkę animacji sprite'a przy każdym wywołaniu i aktualizuje wskaźnik
danych sprite'a VIC-II. Przechowuje jeden bajt na klatkę w tabeli (numer strony
danych sprite'a = `data_address / 64`), wskazuje na niego SPRITE_ANIM i wywołuje
go raz na klatkę gry — bez potrzeby JSR.

| Pole              | Opis                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| Sprite #          | Numer duszka 0–7                                                                                       |
| Adres listy ramek | Adres szesnastkowy tabeli ramek — jeden bajt na ramkę, każdy bajt = strona sprite'a (`data_addr / 64`) |
| Liczba klatek     | Łączna liczba klatek (1–255)                                                                           |
| Rama ZP           | Bajt strony zerowej używany jako licznik ramek (np. `FB`)                                              |

**Wygenerowany ASM (sprite 0, 4 klatki, ZP `$FB`, lista w `$C100`):**
```
INC $FB ; przesuń licznik klatek
LDA $FB
CMP #$04 ; liczba klatek
BCC *+6 ; jeśli licznik &lt; liczba, pomiń resetowanie
LDA #$00
STA $FB
TAX ; X = bieżący indeks klatki
LDA $C100,X ; wczytaj stronę danych sprite'a dla tej klatki
STA $07F8 ; zaktualizuj wskaźnik sprite'a 0 ($07F8 + numer sprite'a)
```

**Rozmiar:** 19 bajtów.

**Typowe zastosowanie:**
```
Tabela klatek:
.byte $21, $22, $23, $24 ; 4 klatki o $0840, $0880, $08C0, $0900

pętla gry:
WAIT_RASTER ($FF)
SPRITE_ANIM (sprite=0, lista=$C100, liczba=4, zp=$FB)
pętla gry JMP
```

**Składnia trybu eksperckiego:**
```
.sprite_anim numer_spretu, adres_listy_ramek, liczba_ramek, bajt_zp
; przykład:
.sprite_anim 0, C100, 4, FB
```

> **Wskazówka: ** Umieść tablicę ramek jako blok RAWBYTES pod stałym adresem.
> Bajt licznika ZP (`$FB`) musi zostać zainicjowany wartością `$00` przed
> pierwszym wywołaniem. Jeśli Twój kod używa `$FB` do czegoś innego, wybierz
> wolną lokalizację ZP.

---

<a id="score_bcd"></a>
### WYNIK_BCD

Dodaje wartość stałego punktu do wielobajtowego wyniku BCD przechowywanego w
pamięci, a następnie renderuje każdą cyfrę do pamięci RAM ekranu jako znak kodu
ekranu. Używa trybu dziesiętnego 6502 (`SED`/`CLD`) do arytmetyki BCD z
zachowaniem przenoszenia — bez konieczności ręcznego żonglowania
przeniesieniami.

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

**Wygenerowany ASM (4 bajty, +100 punktów, wynik na poziomie `$C200`, ekran na
poziomie `$0400`):**
```
SED; włącz tryb BCD/dziesiętny
CLC
LDA $C200; bajt 0 (cyfry 1–2)
ADC #$00; młodszy bajt 100 w BCD = $00
STA $C200
LDA $C201; bajt 1 (cyfry 3–4)
ADC #$01; środkowy bajt 100 w BCD = $01 (przeniesienie propaguje)
STA $C201
LDA $C202
ADC #$00
STA $C202
LDA $C203
ADC #$00
STA $C203
CLD; powrót do trybu binarnego

; renderowanie cyfr
LDX #$00
digit_loop:
LDA $C200,X
PHA
LSR : LSR : LSR : LSR ; wysoki nibble → niski nibble
ORA #$30 ; + kod ekranu „0”
STA $0406,X ; wyrównanie do prawej: screen_addr + (digits*2 - 2) - X*2
PLA
AND #$0F ; niski nibble
ORA #$30
STA $0407,X
INX
CPX #$04
BNE digit_loop
```

**Rozmiar:** `3 + cyfry×8` bajtów (narzut SED + CLC + CLD + 8 bajtów na bajt BCD
dla ADC + pętla wyświetlania).

**Składnia trybu eksperckiego:**
```
.score_bcd $C200, 4, 100, $0400
```

> **Wskazówka: ** Zainicjuj bajty wyniku do `$00` podczas uruchamiania. Adres
> wyniku powinien znajdować się na stronie zerowej lub w pamięci RAM
> bezwzględnej — a nie ROM. Adres ekranu powinien wskazywać na skrajnie lewą
> komórkę cyfrową; cyfry są zapisywane od lewej do prawej (najbardziej znaczący
> bajt na początku).

> Zakres **BCD: ** `cyfry = 4` bajtów → 8 cyfr dziesiętnych → maks. wynik 99 999
> 999. Każdy bajt koduje dwie cyfry BCD: `$00`–`$99`.

---

## 11. Linki do bazy wiedzy

Szybkie łącza referencyjne dostępne w aplikacji w zakładce **Baza wiedzy**:

### RetroDebugger

[RetroDebugger](https://github.com/slajerek/RetroDebugger) to wieloplatformowy
debugger Commodore 64 z obsługą punktów przerwania, inspekcją pamięci i
deasemblacją uwzględniającą etykiety.

**Konfiguracja: ** Otwórz **Ustawienia → Skonfiguruj plik wykonywalny
RetroDebugger ** i skieruj go do pliku binarnego `RetroDebugger`.

**Uruchomienie:** Kliknij **Debugowanie (RetroDebugger)** na pasku narzędzi.
Aplikacja:

1. Zmontuj program do pliku `.prg` w katalogu tymczasowym.
2. Napisz plik **punktów przerwania** (`breakpoints.txt`) — jeden `punkt
   przerwania $ADDR` na każdy oflagowany blok.
3. Zapisz plik **symbols** (`symbols.txt`) w formacie etykiet Vice/RetroDebugger
   (`al C:addr .name`). Zawiera wszystkie bloki LABEL i CONST.
4. Napisz także sidecary w stylu C64Debugger obok skompilowanego PRG: `.dbg`,
   `.sym` i `.vs`.
5. Uruchom RetroDebugger za pomocą:
   ```
   RetroDebugger -prg <plik.prg> -breakpoints <punktyprzerwania.txt> -symbols <symbole.txt> [flagi]
   ```

### Bloki punktów przerwania

Kliknij ikonę punktu przerwania (●) w dowolnym bloku instrukcji, aby przełączyć
go na punkt przerwania. Bloki z punktami przerwania są podświetlone na czerwono.
Ich adresy są zapisywane w pliku punktów przerwania przy każdym uruchomieniu
debugera.

### Flagi debugera (zakładka Opcje)

| Dźwignia kolankowa | Flaga          | Efekt                                                             |
| ------------------ | -------------- | ----------------------------------------------------------------- |
| `-jmp` WŁ.         | `-jmp $ADDR`   | Przejdź bezpośrednio do adresu startowego programu po załadowaniu |
| `-wznów` WŁ.       | `-wznów`       | Natychmiast wyłącz debugger po załadowaniu                        |
| `-czekaj` WŁ.      | `-czekaj <ms>` | Odczekaj `<ms>` milisekund przed wznowieniem — 500 ms lub 1000 ms |

> **Wskazówka: ** W przypadku większości programów włącz `-jmp` i `-unpause`,
> aby uzyskać natychmiastowy autostart. Użyj `-wait 500` lub `-wait 1000`, gdy
> program konfiguruje przerwania IRQ lub muzykę SID, która wymaga czasu na
> zainicjowanie przed pierwszym rastrem.

### Monitor VICE (gorące przeładowanie, oglądanie na żywo, profilowanie)

Przycisk paska narzędzi **Monitor VICE** otwiera okno niemodalne, które
komunikuje się z działającym programem VICE za pośrednictwem jego monitora
binarnego. **Uruchom (VICE)** uruchamia program VICE z monitorem na porcie 6502
(**Ustawienia → Zdalny monitor VICE**, domyślnie włączone). Zamknij i uruchom
ponownie program VICE uruchomiony w inny sposób. Nagłówek pokazuje stan
połączenia; *Dostępne tylko w aplikacji komputerowej* pojawia się w podglądzie
przeglądarki.

| Przycisk                                     | Co to robi                                                                                                                                                                             |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Gorące przeładowanie**                     | Zapisuje skompilowany program do pamięci RAM działającego VICE (tylko do zajętych zakresów — luki pozostają bez zmian). Używaj go do przechowywania danych: sprite'ów, tabel i tekstu. |
| **Gorące przeładowanie + restart**           | To samo, następnie ponowne uruchomienie pod adresem SYS (reset stosu; końcowy `RTS` powraca do `READY.`).                                                                              |
| **Automatyczne przeładowywanie po edycjach** | Ponowne załadowanie i ponowne uruchomienie następuje około sekundy po każdej edycji, jeśli program zostanie złożony.                                                                   |
| **Oglądaj na żywo**                          | Odświeża listę obserwowanych co 0,4 sekundy. Zmieniona wartość miga.                                                                                                                   |
| **Profil**                                   | Próbkuje licznik programu przez około 5 sekund (kliknij ponownie, aby zatrzymać wcześniej).                                                                                            |

**Lista obserwowanych: ** wpisz etykietę lub adres — `wynik`, `$D020`, `53280`
lub z tabelą `liczby bajtów, 8` — i naciśnij **+** lub Enter. Każdy wiersz
zawiera adres, bajty w systemie szesnastkowym oraz, dla 1 lub 2 bajtów, wartość
dziesiętną. W trybie Ultimate Basic nazwy pochodzą z ostatniej kompilacji UB
(zmienne, etykiety, podzmienne, tablice).

**Wynik Profilera:** dwie tabele. *Procedura* grupuje próbki według najbliższej
etykiety (w Ultimate Basic: według `pod`), z udziałem w % i liniami rastrowymi,
na których były wykonywane — czas spędzony w ROM-ie KERNAL lub BASIC jest
wymieniony osobno. *Linia* wyświetla linie źródłowe o największym obciążeniu;
kliknij jedną z nich, aby do niej przejść. Każda próbka na krótko wstrzymuje
emulator, więc profil jest obrazem statystycznym, a nie dokładną liczbą cykli.

---

## 12. Eksport i uruchomienie D64

Wersja 1.5.1 wprowadza możliwość spakowania programu (oraz dodatkowych plików
danych) do obrazu dysku C64 D64 i uruchomienia go w programie VICE — lub
wyeksportowania obrazu dysku do wykorzystania w innym miejscu.

| Ratunek                                             | Adres URL                                                      |
| --------------------------------------------------- | -------------------------------------------------------------- |
| Odniesienie do kodów operacji 6502                  | http://www.6502.org/tutorials/6502opcodes.html                 |
| Funkcje jądra C64                                   | https://sta.c64.org/cbm64krnfunc.html                          |
| Mapa pamięci C64                                    | https://sta.c64.org/cbm64mem.html                              |
| Kody kolorów C64                                    | https://sta.c64.org/cbm64col.html                              |
| Artykuł VIC-II                                      | https://www.cebix.net/VIC-Article.txt                          |
| Baza kodów C64                                      | https://codebase.c64.org/                                      |
| Turbomontażysta                                     | https://turbo.style64.org/                                     |
| RetroDebugger                                       | https://github.com/slajerek/RetroDebugger/                     |
| Środowisko programistyczne systemu operacyjnego C64 | https://www.c64os.com/c64os/programmersguide/?s=devenvironment |
| Konwerter obrazów png2c64                           | https://png2c64.app/                                           |

---

## 12b. Eksport CRT (wkład Magic Desk 64K)

**Menu → Kompilacja → Kompilacja CRT** generuje obraz kartridża Commodore 64
(`.crt`, **typ kartridża 19 — Magic Desk / Domark / HES Australia**), który
działa na komputerach VICE, TheC64, prawdziwym sprzęcie za pośrednictwem
EasyFlash / Kung Fu Flash oraz 1541 slotach kartridży Ultimate II+. Jest
dostępny zarówno w **trybie blokowym**, jak i **trybie eksperckim**, a w obecnej
kompilacji również w **trybie Ultimate Basic**.

### Co znajduje się w koszyku

Przycisk **Uruchom** na pasku narzędzi został zastąpiony podzielonym przyciskiem
**:

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
| **Kung Fu Flash 2**     | Zmontuj do formatu PRG i prześlij przez szeregowy port USB na prawdziwy komputer C64/C128 z kartridżem **Kung Fu Flash 2**. Zobacz [Kung Fu Flash 2](#kung-fu-flash-2).                                                                               |

Wybrany tryb jest zapisywany pomiędzy sesjami.

### Adres załadunku i punkt wejścia

Kompilacja CRT nigdy nie korzysta z Exomizera (depacker nie może działać z
pamięci ROM carta). Kompiluje bieżącą kartę za pomocą standardowego potoku
autostartu i pobiera adres ładowania z nagłówka PRG oraz punkt wejścia z
docelowego SYS:

1. **Tryb blokowy/ekspercki z włączonym szczątkowym plikiem BASIC SYS:**
   obciążenie = `$0801`, wpis = cel SYS (zwykle `$080D` lub źródło użytkownika).
2. **Tryb blokowy/ekspercki z wyłączonym modułem BASIC SYS:** obciążenie =
   pochodzenie użytkownika (z klasycznym rozwiązaniem awaryjnym `$0801 →
   $C000`), wejście = adres ładowania.
   - **Nazwa** — jak jest wyświetlana w katalogu D64 (maks. 16 znaków,
     automatycznie wielkie litery).
   - **Addr** (adres ładowania, opcjonalnie) — jeśli podano, na początku
     dodawany jest 2-bajtowy nagłówek PRG. Pozostaw puste, aby zapisać surowe
     bajty bez nagłówka.
   - **Dst** (cel dekompresji, tylko z EXO) — miejsce, w którym depaker powinien
     umieścić dane na C64. Po włączeniu EXO, dane dodatkowe są kompresowane za
     pomocą pliku `exomizer mem -l <Addr>, <Dst>` przed zapisaniem na D64.
     Kompensacja przesunięcia bezpieczeństwa +2 jest stosowana automatycznie.
   - **EXO** — pole wyboru, które włącza wsteczne przetwarzanie danych w trybie
     `mem` dla tego wpisu. Rozmiar na dysku wynosi zazwyczaj 5–20% oryginału.
3. **Tryb Ultimate Basic:** ładowanie i wejście pochodzą z mapy kompilatora UB
   (`build.map.loadAddress`). Następnie szczątkowy kod autostartu UB wewnątrz
   ładunku jest wykonywany dokładnie tak, jak po `LOAD "...",8,1 : RUN` z dysku.

Adres źródłowy widoczny na wyjściu ASM zostaje zachowany; moduł ładujący po
prostu kopiuje płaski obraz pamięci z PRG do pamięci RAM i przechodzi do punktu
wejścia po odmapowaniu pamięci ROM karty.

### Limit rozmiaru

Ponieważ ładunek jest przechowywany liniowo, a funkcja `assembleProgramToPrg()`
zwraca płaski bufor `minAddr..maxAddr` z lukami wypełnionymi zerami, program z
szeroko rozstawionymi segmentami ORG (np. `$0801` + `$C000` + `$E000`) zlicza
każdy bajt pomiędzy nimi do budżetu 65 408 bajtów. Przekroczenie limitu powoduje
przerwanie kompilacji z błędem `saveCrtTooLarge` — należy skompresować układ
pamięci lub podzielić dane.

Przykład **loadfile-demo** jest wstępnie skonfigurowany z plikiem
`DEMO-COLORS.PRG` jako dodatkowym plikiem. Wybierz go, otwórz **Uruchom przez
D64** i kliknij **Uruchom**, aby zobaczyć pełny przepływ ładowania w akcji.

> **⚠️ Ważne ostrzeżenie — przeczytaj przed wysyłką monitora CRT**

### Zgodność

Ikona na pasku narzędzi po Edytorze Krzywych otwiera **Edytor D64** —
samodzielne narzędzie do pracy bezpośrednio z istniejącym obrazem `.d64`,
niezależnie od aktualnie otwartego programu. W przeciwieństwie do okna
dialogowego Eksportuj do D64 (które zawsze tworzy *nowy* dysk ze skompilowanego
pliku PRG), Edytor D64 edytuje obraz dysku na miejscu za pomocą `c1541`, pełniąc
więc również funkcję lekkiego menedżera dysków.

**Pliki ▾ menu:**

| Platforma               | Działanie                                      |
| ----------------------- | ---------------------------------------------- |
| IMADŁO (`x64sc`, `x64`) | Działa poprzez **Plik → Dołącz obraz wkładu**. |
| TheC64 / TheC64 Mini    | Działa poprzez wbudowaną ładowarkę kaset.      |
| Kung Fu Flash           | Działa — natywny tryb Magic Desk.              |
| Kaseta EasyFlash        | Działa po zaprogramowaniu jako Magic Desk.     |

**Pasek narzędzi: **

| Ikona                     | Działanie                                                                                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dodaj program**         | Wybierz plik lokalny i zapisz go w katalogu na dysku.                                                                                                          |
| **Wyodrębnij wybrane**    | Zapisz wybrane bajty wpisu w lokalnym pliku `.prg`.                                                                                                            |
| **Zmień nazwę wybranego** | Edytuj nazwę wpisu w tabeli — Enter potwierdza, Escape anuluje.                                                                                                |
| **Usuń wybrane**          | Usuń wybrany wpis z dysku.                                                                                                                                     |
| **Odśwież**               | Ponownie odczytaj katalog, np. po edycji dysku za pomocą innego narzędzia.                                                                                     |
| **Zapisz**                | Zapisz zmiany z kopii roboczej z powrotem do pliku `.d64`, najpierw tworząc automatyczną kopię zapasową. Opcja dostępna tylko w przypadku niezapisanych zmian. |

**Dodawanie programu:** wybranie pliku, który kończy się już na `.prg` wymaga
jedynie podania **Nazwy** i **Typu** dysku (PRG/SEQ/USR/REL) — plik `.prg`
zawiera już własny nagłówek adresu ładowania, więc jest on zapisywany bez zmian.
Wybranie dowolnego innego pliku (np. surowego pliku `.bin`) dodatkowo wyświetla:

- **Adres ładowania** (szesnastkowy, opcjonalnie) — dodaj 2-bajtowy nagłówek PRG
  pod tym adresem; pozostaw puste, aby zapisać surowe bajty.
- **Adres dekompresji** (szesnastkowy, opcjonalny) — używany tylko w połączeniu
  z Exomizerem; adres docelowy, do którego dekompresor powinien rozpakować dane.
- Pole wyboru **Exomizer** — kompresuj plik przed zapisem, używając tych samych
  trybów kompresji `mem`/`sfx`, co w przypadku dodatkowych plików w oknie
  dialogowym Eksportuj do D64 powyżej.

W spisie katalogów nazwy plików są wyświetlane w tej samej czcionce i wielkimi
literami, co w prawdziwym spisie C64 `LOAD"$",8`.

**Zapisywanie przepływu pracy:** każda edycja — dodawanie, wyodrębnianie, zmiana
nazwy, usuwanie i edycja bajtów w Edytorze Bloków — jest stosowana do prywatnej
kopii roboczej obrazu dysku, a nie do rzeczywistego pliku. Przycisk **Zapisz**
na pasku narzędzi (aktywny po pojawieniu się niezapisanych zmian) zapisuje kopię
roboczą z powrotem na rzeczywistym pliku `.d64`, tworząc najpierw automatyczną
kopię zapasową; w nagłówku wyświetla się znacznik **•**, gdy zmiany są
niezapisane, a zamknięcie edytora lub otwarcie innego dysku z niezapisanymi
zmianami powoduje wyświetlenie monitu o potwierdzenie zamiast ich odrzucenia.
**Zapisz jako…** (menu Pliki ▾) zapisuje kopię roboczą w nowej ścieżce i
kontynuuje tam edycję.

**Edytor bloków: ** ikona siatki na pasku narzędzi przełącza się na surowy widok
ścieżki/sektora pod katalogiem — klikalną mapę bloków pokolorowaną na podstawie
bitmapy wolnych/używanych danych BAM (z łańcuchem BAM i katalogów oznaczonym
oddzielnie), siatką heksadecymalną dla wybranego bloku 256-bajtowego oraz
nawigacją w sektorach Poprzedni/Następny. Edycja bloków przechodzi przez ten sam
proces tworzenia kopii roboczej/zapisu, co opisane powyżej czynności katalogowe.

> **Wymagania: ** Podobnie jak w przypadku eksportu do formatu D64, edytor D64
> wymaga skonfigurowania opcji VICE (`c1541`) w [Ustawieniach
> sprzętu](#13-hardware-settings).

---

## 13. Ustawienia sprzętowe

Otwórz **Ustawienia → Ustawienia sprzętowe…** w menu paska narzędzi. Wszystkie
ścieżki do sprzętu zewnętrznego i konfiguracja sieci znajdują się tutaj.

### Emulator VICE

- **8 × 8 banków KB** przy `$8000`, przełączanie banków za pomocą `$DE00`
  (konwencja Magic Desk: 3 najniższe bity = bank, bit 7 = wyłączony moduł).
- **Bank 0** zawiera nagłówek 128-bajtowy + program ładujący:
  - Wektory zimnego i ciepłego startu `$8000/$8002` wskazują na `$8009`.
  - `$8004–$8008` = podpis `CBM80` wymagany przez kod resetujący KERNAL.
  - `$8009–$807F` = ładowarka: SEI / stack init / `JSR $FDA3` (IOINIT) / `JSR
    $FD50` (RAMTAS) / `JSR $FD15` (RESTOR) / `JSR $FF5B` (CINT), a następnie
    pętla kopiowania bajtów, która przesyła strumieniowo ładunek z pamięci ROM
    karty do pamięci RAM i przełącza banki, gdy `$FC` osiągnie `$A0`. Na końcu
    kopiuje malutki **stykowy kod wyjściowy ** do `$0100`, wyłącza wózek za
    pomocą `LDA #$80 : STA $DE00` i wykonuje `JMP`s do punktu wejścia.
- **Ładunek** zaczyna się od `$8080` w banku 0 i w razie potrzeby przelewa się
  do banków 1–7. Maksymalny ładunek = `8 * 8192 − 128 = 65 408 bajtów`.

### Exomizer

**Przepływ pracy: **

- Zainstaluj plik binarny Exomizera:
- Skonfiguruj ścieżkę w **Ustawienia sprzętowe → sekcja Exomizer**.
- Zaznacz pole wyboru **Uruchom z Exomizerem** w menu **Ustawienia**.

Exomizer działa w ten sam sposób w systemach Windows i macOS — interfejs wiersza
poleceń jest wywoływany z poziomu zaplecza Tauri; integracja nie jest zależna od
konkretnej platformy.

### Retro Debugger

Pełną dokumentację debugera można znaleźć w [Sekcji 9]{1}.

> **⚠️ Ważne ostrzeżenie — przeczytaj przed wysyłką monitora CRT**
> 
> Program ładujący wywołuje funkcję KERNAL **`RESTOR` ($FD15)** jako część
> standardowej sekwencji resetowania. To celowo przepisuje standardowe wektory
> wejścia/wyjścia w `$0314/$0315`, `$0316/$0317`, `$0318/$0319`, `$0328/$0329` i
> podobnych z powrotem do domyślnych ustawień ROM-u. Konsekwencje:
> 
> - **Wszystkie haki IRQ / NMI / BRK ustawione przed rozruchem CRT zostaną
>   wyczyszczone.** Twój program musi zainstalować je samodzielnie po wejściu —
>   dokładnie tak, jak świeże `LOAD "",8,1 : RUN` z taśmy/dysku.
> - Programy **UltimateBasic**, które opierają się na wektorach KERNAL innych
>   niż domyślne, działających na wejściu, mogą wymagać jawnego wywołania `SYS`
>   lub init w szczątkowym autostartie. Standardowy autostart UB działa od razu;
>   biblioteki rozszerzeń, które przechwytują wektory *przed * `RUN`, nie.
> - **CIA1 / CIA2** są ponownie inicjowane przez `IOINIT`. Niestandardowe
>   ustawienia timera (IRQ rastrowe, odtwarzacz muzyczny CIA-A) muszą zostać
>   przeprogramowane po wprowadzeniu.
> - Wózek jest wyłączany z 8-bajtowego szczątku w **RAM pod adresem `$0100`**,
>   aby `STA $DE00` nie mogła zostać przerwana przez błędne pobranie ROM-u. Nie
>   należy polegać na `$0100–$0107` zawierającym obraz wierzchołka stosu przy
>   wejściu — pierwsze wciśnięcie w RAM nadpisuje szczątek.
> 
> Jeśli CRT działa w VICE, ale zawodzi na prawdziwym sprzęcie, pierwszą rzeczą
> do sprawdzenia jest to, czy program przyjmuje konkretny stan wektora KERNAL
> lub timera CIA na wejściu. Zainstaluj ten stan jawnie w swojej procedurze
> init, a będzie on zachowywał się tak samo w obu przypadkach.

### C64 Ultimate / 1541 Ultimate

| Platforma                       | Opis                                                                          |
| ------------------------------- | ----------------------------------------------------------------------------- |
| **Host (IP)**                   | Adres IP urządzenia (np. `192.168.1.100`)                                     |
| **Hasło**                       | Opcjonalnie — jeśli urządzenie wymaga uwierzytelnienia                        |
| **Test połączenia**             | Wysyła żądanie testowe do `/v3/runners/info`; wyświetla komunikat OK lub błąd |
| Kaseta EasyFlash                | Działa po zaprogramowaniu jako Magic Desk.                                    |
| 1541 Ultimate II+ / Ultimate 64 | Działa poprzez **Kaseta → Załaduj obraz koszyka **.                           |
| Kameleon / Turbo Kameleon       | Fabryka.                                                                      |

---

## 14. Edytory wizualne (zestaw narzędzi)

Menu paska narzędzi **Zestaw narzędzi** grupuje edytory danych wizualnych, które
wszystkie mają wspólne menu Pliki (`Pliki ▾`) dla opcji Ładuj BIN / Zapisz BIN /
Eksportuj do bloków / Zapisz do D64. Każdy edytor generuje surowe dane `.bin`,
które można umieścić w programie za pomocą `INCBIN` lub bezpośrednio dodać do
dysku D64 za pomocą opcji **Zapisz do D64**.

### Edytor wysokiej rozdzielczości / wielokolorowy

| Ustawienie              | Opis                                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Przełączanie trybu      | Pole wyboru **Wielokolorowe** przełącza między wysoką rozdzielczością (monochromatyczne na komórkę) a wielokolorowym (4 kolory na komórkę). |
| **Status**              | Pokazuje, czy ścieżka wykonywalna jest prawidłowa i dostępna                                                                                |
| **Zdalny monitor VICE** | Uruchamia VICE z monitorem binarnym na porcie 6502, potrzebnym dla [Monitor VICE](#vice-monitor-hot-reload-live-watch-profiler)             |

Edytor bitmap na poziomie pikseli z trybami wysokiej rozdzielczości 320×200 i
wielokolorowymi 160×200. Otwórz przez Toolkit → Hi-Res Editor.

### Edytor Sprite'ów

| Ustawienie | Opis                                                                 |
| ---------- | -------------------------------------------------------------------- |
| Ramki      | Dodaj/usuń/zmień kolejność ramek; pasek ramek jest pokazany na dole. |
| Tryb       | Przełącznik mono/wielokolorowy.                                      |
| **Status** | Pokazuje, czy ścieżka wykonywalna jest prawidłowa i dostępna         |

**Przepływ pracy: **
1. Zainstaluj plik binarny Exomizera:
   - **Windows:** pobierz wstępnie skompilowany plik `win32/exomizer.exe` ze
     strony https://bitbucket.org/magli143/exomizer/wiki/Home lub
     https://csdb.dk/release/?id=244342.
   - **macOS:** `brew install exomizer` (instaluje oficjalną kompilację 3.1.2
     Magnusa Linda).
2. Skonfiguruj ścieżkę w **Ustawienia sprzętowe → sekcja Exomizer**.
3. Zaznacz pole wyboru **Uruchom z Exomizerem** w menu **Ustawienia**.
4. Wszystkie akcje **Run** (PRG, D64, sprzęt) i akcje **Build** (Build PRG,
   Build D64) będą teraz przetwarzać zmontowany program za pomocą `exomizer sfx
   sys` przed uruchomieniem lub zapisaniem.

Exomizer działa w ten sam sposób w systemach Windows i macOS — interfejs wiersza
poleceń jest wywoływany z poziomu zaplecza Tauri; integracja nie jest zależna od
konkretnej platformy.

**Wewnętrznie używane są dwa tryby kompresji:**

| Tryb            | Używany przez                                                 | Konwencja wywoławcza                                                                                                                                                                           |
| --------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `system sfx`    | Zbuduj/Uruchom z przełącznikiem Exomizer (główna ścieżka PRG) | Samorozpakowujący się PRG z wbudowanym decruncherem; ustawienie Border-flash kontroluje `-x1` vs `-n`                                                                                          |
| `mem` (do tyłu) | Uruchom przez D64 → pole wyboru **EXO** dla każdego pliku     | Kompresuje każdy dodatkowy plik do strumienia w trybie `mem`; program dekompresuje go w czasie wykonywania za pomocą makra **EXODECRUNCH** i wbudowanego depakera (`samples/exo-decrunch.bin`) |

> **Wskazówka: ** Jeśli ścieżka Exomizera nie jest skonfigurowana, ale pole
> wyboru jest zaznaczone, zamiast uruchomienia wyświetla się czysty komunikat o
> błędzie. Odznacz pole wyboru, aby uruchomić Exomizer bez kompresji.

> **Test integracji:** `test cargo --test exomizer_integration` (w `src-tauri/`)
> weryfikuje pełną kompresję i dekompresję w trybie pamięci w obie strony na
> emulatorze 6502.

### Przeglądarka ROM-u znaków C64 („mapa znaków”)

| Ustawienie         | Opis                                                                                                                                                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dwa zestawy znaków | Karta 1: **Zestaw 1 — Górny/Grafika** (domyślny tryb po włączeniu zasilania). Karta 2: **Zestaw 2 — Dolny/Górny** (po przełączeniu `$0E`).                                                                                                       |
| **Status**         | Siatka 16×16 zawierająca wszystkie 256 znaków. Kliknij glif, aby zobaczyć jego panel szczegółów: powiększony widok 8×8 pikseli, kod ekranu (dziesiętny + szesnastkowy), kody PETSCII (domyślne i przesunięte) oraz surową 8-bajtową mapę bitową. |

Przeglądarka tylko do odczytu pamięci ROM znaków C64 (wbudowanej czcionki
PETSCII). Otwierana poprzez wpis **C64 chargen** w menu Toolkit. Przydatna do
znalezienia kodu ekranowego glifu przed zapisaniem go za pomocą `RAWBYTES` lub
`TEXT`.

### Edytor znaków (zestaw znaków)

Edytor znaków 8×8 o pojemności 256 znaków. Otwórz przez Toolkit → Edytor znaków.

| Ustawienie      | Opis                                                                                           |
| --------------- | ---------------------------------------------------------------------------------------------- |
| Załaduj ROM     | Importuje zestaw znaków ROM C64 bezpośrednio z `chargen` programu VICE (bez selektora plików). |
| Załaduj `.bin`  | Importuje zewnętrzny plik binarny z zestawem znaków o rozmiarze 2048 bajtów.                   |
| Podgląd na znak | 16-szeroka siatka wszystkich 256 glifów z podświetloną bieżącą komórką.                        |

**Przepływ pracy: **
1. Podłącz urządzenie 1541 Ultimate / Ultimate 64 do sieci lokalnej.
2. Wprowadź adres IP (i hasło, jeśli zostało ustawione) w Ustawieniach sprzętu.
3. Wybierz **Uruchom na sprzęcie** z menu podzielonego uruchamiania.
4. Kliknij **▶ Uruchom** — PRG zostanie skompilowany i wysłany do urządzenia za
   pomocą protokołu HTTP POST do `/v3/runners/prg`. Urządzenie natychmiast go
   załaduje i uruchomi na komputerze C64.

> **Wskazówka: ** Nie potrzebujesz kabla USB ani sterownika — interfejs API REST
> jest wbudowany w oprogramowanie układowe Ultimate. Twój komputer i urządzenie
> muszą być w tej samej sieci lokalnej.

### Edytor płótna zestawu znaków

Malarz pełnego zestawu znaków do tworzenia ekranów z kompletnego, 256-znakowego
zestawu znaków. Otwórz przez Toolkit → Charset Canvas.

Płótno ma rozmiar 16×16 znaków. W trybie monochromatycznym daje to obszar
roboczy o wymiarach 128×128 pikseli; w trybie wielokolorowym znaków daje obszar
roboczy o szerokości 64×128 pikseli, zgodnie z rzeczywistymi regułami
wielokolorowości znaków w C64.
- włączony komputer Commodore 64 / C128 z zamontowanym kartridżem **Kung Fu
  Flash 2**;
- **Oprogramowanie układowe Kung Fu Flash w wersji 2.07 lub nowszej** na
  kartridżu — starsze wersje oprogramowania układowego nie obsługują protokołu
  przesyłania używanego przez Visual Assembler. Wersje oprogramowania
  układowego: <https://codeberg.org/KimJorgensen/KungFuFlash2/releases/>;
- kabel USB **** łączący kartridż z komputerem, na którym działa program Visual
  Assembler (widoczny jako wirtualny port szeregowy).

| Ustawienie           | Opis                                                                                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mono / wielokolorowy | Tryb monochromatyczny przechowuje 1-bitowe glify 8×8. Tryb wielokolorowy przechowuje dwubitowe poziome pary pikseli i oznacza używane komórki bitem 3 pamięci RAM koloru. |

**Przepływ pracy: **
1. Umieść kartę Kung Fu Flash 2 w porcie kartridża w C64, włącz komputer i
   podłącz kabel USB do komputera PC/Mac.
2. Otwórz **Ustawienia sprzętu** i sprawdź sekcję **Kung Fu Flash 2** — port
   powinien być już wypełniony.
3. Wybierz **Kung Fu Flash 2** z menu podzielonego przebiegu (wybór zostanie
   zapamiętany i zapisany także w plikach projektu).
4. Kliknij **▶ Uruchom **. Program zostaje skompilowany, kaseta zostaje ponownie
   uruchomiona w programie ładującym MENU (krótkie „dotknięcie” portu
   szeregowego z prędkością 1200 bodów), następuje krótkie uzgadnianie i
   przesłanie pliku PRG. Po zakończeniu transferu program działa na komputerze
   fizycznym.

Działa w trybach **Block**, **Expert** i **Ultimate Basic**; programy Ultimate
Basic kompilują się z pliku startowego projektu.

> **Ograniczenia i kontrole: ** PRG musi zawierać dwubajtowy adres ładowania
> plus co najmniej jeden bajt danych, musi mieścić się w 64-kilobajtowej
> przestrzeni adresowej C64 i nie może przekraczać rozmiaru akceptowanego przez
> moduł ładujący kartridża. Błędy — brak konfiguracji portu, brak możliwości
> otwarcia portu, brak powrotu kartridża z MENU lub odrzucenie przesłania — są
> zgłaszane w komunikacie z dokładną przyczyną.

> **Wskazówka:** jeśli wolisz obraz kartridża zamiast przesyłania na żywo,
> **Build CRT** (Magic Desk 64K) również działa na Kung Fu Flash — zobacz
> [Sekcję 12b](#12b-crt-export-magic-desk-64k-cartridge).

---

---

### Kontrola wersji (git)

| Ustawienie                                               | Opis                                                                                                                                          |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Automatyczne zapisywanie wpisów w kontroli wersji**    | Dodaje wpis automatycznego zapisu do historii wersji około 2,5 s po zakończeniu edycji (dotyczy to również kart projektu w historii projektu) |
| **Wybierz git.exe…**                                     | Przejdź do pliku wykonywalnego `git` (`git.exe` w systemie Windows)                                                                           |
| **Automatyczne wykrywanie**                              | Czyści wybraną ścieżkę i przeszukuje ścieżkę PATH oraz zwykłe foldery instalacyjne                                                            |
| **Używaj Gita, gdy projekt znajduje się w repozytorium** | Otwiera okno dialogowe kontroli wersji w trybie Git dla plików w repozytorium Git                                                             |
| **Status**                                               | Pokazuje wersję git lub informuje, że git nie został znaleziony (wbudowana kontrola wersji nadal działa)                                      |

## 14. Edytory wizualne (zestaw narzędzi)

Menu paska narzędzi **Zestaw narzędzi** grupuje edytory danych wizualnych, które
wszystkie mają wspólne menu Pliki (`Pliki ▾`) dla opcji Ładuj BIN / Zapisz BIN /
Eksportuj do bloków / Zapisz do D64. Każdy edytor generuje surowe dane `.bin`,
które można umieścić w programie za pomocą `INCBIN` lub bezpośrednio dodać do
dysku D64 za pomocą opcji **Zapisz do D64**.

Okna dialogowe edytora wizualnego można przeciągać za nagłówki w całym obszarze
roboczym Visual Assembler. Okno dialogowe bez zapisanej pozycji otwiera się
wyśrodkowane; po przesunięciu jego ostatnia pozycja jest zapisywana w
ustawieniach interfejsu użytkownika i przywracana przy następnym otwarciu.

### Edytor wysokiej rozdzielczości / wielokolorowy

Edytor bitmap na poziomie pikseli z trybami wysokiej rozdzielczości 320×200 i
wielokolorowymi 160×200. Otwórz przez Toolkit → Hi-Res Editor.

| Funkcja                                 | Opis                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Przełączanie trybu                      | Pole wyboru **Wielokolorowe** przełącza między wysoką rozdzielczością (monochromatyczne na komórkę) a wielokolorowym (4 kolory na komórkę).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Narzędzia                               | Ołówek, gumka, linia, prostokąt, wypełniony prostokąt, owal, wypełniony owal, wypełnienie, papier komórkowy, zaznacz.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Papier komórkowy (wysoka rozdzielczość) | Tryb wysokiej rozdzielczości pozwala na użycie dwóch kolorów w każdej komórce 8×8: atramentu (ustawione piksele, wysoki bit bajtu pamięci RAM komórki) i papieru (czystsze piksele, niski bit). Narzędzie **Papier w komórce** ustawia wybrany kolor papieru dla każdej klikniętej lub przeciągniętej komórki; narzędzie **PAPIER** ustawia kolor dla wszystkich komórek jednocześnie. Gumka czyści piksele, więc widoczny jest papier komórki. Wyłączone w trybie wielokolorowym, gdzie tło ($D021) jest współdzielone.                                                                                                                                        |
| Narzędzie do rozpylania                 | Malarz w stylu aerografu, który rozprasza piksele wokół kursora podczas rysowania.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Intensywność rozpylania                 | Lista rozwijana obok narzędzia natryskowego umożliwia kontrolowanie gęstości każdego pociągnięcia natryskiem.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Paleta kolorów                          | Selektory pierwszego planu (tusz) i papieru (tło). Tryb wielokolorowy automatycznie śledzi 3 dodatkowe elementy na komórkę.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Cofnij / Ponów                          | Historia poszczególnych uderzeń, ctrl-Z / ctrl-Y.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Wybierać                                | Narzędzie do zaznaczania przerywanymi kwadratami: przeciągnij na płótnie, aby zaznaczyć prostokątny obszar. **Esc** czyści zaznaczenie.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Kopiuj/Wklej                            | **Kopiuj** (`Ctrl/Cmd+C`) kopiuje zaznaczony region. **Wklej** (`Ctrl/Cmd+V`) wyświetla podgląd podążający za kursorem: kliknij na płótnie, aby je umieścić, **Esc** anuluje. Kopia jest zachowywana, więc naciśnięcie `Ctrl/Cmd+V` i ponowne kliknięcie powoduje umieszczenie jej tyle razy, ile potrzeba. W trybie wysokiej rozdzielczości wklejone piksele nadal podlegają limitowi dwóch kolorów na komórkę, więc wyrównaj region z siatką komórek, aby zachować jego kolory. Kopiuj, Wklej i Wklej przezroczysto są również dostępne w menu prawego przycisku myszy na płótnie; wklejanie rozpoczęte w tym miejscu wyświetla podgląd w miejscu kliknięcia. |
| Przezroczysta pasta                     | `Ctrl/Cmd+Shift+V` (lub odpowiadający mu przycisk na pasku narzędzi) pomija piksele kopii w kolorze papieru, więc widoczny jest obraz znajdujący się pod spodem.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Siatka + Raster                         | **Siatka** pokazuje siatkę komórek znaków: 8×8 pikseli w wysokiej rozdzielczości, 4×8 pikseli o podwójnej szerokości w wielokolorze. Przy powiększeniu 4x rysuje również cieńszą linię wokół każdego piksela, dzięki czemu każdy piksel można umieścić dokładnie. **Raster** dodaje nakładkę wiersza rastrowego.                                                                                                                                                                                                                                                                                                                                                |
| Brzęczenie                              | Suwak od 1× do 16×.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Importuj obraz                          | Obrazy PNG/JPEG/GIF upuszczone na płótno są automatycznie kwantyzowane do 16-kolorowej palety C64.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Eksportuj bloki                         | Dołącza do programu bloki BYTE/RAWBYTES zawierające zakodowane dane dotyczące mapy bitowej, ekranu i koloru.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Eksportuj `.bin`                        | Zapisuje natywny format wielokolorowy (10000 bajtów: 8000 bitmap + 1000 ekran + 1000 kolorów) gotowy do załadowania pliku do $2000.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

### Edytor Sprite'ów

Edytor sprite'ów 24×21 pikseli z animacją wieloklatkową. Otwórz przez Toolkit →
Edytor sprite'ów.

| Funkcja                            | Opis                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ramki                              | Dodaj/usuń/zmień kolejność klatek; pasek klatek jest pokazany na dole. **Kopiuj** / **Wklej** w wierszu klatek kopiuje całą bieżącą klatkę; te same dwa wpisy znajdują się w menu prawego przycisku myszy na płótnie i pasku klatek.                                                                                                                                                                                                     |
| Tryb                               | Przełącznik mono/wielokolorowy.                                                                                                                                                                                                                                                                                                                                                                                                          |
| Narzędzia                          | Ołówek, wypełnienie, linia, prostokąt, okrąg — a także odbicie w poziomie, odbicie w pionie, przesunięcie w lewo/prawo/górę/dół (z opcjonalnym zawijaniem). Narzędzia kształtów wyświetlają podgląd na żywo podczas przeciągania; zwolnij, aby zatwierdzić.                                                                                                                                                                              |
| Cofnij / ponów                     | Pełny stos cofania/ponawiania dla każdej klatki. Ctrl/Cmd+Z / Ctrl/Cmd+Y lub przyciski paska narzędzi.                                                                                                                                                                                                                                                                                                                                   |
| Importowanie obrazu                | Zaimportuj PNG lub JPEG poprzez Pliki → Importuj obraz. Importer mapuje każdy piksel na najbliższy kolor z palety C64 i zapisuje go w bieżącej klatce.                                                                                                                                                                                                                                                                                   |
| Podgląd animacji                   | Odtwarzaj/zatrzymaj z konfigurowalną prędkością.                                                                                                                                                                                                                                                                                                                                                                                         |
| Eksportuj bloki                    | Wstawia blok RAWBYTES pod adresem 64-bajtowym dla każdej klatki, a także konfigurację wskaźnika sprite'a.                                                                                                                                                                                                                                                                                                                                |
| Zapisz `.bin`                      | Zapisuje 64 bajty na klatkę (surowe dane sprite'a bez wypełnienia).                                                                                                                                                                                                                                                                                                                                                                      |
| Wybór                              | **Zaznacz / przesuń**: przeciągnij prostokąt, a następnie przeciągnij wewnątrz niego, aby przesunąć piksele (puste piksele są przezroczyste); klawisze strzałek przesuwają go o jeden piksel (dwa w przypadku kolorów wielokolorowych), Delete czyści, Esc upuszcza. **Obrót o 90°** (w obu kierunkach) obraca zaznaczenie lub całą ramkę. Zaznaczenie, przerzucenie, przesunięcie i obrót działają jednocześnie na korpusie i nakładce. |
| Nakładka o wysokiej rozdzielczości | **Nakładka o wysokiej rozdzielczości** dodaje drugi, jednokolorowy sprite o wysokiej rozdzielczości na każdą klatkę — klasyczny kontur na wielokolorowym korpusie. Lista **Warstwa** wybiera edytowaną warstwę; nakładka jest przyciemniana podczas edycji korpusu. Na C64 jest to osobny sprite: nadaj mu niższy numer sprite'a niż korpusowi. `.bin` i **Kopiuj bajty** zapisują sprite'y nakładki po korpusie (`sprite_f1_ov_1`).     |
| Odbij wszystko                     | Dodaje poziomo odbitą kopię każdej klatki (i jej pola trafienia) — cykl przejścia w drugą stronę za pomocą jednego kliknięcia.                                                                                                                                                                                                                                                                                                           |
| Import arkusza sprite'ów           | Pliki → **Importuj arkusz sprite'ów…**: szerokość/wysokość komórki, przesunięcie, odstęp i liczba klatek dzielą obraz na klatki o bieżącym rozmiarze (komórki wielokolorowe są skalowane do 12 pikseli na sprite'a). Kolory pochodzą z obrazka lub pozostają własne sprite'a; dopasowanie OKLab bez ditheringu, dithering uporządkowany (Bayer) lub Floyd-Steinberg. Zastępuje klatki lub dodaje do nich elementy.                       |
| Hitbox                             | Narzędzie **Pole trafień** przeciąga prostokąt na klatkę (przerywany cyjan); **Dopasuj**, **Dopasuj do każdej klatki**, **Kopiuj do każdej klatki** i **Usuń** w panelu bocznym. Pliki → **Kopiuj tabelę pól trafień** daje `sprite_hit_x / _y / _w / _h` (jeden bajt na klatkę, piksele ekranu od lewego górnego rogu); klatka bez pola trafień używa jej granic pikseli.                                                               |
| X / Y ×2                           | Pokazuje podgląd tak jak przy rozszerzeniu sprite'ów `$D01D` / `$D017`.                                                                                                                                                                                                                                                                                                                                                                  |

**Eksport do UltimateBasic** (menu Pliki) zapisuje każdą klatkę (do 8) jako
`sprdef`, konfiguruje sprite'a 0 (kolor, wielokolor, rozszerzenie) i, w
przypadku animacji, dodaje pętlę zsynchronizowaną z rastrem, która przesuwa
klatki z szybkością klatek (FPS) edytora. W trybie Ultimate Basic jest ona
wstawiana w miejscu kursora, w przeciwnym razie kopiowana do schowka.

### Przeglądarka ROM-u znaków C64 („mapa znaków”)

Przeglądarka tylko do odczytu pamięci ROM znaków C64 (wbudowanej czcionki
PETSCII). Otwierana poprzez wpis **C64 chargen** w menu Toolkit. Przydatna do
znalezienia kodu ekranowego glifu przed zapisaniem go za pomocą `RAWBYTES` lub
`TEXT`.

| Funkcja            | Opis                                                                                                                                                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dwa zestawy znaków | Karta 1: **Zestaw 1 — Górny/Grafika** (domyślny tryb po włączeniu zasilania). Karta 2: **Zestaw 2 — Dolny/Górny** (po przełączeniu `$0E`).                                                                                                       |
| Siatka glifów      | Siatka 16×16 zawierająca wszystkie 256 znaków. Kliknij glif, aby zobaczyć jego panel szczegółów: powiększony widok 8×8 pikseli, kod ekranu (dziesiętny + szesnastkowy), kody PETSCII (domyślne i przesunięte) oraz surową 8-bajtową mapę bitową. |
| Panel szczegółów   | Pokazuje kod ekranowy wybranego glifu, kody PETSCII i osiem surowych bajtów — gotowych do wklejenia do bloku `RAWBYTES` lub BYTE.                                                                                                                |
| Tylko do odczytu   | Tutaj nie ma możliwości edycji — do modyfikacji glifów użyj Edytora znaków (poniżej).                                                                                                                                                            |

### Edytor znaków (zestaw znaków)

Edytor znaków 8×8 o pojemności 256 znaków. Otwórz przez Toolkit → Edytor znaków.

| Funkcja                         | Opis                                                                                                                                                                                                                                                                        |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Załaduj ROM                     | Ładuje ROM ze znakami C64 — dokładnie glify 901225-01, bez selektora plików. Pierwszy przycisk (i **Pliki → ROM: wielkie litery / grafika **) ładuje zestaw 1, drugi przycisk (lub Shift + kliknięcie, lub **Pliki → ROM: małe litery / wielkie litery **) ładuje zestaw 2. |
| Załaduj `.bin`                  | Importuje zewnętrzny plik binarny z zestawem znaków o rozmiarze 2048 bajtów.                                                                                                                                                                                                |
| Podgląd na znak                 | 16-szeroka siatka wszystkich 256 glifów z podświetloną bieżącą komórką.                                                                                                                                                                                                     |
| Edytor pikseli                  | Edytuje wybrany znak lub **kafelek** 2×1, 1×2 lub 2×2 sąsiadujących znaków jako jeden obraz (selektor kafelków).                                                                                                                                                            |
| Narzędzia do rysowania          | Ołówek, linia, prostokąt, wypełniony prostokąt i wypełnienie. Kliknięcie na piksel, który już ma tusz, usuwa go.                                                                                                                                                            |
| Transformuje                    | Wyczyść, odwróć, odbij poziomo/pionowo, przesuń z zawijaniem, obróć o 90° zgodnie z ruchem wskazówek zegara/przeciwnie do ruchu wskazówek zegara (tylko kwadratowe kafelki) — na całym kafelku.                                                                             |
| Cofnij / Ponów                  | Przyciski paska narzędzi: Ctrl+Z i Ctrl+Y (Ctrl+Shift+Z).                                                                                                                                                                                                                   |
| Kopiuj/Wklej                    | Przyciski paska narzędzi, Ctrl+C / Ctrl+V lub kliknięcie prawym przyciskiem myszy na mapie; kopiuje cały kafelek wraz z jego kolorami.                                                                                                                                      |
| Przeciąganie mapy               | Przeciągnij jedną postać na inną na mapie, aby je zamienić; Shift+przeciągnij kopie.                                                                                                                                                                                        |
| Podgląd tekstu                  | Wpisz tekst, aby zobaczyć go w aktualnym zestawie znaków. Wybierz mapowanie wielkich lub małych liter; `{65}` lub `{$41}` wstawia kod ekranu.                                                                                                                               |
| Eksport zakresu                 | Ustaw znaki Od/Do, następnie **Pliki → Zapisz zakres (.bin)** (surowe bajty) lub **Kopiuj zakres ASM** (wiersze `.byte`).                                                                                                                                                   |
| Kolor na znak                   | Przechowuje domyślną wartość pamięci RAM koloru dla każdego glifu. W trybie znaków wielokolorowych zachowuje również bit aktywacji wielokoloru dla każdej komórki oraz własny, 3-bitowy kolor znaku.                                                                        |
| Podróż w obie strony metadanych | Podczas ładowania zgodnych danych z przepływów pracy Charset Canvas/Map, metadane dotyczące koloru dla każdego znaku są zachowywane, dzięki czemu można kontynuować edycję bez utraty zamierzenia kolorystycznego.                                                          |
| Eksportuj bloki                 | Dodaje RAWBYTES pod numerem $0800 (blok 2) lub $3800 (blok 7) z zakodowanym zestawem znaków.                                                                                                                                                                                |

### Edytor płótna zestawu znaków

Malarz pełnego zestawu znaków do tworzenia ekranów z kompletnego, 256-znakowego
zestawu znaków. Otwórz przez Toolkit → Charset Canvas.

Płótno ma wymiary 16×16 znaków i 128×128 pikseli. W trybie wielokolorowym każdy
znak jest albo wielokolorowy (szerokie piksele, 4 kolory), albo w wysokiej
rozdzielczości (8 wąskich pikseli, 2 kolory), dokładnie tak jak na C64.

| Funkcja                                        | Opis                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                                                |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Mono / wielokolorowy                           | Tryb monochromatyczny przechowuje 1-bitowe glify 8×8. Tryb wielokolorowy przechowuje dwubitowe pary pikseli poziomych i oznacza komórki wielokolorowe bitem 3 pamięci Color RAM.                                                                                                                                                                                                                                                                                                                                                          |                                                |
| Narzędzie trybu znakowego                      | W trybie wielokolorowym kliknij lub przeciągnij nad postaciami, aby przełączać je między trybem wielokolorowym a trybem wysokiej rozdzielczości (bit 3 pamięci RAM kolorów). Kształt jest zachowany: ustawiona para pikseli staje się kolorem postaci. Postać w trybie wysokiej rozdzielczości ma tło i swój własny kolor (0–7); MC1/MC2 nie maluje w tym trybie.                                                                                                                                                                         |                                                |
| Tło                                            | Lista rozwijana BG jest wyświetlana również w trybie monochromatycznym; MC1/MC2 tylko w trybie wielokolorowym.                                                                                                                                                                                                                                                                                                                                                                                                                            |                                                |
| ECM                                            | Pole wyboru **ECM** (rozszerzony tryb kolorów, nie w połączeniu z wielokolorowym): każdy znak jest w wysokiej rozdzielczości, ma własny kolor (0–15) i jedno z czterech teł BG0–BG3 (`$D021`–`$D024`; BG1/BG2 to rejestry MC1/MC2). Wybierz kolor tła z palety (oznaczony tagami B0–B3), a następnie kliknij lub przeciągnij po znakach za pomocą narzędzia **Tło znaku**. Zmieści się tylko 64 różnych znaków: linia stanu je zlicza, a zapisywanie łączy równe znaki — zestaw znaków to 64 znaki (512 bajtów), a kody ekranowe to `glif | tło << 6`. Włącz ECM za pomocą `$D011` bitu 6. |
| Model kolorów C64                              | Tło wykorzystuje `$D021`; współdzielony wielokolorowy 1 wykorzystuje `$D022`; współdzielony wielokolorowy 2 wykorzystuje `$D023`; kolor każdego znaku pochodzi z bitów 0–2 pamięci RAM kolorów.                                                                                                                                                                                                                                                                                                                                           |                                                |
| Narzędzia do rysowania                         | Ołówek, gumka, linia, prostokąt, owal i wypełnienie działają niezależnie od granic znaków.                                                                                                                                                                                                                                                                                                                                                                                                                                                |                                                |
| Narzędzie do rozpylania                        | Rysunek w stylu aerografu, w którym piksele są rozrzucane po sąsiadujących komórkach/znakach.                                                                                                                                                                                                                                                                                                                                                                                                                                             |                                                |
| Intensywność rozpylania                        | Lista rozwijana obok narzędzia natryskowego umożliwia ustawienie gęstości pociągnięć.                                                                                                                                                                                                                                                                                                                                                                                                                                                     |                                                |
| Przełącznik siatki                             | Pole wyboru Siatka pozwala wyświetlić lub ukryć siatkę znaków 16×16.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                                                |
| Brzęczenie                                     | Suwak powiększenia (2×–24×, całe piksele urządzenia na piksel C64) lub Ctrl + kółko na płótnie; powiększenie jest zapamiętywane. Od 8× Siatka rysuje również cienką linię na krawędzi każdego piksela.                                                                                                                                                                                                                                                                                                                                    |                                                |
| Zapisz zestaw znaków `.bin`                    | Zapisuje dane mapy bitowej znaków o rozmiarze 2048 bajtów.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |                                                |
| Zapisz mapę 16×16 + kolorową pamięć RAM `.bin` | Zapisuje 256 kodów ekranowych, a następnie 256 wartości pamięci RAM kolorów. Użyj tego z `MAP_COPY16X16`.                                                                                                                                                                                                                                                                                                                                                                                                                                 |                                                |
| Załadunek                                      | Można wczytać zapisane zestawy znaków z płótna, zwykłe dane zestawu znaków i zgodne dane zestawu znaków edytora znaków, w tym zapisane kolory dla każdego znaku, jeśli są dostępne.                                                                                                                                                                                                                                                                                                                                                       |                                                |

**Ważne ograniczenie C64: ** w trybie wielokolorowym dwa współdzielone kolory są
globalne dla całego ekranu (`$D022` / `$D023`). Tylko kolor własny znaku jest
wyświetlany na komórkę i jest ograniczony do kolorów 0–7, ponieważ bit 3 pamięci
kolorów wybiera tryb wielokolorowy. Zatem jeden znak wyświetla maksymalnie **4
kolory** (tło, MC1, MC2 i własny kolor), a cały ekran maksymalnie 3 + 8. W
palecie współdzielone kolory są oznaczone jako BG / 1 / 2, a kolory 8–15, które
nie są współdzielone, są przyciemniane. Wybranie takiego koloru umieszcza go
tylko w rejestrze MC2 lub MC1, dopóki żaden piksel nie korzysta z tego rejestru;
w przeciwnym razie zmień go na liście rozwijanej (co spowoduje zmianę koloru
całego ekranu). W trybie wysokiej rozdzielczości (mono) postać ma 2 kolory:
kolor tła i swój własny kolor (0–15).

### Edytor map (mapy kafelkowe wielowarstwowe)

Warstwowy edytor map kafelkowych do statycznych scenerii, map pojawiania się
sprite'ów, danych o kolizjach i podobnych. Otwórz przez Toolkit → Edytor map.

| Funkcja                                               | Opis                                                                                                                                                                                                                                                                                                       |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Warstwy                                               | Wiele nazwanych warstw, każda z własnym zestawem kafelków i kryciem.                                                                                                                                                                                                                                       |
| Pędzle                                                | Tryby pojedynczego kafelka, wypełnienia, linii, prostokąta i okręgu. Narzędzia kształtów wyświetlają podgląd na żywo podczas przeciągania; zwolnij, aby zatwierdzić.                                                                                                                                       |
| Cofnij / ponów                                        | Pełny stos cofania/ponawiania dla każdej warstwy. Ctrl/Cmd+Z / Ctrl/Cmd+Y lub przyciski paska narzędzi.                                                                                                                                                                                                    |
| Wyczyść menu                                          | Wyczyść pojedynczą warstwę lub całą mapę z potwierdzeniem.                                                                                                                                                                                                                                                 |
| Importowanie obrazu                                   | Upuść plik PNG mapy kafelkowej, a edytor automatycznie podzieli ją na kafelki.                                                                                                                                                                                                                             |
| Kopiuj/wklej                                          | Skopiuj wybrany obszar kafelka, a następnie wklej go normalnie lub użyj przezroczystego wklejania, aby puste kafelki pozostały przezroczyste. Te same wpisy znajdują się w menu kontekstowym płótna.                                                                                                       |
| Kolorowanie kafelków z uwzględnieniem wielu kolorów   | Jeśli metadane zestawu znaków są zgodne, malowanie wykorzystuje domyślne ustawienia kolorów zapisane w pamięci RAM kafelka (w tym kodowanie wielokolorowe) zamiast ogólnego, jednolitego koloru.                                                                                                           |
| Niestandardowe kolory zestawu znaków                  | Jeśli zestaw znaków zawiera metadane `charColors`, Edytor map używa domyślnej wartości pamięci RAM kolorów wybranego kafelka podczas malowania.                                                                                                                                                            |
| Eksportuj bloki                                       | Emitują bloki RAWBYTES dla grafiki kafelkowej + danych mapy.                                                                                                                                                                                                                                               |
| Zapisz pamięć RAM ekranu (.bin)…                      | Zapisuje tylko kody ekranowe dla bieżącej warstwy mapy (40×25 = 1000 bajtów).                                                                                                                                                                                                                              |
| Zapisz pamięć RAM ekranu + pamięć RAM kolorów (.bin)… | Zapisuje kody ekranowe połączone z wartościami pamięci RAM kolorów jako pojedynczy plik o rozmiarze 2000 bajtów (`screen[0..999]`, a następnie `color[0..999]`). Użyj tego z makrem **MAP_COPY** (połączony tryb .bin), aby przywrócić zarówno ekran, jak i kolory w jednej operacji w czasie wykonywania. |

### Edytor poziomów

Łączy ekrany **Edytora Map** w jeden poziom – strzelankę pionową, grę
samochodową z przewijaniem w dół, grę z widokiem z boku lub mapę 2D – i
wyświetla podgląd całego poziomu za pomocą płynnego przewijania. Otwórz go
przyciskiem **Edytora Poziomów** na pasku narzędzi obok Edytora Map.

| Funkcja           | Opis                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Układ             | **Pionowo**, **Poziomo** lub **Siatka** (wiersze × kolumny, z przyciskami dodawania/usuwania wierszy i kolumn).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Ekrany            | **Nowy pusty ekran**, **Dodaj z Edytora Map** (aktualnie otwarta mapa) lub **Załaduj mapę(y) (.bin)…** (kilka eksportów Edytora Map jednocześnie). Przeciągnij ekran z listy na slot; przeciągnij sloty na siebie, aby je zamienić.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Redagowanie       | **Edytuj w Edytorze map** otwiera wybrany ekran w Edytorze map i przywraca zmiany: duplikuj, przesuń w górę/lewo lub w dół/prawo, usuń; cofnij/ponów.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Zapowiedź         | Przeciągnij podgląd lub użyj klawiszy strzałek, aby przewijać piksel po pikselu; **Odtwórz** przewija automatycznie (kierunek, prędkość 1–8, pętla), spacja = odtwarzanie / zatrzymanie. *Granice* oznaczają granice ekranu.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Czeki             | Informacje o zestawie znaków i ostrzeżenie, gdy ekrany używają innego zestawu znaków lub kolorów (poziom korzysta z ustawień pierwszego ekranu).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Atrybuty postaci  | Przycisk **Atrybuty postaci** przełącza podgląd na malowanie atrybutów: wybierz **Solid**, **Ladder**, **Hazard** lub **Collectible**, kliknij postać, a każda komórka z tym kodem ekranowym otrzyma go (lub utraci); przeciągnij, aby uzyskać więcej kodów. Atrybuty są wyświetlane jako kolorowa warstwa i stają się 256-bajtową tabelą `LEVEL_ATTR` (`LEVEL_ATTR_SOLID` = 1, `_LADDER` = 2, `_HAZARD` = 4, `_COLLECT` = 8).                                                                                                                                                                                                                                                                                                                                                                                            |
| Kontrola krawędzi | Czerwone znaczniki, gdzie sąsiednie ekrany nie są kontynuowane: jedna strona obramowania pusta (spacja), a druga nie, lub jednostronnie wypełniona. Panel boczny zlicza krawędzie i komórki.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Zabarwienie       | **Obramowanie poziomu** i **Własne kolory dla tego ekranu** (tło, obramowanie, wielokolorowe 1/2) dla wybranego ekranu; ramka podglądu pokazuje obramowanie. Eksportowane dla każdego slotu jako `LEVEL_SCR_BG / _BORDER / _MC1 / _MC2` (z `LEVEL_SCR_COLORS` = 1), gdy umieszczony ekran ma własne kolory.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Pamięć            | Rozmiar danych `.level` pod wybranym adresem (obliczony dokładnie tak, jak kompiluje go makro), z ostrzeżeniami dotyczącymi ROM-u BASIC/KERNAL, obszaru wejścia/wyjścia i pamięci poniżej `$0800` oraz rozmiaru RLE poziomu. Polecenie **Eksportuj RLE do bloków / Kopiuj RLE asm** daje poziom RLE spakowany za pomocą rozpakowywacza `level_unrle` (`($FB)` → `($FD)`).                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Bieg w VICE       | Buduje program testowy przewijany joystickiem z poziomu (przewijacz `level-demo`, kod w `$C000`, dane poziomu z `$2000`, niestandardowy zestaw znaków w `$2000`) i uruchamia go w VICE — kolory ekranu zmieniają się, gdy ekran znajduje się w lewym górnym rogu widoku, kamera rozpoczyna pracę od pierwszego obiektu startowego.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Obiekty           | Przycisk **Warstwa obiektów** przełącza podgląd na edycję obiektów: wybierz typ (Start, Wróg, Przedmiot, Drzwi, Wyjście, Wyzwalacz) i bajt **Parametru** (rodzaj wroga, identyfikator przedmiotu, cel drzwi…), kliknij, aby umieścić, przeciągnij, aby przesunąć (przyciągane do 8 pikseli, Shift = swobodny), kliknij obiekt, aby go zaznaczyć i zmienić jego typ/parametr, klawisze strzałek przesuwają go, a klawisz Delete usuwa. Obiekty należą do pozycji na poziomie, a nie do ekranu. Są one wymienione na pasku bocznym, wyświetlane w podglądzie, zapisywane wraz z poziomem i eksportowane w kolejności przewijania (pionowo według osi Y, poziomo według osi X, wiersz po wierszu siatki) jako tabele `LEVEL_OBJ_*` — za pomocą polecenia **Kopiuj asm / Eksportuj do bloków** oraz za pomocą makra `.level`. |

**Menu Pliki: **
| Działanie                                                               | Co to robi                                                                                                               |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Nowy poziom** / **Otwórz poziom (.bin)…** / **Zapisz poziom (.bin)…** | Projekt poziomu: wszystkie ekrany plus układ. To jest plik odczytany przez makro `.level` i `map load` z Ultimate Basic. |
| **Zapisz poziom Ekran RAM (.bin)…**                                     | Cały poziom jako jedna mapa postaci (tylko kody ekranowe).                                                               |
| **Zapisz poziom Ekran + Kolor RAM (.bin)…**                             | Cały kod ekranu poziomu wraz z jego kolorami.                                                                            |
| **Eksportuj do bloków** / **Kopiuj asm**                                | Dane poziomu jako bloki lub jako tekst asm (schowek).                                                                    |

**Używanie poziomu:** w asemblerze, `.level "level.bin"` + `.level_row` (patrz
[LEVEL / LEVEL_ROW](#level--level_row) i `samples/level-demo.asm`); w Ultimate
Basic 1.6.1+, `ładowanie mapy "level.bin", $4000` i `widok mapy px, py`
(przykład `level_scroll_demo.ub`).

### Edytor SID (śledzenie 3-głosowe)

Wieloinstrumentalny, 3-głosowy tracker. Otwórz przez Toolkit → Edytor SID.
**Odtwarzanie: Wszystkie** uruchamia wyeksportowany odtwarzacz 6502 w emulatorze
WebSid; każdy inny podgląd (podgląd instrumentu, klawiatura wirtualna,
wprowadzanie nut, akord/arpeggio, wiersz i odtwarzanie pojedynczego wzorca)
również odtwarzany jest na emulowanym SID: model JS tego samego odtwarzacza
(klatka po klatce) przesyła strumieniowo swoje rejestry SID do WebSid w każdej
klatce, a maksymalnie trzy nuty podglądu współdzielą trzy głosy. Odtwarzacz
strumieniowy jest ładowany po otwarciu edytora i ponownie po zatrzymaniu, więc
nuty brzmią jednocześnie; bez WebSid odtwarzany jest mały syntezator SID.

**Silnik podglądu: ** **Ustawienia → Podgląd SID** wybiera **WebSID** lub **VA
SID Core (Rust)**, własną emulację SID aplikacji; w przypadku VA SID Core
wybiera się również układ (MOS 6581/8580). Parametry instrumentu ustawia się za
pomocą pokręteł.

**Sterowanie na instrument:**
- Pola wyboru przebiegów (TRI / SAW / PUL / NOI) — wiele przebiegów jest
  łączonych logicznie jak w SID — plus **RING** (modulacja pierścieniowa
  trójkąta przez poprzedni głos: 1 ← 3, 2 ← 1, 3 ← 2) i **SYNC** (twarda
  synchronizacja z poprzednim głosem).
- ADSR (atak / zanik / podtrzymanie / uwolnienie) wyświetlane w formie wykresu
  przeciąganego nad czterema suwakami.
- Suwak szerokości impulsu (0-4095).
- **Filtr: ** *Przeprowadź ten głos przez filtr *, LP / BP / HP i **3 WYŁ. **
  (wycisz głos 3, gdy nie jest przekierowywany), odcięcie, rezonans, głośność.
  **Koniec ** + **Przemiatanie ** Przesuń odcięcie z cięcia do końca o
  przemiatanie na klatkę; **Ping-pong ** odbija się między nimi — to właśnie
  powoduje rezonansowe przemiatanie filtra. Głos, który uruchamia instrument
  przekierowywany przez filtr, posiada filtr (odcięcie, rezonans, mod); każdy
  głos, którego instrument jest przekierowywany, przechodzi przez niego.
- **Vibrato:** po ramkach **Delay** trójkątny LFO obraca się co **Speed** ramek,
  **Depth** 0-15 skalowane do półtonu nuty (niezależnie od efektu `V`).
- **Modulacja szerokości impulsu: ** **Prędkość ** dodawana do szerokości
  impulsu w każdej klatce, zmieniająca się między **Min** a **Maks.**.
- **Bramka:** **Czasomierz bramki** zwalnia bramkę o tyle klatek przed następną
  nutą w głosie (utrzymuje ją poniżej prędkości); **Twardy restart** zeruje
  wtedy ADSR, zapewniając czysty atak; **Pierwsza klatka** zapisuje przebieg na
  pierwszej klatce nuty (np. `$09` test + bramka).
- **Tabela fal/arpeggio:** do 32 kroków przebiegu (— = zachowaj) i nuty
  (przesunięcie w półtonach lub **abs** = nuta absolutna), jeden krok co
  **Prędkość** klatek, **Pętla** powrót do kroku lub zatrzymanie na ostatnim
  kroku. **Presety** (25, w grupach; lista zachowuje wybrany preset, dopóki
  tabela nie zostanie ręcznie edytowana): arpeggia (durowe, molowe, septymowe,
  sus4, zmniejszone, zwiększone, akord mocy, oktawa, trel), perkusje (stopa,
  werbel, tom, klaskanie, zamknięty/otwarty hi-hat), ataki ołowiane i basowe
  oraz efekty dźwiękowe (laser, pickup, wybuch).

**Siatka śledzenia: **
- 3 głosy × do 7 wzorów × 32 wiersze = 7 × 32 = maksymalnie 224 wiersze
  (ograniczenie zapewnia 8-bitowy licznik wierszy).
- Na wiersz: nuta + indeks instrumentu, plus opcjonalny efekt (patrz **Kolumna
  efektów** poniżej). Puste wiersze zawierają poprzednią nutę: podobnie jak w
  innych trackerach (GoatTracker, SID-Wizard), nuta utrzymuje swoją bramkę
  (poziom podtrzymania) do następnej nuty w tym samym głosie lub **wyłączenia
  nuty**.
- **Enter** (lub dwukrotne kliknięcie) edytuje wybraną komórkę jako tekst (`C-4
  01 V24`); **Enter** zapisuje i przechodzi do następnego wiersza, **Esc**
  anuluje.
- **Note-off** (`===`): klawisz **1** (lub `` ` `` / `=`), albo wpisz `===` /
  `OFF` w komórce. Zwalnia bramkę, więc zwolnienie instrumentu działa — tak samo
  jak efekt `C` bez nuty (zapisany i wyeksportowany jako `C00`).
- Zaznacz jedną komórkę normalnie lub przytrzymaj klawisze **Shift** podczas
  klikania lub używania klawiszy strzałek, aby rozszerzyć prostokątne
  zaznaczenie na wiersze i dowolny z trzech głosów. Kliknięcie prawym
  przyciskiem myszy w zaznaczonym obszarze zachowuje zakres.
- Kopiuj, Wytnij, Wklej i Wyczyść są dostępne na pasku narzędzi ikon i w menu
  kontekstowym opartym na ikonach. `Ctrl/Cmd+C` i `Ctrl/Cmd+V` działają na tym
  samym prostokątnym zaznaczeniu.
- Pomocnik harmonii: wybierz nutę podstawową, rodzaj akordu i oktawę, odsłuchaj
  akord z bieżącym instrumentem, a następnie wstaw brzmienie bezpośrednio do
  trackera. Dostępne typy to: dur, mol, zmniejszony, zwiększony, Sus2, Sus4,
  dominanta 7, dur 7, mol 7, 6, mol 6, 9, b9, #9, Dim7 i 7sus4.
- Pomocnik arpeggio: podgląd lub wstawianie przebiegów nutowych składających się
  z 4, 8 lub 16 kroków od wybranego akordu w kierunku w górę, w dół lub w górę/w
  dół.
- **Podgląd wiersza** umożliwia odsłuchanie wybranego wiersza we wszystkich
  trzech głosach bez rozpoczynania odtwarzania wzorca.
- Wklejanie zakresu komórek rozpoczyna się teraz od wybranej komórki początkowej
  zakresu i kończy się na granicach wiersza lub głosu, zamiast przechodzić do
  następnej kolumny lub wiersza.
- Suwak prędkości ustawia dzielnik cykli IRQ (liczba klatek pomiędzy wierszami).

**Lista utworów / kolejności:**
- Wzory są ustalane na podstawie listy piosenek/kolejności umieszczonej na
  wierzchu banku surowych wzorów — ten sam wzór może się powtarzać, a piosenka
  może być dłuższa od liczby zapisanych wzorów.
- Dodawaj, usuwaj i zmieniaj kolejność kroków na panelu listy utworów. Podczas
  odtwarzania bieżący krok jest podświetlany.
- Zarówno odtwarzanie w aplikacji, jak i każdy eksport przechodzą przez tę
  listę, a nie surowa kolejność wzorców — eksporty wykonane przed powstaniem
  listy kolejności nadal ładują się prawidłowo jako zwykły utwór 0..N-1.

**Kolumna efektów:** Każda komórka może zawierać jeden efekt obok nuty i
instrumentu, wprowadzony jako krótki kod zaraz po nucie (np. `C-4 01 V24`) lub
osobno w przypadku wiersza efektów bez nut (np. `F06`):

| Kod | Efekt                       | Wartość                                                               |
| --- | --------------------------- | --------------------------------------------------------------------- |
| `V` | Wibrato                     | niskie skubnięcie = głębokość, wysokie skubnięcie = długość trzymania |
| `U` | Przesuń w górę (portamento) | kwota dodana do częstotliwości każdego wiersza                        |
| `D` | Zsuwanie w dół (portamento) | kwota odjęta od częstotliwości każdego wiersza                        |
| `C` | Notatka ucięta              | ucisza głos bez ponownego uruchamiania; wartość nieużywana            |
| `F` | Zmiana prędkości            | nowa wartość liczby klatek na wiersz, obowiązuje natychmiast          |

Efekty aktualizują się raz na wiersz (zgodnie z synchronizacją eksportowanego
odtwarzacza), działają identycznie w podglądzie Web Audio i skompilowanym
eksporcie 6502 oraz są zapisywane/ładowane bezstratnie w wersjonowanym formacie
`.bin`.

**Odtwarzanie i klawiatura wirtualna:**
- Przycisk Odtwórz na pasku narzędzi zmienia się na Wstrzymaj podczas
  odtwarzania i na Wznów po wstrzymaniu. Przycisk Zatrzymaj kończy odtwarzanie i
  resetuje stan.
- Przycisk na pasku narzędzi klawiatury otwiera **VA-VK**, pianino niemodalne
  (2, 3 lub 4 oktawy; pozycja, stan otwarcia, oktawa i *Wstaw do trackera* są
  zapamiętywane) z własnymi przyciskami **Odtwarzaj/Stop**, które pozostają
  dostępne, gdy edytor SID jest aktywny. Przeciągnij jego nagłówek, aby umieścić
  go w dowolnym miejscu w aplikacji głównej.
- Włącz opcję **Wstaw do trackera**, aby zapisać każdą zagraną nutę przy
  aktualnym kursorze trackera i przejść do następnego wiersza. Wyłącz tę opcję,
  aby odsłuchiwać nuty bez edycji.
- Podgląd akordów i arpeggio podświetla odpowiadające im klawisze fortepianu,
  gdy klawiatura jest otwarta.

**Nagrywanie, metronom i MIDI:**
- **Record** (czerwona kropka na pasku narzędzi trackera i na VA-VK) zapisuje
  nuty grane na VA-VK, klawiaturze komputera lub MIDI w tempie wybranego głosu,
  zaczynając od wybranego wiersza i z aktualną prędkością. Po zapełnieniu
  schematu, po bieżącym kroku utworu dodawany jest nowy, pusty schemat i tam
  rozpoczyna się nagrywanie. Naciśnij ponownie przycisk Record, aby zatrzymać.
- **Metronom** (pasek narzędzi trackera i VA-VK) klika co 4 wiersze, akcentując
  pierwsze uderzenie każdego 4-uderzenia taktu. Lampki uderzeń obok niego migają
  przy każdym uderzeniu podczas odtwarzania i nagrywania, nawet gdy klik jest
  wyłączony.
- **MIDI:** wybierz wejście z listy **MIDI** obok nazwy instrumentu i naciśnij
  **Połącz MIDI**; nuty będą odtwarzane przez bieżący instrument (i zapisywane w
  trackerze podczas nagrywania lub za pomocą *Wstaw do trackera*). Lampka obok
  przycisku będzie migać przy każdej przychodzącej wiadomości MIDI.
- **Usuwanie wzoru:** przycisk **−** obok **Pat +** usuwa bieżący wzór (najpierw
  pyta, czy wzór zawiera nuty). Kroki utworu, które go używały, są usuwane, a
  pozostałe numerowane ponownie; zawsze pozostaje co najmniej jeden wzór.
- Pokrętło **regulacji głośności głównej ** znajduje się na VA-VK.

**Eksportowanie menu Pliki: **
| Eksport                           | Co to robi                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Zapisz .bin…`                    | Zapisuje natywny format serializowany edytora (instrumenty ze wszystkimi ustawieniami modulacji i nazwami, prędkością, wzorcami i melodią). Starsze zapisy nadal się ładują.                                                                                                                                                                                                                                      |
| `Eksportuj bloki (tylko dane)`    | Dodaje do programu tabelę instrumentów + bloki wzorców w punkcie `* = $C000`.                                                                                                                                                                                                                                                                                                                                     |
| `Eksport bloków + miniodtwarzacz` | Dodaje pełny odtwarzacz (sid_init / sid_irq / sid_frame / sid_play_row / sid_set_voice) oraz tabele częstotliwości PAL. Po wyeksportowaniu umieść `JSR sid_init` w kodzie głównym w miejscu, w którym ma się zaczynać muzyka; zamiast tego użyj własnego wywołania IRQ `JSR sid_frame` raz na klatkę.                                                                                                             |
| `Eksportuj asm (schowek)`         | Kopiuje cały kod źródłowy zestawu do schowka.                                                                                                                                                                                                                                                                                                                                                                     |
| `Importuj GoatTracker .sng…`      | Ładuje utwór GoatTracker 2 w miejsce bieżącego — patrz **Import GoatTracker** poniżej.                                                                                                                                                                                                                                                                                                                            |
| `Eksportuj do UltimateBasic`      | Zapisuje blok `tune ... end` (instrumenty, lista zamówień, wiersze wzorców jako tekst) oraz `music play` i wstawia go w miejscu kursora edytora Ultimate Basic; poza trybem UB kopiuje tekst do schowka. Kompilator UltimateBasic buduje odtwarzacz, więc steruje nim za pomocą `music play` / `music stop`. Modulacja instrumentu trafia do wierszy `imod` / `ifilt` / `igate` / `itab` (Ultimate Basic 1.6.2+). |

**Import GoatTracker:** **Pliki → Importuj GoatTracker .sng…** ładuje utwór
GoatTracker 2 (`.sng`, GTS3–GTS5) w miejsce bieżącego. Konwersja jest
przybliżona, ponieważ oba trackery działają inaczej:
- Listy kolejności dla każdego głosu (z transpozycją i powtórzeniem) są
  spłaszczane do jednej piosenki 3-głosowej i cięte na wzory składające się z 32
  wierszy; identyczne wzory są współdzielone.
- Instrumenty: przejmowane są AD/SR, pierwsza fala, timer bramki i twardy
  restart; tabela fal staje się tabelą fal/arpeggio, tabela impulsów PWM, tabela
  filtrów trybem filtru, rezonansem i odcięciem, a wejście tabeli prędkości
  staje się vibrato instrumentu.
- Polecenia wzorcowe: key off → note-off, portamento → `U` / `D` (maksymalnie
  255 na wiersz), tempo → `F`; toneporta staje się zwykłą nutą. Pozostałe
  polecenia są pomijane, a komunikat zawiera listę tego, co zostało przybliżone
  lub pominięte.
- Bramka zwolniona przez tablicę fal staje się nutą off w kolejnym wolnym
  wierszu. Importowany jest tylko pierwszy podmelodion, a limit eksportu 7
  wzorów nadal obowiązuje.

**Użycie ZP gracza: ** `$02`–`$1C` (wskaźniki wzorców, przesunięcie wzorca,
temperatura) i `$2F` (bieżąca prędkość), plus `$FB`–`$FD` (licznik taktów,
indeks wiersza, pozycja na liście zleceń). Stan głosu, modulacji i filtra
znajduje się w `sid_state` po danych. Bajty ZP powodują konflikt, jeśli korzysta
z nich kod główny — w razie potrzeby przenieś je w trybie eksperckim.

**Znane limity:**
- 8-bitowy licznik wierszy ogranicza każdy wzór do 7 wzorów × 32 wierszy w banku
  danych (lista utworów/kolejności może być nadal dowolnie długa poprzez
  powtarzanie wzorów).
- Globalna głośność C64 `$D418` jest współdzielona przez wszystkie głosy — suwak
  głośności dla każdego instrumentu ma charakter informacyjny; poziom
  podtrzymania (`S` ADSR) to efektywna głośność dla każdego głosu.
- Podczas gdy w trybie **Play: All** wczytany jest prawdziwy utwór (również w
  trybie pauzy), podglądy nut są przekierowywane do małego syntezatora, który
  jedynie przybliża układ SID. Podglądy docierają do WebSid około 0,1 s przed
  dźwiękiem.

---

**Eksportuj .sid (PSID)…** (menu Pliki) zapisuje utwór w odtwarzalnym
odtwarzaczu `$C000` jako standardowy plik PSID — można go odtworzyć w
odtwarzaczu SID, w programie VICE `vsid` i w dowolnym innym odtwarzaczu SID.

### Odtwarzacz SID

Przycisk paska narzędzi **SID Player** otwiera pływające okno, w którym
odtwarzane są pliki muzyczne `.sid` (PSID i RSID), na przykład utwory z kolekcji
HVSC.

- **Playlista:** dodawaj utwory za pomocą **dodaj pliki .sid…** lub upuszczając
  je na okno i kliknij utwór, aby go odtworzyć; **usuń** i **wyczyść playlistę**
  uporządkuj listę. **zapisz playlistę…** / **otwórz playlistę…** zapisz i
  odczytaj plik `.sidpl` z osadzonymi utworami. Zapamiętywana jest lista,
  bieżący utwór i informacja o otwarciu okna.
- **Transport:** Odtwarzanie, pauza, stop, **Poprzednia** / **Następna**
  melodia, **Poprzednia / Następna podmelodia** w przypadku plików z kilkoma
  utworami i licznik czasu.
- **Przeszukiwanie:** pasek pozycji i **Wstecz/Do przodu 10 s** działają z
  silnikiem VA SID Core. WebSID nie obsługuje przeszukiwania, więc te elementy
  sterujące są w nim wyłączone.
- **Głośność:** pokrętło jest współdzielone z głównym regulatorem głośności
  edytora SID.
- **Silnik:** okno pokazuje, który silnik odtwarza (WebSID czy VA SID Core wraz
  z jego wersją i chipem SID); wybierz go w **Ustawienia → Podgląd SID**. VA SID
  Core uruchamia utwór na natywnym rdzeniu Rust C64 z procesorem 6510 o
  dokładnym taktowaniu cyklicznym, precyzyjnym taktowaniem przerwań, CIA 6526A,
  taktowaniem VIC-II z błędnymi liniami, przerwaniami DMA i rastrowymi dla
  sprite'ów oraz portem wejścia/wyjścia 6510 — dzięki czemu utwory rastrowe z
  przerwaniami IRQ, taktowane przez CIA i cyfrowe odtwarzają się z taktowaniem
  prawdziwej maszyny.
- **Losowo: ** przycisk losowania obok **Następny** odtwarza playlistę w
  kolejności losowej — żaden utwór nie powtarza się, dopóki nie zostaną
  odtworzone wszystkie utwory, a **Poprzedni** cofa się w kolejności losowej.
  Ustawienie jest zapamiętywane.
- **Ulubione:** ☆ / ★ w każdym wierszu oznacza utwór. Jest on przechowywany w
  stanie zapisanym oraz na listach odtwarzania `.sidpl`.

---

### Edytor krzywych

Generuje gotowe do użycia tabele wyszukiwania `.byte` z krzywych matematycznych
— sinusoidalnych, wygładzających, trójkątnych/piłokształtnych/kwadratowych i
odbiciowych. Idealne do ruchu sprite'ów, efektów rastrowych, cykli kolorów i
dowolnych animacji opartych na wstępnie obliczonej tabeli. Otwórz za pomocą
ikony **Edytor krzywych** na górnym pasku narzędzi (obok przycisku Edytor SID).

**Krzywe: ** Sinus, Cosinus, Liniowa, Łatwe wejście/wyjście/Wejście/Wyjście
(Czworokątna i Sześcienna), Łatwe wejście/wyjście (Kołowa), Trójkątna,
Piłokształtna, Kwadratowa oraz Łatwe wejście/wyjście/Wejście/Wyjście odbicia.

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

Każde wyjście Kopiuj/Wstaw rozpoczyna się komentarzem nagłówkowym dokumentującym
krzywą, rzeczywisty zakres min./maks., liczbę wpisów i dokładne wykorzystanie
(które rejestrują każdy kanał tabeli).

**Podgląd: **
- **Wykres** — krzywa narysowana z wartością 0 na **górze** i maks. na **dole**,
  zgodna z konwencją sprite-Y/raster C64 (więc to, co widzisz, to to, co tabela
  generuje sprzętowo). Meta linijka pod wykresem pokazuje liczbę bajtów,
  rzeczywistą wartość minimalną/maksymalną wygenerowanych wartości oraz nazwę(y)
  krzywej.
- **Odbijająca się piłka** — animuje znacznik w tabeli z **Tempo** (5–240
  wartości/s). Przy tempie 50 odpowiada to jednej wartości na klatkę w systemie
  PAL (50 Hz), czyli jednemu `.wait_raster` krokowi na indeks. Przyciski
  Odtwórz/Pauza i Restart, zanikający ślad ostatnich ~24 pozycji oraz odczyt na
  żywo `Indeksu · Wartości`.

**Kopiuj/Wstaw:** dwie ikony paska narzędzi — **Kopiuj** umieszcza tabelę w
schowku; **Wstaw do edytora** dołącza tabelę (i czytnik, jeśli jest włączony)
jako bloki do bieżącego programu. Ponowne wstawienie **zastępuje** poprzednią
operację wstawiania w Edytorze krzywych zamiast układania duplikatów (działa w
trybie blokowym i eksperckim).

**Menu Pliki: **
| Działanie                                         | Co to robi                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Zapisz krzywą (.bin)…**                         | Zapisuje surowe bajty tabeli dokładnie tak, jak C64 odczytałby je za pomocą `INCBIN`. 16-bit: N bajtów niskich, po których następuje N bajtów wysokich.                                                                                                                                                                                                                                                                            |
| **Krzywa obciążenia (.bin)…**                     | Ładuje surowe bajty tabeli z powrotem do edytora, interpretowane zgodnie z bieżącą głębokością bitową (16 bitów: pierwsza połowa lo, druga połowa hi). Załadowana tabela jest wyświetlana bez zmian, dopóki którykolwiek z elementów sterujących krzywą nie wygeneruje nowej krzywej.                                                                                                                                              |
| **Eksportuj demo do bloków**                      | Dodaje kompletne, uruchamialne demo sprite'a: inicjalizację sprite'a, pętlę główną zsynchronizowaną z rastrem, osadzoną tabelę i dane sprite'a piłki. Przesunięcie X o 0–320 w punkcie stałym 8,8 z `$D010` MSB, podczas gdy tabela steruje sprite'em Y — dokładnie tak, jak w podglądzie edytora. Ponowny eksport zastępuje poprzednie wstawienie w edytorze krzywych.                                                            |
| **Eksportuj do UltimateBasic**                    | Zapisuje tabelę jako zainicjowaną tablicę Ultimate Basic — `var name = array(N)` (lub `array_word(N)` dla 16-bitów), a następnie `data name: …` wierszy — i wstawia ją w miejscu kursora edytora UB (poza trybem UB jest kopiowana do schowka). Etykieta staje się prawidłową nazwą UB pisaną małymi literami; indeksowanie tabeli następuje jako `name[i]`. Wymagany jest Ultimate Basic w wersji 1.5.8 lub nowszej (w pakiecie). |
| **Eksportuj wersję demonstracyjną UltimateBasic** | Tworzy kompletny, gotowy do uruchomienia program UB: sprite'a piłki (`sprdef 0`), tabelę oraz pętlę zsynchronizowaną z rastrem, która odtwarza jeden wpis tabeli na klatkę. Tabele 8-bitowe sterują sprite'em **Y**, podczas gdy X wykonuje ruch od 0 do 320; tablice 16-bitowe (0 do 320) sterują sprite'em **X**, podczas gdy Y wykonuje ruch od 0 do 200. Tabele dłuższe niż 256 wpisów odtwarzają swoje pierwsze 256.          |

**Dopasowanie podglądu na C64: ** podgląd odczytuje tabelę **liniowo, zapętlając
0 → N-1 → 0, jedna wartość na klatkę **. Aby odtworzyć to dokładnie, należy
sterować tabelą w ten sam sposób (zwiększać indeks raz na klatkę, przewijać na
całej długości tabeli). Odtwarzanie ping-pongowe lub częściowe będzie przebiegać
inaczej, mimo że wartości bajtów są identyczne. Zobacz
`samples/curve-new-demo.asm`, aby uzyskać działający 16-bitowy przykład
sprite-X.

---

### Generator tabel

Przycisk **Generator tabel ** na pasku narzędzi (ikona siatki, obok edytora
krzywych) tworzy tabele odnośników i speedcode. Wybierz typ tabeli, ustaw jej
parametry i obejrzyj podgląd; linia meta pokazuje liczbę wpisów, rozmiar i
zakres wartości (dla kodu: bajty i szacowane cykle / linie rastrowe).

| Typ                                   | Wartości                                                                                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Adresy wierszy ekranu                 | podstawa + 40 · wiersz (dowolna podstawa i długość wiersza)                                                                     |
| Adresy wierszy mapy bitowej           | piksel Y → adres bajtu w kolumnie 0 (układ komórek 8 × 8)                                                                       |
| Przesunięcia kolumn mapy bitowej      | piksel X → przesunięcie bajtu w linii (hires lub wielokolorowe)                                                                 |
| Maska bitowa pikseli                  | X → maska bitowa (wynajmowana / wielokolorowa, opcjonalnie odwrócona dla `AND`)                                                 |
| Mnożenie/dzielenie/reszta przez stałą | x · k, ⌊x / k⌋, x mod k                                                                                                         |
| Ćwiartki kwadratów                    | ⌊(x − offset)² / 4⌋, 512 wpisów — a · b = sqr(a + b) − sqr(a − b)                                                               |
| Odwrotność                            | ⌊N / x⌋                                                                                                                         |
| Logarytm / wykładniczy                | zaokrąglij(log2 x · s), zaokrąglij(2^(x / s))                                                                                   |
| Bit odwrotny                          | odwraca bajt (lub pary bitów w przypadku kolorów wielokolorowych), aby odzwierciedlić sprite’y i znaki                          |
| Wyrażenie niestandardowe              | dowolna formuła `i` (`k` = indeks od 0, `n` = count); `sin`, `cos`, `abs`, `min`, `max`, `round`, `floor`, `PI`, `$hex`, `%bin` |
| Speedcode: wypełnij / skopiuj pamięć  | podprogram; *zapisów na iterację* 0 = całkowicie rozwinięty, N = pętla X z N zapisami na przejście                              |

Wartości powyżej 255 stają się parą tablic **lo/hi** (`label_lo`, `label_hi`)
lub tablicą `.word`; wartości ujemne są uzupełnieniem do dwóch. Opcje: etykieta,
szesnastkowy/dziesiętny, wartości na wiersz, **Wyrównaj do strony** (`.align
256`, unika cyklu przechodzenia między stronami). **Kopiuj** umieszcza zespół w
schowku; **Insert** dodaje ją do programu (ponowne wstawienie tej samej etykiety
zastępuje poprzednią kopię) — w trybie Ultimate Basic wstawia `tablicę` z
wierszami `danych`. Menu Pliki zapisuje również tabelę jako `.bin` (najpierw
bajty, potem bajty górne) i eksportuje ją do Ultimate Basic.

### Konwerter liczb

Mały konwerter DEC/HEX/BIN **niemodalny **, otwierany przyciskiem na pasku
narzędzi obok edytora D64 (kliknij ponownie lub naciśnij Esc, aby zamknąć).
Przycisk pozostaje podświetlony, gdy konwerter jest widoczny. Pozostaje otwarty
podczas edycji programu w dowolnym trybie.

- Wpisz w dowolne z pól **DEC**, **HEX** lub **BIN**, a pozostałe dwa zostaną
  wypełnione. Akceptowane są prefiksy `$`, `0x`, `%`, `0b` oraz separatory
  (spacja, `_`); ujemna liczba dziesiętna staje się uzupełnieniem do dwóch w
  bieżącej szerokości; nieprawidłowe dane są oznaczone na czerwono.
- Szerokość **8 / 16 bitów** — wartość powyżej 255 automatycznie przełącza się
  na 16 bitów.
- **Wiersz bitów** — kliknij bit, aby go przełączyć.
- Wiersz informacyjny pokazuje wartość **signed**, a w trybie 16-bitowym bajt
  **low** i **high**.
- Przyciski **Kopiuj** kopiują wartość z jej prefiksem (`53280`, `$D020`,
  `%1101000000100000`).
- Przeciągnij go za nagłówek. Zapamiętuje on swoją wartość, szerokość i pozycję
  i otwiera się ponownie po ponownym uruchomieniu, jeśli był otwarty w momencie
  zamykania.

---


*© 2026 Zsolt Tarczali — Asembler wizualny C64*
