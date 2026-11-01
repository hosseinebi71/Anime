/** Single source of truth for edit, voice synthesis, acting and caption timing. Seconds are exact. */
export const FPS = 30;
export const SECONDS = 75;
export const DURATION = FPS * SECONDS;
export type Speaker = 'bobo' | 'max';
export const scenes = [
  {start:0,end:240,title:'The discovery',description:'A button. A bad idea waiting to happen.',color:'#62d9ff'},
  {start:240,end:540,title:'The warning',description:'Max has exactly one rule.',color:'#ffb368'},
  {start:540,end:900,title:'One little press',description:'Impulse control leaves the building.',color:'#ff607a'},
  {start:900,end:1260,title:'Technical difficulties',description:'Reality has a small malfunction.',color:'#ba96ff'},
  {start:1260,end:1650,title:'Missing Max',description:'Bobo investigates. Badly.',color:'#71e2d1'},
  {start:1650,end:1950,title:'A-peeling twist',description:'Same attitude. Different packaging.',color:'#f3d763'},
  {start:1950,end:2250,title:'The wrong question',description:'Friendship has its limits.',color:'#ff957c'},
];
export interface Dialogue {start:number;end:number;speaker:Speaker;text:string;accent:string;}
export const dialogue:Dialogue[] = [
  {start:2.0,end:4.2,speaker:'bobo',text:'WHAT IS THAT?!',accent:'THAT?!'},
  {start:5.2,end:7.2,speaker:'bobo',text:'Ooh. Shiny.',accent:'Shiny.'},
  {start:8.6,end:10.4,speaker:'max',text:'Bobo. Back away.',accent:'away.'},
  {start:11.2,end:13.7,speaker:'max',text:'DO NOT TOUCH IT!',accent:'NOT'},
  {start:14.5,end:16.4,speaker:'bobo',text:'This little thing?',accent:'little'},
  {start:16.8,end:17.7,speaker:'max',text:'YES. THAT.',accent:'THAT.'},
  {start:18.8,end:21.5,speaker:'bobo',text:'JUST ONE LITTLE PRESS…',accent:'ONE'},
  {start:22.1,end:23.3,speaker:'max',text:'Absolutely not.',accent:'not.'},
  {start:24.1,end:25.4,speaker:'bobo',text:'A tiny one?',accent:'tiny'},
  {start:26.1,end:27.6,speaker:'max',text:'Do. Not. Even.',accent:'Not.'},
  {start:28.5,end:29.8,speaker:'max',text:'BOBOOOOO!',accent:'BOBOOOOO!'},
  {start:31.1,end:32.4,speaker:'bobo',text:'That seems normal.',accent:'normal.'},
  {start:34.1,end:35.5,speaker:'max',text:'NOT NORMAL!',accent:'NOT'},
  {start:38.4,end:40.5,speaker:'max',text:'I BLAME YOUUU!',accent:'YOUUU!'},
  {start:43.0,end:44.5,speaker:'bobo',text:'Max? Buddy?',accent:'Max?'},
  {start:46.1,end:47.6,speaker:'bobo',text:'Behind the button?',accent:'button?'},
  {start:49.1,end:50.5,speaker:'bobo',text:'Oh, this is bad.',accent:'bad.'},
  {start:52.1,end:54.0,speaker:'bobo',text:'I can fix this.',accent:'fix'},
  {start:56.5,end:58.4,speaker:'max',text:'Do. Not. Laugh.',accent:'Laugh.'},
  {start:59.5,end:61.4,speaker:'bobo',text:'You look… different.',accent:'different.'},
  {start:62.1,end:64.0,speaker:'max',text:'I AM A BANANA.',accent:'BANANA.'},
  {start:66.4,end:68.8,speaker:'bobo',text:'Can I eat you?',accent:'eat'},
  {start:70.0,end:71.7,speaker:'max',text:'BOBO! NO!',accent:'NO!'},
];
export function wordsFor(line:Dialogue) {
  const words=line.text.split(' ');
  const duration=(line.end-line.start)/words.length;
  return words.map((text,i)=>({text,start:line.start+i*duration,end:line.start+(i+1)*duration}));
}
export function activeLine(time:number) {return dialogue.find(d=>time>=d.start&&time<d.end);}
/** Shared dialogue windows; expressive mouth cycles close at word tails. */
export function speechAt(time:number,speaker:Speaker) {
  const line=activeLine(time); if(!line || line.speaker!==speaker)return 0;
  const word=wordsFor(line).find(w=>time>=w.start&&time<w.end);if(!word)return 0;
  const local=time-word.start;const length=word.end-word.start;
  if(local>length*.88)return 0;
  return Math.min(1,local/.035)*(.35+.65*Math.abs(Math.sin(local*Math.PI*(speaker==='bobo'?12:8))));
}
export const cuts = [
  {at:0,x:535,y:1090,z:1.08}, {at:1.6,x:292,y:1100,z:1.58},
  {at:4.5,x:535,y:1110,z:1.95}, {at:7.8,x:540,y:1110,z:1.02},
  {at:10.8,x:770,y:1090,z:1.65}, {at:14.2,x:300,y:1100,z:1.6},
  {at:16.7,x:755,y:1090,z:1.7}, {at:18,x:530,y:1100,z:1.05},
  {at:21.8,x:755,y:1100,z:1.6}, {at:23.7,x:335,y:1110,z:1.65},
  {at:25.9,x:535,y:1110,z:1.2}, {at:28,x:530,y:1120,z:2.05},
  {at:30,x:535,y:1120,z:1.04}, {at:33.7,x:760,y:1090,z:1.6},
  {at:36,x:540,y:1110,z:1.03}, {at:42,x:540,y:1110,z:1.02},
  {at:45.5,x:450,y:1190,z:1.5}, {at:48.5,x:300,y:1120,z:1.55},
  {at:51.7,x:535,y:1110,z:1.3}, {at:55,x:540,y:1110,z:1.04},
  {at:56.3,x:755,y:1100,z:1.5}, {at:59.2,x:300,y:1100,z:1.65},
  {at:61.8,x:755,y:1100,z:1.55}, {at:65,x:540,y:1110,z:1.06},
  {at:66.1,x:310,y:1100,z:1.65}, {at:69.4,x:755,y:1100,z:1.6},
  {at:72,x:540,y:1100,z:1.08},
];
