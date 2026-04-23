import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import {
  FaTooth, FaUserMd, FaCalendarAlt, FaClock,
  FaStethoscope, FaCheckCircle, FaArrowLeft, FaArrowRight,
  FaTimesCircle, FaUserEdit, FaInfoCircle,
} from "react-icons/fa";
import portalApi from "./portalApi";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Dentista {
  id: number;
  name: string;
  specialty: string;
  photo?: string;
  cro?: string;
}

interface Procedimento {
  id: number;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
}

type Step = 1 | 2 | 3 | 4 | 5;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const PageWrapper = styled.div`
  background: linear-gradient(160deg, #f0faf5 0%, #e8f5ee 100%);
  min-height: 100vh;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 860px;
  margin: 0 auto 32px;
`;

const BackBtn = styled(Link)`
  color: #1a6b4a;
  font-size: 1.1rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  &:hover { text-decoration: underline; }
`;

const PageTitle = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a4a32;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

// --- Stepper ---
const Stepper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  max-width: 680px;
  margin: 0 auto 40px;
`;

const StepItem = styled.div<{ active: boolean; done: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
  position: relative;
`;

const StepBubble = styled.div<{ active: boolean; done: boolean }>`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  background: ${({ active, done }) =>
    done ? "#1a6b4a" : active ? "#fff" : "#e9ecef"};
  color: ${({ active, done }) =>
    done ? "#fff" : active ? "#1a6b4a" : "#adb5bd"};
  border: 2px solid ${({ active, done }) =>
    done || active ? "#1a6b4a" : "#dee2e6"};
  z-index: 1;
`;

const StepLabel = styled.span<{ active: boolean }>`
  font-size: 0.7rem;
  margin-top: 6px;
  color: ${({ active }) => (active ? "#1a6b4a" : "#adb5bd")};
  font-weight: ${({ active }) => (active ? 700 : 400)};
  text-align: center;
`;

const StepLine = styled.div<{ done: boolean }>`
  flex: 1;
  height: 2px;
  background: ${({ done }) => (done ? "#1a6b4a" : "#dee2e6")};
  margin-bottom: 24px;
`;

// --- Card ---
const StepCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 32px;
  max-width: 860px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// --- Dentist Grid ---
const DentistaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 16px;
`;

const DentistaCard = styled.div<{ selected: boolean }>`
  border: 2px solid ${({ selected }) => (selected ? "#1a6b4a" : "#dee2e6")};
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ selected }) => (selected ? "#f0faf5" : "#fff")};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  &:hover { border-color: #1a6b4a; transform: translateY(-2px); }
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #d4edda;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: #1a6b4a;
  overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const DentistName = styled.div`
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
  font-size: 0.9rem;
`;

const DentistSpec = styled.div`
  color: #6c757d;
  font-size: 0.8rem;
  text-align: center;
`;

// --- Procedure Grid ---
const ProcGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
`;

const ProcCard = styled.div<{ selected: boolean }>`
  border: 2px solid ${({ selected }) => (selected ? "#1a6b4a" : "#dee2e6")};
  border-radius: 10px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ selected }) => (selected ? "#f0faf5" : "#fff")};
  &:hover { border-color: #1a6b4a; }
`;

const ProcName = styled.div`
  font-weight: 700;
  color: #2c3e50;
  font-size: 0.9rem;
  margin-bottom: 4px;
`;

const ProcPrice = styled.div`
  color: #1a6b4a;
  font-size: 0.85rem;
  font-weight: 600;
`;

// --- Calendar ---
const CalendarWrapper = styled.div`
  max-width: 380px;
`;

const CalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const CalBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: #1a6b4a;
  padding: 4px 10px;
  border-radius: 6px;
  &:hover { background: #e8f5ee; }
`;

const CalMonthYear = styled.span`
  font-weight: 700;
  color: #2c3e50;
`;

const CalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

const CalDayHeader = styled.div`
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #adb5bd;
  padding: 4px 0;
`;

const CalDay = styled.button<{ isToday?: boolean; selected?: boolean; outside?: boolean; disabled?: boolean }>`
  padding: 8px 4px;
  border: none;
  border-radius: 8px;
  cursor: ${({ disabled, outside }) => (disabled || outside ? "default" : "pointer")};
  background: ${({ selected, isToday, outside, disabled }) =>
    selected ? "#1a6b4a"
    : isToday ? "#d4edda"
    : outside || disabled ? "transparent" : "#f8f9fa"};
  color: ${({ selected, outside, disabled }) =>
    selected ? "#fff"
    : outside || disabled ? "#dee2e6" : "#2c3e50"};
  font-size: 0.85rem;
  font-weight: ${({ selected, isToday }) => (selected || isToday ? 700 : 400)};
  transition: background 0.15s;
  &:hover:not(:disabled) {
    background: ${({ selected, outside, disabled }) =>
      selected || outside || disabled ? undefined : "#c8e6c9"};
  }
`;

// --- Time Slots ---
const SlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
  gap: 10px;
`;

const SlotBtn = styled.button<{ selected: boolean }>`
  padding: 10px;
  border: 2px solid ${({ selected }) => (selected ? "#1a6b4a" : "#dee2e6")};
  border-radius: 10px;
  background: ${({ selected }) => (selected ? "#1a6b4a" : "#fff")};
  color: ${({ selected }) => (selected ? "#fff" : "#2c3e50")};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: #1a6b4a; background: ${({ selected }) => selected ? "#155c3e" : "#f0faf5"}; }
`;

// --- Summary ---
const SummaryBox = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const SummaryRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const SummaryIcon = styled.div`
  color: #1a6b4a;
  font-size: 1.1rem;
  margin-top: 2px;
`;

const SummaryLabel = styled.div`
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 2px;
`;

const SummaryValue = styled.div`
  font-weight: 700;
  color: #2c3e50;
`;

const ObsTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1.5px solid #dee2e6;
  border-radius: 10px;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 80px;
  box-sizing: border-box;
  margin-top: 16px;
  &:focus { outline: none; border-color: #1a6b4a; }
`;

// --- Navigation ---
const NavRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 28px;
`;

const NavBtn = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  border: ${({ variant }) => variant === "secondary" ? "2px solid #dee2e6" : "none"};
  background: ${({ variant }) => variant === "secondary" ? "#fff" : "#1a6b4a"};
  color: ${({ variant }) => variant === "secondary" ? "#6c757d" : "#fff"};
  &:hover {
    background: ${({ variant }) => variant === "secondary" ? "#f8f9fa" : "#155c3e"};
  }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

// --- Success ---
const SuccessCard = styled.div`
  text-align: center;
  padding: 40px;
`;

const SuccessIcon = styled.div`
  font-size: 5rem;
  color: #1a6b4a;
  margin-bottom: 20px;
`;

const SuccessTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a4a32;
  margin-bottom: 10px;
`;

const SuccessSubtitle = styled.p`
  color: #6c757d;
  margin-bottom: 28px;
`;

const SuccessBtn = styled(Link)`
  padding: 12px 28px;
  background: #1a6b4a;
  color: #fff;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  transition: background 0.2s;
  &:hover { background: #155c3e; }
`;

const ErrorBanner = styled.div`
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LoadText = styled.p`
  color: #6c757d;
  font-size: 0.95rem;
  padding: 16px 0;
`;

// --- Profile alert (perfil de paciente incompleto) ---
const ProfileAlertBox = styled.div`
  display: flex;
  gap: 16px;
  background: #fffbeb;
  border: 1.5px solid #f59e0b;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 20px;
  align-items: flex-start;
`;

const ProfileAlertIcon = styled.div`
  font-size: 1.6rem;
  color: #d97706;
  flex-shrink: 0;
  margin-top: 2px;
`;

const ProfileAlertTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #92400e;
  margin: 0 0 6px;
`;

const ProfileAlertText = styled.p`
  font-size: 0.9rem;
  color: #78350f;
  margin: 0 0 14px;
  line-height: 1.5;
`;

const ProfileAlertActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProfileAlertLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #1a6b4a;
  color: #fff;
  font-size: 0.88rem;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  width: fit-content;
  &:hover { background: #155c3e; }
`;

const ProfileAlertHelp = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.83rem;
  color: #92400e;
`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DAYS   = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

function isoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const PortalAgendarPage: React.FC = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("patient_token");

  const [step, setStep]         = useState<Step>(1);
  const [dentistas, setDentistas]     = useState<Dentista[]>([]);
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [slots, setSlots]       = useState<string[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);

  // Selections
  const [selectedDentista, setSelectedDentista] = useState<Dentista | null>(null);
  const [selectedProc, setSelectedProc]         = useState<Procedimento | null>(null);
  const [selectedSlot, setSelectedSlot]         = useState<string>("");
  const [obs, setObs]           = useState("");

  // Calendar state
  const today  = new Date();
  const [calYear, setCalYear]   = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // -------------------------------------------------------------------------
  // Load dentistas + procedimentos on mount
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!token) { navigate("/portal/login"); return; }

    setLoading(true);
    Promise.all([
      portalApi.get("/portal/dentistas"),
      portalApi.get("/portal/procedimentos"),
    ])
      .then(([d, p]) => {
        setDentistas(d.data.data ?? []);
        setProcedimentos(p.data.data ?? []);
      })
      .catch(() => setError("Erro ao carregar dados. Tente novamente."))
      .finally(() => setLoading(false));
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  // -------------------------------------------------------------------------
  // Load slots when dentista + date selected
  // -------------------------------------------------------------------------
  const loadSlots = useCallback(async (profId: number, date: Date, procedureId?: number) => {
    const dateStr = isoDate(date.getFullYear(), date.getMonth(), date.getDate());
    setSlots([]);
    setSelectedSlot("");
    try {
      const { data } = await portalApi.get("/portal/horarios-disponiveis", {
        params: {
          professional_id: profId,
          date: dateStr,
          procedure_id: procedureId,
        },
      });
      setSlots(data.available_slots ?? []);
    } catch {
      setSlots([]);
    }
  }, []);

  useEffect(() => {
    if (selectedDentista && selectedDate) {
      loadSlots(selectedDentista.id, selectedDate, selectedProc?.id);
    }
  }, [selectedDentista, selectedDate, selectedProc, loadSlots]);

  // -------------------------------------------------------------------------
  // Calendar helpers
  // -------------------------------------------------------------------------
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
  
  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const isDisabledDay = (day: number) => {
    const d = new Date(calYear, calMonth, day);
    d.setHours(0, 0, 0, 0);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return d < t || d.getDay() === 0; // sem domingos
  };

  // -------------------------------------------------------------------------
  // Submit
  // -------------------------------------------------------------------------
  const [missingProfile, setMissingProfile] = useState(false);

  const handleSubmit = async () => {
    if (!selectedDentista || !selectedDate || !selectedSlot || !selectedProc) return;
    setError("");
    setMissingProfile(false);
    setLoading(true);
    try {
      await portalApi.post("/portal/agendar", {
        professional_id: selectedDentista.id,
        procedure_id: selectedProc.id,
        date: isoDate(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()),
        time: selectedSlot,
        obs: obs || undefined,
      });
      setSuccess(true);
    } catch (err: any) {
      const status = err.response?.status;
      const msg    = err.response?.data?.message ?? "";
      if (status === 404 && msg.toLowerCase().includes("paciente")) {
        setMissingProfile(true);
      } else if (status === 422) {
        // Erro de negócio (horário ocupado, etc.) — volta para etapa anterior para nova escolha
        setError(msg || "Horário indisponível. Escolha outro horário.");
        setStep(4);
      } else {
        setError(msg || "Erro ao agendar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Stepper config
  // -------------------------------------------------------------------------
  const steps = [
    { label: "Dentista" },
    { label: "Procedimento" },
    { label: "Data" },
    { label: "Horário" },
    { label: "Confirmar" },
  ];

  const canNext: Record<Step, boolean> = {
    1: !!selectedDentista,
    2: !!selectedProc,
    3: !!selectedDate,
    4: !!selectedSlot,
    5: true,
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  if (success) {
    return (
      <PageWrapper>
        <StepCard>
          <SuccessCard>
            <SuccessIcon><FaCheckCircle /></SuccessIcon>
            <SuccessTitle>Consulta Agendada!</SuccessTitle>
            <SuccessSubtitle>
              Sua consulta com <strong>{selectedDentista?.name}</strong> foi agendada para{" "}
              <strong>
                {selectedDate?.toLocaleDateString("pt-BR")} às {selectedSlot}
              </strong>.
            </SuccessSubtitle>
            <SuccessBtn to="/portal/meus-agendamentos">Ver meus agendamentos</SuccessBtn>
          </SuccessCard>
        </StepCard>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Header>
        <BackBtn to="/portal/meus-agendamentos">
          <FaArrowLeft /> Voltar
        </BackBtn>
        <PageTitle><FaTooth /> Agendar Consulta</PageTitle>
      </Header>

      {/* Stepper */}
      <Stepper>
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <StepItem active={step === i + 1} done={step > i + 1}>
              <StepBubble active={step === i + 1} done={step > i + 1}>
                {step > i + 1 ? "✓" : i + 1}
              </StepBubble>
              <StepLabel active={step === i + 1}>{s.label}</StepLabel>
            </StepItem>
            {i < steps.length - 1 && <StepLine done={step > i + 1} />}
          </React.Fragment>
        ))}
      </Stepper>

      <StepCard>
        {loading && <LoadText>Carregando...</LoadText>}

        {/* Step 1 — Escolher dentista */}
        {step === 1 && !loading && (
          <>
            <SectionTitle><FaUserMd /> Escolha o Dentista</SectionTitle>
            <DentistaGrid>
              {dentistas.map((d) => (
                <DentistaCard
                  key={d.id}
                  selected={selectedDentista?.id === d.id}
                  onClick={() => setSelectedDentista(d)}
                >
                  <Avatar>
                    {d.photo ? <img src={d.photo} alt={d.name} /> : <FaUserMd />}
                  </Avatar>
                  <DentistName>{d.name}</DentistName>
                  <DentistSpec>{d.specialty || "Clínico Geral"}</DentistSpec>
                  {d.cro && <DentistSpec>CRO: {d.cro}</DentistSpec>}
                </DentistaCard>
              ))}
            </DentistaGrid>
          </>
        )}

        {/* Step 2 — Escolher procedimento */}
        {step === 2 && (
          <>
            <SectionTitle><FaStethoscope /> Escolha o Procedimento</SectionTitle>
            <ProcGrid>
              {procedimentos.map((p) => (
                <ProcCard
                  key={p.id}
                  selected={selectedProc?.id === p.id}
                  onClick={() => setSelectedProc(p)}
                >
                  <ProcName>{p.name}</ProcName>
                  {p.price != null && (
                    <ProcPrice>
                      {p.price > 0
                        ? `R$ ${Number(p.price).toFixed(2)}`
                        : "A consultar"}
                    </ProcPrice>
                  )}
                </ProcCard>
              ))}
            </ProcGrid>
          </>
        )}

        {/* Step 3 — Escolher data */}
        {step === 3 && (
          <>
            <SectionTitle><FaCalendarAlt /> Escolha a Data</SectionTitle>
            <CalendarWrapper>
              <CalHeader>
                <CalBtn onClick={prevMonth}>&larr;</CalBtn>
                <CalMonthYear>{MONTHS[calMonth]} {calYear}</CalMonthYear>
                <CalBtn onClick={nextMonth}>&rarr;</CalBtn>
              </CalHeader>
              <CalGrid>
                {DAYS.map((d) => <CalDayHeader key={d}>{d}</CalDayHeader>)}
                {Array.from({ length: firstDayOfMonth }, (_, i) => (
                  <CalDay key={`empty-${i}`} outside disabled />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const disabled = isDisabledDay(day);
                  const isToday = today.getDate() === day && today.getMonth() === calMonth && today.getFullYear() === calYear;
                  const sel = selectedDate?.getDate() === day && selectedDate?.getMonth() === calMonth && selectedDate?.getFullYear() === calYear;
                  return (
                    <CalDay
                      key={day}
                      isToday={isToday}
                      selected={sel}
                      disabled={disabled}
                      onClick={() => {
                        if (!disabled) setSelectedDate(new Date(calYear, calMonth, day));
                      }}
                    >
                      {day}
                    </CalDay>
                  );
                })}
              </CalGrid>
            </CalendarWrapper>
          </>
        )}

        {/* Step 4 — Escolher horário */}
        {step === 4 && (
          <>
            <SectionTitle>
              <FaClock /> Horários Disponíveis —{" "}
              {selectedDate?.toLocaleDateString("pt-BR")}
            </SectionTitle>
            {slots.length === 0 ? (
              <LoadText>Nenhum horário disponível para esta data. Escolha outra data.</LoadText>
            ) : (
              <SlotsGrid>
                {slots.map((s) => (
                  <SlotBtn
                    key={s}
                    selected={selectedSlot === s}
                    onClick={() => setSelectedSlot(s)}
                  >
                    {s}
                  </SlotBtn>
                ))}
              </SlotsGrid>
            )}
          </>
        )}

        {/* Step 5 — Confirmar */}
        {step === 5 && (
          <>
            <SectionTitle><FaCheckCircle /> Confirmar Agendamento</SectionTitle>

            {/* Perfil de paciente incompleto — tratamento amigável */}
            {missingProfile && (
              <ProfileAlertBox>
                <ProfileAlertIcon><FaUserEdit /></ProfileAlertIcon>
                <div>
                  <ProfileAlertTitle>Perfil incompleto</ProfileAlertTitle>
                  <ProfileAlertText>
                    Sua conta ainda não possui um perfil de paciente vinculado.
                    Complete seu cadastro para realizar agendamentos.
                  </ProfileAlertText>
                  <ProfileAlertActions>
                    <ProfileAlertLink to="/portal/registro">
                      Completar cadastro
                    </ProfileAlertLink>
                    <ProfileAlertHelp>
                      <FaInfoCircle /> Se já tem cadastro, entre em contato com a clínica.
                    </ProfileAlertHelp>
                  </ProfileAlertActions>
                </div>
              </ProfileAlertBox>
            )}

            {error && (
              <ErrorBanner>
                <FaTimesCircle /> {error}
              </ErrorBanner>
            )}
            <SummaryBox>
              <SummaryRow>
                <SummaryIcon><FaUserMd /></SummaryIcon>
                <div>
                  <SummaryLabel>Dentista</SummaryLabel>
                  <SummaryValue>{selectedDentista?.name}</SummaryValue>
                </div>
              </SummaryRow>
              <SummaryRow>
                <SummaryIcon><FaStethoscope /></SummaryIcon>
                <div>
                  <SummaryLabel>Procedimento</SummaryLabel>
                  <SummaryValue>{selectedProc?.name}</SummaryValue>
                </div>
              </SummaryRow>
              <SummaryRow>
                <SummaryIcon><FaCalendarAlt /></SummaryIcon>
                <div>
                  <SummaryLabel>Data</SummaryLabel>
                  <SummaryValue>{selectedDate?.toLocaleDateString("pt-BR")}</SummaryValue>
                </div>
              </SummaryRow>
              <SummaryRow>
                <SummaryIcon><FaClock /></SummaryIcon>
                <div>
                  <SummaryLabel>Horário</SummaryLabel>
                  <SummaryValue>{selectedSlot}</SummaryValue>
                </div>
              </SummaryRow>
            </SummaryBox>
            <ObsTextarea
              placeholder="Observações (opcional) — ex: dor de dente, retorno..."
              value={obs}
              onChange={(e) => setObs(e.target.value)}
            />
          </>
        )}

        {/* Navigation */}
        <NavRow>
          <NavBtn
            variant="secondary"
            onClick={() => setStep((s) => (s - 1) as Step)}
            disabled={step === 1}
          >
            <FaArrowLeft /> Anterior
          </NavBtn>

          {step < 5 ? (
            <NavBtn
              onClick={() => setStep((s) => (s + 1) as Step)}
              disabled={!canNext[step]}
            >
              Próximo <FaArrowRight />
            </NavBtn>
          ) : (
            <NavBtn onClick={handleSubmit} disabled={loading}>
              {loading ? "Agendando..." : <><FaCheckCircle /> Confirmar Agendamento</>}
            </NavBtn>
          )}
        </NavRow>
      </StepCard>
    </PageWrapper>
  );
};

export default PortalAgendarPage;
