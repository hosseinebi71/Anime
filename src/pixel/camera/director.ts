import { shots } from '../story';
export const clamp = (n: number, a = 0, b = 1) => Math.max(a, Math.min(b, n));
export const ease = (n: number) => {
  const x = clamp(n);
  return x * x * (3 - 2 * x);
};
export const move = (t: number, a: number, b: number, v: number, w: number) =>
  v + (w - v) * ease((t - a) / (b - a));
export const inside = (t: number, a: number, b: number) => t >= a && t < b;
export function cameraAt(t: number) {
  const i = shots.findLastIndex((s) => t >= s.at);
  const shot = shots[Math.max(0, i)];
  return {
    ...shot,
    zoom: shot.zoom + (shot.push ?? 0) * Math.min(1, (t - shot.at) / 3.5),
  };
}
