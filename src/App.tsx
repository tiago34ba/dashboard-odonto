import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Dashboard from "./pages/Dashboard/DashboardCards";
import "./App.css";

// Carregamento tardio para PatientsPage (exemplo para futuras otimizações)
const PatientsPage = lazy(() => import("./pages/Pessoas/clientes/PatientsPage/PatientsPage"));

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard title={""} value={""} />} />
            {/* Rota para PatientsPage com Suspense para carregamento tardio */}
            <Route
              path="/clientes"
              element={
                <Suspense fallback={<div>Carregando...</div>}>
                  <PatientsPage />
                </Suspense>
              }
            />
            {/* Adicione outras rotas aqui */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;