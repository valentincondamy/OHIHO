export function particleTransition(progress:number){
 const base=Math.floor(progress),from=((base%5)+5)%5,to=(from+1)%5;
 const t=Math.max(0,Math.min(1,(progress-base-.18)/.64));
 const blend=t*t*(3-2*t),burst=Math.sin(Math.PI*blend);
 const weight=(shape:number)=>(from===shape?1-blend:0)+(to===shape?blend:0);
 return {from,to,blend,burst,logo:weight(0)+weight(4),cards:weight(1),contact:weight(4),glyph:weight(0),nearest:blend<.5?from:to};
}

// Every route, including the cyclic seam and direct navigation, uses this same curve.
export function particleJourney(from:number,to:number,phase:number){
 const t=Math.max(0,Math.min(1,(phase-.12)/.76)),blend=t*t*(3-2*t),burst=Math.sin(Math.PI*blend);
 const weight=(shape:number)=>(from===shape?1-blend:0)+(to===shape?blend:0);
 return {from,to,blend,burst,logo:weight(0)+weight(4),cards:weight(1),contact:weight(4),glyph:weight(0),nearest:blend<.5?from:to};
}
