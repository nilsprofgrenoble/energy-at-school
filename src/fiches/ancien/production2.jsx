import { Eq, V, Def, Donnees, Methode, Retenir, Chaine } from '../elements';

// Fiche « Banc Pelton » (HM 150.19) : débit 15 L/min, p = 1,0 bar → P_hyd = 25 W ; 1600 tr/min à vide ; rendement maximal 48 %.
export const production2 = [
  { id: 'banc', titre: 'Le banc et sa chaîne', corps: <>
    <Chaine titre="Chaîne énergétique du banc Pelton" boites={[
      { nom: 'Eau sous pression', forme: 'P hydraulique' },
      { nom: 'Roue à augets', forme: 'P mécanique' },
      { nom: 'Frein à bande', forme: 'charge (couple C)' }]}
      fleches={['jet', 'rotation']} pertes={['', 'frottements', 'chaleur']} />
    <Def terme="Tuyère à aiguille">règle le débit et accélère le jet.</Def>
    <Def terme="Frein à bande">joue le rôle de la charge : le serrer, c'est brancher un appareil plus gourmand sur l'alternateur d'une vraie centrale.</Def>
  </> },
  { id: 'hydraulique', titre: 'Puissance hydraulique', corps: <>
    <Eq legende="1 L = 10⁻³ m³ ; 1 min = 60 s"><V s="Q" i="V" /> = 15 L/min = 15 × 10⁻³ / 60 = 2,5 × 10⁻⁴ m³·s⁻¹</Eq>
    <Eq legende={<>p en Pa (1 bar = 10⁵ Pa)</>}><V s="P" i="hyd" /> = <V s="p" /> × <V s="Q" i="V" /> = 10⁵ × 2,5 × 10⁻⁴ = 25 W</Eq>
    <Retenir>Deux conversions à ne pas oublier : litres → m³ et minutes → secondes.</Retenir>
  </> },
  { id: 'couple', titre: 'Couple et puissance mécanique', corps: <>
    <Eq legende={<>D = 5,0 cm = 0,050 m (diamètre de la poulie) ; F<sub>1</sub>, F<sub>2</sub> lues sur les dynamomètres</>}><V s="C" /> = (<V s="F" i="1" /> − <V s="F" i="2" />) × <V s="D" /> / 2</Eq>
    <Eq legende="n en tr/min : ω en rad·s⁻¹"><V s="ω" /> = 2π × <V s="n" /> / 60</Eq>
    <Eq><V s="P" i="méca" /> = <V s="C" /> × <V s="ω" /></Eq>
    <Donnees lignes={[['Exemple', <>F<sub>1</sub> = 4,0 N ; F<sub>2</sub> = 1,0 N → C = 3,0 × 0,025 = 0,075 N·m</>], ['À vide', 'le frein est relâché : C = 0, donc P = 0']]} />
  </> },
  { id: 'vitesses', titre: 'Vitesses de l\'auget et du jet', corps: <>
    <Eq legende="r = 5,00 cm = 0,0500 m ; n en tr/min"><V s="v" i="auget" /> = <V s="r" /> × <V s="ω" /> = <V s="r" /> × 2π × <V s="n" /> / 60</Eq>
    <Donnees lignes={[['Jet à la sortie de la tuyère', 'environ 14 m·s⁻¹'], ['Roue à vide', '1600 tr/min'], ['Pourquoi la roue va moins vite que le jet ?', 'frottements (paliers, air, éclaboussures)']]} />
  </> },
  { id: 'rendement', titre: 'Rendement et vitesse optimale', corps: <>
    <Eq><V s="η" /> = <V s="P" i="méca" /> / <V s="P" i="hyd" /></Eq>
    <Donnees lignes={[['Rendement maximal du banc', 'environ 48 %'], ['Vitesse optimale', 'environ la moitié de la vitesse à vide'], ['Débit plus faible', 'puissance plus faible, à vitesse égale']]} />
    <Retenir>Trop vite, la roue ne freine plus l'eau ; trop lentement, elle ne transforme presque rien en mouvement. Le meilleur compromis est au milieu.</Retenir>
  </> },
  { id: 'synthese', titre: 'En une minute', synthese: true, corps: <>
    <Methode etapes={[
      <><V s="P" i="hyd" /> = p × <V s="Q" i="V" />, en unités SI.</>,
      <>Freiner : <V s="C" /> = (F<sub>1</sub> − F<sub>2</sub>) × D/2, puis <V s="P" i="méca" /> = C × ω.</>,
      <>Rendement <V s="η" /> = P<sub>méca</sub> / P<sub>hyd</sub> ; maximum vers la moitié de la vitesse à vide.</>]} />
  </> },
];
