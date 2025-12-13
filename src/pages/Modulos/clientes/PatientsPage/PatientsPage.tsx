import React, { useEffect, useState, useMemo } from "react";
import api from "../../../../components/api/api";
import Modal from "./Modal";
import AddPatientForm from "../PatientTable/AddPatientForm";
import LazyComponent, { VirtualList } from "../../../../components/shared/LazyComponent/LazyComponent";
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
  max-height: calc(400vh - 40px);
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
  border-collapse: collapse;
  margin: 0;
  flex: 1;
  height: 100%;

  th,
  td {
    border: 1px solid #ddd;
    padding: 12px 10px;
    text-align: left;
    vertical-align: middle;
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
    width: 280px;
    min-width: 280px;
  }
`;

const TableContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  min-height: 0;
  height: calc(100vh - 280px);
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
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  min-width: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  
  svg {
    width: 14px;
    height: 14px;
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

// Define the type for the custom prop
interface ButtonProps {
  primary?: boolean; // Optional boolean prop
}

// Use the type in the styled component
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
  onUpdate: (updatedPatient: Patient) => void;
}

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

  const handleSubmit = (e: React.FormEvent) => {
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
    
    onUpdate(editedPatient);
    onClose();
  };

  const conveniosOptions = ["Nenhum", "Plano A", "Plano B"];
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
        <div><strong>Data de Nascimento:</strong> {patient.data_nascimento}</div>
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
  const [patients, setPatients] = useState<Patient[]>(fakePatients); // Inicializa com dados fake
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);

  // Função para buscar pacientes do backend
  const fetchPatients = () => {
    api.get("/pessoas/pacientes")
      .then(response => {
        if (process.env.NODE_ENV === 'development') {
          console.log("Resposta da API:", response.data);
        }
        let patientsData = [];
        if (Array.isArray(response.data)) {
          patientsData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          patientsData = response.data.data;
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.warn("Dados não estão no formato de array, usando dados fake:", response.data);
          }
          setPatients(fakePatients);
          return;
        }
        if (patientsData.length === 0) {
          if (process.env.NODE_ENV === 'development') {
            console.log("API retornou dados vazios, usando dados fake para teste do layout");
          }
          setPatients(fakePatients);
        } else {
          setPatients(patientsData);
        }
      })
      .catch(error => {
        if (process.env.NODE_ENV === 'development') {
          console.error("Erro ao buscar pacientes, usando dados fake:", error);
        }
        setPatients(fakePatients);
      });
  };

  useEffect(() => {
    fetchPatients();
  }, []);

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

  const handleUpdatePatient = (updatedPatient: Patient) => {
    if (Array.isArray(patients)) {
      setPatients(patients.map((patient) => (patient.id === updatedPatient.id ? updatedPatient : patient)));
      // Usar notificação mais segura em vez de alert
      if (process.env.NODE_ENV === 'development') {
        alert("Paciente atualizado com sucesso!");
      }
    }
  };

  const handleOpenViewModal = (patient: Patient) => {
    setPatientToView(patient);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
  };

  const handleDeletePatient = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este paciente?")) {
      if (Array.isArray(patients)) {
        setPatients(patients.filter((patient) => patient.id !== id));
        // Usar notificação mais segura em vez de alert
        if (process.env.NODE_ENV === 'development') {
          alert("Paciente excluído com sucesso!");
        }
      }
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Array.isArray(patients)) {
      if (e.target.checked) {
        setSelectedPatients(patients.map((patient) => patient.id));
      } else {
        setSelectedPatients([]);
      }
    }
  };

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
              Cadastrar Paciente
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
                  <td>{patient.data_nascimento}</td>
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
              <h3>Cadastrar Paciente</h3>
              <AddPatientForm
                onClose={handleCloseModal}
                onAddPatient={() => {
                  fetchPatients();
                  handleCloseModal();
                }}
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