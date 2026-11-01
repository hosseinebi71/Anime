import { rack, RATE } from './kernel';
import { scheduleVoices } from './voices';
import { scheduleEffects } from './effects';
import { scheduleMusic } from './music';
import { lines, wordsFor, effects, SILENCES } from '../story';
function wav(buffer: AudioBuffer, normalise: boolean, cutSilence: boolean) {
  const channels = [buffer.getChannelData(0), buffer.getChannelData(1)];
  let peak = 0;
  for (const data of channels) for (const x of data) peak = Math.max(peak, Math.abs(x));
  const gain = normalise ? 0.88 / Math.max(0.001, peak) : 1;
  const bytes = new ArrayBuffer(44 + buffer.length * 4),
    v = new DataView(bytes);
  const text = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
  };
  text(0, 'RIFF');
  v.setUint32(4, bytes.byteLength - 8, true);
  text(8, 'WAVE');
  text(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 2, true);
  v.setUint32(24, RATE, true);
  v.setUint32(28, RATE * 4, true);
  v.setUint16(32, 4, true);
  v.setUint16(34, 16, true);
  text(36, 'data');
  v.setUint32(40, buffer.length * 4, true);
  for (let i = 0; i < buffer.length; i++) {
    const quiet = cutSilence && SILENCES.some(([a, b]) => i / RATE >= a && i / RATE < b);
    for (let ch = 0; ch < 2; ch++)
      v.setInt16(
        44 + i * 4 + ch * 2,
        Math.round(
          (quiet ? 0 : Math.max(-1, Math.min(1, channels[ch][i] * gain))) * 32767,
        ),
        true,
      );
  }
  const u = new Uint8Array(bytes);
  let s = '';
  for (let i = 0; i < u.length; i += 32768)
    s += String.fromCharCode(...u.subarray(i, i + 32768));
  return btoa(s);
}
const rms = (b: AudioBuffer, a: number, z: number) => {
  const d = b.getChannelData(0);
  let energy = 0;
  const from = Math.floor(a * RATE),
    end = Math.min(d.length, Math.floor(z * RATE));
  for (let i = from; i < end; i++) energy += d[i] * d[i];
  return Math.sqrt(energy / Math.max(1, end - from));
};
export async function generateEpisodeAudio() {
  const buffers: Record<string, AudioBuffer> = {};
  for (const layer of ['mix', 'voices', 'effects', 'music']) {
    const r = rack();
    if (layer === 'mix' || layer === 'voices') scheduleVoices(r);
    if (layer === 'mix' || layer === 'effects') scheduleEffects(r);
    if (layer === 'mix' || layer === 'music') scheduleMusic(r);
    buffers[layer] = await r.ctx.startRendering();
  }
  const report = {
    duration: 75,
    sampleRate: RATE,
    channels: 2,
    silence: SILENCES,
    dialogue: lines.map((l) => ({
      ...l,
      words: wordsFor(l).map((w) => ({
        ...w,
        rms: rms(buffers.voices, w.start + 0.015, w.start + (w.end - w.start) * 0.8),
      })),
    })),
    effects: effects.map((e) => ({
      ...e,
      rms: rms(buffers.effects, e.at + 0.01, e.at + e.duration * 0.8),
    })),
    horrorMusicCutAt: 54.7,
    musicAfterCutRMS: rms(buffers.music, 54.75, 55.6),
    method:
      'Original Web Audio harmonic/glottal-like sources, vowel resonators, FM, deterministic noise and score; no TTS or recordings',
  };
  return {
    mix: wav(buffers.mix, true, true),
    voices: wav(buffers.voices, false, false),
    effects: wav(buffers.effects, false, true),
    music: wav(buffers.music, false, true),
    report,
  };
}
