import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('public/stills',{recursive:true});
const serveUrl=await bundle({entryPoint:'src/remotion.ts'});
const browser=await openBrowser('chrome',{browserExecutable:process.env.CHROMIUM_PATH||'/usr/bin/chromium'});
try{
 const composition=await selectComposition({serveUrl,id:'MysteryButton',puppeteerInstance:browser});
 const seconds=[3,12,28.9,39.5,49.5,63,67.7];
 for(let i=0;i<seconds.length;i++){
  await renderStill({serveUrl,composition,puppeteerInstance:browser,frame:Math.round(seconds[i]*30),output:`public/stills/scene-${i+1}.jpg`,imageFormat:'jpeg',jpegQuality:92,scale:.5});
  console.log(`Scene ${i+1}: frame ${Math.round(seconds[i]*30)}`);
 }
 await renderStill({serveUrl,composition,puppeteerInstance:browser,frame:2200,output:'public/stills/freeze.jpg',imageFormat:'jpeg',jpegQuality:92,scale:.5});
 await copyFile('public/stills/scene-6.jpg','public/poster.jpg');
}finally{await browser.close({silent:true});}
