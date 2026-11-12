import sharp from 'sharp';
import {readdir,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const base=path.resolve(project,'../../Frame');
const sources={s1:process.argv[2]||process.env.MORA_S1||path.join(base,'Seção 1'),s4:process.argv[3]||process.env.MORA_S4||path.join(base,'Seção 4')};
const destination=path.join(project,'public/frames');
sharp.concurrency(2);sharp.cache({memory:64,files:0,items:32});
const natural=new Intl.Collator('pt-BR',{numeric:true});
const manifest={version:1,generatedAt:new Date().toISOString(),sequences:{}};
const pad=n=>String(n).padStart(4,'0');
async function pool(items,worker,concurrency=4){let cursor=0;await Promise.all(Array.from({length:concurrency},async()=>{while(cursor<items.length){const i=cursor++;await worker(items[i],i);}}));}
for(const [key,source] of Object.entries(sources)){
  const names=(await readdir(source)).filter(n=>/\.png$/i.test(n)).sort(natural.compare);
  if(!names.length)throw new Error(`Nenhum PNG em ${source}`);
  const numbers=names.map(n=>Number(n.match(/(\d+)\D*$/)?.[1]));
  for(let i=1;i<numbers.length;i++)if(numbers[i]!==numbers[i-1]+1)throw new Error(`Lacuna/duplicata em ${key}: ${names[i]}`);
  const first=await sharp(path.join(source,names[0])).metadata();
  await pool(names,async name=>{const m=await sharp(path.join(source,name)).metadata();if(m.width!==first.width||m.height!==first.height)throw new Error(`Dimensões divergentes: ${name}`);});
  const indices={d:names.map((_,i)=>i),m:[...new Set([...names.map((_,i)=>i).filter(i=>i%2===0),names.length-1])]};
  const variants={};
  for(const [variant,list] of Object.entries(indices)){
    const width=variant==='d'?1920:1280,height=variant==='d'?1080:720,initialQuality=variant==='d'?78:70;
    const dir=path.join(destination,key,variant);await mkdir(dir,{recursive:true});
    const limit=(variant==='d'?25:10)*1024*1024;
    let quality=initialQuality,totalBytes=0;
    // Per-frame ceiling keeps total within budget without dropping supplied frames.
    await pool(list,async (sourceIndex,index)=>{
      const output=path.join(dir,`${pad(index+1)}.webp`);
      let q=initialQuality;
      let buffer=await sharp(path.join(source,names[sourceIndex])).resize(width,height,{fit:'cover'}).webp({quality:q,effort:4}).toBuffer();
      while(buffer.length>limit/list.length&&q>36){q-=6;buffer=await sharp(path.join(source,names[sourceIndex])).resize(width,height,{fit:'cover'}).webp({quality:q,effort:4}).toBuffer();}
      quality=Math.min(quality,q);await writeFile(output,buffer);totalBytes+=buffer.length;
      if((index+1)%60===0)console.log(`${key}/${variant}: ${index+1}/${list.length}`);
    });
    if(totalBytes>limit)throw new Error(`${key}/${variant}: orçamento excedido: ${totalBytes}`);
    variants[variant]={count:list.length,width,height,totalBytes,qualityMin:quality,qualityMax:initialQuality,sourceIndices:list.map(i=>i+1)};
    console.log(`${key}/${variant}: ${(totalBytes/1024/1024).toFixed(2)} MiB`);
  }
  const dir=path.join(destination,key);
  let poster=await sharp(path.join(source,names[0])).resize(1920,1080,{fit:'cover'}).webp({quality:78}).toBuffer();
  if(poster.length>150*1024)poster=await sharp(poster).webp({quality:60}).toBuffer();
  await writeFile(path.join(dir,'poster.webp'),poster);
  await writeFile(path.join(dir,'last.webp'),await sharp(path.join(source,names.at(-1))).resize(1920,1080,{fit:'cover'}).webp({quality:78}).toBuffer());
  const blur=await sharp(poster).resize(24).webp({quality:40}).toBuffer();
  const edge=await sharp(path.join(source,names[0])).extract({left:0,top:0,width:first.width,height:8}).stats();
  const edgeColor='#'+edge.channels.slice(0,3).map(c=>Math.round(c.mean).toString(16).padStart(2,'0')).join('');
  manifest.sequences[key]={count:names.length,sourceWidth:first.width,sourceHeight:first.height,hasAlpha:first.hasAlpha,width:1920,height:1080,extension:'webp',edgeColor,focalPoint:[.5,key==='s1'?.62:.55],posterBytes:poster.length,blurDataURL:`data:image/webp;base64,${blur.toString('base64')}`,variants};
}
await writeFile(path.join(destination,'manifest.json'),JSON.stringify(manifest,null,2));
const images=path.join(project,'public/images');await mkdir(images,{recursive:true});
await sharp(path.join(base,'FUNDO SEÇÃO 2.png')).webp({quality:85}).toFile(path.join(images,'fundo-secao-2.webp'));
await sharp(path.join(destination,'s1/poster.webp')).resize(1200,630,{fit:'cover'}).jpeg({quality:85}).toFile(path.join(images,'og-mora.jpg'));
const report=Object.entries(manifest.sequences).map(([key,s])=>({key,desktopMiB:(s.variants.d.totalBytes/1048576).toFixed(2),mobileMiB:(s.variants.m.totalBytes/1048576).toFixed(2)}));
console.log(JSON.stringify(report,null,2));
