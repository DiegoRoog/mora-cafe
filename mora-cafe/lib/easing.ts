export const easeInOutExpo=(x:number)=>x===0?0:x===1?1:x<.5?2**(20*x-10)/2:(2-2**(-20*x+10))/2;
export const clamp01=(n:number)=>Math.max(0,Math.min(1,n));
export const range=(p:number,start:number,end:number)=>clamp01((p-start)/(end-start));
export const heroFrame=(p:number)=>range(p,.08,.90);
// Source inspection: collision occurs at 25%, followed by settling.
export const contactFrame=(p:number)=>p<.82?range(p,.06,.82)*.25:.25+range(p,.82,.96)*.75;
