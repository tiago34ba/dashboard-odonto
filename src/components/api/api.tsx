import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // Substitua pela URL da sua API Laravel
  timeout: 5000, // Tempo limite para requisições
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptores para adicionar tokens de autenticação, se necessário
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Exemplo: obtendo o token do localStorage
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;