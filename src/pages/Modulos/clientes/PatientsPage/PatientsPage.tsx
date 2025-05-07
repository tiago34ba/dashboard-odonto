import React, { useState } from "react";
import Sidebar from "../../../../components/Sidebar/Sidebar";
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
  margin-top: 20px;

  th,
  td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;
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
  phone: string;
  insurance: string;
  age: string;
  nascimento: string;
  responsavel: string;
  cpfResponsavel: string;
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
  telefone2: string;
  observacoes: string;
}
interface EditPatientFormProps {
  patient: Patient;
  onClose: () => void;
  onUpdate: (updatedPatient: Patient) => void;
}

const EditPatientForm: React.FC<EditPatientFormProps> = ({ patient, onClose, onUpdate }) => {
  const [editedPatient, setEditedPatient] = useState(patient);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedPatient({ ...editedPatient, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedPatient.name || !editedPatient.phone) {
      alert("Por favor, preencha os campos obrigatórios.");
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
  ]; const estadosCivisOptions = ["Solteiro(a)", "Casado(a)", "Divorciado(a)"];
  const tiposSanguineosOptions = ["Selecionar", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  return (
    <div className="edit-patient-form">
      <h2>Editar Paciente</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="name">Nome:</label>
            <input type="text" id="name" name="name" value={editedPatient.name} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="phone">Telefone:</label>
            <input type="text" id="phone" name="phone" value={editedPatient.phone} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="insurance">Convênio:</label>
            <select id="insurance" name="insurance" value={editedPatient.insurance} onChange={handleChange}>
              {conveniosOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="age">Idade:</label>
            <input type="text" id="age" name="age" value={editedPatient.age} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="nascimento">Data de Nascimento:</label>
            <input type="date" id="nascimento" name="nascimento" value={editedPatient.nascimento} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="responsavel">Responsável:</label>
            <input type="text" id="responsavel" name="responsavel" value={editedPatient.responsavel} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="cpfResponsavel">CPF do Responsável:</label>
            <input type="text" id="cpfResponsavel" name="cpfResponsavel" value={editedPatient.cpfResponsavel} onChange={handleChange} />
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
            <label htmlFor="cpfCnpj">CPF / CNPJ:</label>
            <input type="text" id="cpfCnpj" name="cpfCnpj" value={editedPatient.cpfCnpj} onChange={handleChange} />
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
            <input type="text" id="complemento" name="complemento" value={editedPatient.complemento} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="bairro">Bairro:</label>
            <input type="text" id="bairro" name="bairro" value={editedPatient.bairro} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="cidade">Cidade:</label>
            <input type="text" id="cidade" name="cidade" value={editedPatient.cidade} onChange={handleChange} />
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
            <label htmlFor="tipoSanguineo">Tipo Sanguíneo:</label>
            <select id="tipoSanguineo" name="tipoSanguineo" value={editedPatient.tipoSanguineo} onChange={handleChange}>
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
            <input type="text" id="profissao" name="profissao" value={editedPatient.profissao} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="estadoCivil">Estado Civil:</label>
            <select id="estadoCivil" name="estadoCivil" value={editedPatient.estadoCivil} onChange={handleChange}>
              {estadosCivisOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="telefone2">Celular:</label>
            <input type="text" id="telefone2" name="telefone2" value={editedPatient.telefone2} onChange={handleChange} />
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
        <div><strong>Telefone:</strong> {patient.phone}</div>
        <div><strong>Convênio:</strong> {patient.insurance}</div>
        <div><strong>Idade:</strong> {patient.age}</div>
        <div><strong>Data de Nascimento:</strong> {patient.nascimento}</div>
        <div><strong>Responsável:</strong> {patient.responsavel}</div>
        <div><strong>CPF do Responsável:</strong> {patient.cpfResponsavel}</div>
        <div><strong>Email:</strong> {patient.email}</div>
        <div><strong>Endereço:</strong> {patient.rua}, {patient.numero}, {patient.bairro}, {patient.cidade} - {patient.estado}</div>
        <div><strong>Tipo Sanguíneo:</strong> {patient.tipoSanguineo}</div>
        <div><strong>Sexo:</strong> {patient.sexo}</div>
        <div><strong>Profissão:</strong> {patient.profissao}</div>
        <div><strong>Estado Civil:</strong> {patient.estadoCivil}</div>
        <div><strong>Observações:</strong> {patient.observacoes}</div>
      </div>
      <button onClick={onClose} className="close-button">Fechar</button>
    </div>
  );
};

const PatientsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [patientToView, setPatientToView] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 1,
      name: "mateus",
      phone: "(71)99640-5570",
      insurance: "Hapvida",
      age: "44",
      nascimento: "1980-01-01",
      responsavel: "Responsavel 1",
      cpfResponsavel: "111.111.111-11",
      pessoa: "Física",
      cpfCnpj: "111.111.111-11",
      email: "mateus@example.com",
      cep: "40000-000",
      rua: "Rua 1",
      numero: "1",
      complemento: "Apto 1",
      bairro: "Bairro 1",
      cidade: "Salvador",
      estado: "BA",
      tipoSanguineo: "A+",
      sexo: "Masculino",
      profissao: "Desenvolvedor",
      estadoCivil: "Solteiro(a)",
      telefone2: "(71)99999-9999",
      observacoes: "Observações 1",
    },
    {
      id: 2,
      name: "mateus2",
      phone: "(71)98666-0020",
      insurance: "Amil",
      age: "30",
      nascimento: "1994-02-02",
      responsavel: "Responsavel 2",
      cpfResponsavel: "222.222.222-22",
      pessoa: "Jurídica",
      cpfCnpj: "22.222.222/0001-22",
      email: "mateus2@example.com",
      cep: "41000-000",
      rua: "Rua 2",
      numero: "2",
      complemento: "Sala 2",
      bairro: "Bairro 2",
      cidade: "Feira de Santana",
      estado: "BA",
      tipoSanguineo: "B+",
      sexo: "Feminino",
      profissao: "Designer",
      estadoCivil: "Casado(a)",
      telefone2: "(75)88888-8888",
      observacoes: "Observações 2",
    },
    {
      id: 3,
      name: "JORGE ERICSSON SILVA PINHEIRO",
      phone: "(71)98632-0010",
      insurance: "Unimed Nacional",
      age: "60",
      nascimento: "1964-03-03",
      responsavel: "Responsavel 3",
      cpfResponsavel: "333.333.333-33",
      pessoa: "Física",
      cpfCnpj: "333.333.333-33",
      email: "jorge@example.com",
      cep: "42000-000",
      rua: "Rua 3",
      numero: "3",
      complemento: "Casa 3",
      bairro: "Bairro 3",
      cidade: "Camaçari",
      estado: "BA",
      tipoSanguineo: "O+",
      sexo: "Masculino",
      profissao: "Médico",
      estadoCivil: "Divorciado(a)",
      telefone2: "(71)77777-7777",
      observacoes: "Observações 3",
    },
    {
      id: 4,
      name: "Francisco neto",
      phone: "(92) 99227-6443",
      insurance: "Bradesco Saúde",
      age: "26",
      nascimento: "1998-04-04",
      responsavel: "Responsavel 4",
      cpfResponsavel: "444.444.444-44",
      pessoa: "Física",
      cpfCnpj: "444.444.444-44",
      email: "francisco@example.com",
      cep: "69000-000",
      rua: "Rua 4",
      numero: "4",
      complemento: "Apto 4",
      bairro: "Bairro 4",
      cidade: "Manaus",
      estado: "AM",
      tipoSanguineo: "AB+",
      sexo: "Masculino",
      profissao: "Engenheiro",
      estadoCivil: "Solteiro(a)",
      telefone2: "(92)66666-6666",
      observacoes: "Observações 4",
    },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);

  const paginatedPatients = patients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < patients.length) {
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
    setPatients(patients.map((patient) => (patient.id === updatedPatient.id ? updatedPatient : patient)));
    alert("Paciente atualizado com sucesso!");
  };

  const handleOpenViewModal = (patient: Patient) => {
    setPatientToView(patient);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
  };

  function handleOpenShowPatient(patient: Patient): void {
    throw new Error("Function not implemented.");
  }

  const handleDeletePatient = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este paciente?")) {
      setPatients(patients.filter((patient) => patient.id !== id));
      alert("Paciente excluído com sucesso!");
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPatients(patients.map((patient) => patient.id));
    } else {
      setSelectedPatients([]);
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
    const worksheet = XLSX.utils.json_to_sheet(patients); // Converte os dados dos pacientes para uma planilha
    const workbook = XLSX.utils.book_new(); // Cria um novo livro de trabalho
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pacientes"); // Adiciona a planilha ao livro
    XLSX.writeFile(workbook, "Pacientes.xlsx"); // Salva o arquivo Excel
  };

  const handleExportToXML = () => {
    const xmlData = patients.map((patient) => {
      return `
        <patient>
          <id>${patient.id}</id>
          <name>${patient.name}</name>
          <phone>${patient.phone}</phone>
          <insurance>${patient.insurance}</insurance>
          <age>${patient.age}</age>
          <nascimento>${patient.nascimento}</nascimento>
          <responsavel>${patient.responsavel}</responsavel>
          <cpfResponsavel>${patient.cpfResponsavel}</cpfResponsavel>
          <pessoa>${patient.pessoa}</pessoa>
          <cpfCnpj>${patient.cpfCnpj}</cpfCnpj>
          <email>${patient.email}</email>
          <cep>${patient.cep}</cep>
          <rua>${patient.rua}</rua>
          <numero>${patient.numero}</numero>
          <complemento>${patient.complemento}</complemento>
          <bairro>${patient.bairro}</bairro>
          <cidade>${patient.cidade}</cidade>
          <estado>${patient.estado}</estado>
          <tipoSanguineo>${patient.tipoSanguineo}</tipoSanguineo>
          <sexo>${patient.sexo}</sexo>
          <profissao>${patient.profissao}</profissao>
          <estadoCivil>${patient.estadoCivil}</estadoCivil>
          <telefone2>${patient.telefone2}</telefone2>
          <observacoes>${patient.observacoes}</observacoes>
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
  };

  return (
    <PageWrapper>
      <Sidebar />
      <MainContent>
        <Header>
          <Title>Lista de Pacientes</Title>
          <Actions>
            <StyledButton color="#007bff" hoverColor="#0056b3" onClick={handleOpenModal}>
              <i className="fas fa-plus"></i> Cadastrar Paciente
            </StyledButton>
            <StyledButton color="#28a745" hoverColor="#218838" onClick={handleExportToExcel}>
              <i className="fas fa-file-excel"></i> Exportar Excel
            </StyledButton>
            <StyledButton color="#17a2b8" hoverColor="#138496" onClick={handleExportToXML}>
              <i className="fas fa-file-code"></i> Exportar XML
            </StyledButton>
          </Actions>
        </Header>
        <Table>
          <thead>
            <tr>
              <th>Selecionar</th>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Convênio</th>
              <th>Idade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPatients.map((patient) => (
              <tr key={patient.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedPatients.includes(patient.id)}
                    onChange={() => handleSelectPatient(patient.id)}
                  />
                </td>
                <td>{patient.name}</td>
                <td>{patient.phone}</td>
                <td>{patient.insurance}</td>
                <td>{patient.age}</td>
                <td>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      title="Visualizar"
                      onClick={() => handleOpenViewModal(patient)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "4px",
                        border: "none",
                        background: "#6c757d",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      title="Editar"
                      onClick={() => handleOpenEditModal(patient)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "4px",
                        border: "none",
                        background: "#ffc107",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      title="Excluir"
                      onClick={() => handleDeletePatient(patient.id)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "4px",
                        border: "none",
                        background: "#dc3545",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {isModalOpen && (
          <>
            <ModalOverlay onClick={handleCloseModal} />
            <ModalContent>
              <h3>Cadastrar Paciente</h3>
              <AddPatientForm
                onClose={handleCloseModal}
                onAddPatient={(newPatient) =>
                  setPatients([
                    ...patients,
                    {
                      id: newPatient.id,
                      name: newPatient.nome,
                      phone: newPatient.telefone,
                      insurance: newPatient.convenio || "Nenhum",
                      age: newPatient.nascimento ? String(new Date().getFullYear() - new Date(newPatient.nascimento).getFullYear()) : "",
                      nascimento: newPatient.nascimento,
                      responsavel: newPatient.responsavel,
                      cpfResponsavel: newPatient.cpfResponsavel,
                      pessoa: newPatient.pessoa,
                      cpfCnpj: newPatient.cpfCnpj,
                      email: newPatient.email,
                      cep: newPatient.cep,
                      rua: newPatient.rua,
                      numero: newPatient.numero,
                      complemento: newPatient.complemento,
                      bairro: newPatient.bairro,
                      cidade: newPatient.cidade,
                      estado: newPatient.estado,
                      tipoSanguineo: newPatient.tipoSanguineo || "",
                      sexo: newPatient.sexo,
                      profissao: newPatient.profissao,
                      estadoCivil: newPatient.estadoCivil,
                      telefone2: newPatient.telefone2,
                      observacoes: newPatient.observacoes,
                    },
                  ])
                }
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

function handleOpenShowPatient(patient: Patient): void {
  throw new Error("Function not implemented.");
}