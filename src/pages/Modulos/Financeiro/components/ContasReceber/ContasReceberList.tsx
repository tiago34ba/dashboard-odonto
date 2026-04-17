import React, { useCallback, useEffect, useState } from 'react';
import './ContasReceberList.css';
import api from '../../../../../components/api/api';

export interface ContaReceber {
  id: number;
  codigo: string;
  paciente_id?: number | null;
  procedure_id?: number | null;
  paciente: string;
  procedimento: string;
  categoria:
    | 'Consulta'
    | 'Limpeza'
    | 'Restauração'
    | 'Endodontia'
    | 'Ortodontia'
    | 'Cirurgia'
    | 'Prótese'
    | 'Implante'
    | 'Clareamento'
    | 'Outros';
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
  onDelete?: (id: number) => Promise<void> | void;
  onReceive?: (conta: ContaReceber) => void;
  filterStatus?: string;
  contaFiltroId?: number | null;
  refreshKey?: number;
}

const ContasReceberList: React.FC<ContasReceberListProps> = ({
  onCreate,
  onEdit,
  onDelete,
  onReceive,
  filterStatus,
  contaFiltroId,
  refreshKey = 0,
}) => {
  const [contas, setContas] = useState<ContaReceber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const mapApi = (item: any): ContaReceber => ({
    id: Number(item.id),
    codigo: item.codigo ?? '',
    paciente_id: item.paciente_id ?? item.patient_id ?? item.paciente?.id ?? null,
    procedure_id: item.procedure_id ?? item.procedimento_id ?? item.procedure?.id ?? null,
    paciente: item.paciente?.name ?? item.patient?.name ?? item.paciente_nome ?? 'Paciente não informado',
    procedimento: item.procedure?.name ?? item.procedimento?.name ?? item.procedure_name ?? 'Procedimento não informado',
    categoria: item.categoria ?? 'Outros',
    valor_original: Number(item.valor_original ?? 0),
    valor_recebido: Number(item.valor_recebido ?? 0),
    valor_pendente: Number(item.valor_pendente ?? 0),
    data_vencimento: item.data_vencimento ?? '',
    data_recebimento: item.data_recebimento ?? undefined,
    status: item.status ?? 'Pendente',
    prioridade: item.prioridade ?? 'Baixa',
    forma_pagamento: item.forma_pagamento ?? undefined,
    convenio: item.convenio ?? undefined,
    observacoes: item.observacoes ?? undefined,
    created_at: item.created_at ?? '',
  });

  const fetchContas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {
        page: currentPage,
        per_page: 15,
      };
      if (filterStatus) {
        params.status = filterStatus;
      }

      const response = await api.get('/financeiro/contas-receber', { params });
      const paginator = response.data?.data;
      let rows = Array.isArray(paginator?.data) ? paginator.data : [];

      if (contaFiltroId) {
        rows = rows.filter((item: any) => Number(item.id) === Number(contaFiltroId));
      }

      const normalized = rows.map(mapApi);
      setContas(normalized);
      setLastPage(Number(paginator?.last_page ?? 1));
      setTotal(Number(paginator?.total ?? normalized.length));
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao carregar contas a receber');
      setContas([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterStatus, contaFiltroId]);

  useEffect(() => {
    fetchContas();
  }, [fetchContas, refreshKey]);

  const handleDeleteLocal = async (id: number) => {
    if (!onDelete) return;

    try {
      await onDelete(id);
      setContas((prev) => prev.filter((conta) => conta.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch {
      // Erro já tratado no componente pai (ex.: 422 de regra de negocio).
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (value?: string) => {
    if (!value) return '--';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--';
    return date.toLocaleDateString('pt-BR');
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-red-800">Erro ao carregar dados</h3>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <button
          onClick={fetchContas}
          className="mt-4 bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="contas-receber-container py-4 px-2 sm:px-4 lg:px-6">
      <div className="contas-receber-content max-w-4xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Contas a Receber ({total})</h2>
          {onCreate ? (
            <button onClick={onCreate} className="btn-primary text-white px-4 py-2 rounded-lg">
              + Nova Conta
            </button>
          ) : null}
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">Carregando contas...</div>
          ) : contas.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600">
              Nenhuma conta encontrada para os filtros atuais.
            </div>
          ) : (
            contas.map((conta) => (
              <div key={conta.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-gray-500">{conta.codigo}</div>
                    <div className="text-base font-semibold text-gray-900">{conta.paciente}</div>
                    <div className="text-sm text-gray-600">{conta.procedimento}</div>
                    <div className="text-xs text-gray-500">{conta.categoria} • {conta.prioridade}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500">Original</div>
                    <div className="font-semibold text-blue-700">{formatCurrency(conta.valor_original)}</div>
                    <div className="text-xs text-green-700">Recebido: {formatCurrency(conta.valor_recebido)}</div>
                    <div className="text-xs text-red-700">Pendente: {formatCurrency(conta.valor_pendente)}</div>
                  </div>

                  <div className="text-right text-sm text-gray-600">
                    <div>Vencimento: {formatDate(conta.data_vencimento)}</div>
                    <div>Recebimento: {formatDate(conta.data_recebimento)}</div>
                    <div>Status: {conta.status}</div>
                  </div>

                  <div className="flex gap-2">
                    {conta.status !== 'Recebido' && onReceive ? (
                      <button className="btn-card btn-receber-card" onClick={() => onReceive(conta)}>Receber</button>
                    ) : null}
                    {onEdit ? <button className="btn-card btn-editar-card" onClick={() => onEdit(conta)}>Editar</button> : null}
                    {onDelete ? <button className="btn-card btn-excluir-card" onClick={() => void handleDeleteLocal(conta.id)}>Excluir</button> : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {lastPage > 1 ? (
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded border px-3 py-1 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">Página {currentPage} de {lastPage}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(lastPage, prev + 1))}
              disabled={currentPage === lastPage}
              className="rounded border px-3 py-1 disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ContasReceberList;
