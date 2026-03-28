import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import api from "../../../../components/api/api";
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
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

interface ProcedimentoCompleto {
  id: number;
  nome: string;
  categoria: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  tempo_medio: number;
  dentista_mais_usado: string;
  ultima_realizacao: string;
  tendencia: "crescendo" | "estavel" | "diminuindo";
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
  proteticos: number;
}

interface DentistaEspecialidade {
  dentista: string;
  especialidade: string;
  total_procedimentos: number;
  valor_gerado: number;
  procedimento_favorito: string;
  eficiencia: number;
}

interface ProcedureCatalog {
  id: number;
  nome: string;
  categoria: string;
  valor: number;
  duracao: number;
}

interface SchedulingNormalized {
  id: number;
  date: string;
  status: "agendado" | "confirmado" | "em_atendimento" | "concluido" | "cancelado" | "falta";
  profissionalNome: string;
  profissionalEspecialidade: string;
  procedimentoId: number | null;
  procedimentoNome: string;
  procedimentoCategoria: string;
  procedimentoValor: number;
  procedimentoDuracao: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Preventivo: "#28a745",
  Restaurador: "#007bff",
  Cirurgico: "#dc3545",
  CirurgicoOral: "#dc3545",
  Ortodontia: "#ffc107",
  Protetico: "#6f42c1",
  Endodontia: "#fd7e14",
  Estetico: "#20c997",
  Outras: "#6c757d",
};

const toNumber = (value: unknown): number => {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
};

const removeAccents = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const normalizeCategory = (value: string): string => {
  const normalized = removeAccents(value || "").toLowerCase();
  if (normalized.includes("prevent")) return "Preventivo";
  if (normalized.includes("restaur")) return "Restaurador";
  if (normalized.includes("cirurg")) return "Cirurgico";
  if (normalized.includes("ortodont")) return "Ortodontia";
  if (normalized.includes("protet")) return "Protetico";
  if (normalized.includes("endo")) return "Endodontia";
  if (normalized.includes("estet")) return "Estetico";
  return value || "Outras";
};

const categoryToTrendKey = (category: string): keyof Omit<TendenciaData, "mes"> => {
  const normalized = normalizeCategory(category);
  if (normalized === "Preventivo") return "preventivos";
  if (normalized === "Restaurador") return "restauradores";
  if (normalized === "Cirurgico") return "cirurgicos";
  if (normalized === "Ortodontia") return "ortodonticos";
  return "proteticos";
};

const monthLabel = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${year}`;
};

const mapStatus = (status: string): SchedulingNormalized["status"] => {
  const s = (status || "").toLowerCase();
  if (s === "scheduled" || s === "agendado") return "agendado";
  if (s === "confirmed" || s === "confirmado") return "confirmado";
  if (s === "in_progress" || s === "em_atendimento") return "em_atendimento";
  if (s === "completed" || s === "concluido") return "concluido";
  if (s === "no_show" || s === "falta") return "falta";
  return "cancelado";
};

const normalizeProcedure = (item: any): ProcedureCatalog => ({
  id: toNumber(item?.id),
  nome: item?.name ?? item?.nome ?? "",
  categoria: normalizeCategory(item?.category ?? item?.categoria ?? "Outras"),
  valor: toNumber(item?.value ?? item?.valor ?? 0),
  duracao: toNumber(item?.time ?? item?.duracao ?? 0),
});

const normalizeScheduling = (
  item: any,
  procedureById: Map<number, ProcedureCatalog>,
  procedureByName: Map<string, ProcedureCatalog>
): SchedulingNormalized => {
  const procedureId = toNumber(item?.procedure_id ?? item?.procedimento_id ?? item?.procedimento?.id ?? 0);
  const rawName =
    item?.procedimento?.name ??
    item?.procedimento?.nome ??
    item?.procedure_name ??
    item?.procedimento ??
    "";

  const procedureFromId = procedureById.get(procedureId);
  const procedureFromName = procedureByName.get(String(rawName).trim().toLowerCase());
  const procedure = procedureFromId || procedureFromName;

  return {
    id: toNumber(item?.id),
    date: String(item?.date ?? item?.data ?? ""),
    status: mapStatus(String(item?.status ?? "")),
    profissionalNome: item?.profissional?.name ?? item?.professional_name ?? item?.dentista ?? "",
    profissionalEspecialidade:
      item?.profissional?.specialty ??
      item?.professional_specialty ??
      item?.profissional?.especialidade ??
      "",
    procedimentoId: procedure?.id ?? (procedureId > 0 ? procedureId : null),
    procedimentoNome: procedure?.nome ?? String(rawName || ""),
    procedimentoCategoria: procedure?.categoria ?? normalizeCategory(item?.procedimento?.category ?? item?.categoria ?? "Outras"),
    procedimentoValor: procedure?.valor ?? toNumber(item?.procedimento?.value ?? item?.valor ?? 0),
    procedimentoDuracao: procedure?.duracao ?? toNumber(item?.procedimento?.time ?? item?.duracao ?? 0),
  };
};

const formatDateIso = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("pt-BR");
};

const createDefaultFiltros = () => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);

  return {
    dataInicio: start.toISOString().slice(0, 10),
    dataFim: today.toISOString().slice(0, 10),
    categoria: "",
    dentista: "",
    ordenacao: "quantidade",
  };
};

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

const StyledButton = styled.button<{ variant?: "primary" | "success" | "info" | "warning" }>`
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

  ${({ variant = "primary" }) => {
    switch (variant) {
      case "success":
        return `background-color: #28a745; color: white; &:hover { background-color: #218838; }`;
      case "info":
        return `background-color: #17a2b8; color: white; &:hover { background-color: #138496; }`;
      case "warning":
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

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

const MessageBox = styled.div<{ kind: "error" | "info" }>`
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-weight: 600;
  border: 1px solid ${({ kind }) => (kind === "error" ? "#ef4444" : "#60a5fa")};
  color: ${({ kind }) => (kind === "error" ? "#b91c1c" : "#1e3a8a")};
  background: ${({ kind }) => (kind === "error" ? "#fee2e2" : "#dbeafe")};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div<{ color?: string; clickable?: boolean }>`
  padding: 25px;
  background: ${({ color = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }) => color};
  border-radius: 12px;
  color: white;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
  cursor: ${({ clickable }) => (clickable ? "pointer" : "default")};

  &:hover {
    transform: ${({ clickable }) => (clickable ? "translateY(-2px)" : "none")};
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

const EmptyState = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-weight: 600;
  text-align: center;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
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

  th,
  td {
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
      case "crescendo":
        return "#28a745";
      case "diminuindo":
        return "#dc3545";
      default:
        return "#6c757d";
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
    content: "";
    display: block;
    width: ${({ percentage }) => (percentage / 5) * 100}%;
    height: 100%;
    background: linear-gradient(90deg, #007bff 0%, #0056b3 100%);
    transition: width 0.3s ease;
  }
`;

export default function RelatorioProcedimentos() {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState(createDefaultFiltros());
  const [proceduresCatalog, setProceduresCatalog] = useState<ProcedureCatalog[]>([]);
  const [schedulings, setSchedulings] = useState<SchedulingNormalized[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    const [proceduresRes, schedulingsRes] = await Promise.allSettled([
      api.get("/procedures", { params: { per_page: 500 } }),
      api.get("/schedulings", {
        params: {
          per_page: 1000,
          date_start: filtros.dataInicio,
          date_end: filtros.dataFim,
        },
      }),
    ]);

    let procedures: ProcedureCatalog[] = [];
    if (proceduresRes.status === "fulfilled") {
      const rawList = Array.isArray(proceduresRes.value?.data)
        ? proceduresRes.value.data
        : Array.isArray(proceduresRes.value?.data?.data)
          ? proceduresRes.value.data.data
          : [];
      procedures = rawList.map(normalizeProcedure);
      setProceduresCatalog(procedures);
    } else {
      setProceduresCatalog([]);
      console.error("Erro ao carregar procedimentos:", proceduresRes.reason);
    }

    if (schedulingsRes.status === "fulfilled") {
      const byId = new Map<number, ProcedureCatalog>();
      const byName = new Map<string, ProcedureCatalog>();
      procedures.forEach((p) => {
        if (p.id > 0) byId.set(p.id, p);
        if (p.nome) byName.set(p.nome.trim().toLowerCase(), p);
      });

      const rawList = Array.isArray(schedulingsRes.value?.data)
        ? schedulingsRes.value.data
        : Array.isArray(schedulingsRes.value?.data?.data)
          ? schedulingsRes.value.data.data
          : [];

      const normalized = rawList.map((item: any) => normalizeScheduling(item, byId, byName));
      setSchedulings(normalized);
    } else {
      setSchedulings([]);
      setErrorMsg("Nao foi possivel carregar os dados do relatorio via API.");
      console.error("Erro ao carregar agendamentos:", schedulingsRes.reason);
    }

    setLoading(false);
  }, [filtros.dataInicio, filtros.dataFim]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const {
    procedimentosCompletos,
    categoriaData,
    tendenciaData,
    dentistaEspecialidades,
    totalProcedimentos,
    faturamentoTotal,
    tempoMedio,
    procedimentoMaisRealizado,
    hasData,
  } = useMemo(() => {
    const start = filtros.dataInicio ? new Date(`${filtros.dataInicio}T00:00:00`) : null;
    const end = filtros.dataFim ? new Date(`${filtros.dataFim}T23:59:59`) : null;

    const baseRecords = schedulings.filter((item) => {
      if (!item.procedimentoNome) return false;
      if (item.status !== "concluido") return false;

      const d = new Date(item.date);
      if (!Number.isNaN(d.getTime())) {
        if (start && d < start) return false;
        if (end && d > end) return false;
      }

      if (filtros.dentista && !item.profissionalNome.toLowerCase().includes(filtros.dentista.toLowerCase())) {
        return false;
      }

      if (filtros.categoria && normalizeCategory(item.procedimentoCategoria) !== filtros.categoria) {
        return false;
      }

      return true;
    });

    const grouped = new Map<
      string,
      {
        id: number;
        nome: string;
        categoria: string;
        quantidade: number;
        valorUnitario: number;
        valorTotal: number;
        tempoTotal: number;
        datas: Date[];
        dentistas: Record<string, number>;
      }
    >();

    baseRecords.forEach((r) => {
      const key = `${r.procedimentoId ?? 0}:${r.procedimentoNome}`;
      const categoria = normalizeCategory(r.procedimentoCategoria || "Outras");
      const current = grouped.get(key) || {
        id: r.procedimentoId ?? 0,
        nome: r.procedimentoNome,
        categoria,
        quantidade: 0,
        valorUnitario: r.procedimentoValor,
        valorTotal: 0,
        tempoTotal: 0,
        datas: [],
        dentistas: {},
      };

      current.quantidade += 1;
      current.valorTotal += r.procedimentoValor;
      current.tempoTotal += r.procedimentoDuracao;
      if (r.procedimentoValor > 0 && current.valorUnitario <= 0) current.valorUnitario = r.procedimentoValor;

      const d = new Date(r.date);
      if (!Number.isNaN(d.getTime())) current.datas.push(d);

      if (r.profissionalNome) {
        current.dentistas[r.profissionalNome] = (current.dentistas[r.profissionalNome] || 0) + 1;
      }

      grouped.set(key, current);
    });

    let procedimentos = Array.from(grouped.values()).map<ProcedimentoCompleto>((item) => {
      const sortedDates = [...item.datas].sort((a, b) => a.getTime() - b.getTime());
      const mid = Math.floor(sortedDates.length / 2) || 1;
      const firstHalf = sortedDates.slice(0, mid).length;
      const secondHalf = sortedDates.slice(mid).length;
      let tendencia: ProcedimentoCompleto["tendencia"] = "estavel";
      if (secondHalf > firstHalf) tendencia = "crescendo";
      if (secondHalf < firstHalf) tendencia = "diminuindo";

      const dentistaMaisUsado = Object.entries(item.dentistas).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
      const ultima = sortedDates.length > 0 ? formatDateIso(sortedDates[sortedDates.length - 1].toISOString()) : "-";

      return {
        id: item.id,
        nome: item.nome,
        categoria: item.categoria,
        quantidade: item.quantidade,
        valor_unitario: item.valorUnitario,
        valor_total: item.valorTotal,
        tempo_medio: item.quantidade > 0 ? item.tempoTotal / item.quantidade : 0,
        dentista_mais_usado: dentistaMaisUsado,
        ultima_realizacao: ultima,
        tendencia,
      };
    });

    if (filtros.ordenacao === "valor") {
      procedimentos = [...procedimentos].sort((a, b) => b.valor_total - a.valor_total);
    } else if (filtros.ordenacao === "nome") {
      procedimentos = [...procedimentos].sort((a, b) => a.nome.localeCompare(b.nome));
    } else {
      procedimentos = [...procedimentos].sort((a, b) => b.quantidade - a.quantidade);
    }

    const categoryMap = new Map<string, { quantidade: number; valor: number }>();
    procedimentos.forEach((p) => {
      const entry = categoryMap.get(p.categoria) || { quantidade: 0, valor: 0 };
      entry.quantidade += p.quantidade;
      entry.valor += p.valor_total;
      categoryMap.set(p.categoria, entry);
    });

    const categoriaDataList: CategoriaData[] = Array.from(categoryMap.entries()).map(([categoria, values]) => ({
      categoria,
      quantidade: values.quantidade,
      valor: values.valor,
      cor: CATEGORY_COLORS[categoria] || CATEGORY_COLORS.Outras,
    }));

    const months: TendenciaData[] = [];
    const now = new Date();
    for (let i = 4; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        mes: monthLabel(d),
        preventivos: 0,
        restauradores: 0,
        cirurgicos: 0,
        ortodonticos: 0,
        proteticos: 0,
      });
    }

    const monthIndex = new Map<string, number>();
    months.forEach((m, index) => monthIndex.set(m.mes, index));

    baseRecords.forEach((r) => {
      const d = new Date(r.date);
      if (Number.isNaN(d.getTime())) return;
      const label = monthLabel(new Date(d.getFullYear(), d.getMonth(), 1));
      const idx = monthIndex.get(label);
      if (idx === undefined) return;

      const key = categoryToTrendKey(r.procedimentoCategoria || "Outras");
      months[idx][key] += 1;
    });

    const dentistMap = new Map<
      string,
      {
        especialidade: string;
        total: number;
        valor: number;
        tempoTotal: number;
        procedimentos: Record<string, number>;
      }
    >();

    baseRecords.forEach((r) => {
      const key = r.profissionalNome || "Nao informado";
      const current = dentistMap.get(key) || {
        especialidade: r.profissionalEspecialidade || "Nao informado",
        total: 0,
        valor: 0,
        tempoTotal: 0,
        procedimentos: {},
      };

      current.total += 1;
      current.valor += r.procedimentoValor;
      current.tempoTotal += r.procedimentoDuracao;
      current.procedimentos[r.procedimentoNome] = (current.procedimentos[r.procedimentoNome] || 0) + 1;
      if (!current.especialidade && r.profissionalEspecialidade) current.especialidade = r.profissionalEspecialidade;

      dentistMap.set(key, current);
    });

    const dentistPerformance: DentistaEspecialidade[] = Array.from(dentistMap.entries())
      .map(([dentista, values]) => {
        const favorite = Object.entries(values.procedimentos).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
        const hours = values.tempoTotal > 0 ? values.tempoTotal / 60 : 0;
        const eficiencia = hours > 0 ? values.total / hours : 0;

        return {
          dentista,
          especialidade: values.especialidade || "Nao informado",
          total_procedimentos: values.total,
          valor_gerado: values.valor,
          procedimento_favorito: favorite,
          eficiencia,
        };
      })
      .sort((a, b) => b.valor_gerado - a.valor_gerado);

    const total = procedimentos.reduce((acc, p) => acc + p.quantidade, 0);
    const faturamento = procedimentos.reduce((acc, p) => acc + p.valor_total, 0);
    const tempo =
      procedimentos.length > 0
        ? procedimentos.reduce((acc, p) => acc + p.tempo_medio, 0) / procedimentos.length
        : 0;

    return {
      procedimentosCompletos: procedimentos,
      categoriaData: categoriaDataList,
      tendenciaData: months,
      dentistaEspecialidades: dentistPerformance,
      totalProcedimentos: total,
      faturamentoTotal: faturamento,
      tempoMedio: tempo,
      procedimentoMaisRealizado: procedimentos[0] ?? null,
      hasData: procedimentos.length > 0,
    };
  }, [filtros.categoria, filtros.dataFim, filtros.dataInicio, filtros.dentista, filtros.ordenacao, schedulings]);

  return (
    <PageWrapper>
      <MainContent>
        <Header>
          <Title>
            <FaToolbox />
            Relatorio de Procedimentos
          </Title>
          <Actions>
            <StyledButton variant="success" disabled={!hasData}>
              <FaDownload />
              Exportar Excel
            </StyledButton>
            <StyledButton variant="info" disabled={!hasData}>
              <FaPrint />
              Imprimir
            </StyledButton>
          </Actions>
        </Header>

        {errorMsg && <MessageBox kind="error">{errorMsg}</MessageBox>}
        {loading && <MessageBox kind="info">Carregando dados do banco via API...</MessageBox>}

        <FilterContainer>
          <div>
            <FilterLabel>Data Inicio:</FilterLabel>
            <FilterInput
              type="date"
              value={filtros.dataInicio}
              onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
            />
          </div>
          <div>
            <FilterLabel>Data Fim:</FilterLabel>
            <FilterInput
              type="date"
              value={filtros.dataFim}
              onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
            />
          </div>
          <div>
            <FilterLabel>Categoria:</FilterLabel>
            <FilterSelect
              value={filtros.categoria}
              onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
            >
              <option value="">Todas as Categorias</option>
              <option value="Preventivo">Preventivo</option>
              <option value="Restaurador">Restaurador</option>
              <option value="Cirurgico">Cirurgico</option>
              <option value="Ortodontia">Ortodontia</option>
              <option value="Protetico">Protetico</option>
              <option value="Endodontia">Endodontia</option>
              <option value="Estetico">Estetico</option>
            </FilterSelect>
          </div>
          <div>
            <FilterLabel>Dentista:</FilterLabel>
            <FilterInput
              type="text"
              placeholder="Todos os dentistas"
              value={filtros.dentista}
              onChange={(e) => setFiltros({ ...filtros, dentista: e.target.value })}
            />
          </div>
          <div>
            <FilterLabel>Ordenar por:</FilterLabel>
            <FilterSelect
              value={filtros.ordenacao}
              onChange={(e) => setFiltros({ ...filtros, ordenacao: e.target.value })}
            >
              <option value="quantidade">Quantidade</option>
              <option value="valor">Valor</option>
              <option value="nome">Nome</option>
            </FilterSelect>
          </div>
          <StyledButton variant="warning" onClick={loadData}>
            <FaFilter />
            Aplicar Filtros
          </StyledButton>
        </FilterContainer>

        <StatsGrid>
          <StatCard
            color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            clickable
            onClick={() => navigate("/dashboard/cadastros/procedimentos")}
            title="Ir para Cadastro de Procedimentos"
          >
            <StatHeader>
              <div>
                <StatValue>{totalProcedimentos}</StatValue>
                <StatLabel>Total de Procedimentos</StatLabel>
                <StatSubtext>{hasData ? "Dados reais do banco" : "Sem dados cadastrados"}</StatSubtext>
              </div>
              <StatIcon>
                <FaToolbox />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard
            color="linear-gradient(135deg, #28a745 0%, #20c997 100%)"
            clickable
            onClick={() => navigate("/dashboard/financeiro/contas-receber")}
            title="Ir para Financeiro - Contas a Receber"
          >
            <StatHeader>
              <div>
                <StatValue>R$ {faturamentoTotal.toLocaleString("pt-BR")}</StatValue>
                <StatLabel>Faturamento Total</StatLabel>
                <StatSubtext>{hasData ? "Com base em procedimentos concluidos" : "Aguardando registros"}</StatSubtext>
              </div>
              <StatIcon>
                <FaDollarSign />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard
            color="linear-gradient(135deg, #17a2b8 0%, #138496 100%)"
            clickable
            onClick={() => navigate("/dashboard/agendamentos")}
            title="Ir para modulo de Agendamentos"
          >
            <StatHeader>
              <div>
                <StatValue>{Math.round(tempoMedio)} min</StatValue>
                <StatLabel>Tempo Medio</StatLabel>
                <StatSubtext>{hasData ? "Por procedimento concluido" : "Sem base para calculo"}</StatSubtext>
              </div>
              <StatIcon>
                <FaClock />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard
            color="linear-gradient(135deg, #ffc107 0%, #f39c12 100%)"
            clickable
            onClick={() => navigate("/dashboard/cadastros/procedimentos")}
            title="Ir para Cadastro de Procedimentos"
          >
            <StatHeader>
              <div>
                <StatValue>{procedimentoMaisRealizado?.quantidade ?? 0}</StatValue>
                <StatLabel>Mais Realizado</StatLabel>
                <StatSubtext>{procedimentoMaisRealizado?.nome ?? "Sem dados"}</StatSubtext>
              </div>
              <StatIcon>
                <FaChartLine />
              </StatIcon>
            </StatHeader>
          </StatCard>
        </StatsGrid>

        <ChartsContainer>
          <ChartCard>
            <ChartTitle>
              <FaChartPie />
              Distribuicao por Categoria
            </ChartTitle>
            {categoriaData.length === 0 ? (
              <EmptyState>Sem dados de procedimentos concluidos para o periodo.</EmptyState>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoriaData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="quantidade"
                    label={({ categoria, percent }) => {
                      const percentage = percent ? (percent * 100).toFixed(1) : "0.0";
                      return `${categoria || "N/A"} (${percentage}%)`;
                    }}
                  >
                    {categoriaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Quantidade"]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard>
            <ChartTitle>
              <FaChartLine />
              Tendencia dos Procedimentos (5 meses)
            </ChartTitle>
            {!hasData ? (
              <EmptyState>Sem dados para gerar tendencia no periodo informado.</EmptyState>
            ) : (
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
                  <Area type="monotone" dataKey="proteticos" stackId="1" stroke="#6f42c1" fill="#6f42c1" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            )}
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
                  <th>Tempo Medio</th>
                  <th>Dentista Principal</th>
                  <th>Tendencia</th>
                  <th>Ultima Realizacao</th>
                </tr>
              </thead>
              <tbody>
                {procedimentosCompletos.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", color: "#6b7280", fontWeight: 600 }}>
                      Nenhum procedimento encontrado. O relatorio comeca a ser gerado apos cadastro e conclusao via API.
                    </td>
                  </tr>
                ) : (
                  procedimentosCompletos.map((procedimento) => (
                    <tr key={`${procedimento.id}-${procedimento.nome}`}>
                      <td>
                        <strong>{procedimento.nome}</strong>
                      </td>
                      <td>{procedimento.categoria}</td>
                      <td>{procedimento.quantidade}</td>
                      <td>R$ {procedimento.valor_unitario.toLocaleString("pt-BR")}</td>
                      <td>
                        <strong>R$ {procedimento.valor_total.toLocaleString("pt-BR")}</strong>
                      </td>
                      <td>{Math.round(procedimento.tempo_medio)} min</td>
                      <td>{procedimento.dentista_mais_usado}</td>
                      <td>
                        {procedimento.tendencia === "crescendo" ? "▲" : procedimento.tendencia === "diminuindo" ? "▼" : "="}
                        <TrendIcon trend={procedimento.tendencia}>
                          {procedimento.tendencia === "crescendo"
                            ? "Crescendo"
                            : procedimento.tendencia === "diminuindo"
                              ? "Diminuindo"
                              : "Estavel"}
                        </TrendIcon>
                      </td>
                      <td>{procedimento.ultima_realizacao}</td>
                    </tr>
                  ))
                )}
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
                  <th>Eficiencia</th>
                </tr>
              </thead>
              <tbody>
                {dentistaEspecialidades.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "#6b7280", fontWeight: 600 }}>
                      Sem dados de performance para o periodo selecionado.
                    </td>
                  </tr>
                ) : (
                  dentistaEspecialidades.map((dentista, index) => (
                    <tr key={`${dentista.dentista}-${index}`}>
                      <td>
                        <strong>{dentista.dentista}</strong>
                      </td>
                      <td>{dentista.especialidade}</td>
                      <td>{dentista.total_procedimentos}</td>
                      <td>
                        <strong>R$ {dentista.valor_gerado.toLocaleString("pt-BR")}</strong>
                      </td>
                      <td>{dentista.procedimento_favorito}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>{dentista.eficiencia.toFixed(1)}/h</span>
                          <EficienciaBar percentage={dentista.eficiencia} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </TableCard>
        </TableContainer>
      </MainContent>
    </PageWrapper>
  );
}
