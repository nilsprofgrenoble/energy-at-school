import { useState, useEffect } from "react";
import { EnergyAccueil } from "./ateliers/EnergyAccueil";
import { SimulationProduction1 } from "./ateliers/Production1";
import { SimulationProduction2 } from "./ateliers/Production2";
import { SimulationProduction3 } from "./ateliers/Production3";
import { SimulationTransport } from "./ateliers/Transport";
import { SimulationStockage } from "./ateliers/Stockage";
import { SimulationHydrogene } from "./ateliers/Hydrogene";

// ============================================================
//  SITE ENERGY@SCHOOL
//  Pour ajouter ou renommer une page : modifiez la liste PAGES ci-dessous.
//  L'adresse d'une page est  …/energy-at-school/?atelier=<slug>
// ============================================================

const PAGES = [
  { slug: 'presentation', nom: 'Présentation', groupe: null, icone: '🧭', couleur: '#ea580c', composant: EnergyAccueil },
  { slug: 'production-1', nom: 'Turbine Pelton', groupe: 'Produire', icone: '🌊', couleur: '#0284c7', composant: SimulationProduction1 },
  { slug: 'production-2', nom: 'Banc Pelton', groupe: 'Produire', icone: '⚙️', couleur: '#7c3aed', composant: SimulationProduction2 },
  { slug: 'production-3', nom: "Au fil de l'eau", groupe: 'Produire', icone: '🏞️', couleur: '#0891b2', composant: SimulationProduction3 },
  { slug: 'transport', nom: 'Réseau électrique', groupe: 'Transporter', icone: '🗼', couleur: '#7c3aed', composant: SimulationTransport },
  { slug: 'stockage', nom: 'Batteries', groupe: 'Stocker et restituer', icone: '🔋', couleur: '#2563eb', composant: SimulationStockage },
  { slug: 'hydrogene', nom: 'Hydrogène', groupe: 'Stocker et restituer', icone: '💧', couleur: '#16a34a', composant: SimulationHydrogene },
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
      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRadius: 8, cursor: 'pointer',
        fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap',
        border: `1.5px solid ${p.slug === slug ? p.couleur : '#cbd5e1'}`,
        background: p.slug === slug ? p.couleur : 'white', color: p.slug === slug ? 'white' : '#334155' }}>
      <span>{p.icone}</span>{p.nom}
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'white', borderBottom: `4px solid ${page.couleur}`, padding: '12px 20px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => aller('presentation')} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.01em' }}>
                ⚡ Energy<span style={{ color: '#ea580c' }}>@</span>School
              </div>
              <div style={{ fontSize: 13, color: '#475569' }}>Simulations pour préparer la journée à Grenoble INP – Ense³, et y revenir ensuite</div>
            </button>
            <button onClick={partager} style={{ padding: '7px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', background: 'white',
              cursor: 'pointer', fontWeight: 700, fontSize: 13, color: '#334155' }}>
              {copie ? '✅ Lien copié' : '🔗 Partager cette page'}
            </button>
          </div>
          <nav aria-label="Ateliers" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {onglet(PAGES[0])}
            {GROUPES.map(g => (
              <div key={g} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', paddingLeft: 2 }}>{g}</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{PAGES.filter(p => p.groupe === g).map(onglet)}</div>
              </div>
            ))}
          </nav>
        </div>
      </header>

      <main style={{ flex: 1, width: '100%', maxWidth: 1400, margin: '0 auto', padding: '16px 20px', boxSizing: 'border-box' }}>
        <Composant key={slug} />
      </main>

      <footer style={{ textAlign: 'center', fontSize: '0.78rem', color: '#64748b', padding: '16px 12px', borderTop: '1px solid #e2e8f0', background: 'white' }}>
        © {new Date().getFullYear()} Nils Aronssohn — Lycée Argouges, Grenoble ·{' '}
        <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.fr" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>CC BY-NC-ND 4.0</a>
        {' '}· libre d'accès, reproduction et modification non autorisées ·{' '}
        <a href="https://nilsprofgrenoble.github.io/simulations-chimie/" style={{ color: 'inherit' }}>autres simulations de chimie-physique</a>
      </footer>
    </div>
  );
}
