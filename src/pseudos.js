// ═══════════════════════════════════════════════════════════════════════════
//  PSEUDOS ENERGY@SCHOOL : deux numéros (adjectif, nom) enregistrés sur le serveur (table energy_pseudos).
//  ⚠️ NE JAMAIS retirer ni réordonner un élément des deux listes : les numéros déjà enregistrés pointeraient
//  vers autre chose. On peut seulement AJOUTER à la fin (64 de chaque au maximum).
// ═══════════════════════════════════════════════════════════════════════════

// [masculin, féminin]
export const ADJECTIFS = [
  ['Curieux', 'Curieuse'], ['Rapide', 'Rapide'], ['Malin', 'Maligne'], ['Brillant', 'Brillante'], ['Lumineux', 'Lumineuse'],
  ['Vif', 'Vive'], ['Audacieux', 'Audacieuse'], ['Patient', 'Patiente'], ['Rusé', 'Rusée'], ['Joyeux', 'Joyeuse'],
  ['Tenace', 'Tenace'], ['Stable', 'Stable'], ['Précis', 'Précise'], ['Rayonnant', 'Rayonnante'], ['Puissant', 'Puissante'],
  ['Magnétique', 'Magnétique'], ['Fluide', 'Fluide'], ['Électrique', 'Électrique'], ['Solide', 'Solide'], ['Dynamique', 'Dynamique'],
  ['Agile', 'Agile'], ['Persévérant', 'Persévérante'], ['Inventif', 'Inventive'], ['Vaillant', 'Vaillante'], ['Efficace', 'Efficace'],
  ['Endurant', 'Endurante'], ['Silencieux', 'Silencieuse'], ['Économe', 'Économe'], ['Fiable', 'Fiable'], ['Constant', 'Constante'],
  ['Vigoureux', 'Vigoureuse'], ['Infatigable', 'Infatigable'], ['Costaud', 'Costaude'], ['Futé', 'Futée'], ['Courageux', 'Courageuse'],
  ['Intrépide', 'Intrépide'], ['Zen', 'Zen'], ['Fougueux', 'Fougueuse'], ['Téméraire', 'Téméraire'], ['Sage', 'Sage'],
  ['Fier', 'Fière'], ['Chanceux', 'Chanceuse'], ['Débrouillard', 'Débrouillarde'], ['Légendaire', 'Légendaire'], ['Éclatant', 'Éclatante'],
  ['Savant', 'Savante'], ['Pétillant', 'Pétillante'], ['Radieux', 'Radieuse'], ['Studieux', 'Studieuse'], ['Bondissant', 'Bondissante'],
  ['Malicieux', 'Malicieuse'], ['Sobre', 'Sobre'], ['Alerte', 'Alerte'], ['Joueur', 'Joueuse'], ['Enjoué', 'Enjouée'],
];
// [nom, genre, pictogramme]
export const NOMS = [
  ['Turbine', 'f', '🌀'], ['Alternateur', 'm', '🔄'], ['Auget', 'm', '🥄'], ['Barrage', 'm', '🏞️'], ['Conduite', 'f', '🚰'], ['Roue', 'f', '🎡'],
  ['Éolienne', 'f', '🌬️'], ['Soleil', 'm', '☀️'], ['Transformateur', 'm', '🔌'], ['Pylône', 'm', '🗼'], ['Câble', 'm', '🧵'], ['Ligne', 'f', '📈'],
  ['Disjoncteur', 'm', '🔘'], ['Prise', 'f', '🔌'], ['Watt', 'm', '💡'], ['Joule', 'm', '⚡'], ['Volt', 'm', '🔋'], ['Ampère', 'm', '🔆'],
  ['Ohm', 'm', '🔶'], ['Pile', 'f', '🔋'], ['Batterie', 'f', '🔋'], ['Cellule', 'f', '🧫'], ['Accumulateur', 'm', '🔁'], ['Électrolyseur', 'm', '💧'],
  ['Dihydrogène', 'm', '🎈'], ['Électrode', 'f', '🔌'], ['Membrane', 'f', '🧪'], ['Ion', 'm', '✨'], ['Électron', 'm', '⚡'], ['Lithium', 'm', '🔋'],
  ['Condensateur', 'm', '🔹'], ['Bobine', 'f', '🧲'], ['Aimant', 'm', '🧲'], ['Rotor', 'm', '🔄'], ['Stator', 'm', '⭕'], ['Générateur', 'm', '⚙️'],
  ['Réseau', 'm', '🕸️'], ['Centrale', 'f', '🏭'], ['Rendement', 'm', '📊'], ['Puissance', 'f', '💪'], ['Énergie', 'f', '⚡'], ['Étincelle', 'f', '🎇'],
  ['Courant', 'm', '🌊'], ['Circuit', 'm', '🔁'], ['Fusible', 'm', '🧯'], ['Interrupteur', 'm', '🎚️'], ['Ampoule', 'f', '💡'], ['Moulin', 'm', '🌾'],
  ['Cascade', 'f', '💦'], ['Torrent', 'm', '🏔️'],
];

export const pseudoValide = (adj, nom) => Number.isInteger(adj) && Number.isInteger(nom) && adj >= 0 && adj < ADJECTIFS.length && nom >= 0 && nom < NOMS.length;
export function pseudo(adj, nom) {
  if (!pseudoValide(adj, nom)) return { texte: 'Anonyme', icone: '❔' };
  const [n, genre, icone] = NOMS[nom];
  return { texte: `${n} ${ADJECTIFS[adj][genre === 'f' ? 1 : 0]}`, icone };
}
// Quelques propositions au hasard, sans doublon
export function propositions(n = 4, alea = Math.random, exclure = []) {
  const vus = new Set(exclure.map(([a, b]) => `${a}-${b}`)), L = [];
  while (L.length < n) {
    const a = Math.floor(alea() * ADJECTIFS.length), b = Math.floor(alea() * NOMS.length), k = `${a}-${b}`;
    if (!vus.has(k)) { vus.add(k); L.push([a, b]); }
  }
  return L;
}
