---
id: 07
title: Un plat immangeable met le joueur Daronned et lui fait recommencer le chapitre
milestone: 03-cuisine
depends_on: ["05", "06"]
design: null
tracker: null
---

## Ce que l'utilisateur fait
Je rate complètement mon plat, je me fais Daronned, et je recommence le chapitre.

## Ce qu'il voit
Pas encore dessiné. D'après `.veebee/style.md` : L'écran Daronned, puis le début du chapitre.

## C'est fini quand
- [ ] Des timings très ratés rendent le plat immangeable.
- [ ] Un plat immangeable affiche l'écran Daronned.
- [ ] Le joueur repart au début du chapitre.
- [ ] Le joueur voit la différence entre un plat recadré et un plat immangeable.
- [ ] Recommencer le chapitre deux fois de suite ne bloque pas le joueur.

## Les règles
- Quand le joueur échoue ou meurt, l'écran affiche Daronned au lieu de Game Over.
- Plat immangeable : le héros recommence le chapitre.

## Hors ticket
- Le Daronned d'un combat perdu : ticket 05
