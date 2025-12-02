import React, { useState } from 'react';
import styled from 'styled-components';

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #1e88e5 0%, #1976d2 100%);
  color: white;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background-color: #fafafa;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
`;

const FormInput = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
  }

  &[type="date"], &[type="time"] {
    cursor: pointer;
  }
`;

const FormSelect = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
  }
`;

const FormTextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
  }
`;

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
  margin-top: 16px;
`;

const TimeOption = styled.label<{ 
  selected?: boolean; 
  status?: 'available' | 'occupied' | 'cancelled' 
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border: 2px solid ${props => {
    if (props.selected) return '#1976d2';
    if (props.status === 'occupied') return '#f44336';
    if (props.status === 'cancelled') return '#ff9800';
    return '#ddd';
  }};
  border-radius: 6px;
  cursor: ${props => props.status === 'occupied' ? 'not-allowed' : 'pointer'};
  font-size: 14px;
  font-weight: 500;
  background-color: ${props => {
    if (props.selected) return '#1976d2';
    if (props.status === 'occupied') return '#ffebee';
    if (props.status === 'cancelled') return '#fff3e0';
    return 'white';
  }};
  color: ${props => {
    if (props.selected) return 'white';
    if (props.status === 'occupied') return '#f44336';
    if (props.status === 'cancelled') return '#ff9800';
    return '#333';
  }};
  transition: all 0.2s ease;
  opacity: ${props => props.status === 'occupied' ? '0.6' : '1'};

  &:hover {
    border-color: ${props => {
      if (props.status === 'occupied') return '#f44336';
      if (props.status === 'cancelled') return '#ff9800';
      return '#1976d2';
    }};
    background-color: ${props => {
      if (props.selected) return '#1976d2';
      if (props.status === 'occupied') return '#ffebee';
      if (props.status === 'cancelled') return '#fff3e0';
      return '#f0f7ff';
    }};
  }

  input[type="radio"] {
    display: none;
  }
`;

const TimeLegend = styled.div`
  display: flex;
  gap: 20px;
  margin: 16px 0 8px 0;
  font-size: 12px;
  color: #666;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${props => props.color};
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  background-color: white;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${props => props.variant === 'primary' ? `
    background: #1976d2;
    color: white;
    
    &:hover:not(:disabled) {
      background: #1565c0;
    }
  ` : `
    background: #f5f5f5;
    color: #666;
    
    &:hover:not(:disabled) {
      background: #e0e0e0;
    }
  `}
`;

const AddButton = styled.button`
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background: #1565c0;
  }
`;

// Interface
interface AddAgendamentoModalProps {
  onClose: () => void;
  onSubmit: (agendamento: any) => void;
  agendamentosExistentes?: Array<{ data: string; hora: string; status: string }>;
}

const AddAgendamentoModal: React.FC<AddAgendamentoModalProps> = ({ 
  onClose, 
  onSubmit, 
  agendamentosExistentes = [] 
}) => {
  const [formData, setFormData] = useState({
    paciente: '',
    profissional: '',
    procedimento: '',
    data: '',
    hora: '',
    telefone: '',
    observacoes: '',
    retorno: false
  });

  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Horários disponíveis de 07:00 às 20:00
  const timeSlots = [
    '07:00', '07:15', '07:30', '07:45', '08:00', '08:15',
    '08:30', '08:45', '09:00', '09:15', '09:30', '09:45',
    '10:00', '10:15', '10:30', '10:45', '11:00', '11:15',
    '11:30', '11:45', '12:00', '12:15', '12:30', '12:45',
    '13:00', '13:15', '13:30', '13:45', '14:00', '14:15',
    '14:30', '14:45', '15:00', '15:15', '15:30', '15:45',
    '16:00', '16:15', '16:30', '16:45', '17:00', '17:15',
    '17:30', '17:45', '18:00', '18:15', '18:30', '18:45',
    '19:00', '19:15', '19:30', '19:45', '20:00'
  ];

  // Função para verificar se um horário está disponível
  const isTimeAvailable = (time: string, selectedDate: string) => {
    if (!selectedDate) return true; // Se não há data selecionada, todos os horários aparecem como disponíveis
    
    const agendamento = agendamentosExistentes.find(
      ag => ag.data === selectedDate && ag.hora === time && ag.status !== 'cancelado'
    );
    
    return !agendamento; // Retorna true se não há agendamento (disponível) ou false se já está ocupado
  };

  // Função para obter o status de um horário
  const getTimeStatus = (time: string, selectedDate: string) => {
    if (!selectedDate) return 'available';
    
    const agendamento = agendamentosExistentes.find(
      ag => ag.data === selectedDate && ag.hora === time
    );
    
    if (!agendamento) return 'available';
    if (agendamento.status === 'cancelado') return 'cancelled';
    return 'occupied';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleTimeSelect = (time: string) => {
    if (!isTimeAvailable(time, formData.data)) {
      alert('Este horário não está disponível para a data selecionada.');
      return;
    }
    
    setSelectedTime(time);
    setFormData(prev => ({
      ...prev,
      hora: time
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validações
    if (!formData.paciente) {
      alert('Por favor, selecione um paciente.');
      return;
    }
    
    if (!formData.profissional) {
      alert('Por favor, selecione um profissional.');
      return;
    }
    
    if (!formData.procedimento) {
      alert('Por favor, selecione um procedimento.');
      return;
    }
    
    if (!formData.data) {
      alert('Por favor, selecione uma data.');
      return;
    }
    
    if (!selectedTime) {
      alert('Por favor, selecione um horário.');
      return;
    }
    
    // Verificar se o horário está disponível
    if (!isTimeAvailable(selectedTime, formData.data)) {
      alert('Este horário não está disponível para a data selecionada.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      onSubmit({ ...formData, hora: selectedTime });
      alert('Agendamento criado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      alert('Erro ao salvar agendamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>Inserir Registro</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormField>
                <FormLabel>Paciente</FormLabel>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <FormSelect
                    name="paciente"
                    value={formData.paciente}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecionar Paciente</option>
                    <option value="Maria Silva">Maria Silva</option>
                    <option value="João Santos">João Santos</option>
                    <option value="Ana Costa">Ana Costa</option>
                  </FormSelect>
                  <AddButton type="button">+</AddButton>
                </div>
              </FormField>

              <FormField>
                <FormLabel>Profissional</FormLabel>
                <FormSelect
                  name="profissional"
                  value={formData.profissional}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Hugo Freitas</option>
                  <option value="Dr. João Pereira">Dr. João Pereira</option>
                  <option value="Dra. Ana Costa">Dra. Ana Costa</option>
                  <option value="Dr. Carlos Silva">Dr. Carlos Silva</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel>Procedimento</FormLabel>
                <FormSelect
                  name="procedimento"
                  value={formData.procedimento}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Limpeza</option>
                  <option value="Limpeza">Limpeza</option>
                  <option value="Restauração">Restauração</option>
                  <option value="Canal">Canal</option>
                  <option value="Extração">Extração</option>
                </FormSelect>
              </FormField>
            </FormGrid>

            <FormGrid>
              <FormField>
                <FormLabel>Data</FormLabel>
                <FormInput
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleInputChange}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel>Telefone</FormLabel>
                <FormInput
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                />
              </FormField>

              <FormField>
                <FormLabel>Retorno</FormLabel>
                <FormSelect
                  name="retorno"
                  value={formData.retorno ? 'Sim' : 'Não'}
                  onChange={(e) => setFormData(prev => ({ ...prev, retorno: e.target.value === 'Sim' }))}
                >
                  <option value="Não">Não</option>
                  <option value="Sim">Sim</option>
                </FormSelect>
              </FormField>
            </FormGrid>

            <FormGrid>
              <FormField>
                <FormLabel>OBS <span style={{ color: '#666', fontWeight: 'normal' }}>(Máx. 100 Caracteres)</span></FormLabel>
                <FormInput
                  type="text"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  maxLength={100}
                />
              </FormField>
            </FormGrid>

            <TimeLegend>
              <LegendItem>
                <LegendColor color="#f0f7ff" />
                Disponível
              </LegendItem>
              <LegendItem>
                <LegendColor color="#ffebee" />
                🔒 Ocupado
              </LegendItem>
              <LegendItem>
                <LegendColor color="#fff3e0" />
                ❌ Cancelado (Disponível)
              </LegendItem>
            </TimeLegend>

            <TimeGrid>
              {timeSlots.map((time) => {
                const status = getTimeStatus(time, formData.data);
                const isAvailable = isTimeAvailable(time, formData.data);
                
                return (
                  <TimeOption
                    key={time}
                    selected={selectedTime === time}
                    status={status}
                    onClick={() => isAvailable && handleTimeSelect(time)}
                    style={{ cursor: !isAvailable ? 'not-allowed' : 'pointer' }}
                  >
                    <input
                      type="radio"
                      name="hora"
                      value={time}
                      checked={selectedTime === time}
                      onChange={() => isAvailable && handleTimeSelect(time)}
                      disabled={!isAvailable}
                    />
                    {time}
                    {status === 'occupied' && ' 🔒'}
                    {status === 'cancelled' && ' ❌'}
                  </TimeOption>
                );
              })}
            </TimeGrid>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Salvando...' : '✓ Salvar'}
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddAgendamentoModal;