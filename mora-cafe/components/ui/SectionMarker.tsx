'use client';
import {BeanIcon} from './BeanIcon';
import {useActiveSection} from '@/lib/motion';
import styles from './SectionMarker.module.css';
const sections=[['inicio','Início'],['historia','História'],['cafes','Cafés'],['contato','Contato']];
export function SectionMarker(){const active=useActiveSection();return <nav className={styles.marker} aria-label="Seções da página" data-section-marker>{sections.map(([id,label],i)=><a key={id} href={`#${id}`} aria-label={`Ir para a seção ${i+1}: ${label}`} aria-current={active===id?'true':undefined} className={active===id?styles.active:''}><BeanIcon/><span className={styles.tooltip}>{label}</span></a>)}</nav>}
