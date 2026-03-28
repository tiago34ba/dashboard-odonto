import React, { useState, useEffect } from 'react';

interface DashboardStats {
  patients: { total: number; this_month: number; last_month: number; };
  appointments: { total: number; today: number; this_month: number; };
  procedures: { total: number; this_month: number; };
  anamneses: { total: number; this_month: number; };
}

const FixedDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const fetchWithMultipleMethods = async () => {
    const methods = [
      // Método 1: Via proxy
      async () => {
        const response = await fetch('/api/dashboard/overview', {
          method: 'GET',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Proxy failed');
        return response.json();
      },
      // Método 2: Direto com CORS
      async () => {
        const response = await fetch('http://127.0.0.1:8000/api/dashboard/overview', {
          method: 'GET',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          mode: 'cors'
        });
        if (!response.ok) throw new Error('Direct CORS failed');
        return response.json();
      },
      // Método 3: JSONP alternativo
      async () => {
        const response = await fetch('http://127.0.0.1:8000/api/dashboard/overview', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          mode: 'no-cors'
        });
        return response.json();
      }
    ];

    for (let i = 0; i < methods.length; i++) {
      try {
        console.log(`Tentativa ${i + 1}: Usando método ${i + 1}`);
        const data = await methods[i]();
        console.log('Sucesso! Dados recebidos:', data);
        return data;
      } catch (err) {
        console.log(`Método ${i + 1} falhou:`, err);
        if (i === methods.length - 1) throw err;
      }
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Iniciando busca de dados...');
        const data = await fetchWithMultipleMethods();
        
        if (data && data.overview) {
          setStats(data.overview);
        } else {
          throw new Error('Dados em formato inválido');
        }

      } catch (err) {
        console.error('Todos os métodos falharam:', err);
        setError(`Erro: ${err instanceof Error ? err.message : 'Desconhecido'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    setAttempts(prev => prev + 1);
  }, []);

  const retryFetch = () => {
    setAttempts(prev => prev + 1);
    window.location.reload();
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', color: 'white' }}>
        <h1>🦷 Dashboard Odontológico</h1>
        <div style={{ marginTop: '2rem' }}>
          <div style={{ 
            border: '4px solid rgba(255,255,255,0.3)', 
            borderTop: '4px solid white', 
            borderRadius: '50%', 
            width: '60px', 
            height: '60px', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '1rem' }}>Conectando com servidor Laravel...</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Tentativa {attempts}</p>
        </div>
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', color: 'white' }}>
        <h1>🦷 Dashboard Odontológico</h1>
        <div style={{ background: 'rgba(220, 38, 38, 0.2)', border: '2px solid rgba(220, 38, 38, 0.5)', borderRadius: '12px', padding: '2rem', margin: '2rem auto', maxWidth: '600px' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>❌ Erro de Conexão</h3>
          <p style={{ marginBottom: '1rem' }}>{error}</p>
          
          <button 
            onClick={retryFetch}
            style={{ 
              background: 'rgba(255,255,255,0.9)', 
              color: '#667eea', 
              border: 'none', 
              padding: '1rem 2rem', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              margin: '0.5rem'
            }}
          >
            🔄 Tentar Novamente
          </button>
          
          <div style={{ marginTop: '2rem', textAlign: 'left', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '1rem' }}>
            <h4>🔧 Verificações:</h4>
            <ul>
              <li>✅ Frontend: <code>http://127.0.0.1:3000</code></li>
              <li>📡 Backend: <a href="http://127.0.0.1:8000/api/dashboard/" target="_blank" style={{color:'#fbbf24'}}>http://127.0.0.1:8000/api/dashboard/</a></li>
              <li>🔍 API: <a href="http://127.0.0.1:8000/api/dashboard/overview" target="_blank" style={{color:'#fbbf24'}}>Testar endpoint</a></li>
              <li>🛠️ Tentativas realizadas: {attempts}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem', color: 'white' }}>
        <h1>🦷 Dashboard Odontológico</h1>
        <p style={{ opacity: 0.9 }}>✅ Conectado com sucesso ao servidor!</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)', 
          color: '#1a202c', 
          padding: '2rem', 
          borderRadius: '16px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          transform: 'translateY(0)',
          transition: 'transform 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2.5rem', marginRight: '1rem' }}>👥</div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>Pacientes</h3>
          </div>
          <p style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>{stats?.patients?.total || 0}</p>
          <p style={{ margin: 0, opacity: 0.8 }}>
            Este mês: <strong>{stats?.patients?.this_month || 0}</strong> | 
            Anterior: {stats?.patients?.last_month || 0}
          </p>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', 
          color: '#1a202c', 
          padding: '2rem', 
          borderRadius: '16px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2.5rem', marginRight: '1rem' }}>📅</div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>Agendamentos</h3>
          </div>
          <p style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>{stats?.appointments?.total || 0}</p>
          <p style={{ margin: 0, opacity: 0.8 }}>
            Hoje: <strong>{stats?.appointments?.today || 0}</strong> | 
            Este mês: {stats?.appointments?.this_month || 0}
          </p>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', 
          color: '#1a202c', 
          padding: '2rem', 
          borderRadius: '16px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2.5rem', marginRight: '1rem' }}>🔧</div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>Procedimentos</h3>
          </div>
          <p style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>{stats?.procedures?.total || 0}</p>
          <p style={{ margin: 0, opacity: 0.8 }}>
            Este mês: <strong>{stats?.procedures?.this_month || 0}</strong>
          </p>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', 
          color: '#1a202c', 
          padding: '2rem', 
          borderRadius: '16px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2.5rem', marginRight: '1rem' }}>📋</div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>Anamneses</h3>
          </div>
          <p style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>{stats?.anamneses?.total || 0}</p>
          <p style={{ margin: 0, opacity: 0.8 }}>
            Este mês: <strong>{stats?.anamneses?.this_month || 0}</strong>
          </p>
        </div>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>
            🔗 React ({window.location.port || '3000'}) ↔️ Laravel (8000) ↔️ MySQL
          </p>
        </div>
      </div>
    </div>
  );
};

export default FixedDashboard;