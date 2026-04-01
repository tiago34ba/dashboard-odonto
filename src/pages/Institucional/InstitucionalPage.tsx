import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaMobile, 
  FaChartLine, 
  FaShieldAlt,
  FaCog,
  FaHeart,
  FaClipboardCheck,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaHandshake,
  FaUserMd,
  FaClipboardList,
  FaCreditCard,
  FaTools,
  FaCheck,
  FaBuilding,
  FaCrown
} from "react-icons/fa";

type LandingEditorSectionId =
  | "barra_superior"
  | "pagina_personalizada"
  | "home"
  | "recursos"
  | "descobrir"
  | "screenshots"
  | "plano_precos"
  | "faq"
  | "testemunhos"
  | "entre_nos";

type PublicLandingSectionConfig = {
  titulo: string;
  subtitulo: string;
  visivel: boolean;
  textoBotao: string;
  linkBotao: string;
};

type PublicLandingConfig = {
  logoUrl: string;
  descricaoSite: string;
  itensMenu: string[];
  titulo: string;
  subtitulo: string;
  textoBotaoPrincipal: string;
  linkBotaoPrincipal: string;
  telefoneWhatsapp: string;
  mostrarDepoimentos: boolean;
  mostrarPlanos: boolean;
  secoes: Record<LandingEditorSectionId, PublicLandingSectionConfig>;
};

const LANDING_PAGE_STORAGE_KEY = "saas_admin_landing_page_config";

const PUBLIC_MENU_FALLBACK = [
  "Barra Superior",
  "Pagina Personalizada",
  "Home",
  "Recursos",
  "Descobrir",
  "Aplicativos Movel",
  "Plano de Precos",
  "FAQ",
  "Testemunhos",
  "Contato",
];

const normalizePublicMenuLabel = (label: string, index: number): string => {
  if (index === 5 && label.toLowerCase() === "screenshots") {
    return "Aplicativos Movel";
  }
  if (index === 9 && label.toLowerCase() === "entre nos") {
    return "Contato";
  }
  return label;
};

const createPublicSection = (titulo: string, subtitulo: string): PublicLandingSectionConfig => ({
  titulo,
  subtitulo,
  visivel: true,
  textoBotao: "",
  linkBotao: "",
});

const normalizePlanoLink = (value: string): string => {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) {
    return "#planos";
  }

  return normalized === "/planos" || normalized === "planos" ? "#planos" : value;
};

const defaultPublicLandingConfig: PublicLandingConfig = {
  logoUrl: "",
  descricaoSite: "Sistema completo para modernizar a gestao da sua clinica odontologica.",
  itensMenu: PUBLIC_MENU_FALLBACK,
  titulo: "O Sistema Odontologico Mais Completo",
  subtitulo:
    "Revolucione a gestao do seu consultorio com nossa plataforma moderna, intuitiva e repleta de funcionalidades que facilitam seu dia a dia.",
  textoBotaoPrincipal: "Comece Gratis - Cadastre-se",
  linkBotaoPrincipal: "/registro",
  telefoneWhatsapp: "(11) 99999-9999",
  mostrarDepoimentos: true,
  mostrarPlanos: true,
  secoes: {
    barra_superior: createPublicSection("SSait Odonto", "Barra superior e menu principal"),
    pagina_personalizada: createPublicSection("Pagina inicial personalizada", "Gerencie os blocos da landing page"),
    home: createPublicSection("O Sistema Odontologico Mais Completo", "Destaque o principal valor da sua clinica"),
    recursos: createPublicSection("Funcionalidades Principais", "Tudo que voce precisa para gerir seu consultorio"),
    descobrir: createPublicSection("Nossos Diferenciais", "Um bom software nao se resume apenas em funcionalidades"),
    screenshots: createPublicSection("Aplicativo Mobile", "Gerencie seu consultorio de qualquer lugar"),
    plano_precos: {
      ...createPublicSection("Planos e Precos", "Compare planos e escolha o melhor para sua clinica"),
      linkBotao: "#planos",
    },
    faq: createPublicSection("Perguntas Frequentes", "Respostas diretas para as duvidas mais comuns"),
    testemunhos: createPublicSection("Testemunhos", "Veja o que clientes dizem sobre nossa plataforma"),
    entre_nos: createPublicSection("Entre em Contato", "Nossa equipe esta pronta para ajudar voce"),
  },
};

const LANDING_PRICING_PLANS = [
  {
    name: "Basico",
    price: "R$ 70",
    icon: <FaUsers />,
    color: "#17a2b8",
    featured: false,
    features: [
      { text: "Ate 100 pacientes", included: true },
      { text: "Dashboard basico", included: true },
      { text: "Gestao de Pacientes", included: true },
      { text: "Agendamentos basicos", included: true },
      { text: "Cadastro de Procedimentos", included: true },
      { text: "Relatorios basicos", included: true },
      { text: "Suporte segunda a sexta 07:00-18:00, sabado 07:00-12:00", included: true },
      { text: "Gestao de Funcionarios", included: false },
      { text: "Gestao Financeira", included: false },
      { text: "Convenios", included: false },
      { text: "Odontogramas", included: false },
      { text: "Anamnese", included: false },
    ],
  },
  {
    name: "Profissional",
    price: "R$ 90",
    icon: <FaBuilding />,
    color: "#007bff",
    featured: true,
    features: [
      { text: "Pacientes ilimitados", included: true },
      { text: "Dashboard completo", included: true },
      { text: "Gestao de Pacientes", included: true },
      { text: "Gestao de Funcionarios", included: true },
      { text: "Agendamentos avancados", included: true },
      { text: "Gestao Financeira", included: true },
      { text: "Cadastro de Procedimentos", included: true },
      { text: "Convenios", included: true },
      { text: "Relatorios avancados", included: true },
      { text: "Suporte segunda a sexta 07:00-18:00, sabado 07:00-12:00", included: true },
      { text: "Odontogramas", included: false },
      { text: "Anamnese", included: false },
    ],
  },
  {
    name: "Premium",
    price: "R$ 160",
    icon: <FaCrown />,
    color: "#ffc107",
    featured: false,
    features: [
      { text: "Pacientes ilimitados", included: true },
      { text: "Dashboard completo", included: true },
      { text: "Gestao de Pacientes", included: true },
      { text: "Gestao de Funcionarios", included: true },
      { text: "Agendamentos completos", included: true },
      { text: "Gestao Financeira", included: true },
      { text: "Cadastro de Procedimentos", included: true },
      { text: "Convenios", included: true },
      { text: "Odontogramas", included: true },
      { text: "Anamnese completa", included: true },
      { text: "Tratamentos", included: true },
      { text: "Orcamentos", included: true },
      { text: "Todos os relatorios", included: true },
      { text: "Suporte segunda a sexta 07:00-18:00, sabado 07:00-12:00", included: true },
    ],
  },
];

const parsePublicLandingConfig = (): PublicLandingConfig => {
  if (typeof window === "undefined") {
    return defaultPublicLandingConfig;
  }

  const raw = window.localStorage.getItem(LANDING_PAGE_STORAGE_KEY);
  if (!raw) {
    return defaultPublicLandingConfig;
  }

  try {
    const parsed = JSON.parse(raw);
    const sections = (parsed?.secoes || {}) as Record<string, any>;

    const mappedSections = (Object.keys(defaultPublicLandingConfig.secoes) as LandingEditorSectionId[]).reduce(
      (acc, id) => {
        const base = defaultPublicLandingConfig.secoes[id];
        const incoming = sections?.[id] || {};
        const nextLink = String(incoming?.linkBotao ?? base.linkBotao);
        acc[id] = {
          titulo: String(incoming?.titulo ?? base.titulo),
          subtitulo: String(incoming?.subtitulo ?? base.subtitulo),
          visivel: Boolean(incoming?.visivel ?? base.visivel),
          textoBotao: String(incoming?.textoBotao ?? base.textoBotao),
          linkBotao: id === "plano_precos" ? normalizePlanoLink(nextLink) : nextLink,
        };
        return acc;
      },
      {} as Record<LandingEditorSectionId, PublicLandingSectionConfig>
    );

    const incomingMenu = Array.isArray(parsed?.itensMenu)
      ? parsed.itensMenu
          .map((item: any, index: number) => normalizePublicMenuLabel(String(item || "").trim(), index))
          .filter(Boolean)
      : [];

    return {
      logoUrl: String(parsed?.logoUrl ?? defaultPublicLandingConfig.logoUrl),
      descricaoSite: String(parsed?.descricaoSite ?? defaultPublicLandingConfig.descricaoSite),
      itensMenu: PUBLIC_MENU_FALLBACK.map((item, index) => normalizePublicMenuLabel(incomingMenu[index] || item, index)),
      titulo: String(parsed?.titulo ?? defaultPublicLandingConfig.titulo),
      subtitulo: String(parsed?.subtitulo ?? defaultPublicLandingConfig.subtitulo),
      textoBotaoPrincipal: String(parsed?.textoBotaoPrincipal ?? defaultPublicLandingConfig.textoBotaoPrincipal),
      linkBotaoPrincipal: String(parsed?.linkBotaoPrincipal ?? defaultPublicLandingConfig.linkBotaoPrincipal),
      telefoneWhatsapp: String(parsed?.telefoneWhatsapp ?? defaultPublicLandingConfig.telefoneWhatsapp),
      mostrarDepoimentos: Boolean(parsed?.mostrarDepoimentos ?? defaultPublicLandingConfig.mostrarDepoimentos),
      mostrarPlanos: Boolean(parsed?.mostrarPlanos ?? defaultPublicLandingConfig.mostrarPlanos),
      secoes: mappedSections,
    };
  } catch {
    return defaultPublicLandingConfig;
  }
};

const PageWrapper = styled.div`
  background-color: #f8f9fa;
  min-height: 100vh;
  width: 100%;
`;

const NavBar = styled.nav`
  background: #ffffff;
  padding: 15px 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #007bff;
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 36px;
    height: 36px;
    object-fit: contain;
    border-radius: 8px;
    background: #ffffff;
  }
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #007bff;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    z-index: 999;
  }
`;

const MobileNavLink = styled.a`
  display: block;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  
  &:hover {
    color: #007bff;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const NavLink = styled.a`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.3s ease;
  cursor: pointer;
  
  &:hover {
    color: #007bff;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.3s ease;
  
  &:hover {
    color: #007bff;
  }
  
  svg {
    transition: transform 0.3s ease;
    transform: ${({ 'data-open': isOpen }: any) => isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 15px 0;
  min-width: 250px;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: translateY(${props => props.isOpen ? '0' : '-10px'});
  transition: all 0.3s ease;
`;

const DropdownItem = styled.a`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  gap: 12px;
  
  &:hover {
    background: #f8f9fa;
    color: #007bff;
  }
  
  svg {
    font-size: 1.1rem;
    color: #007bff;
  }
`;

const NavActions = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const NavButton = styled.button`
  background: transparent;
  border: 2px solid #007bff;
  color: #007bff;
  padding: 8px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: #007bff;
    color: white;
  }
  
  &.primary {
    background: #007bff;
    color: white;
    
    &:hover {
      background: #0056b3;
    }
  }
`;

const MainContent = styled.div`
  background-color: #ffffff;
  width: 100%;
  overflow-y: auto;
  margin-top: 80px; /* Para compensar o navbar fixo */
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 80px 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
`;

const MainTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.4rem;
  margin-bottom: 40px;
  opacity: 0.9;
  line-height: 1.6;
`;

const CTAButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 18px 40px;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
  
  &:hover {
    background: #218838;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
  }
`;

const FeaturesSection = styled.section`
  padding: 80px 40px;
  background: #ffffff;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.8rem;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 700;
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 60px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureIcon = styled.div<{ color: string }>`
  width: 80px;
  height: 80px;
  margin: 0 auto 25px;
  background: ${props => props.color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: #6c757d;
  line-height: 1.6;
  font-size: 1rem;
`;

const StatsSection = styled.section`
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
  color: white;
  padding: 80px 40px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto;
`;

const StatCard = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const ContactSection = styled.section`
  background: #f8f9fa;
  padding: 80px 40px;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  max-width: 800px;
  margin: 0 auto;
`;

const ContactCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

const ContactIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  background: ${props => props.color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
`;

const ContactInfo = styled.div`
  h4 {
    color: #2c3e50;
    margin-bottom: 10px;
    font-weight: 600;
  }
  
  p {
    color: #6c757d;
    margin: 0;
  }
`;

const Footer = styled.footer`
  background: #2c3e50;
  color: white;
  padding: 40px;
  text-align: center;
`;

const InstitucionalPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [recursosDropdownOpen, setRecursosDropdownOpen] = React.useState(false);
  const [landingConfig, setLandingConfig] = React.useState<PublicLandingConfig>(parsePublicLandingConfig);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const syncConfig = () => setLandingConfig(parsePublicLandingConfig());

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === LANDING_PAGE_STORAGE_KEY) {
        syncConfig();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("saas-landing-config-updated", syncConfig as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("saas-landing-config-updated", syncConfig as EventListener);
    };
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRecursosDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAccessDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoToPlanos = () => {
    scrollToSection('planos');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoToRegister = () => {
    navigate('/registro');
  };

  const menuLabel = (index: number, fallback: string) => {
    return landingConfig.itensMenu[index] || fallback;
  };

  const sectionConfig = (
    id: LandingEditorSectionId,
    fallbackTitle: string,
    fallbackSubtitle: string
  ): PublicLandingSectionConfig => {
    const found = landingConfig.secoes[id];
    if (!found) {
      return createPublicSection(fallbackTitle, fallbackSubtitle);
    }
    return {
      ...found,
      titulo: found.titulo || fallbackTitle,
      subtitulo: found.subtitulo || fallbackSubtitle,
    };
  };

  const homeSection = sectionConfig("home", landingConfig.titulo, landingConfig.subtitulo);
  const recursosSection = sectionConfig(
    "recursos",
    "Funcionalidades Principais",
    "Tudo que voce precisa para gerir seu consultorio de forma eficiente e moderna"
  );
  const screenshotsSection = sectionConfig(
    "screenshots",
    "Aplicativo Mobile",
    "Gerencie seu consultorio de qualquer lugar com nosso aplicativo completo"
  );
  const descobrirSection = sectionConfig(
    "descobrir",
    "Nossos Diferenciais",
    "Um bom software nao se resume apenas em funcionalidades"
  );
  const faqSection = sectionConfig(
    "faq",
    "Perguntas Frequentes",
    "Respostas rapidas para as duvidas mais comuns"
  );
  const testemunhosSection = sectionConfig(
    "testemunhos",
    "Testemunhos",
    "O que clientes falam sobre a plataforma"
  );
  const entreNosSection = sectionConfig(
    "entre_nos",
    "Entre em Contato",
    "Nossa equipe esta pronta para ajudar voce a revolucionar seu consultorio"
  );

  const openConfiguredLink = (link: string, fallback: () => void) => {
    const url = String(link || "").trim();
    if (!url) {
      fallback();
      return;
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    if (url === "/planos" || url === "planos") {
      handleGoToPlanos();
      return;
    }

    if (url.startsWith("/")) {
      navigate(url);
      return;
    }

    if (url.startsWith("#")) {
      scrollToSection(url.slice(1));
      return;
    }

    fallback();
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false); // Fechar menu mobile após navegação
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleRecursosDropdown = () => {
    setRecursosDropdownOpen(!recursosDropdownOpen);
  };

  const handleRecursoClick = (modulo: string) => {
    setRecursosDropdownOpen(false);
    
    switch(modulo) {
      case 'Agendamentos':
        navigate('/dashboard/agendamentos');
        break;
      case 'Pacientes':
        navigate('/dashboard/pessoas/pacientes/PatientsPage');
        break;
      case 'Funcionarios':
        navigate('/dashboard/pessoas/funcionarios');
        break;
      case 'Procedimentos':
        navigate('/dashboard/cadastros/procedimentos');
        break;
      case 'Convenios':
        navigate('/dashboard/cadastros/convenios');
        break;
      case 'Anamnese':
        navigate('/dashboard/cadastros/itens-anamnese');
        break;
      case 'Relatorios':
        navigate('/dashboard/agendamentos/relatorio-agendamentos');
        break;
      case 'Pagamentos':
        navigate('/dashboard/cadastros/formas-pgto');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <PageWrapper>
      {/* Navigation Bar */}
      <NavBar>
        <Logo>
          {landingConfig.logoUrl ? (
            <img src={landingConfig.logoUrl} alt="Logo do site" />
          ) : (
            <FaHeart />
          )}
          {landingConfig.secoes.barra_superior.titulo || "SSait Odonto"}
        </Logo>
        
        <NavMenu>
          {homeSection.visivel ? (
            <NavLink onClick={() => scrollToSection('home')}>{menuLabel(2, 'Home')}</NavLink>
          ) : null}

          {recursosSection.visivel ? (
            <DropdownContainer ref={dropdownRef}>
              <DropdownButton 
                onClick={toggleRecursosDropdown}
                data-open={recursosDropdownOpen}
              >
                {menuLabel(3, 'Recursos')} <FaChevronDown />
              </DropdownButton>
              <DropdownMenu isOpen={recursosDropdownOpen}>
                <DropdownItem onClick={() => handleRecursoClick('Agendamentos')}>
                  <FaCalendarAlt />
                  Sistema de Agendamentos
                </DropdownItem>
                <DropdownItem onClick={() => handleRecursoClick('Pacientes')}>
                  <FaUsers />
                  Gestão de Pacientes
                </DropdownItem>
                <DropdownItem onClick={() => handleRecursoClick('Funcionarios')}>
                  <FaUserMd />
                  Gestão de Funcionários
                </DropdownItem>
                <DropdownItem onClick={() => handleRecursoClick('Procedimentos')}>
                  <FaTools />
                  Cadastro de Procedimentos
                </DropdownItem>
                <DropdownItem onClick={() => handleRecursoClick('Convenios')}>
                  <FaHandshake />
                  Gestão de Convênios
                </DropdownItem>
                <DropdownItem onClick={() => handleRecursoClick('Anamnese')}>
                  <FaClipboardList />
                  Sistema de Anamnese
                </DropdownItem>
                <DropdownItem onClick={() => handleRecursoClick('Relatorios')}>
                  <FaChartLine />
                  Relatórios Avançados
                </DropdownItem>
                <DropdownItem onClick={() => handleRecursoClick('Pagamentos')}>
                  <FaCreditCard />
                  Formas de Pagamento
                </DropdownItem>
              </DropdownMenu>
            </DropdownContainer>
          ) : null}

          {landingConfig.mostrarPlanos && landingConfig.secoes.plano_precos.visivel ? (
            <NavLink
              onClick={() =>
                openConfiguredLink(
                  landingConfig.secoes.plano_precos.linkBotao,
                  handleGoToPlanos
                )
              }
            >
              {menuLabel(6, 'Plano de Precos')}
            </NavLink>
          ) : null}

          {screenshotsSection.visivel ? (
            <NavLink onClick={() => scrollToSection('aplicativo')}>{menuLabel(5, 'Aplicativos Movel')}</NavLink>
          ) : null}

          {faqSection.visivel ? (
            <NavLink onClick={() => scrollToSection('faq')}>{menuLabel(7, 'FAQ')}</NavLink>
          ) : null}

          {landingConfig.mostrarDepoimentos && testemunhosSection.visivel ? (
            <NavLink onClick={() => scrollToSection('testemunhos')}>{menuLabel(8, 'Testemunhos')}</NavLink>
          ) : null}

          {entreNosSection.visivel ? (
            <NavLink onClick={() => scrollToSection('contato')}>{menuLabel(9, 'Contato')}</NavLink>
          ) : null}
        </NavMenu>
        
        <NavActions>
          <MobileMenuButton onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </MobileMenuButton>
          
          <NavButton onClick={handleGoToLogin}>
            Login
          </NavButton>
          <NavButton className="primary" onClick={handleGoToRegister}>
            Cadastre-se
          </NavButton>
        </NavActions>
      </NavBar>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen}>
        {homeSection.visivel ? (
          <MobileNavLink onClick={() => scrollToSection('home')}>{menuLabel(2, 'Home')}</MobileNavLink>
        ) : null}
        {recursosSection.visivel ? (
          <MobileNavLink onClick={() => scrollToSection('funcionalidades')}>{menuLabel(3, 'Recursos')}</MobileNavLink>
        ) : null}
        {landingConfig.mostrarPlanos && landingConfig.secoes.plano_precos.visivel ? (
          <MobileNavLink
            onClick={() =>
              openConfiguredLink(
                landingConfig.secoes.plano_precos.linkBotao,
                handleGoToPlanos
              )
            }
          >
            {menuLabel(6, 'Plano de Precos')}
          </MobileNavLink>
        ) : null}
        {screenshotsSection.visivel ? (
          <MobileNavLink onClick={() => scrollToSection('aplicativo')}>{menuLabel(5, 'Aplicativos Movel')}</MobileNavLink>
        ) : null}
        {faqSection.visivel ? (
          <MobileNavLink onClick={() => scrollToSection('faq')}>{menuLabel(7, 'FAQ')}</MobileNavLink>
        ) : null}
        {landingConfig.mostrarDepoimentos && testemunhosSection.visivel ? (
          <MobileNavLink onClick={() => scrollToSection('testemunhos')}>{menuLabel(8, 'Testemunhos')}</MobileNavLink>
        ) : null}
        {entreNosSection.visivel ? (
          <MobileNavLink onClick={() => scrollToSection('contato')}>{menuLabel(9, 'Contato')}</MobileNavLink>
        ) : null}
      </MobileMenu>

      <MainContent>
        {/* Hero Section */}
        {homeSection.visivel ? (
        <HeroSection id="home">
          <HeroContent>
            <MainTitle>{homeSection.titulo || landingConfig.titulo || "O Sistema Odontologico Mais Completo"}</MainTitle>
            <Subtitle>
              {homeSection.subtitulo || landingConfig.subtitulo}
            </Subtitle>
            <CTAButton
              onClick={() =>
                openConfiguredLink(
                  homeSection.linkBotao || landingConfig.linkBotaoPrincipal,
                  handleGoToRegister
                )
              }
            >
              {homeSection.textoBotao || landingConfig.textoBotaoPrincipal || "Comece Gratis - Cadastre-se"}
            </CTAButton>
          </HeroContent>
        </HeroSection>
        ) : null}

        {/* Features Section */}
        {recursosSection.visivel ? (
        <FeaturesSection id="funcionalidades">
          <SectionTitle>{recursosSection.titulo || "Funcionalidades Principais"}</SectionTitle>
          <SectionSubtitle>
            {recursosSection.subtitulo || "Tudo que voce precisa para gerir seu consultorio de forma eficiente e moderna"}
          </SectionSubtitle>
          
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon color="#007bff">
                <FaCalendarAlt />
              </FeatureIcon>
              <FeatureTitle>Sistema de Agendamentos</FeatureTitle>
              <FeatureDescription>
                Gerencie agendamentos com controle de status (confirmado, em atendimento, concluído), 
                vinculação de pacientes, dentistas e procedimentos específicos.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon color="#28a745">
                <FaUsers />
              </FeatureIcon>
              <FeatureTitle>Gestão de Pacientes</FeatureTitle>
              <FeatureDescription>
                Cadastro completo de pacientes com dados pessoais, contatos, endereços 
                e histórico médico integrado ao sistema.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon color="#17a2b8">
                <FaUserMd />
              </FeatureIcon>
              <FeatureTitle>Gestão de Funcionários</FeatureTitle>
              <FeatureDescription>
                Controle de funcionários, dentistas e usuários do sistema com 
                diferentes níveis de acesso e permissões personalizáveis.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon color="#ffc107">
                <FaTools />
              </FeatureIcon>
              <FeatureTitle>Cadastro de Procedimentos</FeatureTitle>
              <FeatureDescription>
                Gerencie procedimentos odontológicos com códigos, categorias, valores, 
                duração e descrições detalhadas para cada tratamento.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon color="#dc3545">
                <FaHandshake />
              </FeatureIcon>
              <FeatureTitle>Gestão de Convênios</FeatureTitle>
              <FeatureDescription>
                Cadastre e gerencie convênios médicos com dados completos, 
                percentuais de desconto e informações de contato.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon color="#6f42c1">
                <FaClipboardList />
              </FeatureIcon>
              <FeatureTitle>Sistema de Anamnese</FeatureTitle>
              <FeatureDescription>
                Crie questionários personalizados de anamnese com diferentes tipos 
                de perguntas e agrupamento por categorias específicas.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon color="#20c997">
                <FaChartLine />
              </FeatureIcon>
              <FeatureTitle>Relatórios Avançados</FeatureTitle>
              <FeatureDescription>
                Relatórios detalhados de agendamentos, procedimentos, performance 
                de dentistas e análises financeiras com gráficos interativos.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon color="#fd7e14">
                <FaCreditCard />
              </FeatureIcon>
              <FeatureTitle>Formas de Pagamento</FeatureTitle>
              <FeatureDescription>
                Configure múltiplas formas de pagamento, frequências de cobrança 
                e controle financeiro completo do consultório.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesSection>
        ) : null}

        {/* Stats Section */}
        <StatsSection>
          <SectionTitle style={{ color: 'white', marginBottom: '60px' }}>
            Nossos Números em Tempo Real
          </SectionTitle>
          
          <StatsGrid>
            <StatCard>
              <StatNumber>0</StatNumber>
              <StatLabel>Dentistas Cadastrados</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatNumber>0</StatNumber>
              <StatLabel>Consultas Agendadas</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatNumber>0</StatNumber>
              <StatLabel>Pacientes Cadastrados</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatNumber>0</StatNumber>
              <StatLabel>Funcionários Ativos</StatLabel>
            </StatCard>
          </StatsGrid>
        </StatsSection>

        {/* App Mobile Section */}
        {screenshotsSection.visivel ? (
        <FeaturesSection id="aplicativo" style={{ background: '#f8f9fa' }}>
          <SectionTitle>{screenshotsSection.titulo || "Aplicativo Mobile"}</SectionTitle>
          <SectionSubtitle>
            {screenshotsSection.subtitulo || "Gerencie seu consultorio de qualquer lugar com nosso aplicativo completo"}
          </SectionSubtitle>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', maxWidth: '1200px', margin: '0 auto', alignItems: 'center' }}>
            <div>
              <FeatureCard style={{ textAlign: 'left', padding: '0', boxShadow: 'none', border: 'none' }}>
                <h3 style={{ color: '#2c3e50', fontSize: '1.8rem', marginBottom: '20px' }}>
                  Acessível de qualquer lugar
                </h3>
                <p style={{ color: '#6c757d', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '30px' }}>
                  Um conjunto de recursos incríveis para a gestão do consultório odontológico. 
                  Priorizamos a simplicidade, para que o foco esteja naquilo que realmente importa: seus pacientes.
                </p>
                
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#007bff', fontSize: '1.2rem', marginBottom: '10px' }}>
                    📅 Planeje seu dia
                  </h4>
                  <p style={{ color: '#6c757d', margin: '0' }}>
                    Navegue facilmente pela sua agenda, veja quantas marcações tem a cada dia, 
                    o status das consultas e os compromissos.
                  </p>
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#007bff', fontSize: '1.2rem', marginBottom: '10px' }}>
                    📱 Prontuário na palma da mão
                  </h4>
                  <p style={{ color: '#6c757d', margin: '0' }}>
                    Veja as informações principais de cada paciente, adicione evoluções, 
                    confira pagamentos e históricos.
                  </p>
                </div>
                
                <div style={{ marginBottom: '30px' }}>
                  <h4 style={{ color: '#007bff', fontSize: '1.2rem', marginBottom: '10px' }}>
                    📸 Tire fotos
                  </h4>
                  <p style={{ color: '#6c757d', margin: '0' }}>
                    Utilize a câmera do seu celular para fotografar e anexar ao prontuário do paciente.
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '15px' }}>
                  <CTAButton style={{ fontSize: '1rem', padding: '12px 25px' }} onClick={handleGoToLogin}>
                    Fazer Login
                  </CTAButton>
                  <CTAButton style={{ fontSize: '1rem', padding: '12px 25px' }} onClick={handleGoToRegister}>
                    Cadastrar-se
                  </CTAButton>
                </div>
              </FeatureCard>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                borderRadius: '20px',
                padding: '60px 40px',
                color: 'white'
              }}>
                <FaMobile style={{ fontSize: '4rem', marginBottom: '20px' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>
                  Disponível para iOS e Android
                </h3>
                <p style={{ opacity: '0.9', lineHeight: '1.6' }}>
                  Baixe agora e tenha seu consultório sempre na palma da mão
                </p>
              </div>
            </div>
          </div>
        </FeaturesSection>
        ) : null}

        {/* About Section */}
        {descobrirSection.visivel ? (
        <FeaturesSection id="sobre">
          <SectionTitle>{descobrirSection.titulo || "Nossos Diferenciais"}</SectionTitle>
          <SectionSubtitle>
            {descobrirSection.subtitulo || "Um bom software nao se resume apenas em funcionalidades"}
          </SectionSubtitle>
          
          <FeaturesGrid style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <FeatureCard>
              <FeatureIcon color="#28a745">
                <FaUsers />
              </FeatureIcon>
              <FeatureTitle>Suporte com pessoas reais</FeatureTitle>
              <FeatureDescription>
                Valorizamos o contato humano e autenticidade em cada interação. 
                Aqui você sempre fala com pessoas de verdade.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon color="#17a2b8">
                <FaCog />
              </FeatureIcon>
              <FeatureTitle>Importamos seus dados</FeatureTitle>
              <FeatureDescription>
                Migramos seus dados e pacientes, seja de outro software ou planilhas, 
                sem custo adicional.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon color="#ffc107">
                <FaClipboardCheck />
              </FeatureIcon>
              <FeatureTitle>Treinamento gratuito</FeatureTitle>
              <FeatureDescription>
                Estamos aqui para te apoiar na sua jornada tecnológica. 
                Agende e tire todas as suas dúvidas, sem burocracia!
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon color="#dc3545">
                <FaShieldAlt />
              </FeatureIcon>
              <FeatureTitle>Segurança total</FeatureTitle>
              <FeatureDescription>
                Temos os melhores servidores do mercado com padrões de segurança 
                avançados, semelhantes ao de grandes bancos.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesSection>
        ) : null}

        {landingConfig.mostrarPlanos && landingConfig.secoes.plano_precos.visivel ? (
          <FeaturesSection id="planos" style={{ background: '#f8f9fa' }}>
            <SectionTitle>{landingConfig.secoes.plano_precos.titulo || 'Planos e Precos'}</SectionTitle>
            <SectionSubtitle>
              {landingConfig.secoes.plano_precos.subtitulo || 'Escolha o plano ideal para o momento da sua clinica'}
            </SectionSubtitle>

            <FeaturesGrid style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              {LANDING_PRICING_PLANS.map((plan) => (
                <FeatureCard
                  key={plan.name}
                  style={{
                    textAlign: 'left',
                    border: plan.featured ? '2px solid #007bff' : undefined,
                    position: 'relative',
                  }}
                >
                  {plan.featured ? (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        right: '16px',
                        background: '#007bff',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: '999px',
                        padding: '6px 10px',
                      }}
                    >
                      Mais Popular
                    </span>
                  ) : null}

                  <FeatureIcon color={plan.color} style={{ marginBottom: '18px' }}>
                    {plan.icon}
                  </FeatureIcon>

                  <FeatureTitle>{plan.name}</FeatureTitle>
                  <p style={{ marginTop: '-6px', marginBottom: '18px', color: '#007bff', fontWeight: 700 }}>
                    {plan.price}/mes
                  </p>

                  <div>
                    {plan.features.map((feature) => (
                      <div
                        key={`${plan.name}-${feature.text}`}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          marginBottom: '8px',
                          color: feature.included ? '#2c3e50' : '#8d96a0',
                          fontSize: '0.95rem',
                        }}
                      >
                        {feature.included ? (
                          <FaCheck style={{ color: '#28a745', marginTop: '2px' }} />
                        ) : (
                          <FaTimes style={{ color: '#dc3545', marginTop: '2px' }} />
                        )}
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <CTAButton
                    style={{ width: '100%', marginTop: '14px', fontSize: '1rem', padding: '12px 20px' }}
                    onClick={() => navigate('/pagamento', { state: { plano: plan.name, preco: plan.price } })}
                  >
                    Selecionar Plano
                  </CTAButton>
                </FeatureCard>
              ))}
            </FeaturesGrid>
          </FeaturesSection>
        ) : null}

        {faqSection.visivel ? (
          <FeaturesSection id="faq" style={{ background: '#f8f9fa' }}>
            <SectionTitle>{faqSection.titulo || "Perguntas Frequentes"}</SectionTitle>
            <SectionSubtitle>
              {faqSection.subtitulo || "Respostas rapidas para as duvidas mais comuns"}
            </SectionSubtitle>

            <FeaturesGrid style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
              <FeatureCard style={{ textAlign: 'left' }}>
                <FeatureTitle>O sistema funciona no celular?</FeatureTitle>
                <FeatureDescription>
                  Sim. Voce pode acessar o sistema no navegador e tambem usar os recursos mobile para acompanhar a rotina.
                </FeatureDescription>
              </FeatureCard>

              <FeatureCard style={{ textAlign: 'left' }}>
                <FeatureTitle>Tem suporte para migracao de dados?</FeatureTitle>
                <FeatureDescription>
                  Sim. Nossa equipe auxilia na migracao inicial para facilitar a troca sem impactar seu atendimento.
                </FeatureDescription>
              </FeatureCard>

              <FeatureCard style={{ textAlign: 'left' }}>
                <FeatureTitle>Posso cancelar quando quiser?</FeatureTitle>
                <FeatureDescription>
                  Sim. Os planos nao exigem fidelidade obrigatoria e podem ser ajustados conforme o crescimento da clinica.
                </FeatureDescription>
              </FeatureCard>
            </FeaturesGrid>
          </FeaturesSection>
        ) : null}

        {landingConfig.mostrarDepoimentos && testemunhosSection.visivel ? (
          <FeaturesSection id="testemunhos">
            <SectionTitle>{testemunhosSection.titulo || "Testemunhos"}</SectionTitle>
            <SectionSubtitle>
              {testemunhosSection.subtitulo || "O que clientes falam sobre a plataforma"}
            </SectionSubtitle>

            <FeaturesGrid style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
              <FeatureCard style={{ textAlign: 'left' }}>
                <FeatureDescription>
                  "Conseguimos organizar agenda, financeiro e prontuarios em um so lugar. O tempo de atendimento melhorou muito."
                </FeatureDescription>
                <FeatureTitle style={{ marginTop: '18px' }}>Dra. Marina S.</FeatureTitle>
              </FeatureCard>

              <FeatureCard style={{ textAlign: 'left' }}>
                <FeatureDescription>
                  "A equipe se adaptou rapido, e hoje temos visao clara dos indicadores da clinica sem planilhas paralelas."
                </FeatureDescription>
                <FeatureTitle style={{ marginTop: '18px' }}>Dr. Rafael P.</FeatureTitle>
              </FeatureCard>

              <FeatureCard style={{ textAlign: 'left' }}>
                <FeatureDescription>
                  "O suporte e muito proximo. Sempre que precisamos de ajuda para alguma configuracao, resolvem com agilidade."
                </FeatureDescription>
                <FeatureTitle style={{ marginTop: '18px' }}>Clinica Sorriso Vivo</FeatureTitle>
              </FeatureCard>
            </FeaturesGrid>
          </FeaturesSection>
        ) : null}

        {/* Contact Section */}
        {entreNosSection.visivel ? (
        <ContactSection id="contato">
          <SectionTitle>{entreNosSection.titulo || "Entre em Contato"}</SectionTitle>
          <SectionSubtitle>
            {entreNosSection.subtitulo || "Nossa equipe esta pronta para ajudar voce a revolucionar seu consultorio"}
          </SectionSubtitle>
          
          <ContactGrid>
            <ContactCard>
              <ContactIcon color="#28a745">
                <FaWhatsapp />
              </ContactIcon>
              <ContactInfo>
                <h4>WhatsApp</h4>
                <p>{landingConfig.telefoneWhatsapp || "(11) 99999-9999"}</p>
              </ContactInfo>
            </ContactCard>
            
            <ContactCard>
              <ContactIcon color="#007bff">
                <FaPhone />
              </ContactIcon>
              <ContactInfo>
                <h4>Telefone</h4>
                <p>(11) 4000-0000</p>
              </ContactInfo>
            </ContactCard>
            
            <ContactCard>
              <ContactIcon color="#dc3545">
                <FaEnvelope />
              </ContactIcon>
              <ContactInfo>
                <h4>E-mail</h4>
                <p>contato@ssait-odonto.com</p>
              </ContactInfo>
            </ContactCard>
          </ContactGrid>
        </ContactSection>
        ) : null}

        {/* Footer */}
        <Footer>
          <p>&copy; 2025 SSait Odonto - Todos os direitos reservados</p>
          <p>Desenvolvido com ❤️ para profissionais da odontologia</p>
        </Footer>
      </MainContent>
    </PageWrapper>
  );
};

export default InstitucionalPage;