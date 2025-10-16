import React, { useState } from "react";
import styled from "styled-components";
import { FaTimes, FaCalendarCheck, FaUser, FaUserMd, FaClock, FaStickyNote } from "react-icons/fa";

interface ModalAgendamentoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (agendamento: NovoAgendamento) => void;
}

interface NovoAgendamento {
  paciente_id: string;
  dentista_id: string;
  procedimento_id: string;
  data: string;
  hora: string;
  observacoes?: string;
  telefone_contato?: string;
  duracao_estimada?: number;
}

// Dados fake para os selects
const pacientesFake = [
  { id: '1', nome: 'Maria Silva Santos', telefone: '(11) 99999-1111' },
  { id: '2', nome: 'Carlos Eduardo Lima', telefone: '(11) 98888-2222' },
  { id: '3', nome: 'Fernanda Oliveira', telefone: '(11) 97777-3333' },
  { id: '4', nome: 'Roberto Souza', telefone: '(11) 96666-4444' },
  { id: '5', nome: 'Juliana Santos', telefone: '(11) 95555-5555' },
  { id: '6', nome: 'Paulo Henrique', telefone: '(11) 94444-6666' },
  { id: '7', nome: 'Sandra Regina', telefone: '(11) 93333-7777' },
  { id: '8', nome: 'José Carlos', telefone: '(11) 92222-8888' }
];

const dentistasFake = [
  { id: '1', nome: 'Dr. João Pereira', especialidade: 'Clínico Geral' },
  { id: '2', nome: 'Dra. Ana Costa', especialidade: 'Periodontia' },
  { id: '3', nome: 'Dr. Carlos Silva', especialidade: 'Cirurgia' },
  { id: '4', nome: 'Dra. Patrícia Lima', especialidade: 'Endodontia' },
  { id: '5', nome: 'Dra. Mariana Santos', especialidade: 'Prótese' }
];

const procedimentosFake = [
  { id: '1', nome: 'Limpeza e Profilaxia', duracao: 45, valor: 150 },
  { id: '2', nome: 'Restauração em Resina', duracao: 60, valor: 250 },
  { id: '3', nome: 'Tratamento de Canal', duracao: 90, valor: 600 },
  { id: '4', nome: 'Extração Simples', duracao: 30, valor: 150 },
  { id: '5', nome: 'Consulta Ortodôntica', duracao: 45, valor: 600 },
  { id: '6', nome: 'Implante Dentário', duracao: 120, valor: 1500 },
  { id: '7', nome: 'Prótese Fixa', duracao: 75, valor: 500 },
  { id: '8', nome: 'Clareamento Dental', duracao: 60, valor: 200 },
  { id: '9', nome: 'Cirurgia de Siso', duracao: 45, valor: 400 },
  { id: '10', nome: 'Aplicação de Flúor', duracao: 15, valor: 50 }
];

// Estilos
const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: modalAppear 0.3s ease-out;

  @keyframes modalAppear {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-50px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const ModalBody = styled.div`
  padding: 30px;
`;

const Form = styled.form`
  display: grid;
  gap: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:invalid {
    border-color: #dc3545;
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const InfoCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin-top: 10px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 14px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  color: #6c757d;
`;

const InfoValue = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding: 20px 30px;
  border-top: 1px solid #e9ecef;
  background-color: #f8f9fa;
  border-radius: 0 0 12px 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  ${({ variant = 'primary' }) =>
    variant === 'primary'
      ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
  `
      : `
    background-color: #6c757d;
    color: white;
    &:hover {
      background-color: #5a6268;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
`;

export default function ModalAgendamento({ isOpen, onClose, onSave }: ModalAgendamentoProps) {
  const [formData, setFormData] = useState<NovoAgendamento>({
    paciente_id: '',
    dentista_id: '',
    procedimento_id: '',
    data: '',
    hora: '',
    observacoes: '',
    telefone_contato: '',
    duracao_estimada: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPaciente, setSelectedPaciente] = useState<any>(null);
  const [selectedProcedimento, setSelectedProcedimento] = useState<any>(null);

  // Função para validar o formulário
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.paciente_id) {
      newErrors.paciente_id = 'Selecione um paciente';
    }

    if (!formData.dentista_id) {
      newErrors.dentista_id = 'Selecione um dentista';
    }

    if (!formData.procedimento_id) {
      newErrors.procedimento_id = 'Selecione um procedimento';
    }

    if (!formData.data) {
      newErrors.data = 'Selecione uma data';
    } else {
      const selectedDate = new Date(formData.data);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.data = 'A data não pode ser anterior ao dia atual';
      }
    }

    if (!formData.hora) {
      newErrors.hora = 'Selecione um horário';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para lidar com mudanças nos campos
  const handleInputChange = (field: keyof NovoAgendamento, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Atualizar informações relacionadas
    if (field === 'paciente_id') {
      const paciente = pacientesFake.find(p => p.id === value);
      setSelectedPaciente(paciente);
      if (paciente) {
        setFormData(prev => ({ ...prev, telefone_contato: paciente.telefone }));
      }
    }

    if (field === 'procedimento_id') {
      const procedimento = procedimentosFake.find(p => p.id === value);
      setSelectedProcedimento(procedimento);
      if (procedimento) {
        setFormData(prev => ({ ...prev, duracao_estimada: procedimento.duracao }));
      }
    }
  };

  // Função para gerar horários disponíveis
  const gerarHorarios = () => {
    const horarios = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const hourStr = hour.toString().padStart(2, '0');
        const minStr = min.toString().padStart(2, '0');
        horarios.push(`${hourStr}:${minStr}`);
      }
    }
    return horarios;
  };

  // Função para salvar
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      handleClose();
    }
  };

  // Função para fechar modal
  const handleClose = () => {
    setFormData({
      paciente_id: '',
      dentista_id: '',
      procedimento_id: '',
      data: '',
      hora: '',
      observacoes: '',
      telefone_contato: '',
      duracao_estimada: 0
    });
    setErrors({});
    setSelectedPaciente(null);
    setSelectedProcedimento(null);
    onClose();
  };

  return (
    <ModalOverlay isOpen={isOpen} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <FaCalendarCheck />
            Novo Agendamento
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSave}>
            <FormRow>
              <FormGroup>
                <Label>
                  <FaUser />
                  Paciente *
                </Label>
                <Select
                  value={formData.paciente_id}
                  onChange={(e) => handleInputChange('paciente_id', e.target.value)}
                  required
                >
                  <option value="">Selecione um paciente</option>
                  {pacientesFake.map((paciente) => (
                    <option key={paciente.id} value={paciente.id}>
                      {paciente.nome}
                    </option>
                  ))}
                </Select>
                {errors.paciente_id && <ErrorMessage>{errors.paciente_id}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaUserMd />
                  Dentista *
                </Label>
                <Select
                  value={formData.dentista_id}
                  onChange={(e) => handleInputChange('dentista_id', e.target.value)}
                  required
                >
                  <option value="">Selecione um dentista</option>
                  {dentistasFake.map((dentista) => (
                    <option key={dentista.id} value={dentista.id}>
                      {dentista.nome} - {dentista.especialidade}
                    </option>
                  ))}
                </Select>
                {errors.dentista_id && <ErrorMessage>{errors.dentista_id}</ErrorMessage>}
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>
                <FaStickyNote />
                Procedimento *
              </Label>
              <Select
                value={formData.procedimento_id}
                onChange={(e) => handleInputChange('procedimento_id', e.target.value)}
                required
              >
                <option value="">Selecione um procedimento</option>
                {procedimentosFake.map((procedimento) => (
                  <option key={procedimento.id} value={procedimento.id}>
                    {procedimento.nome} - R$ {procedimento.valor.toLocaleString('pt-BR')} ({procedimento.duracao} min)
                  </option>
                ))}
              </Select>
              {errors.procedimento_id && <ErrorMessage>{errors.procedimento_id}</ErrorMessage>}
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label>
                  <FaCalendarCheck />
                  Data *
                </Label>
                <Input
                  type="date"
                  value={formData.data}
                  onChange={(e) => handleInputChange('data', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                {errors.data && <ErrorMessage>{errors.data}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaClock />
                  Horário *
                </Label>
                <Select
                  value={formData.hora}
                  onChange={(e) => handleInputChange('hora', e.target.value)}
                  required
                >
                  <option value="">Selecione um horário</option>
                  {gerarHorarios().map((horario) => (
                    <option key={horario} value={horario}>
                      {horario}
                    </option>
                  ))}
                </Select>
                {errors.hora && <ErrorMessage>{errors.hora}</ErrorMessage>}
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>Telefone de Contato</Label>
              <Input
                type="tel"
                value={formData.telefone_contato}
                onChange={(e) => handleInputChange('telefone_contato', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <FaStickyNote />
                Observações
              </Label>
              <TextArea
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                placeholder="Observações adicionais sobre o agendamento..."
              />
            </FormGroup>

            {/* Card de Informações do Agendamento */}
            {(selectedPaciente || selectedProcedimento) && (
              <InfoCard>
                <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Resumo do Agendamento</h4>
                {selectedPaciente && (
                  <>
                    <InfoRow>
                      <InfoLabel>Paciente:</InfoLabel>
                      <InfoValue>{selectedPaciente.nome}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>Telefone:</InfoLabel>
                      <InfoValue>{selectedPaciente.telefone}</InfoValue>
                    </InfoRow>
                  </>
                )}
                {selectedProcedimento && (
                  <>
                    <InfoRow>
                      <InfoLabel>Procedimento:</InfoLabel>
                      <InfoValue>{selectedProcedimento.nome}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>Duração Estimada:</InfoLabel>
                      <InfoValue>{selectedProcedimento.duracao} minutos</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>Valor:</InfoLabel>
                      <InfoValue>R$ {selectedProcedimento.valor.toLocaleString('pt-BR')}</InfoValue>
                    </InfoRow>
                  </>
                )}
              </InfoCard>
            )}
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="button" variant="primary" onClick={handleSave}>
            Agendar Consulta
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}