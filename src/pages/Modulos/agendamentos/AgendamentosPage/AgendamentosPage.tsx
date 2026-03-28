import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import api from "../../../../components/api/api";
import { FaPlus, FaEdit, FaEye, FaTrash, FaCalendarCheck, FaClock } from "react-icons/fa";

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

const ActionButton = styled.button<{ variant?: 'edit' | 'view' | 'delete' }>`
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
      case 'view':
        return `
          background-color: #17a2b8;
          color: white;
          &:hover { background-color: #138496; }
        `;
      case 'delete':
        return `
          background-color: #dc3545;
          color: white;
          &:hover { background-color: #c82333; }
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

const ActionButtonsRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
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
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [filteredAgendamentos, setFilteredAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [editingAgendamentoId, setEditingAgendamentoId] = useState<number | null>(null);
  const [editingFormData, setEditingFormData] = useState<{
    patient_id: number;
    professional_id: number;
    procedure_id: number;
    date: string;
    time: string;
    obs?: string;
    return?: boolean;
  } | null>(null);
  const [filtros, setFiltros] = useState({
    paciente: '',
    dentista: '',
    status: '',
    data: '',
  });
  const [showAddModal, setShowAddModal] = useState(false);

  const normalizeAgendamento = (item: any): Agendamento => {
    const mapStatus = (s: string) => {
      if (s === 'scheduled') return 'agendado';
      if (s === 'confirmed') return 'confirmado';
      if (s === 'in_progress') return 'em_atendimento';
      if (s === 'completed') return 'concluido';
      if (s === 'canceled' || s === 'cancelled' || s === 'no_show') return 'cancelado';
      return (s as Agendamento['status']) || 'agendado';
    };

    return {
      id: item.id,
      paciente: item.paciente?.name ?? item.patient_name ?? item.paciente ?? '',
      dentista: item.profissional?.name ?? item.professional_name ?? item.dentista ?? '',
      procedimento: item.procedimento?.name ?? item.procedure_name ?? item.procedimento ?? '',
      data: item.date ?? item.data ?? '',
      hora: item.time ?? item.hora ?? '',
      status: mapStatus(item.status ?? 'scheduled'),
      telefone: item.paciente?.phone ?? item.telefone ?? '',
      observacoes: item.obs ?? item.observacoes ?? '',
    };
  };

  const fetchAgendamentos = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await api.get('/schedulings', { params: { per_page: 100 } });
      const data: Agendamento[] = (response.data?.data ?? []).map(normalizeAgendamento);
      setAgendamentos(data);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? 'Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAgendamentos(); }, [fetchAgendamentos]);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(null), 4000);
    return () => clearTimeout(t);
  }, [successMsg]);

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

  const handleExcluir = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este agendamento?')) return;
    setErrorMsg(null);
    try {
      await api.delete(`/schedulings/${id}`);
      setSuccessMsg('Agendamento excluído com sucesso!');
      await fetchAgendamentos();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? 'Erro ao excluir agendamento');
    }
  };

  const openAgendamentoModal = async (id: number, mode: 'edit' | 'view') => {
    setErrorMsg(null);
    try {
      const response = await api.get(`/schedulings/${id}`);
      const payload = response.data?.data ?? response.data;

      const patientId = Number(payload?.patient_id ?? payload?.paciente_id ?? payload?.patient?.id);
      const professionalId = Number(payload?.professional_id ?? payload?.profissional_id ?? payload?.professional?.id);
      const procedureId = Number(payload?.procedure_id ?? payload?.procedimento_id ?? payload?.procedure?.id);
      const date = String(payload?.date ?? payload?.data ?? '');
      const time = String(payload?.time ?? payload?.hora ?? '');

      if (!patientId || !professionalId || !procedureId || !date || !time) {
        throw new Error('Dados de edicao incompletos retornados pela API.');
      }

      setModalMode(mode);
      setEditingAgendamentoId(id);
      setEditingFormData({
        patient_id: patientId,
        professional_id: professionalId,
        procedure_id: procedureId,
        date,
        time,
        obs: payload?.obs ?? payload?.observacoes ?? '',
        return: Boolean(payload?.return ?? payload?.retorno ?? false),
      });
      setShowAddModal(true);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? err?.message ?? 'Erro ao carregar dados para edicao');
    }
  };

  const handleEditar = async (id: number) => {
    await openAgendamentoModal(id, 'edit');
  };

  const handleVisualizar = async (id: number) => {
    await openAgendamentoModal(id, 'view');
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
            <StyledButton
              variant="primary"
              onClick={() => {
                setModalMode('create');
                setEditingAgendamentoId(null);
                setEditingFormData(null);
                setShowAddModal(true);
              }}
            >
              <FaPlus />
              Novo Agendamento
            </StyledButton>
            <StyledButton variant="info">
              <FaClock />
              Agenda do Dia
            </StyledButton>
          </Actions>
        </Header>

        {successMsg && (
          <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontWeight: 600, background: '#d1fae5', border: '1px solid #10b981', color: '#065f46' }}>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontWeight: 600, background: '#fee2e2', border: '1px solid #ef4444', color: '#b91c1c' }}>
            {errorMsg}
          </div>
        )}

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
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Carregando agendamentos...</div>
          ) : (
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
                    <ActionButtonsRow>
                      <ActionButton variant="edit" title="Editar" onClick={() => handleEditar(agendamento.id)}>
                        <FaEdit />
                      </ActionButton>
                      <ActionButton variant="view" title="Visualizar" onClick={() => handleVisualizar(agendamento.id)}>
                        <FaEye />
                      </ActionButton>
                      <ActionButton variant="delete" title="Excluir" onClick={() => handleExcluir(agendamento.id)}>
                        <FaTrash />
                      </ActionButton>
                    </ActionButtonsRow>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          )}
        </TableContainer>
      {showAddModal && (
        <React.Suspense fallback={null}>
          {(() => {
            const AddAgendamentoModal = require('../../agendamentos/components/AddAgendamentoModal').default;
            return (
              <AddAgendamentoModal
                mode={modalMode}
                initialData={editingFormData}
                onClose={() => {
                  setShowAddModal(false);
                  setModalMode('create');
                  setEditingAgendamentoId(null);
                  setEditingFormData(null);
                }}
                onSubmit={async (novo: {
                  patient_id: number;
                  professional_id: number;
                  procedure_id: number;
                  date: string;
                  time: string;
                  obs?: string;
                  return?: boolean;
                }) => {
                  if (modalMode === 'view') {
                    setShowAddModal(false);
                    setModalMode('create');
                    setEditingAgendamentoId(null);
                    setEditingFormData(null);
                    return;
                  }

                  setErrorMsg(null);
                  try {
                    if (editingAgendamentoId) {
                      try {
                        await api.put(`/schedulings/${editingAgendamentoId}`, novo);
                      } catch {
                        await api.patch(`/schedulings/${editingAgendamentoId}`, novo);
                      }
                      setSuccessMsg('Agendamento atualizado com sucesso!');
                    } else {
                      await api.post('/schedulings', novo);
                      setSuccessMsg('Agendamento criado com sucesso!');
                    }
                    setShowAddModal(false);
                    setModalMode('create');
                    setEditingAgendamentoId(null);
                    setEditingFormData(null);
                    await fetchAgendamentos();
                  } catch (err: any) {
                    setErrorMsg(err?.response?.data?.message ?? (editingAgendamentoId ? 'Erro ao atualizar agendamento' : 'Erro ao criar agendamento'));
                  }
                }}
                editingId={editingAgendamentoId}
                agendamentosExistentes={agendamentos.map(a => ({ id: a.id, data: a.data, hora: a.hora, status: a.status }))}
              />
            );
          })()}
        </React.Suspense>
      )}
    </MainContent>
  </PageWrapper>
);
}
