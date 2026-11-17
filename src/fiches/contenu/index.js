// Registre des fiches « À retenir » : une liste de cartes par atelier (slug de la page).
// Une carte : { id, titre, corps (JSX), synthese? }. Écrire d'abord le contenu, puis l'ajouter ici.
// L'onglet « Fiche » d'un atelier n'apparaît que s'il a au moins une carte (on ne promet jamais une fiche absente).
import { production1 } from './production1';
import { production2 } from './production2';
import { production3 } from './production3';
import { transport } from './transport';
import { stockage } from './stockage';
import { hydrogene } from './hydrogene';

export const FICHES = {
  'production-1': production1,
  'production-2': production2,
  'production-3': production3,
  'transport': transport,
  'stockage': stockage,
  'hydrogene': hydrogene,
};
export const aFiche = page => (FICHES[page] || []).length > 0;
