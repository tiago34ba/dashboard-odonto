export type StoredUser = {
  tipo?: string;
  permissoes?: string[];
  permissions?: string[];
  grupo_acesso_nome?: string;
  grupo_acesso?: {
    nome?: string;
    permissoes?: string[];
    acessos?: Array<{ codigo?: string }>;
  };
  grupoAcesso?: {
    nome?: string;
    permissoes?: string[];
    acessos?: Array<{ codigo?: string }>;
  };
};

const normalizeText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const normalizePermission = (value: string): string => value.trim().toUpperCase();

const ROLE_PERMISSION_TEMPLATES: Array<{ match: string[]; permissions: string[] }> = [
  {
    match: ["admin", "administrador", "owner", "gestor", "diretor", "super"],
    permissions: ["*"],
  },
  {
    match: ["financeiro", "finance", "contabil", "tesouraria"],
    permissions: [
      "DASHBOARD_VIEW",
      "FINANCE_DASHBOARD_VIEW",
      "FINANCE_PAYABLE_VIEW",
      "FINANCE_PAYABLE_MANAGE",
      "FINANCE_RECEIVABLE_VIEW",
      "FINANCE_RECEIVABLE_MANAGE",
      "FINANCE_REPORTS_VIEW",
      "FINANCE_CASHFLOW_VIEW",
      "COMISSOES_SELF_VIEW",
      "NOTES_VIEW",
      "TASKS_VIEW",
    ],
  },
  {
    match: ["recepcao", "recepcionista", "atendimento", "secretaria", "comercial"],
    permissions: [
      "DASHBOARD_VIEW",
      "PATIENTS_VIEW",
      "PATIENTS_MANAGE",
      "DENTISTS_VIEW",
      "SCHEDULINGS_VIEW",
      "SCHEDULINGS_MANAGE",
      "PROCEDURES_VIEW",
      "AGREEMENTS_VIEW",
      "ORCAMENTOS_VIEW",
      "ORCAMENTOS_MANAGE",
      "CONSULTAS_VIEW",
      "HORARIOS_VIEW",
      "TASKS_VIEW",
      "NOTES_VIEW",
    ],
  },
  {
    match: ["dentista", "doctor", "odontologo"],
    permissions: [
      "DASHBOARD_VIEW",
      "PATIENTS_VIEW",
      "SCHEDULINGS_VIEW",
      "SCHEDULINGS_MANAGE",
      "PROCEDURES_VIEW",
      "ODONTOGRAM_VIEW",
      "ODONTOGRAM_MANAGE",
      "TREATMENTS_VIEW",
      "TREATMENTS_MANAGE",
      "TREATMENTS_ASSIST",
      "CONSULTAS_VIEW",
      "HORARIOS_VIEW",
      "COMISSOES_SELF_VIEW",
    ],
  },
  {
    match: ["auxiliar", "assistente", "tecnico", "higienista"],
    permissions: [
      "DASHBOARD_VIEW",
      "PATIENTS_VIEW",
      "SCHEDULINGS_VIEW",
      "CONSULTAS_VIEW",
      "HORARIOS_VIEW",
      "TREATMENTS_ASSIST",
      "TASKS_VIEW",
      "NOTES_VIEW",
    ],
  },
];

const collectRawPermissions = (user: StoredUser | null): string[] => {
  const directPermissions = [
    ...(Array.isArray(user?.permissoes) ? user.permissoes : []),
    ...(Array.isArray(user?.permissions) ? user.permissions : []),
    ...(Array.isArray(user?.grupo_acesso?.permissoes) ? user.grupo_acesso.permissoes : []),
    ...(Array.isArray(user?.grupoAcesso?.permissoes) ? user.grupoAcesso.permissoes : []),
  ];

  const accessCodes = [
    ...(Array.isArray(user?.grupo_acesso?.acessos) ? user.grupo_acesso.acessos : []),
    ...(Array.isArray(user?.grupoAcesso?.acessos) ? user.grupoAcesso.acessos : []),
  ]
    .map((item) => item?.codigo)
    .filter((code): code is string => Boolean(code));

  return [...directPermissions, ...accessCodes]
    .filter((permission): permission is string => typeof permission === "string" && permission.trim().length > 0)
    .map(normalizePermission);
};

const collectRoleNames = (user: StoredUser | null): string[] => {
  // Only role/group names from access-group data should drive dashboard RBAC.
  // We intentionally do not use `tipo` here because it may represent plan tiers
  // (e.g. "SaaS Admin") and could accidentally match role templates.
  const groupNames = [
    user?.grupo_acesso_nome,
    user?.grupo_acesso?.nome,
    user?.grupoAcesso?.nome,
  ].filter((name): name is string => typeof name === "string" && name.trim().length > 0);

  return groupNames.map(normalizeText);
};

const collectTemplatePermissions = (user: StoredUser | null): string[] => {
  const roleNames = collectRoleNames(user);
  if (roleNames.length === 0) return [];

  const matched = ROLE_PERMISSION_TEMPLATES.filter((template) =>
    roleNames.some((roleName) => template.match.some((term) => roleName.includes(normalizeText(term))))
  );

  return matched.flatMap((template) => template.permissions).map(normalizePermission);
};

export const resolvePermissionSet = (user: StoredUser | null): Set<string> => {
  const rawPermissions = collectRawPermissions(user);

  // Prefer explicit permissions from backend. Use role templates only as fallback.
  if (rawPermissions.length > 0) {
    return new Set(rawPermissions);
  }

  return new Set(collectTemplatePermissions(user));
};

export const hasAnyPermission = (user: StoredUser | null, requiredPermissions?: string[]): boolean => {
  if (!requiredPermissions || requiredPermissions.length === 0) return true;

  const permissionSet = resolvePermissionSet(user);
  if (permissionSet.has("*")) return true;

  return requiredPermissions
    .map(normalizePermission)
    .some((permission) => permissionSet.has(permission));
};

export const hasAnyAccessGroup = (user: StoredUser | null, requiredAccessGroups?: string[]): boolean => {
  if (!requiredAccessGroups || requiredAccessGroups.length === 0) return true;

  const roleNames = collectRoleNames(user);
  if (roleNames.length === 0) return false;

  const normalizedRequired = requiredAccessGroups.map(normalizeText);
  return normalizedRequired.some((group) => roleNames.some((roleName) => roleName.includes(group)));
};

export const parseStoredUser = (): StoredUser | null => {
  try {
    const raw = sessionStorage.getItem("userData") || localStorage.getItem("userData");
    if (!raw) return null;
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
};
