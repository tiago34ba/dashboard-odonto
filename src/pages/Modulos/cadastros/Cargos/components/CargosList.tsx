import React, { useState, useEffect, useCallback } from 'react';
import './CargosList.css';

interface Cargo {
  id: number;
  nome: string;
  descricao: string;
  nivel_acesso: 'baixo' | 'medio' | 'alto' | 'admin';
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

const CargosList = ({ onCreate, onEdit }: { onCreate?: () => void; onEdit?: (cargo: Cargo) => void }) => {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterNivel, setFilterNivel] = useState<string>('');
  const [filterAtivo, setFilterAtivo] = useState<string>('');
  const [sortBy, setSortBy] = useState<'id' | 'nome' | 'nivel_acesso' | 'created_at'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchCargos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cargosFake: Cargo[] = [
        { id: 1, nome: "Cirurgião-Dentista", descricao: "Profissional responsável por diagnósticos, tratamentos e procedimentos odontológicos", nivel_acesso: "alto", ativo: true, created_at: "2024-01-15T10:00:00Z", updated_at: "2024-01-15T10:00:00Z" },
        { id: 2, nome: "Auxiliar de Saúde Bucal", descricao: "Assistência ao dentista durante procedimentos e orientação aos pacientes", nivel_acesso: "medio", ativo: true, created_at: "2024-01-20T10:00:00Z", updated_at: "2024-01-20T10:00:00Z" },
        { id: 3, nome: "Recepcionista Odontológica", descricao: "Atendimento ao paciente, agendamentos e controle de prontuários", nivel_acesso: "baixo", ativo: true, created_at: "2024-02-10T10:00:00Z", updated_at: "2024-02-10T10:00:00Z" },
        { id: 4, nome: "Técnico em Prótese Dentária", descricao: "Confecção, reparo e manutenção de próteses e aparelhos ortodônticos", nivel_acesso: "medio", ativo: true, created_at: "2024-02-15T10:00:00Z", updated_at: "2024-02-15T10:00:00Z" },
        { id: 5, nome: "Administrador da Clínica", descricao: "Gestão completa da clínica, finanças, RH e supervisão geral", nivel_acesso: "admin", ativo: true, created_at: "2024-03-01T10:00:00Z", updated_at: "2024-03-01T10:00:00Z" }
      ];
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredData = cargosFake;
      if (search.trim()) {
        filteredData = filteredData.filter(cargo => 
          cargo.nome.toLowerCase().includes(search.toLowerCase()) ||
          cargo.descricao.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (filterNivel) {
        filteredData = filteredData.filter(cargo => cargo.nivel_acesso === filterNivel);
      }
      if (filterAtivo) {
        filteredData = filteredData.filter(cargo => 
          filterAtivo === 'true' ? cargo.ativo : !cargo.ativo
        );
      }
      filteredData.sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'id') {
          comparison = a.id - b.id;
        } else if (sortBy === 'nome') {
          comparison = a.nome.localeCompare(b.nome);
        } else if (sortBy === 'nivel_acesso') {
          const nivelOrder = { baixo: 1, medio: 2, alto: 3, admin: 4 };
          comparison = nivelOrder[a.nivel_acesso] - nivelOrder[b.nivel_acesso];
        } else if (sortBy === 'created_at') {
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        } else {
          comparison = a.id - b.id;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
      const startIndex = (currentPage - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      setCargos(paginatedData);
      setLastPage(Math.ceil(filteredData.length / perPage));
      setTotal(filteredData.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, search, sortBy, sortOrder, filterNivel, filterAtivo]);

  useEffect(() => {
    fetchCargos();
  }, [fetchCargos]);

  // Renderização principal
  return (
    <div className="cargos-container">
      <div className="cargos-content">
        <div className="cargos-header">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="cargos-logo w-12 h-12 rounded-lg flex items-center justify-center"></div>
                <div>
                  <h1 className="cargos-title text-2xl font-bold">Gestão de Cargos</h1>
                  <p className="cargos-subtitle text-sm">Sistema Odontológico - Controle de Funções e Permissões</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={onCreate} className="btn-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg">
                  <span>+ Novo Cargo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="table-container mt-4">
          {error && <div className="error">{error}</div>}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner">
                <div className="loading-ring"></div>
                <div className="loading-icon"><span>⏳</span></div>
              </div>
              <p className="loading-text">Carregando cargos do sistema</p>
              <p className="loading-subtext">Aguarde um momento...</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="table-header">
                <tr>
                  <th className="px-3 py-4 text-center">ID</th>
                  <th className="px-4 py-4 text-left">Nome</th>
                  <th className="px-4 py-4 text-left">Descrição</th>
                  <th className="px-3 py-4 text-center">Nível de Acesso</th>
                  <th className="px-3 py-4 text-center">Status</th>
                  <th className="px-3 py-4 text-center">Data Criação</th>
                  <th className="px-3 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {cargos.map((cargo) => (
                  <tr key={cargo.id} className="table-row">
                    <td className="px-3 py-3 text-center">
                      <div className="row-id-badge">{cargo.id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="cargo-name">{cargo.nome}</div>
                      <div className="cargo-subtitle">{cargo.descricao}</div>
                    </td>
                    <td className="px-4 py-3">{cargo.descricao}</td>
                    <td className="px-3 py-3 text-center">
                      <span className={`nivel-badge nivel-${cargo.nivel_acesso}`}>{cargo.nivel_acesso === 'admin' ? 'Administrador' : cargo.nivel_acesso.charAt(0).toUpperCase() + cargo.nivel_acesso.slice(1)}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`status-badge ${cargo.ativo ? 'status-ativo' : 'status-inativo'}`}>
                        <span className={`status-dot ${cargo.ativo ? 'ativo' : 'inativo'}`}></span>
                        {cargo.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="date-info">
                        <div className="date-main">{new Date(cargo.created_at).toLocaleDateString('pt-BR')}</div>
                        <div className="date-time">{new Date(cargo.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="action-buttons">
                        <button className="action-btn btn-editar" onClick={() => onEdit && onEdit(cargo)}>Editar</button>
                        <button className="action-btn btn-excluir">Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CargosList;