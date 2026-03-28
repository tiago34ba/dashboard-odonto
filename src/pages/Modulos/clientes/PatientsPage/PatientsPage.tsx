import React, { useEffect, useState } from "react";
import api from "../../../../components/api/api";
import Modal from "./Modal";
import AddPatientForm from "../PatientTable/AddPatientForm";
import styled from "styled-components";
import * as XLSX from "xlsx";

// Estilos modernizados
const PageWrapper = styled.div`
  display: flex;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 20px;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 40px);
  max-height: calc(100vh - 40px);
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const StyledButton = styled.button<{ color?: string; hoverColor?: string }>`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: ${(props) => props.color || "#007bff"};
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.hoverColor || "#0056b3"};
  }
`;

const Table = styled.table`
  width: 100%;
  min-width: 860px;
  border-collapse: collapse;
  margin: 0;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    vertical-align: middle;
    font-size: 14px;
  }

  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #495057;
    position: sticky;
    top: 0;
    z-index: 10;
    border-bottom: 2px solid #dee2e6;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;
  }
  
  /* Largura específica para a coluna de ações */
  th:last-child,
  td:last-child {
    width: 220px;
    min-width: 220px;
  }
`;

const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
  min-height: 360px;
  max-height: calc(100vh - 280px);
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #ffffff;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
`;

const ActionButton = styled(StyledButton)`
  padding: 5px 9px;
  font-size: 11px;
  font-weight: 500;
  min-width: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  width: 80%; /* Ajuste de largura */
  max-width: 600px; /* Largura máxima */
  max-height: 80vh; /* Altura máxima */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto; /* Adiciona barra de rolagem vertical */
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  gap: 20px;
  border-top: 2px solid #e0e0e0;
  background-color: #f8f9fa;
  width: 100%;
  flex-shrink: 0;
  margin-top: auto;
`;

const PaginationInfo = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #495057;
  margin: 0 25px;
  min-width: 120px;
  text-align: center;
`;

const PaginationButton = styled(StyledButton)`
  min-width: 100px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    
    &:hover {
      background-color: ${(props) => props.color || "#007bff"};
    }
  }
`;

const SuccessMessage = styled.div`
  background: #d1fae5;
  border: 1px solid #10b981;
  color: #065f46;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-weight: 600;
`;

const LastRegisteredCard = styled.div`
  background: #eff6ff;
  border: 1px solid #93c5fd;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;

  h4 {
    margin: 0 0 8px;
    color: #1e40af;
    font-size: 15px;
  }

  p {
    margin: 4px 0;
    color: #1f2937;
    font-size: 14px;
  }
`;

// Define the type for the custom prop
interface ButtonProps {
  primary?: boolean; // Optional boolean prop
}

// Use the type in the styled component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Button = styled.button<ButtonProps>`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  background-color: ${(props) => (props.primary ? "#007bff" : "#f8f9fa")};
  color: ${(props) => (props.primary ? "white" : "#333")};
`;

interface Patient {
  id: number;
  name: string;
  convenio: string;
  telefone: string;
  idade: number;
  data_nascimento: string;
  responsavel: string | null;
  cpf_responsavel: string | null;
  celular: string | null;
  estado: string;
  sexo: string;
  profissao: string | null;
  estado_civil: string;
  tipo_sanguineo: string;
  pessoa: string;
  cpf_cnpj: string;
  email: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

interface EditPatientFormProps {
  patient: Patient;
  onClose: () => void;
  onUpdate: (updatedPatient: Patient) => Promise<boolean>;
}

interface NewPatientFromForm {
  id: number;
  nome: string;
  telefone: string;
  nascimento: string;
  pessoa: string;
  cpfCnpj: string;
  email: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  tipoSanguineo: string;
  sexo: string;
  profissao: string;
  estadoCivil: string;
  convenio: string;
  responsavel: string;
  cpfResponsavel: string;
  telefone2: string;
  observacoes: string;
}

interface AddPatientResult {
  success: boolean;
  errorMessage?: string;
}

const formatBirthDate = (value: string | null | undefined): string => {
  if (!value) {
    return "";
  }

  const trimmed = String(value).trim();

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${day}/${month}/${year}`;
  }

  const brMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (brMatch) {
    return trimmed;
  }

  return trimmed;
};

const EditPatientForm: React.FC<EditPatientFormProps> = ({ patient, onClose, onUpdate }) => {
  const [editedPatient, setEditedPatient] = useState(patient);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedPatient({ ...editedPatient, [name]: value });
    // Limpar erros quando o usuário começar a digitar
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    
    // Validação básica
    const newErrors: string[] = [];
    if (!editedPatient.name || editedPatient.name.trim().length < 2) {
      newErrors.push('Nome deve ter pelo menos 2 caracteres');
    }
    if (!editedPatient.telefone || editedPatient.telefone.trim().length < 10) {
      newErrors.push('Telefone deve ter pelo menos 10 dígitos');
    }
    if (!editedPatient.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedPatient.email)) {
      newErrors.push('Email inválido');
    }
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const updated = await onUpdate(editedPatient);
    if (updated) {
      onClose();
    }
  };

  const conveniosOptions = [
    "Nenhum",
    "Amil",
    "ASSIM Saúde",
    "Athena Saúde",
    "Bradesco Saúde",
    "Care Plus",
    "FSFX",
    "Hapvida",
    "MedSênior",
    "OdontoPrev",
    "Omint",
    "Particular",
    "Porto Seguro Saúde",
    "Prevent Senior",
    "São Cristovão",
    "Sul América Saúde",
    "Trasmontano",
    "Unimed Belo Horizonte",
    "Unimed Campinas",
    "Unimed Campo Grande",
    "Unimed Cuiabá",
    "Unimed Curitiba",
    "Unimed de Belém",
    "Unimed de Blumenau",
    "Unimed de Ribeirão Preto",
    "Unimed de Santos",
    "Unimed do Estado de Santa Catarina",
    "Unimed FESP",
    "Unimed Fortaleza",
    "Unimed Goiânia",
    "Unimed Grande Florianópolis",
    "Unimed João Pessoa",
    "Unimed Leste Fluminense",
    "Unimed Londrina",
    "Unimed Maceió",
    "Unimed Natal",
    "Unimed Nacional",
    "Unimed Nordeste RS",
    "Unimed Paraná",
    "Unimed Piracicaba",
    "Unimed Porto Alegre",
    "Unimed Recife",
    "Unimed Regional Maringá",
    "Unimed Saúde",
    "Unimed São José dos Campos",
    "Unimed São José do Rio Preto",
    "Unimed Sergipe",
    "Unimed Sorocaba",
    "Unimed Teresina",
    "Unimed Uberlândia",
    "Unimed Vitória",
    "Vision Med",
  ];
  const estadosOptions = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];
  const estadosCivisOptions = ["Solteiro(a)", "Casado(a)", "Divorciado(a)"];
  const tiposSanguineosOptions = ["Selecionar", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  return (
    <div className="edit-patient-form">
      <h2>Editar Paciente</h2>
      
      {/* Exibição de erros */}
      {errors.length > 0 && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          <strong>Erros encontrados:</strong>
          <ul style={{ margin: '5px 0 0 20px' }}>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="name">Nome:</label>
            <input type="text" id="name" name="name" value={editedPatient.name} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="telefone">Telefone:</label>
            <input type="text" id="telefone" name="telefone" value={editedPatient.telefone} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="convenio">Convênio:</label>
            <select id="convenio" name="convenio" value={editedPatient.convenio} onChange={handleChange}>
              {conveniosOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="idade">Idade:</label>
            <input type="text" id="idade" name="idade" value={editedPatient.idade} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="data_nascimento">Data de Nascimento:</label>
            <input type="date" id="data_nascimento" name="data_nascimento" value={editedPatient.data_nascimento} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="responsavel">Responsável:</label>
            <input type="text" id="responsavel" name="responsavel" value={editedPatient.responsavel || ''} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="cpf_responsavel">CPF do Responsável:</label>
            <input type="text" id="cpf_responsavel" name="cpf_responsavel" value={editedPatient.cpf_responsavel || ''} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="pessoa">Pessoa:</label>
            <select id="pessoa" name="pessoa" value={editedPatient.pessoa} onChange={handleChange}>
              <option value="Física">Física</option>
              <option value="Jurídica">Jurídica</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="cpf_cnpj">CPF / CNPJ:</label>
            <input type="text" id="cpf_cnpj" name="cpf_cnpj" value={editedPatient.cpf_cnpj} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={editedPatient.email} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="cep">CEP:</label>
            <input type="text" id="cep" name="cep" value={editedPatient.cep} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="rua">Rua:</label>
            <input type="text" id="rua" name="rua" value={editedPatient.rua} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="numero">Número:</label>
            <input type="text" id="numero" name="numero" value={editedPatient.numero} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="complemento">Complemento:</label>
            <input type="text" id="complemento" name="complemento" value={editedPatient.complemento || ''} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="bairro">Bairro:</label>
            <input type="text" id="bairro" name="bairro" value={editedPatient.bairro} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="cidade">Cidade:</label>
            <input type="text" id="cidade" name="cidade" value={editedPatient.cidade || ''} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="estado">Estado:</label>
            <select id="estado" name="estado" value={editedPatient.estado} onChange={handleChange}>
              <option value="Selecionar">Selecionar</option>
              {estadosOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="tipo_sanguineo">Tipo Sanguíneo:</label>
            <select id="tipo_sanguineo" name="tipo_sanguineo" value={editedPatient.tipo_sanguineo} onChange={handleChange}>
              <option value="">Selecionar</option>
              {tiposSanguineosOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="sexo">Sexo:</label>
            <select id="sexo" name="sexo" value={editedPatient.sexo} onChange={handleChange}>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="profissao">Profissão:</label>
            <input type="text" id="profissao" name="profissao" value={editedPatient.profissao || ''} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="estado_civil">Estado Civil:</label>
            <select id="estado_civil" name="estado_civil" value={editedPatient.estado_civil} onChange={handleChange}>
              {estadosCivisOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="celular">Celular:</label>
            <input type="text" id="celular" name="celular" value={editedPatient.celular || ''} onChange={handleChange} />
          </div>
        </div>
        <div className="button-container">
          <button type="submit">Salvar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

const ViewPatientModal: React.FC<{ patient: Patient; onClose: () => void }> = ({ patient, onClose }) => {
  return (
    <div className="view-patient-modal">
      <h2>Dados do Paciente</h2>
      <div className="patient-data-grid">
        <div><strong>Nome:</strong> {patient.name}</div>
        <div><strong>Telefone:</strong> {patient.telefone}</div>
        <div><strong>Convênio:</strong> {patient.convenio}</div>
        <div><strong>Idade:</strong> {patient.idade}</div>
        <div><strong>Data de Nascimento:</strong> {formatBirthDate(patient.data_nascimento)}</div>
        <div><strong>Responsável:</strong> {patient.responsavel}</div>
        <div><strong>CPF do Responsável:</strong> {patient.cpf_responsavel || ''}</div>
        <div><strong>Email:</strong> {patient.email}</div>
        <div><strong>Endereço:</strong> {patient.rua}, {patient.numero}, {patient.bairro} - {patient.estado}</div>
        <div><strong>Tipo Sanguíneo:</strong> {patient.tipo_sanguineo}</div>
        <div><strong>Sexo:</strong> {patient.sexo}</div>
        <div><strong>Profissão:</strong> {patient.profissao}</div>
        <div><strong>Estado Civil:</strong> {patient.estado_civil}</div>
        <div><strong>Observações:</strong> {patient.observacoes}</div>
      </div>
      <button onClick={onClose} className="close-button">Fechar</button>
    </div>
  );
};

// Dados fake para teste do layout
const fakePatients: Patient[] = [
  {
    id: 1,
    name: "Maria Silva Santos",
    convenio: "Unimed",
    telefone: "(11) 99876-5432",
    idade: 35,
    data_nascimento: "1988-05-15",
    responsavel: null,
    cpf_responsavel: null,
    celular: "(11) 98765-4321",
    estado: "SP",
    sexo: "Feminino",
    profissao: "Enfermeira",
    estado_civil: "Casado(a)",
    tipo_sanguineo: "A+",
    pessoa: "Física",
    cpf_cnpj: "123.456.789-01",
    email: "maria.silva@email.com",
    cep: "01234-567",
    rua: "Rua das Flores",
    numero: "123",
    complemento: "Apt 45",
    bairro: "Centro",
    cidade: "São Paulo",
    observacoes: "Paciente hipertensa, necessita acompanhamento regular",
    created_at: "2025-01-15T10:30:00Z",
    updated_at: "2025-10-15T14:20:00Z"
  },
  {
    id: 2,
    name: "João Carlos Oliveira",
    convenio: "Bradesco Saúde",
    telefone: "(21) 98765-4321",
    idade: 42,
    data_nascimento: "1981-11-22",
    responsavel: null,
    cpf_responsavel: null,
    celular: "(21) 97654-3210",
    estado: "RJ",
    sexo: "Masculino",
    profissao: "Engenheiro Civil",
    estado_civil: "Solteiro(a)",
    tipo_sanguineo: "O-",
    pessoa: "Física",
    cpf_cnpj: "987.654.321-09",
    email: "joao.oliveira@email.com",
    cep: "20000-123",
    rua: "Avenida Atlântica",
    numero: "456",
    complemento: null,
    bairro: "Copacabana",
    cidade: "Rio de Janeiro",
    observacoes: null,
    created_at: "2025-02-20T09:15:00Z",
    updated_at: "2025-10-10T11:45:00Z"
  },
  {
    id: 3,
    name: "Ana Paula Ferreira",
    convenio: "SulAmérica",
    telefone: "(31) 97777-8888",
    idade: 28,
    data_nascimento: "1995-03-08",
    responsavel: null,
    cpf_responsavel: null,
    celular: "(31) 96666-7777",
    estado: "MG",
    sexo: "Feminino",
    profissao: "Professora",
    estado_civil: "Solteiro(a)",
    tipo_sanguineo: "B+",
    pessoa: "Física",
    cpf_cnpj: "456.789.123-45",
    email: "ana.ferreira@email.com",
    cep: "30000-456",
    rua: "Rua da Liberdade",
    numero: "789",
    complemento: "Casa 2",
    bairro: "Savassi",
    cidade: "Belo Horizonte",
    observacoes: "Alergia à penicilina",
    created_at: "2025-03-10T16:22:00Z",
    updated_at: "2025-10-12T08:30:00Z"
  },
  {
    id: 4,
    name: "Carlos Eduardo Lima",
    convenio: "Nenhum",
    telefone: "(47) 94444-5555",
    idade: 55,
    data_nascimento: "1968-09-14",
    responsavel: null,
    cpf_responsavel: null,
    celular: "(47) 93333-4444",
    estado: "SC",
    sexo: "Masculino",
    profissao: "Comerciante",
    estado_civil: "Divorciado(a)",
    tipo_sanguineo: "AB+",
    pessoa: "Física",
    cpf_cnpj: "789.123.456-78",
    email: "carlos.lima@email.com",
    cep: "88000-789",
    rua: "Rua XV de Novembro",
    numero: "321",
    complemento: null,
    bairro: "Centro",
    cidade: "Florianópolis",
    observacoes: "Diabético tipo 2",
    created_at: "2025-04-05T13:10:00Z",
    updated_at: "2025-09-28T17:55:00Z"
  },
  {
    id: 5,
    name: "Fernanda Costa Almeida",
    convenio: "Amil",
    telefone: "(85) 92222-3333",
    idade: 31,
    data_nascimento: "1992-12-03",
    responsavel: null,
    cpf_responsavel: null,
    celular: "(85) 91111-2222",
    estado: "CE",
    sexo: "Feminino",
    profissao: "Advogada",
    estado_civil: "Casado(a)",
    tipo_sanguineo: "A-",
    pessoa: "Física",
    cpf_cnpj: "321.654.987-12",
    email: "fernanda.almeida@email.com",
    cep: "60000-321",
    rua: "Avenida Beira Mar",
    numero: "654",
    complemento: "Ed. Oceano, Apt 1205",
    bairro: "Meireles",
    cidade: "Fortaleza",
    observacoes: "Gestante - 2º trimestre",
    created_at: "2025-05-18T11:40:00Z",
    updated_at: "2025-10-16T15:25:00Z"
  },
  {
    id: 6,
    name: "Roberto Souza Pereira",
    convenio: "Hapvida",
    telefone: "(71) 98888-9999",
    idade: 67,
    data_nascimento: "1956-07-25",
    responsavel: "Maria Souza Pereira",
    cpf_responsavel: "654.321.987-54",
    celular: "(71) 97777-8888",
    estado: "BA",
    sexo: "Masculino",
    profissao: "Aposentado",
    estado_civil: "Casado(a)",
    tipo_sanguineo: "O+",
    pessoa: "Física",
    cpf_cnpj: "147.258.369-85",
    email: "roberto.pereira@email.com",
    cep: "40000-147",
    rua: "Rua Castro Alves",
    numero: "852",
    complemento: null,
    bairro: "Pelourinho",
    cidade: "Salvador",
    observacoes: "Portador de marca-passo, evitar procedimentos com equipamentos eletrônicos",
    created_at: "2025-06-12T08:20:00Z",
    updated_at: "2025-10-08T12:15:00Z"
  },
  {
    id: 7,
    name: "Juliana Martins Rocha",
    convenio: "Porto Seguro",
    telefone: "(61) 95555-6666",
    idade: 29,
    data_nascimento: "1994-01-17",
    responsavel: null,
    cpf_responsavel: null,
    celular: "(61) 94444-5555",
    estado: "DF",
    sexo: "Feminino",
    profissao: "Psicóloga",
    estado_civil: "Solteiro(a)",
    tipo_sanguineo: "B-",
    pessoa: "Física",
    cpf_cnpj: "963.852.741-96",
    email: "juliana.rocha@email.com",
    cep: "70000-963",
    rua: "SHIS QI 15",
    numero: "10",
    complemento: "Bloco A, Apt 203",
    bairro: "Lago Sul",
    cidade: "Brasília",
    observacoes: "Histórico familiar de problemas cardíacos",
    created_at: "2025-07-22T14:35:00Z",
    updated_at: "2025-10-14T09:10:00Z"
  },
  {
    id: 8,
    name: "Pedro Henrique Santos",
    convenio: "Nenhum",
    telefone: "(81) 93333-4444",
    idade: 24,
    data_nascimento: "1999-10-30",
    responsavel: "Luiza Santos",
    cpf_responsavel: "159.753.486-27",
    celular: "(81) 92222-3333",
    estado: "PE",
    sexo: "Masculino",
    profissao: "Estudante",
    estado_civil: "Solteiro(a)",
    tipo_sanguineo: "AB-",
    pessoa: "Física",
    cpf_cnpj: "852.741.963-30",
    email: "pedro.santos@email.com",
    cep: "50000-852",
    rua: "Rua da Aurora",
    numero: "147",
    complemento: null,
    bairro: "Boa Vista",
    cidade: "Recife",
    observacoes: null,
    created_at: "2025-08-08T10:50:00Z",
    updated_at: "2025-10-11T13:40:00Z"
  }
];

const PatientsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [patientToView, setPatientToView] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState("");
  const [lastRegisteredPatient, setLastRegisteredPatient] = useState<Patient | null>(null);

  const sortPatientsByIdAsc = (list: Patient[]) => {
    return [...list].sort((a, b) => Number(a.id) - Number(b.id));
  };

  const keepCurrentOrEmpty = () => {
    setPatients((prev) => prev.length > 0 ? sortPatientsByIdAsc(prev) : []);
  };

  // Função para buscar pacientes do backend
  const fetchPatients = async (): Promise<Patient[]> => {
    try {
      const response = await api.get("/pessoas/pacientes");

      if (process.env.NODE_ENV === 'development') {
        console.log("Resposta da API:", response.data);
      }

      let patientsData: Patient[] = [];
      if (Array.isArray(response.data)) {
        patientsData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        patientsData = response.data.data;
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn("Dados não estão no formato esperado:", response.data);
        }
        keepCurrentOrEmpty();
        return [];
      }

      const sorted = sortPatientsByIdAsc(patientsData);
      setPatients(sorted);
      return sorted;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Erro ao buscar pacientes:", error);
      }
      keepCurrentOrEmpty();
      return [];
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (!registerSuccessMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setRegisterSuccessMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [registerSuccessMessage]);

  const paginatedPatients = Array.isArray(patients) 
    ? patients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const handleNextPage = () => {
    if (Array.isArray(patients) && currentPage * itemsPerPage < patients.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenEditModal = (patient: Patient) => {
    setPatientToEdit(patient);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleUpdatePatient = async (updatedPatient: Patient): Promise<boolean> => {
    const normalizedCpfCnpj = normalizeDocument(updatedPatient.cpf_cnpj);

    if (hasDuplicatedCpfCnpj(normalizedCpfCnpj, Number(updatedPatient.id))) {
      setRegisterSuccessMessage('CPF/CNPJ ja esta cadastrado. Informe outro documento.');
      return false;
    }

    try {
      const payload = {
        name: updatedPatient.name,
        convenio: updatedPatient.convenio || "Nenhum",
        telefone: (updatedPatient.telefone || '').replace(/\D/g, ''),
        idade: Number(updatedPatient.idade || 0),
        data_nascimento: normalizeDate(updatedPatient.data_nascimento),
        responsavel: updatedPatient.responsavel || null,
        cpf_responsavel: (updatedPatient.cpf_responsavel || '').replace(/\D/g, '') || null,
        celular: (updatedPatient.celular || '').replace(/\D/g, '') || null,
        estado: updatedPatient.estado || "",
        sexo: updatedPatient.sexo || "",
        profissao: updatedPatient.profissao || null,
        estado_civil: updatedPatient.estado_civil || "",
        tipo_sanguineo: updatedPatient.tipo_sanguineo || "",
        pessoa: updatedPatient.pessoa || "Física",
        cpf_cnpj: normalizedCpfCnpj,
        email: updatedPatient.email || "",
        cep: (updatedPatient.cep || '').replace(/\D/g, ''),
        rua: updatedPatient.rua || "",
        numero: updatedPatient.numero || "",
        complemento: updatedPatient.complemento || null,
        bairro: updatedPatient.bairro || "",
        cidade: updatedPatient.cidade || null,
        observacoes: updatedPatient.observacoes || null,
      };

      const response = await api.put(`/pessoas/pacientes/${updatedPatient.id}`, payload);
      const persistedPatient = response?.data?.data || response?.data || updatedPatient;

      // Atualiza a tabela imediatamente com o retorno da API antes da recarga completa.
      setPatients((prev) => {
        const merged = prev.map((patient) =>
          patient.id === updatedPatient.id
            ? {
                ...patient,
                ...persistedPatient,
              }
            : patient
        );
        return sortPatientsByIdAsc(merged);
      });

      try {
        const updatedList = await fetchPatients();
        setCurrentPage((prev) => {
          const totalPages = Math.max(1, Math.ceil(updatedList.length / itemsPerPage));
          return Math.min(prev, totalPages);
        });
      } catch (refreshError) {
        if (process.env.NODE_ENV === 'development') {
          console.warn("Paciente atualizado, mas a recarga da lista falhou:", refreshError);
        }
      }

      setRegisterSuccessMessage("Alterado com sucesso!");
      return true;
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Erro ao atualizar paciente:", error?.response?.data || error);
      }
      const detailedMessage = extractApiErrorMessage(error);
      setRegisterSuccessMessage(detailedMessage);
      return false;
    }
  };

  const handleOpenViewModal = (patient: Patient) => {
    setPatientToView(patient);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
  };

  const handleDeletePatient = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      await api.delete(`/pessoas/pacientes/${id}`);

      const updatedList = await fetchPatients();
      setCurrentPage((prev) => {
        const totalPages = Math.max(1, Math.ceil(updatedList.length / itemsPerPage));
        return Math.min(prev, totalPages);
      });

      if (patientToView?.id === id) {
        setIsViewModalOpen(false);
        setPatientToView(null);
      }

      if (patientToEdit?.id === id) {
        setIsEditModalOpen(false);
        setPatientToEdit(null);
      }

      setRegisterSuccessMessage("Paciente excluído com sucesso!");
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Erro ao excluir paciente:", error?.response?.data || error);
      }
      setRegisterSuccessMessage(extractApiErrorMessage(error));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Array.isArray(patients)) {
      if (e.target.checked) {
        setSelectedPatients(patients.map((patient) => patient.id));
      } else {
        setSelectedPatients([]);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSelectPatient = (id: number) => {
    if (selectedPatients.includes(id)) {
      setSelectedPatients(selectedPatients.filter((patientId) => patientId !== id));
    } else {
      setSelectedPatients([...selectedPatients, id]);
    }
  };

  const handleExportToExcel = () => {
    if (Array.isArray(patients) && patients.length > 0) {
      // Exportar dados sem mascaramento
      const worksheet = XLSX.utils.json_to_sheet(patients);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Pacientes");
      XLSX.writeFile(workbook, "Pacientes.xlsx");
    } else {
      if (process.env.NODE_ENV === 'development') {
        alert("Não há dados para exportar.");
      }
    }
  };

  const handleExportToXML = () => {
    if (Array.isArray(patients) && patients.length > 0) {
      // Exportar dados sem mascaramento
      const xmlData = patients.map((patient) => {
        return `
        <patient>
          <id>${patient.id}</id>
          <name>${patient.name}</name>
          <telefone>${patient.telefone}</telefone>
          <convenio>${patient.convenio}</convenio>
          <idade>${patient.idade}</idade>
          <data_nascimento>${patient.data_nascimento}</data_nascimento>
          <responsavel>${patient.responsavel || ''}</responsavel>
          <cpf_responsavel>${patient.cpf_responsavel || ''}</cpf_responsavel>
          <pessoa>${patient.pessoa}</pessoa>
          <cpf_cnpj>${patient.cpf_cnpj}</cpf_cnpj>
          <email>${patient.email}</email>
          <cep>${patient.cep}</cep>
          <rua>${patient.rua}</rua>
          <numero>${patient.numero}</numero>
          <complemento>${patient.complemento || ''}</complemento>
          <bairro>${patient.bairro}</bairro>
          <cidade>${patient.cidade || ''}</cidade>
          <estado>${patient.estado}</estado>
          <tipo_sanguineo>${patient.tipo_sanguineo}</tipo_sanguineo>
          <sexo>${patient.sexo}</sexo>
          <profissao>${patient.profissao || ''}</profissao>
          <estado_civil>${patient.estado_civil}</estado_civil>
          <celular>${patient.celular || ''}</celular>
          <observacoes>${patient.observacoes || ''}</observacoes>
        </patient>
      `;
      });

      const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
    <patients>
      ${xmlData.join("\n")}
    </patients>`;

      const blob = new Blob([xmlContent], { type: "application/xml" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Pacientes.xml";
      link.click();
    } else {
      if (process.env.NODE_ENV === 'development') {
        alert("Não há dados para exportar.");
      }
    }
  };

  const normalizeDate = (value: string) => {
    if (!value) return '';

    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }

    const brMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (brMatch) {
      const [, dd, mm, yyyy] = brMatch;
      return `${yyyy}-${mm}-${dd}`;
    }

    return trimmed;
  };

  const normalizeDocument = (value: string | null | undefined) => {
    return (value || '').replace(/\D/g, '');
  };

  const hasDuplicatedCpfCnpj = (cpfCnpj: string, ignorePatientId?: number) => {
    if (!cpfCnpj) return false;

    return patients.some((patient) => {
      const patientId = Number(patient.id);
      const shouldIgnore = typeof ignorePatientId === 'number' && patientId === Number(ignorePatientId);
      if (shouldIgnore) return false;

      return normalizeDocument(patient.cpf_cnpj) === cpfCnpj;
    });
  };

  const translateApiErrorMessage = (message: string) => {
    const normalized = (message || '').toLowerCase();

    if (
      normalized.includes('the cpf cnpj has already been taken') ||
      normalized.includes('cpf_cnpj has already been taken')
    ) {
      return 'CPF/CNPJ ja esta cadastrado. Informe outro documento.';
    }

    return message;
  };

  const extractApiErrorMessage = (error: any): string => {
    const responseData = error?.response?.data;

    if (responseData?.errors && typeof responseData.errors === 'object') {
      const messages = Object.values(responseData.errors)
        .flat()
        .filter(Boolean) as string[];

      if (messages.length > 0) {
        return translateApiErrorMessage(messages.join(' | '));
      }
    }

    if (responseData?.message) {
      return translateApiErrorMessage(String(responseData.message));
    }

    return 'Não foi possível gravar no MySQL via API. Verifique os dados e tente novamente.';
  };

  const handleAddPatient = async (newPatient: NewPatientFromForm): Promise<AddPatientResult> => {
    const normalizedBirthDate = normalizeDate(newPatient.nascimento);
    const normalizedCpfCnpj = normalizeDocument(newPatient.cpfCnpj);
    const birthDate = normalizedBirthDate ? new Date(normalizedBirthDate) : null;
    const today = new Date();
    const calculatedAge = birthDate
      ? Math.max(
          0,
          today.getFullYear() -
            birthDate.getFullYear() -
            (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0)
        )
      : 0;

    if (hasDuplicatedCpfCnpj(normalizedCpfCnpj)) {
      const duplicateMessage = 'CPF/CNPJ ja esta cadastrado. Informe outro documento.';
      setRegisterSuccessMessage(duplicateMessage);
      return {
        success: false,
        errorMessage: duplicateMessage,
      };
    }

    try {
      const payload = {
        name: newPatient.nome,
        convenio: newPatient.convenio || "Nenhum",
        telefone: (newPatient.telefone || '').replace(/\D/g, ''),
        idade: calculatedAge,
        data_nascimento: normalizedBirthDate,
        responsavel: newPatient.responsavel || null,
        cpf_responsavel: (newPatient.cpfResponsavel || '').replace(/\D/g, '') || null,
        celular: (newPatient.telefone2 || '').replace(/\D/g, '') || null,
        estado: newPatient.estado || "",
        sexo: newPatient.sexo || "",
        profissao: newPatient.profissao || null,
        estado_civil: newPatient.estadoCivil || "",
        tipo_sanguineo: newPatient.tipoSanguineo || "",
        pessoa: newPatient.pessoa || "Física",
        cpf_cnpj: normalizedCpfCnpj,
        email: newPatient.email || "",
        cep: (newPatient.cep || '').replace(/\D/g, ''),
        rua: newPatient.rua || "",
        numero: newPatient.numero || "",
        complemento: newPatient.complemento || null,
        bairro: newPatient.bairro || "",
        cidade: newPatient.cidade || null,
        observacoes: newPatient.observacoes || null,
      };

      const response = await api.post("/pessoas/pacientes", payload);
      const createdPatient = response?.data?.data || response?.data || null;

      const updatedList = await fetchPatients();
      setCurrentPage(Math.max(1, Math.ceil(updatedList.length / itemsPerPage)));

      if (createdPatient && createdPatient.id) {
        setLastRegisteredPatient(createdPatient as Patient);
      }

      setRegisterSuccessMessage("Paciente Cadastrado com Sucesso!!!");
      handleCloseModal();
      return { success: true };
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Erro ao cadastrar paciente:", error?.response?.data || error);
      }

      const detailedMessage = extractApiErrorMessage(error);
      setRegisterSuccessMessage(detailedMessage);
      return {
        success: false,
        errorMessage: detailedMessage,
      };
    }
  };

  return (
    <PageWrapper>
      <MainContent>
        <Header>
          <Title>Lista de Pacientes</Title>
          <Actions>
            <StyledButton color="#007bff" hoverColor="#0056b3" onClick={handleOpenModal}>
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H11V21H5V3H14V8H19V9H21ZM17 13C18.1 13 19 13.9 19 15S18.1 17 17 17 15 16.1 15 15 15.9 13 17 13ZM20 19.5C20 20.3 19.3 21 18.5 21H15.5C14.7 21 14 20.3 14 19.5V18.5C14 17.7 14.7 17 15.5 17H18.5C19.3 17 20 17.7 20 18.5V19.5Z"/>
              </svg>
              Adicionar Paciente
            </StyledButton>
            
            <StyledButton color="#28a745" hoverColor="#218838" onClick={handleExportToExcel}>
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                <path d="M14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2M18 20H6V4H13V9H18V20M9.5 12.5L11 15H10L9.2 13.5L8.5 15H7.5L9 12.5L7.5 10H8.5L9.2 11.5L10 10H11L9.5 12.5M14.5 10H16V11.5H14.5V13H16V14.5H14.5V16H13V10H14.5Z"/>
              </svg>
              Exportar Excel
            </StyledButton>
            
            <StyledButton color="#fd7e14" hoverColor="#e66b00" onClick={handleExportToXML}>
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                <path d="M14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2M18 20H6V4H13V9H18V20M8.5 10.5L10 12L8.5 13.5L9.5 14.5L11.5 12L9.5 9.5L8.5 10.5M12.5 9.5L10.5 12L12.5 14.5L13.5 13.5L12 12L13.5 10.5L12.5 9.5M15.5 10.5L14 12L15.5 13.5L16.5 14.5L18.5 12L16.5 9.5L15.5 10.5Z"/>
              </svg>
              Exportar XML
            </StyledButton>
          </Actions>
        </Header>

        {registerSuccessMessage && (
          <SuccessMessage>{registerSuccessMessage}</SuccessMessage>
        )}

        {lastRegisteredPatient && (
          <LastRegisteredCard>
            <h4>Dados do último paciente cadastrado</h4>
            <p><strong>Nome:</strong> {lastRegisteredPatient.name}</p>
            <p><strong>Telefone:</strong> {lastRegisteredPatient.telefone}</p>
            <p><strong>Email:</strong> {lastRegisteredPatient.email}</p>
            <p><strong>Convênio:</strong> {lastRegisteredPatient.convenio || "Nenhum"}</p>
          </LastRegisteredCard>
        )}
        
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Convênio</th>
                <th>Telefone</th>
                <th>Idade</th>
                <th>Data Nasc.</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.convenio}</td>
                  <td>{patient.telefone}</td>
                  <td>{patient.idade}</td>
                  <td>{formatBirthDate(patient.data_nascimento)}</td>
                  <td>
                    <ActionButtonsContainer>
                      <ActionButton 
                        color="#17a2b8" 
                        hoverColor="#138496" 
                        onClick={() => handleOpenViewModal(patient)}
                        title="Ver dados completos"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                        Dados
                      </ActionButton>
                      
                      <ActionButton 
                        color="#ffc107" 
                        hoverColor="#e0a800" 
                        onClick={() => handleOpenEditModal(patient)}
                        title="Editar paciente"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                        Editar
                      </ActionButton>
                      
                      <ActionButton 
                        color="#dc3545" 
                        hoverColor="#c82333" 
                        onClick={() => handleDeletePatient(patient.id)}
                        title="Excluir paciente"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                        Excluir
                      </ActionButton>
                    </ActionButtonsContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
        
        {/* Controles de Paginação Centralizados */}
        <PaginationContainer>
          <PaginationButton 
            onClick={handlePreviousPage} 
            disabled={currentPage === 1 || !Array.isArray(patients) || patients.length === 0}
            color="#6c757d"
            hoverColor="#5a6268"
          >
            ← Anterior
          </PaginationButton>
          
          <PaginationInfo>
            {!Array.isArray(patients) || patients.length === 0 
              ? "Nenhum paciente encontrado" 
              : `Página ${currentPage} de ${Math.ceil(patients.length / itemsPerPage)}`
            }
          </PaginationInfo>
          
          <PaginationButton 
            onClick={handleNextPage} 
            disabled={!Array.isArray(patients) || currentPage * itemsPerPage >= patients.length || patients.length === 0}
            color="#6c757d"
            hoverColor="#5a6268"
          >
            Próxima →
          </PaginationButton>
        </PaginationContainer>
        {isModalOpen && (
          <>
            <ModalOverlay onClick={handleCloseModal} />
            <ModalContent>
              <AddPatientForm
                onClose={handleCloseModal}
                onAddPatient={handleAddPatient}
              />
            </ModalContent>
          </>
        )}
        <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
          {patientToEdit && <EditPatientForm patient={patientToEdit} onClose={handleCloseEditModal} onUpdate={handleUpdatePatient} />}
        </Modal>
        <Modal isOpen={isViewModalOpen} onClose={handleCloseViewModal}>
          {patientToView && <ViewPatientModal patient={patientToView} onClose={handleCloseViewModal} />}
        </Modal>
      </MainContent>
    </PageWrapper>
  );
};

export default PatientsPage;