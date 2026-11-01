import React from 'react';
import {spring} from 'remotion';
import {activeLine, wordsFor, FPS} from '../story/mysteryButton';
export const Subtitles:React.FC<{time:number}>=({time})=>{
 const line=activeLine(time); if(!line)return null;
 const color=line.speaker==='bobo'?'#77e0ff':'#ffbd6a';
 return <div data-testid="subtitles" data-speaker={line.speaker} style={{position:'absolute',left:95,right:145,bottom:270,textAlign:'center',fontFamily:'Arial, sans-serif',zIndex:20}}>
  <div style={{fontSize:23,letterSpacing:6,fontWeight:900,color,marginBottom:18,textShadow:'0 3px 5px #000'}}>{line.speaker.toUpperCase()}</div>
  <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:'12px 17px'}}>{wordsFor(line).map((w,i)=>{
   const active=time>=w.start&&time<w.end;const spoken=time>=w.start;const pop=spring({frame:Math.max(0,(time-w.start)*FPS),fps:FPS,config:{damping:12,stiffness:230,mass:.65}});
   return <span key={i} data-word={w.text} data-active={active} style={{display:'inline-block',fontSize:68,lineHeight:1.14,fontWeight:950,letterSpacing:-2,color:active||w.text===line.accent&&spoken?color:spoken?'#fffcec':'#b3b9c1',transform:`translateY(${spoken?(1-pop)*20:6}px) scale(${active?.9+pop*.18:1}) rotate(${active?(i%2?2:-2):0}deg)`,WebkitTextStroke:'2px #122036',paintOrder:'stroke fill',textShadow:'0 5px 0 #102034, 0 8px 18px #0009',opacity:spoken?1:.68}}>{w.text}{' '}</span>;
  })}</div>
 </div>;
};
