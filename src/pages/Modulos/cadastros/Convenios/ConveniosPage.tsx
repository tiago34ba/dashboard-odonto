import React, { useState, useEffect, useCallback } from "react";
import ModalConvenio from "./ModalConvenio";
import api from "../../../../components/api/api";
import styled from "styled-components";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaHandshake,
  FaDownload,
  FaFileExport,
  FaPhone,
  FaEnvelope
} from "react-icons/fa";

interface Convenio {
  id: number;
  codigo: string;
  nome: string;
  tipo: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  uf: string;
  cep: string;
  contato_responsavel: string;
  desconto_percentual: number;
  ativo: boolean;
  created_at: string;
}

const normalizeConvenio = (item: any): Convenio => ({
  id: item.id,
  codigo: item.codigo ?? "",
  nome: item.name ?? item.nome ?? "",
  tipo: item.tipo ?? "",
  cnpj: item.cnpj ?? "",
  telefone: item.phone ?? item.telefone ?? "",
  email: item.email ?? "",
  endereco: item.endereco ?? "",
  cidade: item.cidade ?? "",
  uf: item.uf ?? "",
  cep: item.cep ?? "",
  contato_responsavel: item.contato_responsavel ?? "",
  desconto_percentual: Number(item.desconto_percentual ?? item.clinic_commission ?? 0),
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

const AlertBox = styled.div<{ type: "success" | "error" }>`
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-weight: 600;
  background: ${({ type }) => (type === "success" ? "#d1fae5" : "#fee2e2")};
  border: 1px solid ${({ type }) => (type === "success" ? "#10b981" : "#ef4444")};
  color: ${({ type }) => (type === "success" ? "#065f46" : "#b91c1c")};
`;

const StyledButton = styled.button<{ variant?: "primary" | "success" | "info" | "warning" | "danger" }>`
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
      case "danger":
        return "background-color: #dc3545; color: white;";
      default:
        return "background-color: #007bff; color: white;";
    }
  }}
  &:hover { opacity: 0.9; }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #2e8b57 0%, #3cb371 100%);
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
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const StatCard = styled.div<{ color?: string }>`
  padding: 20px;
  background: ${({ color }) => color ?? "linear-gradient(135deg, #2e8b57 0%, #3cb371 100%)"};
  border-radius: 10px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
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
  th, td {
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
  tr:hover { background-color: #f1f3f4; }
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

const TipoBadge = styled.span<{ tipo: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  background-color: ${({ tipo }) => (tipo === "Plano de Saude" ? "#e3f2fd" : "#f3e5f5")};
  color: ${({ tipo }) => (tipo === "Plano de Saude" ? "#1976d2" : "#7b1fa2")};
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
  ${({ variant }) =>
    variant === "delete"
      ? "background-color: #dc3545; color: white;"
      : "background-color: #007bff; color: white;"}
  &:hover { opacity: 0.85; }
`;

export default function ConveniosPage() {
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [filteredConvenios, setFilteredConvenios] = useState<Convenio[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConvenio, setEditingConvenio] = useState<Convenio | null>(null);
  const [filtros, setFiltros] = useState({ nome: "", tipo: "", ativo: "todos" });

  const fetchConvenios = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/agreements", { params: { per_page: 100 } });
      const data: Convenio[] = (response.data?.data ?? []).map(normalizeConvenio);
      setConvenios(data);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? "Erro ao carregar convenios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchConvenios(); }, [fetchConvenios]);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(null), 4000);
    return () => clearTimeout(t);
  }, [successMsg]);

  useEffect(() => {
    let filtered = convenios;
    if (filtros.nome) {
      filtered = filtered.filter(
        (c) =>
          c.nome.toLowerCase().includes(filtros.nome.toLowerCase()) ||
          c.codigo.toLowerCase().includes(filtros.nome.toLowerCase())
      );
    }
    if (filtros.tipo) {
      filtered = filtered.filter((c) => c.tipo === filtros.tipo);
    }
    if (filtros.ativo !== "todos") {
      filtered = filtered.filter((c) => c.ativo === (filtros.ativo === "ativo"));
    }
    setFilteredConvenios(filtered);
  }, [filtros, convenios]);

  const stats = {
    total: convenios.length,
    ativos: convenios.filter((c) => c.ativo).length,
    inativos: convenios.filter((c) => !c.ativo).length,
    descontoMedio: convenios.length
      ? convenios.reduce((acc, c) => acc + c.desconto_percentual, 0) / convenios.length
      : 0,
  };

  const buildPayload = (data: any) => ({
    codigo: data.codigo || null,
    name: data.nome || data.name,
    tipo: data.tipo || null,
    cnpj: data.cnpj || null,
    phone: data.telefone || data.phone || null,
    email: data.email || null,
    endereco: data.endereco || null,
    numero: data.numero || null,
    complemento: data.complemento || null,
    bairro: data.bairro || null,
    cidade: data.cidade || null,
    uf: data.uf || null,
    cep: data.cep || null,
    contato_responsavel: data.contato_responsavel || null,
    desconto_percentual: Number(data.desconto_percentual ?? 0),
    ativo: Boolean(data.ativo ?? true),
    observacoes: data.observacoes || null,
  });

  const handleSaveConvenio = async (convenioData: any) => {
    setErrorMsg(null);
    try {
      const payload = buildPayload(convenioData);
      if (editingConvenio) {
        await api.put(`/agreements/${editingConvenio.id}`, payload);
        setSuccessMsg("Convenio atualizado com sucesso!");
      } else {
        await api.post("/agreements", payload);
        setSuccessMsg("Convenio cadastrado com sucesso!");
      }
      setEditingConvenio(null);
      setIsModalOpen(false);
      await fetchConvenios();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? "Erro ao salvar convenio");
    }
  };

  const handleEdit = (convenio: Convenio) => {
    setEditingConvenio(convenio);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este convenio?")) return;
    setErrorMsg(null);
    try {
      await api.delete(`/agreements/${id}`);
      setSuccessMsg("Convenio excluido com sucesso!");
      await fetchConvenios();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? "Erro ao excluir convenio");
    }
  };

  const tipos = ["Plano de Saude", "Plano Odontologico"];

  return (
    <PageWrapper>
      <MainContent>
        <Header>
          <Title>
            <FaHandshake />
            Cadastro de Convenios
          </Title>
          <Actions>
            <StyledButton
              variant="primary"
              onClick={() => { setEditingConvenio(null); setIsModalOpen(true); }}
            >
              <FaPlus /> Novo Convenio
            </StyledButton>
            <StyledButton variant="success" onClick={() => alert("Exportacao Excel em desenvolvimento")}>
              <FaDownload /> Exportar Excel
            </StyledButton>
            <StyledButton variant="info" onClick={() => alert("Exportacao XML em desenvolvimento")}>
              <FaFileExport /> Exportar XML
            </StyledButton>
          </Actions>
        </Header>

        {successMsg && <AlertBox type="success">{successMsg}</AlertBox>}
        {errorMsg && <AlertBox type="error">{errorMsg}</AlertBox>}

        <StatsContainer>
          <StatCard color="linear-gradient(135deg, #2e8b57 0%, #3cb371 100%)">
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Total de Convenios</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #28a745 0%, #20c997 100%)">
            <StatNumber>{stats.ativos}</StatNumber>
            <StatLabel>Convenios Ativos</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #dc3545 0%, #c82333 100%)">
            <StatNumber>{stats.inativos}</StatNumber>
            <StatLabel>Convenios Inativos</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #ffc107 0%, #f39c12 100%)">
            <StatNumber>{stats.descontoMedio.toFixed(1)}%</StatNumber>
            <StatLabel>Desconto Medio</StatLabel>
          </StatCard>
        </StatsContainer>

        <FilterContainer>
          <div>
            <FilterLabel>Buscar:</FilterLabel>
            <FilterInput
              type="text"
              placeholder="Nome ou codigo do convenio..."
              value={filtros.nome}
              onChange={(e) => setFiltros({ ...filtros, nome: e.target.value })}
            />
          </div>
          <div>
            <FilterLabel>Tipo:</FilterLabel>
            <FilterSelect
              value={filtros.tipo}
              onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
            >
              <option value="">Todos os Tipos</option>
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </FilterSelect>
          </div>
          <div>
            <FilterLabel>Status:</FilterLabel>
            <FilterSelect
              value={filtros.ativo}
              onChange={(e) => setFiltros({ ...filtros, ativo: e.target.value })}
            >
              <option value="todos">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </FilterSelect>
          </div>
        </FilterContainer>

        <TableContainer>
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#666" }}>
              Carregando convenios...
            </div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Nome / Contato</th>
                  <th>Tipo</th>
                  <th>CNPJ</th>
                  <th>Cidade/UF</th>
                  <th>Desconto</th>
                  <th>Status</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {filteredConvenios.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", color: "#888", padding: 30 }}>
                      Nenhum convenio encontrado
                    </td>
                  </tr>
                ) : (
                  filteredConvenios.map((convenio) => (
                    <tr key={convenio.id}>
                      <td><strong>{convenio.codigo || "-"}</strong></td>
                      <td>
                        <strong>{convenio.nome}</strong>
                        <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                          {convenio.telefone && (
                            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              <FaPhone size={10} /> {convenio.telefone}
                            </span>
                          )}
                          {convenio.email && (
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                              <FaEnvelope size={10} /> {convenio.email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        {convenio.tipo ? (
                          <TipoBadge tipo={convenio.tipo}>{convenio.tipo}</TipoBadge>
                        ) : "-"}
                      </td>
                      <td>{convenio.cnpj || "-"}</td>
                      <td>
                        {convenio.cidade && convenio.uf
                          ? `${convenio.cidade}/${convenio.uf}`
                          : convenio.cidade || "-"}
                      </td>
                      <td>
                        <strong style={{ color: "#28a745" }}>{convenio.desconto_percentual}%</strong>
                      </td>
                      <td>
                        <StatusBadge ativo={convenio.ativo}>
                          {convenio.ativo ? "Ativo" : "Inativo"}
                        </StatusBadge>
                      </td>
                      <td>
                        <ActionButton variant="edit" onClick={() => handleEdit(convenio)}>
                          <FaEdit /> Editar
                        </ActionButton>
                        <ActionButton variant="delete" onClick={() => handleDelete(convenio.id)}>
                          <FaTrash /> Excluir
                        </ActionButton>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </TableContainer>

        <ModalConvenio
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingConvenio(null); }}
          onSave={handleSaveConvenio}
          convenio={editingConvenio}
        />
      </MainContent>
    </PageWrapper>
  );
}
