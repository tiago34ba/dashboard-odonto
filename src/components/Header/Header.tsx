import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import "../Header/Dashboard.css";

const Header: React.FC = () => {
  const location = useLocation();

  // Memorize a verificação da rota para evitar cálculos desnecessários
  const isHomePage = useMemo(() => location.pathname === "/", [location.pathname]);

  return (
    <header className="header">
      {isHomePage && (
        <div className="header-notifications">
          <div className="notification-item">
            <span aria-label="Notificações" className="icon" title="Notificações">🔔</span>
            <span className="notification-title">Notificações</span>
          </div>
          <div className="notification-item">
            <span aria-label="Financeiro" className="icon" title="Financeiro">💵</span>
            <span className="notification-title">Financeiro</span>
          </div>
          <div className="notification-item">
            <span aria-label="Mensagens" className="icon" title="Mensagens">📧</span>
            <span className="notification-title">Mensagens</span>
          </div>
          <div className="notification-item">
            <span aria-label="Perfil" className="icon" title="Perfil">👤</span>
            <span className="notification-title">Perfil</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
