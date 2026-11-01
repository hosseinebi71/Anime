import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:1280,height:1100}});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto((process.env.STUDIO_URL||'http://127.0.0.1:5173')+'/renders/interactive-preview.html');
 await context.setOffline(true);
 await page.waitForFunction(()=>document.querySelector('video')?.readyState>=1);
 const meta=await page.locator('video').evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight,muted:v.muted,volume:v.volume}));
 expect(Math.abs(meta.duration-75)).toBeLessThan(.05);
 expect({...meta,duration:75}).toEqual({duration:75,width:540,height:960,muted:false,volume:1});
 await page.getByRole('button',{name:/A-peeling twist/}).click();
 await page.waitForFunction(()=>{const v=document.querySelector('video');return !v.paused&&v.currentTime>55.1;});
 await page.locator('video').evaluate(v=>{v.pause();v.currentTime=63;});
 await page.screenshot({path:'renders/offline-preview.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
 expect(errors).toEqual([]);
 console.log(JSON.stringify({offlinePlayback:'passed',chapterSeeking:'passed',responsiveLayout:'passed',...meta},null,2));
}finally{await browser.close();}
