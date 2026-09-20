// src/utils/whatsapp.ts

export interface ClienteDados {
  nome: string;
  telefone: string;
}

export interface OrcamentoDados {
  titulo: string;
  valor: number | string;
  descricao: string;
}

export const exportarParaWhatsApp = (orcamento: OrcamentoDados, cliente: ClienteDados) => {
  const texto = `Olá, *${cliente.nome}*! 👋\n\nAqui está a nossa proposta para *${orcamento.titulo}*:\n\n*Valor:* R$ ${orcamento.valor}\n*Detalhes:* ${orcamento.descricao}\n\nQualquer dúvida, estou à disposição para fecharmos!`;
  
  // Limpa o telefone deixando apenas números
  const numeroFormatado = cliente.telefone.replace(/\D/g, '');
  
  // Cria o link do WhatsApp
  const link = `https://wa.me/55${numeroFormatado}?text=${encodeURIComponent(texto)}`;
  
  // Abre em uma nova aba
  window.open(link, '_blank');
};
