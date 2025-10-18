import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaFileAlt, 
  FaMobile, 
  FaChartLine, 
  FaShieldAlt,
  FaCog,
  FaHeart,
  FaLaptop,
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
  FaCalendarCheck,
  FaTools
} from "react-icons/fa";

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
  const dropdownRef = React.useRef<HTMLDivElement>(null);

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

  const handleAccessDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoToPlanos = () => {
    navigate('/planos');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoToRegister = () => {
    navigate('/registro');
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
          <FaHeart />
          SSait Odonto
        </Logo>
        
        <NavMenu>
          <NavLink onClick={() => scrollToSection('home')}>Home</NavLink>
          
          <DropdownContainer ref={dropdownRef}>
            <DropdownButton 
              onClick={toggleRecursosDropdown}
              data-open={recursosDropdownOpen}
            >
              Recursos <FaChevronDown />
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
          
          <NavLink onClick={handleGoToPlanos}>Planos</NavLink>
          <NavLink onClick={() => scrollToSection('aplicativo')}>App Mobile</NavLink>
          <NavLink onClick={() => scrollToSection('sobre')}>Sobre Nós</NavLink>
          <NavLink onClick={() => scrollToSection('contato')}>Contato</NavLink>
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
        <MobileNavLink onClick={() => scrollToSection('home')}>Home</MobileNavLink>
        <MobileNavLink onClick={() => scrollToSection('funcionalidades')}>Funcionalidades</MobileNavLink>
        <MobileNavLink onClick={handleGoToPlanos}>Planos</MobileNavLink>
        <MobileNavLink onClick={() => scrollToSection('aplicativo')}>App Mobile</MobileNavLink>
        <MobileNavLink onClick={() => scrollToSection('sobre')}>Sobre Nós</MobileNavLink>
        <MobileNavLink onClick={() => scrollToSection('contato')}>Contato</MobileNavLink>
      </MobileMenu>

      <MainContent>
        {/* Hero Section */}
        <HeroSection id="home">
          <HeroContent>
            <MainTitle>O Sistema Odontológico Mais Completo</MainTitle>
            <Subtitle>
              Revolucione a gestão do seu consultório com nossa plataforma moderna, 
              intuitiva e repleta de funcionalidades que facilitam seu dia a dia.
            </Subtitle>
            <CTAButton onClick={handleGoToRegister}>
              Comece Grátis - Cadastre-se
            </CTAButton>
          </HeroContent>
        </HeroSection>

        {/* Features Section */}
        <FeaturesSection id="funcionalidades">
          <SectionTitle>Funcionalidades Principais</SectionTitle>
          <SectionSubtitle>
            Tudo que você precisa para gerir seu consultório de forma eficiente e moderna
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
        <FeaturesSection id="aplicativo" style={{ background: '#f8f9fa' }}>
          <SectionTitle>Aplicativo Mobile</SectionTitle>
          <SectionSubtitle>
            Gerencie seu consultório de qualquer lugar com nosso aplicativo completo
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

        {/* About Section */}
        <FeaturesSection id="sobre">
          <SectionTitle>Nossos Diferenciais</SectionTitle>
          <SectionSubtitle>
            Um bom software não se resume apenas em funcionalidades
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

        {/* Contact Section */}
        <ContactSection id="contato">
          <SectionTitle>Entre em Contato</SectionTitle>
          <SectionSubtitle>
            Nossa equipe está pronta para ajudar você a revolucionar seu consultório
          </SectionSubtitle>
          
          <ContactGrid>
            <ContactCard>
              <ContactIcon color="#28a745">
                <FaWhatsapp />
              </ContactIcon>
              <ContactInfo>
                <h4>WhatsApp</h4>
                <p>(11) 99999-9999</p>
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