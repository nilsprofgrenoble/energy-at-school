import { Eq, V, Def, Donnees, Methode, Retenir, Chaine } from '../elements';

// Fiche « Turbine Pelton » : 5 cartes + synthèse. Valeurs tirées de la simulation (P_hyd ≈ 18 W, p = 4 paires de pôles, jet de 2,0 mm, auget à 4,0 cm).
export const production1 = [
  { id: 'chaine', titre: 'La chaîne énergétique', corps: <>
    <Chaine titre="Chaîne énergétique de la turbine Pelton" boites={[
      { nom: 'Eau sous pression', forme: 'énergie hydraulique' },
      { nom: 'Turbine Pelton', forme: 'énergie mécanique' },
      { nom: 'Alternateur', forme: 'énergie électrique' }]}
      fleches={['jet', 'rotation']} pertes={['', 'frottements', 'pertes']} />
    <Def terme="Conduite forcée">tuyau qui amène l'eau sous pression vers l'injecteur ; la pression s'y convertit en vitesse (le jet).</Def>
    <Def terme="Rendement">rapport entre la puissance utile et la puissance absorbée ; il est toujours inférieur à 1, car il y a des pertes.</Def>
  </> },
  { id: 'hydraulique', titre: 'Puissance hydraulique', corps: <>
    <Eq legende={<>Q<sub>V</sub> en m³·s⁻¹, V en m³, Δt en s</>}><V s="Q" i="V" /> = <V s="V" /> / Δ<V s="t" /></Eq>
    <Eq legende={<>P<sub>hyd</sub> en W, p en Pa, Q<sub>V</sub> en m³·s⁻¹</>}><V s="P" i="hyd" /> = <V s="p" /> × <V s="Q" i="V" /></Eq>
    <Donnees lignes={[['1 bar', '10⁵ Pa'], ['1 L', '10⁻³ m³'], ['Maquette', <>p ≈ 2,7 bar ; Q<sub>V</sub> ≈ 6,7 × 10⁻⁵ m³·s⁻¹ ; P<sub>hyd</sub> ≈ 18 W</>]]} />
    <Retenir>Convertir d'abord : bar → Pa, L → m³. Sans cela, le résultat est faux d'un facteur 1 000 ou 100 000.</Retenir>
  </> },
  { id: 'electrique', titre: 'Puissance électrique et rendement', corps: <>
    <Eq legende="valeurs efficaces, charge résistive"><V s="P" i="élec" /> = <V s="U" /> × <V s="I" /></Eq>
    <Eq><V s="η" /> = <V s="P" i="élec" /> / <V s="P" i="hyd" /></Eq>
    <Donnees lignes={[['Circuit ouvert', 'I = 0 A, donc P = 0'], ['Court-circuit', 'U = 0 V, donc P = 0'], ['Maximum de P', 'entre les deux, vers U ≈ 5 V'], ['Rendement maximal', 'de l\'ordre de 9 %']]} />
    <Retenir>La puissance passe par un maximum : c'est le point de fonctionnement optimal. Il se trouve entre le circuit ouvert et le court-circuit.</Retenir>
  </> },
  { id: 'oscillo', titre: 'L\'oscilloscope et l\'alternateur', corps: <>
    <Methode etapes={['Compter le nombre de divisions d\'une période T.', 'Multiplier par la base de temps (en s par division) : on obtient T en secondes.', 'Calculer f = 1 / T.']} />
    <Eq legende={<>n en tr·s⁻¹ ; p = nombre de paires de pôles</>}><V s="f" /> = <V s="n" /> × <V s="p" /></Eq>
    <Donnees lignes={[['Alternateur de la maquette', 'p = 4 paires de pôles'], ['Exemple', 'T = 100 ms → f = 10 Hz → n = 2,5 tr·s⁻¹']]} />
  </> },
  { id: 'pelton', titre: 'Le secret de la turbine Pelton', corps: <>
    <Eq legende={<>r = 4,0 cm = 0,040 m ; n en tr·s⁻¹</>}><V s="v" i="auget" /> = 2π × <V s="r" /> × <V s="n" /></Eq>
    <Eq legende={<>S = π r², avec r = 1,0 mm pour le jet</>}><V s="v" i="jet" /> = <V s="Q" i="V" /> / <V s="S" /></Eq>
    <Retenir>Au rendement maximal, l'auget va environ deux fois moins vite que le jet. Aussi rapide que le jet, la roue ne reçoit plus rien ; bloquée, elle ne récupère rien non plus.</Retenir>
  </> },
  { id: 'synthese', titre: 'En une minute', synthese: true, corps: <>
    <Methode etapes={[
      <>Débit : <V s="Q" i="V" /> = V / Δt, puis <V s="P" i="hyd" /> = p × <V s="Q" i="V" /> (en unités SI).</>,
      <>Mesurer U et I, puis <V s="P" i="élec" /> = U × I.</>,
      <>Rendement <V s="η" /> = P<sub>élec</sub> / P<sub>hyd</sub>, de l'ordre de 9 % ici.</>,
      <>Le maximum de puissance se trouve entre circuit ouvert et court-circuit ; l'auget y va à peu près à la moitié de la vitesse du jet.</>]} />
  </> },
];
