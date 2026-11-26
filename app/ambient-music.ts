// Original light electronic loop: major harmony, short plucks, gentle 104 BPM pulse.
export function createAmbientMusic(context:AudioContext){
 const master=context.createGain();master.gain.value=0;master.connect(context.destination);
 const delay=context.createDelay(1),feedback=context.createGain(),wet=context.createGain();
 delay.delayTime.value=60/104*.75;feedback.gain.value=.2;wet.gain.value=.18;delay.connect(feedback);feedback.connect(delay);delay.connect(wet);wet.connect(master);
 const chords=[[60,64,67,74],[65,69,72,79],[67,71,74,81],[60,64,69,74]],melody=[0,2,1,3,2,1,3,2];
 const voices=new Set<OscillatorNode>();const step=60/104/2,start=context.currentTime+.12;let next=0,disposed=false;
 const tone=(midi:number,time:number,duration:number,level:number,pan:number,type:OscillatorType='sine')=>{
  const osc=context.createOscillator(),env=context.createGain(),stereo=context.createStereoPanner();osc.type=type;osc.frequency.value=440*Math.pow(2,(midi-69)/12);stereo.pan.value=pan;
  env.gain.setValueAtTime(0,time);env.gain.linearRampToValueAtTime(level,time+.012);env.gain.exponentialRampToValueAtTime(.0001,time+duration);
  osc.connect(env);env.connect(stereo);stereo.connect(master);if(midi>=60)stereo.connect(delay);
  voices.add(osc);osc.onended=()=>{voices.delete(osc);osc.disconnect();env.disconnect();stereo.disconnect();};osc.start(time);osc.stop(time+duration+.03);
 };
 const schedule=()=>{if(disposed||context.state!=='running')return;
  if(start+next*step<context.currentTime-.5)next=Math.max(next,Math.ceil((context.currentTime-start)/step));
  while(start+next*step<context.currentTime+.3){const time=Math.max(context.currentTime+.01,start+next*step),chord=chords[Math.floor(next/32)%4],n=next%32;
   if(n%2===0||n===15||n===31){const note=chord[melody[Math.floor(n/2)%8]]+12;tone(note,time,.5,n%4===0?.16:.105,Math.sin(next*.7)*.35);tone(note+12,time,.22,.018,0);}
   if(n%8===0){tone(chord[0]-12,time,.5,.17,0);chord.slice(1,3).forEach((note,i)=>tone(note,time,.8,.05,(i-.5)*.45));}
   if(n%4===0)tone(31,time,.1,.16,0);
   if(n%4===2)tone(102,time,.035,.025,.25);
   next++;
  }
 };
 const timer=setInterval(schedule,100);schedule();
 return {setEnabled(enabled:boolean){master.gain.cancelScheduledValues(context.currentTime);master.gain.setTargetAtTime(enabled?.18:0,context.currentTime,enabled?.4:.06);if(enabled)schedule();},dispose(){disposed=true;clearInterval(timer);for(const osc of voices){try{osc.stop();}catch{}}master.disconnect();delay.disconnect();feedback.disconnect();wet.disconnect();}};
}
