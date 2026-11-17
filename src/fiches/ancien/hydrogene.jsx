import { Eq, V, Def, Donnees, Methode, Retenir, Chaine } from '../elements';

// Fiche « Hydrogène » : électrolyse, loi de Faraday, rendement de l'électrolyseur, pile à combustible (banc : 10 cellules de 25 cm²).
// Constantes de la simulation : F = 96 485 C/mol ; Vm = 24 L/mol (20 °C) ; ΔH = 285 kJ/mol ; ΔH/2F ≈ 1,48 V.
export const hydrogene = [
  { id: 'chaine', titre: 'Le dihydrogène, vecteur d\'énergie', corps: <>
    <Chaine titre="De l'énergie solaire au moteur par le dihydrogène" boites={[
      { nom: 'Panneau solaire', forme: 'électrique' },
      { nom: 'Électrolyseur', forme: 'chimique (H₂)' },
      { nom: 'Pile à combustible', forme: 'électrique' },
      { nom: 'Moteur', forme: 'mécanique' }]}
      fleches={['', 'stockage', '']} pertes={['', 'chaleur', 'chaleur', '']} couleur="#16a34a" />
    <Def terme="Vecteur d'énergie">il stocke et transporte l'énergie, il ne la crée pas : le dihydrogène n'existe pas à l'état pur dans la nature, il faut le fabriquer.</Def>
  </> },
  { id: 'electrolyse', titre: 'L\'électrolyse de l\'eau', corps: <>
    <Eq>2 H₂O → 2 H₂ + O₂</Eq>
    <Donnees lignes={[['Cathode (−)', '2 H⁺ + 2 e⁻ → H₂'], ['Anode (+)', 'H₂O → 2 H⁺ + ½ O₂ + 2 e⁻'], ['Volumes de gaz', 'V(H₂) ≈ 2 × V(O₂)'], ['Électrons', '2 e⁻ par H₂ ; 4 e⁻ par O₂']]} />
    <Retenir>Moins de lumière sur le panneau, moins de courant : moins d'électrons, donc moins de gaz.</Retenir>
  </> },
  { id: 'faraday', titre: 'Loi de Faraday', corps: <>
    <Eq legende="F = 96 485 C·mol⁻¹ ; I en A ; Δt en s"><V s="n" />(e⁻) = <V s="I" /> × Δ<V s="t" /> / <V s="F" /></Eq>
    <Eq><V s="n" />(H₂) = <V s="I" /> × Δ<V s="t" /> / (2<V s="F" />)</Eq>
    <Eq legende="gaz parfait, 20 °C, pression atmosphérique : V en L"><V s="n" /> = <V s="V" /> / <V s="V" i="m" />, avec <V s="V" i="m" /> = 24 L·mol⁻¹</Eq>
    <Donnees lignes={[['Rendement faradique', 'n(H₂) mesurée / n(H₂) attendue ; ≈ 72 % pour la maquette'], ['À ne pas confondre', '22,4 L·mol⁻¹ vaut à 0 °C']]} />
    <Retenir>Penser aux unités : mL → L, minutes → secondes.</Retenir>
  </> },
  { id: 'electrolyseur', titre: 'Rendement de l\'électrolyseur', corps: <>
    <Methode etapes={[<>Puissance reçue : <V s="P" /> = <V s="U" /> × <V s="I" /> (W).</>, <>Énergie consommée : <V s="E" /> = <V s="P" /> × Δ<V s="t" /> (J).</>, <>Énergie stockée : <V s="E" i="stockée" /> = <V s="n" />(H₂) × 285 000 J·mol⁻¹.</>, <>Rendement : <V s="η" /> = <V s="E" i="stockée" /> / <V s="E" i="consommée" />.</>]} />
    <Retenir>L'énergie se conserve : ce qui n'est pas stocké dans le dihydrogène est dissipé en chaleur.</Retenir>
  </> },
  { id: 'pile', titre: 'La pile à combustible', corps: <>
    <Eq>2 H₂ + O₂ → 2 H₂O</Eq>
    <Eq legende={<>ΔH = 285 kJ·mol⁻¹ ; U<sub>cellule</sub> : tension d'une seule cellule</>}><V s="η" /> = <V s="U" i="cellule" /> / (ΔH / 2<V s="F" />) , avec ΔH / 2<V s="F" /> = 285 000 / (2 × 96 485) ≈ 1,48 V</Eq>
    <Donnees lignes={[['Banc de l\'Ense³', '10 cellules en série, 25 cm² chacune'], ['Tension d\'une cellule', 'U_pile / 10'], ['Densité de courant', 'J = I / S ; exemple : 10 A / 25 cm² = 0,4 A·cm⁻²'], ['Courant qui augmente', 'la tension diminue'], ['Rendement', 'meilleur à faible courant ; puissance maximale entre court-circuit et circuit ouvert']]} />
    <Retenir>Il faut choisir entre rendement (faible courant) et puissance (courant plus fort).</Retenir>
  </> },
  { id: 'synthese', titre: 'En une minute', synthese: true, corps: <>
    <Methode etapes={[<>Électrolyse : 2 H₂O → 2 H₂ + O₂ ; n(H₂) = I Δt / (2F).</>, <>Stocker : E = n × 285 kJ·mol⁻¹ ; η électrolyseur = E<sub>stockée</sub> / E<sub>consommée</sub>.</>, <>Pile : 2 H₂ + O₂ → 2 H₂O ; η = U<sub>cellule</sub> / 1,48 V.</>, <>Le reste de l'énergie part en chaleur.</>]} />
  </> },
];
