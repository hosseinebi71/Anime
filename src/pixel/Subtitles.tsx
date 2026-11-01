import React from 'react';
import { spring } from 'remotion';
import { lineAt, wordsFor } from './story';
export const HorrorSubtitles: React.FC<{ time: number }> = ({ time }) => {
  const l = lineAt(time);
  if (!l) return null;
  const accent = l.speaker === 'bobo' ? '#b0d2f2' : '#edbe86';
  return (
    <div
      data-testid="subtitles"
      data-speaker={l.speaker}
      style={{
        position: 'absolute',
        bottom: 250,
        left: 95,
        right: 145,
        textAlign: 'center',
        zIndex: 10,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          fontSize: 24,
          letterSpacing: 6,
          color: accent,
          fontWeight: 800,
          marginBottom: 18,
          textShadow: '0 3px 8px #02030b',
        }}
      >
        {l.speaker.toUpperCase()}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px 17px',
          justifyContent: 'center',
        }}
      >
        {wordsFor(l).map((w, i) => {
          const active = time >= w.start && time < w.end;
          const pop = active
            ? spring({
                frame: (time - w.start) * 30,
                fps: 30,
                config: { stiffness: 200, damping: 19 },
              })
            : 1;
          return (
            <span
              key={i}
              data-active={active}
              data-word={w.text}
              style={{
                fontWeight: 900,
                fontSize: l.text.length > 24 ? 61 : 68,
                lineHeight: 1.12,
                letterSpacing: -1.5,
                color: active || w.text === l.accent ? accent : '#f1eee5',
                transform: `translateY(${active ? (1 - pop) * 9 : 0}px) scale(${active ? 0.97 + pop * 0.055 : 1})`,
                WebkitTextStroke: '3px #080c16',
                paintOrder: 'stroke fill',
                textShadow: '0 4px 0 #070b16,0 8px 15px #000d',
              }}
            >
              {w.text}{' '}
            </span>
          );
        })}
      </div>
    </div>
  );
};
