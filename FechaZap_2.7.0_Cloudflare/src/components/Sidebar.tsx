// src/components/Sidebar.tsx
import React from 'react';
import { BarChart3, FileText, Home, Plus, Users, Zap, Settings } from 'lucide-react';
import { AbaNavegacao } from '../types';

interface Props {
  abaAtiva: AbaNavegacao;
  onMudarAba: (aba: AbaNavegacao) => void;
  onAbrirNovo: () => void;
  totalOrcamentos: number;
  nomeUsuario: string;
  profissaoUsuario: string;
  onAbrirPerfil: () => void;
}

export const Sidebar: React.FC<Props> = ({ 
  abaAtiva, 
  onMudarAba, 
  onAbrirNovo, 
  totalOrcamentos,
  nomeUsuario,
  profissaoUsuario,
  onAbrirPerfil
}) => {
  const itens = [
    { id: 'inicio' as const, label: 'Visão geral', icon: Home },
    { id: 'orcamentos' as const, label: 'Orçamentos', icon: FileText },
    { id: 'clientes' as const, label: 'Clientes', icon: Users },
    { id: 'relatorios' as const, label: 'Relatórios', icon: BarChart3 },
  ];

  return (
    <aside className="fz-sidebar">
      <div className="fz-brand">
        <div className="fz-logo-mark"><Zap className="h-6 w-6 fill-white" /></div>
        <div><strong>Fecha<span>Zap</span></strong><small>Seu orçamento. Seu serviço.</small></div>
      </div>
      
      <button onClick={onAbrirNovo} className="fz-sidebar-new">
        <Plus className="h-5 w-5" /> Novo orçamento
      </button>
      
      <div className="fz-nav-title">MENU PRINCIPAL</div>
      
      <nav className="fz-sidebar-nav">
        {itens.map(item => {
          const Icon = item.icon;
          const ativo = abaAtiva === item.id;
          return (
            <button key={item.id} onClick={() => onMudarAba(item.id)} className={ativo ? 'active' : ''}>
              <Icon className="h-5 w-5" /><span>{item.label}</span>
              {item.id === 'orcamentos' && totalOrcamentos > 0 && <b>{totalOrcamentos}</b>}
            </button>
          );
        })}
      </nav>

      <div className="fz-sidebar-tip">
        <div className="fz-tip-icon">⚡</div>
        <strong>Mais fechamentos</strong>
        <p>Acompanhe quem ainda não respondeu seu orçamento.</p>
      </div>

      <button 
        onClick={onAbrirPerfil}
        className="fz-user-card w-full text-left transition-all hover:bg-slate-50 rounded-xl p-2"
        title="Editar perfil"
      >
        <div className="fz-avatar">{nomeUsuario.trim() ? nomeUsuario.trim().charAt(0).toUpperCase() : <Settings className="h-4 w-4" />}</div>
        <div className="min-w-0 flex-1">
          <strong className="truncate">{nomeUsuario.trim() || 'Configure seu perfil'}</strong>
          <span className="truncate">{profissaoUsuario}</span>
        </div>
        <Settings className="h-4 w-4 text-slate-400 shrink-0" />
      </button>
    </aside>
  );
};
