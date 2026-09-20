// src/components/Topbar.tsx
import React from 'react';
import { Settings, Zap } from 'lucide-react';

interface TopbarProps {
  onAbrirConfiguracoes: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onAbrirConfiguracoes }) => {

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md md:px-8">
        <div className="flex items-center gap-3 md:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
            <Zap className="h-5 w-5 fill-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900">Fecha<span className="text-emerald-600">Zap</span></span>
        </div>

        <div className="hidden md:block">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Painel Comercial</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAbrirConfiguracoes}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Abrir configurações"
          >
            <Settings className="h-4 w-4 text-emerald-600" />
            <span className="hidden sm:inline">Configurações</span>
          </button>
        </div>
      </header>

    </>
  );
};
