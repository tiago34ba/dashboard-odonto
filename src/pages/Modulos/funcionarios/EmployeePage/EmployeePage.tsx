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

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
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
    },
    {
      id: 2,
      name: "Maria Oliveira",
      phone: "(21) 88888-8888",
      email: "maria.oliveira@example.com",
      role: "Secretária",
      photo: "photo2.jpg",
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
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddEmployee = () => {
    setEmployees([...employees, { ...newEmployee, id: Date.now() }]);
    setNewEmployee({ id: 0, name: "", phone: "", email: "", role: "", photo: "" });
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
              <th>Foto</th>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Cargo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>
                  <img
                    src={employee.photo}
                    alt={employee.name}
                    style={{ width: "50px", height: "50px", borderRadius: "4px" }}
                  />
                </td>
                <td>{employee.name}</td>
                <td>{employee.phone}</td>
                <td>{employee.email}</td>
                <td>{employee.role}</td>
                <td>
                  <Actions>
                    <StyledButton color="#007bff" hoverColor="#0056b3" onClick={() => handleOpenViewModal(employee)}>
                      <i className="fas fa-eye"></i>
                    </StyledButton>
                    <StyledButton color="#ffc107" hoverColor="#e0a800" onClick={() => handleOpenEditModal(employee)}>
                      <i className="fas fa-edit"></i>
                    </StyledButton>
                    <StyledButton color="#dc3545" hoverColor="#c82333" onClick={() => handleDeleteEmployee(employee.id)}>
                      <i className="fas fa-trash"></i>
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
              <h3>Cadastrar Funcionário</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddEmployee();
                }}
              >
                <div>
                  <label>Nome:</label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Telefone:</label>
                  <input
                    type="text"
                    value={newEmployee.phone}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Email:</label>
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Cargo:</label>
                  <input
                    type="text"
                    value={newEmployee.role}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, role: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Foto (URL):</label>
                  <input
                    type="text"
                    value={newEmployee.photo}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, photo: e.target.value })
                    }
                  />
                </div>
                <Actions>
                  <StyledButton type="submit" color="#28a745" hoverColor="#218838">
                    Salvar
                  </StyledButton>
                  <StyledButton
                    type="button"
                    color="#6c757d"
                    hoverColor="#5a6268"
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </StyledButton>
                </Actions>
              </form>
            </Modal>
          </>
        )}
      </MainContent>
    </PageWrapper>
  );
};

export default EmployeesPage;