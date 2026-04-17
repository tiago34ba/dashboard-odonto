import { HelpdeskModuleConfig } from '../../helpdesk/types';

export const chamadosVisualizacoesConfig: HelpdeskModuleConfig = {
  id: 'chamados_visualizacoes',
  title: 'Visualizacoes personalizadas',
  subtitle: 'Salve filtros, colunas e ordenacoes como views reutilizaveis pessoais, de equipe ou globais.',
  apiPath: '/saas/chamados/visualizacoes',
  searchPlaceholder: 'Buscar por nome, codigo ou criador',
  supportsExport: true,
  fields: [
    { key: 'nome', label: 'Nome', type: 'text', required: true },
    { key: 'codigo', label: 'Codigo', type: 'text', required: true },
    { key: 'tipo', label: 'Tipo', type: 'select', required: true, options: [
      { value: 'pessoal', label: 'Pessoal' },
      { value: 'equipe', label: 'Equipe' },
      { value: 'global', label: 'Global' },
    ], defaultValue: 'pessoal' },
    { key: 'agrupamento', label: 'Agrupar por', type: 'select', options: [
      { value: '', label: 'Sem agrupamento' },
      { value: 'status', label: 'Status' },
      { value: 'priority_id', label: 'Prioridade' },
      { value: 'area_id', label: 'Area' },
      { value: 'canal_origem', label: 'Canal' },
    ], defaultValue: '' },
    { key: 'icone', label: 'Icone', type: 'text' },
    { key: 'compartilhado', label: 'Compartilhada', type: 'select', options: [
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Nao' },
    ], defaultValue: 'false' },
    { key: 'equipe_id', label: 'ID da equipe', type: 'text' },
    { key: 'usuario_criador', label: 'Criador', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'ativo', label: 'Ativo' },
      { value: 'inativo', label: 'Inativo' },
    ], defaultValue: 'ativo' },
  ],
  columns: [
    { key: 'nome', label: 'Nome' },
    { key: 'codigo', label: 'Codigo' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'agrupamento', label: 'Agrupamento' },
    { key: 'compartilhado', label: 'Compartilhada', format: 'boolean' },
    { key: 'uso_count', label: 'Uso' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  filters: [
    { key: 'tipo', label: 'Tipo', type: 'select', options: [
      { value: 'pessoal', label: 'Pessoal' },
      { value: 'equipe', label: 'Equipe' },
      { value: 'global', label: 'Global' },
    ]},
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'ativo', label: 'Ativo' },
      { value: 'inativo', label: 'Inativo' },
    ]},
  ],
};
