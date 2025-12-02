import React, { useState } from "react";
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
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div`
  background: white;
  width: 95%;
  max-width: 1000px;
  max-height: 90vh;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  padding: 28px 36px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
`;

const ModalBody = styled.div`
  padding: 28px 36px;
  max-height: calc(90vh - 160px);
  overflow-y: auto;
  background: white;
`;

const TwoColumnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 16px;
  align-items: end;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ThreeColumnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  margin-bottom: 16px;
  align-items: end;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FourColumnRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  gap: 20px;
  margin-bottom: 16px;
  align-items: end;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SingleFieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 70px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RequiredMark = styled.span`
  color: #ef4444;
  font-size: 1.1rem;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.hasError ? '#ef4444' : '#e5e7eb'};
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  height: 44px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:hover {
    border-color: #d1d5db;
  }

  &::placeholder {
    color: #9ca3af;
  }

  ${props => props.hasError && `
    background-color: #fef2f2;
  `}
`;

const Select = styled.select<{ hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.hasError ? '#ef4444' : '#e5e7eb'};
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  background: white;
  transition: all 0.2s ease;
  height: 44px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:hover {
    border-color: #d1d5db;
  }

  ${props => props.hasError && `
    background-color: #fef2f2;
  `}
`;

const SearchButton = styled.button`
  padding: 12px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 44px;
  min-width: 120px;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 4px;
`;

const ModalFooter = styled.div`
  padding: 20px 36px;
  background: white;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  min-width: 120px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  ${props => props.variant === 'primary' ? `
    background: #3b82f6;
    color: white;
    border: none;

    &:hover:not(:disabled) {
      background: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  ` : `
    background: white;
    color: #374151;
    border: 2px solid #e5e7eb;

    &:hover:not(:disabled) {
      background: #f9fafb;
      border-color: #d1d5db;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `}
`;

interface Fornecedor {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  tipoChave: string;
  chavePix: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface AddFornecedorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFornecedor: (newFornecedor: Omit<Fornecedor, 'id'>) => void;
}

const AddFornecedorForm: React.FC<AddFornecedorFormProps> = ({ isOpen, onClose, onAddFornecedor }) => {
  const [formData, setFormData] = useState<Omit<Fornecedor, 'id'>>({
    nome: '',
    email: '',
    telefone: '',
    cnpj: '',
    tipoChave: '',
    chavePix: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tiposChave = ['', 'CPF', 'CNPJ', 'Email', 'Telefone', 'Aleatória'];
  const estadosOptions = [
    '', 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simular chamada da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      onAddFornecedor(formData);
      onClose();
      
      // Reset form
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        cnpj: '',
        tipoChave: '',
        chavePix: '',
        cep: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
      });
    } catch (error) {
      console.error('Erro ao adicionar fornecedor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCepSearch = () => {
    if (formData.cep.length === 8) {
      // Simular busca de CEP
      console.log('Buscando CEP:', formData.cep);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Cadastro de Fornecedor</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit} id="fornecedor-form">
            {/* Linha 1: Nome e Email */}
            <TwoColumnRow>
              <FormField>
                <Label>
                  Nome <RequiredMark>*</RequiredMark>
                </Label>
                <Input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Digite o Nome"
                  hasError={!!errors.nome}
                />
                {errors.nome && <ErrorText>{errors.nome}</ErrorText>}
              </FormField>

              <FormField>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Digite o Email"
                  hasError={!!errors.email}
                />
                {errors.email && <ErrorText>{errors.email}</ErrorText>}
              </FormField>
            </TwoColumnRow>

            {/* Linha 2: Telefone, CNPJ e Tipo de Chave */}
            <ThreeColumnRow>
              <FormField>
                <Label>
                  Telefone <RequiredMark>*</RequiredMark>
                </Label>
                <Input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  placeholder="Telefone"
                  hasError={!!errors.telefone}
                />
                {errors.telefone && <ErrorText>{errors.telefone}</ErrorText>}
              </FormField>

              <FormField>
                <Label>CNPJ</Label>
                <Input
                  type="text"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleInputChange}
                  placeholder="CNPJ"
                />
              </FormField>

              <FormField>
                <Label>Tipo de Chave</Label>
                <Select
                  name="tipoChave"
                  value={formData.tipoChave}
                  onChange={handleInputChange}
                >
                  <option value="">Selecionar Chave</option>
                  {tiposChave.slice(1).map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </Select>
              </FormField>
            </ThreeColumnRow>

            {/* Linha 3: Chave Pix e CEP */}
            <TwoColumnRow>
              <FormField>
                <Label>Pix</Label>
                <Input
                  type="text"
                  name="chavePix"
                  value={formData.chavePix}
                  onChange={handleInputChange}
                  placeholder="Chave Pix"
                />
              </FormField>

              <FormField>
                <Label>CEP</Label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
                  <Input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    placeholder="CEP"
                    style={{ flex: 1 }}
                  />
                  <SearchButton type="button" onClick={handleCepSearch}>
                    🔍
                  </SearchButton>
                </div>
              </FormField>
            </TwoColumnRow>

            {/* Linha 4: Rua, Número e Complemento */}
            <ThreeColumnRow>
              <FormField>
                <Label>Rua</Label>
                <Input
                  type="text"
                  name="rua"
                  value={formData.rua}
                  onChange={handleInputChange}
                  placeholder="Ex. Rua Central"
                />
              </FormField>

              <FormField>
                <Label>Número</Label>
                <Input
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                  placeholder="1580"
                />
              </FormField>

              <FormField>
                <Label>Complemento</Label>
                <Input
                  type="text"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleInputChange}
                  placeholder="Bloco B AP 104"
                />
              </FormField>
            </ThreeColumnRow>

            {/* Linha 5: Bairro, Cidade e Estado */}
            <ThreeColumnRow>
              <FormField>
                <Label>Bairro</Label>
                <Input
                  type="text"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleInputChange}
                  placeholder="Bairro"
                />
              </FormField>

              <FormField>
                <Label>Cidade</Label>
                <Input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  placeholder="Cidade"
                />
              </FormField>

              <FormField>
                <Label>Estado</Label>
                <Select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                >
                  <option value="">Selecionar</option>
                  {estadosOptions.slice(1).map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </Select>
              </FormField>
            </ThreeColumnRow>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isSubmitting}
            form="fornecedor-form"
          >
            {isSubmitting ? (
              <>
                <span>⏳</span>
                Salvando...
              </>
            ) : (
              <>
                <span>✓</span>
                Salvar
              </>
            )}
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddFornecedorForm;