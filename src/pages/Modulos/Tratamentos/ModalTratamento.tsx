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
  max-width: 900px;
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
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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

const ProceduresList = styled.div`
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
`;

const ProcedureItem = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  display: grid;
  grid-template-columns: 1fr 150px 100px 40px;
  gap: 12px;
  align-items: center;

  &:last-child {
    margin-bottom: 0;
  }
`;

const AddProcedureButton = styled.button`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
  }
`;

const RemoveProcedureButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #c82333;
    transform: scale(1.1);
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
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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
      case 'planejado':
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case 'em_andamento':
        return `
          background: #dbeafe;
          color: #1e40af;
        `;
      case 'concluido':
        return `
          background: #d1fae5;
          color: #065f46;
        `;
      case 'pausado':
        return `
          background: #fed7d7;
          color: #9b2c2c;
        `;
      default:
        return `
          background: #f3f4f6;
          color: #6b7280;
        `;
    }
  }}
`;

const TotalValue = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  border: 2px solid #e5e7eb;

  .label {
    font-size: 0.9rem;
    color: #6b7280;
    margin-bottom: 4px;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #28a745;
  }
`;

// Interfaces
interface Procedure {
  id: string;
  nome: string;
  valor: number;
  quantidade: number;
}

interface Treatment {
  id?: number;
  paciente: string;
  dataInicio: string;
  status: 'planejado' | 'em_andamento' | 'concluido' | 'pausado';
  valorTotal: number;
  procedimentos: Procedure[];
  observacoes: string;
  dentista: string;
  dataPrevisaoConclusao: string;
}

interface ModalTratamentoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (treatment: Treatment) => void;
  treatment?: Treatment | null;
}

const ModalTratamento: React.FC<ModalTratamentoProps> = ({
  isOpen,
  onClose,
  onSave,
  treatment
}) => {
  const [formData, setFormData] = useState<Treatment>({
    paciente: '',
    dataInicio: '',
    status: 'planejado',
    valorTotal: 0,
    procedimentos: [],
    observacoes: '',
    dentista: '',
    dataPrevisaoConclusao: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dados mockados
  const pacientes = [
    { id: 1, nome: 'Maria Silva' },
    { id: 2, nome: 'João Santos' },
    { id: 3, nome: 'Ana Costa' },
    { id: 4, nome: 'Pedro Oliveira' },
    { id: 5, nome: 'Lucia Ferreira' }
  ];

  const dentistas = [
    { id: 1, nome: 'Dr. Carlos Mendes' },
    { id: 2, nome: 'Dra. Fernanda Lima' },
    { id: 3, nome: 'Dr. Roberto Costa' },
    { id: 4, nome: 'Dra. Juliana Rocha' }
  ];

  const procedimentosDisponiveis = [
    { id: 1, nome: 'Limpeza', valor: 80 },
    { id: 2, nome: 'Restauração', valor: 150 },
    { id: 3, nome: 'Canal', valor: 400 },
    { id: 4, nome: 'Extração', valor: 100 },
    { id: 5, nome: 'Implante', valor: 1200 },
    { id: 6, nome: 'Prótese', valor: 800 },
    { id: 7, nome: 'Ortodontia', valor: 300 },
    { id: 8, nome: 'Clareamento', valor: 250 }
  ];

  useEffect(() => {
    if (treatment) {
      setFormData(treatment);
    } else {
      setFormData({
        paciente: '',
        dataInicio: '',
        status: 'planejado',
        valorTotal: 0,
        procedimentos: [],
        observacoes: '',
        dentista: '',
        dataPrevisaoConclusao: ''
      });
    }
    setErrors({});
  }, [treatment, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addProcedure = () => {
    const newProcedure: Procedure = {
      id: Date.now().toString(),
      nome: '',
      valor: 0,
      quantidade: 1
    };
    
    setFormData(prev => ({
      ...prev,
      procedimentos: [...prev.procedimentos, newProcedure]
    }));
  };

  const removeProcedure = (id: string) => {
    setFormData(prev => ({
      ...prev,
      procedimentos: prev.procedimentos.filter(p => p.id !== id)
    }));
  };

  const updateProcedure = (id: string, field: keyof Procedure, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      procedimentos: prev.procedimentos.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    }));
  };

  const calculateTotal = () => {
    const total = formData.procedimentos.reduce((sum, proc) => {
      return sum + (proc.valor * proc.quantidade);
    }, 0);
    
    setFormData(prev => ({
      ...prev,
      valorTotal: total
    }));
  };

  useEffect(() => {
    calculateTotal();
  }, [formData.procedimentos]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.paciente) {
      newErrors.paciente = 'Paciente é obrigatório';
    }

    if (!formData.dentista) {
      newErrors.dentista = 'Dentista é obrigatório';
    }

    if (!formData.dataInicio) {
      newErrors.dataInicio = 'Data de início é obrigatória';
    }

    if (formData.procedimentos.length === 0) {
      newErrors.procedimentos = 'Pelo menos um procedimento é obrigatório';
    }

    formData.procedimentos.forEach((proc, index) => {
      if (!proc.nome) {
        newErrors[`procedimento_${index}_nome`] = 'Nome do procedimento é obrigatório';
      }
      if (proc.valor <= 0) {
        newErrors[`procedimento_${index}_valor`] = 'Valor deve ser maior que zero';
      }
      if (proc.quantidade <= 0) {
        newErrors[`procedimento_${index}_quantidade`] = 'Quantidade deve ser maior que zero';
      }
    });

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
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 12H9.5v-2H11c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1H8.5v6zM16 11h-2v2h2v2h-3V9h3v2z"/>
            </svg>
            {treatment ? 'Editar Tratamento' : 'Novo Tratamento'}
          </h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <SectionTitle>Informações Gerais</SectionTitle>
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
                    <option key={p.id} value={p.nome}>{p.nome}</option>
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
                    <option key={d.id} value={d.nome}>{d.nome}</option>
                  ))}
                </Select>
                {errors.dentista && <ErrorMessage>{errors.dentista}</ErrorMessage>}
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
                <Label>Previsão de Conclusão</Label>
                <Input
                  type="date"
                  name="dataPrevisaoConclusao"
                  value={formData.dataPrevisaoConclusao}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>Status</Label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="planejado">Planejado</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluido">Concluído</option>
                  <option value="pausado">Pausado</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Status Atual</Label>
                <StatusBadge status={formData.status}>
                  {formData.status.replace('_', ' ')}
                </StatusBadge>
              </FormGroup>
            </FormGrid>

            <SectionTitle>Procedimentos</SectionTitle>
            <ProceduresList>
              {formData.procedimentos.map((proc, index) => (
                <ProcedureItem key={proc.id}>
                  <FormGroup>
                    <Select
                      value={proc.nome}
                      onChange={(e) => {
                        const selectedProc = procedimentosDisponiveis.find(p => p.nome === e.target.value);
                        updateProcedure(proc.id, 'nome', e.target.value);
                        if (selectedProc) {
                          updateProcedure(proc.id, 'valor', selectedProc.valor);
                        }
                      }}
                    >
                      <option value="">Selecione o procedimento</option>
                      {procedimentosDisponiveis.map(p => (
                        <option key={p.id} value={p.nome}>{p.nome}</option>
                      ))}
                    </Select>
                    {errors[`procedimento_${index}_nome`] && (
                      <ErrorMessage>{errors[`procedimento_${index}_nome`]}</ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Input
                      type="number"
                      placeholder="Valor"
                      step="0.01"
                      value={proc.valor}
                      onChange={(e) => updateProcedure(proc.id, 'valor', parseFloat(e.target.value) || 0)}
                    />
                    {errors[`procedimento_${index}_valor`] && (
                      <ErrorMessage>{errors[`procedimento_${index}_valor`]}</ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Input
                      type="number"
                      placeholder="Qtd"
                      min="1"
                      value={proc.quantidade}
                      onChange={(e) => updateProcedure(proc.id, 'quantidade', parseInt(e.target.value) || 1)}
                    />
                    {errors[`procedimento_${index}_quantidade`] && (
                      <ErrorMessage>{errors[`procedimento_${index}_quantidade`]}</ErrorMessage>
                    )}
                  </FormGroup>

                  <RemoveProcedureButton
                    type="button"
                    onClick={() => removeProcedure(proc.id)}
                  >
                    ×
                  </RemoveProcedureButton>
                </ProcedureItem>
              ))}

              <AddProcedureButton type="button" onClick={addProcedure}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                Adicionar Procedimento
              </AddProcedureButton>

              {errors.procedimentos && <ErrorMessage>{errors.procedimentos}</ErrorMessage>}
            </ProceduresList>

            <FormGrid style={{ marginTop: '24px' }}>
              <FormGroup>
                <Label>Observações</Label>
                <TextArea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  placeholder="Observações sobre o tratamento..."
                />
              </FormGroup>

              <TotalValue>
                <div className="label">Valor Total do Tratamento</div>
                <div className="value">
                  R$ {formData.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </TotalValue>
            </FormGrid>
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              {treatment ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ModalTratamento;