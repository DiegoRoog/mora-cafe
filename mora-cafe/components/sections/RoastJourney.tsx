'use client';
import {useRef} from 'react';
import {gsap,useGSAP} from '@/lib/gsap';
import {reducedMotion} from '@/lib/motion';
import {roastStages} from '@/lib/copy';
import {BeanIcon} from '@/components/ui/BeanIcon';
import styles from './Journey.module.css';
const curve='M40 470 C120 550 210 550 300 470 S520 250 640 190 S860 110 960 96';
export function RoastJourney(){const root=useRef<HTMLDivElement>(null);
  useGSAP(context=>{if(reducedMotion())return;let alive=true;
    import('gsap/MotionPathPlugin').then(({MotionPathPlugin})=>{if(!alive)return;context.add(()=>{
      gsap.registerPlugin(MotionPathPlugin);const el=root.current!,path=el.querySelector<SVGPathElement>('[data-curve]')!,length=path.getTotalLength();
      const temp=el.querySelector('[data-temperature]')!,time=el.querySelector('[data-time]')!,notes=Array.from(el.querySelectorAll<HTMLElement>('[data-roast-note]')),beans=Array.from(el.querySelectorAll<HTMLElement>('[data-roast-level]'));
      const state={p:0};const thresholds=[0,.38,.81,1],temps=[24,150,196,212],times=[0,240,510,630];
      const timeline=gsap.timeline({scrollTrigger:{trigger:el,start:'top top',end:'bottom bottom',scrub:.65,invalidateOnRefresh:true},defaults:{ease:'none'},onUpdate:()=>{const p=state.p;el.dataset.progress=p.toFixed(4);let i=p<.38?0:p<.81?1:2;const t=(p-thresholds[i])/(thresholds[i+1]-thresholds[i]);temp.textContent=String(Math.round(temps[i]+(temps[i+1]-temps[i])*t));const sec=Math.round(times[i]+(times[i+1]-times[i])*t);time.textContent=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;i=p<.28?0:p<.70?1:p<.93?2:3;notes.forEach((n,j)=>{n.style.opacity=j===i?'1':'0';n.style.transform=`translateY(${j===i?-(p-thresholds[Math.min(i,2)])*35:j<i?-24:24}px)`;n.setAttribute('aria-hidden',String(j!==i));});beans.forEach((b,j)=>b.style.opacity=j<Math.max(1,Math.round(p*3))?'1':'.22');}});
      gsap.set(path,{strokeDasharray:length,strokeDashoffset:length});
      timeline.to(state,{p:1,duration:1},0).to(path,{strokeDashoffset:0,duration:1},0).fromTo('[data-roast-paper]',{backgroundColor:'#f3e7d3'},{backgroundColor:'#ead6ba',duration:1},0);
      timeline.to('[data-traveler]',{motionPath:{path,align:path,alignOrigin:[.5,.5],autoRotate:20},duration:1},0);
      timeline.to('[data-bean-fill]',{fill:'#d8b54d',duration:.38},0).to('[data-bean-fill]',{fill:'#b7783a',duration:.22},.38).to('[data-bean-fill]',{fill:'#7a4a2a',duration:.21},.6).to('[data-bean-fill]',{fill:'#542510',duration:.19},.81);
      timeline.to('[data-bean-core]',{scale:1.22,transformOrigin:'50% 50%',duration:.018},.81).to('[data-bean-core]',{scale:1,duration:.018},.828);
      timeline.fromTo('[data-crack]',{opacity:0,scale:.4},{opacity:.9,scale:1.2,transformOrigin:'50% 50%',duration:.015},.81).to('[data-crack]',{opacity:0,scale:1.7,duration:.035},.825);
      timeline.fromTo('[data-stamp]',{scale:1.3,rotation:-12,autoAlpha:0},{scale:1,rotation:0,autoAlpha:1,duration:.05,ease:'power2.out'},.95);
      timeline.fromTo('[data-roast-heading]',{y:24},{y:-24,duration:1},0);
    });});return()=>{alive=false;};
  },{scope:root});
  return <div id="jornada" ref={root} className={styles.roastRail}>
    <div className={styles.roastStage} data-roast-paper>
      <div className={styles.roastCopy}><div data-roast-heading><p className="eyebrow">A jornada do grão</p><h2>Do grão verde<br/>ao <em>ponto Mora.</em></h2></div>
        <div className={styles.temperature}><span data-temperature>212</span><em>°C</em></div>
        <div className={styles.roastMeta}><span><span data-time>10:30</span> <span className={styles.metaLabel}>no tambor</span></span><span className={styles.roastLevel} role="img" aria-label="Torra média, 3 de 5">{Array.from({length:5},(_,i)=><span data-roast-level key={i} style={{opacity:i<3?1:.22}}><BeanIcon/></span>)}</span></div>
        <div className={styles.notes}>{roastStages.map((stage,i)=><div key={stage.title} data-roast-note className={`${styles.note} ${i===3?styles.lastNote:''}`}><p className="eyebrow">{stage.time} · {stage.temp} °C</p><h3>{stage.title}</h3><p>{stage.copy}</p></div>)}</div>
      </div>
      <div className={styles.graphPanel}><p className={`eyebrow ${styles.graphTitle}`}>Curva de torra · Lote MRC–0324</p>
        <svg viewBox="0 0 1000 600" className={styles.graph} role="img" aria-label="Curva ilustrativa da torra: o café passa pela secagem, primeiro estalo a 196 graus e ponto Mora a 212 graus">
          {[['212 °C',96],['196 °C',190],['150 °C',320],['100 °C',430]].map(([label,y])=><g key={label}><line x1="40" x2="960" y1={y} y2={y} stroke="currentColor" opacity=".16"/><text x="40" y={Number(y)-16}>{label}</text></g>)}
          <path d={curve} stroke="currentColor" strokeWidth="2" strokeDasharray="3 9" opacity=".18" fill="none"/>
          <path d={curve} data-curve stroke="currentColor" strokeWidth="3" fill="none"/>
          <g data-traveler transform="translate(960 96)"><g data-crack opacity="0">{Array.from({length:6},(_,i)=><path key={i} d="M0 -30V-43" stroke="var(--mora-caramel)" strokeWidth="3" transform={`rotate(${i*60})`}/>)}</g><g data-bean-core><ellipse data-bean-fill rx="20" ry="29" fill="#8e9b5b" transform="rotate(30)"/><path d="M10-22C-15-10 13 5-10 22" stroke="var(--mora-paper)" strokeWidth="2" fill="none"/></g></g>
          {['00:00','04:00','08:30','10:30'].map((t,i)=><text key={t} x={40+i*300} y="590" textAnchor={i===3?'end':'start'}>{t}</text>)}
        </svg>
        <div className={styles.stamp} data-stamp><BeanIcon rays/><span>Torra média</span><strong>Mora Café</strong><small>Lote MRC–0324</small></div>
        <p className={styles.graphCaption}>O tempo transforma. A gente encontra o ponto.<br/><span>Curva e valores ilustrativos de uma torra média.</span></p>
      </div>
    </div>
  </div>;
}
