import { Fm, Fi, Grandeurs, Exemple, Memo, Schema, T, Fl, COUL, BarrePertes, TroisVitesses, Vs } from '../elements';

// Au fil de l'eau : Q = 2,6 L/s, H = 5,0 cm, L = 7,5 cm ; v_a ≈ 0,69 m/s ; P_hyd ≈ 0,62 W ; 10 Ω : U = 0,85 V, I = 50 mA, P_élec ≈ 0,074 W ; N = 17 tr/min, r = 17 cm.

const SceneCanal = () => (
  <Schema h={196} titre="Centrale au fil de l'eau : le courant du canal, à la vitesse va, pousse les aubes d'une roue qui entraîne un alternateur">
    <rect x="8" y="124" width="342" height="52" fill="#bae6fd" />
    <line x1="8" y1="124" x2="350" y2="124" stroke={COUL.eau} strokeWidth="2.5" />
    <line x1="8" y1="176" x2="350" y2="176" stroke="#334155" strokeWidth="3" />
    <Fl x1="20" y1="158" x2="120" y2="158" c="B" e={2} />
    <Vs x={70} y={146} s="v" sub="a" c={COUL.eau} />
    <T x="300" y="150" s="canal" w={600} c="#475569" />
    <circle cx="200" cy="106" r="46" fill="none" stroke="#334155" strokeWidth="2" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map(a => <g key={a}><line x1="200" y1="106" x2={200 + 46 * Math.cos(a * Math.PI / 180)} y2={106 + 46 * Math.sin(a * Math.PI / 180)} stroke="#94a3b8" strokeWidth="2" /><circle cx={200 + 46 * Math.cos(a * Math.PI / 180)} cy={106 + 46 * Math.sin(a * Math.PI / 180)} r="6" fill={COUL.eau} /></g>)}
    <T x="200" y="40" s="roue à aubes" />
    <line x1="246" y1="106" x2="288" y2="86" stroke="#334155" strokeWidth="4" />
    <rect x="288" y="58" width="62" height="56" rx="8" fill="#e0e7ff" stroke="#334155" strokeWidth="2" />
    <T x="319" y="82" s="alter-" /><T x="319" y="100" s="nateur" />
  </Schema>
);

const SceneSection = () => (
  <Schema h={196} titre="Section du canal : un rectangle de hauteur H égale à 5,0 cm et de largeur L égale à 7,5 cm, traversé par l'eau à la vitesse va">
    <rect x="100" y="34" width="150" height="100" fill="#bae6fd" stroke="#334155" strokeWidth="2.5" />
    <circle cx="175" cy="84" r="16" fill="#fff" stroke={COUL.eau} strokeWidth="2.5" /><circle cx="175" cy="84" r="4.5" fill={COUL.eau} />
    <Vs x={175} y={118} s="v" sub="a" c={COUL.eau} />
    <T x="175" y="24" s="L = 7,5 cm" />
    <T x="92" y="88" s="H = 5,0 cm" a="end" />
    <T x="175" y="160" s="S = H × L = 3,75 × 10⁻³ m²" c={COUL.orange} />
    <T x="175" y="184" s="⊙ : l'eau avance vers vous" w={600} c="#475569" f={13} />
  </Schema>
);

export const production3 = [
  { id: 'principe', titre: 'Une centrale au fil de l’eau', corps: <>
    <SceneCanal />
    <Memo>Pas de barrage : on récupère la vitesse de l’eau, pas sa hauteur de chute.</Memo>
  </> },
  { id: 'debit', titre: 'Débit et vitesse de l’eau', corps: <>
    <SceneSection />
    <Fm>{'Q_V = {m|ρ * Δt}'}</Fm>
    <Fm>{'S = H * L'}</Fm>
    <Fm>{'v_a = {Q_V|S}'}</Fm>
    <Grandeurs lignes={[['Q_V', 'débit volumique', 'm³/s'], ['m', 'masse d’eau recueillie', 'kg'], ['ρ', 'masse volumique : 1 000', 'kg/m³'], ['Δt', 'durée', 's'], ['S', 'section du canal', 'm²'], ['v_a', 'vitesse de l’eau', 'm/s']]} />
    <Exemple><Fi>{'Q_V = 2,6 [L/s] = 2,6 × 10^-3 [m³/s]'}</Fi> et <Fi>{'S = 3,75 × 10^-3 [m²]'}</Fi> donnent <Fi>{'v_a = {2,6 × 10^-3|3,75 × 10^-3} ≈ 0,69 [m/s]'}</Fi>.</Exemple>
    <Memo>Les masses se pèsent, les volumes se calculent : on convertit la masse d’eau en volume avec ρ (15 kg d’eau → 0,015 m³).</Memo>
  </> },
  { id: 'puissances', titre: 'Puissance de l’eau, puissance électrique, rendement', corps: <>
    <BarrePertes titre="De 0,62 W apportés par l'eau, 0,074 W sont récupérés sur une charge de 10 ohms, soit un rendement d'environ 12 %" haut="0,62 W apportés par l'eau" utile="0,074 W utiles (≈ 12 %)" perdu="≈ 0,55 W perdus" frac={0.12} />
    <Fm>{'P_hyd = {1|2} * ρ * S * v_a^3'}</Fm>
    <Fm>{'P_élec = √{3} * U * I'}</Fm>
    <Fm>{'η = {P_élec|P_hyd}'}</Fm>
    <Grandeurs lignes={[['P_hyd', 'puissance cinétique de l’eau', 'W'], ['P_élec', 'puissance électrique', 'W'], ['U', 'tension entre deux phases', 'V'], ['I', 'intensité dans une phase', 'A'], ['η', 'rendement', '%']]} />
    <Exemple><Fi>{'P_hyd = {1|2} * ρ * S * v_a^3 ≈ 0,62 [W]'}</Fi>. Sur 10 Ω : <Fi>{'U = 0,85 [V]'}</Fi>, <Fi>{'I = 50 [mA]'}</Fi>, donc <Fi>{'P_élec ≈ 0,074 [W]'}</Fi> et <Fi>{'η ≈ 12 [%]'}</Fi>.</Exemple>
    <Memo>La vitesse est au cube : une eau deux fois plus rapide apporte huit fois plus de puissance.</Memo>
  </> },
  { id: 'optimum', titre: 'Le réglage optimal de la roue', corps: <>
    <TroisVitesses sousJ="a" sousA="pale" bloquee="roue bloquée" trop="roue emballée" titre="Trois cas dans le même courant d'eau : roue bloquée, pale à la moitié de la vitesse de l'eau (maximum), pale aussi rapide que l'eau. Les flèches sont proportionnelles aux vitesses" />
    <Fm>{'v_pale = r * {2π * n|60}'}</Fm>
    <Grandeurs lignes={[['v_pale', 'vitesse d’une pale', 'm/s'], ['r', 'rayon de la roue : 17 cm', 'm'], ['n', 'vitesse de rotation', 'tr/min'], ['v_a', 'vitesse de l’eau', 'm/s']]} />
    <Exemple><Fi>{'v_pale = 0,17 × {2π × 17|60} ≈ 0,30 [m/s]'}</Fi>, soit environ <Fi>{'{0,30|0,69} ≈ 0,4'}</Fi> de <Fi>{'v_a'}</Fi> : proche de la moitié.</Exemple>
    <Memo>Ni bloquée, ni emportée : la pale va à peu près à la moitié de la vitesse de l’eau.</Memo>
  </> },
];
