import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import {
  lines,
  syllables,
  wordsFor,
  mouthAt,
  effects,
  shots,
  SILENCES,
} from '../src/pixel/story';
async function seek(page: Page, f: number) {
  await page.getByRole('slider').evaluate((el, value) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(
      el,
      String(value),
    );
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, f);
  await expect(page.getByRole('slider')).toHaveValue(String(f));
}

test('all performed words and intended effects have synthesized audio; music stops at reveal', () => {
  const r = JSON.parse(readFileSync('public/pixel/audio/report.json', 'utf8'));
  expect(r.duration).toBe(75);
  expect(r.dialogue).toHaveLength(lines.length);
  expect(r.peak).toBeLessThan(0.9);
  expect(r.musicAfterCutRMS).toBe(0);
  lines.forEach((l, i) => {
    expect(r.dialogue[i].text).toBe(l.text);
    wordsFor(l).forEach((w, j) => {
      expect(r.dialogue[i].words[j].start).toBe(w.start);
      expect(r.dialogue[i].words[j].rms).toBeGreaterThan(0.01);
      expect(SILENCES.some(([a, b]) => w.start < b && w.end > a)).toBe(false);
    });
  });
  expect(r.effects).toHaveLength(effects.length);
  for (const e of r.effects)
    expect(e.rms, `${e.name} at ${e.at}`).toBeGreaterThan(0.0005);
});

test('mouths share actual syllable envelopes and close in the gaps; final beep triggers scream', () => {
  for (const s of syllables) {
    expect(mouthAt(s.start + (s.end - s.start) * 0.4, s.speaker)).toBeGreaterThan(0.5);
  }
  for (const who of ['bobo', 'max'] as const) {
    for (const t of [0, 10.9, 11.5, 55, 67, 74.5]) expect(mouthAt(t, who)).toBe(0);
  }
  const beep = effects.find((e) => e.name === 'beep')!;
  const scream = lines.find((l) => l.start > 71 && l.speaker === 'bobo')!;
  expect(scream.start - beep.at).toBeCloseTo(0.08, 4);
  expect(shots.length).toBe(34);
});

test('all four phone messages are readable and the caller is Max', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByTestId('pixel-stage')).toHaveAttribute('data-ready', 'true');
  for (const [at, text] of [
    [2, "DON'T LOOK BEHIND YOU."],
    [8.5, "I'M NOT MAX."],
    [21, "IT'S RIGHT BEHIND YOU."],
    [26, "DON'T TURN AROUND!!!"],
  ] as const) {
    await seek(page, Math.round(at * 30));
    await expect(page.getByTestId('phone-insert')).toContainText(text);
  }
  await seek(page, 30.6 * 30);
  await expect(page.getByTestId('phone-insert')).toContainText('INCOMING CALL');
  await expect(page.getByTestId('phone-insert')).toContainText('MAX');
  expect(errors).toEqual([]);
});

test('every spoken line has the correctly timed speaker and active subtitle word', async ({
  page,
}) => {
  await page.goto('/');
  for (const l of lines) {
    await seek(page, Math.ceil((l.start + 0.12) * 30));
    await expect(page.getByTestId('subtitles')).toHaveAttribute(
      'data-speaker',
      l.speaker,
    );
    await expect(page.locator('[data-active=true]')).toHaveText(wordsFor(l)[0].text);
  }
  await seek(page, 55 * 30);
  await expect(page.getByTestId('subtitles')).toHaveCount(0);
  await seek(page, 2249);
  await expect(page.getByTestId('freeze-title')).toContainText('BRAVEST GUY');
});

test('browser playback, sound, captions and human-rig controls work', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Play film' }).click();
  await expect(page.getByRole('button', { name: 'Pause film' })).toBeVisible();
  await page.waitForTimeout(350);
  await page.getByRole('button', { name: 'Pause film' }).click();
  expect(Number(await page.getByRole('slider').inputValue())).toBeGreaterThan(150);
  await page.getByRole('button', { name: 'Mute sound' }).click();
  await expect(page.getByRole('button', { name: 'Unmute sound' })).toBeVisible();
  await page.getByRole('checkbox').uncheck();
  await expect(page.getByTestId('subtitles')).toHaveCount(0);
  await page.getByRole('button', { name: 'Characters', exact: true }).click();
  await page.getByRole('button', { name: 'max', exact: true }).click();
  await page.getByRole('button', { name: 'walk', exact: true }).click();
  await expect(page.getByTestId('pixel-stage')).toHaveAttribute('data-ready', 'true');
  const a = await page
    .getByTestId('pixel-stage')
    .evaluate((c: HTMLCanvasElement) => c.toDataURL());
  await page.waitForTimeout(250);
  const b = await page
    .getByTestId('pixel-stage')
    .evaluate((c: HTMLCanvasElement) => c.toDataURL());
  expect(a).not.toBe(b);
  await page.getByRole('button', { name: 'Production', exact: true }).click();
  await expect(page.getByText('npm run audio:pixel', { exact: true })).toBeVisible();
});

test('scene seeking, shared pixel grid and responsive preview stay in bounds', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('/');
  await page.getByRole('button', { name: /The prank/ }).click();
  await expect(page.getByRole('slider')).toHaveValue('1776');
  const canvas = page.getByTestId('pixel-stage');
  expect(
    await canvas.evaluate((c: HTMLCanvasElement) => [
      c.width,
      c.height,
      getComputedStyle(c).imageRendering,
    ]),
  ).toEqual([360, 640, 'pixelated']);
  await page.screenshot({ path: 'renders/pixel-studio-preview.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.getByRole('button', { name: /Bravest guy alive/ }).click();
  await expect(page.getByRole('slider')).toHaveValue('2079');
  await page.screenshot({ path: 'renders/pixel-mobile-preview.png', fullPage: true });
});
