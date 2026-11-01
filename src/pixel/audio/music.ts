import { lines } from '../story';
import { tone, type Rack } from './kernel';
export function scheduleMusic(r: Rack) {
  // The horror bus has its own hard stop; no releases or drones leak past the reveal.
  const gate = r.ctx.createGain();
  gate.gain.setValueAtTime(1, 0);
  gate.gain.setValueAtTime(1, 54.69);
  gate.gain.linearRampToValueAtTime(0, 54.7);
  gate.connect(r.music);
  for (let at = 0; at < 54; at += 3.7) {
    const duck = lines.some((l) => at >= l.start - 0.3 && at < l.end) ? 0.35 : 1;
    const tension = at < 12 ? 0.5 : at < 30 ? 0.7 : 1;
    [55, 82.41, 116.54].forEach((hz, i) =>
      tone(
        r,
        at,
        4.5,
        hz,
        hz * 1.006,
        0.09 * duck * tension,
        'triangle',
        gate,
        (i - 1) * 0.6,
        1.1,
      ),
    );
    if (at > 12)
      tone(
        r,
        at + 1.8,
        2.1,
        440 * (at % 2 ? 1 : 1.059),
        427,
        0.035 * duck,
        'sine',
        gate,
        -0.45,
        3,
      );
  }
  for (let i = 0; i < 25; i++) {
    const at = 58 + i * 0.625;
    if (at > 73.4) break;
    const duck = lines.some((l) => at >= l.start - 0.1 && at < l.end) ? 0.35 : 0.85;
    const root = [146.83, 130.81, 174.61, 146.83][Math.floor(i / 4) % 4];
    tone(r, at, 0.3, root, root * 0.98, 0.23 * duck, 'triangle', r.music, -0.25);
    tone(
      r,
      at + 0.31,
      0.14,
      root * 2 ** ([12, 19, 15, 22][i % 4] / 12),
      root * 2 ** ([12, 19, 15, 22][i % 4] / 12),
      0.14 * duck,
      'sine',
      r.music,
      0.3,
    );
  }
}
