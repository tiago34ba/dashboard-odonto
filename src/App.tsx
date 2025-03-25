import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Dashboard from "./pages/Dashboard/DashboardCards";
import PatientsPage from "./pages/Pessoas/clientes/PatientsPage/PatientsPage"; // Importe o componente PatientsPage
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
            {/* Rota para PatientsPage */}
            <Route
              path="/pessoas/pacientes/PatientsPage"
              element={<PatientsPage />}
            />
            {/* Adicione outras rotas aqui */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;