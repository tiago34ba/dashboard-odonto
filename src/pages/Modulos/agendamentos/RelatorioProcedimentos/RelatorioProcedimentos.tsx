import React, { useState, useEffect } from "react";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import styled from "styled-components";
import { 
  FaToolbox, 
  FaDownload, 
  FaPrint, 
  FaChartPie, 
  FaFilter,
  FaDollarSign,
  FaClock,
  FaUserMd,
  FaChartLine,
  FaCalendarDay
} from "react-icons/fa";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

// Interfaces
interface ProcedimentoCompleto {
  id: number;
  nome: string;
  categoria: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  tempo_medio: number; // em minutos
  dentista_mais_usado: string;
  ultima_realizacao: string;
  tendencia: 'crescendo' | 'estavel' | 'diminuindo';
}

interface CategoriaData {
  categoria: string;
  quantidade: number;
  valor: number;
  cor: string;
}

interface TendenciaData {
  mes: string;
  preventivos: number;
  restauradores: number;
  cirurgicos: number;
  ortodonticos: number;
  protéticos: number;
}

interface DentistaEspecialidade {
  dentista: string;
  especialidade: string;
  total_procedimentos: number;
  valor_gerado: number;
  procedimento_favorito: string;
  eficiencia: number; // procedimentos por hora
}

// Dados fake para teste
const procedimentosCompletos: ProcedimentoCompleto[] = [
  {
    id: 1,
    nome: "Limpeza e Profilaxia",
    categoria: "Preventivo",
    quantidade: 125,
    valor_unitario: 150,
    valor_total: 18750,
    tempo_medio: 45,
    dentista_mais_usado: "Dra. Ana Costa",
    ultima_realizacao: "2025-10-16",
    tendencia: "crescendo"
  },
  {
    id: 2,
    nome: "Restauração em Resina",
    categoria: "Restaurador",
    quantidade: 98,
    valor_unitario: 250,
    valor_total: 24500,
    tempo_medio: 60,
    dentista_mais_usado: "Dr. João Pereira",
    ultima_realizacao: "2025-10-16",
    tendencia: "estavel"
  },
  {
    id: 3,
    nome: "Tratamento de Canal",
    categoria: "Endodontia",
    quantidade: 45,
    valor_unitario: 600,
    valor_total: 27000,
    tempo_medio: 90,
    dentista_mais_usado: "Dr. Carlos Silva",
    ultima_realizacao: "2025-10-15",
    tendencia: "crescendo"
  },
  {
    id: 4,
    nome: "Extração Simples",
    categoria: "Cirúrgico",
    quantidade: 67,
    valor_unitario: 150,
    valor_total: 10050,
    tempo_medio: 30,
    dentista_mais_usado: "Dra. Patrícia Lima",
    ultima_realizacao: "2025-10-16",
    tendencia: "diminuindo"
  },
  {
    id: 5,
    nome: "Consulta Ortodôntica",
    categoria: "Ortodontia",
    quantidade: 34,
    valor_unitario: 600,
    valor_total: 20400,
    tempo_medio: 45,
    dentista_mais_usado: "Dr. João Pereira",
    ultima_realizacao: "2025-10-14",
    tendencia: "crescendo"
  },
  {
    id: 6,
    nome: "Implante Dentário",
    categoria: "Cirúrgico",
    quantidade: 23,
    valor_unitario: 1500,
    valor_total: 34500,
    tempo_medio: 120,
    dentista_mais_usado: "Dr. Carlos Silva",
    ultima_realizacao: "2025-10-13",
    tendencia: "crescendo"
  },
  {
    id: 7,
    nome: "Prótese Fixa",
    categoria: "Protético",
    quantidade: 31,
    valor_unitario: 500,
    valor_total: 15500,
    tempo_medio: 75,
    dentista_mais_usado: "Dra. Mariana Santos",
    ultima_realizacao: "2025-10-15",
    tendencia: "estavel"
  },
  {
    id: 8,
    nome: "Clareamento Dental",
    categoria: "Estético",
    quantidade: 42,
    valor_unitario: 200,
    valor_total: 8400,
    tempo_medio: 60,
    dentista_mais_usado: "Dra. Ana Costa",
    ultima_realizacao: "2025-10-16",
    tendencia: "crescendo"
  },
  {
    id: 9,
    nome: "Cirurgia de Siso",
    categoria: "Cirúrgico",
    quantidade: 28,
    valor_unitario: 400,
    valor_total: 11200,
    tempo_medio: 45,
    dentista_mais_usado: "Dr. Carlos Silva",
    ultima_realizacao: "2025-10-12",
    tendencia: "estavel"
  },
  {
    id: 10,
    nome: "Aplicação de Flúor",
    categoria: "Preventivo",
    quantidade: 89,
    valor_unitario: 50,
    valor_total: 4450,
    tempo_medio: 15,
    dentista_mais_usado: "Dra. Ana Costa",
    ultima_realizacao: "2025-10-16",
    tendencia: "crescendo"
  }
];

const categoriaData: CategoriaData[] = [
  { categoria: "Preventivo", quantidade: 214, valor: 23200, cor: "#28a745" },
  { categoria: "Restaurador", quantidade: 98, valor: 24500, cor: "#007bff" },
  { categoria: "Cirúrgico", quantidade: 118, valor: 55750, cor: "#dc3545" },
  { categoria: "Ortodontia", quantidade: 34, valor: 20400, cor: "#ffc107" },
  { categoria: "Protético", quantidade: 31, valor: 15500, cor: "#6f42c1" },
  { categoria: "Endodontia", quantidade: 45, valor: 27000, cor: "#fd7e14" },
  { categoria: "Estético", quantidade: 42, valor: 8400, cor: "#20c997" }
];

const tendenciaData: TendenciaData[] = [
  { mes: "Jun/25", preventivos: 45, restauradores: 32, cirurgicos: 28, ortodonticos: 15, protéticos: 12 },
  { mes: "Jul/25", preventivos: 52, restauradores: 38, cirurgicos: 31, ortodonticos: 18, protéticos: 14 },
  { mes: "Ago/25", preventivos: 48, restauradores: 35, cirurgicos: 29, ortodonticos: 22, protéticos: 16 },
  { mes: "Set/25", preventivos: 58, restauradores: 42, cirurgicos: 35, ortodonticos: 25, protéticos: 18 },
  { mes: "Out/25", preventivos: 65, restauradores: 45, cirurgicos: 38, ortodonticos: 28, protéticos: 21 }
];

const dentistaEspecialidades: DentistaEspecialidade[] = [
  {
    dentista: "Dr. João Pereira",
    especialidade: "Clínico Geral",
    total_procedimentos: 156,
    valor_gerado: 42800,
    procedimento_favorito: "Restauração",
    eficiencia: 3.2
  },
  {
    dentista: "Dra. Ana Costa",
    especialidade: "Periodontia",
    total_procedimentos: 142,
    valor_gerado: 38600,
    procedimento_favorito: "Limpeza",
    eficiencia: 4.1
  },
  {
    dentista: "Dr. Carlos Silva",
    especialidade: "Cirurgia",
    total_procedimentos: 96,
    valor_gerado: 72700,
    procedimento_favorito: "Implante",
    eficiencia: 2.8
  },
  {
    dentista: "Dra. Patrícia Lima",
    especialidade: "Endodontia",
    total_procedimentos: 78,
    valor_gerado: 35400,
    procedimento_favorito: "Canal",
    eficiencia: 2.5
  },
  {
    dentista: "Dra. Mariana Santos",
    especialidade: "Prótese",
    total_procedimentos: 89,
    valor_gerado: 48200,
    procedimento_favorito: "Prótese Fixa",
    eficiencia: 2.9
  }
];

// Estilos (mesmos da tela anterior, mas personalizados)
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
        return `background-color: #28a745; color: white; &:hover { background-color: #218838; }`;
      case 'info':
        return `background-color: #17a2b8; color: white; &:hover { background-color: #138496; }`;
      case 'warning':
        return `background-color: #ffc107; color: #212529; &:hover { background-color: #e0a800; }`;
      default:
        return `background-color: #007bff; color: white; &:hover { background-color: #0056b3; }`;
    }
  }}
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
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
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.25);
  }
`;

const FilterSelect = styled.select`
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  min-width: 150px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.25);
  }
`;

const FilterLabel = styled.label`
  color: white;
  font-weight: 500;
  margin-right: 8px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

const StatSubtext = styled.div`
  font-size: 12px;
  opacity: 0.7;
  margin-top: 5px;
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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

const TableContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
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
    font-size: 14px;
  }

  td {
    font-size: 14px;
  }

  tr:hover {
    background-color: #f8f9fa;
  }
`;

const TrendIcon = styled.span<{ trend: string }>`
  color: ${({ trend }) => {
    switch (trend) {
      case 'crescendo': return '#28a745';
      case 'diminuindo': return '#dc3545';
      default: return '#6c757d';
    }
  }};
  margin-left: 8px;
`;

const EficienciaBar = styled.div<{ percentage: number }>`
  width: 100%;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    width: ${({ percentage }) => (percentage / 5) * 100}%;
    height: 100%;
    background: linear-gradient(90deg, #007bff 0%, #0056b3 100%);
    transition: width 0.3s ease;
  }
`;

export default function RelatorioProcedimentos() {
  const [filtros, setFiltros] = useState({
    dataInicio: '2025-10-01',
    dataFim: '2025-10-16',
    categoria: '',
    dentista: '',
    ordenacao: 'quantidade'
  });

  // Calcular estatísticas
  const totalProcedimentos = procedimentosCompletos.reduce((acc, proc) => acc + proc.quantidade, 0);
  const faturamentoTotal = procedimentosCompletos.reduce((acc, proc) => acc + proc.valor_total, 0);
  const tempoMedio = procedimentosCompletos.reduce((acc, proc) => acc + proc.tempo_medio, 0) / procedimentosCompletos.length;
  const procedimentoMaisRealizado = procedimentosCompletos.sort((a, b) => b.quantidade - a.quantidade)[0];

  return (
    <PageWrapper>
      <Sidebar />
      <MainContent>
        <Header>
          <Title>
            <FaToolbox />
            Relatório de Procedimentos
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
            <FilterLabel>Categoria:</FilterLabel>
            <FilterSelect
              value={filtros.categoria}
              onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
            >
              <option value="">Todas as Categorias</option>
              <option value="Preventivo">Preventivo</option>
              <option value="Restaurador">Restaurador</option>
              <option value="Cirúrgico">Cirúrgico</option>
              <option value="Ortodontia">Ortodontia</option>
              <option value="Protético">Protético</option>
              <option value="Endodontia">Endodontia</option>
              <option value="Estético">Estético</option>
            </FilterSelect>
          </div>
          <div>
            <FilterLabel>Ordenar por:</FilterLabel>
            <FilterSelect
              value={filtros.ordenacao}
              onChange={(e) => setFiltros({...filtros, ordenacao: e.target.value})}
            >
              <option value="quantidade">Quantidade</option>
              <option value="valor">Valor</option>
              <option value="nome">Nome</option>
            </FilterSelect>
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
                <StatValue>{totalProcedimentos}</StatValue>
                <StatLabel>Total de Procedimentos</StatLabel>
                <StatSubtext>Últimos 30 dias</StatSubtext>
              </div>
              <StatIcon><FaToolbox /></StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color="linear-gradient(135deg, #28a745 0%, #20c997 100%)">
            <StatHeader>
              <div>
                <StatValue>R$ {faturamentoTotal.toLocaleString('pt-BR')}</StatValue>
                <StatLabel>Faturamento Total</StatLabel>
                <StatSubtext>+12% vs mês anterior</StatSubtext>
              </div>
              <StatIcon><FaDollarSign /></StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color="linear-gradient(135deg, #17a2b8 0%, #138496 100%)">
            <StatHeader>
              <div>
                <StatValue>{Math.round(tempoMedio)} min</StatValue>
                <StatLabel>Tempo Médio</StatLabel>
                <StatSubtext>Por procedimento</StatSubtext>
              </div>
              <StatIcon><FaClock /></StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color="linear-gradient(135deg, #ffc107 0%, #f39c12 100%)">
            <StatHeader>
              <div>
                <StatValue>{procedimentoMaisRealizado.quantidade}</StatValue>
                <StatLabel>Mais Realizado</StatLabel>
                <StatSubtext>{procedimentoMaisRealizado.nome}</StatSubtext>
              </div>
              <StatIcon><FaChartLine /></StatIcon>
            </StatHeader>
          </StatCard>
        </StatsGrid>

        <ChartsContainer>
          <ChartCard>
            <ChartTitle>
              <FaChartPie />
              Distribuição por Categoria
            </ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoriaData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="quantidade"
                  label={({categoria, percent}) => {
                    const percentage = percent ? (percent * 100).toFixed(1) : '0.0';
                    return `${categoria || 'N/A'} (${percentage}%)`;
                  }}
                >
                  {categoriaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, 'Quantidade']} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>
              <FaChartLine />
              Tendência dos Procedimentos (5 meses)
            </ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={tendenciaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="preventivos" stackId="1" stroke="#28a745" fill="#28a745" fillOpacity={0.6} />
                <Area type="monotone" dataKey="restauradores" stackId="1" stroke="#007bff" fill="#007bff" fillOpacity={0.6} />
                <Area type="monotone" dataKey="cirurgicos" stackId="1" stroke="#dc3545" fill="#dc3545" fillOpacity={0.6} />
                <Area type="monotone" dataKey="ortodonticos" stackId="1" stroke="#ffc107" fill="#ffc107" fillOpacity={0.6} />
                <Area type="monotone" dataKey="protéticos" stackId="1" stroke="#6f42c1" fill="#6f42c1" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </ChartsContainer>

        <TableContainer>
          <TableCard>
            <ChartTitle>
              <FaToolbox />
              Detalhamento dos Procedimentos
            </ChartTitle>
            <Table>
              <thead>
                <tr>
                  <th>Procedimento</th>
                  <th>Categoria</th>
                  <th>Quantidade</th>
                  <th>Valor Unit.</th>
                  <th>Total</th>
                  <th>Tempo Médio</th>
                  <th>Dentista Principal</th>
                  <th>Tendência</th>
                </tr>
              </thead>
              <tbody>
                {procedimentosCompletos
                  .sort((a, b) => b.quantidade - a.quantidade)
                  .map((procedimento) => (
                  <tr key={procedimento.id}>
                    <td><strong>{procedimento.nome}</strong></td>
                    <td>{procedimento.categoria}</td>
                    <td>{procedimento.quantidade}</td>
                    <td>R$ {procedimento.valor_unitario.toLocaleString('pt-BR')}</td>
                    <td><strong>R$ {procedimento.valor_total.toLocaleString('pt-BR')}</strong></td>
                    <td>{procedimento.tempo_medio} min</td>
                    <td>{procedimento.dentista_mais_usado}</td>
                    <td>
                      {procedimento.tendencia === 'crescendo' ? '📈' : 
                       procedimento.tendencia === 'diminuindo' ? '📉' : '➡️'}
                      <TrendIcon trend={procedimento.tendencia}>
                        {procedimento.tendencia === 'crescendo' ? 'Crescendo' : 
                         procedimento.tendencia === 'diminuindo' ? 'Diminuindo' : 'Estável'}
                      </TrendIcon>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableCard>

          <TableCard>
            <ChartTitle>
              <FaUserMd />
              Performance dos Dentistas por Especialidade
            </ChartTitle>
            <Table>
              <thead>
                <tr>
                  <th>Dentista</th>
                  <th>Especialidade</th>
                  <th>Procedimentos</th>
                  <th>Valor Gerado</th>
                  <th>Favorito</th>
                  <th>Eficiência</th>
                </tr>
              </thead>
              <tbody>
                {dentistaEspecialidades
                  .sort((a, b) => b.valor_gerado - a.valor_gerado)
                  .map((dentista, index) => (
                  <tr key={index}>
                    <td><strong>{dentista.dentista}</strong></td>
                    <td>{dentista.especialidade}</td>
                    <td>{dentista.total_procedimentos}</td>
                    <td><strong>R$ {dentista.valor_gerado.toLocaleString('pt-BR')}</strong></td>
                    <td>{dentista.procedimento_favorito}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{dentista.eficiencia.toFixed(1)}/h</span>
                        <EficienciaBar percentage={dentista.eficiencia} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableCard>
        </TableContainer>
      </MainContent>
    </PageWrapper>
  );
}