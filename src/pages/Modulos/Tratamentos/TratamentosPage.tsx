import React, { useState } from 'react';
import './TratamentosPage.css';

interface Tratamento {
  id: number;
  paciente: string;
  profissional: string;
  procedimento: string;
  dataInicio: string;
  dataFim: string;
  frequencia: string;
  status: 'Em Andamento' | 'Concluído' | 'Pausado' | 'Cancelado';
  valor: number;
  observacoes?: string;
  horarios: {
    segunda: string;
    terca: string;
    quarta: string;
    quinta: string;
    sexta: string;
    sabado: string;
    domingo: string;
  };
}

const TratamentosPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [dataInicio, setDataInicio] = useState('01/11/2025');
  const [dataFim, setDataFim] = useState('30/11/2025');
  const [profissionalSelecionado, setProfissionalSelecionado] = useState('Selecionar Profissional');

  // Dados fake para demonstração
  const [tratamentos] = useState<Tratamento[]>([
    {
      id: 1,
      paciente: 'Maria Silva Santos',
      profissional: 'Dr. Hugo Freitas',
      procedimento: 'Tratamento Ortodôntico Completo',
      dataInicio: '01/11/2025',
      dataFim: '01/05/2026',
      frequencia: 'Quinzenal',
      status: 'Em Andamento',
      valor: 3500.00,
      observacoes: 'Paciente com boa evolução no tratamento',
      horarios: {
        segunda: '08:00',
        terca: '',
        quarta: '14:00',
        quinta: '',
        sexta: '09:00',
        sabado: '',
        domingo: ''
      }
    },
    {
      id: 2,
      paciente: 'João Carlos Oliveira',
      profissional: 'Dra. Ana Paula',
      procedimento: 'Implante Dentário Unitário',
      dataInicio: '15/10/2025',
      dataFim: '15/12/2025',
      frequencia: 'Semanal',
      status: 'Em Andamento',
      valor: 2800.00,
      observacoes: 'Primeira etapa do implante concluída',
      horarios: {
        segunda: '',
        terca: '10:00',
        quarta: '',
        quinta: '15:00',
        sexta: '',
        sabado: '08:30',
        domingo: ''
      }
    },
    {
      id: 3,
      paciente: 'Ana Costa Lima',
      profissional: 'Dr. Carlos Mendes',
      procedimento: 'Clareamento Dental + Facetas',
      dataInicio: '20/09/2025',
      dataFim: '20/11/2025',
      frequencia: 'Mensal',
      status: 'Concluído',
      valor: 1500.00,
      observacoes: 'Tratamento finalizado com sucesso',
      horarios: {
        segunda: '16:00',
        terca: '',
        quarta: '',
        quinta: '11:00',
        sexta: '',
        sabado: '',
        domingo: ''
      }
    },
    {
      id: 4,
      paciente: 'Pedro Santos Silva',
      profissional: 'Dr. Hugo Freitas',
      procedimento: 'Tratamento de Canal + Coroa',
      dataInicio: '05/11/2025',
      dataFim: '05/01/2026',
      frequencia: 'Semanal',
      status: 'Em Andamento',
      valor: 1200.00,
      observacoes: 'Paciente sensível, requer anestesia extra',
      horarios: {
        segunda: '',
        terca: '',
        quarta: '13:30',
        quinta: '',
        sexta: '16:00',
        sabado: '',
        domingo: ''
      }
    },
    {
      id: 5,
      paciente: 'Luciana Ferreira',
      profissional: 'Dra. Marina Costa',
      procedimento: 'Cirurgia Periodontal',
      dataInicio: '25/10/2025',
      dataFim: '25/12/2025',
      frequencia: 'Quinzenal',
      status: 'Pausado',
      valor: 2200.00,
      observacoes: 'Tratamento pausado por viagem da paciente',
      horarios: {
        segunda: '07:30',
        terca: '',
        quarta: '',
        quinta: '14:30',
        sexta: '',
        sabado: '10:00',
        domingo: ''
      }
    }
  ]);

  // Estado do formulário do modal
  const [formData, setFormData] = useState({
    paciente: 'Selecione um Paciente',
    profissional: 'Selecione um Profissional',
    procedimento: '',
    dataInicio: '',
    dataFim: '',
    frequencia: '1',
    horarios: {
      segunda: '',
      terca: '',
      quarta: '',
      quinta: '',
      sexta: '',
      sabado: '',
      domingo: ''
    }
  });

  const pacientes = [
    'Maria Silva Santos',
    'João Carlos Oliveira',
    'Ana Costa Lima',
    'Pedro Santos Silva',
    'Luciana Ferreira',
    'Carlos Alberto',
    'Fernanda Lima'
  ];

  const profissionais = [
    'Dr. Hugo Freitas',
    'Dra. Ana Paula',
    'Dr. Carlos Mendes',
    'Dra. Marina Costa',
    'Dr. Rafael Santos'
  ];

  const frequencias = [
    { value: '1', label: 'Diária' },
    { value: '2', label: 'Semanal' },
    { value: '3', label: 'Quinzenal' },
    { value: '4', label: 'Mensal' },
    { value: '5', label: 'Trimestral' }
  ];

  const diasSemana = [
    { key: 'segunda', label: 'Segunda' },
    { key: 'terca', label: 'Terça' },
    { key: 'quarta', label: 'Quarta' },
    { key: 'quinta', label: 'Quinta' },
    { key: 'sexta', label: 'Sexta' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ];

  const filteredTratamentos = tratamentos.filter(tratamento => {
    const matchProfissional = profissionalSelecionado === 'Selecionar Profissional' || 
                             tratamento.profissional === profissionalSelecionado;
    return matchProfissional;
  });

  const handleOpenModal = () => {
    setShowModal(true);
    setFormData({
      paciente: 'Selecione um Paciente',
      profissional: 'Selecione um Profissional',
      procedimento: '',
      dataInicio: '',
      dataFim: '',
      frequencia: '1',
      horarios: {
        segunda: '',
        terca: '',
        quarta: '',
        quinta: '',
        sexta: '',
        sabado: '',
        domingo: ''
      }
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

  const handleHorarioChange = (dia: string, horario: string) => {
    setFormData(prev => ({
      ...prev,
      horarios: {
        ...prev.horarios,
        [dia]: horario
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.paciente === 'Selecione um Paciente' || 
        formData.profissional === 'Selecione um Profissional') {
      alert('Por favor, selecione paciente e profissional');
      return;
    }

    console.log('Dados do tratamento:', formData);
    alert('Tratamento cadastrado com sucesso!');
    setShowModal(false);
  };

  const handleGenerateReport = () => {
    // Simular geração de PDF
    const element = document.createElement('a');
    const content = `
Relatório de Tratamentos - ${new Date().toLocaleDateString('pt-BR')}

Período: ${dataInicio} a ${dataFim}
Profissional: ${profissionalSelecionado}

RESUMO:
- Total de tratamentos: ${filteredTratamentos.length}
- Em andamento: ${filteredTratamentos.filter(t => t.status === 'Em Andamento').length}
- Concluídos: ${filteredTratamentos.filter(t => t.status === 'Concluído').length}
- Pausados: ${filteredTratamentos.filter(t => t.status === 'Pausado').length}

DETALHES DOS TRATAMENTOS:
${filteredTratamentos.map(t => `
- Paciente: ${t.paciente}
- Profissional: ${t.profissional}
- Procedimento: ${t.procedimento}
- Período: ${t.dataInicio} a ${t.dataFim}
- Status: ${t.status}
- Valor: R$ ${t.valor.toFixed(2).replace('.', ',')}
- Observações: ${t.observacoes || 'Nenhuma'}
`).join('\n')}

Relatório gerado em: ${new Date().toLocaleString('pt-BR')}
    `;
    
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `relatorio-tratamentos-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    alert('Relatório baixado com sucesso!');
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Em Andamento': 'status-andamento',
      'Concluído': 'status-concluido',
      'Pausado': 'status-pausado',
      'Cancelado': 'status-cancelado'
    };
    
    return statusClasses[status as keyof typeof statusClasses] || 'status-andamento';
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="tratamentos-page">
      <div className="tratamentos-header">
        <div className="header-controls">
          <button className="btn-novo-tratamento" onClick={handleOpenModal}>
            + Tratamento
          </button>
          
          <div className="date-controls">
            <div className="date-input-group">
              <label>📅</label>
              <input
                type="text"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                placeholder="DD/MM/AAAA"
                className="date-input"
              />
            </div>
            
            <div className="date-input-group">
              <label>📅</label>
              <input
                type="text"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                placeholder="DD/MM/AAAA"
                className="date-input"
              />
            </div>
            
            <div className="profissional-select">
              <select 
                value={profissionalSelecionado}
                onChange={(e) => setProfissionalSelecionado(e.target.value)}
                className="select-profissional"
              >
                <option value="Selecionar Profissional">Selecionar Profissional</option>
                {profissionais.map(prof => (
                  <option key={prof} value={prof}>{prof}</option>
                ))}
              </select>
            </div>
            
            <button className="btn-relatorio" onClick={handleGenerateReport}>
              📄 Relatório
            </button>
          </div>
        </div>
      </div>

      <div className="tratamentos-content">
        {filteredTratamentos.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum Registro Encontrado!</p>
            <small>Ajuste os filtros ou adicione novos tratamentos</small>
          </div>
        ) : (
          <div className="tratamentos-grid">
            {filteredTratamentos.map(tratamento => (
              <div key={tratamento.id} className="tratamento-card">
                <div className="card-header">
                  <h3>{tratamento.paciente}</h3>
                  <span className={`status-badge ${getStatusBadge(tratamento.status)}`}>
                    {tratamento.status}
                  </span>
                </div>
                
                <div className="card-body">
                  <div className="info-row">
                    <span className="label">Profissional:</span>
                    <span className="value">{tratamento.profissional}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Procedimento:</span>
                    <span className="value">{tratamento.procedimento}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Período:</span>
                    <span className="value">{tratamento.dataInicio} - {tratamento.dataFim}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Frequência:</span>
                    <span className="value">{tratamento.frequencia}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Valor:</span>
                    <span className="value price">{formatCurrency(tratamento.valor)}</span>
                  </div>
                  
                  {tratamento.observacoes && (
                    <div className="info-row">
                      <span className="label">Observações:</span>
                      <span className="value">{tratamento.observacoes}</span>
                    </div>
                  )}
                </div>
                
                <div className="card-actions">
                  <button className="btn-action edit" title="Editar">✏️</button>
                  <button className="btn-action delete" title="Excluir">🗑️</button>
                  <button className="btn-action view" title="Visualizar">👁️</button>
                  <button className="btn-action calendar" title="Agendar">📅</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Novo Tratamento */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content-tratamento" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Inserir Registro</h2>
              <button className="btn-close" onClick={handleCloseModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row-top">
                <div className="form-group">
                  <label>Paciente</label>
                  <select 
                    value={formData.paciente}
                    onChange={(e) => handleInputChange('paciente', e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="Selecione um Paciente">Selecione um Paciente</option>
                    {pacientes.map(paciente => (
                      <option key={paciente} value={paciente}>{paciente}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Profissional</label>
                  <select 
                    value={formData.profissional}
                    onChange={(e) => handleInputChange('profissional', e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="Selecione um Profissional">Selecione um Profissional</option>
                    {profissionais.map(prof => (
                      <option key={prof} value={prof}>{prof}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Procedimento</label>
                  <input
                    type="text"
                    value={formData.procedimento}
                    onChange={(e) => handleInputChange('procedimento', e.target.value)}
                    className="form-input"
                    placeholder="Descreva o procedimento..."
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data Inicial</label>
                  <input
                    type="text"
                    value={formData.dataInicio}
                    onChange={(e) => handleInputChange('dataInicio', e.target.value)}
                    className="form-input"
                    placeholder="dd/mm/aaaa"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Data Final</label>
                  <input
                    type="text"
                    value={formData.dataFim}
                    onChange={(e) => handleInputChange('dataFim', e.target.value)}
                    className="form-input"
                    placeholder="dd/mm/aaaa"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Frequência</label>
                  <select 
                    value={formData.frequencia}
                    onChange={(e) => handleInputChange('frequencia', e.target.value)}
                    className="form-select"
                  >
                    {frequencias.map(freq => (
                      <option key={freq.value} value={freq.value}>{freq.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="horarios-section">
                <h3>Horários da Semana</h3>
                <div className="horarios-grid">
                  {diasSemana.map(dia => (
                    <div key={dia.key} className="horario-item">
                      <label>{dia.label}</label>
                      <input
                        type="time"
                        value={formData.horarios[dia.key as keyof typeof formData.horarios]}
                        onChange={(e) => handleHorarioChange(dia.key, e.target.value)}
                        className="horario-input"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-save">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TratamentosPage;