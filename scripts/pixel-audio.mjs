import { chromium } from '@playwright/test';
import { writeFile, readFile, mkdir, unlink } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
try {
  const page = await browser.newPage();
  await page.goto(
    (process.env.STUDIO_URL || 'http://127.0.0.1:5173') + '/audio-render.html',
  );
  const r = await page.evaluate(async () => {
    const { generateEpisodeAudio } = await import('/src/pixel/audio/render.ts');
    return generateEpisodeAudio();
  });
  await mkdir('public/pixel/audio', { recursive: true });
  const raw = 'public/pixel/audio/.mix.wav';
  await writeFile(raw, Buffer.from(r.mix, 'base64'));
  execFileSync('ffmpeg', [
    '-y',
    '-v',
    'error',
    '-i',
    raw,
    '-af',
    'loudnorm=I=-17:TP=-2:LRA=9',
    '-ar',
    '44100',
    '-c:a',
    'pcm_s16le',
    'public/pixel/audio/episode.wav',
  ]);
  await unlink(raw);
  for (const stem of ['voices', 'effects', 'music'])
    await writeFile(`public/pixel/audio/${stem}.wav`, Buffer.from(r[stem], 'base64'));
  const pcm = await readFile('public/pixel/audio/episode.wav');
  let at = 12,
    peak = 0,
    sum = 0,
    n = 0;
  while (at + 8 < pcm.length) {
    const len = pcm.readUInt32LE(at + 4);
    if (pcm.toString('ascii', at, at + 4) === 'data') {
      for (let i = at + 8; i < Math.min(pcm.length, at + 8 + len); i += 2) {
        const x = pcm.readInt16LE(i) / 32768;
        peak = Math.max(peak, Math.abs(x));
        sum += x * x;
        n++;
      }
      break;
    }
    at += 8 + len + (len % 2);
  }
  Object.assign(r.report, {
    peak,
    rms: Math.sqrt(sum / n),
    mastering: { targetLUFS: -17, truePeakCeilingDBTP: -2 },
  });
  await writeFile('public/pixel/audio/report.json', JSON.stringify(r.report, null, 2));
  const stamp = (t) => {
    const ms = Math.round(t * 1000);
    return `00:${String(Math.floor(ms / 60000)).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
  };
  await writeFile(
    'public/pixel/episode.srt',
    r.report.dialogue
      .map((l, i) => `${i + 1}\n${stamp(l.start)} --> ${stamp(l.end)}\n${l.text}\n`)
      .join('\n'),
  );
  console.log(
    JSON.stringify(
      {
        lines: r.report.dialogue.length,
        words: r.report.dialogue.reduce((n, l) => n + l.words.length, 0),
        minWordRMS: Math.min(
          ...r.report.dialogue.flatMap((l) => l.words.map((w) => w.rms)),
        ),
        effects: r.report.effects,
        peak,
        rms: r.report.rms,
        musicAfterCutRMS: r.report.musicAfterCutRMS,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
