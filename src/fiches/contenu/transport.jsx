import { Fm, Fi, Grandeurs, Exemple, Memo, FauxVrai, Schema, T, Fl, Boite, COUL, Fleche, Vs } from '../elements';

// Réseau : ligne réelle 1 MW sur 20 km, aluminium 2,8·10⁻⁸ Ω·m, 150 mm² ; R ≈ 7,5 Ω (L = 40 km aller-retour).
// 400 V : I = 2 500 A, P_J ≈ 47 MW ; 20 kV : I = 50 A, P_J ≈ 19 kW ; 400 kV : I = 2,5 A, P_J ≈ 47 W.
// Maquette : générateur ≈ 25 V, câbles de 10 m (1,0 / 1,5 / 2,5 mm²), meilleur réglage m1 : m2 = 2 : 0,5.

const SceneChaine = () => {
  const bs = [['Centrale', '400 V'], ['Transfo', 'U ↑'], ['Ligne', '20 kV'], ['Transfo', 'U ↓'], ['Maisons', '230 V']];
  const x = i => 1 + i * 74.5;
  return (
    <Schema h={152} titre="Chaîne du transport : la centrale produit à 400 volts, un transformateur élève la tension à 20 kilovolts pour la ligne, un second l'abaisse à 230 volts pour les maisons ; la ligne perd de l'énergie par effet Joule">
      {bs.map(([a, b], i) => <Boite key={i} x={x(i)} y={30} w={58} h={46} l1={a} l2={b} c={i === 2 ? COUL.rouge : COUL.eau} />)}
      {[0, 1, 2, 3].map(i => <Fl key={i} x1={x(i) + 59} y1={53} x2={x(i + 1) - 1} y2={53} c="K" e={2} />)}
      <Fl x1={x(2) + 29} y1={78} x2={x(2) + 29} y2={112} c="R" e={2.5} />
      <T x={x(2) + 29} y={132} s="pertes R × I²" c={COUL.rouge} />
      <T x="180" y="16" s="la tension est libre : on l'élève pour le transport" w={600} c="#475569" />
    </Schema>
  );
};

const SceneCourants = () => {
  const L = [
    { cy: 62, ep: 14, u: '400 V', i: 'I = 2 500 A', pj: '47 MW', note: '> 1 MW !', c: COUL.rouge },
    { cy: 112, ep: 4, u: '20 kV', i: 'I = 50 A', pj: '19 kW', note: 'η ≈ 98 %', c: COUL.vert },
    { cy: 162, ep: 1.6, u: '400 kV', i: 'I = 2,5 A', pj: '47 W', note: '', c: COUL.vert },
  ];
  return (
    <Schema h={194} titre="Même puissance de 1 mégawatt transportée sur 20 kilomètres : sous 400 volts le courant est énorme et les pertes de 47 mégawatts dépassent la puissance transportée ; sous 20 kilovolts le courant est de 50 ampères et les pertes de 19 kilowatts ; sous 400 kilovolts, 2,5 ampères et 47 watts">
      <T x="8" y="16" s="tension" a="start" w={600} c="#475569" /><T x="104" y="16" s="courant" a="start" w={600} c="#475569" /><T x="256" y="16" s="pertes" a="start" w={600} c="#475569" />
      {L.map((l, k) => (
        <g key={k}>
          <T x="8" y={l.cy + 5} s={l.u} a="start" />
          <Fleche x1={104} x2={236} cy={l.cy} ep={l.ep} c={COUL.eau} />
          <T x="104" y={l.cy - 16} s={l.i} a="start" c={COUL.eau} f={13} />
          <T x="256" y={l.cy + 2} s={l.pj} a="start" c={l.c} />
          {l.note && <T x="256" y={l.cy + 20} s={l.note} a="start" c={l.c} w={600} f={13} />}
        </g>))}
    </Schema>
  );
};

const SceneTransfo = () => (
  <Schema h={196} titre="Transformateur : deux bobines autour d'un circuit magnétique ; le primaire a N1 égal 4 spires, le secondaire N2 égal 8 spires ; la tension passe de U1 égal 1,0 volt à U2 égal 2,0 volts">
    <rect x="112" y="34" width="140" height="116" fill="#e2e8f0" stroke="#334155" strokeWidth="2.5" />
    <rect x="142" y="64" width="80" height="56" fill="#fff" stroke="#334155" strokeWidth="2" />
    {[56, 76, 96, 116].map(y => <line key={y} x1="104" y1={y} x2="150" y2={y} stroke={COUL.orange} strokeWidth="4" />)}
    {[48, 60, 72, 84, 96, 108, 120, 132].map(y => <line key={y} x1="214" y1={y} x2="260" y2={y} stroke={COUL.violet} strokeWidth="4" />)}
    <T x="96" y="62" s="primaire" a="end" c={COUL.orange} />
    <Vs x={96} y={84} s="N" sub="1" suite=" = 4" a="end" />
    <Vs x={96} y={106} s="U" sub="1" suite=" = 1,0 V" a="end" />
    <T x="268" y="54" s="secondaire" a="start" c={COUL.violet} />
    <Vs x={268} y={76} s="N" sub="2" suite=" = 8" a="start" />
    <Vs x={268} y={98} s="U" sub="2" suite=" = 2,0 V" a="start" />
    <T x="182" y="176" s="circuit magnétique" w={600} c="#475569" />
  </Schema>
);

const SceneCables = () => {
  const L = [{ cy: 40, ep: 4, s: '1,0 mm²', r: 'R la plus grande', c: COUL.rouge }, { cy: 84, ep: 6, s: '1,5 mm²', r: 'R moyenne', c: '#64748b' }, { cy: 134, ep: 10, s: '2,5 mm²', r: 'R la plus petite', c: COUL.vert }];
  return (
    <Schema h={192} titre="Trois câbles de 10 mètres : plus la section S est grande, plus la résistance R est petite ; le câble de 2,5 millimètres carrés perd le moins">
      {L.map((l, k) => (
        <g key={k}>
          <T x="8" y={l.cy + 5} s={l.s} a="start" />
          <line x1="86" y1={l.cy} x2="236" y2={l.cy} stroke="#b45309" strokeWidth={l.ep} strokeLinecap="round" />
          <T x="252" y={l.cy + 5} s={l.r} a="start" c={l.c} f={13} />
        </g>))}
      <T x="180" y="178" s="S ↑  ⇒  R ↓" f={15} c={COUL.orange} />
    </Schema>
  );
};

export const transport = [
  { id: 'chaine', titre: 'De la centrale aux maisons', corps: <>
    <SceneChaine />
    <Memo>Tension × k ⇒ intensité ÷ k ⇒ pertes ÷ k².</Memo>
  </> },
  { id: 'pertes', titre: 'Pertes dans la ligne', corps: <>
    <SceneCourants />
    <Fm>{'I = {P|U}'}</Fm>
    <Fm>{'R = ρ * {L|S}'}</Fm>
    <Fm>{'P_J = R * I^2'}</Fm>
    <Grandeurs lignes={[['I', 'intensité dans la ligne', 'A'], ['P', 'puissance transportée : 1 MW', 'W'], ['U', 'tension de la ligne', 'V'], ['R', 'résistance de la ligne', 'Ω'], ['ρ', 'résistivité de l’aluminium : 2,8 × 10⁻⁸', 'Ω·m'], ['L', 'longueur aller-retour : 40 km', 'm'], ['S', 'section du câble : 150 mm²', 'm²'], ['P_J', 'pertes par effet Joule', 'W']]} />
    <Exemple><Fi>{'R = 2,8 × 10^-8 × {40 × 10^3|150 × 10^-6} ≈ 7,5 [Ω]'}</Fi> ; à 20 kV : <Fi>{'I = {10^6|2 × 10^4} = 50 [A]'}</Fi> et <Fi>{'P_J = 7,5 × 50^2 ≈ 19 [kW]'}</Fi>.</Exemple>
    <Memo>De 400 V à 20 kV, U est multipliée par 50 : les pertes sont divisées par 50² = 2 500.</Memo>
  </> },
  { id: 'transfo', titre: 'Le transformateur', corps: <>
    <SceneTransfo />
    <Fm>{'m = {N_2|N_1} = {U_2|U_1} = {I_1|I_2}'}</Fm>
    <Grandeurs lignes={[['m', 'rapport de transformation', 'sans unité'], ['N_1, N_2', 'nombres de spires (primaire, secondaire)', ''], ['U_1, U_2', 'tensions primaire et secondaire', 'V'], ['I_1, I_2', 'intensités primaire et secondaire', 'A']]} />
    <Exemple><Fi>{'m = {8|4} = 2'}</Fi> donc <Fi>{'U_2 = 2 × 1,0 = 2,0 [V]'}</Fi> et l’intensité est divisée par 2.</Exemple>
    <Memo>La tension monte, l’intensité baisse dans le même rapport ; la fréquence (50 Hz) ne change pas.</Memo>
  </> },
  { id: 'compromis', titre: 'Sur la maquette : le meilleur compromis', corps: <>
    <SceneCables />
    <FauxVrai faux="Pour perdre moins, il suffit de prendre des câbles plus gros." vrai="Une section 4 fois plus grande divise R par 4 mais coûte 4 fois plus d’aluminium ; élever la tension divise les pertes bien davantage, sans métal en plus." />
    <Exemple>Sur la maquette (générateur ≈ 25 V, câbles de 10 m), le meilleur réglage est <Fi>{'m_1 = 2'}</Fi> puis <Fi>{'m_2 = 0,5'}</Fi> avec le câble de 2,5 mm² : <Fi>{'m_1 × m_2 = 1'}</Fi> rend la tension de départ.</Exemple>
    <Memo>Sur 10 m, les transformateurs perdent plus que les câbles ; sur une ligne de plusieurs dizaines de km, c’est l’inverse.</Memo>
  </> },
];
