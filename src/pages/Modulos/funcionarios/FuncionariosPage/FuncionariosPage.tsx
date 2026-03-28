import React, { useEffect, useState } from "react";
import api from "../../../../components/api/api";
import styled from "styled-components";
import * as XLSX from "xlsx";

// Estilos modernizados
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
  max-height: calc(100vh - 40px);
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const StyledButton = styled.button<{ color?: string; hoverColor?: string }>`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: ${(props) => props.color || "#007bff"};
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.hoverColor || "#0056b3"};
  }
`;

const Table = styled.table`
  width: 100%;
  min-width: 860px;
  border-collapse: collapse;
  margin: 0;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    vertical-align: middle;
    font-size: 14px;
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

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;
  }

  th:last-child,
  td:last-child {
    width: 220px;
    min-width: 220px;
  }
`;

const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
  min-height: 360px;
  max-height: calc(100vh - 280px);
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #ffffff;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
`;

const ActionButton = styled(StyledButton)`
  padding: 5px 9px;
  font-size: 11px;
  font-weight: 500;
  min-width: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  width: 80%;
  max-width: 700px;
  max-height: 80vh;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  gap: 20px;
  border-top: 2px solid #e0e0e0;
  background-color: #f8f9fa;
  width: 100%;
  flex-shrink: 0;
  margin-top: auto;
`;

const PaginationInfo = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #495057;
  margin: 0 25px;
  min-width: 120px;
  text-align: center;
`;

const PaginationButton = styled(StyledButton)`
  min-width: 100px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;

    &:hover {
      background-color: ${(props) => props.color || "#007bff"};
    }
  }
`;

const SuccessMessage = styled.div`
  background: #d1fae5;
  border: 1px solid #10b981;
  color: #065f46;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-weight: 600;
`;

interface Funcionario {
  id: number;
  name: string;
  telefone: string;
  email: string;
  cargo_id: number | null;
  cargo?: { id: number; name?: string; nome?: string } | null;
  data_cadastro: string;
  foto: string | null;
  cep: string | null;
  rua: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  cro: string | null;
  intervalo: number | null;
  comissao: string | null;
  chave_pix: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

interface EditFuncionarioFormProps {
  funcionario: Funcionario;
  onClose: () => void;
  onUpdate: (updatedFuncionario: Funcionario) => Promise<boolean>;
  cargos: { id: number; name: string }[];
}

interface NewFuncionarioFromForm {
  name: string;
  telefone: string;
  email: string;
  cargo_id: number | null;
  data_cadastro: string;
  foto: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cro: string;
  intervalo: number;
  comissao: number;
  chave_pix: string;
  status: boolean;
}

interface AddFuncionarioResult {
  success: boolean;
  errorMessage?: string;
}

const formatDate = (value: string | null | undefined): string => {
  if (!value) return "";
  const trimmed = String(value).trim();
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${day}/${month}/${year}`;
  }
  const brMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (brMatch) return trimmed;
  return trimmed;
};

const estadosOptions = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const normalizeCargosList = (payload: any): { id: number; name: string }[] => {
  const rawList = Array.isArray(payload)
    ? payload
    : payload?.data || payload?.cargos || [];

  return rawList
    .map((cargo: any) => ({
      id: Number(cargo?.id),
      name: String(cargo?.name || cargo?.nome || "").trim(),
    }))
    .filter((cargo: { id: number; name: string }) => Number.isFinite(cargo.id) && cargo.name.length > 0);
};

const EditFuncionarioForm: React.FC<EditFuncionarioFormProps> = ({ funcionario, onClose, onUpdate, cargos }) => {
  const [editedFuncionario, setEditedFuncionario] = useState(funcionario);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = name === "status"
      ? value === "true"
      : type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value;
    setEditedFuncionario({ ...editedFuncionario, [name]: parsedValue });
    if (errors.length > 0) setErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    const newErrors: string[] = [];
    if (!editedFuncionario.name || editedFuncionario.name.trim().length < 2) {
      newErrors.push("Nome deve ter pelo menos 2 caracteres");
    }
    if (!editedFuncionario.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedFuncionario.email)) {
      newErrors.push("Email inválido");
    }
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const updated = await onUpdate(editedFuncionario);
    if (updated) {
      onClose();
    }
  };

  return (
    <div style={{ padding: "0" }}>
      <h2>Editar Funcionário</h2>
      {errors.length > 0 && (
        <div style={{ backgroundColor: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "4px", marginBottom: "20px", border: "1px solid #f5c6cb" }}>
          <strong>Erros encontrados:</strong>
          <ul style={{ margin: "5px 0 0 20px" }}>
            {errors.map((error, index) => (<li key={index}>{error}</li>))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Nome:</label>
            <input type="text" name="name" value={editedFuncionario.name} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Email:</label>
            <input type="email" name="email" value={editedFuncionario.email} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Telefone:</label>
            <input type="text" name="telefone" value={editedFuncionario.telefone} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Cargo:</label>
            <select name="cargo_id" value={editedFuncionario.cargo_id || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}>
              <option value="">Selecionar</option>
              {cargos.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Data Cadastro:</label>
            <input type="date" name="data_cadastro" value={editedFuncionario.data_cadastro} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>CRO:</label>
            <input type="text" name="cro" value={editedFuncionario.cro || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Intervalo (minutos):</label>
            <input type="number" name="intervalo" value={editedFuncionario.intervalo || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Comissão (%):</label>
            <input type="number" step="0.01" name="comissao" value={editedFuncionario.comissao || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Chave PIX:</label>
            <input type="text" name="chave_pix" value={editedFuncionario.chave_pix || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>CEP:</label>
            <input type="text" name="cep" value={editedFuncionario.cep || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 2 }}>
            <label>Rua:</label>
            <input type="text" name="rua" value={editedFuncionario.rua || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
          <div style={{ flex: 0.5 }}>
            <label>Número:</label>
            <input type="text" name="numero" value={editedFuncionario.numero || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Complemento:</label>
            <input type="text" name="complemento" value={editedFuncionario.complemento || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Bairro:</label>
            <input type="text" name="bairro" value={editedFuncionario.bairro || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Cidade:</label>
            <input type="text" name="cidade" value={editedFuncionario.cidade || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
          <div style={{ flex: 0.5 }}>
            <label>Estado:</label>
            <select name="estado" value={editedFuncionario.estado || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}>
              <option value="">-</option>
              {estadosOptions.map(e => (<option key={e} value={e}>{e}</option>))}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input type="radio" name="status" value="true" checked={editedFuncionario.status === true} onChange={handleChange} />
            Ativo
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input type="radio" name="status" value="false" checked={editedFuncionario.status === false} onChange={handleChange} />
            Inativo
          </label>
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Salvar</button>
          <button type="button" onClick={onClose} style={{ padding: "10px 20px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

const ViewFuncionarioModal: React.FC<{ funcionario: Funcionario; onClose: () => void }> = ({ funcionario, onClose }) => {
  return (
    <div>
      <h2>Dados do Funcionário</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px" }}>
        <div><strong>Nome:</strong> {funcionario.name}</div>
        <div><strong>Email:</strong> {funcionario.email}</div>
        <div><strong>Telefone:</strong> {funcionario.telefone}</div>
        <div><strong>Cargo:</strong> {funcionario.cargo?.name || funcionario.cargo?.nome || "-"}</div>
        <div><strong>Data Cadastro:</strong> {formatDate(funcionario.data_cadastro)}</div>
        <div><strong>CRO:</strong> {funcionario.cro || "-"}</div>
        <div><strong>Intervalo:</strong> {funcionario.intervalo ? `${funcionario.intervalo} min` : "-"}</div>
        <div><strong>Comissão:</strong> {funcionario.comissao ? `${funcionario.comissao}%` : "-"}</div>
        <div><strong>Chave PIX:</strong> {funcionario.chave_pix || "-"}</div>
        <div><strong>Status:</strong> {funcionario.status ? "✓ Ativo" : "✗ Inativo"}</div>
        <div><strong>Endereço:</strong> {funcionario.rua}, {funcionario.numero} {funcionario.complemento ? `- ${funcionario.complemento}` : ""}, {funcionario.bairro} - {funcionario.cidade}/{funcionario.estado}</div>
      </div>
      <button onClick={onClose} style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Fechar</button>
    </div>
  );
};

const AddFuncionarioForm: React.FC<{ onClose: () => void; onAdd: (funcionario: NewFuncionarioFromForm) => Promise<AddFuncionarioResult>; cargos: { id: number; name: string }[] }> = ({ onClose, onAdd, cargos }) => {
  const [form, setForm] = useState<NewFuncionarioFromForm>({
    name: "",
    telefone: "",
    email: "",
    cargo_id: null,
    data_cadastro: new Date().toISOString().split("T")[0],
    foto: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cro: "",
    intervalo: 30,
    comissao: 0,
    chave_pix: "",
    status: true,
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = name === "status"
      ? value === "true"
      : type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value === "" && ["intervalo", "comissao", "cargo_id"].includes(name)
          ? null
          : value;
    setForm({ ...form, [name]: parsedValue });
    if (errors.length > 0) setErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    const newErrors: string[] = [];
    if (!form.name || form.name.trim().length < 2) newErrors.push("Nome deve ter pelo menos 2 caracteres");
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.push("Email inválido");
    if (!form.telefone) newErrors.push("Telefone é obrigatório");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await onAdd(form);
    if (result.success) {
      onClose();
    } else {
      setErrors([result.errorMessage || "Erro ao adicionar funcionário"]);
    }
  };

  return (
    <div style={{ padding: "0" }}>
      <h2>Adicionar Funcionário</h2>
      {errors.length > 0 && (
        <div style={{ backgroundColor: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "4px", marginBottom: "20px", border: "1px solid #f5c6cb" }}>
          <strong>Erros encontrados:</strong>
          <ul style={{ margin: "5px 0 0 20px" }}>
            {errors.map((e, i) => (<li key={i}>{e}</li>))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Nome: *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} required />
          </div>
          <div style={{ flex: 1 }}>
            <label>Email: *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} required />
          </div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Telefone: *</label>
            <input type="text" name="telefone" value={form.telefone} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} required />
          </div>
          <div style={{ flex: 1 }}>
            <label>Cargo:</label>
            <select name="cargo_id" value={form.cargo_id || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}>
              <option value="">Selecionar</option>
              {cargos.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Data Cadastro:</label>
            <input type="date" name="data_cadastro" value={form.data_cadastro} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>CRO:</label>
            <input type="text" name="cro" value={form.cro} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Intervalo (minutos):</label>
            <input type="number" name="intervalo" value={form.intervalo} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Comissão (%):</label>
            <input type="number" step="0.01" name="comissao" value={form.comissao} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Chave PIX:</label>
            <input type="text" name="chave_pix" value={form.chave_pix} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>CEP:</label>
            <input type="text" name="cep" value={form.cep} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 2 }}>
            <label>Rua:</label>
            <input type="text" name="rua" value={form.rua} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
          <div style={{ flex: 0.5 }}>
            <label>Número:</label>
            <input type="text" name="numero" value={form.numero} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Complemento:</label>
            <input type="text" name="complemento" value={form.complemento} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Bairro:</label>
            <input type="text" name="bairro" value={form.bairro} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Cidade:</label>
            <input type="text" name="cidade" value={form.cidade} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
          <div style={{ flex: 0.5 }}>
            <label>Estado:</label>
            <select name="estado" value={form.estado} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}>
              <option value="">-</option>
              {estadosOptions.map(e => (<option key={e} value={e}>{e}</option>))}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input type="radio" name="status" value="true" checked={form.status === true} onChange={handleChange} />
            Ativo
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input type="radio" name="status" value="false" checked={form.status === false} onChange={handleChange} />
            Inativo
          </label>
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Adicionar</button>
          <button type="button" onClick={onClose} style={{ padding: "10px 20px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

const FuncionariosPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [funcionarioToEdit, setFuncionarioToEdit] = useState<Funcionario | null>(null);
  const [funcionarioToView, setFuncionarioToView] = useState<Funcionario | null>(null);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cargos, setCargos] = useState<{ id: number; name: string }[]>([]);
  const itemsPerPage = 10;
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState("");

  const fetchFuncionarios = async (): Promise<Funcionario[]> => {
    try {
      const response = await api.get("/pessoas/funcionarios", { headers: { Accept: "application/json" } });
      const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
      const normalizedFuncionarios = data
        .map((funcionario: Funcionario) => ({
          ...funcionario,
          cargo: funcionario?.cargo
            ? {
                ...funcionario.cargo,
                name: funcionario.cargo.name || funcionario.cargo.nome,
              }
            : null,
        }))
        .sort((a: Funcionario, b: Funcionario) => a.id - b.id);
      setFuncionarios(normalizedFuncionarios);
      return normalizedFuncionarios;
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      return [];
    }
  };

  const fetchCargos = async () => {
    try {
      const response = await api.get("/pessoas/funcionarios/reference/cargos", { headers: { Accept: "application/json" } });
      setCargos(normalizeCargosList(response.data));
    } catch (error) {
      console.error("Erro ao buscar cargos:", error);
    }
  };

  useEffect(() => {
    fetchFuncionarios();
    fetchCargos();
  }, []);

  useEffect(() => {
    if (!registerSuccessMessage) return;
    const timer = setTimeout(() => setRegisterSuccessMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [registerSuccessMessage]);

  const paginatedFuncionarios = funcionarios.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddFuncionario = async (newFuncionario: NewFuncionarioFromForm): Promise<AddFuncionarioResult> => {
    try {
      const payload = {
        name: newFuncionario.name,
        telefone: (newFuncionario.telefone || "").replace(/\D/g, ""),
        email: newFuncionario.email,
        cargo_id: newFuncionario.cargo_id,
        data_cadastro: newFuncionario.data_cadastro,
        foto: newFuncionario.foto || null,
        cep: (newFuncionario.cep || "").replace(/\D/g, ""),
        rua: newFuncionario.rua,
        numero: newFuncionario.numero,
        complemento: newFuncionario.complemento || null,
        bairro: newFuncionario.bairro,
        cidade: newFuncionario.cidade,
        estado: newFuncionario.estado,
        cro: newFuncionario.cro || null,
        intervalo: newFuncionario.intervalo,
        comissao: newFuncionario.comissao,
        chave_pix: newFuncionario.chave_pix || null,
        status: newFuncionario.status,
      };
      await api.post("/pessoas/funcionarios", payload, { headers: { Accept: "application/json" } });
      const updated = await fetchFuncionarios();
      setCurrentPage(Math.max(1, Math.ceil(updated.length / itemsPerPage)));
      setRegisterSuccessMessage("Funcionário Cadastrado com Sucesso!!!");
      setIsModalOpen(false);
      return { success: true };
    } catch (error: any) {
      const message = error?.response?.data?.message || "Erro ao adicionar funcionário";
      setRegisterSuccessMessage(message);
      return { success: false, errorMessage: message };
    }
  };

  const handleUpdateFuncionario = async (updatedFuncionario: Funcionario): Promise<boolean> => {
    try {
      const payload = {
        name: updatedFuncionario.name,
        telefone: (updatedFuncionario.telefone || "").replace(/\D/g, ""),
        email: updatedFuncionario.email,
        cargo_id: updatedFuncionario.cargo_id,
        data_cadastro: updatedFuncionario.data_cadastro,
        foto: updatedFuncionario.foto || null,
        cep: (updatedFuncionario.cep || "").replace(/\D/g, ""),
        rua: updatedFuncionario.rua,
        numero: updatedFuncionario.numero,
        complemento: updatedFuncionario.complemento || null,
        bairro: updatedFuncionario.bairro,
        cidade: updatedFuncionario.cidade,
        estado: updatedFuncionario.estado,
        cro: updatedFuncionario.cro || null,
        intervalo: updatedFuncionario.intervalo,
        comissao: updatedFuncionario.comissao,
        chave_pix: updatedFuncionario.chave_pix || null,
        status: updatedFuncionario.status,
      };

      const response = await api.put(`/pessoas/funcionarios/${updatedFuncionario.id}`, payload, {
        headers: { Accept: "application/json" },
      });

      const persistedFuncionario = response?.data?.data || response?.data || updatedFuncionario;

      // Atualiza imediatamente a tabela com o retorno da API.
      setFuncionarios((prev) => {
        const merged = prev.map((funcionario) =>
          funcionario.id === updatedFuncionario.id
            ? { ...funcionario, ...persistedFuncionario }
            : funcionario
        );
        return merged.sort((a, b) => a.id - b.id);
      });

      try {
        const refreshed = await fetchFuncionarios();
        setCurrentPage((prev) => {
          const totalPages = Math.max(1, Math.ceil(refreshed.length / itemsPerPage));
          return Math.min(prev, totalPages);
        });
      } catch (refreshError) {
        console.warn("Funcionário atualizado, mas a recarga da lista falhou:", refreshError);
      }

      setRegisterSuccessMessage("Funcionário atualizado com sucesso!");
      return true;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Erro ao atualizar funcionário";
      setRegisterSuccessMessage(message);
      return false;
    }
  };

  const handleDeleteFuncionario = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      await api.delete(`/pessoas/funcionarios/${id}`, { headers: { Accept: "application/json" } });

      const refreshed = await fetchFuncionarios();
      setCurrentPage((prev) => {
        const totalPages = Math.max(1, Math.ceil(refreshed.length / itemsPerPage));
        return Math.min(prev, totalPages);
      });

      if (funcionarioToView?.id === id) {
        setIsViewModalOpen(false);
        setFuncionarioToView(null);
      }

      if (funcionarioToEdit?.id === id) {
        setIsEditModalOpen(false);
        setFuncionarioToEdit(null);
      }

      setRegisterSuccessMessage("Funcionário excluído com sucesso!");
    } catch (error: any) {
      const message = error?.response?.data?.message || "Erro ao excluir funcionário";
      setRegisterSuccessMessage(message);
    }
  };

  const handleExportExcel = () => {
    if (funcionarios.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(funcionarios);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Funcionários");
      XLSX.writeFile(workbook, "Funcionários.xlsx");
    }
  };

  return (
    <PageWrapper>
      <MainContent>
        <Header>
          <Title>Lista de Funcionários</Title>
          <Actions>
            <StyledButton color="#007bff" hoverColor="#0056b3" onClick={() => setIsModalOpen(true)}>
              ➕ Adicionar Funcionário
            </StyledButton>
            <StyledButton color="#28a745" hoverColor="#218838" onClick={handleExportExcel}>
              📊 Exportar Excel
            </StyledButton>
          </Actions>
        </Header>

        {registerSuccessMessage && <SuccessMessage>{registerSuccessMessage}</SuccessMessage>}

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Cargo</th>
                <th>Status</th>
                <th>Data Cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFuncionarios.map((funcionario) => (
                <tr key={funcionario.id}>
                  <td>{funcionario.id}</td>
                  <td>{funcionario.name}</td>
                  <td>{funcionario.email}</td>
                  <td>{funcionario.telefone}</td>
                  <td>{funcionario.cargo?.name || funcionario.cargo?.nome || "-"}</td>
                  <td>{funcionario.status ? "✓ Ativo" : "✗ Inativo"}</td>
                  <td>{formatDate(funcionario.data_cadastro)}</td>
                  <td>
                    <ActionButtonsContainer>
                      <ActionButton color="#17a2b8" hoverColor="#138496" onClick={() => { setFuncionarioToView(funcionario); setIsViewModalOpen(true); }}>👁️ Ver</ActionButton>
                      <ActionButton color="#ffc107" hoverColor="#e0a800" onClick={() => { setFuncionarioToEdit(funcionario); setIsEditModalOpen(true); }}>✏️ Editar</ActionButton>
                      <ActionButton color="#dc3545" hoverColor="#c82333" onClick={() => handleDeleteFuncionario(funcionario.id)}>🗑️ Excluir</ActionButton>
                    </ActionButtonsContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>

        <PaginationContainer>
          <PaginationButton onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} color="#6c757d" hoverColor="#5a6268">← Anterior</PaginationButton>
          <PaginationInfo>{`Página ${currentPage} de ${Math.ceil(funcionarios.length / itemsPerPage) || 1}`}</PaginationInfo>
          <PaginationButton onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage * itemsPerPage >= funcionarios.length} color="#6c757d" hoverColor="#5a6268">Próxima →</PaginationButton>
        </PaginationContainer>

        {isModalOpen && (
          <>
            <ModalOverlay onClick={() => setIsModalOpen(false)} />
            <ModalContent>
              <AddFuncionarioForm onClose={() => setIsModalOpen(false)} onAdd={handleAddFuncionario} cargos={cargos} />
            </ModalContent>
          </>
        )}
        {isEditModalOpen && funcionarioToEdit && (
          <>
            <ModalOverlay onClick={() => setIsEditModalOpen(false)} />
            <ModalContent>
              <EditFuncionarioForm funcionario={funcionarioToEdit} onClose={() => setIsEditModalOpen(false)} onUpdate={handleUpdateFuncionario} cargos={cargos} />
            </ModalContent>
          </>
        )}
        {isViewModalOpen && funcionarioToView && (
          <>
            <ModalOverlay onClick={() => setIsViewModalOpen(false)} />
            <ModalContent>
              <ViewFuncionarioModal funcionario={funcionarioToView} onClose={() => setIsViewModalOpen(false)} />
            </ModalContent>
          </>
        )}
      </MainContent>
    </PageWrapper>
  );
};

export default FuncionariosPage;
