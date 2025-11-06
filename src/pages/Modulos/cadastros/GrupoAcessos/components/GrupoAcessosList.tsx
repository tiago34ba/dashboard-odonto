import React, { useState, useEffect, useCallback } from 'react';
import './GrupoAcessosList.css';

interface GrupoAcesso {
  id: number;
  nome: string;
  descricao: string;
  permissoes: string[];
  usuarios: number;
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

interface GrupoAcessosListProps {
  grupos?: GrupoAcesso[];
  loading?: boolean;
  error?: string | null;
  onCreate?: () => void;
  onEdit?: (grupo: GrupoAcesso) => void;
  onDelete?: (id: number) => void;
}

const GrupoAcessosList: React.FC<GrupoAcessosListProps> = ({
  onCreate = () => {},
  onEdit,
  onDelete
}) => {
  // State declarations
  const [grupos, setGrupos] = useState<GrupoAcesso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(15);
  
  // Filter state
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'nome' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterAtivo, setFilterAtivo] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchGrupos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Dados fake para demonstração - Grupos de Acesso Sistema Odontológico
      const gruposFake: GrupoAcesso[] = [
        { id: 1, nome: "Administradores", descricao: "Acesso completo ao sistema", permissoes: ["criar", "editar", "excluir", "visualizar", "configurar"], usuarios: 3, ativo: true, created_at: "2024-01-15T10:00:00Z", updated_at: "2024-01-15T10:00:00Z" },
        { id: 2, nome: "Dentistas", descricao: "Acesso aos módulos clínicos", permissoes: ["criar", "editar", "visualizar"], usuarios: 8, ativo: true, created_at: "2024-01-20T10:00:00Z", updated_at: "2024-01-20T10:00:00Z" },
        { id: 3, nome: "Recepcionistas", descricao: "Agendamentos e atendimento", permissoes: ["criar", "visualizar"], usuarios: 4, ativo: true, created_at: "2024-02-10T10:00:00Z", updated_at: "2024-02-10T10:00:00Z" },
        { id: 4, nome: "Auxiliares", descricao: "Assistência nos procedimentos", permissoes: ["visualizar"], usuarios: 6, ativo: true, created_at: "2024-02-15T10:00:00Z", updated_at: "2024-02-15T10:00:00Z" },
        { id: 5, nome: "Financeiro", descricao: "Gestão financeira e pagamentos", permissoes: ["criar", "editar", "visualizar"], usuarios: 2, ativo: true, created_at: "2024-03-01T10:00:00Z", updated_at: "2024-03-01T10:00:00Z" },
        { id: 6, nome: "Coordenadores", descricao: "Gestão de equipes", permissoes: ["criar", "editar", "visualizar", "configurar"], usuarios: 3, ativo: true, created_at: "2024-03-10T10:00:00Z", updated_at: "2024-03-10T10:00:00Z" },
        { id: 7, nome: "Técnicos", descricao: "Suporte técnico especializado", permissoes: ["visualizar", "configurar"], usuarios: 1, ativo: false, created_at: "2024-03-20T10:00:00Z", updated_at: "2024-03-20T10:00:00Z" },
        { id: 8, nome: "Especialistas", descricao: "Profissionais especializados", permissoes: ["criar", "editar", "visualizar"], usuarios: 5, ativo: true, created_at: "2024-04-05T10:00:00Z", updated_at: "2024-04-05T10:00:00Z" },
        { id: 9, nome: "Supervisores", descricao: "Supervisão e controle de qualidade", permissoes: ["editar", "visualizar", "configurar"], usuarios: 2, ativo: true, created_at: "2024-04-15T10:00:00Z", updated_at: "2024-04-15T10:00:00Z" },
        { id: 10, nome: "Consultores", descricao: "Acesso limitado para consultoria", permissoes: ["visualizar"], usuarios: 0, ativo: false, created_at: "2024-05-01T10:00:00Z", updated_at: "2024-05-01T10:00:00Z" }
      ];

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Aplicar filtros
      let filteredData = gruposFake;
      
      if (search.trim()) {
        filteredData = filteredData.filter(grupo => 
          grupo.nome.toLowerCase().includes(search.toLowerCase()) ||
          grupo.descricao.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (filterAtivo) {
        filteredData = filteredData.filter(grupo => 
          filterAtivo === 'true' ? grupo.ativo : !grupo.ativo
        );
      }

      // Aplicar ordenação
      filteredData.sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'id') {
          comparison = a.id - b.id;
        } else if (sortBy === 'nome') {
          comparison = a.nome.localeCompare(b.nome);
        } else if (sortBy === 'created_at') {
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        } else {
          comparison = a.id - b.id;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });

      // Simular paginação
      const startIndex = (currentPage - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      setGrupos(paginatedData);
      setLastPage(Math.ceil(filteredData.length / perPage));
      setTotal(filteredData.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, search, sortBy, sortOrder, filterAtivo]);

  useEffect(() => {
    fetchGrupos();
  }, [fetchGrupos]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatPermissoes = (permissoes: string[]) => {
    if (permissoes.length <= 3) {
      return permissoes.join(', ');
    }
    return `${permissoes.slice(0, 3).join(', ')} e mais ${permissoes.length - 3}`;
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
                onClick={fetchGrupos}
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
    <div className="grupos-container py-6 px-4 sm:px-6 lg:px-8">
      <div className="grupos-content max-w-7xl mx-auto">
        
        {/* Header da Página */}
        <div className="grupos-header bg-white rounded-xl shadow-lg border border-gray-200 mb-4">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={onCreate}
                    className="btn-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg">
                    <span>➕ Novo Grupo de Acessos</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Barra de Busca */}
          <div className="px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center flex-1">
                <div className="flex items-center bg-white border border-gray-300 rounded-md">
                  <div className="pl-3 pr-2 flex items-center">
                    <span className="text-gray-400">🔍</span>
                  </div>
                  <form onSubmit={handleSearchSubmit} className="flex-1">
                    <input
                      type="text"
                      className="block w-full py-2 pr-3 border-0 leading-5 bg-transparent placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0"
                      placeholder="Buscar grupos..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </form>
                </div>
              </div>
              <button
                type="submit"
                onClick={handleSearchSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Buscar
              </button>
              <button 
                onClick={onCreate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <span>➕Novo Grupo</span>
              </button>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <span>⚙️Filtros</span>
              </button>
            </div>
          </div>
        </div>

        {/* Container Principal da Tabela */}
        <div className="table-container bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-48">
                    <div className="column-header flex items-center">
                      Grupo
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-64">
                    <div className="column-header flex items-center">
                      Descrição
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-48">
                    <div className="column-header flex items-center">
                      Permissões
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-24">
                    <div className="column-header flex items-center justify-center">
                      Usuários
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-24">
                    <div className="column-header flex items-center justify-center">
                      Status
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-32">
                    <div className="column-header flex items-center justify-center">
                      Criado em↓
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
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="loading-container">
                        <div className="loading-spinner">
                          <div className="loading-ring"></div>
                          <div className="loading-icon">
                            <span>⏳</span>
                          </div>
                        </div>
                        <p className="loading-text">Carregando grupos do sistema</p>
                        <p className="loading-subtext">Aguarde um momento...</p>
                      </div>
                    </td>
                  </tr>
                ) : grupos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="empty-container">
                        <div className="empty-icon">
                          <span>🔐</span>
                        </div>
                        <h3 className="empty-title">Nenhum grupo encontrado</h3>
                        <p className="empty-description">
                          {search ? 'Nenhum grupo corresponde aos critérios de busca' : 'Comece criando o primeiro grupo de acesso'}
                        </p>
                        {!search && (
                          <button 
                            onClick={onCreate}
                            className="empty-action">
                            Criar Primeiro Grupo
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  grupos.map((grupo, index) => (
                    <tr key={grupo.id} className={`transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      {/* Grupo */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <div className="grupo-name font-medium text-gray-900">{grupo.nome}</div>
                        </div>
                      </td>

                      {/* Descrição */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{grupo.descricao}</div>
                      </td>

                      {/* Permissões */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-blue-600">{formatPermissoes(grupo.permissoes)}</div>
                      </td>

                      {/* Usuários */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <span className="text-sm text-gray-900">
                          👥{grupo.usuarios}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <span className={`status-badge ${grupo.ativo ? 'status-ativo' : 'status-inativo'}`}>
                          {grupo.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>

                      {/* Data Criação */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <div className="date-info">
                          <div className="date-main text-sm text-gray-900">
                            {formatDate(grupo.created_at)}
                          </div>
                        </div>
                      </td>

                      {/* Ações */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <div className="action-buttons">
                          <button className="action-btn btn-dados" title="Ver Detalhes">
                            Ver
                          </button>
                          <button 
                            onClick={() => onEdit && onEdit(grupo)}
                            className="action-btn btn-editar"
                            title="Editar Grupo">
                            Editar
                          </button>
                          <button className="action-btn btn-excluir" title="Excluir Grupo">
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
                    grupos
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

export default GrupoAcessosList;