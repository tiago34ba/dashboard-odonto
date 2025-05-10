import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // URL correta da API Laravel
  timeout: 5000, // Tempo limite para requisições
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptores para adicionar tokens de autenticação, se necessário
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Obtendo o token do localStorage
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;