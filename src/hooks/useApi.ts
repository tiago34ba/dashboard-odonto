// Hook personalizado para integração com a API
import { useState, useEffect, useCallback } from 'react';
import { apiService, Paciente, PacienteFilters, DashboardStats } from '../services/api';

// Hook para gerenciar estado de carregamento e erros
export const useApiState = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async <T>(
    apiCall: () => Promise<T>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro na API:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute };
};

// Hook para gerenciar pacientes
export const usePacientes = (filters: PacienteFilters = {}) => {
  const { loading, error, execute } = useApiState();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [meta, setMeta] = useState<any>(null);

  const fetchPacientes = useCallback(async () => {
    const result = await execute(() => apiService.getPacientes(filters));
    if (result) {
      setPacientes(result.data);
      setPagination(result.pagination);
      setMeta(result.meta);
    }
  }, [filters, execute]);

  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]);

  const refresh = useCallback(() => {
    fetchPacientes();
  }, [fetchPacientes]);

  return {
    pacientes,
    pagination,
    meta,
    loading,
    error,
    refresh
  };
};

// Hook para gerenciar um paciente específico
export const usePaciente = (id: number | null) => {
  const { loading, error, execute } = useApiState();
  const [paciente, setPaciente] = useState<Paciente | null>(null);

  const fetchPaciente = useCallback(async () => {
    if (!id) return;
    
    const result = await execute(() => apiService.getPaciente(id));
    if (result) {
      setPaciente(result);
    }
  }, [id, execute]);

  useEffect(() => {
    fetchPaciente();
  }, [fetchPaciente]);

  const updatePaciente = useCallback(async (data: Partial<Paciente>) => {
    if (!id) return false;
    
    const result = await execute(() => apiService.updatePaciente(id, data));
    if (result) {
      setPaciente(result);
      return true;
    }
    return false;
  }, [id, execute]);

  const deletePaciente = useCallback(async () => {
    if (!id) return false;
    
    const result = await execute(() => apiService.deletePaciente(id));
    return result !== null;
  }, [id, execute]);

  return {
    paciente,
    loading,
    error,
    updatePaciente,
    deletePaciente,
    refresh: fetchPaciente
  };
};

// Hook para busca de pacientes
export const usePacienteSearch = () => {
  const { loading, error, execute } = useApiState();
  const [results, setResults] = useState<Paciente[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  const search = useCallback(async (filters: PacienteFilters) => {
    const result = await execute(() => apiService.searchPacientes(filters));
    if (result) {
      setResults(result.data);
      setPagination(result.pagination);
    }
  }, [execute]);

  return {
    results,
    pagination,
    loading,
    error,
    search
  };
};

// Hook para dashboard
export const useDashboard = () => {
  const { loading, error, execute } = useApiState();
  const [overview, setOverview] = useState<DashboardStats | null>(null);
  const [patientsStats, setPatientsStats] = useState<any>(null);
  const [appointmentsStats, setAppointmentsStats] = useState<any>(null);
  const [proceduresStats, setProceduresStats] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);

  const fetchOverview = useCallback(async () => {
    const result = await execute(() => apiService.getDashboardOverview());
    if (result) {
      setOverview(result);
    }
  }, [execute]);

  const fetchPatientsStats = useCallback(async () => {
    const result = await execute(() => apiService.getPatientsStats());
    if (result) {
      setPatientsStats(result);
    }
  }, [execute]);

  const fetchAppointmentsStats = useCallback(async () => {
    const result = await execute(() => apiService.getAppointmentsStats());
    if (result) {
      setAppointmentsStats(result);
    }
  }, [execute]);

  const fetchProceduresStats = useCallback(async () => {
    const result = await execute(() => apiService.getProceduresStats());
    if (result) {
      setProceduresStats(result);
    }
  }, [execute]);

  const fetchRecentActivities = useCallback(async () => {
    const result = await execute(() => apiService.getRecentActivities());
    if (result) {
      setRecentActivities(result);
    }
  }, [execute]);

  const fetchSystemHealth = useCallback(async () => {
    const result = await execute(() => apiService.getSystemHealth());
    if (result) {
      setSystemHealth(result);
    }
  }, [execute]);

  const fetchAll = useCallback(async () => {
    await Promise.all([
      fetchOverview(),
      fetchPatientsStats(),
      fetchAppointmentsStats(),
      fetchProceduresStats(),
      fetchRecentActivities(),
      fetchSystemHealth()
    ]);
  }, [
    fetchOverview,
    fetchPatientsStats,
    fetchAppointmentsStats,
    fetchProceduresStats,
    fetchRecentActivities,
    fetchSystemHealth
  ]);

  return {
    overview,
    patientsStats,
    appointmentsStats,
    proceduresStats,
    recentActivities,
    systemHealth,
    loading,
    error,
    fetchOverview,
    fetchPatientsStats,
    fetchAppointmentsStats,
    fetchProceduresStats,
    fetchRecentActivities,
    fetchSystemHealth,
    fetchAll
  };
};

// Hook para dados de referência
export const useReferenceData = () => {
  const { loading, error, execute } = useApiState();
  const [convenios, setConvenios] = useState<string[]>([]);
  const [estados, setEstados] = useState<string[]>([]);
  const [sexos, setSexos] = useState<string[]>([]);
  const [estadosCivis, setEstadosCivis] = useState<string[]>([]);
  const [tiposSanguineos, setTiposSanguineos] = useState<string[]>([]);

  const fetchConvenios = useCallback(async () => {
    const result = await execute(() => apiService.getConvenios());
    if (result) {
      setConvenios(result);
    }
  }, [execute]);

  const fetchEstados = useCallback(async () => {
    const result = await execute(() => apiService.getEstados());
    if (result) {
      setEstados(result);
    }
  }, [execute]);

  const fetchSexos = useCallback(async () => {
    const result = await execute(() => apiService.getSexos());
    if (result) {
      setSexos(result);
    }
  }, [execute]);

  const fetchEstadosCivis = useCallback(async () => {
    const result = await execute(() => apiService.getEstadosCivis());
    if (result) {
      setEstadosCivis(result);
    }
  }, [execute]);

  const fetchTiposSanguineos = useCallback(async () => {
    const result = await execute(() => apiService.getTiposSanguineos());
    if (result) {
      setTiposSanguineos(result);
    }
  }, [execute]);

  const fetchAll = useCallback(async () => {
    await Promise.all([
      fetchConvenios(),
      fetchEstados(),
      fetchSexos(),
      fetchEstadosCivis(),
      fetchTiposSanguineos()
    ]);
  }, [
    fetchConvenios,
    fetchEstados,
    fetchSexos,
    fetchEstadosCivis,
    fetchTiposSanguineos
  ]);

  return {
    convenios,
    estados,
    sexos,
    estadosCivis,
    tiposSanguineos,
    loading,
    error,
    fetchConvenios,
    fetchEstados,
    fetchSexos,
    fetchEstadosCivis,
    fetchTiposSanguineos,
    fetchAll
  };
};

// Hook para testar conexão
export const useApiConnection = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [testing, setTesting] = useState(false);

  const testConnection = useCallback(async () => {
    setTesting(true);
    const connected = await apiService.testConnection();
    setIsConnected(connected);
    setTesting(false);
  }, []);

  useEffect(() => {
    testConnection();
  }, [testConnection]);

  return {
    isConnected,
    testing,
    testConnection
  };
};
