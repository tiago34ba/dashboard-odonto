import React from 'react';
import styled from 'styled-components';
import { FormaPagamento } from '../types/pagamento.types';

const SeletorContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const OpcaoPagamento = styled.button<{ selected?: boolean; disabled?: boolean }>`
  flex: 1;
  min-width: 200px;
  padding: 20px;
  border: 2px solid ${props => props.selected ? '#667eea' : '#e1e8ed'};
  border-radius: 15px;
  background: ${props => {
    if (props.disabled) return '#f8f9fa';
    if (props.selected) return 'linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%)';
    return 'white';
  }};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const IconePagamento = styled.div`
  font-size: 2.5rem;
  margin-bottom: 10px;
`;

const NomePagamento = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
`;

const DescricaoPagamento = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
  line-height: 1.4;
`;

const BandeiraContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
  justify-content: center;
  flex-wrap: wrap;
`;

const BandeiraIcon = styled.span`
  font-size: 1.2rem;
  padding: 4px 8px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(102, 126, 234, 0.2);
`;

const BadgeNovo = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProcessandoTexto = styled.div`
  color: #f39c12;
  font-size: 0.8rem;
  margin-top: 5px;
  font-style: italic;
`;

interface SeletorFormaPagamentoProps {
  formaSelecionada: FormaPagamento | null;
  onSelecionar: (forma: FormaPagamento) => void;
  desabilitarPix?: boolean;
  desabilitarCartao?: boolean;
  desabilitarBoleto?: boolean;
}

export const SeletorFormaPagamento: React.FC<SeletorFormaPagamentoProps> = ({
  formaSelecionada,
  onSelecionar,
  desabilitarPix = false,
  desabilitarCartao = false,
  desabilitarBoleto = false
}) => {
  return (
    <SeletorContainer>
      <OpcaoPagamento
        selected={formaSelecionada === 'pix'}
        disabled={desabilitarPix}
        onClick={() => !desabilitarPix && onSelecionar('pix')}
      >
        <IconePagamento>
          <svg width="200" height="80" viewBox="0 0 240 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="240" height="96" rx="16" fill="#4ABDAC" />
            <g>
              <rect x="16" y="24" width="48" height="48" rx="16" fill="white" />
              <path d="M24 48L40 32L56 48L40 64L24 48Z" fill="#4ABDAC" />
              <path d="M32 48L40 40L48 48L40 56L32 48Z" fill="white" />
            </g>
            <g>
              <text x="80" y="72" fontSize="64" fill="white" style={{fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 'bold'}}>pix</text>
            </g>
          </svg>
        </IconePagamento>
        <NomePagamento>PIX</NomePagamento>
        <DescricaoPagamento>
          Pagamento instantâneo<br />
          Aprovação em segundos<br />
          <strong>Sem taxas</strong>
        </DescricaoPagamento>
        {desabilitarPix && (
          <ProcessandoTexto>Em manutenção</ProcessandoTexto>
        )}
      </OpcaoPagamento>

      <OpcaoPagamento
        selected={formaSelecionada === 'cartao'}
        disabled={desabilitarCartao}
        onClick={() => !desabilitarCartao && onSelecionar('cartao')}
      >
        <BadgeNovo>Novo!</BadgeNovo>
        <IconePagamento>💳</IconePagamento>
        <NomePagamento>Cartão de Crédito</NomePagamento>
        <DescricaoPagamento>
          Parcelamento disponível<br />
          Todas as bandeiras<br />
          <strong>Seguro e prático</strong>
        </DescricaoPagamento>
        
        <BandeiraContainer>
          {/* Bandeiras removidas daqui */}
        </BandeiraContainer>

        {desabilitarCartao && (
          <ProcessandoTexto>Em desenvolvimento</ProcessandoTexto>
        )}
      </OpcaoPagamento>

      <OpcaoPagamento
        selected={formaSelecionada === 'boleto'}
        disabled={desabilitarBoleto}
        onClick={() => !desabilitarBoleto && onSelecionar('boleto')}
      >
        <IconePagamento>🧾</IconePagamento>
        <NomePagamento>Boleto Bancário</NomePagamento>
        <DescricaoPagamento>
          Pagamento tradicional<br />
          Vencimento em 3 dias<br />
          <strong>Sem taxas adicionais</strong>
        </DescricaoPagamento>
        
        <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#666' }}>
          🏦 Caixa Econômica (104)
        </div>

        {desabilitarBoleto && (
          <ProcessandoTexto>Em desenvolvimento</ProcessandoTexto>
        )}
      </OpcaoPagamento>

      {/* Card Mercado Pago removido */}

      {/* Informações detalhadas das formas de pagamento */}
      <div style={{ marginTop: 32, padding: 24, background: '#f8f9fa', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>pix <span style={{ color: '#00BFA5', fontWeight: 'bold', marginLeft: 8 }}>Novo!</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32, color: '#00BFA5' }}>PIX</span>
            <span>Pagamento instantâneo · Aprovação em segundos · <strong>Sem taxas</strong></span>
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>💳 Cartão de Crédito</div>
          <div>Parcelamento disponível · Todas as bandeiras · Seguro e prático</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" style={{ height: 20, marginRight: 4 }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: 20, marginRight: 4 }} />
            {/* Elo SVG */}
            <span style={{ display: 'inline-block', height: 20, width: 20, marginRight: 4 }} title="Elo">
              <svg viewBox="0 0 32 32" width="20" height="20">
                <circle cx="16" cy="16" r="16" fill="#FFD600" />
                <path d="M16 6a10 10 0 1 1 0 20 10 10 0 0 1 0-20z" fill="#000" />
                <circle cx="16" cy="16" r="6" fill="#FFD600" />
              </svg>
            </span>
            {/* Hipercard SVG */}
            <span style={{ display: 'inline-block', height: 20, width: 32, marginRight: 4 }} title="Hipercard">
              <svg viewBox="0 0 32 20" width="32" height="20">
                <rect width="32" height="20" rx="3" fill="#A80000" />
                <text x="4" y="15" fontSize="10" fill="#fff" fontFamily="Arial" fontWeight="bold">Hipercard</text>
              </svg>
            </span>
            {/* American Express SVG */}
            <span style={{ display: 'inline-block', height: 20, width: 32, marginRight: 4 }} title="American Express">
              <svg viewBox="0 0 32 20" width="32" height="20">
                <rect width="32" height="20" rx="3" fill="#0077A6" />
                <text x="4" y="15" fontSize="10" fill="#fff" fontFamily="Arial" fontWeight="bold">AMEX</text>
              </svg>
            </span>
            {/* Diners SVG */}
            <span style={{ display: 'inline-block', height: 20, width: 32, marginRight: 4 }} title="Diners">
              <svg viewBox="0 0 32 20" width="32" height="20">
                <rect width="32" height="20" rx="3" fill="#E6E6E6" />
                <circle cx="10" cy="10" r="6" fill="#0077A6" />
                <circle cx="22" cy="10" r="6" fill="#0077A6" />
                <text x="4" y="15" fontSize="10" fill="#333" fontFamily="Arial" fontWeight="bold">Diners</text>
              </svg>
            </span>
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>🧾 Boleto Bancário</div>
          <div>Pagamento tradicional · Vencimento em 3 dias · Sem taxas adicionais</div>
        </div>
      </div>
    </SeletorContainer>
  );
};