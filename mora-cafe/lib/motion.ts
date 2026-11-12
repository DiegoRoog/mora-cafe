'use client';
import {useSyncExternalStore} from 'react';
export function reducedMotion(){return matchMedia('(prefers-reduced-motion: reduce)').matches||Boolean((navigator as Navigator&{connection?:{saveData?:boolean}}).connection?.saveData);}
export function useActiveSection(){return useSyncExternalStore(cb=>{window.addEventListener('mora:section',cb);return()=>window.removeEventListener('mora:section',cb);},()=>document.documentElement.dataset.activeSection||'inicio',()=>'inicio');}
export function overlayState(open:boolean){window.dispatchEvent(new CustomEvent('mora:overlay',{detail:open}));}
