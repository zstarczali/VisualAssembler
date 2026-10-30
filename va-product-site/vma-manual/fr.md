# VMA — Assembleur de macros visuel

**Manuel de langue · version 2.1.0**

VMA est l'assembleur 6502/6510 de [C64 Visual
Assembler](https://github.com/zstarczali/VisualAssembler) — le langage de son
mode Expert et celui utilisé pour écrire ses programmes par blocs. Ce manuel
décrit le langage ; l'éditeur, la palette de blocs et les autres outils de
l'application sont décrits dans le manuel de C64 Visual Assembler.

## Contenu

1. [Format source](#1-source-format)
2. [Nombres et expressions](#2-numbers-and-expressions)
3. [Sortie : PRG, stub BASIC et point
   d'entrée](#3-output-prg-basic-stub-and-entry-point)
4. [Modes d'adressage](#4-addressing-modes)
5. [6502 instructions](#5-6502-instructions)
6. [Directives et macros — référence](#6-directives-and-macros--reference)
7. [Syntaxe de style KickAssembler](#7-kickassembler-style-syntax)
8. [Ligne de commande](#8-command-line)
9. [Limitations connues](#9-known-limitations)

---

## 1. Format source

Une source VMA est du texte brut, une instruction par ligne. La casse n'a pas
d'importance pour les mnémoniques et les directives (`lda`, `LDA`, `.BYTE`,
`.byte`) ; les noms d'étiquettes sont sensibles à la casse.

```
; un commentaire — ainsi que // un commentaire
* = $1000 ; ORG : assembler à partir de $1000
start : ; une étiquette (le deux-points est obligatoire)

lda #$06 ; une instruction : mnémonique et opérande

sta $D020

.byte $01, $02, $FF ; une directive commençant par un point
loop : dex ; une étiquette et une instruction sur une ligne

bne loop

rts
```

- **Les commentaires** commencent par `;` ou `//` et se poursuivent jusqu'à la
  fin de la ligne (pas à l'intérieur d'une chaîne entre guillemets).
- Les étiquettes sont écrites sous la forme nom: — lettres, chiffres et _, ne
  commençant pas par un chiffre. Une étiquette peut figurer sur sa propre ligne
  ou en début d'instruction. Un nom commençant par un point (boucle:) est une
  étiquette locale (voir Étiquettes locales (pointées) (#local-dotted-labels)).
  Les étiquettes - et + sont des étiquettes anonymes, référencées par bne - /
  beq + (l'étiquette la plus proche avant/après).
- **Instructions** sont un mnémonique et un opérande ; l'indentation est libre.
- **Directives** commencent par un point (`.byte`, `.macro`, `.if` …); `* =
  $xxxx` (ou `.pc = $xxxx`) définit l'adresse.
- **Les macros utilisateur** sont appelées comme `:name(args)`, `.invoke
  name(args)`, `.call name(args)` ou `name(args)`.

## 2. Nombres et expressions

| Formulaire       | Exemple        | Valeur                                                                                            |
| ---------------- | -------------- | ------------------------------------------------------------------------------------------------- |
| Hexadécimal      | `$D020`, `$0F` | préfixe `$`                                                                                       |
| Binaire          | `%00001111`    | préfixe `%`                                                                                       |
| Décimal          | `255`, `40*25` | pas de préfixe                                                                                    |
| Personnage       | `'A'`          | son code (`$41`)                                                                                  |
| Adresse actuelle | `*`            | l'adresse de la ligne (voir [Le compteur de programme `*`](#the--program-counter-in-expressions)) |

Dans les opérandes des instructions, écrivez les nombres hexadécimaux avec `$`.
Dans les arguments d'adresse des macros de bibliothèque (`.rawbytes C000, …`,
`.sprite_init 0, 1, 80`), un nombre simple de un à quatre chiffres est lu en
hexadécimal.

**Opérateurs** (dans les opérandes, `.const`, `.fill`, `.assert`, `.if`) : `+ -
* / %`, `& | ^ ~`, `<< >>`, parenthèses, `<expr` (octet de poids faible) et
`>expr` (octet de poids fort), et dans les conditions `== != < > <= >=` (vrai =
1, faux = 0). `.fill`, `.const` et autres connaissent également `lo()`, `hi()`,
`sin()`, `cos()`, `round()`, `min()`, `max()`, `abs()` et `PI`.

```
.const B = 7

lda #(B+1)*2

lda #B & 3 | 8

lda #~B & $FF

ldx #'A'

lda #<screen ; octet de poids faible d'une étiquette

lda #>(*+63) ; octet de poids fort d'une adresse relative au compteur ordinal
```

## 3. Sortie : PRG, stub BASIC et point d’entrée

VMA écrit un PRG ** ** C64 : une adresse de chargement de deux octets suivie de
l’image mémoire. Chaque section ORG et chaque directive qui place des données à
une adresse spécifique (`.rawbytes `, `.incbin `, `.sid `…) est intégrée dans
une seule image ; les espaces entre elles sont des zéros.

- **Sans un ORG** le programme démarre à `$0801`, où BASIC démarre.
- **Basic SYS stub** (par défaut) : une ligne `10 SYS nnnn` est placée à
  `$0801`, de sorte que le programme démarre par `RUN`. Un programme dont le
  premier ORG est `$0801` démarre alors à `$080D`. Désactivez le stub avec
  `--no-basic-stub` ; sans lui, un programme situé à `$0801` est assemblé à
  `$C000`, tout autre reste à son premier ORG.
- **Point d'entrée :** la ligne SYS saute au début du code, ou à l'adresse
  nommée par un commentaire de première ligne ` ; Point d'entrée : $1234`.
- **Code sous la ligne BASIC** (un ORG inférieur à `$0801` avec le stub) : un
  petit chargeur démarre le programme et le déplace en place, de sorte qu'il
  démarre toujours avec `RUN`.
- Une source qui commence par sa propre ligne BASIC SYS (`.byte $0B, $08, $0A,
  $00, $9E, …` à `$0801`) est émise telle quelle, sans deuxième stub.

À partir du PRG, la ligne de commande crée également une **cartouche** et une
**image disque** (nouveauté de la version 2.1.0, voir [8. Ligne de
commande](#8-command-line)) :

- `--crt FILE` — une cartouche Magic Desk (CRT type 19, 8 banques de 8 Ko,
  maximum 65 408 octets de programme). Un chargeur dans la banque 0 initialise
  le KERNAL, exécute une routine de copie depuis la RAM à l'adresse
  `$0100–$013B` qui déplace le programme vers son adresse de chargement (en
  changeant de banque via `$DE00`), éteint la cartouche et saute au point
  d'entrée. Évitez de placer le programme dans `$0100–$013B` et dans les octets
  de page zéro `$02–$04` / `$FB–$FE` utilisés par le chargeur.
- `--d64 [FILE]` — une image disque 1541 (35 pistes) avec le PRG nommé d'après
  elle, plus les fichiers `--add`, disposés comme le DOS 1541 les écrit ; pas de
  c1541 nécessaire.

---

## 4. Modes d'adressage

Chaque instruction 6502 prend en charge un ou plusieurs modes d'adressage. Le
VMA sélectionne le mode en fonction de la façon dont l'opérande est écrit.

| Mode          | Étiquette         | Exemple       | Description                                                                                   |
| ------------- | ----------------- | ------------- | --------------------------------------------------------------------------------------------- |
| **implicite** | Implicite         | `NOP`         | Aucun opérande ; l’instruction est autonome.                                                  |
| **immédiat**  | Immédiat          | `LDA #$FF`    | Constante en ligne ; l’assembleur ajoute automatiquement `#`.                                 |
| **zéroPage**  | Page zéro         | `LDA $10`     | Adresse mono-octet en page zéro (0–255)                                                       |
| **zéroPageX** | Page zéro,X       | `LDA $10,X`   | Adresse de page zéro + décalage du registre X (le résultat est renvoyé à la page 0)           |
| **zéroPageY** | Page zéro,Y       | `LDX $FB,Y`   | Adresse de page zéro + décalage du registre Y                                                 |
| **absolu**    | Absolu            | `LDA $0400`   | Adresse mémoire complète sur 16 bits                                                          |
| **absoluteX** | Absolu,X          | `LDA $0400,X` | Adresse 16 bits + décalage du registre X                                                      |
| **absoluteY** | Absolu,Y          | `LDA $0400,Y` | Adresse 16 bits + décalage du registre Y                                                      |
| **relatif**   | Relatif/Étiquette | `Boucle BNE`  | Pour les instructions de succursale, veuillez saisir un nom d'étiquette ou une adresse cible. |
| **indirectX** | Indirect,X        | `LDA ($FB,X)` | Indexation indirecte de la page zéro (opérande = adresse de la page zéro, 1 octet)            |
| **indirectY** | Indirect,Y        | `LDA ($FB),Y` | Indexation indirecte de la page zéro (opérande = adresse de la page zéro, 1 octet)            |
| **indirect**  | Indirect          | `JMP ($0100)` | Indirect ; utilisable uniquement avec JMP                                                     |

### Constantes de la page zéro

Un opérande composé uniquement de constantes (`.const`, `name = value`, a
`.var`) qui tient dans un octet prend le mode **page zéro** de l'instruction,
exactement comme le ferait le nombre : après `.const zp = $FB`, `lda zp`
s'assemble en `A5 FB` (2 octets, 3 cycles) et `lda zp,x` en `B5 FB`. Un mode
pour lequel l'instruction n'a pas de forme de page zéro reste absolu (`lda zp,y`
→ `B9 FB 00`). Une étiquette n'est pas réduite — son adresse n'est connue
qu'après la mise en page — et `lda.abs zp` force le mode absolu. Un nombre
conserve la largeur avec laquelle il est écrit : `$FB` est une page zéro,
`$00FB` est absolu. *(Nouveau dans la version 2.1.)*

### Les expressions étiquetées comme opérandes

Tout opérande acceptant une adresse ou une valeur immédiate accepte également
directement un nom de constante (une constante ou une étiquette). De plus, vous
pouvez utiliser les expressions étiquette+décalage ou étiquette−décalage pour
référencer une adresse relative à une constante nommée.

| Syntaxe             | Exemple                            | Description                                                                                                                                            |
| ------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `étiquette`         | `STA screen_ram,X`                 | Se résout à la valeur de l'étiquette/constante                                                                                                         |
| `label+$hex`        | `STA screen_ram+$0100,X`           | Adresse de l'étiquette plus un décalage hexadécimal                                                                                                    |
| `étiquette+décimal` | `STA screen_ram+256,X`             | Adresse de l'étiquette plus un décalage décimal                                                                                                        |
| `label-$hex`        | `Tableau LDA-$10`                  | Adresse de l'étiquette moins un décalage hexadécimal                                                                                                   |
| `$hex+expr`         | `LDA $1234+1`, `STA $0400+40*2,X`  | Toute expression de nombres, d'étiquettes et de constantes *(2.1)*                                                                                     |
| `(étiquette)`       | `JMP (vecteur)`, `JMP (tableau+2)` | Saut indirect à travers une étiquette ou une expression *(2.1)*                                                                                        |
| `#<label`           | `LDA #<screen_ram`                 | Octet de poids faible de l'adresse de l'étiquette                                                                                                      |
| `#>étiquette`    | `LDA #>screen_ram`              | Octet de poids fort de l'adresse de l'étiquette                                                                                                        |
| `*`                 | `BNE *`                            | Compteur de programme actuel (l'adresse propre à l'instruction) ; les branchements avec `*` génèrent une boucle infinie sur elle-même (décalage `$FE`) |

**Exemple — effacer deux pages d'écran à l'aide d'une CONST : **
```
; .CONST screen_ram = $0400

LDX #$00
clear:

STA screen_ram,X

STA screen_ram+$0100,X

DEX

BNE clear
```

### Le compteur de programme `*` dans les expressions

`*` ne se limite plus à l'opérande entier ; il peut apparaître ** n'importe où
dans une expression d'opérande ** et représente l'adresse de l'instruction sur
laquelle il est écrit. Il est résolu lors de l'assemblage par rapport à
l'adresse réelle de cette instruction ; aucune étiquette n'est donc nécessaire
pour les sauts relatifs courts ou les lectures de données relatives au compteur
ordinal.

| Syntaxe             | Exemple                    | Signification                                                                    |
| ------------------- | -------------------------- | -------------------------------------------------------------------------------- |
| `*`                 | `BNE *`                    | Branchement à soi-même (boucle infinie, décalage `$FE`)                          |
| `*-n` / `*+n`       | `BNE *-5`, `BEQ *+4`       | Branchement relatif au PC actuel de *n* octets                                   |
| `JMP *+n`           | `JMP *+20`                 | Saut absolu calculé à partir du PC actuel                                        |
| `#<*` / `#>*` | `LDA #<*`, `LDA #>*` | Octet de poids faible / de poids fort du PC actuel                               |
| `#>(*+n)`        | `LDA #>(*+63)`          | Octet de poids faible / de poids fort d'une adresse relative au compteur ordinal |

**PC vs. multiplication.** `*` est traité comme le compteur de programme
uniquement lorsqu'il se trouve en position de valeur ** — au début de
l'expression, ou juste après un opérateur, `(`, `,`, `<`, `>` ou un
espace. Un `*` qui suit un nombre, `)` ou un identificateur est une
multiplication ordinaire, donc `LDA table*2` et `CONST_A*4` restent inchangés.

**Où cela fonctionne.** Tout opérande acceptant déjà une expression : cibles de
branchement, `JMP` / `JSR`, `LDA`/`STA`/… opérateurs absolus et indexés,
immédiats (octets de poids faible/fort) et l’expression `.assert`. `*` ne
modifie jamais la taille d’une instruction ; son utilisation est donc sûre dans
tous les modes d’adressage.

### Étiquettes locales (en pointillés)

Une étiquette dont le nom commence par un point — `.loop`, `.skip`, `.done` —
est une étiquette locale. Elle appartient à la portée de l'étiquette globale
(non pointée) précédente la plus proche et devient en interne <global>.<nom>.
Deux étiquettes locales portant le même nom court et appartenant à des
étiquettes globales différentes ne se chevauchent pas.

```
DessinerSprite :

LDX #0
.loop : ; == DrawSprite.loop

LDA SpriteData,X

STA $2000,X

INX

CPX #63

BNE .loop ; se résout dans DrawSprite

RTS

EffacerÉcran :

LDX #0
.loop : ; == ClearScreen.loop — pas de conflit

STA $0400,X

INX

BNE .loop

RTS
```

- Dans une portée, référencez une étiquette locale comme `.name`.
- Depuis une autre portée, référencez-le explicitement comme `Global.name` (par
  exemple `JMP ClearScreen.loop`).
- Un `.name` écrit avant toute étiquette globale reste un simple `.name` de
  niveau supérieur.

### Étiquettes d'opérandes à code auto-modifiable

Préfixez l'opérande d'une instruction par `label:` pour placer une étiquette sur
l'octet d'opérande **** plutôt que sur le code opération. L'instruction est
assemblée à partir de ce qui suit les deux-points.

```
Configuration :

LDA valeur : #$00 ; « valeur » -> adresse de l’octet d’opérande #$00

… Correctif :

LDA #nouveau

STA valeur ; écrit directement l’octet d’opérande — SMC classique
```

`valeur` pointe vers `<adresse d'instruction> + 1` (le premier octet
d'opérande), pour chaque mode d'adressage. Ceci remplace l'ancien modèle `STA
instruction+1` / `instruction : LDA #$00`.

---

## 5. Instructions 6502

### Mouvement de données

| Mnémonique | Description              | Modes                                                               |
| ---------- | ------------------------ | ------------------------------------------------------------------- |
| `LDA`      | Accumulateur de charge   | immédiat, page zéro, absolu, absoluX, absoluY, indirectX, indirectY |
| `LDX`      | Registre Charger X       | immédiat, page zéro, page zéroY, absolu, absoluY                    |
| `LDY`      | Registre de chargement Y | immédiat, page zéro, absolu, absoluX                                |
| `STA`      | Accumulateur de stockage | page zéro, absolu, absoluX, absoluY, indirectX, indirectY           |
| `STX`      | Caisse du magasin X      | page zéro, page zéroY, absolu                                       |
| `STY`      | Caisse du magasin Y      | page zéro, absolu                                                   |

### Arithmétique

| Mnémonique | Description             | Notes                                                                    |
| ---------- | ----------------------- | ------------------------------------------------------------------------ |
| `ADC`      | Ajouter avec transport  | Réglez le transport avec `SEC` avant utilisation dans la plupart des cas |
| `SBC`      | Soustraire avec retenue | Retenue à `SEC` avant soustraction                                       |
| `INC`      | Incrémenter la mémoire  | —                                                                        |
| `DÉC`      | Décrémenter la mémoire  | —                                                                        |
| `CMP`      | Comparer avec A         | Définit les indicateurs ; ne modifie pas A                               |
| `CPX`      | Comparer avec X         | —                                                                        |
| `CPY`      | Comparer avec Y         | —                                                                        |

### Logique

| Mnémonique | Description                                                                  |
| ---------- | ---------------------------------------------------------------------------- |
| `ET`       | Opérateur logique ET avec accumulateur                                       |
| `ORA`      | OU logique avec accumulateur                                                 |
| `EOR`      | OU exclusif avec accumulateur                                                |
| `BIT`      | Tester les bits en mémoire par rapport à A (définit les indicateurs N, V, Z) |

### Sauts et branches

| Mnémonique | Description                                                                |
| ---------- | -------------------------------------------------------------------------- |
| `JMP`      | Saut inconditionnel (absolu ou indirect)                                   |
| `JSR`      | Passer à la sous-routine (l'adresse de retour est sauvegardée sur la pile) |
| `RTS`      | Retour de la sous-routine                                                  |
| `RTI`      | Retour de l'interruption                                                   |
| `BNE`      | Brancher si différent (Z=0)                                                |
| `BEQ`      | Brancher si égal (Z=1)                                                     |
| `BCC`      | Branchement si retenue nulle (C=0)                                         |
| `BCS`      | Branchement si ensemble de retenue (C=1)                                   |
| `IMC`      | Branchement si moins (N=1)                                                 |
| `BPL`      | Brancher si Plus (N=0)                                                     |
| `BVC`      | Branchement si Overflow Clear (V=0)                                        |
| `BVS`      | Branchement si l'ensemble de débordement (V=1)                             |

#### LBNE / LBEQ / … (Longues branches)

Huit pseudo-opérations se comportent comme des branchements conditionnels mais
atteignent n'importe quelle adresse, et pas seulement −128…+127. Chacune d'elles
se combine pour former un branchement inversé qui saute un JMP de 3 octets —
toujours 5 octets :

```
LBEQ terminé ; assemblage en : BNE *+3 ($D0 $03)

; JMP terminé ($4C lo hi)
```

| Long op | Condition                     | Émis sous forme de    |
| ------- | ----------------------------- | --------------------- |
| `LBNE`  | non égal (Z=0)                | `BEQ *+3 / Cible JMP` |
| `LBEQ`  | égal (Z=1)                    | `BNE *+3 / JMP cible` |
| `LBCC`  | consigne claire (C=0)         | `BCS *+3 / Cible JMP` |
| `LBCS`  | ensemble de retenue (C=1)     | `BCC *+3 / Cible JMP` |
| `LBMI`  | moins (N=1)                   | `BPL *+3 / Cible JMP` |
| `LBPL`  | plus (N=0)                    | `IMC *+3 / Cible JMP` |
| `LBVC`  | débordement clair (V=0)       | `BVS *+3 / Cible JMP` |
| `LBVS`  | ensemble de débordement (V=1) | `BVC *+3 / Cible JMP` |

- Opérande : une étiquette, une expression `*` ou une adresse littérale —
  identique à une cible de branchement normale.
- Coût : 5 octets et 1 cycle supplémentaire sur le chemin emprunté par rapport à
  une branche courte. Il n’y a pas de promotion automatique d’une branche courte
  ; vous devez choisir explicitement `LBxx`.
- Lorsqu'une branche simple (`BNE`, `BEQ`, …) est hors de portée, l'erreur du
  compilateur nomme désormais le dépassement exact et suggère le `LBxx`
  correspondant.

### Opérations de caisse

| Mnémonique | Description                       |
| ---------- | --------------------------------- |
| `TAXE`     | Transfert A → X                   |
| `TAY`      | Transfert A → Y                   |
| `TXA`      | Transfert X → A                   |
| `TYA`      | Transfert Y → A                   |
| `TSX`      | Pointeur de pile de transfert → X |
| `TXS`      | Transfert X → Pointeur de pile    |
| `INX`      | Incrément X                       |
| `DEX`      | Décrémenter X                     |
| `INY`      | Incrément Y                       |
| `DEY`      | Décrémenter Y                     |

### Décalage et rotation

| Mnémonique | Description                              |
| ---------- | ---------------------------------------- |
| `ASL`      | Décalage arithmétique vers la gauche     |
| `LSR`      | Décalage logique vers la droite          |
| `ROL`      | Rotation à gauche à travers le transport |
| `ROR`      | Rotation à droite à travers Carry        |

### Empiler

| Mnémonique | Description                                   |
| ---------- | --------------------------------------------- |
| `PHA`      | Empiler l'accumulateur                        |
| `PHP`      | Empiler l'état du processeur                  |
| `PLA`      | Retirer l'accumulateur de la pile             |
| `PLP`      | Récupérer l'état du processeur depuis la pile |

### Système / Drapeaux

| Mnémonique | Description                                   |
| ---------- | --------------------------------------------- |
| `CLC`      | Drapeau Clear Carry                           |
| `CLD`      | Effacer le mode décimal                       |
| `CLI`      | Effacer l'interruption désactivée             |
| `CLV`      | Effacer le drapeau de débordement             |
| `SEC`      | Drapeau de transport                          |
| `SED`      | Activer le mode décimal                       |
| `SEI`      | Désactiver l'interruption                     |
| `NOP`      | Aucune opération                              |
| `BRK`      | Interruption forcée / interruption logicielle |

### Instructions illégales / non documentées

Ces puces sont conçues pour une utilisation avancée. À utiliser avec précaution
: leur comportement peut varier d’une puce à l’autre.

`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`,
`AXS`, et les formes `NOP` qui lisent un opérande : `NOP #$nn` ($80), `NOP $nn`
($04), `NOP $nn,X` (14 $), `NOP $nnnn` ($0C), `NOP $nnnn,X` ($1C)

---

## 6. Directives et macros — référence

Les directives contrôlent l'assemblage (étiquettes, données, origine,
conditions, macros utilisateur) ; les macros de la bibliothèque exécutent les
tâches courantes du C64 en une seule ligne : au lieu d'écrire 10 à 20
instructions à la main, vous écrivez une seule ligne et l'assembleur génère le
code. On peut les considérer comme des sous-programmes intégrés.

---

### LABEL

Comme un numéro de ligne ** en BASIC** — mais avec un nom au lieu d'un numéro.
Cibles de saut pour `JMP`, `JSR`, `BNE`, etc.

| Argument           | Description                                        |
| ------------------ | -------------------------------------------------- |
| Nom de l'étiquette | Identifiant utilisé dans `JMP`, `JSR`, `BNE`, etc. |

**Syntaxe : **
```
boucle:
```

**Code généré : **
```
boucle : ; $0820
```

L'adresse actuelle est affichée en commentaire. Les étiquettes ont une taille de
**0 octets**.

---

### COMMENT

Comme **REM en BASIC** — une note pour vous-même que l'assembleur ignore
complètement.

**Syntaxe : **
```
Votre commentaire ici
```

**Code généré : **
```
Votre commentaire ici
```

---

### BYTE

Comme **DATA en BASIC** — stocke une liste de valeurs d'octets bruts directement
dans le programme.

| Argument | Description                                                                             |
| -------- | --------------------------------------------------------------------------------------- |
| Opérande | Valeurs d'octets séparées par des virgules (par exemple `$01, $02, $FF` ou `1, 2, 255`) |

**Syntaxe : **
```
.octet $01, $02, $FF
```

**Code généré : **
```
.octet $01, $02, $FF
```

** Références d'étiquettes d'octets de poids faible/haut : ** BYTE accepte les
jetons `<étiquette` (octet de poids faible) et `>étiquette` (octet de poids
fort) de style KickAssembler/ca65, ainsi que des valeurs numériques.
L'assembleur résout l'adresse de l'étiquette lors de la compilation et insère
l'octet approprié. Exemple :

```
.octet <frame_0, >frame_0, <frame_1, >frame_1
```

Ce bloc stocke l'octet de poids faible de l'adresse de la trame 0 ` `, puis
l'octet de poids fort, et ainsi de suite pour la trame 1 ` `. Utile pour la
construction de tables de branchement et de listes d'adresses.

**Taille :** Nombre d’octets dans la liste.

---

### WORD

Comme **DATA en BASIC mais pour les nombres de 16 bits **. Chaque valeur est
stockée sur deux octets (octet de poids faible en premier, puis octet de poids
fort — ordre little-endian 6502).

| Argument | Description                                                                |
| -------- | -------------------------------------------------------------------------- |
| Opérande | Valeurs de 16 bits séparées par des virgules (par exemple, `$0400, $C000`) |

**Syntaxe : **
```
.mot $0400, $C000
```

**Code généré : **
```
.mot $0400, $C000
```

**Taille : ** 2 octets par mot.

---

### FILL

Comme `FOR I=1 TO N : POKE addr+I, val : NEXT` — remplit un bloc de mémoire avec
le même octet, sur une seule ligne. Idéal pour effacer des zones ou pré-remplir
des tables.

| Argument | Description                                                            |
| -------- | ---------------------------------------------------------------------- |
| Opérande | `count,value` — par exemple, `256,0` remplit 256 octets avec des zéros |

**Syntaxe : **
```
.remplir 256, 00 $
```

**Code généré : **
```
.remplir 256, 00 $
```

Syntaxe des expressions : Les fonctions `count` et `value` acceptent toutes deux
des expressions arithmétiques. Vous pouvez référencer des noms de constantes,
utiliser des littéraux hexadécimaux/binaires et appeler des fonctions
mathématiques intégrées.

| Expression                    | Signification                                               |
| ----------------------------- | ----------------------------------------------------------- |
| `TILE_COUNT, $00`             | compter à partir d'une CONST, valeur littérale hexadécimale |
| `40*25, 0`                    | multiplication en ligne                                     |
| `arrondi(sin(PI/4)*255), $80` | trigonométrie                                               |

**Fonctions intégrées : ** `sin() `, `cos() `, `round() `, `max(a,b) `,
`min(a,b) `, `abs() `, constante `PI `

Opérateurs : `+ - * /` Littéraux : `$FF` (hexadécimal), `%10110000` (binaire)
Octet de poids faible/de poids fort : `lo(expr)`, `hi(expr)`

**Taille : ** La valeur du nombre en octets.

---

### ALIGN

Décale l'adresse actuelle jusqu'à la prochaine limite libre en insérant des
octets de remplissage nuls. Le C64 exige que les données de sprite commencent
sur une limite de 64 octets ; `ALIGN 64` gère cela automatiquement.

| Argument | Description                                                                               |
| -------- | ----------------------------------------------------------------------------------------- |
| Limite   | Valeur d'alignement — par exemple `64` (limite du sprite), `256` (page), `$2000` (bitmap) |

**Syntaxe : **
```
.align 64
.align 2000 $
```

**Code généré : **
```
; ALIGN 64 → $0840 (remplissage de 12 octets)
```

**Taille : ** Dynamique — dépend de la position actuelle du compteur de
programme.

> **Conseil :** Utilisez `ALIGN 64` avant les données de sprite, `ALIGN 256`
> pour garantir des tableaux alignés sur la page.

---

### TEXT

Comme **PRINT AT** — écrit du texte directement sur l'écran du C64 à une colonne
et une ligne données, sans utiliser le KERNAL. Il génère une paire LDA/STA par
caractère, ciblant la RAM d'écran à `$0400`.

| Argument               | Description                                                     |
| ---------------------- | --------------------------------------------------------------- |
| Texte                  | La chaîne à afficher                                            |
| X                      | Colonne (0–39)                                                  |
| Y                      | Ligne (0–24)                                                    |
| Étiquette (facultatif) | Attribue une étiquette pointant vers l'adresse d'écran calculée |
| `inférieur`            | Drapeau facultatif — voir ci-dessous                            |

**Modes de jeu de caractères : **

Le C64 possède deux jeux de caractères sélectionnables lors de l'exécution :

| Mode                                              | $D018 bit 1 | Entrée en majuscules              | Entrée en minuscules                 |
| ------------------------------------------------- | ----------- | --------------------------------- | ------------------------------------ |
| **Majuscules/graphismes** (par défaut)            | 0           | `A`–`Z` → codes d'écran $01–$1A ✓ | traité également comme une majuscule |
| ** Minuscules/majuscules ** (après CHARSET lower) | 1           | `A`–`Z` → $01–$1A (majuscules)    | `a`–`z` → $41–$5A (minuscules) ✓     |

- ** Jeu de caractères majuscules (par défaut) : ** Saisissez ce que vous
  souhaitez voir en majuscules. `« HELLO »` s’affiche comme `HELLO`. Les
  caractères minuscules sont convertis en majuscules à l’écran.
- **Jeu de caractères minuscules (`lower`) : ** Saisissez la casse exacte
  souhaitée. `"hello"` → affichage en minuscules, `"HELLO"` → affichage en
  majuscules. Nécessite une modification du jeu de caractères avant l'écriture à
  l'écran (utilisez la macro **CHARSET lower**).

**Code généré (mode majuscules, `"HELLO"`):**
```
LDA n° $08 ; code écran « H » $08

STA $0400

LDA n° $05 ; code écran « E » $05

STA $0401

...
```

**Syntaxe : **
```
.text 0, 2, "HELLO" ; caractères majuscules (par défaut)

.text 0, 2, "hello", lower ; caractères minuscules
```

Les caractères sont encodés en codes d'écran (et non en PETSCII). Taille :
longueur du texte × 5 octets (LDA + STA par caractère).

---

### STRING

Comme **POKEing une chaîne ** dans n'importe quelle adresse mémoire à
l'exécution. Génère des paires LDA/STA qui copient le code d'écran de chaque
caractère dans des adresses consécutives.

| Argument               | Description                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| Texte                  | La chaîne à écrire                                                                                      |
| Adresse                | Adresse mémoire cible — `$C000` hexadécimal ou un **nom d'étiquette**                                   |
| Étiquette (facultatif) | Attribue une étiquette pointant vers l'adresse cible                                                    |
| Changement             | Valeur hexadécimale (00–FF) ajoutée à chaque octet de code d'écran (par exemple `$80` = vidéo inversée) |
| `inférieur`            | Indicateur optionnel — même sémantique que TEXT (voir la section TEXT)                                  |

**Syntaxe : **
```
.string $C000, "HELLO" ; en majuscules (par défaut)

.string $C000, "hello", lower ; en minuscules

.string $C000, "HELLO", 80 ; avec Maj (inversion vidéo)

.string $C000, "hello", 80, lower ; Maj + minuscules

.string $C000, "HELLO" :my_string ; avec macroLabel
```

**Code généré : **
```
LDA n° $08 ; code écran « H »

STA $C000

LDA n° $05 ; code écran « E »

STA $C001

…
```

Les caractères sont encodés en codes d'écran (et non en PETSCII). La valeur
optionnelle Shift est ajoutée à chaque octet, par exemple $80 pour la vidéo
inversée. Taille : longueur du texte × 5 octets (un LDA + un STA par caractère).

---

### DATA

Comme une boucle **POKE** — écrit une liste d'octets bruts à une adresse mémoire
au moment de l'exécution, une paire LDA/STA par octet.

| Argument               | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| Octets                 | valeurs d'octets séparées par des virgules                            |
| Adresse                | Adresse mémoire cible — `$C000` hexadécimal ou un **nom d'étiquette** |
| Étiquette (facultatif) | Attribue une étiquette pointant vers l'adresse cible                  |

**Syntaxe : **
```
.data $C000, $01, $02, $03 ; adresse hexadécimale

.data my_buf, $01, $02, $03 ; adresse de l'étiquette

.data $C000, $01, $02, $03 :mydata ; avec macroLabel
```

**Code généré : **
```
LDA #$01
    STA $C000
    LDA #$02
    STA $C001
    ...
```

**Taille : ** `byte_count × 5 ` octets (un LDA + un STA par octet).

> **2.1:** Les octets peuvent nommer des étiquettes : `.data $2010, <target,
> >target` écrit l’adresse de `target`, qui est également une étiquette définie
> ultérieurement. L’étiquette `:name` de la macro peut pointer vers une adresse
> cible qui est elle-même une étiquette.

---

### RAWBYTES

Comme les données ** qui se chargent directement en mémoire ** — aucun code
d'exécution n'est nécessaire. Les octets sont présents dès le chargement du PRG,
avant même le début de votre code. Utilisez cette méthode pour les données de
sprites, les cartes de niveaux, les tables de correspondance, bref, tout ce qui
doit se trouver à une adresse spécifique.

| Argument               | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| Octets                 | valeurs d'octets séparées par des virgules                            |
| Adresse                | Adresse mémoire cible — `$C000` hexadécimal ou un **nom d'étiquette** |
| Étiquette (facultatif) | Attribue une étiquette pointant vers l'adresse cible                  |

**Syntaxe : **
```
.rawbytes $C000, $00, $00, $00 ; adresse hexadécimale

.rawbytes sprite_data, $00, $00 ; adresse de l'étiquette

.rawbytes $0C50, $00, $00 :nev ; avec macroLabel — le reste du code peut utiliser LDA nev,X
```

**Taille en code : ** 0 octets. Les données sont placées à l’adresse indiquée
dans la sortie.

> **DATA vs RAWBYTES : ** DATA génère du code LDA/STA qui copie les octets à
> l’exécution (plus lent, mais fonctionne si les données doivent être
> dynamiques). RAWBYTES place directement les octets : sans code, instantané et
> sans coût.

> **2.1:** Les octets peuvent nommer des étiquettes (`.rawbytes $2000, <target,
> >target` — une table de pointeurs) ; l’étiquette `:name` peut pointer vers une
> étiquette comme adresse cible, y compris une étiquette définie ultérieurement.
> En tant qu’argument de tampon d’une macro, les octets occupent leur propre
> espace dans les tampons après le programme.

---

### RAWTEXT

Comme RAWBYTES, mais pour le texte : encode la chaîne en caractères d’écran et
place les octets à une adresse fixe sans code d’exécution. Le texte est
disponible en mémoire dès le chargement du PRG.

| Argument               | Description                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| Texte                  | Chaîne à encoder                                                                                        |
| Adresse                | Adresse mémoire cible — `$C000` hexadécimal ou un **nom d'étiquette**                                   |
| Étiquette (facultatif) | Attribue une étiquette pointant vers l'adresse cible                                                    |
| Changement             | Valeur hexadécimale (00–FF) ajoutée à chaque octet de code d'écran (par exemple `$80` = vidéo inversée) |
| `inférieur`            | Indicateur optionnel — même sémantique que TEXT (voir la section TEXT)                                  |

**Syntaxe : **
```
.rawtext $C000, "HELLO" ; en majuscules (par défaut)

.rawtext $C000, "hello", lower ; en minuscules

.rawtext $C000, "HELLO", 80 ; avec Maj (inversion vidéo)

.rawtext $C000, "hello", 80, lower ; Maj + minuscules

.rawtext $0400, "HELLO" :my_text ; avec macroLabel
```

**Code généré : **
```
; .rawtext "HELLO" -> $C000

; $C000

.byte $08, $05, $0C, $0C, $0F ; H E L L O (codes d'écran majuscules)

; .rawtext "hello", lower -> $C000

; $C000

.byte $48, $45, $4C, $4C, $4F ; h e l l o (codes d'écran minuscules, plage $41–$5A)
```

**Taille en code : ** 0 octets. Les données sont placées à l’adresse indiquée
dans la sortie.

> **STRING vs RAWTEXT : ** STRING génère du code LDA/STA qui copie le texte à
> l’exécution. RAWTEXT intègre les octets dans le PRG au moment du chargement —
> sans code, sans attente.

---

### PETSCII

Comme **RAWBYTES mais pour la sortie KERNAL** — encode la chaîne en octets
PETSCII (compatible avec CHROUT à `$FFD2`) et les place à une adresse fixe sans
code d'exécution. Utilisez cette fonction lorsque vous souhaitez afficher des
caractères via `JSR $FFD2` dans une boucle, et notez que `.print` utilise le
même encodeur et le même indicateur `lower`.

> **PETSCII vs codes écran : ** Les codes PETSCII et les codes écran sont deux
> encodages différents. Code écran `$01` = lettre A ; PETSCII `$41` = lettre A
> (via CHROUT). Utilisez PETSCII uniquement pour l’impression via le KERNAL ;
> utilisez TEXT/STRING/RAWTEXT pour écrire directement dans la RAM d’écran.

| Argument               | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| Texte                  | Chaîne à encoder en octets PETSCII                                    |
| Adresse                | Adresse mémoire cible — `$C000` hexadécimal ou un **nom d'étiquette** |
| Étiquette (facultatif) | Attribue une étiquette pointant vers l'adresse cible                  |
| `inférieur`            | Drapeau facultatif — voir ci-dessous                                  |

**Modes de jeu de caractères : **

| Mode                         | Entrée en majuscules (`A`–`Z`)                                                                                                            | Entrée en minuscules (`a`–`z`) |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| **Majuscules (par défaut)**  | `$41`–`$5A` (PETSCII majuscules via CHROUT)                                                                                               | également mappé à `$41`–`$5A`  |
| **Minutieux (`minuscules`)** | Les lettres alphabétiques sont réattribuées afin que la casse visible reste cohérente sur l'ensemble de caractères minuscules/majuscules. | Même règle                     |

**Syntaxe : **
```
.petscii $C000, "HELLO" ; PETSCII majuscule (par défaut)

.petscii $C000, "hello", lower ; PETSCII minuscule ($61–$7A)

.petscii $C000, "HELLO", null ; avec caractère nul de fin

.petscii $C000, "hello", lower, null ; minuscule + caractère nul de fin

.petscii $C000, "HELLO" :my_msg ; avec macroLabel
```

**Octets générés (majuscules, `"HELLO"`):**
```
; $C000

.byte $48, $45, $4C, $4C, $4F ; H E L L O (Plage PETSCII $41–$5A)
```

**Taille en code : ** 0 octets. Les données sont placées à l’adresse cible sous
forme de section de données différées (comme RAWBYTES).

Terminateur nul : ajoute l’indicateur null pour ajouter un octet $00 après le
texte. Idéal pour les boucles terminées par un caractère nul.

```
LDX #$00
boucle :

LDA msg,X

BEQ terminé ; $00 arrête la boucle

JSR $FFD2

INX

Boucle BNE
terminée :

RTS
```

**Règles d'encodage : **

| Saisir                                 | Mode majuscules                  | Mode minuscule |
| -------------------------------------- | -------------------------------- | -------------- |
| `A`–`Z`                                | `$41`–`$5A`                      | `$61`–`$7A`    |
| `a`–`z`                                | `$41`–`$5A` (majuscules forcées) | `$41`–`$5A`    |
| Espace, chiffres, ponctuation (32–126) | tel quel                         | tel quel       |
| Nouvelle ligne                         | `$0D` (RETOUR)                   | `$0D`          |
| Autre                                  | `$20` (espace)                   | `$20`          |

> **Conseil :** Utilisez PETSCII pour les données qui seront affichées via
> CHROUT (`$FFD2`). Pour écrire directement dans la mémoire RAM de l'écran,
> utilisez plutôt STRING ou RAWTEXT.

---

### CHARSET

Bascule la ROM de caractères VIC-II entre le mode majuscules/graphiques (par
défaut C64) et le mode minuscules/majuscules, en modifiant le bit 1 de `$D018`
au moment de l'exécution.

| Argument | Description                                                                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Mode     | ** Minuscules** — active le jeu de caractères minuscules/majuscules ; ** Majuscules** — rétablit le jeu de caractères majuscules/graphiques par défaut |

**Syntaxe : **
```
.charset lower ; passer à l'encodage de caractères en minuscules

.charset upper ; revenir à l'encodage de caractères en majuscules/graphiques
```

**Code généré : **

Mode minuscules :
```
LDA $D018

ORA #$02 ; activer le bit 1 → ROM minuscules/majuscules à $1800

STA $D018
```

Mode majuscules :
```
LDA $D018

ET #$FD ; effacement du bit 1 → ROM majuscules/graphiques à $1000

STA $D018
```

**Taille : ** 8 octets (LDA abs + ORA/AND imm + STA abs).

**Pourquoi utiliser ORA/AND plutôt qu'une écriture directe ?** `$D018` contrôle
également l'emplacement de la RAM écran (bits 7 à 4). Basculer uniquement le bit
1 préserve le reste du registre.

**Flux de travail typique :**

```
.charset lower

.text 0, 0, "hello world", lower

.charset upper
```

> **Remarque : ** La macro CHARSET modifie uniquement le pointeur ROM de
> caractères VIC. Elle n'appelle pas `$E544` (initialisation du jeu de
> caractères du noyau). Dans la plupart des cas, cela suffit ; appelez `JSR
> $E544` en premier uniquement si vous avez besoin que les routines d'impression
> du noyau prennent en compte la modification.

---

### CHARDEF

Définit un seul caractère personnalisé 8×8 dans un jeu de caractères basé sur la
RAM. Émet du code d'exécution en ligne qui copie 8 octets dans `base + index *
8` au moment de l'exécution — pas besoin d'étiquette précédente ni de `ORG`.

| Argument             | Description                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Base de caractères   | Adresse de base du jeu de caractères RAM (par défaut `$3800`). Doit être alignée pour que le VIC-II puisse la voir (voir ci-dessous). |
| Index des caractères | Quel emplacement de caractère redéfinir, 0–255. `65` = 'A' dans la disposition de code d'écran par défaut.                            |
| 8 octets             | Lignes d'image bitmap séparées par des virgules, de haut en bas. Le bit 7 de chaque octet correspond au pixel le plus à gauche.       |

**Syntaxe : **
```
.chardef 3800 $, 65, 18 $, 3C $, 66 $, 7E $, 66 $, 66 $, 66 $, 00 $
```

**Code généré (8 × `LDA #b` / `STA cible+n`, 40 octets au total):**
```
LDA #$18
    STA $3A08
    LDA #$3C
    STA $3A09
    LDA #66$
    STA $3A0A
    LDA #$7E
    STA 3A0 milliards de dollars
    LDA #66$
    STA $3A0C
    LDA #66$
    STA $3A0D
    LDA #66$
    STA $3A0E
    MDL #00$
    STA $3A0F
```

**Adresse cible : ** `$3800 + 65 * 8 = $3A08`. Calculé à la compilation et
intégré en dur dans les opérandes STA.

**Taille : ** 40 octets par caractère (8 × 5).

**Flux de travail typique :**
```
; Point VIC-II sur le jeu de caractères RAM à $3800

LDA $D018

AND #$F1

ORA #$0E ; bits 3-1 = %111 → jeu de caractères à la banque + $3800

STA $D018

.chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00 ; redéfinir 'A'

.chardef $3800, 66, $7C,$66,$66,$7C,$66,$66,$7C,$00 ; redéfinir 'B'

; ... lignes .chardef supplémentaires pour chaque caractère personnalisé
```

**Quand utiliser CHARDEF plutôt que des alternatives : **

| Approche                         | À utiliser lorsque                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **CHARDEF**                      | Vous avez besoin de quelques caractères personnalisés (par exemple, de 1 à 20). Le coût d'exécution est de 40 octets par caractère.   |
| **RAWBYTES à 3800 $**            | Vous disposez d'un jeu de caractères entièrement personnalisé (256 caractères). Total de 2 Ko de données, aucune copie à l'exécution. |
| **INCBIN "charset.bin" @ $3800** | Fichier de jeu de caractères externe (généré par l'éditeur de caractères). Option la plus propre.                                     |
| **Caractères Canvas + INCBIN**   | Image bitmap complète de 256 caractères, peinte en une seule image de 128×128 pixels.                                                 |

> Rappel d'alignement : VIC-II attend que la base du jeu de caractères soit un
> multiple de 0800. Banques valides : 0000, 0800, 1000, 1000, ..., 3800 (dans la
> banque VIC actuelle de 16 Ko). Les jeux de caractères de la RAM se trouvent
> généralement à 2000, 2800, 3000 ou 3800.

---

### BOX_HIT

Test de collision de boîtes englobantes alignées sur les axes (AABB) entre deux
rectangles décrits par des structures de page zéro de 4 octets. Renvoie le
résultat dans l'accumulateur : **A = 1** en cas de chevauchement, **A = 0**
sinon. Code assembleur en ligne pur, sans appel de sous-programme.

| Argument             | Description                                                                            |
| -------------------- | -------------------------------------------------------------------------------------- |
| Adresse postale Box1 | Base de page zéro de la structure de 4 octets de la première boîte (par défaut `$FB`). |
| Adresse postale Box2 | Base de page zéro de la structure de 4 octets de la deuxième boîte (par défaut `$F7`). |

**Disposition de la structure** (4 octets par case, coordonnées non signées sur
8 bits) :

| Compenser | Champ  |
| --------- | ------ |
| `+0`      | Gauche |
| `+1`      | Haut   |
| `+2`      | Droite |
| `+3`      | Bas    |

**Syntaxe : **
```
.box_hit $FB, $F7
```

**Code généré (30 octets, entièrement relatif au PC — pas de sous-routine, pas
de sauts absolus) :**
```
LDA $FD ; b1 droite

CMP $F7 ; b2 gauche

BCC non ; R1 < L2 → raté

LDA $F9 ; b2 droite

CMP $FB ; b1 gauche

BCC non

LDA $FE ; b1 bas

CMP $F8 ; b2 haut

BCC non

LDA $FA ; b2 bas

CMP $FC ; b1 haut

BCC non

LDA #$01 ; touché

BNE terminé ; inconditionnel (A ≠ 0)
non : LDA #$00
terminé :
```

**Taille : ** 30 octets.

**Flux de travail typique :**

```
; Boîte du sprite du joueur à $FB..$FE

LDA sprite_x ; L

STA $FB

LDA sprite_y ; T

STA $FC

CLC

ADC #23 ; +23 → B (sprite de 24 pixels de haut)

STA $FE

LDA $FB

CLC

ADC #23 ; R

STA $FD

; Boîte de l'ennemi à $F7..$FA (remplie de la même manière)

; ...

.box_hit $FB, $F7 ; test joueur contre ennemi → A = 0 ou 1

CMP #$01

BNE no_collision

JSR handle_hit
no_collision:
```

**Contraintes:**
- Les deux adresses de page zéro doivent être `≤ $FC` (chaque boîte a besoin de
  4 octets consécutifs : `zp`, `zp+1`, `zp+2`, `zp+3`).
- Les coordonnées sont traitées comme des entiers non signés 8 bits (0–255).
  Pour les coordonnées de sprites signées en dehors de cette plage,
  normalisez-les avant de les stocker.
- Les deux cases peuvent se chevaucher dans l'espace ZP si nécessaire, mais
  généralement, on souhaite 8 octets distincts.

Pourquoi ne pas utiliser une sous-routine ? La génération en ligne évite la
surcharge JSR/RTS (plus de 14 cycles) et maintient le test actif en cache pour
des boucles de jeu rapides. Si vous devez tester de nombreuses paires, placez
manuellement votre propre sous-routine JSR box_hit_sub autour d'une seule ligne
BOX_HIT.

Comparaison avec la fonction `box_hit()` d'UB : Ultimate Basic encapsule la même
logique 6502 dans une fonction d'exécution qui renvoie une valeur à une
variable. En VA, vous placez `BOX_HIT` directement à l'endroit où vous avez
besoin du test ; le résultat se trouve dans `A`.

---

### INCBIN

Comme **BLOAD en BASIC** — récupère un fichier binaire externe (`.bin`, `.prg`,
`.sid`, `.raw`) et l'intègre directement dans le PRG assemblé à l'adresse que
vous spécifiez.

| Argument | Description                                               |
| -------- | --------------------------------------------------------- |
| Déposer  | Sélectionnez un fichier `.bin`, `.prg`, `.sid` ou `.raw`. |
| Adresse  | Adresse de chargement cible (par exemple `$C000`)         |

**Syntaxe : **
```
.incbin "music.bin", $C000
```

**Commentaire de code généré : **
```
; INCBIN "music.bin" @ $C000 (2048 octets)

.byte $01, $02, ...
```

**Taille en code : ** 0 octets (section de données différées). Le binaire est
intégré à l’adresse indiquée.

---

### KOALA

Charge une image Koala Painter (160×200 multicolore) et l'affiche. Les données
de l'image sont intégrées à une adresse fixe, par exemple INCBIN (l'adresse de
chargement de 2 octets du fichier est supprimée), et la directive elle-même est
compilée en une routine d'affichage de 86 octets qui s'exécute à son
emplacement.

| Argument | Description                                                                                                                      |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Déposer  | Parcourez les fichiers pour sélectionner un fichier `.koa` / `.kla` (10003 octets, ou 10001 sans adresse de chargement)          |
| Adresse  | Adresse bitmap : `$6000` (par défaut, natif Koala, banque VIC 1, RAM écran `$4400`) ou `$2000` (banque VIC 0, RAM écran `$0400`) |

La routine d'affichage copie la partie RAM écran sur l'écran et la partie RAM
couleur dans `$D800`, écrit l'octet d'arrière-plan dans `$D021`, sélectionne la
banque VIC dans `$DD00` (en conservant les autres bits de port) et active le
mode bitmap multicolore (`$D011 = $3B`, `$D016 = $18`, `$D018 = $18`). Les
autres adresses sont rejetées : les 8 Ko restants se trouvent sous la ROM
BASIC/KERNAL (la boucle de copie lirait la ROM) ou chevauchent l'ombre de la ROM
de caractères.

**Syntaxe : **
```
.koala "image.koa"
.koala "image.koa", 2 000 $
```

**Exemple — afficher une image et attendre :**
```
* = $0801
.koala "picture.koa"
Attendre :

JMP attendre
```

**Taille en code : ** 86 octets (routine d'affichage) ; les 10 001 octets de
données d'image sont envoyés à l'adresse indiquée. L'éditeur haute résolution de
l'assembleur visuel C64 exporte un fichier compatible.

---

### LEVEL / LEVEL_ROW

Intègre un projet **Level Editor** dans votre programme et copie les lignes du
niveau dans une mémoire tampon d'écran — les éléments de base d'un jeu à
défilement. L'exemple `level-demo.asm` de l'assembleur visuel C64 est un niveau
complet à défilement au joystick.

#### LEVEL

Directive de type INCBIN générant 0 octet de code. Seuls les écrans placés du
projet Level Editor (le fichier .bin enregistré par Level Editor de C64 Visual
Assembler) sont chargés en mémoire à l'adresse spécifiée (par défaut 2000), dans
l'ordre des emplacements, à raison de 2000 octets par écran (1000 codes d'écran
+ 1000 couleurs). Les écrans identiques sont stockés une seule fois, et tous les
emplacements vides partagent un écran vierge. Les tables de pointeurs suivent
les écrans. Un niveau peut comporter jusqu'à 7 × 10 écrans.

**Syntaxe : **
```
.level "level.bin"
.level "level.bin", 4000 $
```

| Défini                                                                        | Signification                                                                                                                                                                             |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LEVEL_SLOT_LO` / `LEVEL_SLOT_HI`                                             | Adresse de l'écran dans chaque emplacement (ligne-major, `LEVEL_W` emplacements par ligne)                                                                                                |
| `LEVEL_ROW_SLOT`                                                              | Ligne du personnage de niveau → premier emplacement de sa ligne d'écran                                                                                                                   |
| `LEVEL_ROW_LO/HI`, `LEVEL_CROW_LO/HI`                                         | Ligne de caractère de niveau → décalage de sa ligne de code d'écran / ligne de couleur à l'intérieur d'un écran                                                                           |
| `LEVEL_COL_SLOT`, `LEVEL_COL_OFS`                                             | Afficher la colonne de début → colonne de l'écran et colonne à l'intérieur de l'écran                                                                                                     |
| `NIVEAU_O`, `NIVEAU_H`                                                        | Taille du niveau dans les écrans                                                                                                                                                          |
| `LEVEL_COLS`, `LEVEL_ROWS`                                                    | Taille du niveau en caractères                                                                                                                                                            |
| `NIVEAU_MAX_X`, `NIVEAU_MAX_Y`                                                | Position de défilement en pixels la plus élevée d'une vue 40×25                                                                                                                           |
| `NIVEAU_BG`, `NIVEAU_MC1`, `NIVEAU_MC2`, `NIVEAU_MULTICOLOR`                  | Couleurs de fond/multicolores et mode du niveau                                                                                                                                           |
| `NIVEL_DATA`, `NIVEL_SIZE`, `NIVEL_END`                                       | Début, taille et première adresse libre après le niveau de données                                                                                                                        |
| `LEVEL_OBJ_X_LO/HI`, `LEVEL_OBJ_Y_LO/HI`, `LEVEL_OBJ_TYPE`, `LEVEL_OBJ_PARAM` | Tableau des objets (calque d'objets de l'éditeur de niveaux) : position en pixels du niveau, type et octet de paramètre, dans l'ordre de défilement — `LEVEL_OBJ_COUNT` entrées (max 255) |
| `LEVEL_OBJ_T_START` … `LEVEL_OBJ_T_TRIGGER`                                   | Numéros des types d'objets : DÉPART 0, ENNEMI 1, OBJET 2, PORTE 3, SORTIE 4, DÉCLENCHEUR 5                                                                                                |
| `LEVEL_START_X`, `LEVEL_START_Y`                                              | Position du premier objet de départ (définie uniquement si le niveau en possède un)                                                                                                       |
| `LEVEL_ATTR`, `LEVEL_ATTR_SOLID` … `LEVEL_ATTR_COLLECT`                       | Tableau des attributs de caractère (un octet indicateur par code d'écran ; uniquement lorsque le niveau possède des attributs) et ses bits : 1, 2, 4, 8                                   |
| `LEVEL_BORDER`, `LEVEL_SCR_COLORS`, `LEVEL_SCR_BG/BORDER/MC1/MC2`             | Bordure de niveau ; tables de couleurs par emplacement (ordre ligne comme `LEVEL_SLOT_*`) lorsqu'un écran possède ses propres couleurs (`LEVEL_SCR_COLORS` = 1)                           |

garde typique : `.assert LEVEL_END <= $9200, "les données de niveau entrent
dans le code"`.

#### LEVEL_ROW

Copie une ligne de 40 caractères du niveau dans un tampon : la ligne de niveau
dans **X**, commençant à la colonne de niveau stockée dans la variable `col`,
jusqu'à l'adresse contenue dans le pointeur `dst` (`dst` / `dst+1`, lo/hi). Avec
le troisième argument `color`, copie les couleurs au lieu des codes d'écran
(pour la RAM couleur). Une fenêtre de 40 caractères s'étendant sur deux écrans
est gérée par une boucle de copie auto-modificatrice (environ 14 cycles par
octet). X est conservé, A et Y sont détruits. Nécessite un bloc `.level` dans le
programme.

**Syntaxe : **
```
.level_row dst_lo, view_x
.level_row dst_lo, view_x, couleur
```

**Taille en code :** 132 octets — utilisez `LBEQ` / `LBNE` lorsqu’une branche
doit sauter par-dessus.

---

### SID

Comme **BLOAD pour la musique** — charge un fichier `.sid` dans votre PRG et lit
automatiquement ses adresses Init et Play dans l'en-tête. Appelez Init une fois
au démarrage, puis appelez Play depuis votre gestionnaire d'interruption à
chaque image.

| Argument                           | Description                                                                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Déposer                            | Le fichier `.sid` (PSID / RSID)                                                                                                            |
| Adresse personnalisée (facultatif) | Remplacez l'adresse de chargement native du SID (par exemple, `$1000`). Laissez ce champ vide pour utiliser l'adresse de l'en-tête du SID. |

L'en-tête SID indique :
- **Adresse de chargement** — où les données sont placées en mémoire (l'adresse
  personnalisée lorsqu'elle est fournie)
- **Adresse d'initialisation** — appelez ceci avec JSR pour initialiser la
  musique (déplacée avec une adresse personnalisée)
- **Adresse de lecture** — appelez ceci avec JSR sur chaque trame dans un
  gestionnaire d'IRQ (déplacé avec une adresse personnalisée)

**Syntaxe : **
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", 1 000 $
```

**Commentaire de code généré : **
```
; SID "Ikari_Warriors.sid" à 1 000 $ Init : 1 000 $ Lecture : 1 006 $ (4 096 octets)
```

**Taille en code : ** 0 octets en ligne. Le binaire SID est placé à l’adresse
spécifiée en tant que bloc différé dans le PRG.

> Important : La plupart des fichiers SID contiennent des adresses absolues
> internes codées en dur. Elles ne peuvent être déplacées que si l’ensemble du
> binaire est décalé du même indice. Si un SID comporte des sauts internes vers
> `$10xx`, il doit rester à `$1000` ; le déplacer vers une autre adresse rompra
> ces références internes.

> **Utilisation typique :** Attribuez au SID une adresse spécifique (`.sid
> "tune.sid", $1000`) lorsque son adresse native entre en conflit avec votre
> code. Appelez Init une fois au démarrage, puis Play à chaque image depuis un
> gestionnaire d'interruption raster — ou laissez [SID_PLAYER](#sid_player)
> effectuer les deux.

Étiquettes : la directive SID définit SID_LOAD (emplacement des données),
SID_INIT et SID_PLAY (adresses d'initialisation et de lecture, associées à une
adresse personnalisée). SID_PLAY est absent lorsque le morceau n'a pas d'adresse
de lecture (un RSID qui installe sa propre interruption). Utilisez-les dans
votre code, par exemple : JSR SID_PLAY dans un gestionnaire d'interruption.

---

### SID_PLAYER

Joue la mélodie de la directive **SID** avec une seule ligne : elle initialise
la mélodie et continue d'appeler sa routine de lecture à partir d'une
interruption raster, afin que votre programme puisse continuer son propre
travail.

| Argument | Description                                                                        |
| -------- | ---------------------------------------------------------------------------------- |
| Chanson  | Numéro de sous-accord transmis à la routine d'initialisation en A (par défaut `0`) |
| Raster   | Ligne raster de l'interruption, `$00`–`$FF` (par défaut `$FA`)                     |

Ce qu'il fait : `SEI`, `LDA #song` / `JSR SID_INIT`, désactive l'IRQ du minuteur
CIA1 (`$DC0D`), définit le vecteur IRQ (`$0314/$0315`) sur son gestionnaire
intégré, la ligne raster (`$D012`, bit 8 de `$D011` effacé) et l'IRQ raster
(`$D01A`), `CLI`, puis saute au-dessus du gestionnaire. Le gestionnaire accuse
réception de l'interruption (`ASL $D019`), appelle `JSR SID_PLAY` et passe au
KERNAL (`JMP $EA31`, qui analyse également le clavier).

**Syntaxe : **
```
.sid "Ikari_Warriors.sid"

.sid_player

.sid_player 1, 80 $
```

**Taille en code : ** 58 octets.

> **Remarque : ** une ligne `.sid` est nécessaire dans le programme (`SID_INIT`
> et `SID_PLAY`) ; sinon, la compilation s’arrête avec une erreur. Lorsque
> l’interruption du minuteur CIA1 est désactivée, le noyau s’exécute une fois
> par image à partir de l’interruption raster ; le clavier et `GETIN` restent
> opérationnels.

---

### INCLUDE

Comme la fonction MERGE en BASIC, elle importe un autre fichier et l'étend à cet
emplacement. Idéal pour les bibliothèques de sous-programmes réutilisables.

Deux types de fichiers sont pris en charge :
- **Source assembleur simple** (`.inc`, `.asm`, `.s`) — le fichier est lu comme
  source VMA. Il est relu à chaque compilation, vous pouvez donc le modifier
  avec n'importe quel éditeur.
- **Visual Assembler project** (`.json`) — les blocs d'un programme bloc C64
  Visual Assembler.

| Argument                           | Description                                                                                                                                                                                                                                                                                                                |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Déposer                            | Un fichier source `.inc` / `.asm` / `.s` ou un projet Visual Assembler `.json`.                                                                                                                                                                                                                                            |
| Adresse de chargement (facultatif) | Si cette option est activée (en hexadécimal, par exemple `C000`), le code inclus est placé à cette adresse ; un `ORG` est ajouté devant, et les instructions ORG propres au fichier inclus sont ignorées. Sans cette option, ce sont les instructions ORG propres au fichier inclus qui déterminent l'emplacement du code. |

**Syntaxe : **
```
.include "library.json"

.include "macros.inc", $1500

.include "sprites.asm"
```

- Donnez l'extension de fichier **** — un nom nu comme `.include "macros"` est
  traité comme `.include "macros.json"`.
- Résolution des chemins : d’abord à côté du répertoire source, puis dans chaque
  dossier de recherche (l’option `--base-dir` / `--search` de l’interface de
  ligne de commande) ; un chemin défini sur une autre machine est remplacé par
  le nom du fichier seul. L’absence d’un fichier d’en-tête n’est pas une erreur
  : la compilation se poursuit.

**Code généré (pas de remplacement d'adresse) :**
```
; .include "library.json"

... (le code inclus suit)
```

**Code généré (avec adresse de chargement `C000`):**
```
; .include "library.json" @ $C000

*=$C000

... (le code inclus suit)
```

> Conseil : Utilisez INCLUDE pour créer des bibliothèques de sous-programmes
> réutilisables et partageables entre projets. Les fichiers .inc, .asm et .s
> sont recommandés pour modifier la bibliothèque dans un éditeur de texte brut
> ou la partager avec d'autres assembleurs 6502 ; le fichier .json est
> préférable lorsque la bibliothèque est un programme bloc Visual Assembler.
> Spécifiez une adresse de chargement si la bibliothèque n'a pas de répertoire
> ORG dédié ou si vous souhaitez modifier son emplacement par défaut.

> **2.1:** Une inclusion introuvable constitue une erreur, de même qu'un fichier
> qui s'inclut lui-même (directement ou plus bas dans l'arborescence). Les
> lignes `.include`, `.incbin` et `.sid` propres au fichier inclus sont
> également chargées, par rapport à son propre dossier, et ses appels de macros
> sont développés – jusqu'à 16 niveaux de profondeur.

---

### TABLE

Comme **DIM à une adresse spécifique** — nomme une table de consultation et
indique son emplacement en mémoire. Ajoutez ensuite les lignes `.byte`, `.word`
ou `.fill` pour définir le contenu de la table.

| Argument | Description                                                        |
| -------- | ------------------------------------------------------------------ |
| Nom      | Identifiant de l'étiquette du tableau (par exemple, `color_table`) |
| Adresse  | Adresse fixe où commence le tableau (par exemple `$C000`)          |

**Syntaxe : **
```
.table color_table $C000

.table lookup ; à l'adresse actuelle
```

**Code généré : **
```
tableau des couleurs :
```

Avec une adresse, le compteur de programme y saute ; sans adresse, le tableau
commence à l’adresse actuelle. Ajoutez les lignes `.byte` / `.word` / `.fill`
après pour remplir le contenu.

**Taille : ** 0 octets.

---

### ORG

Définit l'emplacement en mémoire du programme (ou d'une partie de celui-ci), un
peu comme choisir une adresse de départ avant de saisir du code machine. Chaque
programme nécessite au moins une instruction ORG. L'adresse de départ standard
pour le BASIC C64 est `$0801`.

| Argument  | Description                                                                   |
| --------- | ----------------------------------------------------------------------------- |
| Adresse   | La nouvelle adresse d'origine (par exemple `0801` en HEX, ou `2049` en DEC)   |
| HEX / DEC | Basculer l'affichage de la saisie d'adresse entre l'hexadécimal et le décimal |

**Syntaxe : **
```
* = $C000
```

**Code généré : **
```
* = $C000
```

**Taille : ** 0 octets. ORG lui-même ne génère aucun code machine.

Chaque ORG marque le début d'une nouvelle section. Les lignes suivantes sont
assemblées à partir de cette adresse. Le PRG regroupe toutes les sections dans
un seul fichier ; les espaces entre les sections sont remplis de zéros.

**Exemple — code à `$0801`, table de données à `$C000`:**
```
* = $0801

LDX #$00
boucle :

LDA $C000,X

STA $D800,X

INX

Boucle BNE

RTS

* = $C000

.octet $01, $02, $03, ...
```

> **Conseil : ** Sans ORG, le programme démarre à `$0801` (2049 en décimal), le
> début du BASIC. Avec le stub SYS BASIC (par défaut), l’assembleur insère une
> courte ligne `10 SYS…` à `$0801` et votre code commence à `$080D`. Voir
> [Sortie : PRG, stub BASIC et point
> d’entrée](#3-output-prg-basic-stub-and-entry-point).

---

### LOOP / NEXT

Comme **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** en BASIC — effectue un décompte
de N à 1 en utilisant le registre X ou Y. Placez vos instructions entre LOOP et
NEXT, et la boucle s'exécutera automatiquement le nombre de fois nécessaire.

#### LOOP

| Argument  | Description                                                                      |
| --------- | -------------------------------------------------------------------------------- |
| Registre  | `X` ou `Y` — le registre compteur                                                |
| Compter   | Nombre d'itérations de la boucle (hexadécimal ou décimal, par exemple `0A` = 10) |
| Étiquette | Étiquette de boucle générée automatiquement (par exemple, `boucle0`)             |

**Syntaxe : **
```
.boucle X, 10, boucle 0
```

**Code généré : **
```
LDX #$0A
boucle0 :
```

**Taille : ** 2 octets (code d’opération LD + opérande immédiat).

#### NEXT

| Argument  | Description                                      |
| --------- | ------------------------------------------------ |
| Registre  | Correspondance automatique avec le registre LOOP |
| Étiquette | Lié automatiquement à l'étiquette LOOP           |

**Syntaxe : **
```
.next boucle0
```

**Code généré : **
```
DEX

Boucle BNE0
```

**Taille : ** 3 octets (DEX + BNE + décalage de branche).

**Exemple — effacer 10 cellules d'écran : **
```
LDX #$0A
boucle0 :

LDA #$20 ; caractère espace

STA $0400,X

DEX

BNE boucle0
```

---

### FOR / ENDF

Comme **`FOR X=0 TO N-1 : ... : NEXT X`** en BASIC — compte *up* à partir de 0.
Idéal lorsque vous avez besoin d'un index avant, par exemple pour parcourir une
chaîne ou un tableau.

#### FOR

| Argument  | Description                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------ |
| Registre  | `X` ou `Y` — le registre compteur                                                                |
| Compter   | Limite de boucle (hexadécimal ou décimal, par exemple `$12` = 18). X/Y varie de 0 à la limite-1. |
| Étiquette | Étiquette de boucle générée automatiquement (par exemple, `pour0`)                               |

**Syntaxe : **
```
.pour X, 12 $, pour 0
```

**Code généré : **
```
LDX #$00
pour0:
```

**Taille : ** 2 octets (code d’opération LD_ + `#$00`).

#### ENDF

| Argument  | Description                                     |
| --------- | ----------------------------------------------- |
| Registre  | Correspondance automatique avec le registre FOR |
| Étiquette | Lié automatiquement à l'étiquette POUR          |
| Compter   | Copie automatique à partir du FOR apparié       |

**Syntaxe : **
```
.endf pour0
```

**Code généré : **
```
INX

CPX #12 $

BNE pour 0
```

**Taille : ** 5 octets (IN_ + CP_ #imm + décalage BNE).

**Exemple — imprimer une chaîne terminée par un caractère nul : **
```
LDX #$00
for0:

LDA msg,X ; msg = chaîne PETSCII à adresse fixe

BEQ done ; terminateur nul → sortie

JSR $FFD2 ; CHROUT

INX

CPX #$12 ; 18 caractères max

BNE for0
done:

RTS
```

> Boucle ** vs FOR : ** : La boucle décrémente (N→1) et est idéale pour les
> délais, les remplissages et les boucles de pixels. La boucle FOR incrémente
> (0→N) et est idéale pour accéder aux chaînes de caractères et aux tableaux.
> Les deux peuvent utiliser X ou Y.

---

### PUSH / PULL

Comme ** la sauvegarde des variables avant un GOSUB et leur restauration après
** — mais utilise la pile matérielle du 6502. Si une sous-routine utilise A, X
ou Y, encapsulez-la dans des instructions PUSH et PULL afin de préserver les
registres du code appelant.

#### PUSH

Empile un ou plusieurs registres. L'ordre est toujours A → X → Y (du plus
interne au plus externe).

| Argument  | Description                                                |
| --------- | ---------------------------------------------------------- |
| Registres | Toute combinaison : `A`, `X`, `Y`, `AX`, `AY`, `XY`, `AXY` |

**Syntaxe : **
```
.push AXY
```

**Code généré (exemple : `AX`) :**
```
PHA

TXA

PHA
```

**Taille : ** 1 octet pour A (`PHA`), 2 octets pour X ou Y (transfert + push).

#### PULL

Restaure les registres de la pile dans l'ordre inverse **** (Y → X → A).

| Argument  | Description                                                |
| --------- | ---------------------------------------------------------- |
| Registres | Identique à PUSH — doit correspondre au PUSH correspondant |

**Syntaxe : **
```
.tirer AXY
```

**Code généré (exemple : `AX`) :**
```
PLA

TAXE
PLA
```

> **Règle : ** Les commandes PUSH et PULL doivent toujours utiliser le **même
> jeu de registres**. `PUSH AX` → `PULL AX` (restaure en interne dans l’ordre
> inverse : X d’abord, puis A).

---

### END / RTS alias

Comme **RTS avec un nom de macro plus convivial** — `.end` émet un seul octet
`RTS`, un court terminateur de sous-routine.

**Syntaxe : **
```
.fin
```

**Code généré : **
```
RTS
```

**Taille : ** 1 octet.

Utilisez ceci lorsque vous souhaitez un marqueur de fin de sous-routine qui
ressemble davantage à une macro qu'à une instruction brute.

---

### MACRO / ENDM / INVOKE

Comme **une GOSUB nommée avec des paramètres** — définissez un bloc de code
réutilisable une seule fois (MACRO…ENDM), puis appelez-le n'importe où avec
INVOKE. Transmettez des valeurs d'arguments différentes à chaque fois au lieu de
copier-coller du code.

#### MACRO (definition start)

| Argument   | Description                                                                                         |
| ---------- | --------------------------------------------------------------------------------------------------- |
| Nom        | Identifiant de la macro (par exemple, `setColor`)                                                   |
| Paramètres | Noms de paramètres optionnels séparés par des virgules (par exemple `couleur` ou `couleur, nombre`) |

Marque le début de la définition d'une macro. Les lignes entre MACRO et ENDM
constituent le corps de la macro. Une macro avec paramètres **ne génère aucun
code** à l'emplacement de sa définition ; une macro sans paramètres y est
également assemblée comme une sous-routine (appelée par le nom JSR`). Dans le
corps, un paramètre est écrit sous la forme `{nomParam}` ou par son nom seul ;
l'appel renseigne l'argument, aussi bien dans les opérandes d'instructions que
dans les arguments des macros de bibliothèque (`.set_border c`, `.sprite_pos n,
x, y`…). Les étiquettes, les étiquettes de boucle et les étiquettes d'exécution
`.if` / `.while` du corps sont uniques pour chaque appel. Un appel de macro à
l'intérieur du corps d'une macro n'est pas développé (erreur).

**Code généré : **
```
; .MACRO setColor (couleur)

... (corps)
; .ENDM
```

**Syntaxe : **
```
.macro setColor couleur

LDA {couleur}

STA $D020
.endm
```

#### ENDM (definition end)

Ferme la définition de macro actuelle. Aucun argument.

#### INVOKE

Appelle une macro définie à cette position et remplace les valeurs d'argument
fournies par les espaces réservés `{paramName}` dans le corps.

| Argument        | Description                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Nom de la macro | Une macro définie dans le programme ou dans un fichier inclus                                                             |
| Arguments       | Valeurs des arguments séparées par des virgules correspondant à la liste des paramètres de la macro (par exemple, `#$07`) |

**Code généré : **
```
; .invoke setColor(#$07)
    LDA #$07
    STA $D020
```

**Syntaxe : **
```
; un seul argument :

.invoke setColor(#$07)

; plusieurs arguments :

.invoke drawPixel($10, $20)

; aucun argument :

.invoke clearScreen

; arguments de type texte (entre guillemets) :

.invoke printText("Hello, World!")

; alias de .call (synonyme de .invoke) :

.call setColor(#$07)
```

Le corps de la macro est développé en ligne, `{paramName}` étant remplacé par
les arguments réels. La forme séparée par des espaces (`.invoke setColor #$07`)
est également acceptée.

**Types d'arguments :**
- **Numérique** : `#$07`, `$10`, `255` — valeurs hexadécimales ou décimales
- **Chaînes de texte** : `« Bonjour, monde ! »` — chaînes entre guillemets (les
  guillemets sont supprimés) ; les virgules à l’intérieur des guillemets sont
  traitées comme faisant partie du texte, et non comme des séparateurs
  d’arguments
- **Caractère littéral** : `'A'` — reste un caractère littéral, donc le corps
  reçoit son code (`$41`)
- **Mixte** : `#$07, "bonjour", $20` — toute combinaison

> **Conseil :** Définissez les macros en haut (ou en bas) de votre programme,
> puis invoquez-les là où c’est nécessaire. Les macros peuvent être invoquées
> plusieurs fois avec différents arguments.

> **2.1:** Une macro peut appeler une autre macro (`both(a, b)` appelant
> `setc(a)`) ; l’appel interne reçoit les arguments de l’appel externe ainsi que
> ses propres étiquettes locales uniques. Une macro qui s’appelle elle-même
> s’arrête avec une erreur après 16 niveaux au lieu de se bloquer.

---

### REGION / ENDREGION

Un regroupement purement destiné aux éditeurs et aux listes — **zéro octet**,
aucun effet sur le code assemblé.

| Argument         | Description                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------- |
| Nom de la région | Étiquette en texte libre pour la section (par exemple, `init`, `game_loop`, `sprite_setup`) |

**Syntaxe : **
```
.region init

; code...
.endregion
```

**Code généré : **
```
; initialisation de la région
    SEI
    MDL #00$
    STA $D020
; initialisation de la région finale
```

**Taille : ** 0 octets pour REGION et ENDREGION.

> **Remarque : **Les régions peuvent être **imbriquées** les unes dans les
> autres. Chaque région fermée bloque la région ouverte la plus proche. Aucun
> effet sur le résultat assemblé.

---

### DEFINE / IF / ELSE / ENDIF

Comme un interrupteur, l'assembleur lit : `DEFINE DEBUG` active un symbole, puis
les lignes de toute instruction `IF DEBUG` sont assemblées et sa branche `ELSE`
est ignorée. Supprimez `DEFINE` et la partie `IF` disparaît du résultat. Il
n'est pas nécessaire de supprimer le code pour les versions de production.

#### DEFINE

| Argument | Description                                                                                           |
| -------- | ----------------------------------------------------------------------------------------------------- |
| Symbole  | Un ou plusieurs identifiants séparés par des virgules à activer (par exemple `DEBUG` ou `DEBUG, PAL`) |

**Syntaxe : **
```
.define DEBUG, PAL
```

**Code généré : **
```
; .DEFINE DEBUG
; .DEFINE DEBUG, PAL
```

Une directive DEFINE ` peut activer plusieurs symboles simultanément (séparés
par des virgules). Placez les directives DEFINE en haut de votre programme.

#### IF

| Argument  | Description                                                                                                                               |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Condition | Un symbole `.define`d (actif), un nom `.const` (actif lorsqu'il n'est pas nul) ou une expression constante (`LEVEL == 2`, `MODE & 1`) |

**Syntaxe : **
```
.si DEBUG
```

**Code généré : **
```
; .SI DÉBOGAGE
```

Les lignes entre `IF` et `ENDIF` (ou `ELSE`) sont assemblées ou ignorées selon
la condition. Un nom seul est vrai s'il est `.define` ou une constante `.const`
non nulle, faux dans le cas contraire ; toute autre condition doit être une
expression constante — une expression qui ne peut être évaluée lors de
l'assemblage constitue une erreur. Les lignes ignorées apparaissent sous forme
de commentaires `; [IF skipped] …` et génèrent **zéro octet**.

#### ELSE

Aucun argument. Marque la branche alternative — assemblée lorsque la condition
`IF` n'est *pas* active.

**Syntaxe : **
```
.autre
```

**Code généré : **
```
; .AUTRE
```

#### ENDIF

Aucun argument. Clôture la partie conditionnelle.

**Syntaxe : **
```
.endif
```

**Code généré : **
```
; .ENDIF
```

**Taille : ** 0 octet pour les quatre directives. Seul le contenu *entre elles*
est pris en compte.

**Exemple — flash de bordure de débogage, la version finale l'ignore : **
```
; .DEFINE DEBUG

; .IF DEBUG

LDA #$02 ; bordure rouge

STA $D020

; .ELSE

LDA #$00 ; bordure noire (libération)

STA $D020

; .ENDIF
```

**Exemple — plusieurs symboles dans une seule DÉFINITION : **
```
; .DEFINE DEBUG, PAL

; .IF PAL

LDA #$xx ; Constante de temporisation PAL

; .ELSE

LDA #$xx ; Constante de temporisation NTSC

; .ENDIF
```

Les instructions `IF` imbriquées sont prises en charge. Si une partie externe
est ignorée, les parties internes le sont également.

> **Remarque :** Il s’agit d’une gestion des conditions à la compilation. Pour
> une syntaxe simplifiée de comparaison/branchement à l’exécution, voir **IF /
> ELSE / ENDIF à l’exécution** ci-dessous.

### .ASSERT

Une vérification de cohérence à la compilation (**) est effectuée. **`.assert`
évalue une expression lors de l'assemblage ; si elle est fausse (`0`), la
compilation s'arrête et une erreur claire est affichée, incluant la valeur
réelle. Si elle est vraie (non nulle), aucun message n'est émis.

| Argument   | Description                                                                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Expression | Toute expression assembleur : étiquettes, `CONST`, `*` (compteur de programme), arithmétique et comparaisons (`<`, `<=`, `>`, `>=`, `==`, `!=`) |
| Message    | Texte facultatif ajouté à l'erreur d'échec                                                                                                                  |

**Syntaxe : **
```
.assert spriteData < $C000

.assert * < $A000

.assert end - start <= 256, "Le tableau des sprites a débordé d'une page"
```

**Comportement : **

- **Taille : ** 0 octets.
- Une assertion fausse interrompt l'assemblage : `` `.assert end - start <=
  256` est faux (valeur : 0). La table des sprites a dépassé d'une page ``.
- Une assertion qui ne peut pas être évaluée (étiquette non définie, etc.)
  échoue également, avec *"ne peut pas être évaluée au moment de l'assemblage"*.
- Les comparaisons donnent `1` / `0`; placez `.assert` n'importe où dans le flux
  du programme — il est vérifié à l'adresse sur laquelle il se trouve, donc
  `.assert * < $D000` teste la position de sortie actuelle.

**Exemple — protéger les données de sprite contre un changement de page : **
```
* = 3000 $
sprite_data :

.byte $00, $00, $00 ; … 63 octets …
sprite_data_end :

.assert sprite_data_end - sprite_data == 63, « Le sprite doit faire exactement 63 octets »

.assert (sprite_data % 64) == 0, « Le sprite doit être aligné sur 64 octets »
```

---

### CONST

Comme une variable nommée qui ne change jamais — SCREEN = $0400. Utilisez le nom
plutôt que de saisir des adresses brutes partout ; le code sera ainsi plus
facile à lire et à modifier ultérieurement.

| Argument | Description                                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Nom      | Identifiant de la constante (par exemple, `SCREEN`)                                                                                        |
| Valeur   | Valeur numérique dans la base sélectionnée (par exemple `0400` en HEX = adresse $0400), ou une expression relative au PC (voir ci-dessous) |
| Format   | HEX ou DEC — détermine la façon dont la valeur est saisie et affichée                                                                      |

**Syntaxe : **
```
.const SCREEN = $0400

.const FRAMES_1S = 60
```

**Code généré : **
```
; .CONST SCREEN = $0400
```

**Expressions relatives au PC (`*+N` / `*-N`):**

La valeur accepte également `*+N` ou `*-N`, où `*` correspond à l'adresse de la
ligne `.const` elle-même. Ceci permet de créer un alias nommé pour un octet au
sein d'une instruction voisine — le modèle classique de code automodificateur :

```
.const op = *+1 ; op → adresse de l'opérande immédiat du prochain LDA

LDA #$00 ; $00 sera modifié à l'exécution

... STA op ; écrase l'octet #$00 → LDA lira la nouvelle valeur lors de la prochaine exécution
```

La CONST émet 0 octets ; l'étiquette se résout au moment de la compilation à
`adresse_actuelle + 1`.

**Expressions arithmétiques :**

La valeur accepte les opérations arithmétiques générales, y compris les
références à des noms CONST précédemment définis, des littéraux
hexadécimaux/binaires et des fonctions mathématiques intégrées :

```
.const SCREEN = $0400
.const SCREEN_END = SCREEN + 40*25 ; 1000 octets plus tard
.const COLOR_RAM = $D800
.const MID_X = 160
.const SIN_TABLE = round(sin(PI/8) * 127) ; valeur du sinus précalculée
```

**Fonctions intégrées : ** `sin() `, `cos() `, `round() `, `max(a,b) `,
`min(a,b) `, `abs() `, constante `PI `

Opérateurs : `+ - * /` Littéraux : `$FF` (hexadécimal), `%10110000` (binaire)
Octet de poids faible/de poids fort : `lo(expr)`, `hi(expr)`

**Taille : ** 0 octets.

---

### VAR

Comme **CONST, mais à allocation automatique** — `VAR` réserve de l'espace
mémoire de page zéro pour une étiquette sans que vous ayez à saisir l'adresse.
Utilisez-le pour les compteurs, les pointeurs et les états éphémères qui doivent
être stockés dans la page zéro.

| Argument            | Description                                             |
| ------------------- | ------------------------------------------------------- |
| Nom                 | Nom/étiquette de la variable                            |
| Taille (facultatif) | Nombre d'octets à réserver. Omettre pour un seul octet. |

**Syntaxe : **
```
Compteur .var
minuterie .var, 2
.var vit
```

**Exemple pratique :**
```
.region Vars
Compteur .var
minuterie .var, 2
.endregion

MDL #00$
Compteur STA
```

**Code généré : **
```
; .var compteur
```

**Taille : ** 1 octet par défaut, ou `N` octets lorsque la taille est spécifiée.

L'allocateur parcourt un curseur de page zéro configurable (de `$02` à `$FE`) et
attribue le prochain emplacement libre. Si la région demandée chevauche une
étiquette déjà utilisée, le compilateur émet un avertissement.

---

### Runtime IF / ELSE / ENDIF

Comme un véritable modèle de branchement, cette version fonctionne à
l'exécution, et non à la compilation. Elle compare A, X ou Y à une valeur
immédiate et génère la séquence de branchement CMP / CPX / CPY appropriée.

| Argument  | Description                                  |
| --------- | -------------------------------------------- |
| Registre  | `A`, `X` ou `Y`                              |
| Opérateur | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Valeur    | Valeur immédiate au format HEX ou DEC        |

**Syntaxe : **
```
Si A == #$10

LDA #$07
.sinon

LDA #$0F
.fin si
```

**Taille : ** Dépend des branches choisies et du formulaire de comparaison.

La comparaison est non signée par défaut. Pour `<=` et `>`, la macro
s'étend à la chaîne de branchement équivalente la plus courte pour le registre
sélectionné.

---

### WHILE / ENDW

Comme **une boucle d'exécution avec un test au sommet** — le corps s'exécute
tant que la condition reste vraie.

| Argument  | Description                                  |
| --------- | -------------------------------------------- |
| Registre  | `A`, `X` ou `Y`                              |
| Opérateur | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Valeur    | Valeur immédiate au format HEX ou DEC        |

**Syntaxe : **
```
.while A != #$00

JSR getchar
.endw
```

**Taille : ** Dépend du corps de la boucle et de la forme de comparaison.

Utilisez `WHILE` lorsque la boucle risque de se terminer avant la fin de la
première itération. Il s'agit de l'équivalent, en termes d'exécution, de
l'utilitaire `LOOP / NEXT` basé sur le comptage.

---

### REPEAT / UNTIL

Comme **une boucle d'exécution avec un test à la fin** — le corps s'exécute
toujours au moins une fois, puis la condition décide s'il faut s'arrêter.

| Argument  | Description                                  |
| --------- | -------------------------------------------- |
| Registre  | `A`, `X` ou `Y`                              |
| Opérateur | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| Valeur    | Valeur immédiate au format HEX ou DEC        |

**Syntaxe : **
```
.repeat

JSR getchar
.until A == #$00
```

**Taille : ** Dépend du corps de la boucle et de la forme de comparaison.

Utilisez `REPEAT / UNTIL` lorsque vous souhaitez que le corps s'exécute au moins
une fois avant la vérification de sortie.

---

### MEMCPY / MEMSET

Comme les petites routines de mémoire que vous utilisez constamment, ** —
`MEMCPY` copie un bloc contigu, `MEMSET` remplit une plage avec un octet.

| Macro    | Arguments               |
| -------- | ----------------------- |
| `MEMCPY` | `src`, `dst`, `size`    |
| `MEMSET` | `addr`, `value`, `size` |

**Syntaxe : **
```
.memcpy src=$C000, dst=$D000, size=$0100

.memset addr=$0400, value=#$20, size=$03E8
```

**Code généré : ** boucles de copie/remplissage en ligne, choisies pour
correspondre à la taille demandée.

Les données jusqu'à 256 octets utilisent une boucle courte de 8 bits. Au-delà,
un compteur 16 bits est automatiquement utilisé.

> **2.1:** La taille doit être connue lors de la mise en page du code : il doit
> s’agir d’un nombre ou d’une constante. Une étiquette définie ultérieurement
> (dont la valeur est encore inconnue de la mise en page) est considérée comme
> une erreur et non comme un code mal positionné.

---

### PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY / SET_BORDER / SET_BG

#### PRINT

Comme la sortie **PETSCII sans le texte standard** — imprime une chaîne via
`CHROUT` avec la même gestion des majuscules/minuscules (`minuscules`) que
`.petscii`.

**Syntaxe : **
```
.print "BONJOUR"
.print "bonjour", lower
```

#### PRINT_CHAR

Imprime un octet PETSCII sous forme de code numérique et l'envoie via `CHROUT`.
La valeur peut également être une constante nommée ou une étiquette qui sera
résolue en un octet lors de l'assemblage.

**Syntaxe : **
```
.print_char 65

.print_char $41

.print_char couleur
```

#### PRINT_HEX

Imprime une valeur 8 bits sous forme de texte hexadécimal via le chemin de
sortie normal du KERNAL.

**Syntaxe : **
```
.print_hex A
```

#### CLEAR_SCREEN

Raccourci pour le code de contrôle standard de l'écran transparent du C64.

**Syntaxe : **
```
.clear_screen
```

#### WAIT_KEY

Attend qu'une touche soit pressée, vous n'avez donc pas à parcourir manuellement
la boucle `GETIN` à chaque fois.

**Syntaxe : **
```
.wait_key
```

#### DELAY

Attend le nombre d'images demandé via une routine auxiliaire partagée. Utilisez
cette fonction pour les pauses courtes et les intervalles de temps lorsqu'une
boucle personnalisée complète serait excessive. Le nombre d'images peut être un
nombre brut ou une constante nommée, et `.wait` est simplement un alias de
`.delay`.

**Syntaxe : **
```
.delay 29

.wait 29

.delay frames=FRAMES_1S
```

#### SET_BORDER / SET_BG

Fonctions d'encapsulation simplifiées pour les registres de couleur VIC-II. La
valeur de couleur peut être un nombre brut ou une constante nommée comprise
entre 0 et 15.

**Syntaxe : **
```
.set_border 6
.set_bg 0
.set_border color
.set_bg color
```

**Taille :** Chaque auxiliaire se développe en une minuscule séquence d’écriture
de registre ou en un court appel KERNAL.

---

### IRQ_SETUP

Configure un gestionnaire d'IRQ raster en une seule étape. La macro écrit le
vecteur d'IRQ, active les IRQ raster, définit la ligne, désactive les sources
d'IRQ CIA communes et revient à l'exécution normale avec `CLI`.

| Argument     | Description                                                   |
| ------------ | ------------------------------------------------------------- |
| Gestionnaire | Étiquette de routine IRQ (par exemple `my_irq`)               |
| Raster       | Ligne raster en hexadécimal ou en décimal (par exemple `$FA`) |

**Syntaxe : **
```
.irq_setup handler=my_irq, raster=$FA
```

**Taille : ** Une petite séquence de configuration ; la longueur exacte dépend
de la ligne raster sélectionnée.

Utilisez ceci lorsque vous souhaitez le code standard commun « SEI / installer
le gestionnaire / activer l'IRQ / CLI » sans le disperser dans tout le
programme.

---

### RAND

Comme **un minuscule PRNG intégré** — renvoie une valeur pseudo-aléatoire de 8
bits à partir d'une graine de page zéro compacte.

| Argument | Description                                                                   |
| -------- | ----------------------------------------------------------------------------- |
| Graine   | Octet ou étiquette d'initialisation de page zéro optionnel (par défaut `$FB`) |

**Syntaxe : **
```
.rand
```

**Taille : ** Quelques octets, en fonction du chemin d’implémentation choisi.

Ce générateur est conçu pour le gameplay, la variation des effets et la
production rapide de données de test. Il est volontairement simple plutôt que
sophistiqué sur le plan cryptographique.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Configure un sprite VIC-II en une seule ligne, au lieu d'écrire environ 6
instructions POKE en BASIC. Définit le pointeur de données du sprite, l'active,
active éventuellement le mode multicolore et définit sa couleur.

| Argument        | Description                                                                              |
| --------------- | ---------------------------------------------------------------------------------------- |
| Sprite #        | Sprite numéro 0 à 7                                                                      |
| Couleur         | Indice de couleur 0–15 (palette C64)                                                     |
| page de données | Adresse des données Sprite / 64 (par exemple `$21` si les données se trouvent à `$0840`) |
| Multicolore     | Active ou désactive le bit multicolore du sprite (`$D01C`)                               |

**Syntaxe : **
```
.sprite_init 0, 7, $21

.sprite_init 0, 7, $21, multicolore

.sprite_init 0, 7, $21, monochrome
```

**Code généré : **
```
LDA #$21

STA $07F8 ; registre pointeur de sprite ($07F8 + N)

LDA $D015

ORA #$01 ; activer le bit multicolore du sprite 0

STA $D015

LDA $D01C

AND #$FE ; désactiver le bit multicolore du sprite 0

STA $D01C

LDA #$07

STA $D027 ; registre de couleur du sprite 0
```

**Taille : ** 26 octets.

> **Page de données du sprite : ** `adresse_données ÷ 64 `. Avec le stub BASIC
> SYS par défaut, `ALIGN 64 ` après `JMP main ` place les données du sprite à
> `$0840 ` → page = `$21 `.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Comme **`POKE 53248, x : POKE 53249, y`** en BASIC — définit la position
initiale d'un sprite. Les coordonnées sont intégrées lors de l'assemblage et
acceptent des constantes ; pour l'animation, utilisez `INC`/`DEC` directement
sur le registre du sprite.

| Argument | Description                |
| -------- | -------------------------- |
| Sprite # | Sprite numéro 0 à 7        |
| X        | Position horizontale 0–319 |
| Y        | Position verticale 0–255   |

**Syntaxe : **
```
.sprite_pos 0, 152, 100
```

**Code généré (exemple : sprite 0, X=152, Y=100) : **
```
LDA #$98 ; Octet de poids faible X

STA $D000 ; Registre X du sprite 0

LDA $D010

AND #$FE ; Effacement du bit de poids fort X pour le sprite 0 (X ≤ 255)

STA $D010

LDA #$64 ; Y = 100

STA $D001 ; Registre Y du sprite 0
```

Pour X > 255, la macro définit le bit correspondant dans `$D010` au lieu de
l'effacer.

**Taille : ** 18 octets.

> **Remarque : ** `SPRITE_POS` intègre les coordonnées X/Y dans le code (`LDA
> #$xx`). Pour animer un sprite à l’exécution, utilisez `INC $D000` / `DEC
> $D000` — voir l’exemple `sprite-macro-demo`.

---

<a id="wait_raster"></a>
### WAIT_RASTER

Attend que le faisceau d'électrons du VIC-II atteigne une ligne de balayage
spécifique, comme pour la synchronisation avec une image TV. Placez ce programme
en début de boucle de jeu pour éviter les déchirures d'image. Aucun JSR ni
étiquette requis.

| Argument     | Description                                                      |
| ------------ | ---------------------------------------------------------------- |
| Ligne raster | Ligne raster cible en hexadécimal (par exemple `FF` = ligne 255) |

**Syntaxe : **
```
.wait_raster $FF
```

**Code généré : **
```
Attente :

LDA $D012 ; ligne raster actuelle

CMP #$FF ; ligne cible

BNE attente ; boucle de retour (-7 octets)
```

**Taille : ** 7 octets (le décalage `BNE` `$F9` = −7 pointe toujours vers le
`LDA`).

> **Conseil :** Placez `WAIT_RASTER` en haut de votre boucle de jeu pour
> synchroniser avec l’affichage et éviter le déchirement des sprites.

---

### JOYSTICK

Comme lire **`PEEK($DC00)`** puis modifier la position du sprite — mais en une
seule ligne. Lit un port joystick CIA et ajuste les coordonnées X/Y du sprite en
conséquence. Entièrement intégré, sans JSR.

| Argument | Description                                                                |
| -------- | -------------------------------------------------------------------------- |
| Port     | `1` = port 1 (`$DC01`) ou `2` = port 2 (`$DC00`)                           |
| Sprite # | Sprite numéro 0–7 (contrôle quelle paire de registres X/Y est mise à jour) |

**Syntaxe : **
```
.joystick 2, 0
```

**Code généré (port 2, sprite 0):**
```
LDA $DC00 ; lecture du port CIA 2

LSR ; bit 0 → retenue (Montée)

BCS skip_up ; retenue définie = NON enfoncée

DEC $D001 ; Y−1 (déplacement vers le haut)
skip_up :

LSR ; bit 1 → retenue (Descendance)

BCS skip_down

INC $D001 ; Y+1 (déplacement vers le bas)

skip_down :

LSR ; bit 2 → retenue (Gauche)

BCS skip_left

DEC $D000 ; X−1 (déplacement vers la gauche)

skip_left :

LSR ; bit 3 → retenue (Droite)

BCS skip_right

INC $D000 ; X+1 (déplacement vers la droite)

skip_right :
```

**Tableau des bits du joystick (actif-BAS — bit = 0 signifie enfoncé) :**

| Peu | Direction   | registre de la CIA              |
| --- | ----------- | ------------------------------- |
| 0   | En haut     | $DC00 (port 2) / $DC01 (port 1) |
| 1   | Vers le bas |                                 |
| 2   | Gauche      |                                 |
| 3   | Droite      |                                 |
| 4   | Feu         | (non géré par cette macro)      |

**Taille : ** 27 octets. Le décalage `BCS` est toujours `+3` (ignore
l’instruction `DEC`/`INC abs` de 3 octets suivante).

**Mode variable — `.joystick port, vx, vy[, fire]`:** Au lieu de déplacer un
sprite, la direction est écrite dans des variables : `vx` / `vy` = `-1` / `0` /
`+1` (`$FF` / `$00` / `$01`), et le `fire` = `1` optionnel lorsque le bouton est
enfoncé, `0` sinon. Utilisez-le pour une caméra à défilement, un joueur avec sa
propre physique ou des menus. Le port `3` lit les deux ports joystick
simultanément (`LDA $DC00` / `AND $DC01`), donc les deux ports fonctionnent.

```
.joystick 2, vx, vy ; 35 octets

.joystick 3, vx, vy, tir ; les deux ports + tir : 45 octets
```

> **Utilisation typique :** Placer à l’intérieur d’une étiquette `gameloop` avec
> `WAIT_RASTER` en premier :
> ```
> boucle de jeu :
> 
> ATTENDRE_RASTER ($FF)
> 
> JOYSTICK (port=2, sprite=0)
> 
> JMP boucle de jeu
> ```

---

<a id="mouse"></a>

> **2.1:** le port doit être connu lors de la mise en page du code (un nombre ou
> une constante), car le port 3 allonge le code de 3 octets ; une étiquette
> définie ultérieurement est une erreur.
### MOUSE

Interprète un signal de souris proportionnelle Commodore 1351 et déplace un
sprite. Entièrement intégré (X71X) — aucun JSR ni étiquette requis. La macro
sélectionne le port CIA, attend la stabilisation des entrées de la palette SID,
puis décode le déplacement delta à l'aide du modèle de pilote standard du 1351
et l'applique aux registres du sprite.

| Argument   | Description                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------- |
| Port       | `1` = CIA `$DC00` bits `7:6` = `%01`; `2` = `%10`                                                  |
| Sprite #   | Sprite numéro 0 à 7                                                                                |
| Octet ZP X | Adresse de la page zéro (hexadécimal) pour stocker l'échantillon POTX précédent (par exemple `FD`) |
| Octet ZP Y | Adresse de la page zéro (hexadécimal) pour stocker l'échantillon POTY précédent (par exemple `FE`) |

**Forme de code générée (port 1, sprite 0, ZP `$FD`/`$FE`):**

```
; Sélection du port CIA + règlement

LDA $DC00

ET #$3F

ORA #$40

STA $DC00

LDX #$67
Attente :

DEX

Attente BNE

; Axe X — Décodage delta 7 bits standard de type 1351

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
xdone :

; Axe Y — même décodage, puis inversion avant application

LDA $D41A

TAXE

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
yneg :

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
ydone :
```

**Taille : ** 142 octets.

**Syntaxe : **
```
.mouse port, spriteNum, zpX, zpY

; exemple :

.mouse 2, 0, FD, FE
```

> **Important :** Avant le premier appel, initialisez les octets de la page zéro
> avec les valeurs POTX/POTY actuelles pour éviter un saut sur la première trame
> :
> ```
> ; port 1 : LDA $DC00 : ET #$3F : ORA #$40 : STA $DC00
> 
> ; port 2 : LDA $DC00 : ET #$3F : ORA #$80 : STA $DC00
> 
> LDA $D419 : LSR A : ET #$3F : STA $FD
> 
> LDA $D41A : LSR A : ET #$3F : STA $FE
> ```

> **Conseil :** Interrogez la souris une fois par image — placez `WAIT_RASTER`
> dans la boucle de jeu avant `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Comme **`PEEK($D01E)`** en BASIC — vérifie les registres de collision matériels
du VIC-II et indique si un sprite a heurté un autre sprite ou le fond. Fonction
entièrement intégrée, sans JSR.

| Argument          | Description                                                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Sprite #          | Sprite numéro 0–7 (quel sprite vérifier)                                                                                                      |
| Type de collision | `Sprite-Sprite ($D01E)` — collision avec un autre sprite ; `Sprite-Arrière-plan ($D01F)` — collision avec un élément graphique d'arrière-plan |

**Syntaxe : **
```
.sprite_col 0, sprite
.sprite_col 0, arrière-plan
```

**Code généré (sprite 0, sprite–sprite):**
```
LDA $D01E ; lit le registre de collision sprite-sprite (le vide !)

ET #$01 ; isole le bit 0 (sprite 0)

; A ≠ 0 → collision survenue
```

**Taille : ** 5 octets.

> **Important : ** La lecture de `$D01E`/`$D01F` ** efface le registre **.
> Lisez-le une fois par image et agissez immédiatement sur le résultat avec
> `BEQ`/`BNE`.

**Utilisation typique :**
```
boucle de jeu :

.wait_raster $FF

.joystick 2, 0

.sprite_col 0, sprite

BEQ no_hit ; A = 0 → pas de collision

LDA #$02

STA $D020 ; bordure rouge = touché !

JMP boucle de jeu
no_hit :

LDA #$0E

STA $D020 ; bordure bleu clair = dégagé

JMP boucle de jeu
```

> **Voir aussi :** `collision-demo` exemple — boule verte (sprite n° 0) contre
> croix rouge (sprite n° 1).

---

### LOADFILE

Comme **`LOAD "fichier",8`** en BASIC, cette commande charge un fichier depuis
une disquette D64 à l'exécution, en utilisant la routine KERNAL LOAD.
Utilisez-la pour charger des données, de la musique ou du code supplémentaire
depuis le disque pendant l'exécution de votre programme.

| Argument                             | Description                                                                                                                                                                                                                                                    |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nom de fichier                       | Nom du fichier sur le disque (16 caractères maximum, majuscules automatiques ; les caractères `,`, `"`, `/`, `\`, `:`, `*`, `?`, `<`, `>`, `|` sont filtrés)                                                                                             |
| Appareil                             | Numéro de périphérique 8–30 (par défaut `8`)                                                                                                                                                                                                                   |
| Adresse de remplacement (facultatif) | Adresse de chargement hexadécimale (par exemple, `C000`). Si cette option est définie, le fichier est chargé à cette adresse (`sec=0`, l'en-tête PRG étant ignoré). Laissez ce champ vide pour utiliser l'en-tête PRG de 2 octets propre au fichier (`sec=1`). |
| Étiquette d'erreur (facultatif)      | Si cette option est activée, une instruction `BCS` est générée après JSR LOAD. Si le KERNAL renvoie une retenue (erreur), l'exécution saute à cette étiquette.                                                                                                 |

**Syntaxe : **
```
.loadfile "DEMO-COLORS", 8

.loadfile "DEMO-COLORS", 8, $C000

.loadfile "DEMO-COLORS", 8, $C000, error_label
```

**Structure du code généré : **
```
JMP skip_filename ; ignorer le nom de fichier en ligne

.byte "DEMO-COLORS" ; octets du nom de fichier (PETSCII, 11 caractères)
skip_filename :

LDA #11 ; longueur du nom de fichier

LDX #<fname ; pointeur lo

LDY #>fname ; pointeur hi

JSR $FFBD ; SETNAM

LDA #1 ; fichier logique #1

LDX #8 ; périphérique 8

LDY #0 ; sec=0 (remplacer l'adresse) ou #1 (adresse propre au fichier)

JSR $FFBA ; SETLFS

LDA #0 ; commande LOAD (et non VERIFY)

JSR $FFD5 ; LOAD

Échec BCS ; (uniquement si l'étiquette d'erreur est définie)
```

**Taille : ** `3 + longueur_nom_de_fichier + 9 (SETNAM) + 9 (SETLFS) + (4 si
remplacement) + 5 (LOAD) + (2 si étiquette d'erreur) ` octets. Minimum 27
octets.

> Important : Le nom de fichier est stocké directement dans le code machine
> juste après un JMP skip_filename. Le nom de fichier sur le disque doit être en
> PETSCII majuscules, ce qui correspond aux lettres majuscules ASCII (A à Z). La
> macro applique cette contrainte automatiquement.

> **Utilisez toujours une étiquette d'erreur** pour les programmes de production
> — si le fichier n'est pas trouvé, KERNAL définit l'indicateur de retenue et
> l'exécution passe à la suite.

> **Voir aussi :** `loadfile-demo` exemple — démontre le chargement de
> `DEMO-COLORS.PRG` à partir d'un D64 avec une branche d'erreur BCS et un écran
> d'erreur visuel.

---

### EXODECRUNCH

Décompression Exomizer en cours de programme ****. Utilisez cette macro juste
après un `LOADFILE` qui a chargé un flux compressé en mode mémoire Exomizer `` —
EXODECRUNCH le décompresse à l'adresse intégrée dans le flux.

| Argument             | Description                                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Adresse du déballeur | Emplacement en mémoire du code de décompression (par défaut : `B000`). Doit être une adresse hexadécimale de 16 bits. |

**Syntaxe : **
```
.exodecrunch

.exodecrunch depacker=$B000
```

**Code généré (19 octets) : **
```
LDA $AE ; Fin de chargement du noyau (définie par le chargement précédent)

STA $04 ; Pointeur de fin de chargement du décompresseur (niveau bas)

LDA $AF ; Fin de chargement du noyau (niveau haut)

STA $05 ; Pointeur de fin de chargement du décompresseur (niveau haut)

LDA #$36 ; ROM BASIC désactivée ($A000-$BFFF devient RAM)

STA $01

Décompresseur JSR ; le décompresseur lit de l'arrière vers l'avant via $04/$05

LDA #$37 ; Restauration du mappage par défaut (BASIC + KERNAL + E/S)

STA $01
```

**Comment ça marche :**

1. KERNAL `LOAD` ($FFD5) met à jour ZP `$AE/$AF` pour pointer un octet après le
   dernier octet chargé. EXODECRUNCH copie cette valeur dans ZP `$04/$05`,
   conformément à la convention officielle Exomizer pour l'écriture en amont.
2. Le décompresseur est généralement placé à `$B000` (dans la région mappée de
   la ROM BASIC). La macro inverse `$01 = $36` afin que le processeur voie la
   RAM à cet emplacement pendant l'exécution du JSR, puis rétablit `$01 = $37`
   par la suite.
3. L'adresse cible de décompression est **encodée dans le flux compressé
   lui-même** lorsque vous compressez avec `exomizer mem -l <load>
   fichier,<cible>` — le décompresseur la lit à partir des premiers octets du
   flux.

**Décompresseur binaire : ** le décompresseur rétrocompatible précompilé est
`exo-decrunch.bin ` (dans le dossier `samples/ ` de l'assembleur visuel C64)
(477 octets, ORG $B000). Il s'agit d'une interface Kick Assembler pour le
fichier officiel `exodecrunch.asm ` avec `INC $D020 ` ajouté à chaque lecture
pour un effet de clignotement visible des bordures pendant la décompression.
Placez-le dans votre programme avec `.incbin ` à l'adresse du décompresseur.

**Entrée brute : ** l'extra est transmis à Exomizer en tant que fichier brut
chargé à l'adresse Dst (`file@<Dst>`), de sorte que le dépackeur écrit chaque
octet, en commençant par le premier, exactement à l'adresse que vous avez
saisie.

> **Voir aussi :** l’exemple `exo-multicolor-demo` — exemple complet de bout en
> bout : LOADFILE un bitmap multicolore compressé dans $C000, EXODECRUNCH le
> décompresse dans $2000, puis copie l’écran → $0400 et la couleur → $D800, et
> bascule VIC-II en mode bitmap multicolore.

---

### REU_CHECK

Détecte si une unité d'extension de RAM Commodore (REU) est branchée — comme
vérifier `PEEK($D010)` pour voir si le matériel est présent. Teste en écrivant
et en relisant deux motifs dans le registre REU `$DF04`.

| Argument | Description    |
| -------- | -------------- |
| Aucun    | Aucun opérande |

**Code généré (34 octets) :**
```
LDA #55$
STA $DF04
LDA $DF04
CMP #55$
Échec du BNE
LDA #$AA
STA $DF04
LDA $DF04
CMP #$AA
Échec du BNE
MDL #00$
CMP #$FF ; Z=0 => REU présent
BNE terminé
échouer:
MDL #$FF
CMP #$FF ; Z=1 => pas de REU
fait:
```
> La macro normalise le résultat afin que la branche suivante reste simple :
> `BNE` signifie REU présent, `BEQ` signifie REU manquant.

**Syntaxe : **
```
.reu_check
```

**Résultat dans les drapeaux : **
- **Z = 0** (résultat ≠ 0) → REU présent → utiliser `BNE`
- **Z = 1** (résultat = 0) → pas de REU → utiliser `BEQ`

**Aucun argument** — la macro génère le même code à chaque fois.

**Utilisation typique :**
```assembly
.reu_check
BEQ no_reu ; sauter si REU n'est pas présent
; ... Code REU ici ...
non_reu :
```

---

### REU_STASH / REU_FETCH / REU_SWAP

Transfert de blocs DMA entre la RAM du C64 et la mémoire d'extension REU :
similaire à une boucle POKE très rapide, mais sans intervention du processeur
(la puce REU copie les données pendant que le processeur est inactif). Un
transfert de 1 000 octets est quasi instantané.

| Macro       | Direction     | `$DF01` commande |
| ----------- | ------------- | ---------------- |
| `REU_STASH` | RAM C64 → REU | `$90`            |
| `REU_FETCH` | REU → RAM C64 | `$91`            |
| `REU_SWAP`  | RAM C64 ↔ REU | `$92`            |

**Arguments :**

| Argument    | Description                                         | Exemple |
| ----------- | --------------------------------------------------- | ------- |
| Adresse C64 | Source/destination dans la RAM du C64 (hexadécimal) | `C000`  |
| Adresse REU | Source/destination en REU (hexadécimal, 16 bits)    | `0000`  |
| Banque REU  | banque de mémoire REU (0–7)                         | `0`     |
| Longueur    | Nombre d'octets à transférer (hexadécimal, 16 bits) | `1000`  |

**Syntaxe : **
```
.reu_stash $C000, $0000, 0, $1000

.reu_fetch $C000, $0000, 0, $1000

.reu_swap $C000, $0000, 0, $1000
```

**Code généré (40 octets) : **
```
LDA #c64lo STA $DF02 ; Adresse C64 LO
LDA #c64hi STA $DF03 ; Adresse C64 HI
LDA #reuLo STA $DF04 ; Adresse REU LO
LDA #reuHi STA $DF05 ; Adresse REU HI
LDA #bank STA $DF06 ; Banque REU
LDA #lenLo STA $DF07 ; Longueur LO
LDA #lenHi STA $DF08 ; Longueur HI
LDA #$00 STA $DF09 ; Contrôle d'adresse (fixe)
LDA #$00 STA $DF0A ; Masque d'interruption (fixe)
LDA #cmd STA $DF01 ; Exécution DMA ($90/$91/$92 = stockage/récupération/échange, immédiat)
```

> **Remarque : ** Les commandes utilisent `$90/$91/$92` (bit 4 activé = mode DMA
> immédiat). L’écriture dans `$DF01` lance le transfert ; le processeur reprend
> son exécution une fois celui-ci terminé.

---

### TURBO_SET

Configure la vitesse du processeur **Ultimate-64 (U64)** via le registre
`$D031`. Sans effet sur un véritable C64 ou d'autres émulateurs.

**Arguments :**

| Argument | Description                     | Gamme                                       |
| -------- | ------------------------------- | ------------------------------------------- |
| Vitesse  | Indice de vitesse du processeur | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz        |
| Badline  | Émulation de Badline            | Activé (compatible C64) / Désactivé (turbo) |

L'octet de vitesse est calculé comme suit : `(speedIndex & 0x0F) |
(badline_disabled ? 0x80 : 0x00)`.

**Code généré (5 octets) : **
```
A9 xx LDA #speed_byte
8D 31 D0 STA $D031
```

**Syntaxe : **
```
.turbo_set 7,0 ; vitesse=7 (~10 MHz), badline activé

.turbo_set 15,1 ; vitesse=15 (~48 MHz), badline désactivé
```

> **Remarque : ** Cette macro affecte uniquement le matériel U64. Sur un
> véritable C64 ou d’autres émulateurs, elle écrit dans `$D031`, ce qui peut
> affecter le CIA ou être ignoré.

---

### SUPERCPU_DETECT

Vérifie si un accélérateur **CMD SuperCPU** est installé — comme `PEEK($D0B8)`
pour voir s'il renvoie quelque chose d'autre que `$FF`.

**Code généré (5 octets) : **
```
AD B8 D0 LDA $D0B8
C9 FF CMP #$FF
```

**Résultat dans les drapeaux : **
- **Z = 0** → SuperCPU présent → utiliser `BNE`
- **Z = 1** → SuperCPU introuvable → utiliser `BEQ`

**Aucun argument.**

**Syntaxe : **
```
.supercpu_detect
```

**Utilisation typique :**
```assembly
.supercpu_detect

BEQ no_scpu ; ignorer si le SuperCPU est absent
; ... Code turbo SuperCPU ici ...
no_scpu :
```

---

### TURBO_ENABLE

Active ou désactive le mode turbo SuperCPU **CMD **. Appelez d'abord
`SUPERCPU_DETECT ` et ignorez cette étape si le SuperCPU n'est pas présent.

| Mode       | Registre | Effet                                                |
| ---------- | -------- | ---------------------------------------------------- |
| Activer    | `$D07A`  | Activer le mode turbo (jusqu'à 20 MHz avec SuperCPU) |
| Désactiver | `$D07B`  | Retour au mode de compatibilité 1 MHz                |

**Code généré (5 octets) : **
```
A9 00 LDA #$00
8D 7A D0 STA $D07A ; (ou 07 milliards de dollars pour désactiver)
```

**Syntaxe : **
```
.turbo_enable activé
.turbo_enable désactivé
```

> **Remarque : ** Appelez d’abord `SUPERCPU_DETECT` et contournez cette macro si
> le SuperCPU n’est pas présent.

---

<a id="map_copy"></a>
### MAP_COPY

Copie une carte de tuiles depuis une adresse source vers la RAM écran (et
éventuellement la RAM couleur) à l'aide d'une série de boucles `LDA abs,X` /
`STA abs,X`. Une page de 256 octets est copiée à chaque itération ; une page
partielle à la fin est copiée via `CPX #rem / BNE` pour interrompre la copie.
Aucun JSR n'est nécessaire : tout le code est généré directement dans le code.

| Argument                      | Description                                                                                                                                                                                                                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Adresse source (écran)        | Adresse hexadécimale où se trouvent les données de la carte après le chargement (par exemple, `C000`)                                                                                                                                                                                                                    |
| Écran RAM dest                | Où copier les codes d'écran (par exemple `0400`)                                                                                                                                                                                                                                                                         |
| Taille (octets)               | Nombre total d'octets à copier — généralement `$03E8` = 1000 (40×25 caractères)                                                                                                                                                                                                                                          |
| Source de couleur             | `auto` : les données de couleur suivent les codes d'écran (`source + taille`) ou une adresse source de couleur explicite. Les données de couleur sont copiées dans la mémoire RAM couleur lors d'une seconde passe. Omettez cette option (ainsi que la destination de couleur) pour copier uniquement les codes d'écran. |
| destination de la RAM couleur | Destination des données de couleur — par défaut `D800` (RAM couleur C64)                                                                                                                                                                                                                                                 |

**Code généré (carte de 1000 octets, écran uniquement) :**
```
LDX #$00

LDA $C000,X ; page 0

STA $0400,X

INX

BNE *-9 ; boucle jusqu'à ce que X soit égal à 0 (256 itérations)

LDA $C100,X ; page 1

STA $0500,X

INX

BNE *-9

LDA $C200,X ; page 2

STA $0600,X

INX

BNE *-9

LDA $C300,X ; reste — 232 octets

STA $0700,X

INX

CPX #$E8

BNE *-11
```

**Taille : ** `2 (LDX) + pages complètes×9 + (rem > 0 ? 11 : 0)` octets par
section. Le mode combiné double cette valeur (section écran + section couleur
identique).

**Appairage avec l'éditeur de cartes : **

L'éditeur de cartes de l'assembleur visuel C64 (**Sauvegarder la carte + RAM
couleur**) exporte un seul fichier binaire dont les `premiers octets sont des
codes d'écran et les `octets suivants sont des valeurs de RAM couleur. Utilisez
`.map_copy` avec `auto` comme source de couleur et l'adresse source où ce
fichier est chargé (par exemple, avec `.incbin` à `$C000`).

```
.incbin "map-color.bin", $C000 ; codes d'écran $C000–$C3E7, couleur $C3E8–$C7CF

; ...

.map_copy $C000, $0400, 1000, auto, $D800
```

**Syntaxe : **
```
.map_copy $C000, $0400, 1000 ; écran uniquement

.map_copy $C000, $0400, 1000, auto, $D800 ; combiné (couleur à la source + taille)

.map_copy $C000, $0400, 1000, $C3E8, $D800 ; adresse source de couleur explicite
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Copie une zone de caractères de 16×16 à partir d'un bloc de code écran compact
de 256 octets et d'un bloc de mémoire RAM couleur correspondant de 256 octets.
Cette fonction est conçue pour les exportations de canevas de jeu de caractères
et les petits fragments de tuiles/images, où l'écriture de seize lignes MAP_COPY
distinctes serait fastidieuse.

**Disposition par défaut : **

| Données                          | Adresse par défaut       |
| -------------------------------- | ------------------------ |
| Codes d'écran 16×16              | Adresse source (`src`)   |
| Valeurs de couleur 16×16         | `src + 256`              |
| destination de la RAM de l'écran | `$0400 + ligne×40 + col` |
| destination de la RAM couleur    | `$D800 + ligne×40 + col` |

**Syntaxe : **
```
.map_copy16x16 $3000, 12, 4

.map_copy16x16 $3000, 12, 4, $0400, $3100, $D800
```

La forme abrégée copie les octets d'écran de `$3000`, les octets de couleur de
`$3100` et place le bloc 16×16 à la colonne 12, ligne 4. Les positions valides
en haut à gauche sont `col = 0..24` et `row = 0..9`, de sorte que la zone
complète de 16×16 reste sur l'écran de texte 40×25 du C64.

**Comportement généré : **

- Génère seize copies de lignes en ligne.
- Chaque ligne copie 16 octets d'écran et 16 octets de couleur.
- Aucune JSR n'est nécessaire ; le code est émis directement à l'emplacement de
  la macro.
- Fonctionne en mode caractère normal et en mode caractère multicolore ; les
  octets de la mémoire RAM couleur contiennent le bit d'activation de la
  couleur/multicolore du caractère de chaque cellule.

Association typique avec Charset Canvas :

```
* = 0801 $
    SEI
    MDL #00$
    STA $D021
    LDA #$05
    STA $D022
    LDA #$0D
    STA $D023
    .map_copy16x16 3 000 $, 12, 4
boucle:
    Boucle JMP

.incbin "16x16+ram+color.bin", 3 000 $
.incbin "16x16+charset.bin", 2 000 $
```

---

<a id="sprite_anim"></a>
### SPRITE_ANIM

Cette fonction fait progresser l'image d'animation d'un sprite à chaque appel et
met à jour le pointeur de données du sprite VIC-II. Elle stocke un octet par
image dans une table (le numéro de page des données du sprite = `adresse_données
/ 64`), fait pointer SPRITE_ANIM vers cette table et appelle la fonction une
fois par image de jeu ; aucun JSR n'est nécessaire.

| Argument                       | Description                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Sprite #                       | Sprite numéro 0 à 7                                                                                                |
| Adresse de la liste des cadres | Adresse hexadécimale de la table des trames — un octet par trame, chaque octet = page de sprite (`data_addr / 64`) |
| Nombre d'images                | Nombre total d'images (1–255)                                                                                      |
| Cadre ZP                       | Octet de page zéro utilisé comme compteur de trame (par exemple `FB`)                                              |

**Code généré (sprite 0, 4 images, ZP `$FB`, liste à `$C100`):**
```
INC $FB ; avance du compteur d'images

LDA $FB

CMP #$04 ; nombre d'images

BCC *+6 ; si compteur < nombre, ignorer la réinitialisation

LDA #$00

STA $FB

TAX ; X = index de l'image actuelle

LDA $C100,X ; charger la page de données du sprite pour cette image

STA $07F8 ; mettre à jour le pointeur du sprite 0 ($07F8 + numéro du sprite)
```

**Taille : ** 19 octets.

**Utilisation typique :**
```
Table des images :

.byte $21, $22, $23, $24 ; 4 images à $0840, $0880, $08C0, $0900

Boucle de jeu :

.wait_raster $FF

.sprite_anim 0, $C100, 4, $FB

Saut dans la boucle de jeu
```

**Syntaxe : **
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte

; exemple :

.sprite_anim 0, C100, 4, FB
```

> Conseil : Placez la table des trames contenant `.rawbytes` à une adresse fixe.
> L’octet de compteur ZP (`$FB`) doit être initialisé à `$00` avant le premier
> appel. Si votre code utilise `$FB` à d’autres fins, choisissez un emplacement
> ZP libre.

---

<a id="score_bcd"></a>
### SCORE_BCD

Ajoute une valeur à virgule fixe à un score BCD multi-octets stocké en mémoire,
puis affiche chaque chiffre dans la mémoire RAM de l'écran sous forme de
caractère de code écran. Utilise le mode décimal 6502 (`SED`/`CLD`) pour des
calculs BCD sans retenue ; aucun ajustement manuel de la retenue n'est
nécessaire.

| Argument           | Description                                                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Adresse du score   | Adresse hexadécimale des octets de score BCD (par exemple `C200`). Octet de poids faible en premier.                   |
| Chiffres           | Nombre d'octets BCD (chaque octet contient deux chiffres : `$99` = "99"). `4` octets = jusqu'à 99999999.               |
| Ajouter des points | Valeur décimale à ajouter par appel (par exemple `100`).                                                               |
| Adresse de l'écran | Où écrire les codes numériques de l'écran (par exemple `0400`). Un octet par chiffre (octet de poids fort en premier). |

**Syntaxe : **
```
.score_bcd $C200, 4, 100, $0400
```

**Code généré (4 octets, +100 pts, score à `$C200`, écran à `$0400`):**
```
SED ; activer le mode BCD/décimal

CLC

LDA $C200 ; octet 0 (chiffres 1-2)

ADC #$00 ; octet de poids faible de 100 en BCD = $00

STA $C200

LDA $C201 ; octet 1 (chiffres 3-4)

ADC #$01 ; octet médian de 100 en BCD = $01 (la retenue se propage)

STA $C201

LDA $C202

ADC #$00

STA $C202

LDA $C203

ADC #$00

STA $C203

CLD ; retour au mode binaire

; afficher les chiffres

LDX #$00
boucle_chiffres :

LDA $C200,X

PHA

LSR : LSR : LSR : LSR ; nibble de poids fort → nibble de poids faible

ORA #$30 ; + code écran '0'

STA $0406,X ; justifié à droite : adresse_écran + (chiffres*2 - 2) - X*2

PLA

AND #$0F ; nibble de poids faible

ORA #$30

STA $0407,X

INX

CPX #$04

BNE boucle_chiffres
```

**Taille : ** `3 + chiffres×8` octets (SED + CLC + surcharge CLD + 8 octets par
octet BCD pour ADC + boucle d’affichage).

**Syntaxe : **
```
.score_bcd $C200, 4, 100, $0400
```

> Conseil : Initialisez les octets du score à $00 au démarrage. L’adresse du
> score doit se trouver dans la page zéro ou dans la RAM absolue, et non dans la
> ROM. L’adresse de l’écran doit pointer vers la cellule numérique la plus à
> gauche ; les chiffres sont écrits de gauche à droite (octet de poids fort en
> premier).

> **Plage BCD : ** `chiffres=4` octets → 8 chiffres décimaux → score maximum 99
> 999 999. Chaque octet encode deux chiffres BCD : `$00`–`$99`.

---

## 7. Syntaxe de type KickAssembler

VMA lit également les formes KickAssembler courantes, de sorte qu'une source
KickAssembler est souvent compilée telle quelle :

- `.pc = $1000` et `*=$1000 "nom"` définissent l'adresse (le nom du segment est
  ignoré).
- `.const NAME = value` et `.label NAME = value` définissent des constantes ;
  `.label NAME = *`, `.label NAME = * + 1` place une étiquette à (ou près de)
  l'adresse actuelle.
- `.macro name(p1, p2) { … }` — un corps de macro entre accolades, outre `.macro
  … .endm`; `:name(args)` et `name(args)` l'appellent.
- `nom : { … } ` portées : les étiquettes à l'intérieur sont locales à `nom`
  (`nom.étiquette` de l'extérieur).
- `@label` les étiquettes conservent leurs `@`.
- `.text "…"` sans coordonnées d'écran stocke les octets encodés comme `.byte`.
  Plusieurs éléments peuvent être joints avec `,` ou `+` : `"…"`, `@"…"` avec
  les séquences d'échappement `\n` `\r` `\t` `\$NN`, et `$NN` / octets décimaux.
  `.encoding "name"` sélectionne l'encodage des lignes `.text` suivantes :
  `screencode_mixed` (par défaut), `screencode_upper`, `petscii_mixed`,
  `petscii_upper`, `ascii` ; un caractère pour lequel l'encodage ne possède pas
  de code est une erreur.
- Les suffixes mnémoniques `.abs` / `.a` et `.zp` / `.z` forcent l'adressage
  absolu ou de page zéro : `sta.abs $00FC,x`, `ldx.zp ptr,y`.
- `// …` commentaires.

Le reste du langage KickAssembler (`.for`, `.var` / `.eval`, `.function`,
`.pseudocommand`, `#import`, `#if`, `LoadBinary`, segments …) est géré par le
préprocesseur Kick de l'assembleur visuel C64, qui transforme un arbre source
KickAssembler en texte VMA.

## 8. Ligne de commande

Nouveautés de la version 2.1.0 : `--crt` / `--crt-name` (cartouche) et `--d64` /
`--add` / `--disk-name` (image disque).

```
vma build <input.asm> [options]

vma --help
vma --version
```

| Option                        | Signification                                                                                                                                                                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-o FICHIER`                  | Le PRG à écrire (par défaut : l’entrée avec une extension `.prg`)                                                                                                                                                                                       |
| `--répertoire-base DIR`       | Où les fichiers `.incbin` / `.koala` / `.level` / `.sid` / `.include` sont recherchés en premier (par défaut : le dossier d’entrée)                                                                                                                     |
| `--rechercher DIR`            | Un autre dossier à explorer après le répertoire racine (à répéter dans l'ordre) ; un chemin défini sur une autre machine correspond au nom du fichier.                                                                                                  |
| `--pas-de-stub-basique`       | Aucune ligne `10 SYS…` BASIC devant le code                                                                                                                                                                                                             |
| `--brut`                      | L'image seule à son premier ORG : pas de stub, pas de déplacement vers `$C000`                                                                                                                                                                          |
| `--fichier crt`               | Cartouche Magic Desk (CRT type 19, 8 banques de 8 Ko, 65 408 octets maximum) : un chargeur copie le programme à son adresse de chargement et le lance à l’adresse SYS — le CRT de compilation de l’assembleur visuel. Sans `-o`, aucun PRG n’est écrit. |
| `--crt-name NOM`              | Le nom de la cartouche dans l'en-tête CRT (par défaut : `VA CART`)                                                                                                                                                                                      |
| `--d64 [FICHIER]`             | Une image disque 1541 contenant le PRG, nommée d'après ce dernier (fichier par défaut : le PRG avec l'extension `.d64`) ; aucun c1541 n'est nécessaire. Sans `-o`, aucun PRG n'est écrit.                                                               |
| `--ajouter FICHIER`           | Un autre fichier sur le disque tel quel (un PRG avec son adresse de chargement), nommé d'après le fichier (répétable, dans l'ordre)                                                                                                                     |
| `--nom-disque NOM`            | Le nom du disque (par défaut : le nom de fichier du D64 ; ID `01`)                                                                                                                                                                                      |
| `--sym FICHIER`               | Fichier d'étiquette KickAssembler (`.label NAME=$xxxx`)                                                                                                                                                                                                 |
| `--contre FICHIER`            | Fichier d'étiquettes du moniteur VICE (`al C:xxxx .NAME`; `x64sc -moncommands FILE`)                                                                                                                                                                    |
| `--fichier dbg`               | Carte source (XML) du débogueur RetroDebugger / C64                                                                                                                                                                                                     |
| `--débogage`                  | Tous les trois à côté du PRG (`out.sym`, `out.vs`, `out.dbg`)                                                                                                                                                                                           |
| `--fichier json`              | La compilation au format JSON : PRG, adresse SYS, symboles, lignes mises en page, segments écrits, vue mémoire — ou chaque erreur avec sa ligne                                                                                                         |
| `--chemin-source NOM`         | La source principale est nommée `.dbg` (par défaut : l’entrée)                                                                                                                                                                                          |
| `--fichier de carte linéaire` | Tableau JSON : ligne d'entrée → la ligne contenant les noms `.dbg`                                                                                                                                                                                      |

État de sortie : `0` construit, `1` erreur de compilation (`FICHIER:LIGNE:
message` sur l'erreur standard, une ligne par erreur), `2` mauvaise utilisation.

```
vma build game.asm -o game.prg --debug

vma build game.asm --no-basic-stub --search ../assets

vma build game.asm --crt game.crt # la cartouche uniquement

vma build game.asm --d64 --add music.prg # game.d64 avec GAME et MUSIC
```

## 9. Limitations connues

VMA reproduit le compilateur Visual Assembler C64 octet par octet, avec ses
imperfections :

- `lda.zp c` → `LDA $0C`: avec `.zp` un symbole composé de chiffres hexadécimaux
  est lu comme un nombre.
- Le corps d'une macro sans paramètre est également assemblé là où il est défini
  ; une définition avant le premier `* =` se trouve au début du programme.
- `.text X, Y, "s", 80` analyse le décalage de caractère mais ne l'utilise pas.
- Les octets de `.chardef` sont hexadécimaux (`129` = `$129`, une erreur).
- L'opérande non immédiat d'une exécution `.if` / `.while` / `.until` est lu
  comme une adresse : `%bin` est une erreur et `10` est hexadécimal (`$0010`).
- La routine d'assistance DELAY se place après la dernière ligne de la mise en
  page et chaque section de données — même pour un DELAY ignoré (`.if 0`).

Corrigé dans la version 2.1 (le code fourni était incorrect ou échouait
auparavant) : un opérande `.const` / `.var` dans la page zéro, `JMP
(étiquette)`, `lda $1234+1`, un appel de macro à l’intérieur d’une macro, une
valeur TURBO_SET / SPRITE_ANIM non résolue (désormais une erreur), des
étiquettes dans les octets de `.data` / `.rawbytes`, une étiquette `:name` dont
la cible est une étiquette, la taille de JOYSTICK / MEMCPY / MEMSET d’une
étiquette ultérieure (désormais une erreur), le tampon automatique de `.data` /
`.rawbytes`, et les inclusions (l'absence d'une inclusion est une erreur, les
propres `.include` / `.incbin` / `.sid` d'un fichier inclus sont chargés).
