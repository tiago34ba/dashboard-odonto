import React, { useState, useEffect, useCallback } from "react";
import ModalItemAnamnese from "./ModalItemAnamnese";
import api from "../../../../components/api/api";
import styled from "styled-components";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaClipboardList,
  FaDownload,
  FaFileExport,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

interface ItemAnamnese {
  id: number;
  codigo: string;
  pergunta: string;
  tipo_resposta: string;
  grupo: string;
  obrigatorio: boolean;
  opcoes_resposta?: string[];
  observacoes: string;
  ativo: boolean;
  created_at: string;
}

const normalizeItem = (item: any): ItemAnamnese => ({
  id: item.id,
  codigo: item.codigo ?? "",
  pergunta: item.name ?? item.pergunta ?? "",
  tipo_resposta: item.tipo_resposta ?? "",
  grupo: item.group ?? item.grupo ?? "",
  obrigatorio: Boolean(item.obrigatorio ?? false),
  opcoes_resposta: item.opcoes_resposta ?? [],
  observacoes: item.description ?? item.observacoes ?? "",
  ativo: Boolean(item.ativo ?? true),
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
  transition: all 0.3s ease;

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

  &:hover {
    opacity: 0.9;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
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
  background: ${({ color = "linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%)" }) => color};
  border-radius: 10px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
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
  margin: 0;

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
    z-index: 10;
    border-bottom: 2px solid #dee2e6;
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

const TipoBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: #e3f2fd;
  color: #1976d2;
`;

const ObrigatorioBadge = styled.span<{ obrigatorio: boolean }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ obrigatorio }) => (obrigatorio ? "#fff3e0" : "#f3e5f5")};
  color: ${({ obrigatorio }) => (obrigatorio ? "#f57c00" : "#7b1fa2")};
  display: inline-flex;
  align-items: center;
  gap: 4px;
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

export default function ItensAnamnesePage() {
  const [itens, setItens] = useState<ItemAnamnese[]>([]);
  const [filteredItens, setFilteredItens] = useState<ItemAnamnese[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemAnamnese | null>(null);
  const [filtros, setFiltros] = useState({
    pergunta: "",
    grupo: "",
    tipo_resposta: "",
    ativo: "todos",
  });

  const fetchItens = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await api.get("/anamneses", { params: { per_page: 100 } });
      const data: ItemAnamnese[] = (response.data?.data ?? []).map(normalizeItem);
      setItens(data);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? "Erro ao carregar itens de anamnese");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItens();
  }, [fetchItens]);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(null), 4000);
    return () => clearTimeout(t);
  }, [successMsg]);

  useEffect(() => {
    let filtered = itens;

    if (filtros.pergunta) {
      filtered = filtered.filter(
        (i) =>
          i.pergunta.toLowerCase().includes(filtros.pergunta.toLowerCase()) ||
          i.codigo.toLowerCase().includes(filtros.pergunta.toLowerCase())
      );
    }

    if (filtros.grupo) filtered = filtered.filter((i) => i.grupo === filtros.grupo);
    if (filtros.tipo_resposta) filtered = filtered.filter((i) => i.tipo_resposta === filtros.tipo_resposta);
    if (filtros.ativo !== "todos") filtered = filtered.filter((i) => i.ativo === (filtros.ativo === "ativo"));

    setFilteredItens(filtered);
  }, [filtros, itens]);

  const stats = {
    total: itens.length,
    ativos: itens.filter((i) => i.ativo).length,
    obrigatorios: itens.filter((i) => i.obrigatorio).length,
    grupos: [...new Set(itens.map((i) => i.grupo))].length,
  };

  const handleSaveItem = async (itemData: any) => {
    setErrorMsg(null);
    try {
      const payload = {
        codigo: itemData.codigo || null,
        name: itemData.pergunta || itemData.name,
        group: itemData.grupo || itemData.group || null,
        description: itemData.observacoes || itemData.description || null,
        tipo_resposta: itemData.tipo_resposta || null,
        obrigatorio: Boolean(itemData.obrigatorio ?? false),
        opcoes_resposta: itemData.opcoes_resposta || [],
        ativo: Boolean(itemData.ativo ?? true),
      };

      if (editingItem) {
        await api.put(`/anamneses/${editingItem.id}`, payload);
        setSuccessMsg("Item atualizado com sucesso!");
      } else {
        await api.post("/anamneses", payload);
        setSuccessMsg("Item cadastrado com sucesso!");
      }

      setEditingItem(null);
      setIsModalOpen(false);
      await fetchItens();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? "Erro ao salvar item");
    }
  };

  const handleEdit = (item: ItemAnamnese) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;
    setErrorMsg(null);
    try {
      await api.delete(`/anamneses/${id}`);
      setSuccessMsg("Item excluido com sucesso!");
      await fetchItens();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? "Erro ao excluir item");
    }
  };

  const grupos = [...new Set(itens.map((i) => i.grupo))];
  const tiposResposta = [...new Set(itens.map((i) => i.tipo_resposta))];

  return (
    <PageWrapper>
      <MainContent>
        <Header>
          <Title>
            <FaClipboardList />
            Itens de Anamnese
          </Title>
          <Actions>
            <StyledButton variant="primary" onClick={() => setIsModalOpen(true)}>
              <FaPlus />
              Novo Item
            </StyledButton>
            <StyledButton variant="success" onClick={() => alert("Exportacao Excel em desenvolvimento")}>
              <FaDownload />
              Exportar Excel
            </StyledButton>
            <StyledButton variant="info" onClick={() => alert("Exportacao XML em desenvolvimento")}>
              <FaFileExport />
              Exportar XML
            </StyledButton>
          </Actions>
        </Header>

        {successMsg && <div style={{ padding: 12, borderRadius: 8, marginBottom: 16, background: "#d1fae5", border: "1px solid #10b981", color: "#065f46" }}>{successMsg}</div>}
        {errorMsg && <div style={{ padding: 12, borderRadius: 8, marginBottom: 16, background: "#fee2e2", border: "1px solid #ef4444", color: "#b91c1c" }}>{errorMsg}</div>}

        <StatsContainer>
          <StatCard color="linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%)">
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Total de Itens</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #28a745 0%, #20c997 100%)">
            <StatNumber>{stats.ativos}</StatNumber>
            <StatLabel>Itens Ativos</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #ffc107 0%, #f39c12 100%)">
            <StatNumber>{stats.obrigatorios}</StatNumber>
            <StatLabel>Itens Obrigatorios</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #17a2b8 0%, #138496 100%)">
            <StatNumber>{stats.grupos}</StatNumber>
            <StatLabel>Grupos Diferentes</StatLabel>
          </StatCard>
        </StatsContainer>

        <FilterContainer>
          <div>
            <FilterLabel>Buscar:</FilterLabel>
            <FilterInput value={filtros.pergunta} onChange={(e) => setFiltros({ ...filtros, pergunta: e.target.value })} placeholder="Pergunta ou codigo..." />
          </div>
          <div>
            <FilterLabel>Grupo:</FilterLabel>
            <FilterSelect value={filtros.grupo} onChange={(e) => setFiltros({ ...filtros, grupo: e.target.value })}>
              <option value="">Todos os Grupos</option>
              {grupos.map((grupo) => (
                <option key={grupo} value={grupo}>{grupo}</option>
              ))}
            </FilterSelect>
          </div>
          <div>
            <FilterLabel>Tipo:</FilterLabel>
            <FilterSelect value={filtros.tipo_resposta} onChange={(e) => setFiltros({ ...filtros, tipo_resposta: e.target.value })}>
              <option value="">Todos os Tipos</option>
              {tiposResposta.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </FilterSelect>
          </div>
        </FilterContainer>

        <TableContainer>
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#666" }}>Carregando itens...</div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Pergunta</th>
                  <th>Grupo</th>
                  <th>Tipo Resposta</th>
                  <th>Obrigatorio</th>
                  <th>Status</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {filteredItens.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", color: "#888", padding: 30 }}>Nenhum item encontrado</td>
                  </tr>
                ) : (
                  filteredItens.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.codigo}</strong></td>
                      <td>
                        <strong>{item.pergunta}</strong>
                        {item.observacoes && <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{item.observacoes}</div>}
                      </td>
                      <td>{item.grupo}</td>
                      <td><TipoBadge>{item.tipo_resposta}</TipoBadge></td>
                      <td>
                        <ObrigatorioBadge obrigatorio={item.obrigatorio}>
                          {item.obrigatorio ? <><FaExclamationTriangle size={10} /> Obrigatorio</> : <><FaCheckCircle size={10} /> Opcional</>}
                        </ObrigatorioBadge>
                      </td>
                      <td><StatusBadge ativo={item.ativo}>{item.ativo ? "Ativo" : "Inativo"}</StatusBadge></td>
                      <td>
                        <ActionButton variant="edit" onClick={() => handleEdit(item)}><FaEdit /></ActionButton>
                        <ActionButton variant="delete" onClick={() => handleDelete(item.id)}><FaTrash /></ActionButton>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </TableContainer>

        <ModalItemAnamnese
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSaveItem}
          item={editingItem}
        />
      </MainContent>
    </PageWrapper>
  );
}
