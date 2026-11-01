import { chromium, expect } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1000 },
    acceptDownloads: true,
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const base = process.env.STUDIO_URL || 'http://127.0.0.1:5173';
  await page.goto(base + '/renders/Pixel_Horror_Preview.html');
  await context.setOffline(true);
  await page.waitForFunction(() => document.querySelector('video')?.readyState >= 2);
  const meta = await page
    .locator('video')
    .evaluate((v) => ({
      width: v.videoWidth,
      height: v.videoHeight,
      duration: v.duration,
      muted: v.muted,
      error: v.error?.message ?? null,
    }));
  expect(meta.width).toBe(360);
  expect(meta.height).toBe(640);
  expect(Math.abs(meta.duration - 75)).toBeLessThan(0.05);
  expect(meta.error).toBeNull();
  expect(meta.muted).toBe(false);
  await page.getByRole('button', { name: /The prank/ }).click();
  await page.waitForFunction(() => {
    const v = document.querySelector('video');
    return !v.paused && v.currentTime > 58.15;
  });
  await page.locator('video').evaluate((v) => {
    v.pause();
    v.currentTime = 59.2;
  });
  await page.screenshot({ path: 'renders/pixel-offline-player.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  expect(errors).toEqual([]);
  await context.setOffline(false);
  const full = base + '/renders/Bobo_Max_Episode_001_Dont_Look_Behind_You.mp4';
  const request = await context.request.get(full, { headers: { Range: 'bytes=0-2047' } });
  expect(request.status()).toBe(206);
  expect(request.headers()['content-type']).toContain('video/mp4');
  // Also decode the full-resolution delivery in Chromium, not only its preview proxy.
  await page.setContent(
    `<video id="full" controls preload="metadata" src="${full}"></video><a download="episode.mp4" href="${full}">Download final MP4</a>`,
  );
  await page.waitForFunction(() => document.querySelector('video')?.readyState >= 2);
  expect(
    await page.locator('video').evaluate((v) => [v.videoWidth, v.videoHeight]),
  ).toEqual([1080, 1920]);
  await page.locator('video').evaluate((v) => {
    v.currentTime = 72;
  });
  await page.locator('video').click();
  await page.locator('video').evaluate((v) => v.play());
  await page.waitForFunction(() => document.querySelector('video').currentTime > 72.1);
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: 'Download final MP4' }).click(),
  ]);
  await download.saveAs('/tmp/pixel-download.mp4');
  const sha = (b) => createHash('sha256').update(b).digest('hex');
  const hash = sha(
    await readFile('renders/Bobo_Max_Episode_001_Dont_Look_Behind_You.mp4'),
  );
  expect(sha(await readFile('/tmp/pixel-download.mp4'))).toBe(hash);
  const report = {
    offlinePreview: 'passed',
    chapterSeeking: 'passed',
    responsivePreview: 'passed',
    fullResolutionChromiumPlayback: 'passed',
    downloadHashMatches: true,
    sha256: hash,
    metadata: meta,
  };
  await writeFile(
    'renders/pixel-browser-validation.json',
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
