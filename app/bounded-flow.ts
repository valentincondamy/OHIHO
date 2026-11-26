// Distance to the silhouette in pixels. The conservative margin keeps every orbit inside.
export function interiorDistances(pixels: Uint8ClampedArray, width: number, height: number) {
  const d = new Float32Array(width * height);
  for (let y=0;y<height;y++) for(let x=0;x<width;x++) {
    const i=y*width+x;d[i]=x>0&&y>0&&x<width-1&&y<height-1&&pixels[i*4+3]>100?1e6:0;
  }
  for(let y=1;y<height;y++)for(let x=1;x<width-1;x++){
    const i=y*width+x;d[i]=Math.min(d[i],d[i-1]+1,d[i-width]+1,d[i-width-1]+Math.SQRT2,d[i-width+1]+Math.SQRT2);
  }
  for(let y=height-2;y>=0;y--)for(let x=width-2;x>0;x--){
    const i=y*width+x;d[i]=Math.min(d[i],d[i+1]+1,d[i+width]+1,d[i+width-1]+Math.SQRT2,d[i+width+1]+Math.SQRT2);
  }
  for(let i=0;i<d.length;i++)d[i]=Math.max(0,(d[i]-1.5)*.65);
  return d;
}
