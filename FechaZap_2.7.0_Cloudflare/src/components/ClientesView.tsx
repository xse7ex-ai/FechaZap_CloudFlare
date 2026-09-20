import React, { useMemo, useState } from 'react';
import { MessageCircle, Phone, Plus, Search, UserRound, ChevronDown, ChevronUp, FileText, Eye } from 'lucide-react';
import { Orcamento } from '../types';
import { formatarData, formatarMoeda, formatarTelefoneVisual, gerarLinkWhatsApp, obterRotuloStatus } from '../utils/format';

interface Props {
  orcamentos: Orcamento[];
  onNovoParaCliente: (nomeCliente: string, whatsapp: string) => void;
  onVerOrcamento: (o: Orcamento) => void;
}

export const ClientesView: React.FC < Props > = ({ orcamentos, onNovoParaCliente, onVerOrcamento }) => {
  const [busca, setBusca] = useState('');
  // Estado para controlar qual card de cliente está expandido
  const [clienteExpandido, setClienteExpandido] = useState < string | null > (null);
  
  const clientes = useMemo(() => {
    const mapa = new Map < string,
      { nome: string;whatsapp: string;total: number;aceito: number;ultimo: string;data: string;historico: Orcamento[] } > ();
    
    [...orcamentos]
    .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
      .forEach(o => {
        const chave = o.cliente.trim().toLowerCase();
        if (!chave) return;
        
        const atual = mapa.get(chave) || {
          nome: o.cliente,
          whatsapp: o.whatsapp,
          total: 0,
          aceito: 0,
          ultimo: o.servico,
          data: o.criadoEm,
          historico: []
        };
        
        atual.total += 1;
        if (o.status === 'aceito' || o.status === 'concluido') atual.aceito += o.total;
        if (!atual.whatsapp) atual.whatsapp = o.whatsapp;
        
        // Adiciona o orçamento atual ao histórico do cliente
        atual.historico.push(o);
        
        mapa.set(chave, atual);
      });
    
    return Array.from(mapa.values()).filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()) || c.whatsapp.includes(busca));
  }, [orcamentos, busca]);
  
  const toggleExpandir = (nomeCliente: string) => {
    if (clienteExpandido === nomeCliente) {
      setClienteExpandido(null);
    } else {
      setClienteExpandido(nomeCliente);
    }
  };
  
  return (
    <div className="fz-page space-y-5">
      <div>
        <span className="text-xs font-black uppercase tracking-[.16em] text-emerald-600">Clientes</span>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Gestão de clientes</h1>
        <p className="mt-1 text-sm text-slate-500">Veja o histórico e transforme clientes em novas oportunidades.</p>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <input 
          value={busca} 
          onChange={e => setBusca(e.target.value)} 
          placeholder="Buscar cliente ou WhatsApp..." 
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500" 
        />
      </div>
      
      {clientes.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <UserRound className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-3 font-bold">Nenhum cliente cadastrado</h3>
          <p className="mt-1 text-sm text-slate-500">Crie um orçamento para formar sua base de clientes.</p>
          <button onClick={() => onNovoParaCliente('', '')} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white">
            <Plus className="h-4 w-4" /> Novo orçamento
          </button>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {clientes.map(c => (
            <div key={c.nome} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all">
              
              {/* Cabeçalho do Card */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-black text-emerald-700">
                    {c.nome.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-bold">{c.nome}</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      <Phone className="mr-1 inline h-3 w-3" />
                      {formatarTelefoneVisual(c.whatsapp)}
                    </p>
                  </div>
                </div>
                {c.whatsapp && (
                  <a href={gerarLinkWhatsApp(c.whatsapp, c.historico[0])} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                  </a>
                )}
              </div>
              
              {/* Resumo Financeiro */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="block text-[10px] text-slate-400">Orçamentos</span>
                  <strong>{c.total}</strong>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3">
                  <span className="block text-[10px] text-emerald-600">Fechado</span>
                  <strong>{formatarMoeda(c.aceito)}</strong>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="block text-[10px] text-slate-400">Último</span>
                  <strong className="block truncate text-xs">{c.ultimo}</strong>
                </div>
              </div>
              
              {/* Botão de Expansão do Histórico */}
              <button 
                onClick={() => toggleExpandir(c.nome)}
                className="mt-4 flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <span>Ver histórico de orçamentos</span>
                {clienteExpandido === c.nome ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {/* Lista de Histórico (Visível apenas se expandido) */}
              {clienteExpandido === c.nome && (
                <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                  {c.historico.map(orcamento => (
                    <div key={orcamento.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-3 w-3 text-slate-400" />
                          <span className="truncate text-sm font-bold text-slate-800">{orcamento.servico}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                          <span>{formatarData(orcamento.criadoEm)}</span>
                          <span>•</span>
                          <span className={`font-bold uppercase ${
                            orcamento.status === 'aceito' || orcamento.status === 'concluido' ? 'text-emerald-600' : 
                            orcamento.status === 'recusado' ? 'text-rose-600' : 'text-amber-600'
                          }`}>
                            {obterRotuloStatus(orcamento.status)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pl-2">
                        <span className="text-xs font-black text-slate-700">{formatarMoeda(orcamento.total)}</span>
                        <button 
                          onClick={() => onVerOrcamento(orcamento)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          title="Abrir detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};