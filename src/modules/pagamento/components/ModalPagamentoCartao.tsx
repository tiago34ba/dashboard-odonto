import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { cartaoService, BANDEIRAS_CARTAO, DadosCartao, OpcoesParcelamento, StatusPagamentoCartao } from '../services/CartaoService';
import { Plano } from '../types/pagamento.types';
import { NotificationService } from '../../../services/NotificationService';

// Animações
const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
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
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideUp} 0.4s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  position: relative;
`;

const ModalHeader = styled.div`
  padding: 25px 30px 15px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px 20px 0 0;
  color: white;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const ModalBody = styled.div`
  padding: 30px;
`;

const PlanoInfo = styled.div`
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%);
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 25px;
  border: 1px solid #e3ebf5;
`;

const PlanoNome = styled.h3`
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 1.2rem;
`;

const PlanoValor = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #27ae60;
  margin-bottom: 10px;
`;

const PlanoDescricao = styled.p`
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const FormSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #2c3e50;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 12px 15px;
  border: 2px solid ${props => props.hasError ? '#e74c3c' : '#e1e8ed'};
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: ${props => props.hasError ? '#ffeaea' : '#fff'};

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#e74c3c' : '#667eea'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(231, 76, 60, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
  }

  &::placeholder {
    color: #95a5a6;
  }
`;

const CardNumberInput = styled(Input)<{ hasBandeira?: boolean }>`
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
  padding-right: ${props => props.hasBandeira ? '120px' : '15px'};
`;

const CardInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const BandeiraIndicator = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  animation: ${fadeIn} 0.3s ease;
`;

const BandeiraIcon = styled.span`
  font-size: 1.1rem;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  gap: 15px;
`;

const BandeiraInfo = styled.div`
  margin-top: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #495057;
`;

const ParcelasContainer = styled.div`
  display: grid;
  gap: 10px;
  max-height: 200px;
  overflow-y: auto;
`;

const ParcelaOption = styled.div<{ selected?: boolean }>`
  padding: 12px 15px;
  border: 2px solid ${props => props.selected ? '#667eea' : '#e1e8ed'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.selected ? '#f8f9ff' : '#fff'};
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    border-color: #667eea;
    background: #f8f9ff;
  }
`;

const ParcelaTexto = styled.div`
  font-weight: 500;
  color: #2c3e50;
`;

const ParcelaValor = styled.div`
  color: #27ae60;
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 5px;
`;

const ProcessingContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const ProcessingIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  animation: ${pulse} 1.5s infinite;
`;

const ProcessingText = styled.h3`
  color: #2c3e50;
  margin-bottom: 10px;
`;

const ProcessingSubtext = styled.p`
  color: #7f8c8d;
  margin: 0;
`;

const SuccessContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #27ae60;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #e74c3c;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const Button = styled.button<{ primary?: boolean; disabled?: boolean }>`
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  ${props => props.primary ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
  ` : `
    background: #f8f9fa;
    color: #495057;
    border: 2px solid #e9ecef;
    
    &:hover:not(:disabled) {
      background: #e9ecef;
    }
  `}
`;

interface ModalPagamentoCartaoProps {
  isOpen: boolean;
  onClose: () => void;
  plano: Plano;
  onPagamentoSucesso: () => void;
}

export const ModalPagamentoCartao: React.FC<ModalPagamentoCartaoProps> = ({
  isOpen,
  onClose,
  plano,
  onPagamentoSucesso
}) => {
  const [etapa, setEtapa] = useState<'dados' | 'parcelas' | 'processando' | 'sucesso' | 'erro'>('dados');
  const [dadosCartao, setDadosCartao] = useState<DadosCartao>({
    numero: '',
    nome: '',
    vencimento: '',
    cvv: '',
    documento: '',
    email: ''
  });
  const [opcoesParcelas, setOpcoesParcelas] = useState<OpcoesParcelamento[]>([]);
  const [parcelasSelecionadas, setParcelasSelecionadas] = useState<OpcoesParcelamento | null>(null);
  const [erros, setErros] = useState<Partial<DadosCartao>>({});
  const [bandeiraDetectada, setBandeiraDetectada] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (isOpen) {
      resetarEstado();
    }
  }, [isOpen]);

  useEffect(() => {
    // Detectar bandeira quando número do cartão muda
    console.log('🔄 useEffect disparado para número:', dadosCartao.numero);
    if (dadosCartao.numero) {
      const bandeira = cartaoService.identificarBandeira(dadosCartao.numero);
      console.log('🎯 Resultado da identificação:', bandeira);
      setBandeiraDetectada(bandeira);
    } else {
      console.log('🧹 Limpando bandeira detectada');
      setBandeiraDetectada(null);
    }
  }, [dadosCartao.numero]);

  const resetarEstado = () => {
    setEtapa('dados');
    setDadosCartao({
      numero: '',
      nome: '',
      vencimento: '',
      cvv: '',
      documento: '',
      email: ''
    });
    setOpcoesParcelas([]);
    setParcelasSelecionadas(null);
    setErros({});
    setBandeiraDetectada(null);
    setCarregando(false);
  };

  const validarDados = (): boolean => {
    const novosErros: Partial<DadosCartao> = {};

    if (!dadosCartao.numero || !cartaoService.validarNumeroCartao(dadosCartao.numero)) {
      novosErros.numero = 'Número do cartão inválido';
    }

    if (!dadosCartao.nome || dadosCartao.nome.length < 3) {
      novosErros.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!dadosCartao.vencimento || !/^\d{2}\/\d{2}$/.test(dadosCartao.vencimento)) {
      novosErros.vencimento = 'Formato: MM/AA';
    }

    if (!dadosCartao.cvv || dadosCartao.cvv.length < 3) {
      novosErros.cvv = 'CVV inválido';
    }

    if (!dadosCartao.documento || dadosCartao.documento.length < 11) {
      novosErros.documento = 'CPF/CNPJ inválido';
    }

    if (!dadosCartao.email || !/\S+@\S+\.\S+/.test(dadosCartao.email)) {
      novosErros.email = 'E-mail inválido';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const prosseguirParaParcelas = async () => {
    if (!validarDados() || !bandeiraDetectada) {
      NotificationService.error('Verifique os dados do cartão');
      return;
    }

    setCarregando(true);
    try {
      const opcoes = await cartaoService.obterOpcoesParcelamento(plano.preco, bandeiraDetectada.id);
      setOpcoesParcelas(opcoes);
      setEtapa('parcelas');
    } catch (error) {
      NotificationService.error('Erro ao carregar opções de parcelamento');
    } finally {
      setCarregando(false);
    }
  };

  const processarPagamento = async () => {
    if (!parcelasSelecionadas || !bandeiraDetectada) return;

    setEtapa('processando');
    setCarregando(true);

    try {
      const resultado = await cartaoService.processarPagamentoCartao(
        dadosCartao,
        plano.preco,
        parcelasSelecionadas.parcelas,
        plano.id,
        bandeiraDetectada.id
      );

      if (resultado.status === StatusPagamentoCartao.APROVADO) {
        setEtapa('sucesso');
        setTimeout(() => {
          onPagamentoSucesso();
          onClose();
        }, 3000);
      } else if (resultado.status === StatusPagamentoCartao.REJEITADO) {
        setEtapa('erro');
      } else {
        // Pagamento em processamento
        setEtapa('processando');
        // Aqui poderia verificar o status periodicamente
      }
    } catch (error) {
      setEtapa('erro');
    } finally {
      setCarregando(false);
    }
  };

  const handleInputChange = (campo: keyof DadosCartao, valor: string) => {
    let valorFormatado = valor;

    // Aplicar formatação específica
    if (campo === 'numero') {
      valorFormatado = cartaoService.formatarNumeroCartao(valor);
    } else if (campo === 'vencimento') {
      valorFormatado = cartaoService.formatarVencimento(valor);
    } else if (campo === 'documento') {
      valorFormatado = valor.replace(/\D/g, '');
    } else if (campo === 'cvv') {
      valorFormatado = valor.replace(/\D/g, '').substring(0, 4);
    }

    setDadosCartao(prev => ({
      ...prev,
      [campo]: valorFormatado
    }));

    // Limpar erro do campo
    if (erros[campo]) {
      setErros(prev => ({
        ...prev,
        [campo]: undefined
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>💳 Pagamento com Cartão</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          <PlanoInfo>
            <PlanoNome>{plano.nome}</PlanoNome>
            <PlanoValor>
              R$ {typeof plano.preco === 'number' ? plano.preco.toFixed(2) : plano.preco ? plano.preco : '--'}
            </PlanoValor>
            <PlanoDescricao>{plano.descricao}</PlanoDescricao>
          </PlanoInfo>

          {etapa === 'dados' && (
            <>
              <FormSection>
                <SectionTitle>💳 Dados do Cartão</SectionTitle>
                
                <FormGroup>
                  <Label>Número do Cartão</Label>
                  <CardInputContainer>
                    <CardNumberInput
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={dadosCartao.numero}
                      onChange={(e) => handleInputChange('numero', e.target.value)}
                      hasError={!!erros.numero}
                      hasBandeira={!!bandeiraDetectada}
                      maxLength={19}
                    />
                    {bandeiraDetectada && (
                      <BandeiraIndicator>
                        <BandeiraIcon>{bandeiraDetectada.icone}</BandeiraIcon>
                        <span>{bandeiraDetectada.nome}</span>
                      </BandeiraIndicator>
                    )}
                    {/* Debug: Mostrar estado da bandeira */}
                    {process.env.NODE_ENV === 'development' && (
                      <div style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>
                        Debug: {bandeiraDetectada ? `Bandeira: ${bandeiraDetectada.nome}` : 'Nenhuma bandeira detectada'}
                      </div>
                    )}
                  </CardInputContainer>
                  {erros.numero && <ErrorMessage>{erros.numero}</ErrorMessage>}
                  
                  {/* Debug: Botões de teste apenas em desenvolvimento */}
                  {process.env.NODE_ENV === 'development' && (
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => handleInputChange('numero', '4111111111111111')}
                          style={{ padding: '5px 8px', fontSize: '11px', background: '#1e90ff', color: 'white', border: 'none', borderRadius: '4px', minWidth: '80px' }}
                        >
                          🔵 Visa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInputChange('numero', '5555555555554444')}
                          style={{ padding: '5px 8px', fontSize: '11px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', minWidth: '80px' }}
                        >
                          🔴 Mastercard
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInputChange('numero', '378282246310005')}
                          style={{ padding: '5px 8px', fontSize: '11px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', minWidth: '80px' }}
                        >
                          🟢 Amex
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => handleInputChange('numero', '4389350000000001')}
                          style={{ padding: '5px 8px', fontSize: '11px', background: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', minWidth: '80px' }}
                        >
                          🟡 Elo
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInputChange('numero', '6062821234567890')}
                          style={{ padding: '5px 8px', fontSize: '11px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '4px', minWidth: '80px' }}
                        >
                          🟠 Hipercard
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInputChange('numero', '30569309025904')}
                          style={{ padding: '5px 8px', fontSize: '11px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', minWidth: '80px' }}
                        >
                          ⚫ Diners
                        </button>
                      </div>
                      <div style={{ fontSize: '10px', color: '#666', textAlign: 'center', marginTop: '5px' }}>
                        💡 Clique nos botões para testar o reconhecimento automático das bandeiras
                      </div>
                    </div>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Nome no Cartão</Label>
                  <Input
                    type="text"
                    placeholder="Nome como está no cartão"
                    value={dadosCartao.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value.toUpperCase())}
                    hasError={!!erros.nome}
                  />
                  {erros.nome && <ErrorMessage>{erros.nome}</ErrorMessage>}
                </FormGroup>

                <InputRow>
                  <FormGroup>
                    <Label>Validade</Label>
                    <Input
                      type="text"
                      placeholder="MM/AA"
                      value={dadosCartao.vencimento}
                      onChange={(e) => handleInputChange('vencimento', e.target.value)}
                      hasError={!!erros.vencimento}
                      maxLength={5}
                    />
                    {erros.vencimento && <ErrorMessage>{erros.vencimento}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>CVV</Label>
                    <Input
                      type="text"
                      placeholder="123"
                      value={dadosCartao.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      hasError={!!erros.cvv}
                      maxLength={4}
                    />
                    {erros.cvv && <ErrorMessage>{erros.cvv}</ErrorMessage>}
                  </FormGroup>
                </InputRow>
              </FormSection>

              <FormSection>
                <SectionTitle>👤 Dados do Portador</SectionTitle>
                
                <FormGroup>
                  <Label>CPF/CNPJ</Label>
                  <Input
                    type="text"
                    placeholder="000.000.000-00"
                    value={dadosCartao.documento}
                    onChange={(e) => handleInputChange('documento', e.target.value)}
                    hasError={!!erros.documento}
                  />
                  {erros.documento && <ErrorMessage>{erros.documento}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={dadosCartao.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    hasError={!!erros.email}
                  />
                  {erros.email && <ErrorMessage>{erros.email}</ErrorMessage>}
                </FormGroup>
              </FormSection>

              <ActionButtons>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                  primary
                  disabled={carregando || !bandeiraDetectada}
                  onClick={prosseguirParaParcelas}
                >
                  {carregando ? 'Carregando...' : 'Continuar'}
                </Button>
              </ActionButtons>
            </>
          )}

          {etapa === 'parcelas' && (
            <>
              <FormSection>
                <SectionTitle>💰 Opções de Parcelamento</SectionTitle>
                
                <ParcelasContainer>
                  {opcoesParcelas.map((opcao) => (
                    <ParcelaOption
                      key={opcao.parcelas}
                      selected={parcelasSelecionadas?.parcelas === opcao.parcelas}
                      onClick={() => setParcelasSelecionadas(opcao)}
                    >
                      <ParcelaTexto>
                        {opcao.parcelas}x de R$ {opcao.valor.toFixed(2)}
                        {opcao.taxa > 0 && ` (${opcao.taxa}% a.m.)`}
                      </ParcelaTexto>
                      <ParcelaValor>
                        Total: R$ {opcao.valorTotal.toFixed(2)}
                      </ParcelaValor>
                    </ParcelaOption>
                  ))}
                </ParcelasContainer>
              </FormSection>

              <ActionButtons>
                <Button onClick={() => setEtapa('dados')}>Voltar</Button>
                <Button
                  primary
                  disabled={!parcelasSelecionadas}
                  onClick={processarPagamento}
                >
                  Pagar R$ {parcelasSelecionadas?.valorTotal.toFixed(2) || '0,00'}
                </Button>
              </ActionButtons>
            </>
          )}

          {etapa === 'processando' && (
            <ProcessingContainer>
              <ProcessingIcon>💳</ProcessingIcon>
              <ProcessingText>Processando Pagamento</ProcessingText>
              <ProcessingSubtext>
                Aguarde enquanto processamos seu pagamento com cartão...
              </ProcessingSubtext>
            </ProcessingContainer>
          )}

          {etapa === 'sucesso' && (
            <SuccessContainer>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
              <h3>Pagamento Aprovado!</h3>
              <p>Seu pagamento com cartão foi aprovado com sucesso!</p>
              <p>Redirecionando...</p>
            </SuccessContainer>
          )}

          {etapa === 'erro' && (
            <ErrorContainer>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>❌</div>
              <h3>Pagamento Rejeitado</h3>
              <p>Não foi possível processar o pagamento.</p>
              <p>Verifique os dados e tente novamente.</p>
              
              <ActionButtons>
                <Button onClick={onClose}>Fechar</Button>
                <Button primary onClick={() => setEtapa('dados')}>
                  Tentar Novamente
                </Button>
              </ActionButtons>
            </ErrorContainer>
          )}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};