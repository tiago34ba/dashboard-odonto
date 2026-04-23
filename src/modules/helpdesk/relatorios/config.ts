import { HelpdeskModuleConfig } from '../types';

export const helpdeskReportsConfig: HelpdeskModuleConfig = {
  id: 'helpdesk_relatorios',
  title: 'Relatorios',
  subtitle: 'Consulta operacional por periodo, chamado, cliente e tipo de problema.',
  apiPath: '/saas/helpdesk/chamados/relatorio',
  exportPath: '/saas/helpdesk/chamados/exportar',
  searchPlaceholder: 'Filtrar relatorios por cliente, chamado ou tipo',
  supportsExport: true,
  readOnly: true,
  fields: [],
  columns: [
    { key: 'protocolo', label: 'Protocolo' },
    { key: 'titulo', label: 'Titulo' },
    { key: 'cliente_nome', label: 'Cliente' },
    { key: 'problem_type_name', label: 'Tipo Problema' },
    { key: 'status', label: 'Status', format: 'status' },
    { key: 'created_at', label: 'Abertura', format: 'date' },
  ],
  filters: [
    { key: 'cliente_nome', label: 'Cliente', type: 'text' },
    { key: 'protocolo', label: 'Protocolo', type: 'text' },
    { key: 'problem_type_name', label: 'Tipo Problema', type: 'text' },
    { key: 'periodo_inicial', label: 'Periodo inicial', type: 'date' },
    { key: 'periodo_final', label: 'Periodo final', type: 'date' },
  ],
};
