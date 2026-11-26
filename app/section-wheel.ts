type Journey={from:number;to:number;phase:number};
// One physical gesture selects one adjacent section; its momentum is never queued.
export function installSectionWheel(sections:HTMLElement[],travel:(state:Journey)=>void,arrive:(target:number)=>void){
 let frame=0,running=false,lastWheel=-Infinity,amount=0,direction=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const stop=()=>{cancelAnimationFrame(frame);running=false;};
 const wheel=(event:WheelEvent)=>{
  if(event.ctrlKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||!event.deltaY)return;
  const node=event.target as HTMLElement;
  if(node.closest?.('input,textarea,select,[contenteditable="true"]'))return;
  event.preventDefault();
  const now=performance.now(),fresh=now-lastWheel>220;lastWheel=now;
  if(running)return;
  if(fresh){amount=0;direction=Math.sign(event.deltaY);}else if(!amount)return;
  const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
  if(Math.sign(delta)!==direction){direction=Math.sign(delta);amount=0;}
  amount+=Math.abs(delta);if(amount<12)return;amount=0;
  let from=0;for(let i=1;i<sections.length;i++)if(Math.abs(scrollY-sections[i].offsetTop)<Math.abs(scrollY-sections[from].offsetTop))from=i;
  const to=(from+direction+sections.length)%sections.length,start=now,duration=reduced?0:4000;
  running=true;
  const tick=(time:number)=>{const phase=duration?Math.max(0,Math.min(1,(time-start)/duration)):1;
   travel({from,to,phase});
   if(phase<1){frame=requestAnimationFrame(tick);return;}
   window.scrollTo({top:sections[to].offsetTop,behavior:'instant'});
   history.replaceState(null,'',location.pathname+location.search+'#'+sections[to].id);
   running=false;arrive(to);
  };frame=requestAnimationFrame(tick);
 };
 const navigate=(event:MouseEvent)=>{if((event.target as HTMLElement).closest?.('a[href^="#"]'))stop();};
 window.addEventListener('wheel',wheel,{passive:false});document.addEventListener('click',navigate);
 return {isAnimating:()=>running,dispose(){stop();window.removeEventListener('wheel',wheel);document.removeEventListener('click',navigate);}};
}
