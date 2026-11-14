export const easeInOutExpo=(x:number)=>x===0?0:x===1?1:x<.5?2**(20*x-10)/2:(2-2**(-20*x+10))/2;
export const clamp01=(n:number)=>Math.max(0,Math.min(1,n));
export const range=(p:number,start:number,end:number)=>clamp01((p-start)/(end-start));
export const heroFrame=(p:number)=>range(p,.08,.90);
// Uniform playback avoids stretching the first 60 frames over most of the rail.
// Source frame 61 is the collision; title motion uses the same point.
export const contactCollision=.06+(.96-.06)*(60/241);
export const contactFrame=(p:number)=>range(p,.06,.96);
