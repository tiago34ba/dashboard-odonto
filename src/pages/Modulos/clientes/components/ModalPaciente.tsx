import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Paciente } from "../../../../services/api";
import { useReferenceData } from "../../../../hooks/useApi";

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
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
  border-radius: 24px;
  padding: 0;
  width: 95%;
  max-width: 1000px;
  max-height: 95vh;
  min-height: 600px;
  height: auto;
  overflow: hidden;
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 768px) {
    width: 98%;
    max-height: 98vh;
    min-height: 500px;
    border-radius: 20px;
  }

  @media (max-height: 700px) {
    min-height: 90vh;
    max-height: 95vh;
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
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 28px 36px;
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
    background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%);
  }

  h2 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 16px;
    z-index: 1;
    position: relative;
  }

  @media (max-width: 768px) {
    padding: 20px 24px;
    
    h2 {
      font-size: 1.5rem;
    }
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
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
  padding: 40px 36px 80px 36px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  min-height: 0;
  max-height: calc(100vh - 200px);

  @media (max-width: 768px) {
    padding: 28px 24px 60px 24px;
    max-height: calc(100vh - 180px);
  }

  @media (max-height: 600px) {
    padding: 24px 36px 50px 36px;
    max-height: calc(100vh - 160px);
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f3f4;
    border-radius: 4px;
    margin: 8px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #4facfe, #00f2fe);
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #00f2fe, #4facfe);
    box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3);
  }
`;

const SectionTitle = styled.h3`
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 3px solid #e5e7eb;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #4facfe, #00f2fe);
    border-radius: 2px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 28px;
  margin-bottom: 36px;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
    margin-bottom: 28px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
  margin-bottom: 6px;
  transition: color 0.2s ease;
`;

const Input = styled.input`
  padding: 14px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fafbfc;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #4facfe;
    background: white;
    box-shadow: 
      0 0 0 4px rgba(79, 172, 254, 0.1),
      0 4px 12px rgba(79, 172, 254, 0.15);
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
  background: #fafbfc;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #4facfe;
    background: white;
    box-shadow: 
      0 0 0 4px rgba(79, 172, 254, 0.1),
      0 4px 12px rgba(79, 172, 254, 0.15);
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
  background: #fafbfc;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #4facfe;
    background: white;
    box-shadow: 
      0 0 0 4px rgba(79, 172, 254, 0.1),
      0 4px 12px rgba(79, 172, 254, 0.15);
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
  padding: 32px 36px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  border-top: 1px solid rgba(229, 231, 235, 0.8);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  position: sticky;
  bottom: 0;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 24px;
    gap: 12px;
    flex-direction: column-reverse;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 140px;
  justify-content: center;
  font-family: inherit;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(79, 172, 254, 0.4);
    }
    
    &:active {
      transform: translateY(-1px);
    }
  ` : `
    background: white;
    color: #6b7280;
    border: 2px solid #e5e7eb;
    
    &:hover {
      background: #f9fafb;
      border-color: #d1d5db;
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 4px;
  font-weight: 500;
`;

const InfoCard = styled.div`
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;

  .card-title {
    font-weight: 600;
    color: #0369a1;
    margin-bottom: 8px;
    font-size: 0.95rem;
  }

  .card-description {
    color: #0284c7;
    font-size: 0.875rem;
    line-height: 1.5;
  }
`;

// Interfaces
interface ExtendedPaciente {
  id?: number;
  name: string;
  email: string;
  telefone: string;
  celular?: string;
  idade: number;
  data_nascimento: string;
  cpf_cnpj: string;
  sexo?: string;
  estado_civil?: string;
  profissao?: string;
  tipo_sanguineo?: string;
  responsavel?: string;
  cpf_responsavel?: string;
  estado: string;
  pessoa: string;
  cep?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  convenio?: string;
  observacoes?: string;
  // Campos adicionais para o modal
  endereco?: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  };
  numero_carteira?: string;
  observacoes_medicas?: string;
  alergias?: string;
  medicamentos_uso?: string;
  historico_familiar?: string;
}

interface ModalPacienteProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paciente: ExtendedPaciente) => void;
  paciente?: Paciente | null;
}

const ModalPaciente: React.FC<ModalPacienteProps> = ({
  isOpen,
  onClose,
  onSave,
  paciente
}) => {
  const [formData, setFormData] = useState<ExtendedPaciente>({
    name: '',
    email: '',
    telefone: '',
    celular: '',
    idade: 0,
    data_nascimento: '',
    cpf_cnpj: '',
    sexo: '',
    estado_civil: '',
    profissao: '',
    tipo_sanguineo: '',
    responsavel: '',
    cpf_responsavel: '',
    estado: '',
    pessoa: '',
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    },
    convenio: '',
    numero_carteira: '',
    observacoes_medicas: '',
    alergias: '',
    medicamentos_uso: '',
    historico_familiar: '',
    observacoes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Hook para buscar dados de referência
  const { 
    convenios, 
    loading: loadingRefs,
    fetchConvenios 
  } = useReferenceData();

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const tiposSanguineos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const estadosCivis = ['Solteiro', 'Casado', 'Divorciado', 'Viúvo', 'União Estável'];
  
  // Lista completa de convênios mais comuns no Brasil
  const conveniosComuns = [
    'Particular',
    'Amil',
    'Bradesco Saúde',
    'SulAmérica',
    'Unimed',
    'Unimed Nacional',
    'Unimed Rio',
    'Unimed São Paulo',
    'Porto Seguro',
    'Golden Cross',
    'Prevent Senior',
    'Hapvida',
    'São Cristóvão Saúde',
    'Intermédica',
    'Assim Saúde',
    'Central Nacional Unimed',
    'Omint',
    'Caixa Seguros',
    'Ameplan',
    'Petrobras Distribuidora',
    'Notre Dame Intermédica',
    'Cruz Azul',
    'Cassi',
    'GEAP',
    'Postal Saúde',
    'Fusex',
    'IAMSPE',
    'BENEFICÊNCIA PORTUGUESA',
    'Hospital Alemão Oswaldo Cruz',
    'Alice',
    'Dr. Consulta',
    'Outros'
  ];

  useEffect(() => {
    if (paciente) {
      setFormData({
        ...paciente,
        endereco: {
          cep: paciente.cep || '',
          logradouro: paciente.rua || '',
          numero: paciente.numero || '',
          complemento: paciente.complemento || '',
          bairro: paciente.bairro || '',
          cidade: '',
          estado: paciente.estado || ''
        },
        numero_carteira: '',
        observacoes_medicas: '',
        alergias: '',
        medicamentos_uso: '',
        historico_familiar: ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        telefone: '',
        celular: '',
        idade: 0,
        data_nascimento: '',
        cpf_cnpj: '',
        sexo: '',
        estado_civil: '',
        profissao: '',
        tipo_sanguineo: '',
        responsavel: '',
        cpf_responsavel: '',
        estado: '',
        pessoa: '',
        endereco: {
          cep: '',
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: ''
        },
        convenio: '',
        numero_carteira: '',
        observacoes_medicas: '',
        alergias: '',
        medicamentos_uso: '',
        historico_familiar: '',
        observacoes: ''
      });
    }
    setErrors({});
  }, [paciente, isOpen]);

  // Carrega convênios quando o modal abre
  useEffect(() => {
    if (isOpen && fetchConvenios) {
      fetchConvenios();
    }
  }, [isOpen, fetchConvenios]);

  // Log para debug dos convênios
  useEffect(() => {
    if (convenios && convenios.length > 0) {
      console.log('Convênios carregados da API:', convenios);
    }
  }, [convenios]);

  // Lista final de convênios (API + local)
  const listaConvenios = React.useMemo(() => {
    const todosConvenios = Array.from(new Set([...(convenios || []), ...conveniosComuns]))
      .filter(convenio => convenio && convenio.trim() !== '')
      .sort();
    
    console.log('Lista final de convênios:', todosConvenios);
    return todosConvenios;
  }, [convenios, conveniosComuns]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('endereco.')) {
      const enderecoField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        endereco: {
          ...(prev.endereco || {}),
          [enderecoField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'idade' ? parseInt(value) || 0 : value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefone) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.data_nascimento) {
      newErrors.data_nascimento = 'Data de nascimento é obrigatória';
    }

    if (!formData.cpf_cnpj) {
      newErrors.cpf_cnpj = 'CPF é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Mapeia os campos para o formato esperado pelo backend
        const mappedData = {
          name: formData.name,
          phone: formData.telefone,
          insurance: formData.convenio,
          age: formData.idade,
          nascimento: formData.data_nascimento,
          responsavel: formData.responsavel,
          cpfResponsavel: formData.cpf_responsavel,
          pessoa: formData.pessoa,
          cpfCnpj: formData.cpf_cnpj,
          email: formData.email,
          cep: formData.endereco?.cep,
          rua: formData.endereco?.logradouro,
          numero: formData.endereco?.numero,
          complemento: formData.endereco?.complemento,
          bairro: formData.endereco?.bairro,
          cidade: formData.endereco?.cidade,
          estado: formData.estado,
          tipoSanguineo: formData.tipo_sanguineo,
          sexo: formData.sexo,
          profissao: formData.profissao,
          estadoCivil: formData.estado_civil,
          telefone2: formData.celular,
          observacoes: formData.observacoes,
        };
        const api = require('../../../../services/api').default;
        await api.createPaciente(mappedData);
        onSave(formData);
        onClose();
      } catch (error) {
        alert('Erro ao cadastrar paciente!');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            {paciente ? 'Editar Paciente' : 'Novo Paciente'}
          </h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <InfoCard>
              <div className="card-title">💡 Informação</div>
              <div className="card-description">
                Preencha todos os campos obrigatórios marcados com (*) para cadastrar um novo paciente no sistema.
              </div>
            </InfoCard>

            <SectionTitle>Dados Pessoais</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Nome Completo *</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nome completo do paciente"
                />
                {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Email *</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@exemplo.com"
                />
                {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>CPF *</Label>
                <Input
                  type="text"
                  name="cpf_cnpj"
                  value={formData.cpf_cnpj}
                  onChange={handleInputChange}
                  placeholder="000.000.000-00"
                />
                {errors.cpf_cnpj && <ErrorMessage>{errors.cpf_cnpj}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Data de Nascimento *</Label>
                <Input
                  type="date"
                  name="data_nascimento"
                  value={formData.data_nascimento}
                  onChange={handleInputChange}
                />
                {errors.data_nascimento && <ErrorMessage>{errors.data_nascimento}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Idade</Label>
                <Input
                  type="number"
                  name="idade"
                  value={formData.idade}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </FormGroup>

              <FormGroup>
                <Label>Sexo</Label>
                <Select
                  name="sexo"
                  value={formData.sexo || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Estado Civil</Label>
                <Select
                  name="estado_civil"
                  value={formData.estado_civil || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione</option>
                  {estadosCivis.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Profissão</Label>
                <Input
                  type="text"
                  name="profissao"
                  value={formData.profissao || ''}
                  onChange={handleInputChange}
                  placeholder="Profissão do paciente"
                />
              </FormGroup>

              <FormGroup>
                <Label>Tipo Sanguíneo</Label>
                <Select
                  name="tipo_sanguineo"
                  value={formData.tipo_sanguineo || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione</option>
                  {tiposSanguineos.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </Select>
              </FormGroup>
            </FormGrid>

            <SectionTitle>Contato</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Telefone *</Label>
                <Input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  placeholder="(11) 3333-3333"
                />
                {errors.telefone && <ErrorMessage>{errors.telefone}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Celular</Label>
                <Input
                  type="text"
                  name="celular"
                  value={formData.celular || ''}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                />
              </FormGroup>
            </FormGrid>

            <SectionTitle>Endereço</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>CEP</Label>
                <Input
                  type="text"
                  name="endereco.cep"
                  value={formData.endereco?.cep || ''}
                  onChange={handleInputChange}
                  placeholder="00000-000"
                />
              </FormGroup>

              <FormGroup>
                <Label>Logradouro</Label>
                <Input
                  type="text"
                  name="endereco.logradouro"
                  value={formData.endereco?.logradouro || ''}
                  onChange={handleInputChange}
                  placeholder="Rua, Avenida, etc."
                />
              </FormGroup>

              <FormGroup>
                <Label>Número</Label>
                <Input
                  type="text"
                  name="endereco.numero"
                  value={formData.endereco?.numero || ''}
                  onChange={handleInputChange}
                  placeholder="123"
                />
              </FormGroup>

              <FormGroup>
                <Label>Complemento</Label>
                <Input
                  type="text"
                  name="endereco.complemento"
                  value={formData.endereco?.complemento || ''}
                  onChange={handleInputChange}
                  placeholder="Apto, Bloco, etc."
                />
              </FormGroup>

              <FormGroup>
                <Label>Bairro</Label>
                <Input
                  type="text"
                  name="endereco.bairro"
                  value={formData.endereco?.bairro || ''}
                  onChange={handleInputChange}
                  placeholder="Nome do bairro"
                />
              </FormGroup>

              <FormGroup>
                <Label>Cidade</Label>
                <Input
                  type="text"
                  name="endereco.cidade"
                  value={formData.endereco?.cidade || ''}
                  onChange={handleInputChange}
                  placeholder="Nome da cidade"
                />
              </FormGroup>

              <FormGroup>
                <Label>Estado</Label>
                <Select
                  name="endereco.estado"
                  value={formData.endereco?.estado || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione</option>
                  {estados.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </Select>
              </FormGroup>
            </FormGrid>

            <SectionTitle>Responsável (Menor de Idade)</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Nome do Responsável</Label>
                <Input
                  type="text"
                  name="responsavel"
                  value={formData.responsavel || ''}
                  onChange={handleInputChange}
                  placeholder="Nome completo do responsável"
                />
              </FormGroup>

              <FormGroup>
                <Label>CPF do Responsável</Label>
                <Input
                  type="text"
                  name="cpf_responsavel"
                  value={formData.cpf_responsavel || ''}
                  onChange={handleInputChange}
                  placeholder="000.000.000-00"
                />
              </FormGroup>
            </FormGrid>

            <SectionTitle>Convênio</SectionTitle>
            
            {/* Info Card sobre convênios */}
            <div style={{ 
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              border: '1px solid #bae6fd',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ 
                fontWeight: '600',
                color: '#0369a1',
                marginBottom: '8px',
                fontSize: '0.9rem'
              }}>
                💡 Informação sobre Convênios
              </div>
              <div style={{ 
                color: '#0284c7',
                fontSize: '0.85rem',
                lineHeight: '1.4'
              }}>
                Lista com {listaConvenios.length} convênios disponíveis. 
                {convenios && convenios.length > 0 
                  ? ` Incluindo ${convenios.length} convênios da API e ${conveniosComuns.length} convênios padrão.`
                  : ` Usando lista padrão de ${conveniosComuns.length} convênios mais comuns no Brasil.`
                }
              </div>
            </div>
            
            <FormGrid>
              <FormGroup>
                <Label>Convênio</Label>
                <Select
                  name="convenio"
                  value={formData.convenio || ''}
                  onChange={handleInputChange}
                  disabled={loadingRefs}
                >
                  <option value="">
                    {loadingRefs ? 'Carregando convênios...' : 'Selecione o convênio'}
                  </option>
                  {/* Lista final de convênios (API + local, sem duplicatas) */}
                  {listaConvenios.map((convenio, index) => (
                    <option key={`convenio-${index}`} value={convenio}>
                      {convenio}
                    </option>
                  ))}
                </Select>
                {loadingRefs && (
                  <span style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
                    Carregando dados da API...
                  </span>
                )}
                {!loadingRefs && listaConvenios.length > 0 && (
                  <span style={{ fontSize: '0.875rem', color: '#10b981', marginTop: '4px' }}>
                    {listaConvenios.length} convênios disponíveis
                  </span>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Número da Carteira</Label>
                <Input
                  type="text"
                  name="numero_carteira"
                  value={formData.numero_carteira || ''}
                  onChange={handleInputChange}
                  placeholder="Número da carteira do convênio"
                />
              </FormGroup>
            </FormGrid>

            <SectionTitle>Informações Médicas</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Observações Médicas</Label>
                <TextArea
                  name="observacoes_medicas"
                  value={formData.observacoes_medicas || ''}
                  onChange={handleInputChange}
                  placeholder="Informações médicas relevantes..."
                />
              </FormGroup>

              <FormGroup>
                <Label>Alergias</Label>
                <TextArea
                  name="alergias"
                  value={formData.alergias || ''}
                  onChange={handleInputChange}
                  placeholder="Liste as alergias conhecidas..."
                />
              </FormGroup>

              <FormGroup>
                <Label>Medicamentos em Uso</Label>
                <TextArea
                  name="medicamentos_uso"
                  value={formData.medicamentos_uso || ''}
                  onChange={handleInputChange}
                  placeholder="Liste os medicamentos em uso..."
                />
              </FormGroup>

              <FormGroup>
                <Label>Histórico Familiar</Label>
                <TextArea
                  name="historico_familiar"
                  value={formData.historico_familiar || ''}
                  onChange={handleInputChange}
                  placeholder="Histórico médico familiar relevante..."
                />
              </FormGroup>
            </FormGrid>

            <FormGroup>
              <Label>Observações Gerais</Label>
              <TextArea
                name="observacoes"
                value={formData.observacoes || ''}
                onChange={handleInputChange}
                placeholder="Observações adicionais sobre o paciente..."
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              {paciente ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ModalPaciente;