import type { Metadata, Viewport } from 'next';
import type {CSSProperties} from 'react';
import {assetPath} from '@/lib/asset-path';
import { Fraunces, Instrument_Serif, Jost } from 'next/font/google';
import './globals.css';
const fraunces=Fraunces({subsets:['latin'],variable:'--font-fraunces',display:'swap',axes:['SOFT','WONK','opsz']});
const instrument=Instrument_Serif({subsets:['latin'],weight:'400',style:['normal','italic'],variable:'--font-instrument',display:'swap'});
const jost=Jost({subsets:['latin'],variable:'--font-jost',display:'swap'});
export const metadata:Metadata={
  metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000'),
  title:'Mora Café — Café de origem, feito com tempo',
  description:'Café de origem do Sul de Minas, torrado em pequenos lotes. Conheça os cafés e a jornada do grão da Mora. Projeto fictício de portfólio.',
  robots:{index:false,follow:false},
  openGraph:{title:'Mora Café — Café de origem, feito com tempo',description:'Torra média, calor de casa. Uma experiência de café, do grão à xícara.',locale:'pt_BR',type:'website',images:[{url:assetPath('/images/og-mora.jpg'),width:1200,height:630,alt:'Pacote de café Mora em cenário mocha'}]},
  twitter:{card:'summary_large_image',images:[assetPath('/images/og-mora.jpg')]},
};
export const viewport:Viewport={themeColor:'#2a1810',width:'device-width',initialScale:1};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){
  return <html lang="pt-BR"><body style={{'--paper-grain':`url("${assetPath('/images/paper-grain.svg')}")`} as CSSProperties} className={`${fraunces.variable} ${instrument.variable} ${jost.variable}`}><a href="#conteudo" className="skip-link">Pular para o conteúdo</a>{children}</body></html>;
}
