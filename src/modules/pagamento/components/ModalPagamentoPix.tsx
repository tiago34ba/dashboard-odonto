import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { pixService } from '../services/PixService';
import { Plano, PagamentoPix, StatusPagamento } from '../types/pagamento.types';

interface ModalPagamentoPixProps {
  plano: Plano;
  isOpen: boolean;
  onClose: () => void;
  onPagamentoAprovado: (pagamento: PagamentoPix) => void;
}

// Animações
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: ${fadeIn} 0.3s ease-out;
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: ${slideUp} 0.4s ease-out;
  position: relative;
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 25px;
  border-radius: 20px 20px 0 0;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }
`;

const PlanoInfo = styled.div`
  margin-bottom: 15px;
`;

const PlanoNome = styled.h2`
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: bold;
`;

const PlanoPreco = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin: 10px 0;
  
  span {
    font-size: 18px;
    opacity: 0.9;
  }
`;

const ModalBody = styled.div`
  padding: 30px 25px;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto 20px;
`;

const PixContainer = styled.div`
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const QRCodeContainer = styled.div`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 123, 255, 0.3);
  margin: 20px 0;
  border: 4px solid white;
  position: relative;
  
  h4 {
    color: white;
    margin-bottom: 20px;
    font-size: 1.2rem;
    font-weight: 600;
  }
  
  &::before {
    content: '📱';
    position: absolute;
    top: -10px;
    right: 20px;
    font-size: 2rem;
    background: white;
    padding: 10px;
    border-radius: 50%;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`;

const QRCodeImage = styled.img`
  width: 250px;
  height: 250px;
  border-radius: 15px;
  background: white;
  padding: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  border: 3px solid white;
  transition: all 0.3s ease;
  animation: ${pulse} 3s infinite;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
  }
`;

const PixCode = styled.div`
  background: #f8f9fa;
  border: 2px solid #007bff;
  border-radius: 10px;
  padding: 15px;
  margin: 20px 0;
  font-family: monospace;
  font-size: 12px;
  word-break: break-all;
  position: relative;
`;

const CopyButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 12px;
  margin-top: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: #0056b3;
    transform: translateY(-2px);
  }
`;

const StatusContainer = styled.div<{ status: StatusPagamento }>`
  text-align: center;
  padding: 20px;
  border-radius: 15px;
  margin: 20px 0;
  background: ${props => {
    switch (props.status) {
      case 'aprovado': return 'linear-gradient(135deg, #28a745, #20c997)';
      case 'rejeitado': return 'linear-gradient(135deg, #dc3545, #fd7e14)';
      case 'expirado': return 'linear-gradient(135deg, #6c757d, #adb5bd)';
      default: return 'linear-gradient(135deg, #ffc107, #fd7e14)';
    }
  }};
  color: white;
`;

const StatusIcon = styled.div`
  font-size: 48px;
  margin-bottom: 15px;
  animation: ${pulse} 2s infinite;
`;

const StatusText = styled.h3`
  margin: 10px 0;
  font-size: 20px;
`;

const Timer = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
  margin: 15px 0;
`;

const InstrucoesContainer = styled.div`
  background: #e3f2fd;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
  border-left: 4px solid #007bff;
`;

const InstrucaoItem = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  font-size: 14px;
  
  span {
    margin-right: 10px;
    font-size: 18px;
  }
`;

export const ModalPagamentoPix: React.FC<ModalPagamentoPixProps> = ({
  plano,
  isOpen,
  onClose,
  onPagamentoAprovado
}) => {
  const [loading, setLoading] = useState(false);
  const [pagamento, setPagamento] = useState<PagamentoPix | null>(null);
  const [status, setStatus] = useState<StatusPagamento>('pendente');
  const [tempoRestante, setTempoRestante] = useState(0);
  const [erro, setErro] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      iniciarPagamento();
    }
  }, [isOpen, plano]);

  useEffect(() => {
    if (pagamento && status === 'pendente') {
      const interval = setInterval(verificarStatus, 3000); // Verifica a cada 3 segundos
      return () => clearInterval(interval);
    }
  }, [pagamento, status]);

  useEffect(() => {
    if (pagamento) {
      const interval = setInterval(() => {
        const agora = new Date().getTime();
        const expiracao = new Date(pagamento.data_expiracao).getTime();
        const restante = Math.max(0, Math.floor((expiracao - agora) / 1000));
        
        setTempoRestante(restante);
        
        if (restante === 0 && status === 'pendente') {
          setStatus('expirado');
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [pagamento, status]);

  const iniciarPagamento = async () => {
    try {
      setLoading(true);
      setErro('');
      
      const novoPagamento = await pixService.gerarCodigoPix(
        plano.id,
        plano.preco,
        `Assinatura ${plano.nome} - Consultório Odontológico`
      );

      setPagamento(novoPagamento);
      setStatus(novoPagamento.status);
      
    } catch (error: any) {
      setErro(error.message || 'Erro ao gerar PIX');
      console.error('Erro ao iniciar pagamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const verificarStatus = async () => {
    if (!pagamento) return;

    try {
      const novoStatus = await pixService.verificarStatusPagamento(pagamento.id);
      
      if (novoStatus !== status) {
        setStatus(novoStatus);
        
        if (novoStatus === 'aprovado') {
          const pagamentoAtualizado = { ...pagamento, status: 'aprovado' as StatusPagamento };
          onPagamentoAprovado(pagamentoAtualizado);
          
          // Fechar modal após 3 segundos
          setTimeout(() => {
            onClose();
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    }
  };

  const copiarCodigoPix = () => {
    if (pagamento) {
      navigator.clipboard.writeText(pagamento.codigo_pix);
      alert('Código PIX copiado para a área de transferência!');
    }
  };

  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const renderStatus = () => {
    switch (status) {
      case 'aprovado':
        return (
          <StatusContainer status={status}>
            <StatusIcon>✅</StatusIcon>
            <StatusText>Pagamento Aprovado!</StatusText>
            <p>Seu plano foi ativado com sucesso!</p>
            <p style={{ fontSize: '0.9rem', marginTop: '10px', opacity: 0.9 }}>
              💡 Guarde o código PIX como comprovante do seu pagamento
            </p>
          </StatusContainer>
        );
      case 'rejeitado':
        return (
          <StatusContainer status={status}>
            <StatusIcon>❌</StatusIcon>
            <StatusText>Pagamento Rejeitado</StatusText>
            <p>Tente novamente com outro método de pagamento.</p>
          </StatusContainer>
        );
      case 'expirado':
        return (
          <StatusContainer status={status}>
            <StatusIcon>⏰</StatusIcon>
            <StatusText>Pagamento Expirado</StatusText>
            <p>O tempo limite foi excedido. Gere um novo PIX.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '10px', opacity: 0.9 }}>
              ⚠️ Este código PIX não é mais válido
            </p>
          </StatusContainer>
        );
      default:
        return (
          <StatusContainer status={status}>
            <StatusIcon>⏳</StatusIcon>
            <StatusText>Aguardando Pagamento</StatusText>
            <p>Escaneie o QR Code ou copie o código PIX</p>
            {tempoRestante > 0 && (
              <Timer>
                ⏰ Expira em: {formatarTempo(tempoRestante)}
              </Timer>
            )}
          </StatusContainer>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <CloseButton onClick={onClose}>&times;</CloseButton>
          <PlanoInfo>
            <PlanoNome>{plano.nome}</PlanoNome>
            <PlanoPreco>
              R$ {plano.preco.toFixed(2)}
              <span>/mês</span>
            </PlanoPreco>
          </PlanoInfo>
        </ModalHeader>

        <ModalBody>
          {loading ? (
            <LoadingContainer>
              <Spinner />
              <h3>Gerando PIX...</h3>
              <p>Aguarde enquanto preparamos seu pagamento</p>
            </LoadingContainer>
          ) : erro ? (
            <StatusContainer status="erro">
              <StatusIcon>⚠️</StatusIcon>
              <StatusText>Erro</StatusText>
              <p>{erro}</p>
              <button onClick={iniciarPagamento}>Tentar Novamente</button>
            </StatusContainer>
          ) : pagamento ? (
            <PixContainer>
              {/* QR Code sempre fixo na tela */}
              <QRCodeContainer>
                <h4>📱 Escaneie o QR Code</h4>
                <QRCodeImage 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pagamento.codigo_pix)}`}
                  alt="QR Code PIX"
                />
              </QRCodeContainer>

              {/* Status do pagamento */}
              {renderStatus()}

              {/* Código PIX para copiar - sempre visível */}
              <div>
                <h4>💳 Ou copie o código PIX</h4>
                <PixCode>
                  {pagamento.codigo_pix}
                  <CopyButton onClick={copiarCodigoPix}>
                    📋 Copiar Código
                  </CopyButton>
                </PixCode>
              </div>

              {/* Instruções de pagamento */}
              <InstrucoesContainer>
                <h4>📋 Como pagar:</h4>
                <InstrucaoItem>
                  <span>1️⃣</span>
                  Abra o app do seu banco
                </InstrucaoItem>
                <InstrucaoItem>
                  <span>2️⃣</span>
                  Escolha a opção PIX
                </InstrucaoItem>
                <InstrucaoItem>
                  <span>3️⃣</span>
                  Escaneie o QR Code ou cole o código
                </InstrucaoItem>
                <InstrucaoItem>
                  <span>4️⃣</span>
                  Confirme o pagamento
                </InstrucaoItem>
              </InstrucoesContainer>
            </PixContainer>
          ) : null}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};