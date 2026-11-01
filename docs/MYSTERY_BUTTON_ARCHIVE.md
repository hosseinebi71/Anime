# Bobo & Max — The Mystery Button

An original 75-second animated comedy, made in the existing React + TypeScript + SVG + Remotion studio. **1080 × 1920 · 30 fps · H.264 video · stereo AAC audio.** No paid services, voice APIs, stock music or remote artwork are used.

Bobo is a curious blue optimist with no impulse control. Max is an orange square with excellent judgment and terrible luck. Episode 001 ends with Max as a very annoyed banana.

## Start the interactive studio

Node.js 22.12+ (tested with 24.19), npm, Chromium and FFmpeg are required.

```sh
cd /workspace/Anime
npm ci
npm run dev -- --port 5173
```

The **Episode** tab has playback, frame seeking, sound/mute, animated-subtitle visibility, seven clickable scenes and MP4/soundtrack downloads. Audio starts on a Play click to satisfy browser autoplay rules. The **Characters** tab is a reusable acting playground, including Banana Max. The **Guide** tab outlines the Episode 002 workflow.

```sh
npm run build         # TypeScript validation + production build
npm test              # 4 browser/timing integration tests; run Vite first
npm run studio        # Full Remotion timeline editor
npm run audio         # Generate voices, score, effects and mastered WAV; run Vite first
npm run still         # Full-size Banana Max poster
npm run stills        # Seven scene thumbnails and freeze-frame still
npm run render        # Full 75-second movie, with burned-in subtitles and AAC audio
npm run validate      # Decode the delivered video; verify streams, frames and each spoken word
npm run delivery      # Package an offline chapter-player HTML and portable source ZIP
```

The MP4 is `renders/mystery-button.mp4`. `npm run delivery` also creates `renders/interactive-preview.html`, a self-contained offline chapter player with a 540 × 960 preview proxy, and `renders/bobo-max-source.zip`. Download and open the HTML in a browser; it needs no server or Internet connection. `npm run test:delivery` checks its offline playback, seeking, sound-enabled media and mobile layout. The full-resolution MP4 remains the channel delivery. The original 15-second test remains available as the `HelloNeighbor` composition (`npm run render:legacy`); it uses the upgraded character rigs. `public/renders` links to the local output directory. Vite serves those exports and includes them in production builds. Outputs are local files; generating them does not upload or publish anything.

The cloud scripts use `/usr/bin/chromium`. On another machine, change the CLI browser path in `package.json`, or omit it to let Remotion install its supported browser. `CHROMIUM_PATH` selects a browser for the audio, stills and test scripts. Chromium and listening servers require escalated cloud execution when the sandbox prohibits their sockets. Keep the existing cloud proxy and TLS trust settings. Use the existing isolated checkout; do not create worktrees unless requested.

## The film

| Time | Story and performance |
| --- | --- |
| 0–8 s | Bobo discovers the red button; curious glances, a push-in and a button insert |
| 8–18 s | Max enters and emphatically warns Bobo; alternating reaction shots |
| 18–30 s | Sneaking, negotiation, a reach, anticipation, and the inevitable press |
| 30–42 s | Impact, flickering lights, camera shake, a swirling portal and Max's suction exit |
| 42–55 s | An awkward silence, frantic searching, peeking under the controls, another bad idea |
| 55–65 s | Magical return; Banana Max is not enjoying his new packaging |
| 65–75 s | A dramatic beat, “Can I eat you?”, furious Max, comedy sting and freeze-frame |

The camera uses 27 editorial shots with gentle pushes within shots. Continuous acting uses flexible quadratic limbs, eye targets, eyebrows, deformation, speech envelopes, anticipatory lean, damped follow-through, reaction symbols, sweat, suction trails and transformation sparkles. The final character performance freezes at 72.4 seconds; its title stamp settles into the held frame.

## Source layout

| File | Responsibility |
| --- | --- |
| `src/story/mysteryButton.ts` | Duration, scene ranges, camera cuts, 23 dialogue lines, shared word timings and mouth envelopes |
| `src/animation/Character.tsx` | Reusable SVG puppet, blue round / orange square / banana variants, flexible limbs, eyes, brows, mouth, pose controls |
| `src/animation/motion.ts` | Easing, keyframe tracks, ranges and damped recoil |
| `src/animation/Episode.tsx` | Acting director, staging, camera, reactions, transformation and audio playback |
| `src/backgrounds/Laboratory.tsx` | Vector lab, button prop, portal and environmental motion |
| `src/subtitles/Subtitles.tsx` | Safe-area, speaker-colored, word-pop captions |
| `src/audio/synthesize.ts` | Original Web Audio oscillator/FM voices, music, Foley and effects |
| `scripts/generate-audio.mjs` | Offline Chromium synthesis, WAV export, EBU R128 mastering and voice timing report |
| `src/Root.tsx` | Remotion composition registration |
| `src/main.tsx` | Interactive React studio using the exact render composition |
| `scripts/validate-media.py` | Full output decode and audio-energy verification |

`Character` exposes `name`, `frame`, `expression`, `pose`, `look`, `speech`, `lean`, `squash`, `walking`, `waving`, `jumping`, `banana` and `scale`. All visual clocks come from the composition frame, so preview, seeking and exported frames agree. SVG gradient IDs are instance-specific.

## Sound and synchronization

There are **no human voices**. Bobo uses high sine chirps, FM wobble and faint square overtones. Max uses lower triangle chirps, downward glides and grumbly harmonic overtones. Every subtitle word schedules a small cluster of oscillator syllables inside that word's interval. Mouth animation uses those same word intervals, with exaggerated cyclic mouth shapes. This is expressive fictional babble with timed mouth shapes, not phoneme-based human lip sync.

The original score uses a minor-six pizzicato-style ostinato. Footfalls, boings, click, low impact, stereo whooshes, FM portal drones, suction, magical chimes and the freeze-frame sting are synthesized locally. Music ducks during dialogue. Three deliberate silence windows create comic tension and contain no dialogue.

Chromium's **OfflineAudioContext** creates the audio ahead of time; the Player and renderer play the same baked WAV. Browser wall-clock synthesis would drift when seeking, so it is intentionally not used during playback. FFmpeg then masters the mix toward **−16 LUFS**, with a **−1.5 dBTP** ceiling. Voice-only WAV and per-word RMS values are retained for verification. The render encodes the mastered stereo track as AAC.

- `public/audio/mystery-button.wav`: mastered complete soundtrack
- `public/audio/voices-only.wav`: isolated fictional dialogue
- `public/audio/report.json`: timing, measured PCM peak, RMS and word-level voice energy
- `public/audio/mystery-button.srt`: optional editable subtitle sidecar; captions are already burned into the MP4
- `renders/validation.json`: final encoded-video validation results

`npm run audio` regenerates these assets deterministically. No external audio is fetched. Remotion's applicable usage license still applies: https://www.remotion.dev/license.

## Episode 002: short production recipe

1. Duplicate `src/story/mysteryButton.ts` as an Episode 002 story. Set the new duration, seven or more story beats, shot targets and speaker lines. Keep intervals ordered and nonoverlapping; each line's words must have enough time for a readable caption.
2. Create an Episode 002 director from `src/animation/Episode.tsx`, import the new story clock, and reuse the puppet, environment and motion helpers. Change the acting and shots to fit the joke. Add props/backgrounds as separate components.
3. Update the soundtrack generator and subtitle imports to the new story (or parameterize those imports for a multi-episode season), and use a distinct output asset name. Regenerate audio with the local studio running. The current generator is wired to Episode 001; changing dialogue requires regeneration before export.
4. Register `Episode002` in `src/Root.tsx` with its exact frame count. Point the studio at the new composition and story metadata. Render the new ID with `npx remotion render src/remotion.ts Episode002 renders/episode-002.mp4 --browser-executable=/usr/bin/chromium --codec=h264 --audio-codec=aac`.
5. Adapt the existing timing tests and validation target. Review representative frames, listen to the mix, run the tests, render, and decode-validate the final delivery. Never assume changing the script alone updates the existing WAV or MP4.

## Playback compatibility copy

`npm run fix:playback` converts the existing film without changing animation into `renders/mystery-button-compatible.mp4`: H.264 Main, level 4.1, limited-range yuv420p, stereo AAC-LC, avc1 tag and fast-start MP4 metadata. `npm run render` now runs this step automatically, and the studio download button uses the compatibility copy. The original is preserved. `python3 scripts/playback-preview.py` packages the compatibility MP4 into an offline HTML video player with an MP4 download button (`renders/video-preview.html`). A Codex file viewer may not display MP4 inline; download the MP4 or HTML and open it locally.
