import { useState, useEffect } from "react";
import { EnergyAccueil } from "./ateliers/EnergyAccueil";
import { SimulationProduction1 } from "./ateliers/Production1";
import { SimulationProduction2 } from "./ateliers/Production2";
import { SimulationProduction3 } from "./ateliers/Production3";
import { SimulationTransport } from "./ateliers/Transport";
import { SimulationStockage } from "./ateliers/Stockage";
import { SimulationHydrogene } from "./ateliers/Hydrogene";
import { BoutonCompte, PageProfil, PageSuivi } from "./Compte";
import { restaurer } from "./serveur";
import { synchroniser } from "./avancement";

// ============================================================
//  SITE ENERGY@SCHOOL
//  Pour ajouter ou renommer une page : modifiez la liste PAGES ci-dessous.
//  L'adresse d'une page est  <adresse du site>/?atelier=<slug>
// ============================================================

const PAGES = [
  { slug: 'presentation', nom: 'Présentation', groupe: null, icone: '🧭', couleur: '#ea580c', composant: EnergyAccueil },
  { slug: 'production-1', nom: 'Turbine Pelton', groupe: 'Produire', icone: '🌊', couleur: '#0284c7', composant: SimulationProduction1 },
  { slug: 'production-2', nom: 'Banc Pelton', groupe: 'Produire', icone: '⚙️', couleur: '#7c3aed', composant: SimulationProduction2 },
  { slug: 'production-3', nom: "Au fil de l'eau", groupe: 'Produire', icone: '🏞️', couleur: '#0891b2', composant: SimulationProduction3 },
  { slug: 'transport', nom: 'Réseau électrique', groupe: 'Transporter', icone: '🗼', couleur: '#7c3aed', composant: SimulationTransport },
  { slug: 'stockage', nom: 'Batteries', groupe: 'Stocker et restituer', icone: '🔋', couleur: '#2563eb', composant: SimulationStockage },
  { slug: 'hydrogene', nom: 'Hydrogène', groupe: 'Stocker et restituer', icone: '💧', couleur: '#16a34a', composant: SimulationHydrogene },
  // Pages de compte (hors de la barre d'onglets : on y accède par le bouton en haut à droite)
  { slug: 'profil', nom: 'Mon profil', groupe: null, icone: '👤', couleur: '#ea580c', composant: PageProfil, compte: true },
  { slug: 'suivi', nom: 'Suivi des classes', groupe: null, icone: '👩‍🏫', couleur: '#ea580c', composant: PageSuivi, compte: true },
];
const GROUPES = ['Produire', 'Transporter', 'Stocker et restituer'];

const lirePage = () => {
  const slug = new URLSearchParams(window.location.search).get('atelier');
  return PAGES.find(p => p.slug === slug) ? slug : 'presentation';
};

export default function App() {
  const [slug, setSlug] = useState(lirePage);
  const [copie, setCopie] = useState(false);
  const page = PAGES.find(p => p.slug === slug);
  const Composant = page.composant;
  // Reprend la session enregistrée (si l'élève est resté connecté) puis resynchronise l'avancement
  useEffect(() => { restaurer().then(synchroniser).catch(() => {}); }, []);

  // Navigation sans recharger la page, en gardant les boutons Précédent / Suivant du navigateur
  useEffect(() => {
    const retour = () => setSlug(lirePage());
    window.addEventListener('popstate', retour);
    return () => window.removeEventListener('popstate', retour);
  }, []);
  useEffect(() => {
    document.title = page.slug === 'presentation' ? 'Energy@School · Simulations' : `${page.nom} · Energy@School`;
    window.scrollTo(0, 0);
  }, [page]);
  function aller(s) {
    if (s === slug) return;
    window.history.pushState({}, '', s === 'presentation' ? window.location.pathname : `?atelier=${s}`);
    setSlug(s);
  }
  async function partager() {
    try { await navigator.clipboard.writeText(window.location.href); setCopie(true); setTimeout(() => setCopie(false), 2000); }
    catch { window.prompt('Copiez ce lien :', window.location.href); }
  }

  const onglet = p => (
    <button key={p.slug} onClick={() => aller(p.slug)} aria-current={p.slug === slug ? 'page' : undefined}
      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 999, cursor: 'pointer',
        fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap',
        border: `1.5px solid ${p.slug === slug ? p.couleur : '#eadfd2'}`,
        background: p.slug === slug ? p.couleur : 'white', color: p.slug === slug ? 'white' : '#334155' }}>
      <span aria-hidden="true">{p.icone}</span>{p.nom}
    </button>
  );
  const pilule = { padding: '8px 16px', borderRadius: 999, border: '1.5px solid #eadfd2', background: 'white', cursor: 'pointer', fontWeight: 800, fontSize: 13.5, color: '#334155' };

  return (
    <div style={{ minHeight: '100vh', background: '#fffaf3', display: 'flex', flexDirection: 'column', fontFamily: "'Nunito', 'Segoe UI', system-ui, sans-serif" }}>
      <header style={{ background: 'white', borderBottom: '1px solid #eadfd2', padding: '10px 20px 12px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => aller('presentation')} aria-label="Energy@School, retour à la présentation"
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <img src={`${import.meta.env.BASE_URL}energy-logo.png`} alt="Energy@School" width="174" height="72" style={{ height: 72, width: 'auto', display: 'block' }} />
              <span style={{ fontSize: 13, color: '#3d4d63', fontWeight: 600, maxWidth: 330, lineHeight: 1.35 }}>Simulations pour préparer la journée à Grenoble INP – Ense³, et y revenir ensuite</span>
            </button>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="https://paillasse-virtuelle.fr/" target="_blank" rel="noopener noreferrer" title="Toutes les simulations de chimie et de physique"
                style={{ display: 'flex', alignItems: 'center', padding: '4px 12px', borderRadius: 999, border: '1.5px solid #eadfd2', background: 'white', textDecoration: 'none' }}>
                <img src={`${import.meta.env.BASE_URL}paillasse-logo.png`} alt="Paillasse virtuelle" height="28" style={{ height: 28, width: 'auto' }} />
              </a>
              <BoutonCompte aller={aller} />
              {slug === 'presentation' && <button onClick={partager} style={pilule}>{copie ? '✅ Lien copié' : '🔗 Partager'}</button>}
            </div>
          </div>
          <nav aria-label="Ateliers" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {onglet(PAGES[0])}
            {GROUPES.map(g => (
              <div key={g} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', paddingLeft: 4 }}>{g}</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{PAGES.filter(p => p.groupe === g).map(onglet)}</div>
              </div>
            ))}
          </nav>
        </div>
      </header>

      <main style={{ flex: 1, width: '100%', maxWidth: 1400, margin: '0 auto', padding: '16px 20px 24px', boxSizing: 'border-box' }}>
        {slug !== 'presentation' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '4px 0 14px', flexWrap: 'wrap' }}>
            <span aria-hidden="true" style={{ width: 56, height: 56, borderRadius: 18, background: `${page.couleur}22`, display: 'grid', placeItems: 'center', fontSize: 30, flexShrink: 0 }}>{page.icone}</span>
            <h1 style={{ margin: 0, flex: 1, fontFamily: "'Outfit', sans-serif", fontWeight: 800, letterSpacing: '-0.02em', color: '#0c1a2e', fontSize: 'clamp(26px, 3.8vw, 40px)', lineHeight: 1.1, textWrap: 'balance' }}>{page.nom}</h1>
            <button onClick={partager} style={pilule}>{copie ? '✅ Lien copié' : '🔗 Partager'}</button>
          </div>)}
        <Composant key={slug} aller={aller} />
      </main>

      <footer style={{ textAlign: 'center', fontSize: '0.82rem', color: '#3d4d63', padding: '18px 12px', borderTop: '1px solid #eadfd2', background: 'white' }}>
        © {new Date().getFullYear()} Nils Aronssohn — Lycée Argouges, Grenoble ·{' '}
        <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.fr" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>CC BY-NC-ND 4.0</a>
        {' '}· libre d'accès, reproduction et modification non autorisées ·{' '}
        <a href="https://paillasse-virtuelle.fr/" style={{ color: 'inherit', fontWeight: 700 }}>Paillasse virtuelle : toutes les autres simulations de chimie et de physique</a>
      </footer>
    </div>
  );
}
