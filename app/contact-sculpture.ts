import {interiorDistances} from './bounded-flow';
let rotationTime=NaN,rotationCos=1,rotationSin=0,flowDt=0;
let moving=new Float32Array(0),initialized=new Uint8Array(0);
function rotateAt(time:number){if(time!==rotationTime){flowDt=Number.isFinite(rotationTime)?Math.max(0,Math.min(.04,time-rotationTime)):0;rotationTime=time;rotationCos=1;rotationSin=0;}}
let samples:{faces:Float32Array;edges:Float32Array;pixels:Uint8ClampedArray;distance:Float32Array}[]|undefined;
function prepare(){
 samples=['x','linkedin','mail'].map(kind=>{
  const canvas=document.createElement('canvas');canvas.width=400;canvas.height=400;const c=canvas.getContext('2d')!;
  c.strokeStyle='white';c.fillStyle='white';c.lineWidth=24;c.lineCap='round';c.lineJoin='round';
  if(kind==='x'){
   // Filled X silhouette, keeping the characteristic narrow diagonal.
   c.beginPath();c.moveTo(62,60);c.lineTo(143,60);c.lineTo(218,160);c.lineTo(302,60);c.lineTo(335,60);c.lineTo(234,181);c.lineTo(341,340);c.lineTo(260,340);c.lineTo(177,224);c.lineTo(79,340);c.lineTo(46,340);c.lineTo(161,203);c.closePath();c.fill();
   c.globalCompositeOperation='destination-out';c.beginPath();c.moveTo(101,82);c.lineTo(129,82);c.lineTo(302,318);c.lineTo(274,318);c.closePath();c.fill();c.globalCompositeOperation='source-over';
  }else if(kind==='linkedin'){
   // Draw the letterforms directly, avoiding font and frame clutter.
   c.beginPath();c.arc(91,93,28,0,Math.PI*2);c.fill();
   c.fillRect(66,141,51,190);
   c.beginPath();c.moveTo(155,141);c.lineTo(205,141);c.lineTo(205,167);c.bezierCurveTo(224,137,244,135,267,135);c.bezierCurveTo(318,135,339,168,339,219);c.lineTo(339,331);c.lineTo(286,331);c.lineTo(286,224);c.bezierCurveTo(286,196,277,181,258,181);c.bezierCurveTo(229,181,209,201,209,231);c.lineTo(209,331);c.lineTo(155,331);c.closePath();c.fill();
  }else{
   c.lineWidth=22;
   c.beginPath();c.roundRect(43,85,314,232,25);c.stroke();
   c.beginPath();c.moveTo(53,103);c.lineTo(186,210);c.quadraticCurveTo(200,222,214,210);c.lineTo(347,103);c.stroke();
  }
  const data=c.getImageData(0,0,400,400).data,d=interiorDistances(data,400,400),faces:number[]=[],edges:number[]=[];
  for(let y=1;y<399;y++)for(let x=1;x<399;x++){
   const k=y*400+x;if(data[k*4+3]<200)continue;
   const gx=d[k+1]-d[k-1],gy=d[k+400]-d[k-400],length=Math.hypot(gx,gy)||1;
   faces.push((x-200)/300,(200-y)/300,d[k],-gx/length,gy/length);
   if(data[(k-1)*4+3]<100||data[(k+1)*4+3]<100||data[(k-400)*4+3]<100||data[(k+400)*4+3]<100)
    {const ax=data[(k+1)*4+3]-data[(k-1)*4+3],ay=data[(k+400)*4+3]-data[(k-400)*4+3],al=Math.hypot(ax,ay)||1;edges.push((x-200)/300,(200-y)/300,0,-ax/al,ay/al);}
  }
  return {faces:new Float32Array(faces),edges:new Float32Array(edges),pixels:data,distance:d};
 });
}
// Sample the faces and the depth walls separately so these are closed volumes.
export function contactPoint(out:Float32Array,j:number,i:number,u:number,v:number,time:number,shades?:Float32Array){
 if(!samples)prepare();
 rotateAt(time);
 const kind=i%3,n=Math.floor(i/3),wall=n%6===0,points=wall?samples![kind].edges:samples![kind].faces;
 const index=Math.floor((n*.61803398875%1)*(points.length/5))*5;
 const sign=n%2?1:-1,bevel=.025,depth=.065;
 let x=points[index],y=points[index+1],z:number,nx:number,ny:number,nz:number;
 if(wall){z=Math.sin(v+time*(1.5+.35*Math.sin(u)))*(depth-bevel);nx=points[index+3];ny=points[index+4];nz=0;}
 else{
  // A bounded circulation preserves density and letter contours over time.
  const shape=samples![kind],field=shape.distance;
  const radius=Math.min(.022,Math.max(0,points[index+2]-1)/300*.6);
  const phase=u+time*(.65+.25*Math.sin(v));
  x+=Math.cos(phase)*radius;y+=Math.sin(phase)*radius;
  const k=Math.round(200-y*300)*400+Math.round(x*300+200),t=Math.min(1,field[k]/4),round=Math.sqrt(1-(1-t)*(1-t));
  const gx=field[k+1]-field[k-1],gy=field[k+400]-field[k-400],length=Math.hypot(gx,gy)||1;
  z=sign*(depth-bevel+bevel*round);nx=-gx/length*(1-t);ny=gy/length*(1-t);nz=sign*round;
 }
 const cy=rotationCos,sy=rotationSin,cp=1,sp=0;
 const rx=x*cy+z*sy,rz=-x*sy+z*cy;
 out[j]=rx*.8+(kind-1)*1.55;
 out[j+1]=(y*cp-rz*sp)*.8;
 out[j+2]=y*sp+rz*cp;
 if(shades){const a=nx*cy+nz*sy,b=-nx*sy+nz*cy;const light=(-a*.4+(ny*cp-b*sp)*.55+(ny*sp+b*cp)*.73)/Math.max(.001,Math.hypot(nx,ny,nz));shades[i]=.55+.45*Math.max(0,light);}
}
