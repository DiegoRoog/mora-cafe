'use client';
import {useSyncExternalStore} from 'react';
type Connection={saveData?:boolean;effectiveType?:string;addEventListener?:(type:string,callback:()=>void)=>void;removeEventListener?:(type:string,callback:()=>void)=>void};
export function connection(){return (navigator as Navigator&{connection?:Connection}).connection;}
export function reducedMotion(){return matchMedia('(prefers-reduced-motion: reduce)').matches||matchMedia('(max-height: 620px)').matches||Boolean(connection()?.saveData);}
function subscribeMotion(callback:()=>void){const media=[matchMedia('(prefers-reduced-motion: reduce)'),matchMedia('(max-height: 620px)')];media.forEach(m=>m.addEventListener('change',callback));const net=connection();net?.addEventListener?.('change',callback);return()=>{media.forEach(m=>m.removeEventListener('change',callback));net?.removeEventListener?.('change',callback);};}
export function useReducedMotion(){return useSyncExternalStore(subscribeMotion,reducedMotion,()=>false);}
function subscribeVariant(callback:()=>void){const media=matchMedia('(max-width: 768px)');media.addEventListener('change',callback);return()=>media.removeEventListener('change',callback);}
export function useFrameVariant(){return useSyncExternalStore<'m'|'d'>(subscribeVariant,()=>matchMedia('(max-width: 768px)').matches?'m':'d',()=>'d');}
export function useActiveSection(nav=false){return useSyncExternalStore(cb=>{window.addEventListener('mora:section',cb);return()=>window.removeEventListener('mora:section',cb);},()=>(nav?document.documentElement.dataset.activeNav:undefined)||document.documentElement.dataset.activeSection||'inicio',()=>'inicio');}
export function overlayState(open:boolean){window.dispatchEvent(new CustomEvent('mora:overlay',{detail:open}));}
