export const FPS = 30,
  SECONDS = 75,
  DURATION = 2250;
export const FILM = 'Bobo_Max_Episode_001_Dont_Look_Behind_You';
export type Person = 'bobo' | 'max';
export type Emotion =
  | 'amused'
  | 'curious'
  | 'nervous'
  | 'fear'
  | 'scream'
  | 'urgent'
  | 'angry'
  | 'laugh'
  | 'embarrassed';
export interface Line {
  start: number;
  end: number;
  speaker: Person;
  text: string;
  emotion: Emotion;
  accent: string;
}
export const lines: Line[] = [
  {
    start: 4.6,
    end: 7.4,
    speaker: 'bobo',
    text: 'HAHA! NICE TRY, MAX!',
    emotion: 'amused',
    accent: 'MAX!',
  },
  {
    start: 27.8,
    end: 29.6,
    speaker: 'bobo',
    text: 'W-WHAT WAS THAT?!',
    emotion: 'fear',
    accent: 'THAT?!',
  },
  {
    start: 31.7,
    end: 33.25,
    speaker: 'max',
    text: 'BOBO! GET OUT',
    emotion: 'urgent',
    accent: 'OUT',
  },
  {
    start: 33.25,
    end: 34.7,
    speaker: 'max',
    text: 'OF THE HOUSE!',
    emotion: 'urgent',
    accent: 'HOUSE!',
  },
  {
    start: 35.4,
    end: 36.25,
    speaker: 'bobo',
    text: 'WHY?!',
    emotion: 'fear',
    accent: 'WHY?!',
  },
  {
    start: 37.3,
    end: 38.6,
    speaker: 'max',
    text: "I'M WATCHING",
    emotion: 'urgent',
    accent: 'WATCHING',
  },
  {
    start: 38.6,
    end: 40.0,
    speaker: 'max',
    text: 'YOUR CAMERA!',
    emotion: 'urgent',
    accent: 'CAMERA!',
  },
  {
    start: 41.1,
    end: 42.65,
    speaker: 'max',
    text: "THERE'S SOMETHING HUGE",
    emotion: 'urgent',
    accent: 'HUGE',
  },
  {
    start: 42.65,
    end: 44.25,
    speaker: 'max',
    text: 'BEHIND YOU!',
    emotion: 'urgent',
    accent: 'BEHIND',
  },
  {
    start: 53.9,
    end: 54.65,
    speaker: 'bobo',
    text: 'AAAAAAH!',
    emotion: 'scream',
    accent: 'AAAAAAH!',
  },
  {
    start: 56.1,
    end: 57.6,
    speaker: 'bobo',
    text: '…A VACUUM?',
    emotion: 'curious',
    accent: 'VACUUM?',
  },
  {
    start: 58.35,
    end: 60.45,
    speaker: 'max',
    text: 'HAHAHAHA!',
    emotion: 'laugh',
    accent: 'HAHAHAHA!',
  },
  {
    start: 61.25,
    end: 63.5,
    speaker: 'bobo',
    text: 'MAX!!! YOU IDIOT!',
    emotion: 'angry',
    accent: 'IDIOT!',
  },
  {
    start: 64.1,
    end: 66.5,
    speaker: 'max',
    text: '[WHEEZING LAUGHTER]',
    emotion: 'laugh',
    accent: 'LAUGHTER]',
  },
  {
    start: 68.25,
    end: 70.8,
    speaker: 'bobo',
    text: "I WASN'T EVEN SCARED.",
    emotion: 'embarrassed',
    accent: 'SCARED.',
  },
  {
    start: 72.08,
    end: 72.85,
    speaker: 'bobo',
    text: 'AAAAAH!',
    emotion: 'scream',
    accent: 'AAAAAH!',
  },
  {
    start: 72.95,
    end: 74,
    speaker: 'max',
    text: 'HAHAHA!',
    emotion: 'laugh',
    accent: 'HAHAHA!',
  },
];
export const scenes = [
  {
    start: 0,
    end: 360,
    title: 'The message',
    description: '3:03 AM. An unknown number. One terrible instruction.',
    color: '#738fe0',
  },
  {
    start: 360,
    end: 900,
    title: 'The sound',
    description: 'Scratch. Scratch. Please let it be the pipes.',
    color: '#9882c4',
  },
  {
    start: 900,
    end: 1380,
    title: 'Max calls',
    description: 'A familiar voice makes everything worse.',
    color: '#ddab70',
  },
  {
    start: 1380,
    end: 1740,
    title: 'The reveal',
    description: 'The scariest thing in the room has a dust compartment.',
    color: '#bd6b78',
  },
  {
    start: 1740,
    end: 2040,
    title: 'The prank',
    description: 'Max has never been this proud of himself.',
    color: '#c19a64',
  },
  {
    start: 2040,
    end: 2250,
    title: 'Bravest guy alive',
    description: 'Dignity is a very fragile thing.',
    color: '#99c5bd',
  },
];
export type ShotType =
  | 'wide'
  | 'bobo'
  | 'phone'
  | 'rear'
  | 'eyes'
  | 'hands'
  | 'vacuum'
  | 'window'
  | 'final';
export interface Shot {
  at: number;
  type: ShotType;
  x: number;
  y: number;
  zoom: number;
  push?: number;
}
/** Camera targets are in the 360×640 pixel world; HD captions stay outside this transform. */
export const shots: Shot[] = [
  { at: 0, type: 'wide', x: 180, y: 310, zoom: 1.06, push: 0.03 },
  { at: 0.65, type: 'phone', x: 145, y: 290, zoom: 1 },
  { at: 3.7, type: 'bobo', x: 147, y: 284, zoom: 2.05, push: 0.06 },
  { at: 7.85, type: 'phone', x: 145, y: 290, zoom: 1 },
  { at: 10, type: 'bobo', x: 146, y: 277, zoom: 2.2, push: 0.13 },
  { at: 12, type: 'wide', x: 170, y: 308, zoom: 1.16, push: 0.035 },
  { at: 14.6, type: 'bobo', x: 146, y: 277, zoom: 2.05, push: 0.05 },
  { at: 17.2, type: 'rear', x: 185, y: 303, zoom: 1.5, push: 0.04 },
  { at: 20, type: 'phone', x: 145, y: 290, zoom: 1 },
  { at: 22.6, type: 'bobo', x: 145, y: 277, zoom: 2.1, push: 0.09 },
  { at: 25.1, type: 'phone', x: 145, y: 290, zoom: 1 },
  { at: 27.1, type: 'rear', x: 185, y: 289, zoom: 1.5, push: 0.08 },
  { at: 30, type: 'phone', x: 145, y: 290, zoom: 1 },
  { at: 31.6, type: 'bobo', x: 146, y: 280, zoom: 2, push: 0.06 },
  { at: 34.9, type: 'bobo', x: 146, y: 275, zoom: 2.5, push: 0.06 },
  { at: 36.8, type: 'phone', x: 145, y: 290, zoom: 1 },
  { at: 40.5, type: 'bobo', x: 145, y: 272, zoom: 2.3, push: 0.15 },
  { at: 44.3, type: 'rear', x: 185, y: 287, zoom: 1.55, push: 0.1 },
  { at: 46, type: 'bobo', x: 145, y: 272, zoom: 2.65, push: 0.06 },
  { at: 47.8, type: 'eyes', x: 209, y: 277, zoom: 2.7, push: 0.08 },
  { at: 49, type: 'hands', x: 159, y: 296, zoom: 3.1, push: 0.03 },
  { at: 50.1, type: 'bobo', x: 145, y: 272, zoom: 2.7, push: 0.04 },
  { at: 51.1, type: 'eyes', x: 209, y: 277, zoom: 3.1 },
  { at: 52, type: 'bobo', x: 145, y: 272, zoom: 2.9 },
  { at: 52.8, type: 'hands', x: 159, y: 296, zoom: 3.2 },
  { at: 53.4, type: 'bobo', x: 145, y: 272, zoom: 2.75 },
  { at: 54.7, type: 'wide', x: 180, y: 320, zoom: 1.05 },
  { at: 55.65, type: 'vacuum', x: 227, y: 394, zoom: 2.65, push: 0.04 },
  { at: 57.8, type: 'window', x: 281, y: 275, zoom: 1.7, push: 0.02 },
  { at: 60.55, type: 'bobo', x: 146, y: 291, zoom: 1.9, push: 0.06 },
  { at: 63.65, type: 'window', x: 281, y: 280, zoom: 1.7 },
  { at: 67.1, type: 'wide', x: 180, y: 330, zoom: 1.12 },
  { at: 68.1, type: 'bobo', x: 146, y: 299, zoom: 1.85, push: 0.04 },
  { at: 71, type: 'final', x: 188, y: 333, zoom: 1.15 },
];
export const SILENCES: [number, number][] = [
  [10.8, 11.7],
  [54.7, 55.65],
];
export const wordsFor = (l: Line) =>
  l.text
    .split(' ')
    .map((text, i, a) => ({
      text,
      start: l.start + (i * (l.end - l.start)) / a.length,
      end: l.start + ((i + 1) * (l.end - l.start)) / a.length,
    }));
export const lineAt = (t: number, speaker?: Person) =>
  lines.find((l) => t >= l.start && t < l.end && (!speaker || l.speaker === speaker));
export interface Syllable {
  start: number;
  end: number;
  speaker: Person;
  emotion: Emotion;
  pitch: number;
  vowel: number;
  index: number;
  word: string;
}
/** This exact schedule feeds both oscillators and mouths; tails and pauses really close. */
export const syllables: Syllable[] = lines.flatMap((l, li) =>
  wordsFor(l).flatMap((w, wi) => {
    const length = w.end - w.start;
    const scream = l.emotion === 'scream';
    const count = scream
      ? 1
      : Math.max(2, Math.round(length * (l.emotion === 'laugh' ? 5.5 : 8)));
    return Array.from({ length: count }, (_, j) => ({
      start: w.start + (j * length * 0.91) / count,
      end:
        w.start +
        (j * length * 0.91) / count +
        Math.min(
          scream ? length * 0.95 : ((length * 0.91) / count) * 0.8,
          scream ? 2 : 0.19,
        ),
      speaker: l.speaker,
      emotion: l.emotion,
      pitch:
        (l.speaker === 'bobo' ? 580 : 380) *
        2 ** ((((li * 3 + wi * 2 + j * 5) % 9) - 3) / 12),
      vowel: (j + wi + li) % 5,
      index: j + li * 11,
      word: w.text,
    }));
  }),
);
export function mouthAt(t: number, who: Person) {
  const s = syllables.find((s) => s.speaker === who && t >= s.start && t < s.end);
  if (!s) return 0;
  const n = (t - s.start) / (s.end - s.start);
  return (
    Math.min(1, n / 0.13) *
    Math.min(1, (1 - n) / 0.2) *
    (0.72 + Math.sin(n * Math.PI) * 0.28)
  );
}
export const effects = [
  { name: 'vibration', at: 0.65, duration: 0.5 },
  { name: 'vibration', at: 7.85, duration: 0.45 },
  { name: 'scratch', at: 12.4, duration: 0.8 },
  { name: 'scratch', at: 14.8, duration: 0.9 },
  { name: 'scratch', at: 17.4, duration: 1.1 },
  { name: 'vibration', at: 20, duration: 0.55 },
  { name: 'vibration', at: 25.1, duration: 0.5 },
  { name: 'ring', at: 30, duration: 1.5 },
  { name: 'answer', at: 31.55, duration: 0.12 },
  { name: 'breath', at: 44.6, duration: 1.2 },
  { name: 'breath', at: 47, duration: 1.4 },
  { name: 'scratch', at: 50.7, duration: 0.7 },
  { name: 'switch', at: 54.66, duration: 0.04 },
  { name: 'footstep', at: 55.9, duration: 0.16 },
  { name: 'footstep', at: 56.3, duration: 0.16 },
  { name: 'footstep', at: 64.25, duration: 0.18 },
  { name: 'vacuum', at: 55.65, duration: 2.35 },
  { name: 'jacket', at: 67.3, duration: 0.8 },
  { name: 'vacuum', at: 71, duration: 1.1 },
  { name: 'beep', at: 72, duration: 0.1 },
  { name: 'bump', at: 72.08, duration: 0.15 },
  { name: 'jump', at: 72.12, duration: 0.38 },
  { name: 'sting', at: 73.4, duration: 1.2 },
];
