import React, { useMemo, lazy, Suspense, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { 
  FaBell, FaDollarSign, FaEnvelope, FaUser, FaCalendarAlt,
  FaUserMd, FaWallet, FaArrowDown, FaArrowUp, FaChartLine,
  FaMoneyBillWave, FaFileInvoiceDollar, FaHandHoldingUsd, FaBalanceScale,
  FaSignOutAlt, FaCog
} from "react-icons/fa";
import api from "../../api/api";

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

const TopBar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const Greeting = styled.div`
  justify-self: center;
  font-size: 18px;
  color: #2d3748;
  font-weight: 600;
`;

const TopBarRight = styled.div`
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
`;

const ProfileButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px;
  border-radius: 10px;

  &:hover {
    background: #f3f4f6;
  }
`;

const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.15;

  strong {
    font-size: 13px;
    color: #1f2937;
  }

  span {
    font-size: 11px;
    color: #4b5563;
  }
`;

const ProfileMenu = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  min-width: 220px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  padding: 8px;
  z-index: 50;
`;

const MenuItem = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
  padding: 10px;
  border-radius: 8px;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    background: #f3f4f6;
  }
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
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isHomePage = useMemo(() => location.pathname === "/", [location.pathname]);

  const userData = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("userData") || localStorage.getItem("userData");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, []);

  const userName = userData?.name || userData?.nome || "Usuário";
  const userRole = userData?.grupo_acesso_nome || "Perfil";
  const initials = String(userName)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase())
    .join("") || "US";

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return `Bom dia ${userName}`;
    if (hour < 18) return `Boa tarde ${userName}`;
    return `Boa noite ${userName}`;
  }, [userName]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

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

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Mesmo em erro de rede/token, encerra sessão local.
    }

    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("userData");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <header className="header">
      <HeaderContent>
        <TopBar>
          <div />
          <Greeting>{greeting}</Greeting>
          <TopBarRight ref={menuRef}>
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

            <ProfileButton onClick={() => setMenuOpen((prev) => !prev)}>
              <Avatar>{initials}</Avatar>
              <UserInfo>
                <strong>{userName}</strong>
                <span>{userRole}</span>
              </UserInfo>
            </ProfileButton>

            {menuOpen && (
              <ProfileMenu>
                <MenuItem onClick={() => setMenuOpen(false)}>
                  <FaUser /> Perfil
                </MenuItem>
                <MenuItem onClick={() => setMenuOpen(false)}>
                  <FaCog /> Configuracoes
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <FaSignOutAlt /> Sair
                </MenuItem>
              </ProfileMenu>
            )}
          </TopBarRight>
        </TopBar>
        
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
