// src/components/TutorialModal.tsx
import React from 'react';
import { X } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600">Primeiros Passos</span>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">Como usar o FechaZap</h2>
          </div>
          <button onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 text-slate-600 text-sm">
          <div className="flex gap-3 items-start p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-black text-xs">1</div>
            <div>
              <strong className="block text-slate-900 font-bold mb-0.5">Crie seu Orçamento</strong>
              <p className="text-xs text-slate-500">Informe o cliente, o serviço e os valores. O app calcula o total e já monta a sua base de clientes automaticamente.</p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white font-black text-xs">2</div>
            <div>
              <strong className="block text-slate-900 font-bold mb-0.5">Envie pelo WhatsApp</strong>
              <p className="text-xs text-slate-500">Abra os detalhes da proposta e clique no botão do WhatsApp para disparar a mensagem formatada na hora.</p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white font-black text-xs">3</div>
            <div>
              <strong className="block text-slate-900 font-bold mb-0.5">Acompanhe e Faça Follow-up</strong>
              <p className="text-xs text-slate-500">Use os lembretes rápidos para cobrar retorno de quem ainda está com orçamento pendente.</p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white font-black text-xs">4</div>
            <div>
              <strong className="block text-slate-900 font-bold mb-0.5">Atualize o Status</strong>
              <p className="text-xs text-slate-500">Mude para Aceito, Concluído ou Recusado para alimentar seus relatórios automáticos de conversão.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-colors"
        >
          Entendi, bora fechar negócios! 🚀
        </button>
      </div>
    </div>
  );
};
