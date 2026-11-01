import React, { useEffect, useRef, useState } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { useCurrentFrame } from 'remotion';
import { PixelHorrorEpisode } from './pixel/Episode';
import { PixelStage } from './pixel/PixelStage';
import {
  scenes,
  DURATION,
  FPS,
  lines,
  FILM,
  type Person,
  type Emotion,
} from './pixel/story';
import type { Actor } from './pixel/characters/PixelRig';
import './style.css';
import './pixel-studio.css';
const tc = (f: number) =>
  `${String(Math.floor(f / 30 / 60)).padStart(2, '0')}:${String(Math.floor(f / 30) % 60).padStart(2, '0')}`;
const thumbs = ['message', 'scratch', 'max-call', 'vacuum', 'max-prank', 'freeze'];
function ActorDemo({
  who,
  emotion,
  pose,
}: {
  who: Person;
  emotion: Emotion;
  pose: Actor['pose'];
}) {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const cue = who === 'bobo' ? 4.6 + (t % 2.8) : 58.35 + (t % 2.1);
  return (
    <PixelStage
      time={cue}
      portrait={{
        who,
        emotion,
        pose,
        phone: pose === 'phone' || pose === 'sit',
        look: Math.round(Math.sin(t) * 2),
        tilt: Math.sin(t * 0.8) * 3,
      }}
    />
  );
}
export default function PixelStudio() {
  const player = useRef<PlayerRef>(null);
  const [tab, setTab] = useState('Episode');
  const [frame, setFrame] = useState(150);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [who, setWho] = useState<Person>('bobo');
  const [emotion, setEmotion] = useState<Emotion>('fear');
  const [pose, setPose] = useState<Actor['pose']>('phone');
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const p = player.current;
    if (!p) return;
    setFrame(p.getCurrentFrame());
    const update = ({ detail }: { detail: { frame: number } }) => setFrame(detail.frame);
    const play = () => setPlaying(true),
      pause = () => setPlaying(false);
    p.addEventListener('frameupdate', update);
    p.addEventListener('play', play);
    p.addEventListener('pause', pause);
    return () => {
      p.removeEventListener('frameupdate', update);
      p.removeEventListener('play', play);
      p.removeEventListener('pause', pause);
      setPlaying(false);
    };
  }, [tab]);
  const seek = (f: number) => {
    player.current?.seekTo(f);
    setFrame(f);
  };
  const active = scenes.find((s) => frame >= s.start && frame < s.end) ?? scenes[0];
  return (
    <div className="app pixel-app">
      <aside className="sidebar">
        <a href="#" className="brand" onClick={() => setTab('Episode')}>
          <span className="pixel-brand">BM</span>
          <span>
            bobo & max<span className="brand-sub">AFTER DARK ORIGINALS</span>
          </span>
        </a>
        <div className="workspace-label">THE SCREENING ROOM</div>
        <nav>
          {[
            ['Episode', '▤'],
            ['Characters', '♧'],
            ['Production', '▥'],
          ].map(([label, icon]) => (
            <button
              key={label}
              onClick={() => setTab(label)}
              className={`nav-item ${tab === label ? 'active' : ''}`}
            >
              <span aria-hidden="true">{icon}</span>
              {label}
              {label === 'Episode' && <small>001</small>}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <div className="eyebrow">A LITTLE FEAR. A LOT OF REGRET.</div>
          <p>
            Don’t trust the dark.
            <br />
            Or your best friend.
          </p>
          <img
            src="/pixel/stills/max-prank.png"
            alt="Human pixel-art Max laughing outside the window"
          />
        </div>
        <div className="sidebar-footer">
          <span className="avatar">A</span>
          <div>
            AFTER DARK<small>INDEPENDENT PIXEL ANIMATION</small>
          </div>
        </div>
      </aside>
      <main>
        <header>
          <div className="breadcrumb">
            After Dark <span>/</span>
            <strong>{tab === 'Episode' ? 'Don’t look behind you' : tab}</strong>
          </div>
          <div className="header-right">
            <span className="local">
              <i />
              Original art · Original sound
            </span>
            <span className="small-chip">1080 × 1920 / 30 FPS</span>
          </div>
        </header>
        <div className="content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                A BOBO & MAX SHORT <span>•</span> HORROR / COMEDY
              </div>
              <h1>
                {tab === 'Episode'
                  ? 'Don’t look behind you.'
                  : tab === 'Characters'
                    ? 'Two friends. Very different survival instincts.'
                    : 'The making of a very bad night.'}
              </h1>
              <p>
                {tab === 'Episode'
                  ? '3:03 AM. An unknown sender. The house is not as empty as it seems.'
                  : tab === 'Characters'
                    ? 'Human pixel rigs. Layered acting. Absolutely no composure.'
                    : 'One shared clock. Six scenes. A carefully timed loss of dignity.'}
              </p>
            </div>
            <span className="project-badge">EPISODE 001 · AFTER DARK</span>
          </div>
          {tab === 'Episode' ? (
            <>
              <div className="studio-grid">
                <section className="preview-panel">
                  <div className="panel-top">
                    <div>
                      <span className="green-dot" /> FILM PREVIEW{' '}
                      <span className="preview-scene">
                        / {active.title.toUpperCase()}
                      </span>
                    </div>
                    <span>75 SECONDS / STEREO</span>
                  </div>
                  <div className="preview-stage">
                    <div className="stage-label left">
                      UNKNOWN SENDER.
                      <br />
                      VERY BAD TIMING.<span>03:03 AM</span>
                    </div>
                    <div className="phone">
                      <Player
                        ref={player}
                        component={PixelHorrorEpisode}
                        inputProps={{ showCaptions: captions, audioEnabled: true }}
                        durationInFrames={DURATION}
                        fps={FPS}
                        compositionWidth={1080}
                        compositionHeight={1920}
                        initialFrame={150}
                        initiallyMuted={muted}
                        loop
                        controls={false}
                        style={{ width: '100%', height: '100%' }}
                        acknowledgeRemotionLicense
                      />
                    </div>
                    <div className="stage-label right">
                      <span className="hand-star">☾</span>
                      <em>
                        Some things
                        <br />
                        are better left unseen.
                      </em>
                      <span>ESPECIALLY MAX’S JOKES.</span>
                    </div>
                  </div>
                  <div className="transport">
                    <button
                      className="play"
                      aria-label={playing ? 'Pause film' : 'Play film'}
                      onClick={() =>
                        playing ? player.current?.pause() : player.current?.play()
                      }
                    >
                      {playing ? 'Ⅱ' : '▶︎'}
                    </button>
                    <span className="time">
                      {tc(frame)} <span>/ 01:15</span>
                    </span>
                    <input
                      aria-label="Film timeline"
                      type="range"
                      min="0"
                      max="2249"
                      value={frame}
                      onChange={(e) => seek(Number(e.target.value))}
                    />
                    <button
                      className="restart"
                      aria-label="Restart film"
                      onClick={() => seek(0)}
                    >
                      ↺
                    </button>
                    <button
                      className="sound-button"
                      aria-label={muted ? 'Unmute sound' : 'Mute sound'}
                      onClick={() => {
                        if (muted) player.current?.unmute();
                        else player.current?.mute();
                        setMuted(!muted);
                      }}
                    >
                      {muted ? '◌' : '♫'}
                    </button>
                  </div>
                  <div className="audio-strip">
                    <span>ORIGINAL HORROR-COMEDY SOUNDTRACK</span>
                    <div className="waveform">
                      {Array.from({ length: 40 }, (_, i) => (
                        <i
                          key={i}
                          style={{
                            height: 4 + Math.abs(Math.sin(i * 2.19)) * 13,
                            opacity: frame / 2250 > i / 40 ? 1 : 0.3,
                          }}
                        />
                      ))}
                    </div>
                    <span>FICTIONAL VOICES · FOLEY · SCORE</span>
                  </div>
                </section>
                <aside className="episode-panel">
                  <div className="detail-heading">
                    <span className="eyebrow">NO SIGNAL. NO COMPOSURE.</span>
                    <h2>
                      Don’t look
                      <br />
                      behind you<span>.</span>
                    </h2>
                    <p>
                      Bobo is home alone.
                      <br />
                      Max has a terrible sense of humor.
                    </p>
                  </div>
                  <div className="specs">
                    <div>
                      <small>RUNNING TIME</small>
                      <strong>75 seconds</strong>
                    </div>
                    <div>
                      <small>PICTURE + SOUND</small>
                      <strong>H.264 + AAC</strong>
                    </div>
                    <div>
                      <small>THE STORY</small>
                      <strong>6 scenes · 34 shots</strong>
                    </div>
                    <div>
                      <small>THE PERFORMANCE</small>
                      <strong>{lines.length} voiced phrases</strong>
                    </div>
                  </div>
                  <div className="cast-heading">
                    STARRING <span>TWO TERRIBLE LIARS</span>
                  </div>
                  <div className="pixel-cast">
                    <img
                      src="/pixel/stills/dignity.png"
                      alt="Human Bobo in his dark jacket and gray hoodie"
                    />
                    <div>
                      <b>Bobo</b>
                      <p>Bravery: pending.</p>
                    </div>
                  </div>
                  <div className="pixel-cast">
                    <img
                      src="/pixel/stills/max-prank.png"
                      alt="Max with glasses, brown hair and orange jacket"
                    />
                    <div>
                      <b>Max</b>
                      <p>Trustworthiness: absolutely not.</p>
                    </div>
                  </div>
                  <label className="caption-toggle">
                    <div>
                      English subtitles<small>Matched to every fictional phrase.</small>
                    </div>
                    <input
                      type="checkbox"
                      checked={captions}
                      onChange={(e) => setCaptions(e.target.checked)}
                    />
                    <span className={captions ? 'switch on' : 'switch'} />
                  </label>
                  <a className="export-button" href={`/renders/${FILM}.mp4`} download>
                    ↓ Download the film <span>MP4 ↗</span>
                  </a>
                  <button
                    className="render-command"
                    onClick={async () => {
                      await navigator.clipboard.writeText('npm run render:pixel');
                      setCopied(true);
                    }}
                  >
                    {copied ? 'Copied: npm run render:pixel' : 'Copy render command'}
                    <span>⌘</span>
                  </button>
                  <div className="export-note">
                    Original art. Fictional voices. Real consequences.
                  </div>
                  <a className="soundtrack-link" href="/pixel/audio/episode.wav" download>
                    Download original soundtrack ↗
                  </a>
                </aside>
              </div>
              <section className="storyboard">
                <div className="section-heading">
                  <h3>
                    A quiet night, in six increasingly bad decisions{' '}
                    <span>STORYBOARD</span>
                  </h3>
                  <span>CLICK A SCENE TO SEEK</span>
                </div>
                <div className="scene-grid">
                  {scenes.map((s, i) => (
                    <button
                      key={s.title}
                      className={`scene-card ${active === s ? 'selected' : ''}`}
                      onClick={() => seek([60, 459, 969, 1701, 1776, 2079][i])}
                    >
                      <div className="scene-art">
                        <img src={`/pixel/stills/${thumbs[i]}.png`} alt="" />
                        <span className="scene-number">0{i + 1}</span>
                      </div>
                      <div className="scene-info">
                        <div>
                          <b>{s.title}</b>
                          <span>
                            {tc(s.start)} — {tc(s.end)}
                          </span>
                        </div>
                        <p>{s.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
              <div className="bottom-note">
                <span>One unknown number. One deeply known idiot.</span>
                <span>CRISP PIXELS / SHARP TIMING / ORIGINAL SOUND</span>
              </div>
            </>
          ) : tab === 'Characters' ? (
            <section className="character-lab">
              <div className="lab-stage">
                <Player
                  key={`${who}-${emotion}-${pose}`}
                  component={ActorDemo}
                  inputProps={{ who, emotion, pose }}
                  fps={30}
                  durationInFrames={180}
                  compositionWidth={360}
                  compositionHeight={640}
                  autoPlay
                  loop
                  style={{ width: '100%' }}
                  acknowledgeRemotionLicense
                />
              </div>
              <div className="lab-controls">
                <div className="eyebrow">THE PIXEL PERFORMANCE LAB</div>
                <h2>Meet the people under the panic.</h2>
                <p>
                  Individual heads, facial features, torsos, arms and leg chains. One
                  shared pixel grid. Consistent character designs in every shot.
                </p>
                <h4>Character</h4>
                <div className="pills">
                  {(['bobo', 'max'] as const).map((n) => (
                    <button
                      key={n}
                      className={who === n ? 'chosen' : ''}
                      onClick={() => setWho(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <h4>Expression</h4>
                <div className="pills">
                  {(
                    [
                      'curious',
                      'amused',
                      'nervous',
                      'fear',
                      'angry',
                      'laugh',
                      'embarrassed',
                    ] as const
                  ).map((e) => (
                    <button
                      key={e}
                      className={emotion === e ? 'chosen' : ''}
                      onClick={() => setEmotion(e)}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <h4>Performance</h4>
                <div className="pills">
                  {(
                    [
                      'stand',
                      'walk',
                      'sit',
                      'phone',
                      'panic',
                      'straighten',
                      'jump',
                      'laugh',
                    ] as const
                  ).map((p) => (
                    <button
                      key={p}
                      className={pose === p ? 'chosen' : ''}
                      onClick={() => setPose(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <p className="lab-note">
                  The lab previews acting shapes. Film mouths follow the exact synthesized
                  syllable schedule.
                </p>
              </div>
            </section>
          ) : (
            <section className="guide">
              <div className="eyebrow">EPISODE 002 STARTS HERE</div>
              <h2>The art of a very specific scare.</h2>
              <p>
                Every shot has a purpose. The phone supplies the threat, the framing hides
                its source, and the sound leads the audience to the wrong conclusion.
              </p>
              {[
                [
                  '01',
                  'Write the next misadventure',
                  'src/pixel/story.ts',
                  'Define story beats, purposeful shots, messages, emotional dialogue and effects. Syllable metadata is shared by synthesized voices and mouth shapes.',
                ],
                [
                  '02',
                  'Direct a real performance',
                  'src/pixel/scenes/world.ts',
                  'Reuse the layered human rigs, camera helpers, facial states and pixel grid. Stage actions and choose eyelines; leave breathing room for the punchline.',
                ],
                [
                  '03',
                  'Build the soundscape',
                  'npm run audio:pixel',
                  'With the studio running, bake original voices, rain, heartbeat, scratching, phone effects, horror score and comedy sting to WAV.',
                ],
                [
                  '04',
                  'Inspect before export',
                  'npm run stills:pixel',
                  'Review the representative frames. Run npm run test:pixel, then npm run render:pixel and npm run validate:pixel. Final H.264 is normalized to yuv420p with fast-start metadata.',
                ],
              ].map(([n, h, cmd, d]) => (
                <article key={n}>
                  <span>{n}</span>
                  <div>
                    <h3>{h}</h3>
                    <code>{cmd}</code>
                    <p>{d}</p>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
