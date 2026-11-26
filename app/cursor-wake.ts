// Screen-space velocity field. Semi-Lagrangian transport and pressure projection.
export function createCursorWake(){
 const n=48,size=n*n;let u=new Float32Array(size),v=new Float32Array(size),a=new Float32Array(size),b=new Float32Array(size);const div=new Float32Array(size);let p=new Float32Array(size),q=new Float32Array(size);let lastX=0,lastY=0,ready=false;
 const sample=(f:Float32Array,x:number,y:number)=>{x=Math.max(0,Math.min(n-1.001,x));y=Math.max(0,Math.min(n-1.001,y));const ix=Math.floor(x),iy=Math.floor(y),tx=x-ix,ty=y-iy,j=iy*n+ix;return(f[j]*(1-tx)+f[j+1]*tx)*(1-ty)+(f[j+n]*(1-tx)+f[j+n+1]*tx)*ty;};
 return {update(x:number,y:number,active:boolean,dt:number){
  const gx=(x+1)*.5*(n-1),gy=(y+1)*.5*(n-1),dx=ready&&active?gx-lastX:0,dy=ready&&active?gy-lastY:0;
  ready=active;lastX=gx;lastY=gy;
  const decay=Math.exp(-3*dt),vx=Math.max(-45,Math.min(45,dx/Math.max(.001,dt))),vy=Math.max(-45,Math.min(45,dy/Math.max(.001,dt)));
  for(let j=0;j<size;j++){const xx=j%n,yy=Math.floor(j/n);a[j]=sample(u,xx-u[j]*dt,yy-v[j]*dt)*decay;b[j]=sample(v,xx-u[j]*dt,yy-v[j]*dt)*decay;
   if(active&&(dx*dx+dy*dy)<225){const len=dx*dx+dy*dy,t=len?Math.max(0,Math.min(1,((xx-gx+dx)*dx+(yy-gy+dy)*dy)/len)):1;const ex=xx-(gx-dx+dx*t),ey=yy-(gy-dy+dy*t),w=Math.exp(-(ex*ex+ey*ey)/5)*Math.min(1,dt*24);a[j]+=vx*w;b[j]+=vy*w;}}
  [u,a]=[a,u];[v,b]=[b,v];p.fill(0);
  for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++){const j=y*n+x;div[j]=-.5*(u[j+1]-u[j-1]+v[j+n]-v[j-n]);}
  for(let k=0;k<8;k++){for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++){const j=y*n+x;q[j]=(div[j]+p[j-1]+p[j+1]+p[j-n]+p[j+n])*.25;}[p,q]=[q,p];}
  for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++){const j=y*n+x;u[j]-=.5*(p[j+1]-p[j-1]);v[j]-=.5*(p[j+n]-p[j-n]);}
 },sample(x:number,y:number,out:number[]){out[0]=sample(u,(x+1)*.5*(n-1),(y+1)*.5*(n-1))/n;out[1]=sample(v,(x+1)*.5*(n-1),(y+1)*.5*(n-1))/n;},clear(){u.fill(0);v.fill(0);ready=false;}};
}
