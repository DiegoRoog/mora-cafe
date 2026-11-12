# Mora Café

Landing page em Next.js 16, React 19, TypeScript, CSS Modules, GSAP, Lenis e Canvas 2D. Projeto fictício de portfólio.

## Desenvolvimento

Na pasta `mora-cafe`: `npm ci`, depois `npm run dev`. Build de servidor: `npm run build`; execução: `npm run start`.

## GitHub Pages

Workflow `.github/workflows/pages.yml`: cada push em `main` compila a versão estática e publica pelo GitHub Actions. Configure Settings → Pages → Source → GitHub Actions.

O build define `NEXT_PUBLIC_GITHUB_PAGES=true`, `NEXT_PUBLIC_BASE_PATH=/mora-cafe` e `NEXT_PUBLIC_SITE_URL=https://diegoroog.github.io`. Os assets WebP necessários estão versionados; não são necessários originais PNG, ZIPs ou Git LFS. Ao trocar o nome do repositório, atualize o prefixo no workflow.

GitHub Pages não executa APIs. Nessa versão, o formulário valida os campos com Zod e apresenta sucesso de demonstração, sem transmitir os dados. A rota `app/api/contato/route.ts` permanece no código e funciona somente no build de servidor. Não há envio de e-mail em nenhum dos modos.

As fontes são baixadas pelo next/font no build e servidas localmente em produção. Não há segredos obrigatórios. `.env.example` contém apenas configuração pública de exemplo. `noindex` foi preservado por se tratar de marca fictícia.

## Atualizações

Edite o código, valide com `npm run lint` e faça commit e push para `main`. Acompanhe o workflow na aba Actions. Não altere as versões de dependências sem necessidade.
