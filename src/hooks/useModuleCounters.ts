import { useState, useEffect, useCallback } from 'react';
import api from '../components/api/api';
import { SECURITY_CONFIG } from '../config/security';

export interface ModuleCounter {
  total: number;
  endpoint: string;
  loading?: boolean;
  error?: string;
}

export interface ModuleCounters {
  [moduleName: string]: ModuleCounter;
}

interface ModuleCountersResponse {
  module_counters?: ModuleCounters;
  last_updated?: string;
}

export const useModuleCounters = (refreshInterval?: number) => {
  const [counters, setCounters] = useState<ModuleCounters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCounters = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get<ModuleCountersResponse>('/dashboard/module-counters');
      const moduleData = response.data?.module_counters ?? {};

      setCounters(moduleData);
      setLastUpdated(response.data?.last_updated ? new Date(response.data.last_updated) : new Date());
      setError(null);
    } catch (err) {
      setError('Erro ao carregar contadores dos módulos');
      if (SECURITY_CONFIG.LOGGING.ENABLE_DEBUG) {
        console.error('Erro ao carregar contadores:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCounters = useCallback(() => {
    fetchCounters();
  }, [fetchCounters]);

  useEffect(() => {
    // Carrega os dados iniciais
    fetchCounters();

    // Se um intervalo foi especificado, configura o refresh automático
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchCounters();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [fetchCounters, refreshInterval]);

  return { 
    counters, 
    loading, 
    error, 
    lastUpdated, 
    refreshCounters 
  };
};