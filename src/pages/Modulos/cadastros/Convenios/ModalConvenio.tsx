import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { 
  FaTimes, 
  FaHandshake, 
  FaCode, 
  FaBuilding, 
  FaIdCard, 
  FaPhone, 
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
  FaPercentage
} from "react-icons/fa";

// Interfaces
interface ConvenioData {
  codigo: string;
  nome: string;
  tipo: string;
  cnpj: string;
  telefone: string;
  email: string;
  desconto_percentual: number;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  observacoes: string;
  ativo: boolean;
}

interface ModalConvenioProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ConvenioData) => void;
  convenio?: any;
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
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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

const FormRowThree = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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
    border-color: #28a745;
    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
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
    border-color: #28a745;
    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
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
    border-color: #28a745;
    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
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
  accent-color: #28a745;
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
    background-color: #28a745;
    color: white;
    &:hover { background-color: #218838; }
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

const ModalConvenio: React.FC<ModalConvenioProps> = ({
  isOpen,
  onClose,
  onSave,
  convenio
}) => {
  const [formData, setFormData] = useState<ConvenioData>({
    codigo: '',
    nome: '',
    tipo: '',
    cnpj: '',
    telefone: '',
    email: '',
    desconto_percentual: 0,
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: '',
    observacoes: '',
    ativo: true
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (convenio) {
      setFormData({
        codigo: convenio.codigo || '',
        nome: convenio.nome || '',
        tipo: convenio.tipo || '',
        cnpj: convenio.cnpj || '',
        telefone: convenio.telefone || '',
        email: convenio.email || '',
        desconto_percentual: convenio.desconto_percentual || 0,
        endereco: convenio.endereco || '',
        numero: convenio.numero || '',
        complemento: convenio.complemento || '',
        bairro: convenio.bairro || '',
        cidade: convenio.cidade || '',
        uf: convenio.uf || '',
        cep: convenio.cep || '',
        observacoes: convenio.observacoes || '',
        ativo: convenio.ativo !== undefined ? convenio.ativo : true
      });
    } else {
      setFormData({
        codigo: '',
        nome: '',
        tipo: '',
        cnpj: '',
        telefone: '',
        email: '',
        desconto_percentual: 0,
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
        cep: '',
        observacoes: '',
        ativo: true
      });
    }
    setErrors({});
  }, [convenio, isOpen]);

  const tiposConvenio = [
    'Plano de Saúde',
    'Seguro Odontológico',
    'Convênio Empresarial',
    'Cooperativa',
    'Particular'
  ];

  const estadosBrasil = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'desconto_percentual') {
      const numValue = parseFloat(value) || 0;
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

    if (!formData.tipo.trim()) {
      newErrors.tipo = 'Tipo é obrigatório';
    }

    if (formData.cnpj && formData.cnpj.length < 14) {
      newErrors.cnpj = 'CNPJ deve ter 14 dígitos';
    }

    if (formData.desconto_percentual < 0 || formData.desconto_percentual > 100) {
      newErrors.desconto_percentual = 'Desconto deve estar entre 0 e 100%';
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
            <FaHandshake />
            {convenio ? 'Editar Convênio' : 'Novo Convênio'}
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
                <FaBuilding />
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
                    placeholder="Ex: CONV001"
                    required
                  />
                  {errors.codigo && <ErrorMessage>{errors.codigo}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="tipo">Tipo*</Label>
                  <Select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione o tipo</option>
                    {tiposConvenio.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </Select>
                  {errors.tipo && <ErrorMessage>{errors.tipo}</ErrorMessage>}
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label htmlFor="nome">Nome do Convênio*</Label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Nome completo do convênio"
                  required
                />
                {errors.nome && <ErrorMessage>{errors.nome}</ErrorMessage>}
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    name="cnpj"
                    type="text"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                  />
                  {errors.cnpj && <ErrorMessage>{errors.cnpj}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="desconto_percentual">Desconto (%)</Label>
                  <Input
                    id="desconto_percentual"
                    name="desconto_percentual"
                    type="number"
                    value={formData.desconto_percentual}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  {errors.desconto_percentual && <ErrorMessage>{errors.desconto_percentual}</ErrorMessage>}
                </FormGroup>
              </FormRow>
            </Section>

            {/* Contato */}
            <Section>
              <SectionTitle>
                <FaPhone />
                Informações de Contato
              </SectionTitle>
              
              <FormRow>
                <FormGroup>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    placeholder="(00) 0000-0000"
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contato@convenio.com"
                  />
                </FormGroup>
              </FormRow>
            </Section>

            {/* Endereço */}
            <Section>
              <SectionTitle>
                <FaMapMarkerAlt />
                Endereço
              </SectionTitle>
              
              <FormGroup>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  name="endereco"
                  type="text"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  placeholder="Rua, Avenida, etc."
                />
              </FormGroup>

              <FormRowThree>
                <FormGroup>
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    name="numero"
                    type="text"
                    value={formData.numero}
                    onChange={handleInputChange}
                    placeholder="123"
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    name="complemento"
                    type="text"
                    value={formData.complemento}
                    onChange={handleInputChange}
                    placeholder="Sala, Andar, etc."
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    name="bairro"
                    type="text"
                    value={formData.bairro}
                    onChange={handleInputChange}
                    placeholder="Nome do bairro"
                  />
                </FormGroup>
              </FormRowThree>

              <FormRowThree>
                <FormGroup>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    name="cidade"
                    type="text"
                    value={formData.cidade}
                    onChange={handleInputChange}
                    placeholder="Nome da cidade"
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="uf">UF</Label>
                  <Select
                    id="uf"
                    name="uf"
                    value={formData.uf}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione</option>
                    {estadosBrasil.map(estado => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    name="cep"
                    type="text"
                    value={formData.cep}
                    onChange={handleInputChange}
                    placeholder="00000-000"
                    maxLength={9}
                  />
                </FormGroup>
              </FormRowThree>
            </Section>

            {/* Observações */}
            <Section>
              <SectionTitle>
                <FaUser />
                Observações
              </SectionTitle>
              
              <FormGroup>
                <TextArea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  placeholder="Observações sobre o convênio (opcional)"
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
                <Label htmlFor="ativo">Convênio ativo</Label>
              </CheckboxGroup>
            </Section>
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" variant="primary" onClick={handleSave}>
            {convenio ? 'Atualizar' : 'Salvar'} Convênio
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ModalConvenio;