'use client';
import {useEffect,useRef} from 'react';
import styles from './SocialPopover.module.css';
export default function SocialPopover({onClose}:{onClose:()=>void}){const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{root.current?.querySelector('a')?.focus();const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.stopPropagation();onClose();}};const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node)&&!(e.target as Element).closest('[data-social-toggle]'))onClose();};document.addEventListener('keydown',key);document.addEventListener('pointerdown',outside);return()=>{document.removeEventListener('keydown',key);document.removeEventListener('pointerdown',outside);};},[onClose]);
  return <div ref={root} id="social-panel" className={styles.popover} role="region" aria-label="Redes sociais demonstrativas"><p>Um café, uma conversa.</p><div>{['Instagram','WhatsApp','Pinterest'].map(name=><a key={name} href="#" data-placeholder target="_blank" rel="noopener noreferrer">{name} <span aria-hidden="true">↗</span></a>)}</div><small>Links ilustrativos · Sem contas reais</small></div>;
}
