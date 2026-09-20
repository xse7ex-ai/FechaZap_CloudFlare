import React from 'react';
import { BarChart3, FileText, Home, Users } from 'lucide-react';
import { AbaNavegacao } from '../types';

interface Props { abaAtiva: AbaNavegacao; onMudarAba: (aba: AbaNavegacao) => void; totalOrcamentos: number; }

export const BottomNav: React.FC<Props> = ({ abaAtiva, onMudarAba, totalOrcamentos }) => {
  const itens = [
    { id: 'inicio' as const, label: 'Início', icon: Home },
    { id: 'orcamentos' as const, label: 'Orçamentos', icon: FileText },
    { id: 'clientes' as const, label: 'Clientes', icon: Users },
    { id: 'relatorios' as const, label: 'Relatórios', icon: BarChart3 },
  ];
  return <nav className="fz-bottom-nav">
    {itens.map(item => { const Icon = item.icon; const ativo = abaAtiva === item.id; return <button key={item.id} onClick={() => onMudarAba(item.id)} className={ativo ? 'active' : ''}>
      <span className="fz-bottom-icon"><Icon className="h-5 w-5" />{item.id === 'orcamentos' && totalOrcamentos > 0 && <b>{totalOrcamentos}</b>}</span>
      <small>{item.label}</small>
    </button>; })}
  </nav>;
};
