'use client';
import {useEffect} from 'react';
import Lenis from 'lenis';
import {gsap,ScrollTrigger} from '@/lib/gsap';
import {easeInOutExpo} from '@/lib/easing';
import {reducedMotion} from '@/lib/motion';
export function SmoothScroll(){
  useEffect(()=>{
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    let lenis:Lenis|undefined;
    const tick=(t:number)=>lenis?.raf(t*1000);
    function setup(){lenis?.destroy();lenis=undefined;document.documentElement.classList.toggle('reduce-motion',reducedMotion());if(!reducedMotion()){lenis=new Lenis({lerp:.085,smoothWheel:true,syncTouch:false});lenis.on('scroll',ScrollTrigger.update);}ScrollTrigger.refresh();}
    setup();gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);media.addEventListener('change',setup);
    const triggers=['inicio','historia','cafes','contato'].map(id=>ScrollTrigger.create({trigger:`#${id}`,start:()=>id==='contato'&&!reducedMotion()?`top+=${innerHeight} 50%`:'top 50%',end:'bottom 50%',onToggle:self=>{if(self.isActive){document.documentElement.dataset.activeSection=id;window.dispatchEvent(new Event('mora:section'));}}}));
    const click=(e:MouseEvent)=>{
      const a=(e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if(!a||a.dataset.placeholder!==undefined||a.getAttribute('href')==='#'||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
      const target=document.getElementById(a.hash.slice(1));if(!target)return;e.preventDefault();
      let top=target.getBoundingClientRect().top+window.scrollY-(a.hash==='#inicio'?0:72);
      if(a.hash==='#contato'&&!reducedMotion())top+=target.offsetHeight-innerHeight;
      const complete=()=>{target.tabIndex=-1;target.focus({preventScroll:true});};
      if(lenis)lenis.scrollTo(top,{duration:a.hash==='#inicio'?2.4:1.6,easing:easeInOutExpo,onComplete:complete});else{window.scrollTo({top});complete();}
      history.replaceState(null,'',a.hash);
    };
    const overlay=(e:Event)=>{const open=(e as CustomEvent<boolean>).detail;document.body.style.overflow=open?'hidden':'';if(open)lenis?.stop();else lenis?.start();};
    const placeholder=(e:MouseEvent)=>{if((e.target as Element).closest('[data-placeholder]'))e.preventDefault();};
    document.addEventListener('click',click);document.addEventListener('click',placeholder);window.addEventListener('mora:overlay',overlay);
    let alive=true;document.fonts.ready.then(()=>{if(alive)ScrollTrigger.refresh();});
    const refresh=()=>ScrollTrigger.refresh();window.addEventListener('mora:frames-ready',refresh);
    return()=>{alive=false;media.removeEventListener('change',setup);gsap.ticker.remove(tick);lenis?.destroy();triggers.forEach(t=>t.kill());document.removeEventListener('click',click);document.removeEventListener('click',placeholder);window.removeEventListener('mora:overlay',overlay);window.removeEventListener('mora:frames-ready',refresh);document.body.style.overflow='';};
  },[]);
  return null;
}
