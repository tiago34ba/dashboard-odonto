import React, { useState } from "react";
import GrupoAcessosList from "./components/GrupoAcessosList";
import GrupoAcessosForm from "./components/GrupoAcessosForm";
import Modal from "../../Usuarios/UsersPage/Modal";
import api from "../../../../components/api/api";

const GrupoAcessosPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState<any>(null);
  const [viewingGrupo, setViewingGrupo] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleEdit = (grupo: any) => {
    setViewingGrupo(null);
    setEditingGrupo(grupo);
    setShowModal(true);
  };

  const handleCreate = () => {
    setViewingGrupo(null);
    setEditingGrupo(null);
    setShowModal(true);
  };

  const handleView = (grupo: any) => {
    setEditingGrupo(null);
    setViewingGrupo(grupo);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja excluir este grupo de acesso?")) return;

    try {
      await api.delete(`/grupos-acesso/${id}`);
      setFeedback("Grupo excluido com sucesso.");
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Nao foi possivel excluir o grupo.";
      setFeedback(msg);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGrupo(null);
    setViewingGrupo(null);
  };

  const handleSave = (_grupoData: any) => {
    setFeedback("Grupo salvo com sucesso.");
    setRefreshKey((prev) => prev + 1);
    setShowModal(false);
    setEditingGrupo(null);
  };

  return (
    <div className="p-6">
      {feedback && (
        <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-blue-800">
          {feedback}
        </div>
      )}

      <div className="mb-4">
        <button 
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          ➕ Novo Grupo
        </button>
      </div>
      {/* Lista de grupos de acesso */}
      <GrupoAcessosList
        onEdit={handleEdit}
        onCreate={handleCreate}
        onView={handleView}
        onDelete={handleDelete}
        refreshKey={refreshKey}
      />
      {/* Modal do formulário */}
      <Modal isOpen={showModal} onClose={handleCloseModal}>
        {viewingGrupo ? (
          <div className="p-4 space-y-2 text-sm">
            <h3 className="text-lg font-semibold">Detalhes do Grupo de Acesso</h3>
            <p><strong>Nome:</strong> {viewingGrupo.nome}</p>
            <p><strong>Descrição:</strong> {viewingGrupo.descricao || "-"}</p>
            <p><strong>Usuários:</strong> {viewingGrupo.usuarios}</p>
            <p><strong>Status:</strong> {viewingGrupo.ativo ? "Ativo" : "Inativo"}</p>
            <p><strong>Permissões:</strong> {(viewingGrupo.permissoes || []).join(", ") || "-"}</p>
          </div>
        ) : (
          <GrupoAcessosForm grupo={editingGrupo} onSave={handleSave} onCancel={handleCloseModal} />
        )}
      </Modal>
    </div>
  );
};

export default GrupoAcessosPage;