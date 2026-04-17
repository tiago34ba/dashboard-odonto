import { HelpdeskModuleConfig } from '../../helpdesk/types';

export const chamadosMeusConfig: HelpdeskModuleConfig = {
  id: 'chamados_meus',
  title: 'Seus Chamados',
  subtitle: 'Chamados ativos (abertos, em atendimento ou pendentes) do seu fluxo.',
  apiPath: '/saas/helpdesk/chamados',
  exportPath: '/saas/helpdesk/chamados/exportar',
  searchPlaceholder: 'Buscar por numero ou assunto',
  supportsExport: true,
  supportsCopy: true,
  supportsConfirm: true,
  defaultParams: { fila: 'meus' },
  fields: [
    { key: 'assunto', label: 'Assunto', type: 'text', required: true },
    { key: 'codigo', label: 'Codigo', type: 'text', required: true },
    { key: 'status', label: 'Status', type: 'select', required: true, options: [
      { value: 'aberto', label: 'Aberto' },
      { value: 'em_atendimento', label: 'Em atendimento' },
      { value: 'pendente', label: 'Pendente' },
    ], defaultValue: 'aberto' },
    { key: 'canal_origem', label: 'Canal', type: 'select', options: [
      { value: 'portal', label: 'Portal' },
      { value: 'email', label: 'E-mail' },
      { value: 'telefone', label: 'Telefone' },
      { value: 'whatsapp', label: 'WhatsApp' },
    ], defaultValue: 'portal' },
    { key: 'area_id', label: 'ID Area', type: 'number' },
    { key: 'priority_id', label: 'ID Prioridade', type: 'number' },
    { key: 'tecnico_id', label: 'ID Tecnico', type: 'number' },
    { key: 'gestor_email', label: 'E-mail Gestor', type: 'email' },
    { key: 'descricao', label: 'Descricao', type: 'textarea' },
  ],
  columns: [
    { key: 'numero', label: 'N°' },
    { key: 'assunto', label: 'Assunto' },
    { key: 'status', label: 'Status', format: 'status' },
    { key: 'canal_origem', label: 'Canal' },
    { key: 'created_at', label: 'Abertura', format: 'date' },
  ],
  filters: [
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'aberto', label: 'Aberto' },
      { value: 'em_atendimento', label: 'Em atendimento' },
      { value: 'pendente', label: 'Pendente' },
    ]},
  ],
};
