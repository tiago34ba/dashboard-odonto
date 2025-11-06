import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './ContasReceberList.css';

interface ContaReceber {
  id: number;
  codigo: string;
  paciente: string;
  procedimento: string;
  categoria: 'Consulta' | 'Limpeza' | 'Restauração' | 'Endodontia' | 'Ortodontia' | 'Cirurgia' | 'Prótese' | 'Implante' | 'Clareamento' | 'Outros';
  valor_original: number;
  valor_recebido: number;
  valor_pendente: number;
  data_vencimento: string;
  data_recebimento?: string;
  status: 'Pendente' | 'Vencido' | 'Recebido' | 'Parcial';
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  forma_pagamento?: string;
  convenio?: string;
  observacoes?: string;
  created_at: string;
}

interface ContasReceberListProps {
  onCreate?: () => void;
  onEdit?: (conta: ContaReceber) => void;
  onDelete?: (id: number) => void;
  onReceive?: (conta: ContaReceber) => void;
}

type ViewMode = 'cards' | 'table';

const ContasReceberList: React.FC<ContasReceberListProps> = ({
  onCreate = () => {},
  onEdit,
  onDelete,
  onReceive
}) => {
  const [contas, setContas] = useState<ContaReceber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(15);
  
  // Filter state
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterCategoria, setFilterCategoria] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchContasReceber = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Dados fake para demonstração - Contas a Receber Sistema Odontológico
      const contasFake: ContaReceber[] = [
        {
          id: 1,
          codigo: "CR001",
          paciente: "Maria Silva Santos",
          procedimento: "Limpeza + Aplicação de Flúor",
          categoria: "Limpeza",
          valor_original: 280.00,
          valor_recebido: 280.00,
          valor_pendente: 0.00,
          data_vencimento: "2024-10-30",
          data_recebimento: "2024-10-28",
          status: "Recebido",
          prioridade: "Baixa",
          forma_pagamento: "PIX",
          observacoes: "Pagamento realizado no ato",
          created_at: "2024-10-15T10:00:00Z"
        },
      ];

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Aplicar filtros nos dados
      let dadosFiltrados = contasFake;
      
      if (search.trim()) {
        dadosFiltrados = dadosFiltrados.filter(conta => 
          conta.paciente.toLowerCase().includes(search.toLowerCase()) ||
          conta.procedimento.toLowerCase().includes(search.toLowerCase()) ||
          conta.codigo.toLowerCase().includes(search.toLowerCase()) ||
          conta.categoria.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (filterStatus) {
        dadosFiltrados = dadosFiltrados.filter(conta => conta.status === filterStatus);
      }
      
      if (filterCategoria) {
        dadosFiltrados = dadosFiltrados.filter(conta => conta.categoria === filterCategoria);
      }

      // Simular paginação
      const startIndex = (currentPage - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedData = dadosFiltrados.slice(startIndex, endIndex);
      
      setContas(paginatedData);
      setLastPage(Math.ceil(dadosFiltrados.length / perPage));
      setTotal(dadosFiltrados.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, search, filterStatus, filterCategoria]);

  useEffect(() => {
    fetchContasReceber();
  }, [fetchContasReceber]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Recebido': return 'status-recebido';
      case 'Pendente': return 'status-pendente';
      case 'Vencido': return 'status-vencido';
      case 'Parcial': return 'status-parcial';
      default: return 'status-pendente';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Baixa': return 'prioridade-baixa';
      case 'Média': return 'prioridade-media';
      case 'Alta': return 'prioridade-alta';
      case 'Crítica': return 'prioridade-critica';
      default: return 'prioridade-baixa';
    }
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'Consulta': return '🩺';
      case 'Limpeza': return '🧽';
      case 'Restauração': return '🦷';
      case 'Endodontia': return '🔧';
      case 'Ortodontia': return '🦷';
      case 'Cirurgia': return '⚕️';
      case 'Prótese': return '🦷';
      case 'Implante': return '🔩';
      case 'Clareamento': return '✨';
      case 'Outros': return '📋';
      default: return '📄';
    }
  };

  // Otimização: usar useMemo para calcular totais apenas quando contas mudam
  const { totalOriginal, totalRecebido, totalPendente } = useMemo(() => {
    const totalOriginal = contas.reduce((sum, conta) => sum + conta.valor_original, 0);
    const totalRecebido = contas.reduce((sum, conta) => sum + conta.valor_recebido, 0);
    const totalPendente = contas.reduce((sum, conta) => sum + conta.valor_pendente, 0);
    return { totalOriginal, totalRecebido, totalPendente };
  }, [contas]);

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
                onClick={fetchContasReceber}
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
    <div className="contas-receber-container py-6 px-4 sm:px-6 lg:px-8">
      <div className="contas-receber-content max-w-7xl mx-auto">
        
        {/* Header da Página */}
        <div className="contas-receber-header bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="contas-receber-logo w-12 h-12 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
                <div>
                  <h1 className="contas-receber-title text-2xl font-bold text-black">Sistema Odontológico🇧🇷Brasil</h1>
                  <h2 className="text-lg font-semibold text-gray-700 mt-1">Contas a Receber ({total})</h2>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={onCreate}
                  className="btn-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg">
                  <span>+ Novo Grupo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cards de Estatísticas Modernas */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Card Total de Contas */}
              <div className="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold mb-1">{contas.length}</div>
                    <div className="text-blue-100 text-sm font-medium">Total de Contas</div>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
              </div>

              {/* Card Contas Recebidas */}
              <div className="stat-card bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold mb-1">{contas.filter(c => c.status === 'Recebido').length}</div>
                    <div className="text-green-100 text-sm font-medium">Contas Recebidas</div>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
              </div>

              {/* Card Contas Pendentes */}
              <div className="stat-card bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold mb-1">{contas.filter(c => c.status === 'Pendente' || c.status === 'Vencido').length}</div>
                    <div className="text-red-100 text-sm font-medium">Contas Pendentes</div>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⏰</span>
                  </div>
                </div>
              </div>

              {/* Card Total Valor */}
              <div className="stat-card bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold mb-1">{formatCurrency(totalOriginal)}</div>
                    <div className="text-orange-100 text-sm font-medium">Total de Valores</div>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Barra de Busca e Filtros - Estilo Moderno */}
          <div className="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 rounded-b-2xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center flex-1">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-white/70">🔍</span>
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all duration-200"
                    placeholder="Pesquisar: Buscar por paciente, procedimento, código..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all duration-200"
                >
                  <option value="" className="text-gray-900">Status: Todos</option>
                  <option value="Pendente" className="text-gray-900">Pendente</option>
                  <option value="Vencido" className="text-gray-900">Vencido</option>
                  <option value="Recebido" className="text-gray-900">Recebido</option>
                  <option value="Parcial" className="text-gray-900">Parcial</option>
                </select>

                <div className="flex bg-white/20 rounded-xl">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-3 rounded-l-xl text-sm font-medium transition-colors ${
                      viewMode === 'cards'
                        ? 'bg-white text-green-600'
                        : 'bg-transparent text-white/70 hover:text-white'
                    }`}
                  >
                    📋 Cards
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-3 rounded-r-xl text-sm font-medium transition-colors ${
                      viewMode === 'table'
                        ? 'bg-white text-green-600'
                        : 'bg-transparent text-white/70 hover:text-white'
                    }`}
                  >
                    📊 Tabela
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo baseado no modo de visualização */}
        {viewMode === 'cards' ? (
          /* Layout em Cards Horizontal */
          <div className="space-y-4 p-6">
            {contas.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">
                  💰 Nenhuma conta a receber encontrada
                </div>
                <p className="text-gray-500 mt-2">
                  Use os filtros ou cadastre uma nova conta
                </p>
              </div>
            ) : (
              contas.map((conta) => (
                <div key={conta.id} className="conta-card bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  {/* Layout Horizontal */}
                  <div className="flex items-center p-6">
                    {/* Seção de Informações Principais - 30% */}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="codigo-badge-card flex-shrink-0">
                          {conta.codigo}
                        </span>
                        <span className={`status-badge-card flex-shrink-0 ${
                          conta.status === 'Recebido' ? 'bg-green-100 text-green-800' :
                          conta.status === 'Parcial' ? 'bg-yellow-100 text-yellow-800' :
                          conta.status === 'Vencido' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {conta.status}
                        </span>
                      </div>
                      <h3 className="card-title font-bold text-gray-900 text-lg mb-1 truncate">
                        {conta.paciente}
                      </h3>
                      <p className="card-procedimento text-gray-600 text-sm mb-2 truncate">
                        {conta.procedimento}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="categoria-icon-card">
                          {conta.categoria === 'Consulta' ? '🩺' :
                           conta.categoria === 'Limpeza' ? '🦷' :
                           conta.categoria === 'Restauração' ? '🔧' :
                           conta.categoria === 'Endodontia' ? '🦴' :
                           conta.categoria === 'Ortodontia' ? '😬' :
                           conta.categoria === 'Cirurgia' ? '⚕️' :
                           conta.categoria === 'Prótese' ? '🦷' :
                           conta.categoria === 'Implante' ? '🔩' :
                           conta.categoria === 'Clareamento' ? '✨' : '📋'}
                        </span>
                        <span className="categoria-text-card text-sm text-gray-600">
                          {conta.categoria}
                        </span>
                        <span className={`prioridade-badge-card ml-2 ${
                          conta.prioridade === 'Crítica' ? 'bg-red-100 text-red-800' :
                          conta.prioridade === 'Alta' ? 'bg-orange-100 text-orange-800' :
                          conta.prioridade === 'Média' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {conta.prioridade}
                        </span>
                      </div>
                    </div>

                    {/* Seção de Valores - 25% */}
                    <div className="flex-none w-64 px-6 border-l border-gray-200">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">Original</div>
                          <div className="text-lg font-bold text-blue-600">
                            R$ {conta.valor_original.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <div className="text-center flex-1">
                            <div className="text-xs text-gray-500 mb-1">Recebido</div>
                            <div className="font-semibold text-green-600">
                              R$ {conta.valor_recebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div className="text-center flex-1">
                            <div className="text-xs text-gray-500 mb-1">Pendente</div>
                            <div className="font-semibold text-red-600">
                              R$ {conta.valor_pendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Seção de Datas e Info - 25% */}
                    <div className="flex-none w-48 px-6 border-l border-gray-200">
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700 block">Vencimento:</span>
                          <span className="text-gray-600">
                            {new Date(conta.data_vencimento).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        {conta.data_recebimento && (
                          <div>
                            <span className="font-medium text-gray-700 block">Recebimento:</span>
                            <span className="text-gray-600">
                              {new Date(conta.data_recebimento).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        )}
                        {conta.convenio && (
                          <div>
                            <span className="font-medium text-gray-700 block">Convênio:</span>
                            <span className="text-gray-600">{conta.convenio}</span>
                          </div>
                        )}
                        {conta.forma_pagamento && (
                          <div>
                            <span className="font-medium text-gray-700 block">Pagamento:</span>
                            <span className="text-gray-600">{conta.forma_pagamento}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Seção de Ações - 20% */}
                    <div className="flex-none w-40 pl-6 border-l border-gray-200">
                      <div className="flex flex-col gap-2">
                        {conta.status !== 'Recebido' && (
                          <button
                            onClick={() => onReceive && onReceive(conta)}
                            className="btn-card btn-receber-card w-full text-xs py-2"
                          >
                            💰 Recebercr
                          </button>
                        )}
                        <button
                          onClick={() => onEdit && onEdit(conta)}
                          className="btn-card btn-editar-card w-full text-xs py-2"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => onDelete && onDelete(conta.id)}
                          className="btn-card btn-excluir-card w-full text-xs py-2"
                        >
                          🗑️ Excluir
                        </button>
                      </div>
                      
                      {/* Observações em formato compacto */}
                      {conta.observacoes && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                          <div className="font-medium text-gray-700 mb-1">Obs:</div>
                          <div className="text-gray-600 line-clamp-2">{conta.observacoes}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Container Principal da Tabela */
          <div className="table-container bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-32">
                    <div className="column-header flex items-center">
                      Código
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-48">
                    <div className="column-header flex items-center">
                      Paciente
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-64">
                    <div className="column-header flex items-center">
                      Procedimento
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-32">
                    <div className="column-header flex items-center justify-center">
                      Categoria
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-32">
                    <div className="column-header flex items-center justify-center">
                      Valor
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-28">
                    <div className="column-header flex items-center justify-center">
                      Vencimento
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-24">
                    <div className="column-header flex items-center justify-center">
                      Status
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-24">
                    <div className="column-header flex items-center justify-center">
                      Prioridade
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
                        <p className="loading-text">Carregando contas a receber</p>
                        <p className="loading-subtext">Aguarde um momento...</p>
                      </div>
                    </td>
                  </tr>
                ) : contas.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="empty-container">
                        <div className="empty-icon">
                          <span>💰</span>
                        </div>
                        <h3 className="empty-title">Nenhuma conta encontrada</h3>
                        <p className="empty-description">
                          {search ? 'Nenhuma conta corresponde aos critérios de busca' : 'Comece cadastrando a primeira conta'}
                        </p>
                        {!search && (
                          <button 
                            onClick={onCreate}
                            className="empty-action">
                            Cadastrar Primeira Conta
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  contas.map((conta, index) => (
                    <tr key={conta.id} className={`transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      {/* Código */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="codigo-badge">{conta.codigo}</span>
                      </td>

                      {/* Paciente */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{conta.paciente}</div>
                        {conta.convenio && (
                          <div className="text-xs text-blue-600">Convênio: {conta.convenio}</div>
                        )}
                      </td>

                      {/* Procedimento */}
                      <td className="px-4 py-3">
                        <div>
                          <div className="conta-procedimento font-medium text-gray-900">{conta.procedimento}</div>
                          {conta.observacoes && (
                            <div className="text-sm text-gray-500 mt-1">{conta.observacoes}</div>
                          )}
                        </div>
                      </td>

                      {/* Categoria */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <div className="categoria-container">
                          <span className="categoria-icon">{getCategoriaIcon(conta.categoria)}</span>
                          <span className="categoria-text">{conta.categoria}</span>
                        </div>
                      </td>

                      {/* Valor */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <div className="valor-info">
                          <div className="text-sm font-bold text-gray-900">{formatCurrency(conta.valor_original)}</div>
                          {conta.valor_recebido > 0 && (
                            <div className="text-xs text-green-600">Recebido: {formatCurrency(conta.valor_recebido)}</div>
                          )}
                          {conta.valor_pendente > 0 && (
                            <div className="text-xs text-red-600">Pendente: {formatCurrency(conta.valor_pendente)}</div>
                          )}
                        </div>
                      </td>

                      {/* Vencimento */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <div className="date-info">
                          <div className="date-main text-sm text-gray-900">
                            {formatDate(conta.data_vencimento)}
                          </div>
                          {conta.data_recebimento && (
                            <div className="text-xs text-green-600">
                              Recebido: {formatDate(conta.data_recebimento)}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <span className={`status-badge ${getStatusColor(conta.status)}`}>
                          {conta.status}
                        </span>
                      </td>

                      {/* Prioridade */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <span className={`prioridade-badge ${getPrioridadeColor(conta.prioridade)}`}>
                          {conta.prioridade}
                        </span>
                      </td>

                      {/* Ações */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <div className="action-buttons">
                          {conta.status !== 'Recebido' && (
                            <button 
                              onClick={() => onReceive && onReceive(conta)}
                              className="action-btn btn-receber" 
                              title="Receber Pagamento">
                              Receber
                            </button>
                          )}
                          <button 
                            onClick={() => onEdit && onEdit(conta)}
                            className="action-btn btn-editar"
                            title="Editar Conta">
                            Editar
                          </button>
                          <button 
                            onClick={() => onDelete && onDelete(conta.id)}
                            className="action-btn btn-excluir" 
                            title="Excluir Conta">
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
        )}

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
                    contas
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

export default ContasReceberList;