import {interpolate, Easing} from 'remotion';
export const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const ramp=(t:number,a:number,b:number)=>interpolate(t,[a,b],[0,1],{...clamp,easing:Easing.inOut(Easing.cubic)});
export const between=(t:number,a:number,b:number)=>t>=a&&t<b;
/** Damped follow-through after an impact, zero before the impact. */
export const recoil=(t:number,at:number,strength=1)=> t<at?0:Math.sin((t-at)*24)*Math.exp(-(t-at)*6)*strength;
export function track(t:number,keys:[number,number][]) {
  return interpolate(t,keys.map(k=>k[0]),keys.map(k=>k[1]),{...clamp,easing:Easing.inOut(Easing.cubic)});
}
