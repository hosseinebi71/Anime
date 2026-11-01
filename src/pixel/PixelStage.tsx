import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cancelRender, continueRender, delayRender, staticFile } from 'remotion';
import { drawPerson, type Actor } from './characters/PixelRig';
import { drawWorld, type Assets } from './scenes/world';
export const PixelStage: React.FC<{
  time: number;
  portrait?: Omit<Actor, 'frame' | 'time' | 'x' | 'y' | 'scale'>;
}> = ({ time, portrait }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [assets, setAssets] = useState<Assets | null>(null);
  const [handle] = useState(() => delayRender('Load pixel production assets'));
  const released = useRef(false);
  useEffect(() => {
    const load = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Missing production asset: ' + src));
        image.src = staticFile(src);
      });
    Promise.all([
      load('pixel/living-room.png'),
      load('pixel/porch.png'),
      load('pixel/character-atlas.png'),
    ])
      .then(([room, porch, sprites]) => {
        const atlas = document.createElement('canvas');
        atlas.width = sprites.width;
        atlas.height = sprites.height;
        const c = atlas.getContext('2d')!;
        c.drawImage(sprites, 0, 0);
        const data = c.getImageData(0, 0, atlas.width, atlas.height);
        // Alpha-test generated atlas edges. Resampling occurs ONLY on the shared pixel grid.
        for (let i = 3; i < data.data.length; i += 4)
          data.data[i] = data.data[i] > 235 ? 255 : 0;
        c.putImageData(data, 0, 0);
        setAssets({ room, porch, atlas });
      })
      .catch(cancelRender);
  }, []);
  useLayoutEffect(() => {
    if (!assets || !ref.current) return;
    const c = ref.current.getContext('2d')!;
    if (portrait) {
      c.imageSmoothingEnabled = false;
      c.fillStyle = '#152136';
      c.fillRect(0, 0, 360, 640);
      c.save();
      c.globalAlpha = 0.2;
      c.drawImage(assets.room, 0, 0, 360, 640);
      c.restore();
      drawPerson(c, assets.atlas, {
        ...portrait,
        x: 180,
        y: 145,
        scale: 1.8,
        frame: Math.round(time * 30),
        time,
        light: true,
      });
    } else drawWorld(c, assets, time);
    if (!released.current) {
      released.current = true;
      continueRender(handle);
    }
  }, [assets, time, handle, portrait]);
  return (
    <canvas
      ref={ref}
      width={360}
      height={640}
      data-testid="pixel-stage"
      data-ready={!!assets}
      aria-label="Animated pixel-art scene"
      style={{
        width: '100%',
        height: '100%',
        imageRendering: 'pixelated',
        position: 'absolute',
        inset: 0,
      }}
    />
  );
};
