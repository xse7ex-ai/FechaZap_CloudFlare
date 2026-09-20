export type AbaNavegacao = 'inicio' | 'orcamentos' | 'clientes' | 'relatorios';

export type StatusOrcamento = 'aguardando' | 'aceito' | 'recusado' | 'concluido';

export interface ItemOrcamento {
  id: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

export interface Orcamento {
  id: string;
  numero: string;
  cliente: string;
  whatsapp: string;
  email?: string;
  servico: string;
  descricao?: string;
  maoObra: number;
  materiais: number;
  desconto: number;
  total: number;
  status: StatusOrcamento;
  criadoEm: string;
  dataValidade?: string;
  prazoDias?: number;
  formaPagamento?: string;
  itens?: ItemOrcamento[];
  observacoes?: string;
}

export interface ClienteResumo {
  nome: string;
  whatsapp: string;
  email?: string;
  totalOrcamentos: number;
  valorTotal: number;
  valorAceito: number;
  ultimoServico: string;
  ultimaData: string;
}
