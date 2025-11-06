import React, { useState } from 'react';
import './HorariosPage.css';

interface HorarioFuncionamento {
  id: number;
  dia: string;
  jornadaInicio: string;
  jornadaFim: string;
  almocoInicio: string;
  almocoFim: string;
  ativo: boolean;
}

const HorariosPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [horarios, setHorarios] = useState<HorarioFuncionamento[]>([
    {
      id: 1,
      dia: 'Segunda-Feira',
      jornadaInicio: '07:00',
      jornadaFim: '18:00',
      almocoInicio: '',
      almocoFim: '',
      ativo: true
    },
    {
      id: 2,
      dia: 'Terça-Feira',
      jornadaInicio: '07:00',
      jornadaFim: '18:00',
      almocoInicio: '',
      almocoFim: '',
      ativo: true
    },
    {
      id: 3,
      dia: 'Quarta-Feira',
      jornadaInicio: '07:00',
      jornadaFim: '18:00',
      almocoInicio: '',
      almocoFim: '',
      ativo: true
    },
    {
      id: 4,
      dia: 'Quinta-Feira',
      jornadaInicio: '07:00',
      jornadaFim: '18:00',
      almocoInicio: '',
      almocoFim: '',
      ativo: true
    },
    {
      id: 5,
      dia: 'Sexta-Feira',
      jornadaInicio: '07:00',
      jornadaFim: '18:00',
      almocoInicio: '',
      almocoFim: '',
      ativo: true
    },
    {
      id: 6,
      dia: 'Sábado',
      jornadaInicio: '07:00',
      jornadaFim: '18:00',
      almocoInicio: '',
      almocoFim: '',
      ativo: true
    },
    {
      id: 7,
      dia: 'Domingo',
      jornadaInicio: '07:00',
      jornadaFim: '18:00',
      almocoInicio: '',
      almocoFim: '',
      ativo: true
    }
  ]);

  const [formData, setFormData] = useState({
    dia: 'Selecionar Dia',
    jornadaInicio: '',
    jornadaFim: '',
    almocoInicio: '',
    almocoFim: '',
    ativo: true
  });

  const diasSemana = [
    'Segunda-Feira',
    'Terça-Feira', 
    'Quarta-Feira',
    'Quinta-Feira',
    'Sexta-Feira',
    'Sábado',
    'Domingo'
  ];

  const handleOpenModal = () => {
    setShowModal(true);
    setFormData({
      dia: 'Selecionar Dia',
      jornadaInicio: '',
      jornadaFim: '',
      almocoInicio: '',
      almocoFim: '',
      ativo: true
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.dia === 'Selecionar Dia') {
      alert('Por favor, selecione um dia da semana');
      return;
    }

    const novoHorario: HorarioFuncionamento = {
      id: horarios.length + 1,
      dia: formData.dia,
      jornadaInicio: formData.jornadaInicio,
      jornadaFim: formData.jornadaFim,
      almocoInicio: formData.almocoInicio,
      almocoFim: formData.almocoFim,
      ativo: formData.ativo
    };

    // Verificar se já existe horário para este dia
    const existeHorario = horarios.find(h => h.dia === formData.dia);
    if (existeHorario) {
      // Atualizar horário existente
      setHorarios(prev => prev.map(h => 
        h.dia === formData.dia ? { ...novoHorario, id: h.id } : h
      ));
    } else {
      // Adicionar novo horário
      setHorarios(prev => [...prev, novoHorario]);
    }

    setShowModal(false);
    alert('Horário salvo com sucesso!');
  };

  const formatHorario = (inicio: string, fim: string) => {
    if (!inicio || !fim) return 'Não Lançado / Não Lançado';
    return `${inicio} / ${fim}`;
  };

  const formatAlmoco = (inicio: string, fim: string) => {
    if (!inicio || !fim) return 'Não Lançado / Não Lançado';
    return `${inicio} / ${fim}`;
  };

  const handleEdit = (horario: HorarioFuncionamento) => {
    setFormData({
      dia: horario.dia,
      jornadaInicio: horario.jornadaInicio,
      jornadaFim: horario.jornadaFim,
      almocoInicio: horario.almocoInicio,
      almocoFim: horario.almocoFim,
      ativo: horario.ativo
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este horário?');
    if (confirmDelete) {
      setHorarios(prev => prev.filter(h => h.id !== id));
    }
  };

  return (
    <div className="horarios-page">
      <div className="horarios-header">
        <div className="header-top">
          <h1 className="page-title">Horários de Funcionamento</h1>
          <button className="btn-cadastrar-horario" onClick={handleOpenModal}>
            + Cadastrar Horário
          </button>
        </div>
        
        <div className="filters-section">
          <div className="filter-item">
            <label>Dia</label>
            <select className="filter-select">
              <option>Selecionar Dia</option>
              {diasSemana.map(dia => (
                <option key={dia} value={dia}>{dia}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-item">
            <label>Data</label>
            <input type="date" className="filter-input" />
          </div>
          
          <button className="btn-salvar">Salvar</button>
        </div>
      </div>

      <div className="horarios-content">
        <div className="horarios-table-container">
          <table className="horarios-table">
            <thead>
              <tr>
                <th>Dia</th>
                <th>Jornada</th>
                <th>Almoço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {horarios.map(horario => (
                <tr key={horario.id} className={!horario.ativo ? 'inactive' : ''}>
                  <td className="dia-cell">{horario.dia}</td>
                  <td className="jornada-cell">
                    {formatHorario(horario.jornadaInicio, horario.jornadaFim)}
                  </td>
                  <td className="almoco-cell">
                    {formatAlmoco(horario.almocoInicio, horario.almocoFim)}
                  </td>
                  <td className="acoes-cell">
                    <button 
                      className="btn-action edit"
                      onClick={() => handleEdit(horario)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-action delete"
                      onClick={() => handleDelete(horario.id)}
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cadastro de Horário de Funcionamento</h2>
              <button className="btn-close" onClick={handleCloseModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Dia da Semana*</label>
                  <select 
                    value={formData.dia}
                    onChange={(e) => handleInputChange('dia', e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="Selecionar Dia">Selecionar Dia</option>
                    {diasSemana.map(dia => (
                      <option key={dia} value={dia}>{dia}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-section">
                <h3>Jornada de Trabalho</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Início*</label>
                    <input
                      type="time"
                      value={formData.jornadaInicio}
                      onChange={(e) => handleInputChange('jornadaInicio', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Final*</label>
                    <input
                      type="time"
                      value={formData.jornadaFim}
                      onChange={(e) => handleInputChange('jornadaFim', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Intervalo de Almoço</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Início</label>
                    <input
                      type="time"
                      value={formData.almocoInicio}
                      onChange={(e) => handleInputChange('almocoInicio', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Final</label>
                    <input
                      type="time"
                      value={formData.almocoFim}
                      onChange={(e) => handleInputChange('almocoFim', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.ativo}
                      onChange={(e) => handleInputChange('ativo', e.target.checked)}
                      className="form-checkbox"
                    />
                    Horário Ativo
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Salvar Horário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HorariosPage;