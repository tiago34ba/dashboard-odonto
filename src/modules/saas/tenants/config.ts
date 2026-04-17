export const tenantsModuleConfig = {
  id: 'saas_tenants',
  title: 'Gestao de Clientes (Tenants)',
  subtitle: 'Provisionamento, ciclo de vida e limites por plano.',
  apiPath: '/saas/modulos/tenants',
  submodulos: [
    { value: 'provisionamento', label: 'Provisionamento' },
    { value: 'ciclo_vida', label: 'Ciclo de Vida' },
    { value: 'limites_plano', label: 'Limites por Plano' },
    { value: 'dados_clinica', label: 'Dados da Clinica' },
  ],
};
