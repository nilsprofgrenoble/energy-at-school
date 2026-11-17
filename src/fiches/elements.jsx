// ═══════════════════════════════════════════════════════════════════════════
//  BRIQUES POUR ÉCRIRE LES FICHES (règles de Nils, novembre 2026) :
//   • une idée par carte, un SCHÉMA légendé qui porte l'idée (c'est essentiel) ;
//   • toute grandeur qui apparaît est DÉFINIE (nom + unité) : composant <Grandeurs> ;
//   • formules sur UNE SEULE ligne, en notation mathématique (MathML, vraie barre de fraction) : <Fm> ;
//   • un exemple chiffré tiré de la simulation, une phrase à retenir, et si possible « Faux / Vrai ».
//  Formules : on écrit une petite chaîne, par exemple  <Fm>{'P_hyd = p × Q_V'}</Fm>  ou  <Fm>{'η = {P_élec|P_hyd}'}</Fm>
//   - X_ind : indice (lettres ou chiffres) ; X^2 : exposant ; {haut|bas} : fraction ; [W] : unité (texte droit).
// ═══════════════════════════════════════════════════════════════════════════
import { cloneElement, useLayoutEffect, useRef, useState } from 'react';
import { Emo, Pic } from '../Pictos';

// ── Formules : mini-langage → MathML ──
const LETTRE = /[A-Za-zÀ-ÿΑ-ωηΔρπσφλμΩ]/;
function trouverFin(s, i) { let d = 0; for (let k = i; k < s.length; k++) { if (s[k] === '{') d++; else if (s[k] === '}' && --d === 0) return k; } return s.length - 1; }
function scinder(s) { let d = 0; for (let k = 0; k < s.length; k++) { if (s[k] === '{') d++; else if (s[k] === '}') d--; else if (s[k] === '|' && d === 0) return [s.slice(0, k), s.slice(k + 1)]; } return [s, '']; }
function lireScript(s, i) {   // lit un indice ou un exposant après « _ » ou « ^ » : renvoie [texte, nouvelle position]
  if (s[i] === '{') { const f = trouverFin(s, i); return [s.slice(i + 1, f), f + 1]; }
  let k = i; if (s[k] === '-' || s[k] === '+') k++;
  while (k < s.length && /[A-Za-z0-9À-ÿ'η]/.test(s[k])) k++;
  return [s.slice(i, k), k];
}
function mots(texte) { return <mi mathvariant="normal">{texte}</mi>; }
function analyser(s, cle = 'm') {
  const out = []; let i = 0, n = 0;
  const poser = el => out.push(cloneElement(el, { key: `${cle}${n++}` }));
  while (i < s.length) {
    const c = s[i];
    if (c === ' ') { i++; continue; }
    if (c === '√' && s[i + 1] === '{') { const f = trouverFin(s, i + 1); poser(<msqrt><mrow>{analyser(s.slice(i + 2, f), `${cle}r${n}`)}</mrow></msqrt>); i = f + 1; continue; }
    if (c === '{') {
      const f = trouverFin(s, i); const [h, b] = scinder(s.slice(i + 1, f));
      poser(<mfrac><mrow>{analyser(h, `${cle}h${n}`)}</mrow><mrow>{analyser(b, `${cle}b${n}`)}</mrow></mfrac>); i = f + 1; continue;
    }
    if (c === '[') { const f = s.indexOf(']', i); poser(<mtext>{' ' + s.slice(i + 1, f)}</mtext>); i = f + 1; continue; }
    let base = null;
    if (/[0-9]/.test(c)) { let k = i; while (k < s.length && /[0-9]/.test(s[k])) k++; if (/[,.]/.test(s[k] || '') && /[0-9]/.test(s[k + 1] || '')) { k++; while (k < s.length && /[0-9]/.test(s[k])) k++; } base = <mn>{s.slice(i, k)}</mn>; i = k; }
    else if (LETTRE.test(c)) { base = <mi>{c}</mi>; i++; }
    else if (c === ')' ) { base = <mo>)</mo>; i++; }
    else { const op = { '*': '×', '-': '−', '/': '/' }[c] || c; poser(<mo>{op}</mo>); i++; continue; }
    // indice puis exposant
    let sub = null, sup = null;
    if (s[i] === '_') { const [t, k] = lireScript(s, i + 1); sub = t; i = k; }
    if (s[i] === '^') { const [t, k] = lireScript(s, i + 1); sup = t; i = k; }
    const scr = t => (/^[0-9+\-,.]+$/.test(t) ? <mn>{t.replace('-', '−')}</mn> : mots(t));
    if (sub !== null && sup !== null) poser(<msubsup>{base}{scr(sub)}{scr(sup)}</msubsup>);
    else if (sub !== null) poser(<msub>{base}{scr(sub)}</msub>);
    else if (sup !== null) poser(<msup>{base}{scr(sup)}</msup>);
    else poser(base);
  }
  return out;
}
// Formule seule sur sa ligne : une seule ligne toujours, caractères réduits si la carte est étroite
export function Fm({ children }) {
  const cadre = useRef(null), maths = useRef(null), pleine = useRef(0);
  const [taille, setTaille] = useState(1.15);
  useLayoutEffect(() => {
    const ajuster = () => {
      const c = cadre.current, m = maths.current; if (!c || !m) return;
      m.style.fontSize = '1.15em'; pleine.current = m.getBoundingClientRect().width; m.style.fontSize = '';
      const l = c.clientWidth, w = pleine.current; if (!(l > 0 && w > 0)) return;
      const t = w > l ? Math.max(0.7, 1.15 * (l - 2) / w) : 1.15;
      setTaille(a => (Math.abs(a - t) < 0.005 ? a : t));
    };
    ajuster();
    let obs = null;
    if (typeof ResizeObserver !== 'undefined' && cadre.current) { obs = new ResizeObserver(ajuster); obs.observe(cadre.current); }
    if (document.fonts?.ready) document.fonts.ready.then(ajuster).catch(() => {});
    return () => obs && obs.disconnect();
  }, []);
  return (
    <span ref={cadre} role="math" className="fiche-fm">
      <math ref={maths} style={{ fontSize: `${taille}em`, whiteSpace: 'nowrap', mathStyle: 'normal' }}>{analyser(String(children))}</math>
    </span>
  );
}
// Même écriture, au fil du texte
export const Fi = ({ children }) => <math style={{ whiteSpace: 'nowrap', fontSize: '1.05em' }}>{analyser(String(children))}</math>;

// « où » : définition de TOUTES les grandeurs qui apparaissent (symbole, nom, unité)
export const Grandeurs = ({ lignes }) => (
  <dl className="fiche-grandeurs">
    {lignes.map(([s, nom, u]) => (
      <div key={s}><dt><Fi>{s}</Fi></dt><dd>{nom}{u ? <> <span className="fiche-unite">({u})</span></> : null}</dd></div>))}
  </dl>
);
// Exemple chiffré, repris de la simulation
export const Exemple = ({ children }) => <p className="fiche-exemple"><b>Exemple</b> {children}</p>;
// Phrase à retenir (mnémotechnique)
export const Memo = ({ children }) => <p className="fiche-memo"><span aria-hidden="true"><Emo e="💡"/></span> {children}</p>;
// Idée fausse / vraie
export const FauxVrai = ({ faux, vrai }) => (
  <div className="fiche-fauxvrai">
    <p className="fiche-faux"><b><Emo e="✗"/> Faux</b> {faux}</p>
    <p className="fiche-vrai"><b><Emo e="✓"/> Vrai</b> {vrai}</p>
  </div>
);
// Définition courte
export const Def = ({ terme, children }) => <p className="fiche-def"><b>{terme}</b> : {children}</p>;

// ── Schémas SVG : toujours lisibles sur téléphone (texte ≥ 13 dans un cadre de 360 de large) ──
export const COUL = { eau: '#0284c7', orange: '#ea580c', vert: '#16a34a', rouge: '#dc2626', encre: '#0c1a2e', gris: '#64748b', violet: '#7c3aed' };
export function Schema({ h, titre, children }) {
  const fl = (id, c) => <marker key={id} id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0 0L10 5L0 10z" fill={c} /></marker>;
  return (
    <svg className="fiche-schema" viewBox={`0 0 360 ${h}`} role="img" aria-label={titre} width="100%" style={{ maxWidth: 440 }}>
      <defs>{fl('ahK', '#334155')}{fl('ahB', COUL.eau)}{fl('ahO', COUL.orange)}{fl('ahG', COUL.vert)}{fl('ahR', COUL.rouge)}{fl('ahV', COUL.violet)}</defs>
      {children}
    </svg>
  );
}
export const T = ({ x, y, s, c = COUL.encre, w = 700, f = 13, a = 'middle' }) =>
  <text x={x} y={y} textAnchor={a} fontSize={f} fontWeight={w} fill={c} fontFamily="Nunito, sans-serif">{s}</text>;
// Flèche : x1,y1 → x2,y2 ; couleur K (gris), B, O, G, R, V
export const Fl = ({ x1, y1, x2, y2, c = 'K', e = 2.5, d }) => {
  const col = { K: '#334155', B: COUL.eau, O: COUL.orange, G: COUL.vert, R: COUL.rouge, V: COUL.violet }[c];
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth={e} strokeDasharray={d} markerEnd={`url(#ah${c})`} />;
};
// Boîte avec un ou deux libellés
export const Boite = ({ x, y, w, h, l1, l2, c = COUL.orange, fond = '#fff', f = 13 }) => (
  <g><rect x={x} y={y} width={w} height={h} rx="10" fill={fond} stroke={c} strokeWidth="2.5" />
    {l2 ? <><T x={x + w / 2} y={y + h / 2 - 3} s={l1} f={f} /><T x={x + w / 2} y={y + h / 2 + 14} s={l2} f={f} w={600} c="#475569" /></> : <T x={x + w / 2} y={y + h / 2 + 5} s={l1} f={f} />}
  </g>
);
// Courbe annotée : pts [[x, y]], bornes xmax/ymax, graduations, repères { x, y, texte, c }
export function Courbe({ titre, h = 200, pts, xmax, ymax, ticksX, ticksY = [], xlab, ylab, reperes = [], couleur = COUL.eau, dessous = [], haut = 22 }) {
  const X0 = 46, X1 = 340, Y1 = h - 66, Y0 = haut + 16, sx = x => X0 + (x / xmax) * (X1 - X0), sy = y => Y1 - (y / ymax) * (Y1 - Y0);
  return (
    <Schema h={h} titre={titre}>
      <rect x={X0} y={Y0} width={X1 - X0} height={Y1 - Y0} fill="#f8fafc" stroke="#cbd5e1" />
      {ticksY.map(v => <g key={v}><line x1={X0} x2={X1} y1={sy(v)} y2={sy(v)} stroke="#e2e8f0" /><T x={X0 - 5} y={sy(v) + 4} s={String(v).replace('.', ',')} a="end" w={600} c="#475569" /></g>)}
      {ticksX.map(v => <g key={v}><line x1={sx(v)} x2={sx(v)} y1={Y0} y2={Y1} stroke="#e2e8f0" /><T x={sx(v)} y={Y1 + 16} s={String(v).replace('.', ',')} w={600} c="#475569" /></g>)}
      <polyline fill="none" stroke={couleur} strokeWidth="3.5" strokeLinejoin="round" points={pts.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ')} />
      {reperes.map((r, k) => <g key={k}><circle cx={sx(r.x)} cy={sy(r.y)} r="6" fill={r.c || COUL.orange} stroke="#fff" strokeWidth="2" />{r.texte && <T x={r.tx ?? sx(r.x)} y={r.ty ?? sy(r.y) - 12} s={r.texte} a={r.a || 'middle'} c={r.c || COUL.orange} />}</g>)}
      <T x={X0} y={haut + 8} s={ylab} a="start" c={COUL.encre} />
      <T x={X1} y={Y1 + (dessous.length ? 52 : 36)} s={xlab} a="end" c={COUL.encre} />
      {dessous.map((d, k) => <T key={k} x={d.x} y={Y1 + 34} s={d.texte} a={d.a || 'middle'} c={d.c || COUL.rouge} />)}
    </Schema>
  );
}
// Trois (ou deux) cas côte à côte : [{ titre, sous, verdict, bon }]  avec un dessin par cas (rendu fourni)
export function Cas({ h = 150, titre, cas, dessin }) {
  const n = cas.length, w = 360 / n;
  return (
    <Schema h={h} titre={titre}>
      {cas.map((c, k) => (
        <g key={k} transform={`translate(${k * w},0)`}>
          <rect x="4" y="4" width={w - 8} height={h - 8} rx="12" fill={c.bon ? '#f0fdf4' : '#fff'} stroke={c.bon ? COUL.vert : '#cbd5e1'} strokeWidth={c.bon ? 3 : 1.5} />
          <T x={w / 2} y="24" s={c.titre} f={13} />{c.titre2 && <T x={w / 2} y="40" s={c.titre2} f={13} />}
          {dessin(c, k, w)}
          <T x={w / 2} y={h - 24} s={c.verdict} c={c.bon ? COUL.vert : COUL.rouge} f={13} />
          {c.verdict2 && <T x={w / 2} y={h - 9} s={c.verdict2} c={c.bon ? COUL.vert : COUL.rouge} f={13} w={600} />}
        </g>))}
    </Schema>
  );
}
// Flux vertical d'étapes avec formules, pour les cartes de synthèse : [{ nom, formule }]
export function Flux({ etapes, couleur = COUL.orange }) {
  return (
    <div className="fiche-flux" style={{ '--c': couleur }}>
      {etapes.map((e, k) => (
        <div key={k} className="fiche-flux-etape">
          <div className="fiche-flux-nom">{e.nom}</div>
          {e.formule && <div className="fiche-flux-f"><Fm>{e.formule}</Fm></div>}
          {k < etapes.length - 1 && <div className="fiche-flux-fleche" aria-hidden="true">↓</div>}
        </div>))}
    </div>
  );
}

// Lettre avec indice dans un SVG (sans baselineShift) ; `suite` = texte qui suit l'indice
export const Vs = ({ x, y, s, sub, suite, a = 'middle', c = COUL.encre, f = 14, w = 800 }) => (
  <text x={x} y={y} textAnchor={a} fontSize={f} fontWeight={w} fill={c} fontFamily="Nunito, sans-serif">{s}<tspan fontSize={f - 4} dy="3">{sub}</tspan>{suite ? <tspan dy="-3">{suite}</tspan> : null}</text>
);
// Flèche épaisse (largeur ep) avec une pointe de taille fixe : pour montrer qu'un courant est grand ou petit
export const Fleche = ({ x1, x2, cy, ep, c = COUL.eau }) => {
  const h = Math.max(ep / 2 + 3, 6);
  return <g><line x1={x1} y1={cy} x2={x2 - 12} y2={cy} stroke={c} strokeWidth={ep} /><polygon points={`${x2},${cy} ${x2 - 14},${cy - h} ${x2 - 14},${cy + h}`} fill={c} /></g>;
};
// Barre de puissance : ce qui arrive, la part utile (orange) et la part perdue (rouge pâle)
export function BarrePertes({ haut, utile, perdu, frac, titre }) {
  const w = Math.max(frac * 340, 6);
  return (
    <Schema h={96} titre={titre}>
      <T x="180" y="18" s={haut} f={14} />
      <rect x="10" y="28" width="340" height="30" fill="#fecaca" stroke={COUL.rouge} strokeWidth="1.5" strokeDasharray="5 3" />
      <rect x="10" y="28" width={w} height="30" fill={COUL.orange} />
      <T x="10" y="82" s={utile} a="start" c={COUL.orange} />
      <T x="350" y="82" s={perdu} a="end" c="#991b1b" />
    </Schema>
  );
}
// Trois cas avec le même jet : roue bloquée, vitesse de l'auget = moitié de celle du jet (maximum), auget aussi rapide que le jet
export function TroisVitesses({ sousJ = 'jet', sousA = 'auget', bloquee = 'roue bloquée', trop = 'roue trop rapide', titre }) {
  const lignes = [
    { cy: 60, long: 0, col: '#64748b', l1: <><Emo e="✗"/> P = 0</>, l2: bloquee },
    { cy: 158, long: 57, col: COUL.vert, l1: <><Emo e="✓"/> maximum</>, l2: 'bon compromis', bon: true },
    { cy: 256, long: 114, col: COUL.rouge, l1: <><Emo e="✗"/> P = 0</>, l2: trop },
  ];
  return (
    <Schema h={306} titre={titre}>
      {lignes.map((r, k) => {
        const haut = r.cy - 26;
        return (
          <g key={k}>
            {r.bon && <rect x="3" y={r.cy - 52} width="354" height="90" rx="12" fill="#f0fdf4" stroke={COUL.vert} strokeWidth="2.5" />}
            <line x1="12" y1={haut} x2="116" y2={haut} stroke={COUL.eau} strokeWidth="2" markerEnd="url(#ahB)" />
            <Vs x={64} y={haut - 7} s="v" sub={sousJ} c={COUL.eau} />
            <circle cx="126" cy={r.cy} r="26" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
            {[0, 60, 120, 180, 240, 300].map(a => <circle key={a} cx={126 + 26 * Math.cos(a * Math.PI / 180)} cy={r.cy + 26 * Math.sin(a * Math.PI / 180)} r="4.5" fill={COUL.eau} />)}
            {r.long > 0 && <line x1="126" y1={haut} x2={126 + r.long - 4} y2={haut} stroke={r.col} strokeWidth="2.5" markerEnd={r.bon ? 'url(#ahG)' : 'url(#ahR)'} />}
            {r.long > 0 ? <Vs x={130} y={haut - 7} s="v" sub={sousA} a="start" c={r.col} /> : <Vs x={130} y={haut - 7} s="v" sub={sousA} suite=" = 0" a="start" c={r.col} />}
            <T x="256" y={r.cy - 4} s={r.l1} a="start" c={r.bon ? COUL.vert : COUL.rouge} />
            <T x="256" y={r.cy + 14} s={r.l2} a="start" w={600} c="#475569" />
          </g>);
      })}
    </Schema>
  );
}
