import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Character} from './Character';

export const FPS = 30;
export const DURATION = 450;
export const scenes = [
  {start: 0, end: 90, title: 'An entrance', description: 'Bobo walks into the room.', color: '#74CEF2'},
  {start: 90, end: 180, title: 'The neighbor', description: 'Max arrives from the other side.', color: '#FFB866'},
  {start: 180, end: 270, title: 'A little hello', description: 'Bobo gives Max a very enthusiastic wave.', color: '#A5C0FF'},
  {start: 270, end: 360, title: 'Not impressed', description: 'Max is having one of those days.', color: '#E5A7A0'},
  {start: 360, end: 450, title: 'Unbothered', description: 'Bobo finds a reason to jump for joy.', color: '#C8DE85'},
];
const clamped = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Room: React.FC = () => <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute'}}>
  <defs><linearGradient id="wall" x2="0" y2="1"><stop stopColor="#F9EEDC"/><stop offset="1" stopColor="#EEE1C9"/></linearGradient><linearGradient id="floor" x2="0" y2="1"><stop stopColor="#D7BBA0"/><stop offset="1" stopColor="#E7CFB6"/></linearGradient></defs>
  <path fill="url(#wall)" d="M0 0H1080V1330H0z"/>
  <path fill="url(#floor)" d="M0 1330H1080V1920H0z"/>
  <path d="M0 1315H1080" stroke="#C9AE91" strokeWidth="18"/>
  <path d="M0 1330H1080" stroke="#FFF2DD" strokeWidth="6"/>
  <g stroke="#C6AA8D" strokeWidth="3" opacity=".4"><path d="M220 1330L-130 1920M520 1330L500 1920M820 1330L1180 1920M0 1510H1080M0 1770H1080"/></g>
  <rect x="730" y="420" width="260" height="400" rx="130" fill="#D8C8AD"/>
  <rect x="746" y="435" width="228" height="366" rx="114" fill="#B7DAD9"/>
  <circle cx="904" cy="524" r="40" fill="#FFF5CB"/>
  <path d="M746 690 Q810 590 866 670 Q922 620 974 675V801H746Z" fill="#92B7A1"/>
  <path d="M860 438V802M746 626H974" stroke="#FDF2DC" strokeWidth="13"/>
  <rect x="88" y="538" width="230" height="280" rx="9" fill="#C8A886"/>
  <rect x="101" y="550" width="204" height="254" rx="3" fill="#FFFAE9"/>
  <circle cx="204" cy="655" r="55" fill="#F0B96E"/>
  <path d="M125 766L182 682L220 734L254 701L290 766Z" fill="#9CAB84"/>
  <path d="M76 1249H200L182 1367H94Z" fill="#BC7C5E"/>
  <g fill="#789276"><ellipse cx="128" cy="1160" rx="27" ry="103" transform="rotate(-30 128 1160)"/><ellipse cx="164" cy="1153" rx="25" ry="108" transform="rotate(20 164 1153)"/><ellipse cx="105" cy="1205" rx="24" ry="62" transform="rotate(-52 105 1205)"/></g>
  <ellipse cx="555" cy="1457" rx="410" ry="104" fill="#C0A988" opacity=".38"/>
  <ellipse cx="555" cy="1435" rx="410" ry="104" fill="#D2D2AF"/><ellipse cx="555" cy="1435" rx="377" ry="83" fill="none" stroke="#E6E3C6" strokeWidth="5"/>
</svg>;

export const HelloNeighbor: React.FC<{showCaptions?: boolean}> = ({showCaptions = true}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const boboX = interpolate(f, [0, 75], [-400, 170], clamped);
  const maxX = interpolate(f, [90, 165], [1110, 590], clamped);
  const jumpFrame = f - 366;
  const jump = jumpFrame >= 0 && jumpFrame < 38 ? Math.sin(jumpFrame / 38 * Math.PI) * 205 : 0;
  const settle = f >= 404 ? Math.sin((f - 404) * .45) * Math.exp(-(f - 404) / 9) * 9 : 0;
  const wave = f >= 180 && f < 270;
  const annoyance = f >= 270;
  const bubble = f >= 195 && f < 265;
  const pop = spring({frame: f - 195, fps, config:{damping:14, stiffness:170}});
  const endOpacity = interpolate(f,[415,432],[0,1],clamped);
  return <AbsoluteFill style={{background:'#F7ECD9', fontFamily:'Arial, sans-serif', overflow:'hidden'}}>
    <Room/>
    <div style={{position:'absolute',top:145,left:0,right:0,textAlign:'center',color:'#71634F',fontSize:24,letterSpacing:8,fontWeight:700}}>LITTLE MOMENTS. BIG FEELINGS.</div>
    <div style={{position:'absolute',top:205,left:0,right:0,textAlign:'center',color:'#354337',fontSize:90,fontWeight:900,letterSpacing:-5}}>bobo <span style={{fontWeight:400,color:'#A69D82'}}>&</span> max<span style={{color:'#EFA35C'}}>.</span></div>
    <div style={{position:'absolute',top:325,left:0,right:0,textAlign:'center',fontSize:25,color:'#96856C'}}>01 / HELLO, NEIGHBOR</div>
    <div style={{position:'absolute',left:boboX+25,top:1410,width:260,height:35,borderRadius:'50%',background:'#6E7863',opacity:.18,transform:`scale(${1-jump/700})`}}/>
    <div style={{position:'absolute',left:maxX+25,top:1410,width:260,height:35,borderRadius:'50%',background:'#6E7863',opacity:.18}}/>
    <div style={{position:'absolute',left:boboX,top:1090-jump+settle,transform:`rotate(${jump ? -7 : 0}deg)`,transformOrigin:'50% 90%'}}>
      <Character name="bobo" frame={f} walking={f<75} waving={wave} jumping={jump>20} expression={f<180?'curious':'happy'}/>
    </div>
    <div style={{position:'absolute',left:maxX,top:1090}}><Character name="max" frame={f+43} walking={f>=90 && f<165} expression={annoyance?'annoyed':'curious'}/></div>
    {bubble && <div style={{position:'absolute',left:235,top:900,background:'#FFFEF6',borderRadius:45,padding:'28px 45px',fontSize:58,fontWeight:800,color:'#3C6E7C',transform:`scale(${pop}) rotate(-6deg)`,boxShadow:'0 8px 0 #DFD6BE'}}>Hi, Max!<div style={{position:'absolute',bottom:-20,left:65,width:35,height:35,background:'#FFFEF6',transform:'rotate(45deg)'}}/></div>}
    {f>=285 && f<350 && <div style={{position:'absolute',left:760,top:960,fontSize:80,color:'#91654D',opacity:interpolate(f,[285,295,340,350],[0,1,1,0],clamped)}}>···</div>}
    {jump>20 && [0,1,2].map(i=><div key={i} style={{position:'absolute',left:130+i*145,top:1020+(i%2)*100,fontSize:60,color:'#D4A445',transform:`rotate(${f*3+i*45}deg)`,opacity:jump/205}}>✦</div>)}
    {showCaptions && <div style={{position:'absolute',bottom:240,left:70,right:70,textAlign:'center',fontSize:43,fontWeight:700,color:'#655F4D'}}>{f<90?'A new day. A new friend.': f<180?'Well… a new neighbor.': f<270?'Some hellos are extra.':f<360?'Some mornings need coffee.':'Stay a little Bobo.'}</div>}
    <div style={{position:'absolute',bottom:145,left:0,right:0,textAlign:'center',fontSize:25,color:'#82745E',letterSpacing:4,opacity:endOpacity}}>TO BE CONTINUED ✦</div>
  </AbsoluteFill>;
};
