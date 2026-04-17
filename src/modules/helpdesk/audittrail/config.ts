import { HelpdeskModuleConfig } from '../types';

export const helpdeskAuditTrailConfig: HelpdeskModuleConfig = {
  id: 'helpdesk_audittrail',
  title: 'Audit Trail',
  subtitle: 'Historico completo de mudancas, workflow e usuarios responsaveis.',
  apiPath: '/saas/helpdesk/audittrail',
  searchPlaceholder: 'Buscar por entidade, acao ou usuario',
  supportsExport: true,
  readOnly: true,
  fields: [],
  columns: [
    { key: 'entity_type', label: 'Entidade' },
    { key: 'entity_id', label: 'ID' },
    { key: 'action', label: 'Acao' },
    { key: 'user_name', label: 'Usuario' },
    { key: 'created_at', label: 'Data', format: 'date' },
  ],
  filters: [
    { key: 'entity_type', label: 'Entidade', type: 'text' },
    { key: 'action', label: 'Acao', type: 'text' },
  ],
};
