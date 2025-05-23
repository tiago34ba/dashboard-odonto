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
    // Removendo dependência do localStorage
    const token = "seu_token_aqui"; // Substitua pelo token obtido de outra forma, se necessário
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Função para armazenar dados na API
export const storeData = async (endpoint: string, data: object) => {
  try {
    const response = await axiosInstance.post(endpoint, data);
    console.log("Dados armazenados com sucesso:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao armazenar dados:", error);
    throw error;
  }
};

export default axiosInstance;