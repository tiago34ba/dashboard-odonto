import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Financeiro/FinanceiroDashboard.css';
import api from '../../../../components/api/api';
import ContasReceberList, { ContaReceber } from '../components/ContasReceber/ContasReceberList';

interface DashboardTotais {
  vencidas: number;
  vencente_hoje: number;
  vencente_amanha: number;
  recebidas: number;
  total_periodo: number;
  todas_pendentes: number;
}

interface SelectOption {
  id: number;
  label: string;
}

const categorias = [
  'Consulta',
  'Limpeza',
  'Restauração',
  'Endodontia',
  'Ortodontia',
  'Cirurgia',
  'Prótese',
  'Implante',
  'Clareamento',
  'Outros',
] as const;

const prioridades = ['Baixa', 'Média', 'Alta', 'Crítica'] as const;

const ContasReceberPage: React.FC = () => {
  const navigate = useNavigate();
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totais, setTotais] = useState<DashboardTotais>({
    vencidas: 0,
    vencente_hoje: 0,
    vencente_amanha: 0,
    recebidas: 0,
    total_periodo: 0,
    todas_pendentes: 0,
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

  const [patientsOptions, setPatientsOptions] = useState<SelectOption[]>([]);
  const [procedureOptions, setProcedureOptions] = useState<SelectOption[]>([]);

  const [editingConta, setEditingConta] = useState<ContaReceber | null>(null);
  const [receivingConta, setReceivingConta] = useState<ContaReceber | null>(null);

  const [formConta, setFormConta] = useState({
    paciente_id: 0,
    procedure_id: 0,
    categoria: 'Consulta',
    valor_original: 0,
    data_vencimento: '',
    prioridade: 'Média',
    convenio: '',
    observacoes: '',
  });

  const [formRecebimento, setFormRecebimento] = useState({
    valor_recebimento: 0,
    data_recebimento: new Date().toISOString().slice(0, 10),
    forma_pagamento: 'Pix',
    observacoes: '',
  });

  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (dataInicio) params.data_inicio = dataInicio;
      if (dataFim) params.data_fim = dataFim;
      const response = await api.get('/financeiro/contas-receber/dashboard', { params });
      setTotais(response.data?.data?.totalizadores ?? totais);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao carregar dashboard de contas a receber');
    } finally {
      setLoading(false);
    }
  }, [dataInicio, dataFim, totais]);

  const fetchReferences = useCallback(async () => {
    try {
      const [patientsRes, proceduresRes] = await Promise.all([
        api.get('/pessoas/pacientes', { params: { per_page: 200 } }),
        api.get('/procedures', { params: { per_page: 200 } }),
      ]);

      const patientRows = Array.isArray(patientsRes.data?.data?.data)
        ? patientsRes.data.data.data
        : Array.isArray(patientsRes.data?.data)
          ? patientsRes.data.data
          : [];

      const procedureRows = Array.isArray(proceduresRes.data?.data?.data)
        ? proceduresRes.data.data.data
        : Array.isArray(proceduresRes.data?.data)
          ? proceduresRes.data.data
          : [];

      setPatientsOptions(patientRows.map((p: any) => ({ id: Number(p.id), label: p.name ?? p.nome ?? `Paciente #${p.id}` })));
      setProcedureOptions(procedureRows.map((p: any) => ({ id: Number(p.id), label: p.name ?? p.nome ?? `Procedimento #${p.id}` })));
    } catch {
      setPatientsOptions([]);
      setProcedureOptions([]);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    fetchReferences();
  }, [fetchReferences]);

  const refreshAll = async () => {
    await fetchDashboard();
    setRefreshKey((prev) => prev + 1);
    window.dispatchEvent(new Event('dashboard:cards:refresh'));
  };

  const handleOpenCreate = () => {
    setEditingConta(null);
    setFormConta({
      paciente_id: patientsOptions[0]?.id ?? 0,
      procedure_id: procedureOptions[0]?.id ?? 0,
      categoria: 'Consulta',
      valor_original: 0,
      data_vencimento: new Date().toISOString().slice(0, 10),
      prioridade: 'Média',
      convenio: '',
      observacoes: '',
    });
    setShowCreateModal(true);
  };

  const handleEdit = (conta: ContaReceber) => {
    setEditingConta(conta);
    setFormConta({
      paciente_id: Number(conta.paciente_id ?? patientsOptions[0]?.id ?? 0),
      procedure_id: Number(conta.procedure_id ?? procedureOptions[0]?.id ?? 0),
      categoria: conta.categoria,
      valor_original: Number(conta.valor_original ?? 0),
      data_vencimento: conta.data_vencimento?.slice(0, 10) ?? '',
      prioridade: conta.prioridade,
      convenio: conta.convenio ?? '',
      observacoes: conta.observacoes ?? '',
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Deseja excluir esta conta a receber?')) return;

    try {
      setLoading(true);
      setError(null);
      await api.delete(`/financeiro/contas-receber/${id}`);
      await refreshAll();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao excluir conta a receber');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleReceive = (conta: ContaReceber) => {
    setReceivingConta(conta);
    setFormRecebimento({
      valor_recebimento: Number(conta.valor_pendente ?? 0),
      data_recebimento: new Date().toISOString().slice(0, 10),
      forma_pagamento: conta.forma_pagamento ?? 'Pix',
      observacoes: '',
    });
    setShowReceiveModal(true);
  };

  const handleSubmitConta = async () => {
    if (!formConta.paciente_id || !formConta.procedure_id) {
      setError('Selecione paciente e procedimento.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      if (editingConta) {
        await api.put(`/financeiro/contas-receber/${editingConta.id}`, formConta);
      } else {
        await api.post('/financeiro/contas-receber', formConta);
      }
      setShowCreateModal(false);
      setShowEditModal(false);
      setEditingConta(null);
      await refreshAll();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao salvar conta a receber');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRecebimento = async () => {
    if (!receivingConta) return;
    const maximo = Number(receivingConta.valor_pendente ?? 0);
    const valor = Number(formRecebimento.valor_recebimento);
    if (!Number.isFinite(valor) || valor <= 0 || valor > maximo) {
      setError(`Valor inválido. Informe entre 0,01 e ${formatCurrency(maximo)}.`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.patch(`/financeiro/contas-receber/${receivingConta.id}/receber`, formRecebimento);
      setShowReceiveModal(false);
      setReceivingConta(null);
      await refreshAll();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao registrar recebimento');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusCardClick = (status?: string) => {
    setFilterStatus(status);
    navigate('/dashboard/financeiro/contas-receber');
  };

  return (
    <div className="financeiro-dashboard-new">
      <div className="dashboard-header-new">
        {error && (
          <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 8, border: '1px solid #ef4444', background: '#fee2e2', color: '#b91c1c' }}>
            {error}
          </div>
        )}

        <div className="header-top">
          <button onClick={handleOpenCreate} className="btn-adicionar-conta">+ Adicionar Conta</button>

          <div className="filtros-data">
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="input-data"
              placeholder="Data início"
            />
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="input-data"
              placeholder="Data fim"
            />
            <button onClick={fetchDashboard} className="btn-relatorio">📊</button>
          </div>
        </div>

        <div className="cards-status">
          <div className="card-status vencidas" style={{ cursor: 'pointer' }} onClick={() => handleStatusCardClick('Vencido')} title="Filtrar vencidas">
            <div className="card-icon">💥</div>
            <div className="card-content"><div className="card-label">Vencidas</div><div className="card-value">{loading ? '...' : formatCurrency(totais.vencidas)}</div></div>
          </div>

          <div className="card-status vence-hoje" style={{ cursor: 'pointer' }} onClick={() => handleStatusCardClick('Pendente')} title="Filtrar pendentes">
            <div className="card-icon">⏰</div>
            <div className="card-content"><div className="card-label">Vence Hoje</div><div className="card-value">{loading ? '...' : formatCurrency(totais.vencente_hoje)}</div></div>
          </div>

          <div className="card-status vence-amanha" style={{ cursor: 'pointer' }} onClick={() => handleStatusCardClick('Pendente')} title="Filtrar pendentes">
            <div className="card-icon">📅</div>
            <div className="card-content"><div className="card-label">Vence Amanhã</div><div className="card-value">{loading ? '...' : formatCurrency(totais.vencente_amanha)}</div></div>
          </div>

          <div className="card-status recebidas" style={{ cursor: 'pointer' }} onClick={() => handleStatusCardClick('Recebido')} title="Filtrar recebidas">
            <div className="card-icon">✅</div>
            <div className="card-content"><div className="card-label">Recebidas</div><div className="card-value">{loading ? '...' : formatCurrency(totais.recebidas)}</div></div>
          </div>

          <div className="card-status total" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/financeiro')} title="Ir para módulo Financeiro">
            <div className="card-icon">💰</div>
            <div className="card-content"><div className="card-label">Total</div><div className="card-value">{loading ? '...' : formatCurrency(totais.total_periodo)}</div></div>
          </div>

          <div className="card-status todas-pendentes" style={{ cursor: 'pointer' }} onClick={() => handleStatusCardClick('Pendente')} title="Filtrar pendentes">
            <div className="card-icon">📋</div>
            <div className="card-content"><div className="card-label">Todas Pendentes</div><div className="card-value">{loading ? '...' : formatCurrency(totais.todas_pendentes)}</div></div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <ContasReceberList
          onCreate={handleOpenCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReceive={handleReceive}
          filterStatus={filterStatus}
          refreshKey={refreshKey}
        />
      </div>

      {(showCreateModal || showEditModal) && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 700 }}>
            <button className="modal-close" onClick={() => { setShowCreateModal(false); setShowEditModal(false); setEditingConta(null); }}>&times;</button>
            <h2 className="modal-title">{editingConta ? 'Editar Conta a Receber' : 'Nova Conta a Receber'}</h2>
            <div className="modal-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Paciente *</label>
                  <select value={formConta.paciente_id} onChange={(e) => setFormConta((prev) => ({ ...prev, paciente_id: Number(e.target.value) }))}>
                    <option value={0}>Selecione</option>
                    {patientsOptions.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>Procedimento *</label>
                  <select value={formConta.procedure_id} onChange={(e) => setFormConta((prev) => ({ ...prev, procedure_id: Number(e.target.value) }))}>
                    <option value={0}>Selecione</option>
                    {procedureOptions.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Categoria *</label>
                  <select value={formConta.categoria} onChange={(e) => setFormConta((prev) => ({ ...prev, categoria: e.target.value }))}>
                    {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>Prioridade *</label>
                  <select value={formConta.prioridade} onChange={(e) => setFormConta((prev) => ({ ...prev, prioridade: e.target.value }))}>
                    {prioridades.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Valor Original *</label>
                  <input type="number" min={0} step={0.01} value={formConta.valor_original} onChange={(e) => setFormConta((prev) => ({ ...prev, valor_original: Number(e.target.value || 0) }))} />
                </div>
                <div className="form-field">
                  <label>Data de Vencimento *</label>
                  <input type="date" value={formConta.data_vencimento} onChange={(e) => setFormConta((prev) => ({ ...prev, data_vencimento: e.target.value }))} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Convênio</label>
                  <input value={formConta.convenio} onChange={(e) => setFormConta((prev) => ({ ...prev, convenio: e.target.value }))} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field" style={{ flex: 1 }}>
                  <label>Observações</label>
                  <textarea rows={3} value={formConta.observacoes} onChange={(e) => setFormConta((prev) => ({ ...prev, observacoes: e.target.value }))} />
                </div>
              </div>

              <div className="button-container" style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => { setShowCreateModal(false); setShowEditModal(false); setEditingConta(null); }}>Cancelar</button>
                <button type="button" className="btn-primary" onClick={handleSubmitConta}>Salvar Conta</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReceiveModal && receivingConta && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 560 }}>
            <button className="modal-close" onClick={() => { setShowReceiveModal(false); setReceivingConta(null); }}>&times;</button>
            <h2 className="modal-title">Registrar Recebimento</h2>
            <div className="modal-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Conta</label>
                  <input value={`${receivingConta.codigo} - ${receivingConta.paciente}`} disabled />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Valor Recebimento *</label>
                  <input
                    type="number"
                    min={0.01}
                    max={Number(receivingConta.valor_pendente ?? 0)}
                    step={0.01}
                    value={formRecebimento.valor_recebimento}
                    onChange={(e) => setFormRecebimento((prev) => ({ ...prev, valor_recebimento: Number(e.target.value || 0) }))}
                  />
                </div>
                <div className="form-field">
                  <label>Data Recebimento *</label>
                  <input
                    type="date"
                    value={formRecebimento.data_recebimento}
                    onChange={(e) => setFormRecebimento((prev) => ({ ...prev, data_recebimento: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Forma de Pagamento *</label>
                  <select
                    value={formRecebimento.forma_pagamento}
                    onChange={(e) => setFormRecebimento((prev) => ({ ...prev, forma_pagamento: e.target.value }))}
                  >
                    <option value="Pix">Pix</option>
                    <option value="Boleto">Boleto</option>
                    <option value="Transferência">Transferência</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Cartão de Débito">Cartão de Débito</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field" style={{ flex: 1 }}>
                  <label>Observações</label>
                  <textarea rows={3} value={formRecebimento.observacoes} onChange={(e) => setFormRecebimento((prev) => ({ ...prev, observacoes: e.target.value }))} />
                </div>
              </div>

              <div className="button-container" style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => { setShowReceiveModal(false); setReceivingConta(null); }}>Cancelar</button>
                <button type="button" className="btn-primary" onClick={handleSubmitRecebimento}>Confirmar Recebimento</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContasReceberPage;
