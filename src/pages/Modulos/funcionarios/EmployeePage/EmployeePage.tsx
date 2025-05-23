import React, { useState } from "react";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import styled from "styled-components";

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
  justify-content: center; /* Centraliza o conteúdo */
  gap: 5px;
  background-color: ${(props) => props.color || "#007bff"};
  color: white;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${(props) => props.hoverColor || "#0056b3"};
    transform: scale(1.05); /* Efeito de zoom ao passar o mouse */
  }

  i {
    font-size: 16px; /* Ajusta o tamanho do ícone */
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

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  width: 600px; /* Ajuste da largura */
  max-width: 90%;
  max-height: 80vh; /* Limita a altura máxima */
  overflow: hidden; /* Esconde o conteúdo que ultrapassa */
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    font-size: 20px;
    color: #333;
    margin: 0;
  }

  button {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #999;

    &:hover {
      color: #333;
    }
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }

  input,
  select {
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;

    &:focus {
      border-color: #007bff;
      outline: none;
    }
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;

  > div {
    flex: 1;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;

  button {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;

    &.close {
      background-color: #6c757d;
      color: white;

      &:hover {
        background-color: #5a6268;
      }
    }

    &.save {
      background-color: #28a745;
      color: white;

      &:hover {
        background-color: #218838;
      }
    }
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ScrollableContainer = styled.div`
  max-height: calc(80vh - 60px); /* Altura ajustada para caber no modal */
  overflow-y: auto; /* Adiciona barra de rolagem vertical */
  padding-right: 10px; /* Espaço para evitar sobreposição com a barra de rolagem */
  margin-right: -10px; /* Ajusta o alinhamento */
  scrollbar-width: thin; /* Estiliza a barra de rolagem no Firefox */
  scrollbar-color: #ccc transparent;

  /* Estilização para navegadores baseados em WebKit */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #aaa;
  }
`;

interface Employee {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: string;
  photo: string;
  active: boolean;
  registrationDate: string;
  pixKey: string;
  accessPanel: boolean;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  interval: string;
  cro: string;
  commission: number;
}

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "João Silva",
      phone: "(11) 99999-9999",
      email: "joao.silva@example.com",
      role: "Dentista",
      photo: "photo1.jpg",
      active: true,
      registrationDate: "01/01/2023",
      pixKey: "Telefone: (11) 99999-9999",
      accessPanel: true,
      address: {
        street: "Rua Exemplo",
        number: "123",
        complement: "Apto 101",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        zipCode: "01000-000",
      },
      interval: "30 Minutos",
      cro: "123-45",
      commission: 15,
    },
    {
      id: 2,
      name: "Maria Oliveira",
      phone: "(21) 88888-8888",
      email: "maria.oliveira@example.com",
      role: "Secretária",
      photo: "photo2.jpg",
      active: false,
      registrationDate: "15/02/2023",
      pixKey: "Email: maria.oliveira@example.com",
      accessPanel: false,
      address: {
        street: "Rua das Flores",
        number: "456",
        complement: "",
        neighborhood: "Jardim",
        city: "Rio de Janeiro",
        state: "RJ",
        zipCode: "20000-000",
      },
      interval: "15 Minutos",
      cro: "",
      commission: 0,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: 0,
    name: "",
    phone: "",
    email: "",
    role: "",
    photo: "",
    active: false,
    registrationDate: "",
    pixKey: "",
    accessPanel: false,
    address: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
    },
    interval: "",
    cro: "",
    commission: 0,
  });

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddEmployee = () => {
    setEmployees([...employees, { ...newEmployee, id: Date.now() }]);
    setNewEmployee({
      id: 0,
      name: "",
      phone: "",
      email: "",
      role: "",
      photo: "",
      active: false,
      registrationDate: "",
      pixKey: "",
      accessPanel: false,
      address: {
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
      },
      
      interval: "",
      cro: "",
      commission: 0,
    });
    handleCloseModal();
  };

  const handleOpenViewModal = (employee: Employee) => {
    console.log("Visualizar:", employee);
  };

  const handleOpenEditModal = (employee: Employee) => {
    console.log("Editar:", employee);
  };

  const handleDeleteEmployee = (id: number) => {
    console.log("Excluir:", id);
  };

  const handleExportToExcel = () => {
    console.log("Exportar para Excel");
  };

  const handleExportToXML = () => {
    console.log("Exportar para XML");
  };

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleCloseDetails = () => {
    setSelectedEmployee(null);
  };

  return (
    <PageWrapper>
      <Sidebar />
      <MainContent>
        <Header>
          <Title>Lista de Funcionários</Title>
          <Actions>
            <StyledButton
              color="#007bff"
              hoverColor="#0056b3"
              onClick={handleOpenModal}
            >
              <i className="fas fa-plus"></i> Cadastrar Funcionário
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
              <th>Ativo</th>
              <th>Data Cadastro</th>
              <th>Chave Pix</th>
              <th>Acessar Painel</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.active ? "Sim" : "Não"}</td>
                <td>{employee.registrationDate}</td>
                <td>{employee.pixKey}</td>
                <td>{employee.accessPanel ? "Sim" : "Não"}</td>
                <td>
                  <Actions>
                    <StyledButton
                      color="#007bff"
                      hoverColor="#0056b3"
                      onClick={() => handleViewDetails(employee)}
                    >
                      <i className="fas fa-eye"></i> Visualizar
                    </StyledButton>
                    <StyledButton
                      color="#ffc107"
                      hoverColor="#e0a800"
                      onClick={() => handleOpenEditModal(employee)}
                    >
                      <i className="fas fa-edit"></i> Editar
                    </StyledButton>
                    <StyledButton
                      color="#dc3545"
                      hoverColor="#c82333"
                      onClick={() => handleDeleteEmployee(employee.id)}
                    >
                      <i className="fas fa-trash"></i> Excluir
                    </StyledButton>
                  </Actions>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {isModalOpen && (
          <>
            <Overlay onClick={handleCloseModal} />
            <Modal>
              <ModalHeader>
                <h3>Cadastrar Funcionário</h3>
                <button onClick={handleCloseModal}>&times;</button>
              </ModalHeader>
              <ScrollableContainer>
                <ModalContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddEmployee();
                    }}
                  >
                    <FormGroup>
                      <label>Nome:</label>
                      <input
                        type="text"
                        value={newEmployee.name}
                        onChange={(e) =>
                          setNewEmployee({ ...newEmployee, name: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Telefone:</label>
                      <input
                        type="text"
                        value={newEmployee.phone}
                        onChange={(e) =>
                          setNewEmployee({ ...newEmployee, phone: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Email:</label>
                      <input
                        type="email"
                        value={newEmployee.email}
                        onChange={(e) =>
                          setNewEmployee({ ...newEmployee, email: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Cargo:</label>
                      <select
                        className="form-select"
                        name="role"
                        id="role"
                        value={newEmployee.role}
                        onChange={(e) =>
                          setNewEmployee({ ...newEmployee, role: e.target.value })
                        }
                      >
                        <option value="">Selecione o cargo</option>
                        <option value="Secretária">Secretária</option>
                        <option value="Auxiliar Dentista">Auxiliar Dentista</option>
                        <option value="Dentista">Dentista</option>
                        <option value="Faxineiro">Faxineiro</option>
                      </select>
                    </FormGroup>
                    <FormGroup>
                      <label>Foto:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setNewEmployee({ ...newEmployee, photo: event.target?.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {newEmployee.photo && (
                        <img
                          src={newEmployee.photo}
                          alt="Foto do Funcionário"
                          style={{ width: "100px", height: "100px", borderRadius: "8px", marginTop: "10px" }}
                        />
                      )}
                    </FormGroup>
                    <FormGroup>
                      <label>Ativo:</label>
                      <input
                        type="checkbox"
                        checked={newEmployee.active}
                        onChange={(e) =>
                          setNewEmployee({ ...newEmployee, active: e.target.checked })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Data Cadastro:</label>
                      <input
                        type="date"
                        value={newEmployee.registrationDate}
                        onChange={(e) =>
                          setNewEmployee({ ...newEmployee, registrationDate: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Chave Pix:</label>
                      <input
                        type="text"
                        value={newEmployee.pixKey}
                        onChange={(e) =>
                          setNewEmployee({ ...newEmployee, pixKey: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Acessar Painel:</label>
                      <input
                        type="checkbox"
                        checked={newEmployee.accessPanel}
                        onChange={(e) =>
                          setNewEmployee({ ...newEmployee, accessPanel: e.target.checked })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Endereço:</label>
                      <FormRow>
                        <FormGroup>
                          <label>Rua:</label>
                          <input
                            type="text"
                            value={newEmployee.address.street}
                            onChange={(e) =>
                              setNewEmployee({
                                ...newEmployee,
                                address: { ...newEmployee.address, street: e.target.value },
                              })
                            }
                          />
                        </FormGroup>
                        <FormGroup>
                          <label>Número:</label>
                          <input
                            type="text"
                            value={newEmployee.address.number}
                            onChange={(e) =>
                              setNewEmployee({
                                ...newEmployee,
                                address: { ...newEmployee.address, number: e.target.value },
                              })
                            }
                          />
                        </FormGroup>
                      </FormRow>
                      <FormRow>
                        <FormGroup>
                          <label>Complemento:</label>
                          <input
                            type="text"
                            value={newEmployee.address.complement}
                            onChange={(e) =>
                              setNewEmployee({
                                ...newEmployee,
                                address: { ...newEmployee.address, complement: e.target.value },
                              })
                            }
                          />
                        </FormGroup>
                        <FormGroup>
                          <label>Bairro:</label>
                          <input
                            type="text"
                            value={newEmployee.address.neighborhood}
                            onChange={(e) =>
                              setNewEmployee({
                                ...newEmployee,
                                address: { ...newEmployee.address, neighborhood: e.target.value },
                              })
                            }
                          />
                        </FormGroup>
                      </FormRow>
                      <FormRow>
                        <FormGroup>
                          <label>Cidade:</label>
                          <input
                            type="text"
                            value={newEmployee.address.city}
                            onChange={(e) =>
                              setNewEmployee({
                                ...newEmployee,
                                address: { ...newEmployee.address, city: e.target.value },
                              })
                            }
                          />
                        </FormGroup>
                        <FormGroup>
                          <label>Estado:</label>
                          <input
                            type="text"
                            value={newEmployee.address.state}
                            onChange={(e) =>
                              setNewEmployee({
                                ...newEmployee,
                                address: { ...newEmployee.address, state: e.target.value },
                              })
                            }
                          />
                        </FormGroup>
                        <FormGroup>
                          <label>CEP:</label>
                          <input
                            type="text"
                            value={newEmployee.address.zipCode}
                            onChange={(e) =>
                              setNewEmployee({
                                ...newEmployee,
                                address: { ...newEmployee.address, zipCode: e.target.value },
                              })
                            }
                          />
                        </FormGroup>
                      </FormRow>
                    </FormGroup>
                    <FormGroup>
                      <label>Intervalo:</label>
                      <input
                        type="text"
                        value={newEmployee.interval}
                        onChange={(e) =>
                          setNewEmployee({ ...newEmployee, interval: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>CRO:</label>
                      <input
                        type="text"
                        value={newEmployee.cro}
                        onChange={(e) =>
                          setNewEmployee({ ...newEmployee, cro: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Comissão:</label>
                      <input
                        type="number"
                        value={newEmployee.commission}
                        onChange={(e) =>
                          setNewEmployee({ ...newEmployee, commission: parseInt(e.target.value) })
                        }
                      />
                    </FormGroup>
                    <ModalActions>
                      <button type="submit" className="save">
                        Salvar
                      </button>
                      <button
                        type="button"
                        className="close"
                        onClick={handleCloseModal}
                      >
                        Cancelar
                      </button>
                    </ModalActions>
                  </form>
                </ModalContent>
              </ScrollableContainer>
            </Modal>
          </>
        )}
        {selectedEmployee && (
          <>
            <Overlay onClick={handleCloseDetails} />
            <Modal>
              <ModalHeader>
                <h3>Detalhes do Funcionário</h3>
                <button onClick={handleCloseDetails}>&times;</button>
              </ModalHeader>
              <ScrollableContainer>
                <ModalContent>
                  <p><strong>Nome:</strong> {selectedEmployee.name}</p>
                  <p><strong>Telefone:</strong> {selectedEmployee.phone}</p>
                  <p><strong>Email:</strong> {selectedEmployee.email}</p>
                  <p><strong>Cargo:</strong> {selectedEmployee.role}</p>
                  <p><strong>Foto:</strong></p>
                  <img
                    src={selectedEmployee.photo}
                    alt={selectedEmployee.name}
                    style={{ width: "100px", height: "100px", borderRadius: "8px" }}
                  />
                  <p><strong>Ativo:</strong> {selectedEmployee.active ? "Sim" : "Não"}</p>
                  <p><strong>Data Cadastro:</strong> {selectedEmployee.registrationDate}</p>
                  <p><strong>Chave Pix:</strong> {selectedEmployee.pixKey}</p>
                  <p><strong>Acessar Painel:</strong> {selectedEmployee.accessPanel ? "Sim" : "Não"}</p>
                  <p><strong>Endereço:</strong> {`${selectedEmployee.address.street}, ${selectedEmployee.address.number}, ${selectedEmployee.address.complement} - ${selectedEmployee.address.neighborhood}, ${selectedEmployee.address.city}/${selectedEmployee.address.state} - ${selectedEmployee.address.zipCode}`}</p>
                  <p><strong>Intervalo:</strong> {selectedEmployee.interval}</p>
                  <p><strong>CRO:</strong> {selectedEmployee.cro}</p>
                  <p><strong>Comissão:</strong> {selectedEmployee.commission}%</p>
                </ModalContent>
              </ScrollableContainer>
              <ModalActions>
                <button
                  className="close"
                  onClick={handleCloseDetails}
                >
                  Fechar
                </button>
              </ModalActions>
            </Modal>
          </>
        )}
      </MainContent>
    </PageWrapper>
  );
};

export default EmployeesPage;