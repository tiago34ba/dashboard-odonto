import { HelpdeskModuleConfig } from '../types';

export const helpdeskUsersConfig: HelpdeskModuleConfig = {
  id: 'helpdesk_usuarios',
  title: 'Usuarios',
  subtitle: 'Tecnicos, clientes e gestores com foto e perfil operacional.',
  apiPath: '/saas/helpdesk/usuarios',
  searchPlaceholder: 'Buscar por nome, email, empresa ou departamento',
  supportsExport: true,
  fields: [
    { key: 'nome', label: 'Nome', type: 'text', required: true },
    { key: 'codigo', label: 'Codigo', type: 'text', required: true },
    { key: 'tipo', label: 'Tipo', type: 'select', required: true, options: [{ value: 'tecnico', label: 'Tecnico' }, { value: 'cliente', label: 'Cliente' }, { value: 'gestor', label: 'Gestor' }] },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'telefone', label: 'Telefone', type: 'text' },
    { key: 'empresa', label: 'Empresa', type: 'text' },
    { key: 'departamento', label: 'Departamento', type: 'text' },
    { key: 'cargo', label: 'Cargo', type: 'text' },
    { key: 'photo_url', label: 'URL da Foto', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: [{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }, { value: 'bloqueado', label: 'Bloqueado' }], defaultValue: 'ativo' },
  ],
  columns: [
    { key: 'nome', label: 'Nome' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'email', label: 'Email' },
    { key: 'empresa', label: 'Empresa' },
    { key: 'departamento', label: 'Departamento' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  filters: [
    { key: 'tipo', label: 'Tipo', type: 'select', options: [{ value: 'tecnico', label: 'Tecnico' }, { value: 'cliente', label: 'Cliente' }, { value: 'gestor', label: 'Gestor' }] },
    { key: 'status', label: 'Status', type: 'select', options: [{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }, { value: 'bloqueado', label: 'Bloqueado' }] },
  ],
};
