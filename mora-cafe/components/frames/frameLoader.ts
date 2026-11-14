import {assetPath} from '@/lib/asset-path';
export type SequenceManifest={count:number;width:number;height:number;edgeColor:string;focalPoint:number[];blurDataURL:string;variants:Record<'d'|'m',{count:number;width:number;height:number;totalBytes:number}>};
export type Manifest={sequences:Record<'s1'|'s4',SequenceManifest>};
let manifestPromise:Promise<Manifest>|undefined;
export const getManifest=()=>manifestPromise??=(fetch(assetPath('/frames/manifest.json')).then(r=>{if(!r.ok)throw new Error('Manifest unavailable');return r.json() as Promise<Manifest>}).catch(e=>{manifestPromise=undefined;throw e;}));

/** Network cache and decoded caches have separate budgets.
 * Keep compressed frames for reversal; small previews bridge full-resolution decode latency. */
export class FrameLoader{
  blobs=new Map<number,Blob>();bitmaps=new Map<number,ImageBitmap>();previews=new Map<number,ImageBitmap>();
  private controller=new AbortController();private pending=new Set<number>();private decoding=new Set<number>();private previewing=new Set<number>();
  private queue:number[]=[];private retries=new Map<number,number>();private fullFailures=new Set<number>();private previewFailures=new Set<number>();private running=0;private disposed=false;private desired=0;private direction=1;private active=false;private generation=0;private announced=false;private started=false;
  private width=1920;private height=1080;private previous=0;private speed=0;private previewTimer:ReturnType<typeof setTimeout>|undefined;
  private get budget(){return this.variant==='m'?10:18;}
  constructor(readonly key:'s1'|'s4',readonly variant:'d'|'m',readonly count:number,private notify:()=>void,private ready:()=>void){}
  start(){if(this.started)return;this.started=true;this.prioritize();this.pump();}
  setSize(width:number,height:number){if(this.width===width&&this.height===height)return;this.width=width;this.height=height;for(const b of this.bitmaps.values())b.close();this.bitmaps.clear();this.generation++;this.drain();}
  setActive(active:boolean){this.active=active;if(active){this.prioritize();this.drain();this.schedulePreview();}else this.releaseDecoded();}
  update(index:number){
    index=Math.max(0,Math.min(this.count-1,index));
    this.speed=this.speed*.75+Math.abs(index-this.previous)*.25;
    this.direction=index===this.previous?this.direction:index>this.previous?1:-1;this.previous=index;this.desired=index;
    this.prioritize();this.prune();this.drain();this.schedulePreview();
  }
  private priority(){
    const lead=Math.min(72,Math.max(20,Math.ceil(this.speed*24))),list=[this.desired];
    for(let n=1;n<=lead;n++){list.push(this.desired+n*this.direction);if(n<=10)list.push(this.desired-n*this.direction);}
    return list.filter(i=>i>=0&&i<this.count);
  }
  private prioritize(){
    const coarse=Array.from({length:this.count},(_,i)=>i).filter(i=>i%4===0);
    const all=Array.from({length:this.count},(_,i)=>i);
    // Never throw away the background queue or previously fetched compressed frames.
    this.queue=[...new Set([...this.priority(),...coarse,this.count-1,...this.queue,...all])].filter(i=>!this.blobs.has(i)&&!this.pending.has(i)&&(this.retries.get(i)||0)<3);
    if(this.started)this.pump();
  }
  nearest(index:number){
    let bitmap:ImageBitmap|undefined,actual=-1,distance=Infinity;
    for(const cache of [this.bitmaps,this.previews])for(const[i,b]of cache){const d=Math.abs(i-index);if(d<distance){distance=d;actual=i;bitmap=b;}}
    return{bitmap,index:actual};
  }
  private prune(){
    if(this.bitmaps.size<=this.budget)return;
    for(const[i,b]of [...this.bitmaps].sort(([a],[b])=>Math.abs(b-this.desired)-Math.abs(a-this.desired))){if(this.bitmaps.size<=this.budget)break;b.close();this.bitmaps.delete(i);}
  }
  private drain(){
    if(!this.active||this.disposed)return;
    for(const i of this.priority().slice(0,this.budget)){if(this.decoding.size>=2)break;if(this.blobs.has(i)&&!this.bitmaps.has(i)&&!this.decoding.has(i)&&!this.fullFailures.has(i))this.decode(i);}
  }
  private decode(index:number){
    const blob=this.blobs.get(index);if(!blob)return;this.decoding.add(index);const generation=this.generation;
    createImageBitmap(blob,{resizeWidth:this.width,resizeHeight:this.height,resizeQuality:'medium'}).then(bitmap=>{
      if(this.disposed||!this.active||generation!==this.generation){bitmap.close();return;}
      this.bitmaps.set(index,bitmap);this.prune();this.notify();
      if(!this.announced){this.announced=true;this.ready();}
    }).catch(()=>{this.fullFailures.add(index);}).finally(()=>{this.decoding.delete(index);if(!this.disposed)this.drain();});
  }
  private schedulePreview(){
    if(!this.active||this.disposed||this.previewTimer||this.previewing.size)return;
    this.previewTimer=setTimeout(()=>{this.previewTimer=undefined;this.decodePreview();},8);
  }
  private decodePreview(){
    if(!this.active||this.disposed)return;
    const coarse=Array.from({length:this.count},(_,i)=>i).filter(i=>i%4===0).sort((a,b)=>Math.abs(a-this.desired)-Math.abs(b-this.desired));
    const candidates=[...this.priority(),...coarse,...this.blobs.keys()];
    const index=candidates.find(i=>this.blobs.has(i)&&!this.previews.has(i)&&!this.previewing.has(i)&&!this.previewFailures.has(i));if(index===undefined)return;
    const generation=this.generation;this.previewing.add(index);
    createImageBitmap(this.blobs.get(index)!,{resizeWidth:320,resizeHeight:180,resizeQuality:'low'}).then(bitmap=>{
      if(this.disposed||!this.active||generation!==this.generation){bitmap.close();return;}
      this.previews.set(index,bitmap);this.notify();
    }).catch(()=>{this.previewFailures.add(index);}).finally(()=>{this.previewing.delete(index);this.schedulePreview();});
  }
  private pump(){
    while(!this.disposed&&this.running<6&&this.queue.length){const i=this.queue.shift()!;if(this.blobs.has(i)||this.pending.has(i))continue;this.running++;this.pending.add(i);
      fetch(assetPath('/frames/'+this.key+'/'+this.variant+'/'+String(i+1).padStart(4,'0')+'.webp'),{signal:this.controller.signal}).then(r=>{if(!r.ok)throw new Error('Frame unavailable');return r.blob();}).then(blob=>{if(this.disposed)return;this.blobs.set(i,blob);this.drain();this.schedulePreview();}).catch(()=>{if(!this.disposed){this.retries.set(i,(this.retries.get(i)||0)+1);if((this.retries.get(i)||0)<3)this.queue.push(i);}}).finally(()=>{this.running--;this.pending.delete(i);this.pump();});
    }
  }
  releaseDecoded(){this.generation++;if(this.previewTimer)clearTimeout(this.previewTimer);this.previewTimer=undefined;for(const cache of [this.bitmaps,this.previews]){cache.forEach(b=>b.close());cache.clear();}}
  destroy(){this.disposed=true;this.controller.abort();this.queue=[];this.releaseDecoded();this.blobs.clear();}
}
