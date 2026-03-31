import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FaTooth, FaCalendarAlt, FaUserMd, FaStethoscope,
  FaClock, FaPlus, FaSignOutAlt, FaBan, FaCheckCircle,
  FaHourglassHalf, FaTimesCircle,
} from "react-icons/fa";
import portalApi from "./portalApi";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Agendamento {
  id: number;
  dentista: string;
  especialidade: string;
  procedimento: string;
  data: string;
  hora: string;
  status: string;
  obs?: string;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const PageWrapper = styled.div`
  background: linear-gradient(160deg, #f0faf5 0%, #e8f5ee 100%);
  min-height: 100vh;
  padding: 0;
`;

const TopBar = styled.div`
  background: #1a6b4a;
  padding: 16px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
`;

const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Greeting = styled.span`
  color: rgba(255,255,255,0.85);
  font-size: 0.9rem;
`;

const TopBtn = styled.button`
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
  &:hover { background: rgba(255,255,255,0.25); }
`;

const AgendarLink = styled(Link)`
  background: #fff;
  color: #1a6b4a;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
  &:hover { background: #f0faf5; }
`;

const Content = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a4a32;
  margin: 0 0 24px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterBtn = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1.5px solid ${({ active }) => (active ? "#1a6b4a" : "#dee2e6")};
  background: ${({ active }) => (active ? "#1a6b4a" : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#6c757d")};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: #1a6b4a; }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  padding: 20px 24px;
  margin-bottom: 16px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
`;

const CardLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const DentistaName = styled.span`
  font-weight: 700;
  color: #1a4a32;
  font-size: 1rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${({ status }) =>
    status === "agendado" ? "#fff3cd"
    : status === "confirmado" ? "#d4edda"
    : status === "concluido" ? "#cce5ff"
    : status === "cancelado" ? "#f8d7da"
    : "#e9ecef"};
  color: ${({ status }) =>
    status === "agendado" ? "#856404"
    : status === "confirmado" ? "#155724"
    : status === "concluido" ? "#004085"
    : status === "cancelado" ? "#721c24"
    : "#495057"};
`;

const InfoRow = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const InfoItem = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #495057;
  font-size: 0.85rem;
  svg { color: #1a6b4a; }
`;

const CancelBtn = styled.button`
  background: none;
  border: 1.5px solid #f5c6cb;
  color: #721c24;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  white-space: nowrap;
  &:hover { background: #f8d7da; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  color: #dee2e6;
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  color: #6c757d;
  margin-bottom: 20px;
  font-size: 1rem;
`;

const AgendarBtn = styled(Link)`
  padding: 12px 28px;
  background: #1a6b4a;
  color: #fff;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
  &:hover { background: #155c3e; }
`;

const LoadText = styled.p`
  color: #6c757d;
  text-align: center;
  padding: 40px;
`;

const ModalOverlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
`;

const ModalCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
`;

const ModalTitle = styled.h3`
  font-size: 1.1rem;
  color: #721c24;
  margin: 0 0 12px;
  display: flex; align-items: center; gap: 8px;
`;

const ModalText = styled.p`
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0 0 16px;
`;

const ModalTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1.5px solid #dee2e6;
  border-radius: 8px;
  resize: vertical;
  min-height: 70px;
  font-size: 0.9rem;
  box-sizing: border-box;
  margin-bottom: 16px;
  &:focus { outline: none; border-color: #1a6b4a; }
`;

const ModalBtns = styled.div`
  display: flex; justify-content: flex-end; gap: 10px;
`;

const ModalSecBtn = styled.button`
  padding: 10px 20px;
  border: 1.5px solid #dee2e6;
  border-radius: 8px;
  background: #fff;
  color: #6c757d;
  cursor: pointer;
  font-weight: 600;
`;

const ModalDangerBtn = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: #dc3545;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  &:disabled { opacity: 0.5; }
`;

// ---------------------------------------------------------------------------
// Status label helpers
// ---------------------------------------------------------------------------
function statusLabel(s: string) {
  const map: Record<string, string> = {
    scheduled: "agendado", agendado: "agendado",
    confirmed: "confirmado", confirmado: "confirmado",
    in_progress: "em atendimento", em_atendimento: "em atendimento",
    completed: "concluido", concluido: "concluido",
    canceled: "cancelado", cancelado: "cancelado",
  };
  return map[s] ?? s;
}

function canCancel(status: string) {
  return ["scheduled", "confirmed", "agendado", "confirmado"].includes(status);
}

function StatusIcon({ status }: { status: string }) {
  const s = statusLabel(status);
  if (s === "confirmado") return <FaCheckCircle style={{ color: "#155724" }} />;
  if (s === "concluido")  return <FaCheckCircle style={{ color: "#004085" }} />;
  if (s === "cancelado")  return <FaTimesCircle style={{ color: "#721c24" }} />;
  return <FaHourglassHalf style={{ color: "#856404" }} />;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const PortalMeusAgendamentosPage: React.FC = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("patient_token");
  const userRaw = sessionStorage.getItem("patient_user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  const [items, setItems]         = useState<Agendamento[]>([]);
  const [loading, setLoading]     = useState(false);
  const [filterStatus, setFilter] = useState("");
  const [cancelId, setCancelId]   = useState<number | null>(null);
  const [motivo, setMotivo]       = useState("");
  const [canceling, setCanceling] = useState(false);

  const fetchAgendamentos = useCallback(async (status = "") => {
    if (!token) { navigate("/portal/login"); return; }
    setLoading(true);
    try {
      const params = status ? { status } : {};
      const { data } = await portalApi.get("/portal/meus-agendamentos", { params });
      setItems(data.data ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => { fetchAgendamentos(filterStatus); }, [filterStatus, fetchAgendamentos]);

  const handleLogout = () => {
    sessionStorage.removeItem("patient_token");
    sessionStorage.removeItem("patient_user");
    navigate("/portal");
  };

  const handleCancelConfirm = async () => {
    if (!cancelId) return;
    setCanceling(true);
    try {
      await portalApi.patch(`/portal/agendamentos/${cancelId}/cancelar`, { motivo });
      setCancelId(null);
      setMotivo("");
      fetchAgendamentos(filterStatus);
    } catch {
      // silent
    } finally {
      setCanceling(false);
    }
  };

  const filters = [
    { label: "Todos", value: "" },
    { label: "Agendados", value: "scheduled" },
    { label: "Confirmados", value: "confirmed" },
    { label: "Concluídos", value: "completed" },
    { label: "Cancelados", value: "canceled" },
  ];

  return (
    <PageWrapper>
      <TopBar>
        <Brand><FaTooth /> Clínica Odontológica</Brand>
        <TopActions>
          <Greeting>Olá, {user?.name?.split(" ")[0] ?? "Paciente"}</Greeting>
          <AgendarLink to="/portal/agendar">
            <FaPlus /> Nova Consulta
          </AgendarLink>
          <TopBtn onClick={handleLogout}>
            <FaSignOutAlt /> Sair
          </TopBtn>
        </TopActions>
      </TopBar>

      <Content>
        <PageTitle><FaCalendarAlt /> Meus Agendamentos</PageTitle>

        <FilterRow>
          {filters.map((f) => (
            <FilterBtn
              key={f.value}
              active={filterStatus === f.value}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </FilterBtn>
          ))}
        </FilterRow>

        {loading && <LoadText>Carregando agendamentos...</LoadText>}

        {!loading && items.length === 0 && (
          <EmptyState>
            <EmptyIcon><FaCalendarAlt /></EmptyIcon>
            <EmptyText>Você ainda não tem consultas agendadas.</EmptyText>
            <AgendarBtn to="/portal/agendar">
              <FaPlus /> Agendar Consulta
            </AgendarBtn>
          </EmptyState>
        )}

        {!loading && items.map((item) => {
          const sLabel = statusLabel(item.status);
          return (
            <Card key={item.id}>
              <CardLeft>
                <CardHeader>
                  <DentistaName>{item.dentista}</DentistaName>
                  <StatusBadge status={sLabel}>
                    <StatusIcon status={sLabel} /> {sLabel}
                  </StatusBadge>
                </CardHeader>
                <InfoRow>
                  <InfoItem><FaStethoscope /> {item.procedimento}</InfoItem>
                  <InfoItem><FaCalendarAlt /> {item.data}</InfoItem>
                  <InfoItem><FaClock /> {item.hora}</InfoItem>
                  {item.especialidade && (
                    <InfoItem><FaUserMd /> {item.especialidade}</InfoItem>
                  )}
                </InfoRow>
                {item.obs && (
                  <InfoItem style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                    Obs: {item.obs}
                  </InfoItem>
                )}
              </CardLeft>

              {canCancel(item.status) && (
                <CancelBtn onClick={() => setCancelId(item.id)}>
                  <FaBan /> Cancelar
                </CancelBtn>
              )}
            </Card>
          );
        })}
      </Content>

      {/* Cancel Modal */}
      {cancelId !== null && (
        <ModalOverlay>
          <ModalCard>
            <ModalTitle><FaTimesCircle /> Cancelar Consulta</ModalTitle>
            <ModalText>
              Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
            </ModalText>
            <ModalTextarea
              placeholder="Motivo do cancelamento (opcional)..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
            <ModalBtns>
              <ModalSecBtn onClick={() => { setCancelId(null); setMotivo(""); }}>
                Voltar
              </ModalSecBtn>
              <ModalDangerBtn onClick={handleCancelConfirm} disabled={canceling}>
                {canceling ? "Cancelando..." : "Confirmar Cancelamento"}
              </ModalDangerBtn>
            </ModalBtns>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};

export default PortalMeusAgendamentosPage;
