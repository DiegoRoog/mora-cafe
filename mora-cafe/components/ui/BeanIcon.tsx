import type { SVGProps } from 'react';
export function BeanIcon({rays=false,...props}:SVGProps<SVGSVGElement>&{rays?:boolean}){
  return <svg width="24" height="28" viewBox="0 0 32 36" fill="none" aria-hidden="true" {...props}>
    {rays&&<path d="M6 8 3 5M15 5V1M25 8l4-4M29 17h3M3 17H0" stroke="currentColor" strokeWidth="1.2"/>}
    <ellipse cx="16" cy="21" rx="8.4" ry="12.1" transform="rotate(32 16 21)" fill="currentColor"/>
    <path d="M21 11c-11 4-1 13-11 20" stroke="var(--bean-groove, var(--mora-ink))" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>;
}
export function RoastBeans({level=3}:{level?:number}){return <span role="img" aria-label={`Torra ${level} de 5`} style={{display:'inline-flex',gap:4}}>{Array.from({length:5},(_,i)=><BeanIcon key={i} width="15" height="19" style={{opacity:i<level?1:.25}}/>)}</span>}
