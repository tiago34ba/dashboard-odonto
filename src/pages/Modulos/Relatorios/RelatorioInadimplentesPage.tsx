import React, { useState } from 'react';
import './RelatorioInadimplentesPage.css';

interface Inadimplente {
  id: number;
  nomeCompleto: string;
  cpf: string;
  telefone: string;
  email: string;
  valorDevido: number;
  diasAtraso: number;
  dataVencimento: string;
  ultimoPagamento: string;
  procedimentos: string;
  observacoes: string;
  statusCobranca: 'Primeira Cobrança' | 'Segunda Cobrança' | 'Terceira Cobrança' | 'Jurídico';
  riscoInadimplencia: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
}

const RelatorioInadimplentesPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Dados fake de pacientes inadimplentes
  const inadimplentes: Inadimplente[] = [
    {
      id: 1,
      nomeCompleto: 'Maria Santos Silva',
      cpf: '123.456.789-01',
      telefone: '(11) 98765-4321',
      email: 'maria.santos@email.com',
      valorDevido: 2850.00,
      diasAtraso: 45,
      dataVencimento: '22/09/2025',
      ultimoPagamento: '15/08/2025',
      procedimentos: 'Implante Dentário + Prótese Fixa',
      observacoes: 'Paciente relatou dificuldades financeiras temporárias',
      statusCobranca: 'Segunda Cobrança',
      riscoInadimplencia: 'Médio'
    },
    {
      id: 2,
      nomeCompleto: 'João Carlos Oliveira',
      cpf: '987.654.321-02',
      telefone: '(11) 91234-5678',
      email: 'joao.oliveira@email.com',
      valorDevido: 1200.00,
      diasAtraso: 78,
      dataVencimento: '20/08/2025',
      ultimoPagamento: '10/07/2025',
      procedimentos: 'Tratamento Ortodôntico - Mensalidades',
      observacoes: 'Telefone sem resposta nas últimas 3 tentativas',
      statusCobranca: 'Terceira Cobrança',
      riscoInadimplencia: 'Alto'
    },
    {
      id: 3,
      nomeCompleto: 'Ana Paula Costa Mendes',
      cpf: '456.789.123-03',
      telefone: '(11) 95555-1234',
      email: 'ana.costa@email.com',
      valorDevido: 4750.00,
      diasAtraso: 120,
      dataVencimento: '08/07/2025',
      ultimoPagamento: '25/05/2025',
      procedimentos: 'Cirurgia + Implantes Múltiplos',
      observacoes: 'Processo de cobrança jurídica em andamento',
      statusCobranca: 'Jurídico',
      riscoInadimplencia: 'Crítico'
    },
    {
      id: 4,
      nomeCompleto: 'Pedro Santos Lima',
      cpf: '789.123.456-04',
      telefone: '(11) 97777-8888',
      email: 'pedro.lima@email.com',
      valorDevido: 850.00,
      diasAtraso: 25,
      dataVencimento: '12/10/2025',
      ultimoPagamento: '20/09/2025',
      procedimentos: 'Clareamento Dental + Limpeza',
      observacoes: 'Paciente comprometeu-se a quitar até final do mês',
      statusCobranca: 'Primeira Cobrança',
      riscoInadimplencia: 'Baixo'
    },
    {
      id: 5,
      nomeCompleto: 'Fernanda Lima Rocha',
      cpf: '321.654.987-05',
      telefone: '(11) 92222-3333',
      email: 'fernanda.rocha@email.com',
      valorDevido: 1680.00,
      diasAtraso: 62,
      dataVencimento: '05/09/2025',
      ultimoPagamento: '18/08/2025',
      procedimentos: 'Restaurações + Canal + Coroa',
      observacoes: 'Email retornando, endereço pode estar desatualizado',
      statusCobranca: 'Segunda Cobrança',
      riscoInadimplencia: 'Alto'
    }
  ];

  const calcularTotais = () => {
    const totalDevido = inadimplentes.reduce((total, item) => total + item.valorDevido, 0);
    const totalPacientes = inadimplentes.length;
    const mediaAtraso = inadimplentes.reduce((total, item) => total + item.diasAtraso, 0) / totalPacientes;
    const mediaDivida = totalDevido / totalPacientes;
    
    return { totalDevido, totalPacientes, mediaAtraso, mediaDivida };
  };

  const { totalDevido, totalPacientes, mediaAtraso, mediaDivida } = calcularTotais();

  const gerarPDFInadimplentes = async () => {
    setIsGenerating(true);
    
    try {
      // Criar conteúdo HTML para PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Relatório de Inadimplentes - Clínica Odontológica</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Arial', sans-serif; 
              line-height: 1.4; 
              color: #333; 
              background: white;
              padding: 30px;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #dc2626;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #dc2626;
              font-size: 28px;
              margin-bottom: 8px;
              font-weight: bold;
            }
            .header p {
              color: #64748b;
              font-size: 16px;
            }
            .alerta-inadimplencia {
              background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
              border: 2px solid #fca5a5;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 25px;
              text-align: center;
            }
            .alerta-inadimplencia h2 {
              color: #991b1b;
              margin-bottom: 10px;
              font-size: 20px;
            }
            .alerta-inadimplencia p {
              color: #7f1d1d;
              font-weight: 600;
            }
            .resumo-executivo {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 25px;
            }
            .resumo-executivo h2 {
              color: #1e293b;
              margin-bottom: 15px;
              font-size: 20px;
            }
            .resumo-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
            }
            .resumo-item {
              background: white;
              padding: 15px;
              border-radius: 6px;
              border: 1px solid #e2e8f0;
              text-align: center;
            }
            .resumo-item h3 {
              color: #475569;
              font-size: 14px;
              margin-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .resumo-item .valor {
              font-size: 18px;
              font-weight: bold;
            }
            .total-devido { color: #dc2626; }
            .total-pacientes { color: #7c3aed; }
            .media-atraso { color: #ea580c; }
            .media-divida { color: #059669; }
            .tabela-inadimplentes {
              width: 100%;
              border-collapse: collapse;
              margin: 25px 0;
              background: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .tabela-inadimplentes th {
              background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
              color: white;
              padding: 12px 8px;
              text-align: left;
              font-weight: 600;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .tabela-inadimplentes td {
              padding: 12px 8px;
              border-bottom: 1px solid #f1f5f9;
              font-size: 11px;
              vertical-align: top;
            }
            .tabela-inadimplentes tr:nth-child(even) {
              background: #f8fafc;
            }
            .tabela-inadimplentes tr:hover {
              background: #f1f5f9;
            }
            .status-badge {
              padding: 3px 8px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.3px;
            }
            .primeira-cobranca {
              background: #fef3c7;
              color: #92400e;
            }
            .segunda-cobranca {
              background: #fed7aa;
              color: #9a3412;
            }
            .terceira-cobranca {
              background: #fecaca;
              color: #991b1b;
            }
            .juridico {
              background: #e0e7ff;
              color: #3730a3;
            }
            .risco-badge {
              padding: 3px 8px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
            }
            .baixo {
              background: #d1fae5;
              color: #065f46;
            }
            .medio {
              background: #fef3c7;
              color: #92400e;
            }
            .alto {
              background: #fed7aa;
              color: #9a3412;
            }
            .critico {
              background: #fecaca;
              color: #991b1b;
            }
            .valor-destaque {
              font-weight: bold;
              color: #dc2626;
            }
            .dias-atraso {
              font-weight: bold;
              color: #ea580c;
            }
            .analise-riscos {
              background: #f0f9ff;
              border: 1px solid #0ea5e9;
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
            }
            .analise-riscos h3 {
              color: #0c4a6e;
              margin-bottom: 15px;
              text-align: center;
            }
            .riscos-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 10px;
              text-align: center;
            }
            .risco-item {
              background: white;
              padding: 10px;
              border-radius: 6px;
              border: 1px solid #bae6fd;
            }
            .risco-item .titulo {
              font-size: 12px;
              color: #0369a1;
              text-transform: uppercase;
              margin-bottom: 5px;
            }
            .risco-item .quantidade {
              font-size: 16px;
              font-weight: bold;
              color: #1e40af;
            }
            .acoes-recomendadas {
              background: #fef2f2;
              border: 1px solid #fca5a5;
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
            }
            .acoes-recomendadas h3 {
              color: #991b1b;
              margin-bottom: 15px;
            }
            .acoes-recomendadas ul {
              margin-left: 20px;
              color: #7f1d1d;
            }
            .acoes-recomendadas li {
              margin-bottom: 8px;
              line-height: 1.5;
            }
            .rodape {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
            }
            .rodape p {
              margin-bottom: 5px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚨 RELATÓRIO DE INADIMPLENTES</h1>
            <p>Clínica Odontológica - Controle de Recebimentos</p>
            <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          </div>

          <div class="alerta-inadimplencia">
            <h2>⚠️ ATENÇÃO - SITUAÇÃO DE INADIMPLÊNCIA</h2>
            <p>Este relatório apresenta pacientes com pagamentos em atraso que requerem ação imediata</p>
          </div>

          <div class="resumo-executivo">
            <h2>RESUMO EXECUTIVO</h2>
            <div class="resumo-grid">
              <div class="resumo-item">
                <h3>Total em Atraso</h3>
                <div class="valor total-devido">R$ ${totalDevido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </div>
              <div class="resumo-item">
                <h3>Pacientes Inadimplentes</h3>
                <div class="valor total-pacientes">${totalPacientes} pacientes</div>
              </div>
              <div class="resumo-item">
                <h3>Média de Atraso</h3>
                <div class="valor media-atraso">${mediaAtraso.toFixed(0)} dias</div>
              </div>
              <div class="resumo-item">
                <h3>Dívida Média</h3>
                <div class="valor media-divida">R$ ${mediaDivida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </div>
            </div>
          </div>

          <div class="analise-riscos">
            <h3>ANÁLISE DE RISCOS DE INADIMPLÊNCIA</h3>
            <div class="riscos-grid">
              <div class="risco-item">
                <div class="titulo">Baixo Risco</div>
                <div class="quantidade">${inadimplentes.filter(p => p.riscoInadimplencia === 'Baixo').length}</div>
              </div>
              <div class="risco-item">
                <div class="titulo">Médio Risco</div>
                <div class="quantidade">${inadimplentes.filter(p => p.riscoInadimplencia === 'Médio').length}</div>
              </div>
              <div class="risco-item">
                <div class="titulo">Alto Risco</div>
                <div class="quantidade">${inadimplentes.filter(p => p.riscoInadimplencia === 'Alto').length}</div>
              </div>
              <div class="risco-item">
                <div class="titulo">Risco Crítico</div>
                <div class="quantidade">${inadimplentes.filter(p => p.riscoInadimplencia === 'Crítico').length}</div>
              </div>
            </div>
          </div>

          <h2 style="color: #374151; margin: 25px 0 15px 0; font-size: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            DETALHAMENTO DOS INADIMPLENTES
          </h2>

          <table class="tabela-inadimplentes">
            <thead>
              <tr>
                <th style="width: 15%;">Paciente</th>
                <th style="width: 10%;">CPF</th>
                <th style="width: 12%;">Contato</th>
                <th style="width: 8%;">Valor</th>
                <th style="width: 8%;">Atraso</th>
                <th style="width: 10%;">Vencimento</th>
                <th style="width: 15%;">Procedimentos</th>
                <th style="width: 10%;">Status</th>
                <th style="width: 8%;">Risco</th>
                <th style="width: 14%;">Observações</th>
              </tr>
            </thead>
            <tbody>
              ${inadimplentes.map(paciente => `
                <tr>
                  <td>
                    <strong>${paciente.nomeCompleto}</strong><br>
                    <small style="color: #6b7280;">${paciente.email}</small>
                  </td>
                  <td>${paciente.cpf}</td>
                  <td>
                    ${paciente.telefone}<br>
                    <small style="color: #6b7280;">Últ. pag: ${paciente.ultimoPagamento}</small>
                  </td>
                  <td>
                    <span class="valor-destaque">R$ ${paciente.valorDevido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td>
                    <span class="dias-atraso">${paciente.diasAtraso} dias</span>
                  </td>
                  <td>${paciente.dataVencimento}</td>
                  <td style="font-size: 10px; line-height: 1.3;">${paciente.procedimentos}</td>
                  <td>
                    <span class="status-badge ${paciente.statusCobranca.toLowerCase().replace(' ', '-').replace('ç', 'c').replace('ã', 'a')}">${paciente.statusCobranca}</span>
                  </td>
                  <td>
                    <span class="risco-badge ${paciente.riscoInadimplencia.toLowerCase()}">${paciente.riscoInadimplencia}</span>
                  </td>
                  <td style="font-size: 10px; line-height: 1.3;">${paciente.observacoes}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="acoes-recomendadas">
            <h3>🎯 AÇÕES RECOMENDADAS</h3>
            <ul>
              <li><strong>Imediata:</strong> Contatar pacientes com mais de 60 dias de atraso</li>
              <li><strong>Urgente:</strong> Revisar cadastros com telefones/emails inválidos</li>
              <li><strong>Negociação:</strong> Propor parcelamento para valores acima de R$ 2.000,00</li>
              <li><strong>Jurídico:</strong> Avaliar encaminhamento para cobrança externa (casos críticos)</li>
              <li><strong>Prevenção:</strong> Implementar cobrança automatizada por WhatsApp/SMS</li>
              <li><strong>Cadastro:</strong> Exigir avalista para procedimentos acima de R$ 3.000,00</li>
            </ul>
          </div>

          <div style="background: #f0fdf4; border: 1px solid #16a34a; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #15803d; margin-bottom: 15px;">📊 INDICADORES DE COBRANÇA</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; text-align: center;">
              <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #bbf7d0;">
                <div style="font-size: 12px; color: #16a34a; text-transform: uppercase; margin-bottom: 8px;">Taxa de Inadimplência</div>
                <div style="font-size: 18px; font-weight: bold; color: #15803d;">${((totalDevido / 100000) * 100).toFixed(1)}%</div>
              </div>
              <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #bbf7d0;">
                <div style="font-size: 12px; color: #16a34a; text-transform: uppercase; margin-bottom: 8px;">Eficiência Cobrança</div>
                <div style="font-size: 18px; font-weight: bold; color: #15803d;">67,3%</div>
              </div>
              <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #bbf7d0;">
                <div style="font-size: 12px; color: #16a34a; text-transform: uppercase; margin-bottom: 8px;">Prazo Médio Recup.</div>
                <div style="font-size: 18px; font-weight: bold; color: #15803d;">45 dias</div>
              </div>
            </div>
          </div>

          <div class="rodape">
            <p><strong>CLÍNICA ODONTOLÓGICA - SISTEMA DE GESTÃO FINANCEIRA</strong></p>
            <p>Relatório de Inadimplentes - Módulo de Cobrança</p>
            <p>Para ações de cobrança, entre em contato com o setor financeiro</p>
            <br>
            <p style="font-size: 12px; color: #9ca3af;">
              Este documento contém informações confidenciais de pacientes - uso restrito à administração
            </p>
          </div>
        </body>
        </html>
      `;

      // Criar um novo documento temporário
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Aguardar carregamento e gerar PDF
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 1000);
      }
      
      // Alternativa: criar blob e download direto
      const element = document.createElement('a');
      const file = new Blob([htmlContent], { type: 'text/html' });
      element.href = URL.createObjectURL(file);
      element.download = `relatorio-inadimplentes-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      alert('Relatório de Inadimplentes gerado com sucesso!\n\nO arquivo HTML foi baixado e pode ser convertido para PDF usando o navegador.');
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o relatório. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2 
    });
  };

  const getRiscoColor = (risco: string) => {
    const cores = {
      'Baixo': '#10b981',
      'Médio': '#f59e0b',
      'Alto': '#ef4444',
      'Crítico': '#991b1b'
    };
    return cores[risco as keyof typeof cores] || '#6b7280';
  };

  const getStatusColor = (status: string) => {
    const cores = {
      'Primeira Cobrança': '#f59e0b',
      'Segunda Cobrança': '#ea580c',
      'Terceira Cobrança': '#dc2626',
      'Jurídico': '#7c3aed'
    };
    return cores[status as keyof typeof cores] || '#6b7280';
  };

  const closeAndGoBack = () => {
    window.history.back();
  };

  return (
    <div className="relatorio-inadimplentes-page">
      <div className="page-container">
        <div className="page-header">
          <h1>🚨 Relatório de Inadimplentes</h1>
          <p>Controle e análise de pacientes com pagamentos em atraso</p>
          <button className="btn-voltar" onClick={closeAndGoBack}>← Voltar</button>
        </div>

        <div className="alerta-inadimplencia">
          <div className="alerta-content">
            <h2>⚠️ SITUAÇÃO DE INADIMPLÊNCIA DETECTADA</h2>
            <p>Existem {totalPacientes} pacientes com pagamentos em atraso totalizando {formatCurrency(totalDevido)}</p>
          </div>
        </div>

        <div className="resumo-inadimplencia">
          <div className="cards-resumo">
            <div className="card-resumo total-devido">
              <h3>Total em Atraso</h3>
              <span className="valor">{formatCurrency(totalDevido)}</span>
              <small>Valor total a receber</small>
            </div>
            <div className="card-resumo total-pacientes">
              <h3>Pacientes Inadimplentes</h3>
              <span className="valor">{totalPacientes}</span>
              <small>Cadastros em atraso</small>
            </div>
            <div className="card-resumo media-atraso">
              <h3>Média de Atraso</h3>
              <span className="valor">{mediaAtraso.toFixed(0)} dias</span>
              <small>Tempo médio em atraso</small>
            </div>
            <div className="card-resumo media-divida">
              <h3>Dívida Média</h3>
              <span className="valor">{formatCurrency(mediaDivida)}</span>
              <small>Por paciente</small>
            </div>
          </div>
        </div>

        <div className="acao-principal">
          <button 
            className={`btn-gerar-pdf ${isGenerating ? 'gerando' : ''}`}
            onClick={gerarPDFInadimplentes}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>🔄 Gerando Relatório...</>
            ) : (
              <>📄 Gerar Relatório PDF Completo</>
            )}
          </button>
        </div>

        <div className="lista-inadimplentes">
          <h2>Pacientes Inadimplentes ({inadimplentes.length})</h2>
          <div className="inadimplentes-grid">
            {inadimplentes.map(paciente => (
              <div key={paciente.id} className="inadimplente-card">
                <div className="card-header">
                  <div className="paciente-info">
                    <h3>{paciente.nomeCompleto}</h3>
                    <span className="cpf">{paciente.cpf}</span>
                  </div>
                  <div className="badges">
                    <span 
                      className="risco-badge"
                      style={{ backgroundColor: getRiscoColor(paciente.riscoInadimplencia) }}
                    >
                      {paciente.riscoInadimplencia}
                    </span>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="valor-principal">
                    <span className="label">Valor em Atraso:</span>
                    <span className="valor-destaque">{formatCurrency(paciente.valorDevido)}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Dias de Atraso:</span>
                    <span className="dias-atraso">{paciente.diasAtraso} dias</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Vencimento:</span>
                    <span className="value">{paciente.dataVencimento}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Último Pagamento:</span>
                    <span className="value">{paciente.ultimoPagamento}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Contato:</span>
                    <span className="value">{paciente.telefone}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Email:</span>
                    <span className="value email">{paciente.email}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Status:</span>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(paciente.statusCobranca) }}
                    >
                      {paciente.statusCobranca}
                    </span>
                  </div>
                  
                  <div className="procedimentos">
                    <span className="label">Procedimentos:</span>
                    <span className="value">{paciente.procedimentos}</span>
                  </div>
                  
                  <div className="observacoes">
                    <span className="label">Observações:</span>
                    <span className="value">{paciente.observacoes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="acoes-cobranca">
          <h2>Ações Recomendadas</h2>
          <div className="acoes-grid">
            <div className="acao-item urgente">
              <h4>🔴 Ação Urgente</h4>
              <p>Contatar pacientes com mais de 60 dias de atraso</p>
            </div>
            <div className="acao-item importante">
              <h4>🟡 Negociação</h4>
              <p>Propor parcelamento para valores elevados</p>
            </div>
            <div className="acao-item preventiva">
              <h4>🟢 Prevenção</h4>
              <p>Implementar cobrança automatizada</p>
            </div>
          </div>
        </div>

        <div className="info-rodape">
          <p><strong>💡 Dica:</strong> O relatório PDF contém análise detalhada de cada caso, indicadores de cobrança e recomendações específicas para recuperação de valores.</p>
        </div>
      </div>
    </div>
  );
};

export default RelatorioInadimplentesPage;