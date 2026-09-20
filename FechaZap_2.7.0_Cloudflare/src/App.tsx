// src/App.tsx
import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { OrcamentosView } from './components/OrcamentosView';
import { ClientesView } from './components/ClientesView';
import { RelatoriosView } from './components/RelatoriosView';
import { ModalNovoOrcamento } from './components/ModalNovoOrcamento';
import { ModalDetalhes } from './components/ModalDetalhes';
import { ModalPerfil } from './components/ModalPerfil';
import { ModalConfiguracoes } from './components/ModalConfiguracoes';
import { TutorialModal } from './components/TutorialModal';
import { Toast } from './components/Toast';
import { exemplosOrcamentos, initialOrcamentos } from './data/initialData';
import { AbaNavegacao, Orcamento, StatusOrcamento } from './types';
import { normalizarOrcamento } from './utils/format';

const STORAGE_KEY = 'fechazap_orcamentos';

export function App() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (!salvo) return initialOrcamentos;
      const dados = JSON.parse(salvo);
      return Array.isArray(dados) ? dados.map(normalizarOrcamento) : initialOrcamentos;
    } catch {
      return initialOrcamentos;
    }
  });

  const [usuarioNome, setUsuarioNome] = useState(() => {
    const salvo = localStorage.getItem('fechazap_nome') || '';
    // Remove o nome pessoal usado como padrão nas versões anteriores.
    return salvo.trim().toLowerCase() === 'kênyson' || salvo.trim().toLowerCase() === 'kenyn' ? '' : salvo;
  });
  const [usuarioProfissao, setUsuarioProfissao] = useState(() => localStorage.getItem('fechazap_prof') || 'Prestador de Serviços');
  const [modalPerfilAberto, setModalPerfilAberto] = useState(false);

  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [modalConfiguracoesAberto, setModalConfiguracoesAberto] = useState(false);

  const [abaAtiva, setAbaAtiva] = useState<AbaNavegacao>('inicio');
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState<Orcamento | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [toastMensagem, setToastMensagem] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orcamentos));
  }, [orcamentos]);

  const dispararToast = (mensagem: string) => {
    setToastMensagem(mensagem);
    window.setTimeout(() => setToastMensagem(null), 3000);
  };

  const salvarPerfil = (novoNome: string, novaProfissao: string) => {
    setUsuarioNome(novoNome);
    setUsuarioProfissao(novaProfissao);
    localStorage.setItem('fechazap_nome', novoNome);
    localStorage.setItem('fechazap_prof', novaProfissao);
    dispararToast('Perfil atualizado com sucesso!');
  };

  const abrirNovo = () => {
    setModalNovoAberto(true);
  };

  const salvarNovo = (dados: Omit<Orcamento, 'id' | 'numero' | 'criadoEm' | 'total'>) => {
    const novo: Orcamento = {
      ...dados,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      numero: `ORC-${new Date().getFullYear()}-${String(orcamentos.length + 1).padStart(3, '0')}`,
      criadoEm: new Date().toISOString(),
      total: Math.max(0, Number(dados.maoObra || 0) + Number(dados.materiais || 0) - Number(dados.desconto || 0)),
    };
    setOrcamentos(prev => [novo, ...prev]);
    setModalNovoAberto(false);
    setAbaAtiva('orcamentos');
    dispararToast('Orçamento criado com sucesso!');
  };

  const atualizarStatus = (id: string, status: StatusOrcamento) => {
    setOrcamentos(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    setOrcamentoSelecionado(prev => prev?.id === id ? { ...prev, status } : prev);
    dispararToast('Status atualizado!');
  };

  const excluir = (id: string) => {
    setOrcamentos(prev => prev.filter(item => item.id !== id));
    setOrcamentoSelecionado(null);
    dispararToast('Orçamento excluído.');
  };

  const carregarExemplos = () => {
    setOrcamentos(exemplosOrcamentos.map(normalizarOrcamento));
    dispararToast('Exemplos carregados.');
  };

  const limparDados = () => {
    setOrcamentos([]);
    setOrcamentoSelecionado(null);
    dispararToast('Dados apagados.');
  };

  return (
    <div className="min-h-screen bg-[#f6f8f7] text-slate-900">
      <Sidebar
        abaAtiva={abaAtiva}
        onMudarAba={setAbaAtiva}
        onAbrirNovo={abrirNovo}
        totalOrcamentos={orcamentos.length}
        nomeUsuario={usuarioNome}
        profissaoUsuario={usuarioProfissao}
        onAbrirPerfil={() => setModalPerfilAberto(true)}
      />

      <div className="md:ml-64 min-h-screen">
        <Topbar onAbrirConfiguracoes={() => setModalConfiguracoesAberto(true)} />
        <main className="min-h-[calc(100vh-72px)]">
          {abaAtiva === 'inicio' && (
            <DashboardView
              orcamentos={orcamentos}
              onAbrirNovo={abrirNovo}
              onVerDetalhes={setOrcamentoSelecionado}
              onVerTodosOrcamentos={() => setAbaAtiva('orcamentos')}
              usuarioNome={usuarioNome}
            />
          )}
          {abaAtiva === 'orcamentos' && (
            <OrcamentosView
              orcamentos={orcamentos}
              onAbrirNovo={abrirNovo}
              onVerDetalhes={setOrcamentoSelecionado}
              onAtualizarStatus={atualizarStatus}
              onExcluir={excluir}
              termoBuscaGlobal={termoBusca}
            />
          )}
          {abaAtiva === 'clientes' && (
            <ClientesView
              orcamentos={orcamentos}
              onNovoParaCliente={abrirNovo}
              onVerOrcamento={setOrcamentoSelecionado}
            />
          )}
          {abaAtiva === 'relatorios' && (
            <RelatoriosView
              orcamentos={orcamentos}
              onRestaurarExemplos={carregarExemplos}
              onLimparDados={limparDados}
            />
          )}
        </main>
      </div>

      <BottomNav
        abaAtiva={abaAtiva}
        onMudarAba={setAbaAtiva}
        totalOrcamentos={orcamentos.length}
      />

      <ModalNovoOrcamento
        isOpen={modalNovoAberto}
        onClose={() => setModalNovoAberto(false)}
        onSave={salvarNovo}
      />

      {orcamentoSelecionado && (
        <ModalDetalhes
          orcamento={orcamentoSelecionado}
          onFechar={() => setOrcamentoSelecionado(null)}
          onAtualizarStatus={atualizarStatus}
          onExcluir={excluir}
        />
      )}

      <ModalPerfil
        isOpen={modalPerfilAberto}
        onClose={() => setModalPerfilAberto(false)}
        nomeAtual={usuarioNome}
        profissaoAtual={usuarioProfissao}
        onSalvar={salvarPerfil}
      />

      <ModalConfiguracoes
        isOpen={modalConfiguracoesAberto}
        onClose={() => setModalConfiguracoesAberto(false)}
        onAbrirPerfil={() => setModalPerfilAberto(true)}
        onAbrirTutorial={() => setIsTutorialOpen(true)}
        nomeUsuario={usuarioNome}
        profissaoUsuario={usuarioProfissao}
      />

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />

      <Toast mensagem={toastMensagem} />
    </div>
  );
}

export default App;
