import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {dialogue,wordsFor,DURATION,speechAt} from '../src/story/mysteryButton';
async function seek(page:Page,frame:number){
 await page.getByRole('slider').evaluate((el,value)=>{const input=el as HTMLInputElement;Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!.call(input,String(value));input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));},frame);
 await expect(page.getByRole('slider')).toHaveValue(String(frame));
}

test('every dialogue word has generated sound, a valid clock interval and a mouth envelope',()=>{
 const report=JSON.parse(readFileSync('public/audio/report.json','utf8'));
 expect(report.duration).toBe(75);expect(report.peak).toBeLessThan(.95);expect(report.dialogue).toHaveLength(dialogue.length);
 let lastEnd=0;
 dialogue.forEach((line,i)=>{
  expect(line.start).toBeGreaterThanOrEqual(lastEnd);expect(line.end).toBeLessThanOrEqual(75);lastEnd=line.end;
  expect(report.dialogue[i].text).toBe(line.text);
  wordsFor(line).forEach((word,j)=>{
   expect(report.dialogue[i].words[j].start).toBe(word.start);expect(report.dialogue[i].words[j].rms).toBeGreaterThan(.01);
   expect(speechAt(word.start+.04,line.speaker)).toBeGreaterThan(0);
   expect(report.silence.some(([a,b]:number[])=>word.start<b&&word.end>a)).toBeFalsy();
  });
 });
});

test('all 23 lines show the right speaker and active word at their sound cue',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 for(const line of dialogue){const word=wordsFor(line)[0];await seek(page,Math.ceil((word.start+.12)*30));
  await expect(page.getByTestId('subtitles')).toHaveAttribute('data-speaker',line.speaker);
  await expect(page.locator('[data-active=true]')).toHaveText(word.text);
 }
 await seek(page,43*30);await expect(page.locator('.phone [aria-label^="max,"]')).toHaveCount(0);
 await seek(page,63*30);await expect(page.locator('.phone [aria-label="banana max, annoyed"]')).toBeVisible();
 await seek(page,DURATION-1);await expect(page.locator('.phone')).toContainText('COMPLICATED.');
 expect(errors).toEqual([]);
});

test('playback, mute, captions and the redesigned character playground work',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:/The wrong question/}).click();
 await expect(page.getByTestId('subtitles')).toContainText('Can I eat you?');
 await page.getByRole('button',{name:'Play animation'}).click();await expect(page.getByRole('button',{name:'Pause animation'})).toBeVisible();
 await page.waitForTimeout(400);await page.getByRole('button',{name:'Pause animation'}).click();
 expect(Number(await page.getByRole('slider').inputValue())).toBeGreaterThan(2040);
 await page.getByRole('button',{name:'Mute sound'}).click();await expect(page.getByRole('button',{name:'Unmute sound'})).toBeVisible();
 await page.getByRole('checkbox').uncheck();await expect(page.getByTestId('subtitles')).toHaveCount(0);
 await page.getByRole('button',{name:'Characters',exact:true}).click();await page.getByRole('button',{name:'max',exact:true}).click();
 await page.getByRole('button',{name:'furious',exact:true}).click();await page.getByRole('checkbox').check();
 await expect(page.locator('.lab-stage svg')).toHaveAttribute('aria-label','banana max, furious');
 await page.getByRole('button',{name:'Guide',exact:true}).click();await expect(page.getByText('npm run audio',{exact:true})).toBeVisible();
});

test('desktop and mobile scenes stay in bounds with an audible media source',async({page})=>{
 await page.setViewportSize({width:1440,height:1200});await page.goto('/');await page.getByRole('button',{name:/A-peeling twist/}).click();
 await expect(page.locator('.phone audio[src$="mystery-button.wav"]')).toHaveAttribute('src',/mystery-button.wav/);
 await page.screenshot({path:'renders/studio-upgraded.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
 await page.getByRole('button',{name:/The wrong question/}).click();await expect(page.getByRole('slider')).toHaveValue('2040');
 await page.screenshot({path:'renders/mobile-upgraded.png',fullPage:true});
});
