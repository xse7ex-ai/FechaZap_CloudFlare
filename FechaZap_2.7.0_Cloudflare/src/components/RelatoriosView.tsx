import React from 'react';
import { BarChart3, Database, Download, RotateCcw, Trash2, TrendingUp } from 'lucide-react';
import { Orcamento } from '../types';
import { formatarMoeda, obterRotuloStatus } from '../utils/format';

interface Props { orcamentos: Orcamento[]; onRestaurarExemplos: () => void; onLimparDados: () => void; }

export const RelatoriosView: React.FC<Props> = ({ orcamentos, onRestaurarExemplos, onLimparDados }) => {
  const enviados = orcamentos.length;
  const aceitos = orcamentos.filter(o => o.status === 'aceito' || o.status === 'concluido').length;
  const aguardando = orcamentos.filter(o => o.status === 'aguardando').length;
  const recusados = orcamentos.filter(o => o.status === 'recusado').length;
  const ganho = orcamentos.filter(o => o.status === 'aceito' || o.status === 'concluido').reduce((s,o) => s+o.total,0);
  const ticket = aceitos ? ganho / aceitos : 0;
  const conversao = enviados ? (aceitos / enviados) * 100 : 0;

  const baixarBackup = () => {
    const blob = new Blob([JSON.stringify(orcamentos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `fechazap-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
  };

  return <div className="fz-page space-y-6"><div><span className="text-xs font-black uppercase tracking-[.16em] text-emerald-600">Relatórios</span><h1 className="mt-1 text-3xl font-black tracking-tight">Seus números</h1><p className="mt-1 text-sm text-slate-500">Entenda quanto suas propostas estão convertendo em dinheiro.</p></div><div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Card label="Conversão" value={`${conversao.toFixed(1)}%`} icon={<TrendingUp />} /><Card label="Ticket médio" value={formatarMoeda(ticket)} icon={<BarChart3 />} /><Card label="Valor ganho" value={formatarMoeda(ganho)} icon={<span className="text-lg">$</span>} /><Card label="Aguardando" value={String(aguardando)} icon={<span className="text-lg">◷</span>} /></div><div className="grid gap-4 lg:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-black">Funil de oportunidades</h2><div className="mt-4 space-y-3">{[["Enviados", enviados, 'bg-blue-500'],['Aguardando',aguardando,'bg-amber-500'],['Aceitos/Concluídos',aceitos,'bg-emerald-500'],['Recusados',recusados,'bg-rose-500']].map(([label,n,cor]) => <div key={String(label)}><div className="mb-1 flex justify-between text-xs font-semibold"><span>{label}</span><span>{n}</span></div><div className="h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${cor}`} style={{ width: enviados ? `${Math.min(100, Number(n)/enviados*100)}%` : '0%' }} /></div></div>)}</div></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-black">Distribuição por status</h2><div className="mt-4 space-y-2">{(['aguardando','aceito','concluido','recusado'] as const).map(s => <div key={s} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm"><span>{obterRotuloStatus(s)}</span><strong>{orcamentos.filter(o => o.status === s).length}</strong></div>)}</div></div></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap gap-2"><button onClick={baixarBackup} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"><Download className="h-4 w-4" /> Fazer backup</button><button onClick={onRestaurarExemplos} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"><RotateCcw className="h-4 w-4" /> Carregar exemplos</button>{orcamentos.length > 0 && <button onClick={() => { if (window.confirm('Apagar todos os orçamentos salvos neste dispositivo?')) onLimparDados(); }} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /> Limpar dados</button>}</div><p className="mt-3 text-xs text-slate-400"><Database className="mr-1 inline h-3.5 w-3.5" />Os dados atuais são armazenados localmente neste dispositivo. Sincronização entre aparelhos entra na próxima fase.</p></div></div>;
};

const Card = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">{icon}</div><span className="mt-3 block text-xs font-semibold text-slate-400">{label}</span><strong className="mt-0.5 block truncate text-lg font-black">{value}</strong></div>;
