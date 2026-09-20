import React, { useState } from 'react';
import { X, Trash2, MessageCircle, ExternalLink, Copy, Check } from 'lucide-react';
import { Orcamento, StatusOrcamento } from '../types';
import { formatarData, formatarMoeda, obterRotuloStatus, gerarTextoWhatsApp } from '../utils/format';
import { dispararApiWhatsApp } from '../utils/apiWhatsApp';

interface Props {
  orcamento: Orcamento;
  onFechar: () => void;
  onAtualizarStatus: (id: string, status: StatusOrcamento) => void;
  onExcluir: (id: string) => void;
}

export const ModalDetalhes: React.FC<Props> = ({ orcamento, onFechar, onAtualizarStatus, onExcluir }) => {
  const [enviandoApi, setEnviandoApi] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [sucessoEnvio, setSucessoEnvio] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const handleEnvioApi = async () => {
    setErroEnvio(null);
    setSucessoEnvio(null);
    const telefone = String(orcamento.whatsapp || '').replace(/\D/g, '');
    if (telefone.length < 10 || telefone.length > 15) {
      setErroEnvio('Confira o WhatsApp cadastrado neste orçamento (inclua DDD e, se necessário, código do país).');
      return;
    }
    setEnviandoApi(true);
    try {
      await dispararApiWhatsApp(telefone, gerarTextoWhatsApp(orcamento));
      setSucessoEnvio('Mensagem aceita pela API do WhatsApp. A aceitação pela API não confirma a entrega ao cliente.');
    } catch (error: unknown) {
      setErroEnvio(error instanceof Error ? error.message : 'Não foi possível enviar a mensagem.');
    } finally {
      setEnviandoApi(false);
    }
  };

  const abrirWhatsAppManual = () => {
    const telefone = String(orcamento.whatsapp || '').replace(/\D/g, '');
    if (!telefone) return;
    const numero = telefone.startsWith('55') ? telefone : `55${telefone}`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(gerarTextoWhatsApp(orcamento))}`, '_blank', 'noopener,noreferrer');
  };

  const copiarMensagem = async () => {
    try {
      await navigator.clipboard.writeText(gerarTextoWhatsApp(orcamento));
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 1800);
    } catch {
      setErroEnvio('Não foi possível copiar a mensagem neste dispositivo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 sm:items-center sm:p-4" onMouseDown={e => { if (e.target === e.currentTarget) onFechar(); }}>
      <div className="max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div><span className="text-xs font-black uppercase tracking-wider text-emerald-600">{orcamento.numero}</span><h2 className="mt-1 text-2xl font-black text-slate-900">Detalhes do orçamento</h2></div>
          <button type="button" onClick={onFechar} aria-label="Fechar" className="rounded-full bg-slate-100 p-2 text-slate-500"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3 text-sm text-slate-600">
          <p><strong className="text-slate-800">Cliente:</strong> {orcamento.cliente}</p>
          <p><strong className="text-slate-800">WhatsApp:</strong> {orcamento.whatsapp || 'Não informado'}</p>
          <p><strong className="text-slate-800">Serviço:</strong> {orcamento.servico}</p>
          {orcamento.descricao && <p><strong className="text-slate-800">Descrição:</strong> {orcamento.descricao}</p>}
          <p><strong className="text-slate-800">Criado em:</strong> {formatarData(orcamento.criadoEm)}</p>
          <p><strong className="text-slate-800">Mão de obra:</strong> {formatarMoeda(orcamento.maoObra)}</p>
          <p><strong className="text-slate-800">Materiais:</strong> {formatarMoeda(orcamento.materiais)}</p>
          {orcamento.desconto > 0 && <p><strong className="text-slate-800">Desconto:</strong> {formatarMoeda(orcamento.desconto)}</p>}
          <p className="border-t border-slate-100 pt-3 text-lg"><strong className="text-slate-900">Total:</strong> <span className="font-black text-emerald-700">{formatarMoeda(orcamento.total)}</span></p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center"><label htmlFor="status-orcamento" className="font-bold text-slate-800">Status:</label><select id="status-orcamento" value={orcamento.status} onChange={e => onAtualizarStatus(orcamento.id, e.target.value as StatusOrcamento)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"><option value="aguardando">Aguardando</option><option value="aceito">Aceito</option><option value="recusado">Recusado</option><option value="concluido">Concluído</option></select><span className="text-xs text-slate-500">{obterRotuloStatus(orcamento.status)}</span></div>
          {orcamento.formaPagamento && <p><strong className="text-slate-800">Pagamento:</strong> {orcamento.formaPagamento}</p>}
          {orcamento.dataValidade && <p><strong className="text-slate-800">Validade:</strong> {formatarData(orcamento.dataValidade)}</p>}
          {orcamento.observacoes && <p><strong className="text-slate-800">Observações:</strong> {orcamento.observacoes}</p>}
        </div>
        {erroEnvio && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">{erroEnvio}</p>}
        {sucessoEnvio && <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800">{sucessoEnvio}</p>}
        <div className="mt-6 space-y-2">
          <button type="button" onClick={handleEnvioApi} disabled={enviandoApi || !orcamento.whatsapp} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-black text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"><MessageCircle className="h-4 w-4"/>{enviandoApi ? 'Enviando pelo FechaZap...' : 'Enviar pelo FechaZap'}</button>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={abrirWhatsAppManual} disabled={!orcamento.whatsapp} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"><ExternalLink className="h-4 w-4"/> Abrir WhatsApp</button>
            <button type="button" onClick={copiarMensagem} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">{copiado ? <Check className="h-4 w-4 text-emerald-600"/> : <Copy className="h-4 w-4"/>}{copiado ? 'Copiado!' : 'Copiar mensagem'}</button>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button type="button" onClick={onFechar} className="rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-700">Fechar</button>
            <button type="button" onClick={() => { if (window.confirm('Excluir este orçamento?')) onExcluir(orcamento.id); }} className="flex items-center justify-center gap-2 rounded-xl bg-rose-50 py-3 text-sm font-bold text-rose-700"><Trash2 className="h-4 w-4"/> Excluir</button>
          </div>
        </div>
      </div>
    </div>
  );
};
