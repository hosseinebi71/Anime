import { drawPerson, drawPhone } from '../characters/PixelRig';
import { oval, pixelLine } from '../characters/face';
import { cameraAt, inside, move, ease } from '../camera/director';
import { lineAt, mouthAt, type Emotion } from '../story';
export interface Assets {
  room: HTMLImageElement;
  porch: HTMLImageElement;
  atlas: HTMLCanvasElement;
}
export function vacuum(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  t: number,
  light: boolean,
) {
  c.save();
  c.translate(Math.round(x), Math.round(y));
  oval(c, 1, 10, 24, 5, '#080c17');
  // The caught sock turns with the wheel: the source of the scratching and the "monster".
  const flap = Math.round(Math.sin(t * 19) * 3);
  c.fillStyle = '#777c98';
  c.fillRect(17, 4, 6, 10);
  c.fillStyle = '#c9b8ac';
  c.fillRect(18, 9, 5, 8);
  c.fillRect(19 + flap, 16, 9, 4);
  c.fillStyle = '#4c536d';
  c.fillRect(19, 9, 4, 2);
  oval(c, 0, 2, 22, 9, light ? '#727a90' : '#192030');
  c.fillStyle = light ? '#343e55' : '#0a111d';
  c.fillRect(-22, 1, 45, 6);
  oval(c, 0, -2, 22, 8, light ? '#aeb5c0' : '#293346');
  oval(c, -1, -3, 15, 5, light ? '#838c9d' : '#212b3d');
  c.fillStyle = '#ff4559';
  c.fillRect(-7, 0, 4, 2);
  c.fillRect(4, 0, 4, 2);
  c.fillStyle = '#29334a';
  c.fillRect(-3, -7, 7, 2);
  c.fillStyle = '#d5e4e1';
  c.fillRect(11, -5, 4, 1);
  c.restore();
}
function roomAtmosphere(c: CanvasRenderingContext2D, t: number, outside: boolean) {
  c.save();
  if (!outside) {
    c.beginPath();
    c.rect(237, 75, 101, 209);
    c.clip();
  }
  for (let i = 0; i < (outside ? 85 : 44); i++) {
    const x = (i * 41.73 + t * 14) % 360,
      y = (i * 67.13 + t * (outside ? 137 : 85)) % 640;
    c.fillStyle = `rgba(126,176,218,${0.13 + (i % 5) * 0.045})`;
    c.fillRect(Math.round(x), Math.round(y), 1, 4 + (i % 5));
  }
  c.restore();
  if (!outside)
    for (let i = 0; i < 12; i++) {
      c.fillStyle = `rgba(155,180,216,${0.04 + (i % 3) * 0.03})`;
      c.fillRect(
        Math.round(60 + i * 21 + Math.sin(t * 0.4 + i) * 7),
        Math.round(150 + ((i * 47) % 240) + Math.cos(t * 0.3 + i) * 6),
        1,
        1,
      );
    }
}
export function drawWorld(c: CanvasRenderingContext2D, assets: Assets, time: number) {
  const t = Math.min(time, 73.4),
    f = Math.round(t * 30),
    cam = cameraAt(t),
    light = t >= 54.7;
  const exterior = cam.type === 'window';
  c.imageSmoothingEnabled = false;
  c.fillStyle = '#090c18';
  c.fillRect(0, 0, 360, 640);
  c.save();
  const z = exterior ? 1.32 : cam.zoom;
  const cx = exterior ? 180 : cam.x,
    cy = exterior ? 360 : cam.y;
  c.translate(180, cam.type === 'final' ? 285 : 258);
  c.scale(z, z);
  c.translate(-cx, -cy);
  if (exterior) {
    c.drawImage(assets.porch, 0, 0, 360, 640);
    roomAtmosphere(c, t, true);
  } else {
    c.save();
    if (light) c.filter = 'brightness(2.0) saturate(0.8)';
    c.drawImage(assets.room, 0, 0, 360, 640);
    c.restore();
    if (light) {
      const lamp = c.createRadialGradient(70, 285, 2, 70, 285, 230);
      lamp.addColorStop(0, '#f7b96935');
      lamp.addColorStop(1, '#f7b96900');
      c.fillStyle = lamp;
      c.fillRect(0, 0, 360, 640);
    } else {
      c.fillStyle = '#020718';
      c.globalAlpha = t >= 46 ? 0.3 : t >= 10 ? 0.12 : 0.08;
      c.fillRect(0, 0, 360, 640);
      c.globalAlpha = 1;
    }
    roomAtmosphere(c, t, false);
    // Moving ambiguous silhouette is deliberately not a literal monster.
    if (t >= 17.2 && t < 54.7) {
      c.save();
      c.globalAlpha = 0.25 + Math.sin(t * 2) * 0.04;
      c.fillStyle = '#080714';
      const x = 206 + Math.sin(t * 0.7) * 8;
      c.beginPath();
      c.moveTo(x - 27, 294);
      c.lineTo(x - 22, 244);
      c.lineTo(x - 11, 226);
      c.lineTo(x, 236);
      c.lineTo(x + 9, 229);
      c.lineTo(x + 22, 260);
      c.lineTo(x + 25, 295);
      c.closePath();
      c.fill();
      c.restore();
    }
    if (t >= 27.1 && t < 54.7) {
      const x = 202 + Math.sin(t * 0.7) * 3;
      const glow = c.createRadialGradient(x, 278, 1, x, 278, 14);
      glow.addColorStop(0, '#f53e5b22');
      glow.addColorStop(1, '#f53e5b00');
      c.fillStyle = glow;
      c.fillRect(x - 15, 263, 30, 30);
      c.fillStyle = '#b92b40';
      c.fillRect(Math.round(x - 7), 277, 4, 2);
      c.fillRect(Math.round(x + 4), 277, 4, 2);
      c.fillStyle = '#ff7981';
      c.fillRect(Math.round(x - 6), 277, 2, 1);
      c.fillRect(Math.round(x + 5), 277, 2, 1);
    }
  }
  if (exterior) {
    const laugh = lineAt(t, 'max');
    const collapse = inside(t, 64.1, 67.1);
    const p = collapse ? ease((t - 64.1) / 0.8) : 0;
    oval(c, 180, 475, 50, 8, '#0a101c');
    drawPerson(c, assets.atlas, {
      who: 'max',
      x: 180 + p * 105,
      y: 300 + p * 145,
      scale: 0.87,
      frame: f,
      time: t,
      emotion: 'laugh',
      pose: 'laugh',
      look: -1,
      tilt: Math.sin(t * 14) * 7,
      light: true,
      phone: true,
      rotation: p * 68,
    });
    if (laugh) {
      c.fillStyle = '#d9ba7a';
      for (let i = 0; i < 3; i++)
        pixelLine(c, 225 + i * 7, 325 - i * 8, 230 + i * 7, 321 - i * 8, '#d9ba7a', 1);
    }
  } else {
    let emotion: Emotion =
      t < 3.7
        ? 'curious'
        : t < 7.85
          ? 'amused'
          : t < 12
            ? 'nervous'
            : t < 27
              ? 'nervous'
              : t < 54.7
                ? 'fear'
                : t < 58
                  ? 'curious'
                  : t < 67.1
                    ? 'angry'
                    : t < 71.8
                      ? 'embarrassed'
                      : 'fear';
    const line = lineAt(t, 'bobo');
    if (line) emotion = line.emotion;
    const seated = t < 54.7;
    const rise = move(t, 54.7, 55.5, 226, 250);
    const jump =
      t >= 72.08
        ? Math.max(0, Math.sin(Math.min(1, (t - 72.08) / 1.9) * Math.PI)) * 88
        : 0;
    const anticipation = inside(t, 71.8, 72.08) ? move(t, 71.8, 72.08, 0, 7) : 0;
    const y = (seated ? 226 : rise) - jump + anticipation;
    const tilt = inside(t, 22.6, 25.1)
      ? move(t, 22.6, 25.1, 0, 14)
      : emotion === 'fear'
        ? Math.sin(t * 6) * 2
        : emotion === 'angry'
          ? -5
          : emotion === 'amused'
            ? Math.sin(t * 5) * 4
            : 0;
    const look =
      t < 12
        ? 1
        : inside(t, 12, 27)
          ? Math.round(Math.sin(t * 0.9) * 2)
          : t >= 58 && t < 67
            ? 2
            : 1;
    let pose: 'sit' | 'stand' | 'walk' | 'panic' | 'straighten' | 'jump' | 'phone' =
      seated ? 'sit' : 'stand';
    if (inside(t, 55.8, 56.65)) pose = 'walk';
    if (inside(t, 30, 46)) pose = 'phone';
    if (t >= 46 && t < 54.7) pose = 'panic';
    if (inside(t, 67.1, 71)) pose = 'straighten';
    if (jump > 5) pose = 'jump';
    const rear = cam.type === 'rear' || cam.type === 'eyes';
    if (!seated) oval(c, 145, 405, 35 - jump * 0.13, 6 - jump * 0.02, '#0d1020');
    // Vacuum returns from behind couch at the reveal, then approaches the SAME foot for the final beat.
    if (light) {
      const vx = move(t, 71, 72.08, 228, 167);
      vacuum(c, vx, inside(t, 71, 72.08) ? 402 : 405, t, true);
    }
    drawPerson(c, assets.atlas, {
      who: 'bobo',
      x: move(t, 55.8, 56.65, 145, 151),
      y,
      scale: 0.78,
      frame: f,
      time: t,
      emotion,
      pose,
      look,
      tilt,
      rear,
      light,
      phone: jump < 5,
    });
    if (jump > 5) {
      c.save();
      c.translate(173 + move(t, 72.08, 73.4, 0, 30), 308 - jump * 0.45);
      c.rotate((t - 72.08) * 5);
      drawPhone(c, 0, 0, f);
      c.restore();
    }
    if (rear) {
      // Foreground shoulder produces a genuine over-the-shoulder view.
      c.fillStyle = '#080b15';
      c.globalAlpha = 0.6;
      c.fillRect(69, 286, 33, 92);
      c.globalAlpha = 1;
    }
    if (!light && cam.type !== 'phone') {
      const glow = c.createRadialGradient(164, y + 53, 2, 164, y + 53, 33);
      glow.addColorStop(0, '#9bcdf919');
      glow.addColorStop(1, '#8cb8f000');
      c.fillStyle = glow;
      c.fillRect(124, y + 13, 80, 80);
    }
  }
  c.restore();
  // Pixel-grid vignette keeps the image readable while hiding hard room edges in close-ups.
  const vig = c.createRadialGradient(180, 260, 130, 180, 310, 410);
  vig.addColorStop(0, '#01051500');
  vig.addColorStop(1, '#010411bb');
  c.fillStyle = vig;
  c.fillRect(0, 0, 360, 640);
}
