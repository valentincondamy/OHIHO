type Cloud={xy:Float32Array;canvas:HTMLCanvasElement};
let windowCache:Cloud|undefined;
// Both renderings share coordinates; only the finished surface has filled panels.
function drawWindow(c:CanvasRenderingContext2D,mask:boolean){
 c.scale(2,2);c.lineJoin='round';c.lineCap='round';
 const ink='#e9e9e9',muted='#979797',accent='#adadad';
 const color=(value:string)=>mask?'white':value;
 const box=(x:number,y:number,w:number,h:number,r:number,fill?:string,stroke?:string)=>{
  c.beginPath();c.roundRect(x,y,w,h,r);
  if(fill&&!mask){c.fillStyle=fill;c.fill();}
  if(stroke){c.strokeStyle=color(stroke);c.lineWidth=mask?1.8:1;c.stroke();}
 };
 const line=(x:number,y:number,x2:number,y2:number,tone=muted)=>{c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.lineWidth=mask?1.5:1;c.strokeStyle=color(tone);c.stroke();};
 const text=(s:string,x:number,y:number,size:number,tone=ink,font='Arial',weight='400')=>{c.fillStyle=color(tone);c.font=`${weight} ${size}px ${font}`;c.fillText(s,x,y);};
 box(70,90,860,530,22,'#0b0b0b','#484848');
 box(71,91,858,42,21,'#151515');line(71,133,929,133,'#3f3f3f');
 for(let k=0;k<3;k++){c.beginPath();c.arc(94+k*16,112,3.5,0,Math.PI*2);c.fillStyle=color(k===0?accent:'#6d6d6d');c.fill();}
 text('votresite.fr',451,116,11,muted,'monospace');text('↗',893,117,17,muted);
 text('Votre entreprise',104,177,23,ink,'Arial','500');
 text('À propos',588,173,12,muted);text('Nos services',674,173,12,muted);
 box(800,152,97,32,16,'#adadad');text('Parlons-nous ↗',811,172,11,mask?ink:'#1c1c1c');
 line(103,198,897,198,'#393939');
 text('VOTRE SAVOIR-FAIRE. VOTRE SIGNATURE.',105,236,10,accent,'monospace');
 text('Singulier.',101,302,65,ink,'Arial','500');text('Comme vous.',102,364,61,ink,'Georgia','italic');
 text('Un savoir-faire qui fait la différence.',105,405,16,'#c4c4c4');text('Des solutions pensées pour vous.',105,430,16,'#c4c4c4');
 box(105,459,166,39,20,'#adadad',mask?ink:undefined);
 text('Découvrir nos services',117,484,12,mask?ink:'#1e1e1e');text('↗',249,484,17,mask?ink:'#1e1e1e');
 // An orbital sculpture drawn in canvas, without an external bitmap dependency.
 c.save();c.beginPath();c.rect(557,203,340,320);c.clip();
 for(let ring=0;ring<3;ring++){
  c.save();c.translate(733,357);c.rotate(-.55+ring*Math.PI/3);c.beginPath();c.ellipse(0,0,125,49,0,0,Math.PI*2);
  if(mask){c.lineWidth=2;c.strokeStyle='white';c.stroke();}
  else {const g=c.createLinearGradient(-120,-55,100,55);g.addColorStop(0,'#454545');g.addColorStop(.28,'#888888');g.addColorStop(.47,'#d5d5d5');g.addColorStop(.62,'#a1a1a1');g.addColorStop(1,'#4c4c4c');c.lineWidth=17;c.strokeStyle=g;c.stroke();c.lineWidth=1;c.strokeStyle='#d7d7d777';c.stroke();}
  c.restore();
 }
 c.restore();text('L’EXIGENCE DANS CHAQUE DÉTAIL.',630,508,9,muted,'monospace');
 line(104,536,896,536,'#454545');
 const labels=[['01','Notre expertise','Un savoir-faire à votre service.'],['02','Nos engagements','La qualité, jusque dans les détails.'],['03','Votre projet','Un accompagnement sur mesure.']];
 labels.forEach(([n,title,caption],i)=>{const x=105+i*269;text(n,x,568,10,accent,'monospace');text(title,x+27,570,17);text(caption,x,595,11,muted);if(i<2)line(x+245,553,x+245,597,'#393939');});
}
function windowCloud():Cloud{
 const canvas=document.createElement('canvas');canvas.width=2000;canvas.height=1440;drawWindow(canvas.getContext('2d')!,false);
 const mask=document.createElement('canvas');mask.width=2000;mask.height=1440;const c=mask.getContext('2d')!;drawWindow(c,true);
 const data=c.getImageData(0,0,2000,1440).data,xy:number[]=[];
 for(let y=0;y<1440;y++)for(let x=0;x<2000;x++)if(data[(y*2000+x)*4+3]>160)xy.push((x/2-500)/215,(355-y/2)/215);
 return {xy:new Float32Array(xy),canvas};
}
export function offerPoint(out:Float32Array,j:number,i:number,u:number,v:number,time:number){
 const cloud=windowCache??(windowCache=windowCloud()),k=Math.floor((i*.61803398875%1)*cloud.xy.length/2)*2;
 out[j]=cloud.xy[k];out[j+1]=cloud.xy[k+1];out[j+2]=.008*Math.sin(v+time*.7);
}
export function offerCanvases(){return [(windowCache??(windowCache=windowCloud())).canvas];}
