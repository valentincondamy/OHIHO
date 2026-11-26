'use client';
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {stepParticle} from './particle-interaction';
import {createCursorWake} from './cursor-wake';
import {interiorDistances} from './bounded-flow';
import {particleTransition, particleJourney} from './particle-transition';
import {offerPoint,offerCanvases} from './offer-sculptures';
import {contactPoint} from './contact-sculpture';

import {bulbPoint} from './bulb-sculpture';
import {methodPoint} from './method-sculpture';
import {createHeroSculpture,heroCanvas} from './hero-sculpture';
import {prepareTextReveal} from './text-reveal';
const vert=`attribute vec3 shape1;attribute vec3 shape2;attribute vec3 shape3;attribute vec3 shape4;attribute float seed;attribute float glyphShade;attribute float contactShade;
attribute vec3 displacement;uniform float cardSurface;uniform float heroSurface;uniform float fromShape;uniform float toShape;uniform float blendValue;uniform float burst;uniform float glyphWeight;uniform float contactWeight;uniform float rotation;uniform float logoWeight;uniform float dpr;uniform float motion;varying float light;varying float tint;varying float density;varying float hero;
vec3 shape(float id){if(id<.5)return position;if(id<1.5)return shape1;if(id<2.5)return shape2;if(id<3.5)return shape3;return shape4;}
void main(){float arrival=blendValue;
if(toShape>.5&&toShape<1.5){float order=clamp((1.25-shape1.y)/2.5,0.,1.);arrival=smoothstep(order*.16,.84+order*.16,blendValue);}
vec3 p=mix(shape(fromShape),shape(toShape),arrival);
vec3 randomDir=vec3(sin(seed*713.),cos(seed*439.),sin(seed*917.));
p+=randomDir*burst*(.9+seed*.8)*motion;
density=1.-max(cardSurface,heroSurface);
mat2 rot=mat2(cos(rotation),-sin(rotation),sin(rotation),cos(rotation));p.xz=rot*p.xz;
vec4 world=modelViewMatrix*vec4(p,1.);world.xyz+=displacement*motion;
gl_Position=projectionMatrix*world;float grain=mix(1.8+seed*1.9,1.35+1.3*pow(seed,1.6),glyphWeight);gl_PointSize=clamp(grain*(1.-.16*contactWeight)*dpr*(7./-world.z),1.,7.);hero=glyphWeight;
float baseLight=.28+.65*smoothstep(-1.7,1.7,p.z)+.18*sin(p.y*1.5+1.);
light=baseLight*(1.-glyphWeight-contactWeight)+(.36+.58*smoothstep(-.28,.28,p.z)+.12*glyphShade)*glyphWeight+contactShade*contactWeight;tint=seed;}`;
const frag=`varying float light;varying float tint;varying float density;varying float hero;void main(){vec2 p=gl_PointCoord*2.-1.;float r=dot(p,p);if(density<=0.||r>1.||fract(tint*173.13)>=density)discard;float shade=.45+.55*sqrt(1.-r);vec3 col=mix(vec3(.4,.49,.57),vec3(.88,.91,.91),tint);col=mix(col,vec3(.72+.28*tint),hero);gl_FragColor=vec4(col*light*shade,1.);}`;
export default function Scene({paused}:{paused:boolean}){
 const host=useRef<HTMLDivElement>(null),pause=useRef(paused);pause.current=paused;const [failed,setFailed]=useState(false);
 useEffect(()=>{const el=host.current;if(!el)return;let renderer:THREE.WebGLRenderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});}catch{setFailed(true);return;}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const compactViewport=innerWidth<900||innerHeight<560;const count=compactViewport?30000:110000;
 renderer.setClearColor(0,0);el.appendChild(renderer.domElement);const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,50);camera.position.z=8.8;
 const arrays=Array.from({length:5},()=>new Float32Array(count*3)),seeds=new Float32Array(count),parameters=new Float32Array(count*2),spherePhi=new Float32Array(count);
 const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=400;const ctx=canvas.getContext('2d')!;
 ctx.strokeStyle='white';ctx.lineWidth=48;ctx.lineCap='round';ctx.lineJoin='round';
 for(const x of [300,900]){ctx.beginPath();ctx.ellipse(x,200,70,88,0,0,Math.PI*2);ctx.stroke();}
 const stroke=(x1:number,y1:number,x2:number,y2:number)=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();};
 for(const x of [430,660]){stroke(x,112,x,288);stroke(x+110,112,x+110,288);stroke(x,200,x+110,200);}
 stroke(600,112,600,288);
 const pixels=ctx.getImageData(0,0,1200,400).data,letters:number[][]=[];for(let y=0;y<400;y++)for(let x=0;x<1200;x++)if(pixels[(y*1200+x)*4+3]>160)letters.push([(x-600)/230,(200-y)/230]);
 let state=177;function rnd(){state=(state*1664525+1013904223)>>>0;return state/4294967296;}
 for(let i=0;i<count;i++){const u=rnd()*Math.PI*2,v=rnd()*Math.PI*2,w=rnd(),side=i%3;const torus=(R:number,r:number)=>[(R+r*Math.cos(v))*Math.cos(u),(R+r*Math.cos(v))*Math.sin(u),r*Math.sin(v)];let p=torus(1.48,.44);arrays[0].set([p[0],p[1]*Math.cos(.46)-p[2]*Math.sin(.46),p[1]*Math.sin(.46)+p[2]*Math.cos(.46)],i*3);
 parameters[i*2]=u;parameters[i*2+1]=v;const phi=Math.acos(2*rnd()-1);spherePhi[i]=phi;offerPoint(arrays[1],i*3,i,u,v,0);
 methodPoint(arrays[2],i*3,i,u,v,0);
 bulbPoint(arrays[3],i*3,i,u,v,0);const xy=letters[Math.floor((i*.61803398875%1)*letters.length)]||[0,0];arrays[0].set([xy[0],xy[1],(rnd()-.5)*.16],i*3);arrays[4].set([xy[0],xy[1],(rnd()-.5)*.16],i*3);seeds[i]=rnd();}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(arrays[0],3));for(let i=1;i<5;i++)geo.setAttribute('shape'+i,new THREE.BufferAttribute(arrays[i],3));geo.setAttribute('seed',new THREE.BufferAttribute(seeds,1));
 for(const key of ['position','shape1','shape2','shape3','shape4'])(geo.getAttribute(key) as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
 const anchors=arrays[0].slice(),distance=interiorDistances(pixels,1200,400),radii=new Float32Array(count),glyphShade=new Float32Array(count);
 for(let i=0;i<count;i++){
  const j=i*3,ix=Math.round(anchors[j]*230+600),iy=Math.round(200-anchors[j+1]*230),d=distance[iy*1200+ix];
  const bevel=Math.sqrt(Math.max(0,1-(1-Math.min(1,d/13))**2));
  radii[i]=Math.min(.075,Math.max(0,d-1)/230*.8);
  arrays[0][j+2]=arrays[4][j+2]=(i%2?1:-1)*(.12+.18*seeds[i])*bevel;anchors[j+2]=arrays[0][j+2];glyphShade[i]=bevel;
 }
 const surfaceFlow=createHeroSculpture(count);surfaceFlow(arrays[0],0);glyphShade.fill(.85);
 geo.setAttribute('glyphShade',new THREE.BufferAttribute(glyphShade,1));
 const contactShade=new Float32Array(count);
 for(let i=0;i<count;i++)contactPoint(arrays[4],i*3,i,parameters[i*2],parameters[i*2+1],0,contactShade);
 geo.setAttribute('contactShade',new THREE.BufferAttribute(contactShade,1).setUsage(THREE.DynamicDrawUsage));

 function flowShape(shape:number,dt:number,time:number){
  const positions=arrays[shape];
  if(shape===4){for(let i=0,j=0;i<count;i++,j+=3)contactPoint(positions,j,i,parameters[i*2],parameters[i*2+1],time,contactShade);geo.getAttribute('shape4').needsUpdate=true;geo.getAttribute('contactShade').needsUpdate=true;return;}
  if(shape===0){
   surfaceFlow(positions,time);
   geo.getAttribute(shape===0?'position':'shape4').needsUpdate=true;return;
  }
  for(let i=0,j=0;i<count;i++,j+=3){
    const u=parameters[i*2]+time*.24+.08*Math.sin(parameters[i*2+1]*2+time*.6),v=parameters[i*2+1]+time*.36+.12*Math.sin(parameters[i*2]*2-time*.4);
    if(shape===1){offerPoint(positions,j,i,parameters[i*2],parameters[i*2+1],time);}
    else if(shape===2){methodPoint(positions,j,i,parameters[i*2],parameters[i*2+1],time);}
    else {bulbPoint(positions,j,i,parameters[i*2],parameters[i*2+1],time);}
  }
  geo.getAttribute(shape===0?'position':'shape'+shape).needsUpdate=true;
 }
 const offsets=new Float32Array(count*3),velocities=new Float32Array(count*3),wake=createCursorWake(),wakeSample=[0,0];
 const displacement=new THREE.BufferAttribute(offsets,3).setUsage(THREE.DynamicDrawUsage);geo.setAttribute('displacement',displacement);
 const uniforms={heroSurface:{value:1},cardSurface:{value:0},fromShape:{value:0},toShape:{value:1},blendValue:{value:0},burst:{value:0},glyphWeight:{value:1},contactWeight:{value:0},rotation:{value:0},logoWeight:{value:1},dpr:{value:1},motion:{value:reduced?0:1}};const mat=new THREE.ShaderMaterial({uniforms,vertexShader:vert,fragmentShader:frag});const points=new THREE.Points(geo,mat);points.frustumCulled=false;scene.add(points);
 const heroTexture=new THREE.CanvasTexture(heroCanvas());heroTexture.colorSpace=THREE.SRGBColorSpace;heroTexture.anisotropy=renderer.capabilities.getMaxAnisotropy();
 const heroGeometry=new THREE.PlaneGeometry(1280/230,400/230);
 const heroMaterial=new THREE.MeshBasicMaterial({map:heroTexture,transparent:true,opacity:1,toneMapped:false,depthTest:false,depthWrite:false});
 const heroMesh=new THREE.Mesh(heroGeometry,heroMaterial);heroMesh.renderOrder=3;points.add(heroMesh);
 const cardGeometry=new THREE.PlaneGeometry(1000/215,720/215);
 const cardTextures=offerCanvases().map(canvas=>{const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();return texture;});
 const cardMaterials=cardTextures.map(map=>new THREE.MeshBasicMaterial({map,color:0xffffff,toneMapped:false,transparent:true,opacity:0,depthWrite:false,depthTest:false}));
 cardMaterials.forEach(material=>{const mesh=new THREE.Mesh(cardGeometry,material);mesh.position.set(0,-5/215,.02);mesh.renderOrder=2;points.add(mesh);});
 let cardOpacity=0;
 const sections=Array.from(document.querySelectorAll('main section'));let stops:number[]=[];
 document.documentElement.classList.add('particle-offers');
 const captions=sections.map(section=>Array.from(section.querySelectorAll<HTMLElement>('.copy, .offer-labels, .contact-links')));
 const textReveal=prepareTextReveal(captions.flat(),reduced);
 let settledTime=0,captionScene=-1;
 if(!reduced)document.documentElement.classList.add('text-sequenced');
 const restoreText=()=>{document.documentElement.classList.remove('text-sequenced','particle-offers');captions.flat().forEach(node=>{node.style.removeProperty('--caption-opacity');node.inert=false;});};
 const contactLinks=document.querySelector<HTMLElement>('.contact-links');
 function resize(){renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);uniforms.dpr.value=renderer.getPixelRatio();camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
 const mobile=innerWidth<900||innerHeight<560,contactScale=mobile?Math.min(.825,camera.aspect*1.42):1.15*Math.min(1,camera.aspect/1.5);
 const pixelsPerUnit=innerHeight/(2*camera.position.z*Math.tan(THREE.MathUtils.degToRad(19)));
 contactLinks?.style.setProperty('--contact-width',String(4.65*contactScale*pixelsPerUnit)+'px');
 contactLinks?.style.setProperty('--contact-top',String((mobile?310:innerHeight/2)+.73*contactScale*pixelsPerUnit)+'px');
 stops=sections.map(s=>(s as HTMLElement).offsetTop);}
 resize();window.addEventListener('resize',resize);const observer=new ResizeObserver(resize);sections.forEach(s=>observer.observe(s));
 const ids=['accueil','offres','methode','projets','contact'];
 const controller={value:Math.max(0,ids.indexOf(location.hash.slice(1)))};
 let navigation:{from:number;to:number;phase:number}|null=null;
 let frame=0,last=performance.now(),clock=0,displayed=controller.value;const pointer=new THREE.Vector2(9,9),previous=new THREE.Vector2(9,9),pointerTarget=new THREE.Vector2(9,9);let hovering=false;
 const navigate=(event:Event)=>{const detail=(event as CustomEvent<{from:number;to:number;phase:number}>).detail;if(!navigation){offsets.fill(0);velocities.fill(0);displacement.needsUpdate=true;}navigation=detail;};
 const arrive=(event:Event)=>{controller.value=(event as CustomEvent<{target:number}>).detail.target;displayed=controller.value;navigation=null;};
 window.addEventListener('ohiho:navigate',navigate);window.addEventListener('ohiho:arrive',arrive);
 const move=(e:PointerEvent)=>{if(e.pointerType==='touch')return;pointerTarget.set(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2);if(!hovering){pointer.copy(pointerTarget);previous.copy(pointer);}hovering=true;},leave=()=>{hovering=false;},lost=(e:Event)=>{e.preventDefault();restoreText();setFailed(true);};window.addEventListener('pointermove',move);document.documentElement.addEventListener('pointerleave',leave);renderer.domElement.addEventListener('webglcontextlost',lost);
 function tick(now:number){const dt=Math.max(0,Math.min((now-last)/1000,.05));last=now;if(!document.hidden){
 if(!pause.current&&!reduced)clock+=dt;
 pointer.lerp(pointerTarget,1-Math.exp(-28*dt));
 displayed=controller.value;
 const wrapping=navigation!==null&&navigation.phase>.12&&navigation.phase<.88;
 const state=navigation?particleJourney(navigation.from,navigation.to,navigation.phase):particleTransition(controller.value),index=state.from,next=state.to,blend=state.blend,visualTransition=state.burst;
 const methodWeight=(index===2?1-blend:0)+(next===2?blend:0);
 const rotation=(.16*Math.sin(clock*.3)*(1-state.logo)*(1-methodWeight)+visualTransition*.8)*(1-state.cards)*(reduced?0:1);
 const cardHoverLocked=cardOpacity>0||state.cards>.82||state.glyph>.82;
 if(!pause.current&&!reduced)wake.update(pointer.x,pointer.y,hovering&&!wrapping&&!cardHoverLocked,dt);else wake.clear();
 const nearest=state.nearest,formed=visualTransition<.005;
 if(formed){if(captionScene!==nearest){captionScene=nearest;settledTime=0;}settledTime+=dt;}else settledTime=0;
 document.documentElement.dataset.sceneReady=formed?String(nearest):'';
 const captionOpacity=settledTime>=.18?1:0;
 textReveal.update(formed&&captionOpacity?nearest:-1);
 if(!reduced)captions.forEach((nodes,i)=>nodes.forEach(node=>{const opacity=formed&&i===nearest?captionOpacity:0;node.style.setProperty('--caption-opacity',String(opacity));node.inert=opacity<.95;}));
 const mobile=innerWidth<900||innerHeight<560,fit=Math.min(1,camera.aspect/1.5),scale=[1.15,1.08,1.17,1.1,1.15];
 points.position.set(0,mobile?camera.position.z*Math.tan(THREE.MathUtils.degToRad(19))*(1-(340+40*state.glyph+280*state.contact)/innerHeight):0,-visualTransition*.65);
 const logoPresence=state.logo;
 points.scale.setScalar(mobile?Math.min(.66*(1+.25*logoPresence),camera.aspect*(1.18+.24*logoPresence-.49*state.glyph)):THREE.MathUtils.lerp(scale[index],scale[next],blend)*fit);
 if(index===1||next===1)flowShape(1,dt,clock);
 if(!pause.current&&!reduced&&dt>0){
  if(blend<1&&index!==1)flowShape(index,dt,clock);
  if(blend>0&&next!==1)flowShape(next,dt,clock);
  const targetA=arrays[index],targetB=arrays[next],modelBlend=blend,size=points.scale.x;
  const c=Math.cos(rotation),s=Math.sin(rotation),tan=Math.tan(THREE.MathUtils.degToRad(19));
  const frameDT=dt;
  for(let i=0,j=0;i<count;i++,j+=3){
   const x=targetA[j]+(targetB[j]-targetA[j])*modelBlend,y=targetA[j+1]+(targetB[j+1]-targetA[j+1])*modelBlend,z=targetA[j+2]+(targetB[j+2]-targetA[j+2])*modelBlend;
   const depth=camera.position.z-((-s*x+c*z)*size+points.position.z),half=depth*tan;
   const px=(c*x+s*z)*size+points.position.x+offsets[j],py=y*size+points.position.y+offsets[j+1];
   const mx=pointer.x*half*camera.aspect,my=pointer.y*half,oldX=previous.x*half*camera.aspect,oldY=previous.y*half;
   const travelX=mx-oldX,travelY=my-oldY,length2=travelX*travelX+travelY*travelY;
   const t=length2>1e-8?Math.max(0,Math.min(1,((px-oldX)*travelX+(py-oldY)*travelY)/length2)):1;
   const vx=Math.max(-10,Math.min(10,travelX/dt)),vy=Math.max(-10,Math.min(10,travelY/dt));
   wake.sample(px/(half*camera.aspect),py/half,wakeSample);
   stepParticle(offsets,velocities,j,0,0,wakeSample[0]*half*camera.aspect,wakeSample[1]*half,seeds[i],!wrapping&&!cardHoverLocked&&visualTransition<.25,frameDT);
  }
  displacement.needsUpdate=true;
 }
 const cardRest=nearest===1&&visualTransition<.005;
 // The solid state depends exclusively on scroll progress, never pointer activity.
 if(cardRest){offsets.fill(0);velocities.fill(0);displacement.needsUpdate=true;}
 const desired=cardRest?1:0;
 // Keep the solid card through the hold; reveal particles only as they scatter.
 cardOpacity=desired?Math.min(1,cardOpacity+dt*4):Math.min(cardOpacity,nearest===1?1-THREE.MathUtils.smoothstep(visualTransition,0,.18):0);
 uniforms.cardSurface.value=cardOpacity;
 cardMaterials[0].opacity=cardOpacity;
 const heroOpacity=nearest===0?1-THREE.MathUtils.smoothstep(visualTransition,0,.16):0;
 heroMaterial.opacity=heroOpacity;heroMesh.visible=heroOpacity>0;uniforms.heroSurface.value=heroOpacity;
 if(heroOpacity>0){offsets.fill(0);velocities.fill(0);displacement.needsUpdate=true;}
 previous.copy(pointer);
 uniforms.fromShape.value=index;uniforms.toShape.value=next;uniforms.blendValue.value=blend;uniforms.burst.value=visualTransition;uniforms.logoWeight.value=state.logo;uniforms.glyphWeight.value=state.glyph;uniforms.contactWeight.value=state.contact;uniforms.rotation.value=rotation;renderer.render(scene,camera);
 }frame=requestAnimationFrame(tick);}frame=requestAnimationFrame(tick);
 return()=>{delete document.documentElement.dataset.sceneReady;cancelAnimationFrame(frame);textReveal.dispose();observer.disconnect();restoreText();window.removeEventListener('ohiho:navigate',navigate);window.removeEventListener('ohiho:arrive',arrive);window.removeEventListener('resize',resize);window.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',leave);renderer.domElement.removeEventListener('webglcontextlost',lost);heroGeometry.dispose();heroTexture.dispose();heroMaterial.dispose();cardGeometry.dispose();cardTextures.forEach(texture=>texture.dispose());cardMaterials.forEach(material=>material.dispose());geo.dispose();mat.dispose();renderer.dispose();renderer.domElement.remove();};},[]);
 return <div className="scene" ref={host} aria-hidden="true">{failed&&<div className="fallback" style={{fontSize:'clamp(42px, 8vw, 150px)',left:'50%',right:'auto',top:'50%',transform:'translate(-50%, -50%)'}}>OHIHO</div>}</div>;
}
