import React, { useState } from 'react';
import './RelatorioBalancoAnualPage.css';

interface DadosBalanco {
  id: number;
  categoria: string;
  descricao: string;
  valorReceitas: number;
  valorDespesas: number;
  saldoLiquido: number;
  percentualMargem: number;
  observacoes: string;
}

const RelatorioBalancoAnualPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Dados fake para o balanço anual 2025
  const dadosBalanco: DadosBalanco[] = [
    {
      id: 1,
      categoria: 'Procedimentos Odontológicos',
      descricao: 'Receitas de consultas, tratamentos e procedimentos diversos',
      valorReceitas: 485750.00,
      valorDespesas: 125300.00,
      saldoLiquido: 360450.00,
      percentualMargem: 74.2,
      observacoes: 'Crescimento de 18% em relação ao ano anterior'
    },
    {
      id: 2,
      categoria: 'Ortodontia e Implantes',
      descricao: 'Tratamentos ortodônticos e cirurgias de implantes',
      valorReceitas: 298400.00,
      valorDespesas: 89200.00,
      saldoLiquido: 209200.00,
      percentualMargem: 70.1,
      observacoes: 'Aumento de 25% na demanda por implantes'
    },
    {
      id: 3,
      categoria: 'Despesas Operacionais',
      descricao: 'Aluguel, energia, telefone, limpeza e manutenção',
      valorReceitas: 0,
      valorDespesas: 156800.00,
      saldoLiquido: -156800.00,
      percentualMargem: 0,
      observacoes: 'Inclui renovação de equipamentos odontológicos'
    },
    {
      id: 4,
      categoria: 'Folha de Pagamento',
      descricao: 'Salários, encargos sociais e benefícios dos funcionários',
      valorReceitas: 0,
      valorDespesas: 234600.00,
      saldoLiquido: -234600.00,
      percentualMargem: 0,
      observacoes: 'Equipe de 8 profissionais + encargos trabalhistas'
    },
    {
      id: 5,
      categoria: 'Materiais e Medicamentos',
      descricao: 'Compra de materiais odontológicos, medicamentos e insumos',
      valorReceitas: 0,
      valorDespesas: 98750.00,
      saldoLiquido: -98750.00,
      percentualMargem: 0,
      observacoes: 'Estoque otimizado com redução de 12% nos custos'
    }
  ];

  const calcularTotais = () => {
    const totalReceitas = dadosBalanco.reduce((total, item) => total + item.valorReceitas, 0);
    const totalDespesas = dadosBalanco.reduce((total, item) => total + item.valorDespesas, 0);
    const lucroLiquido = totalReceitas - totalDespesas;
    const margemLucro = totalReceitas > 0 ? (lucroLiquido / totalReceitas) * 100 : 0;
    
    return { totalReceitas, totalDespesas, lucroLiquido, margemLucro };
  };

  const { totalReceitas, totalDespesas, lucroLiquido, margemLucro } = calcularTotais();

  const gerarPDFBalancoAnual = async () => {
    setIsGenerating(true);
    
    try {
      // Criar conteúdo HTML para PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Relatório Balanço Anual 2025 - Clínica Odontológica</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.4; 
              color: #333; 
              background: white;
              padding: 40px;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #1e40af;
              font-size: 28px;
              margin-bottom: 8px;
              font-weight: bold;
            }
            .header p {
              color: #64748b;
              font-size: 16px;
            }
            .resumo-executivo {
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              border: 1px solid #cbd5e1;
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
            }
            .resumo-item h3 {
              color: #475569;
              font-size: 14px;
              margin-bottom: 5px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .resumo-item .valor {
              font-size: 18px;
              font-weight: bold;
            }
            .receitas { color: #059669; }
            .despesas { color: #dc2626; }
            .lucro { color: #7c3aed; }
            .margem { color: #ea580c; }
            .detalhamento {
              margin-top: 25px;
            }
            .detalhamento h2 {
              color: #1e293b;
              margin-bottom: 20px;
              font-size: 20px;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 10px;
            }
            .categoria-item {
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .categoria-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 10px;
            }
            .categoria-header h3 {
              color: #374151;
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 5px;
            }
            .categoria-header .saldo {
              font-size: 16px;
              font-weight: 700;
              padding: 5px 12px;
              border-radius: 20px;
            }
            .saldo.positivo {
              background: #d1fae5;
              color: #065f46;
            }
            .saldo.negativo {
              background: #fee2e2;
              color: #991b1b;
            }
            .categoria-descricao {
              color: #6b7280;
              margin-bottom: 15px;
              font-style: italic;
            }
            .valores-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin-bottom: 10px;
            }
            .valor-item {
              text-align: center;
              padding: 10px;
              background: #f9fafb;
              border-radius: 6px;
            }
            .valor-item .label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 5px;
            }
            .valor-item .valor {
              font-size: 16px;
              font-weight: 700;
            }
            .observacoes {
              background: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 6px;
              padding: 12px;
              margin-top: 10px;
            }
            .observacoes strong {
              color: #92400e;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .observacoes p {
              color: #78350f;
              margin-top: 5px;
            }
            .rodape {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
            }
            .indicadores {
              background: #f0f9ff;
              border: 1px solid #0ea5e9;
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
            }
            .indicadores h3 {
              color: #0c4a6e;
              margin-bottom: 15px;
              text-align: center;
            }
            .indicadores-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
            }
            .indicador {
              text-align: center;
              background: white;
              padding: 15px;
              border-radius: 6px;
              border: 1px solid #bae6fd;
            }
            .indicador .titulo {
              font-size: 12px;
              color: #0369a1;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
            }
            .indicador .valor {
              font-size: 18px;
              font-weight: bold;
              color: #1e40af;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>RELATÓRIO BALANÇO ANUAL 2025</h1>
            <p>Clínica Odontológica - Sistema de Gestão Financeira</p>
            <p>Período: Janeiro a Dezembro de 2025</p>
            <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          </div>

          <div class="resumo-executivo">
            <h2>RESUMO EXECUTIVO</h2>
            <div class="resumo-grid">
              <div class="resumo-item">
                <h3>Total de Receitas</h3>
                <div class="valor receitas">R$ ${totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </div>
              <div class="resumo-item">
                <h3>Total de Despesas</h3>
                <div class="valor despesas">R$ ${totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </div>
              <div class="resumo-item">
                <h3>Lucro Líquido</h3>
                <div class="valor lucro">R$ ${lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </div>
              <div class="resumo-item">
                <h3>Margem de Lucro</h3>
                <div class="valor margem">${margemLucro.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          <div class="indicadores">
            <h3>INDICADORES DE PERFORMANCE</h3>
            <div class="indicadores-grid">
              <div class="indicador">
                <div class="titulo">ROI Anual</div>
                <div class="valor">${((lucroLiquido / totalDespesas) * 100).toFixed(1)}%</div>
              </div>
              <div class="indicador">
                <div class="titulo">Ticket Médio</div>
                <div class="valor">R$ ${(totalReceitas / 450).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </div>
              <div class="indicador">
                <div class="titulo">Break-Even</div>
                <div class="valor">78,2%</div>
              </div>
            </div>
          </div>

          <div class="detalhamento">
            <h2>DETALHAMENTO POR CATEGORIA</h2>
            
            ${dadosBalanco.map(item => `
              <div class="categoria-item">
                <div class="categoria-header">
                  <div>
                    <h3>${item.categoria}</h3>
                    <div class="categoria-descricao">${item.descricao}</div>
                  </div>
                  <div class="saldo ${item.saldoLiquido >= 0 ? 'positivo' : 'negativo'}">
                    R$ ${item.saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                
                <div class="valores-grid">
                  <div class="valor-item">
                    <div class="label">Receitas</div>
                    <div class="valor receitas">R$ ${item.valorReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  </div>
                  <div class="valor-item">
                    <div class="label">Despesas</div>
                    <div class="valor despesas">R$ ${item.valorDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  </div>
                  <div class="valor-item">
                    <div class="label">Margem %</div>
                    <div class="valor">${item.percentualMargem.toFixed(1)}%</div>
                  </div>
                </div>
                
                <div class="observacoes">
                  <strong>Observações:</strong>
                  <p>${item.observacoes}</p>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #991b1b; margin-bottom: 15px;">ANÁLISE DE RESULTADOS</h3>
            <div style="color: #7f1d1d;">
              <p><strong>Pontos Fortes:</strong></p>
              <ul style="margin: 10px 0 15px 20px;">
                <li>Crescimento de 18% nos procedimentos odontológicos</li>
                <li>Alta margem de lucro em ortodontia (70,1%)</li>
                <li>Otimização de estoque com redução de 12% nos custos</li>
                <li>ROI anual de ${((lucroLiquido / totalDespesas) * 100).toFixed(1)}%</li>
              </ul>
              
              <p><strong>Oportunidades de Melhoria:</strong></p>
              <ul style="margin: 10px 0 0 20px;">
                <li>Revisão dos custos operacionais</li>
                <li>Expansão dos serviços de maior margem</li>
                <li>Implementação de programas de fidelização</li>
                <li>Diversificação dos canais de receita</li>
              </ul>
            </div>
          </div>

          <div class="rodape">
            <p><strong>CLÍNICA ODONTOLÓGICA - SISTEMA DE GESTÃO FINANCEIRA</strong></p>
            <p>Relatório gerado automaticamente pelo módulo de Business Intelligence</p>
            <p>Para dúvidas ou esclarecimentos, entre em contato com o setor financeiro</p>
            <br>
            <p style="font-size: 12px; color: #9ca3af;">
              Este documento é confidencial e destinado exclusivamente à administração da clínica.
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
      element.download = `balanco-anual-2025-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      alert('Relatório Balanço Anual 2025 gerado com sucesso!\n\nO arquivo HTML foi baixado e pode ser convertido para PDF usando o navegador.');
      
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

  const closeAndGoBack = () => {
    window.history.back();
  };

  return (
    <div className="relatorio-balanco-anual-page">
      <div className="page-container">
        <div className="page-header">
          <h1>📊 Relatório Balanço Anual 2025</h1>
          <p>Análise completa da performance financeira da clínica odontológica</p>
          <button className="btn-voltar" onClick={closeAndGoBack}>← Voltar</button>
        </div>

        <div className="resumo-financeiro">
          <div className="cards-resumo">
            <div className="card-resumo receitas">
              <h3>Total Receitas</h3>
              <span className="valor">{formatCurrency(totalReceitas)}</span>
              <small>Todas as receitas do ano</small>
            </div>
            <div className="card-resumo despesas">
              <h3>Total Despesas</h3>
              <span className="valor">{formatCurrency(totalDespesas)}</span>
              <small>Todos os gastos do ano</small>
            </div>
            <div className="card-resumo lucro">
              <h3>Lucro Líquido</h3>
              <span className="valor">{formatCurrency(lucroLiquido)}</span>
              <small>Resultado final</small>
            </div>
            <div className="card-resumo margem">
              <h3>Margem de Lucro</h3>
              <span className="valor">{margemLucro.toFixed(1)}%</span>
              <small>Rentabilidade anual</small>
            </div>
          </div>
        </div>

        <div className="acao-principal">
          <button 
            className={`btn-gerar-pdf ${isGenerating ? 'gerando' : ''}`}
            onClick={gerarPDFBalancoAnual}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>🔄 Gerando Relatório...</>
            ) : (
              <>📄 Gerar Relatório PDF Completo</>
            )}
          </button>
        </div>

        <div className="detalhes-categorias">
          <h2>Resumo por Categoria</h2>
          <div className="categorias-grid">
            {dadosBalanco.map(item => (
              <div key={item.id} className="categoria-card">
                <div className="categoria-header">
                  <h3>{item.categoria}</h3>
                  <span className={`saldo-badge ${item.saldoLiquido >= 0 ? 'positivo' : 'negativo'}`}>
                    {formatCurrency(item.saldoLiquido)}
                  </span>
                </div>
                <p className="categoria-descricao">{item.descricao}</p>
                <div className="valores-detalhes">
                  <div className="valor-item">
                    <span className="label">Receitas:</span>
                    <span className="valor receitas">{formatCurrency(item.valorReceitas)}</span>
                  </div>
                  <div className="valor-item">
                    <span className="label">Despesas:</span>
                    <span className="valor despesas">{formatCurrency(item.valorDespesas)}</span>
                  </div>
                  <div className="valor-item">
                    <span className="label">Margem:</span>
                    <span className="valor">{item.percentualMargem.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="observacoes">
                  <small><strong>Obs:</strong> {item.observacoes}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="indicadores-performance">
          <h2>Indicadores de Performance</h2>
          <div className="indicadores-grid">
            <div className="indicador">
              <h4>ROI Anual</h4>
              <span className="valor">{((lucroLiquido / totalDespesas) * 100).toFixed(1)}%</span>
              <small>Retorno sobre investimento</small>
            </div>
            <div className="indicador">
              <h4>Ticket Médio</h4>
              <span className="valor">{formatCurrency(totalReceitas / 450)}</span>
              <small>Valor médio por paciente</small>
            </div>
            <div className="indicador">
              <h4>Break-Even</h4>
              <span className="valor">78,2%</span>
              <small>Ponto de equilíbrio</small>
            </div>
            <div className="indicador">
              <h4>Crescimento</h4>
              <span className="valor">+18,5%</span>
              <small>Comparado ao ano anterior</small>
            </div>
          </div>
        </div>

        <div className="info-rodape">
          <p><strong>💡 Dica:</strong> O relatório PDF contém análises detalhadas, gráficos e recomendações estratégicas para otimização dos resultados financeiros da clínica.</p>
        </div>
      </div>
    </div>
  );
};

export default RelatorioBalancoAnualPage;