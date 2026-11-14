 'use client';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useGSAP as useGSAPContext} from '@gsap/react';
import type {RefObject} from 'react';
import {useReducedMotion} from './motion';
gsap.registerPlugin(ScrollTrigger,useGSAPContext);
/** Revert each scoped timeline when motion/layout preferences change. */
function useGSAP(callback:(context:gsap.Context)=>void|(()=>void),config:{scope?:RefObject<Element|null>|Element|string;dependencies?:unknown[]}={}){const reduced=useReducedMotion();return useGSAPContext(callback,{...config,dependencies:[reduced,...(config.dependencies||[])],revertOnUpdate:true});}
export {gsap,ScrollTrigger,useGSAP};
