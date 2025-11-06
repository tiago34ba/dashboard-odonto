import React, { useState } from 'react';
import ContasPagarList from '../../../../components/ContasPagar/ContasPagarList';
import '../FinanceiroDashboard.css';

interface ContaPagar {
  id: number;
  codigo: string;
  descricao: string;
  fornecedor: string;
  categoria: 'Equipamentos' | 'Materiais' | 'Medicamentos' | 'Serviços' | 'Aluguel' | 'Energia' | 'Telefone' | 'Internet' | 'Impostos' | 'Outros';
  valor_original: number;
  valor_pago: number;
  valor_pendente: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: 'Pendente' | 'Vencido' | 'Pago' | 'Parcial';
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  forma_pagamento?: string;
  observacoes?: string;
  created_at: string;
}

const ContasPagarPage: React.FC = () => {
  const [dataInicio, setDataInicio] = useState('01/11/2025');
  const [dataFim, setDataFim] = useState('30/11/2025');
  
  // Dados resumo para contas a pagar
  const resumoContasPagar = {
    vencidas: 2450.75,
    venceHoje: 890.00,
    venceAmanha: 1200.50,
    recebidas: 0.0, // Para contas a pagar, não se aplica
    total: 15780.25,
    todasPendentes: 4541.25
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const handleCreate = () => {
    console.log('Criar nova conta a pagar');
    // Aqui você abriria um modal ou navegaria para página de criação
    alert('Funcionalidade de criar conta a pagar será implementada');
  };

  const handleEdit = (conta: ContaPagar) => {
    console.log('Editar conta a pagar:', conta);
    // Aqui você abriria um modal ou navegaria para página de edição
    alert(`Funcionalidade de editar conta: ${conta.descricao} será implementada`);
  };

  const handleDelete = (id: number) => {
    console.log('Excluir conta a pagar:', id);
    // Aqui você mostraria uma confirmação e faria a exclusão
    const confirm = window.confirm('Tem certeza que deseja excluir esta conta?');
    if (confirm) {
      alert(`Conta ${id} seria excluída (funcionalidade será implementada)`);
    }
  };

  const handlePay = (conta: ContaPagar) => {
    console.log('Efetuar pagamento da conta:', conta);
    // Aqui você abriria um modal de pagamento
    alert(`Funcionalidade de pagamento da conta: ${conta.descricao} será implementada`);
  };

  return (
    <div className="financeiro-dashboard-new">
      {/* Header com botão e filtros de data */}
      <div className="dashboard-header-new">
        <div className="header-top">
          <button className="btn-adicionar-conta" onClick={handleCreate}>
            + Adicionar Conta a Pagar
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
          </div>
          <button className="btn-relatorio">
            📄
          </button>
        </div>

        {/* Cards coloridos de status */}
        <div className="cards-status">
          <div className="card-status vencidas">
            <div className="card-icon">🚨</div>
            <div className="card-content">
              <span className="card-label">Vencidas</span>
              <span className="card-value">{formatCurrency(resumoContasPagar.vencidas)}</span>
            </div>
          </div>

          <div className="card-status vence-hoje">
            <div className="card-icon">⏰</div>
            <div className="card-content">
              <span className="card-label">Vence Hoje</span>
              <span className="card-value">{formatCurrency(resumoContasPagar.venceHoje)}</span>
            </div>
          </div>

          <div className="card-status vence-amanha">
            <div className="card-icon">📅</div>
            <div className="card-content">
              <span className="card-label">Vence Amanhã</span>
              <span className="card-value">{formatCurrency(resumoContasPagar.venceAmanha)}</span>
            </div>
          </div>

          <div className="card-status total">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <span className="card-label">Total</span>
              <span className="card-value">{formatCurrency(resumoContasPagar.total)}</span>
            </div>
          </div>

          <div className="card-status todas-pendentes">
            <div className="card-icon">📋</div>
            <div className="card-content">
              <span className="card-label">Todas Pendentes</span>
              <span className="card-value">{formatCurrency(resumoContasPagar.todasPendentes)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Contas a Pagar */}
      <div className="dashboard-content">
        <ContasPagarList
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPay={handlePay}
        />
      </div>
    </div>
  );
};

export default ContasPagarPage;