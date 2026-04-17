import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FiCheckCircle, FiCopy, FiDownload, FiPrinter, FiXCircle } from 'react-icons/fi';
import api from '../../../../components/api/api';
import { HelpdeskFieldConfig, HelpdeskModuleConfig } from '../../../../modules/helpdesk/types';

type Props = {
  config: HelpdeskModuleConfig;
  isActive: boolean;
};

type ItemRecord = Record<string, any>;

const serializeValue = (field: HelpdeskFieldConfig, value: any) => {
  if (field.type === 'number') {
    return value === '' ? null : Number(value);
  }
  if (field.type === 'list') {
    return String(value || '')
      .split(/\r?\n|,/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return value;
};

const deserializeValue = (field: HelpdeskFieldConfig, value: any) => {
  if (field.type === 'list') {
    return Array.isArray(value) ? value.join('\n') : '';
  }
  if (field.type === 'number') {
    return value ?? 0;
  }
  return value ?? '';
};

const formatCell = (value: any, format: string = 'text') => {
  if (format === 'currency') {
    return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  if (format === 'date') {
    return value ? new Date(value).toLocaleDateString('pt-BR') : '--';
  }
  if (format === 'datetime') {
    return value ? new Date(value).toLocaleString('pt-BR') : '--';
  }
  if (format === 'array') {
    return Array.isArray(value) ? value.join(', ') : '--';
  }
  if (format === 'boolean') {
    return value ? 'Sim' : 'Nao';
  }
  return value ?? '--';
};

const buildInitialForm = (fields: HelpdeskFieldConfig[]) => {
  return fields.reduce<Record<string, any>>((acc, field) => {
    acc[field.key] = field.defaultValue ?? (field.type === 'number' ? 0 : '');
    return acc;
  }, {});
};

const HelpdeskCrudSection: React.FC<Props> = ({ config, isActive }) => {
  const [items, setItems] = useState<ItemRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ItemRecord | null>(null);
  const [form, setForm] = useState<Record<string, any>>(() => buildInitialForm(config.fields));
  const firstInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>(null);

  const queryParams = useMemo(() => {
    return {
      search: search || undefined,
      per_page: 50,
      ...(config.defaultParams ?? {}),
      ...filters,
    };
  }, [filters, search, config.defaultParams]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(config.apiPath, { params: queryParams });
      setItems(Array.isArray(response?.data?.data) ? response.data.data : []);
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Erro ao carregar dados do Helpdesk.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [config.apiPath, queryParams]);

  useEffect(() => {
    if (isActive) {
      fetchItems();
    }
  }, [fetchItems, isActive]);

  useEffect(() => {
    if (!modalOpen) return;
    firstInputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalOpen]);

  const openCreate = () => {
    setEditing(null);
    setForm(buildInitialForm(config.fields));
    setModalOpen(true);
  };

  const openEdit = (item: ItemRecord) => {
    const nextForm = config.fields.reduce<Record<string, any>>((acc, field) => {
      acc[field.key] = deserializeValue(field, item[field.key]);
      return acc;
    }, {});
    setEditing(item);
    setForm(nextForm);
    setModalOpen(true);
  };

  const canSubmit = config.fields.every((field) => !field.required || String(form[field.key] ?? '').trim() !== '');

  const saveItem = async () => {
    setSaving(true);
    try {
      const payload = config.fields.reduce<Record<string, any>>((acc, field) => {
        acc[field.key] = serializeValue(field, form[field.key]);
        return acc;
      }, {});

      if (editing?.id) {
        await api.put(`${config.apiPath}/${editing.id}`, payload);
        setMessage('Registro atualizado com sucesso.');
      } else {
        await api.post(config.apiPath, payload);
        setMessage('Registro criado com sucesso.');
      }
      setModalOpen(false);
      fetchItems();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Erro ao salvar registro.');
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (item: ItemRecord) => {
    if (!window.confirm(`Excluir ${item.nome || item.assunto || item.codigo}?`)) return;
    try {
      await api.delete(`${config.apiPath}/${item.id}`);
      setMessage('Registro excluido com sucesso.');
      fetchItems();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Erro ao excluir registro.');
    }
  };

  const copyItem = async (item: ItemRecord) => {
    try {
      await api.post(`${config.apiPath}/${item.id}/copiar`);
      setMessage('Registro copiado com sucesso.');
      fetchItems();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Erro ao copiar registro.');
    }
  };

  const confirmItem = async (item: ItemRecord) => {
    try {
      await api.patch(`${config.apiPath}/${item.id}/confirmar`);
      setMessage('Registro confirmado com sucesso.');
      fetchItems();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Erro ao confirmar registro.');
    }
  };

  const exportItems = async (format: 'excel' | 'xml' | 'html' | 'print') => {
    try {
      const response = await api.get(config.exportPath || config.apiPath, {
        params: { ...queryParams, format },
        responseType: 'blob',
      });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `helpdesk-${config.id}.${format === 'excel' ? 'csv' : format === 'print' ? 'html' : format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Erro ao exportar dados.');
    }
  };

  return (
    <section className="saas-mensalidades-wrap">
      <div className="saas-mensalidades-head">
        <h2>{config.title}</h2>
        <small>{config.subtitle}</small>
      </div>

      {message ? <div className="saas-acao-msg">{message}</div> : null}

      <div className="saas-mensalidades-filters">
        <input type="text" placeholder={config.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} />
        {(config.filters || []).map((filter) => (
          filter.type === 'select' ? (
            <select key={filter.key} value={filters[filter.key] || ''} onChange={(e) => setFilters((prev) => ({ ...prev, [filter.key]: e.target.value }))}>
              <option value="">{filter.label}</option>
              {(filter.options || []).map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          ) : (
            <input
              key={filter.key}
              type={filter.type}
              placeholder={filter.placeholder || filter.label}
              value={filters[filter.key] || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, [filter.key]: e.target.value }))}
            />
          )
        ))}
        <button type="button" className="saas-refresh-btn" onClick={fetchItems}>Atualizar</button>
        {!config.readOnly ? <button type="button" className="saas-refresh-btn" onClick={openCreate}>Inserir</button> : null}
      </div>

      {config.supportsExport ? (
        <div className="saas-actions-inline" style={{ marginBottom: 12 }}>
          <button type="button" className="saas-inline-btn" onClick={() => exportItems('excel')}><FiDownload /> Excel</button>
          <button type="button" className="saas-inline-btn" onClick={() => exportItems('xml')}><FiDownload /> XML</button>
          <button type="button" className="saas-inline-btn" onClick={() => exportItems('html')}><FiDownload /> HTML</button>
          <button type="button" className="saas-inline-btn" onClick={() => exportItems('print')}><FiPrinter /> Impressao</button>
        </div>
      ) : null}

      <div className="saas-mensalidades-table-wrap">
        <table className="saas-mensalidades-table">
          <thead>
            <tr>
              {config.columns.map((column) => <th key={column.key}>{column.label}</th>)}
              {!config.readOnly ? <th>Acoes</th> : null}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={config.columns.length + (config.readOnly ? 0 : 1)}>Carregando...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={config.columns.length + (config.readOnly ? 0 : 1)}>Nenhum registro encontrado.</td></tr>
            ) : items.map((item) => (
              <tr key={item.id}>
                {config.columns.map((column) => (
                  <td key={`${item.id}-${column.key}`}>
                    {column.format === 'status'
                      ? <span className={`saas-status-chip ${String(item[column.key] || '').toLowerCase()}`}>{formatCell(item[column.key], 'text')}</span>
                      : formatCell(item[column.key], column.format)}
                  </td>
                ))}
                {!config.readOnly ? (
                  <td>
                    <div className="saas-actions-inline">
                      <button type="button" className="saas-inline-btn" onClick={() => openEdit(item)}>Editar</button>
                      <button type="button" className="saas-inline-btn danger" onClick={() => removeItem(item)}>Excluir</button>
                      {config.supportsCopy ? <button type="button" className="saas-inline-btn" onClick={() => copyItem(item)}><FiCopy /></button> : null}
                      {config.supportsConfirm ? <button type="button" className="saas-inline-btn" onClick={() => confirmItem(item)}><FiCheckCircle /></button> : null}
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen ? (
        <div className="saas-modal-overlay saas-crud-modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && setModalOpen(false)}>
          <div className="saas-modal saas-plan-modal saas-crud-modal" role="dialog" aria-modal="true">
            <div className="saas-plan-modal-head saas-crud-modal-head">
              <div>
                <h3>{editing ? 'Editar registro' : 'Inserir registro'}</h3>
                <small>{config.title}</small>
              </div>
              <button type="button" className="saas-plan-modal-close" aria-label="Fechar modal" onClick={() => setModalOpen(false)}>
                <FiXCircle />
              </button>
            </div>
            <form className="saas-plan-form saas-crud-modal-body" onSubmit={(event) => { event.preventDefault(); if (canSubmit && !saving) saveItem(); }}>
              <div className="saas-plan-form-grid three saas-crud-form-grid">
                {config.fields.map((field, index) => (
                  <label key={field.key}>
                    <span>{field.label}</span>
                    {field.type === 'textarea' ? (
                      <textarea
                        ref={index === 0 ? (firstInputRef as any) : undefined}
                        rows={4}
                        placeholder={field.placeholder}
                        value={form[field.key] ?? ''}
                        onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        ref={index === 0 ? (firstInputRef as any) : undefined}
                        value={form[field.key] ?? ''}
                        onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      >
                        <option value="">Selecione</option>
                        {(field.options || []).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    ) : field.type === 'list' ? (
                      <textarea
                        ref={index === 0 ? (firstInputRef as any) : undefined}
                        rows={4}
                        placeholder={field.placeholder || 'Um item por linha'}
                        value={form[field.key] ?? ''}
                        onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      />
                    ) : (
                      <input
                        ref={index === 0 ? (firstInputRef as any) : undefined}
                        type={field.type}
                        required={field.required}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        placeholder={field.placeholder}
                        value={form[field.key] ?? ''}
                        onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      />
                    )}
                  </label>
                ))}
              </div>
              <div className="saas-plan-modal-actions saas-crud-modal-actions">
                <button type="button" className="saas-modal-cancel" onClick={() => setModalOpen(false)} disabled={saving}>Cancelar</button>
                <button type="submit" className="saas-modal-confirm pagamento" disabled={saving || !canSubmit}>{saving ? 'Salvando...' : editing ? 'Salvar alteracoes' : 'Inserir registro'}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default HelpdeskCrudSection;
