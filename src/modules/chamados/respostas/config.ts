import { HelpdeskModuleConfig } from '../../helpdesk/types';

export const chamadosRespostasConfig: HelpdeskModuleConfig = {
  id: 'chamados_respostas',
  title: 'Respostas predefinidas',
  subtitle: 'Respostas rapidas e canned responses com atalho de teclado, visibilidade e controle por idioma.',
  apiPath: '/saas/chamados/respostas-predefinidas',
  searchPlaceholder: 'Buscar por titulo, codigo, conteudo ou atalho',
  supportsExport: true,
  fields: [
    { key: 'titulo', label: 'Titulo', type: 'text', required: true },
    { key: 'codigo', label: 'Codigo', type: 'text', required: true },
    { key: 'conteudo', label: 'Conteudo', type: 'textarea', required: true, placeholder: 'Escreva o texto da resposta padrao...' },
    { key: 'categoria_id', label: 'ID Categoria', type: 'number' },
    { key: 'visivel_para', label: 'Visivel para', type: 'select', options: [
      { value: 'todos', label: 'Todos' },
      { value: 'tecnicos', label: 'Tecnicos' },
      { value: 'gestores', label: 'Gestores' },
      { value: 'clientes', label: 'Clientes' },
    ], defaultValue: 'todos' },
    { key: 'atalho_teclado', label: 'Atalho de teclado', type: 'text', placeholder: 'Ex.: /saudacao' },
    { key: 'idioma', label: 'Idioma', type: 'select', options: [
      { value: 'pt_BR', label: 'Portugues (Brasil)' },
      { value: 'en_US', label: 'Ingles (EUA)' },
      { value: 'es_ES', label: 'Espanhol' },
    ], defaultValue: 'pt_BR' },
    { key: 'incluir_anexo', label: 'Incluir anexo', type: 'select', options: [
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Nao' },
    ], defaultValue: 'false' },
    { key: 'tags', label: 'Tags', type: 'list', placeholder: 'Uma tag por linha' },
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'ativo', label: 'Ativo' },
      { value: 'inativo', label: 'Inativo' },
    ], defaultValue: 'ativo' },
  ],
  columns: [
    { key: 'titulo', label: 'Titulo' },
    { key: 'codigo', label: 'Codigo' },
    { key: 'visivel_para', label: 'Visivel para' },
    { key: 'idioma', label: 'Idioma' },
    { key: 'atalho_teclado', label: 'Atalho' },
    { key: 'uso_count', label: 'Usos' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  filters: [
    { key: 'visivel_para', label: 'Visivel para', type: 'select', options: [
      { value: 'todos', label: 'Todos' },
      { value: 'tecnicos', label: 'Tecnicos' },
      { value: 'gestores', label: 'Gestores' },
      { value: 'clientes', label: 'Clientes' },
    ]},
    { key: 'idioma', label: 'Idioma', type: 'select', options: [
      { value: 'pt_BR', label: 'Portugues' },
      { value: 'en_US', label: 'Ingles' },
      { value: 'es_ES', label: 'Espanhol' },
    ]},
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'ativo', label: 'Ativo' },
      { value: 'inativo', label: 'Inativo' },
    ]},
  ],
};
