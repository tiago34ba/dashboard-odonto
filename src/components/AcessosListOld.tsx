import React, { useState, useEffect, useCallback } from 'react';
import './AcessosList.css';

interface Acesso {
  id: number;
  nome: string;
  codigo: string;
  descricao: string;
  categoria: string;
  nivel_risco: 'baixo' | 'medio' | 'alto' | 'critico';
  ativo: boolean;
  sistema_interno: boolean;
  grupos_count: number;
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
  data: Acesso[];
  meta: PaginationMeta;
}

interface AcessosListProps {
  onCreate?: () => void;
  onEdit?: (acesso: Acesso) => void;
  onDelete?: (id: number) => void;
}

const AcessosList: React.FC<AcessosListProps> = ({
  onCreate = () => {},
  onEdit,
  onDelete
}) => {
  const [acessos, setAcessos] = useState<Acesso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(15);
  
  // Filter state
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'nome' | 'categoria' | 'nivel_risco' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterCategoria, setFilterCategoria] = useState<string>('');
  const [filterNivelRisco, setFilterNivelRisco] = useState<string>('');
  const [filterAtivo, setFilterAtivo] = useState<string>('');
  const [filterSistemaInterno, setFilterSistemaInterno] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchAcessos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Dados fake para demonstração
      const acessosFake: Acesso[] = [
        { 
          id: 1, 
          nome: "Gestão de Pacientes", 
          codigo: "PAC001", 
          descricao: "Criar, editar e visualizar dados de pacientes", 
          categoria: "Clínico", 
          nivel_risco: "medio", 
          ativo: true, 
          sistema_interno: true, 
          grupos_count: 5, 
          created_at: "2024-01-15T10:00:00Z", 
          updated_at: "2024-01-15T10:00:00Z" 
        },
        { 
          id: 2, 
          nome: "Configurações do Sistema", 
          codigo: "SYS001", 
          descricao: "Acesso às configurações avançadas", 
          categoria: "Administrativo", 
          nivel_risco: "critico", 
          ativo: true, 
          sistema_interno: true, 
          grupos_count: 2, 
          created_at: "2024-01-20T10:00:00Z", 
          updated_at: "2024-01-20T10:00:00Z" 
        },
        { 
          id: 3, 
          nome: "Agendamentos", 
          codigo: "AGE001", 
          descricao: "Criar e gerenciar agendamentos", 
          categoria: "Operacional", 
          nivel_risco: "baixo", 
          ativo: true, 
          sistema_interno: true, 
          grupos_count: 8, 
          created_at: "2024-02-10T10:00:00Z", 
          updated_at: "2024-02-10T10:00:00Z" 
        },
        { 
          id: 4, 
          nome: "Relatórios Financeiros", 
          codigo: "FIN001", 
          descricao: "Visualizar relatórios financeiros", 
          categoria: "Financeiro", 
          nivel_risco: "alto", 
          ativo: true, 
          sistema_interno: true, 
          grupos_count: 3, 
          created_at: "2024-02-15T10:00:00Z", 
          updated_at: "2024-02-15T10:00:00Z" 
        },
        { 
          id: 5, 
          nome: "Gestão de Funcionários", 
          codigo: "RH001", 
          descricao: "Administrar dados de funcionários", 
          categoria: "Recursos Humanos", 
          nivel_risco: "alto", 
          ativo: false, 
          sistema_interno: true, 
          grupos_count: 2, 
          created_at: "2024-03-01T10:00:00Z", 
          updated_at: "2024-03-01T10:00:00Z" 
        },
        { 
          id: 6, 
          nome: "Prontuários Médicos", 
          codigo: "MED001", 
          descricao: "Acesso aos prontuários dos pacientes", 
          categoria: "Clínico", 
          nivel_risco: "critico", 
          ativo: true, 
          sistema_interno: true, 
          grupos_count: 4, 
          created_at: "2024-03-10T10:00:00Z", 
          updated_at: "2024-03-10T10:00:00Z" 
        },
        { 
          id: 7, 
          nome: "API Externa Lab", 
          codigo: "API001", 
          descricao: "Integração com laboratório externo", 
          categoria: "Integração", 
          nivel_risco: "medio", 
          ativo: true, 
          sistema_interno: false, 
          grupos_count: 1, 
          created_at: "2024-03-20T10:00:00Z", 
          updated_at: "2024-03-20T10:00:00Z" 
        },
        { 
          id: 8, 
          nome: "Backup e Restore", 
          codigo: "BCK001", 
          descricao: "Realizar backup e restauração", 
          categoria: "Administrativo", 
          nivel_risco: "critico", 
          ativo: true, 
          sistema_interno: true, 
          grupos_count: 1, 
          created_at: "2024-04-05T10:00:00Z", 
          updated_at: "2024-04-05T10:00:00Z" 
        },
        { 
          id: 9, 
          nome: "Auditoria de Logs", 
          codigo: "AUD001", 
          descricao: "Visualizar logs de auditoria", 
          categoria: "Segurança", 
          nivel_risco: "alto", 
          ativo: true, 
          sistema_interno: true, 
          grupos_count: 2, 
          created_at: "2024-04-15T10:00:00Z", 
          updated_at: "2024-04-15T10:00:00Z" 
        },
        { 
          id: 10, 
          nome: "Portal do Paciente", 
          codigo: "POR001", 
          descricao: "Acesso ao portal do paciente", 
          categoria: "Portal", 
          nivel_risco: "baixo", 
          ativo: false, 
          sistema_interno: false, 
          grupos_count: 0, 
          created_at: "2024-05-01T10:00:00Z", 
          updated_at: "2024-05-01T10:00:00Z" 
        }
      ];

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Aplicar filtros
      let filteredData = acessosFake;
      
      if (search.trim()) {
        filteredData = filteredData.filter(acesso => 
          acesso.nome.toLowerCase().includes(search.toLowerCase()) ||
          acesso.codigo.toLowerCase().includes(search.toLowerCase()) ||
          acesso.descricao.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (filterCategoria) {
        filteredData = filteredData.filter(acesso => acesso.categoria === filterCategoria);
      }
      
      if (filterNivelRisco) {
        filteredData = filteredData.filter(acesso => acesso.nivel_risco === filterNivelRisco);
      }
      
      if (filterAtivo) {
        filteredData = filteredData.filter(acesso => 
          filterAtivo === 'true' ? acesso.ativo : !acesso.ativo
        );
      }
      
      if (filterSistemaInterno) {
        filteredData = filteredData.filter(acesso => 
          filterSistemaInterno === 'true' ? acesso.sistema_interno : !acesso.sistema_interno
        );
      }

      // Aplicar ordenação
      filteredData.sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'nome') {
          comparison = a.nome.localeCompare(b.nome);
        } else if (sortBy === 'categoria') {
          comparison = a.categoria.localeCompare(b.categoria);
        } else if (sortBy === 'nivel_risco') {
          const riscoOrder = { baixo: 1, medio: 2, alto: 3, critico: 4 };
          comparison = riscoOrder[a.nivel_risco] - riscoOrder[b.nivel_risco];
        } else if (sortBy === 'created_at') {
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });

      // Simular paginação
      const startIndex = (currentPage - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      setAcessos(paginatedData);
      setLastPage(Math.ceil(filteredData.length / perPage));
      setTotal(filteredData.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, search, sortBy, sortOrder, filterCategoria, filterNivelRisco, filterAtivo, filterSistemaInterno]);

  useEffect(() => {
    fetchAcessos();
  }, [fetchAcessos]);

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

  const getNivelRiscoBadge = (nivel: string) => {
    const styles = {
      baixo: 'bg-green-100 text-green-800',
      medio: 'bg-yellow-100 text-yellow-800',
      alto: 'bg-orange-100 text-orange-800',
      critico: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[nivel as keyof typeof styles]}`}>
        {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
      </span>
    );
  };

  const getCategoriaBadge = (categoria: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800',
      'bg-teal-100 text-teal-800'
    ];
    
    const colorIndex = categoria.length % colors.length;
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors[colorIndex]}`}>
        {categoria}
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

  const getTipoSistemaIcon = (sistemaInterno: boolean) => {
    return sistemaInterno ? (
      <span role="img" aria-label="Sistema Interno" className="h-4 w-4">🔒</span>
    ) : (
      <span role="img" aria-label="Sistema Externo" className="h-4 w-4">🔓</span>
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
                onClick={fetchAcessos}
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
    <div className="acessos-container py-6 px-4 sm:px-6 lg:px-8">
      <div className="acessos-content max-w-7xl mx-auto">
        
        {/* Header da Página */}
        <div className="acessos-header bg-white rounded-xl shadow-lg border border-gray-200 mb-4">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="acessos-logo w-12 h-12 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🔑</span>
                  </div>
                </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={onCreate}
                  className="btn-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg">
                  <span>➕ Novo Acesso</span>
                </button>
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
                      placeholder="Buscar acessos..."
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
                <span>➕Novo Acesso</span>
              </button>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <span>⚙️Filtros</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Itens por página
                </label>
                <select
                  id="perPage"
                  value={perPage}
                  onChange={(e: any) => {
                    setPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Categoria
                </label>
                <select
                  value={filterCategoria}
                  onChange={(e: any) => setFilterCategoria(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Todas</option>
                  <option value="Usuários">Usuários</option>
                  <option value="Pacientes">Pacientes</option>
                  <option value="Relatórios">Relatórios</option>
                  <option value="Configurações">Configurações</option>
                  <option value="Administração">Administração</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nível de Risco
                </label>
                <select
                  value={filterNivelRisco}
                  onChange={(e: any) => setFilterNivelRisco(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Todos</option>
                  <option value="baixo">Baixo</option>
                  <option value="medio">Médio</option>
                  <option value="alto">Alto</option>
                  <option value="critico">Crítico</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo Sistema
                </label>
                <select
                  value={filterSistemaInterno}
                  onChange={(e: any) => setFilterSistemaInterno(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Todos</option>
                  <option value="true">Interno</option>
                  <option value="false">Externo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={filterAtivo}
                  onChange={(e: any) => setFilterAtivo(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Todos</option>
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
            </div>
          </div>
        </div>
      )}

      {/* Container Principal da Tabela */}
        <div className="table-container bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-64">
                    <div className="column-header flex items-center">
                      Nome
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-24">
                    <div className="column-header flex items-center justify-center">
                      Código
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-32">
                    <div className="column-header flex items-center justify-center">
                      Categoria
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-28">
                    <div className="column-header flex items-center justify-center">
                      Nível Risco
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-20">
                    <div className="column-header flex items-center justify-center">
                      Tipo
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-20">
                    <div className="column-header flex items-center justify-center">
                      Grupos
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
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="loading-container">
                        <div className="loading-spinner">
                          <div className="loading-ring"></div>
                          <div className="loading-icon">
                            <span>⏳</span>
                          </div>
                        </div>
                        <p className="loading-text">Carregando acessos do sistema</p>
                        <p className="loading-subtext">Aguarde um momento...</p>
                      </div>
                    </td>
                  </tr>
                ) : acessos.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="empty-container">
                        <div className="empty-icon">
                          <span>🔑</span>
                        </div>
                        <h3 className="empty-title">Nenhum acesso encontrado</h3>
                        <p className="empty-description">
                          {search ? 'Nenhum acesso corresponde aos critérios de busca' : 'Comece criando o primeiro acesso do sistema'}
                        </p>
                        {!search && (
                          <button 
                            onClick={onCreate}
                            className="empty-action">
                            Criar Primeiro Acesso
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  acessos.map((acesso, index) => (
                    <tr key={acesso.id} className={`transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      {/* Nome */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <div className="acesso-name font-medium text-gray-900">{acesso.nome}</div>
                          <div className="text-sm text-gray-500">{acesso.descricao}</div>
                        </div>
                      </td>

                      {/* Código */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className="codigo-badge">{acesso.codigo}</span>
                      </td>

                      {/* Categoria */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className="categoria-badge">{acesso.categoria}</span>
                      </td>

                      {/* Nível de Risco */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <span className={`risk-badge risk-${acesso.nivel_risco}`}>
                          {acesso.nivel_risco.charAt(0).toUpperCase() + acesso.nivel_risco.slice(1)}
                        </span>
                      </td>

                      {/* Tipo */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <div className="tipo-container">
                          <span className="tipo-icon">{acesso.sistema_interno ? '🔒' : '🔓'}</span>
                          <span className="tipo-text">{acesso.sistema_interno ? 'Interno' : 'Externo'}</span>
                        </div>
                      </td>

                      {/* Grupos */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <span className="grupos-count">
                          {acesso.grupos_count} grupos
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <span className={`status-badge ${acesso.ativo ? 'status-ativo' : 'status-inativo'}`}>
                          {acesso.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>

                      {/* Data Criação */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <div className="date-info">
                          <div className="date-main text-sm text-gray-900">
                            {formatDate(acesso.created_at)}
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
                            onClick={() => onEdit && onEdit(acesso)}
                            className="action-btn btn-editar"
                            title="Editar Acesso">
                            Editar
                          </button>
                          <button className="action-btn btn-excluir" title="Excluir Acesso">
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
                    acessos
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
    </div>
  );
};

export default AcessosList;