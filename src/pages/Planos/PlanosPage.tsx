import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { 
  FaCheck, 
  FaTimes, 
  FaHeart,
  FaUsers,
  FaBuilding,
  FaCrown
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
  cursor: pointer;
`;

const NavButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: #0056b3;
  }
`;

const MainContent = styled.div`
  background-color: #ffffff;
  width: 100%;
  overflow-y: auto;
  margin-top: 80px;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 80px 40px;
  text-align: center;
`;

const MainTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 40px;
  opacity: 0.9;
`;

const PlansSection = styled.section`
  padding: 80px 40px;
  background: #ffffff;
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PlanCard = styled.div<{ featured?: boolean }>`
  background: #ffffff;
  border-radius: 16px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: ${props => props.featured ? '0 20px 60px rgba(0, 123, 255, 0.3)' : '0 10px 30px rgba(0, 0, 0, 0.1)'};
  border: ${props => props.featured ? '3px solid #007bff' : '1px solid #f0f0f0'};
  position: relative;
  transform: ${props => props.featured ? 'scale(1.05)' : 'scale(1)'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: ${props => props.featured ? 'scale(1.08)' : 'scale(1.03)'};
    box-shadow: ${props => props.featured ? '0 25px 70px rgba(0, 123, 255, 0.4)' : '0 15px 40px rgba(0, 0, 0, 0.15)'};
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: #28a745;
  color: white;
  padding: 8px 25px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const PlanIcon = styled.div<{ color: string }>`
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

const PlanName = styled.h3`
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 700;
`;

const PlanPrice = styled.div`
  margin-bottom: 30px;
`;

const Price = styled.span`
  font-size: 3rem;
  font-weight: 700;
  color: #007bff;
`;

const Period = styled.span`
  font-size: 1.1rem;
  color: #6c757d;
  margin-left: 5px;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 40px;
`;

const Feature = styled.li<{ included: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  svg {
    margin-right: 15px;
    color: ${props => props.included ? '#28a745' : '#dc3545'};
    font-size: 1.2rem;
  }
  
  span {
    color: ${props => props.included ? '#333' : '#999'};
    text-decoration: ${props => props.included ? 'none' : 'line-through'};
  }
`;

const PlanButton = styled.button<{ featured?: boolean }>`
  background: ${props => props.featured ? '#28a745' : '#007bff'};
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    background: ${props => props.featured ? '#218838' : '#0056b3'};
    transform: translateY(-2px);
  }
`;

const ContactSection = styled.section`
  background: #f8f9fa;
  padding: 60px 40px;
  text-align: center;
`;

const ContactTitle = styled.h2`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
`;

const ContactText = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 30px;
`;

const ContactButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 30px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #218838;
    transform: translateY(-2px);
  }
`;

const PlanosPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoToRegister = () => {
    navigate('/registro');
  };

  const plans = [
    {
      name: "Básico",
      icon: <FaUsers />,
      color: "#17a2b8",
      price: "R$ 70",
      features: [
        { text: "Até 100 pacientes", included: true },
        { text: "Dashboard básico", included: true },
        { text: "Gestão de Pacientes", included: true },
        { text: "Agendamentos básicos", included: true },
        { text: "Cadastro de Procedimentos", included: true },
        { text: "Relatórios básicos", included: true },
        { text: "Suporte segunda a sexta 07:00-18:00, sábado 07:00-12:00", included: true },
        { text: "Gestão de Funcionários", included: false },
        { text: "Gestão Financeira", included: false },
        { text: "Convênios", included: false },
        { text: "Odontogramas", included: false },
        { text: "Anamnese", included: false }
      ]
    },
    {
      name: "Profissional",
      icon: <FaBuilding />,
      color: "#007bff",
      price: "R$ 90",
      featured: true,
      features: [
        { text: "Pacientes ilimitados", included: true },
        { text: "Dashboard completo", included: true },
        { text: "Gestão de Pacientes", included: true },
        { text: "Gestão de Funcionários", included: true },
        { text: "Agendamentos avançados", included: true },
        { text: "Gestão Financeira", included: true },
        { text: "Cadastro de Procedimentos", included: true },
        { text: "Convênios", included: true },
        { text: "Relatórios avançados", included: true },
        { text: "Suporte segunda a sexta 07:00-18:00, sábado 07:00-12:00", included: true },
        { text: "Odontogramas", included: false },
        { text: "Anamnese", included: false }
      ]
    },
    {
      name: "Premium",
      icon: <FaCrown />,
      color: "#ffc107",
      price: "R$ 160",
      features: [
        { text: "Pacientes ilimitados", included: true },
        { text: "Dashboard completo", included: true },
        { text: "Gestão de Pacientes", included: true },
        { text: "Gestão de Funcionários", included: true },
        { text: "Agendamentos completos", included: true },
        { text: "Gestão Financeira", included: true },
        { text: "Cadastro de Procedimentos", included: true },
        { text: "Convênios", included: true },
        { text: "Odontogramas", included: true },
        { text: "Anamnese completa", included: true },
        { text: "Tratamentos", included: true },
        { text: "Orçamentos", included: true },
        { text: "Todos os relatórios", included: true },
        { text: "Suporte segunda a sexta 07:00-18:00, sábado 07:00-12:00", included: true }
      ]
    }
  ];

  return (
    <PageWrapper>
      <NavBar>
        <Logo onClick={handleBackToHome}>
          <FaHeart />
          SSait Odonto
        </Logo>
        <NavButton onClick={handleGoToLogin}>
          Login
        </NavButton>
        <NavButton className="primary" onClick={handleGoToRegister}>
          Cadastre-se
        </NavButton>
      </NavBar>

      <MainContent>
        <HeroSection>
          <MainTitle>Planos e Preços</MainTitle>
          <Subtitle>
            Escolha o plano ideal para o seu consultório odontológico
          </Subtitle>
        </HeroSection>

        <PlansSection>
          <PlansGrid>
            {plans.map((plan, index) => (
              <PlanCard key={index} featured={plan.featured}>
                {plan.featured && <PopularBadge>Mais Popular</PopularBadge>}
                
                <PlanIcon color={plan.color}>
                  {plan.icon}
                </PlanIcon>
                
                <PlanName>{plan.name}</PlanName>
                
                <PlanPrice>
                  <Price>{plan.price}</Price>
                  <Period>/mês</Period>
                </PlanPrice>

                <FeaturesList>
                  {plan.features.map((feature, idx) => (
                    <Feature key={idx} included={feature.included}>
                      {feature.included ? <FaCheck /> : <FaTimes />}
                      <span>{feature.text}</span>
                    </Feature>
                  ))}
                </FeaturesList>

                <PlanButton featured={plan.featured} onClick={handleGoToRegister}>
                  {plan.featured ? 'Começar Agora' : 'Selecionar Plano'}
                </PlanButton>
              </PlanCard>
            ))}
          </PlansGrid>
        </PlansSection>

        <ContactSection>
          <ContactTitle>Precisa de um plano personalizado?</ContactTitle>
          <ContactText>
            Entre em contato conosco para criar uma solução sob medida para seu consultório
          </ContactText>
          <ContactButton onClick={handleGoToRegister}>
            Falar com Especialista
          </ContactButton>
        </ContactSection>
      </MainContent>
    </PageWrapper>
  );
};

export default PlanosPage;