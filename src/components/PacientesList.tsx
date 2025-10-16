// Componente de exemplo para listar pacientes
import React, { useState, useEffect } from 'react';
import { usePacientes, usePacienteSearch, useReferenceData } from '../hooks/useApi';
import { Paciente, PacienteFilters } from '../services/api';
import { maskSensitiveData } from '../utils/encryption';

interface PacientesListProps {
  showMasked?: boolean;
  onSelectPaciente?: (paciente: Paciente) => void;
}

const PacientesList: React.FC<PacientesListProps> = ({ 
  showMasked = false, 
  onSelectPaciente 
}) => {
  const [filters, setFilters] = useState<PacienteFilters>({
    per_page: 20,
    masked: showMasked
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConvenio, setSelectedConvenio] = useState('');

  const { 
    pacientes, 
    pagination, 
    meta,
    loading, 
    error, 
    refresh 
  } = usePacientes(filters);

  const { 
    convenios, 
    loading: loadingRefs 
  } = useReferenceData();

  const { 
    search, 
    results, 
    loading: searching 
  } = usePacienteSearch();

  // Atualizar filtros quando searchTerm mudar
  useEffect(() => {
    if (searchTerm) {
      search({ ...filters, search: searchTerm });
    }
  }, [searchTerm, filters, search]);

  const handleFilterChange = (newFilters: Partial<PacienteFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      search({ ...filters, search: searchTerm });
    }
  };

  const renderPaciente = (paciente: Paciente) => (
    <div 
      key={paciente.id} 
      className="paciente-card"
      onClick={() => onSelectPaciente?.(paciente)}
    >
      <div className="paciente-header">
        <h3>{paciente.name}</h3>
        <span className="convenio">{paciente.convenio || 'Particular'}</span>
      </div>
      
      <div className="paciente-info">
        <div className="info-row">
          <span className="label">CPF/CNPJ:</span>
          <span className="value">
            {showMasked 
              ? maskSensitiveData(paciente.cpf_cnpj, 'cpf')
              : paciente.cpf_cnpj
            }
          </span>
        </div>
        
        <div className="info-row">
          <span className="label">Email:</span>
          <span className="value">
            {showMasked 
              ? maskSensitiveData(paciente.email, 'email')
              : paciente.email
            }
          </span>
        </div>
        
        <div className="info-row">
          <span className="label">Telefone:</span>
          <span className="value">
            {showMasked 
              ? maskSensitiveData(paciente.telefone, 'phone')
              : paciente.telefone
            }
          </span>
        </div>
        
        <div className="info-row">
          <span className="label">Idade:</span>
          <span className="value">{paciente.idade} anos</span>
        </div>
        
        <div className="info-row">
          <span className="label">Sexo:</span>
          <span className="value">{paciente.sexo}</span>
        </div>
      </div>
      
      <div className="paciente-actions">
        <button 
          className="btn btn-primary"
          onClick={(e) => {
            e.stopPropagation();
            onSelectPaciente?.(paciente);
          }}
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando pacientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Erro ao carregar pacientes</h3>
        <p>{error}</p>
        <button onClick={refresh} className="btn btn-primary">
          Tentar Novamente
        </button>
      </div>
    );
  }

  const displayPacientes = searchTerm ? results : pacientes;

  return (
    <div className="pacientes-list">
      {/* Filtros e Busca */}
      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Buscar por nome, email ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn-search">
              Buscar
            </button>
          </div>
        </form>

        <div className="filters-row">
          <select
            value={selectedConvenio}
            onChange={(e) => {
              setSelectedConvenio(e.target.value);
              handleFilterChange({ 
                convenio: e.target.value || undefined 
              });
            }}
            className="filter-select"
          >
            <option value="">Todos os convênios</option>
            {convenios.map(convenio => (
              <option key={convenio} value={convenio}>
                {convenio}
              </option>
            ))}
          </select>

          <select
            value={filters.per_page || 20}
            onChange={(e) => handleFilterChange({ 
              per_page: parseInt(e.target.value) 
            })}
            className="filter-select"
          >
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
            <option value={50}>50 por página</option>
            <option value={100}>100 por página</option>
          </select>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showMasked}
              onChange={(e) => handleFilterChange({ 
                masked: e.target.checked 
              })}
            />
            Dados mascarados
          </label>
        </div>
      </div>

      {/* Lista de Pacientes */}
      <div className="pacientes-grid">
        {displayPacientes.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhum paciente encontrado</h3>
            <p>Tente ajustar os filtros de busca</p>
          </div>
        ) : (
          displayPacientes.map(renderPaciente)
        )}
      </div>

      {/* Paginação */}
      {pagination && (
        <div className="pagination">
          <div className="pagination-info">
            Mostrando {pagination.from || 0} a {pagination.to || 0} de {pagination.total} pacientes
          </div>
          
          <div className="pagination-controls">
            <button
              disabled={pagination.current_page === 1}
              onClick={() => handleFilterChange({ 
                page: pagination.current_page - 1 
              } as PacienteFilters)}
              className="btn btn-secondary"
            >
              Anterior
            </button>
            
            <span className="page-info">
              Página {pagination.current_page} de {pagination.last_page}
            </span>
            
            <button
              disabled={pagination.current_page === pagination.last_page}
              onClick={() => handleFilterChange({ 
                page: pagination.current_page + 1 
              } as PacienteFilters)}
              className="btn btn-secondary"
            >
              Próxima
            </button>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      {meta && (
        <div className="meta-info">
          <small>
            Dados {meta.masked ? 'mascarados' : 'completos'} - 
            Gerado em {new Date(meta.generated_at).toLocaleString()}
          </small>
        </div>
      )}
    </div>
  );
};

export default PacientesList;
