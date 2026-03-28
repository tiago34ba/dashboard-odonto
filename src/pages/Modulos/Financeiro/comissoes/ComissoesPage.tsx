import React, { useState } from 'react';
import '../FinanceiroDashboard.css';
import './ComissoesPage.css';

const ComissoesPage: React.FC = () => {
  const [dataInicio, setDataInicio] = useState('05/11/2025');
  const [dataFim, setDataFim] = useState('05/11/2025');
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState('Funcionário');

  const funcionarios = [
    'Funcionário',
    'Dr. João Silva',
    'Dra. Maria Santos',
    'Dr. Pedro Oliveira',
    'Dra. Ana Costa',
    'Dr. Carlos Mendes'
  ];

  const handleBaixarComissoes = () => {
    console.log('Baixar comissões para:', funcionarioSelecionado);
    console.log('Período:', dataInicio, 'até', dataFim);
    // Aqui você implementaria a lógica para baixar as comissões
  };

  return (
    <div className="comissoes-page">
      {/* Header com filtros */}
      <div className="comissoes-header">
        <div className="filtros-container">
          <div className="filtros-grupo">
            <div className="filtro-data">
              <span className="filtro-icon">📅</span>
              <input
                type="text"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="input-data-comissoes"
                placeholder="05/11/2025"
              />
            </div>

            <div className="filtro-data">
              <span className="filtro-icon">📅</span>
              <input
                type="text"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="input-data-comissoes"
                placeholder="05/11/2025"
              />
            </div>

            <div className="filtro-funcionario">
              <select
                value={funcionarioSelecionado}
                onChange={(e) => setFuncionarioSelecionado(e.target.value)}
                className="select-funcionario"
              >
                {funcionarios.map((funcionario, index) => (
                  <option key={index} value={funcionario}>
                    Filtrar: {funcionario}
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleBaixarComissoes}
              className="btn-baixar-comissoes"
            >
              Baixar Comissões
            </button>
          </div>
        </div>

        {/* Navegação */}
        <div className="navegacao-container">
          <div className="navegacao-links">
            <span className="nav-link">Ordem</span>
            <span className="nav-separator">/</span>
            <span className="nav-link">Hoje</span>
            <span className="nav-separator">/</span>
            <span className="nav-link">Mês</span>
          </div>
          
          <div className="navegacao-status">
            <span className="status-link">Todos</span>
            <span className="nav-separator">/</span>
            <span className="status-link">Pendentes</span>
            <span className="nav-separator">/</span>
            <span className="status-link">Pagos</span>
          </div>
        </div>
      </div>

      {/* Área de conteúdo */}
      <div className="comissoes-content">
        <div className="lista-vazia">
          <p className="mensagem-vazia">Não possui nenhum registro Cadastrado!</p>
        </div>
      </div>
    </div>
  );
};

export default ComissoesPage;