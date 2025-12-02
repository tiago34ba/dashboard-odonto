import React, { useEffect, useState } from 'react';


const UsersListPage: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    clinica: '',
    especialidade: '',
    password: ''
  });
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/users')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar usuários');
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    setRegisterError('');
    setRegisterSuccess('');
    fetch('http://127.0.0.1:8000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(async res => {
        if (!res.ok) {
          let errorMsg = 'Erro ao cadastrar usuário';
          try {
            const data = await res.json();
            if (data && data.message) errorMsg = data.message;
            if (data && data.errors) errorMsg += ': ' + JSON.stringify(data.errors);
          } catch (e) {
            errorMsg += ' (Erro ao ler resposta do backend)';
          }
          throw new Error(errorMsg);
        }
        return res.json();
      })
      .then((data) => {
        setForm({ nome: '', sobrenome: '', email: '', telefone: '', clinica: '', especialidade: '', password: '' });
        setRegisterSuccess(data.message || 'Usuário cadastrado com sucesso!');
        fetchUsers();
      })
      .catch(err => {
        setRegisterError(err.message);
      })
      .finally(() => setRegistering(false));
  };

  if (loading) return <div>Carregando usuários...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div style={{ padding: 32 }}>
      <h2>Lista de Usuários</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24, background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
        <h3>Cadastrar Novo Usuário</h3>
        <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required style={{ marginRight: 8 }} />
        <input name="sobrenome" placeholder="Sobrenome" value={form.sobrenome} onChange={handleChange} required style={{ marginRight: 8 }} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ marginRight: 8 }} />
        <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} style={{ marginRight: 8 }} />
        <input name="clinica" placeholder="Clínica" value={form.clinica} onChange={handleChange} style={{ marginRight: 8 }} />
        <input name="especialidade" placeholder="Especialidade" value={form.especialidade} onChange={handleChange} style={{ marginRight: 8 }} />
        <input name="password" type="password" placeholder="Senha" value={form.password} onChange={handleChange} required style={{ marginRight: 8 }} />
        <button type="submit" disabled={registering} style={{ marginTop: 8 }}>
          {registering ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        {registerSuccess && <div style={{ color: 'green', marginTop: 8 }}>{registerSuccess}</div>}
        {registerError && <div style={{ color: 'red', marginTop: 8 }}>{registerError}</div>}
      </form>
      <table border={1} cellPadding={8} style={{ width: '100%', background: '#fff' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Clínica</th>
            <th>Especialidade</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nome}</td>
              <td>{user.sobrenome}</td>
              <td>{user.email}</td>
              <td>{user.telefone}</td>
              <td>{user.clinica}</td>
              <td>{user.especialidade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersListPage;
