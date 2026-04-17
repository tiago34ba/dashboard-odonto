import { HelpdeskModuleConfig } from '../types';

export const helpdeskProblemTypesConfig: HelpdeskModuleConfig = {
  id: 'helpdesk_tipos_problema',
  title: 'Tipos de Problema',
  subtitle: 'Categorias, familias e tipos usados na abertura de chamados.',
  apiPath: '/saas/helpdesk/tipos-problema',
  searchPlaceholder: 'Buscar por nome, codigo ou categoria',
  supportsExport: true,
  fields: [
    { key: 'nome', label: 'Nome', type: 'text', required: true },
    { key: 'codigo', label: 'Codigo', type: 'text', required: true },
    { key: 'categoria', label: 'Categoria', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: [{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }], defaultValue: 'ativo' },
    { key: 'descricao', label: 'Descricao', type: 'textarea' },
  ],
  columns: [
    { key: 'nome', label: 'Nome' },
    { key: 'codigo', label: 'Codigo' },
    { key: 'categoria', label: 'Categoria' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  filters: [{ key: 'status', label: 'Status', type: 'select', options: [{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }] }],
};
