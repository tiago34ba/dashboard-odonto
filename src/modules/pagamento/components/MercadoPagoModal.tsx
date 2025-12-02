import React, { useState } from 'react';
import styled from 'styled-components';
import { apiService } from '../../../services/api';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  min-width: 320px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
`;

const Button = styled.button`
  background: #009ee3;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  margin-top: 24px;
  &:disabled {
    background: #b3e0f7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background: #eee;
  color: #333;
  border: none;
  border-radius: 8px;
  padding: 8px 24px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  margin-top: 16px;
`;

interface MercadoPagoModalProps {
  plano: any;
  onClose: () => void;
}

export const MercadoPagoModal: React.FC<MercadoPagoModalProps> = () => {
  // Modal desabilitado: não renderiza nada
  return null;
};

export default MercadoPagoModal;
