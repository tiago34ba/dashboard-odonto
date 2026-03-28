import React from 'react';
import styled, { keyframes } from 'styled-components';
import ModuleCard from '../../components/ModuleCard/ModuleCard';

interface ModuleCounter {
  total: number;
  endpoint: string;
  loading?: boolean;
  error?: string;
}

interface ModuleCounters {
  [moduleName: string]: ModuleCounter;
}

// Hook simplificado inline
const useModuleCounters = (refreshInterval?: number) => {
  const [counters, setCounters] = React.useState<ModuleCounters>({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);

  React.useEffect(() => {
    const fetchCounters = async () => {
      try {
        setLoading(true);
        
        // Simulando dados dos módulos com contadores
        const moduleData: ModuleCounters = {
          'Pacientes': { total: 1250, endpoint: '/pessoas/pacientes/PatientsPage' },
          'Usuários': { total: 25, endpoint: '/pessoas/usuarios' },
          'Funcionários': { total: 15, endpoint: '/pessoas/funcionarios' },
          'Agendamentos': { total: 450, endpoint: '/agendamentos' },
          'Procedimentos': { total: 180, endpoint: '/cadastros/procedimentos' },
          'Convênios': { total: 8, endpoint: '/cadastros/convenios' },
          'Contas a Pagar': { total: 75, endpoint: '/financeiro/contas-pagar' },
          'Contas a Receber': { total: 125, endpoint: '/financeiro/contas-receber' },
          'Fornecedores': { total: 35, endpoint: '/cadastros/fornecedores' },
          'Comissões': { total: 45, endpoint: '/financeiro/comissoes' },
          'Tratamentos': { total: 234, endpoint: '/tratamentos' },
          'Orçamentos': { total: 92, endpoint: '/orcamentos' }
        };

        await new Promise(resolve => setTimeout(resolve, 300));
        setCounters(moduleData);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        setError('Erro ao carregar contadores dos módulos');
      } finally {
        setLoading(false);
      }
    };

    fetchCounters();
    
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchCounters, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  return { 
    counters, 
    loading, 
    error, 
    lastUpdated, 
    refreshCounters: () => {} 
  };
};

// Animações
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled Components
const DashboardContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const Subtitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 1.1rem;
  color: rgba(255,255,255,0.9);
`;

const StatusBadge = styled.span<{ status: 'online' | 'error' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: ${props => props.status === 'online' ? '#10b981' : '#ef4444'};
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
`;

const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: white;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(255,255,255,0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto 2rem auto;
`;

const ErrorContainer = styled.div`
  background: rgba(239, 68, 68, 0.2);
  border: 2px solid rgba(239, 68, 68, 0.5);
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 600px;
  color: white;
  text-align: center;
`;

const RefreshButton = styled.button`
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.5);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background: rgba(255,255,255,0.3);
    border-color: rgba(255,255,255,0.7);
  }
`;

const StatsContainer = styled.div`
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 1rem;
  margin: 2rem auto;
  max-width: 600px;
  text-align: center;
  color: white;
`;

const RealTimeModuleDashboard: React.FC = () => {
  const { counters, loading, error, lastUpdated, refreshCounters } = useModuleCounters(30000); // Atualiza a cada 30 segundos

  const handleModuleClick = (moduleName: string, endpoint: string) => {
    console.log(`Navegando para ${moduleName}:`, endpoint);
    // Aqui você pode implementar navegação usando React Router
    // navigate(endpoint);
  };

  const formatLastUpdated = (timestamp: Date | null) => {
    if (!timestamp) return 'Nunca';
    return timestamp.toLocaleString('pt-BR');
  };

  const getTotalRecords = (): number => {
    if (!counters) return 0;
    return Object.values(counters).reduce((total: number, counter: ModuleCounter) => {
      return total + counter.total;
    }, 0);
  };

  if (loading) {
    return (
      <DashboardContainer>
        <Header>
          <Title>🦷 Dashboard Odontológico</Title>
          <Subtitle>Carregando módulos em tempo real...</Subtitle>
        </Header>
        <LoadingContainer>
          <LoadingSpinner />
          <p>Conectando com o servidor...</p>
        </LoadingContainer>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <Header>
          <Title>🦷 Dashboard Odontológico</Title>
          <Subtitle>
            <StatusBadge status="error">
              ❌ Offline
            </StatusBadge>
          </Subtitle>
        </Header>
        <ErrorContainer>
          <h3>Erro de Conexão</h3>
          <p>{error}</p>
          <RefreshButton onClick={refreshCounters}>
            🔄 Tentar Novamente
          </RefreshButton>
          <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
            <p>Verificações:</p>
            <p>✅ Backend: <a href="http://127.0.0.1:8000/api/dashboard/module-counters" target="_blank" style={{color: '#fbbf24'}}>Testar API</a></p>
          </div>
        </ErrorContainer>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>🦷 Dashboard Odontológico</Title>
        <Subtitle>
          <StatusBadge status="online">
            🟢 Online
          </StatusBadge>
          <span>Atualização em Tempo Real</span>
        </Subtitle>
      </Header>

      <StatsContainer>
        <h3 style={{ margin: '0 0 1rem 0' }}>📊 Estatísticas Gerais</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{String(getTotalRecords()).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Total de Registros</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{counters ? Object.keys(counters).length : 0}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Módulos Ativos</div>
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{formatLastUpdated(lastUpdated)}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Última Atualização</div>
          </div>
        </div>
      </StatsContainer>

      <ModulesGrid>
        {counters && Object.entries(counters).map(([moduleName, counter]: [string, ModuleCounter]) => (
          <ModuleCard
            key={moduleName}
            title={moduleName}
            value={counter.total}
            loading={counter.loading}
            error={counter.error}
            onClick={() => handleModuleClick(moduleName, counter.endpoint)}
          />
        ))}
      </ModulesGrid>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <RefreshButton onClick={refreshCounters}>
          🔄 Atualizar Agora
        </RefreshButton>
      </div>
    </DashboardContainer>
  );
};

export default RealTimeModuleDashboard;