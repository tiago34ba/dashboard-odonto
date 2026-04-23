import { HelpdeskModuleConfig } from '../types';

export const helpdeskClassesConfig: HelpdeskModuleConfig = {
  id: 'helpdesk_classes',
  title: 'Classes',
  subtitle: 'Classes operacionais e regras de fila.',
  apiPath: '/saas/helpdesk/classes',
  searchPlaceholder: 'Buscar por nome ou codigo',
  supportsExport: true,
  fields: [
    { key: 'nome', label: 'Nome', type: 'text', required: true },
    { key: 'codigo', label: 'Codigo', type: 'text', required: true },
    { key: 'status', label: 'Status', type: 'select', options: [{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }], defaultValue: 'ativo' },
    { key: 'descricao', label: 'Descricao', type: 'textarea' },
    { key: 'regra_fila', label: 'Regras de fila', type: 'list', placeholder: 'Uma regra por linha' },
  ],
  columns: [
    { key: 'nome', label: 'Nome' },
    { key: 'codigo', label: 'Codigo' },
    { key: 'status', label: 'Status', format: 'status' },
    { key: 'regra_fila', label: 'Fila', format: 'array' },
  ],
  filters: [{ key: 'status', label: 'Status', type: 'select', options: [{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }] }],
};
