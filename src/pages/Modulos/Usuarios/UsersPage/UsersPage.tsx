import React, { useState, ChangeEvent, FormEvent } from 'react';
import './UsersPage.css'; // Importando o arquivo CSS
import Sidebar from "../../../../components/Sidebar/Sidebar";

interface User {
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  nivel: string;
}

interface ButtonProps {
onClick: () => void;
children: React.ReactNode;
primary?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, primary }) => (
  <button onClick={onClick} className={primary ? 'primary' : ''}>
    {children}
  </button>
);

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

  const handleExport = () => {
    alert('Exportar usuários');
  };

  return (
    <div className="users-page-wrapper">
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        rel="stylesheet"
      />
      <div className="users-page" style={{ display: "flex", flexDirection: "column", height: "0vh" }}>
        <Sidebar />
      </div>
      <div className="main-content" style={{ flex: "1 1 auto", padding: "20px", display: "flex", flexDirection: "column" }}>
        <div
          className="actions"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <Button primary onClick={handleOpenModal}>
              + Cadastrar Usuário
            </Button>
            <Button onClick={handleExport}>
              Exportar
            </Button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div>
              Exibir{" "}
              <select style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ddd" }}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>{" "}
              resultados por página
            </div>
            <div>
              Buscar:{" "}
              <input
                type="text"
                style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ddd" }}
                placeholder="Digite para buscar..."
              />
            </div>
          </div>
        </div>
        <div style={{ flex: "1 1 auto", overflow: "auto", marginBottom: "20px" }}>
          <h2>Usuários Cadastrados</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>Selecionar</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Nome</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Email</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Telefone</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Cidade</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Estado</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Nível</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "10px" }}>
                    <input type="checkbox" />
                  </td>
                  <td style={{ padding: "10px" }}>{u.nome}</td>
                  <td style={{ padding: "10px" }}>{u.email}</td>
                  <td style={{ padding: "10px" }}>{u.telefone}</td>
                  <td style={{ padding: "10px" }}>{u.cidade}</td>
                  <td style={{ padding: "10px" }}>{u.estado}</td>
                  <td style={{ padding: "10px" }}>{u.nivel}</td>
                  <td style={{ padding: "10px", display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => handleEdit(index)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "4px",
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="fas fa-edit" style={{ color: "#fff" }}></i> {/* Ícone de edição */}
                    </button>
                    <button
                      onClick={() => handleViewDetails(index)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "4px",
                        background: "#6c757d",
                        color: "white",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="fas fa-eye" style={{ color: "#fff" }}></i> {/* Ícone de visualização */}
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "4px",
                        background: "#f00",
                        color: "white",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="fas fa-trash" style={{ color: "#fff" }}></i> {/* Ícone de exclusão */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="pagination"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            marginTop: "20px",
          }}
        >
          <button style={{ padding: "5px 10px", borderRadius: "4px", border: "1px solid #ddd" }}>Anterior</button>
          <span>Página 1 de 5</span>
          <button style={{ padding: "5px 10px", borderRadius: "4px", border: "1px solid #ddd" }}>Próximo</button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={handleCloseModal}>
              &times;
            </button>
            <h2>Cadastrar Usuário</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="nome">Nome:</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={user.nome}
                  onChange={handleChange}
                  placeholder="Digite o Nome"
                  required
                />
              </div>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Digite o Email"
                  required
                />
              </div>
              <div>
                <label htmlFor="telefone">Telefone:</label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={user.telefone}
                  onChange={handleChange}
                  placeholder="Digite o Telefone"
                  required
                />
              </div>
              <div>
                <label htmlFor="cidade">Cidade:</label>
                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  value={user.cidade}
                  onChange={handleChange}
                  placeholder="Digite a Cidade"
                />
              </div>
              <div>
                <label htmlFor="estado">Estado:</label>
                <input
                  type="text"
                  id="estado"
                  name="estado"
                  value={user.estado}
                  onChange={handleChange}
                  placeholder="Digite o Estado"
                />
              </div>
              <div>
                <label htmlFor="nivel">Nível:</label>
                <select
                  id="nivel"
                  name="nivel"
                  value={user.nivel}
                  onChange={handleChange}
                >
                  <option value="">Selecionar Nível</option>
                  {niveis.map((nivel) => (
                    <option key={nivel} value={nivel}>
                      {nivel}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit">Salvar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;