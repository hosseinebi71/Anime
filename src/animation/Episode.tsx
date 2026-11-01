import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Character, type Expression, type Pose} from './Character';
import {Laboratory, MysteryButton, Portal} from '../backgrounds/Laboratory';
import {Subtitles} from '../subtitles/Subtitles';
import {cuts, speechAt} from '../story/mysteryButton';
import {between, ramp, track, recoil} from './motion';
export {FPS,DURATION,scenes} from '../story/mysteryButton';

/** Shot-based director: continuous character acting within cuts, all driven by the same clock. */
export const Episode:React.FC<{showCaptions?:boolean;audioEnabled?:boolean}>=({showCaptions=true,audioEnabled=true})=>{
 const frame=useCurrentFrame();const actual=frame/30;const t=Math.min(actual,72.4);const f=Math.round(t*30);
 const cutIndex=cuts.findLastIndex(c=>t>=c.at);const cut=cuts[Math.max(0,cutIndex)];
 const local=t-cut.at;const push=1+Math.min(local,5)*.007;
 const shake=between(t,30,42)?(t<36?5:10):0;
 const dx=Math.sin(f*2.3)*shake,dy=Math.cos(f*1.7)*shake*.7;
 const zoom=cut.z*push;
 const boboSpeech=speechAt(t,'bobo'),maxSpeech=speechAt(t,'max');
 let bx=track(t,[[0,-400],[1.5,35],[18,35],[21,105],[28,105],[30,55],[42,55],[44.5,250],[46.5,440],[48.3,70],[50,70],[52,110],[54.3,110],[55.2,35],[65,35],[68.8,105],[70,20]]);
 let by=980;let bs=1.25;let bl=0;let bp:Pose='idle';let be:Expression='curious';
 let mx=track(t,[[0,1100],[8,1100],[9.2,595],[18,595],[22,545],[24,595],[27,530],[30,595]]);
 let my=980;let ms=1.25;let ml=0;let mp:Pose='idle';let me:Expression='annoyed';
 const bWalk=between(t,0,1.5)||between(t,18,21)||between(t,42.7,44.5)||between(t,47,48.3)||between(t,50,52);
 if(between(t,2,7.8)){bp='point';bl=track(t,[[2,0],[4.2,-7],[5.2,7],[7.7,4]]);be=between(t,5.2,7.2)?'happy':'curious';}
 if(between(t,8,18)){mp='warn';ml=-7;be=between(t,14.2,16.7)?'smug':'curious';bp=between(t,14.2,16.7)?'shrug':'idle';}
 if(between(t,18,30)){bp=between(t,24,25.9)?'shrug':t>=28.9?'reach':'point';bl=track(t,[[18,-5],[21,8],[23,1],[26,12],[28.5,-6],[29,14],[29.8,5]]);be='smug';mp=t>25?'reach':'warn';ml=t>25?-14:-7;}
 if(between(t,30,42)){be=t<33?'smug':'shocked';bp=t<33?'shrug':'brace';bl=recoil(t,30,16);me='shocked';mp=t<36?'panic':'brace';ml=Math.sin(t*16)*5;}
 const suction=ramp(t,38.6,41.2);
 if(suction>0&&t<55){mx=595+suction*100;my=980-suction*130;ms=1.25*(1-suction);ml+=suction*630;}
 if(between(t,42,55)){be='worried';bp=t<45?'panic':t<48.4?'point':t<51.7?'shrug':'reach';bl=t>45.5&&t<47.7?38:t>51.7?10:Math.sin(t*3)*4;if(between(t,45.5,47.8))by+=70;}
 const banana=t>=55.25;
 if(banana){const enter=ramp(t,55.25,55.85);mx=595;my=980-(1-enter)*220;ms=1.25*enter;ml=recoil(t,55.8,18);me=t>=69.4?'furious':'annoyed';mp=t>=69.4?'panic':t>=61.8&&t<64.4?'warn':'idle';be=t<59.2?'shocked':t<61.8?'happy':t<65?'curious':'smug';bp=t<56?'panic':t>=66.1&&t<69?'point':'idle';bl=t>66?7:recoil(t,55.3,10);}
 if(t>=70){be='shocked';bp='brace';bl=-10;my-=Math.max(0,Math.sin((t-70)*7))*35;}
 const portalAmount= t<42?ramp(t,35.9,37.2)*(1-ramp(t,41.1,42)):between(t,54.4,57)?ramp(t,54.4,55.2)*(1-ramp(t,56,57)):0;
 const pressed=between(t,29,54.3)||t>=54.65;
 const flash=(1-ramp(t,29.96,30.3))*(t>=29.96?1:0)+(between(t,55.25,55.55)?1-ramp(t,55.25,55.55):0);
 const squish=recoil(t,29, .11)+recoil(t,55.3,.17);
 const bLook:[number,number]=t>=42&&t<55?[Math.sin(t*4)*13,Math.cos(t*3)*8]:t<8?[13,9]:[13,t>=55?9:0];
 const maxLook:[number,number]=t<30?[-12,2]:t<42?[t<36?-10:8,-9]:[-12,4];
 return <AbsoluteFill style={{background:'#142438',fontFamily:'Arial, sans-serif',overflow:'hidden'}}>
  {audioEnabled&&<Audio src={staticFile('audio/mystery-button.wav')}/>}
  <div style={{position:'absolute',inset:0,transform:`translate(${540+dx}px,${890+dy}px) scale(${zoom}) translate(${-cut.x}px,${-cut.y}px)`,transformOrigin:'0 0'}}>
   <Laboratory time={t} unstable={between(t,30,42)}/>
   {portalAmount>0&&<Portal time={t} amount={portalAmount}/>}
   <div style={{position:'absolute',left:bx+90,top:1403,width:270,height:34,borderRadius:'50%',background:'#03111c',opacity:.5,transform:`scale(${bs/1.25})`}}/>
   {(t<41.2||banana)&&<div style={{position:'absolute',left:mx+70,top:1405,width:270,height:35,borderRadius:'50%',background:'#03111c',opacity:.45,transform:`scale(${ms/1.25})`}}/>}
   <MysteryButton time={t} pressed={pressed}/>
   <div style={{position:'absolute',left:bx,top:by}}><Character name="bobo" frame={f} scale={bs} walking={bWalk} pose={bp} expression={be} speech={boboSpeech} lean={bl} look={bLook} squash={squish}/></div>
   {(t<41.2||banana)&&<div style={{position:'absolute',left:mx,top:my,transform:`rotate(${ml}deg)`,transformOrigin:'50% 50%',opacity:ms>0?1:0}}><Character name="max" frame={f+43} scale={ms} walking={between(t,8,9.2)||between(t,21,22)} pose={mp} expression={me} speech={maxSpeech} banana={banana} look={maxLook} squash={recoil(t,55.8,.13)}/></div>}
   {between(t,36.4,41.6)&&Array.from({length:12},(_,i)=>{const p=((t*1.3+i*.12)%1);return <div key={i} style={{position:'absolute',left:120+p*660,top:1080+Math.sin(i*3+p*3)*170,width:35+p*80,height:5,background:'#acdeec',opacity:p*.5,transform:`rotate(${(i-6)*4}deg)`}}/>;})}
   {banana&&t<57.5&&Array.from({length:14},(_,i)=>{const a=i*2.4;const r=(t-55.25)*180;return <div key={i} style={{position:'absolute',left:800+Math.cos(a)*r,top:1140+Math.sin(a)*r,fontSize:40,color:i%2?'#ffe679':'#b7f6ed',opacity:1-ramp(t,56,57.5),transform:`rotate(${i*30+t*90}deg)`}}>✦</div>;})}
   {t>=69.4&&[0,1,2].map(i=><svg key={i} width="160" height="130" style={{position:'absolute',left:650+i*90,top:875-i%2*45,transform:`rotate(${i*35+Math.sin(t*19)*9}deg)`}}><path d="M20 65L66 60L49 22L95 48L112 5L117 55L157 45" stroke="#ff7973" strokeWidth="10" fill="none"/></svg>)}
  </div>
  <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 48%, transparent 30%, #06112070 100%)',pointerEvents:'none'}}/>
  {between(t,30,42)&&<div style={{position:'absolute',inset:0,background:'#e62553',opacity:Math.max(0,Math.sin(t*15))*.1,pointerEvents:'none'}}/>}
  {flash>0&&<AbsoluteFill style={{background:'#effaff',opacity:Math.min(1,flash)}}/>}
  <div style={{position:'absolute',top:95,left:80,right:115,display:'flex',justifyContent:'space-between',alignItems:'center',color:'#e4eee9'}}>
   <div style={{fontWeight:950,fontSize:37,letterSpacing:-2}}>bobo <span style={{color:'#90a2b1',fontWeight:400}}>&</span> max<span style={{color:'#fcba65'}}>.</span></div>
   <div style={{fontSize:19,letterSpacing:4,color:'#b4c5ca'}}>001 / THE MYSTERY BUTTON</div>
  </div>
  {actual<1.6&&<div style={{position:'absolute',top:380,left:100,right:130,transform:`translateY(${(1-ramp(t,0,.35))*-35}px) rotate(-4deg)`,opacity:1-ramp(t,1.2,1.6)}}><div style={{fontSize:25,letterSpacing:9,color:'#ffbb75',fontWeight:900}}>A BOBO & MAX MISADVENTURE</div><div style={{fontSize:116,letterSpacing:-6,lineHeight:.95,color:'#f2f2d9',fontWeight:950,textShadow:'8px 8px 0 #101d30',marginTop:24}}>THE MYSTERY<br/><span style={{color:'#ff6e78'}}>BUTTON.</span></div><div style={{fontSize:30,color:'#abc9cf',marginTop:30}}>What could possibly go wrong?</div></div>}
  {between(t,29.05,29.75)&&<div style={{position:'absolute',top:530,right:150,transform:'rotate(10deg)',fontSize:100,fontWeight:950,fontStyle:'italic',color:'#ffdf86',textShadow:'7px 7px 0 #50283b'}}>click.</div>}
  {between(t,41.3,42.8)&&<div style={{position:'absolute',top:550,left:170,right:170,textAlign:'center',fontSize:50,color:'#a9c7cc',letterSpacing:15}}>…uh-oh.</div>}
  {between(t,55.6,56.45)&&<div style={{position:'absolute',top:490,left:130,transform:'rotate(-9deg)',fontSize:82,fontWeight:950,color:'#ffe473',textShadow:'6px 6px 0 #553e27'}}>SAME MAX.<br/>NEW PEEL.</div>}
  {showCaptions&&<Subtitles time={t}/>}
  {actual>=72.4&&<AbsoluteFill style={{background:'#eebc3515',border:'22px solid #f5ce70',pointerEvents:'none'}}>
   <div style={{position:'absolute',top:340,left:65,right:100,transform:`rotate(-7deg) scale(${.8+ramp(actual,72.4,72.65)*.2})`,textAlign:'center',fontWeight:950,color:'#ffdb74',textShadow:'7px 7px 0 #18243b'}}><div style={{fontSize:98,letterSpacing:-5,lineHeight:.96}}>FRIENDSHIP:<br/>COMPLICATED.</div><div style={{fontSize:27,letterSpacing:5,marginTop:24,color:'#ecf2df'}}>TO BE CONTINUED. UNFORTUNATELY.</div></div>
   <div style={{position:'absolute',bottom:290,left:100,right:140,textAlign:'center',fontSize:32,fontWeight:800,color:'#fff0b3'}}>EPISODE 002? THIS IS GOING TO GET WEIRD.</div>
  </AbsoluteFill>}
 </AbsoluteFill>;
};
