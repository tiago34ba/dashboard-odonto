import React, { useState } from "react";
import AcessosList from "./components/AcessosList";
import AcessosForm from "./components/AcessosForm";
import Modal from "../../Usuarios/UsersPage/Modal";
import api from "../../../../components/api/api";

const AcessosPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingAcesso, setEditingAcesso] = useState<any>(null);
  const [viewingAcesso, setViewingAcesso] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleEdit = (acesso: any) => {
    setViewingAcesso(null);
    setEditingAcesso(acesso);
    setShowModal(true);
  };

  const handleCreate = () => {
    setViewingAcesso(null);
    setEditingAcesso(null);
    setShowModal(true);
  };

  const handleView = (acesso: any) => {
    setEditingAcesso(null);
    setViewingAcesso(acesso);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja excluir este acesso?")) return;

    try {
      await api.delete(`/acessos/${id}`);
      setFeedback("Acesso excluido com sucesso.");
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Nao foi possivel excluir o acesso.";
      setFeedback(msg);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAcesso(null);
    setViewingAcesso(null);
  };

  const handleSave = (_acessoData: any) => {
    setFeedback("Acesso salvo com sucesso.");
    setRefreshKey((prev) => prev + 1);
    setShowModal(false);
    setEditingAcesso(null);
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
          ➕ Novo Acesso
        </button>
      </div>
      {/* Lista de acessos */}
      <AcessosList
        onEdit={handleEdit}
        onCreate={handleCreate}
        onView={handleView}
        onDelete={handleDelete}
        refreshKey={refreshKey}
      />
      {/* Modal do formulário */}
      <Modal isOpen={showModal} onClose={handleCloseModal}>
        {viewingAcesso ? (
          <div className="p-4 space-y-2 text-sm">
            <h3 className="text-lg font-semibold">Detalhes do Acesso</h3>
            <p><strong>Nome:</strong> {viewingAcesso.nome}</p>
            <p><strong>Código:</strong> {viewingAcesso.codigo}</p>
            <p><strong>Categoria:</strong> {viewingAcesso.categoria}</p>
            <p><strong>Nível de Risco:</strong> {viewingAcesso.nivel_risco}</p>
            <p><strong>Status:</strong> {viewingAcesso.ativo ? "Ativo" : "Inativo"}</p>
            <p><strong>Descrição:</strong> {viewingAcesso.descricao || "-"}</p>
          </div>
        ) : (
          <AcessosForm acesso={editingAcesso} onSave={handleSave} onCancel={handleCloseModal} />
        )}
      </Modal>
    </div>
  );
};

export default AcessosPage;