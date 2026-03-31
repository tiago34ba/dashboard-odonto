import axios from "axios";
import { getApiConfig } from "../../config/security";

const apiConfig = getApiConfig();

const portalApi = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  withCredentials: apiConfig.withCredentials,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

portalApi.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("patient_token") || sessionStorage.getItem("auth_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

portalApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      sessionStorage.removeItem("patient_token");
      sessionStorage.removeItem("patient_user");
      window.location.href = "/portal/login";
    }
    return Promise.reject(error);
  }
);

export default portalApi;
