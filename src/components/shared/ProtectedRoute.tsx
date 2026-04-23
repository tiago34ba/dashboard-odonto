import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { parseStoredUser, resolvePermissionSet } from "../../security/rbac";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  redirectTo?: string;
  allowedUserTypes?: string[];
}

const normalizePermission = (value: string): string => value.trim().toUpperCase();

const normalizeUserType = (value?: string): string => (value || "").trim().toLowerCase();

const getSessionToken = (): string | null => sessionStorage.getItem("auth_token");

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredPermissions,
  redirectTo = "/login",
  allowedUserTypes,
}) => {
  const location = useLocation();
  const token = getSessionToken();

  if (!token) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  const user = parseStoredUser();

  if (Array.isArray(allowedUserTypes) && allowedUserTypes.length > 0) {
    const normalizedAllowedUserTypes = allowedUserTypes.map(normalizeUserType);
    const userType = normalizeUserType(user?.tipo);

    if (!userType || !normalizedAllowedUserTypes.includes(userType)) {
      return <Navigate to={redirectTo} replace state={{ from: location }} />;
    }
  }

  const required = [
    ...(requiredPermission ? [requiredPermission] : []),
    ...(Array.isArray(requiredPermissions) ? requiredPermissions : []),
  ];

  if (required.length === 0) {
    return <>{children}</>;
  }

  const permissions = resolvePermissionSet(user);
  const normalizedRequired = required.map(normalizePermission);

  if (permissions.has("*") || normalizedRequired.some((permission) => permissions.has(permission))) {
    return <>{children}</>;
  }

  return <Navigate to="/dashboard" replace state={{ from: location }} />;
};

export default ProtectedRoute;