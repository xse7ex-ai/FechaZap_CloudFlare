// src/utils/pdf.ts
import { Orcamento } from '../types';
import { formatarData, formatarMoeda, formatarTelefoneVisual } from './format';

export const gerarPDF = (orcamento: Orcamento) => {
  const conteudo = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Orçamento - ${orcamento.numero}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
          .header { border-bottom: 2px solid #16a34a; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
          .header h1 { color: #15803d; margin: 0; font-size: 28px; letter-spacing: -0.5px; }
          .header p { margin: 5px 0 0; color: #64748b; font-size: 14px; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 11px; font-weight: 900; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px; margin-bottom: 4px; }
          .section-content { font-size: 16px; font-weight: bold; color: #0f172a; }
          .description { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; font-weight: normal; font-size: 14px; white-space: pre-wrap; }
          .grid { display: flex; gap: 40px; margin-bottom: 25px; }
          .totals { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: right; }
          .total-value { font-size: 28px; font-weight: 900; color: #16a34a; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #cbd5e1; border-top: 1px solid #f1f5f9; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>Proposta Comercial</h1>
            <p>Orçamento <b>${orcamento.numero}</b></p>
          </div>
          <div style="text-align: right;">
            <p>Data: <b>${formatarData(orcamento.criadoEm)}</b></p>
            ${orcamento.dataValidade ? `<p>Validade: <b>${formatarData(orcamento.dataValidade)}</b></p>` : ''}
          </div>
        </div>

        <div class="grid">
          <div class="section">
            <div class="section-title">Cliente</div>
            <div class="section-content">
              ${orcamento.cliente}
              ${orcamento.whatsapp ? `<br><span style="font-size: 14px; color:#64748b; font-weight:normal;">${formatarTelefoneVisual(orcamento.whatsapp)}</span>` : ''}
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Serviço</div>
          <div class="section-content">${orcamento.servico}</div>
        </div>

        ${orcamento.descricao ? `
        <div class="section">
          <div class="section-title">Descrição Detalhada</div>
          <div class="description">${orcamento.descricao}</div>
        </div>
        ` : ''}
        
        ${orcamento.observacoes ? `
        <div class="section">
          <div class="section-title">Observações / Condições</div>
          <div style="font-size: 14px; color: #475569;">${orcamento.observacoes}</div>
        </div>
        ` : ''}

        <div class="totals">
          <div class="section-title">Investimento Total</div>
          <div class="total-value">${formatarMoeda(orcamento.total)}</div>
        </div>
        
        <div class="footer">
          Gerado pelo aplicativo FechaZap
        </div>
      </body>
    </html>
  `;

  // Abre uma nova janela/aba invisível ou em popup para renderizar
  const janela = window.open('', '_blank');
  if (janela) {
    janela.document.write(conteudo);
    janela.document.close();
    
    // Dá um tempinho mínimo para o navegador renderizar o CSS
    setTimeout(() => {
      janela.focus();
      janela.print();
      janela.close();
    }, 300);
  } else {
    alert('Por favor, permita a abertura de pop-ups no navegador para gerar o PDF.');
  }
};
