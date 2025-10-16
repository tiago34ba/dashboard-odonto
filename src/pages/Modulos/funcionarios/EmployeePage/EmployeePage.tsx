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
  justify-content: center;
  gap: 5px;
  background-color: ${(props) => props.color || "#007bff"};
  color: white;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${(props) => props.hoverColor || "#0056b3"};
    transform: scale(1.05);
  }

  i {
    font-size: 16px;
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
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  background-color: #f8f9fa;

  h3 {
    font-size: 20px;
    color: #333;
    margin: 0;
    font-weight: 600;
  }

  button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #999;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;

    &:hover {
      color: #333;
      background-color: #e9ecef;
    }
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
`;

const ScrollableContainer = styled.div`
  padding: 24px;
  max-height: calc(90vh - 140px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #999;
  }
`;

const ModalFooter = styled.div`
  padding: 20px 24px;
  border-top: 1px solid #e9ecef;
  background-color: #f8f9fa;
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  button {
    padding: 12px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    min-width: 100px;

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

const FormSection = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  color: #495057;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e9ecef;
  font-weight: 600;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 14px;
    font-weight: 500;
    color: #495057;
  }

  input,
  select {
    padding: 12px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 6px;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: #007bff;
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
  }

  &.full-width {
    grid-column: 1 / -1;
  }

  &.checkbox {
    flex-direction: row;
    align-items: center;
    gap: 8px;

    input[type="checkbox"] {
      width: auto;
      margin: 0;
    }
  }
`;

const PhotoPreview = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
    border: 2px solid #e9ecef;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
`;

const InfoItem = styled.div`
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #007bff;

  strong {
    display: block;
    color: #495057;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }

  span {
    color: #212529;
    font-size: 14px;
    line-height: 1.4;
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

        {/* Modal de Cadastro */}
        {isModalOpen && (
          <>
            <Overlay onClick={handleCloseModal} />
            <Modal>
              <ModalHeader>
                <h3>Cadastrar Funcionário</h3>
                <button onClick={handleCloseModal}>&times;</button>
              </ModalHeader>
              <ModalBody>
                <ScrollableContainer>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddEmployee();
                    }}
                  >
                    {/* Informações Básicas */}
                    <FormSection>
                      <SectionTitle>Informações Básicas</SectionTitle>
                      <FormGrid>
                        <FormGroup>
                          <label>Nome:</label>
                          <input
                            type="text"
                            value={newEmployee.name}
                            onChange={(e) =>
                              setNewEmployee({ ...newEmployee, name: e.target.value })
                            }
                            required
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
                            required
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
                            required
                          />
                        </FormGroup>
                        <FormGroup>
                          <label>Cargo:</label>
                          <select
                            value={newEmployee.role}
                            onChange={(e) =>
                              setNewEmployee({ ...newEmployee, role: e.target.value })
                            }
                            required
                          >
                            <option value="">Selecione o cargo</option>
                            <option value="Secretária">Secretária</option>
                            <option value="Auxiliar Dentista">Auxiliar Dentista</option>
                            <option value="Dentista">Dentista</option>
                            <option value="Faxineiro">Faxineiro</option>
                          </select>
                        </FormGroup>
                        <FormGroup>
                          <label>Data Cadastro:</label>
                          <input
                            type="date"
                            value={newEmployee.registrationDate}
                            onChange={(e) =>
                              setNewEmployee({ ...newEmployee, registrationDate: e.target.value })
                            }
                            required
                          />
                        </FormGroup>
                      </FormGrid>
                    </FormSection>

                    {/* Foto */}
                    <FormSection>
                      <SectionTitle>Foto do Funcionário</SectionTitle>
                      <FormGroup className="full-width">
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
                          <PhotoPreview>
                            <img src={newEmployee.photo} alt="Foto do Funcionário" />
                            <span>Foto carregada com sucesso</span>
                          </PhotoPreview>
                        )}
                      </FormGroup>
                    </FormSection>

                    {/* Endereço */}
                    <FormSection>
                      <SectionTitle>Endereço</SectionTitle>
                      <FormGrid>
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
                      </FormGrid>
                    </FormSection>

                    {/* Configurações Profissionais */}
                    <FormSection>
                      <SectionTitle>Configurações Profissionais</SectionTitle>
                      <FormGrid>
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
                          <label>Intervalo:</label>
                          <input
                            type="text"
                            value={newEmployee.interval}
                            onChange={(e) =>
                              setNewEmployee({ ...newEmployee, interval: e.target.value })
                            }
                            placeholder="Ex: 30 Minutos"
                          />
                        </FormGroup>
                        <FormGroup>
                          <label>Comissão (%):</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={newEmployee.commission}
                            onChange={(e) =>
                              setNewEmployee({ ...newEmployee, commission: parseInt(e.target.value) || 0 })
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
                            placeholder="Email, telefone ou CPF"
                          />
                        </FormGroup>
                      </FormGrid>
                    </FormSection>

                    {/* Configurações do Sistema */}
                    <FormSection>
                      <SectionTitle>Configurações do Sistema</SectionTitle>
                      <FormGrid>
                        <FormGroup className="checkbox">
                          <input
                            type="checkbox"
                            id="active"
                            checked={newEmployee.active}
                            onChange={(e) =>
                              setNewEmployee({ ...newEmployee, active: e.target.checked })
                            }
                          />
                          <label htmlFor="active">Funcionário ativo</label>
                        </FormGroup>
                        <FormGroup className="checkbox">
                          <input
                            type="checkbox"
                            id="accessPanel"
                            checked={newEmployee.accessPanel}
                            onChange={(e) =>
                              setNewEmployee({ ...newEmployee, accessPanel: e.target.checked })
                            }
                          />
                          <label htmlFor="accessPanel">Pode acessar o painel administrativo</label>
                        </FormGroup>
                      </FormGrid>
                    </FormSection>
                  </form>
                </ScrollableContainer>
              </ModalBody>
              <ModalFooter>
                <button type="button" className="close" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="save" onClick={handleAddEmployee}>
                  Salvar Funcionário
                </button>
              </ModalFooter>
            </Modal>
          </>
        )}

        {/* Modal de Visualização */}
        {selectedEmployee && (
          <>
            <Overlay onClick={handleCloseDetails} />
            <Modal>
              <ModalHeader>
                <h3>Detalhes do Funcionário</h3>
                <button onClick={handleCloseDetails}>&times;</button>
              </ModalHeader>
              <ModalBody>
                <ScrollableContainer>
                  <FormSection>
                    <SectionTitle>Informações Pessoais</SectionTitle>
                    <InfoGrid>
                      <InfoItem>
                        <strong>Nome</strong>
                        <span>{selectedEmployee.name}</span>
                      </InfoItem>
                      <InfoItem>
                        <strong>Telefone</strong>
                        <span>{selectedEmployee.phone}</span>
                      </InfoItem>
                      <InfoItem>
                        <strong>Email</strong>
                        <span>{selectedEmployee.email}</span>
                      </InfoItem>
                      <InfoItem>
                        <strong>Cargo</strong>
                        <span>{selectedEmployee.role}</span>
                      </InfoItem>
                      <InfoItem>
                        <strong>Data de Cadastro</strong>
                        <span>{selectedEmployee.registrationDate}</span>
                      </InfoItem>
                      <InfoItem>
                        <strong>Status</strong>
                        <span>{selectedEmployee.active ? "Ativo" : "Inativo"}</span>
                      </InfoItem>
                    </InfoGrid>
                  </FormSection>

                  {selectedEmployee.photo && (
                    <FormSection>
                      <SectionTitle>Foto</SectionTitle>
                      <PhotoPreview>
                        <img src={selectedEmployee.photo} alt={selectedEmployee.name} />
                      </PhotoPreview>
                    </FormSection>
                  )}

                  <FormSection>
                    <SectionTitle>Endereço</SectionTitle>
                    <InfoGrid>
                      <InfoItem>
                        <strong>CEP</strong>
                        <span>{selectedEmployee.address.zipCode}</span>
                      </InfoItem>
                      <InfoItem>
                        <strong>Rua</strong>
                        <span>{selectedEmployee.address.street}</span>
                      </InfoItem>
                      <InfoItem>
                        <strong>Número</strong>
                        <span>{selectedEmployee.address.number}</span>
                      </InfoItem>
                      <InfoItem>
                        <strong>Complemento</strong>
                        <span>{selectedEmployee.address.complement || "Não informado"}</span>
                      </InfoItem>
                      <InfoItem>
                        <strong>Bairro</strong>
                        <span>{selectedEmployee.address.neighborhood}</span>
                      </InfoItem>
                      <InfoItem>
                        <strong>Cidade/Estado</strong>
                        <span>{selectedEmployee.address.city}/{selectedEmployee.address.state}</span>
                      </InfoItem>
                    </InfoGrid>
                  </FormSection>

                  <FormSection>
                    <SectionTitle>Informações Profissionais</SectionTitle>
                    <InfoGrid>
                      <InfoItem>
                        <strong>CRO</strong>
                        <span>{selectedEmployee.cro || "Não se aplica"}</span>
                      </InfoItem>
                      <InfoItem>
                        <strong>Intervalo</strong>
                        <span>{selectedEmployee.interval}</span>
                      </InfoItem>
                      <InfoItem>
                        <strong>Comissão</strong>
                        <span>{selectedEmployee.commission}%</span>
                      </InfoItem>
                      <InfoItem>
                        <strong>Chave Pix</strong>
                        <span>{selectedEmployee.pixKey}</span>
                      </InfoItem>
                      <InfoItem>
                        <strong>Acesso ao Painel</strong>
                        <span>{selectedEmployee.accessPanel ? "Sim" : "Não"}</span>
                      </InfoItem>
                    </InfoGrid>
                  </FormSection>
                </ScrollableContainer>
              </ModalBody>
              <ModalFooter>
                <button className="close" onClick={handleCloseDetails}>
                  Fechar
                </button>
              </ModalFooter>
            </Modal>
          </>
        )}
      </MainContent>
    </PageWrapper>
  );
};

export default EmployeesPage;