import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { 
  FaCalendarAlt, 
  FaDownload, 
  FaPrint, 
  FaChartBar, 
  FaFilter,
  FaCalendarCheck,
  FaClock,
  FaUser,
  FaExclamationTriangle
} from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Interfaces
interface RelatorioData {
  periodo: string;
  agendamentos: number;
  confirmados: number;
  cancelados: number;
  concluidos: number;
}

interface DentistaPerformance {
  nome: string;
  agendamentos: number;
  taxa_conclusao: number;
  faturamento: number;
}

interface ProcedimentoData {
  nome: string;
  quantidade: number;
  valor: number;
  cor: string;
}

// Dados fake para teste
const dadosRelatorio: RelatorioData[] = [
  { periodo: '01/10', agendamentos: 45, confirmados: 38, cancelados: 5, concluidos: 35 },
  { periodo: '02/10', agendamentos: 52, confirmados: 46, cancelados: 4, concluidos: 42 },
  { periodo: '03/10', agendamentos: 48, confirmados: 41, cancelados: 6, concluidos: 38 },
  { periodo: '04/10', agendamentos: 55, confirmados: 49, cancelados: 3, concluidos: 46 },
  { periodo: '05/10', agendamentos: 41, confirmados: 36, cancelados: 7, concluidos: 32 },
  { periodo: '06/10', agendamentos: 39, confirmados: 35, cancelados: 4, concluidos: 33 },
  { periodo: '07/10', agendamentos: 58, confirmados: 52, cancelados: 4, concluidos: 48 },
  { periodo: '08/10', agendamentos: 46, confirmados: 40, cancelados: 5, concluidos: 37 },
  { periodo: '09/10', agendamentos: 51, confirmados: 45, cancelados: 6, concluidos: 41 },
  { periodo: '10/10', agendamentos: 49, confirmados: 43, cancelados: 4, concluidos: 40 },
  { periodo: '11/10', agendamentos: 53, confirmados: 47, cancelados: 5, concluidos: 44 },
  { periodo: '12/10', agendamentos: 47, confirmados: 42, cancelados: 3, concluidos: 39 },
  { periodo: '13/10', agendamentos: 44, confirmados: 38, cancelados: 6, concluidos: 35 },
  { periodo: '14/10', agendamentos: 56, confirmados: 50, cancelados: 4, concluidos: 47 },
  { periodo: '15/10', agendamentos: 42, confirmados: 37, cancelados: 5, concluidos: 34 }
];

const performanceDentistas: DentistaPerformance[] = [
  { nome: 'Dr. João Pereira', agendamentos: 156, taxa_conclusao: 89.7, faturamento: 28500 },
  { nome: 'Dra. Ana Costa', agendamentos: 142, taxa_conclusao: 92.3, faturamento: 31200 },
  { nome: 'Dra. Patrícia Lima', agendamentos: 138, taxa_conclusao: 87.4, faturamento: 26800 },
  { nome: 'Dr. Carlos Silva', agendamentos: 134, taxa_conclusao: 91.0, faturamento: 29700 },
  { nome: 'Dra. Mariana Santos', agendamentos: 129, taxa_conclusao: 88.4, faturamento: 25600 }
];

const procedimentosData: ProcedimentoData[] = [
  { nome: 'Limpeza', quantidade: 125, valor: 18750, cor: '#8884d8' },
  { nome: 'Restauração', quantidade: 98, valor: 24500, cor: '#82ca9d' },
  { nome: 'Canal', quantidade: 45, valor: 27000, cor: '#ffc658' },
  { nome: 'Extração', quantidade: 67, valor: 10050, cor: '#ff7300' },
  { nome: 'Ortodontia', quantidade: 34, valor: 20400, cor: '#00ff88' },
  { nome: 'Implante', quantidade: 23, valor: 34500, cor: '#ff0088' },
  { nome: 'Prótese', quantidade: 31, valor: 15500, cor: '#8800ff' },
  { nome: 'Clareamento', quantidade: 42, valor: 8400, cor: '#ff8800' }
];

// Estilos
const PageWrapper = styled.div`
  display: flex;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 20px;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
`;

const Title = styled.h2`
  font-size: 28px;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const StyledButton = styled.button<{ variant?: 'primary' | 'success' | 'info' | 'warning' }>`
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'success':
        return `
          background-color: #28a745;
          color: white;
          &:hover { background-color: #218838; }
        `;
      case 'info':
        return `
          background-color: #17a2b8;
          color: white;
          &:hover { background-color: #138496; }
        `;
      case 'warning':
        return `
          background-color: #ffc107;
          color: #212529;
          &:hover { background-color: #e0a800; }
        `;
      default:
        return `
          background-color: #007bff;
          color: white;
          &:hover { background-color: #0056b3; }
        `;
    }
  }}
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterInput = styled.input`
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  min-width: 150px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }
`;

const FilterLabel = styled.label`
  color: white;
  font-weight: 500;
  margin-right: 8px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div<{ color?: string }>`
  padding: 25px;
  background: ${({ color = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }) => color};
  border-radius: 12px;
  color: white;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const StatIcon = styled.div`
  font-size: 24px;
  opacity: 0.8;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TablesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const TableCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px 8px;
    text-align: left;
    border-bottom: 1px solid #e9ecef;
  }

  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #495057;
  }

  tr:hover {
    background-color: #f8f9fa;
  }
`;

const PerformanceBar = styled.div<{ percentage: number }>`
  width: 100%;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    width: ${({ percentage }) => percentage}%;
    height: 100%;
    background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
    transition: width 0.3s ease;
  }
`;

export default function RelatorioAgendamentos() {
  const [filtros, setFiltros] = useState({
    dataInicio: '2025-10-01',
    dataFim: '2025-10-15',
    dentista: '',
    status: ''
  });

  // Calcular estatísticas gerais
  const totalAgendamentos = dadosRelatorio.reduce((acc, curr) => acc + curr.agendamentos, 0);
  const totalConfirmados = dadosRelatorio.reduce((acc, curr) => acc + curr.confirmados, 0);
  const totalCancelados = dadosRelatorio.reduce((acc, curr) => acc + curr.cancelados, 0);
  const totalConcluidos = dadosRelatorio.reduce((acc, curr) => acc + curr.concluidos, 0);
  const taxaConclusao = ((totalConcluidos / totalAgendamentos) * 100).toFixed(1);
  const taxaCancelamento = ((totalCancelados / totalAgendamentos) * 100).toFixed(1);

  return (
    <PageWrapper>
      <MainContent>
        <Header>
          <Title>
            <FaChartBar />
            Relatório de Agendamentos
          </Title>
          <Actions>
            <StyledButton variant="success">
              <FaDownload />
              Exportar Excel
            </StyledButton>
            <StyledButton variant="info">
              <FaPrint />
              Imprimir
            </StyledButton>
          </Actions>
        </Header>

        <FilterContainer>
          <div>
            <FilterLabel>Data Início:</FilterLabel>
            <FilterInput
              type="date"
              value={filtros.dataInicio}
              onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
            />
          </div>
          <div>
            <FilterLabel>Data Fim:</FilterLabel>
            <FilterInput
              type="date"
              value={filtros.dataFim}
              onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
            />
          </div>
          <div>
            <FilterLabel>Dentista:</FilterLabel>
            <FilterInput
              type="text"
              placeholder="Todos os dentistas"
              value={filtros.dentista}
              onChange={(e) => setFiltros({...filtros, dentista: e.target.value})}
            />
          </div>
          <StyledButton variant="warning">
            <FaFilter />
            Aplicar Filtros
          </StyledButton>
        </FilterContainer>

        <StatsGrid>
          <StatCard color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <StatHeader>
              <div>
                <StatValue>{totalAgendamentos}</StatValue>
                <StatLabel>Total de Agendamentos</StatLabel>
              </div>
              <StatIcon><FaCalendarCheck /></StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color="linear-gradient(135deg, #28a745 0%, #20c997 100%)">
            <StatHeader>
              <div>
                <StatValue>{totalConcluidos}</StatValue>
                <StatLabel>Consultas Concluídas</StatLabel>
              </div>
              <StatIcon><FaUser /></StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color="linear-gradient(135deg, #17a2b8 0%, #138496 100%)">
            <StatHeader>
              <div>
                <StatValue>{taxaConclusao}%</StatValue>
                <StatLabel>Taxa de Conclusão</StatLabel>
              </div>
              <StatIcon><FaClock /></StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color="linear-gradient(135deg, #dc3545 0%, #c82333 100%)">
            <StatHeader>
              <div>
                <StatValue>{taxaCancelamento}%</StatValue>
                <StatLabel>Taxa de Cancelamento</StatLabel>
              </div>
              <StatIcon><FaExclamationTriangle /></StatIcon>
            </StatHeader>
          </StatCard>
        </StatsGrid>

        <ChartsContainer>
          <ChartCard>
            <ChartTitle>
              <FaChartBar />
              Evolução dos Agendamentos (Últimos 15 dias)
            </ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosRelatorio}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="agendamentos" stroke="#8884d8" strokeWidth={2} name="Agendamentos" />
                <Line type="monotone" dataKey="confirmados" stroke="#82ca9d" strokeWidth={2} name="Confirmados" />
                <Line type="monotone" dataKey="concluidos" stroke="#ffc658" strokeWidth={2} name="Concluídos" />
                <Line type="monotone" dataKey="cancelados" stroke="#ff7300" strokeWidth={2} name="Cancelados" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>
              <FaCalendarAlt />
              Distribuição por Status
            </ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Concluídos', value: totalConcluidos, fill: '#28a745' },
                    { name: 'Confirmados', value: totalConfirmados - totalConcluidos, fill: '#007bff' },
                    { name: 'Cancelados', value: totalCancelados, fill: '#dc3545' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </ChartsContainer>

        <TablesContainer>
          <TableCard>
            <ChartTitle>
              <FaUser />
              Performance dos Dentistas
            </ChartTitle>
            <Table>
              <thead>
                <tr>
                  <th>Dentista</th>
                  <th>Agendamentos</th>
                  <th>Taxa Conclusão</th>
                  <th>Faturamento</th>
                </tr>
              </thead>
              <tbody>
                {performanceDentistas.map((dentista, index) => (
                  <tr key={index}>
                    <td>{dentista.nome}</td>
                    <td>{dentista.agendamentos}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{dentista.taxa_conclusao}%</span>
                        <PerformanceBar percentage={dentista.taxa_conclusao} />
                      </div>
                    </td>
                    <td>R$ {dentista.faturamento.toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableCard>

          <TableCard>
            <ChartTitle>
              <FaChartBar />
              Procedimentos Mais Agendados
            </ChartTitle>
            <Table>
              <thead>
                <tr>
                  <th>Procedimento</th>
                  <th>Quantidade</th>
                  <th>Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {procedimentosData.slice(0, 6).map((procedimento, index) => (
                  <tr key={index}>
                    <td>{procedimento.nome}</td>
                    <td>{procedimento.quantidade}</td>
                    <td>R$ {procedimento.valor.toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableCard>
        </TablesContainer>
      </MainContent>
    </PageWrapper>
  );
}