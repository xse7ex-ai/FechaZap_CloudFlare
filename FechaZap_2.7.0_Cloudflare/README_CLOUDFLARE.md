# FechaZap 2.7.0 · Cloudflare Pages

Projeto pronto para ser conectado ao Cloudflare Pages via Git.

## Configuração do Cloudflare Pages

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/` (este ZIP já tem o `package.json` na raiz)
- Node: 20.x ou superior

O Cloudflare instala as dependências e gera o `dist` automaticamente durante o deploy.

## Variáveis de ambiente do frontend

Configure no Cloudflare Pages, em Settings → Environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Não coloque `WHATSAPP_TOKEN` no frontend. Esse segredo permanece na Supabase Edge Function.

## Supabase / WhatsApp

A função `supabase/functions/enviar-whatsapp` continua no projeto para referência e deploy pela Supabase. O build do frontend não precisa executar essa função.
