import React, { useState } from 'react';
import './TarefasPage.css';

interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  horaAlerta: string;
  prioridade: 'Baixa' | 'Media' | 'Alta';
  status: 'Atrasada' | 'Pendente' | 'Concluida';
  operador: string;
  categoria: string;
  dataCreacao: string;
  dataConclusao?: string;
}

const TarefasPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [operadorSelecionado, setOperadorSelecionado] = useState('Hugo Freitas');

  // Estado do formulário
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data: '06/11/2025',
    hora: '',
    horaAlerta: '',
    prioridade: 'Baixa',
    categoria: 'Consulta',
    operador: 'Hugo Freitas'
  });

  // Dados fake para demonstração
  const [tarefas] = useState<Tarefa[]>([
    {
      id: 1,
      titulo: 'Consulta de Retorno - Maria Silva',
      descricao: 'Avaliar cicatrização pós cirurgia de extração do dente 38',
      data: '06/11/2025',
      hora: '09:00',
      horaAlerta: '08:45',
      prioridade: 'Alta',
      status: 'Atrasada',
      operador: 'Hugo Freitas',
      categoria: 'Consulta',
      dataCreacao: '01/11/2025',
    },
    {
      id: 2,
      titulo: 'Procedimento - João Carlos',
      descricao: 'Realizar limpeza dental e aplicação de flúor',
      data: '06/11/2025',
      hora: '10:30',
      horaAlerta: '10:15',
      prioridade: 'Media',
      status: 'Pendente',
      operador: 'Hugo Freitas',
      categoria: 'Procedimento',
      dataCreacao: '02/11/2025',
    },
    {
      id: 3,
      titulo: 'Ligação de Confirmação',
      descricao: 'Confirmar agendamento da Sra. Ana Paula para amanhã às 14h',
      data: '06/11/2025',
      hora: '15:00',
      horaAlerta: '14:45',
      prioridade: 'Baixa',
      status: 'Pendente',
      operador: 'Marina Costa',
      categoria: 'Administrativo',
      dataCreacao: '05/11/2025',
    },
    {
      id: 4,
      titulo: 'Entrega de Orçamento',
      descricao: 'Entregar orçamento de tratamento ortodôntico para Pedro Santos',
      data: '05/11/2025',
      hora: '16:00',
      horaAlerta: '15:45',
      prioridade: 'Media',
      status: 'Concluida',
      operador: 'Carlos Mendes',
      categoria: 'Comercial',
      dataCreacao: '03/11/2025',
      dataConclusao: '05/11/2025',
    },
    {
      id: 5,
      titulo: 'Compra de Material',
      descricao: 'Solicitar compra de luvas descartáveis e máscaras cirúrgicas',
      data: '07/11/2025',
      hora: '11:00',
      horaAlerta: '10:30',
      prioridade: 'Alta',
      status: 'Pendente',
      operador: 'Rafael Santos',
      categoria: 'Suprimentos',
      dataCreacao: '04/11/2025',
    },
    {
      id: 6,
      titulo: 'Revisão de Implante',
      descricao: 'Avaliar integração do implante instalado há 3 meses - Roberto Lima',
      data: '08/11/2025',
      hora: '14:30',
      horaAlerta: '14:00',
      prioridade: 'Alta',
      status: 'Pendente',
      operador: 'Hugo Freitas',
      categoria: 'Consulta',
      dataCreacao: '06/11/2025',
    },
    {
      id: 7,
      titulo: 'Atualização de Prontuário',
      descricao: 'Digitalizar e arquivar prontuários físicos dos pacientes atendidos esta semana',
      data: '06/11/2025',
      hora: '17:30',
      horaAlerta: '17:00',
      prioridade: 'Baixa',
      status: 'Pendente',
      operador: 'Ana Paula',
      categoria: 'Administrativo',
      dataCreacao: '06/11/2025',
    }
  ]);

  const operadores = [
    'Hugo Freitas',
    'Ana Paula',
    'Carlos Mendes',
    'Marina Costa',
    'Rafael Santos'
  ];

  const categorias = [
    'Consulta',
    'Procedimento',
    'Administrativo',
    'Comercial',
    'Suprimentos',
    'Emergência',
    'Manutenção',
    'Treinamento'
  ];

  const prioridades = ['Baixa', 'Media', 'Alta'];

  // Filtrar tarefas por operador
  const tarefasFiltradas = tarefas.filter(tarefa => 
    operadorSelecionado === 'Todos' || tarefa.operador === operadorSelecionado
  );

  // Contar tarefas por status
  const tarefasAtrasadas = tarefasFiltradas.filter(t => t.status === 'Atrasada').length;
  const tarefasPendentes = tarefasFiltradas.filter(t => t.status === 'Pendente').length;
  const tarefasConcluidas = tarefasFiltradas.filter(t => t.status === 'Concluida').length;

  // Navegação do calendário
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Dias vazios do mês anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatMonth = () => {
    const months = [
      'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
      'jul', 'ago', 'set', 'out', 'nov', 'dez'
    ];
    return `${months[currentDate.getMonth()]}. ${currentDate.getFullYear()}`;
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setFormData({
      titulo: '',
      descricao: '',
      data: '06/11/2025',
      hora: '',
      horaAlerta: '',
      prioridade: 'Baixa',
      categoria: 'Consulta',
      operador: operadorSelecionado
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados da tarefa:', formData);
    alert('Tarefa criada com sucesso!');
    setShowModal(false);
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Alta': return '#ef4444';
      case 'Media': return '#f59e0b';
      case 'Baixa': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Atrasada': return '#dc2626';
      case 'Pendente': return '#f59e0b';
      case 'Concluida': return '#059669';
      default: return '#6b7280';
    }
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  return (
    <div className="tarefas-page">
      <div className="tarefas-header">
        <div className="header-top">
          <div className="operador-section">
            <select 
              value={operadorSelecionado}
              onChange={(e) => setOperadorSelecionado(e.target.value)}
              className="operador-select"
            >
              <option value="Todos">Todos os Operadores</option>
              {operadores.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>
          
          <button className="btn-adicionar-tarefa" onClick={handleOpenModal}>
            + Adicionar Tarefa
          </button>
        </div>

        <div className="status-cards">
          <div className="status-card atrasadas">
            <h3>Tarefas Atrasadas</h3>
            <div className="card-number">{tarefasAtrasadas}</div>
          </div>
          <div className="status-card pendentes">
            <h3>Tarefas Pendentes</h3>
            <div className="card-number">{tarefasPendentes}</div>
          </div>
          <div className="status-card concluidas">
            <h3>Pendentes Hoje</h3>
            <div className="card-number">{tarefasPendentes}</div>
          </div>
        </div>
      </div>

      <div className="tarefas-content">
        <div className="calendar-section">
          <div className="calendar-header">
            <h3>{formatMonth()}</h3>
            <div className="calendar-nav">
              <button onClick={prevMonth} className="nav-btn">‹</button>
              <button onClick={nextMonth} className="nav-btn">›</button>
            </div>
          </div>
          
          <div className="calendar">
            <div className="calendar-weekdays">
              <div className="weekday">Dom</div>
              <div className="weekday">Seg</div>
              <div className="weekday">Ter</div>
              <div className="weekday">Qua</div>
              <div className="weekday">Qui</div>
              <div className="weekday">Sex</div>
              <div className="weekday">Sáb</div>
            </div>
            
            <div className="calendar-days">
              {getDaysInMonth().map((day, index) => (
                <div 
                  key={index} 
                  className={`calendar-day ${day ? 'active' : 'inactive'} ${isToday(day) ? 'today' : ''}`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
          
          <div className="calendar-footer">
            <p>Nenhum Registro Encontrado!</p>
          </div>
        </div>

        <div className="tarefas-list">
          <h3>Lista de Tarefas</h3>
          
          {tarefasFiltradas.length === 0 ? (
            <div className="empty-state">
              <p>Não possui nenhuma tarefa!</p>
              <small>Adicione uma nova tarefa para começar</small>
            </div>
          ) : (
            <div className="tarefas-grid">
              {tarefasFiltradas.map(tarefa => (
                <div key={tarefa.id} className={`tarefa-card ${tarefa.status.toLowerCase()}`}>
                  <div className="card-header">
                    <div className="task-info">
                      <h4>{tarefa.titulo}</h4>
                      <span className="task-time">{tarefa.hora} - {tarefa.data}</span>
                    </div>
                    <div className="badges">
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(tarefa.prioridade) }}
                      >
                        {tarefa.prioridade}
                      </span>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(tarefa.status) }}
                      >
                        {tarefa.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <p className="task-description">{tarefa.descricao}</p>
                    
                    <div className="task-details">
                      <div className="detail-row">
                        <span className="label">Operador:</span>
                        <span className="value">{tarefa.operador}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Categoria:</span>
                        <span className="value">{tarefa.categoria}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Alerta:</span>
                        <span className="value">{tarefa.horaAlerta}</span>
                      </div>
                      {tarefa.dataConclusao && (
                        <div className="detail-row">
                          <span className="label">Concluída:</span>
                          <span className="value">{tarefa.dataConclusao}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button className="btn-action view" title="Ver Detalhes">👁️</button>
                    <button className="btn-action edit" title="Editar">✏️</button>
                    {tarefa.status !== 'Concluida' && (
                      <button className="btn-action complete" title="Marcar Concluída">✓</button>
                    )}
                    <button className="btn-action delete" title="Excluir">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Nova Tarefa */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Inserir Registro</h2>
              <button className="btn-close" onClick={handleCloseModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Hora</label>
                  <input
                    type="time"
                    value={formData.hora}
                    onChange={(e) => handleInputChange('hora', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Data</label>
                  <input
                    type="text"
                    value={formData.data}
                    onChange={(e) => handleInputChange('data', e.target.value)}
                    className="form-input"
                    placeholder="06/11/2025"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Hora Alerta</label>
                  <input
                    type="time"
                    value={formData.horaAlerta}
                    onChange={(e) => handleInputChange('horaAlerta', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Prioridade</label>
                  <select 
                    value={formData.prioridade}
                    onChange={(e) => handleInputChange('prioridade', e.target.value)}
                    className="form-select"
                  >
                    {prioridades.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoria</label>
                  <select 
                    value={formData.categoria}
                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                    className="form-select"
                  >
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Operador</label>
                  <select 
                    value={formData.operador}
                    onChange={(e) => handleInputChange('operador', e.target.value)}
                    className="form-select"
                  >
                    {operadores.map(op => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Título da Tarefa</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  className="form-input"
                  placeholder="Digite o título da tarefa..."
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  className="form-textarea"
                  placeholder="Descrição da tarefa se Houver"
                  rows={4}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-save">
                  Salvar ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TarefasPage;