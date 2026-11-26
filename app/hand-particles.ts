import surface from './hand-surface.json';
const indices=surface.indices;
// Shape a shallow cup before sampling, preserving the mesh and finger separation.
const points=surface.points.slice();
for(let j=0;j<points.length;j+=3){
 const x=points[j],y=points[j+1]+.65,z=points[j+2];
 const curl=Math.max(0,-y-.2),rim=.18*x*x;
 const depth=z+rim+.3*curl*curl-.12*Math.exp(-3*(x*x+y*y));
 const yaw=-.38,pitch=.3;
 const rx=x*Math.cos(yaw)+depth*Math.sin(yaw),rz=-x*Math.sin(yaw)+depth*Math.cos(yaw);
 points[j]=rx;points[j+1]=y*Math.cos(pitch)-rz*Math.sin(pitch)-.58;points[j+2]=y*Math.sin(pitch)+rz*Math.cos(pitch);
}
const cumulative:number[]=[];
let area=0;
for(let i=0;i<indices.length;i+=3){
 const a=indices[i]*3,b=indices[i+1]*3,c=indices[i+2]*3;
 const ux=points[b]-points[a],uy=points[b+1]-points[a+1],uz=points[b+2]-points[a+2];
 const vx=points[c]-points[a],vy=points[c+1]-points[a+1],vz=points[c+2]-points[a+2];
 area+=Math.hypot(uy*vz-uz*vy,uz*vx-ux*vz,ux*vy-uy*vx)/2;cumulative.push(area);
}
const triangles:number[]=[];
export function handPoint(out:Float32Array,j:number,i:number,u:number,v:number,time:number){
 let triangle=triangles[i];
 if(triangle===undefined){const target=(i*.61803398875%1)*area;let lo=0,hi=cumulative.length-1;while(lo<hi){const mid=(lo+hi)>>1;if(cumulative[mid]<target)lo=mid+1;else hi=mid;}triangle=triangles[i]=lo;}
 const a=indices[triangle*3]*3,b=indices[triangle*3+1]*3,c=indices[triangle*3+2]*3;
 const baseU=u/(Math.PI*2),baseV=v/(Math.PI*2);
 const r=Math.sqrt(baseU+.85*baseU*(1-baseU)*Math.sin(time*1.4+v));
 const s=baseV+.85*baseV*(1-baseV)*Math.sin(time*1.2+u);
 const wa=1-r,wb=r*(1-s),wc=r*s;
 for(let k=0;k<3;k++)out[j+k]=points[a+k]*wa+points[b+k]*wb+points[c+k]*wc;
}
