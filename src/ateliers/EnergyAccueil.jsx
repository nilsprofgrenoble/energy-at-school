import { cardStyle, KIT, styleBoite } from "../commun";

// ====================================================
// ENERGY@SCHOOL — PAGE D'ENTRÉE
// Vue d'ensemble de la journée et accès aux six pages d'ateliers (liens ?atelier=…).
// ====================================================

const THEMES = [
  { nom: 'Produire', icone: '🌊', couleur: '#0284c7', question: 'Comment transformer l’énergie de l’eau en électricité ?',
    pages: [
      { id: 'production-1', nom: 'Production 1 · Turbine Pelton', texte: 'Une conduite forcée, une turbine Pelton et un alternateur : puissance de l’eau, puissance électrique, rendement, oscilloscope.' },
      { id: 'production-2', nom: 'Production 2 · Banc Pelton', texte: 'Une vraie turbine de laboratoire, freinée pour mesurer sa puissance mécanique et trouver sa vitesse optimale.' },
      { id: 'production-3', nom: 'Production 3 · Au fil de l’eau', texte: 'Un canal et une roue à aubes : débit mesuré à la balance, puissance de l’eau, alternateur triphasé.' },
    ] },
  { nom: 'Transporter', icone: '🗼', couleur: '#7c3aed', question: 'Comment amener l’électricité jusqu’aux maisons en perdant le moins possible ?',
    pages: [
      { id: 'transport', nom: 'Transport · Réseau électrique', texte: 'Transformateurs et câbles : pourquoi on transporte l’électricité sous haute tension.' },
    ] },
  { nom: 'Stocker et restituer', icone: '🔋', couleur: '#2563eb', question: 'Comment garder l’énergie électrique pour plus tard, puis la rendre quand on en a besoin ?',
    pages: [
      { id: 'stockage', nom: 'Stocker 1 · Batteries', texte: 'L’énergie stockée sous forme chimique dans une batterie lithium-ion, puis assembler des cellules pour un téléphone ou une voiture.' },
      { id: 'hydrogene', nom: 'Stocker 2 · Hydrogène', texte: 'L’électricité transformée en dihydrogène par électrolyse, puis le dihydrogène retransformé en électricité par une pile à combustible.' },
    ] },
];

export function EnergyAccueil() {
  const { txt: TXT, txt2: TXT2 } = KIT;
  const chaine = (
    <svg viewBox="0 0 640 120" role="img" aria-label="La chaîne de l'énergie : produire, transporter, stocker et restituer"
      style={{ width: '100%', height: 'auto', display: 'block' }}>
      {THEMES.map((t, k) => {
        const n = THEMES.length, ecart = 34, w = (616 - (n - 1) * ecart) / n, x = 12 + k * (w + ecart);
        return (
          <g key={t.nom}>
            <rect x={x} y="14" width={w} height="86" rx="12" fill="white" stroke={t.couleur} strokeWidth="3"/>
            <text x={x + w / 2} y="52" fontSize="30" textAnchor="middle">{t.icone}{t.nom.startsWith('Stocker') ? '💧' : ''}</text>
            <text x={x + w / 2} y="84" fontSize={t.nom.length > 12 ? 14.5 : 17} fontWeight="800" fill={t.couleur} textAnchor="middle">{t.nom}</text>
            {k < n - 1 && (
              <g>
                <line x1={x + w + 3} y1="57" x2={x + w + ecart - 6} y2="57" stroke={TXT2} strokeWidth="3"/>
                <polygon points={`${x + w + ecart - 10},50 ${x + w + ecart - 2},57 ${x + w + ecart - 10},64`} fill={TXT2}/>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
  return (
    <div style={{ ...cardStyle, textAlign: 'left' }}>
      <h2 style={{ margin: '0 0 6px', fontSize: 22, color: TXT }}>Energy@School · Préparer la journée à l'ENSE3</h2>
      <p style={{ fontSize: 15.5, color: TXT, lineHeight: 1.6, margin: '0 0 12px' }}>
        Pendant une journée dans les laboratoires de Grenoble INP – Ense³, vous allez découvrir comment on <strong>produit</strong> l'énergie
        électrique, comment on la <strong>transporte</strong>, et comment on la <strong>stocke</strong> pour la <strong>restituer</strong> plus tard,
        dans une batterie ou sous forme d'hydrogène.
        Chaque élève participe à deux ateliers sur les quatre. Ces pages vous permettent de les préparer avant, et d'y revenir après.
      </p>

      <div style={{ ...styleBoite, marginBottom: 12 }}>
        {chaine}
        <div style={{ fontSize: 14, color: TXT2, lineHeight: 1.55, marginTop: 6 }}>
          Le fil rouge de la journée : à chaque étape, on mesure la puissance reçue et la puissance utile, et on calcule un
          <strong> rendement</strong>. Il n'atteint jamais 100 % : une partie de l'énergie part toujours en chaleur.
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 12 }}>
        {THEMES.map(t => (
          <div key={t.nom} style={{ background: 'white', border: `1.5px solid ${t.couleur}`, borderTop: `6px solid ${t.couleur}`, borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: t.couleur }}>{t.icone} {t.nom}</div>
            <div style={{ fontSize: 14, color: TXT, fontStyle: 'italic', margin: '2px 0 8px' }}>{t.question}</div>
            {t.pages.map(pg => (
              <a key={pg.id} href={`?atelier=${pg.id}`} style={{ display: 'block', textDecoration: 'none', padding: '8px 10px', borderRadius: 8,
                border: '1px solid #e2e8f0', marginBottom: 6, background: '#f8fafc' }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: TXT }}>{pg.nom} ›</div>
                <div style={{ fontSize: 13, color: TXT2, lineHeight: 1.45 }}>{pg.texte}</div>
              </a>
            ))}
          </div>
        ))}
      </div>

      <div style={{ ...styleBoite }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: TXT, marginBottom: 6 }}>Comment utiliser ces pages ?</div>
        <div style={{ fontSize: 14.5, color: TXT, lineHeight: 1.6 }}>
          Chaque page propose trois modes, accessibles à tout moment :
          <ul style={{ margin: '4px 0 8px', paddingLeft: 20 }}>
            <li><strong>🧭 Parcours guidé</strong> : on vous accompagne étape par étape, comme pendant le TP. Commencez par là.</li>
            <li><strong>🔍 Exploration libre</strong> : tous les réglages, pour tester vos propres idées.</li>
            <li><strong>🎯 Défi</strong> : une mission à réussir sans aide.</li>
          </ul>
          <strong>Avant la journée</strong> : faites le parcours guidé des deux ateliers auxquels vous participerez.
          <strong> Après la journée</strong> : revenez explorer, relevez les défis, et découvrez les ateliers que vous n'avez pas faits.
          <div style={{ fontSize: 13, color: TXT2, marginTop: 6 }}>Votre progression dans les parcours est enregistrée sur cet appareil : vous pouvez vous arrêter et reprendre plus tard.</div>
        </div>
      </div>
    </div>
  );
}
