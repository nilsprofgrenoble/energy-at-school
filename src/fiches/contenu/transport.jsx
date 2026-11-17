import { Eq, V, Def, Donnees, Methode, Retenir, Chaine } from '../elements';

// Fiche « Réseau électrique » : ligne réelle (1 MW, 20 km, Al 150 mm²) et maquette (générateur ≈ 25 V, câbles de 10 m, deux transformateurs).
export const transport = [
  { id: 'chaine', titre: 'De la production aux habitations', corps: <>
    <Chaine titre="Chaîne de transport de l'électricité" boites={[
      { nom: 'Générateur', forme: 'tension fixe' },
      { nom: 'Transformateur 1', forme: 'élève la tension' },
      { nom: 'Ligne', forme: 'câbles' },
      { nom: 'Transformateur 2', forme: 'abaisse la tension' },
      { nom: 'Habitations', forme: '230 V' }]}
      pertes={['', 'pertes dans le noyau et les bobinages', 'effet Joule', 'pertes dans le noyau et les bobinages', '']} />
    <Def terme="Effet Joule">un câble a une résistance R : il chauffe et dissipe la puissance <V s="R" /> × <V s="I" />². C'est de l'énergie perdue.</Def>
    <Retenir>Pour le transport, la tension est libre : on l'élève pour que les pertes diminuent.</Retenir>
  </> },
  { id: 'formules', titre: 'Intensité, résistance, pertes', corps: <>
    <Eq legende="P en W, U en V, I en A"><V s="I" /> = <V s="P" /> / <V s="U" /></Eq>
    <Eq legende={<>ρ en Ω·m ; L = longueur totale (aller + retour) en m ; S en m²</>}><V s="R" /> = ρ × <V s="L" /> / <V s="S" /></Eq>
    <Eq><V s="P" i="J" /> = <V s="R" /> × <V s="I" />²</Eq>
    <Eq><V s="η" /> = (<V s="P" /> − <V s="P" i="J" />) / <V s="P" /></Eq>
    <Retenir>Le courant est au carré : multiplier la tension par k divise les pertes par k².</Retenir>
  </> },
  { id: 'exemple', titre: 'Exemple chiffré : 1 MW sur 20 km', corps: <>
    <Donnees lignes={[['Câble', 'aluminium, ρ = 2,8 × 10⁻⁸ Ω·m, S = 150 mm², L = 40 km (aller + retour)'], ['Résistance', 'R ≈ 7,5 Ω'],
      ['Ligne à 20 kV', 'I = 50 A ; P_J ≈ 19 kW ; η ≈ 98 %'], ['Ligne à 400 V', 'I = 2 500 A ; P_J ≈ 47 MW : plus que la puissance transportée, impossible'], ['Ligne à 400 kV', 'I = 2,5 A ; P_J ≈ 47 W']]} />
    <Retenir>De 400 V à 20 kV, la tension est multipliée par 50 : le courant est divisé par 50, les pertes par 50² = 2 500.</Retenir>
  </> },
  { id: 'transfo', titre: 'Le transformateur', corps: <>
    <Eq legende={<>N<sub>1</sub>, N<sub>2</sub> : nombres de spires (primaire, secondaire)</>}><V s="m" /> = <V s="N" i="2" /> / <V s="N" i="1" /> = <V s="U" i="2" /> / <V s="U" i="1" /> = <V s="I" i="1" /> / <V s="I" i="2" /></Eq>
    <Donnees lignes={[['Il modifie', 'la tension et l\'intensité (en sens inverses)'], ['Il ne modifie pas', 'la fréquence (50 Hz)'], ['Exemple', 'N₁ = 4, N₂ = 8, U₁ = 1,0 V → m = 2, U₂ = 2,0 V'], ['Deux transformateurs pour retrouver la tension de départ', 'm₁ × m₂ = 1']]} />
    <Retenir>Quand le transformateur élève la tension, il abaisse l'intensité dans le même rapport.</Retenir>
  </> },
  { id: 'maquette', titre: 'Sur la maquette de l\'Ense³', corps: <>
    <Methode etapes={[<>Mesurer V<sub>1</sub> et i<sub>1</sub> au générateur, V<sub>2</sub> et i<sub>2</sub> aux habitations.</>, <>Charge résistive : P<sub>1</sub> = V<sub>1</sub> × i<sub>1</sub> et P<sub>2</sub> = V<sub>2</sub> × i<sub>2</sub>.</>, <>Rendement du transport : <V s="η" /> = P<sub>2</sub> / P<sub>1</sub>.</>]} />
    <Donnees lignes={[['Générateur', 'environ 25 V'], ['Câbles', 'rouge 1,0 mm², bleu 1,5 mm², noir 2,5 mm² ; 10 m'], ['Meilleur réglage', 'm₁ : m₂ = 2 : 0,5'], ['Meilleur câble', 'le plus épais (noir), car R = ρL/S diminue']]} />
    <Retenir>Avec seulement 10 m de câble, les transformateurs perdent plus que les câbles. Sur une vraie ligne de plusieurs centaines de km, c'est l'inverse.</Retenir>
  </> },
  { id: 'compromis', titre: 'Le compromis', corps: <>
    <Donnees lignes={[['Section × 4', 'résistance ÷ 4, mais 4 fois plus d\'aluminium (coût, masse)'], ['Très haute tension (400 kV)', 'pertes minuscules, mais grands pylônes, grandes distances d\'isolement, transformateurs coûteux, danger'], ['Distribution', 'abaissement par étapes jusqu\'à 230 V']]} />
    <Retenir>Élever la tension est bien plus efficace que grossir les câbles : cela ne coûte pas d'aluminium.</Retenir>
  </> },
  { id: 'synthese', titre: 'En une minute', synthese: true, corps: <>
    <Methode etapes={[<>I = P / U, puis R = ρL / S, puis P<sub>J</sub> = R × I².</>, <>Tension × k → intensité ÷ k → pertes ÷ k².</>, <>Transformateur : m = U₂/U₁ = I₁/I₂ = N₂/N₁ ; la fréquence ne change pas.</>, <>Rendement du transport = puissance reçue / puissance produite.</>]} />
  </> },
];
