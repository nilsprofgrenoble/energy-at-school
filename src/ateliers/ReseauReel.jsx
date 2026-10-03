import { useState } from "react";
import { fmt, CarteParcours, Cadre, useEtatPersistant, KIT, styleBouton, stylePetitBouton, styleBoite,
  Section, LigneMesure } from "../commun";

// ====================================================
// TRANSPORT · PARCOURS « PRÉPARER L'ATELIER » : UN VRAI RÉSEAU
// Une centrale fournit 1 MW à une ville située à 20 km. Même méthode que le jour J sur la maquette
// (I = P / U, R = ρL/S, P_J = R·I², rendement), mais avec les ordres de grandeur d'un vrai réseau.
// Modèle simplifié : deux conducteurs en aluminium (aller et retour), pertes calculées avec I = P / U.
// ====================================================

const P_CENTRALE = 1e6;          // W
const L_KM = 20;                 // km entre la centrale et la ville
const RHO_AL = 2.8e-8;           // Ω·m, aluminium
const MV_AL = 2700;              // kg/m³
const TENSIONS = [{ U: 400, nom: '400 V' }, { U: 20000, nom: '20 kV' }, { U: 400000, nom: '400 kV' }];
const SECTIONS = [50, 150, 300, 600];   // mm²

export function reseau(U, S) {
  const I = P_CENTRALE / U;
  const R = RHO_AL * 2 * L_KM * 1000 / (S * 1e-6);
  const PJ = R * I * I;
  return { I, R, PJ, eta: 1 - PJ / P_CENTRALE, possible: PJ < 0.5 * P_CENTRALE, dU: R * I, masse: MV_AL * 2 * L_KM * 1000 * S * 1e-6 };
}
const puissance = W => (W >= 1e6 ? `${fmt(W / 1e6, W >= 1e7 ? 0 : 1)} MW` : W >= 1e3 ? `${fmt(W / 1e3, W >= 1e4 ? 1 : 2)} kW` : `${fmt(W, W >= 10 ? 0 : 1)} W`);

export function ParcoursReseauReel({ fin }) {
  const [guide, setGuide] = useEtatPersistant('es1-transport-prep', { etape: 0, reps: {}, verifs: {}, reussies: {} });
  const [U, setU] = useState(20000);
  const [S, setS] = useState(150);
  const [ouverts, setOuverts] = useState({ commandes: true, mesures: true });
  const r = reseau(U, S);
  const r20 = reseau(20000, 150), r400 = reseau(400, 150);
  const etape = guide.etape;

  const ETAPES = [
    { id: 'contexte', titre: 'Alimenter une ville', focus: [],
      texte: <>Une centrale doit fournir <strong>P = 1 MW</strong> à une ville située à <strong>20 km</strong>. Le courant fait l'aller et
        le retour dans deux câbles en aluminium : 40 km de câble en tout. Comment perdre le moins d'énergie en route ? Le jour J, vous
        ferez la même étude sur une maquette ; ici, on l'applique à un vrai réseau.</>, tache: null },
    { id: 'joule', titre: 'Pourquoi perd-on de l’énergie ?', focus: ['ligne'],
      texte: <>Les câbles ne sont pas des conducteurs parfaits : ils ont une résistance R.</>,
      tache: { type: 'qcm', q: 'Que devient l’énergie perdue dans les câbles ?', options: ['Elle chauffe les câbles (effet Joule)', 'Elle retourne à la centrale', 'Elle est stockée dans les pylônes'], bonne: 0 } },
    { id: 'I', titre: 'Le courant dans la ligne', focus: ['ligne'],
      texte: <>La ligne est à <strong>U = 20 kV</strong>. La puissance transportée vaut P = U × I.</>,
      tache: { type: 'num', q: 'Intensité du courant dans la ligne I = P / U', unite: 'A', vrai: r20.I, tol: 0.02,
        pieges: [[r20.I * 1000, '20 kV = 20 000 V.'], [20000 / 1e6, 'C’est P / U, et non U / P.']] } },
    { id: 'R', titre: 'La résistance de la ligne', focus: ['ligne'],
      texte: <>Câbles en aluminium (ρ = 2,8 × 10⁻⁸ Ω·m) de section <strong>S = 150 mm²</strong>, sur une longueur totale L = 40 km
        (aller et retour). On a R = ρ × L / S.</>,
      tache: { type: 'num', q: 'Résistance totale de la ligne R', unite: 'Ω', vrai: r20.R, tol: 0.02,
        pieges: [[r20.R / 2, 'Le courant fait l’aller et le retour : L = 2 × 20 km = 40 km.'], [r20.R * 1e6, 'Convertissez S en m² : 1 mm² = 10⁻⁶ m².'], [r20.R / 1e6, 'Convertissez S en m² : 1 mm² = 10⁻⁶ m².']],
        aide: 'Pensez à tout convertir en mètres et en m².' } },
    { id: 'PJ', titre: 'Les pertes par effet Joule', focus: ['ligne'],
      texte: <>La puissance perdue en chaleur dans la ligne vaut P<sub>J</sub> = R × I².</>,
      tache: { type: 'num', q: 'Pertes P_J, en kW', unite: 'kW', vrai: r20.PJ / 1000, tol: 0.02, affiche: v => fmt(v, 1),
        pieges: [[r20.R * r20.I / 1000, 'C’est R × I², avec le courant au carré.'], [r20.PJ, 'La réponse est demandée en kW.']] } },
    { id: 'eta', titre: 'Le rendement du transport', focus: ['ville'],
      texte: <>La ville reçoit P − P<sub>J</sub>. Le rendement du transport vaut η = (P − P<sub>J</sub>) / P.</>,
      tache: { type: 'num', q: 'Rendement du transport, en %', unite: '%', vrai: r20.eta * 100, tol: 0.002, affiche: v => fmt(v, 1),
        pieges: [[r20.PJ / P_CENTRALE * 100, 'C’est la part perdue : le rendement est la part qui arrive.']] } },
    { id: 'bas', titre: 'Et si l’on transportait à 400 V ?', focus: ['transfo1'],
      texte: <>Les commandes sont apparues sous le schéma. Choisissez une tension de ligne de <strong>400 V</strong>, sans changer le câble.</>,
      tache: { type: 'action', ok: U === 400 && S === 150, consigne: U === 400 && S === 150 ? null : 'Choisissez 400 V (câble de 150 mm²).' } },
    { id: 'I400', titre: 'Le courant à 400 V', focus: ['ligne'],
      texte: <>Pour transporter la même puissance, 1 MW, sous une tension 50 fois plus petite…</>,
      tache: { type: 'num', q: 'Intensité du courant à 400 V', unite: 'A', vrai: r400.I, tol: 0.02 } },
    { id: 'absurde', titre: 'Un résultat absurde', focus: ['ville'],
      texte: <>Avec 2500 A, la formule donne des pertes de {puissance(r400.PJ)}, et une chute de tension de {fmt(r400.dU / 1000, 1)} kV dans les câbles.</>,
      tache: { type: 'qcm', q: 'Que signifie ce résultat ?', options: ['C’est impossible : il n’arriverait rien à la ville, la ligne fondrait', 'La ville reçoit plus que prévu', 'Les pertes sont acceptables'], bonne: 0,
        expl: 'Les pertes calculées dépassent de loin la puissance transportée : à basse tension, on ne peut pas transporter 1 MW sur 20 km.' } },
    { id: 'loi', titre: 'La loi à retenir', focus: ['ligne'],
      texte: <>De 400 V à 20 kV, la tension est multipliée par 50, donc le courant est divisé par 50.</>,
      tache: { type: 'qcm', q: 'Par combien les pertes R × I² sont-elles divisées ?', options: ['Par 50', 'Par 2500', 'Par 100'], bonne: 1,
        expl: 'Le courant est au carré : 50² = 2500. Multiplier la tension par k divise les pertes par k².' } },
    { id: 'tht', titre: 'La très haute tension', focus: ['transfo1'],
      texte: <>Passez maintenant à <strong>400 kV</strong>, la tension des grandes lignes du réseau français.</>,
      tache: { type: 'action', ok: U === 400000, consigne: U === 400000 ? `Pertes : ${puissance(r.PJ)}` : 'Choisissez 400 kV.' } },
    { id: 'pourquoi', titre: 'Pourquoi pas 400 kV partout ?', focus: ['transfo2'],
      texte: <>À 400 kV, les pertes deviennent minuscules. Pourtant, la ligne qui arrive dans votre rue est à 20 kV, et votre prise à 230 V.</>,
      tache: { type: 'qcm', q: 'Pourquoi ne pas utiliser la très haute tension partout ?',
        options: ['Il faut de grands pylônes, de grandes distances d’isolement et des transformateurs coûteux, et c’est dangereux', 'La très haute tension ne transporte pas d’énergie', 'Les câbles fondraient'], bonne: 0,
        expl: 'On utilise la très haute tension pour les longues distances, puis des transformateurs abaissent la tension par étapes jusqu’à 230 V.' } },
    { id: 'section', titre: 'Et la section des câbles ?', focus: ['ligne'],
      texte: <>Revenez à <strong>20 kV</strong> et choisissez un câble de <strong>600 mm²</strong>. Regardez les pertes et la masse d'aluminium.</>,
      tache: { type: 'action', ok: U === 20000 && S === 600, consigne: U === 20000 && S === 600 ? null : `Actuel : ${TENSIONS.find(t => t.U === U).nom}, ${S} mm²` } },
    { id: 'compromis', titre: 'Le compromis', focus: ['ligne'],
      texte: <>Avec une section 4 fois plus grande, la résistance est divisée par 4.</>,
      tache: { type: 'qcm', q: 'Pourquoi ne pas prendre des câbles énormes ?', options: ['Il faut 4 fois plus d’aluminium : les câbles coûtent plus cher et sont plus lourds à porter', 'Les pertes augmenteraient', 'Le courant ne passerait plus'], bonne: 0,
        expl: `Ici, ${fmt(reseau(20000, 600).masse / 1000, 0)} tonnes d’aluminium au lieu de ${fmt(r20.masse / 1000, 0)}. Augmenter la tension est bien plus efficace : c’est gratuit en aluminium.` } },
    { id: 'maquette', titre: 'Le jour J, sur la maquette', focus: [],
      texte: <>À l'ENSE3, la maquette a un générateur de 25 V, des câbles de 10 m, et deux transformateurs qui peuvent doubler ou diviser
        par deux la tension.</>,
      tache: { type: 'qcm', q: 'Si le transformateur double la tension de la ligne, les pertes dans les câbles sont…', options: ['divisées par 2', 'divisées par 4', 'multipliées par 2'], bonne: 1,
        expl: 'Même loi : 2² = 4. Sur la maquette, vous verrez aussi que les transformateurs eux-mêmes perdent de l’énergie.' } },
    { id: 'bravo', titre: 'Bravo !', focus: [],
      texte: <>Vous avez la méthode : I = P / U, R = ρL / S, P<sub>J</sub> = R × I², puis le rendement. Vous l'appliquerez le jour J sur la
        maquette. Après l'atelier, le parcours « Revoir l'atelier » reprend les mesures de la maquette.</>, tache: null },
  ];
  const idx = id => ETAPES.findIndex(e => e.id === id);
  const et = ETAPES[Math.min(etape, ETAPES.length - 1)];
  const hl = id => et.focus.includes(id);
  const vu = id => etape >= idx(id);
  const commandesVisibles = vu('bas'), sectionsVisibles = vu('section');
  // Sur le schéma, une valeur n'apparaît qu'après l'étape où l'élève la calcule
  const montreI = U === 400 ? vu('absurde') : vu('R'), montrePJ = vu('eta'), montreRecu = vu('bas');

  // ── Schéma du réseau ──
  const pertesPct = r.possible ? (1 - r.eta) * 100 : 100;
  const chaleur = Math.min(1, pertesPct / 20);                         // couleur de la ligne : du gris au rouge
  const epais = 2 + Math.sqrt(S) / 5;
  const couleurLigne = `rgb(${Math.round(100 + 155 * chaleur)}, ${Math.round(116 * (1 - chaleur))}, ${Math.round(139 * (1 - chaleur))})`;
  const pylone = x => (
    <g key={x}>
      <polyline points={`${x - 14},170 ${x},96 ${x + 14},170`} fill="none" stroke={KIT.txt2} strokeWidth="2"/>
      <line x1={x - 20} y1="104" x2={x + 20} y2="104" stroke={KIT.txt2} strokeWidth="2"/>
      <line x1={x - 8} y1="135" x2={x + 8} y2="135" stroke={KIT.txt2} strokeWidth="1.5"/>
    </g>
  );
  const schema = (
    <svg viewBox="0 0 640 230" role="img" aria-label="Réseau : centrale, transformateurs, ligne de 20 km, ville"
      style={{ width: '100%', height: 'auto', display: 'block', background: 'white', borderRadius: 8, border: `1px solid ${KIT.bord}` }}>
      {/* centrale */}
      <rect x="14" y="110" width="64" height="60" fill="#e2e8f0" stroke={KIT.txt} strokeWidth="2"/>
      <rect x="26" y="78" width="14" height="32" fill="#cbd5e1" stroke={KIT.txt} strokeWidth="1.5"/>
      <text x="46" y="148" fontSize="22" textAnchor="middle">⚡</text>
      <text x="46" y="190" fontSize="13" fontWeight="700" fill={KIT.txt} textAnchor="middle">centrale</text>
      <text x="46" y="206" fontSize="12" fill={KIT.txt2} textAnchor="middle">1 MW</text>
      {/* transformateur élévateur */}
      <circle cx="112" cy="132" r="15" fill="none" stroke={KIT.txt} strokeWidth="2"/><circle cx="128" cy="132" r="15" fill="none" stroke={KIT.txt} strokeWidth="2"/>
      <text x="120" y="172" fontSize="12" fill={KIT.txt} textAnchor="middle">élévateur</text>
      <line x1="78" y1="132" x2="97" y2="132" stroke={KIT.txt} strokeWidth="2"/>
      {/* ligne */}
      {[200, 300, 400].map(pylone)}
      <path d={`M 143 132 Q 172 118 200 104 Q 250 122 300 104 Q 350 122 400 104 Q 450 118 497 132`} fill="none" stroke={couleurLigne} strokeWidth={epais}/>
      <text x="300" y="80" fontSize="14" fontWeight="700" fill={KIT.txt} textAnchor="middle">ligne de 20 km · U = {TENSIONS.find(t => t.U === U).nom}{montreI ? ` · I = ${fmt(r.I, r.I < 10 ? 2 : 0)} A` : ''}</text>
      <text x="300" y="196" fontSize="13" fill={r.possible ? '#b45309' : '#b91c1c'} textAnchor="middle" fontWeight="700">
        {!montrePJ ? 'chaleur perdue : ?' : r.possible ? `chaleur perdue : ${puissance(r.PJ)}` : `pertes calculées : ${puissance(r.PJ)} — impossible !`}</text>
      <text x="300" y="214" fontSize="12" fill={KIT.txt2} textAnchor="middle">câbles en aluminium de {S} mm²</text>
      {/* transformateur abaisseur et ville */}
      <circle cx="512" cy="132" r="15" fill="none" stroke={KIT.txt} strokeWidth="2"/><circle cx="528" cy="132" r="15" fill="none" stroke={KIT.txt} strokeWidth="2"/>
      <text x="520" y="172" fontSize="12" fill={KIT.txt} textAnchor="middle">abaisseur</text>
      <line x1="543" y1="132" x2="560" y2="132" stroke={KIT.txt} strokeWidth="2"/>
      {[[566, 120], [590, 112], [612, 124]].map(([x, y], k) => (
        <g key={k}><rect x={x} y={y} width="20" height={170 - y} fill={r.possible ? '#fde68a' : '#e5e7eb'} stroke={KIT.txt} strokeWidth="1.5"/>
          <polygon points={`${x - 3},${y} ${x + 10},${y - 10} ${x + 23},${y}`} fill="#94a3b8" stroke={KIT.txt} strokeWidth="1"/></g>
      ))}
      <text x="594" y="190" fontSize="13" fontWeight="700" fill={KIT.txt} textAnchor="middle">ville</text>
      <text x="594" y="206" fontSize="12" fill={KIT.txt2} textAnchor="middle">{!montreRecu ? 'reçoit ?' : r.possible ? `reçoit ${puissance(P_CENTRALE - r.PJ)}` : 'ne reçoit rien'}</text>
      <Cadre actif={hl('ligne')} x={140} y={66} w={362} h={156}/>
      <Cadre actif={hl('transfo1')} x={92} y={110} w={56} h={70}/>
      <Cadre actif={hl('transfo2')} x={492} y={110} w={56} h={70}/>
      <Cadre actif={hl('ville')} x={556} y={96} w={80} h={118}/>
    </svg>
  );
  const bilan = (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: KIT.txt, marginBottom: 4 }}>Ce que devient 1 MW</div>
      <div style={{ display: 'flex', height: 26, borderRadius: 6, overflow: 'hidden', border: `1px solid ${KIT.bord}` }}>
        <div style={{ width: `${r.possible ? r.eta * 100 : 0}%`, background: '#16a34a' }}/>
        <div style={{ width: `${r.possible ? (1 - r.eta) * 100 : 100}%`, minWidth: 3, background: '#dc2626' }}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: KIT.txt2, marginTop: 3 }}>
        <span style={{ color: '#15803d', fontWeight: 700 }}>arrive à la ville : {r.possible ? `${fmt(r.eta * 100, r.eta > 0.999 ? 3 : 1)} %` : '0 %'}</span>
        <span style={{ color: '#b91c1c', fontWeight: 700 }}>perdu en chaleur : {r.possible ? `${fmt((1 - r.eta) * 100, (1 - r.eta) < 0.001 ? 4 : 1)} %` : 'tout'}</span>
      </div>
    </div>
  );
  const commandes = (
    <>
      {!commandesVisibles && <div style={{ fontSize: 13, color: KIT.txt2 }}>Les commandes apparaîtront au fil du parcours.</div>}
      {commandesVisibles && <>
        <div style={{ fontSize: 13.5, color: KIT.txt2, fontWeight: 700, marginBottom: 4 }}>Tension de la ligne</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {TENSIONS.map(t => <button key={t.U} onClick={() => setU(t.U)} style={styleBouton(U === t.U, '#7c3aed')}>{t.nom}</button>)}
        </div>
      </>}
      {sectionsVisibles && <>
        <div style={{ fontSize: 13.5, color: KIT.txt2, fontWeight: 700, marginBottom: 4 }}>Section des câbles</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SECTIONS.map(x => <button key={x} onClick={() => setS(x)} style={stylePetitBouton(S === x, '#334155')}>{x} mm²</button>)}
        </div>
      </>}
    </>
  );
  const mesures = (
    <>
      <LigneMesure nom="Puissance de la centrale P" valeur="1 MW"/>
      <LigneMesure nom="Tension de la ligne U" valeur={TENSIONS.find(t => t.U === U).nom}/>
      {/* les valeurs n'apparaissent qu'une fois calculées par l'élève */}
      {vu('absurde') && <>
        <LigneMesure nom="Intensité I = P / U" valeur={`${fmt(r.I, r.I < 10 ? 2 : 0)} A`} couleur="#2563eb"/>
        <LigneMesure nom="Résistance de la ligne R" valeur={`${fmt(r.R, 2)} Ω`}/>
        <LigneMesure nom="Pertes P_J = R × I²" valeur={puissance(r.PJ)} couleur="#dc2626"/>
        <LigneMesure nom="Chute de tension R × I" valeur={r.dU >= 1000 ? `${fmt(r.dU / 1000, 1)} kV` : `${fmt(r.dU, 0)} V`}/>
        <LigneMesure nom="Rendement du transport" valeur={r.possible ? `${fmt(r.eta * 100, r.eta > 0.999 ? 3 : 1)} %` : 'impossible'} couleur="#15803d"/>
      </>}
      {sectionsVisibles && <LigneMesure nom="Masse d'aluminium des câbles" valeur={`${fmt(r.masse / 1000, 0)} t`}/>}
    </>
  );
  return (
    <>
      <div className="tr-l1">
        <div style={styleBoite}>
          <div style={{ fontWeight: 700, fontSize: 15, color: KIT.txt, marginBottom: 6 }}>Un vrai réseau : de la centrale à la ville</div>
          {schema}
          {vu('eta') && bilan}
          <div style={{ fontSize: 13, color: KIT.txt2, marginTop: 6, lineHeight: 1.5 }}>
            L'épaisseur de la ligne suit la section des câbles ; sa couleur vire au rouge quand les pertes augmentent.
            L'élément encadré en orange est celui dont parle l'étape en cours.
          </div>
        </div>
        <CarteParcours etapes={ETAPES} etat={guide} setEtat={setGuide} fin={fin}/>
      </div>
      <div className="tr-l2">
        <div data-apparait={`${idx('bas')} ${idx('section')}`}>
          <Section titre="Commandes" ouvert={ouverts.commandes} onBascule={() => setOuverts(o => ({ ...o, commandes: !o.commandes }))}>{commandes}</Section>
        </div>
        <div><Section titre="Mesures" ouvert={ouverts.mesures} onBascule={() => setOuverts(o => ({ ...o, mesures: !o.mesures }))}>{mesures}</Section></div>
      </div>
    </>
  );
}

