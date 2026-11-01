import {chromium} from '@playwright/test';
import {writeFile,mkdir,readFile,unlink} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try {
 const page=await browser.newPage();await page.goto((process.env.STUDIO_URL||'http://127.0.0.1:5173')+'/audio-render.html');
 const result=await page.evaluate(async()=>{const {generateSoundtrack}=await import('/src/audio/synthesize.ts');return generateSoundtrack();});
 await mkdir('public/audio',{recursive:true});
 const raw='public/audio/.unmastered.wav';
 await writeFile(raw,Buffer.from(result.master,'base64'));
 const mastering=execFileSync('ffmpeg',['-y','-hide_banner','-i',raw,'-af','loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json','-ar','44100','-c:a','pcm_s16le','public/audio/mystery-button.wav'],{stdio:['ignore','pipe','pipe']});
 await unlink(raw);
 const pcm=await readFile('public/audio/mystery-button.wav');let pos=12,peak=0,sum=0,count=0;
 while(pos+8<pcm.length){const len=pcm.readUInt32LE(pos+4);if(pcm.toString('ascii',pos,pos+4)==='data'){for(let i=pos+8;i<Math.min(pcm.length,pos+8+len);i+=2){const v=pcm.readInt16LE(i)/32768;peak=Math.max(peak,Math.abs(v));sum+=v*v;count++;}break;}pos+=8+len+(len%2);}
 result.report.synthesisPeak=result.report.peak;result.report.peak=peak;result.report.rms=Math.sqrt(sum/count);
 result.report.mastering={integratedLoudnessTargetLUFS:-16,truePeakCeilingDBTP:-1.5,loudnessRangeTargetLU:9,processor:'FFmpeg EBU R128 loudnorm after Web Audio synthesis'};
 await writeFile('public/audio/voices-only.wav',Buffer.from(result.voices,'base64'));
 const stamp=(t)=>{const ms=Math.round(t*1000);return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')},${String(ms%1000).padStart(3,'0')}`;};
 await writeFile('public/audio/mystery-button.srt',result.report.dialogue.map((d,i)=>`${i+1}\n${stamp(d.start)} --> ${stamp(d.end)}\n${d.speaker.toUpperCase()}: ${d.text}\n`).join('\n'));
 await writeFile('public/audio/report.json',JSON.stringify(result.report,null,2));
 console.log(JSON.stringify({...result.report,dialogue:result.report.dialogue.map(d=>({text:d.text,words:d.words.length,minWordRms:Math.min(...d.words.map(w=>w.rms))}))},null,2));
} finally {await browser.close();}
