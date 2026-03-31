import axios from "axios";
import { getApiConfig, isProduction } from "../../config/security";
import { captureApiError } from "../../monitoring/sentry";

// Configuração segura da API usando configurações centralizadas
const apiConfig = getApiConfig();

const api = axios.create({
  ...apiConfig,
  // Configurações adicionais de segurança
  httpsAgent: isProduction() ? {
    rejectUnauthorized: true, // Verificar certificados SSL em produção
  } : undefined,
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    captureApiError(error, {
      client: "shared-api",
      path: error?.config?.url,
      method: error?.config?.method,
      status: error?.response?.status,
    });

    if (error.response?.status === 401) {
      const requestUrl = (error?.config?.url ?? "").toString().toLowerCase();
      const isLoginRequest = requestUrl.endsWith("/login") || requestUrl.includes("/auth/login");

      // Let login pages handle invalid credentials without global redirect.
      if (isLoginRequest) {
        return Promise.reject(error);
      }

      sessionStorage.removeItem('auth_token');
      localStorage.removeItem('auth_token');
      // Redirecionar para login em caso de não autorizado
      // O cookie será removido automaticamente pelo backend
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const isPortalContext = currentPath.startsWith('/portal');
      const isAdminContext = currentPath.startsWith('/admin');
      window.location.href = isPortalContext ? '/portal/login' : isAdminContext ? '/admin/login' : '/login';
    }
    return Promise.reject(error);
  }
);

export default api;