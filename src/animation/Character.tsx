import React, {useId} from 'react';
export type CharacterName='bobo'|'max';
export type Expression='happy'|'curious'|'annoyed'|'talking'|'shocked'|'worried'|'furious'|'smug';
export type Pose='idle'|'point'|'warn'|'reach'|'panic'|'brace'|'shrug';
export interface CharacterProps {
 name:CharacterName;frame:number;expression?:Expression;walking?:boolean;waving?:boolean;jumping?:boolean;
 scale?:number;pose?:Pose;look?:[number,number];speech?:number;banana?:boolean;lean?:number;squash?:number;
}
/** Vector puppet: independent eye, brow, mouth, flexible-limb and body deformation controls. */
export const Character:React.FC<CharacterProps>=({name,frame,expression='happy',walking=false,waving=false,jumping=false,scale=1,pose='idle',look=[0,0],speech=0,banana=false,lean=0,squash=0})=>{
 const uid=useId().replace(/:/g,''); const id=`${name}${uid}`;const blue=name==='bobo';
 const edge=blue?'#0a3b62':'#643222';const skin=blue?'#30c1f4':'#ff9c48';
 const stride=walking?Math.sin(frame*.31):0;
 const breath=Math.sin(frame*.045)*.005;
 const blink=(frame+(blue?0:37))%157;const eyes=blink<5?.12:1;
 const fierce=expression==='furious';const annoyed=expression==='annoyed'||fierce;
 const surprised=expression==='shocked'||expression==='worried';
 const deform=squash+(walking?Math.abs(stride)*.035:0)+(speech*.024);
 const sx=1+deform+breath; const sy=1-deform*.7-breath;
 const jitter=pose==='panic'?Math.sin(frame*1.4)*6:0;
 const bob=walking?-Math.abs(stride)*10:0;
 let lh:[number,number]=[29,234],rh:[number,number]=[291,234];
 if(pose==='point'||pose==='reach')rh=[321,pose==='reach'?145:125];
 if(pose==='warn'){lh=[-3,122];rh=[319,120];}
 if(pose==='panic'){lh=[18+jitter,72];rh=[299-jitter,66];}
 if(pose==='brace'){lh=[52,265];rh=[268,267];}
 if(pose==='shrug'){lh=[11,168];rh=[307,164];}
 if(waving)rh=[297+Math.sin(frame*.35)*17,76+Math.cos(frame*.35)*14];
 if(jumping){lh=[8,83];rh=[312,76];}
 if(walking){lh=[26,226+stride*24];rh=[294,226-stride*24];}
 const mitt=(x:number,y:number)=> <g transform={`translate(${x} ${y})`}><path d="M-13 7 Q-24 -1 -16 -10 Q-10 -13 -5 -4 L-7 -18 Q-5 -26 2 -23 L10 -16 Q25 -14 23 1 Q22 18 6 21 Q-7 20 -13 7Z" fill={skin} stroke={edge} strokeWidth="5"/><path d="M8 -12L10 -3M16 -8L16 0" fill="none" stroke={edge} strokeWidth="2.5" opacity=".6"/></g>;
 return <svg viewBox="-25 0 370 380" width={370*scale} height={380*scale} style={{overflow:'visible'}} role="img" aria-label={`${banana?'banana ':''}${name}, ${expression}`}>
 <defs>
  <linearGradient id={id} x1=".15" y1="0" x2=".85" y2="1"><stop stopColor={blue?'#8ce8ff':'#ffd48b'}/><stop offset=".5" stopColor={skin}/><stop offset="1" stopColor={blue?'#178bd0':'#ee702e'}/></linearGradient>
  <linearGradient id={`${id}peel`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#fff28b"/><stop offset=".5" stopColor="#ffce37"/><stop offset="1" stopColor="#e4961c"/></linearGradient>
 </defs>
 <g stroke={edge} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" transform={`translate(0 ${bob}) rotate(${lean+jitter*.3} 160 306)`}>
  {[0,1].map(i=>{const x=i?207:114;const swing=stride*(i?-1:1)*27;return <g key={i} transform={`rotate(${swing} ${x} 267)`}><path d={`M${x} 264 Q${x+(i?13:-13)} 289 ${x+(i?5:-5)} 319`} fill="none" strokeWidth="11"/><path d={i?'M201 318Q220 309 239 320Q251 333 228 339L199 337Q192 332 201 318Z':'M120 318Q100 309 81 320Q69 333 92 339L122 337Q129 332 120 318Z'} fill={skin}/><path d={i?'M201 331L238 331':'M83 331L120 331'} stroke="#ffffff" strokeWidth="3" opacity=".55"/></g>})}
  <path d={`M${banana?75:70} ${banana?211:178} Q${lh[0]-10} ${lh[1]-35} ${lh[0]} ${lh[1]}`} fill="none" strokeWidth="12"/>
  <path d={`M${banana?190:250} ${banana?223:178} Q${rh[0]+19} ${rh[1]+22} ${rh[0]} ${rh[1]}`} fill="none" strokeWidth="12"/>
  <g transform={`translate(160 277) scale(${sx} ${sy}) translate(-160 -277)`}>
   {banana?<g><path d="M109 54Q20 158 75 251Q161 335 292 227Q217 263 167 175Q140 116 135 49Z" fill={`url(#${id}peel)`} stroke="#785027"/><path d="M119 62Q103 184 167 237Q203 268 248 253" fill="none" stroke="#e9ad26" strokeWidth="5"/><path d="M109 54L105 32L134 27L140 49Z" fill="#867047" stroke="#59432b"/><path d="M258 243L273 241L277 252L266 259Z" fill="#7d5b35" stroke="#59432b"/><path d="M124 92Q117 151 139 187" stroke="#fff4a4" strokeWidth="8" fill="none"/><path d="M142 219L146 219M160 237L163 238M187 248L190 249" stroke="#b88325" strokeWidth="4"/></g>:blue?<path d="M55 167C53 101 88 55 151 52C214 47 265 87 269 153C279 220 236 274 169 278C99 285 53 237 55 167Z" fill={`url(#${id})`}/>:<path d="M86 55Q56 57 55 92L51 226Q52 271 91 274L230 274Q271 271 269 231L264 92Q263 54 229 54Z" fill={`url(#${id})`}/>}
   {!banana&&<><path d={blue?'M77 128Q88 80 137 76':'M77 119L78 92Q79 77 102 77L124 77'} fill="none" stroke={blue?'#c5f5ff':'#ffe6b4'} strokeWidth="9" opacity=".9"/><path d={blue?'M89 238Q159 289 228 235':'M78 246Q150 263 242 245'} fill="none" stroke={blue?'#126ea9':'#ce5926'} strokeWidth="8" opacity=".4"/></>}
   <g transform={banana?'translate(0 66) scale(.76)':'translate(0 0)'}>
    {[112,202].map((x,i)=><g key={x} transform={`translate(${x} 155) rotate(${annoyed?(i?-7:7):surprised?(i?8:-8):0})`}>
     <g transform={`scale(1 ${eyes*(annoyed?.83:surprised?1.12:1)})`}>
      <ellipse rx={blue?37:34} ry={blue?44:39} fill="#fffcef" strokeWidth="5"/>
      <ellipse cx={Math.max(-13,Math.min(13,look[0]))} cy={Math.max(-13,Math.min(13,look[1]))} rx={surprised?11:16} ry={surprised?19:24} fill={edge} stroke="none"/>
      <ellipse cx={look[0]-5} cy={look[1]-8} rx="6" ry="8" fill="white" stroke="none"/>
      <circle cx={look[0]+6} cy={look[1]+11} r="3" fill="white" stroke="none"/>
      {annoyed&&<path d={i?'M-36 -30L36 -40L36 -15L-36 -2Z':'M-36 -40L36 -30L36 -2L-36 -15Z'} fill={banana?'#ffd645':skin} strokeWidth="4"/>}
     </g>
     <path d={fierce?(i?'M-32 -37L30 -59':'M-30 -59L32 -37'):annoyed?(i?'M-32 -39L28 -52':'M-28 -52L32 -39'):surprised?'M-25 -59Q0 -80 25 -59':expression==='curious'?(i?'M-24 -48Q0 -69 23 -57':'M-24 -53Q0 -58 25 -43'):'M-24 -53Q0 -63 24 -54'} fill="none" strokeWidth={blue?7:11}/>
    </g>)}
    <ellipse cx="82" cy="209" rx="17" ry="9" fill={blue?'#188acb':'#e76c3f'} stroke="none" opacity=".6"/><ellipse cx="237" cy="209" rx="17" ry="9" fill={blue?'#188acb':'#e76c3f'} stroke="none" opacity=".6"/>
    {speech>.05||expression==='talking'?<g><ellipse cx="158" cy="222" rx={16+speech*13} ry={8+speech*24} fill="#28263b" strokeWidth="4"/><ellipse cx="159" cy={229+speech*12} rx="13" ry="6" fill="#f8819d" stroke="none"/></g>:surprised?<ellipse cx="158" cy="226" rx={expression==='worried'?16:24} ry={expression==='worried'?21:29} fill="#28263b" strokeWidth="4"/>:fierce?<g><path d="M125 222Q157 210 191 221L185 244L130 242Z" fill="#fffbed" strokeWidth="5"/><path d="M144 219L145 240M167 218L166 242M128 231L188 232" strokeWidth="2"/></g>:annoyed?<path d="M132 233Q158 218 185 235" fill="none" strokeWidth="7"/>:expression==='smug'?<path d="M136 227Q168 252 195 215" fill="none" strokeWidth="6"/>:<g><path d="M128 217Q160 235 192 216Q180 255 151 246Q133 241 128 217Z" fill="#28263b" strokeWidth="4"/><path d="M139 238Q159 227 179 239Q159 253 139 238" fill="#f8819d" stroke="none"/></g>}
   </g>
   {blue&&!banana&&<path d="M146 52Q126 38 135 31Q148 24 155 49Q164 31 176 36Q185 46 163 53" fill={skin} strokeWidth="5"/>}
  </g>
  {mitt(...lh)}{mitt(...rh)}
  {(pose==='panic'||expression==='worried')&&<path d={`M280 ${91+Math.sin(frame*.15)*4}Q298 117 285 124Q270 123 280 ${91+Math.sin(frame*.15)*4}`} fill="#b7f6ff" stroke="#277ca2" strokeWidth="3"/>}
  {fierce&&<path d="M256 54L256 71M246 63L265 63M273 78L273 94M264 85L283 85" stroke="#f85558" strokeWidth="6"/>}
 </g></svg>;
};
