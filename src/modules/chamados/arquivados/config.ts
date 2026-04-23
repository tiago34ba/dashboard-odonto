import { HelpdeskModuleConfig } from '../../helpdesk/types';

export const chamadosArquivadosConfig: HelpdeskModuleConfig = {
  id: 'chamados_arquivados',
  title: 'Arquivado',
  subtitle: 'Historico de chamados encerrados ou cancelados. Somente leitura.',
  apiPath: '/saas/helpdesk/chamados',
  exportPath: '/saas/helpdesk/chamados/exportar',
  searchPlaceholder: 'Buscar por numero, assunto ou codigo',
  supportsExport: true,
  readOnly: true,
  defaultParams: { fila: 'arquivados' },
  fields: [],
  columns: [
    { key: 'numero', label: 'N°' },
    { key: 'assunto', label: 'Assunto' },
    { key: 'status', label: 'Status', format: 'status' },
    { key: 'canal_origem', label: 'Canal' },
    { key: 'created_at', label: 'Aberto em', format: 'date' },
  ],
  filters: [
    { key: 'canal_origem', label: 'Canal', type: 'select', options: [
      { value: 'portal', label: 'Portal' },
      { value: 'email', label: 'E-mail' },
      { value: 'telefone', label: 'Telefone' },
      { value: 'whatsapp', label: 'WhatsApp' },
    ]},
  ],
};
