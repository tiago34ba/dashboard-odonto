// Componente de Notificação Segura
// Substitui alert() e confirm() por componentes mais seguros

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
}

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const NotificationContainer = styled.div<{ type: string }>`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: ${props => {
    switch (props.type) {
      case 'success': return '#d4edda';
      case 'error': return '#f8d7da';
      case 'warning': return '#fff3cd';
      case 'info': return '#d1ecf1';
      default: return '#d1ecf1';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'success': return '#155724';
      case 'error': return '#721c24';
      case 'warning': return '#856404';
      case 'info': return '#0c5460';
      default: return '#0c5460';
    }
  }};
  border: 1px solid ${props => {
    switch (props.type) {
      case 'success': return '#c3e6cb';
      case 'error': return '#f5c6cb';
      case 'warning': return '#ffeaa7';
      case 'info': return '#bee5eb';
      default: return '#bee5eb';
    }
  }};
  border-radius: 4px;
  padding: 12px 16px;
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  float: right;
  margin-left: 10px;
  color: inherit;
  
  &:hover {
    opacity: 0.7;
  }
`;

const ConfirmDialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10001;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ConfirmDialog = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ConfirmButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  
  ${props => props.variant === 'primary' ? `
    background-color: #dc3545;
    color: white;
    
    &:hover {
      background-color: #c82333;
    }
  ` : `
    background-color: #6c757d;
    color: white;
    
    &:hover {
      background-color: #5a6268;
    }
  `}
`;

export const Notification: React.FC<NotificationProps> = ({ 
  message, 
  type, 
  onClose, 
  duration = 5000 
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <NotificationContainer type={type}>
      <CloseButton onClick={onClose}>&times;</CloseButton>
      {message}
    </NotificationContainer>
  );
};

export const ConfirmDialogComponent: React.FC<ConfirmDialogProps> = ({
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}) => {
  return (
    <ConfirmDialogOverlay>
      <ConfirmDialog>
        <p>{message}</p>
        <ConfirmButtons>
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {confirmText}
          </Button>
        </ConfirmButtons>
      </ConfirmDialog>
    </ConfirmDialogOverlay>
  );
};

// Hook para gerenciar notificações
export const useNotification = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>>([]);

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    return id;
  };

  const hideNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const showSuccess = (message: string) => showNotification(message, 'success');
  const showError = (message: string) => showNotification(message, 'error');
  const showWarning = (message: string) => showNotification(message, 'warning');
  const showInfo = (message: string) => showNotification(message, 'info');

  return {
    notifications,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

// Hook para gerenciar confirmações
export const useConfirm = () => {
  const [confirmDialog, setConfirmDialog] = useState<{
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
  } | null>(null);

  const showConfirm = (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string
  ) => {
    setConfirmDialog({
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog(null);
      },
      onCancel: () => {
        if (onCancel) onCancel();
        setConfirmDialog(null);
      },
      confirmText,
      cancelText
    });
  };

  return {
    confirmDialog,
    showConfirm,
    hideConfirm: () => setConfirmDialog(null)
  };
};
