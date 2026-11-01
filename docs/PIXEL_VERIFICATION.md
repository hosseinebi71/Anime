# Delivery verification — Don't Look Behind You

- File: `Bobo_Max_Episode_001_Dont_Look_Behind_You.mp4`
- Size: 46,632,520 bytes
- Video: H.264, yuv420p, limited range, BT.709, 1080×1920, 30 fps, 2250 frames
- Audio: stereo AAC-LC, 48 kHz
- Container duration: 75.008000 s (75 seconds of video; AAC packet padding adds milliseconds)
- MP4 metadata precedes media data: verified fast-start
- Full video/audio decode: passed
- Dialogue: 17 phrases, 38 audible words, shared caption/voice timing
- Intended sound cues: 23, each with source-stem and decoded mix energy
- Silence windows: [0.0, 0.0] RMS in the interior of each window
- Horror music stem after the 54.7 s reveal cut: 0 RMS
- Final frozen-picture difference: 0.0153/255 average RGB (codec variation only)
- Six current-production Playwright checks: passed
- Offline chapter player, responsive layout, full-resolution Chromium playback: passed
- Downloaded MP4 hash matched the delivered file
- SHA-256: `abd295b3939d1afda93fbfd17edbc769534315cffb366026de7c341afcbb77e5`

All fifteen representative story moments plus a late freeze frame were extracted from the actual encoded MP4. The close-up review corrected an obscured phone-holding wrist, collapse framing, and end-title/character overlap before this delivery. See the contact sheet and JSON reports in `renders/`.

Browser checks used system Chromium on Linux. Windows Media Player is not installed here, so it was not directly tested. The export uses standard H.264/AAC/yuv420p MP4 encoding.

Rendering uses retained original generated illustrations and deterministic procedural rigs; sound is synthesized locally into retained WAVs. No human voice recording or TTS is used.
