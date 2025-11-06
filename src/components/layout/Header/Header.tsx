import React, { useMemo, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { 
  FaBell, FaDollarSign, FaEnvelope, FaUser, FaCalendarAlt,
  FaUserMd, FaWallet, FaArrowDown, FaArrowUp, FaChartLine,
  FaMoneyBillWave, FaFileInvoiceDollar, FaHandHoldingUsd, FaBalanceScale
} from "react-icons/fa";

// Lazy loading dos gráficos
const PieChartComponent = lazy(() => import("../../shared/Charts/PieChartComponent"));
const FinancialPieChart = lazy(() => import("../../shared/Charts/FinancialPieChart"));

interface CardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
}

// Styled components otimizados
const CardWrapper = styled.div<{ color: string }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
  width: 200px;
  height: 100px;
  border-left: 4px solid ${props => props.color};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h4`
  font-size: 14px;
  color: #333;
  font-weight: 600;
  margin: 0;
`;

const CardIcon = styled.div<{ color: string }>`
  font-size: 18px;
  color: ${props => props.color};
`;

const CardValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 5px 0 0;
`;

const CardSubtitle = styled.span`
  font-size: 12px;
  color: #666;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
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
    background: white;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChartSection = styled.div`
  margin-top: 20px;
  
  h3 {
    margin-bottom: 10px;
    color: #333;
    font-size: 18px;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #666;
`;

// Componente Card memoizado
const Card = React.memo<CardProps>(({ title, value, subtitle, icon, color }) => (
  <CardWrapper color={color}>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardIcon color={color}>{icon}</CardIcon>
    </CardHeader>
    <CardValue>{value}</CardValue>
    {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
  </CardWrapper>
));

Card.displayName = 'Card';

// Dados dos cards extraídos para constantes
const CARD_DATA = [
  // Primeiro container
  [
    { title: "Pacientes", value: 127, subtitle: "Total de pacientes cadastrados", icon: <FaUserMd />, color: "#6f42c1" },
    { title: "Notificações", value: 5, subtitle: "Novas notificações", icon: <FaBell />, color: "#007bff" },
    { title: "Financeiro", value: "R$ 1.200,00", subtitle: "Saldo disponível", icon: <FaDollarSign />, color: "#28a745" },
    { title: "Mensagens", value: 3, subtitle: "Novas mensagens", icon: <FaEnvelope />, color: "#ffc107" }
  ],
  // Segundo container
  [
    { title: "Total de Tarefas Pendentes", value: 3, subtitle: "Pendentes Hoje ↑ 0 | Tarefas Atrasadas ↓ 0", icon: <FaCalendarAlt />, color: "#dc3545" },
    { title: "Consultas Finalizadas Hoje", value: 0, subtitle: "Este Mês ↑ 1 | Ontem ↓ 0", icon: <FaCalendarAlt />, color: "#007bff" },
    { title: "Saldo Financeiro", value: "R$ 8.450,00", subtitle: "Saldo total disponível", icon: <FaWallet />, color: "#20c997" },
    { title: "Despesas", value: "R$ 2.350,00", subtitle: "Gastos do mês atual", icon: <FaArrowDown />, color: "#fd7e14" }
  ],
  // Terceiro container
  [
    { title: "Receitas", value: "R$ 10.800,00", subtitle: "Receitas do mês atual", icon: <FaArrowUp />, color: "#198754" },
    { title: "Perfil", value: 1, subtitle: "Atualizações pendentes", icon: <FaUser />, color: "#17a2b8" },
    { title: "Lucro", value: "R$ 8.450,00", subtitle: "Lucro líquido do mês", icon: <FaChartLine />, color: "#28a745" },
    { title: "Custo", value: "R$ 2.350,00", subtitle: "Custos operacionais", icon: <FaMoneyBillWave />, color: "#e74c3c" }
  ],
  // Quarto container
  [
    { title: "Total Receita", value: "R$ 55.235,00", subtitle: "vs mês anterior", icon: <FaHandHoldingUsd />, color: "#28a745" },
    { title: "Total Despesas", value: "R$ 39.067,00", subtitle: "vs mês anterior", icon: <FaArrowDown />, color: "#dc3545" },
    { title: "Contas a Receber", value: "R$ 609,00", subtitle: "vs mês anterior", icon: <FaFileInvoiceDollar />, color: "#17a2b8" },
    { title: "Contas a Pagar", value: "R$ 538,00", subtitle: "vs mês anterior", icon: <FaMoneyBillWave />, color: "#fd7e14" }
  ],
  // Quinto container
  [
    { title: "Lucro Líquido", value: "R$ 6.715,00", subtitle: "vs mês anterior", icon: <FaChartLine />, color: "#28a745" },
    { title: "Saldo no final do mês", value: "R$ 7.684,00", subtitle: "Objetivo: 12,0%", icon: <FaBalanceScale />, color: "#6f42c1" },
    { title: "Índice Liquidez Reduzida", value: "1,01", subtitle: "1 ou mais - Objetivo Índice de Liquidez Reduzida", icon: <FaChartLine />, color: "#20c997" },
    { title: "Índice de Liquidez", value: "3,02", subtitle: "3 ou mais - Objetivo Índice de Liquidez", icon: <FaBalanceScale />, color: "#007bff" }
  ]
];

const LANGUAGES = [
  { code: "pt-BR", name: "Português (Brasil)", flag: "🇧🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" }
];

const Header: React.FC = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const isHomePage = useMemo(() => location.pathname === "/", [location.pathname]);

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  const currentLanguageValue = useMemo(() => {
    const currentLang = i18n.language || "";
    const match = LANGUAGES.find(
      lang => currentLang === lang.code || currentLang.startsWith(lang.code + "-")
    );
    return match?.code || LANGUAGES[0].code;
  }, [i18n.language]);

  // Renderização dos cards memoizada
  const renderCards = useMemo(() => 
    CARD_DATA.map((cardGroup, groupIndex) => (
      <CardsContainer key={groupIndex}>
        {cardGroup.map((card, cardIndex) => (
          <Card
            key={`${groupIndex}-${cardIndex}`}
            title={t(card.title)}
            value={card.value}
            subtitle={typeof card.subtitle === 'string' && card.subtitle.includes('↑') 
              ? card.subtitle.replace(/Pendentes Hoje|Este Mês|Ontem|Tarefas Atrasadas/g, (match) => t(match))
              : t(card.subtitle)
            }
            icon={card.icon}
            color={card.color}
          />
        ))}
      </CardsContainer>
    )), [t]);

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
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </LanguageSelector>
        
        {isHomePage && (
          <>
            {renderCards}
            
            <ChartSection>
              <h3>{t("Gráfico de Contas")}</h3>
              <Suspense fallback={<LoadingSpinner>Carregando gráfico...</LoadingSpinner>}>
                <PieChartComponent />
              </Suspense>
            </ChartSection>
            
            <ChartSection>
              <h3>{t("Gráfico Financeiro")}</h3>
              <Suspense fallback={<LoadingSpinner>Carregando gráfico...</LoadingSpinner>}>
                <FinancialPieChart />
              </Suspense>
            </ChartSection>
          </>
        )}
      </HeaderContent>
    </header>
  );
};

export default Header;
