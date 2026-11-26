// Closed paths on nested surface contours: particles travel without leaving the letter.
export function logoSurface(distance:Float32Array|Float64Array|number[],width:number,height:number,count:number){
 const loops:{points:number[][];length:number;depth:number}[]=[];
 for(let level=2;level<=24;level+=1){
  const edges=new Map<number,number>();const key=(x:number,y:number)=>y*(width+1)+x;
  const inside=(x:number,y:number)=>x>=0&&y>=0&&x<width&&y<height&&distance[y*width+x]>=level;
  for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++)if(inside(x,y)){
   if(!inside(x,y-1))edges.set(key(x,y),key(x+1,y));
   if(!inside(x+1,y))edges.set(key(x+1,y),key(x+1,y+1));
   if(!inside(x,y+1))edges.set(key(x+1,y+1),key(x,y+1));
   if(!inside(x-1,y))edges.set(key(x,y+1),key(x,y));
  }
  while(edges.size){const start=edges.keys().next().value!;let k=start;let pts:number[][]=[];
   do{pts.push([k%(width+1),Math.floor(k/(width+1))]);const next=edges.get(k);edges.delete(k);if(next===undefined)break;k=next;}while(k!==start&&pts.length<10000);
   if(pts.length<24)continue;
   for(let pass=0;pass<3;pass++)pts=pts.map((p,i)=>{const a=pts[(i+pts.length-2)%pts.length],b=pts[(i+2)%pts.length];return[(a[0]+p[0]*2+b[0])/4,(a[1]+p[1]*2+b[1])/4];});
   loops.push({points:pts,length:pts.length,depth:.28*Math.sqrt(Math.max(0,1-(1-Math.min(1,level/15))**2))});
  }
 }
 const total=loops.reduce((s,l)=>s+l.length,0),assign=new Uint16Array(count),phase=new Float32Array(count);
 for(let i=0;i<count;i++){let n=((i*.61803398875)%1)*total;let a=0;while(a<loops.length-1&&n>=loops[a].length){n-=loops[a].length;a++;}assign[i]=a;phase[i]=n;}
 return (out:Float32Array,time:number)=>{for(let i=0,j=0;i<count;i++,j+=3){const l=loops[assign[i]],n=((phase[i]+time*(20+assign[i]%3*3))%l.length+l.length)%l.length,a=Math.floor(n),t=n-a,p=l.points[a],q=l.points[(a+1)%l.length];out[j]=(p[0]+(q[0]-p[0])*t-width/2+Math.sin(i*17.13)*.45)/230;out[j+1]=(height/2-p[1]-(q[1]-p[1])*t+Math.cos(i*13.71)*.45)/230;out[j+2]=(i%2?1:-1)*l.depth;}};
}
