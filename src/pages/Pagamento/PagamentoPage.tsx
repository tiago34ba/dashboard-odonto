import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ModalPagamentoPix } from '../../modules/pagamento/components/ModalPagamentoPix';
import { ModalPagamentoCartao } from '../../modules/pagamento/components/ModalPagamentoCartao';
import { ModalPagamentoBoleto } from '../../modules/pagamento/components/ModalPagamentoBoleto';
import { SeletorFormaPagamento } from '../../modules/pagamento/components/SeletorFormaPagamento';
import { MercadoPagoModal } from '../../modules/pagamento/components/MercadoPagoModal';
import { Plano, FormaPagamento, PagamentoPix, PlanoType } from '../../modules/pagamento/types/pagamento.types';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #667eea;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #764ba2;
    transform: translateX(-5px);
  }
`;

const Title = styled.h1`
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-size: 2rem;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  text-align: center;
  margin: 0;
  font-size: 1.1rem;
`;

const PlanoCard = styled.div`
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  border: 2px solid #e3ebf5;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const PlanoHeader = styled.div`
  text-align: center;
  margin-bottom: 25px;
`;

const PlanoNome = styled.h2`
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-size: 1.8rem;
`;

const PlanoPreco = styled.div`
  color: #27ae60;
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const PlanoDescricao = styled.p`
  color: #7f8c8d;
  margin: 0;
  font-size: 1rem;
`;

const RecursosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const Recurso = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2c3e50;
  font-size: 0.9rem;
`;

const RecursoIcon = styled.div`
  color: #27ae60;
  font-size: 1.1rem;
`;

const PaymentSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  color: #2c3e50;
  text-align: center;
  margin: 0 0 30px 0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

const LoadingText = styled.p`
  color: #7f8c8d;
  font-size: 1.2rem;
  margin-top: 20px;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #e74c3c;
`;

const ErrorText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

const RetryButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #5a6fd8;
    transform: translateY(-2px);
  }
`;

// Interface para parâmetros da URL
interface LocationState {
  plano?: {
    id: string;
    nome: string;
    preco: number;
    descricao: string;
    recursos: string[];
    popular?: boolean;
    icone?: string;
    cor?: string;
  };
}

export const PagamentoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [plano, setPlano] = useState<Plano | null>(null);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento | null>(null);
  const [modalPixOpen, setModalPixOpen] = useState(false);
  const [modalCartaoOpen, setModalCartaoOpen] = useState(false);
  const [modalBoletoOpen, setModalBoletoOpen] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalMercadoPagoOpen, setModalMercadoPagoOpen] = useState(false);

  useEffect(() => {
    // Obter dados do plano da navegação ou localStorage
    const state = location.state as any;
    if (state?.plano) {
      // Se vier do PlanosPage, converte para objeto esperado
      let planoObj: Plano;
      if (typeof state.plano === 'string') {
        // Mapeia o nome do plano para o tipo PlanoType
        let planoType: PlanoType = 'basico';
        if (typeof state.plano === 'string') {
          const nomePlano = state.plano.toLowerCase();
          if (nomePlano === 'profissional') planoType = 'profissional';
          else if (nomePlano === 'premium') planoType = 'premium';
        }
        planoObj = {
          id: planoType,
          nome: state.plano,
          preco: typeof state.preco === 'string' ? Number(state.preco.replace(/[^\d]/g, '')) : state.preco,
          descricao: '',
          recursos: [],
          icone: '',
          cor: '',
        };
      } else {
        planoObj = state.plano;
      }
      setPlano(planoObj);
      setCarregando(false);
      setModalMercadoPagoOpen(true); // Abre MercadoPagoModal automaticamente
    } else {
      // Tentar recuperar do localStorage (caso o usuário recarregue a página)
      const planoSalvo = localStorage.getItem('plano_selecionado');
      if (planoSalvo) {
        try {
          const planoData = JSON.parse(planoSalvo);
          setPlano(planoData);
          setCarregando(false);
          setModalMercadoPagoOpen(true); // Abre MercadoPagoModal automaticamente
        } catch (error) {
          setErro('Erro ao carregar dados do plano');
          setCarregando(false);
        }
      } else {
        setErro('Nenhum plano foi selecionado');
        setCarregando(false);
      }
    }
  }, [location.state]);

  useEffect(() => {
    // Salvar plano no localStorage para recuperação
    if (plano) {
      localStorage.setItem('plano_selecionado', JSON.stringify(plano));
    }
  }, [plano]);

  const handleVoltarPlanos = () => {
    navigate('/planos');
  };

  const handleSelecionarFormaPagamento = (forma: FormaPagamento | 'mercadopago') => {
    if (forma === 'mercadopago') {
      setModalMercadoPagoOpen(true);
      setFormaPagamento(null);
    } else {
      setFormaPagamento(forma);
      if (forma === 'pix') {
        setModalPixOpen(true);
      } else if (forma === 'cartao') {
        setModalCartaoOpen(true);
      } else if (forma === 'boleto') {
        setModalBoletoOpen(true);
      }
    }
  };

  const handlePagamentoPixAprovado = (pagamento: PagamentoPix) => {
    console.log('✅ Pagamento PIX aprovado!', pagamento);
    
    // Limpar localStorage
    localStorage.removeItem('plano_selecionado');
    
    // Redirecionar para dashboard com sucesso
    navigate('/dashboard', {
      state: {
        pagamentoSucesso: true,
        plano: plano?.nome,
        tipo: 'PIX'
      }
    });
  };

  const handlePagamentoCartaoSucesso = () => {
    console.log('✅ Pagamento com cartão aprovado!');
    
    // Limpar localStorage
    localStorage.removeItem('plano_selecionado');
    
    // Redirecionar para dashboard com sucesso
    navigate('/dashboard', {
      state: {
        pagamentoSucesso: true,
        plano: plano?.nome,
        tipo: 'Cartão'
      }
    });
  };

  const handlePagamentoBoletoGerado = () => {
    console.log('✅ Boleto bancário gerado!');
    
    // Limpar localStorage
    localStorage.removeItem('plano_selecionado');
    
    // Redirecionar para dashboard com sucesso
    navigate('/dashboard', {
      state: {
        pagamentoSucesso: true,
        plano: plano?.nome,
        tipo: 'Boleto',
        aguardandoPagamento: true
      }
    });
  };

  const handleFecharModal = () => {
    setModalPixOpen(false);
    setModalCartaoOpen(false);
    setModalBoletoOpen(false);
    setFormaPagamento(null);
  };

  const handleTentarNovamente = () => {
    setCarregando(true);
    setErro(null);
    
    // Tentar recarregar dados
    setTimeout(() => {
      const planoSalvo = localStorage.getItem('plano_selecionado');
      if (planoSalvo) {
        try {
          const planoData = JSON.parse(planoSalvo);
          setPlano(planoData);
          setCarregando(false);
        } catch (error) {
          setErro('Erro ao carregar dados do plano');
          setCarregando(false);
        }
      } else {
        setErro('Nenhum plano foi selecionado. Redirecionando...');
        setTimeout(() => {
          navigate('/planos');
        }, 2000);
        setCarregando(false);
      }
    }, 1000);
  };

  if (carregando) {
    return (
      <PageContainer>
        <Container>
          <LoadingContainer>
            <div style={{ fontSize: '3rem' }}>🔄</div>
            <LoadingText>Carregando dados do pagamento...</LoadingText>
          </LoadingContainer>
        </Container>
      </PageContainer>
    );
  }

  if (erro) {
    return (
      <PageContainer>
        <Container>
          <ErrorContainer>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>❌</div>
            <ErrorText>{erro}</ErrorText>
            <RetryButton onClick={handleTentarNovamente}>
              Tentar Novamente
            </RetryButton>
            <div style={{ marginTop: '20px' }}>
              <RetryButton onClick={handleVoltarPlanos}>
                Voltar aos Planos
              </RetryButton>
            </div>
          </ErrorContainer>
        </Container>
      </PageContainer>
    );
  }

  if (!plano) {
    return (
      <PageContainer>
        <Container>
          <ErrorContainer>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
            <ErrorText>Nenhum plano selecionado</ErrorText>
            <RetryButton onClick={handleVoltarPlanos}>
              Escolher Plano
            </RetryButton>
          </ErrorContainer>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <Header>
          <BackButton onClick={handleVoltarPlanos}>
            <FaArrowLeft />
            Voltar aos Planos
          </BackButton>
          <Title>💳 Finalizar Pagamento</Title>
          <Subtitle>
            Complete o pagamento para ativar seu plano
          </Subtitle>
        </Header>
        <PlanoCard>
          <PlanoHeader>
            <PlanoNome>{plano.nome}</PlanoNome>
            <PlanoPreco>
              R$ {typeof plano.preco === 'number' ? plano.preco.toFixed(2) : plano.preco ? plano.preco : '--'}
            </PlanoPreco>
            <PlanoDescricao>{plano.descricao}</PlanoDescricao>
          </PlanoHeader>
          <RecursosGrid>
            {(Array.isArray(plano.recursos) ? plano.recursos : []).map((recurso, index) => (
              <Recurso key={index}>
                <RecursoIcon>
                  <FaCheck />
                </RecursoIcon>
                {recurso}
              </Recurso>
            ))}
          </RecursosGrid>
        </PlanoCard>

        <PaymentSection>
          <SectionTitle>
            💰 Escolha a Forma de Pagamento
          </SectionTitle>

          <SeletorFormaPagamento
            formaSelecionada={formaPagamento}
            onSelecionar={handleSelecionarFormaPagamento}
          />
        </PaymentSection>

        {/* Modais de Pagamento */}
        {plano && (
          <>
            <ModalPagamentoPix
              plano={plano}
              isOpen={modalPixOpen}
              onClose={handleFecharModal}
              onPagamentoAprovado={handlePagamentoPixAprovado}
            />

            <ModalPagamentoCartao
              plano={plano}
              isOpen={modalCartaoOpen}
              onClose={handleFecharModal}
              onPagamentoSucesso={handlePagamentoCartaoSucesso}
            />

            <ModalPagamentoBoleto
              plano={plano}
              isOpen={modalBoletoOpen}
              onClose={handleFecharModal}
              onPagamentoGerado={handlePagamentoBoletoGerado}
            />
          </>
        )}
      </Container>
    </PageContainer>
  );
};

export default PagamentoPage;