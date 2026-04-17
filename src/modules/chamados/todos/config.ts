import { HelpdeskModuleConfig } from '../../helpdesk/types';

const ticketColumns = [
  { key: 'numero', label: 'N°' },
  { key: 'assunto', label: 'Assunto' },
  { key: 'status', label: 'Status', format: 'status' as const },
  { key: 'canal_origem', label: 'Canal' },
  { key: 'created_at', label: 'Abertura', format: 'date' as const },
];

const ticketFilters = [
  { key: 'status', label: 'Status', type: 'select' as const, options: [
    { value: 'aberto', label: 'Aberto' },
    { value: 'em_atendimento', label: 'Em atendimento' },
    { value: 'pendente', label: 'Pendente' },
    { value: 'resolvido', label: 'Resolvido' },
    { value: 'fechado', label: 'Fechado' },
    { value: 'cancelado', label: 'Cancelado' },
  ]},
  { key: 'canal_origem', label: 'Canal', type: 'select' as const, options: [
    { value: 'portal', label: 'Portal' },
    { value: 'email', label: 'E-mail' },
    { value: 'telefone', label: 'Telefone' },
    { value: 'whatsapp', label: 'WhatsApp' },
  ]},
];

const ticketFields = [
  { key: 'assunto', label: 'Assunto', type: 'text' as const, required: true },
  { key: 'codigo', label: 'Codigo', type: 'text' as const, required: true },
  { key: 'status', label: 'Status', type: 'select' as const, required: true, options: [
    { value: 'aberto', label: 'Aberto' },
    { value: 'em_atendimento', label: 'Em atendimento' },
    { value: 'pendente', label: 'Pendente' },
    { value: 'resolvido', label: 'Resolvido' },
  ], defaultValue: 'aberto' },
  { key: 'canal_origem', label: 'Canal de origem', type: 'select' as const, options: [
    { value: 'portal', label: 'Portal' },
    { value: 'email', label: 'E-mail' },
    { value: 'telefone', label: 'Telefone' },
    { value: 'whatsapp', label: 'WhatsApp' },
  ], defaultValue: 'portal' },
  { key: 'area_id', label: 'ID Area', type: 'number' as const },
  { key: 'priority_id', label: 'ID Prioridade', type: 'number' as const },
  { key: 'problem_type_id', label: 'ID Tipo Problema', type: 'number' as const },
  { key: 'tecnico_id', label: 'ID Tecnico', type: 'number' as const },
  { key: 'cliente_id', label: 'ID Cliente', type: 'number' as const },
  { key: 'gestor_email', label: 'E-mail Gestor', type: 'email' as const },
  { key: 'descricao', label: 'Descricao', type: 'textarea' as const },
];

export const chamadosTodosConfig: HelpdeskModuleConfig = {
  id: 'chamados_todos',
  title: 'Todos os Chamados',
  subtitle: 'Visao completa de todos os tickets do sistema, paginados e filtrados.',
  apiPath: '/saas/helpdesk/chamados',
  exportPath: '/saas/helpdesk/chamados/exportar',
  searchPlaceholder: 'Buscar por numero, assunto ou codigo',
  supportsExport: true,
  supportsCopy: true,
  supportsConfirm: true,
  defaultParams: { fila: 'todos' },
  fields: ticketFields,
  columns: ticketColumns,
  filters: ticketFilters,
};
