// ═════════════════════════════════════════════════════════════════
//  CLASSEMENT PUBLIC D'ENERGY@SCHOOL : logique pure (sans React ni réseau).
//  Les scores sont calculés par le serveur (fonction « classement_public_energy », supabase/18-classement-energy.sql
//  dans le dépôt simulations-chimie) avec les mêmes règles que avancement.js : 1 point par parcours terminé, 1 par défi relevé.
//  Seuls les élèves qui l'ont choisi apparaissent : pseudo (liste fixe de pseudos.js), établissement, classe et score.
//  Ce classement est SÉPARÉ de celui de la Paillasse virtuelle.
// ═════════════════════════════════════════════════════════════════

// Les lames (classements), dans l'ordre où on les fait défiler. « code » = clé renvoyée par le serveur.
export const LAMES = [
  { code: 'points', titre: 'Points', icone: '⚡', unite: ['point', 'points'], couleur: '#c2410c', fond: '#ffedd5',
    sous: 'Un point par parcours terminé et un point par défi relevé : 15 points au maximum.' },
  { code: 'defis', titre: 'Défis relevés', icone: '🎯', unite: ['défi', 'défis'], couleur: '#be185d', fond: '#fce7f3',
    sous: 'Nombre de défis réussis en entier : 6 au maximum.' },
  { code: 'semaine', titre: 'Cette semaine', icone: '🔥', unite: ['point', 'points'], couleur: '#0f766e', fond: '#ccfbf1',
    sous: 'Parcours terminés et défis relevés depuis lundi. Le classement repart de zéro chaque lundi : tout le monde peut y entrer !' },
];

export const libelleScore = (lame, n) => `${n} ${n > 1 ? lame.unite[1] : lame.unite[0]}`;
export const medaille = rang => (rang === 1 ? 'or' : rang === 2 ? 'argent' : rang === 3 ? 'bronze' : null);

// Une ligne du classement est-elle celle de l'élève connecté ? moi = { adj, nom, classe, etab } (ou null)
export const estMoi = (ligne, moi) => !!moi && ligne.adj === moi.adj && ligne.nom === moi.nom && ligne.classe === moi.classe && ligne.etab === (moi.etab || '').trim();

// Lignes d'une lame, telles que renvoyées par le serveur (jamais plus de 30), tableau vide si rien
export const lignesDe = (donnees, code) => (Array.isArray(donnees?.lames?.[code]) ? donnees.lames[code] : []);

// Lundi de la semaine en cours, pour l'affichage (« depuis lundi 16 novembre »)
export const jourLundi = donnees => {
  const d = donnees?.lundi ? new Date(donnees.lundi) : null;
  return d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : '';
};
