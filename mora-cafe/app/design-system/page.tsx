import Link from 'next/link';
import {Button} from '@/components/ui/Button';
import {BeanIcon,RoastBeans} from '@/components/ui/BeanIcon';
import {CupIcon} from '@/components/ui/CupIcon';
import styles from './system.module.css';
const colors=['deep','ink','chocolate','roast','mocha-700','mocha-600','mocha-500','mocha-400','ray','kraft','paper','cream','caramel','amber','copper'];
export default function DesignSystem(){return <main id="conteudo" className={styles.system}>
  <header><Link href="/">← Voltar à experiência</Link><p className="eyebrow">Mora Café · Sistema visual</p><h1>Café de origem,<br/>feito <em>com tempo.</em></h1><p>Tokens e componentes implementados. Referência local para design e desenvolvimento.</p></header>
  <section><h2>01. Paleta</h2><div className={styles.swatches}>{colors.map(c=><div key={c}><div style={{background:`var(--mora-${c})`}}/><code>mora-{c}</code></div>)}</div></section>
  <section><h2>02. Tipografia</h2><div className={styles.type}><h3>Fraunces · O tempo transforma.</h3><p><em>Instrument Serif · A gente encontra o ponto.</em></p><p>Jost · Grãos do Sul de Minas, torrados em pequenos lotes.</p><span className="eyebrow">Jost · Café de origem · Lote MRC–0324</span></div></section>
  <section><h2>03. Ações e símbolos</h2><div className={styles.dark}><Button href="/#contato">Vamos conversar</Button><Button href="/#historia" variant="ghost">Conheça a Mora</Button><BeanIcon rays/><RoastBeans level={3}/><CupIcon variant={0}/><CupIcon variant={1}/><CupIcon variant={2}/></div><div className={styles.light}><Button href="/#cafes" variant="solid-dark">Conheça nossos cafés</Button><p>Focus: Tab · Hover: círculo de preenchimento · Press: escala 0,97</p></div></section>
  <section><h2>04. Ritmo e superfícies</h2><div className={styles.examples}><div><span className="eyebrow">Cartão · raio 28px</span><h3>Uma pausa<br/><em>bem-vinda.</em></h3><p>Espaço generoso, contraste quente e textura discreta.</p></div><div><span className="eyebrow">Movimento</span><p>Scrub de 0,65–0,8s. Sequências reversíveis; decoded frames limitados a 25 no desktop e 15 no mobile. Sem scroll estendido com movimento reduzido.</p><p>Easing: cubic-bezier(0.16, 1, 0.3, 1).</p></div></div></section>
  <footer>Projeto fictício de portfólio. A biblioteca no Figma depende da liberação da cota do plugin.</footer>
  </main>;}
