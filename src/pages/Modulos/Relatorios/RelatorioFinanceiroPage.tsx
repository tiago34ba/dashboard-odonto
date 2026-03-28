import React, { useState } from 'react';
import './RelatorioFinanceiroPage.css';

interface LancamentoFinanceiro {
  id: number;
  data: string;
  descricao: string;
  categoria: string;
  tipo: 'Entrada' | 'Saida';
  valor: number;
  status: 'Pago' | 'Pendente';
  formaPagamento: string;
  paciente?: string;
  observacoes?: string;
  dataVencimento?: string;
}

const RelatorioFinanceiroPage: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [showResults, setShowResults] = useState(false);
  
  // Estado dos filtros
  const [filtros, setFiltros] = useState({
    dataInicial: '06/11/2025',
    dataFinal: '06/11/2025',
    filtroData: 'Data de Lançamento',
    entradasSaidas: 'Entradas / Ganhos',
    tipoLancamento: 'Tudo',
    pendentesPago: 'Tudo'
  });

  // Dados fake para demonstração
  const [lancamentos] = useState<LancamentoFinanceiro[]>([
    {
      id: 1,
      data: '06/11/2025',
      descricao: 'Consulta de Rotina - Maria Silva',
      categoria: 'Consulta',
      tipo: 'Entrada',
      valor: 250.00,
      status: 'Pago',
      formaPagamento: 'PIX',
      paciente: 'Maria Silva',
      observacoes: 'Consulta de rotina + limpeza',
      dataVencimento: '06/11/2025'
    },
    {
      id: 2,
      data: '06/11/2025',
      descricao: 'Procedimento Restauração - João Carlos',
      categoria: 'Procedimento',
      tipo: 'Entrada',
      valor: 480.00,
      status: 'Pago',
      formaPagamento: 'Cartão de Crédito',
      paciente: 'João Carlos',
      observacoes: 'Restauração em resina composta',
      dataVencimento: '06/11/2025'
    },
    {
      id: 3,
      data: '05/11/2025',
      descricao: 'Implante Dentário - Ana Costa',
      categoria: 'Cirurgia',
      tipo: 'Entrada',
      valor: 2800.00,
      status: 'Pendente',
      formaPagamento: 'Transferência',
      paciente: 'Ana Costa',
      observacoes: 'Implante unitário - região posterior',
      dataVencimento: '10/11/2025'
    },
    {
      id: 4,
      data: '05/11/2025',
      descricao: 'Compra de Material Odontológico',
      categoria: 'Material',
      tipo: 'Saida',
      valor: 850.00,
      status: 'Pago',
      formaPagamento: 'Boleto',
      observacoes: 'Resinas, brocas e anestésicos',
      dataVencimento: '05/11/2025'
    },
    {
      id: 5,
      data: '04/11/2025',
      descricao: 'Tratamento Ortodôntico - Pedro Santos',
      categoria: 'Ortodontia',
      tipo: 'Entrada',
      valor: 1200.00,
      status: 'Pago',
      formaPagamento: 'Dinheiro',
      paciente: 'Pedro Santos',
      observacoes: 'Mensalidade ortodontia - aparelho fixo',
      dataVencimento: '04/11/2025'
    },
    {
      id: 6,
      data: '04/11/2025',
      descricao: 'Aluguel do Consultório',
      categoria: 'Despesa Fixa',
      tipo: 'Saida',
      valor: 2500.00,
      status: 'Pago',
      formaPagamento: 'Transferência',
      observacoes: 'Aluguel mensal - novembro 2025',
      dataVencimento: '04/11/2025'
    },
    {
      id: 7,
      data: '03/11/2025',
      descricao: 'Clareamento Dental - Fernanda Lima',
      categoria: 'Estética',
      tipo: 'Entrada',
      valor: 650.00,
      status: 'Pendente',
      formaPagamento: 'PIX',
      paciente: 'Fernanda Lima',
      observacoes: 'Clareamento a laser - sessão única',
      dataVencimento: '08/11/2025'
    },
    {
      id: 8,
      data: '03/11/2025',
      descricao: 'Energia Elétrica',
      categoria: 'Despesa Fixa',
      tipo: 'Saida',
      valor: 420.00,
      status: 'Pago',
      formaPagamento: 'Débito Automático',
      observacoes: 'Conta de luz - outubro 2025',
      dataVencimento: '03/11/2025'
    }
  ]);

  const filtroDataOpcoes = [
    'Data de Lançamento',
    'Data de Vencimento',
    'Data de Pagamento'
  ];

  const entradasSaidasOpcoes = [
    'Entradas / Ganhos',
    'Saídas / Gastos',
    'Ambos'
  ];

  const tipoLancamentoOpcoes = [
    'Tudo',
    'Consulta',
    'Procedimento',
    'Cirurgia',
    'Ortodontia',
    'Estética',
    'Material',
    'Despesa Fixa',
    'Equipamento'
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

  const gerarRelatorio = () => {
    const lancamentosFiltrados = filtrarLancamentos();
    
    const totalEntradas = lancamentosFiltrados
      .filter(l => l.tipo === 'Entrada')
      .reduce((total, l) => total + l.valor, 0);
    
    const totalSaidas = lancamentosFiltrados
      .filter(l => l.tipo === 'Saida')
      .reduce((total, l) => total + l.valor, 0);
    
    const saldoLiquido = totalEntradas - totalSaidas;
    
    const totalPendentes = lancamentosFiltrados
      .filter(l => l.status === 'Pendente')
      .reduce((total, l) => total + l.valor, 0);

    const content = `
RELATÓRIO FINANCEIRO - ${new Date().toLocaleDateString('pt-BR')}

Período: ${filtros.dataInicial} a ${filtros.dataFinal}
Filtro: ${filtros.filtroData}
Tipo: ${filtros.entradasSaidas}

═══════════════════════════════════════════════════════════════

RESUMO FINANCEIRO:
- Total de Lançamentos: ${lancamentosFiltrados.length}
- Total de Entradas: R$ ${totalEntradas.toFixed(2).replace('.', ',')}
- Total de Saídas: R$ ${totalSaidas.toFixed(2).replace('.', ',')}
- Saldo Líquido: R$ ${saldoLiquido.toFixed(2).replace('.', ',')}
- Pendentes: R$ ${totalPendentes.toFixed(2).replace('.', ',')}

═══════════════════════════════════════════════════════════════

DETALHAMENTO POR LANÇAMENTO:

${lancamentosFiltrados.map(lancamento => `
${lancamento.data} | ${lancamento.tipo.toUpperCase()}
───────────────────────────────────────────────────────────────
• Descrição: ${lancamento.descricao}
• Categoria: ${lancamento.categoria}
• Valor: R$ ${lancamento.valor.toFixed(2).replace('.', ',')}
• Status: ${lancamento.status}
• Forma Pagamento: ${lancamento.formaPagamento}
${lancamento.paciente ? `• Paciente: ${lancamento.paciente}` : ''}
${lancamento.observacoes ? `• Observações: ${lancamento.observacoes}` : ''}
${lancamento.dataVencimento ? `• Vencimento: ${lancamento.dataVencimento}` : ''}
`).join('\n')}

═══════════════════════════════════════════════════════════════

RESUMO POR CATEGORIA:
${getResumoCategoria(lancamentosFiltrados)}

═══════════════════════════════════════════════════════════════

Relatório gerado em: ${new Date().toLocaleString('pt-BR')}
Sistema de Gestão Odontológica
    `;
    
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    alert('Relatório financeiro baixado com sucesso!');
  };

  const getResumoCategoria = (lancamentos: LancamentoFinanceiro[]) => {
    const categorias: { [key: string]: { entradas: number, saidas: number } } = {};
    
    lancamentos.forEach(l => {
      if (!categorias[l.categoria]) {
        categorias[l.categoria] = { entradas: 0, saidas: 0 };
      }
      
      if (l.tipo === 'Entrada') {
        categorias[l.categoria].entradas += l.valor;
      } else {
        categorias[l.categoria].saidas += l.valor;
      }
    });
    
    return Object.keys(categorias).map(cat => 
      `• ${cat}: Entradas R$ ${categorias[cat].entradas.toFixed(2).replace('.', ',')} | Saídas R$ ${categorias[cat].saidas.toFixed(2).replace('.', ',')}`
    ).join('\n');
  };

  const filtrarLancamentos = () => {
    return lancamentos.filter(lancamento => {
      // Filtro por tipo (Entradas/Saídas)
      if (filtros.entradasSaidas === 'Entradas / Ganhos' && lancamento.tipo !== 'Entrada') return false;
      if (filtros.entradasSaidas === 'Saídas / Gastos' && lancamento.tipo !== 'Saida') return false;
      
      // Filtro por categoria
      if (filtros.tipoLancamento !== 'Tudo' && lancamento.categoria !== filtros.tipoLancamento) return false;
      
      // Filtro por status
      if (filtros.pendentesPago === 'Pendentes' && lancamento.status !== 'Pendente') return false;
      if (filtros.pendentesPago === 'Pagos' && lancamento.status !== 'Pago') return false;
      
      return true;
    });
  };

  const lancamentosFiltrados = filtrarLancamentos();

  const calcularTotais = () => {
    const totalEntradas = lancamentosFiltrados
      .filter(l => l.tipo === 'Entrada')
      .reduce((total, l) => total + l.valor, 0);
    
    const totalSaidas = lancamentosFiltrados
      .filter(l => l.tipo === 'Saida')
      .reduce((total, l) => total + l.valor, 0);
    
    const saldoLiquido = totalEntradas - totalSaidas;
    
    const totalPendentes = lancamentosFiltrados
      .filter(l => l.status === 'Pendente')
      .reduce((total, l) => total + l.valor, 0);

    return { totalEntradas, totalSaidas, saldoLiquido, totalPendentes };
  };

  const { totalEntradas, totalSaidas, saldoLiquido, totalPendentes } = calcularTotais();

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const closeModal = () => {
    setShowModal(false);
    // Redirecionar ou fechar
    window.history.back();
  };

  return (
    <div className="relatorio-financeiro-page">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content-relatorio">
            <div className="modal-header">
              <h2>Relatório Financeiro ( Tudo / Hoje / Mês / Ano )</h2>
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
                    <label>Entradas / Saídas</label>
                    <select 
                      value={filtros.entradasSaidas}
                      onChange={(e) => handleFiltroChange('entradasSaidas', e.target.value)}
                      className="form-select"
                    >
                      {entradasSaidasOpcoes.map(opcao => (
                        <option key={opcao} value={opcao}>{opcao}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Tipo Lançamento</label>
                    <select 
                      value={filtros.tipoLancamento}
                      onChange={(e) => handleFiltroChange('tipoLancamento', e.target.value)}
                      className="form-select"
                    >
                      {tipoLancamentoOpcoes.map(opcao => (
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
                  <div className="resumo-cards">
                    <div className="resumo-card entradas">
                      <h3>Total Entradas</h3>
                      <span className="valor">{formatCurrency(totalEntradas)}</span>
                    </div>
                    <div className="resumo-card saidas">
                      <h3>Total Saídas</h3>
                      <span className="valor">{formatCurrency(totalSaidas)}</span>
                    </div>
                    <div className="resumo-card saldo">
                      <h3>Saldo Líquido</h3>
                      <span className={`valor ${saldoLiquido >= 0 ? 'positivo' : 'negativo'}`}>
                        {formatCurrency(saldoLiquido)}
                      </span>
                    </div>
                    <div className="resumo-card pendentes">
                      <h3>Pendentes</h3>
                      <span className="valor">{formatCurrency(totalPendentes)}</span>
                    </div>
                  </div>

                  <div className="acoes-relatorio">
                    <button className="btn-baixar" onClick={gerarRelatorio}>
                      📊 Baixar Relatório Completo
                    </button>
                  </div>

                  <div className="lista-lancamentos">
                    <h3>Lançamentos Encontrados ({lancamentosFiltrados.length})</h3>
                    
                    {lancamentosFiltrados.length === 0 ? (
                      <div className="empty-state">
                        <p>Nenhum lançamento encontrado com os filtros aplicados!</p>
                      </div>
                    ) : (
                      <div className="lancamentos-table">
                        <div className="table-header">
                          <div className="col-data">Data</div>
                          <div className="col-descricao">Descrição</div>
                          <div className="col-categoria">Categoria</div>
                          <div className="col-tipo">Tipo</div>
                          <div className="col-valor">Valor</div>
                          <div className="col-status">Status</div>
                          <div className="col-forma">Forma Pagto</div>
                        </div>
                        
                        {lancamentosFiltrados.map(lancamento => (
                          <div key={lancamento.id} className={`table-row ${lancamento.tipo.toLowerCase()}`}>
                            <div className="col-data">{lancamento.data}</div>
                            <div className="col-descricao">
                              <strong>{lancamento.descricao}</strong>
                              {lancamento.paciente && (
                                <small>Paciente: {lancamento.paciente}</small>
                              )}
                            </div>
                            <div className="col-categoria">{lancamento.categoria}</div>
                            <div className="col-tipo">
                              <span className={`tipo-badge ${lancamento.tipo.toLowerCase()}`}>
                                {lancamento.tipo}
                              </span>
                            </div>
                            <div className="col-valor">
                              <span className={`valor ${lancamento.tipo.toLowerCase()}`}>
                                {formatCurrency(lancamento.valor)}
                              </span>
                            </div>
                            <div className="col-status">
                              <span className={`status-badge ${lancamento.status.toLowerCase()}`}>
                                {lancamento.status}
                              </span>
                            </div>
                            <div className="col-forma">{lancamento.formaPagamento}</div>
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

export default RelatorioFinanceiroPage;