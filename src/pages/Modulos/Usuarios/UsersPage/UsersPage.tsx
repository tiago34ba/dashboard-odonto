import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import * as XLSX from "xlsx";
import api from "../../../../components/api/api";

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

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
`;

const ActionButton = styled.button<{ variant: "dados" | "editar" | "excluir" }>`
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  min-width: 4rem;
  color: white;

  ${({ variant }) => {
    switch (variant) {
      case "dados":
        return `
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);

          &:hover {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
          }
        `;
      case "editar":
        return `
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          box-shadow: 0 2px 4px rgba(5, 150, 105, 0.3);

          &:hover {
            background: linear-gradient(135deg, #047857 0%, #065f46 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(5, 150, 105, 0.4);
          }
        `;
      case "excluir":
      default:
        return `
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3);

          &:hover {
            background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(220, 38, 38, 0.4);
          }
        `;
    }
  }}
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th,
  td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 960px;
  max-height: 95vh;
  min-height: 560px;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  padding: 28px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
`;

const ModalBody = styled.div`
  padding: 32px;
  flex: 1;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px 22px;
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.92rem;
`;

const FormInput = styled.input`
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
`;

const FormSelect = styled.select`
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
`;

const ModalFooter = styled.div`
  background: #f9fafb;
  padding: 24px 32px;
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  border-top: 1px solid #e5e7eb;
`;

const ModalButton = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 12px 26px;
  border-radius: 12px;
  font-weight: 700;
  border: 2px solid transparent;
  cursor: pointer;
  min-width: 140px;

  ${(props) =>
    props.variant === "primary"
      ? `background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); color: #fff;`
      : `background: #fff; color: #6b7280; border-color: #e5e7eb;`}
`;

const Message = styled.div<{ type: "success" | "error" }>`
  margin-bottom: 14px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.type === "success" ? "#10b981" : "#ef4444")};
  background: ${(p) => (p.type === "success" ? "#ecfdf5" : "#fef2f2")};
  color: ${(p) => (p.type === "success" ? "#065f46" : "#991b1b")};
`;

interface UserRow {
  id: number;
  name: string;
  nome: string;
  sobrenome: string;
  username: string;
  email: string;
  telefone: string;
  ativo: boolean;
  grupo_acesso_id: number | null;
  grupo_acesso_nome: string;
  nivel?: string;
}

interface FormUser {
  id?: number;
  nome: string;
  sobrenome: string;
  username: string;
  email: string;
  telefone: string;
  nivel: string;
  password: string;
  ativo: boolean;
}

const emptyForm: FormUser = {
  nome: "",
  sobrenome: "",
  username: "",
  email: "",
  telefone: "",
  nivel: "",
  password: "",
  ativo: true,
};

const niveisAcesso = ["Secretaria", "Auxiliar Dentista", "Dentista", "Paciente", "Financeiro", "Faxineiro", "Administrador"];

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [form, setForm] = useState<FormUser>(emptyForm);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const isEditMode = Boolean(form.id);

  const mapUser = (raw: any): UserRow => ({
    id: Number(raw.id),
    name: String(raw.name || ""),
    nome: String(raw.nome || raw.name || ""),
    sobrenome: String(raw.sobrenome || ""),
    username: String(raw.username || ""),
    email: String(raw.email || ""),
    telefone: String(raw.telefone || ""),
    ativo: Boolean(raw.ativo),
    grupo_acesso_id: raw.grupo_acesso_id ? Number(raw.grupo_acesso_id) : null,
    grupo_acesso_nome: String(raw.grupo_acesso?.nome || "Sem grupo"),
    nivel: String(raw.grupo_acesso?.nome || raw.nivel || ""),
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/pessoas/usuarios", { params: { per_page: 100 } });
      const list = Array.isArray(response?.data?.data) ? response.data.data : [];
      setUsers(list.map(mapUser));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao carregar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const rowsForExport = useMemo(() => {
    return users.map((u) => ({
      id: u.id,
      nome: `${u.nome} ${u.sobrenome}`.trim(),
      username: u.username,
      email: u.email,
      telefone: u.telefone,
      grupo_acesso: u.grupo_acesso_nome,
      ativo: u.ativo ? "Ativo" : "Inativo",
    }));
  }, [users]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.nome || !form.email || !form.nivel || (!isEditMode && !form.password)) {
      setError("Preencha os campos obrigatorios");
      return;
    }

    try {
      const payload = {
        nome: form.nome,
        sobrenome: form.sobrenome,
        username: form.username || undefined,
        email: form.email,
        telefone: form.telefone || undefined,
        password: form.password || undefined,
        nivel: form.nivel,
        ativo: form.ativo,
      };

      if (isEditMode && form.id) {
        await api.put(`/pessoas/usuarios/${form.id}`, payload);
        setMessage("Usuario atualizado com sucesso");
      } else {
        await api.post("/pessoas/usuarios", payload);
        setMessage("Usuario cadastrado com sucesso");
      }

      setForm(emptyForm);
      setIsModalOpen(false);
      await fetchUsers();
    } catch (err: any) {
      const validation = err?.response?.data?.errors;
      const validationMessage = validation ? Object.values(validation).flat().join(" | ") : "";
      setError(validationMessage || err?.response?.data?.message || "Erro ao salvar usuario");
    }
  };

  const handleView = async (id: number) => {
    try {
      setError("");
      const response = await api.get(`/pessoas/usuarios/${id}`);
      const userData = response?.data?.data;

      if (!userData) {
        setError("Usuario nao encontrado");
        return;
      }

      setSelectedUser(mapUser(userData));
      setIsDetailsOpen(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao carregar dados do usuario");
    }
  };

  const handleEdit = async (id: number) => {
    try {
      setError("");
      const response = await api.get(`/pessoas/usuarios/${id}`);
      const userData = response?.data?.data;

      if (!userData) {
        setError("Usuario nao encontrado");
        return;
      }

      const mapped = mapUser(userData);
      setForm({
        id: mapped.id,
        nome: mapped.nome,
        sobrenome: mapped.sobrenome,
        username: mapped.username,
        email: mapped.email,
        telefone: mapped.telefone,
        nivel: mapped.nivel || mapped.grupo_acesso_nome,
        password: "",
        ativo: mapped.ativo,
      });
      setIsModalOpen(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao carregar usuario para edicao");
    }
  };

  const handleDelete = async (id: number, nome: string) => {
    const confirmed = window.confirm(`Deseja excluir o usuario ${nome}?`);
    if (!confirmed) return;

    try {
      setError("");
      await api.delete(`/pessoas/usuarios/${id}`);
      setMessage("Usuario excluido com sucesso");
      await fetchUsers();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao excluir usuario");
    }
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rowsForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
    XLSX.writeFile(workbook, "usuarios.xlsx");
  };

  const handleExportToXML = () => {
    const xmlData = rowsForExport
      .map((u) => {
        return `\n<Usuario>\n  <Id>${u.id}</Id>\n  <Nome>${u.nome}</Nome>\n  <Username>${u.username}</Username>\n  <Email>${u.email}</Email>\n  <Telefone>${u.telefone}</Telefone>\n  <GrupoAcesso>${u.grupo_acesso}</GrupoAcesso>\n  <Ativo>${u.ativo}</Ativo>\n</Usuario>`;
      })
      .join("\n");

    const xmlFile = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Usuarios>${xmlData}\n</Usuarios>`;
    const blob = new Blob([xmlFile.trim()], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "usuarios.xml";
    link.click();
  };

  const openCreateModal = () => {
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  return (
    <PageWrapper>
      <MainContent>
        <Header>
          <Title>Usuarios Cadastrados</Title>
          <Actions>
            <StyledButton color="#007bff" hoverColor="#0056b3" onClick={openCreateModal}>
              Cadastrar Usuario
            </StyledButton>
            <StyledButton color="#28a745" hoverColor="#218838" onClick={handleExportToExcel}>
              Exportar para Excel
            </StyledButton>
            <StyledButton color="#17a2b8" hoverColor="#138496" onClick={handleExportToXML}>
              Exportar para XML
            </StyledButton>
          </Actions>
        </Header>

        {message && <Message type="success">{message}</Message>}
        {error && <Message type="error">{error}</Message>}

        <Table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Username</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Grupo de Acesso</th>
              <th>Status</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>Carregando...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7}>Nenhum usuario cadastrado</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{`${u.nome} ${u.sobrenome}`.trim() || u.name}</td>
                  <td>{u.username || "-"}</td>
                  <td>{u.email}</td>
                  <td>{u.telefone || "-"}</td>
                  <td>{u.grupo_acesso_nome}</td>
                  <td>{u.ativo ? "Ativo" : "Inativo"}</td>
                  <td>
                    <ActionButtons>
                      <ActionButton type="button" variant="dados" onClick={() => handleView(u.id)}>
                        Dados
                      </ActionButton>
                      <ActionButton type="button" variant="editar" onClick={() => handleEdit(u.id)}>
                        Editar
                      </ActionButton>
                      <ActionButton type="button" variant="excluir" onClick={() => handleDelete(u.id, u.nome || u.name)}>
                        Excluir
                      </ActionButton>
                    </ActionButtons>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {isModalOpen && (
          <ModalOverlay onClick={() => setIsModalOpen(false)}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <h3>{isEditMode ? "Editar Usuario" : "Cadastrar Usuario"}</h3>
                <CloseButton type="button" onClick={() => setIsModalOpen(false)}>
                  x
                </CloseButton>
              </ModalHeader>

              <ModalForm onSubmit={handleSubmit}>
                <ModalBody>
                  <FormGrid>
                    <FormGroup>
                      <Label htmlFor="nome">Nome *</Label>
                      <FormInput id="nome" type="text" name="nome" value={form.nome} onChange={handleChange} required />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="sobrenome">Sobrenome</Label>
                      <FormInput id="sobrenome" type="text" name="sobrenome" value={form.sobrenome} onChange={handleChange} />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="username">Username</Label>
                      <FormInput id="username" type="text" name="username" value={form.username} onChange={handleChange} />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="email">Email *</Label>
                      <FormInput id="email" type="email" name="email" value={form.email} onChange={handleChange} required />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="telefone">Telefone</Label>
                      <FormInput id="telefone" type="tel" name="telefone" value={form.telefone} onChange={handleChange} />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="nivel">Nivel *</Label>
                      <FormSelect id="nivel" name="nivel" value={form.nivel} onChange={handleChange} required>
                        <option value="">Selecione</option>
                        {niveisAcesso.map((nivel) => (
                          <option key={nivel} value={nivel}>
                            {nivel}
                          </option>
                        ))}
                      </FormSelect>
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="password">{isEditMode ? "Senha (opcional)" : "Senha *"}</Label>
                      <FormInput
                        id="password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required={!isEditMode}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="ativo">Ativo</Label>
                      <input id="ativo" type="checkbox" name="ativo" checked={form.ativo} onChange={handleChange} />
                    </FormGroup>
                  </FormGrid>
                </ModalBody>

                <ModalFooter>
                  <ModalButton type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </ModalButton>
                  <ModalButton type="submit" variant="primary">
                    {isEditMode ? "Salvar Alteracoes" : "Cadastrar"}
                  </ModalButton>
                </ModalFooter>
              </ModalForm>
            </ModalContainer>
          </ModalOverlay>
        )}

        {isDetailsOpen && selectedUser && (
          <ModalOverlay onClick={() => setIsDetailsOpen(false)}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <h3>Dados do Usuario</h3>
                <CloseButton type="button" onClick={() => setIsDetailsOpen(false)}>
                  x
                </CloseButton>
              </ModalHeader>
              <ModalBody>
                <FormGrid>
                  <FormGroup>
                    <Label>Nome</Label>
                    <FormInput value={`${selectedUser.nome} ${selectedUser.sobrenome}`.trim() || selectedUser.name} readOnly />
                  </FormGroup>
                  <FormGroup>
                    <Label>Username</Label>
                    <FormInput value={selectedUser.username || "-"} readOnly />
                  </FormGroup>
                  <FormGroup>
                    <Label>Email</Label>
                    <FormInput value={selectedUser.email} readOnly />
                  </FormGroup>
                  <FormGroup>
                    <Label>Telefone</Label>
                    <FormInput value={selectedUser.telefone || "-"} readOnly />
                  </FormGroup>
                  <FormGroup>
                    <Label>Grupo de Acesso</Label>
                    <FormInput value={selectedUser.grupo_acesso_nome} readOnly />
                  </FormGroup>
                  <FormGroup>
                    <Label>Status</Label>
                    <FormInput value={selectedUser.ativo ? "Ativo" : "Inativo"} readOnly />
                  </FormGroup>
                </FormGrid>
              </ModalBody>
              <ModalFooter>
                <ModalButton type="button" variant="secondary" onClick={() => setIsDetailsOpen(false)}>
                  Fechar
                </ModalButton>
              </ModalFooter>
            </ModalContainer>
          </ModalOverlay>
        )}
      </MainContent>
    </PageWrapper>
  );
};

export default UsersPage;