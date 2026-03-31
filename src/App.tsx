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

// Lazy loading das páginas principais
const InstitucionalPage = React.lazy(() => import("./pages/Institucional/InstitucionalPage"));
const PlanosPage = React.lazy(() => import("./pages/Planos/PlanosPage"));

// Lazy loading das páginas do dashboard
const Dashboard = React.lazy(() => import("./pages/Dashboard/DashboardCards"));
const PatientsPage = React.lazy(() => import("./pages/Modulos/clientes/PatientsPage/PatientsPage"));
const UsersPage = React.lazy(() => import("./pages/Modulos/Usuarios/UsersPage/UsersPage"));
const FuncionariosPage = React.lazy(() => import("./pages/Modulos/funcionarios/EmployeePage/EmployeePage"));
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
    <Router>
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
                      <Route path="/" element={<Dashboard title="" value="" />} />
                      <Route path="/pessoas/pacientes/PatientsPage" element={<PatientsPage />} />
                      <Route path="/pessoas/usuarios" element={<ProtectedRoute requiredPermission="USERS_MANAGE"><UsersPage /></ProtectedRoute>} />
                      <Route path="/pessoas/funcionarios" element={<FuncionariosPage />} />
                      <Route path="/agendamentos" element={<AgendamentosPage />} />
                      <Route path="/agendamentos/relatorio-agendamentos" element={<RelatorioAgendamentos />} />
                      <Route path="/agendamentos/relatorio-procedimentos" element={<RelatorioProcedimentos />} />
                      <Route path="/cadastros/procedimentos" element={<ProcedimentosPage />} />
                      <Route path="/cadastros/convenios" element={<ConveniosPage />} />
                      <Route path="/cadastros/itens-anamnese" element={<ItensAnamnesePage />} />
                      <Route path="/cadastros/grupos-anamnese" element={<GruposAnamnesePage />} />
                      <Route path="/cadastros/formas-pgto" element={<FormasPagamentoPage />} />
                      <Route path="/cadastros/frequencias" element={<FrequenciasPage />} />
                      <Route path="/cadastros/cargos" element={<CargosPage />} />
                      <Route path="/fornecedores" element={<FornecedoresPage />} />
                      <Route path="cadastros/fornecedores" element={<FornecedoresPage />} />
                      <Route path="/financeiro" element={<FinanceiroDashboard />} />
                      <Route path="/financeiro/contas-pagar" element={<ContasPagarPage />} />
                      <Route path="/financeiro/contas-receber" element={<ContasReceberPage />} />
                      <Route path="/financeiro/recebimentos-convenio" element={<RecebimentosConvenioPage />} />
                      <Route path="/financeiro/comissoes" element={<ComissoesPage />} />
                      <Route path="/consultas" element={<ConsultaPage />} />
                      <Route path="/financeiro/consulta" element={<ConsultaPage />} />
                      <Route path="/horarios" element={<HorariosPage />} />
                      <Route path="/minhas-comissoes" element={<MinhasComissoesPage />} />
                      <Route path="/odontogramas" element={<OdontogramasPage />} />
                      <Route path="/tratamentos" element={<TratamentosPage />} />
                      <Route path="/orcamentos" element={<OrcamentosPage />} />
                      <Route path="/caixa" element={<CaixaPage />} />
                      <Route path="/caixas-aberto" element={<CaixaPage />} />
                      <Route path="/tarefas" element={<TarefasPage />} />
                      <Route path="/tarefas-agenda" element={<TarefasPage />} />
                      <Route path="/anotacoes" element={<AnotacoesPage />} />
                      <Route path="/relatorios/financeiro" element={<RelatorioFinanceiroPage />} />
                      <Route path="/relatorios/relatorio-financeiro" element={<RelatorioFinanceiroPage />} />
                      <Route path="/relatorios/sintetico-despesas" element={<RelatorioSinteticoDespesasPage />} />
                      <Route path="/relatorios/relatorio-sintetico-despesas" element={<RelatorioSinteticoDespesasPage />} />
                      <Route path="/relatorios/sintetico-recebimentos" element={<RelatorioSinteticoRecebimentosPage />} />
                      <Route path="/relatorios/relatorio-sintetico-receber" element={<RelatorioSinteticoRecebimentosPage />} />
                      <Route path="/relatorios/balanco-anual" element={<RelatorioBalancoAnualPage />} />
                      <Route path="/relatorios/relatorio-balanco-anual" element={<RelatorioBalancoAnualPage />} />
                      <Route path="/relatorios/inadimplentes" element={<RelatorioInadimplentesPage />} />
                        <Route path="/relatorios/relatorio-inadimplementes" element={<RelatorioInadimplentesPage />} />
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

