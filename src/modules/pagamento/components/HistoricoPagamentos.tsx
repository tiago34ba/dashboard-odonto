import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { pixService } from '../services/PixService';
import { PagamentoPix, StatusPagamento } from '../types/pagamento.types';

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border-radius: 15px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
`;

const RefreshButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const PagamentoCard = styled.div<{ status: StatusPagamento }>`
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-left: 5px solid ${props => {
    switch (props.status) {
      case 'aprovado': return '#28a745';
      case 'rejeitado': return '#dc3545';
      case 'expirado': return '#6c757d';
      case 'pendente': return '#ffc107';
      default: return '#007bff';
    }
  }};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  }
`;

const PagamentoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const PlanoInfo = styled.div`
  h3 {
    margin: 0 0 5px 0;
    color: #2c3e50;
    font-size: 20px;
  }
  
  p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
`;

const StatusBadge = styled.span<{ status: StatusPagamento }>`
  background: ${props => {
    switch (props.status) {
      case 'aprovado': return '#28a745';
      case 'rejeitado': return '#dc3545';
      case 'expirado': return '#6c757d';
      case 'pendente': return '#ffc107';
      default: return '#007bff';
    }
  }};
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
`;

const PagamentoDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const DetailItem = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  
  strong {
    color: #007bff;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  div {
    margin-top: 5px;
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  
  h3 {
    margin-bottom: 10px;
    color: #2c3e50;
  }
  
  p {
    margin-bottom: 20px;
  }
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
`;

export const HistoricoPagamentos: React.FC = () => {
  const [pagamentos, setPagamentos] = useState<PagamentoPix[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPagamentos();
  }, []);

  const carregarPagamentos = async () => {
    try {
      setLoading(true);
      const historico = pixService.listarPagamentos();
      setPagamentos(historico);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data: Date | string) => {
    const dataObj = typeof data === 'string' ? new Date(data) : data;
    return dataObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarStatus = (status: StatusPagamento) => {
    const statusMap = {
      'pendente': 'Pendente',
      'aprovado': 'Aprovado',
      'rejeitado': 'Rejeitado',
      'expirado': 'Expirado',
      'erro': 'Erro'
    };
    return statusMap[status] || status;
  };

  const getStatusIcon = (status: StatusPagamento) => {
    switch (status) {
      case 'aprovado': return '✅';
      case 'rejeitado': return '❌';
      case 'expirado': return '⏰';
      case 'pendente': return '⏳';
      default: return '⚠️';
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <h3>Carregando histórico...</h3>
          <p>Aguarde enquanto buscamos seus pagamentos</p>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>💳 Histórico de Pagamentos</Title>
        <RefreshButton onClick={carregarPagamentos}>
          🔄 Atualizar
        </RefreshButton>
      </Header>

      {pagamentos.length === 0 ? (
        <EmptyState>
          <EmptyIcon>💳</EmptyIcon>
          <h3>Nenhum pagamento encontrado</h3>
          <p>Você ainda não realizou nenhum pagamento via PIX.</p>
        </EmptyState>
      ) : (
        <div>
          {pagamentos.map((pagamento) => (
            <PagamentoCard key={pagamento.id} status={pagamento.status}>
              <PagamentoHeader>
                <PlanoInfo>
                  <h3>{getStatusIcon(pagamento.status)} Plano {pagamento.plano}</h3>
                  <p>Transação: {pagamento.id}</p>
                </PlanoInfo>
                <StatusBadge status={pagamento.status}>
                  {formatarStatus(pagamento.status)}
                </StatusBadge>
              </PagamentoHeader>

              <PagamentoDetails>
                <DetailItem>
                  <strong>💰 Valor</strong>
                  <div>R$ {pagamento.valor.toFixed(2)}</div>
                </DetailItem>

                <DetailItem>
                  <strong>📅 Data de Criação</strong>
                  <div>{formatarData(pagamento.data_criacao)}</div>
                </DetailItem>

                <DetailItem>
                  <strong>⏰ Data de Expiração</strong>
                  <div>{formatarData(pagamento.data_expiracao)}</div>
                </DetailItem>

                <DetailItem>
                  <strong>📱 Chave PIX</strong>
                  <div>{pagamento.chave_pix}</div>
                </DetailItem>

                {pagamento.data_aprovacao && (
                  <DetailItem>
                    <strong>✅ Data de Aprovação</strong>
                    <div>{formatarData(pagamento.data_aprovacao)}</div>
                  </DetailItem>
                )}

                {pagamento.descricao && (
                  <DetailItem>
                    <strong>📝 Descrição</strong>
                    <div>{pagamento.descricao}</div>
                  </DetailItem>
                )}
              </PagamentoDetails>
            </PagamentoCard>
          ))}
        </div>
      )}
    </Container>
  );
};