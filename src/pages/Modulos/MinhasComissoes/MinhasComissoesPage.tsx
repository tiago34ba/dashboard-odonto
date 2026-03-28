import React, { useState } from 'react';
import './MinhasComissoesPage.css';

interface Comissao {
  id: number;
  paciente: string;
  procedimento: string;
  valor: number;
  percentual: number;
  valorComissao: number;
  dataRealizacao: string;
  dataPagamento?: string;
  status: 'Pendente' | 'Pago' | 'Cancelado';
  observacoes?: string;
}

const MinhasComissoesPage: React.FC = () => {
  const [dataInicio, setDataInicio] = useState('06/11/2025');
  const [dataFim, setDataFim] = useState('06/11/2025');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [filtroOrdem, setFiltroOrdem] = useState('Hoje');

  // Dados fake para demonstração
  const [comissoes] = useState<Comissao[]>([
    {
      id: 1,
      paciente: 'Maria Silva Santos',
      procedimento: 'Implante Dentário',
      valor: 2500.00,
      percentual: 10,
      valorComissao: 250.00,
      dataRealizacao: '05/11/2025',
      dataPagamento: '06/11/2025',
      status: 'Pago',
      observacoes: 'Pagamento realizado via PIX'
    },
    {
      id: 2,
      paciente: 'João Carlos Oliveira',
      procedimento: 'Clareamento Dental',
      valor: 800.00,
      percentual: 15,
      valorComissao: 120.00,
      dataRealizacao: '04/11/2025',
      status: 'Pendente',
      observacoes: 'Aguardando pagamento do paciente'
    },
    {
      id: 3,
      paciente: 'Ana Paula Costa',
      procedimento: 'Ortodontia - Aparelho',
      valor: 1800.00,
      percentual: 8,
      valorComissao: 144.00,
      dataRealizacao: '03/11/2025',
      dataPagamento: '05/11/2025',
      status: 'Pago',
      observacoes: 'Primeira parcela do tratamento'
    }
  ]);

  const statusOptions = ['Todos', 'Pendentes', 'Pagos', 'Cancelados'];
  const ordemOptions = ['Hoje', 'Ordem', 'Mês'];

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const formatDate = (dateString: string) => {
    return dateString;
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Pago': 'status-pago',
      'Pendente': 'status-pendente',
      'Cancelado': 'status-cancelado'
    };
    
    return statusClasses[status as keyof typeof statusClasses] || 'status-pendente';
  };

  const filteredComissoes = comissoes.filter(comissao => {
    if (filtroStatus === 'Todos') return true;
    if (filtroStatus === 'Pendentes') return comissao.status === 'Pendente';
    if (filtroStatus === 'Pagos') return comissao.status === 'Pago';
    if (filtroStatus === 'Cancelados') return comissao.status === 'Cancelado';
    return true;
  });

  const totalComissoes = filteredComissoes.reduce((total, comissao) => total + comissao.valorComissao, 0);
  const totalPendentes = filteredComissoes.filter(c => c.status === 'Pendente').reduce((total, comissao) => total + comissao.valorComissao, 0);
  const totalPagos = filteredComissoes.filter(c => c.status === 'Pago').reduce((total, comissao) => total + comissao.valorComissao, 0);

  const handleExportRelatorio = () => {
    alert('Funcionalidade de exportar relatório será implementada');
  };

  const handleBaixarComissao = (id: number) => {
    alert(`Funcionalidade de baixar comissão ${id} será implementada`);
  };

  const handleVisualizarDetalhes = (comissao: Comissao) => {
    alert(`Detalhes da comissão:\nPaciente: ${comissao.paciente}\nProcedimento: ${comissao.procedimento}\nValor: ${formatCurrency(comissao.valorComissao)}`);
  };

  return (
    <div className="minhas-comissoes-page">
      <div className="comissoes-header">
        <div className="header-top">
          <h1 className="page-title">Minhas Comissões</h1>
          <button className="btn-relatorio" onClick={handleExportRelatorio}>
            📄 Relatório
          </button>
        </div>

        <div className="filters-section">
          <div className="date-filters">
            <div className="date-input-group">
              <label>📅</label>
              <input
                type="text"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                placeholder="DD/MM/AAAA"
                className="date-input"
              />
            </div>
            
            <div className="date-input-group">
              <label>📅</label>
              <input
                type="text"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                placeholder="DD/MM/AAAA"
                className="date-input"
              />
            </div>
          </div>

          <div className="filter-links">
            <div className="filter-group">
              {ordemOptions.map(opcao => (
                <span
                  key={opcao}
                  className={`filter-link ${filtroOrdem === opcao ? 'active' : ''}`}
                  onClick={() => setFiltroOrdem(opcao)}
                >
                  {opcao}
                </span>
              ))}
            </div>
            
            <span className="vertical-separator">|</span>
            
            <div className="filter-group">
              {statusOptions.map(status => (
                <span
                  key={status}
                  className={`filter-link ${filtroStatus === status ? 'active' : ''}`}
                  onClick={() => setFiltroStatus(status)}
                >
                  {status}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="resumo-cards">
          <div className="resumo-card total">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <span className="card-label">Total Comissões</span>
              <span className="card-value">{formatCurrency(totalComissoes)}</span>
            </div>
          </div>

          <div className="resumo-card pendente">
            <div className="card-icon">⏳</div>
            <div className="card-content">
              <span className="card-label">Pendentes</span>
              <span className="card-value">{formatCurrency(totalPendentes)}</span>
            </div>
          </div>

          <div className="resumo-card pago">
            <div className="card-icon">✅</div>
            <div className="card-content">
              <span className="card-label">Pagos</span>
              <span className="card-value">{formatCurrency(totalPagos)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="comissoes-content">
        {filteredComissoes.length === 0 ? (
          <div className="empty-state">
            <p>Não foi encontrado nenhum registro no período selecionado!</p>
          </div>
        ) : (
          <div className="comissoes-table-container">
            <table className="comissoes-table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Procedimento</th>
                  <th>Valor Total</th>
                  <th>%</th>
                  <th>Comissão</th>
                  <th>Data Realização</th>
                  <th>Data Pagamento</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredComissoes.map(comissao => (
                  <tr key={comissao.id}>
                    <td className="paciente-cell">
                      <div className="paciente-info">
                        <strong>{comissao.paciente}</strong>
                      </div>
                    </td>
                    <td className="procedimento-cell">{comissao.procedimento}</td>
                    <td className="valor-cell">{formatCurrency(comissao.valor)}</td>
                    <td className="percentual-cell">{comissao.percentual}%</td>
                    <td className="comissao-cell">
                      <strong>{formatCurrency(comissao.valorComissao)}</strong>
                    </td>
                    <td className="data-cell">{formatDate(comissao.dataRealizacao)}</td>
                    <td className="data-cell">
                      {comissao.dataPagamento ? formatDate(comissao.dataPagamento) : '-'}
                    </td>
                    <td className="status-cell">
                      <span className={`status-badge ${getStatusBadge(comissao.status)}`}>
                        {comissao.status}
                      </span>
                    </td>
                    <td className="acoes-cell">
                      <button 
                        className="btn-action view"
                        onClick={() => handleVisualizarDetalhes(comissao)}
                        title="Ver detalhes"
                      >
                        👁️
                      </button>
                      {comissao.status === 'Pendente' && (
                        <button 
                          className="btn-action download"
                          onClick={() => handleBaixarComissao(comissao.id)}
                          title="Baixar comissão"
                        >
                          💰
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Rodapé com totais */}
        <div className="comissoes-footer">
          <div className="footer-stats">
            <span className="stat-item">
              <strong>Total de registros:</strong> {filteredComissoes.length}
            </span>
            <span className="stat-item">
              <strong>Total em comissões:</strong> {formatCurrency(totalComissoes)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinhasComissoesPage;