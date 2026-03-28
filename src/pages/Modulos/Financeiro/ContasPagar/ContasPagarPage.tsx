import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContasPagarList from '../components/ContasPagar/ContasPagarList';
import ModalContaPagarPadrao from './ModalContaPagarPadrao';
import '../FinanceiroDashboard.css';
import api from '../../../../components/api/api';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const navigate = useNavigate();
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [statusFiltro, setStatusFiltro] = useState<string | null>(null);
  const [contaFiltroId, setContaFiltroId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [contasResumo, setContasResumo] = useState<any[]>([]);

  // Dados resumo para contas a pagar
  const [resumoContasPagar, setResumoContasPagar] = useState({
    vencidas: 0,
    venceHoje: 0,
    venceAmanha: 0,
    total: 0,
    todasPendentes: 0,
  });

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const params: Record<string, string> = {};
      if (dataInicio) params.data_inicio = dataInicio;
      if (dataFim) params.data_fim = dataFim;

      const response = await api.get('/financeiro/contas-pagar/dashboard', { params });
      const totalizadores = response.data?.data?.totalizadores ?? {};
      setResumoContasPagar({
        vencidas: Number(totalizadores.vencidas ?? 0),
        venceHoje: Number(totalizadores.vencente_hoje ?? 0),
        venceAmanha: Number(totalizadores.vencente_amanha ?? 0),
        total: Number(totalizadores.total_periodo ?? 0),
        todasPendentes: Number(totalizadores.todas_pendentes ?? 0),
      });
      setContasResumo(response.data?.data?.proximos_vencimentos ?? []);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? 'Erro ao carregar dashboard de contas a pagar');
    } finally {
      setLoading(false);
    }
  }, [dataInicio, dataFim]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const refreshAll = useCallback(async () => {
    await fetchDashboard();
    setRefreshKey((prev) => prev + 1);
    window.dispatchEvent(new Event('dashboard:cards:refresh'));
  }, [fetchDashboard]);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const handleCreate = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEdit = async (conta: any) => {
    const descricao = window.prompt('Editar descricao da conta', conta.descricao ?? '');
    if (descricao === null) return;

    try {
      setLoading(true);
      setErrorMsg(null);
      await api.put(`/financeiro/contas-pagar/${conta.id}`, {
        descricao: descricao.trim() || conta.descricao,
        supplier_id: conta.supplier_id ?? null,
        categoria: conta.categoria,
        valor_original: Number(conta.valor_original ?? 0),
        data_vencimento: conta.data_vencimento,
        prioridade: conta.prioridade,
        observacoes: conta.observacoes ?? null,
      });
      await refreshAll();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? 'Erro ao editar conta a pagar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Deseja excluir esta conta a pagar?')) return;

    try {
      setLoading(true);
      setErrorMsg(null);
      await api.delete(`/financeiro/contas-pagar/${id}`);
      await refreshAll();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? 'Erro ao excluir conta a pagar');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (conta: any) => {
    const maximo = Number(conta.valor_pendente ?? 0);
    const valorInformado = window.prompt('Valor do pagamento', String(maximo));
    if (valorInformado === null) return;

    const valorPago = Number(valorInformado.replace(',', '.'));
    if (!Number.isFinite(valorPago) || valorPago <= 0 || valorPago > maximo) {
      setErrorMsg(`Valor invalido. Informe um valor entre 0,01 e ${formatCurrency(maximo)}.`);
      return;
    }

    const formaPagamento = window.prompt('Forma de pagamento', 'Pix') || 'Pix';
    const dataPagamento = new Date().toISOString().slice(0, 10);

    try {
      setLoading(true);
      setErrorMsg(null);
      await api.patch(`/financeiro/contas-pagar/${conta.id}/pagar`, {
        valor_pago: valorPago,
        data_pagamento: dataPagamento,
        forma_pagamento: formaPagamento,
      });
      await refreshAll();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? 'Erro ao registrar pagamento');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitModal = async (conta: any) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await api.post('/financeiro/contas-pagar', {
        descricao: conta.descricao,
        supplier_id: null,
        categoria: conta.categoria,
        valor_original: Number(conta.valor_original ?? 0),
        data_vencimento: conta.data_vencimento,
        prioridade: conta.prioridade,
        observacoes: conta.observacoes ?? null,
      });

      setShowModal(false);
      await refreshAll();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? 'Erro ao cadastrar conta a pagar');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusCardClick = (status: string | null) => {
    navigate('/dashboard/financeiro/contas-pagar');
    setStatusFiltro(status);
    setContaFiltroId(null);
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
              type="date" 
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="input-data"
              placeholder="Data início"
            />
            <input 
              type="date" 
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="input-data"
              placeholder="Data fim"
            />
          </div>
          <button className="btn-relatorio" onClick={fetchDashboard}>
            📄
          </button>
        </div>

        {errorMsg && (
          <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 8, border: '1px solid #ef4444', background: '#fee2e2', color: '#b91c1c' }}>
            {errorMsg}
          </div>
        )}

        {/* Cards coloridos de status */}
        <div className="cards-status">
          <div className="card-status vencidas" onClick={() => handleStatusCardClick('Vencido')} style={{cursor:'pointer'}} title="Ir para modulo de Contas a Pagar">
            <div className="card-icon">🚨</div>
            <div className="card-content">
              <span className="card-label">Vencidas</span>
              <span className="card-value">{loading ? '...' : formatCurrency(resumoContasPagar.vencidas)}</span>
            </div>
          </div>

          <div className="card-status vence-hoje" onClick={() => handleStatusCardClick(null)} style={{cursor:'pointer'}} title="Ir para modulo de Contas a Pagar">
            <div className="card-icon">⏰</div>
            <div className="card-content">
              <span className="card-label">Vence Hoje</span>
              <span className="card-value">{loading ? '...' : formatCurrency(resumoContasPagar.venceHoje)}</span>
            </div>
          </div>

          <div className="card-status vence-amanha" onClick={() => handleStatusCardClick(null)} style={{cursor:'pointer'}} title="Ir para modulo de Contas a Pagar">
            <div className="card-icon">📅</div>
            <div className="card-content">
              <span className="card-label">Vence Amanhã</span>
              <span className="card-value">{loading ? '...' : formatCurrency(resumoContasPagar.venceAmanha)}</span>
            </div>
          </div>

          <div className="card-status total" onClick={() => navigate('/dashboard/financeiro')} style={{cursor:'pointer'}} title="Ir para modulo Financeiro">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <span className="card-label">Total</span>
              <span className="card-value">{loading ? '...' : formatCurrency(resumoContasPagar.total)}</span>
            </div>
          </div>

          <div className="card-status todas-pendentes" onClick={() => handleStatusCardClick('Pendente')} style={{cursor:'pointer'}} title="Ir para modulo de Contas a Pagar">
            <div className="card-icon">📋</div>
            <div className="card-content">
              <span className="card-label">Todas Pendentes</span>
              <span className="card-value">{loading ? '...' : formatCurrency(resumoContasPagar.todasPendentes)}</span>
            </div>
          </div>
        </div>

        {/* Botões dinâmicos para cada conta do Modal/Fake - layout igual aos cards */}
        <div className="contas-botoes-lista" style={{display:'flex', flexWrap:'wrap', gap:'10px', marginTop:'16px'}}>
          {contasResumo.map((conta:any) => (
            <div
              key={conta.id}
              className="card-status todas-pendentes"
              style={{flex:'1 1 180px', minWidth:'180px', maxWidth:'220px', display:'flex', alignItems:'center', gap:'8px', borderRadius:'8px', cursor:'pointer', color:'white', fontWeight:500, justifyContent:'space-between'}}
              onClick={() => { navigate('/dashboard/financeiro/contas-pagar'); setContaFiltroId(conta.id); setStatusFiltro(null); }}
              title="Ir para modulo de Contas a Pagar"
            >
              <div className="card-icon">🔢</div>
              <div className="card-content" style={{flex:'1', display:'flex', flexDirection:'column', gap:'2px'}}>
                <span className="card-label">{conta.descricao}</span>
                <span className="card-value">{formatCurrency(Number(conta.valor_original ?? 0))}</span>
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
          refreshKey={refreshKey}
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