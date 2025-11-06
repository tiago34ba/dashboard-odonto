import React, { useState } from 'react';
import './ConsultaPage.css';
import '../FinanceiroDashboard.css';

const ConsultaPage: React.FC = () => {
  const [dataInicio, setDataInicio] = useState('05/11/2025');
  const [dataFim, setDataFim] = useState('05/11/2025');
  const [consultasEncontradas, setConsultasEncontradas] = useState<any[]>([]);
  const [buscaRealizada, setBuscaRealizada] = useState(false);

  const handleBuscarConsultas = () => {
    // Aqui será implementada a busca de consultas por período
    console.log('Buscando consultas no período:', { dataInicio, dataFim });
    setBuscaRealizada(true);
    // Por enquanto, simular resultado vazio
    setConsultasEncontradas([]);
  };

  return (
    <div className="consulta-page">
      <div className="consulta-header">
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
          
          <button className="buscar-btn" onClick={handleBuscarConsultas}>
            🔍 Buscar Consultas
          </button>
        </div>

        <div className="filter-links">
          <span className="filter-group">
            <span className="filter-label">Todas / </span>
            <span className="filter-link">Agendadas</span>
            <span className="filter-separator"> / </span>
            <span className="filter-link">Confirmadas</span>
            <span className="filter-separator"> / </span>
            <span className="filter-link">Finalizadas</span>
          </span>
          
          <span className="vertical-separator">|</span>
          
          <span className="filter-group">
            <span className="filter-link">Todos</span>
            <span className="filter-separator"> / </span>
            <span className="filter-link">Pendentes</span>
            <span className="filter-separator"> / </span>
            <span className="filter-link">Pagos</span>
          </span>
        </div>
      </div>

      <div className="consulta-content">
        {!buscaRealizada ? (
          <div className="empty-state">
            <p>📅 Selecione um período e clique em "Buscar Consultas" para ver os resultados</p>
          </div>
        ) : consultasEncontradas.length === 0 ? (
          <div className="empty-state">
            <p>Não foi encontrado nenhum registro no período selecionado!</p>
          </div>
        ) : (
          <div className="consultas-list">
            {consultasEncontradas.map((consulta, index) => (
              <div key={index} className="consulta-item">
                {/* Aqui serão exibidas as consultas encontradas */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultaPage;