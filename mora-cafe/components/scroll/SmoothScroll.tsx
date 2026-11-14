'use client';
import {useEffect,useState,useRef} from 'react';
import Lenis from 'lenis';
import {gsap,ScrollTrigger} from '@/lib/gsap';
import {easeInOutExpo} from '@/lib/easing';
import {reducedMotion,useReducedMotion} from '@/lib/motion';
export function SmoothScroll(){
  const reduced=useReducedMotion();
  const[notice,setNotice]=useState('');
  const noticeTimer=useRef(0);
  useEffect(()=>()=>clearTimeout(noticeTimer.current),[]);
  useEffect(()=>{
    let lenis:Lenis|undefined;
    const tick=(t:number)=>lenis?.raf(t*1000);
    function setup(){lenis?.destroy();lenis=undefined;document.documentElement.classList.toggle('reduce-motion',reducedMotion());if(!reducedMotion()){lenis=new Lenis({lerp:.085,smoothWheel:true,syncTouch:false});lenis.on('scroll',ScrollTrigger.update);}ScrollTrigger.refresh();}
    setup();gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);
    let visitActive=false;
    const updateNav=()=>{const active=document.documentElement.dataset.activeSection;document.documentElement.dataset.activeNav=active==='cafes'&&visitActive?'visite':active;window.dispatchEvent(new Event('mora:section'));};
    const triggers=['inicio','historia','cafes','contato'].map(id=>ScrollTrigger.create({trigger:`#${id}`,start:()=>id==='contato'&&!reducedMotion()?`top+=${innerHeight} 50%`:'top 50%',end:'bottom 50%',onToggle:self=>{if(self.isActive){document.documentElement.dataset.activeSection=id;updateNav();}}}));
    triggers.push(ScrollTrigger.create({trigger:'#visite',start:'top 50%',end:'bottom 50%',onToggle:self=>{visitActive=self.isActive;updateNav();}}));
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
    const placeholder=(e:MouseEvent)=>{if((e.target as Element).closest('[data-placeholder]')){e.preventDefault();setNotice('Demonstração de portfólio: este link é ilustrativo e não abre um serviço real.');clearTimeout(noticeTimer.current);noticeTimer.current=window.setTimeout(()=>setNotice(''),6000);}};
    document.addEventListener('click',click);document.addEventListener('click',placeholder);window.addEventListener('mora:overlay',overlay);
    let alive=true;document.fonts.ready.then(()=>{if(alive)ScrollTrigger.refresh();});
    const refresh=()=>ScrollTrigger.refresh();window.addEventListener('mora:frames-ready',refresh);
    return()=>{alive=false;gsap.ticker.remove(tick);lenis?.destroy();triggers.forEach(t=>t.kill());document.removeEventListener('click',click);document.removeEventListener('click',placeholder);window.removeEventListener('mora:overlay',overlay);window.removeEventListener('mora:frames-ready',refresh);document.body.style.overflow='';};
  },[reduced]);
  return <div className="demo-notice" role="status" aria-live="polite">{notice}</div>;
}
