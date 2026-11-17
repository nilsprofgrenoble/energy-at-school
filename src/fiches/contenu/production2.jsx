import { Fm, Fi, Grandeurs, Exemple, Memo, FauxVrai, Schema, T, Fl, COUL, Courbe, BarrePertes, Vs } from '../elements';

// Banc Pelton (HM 150.19) : 15 L/min, p = 1,0 bar → P_hyd = 25 W ; 1 600 tr/min à vide ; rendement maximal 48 %.
// Exemple freiné : F1 = 4,0 N, F2 = 1,0 N → n ≈ 1 180 tr/min, C = 0,075 N·m, P_méca ≈ 9,3 W, η ≈ 37 %.
const REF = [[0, 0], [100, 9.1], [200, 18.3], [300, 26], [400, 32.7], [500, 38.2], [600, 42.8], [700, 46.4], [780, 47.7], [860, 48.1], [1000, 46], [1130, 40.5], [1200, 36.7], [1300, 26.6], [1370, 20.9], [1450, 7.4], [1600, 0]];

const SceneBanc = () => (
  <Schema h={204} titre="Banc Pelton : le jet sort de la tuyère à la vitesse ve et fait tourner la roue à augets ; un frein à bande sur la poulie de diamètre D joue le rôle de charge ; deux dynamomètres donnent F1 et F2">
    <rect x="6" y="28" width="42" height="24" fill="#bae6fd" stroke={COUL.eau} strokeWidth="2.5" />
    <polygon points="48,28 76,35 76,45 48,52" fill="#7dd3fc" stroke={COUL.eau} strokeWidth="2" />
    <T x="40" y="74" s="tuyère" />
    <Fl x1="78" y1="40" x2="130" y2="40" c="B" e={2} />
    <Vs x={104} y={30} s="v" sub="e" c={COUL.eau} />
    <circle cx="160" cy="68" r="28" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
    {[0, 60, 120, 180, 240, 300].map(a => <circle key={a} cx={160 + 28 * Math.cos(a * Math.PI / 180)} cy={68 + 28 * Math.sin(a * Math.PI / 180)} r="4.5" fill={COUL.eau} />)}
    <T x="160" y="73" s="roue" />
    <T x="160" y="116" s="roue à augets" />
    <line x1="188" y1="68" x2="228" y2="68" stroke="#334155" strokeWidth="4" />
    <circle cx="250" cy="68" r="22" fill="#e0e7ff" stroke="#334155" strokeWidth="2.5" />
    <T x="250" y="73" s="poulie" f={13} />
    <Fl x1="228" y1="34" x2="272" y2="34" c="K" e={1.8} /><Fl x1="272" y1="34" x2="228" y2="34" c="K" e={1.8} />
    <T x="250" y="24" s="D = 5,0 cm" />
    <line x1="228" y1="68" x2="228" y2="92" stroke="#334155" strokeWidth="2.5" /><line x1="272" y1="68" x2="272" y2="92" stroke="#334155" strokeWidth="2.5" />
    <Fl x1="228" y1="92" x2="228" y2="140" c="O" e={2.5} /><Fl x1="272" y1="92" x2="272" y2="112" c="O" e={2.5} />
    <Vs x={222} y={160} s="F" sub="1" suite=" = 4,0 N" a="end" c={COUL.orange} />
    <Vs x={278} y={160} s="F" sub="2" suite=" = 1,0 N" a="start" c={COUL.orange} />
    <T x="250" y="188" s="frein à bande + dynamomètres" w={600} c="#475569" />
  </Schema>
);

const BarresVitesses = () => {
  const lignes = [
    { y: 26, s: 'v', sub: 'e', suite: '  jet (1,0 bar)', val: 13.7, txt: '13,7 m/s', c: COUL.eau },
    { y: 78, s: 'v', sub: 'a', suite: '  auget à vide (1 600 tr/min)', val: 8.4, txt: '8,4 m/s', c: '#94a3b8' },
    { y: 130, s: 'v', sub: 'a', suite: '  auget au rendement maximal', val: 4.5, txt: '4,5 m/s', c: COUL.vert },
  ];
  return (
    <Schema h={166} titre="Vitesses en m/s : le jet va à 13,7, l'auget à vide à 8,4, l'auget au rendement maximal à 4,5">
      {lignes.map((l, k) => (
        <g key={k}>
          <Vs x={8} y={l.y} s={l.s} sub={l.sub} suite={l.suite} a="start" c={COUL.encre} />
          <rect x="8" y={l.y + 8} width={l.val / 13.7 * 240} height="20" rx="4" fill={l.c} />
          <T x={8 + l.val / 13.7 * 240 + 8} y={l.y + 24} s={l.txt} a="start" c={l.c === '#94a3b8' ? '#475569' : l.c} />
        </g>))}
    </Schema>
  );
};

export const production2 = [
  { id: 'banc', titre: 'Le banc : de l’eau au frein', corps: <>
    <SceneBanc />
    <Memo>Serrer le frein, c’est brancher un appareil plus gourmand : la roue ralentit, le couple augmente.</Memo>
  </> },
  { id: 'puissances', titre: 'Puissances et rendement', corps: <>
    <BarrePertes titre="De 25 W apportés par l'eau, environ 9,3 W sont récupérés sur l'arbre, soit un rendement de 37 % pour cette position du frein" haut="25 W apportés par l'eau" utile="9,3 W utiles (≈ 37 %)" perdu="≈ 16 W perdus" frac={0.37} />
    <Fm>{'P_hyd = p * Q_V'}</Fm>
    <Fm>{'C = (F_1 − F_2) * {D|2}'}</Fm>
    <Fm>{'P_méca = C * {2π * n|60}'}</Fm>
    <Fm>{'η = {P_méca|P_hyd}'}</Fm>
    <Grandeurs lignes={[['P_hyd', 'puissance de l’eau', 'W'], ['p', 'pression', 'Pa'], ['Q_V', 'débit', 'm³/s'], ['C', 'couple de freinage', 'N·m'], ['F_1, F_2', 'forces lues sur les dynamomètres', 'N'], ['D', 'diamètre de la poulie', 'm'], ['P_méca', 'puissance sur l’arbre', 'W'], ['n', 'vitesse de rotation', 'tr/min'], ['η', 'rendement', '%']]} />
    <Exemple><Fi>{'P_hyd = 10^5 × 2,5 × 10^-4 = 25 [W]'}</Fi> (15 L/min = 2,5 × 10⁻⁴ m³/s). Avec <Fi>{'F_1 = 4,0 [N]'}</Fi>, <Fi>{'F_2 = 1,0 [N]'}</Fi> et <Fi>{'n ≈ 1 180 [tr/min]'}</Fi> : <Fi>{'C = 3,0 × 0,025 = 0,075 [N·m]'}</Fi>, <Fi>{'P_méca ≈ 9,3 [W]'}</Fi>, <Fi>{'η ≈ 37 [%]'}</Fi>.</Exemple>
    <Memo>Trois conversions : L/min → m³/s, cm → m, tr/min → rad/s (× 2π ÷ 60).</Memo>
  </> },
  { id: 'optimum', titre: 'Le rendement selon la vitesse de la roue', corps: <>
    <Courbe titre="Rendement du banc en fonction de la vitesse de rotation : nul à l'arrêt et à vide (1 600 tr/min), maximal (48 %) vers 860 tr/min" h={230}
      pts={REF} xmax={1600} ymax={55} ticksX={[0, 400, 800, 1200, 1600]} ticksY={[0, 25, 50]} xlab="n (tr/min)" ylab="η (%)"
      reperes={[{ x: 860, y: 48.1, texte: 'maximum ≈ 48 %', ty: 36 }]}
      dessous={[{ x: 46, texte: 'roue bloquée', a: 'start' }, { x: 340, texte: 'à vide', a: 'end' }]} />
    <FauxVrai faux="Plus la roue tourne vite, meilleur est le rendement." vrai="Bloquée, la roue ne produit rien ; à vide, le frein ne retient rien : le maximum est entre les deux, vers la moitié de la vitesse à vide." />
    <Memo>Ni bloquée, ni à vide : le meilleur compromis est au milieu.</Memo>
  </> },
  { id: 'vitesses', titre: 'Vitesse du jet, vitesse de l’auget', corps: <>
    <BarresVitesses />
    <Fm>{'v_e = √{{2 * p|ρ}}'}</Fm>
    <Fm>{'v_a = r * {2π * n|60}'}</Fm>
    <Grandeurs lignes={[['v_e', 'vitesse du jet', 'm/s'], ['p', 'pression : 1,0 bar = 10⁵ Pa', 'Pa'], ['ρ', 'masse volumique de l’eau : 1 000', 'kg/m³'], ['v_a', 'vitesse de l’auget', 'm/s'], ['r', 'distance jet–axe : 5,00 cm', 'm'], ['n', 'vitesse de rotation', 'tr/min']]} />
    <Exemple><Fi>{'v_e = √{{2 × 10^5|1 000}} ≈ 14 [m/s]'}</Fi>. À vide : <Fi>{'v_a = 0,0500 × {2π × 1 600|60} ≈ 8,4 [m/s]'}</Fi>, moins que le jet à cause des frottements.</Exemple>
  </> },
];
