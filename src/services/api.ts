// Serviço de API para integração com o backend Laravel
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Configuração base da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Interface para resposta da API
export interface ApiResponse<T = any> {
  data: T;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
  };
  meta?: {
    masked?: boolean;
    audit_hash?: string[];
    generated_at?: string;
  };
}

// Interface para paciente
export interface Paciente {
  id: number;
  name: string;
  cpf_cnpj: string;
  cpf_responsavel?: string;
  email: string;
  telefone: string;
  celular?: string;
  convenio?: string;
  idade: number;
  data_nascimento: string;
  responsavel?: string;
  estado: string;
  sexo: string;
  profissao?: string;
  estado_civil?: string;
  tipo_sanguineo?: string;
  pessoa: string;
  cep?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

// Interface para filtros de busca
export interface PacienteFilters {
  per_page?: number;
  masked?: boolean;
  name?: string;
  convenio?: string;
  min_age?: number;
  max_age?: number;
  search?: string;
  sexo?: string;
  estado?: string;
  page?: number;
}

// Interface para estatísticas
export interface DashboardStats {
  overview: {
    patients: {
      total: number;
      this_month: number;
      last_month: number;
    };
    appointments: {
      total: number;
      today: number;
      this_month: number;
    };
    procedures: {
      total: number;
      this_month: number;
    };
    anamneses: {
      total: number;
      this_month: number;
    };
  };
  generated_at: string;
}

// Classe principal da API
class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Interceptor para adicionar token de autenticação
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para tratamento de respostas
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos de autenticação
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Métodos para pacientes
  async getPacientes(filters: PacienteFilters = {}): Promise<ApiResponse<Paciente[]>> {
    const response = await this.api.get<ApiResponse<Paciente[]>>('/pessoas/pacientes', { params: filters });
    return response.data;
  }

  async getPaciente(id: number): Promise<Paciente> {
    const response = await this.api.get<ApiResponse<Paciente>>(`/pessoas/pacientes/${id}`);
    return response.data.data;
  }

  async getPacienteMasked(id: number): Promise<ApiResponse<Paciente>> {
    const response = await this.api.get<ApiResponse<Paciente>>(`/pessoas/pacientes/${id}/masked`);
    return response.data;
  }

  async createPaciente(paciente: Partial<Paciente>): Promise<Paciente> {
    // Dados são enviados sem criptografia
    const response = await this.api.post<ApiResponse<Paciente>>('/pessoas/pacientes', paciente);
    return response.data.data;
  }

  async updatePaciente(id: number, paciente: Partial<Paciente>): Promise<Paciente> {
    // Dados são enviados sem criptografia
    const response = await this.api.put<ApiResponse<Paciente>>(`/pessoas/pacientes/${id}`, paciente);
    return response.data.data;
  }

  async deletePaciente(id: number): Promise<void> {
    await this.api.delete(`/pessoas/pacientes/${id}`);
  }

  async searchPacientes(filters: PacienteFilters): Promise<ApiResponse<Paciente[]>> {
    const response = await this.api.get<ApiResponse<Paciente[]>>('/pessoas/pacientes/search', { params: filters });
    return response.data;
  }

  async getPacientesStatistics(): Promise<any> {
    const response = await this.api.get('/pessoas/pacientes/statistics');
    return response.data;
  }

  async exportPacientes(format: 'json' | 'csv' = 'json', masked: boolean = true): Promise<any> {
    const response = await this.api.get('/pessoas/pacientes/export', {
      params: { format, masked }
    });
    return response.data;
  }

  // Métodos para dados de referência
  async getConvenios(): Promise<string[]> {
    const response = await this.api.get<{ convenios: string[] }>('/pessoas/pacientes/reference/convenios');
    return response.data.convenios;
  }

  async getEstados(): Promise<string[]> {
    const response = await this.api.get<{ estados: string[] }>('/pessoas/pacientes/reference/estados');
    return response.data.estados;
  }

  async getSexos(): Promise<string[]> {
    const response = await this.api.get<{ sexos: string[] }>('/pessoas/pacientes/reference/sexos');
    return response.data.sexos;
  }

  async getEstadosCivis(): Promise<string[]> {
    const response = await this.api.get<{ estados_civis: string[] }>('/pessoas/pacientes/reference/estados-civis');
    return response.data.estados_civis;
  }

  async getTiposSanguineos(): Promise<string[]> {
    const response = await this.api.get<{ tipos_sanguineos: string[] }>('/pessoas/pacientes/reference/tipos-sanguineos');
    return response.data.tipos_sanguineos;
  }

  // Métodos para dashboard
  async getDashboardOverview(): Promise<DashboardStats> {
    const response = await this.api.get<ApiResponse<DashboardStats>>('/dashboard/overview');
    return response.data.data;
  }

  async getPatientsStats(): Promise<any> {
    const response = await this.api.get('/dashboard/patients-stats');
    return response.data;
  }

  async getAppointmentsStats(): Promise<any> {
    const response = await this.api.get('/dashboard/appointments-stats');
    return response.data;
  }

  async getProceduresStats(): Promise<any> {
    const response = await this.api.get('/dashboard/procedures-stats');
    return response.data;
  }

  async getRecentActivities(): Promise<any> {
    const response = await this.api.get('/dashboard/recent-activities');
    return response.data;
  }

  async getSystemHealth(): Promise<any> {
    const response = await this.api.get('/dashboard/system-health');
    return response.data;
  }

  // Método para testar conexão com a API
  async testConnection(): Promise<boolean> {
    try {
      await this.api.get('/dashboard/system-health');
      return true;
    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      return false;
    }
  }
}

// Instância singleton da API
export const apiService = new ApiService();

// Exportar tipos e interfaces
