export const RATE = 44100;
export interface Rack {
  ctx: OfflineAudioContext;
  voice: GainNode;
  fx: GainNode;
  music: GainNode;
  noise: AudioBuffer;
}
export function rack(): Rack {
  const ctx = new OfflineAudioContext(2, 75 * RATE, RATE);
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -15;
  compressor.knee.value = 14;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.004;
  compressor.release.value = 0.1;
  compressor.connect(ctx.destination);
  const bus = (gain: number) => {
    const g = ctx.createGain();
    g.gain.value = gain;
    g.connect(compressor);
    return g;
  };
  const noise = ctx.createBuffer(1, RATE * 4, RATE);
  const data = noise.getChannelData(0);
  let seed = 934091;
  for (let i = 0; i < data.length; i++) {
    seed = (seed * 16807) % 2147483647;
    data[i] = seed / 1073741824 - 1;
  }
  return { ctx, voice: bus(0.72), fx: bus(0.5), music: bus(0.2), noise };
}
export function tone(
  r: Rack,
  at: number,
  duration: number,
  freq: number,
  end: number,
  amp: number,
  type: OscillatorType,
  bus: AudioNode,
  pan = 0,
  fm = 0,
) {
  if (at >= 75 || at < 0) return;
  const d = Math.min(duration, 74.999 - at);
  if (d <= 0.005) return;
  const { ctx } = r;
  const o = ctx.createOscillator(),
    g = ctx.createGain(),
    p = ctx.createStereoPanner();
  o.type = type;
  o.frequency.setValueAtTime(Math.max(20, freq), at);
  o.frequency.exponentialRampToValueAtTime(Math.max(20, end), at + d);
  g.gain.setValueAtTime(0.00001, at);
  g.gain.exponentialRampToValueAtTime(
    Math.max(0.0001, amp),
    at + Math.min(0.03, d * 0.14),
  );
  g.gain.exponentialRampToValueAtTime(0.00001, at + d);
  p.pan.value = pan;
  o.connect(g);
  g.connect(p);
  p.connect(bus);
  if (fm) {
    const mod = ctx.createOscillator(),
      mg = ctx.createGain();
    mod.frequency.value = 17 + freq * 0.02;
    mg.gain.value = fm;
    mod.connect(mg);
    mg.connect(o.frequency);
    mod.start(at);
    mod.stop(at + d);
  }
  o.start(at);
  o.stop(at + d);
}
export function noiseBurst(
  r: Rack,
  at: number,
  d: number,
  amp: number,
  frequency: number,
  end: number,
  pan = 0,
  bus: AudioNode = r.fx,
) {
  if (at < 0 || at >= 75) return;
  d = Math.min(d, 74.999 - at);
  if (d <= 0) return;
  const { ctx } = r;
  const n = ctx.createBufferSource(),
    filter = ctx.createBiquadFilter(),
    g = ctx.createGain(),
    p = ctx.createStereoPanner();
  n.buffer = r.noise;
  n.loop = true;
  filter.type = 'bandpass';
  filter.Q.value = 1.5;
  filter.frequency.setValueAtTime(frequency, at);
  filter.frequency.exponentialRampToValueAtTime(Math.max(30, end), at + d);
  g.gain.setValueAtTime(0.00001, at);
  g.gain.exponentialRampToValueAtTime(amp, at + d * 0.18);
  g.gain.exponentialRampToValueAtTime(0.00001, at + d);
  p.pan.value = pan;
  n.connect(filter);
  filter.connect(g);
  g.connect(p);
  p.connect(bus);
  n.start(at, (at * 1.71) % 3);
  n.stop(at + d);
}
