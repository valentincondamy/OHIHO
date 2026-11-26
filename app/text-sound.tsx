'use client';
import {useEffect,useRef,useState} from 'react';
import {createAmbientMusic} from './ambient-music';
export default function TextSound(){
 const [enabled,setEnabled]=useState(true),allowed=useRef(true);
 useEffect(()=>{const saved=localStorage.getItem('ohiho-sound')!=='off';setEnabled(saved);allowed.current=saved;
  let music:ReturnType<typeof createAmbientMusic>|null=null;
  let context:AudioContext|null=null,buffer:AudioBuffer|null=null,source:AudioBufferSourceNode|null=null,disposed=false;
  const ensure=()=>{if(!context){context=new AudioContext();music=createAmbientMusic(context);music.setEnabled(allowed.current&&!document.hidden);fetch('/audio/text-reveal.ogg').then(r=>r.arrayBuffer()).then(b=>context!.decodeAudioData(b)).then(b=>{if(!disposed)buffer=b;}).catch(()=>{});}if(context.state==='suspended')void context.resume().then(()=>music?.setEnabled(allowed.current&&!document.hidden)).catch(()=>{});};
  const unlock=()=>{if(allowed.current)ensure();};
  const stop=()=>{try{source?.stop();}catch{}source=null;};
  const play=()=>{if(!allowed.current||!context||context.state!=='running'||!buffer)return;stop();source=context.createBufferSource();source.buffer=buffer;const gain=context.createGain();gain.gain.value=.3;source.connect(gain);gain.connect(context.destination);source.start();};
  const toggle=(e:Event)=>{allowed.current=(e as CustomEvent<boolean>).detail;localStorage.setItem('ohiho-sound',allowed.current?'on':'off');if(allowed.current){ensure();play();}else stop();music?.setEnabled(allowed.current&&!document.hidden);};
  const visibility=()=>music?.setEnabled(allowed.current&&!document.hidden);document.addEventListener('visibilitychange',visibility);
  window.addEventListener('pointerdown',unlock);window.addEventListener('keydown',unlock);window.addEventListener('ohiho:text-reveal',play);window.addEventListener('ohiho:sound',toggle);window.addEventListener('ohiho:navigate',stop);
  return()=>{disposed=true;stop();music?.dispose();document.removeEventListener('visibilitychange',visibility);void context?.close();window.removeEventListener('pointerdown',unlock);window.removeEventListener('keydown',unlock);window.removeEventListener('ohiho:text-reveal',play);window.removeEventListener('ohiho:sound',toggle);window.removeEventListener('ohiho:navigate',stop);};
 },[]);
 return <button className="sound-toggle" type="button" aria-pressed={enabled} aria-label={enabled?'Couper le son':'Activer le son'} onClick={()=>{const value=!enabled;setEnabled(value);allowed.current=value;window.dispatchEvent(new CustomEvent('ohiho:sound',{detail:value}));}}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4 5 9H2v6h3l6 5V4Z"/>{enabled?<><path d="M15 8a6 6 0 0 1 0 8"/><path d="M18 5a10 10 0 0 1 0 14"/></>:<path d="m16 9 6 6m0-6-6 6"/>}</svg><span>Sound: {enabled?'On':'Off'}</span></button>;
}
