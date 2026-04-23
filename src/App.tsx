import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import * as Sentry from "@sentry/react";
import Sidebar from "./components/layout/Sidebar/Sidebar";
import Header from "./components/layout/Header/Header";
import { ConsentBanner } from "./components/ui/LGPD/ConsentBanner";
import { Notification, useNotification } from "./components/ui/Notification/Notification";
import LoadingSpinner from "./components/ui/LoadingSpinner/LoadingSpinner";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import "./App.css";
import PagamentoPage from "./pages/Pagamento/PagamentoPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";

const routerBasename = (process.env.REACT_APP_BASENAME || "").replace(/\/$/, "");

// Lazy loading das páginas principais
const InstitucionalPage = React.lazy(() => import("./pages/Institucional/InstitucionalPage"));
const PlanosPage = React.lazy(() => import("./pages/Planos/PlanosPage"));

// Lazy loading das páginas do dashboard
const Dashboard = React.lazy(() => import("./pages/Dashboard/DashboardCards"));
const PatientsPage = React.lazy(() => import("./pages/Modulos/clientes/PatientsPage/PatientsPage"));
const UsersPage = React.lazy(() => import("./pages/Modulos/Usuarios/UsersPage/UsersPage"));
const FuncionariosPage = React.lazy(() => import("./pages/Modulos/funcionarios/EmployeePage/EmployeePage"));
const DentistasPage = React.lazy(() => import("./pages/Modulos/dentistas/DentistasPage/DentistasPage"));
const AgendamentosPage = React.lazy(() => import("./pages/Modulos/agendamentos/AgendamentosPage/AgendamentosPage"));
const RelatorioAgendamentos = React.lazy(() => import("./pages/Modulos/agendamentos/RelatorioAgendamentos/RelatorioAgendamentos"));
const RelatorioProcedimentos = React.lazy(() => import("./pages/Modulos/agendamentos/RelatorioProcedimentos/RelatorioProcedimentos"));
const ProcedimentosPage = React.lazy(() => import("./pages/Modulos/cadastros/Procedimentos/ProcedimentosPage"));
const ConveniosPage = React.lazy(() => import("./pages/Modulos/cadastros/Convenios/ConveniosPage"));
const ItensAnamnesePage = React.lazy(() => import("./pages/Modulos/cadastros/ItensAnamnese/ItensAnamnesePage"));
const GruposAnamnesePage = React.lazy(() => import("./pages/Modulos/cadastros/GruposAnamnese/GruposAnamnesePage"));
const FormasPagamentoPage = React.lazy(() => import("./pages/Modulos/cadastros/FormasPagamento/FormasPagamentoPage"));
const FrequenciasPage = React.lazy(() => import("./pages/Modulos/cadastros/Frequencias/FrequenciasPage"));
const CargosPage = React.lazy(() => import("./pages/Modulos/cadastros/Cargos/CargosPage"));
const FornecedoresPage = React.lazy(() => import("./pages/FornecedoresPage"));
const FinanceiroDashboard = React.lazy(() => import("./pages/Modulos/Financeiro/FinanceiroDashboard"));
const ContasPagarPage = React.lazy(() => import("./pages/Modulos/Financeiro/ContasPagar/ContasPagarPage"));
const ContasReceberPage = React.lazy(() => import("./pages/Modulos/Financeiro/ContasReceber/ContasReceberPage"));
const RecebimentosConvenioPage = React.lazy(() => import("./pages/Modulos/Financeiro/RecebimentosConvenio/RecebimentosConvenioPage"));
const ComissoesPage = React.lazy(() => import("./pages/Modulos/Financeiro/comissoes/ComissoesPage"));
const ConsultaPage = React.lazy(() => import("./pages/Modulos/Financeiro/consulta/ConsultaPage"));
const HorariosPage = React.lazy(() => import("./pages/Modulos/horarios/HorariosPage"));
const MinhasComissoesPage = React.lazy(() => import("./pages/Modulos/MinhasComissoes/MinhasComissoesPage"));
const OdontogramasPage = React.lazy(() => import("./pages/Modulos/Odontogramas/OdontogramasPage"));
const TratamentosPage = React.lazy(() => import("./pages/Modulos/Tratamentos/TratamentosPage"));
const OrcamentosPage = React.lazy(() => import("./pages/Modulos/Orcamentos/OrcamentosPage"));
const CaixaPage = React.lazy(() => import("./pages/Modulos/Caixa/CaixaPage"));
const TarefasPage = React.lazy(() => import("./pages/Modulos/Tarefas/TarefasPage"));
const AnotacoesPage = React.lazy(() => import("./pages/Modulos/Anotacoes/AnotacoesPage"));
const RelatorioFinanceiroPage = React.lazy(() => import("./pages/Modulos/Relatorios/RelatorioFinanceiroPage"));
const RelatorioSinteticoDespesasPage = React.lazy(() => import("./pages/Modulos/Relatorios/RelatorioSinteticoDespesasPage"));
const RelatorioSinteticoRecebimentosPage = React.lazy(() => import("./pages/Modulos/Relatorios/RelatorioSinteticoRecebimentosPage"));
const RelatorioBalancoAnualPage = React.lazy(() => import("./pages/Modulos/Relatorios/RelatorioBalancoAnualPage"));
const RelatorioInadimplentesPage = React.lazy(() => import("./pages/Modulos/Relatorios/RelatorioInadimplentesPage"));

// Portal do Paciente
const PortalPage = React.lazy(() => import("./pages/Portal/PortalPage"));
const PortalLoginPage = React.lazy(() => import("./pages/Portal/PortalLoginPage"));
const PortalRegistroPage = React.lazy(() => import("./pages/Portal/PortalRegistroPage"));
const PortalAgendarPage = React.lazy(() => import("./pages/Portal/PortalAgendarPage"));
const PortalMeusAgendamentosPage = React.lazy(() => import("./pages/Portal/PortalMeusAgendamentosPage"));
const AdminLoginPage = React.lazy(() => import("./pages/Admin/AdminLoginPage"));
const AdminPortalPage = React.lazy(() => import("./pages/Admin/AdminPortalPage"));

const RouteMonitor: React.FC = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  React.useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: `${navigationType} ${location.pathname}${location.search}`,
      level: "info",
    });
  }, [location.pathname, location.search, navigationType]);

  return null;
};

const App: React.FC = () => {
  const { notifications, hideNotification } = useNotification();

  const handleConsentAccept = () => {};

  const handleConsentReject = () => {};

  const handleConsentCustomize = () => {};

  return (
    <Router basename={routerBasename || undefined} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RouteMonitor />
      <div className="app">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Página Institucional como página inicial (sem sidebar/header) */}
            <Route path="/" element={<InstitucionalPage />} />
            
            {/* Página de Planos (sem sidebar/header) */}
            <Route path="/planos" element={<PlanosPage />} />
            {/* Rota dedicada para pagamento Mercado Pago */}
            <Route path="/pagamento" element={<PagamentoPage />} />
            
            {/* Páginas de Autenticação (sem sidebar/header) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            
                        {/* Portal do Paciente (sem sidebar/header) */}
                        <Route path="/portal" element={<PortalPage />} />
                        <Route path="/portal/login" element={<PortalLoginPage />} />
                        <Route path="/portal/registro" element={<PortalRegistroPage />} />
                        <Route path="/portal/agendar" element={<PortalAgendarPage />} />
                        <Route path="/portal/meus-agendamentos" element={<PortalMeusAgendamentosPage />} />

            {/* Portal SaaS Admin (menu lateral proprio) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute redirectTo="/admin/login" allowedUserTypes={["saas_admin"]}>
                  <AdminPortalPage />
                </ProtectedRoute>
              }
            />
            
            {/* Demais páginas com sidebar e header */}
            <Route path="/dashboard/*" element={
              <ProtectedRoute>
                <>
                <Sidebar />
                <div className="content">
                  <Header />
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      <Route path="/" element={<ProtectedRoute requiredPermission="DASHBOARD_VIEW"><Dashboard title="" value="" /></ProtectedRoute>} />

                      <Route path="/pessoas/pacientes/PatientsPage" element={<ProtectedRoute requiredPermissions={["PATIENTS_VIEW", "PATIENTS_MANAGE"]}><PatientsPage /></ProtectedRoute>} />
                      <Route path="/pessoas/usuarios" element={<ProtectedRoute requiredPermission="USERS_MANAGE"><UsersPage /></ProtectedRoute>} />
                      <Route path="/pessoas/funcionarios" element={<ProtectedRoute requiredPermissions={["STAFF_VIEW", "STAFF_MANAGE"]}><FuncionariosPage /></ProtectedRoute>} />
                      <Route path="/pessoas/dentistas" element={<ProtectedRoute requiredPermissions={["DENTISTS_VIEW", "DENTISTS_MANAGE"]}><DentistasPage /></ProtectedRoute>} />

                      <Route path="/agendamentos" element={<ProtectedRoute requiredPermissions={["SCHEDULINGS_VIEW", "SCHEDULINGS_MANAGE"]}><AgendamentosPage /></ProtectedRoute>} />
                      <Route path="/agendamentos/relatorio-agendamentos" element={<ProtectedRoute requiredPermissions={["SCHEDULINGS_VIEW", "SCHEDULINGS_MANAGE"]}><RelatorioAgendamentos /></ProtectedRoute>} />
                      <Route path="/agendamentos/relatorio-procedimentos" element={<ProtectedRoute requiredPermissions={["SCHEDULINGS_VIEW", "SCHEDULINGS_MANAGE"]}><RelatorioProcedimentos /></ProtectedRoute>} />

                      <Route path="/cadastros/procedimentos" element={<ProtectedRoute requiredPermissions={["PROCEDURES_VIEW", "PROCEDURES_MANAGE"]}><ProcedimentosPage /></ProtectedRoute>} />
                      <Route path="/cadastros/convenios" element={<ProtectedRoute requiredPermissions={["AGREEMENTS_VIEW", "AGREEMENTS_MANAGE"]}><ConveniosPage /></ProtectedRoute>} />
                      <Route path="/cadastros/itens-anamnese" element={<ProtectedRoute requiredPermissions={["ANAMNESE_ITEMS_VIEW", "ANAMNESE_ITEMS_MANAGE"]}><ItensAnamnesePage /></ProtectedRoute>} />
                      <Route path="/cadastros/grupos-anamnese" element={<ProtectedRoute requiredPermissions={["ANAMNESE_GROUPS_VIEW", "ANAMNESE_GROUPS_MANAGE"]}><GruposAnamnesePage /></ProtectedRoute>} />
                      <Route path="/cadastros/formas-pgto" element={<ProtectedRoute requiredPermissions={["PAYMENT_METHODS_VIEW", "PAYMENT_METHODS_MANAGE"]}><FormasPagamentoPage /></ProtectedRoute>} />
                      <Route path="/cadastros/frequencias" element={<ProtectedRoute requiredPermissions={["FREQUENCIES_VIEW", "FREQUENCIES_MANAGE"]}><FrequenciasPage /></ProtectedRoute>} />
                      <Route path="/cadastros/cargos" element={<ProtectedRoute requiredPermissions={["CARGOS_VIEW", "CARGOS_MANAGE"]}><CargosPage /></ProtectedRoute>} />

                      <Route path="/fornecedores" element={<ProtectedRoute requiredPermissions={["SUPPLIERS_VIEW", "SUPPLIERS_MANAGE"]}><FornecedoresPage /></ProtectedRoute>} />
                      <Route path="cadastros/fornecedores" element={<ProtectedRoute requiredPermissions={["SUPPLIERS_VIEW", "SUPPLIERS_MANAGE"]}><FornecedoresPage /></ProtectedRoute>} />

                      <Route path="/financeiro" element={<ProtectedRoute requiredPermission="FINANCE_DASHBOARD_VIEW"><FinanceiroDashboard /></ProtectedRoute>} />
                      <Route path="/financeiro/contas-pagar" element={<ProtectedRoute requiredPermissions={["FINANCE_PAYABLE_VIEW", "FINANCE_PAYABLE_MANAGE"]}><ContasPagarPage /></ProtectedRoute>} />
                      <Route path="/financeiro/contas-receber" element={<ProtectedRoute requiredPermissions={["FINANCE_RECEIVABLE_VIEW", "FINANCE_RECEIVABLE_MANAGE"]}><ContasReceberPage /></ProtectedRoute>} />
                      <Route path="/financeiro/recebimentos-convenio" element={<ProtectedRoute requiredPermissions={["FINANCE_RECEIVABLE_VIEW", "FINANCE_RECEIVABLE_MANAGE"]}><RecebimentosConvenioPage /></ProtectedRoute>} />
                      <Route path="/financeiro/comissoes" element={<ProtectedRoute requiredPermissions={["FINANCE_DASHBOARD_VIEW", "FINANCE_REPORTS_VIEW"]}><ComissoesPage /></ProtectedRoute>} />

                      <Route path="/consultas" element={<ProtectedRoute requiredPermission="CONSULTAS_VIEW"><ConsultaPage /></ProtectedRoute>} />
                      <Route path="/financeiro/consulta" element={<ProtectedRoute requiredPermission="CONSULTAS_VIEW"><ConsultaPage /></ProtectedRoute>} />
                      <Route path="/horarios" element={<ProtectedRoute requiredPermission="HORARIOS_VIEW"><HorariosPage /></ProtectedRoute>} />
                      <Route path="/minhas-comissoes" element={<ProtectedRoute requiredPermission="COMISSOES_SELF_VIEW"><MinhasComissoesPage /></ProtectedRoute>} />

                      <Route path="/odontogramas" element={<ProtectedRoute requiredPermissions={["ODONTOGRAM_VIEW", "ODONTOGRAM_MANAGE"]}><OdontogramasPage /></ProtectedRoute>} />
                      <Route path="/tratamentos" element={<ProtectedRoute requiredPermissions={["TREATMENTS_MANAGE", "TREATMENTS_ASSIST"]}><TratamentosPage /></ProtectedRoute>} />
                      <Route path="/orcamentos" element={<ProtectedRoute requiredPermissions={["ORCAMENTOS_VIEW", "ORCAMENTOS_MANAGE"]}><OrcamentosPage /></ProtectedRoute>} />

                      <Route path="/caixa" element={<ProtectedRoute requiredPermission="FINANCE_CASHFLOW_VIEW"><CaixaPage /></ProtectedRoute>} />
                      <Route path="/caixas-aberto" element={<ProtectedRoute requiredPermission="FINANCE_CASHFLOW_VIEW"><CaixaPage /></ProtectedRoute>} />
                      <Route path="/tarefas" element={<ProtectedRoute requiredPermission="TASKS_VIEW"><TarefasPage /></ProtectedRoute>} />
                      <Route path="/tarefas-agenda" element={<ProtectedRoute requiredPermission="TASKS_VIEW"><TarefasPage /></ProtectedRoute>} />
                      <Route path="/anotacoes" element={<ProtectedRoute requiredPermission="NOTES_VIEW"><AnotacoesPage /></ProtectedRoute>} />

                      <Route path="/relatorios/financeiro" element={<ProtectedRoute requiredPermission="FINANCE_REPORTS_VIEW"><RelatorioFinanceiroPage /></ProtectedRoute>} />
                      <Route path="/relatorios/relatorio-financeiro" element={<ProtectedRoute requiredPermission="FINANCE_REPORTS_VIEW"><RelatorioFinanceiroPage /></ProtectedRoute>} />
                      <Route path="/relatorios/sintetico-despesas" element={<ProtectedRoute requiredPermission="FINANCE_REPORTS_VIEW"><RelatorioSinteticoDespesasPage /></ProtectedRoute>} />
                      <Route path="/relatorios/relatorio-sintetico-despesas" element={<ProtectedRoute requiredPermission="FINANCE_REPORTS_VIEW"><RelatorioSinteticoDespesasPage /></ProtectedRoute>} />
                      <Route path="/relatorios/sintetico-recebimentos" element={<ProtectedRoute requiredPermission="FINANCE_REPORTS_VIEW"><RelatorioSinteticoRecebimentosPage /></ProtectedRoute>} />
                      <Route path="/relatorios/relatorio-sintetico-receber" element={<ProtectedRoute requiredPermission="FINANCE_REPORTS_VIEW"><RelatorioSinteticoRecebimentosPage /></ProtectedRoute>} />
                      <Route path="/relatorios/balanco-anual" element={<ProtectedRoute requiredPermission="FINANCE_REPORTS_VIEW"><RelatorioBalancoAnualPage /></ProtectedRoute>} />
                      <Route path="/relatorios/relatorio-balanco-anual" element={<ProtectedRoute requiredPermission="FINANCE_REPORTS_VIEW"><RelatorioBalancoAnualPage /></ProtectedRoute>} />
                      <Route path="/relatorios/inadimplentes" element={<ProtectedRoute requiredPermission="FINANCE_REPORTS_VIEW"><RelatorioInadimplentesPage /></ProtectedRoute>} />
                      <Route path="/relatorios/relatorio-inadimplementes" element={<ProtectedRoute requiredPermission="FINANCE_REPORTS_VIEW"><RelatorioInadimplentesPage /></ProtectedRoute>} />
                    </Routes>
                  </Suspense>
                </div>
                </>
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
        <ConsentBanner
          onAccept={handleConsentAccept}
          onReject={handleConsentReject}
          onCustomize={handleConsentCustomize}
        />
        {notifications.map((notif) => (
          <Notification
            key={notif.id}
            message={notif.message}
            type={notif.type}
            onClose={() => hideNotification(notif.id)}
          />
        ))}
      </div>
    </Router>
  );
};

export default App;

