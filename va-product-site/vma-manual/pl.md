# VMA — Visual Macro Assembler

Podręcznik językowy · wersja 2.1.0

VMA to asembler 6502/6510 języka [C64 Visual
Assembler](https://github.com/zstarczali/VisualAssembler) — języka trybu
eksperckiego i języka, w którym zapisywane są programy blokowe. Niniejszy
podręcznik opisuje ten język; edytor, paleta bloków i inne narzędzia aplikacji
znajdują się w podręczniku C64 Visual Assembler.

## Zawartość

1. [Format źródłowy](#1-format-zrod-owy)
2. [Liczby i wyrażenia](#2-liczby-i-wyrazenia)
3. [Wyjście: PRG, szczątkowy moduł BASIC i punkt
   wejścia](#3-wyjscie-prg-szczatkowy-modu-basic-i-punkt-wejscia)
4. [Tryby adresowania](#4-tryby-adresowania)
5. [instrukcje 6502](#5-instrukcje-6502)
6. [Dyrektywy i makra — odniesienie](#6-dyrektywy-i-makra-odniesienie)
7. [Składnia w stylu KickAssembler](#7-sk-adnia-w-stylu-kickassembler)
8. [Wiersz poleceń](#8-wiersz-polecen)
9. [Znane ograniczenia](#9-znane-ograniczenia)

---

## 1. Format źródłowy

Źródło VMA to zwykły tekst, jedno polecenie w wierszu. Wielkość liter nie ma
znaczenia w przypadku mnemoników i dyrektyw (`lda`, `LDA`, `.BYTE`, `.byte`);
nazwy etykiet uwzględniają wielkość liter.

```
; a comment — so is // a comment
* = $1000                ; ORG: assemble from $1000
start:                   ; a label (the colon is required)
    lda #$06             ; an instruction: mnemonic and operand
    sta $D020
    .byte $01, $02, $FF  ; a directive starts with a dot
loop: dex                ; a label and an instruction on one line
    bne loop
    rts
```

-Komentarze zaczynają się od `;` lub `//` i biegną do końca wiersza (nie do
  wewnątrz cudzysłowu).
-Etykiety zapisuje się jako `nazwa:` — litery, cyfry i `_`, nie zaczynając
  od cyfry. Etykieta może znajdować się w osobnym wierszu lub przed instrukcją.
  Nazwa zaczynająca się kropką (`.loop:`) jest etykietą lokalną(patrz
  [Etykiety lokalne (kropkowane)](#etykiety-lokalne-kropkowane)); `-` i `+` same w sobie
  są anonimowymi etykietami, do których odwołuje się `bne -` / `beq +`
  (najbliższa przed / po).
-Instrukcje są mnemonikiem i operandem; wcięcia są dowolne.
- Dyrektywy Dyrektywy rozpoczynają się kropką (`.byte`, `.macro`, `.if` …);
  `* = $xxxx` (lub `.pc = $xxxx`) ustawia adres.
-Makra użytkownika są wywoływane jako `:nazwa(argumenty)`, `.invoke
  nazwa(argumenty)`, `.call nazwa(argumenty)` lub `nazwa(argumenty)`.

## 2. Liczby i wyrażenia

| Formularz      | Przykład       | Wartość                                                                          |
| -------------- | -------------- | -------------------------------------------------------------------------------- |
| Szesnastkowy   | `$D020`, `$0F` | Prefiks `$`                                                                      |
| Dwójkowy       | `%00001111`    | Prefiks `%`                                                                      |
| Dziesiętny     | `255`, `40*25` | bez prefiksu                                                                     |
| Charakter      | `'A'`          | jego kod (`$41`)                                                                 |
| Aktualny adres | `*`            | adres linii (patrz [Licznik programu `*`](#the--program-counter-in-expressions)) |

W operandach instrukcji należy zapisywać liczby szesnastkowe za pomocą `$`. W
argumentach adresowych makr bibliotecznych (`.rawbytes C000, …`, `.sprite_init
0, 1, 80`) odczytywana jest liczba od jednej do czterech cyfr w formacie
szesnastkowym.

Operatory(w operandach, `.const`, `.fill`, `.assert`, `.if`): `+ - * / %`,
`& | ^ ~`, `<< >>`, nawiasy, `<expr` (młodszy bajt) i `>expr` (wyższy bajt) oraz
w warunkach `== != < > <= >=` (prawda = 1, fałsz = 0). `.fill`, `.const` i
podobne znają również `lo()`, `hi()`, `sin()`, `cos()`, `round()`, `min()`,
`max()`, `abs()` i `PI`.

```
.const B = 7
    lda #(B+1)*2
    lda #B & 3 | 8
    lda #~B & $FF
    ldx #'A'
    lda #<screen        ; low byte of a label
    lda #>(*+63)        ; high byte of a PC-relative address
```

## 3. Wyjście: PRG, szczątkowy moduł BASIC i punkt wejścia

VMA zapisuje C64 PRG: dwubajtowy adres ładowania, po którym następuje obraz
pamięci. Każda sekcja ORG i każda dyrektywa umieszczająca dane pod własnym
adresem (`.rawbytes`, `.incbin`, `.sid` …) trafiają do jednego obrazu; przerwy
między nimi są zerami.

-Bez ORG program zaczyna się od `$0801`, gdzie zaczyna się BASIC.
-BASIC SYS stub(domyślnie): linia `10 SYS nnnn` jest umieszczana w
  `$0801`, więc program rozpoczyna się od `RUN`. Program, którego pierwszym ORG
  jest `$0801`, rozpoczyna się od `$080D`. Wyłącz stub za pomocą
  `--no-basic-stub`; bez niego program pod adresem `$0801` jest asemblowany do
  `$C000`, a każdy inny pozostaje w swoim pierwszym ORG.
-Punkt wejścia: wiersz SYS przeskakuje na początek kodu lub na adres
  określony w komentarzu pierwszego wiersza `; Punkt wejścia: $1234`.
-Kod poniżej linii BASIC(ORG niższy niż `$0801` wraz ze stubem): mały
  moduł ładujący uruchamia program i przenosi go na właściwe miejsce, dzięki
  czemu nadal rozpoczyna się od `RUN`.
- Źródło rozpoczynające się od własnej linii BASIC SYS (`.byte $0B, $08, $0A,
  $00, $9E, …` w `$0801`) jest emitowane w obecnej postaci, bez drugiego
  szczątkowego elementu.

Z poziomu PRG wiersz poleceń tworzy także kasetę i obraz dysku (nowość
w wersji 2.1.0, patrz [8. Wiersz poleceń](#8-wiersz-polecen)):

- `--crt FILE` — kartridż Magic Desk (typ CRT 19, 8 banków × 8 KB, maksymalnie
  65 408 bajtów programu). Ładowarka w banku 0 inicjuje jądro (KERNAL),
  uruchamia procedurę kopiowania z pamięci RAM pod adresem `$0100–$013B`, która
  przenosi program na adres ładowania (przełączając banki za pomocą `$DE00`),
  wyłącza kartridż i przechodzi do punktu wejścia. Program należy trzymać poza
  adresem `$0100–$013B` i bajtami strony zerowej `$02–$04` / `$FB–$FE` używanymi
  przez ładowarkę.
- `--d64 [PLIK]` — obraz dysku 1541 (35 ścieżek) z nazwanym na jego cześć
  programem PRG, plus pliki `--add`, ułożone w taki sposób, w jaki zapisuje je
  system DOS 1541; nie jest wymagany program c1541.

---

## 4. Tryby adresowania

Każda instrukcja 6502 obsługuje jeden lub więcej trybów adresowania. VMA wybiera
tryb na podstawie sposobu zapisu operandu.

| Tryb              | Etykieta          | Przykład           | Opis                                                                                  |
| ----------------- | ----------------- | ------------------ | ------------------------------------------------------------------------------------- |
|implied| Ukryty            | `NIE`              | Brak operandu; instrukcja jest samodzielna                                            |
|immediate| Natychmiastowy    | `LDA #$FF`         | Stała wbudowana; asembler automatycznie dodaje `#`                                    |
|zeroPage| Strona zerowa     | `LDA 10 dolarów`   | Adres jednobajtowy na stronie zerowej (0–255)                                         |
|zeroPageX| Strona zerowa, X  | `LDA 10 dolarów,X` | Adres strony zerowej + przesunięcie rejestru X (wynik zawija się na stronie 0)        |
|zeroPageY| Strona zerowa, Y  | `LDX $FB,Y`        | Adres strony zerowej + przesunięcie rejestru Y                                        |
|absolute| Absolutny         | `LDA $0400`        | Pełny 16-bitowy adres pamięci                                                         |
|absoluteX| Absolute,X        | `LDA $0400,X`      | 16-bitowy adres + przesunięcie rejestru X                                             |
|absoluteY| Absolute,Y        | `LDA $0400,Y`      | 16-bitowy adres + przesunięcie rejestru Y                                             |
|relative| Względny/Etykieta | `Pętla BNE`        | Aby uzyskać instrukcje dotyczące oddziału, wprowadź nazwę etykiety lub adres docelowy |
|indirectX| Pośrednie,X       | `LDA ($FB,X)`      | Strona zerowa indeksowana pośrednio (operand = adres strony zerowej, 1 bajt)          |
|indirectY| Pośrednie, Y      | `LDA ($FB),Y`      | Strona zerowa indeksowana pośrednio (operand = adres strony zerowej, 1 bajt)          |
|indirect| Pośredni          | `JMP ($0100)`      | Pośredni; można go używać tylko z JMP                                                 |

### Stałe na stronie zerowej

Operand składający się wyłącznie ze stałych (`.const`, `nazwa = wartość`, a
`.zmienna`), który mieści się w bajcie, przyjmuje tryb strony zerowej
instrukcji, dokładnie tak jak liczba: po `.const zp = $FB`, `lda zp` składa się
do `A5 FB` (2 bajty, 3 cykle), a `lda zp,x` do `B5 FB`. Tryb, w którym
instrukcja nie ma formy strony zerowej, pozostaje bezwzględny (`lda zp,y` → `B9
FB 00`). Etykieta nie jest zwężana — jej adres jest znany dopiero po
rozmieszczeniu — a `lda.abs zp` wymusza tryb bezwzględny. Liczba zachowuje
szerokość, z jaką została zapisana: `$FB` to strona zerowa, `$00FB` to strona
bezwzględna. * (Nowość w wersji 2.1.)*

### Oznacz wyrażenia etykietami jako operandy

Każdy operand akceptujący adres lub wartość bezpośrednią akceptuje również
bezpośrednio nazwę stałej(`.const` lub etykietę). Dodatkowo można użyć
wyrażeń etykieta+przesunięcie lub etykieta−przesunięcie, aby odwołać się
do adresu względnego do nazwanej stałej:

| Składnia              | Przykład                          | Opis                                                                                                                             |
| --------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `etykieta`            | `RAM ekranu STA,X`                | Rozwiązuje się do etykiety/wartości stałej                                                                                       |
| `etykieta+$hex`       | `STA screen_ram+$0100,X`          | Adres etykiety plus przesunięcie szesnastkowe                                                                                    |
| `etykieta+dziesiętne` | `STA screen_ram+256,X`            | Adres etykiety plus przesunięcie dziesiętne                                                                                      |
| `etykieta-$hex`       | `Tabela LDA-$10`                  | Adres etykiety pomniejszony o przesunięcie szesnastkowe                                                                          |
| `$hex+wyrażenie`      | `LDA $1234+1`, `STA $0400+40*2,X` | Dowolne wyrażenie liczb, etykiet i stałych *(2.1)*                                                                               |
| `(etykieta)`          | `JMP (wektor)`, `JMP (tabela+2)`  | Pośredni skok przez etykietę lub wyrażenie *(2.1)*                                                                               |
| `#<etykieta`          | `LDA #<pamięć_ekranu`             | Niski bajt adresu etykiety                                                                                                       |
| `#>etykieta`          | `LDA #>pamięć_ram_ekranu`         | Wysoki bajt adresu etykiety                                                                                                      |
| `*`                   | `BNE *`                           | Aktualny licznik programu (adres własny instrukcji); rozgałęzienia z `*` generują nieskończoną pętlę własną (przesunięcie `$FE`) |

Przykład — wyczyść dwie strony ekranowe za pomocą stałej:
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

`*` nie jest już ograniczony do całego operandu — może pojawić się w dowolnym
miejscu wyrażenia operandu i oznacza adres instrukcji, w której jest zapisany.
Jest on rozwiązywany w momencie asemblacji na podstawie rzeczywistego adresu tej
instrukcji, więc etykieta nie jest potrzebna w przypadku krótkich skoków
względnych lub odczytów danych względnych względem PC.

| Składnia      | Przykład             | Oznaczający                                                      |
| ------------- | -------------------- | ---------------------------------------------------------------- |
| `*`           | `BNE *`              | Rozgałęzienie do siebie (pętla nieskończona, przesunięcie `$FE`) |
| `*-n` / `*+n` | `BNE *-5`, `BEQ *+4` | Rozgałęzienie względem bieżącego komputera o *n* bajtów          |
| `SKOCZ *+n`   | `SKOK *+20`          | Skok absolutny obliczony na podstawie bieżącego komputera        |
| `#<*` / `#>*` | `LDA #<*`, `LDA #>*` | Niski/wysoki bajt bieżącego komputera                            |
| `#>(*+n)`     | `LDA #>(*+63)`       | Niski/wysoki bajt adresu względnego komputera                    |

PC kontra mnożenie.`*` jest traktowany jako licznik programu tylko wtedy,
gdy znajduje się w *pozycji wartości* — na początku wyrażenia lub zaraz po
operatorze, `(`, `,`, `<`, `>` lub spacji. Operator `*` następujący po liczbie,
`)` lub identyfikatorze jest zwykłym mnożeniem, więc `tabela LDA*2` i
`CONST_A*4` pozostają niezmienione.

Gdzie to działa. Dowolny operand, który akceptuje już wyrażenie: cele
rozgałęzień, `JMP` / `JSR`, `LDA`/`STA`/… bezwzględne i indeksowane,
natychmiastowe operatory bajtów niskiego/wysokiego oraz wyrażenie `.assert`. `*`
nigdy nie zmienia rozmiaru instrukcji, więc jest bezpieczny w każdym trybie
adresowania.

### Etykiety lokalne (kropkowane)

Etykieta, której nazwa zaczyna się od kropki — `.loop`, `.skip`, `.done` — jest
etykietą lokalną . Należy ona do zakresu najbliższej poprzedzającej ją
etykiety globalnej (bez kropki) i wewnętrznie staje się etykietą
`<global>.<name>`. Dwie etykiety lokalne o tej samej krótkiej nazwie pod różnymi
etykietami globalnymi nie kolidują.

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
- Z innego zakresu odwołaj się do niego jawnie jako `Global.name` (np. `JMP
  ClearScreen.loop`).
- `.name` zapisane przed jakąkolwiek etykietą globalną pozostaje zwykłym `.name`
  najwyższego poziomu.

### Etykiety operandów kodu samomodyfikującego

Dodaj prefiks do operandu instrukcji z `label:`, aby umieścić etykietę na bajcie
operandu , a nie na kodzie operacji. Instrukcja składa się z tego, co
następuje po dwukropku.

```
setup:
    LDA value:#$00     ; 'value' -> address of the #$00 operand byte
    ...
patch:
    LDA #new
    STA value          ; writes the operand byte directly — classic SMC
```

Wartość `` wskazuje na `<adres instrukcji> + 1` (pierwszy bajt operandu) dla
każdego trybu adresowania. Zastępuje to starszy wzorzec `instrukcja STA+1` /
`instrukcja: LDA #$00`.

---

## 5. Instrukcje 6502

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

Osiem pseudooperacji zachowuje się jak gałęzie warunkowe, ale dociera do
dowolnego adresu, a nie tylko −128…+127. Każda z nich składa się do gałęzi
odwróconej, która pomija 3-bajtowy `JMP` — zawsze 5 bajtów:

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

- Operand: etykieta, wyrażenie `*` lub adres literowy — taki sam jak normalny
  cel rozgałęzienia.
- Koszt: 5 bajtów i 1 dodatkowy cykl na wybranej ścieżce w porównaniu z krótką
  gałęzią. Nie ma automatycznej promocji krótkiej gałęzi — wybierasz jawnie
  `LBxx`.
- Gdy prosta gałąź (`BNE`, `BEQ`, …) wykracza poza zakres, błąd kompilatora
  teraz nazywa dokładne przekroczenie i sugeruje pasującą `LBxx`.

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

### Przesuń i obróć

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

Są one obsługiwane w przypadku zaawansowanego użytkowania. Należy zachować
ostrożność — zachowanie może się różnić w zależności od układu.

`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`,
`AXS` i formularze `NOP` odczytujące operand: `NOP #$nn` ($80), `NOP $nn` (04
USD), `NOP $nn,X` (14 USD), `NOP $nnnn` (0C), `NOP $nnnn,X` (1C)

---

## 6. Dyrektywy i makra — odniesienie

Dyrektywy sterują asemblerem (etykiety, dane, pochodzenie, warunki, makra
użytkownika); makra biblioteczne wykonują typowe zadania C64 w jednym wierszu —
zamiast pisać 10–20 instrukcji ręcznie, piszesz jeden wiersz, a asembler
generuje kod. Pomyśl o nich jak o wbudowanych podprogramach.

---

### LABEL

Podobnie jak numer wiersza w BASIC— ale z nazwą zamiast numeru. Cele skoku
dla `JMP`, `JSR`, `BNE` itd.

| Argument       | Opis                                             |
| -------------- | ------------------------------------------------ |
| Nazwa etykiety | Identyfikator używany w `JMP`, `JSR`, `BNE` itd. |

Składnia:
```
loop:
```

Wygenerowany kod:
```
loop:  ; $0820
```

Aktualny adres jest wyświetlany jako komentarz. Etykiety mają rozmiar0
bajtów.

---

### COMMENT

Podobnie jak REM w BASIC-u— uwaga dla Ciebie, którą asembler całkowicie
ignoruje.

Składnia:
```
; Your comment text here
```

Wygenerowany kod:
```
; Your comment text here
```

---

### BYTE

Podobnie jak DATA w BASIC— przechowuje listę surowych wartości bajtów w
tekście programu.

| Argument | Opis                                                                          |
| -------- | ----------------------------------------------------------------------------- |
| Operand  | Wartości bajtów rozdzielone przecinkami (np. `$01, $02, $FF` lub `1, 2, 255`) |

Składnia:
```
.byte $01, $02, $FF
```

Wygenerowany kod:
```
    .byte $01, $02, $FF
```

Odwołania do etykiet bajtów niskich/wysokich: BYTE akceptuje tokeny
`<label` (młodszy bajt) i `>label` (starszy bajt) w stylu KickAssembler/ca65
wraz z wartościami numerycznymi. Asembler rozwiązuje adres etykiety w czasie
kompilacji i wstawia odpowiedni bajt. Przykład:

```
    .byte <frame_0, >frame_0, <frame_1, >frame_1
```

Przechowuje najpierw bajt młodszy adresu ramki `frame_0`, następnie bajt
starszy, a potem to samo dla ramki `frame_1`. Przydatne przy tworzeniu tablic
skoków i list adresowych.

Rozmiar: Liczba bajtów na liście.

---

### WORD

Podobnie jak DATA w BASIC-u, ale dla liczb 16-bitowych. Każda wartość jest
przechowywana jako dwa bajty (najpierw bajt młodszy, potem bajt starszy —
kolejność little-endian 6502).

| Argument | Opis                                                            |
| -------- | --------------------------------------------------------------- |
| Operand  | Wartości 16-bitowe rozdzielone przecinkami (np. `$0400, $C000`) |

Składnia:
```
.word $0400, $C000
```

Wygenerowany kod:
```
    .word $0400, $C000
```

Rozmiar: 2 bajty na słowo.

---

### FILL

Podobnie jak `FOR I=1 TO N : POKE addr+I, val : NEXT` — wypełnia blok pamięci
tym samym bajtem w jednym wierszu. Świetnie nadaje się do czyszczenia obszarów
lub wstępnego wypełniania tabel.

| Argument | Opis                                                     |
| -------- | -------------------------------------------------------- |
| Operand  | `liczba,wartość` — np. `256,0` wypełnia 256 bajtów zerem |

Składnia:
```
.fill 256, $00
```

Wygenerowany kod:
```
    .fill 256, $00
```

Składnia wyrażenia: Zarówno `liczba`, jak i `wartość` akceptują wyrażenia
arytmetyczne. Można odwoływać się do nazw stałych, używać literałów
szesnastkowych/binarnych i wywoływać wbudowane funkcje matematyczne:

| Wyrażenie                     | Oznaczający                                      |
| ----------------------------- | ------------------------------------------------ |
| `LICZBA_KAFELEK, $00`         | liczenie z CONST, literał wartości szesnastkowej |
| `40*25, 0`                    | mnożenie liniowe                                 |
| `okrągły(sin(PI/4)*255), 80$` | trygonometria                                    |

Funkcje wbudowane:`sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, constant `PI`

Operatorzy: `+ - * /` Literały: `$FF` (szesnastkowy), `%10110000` (binarny) Bajt
młodszy/starszy: `lo(wyrażenie)`, `hi(wyrażenie)`

Rozmiar: Wartość liczbowa w bajtach.

---

### ALIGN

Przesuwa bieżący adres do przodu do następnej czystej granicy, wstawiając bajty
uzupełniające zerami. C64 wymaga, aby dane sprite'a zaczynały się od granicy 64
bajtów — `ALIGN 64` obsługuje to automatycznie.

| Argument | Opis                                                                                    |
| -------- | --------------------------------------------------------------------------------------- |
| Granica  | Wartość wyrównania — np. `64` (granica sprite’a), `256` (strona), `$2000` (mapa bitowa) |

Składnia:
```
.align 64
.align $2000
```

Wygenerowany kod:
```
    ; ALIGN 64 → $0840 (12 bytes padding)
```

Rozmiar: Dynamiczny — zależy od aktualnej pozycji licznika programu.

>Wskazówka: Użyj `ALIGN 64` przed danymi sprite, `ALIGN 256` aby zapewnić
> wyrównanie tabel do stron.

---

### TEXT

Podobnie jak PRINT AT— zapisuje tekst bezpośrednio na ekranie C64 w podanej
kolumnie i wierszu, bez użycia KERNAL-a. Generuje jedną parę LDA/STA na znak,
wykorzystując pamięć RAM ekranu pod adresem `$0400`.

| Argument               | Opis                                                     |
| ---------------------- | -------------------------------------------------------- |
| Tekst                  | Ciąg do wyświetlenia                                     |
| X                      | Kolumna (0–39)                                           |
| Y                      | Wiersz (0–24)                                            |
| Etykieta (opcjonalnie) | Przypisuje etykietę wskazującą na obliczony adres ekranu |
| `niższy`               | Opcjonalna flaga — patrz poniżej                         |

Tryby zestawów znaków:

W systemie C64 możliwe jest wybranie w czasie działania programu dwóch zestawów
znaków:

| Tryb                                       | $D018 bit 1 | Wprowadzanie wielkich liter        | Wprowadzanie małych liter              |
| ------------------------------------------ | ----------- | ---------------------------------- | -------------------------------------- |
|Wielkie litery/grafika(domyślne)      | 0           | `A`–`Z` → kody ekranowe $01–$1A ✓  | traktowane również jako wielkie litery |
|Małe/wielkie litery(po CHARSET small) | 1           | `A`–`Z` → $01–$1A (wielkie litery) | `a`–`z` → $41–$5A (małe litery) ✓      |

-Zestaw znaków wielkich liter (domyślny): Wpisz to, co chcesz zobaczyć
  wielkimi literami. `„CZEŚĆ”` wyświetla się jako `CZEŚĆ`. Wprowadzanie małymi
  literami jest mapowane na wielkie litery w kodach ekranowych.
-Zestaw znaków małych liter (`mniejsze`): Wpisz dokładnie taką wielkość
  liter, jaką chcesz zobaczyć. `„hello”` → wyświetlanie małych liter, `„HELLO”`
  → wyświetlanie wielkich liter. Wymaga przełączenia zestawu znaków w czasie
  wykonywania przed zapisaniem zawartości ekranu (użyj makra CHARSET –
  mniejsze).

Wygenerowany kod (tryb wielkich liter, `"HELLO"`):
```
    LDA #$08      ; 'H' screen code $08
    STA $0400
    LDA #$05      ; 'E' screen code $05
    STA $0401
    ...
```

Składnia:
```
.text 0, 2, "HELLO"           ; uppercase charset (default)
.text 0, 2, "hello", lower    ; lowercase charset
```

Znaki są kodowane jako kody ekranowe(nie PETSCII).Rozmiar:`długość
tekstu × 5` bajtów (LDA + STA na znak).

---

### STRING

Podobnie jak Wprowadzanie ciągu do dowolnego adresu pamięci w czasie
wykonywania. Generuje pary LDA/STA, które kopiują kod ekranu każdego znaku do
kolejnych adresów.

| Argument               | Opis                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| Tekst                  | Ciąg do napisania                                                                               |
| Adres                  | Adres pamięci docelowej — `$C000` hex lub nazwa etykiety|
| Etykieta (opcjonalnie) | Przypisuje etykietę wskazującą na adres docelowy                                                |
| Zmiana                 | Wartość szesnastkowa (00–FF) dodawana do każdego bajtu kodu ekranu (np. `$80` = odwrotne wideo) |
| `niższy`               | Opcjonalna flaga — ta sama semantyka co w przypadku TEKST (patrz sekcja TEKST)                  |

Składnia:
```
.string $C000, "HELLO"                  ; uppercase charset (default)
.string $C000, "hello", lower           ; lowercase charset
.string $C000, "HELLO", 80             ; with shift (reverse video)
.string $C000, "hello", 80, lower      ; shift + lowercase
.string $C000, "HELLO" :my_string      ; with macroLabel
```

Wygenerowany kod:
```
    LDA #$08      ; 'H' screen code
    STA $C000
    LDA #$05      ; 'E' screen code
    STA $C001
    ...
```

Znaki są kodowane jako kody ekranowe(nie PETSCII). Do każdego bajtu
dodawana jest opcjonalna wartość Shift, np. `$80` dla odwróconego obrazu.
Rozmiar:`długość tekstu × 5` bajtów (jeden LDA + jeden STA na znak).

---

### DATA

Podobnie jak pętla POKE— zapisuje listę surowych bajtów do adresu pamięci w
czasie wykonywania, jedną parę LDA/STA na bajt.

| Argument               | Opis                                                         |
| ---------------------- | ------------------------------------------------------------ |
| Bajty                  | Wartości bajtów rozdzielone przecinkami                      |
| Adres                  | Adres pamięci docelowej — `$C000` hex lub nazwa etykiety|
| Etykieta (opcjonalnie) | Przypisuje etykietę wskazującą na adres docelowy             |

Składnia:
```
.data $C000, $01, $02, $03          ; hex address
.data my_buf, $01, $02, $03         ; label address
.data $C000, $01, $02, $03 :mydata  ; with macroLabel
```

Wygenerowany kod:
```
    LDA #$01
    STA $C000
    LDA #$02
    STA $C001
    ...
```

Rozmiar:`liczba bajtów × 5` bajtów (jeden LDA + jeden STA na bajt).

>2.1: bajty mogą nazywać etykiety: `.data $2010, <target, >target` zapisuje
> adres `target`, również etykiety zdefiniowanej później. Etykieta `:name` makra
> może wskazywać na adres docelowy, który sam jest etykietą.

---

### RAWBYTES

Podobnie jak DATA, które ładuje się bezpośrednio do pamięci— bez żadnego
kodu wykonawczego. Bajty są obecne od momentu załadowania PRG, jeszcze przed
uruchomieniem kodu. Używaj tego do danych sprite'ów, map poziomów, tabel
wyszukiwania i wszystkiego, co musi znajdować się pod określonym adresem.

| Argument               | Opis                                                         |
| ---------------------- | ------------------------------------------------------------ |
| Bajty                  | Wartości bajtów rozdzielone przecinkami                      |
| Adres                  | Adres pamięci docelowej — `$C000` hex lub nazwa etykiety|
| Etykieta (opcjonalnie) | Przypisuje etykietę wskazującą na adres docelowy             |

Składnia:
```
.rawbytes $C000, $00, $00, $00      ; hex address
.rawbytes sprite_data, $00, $00     ; label address
.rawbytes $0C50, $00, $00 :nev      ; with macroLabel — other code can use LDA nev,X
```

Rozmiar w kodzie: 0 bajtów. Dane są umieszczane pod podanym adresem na
wyjściu.

>DATA kontra RAWBYTES: DATA generuje kod LDA/STA, który kopiuje bajty w
> czasie wykonywania (wolniej, ale działa, jeśli dane muszą być dynamiczne).
> RAWBYTES po prostu umieszcza bajty bezpośrednio — bez kodu, natychmiast, bez
> kosztów.

>2.1: bajty mogą nazywać etykiety (`.rawbytes $2000, <target, >target` —
> tablica wskaźników); etykieta `:name` może wskazywać na etykietę jako adres
> docelowy, również zdefiniowany później. Jako argument bufora makra, bajty
> zajmują własne miejsce w buforach po programie.

---

### RAWTEXT

Podobnie jak RAWBYTES, ale dla tekstu — koduje ciąg jako kody ekranowe i
umieszcza bajty pod stałym adresem bez kodu wykonawczego . Tekst jest gotowy
w pamięci w momencie załadowania PRG.

| Argument               | Opis                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| Tekst                  | Ciąg do zakodowania                                                                             |
| Adres                  | Adres pamięci docelowej — `$C000` hex lub nazwa etykiety|
| Etykieta (opcjonalnie) | Przypisuje etykietę wskazującą na adres docelowy                                                |
| Zmiana                 | Wartość szesnastkowa (00–FF) dodawana do każdego bajtu kodu ekranu (np. `$80` = odwrotne wideo) |
| `niższy`               | Opcjonalna flaga — ta sama semantyka co w przypadku TEKST (patrz sekcja TEKST)                  |

Składnia:
```
.rawtext $C000, "HELLO"                 ; uppercase charset (default)
.rawtext $C000, "hello", lower          ; lowercase charset
.rawtext $C000, "HELLO", 80            ; with shift (reverse video)
.rawtext $C000, "hello", 80, lower     ; shift + lowercase
.rawtext $0400, "HELLO" :my_text       ; with macroLabel
```

Wygenerowany kod:
```
; .rawtext "HELLO" -> $C000
; $C000
    .byte $08, $05, $0C, $0C, $0F   ; H E L L O (uppercase screen codes)

; .rawtext "hello", lower -> $C000
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; h e l l o (lowercase screen codes $41–$5A range)
```

Rozmiar w kodzie: 0 bajtów. Dane są umieszczane pod podanym adresem na
wyjściu.

>STRING kontra RAWTEXT: STRING generuje kod LDA/STA, który kopiuje tekst w
> czasie wykonywania. RAWTEXT wczytuje bajty do PRG w momencie ładowania — bez
> kodu i czekania.

---

### PETSCII

Podobnie jak RAWBYTES, ale dla wyjścia KERNAL— koduje ciąg jako bajty
PETSCII (zgodne z CHROUT w `$FFD2`) i umieszcza je pod stałym adresem bez kodu
wykonawczego. Użyj tego, gdy chcesz wydrukować znaki za pomocą `JSR $FFD2` w
pętli, i zwróć uwagę, że `.print` używa tego samego kodera i flagi `lower`.

>PETSCII a kody ekranowe: PETSCII i kody ekranowe to dwa różne kodowania.
> Kod ekranowy `$01` = litera A; PETSCII `$41` = litera A (przez CHROUT). Używaj
> PETSCII tylko podczas drukowania przez KERNAL; do zapisu bezpośrednio do
> pamięci RAM ekranu używaj TEXT/STRING/RAWTEXT.

| Argument               | Opis                                                         |
| ---------------------- | ------------------------------------------------------------ |
| Tekst                  | Ciąg do zakodowania jako bajty PETSCII                       |
| Adres                  | Adres pamięci docelowej — `$C000` hex lub nazwa etykiety|
| Etykieta (opcjonalnie) | Przypisuje etykietę wskazującą na adres docelowy             |
| `niższy`               | Opcjonalna flaga — patrz poniżej                             |

Tryby zestawów znaków:

| Tryb                          | Wprowadzanie wielkich liter (`A`–`Z`)                                                                      | Wprowadzanie małymi literami (`a`–`z`) |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------- |
|Wielkie litery (domyślne)| `$41`–`$5A` (PETSCII wielkie litery przez CHROUT)                                                          | mapowane również na `$41`–`$5A`        |
|Małe litery (`mniejsze`)| Litery alfabetu są mapowane tak, aby widoczna wielkość liter była spójna w zestawie znaków małych/wielkich | Ta sama zasada                         |Składnia:
```
.petscii $C000, "HELLO"              ; uppercase PETSCII (default)
.petscii $C000, "hello", lower       ; lowercase PETSCII ($61–$7A)
.petscii $C000, "HELLO", null        ; with null terminator
.petscii $C000, "hello", lower, null ; lowercase + null terminator
.petscii $C000, "HELLO" :my_msg      ; with macroLabel
```

Wygenerowane bajty (wielkie litery, `"CZEŚĆ"`):
```
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; H E L L O (PETSCII $41–$5A range)
```

Rozmiar w kodzie: 0 bajtów. Dane są umieszczane pod adresem docelowym jako
odroczona sekcja danych (jak RAWBYTES).

Terminator zerowy: dodaj flagę `null`, aby dodać bajt `$00` po tekście.
Idealne dla pętli zakończonych zerem:

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

Zasady kodowania:

| Wejście                                      | Tryb wielkich liter                    | Tryb małych liter |
| -------------------------------------------- | -------------------------------------- | ----------------- |
| `A`–`Z`                                      | `41$`–`5$`                             | `61$`–`7$`        |
| `a`–`z`                                      | `$41`–`$5A` (wymuszone wielkie litery) | `41$`–`5$`        |
| Spacja, cyfry, znaki interpunkcyjne (32–126) | tak jak jest                           | tak jak jest      |
| Nowa linia                                   | `$0D` (ZWROT)                          | `$0D`             |
| Inny                                         | `20$` (spacja)                         | `20 dolarów`      |

>Wskazówka: Użyj PETSCII do danych, które będą wyprowadzane przez CHROUT
> (`$FFD2`). Aby zapisać dane bezpośrednio do pamięci RAM ekranu, użyj zamiast
> tego STRING lub RAWTEXT.

---

### CHARSET

Przełącza pamięć ROM znaków VIC-II pomiędzy trybem wielkich liter/grafiki
(domyślnie w C64) a trybem małych liter/wielkich liter, poprzez modyfikację bitu
1 parametru `$D018` w czasie wykonywania.

| Argument | Opis                                                                                                                                     |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Tryb     |Małe litery— włącza zestaw znaków małych/wielkich liter;Wielkie litery— przywraca domyślny zestaw znaków wielkich/graficznych |Składnia:
```
.charset lower    ; switch to lowercase charset
.charset upper    ; switch back to uppercase/graphics charset
```

Wygenerowany kod:

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

Rozmiar:8 bajtów (LDA abs + ORA/AND imm + STA abs).Dlaczego ORA/AND zamiast bezpośredniego zapisu?`$D018` steruje również
lokalizacją pamięci RAM ekranu (bity 7–4). Przełączenie tylko bitu 1 zachowuje
resztę rejestru.

Typowy przepływ pracy:

```
.charset lower
.text 0, 0, "hello world", lower
.charset upper
```

>Uwaga: Makro CHARSET zmienia tylko wskaźnik pamięci ROM znaków VIC. Nie
> wywołuje `$E544` (inicjalizacja zestawu znaków KERNAL). W większości
> przypadków jest to wystarczające; wywołaj najpierw `JSR $E544` tylko wtedy,
> gdy chcesz, aby własne procedury drukowania KERNAL-a uwzględniły tę zmianę.

---

### CHARDEF

Definiuje pojedynczy niestandardowy znak 8×8 w zestawie znaków opartym na
pamięci RAM. Wysyła kod inline środowiska wykonawczego, który kopiuje 8 bajtów
do `base + index * 8` w momencie wykonania — bez potrzeby poprzedzania etykietą
lub `ORG`.

| Argument            | Opis                                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Baza zestawu znaków | Adres bazowy zestawu znaków RAM (domyślnie `$3800`). Musi być wyrównany, aby mógł go zobaczyć komputer VIC-II (patrz poniżej). |
| Indeks znaków       | Który slot znaku zdefiniować ponownie, 0–255. `65` = 'A' w domyślnym układzie kodu ekranu.                                     |
| 8 bajtów            | Wiersze mapy bitowej rozdzielone przecinkami, od góry do dołu. Siódmy bit każdego bajtu = piksel najbardziej na lewo.          |

Składnia:
```
.chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00
```

Wygenerowany kod (8 × `LDA #b` / `Cel STA+n`, łącznie 40 bajtów):
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

Adres docelowy:`$3800 + 65 * 8 = $3A08`. Obliczany w czasie kompilacji i
zakodowany na stałe w operandach STA.

Rozmiar:40 bajtów na znak (8 × 5).Typowy przepływ pracy:
```
    ; Point VIC-II at RAM charset at $3800
    LDA $D018
    AND #$F1
    ORA #$0E       ; bits 3-1 = %111 → charset at bank+$3800
    STA $D018

    .chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00   ; redefine 'A'
    .chardef $3800, 66, $7C,$66,$66,$7C,$66,$66,$7C,$00   ; redefine 'B'
    ; ... more .chardef lines for each custom char
```

Kiedy używać CHARDEF a kiedy alternatyw:

| Zbliżać się                        | Użyj kiedy                                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
|CHARDEF| Potrzebujesz kilku niestandardowych znaków (powiedzmy 1–20). Koszt wykonania każdego z nich wynosi 40 bajtów. |
|RAWBYTES @ 3800$| Masz pełny, niestandardowy zestaw znaków (256 znaków). Łącznie 2 KB danych, bez kopii w czasie wykonywania.   |
|INCBIN „charset.bin” @ $3800| Zewnętrzny plik zestawu znaków (stworzony przez edytor znaków). Najczystsza opcja.                            |
|Zestaw znaków Canvas + INCBIN| Pełna mapa bitowa składająca się z 256 znaków, namalowana jako jeden obraz o wymiarach 128×128.               |

>Przypomnienie o wyrównaniu: VIC-II oczekuje bazy zestawu znaków jako
> wielokrotności `$0800`. Prawidłowe banki: `$0000`, `$0800`, `$1000`, ...,
> `$3800` (w ramach obecnego banku VIC o pojemności 16 KB). Zestawy znaków RAM
> zazwyczaj mają wartość `$2000`, `$2800`, `$3000` lub `$3800`.

---

### BOX_HIT

Test kolizji prostokątów ograniczających wyrównanych do osi (AABB) między dwoma
prostokątami opisanymi 4-bajtowymi strukturami zerowej strony. Zwraca wynik w
akumulatorze:A = 1 w przypadku nakładania się,A = 0 w przeciwnym
razie. Czysty asembler inline, bez wywołania podprogramu.

| Argument                      | Opis                                                                              |
| ----------------------------- | --------------------------------------------------------------------------------- |
| Adres pocztowy Box1           | Podstawowa strona zerowej struktury 4-bajtowej pierwszego pola (domyślnie `$FB`). |
| Adres skrzynki pocztowej Box2 | Podstawa strony zerowej 4-bajtowej struktury drugiego pola (domyślnie `$F7`).     |

Układ struktury(4 bajty na pole, współrzędne 8-bitowe bez znaku):

| Zrównoważyć | Pole       |
| ----------- | ---------- |
| `+0`        | Lewy       |
| `+1`        | Szczyt     |
| `+2`        | Prawidłowy |
| `+3`        | Spód       |

Składnia:
```
.box_hit $FB, $F7
```

Wygenerowany kod (30 bajtów, w pełni względny dla PC — bez podprogramów, bez
skoków bezwzględnych):
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

Rozmiar:30 bajtów.Typowy przepływ pracy:

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

    .box_hit $FB, $F7        ; test player vs enemy → A = 0 or 1

    CMP #$01
    BNE no_collision
    JSR handle_hit
no_collision:
```

Ograniczenia:
- Oba adresy strony zerowej muszą być `≤ $FC` (każde pole wymaga 4 kolejnych
  bajtów: `zp`, `zp+1`, `zp+2`, `zp+3`).
- Współrzędne są traktowane jako 8-bitowe bez znaku(0–255). W przypadku
  współrzędnych sprite’ów ze znakiem spoza tego zakresu należy je znormalizować
  przed zapisaniem.
- Jeśli zachodzi taka potrzeba, oba pola mogą na siebie nachodzić w przestrzeni
  ZP, zwykle jednak potrzebnych jest 8 odrębnych bajtów.

Dlaczego nie podprogram? Generowanie inline pozwala uniknąć obciążenia
JSR/RTS (ponad 14 cykli) i utrzymuje test w pamięci podręcznej, co zapewnia
ciasne pętle gry. Jeśli musisz przetestować wiele par, umieść ręcznie własny
`JSR box_hit_sub` wokół pojedynczej linii BOX_HIT.

Porównanie z funkcją `box_hit()` w UB: Ultimate Basic opakowuje tę samą
logikę 6502, co funkcja czasu wykonania zwracająca zmienną. W VA umieszczasz
BOX_HIT w miejscu, w którym potrzebujesz testu; wynik znajduje się w `A`.

---

### INCBIN

Podobnie jak BLOAD w BASIC— pobiera zewnętrzny plik binarny (`.bin`,
`.prg`, `.sid`, `.raw`) i osadza go bezpośrednio w zmontowanym pliku PRG pod
określonym adresem.

| Argument | Opis                                                           |
| -------- | -------------------------------------------------------------- |
| Plik     | Przeglądaj, aby wybrać plik `.bin`, `.prg`, `.sid` lub `.raw`. |
| Adres    | Adres obciążenia docelowego (np. `$C000`)                      |

Składnia:
```
.incbin "music.bin", $C000
```

Wygenerowany komentarz kodu:
```
    ; INCBIN "music.bin" @ $C000 (2048 bytes)
    .byte $01, $02, ...
```

Rozmiar w kodzie: 0 bajtów (sekcja danych odroczonych). Plik binarny jest
osadzony pod podanym adresem.

---

### KOALA

Ładuje obraz Koala Painter(`.koa` / `.kla`, 160×200, wielokolorowy) i
wyświetla go. Dane obrazu są osadzone pod stałym adresem, takim jak `INCBIN`
(2-bajtowy adres ładowania pliku `$6000` jest usuwany), a sama dyrektywa
kompiluje się do 86-bajtowej procedury wyświetlania, która jest uruchamiana w
tym samym miejscu.

| Argument | Opis                                                                                                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plik     | Przeglądaj, aby wybrać plik `.koa` / `.kla` (10003 bajtów lub 10001 bez adresu ładowania)                                                            |
| Adres    | Adres mapy bitowej: `$6000` (domyślny, natywny dla Koali, bank VIC 1, pamięć RAM ekranu `$4400`) lub `$2000` (bank VIC 0, pamięć RAM ekranu `$0400`) |

Procedura wyświetlania kopiuje część pamięci RAM ekranu na ekran, a część
pamięci RAM kolorów do `$D800`, zapisuje bajt tła do `$D021`, wybiera bank VIC w
`$DD00` (zachowując pozostałe bity portu) i przełącza na tryb wielokolorowej
mapy bitowej (`$D011 = $3B`, `$D016 = $18`, `$D018 = $18`). Pozostałe adresy są
odrzucane: pozostałe sloty 8K znajdują się pod pamięcią ROM BASIC/KERNAL (pętla
kopiowania odczytałaby pamięć ROM) lub nakładają się na cień pamięci ROM znaków.

Składnia:
```
.koala "picture.koa"
.koala "picture.koa", $2000
```

Przykład — pokaż obrazek i poczekaj:
```
* = $0801
.koala "picture.koa"
wait:
    JMP wait
```

Rozmiar w kodzie: 86 bajtów (program wyświetlania); 10001 bajtów danych
obrazu trafia pod podany adres. Edytor Hires w C64 Visual Assembler eksportuje
kompatybilny plik.

---

### LEVEL / LEVEL_ROW

Umieszcza projekt Edytora poziomów w programie i kopiuje wiersze poziomów do
bufora ekranu – podstawowych elementów gry z przewijaniem. Przykład
`level-demo.asm` w C64 Visual Assembler to kompletny poziom przewijany
joystickiem.

#### LEVEL

Dyrektywa w stylu INCBIN, która emituje 0 bajtów kodu. Tylko umieszczone
ekrany projektu Level Editor (`.bin` zapisywane przez Level Editor w C64 Visual
Assembler) trafiają do pamięci z podanego adresu (domyślnie `$2000`), w
kolejności slotów, po 2000 bajtów na ekran (1000 kodów ekranów + 1000 kolorów).
Identyczne ekrany są zapisywane raz, a wszystkie puste sloty współdzielą jeden
pusty ekran. Tabele wskaźników odpowiadają ekranom. Poziom może mieć maksymalnie
7 × 10 ekranów.

Składnia:
```
.level "level.bin"
.level "level.bin", $4000
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

Typowy strażnik: `.assert LEVEL_END <= $9200, „dane poziomu trafiają do kodu”`.

#### LEVEL_ROW

Kopiuje jeden 40-znakowy wiersz poziomu do bufora: wiersz poziomu w X,
zaczynając od kolumny poziomu przechowywanej w zmiennej `col`, do adresu
przechowywanego we wskaźniku `dst` (`dst` / `dst+1`, lo/hi). Z trzecim
argumentem `color` kopiuje kolory zamiast kodów ekranu (dla pamięci kolorów
RAM). Okno 40-znakowe obejmujące dwa ekrany jest obsługiwane przez
samomodyfikującą pętlę kopiowania (~14 cykli na bajt). X jest zachowywane, A i Y
są niszczone. Wymaga bloku `.level` w programie.

Składnia:
```
.level_row dst_lo, view_x
.level_row dst_lo, view_x, color
```

Rozmiar w kodzie: 132 bajty — użyj `LBEQ` / `LBNE`, gdy gałąź musi nad nią
przeskoczyć.

---

### SID

Podobnie jak BLOAD dla muzyki— ładuje plik `.sid` do PRG i automatycznie
odczytuje adresy Init i Play z nagłówka. Wywołuje Init raz podczas uruchamiania,
a następnie wywołuj Play z obsługi przerwań IRQ co klatkę.

| Argument                           | Opis                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------- |
| Plik                               | Plik `.sid` (PSID / RSID)                                                                         |
| Adres niestandardowy (opcjonalnie) | Zastąp natywny adres ładowania SID (np. `$1000`). Pozostaw puste, aby użyć adresu z nagłówka SID. |

Nagłówek SID zawiera:
-Adres ładowania— miejsce, w którym dane są umieszczane w pamięci (adres
  niestandardowy, jeśli jest podany)
-Adres inicjalizacji— wywołaj to za pomocą JSR, aby zainicjować muzykę
  (przenoszone razem z adresem niestandardowym)
-Adres odtwarzania— wywołuj to za pomocą JSR w każdej ramce w obsłudze
  przerwań IRQ (przenoszone razem z adresem niestandardowym)

Składnia:
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", $1000
```

Wygenerowany komentarz kodu:
```
    ; SID "Ikari_Warriors.sid" @ $1000  Init:$1000  Play:$1006  (4096 bytes)
```

Rozmiar w kodzie: 0 bajtów w linii. Plik binarny SID jest umieszczany pod
określonym adresem jako odroczony fragment w PRG.

>Ważne: Większość plików SID zawiera zakodowane na stałe wewnętrzne adresy
> absolutne. Można je relokować tylko wtedy, gdy cały plik binarny zostanie
> przesunięty o to samo przesunięcie. Jeśli SID zawiera wewnętrzne skoki do
> `$10xx`, musi pozostać na `$1000` — przeniesienie go na inny adres spowoduje
> uszkodzenie tych wewnętrznych odwołań.

>Typowe zastosowanie: Nadaj identyfikatorowi SID własny adres (`.sid
> "tune.sid", $1000`), gdy jego natywny adres koliduje z Twoim kodem. Wywołaj
> funkcję Init raz podczas uruchamiania, a następnie wywołaj funkcję Play co
> klatkę z rastrowego programu obsługi przerwań IRQ — lub pozwól, aby funkcja
> [SID_PLAYER](#sid_player) wykonała obie te czynności.

Etykiety: dyrektywa SID definiuje `SID_LOAD` (miejsce, w którym umieszczane
są dane), `SID_INIT` i `SID_PLAY` (adresy init i play, przenoszone razem z
adresem niestandardowym). `SID_PLAY` jest niedostępne, gdy utwór nie ma adresu
play (RSID instalującego własne przerwanie IRQ). Użyj ich we własnym kodzie, np.
`JSR SID_PLAY` w obsłudze przerwań IRQ.

---

### SID_PLAYER

Odtwarza melodię dyrektywy SID za pomocą jednego wiersza: inicjuje melodię i
wywołuje jej procedurę odtwarzania z przerwania rastrowego, dzięki czemu program
może kontynuować swoją pracę.

| Argument | Opis                                                                |
| -------- | ------------------------------------------------------------------- |
| Piosenka | Numer podstrojenia przekazany do procedury init w A (domyślnie `0`) |
| Raster   | Linia rastrowa przerwania, `$00`–`$FF` (domyślnie `$FA`)            |

Co robi: `SEI`, `LDA #song` / `JSR SID_INIT`, wyłącza przerwanie IRQ timera CIA1
(`$DC0D`), ustawia wektor IRQ (`$0314/$0315`) na jego wbudowany moduł obsługi,
linia rastrowa (`$D012`, bit 8 `$D011` wyczyszczony) i przerwanie IRQ rastrowe
(`$D01A`), `CLI`, a następnie przeskakuje nad modułem obsługi. Obsługujący
potwierdza przerwanie (`ASL $D019`), wywołuje `JSR SID_PLAY` i przechodzi do
KERNAL (`JMP $EA31`, który skanuje również klawiaturę).

Składnia:
```
.sid "Ikari_Warriors.sid"
.sid_player
.sid_player 1, $80
```

Rozmiar w kodzie: 58 bajtów.

>Uwaga: w programie wymagany jest wiersz `.sid` (`SID_INIT` i `SID_PLAY`);
> w przeciwnym razie kompilacja zostanie zatrzymana z powodu błędu. Przy
> wyłączonym przerwaniu IRQ timera CIA1, KERNAL uruchamia się raz na klatkę z
> przerwania IRQ rastrowego — klawiatura i `GETIN` nadal działają.

---

### INCLUDE

Podobnie jak MERGE w BASIC— wciąga inny plik i rozwija go w linii w tym
miejscu. Idealne dla bibliotek podprogramów wielokrotnego użytku.

Obsługiwane są dwa rodzaje plików:
-Zwykły kod źródłowy zestawu(`.inc`, `.asm`, `.s`) — plik jest
  odczytywany jako kod źródłowy VMA. Jest odczytywany ponownie przy każdej
  kompilacji, więc można go edytować w dowolnym edytorze.
-Projekt Visual Assembler(`.json`) — bloki programu blokowego Visual
  Assembler w języku C64.

| Argument                    | Opis                                                                                                                                                                                                                                          |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plik                        | Źródło `.inc` / `.asm` / `.s` lub projekt Visual Assembler `.json`                                                                                                                                                                            |
| Załaduj adres (opcjonalnie) | Jeśli ustawiono (szesnastkowo, np. `C000`), dołączony kod jest umieszczany pod tym adresem — przed nim umieszczany jest `ORG`, a własne ORG dołączonego pliku są ignorowane. Bez tego własne ORG dołączonego pliku kontrolują rozmieszczenie. |

Składnia:
```
.include "library.json"
.include "macros.inc", $1500
.include "sprites.asm"
```

- Podaj rozszerzenie pliku — nazwa typu `.include "macros"` jest traktowana
  jako `.include "macros.json"`.
- Rozwiązywanie ścieżki: najpierw obok źródła, a następnie w każdym folderze
  wyszukiwania (`--base-dir` / `--search` w interfejsie CLI); ścieżka zapisana
  na innym komputerze wraca do swojej nazwy pliku. Brak dołączenia nie jest
  błędem — kompilacja jest kontynuowana bez niego.

Wygenerowany kod (bez nadpisywania adresu):
```
    ; .include "library.json"
    ... (the included code follows)
```

Wygenerowany kod (z adresem ładowania `C000`):
```
    ; .include "library.json" @ $C000
    *=$C000
    ... (the included code follows)
```

>Wskazówka: Użyj polecenia INCLUDE, aby tworzyć biblioteki podprogramów
> wielokrotnego użytku, którymi możesz dzielić się między projektami. Pliki
> `.inc`/`.asm`/`.s` najlepiej sprawdzają się, gdy chcesz edytować bibliotekę w
> edytorze tekstu lub udostępniać ją innym asemblerom 6502; `.json`, gdy
> biblioteka jest programem blokowym Visual Assembler. Ustaw adres ładowania,
> gdy biblioteka nie ma własnej struktury ORG lub gdy chcesz zastąpić jej
> domyślne położenie.

>2.1: Nieznalezienie pliku include jest błędem, podobnie jak plik include
> sam siebie (bezpośrednio lub niżej). Własne wiersze `.include`, `.incbin` i
> `.sid` pliku include są również ładowane względem jego własnego folderu, a
> wywołania makr są rozszerzane — do 16 poziomów w głąb.

---

### TABLE

Podobnie jak DIM pod określonym adresem— nadaje nazwę tabeli odnośników i
określa jej miejsce w pamięci. Umieść po niej wiersze `.byte`, `.word` lub
`.fill`, aby zdefiniować zawartość tabeli.

| Argument | Opis                                                     |
| -------- | -------------------------------------------------------- |
| Nazwa    | Identyfikator etykiety tabeli (np. `color_table`)        |
| Adres    | Stały adres, pod którym zaczyna się tabela (np. `$C000`) |

Składnia:
```
.table color_table $C000
.table lookup              ; at the current address
```

Wygenerowany kod:
```
color_table:
```

Po podaniu adresu licznik programu przeskakuje do niego; bez niego tabela
zaczyna się od bieżącego adresu. Aby wypełnić zawartość, należy po nim umieścić
wiersze `.byte` / `.word` / `.fill`.

Rozmiar: 0 bajtów.

---

### ORG

Ustawia miejsce w pamięci, w którym program (lub jego fragment) zostanie
umieszczony — na przykład wybierając adres startowy przed wpisaniem kodu
maszynowego. Każdy program wymaga co najmniej jednego pliku ORG. Standardowy,
ładowalny kod startowy języka C64 BASIC to `$0801`.

| Argument  | Opis                                                                                        |
| --------- | ------------------------------------------------------------------------------------------- |
| Adres     | Nowy adres źródłowy (np. `0801` w formacie szesnastkowym lub `2049` w formacie dziesiętnym) |
| HEX / DEC | Przełączaj wprowadzanie adresu między wyświetlaniem szesnastkowym i dziesiętnym             |

Składnia:
```
* = $C000
```

Wygenerowany kod:
```
* = $C000
```

Rozmiar: 0 bajtów. ORG sam w sobie nie generuje kodu maszynowego.

Każdy plik ORG rozpoczyna nową sekcję. Kolejne wiersze są składane, zaczynając
od tego adresu. Plik PRG przechowuje wszystkie sekcje w jednym pliku — przerwy
między sekcjami są wypełniane zerami.

Przykład — kod w `$0801`, tabela danych w `$C000`:
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

>Wskazówka: Bez ORG program rozpoczyna się od `$0801` (2049 w systemie
> dziesiętnym), czyli od początku języka BASIC. Z plikiem BASIC SYS (domyślnym)
> asembler umieszcza krótką linię `10 SYS…` w punkcie `$0801`, a kod rozpoczyna
> się od `$080D`. Zobacz [Wyjście: PRG, plik BASIC i punkt
> wejścia](#3-wyjscie-prg-szczatkowy-modu-basic-i-punkt-wejscia).

---

### LOOP / NEXT

Podobnie jak `FOR X=N TO 1 STEP -1 : ... : NEXT X` w języku BASIC — odlicza
od N do 1 przy użyciu rejestru X lub Y. Umieść instrukcje pomiędzy LOOP i NEXT,
a pętla automatycznie wykona odpowiednią liczbę razy.

#### LOOP

| Argument | Opis                                                               |
| -------- | ------------------------------------------------------------------ |
| Rejestr  | `X` lub `Y` — rejestr licznika                                     |
| Liczyć   | Liczba iteracji pętli (szesnastkowa lub dziesiętna, np. `0A` = 10) |
| Etykieta | Automatycznie wygenerowana etykieta pętli (np. `loop0`)            |

Składnia:
```
.loop X, 10, loop0
```

Wygenerowany kod:
```
    LDX #$0A
loop0:
```

Rozmiar: 2 bajty (kod operacji LD_ + bezpośredni operand).

#### NEXT

| Argument | Opis                                      |
| -------- | ----------------------------------------- |
| Rejestr  | Automatycznie dopasowane do rejestru LOOP |
| Etykieta | Automatycznie powiązane z etykietą LOOP   |

Składnia:
```
.next loop0
```

Wygenerowany kod:
```
    DEX
    BNE loop0
```

Rozmiar:3 bajty (DEX + BNE + przesunięcie gałęzi).Przykład — wyczyść 10 komórek ekranu:
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

Podobnie jak `FOR X=0 TO N-1 : ... : NEXT X` w języku BASIC — zlicza *w
górę* od 0. Idealne, gdy potrzebujesz indeksu do przodu, np. podczas
przechodzenia przez ciąg lub tablicę.

#### FOR

| Argument | Opis                                                                                   |
| -------- | -------------------------------------------------------------------------------------- |
| Rejestr  | `X` lub `Y` — rejestr licznika                                                         |
| Liczyć   | Limit pętli (szesnastkowy lub dziesiętny, np. `$12` = 18). X/Y działa od 0 do limit-1. |
| Etykieta | Automatycznie wygenerowana etykieta pętli (np. `dla0`)                                 |

Składnia:
```
.for X, $12, for0
```

Wygenerowany kod:
```
    LDX #$00
for0:
```

Rozmiar: 2 bajty (kod operacji LD_ + `#$00`).

#### ENDF

| Argument | Opis                                       |
| -------- | ------------------------------------------ |
| Rejestr  | Automatycznie dopasowane do rejestru FOR   |
| Etykieta | Automatycznie powiązane z etykietą FOR     |
| Liczyć   | Automatycznie skopiowane z sparowanego FOR |

Składnia:
```
.endf for0
```

Wygenerowany kod:
```
    INX
    CPX #$12
    BNE for0
```

Rozmiar:5 bajtów (IN_ + CP_ #imm + przesunięcie BNE).Przykład — wydrukuj ciąg zakończony zerem:
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

>LOOP vs FOR: LOOP odlicza w dół (N→1) — dobre do opóźnień, wypełnień i
> pętli pikseli. FOR odlicza w górę (0→N) — dobre do dostępu do ciągów
> znaków/tablic. Oba mogą używać X lub Y.

---

### PUSH / PULL

Podobnie jak zapisywanie zmiennych przed GOSUB i przywracanie ich po— ale
wykorzystuje stos sprzętowy 6502. Jeśli podprogram używa A, X lub Y, należy go
opakować za pomocą PUSH i PULL, aby zachować rejestry kodu wywołującego.

#### PUSH

Umieszcza jeden lub więcej rejestrów na stosie. Kolejność jest zawsze
następująca: A → X → Y (najpierw najbardziej wewnętrzny).

| Argument | Opis                                                       |
| -------- | ---------------------------------------------------------- |
| Rejestry | Dowolna kombinacja: `A`, `X`, `Y`, `AX`, `AY`, `XY`, `AXY` |

Składnia:
```
.push AXY
```

Wygenerowany kod (przykład: `AX`):
```
    PHA
    TXA
    PHA
```

Rozmiar: 1 bajt dla A (`PHA`), 2 bajty dla X lub Y (transfer + push).

#### PULL

Przywraca rejestry ze stosu w odwrotnej kolejności(Y → X → A).

| Argument | Opis                                                   |
| -------- | ------------------------------------------------------ |
| Rejestry | Tak samo jak PUSH — musi pasować do odpowiedniego PUSH |

Składnia:
```
.pull AXY
```

Wygenerowany kod (przykład: `AX`):
```
    PLA
    TAX
    PLA
```

>Zasada: Funkcje PUSH i PULL muszą zawsze używać tego samego zestawu
> rejestrów. `PUSH AX` → `PULL AX` (wewnętrznie przywraca w odwrotnej
> kolejności: najpierw X, potem A).

---

### END / RTS alias

Podobnie jak RTS z przyjaźniejszą nazwą makra— `.end` emituje pojedynczy
bajt `RTS`, krótki terminator podprogramu.

Składnia:
```
.end
```

Wygenerowany kod:
```
    RTS
```

Rozmiar: 1 bajt.

Użyj tego, jeśli chcesz uzyskać znacznik końca podprogramu, który wygląda
bardziej jak makro niż surowa instrukcja.

---

### MACRO / ENDM / INVOKE

Podobnie jak nazwany GOSUB z parametrami— zdefiniuj fragment kodu
wielokrotnego użytku raz (MACRO…ENDM), a następnie wywołaj go w dowolnym miejscu
za pomocą INVOKE. Przekazuj za każdym razem różne wartości argumentów zamiast
kopiować i wklejać kod.

#### MACRO (definition start)

| Argument  | Opis                                                                                  |
| --------- | ------------------------------------------------------------------------------------- |
| Nazwa     | Identyfikator makra (np. `setColor`)                                                  |
| Parametry | Opcjonalne nazwy parametrów rozdzielone przecinkami (np. `kolor` lub `kolor, liczba`) |

Oznacza początek definicji makra. Linie między MACRO i ENDM stanowią ciało
makra. Makro z parametrami nie generuje kodu w miejscu, w którym znajduje
się definicja; makro bez parametrów jest również tam montowane jako podprogram
(wywołuje je `nazwa JSR `): przebieg programu przeskakuje nad nim, a na jego
końcu dodawany jest `RTS`. W bibliotece zawartej pod stałym adresem takie makro
otrzymuje również `RTS`. W ciele parametr jest zapisywany jako `{paramName}` lub
jako jego goła nazwa; Wywołanie wypełnia argument — zarówno w operandach
instrukcji, jak i argumentach makr bibliotecznych (`.set_border c`, `.sprite_pos
n, x, y` …). Etykiety, etykiety LOOP i etykiety środowiska wykonawczego `.if` /
`.while` ciała są unikalne dla każdego wywołania. Wywołanie makra wewnątrz ciała
makra nie jest rozwijane (błąd).

Wygenerowany kod:
```
; .MACRO setColor (color)
    ... (body)
; .ENDM
```

Składnia:
```
.macro setColor color
    LDA {color}
    STA $D020
.endm
```

#### ENDM (definition end)

Zamyka bieżącą definicję makra. Brak argumentów.

#### INVOKE

Wywołuje zdefiniowaną makroinstrukcję w tym miejscu i podstawia podane wartości
argumentów w miejsce symboli zastępczych `{paramName}` w treści.

| Argument    | Opis                                                                                         |
| ----------- | -------------------------------------------------------------------------------------------- |
| Nazwa makra | Makro zdefiniowane w programie lub w dołączonym pliku                                        |
| Argumenty   | Wartości argumentów rozdzielone przecinkami, pasujące do listy parametrów makra (np. `#$07`) |

Wygenerowany kod:
```
; .invoke setColor(#$07)
    LDA #$07
    STA $D020
```

Składnia:
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

Treść makra jest rozwijana w linii, a `{paramName}` jest zastępowane
rzeczywistymi argumentami. Akceptowana jest również forma rozdzielona spacjami
(`.invoke setColor #$07`).

Typy argumentów:-Numeryczne: `#$07`, `$10`, `255` — wartości szesnastkowe lub dziesiętne
-Ciągi tekstowe: `„Witaj, świecie!”` — ciągi w cudzysłowie (cudzysłów
  został usunięty); przecinki w cudzysłowie są traktowane jako część tekstu, a
  nie jako separatory argumentów
-Dosłowny znak: `'A'` — pozostaje dosłownym znakiem, więc treść otrzymuje
  swój kod (`$41`)
-Mieszane: `#$07, „cześć”, $20` — dowolna kombinacja

>Wskazówka: Zdefiniuj makra na górze (lub na dole) programu, a następnie
> WYWOŁUJ je w razie potrzeby. Makra można wywoływać wielokrotnie z różnymi
> argumentami.

>2.1: makro może wywołać inne makro (`both(a, b)` wywołując `setc(a)`);
> wywołanie wewnętrzne otrzymuje argumenty wywołania zewnętrznego i własne
> unikalne etykiety lokalne. Makro wywołujące samo siebie zatrzymuje się z
> błędem po 16 poziomach zamiast się zawiesić.

---

### REGION / ENDREGION

Czyste grupowanie dla edytorów i list —zero bajtów, zerowy wpływ na
zmontowany kod.

| Argument      | Opis                                                                           |
| ------------- | ------------------------------------------------------------------------------ |
| Nazwa regionu | Etykieta tekstu dowolnego dla sekcji (np. `init`, `game_loop`, `sprite_setup`) |

Składnia:
```
.region init
    ; code...
.endregion
```

Wygenerowany kod:
```
; region init
    SEI
    LDA #$00
    STA $D020
; endregion init
```

Rozmiar: 0 bajtów dla regionu REGION i ENDREGION.

>Uwaga: Regiony mogą być zagnieżdżane w sobie. Każdy ENDREGION zamyka
> najbliższy otwarty REGION. Nie ma to wpływu na zmontowany wynik.

---

### DEFINE / IF / ELSE / ENDIF

Podobnie jak przełącznik, który asembler odczytuje— `DEFINE DEBUG` włącza
symbol, a następnie wiersze dowolnej gałęzi `IF DEBUG` są asemblowane, a jej
gałąź `ELSE` jest pomijana. Usunięcie DEFINE powoduje zniknięcie części IF z
wyniku. Nie ma potrzeby usuwania kodu w kompilacjach wersji.

#### DEFINE

| Argument | Opis                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------ |
| Symbol   | Jeden lub więcej identyfikatorów rozdzielonych przecinkami do aktywacji (np. `DEBUG` lub `DEBUG, PAL`) |

Składnia:
```
.define DEBUG, PAL
```

Wygenerowany kod:
```
; .DEFINE DEBUG
; .DEFINE DEBUG, PAL
```

`DEFINE` może aktywować wiele symboli jednocześnie (rozdzielonych przecinkami).
Umieść DEFINE na początku programu.

#### IF

| Argument | Opis                                                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Stan     | Symbol `.define`d (aktywny), nazwa `.const` (aktywna, gdy nie jest równa zero) lub wyrażenie stałe (`LEVEL == 2`, `MODE i 1`) |

Składnia:
```
.if DEBUG
```

Wygenerowany kod:
```
; .IF DEBUG
```

Wiersze między `IF` i `ENDIF` (lub `ELSE`) są asemblowane lub pomijane przez
warunek. Nazwa bez wartości jest prawdziwa, gdy jest to `.define`d lub różna od
zera `.const`, a nie prawdziwa, gdy nie jest żadną z nich; każdy inny warunek
musi być wyrażeniem stałym — taki, którego nie można ocenić w trakcie
asemblacji, jest błędem. Pominięte wiersze są wyświetlane jako komentarze `; [IF
skipped] …` i generują zerowe bajty.

#### ELSE

Brak argumentów. Oznacza gałąź alternatywną — montowaną, gdy warunek `JEŻELI`
jest *nie* aktywny.

Składnia:
```
.else
```

Wygenerowany kod:
```
; .ELSE
```

#### ENDIF

Brak argumentów. Zamyka część warunkową.

Składnia:
```
.endif
```

Wygenerowany kod:
```
; .ENDIF
```

Rozmiar: 0 bajtów dla wszystkich czterech dyrektyw. Liczy się tylko
zawartość *pomiędzy*.

Przykład — debugowanie granicy flash, kompilacja wydania pomija to:
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

Przykład — wiele symboli w jednym DEFINE:
```
; .DEFINE DEBUG, PAL

; .IF PAL
    LDA #$xx        ; PAL timing constant
; .ELSE
    LDA #$xx        ; NTSC timing constant
; .ENDIF
```

Obsługiwane są zagnieżdżone `IF`. Jeśli pominięta zostanie część zewnętrzna,
części wewnętrzne również zostaną pominięte.

>Uwaga: To jest obsługa warunków w czasie kompilacji. Informacje na temat
> porównywania/rozgałęziania w czasie wykonania można znaleźć poniżej w sekcji
>Instrukcje IF / ELSE / ENDIF w czasie wykonania.

### .ASSERT

Kontrola poprawności w czasie kompilacji. `.assert` ocenia wyrażenie podczas
asemblacji; jeśli jest ono fałszywe (`0`), kompilacja zatrzymuje się z wyraźnym
błędem zawierającym rzeczywistą wartość. Jeśli jest ono prawdziwe (różne od
zera), nie jest emitowane.

| Argument  | Opis                                                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Wyrażenie | Dowolne wyrażenie asemblera: etykiety, `CONST`s, `*` (licznik programów), arytmetyka i porównania (`<`, `<=`, `>`, `>=`, `==`, `!=`) |
| Wiadomość | Opcjonalny tekst dołączony do komunikatu o błędzie                                                                                   |

Składnia:
```
.assert spriteData < $C000
.assert * < $A000
.assert end - start <= 256, "sprite table overflowed one page"
```

Zachowanie:-Rozmiar: 0 bajtów.
- Fałszywe potwierdzenie przerywa montaż: `` `.assert end - start <= 256` jest
  fałszywe (wartość: 0). Tabela sprite'ów przepełniła się o jedną stronę ``
- Twierdzenie, którego nie można ocenić (niezdefiniowana etykieta itp.) również
  kończy się niepowodzeniem, z komunikatem *„nie można ocenić w momencie
  montażu”*.
- Porównania dają `1` / `0`; umieść `.assert` w dowolnym miejscu przebiegu
  programu — jest on sprawdzany pod adresem, pod którym się znajduje, więc
  `.assert * < $D000` testuje bieżącą pozycję wyjściową.

Przykład — ochrona danych sprite'ów przed przekroczeniem strony:
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

Podobnie jak zmienna o nazwie, która nigdy się nie zmienia— `SCREEN =
$0400`. Użyj nazwy zamiast wpisywać wszędzie surowe adresy, dzięki czemu kod
będzie łatwiejszy do odczytania i późniejszej modyfikacji.

| Argument | Opis                                                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Nazwa    | Identyfikator stałej (np. `SCREEN`)                                                                                                   |
| Wartość  | Wartość liczbowa w wybranej bazie (np. `0400` w formacie HEX = adres $0400) lub wyrażenie względne względem komputera (patrz poniżej) |
| Format   | HEX lub DEC — kontroluje sposób wprowadzania i wyświetlania wartości                                                                  |

Składnia:
```
.const SCREEN = $0400
.const FRAMES_1S = 60
```

Wygenerowany kod:
```
; .CONST SCREEN = $0400
```

Wyrażenia względne względem PC (`*+N` / `*-N`):

Wartość akceptuje również `*+N` lub `*-N`, gdzie `*` to adres wiersza `.const`.
Służy to do utworzenia nazwanego aliasu dla bajtu w pobliskiej instrukcji —
klasyczny wzorzec kodu samomodyfikującego:

```
.const op = *+1      ; op → address of the immediate operand of the next LDA
LDA #$00            ; $00 will be patched at runtime
...
STA op              ; overwrites the #$00 byte → LDA reads the new value next time
```

CONST emituje 0 bajtów, etykieta w momencie kompilacji zmienia się na
`current_address + 1`.

Wyrażenia arytmetyczne:

Wartość akceptuje ogólną arytmetykę, w tym odwołania do wcześniej zdefiniowanych
nazw CONST, literałów szesnastkowych/binarnych i wbudowanych funkcji
matematycznych:

```
.const SCREEN      = $0400
.const SCREEN_END  = SCREEN + 40*25   ; 1000 bytes later
.const COLOR_RAM   = $D800
.const MID_X       = 160
.const SIN_TABLE   = round(sin(PI/8) * 127)   ; pre-computed sine value
```

Funkcje wbudowane:`sin()`, `cos()`, `round()`, `max(a,b)`, `min(a,b)`,
`abs()`, constant `PI`

Operatorzy: `+ - * /` Literały: `$FF` (szesnastkowy), `%10110000` (binarny) Bajt
młodszy/starszy: `lo(wyrażenie)`, `hi(wyrażenie)`

Rozmiar: 0 bajtów.

---

### VAR

Podobnie jak CONST, ale automatycznie przydzielane— `VAR` rezerwuje
miejsce na stronie zerowej dla etykiety bez konieczności wpisywania adresu.
Używaj go do liczników, wskaźników i krótkotrwałych stanów, które należą do ZP.

| Argument              | Opis                                                                          |
| --------------------- | ----------------------------------------------------------------------------- |
| Nazwa                 | Nazwa/etykieta zmiennej                                                       |
| Rozmiar (opcjonalnie) | Liczba bajtów do zarezerwowania. Pomiń, jeśli chcesz zarezerwować jeden bajt. |

Składnia:
```
.var counter
.var timer, 2
.var lives
```

Przykład praktyczny:
```
.region Vars
.var counter
.var timer, 2
.endregion

LDA #$00
STA counter
```

Wygenerowany kod:
```
; .var counter
```

Rozmiar: domyślnie 1 bajt lub `N` bajtów, gdy określono rozmiar.

Alokator przesuwa konfigurowalny kursor strony zerowej (`$02` do `$FE`) i
przypisuje kolejny wolny slot. Jeśli żądany region nakłada się na już używaną
etykietę, kompilator generuje ostrzeżenie.

---

### Runtime IF / ELSE / ENDIF

Podobnie jak prawdziwy szablon gałęzi— ta wersja działa w czasie
wykonywania, a nie kompilacji. Porównuje `A`, `X` lub `Y` z wartością
bezpośrednią i generuje poprawną sekwencję gałęzi `CMP` / `CPX` / `CPY` za
Ciebie.

| Argument | Opis                                          |
| -------- | --------------------------------------------- |
| Rejestr  | `A`, `X` lub `Y`                              |
| Operator | `==`, `!=`, `<`, `<=`, `>`, `>=`              |
| Wartość  | Wartość natychmiastowa w formacie HEX lub DEC |

Składnia:
```
.if A == #$10
    LDA #$07
.else
    LDA #$0F
.endif
```

Rozmiar: Zależy od wybranych gałęzi i formy porównania.

Porównanie jest domyślnie bez znaku. W przypadku `<=` i `>` makro rozszerza się
do najkrótszego równoważnego łańcucha rozgałęzień dla wybranego rejestru.

---

### WHILE / ENDW

Podobnie jak pętla czasu wykonania z testem na górze— treść jest wykonywana
tak długo, jak długo warunek pozostaje prawdziwy.

| Argument | Opis                                          |
| -------- | --------------------------------------------- |
| Rejestr  | `A`, `X` lub `Y`                              |
| Operator | `==`, `!=`, `<`, `<=`, `>`, `>=`              |
| Wartość  | Wartość natychmiastowa w formacie HEX lub DEC |

Składnia:
```
.while A != #$00
    JSR getchar
.endw
```

Rozmiar: Zależy od treści pętli i formy porównania.

Użyj `WHILE`, jeśli pętla może zakończyć się przed zakończeniem pierwszej
iteracji. Jest to odpowiednik w czasie wykonywania funkcji pomocniczej
`LOOP/NEXT` opartej na zliczaniu.

---

### REPEAT / UNTIL

Podobnie jak pętla czasu wykonania z testem na dole— treść zawsze jest
uruchamiana co najmniej raz, a następnie warunek decyduje, czy się zatrzymać.

| Argument | Opis                                          |
| -------- | --------------------------------------------- |
| Rejestr  | `A`, `X` lub `Y`                              |
| Operator | `==`, `!=`, `<`, `<=`, `>`, `>=`              |
| Wartość  | Wartość natychmiastowa w formacie HEX lub DEC |

Składnia:
```
.repeat
    JSR getchar
.until A == #$00
```

Rozmiar: Zależy od treści pętli i formy porównania.

Użyj `REPEAT / UNTIL`, jeśli chcesz, aby treść została wykonana co najmniej raz
przed sprawdzeniem wyjścia.

---

### MEMCPY / MEMSET

Podobnie jak małe procedury pamięci, po które ciągle sięgasz— `MEMCPY`
kopiuje ciągły blok, `MEMSET` wypełnia zakres jednym bajtem.

| Makro            | Argumenty                     |
| ---------------- | ----------------------------- |
| `MEMCPY`         | `źródło`, `dst`, `rozmiar`    |
| `ZESTAW PAMIĘCI` | `adres`, `wartość`, `rozmiar` |

Składnia:
```
.memcpy src=$C000, dst=$D000, size=$0100
.memset addr=$0400, value=#$20, size=$03E8
```

Wygenerowany kod: pętle kopiowania/wypełniania w tekście, dobrane tak, aby
odpowiadały żądanemu rozmiarowi.

Rozmiary do 256 bajtów korzystają z krótkiej pętla 8-bitowej. Większe rozmiary
automatycznie przełączają się na licznik 16-bitowy.

>2.1: rozmiar musi być znany podczas układania kodu — liczba lub stała.
> Etykieta zdefiniowana później (której wartość układ jeszcze nie zna) jest
> błędem, a nie kodem, który nie pasuje do swojego miejsca.

---

### PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY / SET_BORDER / SET_BG

#### PRINT

Podobnie jak wyjście PETSCII bez szablonu— drukuje ciąg przez `CHROUT` z
takim samym traktowaniem wielkich/małych liter (`mniejsze`) jak `.petscii`.

Składnia:
```
.print "HELLO"
.print "hello", lower
```

#### PRINT_CHAR

Drukuje jeden bajt PETSCII według kodu numerycznego i wysyła go przez `CHROUT`.
Wartość może być również nazwaną stałą lub etykietą, która w momencie montażu
jest przekształcana na bajt.

Składnia:
```
.print_char 65
.print_char $41
.print_char color
```

#### PRINT_HEX

Drukuje 8-bitową wartość jako tekst szesnastkowy poprzez normalną ścieżkę
wyjściową KERNAL.

Składnia:
```
.print_hex A
```

#### CLEAR_SCREEN

Skrót do standardowego kodu sterującego czystym ekranem w C64.

Składnia:
```
.clear_screen
```

#### WAIT_KEY

Czeka, aż zostanie naciśnięty klawisz, dzięki czemu nie musisz ręcznie powtarzać
pętli `GETIN` za każdym razem.

Składnia:
```
.wait_key
```

#### DELAY

Oczekuje żądaną liczbę klatek w ramach współdzielonej procedury pomocniczej.
Używaj tego w przypadku krótkich przerw i przerw w synchronizacji, gdy pełna
pętla niestandardowa byłaby przesadą. Liczba klatek może być liczbą całkowitą
lub stałą o określonej nazwie, a `.wait` to po prostu alias `.delay`.

Składnia:
```
.delay 29
.wait 29
.delay frames=FRAMES_1S
```

#### SET_BORDER / SET_BG

Wygodne opakowania dla rejestrów kolorów VIC-II. Wartość koloru może być liczbą
całkowitą lub nazwaną stałą z zakresu 0–15.

Składnia:
```
.set_border 6
.set_bg 0
.set_border color
.set_bg color
```

Rozmiar: Każdy pomocnik rozszerza się do małej sekwencji zapisu do rejestru
lub krótkiego wywołania KERNAL.

---

### IRQ_SETUP

Konfiguruje obsługę przerwań rastrowych w jednym kroku. Makro zapisuje wektor
IRQ, włącza przerwania rastrowe, ustawia linię, wyłącza typowe źródła IRQ CIA i
powraca do normalnego wykonywania za pomocą `CLI`.

| Argument | Opis                                                                |
| -------- | ------------------------------------------------------------------- |
| Treser   | Etykieta procedury IRQ (np. `my_irq`)                               |
| Raster   | Linia rastrowa w systemie szesnastkowym lub dziesiętnym (np. `$FA`) |

Składnia:
```
.irq_setup handler=my_irq, raster=$FA
```

Rozmiar: Krótka sekwencja ustawień; dokładna długość zależy od wybranej
linii rastrowej.

Użyj tego, jeśli chcesz mieć standardowy kod „SEI / install handler / enable IRQ
/ CLI” bez rozpraszania go po całym programie.

---

### RAND

Podobnie jak niewielki wbudowany PRNG— zwraca 8-bitową pseudolosową wartość
z kompaktowego ziarna zerowej strony.

| Argument | Opis                                                          |
| -------- | ------------------------------------------------------------- |
| Nasienie | Opcjonalny bajt lub etykieta zerowej strony (domyślnie `$FB`) |

Składnia:
```
.rand
```

Rozmiar: Kilka bajtów, w zależności od wybranej ścieżki implementacji.

Generator jest przeznaczony do rozgrywki, modyfikacji efektów i szybkiego
testowania danych. Jest celowo niewielki, a nie kryptograficznie skomplikowany.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Konfiguruje sprite'a VIC-II w jednym wierszu — zamiast pisać ~6 poleceń POKE w
BASIC-u. Ustawia wskaźnik danych sprite'a, włącza go, opcjonalnie włącza tryb
wielokolorowy i ustawia jego kolor.

| Argument      | Opis                                                                      |
| ------------- | ------------------------------------------------------------------------- |
| Sprite #      | Numer duszka 0–7                                                          |
| Kolor         | Indeks kolorów 0–15 (paleta C64)                                          |
| Strona danych | Adres danych sprite'a / 64 (np. `$21`, jeśli dane znajdują się w `$0840`) |
| Wielobarwność | Przełącza wielokolorowy bit sprite'a (`$D01C`)                            |

Składnia:
```
.sprite_init 0, 7, $21
.sprite_init 0, 7, $21, multicolor
.sprite_init 0, 7, $21, mono
```

Wygenerowany kod:
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

Rozmiar: 26 bajtów.

>Strona danych sprite'a:`adres_danych ÷ 64`. Z domyślnym stubem BASIC
> SYS, `ALIGN 64` po `JMP main` umieszcza dane sprite'a w `$0840` → strona =
> `$21`.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Podobnie jak `POKE 53248, x : POKE 53249, y` w BASIC-u — ustawia pozycję
początkową sprite'a. Współrzędne są wbudowywane w momencie montażu i akceptują
stałe; do animacji użyj `INC`/`DEC` bezpośrednio w rejestrze sprite'a.

| Argument | Opis                  |
| -------- | --------------------- |
| Sprite # | Numer duszka 0–7      |
| X        | Pozycja pozioma 0–319 |
| Y        | Pozycja pionowa 0–255 |

Składnia:
```
.sprite_pos 0, 152, 100
```

Wygenerowany kod (przykład: sprite 0, X=152, Y=100):
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

Rozmiar: 18 bajtów.

>Uwaga:`SPRITE_POS` wstawia współrzędne X/Y do kodu (`LDA #$xx`). Aby
> animować sprite'a w czasie wykonywania, użyj `INC $D000` / `DEC $D000` —
> zobacz przykład `sprite-macro-demo`.

---

<a id="wait_raster"></a>
### WAIT_RASTER

Czeka, aż wiązka elektronów VIC-II dotrze do określonej linii skanowania – jak
synchronizacja z ramką telewizora. Umieść to na początku pętli gry, aby zapobiec
rozrywaniu sprite'ów. Bez JSR, bez etykiety.

| Argument       | Opis                                                                    |
| -------------- | ----------------------------------------------------------------------- |
| Linia rastrowa | Docelowa linia rastrowa w formacie szesnastkowym (np. `FF` = linia 255) |

Składnia:
```
.wait_raster $FF
```

Wygenerowany kod:
```
wait:
    LDA $D012       ; current raster line
    CMP #$FF        ; target line
    BNE wait        ; loop back (-7 bytes)
```

Rozmiar: 7 bajtów (przesunięcie `BNE` `$F9` = −7 zawsze wskazuje z powrotem
na `LDA`).

>Wskazówka: Umieść `WAIT_RASTER` na górze pętli gry, aby zsynchronizować ją
> z wyświetlaczem i zapobiec rozrywaniu się sprite'ów.

---

### JOYSTICK

Jak odczytanie `PEEK($DC00)`, a następnie POKE-owanie pozycji sprite'a — ale
w jednym wierszu. Odczytuje jeden port joysticka CIA i odpowiednio dostosowuje
rejestry X/Y sprite'a. Całkowicie inline, bez potrzeby JSR.

| Argument | Opis                                                                       |
| -------- | -------------------------------------------------------------------------- |
| Port     | `1` = port 1 (`$DC01`) lub `2` = port 2 (`$DC00`)                          |
| Sprite # | Numer duszka 0–7 (kontroluje, która para rejestrów X/Y jest aktualizowana) |

Składnia:
```
.joystick 2, 0
```

Wygenerowany kod (port 2, sprite 0):
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

Mapa bitów joysticka (aktywny-NISKI — bit = 0 oznacza wciśnięty):

| Fragment | Kierunek   | Rejestr CIA                               |
| -------- | ---------- | ----------------------------------------- |
| 0        | W górę     | $DC00 (port 2) / $DC01 (port 1)           |
| 1        | W dół      |                                           |
| 2        | Lewy       |                                           |
| 3        | Prawidłowy |                                           |
| 4        | Ogień      | (nieobsługiwane przez tę makroinstrukcję) |

Rozmiar: 27 bajtów. Przesunięcie `BCS` zawsze wynosi `+3` (pomija
następującą 3-bajtową instrukcję `DEC`/`INC abs`).

Tryb zmienny — `.port joysticka, vx, vy[, fire]`: zamiast przesuwać duszka,
kierunek zapisywany jest w zmiennych: `vx` / `vy` = `-1` / `0` / `+1` (`$FF` /
`$00` / `$01`), a opcjonalnie `fire` = `1` podczas naciskania przycisku, W
przeciwnym razie użyj `0`. Użyj go do przewijania kamery, odtwarzacza z własną
fizyką lub menu. Port `3` odczytuje oba porty joysticka jednocześnie (`LDA
$DC00` / `AND $DC01`), więc oba porty działają.

```
.joystick 2, vx, vy          ; 35 bytes
.joystick 3, vx, vy, fire    ; both ports + fire: 45 bytes
```

>Typowe zastosowanie: Umieść w etykiecie `gameloop` najpierw `WAIT_RASTER`:
> ```
> Pętla gry:
> WAIT_RASTER ($FF)
> JOYSTICK (port=2, sprite=0)
> Pętla gry JMP
> ```

---

<a id="mouse"></a>

>2.1: port musi być znany podczas tworzenia kodu (liczba lub stała),
> ponieważ port 3 wydłuża kod o 3 bajty; etykieta zdefiniowana później jest
> błędem.
### MOUSE

Odczytuje dane z myszy proporcjonalnej Commodore 1351 i przesuwa sprite'a.
Całkowicie inline— bez JSR ani etykiety. Makro wybiera port CIA, czeka na
ustabilizowanie się sygnałów wejściowych z łopatki SID, a następnie dekoduje
ruch delta za pomocą standardowego wzorca sterownika 1351 i stosuje go do
rejestrów sprite'a.

| Argument  | Opis                                                                                     |
| --------- | ---------------------------------------------------------------------------------------- |
| Port      | `1` = CIA `$DC00` bitów `7:6` = `%01`; `2` = `%10`                                       |
| Sprite #  | Numer duszka 0–7                                                                         |
| Bajt ZP X | Adres strony zerowej (szesnastkowy) do przechowywania poprzedniej próbki POTX (np. `FD`) |
| Bajt ZP Y | Adres strony zerowej (szesnastkowy) do przechowywania poprzedniej próbki POTY (np. `FE`) |

Wygenerowany kształt kodu (port 1, sprite 0, ZP `$FD`/`$FE`):

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

Rozmiar:142 bajty.Składnia:
```
.mouse port, spriteNum, zpX, zpY
; example:
.mouse 2, 0, FD, FE
```

>Ważne: Przed pierwszym wywołaniem zainicjuj bajty strony zerowej bieżącymi
> wartościami POTX/POTY, aby uniknąć przeskoku w pierwszej ramce:
> ```
> ; port 1: LDA $DC00 : AND #$3F : ORA #$40 : STA $DC00
> ; port 2: LDA $DC00 : AND #$3F : ORA #$80 : STA $DC00
> LDA $D419 : LSR A : AND #$3F : STA $FD
> LDA $D41A : LSR A : AND #$3F : STA $FE
> ```

>Wskazówka: Odczytuj ruch myszy raz na klatkę — umieść `WAIT_RASTER` w
> pętli gry przed `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Podobnie jak `PEEK($D01E)` w BASIC-u — sprawdza rejestry kolizji sprzętowych
VIC-II i informuje, czy sprite uderzył w inny sprite lub tło. Całkowicie inline,
bez potrzeby JSR.

| Argument    | Opis                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------- |
| Sprite #    | Numer duszka 0–7 (bit, który duszek należy sprawdzić)                                             |
| Typ kolizji | `Sprite-Sprite ($D01E)` — kolizja z innym sprite'em; `Sprite-Tło ($D01F)` — kolizja z grafiką tła |

Składnia:
```
.sprite_col 0, sprite
.sprite_col 0, background
```

Wygenerowany kod (sprite 0, sprite–sprite):
```
    LDA $D01E       ; read sprite-sprite collision register (clears it!)
    AND #$01        ; isolate bit 0 (sprite 0)
                    ; A ≠ 0 → collision occurred
```

Rozmiar: 5 bajtów.

>Ważne: Odczytanie `$D01E`/`$D01F`czyści rejestr. Odczytuj go raz na
> klatkę i natychmiast wykonaj działanie na wyniku za pomocą `BEQ`/`BNE`.

Typowe zastosowanie:
```
gameloop:
    .wait_raster $FF
    .joystick 2, 0
    .sprite_col 0, sprite
    BEQ no_hit          ; A = 0 → no collision
    LDA #$02
    STA $D020           ; red border = hit!
    JMP gameloop
no_hit:
    LDA #$0E
    STA $D020           ; light blue border = clear
    JMP gameloop
```

>Zobacz także:`przykład kolizji` — zielona kula (sprite #0) kontra
> czerwony krzyż (sprite #1).

---

### LOADFILE

Podobnie jak `LOAD „plik”, 8` w BASIC-u — ładuje plik z dysku D64 w czasie
wykonywania za pomocą procedury KERNAL LOAD. Użyj tej funkcji, aby załadować
dane, muzykę lub dodatkowy kod z dysku podczas działania programu.

| Argument                     | Opis                                                                                                                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nazwa pliku                  | Nazwa pliku na dysku (maks. 16 znaków, automatycznie wielkie litery; filtrowane są znaki `,`, `"`, `/`, `\`, `:`, `*`, `?`, `<`, `>`, `|`)                                                                    |
| Urządzenie                   | Numer urządzenia 8–30 (domyślnie `8`)                                                                                                                                                                         |
| Zastąp adres (opcjonalnie)   | Adres ładowania szesnastkowego (np. `C000`). Jeśli ustawiony, plik jest ładowany pod ten adres (`sec=0`, ignorując nagłówek PRG). Pozostaw puste, aby użyć własnego 2-bajtowego nagłówka PRG pliku (`sec=1`). |
| Etykieta błędu (opcjonalnie) | Jeśli ustawione, instrukcja `BCS` jest generowana po JSR LOAD. Jeśli KERNAL zwróci wartość z ustawionym przeniesieniem (błąd), wykonanie zostanie przeskoczone do tej etykiety.                               |

Składnia:
```
.loadfile "DEMO-COLORS", 8
.loadfile "DEMO-COLORS", 8, $C000
.loadfile "DEMO-COLORS", 8, $C000, error_label
```

Wygenerowana struktura kodu:
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

Rozmiar:`3 + długość_nazwy_pliku + 9 (SETNAM) + 9 (SETLFS) + (4 w
przypadku nadpisania) + 5 (WCZYTAJ) + (2 w przypadku etykiety błędu) ` bajtów.
Minimum 27 bajtów.

>Ważne: Nazwa pliku jest zapisywana w kodzie maszynowym zaraz po `JMP
> skip_filename`. Nazwa pliku na dysku musi być zapisana wielkimi literami
> PETSCII — co odpowiada wielkim literom w ASCII (`A`–`Z`). Makro wymusza to
> automatycznie.

>Zawsze używaj etykiety błędu w programach produkcyjnych — jeśli plik nie
> zostanie znaleziony, KERNAL ustawia flagę przeniesienia, a wykonywanie zostaje
> przerwane i przechodzi do następnego kroku.

>Zobacz także:`przykład loadfile-demo` — demonstruje ładowanie
> `DEMO-COLORS.PRG` z D64 z gałęzią błędu BCS i wizualnym ekranem błędu.

---

### EXODECRUNCH

Dekompresja Exomizera w programie . Użyj tej makry zaraz po poleceniu
`LOADFILE`, które załadowało strumień skompresowany w trybie Exomizera `mem` —
EXODECRUNCH rozpakuje ją wstecz do adresu osadzonego w strumieniu.

| Argument       | Opis                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| Adres depakera | Miejsce w pamięci, w którym znajduje się kod depakera (domyślnie `B000`). Musi to być 16-bitowy adres szesnastkowy. |

Składnia:
```
.exodecrunch
.exodecrunch depacker=$B000
```

Wygenerowany kod (19 bajtów):
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

Jak to działa:

1. KERNAL `LOAD` ($FFD5) aktualizuje ZP `$AE/$AF` do punktu znajdującego się
   jeden za ostatnim załadowanym bajtem. EXODECRUNCH kopiuje to do ZP `$04/$05`,
   co jest oficjalną konwencją wstecznego kodu źródłowego Exomizera.
2. Depaker jest zazwyczaj umieszczony w `$B000` (w regionie mapowanym na ROM
   BASIC). Makro przełącza `$01 = $36`, aby procesor widział tam pamięć RAM
   podczas JSR, a następnie przywraca `$01 = $37`.
3. Adres docelowy dekompresji jest kodowany w samym strumieniu
   skompresowanym podczas kompresji za pomocą `exomizer mem -l <load>
   plik,<target>` — depaker odczytuje go z pierwszych bajtów strumienia.

Plik binarny depakera: wstępnie skompilowany depaker wsteczny to
`exo-decrunch.bin` (w folderze `samples/` w C64 Visual Assembler) (477 bajtów,
ORG $B000). Jest to wersja Kick Assemblera oficjalnego pliku `exodecrunch.asm` z
dodanym do każdego odczytu `INC $D020` dla widocznego efektu border-flash
podczas dekompresji. Umieść go w swoim programie z `.incbin` pod adresem
depakera.

Surowe dane wejściowe: dodatkowy plik jest przekazywany do Exomizera jako
surowy plik ładowany pod adresem Dst (`plik@<Dst>`), więc depacker zapisuje
każdy bajt, zaczynając od pierwszego, dokładnie pod wpisanym adresem.

>Zobacz także: przykład `exo-multicolor-demo` — pełny przykład od początku
> do końca: WCZYTAJ skompresowaną wielokolorową mapę bitową do $C000,
> EXODECRUNCH rozpakowuje ją do $2000, następnie kopiuje ekran → $0400 i kolor →
> $D800, a następnie przełącza VIC-II w tryb wielokolorowej mapy bitowej.

---

### REU_CHECK

Wykrywa, czy podłączona jest jednostka rozszerzeń pamięci RAM Commodore (REU) —
na przykład sprawdza obecność sprzętu w rejestrze `PEEK($D010)`. Testy polegają
na zapisie i odczycie dwóch wzorców do rejestru REU `$DF04`.

| Argument | Opis           |
| -------- | -------------- |
| Nic      | Brak operandów |

Wygenerowany kod (34 bajty):
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
> Makro normalizuje wynik, więc poniższa gałąź pozostaje prosta: `BNE` oznacza
> obecność REU, `BEQ` oznacza brak REU.

Składnia:
```
.reu_check
```

Wynik we flagach:-Z = 0(wynik ≠ 0) → obecność REU → użycie `BNE`
-Z = 1(wynik = 0) → brak REU → użyj `BEQ`Brak argumentów— makro generuje ten sam kod za każdym razem.Typowe zastosowanie:
```assembly
.reu_check
BEQ no_reu        ; skip if REU not present
; ... REU code here ...
no_reu:
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

Argumenty:

| Argument  | Opis                                               | Przykład |
| --------- | -------------------------------------------------- | -------- |
| Adres C64 | Źródło/cel w pamięci RAM C64 (hex)                 | `C000`   |
| Adres REU | Źródło/cel w REU (szesnastkowo, 16-bit)            | `0000`   |
| Bank REU  | Bank pamięci REU (0–7)                             | `0`      |
| Długość   | Liczba bajtów do przesłania (szesnastkowo, 16-bit) | `1000`   |

Składnia:
```
.reu_stash $C000, $0000, 0, $1000
.reu_fetch $C000, $0000, 0, $1000
.reu_swap $C000, $0000, 0, $1000
```

Wygenerowany kod (40 bajtów):
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

>Uwaga: polecenia używają `$90/$91/$92` (ustawiony bit 4 = natychmiastowy
> tryb DMA). Zapis do `$DF01` rozpoczyna transfer; procesor wznawia działanie po
> jego zakończeniu.

---

### TURBO_SET

Ustawia prędkość procesora Ultimate-64 (U64) za pomocą rejestru `$D031`. Nie
ma to wpływu na prawdziwy C64 ani inne emulatory.

Argumenty:

| Argument  | Opis                         | Zakres                                      |
| --------- | ---------------------------- | ------------------------------------------- |
| Prędkość  | Wskaźnik prędkości procesora | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz        |
| Zła linia | Emulacja Badline             | Włączone (zgodne z C64) / Wyłączone (turbo) |

Bajt prędkości obliczany jest w następujący sposób: `(speedIndex & 0x0F) |
(badline_disabled ? 0x80 : 0x00)`.

Wygenerowany kod (5 bajtów):
```
A9 xx   LDA #speed_byte
8D 31 D0   STA $D031
```

Składnia:
```
.turbo_set 7,0    ; speed=7 (~10 MHz), badline enabled
.turbo_set 15,1   ; speed=15 (~48 MHz), badline disabled
```

>Uwaga: Ta makroinstrukcja dotyczy tylko sprzętu U64. Na prawdziwym C64
> lub innych emulatorach zapisuje ona do `$D031`, co może mieć wpływ na CIA lub
> zostać zignorowane.

---

### SUPERCPU_DETECT

Sprawdza, czy zainstalowany jest akcelerator CMD SuperCPU— na przykład
`PEEK($D0B8)`, aby sprawdzić, czy zwraca on coś innego niż `$FF`.

Wygenerowany kod (5 bajtów):
```
AD B8 D0   LDA $D0B8
C9 FF      CMP #$FF
```

Wynik we flagach:-Z = 0→ obecny SuperCPU → użyj `BNE`
-Z = 1→ Nie znaleziono SuperCPU → użyj `BEQ`Brak argumentów.

Składnia:
```
.supercpu_detect
```

Typowe zastosowanie:
```assembly
.supercpu_detect
BEQ no_scpu       ; skip if SuperCPU not present
; ... SuperCPU turbo code here ...
no_scpu:
```

---

### TURBO_ENABLE

Włącza lub wyłącza tryb turbo CMD SuperCPU. Najpierw wywołaj
`SUPERCPU_DETECT` i pomiń tę opcję, jeśli SuperCPU nie jest obecny.

| Tryb     | Rejestr | Efekt                              |
| -------- | ------- | ---------------------------------- |
| Włączać  | `$D07A` | Włącz turbo (do 20 MHz z SuperCPU) |
| Wyłączyć | `$D07B` | Powrót do trybu zgodności 1 MHz    |

Wygenerowany kod (5 bajtów):
```
A9 00         LDA #$00
8D 7A D0      STA $D07A    ; (or $D07B for disable)
```

Składnia:
```
.turbo_enable on
.turbo_enable off
```

>Uwaga: Najpierw wywołaj `SUPERCPU_DETECT` i rozgałęzij się wokół tej
> makroinstrukcji, jeśli SuperCPU nie jest obecny.

---

<a id="map_copy"></a>
### MAP_COPY

Kopiuje mapę kafelków z adresu źródłowego do pamięci RAM ekranu (i opcjonalnie
pamięci RAM kolorów) za pomocą serii pętli `LDA abs,X` / `STA abs,X`. Każda
iteracja pętli kopiuje jedną stronę 256-bajtową; część strony na końcu
zatrzymuje się za pomocą `CPX #rem / BNE`. JSR nie jest potrzebny — cały kod
jest generowany inline.

| Argument               | Opis                                                                                                                                                                                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Adres źródłowy (ekran) | Adres szesnastkowy, pod którym znajdują się dane mapy po załadowaniu (np. `C000`)                                                                                                                                                                                  |
| Pamięć RAM ekranu dest | Gdzie kopiować kody ekranowe (np. `0400`)                                                                                                                                                                                                                          |
| Rozmiar (bajty)        | Łączna liczba bajtów do skopiowania — typowo `$03E8` = 1000 (40×25 znaków)                                                                                                                                                                                         |
| Źródło koloru          | `auto`: dane koloru podążają za kodami ekranowymi (`źródło + rozmiar`); lub jawnym adresem źródłowym koloru. Dane koloru są kopiowane do pamięci RAM kolorów w drugim przebiegu. Pomiń ten element (i miejsce docelowe koloru), aby skopiować tylko kody ekranowe. |
| Pamięć RAM koloru      | Miejsce docelowe dla danych o kolorze — domyślne `D800` (pamięć RAM kolorów C64)                                                                                                                                                                                   |

Wygenerowany kod (mapa 1000-bajtowa, tylko ekran):
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

Rozmiar:`2 (LDX) + pełne strony×9 + (rem > 0 ? 11 : 0)` bajtów na sekcję.
Tryb łączony podwaja tę liczbę (sekcja ekranu + sekcja identycznego koloru).

Parowanie z edytorem map:

Edytor map w C64 Visual Assembler (Zapisz mapę + pamięć RAM kolorów)
eksportuje pojedynczy plik binarny, w którym pierwsze bajty `size` to kody
ekranu, a kolejne bajty `size` to wartości pamięci RAM kolorów. Użyj `.map_copy`
z `auto` jako źródłem koloru i adresem źródłowym, pod którym załadowany jest ten
plik (np. z `.incbin` w `$C000`):

```
    .incbin "map-color.bin", $C000   ; screen codes $C000–$C3E7, color $C3E8–$C7CF
    ; ...
    .map_copy $C000, $0400, 1000, auto, $D800
```

Składnia:
```
.map_copy $C000, $0400, 1000               ; screen only
.map_copy $C000, $0400, 1000, auto, $D800  ; combined (color at src+size)
.map_copy $C000, $0400, 1000, $C3E8, $D800 ; explicit color source address
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Kopiuje obszar znaków o wymiarach 16×16 z kompaktowego, 256-bajtowego bloku kodu
ekranowego oraz pasującego do niego 256-bajtowego bloku pamięci RAM kolorów.
Jest przeznaczony do eksportów kanw Charset i małych fragmentów
kafelków/obrazów, gdzie zapis szesnastu oddzielnych wierszy MAP_COPY byłby
uciążliwy.

Domyślny układ:

| Dane                                | Domyślny adres                |
| ----------------------------------- | ----------------------------- |
| Kody ekranowe 16×16                 | Adres źródłowy (`źródło`)     |
| 16×16 wartości kolorów              | `źródło + 256`                |
| Miejsce docelowe pamięci RAM ekranu | `$0400 + wiersz×40 + kolumna` |
| Miejsce docelowe pamięci RAM koloru | `$D800 + wiersz×40 + kolumna` |

Składnia:
```
.map_copy16x16 $3000, 12, 4
.map_copy16x16 $3000, 12, 4, $0400, $3100, $D800
```

Krótsza wersja kopiuje bajty ekranu z `$3000`, bajty koloru z `$3100` i
umieszcza blok 16×16 w kolumnie 12, wierszu 4. Prawidłowe pozycje w lewym górnym
rogu to `col = 0..24` i `row = 0..9`, więc cały obszar 16×16 pozostaje na
ekranie tekstowym C64 o wymiarach 40×25.

Wygenerowane zachowanie:

- Generuje szesnaście kopii wierszy.
- Każdy wiersz kopiuje 16 bajtów ekranu i 16 bajtów koloru.
- JSR nie jest potrzebny; kod jest emitowany bezpośrednio w pozycji makra.
- Działa w trybie znakowym normalnym i wielokolorowym. Bajty pamięci RAM kolorów
  przenoszą bit włączający kolor znaku/wielokolorowość każdej komórki.

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

Przesuwa klatkę animacji sprite'a przy każdym wywołaniu i aktualizuje wskaźnik
danych sprite'a VIC-II. Przechowuje jeden bajt na klatkę w tabeli (numer strony
danych sprite'a = `data_address / 64`), wskazuje na niego SPRITE_ANIM i wywołuje
go raz na klatkę gry — bez potrzeby JSR.

| Argument          | Opis                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| Sprite #          | Numer duszka 0–7                                                                                       |
| Adres listy ramek | Adres szesnastkowy tabeli ramek — jeden bajt na ramkę, każdy bajt = strona sprite'a (`data_addr / 64`) |
| Liczba klatek     | Łączna liczba klatek (1–255)                                                                           |
| Rama ZP           | Bajt strony zerowej używany jako licznik ramek (np. `FB`)                                              |

Wygenerowany kod (sprite 0, 4 klatki, ZP `$FB`, lista w `$C100`):
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

Rozmiar:19 bajtów.Typowe zastosowanie:
```
frameTable:
    .byte $21, $22, $23, $24   ; 4 frames at $0840, $0880, $08C0, $0900

gameloop:
    .wait_raster $FF
    .sprite_anim 0, $C100, 4, $FB
    JMP gameloop
```

Składnia:
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; example:
.sprite_anim 0, C100, 4, FB
```

>Wskazówka: Umieść tablicę ramek z `.rawbytes` pod stałym adresem. Bajt
> licznika ZP (`$FB`) musi zostać zainicjowany do `$00` przed pierwszym
> wywołaniem. Jeśli Twój kod używa `$FB` do czegoś innego, wybierz wolną
> lokalizację ZP.

---

<a id="score_bcd"></a>
### SCORE_BCD

Dodaje wartość stałego punktu do wielobajtowego wyniku BCD przechowywanego w
pamięci, a następnie renderuje każdą cyfrę do pamięci RAM ekranu jako znak kodu
ekranu. Używa trybu dziesiętnego 6502 (`SED`/`CLD`) do arytmetyki BCD z
zachowaniem przenoszenia — bez konieczności ręcznego żonglowania
przeniesieniami.

| Argument     | Opis                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------ |
| Adres wyniku | Adres szesnastkowy bajtów wyniku BCD (np. `C200`). Najpierw bajt młodszy.                  |
| Cyfry        | Liczba bajtów BCD (każdy bajt zawiera dwie cyfry: `$99` = "99"). `4` bajtów = do 99999999. |
| Dodaj punkty | Wartość dziesiętna do dodania podczas każdego wywołania (np. `100`).                       |
| Adres ekranu | Gdzie wpisać kody ekranowe cyfr (np. `0400`). Jeden bajt na cyfrę (najpierw wyższy bit).   |

Składnia:
```
.score_bcd $C200, 4, 100, $0400
```

Wygenerowany kod (4 bajty, +100 punktów, wynik na poziomie `$C200`, ekran na
poziomie `$0400`):
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

Rozmiar:`3 + cyfry×8` bajtów (narzut SED + CLC + CLD + 8 bajtów na bajt BCD
dla ADC + pętla wyświetlania).

Składnia:
```
.score_bcd $C200, 4, 100, $0400
```

>Wskazówka: Zainicjuj bajty wyniku do `$00` podczas uruchamiania. Adres
> wyniku powinien znajdować się na stronie zerowej lub w pamięci RAM
> bezwzględnej — a nie ROM. Adres ekranu powinien wskazywać na skrajnie lewą
> komórkę cyfrową; cyfry są zapisywane od lewej do prawej (najbardziej znaczący
> bajt na początku).

> Zakres BCD:`cyfry = 4` bajtów → 8 cyfr dziesiętnych → maks. wynik 99 999
> 999. Każdy bajt koduje dwie cyfry BCD: `$00`–`$99`.

---

## 7. Składnia w stylu KickAssembler

VMA odczytuje również typowe formaty KickAssembler, dlatego kod źródłowy
KickAssembler często kompiluje się w takiej postaci:

- `.pc = $1000` i `*=$1000 "name"` ustawiają adres (nazwa segmentu jest
  ignorowana).
- `.const NAZWA = wartość` i `.label NAZWA = wartość` definiują stałe; `.label
  NAZWA = *`, `.label NAZWA = * + 1` umieszcza etykietę pod bieżącym adresem
  (lub w jego pobliżu).
- `.macro name(p1, p2) { … }` — ciało makra w nawiasach klamrowych, oprócz
  `.macro … .endm`; `:name(args)` i `name(args)` wywołują to.
- `nazwa: { … }Zakresy `: etykiety wewnątrz są lokalne dla `nazwa`
  (`nazwa.label` z zewnątrz).
- Etykiety `@label` zachowują swoje `@`.
- Tekst `.tekst „…”` bez współrzędnych ekranowych przechowuje zakodowane bajty,
  takie jak `.bajt`. Kilka elementów można połączyć za pomocą `,` lub `+`:
  `”…”`, `@”…”` za pomocą sekwencji ucieczki `\n` `\r` `\t` `\$NN` i `$NN` /
  bajtów dziesiętnych. `.encoding „nazwa”` wybiera kodowanie następujących
  wierszy `.text`: `screencode_mixed` (domyślne), `screencode_upper`,
  `petscii_mixed`, `petscii_upper`, `ascii`; znak, dla którego kodowanie nie ma
  kodu, jest błędem.
- Sufiksy mnemoniczne `.abs` / `.a` i `.zp` / `.z` wymuszają adresowanie
  absolutne lub adresowanie strony zerowej: `sta.abs $00FC,x`, `ldx.zp ptr,y`.
- `// …` komentarze.

Resztą języka KickAssembler (`.for`, `.var` / `.eval`, `.function`,
`.pseudocommand`, `#import`, `#if`, `LoadBinary`, segments …) zajmuje się
preprocesor Kick w C64 Visual Assembler, który zamienia drzewo źródłowe
KickAssembler na tekst VMA.

## 8. Wiersz poleceń

Nowości w wersji 2.1.0: `--crt` / `--crt-name` (kartridż) i `--d64` / `--add` /
`--disk-name` (obraz dysku).

```
vma build <input.asm> [options]
vma --help
vma --version
```

| Opcja                      | Oznaczający                                                                                                                                                                                                                              |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-o PLIK`                  | PRG do zapisu (domyślnie: dane wejściowe z rozszerzeniem `.prg`)                                                                                                                                                                         |
| `--katalog bazowy DIR`     | Gdzie najpierw wyszukiwane są pliki `.incbin` / `.koala` / `.level` / `.sid` / `.include` (domyślnie: folder wejściowy)                                                                                                                  |
| `--szukaj DIR`             | Kolejny folder do przeglądania po katalogu bazowym (można go powtarzać w kolejności); ścieżka zapisana na innym komputerze sprowadza się do jego podstawowej nazwy pliku                                                                 |
| `--bez-podstawowego-stub`  | Brak wiersza `10 SYS…` BASIC przed kodem                                                                                                                                                                                                 |
| `--surowy`                 | Sam obraz w jego pierwszym ORG: brak szczątkowego, brak przeniesienia do `$C000`                                                                                                                                                         |
| `--crt PLIK`               | Kaseta Magic Desk (CRT typu 19, 8 banków × 8 KB, maksymalnie 65 408 bajtów): moduł ładujący kopiuje program na adres ładowania i uruchamia go pod adresem SYS — CRT kompilacji Visual Assembler. Bez `-o` nie jest zapisywany żaden PRG. |
| `--crt-name NAZWA`         | Nazwa wkładu w nagłówku CRT (domyślnie: `VA CART`)                                                                                                                                                                                       |
| `--d64 [PLIK]`             | Obraz dysku 1541 z plikiem PRG, nazwanym na jego podstawie (domyślny PLIK: PRG z rozszerzeniem `.d64`); nie jest wymagany c1541. Bez `-o` żaden plik PRG nie zostanie zapisany.                                                          |
| `--dodaj PLIK`             | Kolejny plik na dysku w obecnej postaci (PRG z adresem ładowania), nazwany na cześć pliku (można powtarzać w kolejności)                                                                                                                 |
| `--nazwa-dysku NAZWA`      | Nazwa dysku (domyślnie: nazwa pliku D64; ID `01`)                                                                                                                                                                                        |
| `--sym PLIK`               | Plik etykiet KickAssembler (`.label NAME=$xxxx`)                                                                                                                                                                                         |
| `--w porównaniu z PLIKIEM` | Plik etykiety monitora VICE (`al C:xxxx .NAME`; `x64sc -moncommands FILE`)                                                                                                                                                               |
| `--dbg PLIK`               | Mapa źródłowa RetroDebugger / C64 Debugger (XML)                                                                                                                                                                                         |
| `--debugowanie`            | Wszystkie trzy obok PRG (`out.sym`, `out.vs`, `out.dbg`)                                                                                                                                                                                 |
| `--PLIK json`              | Kompilacja w formacie JSON: PRG, adres SYS, symbole, linie rozłożone, segmenty pisane, widok pamięci — czyli każdy błąd z jego linią                                                                                                     |
| `--ścieżka-źródłowa NAZWA` | Główne źródło nazw `.dbg` (domyślnie: dane wejściowe)                                                                                                                                                                                    |
| `--mapa linii PLIK`        | Tablica JSON: wiersz wejściowy → wiersz nazw `.dbg`                                                                                                                                                                                      |

Status wyjścia: skompilowano `0`, błąd kompilacji `1` (`PLIK:LINIA: komunikat`
na standardowym wyjściu błędów, jedna linia na błąd), `2` nieprawidłowe użycie.

```
vma build game.asm -o game.prg --debug
vma build game.asm --no-basic-stub --search ../assets
vma build game.asm --crt game.crt                    # the cartridge only
vma build game.asm --d64 --add music.prg             # game.d64 with GAME and MUSIC
```

## 9. Znane ograniczenia

VMA odtwarza bajt po bajcie kompilator Visual Assembler języka C64,
uwzględniając jego niedoskonałości:

- `lda.zp c` → `LDA $0C`: przy użyciu `.zp` symbol składający się z cyfr
  szesnastkowych jest odczytywany jako liczba.
- Ciało makra bez parametrów jest również składane w miejscu jego zdefiniowania;
  definicja przed pierwszym `* =` pojawia się na początku programu.
- `.text X, Y, "s", 80` analizuje przesunięcie znaku, ale go nie używa.
- Bajty `.chardef` są szesnastkowe (`129` = `$129`, błąd).
- Niebezpośredni operand funkcji wykonawczej `.if` / `.while` / `.until` jest
  odczytywany jako adres: `%bin` to błąd, a `10` to wartość szesnastkowa
  (`$0010`).
- Procedura pomocnicza DELAY działa po ostatnim wierszu układu i każdej sekcji
  danych — nawet w przypadku pominiętego (`.if 0`) DELAY.

Naprawiono w wersji 2.1 (podano błędny kod lub wcześniej wystąpił błąd): operand
`.const` / `.var` na stronie zerowej, `JMP (etykieta)`, `lda $1234+1`, wywołanie
makra wewnątrz makra, nierozwiązana wartość TURBO_SET / SPRITE_ANIM (teraz
błąd), etykiety w bajtach `.data` / `.rawbytes`, etykieta `:name`, której celem
jest etykieta, rozmiar JOYSTICK / MEMCPY / MEMSET z późniejszej etykiety (teraz
błąd), automatyczny bufor `.data` / `.rawbytes` i dołączone pliki (brak jednego
z nich jest błędem, wczytywane są własne pliki dołączonego pliku `.include` /
`.incbin` / `.sid`).
