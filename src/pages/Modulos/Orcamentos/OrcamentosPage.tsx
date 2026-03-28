import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './OrcamentosPage.css';
import api from '../../../components/api/api';

interface ProcedimentoLinha {
  id: number;
  nome: string;
  quantidade: number;
  valorUnit: number;
  total: number;
}

interface PacienteOption {
  id: number;
  name: string;
}

interface ProcedureOption {
  id: number;
  name: string;
  value: number;
}

interface Orcamento {
  id: number;
  numero: string;
  tipo: string;
  valor: number;
  cliente: string;
  paciente_id: number;
  status: 'Concluído' | 'Pendente' | 'Aprovado' | 'Rejeitado';
  data: string;
  diasValidade: number;
  procedimentos: ProcedimentoLinha[];
  desconto: number;
  descontoTipo: '%' | 'R$';
  formaPagamento: string;
  profissional: string;
  odontograma?: string;
  observacoes?: string;
}

interface OrcamentoFormData {
  id?: number;
  pacienteId: string;
  tipo: string;
  status: 'Concluído' | 'Pendente' | 'Aprovado' | 'Rejeitado';
  diasValidade: string;
  procedimentos: ProcedimentoLinha[];
  desconto: string;
  descontoTipo: '%' | 'R$';
  formaPagamento: string;
  profissional: string;
  odontograma: string;
  observacoes: string;
}

const statusOptions: Array<Orcamento['status']> = ['Concluído', 'Pendente', 'Aprovado', 'Rejeitado'];
const formasPagamento = ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'PIX', 'Transferência', 'Boleto'];

const initialFormData: OrcamentoFormData = {
  pacienteId: '',
  tipo: '',
  status: 'Pendente',
  diasValidade: '30',
  procedimentos: [],
  desconto: '0',
  descontoTipo: '%',
  formaPagamento: 'Dinheiro',
  profissional: '',
  odontograma: '',
  observacoes: '',
};

const OrcamentosPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [showResultsPerPage, setShowResultsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [pacientes, setPacientes] = useState<PacienteOption[]>([]);
  const [procedimentosDisponiveis, setProcedimentosDisponiveis] = useState<ProcedureOption[]>([]);
  const [selectedProcedureId, setSelectedProcedureId] = useState('');
  const [novoProcedimentoQuantidade, setNovoProcedimentoQuantidade] = useState(1);
  const [novoProcedimentoDescricao, setNovoProcedimentoDescricao] = useState('');
  const [formData, setFormData] = useState<OrcamentoFormData>(initialFormData);

  const loadReferenceData = useCallback(async () => {
    const [pacientesRes, proceduresRes] = await Promise.allSettled([
      api.get('/pessoas/pacientes', { params: { per_page: 500 } }),
      api.get('/procedures', { params: { per_page: 500 } }),
    ]);

    if (pacientesRes.status === 'fulfilled') {
      const rawPatients = pacientesRes.value.data?.data?.data
        ?? pacientesRes.value.data?.data
        ?? pacientesRes.value.data
        ?? [];

      setPacientes(
        (Array.isArray(rawPatients) ? rawPatients : []).map((item: any) => ({
          id: Number(item.id),
          name: String(item.name ?? item.nome ?? 'Paciente sem nome'),
        }))
      );
    }

    if (proceduresRes.status === 'fulfilled') {
      const rawProcedures = proceduresRes.value.data?.data?.data
        ?? proceduresRes.value.data?.data
        ?? proceduresRes.value.data
        ?? [];

      setProcedimentosDisponiveis(
        (Array.isArray(rawProcedures) ? rawProcedures : []).map((item: any) => ({
          id: Number(item.id),
          name: String(item.name ?? item.nome ?? 'Procedimento'),
          value: Number(item.price ?? item.valor ?? 0),
        }))
      );
    }
  }, []);

  const normalizeOrcamento = useCallback((item: any): Orcamento => ({
    id: Number(item.id),
    numero: String(item.numero ?? ''),
    tipo: String(item.tipo ?? 'Orçamento'),
    valor: Number(item.valor ?? 0),
    cliente: String(item.paciente?.name ?? item.cliente ?? 'Paciente não informado'),
    paciente_id: Number(item.paciente_id ?? item.paciente?.id ?? 0),
    status: (item.status ?? 'Pendente') as Orcamento['status'],
    data: String(item.data ?? item.created_at ?? ''),
    diasValidade: Number(item.dias_validade ?? 30),
    procedimentos: Array.isArray(item.procedimentos) ? item.procedimentos : [],
    desconto: Number(item.desconto ?? 0),
    descontoTipo: (item.desconto_tipo ?? '%') as '%' | 'R$',
    formaPagamento: String(item.forma_pagamento ?? 'Dinheiro'),
    profissional: String(item.profissional ?? ''),
    odontograma: item.odontograma ?? '',
    observacoes: item.observacoes ?? '',
  }), []);

  const fetchOrcamentos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/treatment-plans', {
        params: {
          page: currentPage,
          per_page: showResultsPerPage,
          search: searchTerm || undefined,
          data_inicio: dataInicio || undefined,
          data_fim: dataFim || undefined,
        },
      });

      const paginator = response.data?.data;
      const items = Array.isArray(paginator?.data) ? paginator.data : [];

      setOrcamentos(items.map(normalizeOrcamento));
      setTotalItems(Number(paginator?.total ?? items.length));
      setLastPage(Number(paginator?.last_page ?? 1));
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao carregar orçamentos');
    } finally {
      setLoading(false);
    }
  }, [currentPage, dataFim, dataInicio, normalizeOrcamento, searchTerm, showResultsPerPage]);

  useEffect(() => {
    loadReferenceData();
  }, [loadReferenceData]);

  useEffect(() => {
    fetchOrcamentos();
  }, [fetchOrcamentos]);

  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

  const formatDate = (date: string) => {
    if (!date) return '-';
    const normalized = date.includes('T') ? date.split('T')[0] : date;
    const [year, month, day] = normalized.split('-');
    return year && month && day ? `${day}/${month}/${year}` : date;
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Concluído': 'status-concluido',
      'Pendente': 'status-pendente',
      'Aprovado': 'status-aprovado',
      'Rejeitado': 'status-rejeitado',
    };

    return statusClasses[status as keyof typeof statusClasses] || 'status-pendente';
  };

  const subtotal = useMemo(
    () => formData.procedimentos.reduce((total, procedimento) => total + procedimento.total, 0),
    [formData.procedimentos]
  );

  const totalComDesconto = useMemo(() => {
    const desconto = Number(formData.desconto || 0);
    if (formData.descontoTipo === '%') {
      return Math.max(subtotal - (subtotal * desconto) / 100, 0);
    }
    return Math.max(subtotal - desconto, 0);
  }, [formData.desconto, formData.descontoTipo, subtotal]);

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedProcedureId('');
    setNovoProcedimentoQuantidade(1);
    setNovoProcedimentoDescricao('');
  };

  const dispatchDashboardRefresh = () => {
    window.dispatchEvent(new Event('dashboard:cards:refresh'));
  };

  const handleOpenModal = (orcamento?: Orcamento) => {
    if (orcamento) {
      setFormData({
        id: orcamento.id,
        pacienteId: String(orcamento.paciente_id),
        tipo: orcamento.tipo,
        status: orcamento.status,
        diasValidade: String(orcamento.diasValidade),
        procedimentos: orcamento.procedimentos ?? [],
        desconto: String(orcamento.desconto),
        descontoTipo: orcamento.descontoTipo,
        formaPagamento: orcamento.formaPagamento,
        profissional: orcamento.profissional,
        odontograma: orcamento.odontograma ?? '',
        observacoes: orcamento.observacoes ?? '',
      });
    } else {
      resetForm();
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleInputChange = (field: keyof OrcamentoFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddProcedimento = () => {
    const selectedProcedure = procedimentosDisponiveis.find((item) => item.id === Number(selectedProcedureId));
    if (!selectedProcedure) return;

    const nome = novoProcedimentoDescricao.trim() || selectedProcedure.name;
    const quantidade = Math.max(1, Number(novoProcedimentoQuantidade || 1));
    const valorUnit = Number(selectedProcedure.value || 0);

    const novoItem: ProcedimentoLinha = {
      id: Date.now(),
      nome,
      quantidade,
      valorUnit,
      total: quantidade * valorUnit,
    };

    setFormData((prev) => ({
      ...prev,
      tipo: prev.tipo || nome,
      procedimentos: [...prev.procedimentos, novoItem],
    }));

    setSelectedProcedureId('');
    setNovoProcedimentoQuantidade(1);
    setNovoProcedimentoDescricao('');
  };

  const handleRemoveProcedimento = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      procedimentos: prev.procedimentos.filter((item) => item.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.pacienteId) {
      setError('Selecione um paciente.');
      return;
    }

    if (!formData.procedimentos.length) {
      setError('Adicione pelo menos um procedimento ao orçamento.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        paciente_id: Number(formData.pacienteId),
        tipo: formData.tipo || formData.procedimentos[0]?.nome || 'Orçamento',
        valor: totalComDesconto,
        status: formData.status,
        data: new Date().toISOString().slice(0, 10),
        dias_validade: Number(formData.diasValidade || 30),
        procedimentos: formData.procedimentos,
        desconto: Number(formData.desconto || 0),
        desconto_tipo: formData.descontoTipo,
        forma_pagamento: formData.formaPagamento,
        profissional: formData.profissional,
        odontograma: formData.odontograma || null,
        observacoes: formData.observacoes || null,
      };

      if (formData.id) {
        await api.put(`/treatment-plans/${formData.id}`, payload);
      } else {
        await api.post('/treatment-plans', payload);
      }

      handleCloseModal();
      await fetchOrcamentos();
      dispatchDashboardRefresh();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao salvar orçamento');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Deseja excluir este orçamento?')) return;

    try {
      setError(null);
      await api.delete(`/treatment-plans/${id}`);
      await fetchOrcamentos();
      dispatchDashboardRefresh();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao excluir orçamento');
    }
  };

  const handleDuplicate = (orcamento: Orcamento) => {
    setFormData({
      id: undefined,
      pacienteId: String(orcamento.paciente_id),
      tipo: `${orcamento.tipo} (Cópia)`,
      status: 'Pendente',
      diasValidade: String(orcamento.diasValidade),
      procedimentos: (orcamento.procedimentos ?? []).map((item) => ({ ...item, id: Date.now() + item.id })),
      desconto: String(orcamento.desconto),
      descontoTipo: orcamento.descontoTipo,
      formaPagamento: orcamento.formaPagamento,
      profissional: orcamento.profissional,
      odontograma: orcamento.odontograma ?? '',
      observacoes: orcamento.observacoes ?? '',
    });
    setShowModal(true);
  };

  const handlePrint = (orcamento: Orcamento) => {
    const popup = window.open('', '_blank', 'width=900,height=700');
    if (!popup) return;

    popup.document.write(`
      <html>
        <head><title>${orcamento.numero}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 24px;">
          <h1>${orcamento.numero}</h1>
          <p><strong>Paciente:</strong> ${orcamento.cliente}</p>
          <p><strong>Tipo:</strong> ${orcamento.tipo}</p>
          <p><strong>Status:</strong> ${orcamento.status}</p>
          <p><strong>Data:</strong> ${formatDate(orcamento.data)}</p>
          <p><strong>Valor:</strong> ${formatCurrency(orcamento.valor)}</p>
          <p><strong>Profissional:</strong> ${orcamento.profissional || '-'}</p>
          <h3>Procedimentos</h3>
          <ul>
            ${(orcamento.procedimentos ?? []).map((item) => `<li>${item.nome} - ${item.quantidade}x - ${formatCurrency(item.total)}</li>`).join('')}
          </ul>
          <p><strong>Observações:</strong> ${orcamento.observacoes || '-'}</p>
        </body>
      </html>
    `);
    popup.document.close();
    popup.print();
  };

  const handleGenerateReport = () => {
    const content = `
Relatório de Orçamentos - ${new Date().toLocaleDateString('pt-BR')}

Período: ${dataInicio || 'início'} até ${dataFim || 'fim'}

Total de registros: ${totalItems}
Pendentes: ${orcamentos.filter((item) => item.status === 'Pendente').length}
Aprovados: ${orcamentos.filter((item) => item.status === 'Aprovado').length}
Concluídos: ${orcamentos.filter((item) => item.status === 'Concluído').length}
Rejeitados: ${orcamentos.filter((item) => item.status === 'Rejeitado').length}

Detalhamento:
${orcamentos.map((item) => `${item.numero} | ${item.cliente} | ${item.status} | ${formatCurrency(item.valor)}`).join('\n')}
    `.trim();

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `relatorio-orcamentos-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="orcamentos-page">
      <div className="orcamentos-header">
        <div className="header-controls">
          <button className="btn-novo-orcamento" onClick={() => handleOpenModal()}>
            + Orçamento
          </button>

          <div className="date-controls">
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="date-input"
            />
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="date-input"
            />
            <button className="btn-relatorio" onClick={handleGenerateReport}>
              📄 Relatório
            </button>
          </div>
        </div>

        <div className="table-controls">
          <div className="results-control">
            <span>Exibir</span>
            <select
              value={showResultsPerPage}
              onChange={(e) => {
                setCurrentPage(1);
                setShowResultsPerPage(Number(e.target.value));
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>resultados por página</span>
          </div>

          <div className="search-control">
            <span>Buscar:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchTerm(e.target.value);
              }}
              className="search-input"
              placeholder="Pesquisar..."
            />
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 16, padding: '10px 12px', borderRadius: 8, border: '1px solid #ef4444', background: '#fee2e2', color: '#b91c1c' }}>
            {error}
          </div>
        )}
      </div>

      <div className="orcamentos-content">
        <div className="table-container">
          <table className="orcamentos-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Cliente</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: 24, textAlign: 'center' }}>Carregando orçamentos...</td>
                </tr>
              ) : orcamentos.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 24, textAlign: 'center' }}>Nenhum orçamento encontrado.</td>
                </tr>
              ) : (
                orcamentos.map((orcamento) => (
                  <tr key={orcamento.id}>
                    <td>
                      <div className="tipo-cell">
                        <span className="tipo-indicator">🔵</span>
                        {orcamento.numero}
                      </div>
                    </td>
                    <td className="valor-cell">{formatCurrency(orcamento.valor)}</td>
                    <td>{orcamento.cliente}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadge(orcamento.status)}`}>
                        {orcamento.status}
                      </span>
                    </td>
                    <td>{formatDate(orcamento.data)}</td>
                    <td className="acoes-cell">
                      <button className="btn-action edit" title="Editar" onClick={() => handleOpenModal(orcamento)}>✏️</button>
                      <button className="btn-action delete" title="Excluir" onClick={() => handleDelete(orcamento.id)}>🗑️</button>
                      <button className="btn-action copy" title="Copiar" onClick={() => handleDuplicate(orcamento)}>📋</button>
                      <button className="btn-action print" title="Imprimir" onClick={() => handlePrint(orcamento)}>🖨️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>Mostrando {orcamentos.length} de {totalItems} registros</span>
          <div className="pagination">
            <button className="btn-pagination" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}>Anterior</button>
            <button className="btn-pagination active">{currentPage}</button>
            <button className="btn-pagination" disabled={currentPage >= lastPage} onClick={() => setCurrentPage((prev) => Math.min(lastPage, prev + 1))}>Próximo</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content-orcamento" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{formData.id ? 'Editar Orçamento' : 'Inserir Registro'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row-top">
                <div className="form-group">
                  <label>Paciente</label>
                  <div className="input-with-button">
                    <select
                      value={formData.pacienteId}
                      onChange={(e) => handleInputChange('pacienteId', e.target.value)}
                      className="form-select"
                      required
                    >
                      <option value="">Selecionar Paciente</option>
                      {pacientes.map((paciente) => (
                        <option key={paciente.id} value={paciente.id}>{paciente.name}</option>
                      ))}
                    </select>
                    <button type="button" className="btn-add" onClick={loadReferenceData}>↻</button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Dias Validade</label>
                  <input
                    type="number"
                    value={formData.diasValidade}
                    onChange={(e) => handleInputChange('diasValidade', e.target.value)}
                    className="form-input"
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Procedimentos</label>
                  <select
                    value={selectedProcedureId}
                    onChange={(e) => setSelectedProcedureId(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Selecionar procedimento</option>
                    {procedimentosDisponiveis.map((proc) => (
                      <option key={proc.id} value={proc.id}>{proc.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Descrição se Houver</label>
                  <div className="input-with-button">
                    <input
                      type="text"
                      value={novoProcedimentoDescricao}
                      onChange={(e) => setNovoProcedimentoDescricao(e.target.value)}
                      className="form-input"
                      placeholder="Descrição para o procedimento"
                    />
                    <button type="button" className="btn-add-proc" onClick={handleAddProcedimento}>✓</button>
                  </div>
                </div>
              </div>

              <div className="procedimentos-section">
                <table className="procedimentos-table">
                  <thead>
                    <tr>
                      <th>Procedimento</th>
                      <th>Quantidade</th>
                      <th>Valor Unit</th>
                      <th>Total</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.procedimentos.map((proc) => (
                      <tr key={proc.id}>
                        <td>{proc.nome}</td>
                        <td>{proc.quantidade}</td>
                        <td>{formatCurrency(proc.valorUnit)}</td>
                        <td>{formatCurrency(proc.total)}</td>
                        <td>
                          <button type="button" className="btn-remove" onClick={() => handleRemoveProcedimento(proc.id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="add-procedimento">
                  <input
                    type="number"
                    value={novoProcedimentoQuantidade}
                    onChange={(e) => setNovoProcedimentoQuantidade(Number(e.target.value))}
                    placeholder="Qtd"
                    className="proc-input-small"
                    min="1"
                  />
                  <button type="button" className="btn-add-proc" onClick={handleAddProcedimento}>+</button>
                </div>

                <div className="subtotal">
                  <span>Itens: ({formData.procedimentos.length})</span>
                  <span>Subtotal: {formatCurrency(subtotal)}</span>
                  <span>Total Final: {formatCurrency(totalComDesconto)}</span>
                </div>
              </div>

              <div className="form-row-bottom">
                <div className="form-group">
                  <label>Tipo</label>
                  <input
                    type="text"
                    value={formData.tipo}
                    onChange={(e) => handleInputChange('tipo', e.target.value)}
                    className="form-input"
                    placeholder="Tipo do orçamento"
                  />
                </div>

                <div className="form-group">
                  <label>Desc</label>
                  <div className="discount-group">
                    <input
                      type="number"
                      value={formData.desconto}
                      onChange={(e) => handleInputChange('desconto', e.target.value)}
                      className="form-input-small"
                      placeholder="Desconto"
                    />
                    <select
                      value={formData.descontoTipo}
                      onChange={(e) => handleInputChange('descontoTipo', e.target.value as '%' | 'R$')}
                      className="form-select-small"
                    >
                      <option value="%">%</option>
                      <option value="R$">R$</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Forma Pgto</label>
                  <select
                    value={formData.formaPagamento}
                    onChange={(e) => handleInputChange('formaPagamento', e.target.value)}
                    className="form-select"
                  >
                    {formasPagamento.map((forma) => (
                      <option key={forma} value={forma}>{forma}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Profissional</label>
                  <input
                    type="text"
                    value={formData.profissional}
                    onChange={(e) => handleInputChange('profissional', e.target.value)}
                    className="form-input"
                    placeholder="Nome do profissional"
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as Orcamento['status'])}
                    className="form-select"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Odontograma</label>
                  <input
                    type="text"
                    value={formData.odontograma}
                    onChange={(e) => handleInputChange('odontograma', e.target.value)}
                    className="form-input"
                    placeholder="Referência do odontograma"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  className="form-textarea"
                  placeholder="Observações adicionais..."
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrcamentosPage;
