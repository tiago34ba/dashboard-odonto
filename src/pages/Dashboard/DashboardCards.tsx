import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/api/api";
import "./DashboardCards.css"; 

interface CardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
  trend?: {
    direction: 'up' | 'down';
    value: string | number;
  };
  route: string;
}

const Card: React.FC<CardProps> = ({ title, value, subtitle, icon, color, trend, route }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`dashboard-card ${color} clickable`}
      onClick={() => navigate(route)}
      title={`Ir para ${title}`}
    >
      <div className="card-icon">
        <span>{icon}</span>
      </div>
      <div className="card-content">
        <div className="card-title">{title}</div>
        <div className="card-value">{value}</div>
        {subtitle && <div className="card-subtitle">{subtitle}</div>}
        {trend && (
          <div className={`card-trend ${trend.direction}`}>
            <span className="trend-icon">
              {trend.direction === 'up' ? '▲' : '▼'}
            </span>
            <span className="trend-value">{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
};

interface DashboardProps {
  title: string;
  value: string;
}

const DashboardCards: React.FC<DashboardProps> = () => {
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [metrics, setMetrics] = useState({
    patientsTotal: 0,
    despesasVencidas: 0,
    receberVencidas: 0,
    saldoMes: 0,
    agendamentosHoje: 0,
    agendamentosConfirmados: 0,
    consultasHoje: 0,
    orcamentosPendentes: 0,
    procedimentosRealizados: 0,
    receitaMensal: 0,
    pacientesAtivos: 0,
    taxaPresenca: 0,
    estoqueBaixo: 0,
    retornosAgendados: 0,
    tratamentosAndamento: 0,
    satisfacaoCliente: 0,
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const fetchCards = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get('/dashboard/cards-summary');
      const m = response.data?.data?.metrics ?? {};

      setMetrics({
        patientsTotal: Number(m.patients_total ?? 0),
        despesasVencidas: Number(m.despesas_vencidas ?? 0),
        receberVencidas: Number(m.receber_vencidas ?? 0),
        saldoMes: Number(m.saldo_mes ?? 0),
        agendamentosHoje: Number(m.agendamentos_hoje ?? 0),
        agendamentosConfirmados: Number(m.agendamentos_confirmados ?? 0),
        consultasHoje: Number(m.consultas_hoje ?? 0),
        orcamentosPendentes: Number(m.orcamentos_pendentes ?? 0),
        procedimentosRealizados: Number(m.procedimentos_realizados ?? 0),
        receitaMensal: Number(m.receita_mensal ?? 0),
        pacientesAtivos: Number(m.pacientes_ativos ?? 0),
        taxaPresenca: Number(m.taxa_presenca ?? 0),
        estoqueBaixo: Number(m.estoque_baixo ?? 0),
        retornosAgendados: Number(m.retornos_agendados ?? 0),
        tratamentosAndamento: Number(m.tratamentos_andamento ?? 0),
        satisfacaoCliente: Number(m.satisfacao_cliente ?? 0),
      });
      setLastUpdated(new Date().toLocaleString('pt-BR'));
    } catch {
      setMetrics((prev) => ({ ...prev }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();

    const onRefreshCards = () => {
      fetchCards();
    };

    window.addEventListener('dashboard:cards:refresh', onRefreshCards);
    const intervalId = window.setInterval(fetchCards, 30000);

    return () => {
      window.removeEventListener('dashboard:cards:refresh', onRefreshCards);
      window.clearInterval(intervalId);
    };
  }, [fetchCards]);

  const cardsData = useMemo(() => [
    {
      title: "Total Pacientes",
      value: loading ? '...' : String(metrics.patientsTotal),
      subtitle: "Total no banco",
      icon: "👥",
      color: "green",
      trend: { direction: 'up' as const, value: 'API' },
      route: '/dashboard/pessoas/pacientes/PatientsPage',
    },
    {
      title: "Despesas Vencidas",
      value: loading ? '...' : formatCurrency(metrics.despesasVencidas),
      subtitle: "Contas a Pagar",
      icon: "💳",
      color: "red",
      trend: { direction: 'down' as const, value: 'API' },
      route: '/dashboard/financeiro/contas-pagar',
    },
    {
      title: "Receber Vencidas",
      value: loading ? '...' : formatCurrency(metrics.receberVencidas),
      subtitle: "Contas a Receber",
      icon: "💰",
      color: "cyan",
      trend: { direction: 'down' as const, value: 'API' },
      route: '/dashboard/financeiro/contas-receber',
    },
    {
      title: "Saldo no Mês",
      value: loading ? '...' : formatCurrency(metrics.saldoMes),
      subtitle: "Recebidas - Pagas",
      icon: "📊",
      color: "cyan",
      trend: { direction: metrics.saldoMes >= 0 ? 'up' as const : 'down' as const, value: 'API' },
      route: '/dashboard/caixa',
    },
    {
      title: "Agendamentos Hoje",
      value: loading ? '...' : String(metrics.agendamentosHoje),
      subtitle: "Hoje",
      icon: "📅",
      color: "red",
      trend: { direction: 'up' as const, value: 'API' },
      route: '/dashboard/agendamentos',
    },
    {
      title: "Agendamentos Confirmados",
      value: loading ? '...' : String(metrics.agendamentosConfirmados),
      subtitle: "Mês atual",
      icon: "✅",
      color: "cyan",
      trend: { direction: 'up' as const, value: 'API' },
      route: '/dashboard/agendamentos/relatorio-agendamentos',
    },
    {
      title: "Consultas Hoje",
      value: loading ? '...' : String(metrics.consultasHoje),
      subtitle: "Módulo Consultas",
      icon: "🩺",
      color: "cyan",
      trend: { direction: 'up' as const, value: 'API' },
      route: '/dashboard/consultas',
    },
    {
      title: "Orçamentos Pendentes",
      value: loading ? '...' : String(metrics.orcamentosPendentes),
      subtitle: "Modulo de orcamentos",
      icon: "📋",
      color: "red",
      trend: { direction: 'down' as const, value: 'API' },
      route: '/dashboard/orcamentos',
    },
    {
      title: "Procedimentos Realizados",
      value: loading ? '...' : String(metrics.procedimentosRealizados),
      subtitle: "Este mês",
      icon: "🦷",
      color: "blue",
      trend: { direction: 'up' as const, value: 'API' },
      route: '/dashboard/agendamentos/relatorio-procedimentos',
    },
    {
      title: "Receita Mensal",
      value: loading ? '...' : formatCurrency(metrics.receitaMensal),
      subtitle: "Contas recebidas",
      icon: "💸",
      color: "green",
      trend: { direction: 'up' as const, value: 'API' },
      route: '/dashboard/financeiro/contas-receber',
    },
    {
      title: "Pacientes Ativos",
      value: loading ? '...' : String(metrics.pacientesAtivos),
      subtitle: "Cadastros ativos",
      icon: "👤",
      color: "blue",
      trend: { direction: 'up' as const, value: 'API' },
      route: '/dashboard/pessoas/pacientes/PatientsPage',
    },
    {
      title: "Taxa de Presença",
      value: loading ? '...' : `${metrics.taxaPresenca}%`,
      subtitle: "Cálculo com agendamentos",
      icon: "✨",
      color: "green",
      trend: { direction: 'up' as const, value: 'API' },
      route: '/dashboard/agendamentos/relatorio-agendamentos',
    },
    {
      title: "Estoque Baixo",
      value: loading ? '...' : String(metrics.estoqueBaixo),
      subtitle: "Reposição pendente",
      icon: "📦",
      color: "orange",
      trend: { direction: 'down' as const, value: 'API' },
      route: '/dashboard/financeiro/contas-pagar',
    },
    {
      title: "Retornos Agendados",
      value: loading ? '...' : String(metrics.retornosAgendados),
      subtitle: "Próximos 7 dias",
      icon: "🔄",
      color: "purple",
      trend: { direction: 'up' as const, value: 'API' },
      route: '/dashboard/agendamentos',
    },
    {
      title: "Tratamentos em Andamento",
      value: loading ? '...' : String(metrics.tratamentosAndamento),
      subtitle: "Com base em anamneses",
      icon: "⚕️",
      color: "blue",
      trend: { direction: 'up' as const, value: 'API' },
      route: '/dashboard/tratamentos',
    },
    {
      title: "Satisfação do Cliente",
      value: loading ? '...' : metrics.satisfacaoCliente.toFixed(1),
      subtitle: "Média fornecedores",
      icon: "⭐",
      color: "yellow",
      trend: { direction: 'up' as const, value: 'API' },
      route: '/dashboard/pessoas/pacientes/PatientsPage',
    },
  ], [loading, metrics]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Dashboard - Clínica Odontológica</h1>
        <p>Resumo geral das atividades e indicadores principais</p>
      </div>
      
      <div className="cards-grid">
        {cardsData.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            color={card.color}
            trend={card.trend}
            route={card.route}
          />
        ))}
      </div>

      <div className="dashboard-footer">
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-icon">📈</span>
            <span className="stat-text">Crescimento Mensal: +12%</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🎯</span>
            <span className="stat-text">Meta Mensal: 83% Atingida</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⏰</span>
            <span className="stat-text">Última Atualização: {lastUpdated || 'Carregando...'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;