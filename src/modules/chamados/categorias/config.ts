import { HelpdeskModuleConfig } from '../../helpdesk/types';

export const chamadosCategoriasConfig: HelpdeskModuleConfig = {
  id: 'chamados_categorias',
  title: 'Categorias',
  subtitle: 'Categorias de chamados com SLA, equipe responsavel e regras de auto-atribuicao.',
  apiPath: '/saas/chamados/categorias',
  searchPlaceholder: 'Buscar por nome, codigo ou equipe',
  supportsExport: true,
  fields: [
    { key: 'nome', label: 'Nome', type: 'text', required: true },
    { key: 'codigo', label: 'Codigo', type: 'text', required: true },
    { key: 'cor', label: 'Cor', type: 'text', defaultValue: '#2563eb' },
    { key: 'icone', label: 'Icone', type: 'text' },
    { key: 'descricao', label: 'Descricao', type: 'textarea' },
    { key: 'parent_id', label: 'ID Categoria pai', type: 'number' },
    { key: 'sla_horas', label: 'SLA (horas)', type: 'number', defaultValue: 24 },
    { key: 'equipe_responsavel', label: 'Equipe responsavel', type: 'text' },
    { key: 'prioridade_padrao', label: 'Prioridade padrao', type: 'select', options: [
      { value: 'baixa', label: 'Baixa' },
      { value: 'media', label: 'Media' },
      { value: 'alta', label: 'Alta' },
      { value: 'critica', label: 'Critica' },
    ], defaultValue: 'media' },
    { key: 'auto_assign', label: 'Auto-atribuicao', type: 'select', options: [
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Nao' },
    ], defaultValue: 'false' },
    { key: 'notificar_gestor', label: 'Notificar gestor', type: 'select', options: [
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Nao' },
    ], defaultValue: 'true' },
    { key: 'emails_notificacao', label: 'E-mails de notificacao', type: 'list', placeholder: 'Um e-mail por linha' },
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'ativo', label: 'Ativo' },
      { value: 'inativo', label: 'Inativo' },
    ], defaultValue: 'ativo' },
  ],
  columns: [
    { key: 'nome', label: 'Nome' },
    { key: 'codigo', label: 'Codigo' },
    { key: 'equipe_responsavel', label: 'Equipe' },
    { key: 'prioridade_padrao', label: 'Prioridade' },
    { key: 'sla_horas', label: 'SLA(h)' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  filters: [
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'ativo', label: 'Ativo' },
      { value: 'inativo', label: 'Inativo' },
    ]},
    { key: 'prioridade_padrao', label: 'Prioridade', type: 'select', options: [
      { value: 'baixa', label: 'Baixa' },
      { value: 'media', label: 'Media' },
      { value: 'alta', label: 'Alta' },
      { value: 'critica', label: 'Critica' },
    ]},
  ],
};
