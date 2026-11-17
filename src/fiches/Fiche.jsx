// ═══════════════════════════════════════════════════════════════════════════
//  FICHES « À RETENIR » : bouton « Fiche » de chaque atelier (fenêtre) et page « Mes fiches » (collection + impression).
//  • Bouton « Fiche » : 4e bouton à côté de « Parcours guidé · Exploration libre · Défi ». N'apparaît que si l'atelier a des cartes.
//  • Fiche pas encore débloquée : cadenas, titres des cartes (pas leur contenu), bouton vers le parcours guidé.
//  • N'ajoute rien à la carte du parcours guidé : la fiche s'ouvre dans une fenêtre, à la demande.
// ═══════════════════════════════════════════════════════════════════════════
import { useEffect } from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { cardStyle } from '../commun';
import { useSuivi } from '../avancement';
import { FICHES, aFiche } from './contenu';
import { ATELIERS, ficheDebloquee, nbFichesDebloquees } from './regles';

const allerA = slug => { window.history.pushState({}, '', `?atelier=${slug}`); window.dispatchEvent(new PopStateEvent('popstate')); };
// Va au parcours guidé en cliquant sur son bouton (chaque atelier gère ses modes lui-même)
const versParcours = () => { const b = [...document.querySelectorAll('button')].find(x => /Parcours guidé/.test(x.textContent) && !x.disabled); if (b) b.click(); };

export function CartesFiche({ page, couleur }) {
  return (
    <ol className="fiche-points">
      {FICHES[page].map(c => (
        <li key={c.id} className={`fiche-carte${c.synthese ? ' fiche-synthese' : ''}`} style={{ '--c': couleur }}>
          <h3 className="fiche-titre">{c.titre}</h3>
          <div className="fiche-corps">{c.corps}</div>
        </li>))}
    </ol>
  );
}

function FenetreFiche({ page, nom, couleur, debloquee, onFermer }) {
  useEffect(() => {
    const touche = e => { if (e.key === 'Escape') onFermer(); };
    window.addEventListener('keydown', touche);
    return () => window.removeEventListener('keydown', touche);
  }, [onFermer]);
  const cartes = FICHES[page];
  const bouton = { padding: '7px 14px', borderRadius: 999, border: '1.5px solid #eadfd2', background: '#fff', cursor: 'pointer', fontWeight: 800, fontSize: 14, color: '#334155' };
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`Fiche de révision : ${nom}`} className="fiche-fenetre no-print"
      onClick={e => { if (e.target === e.currentTarget) onFermer(); }}>
      <div className="fiche-fenetre-boite">
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: '#c2410c', letterSpacing: '.08em', textTransform: 'uppercase' }}>Fiche de révision</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 800, color: '#0c1a2e' }}>{nom}</div>
          </div>
          <button type="button" onClick={onFermer} aria-label="Fermer la fiche" style={{ ...bouton, padding: '4px 12px' }}>✕</button>
        </div>
        {debloquee ? (
          <>
            <CartesFiche page={page} couleur={couleur} />
            <div style={{ textAlign: 'right', marginTop: 12 }}>
              <button type="button" onClick={() => { onFermer(); allerA('mes-fiches'); }} style={bouton}>📚 Toutes mes fiches (imprimer)</button>
            </div>
          </>
        ) : (
          <>
            <p style={{ margin: '12px 0 6px', fontSize: 15, lineHeight: 1.5, color: '#0c1a2e', fontWeight: 600 }}>
              🔒 Cette fiche se débloque quand tu <b>termines le parcours guidé</b> ou que tu <b>relèves le défi</b>. Elle contient {cartes.length} carte{cartes.length > 1 ? 's' : ''} :
            </p>
            <ol style={{ margin: '0 0 14px', paddingLeft: 22, color: '#334155', fontSize: 15, lineHeight: 1.6, fontWeight: 600 }}>
              {cartes.map(c => <li key={c.id}>{c.titre}</li>)}
            </ol>
            <button type="button" onClick={() => { onFermer(); versParcours(); }} style={{ ...bouton, background: couleur, color: '#fff', borderColor: couleur }}>Aller au parcours guidé ▶</button>
          </>)}
      </div>
    </div>, document.body);
}

// À placer après le bouton « Défi » : <BoutonFiche page="production-1" style={btn(false, '#16a34a')} />
export function BoutonFiche({ page, style, couleur = '#ea580c' }) {
  const suivi = useSuivi();
  const [ouverte, setOuverte] = useState(false);
  if (!aFiche(page)) return null;
  const debloquee = ficheDebloquee(page, suivi);
  const atelier = ATELIERS.find(a => a.page === page);
  return (
    <>
      <button onClick={() => setOuverte(true)} style={style}
        title={debloquee ? 'La fiche de révision de cet atelier' : 'Fiche de révision : se débloque quand tu termines le parcours guidé ou relèves le défi'}>
        {debloquee ? '📋' : '🔒'} Fiche
      </button>
      {ouverte && <FenetreFiche page={page} nom={atelier?.nom || page} couleur={couleur} debloquee={debloquee} onFermer={() => setOuverte(false)} />}
    </>
  );
}

// ── Page « Mes fiches » : la collection, rangée par thème (Produire, Transporter, Stocker), imprimable en livret ──
export function PageMesFiches() {
  const suivi = useSuivi();
  const presentes = ATELIERS.filter(a => aFiche(a.page));
  const nb = nbFichesDebloquees(presentes.map(a => a.page), suivi);
  const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div className="fiches-page" style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 820, margin: '0 auto', textAlign: 'left' }}>
      <div className="no-print" style={{ ...cardStyle, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, fontSize: 15, lineHeight: 1.5, color: '#334155', fontWeight: 600 }}>
          {nb} fiche{nb > 1 ? 's' : ''} débloquée{nb > 1 ? 's' : ''} sur {presentes.length}. Termine un parcours guidé ou relève un défi pour débloquer la fiche de l'atelier.
        </div>
        {nb > 0 && <button onClick={() => window.print()} style={{ padding: '8px 16px', borderRadius: 999, border: '1.5px solid #ea580c', background: '#ea580c', color: '#fff', cursor: 'pointer', fontWeight: 800, fontSize: 14 }}>🖨️ Imprimer mes fiches</button>}
      </div>

      {/* Couverture : visible seulement à l'impression */}
      <section className="fiches-couverture" aria-hidden="true">
        <div className="fiches-couverture-etiquette">Energy@School</div>
        <h1>Mes fiches de révision</h1>
        <p>Production, transport et stockage de l'énergie électrique</p>
        <p className="fiches-couverture-date">Grenoble INP – Ense³ · édité le {date}</p>
        <p className="fiches-couverture-date">{nb} fiche{nb > 1 ? 's' : ''}</p>
      </section>

      {['produire', 'transporter', 'stocker'].map(fid => {
        const liste = presentes.filter(a => a.famille.id === fid);
        if (!liste.length) return null;
        const fam = liste[0].famille;
        return (
          <section key={fid} className="fiches-theme">
            <h2 className="fiches-theme-titre" style={{ color: fam.couleur }}><span aria-hidden="true">{fam.icone} </span>{fam.nom}</h2>
            {liste.map(a => ficheDebloquee(a.page, suivi) ? (
              <article key={a.page} className="fiche-atelier">
                <h3 className="fiche-atelier-titre" style={{ borderColor: fam.couleur }}>{a.nom}</h3>
                <CartesFiche page={a.page} couleur={fam.couleur} />
              </article>
            ) : (
              <p key={a.page} className="no-print" style={{ ...cardStyle, margin: '0 0 10px', fontSize: 15, color: '#334155', fontWeight: 700 }}>
                🔒 {a.nom} <span style={{ fontWeight: 600, color: '#64748b' }}>· se débloque avec le parcours guidé ou le défi</span>
              </p>
            ))}
          </section>);
      })}
    </div>
  );
}
