import React, { useState } from "react";
import AcessosList from "./components/AcessosList";
import AcessosForm from "./components/AcessosForm";
import Modal from "../../Usuarios/UsersPage/Modal";

const AcessosPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingAcesso, setEditingAcesso] = useState<any>(null);

  const handleEdit = (acesso: any) => {
    setEditingAcesso(acesso);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingAcesso(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAcesso(null);
  };

  const handleSave = (acessoData: any) => {
    // Implementar lógica de salvamento
    console.log('Salvando acesso:', acessoData);
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <button 
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          ➕ Novo Acesso
        </button>
      </div>
      {/* Lista de acessos */}
      <AcessosList onEdit={handleEdit} onCreate={handleCreate} />
      {/* Modal do formulário */}
      <Modal isOpen={showModal} onClose={handleCloseModal}>
        <AcessosForm acesso={editingAcesso} onSave={handleSave} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default AcessosPage;