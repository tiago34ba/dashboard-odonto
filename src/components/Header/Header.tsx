import React from "react";
import "./Dashboard.css"; // Certifique-se de que o caminho está correto

const Header: React.FC = () => {
  return (
    <header>
      <div className="notifications">
        <span>🔔</span>
        <span>💵</span>
        <span>📧</span>
        <span>👤</span>
      </div>
    </header>
  );
};

export default Header;