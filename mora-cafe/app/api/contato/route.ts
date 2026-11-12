import {NextRequest,NextResponse} from 'next/server';
import {contactSchema,type ContactResponse} from '@/lib/contact-schema';
import {deliver} from '@/lib/deliver';
export const runtime='nodejs';
const interval=10*60*1000,limit=5,maxEntries=10000;
const buckets=new Map<string,{count:number;expires:number}>();
const response=(data:ContactResponse,status=200,headers:Record<string,string>={})=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store',...headers}});
export async function POST(request:NextRequest){
  const now=Date.now();
  for(const[key,bucket]of buckets)if(bucket.expires<=now)buckets.delete(key);
  // Forwarded headers must be set by a trusted reverse proxy on deployment.
  const ip=request.headers.get('x-real-ip')||request.headers.get('x-forwarded-for')?.split(',')[0].trim()||'local';
  let bucket=buckets.get(ip);
  if(!bucket){if(buckets.size>=maxEntries)buckets.delete(buckets.keys().next().value!);bucket={count:0,expires:now+interval};buckets.set(ip,bucket);}
  if(bucket.count>=limit)return response({ok:false,message:'Muitas tentativas. Tente novamente em alguns minutos.'},429,{'Retry-After':String(Math.ceil((bucket.expires-now)/1000))});
  bucket.count++;
  if(!request.headers.get('content-type')?.includes('application/json'))return response({ok:false,message:'Envie os dados em JSON.'},400);
  if(Number(request.headers.get('content-length'))>16384)return response({ok:false,message:'Mensagem muito longa.'},400);
  let input:unknown;
  try{const body=await request.text();if(body.length>16384)return response({ok:false,message:'Mensagem muito longa.'},400);input=JSON.parse(body);}catch{return response({ok:false,message:'Não foi possível ler a mensagem.'},400);}
  if(input&&typeof input==='object'&&'website'in input&&input.website)return response({ok:true});
  const result=contactSchema.safeParse(input);
  if(!result.success)return response({ok:false,message:'Confira os campos indicados.',errors:result.error.flatten().fieldErrors},400);
  await deliver(result.data);return response({ok:true});
}
