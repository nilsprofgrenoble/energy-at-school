// ═══════════════════════════════════════════════════════════════════════════
//  COMPTES ENERGY@SCHOOL : bouton d'en-tête, connexion, page « Mon profil » (élève), page « Suivi » (professeur).
//  Tout reste facultatif : sans compte, le site fonctionne exactement comme avant.
// ═══════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useMemo } from 'react';
import { cardStyle, KIT, styleBouton, styleBoite } from './commun';
import { useSession, estEleve, estProf, connexion, deconnexion, changerMotDePasse, rest, toutLire, getSession } from './serveur';
import { FAMILLES, TOUS_PARCOURS, DEFIS, NIVEAUX, bilan, termine, useSuivi, synchroniser, oublierLocal } from './avancement';
import { pseudo, propositions, ADJECTIFS, NOMS } from './pseudos';

const CLE_PROPRIO = 'es-proprietaire';
const lireProprio = () => { try { return window.localStorage.getItem(CLE_PROPRIO); } catch { return null; } };
const ecrireProprio = id => { try { window.localStorage.setItem(CLE_PROPRIO, id); } catch { /* indisponible */ } };

// Connexion : l'avancement de l'appareil est repris par le compte, SAUF s'il appartient à un autre élève
export async function seConnecter(identifiant, mdp, persistant) {
  await connexion(identifiant, mdp, persistant);
  const s = getSession();
  if (estEleve(s)) {
    const id = s.user?.id;
    const proprio = lireProprio();
    if (proprio && proprio !== id) oublierLocal();          // appareil partagé : on ne mélange pas deux élèves
    if (id) ecrireProprio(id);
    await synchroniser();
  }
  window.location.reload();                                 // les parcours relisent leur état enregistré
}
export async function seDeconnecter() {
  await deconnexion();
  oublierLocal();                                           // l'appareil repart à zéro pour la personne suivante
  window.location.assign(window.location.pathname);
}

const champ = { padding: '8px 10px', borderRadius: 8, border: `1.5px solid ${KIT.bord}`, fontSize: 15, width: '100%' };

export function FormulaireConnexion({ onFermer }) {
  const [id, setId] = useState(''), [mdp, setMdp] = useState(''), [reste, setReste] = useState(false), [msg, setMsg] = useState(''), [occupe, setOccupe] = useState(false);
  const envoyer = async e => {
    e.preventDefault(); setOccupe(true); setMsg('');
    try { await seConnecter(id, mdp, reste); }
    catch (er) { setMsg(er.message || 'Connexion impossible.'); setOccupe(false); }
  };
  return (
    <div role="dialog" aria-modal="true" aria-label="Connexion" onClick={onFermer}
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <form onSubmit={envoyer} onClick={e => e.stopPropagation()} style={{ ...cardStyle, maxWidth: 380, width: '100%', display: 'grid', gap: 10, textAlign: 'left' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: KIT.txt }}>🔑 Se connecter</div>
        <div style={{ fontSize: 13.5, color: KIT.txt2, lineHeight: 1.5 }}>
          Avec le compte donné par votre professeur, votre avancement est enregistré et vos niveaux se débloquent.
          Sans compte, toutes les simulations restent utilisables.
        </div>
        <label style={{ fontSize: 13, fontWeight: 700 }}>Identifiant<br />
          <input value={id} onChange={e => setId(e.target.value)} placeholder="ense-07" autoCapitalize="none" autoCorrect="off" autoComplete="username" style={champ} /></label>
        <label style={{ fontSize: 13, fontWeight: 700 }}>Mot de passe<br />
          <input type="password" value={mdp} onChange={e => setMdp(e.target.value)} autoComplete="current-password" style={champ} /></label>
        <label style={{ fontSize: 13, color: KIT.txt2, display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="checkbox" checked={reste} onChange={e => setReste(e.target.checked)} /> Rester connecté (pas sur un ordinateur partagé)</label>
        {msg && <div role="alert" style={{ fontSize: 13.5, color: '#b91c1c', fontWeight: 700 }}>{msg}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onFermer} style={styleBouton(false)}>Annuler</button>
          <button type="submit" disabled={occupe || !id || !mdp} style={{ ...styleBouton(true, '#ea580c'), opacity: occupe || !id || !mdp ? 0.5 : 1 }}>{occupe ? 'Connexion…' : 'Se connecter'}</button>
        </div>
      </form>
    </div>
  );
}

// Pseudo de l'élève connecté (null tant qu'il n'en a pas choisi)
function usePseudo() {
  const s = useSession();
  const [p, setP] = useState(undefined);
  useEffect(() => {
    if (!estEleve(s)) { setP(undefined); return; }
    let vivant = true;
    rest('energy_pseudos?select=adj,nom').then(l => { if (vivant) setP(l[0] || null); }).catch(() => { if (vivant) setP(null); });
    return () => { vivant = false; };
  }, [s?.user?.id, s?.profil?.role]);
  return [p, setP];
}

export function BoutonCompte({ aller }) {
  const s = useSession(), suivi = useSuivi();
  const [ouvert, setOuvert] = useState(false);
  const [p] = usePseudo();
  const style = { padding: '8px 16px', borderRadius: 999, border: '1.5px solid #d5dfeb', background: 'white', cursor: 'pointer', fontWeight: 800, fontSize: 13.5, color: '#334155' };
  if (estEleve(s)) {
    const b = bilan(suivi), pp = p ? pseudo(p.adj, p.nom) : null;
    return <button onClick={() => aller('profil')} style={style} title="Mon profil et mes niveaux">{pp ? `${pp.icone} ${pp.texte}` : `👤 ${s.profil.identifiant}`} · {b.niveau.icone} {b.niveau.nom}</button>;
  }
  if (estProf(s)) return <button onClick={() => aller('suivi')} style={style}>👩‍🏫 {s.profil.nom} · suivi des classes</button>;
  return <>
    <button onClick={() => setOuvert(true)} style={style}>🔑 Se connecter</button>
    {ouvert && <FormulaireConnexion onFermer={() => setOuvert(false)} />}
  </>;
}

const Barre = ({ valeur, max, couleur }) => (
  <div style={{ height: 8, borderRadius: 4, background: '#e2e8f0', overflow: 'hidden' }} role="img" aria-label={`${valeur} sur ${max}`}>
    <div style={{ width: `${max ? Math.min(100, 100 * valeur / max) : 0}%`, height: '100%', background: couleur }} />
  </div>
);

export function PageProfil({ aller }) {
  const s = useSession(), suivi = useSuivi();
  const [p, setP] = usePseudo();
  const [props, setProps] = useState(() => propositions(4));
  const [msg, setMsg] = useState(''), [mdp, setMdp] = useState(''), [changer, setChanger] = useState(false);
  const b = bilan(suivi);
  if (!estEleve(s)) return <div style={cardStyle}>Cette page est réservée aux élèves connectés. <button onClick={() => aller('presentation')} style={styleBouton(false)}>Retour</button></div>;
  const choisir = async ([adj, nom]) => {
    setMsg('');
    try {
      const corps = { adj, nom };
      if (p) await rest('energy_pseudos?user_id=eq.' + s.user.id, { method: 'PATCH', corps });
      else await rest('energy_pseudos', { method: 'POST', corps, entetes: { Prefer: 'return=minimal' } });
      setP({ adj, nom }); setProps(propositions(4));
    } catch (e) {
      setMsg(e.statut === 409 ? 'Ce pseudo est déjà pris dans votre classe : choisissez-en un autre.' : 'Impossible d’enregistrer le pseudo pour le moment.');
      setProps(propositions(4, Math.random, p ? [[p.adj, p.nom]] : []));
    }
  };
  const nouveauMdp = async () => {
    setMsg('');
    if (mdp.length < 8) { setMsg('Le mot de passe doit contenir au moins 8 caractères.'); return; }
    try { await changerMotDePasse(mdp); setMdp(''); setChanger(false); setMsg('Mot de passe modifié.'); } catch (e) { setMsg(e.message); }
  };
  const pp = p ? pseudo(p.adj, p.nom) : null;
  return (
    <div style={{ ...cardStyle, textAlign: 'left', display: 'grid', gap: 14 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 46 }} aria-hidden="true">{pp ? pp.icone : '👤'}</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: KIT.txt }}>{pp ? pp.texte : s.profil.identifiant}</div>
          <div style={{ fontSize: 14, color: KIT.txt2 }}>Classe {s.profil.classe} · identifiant {s.profil.identifiant}</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 28 }} aria-hidden="true">{b.niveau.icone}</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#ea580c' }}>Niveau {b.indice} · {b.niveau.nom}</div>
        </div>
      </div>

      <div style={styleBoite}>
        <div style={{ fontSize: 14.5, color: KIT.txt, marginBottom: 6 }}>
          <strong>{b.points} point{b.points > 1 ? 's' : ''} sur {b.max}</strong> : {b.faits} parcours terminé{b.faits > 1 ? 's' : ''} sur {b.total} et {b.defis} défi{b.defis > 1 ? 's' : ''} relevé{b.defis > 1 ? 's' : ''} sur {b.totalDefis}.{' '}
          {b.suivant ? <>Encore {b.suivant.seuil - b.points} point{b.suivant.seuil - b.points > 1 ? 's' : ''} pour le niveau « {b.suivant.icone} {b.suivant.nom} ».</> : <>Niveau maximal atteint : bravo !</>}
        </div>
        <Barre valeur={b.points} max={b.max} couleur="#ea580c" />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
          {NIVEAUX.map((n, i) => (
            <span key={n.nom} style={{ fontSize: 12.5, padding: '3px 8px', borderRadius: 12, fontWeight: 700,
              background: i <= b.indice ? '#ffedd5' : '#f1f5f9', color: i <= b.indice ? '#9a3412' : '#64748b', border: `1px solid ${i <= b.indice ? '#fdba74' : '#e2e8f0'}` }}>
              {n.icone} {n.nom} · {n.seuil}
            </span>))}
        </div>
        <div style={{ fontSize: 12.5, color: KIT.txt2, marginTop: 6 }}>Chaque parcours terminé (dernière étape atteinte) et chaque défi relevé (réussi en entier) rapporte 1 point. Les deux derniers niveaux demandent de relever des défis. Vous pouvez tout faire dans l’ordre que vous voulez.</div>
      </div>

      {FAMILLES.map(f => (
        <div key={f.id} style={{ border: `1.5px solid ${f.couleur}`, borderLeft: `6px solid ${f.couleur}`, borderRadius: 10, padding: '8px 12px' }}>
          <div style={{ fontWeight: 800, color: f.couleur, fontSize: 16 }}>{f.icone} {f.nom} {b.badges.includes(f) && <span style={{ fontSize: 12.5, background: f.couleur, color: 'white', borderRadius: 12, padding: '2px 8px', marginLeft: 6 }}>🏅 {f.badge}</span>}</div>
          {f.parcours.map(pc => {
            const v = suivi[pc.cle], fait = termine(v), max = v ? v.total - 1 : 1;
            return (
              <div key={pc.cle} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 120px 30px', gap: 8, alignItems: 'center', padding: '5px 0', fontSize: 14 }}>
                <a href={`?atelier=${pc.page}`} onClick={e => { e.preventDefault(); aller(pc.page); }} style={{ color: KIT.txt, fontWeight: 600 }}>{pc.nom}</a>
                <Barre valeur={v ? Math.min(v.etape, max) : 0} max={max} couleur={fait ? '#16a34a' : f.couleur} />
                <span aria-label={fait ? 'terminé' : 'à faire'}>{fait ? '✅' : ''}</span>
              </div>);
          })}
        </div>))}

      <div style={{ border: '1.5px solid #ea580c', borderLeft: '6px solid #ea580c', borderRadius: 10, padding: '8px 12px' }}>
        <div style={{ fontWeight: 800, color: '#ea580c', fontSize: 16 }}>🎯 Défis relevés {b.tousDefis && <span style={{ fontSize: 12.5, background: '#ea580c', color: 'white', borderRadius: 12, padding: '2px 8px', marginLeft: 6 }}>🏅 Relève-défis</span>}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
          {DEFIS.map(d => { const fait = termine(suivi[d.cle]); return (
            <a key={d.cle} href={`?atelier=${d.page}`} onClick={e => { e.preventDefault(); aller(d.page); }}
              style={{ fontSize: 13.5, fontWeight: 700, padding: '4px 10px', borderRadius: 14, textDecoration: 'none',
                background: fait ? '#dcfce7' : '#f1f5f9', color: fait ? '#166534' : '#475569', border: `1px solid ${fait ? '#86efac' : '#e2e8f0'}` }}>{fait ? '✅' : '🎯'} {d.nom}</a>); })}
        </div>
      </div>

      <div style={styleBoite}>
        <div style={{ fontSize: 15, fontWeight: 800, color: KIT.txt, marginBottom: 6 }}>{p ? 'Changer de pseudo' : 'Choisissez votre pseudo'}</div>
        <div style={{ fontSize: 13, color: KIT.txt2, marginBottom: 6 }}>Votre pseudo est tiré d’une liste : il n’y a ni nom ni prénom. Seul votre professeur le voit.</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {props.map(([a, n]) => { const q = pseudo(a, n); return <button key={`${a}-${n}`} onClick={() => choisir([a, n])} style={styleBouton(false, '#ea580c')}>{q.icone} {q.texte}</button>; })}
          <button onClick={() => setProps(propositions(4))} style={styleBouton(false, '#475569')}>🎲 D’autres idées</button>
        </div>
      </div>

      {msg && <div role="status" style={{ fontSize: 14, color: msg.startsWith('Mot de passe modifié') ? '#15803d' : '#b91c1c', fontWeight: 700 }}>{msg}</div>}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {changer ? <>
          <input type="password" value={mdp} onChange={e => setMdp(e.target.value)} placeholder="Nouveau mot de passe" autoComplete="new-password" style={{ ...champ, width: 220 }} aria-label="Nouveau mot de passe" />
          <button onClick={nouveauMdp} style={styleBouton(true, '#475569')}>Enregistrer</button>
          <button onClick={() => { setChanger(false); setMdp(''); }} style={styleBouton(false)}>Annuler</button>
        </> : <button onClick={() => setChanger(true)} style={styleBouton(false, '#475569')}>🔒 Changer mon mot de passe</button>}
        <button onClick={seDeconnecter} style={{ ...styleBouton(false, '#b91c1c'), marginLeft: 'auto' }}>Se déconnecter</button>
      </div>
    </div>
  );
}

// ── Suivi professeur : classes réglées sur « Energy@School » ──
export function PageSuivi({ aller }) {
  const s = useSession();
  const [classes, setClasses] = useState(null), [classeId, setClasseId] = useState(''), [eleves, setEleves] = useState([]), [prog, setProg] = useState([]), [pseud, setPseud] = useState([]), [err, setErr] = useState('');
  useEffect(() => {
    if (!estProf(s)) return;
    rest('classes?select=id,nom,prefixe,site&site=eq.energy&order=cree_le')
      .then(c => { setClasses(c); setClasseId(c[0]?.id || ''); })
      .catch(() => { setClasses([]); setErr('Le serveur n’est pas encore prêt pour Energy@School (script SQL 11 à lancer).'); });
  }, [s?.user?.id, s?.profil?.role]);
  useEffect(() => {
    if (!classeId) { setEleves([]); setProg([]); setPseud([]); return; }
    (async () => {
      try {
        const el = await rest(`eleves?select=user_id,identifiant&classe_id=eq.${classeId}&order=identifiant`);
        setEleves(el);
        if (!el.length) { setProg([]); setPseud([]); return; }
        const ids = el.map(e => e.user_id).join(',');
        setProg(await toutLire(`energy_progres?select=user_id,cle,etape,total,reussies&user_id=in.(${ids})`));
        setPseud(await toutLire(`energy_pseudos?select=user_id,adj,nom&user_id=in.(${ids})`));
      } catch (e) { setErr(e.message); }
    })();
  }, [classeId]);
  const lignes = useMemo(() => eleves.map(e => {
    const suivi = {}; prog.filter(l => l.user_id === e.user_id).forEach(l => { suivi[l.cle] = l; });
    const p = pseud.find(x => x.user_id === e.user_id);
    return { ...e, suivi, pseudo: p ? pseudo(p.adj, p.nom) : null, bilan: bilan(suivi) };
  }), [eleves, prog, pseud]);
  if (!estProf(s)) return <div style={cardStyle}>Page réservée aux professeurs connectés. <button onClick={() => aller('presentation')} style={styleBouton(false)}>Retour</button></div>;
  const exporter = () => {
    const tete = ['identifiant', 'pseudo', 'niveau', 'points', 'parcours terminés', 'défis relevés', ...TOUS_PARCOURS.map(p => p.nom), ...DEFIS.map(d => 'défi ' + d.nom)];
    const l = lignes.map(r => [r.identifiant, r.pseudo?.texte || '', r.bilan.niveau.nom, r.bilan.points, r.bilan.faits, r.bilan.defis, ...TOUS_PARCOURS.map(p => (r.suivi[p.cle] ? `${Math.min(r.suivi[p.cle].etape + 1, r.suivi[p.cle].total)}/${r.suivi[p.cle].total}` : '')), ...DEFIS.map(d => (termine(r.suivi[d.cle]) ? 'oui' : ''))]);
    const csv = [tete, ...l].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })); a.download = 'energy-at-school-suivi.csv'; a.click();
  };
  const classe = classes?.find(c => c.id === classeId);
  return (
    <div style={{ ...cardStyle, textAlign: 'left', display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: KIT.txt }}>👩‍🏫 Suivi Energy@School</div>
        {classes?.length > 0 && <select value={classeId} onChange={e => setClasseId(e.target.value)} style={{ ...champ, width: 'auto' }} aria-label="Classe">
          {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}</select>}
        {lignes.length > 0 && <button onClick={exporter} style={styleBouton(false, '#475569')}>⬇️ Export CSV</button>}
        <button onClick={seDeconnecter} style={{ ...styleBouton(false, '#b91c1c'), marginLeft: 'auto' }}>Se déconnecter</button>
      </div>
      {err && <div role="alert" style={{ color: '#b91c1c', fontWeight: 700, fontSize: 14 }}>{err}</div>}
      {classes && !classes.length && !err && (
        <div style={{ ...styleBoite, fontSize: 14, lineHeight: 1.55 }}>
          Aucune classe n’est réglée sur Energy@School. Créez la classe et ses comptes dans le suivi de la Paillasse virtuelle
          (<a href="https://paillasse-virtuelle.fr/" style={{ color: 'inherit' }}>paillasse-virtuelle.fr</a>, connexion professeur), puis, dans « ⚙️ Gérer la classe », choisissez le site des élèves : <strong>Energy@School</strong>.
        </div>)}
      {classe && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 13.5, minWidth: 640, width: '100%' }}>
            <thead><tr style={{ background: '#f1f5f9' }}>
              <th style={th}>Élève</th><th style={th}>Pseudo</th><th style={th}>Niveau</th><th style={th}>Défis</th>
              {TOUS_PARCOURS.map(p => <th key={p.cle} style={{ ...th, fontSize: 11.5, maxWidth: 90 }} title={p.nom}>{FAMILLES.find(f => f.id === p.famille).icone} {p.nom}</th>)}
            </tr></thead>
            <tbody>{lignes.map(r => (
              <tr key={r.user_id} style={{ borderTop: '1px solid #e2e8f0' }}>
                <td style={td}><strong>{r.identifiant}</strong></td>
                <td style={td}>{r.pseudo ? `${r.pseudo.icone} ${r.pseudo.texte}` : <span style={{ color: '#94a3b8' }}>—</span>}</td>
                <td style={td}>{r.bilan.niveau.icone} {r.bilan.niveau.nom} <span style={{ color: '#64748b' }}>({r.bilan.points}/{r.bilan.max})</span></td>
                <td style={{ ...td, textAlign: 'center' }} title={DEFIS.filter(d => termine(r.suivi[d.cle])).map(d => d.nom).join(', ')}>{r.bilan.defis}/{r.bilan.totalDefis}</td>
                {TOUS_PARCOURS.map(p => { const v = r.suivi[p.cle]; return (
                  <td key={p.cle} style={{ ...td, textAlign: 'center' }}>{termine(v) ? '✅' : v ? <span style={{ color: '#64748b' }}>{Math.round(100 * Math.min(v.etape, v.total - 1) / (v.total - 1))} %</span> : <span style={{ color: '#cbd5e1' }}>·</span>}</td>); })}
              </tr>))}
            </tbody>
          </table>
          {!lignes.length && <div style={{ fontSize: 14, color: KIT.txt2, padding: 8 }}>Cette classe n’a pas encore d’élèves.</div>}
        </div>)}
      <div style={{ fontSize: 12.5, color: KIT.txt2 }}>« ✅ » : parcours terminé (dernière étape atteinte). Pourcentage : étape la plus avancée atteinte. « Défis » : défis relevés en entier. Points = parcours terminés + défis relevés ; l’ordre est libre.</div>
    </div>
  );
}
const th = { padding: '6px 8px', textAlign: 'left', fontWeight: 800, color: '#334155' };
const td = { padding: '6px 8px' };
export const _nbPseudos = ADJECTIFS.length * NOMS.length;
