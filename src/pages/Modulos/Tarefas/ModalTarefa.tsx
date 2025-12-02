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
  background: linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%);
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
    border-color: #6f42c1;
    background: white;
    box-shadow: 0 0 0 3px rgba(111, 66, 193, 0.1);
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
    border-color: #6f42c1;
    background: white;
    box-shadow: 0 0 0 3px rgba(111, 66, 193, 0.1);
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
  min-height: 120px;
  resize: vertical;
  background: #fafafa;
  transition: all 0.2s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #6f42c1;
    background: white;
    box-shadow: 0 0 0 3px rgba(111, 66, 193, 0.1);
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
    background: linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(111, 66, 193, 0.3);
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

const PriorityBadge = styled.span<{ priority: string }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => {
    switch (props.priority) {
      case 'baixa':
        return `
          background: #d1fae5;
          color: #065f46;
        `;
      case 'media':
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case 'alta':
        return `
          background: #fecaca;
          color: #991b1b;
        `;
      case 'urgente':
        return `
          background: #dc2626;
          color: white;
        `;
      default:
        return `
          background: #f3f4f6;
          color: #6b7280;
        `;
    }
  }}
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
      case 'em_andamento':
        return `
          background: #dbeafe;
          color: #1e40af;
        `;
      case 'concluida':
        return `
          background: #d1fae5;
          color: #065f46;
        `;
      case 'cancelada':
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

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

// Interfaces
interface Task {
  id?: number;
  titulo: string;
  descricao: string;
  responsavel: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  prazo: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  progresso: number;
  categoria: string;
  observacoes: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

interface ModalTarefaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task?: Task | null;
}

const ModalTarefa: React.FC<ModalTarefaProps> = ({
  isOpen,
  onClose,
  onSave,
  task
}) => {
  const [formData, setFormData] = useState<Task>({
    titulo: '',
    descricao: '',
    responsavel: '',
    prioridade: 'media',
    prazo: '',
    status: 'pendente',
    progresso: 0,
    categoria: '',
    observacoes: '',
    dataCriacao: '',
    dataAtualizacao: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dados mockados
  const funcionarios = [
    { id: 1, nome: 'Dr. Carlos Mendes' },
    { id: 2, nome: 'Dra. Fernanda Lima' },
    { id: 3, nome: 'Ana Costa (Recepcionista)' },
    { id: 4, nome: 'João Santos (Auxiliar)' },
    { id: 5, nome: 'Maria Silva (Higienista)' }
  ];

  const categorias = [
    'Administrativo',
    'Atendimento',
    'Financeiro',
    'Marketing',
    'Manutenção',
    'Compras',
    'Relacionamento',
    'Treinamento',
    'Outros'
  ];

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      const hoje = new Date().toISOString().split('T')[0];
      setFormData({
        titulo: '',
        descricao: '',
        responsavel: '',
        prioridade: 'media',
        prazo: '',
        status: 'pendente',
        progresso: 0,
        categoria: '',
        observacoes: '',
        dataCriacao: hoje,
        dataAtualizacao: hoje
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Atualizar progresso automaticamente baseado no status
    let newProgress = formData.progresso;
    if (name === 'status') {
      switch (value) {
        case 'pendente':
          newProgress = 0;
          break;
        case 'em_andamento':
          newProgress = formData.progresso || 25;
          break;
        case 'concluida':
          newProgress = 100;
          break;
        case 'cancelada':
          newProgress = 0;
          break;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === 'progresso' ? parseInt(value) || 0 : value,
      ...(name === 'status' && { progresso: newProgress }),
      dataAtualizacao: new Date().toISOString().split('T')[0]
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

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!formData.responsavel) {
      newErrors.responsavel = 'Responsável é obrigatório';
    }

    if (!formData.prazo) {
      newErrors.prazo = 'Prazo é obrigatório';
    } else {
      const prazoDate = new Date(formData.prazo);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      if (prazoDate < hoje) {
        newErrors.prazo = 'Prazo não pode ser anterior à data atual';
      }
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Categoria é obrigatória';
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

  const calcularDiasRestantes = () => {
    if (!formData.prazo) return null;
    
    const hoje = new Date();
    const prazo = new Date(formData.prazo);
    const diffTime = prazo.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const diasRestantes = calcularDiasRestantes();

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <SectionTitle>Informações da Tarefa</SectionTitle>
            <FormGrid>
              <FormGroup style={{ gridColumn: '1 / -1' }}>
                <Label>Título *</Label>
                <Input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  placeholder="Digite o título da tarefa"
                />
                {errors.titulo && <ErrorMessage>{errors.titulo}</ErrorMessage>}
              </FormGroup>

              <FormGroup style={{ gridColumn: '1 / -1' }}>
                <Label>Descrição *</Label>
                <TextArea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descreva detalhadamente a tarefa..."
                />
                {errors.descricao && <ErrorMessage>{errors.descricao}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Responsável *</Label>
                <Select
                  name="responsavel"
                  value={formData.responsavel}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione um responsável</option>
                  {funcionarios.map(f => (
                    <option key={f.id} value={f.nome}>{f.nome}</option>
                  ))}
                </Select>
                {errors.responsavel && <ErrorMessage>{errors.responsavel}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Categoria *</Label>
                <Select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Select>
                {errors.categoria && <ErrorMessage>{errors.categoria}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Prioridade</Label>
                <Select
                  name="prioridade"
                  value={formData.prioridade}
                  onChange={handleInputChange}
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </Select>
                <PriorityBadge priority={formData.prioridade}>
                  {formData.prioridade}
                </PriorityBadge>
              </FormGroup>

              <FormGroup>
                <Label>Prazo *</Label>
                <Input
                  type="date"
                  name="prazo"
                  value={formData.prazo}
                  onChange={handleInputChange}
                />
                {errors.prazo && <ErrorMessage>{errors.prazo}</ErrorMessage>}
                {diasRestantes !== null && (
                  <span style={{ 
                    fontSize: '0.85rem', 
                    color: diasRestantes < 0 ? '#ef4444' : diasRestantes <= 3 ? '#f59e0b' : '#10b981',
                    marginTop: '4px'
                  }}>
                    {diasRestantes < 0 
                      ? `Atrasado por ${Math.abs(diasRestantes)} dias`
                      : diasRestantes === 0 
                        ? 'Vence hoje'
                        : `${diasRestantes} dias restantes`
                    }
                  </span>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Status</Label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="pendente">Pendente</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluida">Concluída</option>
                  <option value="cancelada">Cancelada</option>
                </Select>
                <StatusBadge status={formData.status}>
                  {formData.status.replace('_', ' ')}
                </StatusBadge>
              </FormGroup>

              <FormGroup>
                <Label>Progresso ({formData.progresso}%)</Label>
                <Input
                  type="range"
                  name="progresso"
                  min="0"
                  max="100"
                  value={formData.progresso}
                  onChange={handleInputChange}
                  disabled={formData.status === 'concluida' || formData.status === 'cancelada'}
                />
                <ProgressBar>
                  <ProgressFill progress={formData.progresso} />
                </ProgressBar>
              </FormGroup>
            </FormGrid>

            <FormGroup>
              <Label>Observações</Label>
              <TextArea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                placeholder="Observações adicionais sobre a tarefa..."
                style={{ minHeight: '80px' }}
              />
            </FormGroup>

            {task && (
              <FormGrid style={{ marginTop: '24px' }}>
                <FormGroup>
                  <Label>Data de Criação</Label>
                  <Input
                    type="date"
                    value={formData.dataCriacao}
                    disabled
                    style={{ background: '#f3f4f6', color: '#6b7280' }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Última Atualização</Label>
                  <Input
                    type="date"
                    value={formData.dataAtualizacao}
                    disabled
                    style={{ background: '#f3f4f6', color: '#6b7280' }}
                  />
                </FormGroup>
              </FormGrid>
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
              {task ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ModalTarefa;