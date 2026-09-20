// src/components/ModalPerfil.tsx
import React, { useState } from 'react';
import { X, User, Briefcase } from 'lucide-react';

interface ModalPerfilProps {
  isOpen: boolean;
  onClose: () => void;
  nomeAtual: string;
  profissaoAtual: string;
  onSalvar: (nome: string, profissao: string) => void;
}

export const ModalPerfil: React.FC<ModalPerfilProps> = ({
  isOpen,
  onClose,
  nomeAtual,
  profissaoAtual,
  onSalvar
}) => {
  const [nome, setNome] = useState(nomeAtual);
  const [profissao, setProfissao] = useState(profissaoAtual);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    onSalvar(nome.trim(), profissao.trim() || 'Prestador de Serviços');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-slate-900">Configurar Perfil</h2>
          <button onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700">Seu Nome / Empresa</label>
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
              <User className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Maria Silva ou nome da empresa"
                className="w-full border-0 bg-transparent px-2 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700">Sua Profissão / Atividade</label>
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
              <Briefcase className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={profissao}
                onChange={(e) => setProfissao(e.target.value)}
                placeholder="Ex.: Eletricista / Desenvolvedor"
                className="w-full border-0 bg-transparent px-2 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-colors mt-2"
          >
            Salvar alterações
          </button>
        </form>
      </div>
    </div>
  );
};
