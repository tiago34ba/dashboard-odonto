import React from "react";
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
}

const Card: React.FC<CardProps> = ({ title, value, subtitle, icon, color, trend }) => {
  return (
    <div className={`dashboard-card ${color}`}>
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
  const cardsData = [
    // Cards baseados na imagem
    {
      title: "Total Pacientes",
      value: "6",
      subtitle: "Este Mês",
      icon: "👥",
      color: "green",
      trend: { direction: 'down' as const, value: "0" }
    },
    {
      title: "Despesas Vencidas",
      value: "R$ 206,50",
      subtitle: "Pagar Vencidas",
      icon: "💳",
      color: "red",
      trend: { direction: 'down' as const, value: "4" }
    },
    {
      title: "Receber Vencidas",
      value: "R$ 100,00",
      subtitle: "Receb. Vencidas",
      icon: "💰",
      color: "cyan",
      trend: { direction: 'up' as const, value: "2" }
    },
    {
      title: "Saldo no Mês",
      value: "R$ 0,00",
      subtitle: "Saldo Hoje",
      icon: "📊",
      color: "cyan",
      trend: { direction: 'up' as const, value: "R$ 0,00" }
    },
    {
      title: "Agendamentos Hoje",
      value: "0",
      subtitle: "Este Mês",
      icon: "📅",
      color: "red",
      trend: { direction: 'down' as const, value: "0" }
    },
    {
      title: "Agendamentos Confirmados",
      value: "0",
      subtitle: "Finalizados",
      icon: "✅",
      color: "cyan",
      trend: { direction: 'down' as const, value: "0" }
    },
    {
      title: "Consultas Hoje",
      value: "R$ 0,00",
      subtitle: "Mês R$",
      icon: "🩺",
      color: "cyan",
      trend: { direction: 'up' as const, value: "R$ 0,00" }
    },
    {
      title: "Orçamentos Pendentes",
      value: "4",
      subtitle: "Orçamentos Hoje",
      icon: "📋",
      color: "red",
      trend: { direction: 'up' as const, value: "1" }
    },

    // Cards adicionais para sistema odontológico
    {
      title: "Procedimentos Realizados",
      value: "18",
      subtitle: "Este Mês",
      icon: "🦷",
      color: "blue",
      trend: { direction: 'up' as const, value: "5" }
    },
    {
      title: "Receita Mensal",
      value: "R$ 12.450,00",
      subtitle: "Meta: R$ 15.000",
      icon: "💸",
      color: "green",
      trend: { direction: 'up' as const, value: "83%" }
    },
    {
      title: "Pacientes Ativos",
      value: "142",
      subtitle: "Total Cadastros",
      icon: "👤",
      color: "blue",
      trend: { direction: 'up' as const, value: "8" }
    },
    {
      title: "Taxa de Presença",
      value: "87%",
      subtitle: "Comparecimento",
      icon: "✨",
      color: "green",
      trend: { direction: 'up' as const, value: "3%" }
    },
    {
      title: "Estoque Baixo",
      value: "7",
      subtitle: "Itens p/ Repor",
      icon: "📦",
      color: "orange",
      trend: { direction: 'down' as const, value: "2" }
    },
    {
      title: "Retornos Agendados",
      value: "23",
      subtitle: "Próximos 7 dias",
      icon: "🔄",
      color: "purple",
      trend: { direction: 'up' as const, value: "5" }
    },
    {
      title: "Tratamentos em Andamento",
      value: "31",
      subtitle: "Casos Ativos",
      icon: "⚕️",
      color: "blue",
      trend: { direction: 'up' as const, value: "4" }
    },
    {
      title: "Satisfação do Cliente",
      value: "4.8",
      subtitle: "Média Avaliações",
      icon: "⭐",
      color: "yellow",
      trend: { direction: 'up' as const, value: "0.2" }
    }
  ];

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
            <span className="stat-text">Última Atualização: {new Date().toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;