// Petits éléments de mise en forme pour écrire les fiches (sans bibliothèque de formules : HTML/SVG seulement).
// Quatre registres à couvrir dans chaque fiche : définitions, équations, données chiffrées, schéma ou méthode.

// Équation mise en forme : bloc centré, lisible à l'écran et à l'impression
export const Eq = ({ children, legende }) => (
  <div className="fiche-eq">
    <div className="fiche-eq-formule">{children}</div>
    {legende && <div className="fiche-eq-legende">{legende}</div>}
  </div>
);
// Variable en italique, avec indice facultatif : <V s="P" i="élec" />
export const V = ({ s, i }) => <i>{s}{i && <sub>{i}</sub>}</i>;
// Définition : terme en gras + sens
export const Def = ({ terme, children }) => <p className="fiche-def"><b>{terme}</b> : {children}</p>;
// Dans un texte simple, « P_hyd » devient P avec l'indice « hyd » (écriture courte pour les tableaux)
const avecIndicesTexte = t => typeof t !== 'string' ? t : t.split(/([A-Za-zηΔ]_[A-Za-zé0-9]+)/).map((m, k) => /^[A-Za-zηΔ]_/.test(m) ? <span key={k}>{m[0]}<sub>{m.slice(2)}</sub></span> : m);
// Valeurs chiffrées : petit tableau [[libellé, valeur], …]
export const Donnees = ({ lignes }) => (
  <table className="fiche-donnees"><tbody>
    {lignes.map(([a, b]) => <tr key={a}><th scope="row">{avecIndicesTexte(a)}</th><td>{avecIndicesTexte(b)}</td></tr>)}
  </tbody></table>
);
// Méthode : liste numérotée courte
export const Methode = ({ etapes }) => <ol className="fiche-methode">{etapes.map((e, k) => <li key={k}>{avecIndicesTexte(e)}</li>)}</ol>;
// Mémo : phrase à retenir, mise en valeur
export const Retenir = ({ children }) => <p className="fiche-retenir">{children}</p>;

// Schéma d'une chaîne de conversion : cases reliées par des flèches, pertes en rouge sous la case concernée.
// boites = [{ nom, forme }] ; fleches = [texte entre deux cases] ; pertes = [texte | ''] (une par case)
// HTML (et non SVG) : le texte reste lisible sur mobile (les cases passent à la verticale) et à l'impression.
export function Chaine({ boites, fleches = [], pertes = [], couleur = '#ea580c', titre }) {
  return (
    <div className="fiche-chaine" role="img" aria-label={titre || 'Chaîne de conversion d’énergie'} style={{ '--c': couleur }}>
      {boites.map((b, k) => (
        <span key={k} style={{ display: 'contents' }}>
          <div className="fiche-chaine-boite"><b>{b.nom}</b><span>{b.forme}</span>{pertes[k] && <em className="fiche-chaine-perte">↓ {pertes[k]}</em>}</div>
          {k < boites.length - 1 && <div className="fiche-chaine-fleche">{fleches[k]}</div>}
        </span>))}
    </div>
  );
}

// Schéma d'une cellule Li-ion en décharge : ions Li⁺ à travers le séparateur, électrons par le circuit extérieur.
export function SchemaCellule() {
  const t = (x, y, s, o = {}) => <text x={x} y={y} textAnchor="middle" fontSize={o.f || 13} fontWeight={o.w || 700} fill={o.c || '#0c1a2e'} fontFamily="Nunito, sans-serif">{s}</text>;
  return (
    <svg className="fiche-schema" viewBox="0 0 440 205" role="img" aria-label="Cellule lithium-ion en décharge : les ions Li+ traversent le séparateur de l'électrode négative vers l'électrode positive, les électrons passent par le circuit extérieur" width="100%" style={{ maxWidth: 440 }}>
      <defs><marker id="pt" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#334155" /></marker></defs>
      <rect x="20" y="62" width="120" height="100" rx="10" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
      <rect x="300" y="62" width="120" height="100" rx="10" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
      <rect x="205" y="62" width="30" height="100" fill="#fff" stroke="#64748b" strokeDasharray="4 3" strokeWidth="2" />
      {t(80, 100, 'Électrode −')}{t(80, 118, 'graphite', { w: 600, f: 12 })}{t(80, 136, 'Li dans C₆', { w: 600, f: 12 })}
      {t(360, 100, 'Électrode +')}{t(360, 118, 'oxyde NMC', { w: 600, f: 12 })}{t(360, 136, 'Li dans l’oxyde', { w: 600, f: 12 })}
      {t(220, 182, 'séparateur', { w: 600, f: 12 })}{t(220, 198, '(laisse passer les ions)', { w: 600, f: 11, c: '#475569' })}
      <line x1="150" y1="112" x2="290" y2="112" stroke="#16a34a" strokeWidth="3" markerEnd="url(#pt)" />
      {t(220, 104, 'Li⁺', { c: '#15803d', f: 15 })}{t(220, 56, 'ions Li⁺ (décharge)', { f: 12, c: '#15803d', w: 700 })}
      <path d="M80 62 V22 H360 V62" fill="none" stroke="#ea580c" strokeWidth="3" markerEnd="url(#pt)" />
      {t(220, 16, 'électrons e⁻ → lampe', { c: '#c2410c', f: 13 })}
    </svg>
  );
}
