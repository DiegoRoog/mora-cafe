'use client';
import Image from 'next/image';
import {assetPath} from '@/lib/asset-path';
import {useEffect,useRef} from 'react';
import {gsap,ScrollTrigger} from '@/lib/gsap';
import {heroFrame,contactFrame} from '@/lib/easing';
import {reducedMotion} from '@/lib/motion';
import {FrameLoader,getManifest} from './frameLoader';
import styles from './FrameCanvas.module.css';
export function FrameCanvas({sequence,label}:{sequence:'s1'|'s4';label:string}){
  const canvasRef=useRef<HTMLCanvasElement>(null),rootRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const canvas=canvasRef.current!,root=rootRef.current!,section=root.closest('section')!;
    const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)return;
    let alive=true,loader:FrameLoader|undefined,preload:ScrollTrigger|undefined;
    let current=0,target=0,drawn=-1,visible=false,loaded=false,count=242,edge='#8d674f',focal=[.5,.5];
    const mobile=matchMedia('(max-width: 768px)').matches;const variant=mobile?'m':'d';
    const draw=()=>{if(!alive||!loader||!visible)return;const next=loader.nearest(Math.round(current));if(!next.bitmap||next.index===drawn)return;const bitmap=next.bitmap;const scale=Math.max(canvas.width/bitmap.width,canvas.height/bitmap.height);const w=bitmap.width*scale,h=bitmap.height*scale;ctx.fillStyle=edge;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,(canvas.width-w)*focal[0],(canvas.height-h)*focal[1],w,h);drawn=next.index;canvas.dataset.frame=String(next.index+1);canvas.dataset.decoded=String(loader.bitmaps.size);canvas.style.opacity='1';};
    const size=()=>{const box=root.getBoundingClientRect(),dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.max(1,Math.round(box.width*dpr));canvas.height=Math.max(1,Math.round(box.height*dpr));ctx.fillStyle=edge;ctx.fillRect(0,0,canvas.width,canvas.height);const decodeWidth=Math.min(mobile?1280:1920,Math.ceil(Math.max(canvas.width,canvas.height*16/9)));loader?.setSize(decodeWidth,Math.round(decodeWidth*9/16));drawn=-1;draw();};
    const resize=new ResizeObserver(size);resize.observe(root);size();
    let announced=false;
    const ready=()=>{if(!alive||announced)return;announced=true;root.dataset.loaded='true';window.dispatchEvent(new Event('mora:frames-ready'));};
    const start=async()=>{if(loaded||!alive)return;loaded=true;try{const data=(await getManifest()).sequences[sequence];if(!alive)return;edge=data.edgeColor;focal=[data.focalPoint[0],.5];count=data.variants[variant].count;
      if(reducedMotion()){const last=new window.Image();last.onload=()=>{if(alive){root.querySelector<HTMLElement>('[data-last-frame]')!.style.backgroundImage=`url(${last.src})`;root.style.setProperty('--last-opacity','1');ready();}};last.src=assetPath(`/frames/${sequence}/last.webp`);return;}
      target=(sequence==='s1'?heroFrame(trigger.progress):contactFrame(trigger.progress))*(count-1);current=target;
      loader=new FrameLoader(sequence,variant,count,draw,ready);size();loader.setActive(visible&&!document.hidden);loader.start();loader.update(Math.round(target));
    }catch{ready();}};
    const tick=()=>{if(!visible||document.hidden||!loader)return;current+=(target-current)*.18;if(Math.abs(target-current)<.01)current=target;const index=Math.round(current);if(index!==Number(canvas.dataset.requested)){canvas.dataset.requested=String(index);loader.update(index);}draw();};
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;loader?.setActive(visible&&!document.hidden);if(visible){if(sequence==='s4'&&window.scrollY>section.offsetTop-innerHeight*2)void start();drawn=-1;loader?.update(Math.round(current));draw();}else canvas.dataset.decoded='0';},{rootMargin:'100px'});observer.observe(root);
    const trigger=ScrollTrigger.create({trigger:section,start:()=>sequence==='s4'&&!reducedMotion()?`top+=${innerHeight} top`:'top top',end:'bottom bottom',onUpdate:self=>{const p=self.progress;section.dataset.progress=p.toFixed(4);target=(sequence==='s1'?heroFrame(p):contactFrame(p))*(count-1);}});
    if(sequence==='s4')preload=ScrollTrigger.create({trigger:'#historia',start:'50% top',onEnter:()=>void start()});
    let timer=0;const afterLoad=()=>{timer=window.setTimeout(()=>{if(sequence==='s1')void start();},500);};
    if(document.readyState==='complete')afterLoad();else window.addEventListener('load',afterLoad,{once:true});
    const visibility=()=>{loader?.setActive(visible&&!document.hidden);drawn=-1;};document.addEventListener('visibilitychange',visibility);
    const ceiling=window.setTimeout(ready,3000);
    gsap.ticker.add(tick);
    return()=>{alive=false;clearTimeout(timer);clearTimeout(ceiling);window.removeEventListener('load',afterLoad);document.removeEventListener('visibilitychange',visibility);observer.disconnect();resize.disconnect();trigger?.kill();preload?.kill();gsap.ticker.remove(tick);loader?.destroy();};
  },[sequence]);
  return <div ref={rootRef} className={styles.frame} data-frame-layer={sequence}>
    <Image src={assetPath(`/frames/${sequence}/poster.webp`)} alt="" width={1920} height={1080} unoptimized preload={sequence==='s1'} loading={sequence==='s1'?undefined:'lazy'} className={styles.poster}/>
    <div className={styles.last} data-last-frame/>
    <canvas ref={canvasRef} className={styles.canvas} role="img" aria-label={label}/>
    {sequence==='s1'&&<div className={styles.loading} aria-hidden="true"><span>Mora Café</span><i/><small>Moendo os grãos…</small></div>}
  </div>;
}
