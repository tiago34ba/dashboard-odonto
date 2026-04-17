import { HelpdeskModuleConfig } from '../../helpdesk/types';

export const chamadosCamposConfig: HelpdeskModuleConfig = {
  id: 'chamados_campos',
  title: 'Campos personalizados',
  subtitle: 'Campos extras configurados por tipo, visibilidade, posicao e agrupamento de formulario.',
  apiPath: '/saas/chamados/campos-personalizados',
  searchPlaceholder: 'Buscar por nome, label, codigo ou grupo',
  supportsExport: true,
  fields: [
    { key: 'nome', label: 'Nome', type: 'text', required: true },
    { key: 'codigo', label: 'Codigo', type: 'text', required: true },
    { key: 'label', label: 'Label de exibicao', type: 'text', required: true },
    { key: 'tipo', label: 'Tipo', type: 'select', required: true, options: [
      { value: 'text', label: 'Texto curto' },
      { value: 'textarea', label: 'Texto longo' },
      { value: 'select', label: 'Lista de opcoes' },
      { value: 'multi_select', label: 'Multi-selecao' },
      { value: 'date', label: 'Data' },
      { value: 'datetime', label: 'Data e hora' },
      { value: 'number', label: 'Numero' },
      { value: 'url', label: 'URL' },
      { value: 'email', label: 'E-mail' },
      { value: 'phone', label: 'Telefone' },
      { value: 'checkbox', label: 'Checkbox' },
    ], defaultValue: 'text' },
    { key: 'placeholder', label: 'Placeholder', type: 'text' },
    { key: 'opcoes', label: 'Opcoes (para Select)', type: 'list', placeholder: 'Um valor por linha' },
    { key: 'valor_padrao', label: 'Valor padrao', type: 'text' },
    { key: 'validacao_regex', label: 'Validacao (regex)', type: 'text' },
    { key: 'aplicado_em', label: 'Aplicado em', type: 'select', options: [
      { value: 'chamados', label: 'Chamados' },
      { value: 'atendimentos', label: 'Atendimentos' },
      { value: 'pre_cadastro', label: 'Pre-cadastro' },
      { value: 'todos', label: 'Todos' },
    ], defaultValue: 'chamados' },
    { key: 'grupo', label: 'Grupo/Secao', type: 'text' },
    { key: 'posicao', label: 'Posicao', type: 'number', defaultValue: 0 },
    { key: 'obrigatorio', label: 'Obrigatorio', type: 'select', options: [
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Nao' },
    ], defaultValue: 'false' },
    { key: 'visivel_cliente', label: 'Visivel ao cliente', type: 'select', options: [
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Nao' },
    ], defaultValue: 'true' },
    { key: 'visivel_tecnico', label: 'Visivel ao tecnico', type: 'select', options: [
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
    { key: 'label', label: 'Label' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'aplicado_em', label: 'Aplicado em' },
    { key: 'grupo', label: 'Grupo' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  filters: [
    { key: 'tipo', label: 'Tipo', type: 'select', options: [
      { value: 'text', label: 'Texto' },
      { value: 'select', label: 'Lista' },
      { value: 'number', label: 'Numero' },
      { value: 'date', label: 'Data' },
      { value: 'checkbox', label: 'Checkbox' },
    ]},
    { key: 'aplicado_em', label: 'Aplicado em', type: 'select', options: [
      { value: 'chamados', label: 'Chamados' },
      { value: 'atendimentos', label: 'Atendimentos' },
      { value: 'pre_cadastro', label: 'Pre-cadastro' },
      { value: 'todos', label: 'Todos' },
    ]},
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'ativo', label: 'Ativo' },
      { value: 'inativo', label: 'Inativo' },
    ]},
  ],
};
