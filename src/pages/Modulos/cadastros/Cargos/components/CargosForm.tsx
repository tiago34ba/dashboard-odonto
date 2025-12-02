import React, { useState, useEffect } from "react";

interface CargosFormProps {
  cargo?: any;
  onSave?: (cargoData: any) => void;
  onCancel?: () => void;
}

const CargosForm: React.FC<CargosFormProps> = ({ cargo, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    nivel_acesso: "baixo",
    ativo: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Popula o formulário quando um cargo é passado para edição
  useEffect(() => {
    if (cargo) {
      setFormData({
        nome: cargo.nome || "",
        descricao: cargo.descricao || "",
        nivel_acesso: cargo.nivel_acesso || "baixo",
        ativo: cargo.ativo !== undefined ? cargo.ativo : true,
      });
    }
  }, [cargo]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Se há uma função onSave (modo de edição), usa ela
      if (onSave) {
        onSave(formData);
        return;
      }

      // Caso contrário, faz a requisição normal para a API
      const response = await fetch("/api/cargos", {
        method: cargo ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar cargo");
      }

      const result = await response.json();
      alert(`Cargo ${cargo ? 'atualizado' : 'cadastrado'} com sucesso!`);
      console.log("Resposta da API:", result);

      // Limpa o formulário após o envio (apenas no modo criação)
      if (!cargo) {
        setFormData({
          nome: "",
          descricao: "",
          nivel_acesso: "baixo",
          ativo: true,
        });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido");
      console.error("Erro ao cadastrar cargo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-cargo-content">
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-3 rounded">
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}
      <label htmlFor="nome">Nome do Cargo</label>
      <input
        type="text"
        id="nome"
        name="nome"
        value={formData.nome}
        onChange={handleChange}
        required
        placeholder="Ex: Cirurgião-Dentista"
      />
      <label htmlFor="descricao">Descrição</label>
      <textarea
        id="descricao"
        name="descricao"
        value={formData.descricao}
        onChange={handleChange}
        rows={3}
        required
        placeholder="Descreva as responsabilidades do cargo"
      />
      <label htmlFor="nivel_acesso">Nível de Acesso</label>
      <select
        id="nivel_acesso"
        name="nivel_acesso"
        value={formData.nivel_acesso}
        onChange={handleChange}
        required
      >
        <option value="baixo">Baixo</option>
        <option value="medio">Médio</option>
        <option value="alto">Alto</option>
        <option value="admin">Administrador</option>
      </select>
      <label htmlFor="ativo">Status</label>
      <select
        id="ativo"
        name="ativo"
        value={formData.ativo ? "true" : "false"}
        onChange={e => setFormData({ ...formData, ativo: e.target.value === "true" })}
      >
        <option value="true">Ativo</option>
        <option value="false">Inativo</option>
      </select>
      {cargo && (
        <>
          <label>Data de Criação</label>
          <input
            type="text"
            value={new Date(cargo.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
            readOnly
            className="bg-gray-100 cursor-not-allowed"
          />
        </>
      )}
      <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ flex: 1, background: "#e5e7eb", color: "#232323" }}>
            Cancelar
          </button>
        )}
        <button type="submit" disabled={loading} style={{ flex: 1 }}>
          {loading ? "Processando..." : cargo ? "Atualizar Cargo" : "Cadastrar Cargo"}
        </button>
      </div>
    </form>
  );
};

export default CargosForm;