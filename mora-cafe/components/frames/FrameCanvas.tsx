'use client';
import Image from 'next/image';
import {assetPath} from '@/lib/asset-path';
import {useEffect,useRef} from 'react';
import {gsap,ScrollTrigger} from '@/lib/gsap';
import {heroFrame,contactFrame} from '@/lib/easing';
import {reducedMotion,useReducedMotion,useFrameVariant} from '@/lib/motion';
import {FrameLoader,getManifest} from './frameLoader';
import styles from './FrameCanvas.module.css';
export function FrameCanvas({sequence,label}:{sequence:'s1'|'s4';label:string}){
  const canvasRef=useRef<HTMLCanvasElement>(null),rootRef=useRef<HTMLDivElement>(null);
  const reduced=useReducedMotion(),variant=useFrameVariant();
  useEffect(()=>{
    const canvas=canvasRef.current!,root=rootRef.current!,section=root.closest('section')!;
    const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)return;
    let alive=true,loader:FrameLoader|undefined,preload:ScrollTrigger|undefined;
    let current=0,target=0,drawn=-1,drawnBitmap:ImageBitmap|undefined,drawnSecond:ImageBitmap|undefined,drawnMix=-1,paintCount=0,lastScrollTime=0,visible=false,loaded=false,count=242,edge='#8d674f',focal=[.5,.5];
    const mobile=variant==='m';canvas.dataset.variant=variant;canvas.style.opacity='0';root.style.setProperty('--last-opacity','0');delete canvas.dataset.requested;delete canvas.dataset.frame;canvas.dataset.decoded='0';
    const draw=()=>{
      if(!alive||!loader||!visible)return;
      canvas.dataset.downloaded=String(loader.blobs.size);canvas.dataset.previews=String(loader.previews.size);
      const lower=Math.floor(current),upper=Math.min(count-1,lower+1),a=loader.frame(lower),b=loader.frame(upper);
      const pair=Boolean(a&&b&&lower!==upper),mix=pair?current-lower:0;
      const nearest=loader.nearest(Math.round(current)),bitmap=pair?a:nearest.bitmap,second=pair?b:undefined;
      const index=pair?(mix<.5?lower:upper):nearest.index;
      if(!bitmap||(index===drawn&&bitmap===drawnBitmap&&second===drawnSecond&&Math.abs(mix-drawnMix)<.001))return;
      const paint=(frame:ImageBitmap)=>{const scale=Math.max(canvas.width/frame.width,canvas.height/frame.height),w=frame.width*scale,h=frame.height*scale;ctx.drawImage(frame,(canvas.width-w)*focal[0],(canvas.height-h)*focal[1],w,h);};
      ctx.globalAlpha=1;ctx.fillStyle=edge;ctx.fillRect(0,0,canvas.width,canvas.height);paint(bitmap);
      if(second&&mix>.001){ctx.globalAlpha=mix;paint(second);ctx.globalAlpha=1;}
      drawn=index;drawnBitmap=bitmap;drawnSecond=second;drawnMix=mix;
      canvas.dataset.frame=String(index+1);canvas.dataset.paint=String(++paintCount);canvas.dataset.decoded=String(loader.bitmaps.size);
      canvas.dataset.quality=bitmap.width===320||second?.width===320?'preview':'full';canvas.style.opacity='1';
    };
    const size=()=>{const box=root.getBoundingClientRect(),dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.max(1,Math.round(box.width*dpr));canvas.height=Math.max(1,Math.round(box.height*dpr));ctx.fillStyle=edge;ctx.fillRect(0,0,canvas.width,canvas.height);const decodeWidth=Math.min(mobile?1280:1920,Math.ceil(Math.max(canvas.width,canvas.height*16/9)));loader?.setSize(decodeWidth,Math.round(decodeWidth*9/16));drawn=-1;draw();};
    const resize=new ResizeObserver(size);resize.observe(root);size();
    let announced=false;
    const ready=()=>{if(!alive||announced)return;announced=true;root.dataset.loaded='true';window.dispatchEvent(new Event('mora:frames-ready'));};
    const start=async()=>{if(loaded||!alive)return;loaded=true;try{const data=(await getManifest()).sequences[sequence];if(!alive)return;edge=data.edgeColor;focal=[data.focalPoint[0],.5];count=data.variants[variant].count;
      if(reducedMotion()){const last=new window.Image();last.onload=()=>{if(alive){root.querySelector<HTMLElement>('[data-last-frame]')!.style.backgroundImage=`url(${last.src})`;root.style.setProperty('--last-opacity','1');ready();}};last.src=assetPath(`/frames/${sequence}/${sequence==='s1'?'poster':'last'}.webp`);return;}
      target=(sequence==='s1'?heroFrame(trigger.progress):contactFrame(trigger.progress))*(count-1);current=target;
      loader=new FrameLoader(sequence,variant,count,draw,ready);size();loader.setActive(visible&&!document.hidden);loader.start();if(visible)loader.update(Math.round(target));
    }catch{ready();}};
    const tick=()=>{if(!visible||document.hidden||!loader)return;const goal=performance.now()-lastScrollTime>140?Math.round(target):target;current+=(goal-current)*.18;if(Math.abs(goal-current)<.01)current=goal;const index=Math.round(current);if(index!==Number(canvas.dataset.requested)){canvas.dataset.requested=String(index);loader.update(index);}draw();};
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;loader?.setActive(visible&&!document.hidden);if(visible){if(sequence==='s4'&&window.scrollY>section.offsetTop-innerHeight*2)void start();drawn=-1;loader?.update(Math.round(current));draw();}else canvas.dataset.decoded='0';},{rootMargin:'100px'});observer.observe(root);
    const trigger=ScrollTrigger.create({trigger:section,start:()=>sequence==='s4'&&!reducedMotion()?`top+=${innerHeight} top`:'top top',end:'bottom bottom',onUpdate:self=>{const p=self.progress;section.dataset.progress=p.toFixed(4);lastScrollTime=performance.now();target=(sequence==='s1'?heroFrame(p):contactFrame(p))*(count-1);}});
    if(sequence==='s4')preload=ScrollTrigger.create({trigger:'#historia',start:'50% top',onEnter:()=>void start()});
    let timer=0;const afterLoad=()=>{timer=window.setTimeout(()=>{if(sequence==='s1')void start();},500);};
    if(document.readyState==='complete')afterLoad();else window.addEventListener('load',afterLoad,{once:true});
    const visibility=()=>{loader?.setActive(visible&&!document.hidden);drawn=-1;};document.addEventListener('visibilitychange',visibility);
    const ceiling=window.setTimeout(ready,3000);
    gsap.ticker.add(tick);
    return()=>{alive=false;clearTimeout(timer);clearTimeout(ceiling);window.removeEventListener('load',afterLoad);document.removeEventListener('visibilitychange',visibility);observer.disconnect();resize.disconnect();trigger?.kill();preload?.kill();gsap.ticker.remove(tick);loader?.destroy();};
  },[sequence,reduced,variant]);
  return <div ref={rootRef} className={styles.frame} data-frame-layer={sequence}>
    <Image src={assetPath(`/frames/${sequence}/poster.webp`)} alt="" width={1920} height={1080} unoptimized preload={sequence==='s1'} loading={sequence==='s1'?undefined:'lazy'} className={styles.poster}/>
    <div className={styles.last} data-last-frame/>
    <canvas ref={canvasRef} className={styles.canvas} role="img" aria-label={label}/>
    {sequence==='s1'&&<div className={styles.loading} aria-hidden="true"><span>Mora Café</span><i/><small>Moendo os grãos…</small></div>}
  </div>;
}
