import React, { useState, useEffect, useCallback } from 'react';
import './CargosList.css';

// Componentes de ícones simples para substituir heroicons
const MagnifyingGlassIcon = ({ className }: { className?: string }) => (
  <span className={`${className} inline-block`}>🔍</span>
);

const FunnelIcon = ({ className }: { className?: string }) => (
  <span className={`${className} inline-block`}>⚙️</span>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <span className={`${className} inline-block`}>➕</span>
);

interface Cargo {
  id: number;
  nome: string;
  descricao: string;
  nivel_acesso: 'baixo' | 'medio' | 'alto' | 'admin';
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

interface ApiResponse {
  data: Cargo[];
  meta: PaginationMeta;
}

interface CargosListProps {
  onEdit?: (cargo: Cargo) => void;
  onCreate?: () => void;
}

const CargosList: React.FC<CargosListProps> = ({ onEdit, onCreate }) => {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(15);
  
  // Filter state
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'nome' | 'nivel_acesso' | 'created_at'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterNivel, setFilterNivel] = useState<string>('');
  const [filterAtivo, setFilterAtivo] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchCargos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Dados fake para demonstração - 5 Cargos Padrão Sistema Odontológico
      const cargosFake: Cargo[] = [
        { id: 1, nome: "Cirurgião-Dentista", descricao: "Profissional responsável por diagnósticos, tratamentos e procedimentos odontológicos", nivel_acesso: "alto", ativo: true, created_at: "2024-01-15T10:00:00Z", updated_at: "2024-01-15T10:00:00Z" },
        { id: 2, nome: "Auxiliar de Saúde Bucal", descricao: "Assistência ao dentista durante procedimentos e orientação aos pacientes", nivel_acesso: "medio", ativo: true, created_at: "2024-01-20T10:00:00Z", updated_at: "2024-01-20T10:00:00Z" },
        { id: 3, nome: "Recepcionista Odontológica", descricao: "Atendimento ao paciente, agendamentos e controle de prontuários", nivel_acesso: "baixo", ativo: true, created_at: "2024-02-10T10:00:00Z", updated_at: "2024-02-10T10:00:00Z" },
        { id: 4, nome: "Técnico em Prótese Dentária", descricao: "Confecção, reparo e manutenção de próteses e aparelhos ortodônticos", nivel_acesso: "medio", ativo: true, created_at: "2024-02-15T10:00:00Z", updated_at: "2024-02-15T10:00:00Z" },
        { id: 5, nome: "Administrador da Clínica", descricao: "Gestão completa da clínica, finanças, RH e supervisão geral", nivel_acesso: "admin", ativo: true, created_at: "2024-03-01T10:00:00Z", updated_at: "2024-03-01T10:00:00Z" }
      ];

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Aplicar filtros
      let filteredData = cargosFake;
      
      if (search.trim()) {
        filteredData = filteredData.filter(cargo => 
          cargo.nome.toLowerCase().includes(search.toLowerCase()) ||
          cargo.descricao.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (filterNivel) {
        filteredData = filteredData.filter(cargo => cargo.nivel_acesso === filterNivel);
      }
      
      if (filterAtivo) {
        filteredData = filteredData.filter(cargo => 
          filterAtivo === 'true' ? cargo.ativo : !cargo.ativo
        );
      }

      // Aplicar ordenação
      filteredData.sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'id') {
          comparison = a.id - b.id;
        } else if (sortBy === 'nome') {
          comparison = a.nome.localeCompare(b.nome);
        } else if (sortBy === 'nivel_acesso') {
          const nivelOrder = { baixo: 1, medio: 2, alto: 3, admin: 4 };
          comparison = nivelOrder[a.nivel_acesso] - nivelOrder[b.nivel_acesso];
        } else if (sortBy === 'created_at') {
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        } else {
          // Fallback para ordenação por ID numérico
          comparison = a.id - b.id;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });

      // Simular paginação
      const startIndex = (currentPage - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      setCargos(paginatedData);
      setLastPage(Math.ceil(filteredData.length / perPage));
      setTotal(filteredData.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, search, sortBy, sortOrder, filterNivel, filterAtivo]);

  useEffect(() => {
    fetchCargos();
  }, [fetchCargos]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSort = (field: typeof sortBy) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const getNivelAcessoBadge = (nivel: string) => {
    const styles = {
      baixo: 'bg-green-100 text-green-800',
      medio: 'bg-yellow-100 text-yellow-800',
      alto: 'bg-orange-100 text-orange-800',
      admin: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[nivel as keyof typeof styles]}`}>
        {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (ativo: boolean) => {
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {ativo ? 'Ativo' : 'Inativo'}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Erro ao carregar dados
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={fetchCargos}
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cargos-container py-6 px-4 sm:px-6 lg:px-8">
      <div className="cargos-content max-w-7xl mx-auto">
        {/* Header da Página */}
        <div className="cargos-header bg-white rounded-xl shadow-lg border border-gray-200 mb-4">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="cargos-logo w-12 h-12 rounded-lg flex items-center justify-center">
                  </div>
                </div>
                <div>
                  <h1 className="cargos-title text-2xl font-bold">Gestão de Cargos</h1>
                  <p className="cargos-subtitle text-sm">Sistema Odontológico - Controle de Funções e Permissões</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={onCreate}
                  className="btn-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg">
                  <span>➕ Novo Cargo</span>
                </button>
                <button className="btn-secondary text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg">
                  <span>Exportar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Container Principal da Tabela */}
        <div className="table-container bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Estatísticas Rápidas */}
          <div className="stats-panel px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="stat-item">
                  <span className="stat-number blue text-xl font-bold mr-2">{total}</span>
                  <span className="stat-label text-sm font-medium text-gray-700">Total de Cargos</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number green text-xl font-bold mr-2">{cargos.filter(c => c.ativo).length}</span>
                  <span className="stat-label text-sm font-medium text-gray-700">Cargos Ativos</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number orange text-xl font-bold mr-2">{cargos.filter(c => !c.ativo).length}</span>
                  <span className="stat-label text-sm font-medium text-gray-700">Cargos Inativos</span>
                </div>
                <div className="stat-item">
                  <span className="last-update text-sm font-medium text-gray-700 mr-2">Última atualização</span>
                  <span className="last-update text-sm text-gray-600">Hoje, {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="table-header">
                <tr>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-16">
                    <div className="column-header flex items-center justify-center">
                      <span className="id-badge">#</span>
                      ID
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-80">
                    <div className="column-header flex items-center">
                      Cargo / Função
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-32">
                    <div className="column-header flex items-center justify-center">
                      Nível de Acesso
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-24">
                    <div className="column-header flex items-center justify-center">
                      Status
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-32">
                    <div className="column-header flex items-center justify-center">
                      Data Criação
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-48">
                    <div className="column-header flex items-center justify-center">
                      Ações
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="loading-container">
                        <div className="loading-spinner">
                          <div className="loading-ring"></div>
                          <div className="loading-icon">
                            <span>⏳</span>
                          </div>
                        </div>
                        <p className="loading-text">Carregando cargos do sistema</p>
                        <p className="loading-subtext">Aguarde um momento...</p>
                      </div>
                    </td>
                  </tr>
                ) : cargos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="empty-container">
                        <div className="empty-icon">
                          <span>📋</span>
                        </div>
                        <h3 className="empty-title">Nenhum cargo encontrado</h3>
                        <p className="empty-description">
                          {search ? 'Nenhum cargo corresponde aos critérios de busca' : 'Comece criando o primeiro cargo do sistema'}
                        </p>
                        {!search && (
                          <button 
                            onClick={onCreate}
                            className="empty-action">
                            Criar Primeiro Cargo
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  cargos.map((cargo, index) => (
                    <tr key={cargo.id} className={`transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      {/* ID */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <div className="row-id-badge">
                            {cargo.id}
                          </div>
                        </div>
                      </td>

                      {/* Nome do Cargo */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <div className="cargo-name">{cargo.nome}</div>
                          <div className="cargo-subtitle">Sistema Odontológico</div>
                        </div>
                      </td>

                      {/* Nível de Acesso */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <span className={`nivel-badge ${
                          cargo.nivel_acesso === 'admin' ? 'nivel-admin' :
                          cargo.nivel_acesso === 'alto' ? 'nivel-alto' :
                          cargo.nivel_acesso === 'medio' ? 'nivel-medio' :
                          'nivel-baixo'
                        }`}>
                          {cargo.nivel_acesso === 'admin' ? 'Administrador' : 
                           cargo.nivel_acesso.charAt(0).toUpperCase() + cargo.nivel_acesso.slice(1)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <span className={`status-badge ${cargo.ativo ? 'status-ativo' : 'status-inativo'}`}>
                          <span className={`status-dot ${cargo.ativo ? 'ativo' : 'inativo'}`}></span>
                          {cargo.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>

                      {/* Data Criação */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <div className="date-info">
                          <div className="date-main">
                            {formatDate(cargo.created_at)}
                          </div>
                          <div className="date-time">
                            {new Date(cargo.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </td>

                      {/* Ações */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <div className="action-buttons">
                          <button className="action-btn btn-dados" title="Ver Detalhes">
                            Dados
                          </button>
                          <button 
                            onClick={() => onEdit && onEdit(cargo)}
                            className="action-btn btn-editar"
                            title="Editar Cargo">
                            Editar
                          </button>
                          <button className="action-btn btn-excluir" title="Excluir Cargo">
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginação */}
        {lastPage > 1 && (
          <div className="pagination-container bg-white rounded-xl shadow-lg border border-gray-200 mt-6">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white transition-colors duration-200"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(Math.min(lastPage, currentPage + 1))}
                  disabled={currentPage === lastPage}
                  className="pagination-btn ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white transition-colors duration-200"
                >
                  Próximo
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="pagination-info text-sm">
                    Exibindo{' '}
                    <span className="pagination-highlight font-medium">{(currentPage - 1) * perPage + 1}</span>{' '}
                    até{' '}
                    <span className="pagination-highlight font-medium">
                      {Math.min(currentPage * perPage, total)}
                    </span>{' '}
                    de{' '}
                    <span className="pagination-highlight font-medium">{total}</span>{' '}
                    cargos
                  </p>
                </div>
                <div>
                  <nav className="pagination-nav relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="pagination-btn relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium transition-colors duration-200"
                    >
                      <span className="sr-only">Anterior</span>
                      <span>←</span>
                    </button>
                    
                    {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`pagination-btn relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-200 ${
                            currentPage === page ? 'active' : ''
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(Math.min(lastPage, currentPage + 1))}
                      disabled={currentPage === lastPage}
                      className="pagination-btn relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium transition-colors duration-200"
                    >
                      <span className="sr-only">Próximo</span>
                      <span>→</span>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CargosList;