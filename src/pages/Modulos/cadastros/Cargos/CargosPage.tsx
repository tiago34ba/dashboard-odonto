import React, { useState } from "react";
import CargosList from "./components/CargosList";
import ModalCargosForm from "./components/ModalCargosForm";

const CargosPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreate = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSave = (cargoData: any) => {
    console.log('Salvando cargo:', cargoData);
    setRefreshKey((prev) => prev + 1);
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
        refreshKey,
      })}
      <ModalCargosForm open={modalOpen} onClose={handleCloseModal} onSave={handleSave} />
    </div>
  );
};

export default CargosPage;