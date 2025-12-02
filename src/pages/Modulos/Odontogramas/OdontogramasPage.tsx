import React, { useState } from 'react';
import './OdontogramasPage.css';

interface Odontograma {
  id: number;
  paciente: string;
  descricao: string;
  data: string;
  evolutivo: 'Não' | 'Sim';
  profissional: string;
  status: 'Ativo' | 'Inativo';
}

interface DenteInfo {
  numero: number;
  acao: string;
  procedimento: string;
  observacao: string;
}

const OdontogramasPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showResultsPerPage, setShowResultsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dados fake para demonstração
  const [odontogramas] = useState<Odontograma[]>([
    {
      id: 1,
      paciente: 'Cliente 1',
      descricao: 'Orçamento Prótese e Aparelho',
      data: '31/10/2024',
      evolutivo: 'Não',
      profissional: 'Hugo Freitas',
      status: 'Ativo'
    },
    {
      id: 2,
      paciente: 'xxxxxxxxxxxx',
      descricao: 'fdsfdsfdfdfd',
      data: '31/10/2024',
      evolutivo: 'Sim',
      profissional: 'Hugo Freitas',
      status: 'Ativo'
    },
    {
      id: 3,
      paciente: 'Cliente 3',
      descricao: 'Teste cli 3',
      data: '31/10/2024',
      evolutivo: 'Sim',
      profissional: 'Hugo Freitas',
      status: 'Ativo'
    },
    {
      id: 4,
      paciente: 'Cliente 1',
      descricao: 'Orçamento Prótese',
      data: '31/10/2024',
      evolutivo: 'Não',
      profissional: 'Hugo Freitas',
      status: 'Ativo'
    },
    {
      id: 5,
      paciente: 'Cliente 22',
      descricao: 'Teste c22',
      data: '30/10/2024',
      evolutivo: 'Sim',
      profissional: 'Hugo Freitas',
      status: 'Ativo'
    },
    {
      id: 6,
      paciente: 'Cliente 1',
      descricao: 'Teste',
      data: '30/10/2024',
      evolutivo: 'Sim',
      profissional: 'Hugo Freitas',
      status: 'Ativo'
    }
  ]);

  // Estado do formulário do modal
  const [formData, setFormData] = useState({
    paciente: '',
    descricao: '',
    evolutivo: 'Sim',
    dentes: [] as DenteInfo[]
  });

  const [selectedTab, setSelectedTab] = useState<'permanentes' | 'deciduos'>('permanentes');
  const [selectedDente, setSelectedDente] = useState<number | null>(null);
  const [denteForm, setDenteForm] = useState({
    acao: 'Cárie, Canal, out',
    procedimento: '',
    observacao: ''
  });

  // Numeração dos dentes permanentes
  const dentesPermanentes = {
    superiores: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
    inferiores: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
  };

  // Numeração dos dentes decíduos
  const dentesDeciduos = {
    superiores: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
    inferiores: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75]
  };

  const filteredOdontogramas = odontogramas.filter(odonto =>
    odonto.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    odonto.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    odonto.profissional.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = () => {
    setShowModal(true);
    setFormData({
      paciente: '',
      descricao: '',
      evolutivo: 'Sim',
      dentes: []
    });
    setSelectedDente(null);
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

  const handleDenteClick = (numero: number) => {
    setSelectedDente(numero);
    setDenteForm({
      acao: 'Cárie, Canal, out',
      procedimento: '',
      observacao: ''
    });
  };

  const handleAddDenteInfo = () => {
    if (selectedDente && denteForm.procedimento) {
      const novoDente: DenteInfo = {
        numero: selectedDente,
        acao: denteForm.acao,
        procedimento: denteForm.procedimento,
        observacao: denteForm.observacao
      };

      setFormData(prev => ({
        ...prev,
        dentes: [...prev.dentes.filter(d => d.numero !== selectedDente), novoDente]
      }));

      setSelectedDente(null);
      setDenteForm({
        acao: 'Cárie, Canal, out',
        procedimento: '',
        observacao: ''
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados do odontograma:', formData);
    alert('Odontograma salvo com sucesso!');
    setShowModal(false);
  };

  const handleEdit = (odontograma: Odontograma) => {
    alert(`Funcionalidade de editar odontograma ${odontograma.id} será implementada`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este odontograma?')) {
      alert(`Odontograma ${id} seria excluído (funcionalidade será implementada)`);
    }
  };

  const handleView = (odontograma: Odontograma) => {
    alert(`Visualizar odontograma: ${odontograma.descricao}`);
  };

  const renderDentes = (dentes: number[], tipo: 'superiores' | 'inferiores') => {
    // SVGs realistas para cada tipo de dente
    const getToothSVG = (numero: number, hasInfo: boolean) => {
      // Incisivos centrais/laterais
      const incisivos = [11, 12, 21, 22, 31, 32, 41, 42];
      // Caninos
      const caninos = [13, 23, 33, 43];
      // Pré-molares
      const premolares = [14, 15, 24, 25, 34, 35, 44, 45];
      // Molares
      const molares = [16, 17, 18, 26, 27, 28, 36, 37, 38, 46, 47, 48];

      // SVGs realistas
      if (incisivos.includes(numero)) {
        return (
          <svg viewBox="0 0 40 60" className="dente-svg">
            <path d="M20 8 Q28 18 20 55 Q12 18 20 8 Z" fill={hasInfo ? '#fff' : '#e0e0e0'} stroke="#bbb" strokeWidth="2"/>
            <ellipse cx="20" cy="18" rx="7" ry="5" fill="#fff" opacity="0.7" />
          </svg>
        );
      }
      if (caninos.includes(numero)) {
        return (
          <svg viewBox="0 0 40 60" className="dente-svg">
            <path d="M20 10 Q35 30 20 55 Q5 30 20 10 Z" fill={hasInfo ? '#fff' : '#e0e0e0'} stroke="#bbb" strokeWidth="2"/>
            <ellipse cx="20" cy="22" rx="6" ry="4" fill="#fff" opacity="0.7" />
          </svg>
        );
      }
      if (premolares.includes(numero)) {
        return (
          <svg viewBox="0 0 40 60" className="dente-svg">
            <ellipse cx="20" cy="32" rx="10" ry="20" fill={hasInfo ? '#fff' : '#e0e0e0'} stroke="#bbb" strokeWidth="2"/>
            <ellipse cx="20" cy="20" rx="7" ry="5" fill="#fff" opacity="0.7" />
            <ellipse cx="20" cy="44" rx="7" ry="5" fill="#fff" opacity="0.7" />
          </svg>
        );
      }
      if (molares.includes(numero)) {
        return (
          <svg viewBox="0 0 40 60" className="dente-svg">
            <rect x="8" y="14" width="24" height="32" rx="10" fill={hasInfo ? '#fff' : '#e0e0e0'} stroke="#bbb" strokeWidth="2"/>
            <ellipse cx="20" cy="44" rx="9" ry="7" fill="#fff" opacity="0.7" />
            <ellipse cx="20" cy="22" rx="8" ry="6" fill="#fff" opacity="0.7" />
          </svg>
        );
      }
      // Decíduos e fallback
      return (
        <svg viewBox="0 0 40 60" className="dente-svg">
          <ellipse cx="20" cy="30" rx="10" ry="20" fill={hasInfo ? '#fff' : '#e0e0e0'} stroke="#bbb" strokeWidth="2"/>
          <ellipse cx="20" cy="18" rx="7" ry="5" fill="#fff" opacity="0.7" />
        </svg>
      );
    };

    return (
      <div className={`dentes-row ${tipo}`}> 
        {dentes.map(numero => {
          const denteInfo = formData.dentes.find(d => d.numero === numero);
          const isSelected = selectedDente === numero;
          const hasInfo = !!denteInfo;
          return (
            <div key={numero} className="dente-container">
              <div className="dente-numero">{numero}</div>
              <div 
                className={`dente ${isSelected ? 'selected' : ''} ${hasInfo ? 'has-info' : ''}`}
                onClick={() => handleDenteClick(numero)}
              >
                {getToothSVG(numero, hasInfo)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="odontogramas-page">
      <div className="odontogramas-header">
        <div className="header-controls">
          <button className="btn-novo-odontograma" onClick={handleOpenModal}>
            + Novo Odontograma
          </button>
          
          <div className="controls-right">
            <div className="results-per-page">
              <span>Exibir</span>
              <select 
                value={showResultsPerPage}
                onChange={(e) => setShowResultsPerPage(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>resultados por página</span>
            </div>
            
            <div className="search-box">
              <span>Buscar:</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                placeholder="Pesquisar..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="odontogramas-content">
        <div className="table-container">
          <table className="odontogramas-table">
            <thead>
              <tr>
                <th>Selecionar</th>
                <th>Paciente</th>
                <th>Descrição</th>
                <th>Data</th>
                <th>Evolutivo</th>
                <th>Profissional</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredOdontogramas.slice(0, showResultsPerPage).map(odontograma => (
                <tr key={odontograma.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{odontograma.paciente}</td>
                  <td>{odontograma.descricao}</td>
                  <td>{odontograma.data}</td>
                  <td>
                    <span className={`status-badge ${odontograma.evolutivo === 'Sim' ? 'sim' : 'nao'}`}>
                      {odontograma.evolutivo}
                    </span>
                  </td>
                  <td>{odontograma.profissional}</td>
                  <td className="acoes-cell">
                    <button 
                      className="btn-action edit"
                      onClick={() => handleEdit(odontograma)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-action delete"
                      onClick={() => handleDelete(odontograma.id)}
                      title="Excluir"
                    >
                      🗑️
                    </button>
                    <button 
                      className="btn-action view"
                      onClick={() => handleView(odontograma)}
                      title="Visualizar"
                    >
                      📄
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>Mostrando 1 de 6 (6 registros)</span>
          <div className="pagination">
            <button className="btn-pagination">Anterior</button>
            <button className="btn-pagination active">1</button>
            <button className="btn-pagination">Próximo</button>
          </div>
        </div>
      </div>

      {/* Modal de Novo Odontograma */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()}>
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
                    <option value="">xxxxxxxxxxxx -</option>
                    <option value="Cliente 1">Cliente 1</option>
                    <option value="Cliente 2">Cliente 2</option>
                    <option value="Cliente 3">Cliente 3</option>
                  </select>
                  <button type="button" className="btn-add-paciente">+</button>
                </div>
                
                <div className="form-group">
                  <label>Descrição</label>
                  <input
                    type="text"
                    value={formData.descricao}
                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                    className="form-input"
                    placeholder="Odontograma Evolutivo, Orçamento Cliente, etc..."
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Evolutivo</label>
                  <select 
                    value={formData.evolutivo}
                    onChange={(e) => handleInputChange('evolutivo', e.target.value)}
                    className="form-select"
                  >
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                </div>
              </div>

              <div className="dentes-section">
                <div className="dentes-tabs">
                  <button 
                    type="button"
                    className={`tab-btn ${selectedTab === 'permanentes' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('permanentes')}
                  >
                    Permanentes
                  </button>
                  <button 
                    type="button"
                    className={`tab-btn ${selectedTab === 'deciduos' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('deciduos')}
                  >
                    Decíduos
                  </button>
                </div>

                <div className="odontograma-visual">
                  {selectedTab === 'permanentes' ? (
                    <>
                      {renderDentes(dentesPermanentes.superiores, 'superiores')}
                      {renderDentes(dentesPermanentes.inferiores, 'inferiores')}
                    </>
                  ) : (
                    <>
                      {renderDentes(dentesDeciduos.superiores, 'superiores')}
                      {renderDentes(dentesDeciduos.inferiores, 'inferiores')}
                    </>
                  )}
                </div>

                <div className="legenda">
                  <div className="legenda-item">
                    <div className="cor-box procedimentos"></div>
                    <span>🔴 Procedimentos</span>
                  </div>
                  <div className="legenda-item">
                    <div className="cor-box ja-tratados"></div>
                    <span>🟢 Já Tratados</span>
                  </div>
                  <div className="legenda-item">
                    <div className="cor-box extraidos"></div>
                    <span>🔵 Extraídos</span>
                  </div>
                  <div className="legenda-item">
                    <div className="cor-box para-extrair"></div>
                    <span>❌ Para Extrair</span>
                  </div>
                </div>
              </div>

              {selectedDente && (
                <div className="dente-info-section">
                  <h3>Dente {selectedDente}</h3>
                  <div className="dente-form">
                    <div className="form-group">
                      <label>Ação</label>
                      <select 
                        value={denteForm.acao}
                        onChange={(e) => setDenteForm(prev => ({...prev, acao: e.target.value}))}
                        className="form-select"
                      >
                        <option value="Cárie, Canal, out">Cárie, Canal, out</option>
                        <option value="Restauração">Restauração</option>
                        <option value="Extração">Extração</option>
                        <option value="Implante">Implante</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Descrever Procedimento</label>
                      <input
                        type="text"
                        value={denteForm.procedimento}
                        onChange={(e) => setDenteForm(prev => ({...prev, procedimento: e.target.value}))}
                        className="form-input"
                        placeholder="Restauração dente Face Mesial e Face Oclusal"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Observação Procedimento</label>
                      <input
                        type="text"
                        value={denteForm.observacao}
                        onChange={(e) => setDenteForm(prev => ({...prev, observacao: e.target.value}))}
                        className="form-input"
                        placeholder="Alguma observação adicional"
                      />
                    </div>
                    
                    <button 
                      type="button" 
                      className="btn-add-dente"
                      onClick={handleAddDenteInfo}
                    >
                      ✓
                    </button>
                  </div>
                  
                  {formData.dentes.length > 0 && (
                    <div className="dentes-registrados">
                      <p>Nenhum Registro Encontrado!</p>
                    </div>
                  )}
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancelar
                </button>
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

export default OdontogramasPage;