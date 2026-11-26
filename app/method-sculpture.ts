// Fixed, symmetric orbital silhouette; particles circulate along the bands.
export function methodPoint(out:Float32Array,j:number,i:number,u:number,v:number,time:number){
 const ring=i%3,angle=u+time*(.19+ring*.025),cross=v+time*.31;
 const rim=.11*Math.cos(cross);
 const x=(1.27+rim)*Math.cos(angle),y=(.53+rim)*Math.sin(angle);
 const turn=Math.PI/2+ring*Math.PI/3;
 out[j]=x*Math.cos(turn)-y*Math.sin(turn);
 out[j+1]=x*Math.sin(turn)+y*Math.cos(turn);
 out[j+2]=.12*Math.sin(2*angle)+.055*Math.sin(cross);
}
