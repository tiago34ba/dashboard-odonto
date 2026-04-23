export const billingModuleConfig = {
  id: 'saas_billing',
  title: 'Billing e Cobranca',
  subtitle: 'Assinaturas, faturas, pagamentos e inadimplencia.',
  apiPath: '/saas/modulos/billing',
  submodulos: [
    { value: 'assinaturas', label: 'Assinaturas' },
    { value: 'faturas', label: 'Faturas' },
    { value: 'pagamentos', label: 'Pagamentos' },
    { value: 'inadimplencia', label: 'Inadimplencia' },
  ],
};
