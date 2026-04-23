import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FiXCircle } from 'react-icons/fi';
import api from '../../../components/api/api';

type Option = { value: string; label: string };

export type SaasCrudModuleConfig = {
  id: string;
  title: string;
  subtitle: string;
  apiPath: string;
  submodulos: Option[];
};

type Item = {
  id: number;
  nome: string;
  codigo: string;
  submodulo: string;
  status: string;
  prioridade: string;
  owner_nome?: string;
  owner_email?: string;
  descricao?: string;
  receita_mensal?: number;
  custo_mensal?: number;
  conformidade_score?: number;
};

type Props = {
  config: SaasCrudModuleConfig;
  isActive: boolean;
};

const emptyForm = {
  nome: '',
  codigo: '',
  submodulo: '',
  status: 'ativo',
  prioridade: 'media',
  owner_nome: '',
  owner_email: '',
  descricao: '',
  receita_mensal: 0,
  custo_mensal: 0,
  conformidade_score: 0,
  ativo: true,
};

const SaasCrudModuleSection: React.FC<Props> = ({ config, isActive }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [submodulo, setSubmodulo] = useState('');
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const nomeInputRef = useRef<HTMLInputElement | null>(null);

  const submoduloLabelMap = useMemo(() => {
    return new Map(config.submodulos.map((entry) => [entry.value, entry.label]));
  }, [config.submodulos]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(config.apiPath, {
        params: {
          search: search || undefined,
          submodulo: submodulo || undefined,
          status: status || undefined,
          per_page: 50,
        },
      });
      setItems(Array.isArray(response?.data?.data) ? response.data.data : []);
    } catch (error: any) {
      setMsg(error?.response?.data?.message || 'Erro ao carregar dados do modulo.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [config.apiPath, search, submodulo, status]);

  useEffect(() => {
    if (isActive) {
      fetchItems();
    }
  }, [isActive, fetchItems]);

  useEffect(() => {
    if (!modalOpen) return;

    nomeInputRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setModalOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [modalOpen]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, submodulo: config.submodulos[0]?.value || '' });
    setModalOpen(true);
  };

  const openEdit = (item: Item) => {
    setEditing(item);
    setForm({
      nome: item.nome || '',
      codigo: item.codigo || '',
      submodulo: item.submodulo || config.submodulos[0]?.value || '',
      status: item.status || 'ativo',
      prioridade: item.prioridade || 'media',
      owner_nome: item.owner_nome || '',
      owner_email: item.owner_email || '',
      descricao: item.descricao || '',
      receita_mensal: Number(item.receita_mensal || 0),
      custo_mensal: Number(item.custo_mensal || 0),
      conformidade_score: Number(item.conformidade_score || 0),
      ativo: true,
    });
    setModalOpen(true);
  };

  const saveItem = async () => {
    setSaving(true);
    try {
      if (editing) {
        await api.put(`${config.apiPath}/${editing.id}`, form);
        setMsg('Registro atualizado com sucesso.');
      } else {
        await api.post(config.apiPath, form);
        setMsg('Registro criado com sucesso.');
      }
      setModalOpen(false);
      fetchItems();
    } catch (error: any) {
      setMsg(error?.response?.data?.message || 'Erro ao salvar registro.');
    } finally {
      setSaving(false);
    }
  };

  const canSubmit =
    form.nome.trim().length > 0 &&
    form.codigo.trim().length > 0 &&
    form.submodulo.trim().length > 0;

  const removeItem = async (item: Item) => {
    if (!window.confirm(`Excluir ${item.nome}?`)) return;

    try {
      await api.delete(`${config.apiPath}/${item.id}`);
      setMsg('Registro excluido com sucesso.');
      fetchItems();
    } catch (error: any) {
      setMsg(error?.response?.data?.message || 'Erro ao excluir registro.');
    }
  };

  return (
    <section className="saas-mensalidades-wrap">
      <div className="saas-mensalidades-head">
        <h2>{config.title}</h2>
        <small>{config.subtitle}</small>
      </div>

      {msg ? <div className="saas-acao-msg">{msg}</div> : null}

      <div className="saas-mensalidades-filters">
        <input
          type="text"
          placeholder="Buscar por nome, codigo ou owner"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={submodulo} onChange={(e) => setSubmodulo(e.target.value)}>
          <option value="">Todos os submodulos</option>
          {config.submodulos.map((entry) => (
            <option key={entry.value} value={entry.value}>{entry.label}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
          <option value="arquivado">Arquivado</option>
        </select>
        <button type="button" className="saas-refresh-btn" onClick={fetchItems}>Atualizar</button>
        <button type="button" className="saas-refresh-btn" onClick={openCreate}>Inserir</button>
      </div>

      <div className="saas-mensalidades-table-wrap">
        <table className="saas-mensalidades-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Submodulo</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Receita</th>
              <th>Custo</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7}>Carregando...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7}>Nenhum registro encontrado.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.nome}</strong>
                    <div><small>{item.codigo}</small></div>
                  </td>
                  <td>{submoduloLabelMap.get(item.submodulo) || item.submodulo}</td>
                  <td><span className={`saas-status-chip ${item.status}`}>{item.status}</span></td>
                  <td>
                    <div>{item.owner_nome || '--'}</div>
                    <small>{item.owner_email || '--'}</small>
                  </td>
                  <td>{Number(item.receita_mensal || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td>{Number(item.custo_mensal || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td>
                    <div className="saas-actions-inline">
                      <button type="button" className="saas-inline-btn" onClick={() => openEdit(item)}>Editar</button>
                      <button type="button" className="saas-inline-btn danger" onClick={() => removeItem(item)}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen ? (
        <div
          className="saas-modal-overlay saas-crud-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModalOpen(false);
            }
          }}
        >
          <div className="saas-modal saas-plan-modal saas-crud-modal" role="dialog" aria-modal="true">
            <div className="saas-plan-modal-head saas-crud-modal-head">
              <div>
                <h3>{editing ? 'Editar registro' : 'Inserir registro'}</h3>
                <small>{config.title}</small>
              </div>
              <button
                type="button"
                className="saas-plan-modal-close"
                aria-label="Fechar modal"
                onClick={() => setModalOpen(false)}
              >
                <FiXCircle />
              </button>
            </div>

            <form
              className="saas-plan-form saas-crud-modal-body"
              onSubmit={(event) => {
                event.preventDefault();
                if (!canSubmit || saving) return;
                saveItem();
              }}
            >
            <div className="saas-plan-form-grid three saas-crud-form-grid">
              <label>
                <span>Nome</span>
                <input
                  ref={nomeInputRef}
                  value={form.nome}
                  required
                  onChange={(e) => setForm((prev) => ({ ...prev, nome: e.target.value }))}
                />
              </label>
              <label>
                <span>Codigo</span>
                <input
                  value={form.codigo}
                  required
                  onChange={(e) => setForm((prev) => ({ ...prev, codigo: e.target.value }))}
                />
              </label>
              <label>
                <span>Submodulo</span>
                <select
                  value={form.submodulo}
                  required
                  onChange={(e) => setForm((prev) => ({ ...prev, submodulo: e.target.value }))}
                >
                  {config.submodulos.map((entry) => (
                    <option key={entry.value} value={entry.value}>{entry.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="saas-plan-form-grid three saas-crud-form-grid">
              <label>
                <span>Status</span>
                <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="arquivado">Arquivado</option>
                </select>
              </label>
              <label>
                <span>Prioridade</span>
                <select value={form.prioridade} onChange={(e) => setForm((prev) => ({ ...prev, prioridade: e.target.value }))}>
                  <option value="baixa">Baixa</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="critica">Critica</option>
                </select>
              </label>
              <label>
                <span>Conformidade (%)</span>
                <input type="number" min={0} max={100} value={form.conformidade_score} onChange={(e) => setForm((prev) => ({ ...prev, conformidade_score: Number(e.target.value || 0) }))} />
              </label>
            </div>

            <div className="saas-plan-form-grid three saas-crud-form-grid">
              <label>
                <span>Owner</span>
                <input value={form.owner_nome} onChange={(e) => setForm((prev) => ({ ...prev, owner_nome: e.target.value }))} />
              </label>
              <label>
                <span>Email Owner</span>
                <input value={form.owner_email} onChange={(e) => setForm((prev) => ({ ...prev, owner_email: e.target.value }))} />
              </label>
              <label>
                <span>Receita mensal</span>
                <input type="number" min={0} step="0.01" value={form.receita_mensal} onChange={(e) => setForm((prev) => ({ ...prev, receita_mensal: Number(e.target.value || 0) }))} />
              </label>
            </div>

            <div className="saas-plan-form-grid two saas-crud-form-grid">
              <label>
                <span>Custo mensal</span>
                <input type="number" min={0} step="0.01" value={form.custo_mensal} onChange={(e) => setForm((prev) => ({ ...prev, custo_mensal: Number(e.target.value || 0) }))} />
              </label>
              <label>
                <span>Descricao</span>
                <input value={form.descricao} onChange={(e) => setForm((prev) => ({ ...prev, descricao: e.target.value }))} />
              </label>
            </div>

            <div className="saas-plan-modal-actions saas-crud-modal-actions">
              <button type="button" className="saas-modal-cancel" onClick={() => setModalOpen(false)} disabled={saving}>Cancelar</button>
              <button type="submit" className="saas-modal-confirm pagamento" disabled={saving || !canSubmit}>
                {saving ? 'Salvando...' : editing ? 'Salvar alteracoes' : 'Inserir registro'}
              </button>
            </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default SaasCrudModuleSection;
