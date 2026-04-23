import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import api from "../../../../components/api/api";

interface Dentista {
  id: number;
  name: string;
  email?: string | null;
  telefone?: string | null;
  celular?: string | null;
  cpf?: string | null;
  cro: string;
  cro_uf: string;
  especialidade: string;
  intervalo_consulta?: number;
  horarios_atendimento?: HorarioAtendimento[] | null;
  cidade?: string | null;
  estado?: string | null;
  status: boolean;
}

interface DentistaForm {
  name: string;
  email: string;
  telefone: string;
  celular: string;
  cro: string;
  cro_uf: string;
  especialidade: string;
  intervalo_consulta: number;
  horarios_atendimento: HorarioAtendimento[];
  status: boolean;
}

type DiaSemana = "segunda" | "terca" | "quarta" | "quinta" | "sexta" | "sabado" | "domingo";

interface HorarioAtendimento {
  dia_semana: DiaSemana;
  ativo: boolean;
  hora_inicio: string;
  hora_fim: string;
}

const DIAS_SEMANA: { key: DiaSemana; label: string }[] = [
  { key: "segunda", label: "Segunda" },
  { key: "terca", label: "Terca" },
  { key: "quarta", label: "Quarta" },
  { key: "quinta", label: "Quinta" },
  { key: "sexta", label: "Sexta" },
  { key: "sabado", label: "Sabado" },
  { key: "domingo", label: "Domingo" },
];

const defaultHorarios = (): HorarioAtendimento[] =>
  DIAS_SEMANA.map((dia) => ({
    dia_semana: dia.key,
    ativo: ["segunda", "terca", "quarta", "quinta", "sexta"].includes(dia.key),
    hora_inicio: "08:00",
    hora_fim: "18:00",
  }));

const normalizeHorarios = (value?: HorarioAtendimento[] | null): HorarioAtendimento[] => {
  if (!Array.isArray(value)) {
    return defaultHorarios();
  }

  const byDay = new Map<DiaSemana, HorarioAtendimento>();
  value.forEach((item) => {
    if (!item?.dia_semana) return;
    byDay.set(item.dia_semana, {
      dia_semana: item.dia_semana,
      ativo: Boolean(item.ativo),
      hora_inicio: item.hora_inicio || "08:00",
      hora_fim: item.hora_fim || "18:00",
    });
  });

  return DIAS_SEMANA.map((dia) => byDay.get(dia.key) || {
    dia_semana: dia.key,
    ativo: false,
    hora_inicio: "08:00",
    hora_fim: "18:00",
  });
};

const dentistaToForm = (dentista: Dentista): DentistaForm => ({
  name: dentista.name || "",
  email: dentista.email || "",
  telefone: dentista.telefone || "",
  celular: dentista.celular || "",
  cro: dentista.cro || "",
  cro_uf: dentista.cro_uf || "",
  especialidade: dentista.especialidade || "",
  intervalo_consulta: dentista.intervalo_consulta || 30,
  horarios_atendimento: normalizeHorarios(dentista.horarios_atendimento),
  status: Boolean(dentista.status),
});

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
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const StyledButton = styled.button<{ color?: string; hoverColor?: string }>`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: ${(props) => props.color || "#007bff"};
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.hoverColor || "#0056b3"};
  }
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
  margin: 0;
`;

const Info = styled.div`
  color: #6c757d;
  font-size: 14px;
`;

const Alert = styled.div<{ variant: "error" | "info" }>`
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 16px;
  font-size: 14px;
  ${(props) =>
    props.variant === "error"
      ? `background: #fde8e8; color: #9b1c1c; border: 1px solid #f8b4b4;`
      : `background: #eff6ff; color: #1e429f; border: 1px solid #bfdbfe;`}
`;

const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 860px;

  th,
  td {
    border: 1px solid #e5e7eb;
    padding: 10px;
    text-align: left;
    font-size: 14px;
  }

  th {
    background: #f8fafc;
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  tr:nth-child(even) {
    background: #fafafa;
  }

  th:last-child,
  td:last-child {
    width: 260px;
    min-width: 260px;
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ActionButton = styled(StyledButton)`
  padding: 6px 10px;
  font-size: 12px;
`;

const StatusTag = styled.span<{ active: boolean }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  ${(props) =>
    props.active
      ? `background: #dcfce7; color: #166534;`
      : `background: #fee2e2; color: #991b1b;`}
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  width: 90%;
  max-width: 700px;
  max-height: 85vh;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 13px;
    color: #374151;
    font-weight: 600;
  }

  input,
  select {
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 10px;
    font-size: 14px;
    outline: none;
  }

  input:focus,
  select:focus {
    border-color: #2563eb;
  }
`;

const ModalActions = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ScheduleSection = styled.div`
  margin-top: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 14px;
`;

const ScheduleTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 16px;
  color: #374151;
`;

const ScheduleRow = styled.div`
  display: grid;
  grid-template-columns: 130px 90px 1fr 1fr;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;

  input[type="time"] {
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 10px;
    font-size: 14px;
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const DayLabel = styled.span`
  font-weight: 600;
  color: #374151;
  font-size: 14px;
`;

const DetailsGrid = styled.div`
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const DetailItem = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px;
  background: #f8fafc;

  strong {
    display: block;
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 4px;
  }

  span {
    font-size: 14px;
    color: #111827;
  }
`;

const DentistasPage: React.FC = () => {
  const [dentistas, setDentistas] = useState<Dentista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedDentista, setSelectedDentista] = useState<Dentista | null>(null);
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [estados, setEstados] = useState<string[]>([]);
  const [form, setForm] = useState<DentistaForm>({
    name: "",
    email: "",
    telefone: "",
    celular: "",
    cro: "",
    cro_uf: "",
    especialidade: "",
    intervalo_consulta: 30,
    horarios_atendimento: defaultHorarios(),
    status: true,
  });

  const loadDentistas = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/pessoas/dentistas", {
        headers: { Accept: "application/json" },
      });

      const payload = response?.data;
      const list = Array.isArray(payload) ? payload : payload?.data;
      setDentistas(Array.isArray(list) ? list : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Nao foi possivel carregar a lista de dentistas.");
    } finally {
      setLoading(false);
    }
  };

  const loadDentistaById = async (id: number): Promise<Dentista | null> => {
    try {
      const response = await api.get(`/pessoas/dentistas/${id}`, {
        headers: { Accept: "application/json" },
      });
      return response?.data || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    loadDentistas();

    api
      .get("/pessoas/dentistas/reference/especialidades", { headers: { Accept: "application/json" } })
      .then((res) => setEspecialidades(Array.isArray(res?.data?.especialidades) ? res.data.especialidades : []))
      .catch(() => setEspecialidades([]));

    api
      .get("/pessoas/dentistas/reference/estados", { headers: { Accept: "application/json" } })
      .then((res) => setEstados(Array.isArray(res?.data?.estados) ? res.data.estados : []))
      .catch(() => setEstados([]));
  }, []);

  const totalAtivos = useMemo(() => dentistas.filter((d) => Boolean(d.status)).length, [dentistas]);

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      telefone: "",
      celular: "",
      cro: "",
      cro_uf: "",
      especialidade: "",
      intervalo_consulta: 30,
      horarios_atendimento: defaultHorarios(),
      status: true,
    });
  };

  const updateHorario = (dia: DiaSemana, patch: Partial<HorarioAtendimento>) => {
    setForm((prev) => ({
      ...prev,
      horarios_atendimento: prev.horarios_atendimento.map((item) =>
        item.dia_semana === dia ? { ...item, ...patch } : item
      ),
    }));
  };

  const handleAddDentista = async () => {
    if (!form.name || !form.cro || !form.cro_uf || !form.especialidade) {
      setError("Preencha Nome, CRO, UF do CRO e Especialidade.");
      return;
    }

    const horarioInvalido = form.horarios_atendimento.some(
      (item) => item.ativo && item.hora_inicio >= item.hora_fim
    );

    if (horarioInvalido) {
      setError("Nos horarios ativos, a hora final deve ser maior que a hora inicial.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await api.post("/pessoas/dentistas", form, {
        headers: { Accept: "application/json" },
      });

      setShowAddModal(false);
      resetForm();
      await loadDentistas();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Nao foi possivel cadastrar o dentista.");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDados = async (dentista: Dentista) => {
    setActionLoading(true);
    setError(null);
    try {
      const completo = await loadDentistaById(dentista.id);
      setSelectedDentista(completo || dentista);
      setShowDetailsModal(true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenEditar = async (dentista: Dentista) => {
    setActionLoading(true);
    setError(null);
    try {
      const completo = await loadDentistaById(dentista.id);
      const alvo = completo || dentista;
      setSelectedDentista(alvo);
      setForm(dentistaToForm(alvo));
      setShowEditModal(true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateDentista = async () => {
    if (!selectedDentista) return;

    if (!form.name || !form.cro || !form.cro_uf || !form.especialidade) {
      setError("Preencha Nome, CRO, UF do CRO e Especialidade.");
      return;
    }

    const horarioInvalido = form.horarios_atendimento.some(
      (item) => item.ativo && item.hora_inicio >= item.hora_fim
    );

    if (horarioInvalido) {
      setError("Nos horarios ativos, a hora final deve ser maior que a hora inicial.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await api.put(`/pessoas/dentistas/${selectedDentista.id}`, form, {
        headers: { Accept: "application/json" },
      });

      setShowEditModal(false);
      setSelectedDentista(null);
      resetForm();
      await loadDentistas();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Nao foi possivel atualizar o dentista.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDentista = async (dentista: Dentista) => {
    const confirmou = window.confirm(`Deseja realmente excluir o dentista ${dentista.name}?`);
    if (!confirmou) return;

    try {
      setActionLoading(true);
      setError(null);
      await api.delete(`/pessoas/dentistas/${dentista.id}`, {
        headers: { Accept: "application/json" },
      });
      await loadDentistas();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Nao foi possivel excluir o dentista.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <MainContent>
      <Header>
        <Title>Lista de Dentistas</Title>
        <HeaderActions>
          <Info>Total: {dentistas.length} | Ativos: {totalAtivos}</Info>
          <StyledButton color="#007bff" hoverColor="#0056b3" onClick={() => setShowAddModal(true)}>
            + Adicionar Dentista
          </StyledButton>
        </HeaderActions>
      </Header>

      {loading && <Alert variant="info">Carregando dentistas...</Alert>}
      {error && <Alert variant="error">{error}</Alert>}

      {!loading && !error && dentistas.length === 0 && (
        <Alert variant="info">Nenhum dentista cadastrado ainda.</Alert>
      )}

      {!loading && !error && dentistas.length > 0 && (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Especialidade</th>
                <th>CRO</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {dentistas.map((dentista) => (
                <tr key={dentista.id}>
                  <td>{dentista.id}</td>
                  <td>{dentista.name}</td>
                  <td>{dentista.especialidade || "-"}</td>
                  <td>
                    {dentista.cro}
                    {dentista.cro_uf ? `/${dentista.cro_uf}` : ""}
                  </td>
                  <td>{dentista.telefone || dentista.celular || "-"}</td>
                  <td>{dentista.email || "-"}</td>
                  <td>
                    <StatusTag active={Boolean(dentista.status)}>
                      {dentista.status ? "Ativo" : "Inativo"}
                    </StatusTag>
                  </td>
                  <td>
                    <ActionButtonsContainer>
                      <ActionButton
                        color="#0284c7"
                        hoverColor="#0369a1"
                        onClick={() => handleOpenDados(dentista)}
                        disabled={actionLoading}
                      >
                        Dados
                      </ActionButton>
                      <ActionButton
                        color="#d97706"
                        hoverColor="#b45309"
                        onClick={() => handleOpenEditar(dentista)}
                        disabled={actionLoading}
                      >
                        Editar
                      </ActionButton>
                      <ActionButton
                        color="#dc2626"
                        hoverColor="#b91c1c"
                        onClick={() => handleDeleteDentista(dentista)}
                        disabled={actionLoading}
                      >
                        Excluir
                      </ActionButton>
                    </ActionButtonsContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}

      {(showAddModal || showEditModal) && (
        <>
          <ModalOverlay
            onClick={() => {
              setShowAddModal(false);
              setShowEditModal(false);
            }}
          />
          <ModalContent>
            <Title style={{ fontSize: "20px" }}>{showEditModal ? "Editar Dentista" : "Adicionar Dentista"}</Title>

            <FormGrid>
              <Field>
                <label>Nome *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome completo"
                />
              </Field>

              <Field>
                <label>Especialidade *</label>
                <select
                  value={form.especialidade}
                  onChange={(e) => setForm((prev) => ({ ...prev, especialidade: e.target.value }))}
                >
                  <option value="">Selecione</option>
                  {especialidades.map((esp) => (
                    <option key={esp} value={esp}>
                      {esp}
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <label>CRO *</label>
                <input
                  value={form.cro}
                  onChange={(e) => setForm((prev) => ({ ...prev, cro: e.target.value }))}
                  placeholder="Ex: 12345"
                />
              </Field>

              <Field>
                <label>UF CRO *</label>
                <select
                  value={form.cro_uf}
                  onChange={(e) => setForm((prev) => ({ ...prev, cro_uf: e.target.value }))}
                >
                  <option value="">Selecione</option>
                  {estados.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </Field>

              <Field>
                <label>Telefone</label>
                <input
                  value={form.telefone}
                  onChange={(e) => setForm((prev) => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </Field>

              <Field>
                <label>Celular</label>
                <input
                  value={form.celular}
                  onChange={(e) => setForm((prev) => ({ ...prev, celular: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </Field>

              <Field>
                <label>Status</label>
                <select
                  value={String(form.status)}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value === "true" }))}
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </Field>

              <Field>
                <label>Intervalo da consulta (min)</label>
                <input
                  type="number"
                  min={5}
                  max={240}
                  step={5}
                  value={form.intervalo_consulta}
                  onChange={(e) => setForm((prev) => ({ ...prev, intervalo_consulta: Number(e.target.value) || 30 }))}
                />
              </Field>
            </FormGrid>

            <ScheduleSection>
              <ScheduleTitle>Horarios de atendimento</ScheduleTitle>
              {form.horarios_atendimento.map((horario) => (
                <ScheduleRow key={horario.dia_semana}>
                  <DayLabel>{DIAS_SEMANA.find((d) => d.key === horario.dia_semana)?.label}</DayLabel>

                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
                    <input
                      type="checkbox"
                      checked={horario.ativo}
                      onChange={(e) => updateHorario(horario.dia_semana, { ativo: e.target.checked })}
                    />
                    Atende
                  </label>

                  <input
                    type="time"
                    step={1800}
                    value={horario.hora_inicio}
                    disabled={!horario.ativo}
                    onChange={(e) => updateHorario(horario.dia_semana, { hora_inicio: e.target.value })}
                  />

                  <input
                    type="time"
                    step={1800}
                    value={horario.hora_fim}
                    disabled={!horario.ativo}
                    onChange={(e) => updateHorario(horario.dia_semana, { hora_fim: e.target.value })}
                  />
                </ScheduleRow>
              ))}
            </ScheduleSection>

            <ModalActions>
              <StyledButton
                color="#6b7280"
                hoverColor="#4b5563"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  resetForm();
                  setSelectedDentista(null);
                }}
              >
                Cancelar
              </StyledButton>
              <StyledButton
                color="#16a34a"
                hoverColor="#15803d"
                onClick={showEditModal ? handleUpdateDentista : handleAddDentista}
              >
                {saving ? "Salvando..." : "Salvar"}
              </StyledButton>
            </ModalActions>
          </ModalContent>
        </>
      )}

      {showDetailsModal && selectedDentista && (
        <>
          <ModalOverlay
            onClick={() => {
              setShowDetailsModal(false);
              setSelectedDentista(null);
            }}
          />
          <ModalContent>
            <Title style={{ fontSize: "20px" }}>Dados do Dentista</Title>

            <DetailsGrid>
              <DetailItem>
                <strong>Nome</strong>
                <span>{selectedDentista.name || "-"}</span>
              </DetailItem>
              <DetailItem>
                <strong>Especialidade</strong>
                <span>{selectedDentista.especialidade || "-"}</span>
              </DetailItem>
              <DetailItem>
                <strong>CRO</strong>
                <span>{selectedDentista.cro}/{selectedDentista.cro_uf}</span>
              </DetailItem>
              <DetailItem>
                <strong>Telefone</strong>
                <span>{selectedDentista.telefone || selectedDentista.celular || "-"}</span>
              </DetailItem>
              <DetailItem>
                <strong>Email</strong>
                <span>{selectedDentista.email || "-"}</span>
              </DetailItem>
              <DetailItem>
                <strong>Status</strong>
                <span>{selectedDentista.status ? "Ativo" : "Inativo"}</span>
              </DetailItem>
              <DetailItem>
                <strong>Cidade/UF</strong>
                <span>
                  {selectedDentista.cidade || "-"}
                  {selectedDentista.estado ? `/${selectedDentista.estado}` : ""}
                </span>
              </DetailItem>
              <DetailItem>
                <strong>Intervalo Consulta</strong>
                <span>{selectedDentista.intervalo_consulta || 30} min</span>
              </DetailItem>
            </DetailsGrid>

            <ScheduleSection>
              <ScheduleTitle>Horarios de atendimento</ScheduleTitle>
              {normalizeHorarios(selectedDentista.horarios_atendimento).map((horario) => (
                <ScheduleRow key={horario.dia_semana}>
                  <DayLabel>{DIAS_SEMANA.find((d) => d.key === horario.dia_semana)?.label}</DayLabel>
                  <span>{horario.ativo ? "Atende" : "Nao atende"}</span>
                  <span>{horario.hora_inicio}</span>
                  <span>{horario.hora_fim}</span>
                </ScheduleRow>
              ))}
            </ScheduleSection>

            <ModalActions>
              <StyledButton
                color="#6b7280"
                hoverColor="#4b5563"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedDentista(null);
                }}
              >
                Fechar
              </StyledButton>
            </ModalActions>
          </ModalContent>
        </>
      )}
    </MainContent>
  );
};

export default DentistasPage;
