import { effects } from '../story';
import { tone, noiseBurst, type Rack } from './kernel';
export function scheduleEffects(r: Rack) {
  // Stereo rain and distant air, with changing bands and slow amplitude contours.
  for (let i = 0; i < 75; i += 2) {
    const before = i < 54.7;
    noiseBurst(
      r,
      i,
      Math.min(2.2, 75 - i),
      before ? 0.018 : 0.009,
      4200 + (i % 5) * 90,
      2900,
      i % 4 ? -0.55 : 0.55,
    );
  }
  for (let at = 13; at < 53.5; at += 1.4 - (at - 13) * 0.012) {
    tone(r, at, 0.13, 72, 40, 0.1 + (at - 13) * 0.0015, 'sine', r.fx);
    tone(r, at + 0.2, 0.1, 59, 35, 0.055, 'sine', r.fx);
  }
  for (let at = 14.1; at < 30; at += 3.4)
    noiseBurst(r, at, 1.1, 0.025, 900, 420, -0.18, r.fx);
  effects.forEach((e) => {
    const t = e.at,
      d = e.duration;
    if (e.name === 'vibration') {
      for (let j = 0; j < 3; j++) {
        tone(r, t + j * 0.14, 0.11, 118, 105, 0.16, 'sawtooth', r.fx, -0.1, 5);
        noiseBurst(r, t + j * 0.14, 0.1, 0.04, 350, 160, -0.1);
      }
    }
    if (e.name === 'scratch') {
      for (let j = 0; j < 4; j++)
        noiseBurst(
          r,
          t + (j * d) / 5,
          d * 0.27,
          0.11 + j * 0.01,
          1800 + j * 400,
          500,
          -0.55,
        );
    }
    if (e.name === 'ring') {
      for (let j = 0; j < 4; j++) {
        tone(r, t + j * 0.34, 0.22, 685, 685, 0.13, 'sine', r.fx, -0.2);
        tone(r, t + j * 0.34, 0.22, 910, 910, 0.07, 'sine', r.fx, -0.2);
      }
    }
    if (e.name === 'answer') tone(r, t, 0.09, 830, 520, 0.1, 'triangle', r.fx);
    if (e.name === 'breath') {
      noiseBurst(r, t, d, 0.085, 280, 700, 0.4);
      tone(r, t, d, 46, 39, 0.07, 'triangle', r.fx, 0.45, 4);
    }
    if (e.name === 'switch') {
      tone(r, t, 0.025, 1700, 500, 0.09, 'square', r.fx);
    }
    if (e.name === 'vacuum') {
      tone(r, t, d, 112, 130, 0.045, 'sawtooth', r.fx, 0.3, 5);
      noiseBurst(r, t, d, 0.038, 1400, 1800, 0.3);
      for (let j = 0; j < d / 0.18; j++)
        noiseBurst(r, t + j * 0.18, 0.08, 0.035, 800, 300, 0.3);
    }
    if (e.name === 'jacket') noiseBurst(r, t, d, 0.045, 2100, 900, -0.2);
    if (e.name === 'beep') {
      tone(r, t, d, 1250, 1250, 0.19, 'sine', r.fx, 0.15);
    }
    if (e.name === 'footstep') {
      tone(r, t, d, 130, 48, 0.13, 'triangle', r.fx, -0.2);
      noiseBurst(r, t, 0.1, 0.035, 650, 220, -0.2);
    }
    if (e.name === 'bump') tone(r, t, d, 180, 55, 0.17, 'triangle', r.fx);
    if (e.name === 'jump') {
      tone(r, t, d, 280, 810, 0.18, 'triangle', r.fx, -0.2, 17);
      noiseBurst(r, t, 0.2, 0.08, 500, 3000, -0.2);
    }
    if (e.name === 'sting') {
      [293.66, 369.99, 440, 587.33].forEach((hz, i) =>
        tone(
          r,
          t + i * 0.025,
          d - i * 0.025,
          hz,
          hz * 0.99,
          0.15,
          'triangle',
          r.fx,
          (i - 1.5) * 0.2,
        ),
      );
      tone(r, t, 0.15, 110, 45, 0.2, 'sine', r.fx);
    }
  });
  // A far-off rumble precedes each ominous escalation; volumes stay below the performers.
  [11.9, 26.9, 40.4, 46, 51.1].forEach((t, i) => {
    tone(r, t, 1.6, 39 + i * 2, 31, 0.055, 'sine', r.fx, 0, 2);
    noiseBurst(r, t, 1.6, 0.027, 220, 70);
  });
}
