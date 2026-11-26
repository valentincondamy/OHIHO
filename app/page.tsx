'use client';
import {useEffect,useState} from 'react';
import Scene from './scene';
import TextSound from './text-sound';
import {installSectionWheel} from './section-wheel';

const ids=['accueil','offres','methode','projets','contact'];
const names=['Accueil','Offres','Méthode','Projets','Contact'];
export default function Home(){
 const [active,setActive]=useState(0),[paused,setPaused]=useState(false),[journey,setJourney]=useState<{from:number;to:number;phase:number}|null>(null);
 useEffect(()=>{
  const sections=Array.from(document.querySelectorAll<HTMLElement>('main section'));
  let frame=0;
  const update=()=>{
   frame=0;if(wheel.isAnimating())return;const y=window.scrollY;let index=0;
   while(index<sections.length-1&&y>=sections[index+1].offsetTop)index++;
   const next=(index+1)%sections.length;
   const end=index===sections.length-1?document.documentElement.scrollHeight-innerHeight:sections[next].offsetTop;
   const phase=Math.max(0,Math.min(1,(y-sections[index].offsetTop)/Math.max(1,end-sections[index].offsetTop)));
   if(index===sections.length-1&&phase>=1-1/Math.max(1,end-sections[index].offsetTop)){window.scrollTo({top:0,behavior:'instant'});history.replaceState(null,'',location.pathname+location.search+'#accueil');setActive(0);setJourney(null);window.dispatchEvent(new CustomEvent('ohiho:arrive',{detail:{target:0}}));return;}
   const selected=phase<.5?index:next;setActive(selected);
   if(phase===0){setJourney(null);window.dispatchEvent(new CustomEvent('ohiho:arrive',{detail:{target:index}}));}
   else{const detail={from:index,to:next,phase};setJourney(detail);window.dispatchEvent(new CustomEvent('ohiho:navigate',{detail}));}
  };
  const wheel=installSectionWheel(sections,(detail)=>{setJourney(detail);setActive(detail.phase<.5?detail.from:detail.to);window.dispatchEvent(new CustomEvent('ohiho:navigate',{detail}));},target=>{setJourney(null);setActive(target);window.dispatchEvent(new CustomEvent('ohiho:arrive',{detail:{target}}));});
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
  frame=requestAnimationFrame(update);
  return()=>{wheel.dispose();cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
 },[]);

 return <main><Scene paused={paused}/><header><a className="brand" href="#accueil">OHIHO</a><span className="byline">VALENTIN CONDAMY<br/>DÉVELOPPEUR INDÉPENDANT</span><a href="#contact">Parlons de votre projet ↗</a></header><nav aria-label="Sections">{names.map((n,i)=><a key={n} href={'#'+ids[i]} aria-current={active===i?'location':undefined}><span>{n}</span>0{i+1}</a>)}</nav>
 <section id="accueil"><div className="copy hero-copy"><div className="hero-heading"><p className="eyebrow">VALENTIN CONDAMY · DÉVELOPPEUR INDÉPENDANT</p><h1>Développeur web.<br/><em>Applications sur mesure.</em></h1></div><div className="hero-caption"><p className="hero-description">Votre activité a sa signature.<br/>Votre site et vos outils aussi.</p></div></div></section>
 <section id="offres"><div className="copy"><p className="eyebrow">01 / OFFRES</p><h2>Du besoin<br/><em>au concret.</em></h2><div className="rows">{[['Création de site web','1 à 4 semaines','Une vitrine sur mesure, claire et efficace, pensée pour votre activité.'],['Création d’application web','Selon le projet','Un outil métier accessible en ligne, conçu autour de vos usages.'],['Automatisation de tâches','Outil adapté à votre métier','Je transforme vos tâches répétitives en un outil simple, fiable et adapté.']].map(([h,t,p],i)=><article key={h}><label>0{i+1}</label><div><h3>{h}<small>{t}</small></h3><p>{p}</p></div></article>)}</div></div></section>
 <section id="methode"><div className="copy"><p className="eyebrow">02 / MÉTHODE</p><h2>Un interlocuteur.<br/><em>Du début à la fin.</em></h2><div className="rows compact">{[['Échange','On regarde ensemble si le projet tient debout. Avis honnête, sans engagement.'],['Maquette et devis','Votre page d’accueil et son prix, avant la première ligne de code.'],['Développement','Une version en ligne dès les premiers jours, et des points d’étape réguliers.'],['Mise en ligne','Sur votre domaine, en HTTPS. Ensuite, le suivi.']].map(([h,p],i)=><article key={h}><label>0{i+1}</label><div><h3>{h}</h3><p>{p}</p></div></article>)}</div></div></section>
 <section id="projets"><div className="copy"><p className="eyebrow">03 / PROJETS</p><h2>Des idées.<br/><em>Des outils réels.</em></h2><div className="projects"><article><span>APPLICATION WEB · IA</span><h3>mycalories</h3><p>Décrivez votre repas en une phrase. L’outil estime les calories et les macronutriments.</p></article><article><span>APPLICATION MÉTIER</span><h3>BugTrack</h3><p>Demandes, anomalies, priorités et discussions. Un espace de suivi pour les entreprises.</p><small>Réservé aux comptes clients</small></article></div></div></section>
 <section id="contact"><div className="copy"><p className="eyebrow">04 / CONTACT</p><h2>Une idée&nbsp;?<br/><em>Parlons-en.</em></h2></div><div className="contact-links"><button type="button" aria-disabled="true" title="Lien à renseigner"><span>X / Twitter</span><b aria-hidden="true">↗</b></button><button type="button" aria-disabled="true" title="Lien à renseigner"><span>LinkedIn</span><b aria-hidden="true">↗</b></button><button type="button" aria-disabled="true" title="Lien à renseigner"><span>Écrivez-moi</span><b aria-hidden="true">↗</b></button></div></section>
 <div className="loop-tail" aria-hidden="true"/>
 <footer><TextSound/><span>OHIHO · DÉVELOPPEMENT WEB</span><span className="count" aria-live="off"><span className="journey-label">{journey?`${names[journey.from]} → ${names[journey.to]}`:`0${active+1} / 05 · ${names[active]}`}</span><i><b style={{width:`${journey?journey.phase*100:(active+1)*20}%`}}/></i></span><button onClick={()=>setPaused(!paused)} aria-pressed={paused}>{paused?'Reprendre le mouvement ▷':'Pause du mouvement Ⅱ'}</button></footer></main>
}
