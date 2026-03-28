import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Financeiro/FinanceiroDashboard.css';
import api from '../../../../components/api/api';

interface DashboardTotais {
  vencidas: number;
  vencente_hoje: number;
  vencente_amanha: number;
  recebidas: number;
  total_periodo: number;
  todas_pendentes: number;
}

const ContasReceberPage: React.FC = () => {
  const navigate = useNavigate();
  const [dataInicio, setDataInicio] = useState('01/11/2025');
  const [dataFim, setDataFim] = useState('30/11/2025');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totais, setTotais] = useState<DashboardTotais>({
    vencidas: 0,
    vencente_hoje: 0,
    vencente_amanha: 0,
    recebidas: 0,
    total_periodo: 0,
    todas_pendentes: 0,
  });

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(1).replace('.', ',')}`;
  };

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/financeiro/contas-receber/dashboard');
      setTotais(response.data?.data?.totalizadores ?? totais);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao carregar dashboard de contas a receber');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateConta = () => {
    navigate('/dashboard/financeiro/consulta');
  };

  const handleRelatorio = () => {
    fetchDashboard();
  };

  return (
    <div className="financeiro-dashboard-new">
      {/* Header com controles */}
      <div className="dashboard-header-new">
        {error && (
          <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 8, border: '1px solid #ef4444', background: '#fee2e2', color: '#b91c1c' }}>
            {error}
          </div>
        )}
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
          <div className="card-status vencidas" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/financeiro/contas-receber')} title="Ir para modulo de Contas a Receber">
            <div className="card-icon">💥</div>
            <div className="card-content">
              <div className="card-label">Vencidas</div>
              <div className="card-value">{loading ? '...' : formatCurrency(totais.vencidas)}</div>
            </div>
          </div>

          <div className="card-status vence-hoje" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/financeiro/contas-receber')} title="Ir para modulo de Contas a Receber">
            <div className="card-icon">⏰</div>
            <div className="card-content">
              <div className="card-label">Vence Hoje</div>
              <div className="card-value">{loading ? '...' : formatCurrency(totais.vencente_hoje)}</div>
            </div>
          </div>

          <div className="card-status vence-amanha" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/financeiro/contas-receber')} title="Ir para modulo de Contas a Receber">
            <div className="card-icon">📅</div>
            <div className="card-content">
              <div className="card-label">Vence Amanhã</div>
              <div className="card-value">{loading ? '...' : formatCurrency(totais.vencente_amanha)}</div>
            </div>
          </div>

          <div className="card-status recebidas" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/financeiro/contas-receber')} title="Ir para modulo de Contas a Receber">
            <div className="card-icon">✅</div>
            <div className="card-content">
              <div className="card-label">Recebidas</div>
              <div className="card-value">{loading ? '...' : formatCurrency(totais.recebidas)}</div>
            </div>
          </div>

          <div className="card-status total" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/financeiro')} title="Ir para modulo Financeiro">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <div className="card-label">Total</div>
              <div className="card-value">{loading ? '...' : formatCurrency(totais.total_periodo)}</div>
            </div>
          </div>

          <div className="card-status todas-pendentes" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/financeiro/contas-receber')} title="Ir para modulo de Contas a Receber">
            <div className="card-icon">📋</div>
            <div className="card-content">
              <div className="card-label">Todas Pendentes</div>
              <div className="card-value">{loading ? '...' : formatCurrency(totais.todas_pendentes)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Área de conteúdo principal */}
      <div className="dashboard-content">
        <p className="content-placeholder">
          Dashboard conectado com API de contas a receber
        </p>
      </div>
    </div>
  );
};

export default ContasReceberPage;