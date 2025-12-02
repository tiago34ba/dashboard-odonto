import React, { useState, useEffect } from 'react';

interface DashboardStats {
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
}

const SimpleDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fazendo requisição para:', 'http://127.0.0.1:8000/api/dashboard/overview');

        const response = await fetch('http://127.0.0.1:8000/api/dashboard/overview', {
          method: 'GET',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors'
        });

        console.log('Resposta recebida:', response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Dados recebidos:', data);
        setStats(data.overview);

      } catch (err) {
        console.error('Erro na requisição:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>🦷 Dashboard Odontológico</h1>
        <p>Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h1>🦷 Dashboard Odontológico</h1>
        <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: '8px', padding: '1rem', margin: '1rem 0' }}>
          <p><strong>❌ Erro:</strong> {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              background: '#007bff', 
              color: 'white', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            🔄 Tentar Novamente
          </button>
        </div>
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          <p>Verificações:</p>
          <ul style={{ textAlign: 'left', display: 'inline-block' }}>
            <li>✅ Laravel rodando: <a href="http://127.0.0.1:8000/api/dashboard/" target="_blank">http://127.0.0.1:8000/api/dashboard/</a></li>
            <li>✅ API endpoint: <a href="http://127.0.0.1:8000/api/dashboard/overview" target="_blank">http://127.0.0.1:8000/api/dashboard/overview</a></li>
            <li>🔧 Verifique o console do navegador para mais detalhes</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🦷 Dashboard Odontológico</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '8px' }}>
          <h3>👥 Pacientes</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.patients?.total || 0}</p>
          <p>Este mês: {stats?.patients?.this_month || 0}</p>
        </div>

        <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '8px' }}>
          <h3>📅 Agendamentos</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.appointments?.total || 0}</p>
          <p>Hoje: {stats?.appointments?.today || 0}</p>
        </div>

        <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '8px' }}>
          <h3>🔧 Procedimentos</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.procedures?.total || 0}</p>
          <p>Este mês: {stats?.procedures?.this_month || 0}</p>
        </div>

        <div style={{ background: '#fce7f3', padding: '1rem', borderRadius: '8px' }}>
          <h3>📋 Anamneses</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.anamneses?.total || 0}</p>
          <p>Este mês: {stats?.anamneses?.this_month || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboard;