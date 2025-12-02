import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Animações
const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// Styled Components
const DashboardContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  animation: ${slideIn} 0.6s ease-out;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const Subtitle = styled.p`
  color: rgba(255,255,255,0.9);
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  transition: all 0.3s ease;
  animation: ${slideIn} 0.6s ease-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 48px rgba(0,0,0,0.15);
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1rem;
`;

const StatTitle = styled.h3`
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const StatSubtext = styled.div`
  color: #718096;
  font-size: 0.9rem;
`;

const LoadingCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  background-image: linear-gradient(
    90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.8) 50%,
    rgba(255,255,255,0) 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite;
`;

const ErrorCard = styled.div`
  background: rgba(254, 226, 226, 0.95);
  border: 1px solid #feb2b2;
  border-radius: 16px;
  padding: 1.5rem;
  color: #c53030;
  text-align: center;
`;

const EndpointsSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
`;

const EndpointsTitle = styled.h2`
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const EndpointsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.5rem;
`;

const EndpointItem = styled.div`
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #4a5568;
  transition: all 0.2s ease;

  &:hover {
    background: #edf2f7;
    border-color: #cbd5e0;
  }
`;

// Interfaces
interface DashboardStats {
  patients: {
    total: number;
    this_month: number;
    last_month: number;
  };
  appointments: {
    total: number;
    today: number;
    this_month: number;
  };
  procedures: {
    total: number;
    this_month: number;
  };
  anamneses: {
    total: number;
    this_month: number;
  };
}

interface DashboardInfo {
  message: string;
  version: string;
  endpoints: Record<string, string>;
  status: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dashboardInfo, setDashboardInfo] = useState<DashboardInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar informações gerais do dashboard
        const dashboardResponse = await fetch('http://127.0.0.1:8000/api/dashboard/', {
          headers: { 'Accept': 'application/json' }
        });

        if (!dashboardResponse.ok) {
          throw new Error('Erro ao buscar dados do dashboard');
        }

        const dashboardData = await dashboardResponse.json();
        setDashboardInfo(dashboardData);

        // Buscar estatísticas detalhadas
        const overviewResponse = await fetch('http://127.0.0.1:8000/api/dashboard/overview', {
          headers: { 'Accept': 'application/json' }
        });

        if (!overviewResponse.ok) {
          throw new Error('Erro ao buscar estatísticas');
        }

        const overviewData = await overviewResponse.json();
        setStats(overviewData.overview);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const renderLoadingCard = () => (
    <LoadingCard />
  );

  const renderErrorCard = () => (
    <ErrorCard>
      <h3>❌ Erro</h3>
      <p>{error}</p>
    </ErrorCard>
  );

  // Sempre renderiza os cards, usando valores padrão se estiver carregando ou erro
  const safeStats = stats || {
    patients: { total: 0, this_month: 0, last_month: 0 },
    appointments: { total: 0, today: 0, this_month: 0 },
    procedures: { total: 0, this_month: 0 },
    anamneses: { total: 0, this_month: 0 }
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>🦷 Dashboard Odontológico</Title>
        <Subtitle>
          {loading ? 'Carregando dados...' : error ? 'Erro ao carregar dados' : `${dashboardInfo?.message || ''} - ${dashboardInfo?.version || ''}`}
        </Subtitle>
      </Header>
      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatIcon>👥</StatIcon>
            <StatTitle>Pacientes</StatTitle>
          </StatHeader>
          <StatValue>{formatNumber(safeStats.patients.total)}</StatValue>
          <StatSubtext>
            Este mês: {formatNumber(safeStats.patients.this_month)} | 
            Último mês: {formatNumber(safeStats.patients.last_month)}
          </StatSubtext>
        </StatCard>
        <StatCard>
          <StatHeader>
            <StatIcon>📅</StatIcon>
            <StatTitle>Agendamentos</StatTitle>
          </StatHeader>
          <StatValue>{formatNumber(safeStats.appointments.total)}</StatValue>
          <StatSubtext>
            Hoje: {formatNumber(safeStats.appointments.today)} | 
            Este mês: {formatNumber(safeStats.appointments.this_month)}
          </StatSubtext>
        </StatCard>
        <StatCard>
          <StatHeader>
            <StatIcon>🔧</StatIcon>
            <StatTitle>Procedimentos</StatTitle>
          </StatHeader>
          <StatValue>{formatNumber(safeStats.procedures.total)}</StatValue>
          <StatSubtext>
            Este mês: {formatNumber(safeStats.procedures.this_month)}
          </StatSubtext>
        </StatCard>
        <StatCard>
          <StatHeader>
            <StatIcon>📋</StatIcon>
            <StatTitle>Anamneses</StatTitle>
          </StatHeader>
          <StatValue>{formatNumber(safeStats.anamneses.total)}</StatValue>
          <StatSubtext>
            Este mês: {formatNumber(safeStats.anamneses.this_month)}
          </StatSubtext>
        </StatCard>
      </StatsGrid>
      {dashboardInfo?.endpoints && !loading && !error && (
        <EndpointsSection>
          <EndpointsTitle>📡 Endpoints Disponíveis</EndpointsTitle>
          <EndpointsList>
            {Object.entries(dashboardInfo.endpoints).map(([key, endpoint]) => (
              <EndpointItem key={key}>
                {endpoint}
              </EndpointItem>
            ))}
          </EndpointsList>
        </EndpointsSection>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;