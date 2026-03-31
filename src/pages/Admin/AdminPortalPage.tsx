import React, { useCallback, useEffect, useState } from "react";
import {
  FiBarChart2,
  FiCheckCircle,
  FiChevronDown,
  FiChevronRight,
  FiDollarSign,
  FiEdit2,
  FiFileText,
  FiGrid,
  FiLayers,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../../components/api/api";
import "./AdminPortalPage.css";

type MenuItem = {
  id: string;
  label: string;
  children?: Array<{ id: string; label: string }>;
};

type DashboardMetrics = {
  patientsTotal: number;
  receitaMensal: number;
  saldoMes: number;
  agendamentosHoje: number;
};

type FinanceiroResumo = {
  totalAPagar: number;
  totalAReceber: number;
  saldoAtual: number;
};

type ChartPoint = {
  dia: string;
  total: number;
};

type MensalidadeStatus = "em_dia" | "atrasada" | "inadimplente" | "suspensa";
type InadimplenciaRisk = "baixo" | "medio" | "alto";
type SolicitacaoStatus = "pendente" | "aguardando_pagamento" | "aprovada" | "rejeitada";

type MonthlyClinicRow = {
  clinica: string;
  planoId: string;
  planoLabel: string;
  valorMensal: number;
  totalUsuarios: number;
  usuariosAtivos: number;
  proximoVencimento: string;
  status: MensalidadeStatus;
};

type InadimplenciaRow = {
  clinica: string;
  planoId: string;
  planoLabel: string;
  proximoVencimento: string;
  diasEmAtraso: number;
  nivelRisco: InadimplenciaRisk;
  valorEmAberto: number;
  status: MensalidadeStatus;
};

type ClinicRow = {
  clinica: string;
  responsavel: string;
  email: string;
  telefone: string;
  planoId: string;
  planoLabel: string;
  status: MensalidadeStatus;
  valorMensal: number;
  usuariosAtivos: number;
  totalUsuarios: number;
  ultimoLoginEm: string;
  cadastradoEm: string;
};

type SolicitacaoRow = {
  id: number;
  nomeClinica: string;
  responsavel: string;
  email: string;
  telefone: string;
  planoId: string;
  planoNome: string;
  valorMensal: number;
  status: SolicitacaoStatus;
  pagamentoConfirmado: boolean;
  dataPagamento: string;
  motivoRejeicao: string;
};

type SaaSPlan = {
  id: string;
  label: string;
  price: number;
  period: string;
  description: string;
  features: Array<{ text: string; included: boolean }>;
  limits: { usuarios: number | string; lojas: number; armazenamentoGb: number };
};

type PlanFormState = {
  nome: string;
  valorPlano: number;
  duracao: "Mes" | "Ano";
  maximoClinicas: number;
  maximoUsuarios: string;
  armazenamentoGb: number;
  portalPaciente: boolean;
  financeiroCompleto: boolean;
  relatoriosAvancados: boolean;
  suportePrioritario: boolean;
  descricao: string;
};

const currency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);

const shortDate = (date?: string) => {
  if (!date) return "--";
  return new Date(date).toLocaleDateString("pt-BR");
};

const shortDateTime = (date?: string) => {
  if (!date) return "--";
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR");
};

const statusLabel: Record<string, string> = {
  em_dia: "Em dia",
  atrasada: "Atrasada",
  inadimplente: "Inadimplente",
  suspensa: "Suspensa",
  pendente: "Pendente",
  aguardando_pagamento: "Aguardando pagamento",
  aprovada: "Aprovada",
  rejeitada: "Rejeitada",
};

const riskLabel: Record<InadimplenciaRisk, string> = {
  baixo: "Baixo",
  medio: "Medio",
  alto: "Alto",
};

const SAAS_PLANS: SaaSPlan[] = [
  {
    id: "basico",
    label: "BASICO",
    price: 70,
    period: "Mes",
    description: "Plano para clinicas iniciando no SaaS.",
    features: [
      { text: "Agenda e cadastro basico", included: true },
      { text: "Financeiro essencial", included: true },
      { text: "Portal do paciente", included: true },
      { text: "Relatorios avancados", included: false },
      { text: "Suporte prioritario", included: false },
    ],
    limits: { usuarios: 1, lojas: 1, armazenamentoGb: 20 },
  },
  {
    id: "profissional",
    label: "PROFISSIONAL",
    price: 90,
    period: "Mes",
    description: "Plano para crescimento com equipe maior.",
    features: [
      { text: "Agenda e cadastro completo", included: true },
      { text: "Financeiro completo", included: true },
      { text: "Portal do paciente", included: true },
      { text: "Relatorios avancados", included: true },
      { text: "Suporte prioritario", included: false },
    ],
    limits: { usuarios: 8, lojas: 2, armazenamentoGb: 20 },
  },
  {
    id: "premium",
    label: "PREMIUM",
    price: 160,
    period: "Mes",
    description: "Plano completo com escala e suporte premium.",
    features: [
      { text: "Agenda e cadastro completo", included: true },
      { text: "Financeiro completo", included: true },
      { text: "Portal do paciente", included: true },
      { text: "Relatorios avancados", included: true },
      { text: "Suporte prioritario", included: true },
    ],
    limits: { usuarios: "Ilimitados", lojas: 3, armazenamentoGb: 20 },
  },
];

const buildPlanForm = (plan: SaaSPlan): PlanFormState => ({
  nome: plan.label,
  valorPlano: Number(plan.price || 0),
  duracao: plan.period === "Ano" ? "Ano" : "Mes",
  maximoClinicas: Number(plan.limits.lojas || 0),
  maximoUsuarios: String(plan.limits.usuarios),
  armazenamentoGb: Number(plan.limits.armazenamentoGb || 0),
  portalPaciente: plan.features.some((f) => f.text.toLowerCase().includes("portal do paciente") && f.included),
  financeiroCompleto: plan.features.some((f) => f.text.toLowerCase().includes("financeiro") && f.included),
  relatoriosAvancados: plan.features.some((f) => f.text.toLowerCase().includes("relatorios") && f.included),
  suportePrioritario: plan.features.some((f) => f.text.toLowerCase().includes("suporte") && f.included),
  descricao: plan.description,
});

const menuItems: MenuItem[] = [
  { id: "painel", label: "Painel" },
  {
    id: "assinaturas",
    label: "Assinaturas",
    children: [
      { id: "planos", label: "Planos" },
      { id: "mensalidades", label: "Mensalidades" },
      { id: "inadimplencia", label: "Inadimplencia" },
    ],
  },
  {
    id: "clientes",
    label: "Clientes",
    children: [
      { id: "clinicas", label: "Clinicas" },
      { id: "solicitacoes", label: "Solicitacoes" },
    ],
  },
];

const AdminPortalPage: React.FC = () => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string>("painel");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [metrics, setMetrics] = useState<DashboardMetrics>({
    patientsTotal: 0,
    receitaMensal: 0,
    saldoMes: 0,
    agendamentosHoje: 0,
  });
  const [financeiroResumo, setFinanceiroResumo] = useState<FinanceiroResumo>({
    totalAPagar: 0,
    totalAReceber: 0,
    saldoAtual: 0,
  });
  const [chartData, setChartData] = useState<ChartPoint[]>([
    { dia: "Seg", total: 0 },
    { dia: "Ter", total: 0 },
    { dia: "Qua", total: 0 },
    { dia: "Qui", total: 0 },
    { dia: "Sex", total: 0 },
    { dia: "Sab", total: 0 },
    { dia: "Dom", total: 0 },
  ]);

  const [mensalidades, setMensalidades] = useState<MonthlyClinicRow[]>([]);
  const [mensalidadeSearch, setMensalidadeSearch] = useState("");
  const [mensalidadePlano, setMensalidadePlano] = useState("");
  const [mensalidadeStatus, setMensalidadeStatus] = useState("");
  const [mensalidadePage, setMensalidadePage] = useState(1);
  const [mensalidadeLastPage, setMensalidadeLastPage] = useState(1);
  const [mensalidadeTotal, setMensalidadeTotal] = useState(0);
  const [mensalidadesLoading, setMensalidadesLoading] = useState(false);

  const [inadimplencias, setInadimplencias] = useState<InadimplenciaRow[]>([]);
  const [inadimplenciaSearch, setInadimplenciaSearch] = useState("");
  const [inadimplenciaPlano, setInadimplenciaPlano] = useState("");
  const [inadimplenciaStatus, setInadimplenciaStatus] = useState("");
  const [inadimplenciaPage, setInadimplenciaPage] = useState(1);
  const [inadimplenciaLastPage, setInadimplenciaLastPage] = useState(1);
  const [inadimplenciaTotal, setInadimplenciaTotal] = useState(0);
  const [inadimplenciaLoading, setInadimplenciaLoading] = useState(false);
  const [inadimplenciaSummary, setInadimplenciaSummary] = useState({
    totalClinicas: 0,
    totalAtrasadas: 0,
    totalInadimplentes: 0,
    valorTotalEmAberto: 0,
  });

  const [clinicas, setClinicas] = useState<ClinicRow[]>([]);
  const [clinicasLoading, setClinicasLoading] = useState(false);
  const [clinicasSearch, setClinicasSearch] = useState("");
  const [clinicasPlano, setClinicasPlano] = useState("");
  const [clinicasStatus, setClinicasStatus] = useState("");
  const [clinicasPage, setClinicasPage] = useState(1);
  const [clinicasLastPage, setClinicasLastPage] = useState(1);
  const [clinicasTotal, setClinicasTotal] = useState(0);
  const [clinicasSummary, setClinicasSummary] = useState({
    totalClinicas: 0,
    totalAtivas: 0,
    totalComRisco: 0,
    totalSuspensas: 0,
  });

  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoRow[]>([]);
  const [solicitacoesLoading, setSolicitacoesLoading] = useState(false);
  const [solicitacoesSearch, setSolicitacoesSearch] = useState("");
  const [solicitacoesStatus, setSolicitacoesStatus] = useState("");
  const [solicitacoesPlano, setSolicitacoesPlano] = useState("");
  const [solicitacoesPage, setSolicitacoesPage] = useState(1);
  const [solicitacoesLastPage, setSolicitacoesLastPage] = useState(1);
  const [solicitacoesTotal, setSolicitacoesTotal] = useState(0);
  const [solicitacoesSummary, setSolicitacoesSummary] = useState({
    total: 0,
    totalPendentes: 0,
    totalAguardando: 0,
    totalAprovadas: 0,
    totalRejeitadas: 0,
    aprovadasHoje: 0,
  });
  const [solicitacaoAcao, setSolicitacaoAcao] = useState<{
    id: number;
    tipo: "aprovar" | "rejeitar" | "pagamento";
    nome: string;
  } | null>(null);
  const [motivoRejeicao, setMotivoRejeicao] = useState("");
  const [acaoLoading, setAcaoLoading] = useState(false);
  const [acaoMsg, setAcaoMsg] = useState("");
  const [planoSelecionado, setPlanoSelecionado] = useState<SaaSPlan | null>(null);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planForm, setPlanForm] = useState<PlanFormState>(() => buildPlanForm(SAAS_PLANS[0]));

  const isPlanosView = activeItem === "planos";
  const isMensalidadesView = activeItem === "mensalidades";
  const isInadimplenciaView = activeItem === "inadimplencia";
  const isClinicasView = activeItem === "clinicas";
  const isSolicitacoesView = activeItem === "solicitacoes";

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");
      try {
        const [cardsRes, financeiroRes] = await Promise.all([
          api.get("/dashboard/cards-summary"),
          api.get("/financeiro/dashboard"),
        ]);

        const cardsMetrics = cardsRes?.data?.data?.metrics ?? {};
        setMetrics({
          patientsTotal: Number(cardsMetrics.patients_total ?? 0),
          receitaMensal: Number(cardsMetrics.receita_mensal ?? 0),
          saldoMes: Number(cardsMetrics.saldo_mes ?? 0),
          agendamentosHoje: Number(cardsMetrics.agendamentos_hoje ?? 0),
        });

        const resumo = financeiroRes?.data?.data?.resumo ?? {};
        setFinanceiroResumo({
          totalAPagar: Number(resumo.total_a_pagar ?? 0),
          totalAReceber: Number(resumo.total_a_receber ?? 0),
          saldoAtual: Number(resumo.saldo_atual ?? 0),
        });
      } catch {
        setError("Nao foi possivel carregar os dados do portal SaaS.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const fetchMensalidades = useCallback(
    async (page = 1) => {
      setMensalidadesLoading(true);
      try {
        const response = await api.get("/saas/mensalidades", {
          params: {
            page,
            per_page: 10,
            search: mensalidadeSearch || undefined,
            plano_id: mensalidadePlano || undefined,
            status: mensalidadeStatus || undefined,
          },
        });
        const rows = Array.isArray(response?.data?.data)
          ? response.data.data.map((item: any) => ({
              clinica: String(item?.clinica ?? "--"),
              planoId: String(item?.plano_id ?? "basico"),
              planoLabel: String(item?.plano_nome ?? "Basico"),
              valorMensal: Number(item?.valor_mensal ?? 0),
              totalUsuarios: Number(item?.total_usuarios ?? 0),
              usuariosAtivos: Number(item?.usuarios_ativos ?? 0),
              proximoVencimento: String(item?.proximo_vencimento ?? ""),
              status: (item?.status ?? "suspensa") as MensalidadeStatus,
            }))
          : [];

        setMensalidades(rows);
        setMensalidadePage(Number(response?.data?.pagination?.current_page ?? 1));
        setMensalidadeLastPage(Number(response?.data?.pagination?.last_page ?? 1));
        setMensalidadeTotal(Number(response?.data?.pagination?.total ?? rows.length));
      } catch {
        setMensalidades([]);
        setMensalidadePage(1);
        setMensalidadeLastPage(1);
        setMensalidadeTotal(0);
      } finally {
        setMensalidadesLoading(false);
      }
    },
    [mensalidadeSearch, mensalidadePlano, mensalidadeStatus]
  );

  const fetchInadimplencias = useCallback(
    async (page = 1) => {
      setInadimplenciaLoading(true);
      try {
        const response = await api.get("/saas/inadimplencias", {
          params: {
            page,
            per_page: 10,
            search: inadimplenciaSearch || undefined,
            plano_id: inadimplenciaPlano || undefined,
            status: inadimplenciaStatus || undefined,
          },
        });
        const rows = Array.isArray(response?.data?.data)
          ? response.data.data.map((item: any) => ({
              clinica: String(item?.clinica ?? "--"),
              planoId: String(item?.plano_id ?? "basico"),
              planoLabel: String(item?.plano_nome ?? "Basico"),
              proximoVencimento: String(item?.proximo_vencimento ?? ""),
              diasEmAtraso: Number(item?.dias_em_atraso ?? 0),
              nivelRisco: (item?.nivel_risco ?? "baixo") as InadimplenciaRisk,
              valorEmAberto: Number(item?.valor_em_aberto ?? 0),
              status: (item?.status ?? "atrasada") as MensalidadeStatus,
            }))
          : [];

        setInadimplencias(rows);
        setInadimplenciaPage(Number(response?.data?.pagination?.current_page ?? 1));
        setInadimplenciaLastPage(Number(response?.data?.pagination?.last_page ?? 1));
        setInadimplenciaTotal(Number(response?.data?.pagination?.total ?? rows.length));
        const sum = response?.data?.summary;
        setInadimplenciaSummary({
          totalClinicas: Number(sum?.total_clinicas ?? 0),
          totalAtrasadas: Number(sum?.total_atrasadas ?? 0),
          totalInadimplentes: Number(sum?.total_inadimplentes ?? 0),
          valorTotalEmAberto: Number(sum?.valor_total_em_aberto ?? 0),
        });
      } catch {
        setInadimplencias([]);
      } finally {
        setInadimplenciaLoading(false);
      }
    },
    [inadimplenciaSearch, inadimplenciaPlano, inadimplenciaStatus]
  );

  const fetchClinicas = useCallback(
    async (page = 1) => {
      setClinicasLoading(true);
      try {
        const response = await api.get("/saas/clientes/clinicas", {
          params: {
            page,
            per_page: 10,
            search: clinicasSearch || undefined,
            plano_id: clinicasPlano || undefined,
            status: clinicasStatus || undefined,
          },
        });
        const rows = Array.isArray(response?.data?.data)
          ? response.data.data.map((item: any) => ({
              clinica: String(item?.clinica ?? "--"),
              responsavel: String(item?.responsavel ?? "--"),
              email: String(item?.email ?? "--"),
              telefone: String(item?.telefone ?? "--"),
              planoId: String(item?.plano_id ?? "basico"),
              planoLabel: String(item?.plano_nome ?? "Basico"),
              status: (item?.status ?? "suspensa") as MensalidadeStatus,
              valorMensal: Number(item?.valor_mensal ?? 0),
              usuariosAtivos: Number(item?.usuarios_ativos ?? 0),
              totalUsuarios: Number(item?.total_usuarios ?? 0),
              ultimoLoginEm: String(item?.ultimo_login_em ?? ""),
              cadastradoEm: String(item?.cadastrado_em ?? ""),
            }))
          : [];

        setClinicas(rows);
        setClinicasPage(Number(response?.data?.pagination?.current_page ?? 1));
        setClinicasLastPage(Number(response?.data?.pagination?.last_page ?? 1));
        setClinicasTotal(Number(response?.data?.pagination?.total ?? rows.length));
        const sum = response?.data?.summary;
        setClinicasSummary({
          totalClinicas: Number(sum?.total_clinicas ?? 0),
          totalAtivas: Number(sum?.total_ativas ?? 0),
          totalComRisco: Number(sum?.total_com_risco ?? 0),
          totalSuspensas: Number(sum?.total_suspensas ?? 0),
        });
      } catch {
        setClinicas([]);
      } finally {
        setClinicasLoading(false);
      }
    },
    [clinicasSearch, clinicasPlano, clinicasStatus]
  );

  const fetchSolicitacoes = useCallback(
    async (page = 1) => {
      setSolicitacoesLoading(true);
      try {
        const response = await api.get("/saas/solicitacoes", {
          params: {
            page,
            per_page: 10,
            search: solicitacoesSearch || undefined,
            status: solicitacoesStatus || undefined,
            plano_id: solicitacoesPlano || undefined,
          },
        });

        const rows = Array.isArray(response?.data?.data)
          ? response.data.data.map((item: any) => ({
              id: Number(item?.id ?? 0),
              nomeClinica: String(item?.nome_clinica ?? "--"),
              responsavel: String(item?.responsavel ?? "--"),
              email: String(item?.email ?? "--"),
              telefone: String(item?.telefone ?? "--"),
              planoId: String(item?.plano_id ?? "basico"),
              planoNome: String(item?.plano_nome ?? "Basico"),
              valorMensal: Number(item?.valor_mensal ?? 0),
              status: (item?.status ?? "pendente") as SolicitacaoStatus,
              pagamentoConfirmado: Boolean(item?.pagamento_confirmado),
              dataPagamento: String(item?.data_pagamento ?? ""),
              motivoRejeicao: String(item?.motivo_rejeicao ?? ""),
            }))
          : [];

        setSolicitacoes(rows);
        setSolicitacoesPage(Number(response?.data?.pagination?.current_page ?? 1));
        setSolicitacoesLastPage(Number(response?.data?.pagination?.last_page ?? 1));
        setSolicitacoesTotal(Number(response?.data?.pagination?.total ?? rows.length));

        const sum = response?.data?.summary;
        setSolicitacoesSummary({
          total: Number(sum?.total ?? 0),
          totalPendentes: Number(sum?.total_pendentes ?? 0),
          totalAguardando: Number(sum?.total_aguardando ?? 0),
          totalAprovadas: Number(sum?.total_aprovadas ?? 0),
          totalRejeitadas: Number(sum?.total_rejeitadas ?? 0),
          aprovadasHoje: Number(sum?.aprovadas_hoje ?? 0),
        });
      } catch {
        setSolicitacoes([]);
      } finally {
        setSolicitacoesLoading(false);
      }
    },
    [solicitacoesSearch, solicitacoesStatus, solicitacoesPlano]
  );

  const executarAcao = async () => {
    if (!solicitacaoAcao) return;
    setAcaoLoading(true);
    setAcaoMsg("");
    try {
      if (solicitacaoAcao.tipo === "aprovar") {
        await api.patch(`/saas/solicitacoes/${solicitacaoAcao.id}/aprovar`);
        setAcaoMsg(`Clinica \"${solicitacaoAcao.nome}\" aprovada com sucesso.`);
      } else if (solicitacaoAcao.tipo === "rejeitar") {
        if (!motivoRejeicao.trim()) {
          setAcaoMsg("Informe o motivo da rejeicao.");
          setAcaoLoading(false);
          return;
        }
        await api.patch(`/saas/solicitacoes/${solicitacaoAcao.id}/rejeitar`, {
          motivo: motivoRejeicao,
        });
        setAcaoMsg(`Solicitacao de \"${solicitacaoAcao.nome}\" rejeitada.`);
      } else {
        await api.patch(`/saas/solicitacoes/${solicitacaoAcao.id}/confirmar-pagamento`);
        setAcaoMsg(`Pagamento de \"${solicitacaoAcao.nome}\" confirmado.`);
      }
      setSolicitacaoAcao(null);
      setMotivoRejeicao("");
      fetchSolicitacoes(solicitacoesPage);
    } catch (err: any) {
      setAcaoMsg(err?.response?.data?.message || "Erro ao executar acao.");
    } finally {
      setAcaoLoading(false);
    }
  };

  useEffect(() => {
    if (isMensalidadesView) fetchMensalidades(1);
  }, [isMensalidadesView, mensalidadeSearch, mensalidadePlano, mensalidadeStatus, fetchMensalidades]);

  useEffect(() => {
    if (isInadimplenciaView) fetchInadimplencias(1);
  }, [isInadimplenciaView, inadimplenciaSearch, inadimplenciaPlano, inadimplenciaStatus, fetchInadimplencias]);

  useEffect(() => {
    if (isClinicasView) fetchClinicas(1);
  }, [isClinicasView, clinicasSearch, clinicasPlano, clinicasStatus, fetchClinicas]);

  useEffect(() => {
    if (isSolicitacoesView) fetchSolicitacoes(1);
  }, [isSolicitacoesView, solicitacoesSearch, solicitacoesStatus, solicitacoesPlano, fetchSolicitacoes]);

  const handleMenuClick = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      setExpandedMenu((prev) => (prev === item.id ? null : item.id));
      return;
    }
    setActiveItem(item.id);
    setExpandedMenu(null);
  };

  const openPlanModal = (plan: SaaSPlan) => {
    setPlanoSelecionado(plan);
    setPlanForm(buildPlanForm(plan));
    setPlanModalOpen(true);
  };

  const closePlanModal = () => {
    setPlanModalOpen(false);
    setPlanoSelecionado(null);
  };

  const submitPlanConfig = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    closePlanModal();
  };

  return (
    <div className="saas-admin-shell">
      <aside className="saas-admin-sidebar">
        <div className="saas-admin-brand">
          <span className="saas-admin-brand-logo">
            <FiLayers />
          </span>
          <div>
            <strong>Odonto SaaS</strong>
            <small>Admin Portal</small>
          </div>
        </div>

        <nav className="saas-admin-nav">
          {menuItems.map((item) => {
            const isOpen = expandedMenu === item.id;
            const isActive = activeItem === item.id;

            return (
              <div key={item.id} className="saas-admin-nav-group">
                <button
                  type="button"
                  className={`saas-admin-nav-item ${isActive ? "active" : ""}`}
                  onClick={() => handleMenuClick(item)}
                >
                  <span className="saas-admin-nav-left">
                    <span className="saas-admin-nav-icon">
                      <FiGrid />
                    </span>
                    <span>{item.label}</span>
                  </span>
                  {item.children ? (isOpen ? <FiChevronDown /> : <FiChevronRight />) : null}
                </button>

                {item.children && isOpen ? (
                  <div className="saas-admin-submenu">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        className={`saas-admin-submenu-item ${activeItem === child.id ? "active" : ""}`}
                        onClick={() => setActiveItem(child.id)}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="saas-admin-main">
        <header className="saas-admin-topbar">
          <div className="saas-admin-topbar-left">
            <h1>
              {isPlanosView
                ? "Planos disponiveis"
                : isMensalidadesView
                  ? "Mensalidades das Clinicas"
                  : isInadimplenciaView
                    ? "Controle de Inadimplencia"
                    : isClinicasView
                      ? "Clientes - Clinicas"
                      : isSolicitacoesView
                        ? "Solicitacoes de Acesso"
                        : "Painel Administrativo SaaS"}
            </h1>
          </div>
          <div className="saas-admin-topbar-right">
            <span className="saas-admin-lang">Portuguese(Brazil)</span>
            <span className="saas-admin-user">Oi, Super Admin</span>
          </div>
        </header>

        {error ? <div className="saas-admin-error">{error}</div> : null}

        {isPlanosView ? (
          <>
            <section className="saas-planos-grid">
              {SAAS_PLANS.map((plan) => (
                <article key={plan.id} className="saas-plano-card">
                  <button
                    type="button"
                    className="saas-plano-edit-btn"
                    onClick={() => openPlanModal(plan)}
                    aria-label={`Configurar plano ${plan.label}`}
                    title="Configurar plano"
                  >
                    <FiEdit2 />
                  </button>
                  <span className="saas-plano-badge">{plan.label}</span>
                  <div className="saas-plano-price-block">
                    <strong>{currency(plan.price)}</strong>
                    <small>/ {plan.period}</small>
                  </div>
                  <p className="saas-plano-description">{plan.description}</p>
                  <h4 className="saas-plano-features-title">O que este plano contempla</h4>
                  <ul className="saas-plano-features">
                    {plan.features.map((feature) => (
                      <li key={`${plan.id}-${feature.text}`} className={feature.included ? "included" : "excluded"}>
                        {feature.included ? <FiCheckCircle /> : <FiXCircle />}
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="saas-plano-limits">
                    <div>
                      <strong>{plan.limits.usuarios}</strong>
                      <span>Usuarios</span>
                    </div>
                    <div>
                      <strong>{plan.limits.lojas}</strong>
                      <span>Clinicas</span>
                    </div>
                    <div>
                      <strong>{plan.limits.armazenamentoGb} GB</strong>
                      <span>Armazenamento</span>
                    </div>
                  </div>
                  <div className="saas-plano-footer">
                    <span>{currency(plan.price * 12)} / Ano</span>
                  </div>
                </article>
              ))}
            </section>

            {planModalOpen && planoSelecionado ? (
              <div className="saas-modal-overlay">
                <div className="saas-modal saas-plan-modal">
                  <div className="saas-plan-modal-head">
                    <h3>Configurar Plano</h3>
                    <button
                      type="button"
                      className="saas-plan-modal-close"
                      onClick={closePlanModal}
                      aria-label="Fechar modal"
                    >
                      <FiXCircle />
                    </button>
                  </div>

                  <form className="saas-plan-form" onSubmit={submitPlanConfig}>
                    <div className="saas-plan-form-grid three">
                      <label>
                        <span>Nome</span>
                        <input
                          type="text"
                          value={planForm.nome}
                          onChange={(e) => setPlanForm((prev) => ({ ...prev, nome: e.target.value }))}
                        />
                      </label>
                      <label>
                        <span>Valor do plano (R$)</span>
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={planForm.valorPlano}
                          onChange={(e) =>
                            setPlanForm((prev) => ({ ...prev, valorPlano: Number(e.target.value || 0) }))
                          }
                        />
                      </label>
                      <label>
                        <span>Duracao</span>
                        <select
                          value={planForm.duracao}
                          onChange={(e) =>
                            setPlanForm((prev) => ({ ...prev, duracao: e.target.value as "Mes" | "Ano" }))
                          }
                        >
                          <option value="Mes">Por Mes</option>
                          <option value="Ano">Anual</option>
                        </select>
                      </label>
                    </div>

                    <div className="saas-plan-form-grid three">
                      <label>
                        <span>Maximo de clinicas</span>
                        <input
                          type="number"
                          min={1}
                          value={planForm.maximoClinicas}
                          onChange={(e) =>
                            setPlanForm((prev) => ({ ...prev, maximoClinicas: Number(e.target.value || 0) }))
                          }
                        />
                      </label>
                      <label>
                        <span>Maximo de usuarios</span>
                        <input
                          type="text"
                          value={planForm.maximoUsuarios}
                          onChange={(e) => setPlanForm((prev) => ({ ...prev, maximoUsuarios: e.target.value }))}
                        />
                      </label>
                      <label>
                        <span>Limite de armazenamento (GB)</span>
                        <input
                          type="number"
                          min={1}
                          value={planForm.armazenamentoGb}
                          onChange={(e) =>
                            setPlanForm((prev) => ({ ...prev, armazenamentoGb: Number(e.target.value || 0) }))
                          }
                        />
                      </label>
                    </div>

                    <div className="saas-plan-switches">
                      <label>
                        <input
                          type="checkbox"
                          checked={planForm.portalPaciente}
                          onChange={(e) => setPlanForm((prev) => ({ ...prev, portalPaciente: e.target.checked }))}
                        />
                        <span>Ativar Portal do Paciente</span>
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={planForm.financeiroCompleto}
                          onChange={(e) =>
                            setPlanForm((prev) => ({ ...prev, financeiroCompleto: e.target.checked }))
                          }
                        />
                        <span>Ativar Financeiro Completo</span>
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={planForm.relatoriosAvancados}
                          onChange={(e) =>
                            setPlanForm((prev) => ({ ...prev, relatoriosAvancados: e.target.checked }))
                          }
                        />
                        <span>Ativar Relatorios Avancados</span>
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={planForm.suportePrioritario}
                          onChange={(e) =>
                            setPlanForm((prev) => ({ ...prev, suportePrioritario: e.target.checked }))
                          }
                        />
                        <span>Ativar Suporte Prioritario</span>
                      </label>
                    </div>

                    <label className="saas-plan-description-field">
                      <span>Descricao</span>
                      <textarea
                        rows={4}
                        value={planForm.descricao}
                        onChange={(e) => setPlanForm((prev) => ({ ...prev, descricao: e.target.value }))}
                      />
                    </label>

                    <div className="saas-plan-modal-actions">
                      <button type="button" className="saas-modal-cancel" onClick={closePlanModal}>
                        Cancelar
                      </button>
                      <button type="submit" className="saas-modal-confirm pagamento">
                        Atualizar Plano
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : null}
          </>
        ) : isMensalidadesView ? (
          <section className="saas-mensalidades-wrap">
            <div className="saas-mensalidades-head">
              <h2>Lista de mensalidades</h2>
              <small>Controle financeiro por clinica</small>
            </div>
            <div className="saas-mensalidades-filters">
              <input
                type="text"
                placeholder="Buscar clinica"
                value={mensalidadeSearch}
                onChange={(e) => setMensalidadeSearch(e.target.value)}
              />
              <select value={mensalidadePlano} onChange={(e) => setMensalidadePlano(e.target.value)}>
                <option value="">Todos os planos</option>
                <option value="basico">Basico</option>
                <option value="profissional">Profissional</option>
                <option value="premium">Premium</option>
              </select>
              <select value={mensalidadeStatus} onChange={(e) => setMensalidadeStatus(e.target.value)}>
                <option value="">Todos os status</option>
                <option value="em_dia">Em dia</option>
                <option value="atrasada">Atrasada</option>
                <option value="inadimplente">Inadimplente</option>
                <option value="suspensa">Suspensa</option>
              </select>
              <button type="button" className="saas-refresh-btn" onClick={() => fetchMensalidades(mensalidadePage)}>
                Atualizar
              </button>
            </div>
            <div className="saas-mensalidades-table-wrap">
              <table className="saas-mensalidades-table">
                <thead>
                  <tr>
                    <th>Clinica</th>
                    <th>Plano</th>
                    <th>Usuarios</th>
                    <th>Valor mensal</th>
                    <th>Proximo vencimento</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mensalidadesLoading ? (
                    <tr><td colSpan={6}>Carregando mensalidades...</td></tr>
                  ) : mensalidades.length === 0 ? (
                    <tr><td colSpan={6}>Nenhuma mensalidade encontrada.</td></tr>
                  ) : (
                    mensalidades.map((item) => (
                      <tr key={`${item.clinica}-${item.proximoVencimento}`}>
                        <td>{item.clinica}</td>
                        <td><span className={`saas-plan-chip ${item.planoId}`}>{item.planoLabel}</span></td>
                        <td>{item.usuariosAtivos}/{item.totalUsuarios}</td>
                        <td>{currency(item.valorMensal)}</td>
                        <td>{shortDate(item.proximoVencimento)}</td>
                        <td><span className={`saas-status-chip ${item.status}`}>{statusLabel[item.status]}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="saas-mensalidades-footer">
              <small>Total: {mensalidadeTotal}</small>
              <div className="saas-mensalidades-pagination">
                <button
                  type="button"
                  disabled={mensalidadePage <= 1 || mensalidadesLoading}
                  onClick={() => fetchMensalidades(mensalidadePage - 1)}
                >Anterior</button>
                <span>Pagina {mensalidadePage} de {mensalidadeLastPage}</span>
                <button
                  type="button"
                  disabled={mensalidadePage >= mensalidadeLastPage || mensalidadesLoading}
                  onClick={() => fetchMensalidades(mensalidadePage + 1)}
                >Proxima</button>
              </div>
            </div>
          </section>
        ) : isInadimplenciaView ? (
          <section className="saas-mensalidades-wrap">
            <div className="saas-mensalidades-head">
              <h2>Lista de inadimplencia</h2>
              <small>Clinicas em atraso e risco</small>
            </div>
            <div className="saas-inadimplencia-summary-grid">
              <article className="saas-inadimplencia-summary-card"><strong>{inadimplenciaSummary.totalClinicas}</strong><span>Total clinicas</span></article>
              <article className="saas-inadimplencia-summary-card warning"><strong>{inadimplenciaSummary.totalAtrasadas}</strong><span>Atrasadas</span></article>
              <article className="saas-inadimplencia-summary-card danger"><strong>{inadimplenciaSummary.totalInadimplentes}</strong><span>Inadimplentes</span></article>
              <article className="saas-inadimplencia-summary-card value"><strong>{currency(inadimplenciaSummary.valorTotalEmAberto)}</strong><span>Valor em aberto</span></article>
            </div>
            <div className="saas-mensalidades-filters">
              <input
                type="text"
                placeholder="Buscar clinica"
                value={inadimplenciaSearch}
                onChange={(e) => setInadimplenciaSearch(e.target.value)}
              />
              <select value={inadimplenciaPlano} onChange={(e) => setInadimplenciaPlano(e.target.value)}>
                <option value="">Todos os planos</option>
                <option value="basico">Basico</option>
                <option value="profissional">Profissional</option>
                <option value="premium">Premium</option>
              </select>
              <select value={inadimplenciaStatus} onChange={(e) => setInadimplenciaStatus(e.target.value)}>
                <option value="">Todos os status</option>
                <option value="atrasada">Atrasada</option>
                <option value="inadimplente">Inadimplente</option>
              </select>
              <button type="button" className="saas-refresh-btn" onClick={() => fetchInadimplencias(inadimplenciaPage)}>
                Atualizar
              </button>
            </div>
            <div className="saas-mensalidades-table-wrap">
              <table className="saas-mensalidades-table">
                <thead>
                  <tr>
                    <th>Clinica</th>
                    <th>Plano</th>
                    <th>Vencimento</th>
                    <th>Dias em atraso</th>
                    <th>Risco</th>
                    <th>Valor em aberto</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inadimplenciaLoading ? (
                    <tr><td colSpan={7}>Carregando inadimplencia...</td></tr>
                  ) : inadimplencias.length === 0 ? (
                    <tr><td colSpan={7}>Nenhuma clinica inadimplente encontrada.</td></tr>
                  ) : (
                    inadimplencias.map((item) => (
                      <tr key={`${item.clinica}-${item.proximoVencimento}`}>
                        <td>{item.clinica}</td>
                        <td><span className={`saas-plan-chip ${item.planoId}`}>{item.planoLabel}</span></td>
                        <td>{shortDate(item.proximoVencimento)}</td>
                        <td>{item.diasEmAtraso}</td>
                        <td><span className={`saas-risk-chip ${item.nivelRisco}`}>{riskLabel[item.nivelRisco]}</span></td>
                        <td>{currency(item.valorEmAberto)}</td>
                        <td><span className={`saas-status-chip ${item.status}`}>{statusLabel[item.status]}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="saas-mensalidades-footer">
              <small>Total: {inadimplenciaTotal}</small>
              <div className="saas-mensalidades-pagination">
                <button type="button" disabled={inadimplenciaPage <= 1 || inadimplenciaLoading} onClick={() => fetchInadimplencias(inadimplenciaPage - 1)}>Anterior</button>
                <span>Pagina {inadimplenciaPage} de {inadimplenciaLastPage}</span>
                <button type="button" disabled={inadimplenciaPage >= inadimplenciaLastPage || inadimplenciaLoading} onClick={() => fetchInadimplencias(inadimplenciaPage + 1)}>Proxima</button>
              </div>
            </div>
          </section>
        ) : isClinicasView ? (
          <section className="saas-mensalidades-wrap">
            <div className="saas-mensalidades-head">
              <h2>Lista de clinicas</h2>
              <small>Dados cadastrais e financeiros</small>
            </div>
            <div className="saas-inadimplencia-summary-grid">
              <article className="saas-inadimplencia-summary-card"><strong>{clinicasSummary.totalClinicas}</strong><span>Total clinicas</span></article>
              <article className="saas-inadimplencia-summary-card value"><strong>{clinicasSummary.totalAtivas}</strong><span>Em dia</span></article>
              <article className="saas-inadimplencia-summary-card warning"><strong>{clinicasSummary.totalComRisco}</strong><span>Com risco</span></article>
              <article className="saas-inadimplencia-summary-card danger"><strong>{clinicasSummary.totalSuspensas}</strong><span>Suspensas</span></article>
            </div>
            <div className="saas-mensalidades-filters">
              <input type="text" placeholder="Buscar por clinica, responsavel ou email" value={clinicasSearch} onChange={(e) => setClinicasSearch(e.target.value)} />
              <select value={clinicasPlano} onChange={(e) => setClinicasPlano(e.target.value)}>
                <option value="">Todos os planos</option>
                <option value="basico">Basico</option>
                <option value="profissional">Profissional</option>
                <option value="premium">Premium</option>
              </select>
              <select value={clinicasStatus} onChange={(e) => setClinicasStatus(e.target.value)}>
                <option value="">Todos os status</option>
                <option value="em_dia">Em dia</option>
                <option value="atrasada">Atrasada</option>
                <option value="inadimplente">Inadimplente</option>
                <option value="suspensa">Suspensa</option>
              </select>
              <button type="button" className="saas-refresh-btn" onClick={() => fetchClinicas(clinicasPage)}>Atualizar</button>
            </div>
            <div className="saas-mensalidades-table-wrap">
              <table className="saas-mensalidades-table saas-clinicas-table">
                <thead>
                  <tr>
                    <th>Clinica</th>
                    <th>Responsavel</th>
                    <th>Contato</th>
                    <th>Plano</th>
                    <th>Status mensalidade</th>
                    <th>Usuarios</th>
                    <th>Cadastro</th>
                    <th>Ultimo acesso</th>
                  </tr>
                </thead>
                <tbody>
                  {clinicasLoading ? (
                    <tr><td colSpan={8}>Carregando clinicas...</td></tr>
                  ) : clinicas.length === 0 ? (
                    <tr><td colSpan={8}>Nenhuma clinica encontrada.</td></tr>
                  ) : (
                    clinicas.map((item) => (
                      <tr key={item.clinica}>
                        <td>{item.clinica}</td>
                        <td>{item.responsavel}</td>
                        <td>
                          <div className="saas-clinica-contact">
                            <span>{item.email}</span>
                            <small>{item.telefone || "--"}</small>
                          </div>
                        </td>
                        <td>
                          <div className="saas-clinica-plan-block">
                            <span className={`saas-plan-chip ${item.planoId}`}>{item.planoLabel}</span>
                            <small>{currency(item.valorMensal)}/mes</small>
                          </div>
                        </td>
                        <td><span className={`saas-status-chip ${item.status}`}>{statusLabel[item.status]}</span></td>
                        <td>{item.usuariosAtivos}/{item.totalUsuarios}</td>
                        <td>{shortDate(item.cadastradoEm)}</td>
                        <td>{shortDateTime(item.ultimoLoginEm)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="saas-mensalidades-footer">
              <small>Total: {clinicasTotal}</small>
              <div className="saas-mensalidades-pagination">
                <button type="button" disabled={clinicasPage <= 1 || clinicasLoading} onClick={() => fetchClinicas(clinicasPage - 1)}>Anterior</button>
                <span>Pagina {clinicasPage} de {clinicasLastPage}</span>
                <button type="button" disabled={clinicasPage >= clinicasLastPage || clinicasLoading} onClick={() => fetchClinicas(clinicasPage + 1)}>Proxima</button>
              </div>
            </div>
          </section>
        ) : isSolicitacoesView ? (
          <section className="saas-mensalidades-wrap">
            <div className="saas-mensalidades-head">
              <h2>Lista de solicitacoes</h2>
              <small>Novas clinicas solicitando acesso apos pagamento</small>
            </div>
            <div className="saas-inadimplencia-summary-grid">
              <article className="saas-inadimplencia-summary-card"><strong>{solicitacoesSummary.total}</strong><span>Total</span></article>
              <article className="saas-inadimplencia-summary-card warning"><strong>{solicitacoesSummary.totalPendentes}</strong><span>Pendentes</span></article>
              <article className="saas-inadimplencia-summary-card"><strong>{solicitacoesSummary.totalAguardando}</strong><span>Aguardando pagamento</span></article>
              <article className="saas-inadimplencia-summary-card value"><strong>{solicitacoesSummary.totalAprovadas}</strong><span>Aprovadas ({solicitacoesSummary.aprovadasHoje} hoje)</span></article>
            </div>

            {acaoMsg ? <div className="saas-acao-msg">{acaoMsg}</div> : null}

            {solicitacaoAcao ? (
              <div className="saas-modal-overlay">
                <div className="saas-modal">
                  <h3>
                    {solicitacaoAcao.tipo === "aprovar"
                      ? `Aprovar \"${solicitacaoAcao.nome}\"?`
                      : solicitacaoAcao.tipo === "rejeitar"
                        ? `Rejeitar \"${solicitacaoAcao.nome}\"`
                        : `Confirmar pagamento de \"${solicitacaoAcao.nome}\"`}
                  </h3>
                  {solicitacaoAcao.tipo === "rejeitar" ? (
                    <textarea
                      className="saas-modal-textarea"
                      placeholder="Informe o motivo da rejeicao (obrigatorio)"
                      value={motivoRejeicao}
                      onChange={(e) => setMotivoRejeicao(e.target.value)}
                      rows={3}
                    />
                  ) : null}
                  <div className="saas-modal-actions">
                    <button
                      type="button"
                      className="saas-modal-cancel"
                      onClick={() => {
                        setSolicitacaoAcao(null);
                        setMotivoRejeicao("");
                        setAcaoMsg("");
                      }}
                      disabled={acaoLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className={`saas-modal-confirm ${solicitacaoAcao.tipo}`}
                      onClick={executarAcao}
                      disabled={acaoLoading}
                    >
                      {acaoLoading
                        ? "Aguarde..."
                        : solicitacaoAcao.tipo === "aprovar"
                          ? "Confirmar aprovacao"
                          : solicitacaoAcao.tipo === "rejeitar"
                            ? "Confirmar rejeicao"
                            : "Confirmar pagamento"}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="saas-mensalidades-filters">
              <input type="text" placeholder="Buscar por clinica, responsavel ou email" value={solicitacoesSearch} onChange={(e) => setSolicitacoesSearch(e.target.value)} />
              <select value={solicitacoesStatus} onChange={(e) => setSolicitacoesStatus(e.target.value)}>
                <option value="">Todos os status</option>
                <option value="pendente">Pendente</option>
                <option value="aguardando_pagamento">Aguardando pagamento</option>
                <option value="aprovada">Aprovada</option>
                <option value="rejeitada">Rejeitada</option>
              </select>
              <select value={solicitacoesPlano} onChange={(e) => setSolicitacoesPlano(e.target.value)}>
                <option value="">Todos os planos</option>
                <option value="basico">Basico</option>
                <option value="profissional">Profissional</option>
                <option value="premium">Premium</option>
              </select>
              <button type="button" className="saas-refresh-btn" onClick={() => fetchSolicitacoes(solicitacoesPage)}>Atualizar</button>
            </div>

            <div className="saas-mensalidades-table-wrap">
              <table className="saas-mensalidades-table saas-solicitacoes-table">
                <thead>
                  <tr>
                    <th>Clinica</th>
                    <th>Responsavel</th>
                    <th>Plano</th>
                    <th>Pagamento</th>
                    <th>Status</th>
                    <th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitacoesLoading ? (
                    <tr><td colSpan={6}>Carregando solicitacoes...</td></tr>
                  ) : solicitacoes.length === 0 ? (
                    <tr><td colSpan={6}>Nenhuma solicitacao encontrada.</td></tr>
                  ) : (
                    solicitacoes.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="saas-clinica-contact">
                            <span>{item.nomeClinica}</span>
                            <small>{item.email}</small>
                          </div>
                        </td>
                        <td>
                          <div className="saas-clinica-contact">
                            <span>{item.responsavel}</span>
                            <small>{item.telefone || "--"}</small>
                          </div>
                        </td>
                        <td>
                          <div className="saas-clinica-plan-block">
                            <span className={`saas-plan-chip ${item.planoId}`}>{item.planoNome}</span>
                            <small>{currency(item.valorMensal)}/mes</small>
                          </div>
                        </td>
                        <td>
                          {item.pagamentoConfirmado ? (
                            <span className="saas-sol-pago"><FiCheckCircle /> Pago em {shortDate(item.dataPagamento)}</span>
                          ) : (
                            <span className="saas-sol-pendente-pag"><FiXCircle /> Pendente</span>
                          )}
                        </td>
                        <td>
                          <span className={`saas-sol-status-chip ${item.status}`}>{statusLabel[item.status]}</span>
                          {item.motivoRejeicao ? <small className="saas-sol-motivo">{item.motivoRejeicao}</small> : null}
                        </td>
                        <td>
                          <div className="saas-sol-actions">
                            {!item.pagamentoConfirmado ? (
                              <button type="button" className="saas-sol-btn pagar" onClick={() => { setAcaoMsg(""); setSolicitacaoAcao({ id: item.id, tipo: "pagamento", nome: item.nomeClinica }); }}>
                                Confirmar Pgto
                              </button>
                            ) : null}
                            {item.status !== "aprovada" ? (
                              <button type="button" className="saas-sol-btn aprovar" onClick={() => { setAcaoMsg(""); setSolicitacaoAcao({ id: item.id, tipo: "aprovar", nome: item.nomeClinica }); }}>
                                Aprovar
                              </button>
                            ) : null}
                            {item.status !== "rejeitada" ? (
                              <button type="button" className="saas-sol-btn rejeitar" onClick={() => { setAcaoMsg(""); setMotivoRejeicao(""); setSolicitacaoAcao({ id: item.id, tipo: "rejeitar", nome: item.nomeClinica }); }}>
                                Rejeitar
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="saas-mensalidades-footer">
              <small>Total: {solicitacoesTotal}</small>
              <div className="saas-mensalidades-pagination">
                <button type="button" disabled={solicitacoesPage <= 1 || solicitacoesLoading} onClick={() => fetchSolicitacoes(solicitacoesPage - 1)}>Anterior</button>
                <span>Pagina {solicitacoesPage} de {solicitacoesLastPage}</span>
                <button type="button" disabled={solicitacoesPage >= solicitacoesLastPage || solicitacoesLoading} onClick={() => fetchSolicitacoes(solicitacoesPage + 1)}>Proxima</button>
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="saas-admin-cards">
              {[{
                id: "clients",
                title: "Clientes Ativos",
                value: String(metrics.patientsTotal),
                icon: <FiUsers />,
                tone: "violet",
              }, {
                id: "revenue",
                title: "Receita Mensal",
                value: currency(metrics.receitaMensal),
                icon: <FiBarChart2 />,
                tone: "amber",
              }, {
                id: "balance",
                title: "Saldo",
                value: currency(financeiroResumo.saldoAtual || metrics.saldoMes),
                icon: <FiDollarSign />,
                tone: "green",
              }, {
                id: "receivable",
                title: "Mensalidades a Receber",
                value: currency(financeiroResumo.totalAReceber),
                icon: <FiFileText />,
                tone: "pink",
              }].map((card) => (
                <article key={card.id} className={`saas-card ${card.tone}`}>
                  <div className="saas-card-icon">{card.icon}</div>
                  <div className="saas-card-body">
                    <h3>{card.title}</h3>
                    <strong>{loading ? "..." : card.value}</strong>
                  </div>
                </article>
              ))}
            </section>

            <section className="saas-admin-chart-panel">
              <div className="saas-admin-panel-head">
                <h2>Agendamentos da Semana</h2>
                <small>Grafico abaixo dos cards</small>
              </div>
              <div className="saas-admin-chart-wrap">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ececf3" />
                    <XAxis dataKey="dia" tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke="#5b53d6" strokeWidth={3} dot={{ r: 4, fill: "#5b53d6" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPortalPage;