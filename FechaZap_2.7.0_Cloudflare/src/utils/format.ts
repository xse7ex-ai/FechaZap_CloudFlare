import { Orcamento, StatusOrcamento } from '../types';

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(Number(valor)) ? Number(valor) : 0);
}

export function formatarData(dataString?: string): string {
  if (!dataString) return 'Sem data';
  const bruto = String(dataString).trim();
  const data = /^\d{4}-\d{2}-\d{2}$/.test(bruto)
    ? new Date(`${bruto}T00:00:00`)
    : new Date(bruto);
  if (Number.isNaN(data.getTime())) return 'Data indisponível';
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function limparTelefone(telefone = ''): string {
  return telefone.replace(/\D/g, '');
}

export function formatarTelefoneVisual(telefone = ''): string {
  const digitos = limparTelefone(telefone);
  if (digitos.length === 11) return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  if (digitos.length === 10) return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  return telefone || 'Não informado';
}

export function calcularTotal(orcamento: Pick<Orcamento, 'maoObra' | 'materiais' | 'desconto'>): number {
  return Math.max(0, Number(orcamento.maoObra || 0) + Number(orcamento.materiais || 0) - Number(orcamento.desconto || 0));
}

export function normalizarStatus(status: unknown): StatusOrcamento {
  const valor = String(status || '').toLowerCase().trim();
  if (valor === 'aprovado' || valor === 'aceito') return 'aceito';
  if (valor === 'cancelado' || valor === 'recusado') return 'recusado';
  if (valor === 'concluído' || valor === 'concluido') return 'concluido';
  return 'aguardando';
}

export function normalizarOrcamento(item: any, index = 0): Orcamento {
  const maoObra = Number(item?.maoObra || 0);
  const materiais = Number(item?.materiais || 0);
  const desconto = Number(item?.desconto || 0);
  const total = Number.isFinite(Number(item?.total))
    ? Number(item.total)
    : calcularTotal({ maoObra, materiais, desconto });

  return {
    id: String(item?.id || `importado-${Date.now()}-${index}`),
    numero: String(item?.numero || `ORC-2026-${String(index + 1).padStart(3, '0')}`),
    cliente: String(item?.cliente || ''),
    whatsapp: String(item?.whatsapp ?? item?.telefone ?? ''),
    email: item?.email ? String(item.email) : undefined,
    servico: String(item?.servico || ''),
    descricao: String(item?.descricao ?? item?.descricaoServico ?? ''),
    maoObra,
    materiais,
    desconto,
    total,
    status: normalizarStatus(item?.status),
    criadoEm: String(item?.criadoEm ?? item?.dataCriacao ?? new Date().toISOString()),
    dataValidade: item?.dataValidade || undefined,
    prazoDias: item?.prazoDias ? Number(item.prazoDias) : undefined,
    formaPagamento: item?.formaPagamento || undefined,
    itens: item?.itens,
    observacoes: item?.observacoes || undefined,
  };
}

export function obterRotuloStatus(status: StatusOrcamento): string {
  switch (status) {
    case 'aceito': return 'Aceito';
    case 'recusado': return 'Recusado';
    case 'concluido': return 'Concluído';
    default: return 'Aguardando';
  }
}

export function gerarTextoWhatsApp(orcamento: Orcamento): string {
  let texto = `*ORÇAMENTO ${orcamento.numero} - FECHAZAP*\n\n`;
  texto += `Olá, *${orcamento.cliente}*! Segue sua proposta:\n\n`;
  texto += `*Serviço:* ${orcamento.servico}\n`;
  if (orcamento.descricao) texto += `*Descrição:* ${orcamento.descricao}\n`;
  if (orcamento.prazoDias) texto += `*Prazo:* ${orcamento.prazoDias} dia(s)\n`;
  if (orcamento.formaPagamento) texto += `*Pagamento:* ${orcamento.formaPagamento}\n`;
  texto += `\n*VALORES*\n`;
  texto += `Mão de obra: ${formatarMoeda(orcamento.maoObra)}\n`;
  texto += `Materiais: ${formatarMoeda(orcamento.materiais)}\n`;
  if (orcamento.desconto > 0) texto += `Desconto: -${formatarMoeda(orcamento.desconto)}\n`;
  texto += `*TOTAL: ${formatarMoeda(orcamento.total)}*\n`;
  if (orcamento.dataValidade) texto += `Validade: ${formatarData(orcamento.dataValidade)}\n`;
  if (orcamento.observacoes) texto += `\n*Observações:* ${orcamento.observacoes}\n`;
  texto += `\nFico à disposição para esclarecer qualquer dúvida e combinar o início do serviço. 😊`;
  return texto;
}

export function gerarLinkWhatsApp(whatsapp: string, orcamento: Orcamento): string {
  let digitos = limparTelefone(whatsapp);
  if (!digitos) return '#';
  if (!digitos.startsWith('55')) digitos = `55${digitos}`;
  return `https://wa.me/${digitos}?text=${encodeURIComponent(gerarTextoWhatsApp(orcamento))}`;
}

export function gerarTextoFollowUp(orcamento: Orcamento): string {
  return `Olá, ${orcamento.cliente}! 😊 Passando para saber se conseguiu analisar o orçamento ${orcamento.numero} de ${formatarMoeda(orcamento.total)}. Se quiser, posso esclarecer qualquer dúvida e ajustar algum detalhe da proposta. Ficamos à disposição!`;
}

export function gerarLinkFollowUp(whatsapp: string, orcamento: Orcamento): string {
  let digitos = limparTelefone(whatsapp);
  if (!digitos) return '#';
  if (!digitos.startsWith('55')) digitos = `55${digitos}`;
  return `https://wa.me/${digitos}?text=${encodeURIComponent(gerarTextoFollowUp(orcamento))}`;
}
