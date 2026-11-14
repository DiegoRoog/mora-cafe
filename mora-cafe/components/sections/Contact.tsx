'use client';
import dynamic from 'next/dynamic';
import {useRef,useState,useCallback} from 'react';
import {FrameCanvas} from '@/components/frames/FrameCanvas';
import {Button} from '@/components/ui/Button';
import {gsap,useGSAP} from '@/lib/gsap';
import {reducedMotion} from '@/lib/motion';
import {contactCollision} from '@/lib/easing';
import styles from './Contact.module.css';
const ContactDialog=dynamic(()=>import('@/components/contact/ContactDialog'),{ssr:false});
const SocialPopover=dynamic(()=>import('@/components/contact/SocialPopover'),{ssr:false});
export function Contact(){const section=useRef<HTMLElement>(null),socialWrap=useRef<HTMLDivElement>(null);const[dialog,setDialog]=useState(false),[social,setSocial]=useState(false);
  const closeSocial=useCallback(()=>{setSocial(false);socialWrap.current?.querySelector<HTMLButtonElement>('button')?.focus();},[]);
  useGSAP(()=>{if(reducedMotion())return;const timeline=gsap.timeline({scrollTrigger:{trigger:section.current,start:()=>`top+=${innerHeight} top`,end:'bottom bottom',scrub:.65},defaults:{ease:'none'}});
    timeline.to({}, {duration:1},0).fromTo('[data-contact-label]',{y:30,autoAlpha:0},{y:0,autoAlpha:1,duration:.06},0);
    timeline.fromTo('[data-contact-line="1"]',{xPercent:-18,y:40,autoAlpha:0},{xPercent:0,y:0,autoAlpha:1,duration:contactCollision-.06},.06).fromTo('[data-contact-line="2"]',{xPercent:18,y:40,autoAlpha:0},{xPercent:0,y:0,autoAlpha:1,duration:contactCollision-.06},.06);
    timeline.to('[data-contact-title]',{scale:1.02,duration:.025},contactCollision).to('[data-contact-title]',{scale:1,duration:.035},contactCollision+.025);
    timeline.fromTo('[data-contact-actions]',{y:56,autoAlpha:0},{y:0,autoAlpha:1,duration:.10},.88).fromTo('[data-contact-footer]',{y:20,autoAlpha:0},{y:0,autoAlpha:1,duration:.04},.96);
    timeline.to('[data-contact-heading]',{y:-32,duration:.94},.06);
  },{scope:section});
  return <section id="contato" ref={section} className={styles.rail}>
    <div className={styles.stage}>
      <FrameCanvas sequence="s4" label="Grãos de café se encontram no centro e repousam juntos ao final da rolagem"/><div className={styles.scrim}/>
      <div className={styles.heading} data-contact-heading><p className={`eyebrow ${styles.eyebrow}`} data-contact-label>Fale com a gente</p><h2 data-contact-title><span data-contact-line="1">Todo bom encontro</span><span data-contact-line="2">começa com <em>um grão.</em></span></h2></div>
      <div className={styles.actions} data-contact-actions><p>Quer provar, encomendar um lote ou levar a Mora para o seu evento? Conversa com a gente. A primeira xícara é por nossa conta.</p><div className={styles.buttons}><Button onClick={()=>{setSocial(false);setDialog(true);}}>Entre em contato conosco</Button><div ref={socialWrap} className={styles.socialWrap}><Button variant="ghost" onClick={()=>setSocial(v=>!v)} aria-expanded={social} aria-controls="social-panel" data-social-toggle>Visite nossas redes sociais</Button>{social&&<SocialPopover onClose={closeSocial}/>}</div></div></div>
      <footer className={styles.footer} data-contact-footer><p>© 2026 Mora Café <span>· Projeto fictício de portfólio · Torra média, Sul de Minas</span></p><a href="#inicio">Voltar ao topo <span aria-hidden="true">↑</span></a></footer>
    </div>{dialog&&<ContactDialog onClose={()=>setDialog(false)}/>}
  </section>;
}
