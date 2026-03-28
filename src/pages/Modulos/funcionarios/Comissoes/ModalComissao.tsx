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
  max-width: 800px;
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
  background: linear-gradient(135deg, #9c27b0 0%, #673ab7 100%);
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
    border-color: #9c27b0;
    background: white;
    box-shadow: 0 0 0 3px rgba(156, 39, 176, 0.1);
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
    border-color: #9c27b0;
    background: white;
    box-shadow: 0 0 0 3px rgba(156, 39, 176, 0.1);
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
    border-color: #9c27b0;
    background: white;
    box-shadow: 0 0 0 3px rgba(156, 39, 176, 0.1);
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
    background: linear-gradient(135deg, #9c27b0 0%, #673ab7 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(156, 39, 176, 0.3);
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
      case 'calculada':
        return `
          background: #dbeafe;
          color: #1e40af;
        `;
      case 'paga':
        return `
          background: #d1fae5;
          color: #065f46;
        `;
      case 'pendente':
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case 'cancelada':
        return `
          background: #f3f4f6;
          color: #6b7280;
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
    color: #9c27b0;
  }
`;

const ComissionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 16px;
  align-items: end;
`;

const ComissionCard = styled.div`
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  border-radius: 12px;
  padding: 20px;
  border: 2px solid #ce93d8;

  .title {
    font-size: 0.9rem;
    font-weight: 600;
    color: #7b1fa2;
    margin-bottom: 12px;
  }

  .calculation {
    font-size: 0.85rem;
    color: #6b7280;
    margin-bottom: 8px;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #9c27b0;
  }
`;

const ProcedimentosList = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  border: 2px solid #e5e7eb;

  .header {
    font-weight: 600;
    color: #374151;
    margin-bottom: 12px;
    font-size: 0.9rem;
  }

  .item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #e5e7eb;
    font-size: 0.9rem;

    &:last-child {
      border-bottom: none;
    }

    .procedure {
      color: #6b7280;
    }

    .value {
      font-weight: 600;
      color: #374151;
    }
  }
`;

// Interfaces
interface Comissao {
  id?: number;
  funcionario: string;
  periodo: string;
  dataInicio: string;
  dataFim: string;
  valorVendas: number;
  percentualComissao: number;
  valorComissao: number;
  status: 'calculada' | 'paga' | 'pendente' | 'cancelada';
  dataPagamento: string;
  observacoes: string;
  procedimentos: Array<{
    nome: string;
    valor: number;
    comissao: number;
  }>;
  bonificacoes: number;
  descontos: number;
}

interface ModalComissaoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (comissao: Comissao) => void;
  comissao?: Comissao | null;
}

const ModalComissao: React.FC<ModalComissaoProps> = ({
  isOpen,
  onClose,
  onSave,
  comissao
}) => {
  const [formData, setFormData] = useState<Comissao>({
    funcionario: '',
    periodo: '',
    dataInicio: '',
    dataFim: '',
    valorVendas: 0,
    percentualComissao: 0,
    valorComissao: 0,
    status: 'calculada',
    dataPagamento: '',
    observacoes: '',
    procedimentos: [],
    bonificacoes: 0,
    descontos: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dados mockados
  const funcionarios = [
    'Dr. Carlos Mendes',
    'Dra. Fernanda Lima',
    'Dr. Roberto Costa',
    'Dra. Juliana Rocha',
    'Ana Paula - Auxiliar',
    'Marcos Silva - Recepcionista'
  ];

  const procedimentosDisponiveis = [
    { nome: 'Consulta', valor: 100, comissao: 5 },
    { nome: 'Limpeza', valor: 150, comissao: 7.5 },
    { nome: 'Restauração', valor: 300, comissao: 15 },
    { nome: 'Canal', valor: 800, comissao: 40 },
    { nome: 'Extração', valor: 200, comissao: 10 },
    { nome: 'Implante', valor: 2500, comissao: 125 },
    { nome: 'Prótese', valor: 1500, comissao: 75 },
    { nome: 'Ortodontia', valor: 3000, comissao: 150 },
    { nome: 'Clareamento', valor: 600, comissao: 30 },
    { nome: 'Faceta', valor: 1200, comissao: 60 }
  ];

  useEffect(() => {
    if (comissao) {
      setFormData(comissao);
    } else {
      setFormData({
        funcionario: '',
        periodo: '',
        dataInicio: '',
        dataFim: '',
        valorVendas: 0,
        percentualComissao: 0,
        valorComissao: 0,
        status: 'calculada',
        dataPagamento: '',
        observacoes: '',
        procedimentos: [],
        bonificacoes: 0,
        descontos: 0
      });
    }
    setErrors({});
  }, [comissao, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Calcular comissão automaticamente
  useEffect(() => {
    const totalProcedimentos = formData.procedimentos.reduce((acc, proc) => acc + proc.comissao, 0);
    const percentualBase = (formData.valorVendas * formData.percentualComissao) / 100;
    const comissaoCalculada = totalProcedimentos + percentualBase + formData.bonificacoes - formData.descontos;
    
    setFormData(prev => ({
      ...prev,
      valorComissao: comissaoCalculada
    }));
  }, [formData.valorVendas, formData.percentualComissao, formData.procedimentos, formData.bonificacoes, formData.descontos]);

  const adicionarProcedimento = () => {
    const procedimento = procedimentosDisponiveis[Math.floor(Math.random() * procedimentosDisponiveis.length)];
    setFormData(prev => ({
      ...prev,
      procedimentos: [...prev.procedimentos, procedimento]
    }));
  };

  const removerProcedimento = (index: number) => {
    setFormData(prev => ({
      ...prev,
      procedimentos: prev.procedimentos.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.funcionario) {
      newErrors.funcionario = 'Funcionário é obrigatório';
    }

    if (!formData.periodo.trim()) {
      newErrors.periodo = 'Período é obrigatório';
    }

    if (!formData.dataInicio) {
      newErrors.dataInicio = 'Data de início é obrigatória';
    }

    if (!formData.dataFim) {
      newErrors.dataFim = 'Data de fim é obrigatória';
    }

    if (formData.dataInicio && formData.dataFim && formData.dataInicio > formData.dataFim) {
      newErrors.dataFim = 'Data de fim deve ser posterior à data de início';
    }

    if (formData.percentualComissao < 0 || formData.percentualComissao > 100) {
      newErrors.percentualComissao = 'Percentual deve estar entre 0% e 100%';
    }

    if (formData.status === 'paga' && !formData.dataPagamento) {
      newErrors.dataPagamento = 'Data de pagamento é obrigatória quando status é "paga"';
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

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {comissao ? 'Editar Comissão' : 'Calcular Nova Comissão'}
          </h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <SectionTitle>Informações do Funcionário e Período</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Funcionário *</Label>
                <Select
                  name="funcionario"
                  value={formData.funcionario}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione um funcionário</option>
                  {funcionarios.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </Select>
                {errors.funcionario && <ErrorMessage>{errors.funcionario}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Período *</Label>
                <Input
                  type="text"
                  name="periodo"
                  value={formData.periodo}
                  onChange={handleInputChange}
                  placeholder="Ex: Novembro 2024"
                />
                {errors.periodo && <ErrorMessage>{errors.periodo}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Data de Início *</Label>
                <Input
                  type="date"
                  name="dataInicio"
                  value={formData.dataInicio}
                  onChange={handleInputChange}
                />
                {errors.dataInicio && <ErrorMessage>{errors.dataInicio}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Data de Fim *</Label>
                <Input
                  type="date"
                  name="dataFim"
                  value={formData.dataFim}
                  onChange={handleInputChange}
                />
                {errors.dataFim && <ErrorMessage>{errors.dataFim}</ErrorMessage>}
              </FormGroup>
            </FormGrid>

            <SectionTitle>Cálculo da Comissão</SectionTitle>
            <ComissionGrid>
              <ValueCard>
                <div className="label">Valor Total das Vendas</div>
                <Input
                  type="number"
                  name="valorVendas"
                  step="0.01"
                  value={formData.valorVendas}
                  onChange={handleInputChange}
                  placeholder="0,00"
                  style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: '600' }}
                />
              </ValueCard>

              <FormGroup>
                <Label>Percentual (%)</Label>
                <Input
                  type="number"
                  name="percentualComissao"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.percentualComissao}
                  onChange={handleInputChange}
                  placeholder="0.0"
                />
                {errors.percentualComissao && <ErrorMessage>{errors.percentualComissao}</ErrorMessage>}
              </FormGroup>

              <ComissionCard>
                <div className="title">Comissão Calculada</div>
                <div className="calculation">
                  Base + Procedimentos + Bônus - Descontos
                </div>
                <div className="value">
                  R$ {formData.valorComissao.toFixed(2)}
                </div>
              </ComissionCard>
            </ComissionGrid>

            <SectionTitle>Procedimentos Realizados</SectionTitle>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                Procedimentos que geram comissão adicional
              </span>
              <Button type="button" variant="secondary" onClick={adicionarProcedimento}>
                + Adicionar
              </Button>
            </div>

            {formData.procedimentos.length > 0 && (
              <ProcedimentosList>
                <div className="header">Lista de Procedimentos</div>
                {formData.procedimentos.map((proc, index) => (
                  <div key={index} className="item">
                    <span className="procedure">{proc.nome}</span>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <span className="value">R$ {proc.comissao.toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() => removerProcedimento(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '16px'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </ProcedimentosList>
            )}

            <SectionTitle>Ajustes e Status</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Bonificações</Label>
                <Input
                  type="number"
                  name="bonificacoes"
                  step="0.01"
                  value={formData.bonificacoes}
                  onChange={handleInputChange}
                  placeholder="0,00"
                />
              </FormGroup>

              <FormGroup>
                <Label>Descontos</Label>
                <Input
                  type="number"
                  name="descontos"
                  step="0.01"
                  value={formData.descontos}
                  onChange={handleInputChange}
                  placeholder="0,00"
                />
              </FormGroup>

              <FormGroup>
                <Label>Status</Label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="calculada">Calculada</option>
                  <option value="paga">Paga</option>
                  <option value="pendente">Pendente</option>
                  <option value="cancelada">Cancelada</option>
                </Select>
                <StatusBadge status={formData.status}>
                  {formData.status}
                </StatusBadge>
              </FormGroup>

              {formData.status === 'paga' && (
                <FormGroup>
                  <Label>Data de Pagamento *</Label>
                  <Input
                    type="date"
                    name="dataPagamento"
                    value={formData.dataPagamento}
                    onChange={handleInputChange}
                  />
                  {errors.dataPagamento && <ErrorMessage>{errors.dataPagamento}</ErrorMessage>}
                </FormGroup>
              )}
            </FormGrid>

            <FormGroup>
              <Label>Observações</Label>
              <TextArea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                placeholder="Observações adicionais sobre esta comissão..."
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              {comissao ? 'Atualizar' : 'Salvar Comissão'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ModalComissao;