import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaTimes, FaToolbox, FaCode, FaTag, FaDollarSign, FaClock, FaStickyNote } from "react-icons/fa";

// Interfaces
interface ProcedimentoData {
  codigo: string;
  nome: string;
  categoria: string;
  valor: number;
  duracao: number;
  descricao: string;
  ativo: boolean;
}

interface ModalProcedimentoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProcedimentoData) => void;
  procedimento?: any;
}

// Estilos do Modal
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
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
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

const Section = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background-color: #fafafa;
`;

const SectionTitle = styled.h4`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &:invalid {
    border-color: #dc3545;
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
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
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
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
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
  accent-color: #007bff;
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
    background-color: #007bff;
    color: white;
    &:hover { background-color: #0056b3; }
  `
      : `
    background-color: #6c757d;
    color: white;
    &:hover { background-color: #545b62; }
  `}
`;

const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
`;

const ModalProcedimento: React.FC<ModalProcedimentoProps> = ({
  isOpen,
  onClose,
  onSave,
  procedimento
}) => {
  const [formData, setFormData] = useState<ProcedimentoData>({
    codigo: '',
    nome: '',
    categoria: '',
    valor: 0,
    duracao: 30,
    descricao: '',
    ativo: true
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (procedimento) {
      setFormData({
        codigo: procedimento.codigo || '',
        nome: procedimento.nome || '',
        categoria: procedimento.categoria || '',
        valor: procedimento.valor || 0,
        duracao: procedimento.duracao || 30,
        descricao: procedimento.descricao || '',
        ativo: procedimento.ativo !== undefined ? procedimento.ativo : true
      });
    } else {
      setFormData({
        codigo: '',
        nome: '',
        categoria: '',
        valor: 0,
        duracao: 30,
        descricao: '',
        ativo: true
      });
    }
    setErrors({});
  }, [procedimento, isOpen]);

  const categorias = [
    'Dentística',
    'Endodontia',
    'Periodontia',
    'Ortodontia',
    'Implantodontia',
    'Cirurgia',
    'Prótese',
    'Prevenção',
    'Radiologia',
    'Clareamento'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'valor') {
      const numValue = parseFloat(value) || 0;
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else if (name === 'duracao') {
      const numValue = parseInt(value) || 0;
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.codigo.trim()) {
      newErrors.codigo = 'Código é obrigatório';
    }

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.categoria.trim()) {
      newErrors.categoria = 'Categoria é obrigatória';
    }

    if (formData.valor <= 0) {
      newErrors.valor = 'Valor deve ser maior que zero';
    }

    if (formData.duracao <= 0) {
      newErrors.duracao = 'Duração deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <FaToolbox />
            {procedimento ? 'Editar Procedimento' : 'Novo Procedimento'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form>
            {/* Informações Básicas */}
            <Section>
              <SectionTitle>
                <FaCode />
                Informações Básicas
              </SectionTitle>
              
              <FormRow>
                <FormGroup>
                  <Label htmlFor="codigo">Código*</Label>
                  <Input
                    id="codigo"
                    name="codigo"
                    type="text"
                    value={formData.codigo}
                    onChange={handleInputChange}
                    placeholder="Ex: PROC001"
                    required
                  />
                  {errors.codigo && <ErrorMessage>{errors.codigo}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="categoria">Categoria*</Label>
                  <Select
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map(categoria => (
                      <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                  </Select>
                  {errors.categoria && <ErrorMessage>{errors.categoria}</ErrorMessage>}
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label htmlFor="nome">Nome do Procedimento*</Label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Nome completo do procedimento"
                  required
                />
                {errors.nome && <ErrorMessage>{errors.nome}</ErrorMessage>}
              </FormGroup>
            </Section>

            {/* Valores e Duração */}
            <Section>
              <SectionTitle>
                <FaDollarSign />
                Valores e Duração
              </SectionTitle>
              
              <FormRow>
                <FormGroup>
                  <Label htmlFor="valor">Valor (R$)*</Label>
                  <Input
                    id="valor"
                    name="valor"
                    type="number"
                    value={formData.valor}
                    onChange={handleInputChange}
                    placeholder="0,00"
                    min="0"
                    step="0.01"
                    required
                  />
                  {errors.valor && <ErrorMessage>{errors.valor}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="duracao">Duração (minutos)*</Label>
                  <Input
                    id="duracao"
                    name="duracao"
                    type="number"
                    value={formData.duracao}
                    onChange={handleInputChange}
                    placeholder="30"
                    min="1"
                    required
                  />
                  {errors.duracao && <ErrorMessage>{errors.duracao}</ErrorMessage>}
                </FormGroup>
              </FormRow>
            </Section>

            {/* Descrição */}
            <Section>
              <SectionTitle>
                <FaStickyNote />
                Descrição
              </SectionTitle>
              
              <FormGroup>
                <Label htmlFor="descricao">Descrição do Procedimento</Label>
                <TextArea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descrição detalhada do procedimento (opcional)"
                />
              </FormGroup>

              <CheckboxGroup>
                <Checkbox
                  type="checkbox"
                  id="ativo"
                  name="ativo"
                  checked={formData.ativo}
                  onChange={handleInputChange}
                />
                <Label htmlFor="ativo">Procedimento ativo</Label>
              </CheckboxGroup>
            </Section>
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" variant="primary" onClick={handleSave}>
            {procedimento ? 'Atualizar' : 'Salvar'} Procedimento
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ModalProcedimento;