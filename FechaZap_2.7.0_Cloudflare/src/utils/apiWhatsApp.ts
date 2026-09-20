// Cliente do envio via Supabase Edge Function.
// A publishable key pode ficar no navegador. O token da Meta NUNCA deve ficar aqui.
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || 'https://acozdqjgrpkqxgojmxom.supabase.co').replace(/\/$/, '');
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_DJRdhDefa7jquWjNA9Xkkw_bjVRE5Rb';

export function normalizarTelefoneWhatsApp(telefone: string): string {
  let numero = String(telefone || '').replace(/\D/g, '');
  if (numero.length === 10 || numero.length === 11) numero = `55${numero}`;
  return numero;
}

function erroDeConexao(error: unknown) {
  if (error instanceof TypeError && /fetch/i.test(error.message)) {
    return new Error('Não foi possível conectar ao servidor do FechaZap. Verifique sua internet e tente novamente.');
  }
  return error instanceof Error ? error : new Error('Não foi possível enviar a mensagem.');
}

export const dispararApiWhatsApp = async (telefone: string, mensagem: string) => {
  const numero = normalizarTelefoneWhatsApp(telefone);
  if (numero.length < 12 || numero.length > 15) {
    throw new Error('Número inválido. Informe o código do país, DDD e número do WhatsApp.');
  }
  if (!mensagem.trim()) throw new Error('A mensagem do orçamento está vazia.');
  if (!SUPABASE_PUBLISHABLE_KEY) {
    throw new Error('A integração do Supabase não está configurada neste aplicativo.');
  }

  let resposta: Response;
  try {
    resposta = await fetch(`${SUPABASE_URL}/functions/v1/enviar-whatsapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_PUBLISHABLE_KEY,
        'x-client-info': 'fechazap-web/2.7.0',
      },
      body: JSON.stringify({ telefone: numero, mensagem }),
    });
  } catch (error) {
    throw erroDeConexao(error);
  }

  const texto = await resposta.text();
  let resultado: any = {};
  try {
    resultado = texto ? JSON.parse(texto) : {};
  } catch {
    resultado = {};
  }

  if (!resposta.ok) {
    const detalhe = resultado.error || resultado.message || resultado.msg;
    if (resposta.status === 401 || resposta.status === 403) {
      throw new Error(detalhe || 'O Supabase recusou a autenticação do aplicativo.');
    }
    throw new Error(detalhe || `Falha ao enviar (HTTP ${resposta.status}).`);
  }

  return resultado;
};
