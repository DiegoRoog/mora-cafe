'use client';
import type {ButtonHTMLAttributes,AnchorHTMLAttributes,ReactNode,MouseEvent} from 'react';
import styles from './Button.module.css';
type Props={children:ReactNode;variant?:'solid'|'solid-dark'|'ghost';className?:string}&(ButtonHTMLAttributes<HTMLButtonElement>|AnchorHTMLAttributes<HTMLAnchorElement>);
export function Button({children,variant='solid',className='',...props}:Props){
  function move(event:MouseEvent<HTMLElement>){
    if(!matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches)return;
    const box=event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--x',`${event.clientX-box.left}px`);event.currentTarget.style.setProperty('--y',`${event.clientY-box.top}px`);
    event.currentTarget.style.setProperty('--mx',`${(event.clientX-box.left-box.width/2)/box.width*12}px`);event.currentTarget.style.setProperty('--my',`${(event.clientY-box.top-box.height/2)/box.height*12}px`);
  }
  const common={className:`${styles.button} ${styles[variant]} ${className}`,onMouseMove:move,onMouseLeave:(event:MouseEvent<HTMLElement>)=>{event.currentTarget.style.setProperty('--mx','0px');event.currentTarget.style.setProperty('--my','0px');}};
  const content=<><span className={styles.fill} aria-hidden="true"/><span className={styles.label}>{children}</span></>;
  return 'href' in props?<a {...props as AnchorHTMLAttributes<HTMLAnchorElement>} {...common}>{content}</a>:<button type="button" {...props as ButtonHTMLAttributes<HTMLButtonElement>} {...common}>{content}</button>;
}
