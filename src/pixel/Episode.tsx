import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import { PixelStage } from './PixelStage';
import { HorrorSubtitles } from './Subtitles';
import { PhoneInsert } from './PhoneInsert';
import { cameraAt } from './camera/director';
export const PixelHorrorEpisode: React.FC<{
  showCaptions?: boolean;
  audioEnabled?: boolean;
}> = ({ showCaptions = true, audioEnabled = true }) => {
  const f = useCurrentFrame(),
    t = f / 30;
  const shot = cameraAt(Math.min(t, 73.4));
  return (
    <AbsoluteFill
      style={{
        background: '#060a16',
        overflow: 'hidden',
        fontFamily: 'Arial,sans-serif',
      }}
    >
      <PixelStage time={t} />
      {audioEnabled && <Audio src={staticFile('pixel/audio/episode.wav')} />}
      {shot.type === 'phone' && <PhoneInsert time={t} />}
      <div
        style={{
          position: 'absolute',
          left: 75,
          right: 120,
          top: 90,
          display: 'flex',
          justifyContent: 'space-between',
          color: '#a1b3c9',
          opacity: 0.8,
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: 4,
        }}
      >
        <span>BOBO & MAX</span>
        <span>{t < 54.7 ? '03:03 AM' : '03:04 AM'}</span>
      </div>
      {t < 0.65 && (
        <div
          style={{
            position: 'absolute',
            top: 260,
            left: 80,
            right: 130,
            fontSize: 39,
            color: '#a3bad3',
            letterSpacing: 4,
            fontWeight: 600,
          }}
        >
          ONE NEW MESSAGE.
        </div>
      )}
      {showCaptions && <HorrorSubtitles time={t} />}
      {t >= 73.4 && (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              border: '18px solid #c3cdd3',
              pointerEvents: 'none',
            }}
          />
          <div
            data-testid="freeze-title"
            style={{
              position: 'absolute',
              top: 1280,
              left: 65,
              right: 110,
              textAlign: 'center',
              transform: 'rotate(-5deg)',
              fontWeight: 950,
              fontSize: 100,
              lineHeight: 1,
              letterSpacing: -4,
              color: '#f0dec0',
              WebkitTextStroke: '3px #121728',
              paintOrder: 'stroke fill',
              textShadow: '7px 8px 0 #0d1325',
            }}
          >
            BRAVEST GUY
            <br />
            ALIVE 💀
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
