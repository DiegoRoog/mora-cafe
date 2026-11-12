'use client';
import type {RefObject} from 'react';
import {useGSAP,ScrollTrigger} from '@/lib/gsap';
export function useSectionProgress(section:RefObject<HTMLElement|null>,update:(progress:number)=>void){
  useGSAP(()=>{if(!section.current)return;ScrollTrigger.create({trigger:section.current,start:'top top',end:'bottom bottom',onUpdate:self=>update(self.progress)});},{scope:section});
}
