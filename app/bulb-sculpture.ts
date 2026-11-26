const TAU=Math.PI*2;
const profile=[[0,1.55],[.36,1.47],[.69,1.24],[.9,.91],[.96,.55],[.88,.18],[.65,-.22],[.43,-.56],[.42,-.7]];
const cubic=(a:number,b:number,c:number,d:number,t:number)=>.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t);
const filamentCurves=[
 [[-.12,-.7],[-.12,-.05],[-.24,.32],[-.35,.61]],
 [[-.35,.61],[-.5,.93],[-.12,.95],[-.08,.72]],
 [[-.08,.72],[-.04,.49],[-.25,.59],[-.13,.8]],
 [[-.13,.8],[-.04,.96],[.16,.94],[.13,.72]],
 [[.13,.72],[.1,.5],[-.06,.62],[.08,.82]],
 [[.08,.82],[.3,1.04],[.48,.91],[.35,.61]],
 [[.35,.61],[.24,.32],[.12,-.05],[.12,-.7]]
];
const filament:number[][]=[];let filamentLength=0;
for(const curve of filamentCurves)for(let step=0;step<=40;step++){
 const t=step/40,a=1-t,x=a*a*a*curve[0][0]+3*a*a*t*curve[1][0]+3*a*t*t*curve[2][0]+t*t*t*curve[3][0],y=a*a*a*curve[0][1]+3*a*a*t*curve[1][1]+3*a*t*t*curve[2][1]+t*t*t*curve[3][1];
 const previous=filament[filament.length-1];if(previous)filamentLength+=Math.hypot(x-previous[0],y-previous[1]);filament.push([x,y,filamentLength]);
}
export function bulbPoint(out:Float32Array,j:number,i:number,u:number,v:number,time:number){
 time*=3;
 const part=i%20,angle=v+time*.16;
 let x=0,y=0,z=0;
 if(part<8){
  const t=(.5+.5*Math.sin(u+time*.12))*(profile.length-1),k=Math.min(profile.length-2,Math.floor(t)),f=t-k;
  const a=profile[Math.max(0,k-1)],b=profile[k],c=profile[k+1],d=profile[Math.min(profile.length-1,k+2)];
  const radius=Math.max(0,cubic(a[0],b[0],c[0],d[0],f));
  x=radius*Math.cos(angle);z=radius*Math.sin(angle);y=cubic(a[1],b[1],c[1],d[1],f);
 }else if(part<14){
  const t=.5+.5*Math.sin(u+time*.15),radius=.405+.045*Math.cos(t*TAU*4-angle);
  x=radius*Math.cos(angle);z=radius*Math.sin(angle);y=-.72-t*.51;
 }else if(part===14){
  const phi=Math.acos(Math.cos(u+time*.15)),r=.405*Math.sin(phi);
  x=r*Math.cos(angle);z=r*Math.sin(angle);y=-1.23-.16*Math.abs(Math.cos(phi));
 }else{
  const distance=(.5+.5*Math.sin(u+time*.2))*filamentLength;
  let lo=1,hi=filament.length-1;while(lo<hi){const mid=(lo+hi)>>1;if(filament[mid][2]<distance)lo=mid+1;else hi=mid;}
  const a=filament[lo-1],b=filament[lo],t=(distance-a[2])/Math.max(.00001,b[2]-a[2]);
  x=a[0]+(b[0]-a[0])*t+.018*Math.cos(angle);y=a[1]+(b[1]-a[1])*t;z=.018*Math.sin(angle);
 }
 // A fixed diagonal presentation; every part shares the same rigid transform.
 const yaw=-.18,tilt=-Math.PI/7;
 const rx=x*Math.cos(yaw)+z*Math.sin(yaw),rz=-x*Math.sin(yaw)+z*Math.cos(yaw);
 out[j]=rx*Math.cos(tilt)-y*Math.sin(tilt);
 out[j+1]=rx*Math.sin(tilt)+y*Math.cos(tilt);
 out[j+2]=rz;
}
