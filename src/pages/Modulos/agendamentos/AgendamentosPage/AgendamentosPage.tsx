import React, { useEffect, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import api from "../../../../components/api/api";
import { FaPlus, FaEdit, FaEye, FaTrash, FaCalendarCheck, FaTimes, FaUser, FaUserMd, FaStethoscope, FaPhone, FaCalendarDay } from "react-icons/fa";

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

const StatCard = styled.div<{ active?: boolean; cardColor?: string }>`
  padding: 20px;
  background: ${({ cardColor }) => cardColor ?? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  border-radius: 10px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  outline: ${({ active }) => active ? '3px solid rgba(255,255,255,0.9)' : '3px solid transparent'};
  outline-offset: 2px;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.18);
  }
  &:active { transform: translateY(0); }
`;

const StatCardBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 10px;
  font-size: 10px;
  font-weight: 700;
  background: rgba(255,255,255,0.25);
  border-radius: 20px;
  padding: 2px 8px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const StatCardHint = styled.div`
  font-size: 11px;
  margin-top: 6px;
  opacity: 0.75;
  font-style: italic;
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

// ---------------------------------------------------------------------------
// Agenda do Dia — Drawer
// ---------------------------------------------------------------------------
const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
`;

const DrawerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
`;

const DrawerPanel = styled.div`
  width: 420px;
  max-width: 95vw;
  height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(0,0,0,0.18);
  animation: ${slideIn} 0.22s ease;
  overflow: hidden;
`;

const DrawerHeader = styled.div`
  background: linear-gradient(135deg, #17a2b8 0%, #0d7a8a 100%);
  color: #fff;
  padding: 20px 24px 16px;
  flex-shrink: 0;
`;

const DrawerTitle = styled.h2`
  margin: 0 0 4px;
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DrawerDate = styled.div`
  font-size: 0.9rem;
  opacity: 0.88;
`;

const DrawerCloseBtn = styled.button`
  position: absolute;
  top: 14px;
  right: 16px;
  background: rgba(255,255,255,0.2);
  border: none;
  color: #fff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background: rgba(255,255,255,0.35); }
`;

const DrawerSummaryBar = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid #e9ecef;
  flex-shrink: 0;
`;

const DrawerSummaryItem = styled.div<{ color: string }>`
  flex: 1;
  padding: 10px 8px;
  text-align: center;
  border-right: 1px solid #e9ecef;
  &:last-child { border-right: none; }
  span:first-child {
    display: block;
    font-size: 1.3rem;
    font-weight: 700;
    color: ${({ color }) => color};
  }
  span:last-child {
    font-size: 0.72rem;
    color: #6c757d;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
`;

const DrawerBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const DrawerEmpty = styled.div`
  text-align: center;
  color: #adb5bd;
  padding: 48px 16px;
  font-size: 0.95rem;
`;

const TimelineItem = styled.button<{ statusColor: string }>`
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
  padding: 0;
  display: flex;
  gap: 14px;
  margin-bottom: 14px;
  position: relative;
  cursor: pointer;

  &:hover {
    opacity: 0.98;
  }

  &:focus-visible {
    outline: 2px solid #1976d2;
    outline-offset: 2px;
    border-radius: 8px;
  }

  &::before {
    content: '';
    position: absolute;
    left: 38px;
    top: 44px;
    bottom: -14px;
    width: 2px;
    background: #e9ecef;
  }
  &:last-child::before { display: none; }
`;

const TimelineDot = styled.div<{ color: string }>`
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${({ color }) => color};
  margin-top: 14px;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px ${({ color }) => color};
  z-index: 1;
`;

const TimelineTime = styled.div`
  flex-shrink: 0;
  width: 46px;
  font-size: 0.88rem;
  font-weight: 700;
  color: #495057;
  padding-top: 10px;
  text-align: right;
`;

const TimelineCard = styled.div<{ statusColor: string }>`
  flex: 1;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 12px 14px;
  border-left: 4px solid ${({ statusColor }) => statusColor};
  transition: background-color 0.2s ease, transform 0.2s ease;
`;

const TLPatient = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  color: #212529;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
`;

const TLRow = styled.div`
  font-size: 0.82rem;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
`;

const TLBadge = styled.span<{ bg: string; fg: string }>`
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  background: ${({ bg }) => bg};
  color: ${({ fg }) => fg};
  text-transform: uppercase;
  margin-left: auto;
`;

// ---------------------------------------------------------------------------
// Modal de Visualização do Agendamento
// ---------------------------------------------------------------------------
const ViewModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ViewModalBox = styled.div`
  background: #fff;
  border-radius: 14px;
  width: 100%;
  max-width: 520px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
`;

const ViewModalHeader = styled.div<{ statusColor: string }>`
  background: ${({ statusColor }) => statusColor};
  padding: 20px 24px 16px;
  position: relative;
  color: #fff;
`;

const ViewModalTitle = styled.h3`
  margin: 0 0 4px;
  font-size: 1.15rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ViewModalSubtitle = styled.div`
  font-size: 0.88rem;
  opacity: 0.88;
`;

const ViewModalClose = styled.button`
  position: absolute;
  top: 14px;
  right: 16px;
  background: rgba(255,255,255,0.2);
  border: none;
  color: #fff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background: rgba(255,255,255,0.35); }
`;

const ViewModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const VMRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const VMIcon = styled.div<{ color?: string }>`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ color }) => color ?? '#f0f4ff'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  color: ${({ color }) => color ? '#fff' : '#4a6cf7'};
`;

const VMInfo = styled.div`
  flex: 1;
`;

const VMLabel = styled.div`
  font-size: 0.72rem;
  color: #adb5bd;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
`;

const VMValue = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #212529;
`;

const VMStatusBadge = styled.span<{ bg: string; fg: string }>`
  display: inline-block;
  padding: 4px 14px;
  border-radius: 20px;
  background: ${({ bg }) => bg};
  color: ${({ fg }) => fg};
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const ViewModalFooter = styled.div`
  padding: 14px 24px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
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
  const [activeCard, setActiveCard] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAgendaDia, setShowAgendaDia] = useState(false);
  const [viewingAgendamento, setViewingAgendamento] = useState<Agendamento | null>(null);

  const handleCardClick = (statusValue: string) => {
    const next = activeCard === statusValue ? '' : statusValue;
    setActiveCard(next);
    setFiltros(f => ({ ...f, status: next }));
  };

  // Helpers para Agenda do Dia
  const todayISO = new Date().toISOString().split('T')[0];
  const todayLabel = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  const agendamentosHoje = agendamentos
    .filter(a => a.data === todayISO)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  const statusColorMap: Record<string, { dot: string; bg: string; fg: string; label: string }> = {
    agendado:       { dot: '#1976d2', bg: '#e3f2fd', fg: '#1565c0', label: 'Agendado' },
    confirmado:     { dot: '#2e7d32', bg: '#e8f5e9', fg: '#1b5e20', label: 'Confirmado' },
    em_atendimento: { dot: '#f57c00', bg: '#fff3e0', fg: '#e65100', label: 'Em Atendimento' },
    concluido:      { dot: '#388e3c', bg: '#e8f5e9', fg: '#1b5e20', label: 'Concluído' },
    cancelado:      { dot: '#d32f2f', bg: '#ffebee', fg: '#b71c1c', label: 'Cancelado' },
  };

  const resumoHoje = {
    total:      agendamentosHoje.length,
    agendados:  agendamentosHoje.filter(a => a.status === 'agendado').length,
    confirmados:agendamentosHoje.filter(a => a.status === 'confirmado').length,
    concluidos: agendamentosHoje.filter(a => a.status === 'concluido').length,
    atendimento:agendamentosHoje.filter(a => a.status === 'em_atendimento').length,
  };

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

  const handleVisualizar = (id: number) => {
    const found = agendamentos.find(a => a.id === id);
    if (found) setViewingAgendamento(found);
  };

  const viewStatusColors: Record<string, { bg: string; fg: string; label: string; header: string }> = {
    agendado:       { bg: '#e3f2fd', fg: '#1565c0', label: 'Agendado',       header: '#1976d2' },
    confirmado:     { bg: '#e8f5e9', fg: '#1b5e20', label: 'Confirmado',     header: '#2e7d32' },
    em_atendimento: { bg: '#fff3e0', fg: '#e65100', label: 'Em Atendimento', header: '#f57c00' },
    concluido:      { bg: '#e8f5e9', fg: '#1b5e20', label: 'Concluído',      header: '#388e3c' },
    cancelado:      { bg: '#ffebee', fg: '#b71c1c', label: 'Cancelado',      header: '#d32f2f' },
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
            <StyledButton variant="info" onClick={() => setShowAgendaDia(true)}>
              <FaCalendarDay />
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
          <StatCard
            active={activeCard === ''}
            cardColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            onClick={() => handleCardClick('')}
            title="Clique para exibir todos os agendamentos"
          >
            {activeCard === '' && <StatCardBadge>Ativo</StatCardBadge>}
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Total de Agendamentos</StatLabel>
            <StatCardHint>Todos os registros</StatCardHint>
          </StatCard>

          <StatCard
            active={activeCard === 'agendado'}
            cardColor="linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)"
            onClick={() => handleCardClick('agendado')}
            title="Clique para filtrar agendamentos com status Agendado"
          >
            {activeCard === 'agendado' && <StatCardBadge>Ativo</StatCardBadge>}
            <StatNumber>{stats.agendados}</StatNumber>
            <StatLabel>Agendados</StatLabel>
            <StatCardHint>Aguardando confirmação</StatCardHint>
          </StatCard>

          <StatCard
            active={activeCard === 'confirmado'}
            cardColor="linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)"
            onClick={() => handleCardClick('confirmado')}
            title="Clique para filtrar agendamentos com status Confirmado"
          >
            {activeCard === 'confirmado' && <StatCardBadge>Ativo</StatCardBadge>}
            <StatNumber>{stats.confirmados}</StatNumber>
            <StatLabel>Confirmados</StatLabel>
            <StatCardHint>Presença confirmada</StatCardHint>
          </StatCard>

          <StatCard
            active={activeCard === 'concluido'}
            cardColor="linear-gradient(135deg, #388e3c 0%, #a5d6a7 100%)"
            onClick={() => handleCardClick('concluido')}
            title="Clique para filtrar agendamentos com status Concluído"
          >
            {activeCard === 'concluido' && <StatCardBadge>Ativo</StatCardBadge>}
            <StatNumber>{stats.concluidos}</StatNumber>
            <StatLabel>Concluídos</StatLabel>
            <StatCardHint>Atendimento realizado</StatCardHint>
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
            onChange={(e) => {
              const val = e.target.value;
              setFiltros(f => ({ ...f, status: val }));
              setActiveCard(val);
            }}
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

      {/* ------------------------------------------------------------------ */}
      {/* Modal de Visualização do Agendamento                                 */}
      {/* ------------------------------------------------------------------ */}
      {viewingAgendamento && (
        <ViewModalBackdrop onClick={() => setViewingAgendamento(null)}>
          <ViewModalBox onClick={e => e.stopPropagation()}>
            <ViewModalHeader statusColor={viewStatusColors[viewingAgendamento.status]?.header ?? '#1976d2'}>
              <ViewModalTitle><FaCalendarCheck /> Detalhes do Agendamento</ViewModalTitle>
              <ViewModalSubtitle>
                #{viewingAgendamento.id} &nbsp;·&nbsp;
                <VMStatusBadge bg="rgba(255,255,255,0.25)" fg="#fff">
                  {viewStatusColors[viewingAgendamento.status]?.label ?? viewingAgendamento.status}
                </VMStatusBadge>
              </ViewModalSubtitle>
              <ViewModalClose onClick={() => setViewingAgendamento(null)} title="Fechar"><FaTimes /></ViewModalClose>
            </ViewModalHeader>

            <ViewModalBody>
              <VMRow>
                <VMIcon color="#4a6cf7"><FaUser /></VMIcon>
                <VMInfo>
                  <VMLabel>Paciente</VMLabel>
                  <VMValue>{viewingAgendamento.paciente}</VMValue>
                </VMInfo>
              </VMRow>

              <VMRow>
                <VMIcon color="#0d7a8a"><FaUserMd /></VMIcon>
                <VMInfo>
                  <VMLabel>Dentista</VMLabel>
                  <VMValue>{viewingAgendamento.dentista}</VMValue>
                </VMInfo>
              </VMRow>

              <VMRow>
                <VMIcon color="#7c3aed"><FaStethoscope /></VMIcon>
                <VMInfo>
                  <VMLabel>Procedimento</VMLabel>
                  <VMValue>{viewingAgendamento.procedimento}</VMValue>
                </VMInfo>
              </VMRow>

              <VMRow>
                <VMIcon color="#e65100"><FaCalendarDay /></VMIcon>
                <VMInfo>
                  <VMLabel>Data e Hora</VMLabel>
                  <VMValue style={{ textTransform: 'capitalize' }}>
                    {new Date(viewingAgendamento.data + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })} às {viewingAgendamento.hora}
                  </VMValue>
                </VMInfo>
              </VMRow>

              {viewingAgendamento.telefone && (
                <VMRow>
                  <VMIcon color="#2e7d32"><FaPhone /></VMIcon>
                  <VMInfo>
                    <VMLabel>Telefone</VMLabel>
                    <VMValue>{viewingAgendamento.telefone}</VMValue>
                  </VMInfo>
                </VMRow>
              )}

              <VMRow>
                <VMIcon><FaCalendarCheck /></VMIcon>
                <VMInfo>
                  <VMLabel>Status</VMLabel>
                  <VMStatusBadge
                    bg={viewStatusColors[viewingAgendamento.status]?.bg ?? '#e3f2fd'}
                    fg={viewStatusColors[viewingAgendamento.status]?.fg ?? '#1565c0'}
                  >
                    {viewStatusColors[viewingAgendamento.status]?.label ?? viewingAgendamento.status}
                  </VMStatusBadge>
                </VMInfo>
              </VMRow>

              {viewingAgendamento.observacoes && (
                <VMRow>
                  <VMIcon><FaEdit /></VMIcon>
                  <VMInfo>
                    <VMLabel>Observações</VMLabel>
                    <VMValue style={{ fontWeight: 400, color: '#495057', fontStyle: 'italic' }}>
                      {viewingAgendamento.observacoes}
                    </VMValue>
                  </VMInfo>
                </VMRow>
              )}
            </ViewModalBody>

            <ViewModalFooter>
              <StyledButton variant="warning" onClick={() => setViewingAgendamento(null)}>Fechar</StyledButton>
            </ViewModalFooter>
          </ViewModalBox>
        </ViewModalBackdrop>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Agenda do Dia — Drawer                                               */}
      {/* ------------------------------------------------------------------ */}
      {showAgendaDia && (
        <DrawerOverlay onClick={() => setShowAgendaDia(false)}>
          <DrawerPanel onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
            <DrawerHeader>
              <DrawerTitle><FaCalendarDay /> Agenda do Dia</DrawerTitle>
              <DrawerDate style={{ textTransform: 'capitalize' }}>{todayLabel}</DrawerDate>
              <DrawerCloseBtn onClick={() => setShowAgendaDia(false)} title="Fechar">
                <FaTimes />
              </DrawerCloseBtn>
            </DrawerHeader>

            <DrawerSummaryBar>
              <DrawerSummaryItem color="#495057">
                <span>{resumoHoje.total}</span>
                <span>Total</span>
              </DrawerSummaryItem>
              <DrawerSummaryItem color="#1976d2">
                <span>{resumoHoje.agendados}</span>
                <span>Agendados</span>
              </DrawerSummaryItem>
              <DrawerSummaryItem color="#2e7d32">
                <span>{resumoHoje.confirmados}</span>
                <span>Confirmados</span>
              </DrawerSummaryItem>
              <DrawerSummaryItem color="#f57c00">
                <span>{resumoHoje.atendimento}</span>
                <span>Em Atend.</span>
              </DrawerSummaryItem>
              <DrawerSummaryItem color="#388e3c">
                <span>{resumoHoje.concluidos}</span>
                <span>Concluídos</span>
              </DrawerSummaryItem>
            </DrawerSummaryBar>

            <DrawerBody>
              {agendamentosHoje.length === 0 ? (
                <DrawerEmpty>
                  <FaCalendarDay style={{ fontSize: '2.5rem', marginBottom: 12, opacity: 0.3 }} />
                  <div>Nenhum agendamento para hoje.</div>
                </DrawerEmpty>
              ) : (
                agendamentosHoje.map(a => {
                  const sc = statusColorMap[a.status] ?? statusColorMap['agendado'];
                  return (
                    <TimelineItem
                      key={a.id}
                      statusColor={sc.dot}
                      onClick={() => setViewingAgendamento(a)}
                      title="Clique para visualizar detalhes"
                    >
                      <TimelineDot color={sc.dot} />
                      <TimelineTime>{a.hora}</TimelineTime>
                      <TimelineCard statusColor={sc.dot}>
                        <TLPatient>
                          <FaUser style={{ color: '#adb5bd', fontSize: '0.8rem' }} />
                          {a.paciente}
                          <TLBadge bg={sc.bg} fg={sc.fg}>{sc.label}</TLBadge>
                        </TLPatient>
                        <TLRow>
                          <FaUserMd style={{ color: '#adb5bd' }} />
                          {a.dentista}
                        </TLRow>
                        <TLRow>
                          <FaStethoscope style={{ color: '#adb5bd' }} />
                          {a.procedimento}
                        </TLRow>
                        {a.telefone && (
                          <TLRow>
                            <FaPhone style={{ color: '#adb5bd' }} />
                            {a.telefone}
                          </TLRow>
                        )}
                        {a.observacoes && (
                          <TLRow style={{ fontStyle: 'italic', color: '#868e96' }}>
                            "{a.observacoes}"
                          </TLRow>
                        )}
                      </TimelineCard>
                    </TimelineItem>
                  );
                })
              )}
            </DrawerBody>
          </DrawerPanel>
        </DrawerOverlay>
      )}
    </MainContent>
  </PageWrapper>
);
}
