import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaTooth, FaCalendarAlt, FaUserMd, FaShieldAlt, FaClock } from "react-icons/fa";

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const PageWrapper = styled.div`
  background: linear-gradient(160deg, #0d4a32 0%, #1a6b4a 60%, #2e8b57 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 700;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 12px;
`;

const LoginLink = styled(Link)`
  padding: 10px 22px;
  border: 2px solid rgba(255,255,255,0.7);
  border-radius: 8px;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
  &:hover { background: rgba(255,255,255,0.15); }
`;

const RegisterLink = styled(Link)`
  padding: 10px 22px;
  background: #fff;
  border-radius: 8px;
  color: #1a6b4a;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  transition: background 0.2s;
  &:hover { background: #f0faf5; }
`;

const Hero = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px 40px;
`;

const HeroIcon = styled.div`
  font-size: 5rem;
  color: rgba(255,255,255,0.9);
  margin-bottom: 24px;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 16px;
  line-height: 1.2;
`;

const HeroSubtitle = styled.p`
  font-size: 1.15rem;
  color: rgba(255,255,255,0.85);
  max-width: 540px;
  margin: 0 0 40px;
  line-height: 1.6;
`;

const HeroBtns = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

const BtnPrimary = styled(Link)`
  padding: 16px 36px;
  background: #fff;
  color: #1a6b4a;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 800;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.25); }
`;

const BtnSecondary = styled(Link)`
  padding: 16px 36px;
  border: 2px solid rgba(255,255,255,0.7);
  color: #fff;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
  &:hover { background: rgba(255,255,255,0.15); }
`;

const FeaturesSection = styled.div`
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  padding: 48px 20px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 28px 24px;
  text-align: center;
  color: #fff;
`;

const FeatureIcon = styled.div`
  font-size: 2.4rem;
  margin-bottom: 14px;
  color: rgba(255,255,255,0.9);
`;

const FeatureTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 8px;
`;

const FeatureDesc = styled.p`
  font-size: 0.85rem;
  color: rgba(255,255,255,0.75);
  margin: 0;
  line-height: 1.5;
`;

const Footer = styled.footer`
  text-align: center;
  padding: 20px;
  color: rgba(255,255,255,0.5);
  font-size: 0.8rem;
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const PortalPage: React.FC = () => {
  const hasSession = !!sessionStorage.getItem("patient_token");

  return (
    <PageWrapper>
      <Nav>
        <Brand><FaTooth /> OdontoClinic</Brand>
        <NavLinks>
          {hasSession ? (
            <RegisterLink to="/portal/meus-agendamentos">Minha Área</RegisterLink>
          ) : (
            <>
              <LoginLink to="/portal/login">Entrar</LoginLink>
              <RegisterLink to="/portal/registro">Criar Conta</RegisterLink>
            </>
          )}
        </NavLinks>
      </Nav>

      <Hero>
        <HeroIcon><FaTooth /></HeroIcon>
        <HeroTitle>Portal do Paciente</HeroTitle>
        <HeroSubtitle>
          Agende sua consulta com facilidade, escolha o melhor dentista e horário.
          Tudo online, rápido e seguro.
        </HeroSubtitle>
        <HeroBtns>
          {hasSession ? (
            <BtnPrimary to="/portal/agendar">
              <FaCalendarAlt /> Agendar Consulta
            </BtnPrimary>
          ) : (
            <>
              <BtnPrimary to="/portal/registro">
                <FaCalendarAlt /> Agendar Agora
              </BtnPrimary>
              <BtnSecondary to="/portal/login">
                Já tenho conta
              </BtnSecondary>
            </>
          )}
        </HeroBtns>
      </Hero>

      <FeaturesSection>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon><FaUserMd /></FeatureIcon>
            <FeatureTitle>Escolha seu Dentista</FeatureTitle>
            <FeatureDesc>
              Veja os profissionais disponíveis com suas especialidades.
            </FeatureDesc>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon><FaClock /></FeatureIcon>
            <FeatureTitle>Horários em Tempo Real</FeatureTitle>
            <FeatureDesc>
              Visualize os horários livres e escolha o que for melhor para você.
            </FeatureDesc>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon><FaCalendarAlt /></FeatureIcon>
            <FeatureTitle>Gestão das Consultas</FeatureTitle>
            <FeatureDesc>
              Acompanhe, confirme ou cancele seus agendamentos com um clique.
            </FeatureDesc>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon><FaShieldAlt /></FeatureIcon>
            <FeatureTitle>100% Seguro</FeatureTitle>
            <FeatureDesc>
              Seus dados são protegidos e sua conta é pessoal e intransferível.
            </FeatureDesc>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <Footer>© {new Date().getFullYear()} OdontoClinic — Portal do Paciente</Footer>
    </PageWrapper>
  );
};

export default PortalPage;
