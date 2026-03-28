// Componente de Consentimento LGPD
// Conformidade com a Lei Geral de Proteção de Dados

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface ConsentBannerProps {
  onAccept: () => void;
  onReject: () => void;
  onCustomize: () => void;
}

const BannerOverlay = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10000;
  padding: 20px;
`;

const BannerContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const BannerTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #333;
  font-size: 18px;
`;

const BannerText = styled.p`
  margin: 0 0 20px 0;
  color: #666;
  line-height: 1.5;
  font-size: 14px;
`;

const BannerButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant: 'primary' | 'secondary' | 'tertiary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #007bff;
          color: white;
          &:hover {
            background-color: #0056b3;
          }
        `;
      case 'secondary':
        return `
          background-color: #6c757d;
          color: white;
          &:hover {
            background-color: #5a6268;
          }
        `;
      case 'tertiary':
        return `
          background-color: transparent;
          color: #007bff;
          border: 1px solid #007bff;
          &:hover {
            background-color: #f8f9fa;
          }
        `;
      default:
        return '';
    }
  }}
`;

const Link = styled.a`
  color: #007bff;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 16px 0;
`;

const Checkbox = styled.input`
  margin: 0;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #666;
  cursor: pointer;
  line-height: 1.4;
`;

export const ConsentBanner: React.FC<ConsentBannerProps> = ({
  onAccept,
  onReject,
  onCustomize
}) => {
  const [showBanner, setShowBanner] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já deu consentimento
    const consent = localStorage.getItem('lgpd_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const consent = {
      analytics: true,
      marketing: true,
      necessary: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('lgpd_consent', JSON.stringify(consent));
    setShowBanner(false);
    onAccept();
  };

  const handleRejectAll = () => {
    const consent = {
      analytics: false,
      marketing: false,
      necessary: true, // Necessário para funcionamento básico
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('lgpd_consent', JSON.stringify(consent));
    setShowBanner(false);
    onReject();
  };

  const handleCustomize = () => {
    const consent = {
      analytics: analyticsConsent,
      marketing: marketingConsent,
      necessary: true, // Sempre necessário
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('lgpd_consent', JSON.stringify(consent));
    setShowBanner(false);
    onCustomize();
  };

  if (!showBanner) return null;

  return (
    <BannerOverlay>
      <BannerContent>
        <BannerTitle>🍪 Consentimento para Uso de Dados</BannerTitle>
        <BannerText>
          Este site utiliza cookies e coleta dados pessoais para melhorar sua experiência. 
          Conforme a Lei Geral de Proteção de Dados (LGPD), precisamos do seu consentimento 
          para processar seus dados pessoais. 
          <Link href="/privacy-policy" target="_blank"> Saiba mais sobre nossa política de privacidade</Link>.
        </BannerText>
        
        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            id="analytics"
            checked={analyticsConsent}
            onChange={(e) => setAnalyticsConsent(e.target.checked)}
          />
          <CheckboxLabel htmlFor="analytics">
            <strong>Cookies de Análise:</strong> Permitem analisar como você usa o site para melhorar sua experiência.
          </CheckboxLabel>
        </CheckboxContainer>

        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            id="marketing"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
          />
          <CheckboxLabel htmlFor="marketing">
            <strong>Cookies de Marketing:</strong> Permitem personalizar conteúdo e anúncios.
          </CheckboxLabel>
        </CheckboxContainer>

        <BannerButtons>
          <Button variant="tertiary" onClick={handleRejectAll}>
            Rejeitar Todos
          </Button>
          <Button variant="secondary" onClick={handleCustomize}>
            Personalizar
          </Button>
          <Button variant="primary" onClick={handleAcceptAll}>
            Aceitar Todos
          </Button>
        </BannerButtons>
      </BannerContent>
    </BannerOverlay>
  );
};

// Hook para verificar consentimento
export const useLGPDConsent = () => {
  const [consent, setConsent] = useState<{
    analytics: boolean;
    marketing: boolean;
    necessary: boolean;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    const storedConsent = localStorage.getItem('lgpd_consent');
    if (storedConsent) {
      try {
        setConsent(JSON.parse(storedConsent));
      } catch (error) {
        console.error('Erro ao carregar consentimento LGPD:', error);
      }
    }
  }, []);

  const hasConsent = (type: 'analytics' | 'marketing' | 'necessary') => {
    return consent?.[type] || false;
  };

  const updateConsent = (newConsent: typeof consent) => {
    if (newConsent) {
      localStorage.setItem('lgpd_consent', JSON.stringify(newConsent));
      setConsent(newConsent);
    }
  };

  return {
    consent,
    hasConsent,
    updateConsent
  };
};
