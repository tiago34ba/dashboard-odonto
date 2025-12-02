import React, { useEffect, useState } from "react";
import ModalAgendamento from "./ModalAgendamento";
import styled from "styled-components";
import { FaPlus, FaEdit, FaTrash, FaCalendarCheck, FaClock, FaUser, FaCheck, FaTimes } from "react-icons/fa";

// Interfaces
interface Agendamento {
  id: number;
  paciente: string;
  dentista: string;
  procedimento: string;
  data: string;
  hora: string;
  status: 'agendado' | 'confirmado' | 'em_atendimento' | 'concluido' | 'cancelado';
  telefone: string;
  observacoes?: string;
}

// Dados fake para teste
const dadosFakeAgendamentos: Agendamento[] = [
  {
    id: 1,
    paciente: "Maria Silva Santos",
    dentista: "Dr. João Pereira",
    procedimento: "Limpeza e Profilaxia",
    data: "2025-10-17",
    hora: "09:00",
    status: "confirmado",
    telefone: "(11) 99999-1111",
    observacoes: "Paciente com sensibilidade"
  },
  {
    id: 2,
    paciente: "Carlos Eduardo Lima",
    dentista: "Dra. Ana Costa",
    procedimento: "Restauração",
    data: "2025-10-17",
    hora: "10:30",
    status: "agendado",
    telefone: "(11) 98888-2222"
  },
  {
    id: 3,
    paciente: "Fernanda Oliveira",
    dentista: "Dr. João Pereira",
    procedimento: "Canal",
    data: "2025-10-17",
    hora: "14:00",
    status: "em_atendimento",
    telefone: "(11) 97777-3333",
    observacoes: "Segunda sessão"
  },
  {
    id: 4,
    paciente: "Roberto Souza",
    dentista: "Dra. Patrícia Lima",
    procedimento: "Extração",
    data: "2025-10-18",
    hora: "08:30",
    status: "agendado",
    telefone: "(11) 96666-4444"
  },
  {
    id: 5,
    paciente: "Juliana Santos",
    dentista: "Dr. João Pereira",
    procedimento: "Ortodontia - Consulta",
    data: "2025-10-18",
    hora: "11:00",
    status: "confirmado",
    telefone: "(11) 95555-5555"
  },
  {
    id: 6,
    paciente: "Paulo Henrique",
    dentista: "Dra. Ana Costa",
    procedimento: "Clareamento",
    data: "2025-10-18",
    hora: "15:30",
    status: "concluido",
    telefone: "(11) 94444-6666"
  },
  {
    id: 7,
    paciente: "Sandra Regina",
    dentista: "Dra. Patrícia Lima",
    procedimento: "Implante - Avaliação",
    data: "2025-10-19",
    hora: "09:30",
    status: "cancelado",
    telefone: "(11) 93333-7777",
    observacoes: "Reagendado para próxima semana"
  },
  {
    id: 8,
    paciente: "José Carlos",
    dentista: "Dr. João Pereira",
    procedimento: "Prótese - Moldagem",
    data: "2025-10-19",
    hora: "13:00",
    status: "agendado",
    telefone: "(11) 92222-8888"
  }
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
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 40px);
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
`;

const Title = styled.h2`
  font-size: 28px;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const StyledButton = styled.button<{ variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' }>`
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
      case 'danger':
        return `
          background-color: #dc3545;
          color: white;
          &:hover { background-color: #c82333; }
        `;
      case 'warning':
        return `
          background-color: #ffc107;
          color: #212529;
          &:hover { background-color: #e0a800; }
        `;
      case 'info':
        return `
          background-color: #17a2b8;
          color: white;
          &:hover { background-color: #138496; }
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
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
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
    vertical-align: middle;
  }

  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #495057;
    position: sticky;
    top: 0;
    z-index: 10;
    border-bottom: 2px solid #dee2e6;
  }

  tr:hover {
    background-color: #f1f3f4;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  
  ${({ status }) => {
    switch (status) {
      case 'agendado':
        return 'background-color: #e3f2fd; color: #1976d2;';
      case 'confirmado':
        return 'background-color: #e8f5e8; color: #2e7d32;';
      case 'em_atendimento':
        return 'background-color: #fff3e0; color: #f57c00;';
      case 'concluido':
        return 'background-color: #e8f5e8; color: #388e3c;';
      case 'cancelado':
        return 'background-color: #ffebee; color: #d32f2f;';
      default:
        return 'background-color: #f5f5f5; color: #666;';
    }
  }}
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' | 'confirm' | 'cancel' }>`
  padding: 6px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin: 0 2px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  
  ${({ variant = 'edit' }) => {
    switch (variant) {
      case 'delete':
        return `
          background-color: #dc3545;
          color: white;
          &:hover { background-color: #c82333; }
        `;
      case 'confirm':
        return `
          background-color: #28a745;
          color: white;
          &:hover { background-color: #218838; }
        `;
      case 'cancel':
        return `
          background-color: #6c757d;
          color: white;
          &:hover { background-color: #5a6268; }
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

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(dadosFakeAgendamentos);
  const [filteredAgendamentos, setFilteredAgendamentos] = useState<Agendamento[]>(dadosFakeAgendamentos);
  const [filtros, setFiltros] = useState({
    paciente: '',
    dentista: '',
    status: '',
    data: '',
  });
  const [showAddModal, setShowAddModal] = useState(false);

  // Função para filtrar agendamentos
  useEffect(() => {
    let filtered = agendamentos;

    if (filtros.paciente) {
      filtered = filtered.filter(a => 
        a.paciente.toLowerCase().includes(filtros.paciente.toLowerCase())
      );
    }

    if (filtros.dentista) {
      filtered = filtered.filter(a => 
        a.dentista.toLowerCase().includes(filtros.dentista.toLowerCase())
      );
    }

    if (filtros.status) {
      filtered = filtered.filter(a => a.status === filtros.status);
    }

    if (filtros.data) {
      filtered = filtered.filter(a => a.data === filtros.data);
    }

    setFilteredAgendamentos(filtered);
  }, [filtros, agendamentos]);

  // Estatísticas
  const stats = {
    total: agendamentos.length,
    agendados: agendamentos.filter(a => a.status === 'agendado').length,
    confirmados: agendamentos.filter(a => a.status === 'confirmado').length,
    concluidos: agendamentos.filter(a => a.status === 'concluido').length,
  };

  const formatarStatus = (status: string) => {
    const statusMap = {
      'agendado': 'Agendado',
      'confirmado': 'Confirmado',
      'em_atendimento': 'Em Atendimento',
      'concluido': 'Concluído',
      'cancelado': 'Cancelado'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const formatarData = (data: string) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  return (
    <PageWrapper>
      <MainContent>
        <Header>
          <Title>
            <FaCalendarCheck />
            Agendamentos
          </Title>
          <Actions>
            <StyledButton variant="primary" onClick={() => setShowAddModal(true)}>
              <FaPlus />
              Novo Agendamento
            </StyledButton>
            <StyledButton variant="info">
              <FaClock />
              Agenda do Dia
            </StyledButton>
          </Actions>
        </Header>

        <StatsContainer>
          <StatCard>
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Total de Agendamentos</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.agendados}</StatNumber>
            <StatLabel>Agendados</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.confirmados}</StatNumber>
            <StatLabel>Confirmados</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.concluidos}</StatNumber>
            <StatLabel>Concluídos</StatLabel>
          </StatCard>
        </StatsContainer>

        <FilterContainer>
          <FilterInput
            type="text"
            placeholder="Buscar paciente..."
            value={filtros.paciente}
            onChange={(e) => setFiltros({...filtros, paciente: e.target.value})}
          />
          <FilterInput
            type="text"
            placeholder="Buscar dentista..."
            value={filtros.dentista}
            onChange={(e) => setFiltros({...filtros, dentista: e.target.value})}
          />
          <FilterSelect
            value={filtros.status}
            onChange={(e) => setFiltros({...filtros, status: e.target.value})}
          >
            <option value="">Todos os Status</option>
            <option value="agendado">Agendado</option>
            <option value="confirmado">Confirmado</option>
            <option value="em_atendimento">Em Atendimento</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </FilterSelect>
          <FilterInput
            type="date"
            value={filtros.data}
            onChange={(e) => setFiltros({...filtros, data: e.target.value})}
          />
        </FilterContainer>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Dentista</th>
                <th>Procedimento</th>
                <th>Data</th>
                <th>Hora</th>
                <th>Status</th>
                <th>Telefone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgendamentos.map((agendamento) => (
                <tr key={agendamento.id}>
                  <td>
                    <strong>{agendamento.paciente}</strong>
                    {agendamento.observacoes && (
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                        {agendamento.observacoes}
                      </div>
                    )}
                  </td>
                  <td>{agendamento.dentista}</td>
                  <td>{agendamento.procedimento}</td>
                  <td>{formatarData(agendamento.data)}</td>
                  <td>{agendamento.hora}</td>
                  <td>
                    <StatusBadge status={agendamento.status}>
                      {formatarStatus(agendamento.status)}
                    </StatusBadge>
                  </td>
                  <td>{agendamento.telefone}</td>
                  <td>
                    <ActionButton variant="edit">
                      <FaEdit />
                    </ActionButton>
                    {agendamento.status === 'agendado' && (
                      <ActionButton variant="confirm">
                        <FaCheck />
                      </ActionButton>
                    )}
                    {agendamento.status !== 'cancelado' && agendamento.status !== 'concluido' && (
                      <ActionButton variant="cancel">
                        <FaTimes />
                      </ActionButton>
                    )}
                    <ActionButton variant="delete">
                      <FaTrash />
                    </ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      {showAddModal && (
        <React.Suspense fallback={null}>
          {(() => {
            const AddAgendamentoModal = require('../../agendamentos/components/AddAgendamentoModal').default;
            return (
              <AddAgendamentoModal
                onClose={() => setShowAddModal(false)}
                onSubmit={(novo: {
                  paciente: string;
                  profissional: string;
                  procedimento: string;
                  data: string;
                  hora: string;
                  telefone: string;
                  observacoes?: string;
                  retorno?: boolean;
                }) => {
                  setAgendamentos([...agendamentos, {
                    id: agendamentos.length + 1,
                    paciente: novo.paciente,
                    dentista: novo.profissional,
                    procedimento: novo.procedimento,
                    data: novo.data,
                    hora: novo.hora,
                    status: 'agendado',
                    telefone: novo.telefone,
                    observacoes: novo.observacoes
                  }]);
                  setShowAddModal(false);
                }}
                agendamentosExistentes={agendamentos.map(a => ({ data: a.data, hora: a.hora, status: a.status }))}
              />
            );
          })()}
        </React.Suspense>
      )}
    </MainContent>
  </PageWrapper>
);
}