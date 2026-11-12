'use client';
import {useRef,useEffect,useState} from 'react';
import {BeanIcon} from '@/components/ui/BeanIcon';
import {useActiveSection,overlayState} from '@/lib/motion';
import {trapDialogTab} from '@/lib/dialog-keyboard';
import styles from './SiteNav.module.css';
const links=[['História','#historia','historia'],['Cafés','#nossos-cafes','cafes'],['Localização','#visite','visite'],['Contato','#contato','contato']];
export function SiteNav(){
  const active=useActiveSection(),dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null);
  const [scrolled,setScrolled]=useState(false),[open,setOpen]=useState(false);
  useEffect(()=>{const scroll=()=>setScrolled(window.scrollY>80);scroll();window.addEventListener('scroll',scroll,{passive:true});return()=>window.removeEventListener('scroll',scroll);},[]);
  function close(){dialog.current?.close();setOpen(false);overlayState(false);trigger.current?.focus();}
  function show(){dialog.current?.showModal();setOpen(true);overlayState(true);}
  const link=(item:string[])=> <a key={item[0]} href={item[1]} className={`${styles.pill} ${active===item[2]?styles.active:''}`} aria-current={active===item[2]?'location':undefined}>{item[0]}</a>;
  return <header className={`${styles.header} ${scrolled?styles.scrolled:''}`}>
    <nav className={styles.navigation} aria-label="Navegação principal">
      <div className={styles.left}>{links.slice(0,2).map(link)}</div>
      <a className={styles.logo} href="#inicio" aria-label="Mora Café, início"><BeanIcon rays/>Mora Café</a>
      <div className={styles.right}>{links.slice(2).map(link)}</div>
      <button className={`${styles.pill} ${styles.menu}`} ref={trigger} onClick={show} aria-expanded={open} aria-controls="mobile-menu">Menu <span aria-hidden="true">☰</span></button>
    </nav>
    <dialog ref={dialog} id="mobile-menu" className={styles.mobileDialog} onKeyDown={trapDialogTab} onCancel={e=>{e.preventDefault();close();}} onClose={()=>{setOpen(false);overlayState(false);}} aria-label="Menu de navegação" data-lenis-prevent>
      <div className={styles.mobileTop}><span className={styles.logo}>Mora Café</span><button onClick={close} className={styles.pill}>Fechar <span aria-hidden="true">×</span></button></div>
      <nav aria-label="Navegação móvel">{links.map((item,i)=><a href={item[1]} key={item[0]} onClick={close} style={{animationDelay:`${i*.07}s`}}>{item[0]}<span aria-hidden="true">↗</span></a>)}</nav>
      <p className="eyebrow">Café de origem · Feito com tempo</p>
    </dialog>
  </header>;
}
