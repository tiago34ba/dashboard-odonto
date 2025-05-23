import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { FaBell, FaDollarSign, FaEnvelope, FaUser, FaCalendarAlt } from "react-icons/fa";
import PieChartComponent from "../../components/Charts/PieChartComponent";

interface CardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
}

const CardWrapper = styled.div<{ color: string }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 15px;
  width: 200px; /* Reduzido para caber mais cards */
  height: 100px; /* Reduzido para caber mais cards */
  border-left: 5px solid ${(props) => props.color};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.div`
  font-size: 14px; /* Reduzido */
  color: #333;
  font-weight: bold;
`;

const CardIcon = styled.div`
  font-size: 20px; /* Reduzido */
  color: ${(props) => props.color};
`;

const CardValue = styled.div`
  font-size: 18px; /* Reduzido */
  font-weight: bold;
  color: #333;
  margin-top: 5px;
`;

const CardSubtitle = styled.div`
  font-size: 12px; /* Reduzido */
  color: #666;
`;

const Card: React.FC<CardProps> = ({ title, value, subtitle, icon, color }) => {
  return (
    <CardWrapper color={color}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardIcon color={color}>{icon}</CardIcon>
      </CardHeader>
      <CardValue>{value}</CardValue>
      {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
    </CardWrapper>
  );
};

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* Permite que os cards quebrem linha */
  gap: 15px; /* Reduzido para economizar espaço */
  margin-top: 20px;
`;

const LanguageSelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 10px;

  label {
    margin-right: 10px;
    font-size: 14px;
    color: #333;
  }

  select {
    padding: 5px;
    font-size: 14px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header: React.FC = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const isHomePage = useMemo(() => location.pathname === "/", [location.pathname]);

  const languages = [
    { code: "pt-BR", name: "Português (Brasil)", flag: "🇧🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ];

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

  const currentLanguageValue = useMemo(() => {
    const currentLang = i18n.language || ""; // Garante que currentLang seja uma string
    const match = languages.find(
      (lang) => currentLang === lang.code || currentLang.startsWith(lang.code + "-")
    );
    return match ? match.code : languages[0].code;
  }, [i18n.language]);

  return (
    <header className="header">
      <HeaderContent>
        <LanguageSelector>
          <label htmlFor="language-select">{t("Idiomas")}</label>
          <select
            id="language-select"
            value={currentLanguageValue}
            onChange={changeLanguage}
            className="language-select-dropdown"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </LanguageSelector>
        {isHomePage && (
          <>
            <CardsContainer>
              <Card
                title={t("Notificações")}
                value={5}
                subtitle={t("Novas notificações")}
                icon={<FaBell />}
                color="#007bff"
              />
              <Card
                title={t("Financeiro")}
                value="R$ 1.200,00"
                subtitle={t("Saldo disponível")}
                icon={<FaDollarSign />}
                color="#28a745"
              />
              <Card
                title={t("Mensagens")}
                value={3}
                subtitle={t("Novas mensagens")}
                icon={<FaEnvelope />}
                color="#ffc107"
              />
              <Card
                title={t("Perfil")}
                value={1}
                subtitle={t("Atualizações pendentes")}
                icon={<FaUser />}
                color="#17a2b8"
              />
            </CardsContainer>
            <CardsContainer>
              <Card
                title={t("Total de Tarefas Pendentes")}
                value={3}
                subtitle={`${t("Pendentes Hoje")} ↑ 0 | ${t("Tarefas Atrasadas")} ↓ 0`}
                icon={<FaCalendarAlt />}
                color="#dc3545"
              />
              <Card
                title={t("Consultas Finalizadas Hoje")}
                value={0}
                subtitle={`${t("Este Mês")} ↑ 1 | ${t("Ontem")} ↓ 0`}
                icon={<FaCalendarAlt />}
                color="#007bff"
              />
            </CardsContainer>
            <div style={{ marginTop: "20px" }}>
              <h3>{t("Gráfico de Contas")}</h3>
              <PieChartComponent />
            </div>
          </>
        )}
      </HeaderContent>
    </header>
  );
};

export default Header;
