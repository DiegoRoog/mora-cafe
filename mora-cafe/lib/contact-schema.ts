import {z} from 'zod';
export const subjects=['Quero provar','Encomendar um lote','Eventos','Outro'] as const;
export const contactSchema=z.object({name:z.string().trim().min(2,'Escreva seu nome, com pelo menos 2 caracteres.').max(100,'Use até 100 caracteres.'),email:z.email('Informe um e-mail válido.').max(254),subject:z.enum(subjects,{error:'Escolha um assunto.'}),message:z.string().trim().min(10,'Conte um pouco mais: escreva pelo menos 10 caracteres.').max(3000,'Use até 3.000 caracteres.'),website:z.string().max(300).optional().default('')});
export type ContactMessage=z.infer<typeof contactSchema>;
export type ContactErrors=Partial<Record<keyof ContactMessage,string[]>>;
export type ContactResponse={ok:true}|{ok:false;errors?:ContactErrors;message:string};
