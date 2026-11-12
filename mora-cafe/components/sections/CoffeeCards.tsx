'use client';
import {useRef,type MouseEvent} from 'react';
import {BeanIcon,RoastBeans} from '@/components/ui/BeanIcon';
import {Button} from '@/components/ui/Button';
import {Reveal} from '@/components/scroll/Reveal';
import {coffees} from '@/lib/copy';
import {gsap,useGSAP} from '@/lib/gsap';
import {reducedMotion} from '@/lib/motion';
import styles from './Journey.module.css';
export function CoffeeCards(){const root=useRef<HTMLDivElement>(null),track=useRef<HTMLDivElement>(null);
  useGSAP(()=>{if(reducedMotion())return;gsap.utils.toArray<HTMLElement>('[data-card]').forEach((card,i)=>{gsap.fromTo(card,{y:i===1?90:140},{y:0,ease:'none',scrollTrigger:{trigger:root.current,start:'top 82%',end:'top 24%',scrub:.7}});gsap.from(card.querySelectorAll('[data-meter]'),{scaleX:0,transformOrigin:'left',ease:'none',scrollTrigger:{trigger:card,start:'top 85%',end:'top 35%',scrub:.6}});});},{scope:root});
  function tilt(e:MouseEvent<HTMLElement>){if(!matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches)return;const box=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--rx',`${-(e.clientY-box.top-box.height/2)/box.height*10}deg`);e.currentTarget.style.setProperty('--ry',`${(e.clientX-box.left-box.width/2)/box.width*10}deg`);e.currentTarget.style.setProperty('--shine',`${(e.clientX-box.left)/box.width*100}%`);}
  return <div id="nossos-cafes" className={styles.coffees} ref={root}>
    <Reveal className={styles.coffeeHeading}><p className="eyebrow" data-reveal>Nossos cafés</p><h2 data-split>Três torras,<br/><em>uma</em> origem.</h2><p data-reveal>Os mesmos produtores, três pontos de torra.<br/>Escolha pelo humor do dia.</p></Reveal>
    <div className={styles.cardTrack} ref={track} data-lenis-prevent>{coffees.map((coffee,i)=><div className={`${styles.cardShell} ${i===1?styles.featured:''}`} data-card key={coffee.name}><article className={styles.card} onMouseMove={tilt} onMouseLeave={e=>{e.currentTarget.style.setProperty('--rx','0deg');e.currentTarget.style.setProperty('--ry','0deg');}}>
      {i===1&&<p className={styles.favorite}>Favorito da casa</p>}
      <div className={`${styles.bag} ${styles[coffee.color]}`} aria-hidden="true"><div className={styles.bagFold}/><div className={styles.bagLabel}><BeanIcon rays/><span className={styles.bagBrand}>Mora Café</span><span className={styles.bagOrigin}>Café de origem</span><span className={styles.bagName}>{coffee.name.replace('Mora ','')}</span><span className={styles.bagRoast}>Torra {coffee.roast.toLowerCase()} <RoastBeans level={coffee.level}/></span><em>{coffee.notes}</em><div className={styles.bagDetails}><span>Origem<br/>{coffee.origin} · Brasil</span><span>Lote<br/>{coffee.batch}</span></div><span className={styles.weight}>250g</span></div></div>
      <div className={styles.cardInfo}><div className={styles.cardTitle}><h3>{coffee.name}</h3><span className="eyebrow">Torra {coffee.roast}</span></div><p className={styles.tasting}><em>{coffee.notes}</em></p>
      <dl className={styles.profile}>{['Doçura','Acidez','Corpo'].map((label,j)=><div key={label}><dt>{label}</dt><dd><span className={styles.meter}><i data-meter style={{width:`${coffee.profile[j]*20}%`}}/></span><span className="sr-only">{coffee.profile[j]} de 5</span></dd></div>)}</dl>
      <div className={styles.price}><strong>R$ {coffee.price}</strong><span>250 g</span></div><Button variant="solid-dark" href="#" data-placeholder title="Lote ilustrativo de portfólio">Conhecer o lote</Button></div>
    </article></div>)}</div>
    <div className={styles.cardsFooter}><p>Preços e lotes ilustrativos · Projeto fictício de portfólio</p><div className={styles.carouselControls}><button aria-label="Café anterior" onClick={()=>track.current?.scrollBy({left:-300,behavior:reducedMotion()?'instant':'smooth'})}>←</button><button aria-label="Próximo café" onClick={()=>track.current?.scrollBy({left:300,behavior:reducedMotion()?'instant':'smooth'})}>→</button></div></div>
  </div>;
}
