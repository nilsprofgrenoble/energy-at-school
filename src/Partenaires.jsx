// Logos des partenaires du dispositif Energy@School, chacun renvoyant vers son site.
// Fichiers dans public/ : logo-ac-grenoble.svg, logo-ense3.svg, logo-cea.png.

export const PARTENAIRES = [
  { nom: 'Académie de Grenoble', url: 'https://www1.ac-grenoble.fr/', logo: 'logo-ac-grenoble.svg', l: 148, h: 118 },
  { nom: 'Grenoble INP – Ense³, UGA', url: 'https://ense3.grenoble-inp.fr/', logo: 'logo-ense3.svg', l: 287, h: 120 },
  { nom: 'CEA', url: 'https://www.cea.fr/', logo: 'logo-cea.png', l: 120, h: 120 },
];

export const LIEN_DISPOSITIF = 'https://giantatschool.org/lycee/energyschool/';

export function LogosPartenaires() {
  return (
    <ul className="ea-logos" aria-label="Partenaires du dispositif Energy@School">
      {PARTENAIRES.map(p => (
        <li key={p.nom}>
          <a href={p.url} target="_blank" rel="noopener noreferrer" title={`${p.nom} (nouvel onglet)`} aria-label={`${p.nom}, site officiel (nouvel onglet)`}>
            <img src={`${import.meta.env.BASE_URL}${p.logo}`} alt={p.nom} width={p.l} height={p.h} loading="lazy" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function MentionSite({ style }) {
  return (
    <p className="ea-mention" style={style}>
      Ce site est une initiative personnelle de Nils Aronssohn, enseignant au lycée Argouges, réalisée dans le cadre du dispositif
      Energy@School. Les logos identifient les partenaires du dispositif ; ils n'en font pas un site officiel de ces institutions.
    </p>
  );
}
