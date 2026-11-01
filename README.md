# Bobo & Max — AFTER DARK

## Episode 001: Don't Look Behind You

A 75-second pixel-art horror-comedy. Two human characters, an unknown sender, a terrible friend, and a very innocent robot vacuum.

**1080 × 1920 · 30 fps · H.264 yuv420p · stereo AAC · fast-start MP4**

The current film completely replaces the blue round / orange square visual style with human pixel characters. The former episodes remain archived as separate compositions; they are not used in the new film.

### Watch / download

- Final film: `renders/Bobo_Max_Episode_001_Dont_Look_Behind_You.mp4`
- Standalone offline chapter player: `renders/Pixel_Horror_Preview.html` (download and open in a browser)
- React studio: `npm run dev -- --port 5173`
- Encoded-video QC: `renders/pixel-validation.json`

The studio has playback, seeking, six scene jumps, audio mute, caption visibility, character expression/pose controls, and production notes. The offline HTML embeds a lightweight native-grid video proxy; the delivered MP4 is full 1080 × 1920.

## Run the project

Requires Node 22.12+ (tested on 24.19), npm, Chromium and FFmpeg.

```sh
npm ci
npm run dev -- --port 5173
```

Open the local Vite studio. Browser audio requires a Play click. Live processes must be restarted in a new cloud task; the prepared dependencies and assets can be retained in the environment snapshot. Use the existing isolated checkout. Do not create another worktree unless explicitly requested.

```sh
npm run build             # TypeScript + production web build
npm test                  # Six current pixel-production integration tests; Vite must run
npm run audio:pixel       # Bake original voices, Foley, ambience and score; Vite must run
npm run stills:pixel      # Inspect fifteen representative shots before rendering
npm run render:pixel      # Render all 2250 frames, package yuv420p H.264/AAC fast-start MP4
npm run validate:pixel    # Decode and inspect the actual delivered film and its audio
npm run delivery:pixel    # Build a self-contained offline HTML chapter player
npm run test:pixel-player # Offline player, seeking and actual MP4 download/hash verification
npm run studio            # Remotion's full composition/timeline editor
```

Scripts use `/usr/bin/chromium`. Set `CHROMIUM_PATH` for a different local browser. Cloud Chromium sockets and listening servers may require escalated execution when the task sandbox restricts sockets. Keep the cloud proxy, credentials and TLS verification unchanged. No external audio service or voice API is used.

## The film's six scenes

| Time | Story | Camera and sound |
| --- | --- | --- |
| 0–12 s | 3:03 AM. “DON'T LOOK BEHIND YOU.” Bobo laughs; “I'M NOT MAX.” | Immediate phone insert, phone-lit face, restrained push-in, sudden quiet |
| 12–30 s | Scratches. More messages. Two red eyes. | Reaction shots, over-shoulder silhouettes, tracking eyes, heartbeat and increasing low tension |
| 30–46 s | Max calls with a panicked warning. | Caller insert, phone-filtered fictional chatter, huge eyes, ominous breathing |
| 46–58 s | Faster cuts, a scream, lights on: a sock-caught vacuum | Hands, eyes, fear close-ups; hard music stop at 54.7 s; real silence; appliance reveal |
| 58–68 s | Max is outside laughing at his own prank | Exterior angle, visible phone, full-body collapse, furious Bobo, playful score |
| 68–75 s | “I WASN'T EVEN SCARED.” Beep, foot nudge, airborne Bobo | Jacket straightening, timed beep/squeal, flying phone, freeze-frame: “BRAVEST GUY ALIVE 💀” |

There are 34 editorial shots. Shot-local pushes are purposeful, not random camera wandering. The pixel world freezes at 73.4 s, while the final caption/laughter finishes on its own clock. The end title avoids the character and vacuum; the last subtitle has its own safe region.

## Maintainable production modules

| Module | Responsibility |
| --- | --- |
| `src/pixel/story.ts` | Exact dialogue, word and synthesized-syllable windows; scene ranges; camera plan; sound cues |
| `src/pixel/characters/PixelRig.ts` | Reusable human head/torso/arm/thigh/calf puppets, phone, sitting/walking/panic/jump/straightening |
| `src/pixel/characters/face.ts` | Pixel eyes, eyebrows, blink, pupil targets, mouth shapes, anger, fear and laughter |
| `src/pixel/camera/director.ts` | Editorial shot selection, easing and frame-derived camera values |
| `src/pixel/scenes/world.ts` | Staging, moving shadows, rain, phone light, vacuum/sock, exterior prank and final jump |
| `src/pixel/PixelStage.tsx` | Asset loading, alpha-tested atlas, native 360 × 640 raster, nearest-neighbor HD scaling |
| `src/pixel/PhoneInsert.tsx` | Readable message/call inserts, synchronized vibration and call waveform |
| `src/pixel/Subtitles.tsx` | Mobile-safe HD captions, restrained word pop and speaker accents |
| `src/pixel/audio/voices.ts` | Nonhuman harmonic sources, animated vowel resonators, FM, raspy breath and emotional contours |
| `src/pixel/audio/effects.ts` | Rain, heartbeat, scratching, vibration/ring, breathing, footsteps, motor, beep and impact |
| `src/pixel/audio/music.ts` | Original horror drones, hard-cut bus and comedy score |
| `src/pixel/audio/render.ts` | Offline synthesis, reusable WAV export and per-cue measurements |
| `src/pixel/Episode.tsx` | Film composition, audio, inserts, subtitles and freeze title |
| `src/PixelStudio.tsx` | Interactive React screening room and acting laboratory |

The film uses one shared 360 × 640 pixel grid, scaled exactly 3× for 1080 × 1920. Image smoothing is disabled; sprite alpha edges are thresholded. Face features and limbs are actually redrawn and articulated, rather than sliding a single static character image. Generated production illustrations are retained as fixed assets, so all renders use the same character designs and environments. The HD text layer stays separate from the pixel-camera transform.

## Voice and subtitle synchronization

No intelligible English speech, human recordings, celebrity imitation or TTS is used. The English captions provide the meaning of a fictional vocal performance. Bobo has higher, nasal, squeaky chatter and exaggerated squeals. Max has a lower, raspier, mischievous performance, with deliberately different laughter and urgent-call contours.

Each word generates explicit syllable start/end windows in `story.ts`. Those exact windows schedule the oscillator/formant envelopes and drive `mouthAt()`. Mouth motion stops in syllable gaps and pauses. Emotion changes eye, brow and mouth shapes. During Max's phone call, Max is heard through the phone while Bobo reacts; Max is seen acting in the exterior shots.

The audio is baked using Web Audio's **OfflineAudioContext**, so seeking and offline export do not depend on a real-time audio clock. FFmpeg masters the stereo mix toward −17 LUFS with a −2 dBTP ceiling. The two scripted silence windows have no dialogue. The switch click ends before the reveal silence, and the final beep precedes the reaction scream by 80 ms.

Retained audio assets:

- `public/pixel/audio/episode.wav`: final mastered mix
- `voices.wav`, `effects.wav`, `music.wav`: independently generated stems
- `report.json`: voice/word energy, effect energy and music-cut evidence
- `public/pixel/episode.srt`: editable subtitle sidecar; the final MP4 already burns in captions

Do not edit timing without regenerating audio. The current film is 2250 frames; changing only the source does not update the existing WAV or MP4.

## Quality control and export

The required checks cover all four messages, every dialogue caption, per-word voice energy, mouth/voice windows, intended effects, music stopping at the reveal, human rig motion, playback controls and mobile bounds. `npm run stills:pixel` exports all fifteen review moments. `PIXEL_STILLS=collapse,freeze npm run stills:pixel` refreshes selected shots.

`npm run render:pixel` renders PNG frames in BT.709 and makes the final file using H.264 and AAC. It explicitly verifies yuv420p. The packaging step places MP4 metadata before the media data for browser streaming. `npm run validate:pixel` decodes every video frame, checks stream metadata, measures decoded audio during every voice word and effect, checks silence, and extracts representative frames from the actual encoded video. Chromium playback and download hashes are tested separately.

Default render, audio, stills, validation and delivery commands now select the pixel film. The former Mystery Button commands are retained with the `:mystery` suffix, and its legacy compositions remain separate. The old interface is archived in `src/LegacyStudio.tsx`; the current default studio uses human pixel rigs exclusively. Old tests remain in the tree for reference; the current Playwright configuration selects the pixel-production suite.

## Episode 002: quick start

1. Duplicate `src/pixel/story.ts` for the new story. Define shot intent, scene ranges, dialogue/emotions and sound cues. Keep words readable and all intervals within the composition duration.
2. Reuse `PixelRig`, facial states and the common pixel grid. Make a new scene director and stage new actions; don't reuse the previous joke's camera plan blindly. Add new scenery as separate retained assets.
3. Point the subtitle and audio entry modules to the new story; use a new audio directory. The current synthesis entry is wired to Episode 001. Rebuild the WAVs and review cue reports.
4. Register the next composition in `src/Root.tsx`. Give it its own exact frame count and output filename. Update the studio's selected episode and the render/validation target.
5. Inspect stills, test the timeline, render, then decode-check the actual output and test the browser player. Keep new work on a feature branch and preserve previous deliveries.

## Asset provenance

The room, porch and human-character atlas are original generated production assets created for this episode from the user's art direction and reference. They are retained in `public/pixel`. Facial animation, rigging, props, camera, rain/shadows and all sound synthesis are project code. No stock music, sound recordings or externally downloaded character packs are included. Remotion's applicable usage license remains relevant: https://www.remotion.dev/license.

The former project's documentation is retained in `docs/MYSTERY_BUTTON_ARCHIVE.md`.
