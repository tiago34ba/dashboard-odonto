import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  redirectTo?: string;
  allowedUserTypes?: string[];
}

type StoredUser = {
  tipo?: string;
  permissoes?: string[];
  permissions?: string[];
  grupo_acesso?: {
    permissoes?: string[];
    acessos?: Array<{ codigo?: string }>;
  };
  grupoAcesso?: {
    permissoes?: string[];
    acessos?: Array<{ codigo?: string }>;
  };
};

const normalizePermission = (value: string): string => value.trim().toUpperCase();

const normalizeUserType = (value?: string): string => (value || "").trim().toLowerCase();

const readUserData = (): StoredUser | null => {
  try {
    const raw = sessionStorage.getItem("userData") || localStorage.getItem("userData");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const getSessionToken = (): string | null => sessionStorage.getItem("auth_token");

const resolvePermissionSet = (user: StoredUser | null): Set<string> => {
  const directPermissions = [
    ...(Array.isArray(user?.permissoes) ? user!.permissoes : []),
    ...(Array.isArray(user?.permissions) ? user!.permissions : []),
    ...(Array.isArray(user?.grupo_acesso?.permissoes) ? user!.grupo_acesso!.permissoes! : []),
    ...(Array.isArray(user?.grupoAcesso?.permissoes) ? user!.grupoAcesso!.permissoes! : []),
  ];

  const accessCodes = [
    ...(Array.isArray(user?.grupo_acesso?.acessos) ? user!.grupo_acesso!.acessos! : []),
    ...(Array.isArray(user?.grupoAcesso?.acessos) ? user!.grupoAcesso!.acessos! : []),
  ]
    .map((item) => item?.codigo)
    .filter((code): code is string => Boolean(code));

  return new Set([...directPermissions, ...accessCodes].map(normalizePermission));
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  redirectTo = "/login",
  allowedUserTypes,
}) => {
  const location = useLocation();
  const token = getSessionToken();

  if (!token) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  const user = readUserData();

  if (Array.isArray(allowedUserTypes) && allowedUserTypes.length > 0) {
    const normalizedAllowedUserTypes = allowedUserTypes.map(normalizeUserType);
    const userType = normalizeUserType(user?.tipo);

    if (!userType || !normalizedAllowedUserTypes.includes(userType)) {
      return <Navigate to={redirectTo} replace state={{ from: location }} />;
    }
  }

  if (!requiredPermission) {
    return <>{children}</>;
  }

  const permissions = resolvePermissionSet(user);

  // Mantem compatibilidade para ambientes antigos sem payload de permissao.
  if (permissions.size === 0) {
    return <>{children}</>;
  }

  if (permissions.has("*") || permissions.has(normalizePermission(requiredPermission))) {
    return <>{children}</>;
  }

  return <Navigate to="/dashboard" replace state={{ from: location }} />;
};

export default ProtectedRoute;