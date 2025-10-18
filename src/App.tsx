import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Dashboard from "./pages/Dashboard/DashboardCards";
import { InstitucionalPage, PlanosPage, LoginPage, RegisterPage } from "./pages";
import PatientsPage from "./pages/Modulos/clientes/PatientsPage/PatientsPage";
import UsersPage from "./pages/Modulos/Usuarios/UsersPage/UsersPage";
import EmployeePage from "./pages/Modulos/funcionarios/EmployeePage/EmployeePage";
import AgendamentosPage from "./pages/Modulos/agendamentos/AgendamentosPage/AgendamentosPage";
import RelatorioAgendamentos from "./pages/Modulos/agendamentos/RelatorioAgendamentos/RelatorioAgendamentos";
import RelatorioProcedimentos from "./pages/Modulos/agendamentos/RelatorioProcedimentos/RelatorioProcedimentos";
import ProcedimentosPage from "./pages/Modulos/cadastros/Procedimentos/ProcedimentosPage";
import ConveniosPage from "./pages/Modulos/cadastros/Convenios/ConveniosPage";
import ItensAnamnesePage from "./pages/Modulos/cadastros/ItensAnamnese/ItensAnamnesePage";
import GruposAnamnesePage from "./pages/Modulos/cadastros/GruposAnamnese/GruposAnamnesePage";
import FormasPagamentoPage from "./pages/Modulos/cadastros/FormasPagamento/FormasPagamentoPage";
import FrequenciasPage from "./pages/Modulos/cadastros/Frequencias/FrequenciasPage";
import { ConsentBanner } from "./components/LGPD/ConsentBanner";
import { Notification, useNotification } from "./components/Notification/Notification";
import "./App.css";

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
                </Routes>
              </div>
            </>
          } />
        </Routes>
        
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