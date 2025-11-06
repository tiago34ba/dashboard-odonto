import React, { useState, useMemo } from 'react';
import './ContasPagarDashboard.css';

interface ContaPagar {
  id: number;
  codigo: string;
  descricao: string;
  fornecedor: string;
  categoria: string;
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

interface ContasPagarDashboardProps {
  onCreate?: () => void;
}

const ContasPagarDashboard: React.FC<ContasPagarDashboardProps> = ({ onCreate }) => {
  const [dataInicio, setDataInicio] = useState('01/11/2025');
  const [dataFim, setDataFim] = useState('30/11/2025');

  // Lista vazia - aguardando integração com API real
  const contasPagar: ContaPagar[] = [];

  // Cálculos dos totalizadores
  const totalizadores = useMemo(() => {
    const hoje = new Date();
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);

    const vencidas = contasPagar.filter(conta => {
      const vencimento = new Date(conta.data_vencimento);
      return vencimento < hoje && conta.status !== 'Pago';
    });

    const vencenteHoje = contasPagar.filter(conta => {
      const vencimento = new Date(conta.data_vencimento);
      return vencimento.toDateString() === hoje.toDateString() && conta.status !== 'Pago';
    });

    const vencenteAmanha = contasPagar.filter(conta => {
      const vencimento = new Date(conta.data_vencimento);
      return vencimento.toDateString() === amanha.toDateString() && conta.status !== 'Pago';
    });

    const pagas = contasPagar.filter(conta => conta.status === 'Pago');
    const total = contasPagar.reduce((acc, conta) => acc + conta.valor_original, 0);
    const todasPendentes = contasPagar.filter(conta => conta.status !== 'Pago');

    return {
      vencidas: vencidas.reduce((acc, conta) => acc + conta.valor_pendente, 0),
      vencenteHoje: vencenteHoje.reduce((acc, conta) => acc + conta.valor_pendente, 0),
      vencenteAmanha: vencenteAmanha.reduce((acc, conta) => acc + conta.valor_pendente, 0),
      pagas: pagas.reduce((acc, conta) => acc + conta.valor_pago, 0),
      total: total,
      todasPendentes: todasPendentes.reduce((acc, conta) => acc + conta.valor_pendente, 0)
    };
  }, [contasPagar]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="contas-pagar-dashboard">
      {/* Header com filtros de data */}
      <div className="dashboard-header">
        <div className="header-left">
          <button className="btn-adicionar" onClick={onCreate}>
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
          </div>
        </div>
        <div className="header-right">
          <button className="btn-relatorio">
            📄
          </button>
        </div>
      </div>

      {/* Cards de totalizadores */}
      <div className="totalizadores-grid">
        {/* Card Vencidas */}
        <div className="card-totalizador vencidas">
          <div className="card-header">
            <h3>Vencidas</h3>
            <span className="icone">📋</span>
          </div>
          <div className="card-valor">
            {formatCurrency(totalizadores.vencidas)}
          </div>
        </div>

        {/* Card Vence Hoje */}
        <div className="card-totalizador vence-hoje">
          <div className="card-header">
            <h3>Vence Hoje</h3>
            <span className="icone">📋</span>
          </div>
          <div className="card-valor">
            {formatCurrency(totalizadores.vencenteHoje)}
          </div>
        </div>

        {/* Card Vence Amanhã */}
        <div className="card-totalizador vence-amanha">
          <div className="card-header">
            <h3>Vence Amanhã</h3>
            <span className="icone">📋</span>
          </div>
          <div className="card-valor">
            {formatCurrency(totalizadores.vencenteAmanha)}
          </div>
        </div>

        {/* Card Recebidas/Pagas */}
        <div className="card-totalizador recebidas">
          <div className="card-header">
            <h3>Recebidas</h3>
            <span className="icone">📋</span>
          </div>
          <div className="card-valor">
            {formatCurrency(totalizadores.pagas)}
          </div>
        </div>

        {/* Card Total */}
        <div className="card-totalizador total">
          <div className="card-header">
            <h3>Total</h3>
            <span className="icone">📋</span>
          </div>
          <div className="card-valor">
            {formatCurrency(totalizadores.total)}
          </div>
        </div>

        {/* Card Todas Pendentes */}
        <div className="card-totalizador todas-pendentes">
          <div className="card-header">
            <h3>Todas Pendentes</h3>
            <span className="icone">📋</span>
          </div>
          <div className="card-valor">
            {formatCurrency(totalizadores.todasPendentes)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContasPagarDashboard;