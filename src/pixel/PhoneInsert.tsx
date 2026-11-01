import React from 'react';
import { lineAt } from './story';
export function PhoneInsert({ time: t }: { time: number }) {
  const call = t >= 30;
  const answered = t >= 31.55;
  const text =
    t < 7.85
      ? "DON'T LOOK\nBEHIND YOU."
      : t < 20
        ? "I'M NOT MAX."
        : t < 25.1
          ? "IT'S RIGHT\nBEHIND YOU."
          : "DON'T TURN\nAROUND!!!";
  const received = t < 7.85 ? 0.65 : t < 20 ? 7.85 : t < 25.1 ? 20 : t < 30 ? 25.1 : 30;
  const vibration =
    Math.sin((t - received) * 100) * (t >= received && t - received < 0.5 ? 3 : 0);
  const speaker = lineAt(t, 'max');
  return (
    <div
      data-testid="phone-insert"
      style={{
        position: 'absolute',
        inset: 0,
        background: '#03061165',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 125,
      }}
    >
      <div
        style={{
          width: 680,
          height: 1080,
          background: '#0c1220',
          border: '12px solid #485269',
          boxShadow: '0 0 0 10px #050813,0 25px 60px #000b',
          clipPath:
            'polygon(4% 0,96% 0,96% 2%,100% 2%,100% 98%,96% 98%,96% 100%,4% 100%,4% 98%,0 98%,0 2%,4% 2%)',
          transform: `translateX(${vibration}px) rotate(-3deg)`,
          padding: '35px 43px',
          fontFamily: 'Arial,sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 27,
            color: '#c9d1da',
            fontFamily: 'monospace',
          }}
        >
          <span>3:03</span>
          <span>▮▮▮ ▰</span>
        </div>
        <div
          style={{
            height: 6,
            width: 130,
            background: '#04070e',
            margin: '-20px auto 90px',
          }}
        />
        {call ? (
          <>
            <div
              style={{
                fontSize: 25,
                letterSpacing: 7,
                color: '#8fa3bb',
                textAlign: 'center',
              }}
            >
              {answered ? 'VOICE CALL' : 'INCOMING CALL'}
            </div>
            <div
              style={{
                textAlign: 'center',
                fontSize: 100,
                fontWeight: 900,
                color: '#e8b97c',
                marginTop: 45,
              }}
            >
              MAX
            </div>
            <div
              style={{
                textAlign: 'center',
                fontSize: 30,
                color: '#9aaec7',
                marginTop: 20,
              }}
            >
              {answered
                ? 'CONNECTED · 00:' +
                  String(Math.max(0, Math.floor(t - 31.55))).padStart(2, '0')
                : 'Your favorite bad influence'}
            </div>
            <div
              style={{
                height: 150,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 15,
                marginTop: 100,
              }}
            >
              {Array.from({ length: 13 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: 12,
                    height: speaker ? 20 + Math.abs(Math.sin(t * 14 + i * 1.4)) * 110 : 8,
                    background: '#b1c5da',
                  }}
                />
              ))}
            </div>
            <div
              style={{
                width: 130,
                height: 105,
                margin: '110px auto',
                background: answered ? '#b54c5d' : '#638d78',
                display: 'grid',
                placeItems: 'center',
                fontSize: 62,
                color: '#faf0dd',
              }}
            >
              ⌕
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                fontSize: 25,
                letterSpacing: 5,
                color: '#a4abc4',
                marginBottom: 17,
              }}
            >
              UNKNOWN SENDER
            </div>
            <div
              style={{
                fontSize: 28,
                color: '#6e7f9b',
                paddingBottom: 35,
                borderBottom: '2px solid #354057',
              }}
            >
              No caller ID · just now
            </div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                lineHeight: 1.3,
                color: t >= 25.1 ? '#f59da5' : '#dbe4f0',
                whiteSpace: 'pre-line',
                padding: '45px 30px',
                marginTop: 70,
                background: '#222c43',
                borderLeft: '5px solid #727f9f',
              }}
            >
              {text}
            </div>
            <div
              style={{
                fontSize: 25,
                color: '#667994',
                marginTop: 25,
                textAlign: 'right',
              }}
            >
              DELIVERED ✓✓
            </div>
            <div
              style={{
                marginTop: 150,
                border: '2px solid #3d4962',
                color: '#56637b',
                fontSize: 29,
                padding: '24px 20px',
              }}
            >
              Type a message…
            </div>
          </>
        )}
      </div>
    </div>
  );
}
