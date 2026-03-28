import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../../../components/api/api';
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

const CargosList = ({ onCreate, onEdit, refreshKey = 0 }: { onCreate?: () => void; onEdit?: (cargo: Cargo) => void; refreshKey?: number }) => {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search] = useState('');
  const [filterNivel] = useState<string>('');
  const [filterAtivo] = useState<string>('');
  const [sortBy] = useState<'id' | 'nome' | 'nivel_acesso' | 'created_at'>('id');
  const [sortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage] = useState(1);
  const [perPage] = useState(5);
  const [_lastPage, setLastPage] = useState(1);
  const [_total, setTotal] = useState(0);

  const fetchCargos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('per_page', String(perPage));
      if (search.trim()) params.set('search', search);
      if (filterNivel) params.set('nivel_acesso', filterNivel);
      if (filterAtivo) params.set('ativo', filterAtivo);

      const response = await api.get(`/cargos?${params.toString()}`);
      const payload = response.data;
      setCargos(payload?.data ?? []);
      setLastPage(payload?.pagination?.last_page ?? 1);
      setTotal(payload?.pagination?.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, search, sortBy, sortOrder, filterNivel, filterAtivo]);

  useEffect(() => {
    fetchCargos();
  }, [fetchCargos, refreshKey]);

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