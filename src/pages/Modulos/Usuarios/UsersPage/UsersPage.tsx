import React, { useState, ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
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
  width: 80%;
  max-width: 600px;
  max-height: 80vh;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
`;

interface User {
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  nivel: string;
}

const UsersPage: React.FC = () => {
  const [user, setUser] = useState<User>({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    estado: '',
    nivel: '',
  });

  const [users, setUsers] = useState<User[]>([
    {
      nome: 'João Silva',
      email: 'joao.silva@example.com',
      telefone: '(11) 98765-4321',
      cidade: 'São Paulo',
      estado: 'SP',
      nivel: 'Administrador',
    },
    {
      nome: 'Maria Oliveira',
      email: 'maria.oliveira@example.com',
      telefone: '(21) 91234-5678',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      nivel: 'Dentista',
    },
    {
      nome: 'Carlos Souza',
      email: 'carlos.souza@example.com',
      telefone: '(31) 99876-5432',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      nivel: 'Auxiliar Dentista',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const niveis = ['Secretário', 'Auxiliar Dentista', 'Dentista', 'Faxineiro', 'Administrador'];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setUsers([...users, user]);
    setUser({
      nome: '',
      email: '',
      telefone: '',
      cidade: '',
      estado: '',
      nivel: '',
    });
    setIsModalOpen(false);
    alert('Usuário cadastrado com sucesso!');
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEdit = (index: number) => {
    alert(`Editar usuário: ${users[index].nome}`);
  };

  const handleViewDetails = (index: number) => {
    alert(`Exibindo detalhes do usuário: ${users[index].nome}`);
  };

  const handleDelete = (index: number) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário ${users[index].nome}?`)) {
      const updatedUsers = users.filter((_, i) => i !== index);
      setUsers(updatedUsers);
      alert('Usuário excluído com sucesso!');
    }
  };

  const handleExport = (format: "excel" | "xml") => {
    if (format === "excel") {
      // Exportar para Excel
      const worksheet = XLSX.utils.json_to_sheet(users); // Converte os dados para uma planilha
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Usuários");
      XLSX.writeFile(workbook, "usuarios.xlsx"); // Salva o arquivo como Excel
    } else if (format === "xml") {
      // Exibir os dados no formato JSON no console
      console.log("Dados dos Usuários (JSON):", JSON.stringify(users, null, 2));

      // Exportar para XML com quebras de linha
      const xmlData = users
        .map((user) => {
          return `
          <Usuario>
            <Nome>${user.nome}</Nome>
            <Email>${user.email}</Email>
            <Telefone>${user.telefone}</Telefone>
            <Cidade>${user.cidade}</Cidade>
            <Estado>${user.estado}</Estado>
            <Nivel>${user.nivel}</Nivel>
          </Usuario>`;
        })
        .join("\n"); // Adiciona quebra de linha entre os usuários

      const xmlFile = `<?xml version="1.0" encoding="UTF-8"?>
<Usuarios>
${xmlData}
</Usuarios>`;

      // Gera o arquivo XML e força o download
      const blob = new Blob([xmlFile.trim()], { type: "application/octet-stream" }); // Define o tipo como "octet-stream"
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "usuarios.xml";
      link.click();
    }
  };

  const handleExportToExcel = () => handleExport("excel");
  const handleExportToXML = () => handleExport("xml");

  return (
    <PageWrapper>
      <MainContent>
        <Header>
          <Title>Usuários Cadastrados</Title>
          <Actions>
            <StyledButton color="#007bff" hoverColor="#0056b3" onClick={handleOpenModal}>
              <i className="fas fa-plus"></i> Cadastrar Usuário
            </StyledButton>
            <StyledButton color="#28a745" hoverColor="#218838" onClick={handleExportToExcel}>
              <i className="fas fa-file-excel"></i> Exportar para Excel
            </StyledButton>
            <StyledButton color="#17a2b8" hoverColor="#138496" onClick={handleExportToXML}>
              <i className="fas fa-file-code"></i> Exportar para XML
            </StyledButton>
          </Actions>
        </Header>
        <Table>
          <thead>
            <tr>
              <th>Selecionar</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Cidade</th>
              <th>Estado</th>
              <th>Nível</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={index}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td>{u.telefone}</td>
                <td>{u.cidade}</td>
                <td>{u.estado}</td>
                <td>{u.nivel}</td>
                <td style={{ display: "flex", gap: "10px" }}>
                  <StyledButton color="#007bff" hoverColor="#0056b3" onClick={() => handleEdit(index)}>
                    <i className="fas fa-edit"></i>
                  </StyledButton>
                  <StyledButton color="#6c757d" hoverColor="#5a6268" onClick={() => handleViewDetails(index)}>
                    <i className="fas fa-eye"></i>
                  </StyledButton>
                  <StyledButton color="#f00" hoverColor="#c00" onClick={() => handleDelete(index)}>
                    <i className="fas fa-trash"></i>
                  </StyledButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {isModalOpen && (
          <>
            <ModalOverlay onClick={handleCloseModal} />
            <ModalContent>
              <h3>Cadastrar Usuário</h3>
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Nome:</label>
                  <input type="text" name="nome" value={user.nome} onChange={handleChange} />
                </div>
                <div>
                  <label>Email:</label>
                  <input type="email" name="email" value={user.email} onChange={handleChange} />
                </div>
                <div>
                  <label>Telefone:</label>
                  <input type="tel" name="telefone" value={user.telefone} onChange={handleChange} />
                </div>
                <div>
                  <label>Cidade:</label>
                  <input type="text" name="cidade" value={user.cidade} onChange={handleChange} />
                </div>
                <div>
                  <label>Estado:</label>
                  <input type="text" name="estado" value={user.estado} onChange={handleChange} />
                </div>
                <div>
                  <label>Nível:</label>
                  <select name="nivel" value={user.nivel} onChange={handleChange}>
                    <option value="">Selecionar</option>
                    {niveis.map((nivel) => (
                      <option key={nivel} value={nivel}>
                        {nivel}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit">Salvar</button>
              </form>
            </ModalContent>
          </>
        )}
      </MainContent>
    </PageWrapper>
  );
};

export default UsersPage;