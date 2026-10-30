---
id: 05
title: Le joueur perd un combat, voit l'écran Daronned et perd l'xp du combat
milestone: 02-combat
depends_on: ["01"]
design: null
tracker: null
---

## Ce que l'utilisateur fait
Je perds un combat, je vois l'écran Daronned, et je perds l'xp de ce combat.

## Ce qu'il voit
Pas encore dessiné. D'après `.veebee/style.md` : L'écran Daronned à la place de Game Over, écrit comme un prospectus de supermarché.

## C'est fini quand
- [ ] Le joueur peut perdre un combat.
- [ ] Une défaite affiche l'écran Daronned, jamais Game Over.
- [ ] Après un Daronned, l'xp gagnée pendant ce combat est perdue, et l'xp d'avant reste.
- [ ] Le joueur peut reprendre après l'écran Daronned.
- [ ] Perdre deux fois de suite affiche Daronned à chaque fois.

## Les règles
- Quand le joueur échoue ou meurt, l'écran affiche Daronned au lieu de Game Over.
- Combat perdu : le héros perd l'xp du combat.
- Un combat est perdu quand les points de vie du héros tombent à zéro.

## Hors ticket
- Le Daronned d'un plat immangeable : ticket 07
