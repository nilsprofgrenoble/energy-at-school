import { useState } from "react";
import { KIT } from "../commun";
import { useSession, estEleve, estProf } from "../serveur";
import { useSuivi, bilan } from "../avancement";
import { FormulaireConnexion } from "../Compte";

// ====================================================
// ENERGY@SCHOOL — PAGE D'ENTRÉE
// Vue d'ensemble de la journée et accès aux six pages d'ateliers (liens ?atelier=…).
// ====================================================

const PAILLASSE_URL = 'https://paillasse-virtuelle.fr/';

const FONDS = { 'Produire': '#0369a1', 'Transporter': '#7c3aed', 'Stocker et restituer': '#2563eb' };

const THEMES = [
  { nom: 'Produire', icone: '🌊', couleur: '#0284c7', question: 'Comment transformer l’énergie de l’eau en électricité ?',
    pages: [
      { id: 'production-1', nom: 'Production 1 · Turbine Pelton', texte: 'Une conduite forcée, une turbine Pelton et un alternateur : puissance de l’eau, puissance électrique, rendement, oscilloscope.' },
      { id: 'production-2', nom: 'Production 2 · Banc Pelton', texte: 'Une vraie turbine de laboratoire, freinée pour mesurer sa puissance mécanique et trouver sa vitesse optimale.' },
      { id: 'production-3', nom: 'Production 3 · Au fil de l’eau', texte: 'Un canal et une roue à aubes : débit mesuré à la balance, puissance de l’eau, alternateur triphasé.' },
    ] },
  { nom: 'Transporter', icone: '🗼', couleur: '#7c3aed', question: 'Comment amener l’électricité jusqu’aux maisons en perdant le moins possible ?',
    pages: [
      { id: 'transport', nom: 'Transport · Réseau électrique', texte: 'Transformateurs et câbles : pourquoi on transporte l’électricité sous haute tension.' },
    ] },
  { nom: 'Stocker et restituer', icone: '🔋', couleur: '#2563eb', question: 'Comment garder l’énergie électrique pour plus tard, puis la rendre quand on en a besoin ?',
    pages: [
      { id: 'stockage', nom: 'Stocker 1 · Batteries', texte: 'L’énergie stockée sous forme chimique dans une cellule lithium-ion, puis assembler des cellules (NMC, LFP, Na-ion…) pour un téléphone ou une voiture.' },
      { id: 'hydrogene', nom: 'Stocker 2 · Hydrogène', texte: 'L’électricité transformée en dihydrogène par électrolyse, puis le dihydrogène retransformé en électricité par une pile à combustible.' },
    ] },
];

export function EnergyAccueil({ aller }) {
  const { txt: TXT, txt2: TXT2 } = KIT;
  const s = useSession(), suivi = useSuivi();
  const [connexionOuverte, setConnexionOuverte] = useState(false);
  const b = bilan(suivi);
  const va = (e, page) => { if (aller) { e.preventDefault(); aller(page); } };
  const chaine = (
    <svg viewBox="0 0 640 120" role="img" aria-label="La chaîne de l'énergie : produire, transporter, stocker et restituer"
      style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 130 }}>
      {THEMES.map((t, k) => {
        const n = THEMES.length, ecart = 34, w = (616 - (n - 1) * ecart) / n, x = 12 + k * (w + ecart);
        return (
          <g key={t.nom}>
            <rect x={x} y="14" width={w} height="86" rx="22" fill="white" stroke={t.couleur} strokeWidth="3"/>
            <text x={x + w / 2} y="52" fontSize="30" textAnchor="middle">{t.icone}{t.nom.startsWith('Stocker') ? '💧' : ''}</text>
            <text x={x + w / 2} y="84" fontSize={t.nom.length > 12 ? 14.5 : 17} fontWeight="800" fill={t.couleur} textAnchor="middle" fontFamily="Outfit, sans-serif">{t.nom}</text>
            {k < n - 1 && (
              <g>
                <line x1={x + w + 3} y1="57" x2={x + w + ecart - 6} y2="57" stroke={TXT2} strokeWidth="3"/>
                <polygon points={`${x + w + ecart - 10},50 ${x + w + ecart - 2},57 ${x + w + ecart - 10},64`} fill={TXT2}/>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
  return (
    <div className="ea">
      <section className="ea-hero" aria-label="Présentation">
        <div>
          <h1><span className="ea-etiquette">Energy@School · Grenoble INP – Ense³</span>Produire, transporter, <mark>stocker.</mark></h1>
          <p className="ea-lead">
            Pendant une journée dans les laboratoires de l'Ense³, vous allez découvrir comment on <strong>produit</strong> l'énergie
            électrique, comment on la <strong>transporte</strong>, et comment on la <strong>stocke</strong> pour la <strong>restituer</strong> plus tard,
            dans une batterie ou sous forme d'hydrogène. Chaque élève participe à deux ateliers sur les quatre. Ces pages vous
            permettent de les préparer avant, et d'y revenir après.
          </p>
        </div>
        <div className="ea-compte">
          {estEleve(s) ? <>
            <h2>{b.niveau.icone} {b.niveau.nom}</h2>
            <p>{b.points} point{b.points > 1 ? 's' : ''} sur {b.max}. Continuez : chaque parcours terminé et chaque défi relevé comptent.</p>
            <a className="ea-bouton" href="?atelier=profil" onClick={e => va(e, 'profil')}>Mon profil et mes niveaux ›</a>
          </> : estProf(s) ? <>
            <h2>Suivi des classes</h2>
            <p>Retrouvez l'avancement de vos élèves, parcours par parcours.</p>
            <a className="ea-bouton" href="?atelier=suivi" onClick={e => va(e, 'suivi')}>Ouvrir le suivi ›</a>
          </> : <>
            <h2>Vous avez un compte ?</h2>
            <p>Connectez-vous avec l'identifiant donné par votre professeur : votre avancement est enregistré, vous choisissez un pseudo et vous débloquez des niveaux. Sans compte, tout reste utilisable.</p>
            <button className="ea-bouton" onClick={() => setConnexionOuverte(true)}>🔑 Se connecter</button>
          </>}
        </div>
      </section>
      {connexionOuverte && <FormulaireConnexion onFermer={() => setConnexionOuverte(false)} />}

      <div className="ea-titre-section"><h2>Les ateliers de la journée</h2><span>7 pages · 3 thèmes</span></div>
      <div className="ea-tuiles">
        {THEMES.map(t => (
          <div key={t.nom} className="ea-tuile" style={{ '--ea-fond': FONDS[t.nom] }}>
            <div className="ea-mot"><span aria-hidden="true">{t.icone}</span> {t.nom}</div>
            <div className="ea-q">{t.question}</div>
            <ul className="ea-puces">
              {t.pages.map(pg => (
                <li key={pg.id}><a href={`?atelier=${pg.id}`} onClick={e => va(e, pg.id)}>{pg.nom} ›<small>{pg.texte}</small></a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="ea-lame">
        <h3>Le fil rouge de la journée</h3>
        {chaine}
        <div style={{ fontSize: 15, color: TXT2, lineHeight: 1.6, marginTop: 6 }}>
          À chaque étape, on mesure la puissance reçue et la puissance utile, et on calcule un <strong>rendement</strong>.
          Il n'atteint jamais 100 % : une partie de l'énergie part toujours en chaleur.
        </div>
      </div>

      <div className="ea-lame">
        <h3>Comment utiliser ces pages ?</h3>
        <div style={{ fontSize: 15, color: TXT, lineHeight: 1.6 }}>
          Chaque page propose trois modes, accessibles à tout moment :
          <div className="ea-modes">
            <div className="ea-mode"><b>🧭 Parcours guidé</b>On vous accompagne étape par étape, comme pendant le TP. Commencez par là.</div>
            <div className="ea-mode"><b>🔍 Exploration libre</b>Tous les réglages, pour tester vos propres idées.</div>
            <div className="ea-mode"><b>🎯 Défi</b>Une mission à réussir sans aide.</div>
          </div>
          <strong>Avant la journée</strong> : faites le parcours guidé des deux ateliers auxquels vous participerez.
          <strong> Après la journée</strong> : revenez explorer, relevez les défis, et découvrez les ateliers que vous n'avez pas faits.
          <div style={{ fontSize: 13.5, color: TXT2, marginTop: 8 }}>Votre progression dans les parcours est enregistrée sur cet appareil : vous pouvez vous arrêter et reprendre plus tard. Avec le compte donné par votre professeur (bouton « Se connecter »), elle est aussi enregistrée en ligne, vous choisissez un pseudo et vous débloquez des niveaux au fil des parcours terminés et des défis relevés, dans l’ordre que vous voulez.</div>
        </div>
      </div>

      <a href={PAILLASSE_URL} target="_blank" rel="noopener noreferrer"
        style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap', textDecoration: 'none', color: TXT,
          background: '#fff', border: '1px solid #eadfd2', borderRadius: 28, padding: '20px 24px' }}>
        <img src={`${import.meta.env.BASE_URL}paillasse-logo.png`} alt="Paillasse virtuelle" width="168" height="62" style={{ height: 62, width: 'auto' }} />
        <div style={{ flex: '1 1 300px', minWidth: 0 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>Et après ? Découvrez la Paillasse virtuelle</div>
          <div style={{ fontSize: 15, color: TXT2, lineHeight: 1.55, margin: '2px 0 6px' }}>
            Le même principe, pour la chimie et la physique : plus de 60 simulations avec parcours guidé, exploration libre et défis,
            et des exercices par compétence, de la Seconde au BTS. Gratuit, sans inscription.
          </div>
          <span style={{ fontSize: 14.5, fontWeight: 800, color: '#0b4f94' }}>Ouvrir paillasse-virtuelle.fr ›</span>
        </div>
      </a>
    </div>
  );
}
