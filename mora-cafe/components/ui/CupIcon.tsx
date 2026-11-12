export function CupIcon({variant=0}:{variant?:number}){return <svg viewBox="0 0 90 86" width="72" height="70" fill="currentColor" aria-hidden="true">
  {variant===0?<><path d="M13 34h48v14c0 15-10 24-24 24S13 63 13 48Z"/><path d="M61 38h8a12 12 0 0 1 0 24H55v-6h13a6 6 0 1 0 0-12h-7Z"/><path d="M7 76h64c-6 8-57 8-64 0Z"/></>:variant===1?<><path d="M17 27h42v42a8 8 0 0 1-8 8H25a8 8 0 0 1-8-8Z"/><path d="M59 34h10a15 15 0 0 1 0 30H57v-7h11a8 8 0 0 0 0-16h-9Z"/></>:<><path d="M24 42h34l-3 25c-1 10-27 10-28 0Z"/><path d="M57 46h8a10 10 0 0 1 0 20H55v-5h8a5 5 0 1 0 0-10h-6Z"/><path d="M16 77h50c-5 7-45 7-50 0Z"/></>}
  {variant===1&&<path d="M34 20c-9-9 12-10 4-18" fill="none" stroke="currentColor" strokeWidth="2" opacity=".6"/>}
</svg>}
