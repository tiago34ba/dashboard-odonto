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
  width: 95%;
  max-width: 1200px;
  max-height: 95vh;
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
  background: linear-gradient(135deg, #2196f3 0%, #21cbf3 100%);
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
  max-height: calc(95vh - 200px);
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
  grid-template-columns: 300px 1fr;
  gap: 32px;
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
    border-color: #2196f3;
    background: white;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
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
    border-color: #2196f3;
    background: white;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
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
    border-color: #2196f3;
    background: white;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
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
    background: linear-gradient(135deg, #2196f3 0%, #21cbf3 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(33, 150, 243, 0.3);
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

const OdontogramaContainer = styled.div`
  background: white;
  border: 3px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const DentalChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
`;

const Arcada = styled.div`
  display: flex;
  gap: 4px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px solid #e9ecef;

  &.superior {
    border-top: 3px solid #2196f3;
  }

  &.inferior {
    border-bottom: 3px solid #2196f3;
  }
`;

const Tooth = styled.div<{ isSelected: boolean; status: string }>`
  width: 40px;
  height: 50px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  background: ${props => {
    switch (props.status) {
      case 'higido': return '#d4edda';
      case 'cariado': return '#f8d7da';
      case 'restaurado': return '#d1ecf1';
      case 'extraido': return '#f5f5f5';
      case 'implante': return '#fff3cd';
      case 'tratamento': return '#e2e3e5';
      default: return 'white';
    }
  }};

  ${props => props.isSelected && `
    border-color: #2196f3;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
    transform: scale(1.05);
  `}

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .tooth-number {
    font-size: 0.75rem;
    font-weight: 600;
    color: #495057;
  }

  .tooth-icon {
    font-size: 1.2rem;
    margin: 2px 0;
  }
`;

const LegendContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const LegendItem = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;

  .color-box {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    background: ${props => props.color};
    border: 1px solid #dee2e6;
  }
`;

const ProcedurePanel = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border: 2px solid #e9ecef;
`;

const ProcedureList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-top: 12px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
  }
`;

const ProcedureItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  margin-bottom: 6px;
  border: 1px solid #e5e7eb;

  .procedure-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .tooth-number {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 600;
  }

  .procedure-name {
    font-size: 0.85rem;
    color: #374151;
  }

  .remove-btn {
    background: none;
    border: none;
    color: #ef4444;
    cursor: pointer;
    font-size: 16px;
    padding: 4px;
    border-radius: 4px;
    transition: background 0.2s;

    &:hover {
      background: #fee2e2;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const ActionButton = styled.button<{ color: string }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.color};
  color: white;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Interfaces
interface ToothProcedure {
  toothNumber: number;
  procedure: string;
  date: string;
  notes: string;
}

interface Odontograma {
  id?: number;
  paciente: string;
  dentista: string;
  dataExame: string;
  observacoes: string;
  teethStatus: Record<number, string>;
  procedures: ToothProcedure[];
  proximaConsulta: string;
  planTratamento: string;
}

interface ModalOdontogramaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (odontograma: Odontograma) => void;
  odontograma?: Odontograma | null;
}

const ModalOdontograma: React.FC<ModalOdontogramaProps> = ({
  isOpen,
  onClose,
  onSave,
  odontograma
}) => {
  const [formData, setFormData] = useState<Odontograma>({
    paciente: '',
    dentista: '',
    dataExame: '',
    observacoes: '',
    teethStatus: {},
    procedures: [],
    proximaConsulta: '',
    planTratamento: ''
  });

  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
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

  const procedimentosDisponiveis = [
    'Exame Clínico',
    'Limpeza',
    'Restauração',
    'Canal',
    'Extração',
    'Implante',
    'Prótese',
    'Clareamento',
    'Faceta',
    'Coroa',
    'Selante',
    'Fluorterapia'
  ];

  const statusOptions = [
    { value: 'higido', label: 'Hígido', color: '#d4edda' },
    { value: 'cariado', label: 'Cariado', color: '#f8d7da' },
    { value: 'restaurado', label: 'Restaurado', color: '#d1ecf1' },
    { value: 'extraido', label: 'Extraído', color: '#f5f5f5' },
    { value: 'implante', label: 'Implante', color: '#fff3cd' },
    { value: 'tratamento', label: 'Em Tratamento', color: '#e2e3e5' }
  ];

  // Numeração dos dentes (sistema FDI)
  const teethNumbers = {
    superior: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
    inferior: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
  };

  useEffect(() => {
    if (odontograma) {
      setFormData(odontograma);
    } else {
      setFormData({
        paciente: '',
        dentista: '',
        dataExame: '',
        observacoes: '',
        teethStatus: {},
        procedures: [],
        proximaConsulta: '',
        planTratamento: ''
      });
    }
    setErrors({});
    setSelectedTooth(null);
  }, [odontograma, isOpen]);

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

  const handleToothClick = (toothNumber: number) => {
    setSelectedTooth(toothNumber);
  };

  const handleToothStatusChange = (status: string) => {
    if (selectedTooth) {
      setFormData(prev => ({
        ...prev,
        teethStatus: {
          ...prev.teethStatus,
          [selectedTooth]: status
        }
      }));
    }
  };

  const addProcedure = (procedure: string) => {
    if (selectedTooth) {
      const newProcedure: ToothProcedure = {
        toothNumber: selectedTooth,
        procedure,
        date: new Date().toISOString().split('T')[0],
        notes: ''
      };

      setFormData(prev => ({
        ...prev,
        procedures: [...prev.procedures, newProcedure]
      }));
    }
  };

  const removeProcedure = (index: number) => {
    setFormData(prev => ({
      ...prev,
      procedures: prev.procedures.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.paciente) {
      newErrors.paciente = 'Paciente é obrigatório';
    }

    if (!formData.dentista) {
      newErrors.dentista = 'Dentista é obrigatório';
    }

    if (!formData.dataExame) {
      newErrors.dataExame = 'Data do exame é obrigatória';
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

  const getToothIcon = (status: string) => {
    switch (status) {
      case 'cariado': return '🦷';
      case 'restaurado': return '⚪';
      case 'extraido': return '❌';
      case 'implante': return '⚙️';
      case 'tratamento': return '🔧';
      default: return '🦷';
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9Z"/>
            </svg>
            {odontograma ? 'Editar Odontograma' : 'Novo Odontograma'}
          </h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGrid>
              <div>
                <SectionTitle>Informações do Exame</SectionTitle>
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
                  <Label>Data do Exame *</Label>
                  <Input
                    type="date"
                    name="dataExame"
                    value={formData.dataExame}
                    onChange={handleInputChange}
                  />
                  {errors.dataExame && <ErrorMessage>{errors.dataExame}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label>Próxima Consulta</Label>
                  <Input
                    type="date"
                    name="proximaConsulta"
                    value={formData.proximaConsulta}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Observações</Label>
                  <TextArea
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleInputChange}
                    placeholder="Observações gerais do exame..."
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Plano de Tratamento</Label>
                  <TextArea
                    name="planTratamento"
                    value={formData.planTratamento}
                    onChange={handleInputChange}
                    placeholder="Descreva o plano de tratamento..."
                  />
                </FormGroup>

                {selectedTooth && (
                  <ProcedurePanel>
                    <SectionTitle>Dente {selectedTooth} Selecionado</SectionTitle>
                    
                    <Label>Status do Dente:</Label>
                    <ActionButtons>
                      {statusOptions.map(status => (
                        <ActionButton
                          key={status.value}
                          type="button"
                          color={status.color}
                          onClick={() => handleToothStatusChange(status.value)}
                        >
                          {status.label}
                        </ActionButton>
                      ))}
                    </ActionButtons>

                    <Label style={{ marginTop: '16px' }}>Adicionar Procedimento:</Label>
                    <ActionButtons>
                      {procedimentosDisponiveis.map(proc => (
                        <ActionButton
                          key={proc}
                          type="button"
                          color="#2196f3"
                          onClick={() => addProcedure(proc)}
                        >
                          {proc}
                        </ActionButton>
                      ))}
                    </ActionButtons>
                  </ProcedurePanel>
                )}

                {formData.procedures.length > 0 && (
                  <div>
                    <SectionTitle>Procedimentos Registrados</SectionTitle>
                    <ProcedureList>
                      {formData.procedures.map((proc, index) => (
                        <ProcedureItem key={index}>
                          <div className="procedure-info">
                            <div className="tooth-number">Dente {proc.toothNumber}</div>
                            <div className="procedure-name">{proc.procedure}</div>
                          </div>
                          <button
                            type="button"
                            className="remove-btn"
                            onClick={() => removeProcedure(index)}
                          >
                            ×
                          </button>
                        </ProcedureItem>
                      ))}
                    </ProcedureList>
                  </div>
                )}
              </div>

              <div>
                <SectionTitle>Odontograma</SectionTitle>
                <OdontogramaContainer>
                  <DentalChart>
                    {/* Arcada Superior */}
                    <div>
                      <Label style={{ textAlign: 'center', marginBottom: '8px' }}>Arcada Superior</Label>
                      <Arcada className="superior">
                        {teethNumbers.superior.map(toothNumber => (
                          <Tooth
                            key={toothNumber}
                            isSelected={selectedTooth === toothNumber}
                            status={formData.teethStatus[toothNumber] || 'higido'}
                            onClick={() => handleToothClick(toothNumber)}
                          >
                            <div className="tooth-number">{toothNumber}</div>
                            <div className="tooth-icon">
                              {getToothIcon(formData.teethStatus[toothNumber] || 'higido')}
                            </div>
                          </Tooth>
                        ))}
                      </Arcada>
                    </div>

                    {/* Arcada Inferior */}
                    <div>
                      <Label style={{ textAlign: 'center', marginBottom: '8px' }}>Arcada Inferior</Label>
                      <Arcada className="inferior">
                        {teethNumbers.inferior.map(toothNumber => (
                          <Tooth
                            key={toothNumber}
                            isSelected={selectedTooth === toothNumber}
                            status={formData.teethStatus[toothNumber] || 'higido'}
                            onClick={() => handleToothClick(toothNumber)}
                          >
                            <div className="tooth-number">{toothNumber}</div>
                            <div className="tooth-icon">
                              {getToothIcon(formData.teethStatus[toothNumber] || 'higido')}
                            </div>
                          </Tooth>
                        ))}
                      </Arcada>
                    </div>
                  </DentalChart>

                  <LegendContainer>
                    {statusOptions.map(status => (
                      <LegendItem key={status.value} color={status.color}>
                        <div className="color-box"></div>
                        <span>{status.label}</span>
                      </LegendItem>
                    ))}
                  </LegendContainer>

                  <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: '#6b7280' }}>
                    Clique em um dente para selecioná-lo e adicionar procedimentos ou alterar status
                  </div>
                </OdontogramaContainer>
              </div>
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
              {odontograma ? 'Atualizar' : 'Salvar Odontograma'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ModalOdontograma;