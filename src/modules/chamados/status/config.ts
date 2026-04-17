import { HelpdeskModuleConfig } from '../../helpdesk/types';

export const chamadosStatusConfig: HelpdeskModuleConfig = {
  id: 'chamados_status',
  title: 'Status Personalizado',
  subtitle: 'Etapas do workflow de atendimento com notificacoes, SLA e acoes automaticas.',
  apiPath: '/saas/chamados/status-personalizado',
  searchPlaceholder: 'Buscar por nome ou codigo',
  supportsExport: true,
  fields: [
    { key: 'nome', label: 'Nome', type: 'text', required: true },
    { key: 'codigo', label: 'Codigo', type: 'text', required: true },
    { key: 'cor', label: 'Cor (hex)', type: 'text', defaultValue: '#6b7280' },
    { key: 'icone', label: 'Icone', type: 'text' },
    { key: 'tipo', label: 'Tipo de fase', type: 'select', required: true, options: [
      { value: 'aberto', label: 'Aberto' },
      { value: 'em_andamento', label: 'Em andamento' },
      { value: 'aguardando', label: 'Aguardando' },
      { value: 'resolvido', label: 'Resolvido' },
      { value: 'fechado', label: 'Fechado' },
      { value: 'arquivado', label: 'Arquivado' },
    ], defaultValue: 'em_andamento' },
    { key: 'ordem', label: 'Ordem de exibicao', type: 'number', defaultValue: 0 },
    { key: 'proximo_status_sugerido', label: 'Proximo status sugerido', type: 'text' },
    { key: 'permite_reabertura', label: 'Permite reabertura', type: 'select', options: [
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Nao' },
    ], defaultValue: 'false' },
    { key: 'envia_notificacao', label: 'Envia notificacao', type: 'select', options: [
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Nao' },
    ], defaultValue: 'true' },
    { key: 'exige_resolucao', label: 'Exige texto de resolucao', type: 'select', options: [
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Nao' },
    ], defaultValue: 'false' },
    { key: 'sla_pausado', label: 'Pausa SLA', type: 'select', options: [
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Nao' },
    ], defaultValue: 'false' },
    { key: 'publico', label: 'Visivel ao cliente', type: 'select', options: [
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Nao' },
    ], defaultValue: 'true' },
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'ativo', label: 'Ativo' },
      { value: 'inativo', label: 'Inativo' },
    ], defaultValue: 'ativo' },
  ],
  columns: [
    { key: 'nome', label: 'Nome' },
    { key: 'codigo', label: 'Codigo' },
    { key: 'tipo', label: 'Fase' },
    { key: 'ordem', label: 'Ordem' },
    { key: 'publico', label: 'Publico', format: 'boolean' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  filters: [
    { key: 'tipo', label: 'Fase', type: 'select', options: [
      { value: 'aberto', label: 'Aberto' },
      { value: 'em_andamento', label: 'Em andamento' },
      { value: 'aguardando', label: 'Aguardando' },
      { value: 'resolvido', label: 'Resolvido' },
      { value: 'fechado', label: 'Fechado' },
      { value: 'arquivado', label: 'Arquivado' },
    ]},
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'ativo', label: 'Ativo' },
      { value: 'inativo', label: 'Inativo' },
    ]},
  ],
};
