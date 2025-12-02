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
  padding: 20px;
  box-sizing: border-box;

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
  border-radius: 20px;
  padding: 0;
  width: 90%;
  max-width: 950px;
  max-height: 95vh;
  min-height: 600px;
  height: auto;
  overflow: hidden;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 768px) {
    width: 95%;
    max-height: 98vh;
    min-height: 500px;
    border-radius: 16px;
  }

  @media (max-height: 700px) {
    min-height: 90vh;
    max-height: 95vh;
  }

  @media (max-height: 600px) {
    min-height: 95vh;
    max-height: 98vh;
  }

  @keyframes slideUp {
    from {
      transform: translateY(40px) scale(0.95);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  padding: 28px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="60" cy="60" r="2"/></g></g></svg>');
    animation: float 20s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  h2 {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 1;
    position: relative;
    letter-spacing: -0.02em;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 300;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
  position: relative;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.95) rotate(90deg);
  }
`;

const ModalBody = styled.div`
  padding: 36px 32px 60px 32px; /* Padding extra no final */
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  min-height: 0; /* Permite que o flex funcione corretamente */
  max-height: calc(100vh - 200px); /* Garante altura máxima */

  @media (max-width: 768px) {
    padding: 24px 20px 50px 20px;
    max-height: calc(100vh - 180px);
  }

  @media (max-height: 600px) {
    padding: 20px 32px 40px 32px;
    max-height: calc(100vh - 160px);
  }

  /* Estilo personalizado da barra de rolagem */
  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #f8f9fa;
    border-radius: 6px;
    margin: 8px 0;
    border: 1px solid #e9ecef;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #ff9800, #f57c00);
    border-radius: 6px;
    transition: all 0.3s ease;
    border: 2px solid #f8f9fa;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #f57c00, #ef6c00);
    box-shadow: 
      inset 0 1px 3px rgba(0,0,0,0.2),
      0 2px 8px rgba(255, 152, 0, 0.3);
    transform: scale(1.05);
  }

  &::-webkit-scrollbar-corner {
    background: #f8f9fa;
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 80px;
  right: 20px;
  width: 6px;
  height: 40px;
  background: linear-gradient(to bottom, transparent, rgba(255, 152, 0, 0.3));
  border-radius: 3px;
  pointer-events: none;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  
  &.hidden {
    opacity: 0;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    gap: 16px;
    margin-bottom: 20px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;

  &:focus-within {
    z-index: 1;
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  letter-spacing: 0.01em;

  &::after {
    content: ${props => props.children?.toString().includes('*') ? '' : ''};
    color: #ef4444;
    margin-left: 2px;
  }
`;

const Input = styled.input`
  padding: 14px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fafafa;
  font-family: inherit;
  position: relative;

  &:focus {
    outline: none;
    border-color: #ff9800;
    background: white;
    box-shadow: 
      0 0 0 4px rgba(255, 152, 0, 0.1),
      0 4px 12px rgba(255, 152, 0, 0.15);
    transform: translateY(-1px);
  }

  &:hover:not(:focus) {
    border-color: #d1d5db;
    background: white;
    transform: translateY(-0.5px);
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
`;

const Select = styled.select`
  padding: 14px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  background: #fafafa;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #ff9800;
    background: white;
    box-shadow: 
      0 0 0 4px rgba(255, 152, 0, 0.1),
      0 4px 12px rgba(255, 152, 0, 0.15);
    transform: translateY(-1px);
  }

  &:hover:not(:focus) {
    border-color: #d1d5db;
    background: white;
    transform: translateY(-0.5px);
  }
`;

const TextArea = styled.textarea`
  padding: 14px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  background: #fafafa;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #ff9800;
    background: white;
    box-shadow: 
      0 0 0 4px rgba(255, 152, 0, 0.1),
      0 4px 12px rgba(255, 152, 0, 0.15);
    transform: translateY(-1px);
  }

  &:hover:not(:focus) {
    border-color: #d1d5db;
    background: white;
    transform: translateY(-0.5px);
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
`;

const ModalFooter = styled.div`
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  padding: 28px 32px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  border-top: 1px solid rgba(229, 231, 235, 0.8);
  backdrop-filter: blur(10px);
  flex-shrink: 0; /* Impede que o footer seja comprimido */
  position: sticky;
  bottom: 0;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 20px;
    gap: 12px;
    flex-direction: column-reverse;
  }

  @media (max-height: 600px) {
    padding: 16px 32px;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 140px;
  justify-content: center;
  position: relative;
  overflow: hidden;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
    color: white;
    box-shadow: 0 4px 14px rgba(255, 152, 0, 0.25);
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 152, 0, 0.4);
      
      &::before {
        left: 100%;
      }
    }
  ` : `
    background: white;
    color: #6b7280;
    border: 2px solid #e5e7eb;
    
    &:hover {
      background: #f9fafb;
      border-color: #d1d5db;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;

  &::before {
    content: '⚠';
    font-size: 0.8rem;
  }
`;

const SectionTitle = styled.h3`
  color: #1f2937;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  padding: 0 0 12px 0;
  border-bottom: 3px solid transparent;
  border-image: linear-gradient(90deg, #ff9800, #f57c00) 1;
  position: relative;
  letter-spacing: -0.01em;

  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, #ff9800, #f57c00);
    border-radius: 2px;
  }
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
      case 'Ativo':
        return `
          background: #d1fae5;
          color: #065f46;
        `;
      case 'Inativo':
        return `
          background: #fed7d7;
          color: #9b2c2c;
        `;
      case 'Pendente':
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      default:
        return `
          background: #f3f4f6;
          color: #6b7280;
        `;
    }
  }}
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .stars {
    display: flex;
    gap: 2px;
  }

  .star {
    cursor: pointer;
    font-size: 1.2rem;
    color: #d1d5db;
    transition: color 0.2s ease;

    &.filled {
      color: #fbbf24;
    }

    &:hover {
      color: #f59e0b;
    }
  }

  .rating-text {
    font-size: 0.85rem;
    color: #6b7280;
    margin-left: 8px;
  }
`;

const CategoryChip = styled.span`
  display: inline-block;
  background: #f3f4f6;
  color: #374151;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  margin: 0 4px 4px 0;
`;

// Interface
interface Fornecedor {
  id: number;
  nome: string;
  razao_social: string;
  cnpj: string;
  tipo: 'Equipamentos' | 'Materiais' | 'Medicamentos' | 'Serviços' | 'Laboratório';
  categoria: string;
  contato: string;
  telefone: string;
  email: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    cidade: string;
    estado: string;
  };
  status: 'Ativo' | 'Inativo' | 'Pendente';
  avaliacao: number;
  created_at: string;
  updated_at: string;
}

interface FormFornecedor {
  id?: number;
  nome: string;
  razao_social: string;
  cnpj: string;
  tipo: 'Equipamentos' | 'Materiais' | 'Medicamentos' | 'Serviços' | 'Laboratório';
  categoria: string;
  contato: string;
  telefone: string;
  email: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    cidade: string;
    estado: string;
  };
  status: 'Ativo' | 'Inativo' | 'Pendente';
  avaliacao: number;
  created_at?: string;
  updated_at?: string;
}

interface ModalFornecedorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fornecedor: any) => void;
  fornecedor?: Fornecedor | null;
}

const ModalFornecedor: React.FC<ModalFornecedorProps> = ({
  isOpen,
  onClose,
  onSave,
  fornecedor
}) => {
  const [formData, setFormData] = useState<FormFornecedor>({
    nome: '',
    razao_social: '',
    cnpj: '',
    tipo: 'Materiais',
    categoria: '',
    contato: '',
    telefone: '',
    email: '',
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      cidade: '',
      estado: ''
    },
    status: 'Ativo',
    avaliacao: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dados para os selects
  const tiposFornecedor = [
    'Equipamentos',
    'Materiais',
    'Medicamentos',
    'Serviços',
    'Laboratório'
  ];

  const categoriasPorTipo = {
    'Equipamentos': ['Cadeiras Odontológicas', 'Raio-X', 'Autoclave', 'Compressor', 'Sugador', 'Fotopolimerizador'],
    'Materiais': ['Resinas', 'Amálgama', 'Anestésicos', 'Luvas', 'Máscaras', 'Instrumentos'],
    'Medicamentos': ['Antibióticos', 'Anti-inflamatórios', 'Analgésicos', 'Antissépticos'],
    'Serviços': ['Laboratório Prótese', 'Manutenção', 'Consultoria', 'Limpeza', 'Segurança'],
    'Laboratório': ['Próteses', 'Ortodontia', 'Implantes', 'Radiologia']
  };

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  useEffect(() => {
    if (fornecedor) {
      setFormData(fornecedor);
    } else {
      setFormData({
        nome: '',
        razao_social: '',
        cnpj: '',
        tipo: 'Materiais',
        categoria: '',
        contato: '',
        telefone: '',
        email: '',
        endereco: {
          cep: '',
          logradouro: '',
          numero: '',
          cidade: '',
          estado: ''
        },
        status: 'Ativo',
        avaliacao: 0
      });
    }
    setErrors({});
  }, [fornecedor, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('endereco.')) {
      const enderecoField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [enderecoField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      avaliacao: rating
    }));
  };

  const formatCNPJ = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatPhone = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length === 11) {
      return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleanValue.length === 10) {
      return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const formatCEP = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setFormData(prev => ({ ...prev, cnpj: formatted }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formatted }));
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    setFormData(prev => ({
      ...prev,
      endereco: { ...prev.endereco, cep: formatted }
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.razao_social.trim()) {
      newErrors.razao_social = 'Razão social é obrigatória';
    }

    if (!formData.cnpj.trim()) {
      newErrors.cnpj = 'CNPJ é obrigatório';
    }

    if (!formData.contato.trim()) {
      newErrors.contato = 'Nome do contato é obrigatório';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.categoria.trim()) {
      newErrors.categoria = 'Categoria é obrigatória';
    }

    if (!formData.endereco.cep.trim()) {
      newErrors['endereco.cep'] = 'CEP é obrigatório';
    }

    if (!formData.endereco.logradouro.trim()) {
      newErrors['endereco.logradouro'] = 'Logradouro é obrigatório';
    }

    if (!formData.endereco.cidade.trim()) {
      newErrors['endereco.cidade'] = 'Cidade é obrigatória';
    }

    if (!formData.endereco.estado) {
      newErrors['endereco.estado'] = 'Estado é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        ...formData,
        id: formData.id || Date.now(),
        created_at: formData.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
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
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            {fornecedor ? 'Editar Fornecedor' : 'Novo Fornecedor'}
          </h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <SectionTitle>Informações Básicas</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Nome Fantasia *</Label>
                <Input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Nome do fornecedor"
                />
                {errors.nome && <ErrorMessage>{errors.nome}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Razão Social *</Label>
                <Input
                  type="text"
                  name="razao_social"
                  value={formData.razao_social}
                  onChange={handleInputChange}
                  placeholder="Razão social da empresa"
                />
                {errors.razao_social && <ErrorMessage>{errors.razao_social}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>CNPJ *</Label>
                <Input
                  type="text"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleCNPJChange}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                />
                {errors.cnpj && <ErrorMessage>{errors.cnpj}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Status</Label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Pendente">Pendente</option>
                </Select>
                <StatusBadge status={formData.status}>
                  {formData.status}
                </StatusBadge>
              </FormGroup>
            </FormGrid>

            <SectionTitle>Categoria e Tipo</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Tipo de Fornecedor</Label>
                <Select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                >
                  {tiposFornecedor.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Categoria *</Label>
                <Select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione uma categoria</option>
                  {categoriasPorTipo[formData.tipo]?.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </Select>
                {errors.categoria && <ErrorMessage>{errors.categoria}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Avaliação</Label>
                <RatingContainer>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={`star ${star <= formData.avaliacao ? 'filled' : ''}`}
                        onClick={() => handleRatingChange(star)}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="rating-text">
                    {formData.avaliacao > 0 ? `${formData.avaliacao}/5` : 'Sem avaliação'}
                  </span>
                </RatingContainer>
              </FormGroup>
            </FormGrid>

            <SectionTitle>Contato</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Nome do Contato *</Label>
                <Input
                  type="text"
                  name="contato"
                  value={formData.contato}
                  onChange={handleInputChange}
                  placeholder="Nome da pessoa de contato"
                />
                {errors.contato && <ErrorMessage>{errors.contato}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Telefone *</Label>
                <Input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
                {errors.telefone && <ErrorMessage>{errors.telefone}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Email *</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@fornecedor.com"
                />
                {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
              </FormGroup>
            </FormGrid>

            <SectionTitle>Endereço</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>CEP *</Label>
                <Input
                  type="text"
                  name="endereco.cep"
                  value={formData.endereco.cep}
                  onChange={handleCEPChange}
                  placeholder="00000-000"
                  maxLength={9}
                />
                {errors['endereco.cep'] && <ErrorMessage>{errors['endereco.cep']}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Logradouro *</Label>
                <Input
                  type="text"
                  name="endereco.logradouro"
                  value={formData.endereco.logradouro}
                  onChange={handleInputChange}
                  placeholder="Rua, Avenida, etc."
                />
                {errors['endereco.logradouro'] && <ErrorMessage>{errors['endereco.logradouro']}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Número</Label>
                <Input
                  type="text"
                  name="endereco.numero"
                  value={formData.endereco.numero}
                  onChange={handleInputChange}
                  placeholder="Número"
                />
              </FormGroup>

              <FormGroup>
                <Label>Cidade *</Label>
                <Input
                  type="text"
                  name="endereco.cidade"
                  value={formData.endereco.cidade}
                  onChange={handleInputChange}
                  placeholder="Cidade"
                />
                {errors['endereco.cidade'] && <ErrorMessage>{errors['endereco.cidade']}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Estado *</Label>
                <Select
                  name="endereco.estado"
                  value={formData.endereco.estado}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione um estado</option>
                  {estados.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </Select>
                {errors['endereco.estado'] && <ErrorMessage>{errors['endereco.estado']}</ErrorMessage>}
              </FormGroup>
            </FormGrid>

            {formData.categoria && (
              <div style={{ marginTop: '16px' }}>
                <CategoryChip>{formData.categoria}</CategoryChip>
              </div>
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
              {fornecedor ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ModalFornecedor;