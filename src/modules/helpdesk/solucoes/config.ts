import { HelpdeskModuleConfig } from '../types';

export const helpdeskSolutionsConfig: HelpdeskModuleConfig = {
  id: 'helpdesk_solucoes',
  title: 'Solucoes',
  subtitle: 'Base de conhecimento, passos tecnicos e efetividade.',
  apiPath: '/saas/helpdesk/solucoes',
  searchPlaceholder: 'Buscar por nome, codigo ou artigo',
  supportsExport: true,
  fields: [
    { key: 'nome', label: 'Nome', type: 'text', required: true },
    { key: 'codigo', label: 'Codigo', type: 'text', required: true },
    { key: 'problem_id', label: 'ID do Problema', type: 'number' },
    { key: 'kb_article_url', label: 'URL artigo KB', type: 'text' },
    { key: 'tempo_medio_min', label: 'Tempo medio (min)', type: 'number', defaultValue: 0 },
    { key: 'efetividade_score', label: 'Efetividade (%)', type: 'number', defaultValue: 0 },
    { key: 'status', label: 'Status', type: 'select', options: [{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }], defaultValue: 'ativo' },
    { key: 'descricao', label: 'Descricao', type: 'textarea' },
    { key: 'passos', label: 'Passos', type: 'textarea' },
  ],
  columns: [
    { key: 'nome', label: 'Nome' },
    { key: 'codigo', label: 'Codigo' },
    { key: 'problem_id', label: 'Problema' },
    { key: 'tempo_medio_min', label: 'Tempo' },
    { key: 'efetividade_score', label: 'Efetiv.' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  filters: [{ key: 'status', label: 'Status', type: 'select', options: [{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }] }],
};
