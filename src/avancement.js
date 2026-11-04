// ═══════════════════════════════════════════════════════════════════════════
//  AVANCEMENT ET NIVEAUX D'ENERGY@SCHOOL
//  • Chaque parcours guidé a une clé (celle de son état dans le navigateur, « es1-… »).
//  • Un parcours est TERMINÉ quand l'élève a atteint sa dernière étape. L'ordre n'a aucune importance.
//  • Le niveau ne dépend que du NOMBRE de parcours terminés, jamais de l'ordre ni d'un classement.
//  • Connecté, l'avancement est aussi enregistré sur le serveur (table energy_progres) et suit l'élève d'un appareil à l'autre.
//    Sans compte, tout continue de fonctionner : seul l'enregistrement sur le serveur est absent.
// ═══════════════════════════════════════════════════════════════════════════
import { useSyncExternalStore } from 'react';
import { rest, toutLire, getSession, estEleve } from './serveur';

// Les parcours guidés, regroupés comme dans la journée
export const FAMILLES = [
  { id: 'produire', nom: 'Produire', icone: '🌊', couleur: '#0284c7', badge: 'Producteur·rice', parcours: [
    { cle: 'es1-production1', nom: 'Turbine Pelton', page: 'production-1' },
    { cle: 'es1-production2', nom: 'Banc Pelton', page: 'production-2' },
    { cle: 'es1-production3', nom: 'Au fil de l’eau', page: 'production-3' } ] },
  { id: 'transporter', nom: 'Transporter', icone: '🗼', couleur: '#7c3aed', badge: 'Transporteur·se', parcours: [
    { cle: 'es1-transport-prep', nom: 'Réseau réel (préparer)', page: 'transport' },
    { cle: 'es1-transport', nom: 'Transformateur et câble (revoir)', page: 'transport' } ] },
  { id: 'stocker', nom: 'Stocker et restituer', icone: '🔋', couleur: '#2563eb', badge: 'Stockeur·se', parcours: [
    { cle: 'es1-stockage-a1', nom: 'Batteries, atelier 1', page: 'stockage' },
    { cle: 'es1-stockage-a2', nom: 'Batteries, atelier 2', page: 'stockage' },
    { cle: 'es1-hydrogene-a1', nom: 'Hydrogène, atelier 1', page: 'hydrogene' },
    { cle: 'es1-hydrogene-a2', nom: 'Hydrogène, atelier 2', page: 'hydrogene' } ] },
];
export const TOUS_PARCOURS = FAMILLES.flatMap(f => f.parcours.map(p => ({ ...p, famille: f.id })));

// Niveaux : seuil = nombre de parcours terminés
export const NIVEAUX = [
  { seuil: 0, nom: 'Étincelle', icone: '✨' },
  { seuil: 1, nom: 'Courant', icone: '🔌' },
  { seuil: 3, nom: 'Tension', icone: '⚡' },
  { seuil: 5, nom: 'Puissance', icone: '💪' },
  { seuil: 7, nom: 'Rendement', icone: '📊' },
  { seuil: 9, nom: 'Centrale', icone: '🏭' },
];
export const termine = p => !!p && p.etape >= p.total - 1 && p.total > 1;
// « suivi » : { cle: { etape, total, reussies } }
export function bilan(suivi) {
  const faits = TOUS_PARCOURS.filter(p => termine(suivi[p.cle])).length;
  let k = 0; NIVEAUX.forEach((n, i) => { if (faits >= n.seuil) k = i; });
  const suivant = NIVEAUX[k + 1] || null;
  const badges = FAMILLES.filter(f => f.parcours.every(p => termine(suivi[p.cle])));
  return { faits, total: TOUS_PARCOURS.length, niveau: NIVEAUX[k], indice: k, suivant, badges };
}

// ── Avancement connu de cet appareil (état « es1-… » des parcours) ──
const PREFIXE_LOCAL = 'es-avancement-v1';
function lireLocal() { try { return JSON.parse(window.localStorage.getItem(PREFIXE_LOCAL) || '{}'); } catch { return {}; } }
let suiviLocal = typeof window !== 'undefined' ? lireLocal() : {};
const abonnes = new Set();
const notifier = () => abonnes.forEach(f => f());
export const useSuivi = () => useSyncExternalStore(f => { abonnes.add(f); return () => abonnes.delete(f); }, () => suiviLocal, () => suiviLocal);
const plus = (a, b) => ({ etape: Math.max(a?.etape || 0, b?.etape || 0), total: Math.max(a?.total || 1, b?.total || 1), reussies: Math.max(a?.reussies || 0, b?.reussies || 0) });
function fusionner(cle, v) {
  const nouveau = plus(suiviLocal[cle], v);
  const p = suiviLocal[cle];
  if (p && p.etape === nouveau.etape && p.total === nouveau.total && p.reussies === nouveau.reussies) return false;
  suiviLocal = { ...suiviLocal, [cle]: nouveau };
  try { window.localStorage.setItem(PREFIXE_LOCAL, JSON.stringify(suiviLocal)); } catch { /* stockage indisponible */ }
  notifier();
  return true;
}

// ── Envoi au serveur (regroupé : un envoi toutes les 2 s au plus) ──
let enAttente = {}, minuteur = null;
async function envoyer() {
  minuteur = null;
  const s = getSession();
  const lot = enAttente; enAttente = {};
  if (!estEleve(s)) return;
  const lignes = Object.entries(lot).map(([cle, v]) => ({ cle, etape: v.etape, total: v.total, reussies: v.reussies }));
  if (!lignes.length) return;
  try {
    await rest('energy_progres?on_conflict=user_id,cle', { method: 'POST', corps: lignes, entetes: { Prefer: 'resolution=merge-duplicates,return=minimal' } });
  } catch { /* serveur indisponible ou script SQL 11 pas appliqué : l'avancement reste sur l'appareil, renvoyé à la prochaine occasion */
    for (const l of lignes) enAttente[l.cle] = plus(enAttente[l.cle], l);
  }
}
// Appelé par les cartes de parcours à chaque changement d'étape
export function signaler(cle, etape, total, reussies) {
  if (!cle) return;
  if (!fusionner(cle, { etape, total, reussies })) return;
  if (!estEleve(getSession())) return;
  enAttente[cle] = plus(enAttente[cle], { etape, total, reussies });
  if (!minuteur) minuteur = setTimeout(envoyer, 2000);
}
// À la connexion : reprendre ce que le serveur connaît, et lui envoyer ce que cet appareil a de plus avancé
export async function synchroniser() {
  if (!estEleve(getSession())) return;
  try {
    const dist = await rest('energy_progres?select=cle,etape,total,reussies');
    dist.forEach(l => fusionner(l.cle, l));
    for (const [cle, v] of Object.entries(suiviLocal)) enAttente[cle] = plus(enAttente[cle], v);
    await envoyer();
  } catch { /* hors ligne ou script SQL 11 absent : on garde l'avancement de l'appareil */ }
}
// Quand l'élève se déconnecte, l'avancement de cet appareil ne doit pas passer au suivant
export function oublierLocal() {
  suiviLocal = {}; enAttente = {};
  try { window.localStorage.removeItem(PREFIXE_LOCAL); } catch { /* indisponible */ }
  try { Object.keys(window.localStorage).filter(k => k.startsWith('es1-')).forEach(k => window.localStorage.removeItem(k)); } catch { /* indisponible */ }
  notifier();
}
export { toutLire };
