import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar/Sidebar";
import Header from "./components/layout/Header/Header";
import { ConsentBanner } from "./components/ui/LGPD/ConsentBanner";
import { Notification, useNotification } from "./components/ui/Notification/Notification";
import LoadingSpinner from "./components/ui/LoadingSpinner/LoadingSpinner";
import "./App.css";

// Lazy loading das páginas principais
const InstitucionalPage = React.lazy(() => import("./pages/Institucional/InstitucionalPage"));
const PlanosPage = React.lazy(() => import("./pages/Planos/PlanosPage"));
const LoginPage = React.lazy(() => import("./pages/Auth/LoginPage"));
const RegisterPage = React.lazy(() => import("./pages/Auth/RegisterPage"));

// Lazy loading das páginas do dashboard
const Dashboard = React.lazy(() => import("./pages/Dashboard/DashboardCards"));
const PatientsPage = React.lazy(() => import("./pages/Modulos/clientes/PatientsPage/PatientsPage"));
const UsersPage = React.lazy(() => import("./pages/Modulos/Usuarios/UsersPage/UsersPage"));
const EmployeePage = React.lazy(() => import("./pages/Modulos/funcionarios/EmployeePage/EmployeePage"));
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
const GrupoAcessosPage = React.lazy(() => import("./pages/Modulos/cadastros/GrupoAcessos/GrupoAcessosPage"));
const AcessosPage = React.lazy(() => import("./pages/Modulos/cadastros/Acessos/AcessosPage"));
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

const App: React.FC = () => {
  const { notifications, hideNotification } = useNotification();

  const handleConsentAccept = () => {
    console.log('Consentimento LGPD aceito');
  };

  const handleConsentReject = () => {
    console.log('Consentimento LGPD rejeitado');
  };

  const handleConsentCustomize = () => {
    console.log('Consentimento LGPD personalizado');
  };

  return (
    <Router>
      <div className="app">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Página Institucional como página inicial (sem sidebar/header) */}
            <Route path="/" element={<InstitucionalPage />} />
            
            {/* Página de Planos (sem sidebar/header) */}
            <Route path="/planos" element={<PlanosPage />} />
            
            {/* Páginas de Autenticação (sem sidebar/header) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            
            {/* Demais páginas com sidebar e header */}
            <Route path="/dashboard/*" element={
              <>
                <Sidebar />
                <div className="content">
                  <Header />
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      <Route path="/" element={<Dashboard title="" value="" />} />
                      <Route path="/pessoas/pacientes/PatientsPage" element={<PatientsPage />} />
                      <Route path="/pessoas/usuarios" element={<UsersPage />} />
                      <Route path="/pessoas/funcionarios" element={<EmployeePage />} />
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
                      <Route path="/cadastros/grupo-acessos" element={<GrupoAcessosPage />} />
                      <Route path="/cadastros/acessos" element={<AcessosPage />} />
                      <Route path="/cadastros/fornecedores" element={<FornecedoresPage />} />
                      <Route path="/financeiro" element={<FinanceiroDashboard />} />
                      <Route path="/financeiro/contas-pagar" element={<ContasPagarPage />} />
                      <Route path="/financeiro/contas-receber" element={<ContasReceberPage />} />
                      <Route path="/financeiro/recebimentos-convenio" element={<RecebimentosConvenioPage />} />
                      <Route path="/financeiro/comissoes" element={<ComissoesPage />} />
                      <Route path="/financeiro/consulta" element={<ConsultaPage />} />
                      <Route path="/consultas" element={<ConsultaPage />} />
                      <Route path="/horarios" element={<HorariosPage />} />
                      <Route path="/minhas-comissoes" element={<MinhasComissoesPage />} />
                      <Route path="/odontogramas" element={<OdontogramasPage />} />
                      <Route path="/tratamentos" element={<TratamentosPage />} />
                      <Route path="/orcamentos" element={<OrcamentosPage />} />
                      <Route path="/caixas-aberto" element={<CaixaPage />} />
                      <Route path="/tarefas-agenda" element={<TarefasPage />} />
                      <Route path="/anotacoes" element={<AnotacoesPage />} />
                      <Route path="/relatorios/relatorio-financeiro" element={<RelatorioFinanceiroPage />} />
                      <Route path="/relatorios/relatorio-sintetico-despesas" element={<RelatorioSinteticoDespesasPage />} />
                      <Route path="/relatorios/relatorio-sintetico-receber" element={<RelatorioSinteticoRecebimentosPage />} />
                      <Route path="/relatorios/relatorio-balanco-anual" element={<RelatorioBalancoAnualPage />} />
                      <Route path="/relatorios/relatorio-inadimplementes" element={<RelatorioInadimplentesPage />} />
                    </Routes>
                  </Suspense>
                </div>
              </>
            } />
          </Routes>
        </Suspense>
        
        {/* Banner de Consentimento LGPD */}
        <ConsentBanner
          onAccept={handleConsentAccept}
          onReject={handleConsentReject}
          onCustomize={handleConsentCustomize}
        />
        
        {/* Notificações */}
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => hideNotification(notification.id)}
          />
        ))}
      </div>
    </Router>
  );
};

export default App;