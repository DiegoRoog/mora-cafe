import {assetPath} from '@/lib/asset-path';
import {connection} from '@/lib/motion';
export type SequenceManifest={count:number;width:number;height:number;edgeColor:string;focalPoint:number[];blurDataURL:string;variants:Record<'d'|'m',{count:number;width:number;height:number;totalBytes:number}>};
export type Manifest={sequences:Record<'s1'|'s4',SequenceManifest>};
let manifestPromise:Promise<Manifest>|undefined;
export const getManifest=()=>manifestPromise??=(fetch(assetPath('/frames/manifest.json')).then(r=>{if(!r.ok)throw new Error('Manifest unavailable');return r.json() as Promise<Manifest>}).catch(e=>{manifestPromise=undefined;throw e;}));

/** Fetch only the moving window; HTTP caching handles previously visited frames. */
export class FrameLoader{
  blobs=new Map<number,Blob>();bitmaps=new Map<number,ImageBitmap>();
  private controller=new AbortController();private pending=new Set<number>();private decoding=new Set<number>();private failed=new Set<number>();
  private queue:number[]=[];private running=0;private disposed=false;private desired=0;private direction=1;private active=false;private generation=0;private announced=false;
  private width=1920;private height=1080;private previous=0;
  private ahead:number;private behind:number;private concurrency:number;
  constructor(readonly key:'s1'|'s4',readonly variant:'d'|'m',readonly count:number,private notify:()=>void,private ready:()=>void){
    const slow=/^(slow-2g|2g|3g)$/.test(connection()?.effectiveType||'');
    this.ahead=slow?3:variant==='m'?5:8;this.behind=slow?1:variant==='m'?2:3;this.concurrency=slow?2:6;
  }
  start(){if(this.active)this.update(this.desired);else{this.queue=[0,1,2,3].filter(i=>i<this.count);this.pump();}}
  setSize(width:number,height:number){if(this.width===width&&this.height===height)return;this.width=width;this.height=height;this.releaseDecoded();if(this.active)this.update(this.desired);}
  setActive(active:boolean){this.active=active;if(active)this.update(this.desired);else{this.queue=[];this.releaseDecoded();}}
  private inside(index:number){const delta=(index-this.desired)*this.direction;return delta>=-this.behind&&delta<=this.ahead;}
  update(index:number){
    index=Math.max(0,Math.min(this.count-1,index));this.direction=index===this.previous?this.direction:index>this.previous?1:-1;this.previous=index;this.desired=index;
    for(const[i,b]of this.bitmaps)if(!this.inside(i)){b.close();this.bitmaps.delete(i);}
    const offsets=[0,...Array.from({length:this.ahead},(_,i)=>i+1),...Array.from({length:this.behind},(_,i)=>-i-1)];
    this.queue=[];
    for(const offset of offsets){const i=index+offset*this.direction;if(i<0||i>=this.count)continue;if(this.blobs.has(i))this.decode(i);else if(!this.pending.has(i))this.queue.push(i);}
    const limit=this.variant==='m'?24:36;
    if(this.blobs.size>limit)for(const i of [...this.blobs.keys()].sort((a,b)=>Math.abs(b-index)-Math.abs(a-index))){if(this.blobs.size<=limit)break;if(!this.inside(i)&&!this.decoding.has(i))this.blobs.delete(i);}
    if(this.active)this.pump();
  }
  nearest(index:number){let found:ImageBitmap|undefined,best=Infinity,actual=-1;for(const[i,bitmap]of this.bitmaps)if(Math.abs(i-index)<best){best=Math.abs(i-index);found=bitmap;actual=i;}return{bitmap:found,index:actual};}
  private decode(index:number){
    if(this.disposed||!this.active||this.failed.has(index)||this.decoding.has(index)||this.bitmaps.has(index)||!this.inside(index)||this.decoding.size>=3)return;
    const blob=this.blobs.get(index);if(!blob)return;this.decoding.add(index);const generation=this.generation;
    createImageBitmap(blob,{resizeWidth:this.width,resizeHeight:this.height,resizeQuality:'medium'}).then(bitmap=>{
      if(this.disposed||!this.active||generation!==this.generation||!this.inside(index)){bitmap.close();return;}
      this.bitmaps.set(index,bitmap);this.notify();
      if(!this.announced){this.announced=true;this.ready();}
    }).catch(()=>{this.failed.add(index);}).finally(()=>{
      this.decoding.delete(index);
      if(!this.disposed&&this.active)for(const i of this.blobs.keys())if(this.inside(i)&&!this.bitmaps.has(i)&&!this.decoding.has(i)){this.decode(i);if(this.decoding.size>=3)break;}
    });
  }
  private pump(){
    while(!this.disposed&&this.running<this.concurrency&&this.queue.length){const i=this.queue.shift()!;if(this.blobs.has(i)||this.pending.has(i))continue;this.running++;this.pending.add(i);
      fetch(assetPath('/frames/'+this.key+'/'+this.variant+'/'+String(i+1).padStart(4,'0')+'.webp'),{signal:this.controller.signal}).then(r=>{if(!r.ok)throw new Error('Frame unavailable');return r.blob();}).then(blob=>{if(this.disposed)return;this.blobs.set(i,blob);this.decode(i);}).catch(()=>{/* Keep previous image/poster on failure. */}).finally(()=>{this.running--;this.pending.delete(i);this.pump();});
    }
  }
  releaseDecoded(){this.generation++;this.bitmaps.forEach(b=>b.close());this.bitmaps.clear();}
  destroy(){this.disposed=true;this.controller.abort();this.queue=[];this.releaseDecoded();this.blobs.clear();}
}
