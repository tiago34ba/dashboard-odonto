export const securityModuleConfig = {
  id: 'saas_security',
  title: 'Seguranca e Acesso',
  subtitle: 'RBAC, auditoria, sessoes/tokens e politicas de seguranca.',
  apiPath: '/saas/modulos/security',
  submodulos: [
    { value: 'rbac', label: 'RBAC' },
    { value: 'auditoria', label: 'Auditoria' },
    { value: 'sessoes_tokens', label: 'Sessoes e Tokens' },
    { value: 'politicas_seguranca', label: 'Politicas de Seguranca' },
  ],
};
