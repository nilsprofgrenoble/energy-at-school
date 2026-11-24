import { cardStyle } from "./commun";
import { Emo } from './Pictos';
import { LogosPartenaires, LIEN_DISPOSITIF } from './Partenaires';

// ============================================================
//  PAGE « À PROPOS » : transparence sur la manière dont le site a été construit.
//  Page publique (vouvoiement), sobre et courte. Les formulations sont à valider
//  par Nils. Noms des intervenants fournis par Nils (24/11/2026).
// ============================================================

const titre = { margin: '0 0 6px', fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: '#0c1a2e', letterSpacing: '-0.01em' };
const texte = { margin: 0, fontSize: 15.5, lineHeight: 1.6, color: '#334155', fontWeight: 600 };
const lien = { color: '#c2410c', fontWeight: 800 };

function Bloc({ icone, titre: t, children }) {
  return (
    <section style={{ ...cardStyle, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <span aria-hidden="true" style={{ width: 32, height: 32, color: '#c2410c', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Emo e={icone} t={28}/></span>
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
      <Bloc icone="🧭" titre="Le dispositif Energy@School">
        <p style={texte}>
          Energy@School réunit l'Académie de Grenoble, Grenoble INP – Ense³, UGA et le CEA, qui co-pilote le programme. Des lycéens
          passent une journée de travaux pratiques dans les laboratoires de l'école, autour de la production, du transport et du
          stockage de l'énergie électrique.{' '}
          <a href={LIEN_DISPOSITIF} target="_blank" rel="noopener noreferrer" style={lien}>Page du dispositif</a>
        </p>
        <LogosPartenaires />
      </Bloc>

      <Bloc icone="✍️" titre="Qui a fait ce site ?">
        <p style={texte}>
          Ce site est une initiative personnelle de Nils Aronssohn, enseignant au lycée Argouges à Grenoble, réalisée dans le cadre
          du dispositif Energy@School pour préparer la journée à Grenoble INP – Ense³, UGA, et y revenir ensuite. Les logos
          identifient les partenaires du dispositif ; ils n'en font pas un site officiel de ces institutions.
        </p>
        <p style={{ ...texte, marginTop: 8 }}>
          Les simulations prennent appui sur les énoncés et les scénarios pédagogiques imaginés par les intervenants de la
          journée : des enseignants-chercheurs de Grenoble INP – Ense³, UGA et des ingénieurs de recherche du CEA.
        </p>
      </Bloc>

      <Bloc icone="👥" titre="Les intervenants de la journée">
        <ul style={{ ...texte, margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <li><strong>Production</strong> : Jean-Luc Schanen et Stéphane Guillet, Grenoble INP – Ense³, UGA</li>
          <li><strong>Transport</strong> : Jérôme Buire, Grenoble INP – Ense³, UGA</li>
          <li><strong>Batteries</strong> : Loïc Simonin, Éric Mayousse et Nicolas Guillet, CEA</li>
          <li><strong>Hydrogène</strong> : Yann Bultel et Maël Oussenekan, Grenoble INP – Ense³, UGA</li>
        </ul>
      </Bloc>

      <Bloc icone="🤖" titre="Et l'intelligence artificielle ?">
        <p style={texte}>
          Le code du site a été écrit par Claude, une IA d'Anthropic. Les contenus pédagogiques ne viennent pas d'elle.
        </p>
      </Bloc>

      <Bloc icone="🔒" titre="Vos données">
        <p style={texte}>
          Les comptes sont anonymes : c'est le professeur qui les crée. Vous avez un identifiant du type <strong>ense-07</strong> et
          un pseudo choisi dans une liste. Aucun nom, aucune adresse. Votre avancement est gardé sur votre appareil, et sur un
          serveur (Supabase) si vous avez un compte, pour le retrouver ailleurs. Pas de publicité, pas de suivi par des services extérieurs.
        </p>
      </Bloc>

      <Bloc icone="📜" titre="Licence et autres simulations">
        <p style={texte}>
          Ce site est sous licence{' '}
          <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.fr" target="_blank" rel="noopener noreferrer" style={lien}>CC BY-NC-ND 4.0</a>.
          D'autres simulations de chimie et de physique sont sur la{' '}
          <a href="https://paillasse-virtuelle.fr/" target="_blank" rel="noopener noreferrer" style={lien}>Paillasse virtuelle</a>.
        </p>
      </Bloc>
    </div>
  );
}
