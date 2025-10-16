import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Dashboard from "./pages/Dashboard/DashboardCards";
import PatientsPage from "./pages/Modulos/clientes/PatientsPage/PatientsPage";
import UsersPage from "./pages/Modulos/Usuarios/UsersPage/UsersPage";
import EmployeePage from "./pages/Modulos/funcionarios/EmployeePage/EmployeePage";
import AgendamentosPage from "./pages/Modulos/agendamentos/AgendamentosPage/AgendamentosPage";
import RelatorioAgendamentos from "./pages/Modulos/agendamentos/RelatorioAgendamentos/RelatorioAgendamentos";
import RelatorioProcedimentos from "./pages/Modulos/agendamentos/RelatorioProcedimentos/RelatorioProcedimentos";
import ProcedimentosPage from "./pages/Modulos/cadastros/Procedimentos/ProcedimentosPage";
import ConveniosPage from "./pages/Modulos/cadastros/Convenios/ConveniosPage";
import ItensAnamnesePage from "./pages/Modulos/cadastros/ItensAnamnese/ItensAnamnesePage";
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
          </Routes>
        </div>
        
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