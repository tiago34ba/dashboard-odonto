import React, { useState } from 'react';
import '../../Financeiro/FinanceiroDashboard.css';

const ContasReceberPage: React.FC = () => {
  const [dataInicio, setDataInicio] = useState('01/11/2025');
  const [dataFim, setDataFim] = useState('30/11/2025');

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(1).replace('.', ',')}`;
  };

  const handleCreateConta = () => {
    console.log('Adicionar nova conta a receber');
  };

  const handleRelatorio = () => {
    console.log('Gerar relatório');
  };

  return (
    <div className="financeiro-dashboard-new">
      {/* Header com controles */}
      <div className="dashboard-header-new">
        <div className="header-top">
          <button
            onClick={handleCreateConta}
            className="btn-adicionar-conta"
          >
            + Adicionar Conta
          </button>

          <div className="filtros-data">
            <input
              type="text"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="input-data"
              placeholder="Data início"
            />
            <input
              type="text"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="input-data"
              placeholder="Data fim"
            />
            <button
              onClick={handleRelatorio}
              className="btn-relatorio"
            >
              📊
            </button>
          </div>
        </div>

        {/* Cards de Status */}
        <div className="cards-status">
          <div className="card-status vencidas">
            <div className="card-icon">💥</div>
            <div className="card-content">
              <div className="card-label">Vencidas</div>
              <div className="card-value">{formatCurrency(0.0)}</div>
            </div>
          </div>

          <div className="card-status vence-hoje">
            <div className="card-icon">⏰</div>
            <div className="card-content">
              <div className="card-label">Vence Hoje</div>
              <div className="card-value">{formatCurrency(0.0)}</div>
            </div>
          </div>

          <div className="card-status vence-amanha">
            <div className="card-icon">📅</div>
            <div className="card-content">
              <div className="card-label">Vence Amanhã</div>
              <div className="card-value">{formatCurrency(0.0)}</div>
            </div>
          </div>

          <div className="card-status recebidas">
            <div className="card-icon">✅</div>
            <div className="card-content">
              <div className="card-label">Recebidas</div>
              <div className="card-value">{formatCurrency(0.0)}</div>
            </div>
          </div>

          <div className="card-status total">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <div className="card-label">Total</div>
              <div className="card-value">{formatCurrency(0.0)}</div>
            </div>
          </div>

          <div className="card-status todas-pendentes">
            <div className="card-icon">📋</div>
            <div className="card-content">
              <div className="card-label">Todas Pendentes</div>
              <div className="card-value">{formatCurrency(0.0)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Área de conteúdo principal */}
      <div className="dashboard-content">
        <p className="content-placeholder">
          Layout limpo - Contas a Receber
        </p>
      </div>
    </div>
  );
};

export default ContasReceberPage;