import { HelpdeskModuleConfig } from '../types';

export const helpdeskPrioritiesConfig: HelpdeskModuleConfig = {
  id: 'helpdesk_prioridades',
  title: 'Prioridades',
  subtitle: 'SLAs, tempo de resposta e criticidade do atendimento.',
  apiPath: '/saas/helpdesk/prioridades',
  searchPlaceholder: 'Buscar por nome ou codigo',
  supportsExport: true,
  fields: [
    { key: 'nome', label: 'Nome', type: 'text', required: true },
    { key: 'codigo', label: 'Codigo', type: 'text', required: true },
    { key: 'cor', label: 'Cor', type: 'text', defaultValue: '#2563eb' },
    { key: 'ordem', label: 'Ordem', type: 'number', defaultValue: 1 },
    { key: 'tempo_resposta_horas', label: 'Resposta (h)', type: 'number', defaultValue: 4 },
    { key: 'tempo_resolucao_horas', label: 'Resolucao (h)', type: 'number', defaultValue: 24 },
    { key: 'status', label: 'Status', type: 'select', options: [{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }], defaultValue: 'ativo' },
    { key: 'descricao', label: 'Descricao', type: 'textarea' },
  ],
  columns: [
    { key: 'nome', label: 'Nome' },
    { key: 'codigo', label: 'Codigo' },
    { key: 'tempo_resposta_horas', label: 'Resp.(h)' },
    { key: 'tempo_resolucao_horas', label: 'Res.(h)' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  filters: [{ key: 'status', label: 'Status', type: 'select', options: [{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }] }],
};
