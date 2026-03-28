import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './ContasPagarList.css';
import api from '../../../../../components/api/api';

interface ContaPagar {
  id: number;
  codigo: string;
  descricao: string;
  fornecedor: string;
  categoria:
    | 'Equipamentos'
    | 'Materiais'
    | 'Medicamentos'
    | 'Serviços'
    | 'Aluguel'
    | 'Energia'
    | 'Telefone'
    | 'Internet'
    | 'Impostos'
    | 'Outros';
  valor_original: number;
  valor_pago: number;
  valor_pendente: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: 'Pendente' | 'Vencido' | 'Pago' | 'Parcial';
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  observacoes?: string;
  forma_pagamento?: string;
  created_at: string;
}

interface ContasPagarListProps {
  onCreate?: () => void;
  onEdit?: (conta: ContaPagar) => void;
  onDelete?: (id: number) => void;
  onPay?: (conta: ContaPagar) => void;
  filterStatus?: string;
  contaFiltroId?: number | null;
  refreshKey?: number;
}

const ContasPagarList: React.FC<ContasPagarListProps> = ({ onEdit, onDelete, onPay, filterStatus, contaFiltroId, refreshKey = 0 }) => {
  const [contas, setContas] = useState<ContaPagar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage] = useState(15);

  // Filter state
  const [search] = useState('');
  const [filterCategoria] = useState<string>('');
  const [viewMode] = useState<'cards' | 'table'>('cards');

  const fetchContasPagar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page: currentPage, per_page: perPage };
      if (filterStatus) params.status = filterStatus;
      if (filterCategoria) params.categoria = filterCategoria;

      const response = await api.get('/financeiro/contas-pagar', { params });
      const paginator = response.data?.data;
      let items: any[] = paginator?.data ?? [];

      if (contaFiltroId) {
        items = items.filter((conta) => conta.id === contaFiltroId);
      }

      if (search.trim()) {
        const s = search.toLowerCase();
        items = items.filter((conta) =>
          String(conta.descricao ?? '').toLowerCase().includes(s) ||
          String(conta.supplier?.name ?? conta.fornecedor ?? '').toLowerCase().includes(s) ||
          String(conta.codigo ?? '').toLowerCase().includes(s) ||
          String(conta.categoria ?? '').toLowerCase().includes(s)
        );
      }

      const normalized: ContaPagar[] = items.map((conta: any) => ({
        id: conta.id,
        codigo: conta.codigo ?? '',
        descricao: conta.descricao ?? '',
        fornecedor: conta.supplier?.name ?? conta.fornecedor ?? 'Sem fornecedor',
        categoria: conta.categoria ?? 'Outros',
        valor_original: Number(conta.valor_original ?? 0),
        valor_pago: Number(conta.valor_pago ?? 0),
        valor_pendente: Number(conta.valor_pendente ?? 0),
        data_vencimento: conta.data_vencimento ?? '',
        data_pagamento: conta.data_pagamento ?? undefined,
        status: conta.status ?? 'Pendente',
        prioridade: conta.prioridade ?? 'Baixa',
        observacoes: conta.observacoes ?? undefined,
        forma_pagamento: conta.forma_pagamento ?? undefined,
        created_at: conta.created_at ?? '',
      }));

      setContas(normalized);
      setLastPage(Number(paginator?.last_page ?? 1));
      setTotal(Number(paginator?.total ?? normalized.length));
    } catch (err: any) {
      setError(err?.response?.data?.message ?? (err instanceof Error ? err.message : 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, search, filterStatus, filterCategoria, contaFiltroId]);

  useEffect(() => {
    fetchContasPagar();
  }, [fetchContasPagar, refreshKey]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchContasPagar();
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
      case 'Pago': return 'status-pago';
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
      case 'Equipamentos': return '🏥';
      case 'Materiais': return '🦷';
      case 'Medicamentos': return '💊';
      case 'Serviços': return '🔧';
      case 'Aluguel': return '🏢';
      case 'Energia': return '⚡';
      case 'Telefone': return '📞';
      case 'Internet': return '🌐';
      case 'Impostos': return '📋';
      case 'Outros': return '📦';
      default: return '📄';
    }
  };

  // Otimização: usar useMemo para calcular totais apenas quando contas mudam
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { totalOriginal, totalPago, totalPendente } = useMemo(() => {
    const totalOriginal = contas.reduce((sum, conta) => sum + conta.valor_original, 0);
    const totalPago = contas.reduce((sum, conta) => sum + conta.valor_pago, 0);
    const totalPendente = contas.reduce((sum, conta) => sum + conta.valor_pendente, 0);
    return { totalOriginal, totalPago, totalPendente };
  }, [contas]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erro ao carregar dados</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={fetchContasPagar}
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
  <div className="contas-pagar-container py-4 px-2 sm:px-4 lg:px-6">
    <div className="contas-pagar-content max-w-4xl mx-auto">
      {/* Área limpa - apenas os cards do header são exibidos */}
      {viewMode === 'cards' ? (
              <div className="p-4">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="card-skeleton bg-gray-100 rounded-xl p-4 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-3"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contas.map((conta) => (
                      <div
                        key={conta.id}
                        className="conta-card bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-center p-6">
                          {/* Seção de Informações Principais */}
                          <div className="flex-1 min-w-0 pr-6">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="codigo-badge-card flex-shrink-0">{conta.codigo}</span>
                              <span className={`status-badge-card flex-shrink-0 ${getStatusColor(conta.status)}`}>
                                {conta.status}
                              </span>
                            </div>
                            <h4 className="card-title text-lg font-bold text-gray-900 mb-1 truncate">
                              {conta.descricao}
                            </h4>
                            <p className="card-fornecedor text-sm text-gray-600 mb-2 truncate">
                              {conta.fornecedor}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="categoria-icon-card">{getCategoriaIcon(conta.categoria)}</span>
                              <span className="categoria-text-card text-sm text-gray-600">{conta.categoria}</span>
                              <span className={`prioridade-badge-card ml-2 ${getPrioridadeColor(conta.prioridade)}`}>
                                {conta.prioridade}
                              </span>
                            </div>
                          </div>

                          {/* Seção de Valores */}
                          <div className="flex-none w-64 px-6 border-l border-gray-200">
                            <div className="grid grid-cols-1 gap-3">
                              <div className="text-center">
                                <div className="text-xs text-gray-500 mb-1">Valor Original</div>
                                <div className="text-lg font-bold text-blue-600">
                                  {formatCurrency(conta.valor_original)}
                                </div>
                              </div>
                              <div className="flex justify-between text-sm">
                                <div className="text-center flex-1">
                                  <div className="text-xs text-gray-500 mb-1">Pago</div>
                                  <div className="font-semibold text-green-600">
                                    {formatCurrency(conta.valor_pago)}
                                  </div>
                                </div>
                                <div className="text-center flex-1">
                                  <div className="text-xs text-gray-500 mb-1">Pendente</div>
                                  <div className="font-semibold text-red-600">
                                    {formatCurrency(conta.valor_pendente)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Seção de Datas e Info */}
                          <div className="flex-none w-48 px-6 border-l border-gray-200">
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium text-gray-700 block">Vencimento:</span>
                                <span className="text-gray-600">
                                  {formatDate(conta.data_vencimento)}
                                </span>
                              </div>
                              {conta.data_pagamento && (
                                <div>
                                  <span className="font-medium text-gray-700 block">Pagamento:</span>
                                  <span className="text-gray-600">
                                    {formatDate(conta.data_pagamento)}
                                  </span>
                                </div>
                              )}
                              {conta.forma_pagamento && (
                                <div>
                                  <span className="font-medium text-gray-700 block">Forma:</span>
                                  <span className="text-gray-600">{conta.forma_pagamento}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Seção de Ações */}
                          <div className="flex-none w-40 pl-6 border-l border-gray-200">
                            <div className="flex flex-col gap-2">
                              {conta.status !== 'Pago' && (
                                <button
                                  onClick={() => onPay && onPay(conta)}
                                  className="btn-card btn-pagar-card w-full text-xs py-2"
                                >
                                  💳 Pagar
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

                            {conta.observacoes && (
                              <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                                <div className="font-medium text-gray-700 mb-1">Obs:</div>
                                <div className="text-gray-600 line-clamp-2">{conta.observacoes}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Tabela */}
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="table-header">
                    <tr>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-32">
                        <div className="column-header flex items-center">Código</div>
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-64">
                        <div className="column-header flex items-center">Descrição</div>
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-48">
                        <div className="column-header flex items-center">Fornecedor</div>
                      </th>
                      <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-32">
                        <div className="column-header flex items-center justify-center">Categoria</div>
                      </th>
                      <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-32">
                        <div className="column-header flex items-center justify-center">Valor</div>
                      </th>
                      <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-28">
                        <div className="column-header flex items-center justify-center">Vencimento</div>
                      </th>
                      <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-24">
                        <div className="column-header flex items-center justify-center">Status</div>
                      </th>
                      <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-24">
                        <div className="column-header flex items-center justify-center">Prioridade</div>
                      </th>
                      <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-48">
                        <div className="column-header flex items-center justify-center">Ações</div>
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
                            <p className="loading-text">Carregando contas a pagar</p>
                            <p className="loading-subtext">Aguarde um momento...</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      contas.map((conta, index) => (
                        <tr
                          key={conta.id}
                          className={`transition-colors duration-150 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                          {/* Código */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="codigo-badge">{conta.codigo}</span>
                          </td>

                          {/* Descrição */}
                          <td className="px-4 py-3">
                            <div>
                              <div className="conta-descricao font-medium text-gray-900">
                                {conta.descricao}
                              </div>
                              {conta.observacoes && (
                                <div className="text-sm text-gray-500 mt-1">
                                  {conta.observacoes}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Fornecedor */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {conta.fornecedor}
                            </div>
                          </td>

                          {/* Categoria */}
                          <td className="px-3 py-3 whitespace-nowrap text-center">
                            <div className="categoria-container">
                              <span className="categoria-icon">
                                {getCategoriaIcon(conta.categoria)}
                              </span>
                              <span className="categoria-text">{conta.categoria}</span>
                            </div>
                          </td>

                          {/* Valor */}
                          <td className="px-3 py-3 whitespace-nowrap text-center">
                            <div className="valor-info">
                              <div className="text-sm font-bold text-gray-900">
                                {formatCurrency(conta.valor_original)}
                              </div>
                              {conta.valor_pago > 0 && (
                                <div className="text-xs text-green-600">
                                  Pago: {formatCurrency(conta.valor_pago)}
                                </div>
                              )}
                              {conta.valor_pendente > 0 && (
                                <div className="text-xs text-red-600">
                                  Pendente: {formatCurrency(conta.valor_pendente)}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Vencimento */}
                          <td className="px-3 py-3 whitespace-nowrap text-center">
                            <div className="date-info">
                              <div className="date-main text-sm text-gray-900">
                                {formatDate(conta.data_vencimento)}
                              </div>
                              {conta.data_pagamento && (
                                <div className="text-xs text-green-600">
                                  Pago: {formatDate(conta.data_pagamento)}
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
                              {conta.status !== 'Pago' && (
                                <button
                                  onClick={() => onPay && onPay(conta)}
                                  className="action-btn btn-pagar"
                                  title="Efetuar Pagamento"
                                >
                                  Pagar
                                </button>
                              )}
                              <button
                                onClick={() => onEdit && onEdit(conta)}
                                className="action-btn btn-editar"
                                title="Editar Conta"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => onDelete && onDelete(conta.id)}
                                className="action-btn btn-excluir"
                                title="Excluir Conta"
                              >
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
            )}
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
                    <span className="pagination-highlight font-medium">
                      {(currentPage - 1) * perPage + (total === 0 ? 0 : 1)}
                    </span>{' '}
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
                  <nav
                    className="pagination-nav relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
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
      </div>
  );
};

export default ContasPagarList;