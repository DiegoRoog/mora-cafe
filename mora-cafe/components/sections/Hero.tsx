'use client';
import {useRef} from 'react';
import {FrameCanvas} from '@/components/frames/FrameCanvas';
import {gsap,useGSAP} from '@/lib/gsap';
import {reducedMotion} from '@/lib/motion';
import styles from './Hero.module.css';
import shared from './Sections.module.css';
export function Hero(){const section=useRef<HTMLElement>(null);
  useGSAP(()=>{if(reducedMotion())return;const mm=gsap.matchMedia();mm.add({desktop:'(min-width: 769px)',mobile:'(max-width: 768px)'},context=>{
    const mobile=context.conditions?.mobile;const title=section.current!.querySelector('h1')!;const words=Array.from(title.querySelectorAll<HTMLElement>('[data-word]'));
    const timeline=gsap.timeline({scrollTrigger:{trigger:section.current,start:'top top',end:'bottom bottom',scrub:.65,invalidateOnRefresh:true},defaults:{ease:'none'}});
    timeline.to({}, {duration:1},0);
    words.forEach(word=>timeline.to(word,{x:()=>mobile?0:title.getBoundingClientRect().left+title.clientWidth/2-(word.getBoundingClientRect().left+word.offsetWidth/2),y:mobile?-36:-48,scale:.88,opacity:0,filter:'blur(8px)',duration:.26,ease:'power1.inOut'},.04));
    timeline.to('[data-hero-label]',{y:-48,autoAlpha:0,duration:.18},.04).to('[data-scroll-hint]',{autoAlpha:0,y:-20,duration:.08},.015);
    if(mobile){timeline.to('[data-copy-left]',{y:-18,autoAlpha:0,duration:.035},.015).fromTo('[data-copy-right]',{y:20,autoAlpha:0},{y:-4,autoAlpha:1,duration:.025},.04).to('[data-copy-right]',{y:-24,autoAlpha:0,duration:.035},.075);}
    else{timeline.to('[data-copy-left]',{x:-48,y:-72,autoAlpha:0,duration:.17},.03).to('[data-copy-right]',{x:48,y:-90,autoAlpha:0,duration:.17},.04);}
    timeline.to('[data-hero-fade]',{opacity:.12,duration:.2},.8).to('[data-frame-layer]',{scale:1.06,yPercent:-3,duration:.2},.8);
  });return()=>mm.revert();},{scope:section});
  return <section id="inicio" ref={section} className={shared.rail} aria-label="Café de origem">
    <div className={`${shared.stage} ${styles.stage}`}>
      <FrameCanvas sequence="s1" label="Pacote kraft Mora Café que se abre e libera grãos conforme a rolagem"/>
      <div className={styles.scrim}/><div className={styles.fade} data-hero-fade/>
      <div className={styles.titleBlock}>
        <p className={`eyebrow ${styles.label}`} data-hero-label>Café de origem · Sul de Minas</p>
        <h1 className={styles.title} aria-label="Café de origem, feito com tempo."><span className={styles.line} aria-hidden="true"><span data-word>Café</span>{' '}<span data-word>de</span>{' '}<span data-word>origem,</span></span><span className={styles.line} aria-hidden="true"><span data-word>feito</span>{' '}<em><span data-word>com</span>{' '}<span data-word>tempo.</span></em></span></h1>
      </div>
      <div className={`${styles.side} ${styles.left}`} data-copy-left><p className={`eyebrow ${styles.sideLabel}`}>Nossa origem</p><p className={styles.desktopCopy}>Grãos colhidos à mão nas montanhas do Sul de Minas, torrados em pequenos lotes. Cada pacote leva data de torra, número de lote e o cuidado de quem conhece o cafezal pelo nome.</p><p className={styles.mobileCopy}>Grãos colhidos à mão no Sul de Minas, torrados em pequenos lotes.</p></div>
      <div className={`${styles.side} ${styles.right}`} data-copy-right><p className={`eyebrow ${styles.sideLabel}`}>Nossa torra</p><p className={styles.desktopCopy}>Torra média, com notas de chocolate e caramelo. Doce na medida, corpo redondo e final longo, feito para o coador, a prensa francesa e o espresso de toda manhã. Do lote à sua xícara em poucos dias.</p><p className={styles.mobileCopy}>Torra média, notas de chocolate e caramelo. Do lote à sua xícara.</p></div>
      <a href="#historia" className={`eyebrow ${styles.hint}`} data-scroll-hint>Role para abrir o pacote<span aria-hidden="true"/></a>
      <span className={`eyebrow ${styles.edition}`} aria-hidden="true">Torra média · Lote MRC–0324</span>
    </div>
  </section>;
}
