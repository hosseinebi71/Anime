import { face, oval } from './face';
import { mouthAt, type Emotion, type Person } from '../story';
export interface Actor {
  who: Person;
  x: number;
  y: number;
  scale: number;
  frame: number;
  time: number;
  emotion: Emotion;
  pose: 'sit' | 'stand' | 'walk' | 'panic' | 'phone' | 'straighten' | 'jump' | 'laugh';
  look: number;
  tilt?: number;
  rear?: boolean;
  light?: boolean;
  phone?: boolean;
  rotation?: number;
}
const radians = (d: number) => (d * Math.PI) / 180;
export function drawPerson(
  c: CanvasRenderingContext2D,
  atlas: HTMLCanvasElement,
  p: Actor,
) {
  const sprite = document.createElement('canvas');
  sprite.width = 220;
  sprite.height = 300;
  const s = sprite.getContext('2d')!;
  s.imageSmoothingEnabled = false;
  s.translate(110, 40);
  const ox = p.who === 'bobo' ? 510 : 1042;
  const crop = (
    sx: number,
    sy: number,
    w: number,
    h: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
  ) =>
    s.drawImage(
      atlas,
      sx,
      sy,
      w,
      h,
      Math.round(dx),
      Math.round(dy),
      Math.round(dw),
      Math.round(dh),
    );
  const walk = p.pose === 'walk' ? Math.sin(p.frame * 0.27) : 0;
  const sit = p.pose === 'sit' || p.pose === 'phone';
  const laughing = p.pose === 'laugh';
  const tremble =
    p.emotion === 'fear' || p.emotion === 'nervous' || p.emotion === 'scream'
      ? Math.round(Math.sin(p.frame * 1.8) * (p.emotion === 'scream' ? 2 : 1))
      : 0;
  s.translate(tremble, walk ? -Math.abs(walk) * 2 : 0);
  // Two independently articulated thigh/calf chains. Sitting shortens the thigh; feet keep acting.
  for (let i = 0; i < 2; i++) {
    const side = i ? -1 : 1;
    const hip = i ? 16 : -16;
    s.save();
    s.translate(hip, 119);
    s.rotate(radians(walk * side * 21));
    crop(ox + (i ? 4 : -119), 614, 116, 202, -12, 0, 24, sit ? 17 : 39);
    s.translate(0, sit ? 15 : 36);
    s.rotate(radians(walk * side * -12 + (sit ? Math.sin(p.frame * 0.05 + i) * 3 : 0)));
    crop(ox + (i ? 0 : -195), 800, 195, 200, i ? -2 : -36, 0, 39, 40);
    s.restore();
  }
  const left = p.phone
    ? -100
    : p.pose === 'jump'
      ? 140
      : p.pose === 'panic'
        ? 135
        : p.pose === 'straighten'
          ? -45
          : walk * 17;
  const right =
    p.pose === 'jump'
      ? -140
      : p.pose === 'panic'
        ? -130
        : p.pose === 'straighten'
          ? 45
          : walk * -17 + (laughing ? -55 : 0);
  const arm = (isRight: boolean, angle: number) => {
    s.save();
    s.translate(isRight ? 29 : -30, 76);
    s.rotate(radians(angle));
    crop(ox + (isRight ? 87 : -239), 365, 150, 330, isRight ? -10 : -18, -2, 30, 66);
    s.restore();
  };
  arm(false, left);
  arm(true, right);
  s.save();
  const breath = Math.sin(p.frame * 0.06) * 0.004;
  s.translate(0, 118);
  s.scale(1 + breath, 1 - breath);
  s.translate(0, -118);
  crop(ox - 139, 320, 278, 310, -28, 59, 56, 62);
  if (p.rear) {
    s.fillStyle = '#1a2439';
    s.fillRect(-27, 65, 54, 57);
    s.fillStyle = '#344056';
    s.fillRect(-23, 72, 46, 49);
    s.fillStyle = '#151b2a';
    s.fillRect(-19, 92, 38, 24);
    s.fillStyle = '#586074';
    s.fillRect(-16, 91, 30, 2);
    s.fillStyle = '#677081';
    s.fillRect(-25, 69, 4, 35);
    s.fillRect(21, 69, 4, 35);
  }
  s.restore();
  // The holding forearm is a foreground layer; the torso must not hide the wrist.
  if (p.phone) {
    s.save();
    s.translate(-30, 76);
    s.rotate(radians(-100));
    crop(ox - 239, 530, 150, 165, -18, 31, 30, 33);
    s.restore();
  }
  s.save();
  s.translate(0, 61);
  s.rotate(
    radians(
      (p.tilt ?? 0) +
        Math.sin(p.frame * 0.04) * 0.7 +
        (laughing ? Math.sin(p.frame * 0.35) * 5 : 0),
    ),
  );
  s.translate(0, -61);
  crop(ox - 195, 20, 390, 330, -39, -4, 78, 66);
  if (p.rear) {
    s.fillStyle = '#141a2b';
    s.beginPath();
    s.moveTo(-29, 25);
    s.lineTo(-27, 45);
    s.lineTo(-16, 57);
    s.lineTo(17, 57);
    s.lineTo(30, 43);
    s.lineTo(28, 22);
    s.closePath();
    s.fill();
    s.fillStyle = '#20283b';
    s.fillRect(-22, 30, 8, 16);
    s.fillRect(10, 35, 9, 17);
  } else
    face(s, {
      who: p.who,
      emotion: p.emotion,
      frame: p.frame,
      mouth: mouthAt(p.time, p.who),
      look: p.look,
      flush: p.emotion === 'angry' ? 1 : 0,
    });
  s.restore();
  if (!p.light) {
    s.save();
    s.globalCompositeOperation = 'source-atop';
    s.globalAlpha = 0.35;
    s.fillStyle = '#06132c';
    s.fillRect(-110, -40, 220, 300);
    s.restore();
    if (p.phone) {
      s.save();
      s.globalCompositeOperation = 'source-atop';
      s.globalAlpha = 0.13;
      oval(s, 7, 43, 33, 25, '#8ecce4');
      s.restore();
    }
  }
  if (p.phone) {
    drawPhone(s, 25, 58, p.frame);
    s.fillStyle = p.light ? '#eda88c' : '#899eab';
    s.fillRect(24, 70, 4, 6);
    s.fillRect(28, 75, 6, 2);
    s.fillStyle = p.light ? '#be766c' : '#526a7d';
    s.fillRect(24, 75, 4, 2);
  }
  c.save();
  c.translate(Math.round(p.x), Math.round(p.y));
  c.scale(p.scale, p.scale);
  c.rotate(radians(p.rotation ?? 0));
  c.drawImage(sprite, -110, -40);
  c.restore();
}
export function drawPhone(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
) {
  c.fillStyle = '#080d19';
  c.fillRect(x, y, 12, 21);
  c.fillStyle = '#85869c';
  c.fillRect(x + 1, y + 1, 10, 19);
  c.fillStyle = '#a1d3e6';
  c.fillRect(x + 2, y + 2, 8, 16);
  c.fillStyle = '#293a53';
  c.fillRect(x + 5, y + 1, 3, 1);
  c.fillStyle = '#ecf9f1';
  c.fillRect(x + 3, y + 6, 6, 3);
  c.fillStyle = '#588195';
  c.fillRect(x + 3, y + 11, 5, 1);
}
