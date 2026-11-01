import {dialogue,wordsFor,cuts,SECONDS} from '../story/mysteryButton';
const SR=44100;
const silence:[number,number][]=[[41.5,42.85],[65,66.35],[68.85,69.9]];

/** Original sound design with actual Web Audio oscillators, FM, filters, envelopes and panning. */
async function renderTrack(voicesOnly=false) {
 const ctx=new OfflineAudioContext(2,SR*SECONDS,SR);
 const comp=ctx.createDynamicsCompressor();comp.threshold.value=-15;comp.knee.value=12;comp.ratio.value=3;comp.attack.value=.006;comp.release.value=.12;comp.connect(ctx.destination);
 const voiceBus=ctx.createGain();voiceBus.gain.value=.66;voiceBus.connect(comp);
 const fxBus=ctx.createGain();fxBus.gain.value=.49;fxBus.connect(comp);
 const musicBus=ctx.createGain();musicBus.gain.value=.17;musicBus.connect(comp);
 const noise=ctx.createBuffer(1,SR*2,SR);const nd=noise.getChannelData(0);let seed=7361;
 for(let i=0;i<nd.length;i++){seed=(seed*16807)%2147483647;nd[i]=seed/1073741824-1;}
 function tone(at:number,dur:number,freq:number,end:number,amp:number,type:OscillatorType,bus:AudioNode,pan=0,fm=0){
  if(at<0||at>=SECONDS)return;dur=Math.min(dur,SECONDS-at-.001);if(dur<=.005)return;
  const o=ctx.createOscillator(),g=ctx.createGain(),p=ctx.createStereoPanner();
  o.type=type;o.frequency.setValueAtTime(Math.max(20,freq),at);o.frequency.exponentialRampToValueAtTime(Math.max(20,end),at+dur);
  g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(amp,at+Math.min(.015,dur*.15));g.gain.exponentialRampToValueAtTime(.0001,at+dur);
  p.pan.value=pan;o.connect(g);g.connect(p);p.connect(bus);
  if(fm){const mod=ctx.createOscillator(),mg=ctx.createGain();mod.frequency.value=28+freq*.012;mg.gain.value=fm;mod.connect(mg);mg.connect(o.frequency);mod.start(at);mod.stop(at+dur);}
  o.start(at);o.stop(at+dur);
 }
 function hiss(at:number,dur:number,amp:number,from:number,to:number,pan=0){
  const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain(),p=ctx.createStereoPanner();
  source.buffer=noise;source.loop=true;filter.type='bandpass';filter.Q.value=2;filter.frequency.setValueAtTime(from,at);filter.frequency.exponentialRampToValueAtTime(to,at+dur);
  gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(amp,at+dur*.35);gain.gain.exponentialRampToValueAtTime(.0001,at+dur);
  p.pan.value=pan;source.connect(filter);filter.connect(gain);gain.connect(p);p.connect(fxBus);source.start(at);source.stop(at+dur);
 }
 function boing(at:number,pitch=260,amp=.32){tone(at,.42,pitch,pitch*.3,amp,'triangle',fxBus,0,40);tone(at,.22,pitch*2,pitch,.05,'sine',fxBus);}
 function magic(at:number){[0,4,7,12,16,19,24].forEach((n,i)=>tone(at+i*.065,.55,440*2**(n/12),460*2**(n/12),.18,'sine',fxBus,(i-3)*.18,3));hiss(at,.7,.23,1600,8000);}
 // Syllable chirps are scheduled INSIDE their caption-word intervals, with the same timing data.
 dialogue.forEach((line,li)=>wordsFor(line).forEach((word,wi)=>{
  const len=word.end-word.start,blue=line.speaker==='bobo';const count=Math.max(2,Math.ceil(len*7));
  for(let j=0;j<count;j++){
   const at=word.start+j*len*.85/count;const dur=Math.min(len*.85/count*.94,.18);
   const base=(blue?650:168)*2**(((li*3+wi*5+j*4)%11-4)/12);const emphasis=word.text===line.accent?1.17:1;
   tone(at,dur,base*emphasis,base*(blue?(j%2?1.5:.75):.63),blue?.27:.3,blue?'sine':'triangle',voiceBus,blue?-.13:.13,blue?100:39);
   tone(at,dur*.8,base*(blue?2.7:1.9),base*(blue?1.9:1.3),blue?.055:.065,'square',voiceBus,blue?-.13:.13);
  }
 }));
 if(!voicesOnly){
  // Original pizzicato ostinato: swung sixteenths over a minor-six comedy progression.
  const roots=[146.83,130.81,174.61,110];const beat=.625;
  for(let i=0;i<SECONDS/beat;i++){
   const at=i*beat;const duck=dialogue.some(d=>at>=d.start-.15&&at<d.end+.12)?.42:1;
   const drama=at>=30&&at<42?.4:1;const root=roots[Math.floor(i/8)%4];
   tone(at,.3,root,root*.99,.25*duck*drama,'triangle',musicBus,-.25);
   const notes=[0,7,12,15,19,12,7,10];const note=root*2**(notes[i%8]/12)*2;
   tone(at+.32,.16,note,note*.99,.15*duck*drama,'sine',musicBus,.3,2);
   if(i%4===2)tone(at+.015,.06,1100,800,.035*duck,'triangle',musicBus,.5);
  }
  [0.2,.52,.87,1.2,8,8.32,8.65,8.98,18.4,18.9,19.4,19.9,20.4,21,21.6,22.0,26.3,26.7,27.1,42.8,43.1,43.4,44,44.3,47.2,47.5,47.8,50.3,50.6,51].forEach((at,i)=>{tone(at,.11,150+i%3*35,60,.21,'triangle',fxBus,i%2?-.3:.3);tone(at,.05,900,400,.04,'sine',fxBus);});
  [4.5,10.8,14.2,18,23.7,28,33.7,45.5,48.5,56.3,61.8,69.4].forEach(at=>hiss(at-.09,.23,.1,350,4800,at%2?-.4:.4));
  [2,7.3,14.2,24,43,48.5,59.2].forEach(at=>boing(at,at===48.5?180:350,.19));
  // The button: a sharp switch, tiny bell, followed by a deliberately outsized consequence.
  [29,54.65].forEach(at=>{tone(at,.045,1700,250,.38,'square',fxBus);tone(at+.04,.17,960,920,.11,'sine',fxBus);});
  tone(30,.85,95,30,.7,'sine',fxBus);hiss(30,.85,.55,1300,80);
  for(let i=0;i<24;i++){const at=30+i*.49;tone(at,.34,38+i%4*9,30,.18,'triangle',fxBus,i%2?-.6:.6);}
  // Portal: detuned FM drones, rising chirps and stereo air, resolving into a suction plop.
  [36,54.5].forEach((at,index)=>{
   const dur=index?1.7:5.2;[92,97,184,279].forEach((hz,i)=>tone(at,dur,hz,hz*3,.1,'sawtooth',fxBus,(i-1.5)*.4,25));
   hiss(at,dur,.28,150,6500,-.3);hiss(at+.1,dur-.1,.21,6500,200,.3);
   for(let i=0;i<(index?8:19);i++)tone(at+i*.22,.18,350+i*47,900+i*53,.09,'sine',fxBus,Math.sin(i)*.7,30);
  });
  tone(41.1,.32,500,35,.45,'sine',fxBus);hiss(41.15,.3,.22,2500,80);
  magic(55.25);boing(55.8,280,.32);
  tone(62.1,.18,110,85,.2,'triangle',fxBus);
  [69.95,70.3,70.7,71.1].forEach(at=>{boing(at,140,.22);hiss(at,.14,.14,3000,600);});
  // Freeze-frame sting, fully original and resolving to a comedy chord.
  [261.63,329.63,392,523.25].forEach((hz,i)=>tone(72.4+i*.04,1.25,hz,hz*.99,.21,'triangle',fxBus,(i-1.5)*.25));
  tone(72.4,.21,95,45,.5,'sine',fxBus);hiss(72.4,.3,.2,2500,180);
  cuts.forEach(c=>{if(c.at>0&&c.at<30)tone(c.at,.045,1450,1100,.015,'sine',fxBus);});
 }
 const buffer=await ctx.startRendering();
 return buffer;
}
function wav(buffer:AudioBuffer,normalise:boolean) {
 const left=buffer.getChannelData(0),right=buffer.getChannelData(1);let peak=0;
 for(let i=0;i<left.length;i++)peak=Math.max(peak,Math.abs(left[i]),Math.abs(right[i]));
 const gain=normalise?.88/Math.max(.001,peak):1;
 const bytes=new ArrayBuffer(44+left.length*4),v=new DataView(bytes);const str=(at:number,s:string)=>{for(let i=0;i<s.length;i++)v.setUint8(at+i,s.charCodeAt(i));};
 str(0,'RIFF');v.setUint32(4,bytes.byteLength-8,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,2,true);v.setUint32(24,SR,true);v.setUint32(28,SR*4,true);v.setUint16(32,4,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,left.length*4,true);
 let sum=0;for(let i=0;i<left.length;i++){const mute=normalise&&silence.some(([a,b])=>i/SR>=a&&i/SR<b);for(let ch=0;ch<2;ch++){const sample=mute?0:(ch?right[i]:left[i])*gain;sum+=sample*sample;v.setInt16(44+i*4+ch*2,Math.round(Math.max(-1,Math.min(1,sample))*32767),true);}}
 const u8=new Uint8Array(bytes);let encoded='';for(let i=0;i<u8.length;i+=32768)encoded+=String.fromCharCode(...u8.subarray(i,i+32768));
 return {base64:btoa(encoded),peak:peak*gain,rms:Math.sqrt(sum/(left.length*2))};
}
export async function generateSoundtrack(){
 const master=await renderTrack(false);const voices=await renderTrack(true);
 const voiceData=voices.getChannelData(0);
 const timing=dialogue.map(line=>({speaker:line.speaker,text:line.text,start:line.start,end:line.end,words:wordsFor(line).map(word=>{
  let energy=0;const a=Math.floor((word.start+.015)*SR),b=Math.floor((word.start+(word.end-word.start)*.75)*SR);
  for(let i=a;i<b;i++)energy+=voiceData[i]*voiceData[i];
  return {...word,rms:Math.sqrt(energy/Math.max(1,b-a))};
 })}));
 const mix=wav(master,true),voice=wav(voices,false);
 return {master:mix.base64,voices:voice.base64,report:{sampleRate:SR,duration:SECONDS,channels:2,peak:mix.peak,rms:mix.rms,silence,dialogue:timing,method:'Web Audio OfflineAudioContext; original oscillator/FM voices, synthesized score and effects'}};
}
