# Episode 001 production assets

- `living-room.png`: original generated 16-bit horror living room; fixed architecture for all interior shots.
- `porch.png`: original generated matching exterior, staged for Max's prank and collapse.
- `character-atlas.png`: original generated human Bobo and Max neutral rig atlas. Bobo: dark hair, dark bomber/gray hoodie, backpack. Max: auburn hair, glasses, orange jacket, headphones and backpack.
- Atlas source size: 1536×1024. The rig alpha-tests transparency, separates body layers, and draws all parts/features into the common 360×640 scene grid. The delivered film scales that grid exactly 3×.
- Rain, shadows, facial states, limbs, phone props, vacuum, trapped sock and FX are procedural pixel code. Subtitle/phone message text remains a separate readable HD layer.
- All sound is original Web Audio synthesis. WAV stems and the timing/energy report are in `audio/`.

These are retained production assets; rendering never calls image generation or downloads replacement art. New episode art should be created separately so existing character identity and deliveries remain reproducible.
