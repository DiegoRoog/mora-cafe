'use client';
import {useRef} from 'react';
import {Button} from '@/components/ui/Button';
import {Reveal} from '@/components/scroll/Reveal';
import {gsap,useGSAP} from '@/lib/gsap';
import {reducedMotion} from '@/lib/motion';
import styles from './Journey.module.css';
export function Visit(){const root=useRef<HTMLDivElement>(null);useGSAP(()=>{if(reducedMotion())return;gsap.fromTo(root.current,{clipPath:'inset(18% 8% 0 8% round 40px)'},{clipPath:'inset(0% 0% 0% 0% round 40px)',ease:'none',scrollTrigger:{trigger:root.current,start:'top 95%',end:'top 28%',scrub:.7}});gsap.fromTo('[data-map]',{clipPath:'circle(0% at 55% 46%)'},{clipPath:'circle(100% at 55% 46%)',ease:'none',scrollTrigger:{trigger:root.current,start:'top 82%',end:'top 20%',scrub:.7}});},{scope:root});return <div id="visite" className={styles.visit} ref={root}>
    <Reveal className={styles.visitCopy}><p className="eyebrow" data-reveal>Visite</p><h2 data-split>A porta está<br/><em>aberta.</em></h2><div className={styles.visitDetails} data-reveal><p>Rua dos Cafeicultores, 128<br/>Centro · Sul de Minas, MG</p><p>Seg a sex, 7h às 19h<br/>Sáb, 8h às 18h · Dom, 8h às 14h</p><p>(00) 0000-0000</p></div><p className={styles.visitNote} data-reveal><em>Torra às terças e sextas, às 9h.<br/>Venha sentir o cheiro.</em></p><div className={styles.visitButtons} data-reveal><Button href="#" data-placeholder>Como chegar</Button><Button href="#" variant="ghost" data-placeholder>Ligar</Button></div><p className={styles.disclaimer}>Endereço, horários e telefone fictícios.</p></Reveal>
    <div className={styles.map} data-map><svg viewBox="0 0 560 460" role="img" aria-label="Mapa ilustrativo: Mora Café ao lado da Praça do Café. Localização fictícia.">
      <defs><pattern id="blocks" width="128" height="106" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)"><rect x="12" y="12" width="104" height="82" rx="12" fill="#42302a" stroke="#e7c9ae" strokeOpacity=".14"/></pattern></defs><rect width="560" height="460" fill="url(#blocks)"/>
      <path d="M490-20C350 90 590 200 400 290S360 460 300 500" stroke="#9a8b6b" opacity=".35" strokeWidth="30" fill="none"/><path d="M490-20C350 90 590 200 400 290S360 460 300 500" stroke="#e7c9ae" opacity=".35" strokeWidth="1" fill="none"/>
      <rect x="150" y="225" width="120" height="100" rx="32" fill="#647052" opacity=".45" transform="rotate(-18 150 225)"/>
      <g fill="none" stroke="#e7c9ae" strokeOpacity=".25" strokeWidth="2"><path d="M-30 220 580 20M-20 340 560 150M-20 465 580 265M75-20 250 480M210-20 385 480"/></g>
      <g fill="#e7c9ae" fontSize="11" fontFamily="var(--font-jost)"><text x="35" y="210" transform="rotate(-18 35 210)" letterSpacing="2">RUA DOS CAFEICULTORES</text><text x="180" y="275">Praça do Café</text><text x="450" y="340" transform="rotate(-55 450 340)">Rio do Sul</text><text x="24" y="427" letterSpacing="2">MAPA ILUSTRATIVO</text></g>
      <circle cx="308" cy="205" r="30" className={styles.mapPulse} fill="none" stroke="var(--mora-amber)"/>
      <g transform="translate(308 205) rotate(30)"><ellipse rx="19" ry="27" fill="var(--mora-amber)"/><path d="M3-20C-13-7 12 5-3 20" stroke="var(--mora-ink)" strokeWidth="2" fill="none"/></g>
      <rect x="252" y="248" width="120" height="36" rx="18" fill="var(--mora-cream)"/><text x="312" y="271" textAnchor="middle" fontFamily="var(--font-fraunces)" fontSize="17" fill="var(--mora-ink)">Mora Café</text><path d="M512 395v-34m-7 8 7-8 7 8" stroke="#e7c9ae" fill="none"/><text x="512" y="347" textAnchor="middle" fontSize="12" fill="#e7c9ae">N</text>
    </svg></div>
  </div>}
