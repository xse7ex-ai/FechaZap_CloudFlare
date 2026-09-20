// src/components/DashboardView.tsx
import React from 'react';
import { ArrowRight, CheckCircle2, Clock3, DollarSign, Eye, FileText, MessageCircle, Plus, Send, TrendingUp } from 'lucide-react';
import { Orcamento } from '../types';
import { formatarData, formatarMoeda, formatarTelefoneVisual, gerarLinkFollowUp, gerarLinkWhatsApp, obterRotuloStatus } from '../utils/format';

interface Props {
  orcamentos: Orcamento[];
  onAbrirNovo: () => void;
  onVerDetalhes: (o: Orcamento) => void;
  onVerTodosOrcamentos: () => void;
  usuarioNome?: string;
}

export const DashboardView: React.FC<Props> = ({ 
  orcamentos, 
  onAbrirNovo, 
  onVerDetalhes, 
  onVerTodosOrcamentos, 
  usuarioNome = '' 
}) => {
  const enviados = orcamentos.length;
  const aceitos = orcamentos.filter(o => o.status === 'aceito' || o.status === 'concluido').length;
  const aguardando = orcamentos.filter(o => o.status === 'aguardando').length;
  const valorGanho = orcamentos.filter(o => o.status === 'aceito' || o.status === 'concluido').reduce((s, o) => s + o.total, 0);
  const conversao = enviados ? Math.round((aceitos / enviados) * 100) : 0;
  const recentes = orcamentos.slice(0, 4);

  return (
    <div className="fz-page">
      <section className="fz-hero">
        <div>
          <span className="fz-eyebrow">PAINEL</span>
          <h1>{usuarioNome.trim() ? `Olá, ${usuarioNome}! 👋` : 'Olá! 👋'}</h1>
          <p>Tenha seus orçamentos sob controle e transforme oportunidades em serviços.</p>
        </div>
        <button onClick={onAbrirNovo} className="fz-primary-btn"><Plus className="h-5 w-5" /> Novo orçamento</button>
      </section>

      <section className="fz-stat-grid">
        <Stat icon={<Send />} label="Orçamentos enviados" value={String(enviados)} hint="Total criado" tone="blue" />
        <Stat icon={<CheckCircle2 />} label="Serviços fechados" value={String(aceitos)} hint={`${conversao}% de conversão`} tone="green" />
        <Stat icon={<Clock3 />} label="Aguardando resposta" value={String(aguardando)} hint="Oportunidades abertas" tone="amber" />
        <Stat icon={<DollarSign />} label="Valor ganho" value={formatarMoeda(valorGanho)} hint="Aceitos + concluídos" tone="violet" />
      </section>

      <section className="fz-content-grid">
        <div className="fz-panel">
          <div className="fz-panel-head">
            <div><h2>Orçamentos recentes</h2><p>Suas últimas oportunidades comerciais</p></div>
            {orcamentos.length > 4 && <button onClick={onVerTodosOrcamentos} className="fz-link-btn">Ver todos <ArrowRight className="h-4 w-4" /></button>}
          </div>
          {recentes.length === 0 ? (
            <div className="fz-empty">
              <div className="fz-empty-icon"><FileText /></div>
              <h3>Seu painel está pronto.</h3>
              <p>Crie seu primeiro orçamento e comece a acompanhar seus fechamentos.</p>
              <button onClick={onAbrirNovo} className="fz-secondary-btn"><Plus className="h-4 w-4" /> Criar orçamento</button>
            </div>
          ) : (
            <div className="fz-quote-list">
              {recentes.map(o => (
                <article key={o.id} className="fz-quote-row">
                  <button className="fz-quote-main" onClick={() => onVerDetalhes(o)}>
                    <div className="fz-service-icon"><FileText /></div>
                    <div className="min-w-0">
                      <div className="fz-quote-title"><strong>{o.servico}</strong><Status status={o.status} /></div>
                      <p>{o.cliente} · {formatarData(o.criadoEm)} {o.whatsapp && `· ${formatarTelefoneVisual(o.whatsapp)}`}</p>
                    </div>
                  </button>
                  <div className="fz-quote-right">
                    <strong>{formatarMoeda(o.total)}</strong>
                    <div>
                      {o.whatsapp && <a href={o.status === 'aguardando' ? gerarLinkFollowUp(o.whatsapp, o) : gerarLinkWhatsApp(o.whatsapp, o)} target="_blank" rel="noreferrer" className="fz-round-btn green" title="WhatsApp"><MessageCircle /></a>}
                      <button onClick={() => onVerDetalhes(o)} className="fz-round-btn" title="Ver detalhes"><Eye /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="fz-side-panel">
          <div className="fz-panel-head"><div><h2>Resumo rápido</h2><p>Veja onde estão suas vendas</p></div></div>
          <div className="fz-conversion"><div className="fz-ring" style={{"--progress": `${conversao}%`} as React.CSSProperties}><span>{conversao}%</span></div><div><strong>Taxa de conversão</strong><p>dos seus orçamentos viraram negócios.</p></div></div>
          <div className="fz-mini-list">
            <div><span><span className="dot green" /> Fechados</span><b>{aceitos}</b></div>
            <div><span><span className="dot amber" /> Aguardando</span><b>{aguardando}</b></div>
            <div><span><span className="dot red" /> Recusados</span><b>{orcamentos.filter(o => o.status === 'recusado').length}</b></div>
          </div>
          <div className="fz-tip"><TrendingUp /><span><strong>Dica de fechamento</strong><small>Faça follow-up dos orçamentos que estão aguardando resposta.</small></span></div>
        </div>
      </section>
    </div>
  );
};

const Stat = ({ icon, label, value, hint, tone }: { icon: React.ReactNode; label: string; value: string; hint: string; tone: string }) => (
  <div className="fz-stat-card"><div className={`fz-stat-icon ${tone}`}>{icon}</div><div className="fz-stat-copy"><span>{label}</span><strong>{value}</strong><small>{hint}</small></div></div>
);

const Status = ({ status }: { status: Orcamento['status'] }) => <span className={`fz-status ${status}`}>{obterRotuloStatus(status)}</span>;
