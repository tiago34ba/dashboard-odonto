import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 16px;
  margin: 8px;
  min-width: 180px;
  text-align: center;
`;

interface ModuleCardProps {
  title: string;
  value: number | string;
  loading?: boolean;
  error?: string;
  onClick?: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, value, loading, error, onClick }) => (
  <CardContainer onClick={onClick}>
    <h3>{title}</h3>
    {loading ? <span>Carregando...</span> : <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</span>}
    {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
  </CardContainer>
);

export default ModuleCard;
