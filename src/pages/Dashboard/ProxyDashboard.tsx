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

const ProxyDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Usando proxy local através de setupProxy.js
        console.log('Fazendo requisição via proxy:', '/api/dashboard/overview');

        const response = await fetch('/api/dashboard/overview', {
          method: 'GET',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
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
        <div style={{ marginTop: '2rem' }}>
          <div style={{ 
            border: '4px solid #f3f3f3', 
            borderTop: '4px solid #3498db', 
            borderRadius: '50%', 
            width: '40px', 
            height: '40px', 
            animation: 'spin 2s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '1rem' }}>Carregando dados via proxy...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h1>🦷 Dashboard Odontológico</h1>
        <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: '8px', padding: '1rem', margin: '1rem 0' }}>
          <p><strong>❌ Erro via Proxy:</strong> {error}</p>
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
          <p>Usando proxy para /api → http://127.0.0.1:8000</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🦷 Dashboard Odontológico</h1>
      <p style={{ color: '#28a745', marginBottom: '2rem' }}>✅ Dados carregados via proxy com sucesso!</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>👥 Pacientes</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0' }}>{stats?.patients?.total || 0}</p>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>Este mês: {stats?.patients?.this_month || 0}</p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>📅 Agendamentos</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0' }}>{stats?.appointments?.total || 0}</p>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>Hoje: {stats?.appointments?.today || 0}</p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>🔧 Procedimentos</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0' }}>{stats?.procedures?.total || 0}</p>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>Este mês: {stats?.procedures?.this_month || 0}</p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>📋 Anamneses</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0' }}>{stats?.anamneses?.total || 0}</p>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>Este mês: {stats?.anamneses?.this_month || 0}</p>
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d' }}>
          🔗 Conectado via proxy: React (3000) → Laravel (8000) → MySQL
        </p>
      </div>
    </div>
  );
};

export default ProxyDashboard;