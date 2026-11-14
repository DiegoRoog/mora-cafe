'use client';
import Image from 'next/image';
import {assetPath} from '@/lib/asset-path';
import {useEffect,useRef} from 'react';
import {Button} from '@/components/ui/Button';
import {CupIcon} from '@/components/ui/CupIcon';
import {Reveal} from '@/components/scroll/Reveal';
import {gsap,useGSAP} from '@/lib/gsap';
import {reducedMotion} from '@/lib/motion';
import styles from './Story.module.css';
export function Story(){const section=useRef<HTMLElement>(null);useGSAP(()=>{if(reducedMotion())return;gsap.fromTo('[data-story-image]',{scale:1.12,yPercent:-6},{scale:1,yPercent:6,ease:'none',scrollTrigger:{trigger:section.current,start:'top bottom',end:'bottom top',scrub:.8}});gsap.from('[data-cups]',{yPercent:100,ease:'none',scrollTrigger:{trigger:'[data-cups]',start:'top bottom',end:'top 70%',scrub:.6}});},{scope:section});
  useEffect(()=>{const track=section.current!.querySelector<HTMLElement>(`.${styles.track}`)!;let visible=false;const sync=()=>{track.style.animationPlayState=visible&&!document.hidden?'running':'paused';};const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();});observer.observe(track);document.addEventListener('visibilitychange',sync);return()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync);};},[]);
  return <section id="historia" ref={section} className={styles.story}>
    <div className={styles.image} data-story-image><Image src={assetPath('/images/fundo-secao-2.webp')} alt="" fill sizes="100vw" quality={85}/></div><div className={styles.scrim}/>
    <Reveal className={styles.content}><div data-drift>
      <p className={`eyebrow ${styles.label}`} data-reveal>Nossa história</p>
      <h2 data-split>Aqui, o<br/>café <em>mora.</em></h2>
      <p className={styles.body} data-reveal>A Mora nasceu de uma ideia simples: café bom não tem pressa. Trabalhamos com pequenos produtores do Sul de Minas, uma das regiões cafeeiras mais tradicionais do Brasil, e acompanhamos cada lote da colheita até a torra. Sem atalhos e sem exageros: o grão certo, no ponto certo, esperando por você na xícara.</p>
      <p className={styles.note} data-reveal><em>Mora: do verbo morar.<br/>Um lugar para ficar um pouco mais.</em></p>
      <div data-reveal data-reveal-action><Button href="#visite">Venha nos conhecer</Button></div>
    </div></Reveal>
    <div className={styles.cups} data-cups aria-hidden="true"><div className={styles.track}>{[0,1].map(copy=><div className={styles.cupSet} key={copy}>{Array.from({length:18},(_,i)=><CupIcon key={i} variant={i%3}/>)}</div>)}</div><div className={styles.shelf}/></div>
  </section>;
}
