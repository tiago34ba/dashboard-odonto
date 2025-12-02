import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { pixService } from '../services/PixService';
import { PagamentoPix, StatusPagamento } from '../types/pagamento.types';

// Styled Components
const TestContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 30px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #007bff;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const TestSection = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  
  h3 {
    color: #007bff;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin: 20px 0;
`;

const TestButton = styled.button<{ variant?: 'primary' | 'success' | 'warning' | 'danger' }>`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  ${props => {
    switch (props.variant) {
      case 'success':
        return `
          background: #28a745;
          color: white;
          &:hover { background: #218838; }
        `;
      case 'warning':
        return `
          background: #ffc107;
          color: #212529;
          &:hover { background: #e0a800; }
        `;
      case 'danger':
        return `
          background: #dc3545;
          color: white;
          &:hover { background: #c82333; }
        `;
      default:
        return `
          background: #007bff;
          color: white;
          &:hover { background: #0056b3; }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResultContainer = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  border-left: 4px solid #007bff;
`;

const LogContainer = styled.pre`
  background: #212529;
  color: #28a745;
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 12px;
  max-height: 300px;
  overflow-y: auto;
`;

const StatusBadge = styled.span<{ status: StatusPagamento }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  background: ${props => {
    switch (props.status) {
      case 'aprovado': return '#28a745';
      case 'rejeitado': return '#dc3545';
      case 'expirado': return '#6c757d';
      case 'pendente': return '#ffc107';
      default: return '#007bff';
    }
  }};
`;

const InfoBox = styled.div`
  background: #e3f2fd;
  border: 1px solid #2196f3;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  
  h4 {
    margin: 0 0 10px 0;
    color: #1976d2;
  }
  
  p {
    margin: 5px 0;
    font-size: 14px;
    line-height: 1.4;
  }
`;

interface TestePixProps {
  valorPlano?: number;
  planoSelecionado?: string;
}

const TestePix: React.FC<TestePixProps> = ({ valorPlano, planoSelecionado }) => {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [pagamentoAtual, setPagamentoAtual] = useState<PagamentoPix | null>(null);
  useEffect(() => {
    if (valorPlano) {
      setResultado(null);
      setPagamentoAtual(null);
    }
  }, [valorPlano]);

  const adicionarLog = (mensagem: string) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    setLogs(prev => [...prev, `[${timestamp}] ${mensagem}`]);
  };

  const limparLogs = () => {
    setLogs([]);
    setResultado(null);
    setPagamentoAtual(null);
  };

  // Teste 1: Gerar PIX Mock
  const testarGerarPix = async () => {
    try {
      setLoading(true);
      adicionarLog('🔄 Iniciando geração de PIX...');

      // Garantir que o plano seja do tipo PlanoType
      let planoType: 'basico' | 'profissional' | 'premium' = 'profissional';
      if (planoSelecionado === 'Básico') planoType = 'basico';
      else if (planoSelecionado === 'Profissional') planoType = 'profissional';
      else if (planoSelecionado === 'Premium') planoType = 'premium';

      const pagamento = await pixService.gerarCodigoPix(
        planoType,
        valorPlano || 90.00,
        `Teste de PIX - Plano ${planoSelecionado || 'Profissional'}`
      );

      setPagamentoAtual(pagamento);
      setResultado(pagamento);
      adicionarLog('✅ PIX gerado com sucesso!');
      adicionarLog(`📋 ID da transação: ${pagamento.id}`);
      adicionarLog(`💰 Valor: R$ ${pagamento.valor.toFixed(2)}`);
      adicionarLog(`📱 Chave PIX: ${pagamento.chave_pix}`);

    } catch (error: any) {
      adicionarLog(`❌ Erro ao gerar PIX: ${error.message}`);
      setResultado({ erro: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Teste 2: Verificar Status
  const testarVerificarStatus = async () => {
    if (!pagamentoAtual) {
      adicionarLog('⚠️ Nenhum pagamento ativo para verificar');
      return;
    }

    try {
      setLoading(true);
      adicionarLog('🔍 Verificando status do pagamento...');

      const status = await pixService.verificarStatusPagamento(pagamentoAtual.id);
      
      adicionarLog(`📊 Status atual: ${status}`);
      
      if (status === 'aprovado') {
        adicionarLog('🎉 Pagamento aprovado! Notificação enviada.');
      }

      // Atualizar pagamento atual
      setPagamentoAtual(prev => prev ? { ...prev, status } : null);

    } catch (error: any) {
      adicionarLog(`❌ Erro ao verificar status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Teste 3: Listar Histórico
  const testarHistorico = () => {
    adicionarLog('📋 Carregando histórico de pagamentos...');
    
    const historico = pixService.listarPagamentos();
    
    setResultado({ historico, total: historico.length });
    adicionarLog(`📊 Encontrados ${historico.length} pagamentos no histórico`);
    
    historico.forEach((pagamento, index) => {
      adicionarLog(`${index + 1}. ${pagamento.plano} - R$ ${pagamento.valor.toFixed(2)} - ${pagamento.status}`);
    });
  };

  // Teste 4: Simular Notificação
  const testarNotificacao = () => {
    adicionarLog('📱 Simulando envio de notificação...');
    
    const notificacao = {
      telefone: '71996285453',
      mensagem: `✅ PIX TESTE RECEBIDO\n\nValor: R$ 90.00\nPlano: Profissional\nTransação: TESTE_${Date.now()}\n\nPagamento aprovado com sucesso! 🎉`,
      tipo: 'teste',
      timestamp: new Date().toISOString()
    };

    setResultado({ notificacao });
    adicionarLog('📲 Notificação simulada enviada para: 71996285453');
    adicionarLog('✅ Teste de notificação concluído');
  };

  // Teste 5: Teste de Stress (múltiplos PIX)
  const testarStress = async () => {
    try {
      setLoading(true);
      adicionarLog('⚡ Iniciando teste de stress (5 PIX simultâneos)...');

      const promessas = Array.from({ length: 5 }, (_, index) => 
        pixService.gerarCodigoPix(
          'basico',
          70.00,
          `Teste Stress ${index + 1}`
        )
      );

      const resultados = await Promise.all(promessas);
      
      setResultado({ stress: resultados });
      adicionarLog(`✅ Teste de stress concluído: ${resultados.length} PIX gerados`);
      
      resultados.forEach((pix, index) => {
        adicionarLog(`${index + 1}. ${pix.id} - Status: ${pix.status}`);
      });

    } catch (error: any) {
      adicionarLog(`❌ Erro no teste de stress: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TestContainer>
      <Title>
        🧪 Teste da API PIX
      </Title>

      <InfoBox>
        <h4>ℹ️ Informações Bancárias</h4>
        <p><strong>Banco:</strong> Caixa Econômica (104)</p>
        <p><strong>Agência:</strong> 4803</p>
        <p><strong>Conta:</strong> 000860463765-4</p>
        <p><strong>Chave PIX:</strong> 71996285453</p>
        <p><strong>Modo:</strong> Mock/Desenvolvimento (pagamentos aprovados após 10 segundos)</p>
        <p><strong>Notificações:</strong> Simuladas via console</p>
        <p><strong>Persistência:</strong> LocalStorage</p>
      </InfoBox>

      <TestSection>
        <h3>🚀 Testes Disponíveis</h3>
        <ButtonGroup>
          <TestButton onClick={testarGerarPix} disabled={loading}>
            💳 Gerar PIX
          </TestButton>
          <TestButton 
            variant="success" 
            onClick={testarVerificarStatus} 
            disabled={loading || !pagamentoAtual}
          >
            📊 Verificar Status
          </TestButton>
          <TestButton variant="warning" onClick={testarHistorico}>
            📋 Listar Histórico
          </TestButton>
          <TestButton variant="success" onClick={testarNotificacao}>
            📱 Testar Notificação
          </TestButton>
          <TestButton variant="danger" onClick={testarStress} disabled={loading}>
            ⚡ Teste de Stress
          </TestButton>
          <TestButton variant="warning" onClick={limparLogs}>
            🧹 Limpar Logs
          </TestButton>
        </ButtonGroup>

        {pagamentoAtual && (
          <InfoBox>
            <h4>💳 Pagamento Ativo</h4>
            <p><strong>ID:</strong> {pagamentoAtual.id}</p>
            <p><strong>Valor:</strong> R$ {pagamentoAtual.valor.toFixed(2)}</p>
            <p><strong>Status:</strong> <StatusBadge status={pagamentoAtual.status}>{pagamentoAtual.status}</StatusBadge></p>
            <p><strong>Criado em:</strong> {new Date(pagamentoAtual.data_criacao).toLocaleString('pt-BR')}</p>
          </InfoBox>
        )}
      </TestSection>

      {logs.length > 0 && (
        <TestSection>
          <h3>📜 Logs do Teste</h3>
          <LogContainer>
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </LogContainer>
        </TestSection>
      )}

      {resultado && (
        <TestSection>
          <h3>📊 Resultado</h3>
          <ResultContainer>
            <pre>{JSON.stringify(resultado, null, 2)}</pre>
          </ResultContainer>
        </TestSection>
      )}
    </TestContainer>
  );
};

export default TestePix;