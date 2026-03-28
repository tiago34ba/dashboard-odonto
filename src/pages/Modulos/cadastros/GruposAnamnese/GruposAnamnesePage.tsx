import React, { useState, useEffect, useCallback } from "react";
import ModalGrupoAnamnese from "./ModalGrupoAnamnese";
import api from "../../../../components/api/api";
import styled from "styled-components";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaList,
  FaDownload,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";

interface GrupoAnamnese {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  cor: string;
  icone: string;
  ordem: number;
  ativo: boolean;
  total_perguntas: number;
  created_at: string;
}

const normalizeGrupo = (item: any): GrupoAnamnese => ({
  id: item.id,
  codigo: item.codigo ?? "",
  nome: item.nome ?? "",
  descricao: item.descricao ?? "",
  cor: item.cor ?? "#3498db",
  icone: item.icone ?? "fa-list",
  ordem: Number(item.ordem ?? 0),
  ativo: Boolean(item.ativo ?? true),
  total_perguntas: Number(item.total_perguntas ?? 0),
  created_at: item.created_at ?? "",
});

const GruposAnamnesePage: React.FC = () => {
  const [grupos, setGrupos] = useState<GrupoAnamnese[]>([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [grupoEditando, setGrupoEditando] = useState<GrupoAnamnese | null>(null);
  const [gruposFiltrados, setGruposFiltrados] = useState<GrupoAnamnese[]>([]);

  const fetchGrupos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/groups-anamnese', { params: { per_page: 100 } });
      const data: GrupoAnamnese[] = (response.data?.data ?? []).map(normalizeGrupo);
      setGrupos(data);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? 'Erro ao carregar grupos de anamnese');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGrupos(); }, [fetchGrupos]);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(null), 4000);
    return () => clearTimeout(t);
  }, [successMsg]);

  useEffect(() => {
    let result = grupos.filter(grupo =>
      grupo.nome.toLowerCase().includes(filtroNome.toLowerCase()) ||
      grupo.codigo.toLowerCase().includes(filtroNome.toLowerCase()) ||
      grupo.descricao.toLowerCase().includes(filtroNome.toLowerCase())
    );
    if (filtroStatus === "ativo") result = result.filter(g => g.ativo);
    else if (filtroStatus === "inativo") result = result.filter(g => !g.ativo);
    setGruposFiltrados(result);
  }, [grupos, filtroNome, filtroStatus]);

  const handleAbrirModal = (grupo?: GrupoAnamnese) => {
    setGrupoEditando(grupo || null);
    setIsModalOpen(true);
  };

  const handleFecharModal = () => {
    setIsModalOpen(false);
    setGrupoEditando(null);
  };

  const handleSalvarGrupo = async (dadosGrupo: any) => {
    setErrorMsg(null);
    try {
      const payload = {
        codigo: dadosGrupo.codigo || null,
        nome: dadosGrupo.nome,
        descricao: dadosGrupo.descricao || null,
        cor: dadosGrupo.cor || null,
        icone: dadosGrupo.icone || null,
        ordem: Number(dadosGrupo.ordem ?? 0),
        ativo: Boolean(dadosGrupo.ativo ?? true),
      };
      if (grupoEditando) {
        await api.put(`/groups-anamnese/${grupoEditando.id}`, payload);
        setSuccessMsg('Grupo atualizado com sucesso!');
      } else {
        await api.post('/groups-anamnese', payload);
        setSuccessMsg('Grupo cadastrado com sucesso!');
      }
      handleFecharModal();
      await fetchGrupos();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? 'Erro ao salvar grupo');
    }
  };

  const handleExcluirGrupo = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este grupo de anamnese?")) return;
    setErrorMsg(null);
    try {
      await api.delete(`/groups-anamnese/${id}`);
      setSuccessMsg('Grupo excluido com sucesso!');
      await fetchGrupos();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? 'Erro ao excluir grupo');
    }
  };

  const estatisticas = {
    total: grupos.length,
    ativos: grupos.filter(g => g.ativo).length,
    inativos: grupos.filter(g => !g.ativo).length,
    totalPerguntas: grupos.reduce((acc, g) => acc + g.total_perguntas, 0),
  };

  return (
    <PageWrapper>
      <MainContent>
        {successMsg && (
          <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontWeight: 600, background: '#d1fae5', border: '1px solid #10b981', color: '#065f46' }}>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontWeight: 600, background: '#fee2e2', border: '1px solid #ef4444', color: '#b91c1c' }}>
            {errorMsg}
          </div>
        )}
        <PageHeader>
          <HeaderTitle>
            <FaList />
            Grupos de Anamnese
          </HeaderTitle>
          <HeaderActions>
            <ActionButton variant="primary" onClick={() => handleAbrirModal()}>
              <FaPlus />
              Novo Grupo
            </ActionButton>
            <ActionButton variant="info" onClick={() => alert('Exportacao em desenvolvimento')}>
              <FaDownload />
              Exportar
            </ActionButton>
          </HeaderActions>
        </PageHeader>

        <StatsContainer>
          <StatCard color="linear-gradient(135deg, #3498db 0%, #2980b9 100%)">
            <StatNumber>{estatisticas.total}</StatNumber>
            <StatLabel>Total de Grupos</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)">
            <StatNumber>{estatisticas.ativos}</StatNumber>
            <StatLabel>Grupos Ativos</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)">
            <StatNumber>{estatisticas.inativos}</StatNumber>
            <StatLabel>Grupos Inativos</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #f39c12 0%, #e67e22 100%)">
            <StatNumber>{estatisticas.totalPerguntas}</StatNumber>
            <StatLabel>Total de Perguntas</StatLabel>
          </StatCard>
        </StatsContainer>

        <FilterContainer>
          <FilterLabel><FaSearch /> Pesquisar:</FilterLabel>
          <FilterInput
            type="text"
            placeholder="Buscar por nome, codigo ou descricao..."
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
          />
          <FilterLabel><FaFilter /> Status:</FilterLabel>
          <FilterSelect value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
          </FilterSelect>
        </FilterContainer>

        <TableContainer>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Carregando grupos de anamnese...</div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Nome</th>
                  <th>Descricao</th>
                  <th>Cor</th>
                  <th>Ordem</th>
                  <th>Perguntas</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {gruposFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', color: '#888', padding: 30 }}>
                      Nenhum grupo encontrado
                    </td>
                  </tr>
                ) : gruposFiltrados.map((grupo) => (
                  <TableRow key={grupo.id}>
                    <td>{grupo.codigo}</td>
                    <td>
                      <GrupoInfo>
                        <ColorIndicator color={grupo.cor} />
                        <div>
                          <strong>{grupo.nome}</strong>
                          <IconeName>
                            <i className={`fas ${grupo.icone}`}></i>
                          </IconeName>
                        </div>
                      </GrupoInfo>
                    </td>
                    <td>
                      <Descricao>{grupo.descricao}</Descricao>
                    </td>
                    <td>
                      <ColorSample color={grupo.cor}>{grupo.cor}</ColorSample>
                    </td>
                    <td>
                      <OrdemBadge>{grupo.ordem}o</OrdemBadge>
                    </td>
                    <td>
                      <PerguntasBadge>{grupo.total_perguntas}</PerguntasBadge>
                    </td>
                    <td>
                      <StatusBadge ativo={grupo.ativo}>
                        {grupo.ativo ? <><FaCheckCircle /> Ativo</> : <><FaTimesCircle /> Inativo</>}
                      </StatusBadge>
                    </td>
                    <td>{grupo.created_at ? new Date(grupo.created_at).toLocaleDateString('pt-BR') : '-'}</td>
                    <td>
                      <ActionsContainer>
                        <ActionButton variant="warning" onClick={() => handleAbrirModal(grupo)} small>
                          <FaEdit /> Editar
                        </ActionButton>
                        <ActionButton variant="danger" onClick={() => handleExcluirGrupo(grupo.id)} small>
                          <FaTrash /> Excluir
                        </ActionButton>
                      </ActionsContainer>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}
        </TableContainer>

        <ModalGrupoAnamnese
          isOpen={isModalOpen}
          onClose={handleFecharModal}
          onSave={handleSalvarGrupo}
          grupo={grupoEditando}
        />
      </MainContent>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  display: flex;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 20px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
`;

const HeaderTitle = styled.h1`
  font-size: 28px;
  color: #2c3e50;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  svg { color: #3498db; }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button<{ variant?: string; small?: boolean }>`
  padding: ${({ small }) => small ? '8px 12px' : '12px 20px'};
  border: none;
  border-radius: 6px;
  font-size: ${({ small }) => small ? '12px' : '14px'};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  ${({ variant }) => {
    switch (variant) {
      case 'success': return 'background-color: #28a745; color: white;';
      case 'info': return 'background-color: #17a2b8; color: white;';
      case 'warning': return 'background-color: #ffc107; color: #212529;';
      case 'danger': return 'background-color: #dc3545; color: white;';
      default: return 'background-color: #007bff; color: white;';
    }
  }}
  &:hover { opacity: 0.9; }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  border-radius: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterInput = styled.input`
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  min-width: 250px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  &:focus { outline: none; }
`;

const FilterSelect = styled.select`
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  min-width: 150px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  &:focus { outline: none; }
`;

const FilterLabel = styled.label`
  color: white;
  font-weight: 500;
  margin-right: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const StatCard = styled.div<{ color?: string }>`
  padding: 20px;
  background: ${({ color }) => color ?? 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'};
  border-radius: 10px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StatNumber = styled.div`font-size: 24px; font-weight: bold; margin-bottom: 5px;`;
const StatLabel = styled.div`font-size: 14px; opacity: 0.9;`;

const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
  border: 1px solid #dee2e6;
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  th, td { padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; }
  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #495057;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.5px;
  }
  tbody tr:hover { background-color: #f8f9fa; }
`;

const TableRow = styled.tr`
  &:nth-child(even) { background-color: #fbfbfb; }
`;

const GrupoInfo = styled.div`display: flex; align-items: center; gap: 10px;`;

const ColorIndicator = styled.div<{ color: string }>`
  width: 20px; height: 20px; border-radius: 50%;
  background-color: ${({ color }) => color};
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const IconeName = styled.small`color: #6c757d; display: block; margin-top: 2px;`;

const Descricao = styled.div`
  max-width: 200px; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap; color: #6c757d;
`;

const ColorSample = styled.div<{ color: string }>`
  display: inline-block; padding: 4px 8px;
  background-color: ${({ color }) => color};
  color: white; border-radius: 4px; font-size: 12px; font-weight: 500;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
`;

const OrdemBadge = styled.span`
  background-color: #e9ecef; color: #495057;
  padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;
`;

const PerguntasBadge = styled.span`
  background-color: #007bff; color: white;
  padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;
`;

const StatusBadge = styled.span<{ ativo: boolean }>`
  display: flex; align-items: center; gap: 5px;
  padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;
  background-color: ${({ ativo }) => ativo ? '#28a745' : '#dc3545'};
  color: white;
`;

const ActionsContainer = styled.div`display: flex; gap: 8px;`;

export default GruposAnamnesePage;
