import { createSupabaseContext } from "npm:@supabase/server";

const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_TOKEN");
const PHONE_NUMBER_ID = Deno.env.get("PHONE_NUMBER_ID");
const GRAPH_API_VERSION = Deno.env.get("GRAPH_API_VERSION") ?? "v26.0";
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "";

// Limite simples por instância para reduzir abuso enquanto o sistema de contas/planos
// ainda não está ativo. Depois, substituiremos por rate limit persistente por usuário/plano.
const rateWindow = 60_000;
const maxRequestsPerWindow = 10;
const requests = new Map<string, { count: number; resetAt: number }>();

function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  const allowOrigin = ALLOWED_ORIGIN
    ? (origin === ALLOWED_ORIGIN ? origin : "")
    : "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
    "Content-Type": "application/json; charset=utf-8",
  };
}

function json(req: Request, payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: corsHeaders(req),
  });
}

function normalizePhone(value: unknown): string {
  let number = typeof value === "string" ? value.replace(/\D/g, "") : "";
  if (number.length === 10 || number.length === 11) number = `55${number}`;
  return number;
}

function getClientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("cf-connecting-ip") || "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const current = requests.get(key);
  if (!current || current.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + rateWindow });
    return false;
  }
  current.count += 1;
  return current.count > maxRequestsPerWindow;
}

function cleanupRateLimitMap() {
  if (requests.size < 500) return;
  const now = Date.now();
  for (const [key, value] of requests) {
    if (value.resetAt <= now) requests.delete(key);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }

  if (req.method !== "POST") {
    return json(req, { error: "Método não permitido." }, 405);
  }

  const origin = req.headers.get("origin") ?? "";
  if (ALLOWED_ORIGIN && origin !== ALLOWED_ORIGIN) {
    return json(req, { error: "Origem não autorizada." }, 403);
  }

  // Com verify_jwt=false, a validação da publishable key acontece aqui.
  // Isso é o padrão recomendado pelo Supabase para funções chamadas por clientes
  // usando as novas publishable keys.
  const { error: authError } = await createSupabaseContext(req, { auth: "publishable" });
  if (authError) {
    console.warn("Publishable key rejected", authError.code, authError.message);
    return json(req, { error: "Aplicativo não autorizado a usar esta função." }, 401);
  }

  cleanupRateLimitMap();
  const clientKey = getClientKey(req);
  if (isRateLimited(clientKey)) {
    return json(req, {
      error: "Limite temporário de envios atingido. Aguarde um minuto e tente novamente.",
    }, 429);
  }

  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.error("WhatsApp integration is not configured on the server.");
    return json(req, {
      error: "A integração do WhatsApp ainda não está configurada no servidor.",
    }, 500);
  }

  try {
    const body = await req.json();
    const telefone = normalizePhone(body?.telefone);
    const mensagem = typeof body?.mensagem === "string" ? body.mensagem.trim() : "";

    if (telefone.length < 12 || telefone.length > 15) {
      return json(req, {
        error: "Número de WhatsApp inválido. Informe DDD e número, ou o código do país.",
      }, 400);
    }

    if (!mensagem) {
      return json(req, { error: "A mensagem do orçamento está vazia." }, 400);
    }

    if (mensagem.length > 4096) {
      return json(req, { error: "A mensagem ultrapassa o limite permitido." }, 400);
    }

    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: telefone,
          type: "text",
          text: { body: mensagem },
        }),
      },
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error(
        "Meta WhatsApp API error",
        response.status,
        data?.error?.code,
        data?.error?.type,
      );

      return json(req, {
        error: data?.error?.message ?? "A Meta recusou o envio da mensagem.",
        code: data?.error?.code ?? undefined,
      }, response.status);
    }

    return json(req, {
      success: true,
      message_id: data?.messages?.[0]?.id ?? null,
    });
  } catch (error) {
    console.error("Edge Function error", error);
    return json(req, {
      error: "Não foi possível processar o envio. Tente novamente.",
    }, 500);
  }
});
