import React, { useState } from 'react';
import './RelatorioSinteticoDespesasPage.css';

interface Despesa {
  id: number;
  data: string;
  descricao: string;
  categoria: string;
  fornecedor: string;
  valor: number;
  status: 'Pago' | 'Pendente';
  formaPagamento: string;
  dataVencimento: string;
  observacoes?: string;
  numeroNF?: string;
}

const RelatorioSinteticoDespesasPage: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [showResults, setShowResults] = useState(false);
  
  // Estado dos filtros
  const [filtros, setFiltros] = useState({
    dataInicial: '06/11/2025',
    dataFinal: '06/11/2025',
    filtroData: 'Data de Lançamento',
    tipoFiltroContas: 'Fornecedores',
    pendentesPago: 'Tudo'
  });

  // Dados fake para demonstração
  const [despesas] = useState<Despesa[]>([
    {
      id: 1,
      data: '06/11/2025',
      descricao: 'Material Odontológico - Resinas e Brocas',
      categoria: 'Material Clínico',
      fornecedor: 'Dental Supply LTDA',
      valor: 1250.00,
      status: 'Pago',
      formaPagamento: 'Transferência',
      dataVencimento: '06/11/2025',
      observacoes: 'Compra mensal de materiais básicos',
      numeroNF: 'NF-2025-001234'
    },
    {
      id: 2,
      data: '05/11/2025',
      descricao: 'Aluguel do Consultório - Novembro 2025',
      categoria: 'Despesa Fixa',
      fornecedor: 'Imobiliária Central',
      valor: 3200.00,
      status: 'Pago',
      formaPagamento: 'Boleto Bancário',
      dataVencimento: '05/11/2025',
      observacoes: 'Aluguel mensal do consultório',
      numeroNF: 'REC-2025-5678'
    },
    {
      id: 3,
      data: '04/11/2025',
      descricao: 'Equipamento de Esterilização - Autoclave Digital',
      categoria: 'Equipamento',
      fornecedor: 'MedEquip Tecnologia',
      valor: 8500.00,
      status: 'Pendente',
      formaPagamento: 'Cartão de Crédito',
      dataVencimento: '15/11/2025',
      observacoes: 'Parcelamento em 6x sem juros',
      numeroNF: 'NF-2025-987654'
    },
    {
      id: 4,
      data: '03/11/2025',
      descricao: 'Energia Elétrica - Outubro 2025',
      categoria: 'Despesa Fixa',
      fornecedor: 'Companhia Energética',
      valor: 485.75,
      status: 'Pago',
      formaPagamento: 'Débito Automático',
      dataVencimento: '03/11/2025',
      observacoes: 'Conta de energia do mês anterior',
      numeroNF: 'CONTA-202510-789'
    },
    {
      id: 5,
      data: '02/11/2025',
      descricao: 'Produtos de Limpeza e Higienização',
      categoria: 'Limpeza e Higiene',
      fornecedor: 'HygienePro Distribuidora',
      valor: 320.50,
      status: 'Pago',
      formaPagamento: 'PIX',
      dataVencimento: '02/11/2025',
      observacoes: 'Produtos para limpeza do consultório',
      numeroNF: 'NF-2025-456789'
    },
    {
      id: 6,
      data: '01/11/2025',
      descricao: 'Internet e Telefone - Novembro 2025',
      categoria: 'Despesa Fixa',
      fornecedor: 'TelecomNet',
      valor: 225.90,
      status: 'Pendente',
      formaPagamento: 'Boleto Bancário',
      dataVencimento: '10/11/2025',
      observacoes: 'Plano empresarial internet + telefone',
      numeroNF: 'FAT-2025-111222'
    },
    {
      id: 7,
      data: '31/10/2025',
      descricao: 'Anestésicos e Medicamentos',
      categoria: 'Medicamentos',
      fornecedor: 'FarmaDental LTDA',
      valor: 680.25,
      status: 'Pago',
      formaPagamento: 'Cartão de Débito',
      dataVencimento: '31/10/2025',
      observacoes: 'Reposição estoque anestésicos',
      numeroNF: 'NF-2025-334455'
    }
  ]);

  const filtroDataOpcoes = [
    'Data de Lançamento',
    'Data de Vencimento',
    'Data de Pagamento'
  ];

  const tipoFiltroContasOpcoes = [
    'Fornecedores',
    'Funcionários',
    'Impostos',
    'Serviços',
    'Equipamentos',
    'Todos'
  ];

  const pendentesPagoOpcoes = [
    'Tudo',
    'Pendentes',
    'Pagos'
  ];

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const aplicarFiltros = () => {
    setShowResults(true);
  };

  const gerarRelatorioSintetico = () => {
    const despesasFiltradas = filtrarDespesas();
    
    const totalDespesas = despesasFiltradas.reduce((total, d) => total + d.valor, 0);
    const totalPendentes = despesasFiltradas
      .filter(d => d.status === 'Pendente')
      .reduce((total, d) => total + d.valor, 0);
    const totalPagas = despesasFiltradas
      .filter(d => d.status === 'Pago')
      .reduce((total, d) => total + d.valor, 0);

    const content = `
RELATÓRIO SINTÉTICO DE DESPESAS - ${new Date().toLocaleDateString('pt-BR')}

Período: ${filtros.dataInicial} a ${filtros.dataFinal}
Filtro: ${filtros.filtroData}
Tipo: ${filtros.tipoFiltroContas}

═══════════════════════════════════════════════════════════════

RESUMO SINTÉTICO:
- Total de Despesas: ${despesasFiltradas.length}
- Valor Total: R$ ${totalDespesas.toFixed(2).replace('.', ',')}
- Despesas Pagas: R$ ${totalPagas.toFixed(2).replace('.', ',')}
- Despesas Pendentes: R$ ${totalPendentes.toFixed(2).replace('.', ',')}

═══════════════════════════════════════════════════════════════

RESUMO POR CATEGORIA:
${getResumoCategoriaDespesas(despesasFiltradas)}

═══════════════════════════════════════════════════════════════

RESUMO POR FORNECEDOR:
${getResumoFornecedor(despesasFiltradas)}

═══════════════════════════════════════════════════════════════

DETALHAMENTO SINTÉTICO:

${despesasFiltradas.map(despesa => `
${despesa.data} | ${despesa.categoria.toUpperCase()}
───────────────────────────────────────────────────────────────
• Descrição: ${despesa.descricao}
• Fornecedor: ${despesa.fornecedor}
• Valor: R$ ${despesa.valor.toFixed(2).replace('.', ',')}
• Status: ${despesa.status}
• Vencimento: ${despesa.dataVencimento}
• Forma Pagamento: ${despesa.formaPagamento}
${despesa.numeroNF ? `• NF/Recibo: ${despesa.numeroNF}` : ''}
`).join('\n')}

═══════════════════════════════════════════════════════════════

INDICADORES:
- Maior Despesa: R$ ${Math.max(...despesasFiltradas.map(d => d.valor)).toFixed(2).replace('.', ',')}
- Menor Despesa: R$ ${Math.min(...despesasFiltradas.map(d => d.valor)).toFixed(2).replace('.', ',')}
- Média por Despesa: R$ ${(totalDespesas / despesasFiltradas.length).toFixed(2).replace('.', ',')}
- % Despesas Pagas: ${((totalPagas / totalDespesas) * 100).toFixed(1)}%

═══════════════════════════════════════════════════════════════

Relatório gerado em: ${new Date().toLocaleString('pt-BR')}
Sistema de Gestão Odontológica - Módulo Financeiro
    `;
    
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `relatorio-sintetico-despesas-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    alert('Relatório sintético de despesas baixado com sucesso!');
  };

  const getResumoCategoriaDespesas = (despesas: Despesa[]) => {
    const categorias: { [key: string]: { total: number, quantidade: number } } = {};
    
    despesas.forEach(d => {
      if (!categorias[d.categoria]) {
        categorias[d.categoria] = { total: 0, quantidade: 0 };
      }
      categorias[d.categoria].total += d.valor;
      categorias[d.categoria].quantidade += 1;
    });
    
    return Object.keys(categorias)
      .sort((a, b) => categorias[b].total - categorias[a].total)
      .map(cat => 
        `• ${cat}: R$ ${categorias[cat].total.toFixed(2).replace('.', ',')} (${categorias[cat].quantidade} despesas)`
      ).join('\n');
  };

  const getResumoFornecedor = (despesas: Despesa[]) => {
    const fornecedores: { [key: string]: number } = {};
    
    despesas.forEach(d => {
      if (!fornecedores[d.fornecedor]) {
        fornecedores[d.fornecedor] = 0;
      }
      fornecedores[d.fornecedor] += d.valor;
    });
    
    return Object.keys(fornecedores)
      .sort((a, b) => fornecedores[b] - fornecedores[a])
      .map(forn => 
        `• ${forn}: R$ ${fornecedores[forn].toFixed(2).replace('.', ',')}`
      ).join('\n');
  };

  const filtrarDespesas = () => {
    return despesas.filter(despesa => {
      // Filtro por tipo
      if (filtros.tipoFiltroContas !== 'Todos' && filtros.tipoFiltroContas !== 'Fornecedores') {
        // Implementar outros filtros se necessário
      }
      
      // Filtro por status
      if (filtros.pendentesPago === 'Pendentes' && despesa.status !== 'Pendente') return false;
      if (filtros.pendentesPago === 'Pagos' && despesa.status !== 'Pago') return false;
      
      return true;
    });
  };

  const despesasFiltradas = filtrarDespesas();

  const calcularTotaisDespesas = () => {
    const totalDespesas = despesasFiltradas.reduce((total, d) => total + d.valor, 0);
    const totalPendentes = despesasFiltradas
      .filter(d => d.status === 'Pendente')
      .reduce((total, d) => total + d.valor, 0);
    const totalPagas = despesasFiltradas
      .filter(d => d.status === 'Pago')
      .reduce((total, d) => total + d.valor, 0);

    return { totalDespesas, totalPendentes, totalPagas };
  };

  const { totalDespesas, totalPendentes, totalPagas } = calcularTotaisDespesas();

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const closeModal = () => {
    setShowModal(false);
    window.history.back();
  };

  const getCategoriaColor = (categoria: string) => {
    const cores: { [key: string]: string } = {
      'Material Clínico': '#3b82f6',
      'Despesa Fixa': '#ef4444',
      'Equipamento': '#8b5cf6',
      'Limpeza e Higiene': '#10b981',
      'Medicamentos': '#f59e0b',
      'Serviços': '#06b6d4'
    };
    return cores[categoria] || '#6b7280';
  };

  return (
    <div className="relatorio-sintetico-despesas-page">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content-relatorio-sintetico">
            <div className="modal-header">
              <h2>Relatório Sintético Despesas ( Tudo / Hoje / Mês / Ano )</h2>
              <button className="btn-close" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="filtros-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Data Inicial</label>
                    <input
                      type="text"
                      value={filtros.dataInicial}
                      onChange={(e) => handleFiltroChange('dataInicial', e.target.value)}
                      className="form-input"
                      placeholder="06/11/2025"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Data Final</label>
                    <input
                      type="text"
                      value={filtros.dataFinal}
                      onChange={(e) => handleFiltroChange('dataFinal', e.target.value)}
                      className="form-input"
                      placeholder="06/11/2025"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Filtro Data</label>
                    <select 
                      value={filtros.filtroData}
                      onChange={(e) => handleFiltroChange('filtroData', e.target.value)}
                      className="form-select"
                    >
                      {filtroDataOpcoes.map(opcao => (
                        <option key={opcao} value={opcao}>{opcao}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo Filtro Contas</label>
                    <select 
                      value={filtros.tipoFiltroContas}
                      onChange={(e) => handleFiltroChange('tipoFiltroContas', e.target.value)}
                      className="form-select"
                    >
                      {tipoFiltroContasOpcoes.map(opcao => (
                        <option key={opcao} value={opcao}>{opcao}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Pendentes / Pago</label>
                    <select 
                      value={filtros.pendentesPago}
                      onChange={(e) => handleFiltroChange('pendentesPago', e.target.value)}
                      className="form-select"
                    >
                      {pendentesPagoOpcoes.map(opcao => (
                        <option key={opcao} value={opcao}>{opcao}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    className="btn-gerar"
                    onClick={aplicarFiltros}
                  >
                    Gerar ✓
                  </button>
                </div>
              </div>

              {showResults && (
                <div className="resultados-section">
                  <div className="resumo-cards-despesas">
                    <div className="resumo-card total-despesas">
                      <h3>Total Despesas</h3>
                      <span className="valor">{formatCurrency(totalDespesas)}</span>
                      <small>{despesasFiltradas.length} lançamentos</small>
                    </div>
                    <div className="resumo-card despesas-pagas">
                      <h3>Despesas Pagas</h3>
                      <span className="valor">{formatCurrency(totalPagas)}</span>
                      <small>{despesasFiltradas.filter(d => d.status === 'Pago').length} pagas</small>
                    </div>
                    <div className="resumo-card despesas-pendentes">
                      <h3>Despesas Pendentes</h3>
                      <span className="valor">{formatCurrency(totalPendentes)}</span>
                      <small>{despesasFiltradas.filter(d => d.status === 'Pendente').length} pendentes</small>
                    </div>
                    <div className="resumo-card media-despesas">
                      <h3>Média por Despesa</h3>
                      <span className="valor">
                        {formatCurrency(totalDespesas / (despesasFiltradas.length || 1))}
                      </span>
                      <small>Valor médio</small>
                    </div>
                  </div>

                  <div className="acoes-relatorio">
                    <button className="btn-baixar" onClick={gerarRelatorioSintetico}>
                      📊 Baixar Relatório Sintético
                    </button>
                  </div>

                  <div className="lista-despesas">
                    <h3>Despesas Encontradas ({despesasFiltradas.length})</h3>
                    
                    {despesasFiltradas.length === 0 ? (
                      <div className="empty-state">
                        <p>Nenhuma despesa encontrada com os filtros aplicados!</p>
                      </div>
                    ) : (
                      <div className="despesas-grid">
                        {despesasFiltradas.map(despesa => (
                          <div key={despesa.id} className="despesa-card">
                            <div className="card-header">
                              <div className="header-left">
                                <h4>{despesa.descricao}</h4>
                                <span className="data">{despesa.data}</span>
                              </div>
                              <span 
                                className="categoria-badge"
                                style={{ backgroundColor: getCategoriaColor(despesa.categoria) }}
                              >
                                {despesa.categoria}
                              </span>
                            </div>
                            
                            <div className="card-body">
                              <div className="info-row">
                                <span className="label">Fornecedor:</span>
                                <span className="value">{despesa.fornecedor}</span>
                              </div>
                              <div className="info-row">
                                <span className="label">Valor:</span>
                                <span className="value valor-destaque">{formatCurrency(despesa.valor)}</span>
                              </div>
                              <div className="info-row">
                                <span className="label">Status:</span>
                                <span className={`status-badge ${despesa.status.toLowerCase()}`}>
                                  {despesa.status}
                                </span>
                              </div>
                              <div className="info-row">
                                <span className="label">Vencimento:</span>
                                <span className="value">{despesa.dataVencimento}</span>
                              </div>
                              <div className="info-row">
                                <span className="label">Pagamento:</span>
                                <span className="value">{despesa.formaPagamento}</span>
                              </div>
                              {despesa.numeroNF && (
                                <div className="info-row">
                                  <span className="label">NF/Recibo:</span>
                                  <span className="value">{despesa.numeroNF}</span>
                                </div>
                              )}
                              {despesa.observacoes && (
                                <div className="observacoes">
                                  <small>{despesa.observacoes}</small>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatorioSinteticoDespesasPage;