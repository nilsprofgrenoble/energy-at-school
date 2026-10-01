# Energy@School · Simulations

Simulations interactives pour préparer la journée Energy@School à Grenoble INP – Ense³, et y revenir ensuite :
production (turbines Pelton, roue au fil de l'eau), transport (transformateurs et lignes), stockage (batteries)
et hydrogène (électrolyse, pile à combustible).

Site : https://nilsprofgrenoble.github.io/energy-at-school/

## Organisation du code

- `src/App.jsx` : en-tête, menu des ateliers, pied de page. La liste `PAGES` définit les pages et leurs adresses.
- `src/ateliers/` : une page par atelier, plus la page de présentation.
- `src/commun.jsx` : éléments partagés (graphiques, carte du parcours guidé, mémorisation de la progression…).

## Travailler en local

```
npm install      (une seule fois, ou après une mise à jour des dépendances)
npm run dev      puis ouvrir http://localhost:5173/energy-at-school/
```

## Publier

```
git add .
git commit -m "description de la modification"
git push
```

La publication sur GitHub Pages se fait automatiquement (onglet Actions du dépôt, une à trois minutes).

## Licence

© Nils Aronssohn — Lycée Argouges, Grenoble. CC BY-NC-ND 4.0 : voir le fichier LICENSE.
