import React, { useState } from 'react';

// Gerador de consultas fake
function gerarConsultasFake() {
  const nomes = [
    'João Silva', 'Maria Souza', 'Carlos Oliveira', 'Ana Lima', 'Pedro Martins',
    'Fernanda Costa', 'Lucas Rocha', 'Juliana Alves', 'Rafael Mendes', 'Patrícia Ramos',
    'Bruno Teixeira', 'Camila Duarte', 'Eduardo Pinto', 'Larissa Gomes', 'Fábio Castro',
    'Isabela Freitas', 'Gustavo Lopes', 'Renata Barros', 'Thiago Moreira', 'Aline Carvalho'
  ];
  const especialidades = [
    'Dentista', 'Ortodentista', 'Endodontista', 'Periodontista', 'Protesista'
  ];
  const status = ['Agendada', 'Confirmada', 'Finalizada'];
  const consultas = [];
  for (let i = 0; i < 20; i++) {
    const dia = Math.floor(Math.random() * 28) + 1;
    const mes = Math.floor(Math.random() * 12) + 1;
    const ano = 2025;
    consultas.push({
      id: i + 1,
      paciente: nomes[i],
      especialidade: especialidades[Math.floor(Math.random() * especialidades.length)],
      data: `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano}`,
      status: status[Math.floor(Math.random() * status.length)]
    });
  }
  return consultas;
}

const todasConsultas = gerarConsultasFake();

const ConsultaPage: React.FC = () => {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todas');

  // Exibe todos os dados fakes de consultas, ignorando filtros
  const consultasFiltradas = todasConsultas;

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
        <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />
        <div style={{ marginLeft: 16 }}>
          Todas /{' '}
          <span style={{ color: 'red', cursor: 'pointer' }} onClick={() => setFiltroStatus('Agendada')}>Agendadas</span> /{' '}
          <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setFiltroStatus('Confirmada')}>Confirmadas</span> /{' '}
          <span style={{ color: 'green', cursor: 'pointer' }} onClick={() => setFiltroStatus('Finalizada')}>Finalizadas</span>
        </div>
      </div>
      {consultasFiltradas.length === 0 ? (
        <div>Não possui nenhum registro Cadastrado!</div>
      ) : (
        <table border={1} cellPadding={8} style={{ width: '100%', background: '#fff' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Especialidade</th>
              <th>Data</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {consultasFiltradas.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.paciente}</td>
                <td>{c.especialidade}</td>
                <td>{c.data}</td>
                <td style={{ color: c.status === 'Agendada' ? 'red' : c.status === 'Confirmada' ? 'blue' : 'green' }}>{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ConsultaPage;
