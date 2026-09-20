import React from 'react';
import { X, UserRound, BookOpen, Cloud, LockKeyhole, ChevronRight } from 'lucide-react';

interface ModalConfiguracoesProps {
  isOpen: boolean;
  onClose: () => void;
  onAbrirPerfil: () => void;
  onAbrirTutorial: () => void;
  nomeUsuario: string;
  profissaoUsuario: string;
}

export const ModalConfiguracoes: React.FC<ModalConfiguracoesProps> = ({
  isOpen, onClose, onAbrirPerfil, onAbrirTutorial, nomeUsuario, profissaoUsuario
}) => {
  if (!isOpen) return null;

  const abrirPerfil = () => { onClose(); onAbrirPerfil(); };
  const abrirTutorial = () => { onClose(); onAbrirTutorial(); };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-3 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="configuracoes-titulo">
      <div className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 id="configuracoes-titulo" className="text-xl font-black text-slate-900">Configurações</h2>
            <p className="mt-1 text-sm text-slate-500">Personalize seu FechaZap</p>
          </div>
          <button onClick={onClose} aria-label="Fechar configurações" className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-3">
          <button onClick={abrirPerfil} className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/50">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><UserRound className="h-5 w-5" /></span>
            <span className="min-w-0 flex-1"><span className="block font-bold text-slate-800">Meu perfil</span><span className="block truncate text-sm text-slate-500">{nomeUsuario || 'Adicionar nome ou empresa'}{profissaoUsuario ? ` · ${profissaoUsuario}` : ''}</span></span>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </button>

          <button onClick={abrirTutorial} className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/50">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700"><BookOpen className="h-5 w-5" /></span>
            <span className="min-w-0 flex-1"><span className="block font-bold text-slate-800">Tutorial e ajuda</span><span className="block text-sm text-slate-500">Veja como usar os recursos do app</span></span>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </button>

          <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700"><Cloud className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-slate-800">Backup e sincronização na nuvem</h3><span className="rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">PRO · TURBO</span></div>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">Disponível somente nos planos PRO e TURBO. Seus orçamentos poderão ficar protegidos na nuvem e sincronizados entre dispositivos.</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-700"><LockKeyhole className="h-3.5 w-3.5" /> Recurso planejado, ainda não ativado.</p>
              </div>
            </div>
          </section>
        </div>
        <button onClick={onClose} className="mt-5 w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-slate-800">Concluir</button>
      </div>
    </div>
  );
};
