/** GitHub project Pages uses a repository prefix; local/server builds use root. */
export function assetPath(path:string){return `${process.env.NEXT_PUBLIC_BASE_PATH||''}${path}`;}
