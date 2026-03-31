import React, { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../../../../components/api/api';
import './ConsultaPage.css';
import '../FinanceiroDashboard.css';

interface ConsultaAgendada {
  id: number;
  paciente: string;
  dentista: string;
  procedimento: string;
  data: string;
  hora: string;
  status: string;
  observacoes?: string;
}

const ConsultaPage: React.FC = () => {
  const hojeIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [dataInicio, setDataInicio] = useState(hojeIso);
  const [dataFim, setDataFim] = useState(hojeIso);
  const [statusSelecionado, setStatusSelecionado] = useState('Todas');
  const [situacaoPagamento, setSituacaoPagamento] = useState('Todos');
  const [consultas, setConsultas] = useState<ConsultaAgendada[]>([]);
  const [consultasEncontradas, setConsultasEncontradas] = useState<ConsultaAgendada[]>([]);
  const [buscaRealizada, setBuscaRealizada] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const normalizarStatus = (status: string): string => {
    const mapa: Record<string, string> = {
      scheduled: 'Agendada',
      confirmed: 'Confirmada',
      in_progress: 'Em Atendimento',
      completed: 'Finalizada',
      canceled: 'Cancelada',
      cancelled: 'Cancelada',
      no_show: 'Cancelada',
      agendado: 'Agendada',
      confirmado: 'Confirmada',
      em_atendimento: 'Em Atendimento',
      concluido: 'Finalizada',
      cancelado: 'Cancelada',
    };

    return mapa[(status || '').toLowerCase()] || 'Agendada';
  };

  const carregarConsultas = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    try {
      const response = await api.get('/schedulings', {
        params: {
          per_page: 300,
          sort_by: 'date',
          sort_order: 'desc',
        },
      });

      const lista = Array.isArray(response?.data?.data) ? response.data.data : [];

      const normalizadas = lista.map((item: any) => ({
        id: item.id,
        paciente: item.paciente || item.patient_name || item.paciente_nome || 'Paciente nao informado',
        dentista: item.dentista || item.professional_name || item.profissional_nome || 'Dentista nao informado',
        procedimento: item.procedimento || item.procedure_name || 'Consulta odontologica',
        data: item.data || item.date || '',
        hora: item.hora || item.time || '',
        status: normalizarStatus(item.status || ''),
        observacoes: item.observacoes || item.obs || '',
      }));

      setConsultas(normalizadas);
      setConsultasEncontradas(normalizadas);
      setBuscaRealizada(true);
    } catch (error: any) {
      setErro(error?.response?.data?.message || 'Nao foi possivel carregar as consultas agendadas.');
      setConsultas([]);
      setConsultasEncontradas([]);
      setBuscaRealizada(true);
    } finally {
      setCarregando(false);
    }
  }, []);

  const aplicarFiltros = useCallback(() => {
    const inicio = dataInicio ? new Date(`${dataInicio}T00:00:00`) : null;
    const fim = dataFim ? new Date(`${dataFim}T23:59:59`) : null;

    const filtradas = consultas.filter((consulta) => {
      const dataConsulta = consulta.data ? new Date(`${consulta.data}T12:00:00`) : null;

      if (inicio && dataConsulta && dataConsulta < inicio) {
        return false;
      }

      if (fim && dataConsulta && dataConsulta > fim) {
        return false;
      }

      if (statusSelecionado !== 'Todas' && consulta.status !== statusSelecionado) {
        return false;
      }

      if (situacaoPagamento === 'Pendentes') {
        return consulta.status !== 'Finalizada';
      }

      if (situacaoPagamento === 'Pagos') {
        return consulta.status === 'Finalizada';
      }

      return true;
    });

    setConsultasEncontradas(filtradas);
    setBuscaRealizada(true);
  }, [consultas, dataFim, dataInicio, situacaoPagamento, statusSelecionado]);

  const handleBuscarConsultas = () => {
    aplicarFiltros();
  };

  useEffect(() => {
    carregarConsultas();
  }, [carregarConsultas]);

  useEffect(() => {
    if (buscaRealizada) {
      aplicarFiltros();
    }
  }, [statusSelecionado, situacaoPagamento, buscaRealizada, aplicarFiltros]);

  return (
    <div className="consulta-page">
      <div className="consulta-header">
        <div className="date-filters">
          <div className="date-input-group">
            <label>📅</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="date-input"
            />
          </div>
          
          <div className="date-input-group">
            <label>📅</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="date-input"
            />
          </div>
          
          <button className="buscar-btn" onClick={handleBuscarConsultas}>
            🔍 Buscar Consultas
          </button>
        </div>

        <div className="filter-links">
          <span className="filter-group">
            <span className="filter-label filter-link" onClick={() => setStatusSelecionado('Todas')}>Todas</span>
            <span className="filter-separator"> / </span>
            <span className="filter-link" onClick={() => setStatusSelecionado('Agendada')}>Agendadas</span>
            <span className="filter-separator"> / </span>
            <span className="filter-link" onClick={() => setStatusSelecionado('Confirmada')}>Confirmadas</span>
            <span className="filter-separator"> / </span>
            <span className="filter-link" onClick={() => setStatusSelecionado('Finalizada')}>Finalizadas</span>
          </span>
          
          <span className="vertical-separator">|</span>
          
          <span className="filter-group">
            <span className="filter-link" onClick={() => setSituacaoPagamento('Todos')}>Todos</span>
            <span className="filter-separator"> / </span>
            <span className="filter-link" onClick={() => setSituacaoPagamento('Pendentes')}>Pendentes</span>
            <span className="filter-separator"> / </span>
            <span className="filter-link" onClick={() => setSituacaoPagamento('Pagos')}>Pagos</span>
          </span>
        </div>
      </div>

      <div className="consulta-content">
        {carregando ? (
          <div className="empty-state">
            <p>Carregando consultas agendadas...</p>
          </div>
        ) : erro ? (
          <div className="empty-state">
            <p>{erro}</p>
          </div>
        ) : !buscaRealizada ? (
          <div className="empty-state">
            <p>Selecione um periodo e clique em Buscar Consultas para ver os resultados.</p>
          </div>
        ) : consultasEncontradas.length === 0 ? (
          <div className="empty-state">
            <p>Nao foi encontrado nenhum registro no periodo selecionado.</p>
          </div>
        ) : (
          <div className="consultas-list">
            {consultasEncontradas.map((consulta) => (
              <div key={consulta.id} className="consulta-item">
                <div className="consulta-grid">
                  <div>
                    <strong>Paciente:</strong> {consulta.paciente}
                  </div>
                  <div>
                    <strong>Dentista:</strong> {consulta.dentista}
                  </div>
                  <div>
                    <strong>Procedimento:</strong> {consulta.procedimento}
                  </div>
                  <div>
                    <strong>Data/Hora:</strong> {consulta.data} as {consulta.hora}
                  </div>
                  <div>
                    <strong>Status:</strong> {consulta.status}
                  </div>
                </div>
                {consulta.observacoes ? (
                  <div className="consulta-obs">
                    <strong>Observacoes:</strong> {consulta.observacoes}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultaPage;