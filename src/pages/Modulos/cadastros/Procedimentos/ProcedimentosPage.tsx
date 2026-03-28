import React, { useState, useEffect, useCallback } from "react";
import ModalProcedimento from "./ModalProcedimento";
import api from "../../../../components/api/api";
import styled from "styled-components";
import { FaPlus, FaEdit, FaTrash, FaToolbox, FaDownload, FaFileExport, FaClock } from "react-icons/fa";

interface Procedimento {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  valor: number;
  duracao: number;
  descricao: string;
  ativo: boolean;
  created_at: string;
}

const normalizeProc = (item: any): Procedimento => ({
  id: item.id,
  codigo: item.codigo ?? "",
  nome: item.name ?? item.nome ?? "",
  categoria: item.category ?? item.categoria ?? "",
  valor: Number(item.value ?? item.valor ?? 0),
  duracao: Number(item.time ?? item.duracao ?? 0),
  descricao: item.description ?? item.descricao ?? "",
  ativo: Boolean(item.active ?? item.ativo ?? true),
  created_at: item.created_at ?? "",
});

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
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 40px);
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
`;

const Title = styled.h2`
  font-size: 28px;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const StyledButton = styled.button<{ variant?: "primary" | "success" | "info" }>`
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ variant = "primary" }) => {
    switch (variant) {
      case "success":
        return "background-color: #28a745; color: white;";
      case "info":
        return "background-color: #17a2b8; color: white;";
      default:
        return "background-color: #007bff; color: white;";
    }
  }}
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterInput = styled.input`
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  min-width: 200px;
`;

const FilterSelect = styled.select`
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  min-width: 150px;
`;

const FilterLabel = styled.label`
  color: white;
  font-weight: 500;
  margin-right: 8px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const StatCard = styled.div<{ color?: string }>`
  padding: 20px;
  background: ${({ color = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }) => color};
  border-radius: 10px;
  color: white;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const StatLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
  border: 1px solid #dee2e6;
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #dee2e6;
    vertical-align: middle;
  }

  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #495057;
    position: sticky;
    top: 0;
  }
`;

const StatusBadge = styled.span<{ ativo: boolean }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  background-color: ${({ ativo }) => (ativo ? "#e8f5e8" : "#ffebee")};
  color: ${({ ativo }) => (ativo ? "#2e7d32" : "#d32f2f")};
`;

const ActionButton = styled.button<{ variant?: "edit" | "delete" }>`
  padding: 6px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin: 0 2px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  ${({ variant = "edit" }) =>
    variant === "delete"
      ? "background-color: #dc3545; color: white;"
      : "background-color: #007bff; color: white;"}
`;

export default function ProcedimentosPage() {
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [filteredProcedimentos, setFilteredProcedimentos] = useState<Procedimento[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProcedimento, setEditingProcedimento] = useState<Procedimento | null>(null);
  const [filtros, setFiltros] = useState({ nome: "", categoria: "", ativo: "todos" });

  const fetchProcedimentos = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await api.get("/procedures", { params: { per_page: 100 } });
      const data: Procedimento[] = (response.data?.data ?? []).map(normalizeProc);
      setProcedimentos(data);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? "Erro ao carregar procedimentos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProcedimentos();
  }, [fetchProcedimentos]);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(null), 4000);
    return () => clearTimeout(t);
  }, [successMsg]);

  useEffect(() => {
    let filtered = procedimentos;

    if (filtros.nome) {
      filtered = filtered.filter(
        (p) => p.nome.toLowerCase().includes(filtros.nome.toLowerCase()) || p.codigo.toLowerCase().includes(filtros.nome.toLowerCase())
      );
    }

    if (filtros.categoria) filtered = filtered.filter((p) => p.categoria === filtros.categoria);
    if (filtros.ativo !== "todos") filtered = filtered.filter((p) => p.ativo === (filtros.ativo === "ativo"));

    setFilteredProcedimentos(filtered);
  }, [filtros, procedimentos]);

  const stats = {
    total: procedimentos.length,
    ativos: procedimentos.filter((p) => p.ativo).length,
    inativos: procedimentos.filter((p) => !p.ativo).length,
    valorMedio: procedimentos.length ? procedimentos.reduce((acc, p) => acc + p.valor, 0) / procedimentos.length : 0,
  };

  const handleSaveProcedimento = async (procedimentoData: any) => {
    setErrorMsg(null);
    try {
      const payload = {
        codigo: procedimentoData.codigo || null,
        name: procedimentoData.nome || procedimentoData.name,
        category: procedimentoData.categoria || procedimentoData.category || null,
        value: Number(procedimentoData.valor ?? procedimentoData.value ?? 0),
        time: Number(procedimentoData.duracao ?? procedimentoData.time ?? 0),
        description: procedimentoData.descricao || procedimentoData.description || null,
        active: Boolean(procedimentoData.ativo ?? true),
      };

      if (editingProcedimento) {
        await api.put(`/procedures/${editingProcedimento.id}`, payload);
        setSuccessMsg("Procedimento atualizado com sucesso!");
      } else {
        await api.post("/procedures", payload);
        setSuccessMsg("Procedimento cadastrado com sucesso!");
      }

      setEditingProcedimento(null);
      setIsModalOpen(false);
      await fetchProcedimentos();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? "Erro ao salvar procedimento");
    }
  };

  const handleEdit = (procedimento: Procedimento) => {
    setEditingProcedimento(procedimento);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este procedimento?")) return;
    setErrorMsg(null);
    try {
      await api.delete(`/procedures/${id}`);
      setSuccessMsg("Procedimento excluido com sucesso!");
      await fetchProcedimentos();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? "Erro ao excluir procedimento");
    }
  };

  const categorias = ["Preventivo", "Restaurador", "Endodontia", "Cirurgico", "Ortodontia", "Protetico", "Estetico"];

  return (
    <PageWrapper>
      <MainContent>
        <Header>
          <Title>
            <FaToolbox />
            Cadastro de Procedimentos
          </Title>
          <Actions>
            <StyledButton variant="primary" onClick={() => setIsModalOpen(true)}>
              <FaPlus /> Novo Procedimento
            </StyledButton>
            <StyledButton variant="success" onClick={() => alert("Exportacao Excel em desenvolvimento")}> 
              <FaDownload /> Exportar Excel
            </StyledButton>
            <StyledButton variant="info" onClick={() => alert("Exportacao XML em desenvolvimento")}> 
              <FaFileExport /> Exportar XML
            </StyledButton>
          </Actions>
        </Header>

        {successMsg && <div style={{ padding: 12, borderRadius: 8, marginBottom: 16, background: "#d1fae5", border: "1px solid #10b981", color: "#065f46" }}>{successMsg}</div>}
        {errorMsg && <div style={{ padding: 12, borderRadius: 8, marginBottom: 16, background: "#fee2e2", border: "1px solid #ef4444", color: "#b91c1c" }}>{errorMsg}</div>}

        <StatsContainer>
          <StatCard color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"><StatNumber>{stats.total}</StatNumber><StatLabel>Total de Procedimentos</StatLabel></StatCard>
          <StatCard color="linear-gradient(135deg, #28a745 0%, #20c997 100%)"><StatNumber>{stats.ativos}</StatNumber><StatLabel>Procedimentos Ativos</StatLabel></StatCard>
          <StatCard color="linear-gradient(135deg, #dc3545 0%, #c82333 100%)"><StatNumber>{stats.inativos}</StatNumber><StatLabel>Procedimentos Inativos</StatLabel></StatCard>
          <StatCard color="linear-gradient(135deg, #ffc107 0%, #f39c12 100%)"><StatNumber>R$ {stats.valorMedio.toFixed(0)}</StatNumber><StatLabel>Valor Medio</StatLabel></StatCard>
        </StatsContainer>

        <FilterContainer>
          <div>
            <FilterLabel>Buscar:</FilterLabel>
            <FilterInput value={filtros.nome} onChange={(e) => setFiltros({ ...filtros, nome: e.target.value })} placeholder="Nome ou codigo..." />
          </div>
          <div>
            <FilterLabel>Categoria:</FilterLabel>
            <FilterSelect value={filtros.categoria} onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}>
              <option value="">Todas</option>
              {categorias.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </FilterSelect>
          </div>
          <div>
            <FilterLabel>Status:</FilterLabel>
            <FilterSelect value={filtros.ativo} onChange={(e) => setFiltros({ ...filtros, ativo: e.target.value })}>
              <option value="todos">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </FilterSelect>
          </div>
        </FilterContainer>

        <TableContainer>
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#666" }}>Carregando procedimentos...</div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th>Duracao</th>
                  <th>Status</th>
                  <th>Data Criacao</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {filteredProcedimentos.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: "center", color: "#888", padding: 30 }}>Nenhum procedimento encontrado</td></tr>
                ) : (
                  filteredProcedimentos.map((procedimento) => (
                    <tr key={procedimento.id}>
                      <td><strong>{procedimento.codigo}</strong></td>
                      <td>
                        <strong>{procedimento.nome}</strong>
                        <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{procedimento.descricao}</div>
                      </td>
                      <td>{procedimento.categoria}</td>
                      <td><strong style={{ color: "#28a745" }}>R$ {procedimento.valor.toFixed(2)}</strong></td>
                      <td><div style={{ display: "flex", alignItems: "center", gap: 4 }}><FaClock size={12} />{procedimento.duracao} min</div></td>
                      <td><StatusBadge ativo={procedimento.ativo}>{procedimento.ativo ? "Ativo" : "Inativo"}</StatusBadge></td>
                      <td>{procedimento.created_at ? new Date(procedimento.created_at).toLocaleDateString("pt-BR") : "-"}</td>
                      <td>
                        <ActionButton variant="edit" onClick={() => handleEdit(procedimento)}><FaEdit /></ActionButton>
                        <ActionButton variant="delete" onClick={() => handleDelete(procedimento.id)}><FaTrash /></ActionButton>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </TableContainer>

        <ModalProcedimento
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProcedimento(null);
          }}
          onSave={handleSaveProcedimento}
          procedimento={editingProcedimento}
        />
      </MainContent>
    </PageWrapper>
  );
}
