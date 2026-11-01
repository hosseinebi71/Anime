import {chromium,expect} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const context=await browser.newContext({acceptDownloads:true});const page=await context.newPage();
 const base=process.env.STUDIO_URL||'http://127.0.0.1:5173';
 await page.goto(base+'/renders/video-preview.html');await context.setOffline(true);
 await page.waitForFunction(()=>document.querySelector('video')?.readyState>=2);
 const meta=await page.locator('video').evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight,error:v.error?.message??null}));
 expect(meta.width).toBe(1080);expect(meta.height).toBe(1920);expect(Math.abs(meta.duration-75)).toBeLessThan(.05);expect(meta.error).toBeNull();
 await page.getByRole('button',{name:'The question',exact:true}).click();
 await page.waitForFunction(()=>{const v=document.querySelector('video');return !v.paused&&v.currentTime>65.2&&v.getVideoPlaybackQuality().totalVideoFrames>2;});
 expect(await page.locator('video').evaluate(v=>!v.muted&&v.volume===1)).toBe(true);
 await page.locator('video').evaluate(v=>v.pause());
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#download').click()]);
 const temp='/tmp/bobo-downloaded-compatible.mp4';await download.saveAs(temp);
 const hash=b=>createHash('sha256').update(b).digest('hex');
 const expected=hash(await readFile('renders/mystery-button-compatible.mp4'));expect(hash(await readFile(temp))).toBe(expected);
 await context.setOffline(false);
 const response=await context.request.get(base+'/renders/mystery-button-compatible.mp4',{headers:{Range:'bytes=0-1023'}});
 expect(response.status()).toBe(206);expect(response.headers()['content-type']).toContain('video/mp4');expect((await response.body()).length).toBe(1024);
 await page.goto(base+'/');await expect(page.locator('a.export-button')).toHaveAttribute('href','/renders/mystery-button-compatible.mp4');
 const report=JSON.parse(await readFile('renders/playback-verification.json','utf8'));
 Object.assign(report,{chromiumPlayback:'passed',offlineHTMLPlayback:'passed',chapterSeeking:'passed',downloadHashMatches:true,sha256:expected,httpRangeRequests:'206 video/mp4',windowsMediaPlayer:'not available in Linux; standard-compatible encoding verified'});
 await writeFile('renders/playback-verification.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
