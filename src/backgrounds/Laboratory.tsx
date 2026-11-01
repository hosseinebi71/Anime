import React from 'react';
export const Laboratory:React.FC<{time:number;unstable?:boolean}>=({time,unstable=false})=>{
 const alarm=unstable?(Math.sin(time*21)>.5):false;
 return <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}} aria-label="The restricted curiosity laboratory">
 <defs>
  <linearGradient id="lab-wall" x2=".7" y2="1"><stop stopColor="#304c62"/><stop offset=".65" stopColor="#17283d"/><stop offset="1" stopColor="#101f32"/></linearGradient>
  <linearGradient id="lab-floor" x2="0" y2="1"><stop stopColor="#314554"/><stop offset="1" stopColor="#132133"/></linearGradient>
  <radialGradient id="lab-light"><stop stopColor={alarm?'#ff5a6c':'#8bc8c7'} stopOpacity=".3"/><stop offset="1" stopColor="#426f7a" stopOpacity="0"/></radialGradient>
 </defs>
 <path d="M0 0H1080V1920H0Z" fill="url(#lab-wall)"/>
 <g fill="none" stroke="#3d5668" strokeWidth="3" opacity=".5"><path d="M-20 400H1100M-20 810H1100M-20 1220H1100M350 0V400M800 0V400M120 400V810M610 400V810M980 400V810M350 810V1220M800 810V1220"/></g>
 <path d="M0 1400H1080V1920H0Z" fill="url(#lab-floor)"/>
 <path d="M0 1400H1080" stroke="#061525" strokeWidth="18"/><path d="M0 1388H1080" stroke="#527080" strokeWidth="4"/>
 <g stroke="#5c737c" strokeWidth="2" opacity=".25"><path d="M-300 1920L360 1400M80 1920L460 1400M540 1920V1400M1000 1920L620 1400M1400 1920L720 1400M0 1510H1080M0 1680H1080M0 1880H1080"/></g>
 <ellipse cx="540" cy="1415" rx="470" ry="100" fill="#8bb8b5" opacity=".07"/>
 <path d="M0 620H100Q145 620 145 670V920Q145 951 192 951H243" fill="none" stroke="#071b2b" strokeWidth="36"/>
 <path d="M0 616H100Q141 616 141 668V917Q141 947 192 947H243" fill="none" stroke="#537581" strokeWidth="21"/>
 <path d="M95 600V637M125 667H159M123 892H159" stroke="#82949a" strokeWidth="10"/>
 <g transform="translate(836 850)"><rect width="180" height="405" rx="22" fill="#0c1d2e" stroke="#4a6574" strokeWidth="5"/><rect x="18" y="24" width="144" height="114" rx="9" fill="#142e3f" stroke="#385b69" strokeWidth="3"/><path d={`M30 82L49 82L57 ${78+Math.sin(time*3)*25}L68 110L80 53L95 82L144 82`} fill="none" stroke="#77e3ca" strokeWidth="4"/><text x="28" y="165" fontSize="13" fill="#7f9ba2" fontFamily="monospace">REALITY ENGINE</text>{[0,1,2,3,4,5].map(i=><g key={i}><rect x="26" y={195+i*28} width="128" height="8" rx="4" fill="#233e4c"/><rect x="26" y={195+i*28} width={35+(Math.sin(time*.8+i)+1)*39} height="8" rx="4" fill={alarm?'#ff6b6e':i%2?'#8fcaad':'#e6bb6b'}/></g>)}</g>
 <g transform="translate(83 824) rotate(-5)"><rect width="211" height="133" rx="8" fill="#dfc897" stroke="#101c2c" strokeWidth="8"/><path d="M34 69L61 23L88 69Z" fill="#e4764a" stroke="#624333" strokeWidth="3"/><text x="57" y="60" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#482e29">!</text><text x="108" y="49" fontSize="16" fontWeight="900" fill="#433b34">PLEASE</text><text x="108" y="71" fontSize="16" fontWeight="900" fill="#433b34">DON'T.</text><path d="M27 96H182M27 108H155" stroke="#93836c" strokeWidth="4"/></g>
 <path d="M0 340H1080" stroke="#081725" strokeWidth="58"/><path d="M0 328H1080" stroke="#4a6471" strokeWidth="19"/>
 <g transform="translate(385 390)"><path d="M45 -50V0M265 -50V0" stroke="#0b1727" strokeWidth="10"/><path d="M0 0H310L278 58H32Z" fill="#71868c" stroke="#0b1c2b" strokeWidth="7"/><path d="M35 62H275" stroke={alarm?'#ff4c69':'#d0f3dc'} strokeWidth="12"/><path d="M42 74L-250 1390H600L268 74Z" fill="url(#lab-light)"/></g>
 <ellipse cx="540" cy="1000" rx="730" ry="950" fill="url(#lab-light)"/>
 {[0,1,2,3,4,5,6,7,8,9,10,11].map(i=><circle key={i} cx={70+(i*139)%960+Math.sin(time*.22+i)*20} cy={650+(i*173)%680-Math.sin(time*.4+i)*24} r={i%3+1} fill="#bfdad0" opacity={.07+(Math.sin(time+i)+1)*.04}/>)}
 </svg>;
};

export const MysteryButton:React.FC<{time:number;pressed:boolean}>=({time,pressed})=> <svg viewBox="0 0 250 360" width="250" height="360" style={{position:'absolute',left:415,top:1100,overflow:'visible'}} aria-label={pressed?'Pressed mystery button':'Glowing red mystery button'}>
 <defs><linearGradient id="pedestal" x2="1" y2="1"><stop stopColor="#7a919a"/><stop offset=".5" stopColor="#3b5362"/><stop offset="1" stopColor="#233749"/></linearGradient><radialGradient id="red-glow"><stop stopColor="#ff365b" stopOpacity=".6"/><stop offset="1" stopColor="#ff365b" stopOpacity="0"/></radialGradient><linearGradient id="button" x2=".3" y2="1"><stop stopColor="#ff97a1"/><stop offset=".35" stopColor="#ff4d64"/><stop offset="1" stopColor="#d71d43"/></linearGradient></defs>
 <ellipse cx="125" cy="319" rx="138" ry="24" fill="#071625" opacity=".5"/>
 <path d="M50 100L200 100L210 315L40 315Z" fill="url(#pedestal)" stroke="#101f30" strokeWidth="7"/>
 <path d="M76 118L69 290M184 119L191 290" stroke="#92a5a7" opacity=".35" strokeWidth="4"/>
 <path d="M24 282H226L236 317H14Z" fill="#1b2e40" stroke="#0e1d2e" strokeWidth="6"/>
 <rect x="71" y="164" width="108" height="52" rx="7" fill="#122a37" stroke="#8b9b95" strokeWidth="3"/>
 <text x="125" y="187" fill="#b7d7bd" fontSize="12" fontFamily="monospace" textAnchor="middle">{pressed?'UH-OH':'DO NOT'}</text><text x="125" y="205" fill="#b7d7bd" fontSize="12" fontFamily="monospace" textAnchor="middle">{pressed?'...':'PRESS'}</text>
 <path d="M19 90L45 63H205L231 90L215 129H35Z" fill="#d3bb70" stroke="#102132" strokeWidth="7"/>
 <path d="M25 94L41 118M57 85L79 122M99 85L122 122M144 85L168 122M188 85L211 120" stroke="#263646" strokeWidth="13"/>
 {!pressed&&<ellipse cx="125" cy="54" rx={110+Math.sin(time*3)*8} ry="90" fill="url(#red-glow)"/>}
 <ellipse cx="125" cy="79" rx="73" ry="28" fill="#541c37" stroke="#0e2130" strokeWidth="5"/>
 <path d={`M57 ${pressed?68:39}L57 76Q125 112 193 76L193 ${pressed?68:39}`} fill="#b81c40" stroke="#79152f" strokeWidth="4"/>
 <ellipse cx="125" cy={pressed?66:37} rx="68" ry="27" fill="url(#button)" stroke="#ff8591" strokeWidth="4"/>
 <path d={`M82 ${pressed?61:32}Q102 ${pressed?49:20} 131 ${pressed?52:23}`} fill="none" stroke="#ffc6c9" strokeWidth="7" strokeLinecap="round"/>
 </svg>;

export const Portal:React.FC<{time:number;amount:number}>=({time,amount})=><svg width="640" height="850" viewBox="0 0 640 850" style={{position:'absolute',left:460,top:690,opacity:amount,transform:`scale(${Math.max(.01,amount)})`,overflow:'visible'}} aria-label="Reality portal">
 <defs><radialGradient id="portal-core"><stop stopColor="#131531"/><stop offset=".6" stopColor="#2f286c"/><stop offset=".86" stopColor="#9156e8"/><stop offset=".96" stopColor="#aeecff"/><stop offset="1" stopColor="#7033d3"/></radialGradient></defs>
 <ellipse cx="320" cy="425" rx="220" ry="332" fill="#8d51df" opacity=".12" stroke="#b081ee" strokeWidth="100"/>
 <ellipse cx="320" cy="425" rx="210" ry="320" fill="url(#portal-core)" stroke="#bcf4f6" strokeWidth="9"/>
 {[0,1,2,3,4,5].map(i=><ellipse key={i} cx="320" cy="425" rx={192-i*24} ry={297-i*40} fill="none" stroke={i%2?'#75e8ee':'#bb94ff'} strokeWidth={i===0?7:3} opacity={.6-i*.07} transform={`rotate(${Math.sin(time*2+i)*15} 320 425)`} strokeDasharray={`${60+i*20} ${30+i*10}`} strokeDashoffset={time*(i%2?110:-100)}/>)}
 {Array.from({length:18},(_,i)=>{const a=i*2.399+time*.65;const r=60+(i*47)%155;return <circle key={i} cx={320+Math.cos(a)*r} cy={425+Math.sin(a)*r*1.4} r={2+i%4} fill="#dcfcff" opacity=".7"/>;})}
 </svg>;
