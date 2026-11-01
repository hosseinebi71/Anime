import type { Emotion, Person } from '../story';
export function oval(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  color: string,
) {
  c.fillStyle = color;
  for (let row = -Math.ceil(ry); row <= ry; row++) {
    const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (row * row) / (ry * ry))));
    c.fillRect(Math.round(x - w), Math.round(y + row), w * 2 + 1, 1);
  }
}
export function pixelLine(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  x2: number,
  y2: number,
  color: string,
  width = 1,
) {
  let dx = Math.abs(x2 - x),
    sx = x < x2 ? 1 : -1,
    dy = -Math.abs(y2 - y),
    sy = y < y2 ? 1 : -1,
    e = dx + dy;
  c.fillStyle = color;
  for (;;) {
    c.fillRect(x, y, width, width);
    if (x === x2 && y === y2) break;
    const e2 = 2 * e;
    if (e2 >= dy) {
      e += dy;
      x += sx;
    }
    if (e2 <= dx) {
      e += dx;
      y += sy;
    }
  }
}
export function face(
  c: CanvasRenderingContext2D,
  p: {
    who: Person;
    emotion: Emotion;
    frame: number;
    mouth: number;
    look: number;
    flush?: number;
  },
) {
  const fear = p.emotion === 'fear' || p.emotion === 'scream',
    angry = p.emotion === 'angry',
    laugh = p.emotion === 'laugh' || p.emotion === 'amused';
  const skin = p.flush ? '#f28d83' : '#f5ad8d',
    ink = '#171b2a';
  c.fillStyle = skin;
  c.beginPath();
  c.moveTo(-17, 34);
  c.lineTo(-12, 30);
  c.lineTo(13, 30);
  c.lineTo(18, 35);
  c.lineTo(15, 49);
  c.lineTo(-14, 49);
  c.closePath();
  c.fill();
  c.fillStyle = '#de887b';
  c.fillRect(-16, 43, 3, 7);
  c.fillRect(14, 42, 3, 7);
  c.fillStyle = '#ffc79b';
  c.fillRect(-2, 32, 5, 12);
  const blink = (p.frame + (p.who === 'max' ? 43 : 0)) % 163 < 5;
  for (const [i, x] of [-9, 9].entries()) {
    const rx = fear ? 7 : 5,
      ry = fear ? 9 : 7;
    if (blink || laugh) {
      pixelLine(c, x - 5, 40, x, 38, ink, 2);
      pixelLine(c, x, 38, x + 5, 41, ink, 2);
    } else {
      oval(c, x, 40, rx + 1, ry + 1, '#9c6264');
      oval(c, x, 39, rx, ry, '#fff2dc');
      oval(c, x + Math.round(p.look), 40, fear ? 2 : 3, fear ? 4 : 5, ink);
      c.fillStyle = '#fff';
      c.fillRect(x + Math.round(p.look) - 1, 36, 2, 2);
    }
    const outer = x + (i ? 6 : -6),
      inner = x + (i ? -5 : 5);
    if (angry) {
      pixelLine(c, outer, 29, inner, 33, ink, 3);
    } else if (fear) {
      pixelLine(c, x - 5, 28, x, 25, ink, 2);
      pixelLine(c, x, 25, x + 5, 28, ink, 2);
    } else {
      pixelLine(c, x - 5, 31 + (i ? 0 : -1), x + 5, 30 + (i ? 0 : 1), ink, 2);
    }
  }
  // The nose remains a fixed identity landmark while eyes and mouth act independently.
  c.fillStyle = '#d78275';
  c.fillRect(0, 44, 4, 3);
  c.fillStyle = '#ffcba0';
  c.fillRect(0, 43, 3, 2);
  c.fillStyle = skin;
  c.fillRect(-8, 49, 17, 10);
  c.fillStyle = '#e49380';
  c.fillRect(-6, 58, 12, 1);
  if (p.mouth > 0.03 || p.emotion === 'scream') {
    const m = p.emotion === 'scream' ? 1 : p.mouth;
    const h = 3 + Math.round(m * 7);
    oval(c, 0, 53, 3 + Math.round(m * 3), h / 2, ink);
    c.fillStyle = '#f18b99';
    c.fillRect(-2, 54 + Math.floor(h / 4), 5, 2);
    if (angry || laugh) {
      c.fillStyle = '#ffefd2';
      c.fillRect(-4, 50, 8, 2);
    }
  } else if (laugh) {
    oval(c, 0, 52, 7, 4, ink);
    c.fillStyle = '#fff2dc';
    c.fillRect(-5, 49, 11, 2);
    c.fillStyle = '#f78b94';
    c.fillRect(-2, 54, 6, 2);
  } else if (fear) {
    oval(c, 0, 53, 3, 4, ink);
  } else if (angry) {
    c.fillStyle = ink;
    c.fillRect(-7, 51, 14, 5);
    c.fillStyle = '#fff1d1';
    c.fillRect(-5, 52, 10, 2);
  } else if (p.emotion === 'curious') {
    pixelLine(c, -4, 53, 4, 52, ink, 1);
  } else {
    pixelLine(c, -5, 53, 4, 53, ink, 1);
  }
  if (p.who === 'max') {
    c.strokeStyle = ink;
    c.lineWidth = 2;
    c.strokeRect(-17, 33, 14, 14);
    c.strokeRect(3, 33, 14, 14);
    c.fillStyle = ink;
    c.fillRect(-3, 37, 6, 2);
    c.fillRect(-21, 35, 5, 2);
    c.fillRect(17, 35, 5, 2);
    c.fillStyle = '#d5eff8';
    c.fillRect(-15, 34, 4, 1);
    c.fillRect(5, 34, 4, 1);
  }
  if (p.emotion === 'nervous' || p.emotion === 'fear') {
    c.fillStyle = '#8cc6e6';
    const y = 41 + Math.floor((p.frame % 35) / 9);
    c.fillRect(20, y, 2, 4);
    c.fillRect(19, y + 4, 3, 2);
  }
}
