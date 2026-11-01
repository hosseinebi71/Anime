import { syllables } from '../story';
import { noiseBurst, type Rack } from './kernel';
/** Nonsense performances from a glottal-like harmonic source, animated formants and FM; no TTS. */
export function scheduleVoices(r: Rack) {
  const { ctx } = r;
  const real = new Float32Array(28),
    imag = new Float32Array(28);
  for (let n = 1; n < 28; n++) imag[n] = 1 / n ** 1.45;
  const sourceWave = ctx.createPeriodicWave(real, imag);
  const vowels = [
    [850, 1800, 3000],
    [460, 2200, 3200],
    [1000, 1250, 2800],
    [650, 1100, 2500],
    [400, 900, 2350],
  ];
  syllables.forEach((s) => {
    const scream = s.emotion === 'scream',
      laugh = s.emotion === 'laugh' || s.emotion === 'amused',
      fear = s.emotion === 'fear' || s.emotion === 'urgent';
    const at = s.start,
      d = s.end - s.start,
      base = s.pitch * (scream ? 1.7 : laugh ? 1.15 : 1);
    const output = ctx.createGain(),
      pan = ctx.createStereoPanner();
    pan.pan.value = s.speaker === 'bobo' ? -0.14 : 0.15;
    output.connect(pan);
    pan.connect(r.voice);
    const amp = scream ? 0.37 : fear ? 0.25 : 0.22;
    output.gain.setValueAtTime(0.00001, at);
    output.gain.exponentialRampToValueAtTime(amp, at + Math.min(0.02, d * 0.13));
    output.gain.setValueAtTime(amp * 0.74, at + d * 0.65);
    output.gain.exponentialRampToValueAtTime(0.00001, at + d);
    const glottis = ctx.createOscillator();
    glottis.setPeriodicWave(sourceWave);
    glottis.frequency.setValueAtTime(base * (laugh ? 1.3 : 0.82), at);
    glottis.frequency.exponentialRampToValueAtTime(
      base * (scream ? 2.0 : fear ? 1.5 : 1.22),
      at + d * 0.32,
    );
    glottis.frequency.exponentialRampToValueAtTime(
      base * (laugh ? 0.62 : scream ? 1.25 : 0.78),
      at + d,
    );
    const mod = ctx.createOscillator(),
      mg = ctx.createGain();
    mod.frequency.value = scream ? 31 : laugh ? 19 : 13 + (s.index % 7);
    mg.gain.value = base * (scream ? 0.12 : 0.035);
    mod.connect(mg);
    mg.connect(glottis.frequency);
    mod.start(at);
    mod.stop(at + d);
    const formants = vowels[s.vowel];
    formants.forEach((hz, i) => {
      const b = ctx.createBiquadFilter(),
        g = ctx.createGain();
      b.type = 'bandpass';
      b.Q.value = i === 0 ? 2.2 : 3.8;
      b.frequency.setValueAtTime(hz * (s.speaker === 'bobo' ? 1.27 : 1.04), at);
      b.frequency.linearRampToValueAtTime(
        hz * (s.speaker === 'bobo' ? 1.16 : 1.08),
        at + d,
      );
      g.gain.value = [1.25, 0.65, 0.27][i];
      glottis.connect(b);
      b.connect(g);
      g.connect(output);
    });
    const nasal = ctx.createBiquadFilter();
    nasal.type = 'peaking';
    nasal.frequency.value = 1400;
    nasal.Q.value = 3;
    nasal.gain.value = 4;
    const little = ctx.createGain();
    little.gain.value = 0.1;
    glottis.connect(nasal);
    nasal.connect(little);
    little.connect(output);
    glottis.start(at);
    glottis.stop(at + d);
    // Controlled breath/rasp belongs to this individual syllable, never a looping voice recording.
    noiseBurst(
      r,
      at,
      d,
      s.speaker === 'max' ? 0.027 : 0.012,
      1900,
      900,
      s.speaker === 'bobo' ? -0.14 : 0.15,
      r.voice,
    );
  });
}
