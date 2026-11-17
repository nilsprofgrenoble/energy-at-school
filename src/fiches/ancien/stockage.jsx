import { Eq, V, Def, Donnees, Methode, Retenir, SchemaCellule } from '../elements';

// Fiche « Batteries » : cellule Li-ion NMC (3,7 V nominale, 4,2 → 2,5 V), E = U × Q, densité en Wh/kg, assemblages et missions.
// Valeurs chiffrées calculées à partir du tableau de cellules de la simulation (CEA-Liten / INES, valeurs indicatives).
export const stockage = [
  { id: 'cellule', titre: 'Dans une cellule lithium-ion', corps: <>
    <SchemaCellule />
    <Def terme="Cellule">élément de base ; une <b>batterie</b> assemble plusieurs cellules.</Def>
    <Def terme="Séparateur">il laisse passer les ions mais pas les électrons : les électrons font le tour par le circuit extérieur, et c'est ce courant qui allume la lampe.</Def>
    <Retenir>Chaque ion Li⁺ qui traverse s'accompagne d'un électron dans le circuit.</Retenir>
  </> },
  { id: 'charge', titre: 'Décharge, charge, tension', corps: <>
    <Donnees lignes={[['Décharge', 'spontanée : Li⁺ de l\'électrode − vers l\'électrode +'], ['Charge', 'forcée par un chargeur : ions et électrons reviennent vers l\'électrode −'], ['Anode / cathode', 'les noms suivent la réaction (oxydation / réduction) : ils changent entre charge et décharge ; les bornes + et − ne changent pas'],
      ['Tension de la cellule', 'de 4,2 V (chargée) à 2,5 V (vide) ; nominale : 3,7 V'], ['BMS', 'le système de gestion coupe la décharge vers 2,5 V pour protéger la cellule']]} />
  </> },
  { id: 'grandeurs', titre: 'Capacité, énergie, densité', corps: <>
    <Eq legende="Q en Ah, I en A, t en h"><V s="t" /> = <V s="Q" /> / <V s="I" /></Eq>
    <Eq legende="U en V, Q en Ah → E en Wh"><V s="E" /> = <V s="U" /> × <V s="Q" /></Eq>
    <Eq legende="m en kg (45 g = 0,045 kg)">densité massique = <V s="E" /> / <V s="m" /> (en Wh/kg)</Eq>
    <Donnees lignes={[['1 Ah', '3 600 C'], ['Exemple NMC 18650', 'U = 3,7 V ; Q = 2,03 Ah ; m = 45,4 g → E ≈ 7,5 Wh ≈ 165 Wh/kg']]} />
    <Retenir>La capacité est une charge électrique (Ah ou C) : ne pas la confondre avec la capacité d'un condensateur (F).</Retenir>
  </> },
  { id: 'faraday', titre: 'Combien de lithium ?', corps: <>
    <Eq legende={<>F = 96 485 C·mol⁻¹ (charge d'une mole d'électrons) ; Q en Ah</>}><V s="n" /> = <V s="Q" /> × 3 600 / <V s="F" /></Eq>
    <Donnees lignes={[['Une cellule de 2,03 Ah', 'n ≈ 0,076 mol de lithium qui fait l\'aller-retour']]} />
    <Retenir>Convertir d'abord Ah en coulombs : 1 Ah = 3 600 C.</Retenir>
  </> },
  { id: 'assemblage', titre: 'Assembler des cellules', corps: <>
    <Donnees lignes={[['En série', 'les tensions s\'additionnent'], ['En parallèle', 'les capacités s\'additionnent (plus longtemps)'], ['Dans les deux cas', 'l\'énergie E = U × Q augmente'],
      ['Batterie 12 V (LFP)', '4 cellules en série : 4 × 3,2 = 12,8 V nominaux ; 4 × 3,6 = 14,4 V en fin de charge, la tension maximale de l\'alternateur'],
      ['Zoé, 400 km', '13,5 kWh/100 km → 54 kWh ; pour 217 kg : au moins 54 000 / 217 ≈ 250 Wh/kg']]} />
    <Retenir>Une cellule ne suffit pas : tension voulue → cellules en série ; énergie ou durée voulue → cellules en parallèle.</Retenir>
  </> },
  { id: 'chimies', titre: 'Chimies, durées de vie, coût', corps: <>
    <Donnees lignes={[['Pile patate Zn/Cu', '0,9 V ; ≈ 9 Wh/kg ; non rechargeable'], ['Plomb 6 V', '≈ 44 Wh/kg ; 800 cycles ; 0,28 €/kWh stocké'], ['Ni-MH', '1,2 V ; ≈ 90 Wh/kg'], ['Na-ion', '3,1 V ; ≈ 93 Wh/kg ; 4 000 cycles ; 0,03 €/kWh stocké'],
      ['LFP', '3,2 V ; ≈ 137 Wh/kg ; 3 000 cycles ; 0,06 €/kWh stocké'], ['Li-ion NMC haute densité', '3,7 V ; ≈ 250 Wh/kg ; 1 000 cycles ; 0,11 €/kWh stocké']]} />
    <Eq legende="cycles complets ; rendement et vieillissement négligés">coût du kWh stocké = prix (€/kWh) / nombre de cycles</Eq>
    <Retenir>Même nom, chimies différentes : NMC et LFP sont « lithium-ion », mais l'électrode + change la tension et la densité. La moins chère à l'achat n'est pas toujours la moins chère à l'usage. Valeurs indicatives.</Retenir>
  </> },
  { id: 'synthese', titre: 'En une minute', synthese: true, corps: <>
    <Methode etapes={[<>Décharge spontanée, charge forcée ; Li⁺ par l'électrolyte, e⁻ par le circuit.</>, <>E = U × Q (Wh), densité = E / m (Wh/kg), t = Q / I.</>, <>Série : U ↑ ; parallèle : Q ↑ ; cellules haute densité ≈ 250 Wh/kg.</>, <>Coût du kWh stocké = prix / cycles.</>]} />
  </> },
];
