import React, { useState } from "react";
import AcessosList from "../../../../components/AcessosList";
import AcessosForm from "../../../../components/AcessosForm";

const AcessosPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [editingAcesso, setEditingAcesso] = useState<any>(null);

  const handleEdit = (acesso: any) => {
    setEditingAcesso(acesso);
    setCurrentView('form');
  };

  const handleCreate = () => {
    setEditingAcesso(null);
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setEditingAcesso(null);
    setCurrentView('list');
  };

  const handleSave = (acessoData: any) => {
    // Implementar lógica de salvamento
    console.log('Salvando acesso:', acessoData);
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
              ➕ Novo Acesso
            </button>
          </div>
          {React.createElement(AcessosList as any, {
            onEdit: handleEdit,
            onCreate: handleCreate,
          })}
        </div>
      ) : (
        React.createElement(AcessosForm as any, {
          acesso: editingAcesso,
          onSave: handleSave,
          onCancel: handleBackToList,
        })
      )}
    </div>
  );
};

export default AcessosPage;