import React, { useState } from 'react';
import ContasPagarList from '../components/ContasPagar/ContasPagarList';
import ModalContaPagarPadrao from './ModalContaPagarPadrao';
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
  const [showModal, setShowModal] = useState(false);
  const [statusFiltro, setStatusFiltro] = useState<string | null>(null);
  const [contaFiltroId, setContaFiltroId] = useState<number | null>(null);

  // Dados resumo para contas a pagar
  const resumoContasPagar = {
    vencidas: 2450.75,
    venceHoje: 890.00,
    venceAmanha: 1200.50,
    recebidas: 0.0, // Para contas a pagar, não se aplica
    total: 15780.25,
    todasPendentes: 4541.25
  };

  // Importa os dados fakes
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const contasPagarFakes = require('./contasPagarFakes').contasPagarFakes;

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const handleCreate = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEdit = (conta: any) => {
    // Implementar edição
  };

  const handleDelete = (id: number) => {
    // Implementar exclusão
  };

  const handlePay = (conta: any) => {
    // Implementar pagamento
  };

  const handleSubmitModal = (conta: any) => {
    // Implementar cadastro
    setShowModal(false);
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
          <div className="card-status vencidas" onClick={() => {setStatusFiltro('Vencido'); setContaFiltroId(null);}} style={{cursor:'pointer'}}>
            <div className="card-icon">🚨</div>
            <div className="card-content">
              <span className="card-label">Vencidas</span>
              <span className="card-value">{formatCurrency(resumoContasPagar.vencidas)}</span>
            </div>
          </div>

          <div className="card-status vence-hoje" onClick={() => {setStatusFiltro('VenceHoje'); setContaFiltroId(null);}} style={{cursor:'pointer'}}>
            <div className="card-icon">⏰</div>
            <div className="card-content">
              <span className="card-label">Vence Hoje</span>
              <span className="card-value">{formatCurrency(resumoContasPagar.venceHoje)}</span>
            </div>
          </div>

          <div className="card-status vence-amanha" onClick={() => {setStatusFiltro('VenceAmanha'); setContaFiltroId(null);}} style={{cursor:'pointer'}}>
            <div className="card-icon">📅</div>
            <div className="card-content">
              <span className="card-label">Vence Amanhã</span>
              <span className="card-value">{formatCurrency(resumoContasPagar.venceAmanha)}</span>
            </div>
          </div>

          <div className="card-status total" onClick={() => {setStatusFiltro('Total'); setContaFiltroId(null);}} style={{cursor:'pointer'}}>
            <div className="card-icon">💰</div>
            <div className="card-content">
              <span className="card-label">Total</span>
              <span className="card-value">{formatCurrency(resumoContasPagar.total)}</span>
            </div>
          </div>

          <div className="card-status todas-pendentes" onClick={() => {setStatusFiltro('Pendente'); setContaFiltroId(null);}} style={{cursor:'pointer'}}>
            <div className="card-icon">📋</div>
            <div className="card-content">
              <span className="card-label">Todas Pendentes</span>
              <span className="card-value">{formatCurrency(resumoContasPagar.todasPendentes)}</span>
            </div>
          </div>
        </div>

        {/* Botões dinâmicos para cada conta do Modal/Fake - layout igual aos cards */}
        <div className="contas-botoes-lista" style={{display:'flex', flexWrap:'wrap', gap:'10px', marginTop:'16px'}}>
          {contasPagarFakes.map((conta:any) => (
            <div
              key={conta.id}
              className="card-status todas-pendentes"
              style={{flex:'1 1 180px', minWidth:'180px', maxWidth:'220px', display:'flex', alignItems:'center', gap:'8px', borderRadius:'8px', cursor:'pointer', color:'white', fontWeight:500, justifyContent:'space-between'}}
              onClick={() => {setContaFiltroId(conta.id); setStatusFiltro(null);}}
            >
              <div className="card-icon">🔢</div>
              <div className="card-content" style={{flex:'1', display:'flex', flexDirection:'column', gap:'2px'}}>
                <span className="card-label">{conta.descricao}</span>
                <span className="card-value">{formatCurrency(conta.valor_original || Math.floor(Math.random()*1000+100))}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de Contas a Pagar filtrada */}
      <div className="dashboard-content">
        <ContasPagarList
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPay={handlePay}
          filterStatus={statusFiltro === 'Pendente' ? 'Pendente' : statusFiltro === 'Vencido' ? 'Vencido' : undefined}
          contaFiltroId={contaFiltroId}
        />
        {/* Exemplo: pode expandir lógica para outros filtros como VenceHoje, VenceAmanha, Total, ou por conta individual */}
      </div>
      {/* Modal de cadastro de conta a pagar */}
      <ModalContaPagarPadrao
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
      />
    </div>
  );
};

export default ContasPagarPage;