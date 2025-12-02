import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import MercadoPagoModal from '../../modules/pagamento/components/MercadoPagoModal';
import { useLocation } from 'react-router-dom';

const PageContainer = styled.div`
  background: #f8f9fa;
  min-height: 100vh;
  padding: 20px 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
`;

const Title = styled.h1`
  color: #007bff;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #6c757d;
  font-size: 18px;
`;

const TabContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TabButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
`;
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  // other props...
}
const TabButton = styled.button<{ active: boolean }>`
  padding: 15px 30px;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  background: ${props => props.active ? '#007bff' : 'white'};
  color: ${props => props.active ? 'white' : '#007bff'};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

const Button: React.FC<ButtonProps> = ({ children, onClick, variant }) => (
  <button
    onClick={onClick}
    className={variant === 'primary' ? 'btn-primary' : 'btn-secondary'}
  >
    {children}
  </button>
);



const TestePagamentoPage: React.FC = () => {
  const location = useLocation();
  const planoSelecionado = location.state?.plano;
  const precoSelecionado = location.state?.preco;
  const valorPlano = precoSelecionado ? Number(String(precoSelecionado).replace(/[^\d]/g, '')) : undefined;

  return (
    <PageContainer>
      <Header>
        <Title>Pagamento Mercado Pago</Title>
        <Subtitle>
          Realize o pagamento do seu plano via Mercado Pago
        </Subtitle>
        {planoSelecionado && (
          <div style={{ marginTop: 16, fontWeight: 'bold', fontSize: '1.2rem', color: '#007bff' }}>
            Plano Selecionado: {planoSelecionado} {precoSelecionado && `- ${precoSelecionado}/mês`}
          </div>
        )}
      </Header>

      {/* Apenas produção: Mercado Pago */}
      <MercadoPagoModal plano={planoSelecionado} onClose={() => {}} />
    </PageContainer>
  );
};

export default TestePagamentoPage;

