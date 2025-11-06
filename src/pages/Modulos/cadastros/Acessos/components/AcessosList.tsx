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
  const [showFilters, setShowFilters] = useState(false);

  const fetchAcessos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Dados fake para demonstração - Acessos Sistema Odontológico
      const acessosFake: Acesso[] = [
        { id: 1, nome: "Gestão de Pacientes", codigo: "PAC001", descricao: "Criar, editar e visualizar dados de pacientes", categoria: "Clínico", nivel_risco: "medio", ativo: true, sistema_interno: true, grupos_count: 5, created_at: "2024-01-15T10:00:00Z", updated_at: "2024-01-15T10:00:00Z" },
        { id: 2, nome: "Configurações do Sistema", codigo: "SYS001", descricao: "Acesso às configurações avançadas", categoria: "Administrativo", nivel_risco: "critico", ativo: true, sistema_interno: true, grupos_count: 2, created_at: "2024-01-20T10:00:00Z", updated_at: "2024-01-20T10:00:00Z" },
        { id: 3, nome: "Agendamentos", codigo: "AGE001", descricao: "Criar e gerenciar agendamentos", categoria: "Operacional", nivel_risco: "baixo", ativo: true, sistema_interno: true, grupos_count: 8, created_at: "2024-02-10T10:00:00Z", updated_at: "2024-02-10T10:00:00Z" },
        { id: 4, nome: "Relatórios Financeiros", codigo: "FIN001", descricao: "Visualizar relatórios financeiros", categoria: "Financeiro", nivel_risco: "alto", ativo: true, sistema_interno: true, grupos_count: 3, created_at: "2024-02-15T10:00:00Z", updated_at: "2024-02-15T10:00:00Z" },
        { id: 5, nome: "Gestão de Funcionários", codigo: "RH001", descricao: "Administrar dados de funcionários", categoria: "Recursos Humanos", nivel_risco: "alto", ativo: false, sistema_interno: true, grupos_count: 2, created_at: "2024-03-01T10:00:00Z", updated_at: "2024-03-01T10:00:00Z" },
        { id: 6, nome: "Prontuários Médicos", codigo: "MED001", descricao: "Acesso aos prontuários dos pacientes", categoria: "Clínico", nivel_risco: "critico", ativo: true, sistema_interno: true, grupos_count: 4, created_at: "2024-03-10T10:00:00Z", updated_at: "2024-03-10T10:00:00Z" },
        { id: 7, nome: "API Externa Lab", codigo: "API001", descricao: "Integração com laboratório externo", categoria: "Integração", nivel_risco: "medio", ativo: true, sistema_interno: false, grupos_count: 1, created_at: "2024-03-20T10:00:00Z", updated_at: "2024-03-20T10:00:00Z" },
        { id: 8, nome: "Backup e Restore", codigo: "BCK001", descricao: "Realizar backup e restauração", categoria: "Administrativo", nivel_risco: "critico", ativo: true, sistema_interno: true, grupos_count: 1, created_at: "2024-04-05T10:00:00Z", updated_at: "2024-04-05T10:00:00Z" },
        { id: 9, nome: "Auditoria de Logs", codigo: "AUD001", descricao: "Visualizar logs de auditoria", categoria: "Segurança", nivel_risco: "alto", ativo: true, sistema_interno: true, grupos_count: 2, created_at: "2024-04-15T10:00:00Z", updated_at: "2024-04-15T10:00:00Z" },
        { id: 10, nome: "Portal do Paciente", codigo: "POR001", descricao: "Acesso ao portal do paciente", categoria: "Portal", nivel_risco: "baixo", ativo: false, sistema_interno: false, grupos_count: 0, created_at: "2024-05-01T10:00:00Z", updated_at: "2024-05-01T10:00:00Z" }
      ];

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Aplicar filtros
      let filteredData = acessosFake;
      
      if (search.trim()) {
        filteredData = filteredData.filter(acesso => 
          acesso.nome.toLowerCase().includes(search.toLowerCase()) ||
          acesso.descricao.toLowerCase().includes(search.toLowerCase()) ||
          acesso.codigo.toLowerCase().includes(search.toLowerCase()) ||
          acesso.categoria.toLowerCase().includes(search.toLowerCase())
        );
      }

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
  }, [currentPage, perPage, search]);

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
                <h1 className="acessos-title text-2xl font-bold text-black">Acessos ({total})</h1>
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
  );
};

export default AcessosList;