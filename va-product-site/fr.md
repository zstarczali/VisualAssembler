# Manuel d'utilisation de l'assembleur visuel C64

**Version 2.4.0**

Un assembleur 6502 visuel et basé sur des blocs pour le Commodore 64. Créez des programmes en faisant glisser et en déposant des blocs d'instructions, et visualisez en temps réel le code assembleur et le code machine générés.

---

## Table des matières

- [C64 Visual Assembler — Manuel de l'utilisateur](#c64-visual-assembler--user-manual)
    - [Points saillants de la version 2.4.0](#version-240-highlights)
    - [Points saillants de la version 2.3.9](#version-239-highlights)
    - [Points saillants de la version 2.3.8](#version-238-highlights)
  - [Table des matières](#table-of-contents)
  - [1. Aperçu de l'interface](#1-interface-overview)
  - [2. Palette de blocs](#2-block-palette)
  - [3. Domaine du programme](#3-program-area)
    - [Entrée de l'opérande](#operand-input)
  - [4. Vue ASM](#4-asm-view)
    - [Modes de sortie](#output-modes)
    - [Onglet Outils](#toolkit-tab)
    - [Onglet Options](#options-tab)
    - [Clic sur une ligne ASM](#clicking-an-asm-line)
    - [Numéros de ligne ASM](#asm-line-numbers)
    - [Module de progression de la compilation](#compile-progress-modal)
  - [5. Paramètres et barre d'outils](#5-settings--toolbar)
    - [Charger le fichier .asm (référence rapide)](#load-asm-file-quick-reference)
      - [Notes d'analyse et bonnes pratiques d'importation](#import-parsing-notes-and-best-practices)
  - [Mode UltimateBasic](#ultimatebasic-mode)
    - [Ouverture de l'éditeur UB](#opening-the-ub-editor)
    - [Outils de l'éditeur](#editor-tools)
    - [Projets, onglets et fichiers de démarrage](#projects-tabs-and-startup-files)
    - [ Construction et diagnostic](#building-and-diagnostics)
    - [Running, D64 et Exomizer](#running-d64-and-exomizer)
    - [Symboles du débogueur et désassemblage](#debugger-symbols-and-disassembly)
    - [Manuel et source d'Ultimate Basic](#ultimate-basic-manual-and-source)
  - [6. Mode expert](#6-expert-mode)
    - [Changement de mode](#switching-modes)
    - [Mise en page de l'éditeur](#editor-layout)
    - [Boutons de la barre d'outils](#toolbar-buttons)
    - [Surlignage des erreurs](#error-highlighting)
    - [Surlignage syntaxique](#syntax-highlight)
    - [Formateur de source](#source-formatter)
    - [Panneau Projet & onglets](#project-panel--tabs)
    - [Barre d'onglets](#tab-bar)
  - [7. Modes d'adressage](#7-addressing-modes)
    - [Étiqueter les expressions comme opérandes](#label-expressions-as-operands)
    - [Le compteur de programme `*` dans les expressions](#the--program-counter-in-expressions)
    - [Étiquettes locales (pointillées)](#local-dotted-labels)
    - [Étiquettes d'opérandes à code auto-modifiable](#self-modifying-code-operand-labels)
  - [8. Instructions standard 6502](#8-standard-6502-instructions)
    - [Mouvement de données](#data-movement)
    - [Arithmétique](#arithmetic)
    - [Logique](#logic)
    - [Sauts et Branches](#jumps--branches)
    - [LBNE / LBEQ / … (Branches longues)](#lbne--lbeq---long-branches)
    - [Opérations d'enregistrement](#register-operations)
    - [Shift \&amp; Rotate](#shift--rotate)
    - [Pile](#stack)
    - [Système / Drapeaux](#system--flags)
    - [Instructions illégales / non documentées](#illegal--undocumented-instructions)
  - [9. Blocs macro — Référence](#9-macro-blocks--reference)
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
    - [SPRITE_POS](#sprite_pos)
    - [WAIT\_RASTER](#wait_raster)
    - [JOYSTICK](#joystick)
    - [MOUSE](#mouse)
    - [SPRITE_COL](#sprite_col)
    - [LOADFILE](#loadfile)
    - [EXODECRUNCH](#exodecrunch)
    - [REU\_CHECK](#reu_check)
    - [REU_STASH / REU_FETCH / REU_SWAP](#reu_stash--reu_fetch--reu_swap)
    - [TURBO\_SET](#turbo_set)
    - [SUPERCPU\_DETECT](#supercpu_detect)
    - [TURBO\_ENABLE](#turbo_enable)
    - [MAP\_COPY](#map_copy)
    - [MAP\_COPY16X16](#map_copy16x16)
    - [SPRITE\_ANIM](#sprite_anim)
    - [SCORE\_BCD](#score_bcd)
  - [10. Intégration du débogueur](#10-debugger-integration)
    - [RetroDebugger](#retrodebugger)
    - [Blocs de points de rupture](#breakpoint-blocks)
    - [Indicateurs du débogueur (onglet Options)](#debugger-flags-options-tab)
  - [11. Liens vers la base de connaissances](#11-knowledge-base-links)
  - [12. Exportation et exécution D64](#12-d64-export--run)
    - [Bouton Course fractionnée](#split-run-button)
    - [Exporter vers la boîte de dialogue D64](#export-to-d64-dialog)
    - [Métadonnées D64 dans les projets](#d64-metadata-in-projects)
  - [12b. Exportation CRT (cartouche Magic Desk 64K)](#12b-crt-export-magic-desk-64k-cartridge)
  - [13. Paramètres matériels](#13-hardware-settings)
    - [Émulateur VICE](#vice-emulator)
    - [Exomizer](#exomizer)
    - [Débogueur rétro](#retro-debugger)
    - [C64 Ultimate / 1541 Ultimate](#c64-ultimate--1541-ultimate)
  - [14. Éditeurs visuels (boîte à outils)](#14-visual-editors-toolkit)
    - [Éditeur haute résolution / multicolore](#hi-res--multicolor-editor)
    - [Éditeur de sprites](#sprite-editor)
    - [Navigateur ROM de caractères C64 ("Carte des caractères")](#c64-character-rom-browser-char-map)
    - [Éditeur de caractères (Charset)](#character-editor-charset)
    - [Éditeur de canevas de jeu de caractères](#charset-canvas-editor)
    - [Éditeur de cartes (Cartes de tuiles multicouches)](#map-editor-multilayer-tilemaps)
    - [SID Editor (3-Voice Tracker)](#sid-editor-3-voice-tracker)
    - [Éditeur de courbes](#curve-editor)

---

## Points forts de la version 2.4.0

- **Éditeur D64** — un explorateur d'images disque complet situé dans la barre d'outils (après l'Éditeur de courbes). Ouvrez un fichier `.d64` existant, créez-en un nouveau vierge ou lancez le disque actuel directement dans VICE, le tout depuis un menu Fichier ▾ identique à celui des autres éditeurs visuels. Voir [Éditeur D64 (explorer et modifier une image disque existante)](#d64-editor-browse--edit-an-existing-disk-image).
- **Ajouter / extraire / renommer / supprimer sur l'éditeur D64** — ajouter un fichier local au répertoire du disque, extraire une entrée sélectionnée vers un `.prg`, renommer une entrée directement dans le tableau ou la supprimer — chaque action est appliquée directement au fichier `.d64` via `c1541`, sans étape d'enregistrement séparée.
- **Adresse de chargement, adresse de décompression et Exomizer dans l'éditeur D64** — L'ajout d'un fichier brut sans en-tête permet de définir une adresse de chargement optionnelle, une cible de décompression Exomizer et de le compresser à l'importation, en utilisant les mêmes modes de compression `mem`/`sfx` que les fichiers supplémentaires de la boîte de dialogue Exporter vers D64. Un fichier `.prg` possédant déjà son propre en-tête ignore complètement ces champs.
- **Sélecteur de type d'entrée de disque** — choisissez PRG / SEQ / USR / REL pour un fichier nouvellement ajouté au lieu de toujours l'écrire en tant que PRG.
- **Liste de répertoire authentique** — la liste de fichiers de l'éditeur D64 s'affiche dans la police C64 Pro fournie, en majuscules, pour le look classique `LOAD"$",8`.
- **Corrigé : ** renommer une entrée dans l'éditeur D64 ne supprime plus la modification lorsque vous cliquez dans le champ de texte.
- **Amélioré : ** le badge de la barre d'outils de l'indicateur de mode du thème clair (MODE BLOC / MODE EXPERT / …) est plus foncé et plus lisible, et son animation scintillante est à nouveau visible.

---

## Points forts de la version 2.3.9

Cinq fonctionnalités d'assemblage améliorant le confort d'utilisation, toutes utilisables en mode texte Expert et (lorsque cela est pertinent) sous forme de blocs. Chacune d'elles est décrite plus bas :

- **`*` dans toute expression** — le symbole de compteur de programme fonctionne désormais à l'intérieur des expressions d'opérandes, et non plus seulement seul : `BNE *-5`, `JMP *+20`, `LDA #&lt;*`, `LDA #&gt;(*+63)`. Un `*` qui suit une valeur (`STRIDE*2`) correspond toujours à une multiplication. Voir [Modes d'adressage → Le compteur de programme `*` dans les expressions](#the--program-counter-in-expressions).
- Étiquettes locales (pointillées) : une étiquette telle que `.loop appartient à la portée de l’étiquette globale (non pointillée) précédente la plus proche. Ainsi, `DrawSprite et `ClearScreen peuvent chacune définir leur propre `.loop sans conflit. Voir Étiquettes locales (pointillées)(#local-dotted-labels).
- Les pseudo-opérations de branchement long (LBNE, LBEQ, LBCC, LBCS, LBMI, LBPL, LBCVC, LBCVS) s'assemblent en un branchement inversé via un JMP (toujours de 5 octets), permettant ainsi à la cible de se situer à n'importe quelle distance. Nouvelle catégorie de palette : Branchements longs. Voir LBNE / LBEQ / … (Branches longues)(#lbne--lbeq---long-branches).
- **`.assert` directive** — `.assert end - start &lt;= 256` or `.assert * &lt; $A000, "message"` est évalué lors de l'assemblage et provoque un échec de la compilation (affichant la valeur réelle) lorsque l'expression est fausse. Voir [.ASSERT](#assert).
- **Étiquettes d'opérandes à code auto-modifiable** — `Valeur LDA :#$00` définit l'étiquette `valeur` pointant vers l'octet d'opérande de l'instruction, de sorte que `Valeur STA` la modifie directement. Voir [Étiquettes d'opérandes à code auto-modifiable](#self-modifying-code-operand-labels).
- **Erreurs de branche hors plage plus conviviales** — une branche qui atterrit en dehors de −128…+127 indique maintenant exactement de combien elle dépasse et suggère la branche longue correspondante `LBxx`.

---

## Points saillants de la version 2.3.8

- ** Enregistrement/ouverture de l'espace de travail : ** enregistre l'ensemble exact des onglets ouverts (y compris l'onglet actif et son mode d'édition) dans un fichier d'espace de travail `.vaws`. Les espaces de travail sont enregistrés automatiquement lors de toute modification, et l'application restaure automatiquement votre dernier espace de travail au lancement.
- **Basculement du panneau de mémoire global : ** afficher ou masquer le panneau de mémoire complet du C64 à partir d'un commutateur d'interface utilisateur dédié.
- **Référence de commande Ultimate Basic localisée : ** les descriptions de commandes dans la fenêtre contextuelle d’autocomplétion et le panneau Commandes suivent désormais la langue de l’interface utilisateur actuelle (hongrois, anglais, espagnol, allemand, néerlandais), avec une version anglaise de repli.
- **Documentation graphique Ultimate Basic mise à jour : ** `STYLO DE COULEUR ` et le texte d’aide de la commande de dessin de tracé/ligne/rectangle/cercle et multicolore correspondent désormais au comportement actuel du compilateur.
- **Référence KERNAL corrigée : ** a corrigé les entrées `SETLFS` et `PLOT` (adresses et conventions d'appel) dans la table d'adresses KERNAL du désassembleur.
- **Utilisation de la mémoire corrigée avec de nombreux onglets ouverts : ** l'historique d'annulation/rétablissement par onglet est désormais limité (avec un petit rebond), empêchant la croissance illimitée de la mémoire qu'une longue session avec de nombreux documents ouverts provoquait auparavant.
- **Nettoyage de la barre d'outils de l'éditeur : ** suppression des boutons de bascule de point d'arrêt redondants des barres d'outils Expert et Ultimate Basic (les points d'arrêt sont toujours définis à partir de la gouttière du numéro de ligne), et alignement de la hauteur de la barre d'outils Expert avec la barre d'outils Ultimate Basic.

---

## 1. Aperçu de l'interface

L'application est divisée en trois panneaux principaux :

| Panneau                | Description                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------- |
| **Gauche — Palette**   | Toutes les instructions et macros disponibles. Recherchez ou parcourez par catégorie. |
| **Centre — Programme** | Votre programme. Glissez les blocs ici, réorganisez-les, modifiez les opérandes.      |
| **Droite — Sortie**    | Affichage ASM en direct et/ou sortie du moniteur de mémoire.                          |

L'icône de mode située à l'extrême droite de l'en-tête indique l'éditeur actif : **Block**, **Expert** ou **Ultimate Basic**. Elle se met à jour instantanément lors du changement de mode d'édition.

---

## 2. Palette de blocs

La palette de gauche répertorie tous les blocs disponibles, regroupés par catégorie :

- **Mouvement de données** — LDA, LDX, STA, STX, …
- **Arithmétique** — ADC, SBC, INC, DEC, CMP, …
- **Logique** — ET, OU, OU, BIT
- **Sauts et branchements** — JMP, JSR, RTS, BNE, BEQ, …
- **Branches longues** — LBNE, LBEQ, LBCC, LBCS, LBMI, LBPL, LBVC, LBVS (brancher à n'importe quelle distance ; voir §8)
- **Opérations sur les registres** — TAXE, TAY, INX, DEX, …
- **Maj et rotation** — ASL, LSR, ROL, ROR
- Pile **** — PHA, PHP, PLA, PLP
- **Système** — CLC, SEC, NOP, BRK, …
- **Instructions illégales** — LAX, SAX, DCP, …
- **Structure** — LABEL, COMMENTAIRE, RÉGION, ENDREGION
- **Macros** — LOOP, NEXT, FOR, ENDF, PUSH, PULL, END, TEXT, BYTE, WORD, FILL, ALIGN, ASSERT, STRING, DATA, RAWBYTES, RAWTEXT, PETSCII, CHARSET, INCBIN, SID, INCLUDE, TABLE, ORG, MACRO, ENDM, INVOKE, IF, ELSE, ENDIF, VAR, WHILE, ENDW, REPEAT, UNTIL, MEMCPY, MEMSET, PRINT, PRINT_CHAR, PRINT_HEX, CLEAR_SCREEN, WAIT_KEY, DELAY, SET_BORDER, SET_BG, IRQ_SETUP, RAND, SPRITE_INIT, SPRITE_POS, WAIT_RASTER, JOYSTICK, MOUSE, SPRITE_COL, LOADFILE, REU_CHECK, REU_STASH, REU_FETCH, REU_SWAP, TURBO_SET, SUPERCPU_DETECT, TURBO_ENABLE, MAP_COPY, MAP_COPY16X16, SPRITE_ANIM, SCORE_BCD

Utilisez le champ de recherche en haut de la palette pour filtrer par nom. Cliquez sur le bouton Ajouter le bloc sélectionné ou faites glisser un bloc dans la zone de programme.

---

## 3. Domaine du programme

- **Faites glisser et déposez** des blocs depuis la palette, ou **réorganisez** les blocs existants en faisant glisser leur poignée (≡).
- Chaque bloc affiche son **mnémonique**, son **champ d'opérande** et son **sélecteur de mode d'adressage** (le cas échéant).
- Cliquez sur le bouton **▸ / ▾** pour réduire ou développer un bloc.
- Utilisez le bouton **× (supprimer)** sur un bloc pour le supprimer.
- **Tout réduire** Le bouton replie tous les blocs en même temps.

### Mini-carte du panneau de blocs

Le panneau Programme comporte un bouton **minimap** activable dans son en-tête. Lorsqu'il est activé, une bande de 56 px ` apparaît sur le bord droit du panneau, affichant tous les blocs sous forme de barres horizontales de couleur.

| Couleur de la barre | Type de bloc                        |
| ------------------- | ----------------------------------- |
| Cyan                | Étiquettes                          |
| Bleu/violet         | Macros et directives                |
| Jaune               | Instructions                        |
| Vert                | Commentaires et lignes vides        |
| Rouge               | Blocs avec une erreur de validation |

Les blocs réduits sont affichés avec une opacité réduite. Cliquez ou faites glisser n'importe où sur la mini-carte pour faire défiler la liste des programmes jusqu'à cette position. L'indicateur de zone d'affichage (rectangle de couleur accentuée) suit la partie visible de la liste. L'état est conservé dans les paramètres de l'interface utilisateur (touche `blockMinimap`).

### Entrée de l'opérande

- Pour les instructions de branchement/saut (`BNE`, `JMP`, `JSR`, etc.), une liste déroulante **sélecteur d'étiquettes** apparaît — cliquez sur une étiquette définie pour l'insérer.
- Le format numérique suit le basculement **HEX / DEC** dans la barre d'outils (voir section 5).

---

## 4. Vue ASM

Le panneau de droite affiche le résultat généré en temps réel.

### Modes de sortie

| Mode               | Description                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ASM**            | Code source d'assemblage 6502 avec adresses et étiquettes                                                                                                                                                                                                                                                                                                                       |
| **Moniteur**       | Vidage hexadécimal/octet (style moniteur C64)                                                                                                                                                                                                                                                                                                                                   |
| **Désastre**       | Désassemblage pur du 6502 : adresse, octets hexadécimaux et mnémoniques avec opérandes numériques résolus. Les macros sont développées en instructions individuelles (paires TEXT → LDA/STA, LOOP → LDX, etc.). Les données BYTE/WORD/FILL sont affichées sous forme de dump hexadécimal par blocs. Aucun nom de macro, commentaire ou annotation n'est présent dans la sortie. |
| **Les deux**       | ASM en haut, moniteur en dessous                                                                                                                                                                                                                                                                                                                                                |
| **Désassembleur**  | Identique à Disasm — onglet dédié à la vue de démontage                                                                                                                                                                                                                                                                                                                         |
| **Boîte à outils** | Panneau de référence C64 : nuancier de 16 couleurs + aide-mémoire des codes de contrôle PETSCII et des caractères imprimables. Lecture seule — voir la sous-section « Boîte à outils » ci-dessous pour plus de détails.                                                                                                                                                         |
| **Options**        | Panneau des paramètres du programme — format numérique, activation/désactivation de la source des macros, paramètres du débogueur                                                                                                                                                                                                                                               |

### Onglet Boîte à outils

L'onglet **Toolkit** de la vue ASM est un panneau de référence rapide en lecture seule ; il ne modifie jamais votre programme. Deux sections :

| Section                     | Contenu                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Palette de couleurs C64** | Grille de 16 échantillons présentant toutes les couleurs C64 avec leur index (0–15 / `$00`–`$0F`) et leur nom. Cliquez sur un échantillon pour copier son index hexadécimal dans le presse-papiers. Survolez la couleur pour afficher son nom (Bleu clair, Marron, etc.).                                                                                                                                                                                                                          |
| **PETSCII control codes**   | Codes de contrôle courants pour `CHROUT` ($FFD2) : codes de changement de couleur (`$05` blanc, `$1C` rouge, `$1E` vert, `$1F` bleu, …), déplacement du curseur (`$11`/`$1D`/`$91`/`$9D`), marche/arrêt de l’inversion (`$12`/`$92`), `$93` effacement de l’écran. `$8E`/`$0E` : changements d’encodage de caractères. Également un aide-mémoire des plages imprimables (32-64 : ponctuation, 65-90 : A-Z, 91-95 : crochets, 96-127 : graphiques, 160-191 : graphiques décalés, 192-223 : miroir). |

L'outil Toolkit est le moyen le plus rapide de consulter un index de couleurs ou un octet de contrôle PETSCII sans quitter l'éditeur.

### Onglet Options

L'onglet **Options** contient les paramètres qui affectent la génération de code et l'affichage de la sortie :

- **Source de macro** — lorsqu'elle est activée, les blocs de définition de macro (MACRO…ENDM) affichent leur code source en ligne dans la vue ASM.
- **Adresse de début du programme** — désormais définie via un **bloc ORG** dans la zone du programme plutôt que par un champ de saisie séparé. Le premier bloc ORG définit l'adresse de chargement du programme ; les blocs ORG suivants démarrent des sections supplémentaires à des adresses différentes.
- **Paramètres du débogueur** — trois commutateurs en ligne contrôlant les indicateurs transmis au débogueur externe au lancement :
  - **`-jmp` ON/OFF** — saute directement à l'adresse de début du programme après le chargement.
  - **`-reprise` ON/OFF** — relancer le débogueur immédiatement au chargement.
  - **`-wait` ms ON/OFF** — ajoute un délai `-wait <ms>` avant de reprendre la lecture ; sélectionnez 500 ms ou 1000 ms dans la liste déroulante.
- **Informations de compilation** — affiche un résumé du programme compilé (adresse de début du code, taille, état du stub BASIC SYS).

### Cliquer sur une ligne ASM

Cliquez sur n'importe quelle ligne dans la vue ASM pour **mettre en surbrillance le bloc correspondant** dans la zone de programme.

### Numéros de ligne ASM

Le panneau ASM affiche les numéros de ligne **** (`001 |`, `002 |`, …) pour faciliter le dépannage lorsqu'une erreur de compilation pointe vers une ligne spécifique.

- Les numéros de ligne visuels sont uniquement destinés au diagnostic.
- **Copier ASM** copie toujours le texte source propre **sans** préfixes de numéro de ligne.

### Modal de progression de la compilation

Lors d'actions plus lourdes, une fenêtre modale de progression centrée apparaît avec une barre de progression :

- **Exécuter dans VICE** — compilation/construction du PRG et lancement de l'émulateur.
- **Débogage** — compilation/construction du PRG et lancement du débogueur.
- **Charger un fichier .asm** — ouvrir un fichier `.asm` en mode Expert et matérialiser les blocs à partir de la source.

La fenêtre modale se ferme automatiquement lorsque l'action est terminée ou a échoué.

---

## 5. Paramètres et barre d'outils

| Contrôle                                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ** Base numérique (HEX / DEC / BIN)**        | Définit le format d'affichage/de saisie des opérandes dans l'interface utilisateur. Le mode BIN affiche les valeurs en binaire avec le préfixe `%` (par exemple, `%11111000`). La vue ASM affiche toujours chaque bloc dans son propre format.                                                                                                                                                                                                                                                   |
| **Langue**                                   | Basculez l'interface utilisateur entre l'anglais, le hongrois, l'espagnol, l'allemand et le néerlandais (Nederlands).                                                                                                                                                                                                                                                                                                                                                                            |
| **Thème**                                    | Clair / Sombre / OLED / Commodore 77 — choisissez votre thème dans le menu Paramètres. Le thème OLED utilise un fond noir pur pour les écrans AMOLED. Le thème Commodore 77 est jaune fluo sur fond noir ; lorsqu’il est actif, l’écran de démarrage reprend la couleur du thème (correspondant à celle de la carte de message), affiche un logo Commodore 77 dédié plus petit et une barre de progression jaune. Le thème choisi est appliqué avant le premier affichage au prochain lancement. |
| **Mode rétro CRT**                           | Active ou désactive un filtre CRT plein écran : lignes de balayage, vignettage phosphorescent, scintillement et distorsion en barillet. L’état est conservé entre les sessions.                                                                                                                                                                                                                                                                                                                  |
| **Afficher le panneau de mémoire**           | Bouton global permettant d'afficher ou de masquer le panneau de mémoire complet du C64                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Système de base stub**                     | Ajoute une ligne BASIC appelant SYS au début de votre programme.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Échantillon**                              | Charger un programme d'exemple intégré                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Zoom avant / arrière**                     | Redimensionner l'interface utilisateur du bloc (affecte tous les éléments du bloc)                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Sauvegarder le projet**                    | Enregistrez le programme actuel en tant que fichier de projet `.json`.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Enregistrer le programme sous **           | Enregistrez le programme actuel en tant que fichier de projet `.json` en utilisant une nouvelle boîte de dialogue de fichier à chaque fois.                                                                                                                                                                                                                                                                                                                                                      |
| **Charger le projet**                        | Charger un projet précédemment enregistré                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Sauvegarder l'espace de travail**          | Enregistrez l'ensemble exact des onglets actuellement ouverts et associés à un fichier (y compris l'onglet actif et le mode d'édition de chaque onglet : Bloc/Expert/Basique ultime) dans un fichier d'espace de travail `.vaws`.                                                                                                                                                                                                                                                                |
| **Enregistrer l'espace de travail sous **    | Enregistrez l'espace de travail actuel à chaque fois en utilisant une nouvelle boîte de dialogue de fichier.                                                                                                                                                                                                                                                                                                                                                                                     |
| **Ouvrir l'espace de travail**               | Fermez tous les onglets ouverts et rouvrez l'ensemble des fichiers stockés dans un fichier d'espace de travail `.vaws`.                                                                                                                                                                                                                                                                                                                                                                          |
| **Définir le dossier de travail**            | Choisissez le dossier par défaut utilisé par les boîtes de dialogue de sélection et d'enregistrement de fichiers. Le chemin est enregistré dans la configuration de l'application et les aperçus des menus affichent la fin du chemin.                                                                                                                                                                                                                                                           |
| **Ouvrir le projet** (`Menu → Fichier`)      | Ouvrez un projet multi-fichiers `.proj` et ouvrez tous les fichiers sources sous forme d'onglets.                                                                                                                                                                                                                                                                                                                                                                                                |
| **Enregistrer le projet** (`Menu → Fichier`) | Enregistrez le projet actuel `.proj` (le panneau des projets doit être ouvert).                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Fermer le projet** (`Menu → Fichier`)      | Ferme le projet actuellement ouvert ainsi que tous ses onglets. Un message vous invite à enregistrer les modifications non enregistrées. Le panneau du projet retrouve son état initial.                                                                                                                                                                                                                                                                                                         |
| **Charger le fichier .asm**                  | Ouvre un fichier `.asm` en mode Expert et importe le code assembleur 6502 textuel dans l'onglet actuel.                                                                                                                                                                                                                                                                                                                                                                                          |
| **Sauvegarder PRG**                          | Exportez le binaire compilé sous forme de fichier `.prg`.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Build CRT**                                | Exportez le programme sous forme de fichier Magic Desk 64K (`.crt`, type de cartouche 19). Voir [Section 12b](#12b-crt-export-magic-desk-64k-cartridge).                                                                                                                                                                                                                                                                                                                                         |
| **Exécuter (bouton fractionné)**             | Le bouton principal **▶ Exécuter** lance le mode actuel ; cliquez sur la flèche **▾** pour basculer entre : **Exécuter en tant que PRG** (compiler et lancer VICE directement), **Exécuter via D64** (créer une image disque .d64 et lancer VICE), ou **Exécuter sur le matériel** (envoyer le PRG à un périphérique C64 Ultimate / 1541 Ultimate). Voir [Section 12](#12-d64-export--run) et [Section 13](#13-hardware-settings).                                                               |
| **Débogage (RetroDebugger)**                 | Compilez et lancez dans RetroDebugger avec des points d'arrêt, des symboles et des indicateurs de démarrage automatique (voir [Section 9](#9-debugger-integration))                                                                                                                                                                                                                                                                                                                              |
| **Exécuter avec Exomizer**                   | Case à cocher dans le menu Paramètres : lorsqu'elle est activée, toutes les opérations d'exécution et de compilation traitent le fichier PRG via `exomizer sfx sys` avant le lancement ou l'enregistrement. Fonctionne avec les options « Exécuter en tant que PRG », « Exécuter via D64 », « Exécuter sur le matériel », « Compiler le PRG » et « Compiler D64 ». Configurez d'abord l'exécutable Exomizer dans **Paramètres matériels**.                                                       |
| **Sauvegarde automatique des instantanés**   | Cochez la case correspondante dans **Paramètres matériels → Instantané **. Lorsqu'elle est activée, l'application crée automatiquement un instantané environ 2,5 secondes après la fermeture d'un onglet. Désactivez cette option si vous souhaitez uniquement enregistrer manuellement les instantanés.                                                                                                                                                                                         |
| **Paramètres matériels**                     | Ouvrez la boîte de dialogue de configuration matérielle — configurez VICE, Exomizer, RetroDebugger et C64 Ultimate (hôte, mot de passe, test de connexion). Voir [Section 13](#13-hardware-settings).                                                                                                                                                                                                                                                                                            |
| **Nouveau programme…**                       | Ouvre une boîte de dialogue de confirmation, puis efface tous les blocages de la zone du programme.                                                                                                                                                                                                                                                                                                                                                                                              |
| **Tout réduire**                             | Réduire tous les blocs                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **À propos de **                             | Informations sur la version                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Nouveautés**                               | Journal des modifications                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

### Aperçus du projet

Les instantanés de projet sont stockés sur disque dans des fichiers JSON externes, et non dans le stockage local. Ils sont liés au fichier de projet courant lorsqu'il existe, ce qui garantit la conservation de l'historique même après un redémarrage et son suivi du projet.

- **Menu → Build → Save snapshot** ouvre la boîte de dialogue de capture d'écran et enregistre l'état actuel du bloc ainsi que le texte Expert ASM.
- **Menu → Build → Restaurer la version précédente** restaure directement le dernier instantané.
- **Menu → Build → Snapshot history** ouvre la boîte de dialogue où vous pouvez ajouter des notes, restaurer des entrées plus anciennes ou les supprimer.
- **Paramètres matériels → Instantané → Enregistrement automatique des instantanés ** détermine si l'application crée automatiquement des instantanés après les modifications. Le délai par défaut est d'environ 2,5 secondes et ce paramètre s'applique à chaque onglet.
- Si un projet n'a pas encore été enregistré, des instantanés sont stockés dans le répertoire de configuration de l'application jusqu'à ce qu'un chemin d'accès soit défini pour le projet. | **Base de connaissances** | Liens de référence (opcodes 6502, noyau C64, carte mémoire, couleurs) | | **Recherche de mises à jour** | Consultez la page itch.io pour vérifier la disponibilité d'une nouvelle version |

### Espaces de travail

Un espace de travail (fichier .vaws) conserve en mémoire les fichiers physiques ouverts sur le disque dans chaque onglet, y compris le mode d'édition et l'onglet actif, ce qui permet de rouvrir exactement le même ensemble de fichiers ultérieurement. Il est distinct d'un projet : un espace de travail peut contenir une combinaison de fichiers de projet Block/Expert (fichier .json), de fichiers .asm autonomes et de sources Ultimate Basic (fichier .ub/.proj) répartis sur plusieurs onglets.

- Espaces de travail **enregistrement automatique** quelques centaines de millisecondes après que vous ayez effectué une modification une fois qu'un espace a été enregistré ou ouvert.
- L'application **restaure automatiquement votre dernier espace de travail** au lancement, de sorte que vos onglets ouverts reprennent là où vous vous étiez arrêté.
- Seuls les onglets associés à un fichier réel sur le disque sont enregistrés dans l'espace de travail ; un onglet contenant un échantillon non enregistré ou un programme uniquement en mémoire n'a rien à conserver et est ignoré (avec un avertissement si aucun des onglets ouverts ne remplit les conditions requises).
- L'ouverture d'un espace de travail ferme d'abord tous les onglets actuellement ouverts ; une confirmation vous sera demandée avant de poursuivre.
- Si un espace de travail fait référence à un fichier qui a depuis été déplacé ou supprimé, cette entrée est ignorée et signalée par son nom après le chargement.

### Charger le fichier .asm (référence rapide)

Le chargeur Expert-mode `.asm` accepte les modèles de sources 6502 courants et les convertit en blocs :

- `* = $1500` → ORG block
- `Label:` → LABEL block
- `Label: .byte 0` → LABEL + BYTE blocks
- `.byte ...` → BYTE block
- `; comment` (or inline `; ...`) → COMMENT block
- instructions (`lda`, `jsr`, `beq`, etc.) → blocs d'instructions avec mode d'adressage détecté

#### Notes d'analyse et bonnes pratiques d'importation

- Les étiquettes locales comme `.wait` sont importées comme étiquettes standard (point supprimé) et les références sont normalisées en conséquence.
- Pour l'adressage de style `($zp),Y` / `($zp,X)`, utilisez un octet de page zéro concret (`$FB`, `$FC`, etc.) pour une meilleure compatibilité.
- Évitez les étiquettes courtes ambiguës qui ressemblent à hex (`cc1`, `dead`, `beef`) dans les contextes de branche ; préférez les noms comme `loop_cc1`.
- Si votre programme commence par des données (`.byte`) avant le code exécutable, ajoutez un saut d'entrée explicite (par exemple `JMP Start`) en haut.

### Importation ASM (Kick Assembler)

Le bouton **ASM ** du menu Programme importe le code source brut de Kick Assembler dans un nouvel onglet en mode bloc. Il est distinct du bouton `Charger un fichier .asm ` du mode Expert mentionné ci-dessus ; son infobulle personnalisée indique que **seul le code Kick Assembler est pris en charge ** (d'autres assembleurs peuvent analyser partiellement le code, mais l'analyse complète n'est pas garantie).

Modèles pris en charge :

- `.pc = $XXXX` directive d'origine → Bloc ORG
- `.const NAME = valeur`, `.label NAME = valeur` → CONST equate
- `.macro NOM(p1, p2, ...) { ... }` avec `{`/`}` corps d'accolade ou `.endm` → définition de macro utilisateur
- L'appel de macro `NAME(args)`, le préfixe Kick à deux-points `:NAME(args)` et `.invoke NAME(args)` — tous ces allers-retours se font via la forme Kick à deux-points
- Les étiquettes `@local` (`@loop:`, `BEQ @loop`) conservent le préfixe `@` tel quel.
- Opérande `label + N` / `label - N` (par exemple `STA mod1+2`, `LDA xp+1`)
- Les commentaires de ligne `// ...` et `;` sont tous deux acceptés ; les blocs `/* ... */` sont traités comme une seule ligne de commentaire.
- Gestion automatique du démarrage BASIC : lorsque le programme démarre à `$0801` avec le stub d'octets standard `SYS 2061` (`.byte $0B,$08,$0A,$00,$9E,$32,$30,$36,$31,$00,$00,$00`), le compilateur génère le PRG tel quel au lieu d'ajouter un second SYS BASIC.

Limitation connue :

- Les constantes qui correspondent à une adresse de page zéro (par exemple, `.const BYTEADDR = $FC` utilisée comme `STA BYTEADDR`) sont actuellement compilées en instructions en mode absolu (3 octets) au lieu d'instructions de page zéro (2 octets). Le code compilé écrit toujours à l'emplacement mémoire correct, mais avec une légère surcharge de taille et de cycles par rapport au même code source compilé avec Kick Assembler.

## Mode UltimateBasic

Visual Assembler inclut un environnement de développement intégré (IDE) Ultimate Basic complet. Ultimate Basic est un langage BASIC compilé moderne permettant de créer des programmes, des jeux et des démos pour C64 sans avoir à écrire chaque opération en assembleur 6502 de bas niveau. Le compilateur s'exécute localement et génère une sortie PRG native pour C64.

### Ouverture de l'éditeur UB

Sélectionnez l'icône **UB** dans la barre d'outils principale pour passer en mode Ultimate Basic. Le mode d'édition sélectionné est conservé après le redémarrage de l'application. Un nouveau code source commence par :

```basic
color bg 0
color border 0

print "HELLO FROM ULTIMATE BASIC"
```

Le mode UB fonctionne avec les fichiers sources `.ub`. Les commandes **Nouveau**, **Ouvrir**, **Enregistrer** et **Enregistrer sous** s'appliquent à l'onglet UB actif. L'ouverture d'un fichier `.ub` active automatiquement l'onglet d'éditeur correspondant.

La barre d'outils affiche le dossier de travail UB actuel. Ce dossier est distinct du dossier de travail Bloc/Expert. Lorsque le mode UB est actif, le menu Fichier → Définir le dossier de travail permet de sélectionner le dossier UB ; son infobulle indique la portée active. Les boîtes de dialogue Ouvrir/Enregistrer UB s'ouvrent à partir de ce dossier, et les sources non enregistrées l'utilisent comme base pour les chemins relatifs include et incbin.

### Outils de l'éditeur

La barre d'outils UB reprend le même langage visuel et les mêmes infobulles personnalisées que le mode Expert. Elle offre :

- coloration syntaxique basée sur la référence actuelle du langage Ultimate Basic ;
- numéros de ligne qui restent synchronisés avec les fichiers longs ;
- une mini-carte et des commandes de zoom pour l'éditeur ; cliquez sur la mini-carte pour vous déplacer ou faites glisser sa sélection de zone d'affichage pour un défilement continu ;
- Rechercher (`Ctrl+F` / `Cmd+F`) à l'aide de la barre de recherche de style expert ;
- mise en forme du code source avec indentation tenant compte de la structure ;
- Saisie semi-automatique des commandes et des fonctions intégrées ;
- un panneau de commandes ** consultable avec syntaxe, description et conseils d'utilisation — les descriptions suivent la langue de l'interface utilisateur actuelle (hongrois, anglais, espagnol, allemand, néerlandais), en revenant à l'anglais pour tout ce qui n'est pas encore traduit ;
- Panneaux **Projet** et **Commandes** activables indépendamment, affichés côte à côte lorsque les deux sont activés ;
- Panneaux **Build Output** et **Disassembly** activables et redimensionnables indépendamment.

Le panneau Désassemblage comprend un bouton **Copier** qui copie l'intégralité du code source affiché dans le presse-papiers. L'aide des commandes suit le compilateur intégré : par exemple, `sprite_frame id, data_address [, frame]` sélectionne une image d'animation parmi des images de sprite consécutives de 64 octets.

La hauteur de la liste des commandes est volontairement limitée afin que la fiche de détail de la commande puisse occuper toute la hauteur restante du panneau. La zone de détail défile indépendamment pour les descriptions de syntaxe plus longues.

### Projets, onglets et fichiers de démarrage

Les projets Ultimate Basic utilisent des fichiers `.proj` et peuvent contenir plusieurs sources `.ub`. Le panneau Projet liste les fichiers ouverts, signale les onglets non enregistrés et affiche les étiquettes, fonctions et sous-programmes détectés. Les actions du projet permettent de créer, d'ouvrir, d'enregistrer et de fermer un projet, ou d'ajouter un autre fichier source.

Cliquez sur l'étoile à côté d'un fichier de projet pour le désigner comme fichier de démarrage. Les commandes Build, Run, D64, C64 Ultimate et Debug compilent ce code source de démarrage même si un autre onglet est actif. En l'absence de sélection de fichier de démarrage, l'onglet UB actif est utilisé.

### Bâtiment et diagnostic

Le bouton **Build** ouvre la même interface de progression centrée que celle utilisée par les autres flux de travail d'exécution de Visual Assembler. Les compilations réussies mettent à jour les sections Sortie de compilation, Informations de compilation et Désassemblage. Activez l'option **Verbose** pour inclure les détails de la carte mémoire du compilateur, les allocations internes de pages zéro et les données du code généré.

En cas d'échec de la compilation :

- Le résultat de la compilation est automatiquement affiché ;
- Les erreurs du compilateur sont affichées en rouge ;
- La boîte de dialogue de compilation centrée affiche l'échec ;
- En cas d'erreur contenant une ligne source, sélectionnez cette ligne dans l'éditeur UB actif.

Les rapports d'informations de compilation contiennent les adresses de chargement/de fin, les tailles de code et de PRG, l'état de l'Exomizer, les variables, les tableaux, les fonctions/sous-programmes et les étiquettes.

### En cours d'exécution, D64 et Exomizer

Le bouton principal **Run** prend en charge Ultimate Basic dans toutes les destinations normales :

| Mode d'exécution                 | Comportement fondamental ultime                                                                    |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Exécuter en tant que PRG**     | Compilez et lancez le PRG directement dans VICE.                                                   |
| **Exécuter via D64**             | Compilez, ouvrez la boîte de dialogue d'empaquetage D64 standard, puis lancez le disque dans VICE. |
| **Exécuter sur Ultimate**        | Téléchargez et exécutez le PRG via la connexion REST C64 Ultimate configurée.                      |
| **Exécuter D64 sur le matériel** | Emballez un D64 et envoyez-le au C64 Ultimate configuré.                                           |

L'option globale **Paramètres → Exomizer ** s'applique également aux versions UB et aux cibles d'exécution normales ; aucun commutateur UB supplémentaire n'est nécessaire. Le débogueur utilise délibérément le PRG non compressé afin que les adresses et les symboles du compilateur correspondent toujours au programme exécuté.

Activez **Paramètres → Paramètres du programme → Générer le code source UltimateBasic ASM (.asm)** pour enregistrer le code assembleur généré par le compilateur à côté d'une version PRG ou D64 utilisant le même nom de fichier de base. Il s'agit d'une option de compilation ; la barre d'outils UB ne contient donc pas de boutons d'exportation ASM distincts. Une instruction `load "NOM", $adresse` fournit également l'adresse de chargement PRG du fichier supplémentaire D64 correspondant.

### Symboles du débogueur et désassemblage

Les builds demandent des informations de débogage Ultimate Basic et produisent trois sidecars compatibles :

- `.sym` pour les symboles de style KickAssembler ;
- `.dbg` pour les informations source et de segment du débogueur C64/RetroDebugger ;
- `.vs` pour les étiquettes du moniteur VICE.

Le panneau de désassemblage UB colorisé résout les étiquettes connues et présente les adresses, les octets, les mnémoniques et les opérandes. Le bouton **Débogage** lance RetroDebugger avec le PRG UB brut, les modules de débogage et les étiquettes, fonctions, sous-programmes, variables et tableaux du compilateur. Les paramètres d'attente et de reprise du débogage sont identiques à ceux de la configuration standard du débogueur Visual Assembler.

### Manuel et source Ultimate Basic

L'icône de livre dans la barre d'outils UB ouvre le manuel Ultimate Basic `MANUAL.pdf ` correspondant hors ligne ; le bouton « Manuel » de la boîte de dialogue de bienvenue au démarrage ouvre le même manuel. Visual Assembler utilise le compilateur et le PDF à partir de la dépendance Git/Cargo amont, ce qui évite à l'IDE de conserver une seconde copie de l'implémentation d'Ultimate Basic. La boîte de dialogue « À propos » et l'écran de démarrage affichent la version actuelle de la dépendance.

Ultimate Basic est également disponible en tant que projet open source autonome :

<https://github.com/zstarczali/UltimateBasic>

Le compilateur est intégré à Visual Assembler, donc aucun exécutable `ub` séparé n'est requis lors de l'exécution.

## 6. Mode expert

Le mode Expert est un éditeur assembleur 6502 complet en mode texte direct, intégré à l'éditeur de blocs. Chaque onglet peut être en mode Bloc ou en mode Expert ; vous pouvez basculer librement entre les deux à tout moment grâce au bouton **Bloc / Expert** situé dans la barre supérieure.

### Changement de mode

- **Bloc → Expert : ** Le programme actuel est sérialisé en texte (une instruction par ligne, étiquettes et macros sous forme de directives). Les modifications effectuées en mode Expert sont synchronisées avec le tableau de blocs dès que vous revenez au mode Bloc ou que vous déclenchez une action.
- **Expert → Bloc : ** le texte est analysé avec `parseAsmText() ` et le résultat remplace le programme du bloc. Une boîte de dialogue d'erreur de compilation s'affiche en cas d'échec de l'analyse.
- **Les lignes vides** sont préservées lors des allers-retours : les lignes vides dans l’éditeur Expert apparaissent comme de fins espaces en pointillés en mode Bloc et sont restaurées comme lignes vides lors du retour au mode Expert.

### Mise en page de l'éditeur

```
┌──────────────────────────────────────────────────────┐
│ [toolbar]  Block │ Expert < tab toggle               │
├────────────┬────────────────────────────┬────────────┤
│  Palette   │   ASM text editor          │  Disasm    │
│  (opt.)    │   (monospace, editable)    │  panel     │
│            │                            │  (opt.)    │
└────────────┴────────────────────────────┴────────────┘
```

| Panneau            | Basculer              | Description                                                                                                                                                          |
| ------------------ | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Palette**        | `#expert-palette-btn` | Palette de blocs de gauche : faites glisser les blocs dans l’éditeur ou cliquez pour les insérer à l’emplacement du curseur.                                         |
| **Éditeur ASM**    | toujours visible      | Zone de texte à chasse fixe avec surbrillance syntaxique en temps réel                                                                                               |
| **Panneau Désasm** | `#expert-disasm-btn`  | Désassemblage complet du 6502 : chaque instruction affiche l’adresse, les octets hexadécimaux et les opérandes numériques ; les macros sont entièrement développées. |

### Boutons de la barre d'outils

| Bouton                                    | IDENTIFIANT                                    | Fonction                                                                                                                                                                                                                                                              |
| ----------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Format**                                | `#bouton-format-expert`                        | Formatage automatique du code source (étiquettes en colonne 0, retrait de 4 espaces, mnémonique/opérande de 1 espace)                                                                                                                                                 |
| **Charger .asm**                          | `#expert-load-asm-btn`                         | Ouvrez un fichier `.asm` : son contenu est chargé dans un nouvel onglet **** dont le nom correspond à celui du fichier. Chaque fichier chargé devient un onglet indépendant, avec ses propres blocs de programme et son propre état d'éditeur.                        |
| **Enregistrer .asm**                      | `#expert-save-asm-btn`                         | Enregistrer le contenu de l'éditeur dans un fichier `.asm` (boîte de dialogue de fichier lors du premier enregistrement)                                                                                                                                              |
| **Informations sur la version**           | `#expert-build-info-btn`                       | Ouvrir la boîte de dialogue Informations de compilation (origine, taille, étiquettes, erreurs)                                                                                                                                                                        |
| **HL**                                    | `#expert-hl-btn`                               | Activer/désactiver la coloration syntaxique (désactiver pour les fichiers très volumineux)                                                                                                                                                                            |
| **Saisie automatique**                    | `#expert-autocomplete-btn`                     | Activer/désactiver les suggestions de saisie semi-automatique pour les experts. Lorsqu'elles sont désactivées, aucune directive, aucun mnémonique ni aucune étiquette ne s'affiche dans l'éditeur expert.                                                             |
| **Sélection de région**                   | `#bouton-sélection-région-expert`              | Activez ou désactivez la mise en surbrillance automatique des régions en mode Expert. L'état de pliage est conservé, mais lorsque cette option est désactivée, l'éditeur affiche l'intégralité du code source et ne sélectionne pas automatiquement la région active. |
| **Réduire/développer toutes les régions** | `#expert-region-fold-all-btn`                  | Dépliez ou repliez chaque bloc `.region` en un clic. Si une région est ouverte, le bouton les replie toutes ; si toutes les régions sont déjà repliées, un clic supplémentaire les déplie. Le bouton s'illumine lorsque toutes les régions sont repliées.             |
| **Numéros de ligne**                      | `#expert-line-numbers-btn`                     | Activez ou désactivez l'affichage de la marge de numérotation des lignes à gauche de l'éditeur. Cette marge reste synchronisée avec la position de défilement et se met à jour en temps réel pendant que vous tapez.                                                  |
| **Trouver**                               | `#expert-find-btn`                             | Ouvrez la barre de recherche flottante (Ctrl+F). Saisissez votre recherche ; les résultats s’affichent en surbrillance. Appuyez sur Entrée ou Maj+Entrée pour naviguer entre les résultats. Appuyez sur Échap pour fermer la barre.                                   |
| **Zoom arrière / zoom avant**             | `#expert-zoom-out-btn` / `#expert-zoom-in-btn` | Diminuez/augmentez la taille de la police de l'éditeur (8–28 px). Ce paramètre est conservé.                                                                                                                                                                          |
| **Palette**                               | `#expert-palette-btn`                          | Afficher/masquer la palette mnémotechnique de gauche                                                                                                                                                                                                                  |
| **Désastre**                              | `#expert-disasm-btn`                           | Afficher/masquer le panneau de démontage (6502 pur, macros étendues)                                                                                                                                                                                                  |
| **Moniteur**                              | `#expert-monitor-btn`                          | Afficher/masquer le panneau d'affichage hexadécimal du moniteur                                                                                                                                                                                                       |
| **Mini-carte**                            | `#expert-minimap-btn`                          | Afficher/masquer la mini-carte du code sur le côté droit de l'éditeur                                                                                                                                                                                                 |

Raccourcis de l'éditeur : Ctrl+/ (Cmd+ sur macOS) commente la ligne courante ou toutes les lignes sélectionnées ; Maj+ supprime le marqueur de commentaire initial de ces lignes. Les commentaires en ligne (par exemple LDA $12 ; explication) restent affichés sur la ligne d'instruction lors du passage du mode Expert au mode Bloc. En mode Bloc, ils sont affichés sous forme de marqueur vert italique « comment » dans l'en-tête du bloc ; le survol du marqueur affiche le texte complet lorsqu'il est tronqué.

### Mini-carte de l'éditeur expert

La mini-carte de l'éditeur expert est une bande étroite (`88 px`) située à l'extrême droite de la zone d'édition. Elle affiche une représentation réduite de chaque ligne du code source :

| Couleur de la barre    | Type de jeton                                                 |
| ---------------------- | ------------------------------------------------------------- |
| Commentaire couleur    | Lignes commençant par `;`                                     |
| couleur de l'étiquette | Lignes avec une étiquette `:` définition                      |
| Couleur directive      | `.byte`, `.macro`, `.region`, et toutes les autres directives |
| Couleur mnémotechnique | Tout le reste (instructions)                                  |

Un indicateur de zone d'affichage semi-transparent (rectangle de couleur accentuée) indique la partie de la source actuellement visible. Cliquez n'importe où sur la mini-carte pour vous y rendre ; faites glisser pour un défilement continu. La mini-carte défile indépendamment afin de maintenir l'indicateur de zone d'affichage centré. L'état est conservé dans les paramètres d'interface utilisateur (touche expertMinimap).

### Mise en évidence des erreurs

Les lignes qui ne compilent pas sont surlignées en rouge (fond teinté + bordure accentuée à gauche) en temps réel, 350 ms après chaque frappe. Le premier message d'erreur s'affiche également dans la barre d'état. Corrigez la ligne et la surbrillance disparaîtra automatiquement.

### Mise en évidence de la syntaxe

L'éditeur utilise une superposition transparente (expert-hl) qui reflète le contenu de la zone de texte avec des éléments colorés. La mise en surbrillance peut être désactivée avec le bouton HL pour optimiser les performances des programmes très volumineux.

| Couleur    | Jeton                                                                                                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| jaune-vert | Mnémoniques (`LDA`, `STA`, `JMP`, …) et pseudo-opérations à branche longue (`LBNE`, `LBEQ`, …)                                                                               |
| Bleu       | Directives (`.byte`, `.word`, `.fill`, `.assert`, `*=`, …)                                                                                                                   |
| Orange     | Nombres (`$FF`, `%1010`, `255`)                                                                                                                                              |
| Cyan       | Étiquettes — lignes se terminant par `:`, y compris les étiquettes locales (`.loop:`) et les étiquettes d'opérandes de code auto-modifiable (`value:` dans `LDA value:#$00`) |
| Sarcelle   | chaînes littérales                                                                                                                                                           |
| vert foncé | Commentaires (` ; …`)                                                                                                                                                        |

Les directives `REGION` / `ENDREGION` sont mises en évidence comme les autres directives assembleur. Les régions réduites ne conservent que leur en-tête visible dans l'éditeur jusqu'à leur réouverture. Le nouveau bouton **Sélection de région** de la barre d'outils contrôle uniquement la mise en évidence automatique de la région courante en mode Expert ; le désactiver permet de conserver le code source visible sans modifier l'état de réduction.

### Formateur de source

Cliquez sur le bouton **Format** (`#expert-format-btn`) pour formater automatiquement la source actuelle :

- Les définitions des étiquettes sont déplacées vers la colonne 0.
- Les instructions sont indentées de 4 espaces.
- Les mnémoniques sont en majuscules.
- Exactement un espace entre le mnémonique et l'opérande (les espaces supplémentaires sont normalisés).
- Si la source est déjà formatée, un statut `"Déjà formaté"` est affiché.

### Panneau et onglets du projet

Le mode expert prend en charge un panneau de projet **** (`#expert-project-panel`) pour les projets multi-fichiers `.proj` :

- Un fichier `.proj` est un manifeste JSON qui répertorie les fichiers sources et leurs métadonnées.
- Ouvrez un projet avec **Menu → Fichier → Ouvrir un projet** ou faites glisser un fichier `.proj` sur la fenêtre.
- Chaque fichier du projet s'ouvre comme un onglet séparé dans la barre d'onglets en haut de l'éditeur.
- **Fermer le projet** (`Menu → Fichier → Fermer le projet` / `#menu-close-project`) ferme le projet en cours et tous ses onglets de fichiers simultanément. Un message vous invite à enregistrer les modifications non enregistrées avant la fermeture. Le panneau du projet est réinitialisé et `_expertProjectData` est effacé.
- Chaque fichier peut être désigné comme fichier de démarrage (icône étoile ★). Lorsqu'un fichier de démarrage est défini, le bouton Exécuter (PRG, D64, Ultimate) compile et exécute systématiquement le code de ce fichier, quel que soit l'onglet actif. Ceci est compatible avec les modes Bloc et Expert.
- La section **symboles** en bas du panneau du projet peut être redimensionnée verticalement avec le séparateur entre l'arborescence des fichiers et la liste des symboles, de sorte que les longues listes de symboles peuvent prendre plus d'espace si nécessaire.

### Barre d'onglets

La barre d'onglets apparaît au-dessus de l'éditeur lorsqu'il y a plus d'un onglet ouvert.

| Fonctionnalité            | Description                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Point sale**            | Un petit point de couleur contrastante sur le nom de l'onglet indique les modifications non enregistrées.                                                                                                                                                                                                                                                                                        |
| **Flèches de défilement** | Les boutons de défilement gauche/droite apparaissent lorsqu'il y a plus d'onglets que la barre ne peut en contenir.                                                                                                                                                                                                                                                                              |
| **Fermer (×)**            | Ferme l'onglet ; invite à enregistrer si l'onglet est modifié.                                                                                                                                                                                                                                                                                                                                   |
| **Extension de fichier**  | Le nom de fichier complet, extension comprise (`.c64va`, `.json`), est affiché.                                                                                                                                                                                                                                                                                                                  |
| **Menu clic droit**       | Faites un clic droit sur un onglet (ou un espace vide dans la barre d'onglets) pour : **Nouvel onglet**, **Fermer l'onglet**, **Fermer les autres onglets**, **Fermer les onglets à droite**, **Fermer tous les onglets**. Les opérations de fermeture par lots affichent une invite pour chaque onglet modifié et s'arrêtent si vous annulez. **Tout fermer** conserve toujours un onglet vide. |

> **Astuce :** La synchronisation de la palette (`#expert-palette-sync-btn`) maintient la sélection de la palette synchronisée avec le repère au niveau du curseur. Désactivez-la si vous préférez que la palette ne se déplace pas de manière aléatoire pendant l’édition.

---

## 7. Modes d'adressage

Chaque instruction 6502 prend en charge un ou plusieurs modes d'adressage. Le sélecteur de mode figure sur chaque bloc.

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

### Les expressions étiquetées comme opérandes

Tout champ d'opérande acceptant une adresse ou une valeur immédiate accepte également directement un nom de constante (provenant d'un bloc CONST ou d'un bloc LABEL). De plus, vous pouvez utiliser les expressions label+offset ou label−offset pour référencer une adresse relative à une constante nommée.

| Syntaxe             | Exemple                  | Description                                                                                                                                            |
| ------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `étiquette`         | `STA screen_ram,X`       | Se résout à la valeur de l'étiquette/constante                                                                                                         |
| `label+$hex`        | `STA screen_ram+$0100,X` | Adresse de l'étiquette plus un décalage hexadécimal                                                                                                    |
| `étiquette+décimal` | `STA screen_ram+256,X`   | Adresse de l'étiquette plus un décalage décimal                                                                                                        |
| `label-$hex`        | `Tableau LDA-$10`        | Adresse de l'étiquette moins un décalage hexadécimal                                                                                                   |
| `#<label`           | `LDA #<screen_ram`       | Octet de poids faible de l'adresse de l'étiquette                                                                                                      |
| `#&gt;étiquette`    | `LDA #&gt;screen_ram`    | Octet de poids fort de l'adresse de l'étiquette                                                                                                        |
| `*`                 | `BNE *`                  | Compteur de programme actuel (l'adresse propre à l'instruction) ; les branchements avec `*` génèrent une boucle infinie sur elle-même (décalage `$FE`) |

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

*(Nouveauté de la version 2.3.9.)* `*` ne se limite plus à l'opérande entier ; il peut apparaître **n'importe où dans une expression d'opérande** et représente l'adresse de l'instruction sur laquelle il est écrit. Il est résolu lors de l'assemblage par rapport à l'adresse réelle de cette instruction ; aucune étiquette n'est donc nécessaire pour les sauts relatifs courts ou les lectures de données relatives au compteur ordinal.

| Syntaxe             | Exemple                    | Signification                                                                    |
| ------------------- | -------------------------- | -------------------------------------------------------------------------------- |
| `*`                 | `BNE *`                    | Branchement à soi-même (boucle infinie, décalage `$FE`)                          |
| `*-n` / `*+n`       | `BNE *-5`, `BEQ *+4`       | Branchement relatif au PC actuel de *n* octets                                   |
| `JMP *+n`           | `JMP *+20`                 | Saut absolu calculé à partir du PC actuel                                        |
| `#&lt;*` / `#&gt;*` | `LDA #&lt;*`, `LDA #&gt;*` | Octet de poids faible / de poids fort du PC actuel                               |
| `#&gt;(*+n)`        | `LDA #&gt;(*+63)`          | Octet de poids faible / de poids fort d'une adresse relative au compteur ordinal |

**PC vs. multiplication.** `*` est traité comme le compteur de programme uniquement lorsqu'il se trouve en position de valeur ** — au début de l'expression, ou juste après un opérateur, `(`, `,`, `&lt;`, `&gt;` ou un espace. Un `*` qui suit un nombre, `)` ou un identificateur est une multiplication ordinaire, donc `LDA table*2` et `CONST_A*4` restent inchangés.

**Où cela fonctionne.** Tout opérande acceptant déjà une expression : cibles de branchement, `JMP` / `JSR`, `LDA`/`STA`/… opérateurs absolus et indexés, immédiats (octets de poids faible/fort) et l’expression `.assert`. `*` ne modifie jamais la taille d’une instruction ; son utilisation est donc sûre dans tous les modes d’adressage.

### Étiquettes locales (en pointillés)

*(Nouveau dans la version 2.3.9.)* Une étiquette dont le nom commence par un point — `.loop`, `.skip`, `.done` — est une étiquette locale.** Elle appartient à la portée de l'étiquette globale (sans point) précédente la plus proche et devient en interne <global>.<nom>.` Deux étiquettes locales portant le même nom court et appartenant à des étiquettes globales différentes ne sont pas en conflit.

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

- Dans une portée, référencez une étiquette locale comme `.name`.
- Depuis une autre portée, référencez-le explicitement comme `Global.name` (par exemple `JMP ClearScreen.loop`).
- Un `.name` écrit avant toute étiquette globale reste un simple `.name` de niveau supérieur.
- Les étiquettes locales font un aller-retour à travers le mode Block ⇄ Expert sans modification ; le préfixe `<global>.` est un détail de mise en page et n'est jamais stocké dans le programme de bloc.

### Étiquettes d'opérandes à code auto-modifiable

*(Nouveau dans la version 2.3.9.)* Préfixez l'opérande d'une instruction avec `label:` pour placer une étiquette sur l'**octet d'opérande** plutôt que sur le code opération. L'instruction est assemblée à partir de ce qui suit les deux-points.

```
setup:
    LDA value:#$00     ; 'value' -> address of the #$00 operand byte
    ...
patch:
    LDA #new
    STA value          ; writes the operand byte directly — classic SMC
```

La valeur `` pointe vers `<adresse d'instruction> + 1` (le premier octet d'opérande), quel que soit le mode d'adressage. Ceci remplace l'ancien modèle `STA instruction+1` / `instruction : LDA #$00`. Il fonctionne en mode Bloc ⇄ Expert (le champ d'opérande conserve le préfixe `label:`).

---

## 8. Instructions standard 6502

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
| `IMC`      | Brancher si moins (N=1)                                                    |
| `BPL`      | Brancher si Plus (N=0)                                                     |
| `BVC`      | Branchement si Overflow Clear (V=0)                                        |
| `BVS`      | Branchement si l'ensemble de débordement (V=1)                             |

#### LBNE / LBEQ / … (Longues branches)

*(Nouveau dans la version 2.3.9.)* La catégorie de palette **Branches longues** contient huit pseudo-opérations qui se comportent comme des branchements conditionnels mais atteignent **n'importe quelle adresse**, et pas seulement −128…+127. Chacune d'elles est assemblée en un branchement inversé qui saute un `JMP` de 3 octets — toujours **5 octets** :

```
LBEQ done      ; assembles to:   BNE *+3   ($D0 $03)
               ;                 JMP done  ($4C lo hi)
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

- Opérande : une étiquette, une expression `*` ou une adresse littérale — identique à une cible de branchement normale.
- Coût : 5 octets et 1 cycle supplémentaire sur le chemin emprunté par rapport à une branche courte. Il n’y a pas de promotion automatique d’une branche courte ; vous devez choisir explicitement `LBxx`.
- Lorsqu'une branche simple (`BNE`, `BEQ`, …) est hors de portée, l'erreur du compilateur nomme désormais le dépassement exact et suggère le `LBxx` correspondant.

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

### Shift & Rotate

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
| `CLI`      | Désactivation de l'interruption d'effacement  |
| `CLV`      | Effacer le drapeau de débordement             |
| `SEC`      | Drapeau de transport                          |
| `SED`      | Activer le mode décimal                       |
| `SEI`      | Désactiver l'interruption                     |
| `NOP`      | Aucune opération                              |
| `BRK`      | Interruption forcée / interruption logicielle |

### Instructions illégales / non documentées

Ces puces sont conçues pour une utilisation avancée. À utiliser avec précaution : leur comportement peut varier d’une puce à l’autre.

`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`, `AXS`

---

## 9. Blocs macro — Référence

Les macroblocs permettent d'effectuer des tâches courantes en une seule étape : au lieu d'écrire 10 à 20 instructions manuellement, il suffit d'insérer un bloc et l'assembleur génère le code. On peut les considérer comme des sous-programmes intégrés.

---

### LABEL

Comme un numéro de ligne ** en BASIC** — mais avec un nom au lieu d'un numéro. Cibles de saut pour `JMP`, `JSR`, `BNE`, etc.

| Champ              | Description                                        |
| ------------------ | -------------------------------------------------- |
| Nom de l'étiquette | Identifiant utilisé dans `JMP`, `JSR`, `BNE`, etc. |

**Syntaxe experte : **
```
loop:
```

**ASM généré : **
```
loop:  ; $0820
```

L'adresse actuelle est affichée en commentaire. Les étiquettes ont une taille de **0 octets**.

---

### COMMENT

Comme **REM en BASIC** — une note pour vous-même que l'assembleur ignore complètement.

**Syntaxe experte : **
```
; Your comment text here
```

**ASM généré : **
```
; Your comment text here
```

---

### BYTE

Comme **DATA en BASIC** — stocke une liste de valeurs d'octets bruts directement dans le programme.

| Champ    | Description                                                                             |
| -------- | --------------------------------------------------------------------------------------- |
| Opérande | Valeurs d'octets séparées par des virgules (par exemple `$01, $02, $FF` ou `1, 2, 255`) |

**Syntaxe experte : **
```
.byte $01, $02, $FF
```

**ASM généré : **
```
    .byte $01, $02, $FF
```

** Références d'étiquettes d'octets de poids faible/haut : ** BYTE accepte les jetons `<étiquette` (octet de poids faible) et `>étiquette` (octet de poids fort) de style KickAssembler/ca65, ainsi que des valeurs numériques. L'assembleur résout l'adresse de l'étiquette lors de la compilation et insère l'octet approprié. Exemple :

```
    .byte <frame_0, >frame_0, <frame_1, >frame_1
```

Ce bloc stocke l'octet de poids faible de l'adresse de la trame 0 ` `, puis l'octet de poids fort, et ainsi de suite pour la trame 1 ` `. Utile pour la construction de tables de branchement et de listes d'adresses.

**Taille :** Nombre d’octets dans la liste.

---

### WORD

Comme **DATA en BASIC mais pour les nombres de 16 bits **. Chaque valeur est stockée sur deux octets (octet de poids faible en premier, puis octet de poids fort — ordre little-endian 6502).

| Champ    | Description                                                                |
| -------- | -------------------------------------------------------------------------- |
| Opérande | Valeurs de 16 bits séparées par des virgules (par exemple, `$0400, $C000`) |

**Syntaxe experte : **
```
.word $0400, $C000
```

**ASM généré : **
```
    .word $0400, $C000
```

**Taille : ** 2 octets par mot.

---

### FILL

Comme `FOR I=1 TO N : POKE addr+I, val : NEXT` — remplit un bloc de mémoire avec le même octet, mais en un seul bloc. Idéal pour effacer des zones ou pré-remplir des tables.

| Champ    | Description                                                            |
| -------- | ---------------------------------------------------------------------- |
| Opérande | `count,value` — par exemple, `256,0` remplit 256 octets avec des zéros |

**Syntaxe experte : **
```
.fill 256, $00
```

**ASM généré : **
```
    .fill 256, $00
```

**Expression syntax:** Both `count` and `value` accept arithmetic expressions. You can reference CONST names, use hex/binary literals, and call built-in math functions:

| Expression                    | Signification                         |
| ----------------------------- | ------------------------------------- |
| `TILE_COUNT, $00`             | count from a CONST, value hex literal |
| `40*25, 0`                    | multiplication en ligne               |
| `arrondi(sin(PI/4)*255), $80` | trigonométrie                         |

**Fonctions intégrées : ** `sin() `, `cos() `, `round() `, `max(a,b) `, `min(a,b) `, `abs() `, constante `PI `

Opérateurs : `+ - * /` Littéraux : `$FF` (hexadécimal), `%10110000` (binaire) Octet de poids faible/de poids fort : `lo(expr)`, `hi(expr)`

**Taille : ** La valeur du nombre en octets.

---

### ALIGN

Décale l'adresse actuelle jusqu'à la prochaine limite libre en insérant des octets de remplissage nuls. Le C64 exige que les données de sprite commencent sur une limite de 64 octets ; `ALIGN 64` gère cela automatiquement.

| Champ  | Description                                                                               |
| ------ | ----------------------------------------------------------------------------------------- |
| Limite | Valeur d'alignement — par exemple `64` (limite du sprite), `256` (page), `$2000` (bitmap) |

**Syntaxe experte : **
```
.align 64
.align $2000
```

**ASM généré : **
```
    ; ALIGN 64 → $0840 (12 bytes padding)
```

**Taille : ** Dynamique — dépend de la position actuelle du compteur de programme.

> **Conseil :** Utilisez `ALIGN 64` avant les données de sprite, `ALIGN 256` pour garantir des tableaux alignés sur la page.

---

### TEXT

Comme **PRINT AT** — écrit du texte directement sur l'écran du C64 à une colonne et une ligne données, sans utiliser le KERNAL. Il génère une paire LDA/STA par caractère, ciblant la RAM d'écran à `$0400`.

| Champ                        | Description                                                     |
| ---------------------------- | --------------------------------------------------------------- |
| Texte                        | La chaîne à afficher                                            |
| X                            | Colonne (0–39)                                                  |
| Y                            | Ligne (0–24)                                                    |
| Étiquette (facultatif)       | Attribue une étiquette pointant vers l'adresse d'écran calculée |
| jeu de caractères minuscules | Case à cocher — voir ci-dessous                                 |

**Modes de jeu de caractères : **

Le C64 possède deux jeux de caractères sélectionnables lors de l'exécution :

| Mode                                              | $D018 bit 1 | Entrée en majuscules              | Entrée en minuscules                 |
| ------------------------------------------------- | ----------- | --------------------------------- | ------------------------------------ |
| **Majuscules/graphismes** (par défaut)            | 0           | `A`–`Z` → codes d'écran $01–$1A ✓ | traité également comme une majuscule |
| ** Minuscules/majuscules ** (après CHARSET lower) | 1           | `A`–`Z` → $01–$1A (majuscules)    | `a`–`z` → $41–$5A (minuscules) ✓     |

- ** Jeu de caractères majuscules (par défaut, case décochée) : ** Saisissez ce que vous souhaitez voir en majuscules. `« HELLO »` s’affiche comme `HELLO`. Les caractères minuscules sont convertis en majuscules à l’écran.
- ** Jeu de caractères minuscules (case cochée) : ** Saisissez la casse exacte souhaitée. `"hello" ` → affichage en minuscules, `"HELLO" ` → affichage en majuscules. Nécessite une modification du jeu de caractères à l'exécution avant l'écriture à l'écran (utilisez la macro **CHARSET lower**).

**ASM généré (mode majuscules, `"HELLO"`):**
```
    LDA #$08      ; 'H' screen code $08
    STA $0400
    LDA #$05      ; 'E' screen code $05
    STA $0401
    ...
```

**Syntaxe experte : **
```
.text 0, 2, "HELLO"           ; uppercase charset (default)
.text 0, 2, "hello", lower    ; lowercase charset
```

Les caractères sont encodés en codes d'écran (et non en PETSCII). Taille : longueur du texte × 5 octets (LDA + STA par caractère).

---

### STRING

Comme **POKEing une chaîne ** dans n'importe quelle adresse mémoire à l'exécution. Génère des paires LDA/STA qui copient le code d'écran de chaque caractère dans des adresses consécutives.

| Champ                        | Description                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| Texte                        | La chaîne à écrire                                                                                      |
| Adresse                      | Adresse mémoire cible — `$C000` hexadécimal ou un **nom d'étiquette**                                   |
| Étiquette (facultatif)       | Attribue une étiquette pointant vers l'adresse cible                                                    |
| Changement                   | Valeur hexadécimale (00–FF) ajoutée à chaque octet de code d'écran (par exemple `$80` = vidéo inversée) |
| jeu de caractères minuscules | Case à cocher — même sémantique que TEXTE (voir la section TEXTE)                                       |

**Syntaxe experte : **
```
.string $C000, "HELLO"                  ; uppercase charset (default)
.string $C000, "hello", lower           ; lowercase charset
.string $C000, "HELLO", 80             ; with shift (reverse video)
.string $C000, "hello", 80, lower      ; shift + lowercase
.string $C000, "HELLO" :my_string      ; with macroLabel
```

**ASM généré : **
```
    LDA #$08      ; 'H' screen code
    STA $C000
    LDA #$05      ; 'E' screen code
    STA $C001
    ...
```

Les caractères sont encodés en codes d'écran (et non en PETSCII). La valeur optionnelle Shift est ajoutée à chaque octet, par exemple $80 pour la vidéo inversée. Taille : longueur du texte × 5 octets (un LDA + un STA par caractère).

---

### DATA

Comme une boucle **POKE** — écrit une liste d'octets bruts à une adresse mémoire au moment de l'exécution, une paire LDA/STA par octet.

| Champ                  | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| Octets                 | valeurs d'octets séparées par des virgules                            |
| Adresse                | Adresse mémoire cible — `$C000` hexadécimal ou un **nom d'étiquette** |
| Étiquette (facultatif) | Attribue une étiquette pointant vers l'adresse cible                  |

**Syntaxe experte : **
```
.data $C000, $01, $02, $03          ; hex address
.data my_buf, $01, $02, $03         ; label address
.data $C000, $01, $02, $03 :mydata  ; with macroLabel
```

**ASM généré : **
```
    LDA #$01
    STA $C000
    LDA #$02
    STA $C001
    ...
```

**Taille : ** `byte_count × 5 ` octets (un LDA + un STA par octet).

---

### RAWBYTES

Like **DATA that loads directly into memory** — no runtime code at all. The bytes are present from the moment the PRG loads, before your code even starts. Use this for sprite data, level maps, lookup tables, anything that just needs to be at a specific address.

| Champ                  | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| Octets                 | valeurs d'octets séparées par des virgules                            |
| Adresse                | Adresse mémoire cible — `$C000` hexadécimal ou un **nom d'étiquette** |
| Étiquette (facultatif) | Attribue une étiquette pointant vers l'adresse cible                  |

**Syntaxe experte : **
```
.rawbytes $C000, $00, $00, $00      ; hex address
.rawbytes sprite_data, $00, $00     ; label address
.rawbytes $0C50, $00, $00 :nev      ; with macroLabel — other code can use LDA nev,X
```

**Taille en code : ** 0 octets. Les données sont placées à l’adresse indiquée dans la sortie.

> **DATA vs RAWBYTES : ** DATA génère du code LDA/STA qui copie les octets à l’exécution (plus lent, mais fonctionne si les données doivent être dynamiques). RAWBYTES place directement les octets : sans code, instantané et sans coût.

---

### RAWTEXT

Comme RAWBYTES, mais pour le texte : encode la chaîne en caractères d’écran et place les octets à une adresse fixe sans code d’exécution. Le texte est disponible en mémoire dès le chargement du PRG.

| Champ                        | Description                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| Texte                        | Chaîne à encoder                                                                                        |
| Adresse                      | Adresse mémoire cible — `$C000` hexadécimal ou un **nom d'étiquette**                                   |
| Étiquette (facultatif)       | Attribue une étiquette pointant vers l'adresse cible                                                    |
| Changement                   | Valeur hexadécimale (00–FF) ajoutée à chaque octet de code d'écran (par exemple `$80` = vidéo inversée) |
| jeu de caractères minuscules | Case à cocher — même sémantique que TEXTE (voir la section TEXTE)                                       |

**Syntaxe experte : **
```
.rawtext $C000, "HELLO"                 ; uppercase charset (default)
.rawtext $C000, "hello", lower          ; lowercase charset
.rawtext $C000, "HELLO", 80            ; with shift (reverse video)
.rawtext $C000, "hello", 80, lower     ; shift + lowercase
.rawtext $0400, "HELLO" :my_text       ; with macroLabel
```

**ASM généré : **
```
; .rawtext "HELLO" -> $C000
; $C000
    .byte $08, $05, $0C, $0C, $0F   ; H E L L O (uppercase screen codes)

; .rawtext "hello", lower -> $C000
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; h e l l o (lowercase screen codes $41–$5A range)
```

**Taille en code : ** 0 octets. Les données sont placées à l’adresse indiquée dans la sortie.

> **STRING vs RAWTEXT : ** STRING génère du code LDA/STA qui copie le texte à l’exécution. RAWTEXT intègre les octets dans le PRG au moment du chargement — sans code, sans attente.

---

### PETSCII

Comme **RAWBYTES mais pour la sortie KERNAL** — encode la chaîne en octets PETSCII (compatible avec CHROUT à `$FFD2`) et les place à une adresse fixe sans code d'exécution. Utilisez cette fonction pour afficher des caractères via `JSR $FFD2` en boucle. Notez que la nouvelle macro `PRINT` utilise le même encodeur et le même comportement pour la case à cocher « minuscules ».

> **PETSCII vs codes écran : ** Les codes PETSCII et les codes écran sont deux encodages différents. Code écran `$01` = lettre A ; PETSCII `$41` = lettre A (via CHROUT). Utilisez PETSCII uniquement pour l’impression via le KERNAL ; utilisez TEXT/STRING/RAWTEXT pour écrire directement dans la RAM d’écran.

| Champ                  | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| Texte                  | Chaîne à encoder en octets PETSCII                                    |
| Adresse                | Adresse mémoire cible — `$C000` hexadécimal ou un **nom d'étiquette** |
| Étiquette (facultatif) | Attribue une étiquette pointant vers l'adresse cible                  |
| PETSCII minuscule      | Case à cocher — voir ci-dessous                                       |

**Modes de jeu de caractères : **

| Mode                                   | Entrée en majuscules (`A`–`Z`)                                                                                                            | Entrée en minuscules (`a`–`z`) |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| **Majuscules (par défaut, non coché)** | `$41`–`$5A` (PETSCII majuscules via CHROUT)                                                                                               | également mappé à `$41`–`$5A`  |
| **Minuscules (coché)**                 | Les lettres alphabétiques sont réattribuées afin que la casse visible reste cohérente sur l'ensemble de caractères minuscules/majuscules. | Même règle                     |

**Syntaxe experte : **
```
.petscii $C000, "HELLO"              ; uppercase PETSCII (default)
.petscii $C000, "hello", lower       ; lowercase PETSCII ($61–$7A)
.petscii $C000, "HELLO", null        ; with null terminator
.petscii $C000, "hello", lower, null ; lowercase + null terminator
.petscii $C000, "HELLO" :my_msg      ; with macroLabel
```

**Octets générés (majuscules, `"HELLO"`):**
```
; $C000
    .byte $48, $45, $4C, $4C, $4F   ; H E L L O (PETSCII $41–$5A range)
```

**Taille en code : ** 0 octets. Les données sont placées à l’adresse cible sous forme de section de données différées (comme RAWBYTES).

**Terminateur nul :** Cochez la case *« Ajouter `$00` (terminateur nul) »* pour ajouter automatiquement un octet `$00` après le texte. Idéal pour les boucles terminées par un caractère nul :

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

**Règles d'encodage : **

| Saisir                                 | Mode majuscules                  | Mode minuscule |
| -------------------------------------- | -------------------------------- | -------------- |
| `A`–`Z`                                | `$41`–`$5A`                      | `$61`–`$7A`    |
| `a`–`z`                                | `$41`–`$5A` (majuscules forcées) | `$41`–`$5A`    |
| Espace, chiffres, ponctuation (32–126) | tel quel                         | tel quel       |
| Nouvelle ligne                         | `$0D` (RETOUR)                   | `$0D`          |
| Autre                                  | `$20` (espace)                   | `$20`          |

> **Conseil :** Utilisez PETSCII pour les données qui seront affichées via CHROUT (`$FFD2`). Pour écrire directement dans la mémoire RAM de l'écran, utilisez plutôt STRING ou RAWTEXT.

---

### CHARSET

Bascule la ROM de caractères VIC-II entre le mode majuscules/graphiques (par défaut C64) et le mode minuscules/majuscules, en modifiant le bit 1 de `$D018` au moment de l'exécution.

| Champ | Description                                                                                                                                            |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Mode  | ** Minuscules** — active le jeu de caractères minuscules/majuscules ; ** Majuscules** — rétablit le jeu de caractères majuscules/graphiques par défaut |

**Syntaxe experte : **
```
.charset lower    ; switch to lowercase charset
.charset upper    ; switch back to uppercase/graphics charset
```

**ASM généré : **

Mode minuscules :
```
    LDA $D018
    ORA #$02      ; set bit 1 → lowercase/uppercase ROM at $1800
    STA $D018
```

Mode majuscules :
```
    LDA $D018
    AND #$FD      ; clear bit 1 → uppercase/graphics ROM at $1000
    STA $D018
```

**Taille : ** 8 octets (LDA abs + ORA/AND imm + STA abs).

**Pourquoi utiliser ORA/AND plutôt qu'une écriture directe ?** `$D018` contrôle également l'emplacement de la RAM écran (bits 7 à 4). Basculer uniquement le bit 1 préserve le reste du registre.

**Flux de travail typique :**

```
    CHARSET lower             ; switch to lowercase charset
    TEXT 0, 0, "hello world"  ; [checkbox: Lowercase charset]
    ...
    CHARSET upper             ; restore default when done
```

Ou en mode expert :
```
.charset lower
.text 0, 0, "hello world", lower
.charset upper
```

En mode Expert, le bloc `.charset` fait désormais également des allers-retours dans le menu déroulant du mode, de sorte que l'aperçu du bloc et la source exportée restent alignés.

> **Remarque : ** La macro CHARSET modifie uniquement le pointeur ROM de caractères VIC. Elle n'appelle pas `$E544` (initialisation du jeu de caractères du noyau). Dans la plupart des cas, cela suffit ; appelez `JSR $E544` en premier uniquement si vous avez besoin que les routines d'impression du noyau prennent en compte la modification.

---

### CHARDEF

Définit un seul caractère personnalisé 8×8 dans un jeu de caractères basé sur la RAM. Émet du code d'exécution en ligne qui copie 8 octets dans `base + index * 8` au moment de l'exécution — pas besoin d'étiquette précédente ni de `ORG`.

| Champ                | Description                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Base de caractères   | Adresse de base du jeu de caractères de la RAM (par défaut `$3800`). Doit être alignée pour que le VIC-II puisse la voir (voir ci-dessous). |
| Index des caractères | Quel emplacement de caractère redéfinir, 0–255. `65` = 'A' dans la disposition de code d'écran par défaut.                                  |
| 8 octets             | Lignes d'image bitmap séparées par des virgules, de haut en bas. Le bit 7 de chaque octet correspond au pixel le plus à gauche.             |

**Syntaxe experte : **
```
.chardef $3800, 65, $18,$3C,$66,$7E,$66,$66,$66,$00
```

**ASM généré (8 × `LDA #b` / `STA cible+n`, 40 octets au total) :**
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

**Adresse cible : ** `$3800 + 65 * 8 = $3A08`. Calculé à la compilation et intégré en dur dans les opérandes STA.

**Taille : ** 40 octets par caractère (8 × 5).

**Flux de travail typique :**
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

**Quand utiliser CHARDEF plutôt que des alternatives : **

| Approche                         | À utiliser lorsque                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **CHARDEF**                      | Vous avez besoin de quelques caractères personnalisés (par exemple, de 1 à 20). Le coût d'exécution est de 40 octets par caractère.   |
| **RAWBYTES @ $3800**             | Vous disposez d'un jeu de caractères entièrement personnalisé (256 caractères). Total de 2 Ko de données, aucune copie à l'exécution. |
| **INCBIN "charset.bin" @ $3800** | Fichier de jeu de caractères externe (généré par l'éditeur de caractères). Option la plus propre.                                     |
| **Caractères Canvas + INCBIN**   | Image bitmap complète de 256 caractères, peinte en une seule image de 128×128 pixels.                                                 |

> Rappel d'alignement : VIC-II attend que la base du jeu de caractères soit un multiple de 0800. Banques valides : 0000, 0800, 1000, 1000, ..., 3800 (dans la banque VIC actuelle de 16 Ko). Les jeux de caractères de la RAM se trouvent généralement à 2000, 2800, 3000 ou 3800.

---

### BOX_HIT

Test de collision de boîtes englobantes alignées sur les axes (AABB) entre deux rectangles décrits par des structures de page zéro de 4 octets. Renvoie le résultat dans l'accumulateur : **A = 1** en cas de chevauchement, **A = 0** sinon. Code assembleur en ligne pur, sans appel de sous-programme.

| Champ                | Description                                                                            |
| -------------------- | -------------------------------------------------------------------------------------- |
| Adresse postale Box1 | Base de page zéro de la structure de 4 octets de la première boîte (par défaut `$FB`). |
| Adresse postale Box2 | Base de page zéro de la structure de 4 octets de la deuxième boîte (par défaut `$F7`). |

**Disposition de la structure** (4 octets par case, coordonnées non signées sur 8 bits) :

| Compenser | Champ  |
| --------- | ------ |
| `+0`      | Gauche |
| `+1`      | Haut   |
| `+2`      | Droite |
| `+3`      | Bas    |

**Syntaxe experte : **
```
.box_hit $FB, $F7
```

**ASM généré (30 octets, entièrement relatif au PC — pas de sous-routine, pas de sauts absolus) :**
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

**Taille : ** 30 octets.

**Flux de travail typique :**

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

**Contraintes:**
- Les deux adresses de page zéro doivent être `≤ $FC` (chaque boîte a besoin de 4 octets consécutifs : `zp`, `zp+1`, `zp+2`, `zp+3`).
- Les coordonnées sont traitées comme des entiers non signés 8 bits (0–255). Pour les coordonnées de sprites signées en dehors de cette plage, normalisez-les avant de les stocker.
- Les deux cases peuvent se chevaucher dans l'espace ZP si nécessaire, mais généralement, on souhaite 8 octets distincts.

Pourquoi ne pas utiliser une sous-routine ? La génération en ligne évite la surcharge JSR/RTS (plus de 14 cycles) et maintient le test actif en cache pour des boucles de jeu rapides. Si vous devez tester de nombreuses paires, placez manuellement votre propre sous-routine JSR box_hit_sub autour d'un bloc BOX_HIT.

Comparaison avec la fonction `box_hit()` d'UB : Ultimate Basic encapsule la même logique 6502 dans une fonction d'exécution qui renvoie une valeur à une variable. En VA, vous placez `BOX_HIT` directement à l'endroit où vous avez besoin du test ; le résultat se trouve dans `A`.

---

### INCBIN

Comme **BLOAD en BASIC** — récupère un fichier binaire externe (`.bin`, `.prg`, `.sid`, `.raw`) et l'intègre directement dans le PRG assemblé à l'adresse que vous spécifiez.

| Champ   | Description                                               |
| ------- | --------------------------------------------------------- |
| Déposer | Sélectionnez un fichier `.bin`, `.prg`, `.sid` ou `.raw`. |
| Adresse | Adresse de chargement cible (par exemple `$C000`)         |

**Syntaxe experte : **
```
.incbin "music.bin", $C000
```

**Commentaire ASM généré : **
```
    ; INCBIN "music.bin" @ $C000 (2048 bytes)
    .byte $01, $02, ...
```

**Taille en code : ** 0 octets (section de données différées). Le binaire est intégré à l’adresse indiquée.

---

### SID

Comme **BLOAD pour la musique** — charge un fichier `.sid` dans votre PRG et lit automatiquement ses adresses Init et Play dans l'en-tête. Appelez Init une fois au démarrage, puis appelez Play depuis votre gestionnaire d'interruption à chaque image.

| Champ                              | Description                                                                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Déposer                            | Sélectionnez un fichier `.sid`.                                                                                                            |
| Adresse personnalisée (facultatif) | Remplacez l'adresse de chargement native du SID (par exemple, `$1000`). Laissez ce champ vide pour utiliser l'adresse de l'en-tête du SID. |

Le bloc affiche :
- **Titre / Auteur** de l'en-tête SID
- **Adresse de chargement** — où les données sont placées en mémoire (adresse effective après toute modification)
- **Adresse d'initialisation** — appelez ceci avec JSR pour initialiser la musique (ajustée en cas de relocalisation si une adresse personnalisée est utilisée)
- **Adresse de lecture ** — appelez ceci avec JSR sur chaque trame dans un gestionnaire d'IRQ (ajusté pour la relocalisation)
- Un badge **(relocalisé)** apparaît lorsqu'une adresse personnalisée déplace les données de leur position d'origine.

**Syntaxe experte : **
```
.sid "Ikari_Warriors.sid"
.sid "Ikari_Warriors.sid", $1000
```

**Commentaire ASM généré : **
```
    ; SID "Ikari_Warriors.sid" @ $1000  Init:$1000  Play:$1006  (4096 bytes)
```

**Taille en code : ** 0 octets en ligne. Le binaire SID est placé à l’adresse spécifiée en tant que bloc différé dans le PRG.

> Important : La plupart des fichiers SID contiennent des adresses absolues internes codées en dur. Elles ne peuvent être déplacées que si l’ensemble du binaire est décalé du même indice. Si un SID comporte des sauts internes vers `$10xx`, il doit rester à `$1000` ; le déplacer vers une autre adresse rompra ces références internes.

> **Utilisation typique :** Placez un bloc ORG avant le bloc SID pour définir son adresse. Appelez Init une fois au démarrage, puis appelez Play à chaque image à partir d'un gestionnaire d'interruption raster.

---

### INCLUDE

Comme la fonction MERGE en BASIC, elle importe un autre fichier et développe ses blocs directement à cet emplacement. Idéal pour les bibliothèques de sous-programmes réutilisables. Les blocs inclus sont en lecture seule dans le projet actuel.

Deux types de fichiers sont pris en charge :
- **Visual Assembler project** (`.json`) — les blocs du projet sont insérés tels quels.
- **Code source assembleur brut** (`.inc`, `.asm`, `.s`) — le fichier est lu comme du texte et analysé de la même manière qu'en mode expert. À chaque compilation, le fichier est relu depuis le disque (source de référence : le fichier lui-même), ce qui vous permet de le modifier avec n'importe quel éditeur externe.

| Champ                              | Description                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Déposer                            | Sélectionnez un projet `.json` ou un code source d'assemblage `.inc`/`.asm`/`.s`.                                                                                                                                                                                                                                                     |
| Adresse de chargement (facultatif) | Si cette option est activée (en hexadécimal, par exemple `C000`), les blocs inclus sont placés à cette adresse ; un bloc ORG`` synthétique est injecté avant eux, remplaçant tout bloc ORG présent dans le fichier inclus. Laissez cette option vide pour que le placement soit contrôlé par les blocs ORG propres au fichier inclus. |

**Syntaxe du mode expert :**
```
.include "library.json"
.include "macros.inc", $1500
.include "sprites.asm"
```

- L'extension de fichier ** est requise en mode expert** — un nom nu comme `.include "macros"` est traité comme `.include "macros.json"`.
- Résolution du chemin : essaie d'abord à côté du fichier de projet (relatif), puis revient au répertoire `samples/` intégré à l'application.

**ASM généré (pas de remplacement d'adresse) :**
```
    ; .include "library.json" — 12 block(s)
    ... (expanded blocks follow)
```

**ASM généré (avec adresse de chargement `C000`):**
```
    ; .include "library.json" @ $C000 — 12 block(s)
    *=$C000
    ... (expanded blocks follow)
```

> Conseil : Utilisez INCLUDE pour créer des bibliothèques de sous-programmes réutilisables et partageables entre projets. Les fichiers .inc, .asm et .s sont recommandés pour modifier la bibliothèque dans un éditeur de texte brut ou la partager avec d'autres assembleurs 6502 ; le fichier .json est préférable lorsque la bibliothèque est créée directement dans Visual Assembler. Spécifiez une adresse de chargement si la bibliothèque ne possède pas de répertoire ORG ou si vous souhaitez modifier son emplacement par défaut.

---

### TABLE

Comme **DIM à une adresse spécifique** — nomme une table de consultation et indique son emplacement en mémoire. Placez des blocs BYTE, WORD ou FILL après pour définir le contenu de la table.

| Champ   | Description                                                        |
| ------- | ------------------------------------------------------------------ |
| Nom     | Identifiant de l'étiquette du tableau (par exemple, `color_table`) |
| Adresse | Adresse fixe où commence le tableau (par exemple `$C000`)          |

**Syntaxe experte : **
```
.table color_table, $C000
```

**ASM généré : **
```
color_table:
```

Le compteur de programme saute à l'adresse spécifiée. Placez des blocs BYTE/WORD/FILL après TABLE pour remplir le contenu.

**Taille : ** 0 octets.

---

### ORG

Définit l'emplacement en mémoire du programme (ou d'une partie de celui-ci), un peu comme choisir une adresse de départ avant de saisir du code machine. Chaque programme nécessite au moins une instruction ORG. L'adresse de départ standard pour le BASIC C64 est `$0801`.

| Champ     | Description                                                                   |
| --------- | ----------------------------------------------------------------------------- |
| Adresse   | La nouvelle adresse d'origine (par exemple `0801` en HEX, ou `2049` en DEC)   |
| HEX / DEC | Basculer l'affichage de la saisie d'adresse entre l'hexadécimal et le décimal |

**Syntaxe experte : **
```
* = $C000
```

**ASM généré : **
```
* = $C000
```

**Taille : ** 0 octets. Le bloc ORG lui-même ne génère aucun code machine.

Chaque bloc ORG marque le début d'une nouvelle section. Les blocs suivants sont assemblés à partir de cette adresse. Lors de l'exportation du PRG, toutes les sections sont fusionnées en un seul fichier ; les espaces entre les sections sont remplis de zéros.

**Exemple — code à `$0801`, table de données à `$C000`:**
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

> Conseil : Chaque programme doit commencer par un bloc ORG. L’adresse de départ typique d’un programme C64 BASIC chargeable est $0801 (2049 en décimal). Lorsque le stub système BASIC est activé, l’assembleur ajoute une courte ligne BASIC à $0801 et votre code commence à $080D.

---

### LOOP / NEXT

Comme **`FOR X=N TO 1 STEP -1 : ... : NEXT X`** en BASIC — effectue un décompte de N à 1 en utilisant le registre X ou Y. Ajoutez un bloc LOOP, insérez vos instructions entre celui-ci et NEXT, et la boucle s'exécutera automatiquement le nombre de fois nécessaire.

#### LOOP

| Champ     | Description                                                                      |
| --------- | -------------------------------------------------------------------------------- |
| Registre  | `X` ou `Y` — le registre compteur                                                |
| Compter   | Nombre d'itérations de la boucle (hexadécimal ou décimal, par exemple `0A` = 10) |
| Étiquette | Étiquette de boucle générée automatiquement (par exemple, `boucle0`)             |

**Syntaxe experte : **
```
.loop X, 10, loop0
```

**ASM généré : **
```
    LDX #$0A
loop0:
```

**Taille : ** 2 octets (code d’opération LD + opérande immédiat).

#### NEXT

| Champ     | Description                                      |
| --------- | ------------------------------------------------ |
| Registre  | Correspondance automatique avec le registre LOOP |
| Étiquette | Lié automatiquement à l'étiquette LOOP           |

**Syntaxe experte : **
```
.next loop0
```

**ASM généré : **
```
    DEX
    BNE loop0
```

**Taille : ** 3 octets (DEX + BNE + décalage de branche).

**Exemple — effacer 10 cellules d'écran : **
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

Comme **`FOR X=0 TO N-1 : ... : NEXT X`** en BASIC — compte *up* à partir de 0. Idéal lorsque vous avez besoin d'un index avant, par exemple pour parcourir une chaîne ou un tableau.

#### FOR

| Champ     | Description                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------ |
| Registre  | `X` ou `Y` — le registre compteur                                                                |
| Compter   | Limite de boucle (hexadécimal ou décimal, par exemple `$12` = 18). X/Y varie de 0 à la limite-1. |
| Étiquette | Étiquette de boucle générée automatiquement (par exemple, `pour0`)                               |

**Syntaxe experte : **
```
.for X, $12, for0
```

**ASM généré : **
```
    LDX #$00
for0:
```

**Taille : ** 2 octets (code d’opération LD_ + `#$00`).

#### ENDF

| Champ     | Description                                     |
| --------- | ----------------------------------------------- |
| Registre  | Correspondance automatique avec le registre FOR |
| Étiquette | Automatically linked to the FOR label           |
| Compter   | Copie automatique à partir du FOR apparié       |

**Syntaxe experte : **
```
.endf for0
```

**ASM généré : **
```
    INX
    CPX #$12
    BNE for0
```

**Taille : ** 5 octets (IN_ + CP_ #imm + décalage BNE).

**Exemple — imprimer une chaîne terminée par un caractère nul : **
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

> **LOOP vs FOR:** LOOP counts down (N→1) — good for delays, fills, pixel loops. FOR counts up (0→N) — good for string/array access. Both can use X or Y.

---

### PUSH / PULL

Comme ** la sauvegarde des variables avant un GOSUB et leur restauration après ** — mais utilise la pile matérielle du 6502. Si une sous-routine utilise A, X ou Y, encapsulez-la dans des instructions PUSH et PULL afin de préserver les registres du code appelant.

#### PUSH

Empile un ou plusieurs registres. L'ordre est toujours A → X → Y (du plus interne au plus externe).

| Champ     | Description                                                |
| --------- | ---------------------------------------------------------- |
| Registres | Toute combinaison : `A`, `X`, `Y`, `AX`, `AY`, `XY`, `AXY` |

**Syntaxe experte : **
```
.push AXY
```

**ASM généré (exemple : `AX`):**
```
    PHA
    TXA
    PHA
```

**Taille : ** 1 octet pour A (`PHA`), 2 octets pour X ou Y (transfert + push).

#### PULL

Restaure les registres de la pile dans l'ordre inverse **** (Y → X → A).

| Champ     | Description                                                     |
| --------- | --------------------------------------------------------------- |
| Registres | Identique à PUSH — doit correspondre au bloc PUSH correspondant |

**Syntaxe experte : **
```
.pull AXY
```

**ASM généré (exemple : `AX`):**
```
    PLA
    TAX
    PLA
```

> **Règle : ** Les commandes PUSH et PULL doivent toujours utiliser le **même jeu de registres**. `PUSH AX` → `PULL AX` (restaure en interne dans l’ordre inverse : X d’abord, puis A).

---

### END / RTS alias

Comme **RTS avec un nom de macro plus convivial** — `.end` émet un seul octet `RTS` et se comporte comme un terminateur de sous-routine court en mode expert.

**Syntaxe experte : **
```
.end
```

**ASM généré : **
```
    RTS
```

**Taille : ** 1 octet.

Utilisez ceci lorsque vous souhaitez un marqueur de fin de sous-routine qui ressemble davantage à une macro qu'à une instruction brute.

---

### MACRO / ENDM / INVOKE

Comme **une GOSUB nommée avec des paramètres** — définissez un bloc de code réutilisable une seule fois (MACRO…ENDM), puis appelez-le n'importe où avec INVOKE. Transmettez des valeurs d'arguments différentes à chaque fois au lieu de copier-coller des blocs.

#### MACRO (definition start)

| Champ      | Description                                                                                         |
| ---------- | --------------------------------------------------------------------------------------------------- |
| Nom        | Identifiant de la macro (par exemple, `setColor`)                                                   |
| Paramètres | Noms de paramètres optionnels séparés par des virgules (par exemple `couleur` ou `couleur, nombre`) |

Marque le début de la définition d'une macro. Les blocs entre MACRO et ENDM constituent le corps de la macro ; ils ne génèrent aucun code à l'endroit où se trouve la définition. Utilisez {paramName} comme espace réservé pour les arguments.

**ASM généré : **
```
; .MACRO setColor (color)
    ... (body blocks)
; .ENDM
```

**Syntaxe du mode expert : **
```
.macro setColor color
    LDA {color}
    STA $D020
.endm
```

#### ENDM (definition end)

Ferme la définition de macro actuelle. Aucun champ.

#### INVOKE

Appelle une macro définie à cette position et remplace les valeurs d'argument fournies par les espaces réservés `{paramName}` dans le corps.

| Champ           | Description                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Nom de la macro | Sélectionnez une macro définie dans la liste déroulante.                                                                  |
| Arguments       | Valeurs des arguments séparées par des virgules correspondant à la liste des paramètres de la macro (par exemple, `#$07`) |

**ASM généré : **
```
; .invoke setColor(#$07)
    LDA #$07
    STA $D020
```

**Syntaxe du mode expert : **
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

Le corps de la macro est développé en ligne, `{paramName}` étant remplacé par les arguments réels. La forme séparée par des espaces (`.invoke setColor #$07`) est également acceptée.

**Types d'arguments :**
- **Numérique** : `#$07`, `$10`, `255` — valeurs hexadécimales ou décimales
- **Chaînes de texte** : `« Bonjour, monde ! »` — chaînes entre guillemets ; les virgules à l’intérieur des guillemets sont traitées comme faisant partie du texte, et non comme des séparateurs d’arguments
- **Mixte** : `#$07, "bonjour", $20` — toute combinaison

> **Tip:** Define macros at the top (or bottom) of your program, then INVOKE them wherever needed. Macros can be invoked multiple times with different arguments.

---

### REGION / ENDREGION

Regroupement purement visuel — zéro octet, aucun effet sur le code assemblé. Comme replier une section d'un programme BASIC dans un bloc nommé pour pouvoir la réduire et se concentrer sur autre chose.

| Champ            | Description                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------- |
| Nom de la région | Étiquette en texte libre pour la section (par exemple, `init`, `game_loop`, `sprite_setup`) |

**Syntaxe experte : **
```
.region init
    ; blocks...
.endregion
```

**Contrôles sur l'en-tête du bloc REGION (toujours visibles) :**
- **▸ / ▾ bascule** — réduit ou agrandit toute la région. Lorsqu'elle est réduite, tous les blocs entre REGION et ENDREGION sont cachés.
- **↕ Développer tout** — décompresse chaque bloc individuellement replié à l'intérieur de la région et développe la région elle-même si nécessaire.
- **⦵ Sélectionner dans ASM** — met en surbrillance toute la plage de codes de la région dans la vue ASM (de ` ; ===[ nom ]===` à ` ; ===[/ nom]===`) et permet de faire défiler jusqu'à cette plage. Bascule automatiquement vers l'onglet ASM s'il n'est pas déjà visible.
- **⧉ Copier la région** — copie le bloc REGION, tous ses blocs enfants et l'ENDREGION correspondant dans le presse-papiers. Un clignotement ✓ confirme la copie.
- **⎘ Paste region** — inserts the copied region as a new region immediately after the current region's ENDREGION and scrolls to it. The button is dimmed until a region has been copied.

**ASM généré : **
```
; region init
    SEI
    LDA #$00
    STA $D020
; endregion init
```

**Taille : ** 0 octets pour REGION et ENDREGION.

**Exemple de flux de travail :**
1. Ajoutez un bloc `REGION`, définissez le nom de la région sur `init`.
2. Ajoutez vos instructions d'initialisation ci-dessous.
3. Ajoutez un bloc `ENDREGION` pour fermer la section.
4. Click ▸ on the REGION to collapse the whole section into one line while working on other parts of the program.

> **Remarque : **Les régions peuvent être **imbriquées** les unes dans les autres. Chaque ENDREGION ferme la REGION ouverte la plus proche. Aucun effet sur le résultat assemblé.

---

### DEFINE / IF / ELSE / ENDIF

Comme un interrupteur, l'assembleur lit : `DEFINE DEBUG` active un symbole, puis tout bloc `IF DEBUG` est inclus et sa branche `ELSE` est ignorée. Supprimez le bloc `DEFINE` et le bloc `IF` disparaît du résultat. Il n'est pas nécessaire de supprimer le code pour les versions de production.

#### DEFINE

| Champ   | Description                                                                                           |
| ------- | ----------------------------------------------------------------------------------------------------- |
| Symbole | Un ou plusieurs identifiants séparés par des virgules à activer (par exemple `DEBUG` ou `DEBUG, PAL`) |

**Syntaxe experte : **
```
.define DEBUG, PAL
```

**ASM généré : **
```
; .DEFINE DEBUG
; .DEFINE DEBUG, PAL
```

Un bloc `DEFINE` permet d'activer plusieurs symboles simultanément (séparés par des virgules). Placez les blocs DEFINE en haut de votre programme. La suppression du bloc désactive instantanément tous les symboles qu'il contient.

#### IF

| Champ     | Description                                                                    |
| --------- | ------------------------------------------------------------------------------ |
| Condition | Identifiant à tester (doit correspondre à un symbole `DEFINE` pour être actif) |

**Syntaxe experte : **
```
.if DEBUG
```

**ASM généré : **
```
; .IF DEBUG
```

Les blocs compris entre `IF` et `ENDIF` (ou `ELSE`) sont inclus ou ignorés selon que le symbole de condition possède ou non une directive `DEFINE` correspondante dans le programme. Les blocs ignorés apparaissent sous forme de commentaires `; [IF skipped] …` et génèrent **zéro octet**.

#### ELSE

Aucun champ. Marque la branche alternative — assemblée lorsque la condition `IF` n'est *pas* active.

**Syntaxe experte : **
```
.else
```

**ASM généré : **
```
; .ELSE
```

#### ENDIF

Aucun champ. Ferme le bloc conditionnel.

**Syntaxe experte : **
```
.endif
```

**ASM généré : **
```
; .ENDIF
```

**Taille : ** 0 octet pour les quatre blocs. Seul le contenu *entre* eux est pris en compte.

**Exemple — flash de bordure de débogage, la version finale l'ignore : **
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

**Exemple — plusieurs symboles dans un seul bloc DEFINE : **
```
; .DEFINE DEBUG, PAL

; .IF PAL
    LDA #$xx        ; PAL timing constant
; .ELSE
    LDA #$xx        ; NTSC timing constant
; .ENDIF
```

Les blocs `IF` imbriqués sont pris en charge. Si un bloc externe est ignoré, les blocs internes le sont également.

> **Remarque :** Il s’agit d’une gestion des conditions à la compilation. Pour une syntaxe simplifiée de comparaison/branchement à l’exécution, voir **IF / ELSE / ENDIF à l’exécution** ci-dessous.

### .ASSERT

*(Nouveau dans la version 2.3.9.)* Un **contrôle de cohérence à la compilation**. `.assert` évalue une expression lors de l'assemblage ; si elle est fausse (`0`), la compilation s'arrête et une erreur claire incluant la valeur est affichée. Si elle est vraie (non nulle), aucun message n'est émis.

| Champ      | Description                                                                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Expression | Toute expression assembleur : étiquettes, `CONST`, `*` (compteur de programme), arithmétique et comparaisons (`&lt;`, `&lt;=`, `&gt;`, `&gt;=`, `==`, `!=`) |
| Message    | Texte facultatif ajouté à l'erreur d'échec                                                                                                                  |

**Syntaxe experte : **
```
.assert spriteData < $C000
.assert * < $A000
.assert end - start <= 256, "sprite table overflowed one page"
```

**Comportement : **

- **Taille : ** 0 octets.
- Une assertion fausse interrompt l'assemblage : `` `.assert end - start &lt;= 256` est faux (valeur : 0). La table des sprites a dépassé d'une page ``.
- Une assertion qui ne peut pas être évaluée (étiquette non définie, etc.) échoue également, avec *"ne peut pas être évaluée au moment de l'assemblage"*.
- Les comparaisons donnent `1` / `0`; placez `.assert` n'importe où dans le flux du programme — il est vérifié à l'adresse sur laquelle il se trouve, donc `.assert * &lt; $D000` teste la position de sortie actuelle.

**Exemple — protéger un bloc sprite contre un changement de page : **
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

Comme une variable nommée qui ne change jamais — SCREEN = $0400. Utilisez le nom plutôt que de saisir des adresses brutes partout ; le code sera ainsi plus facile à lire et à modifier ultérieurement.

| Champ  | Description                                                                                                                                |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Nom    | Identifiant de la constante (par exemple, `SCREEN`)                                                                                        |
| Valeur | Valeur numérique dans la base sélectionnée (par exemple `0400` en HEX = adresse $0400), ou une expression relative au PC (voir ci-dessous) |
| Format | HEX ou DEC — détermine la façon dont la valeur est saisie et affichée                                                                      |

**Syntaxe experte : **
```
.const SCREEN = $0400
.const FRAMES_1S = 60
```

**ASM généré : **
```
; .CONST SCREEN = $0400
```

Le nom de la constante apparaît dans la liste déroulante du sélecteur d'étiquettes **** sur les blocs d'instructions — il suffit de cliquer dessus pour l'insérer.

**Expressions relatives au PC (`*+N` / `*-N`):**

Le champ de valeur accepte également `*+N` ou `*-N`, où `*` correspond à l'adresse de compilation du bloc CONST. Ceci permet de créer un alias nommé pour un octet au sein d'une instruction voisine — le modèle classique d'automodification.

```
CONST op = *+1      ; op → address of the immediate operand of the next LDA
LDA #$00            ; $00 will be patched at runtime
...
STA op              ; overwrites the #$00 byte → LDA reads the new value next time
```

La CONST émet 0 octets ; l'étiquette se résout au moment de la compilation à `adresse_actuelle + 1`.

**Expressions arithmétiques :**

Le champ de valeur accepte les opérations arithmétiques générales, y compris les références à des noms CONST précédemment définis, des littéraux hexadécimaux/binaires et des fonctions mathématiques intégrées :

```
.const SCREEN      = $0400
.const SCREEN_END  = SCREEN + 40*25   ; 1000 bytes later
.const COLOR_RAM   = $D800
.const MID_X       = 160
.const SIN_TABLE   = round(sin(PI/8) * 127)   ; pre-computed sine value
```

**Fonctions intégrées : ** `sin() `, `cos() `, `round() `, `max(a,b) `, `min(a,b) `, `abs() `, constante `PI `

Opérateurs : `+ - * /` Littéraux : `$FF` (hexadécimal), `%10110000` (binaire) Octet de poids faible/de poids fort : `lo(expr)`, `hi(expr)`

**Taille : ** 0 octets.

---

### VAR

Comme **CONST, mais à allocation automatique** — `VAR` réserve de l'espace mémoire de page zéro pour une étiquette sans que vous ayez à saisir l'adresse. Utilisez-le pour les compteurs, les pointeurs et les états éphémères qui doivent être stockés dans la page zéro.

| Champ               | Description                                             |
| ------------------- | ------------------------------------------------------- |
| Nom                 | Nom/étiquette de la variable                            |
| Taille (facultatif) | Nombre d'octets à réserver. Omettre pour un seul octet. |

**Syntaxe experte : **
```
.var counter
.var timer, 2
.var lives
```

**Exemple pratique :**
```
.region Vars
.var counter
.var timer, 2
.endregion

LDA #$00
STA counter
```

**ASM généré : **
```
; .var counter
```

**Taille : ** 1 octet par défaut, ou `N` octets lorsque la taille est spécifiée.

L'allocateur parcourt un curseur de page zéro configurable (de `$02` à `$FE`) et attribue le prochain emplacement libre. Si la région demandée chevauche une étiquette déjà utilisée, le compilateur émet un avertissement.

---

### Runtime IF / ELSE / ENDIF

À l'instar d'un véritable modèle de branchement, cette version fonctionne à l'exécution, et non à la compilation. Elle compare A, X ou Y à une valeur immédiate et génère la séquence de branchement CMP / CPX / CPY appropriée.

| Champ     | Description                                  |
| --------- | -------------------------------------------- |
| Registre  | `A`, `X` ou `Y`                              |
| Opérateur | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Valeur    | Valeur immédiate au format HEX ou DEC        |

**Syntaxe experte : **
```
.if A == #$10
    LDA #$07
.else
    LDA #$0F
.endif
```

**Taille : ** Dépend des branches choisies et du formulaire de comparaison.

La comparaison est non signée par défaut. Pour `&lt;=` et `&gt;`, la macro s'étend à la chaîne de branchement équivalente la plus courte pour le registre sélectionné.

---

### WHILE / ENDW

Comme **une boucle d'exécution avec un test au sommet** — le corps s'exécute tant que la condition reste vraie.

| Champ     | Description                                  |
| --------- | -------------------------------------------- |
| Registre  | `A`, `X` ou `Y`                              |
| Opérateur | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Valeur    | Valeur immédiate au format HEX ou DEC        |

**Syntaxe experte : **
```
.while A != #$00
    JSR getchar
.endw
```

**Taille : ** Dépend du corps de la boucle et de la forme de comparaison.

Utilisez `WHILE` lorsque la boucle risque de se terminer avant la fin de la première itération. Il s'agit de l'équivalent, en termes d'exécution, de l'utilitaire `LOOP / NEXT` basé sur le comptage.

---

### REPEAT / UNTIL

Comme **une boucle d'exécution avec un test à la fin** — le corps s'exécute toujours au moins une fois, puis la condition décide s'il faut s'arrêter.

| Champ     | Description                                  |
| --------- | -------------------------------------------- |
| Registre  | `A`, `X` ou `Y`                              |
| Opérateur | `==`, `!=`, `&lt;`, `&lt;=`, `&gt;`, `&gt;=` |
| Valeur    | Valeur immédiate au format HEX ou DEC        |

**Syntaxe experte : **
```
.repeat
    JSR getchar
.until A == #$00
```

**Taille : ** Dépend du corps de la boucle et de la forme de comparaison.

Utilisez `REPEAT / UNTIL` lorsque vous souhaitez que le corps s'exécute au moins une fois avant la vérification de sortie.

---

### MEMCPY / MEMSET

Comme les petites routines de mémoire que vous utilisez constamment, ** — `MEMCPY` copie un bloc contigu, `MEMSET` remplit une plage avec un octet.

| Macro    | Champs                  |
| -------- | ----------------------- |
| `MEMCPY` | `src`, `dst`, `size`    |
| `MEMSET` | `addr`, `value`, `size` |

**Syntaxe experte : **
```
.memcpy src=$C000, dst=$D000, size=$0100
.memset addr=$0400, value=#$20, size=$03E8
```

**ASM généré : ** boucles de copie/remplissage en ligne, choisies pour correspondre à la taille demandée.

Les données jusqu'à 256 octets utilisent une boucle courte de 8 bits. Au-delà, un compteur 16 bits est automatiquement utilisé.

---

### PRINT / PRINT_CHAR / PRINT_HEX / CLEAR_SCREEN / WAIT_KEY / DELAY / SET_BORDER / SET_BG

#### PRINT

Comme la sortie PETSCII **sans le code répétitif ** — affiche une chaîne de caractères via `CHROUT ` avec la même gestion des majuscules et minuscules que le bloc PETSCII. La case à cocher « minuscules » est partagée avec l’encodeur PETSCII, le chemin du texte reste donc cohérent.

**Syntaxe experte : **
```
.print "HELLO"
.print "hello", lower
```

#### PRINT_CHAR

Imprime un octet PETSCII sous forme de code numérique et l'envoie via `CHROUT`. La valeur peut également être une constante nommée ou une étiquette qui est résolue en un octet lors de l'assemblage, aussi bien en mode Bloc qu'en mode Expert.

**Syntaxe experte : **
```
.print_char 65
.print_char $41
.print_char color
```

#### PRINT_HEX

Imprime une valeur 8 bits sous forme de texte hexadécimal via le chemin de sortie normal du KERNAL.

**Syntaxe experte : **
```
.print_hex A
```

#### CLEAR_SCREEN

Raccourci pour le code de contrôle standard de l'écran transparent du C64.

**Syntaxe experte : **
```
.clear_screen
```

#### WAIT_KEY

Attend qu'une touche soit pressée, vous n'avez donc pas à parcourir manuellement la boucle `GETIN` à chaque fois.

**Syntaxe experte : **
```
.wait_key
```

#### DELAY

Attend le nombre d'images demandé via une routine auxiliaire partagée. Utilisez cette fonction pour les pauses courtes et les intervalles de temps lorsqu'une boucle personnalisée complète serait excessive. Le nombre d'images peut être un nombre brut ou une constante nommée, et `.wait` est simplement un alias de `.delay`.

**Syntaxe experte : **
```
.delay 29
.wait 29
.delay frames=FRAMES_1S
```

En mode Bloc, le champ de délai utilise un sélecteur de constante compact lorsqu'une valeur symbolique est disponible, vous n'avez donc pas besoin de saisir le nom manuellement à chaque fois.

#### SET_BORDER / SET_BG

Fonctions d'encapsulation simplifiées pour les registres de couleur VIC-II. La valeur de couleur peut être un nombre brut ou une constante nommée comprise entre 0 et 15. Les modes Bloc et Expert acceptent tous deux les noms de constantes symboliques.

**Syntaxe experte : **
```
.set_border 6
.set_bg 0
.set_border color
.set_bg color
```

**Taille :** Chaque auxiliaire se développe en une minuscule séquence d’écriture de registre ou en un court appel KERNAL.

En mode Bloc, ces champs utilisent également le sélecteur de constantes, de sorte que la valeur symbolique reste visible au lieu d'être remplacée par un nombre brut.

---

### IRQ_SETUP

Configure un gestionnaire d'IRQ raster en une seule étape. La macro écrit le vecteur d'IRQ, active les IRQ raster, définit la ligne, désactive les sources d'IRQ CIA communes et revient à l'exécution normale avec `CLI`.

| Champ        | Description                                                   |
| ------------ | ------------------------------------------------------------- |
| Gestionnaire | Étiquette de routine IRQ (par exemple `my_irq`)               |
| Raster       | Ligne raster en hexadécimal ou en décimal (par exemple `$FA`) |

**Syntaxe experte : **
```
.irq_setup handler=my_irq, raster=$FA
```

**Taille : ** Une petite séquence de configuration ; la longueur exacte dépend de la ligne raster sélectionnée.

Utilisez ceci lorsque vous souhaitez le code standard commun « SEI / gestionnaire d'installation / activer IRQ / CLI » sans le disperser dans tout le programme.

---

### RAND

Comme **un minuscule PRNG intégré** — renvoie une valeur pseudo-aléatoire de 8 bits à partir d'une graine de page zéro compacte.

| Champ  | Description                                                                   |
| ------ | ----------------------------------------------------------------------------- |
| Graine | Octet ou étiquette d'initialisation de page zéro optionnel (par défaut `$FB`) |

**Syntaxe experte : **
```
.rand
```

**Taille : ** Quelques octets, en fonction du chemin d’implémentation choisi.

Ce générateur est conçu pour le gameplay, la variation des effets et la production rapide de données de test. Il est volontairement simple plutôt que sophistiqué sur le plan cryptographique.

---

<a id="sprite_init"></a>
### SPRITE_INIT

Configure un sprite VIC-II en un seul bloc : au lieu d’écrire environ six instructions POKE en BASIC, il suffit de remplir les champs. Définit le pointeur de données du sprite, l’active, active éventuellement le mode multicolore et définit sa couleur.

| Champ           | Description                                                                              |
| --------------- | ---------------------------------------------------------------------------------------- |
| Sprite #        | Sprite numéro 0 à 7                                                                      |
| Couleur         | Indice de couleur 0–15 (palette C64)                                                     |
| page de données | Adresse des données Sprite / 64 (par exemple `$21` si les données se trouvent à `$0840`) |
| Multicolore     | Active ou désactive le bit multicolore du sprite (`$D01C`)                               |

**Syntaxe experte : **
```
.sprite_init 0, 7, $21
.sprite_init 0, 7, $21, multicolor
.sprite_init 0, 7, $21, mono
```

**ASM généré : **
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

**Taille : ** 26 octets.

> **Page de données du sprite : ** `adresse_données ÷ 64 `. Avec le stub BASIC SYS par défaut, `ALIGN 64 ` après `JMP main ` place les données du sprite à `$0840 ` → page = `$21 `.

---

<a id="sprite_pos"></a>
### SPRITE_POS

Comme **`POKE 53248, x : POKE 53249, y`** en BASIC — définit la position de départ d'un sprite. Les coordonnées sont intégrées lors de l'assemblage, et les champs acceptent des constantes en mode Bloc ; pour l'animation, utilisez `INC`/`DEC` directement sur le registre du sprite.

| Champ    | Description                |
| -------- | -------------------------- |
| Sprite # | Sprite numéro 0 à 7        |
| X        | Position horizontale 0–319 |
| Y        | Position verticale 0–255   |

**Syntaxe experte : **
```
.sprite_pos 0, 152, 100
```

**ASM généré (exemple : sprite 0, X=152, Y=100) :**
```
    LDA #$98        ; X low byte
    STA $D000       ; sprite 0 X register
    LDA $D010
    AND #$FE        ; clear X MSB for sprite 0 (X ≤ 255)
    STA $D010
    LDA #$64        ; Y = 100
    STA $D001       ; sprite 0 Y register
```

Pour X > 255, la macro définit le bit correspondant dans `$D010` au lieu de l'effacer.

**Taille : ** 18 octets.

> **Remarque : ** `SPRITE_POS` intègre les coordonnées X/Y dans le code (`LDA #$xx`). Pour animer un sprite à l’exécution, utilisez `INC $D000` / `DEC $D000` — voir l’exemple `sprite-macro-demo`.

---

<a id="wait_raster"></a>
### WAIT_RASTER

Attend que le faisceau d'électrons du VIC-II atteigne une ligne de balayage spécifique, comme pour la synchronisation avec une image TV. Placez ce programme en début de boucle de jeu pour éviter les déchirures d'image. Aucun JSR ni étiquette requis.

| Champ        | Description                                                      |
| ------------ | ---------------------------------------------------------------- |
| Ligne raster | Ligne raster cible en hexadécimal (par exemple `FF` = ligne 255) |

**Syntaxe experte : **
```
.wait_raster $FF
```

**ASM généré : **
```
wait:
    LDA $D012       ; current raster line
    CMP #$FF        ; target line
    BNE wait        ; loop back (-7 bytes)
```

**Taille : ** 7 octets (le décalage `BNE` `$F9` = −7 pointe toujours vers le `LDA`).

> **Conseil :** Placez `WAIT_RASTER` en haut de votre boucle de jeu pour synchroniser avec l’affichage et éviter le déchirement des sprites.

---

### JOYSTICK

Comme lire **`PEEK($DC00)`** puis modifier la position du sprite — mais en une seule opération. Lit un port joystick CIA et ajuste les registres X/Y d'un sprite en conséquence. Entièrement intégré, sans JSR.

| Champ    | Description                                                                |
| -------- | -------------------------------------------------------------------------- |
| Port     | `1` = port 1 (`$DC01`) ou `2` = port 2 (`$DC00`)                           |
| Sprite # | Sprite numéro 0–7 (contrôle quelle paire de registres X/Y est mise à jour) |

**Syntaxe experte : **
```
.joystick 2, 0
```

**ASM généré (port 2, sprite 0) :**
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

**Tableau des bits du joystick (actif-BAS — bit = 0 signifie enfoncé) :**

| Peu | Direction   | registre de la CIA              |
| --- | ----------- | ------------------------------- |
| 0   | En haut     | $DC00 (port 2) / $DC01 (port 1) |
| 1   | Vers le bas |                                 |
| 2   | Gauche      |                                 |
| 3   | Droite      |                                 |
| 4   | Feu         | (non géré par cette macro)      |

**Taille : ** 27 octets. Le décalage `BCS` est toujours `+3` (ignore l’instruction `DEC`/`INC abs` de 3 octets suivante).

> **Utilisation typique :** Placer à l’intérieur d’une étiquette `gameloop` avec `WAIT_RASTER` en premier :
> ```
> gameloop:
>     WAIT_RASTER ($FF)
>     JOYSTICK (port=2, sprite=0)
>     JMP gameloop
> ```

---

<a id="mouse"></a>
### MOUSE

Interprète un signal de souris proportionnelle Commodore 1351 et déplace un sprite. Entièrement intégré (X71X) — aucun JSR ni étiquette requis. La macro sélectionne le port CIA, attend la stabilisation des entrées de la palette SID, puis décode le déplacement delta à l'aide du modèle de pilote standard du 1351 et l'applique aux registres du sprite.

| Champ      | Description                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------- |
| Port       | `1` = CIA `$DC00` bits `7:6` = `%01`; `2` = `%10`                                                  |
| Sprite #   | Sprite numéro 0 à 7                                                                                |
| Octet ZP X | Adresse de la page zéro (hexadécimal) pour stocker l'échantillon POTX précédent (par exemple `FD`) |
| Octet ZP Y | Adresse de la page zéro (hexadécimal) pour stocker l'échantillon POTY précédent (par exemple `FE`) |

**Forme ASM générée (port 1, sprite 0, ZP `$FD`/`$FE`):**

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

**Taille : ** 142 octets.

**Syntaxe du mode expert : **
```
.mouse port, spriteNum, zpX, zpY
; example:
.mouse 2, 0, FD, FE
```

> **Important :** Avant le premier appel, initialisez les octets de la page zéro avec les valeurs POTX/POTY actuelles pour éviter un saut sur la première trame :
> ```
>     ; port 1: LDA $DC00 : AND #$3F : ORA #$40 : STA $DC00
>     ; port 2: LDA $DC00 : AND #$3F : ORA #$80 : STA $DC00
>     LDA $D419 : LSR A : AND #$3F : STA $FD
>     LDA $D41A : LSR A : AND #$3F : STA $FE
> ```

> **Conseil :** Interrogez la souris une fois par image — placez `WAIT_RASTER` dans la boucle de jeu avant `MOUSE`.

---

<a id="sprite_col"></a>
### SPRITE_COL

Comme **`PEEK($D01E)`** en BASIC — vérifie les registres de collision matériels du VIC-II et indique si un sprite a heurté un autre sprite ou le fond. Fonction entièrement intégrée, sans JSR.

| Champ             | Description                                                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Sprite #          | Sprite numéro 0–7 (quel sprite vérifier)                                                                                                      |
| Type de collision | `Sprite-Sprite ($D01E)` — collision avec un autre sprite ; `Sprite-Arrière-plan ($D01F)` — collision avec un élément graphique d'arrière-plan |

**Syntaxe experte : **
```
.sprite_col 0, sprite
.sprite_col 0, background
```

**ASM généré (sprite 0, sprite–sprite):**
```
    LDA $D01E       ; read sprite-sprite collision register (clears it!)
    AND #$01        ; isolate bit 0 (sprite 0)
                    ; A ≠ 0 → collision occurred
```

**Taille : ** 5 octets.

> **Important : ** La lecture de `$D01E`/`$D01F` ** efface le registre **. Lisez-le une fois par image et agissez immédiatement sur le résultat avec `BEQ`/`BNE`.

**Utilisation typique :**
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

> **Voir aussi :** `collision-demo` exemple — boule verte (sprite n° 0) contre croix rouge (sprite n° 1).

---

### LOADFILE

Comme **`LOAD "fichier",8`** en BASIC, cette commande charge un fichier depuis une disquette D64 à l'exécution, en utilisant la routine KERNAL LOAD. Utilisez-la pour charger des données, de la musique ou du code supplémentaire depuis le disque pendant l'exécution de votre programme.

| Champ                                | Description                                                                                                                                                                                                                                                    |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nom de fichier                       | Nom du fichier sur le disque (16 caractères maximum, majuscules automatiques ; les caractères `,`, `"`, `/`, `\`, `:`, `*`, `?`, `&lt;`, `&gt;`, `|` sont filtrés)                                                                                             |
| Appareil                             | Numéro de périphérique 8–30 (par défaut `8`)                                                                                                                                                                                                                   |
| Adresse de remplacement (facultatif) | Adresse de chargement hexadécimale (par exemple, `C000`). Si cette option est définie, le fichier est chargé à cette adresse (`sec=0`, l'en-tête PRG étant ignoré). Laissez ce champ vide pour utiliser l'en-tête PRG de 2 octets propre au fichier (`sec=1`). |
| Étiquette d'erreur (facultatif)      | Si cette option est activée, une instruction `BCS` est générée après JSR LOAD. Si le KERNAL renvoie une retenue (erreur), l'exécution saute à cette étiquette.                                                                                                 |

**Syntaxe experte : **
```
.loadfile "DEMO-COLORS", 8
.loadfile "DEMO-COLORS", 8, $C000
.loadfile "DEMO-COLORS", 8, $C000, error_label
```

**Structure du code généré : **
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

**Taille : ** `3 + longueur_nom_de_fichier + 9 (SETNAM) + 9 (SETLFS) + (4 si remplacement) + 5 (LOAD) + (2 si étiquette d'erreur) ` octets. Minimum 27 octets.

> Important : Le nom de fichier est stocké directement dans le code machine juste après un JMP skip_filename. Le nom de fichier sur le disque doit être en PETSCII majuscules, ce qui correspond aux lettres majuscules ASCII (A à Z). La macro applique cette contrainte automatiquement.

> **Utilisez toujours une étiquette d'erreur** pour les programmes de production — si le fichier n'est pas trouvé, KERNAL définit l'indicateur de retenue et l'exécution passe à la suite.

> **Voir aussi :** `loadfile-demo` exemple — démontre le chargement de `DEMO-COLORS.PRG` à partir d'un D64 avec une branche d'erreur BCS et un écran d'erreur visuel.

---

### EXODECRUNCH

Décompression Exomizer en cours de programme ****. Utilisez cette macro juste après un `LOADFILE` qui a chargé un flux compressé en mode mémoire Exomizer `` — EXODECRUNCH le décompresse à l'adresse intégrée dans le flux.

| Champ                | Description                                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Adresse du déballeur | Emplacement en mémoire du code de décompression (par défaut : `B000`). Doit être une adresse hexadécimale de 16 bits. |

**Syntaxe experte : **
```
.exodecrunch
.exodecrunch depacker=$B000
```

**Code généré (19 octets) : **
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

**Comment ça marche :**

1. KERNAL `LOAD` ($FFD5) met à jour ZP `$AE/$AF` pour pointer un octet après le dernier octet chargé. EXODECRUNCH copie cette valeur dans ZP `$04/$05`, conformément à la convention officielle Exomizer pour l'écriture en amont.
2. Le décompresseur est généralement placé à `$B000` (dans la région mappée de la ROM BASIC). La macro inverse `$01 = $36` afin que le processeur voie la RAM à cet emplacement pendant l'exécution du JSR, puis rétablit `$01 = $37` par la suite.
3. L'adresse cible de décompression est **encodée dans le flux compressé lui-même** lorsque vous compressez avec `exomizer mem -l <load> fichier,<cible>` — le décompresseur la lit à partir des premiers octets du flux.

**Décompresseur binaire : ** le décompresseur rétro-compilé est `samples/exo-decrunch.bin` (477 octets, ORG $B000). Il s'agit d'une interface Kick Assembler pour le fichier officiel `exodecrunch.asm` avec `INC $D020` ajouté à chaque lecture pour un effet de flash visible pendant la décompression. Placez-le dans votre programme avec un bloc `INCBIN` à l'adresse du décompresseur.

**Compensation de sécurité : ** Le mode mémoire par défaut d'Exomizer applique un décalage de sécurité de 2 octets ; les données sont donc placées 2 octets avant la cible demandée. La boîte de dialogue « Exécuter via D64 » ** ajoute automatiquement 2 au champ Dst ** avant d'appeler Exomizer, afin que le comportement affiché corresponde à l'adresse saisie.

> **Voir aussi :** l’exemple `exo-multicolor-demo` — exemple complet de bout en bout : LOADFILE un bitmap multicolore compressé dans $C000, EXODECRUNCH le décompresse dans $2000, puis copie l’écran → $0400 et la couleur → $D800, et bascule VIC-II en mode bitmap multicolore.

> Test d'intégration : ** ** `test cargo --test exomizer_integration` (dans `src-tauri/`) vérifie le cycle complet de compression et de décompression sur un émulateur 6502 avec le binaire de décompression réel. Critère de réussite : 10 000 octets identiques à la source `multi-color.bin`.

---

### REU_CHECK

Détecte si une unité d'extension de RAM Commodore (REU) est branchée — comme vérifier `PEEK($D010)` pour voir si le matériel est présent. Teste en écrivant et en relisant deux motifs dans le registre REU `$DF04`.

| Champ | Description    |
| ----- | -------------- |
| Aucun | Aucun opérande |

**Code généré (34 octets) :**
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
> La macro normalise le résultat afin que la branche suivante reste simple : `BNE` signifie REU présent, `BEQ` signifie REU manquant.

**Syntaxe experte : **
```
.reu_check
```

**Résultat dans les drapeaux : **
- **Z = 0** (résultat ≠ 0) → REU présent → utiliser `BNE`
- **Z = 1** (résultat = 0) → pas de REU → utiliser `BEQ`

**Aucun champ configurable** — la macro génère le même code à chaque fois.

**Utilisation typique :**
```assembly
REU_CHECK
BEQ no_reu        ; skip if REU not present
; ... REU code here ...
no_reu:
```

---

### REU_STASH / REU_FETCH / REU_SWAP

Transfert de blocs DMA entre la RAM du C64 et la mémoire d'extension REU : similaire à une boucle POKE très rapide, mais sans intervention du processeur (la puce REU copie les données pendant que le processeur est inactif). Un transfert de 1 000 octets est quasi instantané.

| Macro       | Direction     | `$DF01` commande |
| ----------- | ------------- | ---------------- |
| `REU_STASH` | RAM C64 → REU | `$90`            |
| `REU_FETCH` | REU → RAM C64 | `$91`            |
| `REU_SWAP`  | RAM C64 ↔ REU | `$92`            |

**Champs : **

| Champ       | Description                                         | Exemple |
| ----------- | --------------------------------------------------- | ------- |
| Adresse C64 | Source/destination dans la RAM du C64 (hexadécimal) | `C000`  |
| Adresse REU | Source/destination en REU (hexadécimal, 16 bits)    | `0000`  |
| Banque REU  | banque de mémoire REU (0–7)                         | `0`     |
| Longueur    | Nombre d'octets à transférer (hexadécimal, 16 bits) | `1000`  |

**Syntaxe experte : **
```
.reu_stash $C000, $0000, 0, $1000
.reu_fetch $C000, $0000, 0, $1000
.reu_swap $C000, $0000, 0, $1000
```

**Code généré (40 octets) : **
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

> **Remarque : ** Les commandes utilisent `$90/$91/$92` (bit 4 activé = mode DMA immédiat). L’écriture dans `$DF01` lance le transfert ; le processeur reprend son exécution une fois celui-ci terminé.

---

### TURBO_SET

Configure la vitesse du processeur **Ultimate-64 (U64)** via le registre `$D031`. Sans effet sur un véritable C64 ou d'autres émulateurs.

**Champs : **

| Champ   | Description                     | Gamme                                       |
| ------- | ------------------------------- | ------------------------------------------- |
| Vitesse | Indice de vitesse du processeur | 0 = 1 MHz … 7 ≈ 10 MHz … 15 ≈ 48 MHz        |
| Badline | Émulation de Badline            | Activé (compatible C64) / Désactivé (turbo) |

L'octet de vitesse est calculé comme suit : `(speedIndex &amp; 0x0F) | (badline_disabled ? 0x80 : 0x00)`.

**Code généré (5 octets) : **
```
A9 xx   LDA #speed_byte
8D 31 D0   STA $D031
```

**Syntaxe du mode expert : **
```
.turbo_set 7,0    ; speed=7 (~10 MHz), badline enabled
.turbo_set 15,1   ; speed=15 (~48 MHz), badline disabled
```

> **Remarque : ** Cette macro affecte uniquement le matériel U64. Sur un véritable C64 ou d’autres émulateurs, elle écrit dans `$D031`, ce qui peut affecter le CIA ou être ignoré.

---

### SUPERCPU_DETECT

Vérifie si un accélérateur **CMD SuperCPU** est installé — comme `PEEK($D0B8)` pour voir s'il renvoie quelque chose d'autre que `$FF`.

**Code généré (5 octets) : **
```
AD B8 D0   LDA $D0B8
C9 FF      CMP #$FF
```

**Résultat dans les drapeaux : **
- **Z = 0** → SuperCPU présent → utiliser `BNE`
- **Z = 1** → SuperCPU introuvable → utiliser `BEQ`

**Aucun champ configurable.**

**Syntaxe experte : **
```
.supercpu_detect
```

**Utilisation typique :**
```assembly
SUPERCPU_DETECT
BEQ no_scpu       ; skip if SuperCPU not present
; ... SuperCPU turbo code here ...
no_scpu:
```

---

### TURBO_ENABLE

Active ou désactive le mode turbo SuperCPU **CMD **. Appelez d'abord `SUPERCPU_DETECT ` et ignorez cette étape si le SuperCPU n'est pas présent.

| Mode       | Registre | Effet                                                |
| ---------- | -------- | ---------------------------------------------------- |
| Activer    | `$D07A`  | Activer le mode turbo (jusqu'à 20 MHz avec SuperCPU) |
| Désactiver | `$D07B`  | Retour au mode de compatibilité 1 MHz                |

**Code généré (5 octets) : **
```
A9 00         LDA #$00
8D 7A D0      STA $D07A    ; (or $D07B for disable)
```

**Syntaxe du mode expert : **
```
.turbo_enable on
.turbo_enable off
```

> **Remarque : ** Appelez d’abord `SUPERCPU_DETECT` et contournez cette macro si le SuperCPU n’est pas présent.

---

<a id="map_copy"></a>
### MAP_COPY

Copie une carte de tuiles depuis une adresse source vers la RAM écran (et éventuellement la RAM couleur) à l'aide d'une série de boucles `LDA abs,X` / `STA abs,X`. Une page de 256 octets est copiée à chaque itération ; une page partielle à la fin est copiée via `CPX #rem / BNE` pour interrompre la copie. Aucun JSR n'est nécessaire : tout le code est généré directement dans le code.

| Champ                         | Description                                                                                                                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Adresse source (écran)        | Adresse hexadécimale où se trouvent les données de la carte après le chargement (par exemple, `C000`)                                                                                             |
| Écran RAM dest                | Où copier les codes d'écran (par exemple `0400`)                                                                                                                                                  |
| Taille (octets)               | Nombre total d'octets à copier — généralement `$03E8` = 1000 (40×25 caractères)                                                                                                                   |
| Fichier .bin combiné          | Lors de la vérification, attend des codes d'écran immédiatement suivis de données de couleur à `source + taille` ; copie les données de couleur vers **Color RAM dest** lors d'une seconde passe. |
| destination de la RAM couleur | Destination des données de couleur — par défaut `D800` (RAM couleur C64)                                                                                                                          |

**ASM généré (carte de 1000 octets, écran uniquement) :**
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

**Taille : ** `2 (LDX) + pages complètes×9 + (rem &gt; 0 ? 11 : 0)` octets par section. Le mode combiné double cette valeur (section écran + section couleur identique).

**Appairage avec l'éditeur de cartes : **

L'éditeur de cartes, via **Fichiers → Enregistrer la carte + RAM couleur (.bin)**, exporte un seul fichier binaire dont les `premiers octets` correspondent aux codes d'écran et les `octets suivants` aux valeurs de la RAM couleur. Utilisez MAP_COPY avec l'option **Combined .bin** cochée et indiquez **Source addr** l'emplacement de chargement de ce fichier (par exemple, via INCBIN à `$C000`).

```
* = $C000
    INCBIN "map-color.bin" @ $C000   ; screen codes $C000–$C3E7, color $C3E8–$C7CF
* = $0801
    ; ...
    MAP_COPY src=$C000 dst=$0400 size=1000 combined color_dst=$D800
```

**Syntaxe du mode expert : **
```
.map_copy $C000, $0400, 1000               ; screen only
.map_copy $C000, $0400, 1000, auto, $D800  ; combined (color at src+size)
.map_copy $C000, $0400, 1000, $C3E8, $D800 ; explicit color source address
```

---

<a id="map_copy16x16"></a>
### MAP_COPY16X16

Copie une zone de caractères de 16×16 à partir d'un bloc de code écran compact de 256 octets et d'un bloc de mémoire RAM couleur correspondant de 256 octets. Cette fonction est conçue pour les exportations de canevas de jeu de caractères et les petits fragments de tuiles/images, où l'écriture de seize lignes MAP_COPY distinctes serait fastidieuse.

**Disposition par défaut : **

| Données                          | Adresse par défaut       |
| -------------------------------- | ------------------------ |
| Codes d'écran 16×16              | Adresse source (`src`)   |
| Valeurs de couleur 16×16         | `src + 256`              |
| destination de la RAM de l'écran | `$0400 + ligne×40 + col` |
| destination de la RAM couleur    | `$D800 + ligne×40 + col` |

**Syntaxe du mode expert : **
```
.map_copy16x16 $3000, 12, 4
.map_copy16x16 $3000, 12, 4, $0400, $3100, $D800
```

La forme abrégée copie les octets d'écran de `$3000`, les octets de couleur de `$3100` et place le bloc 16×16 à la colonne 12, ligne 4. Les positions valides en haut à gauche sont `col = 0..24` et `row = 0..9`, de sorte que la zone complète de 16×16 reste sur l'écran de texte 40×25 du C64.

**Comportement généré : **

- Génère seize copies de lignes en ligne.
- Chaque ligne copie 16 octets d'écran et 16 octets de couleur.
- Aucune JSR n'est nécessaire ; le code est émis directement à l'emplacement de la macro.
- Fonctionne en mode caractère normal et en mode caractère multicolore ; les octets de la mémoire RAM couleur contiennent le bit d'activation de la couleur/multicolore du caractère de chaque cellule.

Association typique avec Charset Canvas :

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

Cette fonction fait progresser l'image d'animation d'un sprite à chaque appel et met à jour le pointeur de données du sprite VIC-II. Elle stocke un octet par image dans une table (le numéro de page des données du sprite = `adresse_données / 64`), fait pointer SPRITE_ANIM vers cette table et appelle la fonction une fois par image de jeu ; aucun JSR n'est nécessaire.

| Champ                          | Description                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Sprite #                       | Sprite numéro 0 à 7                                                                                                |
| Adresse de la liste des cadres | Adresse hexadécimale de la table des trames — un octet par trame, chaque octet = page de sprite (`data_addr / 64`) |
| Nombre d'images                | Nombre total d'images (1–255)                                                                                      |
| Cadre ZP                       | Octet de page zéro utilisé comme compteur de trame (par exemple `FB`)                                              |

**ASM généré (sprite 0, 4 images, ZP `$FB`, liste à `$C100`):**
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

**Taille : ** 19 octets.

**Utilisation typique :**
```
frameTable:
    .byte $21, $22, $23, $24   ; 4 frames at $0840, $0880, $08C0, $0900

gameloop:
    WAIT_RASTER ($FF)
    SPRITE_ANIM (sprite=0, list=$C100, count=4, zp=$FB)
    JMP gameloop
```

**Syntaxe du mode expert : **
```
.sprite_anim spriteNum, frameListAddr, frameCount, zpByte
; example:
.sprite_anim 0, C100, 4, FB
```

> Conseil : Placez la table des trames sous forme de bloc RAWBYTES à une adresse fixe. L’octet de compteur ZP ($FB) doit être initialisé à 00 avant le premier appel. Si votre code utilise $FB à d’autres fins, choisissez un emplacement ZP libre.

---

<a id="score_bcd"></a>
### SCORE_BCD

Ajoute une valeur à virgule fixe à un score BCD multi-octets stocké en mémoire, puis affiche chaque chiffre dans la mémoire RAM de l'écran sous forme de caractère de code écran. Utilise le mode décimal 6502 (`SED`/`CLD`) pour des calculs BCD sans retenue ; aucun ajustement manuel de la retenue n'est nécessaire.

| Champ              | Description                                                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Adresse du score   | Adresse hexadécimale des octets de score BCD (par exemple `C200`). Octet de poids faible en premier.                   |
| Chiffres           | Nombre d'octets BCD (chaque octet contient deux chiffres : `$99` = "99"). `4` octets = jusqu'à 99999999.               |
| Ajouter des points | Valeur décimale à ajouter par appel (par exemple `100`).                                                               |
| Adresse de l'écran | Où écrire les codes numériques de l'écran (par exemple `0400`). Un octet par chiffre (octet de poids fort en premier). |

**Syntaxe experte : **
```
.score_bcd $C200, 4, 100, $0400
```

**ASM généré (4 octets, +100 pts, score à `$C200`, écran à `$0400`):**
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

**Taille : ** `3 + chiffres×8` octets (SED + CLC + surcharge CLD + 8 octets par octet BCD pour ADC + boucle d’affichage).

**Syntaxe du mode expert : **
```
.score_bcd $C200, 4, 100, $0400
```

> Conseil : Initialisez les octets du score à $00 au démarrage. L’adresse du score doit se trouver dans la page zéro ou dans la RAM absolue, et non dans la ROM. L’adresse de l’écran doit pointer vers la cellule numérique la plus à gauche ; les chiffres sont écrits de gauche à droite (octet de poids fort en premier).

> **Plage BCD : ** `chiffres=4` octets → 8 chiffres décimaux → score maximum 99 999 999. Chaque octet encode deux chiffres BCD : `$00`–`$99`.

---

## 10. Intégration du débogueur

L'application prend en charge RetroDebugger**** comme débogueur C64 externe. Elle reçoit les points d'arrêt, les symboles et les indicateurs de démarrage automatique générés par le programme assemblé.

### RetroDebugger

[RetroDebugger](https://github.com/slajerek/RetroDebugger) est un débogueur Commodore 64 multiplateforme avec prise en charge des points d'arrêt, inspection de la mémoire et désassemblage prenant en compte les étiquettes.

**Configuration :** Ouvrez **Paramètres → Configurer l’exécutable RetroDebugger** et pointez-le vers le binaire `RetroDebugger`.

**Lancement :** Cliquez sur **Déboguer (RetroDebugger)** dans la barre d’outils. L’application va :

1. Assemblez le programme dans un fichier `.prg` dans un répertoire temporaire.
2. Écrivez un fichier de points d'arrêt **** (`breakpoints.txt`) — un `break $ADDR` par bloc marqué.
3. Créez un fichier de symboles (symbols.txt) au format d'étiquettes Vice/RetroDebugger (al C:\addr.name). Tous les blocs LABEL et CONST sont inclus.
4. Écrivez également des sidecars de style C64Debugger à côté du PRG compilé : `.dbg`, `.sym` et `.vs`.
5. Lancez RetroDebugger avec :
   ```
   RetroDebugger -prg <file.prg> -breakpoints <breakpoints.txt> -symbols <symbols.txt> [flags]
   ```

### Blocs de points d'arrêt

Cliquez sur l'icône de point d'arrêt (●) sur un bloc d'instructions pour le définir comme point d'arrêt. Les blocs avec point d'arrêt sont surlignés en rouge. Leurs adresses sont enregistrées dans le fichier des points d'arrêt à chaque lancement du débogueur.

### Indicateurs du débogueur (onglet Options)

| Basculer          | Drapeau          | Effet                                                                           |
| ----------------- | ---------------- | ------------------------------------------------------------------------------- |
| `-jmp` activé     | `-saut $ADDR`    | Accédez directement à l'adresse de démarrage du programme après le chargement.  |
| `-reprise` ACTIVÉ | `-reprise`       | Reprenez immédiatement le débogueur au chargement.                              |
| `-attendre` ON    | `-attendre <ms>` | Attendez `<ms>` millisecondes avant de reprendre la lecture — 500 ms ou 1000 ms |

> **Conseil : ** Pour la plupart des programmes, activez `-jmp ` et `-unpause ` pour un démarrage automatique instantané. Utilisez `-wait 500 ` ou `-wait 1000 ` lorsque votre programme configure des IRQ ou de la musique SID qui nécessite un temps d'initialisation avant le premier balayage.

---

## 11. Liens vers la base de connaissances

Liens de référence rapide disponibles dans l'application sous **Base de connaissances** :

| Ressource                            | URL                                            |
| ------------------------------------ | ---------------------------------------------- |
| Référence des codes d'opération 6502 | http://www.6502.org/tutorials/6502opcodes.html |
| Fonctions du noyau C64               | https://sta.c64.org/cbm64krnfunc.html          |
| Carte mémoire du C64                 | https://sta.c64.org/cbm64mem.html              |
| Codes couleur C64                    | https://sta.c64.org/cbm64col.html              |
| Article VIC-II                       | https://www.cebix.net/VIC-Article.txt          |
| Base de code C64                     | https://codebase.c64.org/                      |
| Le Turbo Assembleur                  | https://turbo.style64.org/                     |
| RetroDebugger                        | https://github.com/slajerek/RetroDebugger/     |

---

## 12. Exportation et exécution D64

La version 1.5.1 ajoute la possibilité d'empaqueter votre programme (et des fichiers de données supplémentaires) dans une image disque C64 D64 et de la lancer dans VICE, ou d'exporter l'image disque pour une utilisation ailleurs.

### Bouton Split Run

Le bouton **Exécuter** de la barre d'outils a été remplacé par un bouton **fractionné** :

| Partie                     | Action                                               |
| -------------------------- | ---------------------------------------------------- |
| **▶ Exécuter** (principal) | Exécute le mode d'exécution actuellement sélectionné |
| **▾** (flèche)             | Ouvre le sélecteur de mode                           |

**Modes d'exécution disponibles : **

| Mode                         | Description                                                                                                                                                                                                                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exécuter en tant que PRG** | Assemblez le tout dans un fichier temporaire `.prg` et lancez VICE directement. Comportement classique.                                                                                                                                                                           |
| **Exécuter via D64**         | Assemblez et créez une image disque `.d64` (en utilisant c1541), ajoutez les fichiers supplémentaires configurés, puis lancez VICE depuis le disque. Utilisez cette image chaque fois que votre programme charge des fichiers à l'exécution (par exemple avec la macro LOADFILE). |
| **Exécuter sur le matériel** | Assemblez le fichier PRG et envoyez-le à un périphérique **1541 Ultimate / Ultimate 64** via le réseau local. Voir [Section 13](#13-hardware-settings).                                                                                                                           |

Le mode sélectionné est enregistré entre les sessions.

### Boîte de dialogue Exporter vers D64

Ouvrez le fichier via le menu déroulant **Enregistrer PRG ▾** → **Exporter vers D64**. La boîte de dialogue vous permet de :

1. Définissez le **nom du disque** (max 16 caractères) et le **nom du programme** — ce sont les noms qui apparaissent dans le répertoire du disque C64.
2. **Ajouter des fichiers supplémentaires** — cliquez sur **+** pour sélectionner un fichier binaire (`.prg`, `.bin`, `.sid`, etc.). Pour chaque fichier supplémentaire :
   - **Nom** — tel qu'il apparaît dans le répertoire D64 (16 caractères max, majuscules automatiques).
   - **Addr** (adresse de chargement, optionnelle) : si cette adresse est fournie, un en-tête PRG de 2 octets est ajouté. Laissez ce champ vide pour écrire des octets bruts sans en-tête.
   - **Dst** (cible de décompression, uniquement avec EXO) — emplacement où le décompresseur doit déposer les données sur le C64. Lorsque EXO est activé, le fichier supplémentaire est compressé avec `exomizer mem -l <Addr> fichier,<Dst>` avant d'être écrit sur le D64. La compensation de sécurité de +2 est appliquée automatiquement.
   - **EXO** — case à cocher qui active le traitement en mode `mem` inversé pour cette entrée. La taille sur disque représente généralement 5 à 20 % de la taille d'origine.
3. Cliquez sur **Exporter** pour générer le fichier `.d64` à l'aide de l'outil `c1541` de VICE.

**Appairage avec EXODECRUNCH : ** Lorsque vous envoyez un fichier avec EXO=on, le programme qui le lit doit le charger à l'adresse **Addr** (sec=1, en-tête PRG du fichier), puis appeler la macro **EXODECRUNCH** pour le décompresser dans **Dst**. Consultez l'exemple `exo-multicolor-demo` pour le schéma complet.

### Métadonnées D64 dans les projets

Le nom du disque, le nom du programme et la liste des fichiers supplémentaires sont enregistrés dans le fichier JSON du projet (sous la clé `d64`). Lorsque vous rechargez le projet ou un exemple contenant des métadonnées D64, ces éléments supplémentaires sont automatiquement restaurés ; il n’est donc pas nécessaire de les rajouter à chaque fois.

L'exemple **loadfile-demo** est préconfiguré avec le fichier supplémentaire `DEMO-COLORS.PRG`. Sélectionnez-le, ouvrez **Exécuter via D64** et cliquez sur **Exécuter** pour observer le flux de chargement complet.

> **Exigence :** L'exportation D64 et l'exécution via D64 nécessitent toutes deux que VICE (`c1541`) soit configuré dans [Paramètres matériels](#13-hardware-settings).

### Éditeur D64 (parcourir et modifier une image disque existante)

L'icône de la barre d'outils située après l'Éditeur de courbes ouvre l'Éditeur D64, un outil autonome permettant de travailler directement avec une image D64 existante, indépendamment du programme actuellement ouvert. Contrairement à la boîte de dialogue Exporter vers D64 ci-dessus (qui crée systématiquement un nouveau disque à partir du fichier PRG compilé), l'Éditeur D64 modifie une image disque directement via c1541, faisant ainsi office de gestionnaire de disques léger.

**Fichiers ▾ menu : **

| Article                | Action                                                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Nouveau D64…**       | Choisissez un emplacement de destination et créez-y une image disque vierge et fraîchement formatée.           |
| **Ouvrir D64…**        | Sélectionnez un fichier `.d64` existant et chargez son répertoire.                                             |
| **Enregistrer sous…**  | Copiez l'image disque actuellement ouverte vers un nouveau chemin d'accès et poursuivez l'édition de la copie. |
| **Exécuter dans VICE** | Lancez directement l'image disque actuellement ouverte dans VICE (`-drive8type 1541`).                         |

**Barre d'outils :**

| Icône                      | Action                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| **Ajouter un programme**   | Sélectionnez un fichier local et écrivez-le dans le répertoire du disque.                   |
| **Extraire la sélection**  | Enregistrez les octets de l'entrée sélectionnée dans un fichier local `.prg`.               |
| **Renommer la sélection**  | Modifiez le nom de l'entrée directement dans le tableau — Entrée confirme, Échap annule.    |
| **Supprimer la sélection** | Supprimez l'entrée sélectionnée du disque.                                                  |
| **Actualiser**             | Relisez le répertoire, par exemple après avoir modifié le disque à l'aide d'un autre outil. |

**Ajout d'un programme :** la sélection d'un fichier se terminant déjà par `.prg` ne demande qu'un **Nom** et un **Type** de disque (PRG/SEQ/USR/REL) — un fichier `.prg` contient déjà son propre en-tête d'adresse de chargement, il est donc écrit sans modification. La sélection de tout autre fichier (par exemple, un fichier brut `.bin`) affiche en outre :

- **Adresse de chargement** (hex, optionnel) — ajouter un en-tête PRG de 2 octets à cette adresse ; laisser vide pour écrire les octets bruts.
- **Adresse de décompression** (hex, optionnel) — utilisé uniquement avec Exomizer ; l'adresse cible vers laquelle le décompresseur doit décompresser les données.
- **Exomizer** case à cocher — compressez le fichier avant l'écriture, en utilisant les mêmes modes de compression `mem`/`sfx` que les fichiers supplémentaires dans la boîte de dialogue Exporter vers D64 ci-dessus.

La liste des répertoires affiche les noms de fichiers dans la même police et le même style de majuscules qu'une véritable liste C64 `LOAD"$",8`.

> **Prérequis : ** À l’instar de l’exportation vers D64, l’éditeur D64 nécessite VICE (`c1541`) configuré dans [Paramètres matériels](#13-hardware-settings). Chaque action (ajout/suppression/renommage/extraction) est appliquée directement au fichier `.d64` sur le disque ; il n’y a pas d’étape d’enregistrement séparée.

---

## 12b. Exportation CRT (cartouche Magic Desk 64K)

Menu → Compiler → Compiler CRT génère une image de cartouche Commodore 64 (type 19 – Magic Desk / Domark / HES Australia) compatible avec VICE, TheC64, le matériel physique via EasyFlash / Kung Fu Flash et les emplacements cartouches 1541 Ultimate II+. Elle est disponible en mode bloc, en mode expert et, depuis la version actuelle, également en mode UltimateBasic.

### Qu'est-ce qui est expédié dans le panier ?

- **8 × 8 KB banques** à `$8000`, banque commutée via `$DE00` (Convention Magic Desk : les 3 bits de poids faible = banque, bit 7 = désactiver le chariot).
- ** La banque 0 ** contient un en-tête de 128 octets + un chargeur de démarrage :
  - `$8000/$8002` vecteurs de démarrage à froid + à chaud pointent vers `$8009`.
  - `$8004–$8008` = la signature `CBM80` requise par le code de réinitialisation du KERNAL.
  - `$8009–$807F` = le chargeur : SEI / initialisation de la pile / `JSR $FDA3` (IOINIT) / `JSR $FD50` (RAMTAS) / `JSR $FD15` (RESTOR) / `JSR $FF5B` (CINT), puis une boucle de copie d'octets qui transfère la charge utile de la ROM de la cartouche vers la RAM et change de banque lorsque `$FC` atteint `$A0`. À la fin, il copie un minuscule **exit stub** vers `$0100`, désactive la cartouche avec `LDA #$80 : STA $DE00`, et `JMP`s vers le point d'entrée.
- **La charge utile** commence à `$8080` dans la banque 0 et se répartit dans les banques 1 à 7 selon les besoins. Charge utile maximale = `8 * 8192 − 128 = 65 408 octets`.

### Adresse de chargement et point d'entrée

La compilation CRT n'utilise jamais Exomizer (le décompresseur ne peut pas s'exécuter à partir de la ROM de la cartouche). Elle compile l'onglet actuel avec le pipeline de démarrage automatique standard et récupère l'adresse de chargement à partir de l'en-tête PRG et le point d'entrée à partir de la cible SYS :

- **Mode Bloc / Expert avec stub BASIC SYS activé : ** chargement = `$0801`, entrée = la cible SYS (généralement `$080D` ou l'origine de l'utilisateur).
- **Mode Bloc / Expert avec stub BASIC SYS désactivé : ** chargement = origine utilisateur (avec le repli classique `$0801 → $C000 `), entrée = adresse de chargement.
- **Mode UltimateBasic : ** le chargement et l’entrée proviennent tous deux de la table de correspondance du compilateur UB (`build.map.loadAddress`). Le stub de démarrage automatique UB à l’intérieur de la charge utile est ensuite exécuté exactement comme il le serait après `LOAD "...",8,1 : RUN` depuis le disque.

L'adresse d'origine que vous voyez dans la sortie ASM est préservée ; le chargeur copie simplement l'image mémoire plate du PRG dans la RAM et saute au point d'entrée une fois que la ROM de la cartouche est démappée.

### Limite de taille

Étant donné que la charge utile est stockée linéairement et que la fonction `assembleProgramToPrg()` renvoie un tampon `minAddr..maxAddr` plat avec des espaces vides remplis de zéros, un programme avec des segments ORG largement espacés (par exemple, `$0801` + `$C000` + `$E000`) compte chaque octet intermédiaire dans le budget de 65 408 octets. Si cette limite est dépassée, la compilation s'interrompt avec une erreur `saveCrtTooLarge` : il faut alors compresser la mémoire ou fractionner les données.

> **⚠️ Avertissement important — à lire avant l'expédition d'un CRT**
> 
> Le chargeur appelle la fonction KERNAL **`RESTOR` ($FD15)** dans le cadre de la séquence de réinitialisation standard. Ceci réécrit intentionnellement les vecteurs d'E/S standard aux adresses `$0314/$0315`, `$0316/$0317`, `$0318/$0319`, `$0328/$0329` et associées, en rétablissant leurs valeurs par défaut dans la ROM. Conséquences :
> 
> - **Toutes les interruptions IRQ / NMI / BRK définies avant le démarrage du CRT sont effacées.** Votre programme doit les installer lui-même après l'entrée — exactement comme un nouveau `LOAD "",8,1 : RUN` à partir d'une bande/disque.
> - Les programmes Ultimate Basic qui dépendent de vecteurs KERNAL non standard actifs à l'entrée peuvent nécessiter un appel explicite à SYS ou à init dans le stub de démarrage automatique. Le démarrage automatique standard d'UB fonctionne immédiatement ; ce n'est pas le cas des bibliothèques d'extension qui interceptent les vecteurs avant RUN.
> - Les interfaces **CIA1 et **CIA2 sont réinitialisées par `IOINIT`. Les configurations de minuterie personnalisées (IRQ raster, interface CIA-A du lecteur de musique) doivent être reprogrammées après la saisie.
> - La cartouche est désactivée par un stub de 8 octets dans la RAM ** à l'adresse `$0100`** afin que l'opération `STA $DE00` ne puisse pas être interrompue par une erreur de lecture de la ROM. Ne vous fiez pas à l'image de la pile dans `$0100–$0107` lors de l'entrée : la première écriture en RAM écrase le stub.
> 
> Si un programme CRT fonctionne sous VICE mais échoue sur du matériel physique, il faut d'abord vérifier s'il suppose un état spécifique du vecteur KERNAL ou du minuteur CIA à son entrée. Définissez explicitement cet état dans votre routine d'initialisation ; le programme se comportera alors de la même manière sur les deux supports.

### Compatibilité

| Plate-forme                     | Statut                                                          |
| ------------------------------- | --------------------------------------------------------------- |
| VICE (`x64sc`, `x64`)           | Fonctionne via **Fichier → Attacher l'image de la cartouche**.  |
| Le C64 / Le C64 Mini            | Fonctionne grâce au chargeur de cartouches intégré.             |
| Éclair de Kung Fu               | Fonctionne — mode natif Magic Desk.                             |
| Cartouche EasyFlash             | Fonctionne lorsqu'il est programmé comme Magic Desk.            |
| 1541 Ultimate II+ / Ultimate 64 | Fonctionne via **Cartouche → Charger l'image de la cartouche**. |
| Caméléon / Turbo Caméléon       | Travaux.                                                        |

---

## 13. Paramètres matériels

Ouvrez ce menu via **Paramètres → Paramètres matériels…** dans la barre d'outils. Vous y trouverez tous les chemins d'accès aux périphériques externes et la configuration réseau.

### Émulateur VICE

| Paramètre             | Description                                                           |
| --------------------- | --------------------------------------------------------------------- |
| **Sélectionnez VICE** | Accédez à l'exécutable VICE `x64sc` (ou `x64`).                       |
| **Statut**            | Indique si le chemin d'accès à l'exécutable est valide et accessible. |

VICE est requis pour **Exécuter en tant que PRG**, **Exécuter via D64** et **Exporter vers D64**.

### Exomizer

| Paramètre                                     | Description                                                                                                                                                                                                    |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sélectionnez Exomizer**                     | Accédez au fichier exécutable `exomizer`.                                                                                                                                                                      |
| **Flash de bordure pendant la décompression** | Lorsque cette option est activée, les fichiers PRG compressés SFX utilisent l'effet de flash rapide intégré à exomizer `-x1` ; lorsqu'elle est désactivée, `-n` est utilisé pour la décompression silencieuse. |
| **Statut**                                    | Indique si le chemin d'accès à l'exécutable est valide et accessible.                                                                                                                                          |

**Flux de travail : **
1. Installez le fichier binaire Exomizer :
   - **Windows:** Téléchargez le fichier précompilé `win32/exomizer.exe` depuis https://bitbucket.org/magli143/exomizer/wiki/Home ou https://csdb.dk/release/?id=244342.
   - **macOS:** `brew install exomizer` (installe la version officielle 3.1.2 de Magnus Lind).
2. Configurez le chemin dans **Paramètres matériels → section Exomizer**.
3. Activez la case à cocher **Exécuter avec Exomizer** dans le menu **Paramètres**.
4. Toutes les actions **Run** (PRG, D64, matériel) et **Build** (Build PRG, Build D64) vont désormais traiter le programme assemblé via `exomizer sfx sys` avant de le lancer ou de l'enregistrer.

Exomizer fonctionne de la même manière sous Windows et macOS : l’interface de ligne de commande est invoquée depuis le serveur Tauri ; l’intégration n’a rien de spécifique à une plateforme.

**Deux modes de compression sont utilisés en interne :**

| Mode               | Utilisé par                                                    | Convention d'appel                                                                                                                                                                                     |
| ------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `sfx sys`          | Compiler/Exécuter avec bascule Exomizer (chemin PRG principal) | PRG auto-extractible avec décruncher intégré ; le réglage Border-flash contrôle `-x1` vs `-n`                                                                                                          |
| `mem` (à l'envers) | Exécuter via D64 → case à cocher par fichier **EXO**           | Compresse chaque fichier supplémentaire en un flux en mode `mem` ; le programme le décompresse à l'exécution via la macro **EXODECRUNCH** et un décompresseur pré-compilé (`samples/exo-decrunch.bin`) |

> **Conseil : ** Si le chemin d’accès à Exomizer n’est pas configuré mais que la case est cochée, un message d’erreur s’affiche au lieu de lancer l’application. Décochez la case pour exécuter l’application sans compression.

> **Test d'intégration : ** `Test de cargaison --test exomizer_integration` (dans `src-tauri/`) vérifie l'aller-retour complet de compression + décompression en mode mémoire sur un émulateur 6502.

### Débogueur rétro

| Paramètre                      | Description                         |
| ------------------------------ | ----------------------------------- |
| **Sélectionnez RetroDebugger** | Accédez au binaire `RetroDebugger`. |
| **Statut**                     | Indique si le chemin est valide     |

Voir [Section 9](#9-debugger-integration) pour la documentation complète du débogueur.

### C64 Ultimate / 1541 Ultimate

Exécutez les PRG assemblés directement sur du matériel réel via le réseau local en utilisant l'API REST Ultimate.

| Paramètre             | Description                                                                     |
| --------------------- | ------------------------------------------------------------------------------- |
| **Hôte (IP)**         | Adresse IP du périphérique (par exemple `192.168.1.100`)                        |
| **Mot de passe**      | Facultatif — si l'appareil nécessite une authentification                       |
| **Test de connexion** | Envoie une requête de test à `/v3/runners/info` ; affiche « OK » ou « erreur ». |

**Flux de travail : **
1. Connectez le 1541 Ultimate / Ultimate 64 à votre réseau local.
2. Saisissez son adresse IP (et le mot de passe s'il en a un) dans les paramètres matériels.
3. Sélectionnez **Exécuter sur le matériel** dans le menu d'exécution fractionnée.
4. Cliquez sur **▶ Exécuter** — le fichier PRG est compilé et envoyé à l'appareil via une requête HTTP POST à `/v3/runners/prg`. L'appareil le charge et l'exécute immédiatement sur le C64.

> **Conseil : ** Aucun câble USB ni pilote n’est nécessaire — l’API REST est intégrée au firmware Ultimate. Votre ordinateur et l’appareil doivent être connectés au même réseau local.

---

## 14. Éditeurs visuels (boîte à outils)

Le menu de la barre d'outils **Toolkit** regroupe les éditeurs de données visuelles qui partagent tous un menu Fichiers commun (`Fichiers ▾`) pour Charger BIN / Enregistrer BIN / Exporter vers des blocs / Enregistrer sur D64. Chaque éditeur produit des données brutes `.bin` qui peuvent être placées dans un programme avec `INCBIN`, ou ajoutées directement à un disque D64 via l'entrée **Enregistrer sur D64**.

Les boîtes de dialogue de l'éditeur visuel peuvent être déplacées par leur en-tête dans tout l'espace de travail de Visual Assembler. Une boîte de dialogue sans position enregistrée s'ouvre centrée ; après déplacement, sa dernière position est enregistrée dans les paramètres d'interface utilisateur et restaurée lors de sa prochaine ouverture.

### Éditeur haute résolution/multicolore

Éditeur d'images bitmap au niveau du pixel, avec modes haute résolution 320×200 et multicolore 160×200. Ouvrir via Outils → Éditeur haute résolution.

| Fonctionnalité             | Description                                                                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Basculement du mode        | **Multicolore** La case à cocher permet de basculer entre haute résolution (mono par cellule) et multicolore (4 couleurs par cellule).       |
| Outils                     | Crayon, gomme, ligne, rectangle, rectangle plein, ovale, ovale plein, remplissage.                                                           |
| Outil de pulvérisation     | Outil de peinture de type aérographe qui disperse des pixels autour du curseur pendant le dessin.                                            |
| intensité de pulvérisation | Le menu déroulant situé à côté de l'outil de pulvérisation permet de contrôler la densité de chaque coup de pulvérisation.                   |
| palette de couleurs        | Sélecteurs de premier plan (encre) + papier (arrière-plan). Le mode multicolore suit automatiquement 3 éléments supplémentaires par cellule. |
| Annuler / Rétablir         | Historique par AVC, ctrl-Z / ctrl-Y.                                                                                                         |
| Grille + Raster            | Grille 8×8 optionnelle et superposition de lignes raster pour l'alignement des cellules.                                                     |
| Importer une image         | Les fichiers PNG/JPEG/GIF déposés sur le canevas sont automatiquement convertis en une palette de 16 couleurs C64.                           |
| Blocs d'exportation        | Ajoute des blocs BYTE/RAWBYTES au programme avec les données bitmap, d'écran et de couleur encodées.                                         |
| Exporter `.bin`            | Enregistre le format multicolore natif (10000 octets : 8000 bitmap + 1000 écran + 1000 couleur) prêt pour LOADFILE à $2000.                  |

### Éditeur de sprites

Éditeur de sprites 24×21 pixels avec animation multi-images. Ouvrir via Outils → Éditeur de sprites.

| Fonctionnalité        | Description                                                                                                                                                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cadres                | Ajouter / supprimer / réorganiser les cadres ; la bande de cadres est visible en bas.                                                                                                                                                                         |
| Mode                  | Basculement monochrome/multicolore.                                                                                                                                                                                                                           |
| Outils                | Crayon, remplissage, ligne, rectangle, cercle — plus symétrie horizontale, symétrie verticale, décalage gauche/droite/haut/bas (avec option d'enroulement). Les outils de forme affichent un aperçu en direct pendant le déplacement ; relâchez pour valider. |
| Annuler / Rétablir    | Historique complet des actions d'annulation/rétablissement par image. Ctrl/Cmd+Z / Ctrl/Cmd+Y ou les boutons de la barre d'outils.                                                                                                                            |
| Importation d'images  | Importez une image PNG ou JPEG via Fichiers → Importer une image. L'outil d'importation associe chaque pixel à la couleur de la palette C64 la plus proche et l'inscrit dans l'image courante.                                                                |
| Aperçu de l'animation | Lecture/Arrêt à vitesse configurable.                                                                                                                                                                                                                         |
| Blocs d'exportation   | Insère un bloc RAWBYTES à une adresse alignée sur 64 octets pour chaque image, ainsi qu'une configuration de pointeur de sprite.                                                                                                                              |
| Enregistrer `.bin`    | Écrit 64 octets par image (données brutes du sprite sans remplissage).                                                                                                                                                                                        |

### Navigateur de ROM de caractères C64 (« Carte des caractères »)

Visionneuse en lecture seule de la ROM de caractères du C64 (police PETSCII intégrée). S'ouvre via l'entrée **C64 chargen** du menu Toolkit. Utile pour trouver le code écran d'un glyphe avant de l'écrire avec `RAWBYTES` ou `TEXT`.

| Fonctionnalité               | Description                                                                                                                                                                                                             |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Deux ensembles de caractères | Onglet 1 : **Set 1 — Supérieur/Graphique** (mode par défaut après la mise sous tension). Onglet 2 : **Set 2 — Inférieur/Supérieur** (après le commutateur `$0E`).                                                       |
| Grille de glyphes            | Grille 16×16 des 256 caractères. Cliquez sur un glyphe pour afficher son panneau de détails : vue zoomée 8×8 pixels, code écran (décimal + hexadécimal), codes PETSCII (par défaut et décalés) et bitmap brut 8 octets. |
| Panneau de détail            | Affiche le code écran du glyphe sélectionné, les codes PETSCII et les huit octets bruts — prêts à être collés dans un bloc `RAWBYTES` ou BYTE.                                                                          |
| Lecture seule                | Aucune modification ici — utilisez l'éditeur de caractères (ci-dessous) pour modifier les glyphes.                                                                                                                      |

### Éditeur de caractères (Charset)

Éditeur de caractères 8×8 de 256 caractères. Ouvrir via Outils → Éditeur de caractères.

| Fonctionnalité           | Description                                                                                                                                                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Charger la ROM           | Importe le jeu de caractères ROM C64 directement depuis `chargen` de VICE (pas de sélecteur de fichiers).                                                                                                                                  |
| Charger `.bin`           | Importe un binaire externe avec un jeu de caractères de 2048 octets.                                                                                                                                                                       |
| Aperçu par caractère     | Grille de 16 cases de large contenant l'ensemble des 256 glyphes, la cellule actuelle étant mise en surbrillance.                                                                                                                          |
| Éditeur de pixels        | Éditeur de caractères unique 8×8 avec outils bascule/inverser/effacer.                                                                                                                                                                     |
| Couleur par personnage   | Stocke une valeur de mémoire RAM couleur par défaut pour chaque glyphe. En mode caractères multicolores, cela préserve également le bit d'activation multicolore par cellule et la couleur des 3 bits de poids faible propre au caractère. |
| Métadonnées aller-retour | Lors du chargement de données compatibles à partir de flux de travail Charset Canvas / Map, les métadonnées de couleur par caractère sont préservées afin que les modifications puissent se poursuivre sans perte d'intention de couleur.  |
| Blocs d'exportation      | Ajoute RAWBYTES à $0800 (bloc 2) ou $3800 (bloc 7) avec le jeu de caractères encodé.                                                                                                                                                       |

### Éditeur de canevas de caractères

Outil de création d'écrans à partir d'un jeu de caractères complet de 256 caractères. Accès via Outils → Canevas de jeu de caractères.

La zone de travail est de 16×16 caractères. En mode monochrome, cela donne une zone de travail de 128×128 pixels ; en mode caractères multicolores, cela donne une zone de travail de 64×128 pixels larges en utilisant les règles de couleurs multicolores réelles du C64.

| Fonctionnalité                                  | Description                                                                                                                                                                                                                       |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mono / multicolore                              | Le mode monochrome stocke des glyphes 8×8 sur 1 bit. Le mode multicolore stocke des paires de pixels horizontaux sur 2 bits et marque les cellules utilisées avec le bit 3 de la mémoire RAM couleur.                             |
| Modèle couleur C64                              | L'arrière-plan utilise `$D021` ; la couleur multicolore partagée 1 utilise `$D022` ; la couleur multicolore partagée 2 utilise `$D023` ; la couleur propre de chaque caractère provient des bits 0 à 2 de la mémoire RAM couleur. |
| Outils de dessin                                | Le crayon, la gomme, la ligne, le rectangle, l'ovale et le remplissage fonctionnent au-delà des limites des caractères.                                                                                                           |
| Outil de pulvérisation                          | Dessin de style aérographe qui disperse les pixels sur les cellules/caractères voisins.                                                                                                                                           |
| intensité de pulvérisation                      | Le menu déroulant situé à côté de l'outil de pulvérisation permet de régler la densité du trait.                                                                                                                                  |
| Basculer la grille                              | La case à cocher Grille affiche ou masque la grille de caractères 16×16.                                                                                                                                                          |
| Enregistrer le jeu de caractères `.bin`         | Enregistre les données bitmap de caractères de 2048 octets.                                                                                                                                                                       |
| Sauvegarder la carte 16×16 + RAM couleur `.bin` | Enregistre 256 codes d'écran suivis de 256 valeurs de RAM couleur. À utiliser avec `MAP_COPY16X16`.                                                                                                                               |
| Chargement                                      | Peut charger les sauvegardes charset-canvas, les données charset simples et les données charset compatibles de l'éditeur de caractères, y compris les couleurs enregistrées par caractère lorsqu'elles sont présentes.            |

Limitation importante du C64 : en mode caractères multicolores, les deux couleurs partagées sont globales pour tout l’écran ($D022 / $D023). Seule la couleur propre au caractère est définie par cellule, et elle est limitée aux couleurs 0 à 7 car le bit 3 de la mémoire RAM couleur sélectionne le mode multicolore.

### Éditeur de cartes (cartes de tuiles multicouches)

Éditeur de cartes de tuiles multicouches pour les décors statiques, les cartes d'apparition de sprites, les données de collision, etc. Ouvrir via Outils → Éditeur de cartes.

| Fonctionnalité                                         | Description                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Couches                                                | Plusieurs calques nommés, chacun avec son propre ensemble de tuiles et son opacité.                                                                                                                                                                                                                                       |
| pinceaux                                               | Modes d'utilisation : tuile unique, remplissage, ligne, rectangle et cercle. Les outils de forme affichent un aperçu en direct pendant le déplacement ; relâchez pour valider.                                                                                                                                            |
| Annuler / Rétablir                                     | Historique complet des actions Annuler/Rétablir par calque. Ctrl/Cmd+Z / Ctrl/Cmd+Y ou les boutons de la barre d'outils.                                                                                                                                                                                                  |
| Effacer le menu                                        | Effacement par couche ou de la carte entière avec confirmation.                                                                                                                                                                                                                                                           |
| Importation d'images                                   | Déposez une image PNG d'une carte de tuiles ; l'éditeur la découpe automatiquement en tuiles.                                                                                                                                                                                                                             |
| Copier/coller                                          | Copiez une zone de tuiles sélectionnée, puis collez-la normalement ou utilisez le collage transparent pour conserver la transparence des tuiles vides.                                                                                                                                                                    |
| Coloration des carreaux prenant en compte les couleurs | Avec des métadonnées de jeu de caractères compatibles, le rendu utilise les valeurs par défaut de la mémoire RAM couleur stockée de la tuile (y compris l'encodage lié aux couleurs multiples) au lieu d'une couleur unie générique.                                                                                      |
| Couleurs de caractères personnalisées                  | Lorsqu'un jeu de caractères contient des métadonnées `charColors`, l'éditeur de carte utilise la valeur de couleur RAM par défaut de la tuile sélectionnée lors du rendu.                                                                                                                                                 |
| Blocs d'exportation                                    | Émet des blocs RAWBYTES pour les graphismes de tuiles et les données de carte.                                                                                                                                                                                                                                            |
| Sauvegarder la RAM de l'écran (.bin)…                  | Enregistre uniquement les codes d'écran pour la couche de carte actuelle (40×25 = 1000 octets).                                                                                                                                                                                                                           |
| Sauvegarder la RAM écran + la RAM couleur (.bin)…      | Enregistre les codes d'écran concaténés aux valeurs de la mémoire RAM couleur dans un seul fichier de 2 000 octets (`screen[0..999]` suivi de `color[0..999]`). Utilisez-le avec la macro **MAP_COPY** (mode .bin combiné) pour restaurer simultanément l'écran et la couleur en une seule opération lors de l'exécution. |

### Éditeur SID (Traqueur à 3 voix)

Tracker multi-instrumental à 3 voix avec moteur de prévisualisation Web Audio. Ouvrir via Toolkit → Éditeur SID.

**Commandes par instrument :**
- Cases à cocher de forme d'onde (TRI / SAW / PUL / NOI) — plusieurs formes d'onde peuvent être combinées par OU.
- ADSR (attaque / déclin / maintien / relâchement) représenté sous forme de graphique glissant au-dessus des quatre curseurs.
- Curseur de largeur d'impulsion (0-4095) avec indicateurs de sonnerie/synchronisation en option.
- Case à cocher de routage du filtre par voix ; coupure/résonance/volume/mode du filtre global (LP/BP/HP).

**Grille de suivi : **
- 3 voix × jusqu'à 7 motifs × 32 lignes = 7 × 32 = 224 lignes max (le compteur de lignes 8 bits le limite).
- Par ligne : note + index de l’instrument. Les lignes vides contiennent la note précédente.
- Sélectionnez une cellule normalement, ou maintenez les touches **Maj** enfoncées tout en cliquant ou en utilisant les flèches directionnelles pour étendre une sélection rectangulaire sur plusieurs lignes et l'une des trois voix. Un clic droit à l'intérieur de la zone sélectionnée permet de conserver la plage intacte.
- Les fonctions Copier, Couper, Coller et Effacer sont accessibles depuis la barre d'outils à icônes et le menu contextuel à icônes. Ctrl/Cmd+C et Ctrl/Cmd+V s'appliquent à la même sélection rectangulaire.
- Assistant d'harmonie : choisissez une note fondamentale, un type d'accord et une octave, prévisualisez l'accord avec l'instrument actuel, puis insérez l'harmonisation directement dans le tracker. Les types disponibles incluent : Majeur, Mineur, Diminué, Augmenté, Sus2, Sus4, Dominant 7, Majeur 7, Mineur 7, 6, Mineur 6, 9, b9, #9, Dim7 et 7sus4.
- Assistant d'arpèges : prévisualisez ou insérez des séquences de notes de 4, 8 ou 16 pas à partir de l'accord sélectionné, en montant, en descendant ou en montant/descendant.
- **Aperçu de la ligne** permet d'écouter la ligne sélectionnée sur les trois voix sans démarrer la lecture du motif.
- Le collage par plage de cellules commence désormais à la cellule de début de la plage sélectionnée et s'arrête proprement aux limites de la ligne et de la colonne au lieu de passer à la ligne ou à la colonne suivante.
- Le curseur de vitesse définit le diviseur de tick IRQ (images entre les lignes).

**Lecture et clavier virtuel : **
- Le bouton Lecture de la barre d'outils se transforme en Pause pendant la lecture et en Reprendre lorsqu'il est en pause ; le bouton Arrêter met fin à la lecture et réinitialise l'état.
- Le bouton de la barre d'outils du clavier ouvre un piano non modal qui reste utilisable pendant que l'éditeur SID est actif. Faites glisser son en-tête pour le placer n'importe où au-dessus de l'application principale.
- Activez l'option **Insérer dans le tracker** pour inscrire chaque note jouée à l'emplacement actuel du curseur du tracker et passer à la ligne suivante. Désactivez-la pour écouter les notes sans les modifier.
- Les aperçus d'accords et d'arpèges illuminent les touches correspondantes du piano lorsque le clavier est ouvert.

**Exportations du menu Fichiers : **
| Exporter                                  | Ce que cela fait                                                                                                                                                                                                                         |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Enregistrer .bin…`                       | Écrit au format sérialisé natif de l'éditeur (instruments + motifs + séquence).                                                                                                                                                          |
| `Exporter les blocs (données uniquement)` | Ajoute la table d'instruments + les blocs de motifs au programme à `* = $C000`.                                                                                                                                                          |
| `Exporter les blocs + mini-joueur`        | Ajoute le lecteur complet (sid_init / sid_irq / sid_play_row / sid_set_voice) ainsi que les tables de fréquences PAL. Après l'exportation, insérez un `JSR sid_init` dans votre code principal, à l'endroit où la musique doit démarrer. |
| `Exporter asm (presse-papiers)`           | Copie l'intégralité du code source de l'assembly dans le presse-papiers.                                                                                                                                                                 |

**Utilisation du lecteur ZP : ** `$FB` (compteur de ticks), `$FC` (index de ligne), `$FD` (définir la voix temporaire). Ces commandes peuvent entrer en conflit si votre code principal les utilise ; déplacez-les via le mode Expert si nécessaire.

**Limites connues : **
- Liste de motifs linéaires uniques (pas encore de tableau de séquences par voix).
- Le compteur de lignes 8 bits se limite à 7 motifs × 32 lignes.
- Le volume global C64 `$D418` est partagé entre les voix — le curseur de volume par instrument est informatif ; le niveau de sustain (`S` d'ADSR) est le volume effectif par voix.
- L'aperçu audio Web est approximatif : la modulation PWM, la synchronisation en anneau et les caractéristiques du filtre SID diffèrent de celles de la puce réelle.

---

### Éditeur de courbes

Génère des tables de correspondance `.byte` prêtes à l'emploi à partir de courbes mathématiques : sinus, lissage, triangle/dent de scie/carré et rebond. Idéal pour le mouvement de sprites, les effets raster, le cycle de couleurs ou toute animation pilotée par une table précalculée. S'ouvre via l'icône **Éditeur de courbes** dans la barre d'outils supérieure (à côté du bouton Éditeur SID).

**Courbes : ** Sinus, Cosinus, Linéaire, Ease In/Out/InOut (Quad et Cubique), Ease In/Out (Circ), Triangle, Dent de scie, Carré et Ease In/Out/InOut Bounce.

**Commandes : **
| Contrôle                        | But                                                                                                                                                                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Valeur de début / fin**       | Plage de sortie : 0 à 255 en mode 8 bits, 0 à 320 en mode 16 bits.                                                                                                                                                            |
| **Nombre de valeurs**           | Longueur du tableau : 4 à 512 entrées.                                                                                                                                                                                        |
| **Cycles**                      | Nombre d'oscillations sur le tableau (sinus/cosinus/triangle/dent de scie/carré uniquement). Accepte les fractions (ex. : `3,625`).                                                                                           |
| **Phase**                       | Décalage de phase en degrés (sinus/cosinus uniquement).                                                                                                                                                                       |
| **Combiner la deuxième courbe** | Fusionnez une seconde courbe avec **Mixer / Ajouter / Multiplier / Min / Max / Soustraire**, ses propres cycles/phases et une quantité de mélange. Les deux courbes sources sont représentées en pointillés sur le graphique. |
| **Étiquette**                   | Étiquette du tableau (suggestion automatique à partir du nom de la courbe).                                                                                                                                                   |
| **Format de nombre**            | `$XX` hexadécimal ou décimal.                                                                                                                                                                                                 |
| **Valeurs par ligne**           | 8 / 16 / 32 octets par ligne `.byte`.                                                                                                                                                                                         |

**Modes de sortie : **
| Mode        | Émet                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **8 bits**  | Une seule table `.byte` (valeurs 0..255). Lecture avec `LDX #index / LDA table,X`. Émet éventuellement une routine de lecture sprite-Y **** (`<label>_set_y`) — `LDA <label>,X` / `STA $D001+2N` — pour un numéro de sprite sélectionnable de 0 à 7.                                                                                                                                                                                                                                    |
| **16 bits** | Deux tables d'octets parallèles — `<label>_lo` (8 bits de poids faible) et `<label>_hi` (9e bit, 0/1) — indexées par le même X **** (2 octets par entrée). Nécessaires pour le X du sprite sur tout l'écran (0..320 > un octet). Émet éventuellement une routine de lecture du X du sprite **** (`<label>_set_x`) qui écrit l'octet de poids faible dans `$D000+2N` et positionne/efface le bit de poids fort du sprite dans `$D010`, pour un numéro de sprite sélectionnable de 0 à 7. |

Chaque sortie Copie / Insertion commence par un commentaire d'en-tête documentant la courbe, la plage min/max réelle, le nombre d'entrées et l'utilisation exacte (qui enregistrent chaque flux de table).

**Aperçu : **
- Graphique **** — la courbe tracée avec la valeur 0 en haut **** et la valeur maximale en bas ****, conformément à la convention sprite-Y/raster du C64 (ce que vous voyez correspond donc à ce que le tableau génère sur le matériel). Une ligne méta sous le graphique indique le nombre d'octets, les valeurs minimales et maximales réelles générées, ainsi que le ou les noms de la courbe.
- **Balle rebondissante** — anime un marqueur sur la table au **Tempo** (5 à 240 valeurs/s). À un tempo de 50, cela correspond à une valeur par image sur PAL (50 Hz), soit une étape `.wait_raster` par index. Boutons Lecture/Pause et Redémarrer, un fondu enchaîné des ~24 dernières positions et un affichage en temps réel de l'`Index · Valeur`.

**Copier / Insérer : ** les deux icônes de la barre d’outils — **Copier ** place le tableau dans le presse-papiers ; **Insérer dans l’éditeur ** ajoute le tableau (et le lecteur, s’il est activé) sous forme de blocs au programme actuel. La réinsertion ** remplace ** l’insertion précédente dans l’éditeur de courbes au lieu d’empiler les doublons (fonctionne en mode Bloc et Expert).

**Menu Fichiers : **
| Action                            | Ce que cela fait                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Enregistrer la courbe (.bin)…** | Enregistre les octets bruts de la table exactement comme le C64 les lirait via `INCBIN`. 16 bits : N octets de poids faible suivis de N octets de poids fort.                                                                                                                                                                                                                                                                                  |
| **Courbe de charge (.bin)…**      | Charge les octets bruts de la table dans l'éditeur, interprétés selon la profondeur de bits actuelle (16 bits : première moitié à niveau bas, seconde moitié à niveau haut). La table chargée est affichée telle quelle jusqu'à ce qu'une nouvelle courbe soit régénérée par une commande de courbe.                                                                                                                                           |
| **Exporter la démo en blocs**     | Ajoute une démo complète et fonctionnelle de sprite : initialisation du sprite, boucle principale synchronisée au raster, table intégrée et données du sprite de la balle. L’axe X balaie la plage de 0 à 320 en virgule fixe 8,8 avec le bit de poids fort `$D010`, tandis que la table pilote l’axe Y du sprite, correspondant exactement à l’aperçu de l’éditeur. La réexportation remplace l’insertion précédente de l’éditeur de courbes. |

**Reproduire l'aperçu sur C64 : ** l'aperçu lit la table **linéairement, en bouclant 0 → N-1 → 0, une valeur par image**. Pour le reproduire exactement, parcourez la table de la même manière (incrémentez l'index une fois par image, retour à la fin de la table). Une lecture en ping-pong ou partielle se déplacera différemment même si les valeurs des octets sont identiques. Voir `samples/curve-new-demo.asm` pour un exemple fonctionnel de sprite-X 16 bits.

---


*© 2026 Zsolt Tarczali — Assembleur visuel C64*
