import { useState, useEffect, useCallback } from 'react';

export interface ModuleCounter {
  total: number;
  endpoint: string;
  loading?: boolean;
  error?: string;
}

export interface ModuleCounters {
  [moduleName: string]: ModuleCounter;
}

export const useModuleCounters = (refreshInterval?: number) => {
  const [counters, setCounters] = useState<ModuleCounters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCounters = useCallback(async () => {
    try {
      setLoading(true);
      
      // Simulando dados dos módulos com contadores
      const moduleData: ModuleCounters = {
        'Pacientes': {
          total: 1250,
          endpoint: '/pessoas/pacientes/PatientsPage',
          loading: false
        },
        'Usuários': {
          total: 25,
          endpoint: '/pessoas/usuarios',
          loading: false
        },
        'Funcionários': {
          total: 15,
          endpoint: '/pessoas/funcionarios',
          loading: false
        },
        'Agendamentos': {
          total: 450,
          endpoint: '/agendamentos',
          loading: false
        },
        'Procedimentos': {
          total: 180,
          endpoint: '/cadastros/procedimentos',
          loading: false
        },
        'Convênios': {
          total: 8,
          endpoint: '/cadastros/convenios',
          loading: false
        },
        'Contas a Pagar': {
          total: 75,
          endpoint: '/financeiro/contas-pagar',
          loading: false
        },
        'Contas a Receber': {
          total: 125,
          endpoint: '/financeiro/contas-receber',
          loading: false
        },
        'Fornecedores': {
          total: 35,
          endpoint: '/cadastros/fornecedores',
          loading: false
        },
        'Comissões': {
          total: 45,
          endpoint: '/financeiro/comissoes',
          loading: false
        },
        'Tratamentos': {
          total: 234,
          endpoint: '/tratamentos',
          loading: false
        },
        'Orçamentos': {
          total: 92,
          endpoint: '/orcamentos',
          loading: false
        }
      };

      // Simulando delay de rede
      await new Promise(resolve => setTimeout(resolve, 300));

      setCounters(moduleData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Erro ao carregar contadores dos módulos');
      console.error('Erro ao carregar contadores:', err);
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