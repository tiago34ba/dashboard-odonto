import { HelpdeskModuleConfig } from '../types';

export const helpdeskAttendancesConfig: HelpdeskModuleConfig = {
  id: 'helpdesk_atendimentos',
  title: 'Itens de Atendimento',
  subtitle: 'Lancamentos tecnicos, horas, pecas, observacoes e evolucao do chamado.',
  apiPath: '/saas/helpdesk/atendimentos',
  searchPlaceholder: 'Buscar por ticket, tecnico ou descricao',
  supportsExport: true,
  fields: [
    { key: 'ticket_id', label: 'ID Chamado', type: 'number', required: true },
    { key: 'tecnico_nome', label: 'Tecnico', type: 'text', required: true },
    { key: 'tipo', label: 'Tipo', type: 'select', options: [{ value: 'analise', label: 'Analise' }, { value: 'deslocamento', label: 'Deslocamento' }, { value: 'execucao', label: 'Execucao' }, { value: 'retorno', label: 'Retorno' }], defaultValue: 'analise' },
    { key: 'inicio_at', label: 'Inicio', type: 'datetime' },
    { key: 'fim_at', label: 'Fim', type: 'datetime' },
    { key: 'duracao_min', label: 'Duracao (min)', type: 'number', defaultValue: 0 },
    { key: 'custo_estimado', label: 'Custo estimado', type: 'number', defaultValue: 0 },
    { key: 'status', label: 'Status', type: 'select', options: [{ value: 'registrado', label: 'Registrado' }, { value: 'validado', label: 'Validado' }, { value: 'cancelado', label: 'Cancelado' }], defaultValue: 'registrado' },
    { key: 'descricao', label: 'Descricao', type: 'textarea', required: true },
    { key: 'pecas_utilizadas', label: 'Pecas utilizadas', type: 'list', placeholder: 'Uma peca por linha' },
  ],
  columns: [
    { key: 'ticket_id', label: 'Chamado' },
    { key: 'tecnico_nome', label: 'Tecnico' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'duracao_min', label: 'Min' },
    { key: 'custo_estimado', label: 'Custo', format: 'currency' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  filters: [
    { key: 'tipo', label: 'Tipo', type: 'select', options: [{ value: 'analise', label: 'Analise' }, { value: 'deslocamento', label: 'Deslocamento' }, { value: 'execucao', label: 'Execucao' }, { value: 'retorno', label: 'Retorno' }] },
    { key: 'status', label: 'Status', type: 'select', options: [{ value: 'registrado', label: 'Registrado' }, { value: 'validado', label: 'Validado' }, { value: 'cancelado', label: 'Cancelado' }] },
  ],
};
