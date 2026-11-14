'use client';
import {useRef,type ReactNode} from 'react';
import {gsap,ScrollTrigger,useGSAP} from '@/lib/gsap';
import {reducedMotion} from '@/lib/motion';
export function Reveal({children,className}:{children:ReactNode;className?:string}){const root=useRef<HTMLDivElement>(null);
  useGSAP(context=>{if(reducedMotion())return;let alive=true;let cleanup:(()=>void)|undefined;
    Promise.all([document.fonts.ready,import('gsap/SplitText')]).then(([,module])=>{if(!alive)return;context.add(()=>{
      const SplitText=module.SplitText;gsap.registerPlugin(SplitText);
      const splits=Array.from(root.current!.querySelectorAll<HTMLElement>('[data-split]')).map(el=>SplitText.create(el,{type:'lines',mask:'lines',autoSplit:true,aria:'auto',onSplit:self=>gsap.fromTo(self.lines,{yPercent:110},{yPercent:0,stagger:.08,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 92%',toggleActions:'play none none reverse'}})}));
      if(matchMedia('(min-width: 1025px) and (pointer: fine)').matches){root.current!.querySelectorAll<HTMLElement>('h2').forEach(el=>{const skew=gsap.quickTo(el,'skewY',{duration:.4,ease:'power3.out'});const reset=gsap.delayedCall(.12,()=>skew(0)).pause();ScrollTrigger.create({trigger:el,start:'top bottom',end:'bottom top',onUpdate:self=>{skew(gsap.utils.clamp(-2.5,2.5,self.getVelocity()/1000));reset.restart(true);}});});}
      root.current!.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el=>gsap.fromTo(el,{y:el.hasAttribute('data-reveal-action')?24:60,autoAlpha:0},{y:0,autoAlpha:1,ease:'none',scrollTrigger:{trigger:el,start:'top 98%',end:el.hasAttribute('data-reveal-action')?'top 88%':'top 66%',scrub:el.hasAttribute('data-reveal-action')?.2:.6}}));
      root.current!.querySelectorAll<HTMLElement>('[data-drift]').forEach(el=>gsap.fromTo(el,{y:30},{y:-48,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:.8}}));
      cleanup=()=>splits.forEach(s=>s.revert());
    });});return()=>{alive=false;cleanup?.();};
  },{scope:root});return <div ref={root} className={className}>{children}</div>;
}
