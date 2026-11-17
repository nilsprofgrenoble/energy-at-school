import { Fm, Fi, Grandeurs, Exemple, Memo, FauxVrai, Def, Flux, Schema, T, Fl, Boite, COUL, Courbe, Cas } from '../elements';

// Fiche « Turbine Pelton » : valeurs de la simulation (p ≈ 2,7 bar ; Q_V ≈ 6,7·10⁻⁵ m³/s ; P_hyd ≈ 18 W ; 4 paires de pôles ; jet Ø 2,0 mm ; auget à 4,0 cm).
// Courbe de rendement : mêmes points que la simulation (U en V, η en %).
const COURBE_ETA = [[0, 0], [1, 3.0], [1.9, 5.25], [3, 7.45], [4, 8.85], [4.8, 9.3], [5.6, 9.3], [6.2, 8.6], [6.9, 7.5], [7.4, 5.7], [8.7, 0]];

const SceneChaine = () => (
  <Schema h={214} titre="Chaîne de la turbine Pelton : l'eau sous pression arrive par la conduite forcée, sort en jet, fait tourner la roue à augets qui entraîne l'alternateur">
    <rect x="8" y="52" width="112" height="26" fill="#bae6fd" stroke={COUL.eau} strokeWidth="2.5" />
    <circle cx="44" cy="34" r="12" fill="#fff" stroke="#334155" strokeWidth="2" /><line x1="44" y1="46" x2="44" y2="52" stroke="#334155" strokeWidth="2" />
    <T x="44" y="39" s="p" f={14} /><T x="100" y="30" s="manomètre" a="middle" f={13} w={600} c="#475569" />
    <T x="64" y="98" s="conduite forcée" f={13} />
    <polygon points="120,52 152,58 152,72 120,78" fill="#7dd3fc" stroke={COUL.eau} strokeWidth="2" />
    <Fl x1="152" y1="65" x2="216" y2="68" c="B" e={4} /><T x="184" y="56" s="jet" c={COUL.eau} />
    <circle cx="240" cy="108" r="38" fill="#f1f5f9" stroke="#334155" strokeWidth="2.5" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map(a => <circle key={a} cx={240 + 38 * Math.cos(a * Math.PI / 180)} cy={108 + 38 * Math.sin(a * Math.PI / 180)} r="7" fill={COUL.eau} />)}
    <T x="240" y="113" s="roue" f={13} />
    <line x1="278" y1="108" x2="300" y2="108" stroke="#334155" strokeWidth="5" />
    <rect x="300" y="84" width="54" height="48" rx="8" fill="#e0e7ff" stroke="#334155" strokeWidth="2" />
    <T x="327" y="105" s="alter-" /><T x="327" y="121" s="nateur" />
    <T x="240" y="160" s="roue à augets" /><T x="327" y="148" s="(4 paires" w={600} c="#475569" /><T x="327" y="163" s="de pôles)" w={600} c="#475569" />
    <rect x="2" y="174" width="108" height="36" rx="10" fill="#e0f2fe" stroke={COUL.eau} strokeWidth="2" /><T x="56" y="190" s="énergie" /><T x="56" y="205" s="hydraulique" />
    <Fl x1="112" y1="192" x2="130" y2="192" />
    <rect x="132" y="174" width="96" height="36" rx="10" fill="#ede9fe" stroke={COUL.violet} strokeWidth="2" /><T x="180" y="190" s="énergie" /><T x="180" y="205" s="mécanique" />
    <Fl x1="230" y1="192" x2="248" y2="192" />
    <rect x="250" y="174" width="108" height="36" rx="10" fill="#ffedd5" stroke={COUL.orange} strokeWidth="2" /><T x="304" y="190" s="énergie" /><T x="304" y="205" s="électrique" />
  </Schema>
);

const SceneDebit = () => (
  <Schema h={176} titre="Deux mesures : le temps de remplissage d'un seau de 1 litre donne le débit, le manomètre donne la pression">
    <T x="90" y="20" s="Mesurer le débit" c={COUL.eau} />
    <path d="M44 48 L136 48 L124 128 L56 128 Z" fill="#fff" stroke="#334155" strokeWidth="2.5" />
    <path d="M52 98 L128 98 L124 128 L56 128 Z" fill="#7dd3fc" />
    <line x1="90" y1="26" x2="90" y2="46" stroke={COUL.eau} strokeWidth="4" /><Fl x1="90" y1="30" x2="90" y2="62" c="B" e={3.5} />
    <T x="90" y="82" s="V = 1 L" /><T x="90" y="150" s="durée Δt ≈ 15 s" c={COUL.orange} />
    <T x="270" y="20" s="Mesurer la pression" c={COUL.eau} />
    <circle cx="270" cy="76" r="40" fill="#fff" stroke="#334155" strokeWidth="2.5" />
    <line x1="270" y1="76" x2="292" y2="52" stroke={COUL.rouge} strokeWidth="4" strokeLinecap="round" />
    <circle cx="270" cy="76" r="5" fill="#334155" />
    <T x="270" y="104" s="bar" w={600} c="#475569" /><T x="270" y="150" s="p ≈ 2,7 bar" c={COUL.orange} />
    <T x="180" y="172" s="⟹ puissance hydraulique ≈ 18 W" f={13} c={COUL.encre} />
  </Schema>
);

const SceneCircuit = () => (
  <Schema h={238} titre="Circuit de mesure : l'ampèremètre A mesure l'intensité I, le voltmètre V la tension U aux bornes de la charge. En dessous, la barre montre que 18 W arrivent et seulement 1,7 W sont récupérés">
    <rect x="46" y="26" width="262" height="76" fill="none" stroke="#334155" strokeWidth="2.5" />
    <circle cx="46" cy="64" r="20" fill="#e0e7ff" stroke="#334155" strokeWidth="2.5" /><T x="46" y="70" s="~" f={20} />
    <T x="46" y="122" s="alternateur" />
    <circle cx="140" cy="26" r="14" fill="#fff" stroke={COUL.orange} strokeWidth="2.5" /><T x="140" y="31" s="A" c={COUL.orange} f={14} />
    <T x="140" y="12" s="mesure I" c={COUL.orange} />
    <line x1="236" y1="26" x2="236" y2="48" stroke="#334155" strokeWidth="2.5" /><line x1="236" y1="80" x2="236" y2="102" stroke="#334155" strokeWidth="2.5" />
    <circle cx="236" cy="64" r="15" fill="#fff" stroke={COUL.eau} strokeWidth="2.5" /><T x="236" y="69" s="V" c={COUL.eau} f={14} />
    <T x="200" y="86" s="mesure U" c={COUL.eau} a="end" />
    <rect x="296" y="42" width="24" height="44" fill="#fff" stroke="#334155" strokeWidth="2.5" /><T x="308" y="120" s="charge" />
    <T x="180" y="150" s="18 W apportés par l'eau" f={14} />
    <rect x="10" y="158" width="340" height="30" fill="#fecaca" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="5 3" />
    <rect x="10" y="158" width="32" height="30" fill={COUL.orange} />
    <T x="10" y="208" s="1,7 W utiles" c={COUL.orange} a="start" /><T x="200" y="178" s="≈ 16 W perdus (chaleur, frottements)" c="#991b1b" />
    <T x="10" y="226" s="(≈ 9 %)" c={COUL.orange} w={600} a="start" />
  </Schema>
);

const SceneOscillo = () => (
  <Schema h={206} titre="Écran d'oscilloscope : une période T s'étend sur 4 divisions de 25 ms, soit 100 ms">
    <rect x="20" y="14" width="320" height="120" fill="#f8fafc" stroke="#334155" strokeWidth="2.5" />
    {[1, 2, 3, 4, 5, 6, 7].map(k => <line key={k} x1={20 + k * 40} y1="14" x2={20 + k * 40} y2="134" stroke="#e2e8f0" />)}
    {[1, 2, 3].map(k => <line key={k} x1="20" y1={14 + k * 30} x2="340" y2={14 + k * 30} stroke="#e2e8f0" />)}
    <line x1="20" y1="74" x2="340" y2="74" stroke="#cbd5e1" strokeWidth="2" />
    <path d={`M20 74 ${Array.from({ length: 81 }, (_, k) => { const x = 20 + k * 4; return `L${x} ${74 - 40 * Math.sin(2 * Math.PI * (x - 20) / 160)}`; }).join(' ')}`} fill="none" stroke={COUL.eau} strokeWidth="3.5" />
    <Fl x1="20" y1="148" x2="180" y2="148" c="O" /><Fl x1="180" y1="148" x2="20" y2="148" c="O" />
    <T x="100" y="168" s="une période T" c={COUL.orange} />
    <T x="180" y="190" s="4 divisions × 25 ms/div = 100 ms" f={13} />
  </Schema>
);

export const production1 = [
  { id: 'chaine', titre: 'De l’eau au courant électrique', corps: <>
    <SceneChaine />
    <Memo>L’eau pousse, la roue tourne, l’alternateur éclaire.</Memo>
  </> },
  { id: 'rendement', titre: 'Puissance de l’eau, puissance électrique, rendement', corps: <>
    <SceneCircuit />
    <Fm>{'P_hyd = p * {V|Δt}'}</Fm>
    <Fm>{'P_élec = U * I'}</Fm>
    <Fm>{'η = {P_élec|P_hyd}'}</Fm>
    <Grandeurs lignes={[['P_hyd', 'puissance de l’eau', 'W'], ['p', 'pression de l’eau', 'Pa'], ['V', 'volume recueilli en Δt', 'm³'], ['Δt', 'durée de remplissage', 's'], ['P_élec', 'puissance électrique', 'W'], ['U', 'tension aux bornes de la charge', 'V'], ['I', 'intensité du courant', 'A'], ['η', 'rendement, toujours < 1', '%']]} />
    <Exemple>1 L en 15 s et 2,7 bar : <Fi>{'P_hyd = 2,7 × 10^5 × {1,0 × 10^-3|15} ≈ 18 [W]'}</Fi>. Avec <Fi>{'U = 4,8 [V]'}</Fi> et <Fi>{'I = 0,35 [A]'}</Fi> : <Fi>{'P_élec ≈ 1,7 [W]'}</Fi>, donc <Fi>{'η ≈ {1,7|18} ≈ 9 [%]'}</Fi>.</Exemple>
    <Memo>Rendement = ce qu’on récupère ÷ ce qu’on apporte. Convertir : 1 bar = 10⁵ Pa, 1 L = 10⁻³ m³.</Memo>
  </> },
  { id: 'maximum', titre: 'Le point de fonctionnement optimal', corps: <>
    <Courbe titre="Rendement de la turbine en fonction de la tension U : il est nul en court-circuit et en circuit ouvert, et maximal (environ 9 %) vers 5 V" h={230}
      pts={COURBE_ETA} xmax={9} ymax={11} ticksX={[0, 2, 4, 6, 8]} ticksY={[0, 5, 10]} xlab="U (V)" ylab="η (%)"
      reperes={[{ x: 5.2, y: 9.3, texte: 'maximum ≈ 9 %', ty: 40 }]}
      dessous={[{ x: 46, texte: 'court-circuit', a: 'start' }, { x: 340, texte: 'circuit ouvert', a: 'end' }]} />
    <FauxVrai faux="Plus la tension est grande, plus la puissance est grande." vrai="Court-circuit (U = 0) et circuit ouvert (I = 0) donnent tous deux P = 0 : le maximum est entre les deux." />
    <Memo>Ni ouvert, ni fermé : l’optimum est au milieu.</Memo>
  </> },
  { id: 'pelton', titre: 'Le secret de la turbine Pelton', corps: <>
    <Cas h={176} titre="Trois cas : roue bloquée, roue à la moitié de la vitesse du jet (maximum), roue aussi rapide que le jet"
      cas={[{ titre: 'roue bloquée', verdict: '✗ rien récupéré', verdict2: 'roue immobile' }, { titre: 'roue à la moitié', titre2: 'de la vitesse du jet', bon: true, verdict: '✓ maximum', verdict2: 'bon compromis' }, { titre: 'roue aussi rapide', titre2: 'que le jet', verdict: '✗ rien récupéré', verdict2: 'plus de poussée' }]}
      dessin={(c, k, w) => <g><Fl x1="14" y1="86" x2={w / 2 - 6} y2="86" c="B" e={4} /><circle cx={w / 2 + 14} cy="86" r="22" fill="#f1f5f9" stroke="#334155" strokeWidth="2.5" />
        {k === 1 && <path d={`M${w / 2 + 2} 66 A22 22 0 0 1 ${w / 2 + 30} 70`} fill="none" stroke={COUL.vert} strokeWidth="3" markerEnd="url(#ahG)" />}
        {k === 2 && <path d={`M${w / 2 + 2} 66 A22 22 0 0 1 ${w / 2 + 34} 78`} fill="none" stroke={COUL.rouge} strokeWidth="4" markerEnd="url(#ahR)" />}
        <T x={w / 2 + 14} y="92" s={k === 0 ? '0' : k === 1 ? 'v/2' : 'v'} w={800} f={13} /></g>} />
    <Fm>{'v_jet = {Q_V|π * r^2}'}</Fm>
    <Fm>{'v_auget = 2 * π * r * n'}</Fm>
    <Grandeurs lignes={[['v_jet', 'vitesse du jet (v sur le schéma)', 'm/s'], ['Q_V', 'débit volumique', 'm³/s'], ['r', 'rayon : 1,0 mm (jet), 4,0 cm (roue)', 'm'], ['v_auget', 'vitesse de l’auget', 'm/s'], ['n', 'vitesse de rotation', 'tr/s']]} />
    <Exemple><Fi>{'v_jet = {6,7 × 10^-5|π × (1,0 × 10^-3)^2} ≈ 21 [m/s]'}</Fi> : au maximum, l’auget va à environ 11 m/s.</Exemple>
    <Memo>Au rendement maximal, l’auget va à peu près à la moitié de la vitesse du jet.</Memo>
  </> },
];
