import React, { useState } from "react";
import GrupoAcessosList from "./components/GrupoAcessosList";
import GrupoAcessosForm from "./components/GrupoAcessosForm";
import Modal from "../../Usuarios/UsersPage/Modal";

const GrupoAcessosPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState<any>(null);

  const handleEdit = (grupo: any) => {
    setEditingGrupo(grupo);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingGrupo(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGrupo(null);
  };

  const handleSave = (grupoData: any) => {
    // Implementar lógica de salvamento
    console.log('Salvando grupo de acessos:', grupoData);
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <button 
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          ➕ Novo Cargo
        </button>
      </div>
      {/* Lista de grupos de acesso */}
      <GrupoAcessosList onEdit={handleEdit} onCreate={handleCreate} />
      {/* Modal do formulário */}
      <Modal isOpen={showModal} onClose={handleCloseModal}>
        <GrupoAcessosForm grupo={editingGrupo} onSave={handleSave} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default GrupoAcessosPage;