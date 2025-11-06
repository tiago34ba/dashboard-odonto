import React, { useState } from 'react';
import './FinanceiroDashboard.css';
 import ContasPagarDashboard from './components/ContasPagar/ContasPagarDashboard';
import ContasReceberList from './components/ContasReceber/ContasReceberList';

interface FinanceiroDashboardProps {}

const FinanceiroDashboard: React.FC<FinanceiroDashboardProps> = () => {
  const [activeModule, setActiveModule] = useState<'dashboard' | 'contas-pagar' | 'contas-receber' | 'recebimentos-convenio' | 'comissoes'>('dashboard');
  const [dataInicio, setDataInicio] = useState('01/11/2025');
  const [dataFim, setDataFim] = useState('30/11/2025');

  // Dados resumo para o dashboard baseados na imagem
  const resumoFinanceiro = {
    vencidas: 0.0,
    venceHoje: 0.0,
    venceAmanha: 0.0,
    recebidas: 0.0,
    total: 0.0,
    todasPendentes: 0.0
  };

  const handleModuleChange = (module: typeof activeModule) => {
    setActiveModule(module);
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const renderDashboard = () => (
    <div className="financeiro-dashboard-new">
      {/* Header com botão e filtros de data */}
      <div className="dashboard-header-new">
        <div className="header-top">
          <button className="btn-adicionar-conta">
            + Adicionar Conta
          </button>
          <div className="filtros-data">
            <input 
              type="text" 
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="input-data"
            />
            <input 
              type="text" 
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="input-data"
            />
          </div>
          <button className="btn-relatorio">
            📄
          </button>
        </div>

        {/* Cards coloridos de status */}
        <div className="cards-status">
          <div 
            className="card-status vencidas"
            onClick={() => handleModuleChange('contas-pagar')}
          >
            <div className="card-icon">📋</div>
            <div className="card-content">
              <span className="card-label">Vencidas</span>
              <span className="card-value">{formatCurrency(resumoFinanceiro.vencidas)}</span>
            </div>
          </div>

          <div 
            className="card-status vence-hoje"
            onClick={() => handleModuleChange('contas-pagar')}
          >
            <div className="card-icon">📋</div>
            <div className="card-content">
              <span className="card-label">Vence Hoje</span>
              <span className="card-value">{formatCurrency(resumoFinanceiro.venceHoje)}</span>
            </div>
          </div>

          <div 
            className="card-status vence-amanha"
            onClick={() => handleModuleChange('contas-pagar')}
          >
            <div className="card-icon">📋</div>
            <div className="card-content">
              <span className="card-label">Vence Amanhã</span>
              <span className="card-value">{formatCurrency(resumoFinanceiro.venceAmanha)}</span>
            </div>
          </div>

          <div 
            className="card-status recebidas"
            onClick={() => handleModuleChange('contas-receber')}
          >
            <div className="card-icon">📋</div>
            <div className="card-content">
              <span className="card-label">Recebidas</span>
              <span className="card-value">{formatCurrency(resumoFinanceiro.recebidas)}</span>
            </div>
          </div>

          <div 
            className="card-status total"
            onClick={() => handleModuleChange('dashboard')}
          >
            <div className="card-icon">📋</div>
            <div className="card-content">
              <span className="card-label">Total</span>
              <span className="card-value">{formatCurrency(resumoFinanceiro.total)}</span>
            </div>
          </div>

          <div 
            className="card-status todas-pendentes"
            onClick={() => handleModuleChange('contas-pagar')}
          >
            <div className="card-icon">📋</div>
            <div className="card-content">
              <span className="card-label">Todas Pendentes</span>
              <span className="card-value">{formatCurrency(resumoFinanceiro.todasPendentes)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista/Conteúdo Principal */}
      <div className="dashboard-content">
        <div className="content-placeholder">
          <p>Selecione um dos cards acima para ver os detalhes das contas</p>
        </div>
      </div>
    </div>
  );

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'contas-pagar':
        return (
          <div>
            <div className="mb-4">
              <button 
                onClick={() => setActiveModule('dashboard')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
              >
                <span>← Voltar ao Dashboard</span>
              </button>
            </div>
            <ContasPagarDashboard />
          </div>
        );
      case 'contas-receber':
        return (
          <div>
            <div className="mb-4">
              <button 
                onClick={() => setActiveModule('dashboard')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
              >
                <span>← Voltar ao Dashboard</span>
              </button>
            </div>
            <ContasReceberList />
          </div>
        );
      case 'recebimentos-convenio':
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="mb-4">
              <button 
                onClick={() => setActiveModule('dashboard')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 mb-6"
              >
                <span>← Voltar ao Dashboard</span>
              </button>
            </div>
            <div className="text-6xl mb-4">🏥</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recebimentos Convênio</h2>
            <p className="text-gray-600 mb-6">
              Módulo em desenvolvimento. Aqui você poderá acompanhar e gerenciar todos os recebimentos de convênios médicos.
            </p>
          </div>
        );
      case 'comissoes':
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="mb-4">
              <button 
                onClick={() => setActiveModule('dashboard')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 mb-6"
              >
                <span>← Voltar ao Dashboard</span>
              </button>
            </div>
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Comissões</h2>
            <p className="text-gray-600 mb-6">
              Módulo em desenvolvimento. Aqui você poderá calcular e gerenciar comissões de todos os profissionais.
            </p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {renderModuleContent()}
      </div>
    </div>
  );
};

export default FinanceiroDashboard;