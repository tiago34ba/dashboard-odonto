import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as FaIcons from "react-icons/fa";

// Minimal inline ModalFrequencia to avoid missing-module errors.
// It implements the required props used by FrequenciasPage.
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dados: any) => void;
  frequencia?: any | null;
};

const ModalFrequencia: React.FC<ModalProps> = ({ isOpen, onClose, onSave, frequencia }) => {
  const [form, setForm] = React.useState<any>(
    frequencia || {
      codigo: "",
      nome: "",
      descricao: "",
      intervalo_dias: 1,
      tipo_intervalo: "Dias",
      icone: "",
      cor: "#3498db",
      ativo: true
    }
  );

  React.useEffect(() => {
    setForm(
      frequencia || {
        codigo: "",
        nome: "",
        descricao: "",
        intervalo_dias: 1,
        tipo_intervalo: "Dias",
        icone: "",
        cor: "#3498db",
        ativo: true
      }
    );
  }, [frequencia, isOpen]);

  if (!isOpen) return null;

  const handleChange = (key: string, value: any) => {
    setForm((s: any) => ({ ...s, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <ModalOverlay>
      <ModalContent onSubmit={handleSubmit}>
        <h3>{frequencia ? "Editar Frequência" : "Nova Frequência"}</h3>

        <label>Código</label>
        <input value={form.codigo} onChange={(e) => handleChange("codigo", e.target.value)} />

        <label>Nome</label>
        <input value={form.nome} onChange={(e) => handleChange("nome", e.target.value)} />

        <label>Descrição</label>
        <input value={form.descricao} onChange={(e) => handleChange("descricao", e.target.value)} />

        <label>Intervalo (dias)</label>
        <input
          type="number"
          value={form.intervalo_dias}
          onChange={(e) => handleChange("intervalo_dias", Number(e.target.value))}
        />

        <ModalActions>
          <button type="button" onClick={onClose}>Cancelar</button>
          <button type="submit">Salvar</button>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

// Simple styled components used by the inline modal
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContent = styled.form`
  background: white;
  padding: 18px;
  border-radius: 8px;
  width: 480px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  gap: 8px;

  h3 {
    margin: 0 0 8px 0;
  }

  label {
    font-size: 12px;
    color: #555;
  }

  input {
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #ddd;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;

  button {
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
  }

  button[type="button"] {
    background: #6c757d;
    color: white;
  }

  button[type="submit"] {
    background: #007bff;
    color: white;
  }
`;

// Interfaces
interface Frequencia {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  intervalo_dias: number;
  tipo_intervalo: string;
  icone: string;
  cor: string;
  ativo: boolean;
  usado_agendamentos: number;
  usado_tratamentos: number;
  created_at: string;
}

// Dados fake para teste
const dadosFakeFrequencias: Frequencia[] = [
  {
    id: 1,
    codigo: "FREQ001",
    nome: "Diário",
    descricao: "Frequência diária para tratamentos contínuos",
    intervalo_dias: 1,
    tipo_intervalo: "Dias",
    icone: "fa-sun",
    cor: "#f39c12",
    ativo: true,
    usado_agendamentos: 45,
    usado_tratamentos: 12,
    created_at: "2025-10-01"
  },
  {
    id: 2,
    codigo: "FREQ002",
    nome: "Semanal",
    descricao: "Uma vez por semana",
    intervalo_dias: 7,
    tipo_intervalo: "Dias",
    icone: "fa-calendar-week",
    cor: "#3498db",
    ativo: true,
    usado_agendamentos: 89,
    usado_tratamentos: 25,
    created_at: "2025-10-01"
  },
  {
    id: 3,
    codigo: "FREQ003",
    nome: "Quinzenal",
    descricao: "A cada duas semanas",
    intervalo_dias: 14,
    tipo_intervalo: "Dias",
    icone: "fa-calendar-alt",
    cor: "#2ecc71",
    ativo: true,
    usado_agendamentos: 67,
    usado_tratamentos: 18,
    created_at: "2025-10-02"
  },
  {
    id: 4,
    codigo: "FREQ004",
    nome: "Mensal",
    descricao: "Uma vez por mês para manutenção",
    intervalo_dias: 30,
    tipo_intervalo: "Dias",
    icone: "fa-calendar",
    cor: "#9b59b6",
    ativo: true,
    usado_agendamentos: 156,
    usado_tratamentos: 45,
    created_at: "2025-10-02"
  },
  {
    id: 5,
    codigo: "FREQ005",
    nome: "Bimensal",
    descricao: "A cada dois meses",
    intervalo_dias: 60,
    tipo_intervalo: "Dias",
    icone: "fa-calendar-plus",
    cor: "#e74c3c",
    ativo: true,
    usado_agendamentos: 23,
    usado_tratamentos: 8,
    created_at: "2025-10-03"
  },
  {
    id: 6,
    codigo: "FREQ006",
    nome: "Trimestral",
    descricao: "A cada três meses para revisões",
    intervalo_dias: 90,
    tipo_intervalo: "Dias",
    icone: "fa-history",
    cor: "#34495e",
    ativo: true,
    usado_agendamentos: 78,
    usado_tratamentos: 22,
    created_at: "2025-10-03"
  },
  {
    id: 7,
    codigo: "FREQ007",
    nome: "Semestral",
    descricao: "Duas vezes por ano",
    intervalo_dias: 180,
    tipo_intervalo: "Dias",
    icone: "fa-clock",
    cor: "#16a085",
    ativo: true,
    usado_agendamentos: 134,
    usado_tratamentos: 67,
    created_at: "2025-10-04"
  },
  {
    id: 8,
    codigo: "FREQ008",
    nome: "Anual",
    descricao: "Uma vez por ano para check-up completo",
    intervalo_dias: 365,
    tipo_intervalo: "Dias",
    icone: "fa-award",
    cor: "#d4af37",
    ativo: true,
    usado_agendamentos: 89,
    usado_tratamentos: 89,
    created_at: "2025-10-05"
  },
  {
    id: 9,
    codigo: "FREQ009",
    nome: "Personalizado 21 dias",
    descricao: "Intervalo personalizado de 21 dias",
    intervalo_dias: 21,
    tipo_intervalo: "Dias",
    icone: "fa-cogs",
    cor: "#8e44ad",
    ativo: false,
    usado_agendamentos: 5,
    usado_tratamentos: 2,
    created_at: "2025-10-06"
  }
];

const FrequenciasPage: React.FC = () => {
  const [frequencias, setFrequencias] = useState<Frequencia[]>(dadosFakeFrequencias);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [frequenciaEditando, setFrequenciaEditando] = useState<Frequencia | null>(null);
  const [frequenciasFiltradas, setFrequenciasFiltradas] = useState<Frequencia[]>(dadosFakeFrequencias);

  // Filtrar frequências
  useEffect(() => {
    let result = frequencias.filter(freq => 
      freq.nome.toLowerCase().includes(filtroNome.toLowerCase()) ||
      freq.codigo.toLowerCase().includes(filtroNome.toLowerCase()) ||
      freq.descricao.toLowerCase().includes(filtroNome.toLowerCase())
    );

    if (filtroTipo !== "todos") {
      result = result.filter(freq => freq.tipo_intervalo === filtroTipo);
    }

    if (filtroStatus === "ativo") {
      result = result.filter(freq => freq.ativo);
    } else if (filtroStatus === "inativo") {
      result = result.filter(freq => !freq.ativo);
    }

    setFrequenciasFiltradas(result);
  }, [frequencias, filtroNome, filtroTipo, filtroStatus]);

  const handleAbrirModal = (frequencia?: Frequencia) => {
    setFrequenciaEditando(frequencia || null);
    setIsModalOpen(true);
  };

  const handleFecharModal = () => {
    setIsModalOpen(false);
    setFrequenciaEditando(null);
  };

  const handleSalvarFrequencia = (dadosFrequencia: any) => {
    if (frequenciaEditando) {
      // Editando frequência existente
      setFrequencias(prev => prev.map(f => 
        f.id === frequenciaEditando.id ? { ...f, ...dadosFrequencia } : f
      ));
    } else {
      // Adicionando nova frequência
      const novaFrequencia: Frequencia = {
        id: Math.max(...frequencias.map(f => f.id)) + 1,
        ...dadosFrequencia,
        usado_agendamentos: 0,
        usado_tratamentos: 0,
        created_at: new Date().toISOString().split('T')[0]
      };
      setFrequencias(prev => [...prev, novaFrequencia]);
    }
    handleFecharModal();
  };

  const handleExcluirFrequencia = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta frequência?")) {
      setFrequencias(prev => prev.filter(f => f.id !== id));
    }
  };

  const tiposDisponiveis = [...new Set(frequencias.map(freq => freq.tipo_intervalo))];

  const estatisticas = {
    total: frequencias.length,
    ativas: frequencias.filter(f => f.ativo).length,
    inativas: frequencias.filter(f => !f.ativo).length,
    totalUso: frequencias.reduce((acc, f) => acc + f.usado_agendamentos + f.usado_tratamentos, 0)
  };

  const formatarIntervalo = (dias: number) => {
    if (dias === 1) return "1 dia";
    if (dias < 7) return `${dias} dias`;
    if (dias === 7) return "1 semana";
    if (dias < 30) return `${Math.round(dias / 7)} semanas`;
    if (dias < 365) return `${Math.round(dias / 30)} meses`;
    return `${Math.round(dias / 365)} anos`;
  };

  return (
    <PageWrapper>
      <MainContent>
        <PageHeader>
          <HeaderTitle>
            <FaIcons.FaClock />
            Frequências de Tratamento
          </HeaderTitle>
          <HeaderActions>
            <ActionButton
              variant="primary"
              onClick={() => handleAbrirModal()}
            >
              <FaIcons.FaPlus />
              Nova Frequência
            </ActionButton>
            <ActionButton variant="info">
              <FaIcons.FaDownload />
              Exportar
            </ActionButton>
          </HeaderActions>
        </PageHeader>

        {/* Estatísticas */}
        <StatsContainer>
          <StatCard color="linear-gradient(135deg, #3498db 0%, #2980b9 100%)">
            <StatNumber>{estatisticas.total}</StatNumber>
            <StatLabel>Total de Frequências</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)">
            <StatNumber>{estatisticas.ativas}</StatNumber>
            <StatLabel>Frequências Ativas</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)">
            <StatNumber>{estatisticas.inativas}</StatNumber>
            <StatLabel>Frequências Inativas</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #f39c12 0%, #e67e22 100%)">
            <StatNumber>{estatisticas.totalUso}</StatNumber>
            <StatLabel>Total de Usos</StatLabel>
          </StatCard>
        </StatsContainer>

        {/* Filtros */}
        <FilterContainer>
          <FilterLabel>
            <FaIcons.FaSearch />
            Pesquisar:
          </FilterLabel>
          <FilterInput
            type="text"
            placeholder="Buscar por nome, código ou descrição..."
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
          />
          
          <FilterLabel>
            <FaIcons.FaFilter />
            Tipo:
          </FilterLabel>
          <FilterSelect
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="todos">Todos os Tipos</option>
            {tiposDisponiveis.map((tipo, index) => (
              <option key={index} value={tipo}>{tipo}</option>
            ))}
          </FilterSelect>

          <FilterLabel>
            <FaIcons.FaFilter />
            Status:
          </FilterLabel>
          <FilterSelect
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="ativo">Ativas</option>
            <option value="inativo">Inativas</option>
          </FilterSelect>
        </FilterContainer>

        {/* Tabela */}
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Intervalo</th>
                <th>Agendamentos</th>
                <th>Tratamentos</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {frequenciasFiltradas.map((frequencia) => (
                <TableRow key={frequencia.id}>
                  <td>{frequencia.codigo}</td>
                  <td>
                    <FrequenciaInfo>
                      <IconContainer color={frequencia.cor}>
                        <i className={`fas ${frequencia.icone}`}></i>
                      </IconContainer>
                      <div>
                        <strong>{frequencia.nome}</strong>
                      </div>
                    </FrequenciaInfo>
                  </td>
                  <td>
                    <Descricao>{frequencia.descricao}</Descricao>
                  </td>
                  <td>
                    <IntervaloBadge>
                      <FaIcons.FaCalendarAlt />
                      {formatarIntervalo(frequencia.intervalo_dias)}
                    </IntervaloBadge>
                  </td>
                  <td>
                    <UsoBadge tipo="agendamentos">
                      <FaIcons.FaChartLine />
                      {frequencia.usado_agendamentos}
                    </UsoBadge>
                  </td>
                  <td>
                    <UsoBadge tipo="tratamentos">
                      <FaIcons.FaHistory />
                      {frequencia.usado_tratamentos}
                    </UsoBadge>
                  </td>
                  <td>
                    <StatusBadge ativo={frequencia.ativo}>
                      {frequencia.ativo ? (
                        <>
                          <FaIcons.FaCheckCircle />
                          Ativa
                        </>
                      ) : (
                        <>
                          <FaIcons.FaTimesCircle />
                          Inativa
                        </>
                      )}
                    </StatusBadge>
                  </td>
                  <td>{new Date(frequencia.created_at).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <ActionsContainer>
                      <ActionButton
                        variant="warning"
                        onClick={() => handleAbrirModal(frequencia)}
                        small
                      >
                        <FaIcons.FaEdit />
                        Editar
                      </ActionButton>
                      <ActionButton
                        variant="danger"
                        onClick={() => handleExcluirFrequencia(frequencia.id)}
                        small
                      >
                        <FaIcons.FaTrash />
                        Excluir
                      </ActionButton>
                    </ActionsContainer>
                  </td>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>

        {/* Modal */}
        <ModalFrequencia
          isOpen={isModalOpen}
          onClose={handleFecharModal}
          onSave={handleSalvarFrequencia}
          frequencia={frequenciaEditando}
        />
      </MainContent>
    </PageWrapper>
  );
};

// Styled Components (seguindo o padrão estabelecido)
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
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
`;

const HeaderTitle = styled.h1`
  font-size: 28px;
  color: #2c3e50;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  
  svg {
    color: #3498db;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button<{ variant?: string; small?: boolean }>`
  padding: ${({ small }) => small ? '8px 12px' : '12px 20px'};
  border: none;
  border-radius: 6px;
  font-size: ${({ small }) => small ? '12px' : '14px'};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  ${({ variant }) => {
    switch (variant) {
      case 'success':
        return `background-color: #28a745; color: white; &:hover { background-color: #218838; }`;
      case 'info':
        return `background-color: #17a2b8; color: white; &:hover { background-color: #138496; }`;
      case 'warning':
        return `background-color: #ffc107; color: #212529; &:hover { background-color: #e0a800; }`;
      case 'danger':
        return `background-color: #dc3545; color: white; &:hover { background-color: #c82333; }`;
      default:
        return `background-color: #007bff; color: white; &:hover { background-color: #0056b3; }`;
    }
  }}
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  border-radius: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterInput = styled.input`
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  min-width: 250px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.25);
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
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.25);
  }
`;

const FilterLabel = styled.label`
  color: white;
  font-weight: 500;
  margin-right: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const StatCard = styled.div<{ color?: string }>`
  padding: 20px;
  background: ${({ color = 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)' }) => color};
  border-radius: 10px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
  border: 1px solid #dee2e6;
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 0;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #dee2e6;
  }

  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #495057;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.5px;
  }

  tbody tr:hover {
    background-color: #f8f9fa;
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #fbfbfb;
  }
`;

const FrequenciaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconContainer = styled.div<{ color: string }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
`;

const Descricao = styled.div`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #6c757d;
`;

const IntervaloBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background-color: #17a2b8;
  color: white;
`;

const UsoBadge = styled.span<{ tipo: string }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${({ tipo }) => tipo === 'agendamentos' ? '#28a745' : '#fd7e14'};
  color: white;
`;

const StatusBadge = styled.span<{ ativo: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${({ ativo }) => ativo ? '#28a745' : '#dc3545'};
  color: white;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export default FrequenciasPage;