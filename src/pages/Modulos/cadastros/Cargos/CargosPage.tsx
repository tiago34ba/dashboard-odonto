import React, { useState } from "react";
import CargosList from "./components/CargosList";
import CargosForm from "./components/CargosForm";

const CargosPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [editingCargo, setEditingCargo] = useState<any>(null);

  const handleEdit = (cargo: any) => {
    setEditingCargo(cargo);
    setCurrentView('form');
  };

  const handleCreate = () => {
    setEditingCargo(null);
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setEditingCargo(null);
    setCurrentView('list');
  };

  const handleSave = (cargoData: any) => {
    // Implementar lógica de salvamento
    console.log('Salvando cargo:', cargoData);
    setCurrentView('list');
  };

  return (
    <div className="p-6">
      {currentView === 'list' ? (
        <div>
          <div className="mb-4">
            <button 
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              ➕ Novo Cargo
            </button>
          </div>
          {React.createElement(CargosList as any, {
            onEdit: handleEdit,
            onCreate: handleCreate,
          })}
        </div>
      ) : (
        React.createElement(CargosForm as any, {
          cargo: editingCargo,
          onSave: handleSave,
          onCancel: handleBackToList,
        })
      )}
    </div>
  );
};

export default CargosPage;