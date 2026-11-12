import type {NextConfig} from 'next';
const pages=process.env.NEXT_PUBLIC_GITHUB_PAGES==='true';
const nextConfig:NextConfig={devIndicators:false,turbopack:{root:process.cwd()},...(pages?{output:'export',distDir:'.next-pages',basePath:process.env.NEXT_PUBLIC_BASE_PATH||'',trailingSlash:true,pageExtensions:['tsx']} : {}),images:{qualities:[75,85],unoptimized:pages},...(!pages?{async headers(){return [
  {source:'/:path*',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'X-Frame-Options',value:'DENY'}]},
  {source:'/frames/:path*',headers:[{key:'Cache-Control',value:'public, max-age=31536000, immutable'}]},
]}}:{})};
export default nextConfig;
