import { cardStyle } from "./commun";

// ============================================================
//  PAGE « À PROPOS » : transparence sur la manière dont le site a été construit.
//  Page publique (vouvoiement), sobre et courte. Les formulations sont à valider
//  par Nils avant publication ; aucun nom propre d'enseignant-chercheur sans son accord.
// ============================================================

const titre = { margin: '0 0 6px', fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: '#0c1a2e', letterSpacing: '-0.01em' };
const texte = { margin: 0, fontSize: 15.5, lineHeight: 1.6, color: '#334155', fontWeight: 600 };
const lien = { color: '#c2410c', fontWeight: 800 };

function Bloc({ icone, titre: t, children }) {
  return (
    <section style={{ ...cardStyle, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <span aria-hidden="true" style={{ width: 44, height: 44, borderRadius: 14, background: '#ffedd5', display: 'grid', placeItems: 'center', fontSize: 24, flexShrink: 0 }}>{icone}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={titre}>{t}</h2>
        {children}
      </div>
    </section>
  );
}

export function PageAPropos() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 760, margin: '0 auto', textAlign: 'left' }}>
      <Bloc icone="✍️" titre="Qui a construit ce site ?">
        <p style={texte}>
          Ce site est l'œuvre de Nils Aronssohn, professeur au lycée Argouges (Grenoble). Il a été créé pour la journée
          Energy@School à Grenoble INP – Ense³ : pour la préparer, et pour y revenir ensuite.
        </p>
      </Bloc>

      <Bloc icone="🤝" titre="Avec l'accord des équipes de la journée">
        <p style={texte}>
          Les simulations s'inspirent des ateliers et des manipulations de la journée. Elles sont publiées avec l'accord
          des enseignants-chercheurs du CEA et de l'Ense³ qui les animent.
        </p>
      </Bloc>

      <Bloc icone="🤖" titre="Une intelligence artificielle a aidé">
        <p style={texte}>
          Le code et les contenus pédagogiques ont été réalisés avec l'aide d'une intelligence artificielle, sous la
          direction, la relecture et la validation de l'auteur : l'IA aide, l'enseignant décide.
        </p>
      </Bloc>

      <Bloc icone="🔒" titre="Vos données">
        <p style={texte}>
          Les comptes sont anonymes et créés par le professeur : un identifiant du type <strong>ense-07</strong>, et un pseudo
          tiré de listes fermées. Aucun nom, aucune adresse. Votre avancement est conservé sur votre appareil et, si vous
          avez un compte, sur un serveur (Supabase) pour le retrouver ailleurs. Il n'y a aucune publicité et aucun pistage
          par des services tiers.
        </p>
      </Bloc>

      <Bloc icone="📜" titre="Licence et autres simulations">
        <p style={texte}>
          Ce site est placé sous licence{' '}
          <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.fr" target="_blank" rel="noopener noreferrer" style={lien}>CC BY-NC-ND 4.0</a>.
          D'autres simulations de chimie et de physique sont à découvrir sur la{' '}
          <a href="https://paillasse-virtuelle.fr/" target="_blank" rel="noopener noreferrer" style={lien}>Paillasse virtuelle</a>.
        </p>
      </Bloc>

      <Bloc icone="🙏" titre="Remerciements">
        <p style={texte}>
          Merci aux enseignants-chercheurs du CEA et de l'Ense³, ainsi qu'aux organisateurs de la journée, pour leur
          accueil et pour tout ce qu'ils transmettent aux élèves.
        </p>
      </Bloc>
    </div>
  );
}
