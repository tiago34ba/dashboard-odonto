import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  cartaoService, 
  BANDEIRAS_CARTAO, 
  DadosCartao, 
  OpcoesParcelamento,
  StatusPagamentoCartao 
} from '../services/CartaoService';
import { NotificationService } from '../../../services/NotificationService';

const TestContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 30px;
  border-bottom: 2px solid #f0f0f0;
`;

const Tab = styled.button<{ active?: boolean }>`
  padding: 15px 25px;
  border: none;
  background: ${props => props.active ? '#667eea' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  cursor: pointer;
  border-radius: 10px 10px 0 0;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#667eea' : '#f8f9fa'};
  }
`;

const TestSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
`;

const SectionTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TestGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 10px;
  margin-bottom: 10px;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          &:hover { opacity: 0.9; transform: translateY(-1px); }
        `;
      case 'success':
        return `
          background: #28a745;
          color: white;
          &:hover { background: #218838; }
        `;
      case 'danger':
        return `
          background: #dc3545;
          color: white;
          &:hover { background: #c82333; }
        `;
      default:
        return `
          background: #6c757d;
          color: white;
          &:hover { background: #5a6268; }
        `;
    }
  }}
`;

const InfoBox = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;
`;

const BandeirasList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const BandeiraCard = styled.div<{ detected?: boolean }>`
  padding: 15px;
  border: 2px solid ${props => props.detected ? '#28a745' : '#e9ecef'};
  border-radius: 10px;
  background: ${props => props.detected ? '#d4edda' : 'white'};
  text-align: center;
`;

const ResultContainer = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
  font-family: monospace;
  font-size: 0.9rem;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
`;

const StatusBadge = styled.span<{ status: StatusPagamentoCartao }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch (props.status) {
      case StatusPagamentoCartao.APROVADO:
        return 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;';
      case StatusPagamentoCartao.REJEITADO:
        return 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;';
      case StatusPagamentoCartao.PROCESSANDO:
        return 'background: #fff3cd; color: #856404; border: 1px solid #ffeaa7;';
      case StatusPagamentoCartao.PENDENTE:
        return 'background: #d1ecf1; color: #0c5460; border: 1px solid #b8daff;';
      default:
        return 'background: #e2e3e5; color: #383d41; border: 1px solid #d6d8db;';
    }
  }}
`;

interface TesteCartaoProps {
  valorPlano?: number;
  planoSelecionado?: string;
}

export const TesteCartao: React.FC<TesteCartaoProps> = ({ valorPlano, planoSelecionado }) => {
  const [abaAtiva, setAbaAtiva] = useState<'teste' | 'bandeiras' | 'historico'>('teste');
  const [dadosCartao, setDadosCartao] = useState<DadosCartao>({
    numero: '',
    nome: '',
    vencimento: '',
    cvv: '',
    documento: '',
    email: ''
  });
  const [valorTeste, setValorTeste] = useState(valorPlano || 100);
  const [parcelasTeste, setParcelasTeste] = useState(1);
  const [resultado, setResultado] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);
  const [bandeiraDetectada, setBandeiraDetectada] = useState<any>(null);
  const [opcoesParcelas, setOpcoesParcelas] = useState<OpcoesParcelamento[]>([]);

  const handleInputChange = (campo: keyof DadosCartao, valor: string) => {
    let valorFormatado = valor;

    if (campo === 'numero') {
      valorFormatado = cartaoService.formatarNumeroCartao(valor);
      const bandeira = cartaoService.identificarBandeira(valor);
      setBandeiraDetectada(bandeira);
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
  };

  const testarValidacaoCartao = () => {
    const resultado = {
      numero: dadosCartao.numero,
      valido: cartaoService.validarNumeroCartao(dadosCartao.numero),
      bandeira: cartaoService.identificarBandeira(dadosCartao.numero),
      numeroFormatado: cartaoService.formatarNumeroCartao(dadosCartao.numero)
    };
    
    setResultado(resultado);
    
    if (resultado.valido && resultado.bandeira) {
      NotificationService.success(`✅ Cartão ${resultado.bandeira.nome} válido!`);
    } else {
      NotificationService.error('❌ Número de cartão inválido');
    }
  };

  const carregarOpcoesParcelamento = async () => {
    if (!bandeiraDetectada) {
      NotificationService.error('Informe um número de cartão válido');
      return;
    }

    setCarregando(true);
    try {
      const opcoes = await cartaoService.obterOpcoesParcelamento(valorTeste, bandeiraDetectada.id);
      setOpcoesParcelas(opcoes);
      setResultado(opcoes);
      NotificationService.success('✅ Opções de parcelamento carregadas');
    } catch (error) {
      NotificationService.error('❌ Erro ao carregar opções de parcelamento');
    } finally {
      setCarregando(false);
    }
  };

  const testarPagamento = async () => {
    if (!dadosCartao.numero || !dadosCartao.nome || !bandeiraDetectada) {
      NotificationService.error('Preencha os dados do cartão');
      return;
    }

    setCarregando(true);
    try {
      const resultado = await cartaoService.processarPagamentoCartao(
        dadosCartao,
        valorTeste,
        parcelasTeste,
        'teste',
        bandeiraDetectada.id
      );

      setResultado(resultado);
      
      if (resultado.status === StatusPagamentoCartao.APROVADO) {
        NotificationService.success('✅ Pagamento aprovado!');
      } else if (resultado.status === StatusPagamentoCartao.REJEITADO) {
        NotificationService.error('❌ Pagamento rejeitado');
      } else {
        NotificationService.info('⏳ Pagamento em processamento');
      }
    } catch (error: any) {
      NotificationService.error(`❌ Erro: ${error.message}`);
      setResultado({ erro: error.message });
    } finally {
      setCarregando(false);
    }
  };

  const preencherDadosTeste = () => {
    setDadosCartao({
      numero: '4111 1111 1111 1111', // Visa de teste
      nome: 'JOÃO DA SILVA',
      vencimento: '12/25',
      cvv: '123',
      documento: '12345678901',
      email: 'teste@email.com'
    });
    setValorTeste(valorPlano || 150);
    setParcelasTeste(3);
  };

  const limparDados = () => {
    setDadosCartao({
      numero: '',
      nome: '',
      vencimento: '',
      cvv: '',
      documento: '',
      email: ''
    });
    setResultado(null);
    setBandeiraDetectada(null);
    setOpcoesParcelas([]);
  };

  const obterHistorico = () => {
    const historico = cartaoService.obterHistoricoPagamentos();
    setResultado(historico);
  };

  return (
    <TestContainer>
      <Title>
        💳 Teste do Sistema de Cartão - MercadoPago
      </Title>

      <TabContainer>
        <Tab 
          active={abaAtiva === 'teste'} 
          onClick={() => setAbaAtiva('teste')}
        >
          🧪 Testes de Pagamento
        </Tab>
        <Tab 
          active={abaAtiva === 'bandeiras'} 
          onClick={() => setAbaAtiva('bandeiras')}
        >
          💳 Bandeiras Suportadas
        </Tab>
        <Tab 
          active={abaAtiva === 'historico'} 
          onClick={() => setAbaAtiva('historico')}
        >
          📊 Histórico de Pagamentos
        </Tab>
      </TabContainer>

      {abaAtiva === 'teste' && (
        <>
          <TestSection>
            <SectionTitle>💳 Dados do Cartão para Teste</SectionTitle>
            
            <TestGrid>
              <InputGroup>
                <Label>Número do Cartão</Label>
                <Input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={dadosCartao.numero}
                  onChange={(e) => handleInputChange('numero', e.target.value)}
                  maxLength={19}
                />
              </InputGroup>

              <InputGroup>
                <Label>Nome no Cartão</Label>
                <Input
                  type="text"
                  placeholder="Nome como está no cartão"
                  value={dadosCartao.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value.toUpperCase())}
                />
              </InputGroup>

              <InputGroup>
                <Label>Validade (MM/AA)</Label>
                <Input
                  type="text"
                  placeholder="12/25"
                  value={dadosCartao.vencimento}
                  onChange={(e) => handleInputChange('vencimento', e.target.value)}
                  maxLength={5}
                />
              </InputGroup>

              <InputGroup>
                <Label>CVV</Label>
                <Input
                  type="text"
                  placeholder="123"
                  value={dadosCartao.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  maxLength={4}
                />
              </InputGroup>

              <InputGroup>
                <Label>CPF/CNPJ</Label>
                <Input
                  type="text"
                  placeholder="12345678901"
                  value={dadosCartao.documento}
                  onChange={(e) => handleInputChange('documento', e.target.value)}
                />
              </InputGroup>

              <InputGroup>
                <Label>E-mail</Label>
                <Input
                  type="email"
                  placeholder="teste@email.com"
                  value={dadosCartao.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </InputGroup>
            </TestGrid>

            {bandeiraDetectada && (
              <InfoBox>
                <strong>🎯 Bandeira Detectada:</strong> {bandeiraDetectada.icone} {bandeiraDetectada.nome}
              </InfoBox>
            )}

            <TestGrid>
              <InputGroup>
                <Label>Valor do Teste (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={valorTeste}
                  onChange={(e) => setValorTeste(Number(e.target.value))}
                />
              </InputGroup>

              <InputGroup>
                <Label>Número de Parcelas</Label>
                <Select
                  value={parcelasTeste}
                  onChange={(e) => setParcelasTeste(Number(e.target.value))}
                >
                  {[1,2,3,4,5,6,12].map(p => (
                    <option key={p} value={p}>{p}x</option>
                  ))}
                </Select>
              </InputGroup>
            </TestGrid>

            <div>
              <Button variant="success" onClick={preencherDadosTeste}>
                📝 Preencher Dados de Teste
              </Button>
              <Button variant="primary" onClick={testarValidacaoCartao}>
                🔍 Validar Cartão
              </Button>
              <Button variant="primary" onClick={carregarOpcoesParcelamento} disabled={carregando}>
                💰 {carregando ? 'Carregando...' : 'Opções de Parcelamento'}
              </Button>
              <Button variant="success" onClick={testarPagamento} disabled={carregando}>
                🚀 {carregando ? 'Processando...' : 'Testar Pagamento'}
              </Button>
              <Button variant="secondary" onClick={limparDados}>
                🗑️ Limpar Dados
              </Button>
            </div>
          </TestSection>

          {opcoesParcelas.length > 0 && (
            <TestSection>
              <SectionTitle>💰 Opções de Parcelamento Disponíveis</SectionTitle>
              <TestGrid>
                {opcoesParcelas.map((opcao) => (
                  <InfoBox key={opcao.parcelas}>
                    <strong>{opcao.parcelas}x de R$ {opcao.valor.toFixed(2)}</strong><br />
                    Taxa: {opcao.taxa}% a.m.<br />
                    Total: R$ {opcao.valorTotal.toFixed(2)}
                  </InfoBox>
                ))}
              </TestGrid>
            </TestSection>
          )}

          {resultado && (
            <TestSection>
              <SectionTitle>📋 Resultado do Teste</SectionTitle>
              {resultado.status && (
                <div style={{ marginBottom: '15px' }}>
                  <StatusBadge status={resultado.status}>
                    {resultado.status}
                  </StatusBadge>
                </div>
              )}
              <ResultContainer>
                {JSON.stringify(resultado, null, 2)}
              </ResultContainer>
            </TestSection>
          )}
        </>
      )}

      {abaAtiva === 'bandeiras' && (
        <TestSection>
          <SectionTitle>💳 Bandeiras de Cartão Suportadas</SectionTitle>
          <BandeirasList>
            {BANDEIRAS_CARTAO.map((bandeira) => (
              <BandeiraCard key={bandeira.id} detected={bandeiraDetectada?.id === bandeira.id}>
                <h4>{bandeira.icone} {bandeira.nome}</h4>
                <p><strong>ID:</strong> {bandeira.id}</p>
                <p><strong>Regex:</strong> {bandeira.regex.source.substring(0, 20)}...</p>
              </BandeiraCard>
            ))}
          </BandeirasList>

          <InfoBox>
            <strong>🎯 Reconhecimento Automático de Bandeiras</strong>
            <br />• Digite alguns dígitos do cartão no campo "Número do Cartão" 
            <br />• A bandeira será detectada automaticamente e exibida com ícone
            <br />• Números de teste disponíveis:
            <br />  - Visa: 4111 1111 1111 1111 🔵
            <br />  - Mastercard: 5555 5555 5555 4444 🔴
            <br />  - Amex: 3782 8224 6310 005 🟢
            <br />  - Elo: 4389 3500 0000 0001 🟡
            <br />  - Hipercard: 6062 8212 3456 7890 🟠
            <br />  - Diners: 3056 9309 0259 04 ⚫
            <br />• CVV 999 = Pagamento rejeitado
            <br />• CVV 888 = Pagamento em processamento
            <br />• Outros CVVs = Pagamento aprovado
          </InfoBox>
        </TestSection>
      )}

      {abaAtiva === 'historico' && (
        <TestSection>
          <SectionTitle>📊 Histórico de Pagamentos</SectionTitle>
          
          <div style={{ marginBottom: '20px' }}>
            <Button variant="primary" onClick={obterHistorico}>
              🔄 Atualizar Histórico
            </Button>
          </div>

          {resultado && Array.isArray(resultado) && (
            <div>
              <p><strong>Total de pagamentos:</strong> {resultado.length}</p>
              
              {resultado.map((pagamento, index) => (
                <InfoBox key={pagamento.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <strong>Pagamento #{index + 1}</strong>
                    <StatusBadge status={pagamento.status}>
                      {pagamento.status}
                    </StatusBadge>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    <div><strong>Valor:</strong> R$ {pagamento.valor.toFixed(2)}</div>
                    <div><strong>Parcelas:</strong> {pagamento.parcelas}x</div>
                    <div><strong>Bandeira:</strong> {pagamento.bandeira}</div>
                    <div><strong>Data:</strong> {new Date(pagamento.dataTransacao).toLocaleString()}</div>
                  </div>
                  
                  {pagamento.transactionId && (
                    <div style={{ marginTop: '10px' }}>
                      <strong>ID Transação:</strong> {pagamento.transactionId}
                    </div>
                  )}
                </InfoBox>
              ))}

              {resultado.length === 0 && (
                <InfoBox>
                  <p>📭 Nenhum pagamento encontrado no histórico.</p>
                </InfoBox>
              )}
            </div>
          )}
        </TestSection>
      )}
    </TestContainer>
  );
};

export default TesteCartao;