import type {ContactMessage} from './contact-schema';
export async function deliver(message:ContactMessage){
  // Portfolio demo only. Connect Resend (or another provider) here when using a real brand.
  // Avoid logging personal information in production when integrating a real provider.
  console.info('[Mora Café · envio demonstrativo]',{name:message.name,email:message.email,subject:message.subject,message:message.message});
}
