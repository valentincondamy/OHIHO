// A transported cursor wake drives particles; a damped spring restores their form.
export function stepParticle(offset:Float32Array,velocity:Float32Array,j:number,dx:number,dy:number,flowX:number,flowY:number,seed:number,active:boolean,dt:number){
 const steps=Math.max(1,Math.ceil(dt/.008)),h=dt/steps;
 for(let s=0;s<steps;s++)for(let axis=0;axis<2;axis++){const k=j+axis,flow=axis?flowY:flowX;
  const force=active?flow*(7+seed*3):0;velocity[k]+=(force-9*offset[k]-6*velocity[k])*h;offset[k]+=velocity[k]*h;
 }
}
