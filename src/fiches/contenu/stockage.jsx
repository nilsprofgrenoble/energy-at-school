import { Fm, Fi, Grandeurs, Exemple, Memo, Def, Schema, T, Fl, COUL } from '../elements';

// Batteries (valeurs indicatives de la simulation : CEA-Liten / INES). NMC 18650 : 3,7 V ; 2,03 Ah ; 45,4 g → 7,5 Wh ; 165 Wh/kg.
// Densités (Wh/kg) = U × Q / m ; coût du kWh stocké = prix (€/kWh) / nombre de cycles.

const SceneCellule = () => (
  <Schema h={226} titre="Cellule lithium-ion en décharge : les ions Li+ traversent le séparateur de l'électrode négative vers l'électrode positive, pendant que les électrons passent par le circuit extérieur et allument la lampe">
    <T x="180" y="14" s="décharge" c={COUL.orange} f={14} />
    <polyline points="70,106 70,44 166,44" fill="none" stroke="#334155" strokeWidth="2.5" />
    <polyline points="194,44 290,44 290,106" fill="none" stroke="#334155" strokeWidth="2.5" />
    <circle cx="180" cy="44" r="14" fill="#fff" stroke="#334155" strokeWidth="2.5" /><T x="180" y="49" s="✕" f={13} />
    <T x="180" y="76" s="lampe" w={600} c="#475569" />
    <Fl x1="86" y1="44" x2="134" y2="44" c="O" e={2.2} />
    <T x="110" y="34" s="e⁻" c={COUL.orange} />
    <rect x="20" y="106" width="320" height="86" rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
    <rect x="30" y="114" width="80" height="70" fill="#e0e7ff" stroke={COUL.violet} strokeWidth="2.5" />
    <T x="70" y="144" s="électrode" f={13} /><T x="70" y="162" s="négative" f={13} />
    <rect x="250" y="114" width="80" height="70" fill="#ffedd5" stroke={COUL.orange} strokeWidth="2.5" />
    <T x="290" y="144" s="électrode" f={13} /><T x="290" y="162" s="positive" f={13} />
    <line x1="180" y1="108" x2="180" y2="190" stroke="#334155" strokeWidth="2.5" strokeDasharray="6 4" />
    <Fl x1="116" y1="138" x2="244" y2="138" c="B" e={2.2} />
    <T x="148" y="128" s="Li⁺" c={COUL.eau} f={14} />
    <T x="180" y="212" s="séparateur : laisse passer Li⁺, pas les électrons" w={600} c="#475569" f={13} />
  </Schema>
);

const SceneEnergie = () => (
  <Schema h={214} titre="Une cellule NMC de 3,7 volts, 2,03 ampères-heures et 45,4 grammes stocke environ 7,5 wattheures, soit 165 wattheures par kilogramme">
    <rect x="30" y="40" width="64" height="104" rx="8" fill="#e0e7ff" stroke="#334155" strokeWidth="2.5" />
    <rect x="52" y="28" width="20" height="12" fill="#334155" />
    <T x="62" y="98" s="NMC" f={14} />
    <T x="118" y="66" s="U = 3,7 V (tension)" a="start" />
    <T x="118" y="96" s="Q = 2,03 Ah (capacité)" a="start" />
    <T x="118" y="126" s="m = 45,4 g (masse)" a="start" />
    <T x="180" y="172" s="E = U × Q ≈ 7,5 Wh" c={COUL.eau} f={15} />
    <T x="180" y="198" s="E ÷ m ≈ 165 Wh/kg" c={COUL.orange} f={15} />
  </Schema>
);

const Cellule = ({ x, y, t }) => <g><rect x={x} y={y} width="56" height="26" rx="6" fill="#fff" stroke="#334155" strokeWidth="2" /><rect x={x + 56} y={y + 8} width="5" height="10" fill="#334155" /><T x={x + 28} y={y + 18} s={t} f={13} /></g>;
const SceneAssemblage = () => (
  <Schema h={228} titre="Assemblage de cellules : en série, les tensions s'additionnent (4 cellules de 3,2 volts font 12,8 volts) ; en parallèle, les capacités s'additionnent">
    <T x="180" y="16" s="en série : les tensions s'additionnent" c={COUL.eau} />
    {[0, 1, 2, 3].map(k => <Cellule key={k} x={14 + k * 84} y={30} t="3,2 V" />)}
    {[0, 1, 2].map(k => <line key={k} x1={75 + k * 84} y1={43} x2={98 + k * 84} y2={43} stroke="#334155" strokeWidth="2" />)}
    <T x="180" y="86" s="U = 4 × 3,2 V = 12,8 V" c={COUL.orange} />
    <T x="180" y="122" s="en parallèle : les capacités s'additionnent" c={COUL.violet} />
    <line x1="80" y1="138" x2="80" y2="206" stroke="#334155" strokeWidth="2" /><line x1="200" y1="138" x2="200" y2="206" stroke="#334155" strokeWidth="2" />
    {[0, 1, 2].map(k => <g key={k}><line x1="80" y1={151 + k * 26} x2="102" y2={151 + k * 26} stroke="#334155" strokeWidth="2" /><Cellule x={102} y={138 + k * 26} t="3,2 V" /><line x1="163" y1={151 + k * 26} x2="200" y2={151 + k * 26} stroke="#334155" strokeWidth="2" /></g>)}
    <T x="218" y="166" s="Q = 3 × Q₁" a="start" c={COUL.orange} />
    <T x="218" y="188" s="U reste 3,2 V" a="start" w={600} c="#475569" />
  </Schema>
);

const SceneChimies = () => {
  const L = [['Pile patate', 9, '—'], ['Plomb 6 V', 44, '0,28 €'], ['Ni-MH', 90, '—'], ['Na-ion', 93, '0,03 €'], ['LFP', 137, '0,06 €'], ['Li-ion HD', 250, '0,11 €']];
  const cols = [COUL.gris, COUL.gris, '#94a3b8', COUL.vert, COUL.eau, COUL.orange];
  return (
    <Schema h={216} titre="Densité d'énergie en wattheures par kilogramme et coût par kilowattheure stocké : la pile patate 9 et sans coût, le plomb 44 pour 0,28 euro, le Ni-MH 90, le sodium-ion 93 pour 0,03 euro, le LFP 137 pour 0,06 euro, le lithium-ion haute densité 250 pour 0,11 euro">
      <T x="104" y="16" s="Wh/kg" a="start" w={600} c="#475569" /><T x="352" y="16" s="€ / kWh stocké" a="end" w={600} c="#475569" />
      {L.map(([n, v, c], k) => (
        <g key={k}>
          <T x="8" y={46 + k * 30} s={n} a="start" f={13} />
          <rect x="104" y={32 + k * 30} width={v / 250 * 140} height="18" rx="4" fill={cols[k]} />
          <T x={104 + v / 250 * 140 + 6} y={46 + k * 30} s={String(v)} a="start" f={13} w={600} c="#334155" />
          <T x="352" y={46 + k * 30} s={c} a="end" f={13} c={c === '—' ? '#94a3b8' : COUL.encre} />
        </g>))}
    </Schema>
  );
};

const SceneSens = () => {
  const ligne = (y, titre, c, g, d, flG, flD) => (
    <g>
      <T x="180" y={y} s={titre} c={c} f={14} />
      <rect x="8" y={y + 10} width="140" height="50" rx="10" fill="#e0e7ff" stroke={COUL.violet} strokeWidth="2.5" />
      <T x="78" y={y + 31} s="électrode (−)" f={13} /><T x="78" y={y + 50} s={g} f={13} c={COUL.encre} />
      <rect x="212" y={y + 10} width="140" height="50" rx="10" fill="#ffedd5" stroke={COUL.orange} strokeWidth="2.5" />
      <T x="282" y={y + 31} s="électrode (+)" f={13} /><T x="282" y={y + 50} s={d} f={13} c={COUL.encre} />
      <Fl x1={flG} y1={y + 35} x2={flD} y2={y + 35} c="B" e={2.5} />
      <T x="180" y={y + 28} s="Li⁺" c={COUL.eau} f={14} />
    </g>
  );
  return (
    <Schema h={252} titre="Pendant la décharge, l'électrode négative est l'anode (oxydation) et la positive la cathode (réduction) ; pendant la charge, les rôles s'échangent alors que les bornes plus et moins restent les mêmes">
      {ligne(14, 'décharge', COUL.orange, 'anode : oxydation', 'cathode : réduction', 154, 206)}
      {ligne(130, 'charge', COUL.vert, 'cathode : réduction', 'anode : oxydation', 206, 154)}
      <T x="180" y="238" s="les bornes + et − ne changent jamais" w={600} c="#475569" f={13} />
    </Schema>
  );
};

const SceneTension = () => {
  const X = p => 44 + p * 3, Y = v => 170 - (v - 2.5) / 1.7 * 130;
  const ocv = [[0, 2.5], [4, 3.3], [15, 3.55], [50, 3.7], [85, 3.95], [100, 4.2]];
  const pts = (d) => ocv.map(([p, v], k) => `${X(p)},${Y(v + (k === 0 ? 0 : d))}`).join(' ');
  return (
    <Schema h={236} titre="Tension de la cellule en fonction de l'état de charge : en décharge elle est un peu plus basse que la tension en circuit ouvert, en charge un peu plus haute, à cause de la résistance interne">
      <line x1="44" y1="36" x2="44" y2="170" stroke="#334155" strokeWidth="2" /><line x1="44" y1="170" x2="348" y2="170" stroke="#334155" strokeWidth="2" />
      <T x="44" y="22" s="U (V)" a="middle" w={600} c="#475569" />
      <T x="200" y="204" s="état de charge (%)" w={600} c="#475569" />
      <T x="44" y="188" s="0" f={12} w={600} c="#475569" /><T x="344" y="188" s="100" f={12} w={600} c="#475569" />
      <T x="36" y={Y(4.2) + 4} s="4,2" a="end" f={12} w={600} c="#475569" /><T x="36" y={Y(2.5) + 4} s="2,5" a="end" f={12} w={600} c="#475569" />
      <polyline points={pts(0.18)} fill="none" stroke={COUL.vert} strokeWidth="2.5" strokeDasharray="6 4" />
      <polyline points={pts(0)} fill="none" stroke={COUL.eau} strokeWidth="3" />
      <polyline points={pts(-0.18)} fill="none" stroke={COUL.orange} strokeWidth="2.5" strokeDasharray="6 4" />
      <line x1="170" y1="126" x2="196" y2="126" stroke={COUL.vert} strokeWidth="2.5" strokeDasharray="6 4" /><T x="204" y="130" s="en charge" a="start" c={COUL.vert} f={13} />
      <line x1="170" y1="144" x2="196" y2="144" stroke={COUL.eau} strokeWidth="3" /><T x="204" y="148" s="circuit ouvert" a="start" c={COUL.eau} f={13} />
      <line x1="170" y1="162" x2="196" y2="162" stroke={COUL.orange} strokeWidth="2.5" strokeDasharray="6 4" /><T x="204" y="166" s="en décharge" a="start" c={COUL.orange} f={13} />
      <T x="196" y="226" s="U = E − r × I : le courant fait perdre de la tension" w={600} c="#475569" f={13} />
    </Schema>
  );
};

export const stockage = [
  { id: 'cellule', titre: 'Dans une cellule lithium-ion', corps: <>
    <SceneCellule />
    <Def terme="Décharge">spontanée : Li⁺ et électrons vont vers l’électrode positive.</Def>
    <Def terme="Charge">forcée par un chargeur : les ions Li⁺ reviennent vers l’électrode négative.</Def>
    <Exemple>La tension de la cellule va de 4,2 V (chargée) à 2,5 V (vide) ; nominale : 3,7 V.</Exemple>
    <Memo>Chaque ion Li⁺ qui traverse s’accompagne d’un électron dans le circuit extérieur.</Memo>
  </> },
  { id: 'energie', titre: 'Capacité, énergie, densité', corps: <>
    <SceneEnergie />
    <Fm>{'E = U * Q'}</Fm>
    <Fm>{'[densité] = {E|m}'}</Fm>
    <Fm>{'t = {Q|I}'}</Fm>
    <Grandeurs lignes={[['E', 'énergie stockée', 'Wh'], ['U', 'tension de la cellule', 'V'], ['Q', 'capacité de la cellule', 'Ah'], ['m', 'masse de la cellule', 'kg'], ['t', 'durée de décharge', 'h'], ['I', 'courant débité', 'A']]} />
    <Exemple><Fi>{'E = 3,7 × 2,03 ≈ 7,5 [Wh]'}</Fi> ; <Fi>{'{7,5|0,0454} ≈ 165 [Wh/kg]'}</Fi>.</Exemple>
    <Memo>La capacité est une charge électrique (Ah ou C), pas celle d’un condensateur (F).</Memo>
  </> },
  { id: 'assemblage', titre: 'Assembler des cellules', corps: <>
    <SceneAssemblage />
    <Fm>{'U_tot = N * U'}</Fm>
    <Fm>{'Q_tot = k * Q'}</Fm>
    <Grandeurs lignes={[['U_tot', 'tension de N cellules en série', 'V'], ['N', 'nombre de cellules en série', ''], ['Q_tot', 'capacité de k cellules en parallèle', 'Ah'], ['k', 'nombre de cellules en parallèle', '']]} />
    <Exemple>Batterie 12 V : 4 cellules LFP en série, <Fi>{'4 × 3,2 = 12,8 [V]'}</Fi>. Zoé : 13,5 kWh/100 km × 4 = 54 kWh pour 217 kg, soit au moins <Fi>{'{54 000|217} ≈ 250 [Wh/kg]'}</Fi>.</Exemple>
    <Memo>Tension voulue : cellules en série. Durée ou énergie voulue : cellules en parallèle.</Memo>
  </> },
  { id: 'chimies', titre: 'Choisir sa chimie', corps: <>
    <SceneChimies />
    <Fm>{'[coût par kWh stocké] = {[prix]|[cycles]}'}</Fm>
    <Grandeurs lignes={[['prix', 'prix de la batterie', '€/kWh'], ['cycles', 'nombre de cycles de charge-décharge avant usure', '']]} />
    <Exemple>Plomb : <Fi>{'{221|800} ≈ 0,28 [€/kWh]'}</Fi> ; Na-ion : <Fi>{'{113|4 000} ≈ 0,03 [€/kWh]'}</Fi>. Valeurs indicatives (CEA-Liten / INES).</Exemple>
    <Memo>La moins chère à l’achat n’est pas la moins chère à l’usage : il faut aussi compter les cycles.</Memo>
  </> },
  { id: 'sens', titre: 'Charge ou décharge : qui est l’anode ?', corps: <>
    <SceneSens />
    <Def terme="Négative (graphite)">Li⁺ + C₆ + e⁻ ⇌ LiC₆ (vers la droite : charge ; vers la gauche : décharge).</Def>
    <Def terme="Positive (oxyde NMC)">Li⁺ + MO₂ + e⁻ ⇌ LiMO₂ (vers la droite : décharge ; vers la gauche : charge).</Def>
    <Exemple>En décharge, le graphite perd son lithium : c’est une oxydation, donc l’électrode négative est l’anode.</Exemple>
    <Memo>Les bornes + et − ne changent jamais ; les noms anode et cathode, si.</Memo>
  </> },
  { id: 'tension', titre: 'La tension d’une cellule', corps: <>
    <SceneTension />
    <Fm>{'U = E - r * I'}</Fm>
    <Grandeurs lignes={[['U', 'tension mesurée aux bornes', 'V'], ['E', 'tension en circuit ouvert (dépend de l’état de charge)', 'V'], ['r', 'résistance interne de la cellule', 'Ω'], ['I', 'courant débité', 'A']]} />
    <Exemple>Cellule débitant <Fi>{'I = 1,5 [A]'}</Fi> avec <Fi>{'r = 0,05 [Ω]'}</Fi> : <Fi>{'r × I = 0,05 × 1,5 ≈ 0,08 [V]'}</Fi> de moins que E. En charge, c’est l’inverse : U est plus haute que E.</Exemple>
    <Memo>Plus on tire de courant, plus la tension chute : la tension d’une batterie n’est pas une constante.</Memo>
  </> },
];
