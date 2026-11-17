import { Eq, V, Def, Donnees, Methode, Retenir, Chaine } from '../elements';

// Fiche « Au fil de l'eau » : Q = 2,6 L/s, H = 5,0 cm, L = 7,5 cm ; P_hyd ≈ 0,62 W ; 10 Ω : U = 0,85 V, I = 50 mA, N = 17 tr/min.
export const production3 = [
  { id: 'principe', titre: 'Une centrale au fil de l\'eau', corps: <>
    <Chaine titre="Chaîne énergétique au fil de l'eau" boites={[
      { nom: 'Eau du canal', forme: 'énergie cinétique' },
      { nom: 'Roue à aubes', forme: 'énergie mécanique' },
      { nom: 'Alternateur triphasé', forme: 'énergie électrique' }]}
      fleches={['poussée', 'rotation']} pertes={['', 'frottements', 'pertes']} />
    <Def terme="Au fil de l'eau">pas de barrage : on utilise directement le courant, donc surtout l'énergie cinétique de l'eau (sa vitesse), pas sa hauteur de chute.</Def>
  </> },
  { id: 'debit', titre: 'Débit et vitesse de l\'eau', corps: <>
    <Eq legende={<>ρ = 1,0 × 10³ kg·m⁻³ ; m en kg ; Δt en s</>}><V s="Q" i="V" /> = <V s="V" /> / Δ<V s="t" /> = <V s="m" /> / (ρ × Δ<V s="t" />)</Eq>
    <Eq legende="S = H × L, en m² (5,0 cm = 0,050 m)"><V s="Q" i="V" /> = <V s="v" i="a" /> × <V s="S" /></Eq>
    <Donnees lignes={[['Section du canal', 'H = 5,0 cm ; L = 7,5 cm ; S = 3,75 × 10⁻³ m²'], ['Débit', 'Q_V = 2,6 L/s = 2,6 × 10⁻³ m³·s⁻¹'], ['Vitesse de l\'eau', 'v_a ≈ 0,69 m·s⁻¹']]} />
    <Retenir>Les masses se pèsent, les volumes se calculent : 15 kg d'eau = 0,015 m³.</Retenir>
  </> },
  { id: 'puissance', titre: 'Puissance de l\'eau et puissance électrique', corps: <>
    <Eq legende="énergie cinétique transportée chaque seconde"><V s="P" i="hyd" /> = ½ × ρ × <V s="S" /> × <V s="v" i="a" />³</Eq>
    <Eq legende="alternateur triphasé : U entre deux phases, I dans une phase"><V s="P" i="élec" /> = √3 × <V s="U" /> × <V s="I" /></Eq>
    <Donnees lignes={[['Puissance de l\'eau', 'P_hyd ≈ 0,62 W'], ['Charge de 10 Ω', 'U = 0,85 V ; I = 50 mA'], ['Puissance électrique', 'P_élec ≈ 0,07 W'], ['Rendement', 'η = P_élec / P_hyd ≈ 12 %']]} />
    <Retenir>La vitesse est au cube : une eau deux fois plus rapide apporte huit fois plus de puissance.</Retenir>
  </> },
  { id: 'optimum', titre: 'Le point de fonctionnement optimal', corps: <>
    <Methode etapes={['Chronométrer 5 tours de roue : N = 5 / Δt × 60 en tr/min.', 'Calculer ω = 2π × N / 60, puis v_pale = r × ω (r = 17 cm).', 'Comparer v_pale à la vitesse de l\'eau v_a.']} />
    <Donnees lignes={[['Circuit ouvert', 'I = 0, donc P = 0'], ['Court-circuit', 'U = 0, donc P = 0'], ['Maximum de puissance', 'la pale va environ deux fois moins vite que l\'eau']]} />
    <Retenir>Trop lente, la pale freine l'eau sans avancer ; trop rapide, l'eau ne la pousse plus.</Retenir>
  </> },
  { id: 'synthese', titre: 'En une minute', synthese: true, corps: <>
    <Methode etapes={[
      <>Débit : <V s="Q" i="V" /> = m / (ρ Δt), puis v<sub>a</sub> = Q<sub>V</sub> / (H × L).</>,
      <>Puissance de l'eau : ½ ρ S v<sub>a</sub>³ ; puissance électrique : √3 U I.</>,
      <>Rendement = P<sub>élec</sub> / P<sub>hyd</sub> (≈ 12 % à 10 Ω) ; maximum de puissance quand la pale va à peu près à la moitié de la vitesse de l'eau.</>]} />
  </> },
];
