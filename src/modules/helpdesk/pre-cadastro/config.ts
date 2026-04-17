import { HelpdeskModuleConfig } from '../types';

export const helpdeskPreRegistrationsConfig: HelpdeskModuleConfig = {
  id: 'helpdesk_pre_cadastro',
  title: 'Pre-cadastro',
  subtitle: 'Entrada rapida de novos clientes com envio de senha provisoria.',
  apiPath: '/saas/helpdesk/pre-cadastros',
  searchPlaceholder: 'Buscar por nome, email ou empresa',
  supportsExport: true,
  fields: [
    { key: 'nome', label: 'Nome', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'empresa', label: 'Empresa', type: 'text', required: true },
    { key: 'telefone', label: 'Telefone', type: 'text' },
    { key: 'departamento', label: 'Departamento', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: [{ value: 'pendente', label: 'Pendente' }, { value: 'enviado', label: 'Enviado' }, { value: 'aprovado', label: 'Aprovado' }], defaultValue: 'pendente' },
    { key: 'observacoes', label: 'Observacoes', type: 'textarea' },
  ],
  columns: [
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'empresa', label: 'Empresa' },
    { key: 'departamento', label: 'Departamento' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  filters: [{ key: 'status', label: 'Status', type: 'select', options: [{ value: 'pendente', label: 'Pendente' }, { value: 'enviado', label: 'Enviado' }, { value: 'aprovado', label: 'Aprovado' }] }],
};
