import { HelpdeskModuleConfig } from '../types';

export const helpdeskProblemsConfig: HelpdeskModuleConfig = {
  id: 'helpdesk_problemas',
  title: 'Problemas',
  subtitle: 'Base de incidentes, sintomas, impacto e workaround.',
  apiPath: '/saas/helpdesk/problemas',
  searchPlaceholder: 'Buscar por nome, codigo ou impacto',
  supportsExport: true,
  fields: [
    { key: 'nome', label: 'Nome', type: 'text', required: true },
    { key: 'codigo', label: 'Codigo', type: 'text', required: true },
    { key: 'area_id', label: 'ID da Area', type: 'number' },
    { key: 'problem_type_id', label: 'ID do Tipo', type: 'number' },
    { key: 'impacto', label: 'Impacto', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: [{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }], defaultValue: 'ativo' },
    { key: 'descricao', label: 'Descricao', type: 'textarea' },
    { key: 'sintomas', label: 'Sintomas', type: 'textarea' },
    { key: 'workaround', label: 'Workaround', type: 'textarea' },
  ],
  columns: [
    { key: 'nome', label: 'Nome' },
    { key: 'codigo', label: 'Codigo' },
    { key: 'area_id', label: 'Area' },
    { key: 'problem_type_id', label: 'Tipo' },
    { key: 'impacto', label: 'Impacto' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  filters: [{ key: 'status', label: 'Status', type: 'select', options: [{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }] }],
};
