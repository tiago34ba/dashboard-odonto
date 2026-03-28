import axios from "axios";
import { getApiConfig, isProduction } from "../../config/security";

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
    const token =
      sessionStorage.getItem('auth_token') ||
      localStorage.getItem('auth_token') ||
      localStorage.getItem('userToken');
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
    if (error.response?.status === 401) {
      sessionStorage.removeItem('auth_token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('userToken');
      // Redirecionar para login em caso de não autorizado
      // O cookie será removido automaticamente pelo backend
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;