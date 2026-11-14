'use client';
import {useEffect,useRef,useState,type FormEvent} from 'react';
import {contactSchema,subjects,type ContactErrors,type ContactResponse} from '@/lib/contact-schema';
import {overlayState} from '@/lib/motion';
import {trapDialogTab} from '@/lib/dialog-keyboard';
import {BeanIcon} from '@/components/ui/BeanIcon';
import {Button} from '@/components/ui/Button';
import styles from './ContactDialog.module.css';
export default function ContactDialog({onClose}:{onClose:()=>void}){const dialog=useRef<HTMLDialogElement>(null),form=useRef<HTMLFormElement>(null),summary=useRef<HTMLDivElement>(null),request=useRef<AbortController|null>(null);
  const[errors,setErrors]=useState<ContactErrors>({}),[notice,setNotice]=useState(''),[pending,setPending]=useState(false),[success,setSuccess]=useState(false);
  useEffect(()=>{const previous=document.activeElement as HTMLElement;dialog.current?.showModal();overlayState(true);return()=>{request.current?.abort();overlayState(false);previous?.focus();};},[]);
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();if(pending)return;setNotice('');const result=contactSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if(!result.success){setErrors(result.error.flatten().fieldErrors);setNotice('Confira os campos indicados.');requestAnimationFrame(()=>summary.current?.focus());return;}
    setErrors({});if(process.env.NEXT_PUBLIC_GITHUB_PAGES==='true'){setSuccess(true);requestAnimationFrame(()=>summary.current?.focus());return;}setPending(true);const controller=new AbortController();request.current=controller;const timeout=setTimeout(()=>controller.abort(),15000);
    try{const response=await fetch('/api/contato',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(result.data),signal:controller.signal});const payload=await response.json() as ContactResponse;if(payload.ok){setSuccess(true);requestAnimationFrame(()=>summary.current?.focus());}else{setErrors(payload.errors||{});setNotice(payload.message);requestAnimationFrame(()=>summary.current?.focus());}}
    catch{setNotice('A conexão não respondeu. Seus dados continuam aqui; tente novamente.');requestAnimationFrame(()=>summary.current?.focus());}finally{clearTimeout(timeout);setPending(false);}
  }
  return <dialog ref={dialog} className={styles.dialog} aria-labelledby="contact-title" onKeyDown={trapDialogTab} onCancel={event=>{event.preventDefault();onClose();}} onClick={event=>{if(event.target===dialog.current){const rect=dialog.current.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)onClose();}}} data-lenis-prevent>
    <button className={styles.close} onClick={onClose} aria-label="Fechar formulário">×</button>
    {success?<div className={styles.success} ref={summary} tabIndex={-1}><BeanIcon rays/><p className="eyebrow">Conversa boa começa assim</p><h2 id="contact-title">Recebemos!</h2><p>Simulação concluída. Nenhuma mensagem foi enviada.</p><p className={styles.demo}>Simulação de portfólio. Nenhum e-mail foi enviado e não haverá resposta real.</p><Button variant="solid-dark" onClick={onClose}>Fechar</Button></div>:<>
    <p className="eyebrow">Puxe uma cadeira</p><h2 id="contact-title">Vamos <em>conversar.</em></h2><p className={styles.intro}>Conte o que trouxe você até aqui.</p><p className={styles.demo}>Formulário demonstrativo. Nenhum e-mail será enviado.</p>
    <form ref={form} onSubmit={submit} noValidate>
      <div ref={summary} tabIndex={-1} className={styles.summary} aria-live="polite">{notice}</div>
      <div className={styles.row}><div className={styles.field}><label htmlFor="contact-name">Nome</label><input id="contact-name" name="name" autoComplete="name" maxLength={100} required aria-invalid={!!errors.name} aria-describedby={errors.name?'error-name':undefined}/>{errors.name&&<p id="error-name" className={styles.error}>{errors.name[0]}</p>}</div>
      <div className={styles.field}><label htmlFor="contact-email">E-mail</label><input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required aria-invalid={!!errors.email} aria-describedby={errors.email?'error-email':undefined}/>{errors.email&&<p id="error-email" className={styles.error}>{errors.email[0]}</p>}</div></div>
      <div className={styles.field}><label htmlFor="contact-subject">Assunto</label><select id="contact-subject" name="subject" defaultValue="Quero provar" aria-invalid={!!errors.subject}>{subjects.map(s=><option key={s}>{s}</option>)}</select></div>
      <div className={styles.field}><label htmlFor="contact-message">Mensagem</label><textarea id="contact-message" name="message" rows={4} maxLength={3000} required aria-invalid={!!errors.message} aria-describedby={errors.message?'error-message':undefined}/>{errors.message&&<p id="error-message" className={styles.error}>{errors.message[0]}</p>}</div>
      <div hidden aria-hidden="true"><label htmlFor="contact-website">Website</label><input id="contact-website" name="website" autoComplete="off" tabIndex={-1}/></div>
      <Button variant="solid-dark" type="submit" disabled={pending}>{pending?'Enviando…':'Enviar mensagem'}</Button>
    </form></>}
  </dialog>;
}
