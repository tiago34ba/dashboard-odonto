import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredPermission?: string;
}

interface StoredUser {
  permissoes?: string[];
}

const parseUserData = (): StoredUser | null => {
  try {
    const raw = localStorage.getItem("userData");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const hasPermission = (user: StoredUser | null, permission?: string): boolean => {
  if (!permission) return true;
  const perms = Array.isArray(user?.permissoes) ? user?.permissoes : [];

  // If backend did not provide permissions list, do not hard block pages.
  if (perms.length === 0) return true;

  if (perms.includes("*")) return true;

  return perms.includes(permission);
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredPermission }) => {
  const token =
    sessionStorage.getItem("auth_token") ||
    localStorage.getItem("auth_token") ||
    localStorage.getItem("userToken");
  const user = parseUserData();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission(user, requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
