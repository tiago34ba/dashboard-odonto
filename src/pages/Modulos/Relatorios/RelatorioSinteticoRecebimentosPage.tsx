import React, { useState } from 'react';
import './RelatorioSinteticoRecebimentosPage.css';

interface Recebimento {
  id: number;
  data: string;
  descricao: string;
  categoria: string;
  cliente: string;
  valor: number;
  status: 'Recebido' | 'Pendente';
  formaPagamento: string;
  dataVencimento: string;
  observacoes?: string;
  numeroRecibo?: string;
  parcela?: string;
}

const RelatorioSinteticoRecebimentosPage: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [showResults, setShowResults] = useState(false);
  
  // Estado dos filtros
  const [filtros, setFiltros] = useState({
    dataInicial: '06/11/2025',
    dataFinal: '06/11/2025',
    filtroData: 'Data de Lançamento',
    tipoFiltroContas: 'Clientes',
    pendentesPago: 'Tudo'
  });

  // Dados fake para demonstração
  const [recebimentos] = useState<Recebimento[]>([
    {
      id: 1,
      data: '06/11/2025',
      descricao: 'Consulta de Rotina + Limpeza Dental',
      categoria: 'Consulta',
      cliente: 'Maria Silva Santos',
      valor: 350.00,
      status: 'Recebido',
      formaPagamento: 'PIX',
      dataVencimento: '06/11/2025',
      observacoes: 'Consulta de rotina com profilaxia',
      numeroRecibo: 'REC-2025-001234',
      parcela: '1/1'
    },
    {
      id: 2,
      data: '05/11/2025',
      descricao: 'Tratamento Ortodôntico - Mensalidade',
      categoria: 'Ortodontia',
      cliente: 'João Carlos Oliveira',
      valor: 1200.00,
      status: 'Recebido',
      formaPagamento: 'Cartão de Crédito',
      dataVencimento: '05/11/2025',
      observacoes: 'Mensalidade aparelho fixo - 8º mês',
      numeroRecibo: 'REC-2025-002345',
      parcela: '8/18'
    },
    {
      id: 3,
      data: '04/11/2025',
      descricao: 'Implante Dentário - Parcela 2',
      categoria: 'Cirurgia',
      cliente: 'Ana Paula Costa',
      valor: 2800.00,
      status: 'Pendente',
      formaPagamento: 'Transferência Bancária',
      dataVencimento: '15/11/2025',
      observacoes: 'Implante unitário região molar',
      numeroRecibo: 'REC-2025-003456',
      parcela: '2/4'
    },
    {
      id: 4,
      data: '03/11/2025',
      descricao: 'Clareamento Dental a Laser',
      categoria: 'Estética',
      cliente: 'Pedro Santos Lima',
      valor: 850.00,
      status: 'Recebido',
      formaPagamento: 'Dinheiro',
      dataVencimento: '03/11/2025',
      observacoes: 'Sessão única de clareamento',
      numeroRecibo: 'REC-2025-004567',
      parcela: '1/1'
    },
    {
      id: 5,
      data: '02/11/2025',
      descricao: 'Restauração em Resina Composta',
      categoria: 'Procedimento',
      cliente: 'Fernanda Lima Rocha',
      valor: 480.00,
      status: 'Recebido',
      formaPagamento: 'Cartão de Débito',
      dataVencimento: '02/11/2025',
      observacoes: 'Restauração 2 elementos posteriores',
      numeroRecibo: 'REC-2025-005678',
      parcela: '1/1'
    },
    {
      id: 6,
      data: '01/11/2025',
      descricao: 'Prótese Fixa - Entrada',
      categoria: 'Prótese',
      cliente: 'Roberto Silva Mendes',
      valor: 1500.00,
      status: 'Pendente',
      formaPagamento: 'PIX',
      dataVencimento: '10/11/2025',
      observacoes: 'Prótese fixa 3 elementos - entrada 50%',
      numeroRecibo: 'REC-2025-006789',
      parcela: '1/2'
    },
    {
      id: 7,
      data: '31/10/2025',
      descricao: 'Exame Radiográfico Panorâmico',
      categoria: 'Exame',
      cliente: 'Luciana Costa Alves',
      valor: 180.00,
      status: 'Recebido',
      formaPagamento: 'PIX',
      dataVencimento: '31/10/2025',
      observacoes: 'Radiografia para planejamento',
      numeroRecibo: 'REC-2025-007890',
      parcela: '1/1'
    }
  ]);

  const filtroDataOpcoes = [
    'Data de Lançamento',
    'Data de Vencimento',
    'Data de Recebimento'
  ];

  const tipoFiltroContasOpcoes = [
    'Clientes',
    'Convênios',
    'Particulares',
    'Todos'
  ];

  const pendentesPagoOpcoes = [
    'Tudo',
    'Pendentes',
    'Recebidos'
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
    const recebimentosFiltrados = filtrarRecebimentos();
    
    const totalRecebimentos = recebimentosFiltrados.reduce((total, r) => total + r.valor, 0);
    const totalPendentes = recebimentosFiltrados
      .filter(r => r.status === 'Pendente')
      .reduce((total, r) => total + r.valor, 0);
    const totalRecebidos = recebimentosFiltrados
      .filter(r => r.status === 'Recebido')
      .reduce((total, r) => total + r.valor, 0);

    const content = `
RELATÓRIO SINTÉTICO DE RECEBIMENTOS - ${new Date().toLocaleDateString('pt-BR')}

Período: ${filtros.dataInicial} a ${filtros.dataFinal}
Filtro: ${filtros.filtroData}
Tipo: ${filtros.tipoFiltroContas}

═══════════════════════════════════════════════════════════════

RESUMO SINTÉTICO:
- Total de Recebimentos: ${recebimentosFiltrados.length}
- Valor Total: R$ ${totalRecebimentos.toFixed(2).replace('.', ',')}
- Valores Recebidos: R$ ${totalRecebidos.toFixed(2).replace('.', ',')}
- Valores Pendentes: R$ ${totalPendentes.toFixed(2).replace('.', ',')}

═══════════════════════════════════════════════════════════════

RESUMO POR CATEGORIA:
${getResumoCategoriaRecebimentos(recebimentosFiltrados)}

═══════════════════════════════════════════════════════════════

RESUMO POR CLIENTE:
${getResumoCliente(recebimentosFiltrados)}

═══════════════════════════════════════════════════════════════

DETALHAMENTO SINTÉTICO:

${recebimentosFiltrados.map(recebimento => `
${recebimento.data} | ${recebimento.categoria.toUpperCase()}
───────────────────────────────────────────────────────────────
• Descrição: ${recebimento.descricao}
• Cliente: ${recebimento.cliente}
• Valor: R$ ${recebimento.valor.toFixed(2).replace('.', ',')}
• Status: ${recebimento.status}
• Vencimento: ${recebimento.dataVencimento}
• Forma Pagamento: ${recebimento.formaPagamento}
${recebimento.parcela ? `• Parcela: ${recebimento.parcela}` : ''}
${recebimento.numeroRecibo ? `• Recibo: ${recebimento.numeroRecibo}` : ''}
`).join('\n')}

═══════════════════════════════════════════════════════════════

INDICADORES FINANCEIROS:
- Maior Recebimento: R$ ${Math.max(...recebimentosFiltrados.map(r => r.valor)).toFixed(2).replace('.', ',')}
- Menor Recebimento: R$ ${Math.min(...recebimentosFiltrados.map(r => r.valor)).toFixed(2).replace('.', ',')}
- Média por Recebimento: R$ ${(totalRecebimentos / recebimentosFiltrados.length).toFixed(2).replace('.', ',')}
- % Recebimentos Pagos: ${((totalRecebidos / totalRecebimentos) * 100).toFixed(1)}%
- Taxa de Inadimplência: ${((totalPendentes / totalRecebimentos) * 100).toFixed(1)}%

═══════════════════════════════════════════════════════════════

ANÁLISE DE RECEBIMENTOS POR FORMA DE PAGAMENTO:
${getResumoFormaPagamento(recebimentosFiltrados)}

═══════════════════════════════════════════════════════════════

Relatório gerado em: ${new Date().toLocaleString('pt-BR')}
Sistema de Gestão Odontológica - Módulo Financeiro
    `;
    
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `relatorio-sintetico-recebimentos-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    alert('Relatório sintético de recebimentos baixado com sucesso!');
  };

  const getResumoCategoriaRecebimentos = (recebimentos: Recebimento[]) => {
    const categorias: { [key: string]: { total: number, quantidade: number } } = {};
    
    recebimentos.forEach(r => {
      if (!categorias[r.categoria]) {
        categorias[r.categoria] = { total: 0, quantidade: 0 };
      }
      categorias[r.categoria].total += r.valor;
      categorias[r.categoria].quantidade += 1;
    });
    
    return Object.keys(categorias)
      .sort((a, b) => categorias[b].total - categorias[a].total)
      .map(cat => 
        `• ${cat}: R$ ${categorias[cat].total.toFixed(2).replace('.', ',')} (${categorias[cat].quantidade} recebimentos)`
      ).join('\n');
  };

  const getResumoCliente = (recebimentos: Recebimento[]) => {
    const clientes: { [key: string]: number } = {};
    
    recebimentos.forEach(r => {
      if (!clientes[r.cliente]) {
        clientes[r.cliente] = 0;
      }
      clientes[r.cliente] += r.valor;
    });
    
    return Object.keys(clientes)
      .sort((a, b) => clientes[b] - clientes[a])
      .map(cliente => 
        `• ${cliente}: R$ ${clientes[cliente].toFixed(2).replace('.', ',')}`
      ).join('\n');
  };

  const getResumoFormaPagamento = (recebimentos: Recebimento[]) => {
    const formas: { [key: string]: { total: number, quantidade: number } } = {};
    
    recebimentos.forEach(r => {
      if (!formas[r.formaPagamento]) {
        formas[r.formaPagamento] = { total: 0, quantidade: 0 };
      }
      formas[r.formaPagamento].total += r.valor;
      formas[r.formaPagamento].quantidade += 1;
    });
    
    return Object.keys(formas)
      .sort((a, b) => formas[b].total - formas[a].total)
      .map(forma => 
        `• ${forma}: R$ ${formas[forma].total.toFixed(2).replace('.', ',')} (${formas[forma].quantidade} transações)`
      ).join('\n');
  };

  const filtrarRecebimentos = () => {
    return recebimentos.filter(recebimento => {
      // Filtro por tipo
      if (filtros.tipoFiltroContas !== 'Todos' && filtros.tipoFiltroContas !== 'Clientes') {
        // Implementar outros filtros se necessário
      }
      
      // Filtro por status
      if (filtros.pendentesPago === 'Pendentes' && recebimento.status !== 'Pendente') return false;
      if (filtros.pendentesPago === 'Recebidos' && recebimento.status !== 'Recebido') return false;
      
      return true;
    });
  };

  const recebimentosFiltrados = filtrarRecebimentos();

  const calcularTotaisRecebimentos = () => {
    const totalRecebimentos = recebimentosFiltrados.reduce((total, r) => total + r.valor, 0);
    const totalPendentes = recebimentosFiltrados
      .filter(r => r.status === 'Pendente')
      .reduce((total, r) => total + r.valor, 0);
    const totalRecebidos = recebimentosFiltrados
      .filter(r => r.status === 'Recebido')
      .reduce((total, r) => total + r.valor, 0);

    return { totalRecebimentos, totalPendentes, totalRecebidos };
  };

  const { totalRecebimentos, totalPendentes, totalRecebidos } = calcularTotaisRecebimentos();

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const closeModal = () => {
    setShowModal(false);
    window.history.back();
  };

  const getCategoriaColor = (categoria: string) => {
    const cores: { [key: string]: string } = {
      'Consulta': '#10b981',
      'Ortodontia': '#3b82f6',
      'Cirurgia': '#ef4444',
      'Estética': '#f59e0b',
      'Procedimento': '#8b5cf6',
      'Prótese': '#06b6d4',
      'Exame': '#84cc16'
    };
    return cores[categoria] || '#6b7280';
  };

  return (
    <div className="relatorio-sintetico-recebimentos-page">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content-relatorio-sintetico">
            <div className="modal-header">
              <h2>Relatório Sintético Recebimentos ( Tudo / Hoje / Mês / Ano )</h2>
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
                  <div className="resumo-cards-recebimentos">
                    <div className="resumo-card total-recebimentos">
                      <h3>Total Recebimentos</h3>
                      <span className="valor">{formatCurrency(totalRecebimentos)}</span>
                      <small>{recebimentosFiltrados.length} lançamentos</small>
                    </div>
                    <div className="resumo-card recebimentos-recebidos">
                      <h3>Valores Recebidos</h3>
                      <span className="valor">{formatCurrency(totalRecebidos)}</span>
                      <small>{recebimentosFiltrados.filter(r => r.status === 'Recebido').length} recebidos</small>
                    </div>
                    <div className="resumo-card recebimentos-pendentes">
                      <h3>Valores Pendentes</h3>
                      <span className="valor">{formatCurrency(totalPendentes)}</span>
                      <small>{recebimentosFiltrados.filter(r => r.status === 'Pendente').length} pendentes</small>
                    </div>
                    <div className="resumo-card media-recebimentos">
                      <h3>Média por Cliente</h3>
                      <span className="valor">
                        {formatCurrency(totalRecebimentos / (recebimentosFiltrados.length || 1))}
                      </span>
                      <small>Ticket médio</small>
                    </div>
                  </div>

                  <div className="acoes-relatorio">
                    <button className="btn-baixar" onClick={gerarRelatorioSintetico}>
                      📊 Baixar Relatório Sintético
                    </button>
                  </div>

                  <div className="lista-recebimentos">
                    <h3>Recebimentos Encontrados ({recebimentosFiltrados.length})</h3>
                    
                    {recebimentosFiltrados.length === 0 ? (
                      <div className="empty-state">
                        <p>Nenhum recebimento encontrado com os filtros aplicados!</p>
                      </div>
                    ) : (
                      <div className="recebimentos-grid">
                        {recebimentosFiltrados.map(recebimento => (
                          <div key={recebimento.id} className="recebimento-card">
                            <div className="card-header">
                              <div className="header-left">
                                <h4>{recebimento.descricao}</h4>
                                <span className="data">{recebimento.data}</span>
                              </div>
                              <span 
                                className="categoria-badge"
                                style={{ backgroundColor: getCategoriaColor(recebimento.categoria) }}
                              >
                                {recebimento.categoria}
                              </span>
                            </div>
                            
                            <div className="card-body">
                              <div className="info-row">
                                <span className="label">Cliente:</span>
                                <span className="value">{recebimento.cliente}</span>
                              </div>
                              <div className="info-row">
                                <span className="label">Valor:</span>
                                <span className="value valor-destaque">{formatCurrency(recebimento.valor)}</span>
                              </div>
                              <div className="info-row">
                                <span className="label">Status:</span>
                                <span className={`status-badge ${recebimento.status.toLowerCase()}`}>
                                  {recebimento.status}
                                </span>
                              </div>
                              <div className="info-row">
                                <span className="label">Vencimento:</span>
                                <span className="value">{recebimento.dataVencimento}</span>
                              </div>
                              <div className="info-row">
                                <span className="label">Pagamento:</span>
                                <span className="value">{recebimento.formaPagamento}</span>
                              </div>
                              {recebimento.parcela && (
                                <div className="info-row">
                                  <span className="label">Parcela:</span>
                                  <span className="value">{recebimento.parcela}</span>
                                </div>
                              )}
                              {recebimento.numeroRecibo && (
                                <div className="info-row">
                                  <span className="label">Recibo:</span>
                                  <span className="value">{recebimento.numeroRecibo}</span>
                                </div>
                              )}
                              {recebimento.observacoes && (
                                <div className="observacoes">
                                  <small>{recebimento.observacoes}</small>
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

export default RelatorioSinteticoRecebimentosPage;