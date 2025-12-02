import React, { useState } from "react";
import CargosList from "./components/CargosList";
import ModalCargosForm from "./components/ModalCargosForm";

const CargosPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreate = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSave = (cargoData: any) => {
    // Implementar lógica de salvamento
    console.log('Salvando cargo:', cargoData);
    setModalOpen(false);
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
      {React.createElement(CargosList as any, {
        onCreate: handleCreate,
      })}
      <ModalCargosForm open={modalOpen} onClose={handleCloseModal} onSave={handleSave} />
    </div>
  );
};

export default CargosPage;