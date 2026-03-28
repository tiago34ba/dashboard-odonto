import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  nascimento: string;
  cpf: string;
  tipoChave: string;
  chavePix: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  nivel: string;
}

const AddUserForm: React.FC = () => {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    nome: '',
    email: '',
    telefone: '',
    nascimento: '',
    cpf: '',
    tipoChave: '',
    chavePix: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    nivel: 'Secretária', // Definindo um nível padrão inicial
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Níveis disponíveis no combobox
  const niveis = [
    'Secretária',
    'Auxiliar Dentista',
    'Dentista',
    'Faxineiro',
    'Administrador',
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    // Simulação de envio dos dados para a API para adicionar um novo usuário
    fetch('/api/users', { // Substitua pela sua API real para adicionar usuários
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json() as Promise<User>; // Espera-se que a API retorne o usuário criado com o ID
      })
      .then((data) => {
        setIsLoading(false);
        alert('Usuário adicionado com sucesso!');
        navigate('/users'); // Redirecionar para a página de usuários após o sucesso
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  };

  const handleMostrarTodosRegistros = () => {
    navigate('/users'); // Redirecionar para a página de listagem de usuários
  };

  return (
    <div>
      <h2>Adicionar Novo Usuário</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome (Obrigatório):</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={newUser.nome}
            onChange={handleChange}
            required
            placeholder="Digite o Nome"
          />
        </div>
        <div>
          <label htmlFor="email">Email (Obrigatório):</label>
          <input
            type="email"
            id="email"
            name="email"
            value={newUser.email}
            onChange={handleChange}
            required
            placeholder="Digite o Email"
          />
        </div>
        <div>
          <label htmlFor="telefone">Telefone (Obrigatório):</label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            value={newUser.telefone}
            onChange={handleChange}
            required
            placeholder="Digite o Telefone"
          />
        </div>
        <div>
          <label htmlFor="nivel">Nível:</label>
          <select
            id="nivel"
            name="nivel"
            value={newUser.nivel}
            onChange={handleChange}
          >
            {niveis.map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="nascimento">Nascimento:</label>
          <input
            type="text"
            id="nascimento"
            name="nascimento"
            value={newUser.nascimento}
            onChange={handleChange}
            placeholder="dd/mm/aaaa"
            pattern="\d{2}/\d{2}/\d{4}"
          />
        </div>
        <div>
          <label htmlFor="cpf">CPF:</label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={newUser.cpf}
            onChange={handleChange}
            placeholder="CPF"
            pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
          />
        </div>
        <div>
          <label htmlFor="tipoChave">Tipo de Chave:</label>
          <select
            id="tipoChave"
            name="tipoChave"
            value={newUser.tipoChave}
            onChange={handleChange}
          >
            <option value="">Selecionar Chave</option>
            <option value="CPF">CPF</option>
            <option value="CNPJ">CNPJ</option>
            <option value="EMAIL">Email</option>
            <option value="TELEFONE">Telefone</option>
            <option value="ALEATORIA">Aleatória</option>
          </select>
        </div>
        {newUser.tipoChave !== '' && (
          <div>
            <label htmlFor="chavePix">Chave Pix:</label>
            <input
              type="text"
              id="chavePix"
              name="chavePix"
              value={newUser.chavePix}
              onChange={handleChange}
              placeholder="Chave Pix"
            />
          </div>
        )}
        <div>
          <label htmlFor="cep">CEP:</label>
          <input
            type="text"
            id="cep"
            name="cep"
            value={newUser.cep}
            onChange={handleChange}
            placeholder="CEP"
            pattern="\d{5}-\d{3}"
          />
        </div>
        <div>
          <label htmlFor="rua">Rua:</label>
          <input
            type="text"
            id="rua"
            name="rua"
            value={newUser.rua}
            onChange={handleChange}
            placeholder="Ex. Rua Central"
          />
        </div>
        <div>
          <label htmlFor="numero">Número:</label>
          <input
            type="text"
            id="numero"
            name="numero"
            value={newUser.numero}
            onChange={handleChange}
            placeholder="1570"
          />
        </div>
        <div>
          <label htmlFor="complemento">Complemento:</label>
          <input
            type="text"
            id="complemento"
            name="complemento"
            value={newUser.complemento}
            onChange={handleChange}
            placeholder="Bloco B AP 104"
          />
        </div>
        <div>
          <label htmlFor="bairro">Bairro:</label>
          <input
            type="text"
            id="bairro"
            name="bairro"
            value={newUser.bairro}
            onChange={handleChange}
            placeholder="Bairro"
          />
        </div>
        <div>
          <label htmlFor="cidade">Cidade:</label>
          <input
            type="text"
            id="cidade"
            name="cidade"
            value={newUser.cidade}
            onChange={handleChange}
            placeholder="Cidade"
          />
        </div>
        <div>
          <label htmlFor="estado">Estado (Obrigatório):</label>
          <input
            type="text"
            id="estado"
            name="estado"
            value={newUser.estado}
            onChange={handleChange}
            required
            placeholder="Estado"
            maxLength={2}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adicionando...' : 'Adicionar Usuário'}
        </button>
      </form>
      <button onClick={handleMostrarTodosRegistros}>Mostrar todos os Registros</button>
    </div>
  );
};

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // Estado para a lista de usuários
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para o termo de busca

  const filteredUsers = users.filter((user) =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.telefone.includes(searchTerm)
  ); // Filtra os usuários com base no termo de busca

  function handleDelete(index: number): void {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers((prevUsers) => prevUsers.filter((_, i) => i !== index)); // Remove o usuário da lista local
      users.splice(index, 1); // Remove o usuário da lista local
      alert('Usuário excluído com sucesso!');
    }
  }

  function handleViewDetails(index: number): void {
    const user = users[index];
    alert(`
      Detalhes do Usuário:
      Nome: ${user.nome}
      Email: ${user.email}
      Telefone: ${user.telefone}
      Nascimento: ${user.nascimento}
      CPF: ${user.cpf}
      Tipo de Chave: ${user.tipoChave}
      Chave Pix: ${user.chavePix}
      Endereço: ${user.rua}, ${user.numero}, ${user.complemento}, ${user.bairro}, ${user.cidade} - ${user.estado}, CEP: ${user.cep}
      Nível: ${user.nivel}
    `);
  }

  function handleEdit(index: number): void {
    const userToEdit = users[index];
    const updatedName = prompt('Editar Nome:', userToEdit.nome);
    const updatedEmail = prompt('Editar Email:', userToEdit.email);
    const updatedTelefone = prompt('Editar Telefone:', userToEdit.telefone);

    if (updatedName && updatedEmail && updatedTelefone) {
      setUsers((prevUsers) =>
        prevUsers.map((user, i) =>
          i === index
            ? { ...user, nome: updatedName, email: updatedEmail, telefone: updatedTelefone }
            : user
        )
      );
      alert('Usuário atualizado com sucesso!');
    } else {
      alert('Edição cancelada ou valores inválidos.');
    }
  }

  return (
    <div>
      <div className="top-bar">
        <h2>Usuários Cadastrados</h2>
        <input
          type="text"
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="user-grid">
        <table>
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
            {filteredUsers.map((u, index) => (
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
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(index)}>Editar</button>
                    <button onClick={() => handleViewDetails(index)}>Dados</button>
                    <button className="btn-excluir" onClick={() => handleDelete(index)}>Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddUserForm;