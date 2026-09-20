# FechaZap + Supabase (2.7)

## O que mudou

A integração não usa mais login anônimo do Supabase para enviar uma mensagem. O navegador envia a **publishable key** no header `apikey`, e a Edge Function valida essa chave com `@supabase/server`.

Isso é compatível com as novas chaves `sb_publishable_...` e evita o erro causado por tentar transformar uma publishable key em JWT.

## 1. Front-end

O projeto já possui a URL do projeto e a publishable key configuradas. Se preferir configurar pelo ambiente de build, use:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

A publishable key pode aparecer no navegador. **Nunca coloque `sb_secret_...`, `service_role` ou `WHATSAPP_TOKEN` no front-end.**

## 2. Edge Function

No Supabase, atualize a função `enviar-whatsapp` com o arquivo:

`supabase/functions/enviar-whatsapp/index.ts`

A função deve estar com `verify_jwt = false` no `supabase/config.toml`, porque a autenticação da nova publishable key é feita dentro da função.

Depois faça o deploy da função.

## 3. Secrets da Meta

Em Edge Functions > Secrets, mantenha:

- `WHATSAPP_TOKEN` = token da Meta
- `PHONE_NUMBER_ID` = Phone Number ID da Meta
- `GRAPH_API_VERSION` = opcional; se omitido, o projeto usa `v26.0`
- `ALLOWED_ORIGIN` = opcional. Para produção, pode ser a URL do seu site, por exemplo `https://seuapp.netlify.app`

O token da Meta deve existir **somente no Supabase**.

## 4. Teste

1. Publique o front-end.
2. Abra um orçamento.
3. Toque em **Enviar pelo FechaZap**.
4. Abra Supabase > Edge Functions > `enviar-whatsapp` > Invocations.
5. A invocação deve aparecer mesmo quando a Meta ainda estiver configurada incorretamente. Se houver erro da Meta, ele aparecerá nos detalhes da invocação.

## Segurança

A função valida a publishable key, limita o volume de envios por origem/IP por janela de 1 minuto e valida telefone/mensagem. O limite em memória é uma proteção inicial. Quando contas e planos PRO/TURBO forem implementados, substitua-o por rate limiting persistente por usuário/plano.
