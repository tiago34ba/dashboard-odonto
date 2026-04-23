import { HelpdeskModuleConfig } from '../types';

export const helpdeskAreasConfig: HelpdeskModuleConfig = {
  id: 'helpdesk_areas',
  title: 'Areas',
  subtitle: 'Cadastro de areas, gestores e regras de escalonamento.',
  apiPath: '/saas/helpdesk/areas',
  searchPlaceholder: 'Buscar por nome, codigo ou gestor',
  supportsExport: true,
  fields: [
    { key: 'nome', label: 'Nome', type: 'text', required: true },
    { key: 'codigo', label: 'Codigo', type: 'text', required: true },
    { key: 'gestor_nome', label: 'Gestor', type: 'text' },
    { key: 'gestor_email', label: 'E-mail do Gestor', type: 'email' },
    { key: 'sla_padrao_horas', label: 'SLA padrao (h)', type: 'number', min: 1, defaultValue: 24 },
    { key: 'status', label: 'Status', type: 'select', options: [{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }], defaultValue: 'ativo' },
    { key: 'descricao', label: 'Descricao', type: 'textarea' },
    { key: 'escalation_rules', label: 'Regras de escalonamento', type: 'list', placeholder: 'Uma regra por linha' },
  ],
  columns: [
    { key: 'nome', label: 'Nome' },
    { key: 'codigo', label: 'Codigo' },
    { key: 'gestor_nome', label: 'Gestor' },
    { key: 'gestor_email', label: 'E-mail' },
    { key: 'sla_padrao_horas', label: 'SLA(h)' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  filters: [{ key: 'status', label: 'Status', type: 'select', options: [{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }] }],
};
