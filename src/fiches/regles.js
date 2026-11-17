// ═══════════════════════════════════════════════════════════════════════════
//  RÈGLES DES FICHES « À RETENIR » (logique pure, sans affichage)
//  • Une fiche par atelier (page). Elle est débloquée quand un parcours guidé de la page est terminé
//    OU quand le défi de la page est relevé (mêmes critères que les points : termine() d'avancement.js).
//  • Le déblocage s'appuie sur l'avancement déjà gardé sur l'appareil et, avec un compte, synchronisé sur le
//    serveur (energy_progres) : aucune table supplémentaire, la fiche se retrouve donc sur tous les appareils.
//  • Une fiche n'est jamais « perdue » : l'avancement ne régresse pas (voir avancement.js).
// ═══════════════════════════════════════════════════════════════════════════
import { FAMILLES, DEFIS, TOUS_PARCOURS, termine } from '../avancement';

// Les ateliers, dans l'ordre de la journée, avec leur famille (pour ranger « Mes fiches » par thème)
export const ATELIERS = FAMILLES.flatMap(f => DEFIS.filter(d => d.famille === f.id).map(d => ({ page: d.page, nom: d.nom, famille: f })));

export function ficheDebloquee(page, suivi) {
  const parcours = TOUS_PARCOURS.some(p => p.page === page && termine(suivi[p.cle]));
  const defi = DEFIS.some(d => d.page === page && termine(suivi[d.cle]));
  return parcours || defi;
}
export const nbFichesDebloquees = (pages, suivi) => pages.filter(p => ficheDebloquee(p, suivi)).length;
