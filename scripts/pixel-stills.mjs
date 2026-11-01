import { bundle } from '@remotion/bundler';
import { openBrowser, selectComposition, renderStill } from '@remotion/renderer';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('public/pixel/stills', { recursive: true });
const serveUrl = await bundle({ entryPoint: 'src/remotion.ts' });
const browser = await openBrowser('chrome', {
  browserExecutable: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
});
const moments = [
  { name: 'establishing', t: 0.3 },
  { name: 'message', t: 2 },
  { name: 'bobo-laugh', t: 5.3 },
  { name: 'second-message', t: 8.5 },
  { name: 'scratch', t: 15.3 },
  { name: 'eyes', t: 28.2 },
  { name: 'max-call', t: 32.3 },
  { name: 'peak-fear', t: 52.4 },
  { name: 'scream', t: 54.2 },
  { name: 'vacuum', t: 56.7 },
  { name: 'max-prank', t: 59.2 },
  { name: 'angry', t: 62.4 },
  { name: 'collapse', t: 65 },
  { name: 'dignity', t: 69.3 },
  { name: 'freeze', t: 73.6 },
];
try {
  const composition = await selectComposition({
    serveUrl,
    id: 'DontLookBehindYou',
    puppeteerInstance: browser,
    inputProps: { showCaptions: true, audioEnabled: false },
  });
  for (const m of moments.filter(
    (m) =>
      !process.env.PIXEL_STILLS || process.env.PIXEL_STILLS.split(',').includes(m.name),
  )) {
    await renderStill({
      serveUrl,
      composition,
      puppeteerInstance: browser,
      inputProps: { showCaptions: true, audioEnabled: false },
      frame: Math.round(m.t * 30),
      output: `public/pixel/stills/${m.name}.png`,
      imageFormat: 'png',
      scale: 1 / 3,
    });
    console.log(m.name, m.t);
  }
  await writeFile('public/pixel/stills/index.json', JSON.stringify(moments, null, 2));
} finally {
  await browser.close({ silent: true });
}
