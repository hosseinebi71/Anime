import { spawnSync, execFileSync } from 'node:child_process';
import { mkdirSync, renameSync, statSync } from 'node:fs';
const output = 'renders/Bobo_Max_Episode_001_Dont_Look_Behind_You.mp4';
mkdirSync('renders', { recursive: true });
const raw = 'renders/.pixel-master.mp4';
const render = spawnSync(
  process.execPath,
  [
    'node_modules/@remotion/cli/remotion-cli.js',
    'render',
    'src/remotion.ts',
    'DontLookBehindYou',
    raw,
    '--browser-executable=' + (process.env.CHROMIUM_PATH || '/usr/bin/chromium'),
    '--concurrency=3',
    '--codec=h264',
    '--audio-codec=aac',
    '--audio-bitrate=160k',
    '--pixel-format=yuv420p',
    '--color-space=bt709',
    '--image-format=png',
    '--x264-preset=medium',
    '--crf=20',
  ],
  { stdio: 'inherit' },
);
if (render.status !== 0) process.exit(render.status ?? 1);
const probe = (p) =>
  JSON.parse(
    execFileSync(
      'ffprobe',
      ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', p],
      { encoding: 'utf8' },
    ),
  );
const v = probe(raw).streams.find((s) => s.codec_type === 'video');
if (v.pix_fmt === 'yuv420p' && v.color_range !== 'pc') {
  execFileSync('ffmpeg', [
    '-y',
    '-v',
    'error',
    '-i',
    raw,
    '-map',
    '0:v:0',
    '-map',
    '0:a:0',
    '-c',
    'copy',
    '-tag:v',
    'avc1',
    '-movflags',
    '+faststart',
    output,
  ]);
} else {
  execFileSync('ffmpeg', [
    '-y',
    '-v',
    'error',
    '-i',
    raw,
    '-map',
    '0:v:0',
    '-map',
    '0:a:0',
    '-vf',
    `scale=in_range=${v.color_range === 'pc' || v.pix_fmt.startsWith('yuvj') ? 'full' : 'limited'}:out_range=limited,format=yuv420p`,
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    '20',
    '-pix_fmt',
    'yuv420p',
    '-color_range',
    'tv',
    '-colorspace',
    'bt709',
    '-tag:v',
    'avc1',
    '-c:a',
    'copy',
    '-movflags',
    '+faststart',
    output,
  ]);
}
if (statSync(output).size > 95000000) {
  const smaller = 'renders/.pixel-web.mp4';
  execFileSync('ffmpeg', [
    '-y',
    '-v',
    'error',
    '-i',
    output,
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    '23',
    '-pix_fmt',
    'yuv420p',
    '-color_range',
    'tv',
    '-colorspace',
    'bt709',
    '-c:a',
    'copy',
    '-movflags',
    '+faststart',
    smaller,
  ]);
  renameSync(smaller, output);
}
const info = probe(output);
const video = info.streams.find((s) => s.codec_type === 'video'),
  audio = info.streams.find((s) => s.codec_type === 'audio');
if (
  video.pix_fmt !== 'yuv420p' ||
  video.codec_name !== 'h264' ||
  audio.codec_name !== 'aac'
)
  throw new Error('Incompatible export');
console.log(
  JSON.stringify(
    {
      output,
      bytes: statSync(output).size,
      video: video.codec_name,
      pixelFormat: video.pix_fmt,
      audio: audio.codec_name,
      frames: video.nb_frames,
    },
    null,
    2,
  ),
);
