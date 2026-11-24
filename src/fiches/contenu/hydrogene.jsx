import { Fm, Fi, Grandeurs, Exemple, Memo, FauxVrai, Def, Schema, T, Fl, COUL, Courbe, BarrePertes } from '../elements';

// Hydrogène : F = 96 485 C/mol ; Vm = 24 L/mol (20 °C) ; ΔH = 285 kJ/mol ; ΔH/2F ≈ 1,48 V ; η_F = 0,72 ; électrolyseur : 0,17 A et 1,52 V à pleine lumière.
// Banc de pile : 10 cellules en série de 25 cm² ; U_banc(i) = 8,775 − 0,6688·ln(1 + i/0,1474) − 0,0377·i (modèle de la simulation).
const uBanc = i => 8.775 - 0.6688 * Math.log(1 + i / 0.1474) - 0.0377 * i;
const etaPile = i => uBanc(i) / 10 / 1.48 * 100;
const COURBE_PILE = [0, 0.25, 0.5, 1, 2, 3, 4, 6, 8, 10].map(i => [i, Math.round(etaPile(i) * 10) / 10]);

const SceneChaine = () => {
  const R = [
    { n: 'Panneau solaire', f: 'énergie électrique', c: '#f59e0b' },
    { n: 'Électrolyseur', f: 'énergie chimique (H₂)', c: COUL.eau, pertes: true },
    { n: 'Pile à combustible', f: 'énergie électrique', c: COUL.vert, pertes: true },
    { n: 'Moteur', f: 'énergie mécanique', c: COUL.violet },
  ];
  return (
    <Schema h={252} titre="Chaîne du dihydrogène : le panneau solaire fournit de l'électricité à l'électrolyseur qui fabrique du dihydrogène, stocké puis consommé par une pile à combustible qui alimente un moteur ; l'électrolyseur et la pile perdent de la chaleur">
      {R.map((r, k) => (
        <g key={k}>
          <rect x="8" y={10 + k * 60} width="158" height="38" rx="10" fill="#fff" stroke={r.c} strokeWidth="2.5" />
          <T x="87" y={34 + k * 60} s={r.n} f={14} />
          <T x="182" y={34 + k * 60} s={r.f} a="start" w={600} c="#334155" />
          {r.pertes && <T x="182" y={50 + k * 60} s="+ chaleur perdue" a="start" w={600} c={COUL.rouge} f={13} />}
          {k < 3 && <Fl x1="87" y1={49 + k * 60} x2="87" y2={68 + k * 60} c="K" e={2} />}
        </g>))}
      <T x="100" y="124" s="stockage de H₂" a="start" w={600} c={COUL.eau} f={13} />
    </Schema>
  );
};

const SceneElectrolyse = () => (
  <Schema h={248} titre="Électrolyse de l'eau : à la cathode négative se forme du dihydrogène, en volume double ; à l'anode positive se forme du dioxygène">
    <rect x="30" y="100" width="300" height="100" fill="#bae6fd" stroke="#334155" strokeWidth="2.5" />
    <rect x="80" y="40" width="40" height="80" fill="#fff" stroke="#334155" strokeWidth="2" />
    <rect x="80" y="40" width="40" height="64" fill="#fde68a" />
    <rect x="240" y="40" width="40" height="80" fill="#fff" stroke="#334155" strokeWidth="2" />
    <rect x="240" y="72" width="40" height="32" fill="#fecaca" />
    <line x1="100" y1="112" x2="100" y2="190" stroke={COUL.violet} strokeWidth="6" /><line x1="260" y1="112" x2="260" y2="190" stroke={COUL.orange} strokeWidth="6" />
    <T x="100" y="30" s="H₂ : 2 volumes" c="#b45309" f={14} /><T x="260" y="30" s="O₂ : 1 volume" c={COUL.rouge} f={14} />
    <T x="100" y="218" s="cathode (−)" c={COUL.violet} /><T x="260" y="218" s="anode (+)" c={COUL.orange} />
    <T x="100" y="238" s="2 H⁺ + 2 e⁻ → H₂" f={13} w={600} /><T x="262" y="238" s="H₂O → ½ O₂ + 2 H⁺ + 2 e⁻" f={13} w={600} />
  </Schema>
);

const ScenePileReactions = () => (
  <Schema h={248} titre="Pile à combustible : à l'électrode négative le dihydrogène libère des électrons et des ions H plus ; à l'électrode positive le dioxygène les capte et forme de l'eau">
    <rect x="70" y="70" width="220" height="110" rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2.5" />
    <rect x="70" y="70" width="60" height="110" fill="#e0e7ff" stroke={COUL.violet} strokeWidth="2.5" />
    <rect x="230" y="70" width="60" height="110" fill="#ffedd5" stroke={COUL.orange} strokeWidth="2.5" />
    <T x="100" y="130" s="(−)" f={15} c={COUL.violet} /><T x="260" y="130" s="(+)" f={15} c={COUL.orange} />
    <T x="180" y="122" s="H⁺" c={COUL.eau} f={14} /><Fl x1="140" y1="136" x2="220" y2="136" c="B" e={2.5} />
    <Fl x1="86" y1="24" x2="86" y2="66" c="B" e={2.5} /><T x="86" y="16" s="H₂" f={14} c={COUL.eau} />
    <Fl x1="274" y1="24" x2="274" y2="66" c="G" e={2.5} /><T x="274" y="16" s="O₂" f={14} c={COUL.vert} />
    <Fl x1="260" y1="184" x2="260" y2="214" c="K" e={2.5} /><T x="260" y="230" s="H₂O" f={14} />
    <T x="100" y="206" s="H₂ → 2 H⁺ + 2 e⁻" f={13} w={600} /><T x="100" y="224" s="anode (oxydation)" f={13} c={COUL.violet} />
    <T x="180" y="34" s="e⁻ par le circuit" w={600} c={COUL.orange} f={13} />
    <path d="M116 66 V44 H244 V66" fill="none" stroke={COUL.orange} strokeWidth="2.5" strokeDasharray="6 4" />
  </Schema>
);

const SceneBilanChaine = () => {
  const R = [['Panneau solaire', '10 %', '#f59e0b'], ['Électrolyseur', '≈ 70 %', COUL.eau], ['Pile à combustible', '≈ 50 %', COUL.vert], ['Moteur', '90 %', COUL.violet]];
  return (
    <Schema h={236} titre="Rendement global de la chaîne : 10 % pour le panneau, 70 % pour l'électrolyseur, 50 % pour la pile et 90 % pour le moteur donnent environ 3 % en tout">
      {R.map(([n, v, c], k) => (
        <g key={k}>
          <rect x="8" y={8 + k * 42} width="210" height="32" rx="10" fill="#fff" stroke={c} strokeWidth="2.5" />
          <T x="113" y={29 + k * 42} s={n} f={14} />
          <T x="262" y={30 + k * 42} s={v} f={16} c={c} />
          {k < 3 && <T x="320" y={36 + k * 42} s="×" f={16} c="#475569" />}
        </g>))}
      <rect x="8" y="180" width="344" height="44" rx="10" fill="#fff7ed" stroke={COUL.orange} strokeWidth="2.5" />
      <T x="180" y="208" s="η global ≈ 0,10 × 0,70 × 0,50 × 0,90 ≈ 3 %" f={15} c={COUL.orange} />
    </Schema>
  );
};

export const hydrogene = [
  { id: 'chaine', titre: 'Le dihydrogène, un vecteur d’énergie', corps: <>
    <SceneChaine />
    <Memo>Le dihydrogène stocke l’énergie, il ne la crée pas : il faut d’abord le fabriquer.</Memo>
  </> },
  { id: 'faraday', titre: 'Électrolyse et loi de Faraday', corps: <>
    <SceneElectrolyse />
    <Fm>{'n_{H₂} = {I * Δt|2 * F}'}</Fm>
    <Fm>{'n_{H₂} = {V|V_m}'}</Fm>
    <Grandeurs lignes={[['n_{H₂}', 'quantité de dihydrogène', 'mol'], ['I', 'courant dans l’électrolyseur', 'A'], ['Δt', 'durée', 's'], ['F', 'constante de Faraday : 96 485', 'C/mol'], ['V', 'volume de gaz', 'L'], ['V_m', 'volume molaire à 20 °C : 24', 'L/mol']]} />
    <Exemple><Fi>{'I = 0,17 [A]'}</Fi> pendant 10 min : <Fi>{'n_{H₂} = {0,17 × 600|2 × 96 485} ≈ 5,3 × 10^-4 [mol]'}</Fi>, soit <Fi>{'V = 5,3 × 10^-4 × 24 ≈ 13 [mL]'}</Fi> en théorie ; la maquette en donne 72 % (rendement faradique).</Exemple>
    <Memo>Moins de lumière, moins de courant : moins d’électrons, moins de gaz.</Memo>
  </> },
  { id: 'electrolyseur', titre: 'Rendement de l’électrolyseur', corps: <>
    <BarrePertes titre="Chaque seconde, l'électrolyseur reçoit 0,26 joule et en stocke 0,18 dans le dihydrogène, soit un rendement d'environ 70 %" haut="0,26 W consommés par l'électrolyseur" utile="0,18 W stockés (≈ 70 %)" perdu="≈ 0,08 W de chaleur" frac={0.70} />
    <Fm>{'E_cons = U * I * Δt'}</Fm>
    <Fm>{'E_stock = n_{H₂} * ΔH'}</Fm>
    <Fm>{'η = {E_stock|E_cons}'}</Fm>
    <Grandeurs lignes={[['E_cons', 'énergie électrique consommée', 'J'], ['U', 'tension de l’électrolyseur', 'V'], ['E_stock', 'énergie stockée dans H₂', 'J'], ['ΔH', 'énergie libérée par une mole de H₂ : 285 000', 'J/mol'], ['η', 'rendement', '%']]} />
    <Exemple>Pleine lumière, pendant 1 s : <Fi>{'E_cons = 1,52 × 0,17 ≈ 0,26 [J]'}</Fi> ; <Fi>{'n_{H₂} = {0,72 × 0,17|2 × 96 485} ≈ 6,3 × 10^-7 [mol]'}</Fi> donc <Fi>{'E_stock ≈ 0,18 [J]'}</Fi> et <Fi>{'η ≈ 70 [%]'}</Fi>.</Exemple>
    <Memo>Ce qui n’est pas stocké dans H₂ est dissipé en chaleur.</Memo>
  </> },
  { id: 'pile', titre: 'La pile à combustible', corps: <>
    <Courbe titre="Rendement d'une cellule du banc de pile en fonction du courant : il vaut environ 59 % à vide et diminue à 38 % pour 10 ampères" h={214}
      pts={COURBE_PILE} xmax={10} ymax={80} ticksX={[0, 2, 4, 6, 8, 10]} ticksY={[0, 20, 40, 60, 80]} xlab="I (A)" ylab="η (%)"
      reperes={[{ x: 0, y: 59.3, texte: 'à vide ≈ 59 %', tx: 60, a: 'start', c: COUL.vert }, { x: 10, y: 37.6, texte: '10 A : 38 %', tx: 334, a: 'end', ty: 128 }]} />
    <Fm>{'η = {U_cellule|1,48 [V]}'}</Fm>
    <Fm>{'U_cellule = {U_pile|10}'}</Fm>
    <Grandeurs lignes={[['η', 'rendement d’une cellule', '%'], ['U_cellule', 'tension d’une cellule', 'V'], ['U_pile', 'tension aux bornes des 10 cellules en série', 'V'], ['1,48', '= ΔH ÷ 2F, tension théorique', 'V']]} />
    <Exemple>À 10 A : <Fi>{'U_pile ≈ 5,6 [V]'}</Fi>, donc <Fi>{'U_cellule ≈ 0,56 [V]'}</Fi> et <Fi>{'η = {0,56|1,48} ≈ 38 [%]'}</Fi>. Densité de courant : 10 A ÷ 25 cm² = 0,40 A/cm².</Exemple>
    <Memo>Plus on demande de courant, plus la tension et le rendement baissent : il faut choisir entre rendement et puissance.</Memo>
  </> },
  { id: 'reactions', titre: 'Dans la pile : l’eau revient', corps: <>
    <ScenePileReactions />
    <Def terme="Électrode négative (anode)">H₂ → 2 H⁺ + 2 e⁻ : le dihydrogène perd ses électrons.</Def>
    <Def terme="Électrode positive (cathode)">½ O₂ + 2 H⁺ + 2 e⁻ → H₂O : le dioxygène les récupère et forme de l’eau.</Def>
    <Exemple>Bilan : H₂ + ½ O₂ → H₂O. C’est l’électrolyse à l’envers : on récupère de l’électricité, il ne reste que de l’eau.</Exemple>
    <Memo>Électrolyse : on injecte de l’électricité pour casser l’eau. Pile : on récupère de l’électricité en refaisant l’eau.</Memo>
  </> },
  { id: 'bilan', titre: 'Le bilan de toute la chaîne', corps: <>
    <SceneBilanChaine />
    <Fm>{'η_{global} = η_{panneau} * η_{élec} * η_{pile} * η_{moteur}'}</Fm>
    <Grandeurs lignes={[['η_{panneau}', 'rendement du panneau solaire', ''], ['η_{élec}', 'rendement de l’électrolyseur', ''], ['η_{pile}', 'rendement de la pile (dépend du courant)', ''], ['η_{moteur}', 'rendement du moteur', '']]} />
    <Exemple><Fi>{'η_{global} = 0,10 × 0,70 × 0,50 × 0,90 ≈ 0,03'}</Fi> : environ 3 % de l’énergie lumineuse devient de l’énergie mécanique (valeurs d’illustration).</Exemple>
    <Memo>Les rendements se multiplient : chaque maillon de la chaîne en fait perdre un peu.</Memo>
  </> },
];
