import {interiorDistances} from './bounded-flow';
import {logoSurface} from './logo-surface';

let solidLogo:HTMLCanvasElement;
export function heroCanvas(){return solidLogo;}

// Use the header's actual typography and tracking, rather than redrawing its letters.
export function createHeroSculpture(count:number){
 const width=1280,height=400,canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
 const c=canvas.getContext('2d')!,brand=document.querySelector('.brand');
 const style=brand?getComputedStyle(brand):null,size=300;
 c.font=`${style?.fontWeight||'500'} ${size}px ${style?.fontFamily||'Arial'}`;
 const tracking=style?parseFloat(style.letterSpacing)/parseFloat(style.fontSize)*size:-18.75;
 const letters=[...'OHIHO'],widths=letters.map(letter=>c.measureText(letter).width);
 const total=widths.reduce((a,b)=>a+b,0)+tracking*4;
 c.fillStyle='#fff';c.textBaseline='alphabetic';
 const metrics=c.measureText('OHIHO'),baseline=(height+metrics.actualBoundingBoxAscent-metrics.actualBoundingBoxDescent)/2;
 let x=(width-total)/2;for(let i=0;i<letters.length;i++){c.fillText(letters[i],x,baseline);x+=widths[i]+tracking;}
 // A small morphological opening rounds sharp glyph corners without changing tracking.
 const source=c.getImageData(0,0,width,height),mask=new Uint8Array(width*height);
 for(let i=0;i<mask.length;i++)mask[i]=source.data[i*4+3]>127?1:0;
 const distance=interiorDistances(source.data,width,height),rounded=document.createElement('canvas');rounded.width=width;rounded.height=height;
 const r=rounded.getContext('2d')!;r.fillStyle='#fff';
 for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(distance[y*width+x]>=4){r.beginPath();r.arc(x,y,4,0,Math.PI*2);r.fill();}
 c.clearRect(0,0,width,height);c.drawImage(rounded,0,0);
 solidLogo=canvas;
 return logoSurface(interiorDistances(c.getImageData(0,0,width,height).data,width,height),width,height,count);
}
