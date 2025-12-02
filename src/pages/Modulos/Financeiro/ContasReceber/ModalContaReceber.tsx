import React, { useState, useEffect } from "react";
import styled from "styled-components";

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 0;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #28a745 0%, #17a2b8 100%);
  color: white;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const ModalBody = styled.div`
  padding: 32px;
  max-height: calc(90vh - 200px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  margin-bottom: 4px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #fafafa;

  &:focus {
    outline: none;
    border-color: #28a745;
    background: white;
    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
  }

  &:hover {
    border-color: #d1d5db;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  background: #fafafa;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #28a745;
    background: white;
    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
  }

  &:hover {
    border-color: #d1d5db;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  background: #fafafa;
  transition: all 0.2s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #28a745;
    background: white;
    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
  }

  &:hover {
    border-color: #d1d5db;
  }
`;

const ModalFooter = styled.div`
  background: #f9fafb;
  padding: 24px 32px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #e5e7eb;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  justify-content: center;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #28a745 0%, #17a2b8 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
    }
  ` : `
    background: white;
    color: #6b7280;
    border: 2px solid #e5e7eb;
    
    &:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 4px;
`;

const SectionTitle = styled.h3`
  color: #374151;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => {
    switch (props.status) {
      case 'pendente':
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case 'recebido':
        return `
          background: #d1fae5;
          color: #065f46;
        `;
      case 'vencido':
        return `
          background: #fed7d7;
          color: #9b2c2c;
        `;
      case 'cancelado':
        return `
          background: #f3f4f6;
          color: #6b7280;
        `;
      case 'parcial':
        return `
          background: #dbeafe;
          color: #1e40af;
        `;
      default:
        return `
          background: #f3f4f6;
          color: #6b7280;
        `;
    }
  }}
`;

const ValueCard = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 2px solid #e5e7eb;

  .label {
    font-size: 0.9rem;
    color: #6b7280;
    margin-bottom: 8px;
  }

  .value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #28a745;
  }
`;

const PaymentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: end;
`;

const AlertCard = styled.div<{ isOverdue: boolean }>`
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
  border-left: 4px solid;
  
  ${props => props.isOverdue ? `
    background: #fef2f2;
    border-color: #dc2626;
    color: #991b1b;
  ` : `
    background: #f0f9ff;
    border-color: #3b82f6;
    color: #1e40af;
  `}

  .alert-title {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .alert-message {
    font-size: 0.9rem;
  }
`;

// Interfaces
interface ContaReceber {
  id?: number;
  paciente: string;
  descricao: string;
  procedimento: string;
  valor: number;
  valorRecebido: number;
  dataVencimento: string;
  dataRecebimento: string;
  status: 'pendente' | 'recebido' | 'vencido' | 'cancelado' | 'parcial';
  formaPagamento: string;
  numeroDocumento: string;
  observacoes: string;
  recorrente: boolean;
  frequenciaRecorrencia: string;
  dentista: string;
}

interface ModalContaReceberProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (conta: ContaReceber) => void;
  conta?: ContaReceber | null;
}

const ModalContaReceber: React.FC<ModalContaReceberProps> = ({
  isOpen,
  onClose,
  onSave,
  conta
}) => {
  const [formData, setFormData] = useState<ContaReceber>({
    paciente: '',
    descricao: '',
    procedimento: '',
    valor: 0,
    valorRecebido: 0,
    dataVencimento: '',
    dataRecebimento: '',
    status: 'pendente',
    formaPagamento: '',
    numeroDocumento: '',
    observacoes: '',
    recorrente: false,
    frequenciaRecorrencia: '',
    dentista: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dados mockados
  const pacientes = [
    'Maria Silva',
    'João Santos',
    'Ana Costa',
    'Pedro Oliveira',
    'Lucia Ferreira',
    'Carlos Mendes',
    'Fernanda Lima',
    'Roberto Costa',
    'Juliana Rocha',
    'Ricardo Santos'
  ];

  const dentistas = [
    'Dr. Carlos Mendes',
    'Dra. Fernanda Lima',
    'Dr. Roberto Costa',
    'Dra. Juliana Rocha'
  ];

  const procedimentos = [
    'Consulta',
    'Limpeza',
    'Restauração',
    'Canal',
    'Extração',
    'Implante',
    'Prótese',
    'Ortodontia',
    'Clareamento',
    'Faceta',
    'Coroa',
    'Cirurgia'
  ];

  const formasPagamento = [
    'Dinheiro',
    'PIX',
    'Cartão de Débito',
    'Cartão de Crédito',
    'Boleto Bancário',
    'Transferência Bancária',
    'Cheque',
    'Convenio'
  ];

  useEffect(() => {
    if (conta) {
      setFormData(conta);
    } else {
      setFormData({
        paciente: '',
        descricao: '',
        procedimento: '',
        valor: 0,
        valorRecebido: 0,
        dataVencimento: '',
        dataRecebimento: '',
        status: 'pendente',
        formaPagamento: '',
        numeroDocumento: '',
        observacoes: '',
        recorrente: false,
        frequenciaRecorrencia: '',
        dentista: ''
      });
    }
    setErrors({});
  }, [conta, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseFloat(value) || 0 : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.paciente.trim()) {
      newErrors.paciente = 'Paciente é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!formData.procedimento) {
      newErrors.procedimento = 'Procedimento é obrigatório';
    }

    if (!formData.dentista) {
      newErrors.dentista = 'Dentista é obrigatório';
    }

    if (formData.valor <= 0) {
      newErrors.valor = 'Valor deve ser maior que zero';
    }

    if (!formData.dataVencimento) {
      newErrors.dataVencimento = 'Data de vencimento é obrigatória';
    }

    if (formData.status === 'recebido' && !formData.dataRecebimento) {
      newErrors.dataRecebimento = 'Data de recebimento é obrigatória quando status é "recebido"';
    }

    if (formData.status === 'recebido' && !formData.formaPagamento) {
      newErrors.formaPagamento = 'Forma de pagamento é obrigatória quando status é "recebido"';
    }

    if (formData.status === 'parcial' && formData.valorRecebido <= 0) {
      newErrors.valorRecebido = 'Valor recebido deve ser maior que zero para pagamento parcial';
    }

    if (formData.valorRecebido > formData.valor) {
      newErrors.valorRecebido = 'Valor recebido não pode ser maior que o valor total';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const calcularDiasVencimento = () => {
    if (!formData.dataVencimento) return null;
    
    const hoje = new Date();
    const vencimento = new Date(formData.dataVencimento);
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const diasVencimento = calcularDiasVencimento();
  const isOverdue = diasVencimento !== null && diasVencimento < 0;
  const valorPendente = formData.valor - formData.valorRecebido;

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            {conta ? 'Editar Conta a Receber' : 'Nova Conta a Receber'}
          </h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <SectionTitle>Informações do Paciente e Procedimento</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Paciente *</Label>
                <Select
                  name="paciente"
                  value={formData.paciente}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione um paciente</option>
                  {pacientes.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Select>
                {errors.paciente && <ErrorMessage>{errors.paciente}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Dentista *</Label>
                <Select
                  name="dentista"
                  value={formData.dentista}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione um dentista</option>
                  {dentistas.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </Select>
                {errors.dentista && <ErrorMessage>{errors.dentista}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Procedimento *</Label>
                <Select
                  name="procedimento"
                  value={formData.procedimento}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione um procedimento</option>
                  {procedimentos.map(proc => (
                    <option key={proc} value={proc}>{proc}</option>
                  ))}
                </Select>
                {errors.procedimento && <ErrorMessage>{errors.procedimento}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Descrição *</Label>
                <Input
                  type="text"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descrição do serviço"
                />
                {errors.descricao && <ErrorMessage>{errors.descricao}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Número do Documento</Label>
                <Input
                  type="text"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={handleInputChange}
                  placeholder="Ex: Recibo 12345"
                />
              </FormGroup>

              <FormGroup>
                <Label>Data de Vencimento *</Label>
                <Input
                  type="date"
                  name="dataVencimento"
                  value={formData.dataVencimento}
                  onChange={handleInputChange}
                />
                {errors.dataVencimento && <ErrorMessage>{errors.dataVencimento}</ErrorMessage>}
                {diasVencimento !== null && (
                  <span style={{ 
                    fontSize: '0.85rem', 
                    color: isOverdue ? '#ef4444' : diasVencimento <= 5 ? '#f59e0b' : '#10b981',
                    marginTop: '4px'
                  }}>
                    {isOverdue 
                      ? `Vencido há ${Math.abs(diasVencimento)} dias`
                      : diasVencimento === 0 
                        ? 'Vence hoje'
                        : `${diasVencimento} dias para vencimento`
                    }
                  </span>
                )}
              </FormGroup>
            </FormGrid>

            <SectionTitle>Valores e Pagamento</SectionTitle>
            <FormGrid>
              <ValueCard>
                <div className="label">Valor Total</div>
                <Input
                  type="number"
                  name="valor"
                  step="0.01"
                  value={formData.valor}
                  onChange={handleInputChange}
                  placeholder="0,00"
                  style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: '600' }}
                />
                {errors.valor && <ErrorMessage>{errors.valor}</ErrorMessage>}
              </ValueCard>

              <FormGroup>
                <Label>Status</Label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="pendente">Pendente</option>
                  <option value="recebido">Recebido</option>
                  <option value="parcial">Pagamento Parcial</option>
                  <option value="vencido">Vencido</option>
                  <option value="cancelado">Cancelado</option>
                </Select>
                <StatusBadge status={formData.status}>
                  {formData.status}
                </StatusBadge>
              </FormGroup>

              {(formData.status === 'recebido' || formData.status === 'parcial') && (
                <>
                  <FormGroup>
                    <Label>Valor Recebido *</Label>
                    <Input
                      type="number"
                      name="valorRecebido"
                      step="0.01"
                      value={formData.valorRecebido}
                      onChange={handleInputChange}
                      placeholder="0,00"
                    />
                    {errors.valorRecebido && <ErrorMessage>{errors.valorRecebido}</ErrorMessage>}
                    {valorPendente > 0 && (
                      <span style={{ fontSize: '0.85rem', color: '#f59e0b', marginTop: '4px' }}>
                        Valor pendente: R$ {valorPendente.toFixed(2)}
                      </span>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label>Data de Recebimento *</Label>
                    <Input
                      type="date"
                      name="dataRecebimento"
                      value={formData.dataRecebimento}
                      onChange={handleInputChange}
                    />
                    {errors.dataRecebimento && <ErrorMessage>{errors.dataRecebimento}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <Label>Forma de Pagamento *</Label>
                    <Select
                      name="formaPagamento"
                      value={formData.formaPagamento}
                      onChange={handleInputChange}
                    >
                      <option value="">Selecione a forma</option>
                      {formasPagamento.map(fp => (
                        <option key={fp} value={fp}>{fp}</option>
                      ))}
                    </Select>
                    {errors.formaPagamento && <ErrorMessage>{errors.formaPagamento}</ErrorMessage>}
                  </FormGroup>
                </>
              )}
            </FormGrid>

            <SectionTitle>Recorrência</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>
                  <input
                    type="checkbox"
                    name="recorrente"
                    checked={formData.recorrente}
                    onChange={handleInputChange}
                    style={{ marginRight: '8px' }}
                  />
                  Esta é uma conta recorrente
                </Label>
              </FormGroup>

              {formData.recorrente && (
                <FormGroup>
                  <Label>Frequência</Label>
                  <Select
                    name="frequenciaRecorrencia"
                    value={formData.frequenciaRecorrencia}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione a frequência</option>
                    <option value="mensal">Mensal</option>
                    <option value="bimestral">Bimestral</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="semestral">Semestral</option>
                    <option value="anual">Anual</option>
                  </Select>
                </FormGroup>
              )}
            </FormGrid>

            <FormGroup>
              <Label>Observações</Label>
              <TextArea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                placeholder="Observações adicionais sobre esta conta..."
              />
            </FormGroup>

            {(isOverdue || (diasVencimento !== null && diasVencimento <= 5)) && (
              <AlertCard isOverdue={isOverdue}>
                <div className="alert-title">
                  {isOverdue ? '⚠️ Conta Vencida' : '🔔 Vencimento Próximo'}
                </div>
                <div className="alert-message">
                  {isOverdue 
                    ? `Esta conta está vencida há ${Math.abs(diasVencimento!)} dias. Entre em contato com o paciente.`
                    : `Esta conta vence em ${diasVencimento} dias. Lembre o paciente sobre o pagamento.`
                  }
                </div>
              </AlertCard>
            )}
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              {conta ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ModalContaReceber;