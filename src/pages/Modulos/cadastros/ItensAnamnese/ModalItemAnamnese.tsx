import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaTimes, FaPlus, FaTrash, FaQuestionCircle } from "react-icons/fa";

interface ItemAnamneseData {
  codigo: string;
  pergunta: string;
  tipo_resposta: string;
  grupo: string;
  obrigatorio: boolean;
  opcoes_resposta?: string[];
  observacoes: string;
  ativo: boolean;
}

interface ModalItemAnamneseProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ItemAnamneseData) => void;
  item: any;
}

// Estilos
const ModalOverlay = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px 12px 0 0;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #8e44ad;
    box-shadow: 0 0 0 3px rgba(142, 68, 173, 0.1);
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #8e44ad;
    box-shadow: 0 0 0 3px rgba(142, 68, 173, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #8e44ad;
    box-shadow: 0 0 0 3px rgba(142, 68, 173, 0.1);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #8e44ad;
`;

const ModalFooter = styled.div`
  padding: 20px 24px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-radius: 0 0 12px 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  ${({ variant = 'primary' }) =>
    variant === 'primary'
      ? `
    background-color: #8e44ad;
    color: white;
    &:hover { background-color: #7a3a99; }
  `
      : `
    background-color: #6c757d;
    color: white;
    &:hover { background-color: #545b62; }
  `}
`;

const ModalItemAnamnese: React.FC<ModalItemAnamneseProps> = ({
  isOpen,
  onClose,
  onSave,
  item
}) => {
  const [formData, setFormData] = useState<ItemAnamneseData>({
    codigo: '',
    pergunta: '',
    tipo_resposta: 'Texto',
    grupo: '',
    obrigatorio: false,
    opcoes_resposta: [],
    observacoes: '',
    ativo: true
  });

  useEffect(() => {
    if (item) {
      setFormData({
        codigo: item.codigo || '',
        pergunta: item.pergunta || '',
        tipo_resposta: item.tipo_resposta || 'Texto',
        grupo: item.grupo || '',
        obrigatorio: item.obrigatorio || false,
        opcoes_resposta: item.opcoes_resposta || [],
        observacoes: item.observacoes || '',
        ativo: item.ativo !== undefined ? item.ativo : true
      });
    } else {
      setFormData({
        codigo: '',
        pergunta: '',
        tipo_resposta: 'Texto',
        grupo: '',
        obrigatorio: false,
        opcoes_resposta: [],
        observacoes: '',
        ativo: true
      });
    }
  }, [item, isOpen]);

  const tiposResposta = [
    'Texto',
    'Sim/Não',
    'Múltipla Escolha',
    'Número',
    'Data',
    'Escala 1-10'
  ];

  const gruposDisponiveis = [
    'Alergias',
    'Doenças Crônicas',
    'Condições Especiais',
    'Histórico Odontológico',
    'Hábitos',
    'Sintomas Atuais',
    'Medicamentos',
    'Exames Anteriores'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>
            {item ? 'Editar Item de Anamnese' : 'Novo Item de Anamnese'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="codigo">Código*</Label>
              <Input
                id="codigo"
                name="codigo"
                type="text"
                value={formData.codigo}
                onChange={handleInputChange}
                placeholder="Ex: ANAM001"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="pergunta">Pergunta*</Label>
              <Input
                id="pergunta"
                name="pergunta"
                type="text"
                value={formData.pergunta}
                onChange={handleInputChange}
                placeholder="Digite a pergunta da anamnese"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="grupo">Grupo*</Label>
              <Select
                id="grupo"
                name="grupo"
                value={formData.grupo}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione um grupo</option>
                {gruposDisponiveis.map(grupo => (
                  <option key={grupo} value={grupo}>{grupo}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="tipo_resposta">Tipo de Resposta</Label>
              <Select
                id="tipo_resposta"
                name="tipo_resposta"
                value={formData.tipo_resposta}
                onChange={handleInputChange}
              >
                {tiposResposta.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </Select>
            </FormGroup>

            <CheckboxGroup>
              <Checkbox
                type="checkbox"
                id="obrigatorio"
                name="obrigatorio"
                checked={formData.obrigatorio}
                onChange={handleInputChange}
              />
              <Label htmlFor="obrigatorio">Pergunta obrigatória</Label>
            </CheckboxGroup>

            <CheckboxGroup>
              <Checkbox
                type="checkbox"
                id="ativo"
                name="ativo"
                checked={formData.ativo}
                onChange={handleInputChange}
              />
              <Label htmlFor="ativo">Item ativo</Label>
            </CheckboxGroup>

            <FormGroup>
              <Label htmlFor="observacoes">Observações</Label>
              <TextArea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                placeholder="Observações sobre este item de anamnese (opcional)"
              />
            </FormGroup>
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {item ? 'Atualizar' : 'Salvar'}
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ModalItemAnamnese;