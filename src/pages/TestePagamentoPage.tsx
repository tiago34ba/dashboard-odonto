import React from 'react';
import styled from 'styled-components';
import { TestePix } from '../modules/pagamento';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
`;

const TestePagamentoPage: React.FC = () => {
  return (
    <Container>
      <Title>🧪 Teste do Sistema PIX</Title>
      <TestePix />
    </Container>
  );
};

export default TestePagamentoPage;