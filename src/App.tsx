import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Dashboard from "./pages/Dashboard/DashboardCards";
import PatientsPage from "./pages/Modulos/clientes/PatientsPage/PatientsPage";
import UsersPage from "./pages/Modulos/Usuarios/UsersPage/UsersPage";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard title={""} value={""} />} />
            <Route path="/pessoas/pacientes/PatientsPage" element={<PatientsPage />} />
            <Route path="/pessoas/usuarios" element={<UsersPage />} /> {/* Ajuste da rota */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;