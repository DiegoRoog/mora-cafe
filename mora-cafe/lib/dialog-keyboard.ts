import type {KeyboardEvent} from 'react';
/** Keep Tab in the modal, including the transition from its error summary. */
export function trapDialogTab(event:KeyboardEvent<HTMLDialogElement>){
  if(event.key!=='Tab')return;
  const controls=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]')).filter(el=>el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden');
  const first=controls[0],last=controls.at(-1);if(!first||!last)return;
  const current=document.activeElement;
  if(event.shiftKey&&(current===first||!controls.includes(current as HTMLElement))){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&(current===last||!controls.includes(current as HTMLElement))){event.preventDefault();first.focus();}
}
