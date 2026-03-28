import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useModuleCounters } from '../../hooks/useModuleCounters';

// Styled Components
const Container = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: white;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 20px;
`;

const LastUpdate = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const StatusIndicator = styled.div<{ status: 'loading' | 'success' | 'error' }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => 
    props.status === 'loading' ? '#ffd89b' :
    props.status === 'success' ? '#84fab0' : '#ff7675'
  };
  animation: ${props => props.status === 'loading' ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const TableContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background: rgba(255, 255, 255, 0.2);
  padding: 15px 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.95rem;
`;

const TableRow = styled.tr<{ isActive?: boolean }>`
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.01);
  }
  
  ${props => props.isActive && `
    background: rgba(84, 250, 176, 0.1);
  `}
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  vertical-align: middle;
`;

const ModuleIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 10px;
`;

const ModuleName = styled.span`
  font-weight: 500;
`;

const StatusBadge = styled.span<{ status: 'active' | 'inactive' }>`
  background: ${props => props.status === 'active' ? '#00b894' : '#636e72'};
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const CountBadge = styled.span<{ count: number }>`
  background: ${props => props.count > 0 ? '#00b894' : '#636e72'};
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
  display: inline-block;
  animation: ${props => props.count > 0 ? 'glow 2s ease-in-out infinite alternate' : 'none'};
  
  @keyframes glow {
    from { box-shadow: 0 0 5px rgba(0, 184, 148, 0.5); }
    to { box-shadow: 0 0 20px rgba(0, 184, 148, 0.8), 0 0 30px rgba(0, 184, 148, 0.4); }
  }
`;

const Code = styled.code`
  background: rgba(0, 0, 0, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.85rem;
`;

const Endpoint = styled.a`
  color: #74b9ff;
  text-decoration: none;
  font-size: 0.9rem;
  
  &:hover {
    color: #0984e3;
    text-decoration: underline;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #74b9ff;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 5px;
`;

// Interface para os módulos
interface ModuleData {
  id: string;
  name: string;
  icon: string;
  status: 'active' | 'inactive';
  count: number;
  model: string;
  controller: string;
  endpoint: string;
  frontend: string;
}

// Dados dos módulos conforme a tabela
const modulesTemplate: ModuleData[] = [
  { id: 'pacientes', name: 'Pacientes', icon: '👥', status: 'active', count: 0, model: 'Paciente', controller: 'PacienteController', endpoint: '/api/pessoas/pacientes', frontend: 'clientes/' },
  { id: 'agendamentos', name: 'Agendamentos', icon: '📅', status: 'active', count: 0, model: 'Scheduling', controller: 'SchedulingController', endpoint: '/api/schedulings', frontend: 'agendamentos/' },
  { id: 'procedimentos', name: 'Procedimentos', icon: '🔧', status: 'active', count: 0, model: 'Procedure', controller: 'ProcedureController', endpoint: '/api/procedures', frontend: 'cadastros/Procedimentos/' },
  { id: 'funcionarios', name: 'Funcionários', icon: '👨‍⚕️', status: 'active', count: 0, model: 'Employee', controller: 'EmployeeController', endpoint: '/api/employees', frontend: 'funcionarios/' },
  { id: 'anamneses', name: 'Anamneses', icon: '📝', status: 'active', count: 0, model: 'Anamnese', controller: 'AnamneseController', endpoint: '/api/anamneses', frontend: 'cadastros/ItensAnamnese/' },
  { id: 'convenios', name: 'Convênios', icon: '🤝', status: 'active', count: 0, model: 'Agreement', controller: 'AgreementController', endpoint: '/api/agreements', frontend: 'cadastros/Convenios/' },
  { id: 'formas_pagamento', name: 'Formas Pagamento', icon: '💳', status: 'active', count: 0, model: 'FormaPagamento', controller: 'FormaPagamentoController', endpoint: '/api/formas-pagamentos', frontend: 'cadastros/FormasPagamento/' },
  { id: 'grupos_anamnese', name: 'Grupos Anamnese', icon: '📋', status: 'active', count: 0, model: 'GroupAnamnese', controller: 'GroupAnamneseController', endpoint: '/api/groups-anamnese', frontend: 'cadastros/GruposAnamnese/' },
  { id: 'odontogramas', name: 'Odontogramas', icon: '🦷', status: 'active', count: 0, model: 'Odontograma', controller: 'OdontogramaController', endpoint: '/api/odontograma', frontend: 'Odontogramas/' },
  { id: 'usuarios', name: 'Usuários', icon: '👤', status: 'active', count: 0, model: 'User', controller: 'UserController', endpoint: '/api/users', frontend: 'Usuarios/' },
  { id: 'planos_tratamento', name: 'Planos Tratamento', icon: '📊', status: 'active', count: 0, model: 'TreatmentPlan', controller: 'TreatmentPlanController', endpoint: '/api/treatment-plans', frontend: 'Tratamentos/' },
  { id: 'procedimentos_pacientes', name: 'Proc. Pacientes', icon: '⚕️', status: 'active', count: 0, model: 'patient_procedures', controller: '-', endpoint: '/api/patient-procedures', frontend: '-' },
  { id: 'sessoes_ativas', name: 'Sessões Ativas', icon: '🔒', status: 'active', count: 0, model: 'sessions', controller: '-', endpoint: '/api/sessions', frontend: 'Sistema' },
  { id: 'tokens_acesso', name: 'Tokens Acesso', icon: '🔑', status: 'active', count: 0, model: 'personal_access_tokens', controller: '-', endpoint: '/api/access-tokens', frontend: 'Sistema' },
  { id: 'jobs_pendentes', name: 'Jobs Pendentes', icon: '⏳', status: 'active', count: 0, model: 'jobs', controller: '-', endpoint: '/api/jobs', frontend: 'Sistema' },
  { id: 'jobs_falhados', name: 'Jobs Falhados', icon: '❌', status: 'active', count: 0, model: 'failed_jobs', controller: '-', endpoint: '/api/failed-jobs', frontend: 'Sistema' }
];

const ModulesTablePage: React.FC = () => {
  const { counters, loading, error, lastUpdated } = useModuleCounters(30000);
  const [modules, setModules] = useState<ModuleData[]>(modulesTemplate);

  // Atualizar contagens dos módulos
  useEffect(() => {
    if (counters) {
      const updatedModules = modulesTemplate.map(module => ({
        ...module,
        count: counters[module.id]?.total || 0
      }));
      setModules(updatedModules);
    }
  }, [counters]);

  const getStatus = () => {
    if (loading) return 'loading';
    if (error) return 'error';
    return 'success';
  };

  const totalModules = modules.length;
  const activeModules = modules.filter(m => m.count > 0).length;
  const totalRecords = modules.reduce((sum, m) => sum + m.count, 0);

  return (
    <Container>
      <Header>
        <Title>📋 MÓDULOS DO SISTEMA - TEMPO REAL</Title>
        <Subtitle>Sistema Odontológico - Referência Completa</Subtitle>
        <LastUpdate>
          <StatusIndicator status={getStatus()} />
          {loading && 'Carregando...'}
          {error && `Erro: ${error}`}
          {!loading && !error && lastUpdated && `Última atualização: ${new Date(lastUpdated).toLocaleTimeString()}`}
        </LastUpdate>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatNumber>{totalModules}</StatNumber>
          <StatLabel>Total de Módulos</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{activeModules}</StatNumber>
          <StatLabel>Módulos com Dados</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{totalRecords}</StatNumber>
          <StatLabel>Total de Registros</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{loading ? '⏳' : '✅'}</StatNumber>
          <StatLabel>Status do Sistema</StatLabel>
        </StatCard>
      </StatsGrid>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>#</TableHeader>
              <TableHeader>Módulo</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Contagem</TableHeader>
              <TableHeader>Backend Model</TableHeader>
              <TableHeader>Controller</TableHeader>
              <TableHeader>Endpoint</TableHeader>
              <TableHeader>Frontend</TableHeader>
            </tr>
          </thead>
          <tbody>
            {modules.map((module, index) => (
              <TableRow key={module.id} isActive={module.count > 0}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <ModuleIcon>{module.icon}</ModuleIcon>
                  <ModuleName>{module.name}</ModuleName>
                </TableCell>
                <TableCell>
                  <StatusBadge status={module.status}>✅</StatusBadge>
                </TableCell>
                <TableCell>
                  <CountBadge count={module.count}>{module.count}</CountBadge>
                </TableCell>
                <TableCell>
                  <Code>{module.model}</Code>
                </TableCell>
                <TableCell>
                  <Code>{module.controller}</Code>
                </TableCell>
                <TableCell>
                  <Endpoint href={`http://127.0.0.1:8000${module.endpoint}`} target="_blank">
                    {module.endpoint}
                  </Endpoint>
                </TableCell>
                <TableCell>
                  <Code>{module.frontend}</Code>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      {/* Páginas Frontend Adicionais */}
      <TableContainer>
        <h3 style={{ padding: '20px', margin: 0 }}>🎨 PÁGINAS FRONTEND ADICIONAIS</h3>
        <Table>
          <thead>
            <tr>
              <TableHeader>Módulo</TableHeader>
              <TableHeader>Caminho</TableHeader>
              <TableHeader>Status</TableHeader>
            </tr>
          </thead>
          <tbody>
            {[
              { name: '🏠 Dashboard', path: 'Dashboard/', status: '✅' },
              { name: '🏢 Fornecedores', path: 'cadastros/Fornecedores/', status: '✅' },
              { name: '💰 Contas Pagar', path: 'Financeiro/ContasPagar/', status: '✅' },
              { name: '💳 Contas Receber', path: 'Financeiro/ContasReceber/', status: '✅' },
              { name: '💵 Caixa', path: 'Caixa/', status: '✅' },
              { name: '🩺 Consultas', path: 'Clinico/', status: '✅' },
              { name: '🕐 Horários', path: 'horarios/', status: '✅' },
              { name: '💼 Minhas Comissões', path: 'MinhasComissoes/', status: '✅' },
              { name: '📋 Tarefas/Agenda', path: 'Tarefas/', status: '✅' },
              { name: '📝 Anotações', path: 'Anotacoes/', status: '✅' },
              { name: '💰 Orçamentos', path: 'Orcamentos/', status: '✅' },
              { name: '📊 Relatórios', path: 'Relatorios/', status: '✅' },
              { name: '👔 Cargos', path: 'cadastros/Cargos/', status: '✅' },
              { name: '🔑 Acessos', path: 'cadastros/Acessos/', status: '✅' },
              { name: '👥 Grupo Acessos', path: 'cadastros/GrupoAcessos/', status: '✅' },
              { name: '🔄 Frequências', path: 'cadastros/Frequencias/', status: '✅' }
            ].map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell><Code>{item.path}</Code></TableCell>
                <TableCell><StatusBadge status="active">{item.status}</StatusBadge></TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ModulesTablePage;